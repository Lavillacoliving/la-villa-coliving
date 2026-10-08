import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addRedirect, addRedirectPair, normalizePath, findRedirectFor, sourceToRegExp } from '../../scripts/redirects.mjs';
import { checkStatic, checkHtml, extractHtmlUrls, extractTextUrls, blogMarkdownOf, auditInternalUrl, redirectIndex } from '../../scripts/check-redirects.mjs';

const base = () => ({
  redirects: [
    { source: '/blog/a-ancien', destination: '/blog/b', permanent: true },
    { source: '/en/blog/a-ancien', destination: '/en/blog/b', permanent: true },
    { source: '/product-page/:slug', destination: '/tarifs', permanent: true },
  ],
  rewrites: [{ source: '/blog/b', destination: '/prerendered/blog-b.html' }],
});

test('normalizePath : slash initial, ni query, ni slash final, URL absolue acceptée', () => {
  assert.equal(normalizePath('blog/x/'), '/blog/x');
  assert.equal(normalizePath('/blog/x?utm=1#h'), '/blog/x');
  assert.equal(normalizePath('https://www.lavillacoliving.com/blog/x'), '/blog/x');
  assert.equal(normalizePath('/'), '/');
  assert.throws(() => normalizePath('   '));
});

test('sourceToRegExp : motifs :slug et :path*', () => {
  assert.ok(sourceToRegExp('/product-page/:slug').test('/product-page/chambre-1'));
  assert.ok(!sourceToRegExp('/product-page/:slug').test('/product-page/a/b'));
  assert.ok(sourceToRegExp('/_api/:path*').test('/_api/a/b/c'));
  assert.ok(findRedirectFor(base(), '/product-page/x'));
  assert.equal(findRedirectFor(base(), '/blog/b'), null);
});

test('addRedirect : ajout simple + avertissement si la source est aussi un rewrite', () => {
  const cfg = base();
  const changes = addRedirect(cfg, '/blog/b', '/blog/c');
  // /blog/b devient source : la paire existante a-ancien → b est retargetée vers c (pas de chaîne)
  assert.deepEqual(cfg.redirects.find((r) => r.source === '/blog/a-ancien').destination, '/blog/c');
  assert.ok(cfg.redirects.some((r) => r.source === '/blog/b' && r.destination === '/blog/c' && r.permanent === true));
  assert.ok(changes.some((c) => c.type === 'retarget' && c.source === '/blog/a-ancien'));
  assert.ok(changes.some((c) => c.type === 'add'));
  assert.ok(changes.some((c) => c.type === 'warn'), 'la source /blog/b est un rewrite → avertissement');
});

test('addRedirect : refuse une chaîne (cible déjà redirigée) et une boucle', () => {
  const cfg = base();
  assert.throws(() => addRedirect(cfg, '/blog/z', '/blog/a-ancien'), /chaîne refusée/);
  assert.throws(() => addRedirect(cfg, '/blog/z', '/blog/z'), /elle-même/);
});

test('addRedirect : idempotent (deuxième appel = unchanged) et mise à jour de destination', () => {
  const cfg = base();
  addRedirect(cfg, '/old', '/new');
  const again = addRedirect(cfg, '/old', '/new');
  assert.ok(again.some((c) => c.type === 'unchanged'));
  const upd = addRedirect(cfg, '/old', '/newer');
  assert.ok(upd.some((c) => c.type === 'update' && c.from === '/new' && c.to === '/newer'));
  assert.equal(cfg.redirects.filter((r) => r.source === '/old').length, 1);
});

test('addRedirectPair : jumeau EN créé, pas de jumeau pour une source /en', () => {
  const cfg = base();
  addRedirectPair(cfg, '/blog/x', '/blog/y');
  assert.ok(cfg.redirects.some((r) => r.source === '/blog/x' && r.destination === '/blog/y'));
  assert.ok(cfg.redirects.some((r) => r.source === '/en/blog/x' && r.destination === '/en/blog/y'));
  const n = cfg.redirects.length;
  addRedirectPair(cfg, '/en/blog/only', '/en/blog/target');
  assert.equal(cfg.redirects.length, n + 1);
});

