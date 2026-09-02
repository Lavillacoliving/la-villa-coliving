#!/usr/bin/env bash
# Ignored Build Step Vercel (Lot B — B4, 02/09/2026). Référencé par "ignoreCommand" dans vercel.json.
#
# Convention Vercel : exit 0 = build IGNORÉ, exit 1 = build LANCÉ.
#
# Problème réglé : chaque push touchant src/ déclenchait DEUX déploiements — celui du push
# (bundle neuf servi avec l'ancien HTML prérendu pendant 10 à 15 min → hydratation #418
# garantie sur toute page dont le DOM a changé), puis celui du bot « auto-prerender: ».
# Désormais, en production, seul le commit du bot déploie : bundle et HTML sont cohérents.
# Quand le prérendu ne change pas, prerender.yml pousse un commit vide qui déclenche le déploiement.
#
# Règles (dans l'ordre) :
#   1. Previews (branches, PR) : toujours construire.
#   2. Commit du bot github-actions[bot] : construire (c'est LE déploiement production).
#   3. Message de commit contenant [vercel-deploy] : construire (échappatoire manuelle).
#   4. Commit sans parent lisible : construire (ne jamais bloquer par prudence).
#   5. Le commit ne touche aucun fichier qui déclenche prerender.yml (src/, scripts/, index.html,
#      package.json, vite.config.ts, vercel.json) — ex. photos dans public/ : construire,
#      car aucun run du bot ne suivra.
#   6. Sinon (push source qui déclenche le bot) : ignorer, le bot déploiera.
set -u

if [ "${VERCEL_ENV:-}" != "production" ]; then
  echo "preview → build"; exit 1
fi
if [ "${VERCEL_GIT_COMMIT_AUTHOR_NAME:-}" = "github-actions[bot]" ]; then
  echo "commit du bot prerender → build"; exit 1
fi
if git log -1 --pretty=%B 2>/dev/null | grep -q '\[vercel-deploy\]'; then
  echo "[vercel-deploy] dans le message → build"; exit 1
fi
if ! git rev-parse -q --verify HEAD^ >/dev/null 2>&1; then
  echo "pas de parent lisible → build"; exit 1
fi
git diff --quiet HEAD^ HEAD -- src scripts index.html package.json vite.config.ts vercel.json
rc=$?
if [ "$rc" -eq 1 ]; then
  echo "push source : prerender.yml va régénérer et déployer → build ignoré"; exit 0
fi
echo "aucun fichier déclencheur du bot (rc=$rc) → build"; exit 1
