# Audit UX du tunnel visiteur vers paiement Premium (s14, 03/10/2026)

Périmètre : de l'arrivée (blog, Instagram `/liens`, accueil) jusqu'à la première valeur Premium. Décision Thomas du 01/10 : rendre la valeur payante évidente.
Contexte lu : `project-context.md` (persona Yanis, MRR 1 000 €), `docs/founder-preferences.md` (lignes `[CHOIX UTILISATEUR]` des 29/09, 30/09, 01/10).
Aucun fichier de code modifié. Le site de production n'a pas pu être consulté (aucun outil HTTP dans cette session) : tout ce qui suit vient du code du repo, à confirmer en prod par @qa.
Hors périmètre non audité : listes `/conseils` et `/videos` (quota gratuit de 3), page `/profil`, API `/api/jokes` (seule la constante d'affichage `FREE_JOKE_LIMIT_UI` a été lue).

## 0. Verdict en 5 lignes

1. Le tunnel fonctionne techniquement, mais la valeur payante n'est dite nulle part clairement : les parcours (étapes 2+), seul vrai mur décidé en s14, sont absents de `/abonnement` et de la modale Premium.
2. Un CTA payant mène à un quiz gratuit : « Commencer à 4,99 €/mois » de l'accueil perd l'intention (F1).
3. Deux textes mentent depuis le passage à 4,99 € : « moins qu'un café par mois » (F2).
4. La liste Premium vend du gratuit : « Contenu quotidien » est ouvert à tous, anonymes compris (F3).
5. Après paiement, l'abonné atterrit sur `/vannes`, pas sur ce qu'il venait débloquer (F4).

## 1. Carte du parcours actuel

```
ENTRÉES
 A. Blog (article-cta.tsx)   : [Essaie gratuitement] -> modale inscription -> /onboarding
                               [Tout débloquer à 4,99 €/mois] -> /abonnement
 B. Instagram (/liens)       : article | vanne du jour | Répartie | Vannes | Conseils (UTM bio). Aucun CTA compte ni Premium.
 C. Accueil                  : Hero [Créer mon compte gratuit] -> modale -> /onboarding
                               HomeCta (idem) ; PremiumCta #offres [Commencer à 4,99 €/mois] -> modale -> /onboarding (F1)
 D. Catalogue /vannes        : bandeau anonyme [Créer mon compte] / [Tout débloquer] -> /abonnement
                               cartes verrouillées + étoile favoris -> PremiumModal
 E. Parcours /parcours/[slug]: étape 1 libre ; valider = compte ; étapes 2+ = mur -> /abonnement

INSCRIPTION (modale prioritaire, /register en repli)
 getPostSignupRedirect (safe-callback.ts:60) : pas de callback = /onboarding ; /abonnement ou /parcours/* = direct

ONBOARDING  /onboarding : quiz 3 questions -> parcours recommandé -> /parcours/[slug]  (lien discret /abonnement)

PAYWALL     /abonnement : anonyme = bloc gratuit + bloc 4,99 € ; connecté = un seul bloc + [Active mon accès]
            -> POST /api/stripe/checkout (401 si session absente) -> Stripe

PAIEMENT    Stripe -> /abonnement/success (sondage 2 s, 15 essais max) -> /vannes?upgrade=success

PREMIÈRE VALEUR PREMIUM : liste /vannes avec filtres. Aucun message de bienvenue, aucune action suggérée
 (le paramètre upgrade=success n'est lu ni dans vannes/page.tsx ni dans vannes-list.tsx).
```

Nombre d'actions pour Yanis venu d'une vanne Instagram jusqu'à l'étape 2 débloquée : lien bio, fiche vanne, inscription (modale, 3 champs), quiz (3 réponses + résultat), parcours, ouvrir étape 1, valider (quiz d'étape), paywall, `/abonnement`, bouton, Stripe : plus de 14 actions, aucune ne rappelle ce que le paiement ouvre.

### Cognitive walkthrough (first-time user, 3 parcours critiques)

| Étape | Sait-il quoi faire ? | Verdict |
|---|---|---|
| Hero : « Créer mon compte gratuit » puis « Puis 4,99 €/mois pour tout débloquer » (hero-section.tsx:63-66) | Oui, mais « tout » ne dit pas quoi | [FRICTION H2] le first-time user ne sait pas ce que « tout » contient. Solution : nommer le mur réel (étapes de parcours). |
| Parcours : étapes 2+ affichées « Termine l'étape 1 pour débloquer » (parcours-detail.tsx:569-573) | Il croit que c'est gratuit | [FRICTION H1] le mur payant n'apparaît qu'à l'ouverture de l'étape 2. Solution : badge « Accès complet » dès l'en-tête. |
| Étoile favoris sur une carte (favorite-button.tsx:32-34) | Il veut sauvegarder une vanne | [FRICTION H5] une modale de paiement s'ouvre sans prévenir. Solution : libellé accessible + titre de modale contextuel. |
| Clic « Commencer à 4,99 €/mois » (premium-cta.tsx:119-126, modale sans callback l.201-205) | Il veut payer | [FRICTION H3] il arrive sur un quiz gratuit. Solution : callbackUrl `/abonnement`. |
| Succès de paiement (success/page.tsx:87) | Il attend ce qu'il a acheté | [FRICTION H1] atterrit sur la liste de vannes. Solution : retour à l'intention d'origine. |

## 2. Frictions classées par gravité

Gravité : P0 = perte de conversion ou promesse fausse, à corriger avant tout ; P1 = valeur non lisible ; P2 = polish et cohérence.

### P0

| # | Friction | Preuve |
|---|---|---|
| F1 | Le CTA payant de l'accueil mène à l'onboarding gratuit : l'intention « payer » est perdue (la modale n'a pas de `callbackUrl`, donc `getPostSignupRedirect(undefined)` renvoie `/onboarding`). `/abonnement` fait bien `openAuth("/abonnement")`. | `components/home/premium-cta.tsx:119-126` et `:201-205` ; `lib/safe-callback.ts:60-62` ; contre-exemple correct `app/(dashboard)/abonnement/page.tsx:173` |
| F2 | « moins qu'un café par mois » est faux à 4,99 € (vrai à 0,99 €). Atteint les deux points de décision les plus lus : le mur de parcours et le CTA d'accueil. À chercher aussi dans le reste du repo (articles, llms, FAQ) : recherche de contenu non faisable ici (Grep désactivé). | `components/parcours/parcours-detail.tsx:603` ; `components/home/home-cta.tsx:28` |
| F3 | Les parcours (le mur décidé en s14) ne figurent pas dans la liste d'avantages de `/abonnement` ni de la modale Premium. Seule la carte d'accueil les cite, en avant-dernière puce, sans dire que l'étape 1 est offerte. | `abonnement/page.tsx:109-154` ; `premium/premium-modal.tsx:54-92` ; `home/premium-cta.tsx:98-101` |
| F4 | Après paiement : redirection vers `/vannes?upgrade=success`, jamais vers l'étape 2 du parcours qui a déclenché l'achat. Aucune mémoire de l'intention : le checkout ne reçoit aucun paramètre. Le paramètre `upgrade=success` n'est pas exploité dans les fichiers lus (pas de message de bienvenue). | `abonnement/success/page.tsx:87` ; `api/stripe/checkout/route.ts:7-28` ; `vannes/page.tsx` et `vannes-list.tsx` (aucune lecture de `upgrade`) |
| F5 | La liste Premium vend du gratuit : « Contenu quotidien : vanne + conseil + vidéo chaque jour » et « Contenu du jour » sont présentés comme payants alors que l'accueil les montre en entier aux anonymes et que le compte gratuit les promet. Contradiction visible sur la même page. | payant : `abonnement/page.tsx:137`, `premium-modal.tsx:88`, `premium-cta.tsx:88` ; gratuit : `abonnement/page.tsx:76`, `article-cta.tsx:72`, `home/daily-content.tsx` (aucun verrou) |

### P1

| # | Friction | Preuve |
|---|---|---|
| F6 | Le mur de parcours est invisible avant l'étape 2 : seule l'étape 1 porte « Essai gratuit » ; les suivantes affichent « Termine l'étape 1 pour débloquer », comme si c'était gratuit. Ni la page parcours, ni la liste, ni le résultat du quiz ne disent « étape 1 offerte, la suite avec l'accès complet ». La liste affiche même « +N XP » pour le parcours entier. | `parcours-detail.tsx:566-573`, `:463-465` ; `parcours-list.tsx:108-110` ; `humor-quiz.tsx:185-215` |
| F7 | Le mur d'étape 2 est un cul-de-sac : texte générique, un bouton vers une autre page (`/abonnement`) alors que `PremiumModal` existe, pas de rappel de l'XP qu'on vient de gagner (moment pourtant le plus chaud, l'étape 2 s'ouvre 500 ms après validation), pas de formule annuelle, pas de nom de la prochaine étape. | `parcours-detail.tsx:361-365` (auto-ouverture) et `:600-610` |
| F8 | L'étoile favoris ouvre une modale de paiement générique (« Débloque tout le contenu ») sans rapport avec le geste de l'utilisateur ; l'étiquette accessible dit « Ajouter aux favoris ». Les favoris sont pourtant 100 % Premium (le texte « Favoris illimités » laisse croire qu'il existe une version limitée gratuite). | `ui/favorite-button.tsx:32-34, 54` ; `api/favorites/route.ts:48-58` ; `abonnement/page.tsx:150` |
| F9 | Promesse d'inscription non tenue : « ta première vanne t'attend » mène à un quiz de 3 questions « Découvre ton profil humour », puis au parcours. La page `/register` n'évoque ni le gratuit ni le Premium. | `(auth)/register/page.tsx:114` ; `(auth)/onboarding/page.tsx:21-25` |
| F10 | Le compte gratuit n'a pas d'avantage net visible face à l'anonyme : mêmes « 10 vannes, 3 conseils, 3 vidéos, contenu du jour » ; seuls XP et validation d'étape 1 s'ajoutent, sans le dire. | `abonnement/page.tsx:76`, `vannes-list.tsx:202`, `article-cta.tsx:72` |
| F11 | Aucun point d'entrée « Premium » dans l'en-tête, ni statut de plan pour un connecté gratuit : `/abonnement` n'est atteignable que via des CTA contextuels. L'accueil d'un connecté ne propose pas la prochaine action (parcours en cours) : « Explorer les vannes » / « Voir les conseils ». | `layout/header.tsx:18-25, 112-114` ; `home/hero-section.tsx:47-59` |
| F12 | `/liens` (entrée Instagram) n'a aucun CTA de conversion : ni compte gratuit, ni parcours « étape 1 offerte ». L'article passe avant la vanne du jour, alors que la carte Instagram est « amorce // chute ». Le lien « Conseils » est le seul libellé sans bénéfice. | `app/liens/page.tsx:31-35, 53-79` |
| F13 | Les cartes de vannes verrouillées sont des barres grises sans contenu ; elles ne montrent pas le ressort du produit (la chute cachée). Le « catalogue complet » est aussi moins vendeur qu'avant (125 vannes validées au 30/09, contre « 550+ » au 29/09) : à confirmer avec les compteurs prod. | `vannes-list.tsx:384-411` ; `founder-preferences.md` lignes 32 et 38 |

