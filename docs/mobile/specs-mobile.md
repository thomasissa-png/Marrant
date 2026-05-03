# Specs fonctionnelles — V1 Mobile (iOS + Android)

> Specs produit pour la V1 mobile via Capacitor. Basées sur project-context.md + CLAUDE.md.
> Cible : ready-to-submit Apple App Store + Google Play Store.

## 1. Périmètre V1

### Inclus dans V1

- Wrapper Capacitor du site (export statique Next.js)
- Authentification (NextAuth JWT, cookies cross-site)
- Catalogue complet (vannes, conseils, vidéos, parcours, blog, quiz)
- Favoris synchronisés
- Push notification quotidienne (vanne du jour, 9h locale)
- Partage natif (vannes, conseils, vidéos via @capacitor/share)
- Achat IAP Premium (Apple + Google via RevenueCat)
- Restore purchases
- Onboarding mobile-first (3-5 écrans)
- Splash screen branded (max 2s)
- Status bar adaptée (thème violet, dark mode)
- Persistence offline minimale (favoris + dernier daily content)
- Deep linking universel (`deviensmarrant://...`)
- Page Compte > Mon abonnement (statut + lien gestion)
- Suppression de compte conforme RGPD

### Exclu V1 (V2 backlog)

- Apple Watch app
- Widget iOS / Widget Android
- Android TV
- Push segmenté (envoi par persona)
- Achat à l'unité de parcours
- Partage Stories Instagram natif
- App Tracking Transparency prompt (non requis V1)
- Période d'essai IAP (complexifie compliance)
- Localisation utilisateur pour heure push (V1 = 9h UTC+1 fixe)
- Mode sombre custom (suit le thème système)

## 2. Features mobile-spécifiques (détail)

### 2.1 Push notification quotidienne

- **Trigger** : cron serveur `/api/push/daily-joke` à 8h UTC chaque jour
- **Heure d'envoi** : 9h UTC+1 (heure FR) — V1 simplifié, pas de localisation
- **Contenu** : vanne du jour (titre + premiers mots du setup) + emoji + deep link vers `/vannes` + favori action button
- **Opt-in** : double opt-in obligatoire (toggle onboarding + prompt OS natif)
- **Token storage** : `users.pushTokens[]` array en DB (un user peut avoir plusieurs devices)
- **Fallback no-network** : silent fail, retry au prochain cron

### 2.2 Partage natif (@capacitor/share)

- **Vannes** : partage texte (setup + punchline + lien vers app)
- **Conseils** : titre + lien
- **Vidéos** : titre + lien YouTube
- **Articles blog** : titre + URL https://deviens-marrant.fr/blog/...

Format texte de partage standard : `"{contenu} — via Deviens Marrant {url}"`

### 2.3 Splash screen

