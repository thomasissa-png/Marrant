# QA des blocs d'appel s21 : rien de cassé, tout s'affiche comme prévu ?

> @qa, session 21, 18/10/2026. Branche testée : `claude/marrant-s21-integration` @ `c9a56c1` (worktree `agent-a6072b0ac19da7774`, `git pull` : déjà à jour).
> Captures : `docs/qa/captures-s21/qa-cta/` (pages entières en JPEG, blocs en PNG). Marquage : **[LIVE]** = Chromium réel sur le build de production local, sortie observée ; **[STATIQUE]** = lecture du code, Grep ou Jest sans navigateur.
> Référence : `docs/copy/cta-s21/textes-finaux-valides.md` (recopiée à la main dans le script de QA, jamais importée du code : on compare le site au document, pas le code à lui-même).

## Verdict

**Aucun bloquant. 2 majeurs, 7 mineurs.** Les 18 blocs sont présents, au bon endroit, avec le texte exact du document validé, pour le visiteur, aux 4 largeurs (360, 375, 768, 1280) : 432 chaînes vérifiées sur les pages et 52 contrôles de parcours (fenêtre, quiz, fin d'étape 1), aucune manquante. Aucun débordement horizontal ; jamais deux boutons pleins dans le même écran, sauf sur la fiche vanne à 768 et 1280 px (m7). Tout le reste du site tient : 260 adresses du sitemap en 200, lettre (inscription, confirmation, désinscription dans un vrai navigateur), carnet, légales, profil, 404, llms.txt.

Les deux majeurs ne cassent rien pour le lecteur, mais :
- **M1** : la mesure par source, ajoutée par ce chantier, ne marche pas pour les visiteurs : `checkout-ouvert` et `checkout-echec` partent toujours avec `src=abonnement`, quelle que soit la porte d'entrée. Le bilan du 10/11 ne pourrait pas dire quel bloc a fait payer.
- **M2 (préexistant, pas une régression)** : un abonné Premium voit la carte « Active mon accès · 2,99 €/mois » sur l'accueil, et un clic sur un cœur (accueil, /vannes) lui ouvre la fenêtre « Je m'abonne et je la garde » au lieu d'ajouter le favori.

Chemins relatifs à `apps/web/src/`.

| # | Gravité | Point | Défaut | Fichier : ligne |
|---|---|---|---|---|
| M1 | **Majeur** | 2 | `src` perdu entre /register et le paiement : `checkout-ouvert {src: "abonnement"}` pour tout visiteur | `components/premium/premium-modal.tsx:93`, `components/premium/abonnement-view.tsx:151` et `:172` |
| M2 | **Majeur (préexistant)** | 1, 3 | Abonné traité en non-abonné par la carte Premium d'accueil et les cœurs (store jamais rempli) | `components/home/premium-cta.tsx:72`, `components/ui/favorite-button.tsx:27`, `stores/user-store.ts` |
| m1 | Mineur | 1 | Compte sans abonnement : B4+B5 et /abonnement gardent « Active mon accès · 2,99 €/mois » et « Active ton accès pour commencer » au lieu des textes validés | `components/home/premium-cta.tsx:121`, `components/premium/abonnement-view.tsx:161-163` et `:296` |
| m2 | Mineur | 1 | B2 : titre `[S8]` sur 3 lignes à 360 et 375 px (le document demande 2 à 360) ; bloc de fin à 618 px de haut à 360 | `components/blog/article-cta.tsx:77` |
| m3 | Mineur | 5 | +29 à 32 Ko de JS transférés sur les 3 pages ; accueil à 159 Ko de First Load JS (budget 150) ; LCP article +350 ms (médiane) | build : `/` 149 → 159 Ko, `/quiz-humour` 116 → 139 Ko |
| m4 | Mineur | tests | 4 tests Jest échouent dès que `STRIPE_PREMIUM_ANNUAL_PRICE_ID` ou `NEXTAUTH_URL` est posé (CI verte car le job `test` ne les pose pas) | `__tests__/feature/abonnement-page.test.tsx:183`, `blog-encarts-s20.test.tsx`, `blog-article-cta-position.test.tsx`, `__tests__/lib/juridique-lot-g.test.ts` |
| m5 | Mineur | 2 | Contour du mur de liste (B7) mesuré `src=fiche` : on ne distingue pas un clic du mur d'un clic de fiche | `components/premium/mur-liste.tsx:74` |
| m6 | Mineur | 1 | Abonné : le résultat du quiz d'humour (B12) lui propose « Ouvrir {P} en entier · 2,99 €/mois » et la ligne de prix | `components/quiz/viral-quiz.tsx:118-125` |
| m7 | Mineur | 1 | Fiche vanne à 768 et 1280 px : « Partager » (violet plein, préexistant) et le plein B8 dans le même écran | `components/vannes/vanne-share-row.tsx:78` |

Note globale : **8/10**. Le rendu est au niveau (10/10 sur les textes visiteur) ; la note perd 2 points pour M1, qui vide de son sens la mesure livrée par ce même chantier, et pour M2, que ce chantier rend plus visible (carte Premium refaite, fenêtre réécrite).

## Conditions du test

- **Environnement vide (P0).** Chaque build, serveur, Jest et Playwright lancé par `env -i` avec seulement les variables factices du job `e2e-local` de `.github/workflows/tests.yml` : `NEXTAUTH_SECRET=secret-factice-e2e-local`, `RESEND_API_KEY=re_factice_e2e`, `STRIPE_PREMIUM_PRICE_ID=price_e2e_local_mensuel`, `STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_e2e_local_annuel` (l'annuel est donc proposé, comme en production), `ANTHROPIC_API_KEY=dummy`. **Aucune clé Stripe, Resend ni Umami réelle**, aucun e-mail envoyé, aucun paiement, aucune connexion à la production ni à Neon. Jest en plus avec l'environnement exact du job `test`.
- **Build de production local** (`npm run build`, puis `node .next/standalone/server.js`, port 5310), base PostgreSQL 16 jetable (`/var/lib/postgresql/qa-cta`, port 5497, seed du dépôt : 80 vannes, 38 conseils, 89 vidéos, 5 parcours). Supprimée à la fin.
- **Référence « avant » pour la performance** : le commit en ligne `75a809b` (version Cloudflare `5ea46dd8`) extrait par `git archive`, construit de la même façon (port 5320, base séparée).
- **Trois profils** : visiteur ; compte sans abonnement (`plan = FREE`) ; abonné (`plan = PREMIUM`), comptes créés sur la base jetable et connectés par le formulaire de `/login`. **Quatre largeurs** : 360×812, 375×812 (mobile tactile), 768×812, 1280×900.
- **Umami mocké** : le build local n'a pas `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, donc pas de script ; on injecte un faux `window.umami.track` qui remonte chaque événement au script de test (et un écouteur pour les attributs `data-umami-event`). **Stripe mocké** : `POST /api/stripe/checkout` intercepté (réponse `{url: "https://checkout.stripe.com/c/pay/cs_test_qa"}`, ou 500 pour le cas d'échec), page Stripe simulée ; `POST /api/user/subscription/portal` intercepté de même pour la résiliation. C'est aussi ce que fait la CI (pas de clé Stripe de test dans `e2e-local` ; le projet `achat` est manuel).
- Scripts de QA hors dépôt (dossier de travail), sorties JSON relues une à une ; les captures sont dans le dépôt.
- **Artefacts de l'environnement local, pas des défauts** : `/_next/image` en 500 sur les miniatures YouTube (pas d'accès sortant), `/api/health` en 503 (pas de secrets).

