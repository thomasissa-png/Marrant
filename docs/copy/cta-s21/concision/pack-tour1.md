# Relecture à l'aveugle : les textes du parcours d'achat de deviens-marrant.fr

Site d'humour et de répartie, tutoiement, ton de pote drôle et bienveillant. Offre : Premium, 2,99 € par mois (ou 24,99 € par an), 5 parcours d'entraînement (Machine à Café, Répartie, Confiance, Storytelling, Boulot) dont l'étape 1 se lit sans compte ; avec Premium tout s'ouvre d'un coup (une étape par semaine est un rythme conseillé, pas une contrainte) ; un carnet de répartie chaque mois ; toutes les vannes, conseils et vidéos ; les favoris. Premier paiement remboursable sur demande sous 14 jours ; résiliation depuis le profil (jamais « en un clic »). Le site affiche « 1 500+ » : ne le commente pas.

## Le critère : donner envie et convertir, en 5 secondes sur un téléphone

Pour chaque surface (un tableau = un bloc ou une page) : mets-toi dans la peau du visiteur à cet endroit, sur téléphone, qui lit en diagonale.
- **Envie /10** : en 5 secondes, as-tu envie de cliquer sur le bouton (puis de payer) ?
- **Lisibilité /10** : se lit-il d'un coup d'œil ? Une idée par bloc, un seul bouton plein, rien de répété sur la même page.
- **Budget de mots** : chaque tableau donne le nombre de mots hors bouton et son budget. **Un texte qui dépasse son budget plafonne à 7/10.**
- Tu peux proposer une retouche, **mais un ajout doit être compensé par au moins autant de mots retirés** dans le même bloc. Propose ta version exacte (mot pour mot).
- Signale tout ce qui est faux par rapport aux faits ci-dessus, toute promesse de résultat, tout ton de pub ou de coach, toute tournure qui sonne IA. Zéro tiret cadratin dans tes propositions.
- 10 = publiable tel quel. Ne retire un point que pour un défaut que tu peux nommer.

Format de réponse, par surface : `§n · Envie /10 · Lisibilité /10 · Défaut · Version proposée`. Puis à la fin : les 5 surfaces les plus faibles, et les répétitions d'une surface à l'autre qui te sautent aux yeux.

Les noms entre accents graves (`...`) sont des repères techniques : ignore-les. « REASS » désigne la phrase « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. », affichée sous les boutons qui mènent au paiement.

---


## 0. Conventions communes (à lire une fois)