- **Durée max** : 2 secondes
- **Asset** : logo blanc sur fond violet (#8B5CF6)
- **Variantes** : light + dark mode
- **Tailles** : générées via Capacitor resources (toutes les densités iOS + Android)

### 2.4 Onboarding mobile-first

5 écrans :
1. **Welcome** — "Tu vas devenir le pote drôle"
2. **Persona quiz court** — 3 questions (étudiant/actif/reconstruction) → détection persona
3. **Permission push** — "Tu veux la vanne du jour à 9h ?"
4. **Premier daily content** — vanne du jour offerte (sans login forcé)
5. **Login soft** — "Crée ton compte pour sauvegarder tes favoris" (skippable)

Différences avec onboarding web :
- Pas d'auth obligatoire à l'ouverture
- Persona quiz plus court (3 q vs 7 q web)
- Permission push à la place de cookie banner
- CTA conversion soft (Premium présenté en jour 3 via push, pas en onboarding)

### 2.5 Persistence offline

- **Favoris** : déjà en DB serveur, cachés localement via SWR
- **Dernier daily content** : caché 24h dans localStorage
- **Queue offline** : si utilisateur ajoute favori sans réseau, action queue → sync au retour réseau
- **Navigation offline** : pages déjà visitées restent accessibles (cache HTTP standard)

### 2.6 Deep linking

Universal links iOS + App links Android :
- `deviensmarrant://vanne/{id}` → page vanne
- `deviensmarrant://parcours/{slug}` → parcours
- `deviensmarrant://daily` → contenu du jour
- `deviensmarrant://compte` → page compte
- `https://deviens-marrant.fr/...` → ouvert dans l'app si installée (apple-app-site-association + assetlinks.json)

## 3. Features web masquées en mobile

| Feature | Raison |
|---|---|
| Header SEO complet (méga-menu) | Remplacé par bottom tab bar mobile |
| Footer SEO/legal long | Remplacé par menu Compte > Mentions légales |
| Cookie banner | Pas de cookies tiers en mobile (Umami self-hosted sans tracking) |
| OG tags | Non pertinents en native (rendu webview interne) |
| Bouton Stripe Checkout | Remplacé par CTA IAP RevenueCat |
| Lien "Gérer mon abonnement" Stripe | Remplacé par deeplink stores (Apple Subscriptions / Google Play Subscriptions) |
| Section "Voir tarifs sur le web" | Interdit Apple 3.1.1 — masqué en native |

Détection : `Capacitor.isNativePlatform() === true` → masquer ces éléments.

## 4. User stories (Given/When/Then)

### US-M1 — Onboarding persona detection
- **Persona** : Yanis 20 ans
- **Given** Yanis ouvre l'app pour la première fois
- **When** il complète le quiz 3 questions ("Quel âge ? Pourquoi tu veux progresser ? Tu utilises l'humour avec qui ?")
- **Then** l'app affiche un message personnalisé "Yo, on va te faire briller en soirée" et stocke `detectedPersona: "YANIS"` en localStorage

### US-M2 — Push opt-in
- **Persona** : Sophie 26 ans
- **Given** Sophie a complété le persona quiz
- **When** l'écran "Tu veux la vanne du jour à 9h ?" apparaît et elle tape "Oui, allez !"
- **Then** le prompt OS natif (iOS/Android) apparaît, et si elle accepte, le push token FCM/APNs est stocké en DB via POST `/api/push/register-token`

### US-M3 — Refus push (sans dégradation)
- **Given** Marc 34 ans n'aime pas les notifs
- **When** il tape "Plus tard" sur l'écran push
- **Then** l'app continue normalement, aucune restriction de feature, et un rappel apparaît à J+7 (subtil, dans le menu Compte)

### US-M4 — Achat IAP Premium iOS
- **Persona** : Yanis qui veut accéder aux parcours complets
- **Given** Yanis tape sur "Débloque tous les parcours"
- **When** il choisit le plan mensuel et tape "Acheter"
- **Then** le prompt Apple natif apparaît avec son Apple ID, après confirmation Face ID son abonnement est activé via webhook RevenueCat → `user.plan = PREMIUM` en DB en moins de 5 secondes

### US-M5 — Restore purchases
- **Given** Sophie a acheté le Premium sur son iPhone, puis a réinstallé l'app
- **When** elle tape "Restaurer mes achats" dans Compte > Abonnement
- **Then** RevenueCat retrouve son abonnement via Apple ID, le Premium est réactivé, message "Bon retour Sophie 👋"

### US-M6 — Partage natif
- **Given** Marc lit une vanne qui le fait rire
- **When** il tape l'icône partage
- **Then** la share sheet native iOS/Android s'ouvre avec le texte préformaté "{vanne} — via Deviens Marrant https://deviens-marrant.fr/vannes/{id}"

### US-M7 — Deep link
- **Given** Yanis reçoit une push notif quotidienne avec deep link
- **When** il tape la notif
- **Then** l'app s'ouvre directement sur la page de la vanne du jour (pas sur l'écran d'accueil)

### US-M8 — Offline favori queue
- **Given** Marc est dans le métro sans réseau
- **When** il tape "Favori" sur une vanne déjà chargée
- **Then** l'action est queue en localStorage, l'icône passe en favori avec un badge subtil "sync en attente", et au retour réseau l'action POST `/api/favorites` se déclenche automatiquement

### US-M9 — Suppression de compte conforme RGPD
- **Given** Sophie veut supprimer son compte
- **When** elle tape Compte > Données personnelles > Supprimer mon compte > confirme
- **Then** le compte est supprimé en DB (cascade), l'utilisateur est déconnecté, et un message rappelle "N'oublie pas d'annuler ton abonnement Apple/Google séparément"

### US-M10 — Daily content avec auth differée
- **Given** Yanis ouvre l'app pour la première fois après onboarding mais sans créer de compte
- **When** il consulte la vanne du jour
- **Then** il a accès complet (FREE limits) et un CTA soft "Crée un compte pour garder tes favoris" apparaît au bout de 3 vannes vues

## 5. États UI par écran clé

| Écran | Empty | Loading | Error | Success | Offline |
|---|---|---|---|---|---|
| Home (daily) | "Pas de daily aujourd'hui, reviens demain 👋" | Skeleton vanne + conseil + vidéo | "Connexion impossible. Retry." | Daily affiché | Daily caché 24h ou message "Reviens en réseau pour la fraîcheur" |
| Paywall mobile | N/A (toujours du contenu) | Spinner pendant init RevenueCat | "Achat impossible. Retry plus tard." | Toast "Bienvenue Premium 🎉" + redirect | "Achats indisponibles hors-ligne" |
| Onboarding | N/A | Spinner sur persona detection | Skip si erreur | Animation + message persona | Continue local, sync auth différée |
| Compte > Abonnement | "Pas encore Premium" + CTA IAP | Spinner statut RevenueCat | "Statut indisponible. Retry." | Statut + bouton manage | Cache dernier statut + "Mode hors-ligne" |
| Favoris | "Pas encore de favoris. Tape ❤️ sur une vanne." | Skeleton liste | "Erreur de chargement" | Liste favoris | Liste cachée locale |

## 6. Critères de validation V1 (binaires)

- [ ] L'app se lance sans crash sur iOS 15+ et Android 10+
- [ ] L'achat IAP fonctionne en sandbox sur iOS et Android sans crash
- [ ] Le push token est stocké en DB après opt-in
- [ ] Le push notif quotidienne arrive bien à 9h UTC+1 sur les 2 plateformes
- [ ] L'utilisateur peut restaurer son achat depuis Paramètres > Abonnement
- [ ] Le partage natif s'ouvre avec la share sheet iOS/Android et le texte préformaté
- [ ] La connexion NextAuth fonctionne dans le webview (cookies SameSite=None, Secure)
- [ ] Le deep link `deviensmarrant://vanne/{id}` ouvre la page correcte
- [ ] L'app passe les guidelines Apple 3.1.1 (aucun lien Stripe externe visible en native)
- [ ] L'app passe le Data Safety form Google sans incohérence
- [ ] Le splash screen ne dépasse pas 2 secondes
- [ ] La suppression de compte est irréversible et cascade sur toutes les tables
- [ ] L'app fonctionne offline pour les pages déjà chargées (favoris, daily caché)

## 7. Events analytics mobile

À tracker (Umami self-hosted, sans IDFA) :
- `mobile_app_open` (avec source : push, deep link, direct)
- `onboarding_started`
- `onboarding_completed` (avec persona détecté)
- `push_opted_in`
- `push_dismissed`
- `iap_initiated` (plan choisi)
- `iap_completed` (plan + plateforme)
- `iap_failed` (raison)
- `iap_restored`
- `share_native` (type contenu : vanne / conseil / vidéo / article)
- `deep_link_opened` (route)
- `offline_mode_entered`
- `account_deleted`

## 8. Différences UX web vs mobile

| Dimension | Web | Mobile |
|---|---|---|
| Header | Méga-menu complet | Bottom tab bar (Home / Catalogue / Compte) |
| Auth | Modal au besoin | Différée après onboarding |
| Paiement | Stripe Checkout | IAP via RevenueCat |
| Partage | Web Share API + boutons réseaux | Share sheet native exclusivement |
| Notifications | Aucune | Push notif quotidienne |
| SEO | OG tags, meta, canonical | Masqués (rendu webview interne) |
| Cookies | Banner RGPD | Aucun cookie tiers |
| Footer | Long, SEO | Court, menu Compte |
| Onboarding | 7 questions persona | 3 questions persona |
| Performance cible | LCP < 2.5s | TTI < 3s (boot Capacitor) |

## Handoff → @orchestrator

- **Fichier produit** : `docs/mobile/specs-mobile.md`
- **Décisions clés** :
  - V1 = wrapper enrichi (push + share + IAP + onboarding mobile-first), pas un simple WebView
  - 10 user stories couvrant tous les flows critiques
  - Détection `Capacitor.isNativePlatform()` partout pour masquer Stripe / SEO / cookies
  - Push notif simplifiée V1 (9h UTC+1 fixe, pas de localisation)
- **Points d'attention** :
  - NextAuth cookies cross-site = préalable critique pour Lot 1
  - RevenueCat = single source of truth pour Premium mobile
- **Prochaines étapes** : Lot 1 — @fullstack code, @design assets, @infrastructure push setup