### Suites existantes, rejouées sur ce build [LIVE]

| Suite | Résultat |
|---|---|
| Playwright `local` (lettre de bout en bout, en-tête 6 largeurs × 3 états, blocs partie A) | **22 / 22** |
| Playwright `smoke` (desktop 1440 + iPhone 13, dont `@s21`), contre le build local | **128 réussis, 0 échec**, 2 ignorés (achat, voulu) |
| Jest, environnement `e2e-local` (annuel posé) | 328 suites : 5 020 tests réussis, **4 échoués**, 5 ignorés ; les 4 échecs viennent de l'environnement (m4) |
| Les 4 suites en échec, rejouées avec l'environnement exact du job `test` | **65 / 65 réussis** : la CI reste verte |
| `tsc --noEmit` (complet), `tsc -p tsconfig.build.json`, `tsc -p playwright/tsconfig.json`, `next lint` | 0 erreur (avertissements `<img>` préexistants) |

## 1. Blocs B1 à B18 : PASS visiteur, FAIL partiel compte et abonné (note 8/10) [LIVE]

**Méthode.** Pour chaque page, profil et largeur : texte rendu (`innerText`, espaces insécables et apostrophes normalisés, casse ignorée à cause des surtitres en `uppercase`) comparé à chaque chaîne du document validé, variables résolues avec les valeurs du jour (5 parcours, annuel proposé) ; puis balayage de la page écran par écran pour compter les boutons pleins (fond violet `rgb(124, 58, 237)`, hors en-tête et pied de page) et contrôle pair à pair « deux pleins tiennent-ils dans une même fenêtre ? » ; puis largeur de défilement contre largeur de fenêtre (débordement). Fenêtre, quiz, quiz d'orientation et fin d'étape 1 joués par clics réels.

### Visiteur : 18/18 PASS aux 4 largeurs

