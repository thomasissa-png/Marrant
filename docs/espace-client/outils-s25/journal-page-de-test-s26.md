# Journal de la page de test en ligne (s26)

Page de TEST : https://marrant-preversion.thomas-issa.workers.dev (Worker `marrant-preversion`, workers.dev seulement). Hors production.

## 18/11/2026 : « Aujourd'hui » tour 14 (@infrastructure)

- **Version en ligne** : `4c0c3607-2bc0-4dc8-8291-897e06e3330e` = commit `ce2f5f63` (branche `claude/ouverture-session-nzwj0w`, arbre propre, interrupteur `true` dans la copie seulement, dépôt à `false`). N-1 = `7253ffce-449a-4fe5-b6a9-de5ac5a71802` (16/11).
- **Build à sec** (`page-de-test.sh` sans option) : copie sans `.claude/worktrees` (exclusion déjà dans le rsync, vérifiée), `node_modules` copié depuis la préversion locale (même lock), base de build locale jetable `marrant_preview_s25`, `build:cf` OK en 76 s. Bundle : 0 URL Neon, 0 motif de clé réelle, 0 URL de la base locale.
- **Config générée** : name `marrant-preversion`, 0 route, `crons = []`, Hyperdrive `47335c15…`, R2 `marrant-preversion-next-cache`, `preview_urls: false`. Comparée en lecture seule au Worker en ligne : vars et bindings identiques (13), compatibilité identique (`2026-09-25`, `nodejs_compat,global_fetch_strictly_public`), 0 cron des deux côtés, 4 secrets de TEST non touchés (`ADMIN_PASSWORD`, `CRON_SECRET`, `NEXTAUTH_SECRET`, `UNSUBSCRIBE_HMAC_SECRET`). Aucun écart.
- **Envoi** (`--envoyer`) : 34 fichiers envoyés (130 déjà présents), démarrage du Worker en 24 ms, contrôles intégrés tous OK.
- **Contrôles** (`--controles`, code de sortie 0) : `/login` 200 ; `X-Robots-Tag: noindex, nofollow` sur `/`, `/login` et `/mon-espace` ; `robots.txt` = `Disallow: /` ; 0 cron (`schedules: []`) ; connexion `abonne-en-cours@` puis `/mon-espace` 200.
- **Comptes** (`outils-s26/verif-comptes.sh`, code de sortie 0) : 3 comptes connectés (POST 200, session ouverte). `/mon-espace`, `/mon-espace/s-entrainer`, `/parcours`, `/favoris`, `/profil`, `/lettre` et `/carnet` en 200 avec la bande et `X-Robots-Tag` (21 sur 21). `/lettre` : « 0 carte(s), état vide : non » sur les 3 comptes = faux négatif connu du script.
- **Production non touchée** (lecture seule) : Worker `marrant` toujours en `5504e970` (08/11), ses 2 crons (`0 1 * * *`, `*/15 * * * *`) inchangés.
- **Disque** : `.next` (641 Mo) et `.open-next` (169 Mo) supprimés de la copie ; dossier et `node_modules` gardés (copie : 2,0 Go). Seule copie de build : `/root/marrant-preversion-en-ligne-s25/`.
- **À noter** : `verif-comptes.sh` écrit ses pages HTML dans `docs/espace-client/outils-s26/verif/`, donc dans le dépôt (dossier non suivi). Déplacées hors dépôt (scratchpad de la session) pour garder l'arbre propre. À corriger : les écrire hors dépôt, ou ajouter `verif/` au `.gitignore`.

## 18/11/2026 (2e envoi) : « Aujourd'hui » tour 14 + Quoi répondre, Bibliothèque, S'entraîner tour 3 (@infrastructure)

