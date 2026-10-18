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

Le pack a trois séries (A, B, C) qui repartent chacune à §1 : note « A§3 », « B§2 »… Faits établis : le vote est réservé à Premium ; une étape tient en 15 à 20 minutes. Les noms entre accents graves (`...`) sont des repères techniques : ignore-les. « REASS » désigne la phrase « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. », affichée sous les boutons qui mènent au paiement.

---

# Série A

## 0. Conventions communes (à lire une fois)

- **Comptage** : mots séparés par un espace ; les signes seuls (« » : ? · !) ne comptent pas ; un montant (« 2,99 € », « 2,99 €/mois », « 24,99 €/an ») et « 1 500+ » = 1 mot ; « 14 jours » = 2 mots.
- **Hors bouton** = tout ce qui n'est pas le libellé d'un bouton plein ou d'un lien d'action. **REASS** (réassurance fixe, 11 mots) est comptée à part, sauf sur /abonnement où elle est comptée.
- **Libellés uniques**
  - GRATUIT_ACCUEIL = « Tester mes premières répliques, gratuit » (haut d'accueil, carte d'accueil, fin d'article générique).
  - GRATUIT_P = « Tester l'étape 1 de {P}, gratuite » (partout ailleurs où le parcours est connu ; Répartie par défaut sinon).
  - OUVRIR = « Ouvrir les 5 parcours · 2,99 €/mois » (action payante générique ; le « 5 » reste `PARCOURS_COUNT`). Le libellé ne change jamais : c'est le texte voisin qu'on ajuste.
  - Les libellés liés à un geste précis gardent leur forme (fiches, murs, fin d'étape 1, carnet, fenêtre Premium).
- **REASS** : « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » Sous tout bouton plein qui porte un prix, jamais sous un lien ni un bouton gratuit.
- **Plein / lien** : sur les surfaces « froides » (haut d'accueil, fin d'article) le plein est le gratuit et le payant est un lien ; sur les surfaces « chaudes » (carte d'accueil, fiches, murs, carnet, profil, fenêtre) le plein est le payant et le gratuit est un lien.
- **« d'un coup »** : deux emplacements dans tout le parcours d'achat, le sous-titre de /abonnement et la phrase de fin d'étape 1.

## 1. Haut de l'accueil (visiteur) : titre, 1 phrase, 1 preuve, 1 plein

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `hero-section.tsx` H1 (en dur) | Tu parles et personne rit. / On va arranger ça. | titre de la page | n/a |
| `hero-section.tsx` paragraphe (à passer dans la config : `ACCUEIL_HAUT.intro`) | Des vannes et des exercices pour répondre quand on te chambre. | 11 | |
| `hero-section.tsx` preuve sociale | 1 500+ inscrits bossent leur humour. | 5 | |
| `ACCUEIL_HAUT.bouton` (plein, gratuit) | Tester mes premières répliques, gratuit | bouton | |
| `ACCUEIL_HAUT.note` | Sans compte. | 2 | |
| **Total** | | **18** | **40 OK** |

## 2. Bouton Premium de l'en-tête

| Emplacement | Texte exact | Mots | Budget |
|---|---|---|---|
| `EN_TETE.bouton` | Premium · 2,99 €/mois | 2 | 0 levé |
| `EN_TETE.nomAccessible` | 2,99 € par mois : voir l'offre Premium | (a11y) | |

## 3. Fin d'article (article n°1, puis déclinaisons par parcours)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `BLOC_FIN.parArticle["meilleures-blagues-droles-2026"].titre` | La vanne dans ta bouche, pas dans ton téléphone | 9 | |
| `.texte` | La placer à voix haute, ça s'entraîne. | 7 | |
| `BLOC_FIN.boutonEtape1.repartie` (plein, gratuit) | Tester mes premières répliques, gratuit | bouton | |
| `BLOC_FIN.noteSansCompte` (à créer) | Sans compte. | 2 | |
| `BLOC_FIN.lienAbonnement` (lien payant) | Ouvrir les 5 parcours · 2,99 €/mois | lien | |
| **Total** | | **18** | **25 OK** |

**Déclinaisons** (`encarts-blog-s20.ts` → `TEXTES_PARCOURS_BLOG[slug]`) : même gabarit (titre, 1 phrase, plein gratuit, « Sans compte. », lien OUVRIR).

| Parcours | `finTitre` | `finTexte` | `finBoutonEtape1` (plein) | Hors bouton |
|---|---|---|---|---|
| Répartie | Ces techniques, rode-les avant la prochaine pique | Quand on te chambre, tu as une seconde, et ça s'entraîne. | Tester l'étape 1 de Répartie, gratuite | 7+11+2 = 20 |
| Machine à Café | Sois drôle au bureau sans avoir l'air d'essayer | Des vannes courtes, et le bon moment pour les placer. | Tester l'étape 1 de Machine à Café, gratuite | 8+10+2 = 20 |
| Confiance | Ta place dans un groupe qui rit | Personne ne te pousse sur scène : ça se joue entre amis. | Tester l'étape 1 de Confiance, gratuite | 7+11+2 = 20 |
| Storytelling | Une anecdote, travaillée jusqu'à ce qu'on te la redemande | Ton histoire vraie, resserrée étape après étape. | Tester l'étape 1 de Storytelling, gratuite | 9+7+2 = 18 |
| Boulot | Ta vanne du lundi, sans te griller | De la salle de réunion au pot de départ. | Tester l'étape 1 de Boulot, gratuite | 7+9+2 = 18 |

Abonné Premium : `TEXTES_BLOC_FIN.boutonAbonne` « Continuer mon parcours » (3 mots).

## 4. Carte Premium de l'accueil (visiteur)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `CARTE_PREMIUM.titre` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? | 10 | |
| `CARTE_PREMIUM.intro.scene` (phrase unique) | De la coloc à l'afterwork, un parcours par terrain. | 9 | |
| `CARTE_PREMIUM.bouton` (plein payant) | Ouvrir les 5 parcours · 2,99 €/mois | bouton | |
| REASS | sous le plein | 11 (REASS) | |
| `CARTE_PREMIUM.contour` (lien) | Tester mes premières répliques, gratuit | lien | |
| **Total** | | **19 + REASS 11 = 30** | **40 OK** |

Pas de preuve sociale dans cette carte (elle vit sous le titre du haut de page).

## 5. Carte d'accueil, compte connecté sans abonnement

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `CARTE_PREMIUM.titre` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? | 10 | |
| `CARTE_PREMIUM.connecte.ligne` (REMPLACE la phrase du §4, une seule phrase avant le bouton) | De la coloc à l'afterwork, un parcours par terrain. | 9 | |
| Bouton plein, REASS, lien gratuit | comme §4 (le bouton ouvre directement le paiement) | REASS 11 | |
| **Total** | | **19 + REASS 11 = 30** | **40 OK** |

## 6. Encart de démonstration au milieu de l'article

| Emplacement | Texte exact | Mots | Budget |
|---|---|---|---|
| `DEMO_VANNE.surtitre` | Situation offerte ce mois-ci | 4 | |
| `DEMO_VANNE.situation()` (donnée du carnet) | {accroche}, et on te lance : « {onTeDit} » | 26 (scène, exemptée) | |
| `DEMO_VANNE.question` | Tu réponds quoi ? | 3 | |
| `DEMO_VANNE.bouton` (plein, gratuit) | Voir la réplique | bouton | |
| **Total hors scène et bouton** | | **7** | **25 OK** |

## 7. Lettre en bas d'article (après le bloc de fin, jamais avant)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `LETTRE_ARTICLE.titre` | Une vanne décryptée, chaque mois | 5 | |
| `LETTRE_ARTICLE.phrase` | Gratuite, par e-mail, avec un exercice. | 6 | |
| Bouton du formulaire (`lettre-s21.ts` `formulaire.bouton`), style discret (pas un plein : le plein du bas d'article est celui du bloc de fin) | Envoie-moi la lettre | bouton | |
| Case de consentement et mention sous le bouton | texte légal exact (`formulaire.case`, `formulaire.mention`) | hors budget | |
| **Total** | | **11** | **25 OK** |

# Série B

> Conventions (comptage, hors bouton, REASS, libellés uniques GRATUIT_ACCUEIL / GRATUIT_P / OUVRIR) : voir `textes-v3-a.md` §0. Chemins : `apps/web/src/config/textes/`. REASS = « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » (11 mots, sous tout bouton plein qui porte un prix). GRATUIT_P = « Tester l'étape 1 de {P}, gratuite ».

## 1. Murs de liste (/vannes, /conseils, /videos) : titre + 1 ligne + 1 plein + REASS + 1 lien

Fichier : `cta-pages.ts` → `MUR_LISTE[liste]`.

| Clé | /vannes | /conseils | /videos |
|---|---|---|---|
| `titre` | Encore des vannes à ressortir (5) | Pour la prochaine fois qu'on te chambre (7) | Tu regardes pour rire. Et pour faire rire ? (8) |
| `limite` (nombres = `FREE_*_LIMIT`) | Fin des 10 gratuites. (4) | Fin des 3 conseils gratuits. (5) | Fin des 3 vidéos gratuites. (5) |
| `bouton` (plein) | Voir la suite des vannes · 2,99 €/mois | Voir la suite des conseils · 2,99 €/mois | Voir la suite des vidéos · 2,99 €/mois |
| REASS | sous le plein | idem | idem |
| `contour` (lien) | GRATUIT_P | GRATUIT_P | GRATUIT_P |
| **Hors bouton** | **9** | **12** | **13** |

Carte floutée : une seule (au lieu de 3), cliquable en entier, elle ouvre la fenêtre Premium (geste « carte floutée ») ; aucun libellé visible ; `CARTE_VERROUILLEE_LABEL` (aria) conservé.

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

## 3. Fenêtre Premium, chaque geste : 4 éléments visibles (titre, prix, plein, REASS)

Fichiers : `cta-pages.ts` → `FENETRE_PREMIUM[geste][type]`, `FENETRE_PRIX`. Ordre : titre, prix en gros (« 2,99 € TTC / mois », 3 mots), plein, REASS. Visiteur et compte connecté voient la même fenêtre.

| Geste | `titre` | `bouton` (plein) | Hors bouton |
|---|---|---|---|
| Favori, vanne | Mets-la de côté | Je m'abonne et je la garde | 3+3 = 6 |
| Favori, conseil | Garde-le sous le coude | Je m'abonne et je le garde | 4+3 = 7 |
| Favori, vidéo | Garde-la pour la revoir | Je m'abonne et je la garde | 4+3 = 7 |
| Vote (3 types) | Pour voter, il te faut Premium | Je m'abonne et je vote | 6+3 = 9 |
| Carte floutée /vannes, /conseils, /videos | Le reste de la liste est juste derrière | Je m'abonne et j'ouvre toute la liste | 7+3 = 10 |

Chargement du bouton (compte connecté) : « On t'emmène au paiement… ».

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

## 6. Fin de l'étape 1 (visiteur) : bouton direct vers l'inscription, la lettre en dessous

Fichiers : `cta-pages.ts` → `FIN_ETAPE_1` ; `offre.ts` → `VALIDATION_ETAPE` ; `step-blocks.tsx` (`ValidationWall`). Le plein mène à `/register` (puis paiement). Le mot « étape » apparaît 2 fois à l'écran (bouton, surtitre de la carte).

| Clé | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `titre` | Bien joué ! | 2 | |
| `phrase` | Avec Premium, toute la suite s'ouvre d'un coup. | 8 | |
| `bouton` (plein) | Passer à l'étape 2 · 2,99 €/mois | bouton | |
| REASS | sous le plein | 11 (REASS) | |
| `lettre.ligne` (sous la REASS, petit texte discret) | Ou la lettre gratuite : une vanne décryptée par mois. | 9 | |
| `lettre.champ` (placeholder) | toi@exemple.fr | champ | |
| `lettre.bouton` (texte discret, pas un plein) | Envoie-moi la lettre | bouton | |
| Case de consentement et mention | texte légal exact, affichées au focus du champ | hors budget | |
| **Total** | | **19** | **25 OK** |

Carte « Étape 2 » (donnée du parcours) : surtitre « Étape 2 sur {N} », où {N} est le nombre d'étapes du parcours lu dans la donnée (jamais en dur) ; titre et aperçu de l'étape.
Variante quiz en cours (`ValidationWall`, `quizPending`) : texte « Les étapes suivantes s'ouvrent avec Premium. » (6), bouton plein « Passer à l'étape 2 · 2,99 €/mois », REASS dessous.

## 7. Cartes de /parcours (visiteur)

Fichier : `cta-pages.ts` → `LISTE_PARCOURS_CTA`.

| Clé | Texte exact | Mots hors bouton |
|---|---|---|
| `bouton(slug)` (plein) | Tester l'étape 1 de {P}, gratuite | bouton |
| `frontiere(slug)` | Sans compte. La suite : Premium. | 5 |

## 8. Page d'un parcours, visiteur (aperçus des étapes 2 et suivantes)

Fichiers : `parcours.ts`, `offre.ts`, `entrees-parcours.ts`, `step-blocks.tsx`.

| Clé | Texte exact | Mots |
|---|---|---|
| `progressionVisiteurTexte()` | Étape 1 gratuite, la suite avec Premium | 7 |
| `VANNES_ETAPE.apercuVisiteur(n)` | {n} vannes dans cette étape. | 5 |
| `APERCU_LIEN` (lien sous l'aperçu ouvert) | Ouvrir les 5 parcours · 2,99 €/mois | lien |
| `QUIZ_FIN_BOUTON.visiteur` (rendu en lien) | Refaire le quiz | lien |
| **Hors bouton (aperçu)** | | **12** (budget 25 OK) |

# Série C

> Conventions : `textes-v3-a.md` §0 (comptage, REASS, libellés uniques GRATUIT_ACCUEIL / GRATUIT_P / OUVRIR). Chemins : `apps/web/src/config/textes/`. REASS = « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » GRATUIT_P = « Tester l'étape 1 de {P}, gratuite ».

## 1. /abonnement : budget 120 mots hors FAQ et hors fiche du carnet, REASS et liens compris

Fichiers : `cta-pages.ts` (`ABONNEMENT_HAUT_PAR_PARCOURS`, `ABONNEMENT_CTA`), `offre.ts` (`ABONNEMENT_HAUT_VISITEUR`, `ANNUEL_*`), `entrees-parcours.ts`, `carnet-extrait.ts`, `abonnement-view.tsx`, `plan-selector.tsx`. Ordre : titre, sous-titre, carte (prix, plein, REASS, avantages), extrait du carnet, « Pas encore sûr ? », FAQ. Pas de surtitre.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre Répartie / défaut (`.titre`) | Ta réplique en soirée, pas dans le bus du retour | 10 |
| Titre Machine à Café et Boulot | Faire rire au bureau, au bon moment | 7 |
| Titre Confiance | Rire à table, sans monter sur scène | 6 |
| Titre Storytelling | Ton histoire jusqu'à la chute, avant le « et donc ? » | 9 |
| Sous-titre (`ABONNEMENT_HAUT_VISITEUR.sousTitre`) | Tout est accessible d'un coup. Chaque étape tient en 15 à 20 minutes. | 13 |
| Carte : nom + puces | Premium · Mensuel · Annuel | 3 |
| Pastille (état mensuel seulement) | plus de 3 mois offerts | 5 |
| Prix (état mensuel ; état annuel : 24,99 € TTC / an) | 2,99 € TTC / mois | 3 |
| Ligne annuelle, état mensuel | Ou 24,99 €/an, soit 2,08 € par mois. | 6 |
| Ligne annuelle, état annuel (remplace la pastille et la ligne ci-dessus) | Soit 2,08 € par mois, plus de 3 mois offerts. | 9 |
| Bouton plein (`ABONNEMENT_CTA.bouton`, un seul libellé pour tous les parcours d'origine) | Ouvrir les 5 parcours · 2,99 €/mois (annuel : · 24,99 €/an) | bouton |
| `ABONNEMENT_CTA.suite` (visiteur seulement) | Ton compte, puis le paiement sécurisé. | 6 |
| Ligne sous le bouton (compte connecté seulement) | Paiement sécurisé par Stripe | 4 |
| REASS | sous le plein | 11 |
| Avantages (composant unique, §2) | 4 lignes | 22 |
| Extrait du carnet : surtitre + titre | Carnet de novembre · Situation 15, offerte / Le carnet, en vrai | 6 + 4 |
| Extrait : lien | Lire la fiche en entier | 5 |
| « Pas encore sûr ? » + lien (parcours d'origine, sinon Répartie) | Pas encore sûr ? Tester l'étape 1 de Répartie, gratuite | 3 + 6 |

**Totaux exacts** (liens et REASS compris) : visiteur Répartie, état mensuel **103**, état annuel **101** ; visiteur Machine à Café 102 / 100 ; Boulot 100 / 98 ; Confiance 99 / 97 ; Storytelling 102 / 100 ; compte connecté (titre du parcours d'origine, sans `suite`, sans « Pas encore sûr ? », avec la ligne Stripe) **92** au plus. Budget 120 : OK dans tous les cas.

## 2. Composant « 4 avantages » (`PremiumBenefits`) : /abonnement seulement

À déplacer en config (`PREMIUM_AVANTAGES`).

| # | Texte exact | Mots |
|---|---|---|
| 1 | Chaque parcours en entier | 4 |
| 2 | Un nouveau carnet de répartie chaque mois | 7 |
| 3 | Tout le catalogue : vannes, conseils, vidéos | 6 |
| 4 | Tes favoris sous la main | 5 |
| **Total** | | **22** |

## 3. FAQ de vente : question sur le prix (accueil et /abonnement)

Fichier : `lib/faqs.ts`. Question : « 2,99 €/mois, c'est vraiment tout ? Pas de frais cachés ? »

| Contexte | Réponse | Mots |
|---|---|---|
| Accueil, et /abonnement quand seule la formule mensuelle est proposée | C'est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas. | 15 |
| /abonnement avec la formule annuelle | C'est le prix, point. Ça se renouvelle chaque mois ou chaque année, tant que tu ne résilies pas. | 18 |

## 4. /register (sans champ prénom)

Fichier : `app/(auth)/register/page.tsx` (textes en dur à passer dans `REGISTER_CTA`). Ordre : titre, prix, champs, plein, REASS, Google, CGU, liens. Budget 25 hors champs, hors REASS, hors mention CGU.

| Emplacement | Texte exact | Mots |
|---|---|---|
| H1 | Ton compte | 2 |
| `planReminder(plan)` | Premium, 2,99 € TTC par mois. (annuel : Premium, 24,99 € TTC par an.) | 5 |
| Champs | Email / Mot de passe / Au moins 8 caractères | hors budget |
| `REGISTER_CTA.bouton` (plein) | Créer mon compte et passer au paiement | bouton (7) |
| REASS, collée sous le plein | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| Google | Continuer avec Google | bouton |
| CGU (porte le contrat) | En créant ton compte, tu acceptes les CGU. | 8 (hors budget) |
| « Déjà un compte ? » | Déjà un compte ? Connecte-toi | 4 |
| `REGISTER_CTA.lienEtape1` (parcours d'origine, Répartie par défaut ; absent quand on arrive de la fin de l'étape 1) | Tester l'étape 1 de Répartie, gratuite | 6 (8 pour Machine à Café) |
| **Total** | | **17** (19 au plus), budget 25 OK |

## 5. Page de retour après paiement

Fichier : `app/(dashboard)/abonnement/success/page.tsx`.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre | Paiement reçu ! | 2 |
| Texte | Merci. Ton accès s'active… | 4 |
| Bouton (plein, mène à `/parcours`) | Choisir mon parcours | bouton (3) |

## 6. /carnet, visiteur : intro et paywall

Fichiers : donnée `docs/copy/carnet/novembre/carnet-2026-11.json` (clé `intro`), `cta-pages.ts` (`CARNET_PAYWALL`), `carnet-page.tsx`. Un seul mot pour la même chose sur la page : « répliques ».

| Emplacement | Texte exact | Mots |
|---|---|---|
| `view.intro` (à refaire chaque mois sur ce moule) | Du premier froid aux préparatifs de Noël, des répliques qui montent d'un cran. | 13 |
| Fiche offerte (donnée, « Le lundi de 9 h 40 ») | | exemptée |
| `CARNET_PAYWALL.titre(n)`, juste après la fiche offerte | Ça, c'était la réplique offerte. Il en reste 14. | 9 |
| `CARNET_PAYWALL.paragraphe` | Un nouveau carnet arrive chaque mois. | 6 |
| `CARNET_PAYWALL.bouton` (plein) | Voir tout le carnet · 2,99 €/mois | bouton |
| REASS | sous le plein | 11 (REASS) |
| Titre de la liste verrouillée | Au programme | 2 |
| Liste verrouillée : 3 titres de fiches (données), puis `CARNET_LISTE_RESTE(n-3)` | Et 11 autres répliques | 4 |
| **Bloc d'achat hors bouton** | | **21** (budget 25 OK) |

Le « 14 » apparaît deux fois dans le bloc (titre, « 14 jours » de la REASS).

## 7. /profil, compte sans abonnement

Fichier : `cta-pages.ts` → `PROFIL_ABONNEMENT_OFFRE` ; `compte.ts` ; `abonnement-card.tsx`.

| Emplacement | Texte exact | Mots hors bouton |
|---|---|---|
| `phrase` | Chaque mois, un nouveau carnet de répartie s'ajoute aux parcours. | 10 |
| `bouton` (plein) | Ouvrir les 5 parcours · 2,99 €/mois | bouton |
| `ligneDiscrete` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| **Total** | | **10** (budget 25 OK) |

## 8. Fins de page : /glossaire et /a-propos

Fichier : `cta-pages.ts` → `GLOSSAIRE_FIN`, `A_PROPOS_FIN`, `FIN_DE_PAGE_COMMUN`.

| Emplacement | /glossaire | /a-propos |
|---|---|---|
| `titre` | Le vocabulaire, c'est fait. Reste à s'en servir. (8) | Tu parles et personne rit. / On va arranger ça. |
| `paragraphe` (1 phrase) | Placer un callback au dîner de samedi, c'est autre chose : ça se travaille. (13) | Observer d'abord, roder ensuite : voilà le programme. (7) |
| Preuve | aucune | Déjà 1 500+ inscrits. (3, retirée si connecté) |
| `bouton` (plein) | Ouvrir les 5 parcours · 2,99 €/mois | idem |
| REASS | sous le plein | idem |
| `lienEtape1` (lien) | Tester l'étape 1 de Répartie, gratuite | idem |
| Corps de page (`page.tsx` l. 84-86) | n/a | « …et des exercices à mettre en pratique. » (le chiffre « 1 500+ » ne figure que dans la preuve de fin) |
| **Hors bouton (titre de page exclu)** | **21** | **10** (budget 25 OK) |

## 9. Paywall `premium-paywall.tsx` (web ; mobile natif : seul le texte de valeur change)

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre (en dur) | La suite, avec Premium | 4 |
| `PREMIUM_VALUE_TEXT` | Le carnet du mois, tes favoris, tout le catalogue. | 9 |
| Bouton web (plein) | Ouvrir les 5 parcours · 2,99 €/mois | bouton |
| `FENETRE_GARANTIE` devient REASS (web seulement) | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |

## 10. E-mail de confirmation de paiement (une phrase)

`paiement.ts` l. 262 :

| Avant | Après |
|---|---|
| Pour bien démarrer : ouvre un parcours et lance l'étape 2 (la première se lit déjà sans compte) : {url}/parcours. | Tout est ouvert. Pour démarrer, choisis un parcours : {url}/parcours. |

Le reste de l'e-mail (mentions légales) ne bouge pas.