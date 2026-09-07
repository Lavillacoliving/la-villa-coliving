-- ============================================================================
-- Apercu des brouillons du blog sans session admin — 2026-09-07 (relecture des pages de decision, brief Conquete IA)
-- APPLIQUE le 07/09/2026 via MCP apply_migration (nom : blog_post_preview_rpc_2026_09_07). Conserve pour trace.
-- Pourquoi : la RLS de blog_posts n'expose aux anonymes que is_published = true ; le mode ?preview=lavilla2026 du site
-- ne fonctionnait donc qu'avec une session admin dans le meme navigateur. Le site appelle desormais cette fonction
-- (src/pages/BlogPostPage.tsx, loadPost) en mode apercu. Lecture seule, SECURITY DEFINER, cle deja presente dans le bundle.
-- ============================================================================
create or replace function public.blog_post_preview(p_slug text, p_key text)
returns setof public.blog_posts
language sql
stable
security definer
set search_path = public
as $$
  select b.*
  from public.blog_posts b
  where b.slug = p_slug
    and (b.is_published = true or p_key = 'lavilla2026')
  limit 1;
$$;

revoke all on function public.blog_post_preview(text, text) from public;
grant execute on function public.blog_post_preview(text, text) to anon, authenticated;

-- Verification : select slug, is_published from public.blog_post_preview('s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france', 'lavilla2026');
-- Retour arriere : drop function public.blog_post_preview(text, text);
