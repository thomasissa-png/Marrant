# QA v2 des blocs d'appel s21 : les corrections tiennent-elles, peut-on donner le lien à Thomas ?

> @qa, session 21, 18/10/2026. Branche testée : `claude/marrant-s21-integration` @ `9568ed0` (worktree `agent-a6072b0ac19da7774`).
> Reprend la méthode de `docs/qa/qa-cta-s21.md` (v1, 8/10, commit `22baf68`). Captures : `docs/qa/captures-s21-v2/`.
> Marquage : **[LIVE]** = Chromium réel sur le build de production local, sortie observée ; **[STATIQUE]** = lecture du code, Grep ou Jest sans navigateur.

## Verdict

**Note : 8,5/10. Aucun bloquant, 1 majeur, 5 mineurs. Le lien de test peut partir chez Thomas** : rien de cassé, rien de faux à l'écran. Le majeur touche la mesure, pas le lecteur.

- **Non-régression** : B-1, M1, M2 et m1 à m7 sont corrigés, preuves à l'appui (section 1). Seule réserve : m2 est corrigé à 360 et 375 mais le titre B2 repasse sur 3 lignes à 320 px, largeur nouvelle dans cette QA (m-a).
- **Textes E1 à E4** : 76 chaînes sur 76 identiques au document validé, casse comprise ; « Active mon accès » et tiret cadratin : 0 sur 196 pages rendues (3 profils × 4 largeurs).
- **Parcours de l'abonné** : 6 étapes validées dans le désordre, XP et bonus de fin justes (800 = total annoncé), rappel par e-mail qui propose la bonne étape. Visiteur et compte sans abonnement : rien de nouveau ouvert, ni à l'écran ni par l'API.
- **Carnet** : octobre aujourd'hui ; bascule exacte à minuit heure de Paris le 01/11 (fiche offerte `2026-11-10`, « Il en reste 29 », « Situation 10 », 29 titres sans aucune réplique dans le HTML).
- **Tunnel mocké** : 23 entrées sur 23 arrivent au paiement. Les blocs B gardent leur source ; **le bouton E1 du carnet, non** (MJ-1).
- **Perf** : toutes les pages touchées sont sous les 150 Ko ; `/parcours/[slug]` est pile au plafond (m-e).

La note perd 1 point pour MJ-1 : la mesure par source, corrigée pour M1, a de nouveau un trou, sur le bouton ajouté depuis, qui est aussi la fin de la chaîne démonstration d'article → carnet. Elle perd un demi-point pour les mineurs.

Chemins relatifs à `apps/web/src/`.

| # | Gravité | Défaut | Preuve | Fichier : ligne |
|---|---|---|---|---|
| MJ-1 | **Majeur** | E1 (carnet) sans `src` : `checkout-ouvert {src: abonnement}` pour le visiteur comme pour le compte, et la chaîne B1 → carnet → E1 perd sa source | section 5, tunnel [LIVE] | `components/carnet/carnet-page.tsx:105` |
| m-a | Mineur | B2 : titre `[S8]` sur 3 lignes à 320 px, bloc de 652 px | `nonreg.json`, `bloc-B2-fin-article-visiteur-320.png` | `components/blog/article-cta.tsx:76` |
| m-b | Mineur | E2 : `abonnement-clic {src: accueil}` alors que `checkout-ouvert` dit `accueil-premium` (et le visiteur, `accueil-premium` partout) : deux noms pour le même bouton dans Umami | tunnel [LIVE] | `components/home/carte-premium-achat.tsx:40` |
| m-c | Mineur | E2 : la carte d'un compte déjà inscrit finit par « Déjà 1 500+ inscrits, et toi ? », juste sous « Tu as déjà ton compte » | `bloc-E2-carte-accueil-gratuit-320.png` | `components/home/premium-cta.tsx:89`, `config/textes/cta-articles-accueil.ts:251` |
| m-d | Mineur | B2 abonné : bouton « Continuer mon parcours » sous le corps du visiteur (« Une étape par semaine… », « La première se lit tout de suite, sans compte. »), faux pour un abonné qui a tout d'un coup | `bloc-B2-fin-article-abonne-375.png` | `components/blog/article-cta.tsx:82`, `config/textes/cta-articles-accueil.ts:152` |
| m-e | Mineur | `/parcours/[slug]` à 150 Ko de First Load JS, pile au budget | build | build `next build` |

