# Textes du trajet de conversion s21 (v1)

> Auteur : @copywriter. Date : 19/10/2026. Statut : PROPOSITION, rien n'est branché. Chaque texte repasse la relecture à l'aveugle **dans le trajet** (grille `docs/ux/trajet-conversion-s21.md` §11), pas isolément (règle d'or P0 s18).
> Entrées : plan @ux `docs/ux/trajet-conversion-s21.md`, étalons `docs/copy/conversion-s21/etalons-abonnement.md`, décisions de Thomas du 19/10 (`docs/founder-preferences.md` l.123 à 125), `docs/copy/ton-alex.md`, règles de concision §4 (dépôt principal), code du worktree (`apps/web/src`).
> Contraintes tenues : tutoiement, zéro tiret cadratin, aucune promesse de résultat, « 1 500+ », prix 2,99 € / 24,99 € TTC, « plus de 3 mois offerts » et la réassurance unique intacts, aucune mention légale dans un bouton, aucun concurrent nommé, aucun témoignage.
> **Convention de comptage** : un mot = une suite séparée par des espaces ; « · » et « / » ne comptent pas ; « 2,99 €/mois » = 2 mots ; « 1 500+ » = 1 mot. Les compteurs (parcours, limites, situations du carnet, mois) sont lus à la source, jamais écrits en dur (`PARCOURS_COUNT`, `FREE_*_LIMIT`, `getCarnetExtrait`).

## 0. À lire en premier

**Étalon A appliqué mot pour mot** (titre, sous-titre, 4 avantages, boutons). Tout le reste de la page est écrit autour.

| Chiffre | Valeur |
|---|---|
| /abonnement, **version de lancement SANS la lettre** (V0) | **207 mots** hors FAQ et hors fiche du carnet (+ une accroche d'origine de 4 à 6 mots) |
| /abonnement **AVEC la lettre** (V1, le 12/11, formulation @legal avec opt-in) | **229 mots** (+ accroche) : l'ajustement @legal coûte 6 mots de plus que l'étalon A (avantage +1, ligne du tableau +5) |
| Budget de Thomas | environ 230 mots : V0 tient largement (207, 213 avec accroche) ; V1 tient hors accroche (229), 235 avec une accroche de 6 mots. Si Thomas veut rester sous 230 avec accroche : retirer la ligne de suite sous le bouton final (-9) |
| Surfaces de libellé d'achat qui changent (plan @ux) | 5 (/abonnement, en-tête court, accueil connecté, quiz d'orientation connecté, profil) |
| Écarts avec le plan @ux trouvés dans le code (à trancher, §6) | 3 : a-propos va direct à /register, le quiz d'orientation a deux destinations pour un seul libellé, « Tu es déjà Premium » est inutile |

**Les principales décisions que j'ai dû trancher** (8 au §6, plus 3 questions pour Thomas) : (1) l'accroche d'origine s'écrit « Pour… » et se pose au-dessus du titre ; (2) le sous-titre de Thomas reste identique pour toutes les origines ; (3) la ligne de suite est « Tu crées ton compte, puis tu paies par carte. » ; (4) pas de réassurance sous la barre collante ; (5) l'en-tête court passe à « Premium · 2,99 € » (repli « Premium ») ; (6) la FAQ prix reçoit la réassurance unique mot pour mot, rien d'autre.

**Condition de mise en ligne de la lettre** : toute ligne qui la nomme est marquée `[LETTRE]` ci-dessous. Elle n'entre en production qu'avec l'envoi hebdomadaire réel (premier envoi jeudi 12/11/2026 8 h). La version SANS la lettre est donnée en entier au §1.6.
**Ajustement @legal intégré partout** (message du 19/10) : la lettre s'écrit « **Une lettre par e-mail chaque semaine, si tu la veux.** » (liste, profil, accueil, bienvenue) et, dans le tableau, **Lettre par e-mail | 1 par mois | Chaque semaine, si tu la veux**. Raison : opt-in omis (pratique trompeuse par omission), remplacement automatique suggéré, « lettre » ambigu avec un courrier papier. La comparaison 4 contre 1 de Thomas reste portée par le tableau.

## 1. /abonnement, bloc par bloc (ordre de la structure cible, @ux §5)

### 1.1 Accroche selon l'origine du clic (B1, au-dessus du titre)

Une ligne de 12 px, couleur accent, 1 ligne à 375 px, **4 à 6 mots**. Elle reprend les mots du bouton cliqué ; le titre qui suit complète la phrase (« Pour la suite des vannes / Premium ouvre tout Deviens Marrant »). Elle est absente quand le titre fait déjà l'écho (en-tête). Priorité de lecture pour @fullstack : `src` pour `mur-*`, `exercice-*`, `favoris`, `recherche`, `onboarding`, `parcours-apercu` ; sinon `returnTo` exact `/carnet` ; sinon la règle générique ; sinon rien.

| Surface (source `src`) | Libellé du bouton cliqué (inchangé) | Texte actuel | Nouvel accroche | Raison |
|---|---|---|---|---|
| En-tête, menu mobile (`header`) | « Premium · 2,99 €/mois » ou « Premium · 2,99 € » (§2) | aucun | **aucune** | Le titre commence par « Premium » : l'écho est dans le titre. Une accroche ajouterait une ligne pour rien |
| Mur /vannes (`mur-vannes`) | « Voir la suite des vannes · 2,99 €/mois » | aucun | **Pour la suite des vannes** | Écho exact ; le sous-titre « dixième vanne » prolonge |
| Mur /conseils (`mur-conseils`) | « Voir la suite des conseils · 2,99 €/mois » | aucun | **Pour la suite des conseils** | Écho exact |
| Mur /videos (`mur-videos`) | « Voir la suite des vidéos · 2,99 €/mois » | aucun | **Pour la suite des vidéos** | Écho exact |
| Fiche vanne (`exercice-vanne`) | « Écrire la mienne · 2,99 €/mois » | aucun | **Pour écrire ta vanne** | « la mienne » devient « ta vanne » : même geste, vu depuis la page |
| Fiche conseil (`exercice-conseil`) | « Essayer ce conseil · 2,99 €/mois » | aucun | **Pour essayer ce conseil** | Écho exact |
| Fiche vidéo (`exercice-video`) | « Décrypter cette vidéo · 2,99 €/mois » | aucun | **Pour décrypter cette vidéo** | Écho exact |
| /carnet (`returnTo=/carnet`, toute `src`) | « Voir tout le carnet · 2,99 €/mois » | aucun | **Pour tout le carnet** | Écho exact. La `src` d'arrivée peut être un article : `returnTo` prime |
| Aperçu d'une étape 2+ (`parcours-apercu`) | « Ouvrir les 5 parcours · 2,99 €/mois » | aucun | **Pour la suite de {Parcours}** (ex. « Pour la suite de Répartie ») | Le visiteur lisait un parcours précis. Variante si `returnTo` porte l'étape : « Pour l'étape {N} de {Parcours} » `[À VÉRIFIER : l'étape n'est pas dans l'URL]` |
| Quiz d'orientation, visiteur (`onboarding`) | « Ouvrir les 5 parcours · 2,99 €/mois » | aucun | **Pour ton parcours : {Parcours}** | Reprend le titre du résultat « Ton parcours : Répartie » |
| Recherche limitée (`recherche`) | lien « passe en Premium pour tout voir » | aucun | **Pour tout voir** | Écho exact du lien |
| Favoris (`favoris`, redirection du middleware) | aucun libellé vu (le visiteur a cliqué un lien de menu) | aucun | **Pour garder tes favoris** | Cas le plus fragile : il arrive sur une page de vente sans avoir vu de bouton. L'accroche est son seul écho |
| Accueil carte (`accueil-premium`), articles (`blog-*`, `blog-demo-*`), glossaire, quiz d'humour (`quiz`) | « Ouvrir les 5 parcours · 2,99 €/mois » | aucun | **Pour ouvrir les 5 parcours** | Écho exact du verbe et de l'objet ; le titre élargit à « tout ». Nombre lu dans `PARCOURS_COUNT` |
| /parcours liste (`parcours-liste`), `onboarding-visiteur`, `direct`, inconnue | carte « Abonnement 2,99 €/mois : Premium : tous les parcours, vannes, conseils et vidéos. » ou aucun | aucun | **aucune** | La carte de /parcours dit déjà « Premium » ; les autres cas n'ont pas de clic à répéter |

Aucune accroche n'est montrée à un compte déjà connecté qui arrive par un bouton direct, mais elle l'est s'il passe par /abonnement (même règle). Coût : 6 mots maximum, hors total.

### 1.2 B0 à B2 : bandeau, haut de page, carte d'offre

| Surface | Élément | Texte actuel | Nouveau texte | Raison |
|---|---|---|---|---|
| /abonnement B0 (si `?paiement=annule`) | Bandeau | Titre « Paiement annulé, rien n’a été prélevé. » + texte « Tu peux réessayer quand tu veux. » (deux paragraphes, `mb-6`) | **Mêmes mots, une seule ligne de texte** : « Paiement annulé, rien n’a été prélevé. Tu peux réessayer quand tu veux. » (12 mots, bouton de fermeture) | Texte validé s16 (étalon 5b.2) inchangé. Seule la forme change : un `<p>` de 56 px max pour ne pas pousser le bouton hors du premier écran (P10). Hors total (conditionnel) |
| B1 | Titre (H1) | « Ta réplique en soirée, pas dans le bus du retour » (selon le parcours) | **Premium ouvre tout Deviens Marrant** (5 mots) | Étalon A, choix de Thomas. Le mot du clic y est ; un seul titre pour toutes les origines (le titre par parcours disparaît) |
| B1 | Sous-titre | « Pas d’attente entre les étapes, de 15 à 20 minutes chacune. » | **Les listes ne s’arrêtent plus à la dixième vanne, les parcours vont au bout.** (14 mots) | Étalon A. « dixième » = `FREE_JOKE_LIMIT` + 1 en ordinal, à calculer. Vrai pour la liste défilante |
| B1 | Preuve | absente de la page | **1 500+ inscrits bossent leur humour.** (5 mots) | Formulation validée par Thomas (accueil), reprise telle quelle, sans autre chiffre accolé. 14 px, une ligne |
| B2 | Nom de la carte (h2) | « Premium » | **supprimé à l'écran, gardé en `sr-only`** (« Offre Premium », non compté) | Le titre dit déjà Premium ; 1 mot et 28 px gagnés pour le premier écran |
| B2 | Avantage 1 | « Chaque parcours en entier » | **Tout le catalogue : vannes, conseils, vidéos** (6 mots) | Étalon A. L'obstacle du visiteur de mur vient en premier |
| B2 | Avantage 2 | « Un nouveau carnet de répartie chaque mois » | **Les 5 parcours, de la première à la dernière étape** (10 mots) | Étalon A. Nombre = `PARCOURS_COUNT` |
| B2 | Avantage 3 | « Tout le catalogue : vannes, conseils, vidéos » | **Un nouveau carnet de répartie chaque mois** (7 mots) | Étalon A, texte déjà validé |
| B2 | Avantage 4 `[LETTRE]` | « Tes favoris sous la main » | **Une lettre par e-mail chaque semaine, si tu la veux.** (10 mots) | **Ajustement @legal du 19/10** (`docs/legal/lettre-hebdo-premium-s21.md`) à la place de l'étalon A « Une lettre chaque semaine, au lieu d’une par mois » : l'ancienne phrase omettait l'opt-in (pratique trompeuse par omission), suggérait un remplacement automatique, et « lettre » pouvait se lire comme un courrier papier. Choix de la version courte : la longue validée (« Une lettre par e-mail chaque semaine au lieu d’une par mois, si tu la veux. », 15 mots, 3 lignes à 375 px) casse la liste ; la comparaison 4 contre 1 de Thomas est gardée dans la ligne du tableau (« 1 par mois » contre « Chaque semaine, si tu la veux »). Tient sur 2 lignes comme l'avantage 2 `[À MESURER 375 et 320 px]`, pas sur une. **Absent en V0.** Les favoris sortent de la liste et vivent dans le tableau (ligne « Favoris ») |
| B2 | Choix mensuel | pastille « Mensuel » + ligne « 2,99 € TTC / mois » + ligne « Ou 24,99 €/an, soit 2,08 € par mois. » | Carte radio **Mensuel / 2,99 € TTC / mois** (5 mots), présélectionnée | Plan @ux : deux cartes côte à côte, une seule fois chaque fait |
| B2 | Choix annuel | pastille « Annuel » + pastille « plus de 3 mois offerts » | Carte radio **Annuel / 24,99 € TTC / an** (5 mots), avec dessous **plus de 3 mois offerts** (5 mots) | Prix et mention intouchables, dits une seule fois. « soit 2,08 € par mois » sort de la page pour tenir le budget : option +5 mots si Thomas y tient (`ANNUEL_LIGNE_ANNUEL`) |
| B2 | Annuel indisponible | « 2,99 € TTC / mois » seul | inchangé | Page identique, formule mensuelle seule |
| B2 | Bouton (visiteur et connecté), mensuel | « Ouvrir les 5 parcours · 2,99 €/mois » | **S’abonner · 2,99 €/mois** (3 mots) | Étalon A. Même verbe que le bouton Stripe et la fenêtre Premium |
| B2 | Bouton, annuel | « Ouvrir les 5 parcours · 24,99 €/an » | **S’abonner · 24,99 €/an** (3 mots) | Étalon A |
| B2 | Bouton connecté, en chargement | « On t’emmène au paiement… » | inchangé | Validé |
| B2 | **Ligne de suite (visiteur)** | « Ton compte, puis le paiement sécurisé. » (obscur) | **Tu crées ton compte, puis tu paies par carte.** (9 mots) | Dit les deux gestes avec deux verbes, dans l'ordre. « Par carte » est vrai (`payment_method_types: ["card"]`). Google et e-mail sont annoncés sur l'écran suivant |
| B2 | Ligne de suite (compte connecté) | « Paiement sécurisé par Stripe » | inchangé (4 mots, remplace la ligne ci-dessus) | Le connecté n'a pas de compte à créer ; texte validé, vrai |
| B2 | Réassurance | « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » | **inchangée** (11 mots), 13 px, contraste AA, sous la ligne de suite | Intouchable. Passe de 12 px gris pâle à 13 px `text-secondary` (@ux §13) : la forme change, pas un mot |
| B2 | **Déjà un compte (visiteur)** | absent | **Déjà un compte ? Connecte-toi** (4 mots) | Réutilise `REGISTER_CTA.dejaCompte` + `connecteToi`, déjà validés sur /register. Cible 44 px. Après connexion, retour sur /abonnement avec la formule et l'origine conservées `[À CALER avec @fullstack : paiement ouvert tout seul ou bouton S'abonner]` |

### 1.3 B3 : tableau Gratuit / Premium (écran 2)

Faits relus dans le code : listes limitées côté API (`api/tips`, `api/videos`, `FREE_JOKE_LIMIT`) et illimitées en Premium ; `LAST_FREE_PARCOURS_STEP = 1` ; `CARNET_FREE_FICHES = 1` ; validation d'étape Premium seulement ; bloc exercice Premium ; favoris Premium (middleware) ; quiz et vanne du jour restent au visiteur (choix du 05/10). Le libellé « Listes : … » est ce qui rend la cellule « 10, 3 et 3 » vraie : les fiches en accès direct restent lisibles et ne sont pas dans la ligne.

| Surface | Élément | Texte actuel | Nouveau texte | Raison |
|---|---|---|---|---|
| B3 | Titre (h2) | absent | **Gratuit et Premium, côte à côte** (5 mots) | Ne répète pas le titre de la page ; nomme les deux colonnes |
| B3 | En-têtes | absents | **Gratuit / Premium** (2 mots) ; 1re colonne en `sr-only` « Ce qui change » | `<th scope>` |
| B3 | Ligne 1 | absente | **Listes : vannes, conseils, vidéos / 10, 3 et 3 / Sans limite** (10 mots) | Ordre des constantes = ordre du libellé. Valeurs = `FREE_JOKE_LIMIT`, `FREE_TIP_LIMIT`, `FREE_VIDEO_LIMIT`. Ligne mise en avant pour `mur-*` |
| B3 | Ligne 2 | absente | **Parcours / Étape 1 de chacun / Les 5, en entier** (9 mots) | `LAST_FREE_PARCOURS_STEP`, `PARCOURS_COUNT` |
| B3 | Ligne 3 | absente | **Carnet de répartie / 1 situation / Toutes les situations** (8 mots) | `CARNET_FREE_FICHES`. Le « chaque mois » est dit une fois, dans l'avantage 3. Ligne mise en avant pour `/carnet`. Masquée si le carnet du mois manque |
| B3 | Ligne 3 bis `[LETTRE]` | absente | **Lettre par e-mail / 1 par mois / Chaque semaine, si tu la veux** (12 mots) | **Ajustement @legal** : « par e-mail » lève l'ambiguïté du courrier papier, « si tu la veux » dit l'opt-in ; « 1 par mois » contre « Chaque semaine » garde le 4 contre 1 voulu par Thomas. **Absente en V0** |
| B3 | Ligne 4 | absente | **Exercices des fiches / Non / Oui** (5 mots) | `BLOC_EXERCICE`. Mise en avant pour `exercice-*` |
| B3 | Ligne 5 | absente | **Progression et série / Non / Oui** (5 mots) | `canValidateParcoursStep` (Premium, étape 1 comprise), libellé « Série » du profil |
| B3 | Ligne 6 | absente | **Favoris / Non / Oui** (3 mots) | Mise en avant pour `favoris` |
| B3 | Ligne 7 | absente | **Quiz et vanne du jour / Oui / Oui** (7 mots) | La ligne de confiance : le gratuit n'est pas un piège. Si le tableau doit raccourcir, elle saute en premier |
| B3 | Cellules oui / non | absentes | ✓ avec texte masqué « inclus » ; « Non » écrit en gris | Jamais la couleur seule |

Total V0 : 5 + 2 + 47 = **54 mots**. V1 : 54 + 12 = **66 mots**.

### 1.4 B4 à B6 : preuve du carnet, « Pas encore sûr ? », bouton final, barre collante

| Surface | Élément | Texte actuel | Nouveau texte | Raison |
|---|---|---|---|---|
| B4 | Amorce (avant le surtitre) | absente | **Un exemple de ce qui s’ajoute chaque mois.** (8 mots) | « s'ajoute » et non « tu reçois » : le carnet se lit sur le site, il n'est pas envoyé |
| B4 | Surtitre | « Carnet d’octobre · Situation 15, offerte » | inchangé (5 mots) | Validé, calculé sur le carnet du mois |
| B4 | Titre | « Le carnet, en vrai » | inchangé (4 mots) | Validé |
| B4 | Fiche | `CarnetFicheCard extrait` | inchangée | Hors budget (texte de la fiche) |
| B4 | **Ligne du reste** | absente | **Il en reste 14, toutes ouvertes avec Premium.** (8 mots) | 14 = nombre de situations du carnet du mois moins la fiche offerte, calculé. Ne répète pas « chaque mois » de l'avantage 3 |
| B4 | Lien | « Lire la fiche en entier » | inchangé (5 mots) | Lien discret, sort de la page |
| B5 | Titre + lien | « Pas encore sûr ? » + « Tester l’étape 1 de Répartie, gratuite » | inchangés (3 + 6 mots) | Validés (`GRATUIT_P`) ; parcours d'origine sinon Répartie |
| B5 | Ligne | absente | **Sans compte.** (2 mots) | Fait vrai (étape 1 en lecture libre), mot pour mot du libellé validé `SANS_COMPTE` |
| B6 | Bouton final | absent | **S’abonner · 2,99 €/mois** (annuel : « … 24,99 €/an ») (3 mots) | Même composant, même formule que B2 |
| B6 | Ligne de suite (visiteur) | absente | **Tu crées ton compte, puis tu paies par carte.** (9 mots) | Le visiteur qui descend jusqu'ici n'a pas forcément lu B2. Retirable (-9) |
| B6 | Réassurance | « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » | inchangée (11 mots) | Règle : sous chaque plein qui porte un prix |
| Barre collante (mobile, écrans 2 à 5) | Bouton | absente | **S’abonner · 2,99 €/mois** (annuel selon la formule choisie) | Strictement le libellé du bouton principal. Pas de ligne de suite ni de réassurance dessous : la réassurance ne se raccourcit pas (intouchable) et deux lignes feraient 80 px. Elle disparaît quand B6 entre à l'écran, donc la réassurance est toujours visible au moment où le bouton final se tape. Mot pour mot identique, non compté |
| Compte connecté, déjà abonné ou impayé (409) | Message | `TEXTES_CHECKOUT.dejaAbonne` / `impaye` + lien « Aller à mon profil » | inchangés | Validés. Voir §6 : l'état « Tu es déjà Premium » n'est pas écrit |

### 1.5 B7 : FAQ prix (retouche autorisée par Thomas le 19/10)

| Surface | Élément | Texte actuel | Nouveau texte | Raison |
|---|---|---|---|---|
| FAQ /abonnement et accueil (réponse « prix », mensuel seul) | Réponse à « 2,99 €/mois, c’est vraiment tout ? Pas de frais cachés ? » | « C’est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas. » (15 mots) | **« C’est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas. Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. »** (26 mots) | Dit comment résilier (« depuis ton profil ») avec la réassurance unique mot pour mot, sans seconde formulation. Phrase factuelle |
| Même réponse, annuel disponible | idem | « … chaque mois ou chaque année, tant que tu ne résilies pas. » (18 mots) | **« C’est le prix, point. Ça se renouvelle chaque mois ou chaque année, tant que tu ne résilies pas. Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. »** (29 mots) | Même ajout. Le JSON-LD suit (même source `getPremiumFaqs`). Tests à mettre à jour : `concision-v5-textes.test.ts` l.308 à 310, `faits-faux-concision-s21.test.ts`, `faq-section.test.tsx` l.52 |

### 1.6 Version de lancement SANS la lettre (V0) et version AVEC (V1)

| Élément | V0 (la page part avec) | V1 (le 12/11, avec l'envoi réel) |
|---|---|---|
| Avantages | 3 lignes : « Tout le catalogue : vannes, conseils, vidéos » / « Les 5 parcours, de la première à la dernière étape » / « Un nouveau carnet de répartie chaque mois » | + 4e ligne « Une lettre par e-mail chaque semaine, si tu la veux. » |
| Tableau | 7 lignes (listes, parcours, carnet, exercices, progression, favoris, quiz) | 8 lignes : + « Lettre par e-mail / 1 par mois / Chaque semaine, si tu la veux » après le carnet |
| Phrase d'objet (accueil et profil connectés, §2) | « Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois. » | identique : avec la lettre et son opt-in, la phrase dépasserait 15 mots (24). La lettre se dit sur /abonnement et dans la bienvenue |
| Bannière de bienvenue (§4) | sans la lettre | + « Ta lettre de chaque semaine s’active depuis ton profil. » `[À CALER : emplacement réel de la case opt-in]` |
| Mots | **207** (213 avec accroche) | **229** (235 avec accroche) |
| Mise en œuvre | un drapeau unique (ex. `LETTRE_HEBDO_PREMIUM_ACTIVE`) qui filtre la 4e ligne, la ligne du tableau et la phrase de bienvenue | idem, drapeau à `true` après le premier envoi réel |

### 1.7 Décompte de /abonnement (visiteur, mensuel, hors FAQ et hors texte de la fiche du carnet)

| Bloc | Mots V0 | Mots V1 | Détail |
|---|---|---|---|
| B1 titre, sous-titre, preuve | 24 | 24 | 5 + 14 + 5 |
| B2 avantages | 23 | 33 | 6 + 10 + 7 (+ 10 en V1) |
| B2 formules | 15 | 15 | 5 + 5 + 5 |
| B2 bouton, suite, réassurance, compte | 27 | 27 | 3 + 9 + 11 + 4 |
| B3 tableau | 54 | 66 | 5 + 2 + 47 (+ 12 en V1) |
| B4 carnet | 30 | 30 | 8 + 5 + 4 + 8 + 5 |
| B5 pas encore sûr | 11 | 11 | 3 + 6 + 2 |
| B6 bouton final, suite, réassurance | 23 | 23 | 3 + 9 + 11 |
| **Total** | **207** | **229** | accroche d'origine en plus : 4 à 6 mots |

Compte connecté : « suite » de 4 mots au lieu de 9 (deux fois : B2 et B6, -10), pas de « Déjà un compte » (-4), pas de B5 (-11) : **182 mots** en V0.

## 2. Les 5 surfaces dont le libellé d'achat change (plan @ux §7, lignes 1, 3, 5, 14, 15)

Critère : le clic mène à la création de compte ou à Stripe (le visiteur n'ouvre plus une page d'offre), donc le libellé dit l'acte : « S'abonner ». Phrase d'objet commune (accueil et profil connectés) : **Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois.** (14 mots, sans la lettre : voir §1.6). Elle reprend le titre de /abonnement, car ces comptes vont à Stripe sans avoir lu l'offre.

| Surface | Élément | Texte actuel | Nouveau texte | Raison |
|---|---|---|---|---|
| 1. /abonnement (visiteur et connecté), B2, B6, barre collante | Bouton | « Ouvrir les 5 parcours · 2,99 €/mois » | **S’abonner · 2,99 €/mois** (annuel : « S’abonner · 24,99 €/an ») | Étalon A. Détail au §1.2 |
| 2. En-tête sous 640 px (`EN_TETE.boutonCourt`) | Bouton | « 2,99 €/mois » | **Premium · 2,99 €** ; repli **Premium** si le test de largeur à 320, 360 et 375 px échoue `[À MESURER]` | Un prix sans objet n'est pas un libellé (« 2,99 € par quoi ? »). Le titre de la page commence par « Premium » : l'écho est exact. Le « /mois » est dans le premier écran de la page |
| 2 bis. En-tête, nom accessible (`EN_TETE.nomAccessible`) | `aria-label` | « 2,99 € par mois : voir l’offre Premium » | **Premium, 2,99 € par mois : voir l’offre** | Le nom accessible commence par le texte visible (WCAG 2.5.3). Vaut pour les deux largeurs |
| 3. Accueil, carte Premium, compte connecté sans abonnement (`CARTE_PREMIUM`) | Bouton (Stripe direct) | « Ouvrir les 5 parcours · 2,99 €/mois » | **S’abonner · 2,99 €/mois** | La destination change, le libellé aussi. Le visiteur garde « Ouvrir les 5 parcours · 2,99 €/mois » (porte vers /abonnement) |
| 3 bis. Même carte, compte connecté | Phrase | « De la coloc à l’afterwork, de quoi répondre partout. » | **Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois.** (14 mots) | Le compte paie sans avoir lu l'offre. Le visiteur garde la phrase validée (il verra l'offre sur /abonnement) |
| 4. Quiz d'orientation, compte sans abonnement (`QUIZ_ORIENTATION_CTA.bouton`, Stripe direct) | Bouton | « Ouvrir les 5 parcours · 2,99 €/mois » | **S’abonner · 2,99 €/mois** | Même raison. **Le visiteur du même quiz va à /abonnement** (`humor-quiz.tsx` l.240) et garde « Ouvrir les 5 parcours · 2,99 €/mois » : il faut deux constantes, pas une |
| 4 bis. Même bloc, compte connecté | Ligne ajoutée après « Pour toi si… » | absente | **Premium ouvre ce parcours et tout le reste.** (8 mots) | « S'abonner » sous « Ton parcours : Répartie » laisse croire qu'on paie ce seul parcours. Une ligne dit l'objet. Total du bloc : environ 25 mots hors bouton |
| 5. Profil, compte sans abonnement (`PROFIL_ABONNEMENT_OFFRE`) | Bouton (Stripe direct) | « Ouvrir les 5 parcours · 2,99 €/mois » | **S’abonner · 2,99 €/mois** | Même raison |
| 5 bis. Même bloc | Phrase | « Chaque mois, un nouveau carnet de répartie s’ajoute aux parcours. » | **Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois.** | Le texte actuel ne nomme qu'un avantage (le carnet). Aligné sur l'accueil connecté |

### 2.1 Ce que le code montre en plus (non listé dans le plan @ux)

| Surface | Constat | Proposition |
|---|---|---|
| /a-propos (`AuthCta`, visiteur) | « Ouvrir les 5 parcours · 2,99 €/mois » mène **directement à /register** (`callbackUrl=/abonnement`), le visiteur ne voit jamais l'offre. Le plan @ux le classait parmi les portes vers /abonnement | **Recommandé** : remplacer `AuthCta` par un lien vers `/abonnement?src=a-propos` comme le glossaire (le libellé reste, l'accroche « Pour ouvrir les 5 parcours » s'affiche). Sinon : libellé « S’abonner · 2,99 €/mois ». J'ai tranché pour la route |
| /favoris, carte « Les favoris sont réservés aux membres Premium » | Le middleware redirige déjà les non-abonnés vers /abonnement (`src=favoris`) : la carte est presque invisible. Son bouton « Ouvrir les 5 parcours » ne parle pas de favoris | Ne pas réécrire la carte. L'accroche « Pour garder tes favoris » sert d'écho (§1.1) |
| `premium-paywall.tsx` (bouton `PAYWALL_PREMIUM.bouton` vers Stripe) | Composant jamais importé (code mort). Libellé d'ouverture pour un paiement direct | Si un jour réutilisé : « S’abonner · 2,99 €/mois » |
| `/onboarding` visiteur (`onboarding-visiteur`) | Redirection sèche vers /abonnement, aucun clic à répéter | Pas d'accroche. Si Thomas veut une porte plus douce, c'est un chantier de parcours, pas de texte |

## 3. Surfaces « porte » : test d'écho (le titre ou l'accroche reprend les mots du clic)

Test appliqué : les mots du libellé cliqué se retrouvent dans l'accroche, le titre « Premium ouvre tout Deviens Marrant » ou le sous-titre, sans rupture de sujet.

| Surface (libellé inchangé) | Accroche affichée | Ce que le visiteur lit au premier écran | Écho |
|---|---|---|---|
| En-tête ≥ 640 px « Premium · 2,99 €/mois » | aucune | « Premium ouvre tout Deviens Marrant » | OK : mot « Premium » |
| En-tête < 640 px « Premium · 2,99 € » (nouveau) | aucune | idem | OK |
| Accueil carte, article, glossaire, quiz d'humour « Ouvrir les 5 parcours · 2,99 €/mois » | « Pour ouvrir les 5 parcours » | + titre (« ouvre ») + sous-titre « les parcours vont au bout » | OK : verbe et objet |
| Mur vannes « Voir la suite des vannes · 2,99 €/mois » | « Pour la suite des vannes » | sous-titre « dixième vanne » | OK : trois échos |
| Mur conseils, vidéos | « Pour la suite des conseils / des vidéos » | sous-titre dit « vanne » | OK par l'accroche et par « listes ». Réserve au §6 |
| Fiches « Écrire la mienne / Essayer ce conseil / Décrypter cette vidéo · 2,99 €/mois » | « Pour écrire ta vanne / essayer ce conseil / décrypter cette vidéo » | tableau : ligne « Exercices des fiches » mise en avant | OK |
| /carnet « Voir tout le carnet · 2,99 €/mois » | « Pour tout le carnet » | avantage 3 « carnet de répartie », tableau et démonstration du carnet | OK |
| Aperçu d'étape 2+ « Ouvrir les 5 parcours · 2,99 €/mois » | « Pour la suite de {Parcours} » | sous-titre « les parcours vont au bout » | OK |
| Quiz d'orientation, visiteur « Ouvrir les 5 parcours · 2,99 €/mois » | « Pour ton parcours : {Parcours} » | reprend « Ton parcours : {Parcours} » du résultat | OK |
| Recherche « passe en Premium pour tout voir » | « Pour tout voir » | titre « ouvre tout » | OK |
| /parcours liste, carte « Abonnement 2,99 €/mois, Premium : tous les parcours, vannes, conseils et vidéos. » | aucune | titre « Premium ouvre tout » | OK : « Premium », « tout » |
| Fin d'étape 1 « Passer à l'étape 2 · 2,99 €/mois » | (va à /register, pas à /abonnement) | voir §4 | Écho porté par /register |
| Fenêtre Premium « Je m'abonne et… » | (va à /register) | voir §4 | idem |

**Réserve à trancher** (§6, point A) : « Ouvrir les 5 parcours » est le seul libellé de porte qui réduit encore Premium aux parcours, ce que Thomas a corrigé le 19/10. Variante proposée, non appliquée : **« Tout ouvrir · 2,99 €/mois »**, qui reprend « ouvre tout » du titre et garde le verbe de porte. Accroche correspondante : « Pour tout ouvrir ».

## 4. Inscription et retour de paiement

Règle : un texte déjà validé ne change que s'il y a une rupture de logique, expliquée dans la colonne « Raison ».

| Surface | Élément | Texte actuel | Nouveau texte | Raison |
|---|---|---|---|---|
| /register (depuis /abonnement, mur, fiche, carnet, fenêtre) | Titre | « Ton compte » | inchangé | Écho de la ligne de suite « Tu crées ton compte… ». Pas de rupture |
| /register | Rappel de l'offre | « Premium, 2,99 € TTC par mois. » (annuel : « … 24,99 € TTC par an. ») | inchangé | Écho du prix et du nom du bouton « S’abonner · 2,99 €/mois » |
| /register | Google, CGU, champs, bouton, réassurance, « Déjà un compte ? » | « Continuer avec Google », « Créer mon compte et passer au paiement », réassurance unique… | inchangés | Le bouton dit déjà les deux gestes dans l'ordre, comme la ligne de suite. Aucune rupture |
| /register **seulement si `src=parcours-etape`** (fin d'étape 1) | Rappel de l'offre | « Premium, 2,99 € TTC par mois. » | **Premium, 2,99 € TTC par mois. Après le paiement, l’étape 2 de {Parcours} s’ouvre.** (+9 mots, parcours lu dans le callback comme pour le lien gratuit) | **Rupture réelle** : le bouton cliqué dit « Passer à l'étape 2 · 2,99 €/mois », l'écran suivant dit « Ton compte » sans plus parler de l'étape 2. La phrase rend la promesse. Vrai : le paiement ouvre toutes les étapes (`canAccessParcoursStep`) et le retour va au parcours |
| Page d'attente après inscription (`auto=1`, remplace le flash de la page de vente) | Titre + ligne | page de vente complète rendue 1 à 2 s | **Te voilà connecté.** puis **On t’emmène au paiement…** (3 + 4 mots) | Annonce la fin de l'étape 1 et la suite. « Connecté » et non « compte créé » : la même page sert après une simple connexion (« Déjà un compte ? »). Second texte déjà validé |
| Stripe Checkout | Bouton, texte de commande | « S’abonner », « En cliquant sur « S’abonner », tu passes une commande avec obligation de paiement… » | inchangés | Figé (L.221-14). C'est la référence du verbe. Page non capturée `[À VÉRIFIER : nom du produit affiché, doit être « Premium »]` |
| /abonnement/success | Titre, texte | « Paiement reçu ! » / « Merci. Ton accès s’active… » | inchangés | Tiennent la promesse, courts |
| /abonnement/success | Bouton | « Choisir mon parcours » (lien vers /parcours) | **Continuer** (lien vers la destination d'origine, `returnTo`, sinon /parcours) | **Rupture** : la redirection ramène au mur ou à la fiche d'origine, le bouton promet un choix de parcours. Premium n'est plus seulement les parcours (19/10). Un seul mot, un seul verbe |
| Retour après paiement (`PremiumWelcome`) | Titre | « Bienvenue dans Premium » | inchangé | Validé |
| `PremiumWelcome` | Texte | « Toutes les étapes des parcours sont débloquées, et tes favoris t’attendent. Reprends là où tu t’étais arrêté. » | **Tout est ouvert : les listes, les parcours, le carnet du mois. Reprends là où tu t’étais arrêté.** (16 mots) | **Rupture** : réduit Premium aux parcours, et « tes favoris t'attendent » est faux pour qui vient de payer (les favoris étaient fermés, il n'en a aucun). Le catalogue ouvert est ce qui se voit en premier au retour d'un mur |
| `PremiumWelcome` `[LETTRE]` | Ligne ajoutée | absente | **Ta lettre de chaque semaine s’active depuis ton profil.** (10 mots) | Seulement en V1 et seulement si l'opt-in est bien dans le profil `[À CALER avec la spec lettre : emplacement et libellé réels de la case, jamais cochée par défaut]`. Si la case est ailleurs, la phrase suit |
| Paiement annulé (retour sur /abonnement) | Bandeau | voir §1.2 | texte inchangé, une ligne, fermable | Le bouton reste dans le premier écran |
| Session expirée à l'ouverture du paiement (toast 401) | Texte + lien | « Ta session a expiré. Reconnecte-toi puis réessaie. » (sans lien) | texte inchangé + lien **Se reconnecter** | Le toast décrit l'action sans la proposer (H9 du plan @ux). Lien vers /login avec retour sur /abonnement |
| Paiement non vérifié, connexion perdue | Textes | `TEXTES_SUCCESS` | inchangés | Honnêtes et complets |
| E-mail de confirmation, de paiement refusé, de résiliation | Corps | validés s16 avec retouches @legal | **non touchés** | Partie légale incompressible. « Tout est ouvert. Pour démarrer, choisis un parcours » reste cohérent avec « Tout est ouvert » |

## 5. Auto-contrôle : chaque trajet joué comme un visiteur pressé sur téléphone

Lecture à 375 px, du clic d'entrée à l'arrivée sur Stripe. Les accroches sont comptées dans la première ligne vue.

| Trajet | Ce que le visiteur lit, dans l'ordre | Promesse tenue ? |
|---|---|---|
| **T1 En-tête** | « Premium · 2,99 € » (en-tête) puis **Premium ouvre tout Deviens Marrant** / 3 avantages / Mensuel 2,99 € TTC / S'abonner · 2,99 €/mois / « Tu crées ton compte, puis tu paies par carte. » / réassurance. Tape : **Ton compte** / « Premium, 2,99 € TTC par mois. » / « Créer mon compte et passer au paiement » puis « Te voilà connecté. On t'emmène au paiement… » puis **S'abonner** chez Stripe | Oui : « Premium » dit à chaque écran, prix 2,99 € identique partout, deux étapes annoncées avant d'être vécues |
| **T2 Mur de vannes** | « Voir la suite des vannes · 2,99 €/mois » puis **Pour la suite des vannes** / Premium ouvre tout / « les listes ne s'arrêtent plus à la dixième vanne » (il vient de buter dessus) / avantage 1 / tableau ligne 1 « 10, 3 et 3 » contre « Sans limite » / suite identique à T1 | Oui : trois échos avant le prix. Le tableau confirme ce qu'il a vécu |
| **T3 Fin d'étape 1** | « Étape 2 sur N » / « Passer à l'étape 2 · 2,99 €/mois » puis **Ton compte** / « Premium, 2,99 € TTC par mois. Après le paiement, l'étape 2 de Répartie s'ouvre. » / bouton à deux gestes / attente / Stripe | Oui, grâce à la phrase ajoutée (sans elle, l'étape 2 disparaissait de l'écran) |
| **T4 Fenêtre Premium** | « Je m'abonne et je la garde » + 2,99 € en gros + réassurance, puis **Ton compte** / « Premium, 2,99 € TTC par mois. » / Stripe « S'abonner » | Oui : même verbe sur trois écrans. Aucune modification |
| **T5 Fin d'article** | « Ouvrir les 5 parcours · 2,99 €/mois » puis **Pour ouvrir les 5 parcours** / Premium ouvre tout… puis suite comme T1 | Oui : verbe et objet repris, puis élargis par le titre |
| **T6 Compte connecté sans abonnement** (accueil, quiz, profil) | « S'abonner · 2,99 €/mois » + « Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois. » puis Stripe « S'abonner » | Oui : l'objet est dit avant le paiement ; mêmes mots que le titre de /abonnement |

**Un seul verbe par geste** (relevé sur tout le trajet) :

| Geste | Verbe | Où |
|---|---|---|
| Acheter | « S'abonner » / « Je m'abonne » | /abonnement (3 boutons), accueil et profil connectés, quiz connecté, fenêtre Premium, Stripe |
| Aller voir l'offre (porte) | « Ouvrir », « Voir », « Écrire », « Essayer », « Décrypter » + prix | murs, fiches, carnet, articles, accueil visiteur : le titre de /abonnement et l'accroche reprennent le mot |
| Créer le compte | « Créer mon compte » / « Tu crées ton compte » | ligne de suite, /register |
| Payer | « Tu paies » / « le paiement » | ligne de suite, bouton /register, attente |
| Reprendre | « Continuer » | retour de paiement |

**Rien de faux** (source de chaque phrase) : « Sans limite » (API tips, videos, jokes), « Étape 1 de chacun » (`LAST_FREE_PARCOURS_STEP`), « 1 situation » (`CARNET_FREE_FICHES`), « Progression et série : Non » (`canValidateParcoursStep`), « par carte » (`payment_method_types`), « Il en reste 14 » (carnet du mois, calculé), « Tout est ouvert » (favoris, exercices, listes, carnet, parcours : tout est Premium dans le code). Rien sur « Ta question à l'équipe » (fermée). La lettre hebdomadaire n'est écrite qu'en V1, avec « par e-mail » et « si tu la veux ». Zéro témoignage, zéro promesse de résultat, zéro mention légale dans un bouton, zéro concurrent.
**Anti-signature IA** : zéro tiret cadratin dans les textes proposés (relu), pas de formule en « ce n'est pas X, c'est Y », pas de liste de trois adjectifs, lecture à voix haute faite.

## 6. Points tranchés et points ouverts

**Tranchés par moi** (modifiables sans refaire le reste) :
1. **Accroche en « Pour… »** plutôt que « Tu voulais… » : elle complète le titre en une phrase, sans temps ni reproche.
2. **Sous-titre unique** : le sous-titre de Thomas (« dixième vanne ») ne varie pas selon l'origine. Pour un mur de conseils ou de vidéos, l'accroche porte l'écho. Option non appliquée : « … ne s'arrêtent plus au troisième conseil / à la troisième vidéo, les parcours vont au bout » (`FREE_TIP_LIMIT`, `FREE_VIDEO_LIMIT`).
3. **Ligne de suite** « Tu crées ton compte, puis tu paies par carte. » parmi les trois candidates du plan : deux verbes, deux gestes, 9 mots. Écartées : « D'abord ton compte, puis le paiement » (noms, pas de verbe), « Compte avec Google ou e-mail… » (Google est annoncé sur l'écran suivant).
4. **Pas de réassurance sous la barre collante** : le libellé de la réassurance est intouchable et deux lignes de plus font 80 px. La barre disparaît devant le bouton final, qui porte la réassurance.
5. **En-tête court** : « Premium · 2,99 € » avec repli « Premium ». À mesurer à 320 px avant de choisir.
6. **FAQ prix** : réassurance unique collée mot pour mot, aucune autre formulation de la résiliation.
7. **Lettre** : formulation @legal (opt-in, « par e-mail »), version courte dans la liste, comparaison 4 contre 1 dans le tableau. Le document `docs/legal/lettre-hebdo-premium-s21.md` n'est pas dans le dépôt : les formulations viennent du message du coordinateur du 19/10.
8. **« Tu es déjà Premium » non écrit** : le middleware redirige un abonné qui visite /abonnement vers /vannes ; la résiliation programmée et les conflits 409 ont déjà leurs textes. Vide assumé plutôt qu'un placeholder.

**À décider par Thomas** :
- **A.** « Ouvrir les 5 parcours » reste-t-il le libellé de porte, ou « Tout ouvrir · 2,99 €/mois » ? Il touche 7 surfaces (accueil visiteur, article, glossaire, a-propos, aperçu d'étape, quiz, favoris). À jouer en duel sur le trajet T5.
- **B.** Budget : V1 à 229 mots hors accroche. Retirer la suite sous le bouton final ramène à 220.
- **C.** Garder « soit 2,08 € par mois » sur la carte annuelle (+5 mots) ?

**À vérifier avant mise en ligne** : largeur de l'en-tête court à 320, 360, 375 px ; deux lignes de l'avantage lettre à 375 et 320 px ; l'étape N est-elle dans `returnTo` (accroche d'aperçu) ; nom du produit affiché chez Stripe ; emplacement de la case opt-in de la lettre ; destination de « Connecte-toi » après le lien de /abonnement.

**Correspondance fichier → texte pour @fullstack**

| Fichier | Texte à remplacer |
|---|---|
| `apps/web/src/config/textes/cta-pages.ts` | `ABONNEMENT_HAUT_PAR_PARCOURS` (un seul titre), `ABONNEMENT_CTA.bouton/suite`, accroches par `src` (nouveau), `QUIZ_ORIENTATION_CTA.bouton` (deux constantes), `PROFIL_ABONNEMENT_OFFRE`, `REGISTER_CTA.planReminder` (variante `parcours-etape`), tableau (nouveau) |
| `apps/web/src/config/textes/offre.ts` | `ABONNEMENT_HAUT_VISITEUR.sousTitre`, `PAIEMENT_ANNULE` (rendu en une ligne) |
| `apps/web/src/config/textes/avantages-premium.ts` | 3 avantages en V0, 4e derrière le drapeau lettre |
| `apps/web/src/config/textes/cta-articles-accueil.ts` | `EN_TETE.boutonCourt`, `EN_TETE.nomAccessible`, `CARTE_PREMIUM` (bouton et phrase du compte connecté) |
| `apps/web/src/config/textes/carnet-extrait.ts` | amorce et ligne « Il en reste N » (nouveau) |
| `apps/web/src/config/textes/paiement.ts` | `TEXTES_SUCCESS.pretBouton` |
| `apps/web/src/lib/faqs.ts` | réponses « prix » (mensuel et annuel) |
| `apps/web/src/components/premium/premium-welcome.tsx` | texte de bienvenue (+ ligne lettre en V1) |
| `apps/web/src/app/(dashboard)/a-propos/page.tsx` | `AuthCta` vers lien `/abonnement?src=a-propos` |

**Handoff → @orchestrator** (puis @ux pour la grille §11, @legal pour la lettre, @fullstack pour l'intégration)
- Fichier produit : `/home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774/docs/copy/conversion-s21/textes-trajet-v1.md`.
- Décisions : étalon A appliqué mot pour mot ; lettre en variante V1 selon @legal ; 5 libellés d'achat changés ; 3 ruptures corrigées dans l'inscription et le retour de paiement (étape 2, bouton de retour, bienvenue) ; frameworks : B1 PAS inversé `[Conscience : Problem-Aware]`, B3 contraste `[Solution-Aware]`.
- Points d'attention : objections traitées (« et si ça ne me plaît pas ? » : réassurance sous chaque bouton, « Pas encore sûr ? », FAQ ; « combien ? » : cartes ; « ce que je débloque » : tableau ; « je dois créer un compte ? » : ligne de suite) ; aucune référence marché consultée (cadrage déjà fait par @ux) ; mots-clés SEO : metas de /abonnement inchangées, à revoir par @seo car le H1 change ; aucun commit.

## Arbitrages de l'orchestrateur (19/10, selon les décisions de Thomas du jour)

1. **Libellé de porte générique** : « Ouvrir les 5 parcours · 2,99 €/mois » devient **« Tout ouvrir · 2,99 €/mois »** sur toutes les surfaces où il était le libellé générique (Thomas, 19/10 : Premium n'est pas que les parcours). Les libellés de porte contextuels (« Voir la suite des conseils », « Voir les N autres répliques », « Passer à l'étape 2 », etc.) ne changent pas.
2. **Carte annuelle** : on garde « soit 2,08 € par mois » (ancrage de prix utile à la conversion).
3. **Budget** : 229 mots avec la lettre acceptés (plafond 230 validé par Thomas). La ligne de suite sous le bouton final reste.
4. **/a-propos visiteur** : passe par /abonnement comme le glossaire (écho du clic, une seule page d'offre).
