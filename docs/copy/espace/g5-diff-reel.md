# Carnet, porte G5 : diff réel des corrections appliquées (P0 s11)

> @fullstack, 13/11/2026, lot D5b. Source des corrections : `docs/copy/espace/g5-corrections-carnet.md` (sections A, B, C ; dernier texte de chaque ligne, tours 2 et 3 et clôture compris), validées par Thomas le 13/11 (`docs/founder-preferences.md`). Fichiers : `apps/web/src/data/carnet/2026-10.json`, `apps/web/src/data/carnet/2026-11.json`. Rien commité.

## Méthode
- Application par script : le tableau est lu tel quel (fichier, `fiches[index]`, champ, texte actuel, texte corrigé). Pour chaque ligne, le script vérifie que `id` = `2026-<fiche>` et que le texte actuel est trouvé **mot pour mot** dans le JSON avant de le remplacer. Résultat : **42 lignes sur 42 trouvées, 0 écart**, aucune ligne sautée.
- Mesure : diff de mots (plus longue sous-suite commune) champ par champ, entre `git show HEAD:` et le fichier corrigé. Un segment modifié compte pour max(mots supprimés, mots ajoutés), c'est-à-dire une fois par position, comme l'estimation de la section E. Champs comptés : `titre`, `accroche`, `situation`, `onTeDit`, `reponse`, `pourquoi`, `siTendu`, `exercice`.
- Format du JSON conservé (même indentation, même fin de fichier) : `git diff --stat` = 42 lignes retirées, 42 ajoutées, une par champ corrigé.

## Résultat
| Mesure | Valeur |
|---|---|
| Fiches touchées dans le JSON | 27 (14 d'octobre, 13 de novembre) ; la 28e, 11-29, est corrigée dans le code, JSON inchangé |
| Champs modifiés | 42 |
| Mots des 27 fiches touchées | 3 774 |
| Mots supprimés / ajoutés | 234 / 237 |
| **Mots changés (une fois par position)** | **332, soit 8,80 %** |
| Hors 11-22 (réécrite avec une idée neuve, 126 mots changés sur 159) | 206 sur 3 615, soit 5,70 % |
| Rapporté au carnet entier (45 fiches, 6 552 mots) | 5,07 % |
| Avec 11-29 au dénominateur (28 fiches, 3 932 mots) | 8,44 % |

Estimation de la section E : environ 10 % (7 % hors 11-22), sur environ 4 050 mots. Le réel est plus bas (8,8 % et 5,7 %) : le texte annoncé par le document ne surévalue pas son ampleur.

## Par fiche (mots changés / mots de la fiche)
| Fiche | Champs | Changés | Taux |
|---|---|---|---|
| 10-01 | 1 | 8 / 114 | 7,0 % |
| 10-02 | 1 | 8 / 124 | 6,5 % |
| 10-03 | 1 | 7 / 116 | 6,0 % |
| 10-04 | 2 | 28 / 117 | 23,9 % |
| 10-05 | 1 | 5 / 126 | 4,0 % |
| 10-06 | 1 | 10 / 109 | 9,2 % |
| 10-07 | 1 | 5 / 117 | 4,3 % |
| 10-08 | 1 | 9 / 126 | 7,1 % |
| 10-09 | 2 | 12 / 116 | 10,3 % |
| 10-10 | 1 | 3 / 108 | 2,8 % |
| 10-12 | 1 | 3 / 120 | 2,5 % |
| 10-13 | 1 | 12 / 123 | 9,8 % |
| 10-14 | 1 | 9 / 113 | 8,0 % |
| 10-15 | 2 | 10 / 130 | 7,7 % |
| 11-04 | 3 | 8 / 177 | 4,5 % |
| 11-05 | 1 | 9 / 162 | 5,6 % |
| 11-08 | 1 | 7 / 160 | 4,4 % |
| 11-11 | 1 | 5 / 163 | 3,1 % |
| 11-14 | 1 | 3 / 148 | 2,0 % |
| 11-17 | 1 | 5 / 169 | 3,0 % |
| 11-18 | 1 | 1 / 167 | 0,6 % |
| 11-19 | 1 | 1 / 133 | 0,8 % |
| 11-21 | 4 | 10 / 185 | 5,4 % |
| 11-22 | 6 | 126 / 159 | 79,2 % |
| 11-24 | 1 | 2 / 166 | 1,2 % |
| 11-27 | 2 | 16 / 145 | 11,0 % |
| 11-30 | 2 | 10 / 181 | 5,5 % |

## Intouchables, vérifiés par le script
- `id` des 45 fiches : inchangés (donc slugs, ancres `#fiche-<id>` et URL `/carnet/<mois>` inchangés) ; aucune fiche ajoutée ni retirée, ordre et clés identiques.
- `contexte`, `offerte` (10-15 et 11-10 restent les fiches offertes) : inchangés ; `mois`, `titre` et `intro` des deux carnets : inchangés.
- Liens : aucun lien dans les champs modifiés, avant comme après.
- Chiffres : la suite des nombres de chaque champ modifié est identique avant et après (aucun chiffre touché).
- Seul titre changé : 11-21 (« Le premier arrivé au pot » devient « En avance au pot »), décision de la session ; Grep : la chaîne n'existe dans `src/` que dans le JSON.
- Zéro tiret cadratin et zéro guillemet droit dans les lignes ajoutées.

## Visibilité
Le carnet est une page publique déjà en ligne (`/carnet`, `/carnet/2026-10`, `/carnet/2026-11`, extrait de l'accueil, démonstration du blog sur la fiche offerte) : ces textes changent **dès le déploiement unique**, sans dépendre de l'interrupteur de l'espace. La fiche offerte 10-15 change (`siTendu`, `pourquoi`) ; la démonstration du blog n'en lit que `accroche` et `onTeDit`, inchangés.