### P2

| # | Friction | Preuve |
|---|---|---|
| F14 | Erreur de paiement non humaine : `/abonnement` affiche `data.error` brut (« Authentification requise », « Configuration Stripe incomplète : STRIPE_PREMIUM_PRICE_ID manquant... »). Les autres CTA affichent un message correct. | `abonnement/page.tsx:44` ; `api/stripe/checkout/route.ts:12-13, 43-53` |
| F15 | Cohérence de l'exercice « À toi de jouer » : réservé aux membres sur la fiche, visible par tous dans la liste et l'accueil. Le lien du verrou pointe `/register` (page pleine) au lieu de la modale (préférence fondateur). | `vannes/how-to-apply-gate.tsx:31-37` ; `vannes-list.tsx:327-332` ; `daily-content.tsx:204-209` |
| F16 | Violation de la décision du 30/09 (zéro humoriste nommé hors fiches vidéo) : « Regarde comment Fary et Paul Mirabel construisent leurs blagues ». | `app/(dashboard)/vannes/page.tsx:155` |
| F17 | Le mur d'étape 2 renvoie vers `/abonnement` sans conserver le parcours d'origine : si l'abonné annule le paiement, il ne revient pas au parcours. L'écran d'échec de succès propose « Aller voir les vannes » au lieu de reprendre le parcours. | `parcours-detail.tsx:605` ; `success/page.tsx:122-128` |
| F18 | À vérifier par @fullstack : le contenu des étapes 2+ est-il présent dans le HTML ou le JSON envoyé à un anonyme ? Le composant client reçoit `initialPath` complet, et le verrou est purement visuel côté affichage (l'API de progression refuse en 403, pas l'API de lecture). Si oui : le mur est contournable et la valeur payante, diluée. | `parcours-detail.tsx:226-245, 492, 600` ; `lib/parcours-access.ts` |