| Bloc | Où (vérifié) | Texte exact | Un plein par écran | Débordement | Captures |
|---|---|---|---|---|---|
| B1 démonstration | milieu de `/blog/meilleures-blagues-droles-2026`, un seul encart | OK | OK | non | `bloc-B1-visiteur-360.png`, `-1280.png` |
| B2 bloc de fin | après le corps, avant lettre, articles liés, FAQ (ordre vérifié par `blocs-appel-s21-a.spec.ts`) | OK | OK | non | `bloc-B2-visiteur-360.png` (voir m2) |
| B3 haut d'accueil | sous le paragraphe d'accueil | OK (`OUVRIR_ACCUEIL` avec « de la coloc à l'afterwork ») | OK | non | `bloc-B3-visiteur-360.png` |
| B4 + B5 carte Premium | `#offres`, liste `<ul>` de 5 parcours dans l'ordre demandé | OK | OK (plein et contour dans le même écran, voulu : un seul plein) | non | `bloc-B4B5-visiteur-360.png` |
| B6 en-tête | toutes pages sauf `/abonnement` et `/register` (masqué, voulu) ; nom accessible « 2,99 € par mois : voir l'offre Premium » | OK | exempté | non (« 2,99 €/mois » sur une ligne à 360) | `bloc-B6-visiteur-360.png` |
| B7 murs | bas de `/vannes`, `/conseils`, `/videos`, après les 10 / 3 / 3 premiers | OK (LP-A, contour gabarit a) | OK | non | `bloc-B7-*-visiteur-360.png` |
| B8 fiche vanne | sous la vanne | OK (LP-A2 ; contour « …étape 1 de Répartie ») | OK à 360 et 375 ; **m7** à 768 et 1280 (« Partager » plein dans le même écran) | non | `bloc-B8-visiteur-360.png` |
| B9 fiche conseil | sous le conseil | OK (contour « …étape 1 de Répartie ») | OK | non | `bloc-B9-visiteur-360.png` |
| B10 fiche vidéo | sous la vidéo | OK (« de la coloc à l'afterwork » présent ; contour « …étape 1 de Confiance », parcours de la catégorie) | OK | non | `bloc-B10-visiteur-360.png` |
| B11 fenêtre | 7 gestes : 3 cœurs (accueil), vote (accueil), 3 cartes floutées | OK (titre, intro avec `{OBJET}`, `[S27]`, bouton, lien `[S28]`, garantie) | un seul plein | non | `B11-*-visiteur-{360,375,768,1280}.jpg` |
| B12 quiz d'humour | résultat, les 5 profils | OK (phrase, bouton, lien `OUVRIR_P`, phrase de profil, `LP_B12_A`, garantie), dont L'Absurde en deux phrases et Storyteller | OK | non | `B12-*-visiteur-*.jpg`, `bloc-B12-ABSURDE-ligne-premium-visiteur-375.png` |
| B14 fin d'étape 1 | `/parcours/repartie` après les questions du quiz de l'étape | OK (phrase, bouton, LP-A) | OK | non | `B14-visiteur-*.png` |
| B15 /parcours | 5 cartes, un plein par carte (exception déclarée) | OK (10 chaînes) | OK | non | `parcours-visiteur-*.jpg` |
| B16 /abonnement | 6 variantes (`returnTo` absent, Répartie, Machine à Café, Boulot, Confiance, Storytelling) | OK ; le bouton passe à « … · 24,99 €/an » quand on coche Annuel, sans rechargement | OK | non (« Ouvrir Machine à Café et les 4 autres · 2,99 €/mois » sur 2 lignes, accepté) | `bloc-B16-*-visiteur-*.png`, `abonnement-*-visiteur-*.jpg` |
| B17 /register | | OK (prénom facultatif, bouton, lien « …parcours Confiance… » qui suit le `returnTo`) | OK | non | `bloc-B17-visiteur-360.png` |
| B18 lettre dans l'article | formulaire complet sous le bloc de fin (ligne repliée non posée, décision en attente, voir REPLIT_ACTIONS) | OK | contour, pas de plein | non | `article-visiteur-*.jpg` |
| B13 | réservé aux comptes connectés : voir plus bas | | | | |

Chiffres : 432 chaînes attendues sur les pages, toutes présentes aux 4 largeurs, plus 52 contrôles de parcours (B11 ×7, B12 ×5, B14) tous OK. Seul écart relevé par le script : l'en-tête de carte B4+B5, écrit « Premium · 2,99 €/mois » dans le document, est rendu en deux lignes (« Premium », puis « 2,99 € » en gros et « /mois »). C'est une forme, déjà annoncée dans REPLIT_ACTIONS (« 2,99 € /mois en tête de carte »), pas un texte faux : **conforme**.

**Contrôle pair à pair des pleins** (visiteur et compte, 4 largeurs, 16 pages, `/parcours` exclu car exception déclarée) : un seul cas. **m7 (Mineur)** : sur une fiche vanne, à 768 et 1280 px, le bouton « Partager », violet plein (`components/vannes/vanne-share-row.tsx:78`, préexistant), et le plein B8 « Écrire la mienne avec Premium » tiennent dans la même fenêtre (606 px d'écart). À 360 et 375, ils ne sont jamais ensemble. Piste : « Partager » en contour (`outline-accent`), comme toute action secondaire.

**Lecture visuelle** (captures relues) : rien de tronqué, aucun chevauchement, boutons pleins entiers. B12 L'Absurde à 375 : la phrase de profil est bien sur sa propre ligne, en graisse 500, au-dessus de la ligne de prix (`bloc-B12-ABSURDE-ligne-premium-visiteur-375.png`).

**m2, B2 à 360 et 375 (Mineur).** Le titre « La vanne qui sort de ta bouche, pas de ton téléphone » tient sur **3 lignes** à 360 et à 375 (20 px, `font-display`), 1 ligne à 768 et 1280. Le document demande : « vérifier qu'il tient sur 2 lignes à 360 px ». Hauteur du bloc de fin : 618 px à 360, 582 à 375 (plafond du test : 600 à 375 ; budget initial @design : 560). Fichier : `apps/web/src/components/blog/article-cta.tsx:77`. Piste (pour @design / @fullstack) : `text-lg` sous 640 px ou `[text-wrap:balance]`. Preuve : `bloc-B2-visiteur-360.png`.

### Compte sans abonnement : 17 blocs PASS, B4+B5 et B16 FAIL (m1)

- B1, B2, B7 à B12, B14, B15, B18 : identiques au visiteur, aux 4 largeurs, aucun écart. B6 : masqué pour un compte connecté (l'en-tête affiche le menu du compte), comme avant.
- **B13 quiz d'orientation : PASS.** Trois paragraphes (`<p>`) + ligne de garantie, bouton « Ouvrir {P} en entier · 2,99 €/mois ». Textes exacts vérifiés pour **Répartie, Machine à Café, Confiance et Boulot** (`B13-*-gratuit-375.png`). **Storytelling : [STATIQUE UNIQUEMENT]**, aucune réponse au quiz d'orientation ne le conseille (`lib/parcours-orientation.ts` ne le recommande jamais) ; son texte n'est vérifié que par Jest. Clic réel sur le bouton : paiement ouvert (Stripe mocké), corps `{"returnTo":"/parcours/repartie"}`, `checkout-ouvert {src: "onboarding", formule: "mensuel"}`.
- B3 : non affiché au compte connecté (l'accueil connecté garde son haut « Explorer les vannes / Voir les conseils »), comme avant le chantier. Acceptable : B3 vise le visiteur froid.
- **m1 (Mineur) : textes non validés pour le compte connecté.**
  - Accueil, carte B4+B5 : le plein dit **« Active mon accès · 2,99 €/mois »** (`components/home/premium-cta.tsx:121`) au lieu de `OUVRIR` (« Ouvrir les 5 parcours · 2,99 €/mois »).
  - `/abonnement` : surtitre « Plus qu'une étape », titre **« Active ton accès pour commencer »**, bouton **« Active mon accès · 2,99 €/mois »** (`components/premium/abonnement-view.tsx:158-163` et `:296`), quel que soit le parcours d'origine. Le commentaire l. 159 dit que B16 est volontairement réservé au visiteur.
  - Le document validé ne distingue pas visiteur et compte pour B4+B5 et B16 ; le libellé « Active mon accès » fait partie des libellés rouverts le 18/10. **À arbitrer** (@product-manager / Thomas) : soit le compte connecté garde ce libellé (et on l'écrit dans le document), soit il reçoit les textes validés. Ces comptes (créés sans paiement) sont justement la cible la plus chaude.
  - Preuve : `out` du script, `accueil-gratuit-375.jpg`, `abonnement-*-gratuit-375.jpg`.

### Abonné : les blocs disparaissent, sauf trois endroits

- Disparus comme prévu : B1, B2, B18 (article sans aucun prix), B7 (listes complètes), B8 à B10 (remplacés par l'exercice « À toi de jouer »), B13, B14, B15 (boutons « Continuer »), B16 (`/abonnement` redirige vers `/vannes`).
- **M2 (Majeur, préexistant) : l'abonné est vu comme non abonné par deux composants.** `PremiumCta` (`components/home/premium-cta.tsx:72`) et `FavoriteButton` (`components/ui/favorite-button.tsx:27`) lisent `useUserStore().user?.plan`, mais ce store n'est rempli que par `fetchUser()` dans `components/profil/profil-dashboard.tsx:93` et `components/profil/upgrade-toast.tsx:14`. Au chargement de l'accueil ou de `/vannes`, `user` vaut `null`. Conséquences observées [LIVE], compte `PREMIUM` connecté, 375 px :
  - l'accueil montre toute la carte B4+B5 avec « Active mon accès · 2,99 €/mois » (`abonne-accueil-carte-premium-375.png`) ;
  - un clic sur un cœur (accueil, `/vannes`) ouvre la fenêtre B11 « Garde-la pour le soir où tu en auras besoin… Je m'abonne et je la garde » (`abonne-coeur-accueil-375.jpg`, `abonne-coeur-vannes-375.jpg`) : **un abonné ne peut pas ajouter un favori depuis ces listes**, alors que les favoris sont vendus dans Premium.
  - Même code sur la version en ligne (`75a809b`) : ce n'est pas une régression du chantier, mais le chantier rend le défaut plus voyant (carte refaite, fenêtre réécrite). Correction proposée (non codée) : lire `session.user.plan` (`useSession`), comme les murs, ou appeler `fetchUser()` au montage dans un fournisseur commun.
- **m6 (Mineur, préexistant en partie)** : le résultat du quiz d'humour (B12) montre à l'abonné le lien « Ouvrir {P} en entier · 2,99 €/mois » et la ligne de prix (`components/quiz/viral-quiz.tsx:118-125`, aucune lecture de la session). Le lien mène à `/abonnement`, qui le renvoie sur `/vannes`. Le lien existait avant le chantier ; la ligne de prix est nouvelle.
- `/parcours` abonné : deux mentions de « 2,99 €/mois » restent (carte « Explore aussi : Abonnement » et question de FAQ), préexistantes.

## 2. Parcours d'achat, destinations, `src`, Umami : FAIL sur la mesure (note 6/10) [LIVE, Stripe et Umami mockés]

### Destinations et `src` de chaque bouton (visiteur, clic réel, 375 px) : PASS

| Entrée | Arrivée après clic | Événements émis |
|---|---|---|
| B6 en-tête | `/abonnement?src=header` | `abonnement-vu {src: header}` |
| B3 plein | `/parcours/repartie?src=accueil#etape-1` | `parcours-ouvert {src: accueil}`, `etape-ouverte` |
| B3 lien | `/abonnement?src=accueil-hero` | `abonnement-clic {src: accueil-hero}`, `abonnement-vu` |
| B4+B5 plein | `/abonnement?src=accueil-premium` | `abonnement-clic {src: accueil-premium}`, `abonnement-vu` |
| B4+B5 contour | `/parcours/repartie?src=accueil#etape-1` | (lien relevé) |
| B1 « Voir la réplique » | `/carnet?src=blog-demo-milieu-1#fiche-2026-10-15` | `blog-cta-vu {position: milieu-1, fiche: 2026-10-15}`, `blog-cta-clic {bouton: demo-fiche, fiche: 2026-10-15}` |
| B2 plein | `/parcours/repartie?src=blog#etape-1` | `blog-cta-vu {position: fin}`, `blog-cta-clic {bouton: etape-1}` |
| B2 lien | `/abonnement?returnTo=%2Fparcours%2Frepartie&src=blog-meilleures-blagues-droles-2026` | `blog-cta-clic {bouton: abonnement}`, `abonnement-vu` |
| B7 plein (vannes, conseils, vidéos) | `/abonnement?returnTo=%2Fvannes&src=mur-vannes` (idem `mur-conseils`, `mur-videos`) ; le lien `[S22]` mène au même endroit | `abonnement-vu {src: mur-vannes}` ; `mur-vu` à l'affichage |
| B7 contour | `/parcours/repartie?src=fiche#etape-1` | `parcours-ouvert {src: fiche}` (voir m5) |
| B8 / B9 / B10 plein | `/abonnement?returnTo=<la fiche>&src=exercice-vanne` (`exercice-conseil`, `exercice-video`) | `abonnement-vu {src: exercice-…}` |
| B8 à B10 contour | `/parcours/<parcours de la catégorie>?src=fiche#etape-1` | |
| B11 fenêtre (visiteur) | `/register?callbackUrl=%2Fabonnement%3FreturnTo%3D%252Fvannes&src=modale-carte` (`modale-favoris`, `modale-vote`) | `abonnement-clic {src: modale-carte}` ; `mur-vu {type: modale-…}` à l'ouverture |
| B11 lien `[S28]` | `/parcours/repartie?src=abonnement#etape-1` | |
| B12 bouton / lien | `/parcours/{P}?src=quiz#etape-1` / `/abonnement?returnTo=%2Fparcours%2F{P}&src=quiz` (5 profils) | `quiz-termine` |
| B13 (compte) | paiement direct, corps `{"returnTo":"/parcours/repartie"}` | `abonnement-clic {src: onboarding}`, `checkout-ouvert {src: onboarding}` |
| B14 bouton | `/abonnement?returnTo=%2Fparcours%2Frepartie&src=parcours-etape` | `quiz-etape-termine`, `mur-vu {type: parcours-validation}` |
| B15 « Commencer Confiance… » | `/parcours/confiance?src=hub` | `parcours-ouvert {src: hub}` |
| B16 plein | `/register?callbackUrl=%2Fabonnement%3FreturnTo%3D%252Fparcours%252Fconfiance&src=quiz` | `abonnement-clic {src: abonnement, entree: quiz}` |
| B17 lien | `/parcours/repartie?src=abonnement#etape-1` (ou le parcours du `returnTo`) | |

Toutes les destinations existent (200) et gardent le `returnTo`. Les événements `blog-cta-vu` / `blog-cta-clic` portent `slug`, `position`, `parcours`, et `fiche` pour la démonstration.

### Tunnel complet visiteur, fenêtre → compte → Stripe : le paiement s'ouvre, mais la source est perdue

Joué deux fois, Stripe mocké en succès puis en erreur 500 (`achat-*.jpg`) :

1. `/vannes`, carte floutée, « Je m'abonne et j'ouvre toute la liste » → `/register?…&src=modale-carte`.
2. Adresse, mot de passe, prénom vide, « Créer mon compte et passer au paiement » → `inscription-envoi {src: modale-carte}`, `inscription-reussie {src: modale-carte}` ; compte créé (`plan = FREE`, `name = NULL` : prénom facultatif OK).
3. Retour automatique sur `/abonnement?returnTo=%2Fvannes` **sans `src`** → `abonnement-vu {src: direct}`, paiement lancé seul (`declencheur: auto`), corps `{"returnTo":"/vannes"}`, arrivée sur la page Stripe simulée.
4. Événement émis : **`checkout-ouvert {src: "abonnement", formule: "mensuel"}`** au lieu de `modale-carte`. En erreur : **`checkout-echec {src: "abonnement", raison: "erreur"}`**, message affiché, reste sur `/abonnement`.
5. Retour de Stripe sans payer (`/abonnement?paiement=annule`) : `abonnement-annule`, `checkout-echec {src: "abonnement", raison: "retour-sans-paiement"}` (la source mémorisée à l'aller est déjà « abonnement »).

**M1 (Majeur) : `checkout-ouvert` et `checkout-echec` ne disent jamais d'où vient un visiteur.** Depuis la fin du compte gratuit, tout visiteur passe par `/register` puis `/abonnement` ; or aucun des deux liens d'inscription ne remet `src` dans le `callbackUrl` :
- `apps/web/src/components/premium/premium-modal.tsx:93` : `callbackUrl: buildAbonnementUrl(resolveReturnTo())` (sans troisième argument `src`) ;
- `apps/web/src/components/premium/abonnement-view.tsx:151` : `callbackUrl: buildAbonnementUrl(returnTo, plan)` (le `src` d'entrée n'est passé qu'à `/register`, pas au retour) ;
- `apps/web/src/components/premium/abonnement-view.tsx:172` : `const srcMesure = readSrcFromUrl() ?? "abonnement"` lit donc toujours `null`.

Effet : pour les visiteurs (le gros du trafic), la répartition de `checkout-ouvert` par bloc d'entrée, annoncée dans REPLIT_ACTIONS (« mesure checkout par source d'entrée »), sera à 100 % `abonnement`. Seuls les comptes déjà connectés (B13 `onboarding`, carte d'accueil `accueil-premium`, fenêtre connectée) ont une vraie source. On peut encore recouper par `inscription-*` (qui ont la bonne source), mais pas sur l'événement prévu pour ça. Correction proposée (non codée) : passer `src` à `buildAbonnementUrl` dans les deux `callbackUrl` (la fonction l'accepte déjà, `lib/premium-return.ts:45`), puis un test Playwright local « fenêtre → register → `checkout-ouvert {src: modale-carte}` ».

**m5 (Mineur)** : le contour du mur de liste (B7) envoie `src=fiche` (`components/premium/mur-liste.tsx:74`), car `mur-*` n'est pas dans la liste `PARCOURS_SRC` (`lib/parcours-tracking.ts`) : `parcours-ouvert` ne distingue pas un clic du mur d'un clic de fiche.

Retour de paiement réussi (webhook Stripe, passage à `PREMIUM`) : non joué, il demande un vrai Stripe de test (projet `achat`, manuel) : **[STATIQUE UNIQUEMENT : pas de clé Stripe de test ici, voulu]**.

## 3. Rien de cassé ailleurs : PASS (note 9/10) [LIVE sauf mention]

| Contrôle | Résultat | Preuve |
|---|---|---|
| Lettre : inscription, confirmation, désinscription | **PASS**. `lettre-parcours.spec.ts` et `lettre-sans-tiers.spec.ts` (projet `local`) passent : vrai clic « Confirmer mon adresse » → `CONFIRMED`, puis désinscription → `UNSUBSCRIBED`, faux Resend, aucun tiers chargé. Le formulaire B18 sous l'article et la case de consentement sont présents aux 4 largeurs. | sortie Playwright `local` 22/22 |
| « Articles » dans le menu | **PASS** : « Articles » → `/blog` dans l'en-tête (1280) et le menu mobile (375) | `regress-menu-mobile-375.jpg` |
| « Articles » dans le pied de page | **PASS** : « Articles » → `/blog` | sortie `regress.json` |
| Fil d'Ariane | **PASS** : « Accueil › Articles » visible, et `BreadcrumbList` JSON-LD « Accueil, Articles, 50 blagues drôles à ressortir en 2026 » | idem |
| `/blog` marche toujours | **PASS** : 200, H1 « Comment devenir drôle : guides et techniques d'humour », 26 liens d'articles ; article inconnu → 404 | `regress-blog-375.jpg`, `-1280.jpg` |
| Carnet, fiche offerte d'octobre `2026-10-15` | **PASS** : `/carnet#fiche-2026-10-15` existe, « SITUATION 1 · OFFERTE, Le premier rendez-vous silencieux », réponse « Donne-moi la nuit… » lisible sans compte ; « Le soleil dans l'ascenseur » verrouillé (sa réplique absente du texte). Le bouton B1 y mène, et `/abonnement` montre le même extrait. | `regress-carnet-fiche-offerte-375.png` |
| Pages légales | **PASS** : `/mentions-legales`, `/cgu`, `/confidentialite`, `/retractation`, `/a-propos` en 200, H1 attendus, 0 tiret cadratin | sortie `regress.json` |
| Profil et résiliation | **PASS** (portail mocké) : carte « Abonnement Premium », bouton « Résilier ton contrat » → `POST /api/user/subscription/portal {"parcours":"resilier"}` → page du portail Stripe (simulée). Lien du pied de page « Résilier ton contrat » → `/profil#abonnement`. Aucun « en un clic » sur le profil. | `regress-profil-carte-abonnement-375.png`, `regress-portail-simule-375.jpg` |
| Erreurs 404 | **PASS** : page inconnue et article inconnu → 404, page « Oups, cette page a oublié sa punchline » avec retour à l'accueil | `regress-404-375.jpg`, `-1280.jpg` |
| Sitemap | **PASS** : 260 adresses, **260 en 200** ; robots.txt inchangé (bloque `/api/`, `/register`, `/profil`, `/abonnement?`, référence le sitemap) | sortie `sitemap-codes` |
| llms.txt | **PASS** : 200, intertitre « Articles de blog (25) », résiliation dite « résiliable depuis le profil, à tout moment » et « résiliable en ligne », plus de « sans engagement » ni de « en un clic » (seul diff avec la version en ligne : `lib/llms-content.ts`, 5 lignes). `llms-full.txt` : 200. | `curl` |
| axe-core WCAG 2.2 A/AA | **PASS** : 0 violation sur `/`, article, `/abonnement` (Confiance), `/register`, `/vannes`, fiche vidéo, `/parcours`, `/carnet` et la fenêtre B11 ouverte ; la tabulation reste dans la fenêtre, Échap la ferme | sortie du script |

Hors périmètre, noté pour mémoire (préexistant, non touché par le chantier) : `llms-full.txt` contient des tirets cadratins dans les explications de vannes venues de la base (lignes 218 à 226) ; `/resilier` n'existe pas (404), le pied de page pointe bien vers `/profil#abonnement`.

Note 9/10 : tout passe ; un point de moins parce que M2 (abonné et favoris) touche aussi une fonction existante.

## 4. Contrôles textuels : PASS (note 9/10) [LIVE sur le rendu + STATIQUE sur `src/`]

| Contrôle | Rendu (192 pages × profils × largeurs, + fenêtres et quiz) | Code (`apps/web/src`, hors tests) | Verdict |
|---|---|---|---|
| Zéro tiret cadratin dans le client-facing touché | 0 « — » dans tout le texte rendu | Lignes ajoutées depuis la version en ligne (`git diff 75a809b HEAD`, 124 fichiers) : aucun « — » hors commentaires, sauf la constante `TIRET_CADRATIN` de `lib/lettre/numeros.ts:36` (sert à l'interdire). Dans les fichiers touchés, les « — » restants sont dans le prompt interne de `lib/ai/agents/marketing-agent.ts` (non client-facing), des journaux serveur (`lib/scheduler/jobs.ts`) et un extrait d'article préexistant (`lib/blog-articles.ts:3069`, article `humour-apres-rupture`, absent du sitemap) | **PASS** |
| Aucun « en un clic » pour la résiliation | Seules occurrences rendues : la case de consentement de la lettre (« Je peux me désinscrire en un clic »), la note B18 (« Désinscription en un clic », validée) et `/confidentialite` (retrait du consentement) : toutes parlent de la lettre ou d'un consentement, jamais de Premium | 10 occurrences : lettre, rappel de parcours, confidentialité, commentaires RFC 8058 ; `llms.txt` corrigé | **PASS** |
| Aucun « sans engagement » hors CGU | 0 hors `/cgu` (« conclue pour une durée indéterminée, sans engagement », juridique, voulu) | `cgu/page.tsx:32` ; consigne « N'écris JAMAIS « sans engagement » » dans le prompt marketing ; 2 commentaires | **PASS** |
| Aucune promesse « Voir toutes » dans les blocs d'appel | 0 « Voir toutes / tous les » dans les blocs B1 à B18 ; les liens discrets des fiches disent « Voir d'autres vannes / conseils / vidéos » | 0 dans `config/textes/cta-*.ts` | **PASS** |
| « Débloquer » | 0 rendu | 0 dans `src/` | **PASS** |
| Chaînes interdites du document (liste « Grep après branchement ») | aucune rendue | 0, sauf `Choisis ton parcours` dans le corps d'un article (`lib/blog-articles.ts:1364`, lien markdown « Choisis ton parcours » vers `/parcours`, article `phrases-droles-conversations`), préexistant, hors bloc d'appel | **PASS** (à nettoyer à l'occasion) |
| « À ton rythme » (document, B16 : « ne doit apparaître nulle part ») | absent des blocs | 4 endroits préexistants hors blocs : accueil connecté (`app/(dashboard)/page.tsx:120`), description de `/parcours/confiance` (`app/(dashboard)/parcours/[slug]/page.tsx:68`), favoris vides (`components/favoris/favoris-list.tsx:44`), 4 articles | **Observation** (hors blocs, préexistant) |

### Liens de navigation « Voir toutes les… » hors blocs (signalés par @fullstack) : ce que voit vraiment un visiteur

| Où | Libellé | Destination | Ce que voit le visiteur sans abonnement |
|---|---|---|---|
| `/vannes/theme/{slug}` (`app/(dashboard)/vannes/theme/[slug]/page.tsx:99`) | Voir toutes les vannes | `/vannes` | les **10 premières** vannes, 4 cartes floutées, puis le mur B7 « Voilà les 10 premières vannes. La suite est juste en dessous, dans Premium. » |
| `/blague-du-jour` (`app/(dashboard)/blague-du-jour/page.tsx:107`) | Voir toutes les vannes | `/vannes` | idem |
| `/liens` (page de la bio Instagram, `components/liens/liens-page-content.tsx:17`) | Voir toutes les vannes | `/vannes?utm_source=instagram…` | idem |
| `/vannes`, `/conseils`, `/videos`, état vide d'un filtre (`vannes-list.tsx:249`, `conseils-list.tsx:253`, `videos-grid.tsx:254`) | Voir toutes les vannes / tous les conseils / toutes les vidéos | la liste sans filtre | n'apparaît que si un filtre ne donne rien ; les filtres sont réservés à Premium, donc un visiteur ne le voit pas |
| `/parcours/{slug}` (`components/parcours/parcours-detail.tsx:474`) et page d'erreur d'un parcours (`parcours/[slug]/error.tsx:37`) | Voir tous les parcours | `/parcours` | non affiché au visiteur sur Répartie et Storytelling (vérifié) ; s'il l'est, la promesse est vraie : `/parcours` montre les 5 cartes |

Les trois premiers promettent « toutes » et livrent 10 vannes et un mur : pas faux au sens strict (la liste entière est derrière le mur), mais c'est la même promesse que les blocs ont abandonnée. Décision de libellé à @copywriter / Thomas (« Voir les vannes » suffirait). Captures : `voir-toutes-source-*-375.jpg`.

Note 9/10 : rien de faux dans les blocs ; un point pour les trois « Voir toutes les vannes » de navigation, qui gardent la promesse retirée des blocs.

## 5. Performance et accessibilité : PASS avec réserve (note 8/10) [LIVE, local]

Lighthouse 12, profil mobile par défaut (Moto G, réseau et CPU simulés), 3 passes par page, même machine, serveur local sans CDN ; « avant » = version en ligne `75a809b` construite de la même façon. Valeurs : médiane des 3 passes.

| Page | Version | Perf. | Access. | Bonnes pratiques | SEO | LCP | TBT | CLS | JS transféré |
|---|---|---|---|---|---|---|---|---|---|
| `/` | avant | 95 | 100 | 96 | 100 | 2,92 s | 37 ms | 0 | 224 Ko |
| `/` | **s21** | 93 | 100 | 96 | 100 | 3,13 s | 38 ms | 0 | 253 Ko |
| article n°1 | avant | 98 | 100 | 96 | 100 | 2,41 s | 5 ms | 0 | 210 Ko |
| article n°1 | **s21** | 96 | 100 | 96 | 100 | 2,77 s | 62 ms | 0 | 239 Ko |
| `/abonnement` | avant | 96 | 100 | 96 | 100 | 2,76 s | 8 ms | 0,001 | 202 Ko |
| `/abonnement` | **s21** | 95 | 100 | 96 | 100 | 2,91 s | 10 ms | 0 | 234 Ko |

First Load JS du build (gzip) : `/` 149 → **159 Ko**, article 121 → 133, `/abonnement` 132 → 139, `/quiz-humour` 116 → **139**, `/register` 123 → 130, `/parcours/[slug]` 144 → 151, `/vannes` 141 → 147.

- **Accessibilité : PASS.** 100 partout, axe-core 0 violation A/AA sur 8 pages et la fenêtre (section 3), focus piégé dans la fenêtre, Échap la ferme.
- **Pas de régression évidente** : scores 93 à 96, CLS nul, TBT bas.
- **m3 (Mineur)** : le JS grossit de 29 à 32 Ko transférés sur les trois pages (+13 à +16 %), l'accueil passe au-dessus du budget de 150 Ko de First Load JS, `/quiz-humour` prend +23 Ko (+20 %), le LCP de l'article recule de 350 ms en médiane (le mobile simulé dépasse déjà 2,5 s avant comme après, en local sans CDN). Une partie vient de la lettre (même branche, autre chantier). Piste pour @fullstack : vérifier que les textes des blocs (`config/textes/cta-pages.ts`, `parcours-etapes.ts`) ne sont pas embarqués en entier dans les composants client (`viral-quiz`, `premium-modal`, `abonnement-view`), avec `@next/bundle-analyzer`. Les chiffres absolus en production (Cloudflare, cache) seront meilleurs ; c'est l'écart qui compte.
- Rapports Lighthouse bruts (18 JSON, 15 Mo) gardés hors dépôt ; médianes et passes dans `captures-s21/qa-cta/mesures.json`.

## Ce qui n'a pas été joué en vrai

- Paiement Stripe réel et webhook de réussite : **[STATIQUE UNIQUEMENT : pas de clé Stripe de test dans cet environnement, voulu]**. Le tunnel est joué jusqu'à l'ouverture de Checkout (réponse mockée).
- B13 Storytelling : **[STATIQUE UNIQUEMENT : le quiz d'orientation ne conseille jamais Storytelling]**, texte vérifié par Jest seulement.
- Safari et Firefox : non installés, Chromium seul (émulation mobile tactile à 360 et 375).
- Production : rien n'est en ligne ; aucune requête vers deviens-marrant.fr.

## À faire, par qui

| # | Pour | Action |
|---|---|---|
| M1 | @fullstack | Passer `src` à `buildAbonnementUrl` dans les deux `callbackUrl` (`premium-modal.tsx:93`, `abonnement-view.tsx:151`) ; ajouter le test Playwright local « fenêtre → /register → `checkout-ouvert {src: modale-carte}` » (aucun test ne couvre ce trajet, c'est pourquoi rien ne l'a vu). |
| M2 | @fullstack | Lire le plan dans la session (`useSession`) dans `PremiumCta` et `FavoriteButton`, ou remplir `useUserStore` au montage ; test : abonné connecté, accueil, pas de `#offres`, clic sur un cœur = favori ajouté. |
| m1 | @product-manager puis Thomas | Trancher : compte connecté sur B4+B5 et `/abonnement` = « Active mon accès » (à écrire dans le document validé) ou textes validés. |
| m2 | @design, @fullstack | Titre B2 sur 2 lignes à 360 et 375. |
| m3 | @fullstack | Analyse du bundle (`@next/bundle-analyzer`), surtout `/quiz-humour` et l'accueil. |
| m4 | @fullstack | Rendre les 4 tests Jest indépendants de `STRIPE_PREMIUM_ANNUAL_PRICE_ID` et `NEXTAUTH_URL` (mock explicite de `isAnnualPlanAvailable` et de l'URL de base). |
| m5, m6, m7 | @fullstack | `src` propre au mur (`mur-vannes`…) dans `PARCOURS_SRC` ; masquer lien et ligne de prix B12 pour l'abonné ; « Partager » en contour. |
| obs. | @copywriter, Thomas | Les trois « Voir toutes les vannes » de navigation (thèmes, blague du jour, page de liens). |

Aucun code applicatif modifié par cette QA. Aucun test ajouté : le manque prouvé (M1) demande d'abord la correction, sinon le test serait rouge sur la branche ; il est décrit ci-dessus pour @fullstack.
