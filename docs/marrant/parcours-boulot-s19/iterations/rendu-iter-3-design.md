# Rendu itération 3 : notation visuelle @design, Parcours Boulot et non-régression (s19, 11/10/2026)

Base : `docs/qa/captures-parcours-boulot-s19/` (index, 98 PNG) et `.../regression/` (index, 72 PNG). Relecture précédente : `rendu-iter-2-design.md` (Boulot 10, non-régression 9,3). Corrections lues : `implementation.md`, section « Rendu itération 3 ». Aucun code modifié, aucun token modifié. Les [CHOIX UTILISATEUR] ne sont pas re-questionnés (N5 et N7 @ux restent chez Thomas).

## Ce qui a été réellement regardé (Read sur les PNG)

- **BR1 (les 8 captures demandées)** : `repartie-375/1280-visiteur-apercu-etape2`, `storytelling-375/1280-visiteur-apercu-etape2`, `machine-a-cafe/repartie/confiance/storytelling-375-premium-page-haut` (4 sur 4, pas seulement 2).
- **Boulot, nouveaux états** : `premium-375-page-haut-progression`, `premium-1280-page-haut-progression`, `premium-375-lien-etape-apres-clic`, `premium-375-erreur-chargement`, `premium-375-erreur-chargement-page` (pleine page, vue réduite : structure seulement), `premium-375/1280-etape3-version-sans-risque`, `premium-375/1280-etape6-version-sans-risque`, `premium-375-etape3-aller-au-defi`, `premium-375-etape2-ordre-conseille`, `visiteur-375-etape2-apercu`, `premium-375-retour-exercice`, `visiteur-375-page-haut`, `visiteur-768-etape1` (pleine page réduite), `premium-1280-etape2` (pleine page réduite), `premium-375-etape1-apres-validation`, `visiteur-375-hub-carte-boulot`, `visiteur-1280-hub-haut`, `premium-375-fin-machine-a-cafe-boulot-publie-carte`, `premium-375-fin-parcours-carte`.
- **Non-régression, autres** : `storytelling-768-visiteur-page-haut`, `machine-a-cafe-768-visiteur-page-haut`, `repartie-768-visiteur-etape1`, `hub-375-visiteur-haut`, `storytelling-375-visiteur-etape1`, `repartie-375-visiteur-page-haut`, `confiance-375-premium-fin-carte`.
- **Non lues** : variantes 768/1280 des aperçus 3 à 6, étapes 4 et 5 Premium, `premium-1280-etape3` hors élément, hub 1280 pleine page (mêmes composants que les captures lues). Le détail typographique est jugé sur les captures d'élément (343 à 768 px de large), jamais sur une pleine page réduite.

## Notes

| | Note | Pourquoi |
|---|---|---|
| **Parcours Boulot** | **10 / 10** | Aucun bloquant. S1 à S4 corrigés et prouvés. Les ajouts de l'itération 3 sont lisibles aux 3 largeurs. Deux défauts neufs, tous deux mineurs (N-a, N-b), non bloquants |
| **Non-régression des 4 parcours en ligne** | **10 / 10** | BR1 prouvé (a et b). Aucune régression visible sur les 4 parcours, le hub et les cartes de fin. Aucun élément Boulot n'apparaît sur les 4 parcours |

## Statut de BR1 et de S1 à S4