### Audit heuristique Nielsen 10 (tunnel dans son ensemble)

| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | FAIL | Mur invisible avant l'étape 2 (F6) ; aucun message après paiement (F4). Point positif : sondage de succès avec spinner et repli (`success/page.tsx`). |
| H2 Langage du persona | FAIL partiel | « tout débloquer », « accès complet » : jamais défini. Le reste est en tutoiement naturel. |
| H3 Contrôle et annulation | FAIL | Intention « payer » perdue (F1), retour de paiement annulé non géré (F17). Point positif : modales fermables, lien « Plus tard, laisse-moi explorer » (`humor-quiz.tsx:176-183`). |
| H4 Cohérence | FAIL | Gratuit présenté comme payant (F5), exercice visible ou verrouillé selon la page (F15), « Offre complète » / « Accès complet » / « Premium » pour la même chose. |
| H5 Prévention d'erreurs | FAIL | Étoile qui ouvre un paiement (F8). |
| H6 Reconnaissance > rappel | PASS | Étapes, XP, badge « Essai gratuit », bandeau de limite gratuite (`vannes-list.tsx:198-218`) clairs. |
| H7 Raccourcis experts | PASS | Retour sur `/abonnement` direct, callback respecté (`safe-callback.ts`). |
| H8 Minimalisme | FAIL partiel | Trois CTA d'inscription et deux de prix cohabitent sur l'accueil ; coaching à 99 € replié (correct, `premium-cta.tsx:136`). |
| H9 Messages d'erreur | FAIL | Erreurs techniques brutes (F14). Les messages de parcours et de modale sont humains. |
| H10 Aide dans le flow | FAIL | Aucune explication de ce que débloque le paiement à l'endroit où l'on bute (F7). Aucune FAQ de prix dans le mur d'étape. |

