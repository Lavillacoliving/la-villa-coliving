# Google Search Console — Setup Guide

## Statut : À FAIRE (action unique, ~10 minutes)

### Étape 1 : Accéder à GSC
1. Va sur https://search.google.com/search-console
2. Connecte-toi avec le compte Google qui gère lavillacoliving.com

### Étape 2 : Ajouter la propriété
1. Clique "Ajouter une propriété"
2. Choisis **"Propriété de domaine"** (pas "Préfixe d'URL")
3. Entre : `lavillacoliving.com`

### Étape 3 : Vérification DNS (recommandé)
Google va te donner un enregistrement TXT du type :
```
google-site-verification=XXXXXXXXXXXXXXXX
```
1. Va dans Bluehost → DNS → Zone Editor
2. Ajoute un enregistrement TXT :
   - Host : `@` (ou vide)
   - Type : TXT
   - Value : le code fourni par Google
3. Sauvegarde → retourne dans GSC → clique "Vérifier"
4. La propagation DNS peut prendre 24-72h (souvent plus rapide)

### Étape 4 : Soumettre le sitemap
Une fois vérifié :
1. Dans GSC → Sitemaps (menu gauche)
2. Entre : `sitemap.xml`
3. Clique "Envoyer"

### Ce qui est déjà automatisé
- Le sitemap est régénéré automatiquement par le workflow GitHub Actions (78 URLs, FR+EN, blog inclus)
- Google et Bing sont pingés automatiquement après chaque mise à jour du pre-rendering
- Pas besoin de resoumettre le sitemap — Google le re-crawle automatiquement

### Vérifications post-setup (J+7)
- [ ] GSC montre "Sitemap traité" avec le bon nombre d'URLs
- [ ] L'onglet "Couverture" montre les pages indexées
- [ ] Pas d'erreurs 404 ou de pages en "Exclues" de manière inattendue
- [ ] Les pages `/blog/*` commencent à apparaître dans l'index
