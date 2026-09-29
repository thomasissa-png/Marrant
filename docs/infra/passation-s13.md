# Passation s12 → s13 : tests complets puis bascule deviens-marrant.fr

> GO bascule donné par Thomas le 29/09/2026, **conditionné** à ce que tout ce qui suit soit vert.
> À lire aussi : `migration-etat-s12.md` (état), `bascule-checklist.md` (bascule), `cloudflare-env.md` (variables), `cloudflare-runbook.md` (commandes).
> Règles : ne jamais afficher une valeur de secret ; aucun test ne doit toucher de vrais clients, de vrais paiements ni les vrais comptes sociaux.

## 0. État de départ (fin s12)
- Site en ligne : toujours Replit. DNS : zone Cloudflare `d650dd78…` (NS IONOS changés le 29/09), A @ → Replit en DNS only.
- Worker de test : https://marrant.thomas-issa.workers.dev (noindex, `CRON_ENABLED=false`), Hyperdrive `fab86e8a…` → Neon Francfort (copie Replit du 29/09).
- Code : branche `claude/marrant-s10-session-recovery-CtZyw` (migration + passes design/UX s12). Vérifier `git log` : les derniers commits des agents s12 (UI hors périmètre, tirets des articles) doivent y être.
- Prod Replit : modèles IA retirés → plus aucun contenu généré depuis le 15/06 (la bascule corrige).

## 1. Variables (noms seulement, jamais les valeurs)
Vérifier la présence de : `CLOUDFLARE_DM_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `NEON_DATABASE_URL`, `REPLIT_DATABASE_URL`, et toutes les clés de `cloudflare-env.md` §1-3 (dont `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ANTHROPIC_API_KEY`, `CRON_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_*`, `INDEXNOW_KEY`).
- Lister les manquantes à Thomas en une fois. Pour Stripe, repérer si la clé fournie est **test** (`sk_test_`) ou **live** (`sk_live_`) par son préfixe uniquement.
- Les tests §3-§8 se font avec des clés **Stripe test** ; si seule la clé live est présente, demander à Thomas la clé test (Stripe → mode test → Développeurs → Clés API) sous `STRIPE_TEST_SECRET_KEY`.

## 2. Données
- `python3 scripts/infra/copie-replit-neon.py --verify` : attendu 35/35, sauf tables écrites depuis (LlmUsageLog côté Replit, écritures du Worker de test côté Neon). Écarts ailleurs (User, Subscription, Account) = à expliquer avant d'aller plus loin.
- Comptes : `User` = même nombre et même empreinte (md5 de id‖email) des deux côtés, sans afficher d'e-mail.

## 3. Secrets sur le Worker de test
`wrangler secret bulk` avec : vraies valeurs pour `RESEND_API_KEY`, `GOOGLE_*`, `ANTHROPIC_API_KEY` ; clés **Stripe test** ; `NEXTAUTH_URL` et `CRON_ORIGIN` = URL workers.dev. Garder `CRON_ENABLED=false`. Rebuild + redeploy (`build:cf` avec `NEXT_PUBLIC_*` prod, `deploy:cf`).

## 4. Tâches de démarrage
`GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`) sur le Worker de test. Attendu : logs OK, ~250 vannes mises à jour (refonte catalogue), patch tirets des articles en base appliqué, 2e appel = 0 mise à jour (idempotent). Vérifier en base : lignes `DataPatch` créées.

## 5. Comptes et e-mails (Resend)
- Inscription d'un compte de test avec une adresse de test Resend (`delivered+marrant-s13@resend.dev`) : compte créé, redirection vers `/onboarding`, e-mail parti.
- Mot de passe oublié sur ce compte : e-mail de réinitialisation parti, lien valide (le lien pointe vers l'URL workers.dev).
- Contrôle : API Resend `GET /emails` (clé en variable) → statut `delivered` pour ces envois ; expéditeur = `EMAIL_FROM`, domaine deviens-marrant.fr vérifié chez Resend (DKIM `resend._domainkey` et `send.*` présents dans la zone Cloudflare).
- Connexion / déconnexion, `/profil`, favoris (ajout/retrait), progression parcours.
- Admin : connexion avec `ADMIN_PASSWORD` sur `/admin`.
- Supprimer le compte de test à la fin (en base Neon, ligne User + dépendances).

## 6. Connexion Google
Thomas ajoute dans Google Cloud Console (identifiants OAuth du site) l'URI de redirection `https://marrant.thomas-issa.workers.dev/api/auth/callback/google` (à retirer après la bascule ; celle de deviens-marrant.fr existe déjà). Test : connexion Google aboutit, compte `Account` créé.

## 7. Stripe (mode test uniquement)
- Créer via l'API Stripe **test** un endpoint webhook vers `https://marrant.thomas-issa.workers.dev/api/webhooks/stripe` (mêmes événements que l'endpoint prod, à relire dans le code de la route) → poser son `whsec_` en secret sur le Worker de test.
- Parcours complet (Playwright) : compte de test → `/abonnement` → Checkout → carte `4242 4242 4242 4242` → retour `/abonnement/success`. Attendu : webhook 2xx, ligne `Subscription` active, `User.plan = PREMIUM`, contenu premium débloqué (vannes au-delà de 10).
- Annulation / portail client : statut mis à jour par webhook.
- Supprimer l'endpoint webhook de test à la fin.

## 8. IA et crons (sans rien publier)
- Appeler à la main **uniquement** les crons de génération qui n'écrivent qu'en base : `daily-content` (vanne + conseil + vidéo du jour). Attendu : contenu créé, `LlmUsageLog` success, modèles actuels (plus de 404).
- **Interdit en test** (publient ou envoient pour de vrai) : `daily-social`, `publish-social`, `daily-push`, `ceo-tick`, tout envoi CEO/HARO/newsletter.
- Images sociales : génération d'une image dans R2 `marrant-social-images` (route `social/image`), rendu vérifié.

## 9. Visuel mobile + ordinateur
Captures 390 / 768 / 1440 des 64 pages (script s12 : `scratchpad/slice.mjs`, à recréer si absent), 0 erreur console, 0 débordement horizontal, cibles tactiles ≥ 44 px. Comparer avec les rapports @qa/@design de fin s12 (voir §11).

## 10. Bascule
Si §1-§9 verts : suivre `bascule-checklist.md` (copie finale `--reset` + `--verify`, secrets **live** identiques à Replit dont `NEXTAUTH_SECRET` et `STRIPE_WEBHOOK_SECRET`, `CRON_ENABLED=true`, domaines personnalisés, contrôles immédiats, retour arrière prêt). Le webhook Stripe live ne change pas d'URL (deviens-marrant.fr) : vérifier ses premiers événements en 2xx. Le lendemain matin : contenu du jour généré, posts sociaux publiés une seule fois.

## 11. Fin de s12 (à compléter)
- Correctifs UI hors périmètre + arbitrages Thomas (CTA « Créer mon compte gratuit », badge « Populaire » retiré, guillemets « », CGU §2) : _en cours_.
- Tirets cadratins des 34 articles (statique + patch DataPatch pour la base) : _en cours_.
- Vérification @qa (390/768/1440) et relecture @design : _à faire après redéploiement_.