## 3. Moments où la valeur Premium devrait être montrée et ne l'est pas

| # | Moment | Ce qui se passe aujourd'hui | Ce qu'il faut montrer |
|---|---|---|---|
| M1 | Fin de validation de l'étape 1 (pic émotionnel : +XP, étape 2 qui s'ouvre) | Phrase générique, bouton vers une autre page (F7) | XP gagnés, nom de la prochaine étape, nombre d'étapes restantes (donnée du parcours), prix mensuel et annuel, paiement sans quitter le parcours |
| M2 | Arrivée sur une page parcours (anonyme ou gratuit) | Rien sur le split gratuit / payant | Bandeau « Étape 1 offerte, la suite avec l'accès complet », badges sur les étapes 2+ |
| M3 | Résultat du quiz d'onboarding | Parcours recommandé, lien Premium minuscule | « {N} étapes, la première est offerte » (N lu dans les données du parcours) |
| M4 | `/abonnement` et modale Premium | Liste catalogue sans parcours, avec du gratuit dedans | Parcours en tête, tableau gratuit contre accès complet, choix mensuel ou annuel |
| M5 | Clic sur l'étoile favoris | Modale générique | Modale contextualisée « Garde tes vannes sous la main » |
| M6 | Cartes de vannes verrouillées (au-delà des 10) | Barres grises | Début de vanne visible, chute masquée (ressort du produit), si D1 le permet |
| M7 | Juste après le paiement | `/vannes`, aucun message | Atterrissage sur l'étape 2 (ou le parcours recommandé), message de bienvenue, une seule action suggérée |
| M8 | Accueil d'un connecté gratuit | « Explorer les vannes » | Coaching : « Reprendre mon parcours » avec progression, puis mur au bon endroit |
| M9 | Entrée Instagram `/liens` | Liens neutres | Une carte « Commencer un parcours, étape 1 offerte » |

