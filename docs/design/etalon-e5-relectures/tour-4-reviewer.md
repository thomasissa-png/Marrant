# E5, vérification finale, tour 4 : @reviewer (cohérence et exactitude)

> 12/11/2026. v7 relue contre `tour-3-reviewer.md`. Lus : `etalon-e5-s24.md` §0 v6 à v7, `docs/copy/libelles-espace-e5-s24.md`, relectures des libellés (tours 1 à 3), les 7 HTML (Grep des libellés), `lettre-hebdo-s21.ts`, `abonnement-vente.ts`, seed l. 631-644, architecture 3.10 l. 539. Captures : Aujourd'hui habitué 375, Mes questions `termine`.

## Notes
| Critère | T1 | T2 | T3 | T4 |
|---|---|---|---|---|
| Cohérence | 6 | 8 | 9 | 10/10 |
| Exactitude des textes | 8 | 9 | 9 | 9/10 |
| Fidélité aux décisions | 8 | 9 | 9 | 9/10 |
| Complétude (ligne E5) | 5 | 6 | 8 | 9/10 |

## Fautes du tour 3 : toutes levées
- **T1** : texte réel `BIENVENUE_PREMIUM.favori`, avec ses 3 variantes (`aujourdhui.html` l. 217, 463).
- **T2** : repli « Continuer » vers Aujourd'hui (`succes.html` l. 86).
- **T3** : « terminé » rendu sous « Mon profil », sans barre ni cloche, avec l'adresse de l'équipe (capture conforme).
- **T4** : mission marche 2 et bilan écrits en entier.
- **T5** : accroche unique, A retenue.
- **T6** : lettre du jeudi, 3 variantes mot pour mot de `lettre-hebdo-s21.ts` l. 41-48.

## Maquettes contre le fichier de libellés : mot pour mot
Conformes : l'accroche (115 caractères), « Les cartes du jour » collé sous « Si tu as 5 minutes », la ligne 4, les lignes 6, 16, 17, 20 à 24, le calendrier (4 lignes, préfixe « Semaine n : » en gras), le v6, l'énoncé de mission, les suites « ça a marché » et « bof », la scène, le contexte, A, B et C (identiques au seed l. 641, 642, 644) et le retour du bilan. Les « » internes sont de premier niveau, avec espaces insécables.

## Fautes restantes
| # | Fichier / état | Faute | Correction |
|---|---|---|---|
| F1 | `mission.html` l. 214, `#etat=bilan&choix=A` ou `C` ; libellés §5 | « L'étape « Énoncer la règle non écrite » » est faux : c'est le titre de la **fiche** (`tipTitle`, seed l. 631). L'étape 1 de Confiance s'appelle « Redécouvrir ce qui te fait rire » (`parcours-etapes.ts` l. 32, seed l. 634), et 3.10 dit « renvoie vers la **fiche** à revoir » | « La fiche « Énoncer la règle non écrite » mérite un deuxième tour. » (copy, puis maquette ; repasse à l'aveugle, règle P0 s18) |
| F2 | `libelles-espace-e5-s24.md` l. 1 et 5 ; demande de la session | En-tête « tour 3 » et « non relu à l'aveugle sur cette version », alors que la section 8 (tour 4) a changé l'accroche, la ligne 25 et le bilan. Les relectures n'existent que pour les tours 1 à 3 (notes de 8 à 10) : « relus en 4 tours » est inexact, et la version intégrée n'a pas été relue | Une relecture à l'aveugle courte des lignes du tour 4, plus F1. Sinon, appliquer C8 (4 tours au plus) : Thomas voit la version et les notes (bilan 8 chez la critique), et l'en-tête du fichier dit l'état réel |
| F3 | `carte-rafale.html`, carte « Et toi ? » | Encore entre crochets alors que la ligne E5 la demande. Le carnet publié existe (`docs/copy/carnet/carnet-2026-10.md`) et 2.2 interdit tout texte neuf sur cette carte : une fiche se reprend telle quelle, sans écriture ni relecture | Reprendre une fiche du carnet d'octobre mot pour mot (scène, réponse « détendue », sortie polie « tendue », pourquoi) |
| F4 | `succes.html` l. 121-123 | Apostrophes droites dans la ligne de la lettre, typographiques dans le reste de la carte. Le code passe la ligne par `frTypo` | Apostrophes ’ dans les 3 variantes (mineur) |

Non bloquants, déclarés et acceptés : l'énoncé de la marche 1 (E5 demande une mission, la marche 2 suffit), le [PISTE] de 2.6, les données entre crochets, « 5 min » et « Mon profil » à confirmer par Thomas, tout à remesurer à 320 px et sous 300 px.

## Verdict
NO-GO pour 10/10, GO après F1 à F3 (F4 mineur). Ce qui reste, c'est du texte et de la procédure, pas du design : F1 et F2 vont au @copywriter, puis une relecture à l'aveugle courte ; F3 et F4 vont au @design (reprise sans écriture).