test('checkStatic : détecte chaîne, doublon, source = rewrite, sitemap redirigé, attendu manquant', () => {
  const cfg = base();
  cfg.redirects.push({ source: '/blog/b', destination: '/blog/c', permanent: true }); // crée une chaîne a-ancien → b → c
  cfg.redirects.push({ source: '/blog/b', destination: '/blog/c', permanent: true }); // doublon
  cfg.redirects.push({ source: '/x', destination: '/y', permanent: false, statusCode: 302 }); // pas permanent
  const sitemap = '<urlset><url><loc>https://www.lavillacoliving.com/blog/a-ancien</loc><xhtml:link rel="alternate" hreflang="en" href="https://www.lavillacoliving.com/en/blog/b"/></url></urlset>';
  const { failures, warnings } = checkStatic(cfg, sitemap, [{ from: '/blog/a-ancien', to: '/blog/c' }, { from: '/absent', to: '/z' }]);
  const text = failures.join('\n');
  assert.match(text, /chaîne : « \/blog\/a-ancien »/);
  assert.match(text, /doublon : source « \/blog\/b »/);
  assert.match(text, /conflit : « \/blog\/b »/);
  assert.match(text, /sitemap : « \/blog\/a-ancien »/);
  assert.match(text, /attendu : « \/blog\/a-ancien » → « \/blog\/b », attendu « \/blog\/c »/);
  assert.match(text, /attendu : « \/absent » n'est pas redirigé/);
  assert.match(text, /politique : « \/x »/);
  assert.equal(warnings.length, 0);
});

test('checkStatic : configuration saine → 0 échec ; statusCode 301 accepté ; slash final = avertissement', () => {
  const cfg = base();
  cfg.redirects.push({ source: '/lp', destination: '/dispo', statusCode: 301 });
  cfg.redirects.push({ source: '/legacy/', destination: '/', permanent: true });
  const { failures, warnings } = checkStatic(cfg, '<urlset><url><loc>https://www.lavillacoliving.com/blog/b</loc></url></urlset>', [{ from: '/blog/a-ancien', to: '/blog/b' }]);
  assert.deepEqual(failures, []);
  assert.equal(warnings.length, 1);
});

// ─── Étape 6 : URL internes du HTML prérendu (audit indexation 07/10/2026) ───

const cfg6 = () => ({
  redirects: [
    { source: '/rates', destination: '/tarifs', permanent: true },
    { source: '/product-page/:slug', destination: '/tarifs', permanent: true },
    { source: '/blog/vivre-a-annemasse-quand-on-travaille-a-gen%C3%A8ve', destination: '/blog/vivre-a-annemasse-quand-on-travaille-a-geneve', permanent: true },
  ],
});
const audit = (raw) => auditInternalUrl(raw, redirectIndex(cfg6()));

test('auditInternalUrl : slash final hors racine, apex, http, source exacte, motif, accent encodé', () => {
  assert.deepEqual(audit('https://www.lavillacoliving.com/en/').reasons, ['slash final (trailingSlash:false → 308)']);
  assert.equal(audit('https://www.lavillacoliving.com/en/').fix, 'https://www.lavillacoliving.com/en');
  assert.match(audit('https://lavillacoliving.com/tarifs').reasons.join(), /apex/);
  assert.match(audit('http://www.lavillacoliving.com/tarifs').reasons.join(), /http/);
  assert.match(audit('/rates').reasons.join(), /source de redirection \(→ \/tarifs\)/);
  assert.equal(audit('/rates/').reasons.length, 2, 'slash final + source de redirection');
  assert.match(audit('/product-page/chambre-1').reasons.join(), /→ \/tarifs/);
  assert.match(audit('/blog/vivre-a-annemasse-quand-on-travaille-a-genève').reasons.join(), /source de redirection/);
});

test('auditInternalUrl : URL saines ou hors périmètre', () => {
  for (const ok of ['/', 'https://www.lavillacoliving.com/', 'https://www.lavillacoliving.com', '/en', '/tarifs',
    '/candidature?src=bloc_offre&amp;article=x', 'https://www.lavillacoliving.com/#organization', '/#faq']) {
    assert.deepEqual(audit(ok)?.reasons, [], ok);
  }
  for (const out of ['https://www.instagram.com/la_villa_coliving_geneva/', 'mailto:hello@lavillacoliving.com',
    'tel:+33600000000', '#top', '/assets/index-abc.js', '/images/x/', 'https://www.lavillacoliving.com/logos/logo-full.png',
    '/observatoire/loyers.csv', 'https://wa.me/33600000000', 'javascript:void(0)', 'chemin-relatif']) {
    assert.equal(audit(out), null, out);
  }
});

test('extractHtmlUrls : href, canonical, hreflang, og:url, JSON-LD item/url/@id/sameAs/mainEntityOfPage — pas les autres scripts', () => {
  const html = `<html><head>
<link rel="canonical" href="https://www.lavillacoliving.com/en/tarifs"/>
<link rel="alternate" hrefLang="fr" href="https://www.lavillacoliving.com/tarifs"/>
<meta property="og:url" content="https://www.lavillacoliving.com/en/tarifs"/>
<script type="application/ld+json">{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":"https://www.lavillacoliving.com/en/"}],"publisher":{"@id":"https://www.lavillacoliving.com/#organization","url":"https://www.lavillacoliving.com"},"sameAs":["https://lavillacoliving.com/x"],"mainEntityOfPage":"https://www.lavillacoliving.com/rates","image":"https://www.lavillacoliving.com/images/a.webp"}</script>
<script>window.__PRERENDER_STATE__={"html":"<a href=\\"/rates\\">x</a>"}</script>
</head><body><a class="x" href="/rates">Tarifs</a><!-- <a href="/rates/">commentaire</a> --></body></html>`;
  const got = extractHtmlUrls(html).map((x) => `${x.kind}=${x.raw}`);
  assert.deepEqual(got.sort(), [
    'JSON-LD @id=https://www.lavillacoliving.com/#organization',
    'JSON-LD item=https://www.lavillacoliving.com/en/',
    'JSON-LD url=https://www.lavillacoliving.com',
    'JSON-LD sameAs=https://lavillacoliving.com/x',
    'JSON-LD mainEntityOfPage=https://www.lavillacoliving.com/rates',
    'canonical=https://www.lavillacoliving.com/en/tarifs',
    'href=/rates',
    'hreflang fr=https://www.lavillacoliving.com/tarifs',
    'og:url=https://www.lavillacoliving.com/en/tarifs',
  ].sort());
});

test('checkHtml : une ligne par URL fautive, avec le nombre de fichiers', () => {
  const bad = '<script type="application/ld+json">{"item":"https://www.lavillacoliving.com/en/"}</script><a href="/tarifs">ok</a>';
  const { failures, counts } = checkHtml(cfg6(), [
    { name: 'en-a.html', html: bad }, { name: 'en-b.html', html: bad }, { name: 'fr.html', html: '<a href="/tarifs">ok</a>' },
  ]);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /« https:\/\/www\.lavillacoliving\.com\/en\/ » \(JSON-LD item\).*2 fichier\(s\)/);
  assert.equal(counts.urls, 5);
  assert.deepEqual(checkHtml(cfg6(), [{ name: 'fr.html', html: '<a href="/tarifs?src=x">ok</a>' }]).failures, []);
});

