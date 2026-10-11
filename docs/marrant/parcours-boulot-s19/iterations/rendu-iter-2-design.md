# Rendu itération 2 : notation visuelle @design, Parcours Boulot et non-régression (s19, 11/10/2026)

Base : `docs/qa/captures-parcours-boulot-s19/` (index + 85 captures) et `.../regression/` (index + 52 captures). Relecture précédente : `rendu-iter-1-design.md` (8,6/10). Corrections lues : `implementation.md`, section « Rendu itération 2 ». Correction texte 0441569 (intro du hub, « étapes 2 et 3 ») non comptée, comme demandé. Vérifié dans `parcours/(liste)/page.tsx` : l'intro est dynamique (`PARCOURS_COUNT`, `listeFr(NOMS_PARCOURS)`), elle suivra donc l'ajout de Boulot sans autre action.

## Ce qui a été réellement regardé (Read sur les PNG)

- **Boulot, 375** : hub haut, hub complet, carte hub, « Programme » déplié, page visiteur haut, étape 1 visiteur, quiz répondu, aperçus 3 et 6, étape 1 Premium, étapes 2 et 6 Premium, page haut avec progression 2/6, erreur de chargement, étape 2 « ordre conseillé », retour d'exercice, étape 1 validée, fin de parcours (fenêtre) et carte de fin, bas de page.
- **Boulot, 768** : « Programme » déplié, étape 1 visiteur, aperçu 4, étape 5 Premium, fin de parcours (fenêtre).
- **Boulot, 1280** : hub haut, hub complet, carte hub, « Programme » déplié, page visiteur haut, étape 1 visiteur, étape 6 Premium, étape 1 validée, carte de fin.
- **Non-régression** : hub 375 et 1280 (haut + page, 4 captures sur 4), Storytelling, Machine à Café, Répartie, Confiance en 375 (page haut, étape 2 Premium, carte de fin) ; étape 1 visiteur Storytelling 375 et Confiance 1280 ; pleines pages Machine à Café 375, Storytelling 375, Répartie 1280 ; fenêtres de fin Confiance 375 et Machine à Café 1280 ; carte de fin Storytelling 1280. Comparaison aux captures s18 Storytelling (`visiteur-375-etape1`, `premium-375-fin-parcours-carte`).
- **Non lues** : variantes 768/1280 des aperçus 2, 3, 5, 6 et des étapes 2 à 4, mêmes composants que celles lues. Les images longues sont réduites à l'affichage : j'ai jugé le détail typographique sur les captures 768/1280 et les captures d'élément de 343 px, jamais sur une pleine page réduite.

## Notes

| | Note | Pourquoi |
|---|---|---|
| **Parcours Boulot** | **10 / 10** | Aucun bloquant. Les 2 bloquants et les 4 non bloquants de l'itération 1 sont corrigés et prouvés sur le rendu. Restent 5 suggestions qui ne bloquent pas |
| **Non-régression des 4 parcours en ligne** | **9,3 / 10** | Aucune régression visible sur tout ce qui est capturé. Un bloquant de **preuve** : deux changements communs ne sont montrés dans aucune des 52 captures (voir BR1). Je ne note pas un état que je n'ai pas vu |

Avec BR1 prouvé et sans régression : 10 / 10.

## Statut de chaque point de l'itération 1

