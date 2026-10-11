# Tunnel visiteur → inscrit → Premium (s15, 05/10/2026)

Constat Umami 180 j : 0 vue `/register` et `/onboarding`, `/login` 4, `/abonnement` 12, 3 retours `error=OAuthCallback`.
Cause principale : **toute l'inscription passait par une modale** (`AuthModal`), ouverte par des `<button>` : aucune URL, aucun lien dans le HTML serveur, aucune mesure possible, et aucune entrée « Connexion » hors de l'onglet de la modale.

## 1. Points d'entrée pour un anonyme (avant / après)

| # | Point d'entrée | Avant (anonyme) | Après |
|---|---|---|---|
| 1 | Header « Commencer » (desktop + menu mobile) | `<button>` → modale ; rien dans le HTML SSR ; pas de lien Connexion | Liens `<a>` dans le HTML serveur : « Connexion » → `/login?callbackUrl=<page>` et « Commencer » → `/register?callbackUrl=<page>&src=header` (desktop + menu mobile) |
| 2 | Accueil, hero | `<button>` → modale → `/onboarding` | Lien `/register?src=accueil-hero` → `/onboarding` |
| 3 | Accueil, bloc CTA final | `<button>` → modale → `/onboarding` | Lien `/register?src=accueil-cta` → `/onboarding` |
| 4 | Accueil, CTA Premium | `<button>` → modale → `/abonnement` | Lien `/register?callbackUrl=/abonnement&src=accueil-premium` |
| 5 | Accueil, fonctionnalités à venir | `<button>` → modale | Vote anonyme → `/register?src=accueil-vote` |
| 6 | Fin d'article blog (`ArticleCta`) | `<button>` → modale → `/onboarding?src=blog-<slug>` ; `src` jamais mesuré | Lien `/register?callbackUrl=/onboarding&src=blog-<slug>` (1 page, `src` mesuré) |
| 7 | `/quiz-humour` (résultat) | `<button>` → modale → parcours recommandé | Lien `/register?callbackUrl=<parcours recommandé>&src=quiz` |
| 8 | `/parcours` (liste) | `<button>` → modale → `/parcours/<slug>` | `/register?callbackUrl=/parcours/<slug>&src=parcours` |
| 9 | `/parcours/<slug>` (étape) | `<button>` → modale → `/parcours/<slug>` | Lien `/register?callbackUrl=/parcours/<slug>&src=parcours-etape` |
| 10 | `/abonnement` compte gratuit | `<button>` → modale → `/onboarding` | Lien `/register?src=abonnement-gratuit` → `/onboarding` |
| 11 | `/abonnement` « Commencer à 2,99 € » | `<button>` → modale → `/abonnement?plan=…` (formule conservée) | Lien `/register?callbackUrl=/abonnement?returnTo=…&plan=annual&src=abonnement` : formule et intention retrouvées |
| 12 | Limite FREE / favoris (`PremiumModal`) | `<button>` → 2e modale → `/abonnement` | Lien `/register?callbackUrl=/abonnement?returnTo=<page>&src=modale-<raison>` |
| 13 | `/vannes` bandeau | `<button>` → modale → `/onboarding?callbackUrl=/vannes` | Lien `/register?callbackUrl=/vannes&src=vannes` |
| 14 | Fiches vanne / conseil / vidéo | lien `/register` (1 saut) mais retour à la fiche perdu | `/register?callbackUrl=/<type>/<slug>&src=fiche-<type>` : retour à la fiche |
| 15 | Exercice réservé (fiche vanne) | lien `/register`, retour perdu | `/register?callbackUrl=<fiche>&src=exercice-vanne` |
| 16 | `/favoris`, `/profil` anonyme | lien `/login` sans retour ni « Créer un compte » | `/login?callbackUrl=/favoris` (ou `/profil`) ; /login propose « Créer un compte » |
| 17 | `/onboarding` tapé directement | 307 `/api/auth/signin` → 302 `/login` (2 sauts, page Connexion) | 307 direct `/register?callbackUrl=/onboarding…&src=…` (1 saut) ; `/profil`, `/favoris` → `/login?callbackUrl=…` (1 saut) |
| 18 | `/a-propos` | `<button>` → modale → `/onboarding` | Lien `/register?callbackUrl=/&src=a-propos` → `/onboarding` |

Vérifié sur le build : `index.html`, `quiz-humour.html`, l'article n°1, `/login` et `/register` contiennent les liens `/register` et `/login` dans le HTML serveur (avant : aucun sur ces pages).

## 2. Correctifs

