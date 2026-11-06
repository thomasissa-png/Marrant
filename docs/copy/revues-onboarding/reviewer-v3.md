# Contrôle ciblé : étalons onboarding s23, reprise O11 à O13 et S11 à S14 (reviewer v3, 06/11/2026)

Périmètre limité (v2, l. 70) : passages repris dans `etalons-onboarding-s23.md`, comparés mot pour mot à `reviewer-v2.md`, plus la reco de l'étalon 5. Sources revérifiées : `paiement.ts:285` (`dateLongue(prochain)` présent), `:287` (ligne « Résilier »), `:293` (« Pour démarrer, choisis un parcours »). Grep tiret cadratin sur le pack : 0.

## Points vérifiés

| # | Pack | Mot pour mot | Logique | Tiret / promesse | Verdict |
|---|---|---|---|---|---|
| O11 variantes étalon 3 | l. 77 | oui | oui : la règle « sans carnet » et la règle S10 « avec carnet » ne se contredisent plus | 0 / aucune | PASS |
| O12 bloc « Ensuite » 2 C | l. 65 + note l. 67 | oui (avec S12 intégré dans la parenthèse) | 4 cas rendus vérifiés (avec ou sans carnet, avec ou sans question) : jointure correcte avec la règle du « et » | 0 / aucune | PASS |
| O13 texte 5 C | l. 144 + note l. 146 | oui | « résilier la veille » évite le prélèvement ; date = `dateLongue(prochain)` (`paiement.ts:285`) | 0 / aucune | PASS |
| O13 motif de C | l. 147 | « C est la plus douce », sans « acquise » | oui | 0 | PASS |
| S11 ligne sous étalon 2 | l. 68 | sens repris, une ligne | oui (`paiement.ts:293` vérifié) | 0 | PASS |
| S12 rappel + motif de l'écart | l. 65, l. 67 | oui | motif « concision » corrigé | 0 | PASS |
| S13 texte 5 B | l. 141 | oui | oui | 0 / aucune | PASS |
| S14 motif de A | l. 147 | oui | oui | 0 | PASS |
| Reco étalon 5 | l. 147 | sans objet | **non** : « la seule à dire jusqu'où » est faux depuis O13 (C écrit la date en clair) | 0 | **FAIL (O14)** |
| Libellés étalon 5 | l. 140, l. 149 | sans objet | **non** : « B. Avec la date » alors que depuis S13 B renvoie à la date et que C la contient | 0 | **FAIL (O15)** |

## Point à trancher : B ou C pour l'étalon 5

La reco B ne tient plus. Son motif (« la seule à dire jusqu'où rien ne presse reste vrai ») est faux : depuis O13, C borne la promesse avec la date. Sur le fond, C répond mieux à la peur du persona, qui est d'oublier : la date est sur la ligne même, alors que B oblige à remonter la chercher dans le bloc. C ne promet rien de plus que B (même borne, même « résilier la veille »). B garde « Rien ne presse », la formule de Thomas : c'est le repli. Erreur de ma v2 : en proposant S13, je n'ai pas réajusté la reco.

## Corrections obligatoires restantes (texte exact)

**O14. Remplacer la ligne de reco l. 147 par**
> **Reco : C**, parce qu'elle écrit la date en clair sur la ligne même : l'abonné qui a peur d'oublier lit d'un coup jusqu'à quand tout reste ouvert et qu'il pourra encore résilier la veille, sans remonter chercher la date. B dit la même chose en renvoyant à la date écrite plus haut, et garde le « rien ne presse » de Thomas : c'est le repli. Aucune des trois ne promet plus que la période payée, ce qui serait faux après un renouvellement (le remboursement sous 14 jours ne vaut que pour le premier paiement, 07/10). A redit presque mot pour mot la phrase légale juste avant, et donne la raison de résilier tout de suite sans rien perdre.

**O15. Libellés.** l. 140 : `**B. Avec la date comme repère**` devient `**B. Renvoi à la date écrite plus haut**` ; l. 143 : `**C. Prends ton temps**` devient `**C. Prends ton temps, date en clair**` ; dans la question l. 149, « B (avec la date) ou C (prends ton temps) » devient « B (renvoi à la date) ou C (prends ton temps, date en clair) ».

## Souhaitable (non bloquant)

- S15. l. 77 : la phrase « on remplace la phrase et le lien par la variante sous l'option » est redite juste après par « La variante remplace la phrase du carnet et son lien ». Supprimer la première. Préciser aussi la portée du texte « sans carnet, rien commencé » : ajouter « (même portée que la variante) » après « {url}/parcours » ; sinon, en A, la scène « Le carnet part de ces moments-là » resterait devant un lien de parcours. Manque de ma v2, à régler à l'écriture de E1 au plus tard.

## Note

| Critère | v2 | v3 tel quel | Après O14-O15 |
|---|---|---|---|
| 1 Options utilisables, différentes | 8,5 | 9 | 9 |
| 2 Exactitude | 8,5 | 9 (motif de reco faux) | 9,5 |
| 3 Ton d'Alex, zéro tiret cadratin | 9 | 9 | 9 |
| 4 Cadre légal B | 9 | 9,5 | 9,5 |
| 5 Recos, questions | 9 | 8 (reco 5, libellés) | 9 |
| 6 Rétention sans pression | 8,5 | 9 | 9 |
| **Globale** | **8,5** | **8,5** | **9** |

**Décision : O11, O12, O13 et S11 à S14 sont repris, PASS.** Restent O14 et O15, qui sont des textes exacts sur les lignes 140, 143, 147 et 149. Une fois repris mot pour mot (vérification par Grep, sans nouvelle relecture), le pack est à 9 : GO pour présentation à Thomas. En l'état : NO-GO, parce que la reco présentée à Thomas s'appuie sur un motif faux.
