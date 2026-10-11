# Bascule deviens-marrant.fr : Replit → Cloudflare (étape D)

GO de Thomas donné le 29/09/2026. À exécuter dans une session qui voit les clés de production.
Retour arrière possible à chaque étape (voir fin).

Constats du test s13 (30/09) : `CRON_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY` du Worker alignés sur l'environnement ; la clé Anthropic est lue sous `MARRANT_ANTHROPIC_API_KEY` (le nom `ANTHROPIC_API_KEY` est filtré par la session) et posée sur le Worker sous `ANTHROPIC_API_KEY` ; la clé Resend ne sait qu'envoyer (statut de livraison à lire dans le tableau de bord Resend).

## 0. Prérequis (vérifier, ne rien supposer)
- [ ] Zone Cloudflare `deviens-marrant.fr` (id `d650dd78a6786e01a67d50096137eb53`) au statut **active** (NS IONOS changés le 29/09, délégation `.fr` déjà vue chez Google et Cloudflare).
- [ ] Variables visibles dans la session (noms seulement) : `REPLIT_DATABASE_URL`, `NEON_DATABASE_URL`, `CLOUDFLARE_DM_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` + **toutes les clés de prod** de `docs/infra/cloudflare-env.md` §1-2 (valeurs Replit). Critiques : `NEXTAUTH_SECRET` **identique à Replit** (sinon tous les membres sont déconnectés), `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` **live**, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID/SECRET`, `ANTHROPIC_API_KEY`, `CRON_SECRET`, `ADMIN_PASSWORD`.
- [ ] Variables de build (§3 de cloudflare-env.md) : `NEXT_PUBLIC_*` (Umami, vérifications Google/Bing, profils sociaux), `INDEXNOW_KEY`, `RESEND_API_KEY`.
- [ ] Aucun point bloquant ouvert sur le Worker de test (Stripe test, e-mail, connexion Google testés).

## 1. Dernière copie des données (~2 min)
```bash
python3 scripts/infra/copie-replit-neon.py --reset   # vide la cible puis copie
python3 scripts/infra/copie-replit-neon.py --verify  # doit afficher 35/35 (sauf écritures Replit pendant la copie)
```

## 2. Build + secrets de prod + crons
- `CRON_ENABLED` → `"true"` dans `apps/web/wrangler.jsonc`.
- Secrets : `wrangler secret bulk` avec les valeurs prod ; `NEXTAUTH_URL` et `CRON_ORIGIN` = `https://deviens-marrant.fr`.
- `npm run build:cf` avec les variables de build prod, puis `npm run deploy:cf` (voir `cloudflare-runbook.md`, `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` factice requis).

## 3. Pointer le domaine (minutes)
- Supprimer dans la zone `A @ 34.111.179.208` et `CNAME www` (noter leurs valeurs).
- Ajouter les domaines personnalisés du Worker `marrant` : `deviens-marrant.fr` et `www.deviens-marrant.fr` (www redirigé vers l'apex comme aujourd'hui).
- **Ne pas toucher** MX, SPF, DKIM (IONOS, Resend), DMARC, `replit-verify`, `google-site-verification`.

## 4. Contrôle immédiat
- [ ] Pages : `/`, `/blog`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/login`, 0 erreur console (Chromium).
- [ ] Sitemap : le build d'ici (sans base) le fige sans les articles en base. Juste après `deploy:cf`, supprimer son entrée du cache R2 `marrant-next-cache` (`incremental-cache/<BUILD_ID>/<sha256("/sitemap.xml")>.cache`) puis le recharger : attendu ~1 215 URL (catalogue vannes/conseils/vidéos inclus, s13), pas 60. Les 8 URL de blog de Replit absentes = redirections 308 voulues.
- [ ] Connexion d'un compte existant, inscription, e-mail reçu (mot de passe oublié).
- [ ] Stripe (après le vrai abonnement de Thomas) : webhook `https://deviens-marrant.fr/api/stripe/webhook` en 2xx dans le tableau de bord Stripe.
- [ ] `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`) : logs des tâches de démarrage (~250 vannes mises à jour).
- [ ] `/api/health` : base `up` ; le lendemain matin, contenu du jour généré (les modèles IA de Replit sont retirés depuis juin).
- [ ] En-tête `X-Robots-Tag` **absent** sur deviens-marrant.fr (présent seulement sur *.workers.dev).

## Retour arrière (minutes)
**D'abord réactiver le déploiement Replit** (mis en pause par Thomas le 30/09), sinon le domaine pointerait vers « This app isn't live yet ». Puis : Retirer les domaines personnalisés du Worker, recréer `A @ 34.111.179.208` et `CNAME www → deviens-marrant.fr` en DNS only. Replit n'a pas été modifié. Données écrites sur Cloudflare entre-temps : à reporter à la main si besoin.