| Point | Statut | Preuve vue |
|---|---|---|
| **B1** Étape 1 visiteur sans conseil, exemple, défi | **Corrigé** | `visiteur-375-etape1`, `visiteur-768-etape1`, `visiteur-1280-etape1` : « Le conseil », lien « Lire la fiche du conseil », « Exemple concret » en 2 paragraphes, « Exercice pratique » avec « DÉFI TRACE » en gras, « Alors, ce défi ? », encart vannes, 2 vidéos, quiz 1/3, « Voir l'offre Premium » en bas. Même écran que l'étape 1 Premium |
| **B2** « Programme » déplié jamais capturé | **Corrigé** | `visiteur-375/768/1280-hub-programme-boulot` : 6 étapes (badge, titre, scène, Format, XP), aucun débordement horizontal, une ligne blanche avant « Un seul test… » dans les 6 scènes, pastille « Lecture libre » sur l'étape 1 seulement |
| **N1** Typographie française description, « Pour qui ? », témoignage | **Corrigé** | 375 : « 6 semaines » insécable, « « Redis-moi celle de ce matin… » jamais coupé après le guillemet, « à autre chose » et « À midi » liés au mot suivant, page et carte hub. Reste un cas voisin (S3) |
| **N2** Défis en 14 px serrés, mot-clé noyé | **Corrigé** | `premium-375-retour-exercice`, `premium-1280-etape6`, `visiteur-768-etape1` : interligne 24 px, « DÉFI TRACE » / « DÉFI SOIXANTE SECONDES » / « DÉFI DEUX PHRASES » en gras blanc. Défi de 2 200 caractères toujours long (texte, @copywriter) mais lisible |
| **N3** Exemple de l'étape 6 en 4 lignes serrées | **Corrigé** | `premium-1280-etape6` : Sincère / Humour / Fermeture / Total en 4 paragraphes séparés ; exemples des étapes 1 et 5 en 2 paragraphes |
| **N4** Aperçus 2 à 6 en 14 px | **Corrigé sur Boulot, non prouvé sur les 4 en ligne** | `visiteur-375-etape3-apercu`, `etape6-apercu`, `visiteur-768-etape4-apercu` : scène en 16 px / 28 px sur 375, 15 px sur 768, comme l'étape 1. Effet de bord sur les autres parcours : voir BR1 |
| **Icône 💼** | **Confirmée** | Bien centrée à côté du titre aux 3 largeurs, hub et page. Mentions « provisoire » retirées d'après l'index et `implementation.md` (non vérifié fichier par fichier : pas d'outil de recherche ici) |
| Hérité : bandeau « Parcours terminé ! » au-dessus de la carte de fin | **Corrigé** (N6 @ux) | `premium-375/768-fin-parcours` : plus de bandeau, la carte de fin ouvre la page. Idem sur Confiance 375 et Machine à Café 1280 |

## Défauts bloquants

### Boulot : aucun.

### Non-régression

**BR1. Deux changements communs appliqués aux 4 parcours en ligne, absents des captures** (`regression/index.md`, 52 PNG)
- **a) Aperçu d'étape verrouillée ouvert (N4, `step-blocks.tsx`).** Sur toutes les pleines pages de la série (`machine-a-cafe-375-visiteur-page`, `storytelling-375-visiteur-page`, `repartie-1280-visiteur-page`, etc.), les étapes 2+ sont **repliées** : cadenas, XP, pastille « Fait partie de Premium », chevron. Aucune capture n'en montre une dépliée. Or N4 passe le corps de l'aperçu de `text-sm` à `text-base leading-7 sm:text-[15px]` pour tous les parcours. Les scènes des 3 parcours les plus anciens sont plus courtes que celles de Boulot, donc le risque est faible, mais le bouton « Voir l'offre Premium » et le texte du verrou n'ont pas été vus avec la nouvelle taille.
- **b) Abonné en cours de parcours, haut de page (N2 a @ux et carte de progression, `parcours-detail.tsx`).** Pour un abonné qui a validé au moins une étape, l'argumentaire passe après le programme, pour tous les parcours. Les comptes `qa-r2-*` (étape 1 validée) existent, mais les seules captures Premium de la série sont l'étape 2 dépliée (élément) et la fin de parcours. Le haut de page « en cours » n'est vu que sur Boulot (`premium-375-page-haut-progression`).
- Correction (aucun code) : ajouter à `scripts/qa-parcours-boulot-s19/captures.js --regression` : (1) `<parcours>-375-visiteur-apercu-etape2.png` et `<parcours>-1280-visiteur-apercu-etape2.png` pour Répartie ou Confiance et pour Storytelling (clic sur l'en-tête de l'étape 2, capture de l'élément) ; (2) `<parcours>-375-premium-page-haut.png` avec le compte `qa-r2-*` (fenêtre de 812 px) pour au moins Confiance et Storytelling. Relire. Attendu : scène lisible, pas de bloc plus haut que l'écran sans raison, bouton plein visible, carte de progression puis programme, argumentaire en dessous.

## Aucune régression visible sur ce qui est capturé

- **Hub** (375 et 1280) : 4 cartes identiques en structure, aucune mention de Boulot, XP 325 / 475 / 800 / 800, « Programme » replié, un seul CTA plein par carte, FAQ et pied de page intacts. Persona, description et accroche sans coupe disgracieuse (N1 s'applique, rien de cassé).
- **Étape 1 visiteur** (Storytelling 375, Confiance 1280, Répartie 1280 pleine page, Machine à Café 375) : conseil, exemple, défi, « Alors, ce défi ? », encart vannes, vidéos, quiz, offre. Même enchaînement qu'avant. Storytelling : exemple Avant / Après désormais en 2 paragraphes, « DÉFI COUPE » en gras, interligne plus aéré : amélioration voulue (N2, N3), comparée à `captures-parcours-storytelling-s18/visiteur-375-etape1.png`.
- **Étape 2 Premium** (4 parcours, 375) : scène, conseil, exemple, défi, 5 vannes, vidéos, quiz, « Termine le quiz pour valider cette étape » neutralisé. Aucun bloc vide, aucun débordement, pastille « Lecture libre » absente (N3 @ux), bien.
- **Cartes de fin** (4 parcours, 375 ; Storytelling et Machine à Café en 1280) : plus de bandeau au-dessus, sous-titre sur 2 lignes, XP, acquis, CTA. Le CTA de Storytelling vers Machine à Café passe sur 2 lignes à 375 : identique à s18 (`premium-375-fin-parcours-carte.png`), donc pas une régression.
- **Cohérence entre parcours** : défi en gras et exemple en paragraphes seulement sur Storytelling et Boulot, comme demandé en itération 1 pour ne pas toucher les 3 plus anciens. Voir S6.

## Suggestions (non bloquantes)

**S1. Coupe après le trait d'union des verbes à pronom dans le défi** (`premium-375-retour-exercice.png`, `visiteur-768-etape1.png`)
- Symptôme à 375 : « Choisis- / en une et écris-la… », « relis- / les », en fin de ligne. À 768 la coupe tombe bien, c'est un défaut mobile.
- Correction : `apps/web/src/lib/fr-typo.ts` (`frTypo`) : insérer U+2060 (WORD JOINER, invisible, indépendant de la police) après le trait d'union dans `(\p{L}+)-(en|y|la|le|les|lui|moi|toi|nous|vous|leur)`. Éviter U+2011 (certaines polices n'ont pas le glyphe). Aucun texte modifié, seulement des caractères de coupe ; à contrôler par le test existant « seules des espaces deviennent insécables ».

**S2. Double cadenas sur l'étape verrouillée par l'ordre conseillé** (`premium-375-etape2-ordre-conseille.png`)
- Symptôme : un cadenas dans le rond à gauche et un second à la place du chevron à droite. Ils disent la même chose.
- Correction : `parcours-step-card.tsx` (en-tête de l'étape, état « verrouillée par l'ordre ») : garder le rond à gauche, retirer l'icône de droite, ou la remplacer par le chevron. Le texte « Termine l'étape 1 pour débloquer » suffit.

**S3. « En » seul en fin de ligne devant « 6 semaines »** (`visiteur-375-page-haut.png` ; idem Répartie `repartie-375-visiteur-page-haut.png`)
- Symptôme : « …gardée pour toi. En / 6 semaines, tu apprends… ». « 6 semaines » est insécable, mais « En » reste à part sur 2 parcours en ligne et sur Boulot.
- Correction : `frTypoTexte` (`lib/fr-typo.ts`) : lier `\bEn (\d+) ` par une espace insécable. Cosmétique.

**S4. Carte de progression en erreur : ligne XP orpheline** (`premium-375-erreur-chargement.png`)
- Symptôme : sous l'alerte « Ta progression est intacte. », il reste « 700 XP au total, dont 100 de bonus à la dernière étape », aligné à droite sur 2 lignes, sans barre ni contexte.
- Correction : `parcours-detail.tsx` (carte de progression) : ne pas afficher cette ligne tant que le chargement a échoué, ou l'aligner à gauche (`text-left`). Alerte lisible (rouge sur fond sombre, contraste correct), bouton « Réessayer » de 44 px : à garder.

**S5. « 700 XP au total » prête à confusion pendant le parcours** (`premium-375-page-haut-progression.png`)
- Symptôme : avec 2 étapes validées sur 6 (125 XP gagnés), la ligne sous la barre se lit comme « j'ai 700 XP ». Hérité des autres parcours, déjà signalé en itération 1.
- Correction : microcopy neuf, donc à valider par Thomas avant code : « 125 XP gagnés sur 700, bonus de fin compris ». Si non validé, ne rien changer.

**S6. Défi en gras et exemple en paragraphes : à étendre aux 3 parcours plus anciens plus tard**
- Constat : `regression/*-premium-etape2.png` (Confiance, Répartie, Machine à Café) gardent « DÉFI FAIT DIVERS : » au même poids que le reste. Choix assumé de ne pas toucher aux parcours en ligne ; l'écart se verra si un abonné enchaîne Storytelling puis Confiance.
- Correction éventuelle : retirer la condition `typoFr` sur `decouperDefi` et `lignesExemple` (`parcours-step-card.tsx`), après captures des 3 parcours. Décision Thomas, pas avant le déploiement de Boulot.

**S7. Rappel de ce qui reste hors périmètre** : kicker « PARCOURS STORYTELLING · 6 SEMAINES » sur 2 lignes à 375 (même rendu que s18, `visiteur-375-etape1` s18) ; refrain « Avant de la sortir, un seul test… » dans les 6 scènes et défis longs (étapes 2 et 6) à signaler à @copywriter ; quiz d'orientation sans entrée Boulot (N5 @ux, à Thomas).

## Pour le 10 / 10 de la non-régression

1. BR1 : 4 captures d'aperçu ouvert (2 parcours, 375 et 1280) et 2 captures Premium « en cours » en 375, relues.
2. Facultatif : S1 à S4 en une passe sur `fr-typo.ts`, `parcours-step-card.tsx`, `parcours-detail.tsx` ; si fait, re-capturer `premium-375-retour-exercice` et `premium-375-etape2-ordre-conseille`.

---
**Handoff → @orchestrator (puis @fullstack pour les recaptures de BR1 et les suggestions retenues)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-2-design.md`
- Décisions : Boulot 10/10 (aucun bloquant, B1, B2, N1 à N4 corrigés et prouvés, 💼 confirmée) ; non-régression 9,3/10 (aucune régression vue, 1 bloquant de preuve BR1) ; 7 suggestions S1 à S7
- Points d'attention : aucun token modifié, aucun code modifié, aucun texte validé touché ; BR1 = captures manquantes (aperçu 2+ ouvert sur Répartie ou Confiance et Storytelling en 375 et 1280, haut de page Premium en cours sur 2 parcours en ligne) car `step-blocks.tsx` et `parcours-detail.tsx` sont communs ; S5 est une microcopy neuve à valider par Thomas ; ne rien déployer sous `BOULOT_PUBLIE = true` sans ce feu vert
---