| Point | Statut | Preuve vue |
|---|---|---|
| **BR1 a** Aperçu d'étape verrouillée ouvert, 4 parcours en ligne | **Corrigé** | `repartie-375` : « Ce que tu vas apprendre » en 16 px, interligne 28 px, 11 lignes lisibles ; « Format : … » ; texte du verrou centré ; bouton violet plein « Voir l'offre Premium » de 44 px ; « 2,99 €/mois, sans engagement. ». `repartie-1280` : 15 px, 5 lignes, même structure. `storytelling-375` : scène plus longue (bloc d'environ 1 100 px, 22 lignes), mais aucun débordement, bouton et verrou intacts. `storytelling-1280` idem. En-tête : un cadenas à gauche, chevron « ouvert » à droite, « +75 XP », « Fait partie de Premium ». Titre de Storytelling sur 2 lignes à 375 sans choc avec le chevron |
| **BR1 b** Haut de page Premium en cours | **Corrigé** | Les 4 parcours en 375 : barre de progression (1/3, 1/4, 1/6, 1/6), total d'XP **aligné à gauche** sur 2 lignes, lien « La prochaine étape t'attend. » avec « Étape 2 : <titre> » dessous, rappel e-mail, puis « Le programme » avec l'étape 1 validée et l'étape 2 ouverte. L'argumentaire est bien après le programme. Aucun bloc plus haut que l'écran, aucun vide. Même rendu que Boulot (`premium-375-page-haut-progression`, 2/6) |
| **S1** Coupe après trait d'union dans le défi | **Corrigé** | `premium-375-retour-exercice` : « Choisis-en une et écris-la en deux » sur la même ligne, « (relis-les : elles doivent rester » entier. Le gluon U+2060 est invisible : aucun glyphe de remplacement, aucun espace parasite |
| **S2** Double cadenas | **Corrigé** | `premium-375-etape2-ordre-conseille` : un seul cadenas (rond de gauche), plus d'icône à droite, texte « Termine l'étape 1 pour débloquer » conservé, titre sur 2 lignes sans collision. Visiteur (`visiteur-375-etape2-apercu`) : cadenas à gauche et chevron d'ouverture, pas de doublon |
| **S3** « En 6 semaines » | **Corrigé** | `visiteur-375-page-haut` : « En 6 semaines, tu apprends à la sortir sans » sur une ligne, « En » n'est plus orphelin en fin de ligne. Boulot, Storytelling 768, Machine à Café 768 : coupes correctes. Répartie 375 (« En 4 semaines, tu apprends à la dire à voix ») idem |
| **S4** Ligne XP orpheline en erreur | **Corrigé** | `premium-375-erreur-chargement` : alerte « Ta progression est intacte. » + « Réessayer » (44 px), plus de ligne « 700 XP au total » ni de vide au-dessus. `…-page` : la structure complète reste cohérente (étape 1 de repli) |

## Défauts bloquants

Aucun, ni sur Boulot ni sur la non-régression.

## Défauts neufs introduits par l'itération 3 (tous non bloquants)

**N-a. Lien d'étape : seule la première ligne a l'allure d'un lien** (`premium-375-page-haut-progression`, `premium-1280-…`, et les 4 `regression/*-premium-page-haut`)
- Constat : « La prochaine étape t'attend. » est violet souligné (lisible, contraste net sur fond sombre). « Étape 3 : Le couloir : quinze secondes » est en gris, sans soulignement : il se lit comme une légende, alors que le bloc entier est la cible. Un utilisateur qui vise la 2e ligne touche quand même (cible de 44 px), mais rien ne le laisse deviner.
- Cible : correcte, bloc de 2 lignes sur toute la largeur à 375, donc plus de 44 px. Sur 1280 la cible est pleine largeur de carte alors que le texte n'occupe que 280 px : zone cliquable plus large que le texte visible, sans effet à signaler.
- Libellé : « Étape 3 : Le couloir : quinze secondes » contient deux fois « : » (titre du module). Lisible, pas corrigeable sans toucher au titre validé.
- Correction (CSS seulement, aucun texte) : appliquer la couleur et le soulignement du lien aux deux lignes (ou `group-hover:underline` sur la 2e), ou ajouter une flèche `→` en fin de 2e ligne. Cosmétique.

**N-b. « Version sans risque » : même poids visuel que le défi** (`premium-375/1280-etape3-version-sans-risque`, `etape6-…`, `retour-exercice`)
- Constat : les deux encadrés ont le même fond, la même bordure violette, le même rayon et le même corps de texte. La différence tient au libellé : « DÉFI X : » en ligne et en gras dans le premier, « Version sans risque » en titre sur sa propre ligne, gras blanc, dans le second. Le titre du repli est donc **plus saillant** que le mot-clé du défi. En plissant les yeux sur l'étape 3 à 375, on voit deux blocs jumeaux, et le défi principal ne domine pas.
- Lisibilité : texte gris clair sur fond sombre violacé, lisible aux 3 largeurs (aucun défaut de contraste visible ; ratio non mesuré à l'outil, à confirmer par `qa`). Cohérence avec l'encadré du défi : bonne (mêmes tokens `accent-primary`), c'est justement ce qui nivelle la hiérarchie.
- Correction proposée (une des deux, au choix de @fullstack) : bordure en `border-dashed` ou fond d'un cran plus discret pour le repli, ou titre « Version sans risque » en 14 px `font-semibold` gris clair plutôt qu'en blanc 16 px. Résultat visé : le défi reste le bloc dominant, le repli se lit comme une alternative.
- Observation de contenu, à `@copywriter` seulement si Thomas le souhaite : à l'étape 6 (`etape6-version-sans-risque`), le défi et son repli font chacun 12 à 14 lignes à 375, soit près de 800 px de texte avant « Alors, ce défi ? ». Déjà signalé en itération 2 (défis longs). Pas d'action design.

**N-c. Place réservée du lien « Lire la fiche du conseil »** : aucune capture ne montre de trou visible (`visiteur-768-etape1`, `visiteur-375-etape1` : le lien est présent sous le conseil, espacement régulier). Pas de défaut.

## « Aller au défi »

- `visiteur-768-etape1`, `premium-375-lien-etape-apres-clic`, `premium-1280-etape2`, `premium-1280-page-haut-progression` : lien souligné violet, 14 px, placé sous l'en-tête de l'étape et au-dessus de « Pourquoi cette étape ? ». Lisible, aligné à gauche du contenu. Espace au-dessus (environ 50 px à 1280) un peu plus grand que dessous (environ 40 px) : cosmétique.
- `premium-375-etape3-aller-au-defi` : après le clic, « Exercice pratique » arrive à environ 60 px sous la barre collante, avec le défi entier visible dans la fenêtre de 812 px. Pas de titre masqué par la barre.
- Présent aussi sur l'étape 1 (visiteur et Premium) : cohérent avec « Boulot seulement » (rien de tel sur Répartie 768, Storytelling 375, Machine à Café 768).

## Aucune régression visible sur ce qui est capturé

- **Hub** : `hub-375-visiteur-haut` : « 4 parcours … Machine à Café, Répartie, Confiance et Storytelling », aucune mention de Boulot ; quiz d'orientation intact (le quiz n'oriente pas vers Boulot : N5, Thomas). Hub Boulot publié (`visiteur-1280-hub-haut`) : « 5 parcours … Storytelling et Boulot », 2 lignes, sans orphelin. Carte Boulot (`visiteur-375-hub-carte-boulot`) : 💼 centrée, accroche, « En 6 semaines » entier, « Programme » replié, un seul CTA plein.
- **Pages visiteur 768** (Storytelling, Machine à Café) : fil d'Ariane, titre, badge, « Pour qui ? », témoignage, encart « Étape 1 offerte », programme, étape 1 ouverte avec « Lecture libre ». « étapes 2 et 3 » sur Machine à Café (0441569). Aucun débordement horizontal.
- **Étape 1 visiteur** : Répartie 768 (conseil, lien de fiche, exemple, défi non gras comme en s18, « Alors, ce défi ? », vannes, vidéos, quiz, offre) et Storytelling 375 (exemple Avant / Après en paragraphes, « DÉFI COUPE » en gras) : inchangés par rapport à l'itération 2. **Aucun** « Version sans risque » ni « Aller au défi » sur ces parcours.
- **Cartes de fin** : Confiance 375 (`premium-fin-carte`) : pas de bandeau, 6 acquis, CTA Storytelling. Boulot 375 : 700 XP, 6 acquis, CTA Storytelling. Fin de Machine à Café avec Boulot publié : « Passer au parcours Boulot » et accroche de Boulot, bouton plein sur une ligne.
- **Cohérence entre parcours** : le haut de page Premium en cours est strictement le même composant sur les 5 parcours (BR1 b). L'écart « défi en gras, exemple en paragraphes » entre parcours anciens et récents persiste (S6, décision Thomas).

## Suggestions (non bloquantes)

**A. Lien d'étape (N-a)** : donner l'allure de lien aux 2 lignes. Fichier : `parcours-detail.tsx`, carte de progression.

**B. Hiérarchie défi / repli (N-b)** : alléger le repli (bordure pointillée ou titre plus discret). Fichier : `parcours-step-card.tsx`, encadré `ENCADRE_DEFI` et son titre. À re-capturer : `premium-375-etape3-version-sans-risque` et `premium-1280-etape6-version-sans-risque`.

**C. Carte de progression, marge basse** (`premium-375-page-haut-progression`) : sous « Règle-le dans ton profil » l'espace dans la carte (environ 40 px) est plus grand qu'en haut (environ 16 px), à cause du bloc de 44 px. Réduire le `padding-bottom` ou centrer verticalement le lien. Cosmétique.

**D. S5 (« 700 XP au total » pendant le parcours)** : inchangé et toujours ambigu (2/6 et « 700 XP au total »). Microcopy neuve à valider par Thomas : « 125 XP gagnés sur 700, bonus de fin compris ». Si non validé, ne rien changer.

**E. S6 et S7** : inchangés, hors périmètre (extension défi en gras aux 3 parcours anciens : décision Thomas ; refrain « Avant de la sortir, un seul test… » dans les 6 scènes : @copywriter).

**F. Contraste, mesure** : faire mesurer par `@qa` (outil, pas à l'œil) le texte gris des deux encadrés et du lien d'étape, en clair et en sombre si un mode clair existe. Je n'ai évalué que visuellement.

## Pour rester à 10 / 10 avant déploiement

1. Rien de bloquant. A et B sont des finitions : si elles sont faites, re-capturer les 4 fichiers cités, sans toucher aux 4 parcours en ligne (le lien d'étape les concerne, l'encadré non).
2. Les arbitrages Thomas restants (N5, N7, S5, S6) ne bloquent pas le rendu.
3. Ne rien déployer sous `BOULOT_PUBLIE = true` sans le feu vert de Thomas (visionnage des 10 vidéos, validation de l'effet du déploiement sur le catalogue, `implementation.md`).

---
**Handoff → @orchestrator (puis @fullstack pour A et B si retenues)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-3-design.md`
- Décisions : Boulot 10/10, non-régression 10/10 ; BR1, S1, S2, S3, S4 corrigés et prouvés par les captures ; 0 bloquant ; 2 défauts neufs mineurs (lien d'étape à demi lisible comme lien, repli « Version sans risque » de même poids que le défi) ; 6 suggestions A à F
- Points d'attention : aucun token ni code modifié ; aucun texte proposé pour le site (donc aucun tiret cadratin) ; S5 reste une microcopy neuve à valider par Thomas ; mesure de contraste à confier à @qa ; déploiement conditionné au feu vert de Thomas
---
