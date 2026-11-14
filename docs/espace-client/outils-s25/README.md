# Préversion locale de l'espace client (s25) : outillage

Reconstruit dans le conteneur la préversion décrite dans `../preversion-locale-s24.md` (disparue avec
l'ancien conteneur). **Rien en ligne, rien de déployé.** Le dépôt garde `ESPACE_CLIENT_PUBLIE = false` :
l'interrupteur n'est mis à `true` que dans la copie hors dépôt `/root/marrant-preversion-s25/depot/`.

## Commandes

```bash
bash docs/espace-client/outils-s25/installer.sh   # copie ces scripts dans /root/marrant-preversion-s25/
/root/marrant-preversion-s25/reconstruire.sh      # synchro dépôt -> copie, interrupteur ouvert (copie), build, serveur
/root/marrant-preversion-s25/comptes.sh           # remet les 3 comptes dans leur état (dates relatives au jour courant)
/root/marrant-preversion-s25/comptes.sh --etat    # état des 3 comptes en base (une ligne par compte)
node /root/marrant-preversion-s25/verifier.mjs    # connexion des 3 comptes + 15 pages (captures dans captures/)
/root/marrant-preversion-s25/arreter.sh           # arrête serveur + faux Resend (--tout : aussi Postgres)
/root/marrant-preversion-s25/demarrer.sh          # relance sans rebâtir (après arrêt ou redémarrage)
```

`reconstruire.sh` : `--force` rebâtit même sans changement, `--seed` rejoue schéma + seed. À chaud et
sans changement utile (apps/web, docs/content, docs/copy, prisma, package*.json) : ~1 s ; avec build : ~55 s
(serveur coupé pendant le build). Après `verifier.mjs`, relancer `comptes.sh` : la visite consomme l'annonce
de cap de l'abonné en cours.

## Ports et base

| Quoi | Adresse |
|---|---|
| Site (NEXTAUTH_URL) | http://localhost:5400 |
| Faux Resend (journal `emails.log`) | http://127.0.0.1:5401 |
| Base jetable | Postgres 16 local `main`, base `marrant_preview_s25`, rôle `preversion` |

Environnement vide (`env -i`) pour tout build et serveur : seulement les variables factices du job CI
`e2e-local` (base locale, secret NextAuth factice, Resend factice, prix Stripe factices), plus
`CI=true` et `NEXT_TELEMETRY_DISABLED=1`. Les polices Google sont téléchargées une fois par `polices.sh`
(curl, hors build) et lues au build via le crochet `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` de next/font :
le build ne touche pas le réseau. Le planificateur interne démarre avec le serveur (comme en CI) : sans
aucune clé, ses tâches ne peuvent rien joindre.

## Comptes de TEST (mot de passe `preversion-s24`)

| Compte | État |
|---|---|
| `abonne-en-cours@preversion.test` | Premium depuis 20 jours ; Répartie 1-2 et Machine à café 1-2 validées (250 XP, cap 2, annonce pas vue) ; 4 cartes jouées J-4 à J-1 ; aujourd'hui 1 nouvelle + 1 à revoir ; 1 réplique et « Fait » sur « Coloc : la poêle » ; 1 retour de mission (`conseil-3`, marche 1) ; 3 favoris (2 vannes, 1 conseil) ; 1 question avec réponse de l'équipe non lue |
| `nouvel-abonne@preversion.test` | Premium depuis aujourd'hui, rien fait (carte « Ton premier pas ») |
| `inscrit-gratuit@preversion.test` | Sans abonnement (`/mon-espace/**` et `/favoris` renvoient vers `/abonnement`) |

Paiement non testable (aucune clé Stripe : abonnements posés directement en base). Textes de la
réplique, de la question et de la réponse : factices, marqués « test ».

## Page de test EN LIGNE (`page-de-test.sh`, Worker `marrant-preversion`)

Met à jour https://marrant-preversion.thomas-issa.workers.dev après chaque section validée (demande de
Thomas, s25). Ressources, comptes et suppression : entrée « PRÉVERSION DE TEST s24 » de `REPLIT_ACTIONS.md`.

```bash
bash docs/espace-client/outils-s25/page-de-test.sh             # synchro + build, AUCUN envoi (affiche la config)
bash docs/espace-client/outils-s25/page-de-test.sh --envoyer   # idem + envoi + contrôles (ordre de Thomas)
bash docs/espace-client/outils-s25/page-de-test.sh --controles # contrôles en ligne seuls
```

- **Copie** : `/root/marrant-preversion-en-ligne-s25/` (rsync de l'arbre de travail, y compris le non-commité ;
  sans `.git`, `node_modules`, `.next`, `.open-next`, `.env*`). Polices, journaux, lecture en ligne :
  `/root/marrant-preversion-en-ligne-s25-outils/`. `node_modules` = copie réelle de celui de la préversion
  locale si même `package-lock`, sinon `npm ci` (jamais un lien : bundle faussé, incident s21).
- **Dans la copie seulement** : interrupteur à `true` ; `wrangler.jsonc` régénéré depuis celui du dépôt
  (name `marrant-preversion`, Hyperdrive `47335c15…`, R2 `marrant-preversion-next-cache`, 0 route,
  `triggers.crons = []`, `preview_urls: false`, 9 variables factices relues sur la version en ligne ; toute
  nouvelle clé dans la config du dépôt arrête le script) ; `robots.ts` = `Disallow: /` ; `worker.ts` n'exporte
  plus que `fetch` et pose `X-Robots-Tag: noindex, nofollow` sur toute réponse ; `_headers` : même en-tête sur `/*`.
- **Build** : `build:cf` en `env -i` (variables factices, Hyperdrive factice), base de build = base LOCALE
  jetable `marrant_preview_s25` si joignable (pages prérendues avec les données de test), sinon factice.
  Contrôle du bundle : aucune URL Neon, aucun motif de clé réelle. ~65 s à chaud (~80 s à froid).
- **Comparaison** (lecture seule, API `GET`) : vars, bindings, secrets (noms), crons et compatibilité du
  Worker en ligne contre la config générée.
- **Envoi** (`--envoyer`) : garde juste avant (dossier = copie, `name` = `marrant-preversion`, aucune route,
  0 cron, services, Hyperdrive et R2 attendus), puis `opennextjs-cloudflare deploy` avec `CLOUDFLARE_DM_TOKEN`
  seulement. Les secrets de TEST du Worker ne sont pas touchés. Contrôles : `/login` 200, `X-Robots-Tag` sur
  `/`, `/login`, `/mon-espace`, `robots.txt` = `Disallow: /`, 0 cron, connexion `abonne-en-cours@` puis
  `/mon-espace` 200.
