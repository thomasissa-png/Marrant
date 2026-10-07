# Itération 4 : notation visuelle @design (s17, 07/10/2026)

Base : `docs/qa/captures-parcours-apprentissage-s17/iter-4/` (24 captures lues sur 219 : validation-echec-vue x3, survols x10 avec leur `-repos`, chargement-inconnue x3, echec-reessayer x3, echec-arrivee x3, focus-apres-valider, chargement 768). Comparé à `iter-3-design.md` et à la section « Tour 3 » de `iter-1-corrections.md`. Lecture du rendu réel, aucun code lu. Textes validés non jugés. Mesures @qa (style calculé) reprises pour le survol.

## Statut des DES-3-NN

| Écart | Statut | Capture / constat |
|---|---|---|
| 3-01 échec de validation non prouvé | Réglé | `p-375/768/1280-validation-echec-vue` : message « La connexion a lâché en route. Vérifie ton réseau et réessaie. » dans la carte, bloc `border-l-2` rouge sur fond teinté, texte rouge clair lisible, juste au-dessus de « Valider cette étape » (plein, 44 px, pleine largeur). Quiz bouclé conservé au-dessus. 2 lignes à 375, 1 ligne à 768/1280. Rien ne se chevauche |
| 3-02 survols invisibles | Réglé pour l'essentiel (3 sur 5), 2 absents | Visibles : `p-1280-survol-option-quiz` (contour violet net sur B, les 3 autres sans, comparé à `-repos`) ; `v-1280-survol-voir-offre` (fond teinté violet, discret mais lisible face à `-repos`) ; `p-1280-survol-valider` (violet assombri `#7C3AED` vers un violet plus profond, delta faible mais net sur la paire). Absents : `survol-entete-etape` et `survol-rappel`, identiques à leur `-repos` (en correction, voir plus bas) |
| 3-03 cadrage chargement / échec | Réglé | `p-375/768/1280-etape-chargement-inconnue` : carte de progression entière, barre grise neutre (2 barres grises, aucun « 0/N », aucun violet), texte « Chargement… », carte d'étape 2 ouverte avec squelette 3 lignes, étapes 3-4 repliées. `p-375/768/1280-etape-echec-reessayer` : « 1/4 étapes complétées » barre violette gardée, ligne neutre dessous, bloc d'échec de l'étape complet (« Ta progression est intacte. » en gras, message, « Réessayer » contour 44 px) |
| 3-04 états sans capture à 768 | Réglé | `p-768-etape-chargement`, `-chargement-inconnue`, `-echec-reessayer`, `-validation-echec-vue` fournis, rendu cohérent avec 375 et 1280 |
| 3-05 focus après valider | Réglé | `p-1280-focus-apres-valider` : anneau de l'en-tête de l'étape 2 à ≈ 4 px du bloc « Pourquoi cette étape ? » (il touchait avant), « Le programme » entier sous la barre, carte validée avec « +50 XP gagnés ! » et la date juste dessous |
| 3-06 deux « Réessayer » | Réglé | Un seul « Réessayer » dans la carte d'étape (375/768/1280) ; en haut, ligne neutre sans bouton ni rouge |

## Défauts trouvés ce tour (déjà en correction, non recomptés)

- **Arrivée par ancre à 768** (`p-768-etape-echec-arrivee`) : seul « Réessayer » apparaît sous l'en-tête fixe, le titre de l'étape et le message sont coupés. À 375 et 1280 le même état est correct (message entier, bouton, étapes verrouillées dessous). Défaut de calage de défilement, propre à 768 : le message reste annoncé au lecteur d'écran mais invisible à l'œil.
- **Survol de l'en-tête d'étape et de l'interrupteur du rappel** : aucun changement entre survol et repos.
- Point de méthode : `p-1280-survol-rappel(-repos)` montrent déjà l'anneau de focus (Tab utilisé avant), qui masque tout survol. Re-prouver à la souris seule, sans Tab, sinon la capture restera indécidable.

## Notes /10

| Critère | T2 | T3 | T4 | Pourquoi |
|---|---|---|---|---|
| Cohérence design system | 9 | 10 | 10 | Rien hors tokens vu, même gabarit d'alerte en carte et en page |
| Hiérarchie visuelle | 9 | 10 | 10 | Une seule action pleine par état (Valider, ou Réessayer en contour) ; échec lisible sans concurrencer le CTA |
| Espacements / alignements | 9 | 9,5 | 10 | 0 px du focus corrigé (3-05), alerte à 8 px du bouton, colonnes alignées |
| Typographie / lisibilité | 9 | 10 | 10 | Messages d'échec en 14-16 px, contraste confortable, aucune troncature hors 768 ancre |
| Couleurs / contrastes AA | 8,5 | 10 | 10 | Rouge clair sur fond teinté lisible (5,4:1 mesuré), barre neutre sans violet |
| États | 8 | 9 | 9 | Échec de validation, chargement inconnu, échec, focus : prouvés. Survol : 3 sur 5, en-tête et interrupteur absents |
| Composants nouveaux | 9 | 10 | 10 | Squelette, bloc d'échec, interrupteur, quiz : finis |
| Responsive 375/768/1280 | 9 | 9,5 | 9,5 | 768 désormais couvert partout, sauf l'arrivée par ancre qui coupe le message |

**Note globale : 9,8/10** (6, puis 8,5, puis 9,5). Les trois preuves que j'avais conditionnées sont là : message d'échec de validation lisible aux 3 devices, survol visible (option de quiz, offre, Valider), barre de progression neutre à l'écran. Je ne mets pas 10 car deux survols sont réellement absents et l'arrivée par ancre à 768 cache le message : ce sont des défauts de rendu observés, pas des défauts de preuve.

## Pour le 10

La correction en cours suffit, à une condition : elle doit être prouvée par capture, pas par le code.
1. Survol de l'en-tête et de l'interrupteur : une paire survol / `-repos` où l'écart se voit à l'œil (fond `background-elevated` sur l'en-tête, contour ou piste plus claire sur l'interrupteur), prise à la souris seule, sans focus clavier.
2. `p-768-etape-echec-arrivee` : titre de l'étape et message d'échec entiers sous l'en-tête fixe, comme à 375 et 1280. Vérifier aussi un 640 ou 1024 (le défaut dépend de la hauteur de page, il peut se déplacer).
3. Si ces 3 captures passent : 10/10, sans autre changement. Rien de ce qui reste ne bloque la mise en ligne : aucun contraste, aucune troncature, aucun état cassé en usage normal.

Hors périmètre, à noter : au pied de page à 1280, la colonne « Produit » se répartit sur deux sous-colonnes et la 4e colonne reste vide (`p-1280-validation-echec-vue`). Pas touché par le parcours, à regarder après la mise en ligne.
