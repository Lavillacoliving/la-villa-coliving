# CLAUDE.md — la-villa-coliving (site + dashboard + portail)

## Source de savoir obligatoire

La documentation canonique du système (infrastructure, schéma Supabase, conventions) vit dans le repo privé **`Lavillacoliving/lavilla-docs`**, normalement cloné localement dans `../lavilla-docs/`.

**AVANT toute intervention** (code, schéma, infra), lire :
- `../lavilla-docs/Infrastructure_LaVilla.md` — cartographie complète (Vercel, Supabase, n8n, VPS, DNS, backups)
- `../lavilla-docs/Schema_Supabase_LaVilla.md` — schéma de la base ; **checklist §12 obligatoire avant toute modification de schéma**
- `../lavilla-docs/CLAUDE.md` — règles d'usage transverses

Si `../lavilla-docs/` est absent : `git clone git@github.com:Lavillacoliving/lavilla-docs.git ../lavilla-docs`

## Rappels critiques (détail dans lavilla-docs)

- `src/lib/entities.ts` = source unique des IDs/constantes ; slugs de propriétés SANS tirets (`lavilla`, `leloft`, `lelodge`, `montblanc`)
- `logAudit()` obligatoire sur toute action CRUD critique ; design gold `#b8860b` ; bilingue FR/EN
- CI stricte : valider avec `tsc -b` (pas `--noEmit`) avant commit ; build complet local = `npm run build:local`
- `git pull --rebase` avant tout push (le bot prerender committe en parallèle)
- **Push sur `main` = déploiement production immédiat** (Vercel). Jamais sans GO explicite de Jérôme.
- 2 builds Vercel back-to-back après chaque push : le 2ᵉ (commit `auto-prerender:`) fait foi pour le SEO
- Sessions concurrentes : travailler sur des branches `feat/*`, ne jamais éditer un checkout sans vérifier `git status`
