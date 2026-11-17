# Outils de la refonte page par page (s25, à reprendre en s26)

Scripts sauvés du dossier de travail temporaire de la session s25 (il disparaît avec le conteneur). Les chemins absolus `/tmp/claude-0/.../scratchpad/...` écrits dans ces scripts sont à remplacer par `docs/espace-client/outils-s26/` ; les copies de build (`integ/aN-ouvert`) se recréent. Mots de passe et clés : uniquement des valeurs FACTICES de préversion locale. Préversion locale et page de test en ligne : voir `docs/espace-client/outils-s25/README.md`.

| Fichier | Rôle |
|---|---|
| `captures-sections.mjs` | Captures pleine page d'une section : `node captures-sections.mjs <section> <dossier> [base]`, 5 largeurs, sombre, comptes via `COMPTES=visiteur,gratuit,en-cours,nouvel`. |
| `captures-ecran.mjs` | Même chose en « premier écran » (sans pleine page). |
| `tailles.mjs` | **Gate typographique** : tailles et combinaisons de police du premier écran de `main` (`node tailles.mjs <url> <largeur>`), sans connexion. |
| `tailles-comptes.mjs` | Même mesure pour les 4 comptes connectés, 375/768/1280/1920 ; produit le `TAILLES.md` des dossiers de captures. |
| `mesure-vides.mjs` | Mesure des vides au milieu des cartes et des écarts (utilisé aux tours 2 à 13 d'Aujourd'hui). |
| `verif-comptes.sh` | Contrôle EN LIGNE en lecture seule de la page de test (3 comptes, 7 pages, `X-Robots-Tag`). Faux négatif connu sur `/lettre` (apostrophe typographique). |
| `lettres-envoyees.sql` | À rejouer sur `marrant_preview_s25` après `comptes.sh` : 2 lettres marquées envoyées (archive de l'abonné). |
| `a13-e2e.sh`, `a13-pw.sh` | Serveur e2e sur base jetable et lancement des specs Playwright en régime ouvert (dernière version utilisée, tour 13). |
