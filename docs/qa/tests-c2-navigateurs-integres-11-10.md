# Tests C2 : navigateurs intégrés Instagram, X, LinkedIn (site en ligne) : 11/10/2026

> @qa, dim. 11/10/2026, 05:53 à 05:57 UTC. Cible : https://deviens-marrant.fr (code en ligne ce matin). Version Worker `8e377821` : reprise du brief et de `REPLIT_ACTIONS.md`:62, **non lisible depuis le navigateur `[À VÉRIFIER]`**.
> Outil : Playwright 1.56.1, Chromium 1194 (headless), profil `devices["iPhone 13"]` (390 x 844, tactile, `fr-FR`), agent utilisateur remplacé par réseau. Tout ce qui suit est **[LIVE]** (navigateur et API réels, sortie observée), sauf mention `[STATIQUE]`.
> Scripts et captures : scratchpad de session (`c2-detect.mjs`, `c2-d8.mjs`, `c2-db.mjs`, dossier `c2/`), hors dépôt.

## 1. Agents utilisateurs émulés

| Réseau | Agent utilisateur (iOS 18.6, iPhone) | Marqueur attendu par `lib/in-app-browser.ts` |
|---|---|---|
| Instagram | `… Mobile/15E148 Instagram 395.0.0.24.82 (iPhone16,2; iOS 18_6; fr_FR; fr; scale=3.00; 1290x2796; 772143611)` | `Instagram` |
| X | `… Mobile/15E148 Twitter for iPhone/11.12` | `Twitter` |
| LinkedIn | `… Mobile/15E148 [LinkedInApp]/9.31.3256` | `LinkedInApp` |
| Safari iOS (témoin) | `… Version/18.6 Mobile/15E148 Safari/604.1` | aucun |

Format des agents = format public des applications iOS ; numéros de build représentatifs, non relevés sur un appareil `[À VÉRIFIER]` (Thomas, 05/10 : pas de test sur téléphone). Umami bloqué pendant les tests de détection (aucune pollution des statistiques) ; Umami réel seulement pour le §3.

## 2. Détection, Google, ordre e-mail / Google, liens de bio (05:53 à 05:54 UTC)

| Réseau | Lien de bio | Liens internes : `utm_source` juste / `utm_campaign=bio` | `/register` : message + « Copier le lien » + « Ouvrir dans mon navigateur » | `/register` : Google | `/login` : message + 2 boutons | `/login` : Google | E-mail avant Google (DOM et écran) |
|---|---|---|---|---|---|---|---|
| Instagram | `/liens` 200 | 7/7, 7/7 (`instagram`) | oui (« Google n'accepte pas l'inscription depuis cette application… ») | **désactivé** (`disabled`, `aria-describedby=google-in-app-notice`) | oui (variante connexion) | **désactivé** | oui / oui (e-mail y=269, Google y=481 ; login 141 / 333) |
| X | `/liens/x` 200 | 7/7, 7/7 (`x`) | **non** (aucun message) | **actif** | **non** | **actif** | oui / oui (269 / 481 ; login 175 / 367) |
| LinkedIn | `/liens/li` 200 | 7/7, 7/7 (`linkedin`) | oui | **désactivé** | oui | **désactivé** | oui / oui (269 / 481 ; 141 / 333) |
| Safari (témoin) | `/liens` 200 | 7/7, 7/7 (`instagram`) | non (attendu) | **actif** (attendu) | non (attendu) | **actif** (attendu) | oui / oui |

- Attribution posée à l'arrivée par le lien de bio : `sessionStorage["marrant-origine"]` = `instagram`, `x`, `linkedin` selon le réseau. Bouton « Ouvrir dans mon navigateur » : `https://deviens-marrant.fr/register?origine=instagram` (et `…/login?origine=…`, `?origine=linkedin`) : l'origine suit la bascule. Sur iOS, « Copier le lien » passe en premier (conforme au composant).
- `utm_content` : 6 valeurs (`bio-quiz`, `bio-article`, `bio-vanne`, `bio-parcours`, `bio-vannes`, `bio-conseils`) sur 6 liens de bloc ; le 7e lien (logo vers `/`) porte `utm_source`, `utm_medium`, `utm_campaign=bio` sans `utm_content` (`liens-page-content.tsx`:86, logo hors bloc) : sans effet sur `origine`.
- **X : écart avec la consigne du brief, conforme au code et au plan.** Aucun message, Google actif : c'est le réglage `GOOGLE_BLOQUE_PAR_APP.x = false` (`config/in-app-browser.ts`, `[HYPOTHÈSE]` : X ouvre un onglet système où Google fonctionne) et la règle du plan (`plan-execution-s15.md`, ligne « Tests C2 » : « Google désactivé seulement si l'échec est reproduit »). L'échec Google dans X n'a pas été reproduit (impossible en émulation : le refus `disallowed_useragent` vient de Google sur appareil). La détection X elle-même n'a pas d'effet visible dans ce cas ; elle est couverte par les tests unitaires `[STATIQUE]` (`__tests__/lib/in-app-browser.test.ts`). Bascule possible : une ligne (`x: true`), décision Thomas, puis @fullstack.
- Observation visuelle (captures lues) : sur Instagram et LinkedIn, le message s'affiche **sous** le bouton Google désactivé et sous les mentions de paiement et de CGU (bas de la carte, encore dans les 844 px de l'écran) ; l'utilisateur voit le bouton grisé avant l'explication. Non bloquant pour C2 (le formulaire e-mail est en premier) ; signalé à @ux.

