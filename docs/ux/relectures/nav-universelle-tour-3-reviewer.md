# Relecture à l'aveugle, tour 3 : `docs/ux/navigation-universelle-s24.md` v3 (@reviewer, 14/11)

**Note : 9/10** (tour 2 : 7,5). N1 à N3, D3 et D4 sont corrigées et vérifiées. Il reste une seule faute dure, qui se corrige en deux lignes. Ce que j'ai vérifié : `rubriques.ts:26-77` (types de fiche et parents), `page-header.tsx`, le `py-8` de `(dashboard)/layout.tsx:19`, le budget en pixels de 320 à 1279 px, et le calcul du menu mobile.

## Contrôle des fautes précédentes

| Faute | Verdict | Preuve |
|---|---|---|
| N1 rythme vertical du public | CORRIGÉE | §3 l.76 : haut de page = le `py-8` de `main`, rien n'est ajouté ; le `PageHeader` actuel est repris tel quel (`page-header.tsx:9-11`) ; le critère 4 précise « le haut des pages publiques ne change pas d'un pixel ». C'est le choix demandé. |
| N2 trois touchers sur téléphone | CORRIGÉE | Le menu mobile affiche « Mon espace » puis ses 8 lignes (§1 l.36). Total : 65 + 52 + 44 + 352 = 513 px, moins que 667. Le critère 5 est mesurable de 320 à 414 px. |
| N3 retour vers Aujourd'hui | CORRIGÉE | La table du §4.3 donne le parent par type de page. Elle concorde avec `rubriques.ts` : `situation` et `a-plat` vers Quoi répondre, `jeu` et `seance` vers S'entraîner, `bilan` vers Parcours. Le critère 13 la rend vérifiable. |
| D3 état actif | CORRIGÉE | Le tableau couvre `/favoris` dans les deux états, `/lettre` pour l'abonné, et toute autre adresse. |
| D4 (e) critère 5 | CORRIGÉE | Le critère tient sur ordinateur (Mon espace, puis une ligne de l'index en haut de colonne 2) et sur téléphone (Menu, puis une ligne). |

## Faute dure

**R1. Trois règles se contredisent sur les repères (fil d'Ariane, lien retour) : -1.**
- Le §3 (l.74) donne pour le gabarit C « Repères : aucun ».
- Le §4.3 (l.104) donne « Pages B et C de l'espace : Retour : Mon espace ». Cela inclut S'entraîner (C) et Aujourd'hui (C), qui renverrait vers elle-même.
- Ce même §4.3 ajoute « Retour : Mon espace » sur `/favoris` et `/carnet` pour l'abonné. Or ce sont des pages publiques, et le §3 (« public : repères actuels inchangés ») comme le critère 4 (« le haut des pages publiques ne change pas d'un pixel ») l'interdisent.

Un relecteur ne peut donc pas trancher sur capture.
Correction : remplacer la dernière ligne de la table §4.3 par « Pages B de l'espace (`/mon-espace/*`) : Mon espace. S'entraîner : Mon espace. Aujourd'hui : aucun. » Ajouter : « `/favoris` et `/carnet` gardent leurs repères publics actuels, pour tous les états. » Pour le gabarit C, le §3 doit dire « aucun fil d'Ariane ; S'entraîner porte Retour : Mon espace ».

## Pistes

- P1. Le calcul de 513 px ne compte ni les marges internes du panneau ni le séparateur. Le critère 5 parle de « 568 px de haut » sans préciser si c'est l'écran ou la fenêtre utile du navigateur. Écrire « fenêtre utile (viewport Playwright) de 568 px » et inclure les marges du panneau dans le total.
- P2. Le critère 13 parle de « l'élément allumé de la barre ». Pour une situation, c'est « Mon espace », car Quoi répondre n'est pas dans la barre. Préciser aussi que, dans le menu mobile, c'est la ligne du parent (Quoi répondre) qui s'allume. Sinon, le tableau du §1 ne dit rien des 8 lignes.
- P3. Le §1 l.31 affirme « mesurées : aucun état ne déborde » sans renvoyer à aucune mesure. Écrire « estimé ; vérifié par `header-budget` (critère 6) » tant que le test n'a pas tourné.
- P4. Le critère 10 (« l'accueil vu par un abonné ne lui propose aucun achat ») n'a pas d'action en face, puisque l'accueil est « inchangé ». Les composants `home/*` gèrent déjà le Premium (`premium-cta.tsx`, `carte-premium-achat.tsx`) : écrire « vérification, aucune modification attendue ».
