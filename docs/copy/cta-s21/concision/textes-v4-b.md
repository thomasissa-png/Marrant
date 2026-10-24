# Textes v4 (concision), partie B : murs, fiches, fenêtre, quiz, parcours

> Conventions (comptage, hors bouton, REASS, libellés uniques GRATUIT_ACCUEIL / GRATUIT_P / OUVRIR) : voir `textes-v3-a.md` §0. Chemins : `apps/web/src/config/textes/`. REASS = « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » (11 mots, sous tout bouton plein qui porte un prix). GRATUIT_P = « Tester l'étape 1 de {P}, gratuite ».

## 1. Murs de liste (/vannes, /conseils, /videos) : titre + 1 ligne + 1 plein + REASS + 1 lien

Fichier : `cta-pages.ts` → `MUR_LISTE[liste]`.

| Clé | /vannes | /conseils | /videos |
|---|---|---|---|
| `titre` | Encore des vannes à ressortir (5) | Pour la prochaine fois qu'on te chambre (7) | Tu regardes pour rire. Et pour faire rire ? (8) |
| `limite` (nombres = `FREE_*_LIMIT`) | 10 vannes gratuites, c'est fait. (5) | 3 conseils gratuits, c'est fait. (5) | 3 vidéos gratuites, c'est fait. (5) |
| `bouton` (plein) | Voir la suite des vannes · 2,99 €/mois | Voir la suite des conseils · 2,99 €/mois | Voir la suite des vidéos · 2,99 €/mois |
| REASS | sous le plein | idem | idem |
| `contour` (lien) | GRATUIT_P | GRATUIT_P | GRATUIT_P |
| **Hors bouton** | **9** | **12** | **13** |

Carte floutée : une seule (au lieu de 3), cliquable en entier, elle ouvre la fenêtre Premium (geste « carte floutée ») ; aucun libellé visible ; `CARTE_VERROUILLEE_LABEL` (aria) conservé.
**Disparaît** : `filtres`, `texte` (30 mots), `AVEC_PREMIUM_FIN`, `lignePrixGarantie()` (31 mots), les contours « Étape 1 de Répartie, gratuite : 5 vannes et un défi », 2 des 3 cartes verrouillées, `MUR_CARTE_LIEN` « Voir Premium », « la suite » dit deux fois, l'étiquette « One-liner » et le lien « Page dédiée » des cartes de liste, « plus bas » (le titre de /vannes ne promet plus de vannes sous la ligne de fin). **Avant** : 121 à 123 / 104 à 106.

## 2. Fiches vanne, conseil, vidéo : titre + 1 phrase + 1 plein + REASS + 1 lien

Fichier : `cta-pages.ts` → `BLOC_EXERCICE[type]`.

| Clé | Vanne | Conseil | Vidéo |
|---|---|---|---|
| `titre` | Demain, c'est peut-être la tienne qu'on répète (7) | Essaie-le avant le soir où il te servira (8) | L'humoriste a sa salle. Toi, une table suffit (8) |
| `texte` (1 phrase) | Une consigne, un exemple, et c'est à toi. (8) | À froid, rater est sans risque : l'exercice sert à ça. (10) | Les points clés, et un exercice pour t'en servir. (9) |
| `bouton` (plein) | Écrire la mienne · 2,99 €/mois | Essayer ce conseil · 2,99 €/mois | Décrypter cette vidéo · 2,99 €/mois |
| REASS | sous le plein | idem | idem |
| `contour` (lien) | GRATUIT_P (parcours lié à la catégorie, Répartie par défaut) | idem | idem |
| **Hors bouton** | **15** | **18** | **17** |

**Disparaît** : les paragraphes de 45 à 60 mots ; `lignePrixGarantie(annuel, "profil")` (31 mots) ; les contours « Gratuit : … étape 1 de {P} » ; les liens `toutVoir` / `toutVoirHref` ; le lien « Lire la première étape gratuite du parcours {P} » de `FICHE_PARCOURS.lien` (la carte « Dans un parcours » garde sa phrase et son titre, sans lien) ; « Et si » du titre vanne ; « pour faire rire, plus seulement pour rire » (vidéo) ; « tu écris ta version » (vanne) et « de la vidéo » (vidéo), puisque le bouton le dit juste dessous. **Avant** : 121 / 106, 110 / 93, 117 / 102. Abonné : `BLOC_EXERCICE_ABONNE_TITRE` « À toi de jouer ».

## 3. Fenêtre Premium, chaque geste : 4 éléments visibles (titre, prix, plein, REASS)

Fichiers : `cta-pages.ts` → `FENETRE_PREMIUM[geste][type]`, `FENETRE_PRIX`. Ordre : titre, prix en gros (« 2,99 € TTC / mois », 3 mots), plein, REASS. Visiteur et compte connecté voient la même fenêtre.

