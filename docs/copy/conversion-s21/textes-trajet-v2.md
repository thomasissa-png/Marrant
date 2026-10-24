# Textes du trajet de conversion s21 (v2) : uniquement les changements par rapport à la v1

> Auteur : @copywriter. Date : 19/10/2026. Statut : PROPOSITION, rien n'est branché, rien n'est commité. Cette v2 répond aux trois verdicts à l'aveugle de la v1 (`docs/design/conversion-s21/verdicts-v1/` : pressé mobile 7,5 ; sceptique 7,5 ; neutre cohérence 8/10) et aux 12 arbitrages de l'orchestrateur. Tout ce qui n'est pas dans le tableau du §2 reste **mot pour mot** la v1 (`textes-trajet-v1.md`) et ses arbitrages du 19/10.
> Règle tenue : on ne touche à un texte déjà validé que s'il est faux ou s'il casse le trajet. La raison est écrite dans la colonne « défaut corrigé ». Chaque texte repasse la relecture à l'aveugle **dans le trajet** (règle d'or P0 s18) : rien n'est en ligne avant.
> Contraintes tenues : tutoiement, zéro tiret cadratin, aucune promesse de résultat, « 1 500+ » et prix (2,99 € et 24,99 €) intacts, réassurance unique mot pour mot, aucune mention légale dans un bouton, aucun concurrent nommé, aucun témoignage.

## 0. À lire en premier