test('checkHtml : lien écrit dans le markdown des articles = avertissement ; lien de gabarit ou hors article = échec', () => {
  const data = (fr, en = null) => `<script type="application/json" id="__blog_post_data__">${JSON.stringify({ post: { slug: 's', content_fr: fr, content_en: en }, related: [] })}</script>`;
  // Article renommé (308 /rates → /tarifs) encore lié par le corps de deux articles, FR et EN (lien localisé en /en).
  const fr = `<a href="/rates">vieux lien</a>${data('Voir [les tarifs](/rates).')}`;
  const en = `<a href="/en/rates">old link</a>${data('x', 'See [rates](/rates).')}`;
  const cfg = { redirects: [...cfg6().redirects, { source: '/en/rates', destination: '/en/tarifs', permanent: true }] };
  const r1 = checkHtml(cfg, [{ name: 'public/prerendered/blog-a.html', html: fr }, { name: 'public/prerendered/en-blog-a.html', html: en }]);
  assert.deepEqual(r1.failures, []);
  assert.equal(r1.warnings.length, 2);
  assert.match(r1.warnings.join('\n'), /contenu d'article \(non bloquant/);
  // Même href hors markdown (gabarit de la page d'article, ex. bloc d'offre) : échec.
  assert.equal(checkHtml(cfg6(), [{ name: 'blog-a.html', html: `<a href="/rates">x</a>${data('rien')}` }]).failures.length, 1);
  // Classement fichier par fichier : la même URL, en gabarit sur une page hors article, reste un échec (pour ce fichier).
  const mixed = checkHtml(cfg6(), [{ name: 'blog-a.html', html: fr }, { name: 'tarifs.html', html: '<a href="/rates">x</a>' }]);
  assert.equal(mixed.failures.length, 1);
  assert.match(mixed.failures[0], /1 fichier\(s\) : tarifs\.html/);
  assert.equal(mixed.warnings.length, 1);
  // L'index blog.html n'est pas une page d'article ; un slug plus long dans le markdown ne compte pas.
  assert.equal(checkHtml(cfg6(), [{ name: 'blog.html', html: fr }]).failures.length, 1);
  assert.equal(checkHtml(cfg6(), [{ name: 'blog-a.html', html: `<a href="/rates">x</a>${data('[x](/rates-2026)')}` }]).failures.length, 1);
  // Le JSON-LD d'un article reste bloquant, même si l'URL figure dans son markdown.
  const ld = `<script type="application/ld+json">{"item":"https://www.lavillacoliving.com/en/"}</script>${data('[home](https://www.lavillacoliving.com/en/)')}`;
  assert.equal(checkHtml(cfg6(), [{ name: 'en-blog-a.html', html: ld }]).failures.length, 1);
  assert.equal(blogMarkdownOf('<p>pas un article</p>'), null);
});

test('extractTextUrls + checkHtml : llms.txt (URL absolues et liens markdown relatifs) est bloquant', () => {
  const txt = '- [Tarifs](https://www.lavillacoliving.com/rates): prix.\n- [Accueil EN](https://www.lavillacoliving.com/en/)\n- [CSV](https://www.lavillacoliving.com/data/x.csv)\n- [Rel](/tarifs)\nVoir https://www.lavillacoliving.com/tarifs.';
  assert.deepEqual(extractTextUrls(txt).map((x) => x.raw), [
    'https://www.lavillacoliving.com/rates', 'https://www.lavillacoliving.com/en/', 'https://www.lavillacoliving.com/data/x.csv',
    'https://www.lavillacoliving.com/tarifs', '/tarifs',
  ]);
  const { failures, warnings } = checkHtml(cfg6(), [{ name: 'public/llms.txt', urls: extractTextUrls(txt) }]);
  assert.equal(failures.length, 2);
  assert.equal(warnings.length, 0);
});