| Geste | `titre` | `bouton` (plein) | Hors bouton |
|---|---|---|---|
| Favori, vanne | Mets-la de côté | Je m'abonne et je la garde | 3+3 = 6 |
| Favori, conseil | Garde-le sous le coude | Je m'abonne et je le garde | 4+3 = 7 |
| Favori, vidéo | Garde-la pour la revoir | Je m'abonne et je la garde | 4+3 = 7 |
| Vote (3 types) | Voter, et tout le reste : Premium | Je m'abonne et je vote | 6+3 = 9 |
| Carte floutée /vannes, /conseils, /videos | Le reste de la liste est juste derrière | Je m'abonne et j'ouvre toute la liste | 7+3 = 10 |

Chargement du bouton (compte connecté) : « On t'emmène au paiement… ».
**Disparaît** : `intro` et `introCompte` des 7 gestes (« si tu fermes, la X reste là »), `avantage` (15 à 19 mots), le lien vers l'étape 1 (`fenetreLienEtape1`, sans rapport avec le geste), `FENETRE_GARANTIE` (remplacée par REASS), « le soir où tu en auras besoin » des titres de favori, « Le vote est réservé à Premium ». **Avant** : 73 à 78 / 67 à 72.

## 4. Résultat du quiz d'humour : le résultat + 1 plein gratuit + 1 lien payant

Fichiers : `entrees-parcours.ts` → `QUIZ_HUMOUR_PARCOURS` ; `cta-pages.ts` → `QUIZ_HUMOUR_CTA` ; `lib/quiz-resultat-textes.ts`.

| Clé | Texte exact | Mots |
|---|---|---|
| `intro` | Ton point de départ : | 4 |
| `titre(slug)` | Parcours {P} | 2 (4 pour Machine à Café) |
| `raison.OBSERVATEUR` | Tu vois ce que les autres ne remarquent pas : ce parcours part de là. | 14 |
| `raison.STORYTELLER` (publié) | Tu tiens une table avec tes histoires : ce parcours t'apprend à couper ce qui traîne. | 15 |
| `raison.STORYTELLER` (non publié) | Tu tiens une table avec une histoire : ce parcours t'apprend à la raconter jusqu'au bout. | 15 |
| `raison.ABSURDE` | Tes idées surprennent : ici, tu apprends à les placer au bon moment. | 12 |
| `raison.PUNCHLINEUR` | Tu vises le mot juste : ce parcours travaille le rythme et les silences. | 13 |
| `raison.TAQUIN` | Tu renvoies chaque balle : ce parcours t'apprend à viser sans blesser. | 11 |
| `sansCompte` (note sous le plein) | Sans compte. | 2 |
| `bouton(slug)` (plein, gratuit) | Tester l'étape 1 de {P}, gratuite | bouton |
| `lien(slug)` (lien payant) | Ouvrir les 5 parcours · 2,99 €/mois | lien |
| **Hors bouton** | | **19 à 25** (maximum : Machine à Café avec STORYTELLER non publié, 4+4+15+2) ; budget 25 OK |

**Disparaît** : `phrase()` (33 mots), `premium()` (55 à 70 mots), `PHRASES_PROFIL`, `phraseProfil()`, le champ `premium` de `quiz-resultat-textes.ts`, `GARANTIE_B12`, `OUVRIR_P` (« Ouvrir {P} en entier »), « t'aide à » et « avec le sourire », « ce parcours les place » (c'est toi qui places tes idées). **Avant** : 120 à 142 / 113 à 135.

## 5. Résultat du quiz d'orientation (compte sans abonnement) : titre + 1 phrase + 1 plein + REASS

Fichier : `cta-pages.ts` → `QUIZ_ORIENTATION_CTA` (le gabarit `paragraphes()` devient `titre()` + `phrase()`), `humor-quiz.tsx`.

| Parcours | `titre` | `phrase` (table `LIGNE_QUIZ`, 1 phrase) | Hors bouton |
|---|---|---|---|
| Répartie | Ton parcours : Répartie | Pour toi si on te chambre et que tu cherches encore quoi répondre. | 3+13 = 16 |
| Machine à Café | Ton parcours : Machine à Café | Pour toi si tu veux faire rire à la pause. | 5+10 = 15 |
| Confiance | Ton parcours : Confiance | Pour toi si tu aimerais rire plus souvent avec les autres. | 3+11 = 14 |
| Storytelling | Ton parcours : Storytelling | Pour toi si ta chute arrive quand tout le monde est passé au dessert. | 3+14 = 17 |
| Boulot | Ton parcours : Boulot | Pour toi si, le lundi à 9 h, tu prends un ton de compte rendu. | 3+15 = 18 |