## 3. Inscription e-mail réelle et preuve D8 (05:55:27 à 05:56:21 UTC)

**Lecture du code avant le test `[STATIQUE]`** : `api/auth/register/route.ts` crée le `User` (zod, limite 5 par IP et par heure), **n'envoie aucun e-mail** ; `lib/auth.ts` : `events` ne journalise que ; aucun e-mail au checkout. Effet de bord connu : `createCheckoutSession` crée un **client Stripe live** (`getOrCreateStripeCustomer`), aucune écriture en base hors `User`. Aucun traitement de `checkout.session.expired` dans les webhooks.

**Parcours (navigateur intégré Instagram émulé)** : `/liens` puis bloc quiz (`/quiz-humour?utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_content=bio-quiz`) puis `/register` (message navigateur intégré affiché) ; prénom `Testqa`, e-mail **`qa-c2-20261011-instagram@example.com`** (domaine réservé, accepté), mot de passe aléatoire non conservé ; « Créer mon compte ».

| Étape | Heure UTC | Résultat |
|---|---|---|
| `POST /api/auth/register` | 05:55:37 | **201**, id **`cmv3et6cj0000x61i6jrukckx`**, plan `FREE` |
| Base Neon, table `User`, e-mail exact | 05:55:55 | 1 ligne, `createdAt` 05:55:36.931 ; **total 14 avant, 15 après** ; aucune ligne liée (`userId`) |
| Redirection | 05:55:39 à 05:55:40 | `/abonnement?auto=1` puis `POST /api/stripe/checkout` **200** puis **`checkout.stripe.com/c/pay/cs_live_…`** : écran « S'abonner à Deviens-marrant.fr, 2,99 € par mois », e-mail prérempli. **Arrêt, aucun paiement.** |
| Suppression ciblée (e-mail exact ET id) | 05:56:37 | `DELETE` 1 ligne ; lignes liées supprimées : 0 ; **total 15 avant, 14 après** ; 0 ligne restante pour cet e-mail |
| Stripe (lecture seule) | 05:57 | **client live `cus_VQ5vmmsBTa8djr` resté**, créé 05:55:39, `metadata.userId` = id ci-dessus ; 1 session Checkout ouverte (expire seule sous 24 h). **Non supprimé** (hors périmètre « ne touche à rien d'autre ») : à soustraire des clients Stripe de la baseline 2 ou à supprimer par Thomas |

**Requêtes Umami capturées** (`POST https://gateway.umami.is/api/send`, site `5dcbf24f-…`, toutes **200**) :

| Heure UTC | Événement | URL | `origine` / `contenu` | Autres propriétés |
|---|---|---|---|---|
| 05:55:36.772 | `inscription-envoi` | `/register` | instagram / bio-quiz | `methode: email`, `src: direct`, `etape: abonnement` |
| 05:55:38.956 | `inscription-reussie` | `/register` | instagram / bio-quiz | idem |
| 05:55:39.347 | `abonnement-vu` | `/abonnement?auto=1` | instagram / bio-quiz | `src: direct` |
| 05:55:39.598 | `abonnement-clic` | `/abonnement` | instagram / bio-quiz | `formule: mensuel`, `declencheur: auto`, `statut: membre` |
| 05:56:07.485 | `abonnement-vu` (arrivée `/liens/x`, sans compte) | `/abonnement` | x / bio-quiz | `src: direct` |
| 05:56:20.217 | `abonnement-vu` (arrivée `/liens/li`, sans compte) | `/abonnement` | linkedin / bio-quiz | `src: direct` |

Plus 11 pages vues de test (`/liens`, `/liens/x`, `/liens/li`, 3 x `/quiz-humour?utm_…`, `/register`, 4 x `/abonnement`).

**Réception confirmée par l'API Umami** (`api.umami.is/v1`, clé `UMAMI_API_KEY` présente) : `events` sur 05:50 à 06:10 UTC = **17 lignes, toutes du test** (6 événements nommés aux heures ci-dessus, navigateur classé `ios-webview`, pays US) ; `event-data/values`, propriété `origine` : `abonnement-vu` = linkedin 1, x 1, instagram 1 ; `inscription-reussie` = instagram 1. Consigné dans `docs/social/mesure.md` §6 (cases D8 + ligne datée : événements exclus des relevés, soustraits de la baseline 2).

## 4. Verdict C2 par réseau

| Réseau | E-mail avant Google en navigateur intégré | Google | Liens de bio (UTM) | Inscription e-mail | Preuve D8 | **Verdict C2** |
|---|---|---|---|---|---|---|
| Instagram | PASS | désactivé + message + 2 boutons : PASS | PASS | **PASS** (de bout en bout jusqu'à Stripe) | PASS, 05:55:36 UTC | **PASS** |
| X | PASS | actif (réglage `x: false`, échec Google non reproduit) : conforme au plan, **écart avec le brief** | PASS | non refaite (même formulaire, même route ; la détection X ne change rien au formulaire) | PASS, 05:56:07 UTC | **PASS** (réserve : Google actif dans X par conception) |
| LinkedIn | PASS | désactivé + message + 2 boutons : PASS | PASS | non refaite (même rendu qu'Instagram) | PASS, 05:56:20 UTC | **PASS** |
| Safari (témoin) | PASS | actif : PASS | PASS | sans objet | sans objet | témoin conforme |

Limites : émulation Chromium d'agents iOS, pas de WebKit ni d'application réelle (test sur appareil renoncé, Thomas 05/10) ; le refus réel de Google dans chaque application n'est pas reproductible ici.