Observations hors défaut : vide d'environ 60 px entre le prix et le bouton de `/abonnement` à 320 et 375 (section 2) ; l'e-mail de rappel dit « dans le parcours Parcours Confiance » (titre en base, préexistant s17) ; dans la copie de travail principale, `docs/copy/cta-s21/complements/carnet-2026-11.json` est une version antérieure du carnet (sha256 différent) qui porte le même nom que le fichier validé (section 4).

## Conditions du test

- **Environnement vide (P0).** Build, serveurs, Jest, tsc, lint et Playwright lancés par `env -i`, avec seulement les variables factices du job `e2e-local` de `.github/workflows/tests.yml` (`NEXTAUTH_SECRET=secret-factice-e2e-local`, `RESEND_API_KEY=re_factice_e2e`, `STRIPE_PREMIUM_PRICE_ID` et `STRIPE_PREMIUM_ANNUAL_PRICE_ID` factices, donc l'annuel est proposé comme en production, `ANTHROPIC_API_KEY=dummy`), plus `PATH`, un `HOME` vide et `CI=true`. Pour le build seulement : `NODE_EXTRA_CA_CERTS` vers le certificat du proxy sortant, afin de télécharger les polices Google (aucune autre variable de proxy, aucune valeur affichée). Pour le job de rappel : `UNSUBSCRIBE_HMAC_SECRET` factice. **Aucune clé Stripe, Resend ni Umami réelle, aucun e-mail réel, aucun paiement, aucune requête vers la production ni vers Neon.**
- **Build de production local** de `9568ed0` (`npm run build`, `node .next/standalone/server.js`, port 5310). Base PostgreSQL 16 jetable (port 5498, seed du dépôt : 5 parcours, dont Confiance en 6 étapes), **supprimée à la fin**. Deux copies du même build avec horloge décalée pour le carnet (ports 5320 et 5330, section 4).
- **Trois profils** : visiteur ; compte sans abonnement (`FREE`, 120 XP) ; abonné (`PREMIUM`). Comptes créés sur la base jetable, connectés par le formulaire de `/login`. **Quatre largeurs** : 320, 360, 375 (mobile tactile, 812 px de haut) et 1280 × 900 ; 768 en plus pour m7.
- **Umami et Stripe mockés** comme en v1 ; tout appel du navigateur hors localhost est bloqué.
- Scripts de QA hors dépôt, sorties JSON relues une à une ; attendus recopiés à la main depuis les documents validés.

## 1. Non-régression des défauts de la v1

| Défaut v1 | Statut | Preuve |
|---|---|---|
| **B-1** (revue) Premium : verrou d'ordre des étapes | **Corrigé** [LIVE] | Section 3 : étapes validées dans l'ordre 6, 3, 1, 5, 2, 4, toutes en 200, XP et bonus justes, visiteur et compte gratuit inchangés (401 / 403, étapes 2+ masquées dans l'API) |
| **M1** `src` perdu entre `/register` et le paiement | **Corrigé** pour les blocs B, sauf la chaîne B1 → carnet → E1 [LIVE] | Section 5 : les 17 entrées par un bloc B (14 visiteur, 3 compte) portent leur source jusqu'à `checkout-ouvert` et `checkout-echec`. **Mais le nouveau bouton E1 du carnet n'en a pas** (MJ-1) |
| **M2** abonné vu comme non abonné (carte d'accueil, cœurs) | **Corrigé** [LIVE] | Abonné connecté, 375 px : accueil sans `#offres` ni « 2,99 » ; cœur de l'accueil et de `/vannes` : pas de fenêtre, favori ajouté en base (0 → 1 → 2), le bouton devient « Retirer des favoris » ; `/favoris` liste les 2 favoris (`nonreg-M2-abonne-coeur-*-375.png`) |
| **m1** textes non validés pour le compte connecté | **Corrigé** [LIVE] | Remplacés par E2 et E3 (section 2) ; « Active mon accès » : 0 sur 196 pages |
| **m2** titre B2 sur 3 lignes à 360 et 375 | **Corrigé** à 360 et 375 [LIVE] | 18 px sous 640 px : **2 lignes** à 360 et 375 ; bloc de 584 px à 360 et 548 px à 375, comme annoncé. **À 320 px : 3 lignes, bloc de 652 px** (largeur non testée en v1, voir m-a) |
| **m3** JS au-dessus du budget | **Corrigé** [LIVE, build] | Accueil 159 → 147 Ko, `/quiz-humour` 139 → 128 Ko (section 7) ; `/parcours/[slug]` à 150 Ko pile (m-e) |
| **m4** 4 tests Jest dépendants de l'environnement | **Corrigé** [LIVE] | Jest complet avec l'environnement `e2e-local` (annuel et `NEXTAUTH_URL` posés) : **330 suites, 5 050 tests réussis, 0 échec** (5 ignorés) |
| **m5** contour du mur mesuré `src=fiche` | **Corrigé** [LIVE] | `/vannes` : contour → `/parcours/repartie?src=mur-vannes#etape-1` |
| **m6** abonné : lien payant et prix au résultat du quiz d'humour | **Corrigé** [LIVE] | Abonné, résultat « L'Observateur » : 0 « 2,99 », 0 lien `/abonnement`, 1 plein vers le parcours (`nonreg-m6-quiz-abonne-375.png`) |
| **m7** « Partager » plein sur la fiche vanne | **Corrigé** [LIVE] | « Partager » transparent (contour) ; un seul plein (« Écrire la mienne avec Premium ») à 320, 360, 375, 768 et 1280 px, aucune paire de pleins dans un même écran |
| Corrections design P1 et P2 | **Pas de régression visible** [LIVE] | Lecture des captures des blocs : un plein par bloc, pas de doublon de contour sur les fiches |
| Suites existantes | **PASS** [LIVE] | Playwright `local` **32/32** ; smoke (desktop 1440 + iPhone 13, `@s21` compris) **128 réussis**, 2 ignorés (achat, voulu) ; `tsc --noEmit` complet et `-p playwright/tsconfig.json` : 0 erreur ; `next lint` : 0 erreur (avertissements `<img>` préexistants) |

## 2. Textes E1 à E4 : PASS [LIVE]

**Méthode (celle de la v1).** Les chaînes attendues sont recopiées à la main depuis `docs/copy/cta-s21/complements/textes-valides-boutons.md` (jamais importées du code), avec les valeurs du jour : {N} = 14 en octobre, 5 parcours publiés, compte de test à 120 XP. Elles sont comparées au `innerText` rendu, après normalisation des espaces insécables et des apostrophes, avec et sans la casse. 3 profils × 4 largeurs (320, 360, 375, 1280) × 17 pages = **196 pages rendues**.

| Bouton | Où, pour qui | Chaînes | Résultat |
|---|---|---|---|
| E1 | `/carnet`, visiteur et compte sans abonnement | titre « Ça, c'était la réplique offerte. Il en reste 14. », paragraphe, bouton « Voir les 14 autres répliques · 2,99 €/mois », ligne sous le bouton | **32/32**, casse exacte. Le 01/11 : « Il en reste 29 », « Voir les 29 » (section 4). Abonné : pas de bloc |
| E2 | accueil, compte sans abonnement | « Tu as déjà ton compte : ce bouton t'emmène direct au paiement, sécurisé par Stripe. » **au-dessus** du bouton « Ouvrir les 5 parcours · 2,99 €/mois » (ordre vu sur `bloc-E2-carte-accueil-gratuit-*.png`) | **8/8** |
| E3 | `/abonnement`, compte sans abonnement | pastille, titre, paragraphe (« Machine à Café, Répartie, Confiance, Storytelling et Boulot, de 3 à 6 semaines chacun… 15 à 20 minutes… »), bouton | **16/16** ; en cochant « Annuel » : « Ouvrir les 5 parcours · 24,99 €/an » **4/4**. Même bloc avec `returnTo=/parcours/confiance` |
| E4 | carte « Abonnement » de `/profil`, compte sans abonnement | phrase d'offre, « Tu as déjà 120 XP. », ligne discrète, « Tout ouvrir · 2,99 €/mois » | **16/16** ; l'ancienne ligne « …sont conservés et reprennent… » : 0 |

**Chaînes interdites, dans tout le texte rendu des 196 pages (3 profils, 4 largeurs)** : « Active mon accès » **0**, « Active ton accès » **0**, « Débloque tout le carnet » **0**, « Commencer à 2,99 » **0**, **tiret cadratin « — » : 0**. Côté code, `grep` de « Active mon accès », « Active ton accès », « Débloque tout le carnet » et « Commencer à 2,99 » dans `apps/web/src` (hors tests) : 0 [STATIQUE].

Lecture visuelle (captures `bloc-E1-*`, `bloc-E2-*`, `bloc-E3-*`, `bloc-E4-*`) : rien de tronqué ni de superposé, un seul plein par bloc, bouton entier à 320 px (E1 et E2 sur 2 lignes à 320, 360 et 375, E4 sur une ligne). Deux remarques de forme, qui ne sont pas des défauts de texte :
- E3 à 320 et 375 : un vide d'environ 60 px entre « …10,89 € économisés par an. » et le bouton. C'est la place réservée sous le prix ; le bouton paraît flotter. À voir par @design (`components/premium/abonnement-view.tsx` vers la l. 290, `mt-5 sm:mt-8` plus la hauteur réservée).
- E2 : la carte se termine par « Déjà 1 500+ inscrits, et toi ? », affiché à un compte **déjà inscrit**, juste sous « Tu as déjà ton compte ». Voir m-c.

## 3. Parcours d'un abonné : PASS [LIVE]

**Abonné** (compte `PREMIUM` neuf, 0 XP, parcours Confiance de la base jetable, 6 étapes, 375 px, clics réels : déplier l'étape, jouer le quiz, « Continuer », « Valider cette étape »). Ordre imposé par le test : **6, 3, 1, 5, 2, 4**.

| Étape validée | Réponse API | XP gagnés | XP en base | Invitation au rappel |
|---|---|---|---|---|
| 6 | 200 | 200 | 200 | oui (« Envie d'un rappel par e-mail le jour de ton choix ? ») |
| 3 | 200 | 100 | 300 | oui |
| 1 | 200 | 50 | 350 | oui |
| 5 | 200 | 150 | 500 | oui |
| 2 | 200 | 75 | 575 | oui |
| 4 | 200 | 125 + **bonus 100** | **800** | non (parcours terminé, voulu) |

- À l'arrivée, les 6 cartes sont ouvrables, aucune en pointillés (verrou). Après l'étape 6 : « +200 XP gagnés ! Prochaine étape conseillée le dimanche 25 octobre. Tu peux y aller dès maintenant si tu veux. » (`parcours-abonne-apres-etape-6-375.png`). Fin : carte « Parcours Confiance terminé… Tu as fait les 6 étapes et gagné 800 XP, bonus de fin compris. » (`parcours-abonne-termine-375.jpg`). En base : `completedSteps [6,3,1,5,2,4]`, `completedAt` posé, XP 800 = `pathXpTotal` 800, niveau FARCEUR, série 1.
- Bonus de fin crédité **une seule fois**, à la dernière étape (quelle qu'elle soit). Revalider l'étape 3 : 200, `alreadyCompleted: true`, 0 XP. Étape 99 : 400 `etape`.
- **Rappel par e-mail** : un second abonné valide les étapes 4 puis 1 et active le rappel par l'API du profil (200). Ensuite, `runParcoursReminders` (le vrai code du job) tourne sur la base jetable avec un faux envoi et un secret factice : 1 candidat, 1 envoi, qui propose **« l'étape 2, « Rire de toi sans te rabaisser » »** (la première non faite, correct dans le désordre) et la date conseillée « dimanche 25 octobre ». Aucun e-mail réel. Remarque hors chantier : « dans le parcours Parcours Confiance » (le titre en base contient déjà « Parcours ») ; voir m-d.

**Visiteur et compte sans abonnement : rien de nouveau ouvert.**
- Étapes 2 à 6 en pointillés, aucun bouton « Valider » ; l'étape 3 dépliée ne montre que l'aperçu (`parcours-visiteur-etape3-375.png`, `parcours-gratuit-etape3-375.png`).
- `POST /api/parcours/{id}/progress` : visiteur **401** `auth`, compte sans abonnement **403** `refus`.
- `GET /api/parcours/by-slug/confiance` : pour les deux profils, les étapes 2 à 6 sont servies `locked`, sans contenu de conseil ni quiz ; l'étape 1 est complète. Aucune fuite de contenu payant par l'API.

## 4. Carnet d'octobre et de novembre : PASS [LIVE]

**Méthode.** Le carnet courant est choisi côté serveur (`lib/carnet.ts:135`, `currentParisMonth(new Date())`) ; aucune variable de test n'existe et l'horloge Playwright ne touche que le navigateur. Sans toucher au code : deux copies du même build (`.next/standalone`), chacune avec son propre cache ISR, lancées avec une horloge décalée chargée par `node --require` (script hors dépôt qui remplace `Date` par une horloge partant d'un instant donné puis avançant normalement). Trois horloges : **aujourd'hui** (port 5310), **31/10 23:59 Paris** = 22:59 UTC (5320), **01/11 00:00:30 Paris** = 23:00:30 UTC (5330). Les contrôles 6, 11 et 12 de REPLIT_ACTIONS ont été rejoués tels quels (curl + `grep -c`), plus un détecteur de fuite (texte du JSON comparé au HTML entier, charge RSC comprise, entités décodées).

| Contrôle (`/carnet?ne-pas-compter=1`, visiteur) | Aujourd'hui | 31/10 23:59 Paris | 01/11 00:00 Paris |
|---|---|---|---|
| `fiche-2026-10-15` | 1 | 1 | **0** |
| `fiche-2026-11-10` / `fiche-2026-11` | 0 / 0 | 0 / 0 | **1 / 1** |
| « Il en reste 14 » / « Voir les 14 » | 1 / 1 | 1 / 1 | 0 / 0 |
| « Il en reste 29 » / « Voir les 29 » | 0 / 0 | 0 / 0 | **1 / 1** |
| « la réplique offerte. Il en reste » / « autres répliques » | 1 / 1 | 1 / 1 | 1 / 1 |
| « Débloque tout le carnet », « Active mon accès », « je parle dans un ascenseur », « — » | 0 | 0 | 0 |
| Carte de la fiche offerte | « Situation 15 · offerte » | idem | **« Situation 10 · offerte »** |
| `/abonnement`, surtitre de l'extrait | « Situation 15, offerte » | idem | **« Situation 10, offerte »** ; « Situation 1, offerte » : 0 partout |
| `/carnet/2026-11` | 404 | **404** (rien avant minuit) | 200 |
| `/carnet/2026-10` | 200 | 200 | 200 (archive) |
| Fuite des fiches verrouillées (réplique, `onTeDit`, pourquoi, si tendu, exercice) | 14 titres, **0 fuite** | idem | **29 titres, 0 fuite** ; la fiche offerte est entière (le détecteur la voit, preuve qu'il marche) |
| Encart B1 de `/blog/meilleures-blagues-droles-2026` | `#fiche-2026-10-15` | idem | 1re requête : `#fiche-2026-10-15` (page en cache ISR), 2e requête 3 s après : **`#fiche-2026-11-10`**, comme annoncé au contrôle 12 |

- Fichier embarqué `apps/web/src/data/carnet/2026-11.json` : sha256 `44b3a8c7…7cac8c`, identique à `docs/copy/carnet/novembre/carnet-2026-11.json` (référence de REPLIT_ACTIONS, contrôle 12). 30 fiches, offerte `2026-11-10` « Le gratin « intéressant » ».
- Observation (hors branche) : dans la copie de travail principale, `docs/copy/cta-s21/complements/carnet-2026-11.json` a un autre sha256 (`5da7623a…`, version antérieure). Ce n'est pas le fichier de référence, mais un homonyme : à archiver ou supprimer pour éviter qu'on recopie la mauvaise version.
- `/carnet` est en `noindex, nofollow` et absent du sitemap (voulu) : pas d'effet SEO de la bascule.

## 5. Tunnel d'achat mocké : M1 corrigé, E1 sans source [LIVE, Stripe et Umami mockés]

**Méthode (celle de la v1).** 375 px, clic réel sur le bouton, puis le tunnel jusqu'au bout. Pour un visiteur : `/abonnement`, plein, `/register` (nouveau compte, prénom vide), retour automatique sur `/abonnement`, paiement lancé seul. Pour un compte sans abonnement : paiement direct. `POST /api/stripe/checkout` est intercepté (réponse `{url: checkout.stripe.com/…}`, page Stripe simulée), tout appel hors localhost est bloqué. Faux `window.umami.track` relié au script par `exposeBinding`, ce qui garde les événements au départ vers Stripe. La limite d'inscription (5 par IP et par heure, clé `cf-connecting-ip`) a bloqué le premier passage, preuve qu'elle marche ; chaque entrée simule donc son propre visiteur en posant `cf-connecting-ip`, comme Cloudflare le ferait.

**23 entrées, 23 arrivées sur la page Stripe simulée.**

| Entrée | Profil | `checkout-ouvert.src` | Corps envoyé | Verdict |
|---|---|---|---|---|
| B6 en-tête | visiteur | `header` | `{}` | OK |
| B3 lien | visiteur | `accueil-hero` | `{}` | OK |
| B4+B5 plein | visiteur | `accueil-premium` | `{}` | OK |
| B2 lien | visiteur | `blog-meilleures-blagues-droles-2026` | `returnTo /parcours/repartie` | OK |
| B7 murs (vannes, conseils, vidéos) | visiteur | `mur-vannes`, `mur-conseils`, `mur-videos` | `returnTo` de la liste | OK |
| B8, B9, B10 fiches | visiteur | `exercice-vanne`, `exercice-conseil`, `exercice-video` | `returnTo` de la fiche | OK |
| B11 fenêtre (cœur de `/vannes`) | visiteur | `modale-favoris` | `returnTo /vannes` | OK |
| B12 quiz d'humour, lien | visiteur | `quiz` | `returnTo /parcours/confiance` | OK |
| B14 fin d'étape 1 | visiteur | `parcours-etape` | `returnTo /parcours/repartie` | OK |
| B16 `/abonnement` tapé directement | visiteur | `abonnement` (`abonnement-vu {src: direct}`) | `{}` | OK (pas de bloc d'entrée) |
| **E1 `/carnet`** | **visiteur** | **`abonnement`** (`abonnement-vu {src: direct}`) | `returnTo /carnet` | **FAIL (MJ-1)** |
| **B1 démo de l'article → `/carnet` → E1** | **visiteur** | **`abonnement`** | `returnTo /carnet` | **FAIL (MJ-1)** |
| **E1 `/carnet`** | **compte sans abonnement** | **`abonnement`** | `returnTo /carnet` | **FAIL (MJ-1)** |
| E2 accueil | compte sans abonnement | `accueil-premium` | (vide, paiement direct) | OK ; `abonnement-clic` part avec `src: accueil` (m-b) |
| E3 `/abonnement` | compte sans abonnement | `abonnement` | `{}` | OK (la page elle-même) |
| E4 `/profil` | compte sans abonnement | `profil` | (vide) | OK |
| B7 mur vannes | compte sans abonnement | `mur-vannes` | `returnTo /vannes` | OK |
| B11 fenêtre (cœur) | compte sans abonnement | `modale-favoris` | `returnTo /vannes` | OK |
| B13 quiz d'orientation | compte sans abonnement | `onboarding` | `returnTo /parcours/repartie` | OK |

- **M1 est corrigé** : chaque bloc B garde sa source jusqu'à `checkout-ouvert`, en passant par `/register`. `inscription-reussie` porte la même source. Après inscription, le retour émet `abonnement-vu {src: retour-inscription}`, comme annoncé dans REPLIT_ACTIONS.
- **Échec** (Stripe en 500, entrée B7 vannes, visiteur, après inscription) : `checkout-echec {src: mur-vannes, raison: erreur, formule: mensuel}`, toast « Le paiement n'a pas pu démarrer. Réessaie dans un instant. », on reste sur `/abonnement` (`tunnel-echec-stripe-500-375.png`).
- **MJ-1 (Majeur) : le nouveau bouton du carnet n'a pas de source.** `components/carnet/carnet-page.tsx:105` : `href={buildAbonnementUrl(returnTo)}`, sans troisième argument. `/abonnement` ne voit donc aucune `src`, et `srcMesure` retombe sur `"abonnement"` (`components/premium/abonnement-view.tsx:177`). Conséquences : au bilan du 10/11, un paiement venu du carnet est indiscernable d'une visite directe de `/abonnement`. Toute la chaîne de la démonstration d'article (B1 → `/carnet?src=blog-demo-milieu-1` → E1) perd aussi sa source au dernier clic, alors que c'est l'entrée vitrine des articles. C'est le même défaut que M1, sur un bouton ajouté après la v1 ; aucun test ne couvre ce trajet. Correction proposée (non codée) : `buildAbonnementUrl(returnTo, "monthly", src)` avec `src = "carnet"` (et, si `@data-analyst` le veut, `carnet-<src d'arrivée>` quand `/carnet` a été ouvert avec `?src=blog-demo-…`) ; ajouter la valeur à la liste des sources ; test Playwright local « `/carnet` → E1 → `checkout-ouvert {src: carnet}` ».
- Retour de paiement réussi (webhook, passage à `PREMIUM`) : non joué, il faut un vrai Stripe de test **[STATIQUE UNIQUEMENT : pas de clé Stripe de test ici, voulu]**.

## 6. Captures et hauteurs : PASS [LIVE]

Dossier `docs/qa/captures-s21-v2/` (environ 130 fichiers, 14 Mo). Pages entières en JPEG (qualité 35, 1280 px réduit à 60 %) : accueil, `/abonnement`, `/carnet`, `/profil`, `/vannes`, fiche vanne, pour **3 profils × 4 largeurs (320, 360, 375, 1280)** ; l'article en page entière à 375 seulement (les autres largeurs faisaient 7 Mo pour un seul bloc, capturé à part). Blocs en PNG (`bloc-*`), parcours (`parcours-*`), non-régression (`nonreg-*`), novembre (`novembre-*`), tunnel (`tunnel-*`).

**Débordement et coupes, 196 pages × profils × largeurs** : largeur de défilement = largeur de fenêtre partout ; 0 élément visible hors de l'écran à droite (hors conteneurs à défilement) ; 0 bouton, lien ou titre dont le texte est rogné (`overflow: hidden`, `ellipsis` ou `nowrap` avec `scrollWidth > clientWidth`). Lecture visuelle des captures des blocs à 320 px : rien de coupé ni de superposé.

Hauteurs mesurées (px, hauteur × largeur du bloc) :

| Bloc | Profil | 320 | 360 | 375 | 1280 |
|---|---|---|---|---|---|
| E1, appel du carnet (titre à garantie, avantages compris) | visiteur et compte | 962 | 806 | 806 | 524 |
| E2, carte Premium de l'accueil | compte sans abonnement | 1 072 | 952 | 952 | 680 |
| B4+B5, carte Premium de l'accueil | visiteur | 1 016 | 896 | 896 | 648 |
| E4, carte « Abonnement » du profil | compte sans abonnement (120 XP) | 342 | 306 | 306 | 218 |
| E4 | abonné | 271 | 251 | 251 | 183 |
| B2, bloc de fin d'article | visiteur et compte | **652** (titre 3 lignes, m-a) | 584 | 548 | 366 |
| B2 | abonné (« Continuer mon parcours ») | 500 | 436 | 416 | 326 |
| E3, haut de `/abonnement` (pastille à bouton) | compte sans abonnement | bouton à 2 lignes, 48 px de haut, à 320, 360 et 375 ; 1 ligne à 1280 | | | |

Les cartes E1 et E2 dépassent un écran de mobile (812 px) à 320 px : elles portent la liste commune des avantages Premium (inchangée, hors chantier), et le bouton reste entier, juste après la liste. Ce n'est pas un défaut, juste une donnée pour @design.

## 7. Performance : PASS, une page au plafond [LIVE, build local]

First Load JS affiché par `next build` (HEAD `9568ed0`, environnement vide), contre le budget de 150 Ko et contre la v1 :

| Page | v1 (`c9a56c1`) | **v2** | Budget 150 Ko |
|---|---|---|---|
| `/` | 159 | **147** | OK |
| `/blog/[slug]` | 133 (138 annoncé avant m3) | **133** | OK |
| `/abonnement` | 139 | **137** | OK |
| `/quiz-humour` | 139 | **128** | OK |
| `/register` | 130 | **130** | OK |
| `/parcours/[slug]` | 151 | **150** | **au plafond** (m-e) |
| `/vannes` | 147 | **136** | OK |
| `/conseils`, `/videos` | | 137, 141 | OK |
| fiches vanne, conseil, vidéo | | 125, 124, 124 | OK |
| `/carnet` | | **97,8** | OK |
| `/profil`, `/favoris`, `/parcours` | | 138, 130, 132 | OK |

Les chiffres annoncés pour m3 dans REPLIT_ACTIONS (accueil 147, `/quiz-humour` 128, `/vannes` 136, article 133) sont retrouvés à l'octet affiché près. Lighthouse n'a pas été rejoué (non demandé ; voir la v1 pour les médianes).

## Ce qui n'a pas été joué en vrai

- Paiement Stripe réel et webhook de réussite : **[STATIQUE UNIQUEMENT : pas de clé Stripe de test, voulu]**.
- Envoi réel de l'e-mail de rappel : le vrai code du job a tourné sur la base jetable, avec un faux envoi (contenu lu, section 3).
- Bascule de novembre en production : simulée par horloge décalée côté serveur sur le même build, pas sur Cloudflare. Le contrôle 12 de REPLIT_ACTIONS reste à faire le 01/11 après 01:00 Paris (cache ISR des articles : 1re requête encore en octobre, confirmé en local).
- Safari et Firefox : non installés, Chromium seul (émulation mobile tactile).
- Lighthouse : non rejoué (seul le First Load JS était demandé).

## À faire, par qui

| # | Pour | Action |
|---|---|---|
| MJ-1 | @fullstack | `src` au bouton E1 (`carnet-page.tsx:105`), valeur `carnet` ajoutée aux sources connues ; test Playwright local « `/carnet` → E1 → `checkout-ouvert {src: carnet}` ». Voir avec @data-analyst s'il faut garder la source d'arrivée sur `/carnet` (`blog-demo-milieu-1`). |
| m-a | @design, @fullstack | Titre B2 sur 2 lignes à 320 px aussi (ou accepter 3 lignes à 320 et l'écrire). |
| m-b | @fullstack, @data-analyst | Un seul nom pour le bouton de la carte d'accueil connectée (`accueil-premium` partout). |
| m-c, m-d | @copywriter puis Thomas | Ligne « Déjà 1 500+ inscrits, et toi ? » pour un compte connecté ; corps de B2 pour l'abonné. Textes à valider à l'aveugle, pas de réécriture par @fullstack. |
| m-e | @fullstack | Surveiller `/parcours/[slug]` (150 Ko) : le prochain ajout le fera passer au-dessus. |

Aucun code applicatif modifié par cette QA, aucun test ajouté au dépôt (MJ-1 demande d'abord la correction ; le test est décrit ci-dessus).
