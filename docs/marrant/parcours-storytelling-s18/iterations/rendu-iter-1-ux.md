# Rendu du parcours Storytelling, itération 1, relecture sur captures (@ux, s18)

Captures lues (`docs/qa/captures-parcours-storytelling-s18/`) : visiteur 375 (haut de page, page entière, étape 1, étape 5, fin de page), Premium 375 (haut de page, page entière, étape 1, étape 5, fin de parcours, carte de fin), visiteur 768 (fin de page), visiteur 1280 (étape 1), Premium 1280 (haut de page, étape 6). Référence de comparaison : ma notation s17 (`audit-parcours-apprentissage-s17/iterations/iter-4-ux.md`) et la capture s17 Machine à Café étape 1 avant validation. **Non regardées** (budget) : les autres captures 768 et 1280 (page, étape 1, étape 5, fin, carte), supposées de même gabarit que celles lues. Hors périmètre, non comptés : questions 3 et 4 du quiz de l'étape 1 (affichage « Quiz 1/2 »), phrase de suite vers Machine à Café.

## 1. Notes

| Parcours | Note | Pourquoi |
|---|---|---|
| **Visiteur** (aperçu, blocage Premium, première étape gratuite) | **9,5 / 10** | La fiche (description B, « Pour qui ? », témoignage « Imagine Samir ») se lit d'un coup d'œil. L'étape 1 est lisible en entier avec « Lecture libre », conseil, exemple, défi, quiz jouable, vannes annoncées sans être montrées. Aperçu des étapes 2 à 6 sans contenu payant (étape 5 : « Ce que tu vas apprendre », format, une phrase de blocage, « Voir l'offre Premium », « 2,99 €/mois, sans engagement »), validation bloquée avec « Valider l'étape fait partie de Premium. ». Lien « Jette un œil au parcours suivant » en bas. Retient 0,5 : durée annoncée (D1), typographie (D3). |
| **Premium** (étape, exercice, retour d'exercice, rythme, fin, carte) | **9,0 / 10** | Étapes 1, 5 et 6 complètes et conformes aux textes validés : défi COUPE, 5 vannes avec chute en gras, vidéos avec légendes d'observation, quiz « 1/4 », « Termine le quiz pour valider cette étape ». Fin de parcours exacte : « Tu as fait les 6 étapes et gagné 800 XP, bonus de fin compris », six lignes « Ce que tu sais faire maintenant » reprenant les titres d'étape, un seul bouton « Passer au parcours Machine à Café ». Plafonné à 9,0 : le rythme (choix du jour, « prochaine étape conseillée ») et le retour d'exercice après un clic ne sont pas dans les captures, donc non prouvés (P1, P2). |

**Note globale : 9,0 / 10.** Aucun bloquant. 1 important (D1), 4 mineurs (D2 à D5), 2 preuves manquantes (P1, P2).

## 2. Vérifié à l'écran (aucun écart)

- Promesse fiche / étape / fin : la fiche annonce « une anecdote coupée au plus court, des personnages qu'on entend, une chute qui surprend, un détour qui ne perd personne, un détail qui revient », l'étape 1 s'intitule « Ton anecdote, coupée au plus court », l'écran de fin liste les six mêmes titres. Même vocabulaire de bout en bout.
- XP : « 800 XP au total, dont 100 de bonus à la dernière étape » sur la page, « 800 XP, bonus de fin compris » à la fin, +50, +75, +100, +125, +150, +200 sur les étapes (700 + 100).
- Retour d'exercice (« Alors, ce défi ? », trois boutons) affiché avant validation et pour le visiteur : même comportement que la capture s17 de Machine à Café, donc non compté comme écart.
- Étape 6 Premium : « Étape validée » en bas, les deux paragraphes du défi présents (DÉFI SOIRÉE puis « Tu travailles ton anecdote du parcours Storytelling ? »), une seule vidéo, signe de réussite écrit dans le texte d'étape.
- Étape 5 : les 5 vannes validées s'affichent avec « Parenthèse : … Bref. » puis chute en gras, cohérentes avec le défi TIROIR et avec le quiz.
- Mobile 375 : aucun débordement horizontal, boutons pleine largeur, cartes lisibles. Pas de tiret cadratin dans les textes visibles.

## 3. Défauts

### Bloquants (0)

Aucun.

### Importants (1)

**D1. « Environ 20 min, hors vidéos » contredit le budget de 20 min/semaine** (U4, promesse). Emplacement : sous le « Format » de chaque étape (étape 1 visiteur 375 et 1280, étape 1 Premium 375, étape 5 Premium 375, étape 6 Premium 1280).
Citation à l'écran : « Format : Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. Environ 20 min, hors vidéos » (étape 6 : « … une vidéo … Environ 20 min, hors vidéos »).
Problème : la fiche et la spec parlent de 20 min par semaine vidéo comprise (12 min hors vidéo + vidéo obligatoire de 8 min au plus). Annoncer 20 min *hors* vidéos revient à promettre environ 27 min à l'étape 1 (Pascot 6 min 30) et 28 min à l'étape 4 (Mirabel 7 min 45). Le visiteur lit ce chiffre avant de payer. La formule vient du gabarit des parcours de s17 (« Environ 15 min, hors vidéos » à Machine à Café, cohérent avec « 15 à 20 min ») et a été reportée telle quelle avec le chiffre de Storytelling.
Correction : pour ce parcours, remplacer par « Environ 20 min, avec la vidéo obligatoire » (étapes 1 à 5) et « Environ 15 min, avec la vidéo » (étape 6, une seule vidéo de 3 min, le temps libéré va à l'exercice, spec §2.2). `[HYPOTHÈSE : durées non mesurées, à contrôler avec K14 avant la mise en ligne ; en attendant, retirer toute durée plutôt que d'en afficher une fausse.]`

### Mineurs (4)

**D2. Vignette de la vidéo Ngijol absente sur la capture visiteur 375 de l'étape 1** (U3). La carte « Thomas Ngijol / Le voisin » montre un bloc noir avec le bouton rouge, sans photo, alors que la vignette est bien là sur la capture visiteur 1280 et Premium 375. Probablement un chargement différé non terminé à la capture ; à confirmer. Correction : fond de remplacement de même ratio (16/9) avec la couleur de la carte, et attendre le chargement des vignettes avant la capture ; sinon vérifier que la vignette se charge sans défilement.

**D3. Guillemet et deux-points orphelins en début de ligne** (U1, lisibilité). À l'écran : première vue mobile, description du parcours : « …pour dire « et donc ? » / » au milieu de ton histoire » (le » ouvre la ligne) ; étape 5 (aperçu visiteur 375) : « C'est un tiroir / : une vanne cachée dans une autre. » Correction : espace insécable (U+00A0, ou fine insécable U+202F) après « et avant », et avant « : », « ? », « ! », « ; », dans les textes affichés (à faire une fois au rendu, pas texte par texte).

**D4. Guillemets droits dans la première vanne de l'étape 6** (voix). À l'écran : « Mon copain : 'Choisis le resto, ça m'est égal.' ». Correction (texte en base, désignation par texte exact à mettre à jour) : « Mon copain : « Choisis le resto, ça m'est égal. » ».

**D5. Étape 6 : deux défis dans un seul encadré, un seul retour d'exercice** (U2). À l'écran, le DÉFI SOIRÉE et le paragraphe « Tu travailles ton anecdote… » sont séparés par une ligne vide, sans titre, et le retour « Alors, ce défi ? » ne dit pas lequel des deux il évalue ; le texte d'étape annonce « celui du conseil, puis celui de ton anecdote ». Correction (texte d'étape, le défi validé ne bouge pas) : remplacer « Deux défis courts : celui du conseil, puis celui de ton anecdote. » par « Deux défis courts dans l'encadré ci-dessous : le premier pour une soirée, le second pour ton anecdote. Le retour concerne le second. » (décision à confirmer avec @fullstack, qui sait quel défi le bouton enregistre).

## 4. Preuves manquantes pour le 10/10

- **P1. Rythme** : aucune capture après la validation de l'étape 1 (panneau « Choisis ton jour », « Prochaine étape conseillée : … », succès « C'est noté »). Demander 375 et 1280.
- **P2. Retour d'exercice** : aucune capture après un clic (bouton sélectionné, confirmation sobre, erreur si le réseau lâche). Demander une capture 375 « Essayé, ça a marché » sélectionné.
- Mémo : captures 768 et 1280 de la page, de l'étape 5, de la fin et de la carte non regardées ; si elles ont été produites dans les mêmes conditions, aucune raison de penser qu'elles diffèrent.

## 5. Passage par persona (375 px)

- **Yanis visiteur** : lit la fiche, voit un parcours « pour toi si tu as de quoi tenir une table, mais que ta chute arrive… », ouvre l'étape 1, comprend le geste (écrire bavard puis couper), tente le quiz, bute proprement sur « Valider l'étape fait partie de Premium. ». Seule friction : « Environ 20 min, hors vidéos » (D1).
- **Marc Premium** : étape 1 puis étape 5, exercices faisables avec repli solo visible, fin de parcours claire. Le rythme n'est pas encore prouvé (P1).
- **Sophie** : étape 6, un défi pour la soirée et un pour son anecdote ; le retour d'exercice ne dit pas lequel (D5).

## 6. Verdict

9,0 / 10 sur captures. Pour le 10 plein : corriger D1 (durée), D3 (espaces insécables), D4, D5, confirmer D2, et fournir P1 et P2. Aucun bloquant : pas de NO-GO UX. Vérifié : captures listées en tête, à l'œil. Non vérifié : contrastes mesurés, clavier, annonces vocales, code.

Handoff : @fullstack (D1, D3, D4, D5) et @qa (P1, P2, D2).