**Intouchables, non modifiés** : étalon A de Thomas (titre « Premium ouvre tout Deviens Marrant », sous-titre, avantages, boutons « S'abonner · 2,99 €/mois »), « 1 500+ », les deux prix, la réassurance unique (`REASSURANCE_UNIQUE`), « plus de 3 mois offerts », « soit 2,08 € par mois » (arbitrage 2 de la v1), la ligne lettre `LETTRE_HEBDO_PROMESSE` (« Une lettre par e-mail chaque semaine, si tu la veux. »).
**Une exception assumée** : le sous-titre garde « Les listes ne s'arrêtent plus à la dixième vanne » (étalon A, mot de Thomas). « Listes » y désigne les listes que le visiteur vient de faire défiler, pas l'objet « Tout le catalogue » du tableau et des avantages.

**Codes des défauts** (colonne de droite du §2) : `P1` à `P5` = les 5 défauts les plus coûteux du pressé ; `S1` à `S5` = idem sceptique ; `N1` à `N5` = idem neutre ; `N-I-xx` = ses incohérences (V verbes, L libellés, P prix, R répétitions) ; `S-ph` = le tableau « phrases fausses, ambiguës ou trompeuses » du sceptique ; `Pc`/`Sc`/`Nc` + trajet + critère = une note sous 9 citée dans le corps du verdict (ex. `Pc T4 clarté`).

**Convention de comptage** : celle du test de plafond (`conversion-s21-textes.test.ts`) : un mot = un jeton séparé par des espaces qui contient une lettre ou un chiffre ; « · », « / », « : » et ✓ ne comptent pas ; « 1 500+ » = 1 mot. Mon recomptage de la v1 donne ≈ 227 mots avec la lettre (≈ 205 sans), pas 229/207 : la v1 comptait le tableau et les cartes avec une autre règle. Les écarts v2 moins v1 ci-dessous sont exacts ; les totaux sont à ±3, **à confirmer par le test de plafond après intégration**.

## 1. Faits vérifiés dans le code, les CGU et la note @legal

| # | Question | Constat | Source | Conséquence pour le texte |
|---|---|---|---|---|
| 1 | La vanne cliquée est-elle ajoutée aux favoris après le paiement ? | **Non.** L'étoile ouvre la fenêtre ; `addFavorite` n'est appelé que si le compte est déjà Premium. La fenêtre ne mémorise rien ; le retour de paiement ramène à la page (`returnTo`), `PremiumWelcome` ne touche pas aux favoris. Il faut recliquer l'étoile. | `components/ui/favorite-button.tsx` l.34-43 ; `premium-modal.tsx` ; `lib/premium-return.ts` | Interdit d'écrire « je la garde », « ta vanne t'attend dans tes favoris ». On dit « Les favoris, c'est Premium » et « Après le paiement, les favoris s'ouvrent ». Variante à écrire seulement si le code change : §6, point 8. |
| 2 | Les limites gratuites : par liste, par jour, au total ? | **Par liste, en cumulé sur les pages, sans remise à zéro** (ni par jour, ni par mois) : 10 vannes, 3 conseils, 3 vidéos. Un filtre ou une recherche relance le calcul avec le même plafond. | `api/jokes` l.75, `api/tips` l.66, `api/videos` l.57 ; `config/premium.ts` l.106-108 | « 10 vannes, 3 conseils, 3 vidéos dans les listes ». Pas de « par jour ». |
| 3 | Les fiches restent-elles lisibles en accès direct ? | **Oui.** Aucune limite dans `vannes/[slug]`, `conseils/[slug]`, `videos/[slug]`. Seul l'exercice est réservé (`howToApply`, `exercise`, `learnings` via `BlocExercice`). | pages `[slug]`, `bloc-exercice.tsx`, `catalogue-pages.ts` l.20-23 | « dans les listes » est exact ; ne jamais écrire que les fiches sont fermées. |
| 4 | L'annuel se renouvelle-t-il ? | **Oui, chaque année, tacitement, résiliable à tout moment depuis le profil.** E-mail de rappel 32 à 40 jours avant la fin de période. La page Stripe le dit déjà : « 24,99 € TTC par an, renouvelé chaque année ». La carte d'offre ne le disait pas. | CGU art. 3 (`cgu/page.tsx` l.41) ; `config/textes/paiement.ts` l.113-117 ; `lib/billing/annual-renewal-reminders.ts` l.21-25 | « Renouvelé chaque année, sauf résiliation. » |
| 5 | Le « défi » des conseils est-il gratuit ? | **Non.** Une fiche gratuite montre le principe et l'« Exemple concret » ; l'exercice est dans `BlocExercice`, réservé Premium. Le tableau (« Exercices des fiches : Non ») est juste. **/conseils est faux** : « un exemple concret et un défi à tester » et 6 amorces de cartes sur 8 (« Le défi est juste en dessous »…). **Point à vérifier** : `/api/tips` renvoie la ligne entière, donc `exercise` peut apparaître dans la carte dépliée d'un gratuit (3 conseils). | `conseils/page.tsx` l.118 ; `conseils-list.tsx` l.76-85 et l.322 ; `conseils/[slug]/page.tsx` l.228 ; `api/tips/route.ts` l.86-88 | On corrige /conseils, pas le tableau (§2, K01 à K03). Fuite probable de l'exercice : §6, point 11. |
| 6 | À partir de quand courent les 14 jours ? L'annuel est-il couvert ? | **Dès la souscription** (CGU art. 6 « dès la conclusion du contrat » ; `RETRACTATION_PERIMETRE` « à partir de ta souscription »). **Premier paiement seulement**, mensuel ou annuel (24,99 € inclus) ; un renouvellement n'ouvre pas de nouveau délai. Remboursement manuel (Thomas dans Stripe). | `config/textes/juridique.ts` l.17-18 ; CGU art. 6 ; `docs/legal/remboursement-abonnement-s21.md` §1 et §2 | FAQ prix : deux phrases ajoutées après la réassurance (A14, A15). La note @legal demande de ne pas répéter la garantie sans « premier paiement » : c'est fait. |
| 7 | Qu'ouvre le carnet pour un abonné ? Qu'a un gratuit ? | Gratuit : **la fiche offerte de chaque carnet publié**. Premium : **toutes les fiches de chaque carnet publié** (mois en cours et passés). La fiche offerte d'octobre est la n° 15 sur 15 : d'où « Situation 15, offerte » puis « Il en reste 14 », lu comme « 15e sur davantage ». | `lib/carnet.ts` l.101-103, l.167-189 ; `data/carnet/2026-10.json` | Retirer le numéro (A07). « 1 situation par carnet » (A13). |
| 8 | Où le mot « TTC » est-il affiché ? | Carte d'offre (« TTC / mois », « TTC / an »), page Stripe (`texteStripeSubmit`), puis fenêtre T4, /register, e-mails. | `abonnement-vente.ts` `FORMULES` ; `paiement.ts` l.113-117 ; `cta-pages.ts` | TTC reste sur la carte d'offre (là où le visiteur compare et choisit) et chez Stripe. Retiré de la fenêtre et de /register (W04, G02). `[À VALIDER @legal : un prix affiché hors carte sans « TTC » est lu TTC pour un particulier ; confirmer]`. |
| 9 | /register affiche-t-il déjà le prix de l'annuel ? | **Oui, côté code** : `planReminder(plan)` lit `plan=annual` dans l'URL ou dans le callback. Les verdicts ne l'ont pas vu faute de capture annuelle. **L'attente ne montre aucun prix** : à coder. | `register/page.tsx` l.82, l.231 ; `cta-pages.ts` `planReminder` ; `abonnement-view.tsx` l.141-149 | G02 (graphie) et A18 (attente). |
| 10 | Le titre de l'étape 2 est-il disponible en donnée ? | **Oui** : `PARCOURS_ETAPES[slug].titres[LAST_FREE_PARCOURS_STEP]` (0-based) ; Répartie : « Le rythme et les silences ». | `config/parcours-etapes.ts` l.26-29 | G04. |

## 2. Les changements (v1 → v2)

Les guillemets français `« »` encadrent le texte exact. « (donnée) » = lu dans le carnet, les constantes ou la fiche, jamais écrit en dur.

### 2.1 /abonnement (T1, T2, T5, C1, C2)

| Id | Surface | Élément | v1 | v2 | Défaut corrigé |
|---|---|---|---|---|---|
| A01 | /abonnement, haut | Titre (H1) | « Premium ouvre tout Deviens Marrant » | **Texte inchangé** (étalon A). Rendu seul : « Deviens Marrant » écrit comme le logo (même police, même couleur), pour qu'on lise « le site » et non un ordre | S-ph6, Nc T1 clarté |
| A02 | /abonnement, haut | Accroche d'origine des portes génériques (articles, accueil, glossaire, a-propos, quiz) | « Pour tout ouvrir » | **Supprimée** (l'en-tête n'en avait déjà pas). Les autres accroches (« Pour la suite des vannes »…) gardent leur texte | N-I-R3 (« Tout ouvrir », « Pour tout ouvrir », « Premium ouvre tout » en trois lignes), Pc T5 promesse |
| A02b | /abonnement, haut | Rendu des accroches restantes | 12 px, couleur accent | **Taille du corps (16 px), couleur de texte pleine**, au-dessus du titre. Texte inchangé | P3, Pc T2 promesse (« accroche de 12 px que je ne lis pas »), Pc C2 |
| A03 | /abonnement, B2 et B6 | Ligne sous le bouton (visiteur) | « Tu crées ton compte, puis tu paies par carte. » (9 mots) | « Tu crées ton compte, puis tu paies par carte sur Stripe. » (11 mots) | S4 (b), Sc T1 confiance, Nc T1 confiance, Pc T1 confiance : Stripe n'était nommé qu'au connecté |
| A04 | /abonnement, sous les deux cartes de formule | Renouvellement de l'annuel (nouveau) | absent | « Renouvelé chaque année, sauf résiliation. » (5 mots). **Affiché seulement quand « Annuel » est choisi**, entre les cartes et le bouton | S4 (a), S-ph10, Sc T1 confiance |
| A05 | /abonnement | Ordre des blocs | carte d'offre, tableau, carnet, « Pas encore sûr ? », bouton final, FAQ | carte d'offre, **carnet**, tableau, « Pas encore sûr ? », bouton final, FAQ | P1, S2, N4 |
| A06 | /abonnement, bloc carnet | Amorce | « Un exemple de ce qui s'ajoute chaque mois. » (8 mots) | **Chapeau d'une ligne** : « La situation offerte d'octobre, et la réplique qui va avec. » (10 mots, « d'octobre » = mois du carnet affiché, donnée). Il remplace l'amorce, passe sous le titre « Le carnet, en vrai » (inchangé) | P1, S2, N4, S-ph8 (dit ce qu'est un carnet : une situation et sa réplique, pas une vanne par e-mail) |
| A07 | /abonnement, bloc carnet | Surtitre | « Carnet d'octobre · Situation 15, offerte » | **Supprimé** (« offerte » et le mois passent dans le chapeau, le numéro disparaît) | S-ph5 (« Situation 15 » puis « Il en reste 14 »), Nc T1 |
| A08 | /abonnement, bloc carnet | Fiche | titre, situation, « On te dit », « Tu réponds », « Pourquoi ça marche » | **Deux bulles seulement** : « On te dit » + texte de la fiche (donnée), « Tu réponds » + texte de la fiche (donnée). Aujourd'hui (octobre) : « Tu parles toujours aussi peu ? » / « Donne-moi la nuit. Demain, je t'envoie un message magnifique. » | P1 (« échange en 2 bulles, sans Pourquoi ça marche »), S2 |
| A09 | /abonnement, bloc carnet | Lien | « Lire la fiche en entier » (5 mots) | **Supprimé** (la fiche reste sur /carnet, menu). Un lien qui sort de la page de vente à l'endroit où naît l'envie | P1, N4 ; compense le budget |
| A10 | /abonnement, tableau | Titre visible (6 mots) | « Gratuit et Premium, côte à côte » | **Gardé en `sr-only`** (le H2 reste dans le DOM) ; les en-têtes « Gratuit » et « Premium » disent déjà la même chose | Compense le budget (-6) ; aucun défaut de verdict |
| A11 | /abonnement, tableau, ligne 1 | Libellé | « Listes : vannes, conseils, vidéos » | « Tout le catalogue » | N-I-L1 (même objet, deux noms), arbitrage 6 |
| A12 | /abonnement, tableau, ligne 1 | Colonne Gratuit | « 10, 3 et 3 » | « 10 vannes, 3 conseils, 3 vidéos dans les listes » (construit sur `FREE_CATALOGUE_LIMITS_LABEL`) | S3, S-ph4, S5 critère confiance T2, Nc T1 clarté |
| A13 | /abonnement, tableau, ligne carnet | Colonne Gratuit | « 1 situation » | « 1 situation par carnet ». Colonne Premium « Toutes les situations » inchangée (vrai : toutes celles de chaque carnet publié, fait 7) | S-ph5 (« Toutes les situations : celles du mois ou de tous les carnets ? »), S3 |
| A14 | FAQ prix (accueil et /abonnement), annuel indisponible | Réponse | « C'est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas. Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » | **+ deux phrases après la réassurance (qui reste mot pour mot)** : « Les 14 jours courent dès ton abonnement. Un renouvellement n'ouvre pas de nouveau délai. » | S-ph9 (« 14 jours à compter de quoi ? »), faits 6 ; réserve de la note @legal |
| A15 | FAQ prix, annuel disponible | Réponse | « C'est le prix, point. Ça se renouvelle chaque mois ou chaque année, tant que tu ne résilies pas. Premium : … profil. » | **+** « Les 14 jours courent dès ton abonnement, annuel compris. Un renouvellement n'ouvre pas de nouveau délai. » | S-ph9 (« vaut aussi pour l'annuel ? »), faits 6 |
| A16 | Page d'attente après inscription ou connexion | Titre | « Te voilà connecté. » | « Ton compte est prêt. » (vrai après une création **et** après une connexion : la même page sert aux deux) | N5, N-I-V3, S-ph7, P5, Pc T1 promesse |
| A17 | Page d'attente | Texte | « On t'emmène au paiement… » | « On t'emmène au paiement sécurisé par Stripe… » (reprend « Paiement sécurisé par Stripe » du connecté) | S4 (b), arbitrage 4 |
| A18 | Page d'attente | Formule choisie (nouveau) | absente | Une ligne : « Premium, 2,99 €/mois. » ou, en annuel, « Premium, 24,99 €/an, renouvelé chaque année. » | N-I-P1, arbitrage 7 |

### 2.2 Murs de liste (T2, C2) et carnet

| Id | Surface | Élément | v1 | v2 | Défaut corrigé |
|---|---|---|---|---|---|
| M01 | Mur /vannes | Bouton | « Voir la suite des vannes · 2,99 €/mois » | « Ouvrir la suite des vannes · 2,99 €/mois » (5 mots). « Ouvrir » est le verbe de « Tout ouvrir » et de « Premium ouvre tout » ; il ne promet pas d'afficher des vannes, il dit l'acte avec son prix | S-ph2, Pc T2 promesse (-2 : « Voir » mène à une page de vente), Sc T2 promesse. L'accroche « Pour la suite des vannes » garde son écho |
| M02 | Mur /conseils | Bouton | « Voir la suite des conseils · 2,99 €/mois » | « Ouvrir la suite des conseils · 2,99 €/mois » | idem |
| M03 | Mur /videos | Bouton | « Voir la suite des vidéos · 2,99 €/mois » | « Ouvrir la suite des vidéos · 2,99 €/mois » | idem |
| M04 | Mur /vannes | Ligne de limite | « Les 10 gratuites, c'est fait. » | « Les 10 vannes gratuites, c'est fait. » (conseils et vidéos portaient déjà leur unité) | S3, S-ph3 (« 10 par liste, par jour, au total ? ») ; le tableau (A12) complète |
| M05 | /carnet, visiteur (même défaut, hors des 7 trajets) | Bouton | « Voir tout le carnet · 2,99 €/mois » | « Ouvrir tout le carnet · 2,99 €/mois » | Même verbe que M01 : un seul verbe pour « aller payer pour ouvrir ». `[Non relu à l'aveugle dans ce lot]` |

### 2.3 /conseils (fait faux)

| Id | Surface | Élément | v1 | v2 | Défaut corrigé |
|---|---|---|---|---|---|
| K01 | /conseils, chapeau de page | Phrase | « Chaque conseil vient avec un exemple concret et un défi à tester aujourd'hui. » | « Chaque conseil vient avec un exemple concret, à tester aujourd'hui. » (le reste du chapeau inchangé) | N-I-L2 (fait faux en gratuit, fait 5) |
| K02 | /conseils, amorces des cartes (6 sur 8) | Texte du bas de carte | « Clique pour l'exemple et le défi » · « Un exercice t'attend là-dessous » · « Le défi est juste en dessous » · « Ouvre, y'a un défi pour toi » · « Teste-toi avec le défi » · « Vas-y, le défi t'attend » | « Clique pour l'exemple » · « Un exemple t'attend là-dessous » · « L'exemple est juste en dessous » · « Ouvre, y'a un exemple pour toi » · « Vois-le en situation » · « Vas-y, l'exemple t'attend ». Inchangées : « L'exemple concret est caché ici », « Un truc à tester aujourd'hui » | N-I-L2 : 6 amorces promettaient un défi à tous, y compris aux 3 conseils gratuits |
| K03 | Méta-descriptions de /conseils et des fiches conseil (hors trajet, pour @seo) | Texte | « … chacune avec un exemple, un dialogue et un défi à tester dès ce soir. » / « … un exercice à tester dès ce soir. » | À reformuler par @seo sans « défi » ni « exercice » pour le gratuit, par exemple « … chacune avec un exemple concret et un dialogue. » Le titre « + exercices » reste un choix SEO de @seo | N-I-L2 (même fait faux, côté résultats de recherche) |

### 2.4 Fenêtre Premium, geste « favori » (T4)

La fenêtre vend Premium, pas un marque-page. Ordre à l'écran : titre, rappel de l'objet cliqué, ligne Premium, prix en gros, plein, ligne compte, réassurance. Même texte pour la vanne, le conseil et la vidéo.

| Id | Surface | Élément | v1 | v2 | Défaut corrigé |
|---|---|---|---|---|---|
| W01 | Fenêtre favori | Titre | « Mets-la de côté » · « Garde-le sous le coude » · « Garde-la pour la revoir » | « Les favoris, c'est Premium » (4 mots, une seule phrase pour les trois objets). Le titre dit un fait, pas une promesse : le favori n'est pas ajouté tout seul (fait 1) | P2, S1, N2, Pc T4 clarté (5), Sc T4 offre en 3 s (5) |
| W02 | Fenêtre favori | Rappel de l'objet cliqué (nouveau) | absent | Une ligne d'italique sous le titre : « « Pour ta valise de départ, chacun a cotisé… » » = début de la vanne cliquée (donnée, 70 caractères au plus, coupé à un mot, « … »), ou le titre du conseil, ou le titre de la vidéo. **Absente si le début n'est pas fourni** (vide propre, rien de remplacé) | P2 (« rien sur la vanne concernée »), Pc T4 promesse |
| W03 | Fenêtre favori | Ligne Premium (nouveau) | absente | « Il ouvre aussi tout le catalogue et les 5 parcours. » (10 mots ; « Il » = Premium, nommé dans le titre ; 5 = `PARCOURS_COUNT`) | P2, S1 (« 36 € par an pour un marque-page ? »), N2, Nc T4 confiance (« m'abonner à quoi ? ») |
| W04 | Fenêtre (tous gestes) | Suffixe du prix | « 2,99 € » en gros + « TTC / mois » | « 2,99 € » en gros + « /mois » (TTC reste sur la carte d'offre et chez Stripe) | N-I-P2, arbitrage 8 |
| W05 | Fenêtre favori | Plein | « Je m'abonne et je la garde » (vanne), « … le garde » (conseil), « … la garde » (vidéo) | « S'abonner et tout ouvrir » (4 mots, infinitif, même pour les trois objets). Même motif que les deux autres gestes (voir W07) : acte, puis effet immédiat. Le prix est déjà en gros juste au-dessus. Aucune promesse sur le favori | S-ph1 (« je la garde » non tenu, fait 1), N-I-V1, Sc T4 promesse |
| W06 | Fenêtre (tous gestes) | Ligne compte (nouveau) | absente | « D'abord ton compte, puis le paiement. » (6 mots), **sous le plein, avant la réassurance**. Même formule en T3 (T01) et même écho que le titre de /register (G01) | P5, Pc T4 confiance, Sc T4 confiance, Nc T4 confiance |
| W07 | Fenêtre, gestes « vote » et « carte » (même composant, optionnel) | Plein | « Je m'abonne et je vote » · « Je m'abonne et j'ouvre toute la liste » | « S'abonner et voter » · « S'abonner et ouvrir la liste » | N-I-V1 (une seule personne grammaticale dans la même fenêtre). Hors des 7 trajets : à jouer avec W05 ou pas du tout |

### 2.5 /register (T1 à T5)

| Id | Surface | Élément | v1 | v2 | Défaut corrigé |
|---|---|---|---|---|---|
| G01 | /register | Titre | « Ton compte » | « Ton compte, puis le paiement » (écho exact de W06 et T01 ; proche de la ligne de /abonnement) | Sc T1 promesse, Sc T3 promesse, Nc T1 promesse, Pc T3 promesse (« je viens de demander l'étape 2 ») |
| G02 | /register | Rappel de la formule (graphie du prix) | « Premium, 2,99 € TTC par mois. » · annuel « Premium, 24,99 € TTC par an. » | « Premium, 2,99 €/mois. » · annuel « Premium, 24,99 €/an, renouvelé chaque année. » (la réassurance, qui dit « Résiliable depuis ton profil », est juste sous le bouton) | N-I-P1, N-I-P2, arbitrages 7 et 8, S4 (a) |
| G03 | /register | Phrase de contexte par entrée (nouveau, une phrase) | seulement pour la fin d'étape 1 | Après le rappel de formule : « Après le paiement, X s'ouvre. », X selon l'entrée (table du §3). Exemple : mur des vannes → « Après le paiement, la suite des vannes s'ouvre. » | N1, S5, P5, Pc T4 promesse, Sc T2 promesse |
| G04 | /register, fin d'étape 1 (`src=parcours-etape`) | Phrase de contexte | « Après le paiement, l'étape 2 de {Parcours} s'ouvre. » | « Après le paiement, l'étape 2 de {Parcours} s'ouvre : {titre de l'étape 2}. » Exemple : « … l'étape 2 de Répartie s'ouvre : Le rythme et les silences. » (donnée, fait 10) | Nc T3 envie (8) ; Pc et Sc T3 envie (les « +75 XP » ne disent rien) |
| G05 | /register | Lien « Tester l'étape 1 de {Parcours}, gratuite » | affiché sauf depuis la fin d'étape 1 | **Retiré dès que la personne vient d'un bouton d'achat** (toute entrée avec une source, sauf `login`). Gardé quand /register est ouvert sans source ou depuis /login, où il n'y a pas eu de clic d'achat. Le lien gratuit reste sur /abonnement (« Pas encore sûr ? ») | P5, N1, Pc T2 confiance (« une sortie quand je suis le plus décidé »), Pc T4 promesse (sujet jamais vu sur ce trajet), arbitrage 3 |
| G06 | /register | Ligne Stripe (nouveau) | absente | « Paiement sécurisé par Stripe. » (4 mots, texte déjà validé côté connecté), sous la réassurance, même style petit | Pc T1 confiance, Sc T1 confiance, Nc T1 confiance |

### 2.6 Fin d'étape 1 (T3)

| Id | Surface | Élément | v1 | v2 | Défaut corrigé |
|---|---|---|---|---|---|
| T01 | Carte de fin d'étape 1 | Ligne compte (nouveau) | absente | « D'abord ton compte, puis le paiement. » sous le bouton « Passer à l'étape 2 · 2,99 €/mois » (inchangé), **avant la réassurance** | Pc T3 confiance (-2 : « compte » surgit à l'écran suivant), Sc T3 confiance, Nc T3 confiance |
| T02 | Fin d'étape 1, variante quiz en cours (`VALIDATION_ETAPE.texte`) | Phrase | « Les étapes suivantes s'ouvrent avec Premium. » | « Premium ouvre la suite et les autres parcours d'un coup. » (déjà la phrase de la carte classique `FIN_ETAPE_1.phrase`) | Pc T3 clarté (7 : « pas ce que Premium donne d'autre »), Sc T3 offre en 3 s (7) |

### 2.7 Fin d'article générique (T5)

Le geste payant devient le plein, le gratuit un lien (règle « 1 plein par bloc, l'action gratuite devient un lien », celle de `BlocExercice`). Ordre à l'écran : titre, une phrase d'argument, plein payant, réassurance, lien gratuit, « Sans compte. ».

| Id | Surface | Élément | v1 | v2 | Défaut corrigé |
|---|---|---|---|---|---|
| F01 | Fin d'article | Plein | « Tester mes premières répliques, gratuit » (ou « Tester l'étape 1 de {Parcours}, gratuite ») | « Tout ouvrir · 2,99 €/mois » (libellé de porte inchangé, bouton plein) | N3, P4, Pc T5 envie (5), Nc T5 envie (6), arbitrage 5 |
| F02 | Fin d'article | Phrase au-dessus du bouton | « La placer à voix haute, ça s'entraîne. » (texte propre à l'article) | « Premium ouvre tout : le catalogue et les 5 parcours. » (9 mots, 5 = `PARCOURS_COUNT`). **Elle remplace le texte de l'article** : une phrase par bloc, et le budget de 25 mots est déjà dépassé par la réassurance (voir §4). Titre inchangé | Pc T5 clarté (« Tout ouvrir : tout ouvrir quoi ? »), Nc T5 clarté, N3 |
| F03 | Fin d'article | Réassurance sous le plein payant | absente (rien sous un lien) | « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » (mot pour mot) | Nc T5 confiance (« seul point d'entrée payant sans la ligne de garantie »), règle 5 des concisions (sous chaque plein qui porte un prix) |
| F04 | Fin d'article | Geste gratuit | bouton plein « Tester mes premières répliques, gratuit » | **Lien** (même texte), « Sans compte. » reste dessous | N3, P4 |
| F05 | Fin d'article | Position du bloc lettre | juste sous le bloc | Éloigné d'au moins un écran, après les articles liés (code, voir §6). Textes de la lettre inchangés | P4 (« trois demandes empilées »), N3 |
| A02c | /abonnement, entrée T5 | Accroche | « Pour tout ouvrir » | supprimée (voir A02) | Nc T5 promesse, N-I-R3, arbitrage 5 |

### 2.8 Relevé par les relecteurs et laissé tel quel (raison écrite)

| Élément | Relevé par | Décision et raison |
|---|---|---|
| « Premium ouvre tout Deviens Marrant », avantages 2 et 3 (« parcours », « carnet de répartie » jugés maison) | Pc T1 clarté, Sc T1 offre en 3 s, Nc | **Texte inchangé** : étalon A, choix de Thomas (non re-questionnable). Le carnet est expliqué par le chapeau et les deux bulles (A06, A08), le nom du site par le rendu seul (A01) |
| Lettre gratuite (« Une vanne décryptée, chaque mois. Gratuite, par e-mail, avec un exercice. ») trop proche du carnet payant | Sc T5 envie, S-ph8 | **Texte inchangé** : rien de faux. La confusion se lève ailleurs : le chapeau dit ce qu'est le carnet (une situation et sa réplique), le tableau oppose « 1 situation par carnet » à « Toutes » et la lettre « 1 par mois » à « Chaque semaine, si tu la veux », et le bloc lettre s'éloigne du bouton payant (F05). Un seul point à relire à l'aveugle : « avec un exercice » dans la lettre gratuite, face à « Exercices des fiches : Non » (ce sont deux objets : l'exercice de la lettre est dans l'e-mail) |
| « Il en reste 14, toutes ouvertes avec Premium. » | Sc T1, S-ph5 | **Inchangé** : exact (fait 7). C'est le numéro « Situation 15 » qui trompait (A07) |
| Réassurance « premier paiement remboursable sous 14 jours » | S-ph9 | **Inchangée, mot pour mot.** Les deux questions qu'elle laisse (à compter de quoi, annuel couvert ?) sont traitées dans la FAQ (A14, A15) |
| Annuel sur T3 et T4 | Sc T3 confiance (-1), Nc, N-I-P3 | **Pas d'annuel** (arbitrage 7, moins de clics). Risque assumé : un visiteur qui découvre ensuite l'annuel sur /abonnement peut se sentir moins bien traité. Aucun texte ajouté |
| Carte verrouillée vide sous le mur (deux barres et un cadenas) | Pc T2 envie | **Non traité** : afficher la première ligne de la vanne n° 11 floutée oblige à envoyer le texte payant au navigateur (fuite). À arbitrer par l'orchestrateur et @fullstack, pas par un texte |
| « Si j'arrête, je garde quoi ? » (FAQ) | Sc T1 confiance (c) | **Non ajouté** : seul l'accès jusqu'à la fin de la période payée est vérifié (CGU art. 3 ; `RESILIATION_PROGRAMMEE`). Favoris et progression après résiliation : non vérifiés. Phrase prête si besoin : « Si tu résilies, Premium court jusqu'à la fin de la période déjà payée. » |
| « +75 XP » sur les étapes verrouillées de T3 | Pc T3 clarté, Sc T3 envie | **Pas de texte écrit** : aucune demi-ligne de contenu d'étape n'existe en donnée ; je ne l'invente pas. Le titre de l'étape 2 passe sur /register (G04) |
| Nom accessible de l'en-tête « Premium, 2,99 € par mois : voir l'offre » | N-I-P2 | **Inchangé** : lecteur d'écran, « par mois » se dit ; ce n'est pas une graphie affichée |

## 3. Table des phrases de /register par entrée (G03)

Format de la phrase : « Premium, 2,99 €/mois. » (ou la formule annuelle, G02) suivie de la phrase de l'entrée. La source (`src`) est celle que /register reçoit déjà. Chaque phrase est vraie : le paiement ouvre tout (webhook immédiat, `docs/legal/remboursement-abonnement-s21.md` §1).

| Entrée (`src`) | Phrase |
|---|---|
| `mur-vannes` | Après le paiement, la suite des vannes s'ouvre. |
| `mur-conseils` | Après le paiement, la suite des conseils s'ouvre. |
| `mur-videos` | Après le paiement, la suite des vidéos s'ouvre. |
| `modale-carte` | Après le paiement, toute la liste s'ouvre. |
| `favoris`, `modale-favoris` | Après le paiement, les favoris s'ouvrent. |
| `exercice-vanne`, `exercice-conseil`, `exercice-video` | Après le paiement, les exercices des fiches s'ouvrent. |
| `carnet` (ou retour `/carnet`) | Après le paiement, tout le carnet s'ouvre. |
| `parcours-apercu` | Après le paiement, la suite de {Parcours} s'ouvre. |
| `parcours-etape` | Après le paiement, l'étape 2 de {Parcours} s'ouvre : {titre de l'étape 2}. |
| `onboarding` (quiz d'orientation) | Après le paiement, {Parcours} s'ouvre en entier. |
| `recherche` | Après le paiement, tous les résultats s'ouvrent. |
| `header`, `accueil-premium`, `glossaire`, `a-propos`, `quiz`, `blog-*` (fin d'article), `modale-vote`, `abonnement` (sans source) et toute autre source | Après le paiement, tout s'ouvre. |
| aucune source, ou `login` (pas de clic d'achat) | aucune phrase ; le lien « Tester l'étape 1… » reste (G05) |

## 4. Décomptes

### 4.1 /abonnement, visiteur, formule mensuelle, hors FAQ, hors texte de la fiche du carnet, hors accroche

| Bloc | v1 recompté | v2 | Écart |
|---|---|---|---|
| Titre, sous-titre, preuve | 24 | 24 | 0 |
| Avantages (3 + la lettre) | 33 | 33 | 0 |
| Cartes de formule (avec « soit 2,08 € par mois ») | 17 | 17 | 0 |
| Bouton, ligne de suite, réassurance, « Déjà un compte ? » | 27 | 29 | +2 (« sur Stripe ») |
| **Carnet** (titre 4, chapeau 10, reste 8) | 30 | 22 | **-8** (amorce, surtitre et lien sortent, le chapeau entre) |
| **Tableau** (en-têtes 2 + lignes) | 62 | 62 | 0 : titre visible -6, ligne 1 +4, ligne carnet +2 |
| « Pas encore sûr ? » | 11 | 11 | 0 |
| Bouton final, ligne de suite, réassurance | 23 | 25 | +2 (« sur Stripe ») |
| **Total avec la lettre** | **≈ 227** | **≈ 223** | **-4** |
| Total sans la lettre (lancement V0) | ≈ 205 | ≈ 201 | -4 |
| Formule annuelle choisie (+ « Renouvelé chaque année, sauf résiliation. », 5 mots) | ≈ 227 | ≈ 228 (≈ 206 sans la lettre) | +1 |

Tenu : « Si tu ajoutes, retire autant » (plafond 230 respecté dans les deux états, annuel compris). Ajouts : +4 (Stripe), +6 (tableau, unités), +5 (annuel, état annuel seulement) ; retraits : -8 (carnet), -6 (titre du tableau). Les accroches restantes (4 à 6 mots) comptent en plus, comme en v1. Le test de plafond (`conversion-s21-textes.test.ts`, 230) est à mettre à jour avec les nouvelles constantes.

### 4.2 Les trois blocs qui dépassent leur budget de concision (à arbitrer)

| Bloc | Budget (règle 9, hors bouton) | v1 | v2 | Cause |
|---|---|---|---|---|
| Fenêtre favori (titre 4, ligne Premium 10, prix 2, ligne compte 6, réassurance 11) | 25 | 17 | **33** | Elle devait vendre Premium (P2), nommer ce qui s'ouvre et annoncer le compte (arbitrage 2). Le rappel de la vanne (donnée) n'est pas compté |
| Fin d'article (titre 9, phrase 9, réassurance 11, lien gratuit 5, « Sans compte. » 2) | 25 | 22 | **36** | La réassurance (11) est obligatoire sous un plein qui porte un prix ; la phrase d'argument remplace le texte de l'article (-7, +9) |
| Fin d'étape 1 (T3) | 25 | ≈ 29 | ≈ 35 | + « D'abord ton compte, puis le paiement. » (6) |

Je demande une dérogation pour ces trois blocs, uniquement parce que chacun répond à un défaut classé dans les 5 premiers d'au moins deux relecteurs. Si l'orchestrateur la refuse, la coupe la moins coûteuse est la phrase d'argument de T5 (F02, 9 mots), pas la réassurance ni la ligne compte.

## 5. Lecture des trajets avec la v2 (téléphone, du clic à Stripe)

| Trajet | Ce que la personne lit, dans l'ordre | Écho |
|---|---|---|
| **T1 En-tête** | « Premium » → titre, 3 avantages, cartes, « S'abonner · 2,99 €/mois », « Tu crées ton compte, puis tu paies par carte sur Stripe. », réassurance → **Le carnet, en vrai** : « Tu parles toujours aussi peu ? » / « Donne-moi la nuit… » → tableau → /register « Ton compte, puis le paiement » / « Premium, 2,99 €/mois. Après le paiement, tout s'ouvre. » / « Paiement sécurisé par Stripe. » → « Ton compte est prêt. » / « Premium, 2,99 €/mois. » → Stripe | « Premium » à chaque écran, prix identique, deux étapes annoncées avant d'être vécues, Stripe nommé trois fois avant d'y arriver |
| **T2 Mur de vannes** | « Les 10 vannes gratuites, c'est fait. » / « Ouvrir la suite des vannes · 2,99 €/mois » → « Pour la suite des vannes » (16 px) → … tableau « Tout le catalogue : 10 vannes, 3 conseils, 3 vidéos dans les listes / Sans limite » → /register « Après le paiement, la suite des vannes s'ouvre. » (plus de lien gratuit) | Trois échos avant le prix, le tableau confirme ce qu'il vient de vivre, /register garde la promesse |
| **T3 Fin d'étape 1** | « Passer à l'étape 2 · 2,99 €/mois » / « D'abord ton compte, puis le paiement. » / réassurance → « Ton compte, puis le paiement » / « Après le paiement, l'étape 2 de Répartie s'ouvre : Le rythme et les silences. » | Le compte est annoncé avant d'être demandé ; l'étape 2 porte son nom |
| **T4 Fenêtre** | « Les favoris, c'est Premium » / « Pour ta valise de départ, chacun a cotisé… » / « Il ouvre aussi tout le catalogue et les 5 parcours. » / 2,99 € /mois / « S'abonner et tout ouvrir » / « D'abord ton compte, puis le paiement. » / réassurance → « Ton compte, puis le paiement » / « Après le paiement, les favoris s'ouvrent. » | Premium nommé et décrit, la vanne rappelée, aucune promesse que le code ne tient pas |
| **T5 Fin d'article** | « La vanne dans ta bouche, pas dans ton téléphone » / « Premium ouvre tout : le catalogue et les 5 parcours. » / « Tout ouvrir · 2,99 €/mois » / réassurance / lien « Tester mes premières répliques, gratuit » + « Sans compte. » → /abonnement **sans** accroche (le titre « Premium ouvre tout » fait l'écho) → suite comme T1 | « Tout ouvrir » → « ouvre tout » : un seul écho, plus de triple |
| **C1, C2** (compte sans abonnement) | Inchangés hors M01 à M04, A02 à A13 et A18 (qui ne s'affiche pas pour eux) | « Paiement sécurisé par Stripe » existait déjà |

**Un seul verbe par geste** : acheter = « S'abonner » (boutons /abonnement, accueil et profil connectés, fenêtre) ; aller payer pour ouvrir = « Ouvrir » / « Tout ouvrir » (murs, carnet, articles, accueil visiteur) ; créer le compte = « Créer mon compte » / « Tu crées ton compte » ; payer = « le paiement ». Les portes « Écrire la mienne », « Essayer ce conseil », « Décrypter cette vidéo » ne changent pas (aucun verdict ne les relève).

**Rien de faux** (source de chaque phrase nouvelle) : « Les favoris, c'est Premium » (favoris réservés, middleware) ; « Il ouvre aussi tout le catalogue et les 5 parcours » (tout est Premium dans le code) ; « Après le paiement, X s'ouvre » (accès immédiat au webhook) ; « Renouvelé chaque année, sauf résiliation » (CGU art. 3, Stripe) ; « 10 vannes, 3 conseils, 3 vidéos dans les listes » (API, fait 2) ; « 1 situation par carnet » (fait 7) ; « Les 14 jours courent dès ton abonnement » (CGU art. 6) ; « Paiement sécurisé par Stripe » (texte déjà validé). **Anti-signature IA** : zéro tiret cadratin, zéro « ce n'est pas X, c'est Y », zéro triplet d'adjectifs, relu à voix haute.

## 6. Pour @fullstack : changements de code et de logique

Fichiers du worktree `apps/web/src`. Chaque modification de code est à consigner dans `REPLIT_ACTIONS.md` (règle Marrant). Avant commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, puis `npx tsc --noEmit` (config complète) et Jest sans secrets Stripe.

**Textes seuls (constantes)**

1. `config/textes/abonnement-vente.ts` : `ACCROCHES.generique` supprimée ; `ABONNEMENT_ACHAT.suiteVisiteur` (A03) ; `lignesTableau` (A11, A12, A13) ; `TABLEAU.titre` conservé mais rendu `sr-only` (A10) ; `CARNET_VENTE.amorce` remplacée par `chapeau(deMois)` (A06) ; `ATTENTE_PAIEMENT` (A16, A17) ; nouvelle constante `FORMULES.renouvelAnnuel` = « Renouvelé chaque année, sauf résiliation. » (A04).
2. `lib/abonnement-accroche.ts` : les portes génériques (`SRC_GENERIQUES`, `blog-*`, `onboarding` sans parcours, `parcours-apercu` sans parcours) renvoient `AUCUNE` (A02).
3. `config/textes/cta-pages.ts` : `MUR_LISTE` (M01 à M04, avec `FREE_JOKE_LIMIT`) ; `CARNET_PAYWALL.bouton` (M05) ; `FENETRE_PREMIUM.favori` (W01, W05, un seul `TexteFenetre` pour les trois objets) + nouveaux champs de la fenêtre `ligne` (W03) et constante `FENETRE_COMPTE` (W06) ; `FENETRE_PRIX.suffixe` = « /mois » (W04) ; `VOTE_FENETRE` et `CARTE_FENETRE` (W07, optionnel) ; `REGISTER_CTA.titre` (G01), `planReminder` (G02, G03, G04 : prend `plan`, `src`, parcours), nouvelle constante `REGISTER_CTA.stripe` (G06) ; table du §3 en constante `CONTEXTE_REGISTER` (clé = `src`).
4. `config/textes/offre.ts` : `VALIDATION_ETAPE.texte` = `FIN_ETAPE_1.phrase` (T02) ; nouvelle fonction `prixLabel(plan)` = « 2,99 €/mois » / « 24,99 €/an » pour /register et l'attente (garder `prixTtcLabel` pour la carte d'offre et Stripe).
5. `config/textes/cta-articles-accueil.ts` : `BLOC_FIN` (F01 à F04) : `lienAbonnement` devient `bouton`, `boutonSansParcours`/`finBoutonEtape1` deviennent le lien ; nouvelle phrase d'argument (F02), `texte` d'article ignoré dans ce bloc.
6. `lib/faqs.ts` : `FAQ_VENTE` et `ANNUAL_PRICE_FAQ_ANSWER` (A14, A15). Même source pour le JSON-LD. Vérifier `lib/llms-content.ts` (les réponses prix y sont recopiées l.78 et l.154 selon l'inventaire de concision).
7. `app/(dashboard)/conseils/page.tsx` (K01) et `components/conseils/conseils-list.tsx` `TIP_TEASERS` (K02).

**Composants et logique**

8. **Favori après paiement (fait 1) : décision à prendre.** Texte v2 écrit pour le code actuel (aucune promesse). *Variante B, seulement si tu codes l'ajout automatique* : à l'ouverture de la fenêtre depuis l'étoile, mémoriser `{contentType, contentId}` (ex. `sessionStorage`) ; au retour de paiement (`PremiumWelcome` / `returnTo` = la page courante), appeler `addFavorite` puis vider la mémoire ; test : visiteur, étoile, paiement, retour, l'étoile est pleine. Alors, et alors seulement : W01 « Garde-la avec Premium », W05 « S'abonner et la garder », et sur /register `modale-favoris` « Après le paiement, ta vanne est dans tes favoris. » À rejouer à l'aveugle.
9. `components/ui/favorite-button.tsx` et ses appels (`vannes-list`, `conseils-list`, `videos-grid`, fiches) : nouvelle prop optionnelle `apercu?: string` (début de la vanne, titre du conseil ou de la vidéo) transmise à `PremiumModal`, qui l'affiche (W02, 70 caractères, coupé à un mot, « … », guillemets français avec espaces insécables). Prop absente : rien n'est rendu.
10. `components/premium/premium-modal.tsx` : ordre titre, rappel, ligne Premium, prix, plein, ligne compte (W06, pour les trois gestes), réassurance. Pour un compte connecté (le plein devient « On t'emmène au paiement… »), la ligne compte est masquée (il a déjà un compte).
11. **Exercice des conseils : fuite probable.** `/api/tips`, `/api/jokes`, `/api/videos` renvoient la ligne entière à un gratuit, alors que `catalogue-pages.ts` vide `exercise`/`howToApply`/`learnings` pour le HTML public. Vérifier en dépliant un conseil en gratuit : si l'« Exercice » s'affiche, vider ces champs dans les trois API pour un non-abonné, sinon « Exercices des fiches : Non » est faux pour les cartes dépliées.
12. `components/premium/abonnement-view.tsx` et `app/(dashboard)/abonnement/page.tsx` : ordre `{carnetExtrait}` puis `{tableau}` (A05) ; ligne `renouvelAnnuel` rendue seulement si `plan === "annual"` (A04) ; accroche en 16 px couleur pleine (A02b) ; page d'attente avec titre, texte et ligne de formule (`prixLabel(plan)`, plus « , renouvelé chaque année » en annuel : A16 à A18) ; option, non demandée : faire l'attente dans le bouton comme le connecté (verdicts neutre et sceptique) ou au moins masquer le pied de page de la page d'attente.
13. `components/carnet/carnet-extrait.tsx` + `carnet-fiche-card.tsx` : variante `extrait` réduite aux deux bulles « On te dit » et « Tu réponds » (sans titre h3, situation, « Pourquoi ça marche ») ; chapeau sous le titre ; plus de surtitre ni de lien (A06 à A09).
14. `app/(auth)/register/page.tsx` : titre (G01) ; phrase de contexte (G03, G04, titre de l'étape 2 via `PARCOURS_ETAPES[slug].titres[LAST_FREE_PARCOURS_STEP]`) ; lien gratuit affiché seulement si `src` est vide ou `login` (G05, aujourd'hui `src !== "parcours-etape"`) ; ligne Stripe (G06).
15. Fin d'article (composant `ArticleCta`, variante « fin ») : plein payant, réassurance sous le plein, lien gratuit, « Sans compte. » (F01 à F04) ; bloc lettre déplacé après les articles liés (F05).
16. **Tests à mettre à jour** : `__tests__/lib/conversion-s21-textes.test.ts` (l.93 attente, l.118-122 accroches génériques, plafond 230) ; `concision-v5-textes.test.ts` (l.188 `FENETRE_PRIX`, l.199-202 fenêtre, murs, l.308-310 FAQ) ; `faits-faux-concision-s21.test.ts` ; `faq-section.test.tsx` l.52 ; `premium-modal.test.tsx` ; `favorite-button.test.tsx` ; test de /register (lien gratuit, phrase de contexte, graphie du prix, annuel).

**Mise en page relevée par les relecteurs (pas du texte, à relayer à @design)**

17. Réassurance en couleur lisible et taille du corps (« gris minuscule ») ; sur le mur, la ligne de garantie est alignée à gauche, la centrer (Nc T2) ; carte « Mensuel » : vide de 40 à 50 px sous « TTC / mois » (Pc, Nc) ; sur ordinateur, limiter la carte d'offre à ≈ 560 px (Nc desktop) ; bouton en chargement violet délavé qui ressemble à un bouton désactivé : ajouter un indicateur (Pc C1/C2).
18. Option sceptique non arbitrée : FAQ « frais cachés » et « YouTube » ouvertes par défaut.
19. **Captures à refaire avant la prochaine relecture** : 375 × 700 et 320 × 640 (note sur le plus étroit, le bouton « S'abonner · 2,99 €/mois » doit rester visible sans défiler à 320 × 640) ; chemin « Annuel » coché de bout en bout (cartes, ligne de renouvellement, /register, attente) ; carte « Étape 2 sur N » absente de `T3/01` chez le neutre : vérifier qu'elle s'affiche.

## 7. Handoff

**Handoff → @orchestrator** (puis @fullstack pour l'intégration, @legal pour A04/A14/A15/W04/G02, @seo pour K03, @reviewer pour la relecture à l'aveugle)
- **Fichier produit** : `/home/user/Marrant/.claude/worktrees/conversion/docs/copy/conversion-s21/textes-trajet-v2.md`. Rien n'est branché ni commité.
- **Décisions** : registre inchangé (tutoiement, phrases courtes) ; fenêtre favori `[Framework : PAS court, Conscience : Problem-Aware]` ; fin d'article `[Framework : AIDA, Conscience : Solution-Aware]` ; /register et attente = continuité (un écho exact avec le clic, pas de persuasion nouvelle) ; formulations non négociables : « D'abord ton compte, puis le paiement. », « Après le paiement, X s'ouvre. », « Ouvrir la suite des vannes », « Les favoris, c'est Premium » ; CTA retenus : « S'abonner et tout ouvrir » (4 mots), « Ouvrir la suite des vannes · 2,99 €/mois » (5), « Tout ouvrir · 2,99 €/mois » (4, désormais plein en fin d'article).
- **Objections traitées** : « 2,99 €/mois pour un marque-page ? » (W01, W03) ; « un piège ? » (unités des limites A12, M04 ; renouvellement A04 ; 14 jours A14/A15 ; Stripe nommé A03, A17, G06) ; « et si je veux juste tester ? » (lien gratuit gardé sur /abonnement, retiré de /register au moment d'acheter) ; « je dois créer un compte ? » (T01, W06, G01). **Références marché** : aucune nouvelle ; cadrage @ux de la v1. **Mots-clés SEO** : aucun touché hors K03, à traiter par @seo.
- **Décisions que je laisse à l'orchestrateur** : (1) dérogation de budget pour la fenêtre, la fin d'article et T3 (§4.2) ; (2) F02 remplace le texte de l'article ; (3) W07 et M05 (même défaut sur des surfaces hors des 7 trajets) ; (4) variante B du favori si @fullstack code l'ajout (§6, point 8) ; (5) la carte verrouillée floutée de T2, non traitée (fuite de contenu payant) ; (6) `[À VALIDER @legal]` : prix affiché sans « TTC » hors carte d'offre (fait 8), phrase « sauf résiliation » de A04 et phrases ajoutées de la FAQ.
- **Relecture** : les textes de ce fichier ne sont pas validés. Ils doivent repasser la relecture à l'aveugle dans le trajet, captures conformes (375 × 700, 320 × 640, chemin annuel), seuil 9 sur chaque critère.





## Arbitrages de l'orchestrateur (tour 2)

1. **Favori après paiement : on le code.** Le clic sur l'étoile mémorise la vanne ; après le paiement, elle est ajoutée aux favoris automatiquement. La variante de texte « la vanne t'attend dans tes favoris » (§6 point 8) s'applique alors, et seulement si le test le prouve.
2. **Dérogations de budget acceptées** pour la fenêtre favori (33), la fin d'article (36) et la fin d'étape 1 (35) : conversion prioritaire, réassurance obligatoire sous un plein payant.
3. **Fin d'article** : la phrase d'argument remplace le texte propre à l'article (une phrase par bloc).
4. **Surfaces hors trajets (M05, W07)** : corrigées dans la même passe, pour la cohérence.
5. **Fuite de l'exercice dans `/api/tips`** : à corriger (exercice vidé pour un compte gratuit), avec un test.
6. **Non traités, confirmé** : la carte floutée de T2 et « +75 XP ».
7. **Points @legal** (TTC hors cartes de formule, « sauf résiliation », phrases de la FAQ) : avis demandé en parallèle ; on intègre, et on corrige si l'avis l'exige.
