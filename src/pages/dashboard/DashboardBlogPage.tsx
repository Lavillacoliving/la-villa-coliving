import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { logAudit } from '@/lib/auditLog';
import { checkBlogSlugChange, isBlogSlugLockedByCode, isValidBlogSlug, normalizeBlogSlug, postsLinkingToSlug } from '@/lib/blogSlug';
import { ENTITY_FACTS_ARTICLES } from '@/data/entityFactsArticles';
import { COLOC_GENEVE_ARTICLE } from '@/lib/siteLinks';

interface BlogPost {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string | null;
  excerpt_fr: string | null;
  excerpt_en: string | null;
  content_fr: string;
  content_en: string | null;
  meta_description_fr: string | null;
  meta_description_en: string | null;
  author: string;
  category: string;
  image_url: string | null;
  read_time_min: number;
  published_at: string | null;
  tags: string[];
  is_published: boolean;
  created_at: string;
  facebook_post_fr: string | null;
  facebook_post_en: string | null;
}

type Tab = 'drafts' | 'published';
type EditTab = 'fr' | 'en' | 'meta';

export default function DashboardBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('drafts');
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [editTab, setEditTab] = useState<EditTab>('fr');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Slug (audit indexation 07/10/2026) : erreur de saisie, et commande de redirection à lancer après un renommage.
  // Rattachés à l'article (id) : ils ne réapparaissent pas sur un autre article ouvert ensuite.
  const [slugMsg, setSlugMsg] = useState<{ id: string; error?: string; command?: string; from?: string; linking?: string[] } | null>(null);
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Auto-open post if ?post_id=xxx in URL (from ntfy button)
  useEffect(() => {
    const postId = searchParams.get('post_id');
    if (postId && posts.length > 0) {
      const found = posts.find(p => p.id === postId);
      if (found) {
        setEditPost(found);
        setTab(found.is_published ? 'published' : 'drafts');
      }
    }
  }, [posts, searchParams]);

  const filtered = posts.filter(p => tab === 'drafts' ? !p.is_published : p.is_published);
  const draftCount = posts.filter(p => !p.is_published).length;
  const publishedCount = posts.filter(p => p.is_published).length;

  const save = async (updates: Partial<BlogPost>): Promise<boolean> => {
    if (!editPost) return false;
    setSaving(true);
    const { error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', editPost.id);
    if (!error) {
      setEditPost({ ...editPost, ...updates });
      // Copie locale tenue à jour tout de suite : commitSlug y lit le dernier slug ENREGISTRÉ.
      setPosts(ps => ps.map(p => (p.id === editPost.id ? { ...p, ...updates } : p)));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      await logAudit('update', 'blog_post', editPost.id, { fields: Object.keys(updates) });
      fetchPosts();
    }
    setSaving(false);
    return !error;
  };

  // Slug figé par le code (fiche entité, maillage, page de décision) : le renommer ici bloquerait le bot de prérendu.
  const isSlugLocked = (post: BlogPost, slug: string) =>
    isBlogSlugLockedByCode(slug, [post.content_fr, post.content_en], [...ENTITY_FACTS_ARTICLES, COLOC_GENEVE_ARTICLE.replace(/^\/blog\//, '')]);

  // Slug : normalisé (sans accents, minuscules, tirets) et validé avant tout enregistrement. Renommer un article
  // PUBLIÉ casse son URL : confirmation obligatoire + commande de redirection affichée (scripts/redirects.mjs), à
  // transmettre à Claude (Jérôme ne manipule pas le repo), avec la liste des articles qui lient encore l'ancienne URL.
  const commitSlug = async () => {
    if (!editPost) return;
    const stored = posts.find(p => p.id === editPost.id) ?? editPost; // dernière version ENREGISTRÉE
    const current = stored.slug;
    const check = checkBlogSlugChange(editPost.slug, current, editPost.is_published, isSlugLocked(stored, current));
    if (check.kind === 'invalid') {
      setSlugMsg({ id: editPost.id, error: `Slug refusé : il faut au moins une lettre ou un chiffre. Slug conservé : ${current}` });
      setEditPost({ ...editPost, slug: current });
      return;
    }
    if (check.kind === 'locked') {
      setSlugMsg({ id: editPost.id, error: `Ce slug est utilisé dans le code du site (fiche entité, maillage ou page de décision) : le changer ici bloquerait le prochain déploiement. Demande le renommage à Claude, qui le fera avec le code. Slug conservé : ${current}` });
      setEditPost({ ...editPost, slug: current });
      return;
    }
    setSlugMsg(null);
    if (check.kind === 'unchanged') {
      if (editPost.slug !== check.slug) setEditPost({ ...editPost, slug: check.slug });
      return;
    }
    const linking = check.redirect === 'none' ? [] : postsLinkingToSlug(posts, current, editPost.id).map(p => p.title_fr || p.slug);
    const linkingText = linking.length
      ? `\n\n${linking.length} autre(s) article(s) lient encore /blog/${current} : ${linking.join(' · ')}. Repointe ensuite ces liens vers /blog/${check.slug}, sinon ils passeront par la redirection.`
      : '';
    const redirectText = check.redirect === 'command'
      ? `Après l'enregistrement, transmets cette commande à Claude (elle restera affichée sous le champ) :\n${check.redirectCommand}`
      : `L'ancien slug n'est pas au format : demande à Claude d'ajouter la redirection depuis « ${current} ».`;
    if (check.redirect !== 'none' && !window.confirm(
      `Cet article est publié. Si tu changes son slug, /blog/${current} et /en/blog/${current} tomberont en 404 au prochain passage du bot de prérendu, sauf si une redirection est ajoutée.\n\n`
      + `Nouveau slug : ${check.slug}\n\n${redirectText}${linkingText}\n\nConfirmer le changement de slug ?`,
    )) {
      setEditPost({ ...editPost, slug: current });
      return;
    }
    if (await save({ slug: check.slug })) {
      if (check.redirect !== 'none') setSlugMsg({ id: editPost.id, command: check.redirectCommand ?? undefined, from: current, linking });
    } else {
      setSlugMsg({ id: editPost.id, error: `Enregistrement refusé (slug « ${check.slug} » déjà utilisé ?). Slug conservé : ${current}` });
      setEditPost({ ...editPost, slug: current });
    }
  };

  const publish = async () => {
    if (!editPost) return;
    // Un brouillon importé (n8n, SQL) peut porter un slug hors format : on le corrige avant de le mettre en ligne.
    const slugFix: Partial<BlogPost> = {};
    if (!isValidBlogSlug(editPost.slug)) {
      const fixed = normalizeBlogSlug(editPost.slug);
      if (!isValidBlogSlug(fixed) || isSlugLocked(editPost, editPost.slug)) {
        setEditTab('meta');
        setSlugMsg({ id: editPost.id, error: isValidBlogSlug(fixed)
          ? `Slug « ${editPost.slug} » hors format et utilisé par le code du site : demande à Claude de le corriger avant de publier.`
          : 'Slug invalide : corrige-le ici avant de publier.' });
        return;
      }
      if (!window.confirm(`Le slug « ${editPost.slug} » n'est pas au bon format. L'article sera publié sous /blog/${fixed}. Continuer ?`)) return;
      slugFix.slug = fixed;
    }
    if (!(await save({ ...slugFix, is_published: true, published_at: new Date().toISOString() }))) return;
    setEditPost(null);
    setTab('published');
  };

  const unpublish = async () => {
    if (!editPost) return;
    await save({ is_published: false });
    setEditPost(null);
    setTab('drafts');
  };

  const deletePost = async () => {
    if (!editPost || !confirm('Supprimer ce brouillon ?')) return;
    await supabase.from('blog_posts').delete().eq('id', editPost.id);
    await logAudit('delete', 'blog_post', editPost.id, { slug: editPost.slug });
    setEditPost(null);
    fetchPosts();
  };

  // ── List view ──
  if (!editPost) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#1a1a2e' }}>Blog</h2>
          <div className="dash-toolbar" style={{ display: 'flex', gap: '4px' }}>
            <TabBtn active={tab === 'drafts'} onClick={() => setTab('drafts')} label={`Brouillons (${draftCount})`} />
            <TabBtn active={tab === 'published'} onClick={() => setTab('published')} label={`Publiés (${publishedCount})`} />
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>Chargement...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
            {tab === 'drafts' ? 'Aucun brouillon en attente' : 'Aucun article publié'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(post => (
              <div
                key={post.id}
                onClick={() => setEditPost(post)}
                style={{
                  background: '#fff', borderRadius: '12px', padding: '16px',
                  cursor: 'pointer', border: '1px solid #eee',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)')}
                onMouseOut={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e', lineHeight: 1.3 }}>
                      {post.title_fr}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                      {post.category} · {post.read_time_min} min · {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '11px', padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap',
                    background: post.is_published ? '#d4edda' : '#fff3cd',
                    color: post.is_published ? '#155724' : '#856404',
                  }}>
                    {post.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Edit view ──
  const previewUrl = `https://www.lavillacoliving.com/blog/${editPost.slug}?preview=lavilla2026`;

  return (
    <div>
      {/* Header with back + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={() => { setEditPost(null); fetchPosts(); }}
          style={{ background: 'none', border: 'none', color: '#b8860b', cursor: 'pointer', fontSize: '14px', padding: '4px 0' }}
        >
          ← Retour
        </button>
        <div className="dash-toolbar" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer"
            style={{ padding: '8px 12px', background: '#f0f0f0', borderRadius: '8px', color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
            👁 Preview
          </a>
          {!editPost.is_published ? (
            <>
              <button onClick={publish} style={{ padding: '8px 14px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                ✓ Publier
              </button>
              <button onClick={deletePost} style={{ padding: '8px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                ✕
              </button>
            </>
          ) : (
            <button onClick={unpublish} style={{ padding: '8px 14px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Dépublier
            </button>
          )}
        </div>
      </div>

      {/* Title editable */}
      <input
        className="dash-fs-keep"
        value={editPost.title_fr}
        onChange={e => setEditPost({ ...editPost, title_fr: e.target.value })}
        onBlur={() => save({ title_fr: editPost.title_fr })}
        style={{ width: '100%', fontSize: '20px', fontWeight: 700, color: '#1a1a2e', border: 'none', borderBottom: '2px solid #eee', padding: '8px 0', marginBottom: '12px', background: 'transparent', boxSizing: 'border-box' }}
      />

      {/* Save indicator */}
      {saved && <p style={{ color: '#28a745', fontSize: '12px', margin: '-8px 0 8px' }}>✓ Enregistré</p>}

      {/* Tabs: FR / EN / Meta */}
      <div className="dash-toolbar" style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        <TabBtn active={editTab === 'fr'} onClick={() => setEditTab('fr')} label="Contenu FR" />
        <TabBtn active={editTab === 'en'} onClick={() => setEditTab('en')} label="Contenu EN" />
        <TabBtn active={editTab === 'meta'} onClick={() => setEditTab('meta')} label="Meta / SEO" />
      </div>

      {/* Content editor */}
      {editTab === 'fr' && (
        <div>
          <label style={labelStyle}>Excerpt FR</label>
          <textarea
            value={editPost.excerpt_fr || ''}
            onChange={e => setEditPost({ ...editPost, excerpt_fr: e.target.value })}
            onBlur={() => save({ excerpt_fr: editPost.excerpt_fr })}
            rows={2}
            style={textareaStyle}
          />
          <label style={labelStyle}>Contenu FR (Markdown)</label>
          <textarea
            value={editPost.content_fr}
            onChange={e => setEditPost({ ...editPost, content_fr: e.target.value })}
            onBlur={() => save({ content_fr: editPost.content_fr })}
            rows={20}
            style={{ ...textareaStyle, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }}
          />
        </div>
      )}

      {editTab === 'en' && (
        <div>
          <label style={labelStyle}>Title EN</label>
          <input
            value={editPost.title_en || ''}
            onChange={e => setEditPost({ ...editPost, title_en: e.target.value })}
            onBlur={() => save({ title_en: editPost.title_en })}
            style={inputStyle}
          />
          <label style={labelStyle}>Excerpt EN</label>
          <textarea
            value={editPost.excerpt_en || ''}
            onChange={e => setEditPost({ ...editPost, excerpt_en: e.target.value })}
            onBlur={() => save({ excerpt_en: editPost.excerpt_en })}
            rows={2}
            style={textareaStyle}
          />
          <label style={labelStyle}>Contenu EN (Markdown)</label>
          <textarea
            value={editPost.content_en || ''}
            onChange={e => setEditPost({ ...editPost, content_en: e.target.value })}
            onBlur={() => save({ content_en: editPost.content_en })}
            rows={20}
            style={{ ...textareaStyle, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }}
          />
        </div>
      )}

      {editTab === 'meta' && (
        <div>
          <label style={labelStyle}>Slug</label>
          <input value={editPost.slug} onChange={e => { setEditPost({ ...editPost, slug: e.target.value }); if (slugMsg?.error) setSlugMsg(null); }} onBlur={commitSlug} style={inputStyle} />
          {normalizeBlogSlug(editPost.slug) !== editPost.slug && (
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>
              Sera enregistré : <code>{normalizeBlogSlug(editPost.slug) || '(vide)'}</code> (minuscules, chiffres et tirets, sans accents)
            </p>
          )}
          {slugMsg?.id === editPost.id && slugMsg.error && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#dc3545' }}>{slugMsg.error}</p>}
          {slugMsg?.id === editPost.id && slugMsg.from && (
            <div style={{ marginTop: '6px', padding: '8px 10px', background: '#fff3cd', borderRadius: '8px', fontSize: '12px', color: '#856404' }}>
              {slugMsg.command ? (
                <>
                  Redirection à faire ajouter par Claude (transmets-lui cette commande) :
                  <code style={{ display: 'block', marginTop: '4px', userSelect: 'all', wordBreak: 'break-all', color: '#1a1a2e' }}>{slugMsg.command}</code>
                </>
              ) : (
                <>Ancien slug hors format : demande à Claude d'ajouter la redirection depuis « {slugMsg.from} ».</>
              )}
              {slugMsg.linking && slugMsg.linking.length > 0 && (
                <div style={{ marginTop: '6px' }}>
                  Articles qui lient encore /blog/{slugMsg.from} (liens à repointer vers /blog/{editPost.slug}) : {slugMsg.linking.join(' · ')}
                </div>
              )}
            </div>
          )}

          <label style={labelStyle}>Catégorie</label>
          <select value={editPost.category} onChange={e => { const v = e.target.value; setEditPost({ ...editPost, category: v }); save({ category: v }); }} style={inputStyle}>
            {['coliving', 'lifestyle', 'tips', 'geneva', 'community'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label style={labelStyle}>Meta Description FR</label>
          <textarea value={editPost.meta_description_fr || ''} onChange={e => setEditPost({ ...editPost, meta_description_fr: e.target.value })} onBlur={() => save({ meta_description_fr: editPost.meta_description_fr })} rows={2} style={textareaStyle} />

          <label style={labelStyle}>Meta Description EN</label>
          <textarea value={editPost.meta_description_en || ''} onChange={e => setEditPost({ ...editPost, meta_description_en: e.target.value })} onBlur={() => save({ meta_description_en: editPost.meta_description_en })} rows={2} style={textareaStyle} />

          <label style={labelStyle}>Image URL</label>
          <input value={editPost.image_url || ''} onChange={e => setEditPost({ ...editPost, image_url: e.target.value })} onBlur={() => save({ image_url: editPost.image_url })} style={inputStyle} />

          <label style={labelStyle}>Tags (séparés par virgule)</label>
          <input value={(editPost.tags || []).join(', ')} onChange={e => setEditPost({ ...editPost, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} onBlur={() => save({ tags: editPost.tags })} style={inputStyle} />

          <label style={labelStyle}>Temps de lecture (min)</label>
          <input type="number" value={editPost.read_time_min} onChange={e => { const v = parseInt(e.target.value) || 0; setEditPost({ ...editPost, read_time_min: v }); }} onBlur={() => save({ read_time_min: editPost.read_time_min })} style={{ ...inputStyle, width: '100px' }} />

          <label style={labelStyle}>Post Facebook FR</label>
          <textarea value={editPost.facebook_post_fr || ''} onChange={e => setEditPost({ ...editPost, facebook_post_fr: e.target.value })} onBlur={() => save({ facebook_post_fr: editPost.facebook_post_fr })} rows={3} style={textareaStyle} />

          <label style={labelStyle}>Post Facebook EN</label>
          <textarea value={editPost.facebook_post_en || ''} onChange={e => setEditPost({ ...editPost, facebook_post_en: e.target.value })} onBlur={() => save({ facebook_post_en: editPost.facebook_post_en })} rows={3} style={textareaStyle} />
        </div>
      )}

      {saving && <p style={{ color: '#b8860b', fontSize: '12px', marginTop: '8px' }}>Enregistrement...</p>}
    </div>
  );
}

// ── Shared styles ──
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '4px', marginTop: '12px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' };

function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer',
        fontSize: '13px', fontWeight: active ? 600 : 400,
        background: active ? '#b8860b' : '#f0f0f0',
        color: active ? '#fff' : '#666',
      }}
    >
      {label}
    </button>
  );
}