- **Comptage** : mots séparés par un espace ; les signes seuls (« » : ? · !) ne comptent pas ; un montant (« 2,99 € », « 2,99 €/mois », « 24,99 €/an ») et « 1 500+ » = 1 mot ; « 14 jours » = 2 mots.
- **Plein / lien** : sur les surfaces « froides » (haut d'accueil, fin d'article) le plein est le gratuit et le payant est un lien  ; sur les surfaces « chaudes » (carte d'accueil, fiches, murs, carnet, profil, fenêtre) le plein est le payant et le gratuit est un lien.
- **REASS** (réassurance unique, 11 mots, partout identique) : « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » Placée sous tout bouton plein qui porte un prix, jamais sous un lien ni sous un bouton gratuit. Constante unique à créer : `offre.ts` → `REASSURANCE_UNIQUE`.
- **OUVRIR** = « Ouvrir les 5 parcours · 2,99 €/mois » (inchangé, 5 mots, `libelleOuvrirParcours()`).
- **LIEN_ETAPE1** = « Lire l'étape 1 de {P}, gratuite » (6 mots avec Répartie, Confiance, Storytelling, Boulot ; 9 mots avec Machine à Café, seule exception assumée). Remplace tous les contours « Gratuit : 5 vannes et un défi, étape 1 de {P} », « Étape 1 de {P}, gratuite : … » et « Lire la première étape gratuite de {P} ».
- Le « 5 » des parcours reste `PARCOURS_COUNT`, les prix restent lus dans `config/premium.ts`.

## 1. B3 : haut de l'accueil (visiteur), titre gardé, intro à 1 phrase, 1 plein, plus de lien payant

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `hero-section.tsx` H1 (en dur) | Tu parles et personne rit. / On va arranger ça. | hors relecture (titre du site) | n/a |
| `hero-section.tsx` paragraphe (en dur, à passer dans la config : `ACCUEIL_HAUT.intro`) | Des vannes, des techniques et des exercices pour répondre quand on te chambre. | 13 | |
| `hero-section.tsx` preuve sociale (en dur) | 1 500+ membres bossent leur humour. Rejoins-les. | 6 | |
| `ACCUEIL_HAUT.bouton` (plein, gratuit) | Tester mes premières répliques, gratuit | bouton | |
| `ACCUEIL_HAUT.note` / `noteAccueilHaut()` | Sans compte. | 2 | |
| **Total** | | **21** | **40 OK** |

## 2. B6 : bouton Premium de l'en-tête (inchangé)

| Emplacement | Texte exact | Mots | Budget |
|---|---|---|---|
| `EN_TETE.bouton` | 2,99 €/mois | 1 | 0 |
| `EN_TETE.nomAccessible` | 2,99 € par mois : voir l'offre Premium | (a11y) | |

Aucun changement (B6 de l'inventaire, déjà 1 mot).

## 3. B2 : fin d'article 

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `BLOC_FIN.parArticle["meilleures-blagues-droles-2026"].titre` | La vanne dans ta bouche, pas dans ton téléphone | 9 | |
| `.texte` | Quand on te chambre, tu as une seconde, et ça s'entraîne. | 11 | |
| `BLOC_FIN.boutonEtape1.repartie` (plein, gratuit) | Tester mes premières répliques, gratuit | bouton | |
| note (à créer : `BLOC_FIN.noteSansCompte`) | Sans compte. | 2 | |
| `BLOC_FIN.lienAbonnement` (lien payant) | Ouvrir les 5 parcours · 2,99 €/mois | lien | |
| **Total** | | **22** | **25 OK** |

**Déclinaisons par parcours** (articles qui n'ont pas de surcharge ; `encarts-blog-s20.ts` → `TEXTES_PARCOURS_BLOG[slug]`) : même gabarit (titre, 1 phrase, plein gratuit, « Sans compte. », lien `OUVRIR`).

| Parcours | `finTitre` | `finTexte` | `finBoutonEtape1` (plein) | Hors bouton |
|---|---|---|---|---|
| Répartie | Ces techniques, travaille-les dans un parcours guidé | Quand on te chambre, tu as une seconde, et ça s'entraîne. | Tester mes premières répliques, gratuit | 7+11+2 = 20 |
| Machine à Café | Sois drôle au bureau sans avoir l'air d'essayer | Des vannes courtes et le bon moment pour les placer, sans forcer. | Tester mes premières vannes, gratuit | 8+12+2 = 22 |
| Confiance | Reprends confiance, une conversation à la fois | Trouver ta place dans un groupe qui rit, sans personne pour te pousser sur scène. | Tester l'étape 1 de Confiance, gratuite | 7+15+2 = 24 |
| Storytelling | Une anecdote, travaillée jusqu'à ce qu'on te la redemande | Une seule anecdote vraie, retravaillée d'étape en étape. | Tester l'étape 1 de Storytelling, gratuite | 9+8+2 = 19 |
| Boulot | Ta vanne du lundi, sans te griller | De la salle de réunion au toast, un cran à la fois. | Tester l'étape 1 de Boulot, gratuite | 7+12+2 = 21 |

Abonné Premium : `TEXTES_BLOC_FIN.boutonAbonne` « Continuer mon parcours » inchangé (3 mots).

## 4. Carte Premium de l'accueil B4+B5 

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `CARTE_PREMIUM.titre` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? | 10 | |
| `CARTE_PREMIUM.intro.scene` (devient la phrase unique) | Premium : 5 parcours, de la coloc à l'afterwork, et l'étape 1 de chacun est gratuite. | 15 | |
| `CARTE_PREMIUM.bouton` (plein payant) | Ouvrir les 5 parcours · 2,99 €/mois | bouton | |
| `CARTE_PREMIUM.contour` (devient LIEN, plus un bouton) | Tester mes premières répliques, gratuit | lien | |
| `CARTE_PREMIUM.reassurance` | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) | |
| `CARTE_PREMIUM.inscrits` | Déjà 1 500+ inscrits, et toi ? | 5 | |
| **Total** | | **30 + REASS 11 = 41** | **40 OK hors REASS** |

## 5. E2 : carte d'accueil, compte connecté sans abonnement

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| titre + bouton + REASS | comme §4 (le bouton ouvre directement le paiement) | | |
| `CARTE_PREMIUM.connecte.ligne` (remplace la phrase de §4 ou s'y ajoute avant le bouton) | Tu as déjà ton compte : le bouton t'emmène au paiement. | 10 | |
| Preuve sociale | retirée pour un compte connecté (comme aujourd'hui) | 0 | |
| **Total** | titre 10 + phrase 15 + ligne 10 = **35 + REASS 11** | | **40 OK hors REASS** |

## 6. B1 : encart de démonstration au milieu de l'article (la scène est le produit)

| Emplacement | Texte exact | Mots | Budget |
|---|---|---|---|
| `DEMO_VANNE.surtitre` | Situation offerte ce mois-ci | 4 | |
| `DEMO_VANNE.situation()` (donnée du carnet) | {accroche}, et on te lance : « {onTeDit} » | 26 (scène, exemptée) | |
| `DEMO_VANNE.question` | Tu réponds quoi ? | 3 | |
| `DEMO_VANNE.bouton` (plein, gratuit) | Voir la réplique | bouton | |
| `DEMO_VANNE.note()` (sans paramètre, une seule phrase) | Gratuit, sans compte. | 3 | |
| **Total hors scène et bouton** | | **10** | **25 OK** |

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `LETTRE_ARTICLE.titre` | Une vanne décryptée, chaque mois | 5 | |
| `LETTRE_ARTICLE.phrase` (une seule phrase) | Par e-mail, avec un exercice pour t'entraîner : gratuit, sans compte. | 11 | |
| Bouton du formulaire (, `lettre-s21.ts` `formulaire.bouton`) | Envoie-moi la lettre | bouton | |
| Case de consentement et mention sous le bouton |  (texte légal exact, `formulaire.case` et `formulaire.mention`) | hors budget | |
| **Total** | | **16** | **25 OK** |

> Conventions (comptage, hors bouton, REASS, OUVRIR, LIEN_ETAPE1) : voir `textes-v1-a.md` §0. Chemins : `apps/web/src/config/textes/`. REASS = « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » (11 mots, sous tout bouton plein qui porte un prix).

## 1. B7 : murs de liste (/vannes, /conseils, /videos) : titre + 1 ligne + 1 plein + REASS + 1 lien

Fichier : `cta-pages.ts` → `MUR_LISTE[liste]`.

| Clé | /vannes | /conseils | /videos |
|---|---|---|---|
| `titre` | Et si la prochaine bonne vanne était la tienne ? (9) | La bonne réplique, pas trois heures après (7) | Tu regardes pour rire. Et pour faire rire ? (8) |
| `limite` (la ligne unique, 10 mots ; nombres = `FREE_*_LIMIT`) | Voilà les 10 premières vannes, la suite est dans Premium. | Voilà les 3 premiers conseils, la suite est dans Premium. | Voilà les 3 premières vidéos, la suite est dans Premium. |
| `bouton` (plein) | Voir la suite des vannes · 2,99 €/mois | Voir la suite des conseils · 2,99 €/mois | Voir la suite des vidéos · 2,99 €/mois |
| REASS | sous le plein | idem | idem |
| `contour` (devient lien) | LIEN_ETAPE1 | LIEN_ETAPE1 | LIEN_ETAPE1 |
| **Hors bouton** | **19** | **17** | **18** |

Carte floutée : **une seule** (au lieu de 3), lien `MUR_CARTE_LIEN` « Voir Premium » (2 mots), `CARTE_VERROUILLEE_LABEL` (aria) inchangé.

## 2. B8, B9, B10 : fiches vanne, conseil, vidéo : titre + 1 phrase + 1 plein + REASS + 1 lien

Fichier : `cta-pages.ts` → `BLOC_EXERCICE[type]`.

| Clé | Vanne (B8) | Conseil (B9) | Vidéo (B10) |
|---|---|---|---|
| `titre` | Et si demain, c'était la tienne qu'on se répétait ? (9) | Essaie-le avant le soir où il te servira (8) | Une salle, c'est son métier. Toi, une table te suffit (10) |
| `texte` (1 phrase) | À toi de jouer : une consigne et un exemple pour écrire ta version. (13) | À froid, rater ne coûte rien : l'exercice « À toi de jouer » est fait pour ça. (15) | Revois-la pour faire rire, plus seulement pour rire : points clés et exercice. (12) |
| `bouton` (plein) | Écrire la mienne · 2,99 €/mois | Essayer ce conseil · 2,99 €/mois | Décrypter cette vidéo · 2,99 €/mois |
| REASS | sous le plein | idem | idem |
| `contour` (devient lien) | LIEN_ETAPE1 (parcours lié à la catégorie, Répartie par défaut) | idem | idem |
| **Hors bouton** | **22** | **23** | **22** |

## 3. B11 : fenêtre Premium, chaque geste

Fichiers : `cta-pages.ts` → `FENETRE_PREMIUM[geste][type]`, `FENETRE_GARANTIE`, `fenetreLienEtape1`. Ordre : titre, intro, prix en gros (« 2,99 € TTC / mois », 3 mots, `FENETRE_PRIX`, gardé tel quel : le prix n'est pas dans le bouton ici), plein, REASS, lien.

| Geste | `titre` | `bouton` (plein) | `intro` visiteur (12 mots) | `introCompte` (7 mots) | Hors bouton visiteur / compte |
|---|---|---|---|---|---|
| Favori, vanne | Garde-la pour le soir où tu en auras besoin | Je m'abonne et je la garde | Ton compte, puis le paiement : si tu fermes, la vanne reste là. | Si tu fermes, la vanne reste là. | 24 / 19 |
| Favori, conseil | Garde-le pour le soir où tu en auras besoin | Je m'abonne et je le garde | idem avec « le conseil reste là » | Si tu fermes, le conseil reste là. | 24 / 19 |
| Favori, vidéo | Garde-la sous le coude | Je m'abonne et je la garde | idem avec « la vidéo reste là » | Si tu fermes, la vidéo reste là. | 19 / 14 |
| Vote (3 types) | Pour voter, il ne te manque que Premium | Je m'abonne et je vote | idem avec « la page reste là » | Si tu fermes, la page reste là. | 23 / 18 |
| Carte floutée /vannes, /conseils, /videos | Le reste de la liste est juste derrière | Je m'abonne et j'ouvre toute la liste | idem avec « la liste reste là » | Si tu fermes, la liste reste là. | 23 / 18 |

Lien sous la REASS (`fenetreLienEtape1`) : LIEN_ETAPE1. Chargement du bouton (compte connecté) : « On t'emmène au paiement… » inchangé.

## 4. B12 : résultat du quiz d'humour : le résultat + 1 plein gratuit + 1 lien payant

Fichiers : `entrees-parcours.ts` → `QUIZ_HUMOUR_PARCOURS` ; `cta-pages.ts` → `QUIZ_HUMOUR_CTA` ; `lib/quiz-resultat-textes.ts`.

| Clé | Texte exact | Mots |
|---|---|---|
| `intro` | Ton point de départ : | 4 |
| `titre(slug)` | Parcours {P} | 2 (4 pour Machine à Café) |
| `raison.OBSERVATEUR` | Tu vois ce que les autres ne remarquent pas : ce parcours part de là. | 14 |
| `raison.STORYTELLER` (publié) | Tu tiens une table avec tes histoires : ce parcours t'apprend à couper ce qui traîne. | 15 |
| `raison.STORYTELLER` (non publié) | Tu tiens une table avec une histoire : ce parcours t'apprend à la raconter jusqu'au bout. | 15 |
| `raison.ABSURDE` () | Tes idées surprennent : ce parcours t'aide à les placer au bon moment, en quelques mots. | 15 |
| `raison.PUNCHLINEUR` | Tu vises le mot juste : ce parcours travaille le rythme et les silences. | 13 |
| `raison.TAQUIN` () | Tu renvoies chaque balle : ce parcours t'apprend à retourner une pique avec le sourire. | 14 |
| nouvelle clé `sansCompte` (note sous le plein) | Sans compte. | 2 |
| `bouton(slug)` (plein, gratuit) | Commencer {P}, étape 1 gratuite | bouton (5 à 7 mots) |
| `lien(slug)` = `OUVRIR_P` (lien payant) | Ouvrir {P} en entier · 2,99 €/mois | lien |
| **Hors bouton** | | **25 au plus** (Machine à Café : 4+4+15+2) ; 23 pour Storytelling, 22 à 23 pour les autres (budget 25 OK) |

## 5. B13 : résultat du quiz d'orientation (compte sans abonnement) : titre + 1 phrase + 1 plein + REASS

Fichier : `cta-pages.ts` → `QUIZ_ORIENTATION_CTA` (le gabarit `paragraphes()` devient `titre()` + `phrase()`), `humor-quiz.tsx`.

| Parcours | `titre` | `phrase` (nouvelle table `LIGNE_QUIZ`, 1 phrase) | Hors bouton |
|---|---|---|---|
| Répartie | Ton quiz te conseille Répartie | Pour toi si on te chambre et que tu cherches encore quoi répondre. | 5+13 = 18 |
| Machine à Café | Ton quiz te conseille Machine à Café | Pour toi si tu veux faire rire à la pause sans forcer. | 7+12 = 19 |
| Confiance | Ton quiz te conseille Confiance | Pour toi si tu veux retrouver ta légèreté, sans te forcer. | 5+11 = 16 |
| Storytelling | Ton quiz te conseille Storytelling | Pour toi si ta chute arrive quand tout le monde est passé au dessert. | 5+14 = 19 |
| Boulot | Ton quiz te conseille Boulot | Pour toi si, le lundi à 9 h, tu prends un ton de compte rendu. | 5+15 = 20 |

Plein : `bouton(slug)` = `OUVRIR_P` « Ouvrir {P} en entier · 2,99 €/mois ». Sous le plein : REASS (remplace `garantie`). Lien : `refaire` « Refaire le quiz » (inchangé, 3 mots). `commencer` « Voir par où commencer » inchangé.

## 6. B14 : fin de l'étape 1 (visiteur) : bouton direct vers l'inscription, la lettre en dessous

Fichiers : `cta-pages.ts` → `FIN_ETAPE_1` ; `offre.ts` → `VALIDATION_ETAPE` ; `step-blocks.tsx` (`ValidationWall`). Le plein mène à `/register` (puis paiement), plus à `/abonnement` : décision du 18/10.

| Clé | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `titre` (nouvelle clé) | Bien joué pour l'étape 1 | 5 | |
| `phrase` | Avec Premium, tu la valides et les suivantes s'ouvrent d'un coup. | 11 | |
| `bouton` (plein) | Passer à l'étape 2 · 2,99 €/mois | bouton | |
| REASS | sous le plein | 11 (REASS) | |
| `lettre.ligne` (nouvelle clé, sous la REASS, petit texte discret) | Ou la lettre gratuite : une vanne décryptée par mois. | 9 | |
| `lettre.champ` (placeholder) | toi@exemple.fr | champ | |
| `lettre.bouton` (texte discret, pas un plein ; `lettre-s21.ts` `formulaire.bouton`) | Envoie-moi la lettre | bouton | |
| Case de consentement et mention |  (`formulaire.case`, `formulaire.mention`), affichées au focus du champ (à valider @design et @legal) | hors budget | |
| **Total** | | **25** | **25 OK** |

Carte « Étape 2 » (donnée du parcours, hors budget comme la scène de B1) : surtitre `carteSurtitre()` devient « Étape 2 sur 4 » (sans la durée), titre et aperçu inchangés (données publiques).
Variante quiz en cours (`ValidationWall`, `quizPending`) : `VALIDATION_ETAPE.texte` « Valider l'étape fait partie de Premium. » (6) ; `VALIDATION_ETAPE.bouton` (contour d'attente) « Valider l'étape · 2,99 €/mois » ; REASS dessous.

## 7. B15 : cartes de /parcours (visiteur)

Fichier : `cta-pages.ts` → `LISTE_PARCOURS_CTA`.

| Clé | Texte exact | Mots hors bouton |
|---|---|---|
| `bouton(slug)` (, plein) | Commencer {P}, étape 1 gratuite | bouton (5 à 7) |
| `frontiere(slug)` | Sans compte. Étapes 2 à 4 : Premium. (« Étapes 2 et 3 » pour Machine à Café) | 6 |

## 8. Page d'un parcours, visiteur (aperçus des étapes 2 et suivantes)

Fichiers : `parcours.ts`, `offre.ts`, `entrees-parcours.ts`, `step-blocks.tsx`.

| Clé | Texte exact | Mots |
|---|---|---|
| `progressionVisiteurTexte()` () | Étape 1 offerte, étapes 2 à 4 avec Premium | 8 (le fait « étape 1 offerte / reste Premium » est dit ici, une fois) |
| `APERCU_INTRO` | Pour les suivantes, tu vois ici ce qu'elles contiennent. | 9 |
| `VANNES_ETAPE.apercuVisiteur(n)` | {n} vannes t'attendent dans cette étape. | 6 |
| nouvelle clé `APERCU_LIEN` (lien sous l'aperçu ouvert) | Ouvrir toutes les étapes · 2,99 €/mois | lien |
| `QUIZ_FIN_BOUTON.visiteur` (rendu en lien, plus en bouton) | Refaire le quiz | 3 |
| **Hors bouton (aperçu)** | | **15** (budget 25 OK) |

> Conventions : `textes-v1-a.md` §0. Chemins : `apps/web/src/config/textes/`. REASS = « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. »

## 1. /abonnement, visiteur : budget 120 mots hors FAQ et hors fiche du carnet (donnée)

Fichiers : `cta-pages.ts` (`ABONNEMENT_HAUT_PAR_PARCOURS`, `ABONNEMENT_CTA`), `offre.ts` (`ABONNEMENT_HAUT_VISITEUR`, `ANNUEL_*`, `REASSURANCE_PAIEMENT`), `entrees-parcours.ts` (`ABONNEMENT_ETAPE_1`), `carnet-extrait.ts`, `abonnement-view.tsx`, `plan-selector.tsx`. Ordre de la page : surtitre, titre, sous-titre, carte (prix, plein, étapes, REASS, avantages), extrait du carnet, « Pas encore sûr ? », FAQ.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Surtitre Répartie et adresse directe (`ABONNEMENT_HAUT_PAR_PARCOURS.defaut/repartie.surtitre`) | Pour toi si ta bonne réponse arrive avec un temps de retard | 12 |
| Surtitre Machine à Café et Boulot | Pour toi si tu veux faire rire au boulot sans forcer | 11 |
| Surtitre Confiance | Pour toi si le rire te manque après une période compliquée | 11 |
| Surtitre Storytelling | Pour toi si ta chute arrive quand le dessert est servi | 11 |
| Titre Répartie / défaut (`.titre`) | Ta réplique en soirée, pas dans le bus du retour | 10 |
| Titre Machine à Café et Boulot | Ta réplique pendant la réunion, pas dans l'ascenseur d'après | 9 |
| Titre Confiance | Retrouver le rire à table, sans te forcer | 8 |
| Titre Storytelling | Ton histoire jusqu'à la chute, avant le « et donc ? » | 9 |
| Sous-titre (`ABONNEMENT_HAUT_VISITEUR.sousTitre`, durée = `DUREE_ETAPES`) | Chaque étape tient en 15 à 20 minutes. | 8 |
| Carte : nom (`OFFRE_NOM`) + puces Mensuel, Annuel | Premium · Mensuel · Annuel | 3 |
| Pastille (`ANNUEL_MOIS_OFFERTS_LABEL`, état mensuel) | plus de 3 mois offerts | 5 |
| Prix (état mensuel) | 2,99 € TTC / mois | 3 |
| Ligne annuelle (`ANNUEL_LIGNE_MENSUEL`, état mensuel) | Ou 24,99 €/an, soit 2,08 € par mois. | 6 |
| Ligne annuelle, état annuel choisi (remplace la ligne ci-dessus ; la pastille s'efface) | Soit 2,08 € par mois, plus de 3 mois offerts, 10,89 € économisés par an. | 13 |
| Bouton plein (`ABONNEMENT_CTA.bouton`, un seul libellé pour tous les parcours d'origine) | Ouvrir les 5 parcours · 2,99 €/mois (annuel : · 24,99 €/an) | bouton |
| `ABONNEMENT_CTA.suite` | Deux étapes : ton compte, puis le paiement sécurisé. | 8 |
| `REASSURANCE_PAIEMENT` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 |
| Avantages (composant unique,  | 4 lignes | 30 |
| Extrait du carnet : surtitre (`carnetExtraitSurtitre`) + titre (`CARNET_EXTRAIT_TITRE`) | Carnet de novembre · Situation 15, offerte / Le carnet, en vrai | 6 + 4 |
| Extrait : lien (`CARNET_EXTRAIT_LIEN`) | Lire la fiche en entier | lien |
| « Pas encore sûr ? » (`ABONNEMENT_ETAPE_1.texte` + un seul lien, parcours d'origine sinon Répartie) | Pas encore sûr ? Lire l'étape 1 de Répartie, gratuite | 9 |
| **Total (état mensuel, parcours Répartie)** | | **115** (119 avec le lien de l'extrait) ; état annuel : 117 |

Compte connecté sans abonnement (E3,  :

| Emplacement | Texte exact | Mots |
|---|---|---|
| `ABONNEMENT_CONNECTE.titre` | Les 5 parcours, et un carnet de répartie chaque mois | 10 |
| `ABONNEMENT_CONNECTE.paragraphe` | Tout s'ouvre d'un coup, vannes, conseils et vidéos du site compris. | 11 |
| Carte, bouton, REASS, avantages, extrait | comme le visiteur (sans surtitre, sans `suite`, sans « Pas encore sûr ? ») ; ligne « Paiement sécurisé par Stripe » gardée (`abonnement-view.tsx`) | 3+5+3+6+11+4+30+10 |
| **Total** | | **93** (budget 120 OK) |

## 2. Composant « 4 avantages » (`PremiumBenefits`,  : /abonnement seulement

À déplacer en config (`PREMIUM_AVANTAGES`) ; `useContentStats` n'est plus appelé.

| # | Texte exact | Mots |
|---|---|---|
| 1 | Les 5 parcours en entier | 5 |
| 2 | Un nouveau carnet de répartie chaque mois | 7 |
| 3 | Tes favoris : vannes, conseils et vidéos sous la main | 9 |
| 4 | Toutes les vannes, tous les conseils, toutes les vidéos | 9 |
| **Total** | | **30** |

## 3. FAQ de vente : 4 questions (accueil et /abonnement, JSON-LD identique)

Fichier : `lib/faqs.ts`. Les 4 qui lèvent le plus de freins à l'achat : le prix et les frais cachés, « puis-je apprendre ? », « et si je suis timide ? » (le persona), « pourquoi payer alors que YouTube existe ? ». Textes **tels quels**, sauf la réponse prix.

| # | Question | Réponse |
|---|---|---|
| 1 | Est-ce que je peux vraiment apprendre à être drôle ? |  (« 8 semaines », « 50 XP par semaine » protégés par le choix du 29/09) |
| 2 | Comment devenir drôle quand on est timide ou introverti ? |  (« introvertis » protégé). |
| 3 | 2,99 €/mois, c'est vraiment tout ? Pas de frais cachés ? | **Mensuel (accueil)** : C'est le prix, point. Pas de frais cachés, pas de reconduction surprise. Paiement sécurisé par Stripe. **Annuel disponible (/abonnement)** : C'est le prix, point. Pas de frais cachés. L'abonnement se renouvelle à la fin de chaque période (mois ou année) tant que tu ne résilies pas. Paiement sécurisé par Stripe. |
| 4 | C'est quoi la différence avec juste regarder des vidéos YouTube ? |  |

**Ne pas supprimer** les 4 autres questions (répartie, sans être méchant, combien de temps, sens de l'humour) : elles restent dans `faqs` (page /parcours, SEO) ; seuls l'accueil et /abonnement affichent les 4 ci-dessus. L'accueil appelle la version mensuelle (le prix annuel n'y vit pas).

## 4. /register (sans champ prénom)

Fichier : `app/(auth)/register/page.tsx` (textes en dur à passer dans `REGISTER_CTA`), `offre.ts`. Ordre : étape, titre, prix, champs, plein, REASS, Google, CGU, liens. Budget 25 hors champs, hors REASS, hors mention CGU.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Étape () | Étape 1 sur 2 | 4 |
| H1 () | Ton compte | 2 |
| `planReminder(plan)` | Premium, 2,99 € TTC par mois. (annuel : Premium, 24,99 € TTC par an.) | 5 |
| Champs () | Email / Mot de passe / Au moins 8 caractères | hors budget |
| `REGISTER_CTA.bouton` (plein) | Créer mon compte et passer au paiement | bouton (7) |
| `REMBOURSEMENT_PREMIER_PAIEMENT` devient REASS, collée sous le plein | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| Google () | S'inscrire avec Google | bouton |
| CGU (, porte le contrat) | En créant ton compte, tu acceptes les CGU. | 8 (hors budget) |
| « Déjà un compte ? » () | Déjà un compte ? Connecte-toi | 4 |
| `REGISTER_CTA.lienEtape1` (fusionne « Tu préfères lire d'abord ? » et « Retour à l'accueil ») | Lire l'étape 1, sans compte | 5 |
| **Total** | | **20** (budget 25 OK) |

## 5. Page de retour après paiement

Fichier : `app/(dashboard)/abonnement/success/page.tsx`.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre () | Paiement reçu ! | 2 |
| Texte () | On déroule le tapis rouge, ton accès s'active… | 8 |

## 6. /carnet, visiteur : intro et paywall (E1, 

Fichiers : donnée `docs/copy/carnet/novembre/carnet-2026-11.json` (clé `intro`), `cta-pages.ts` (`CARNET_PAYWALL`), `carnet-page.tsx`.

| Emplacement | Texte exact | Mots |
|---|---|---|
| `view.intro` (carnet de novembre ; à refaire chaque mois sur ce moule) | Du premier froid aux préparatifs de Noël, des situations qui montent d'un cran. | 13 |
| Fiche offerte (donnée, « Le lundi de 9 h 40 », intacte) | | exemptée |
| `CARNET_PAYWALL.titre(n)`, placé juste après la fiche offerte | Ça, c'était la réplique offerte. Il en reste 14. | 9 |
| `CARNET_PAYWALL.paragraphe` | Du plus tranquille au plus tendu, et un nouveau carnet chaque mois. | 12 |
| `CARNET_PAYWALL.bouton(n)` (plein) | Voir les 14 autres répliques · 2,99 €/mois | bouton |
| `CARNET_PAYWALL.suite` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| Titre de la liste verrouillée (remplace « Les 14 autres situations du mois ») | Au programme | 2 |
| Liste verrouillée : 3 titres de fiches (données), puis `CARNET_LISTE_RESTE(n-3)` | Et 11 autres situations | 4 |
| **Bloc d'achat hors bouton** | | **21** (budget 25 OK) |

## 7. /profil, compte sans abonnement (E4) et abonné

Fichier : `cta-pages.ts` → `PROFIL_ABONNEMENT_OFFRE` ; `compte.ts` ; `abonnement-card.tsx`.

| Emplacement | Texte exact | Mots hors bouton |
|---|---|---|
| `ligneXp(xp)` (, si XP > 0 ; placée en premier) | Tu as déjà 120 XP. | 4 |
| `phrase` | Avec Premium, tout s'ouvre d'un coup. | 7 |
| `bouton` (plein) | Tout ouvrir · 2,99 €/mois | bouton |
| `ligneDiscrete` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| **Total** | | **11** (budget 25 OK) |

## 8. Fins de page : /glossaire (E5) et /a-propos (E6)

Fichier : `cta-pages.ts` → `GLOSSAIRE_FIN`, `A_PROPOS_FIN`, `FIN_DE_PAGE_COMMUN`.

| Emplacement | /glossaire (E5) | /a-propos (E6) |
|---|---|---|
| `titre` | Le vocabulaire, c'est fait. Reste à s'en servir. (9) | Tu parles et personne rit. / On va arranger ça. () |
| `paragraphe` (1 phrase) | Placer un callback au dîner de samedi, c'est autre chose : ça s'entraîne. (12) | Observer, s'entraîner, roder : c'est le programme des 5 parcours. (9) |
| Preuve | aucune | Déjà 1 500+ inscrits, et toi ? (5, retirée si connecté) |
| `bouton` (plein) | Ouvrir les 5 parcours · 2,99 €/mois | idem |
| `ligneDiscrete` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | idem |
| `lienEtape1` (lien, remplace « Lis d'abord une étape, elle est offerte ») | Lire l'étape 1 de Répartie, gratuite | idem |
| **Hors bouton** | **21** | **14** (budget 25 OK) |

## 9. Paywall `premium-paywall.tsx` (web ; mobile natif inchangé hors texte de valeur)

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre (en dur) | Passe Premium | 2 |
| `PREMIUM_VALUE_TEXT` | Les 5 parcours en entier, le carnet du mois, tes favoris et les listes complètes. | 15 |
| Bouton web (plein) | S'abonner · 2,99 €/mois | bouton |
| `FENETRE_GARANTIE` devient REASS (web seulement) | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |

## 10. E-mail de confirmation : signalement (non réécrit)