- `AuthModal` supprimée (plus aucun usage) ; helper unique `lib/auth-links.ts` (`buildRegisterUrl`, `buildLoginUrl`, `src` filtré `[a-z0-9-]`, 120 car., jamais de donnée libre).
- `/login` et `/register` : formulaire rendu dans le HTML serveur (fallback de Suspense), liens croisés qui gardent `callbackUrl` et `src`.
- Middleware : `/onboarding` anonyme → `/register` (avant 2 sauts vers « Connexion ») ; `withAuth.pages.signIn = /login`.
- Après inscription : règle inchangée (`getPostSignupRedirect`) : `/abonnement…` et `/parcours/<slug>` directs, sinon `/onboarding`.

## 3. OAuthCallback (Google)

Mesures prod (curl, 05/10) : `POST /api/auth/signin/google` envoie `redirect_uri=https://deviens-marrant.fr/api/auth/callback/google` (correct, domaine nu = `NEXTAUTH_URL`), pose `__Secure-next-auth.state` et `…pkce.code_verifier` (Secure, SameSite=Lax, Path=/, 15 min). `www` → 301 vers le domaine nu avant tout.
- Callback **sans** ces cookies → `/login?callbackUrl=https://deviens-marrant.fr&error=OAuthCallback`, **exactement l'URL vue dans Umami**. Avec les cookies (code bidon) → `callbackUrl=…/onboarding` : le code atteint bien l'échange de jeton chez Google (+0,5 s).
- **Cause** : retour de Google sans les cookies NextAuth : navigateur intégré d'une appli (Instagram, TikTok, Messenger…), consentement > 15 min, ou URL de retour rejouée. Pas de bug de code ni de `redirect_uri` (une erreur de console Google afficherait une page Google, sans retour sur le site).
- **Code** : message clair sur `/login` et `/register` (ouvrir dans le navigateur, ou passer par l'email).
- **Action Thomas (5 min, après déploiement)** : (1) Google Cloud Console > Identifiants > client OAuth `934712068626-…` : vérifier que l'URI de redirection autorisée est exactement `https://deviens-marrant.fr/api/auth/callback/google` et que l'écran de consentement est « En production » ; (2) faire une inscription Google réelle sur mobile (Safari et Chrome) ; (3) si un `OAuthCallback` revient : `npx wrangler tail` et chercher `[NextAuth][Error] OAUTH_CALLBACK_ERROR` (le message dit « State cookie was missing » ou autre).

## 4. Événements Umami (aucune donnée personnelle)

| Événement | Données | Où |
|---|---|---|
| `inscription-envoi` | methode email/google, src | `/register` (envoi valide ou clic Google) |
| `inscription-reussie` | methode, src | email : après connexion auto ; Google : retour marqué `?auth=inscription-google` (AuthReturnTracker) |
| `connexion-reussie` | methode | `/login` email ; Google : `?auth=connexion-google` |
| `onboarding-termine` | parcours recommandé | fin du quiz `/onboarding` |
| `abonnement-clic` | formule mensuel/annuel, src (abonnement, accueil, modale-<raison>) | départ vers Stripe (connecté) |
| `abonnement-reussi` | formule | `/abonnement/success` une fois le Premium confirmé (`formule=annuel` ajouté au `success_url` annuel) |
| `abonnement-annule` | aucune | retour `?upgrade=cancel` |
| `quiz-termine` | profil | fin de `/quiz-humour` |
| `parcours-etape` | parcours, etape | étape validée |

Limite connue : Google ne dit pas si le compte existait ; `inscription-reussie` Google = clic depuis `/register`, `connexion-reussie` = clic depuis `/login`.

## 5. Textes visibles modifiés (rien d'autre)

1. Header (desktop + menu mobile, anonyme) : ajout du lien « Connexion ». « Commencer » inchangé.
2. `/login` : « Pas de compte ? Inscris-toi » → « Pas encore de compte ? » + bouton « Créer un compte ».
3. `/login`, erreur OAuthCallback : « La connexion avec Google a calé en route. Réessaie. » → « La connexion avec Google n'a pas abouti. Si tu viens d'une appli (Instagram, TikTok, Messenger…), ouvre le site dans ton navigateur puis réessaie, ou connecte-toi avec ton email. »
4. `/register`, même erreur : « L'inscription avec Google a calé en route. Réessaie. » → « L'inscription avec Google n'a pas abouti. Si tu viens d'une appli (Instagram, TikTok, Messenger…), ouvre le site dans ton navigateur puis réessaie, ou crée ton compte avec ton email juste en dessous. »

