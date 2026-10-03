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
