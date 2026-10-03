# Audit de l'offre Premium (s14, 03/10/2026)

> Auteur : @product-manager. Base : décisions Thomas du 01/10 (Premium 4,99 €/mois, annuel 39,99 €, audit de l'offre, plafond IA). Les `[CHOIX UTILISATEUR]` de `docs/founder-preferences.md` ne sont pas rouverts. Preuves au format `fichier:ligne` (chemins relatifs à `apps/web/src/`). Personas : `docs/strategy/personas.md` (Yanis principal, Sophie, Marc).
> Limites de l'audit : 2 abonnés seulement, donc aucune donnée de conversion ni d'usage. Tout score de priorité est un jugement `[HYPOTHÈSE : à valider]`, pas une mesure. Le tool de recherche texte n'était pas disponible : les occurrences de chiffres en dur ailleurs que dans les fichiers cités restent à lister par @fullstack (voir 2.3).

## 1. Verdict en 5 lignes

1. Le mur payant actuel est faible : la quasi-totalité du catalogue est lisible sans compte (liste paginée rendue côté serveur + fiches publiques), et le verrou des étapes 2+ des parcours ne protège que la validation (XP), pas le contenu, qui est envoyé à tout visiteur.
2. Les pages de vente promettent ce qui est gratuit (« contenu quotidien », « toutes les vannes », filtres) et taisent ce qui est vraiment payant (les parcours ne figurent pas dans les puces de `/abonnement`).
3. Il n'existe aucun contenu récurrent réservé aux abonnés : les 3 parcours totalisent 13 étapes (3+4+6, soit environ 3 mois à une étape par semaine), puis plus rien de neuf. Un abonnement annuel à 39,99 € vendu avant d'avoir réglé ce point fabrique de la déception au renouvellement.
4. La fonction IA membres (`/api/ai`) doit être coupée pour la vanne et le conseil (incompatibles avec la barre Alexa et « aucune IA ne produit seule ») ; seule l'analyse de répartie a une valeur persona forte, et elle ne se branche qu'avec plafond (15 par mois proposé) et exception validée par Thomas.
5. Reco : catalogue ouvert (acquisition, SEO), Premium = parcours complets réellement protégés + carnet de répartie mensuel préparé + favoris, annuel lancé une fois ce contenu récurrent défini ; l'affirmation « ~2 mois offerts » est arithmétiquement fausse (39,99 € = environ 4 mois offerts) et doit être corrigée avant publication.

## 2. Gratuit / Premium aujourd'hui

### 2.1 Tableau des droits réels (code)

| Élément | Visiteur sans compte | Compte gratuit | Premium | Preuve |
|---|---|---|---|---|
| Vanne, conseil, vidéo du jour | Oui | Oui | Oui | `app/api/daily/route.ts:16-37` (aucun contrôle de plan) |
| Liste vannes interactive | 10 vannes | 10 vannes | Toutes | `app/api/jokes/route.ts:42,76,108` ; bandeau `components/vannes/vannes-list.tsx:198-218` |
| Liste conseils interactive | 3 | 3 | Tous | `app/api/tips/route.ts:41,67,99` |
| Liste vidéos interactive | 3 | 3 | Toutes | `app/api/videos/route.ts:40,58,120` |
| Catalogue complet en HTML (liste paginée + fiches) | Oui, tout le catalogue actif | Oui | Oui | `lib/catalogue-pages.ts:20-23` (« Données PUBLIQUES »), `components/vannes/vannes-list.tsx:432-441` (pagination sur le total serveur), `app/(dashboard)/vannes/page.tsx:72,116` |
| « À toi de jouer » (vanne), exercice (conseil), apprentissages (vidéo) | Non (CTA compte) | Oui | Oui | `components/vannes/how-to-apply-gate.tsx:18-38`, `lib/catalogue-pages.ts:152,188` |
| Filtre par catégorie (vannes) | Verrouillé (UI) | Verrouillé (UI) | Oui | `components/vannes/vannes-list.tsx:221-246` ; mais l'API accepte `category` et `q` pour tous : `app/api/jokes/route.ts:45-61` ; pages thème publiques : `vannes/page.tsx:116` |
| Favoris (ajout) | Non | Non (403) | Oui | `app/api/favorites/route.ts:48-58` |
| Parcours, étape 1 | Lecture | Lecture + validation + XP | Idem | `lib/parcours-access.ts:13`, `components/parcours/parcours-detail.tsx:492` |
| Parcours, étapes 2+, contenu | **Envoyé à tous** (masqué à l'écran) | **Envoyé à tous** | Affiché | `app/api/parcours/by-slug/[slug]/route.ts:128-181` (aucun filtrage), `app/(dashboard)/parcours/[slug]/page.tsx:227-264` (`initialPath` complet dans la page), masquage seulement dans `parcours-detail.tsx:600-610` |
| Parcours, étapes 2+, validation (XP, progression) | Non | Non (403) | Oui | `app/api/parcours/[id]/progress/route.ts:107-120` |
| Fonction IA membres | Non | Non (403) | API seule, aucune interface | `app/api/ai/route.ts:67-72`, quota `:79` |
| Formule annuelle | N/A | N/A | N/A | Absente : un seul `PREMIUM_PRICE_ID` (`lib/stripe.ts:24`), un seul article au checkout (`lib/stripe.ts:96-101`), page mensuelle seule (`app/(dashboard)/abonnement/page.tsx:101-103`) |

Ce que voit l'utilisateur : le compte gratuit affiche 10 vannes puis des cartes floutées « Débloquer » (`vannes-list.tsx:382-413`), mais un clic sur « Page dédiée » ou un passage par Google donne accès à toute vanne. Pour les parcours, l'étape 2 s'ouvre sur « Cette étape fait partie de l'accès complet : la première est offerte » (`parcours-detail.tsx:603`) avec un bouton vers `/abonnement`, page qui ne cite pas les parcours.

### 2.2 Promesses des pages vs réalité (écarts = risques)

| # | Promesse (preuve) | Réalité | Risque |
|---|---|---|---|
| E1 | « Contenu quotidien : vanne + conseil + vidéo chaque jour » listé comme avantage payant (`abonnement/page.tsx:134-140`, `components/premium/premium-modal.tsx:85-91`) | Public pour tous (`api/daily/route.ts:16-37`) ; contenu désormais préparé par calendrier trimestriel (CHOIX 30/09) | Promesse payante gratuite : l'abonné ne voit aucune différence. Atteinte à la confiance. |
| E2 | « Toutes les vannes / tous les conseils / toutes les vidéos » (`abonnement/page.tsx:110-133`, `premium-modal.tsx:55-78`) | Tout est lisible en fiches publiques ; le verrou ne porte que sur la liste interactive | L'argument central de l'achat est contournable en un clic. Faible valeur perçue. |
| E3 | Les parcours sont absents des puces de `/abonnement` (`abonnement/page.tsx:109-154`) et de la modale (`premium-modal.tsx:54-92`), alors que `components/marketing/premium-paywall.tsx:111,155` les cite | C'est le seul contenu réellement différenciant pour Yanis (répartie guidée) | Le visiteur qui clique « S'abonner » depuis une étape 2 arrive sur une page qui ne parle pas de ce qu'il cherche. Perte de conversion directe. |
| E4 | « Filtres avancés : catégorie, niveau, recherche » (`abonnement/page.tsx:144-146`, `premium-modal.tsx:79-84`) | Pas de filtre « niveau » dans les vannes (`vannes-list.tsx:44-58`) ; `recherche` et `category` ouverts côté API ; pages thème publiques | Promesse en partie inexistante, en partie gratuite. |
| E5 | Compteurs « 550+ autres vannes » codé en dur (`app/(dashboard)/vannes/[slug]/page.tsx:93-94`) ; chiffres du CHOIX 29/09 « 550+ vannes, 350+ conseils » | Catalogue actif = 125 vannes validées (CHOIX 30/09), conseils ~109 | Chiffre faux sur toutes les fiches vannes (SEO + confiance). Les compteurs dynamiques (`lib/content-stats-server.ts:38-42`) se corrigent seuls, pas les textes en dur. |
| E6 | « Sans engagement, annule en 1 clic depuis ton profil » (`lib/faqs.ts:28-31`) | Portail Stripe présent (`app/api/stripe/portal/route.ts`, `lib/stripe.ts:115-124`) ; le bouton du profil n'a pas été vérifié dans cet audit | À confirmer par @qa avant de garder la promesse. |
| E7 | Promesse historique « nouveaux contenus chaque semaine » (cible Marc : variété) | Rien de neuf réservé aux abonnés ; blog hebdomadaire gratuit | Churn probable après les 13 étapes ; annuel exposé. |
| E8 | Textes d'erreur de l'API IA : « générations IA », « L'IA fait une petite pause » (`api/ai/route.ts:83,117`) | CHOIX 06/05 : aucune mention d'IA dans les contenus | À réécrire si la fonction est branchée. |

### 2.3 Chiffres en dur et alignement

Actions à confier à @fullstack (sans modifier sans GO de Thomas, CHOIX 29/09 « aucun chiffre retiré sans GO ») : lister toutes les occurrences de « 550+ », « 350+ », « 290+ », « 60+ », « 80+ » dans `src/`, `docs/content/`, `llms-content.ts`, FAQ et articles ; `project-context.md:34` cite encore « 290+ vannes, 60+ conseils, 80+ vidéos ».
Hors périmètre Premium mais signalé : `vannes/page.tsx:155` et `conseils/page.tsx:139` nomment des humoristes, ce qui contredit le CHOIX 30/09 « zéro humoriste nommé » (exception : fiches vidéo).

<!-- SUITE -->