- **Version en ligne** : `cf107f0f-f8d9-4ae7-a83b-ee9053159455` (déployée à 13:08 UTC). N-1 = `4c0c3607-2bc0-4dc8-8291-897e06e3330e` (18/11, 1er envoi).
- **Code envoyé** = commit `eb64a1d8`. Arbre propre, interrupteur `true` dans la copie seulement, dépôt à `false`. Entre le build à sec et l'envoi, un autre agent a commité `7de50a4d` (6 relectures tour 3 en `docs/*/relectures/`, rien d'autre) : la copie envoyée part donc de `7de50a4d`, mais avec un code identique à `eb64a1d8`.
- **Build à sec** (`page-de-test.sh` sans option) : `node_modules` copié depuis la préversion locale (même lock), base de build locale jetable `marrant_preview_s25`, `build:cf` OK en 83 s. Bundle : 0 URL Neon, 0 motif de clé réelle, 0 URL de la base locale.
- **Config générée** : name `marrant-preversion`, 0 route, `crons = []`, Hyperdrive `47335c15…`, R2 `marrant-preversion-next-cache`, `preview_urls: false`. Comparée en lecture seule au Worker en ligne : vars et bindings identiques (13), compatibilité identique (`2026-09-25`, `nodejs_compat,global_fetch_strictly_public`), 0 cron des deux côtés, 4 secrets de TEST non touchés (`ADMIN_PASSWORD`, `CRON_SECRET`, `NEXTAUTH_SECRET`, `UNSUBSCRIBE_HMAC_SECRET`). Aucun écart.
- **Envoi** (`--envoyer`) : nouveau build (56 s, bundle propre), comparaison sans écart, garde de configuration passée, 42 fichiers envoyés (123 déjà présents), démarrage du Worker en 20 ms, contrôles intégrés tous OK.
- **Contrôles** (`--controles`, code de sortie 0) : `/login` 200 ; `X-Robots-Tag: noindex, nofollow` sur `/`, `/login` et `/mon-espace` ; `robots.txt` = `Disallow: /` ; 0 cron (`schedules: []`) ; connexion `abonne-en-cours@` puis `/mon-espace` 200.
- **Comptes** (`outils-s26/verif-comptes.sh`, code de sortie 0, écrit hors dépôt, arbre resté propre) : 3 comptes connectés (POST 200, session ouverte). `/mon-espace`, `/mon-espace/s-entrainer`, `/parcours`, `/favoris`, `/profil`, `/lettre` et `/carnet` en 200 avec la bande et `X-Robots-Tag` (21 sur 21). `/lettre` : « 0 carte(s), état vide : non » sur les 3 comptes = faux négatif connu du script.
- **Visiteur (non connecté, lecture seule)** : `/mon-espace/quoi-repondre`, `/mon-espace/bibliotheque`, `/mon-espace/s-entrainer` en HTTP 200 avec `X-Robots-Tag: noindex, nofollow` (3 sur 3).
- **Production non touchée** (lecture seule, API `GET`) : Worker `marrant` toujours en `5504e970-5c1d-496d-a90a-3eaaf0db9846` à 100 % (déploiement du 08/11, le plus récent sur 10), 2 crons (`0 1 * * *`, `*/15 * * * *`) inchangés.
- **Disque** : `.next` (699 Mo) et `.open-next` (169 Mo) supprimés de la copie ; dossier et `node_modules` gardés (copie : 2,0 Go).

## 18/11/2026 (3e envoi) : encarts Premium refaits, titre blanc, grille 8/4, Favoris et Carnet refaits (@infrastructure)

- **Version en ligne** : `a0a7eed7-46b9-4556-80c2-528cedd97a3a` (déployée à 19:24 UTC). N-1 = `cf107f0f-f8d9-4ae7-a83b-ee9053159455` (18/11, 2e envoi).
- **Code envoyé** = commit `b63e16a3`. Arbre propre, interrupteur `true` dans la copie seulement, dépôt à `false`. Entre le build à sec et l'envoi, d'autres agents ont commité `d6b0f608` et `a5c45de1` (3 relectures tour 2 en `docs/*/relectures/`, rien d'autre) : la copie envoyée part donc de `a5c45de1`, avec un code identique à `b63e16a3`.
- **Build à sec** (`page-de-test.sh` sans option) : `node_modules` gardé (même lock), base de build locale jetable `marrant_preview_s25`, `build:cf` OK en 114 s. Bundle : 0 URL Neon, 0 motif de clé réelle, 0 URL de la base locale.
- **Config générée** : name `marrant-preversion`, 0 route, `crons = []`, Hyperdrive `47335c15…`, R2 `marrant-preversion-next-cache`, `preview_urls: false`. Comparée en lecture seule au Worker en ligne : vars et bindings identiques (13), compatibilité identique (`2026-09-25`, `nodejs_compat,global_fetch_strictly_public`), 0 cron des deux côtés, 4 secrets de TEST non touchés (`ADMIN_PASSWORD`, `CRON_SECRET`, `NEXTAUTH_SECRET`, `UNSUBSCRIBE_HMAC_SECRET`). Aucun écart.
- **Envoi** (`--envoyer`, code de sortie 0) : nouveau build (72 s, bundle propre), comparaison sans écart, garde de configuration passée, 34 fichiers envoyés (131 déjà présents), démarrage du Worker en 38 ms, contrôles intégrés tous OK.
- **Contrôles** (`--controles`, code de sortie 0) : `/login` 200 ; `X-Robots-Tag: noindex, nofollow` sur `/`, `/login` et `/mon-espace` ; `robots.txt` = `Disallow: /` ; 0 cron (`schedules: []`) ; connexion `abonne-en-cours@` puis `/mon-espace` 200.
- **Comptes** (`outils-s26/verif-comptes.sh`, code de sortie 0, écrit hors dépôt, arbre resté propre) : 3 comptes connectés (POST 200, session ouverte). `/mon-espace`, `/mon-espace/s-entrainer`, `/parcours`, `/favoris`, `/profil`, `/lettre` et `/carnet` en 200 avec la bande et `X-Robots-Tag` (21 sur 21). `/lettre` : « 0 carte(s), état vide : non » sur les 3 comptes = faux négatif connu du script.
- **Visiteur (non connecté, lecture seule)** : `/favoris`, `/carnet`, `/mon-espace/quoi-repondre` en HTTP 200 (sans redirection) avec `X-Robots-Tag: noindex, nofollow` (3 sur 3).
- **Production non touchée** (lecture seule, API `GET`) : Worker `marrant` toujours en `5504e970-5c1d-496d-a90a-3eaaf0db9846` à 100 % (déploiement du 08/11, le plus récent sur 10), 2 crons (`0 1 * * *`, `*/15 * * * *`) inchangés.
- **Disque** : `.next` (704 Mo) et `.open-next` (169 Mo) supprimés de la copie ; dossier et `node_modules` gardés (copie : 2,0 Go).