## 4. Recommandations concrètes par écran

Règles de rédaction appliquées : tutoiement, zéro tiret cadratin, zéro humoriste nommé, aucun chiffre inventé. Les chiffres viennent de décisions Thomas (4,99 €/mois, 39,99 €/an, 10 vannes, 3 conseils, 3 vidéos, étape 1 offerte), de données dynamiques `{N}`, `{xp}`, `{stats.x}`, ou d'un calcul : 39,99 / 12 = 3,33 € ; 4,99 x 12 = 59,88 € ; économie 19,89 € (voir D2).

**R1. Mur d'étape 2** (`parcours-detail.tsx:600-610`, corrige F2, F6, F7, F17)
- Ouvrir `PremiumModal` (variante `parcours`) à la place du lien vers `/abonnement` ; mémoriser `returnTo=/parcours/{slug}?step=2`.
- Titre : « Étape 1 validée, +{xp} XP. La suite t'attend. »
- Corps : « Prochaine étape : {moduleTitle}. Les {N moins 1} étapes suivantes de {path.title} sont dans l'accès complet, avec leurs exercices, leurs quiz et leurs vidéos décryptées. »
- CTA primaire : « Débloquer la suite · 4,99 €/mois ». Lien secondaire : « Ou 39,99 €/an, soit 3,33 €/mois ».
- Micro-texte : « Annulable à tout moment. » (ajouter « Tu reviens ici juste après le paiement » seulement quand F4 est corrigé).
- Mobile (<768 px) : CTA pleine largeur, collé en bas de la carte, cible 44 px minimum.

**R2. En-tête des étapes et page parcours** (`parcours-detail.tsx:566-573`, `:454-473` ; `parcours-list.tsx:108-110`)
- Étapes 2+ pour un non abonné : badge « Accès complet » à la place de « Termine l'étape 1 pour débloquer ».
- Bandeau sous la barre de progression : « Étape 1 offerte. Les {N moins 1} suivantes se débloquent avec l'accès complet : 4,99 €/mois ou 39,99 €/an. »
- Carte de la liste : badge « Étape 1 offerte ».

**R3. Quiz d'onboarding** (`humor-quiz.tsx:99-116`, `:207-213`)
- Sous le titre du parcours recommandé : « {N} étapes. La première est offerte. »
- Lien discret : « Tout débloquer à 4,99 €/mois » devient « Voir l'accès complet ».

