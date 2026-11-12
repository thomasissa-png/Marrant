# Niveaux et XP, tour 4 : relecture à l'aveugle de la v4 (@elon)

> AVIS CONSULTATIF. Relecteur indépendant, à l'aveugle. Lu : `niveaux-xp-s24.md` v4 (résumé, 2.6, 3.3 à 3.6, Q1 à Q6, annexe A). Vérifié : `conseils-list.tsx` l. 107 à 109, l'XP des conseils n'est gagné que dans la liste, pour un abonné Premium connecté. Ce fait, nouveau dans le résumé, est exact.

## Statut de mes corrections du tour 3

| # | Correction T3 | Statut | Passage qui le prouve |
|---|---|---|---|
| Y1 | Reco justifiée par C4, argument d'adoption retiré | OK | 3.5 : « La raison de la règle A : elle respecte la lettre et l'esprit de C4 [...] Je ne retiens pas d'argument d'adoption : le premier pas est déjà un geste de marche 1 avec retour » ; 3.3 limite (4) devenue un [À VÉRIFIER] honnête ; Q2 A et C réécrites. |
| Y2 | « Tu es bien parti » au cap 3 | OK | Table 3.4 et Q3 ; « Tu as pris ton rythme » gardé en témoin, avec la raison. |

Bilan sur 2 : 2 OK.

## Ce qui est nouveau

- **« cap » contre « palier »** : bon travail. Le document trouve que l'article public sur la timidité emploie déjà « palier » pour l'échelle d'exposition, avec « Chaque palier est un niveau à débloquer », ce qui contredit Q5 A. La reco « cap » est donc la bonne, et l'option « palier seulement pour la règle C » est astucieuse.
- **Audit des comptes (2.6) et Q6** : c'est ici que se trouve la seule faute du tour (Z1, Z2).

## Notes

| Critère | T3 | T4 | Justification |
|---|---|---|---|
| Valeur persona | 10 | 10 | Inchangée ; résumé en « points », sans jargon. |
| Ambition | 10 | 10 | Inchangée. |
| Exactitude | 9 | 9 | 2.6 : « Un total qui n'est pas un multiple de 5 prouve l'usage de l'API ». Ce n'est pas prouvé (Z1). |
| Respect des décisions | 10 | 10 | Q6 n'abaisse rien sans l'accord écrit de Thomas, compte par compte. |
| Questions à Thomas | 9 | 9 | La reco de Q6 (B) ajoute un processus et un risque d'injustice pour un bénéfice nul (Z2). |

**Note globale : 9,6 / 10.**

## Corrections

Z1. **[NON BLOQUANT, nécessaire pour 10] « Pas un multiple de 5 » est un indice, pas une preuve (2.6, Q6).**
- Passage : « toutes les sources honnêtes sont des multiples de 5 [...] Un total qui n'est pas un multiple de 5 prouve l'usage de l'API ».
- Problème : c'est vrai pour le code d'aujourd'hui, pas forcément pour son passé. Le document lui-même cite `progression-levels.md`, qui décrit « +2 par blague lue » et « +5 par connexion » : si l'un de ces gains a existé dans une version antérieure, un abonné honnête a un total impair. Or la base ne garde que le total. Puisque la reco B propose de **baisser l'XP d'un abonné payant** sur cette « preuve », il faut qu'elle en soit une.
- Correction : écrire « indique » au lieu de « prouve », sauf si l'historique du dépôt montre qu'aucun appel à `addXp` n'a jamais utilisé un montant qui ne soit pas un multiple de 5 (une recherche dans l'historique git suffit ; à confier à @fullstack avant l'audit).

Z2. **[NON BLOQUANT, avis] Q6 : supprimer le processus plutôt que l'outiller (2.6, Q6).**
- Passage : Q6 B, « ne rien baisser, sauf tes comptes de test et les comptes où l'usage de l'API est prouvé, compte par compte avec ton accord ».
- Problème, par principes premiers : un cap ne débloque rien (Q5 A), n'est visible de personne d'autre et ne donne aucun rang. Un tricheur ne trompe que son propre écran. Avec 4 abonnés actifs, un audit, une liste montrée en session et une décision compte par compte, c'est un processus dont le gain est nul et dont le risque (pénaliser à tort un payant) est réel. C'est l'étape 2 de l'algorithme : supprimer avant d'optimiser.
- Correction : reco Q6 = « remettre à zéro les comptes de test de l'équipe, ne toucher à aucun compte d'abonné ; les caps se recalculent vers le haut ». Garder l'audit seulement comme vérification que la correction 2.5 fonctionne, sans décision par compte. Si Thomas veut plus, l'option B reste disponible.

## Verdict

Après Z1 (un mot) et Z2 (une reco), le document est à 10 de mon côté. La reco principale (Q1 B, règle A justifiée par C4, noms E1, « cap », rien de débloqué) tient.

---
**Handoff → session principale** : `docs/espace-client/niveaux-xp-iterations/tour-4-elon.md` ; 9,6/10, Y1 et Y2 OK. Z1 : « un total qui n'est pas un multiple de 5 prouve l'usage de l'API » n'est pas prouvé, puisque des gains anciens comme +2 par blague ont pu exister ; écrire « indique », sauf preuve dans l'historique git. Z2 : supprimer l'audit compte par compte, sans gain puisqu'un cap ne débloque rien et que personne ne voit celui des autres ; reco Q6 = remettre à zéro seulement les comptes de test. Ce sont des AVIS : Thomas décide.
---