Plein : « Ouvrir les 5 parcours · 2,99 €/mois ». Sous le plein : REASS. Liens : « Refaire le quiz » (3), « Tester l'étape 1 de {P}, gratuite » (GRATUIT_P).
**Disparaît** : « Ton quiz te conseille », « L'étape 1 est offerte. Ensuite : {PROGRAMME} », tout le paragraphe 2 (durée, rythme, « Un seul prix… »), « Ton compte est prêt : il ne reste que le paiement. », `garantie` (24 mots), `PROGRAMME`, `FORMES_COURTES`, `programme()`, « sans (te) forcer », le lien « Voir par où commencer » (flou : le quiz vient de le dire), « à la pause café » (répétait « Café » du titre). **Avant** : 117 / 112.

## 6. Fin de l'étape 1 (visiteur) : bouton direct vers l'inscription, la lettre en dessous

Fichiers : `cta-pages.ts` → `FIN_ETAPE_1` ; `offre.ts` → `VALIDATION_ETAPE` ; `step-blocks.tsx` (`ValidationWall`). Le plein mène à `/register` (puis paiement). Le mot « étape » apparaît 2 fois à l'écran (bouton, surtitre de la carte).

| Clé | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `titre` | Bien joué ! | 2 | |
| `phrase` | Premium ouvre la suite et les autres parcours d'un coup. | 10 | |
| `bouton` (plein) | Passer à l'étape 2 · 2,99 €/mois | bouton | |
| REASS | sous le plein | 11 (REASS) | |
| `lettre.ligne` (sous la REASS, petit texte discret) | La lettre gratuite : une vanne par mois. | 7 | |
| `lettre.champ` (placeholder) | toi@exemple.fr | champ | |
| `lettre.bouton` (texte discret, pas un plein) | Envoie-moi la lettre | bouton | |
| Case de consentement et mention | texte légal exact, affichées au focus du champ | hors budget | |
| **Total** | | **19** | **25 OK** |

Carte « Étape 2 » (donnée du parcours) : surtitre « Étape 2 sur {N} », où {N} est le nombre d'étapes du parcours lu dans la donnée (jamais en dur) ; titre et aperçu de l'étape.
Variante quiz en cours (`ValidationWall`, `quizPending`) : texte « Les étapes suivantes s'ouvrent avec Premium. » (6), bouton plein « Passer à l'étape 2 · 2,99 €/mois », REASS dessous.
**Disparaît** : « tu la valides », « Valider l'étape fait partie de Premium. », « Valider l'étape · 2,99 €/mois », `carteFormat()`, la durée du surtitre de carte, « Le rythme conseillé… », `lignePrixGarantie(annuel)` (31 mots), `FIN_ETAPE_1.lienLettre` (19 mots), `APERCU_REASSURANCE` sous ce mur, « pour l'étape 1 » du titre, « toutes les étapes suivantes ». **Avant** : 99 / 93.

## 7. Cartes de /parcours (visiteur)

Fichier : `cta-pages.ts` → `LISTE_PARCOURS_CTA`.

| Clé | Texte exact | Mots hors bouton |
|---|---|---|
| `bouton(slug)` (plein) | Tester l'étape 1 de {P}, gratuite | bouton |
| `frontiere(slug)` | Sans compte. La suite : Premium. | 5 |

**Disparaît** : « Commencer {P}, étape 1 gratuite », « Étapes 2 à 4 : Premium » / « Étapes 2 et 3 : Premium » (nombres d'étapes en dur), « ni abonnement, quiz compris ». **Avant** : 19 / 14.

## 8. Page d'un parcours, visiteur (aperçus des étapes 2 et suivantes)

Fichiers : `parcours.ts`, `offre.ts`, `entrees-parcours.ts`, `step-blocks.tsx`.

| Clé | Texte exact | Mots |
|---|---|---|
| `progressionVisiteurTexte()` | Étape 1 gratuite, la suite avec Premium | 7 |
| `VANNES_ETAPE.apercuVisiteur(n)` | {n} vannes dans cette étape. | 5 |
| `APERCU_LIEN` (lien sous l'aperçu ouvert) | Ouvrir les 5 parcours · 2,99 €/mois | lien |
| `QUIZ_FIN_BOUTON.visiteur` (rendu en lien) | Refaire le quiz | lien |
| **Hors bouton (aperçu)** | | **12** (budget 25 OK) |

**Disparaît** : `APERCU_INTRO` (« Pour les suivantes, tu vois ici ce qu'elles contiennent. »), « offerte » (remplacé par « gratuite »), « étapes 2 à 4 » (nombre en dur), `ETAPE_APERCU_LIBELLE`, `APERCU_BAS` (16 mots), `APERCU_REASSURANCE`, `etapeVerrouilleeTexte()`, « t'attendent », « Ouvrir toutes les étapes », `MUR_PREMIUM_BOUTON` « Voir ce que contient Premium » (valeur générique remplacée par « Ouvrir les 5 parcours · 2,99 €/mois », utilisée par `favoris-list.tsx`). **Avant** : 55 hors bouton.