**R4. `/abonnement`** (`abonnement/page.tsx`, compatible avec l'ajout de l'annuel par l'autre agent)
- Sous-titre anonyme : « Compte gratuit d'abord : 10 vannes, 3 conseils, 3 vidéos, l'étape 1 de chaque parcours. Tu passes à l'accès complet quand tu veux. »
- Liste d'avantages, ordre et texte :
  1. « **Les parcours en entier** : chaque étape avec son exercice, son quiz et ses vidéos décryptées. L'étape 1 est offerte. »
  2. « **Toutes les vannes** : {stats.jokes}+ classées par situation, chacune avec le décryptage de sa chute. »
  3. « **Tous les conseils** : {stats.tips}+ avec exemples et exercices. »
  4. « **Toutes les vidéos de stand-up** : {stats.videos}+ décryptées technique par technique. »
  5. « **Filtres** par situation et par niveau. » 6. « **Favoris** : garde sous la main les vannes à ressortir. »
- Retirer « Contenu quotidien » de cette liste ; l'ajouter au bloc gratuit : « Contenu du jour : vanne, conseil et vidéo, gratuits pour tous. » (corrige F5).
- Tableau Gratuit contre Accès complet, 2 colonnes (>=768 px), empilé en dessous : lignes Vannes (10 / toutes), Conseils (3 / tous), Vidéos (3 / toutes), Parcours (étape 1 / toutes les étapes), Filtres (non / oui), Favoris (non / oui), Contenu du jour (oui / oui). Valeurs vérifiées dans `vannes-list.tsx:221-230` et `api/favorites/route.ts:53`.
- Choix de formule : deux cartes radio côte à côte, mensuel « 4,99 €/mois » et annuel « 39,99 €/an, soit 3,33 €/mois » ; le bouton reprend le prix choisi : « Active mon accès · 39,99 €/an ». Libellé d'économie selon D2.
- Erreur de paiement : ne jamais afficher `data.error` (F14). 401 : « Ta session a expiré. Reconnecte-toi, on reprend le paiement. » (ouvre la modale de connexion avec `callbackUrl=/abonnement`) ; 429 : « Trop d'essais pour l'instant. Réessaie un peu plus tard. » ; autres : « Le paiement n'a pas pu démarrer. Réessaie dans un instant. »

**R5. Modale Premium et étoile favoris** (`premium-modal.tsx`, `favorite-button.tsx`)
- Prop `reason` : `favoris`, `vannes`, `parcours`, `filtres`, `defaut`. Titres : favoris « Garde tes vannes sous la main » ; parcours « Continue ton parcours » ; vannes « La suite du catalogue t'attend » ; défaut « Passe à l'accès complet ».
- Corps favoris : « Les favoris font partie de l'accès complet. Sauvegarde les vannes à ressortir et retrouve-les en un clic. »
- Liste identique à R4 (parcours en tête), sélecteur mensuel/annuel, lien de rétractation conservé.
- Étoile pour un non abonné : `aria-label="Ajouter aux favoris (accès complet)"`.
- « Favoris illimités » devient « Favoris » (le gratuit n'en a aucun).

**R6. Accueil** (`hero-section.tsx:66`, `home-cta.tsx:28, :36`, `premium-cta.tsx`)
- Hero et HomeCta, ligne sous le bouton : « La première étape de chaque parcours est offerte. La suite : 4,99 €/mois, sans engagement. »
- HomeCta, texte : « {jokesLabel} vannes, {tipsLabel} conseils, {videosLabel} vidéos analysées, et des parcours pour t'entraîner étape par étape. La première étape est offerte. » (supprimer « moins qu'un café », F2).
- PremiumCta : `AuthModal` avec `callbackUrl="/abonnement"` (F1) ; puces dans l'ordre de R4 ; ajouter sous le bouton « Ou 39,99 €/an, soit 3,33 €/mois ». Le compteur « 1 500+ » reste tel quel (`[CHOIX UTILISATEUR]` 29/09).
- Connecté gratuit : boutons du hero remplacés par « Reprendre mon parcours » (ou « Commencer mon parcours » sans progression) puis « Explorer les vannes ». Dashboard = coaching, pas bibliothèque.

**R7. Fin d'article** (`article-cta.tsx`)
- Primaire : « Essaie la première étape, elle est offerte » avec `freeCallbackUrl` = parcours lié à l'article (la prop existe : vérifier que chaque article en passe un, sinon le défaut renvoie vers `/onboarding`).
- Secondaire : « Voir l'accès complet · 4,99 €/mois ».
- Note : « Compte gratuit : 10 vannes, 3 conseils, 3 vidéos, étape 1 de chaque parcours. Sans carte. »

**R8. `/liens`** (`app/liens/page.tsx`, mobile d'abord, colonne unique de 28 rem max)
- Ordre : 1) vanne du jour (carte amorce // chute), 2) bouton plein format « Commencer le parcours Répartie, première étape offerte » vers `/parcours/repartie`, 3) dernier article, 4) liens « Toutes les vannes » et « Tous les conseils d'humour ».
- Ligne sous le bouton : « Compte gratuit, sans carte. »
- Conserver l'UTM `utm_source=instagram` dans `sessionStorage` à l'arrivée pour l'attribuer à l'inscription (@data-analyst).

**R9. Inscription** (`register/page.tsx:114`, `auth-modal.tsx`)
- Titre par défaut : « Crée ton compte gratuit, ton parcours t'attend » ; avec `callbackUrl=/abonnement` : sous-titre « Un compte gratuit d'abord, puis le paiement sécurisé à l'étape suivante. » (annonce les 2 temps, H1).
- Si `humor-profile` existe en localStorage : envoyer directement au parcours recommandé (zéro duplication d'info) et sauter le quiz.
- Le verrou « À toi de jouer » ouvre la modale d'inscription (`how-to-apply-gate.tsx:33`) au lieu de `/register`.

**R10. Page de succès** (`abonnement/success/page.tsx`)
- Titre : « Accès complet activé ». Corps : « Tu peux reprendre là où tu t'étais arrêté. »
- Redirection : `returnTo` (étape ou parcours d'origine), sinon parcours recommandé du quiz, sinon `/parcours`. Jamais `/vannes` par défaut.
- Message d'arrivée (toast ou bandeau) : « Bienvenue dans l'accès complet. Voilà la suite de ton parcours. »
- État d'échec : bouton primaire « Reprendre mon parcours » (à la place de « Aller voir les vannes »).

**R11. Cartes de vannes verrouillées** (`vannes-list.tsx:384-411`, conditionné à D1)
- Montrer l'amorce de la vanne et masquer la chute : « Chute avec l'accès complet ». Ouvre `PremiumModal` `reason=vannes`.

**R12. Nettoyage** : retirer les deux humoristes de `vannes/page.tsx:155` (« Regarde comment des humoristes construisent leurs blagues, technique par technique. ») ; harmoniser le vocabulaire (un seul nom : « accès complet », jamais « offre complète » ni « Premium » côté visiteur).

## 5. Décisions à faire trancher par Thomas

| # | Décision | Reco |
|---|---|---|
| D1 | Qu'achète-t-on exactement ? Avec 125 vannes validées, le catalogue n'est plus l'argument fort ; les parcours (étapes 2+), les exercices, le décryptage et les favoris le sont. Les fiches `/vannes/[slug]` restent par ailleurs publiques (SEO). | Faire des **parcours la tête d'affiche** partout (R1 à R6), sortir « Contenu du jour » de la liste payante, garder les fiches publiques (page n°1 SEO intouchable) et vendre l'apprentissage, pas l'accès à chaque vanne. |
| D2 | Annuel : « ~2 mois offerts » (décision du 01/10) ne colle pas au calcul. 12 x 4,99 = 59,88 € ; 39,99 € = environ 8 mensualités, soit **4 mois offerts** ou 19,89 € d'économie, 3,33 €/mois. Par ailleurs, présélectionner l'annuel ou le mensuel ? | Afficher « 39,99 €/an, soit 3,33 €/mois » et « 4 mois offerts » (chiffre exact, conforme à « que ce soit juste »). Présélectionner l'annuel, avec le prix lisible sur le bouton et le mensuel à un clic. Pas d'autre libellé d'économie. |
| D3 | Atterrissage après paiement et après inscription : retour à l'intention (étape 2, parcours recommandé), au lieu de `/vannes` et du quiz. | **GO** : paramètre `returnTo` passé au checkout, relu par la page de succès. Résout F1, F4, F17. Valeur persona : l'abonné voit immédiatement ce qu'il a acheté. |
| D4 | Visibilité des étapes 2+ : afficher un aperçu (titre, format, première phrase de « Ce que tu vas apprendre ») et vérifier que le corps n'est pas dans le HTML ou le JSON d'un anonyme (F18). | **GO aperçu** (titre + format + une phrase), corps masqué côté serveur pour les non abonnés. Si tu préfères le SEO sur ces contenus, garde-les lisibles mais alors le mur est cosmétique : à assumer. |
| D5 | Que gagne un compte gratuit face à l'anonyme ? Aujourd'hui rien de net (F10). | Annoncer 3 gains : étape 1 validable avec XP, progression sauvegardée, exercice « À toi de jouer » sur les fiches. Nommer ces gains dans la modale d'inscription et sur `/abonnement`. |

## 6. Mesure (HEART) et évènements à instrumenter

Aucune donnée réelle de conversion n'existe à ce jour (0 abonné hors lancement) : les cibles sont à fixer après 4 semaines de mesure, sans chiffre inventé. Défaut de méthode : complétion du parcours critique paiement >= 90 %.

| Dimension | Signal | Évènement Umami (à créer, `source` = `parcours_step2` / `favoris` / `vannes_locked` / `article` / `liens` / `home` / `quiz`) |
|---|---|---|
| Task success | Clic « payer » vers Stripe ouvert puis plan PREMIUM actif | `paywall_view`, `cta_click{source,plan}`, `checkout_start{plan}`, `checkout_success{plan}` |
| Adoption | Compte gratuit vers paiement | `signup_complete{intent}`, `step1_validated`, `paywall_view{source=parcours_step2}` |
| Engagement | Première action Premium dans les 10 minutes | `premium_first_action{type}` (étape 2 ouverte, favori ajouté, filtre utilisé) |
| Retention | Retour après 7 et 30 jours | `premium_return_d7`, `premium_return_d30` (@data-analyst) |
| Happiness | Question unique sur la page de succès, facultative | `premium_csat` |

Tests UX à jouer par @qa avant livraison : parcours Yanis sans aide (Instagram vers étape 2 débloquée), 3 actions principales maximum par écran, edge cases (session expirée à l'étape de paiement, paiement annulé sur Stripe, webhook lent, retour après 30 jours en compte gratuit, connexion lente sur `/liens`), accessibilité WCAG 2.2 AA (modales fermables par Escape, focus visible, cibles >= 44 px, étoile avec libellé juste).

## Handoff

**Handoff vers @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/ux/audit-tunnel-premium-s14.md`.
- Décisions prises : parcours en tête d'affiche de la proposition payante ; modale Premium contextualisée par déclencheur ; atterrissage post-paiement sur l'intention d'origine ; vocabulaire unique « accès complet ».
- Points d'attention : F1 (CTA payant mène au quiz, correction d'une ligne), F2 (« moins qu'un café » faux), F5 (gratuit vendu comme payant), D2 (arithmétique de l'annuel), F18 (contenu des étapes 2+ potentiellement lisible côté client), F16 (humoristes nommés sur `/vannes`). Prod non consultée.
- Suites : @copywriter (calibrer 3 à 5 étalons avec Thomas avant tout brief, règle P0 s8) ; @fullstack (F1, F4, F14, `returnTo`, `reason` de la modale, vérification F18) ; @design (tableau gratuit contre complet, sélecteur de formule) ; @data-analyst (évènements section 6) ; @qa (vérification prod, tests section 6).
