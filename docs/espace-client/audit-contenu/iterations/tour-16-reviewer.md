# Tour 16, relecture à l'aveugle @reviewer : architecture du contenu (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `docs/espace-client/audit-contenu/architecture-contenu-v16.md` (v16). Référence : dernières lignes de `docs/founder-preferences.md` (12/11). Même grille C1 à C11.

## 1. Statut de mes corrections du tour 14

| T14 | Objet | Statut | Évidence |
|---|---|---|---|
| D1 | Connexion en fenêtre | **Levée** | 4.2 l. 612 : aucune connexion en fenêtre depuis s15, le bouton « Connexion » porte la page d'origine ; puis décision de Thomas (section 8 l. 997). Plus de [À VÉRIFIER] sur la préférence. |
| D2 | État à 0 de la série | **Levée** | 1.1 l. 147 et 4.4 l. 686 : textes validés repris tels quels (`parcours.ts` l. 82 à 84 : singulier, « Ta série démarre à ta prochaine étape. », aide) ; flamme citée (l. 687), laissée à @design pour E5. |
| D3 | Repérage de l'humour noir | **Levée** | 1.1 l. 136 : « aucun champ ne repère les vannes d'humour noir », repérage à créer, au chantier ; annexe B l. 1065. |

## 2. Décisions de Thomas : application fidèle

- **Connexion** (FP l. 168 : « page d'origine, sinon « Aujourd'hui » (au lieu de la liste des vannes) ») : fidèle (résumé l. 8 et 37, 4.2 l. 612, 4.4 l. 676, 6.2 l. 803, 6.3 l. 824, section 8 l. 997). Les options retirées sont bien parties.
- **Caps, noms, mot, seuils, Q4, Q6** : fidèles (1.1 l. 147, 3.1 l. 401, section 8 l. 1000, résumé l. 38).
- **10 XP par conseil retirés pour l'avenir** : fidèle (1.1, 4.4 l. 682, 5.2 l. 746, C4 l. 985). « Livrée au développement avant l'ouverture » : conforme à FP l. 168.
- **Bonus renvoyé au document des niveaux** : fait partout (3.2 l. 407, 4.4 l. 688, 5.5 l. 776 et 784, 7.3 l. 888, 7.3 bis l. 925, section 8). Une exception : 7.4 l. 940, qui propose d'ouvrir l'espace sans le bonus (F4).
- **« Tout ouvert » et « ne débloque rien »** : aucune occurrence sans nuance (« ne débloque rien » : 0 ; « tout ouvert » : l. 17, 38, 159, 776, 1000, toutes nuancées). Conforme.

## 3. Ajouts (mot « pratique », barre à 375 px)

**Ce qui compte comme pratique : le [À VÉRIFIER] se lève** (l. 147, 685, 1060). `recordPractice` et `nextStreak` (`lib/progression.ts` l. 71 et 105) ne sont appelés que par la validation d'étape (`api/parcours/[id]/progress/route.ts` l. 184) et par la fin de quiz d'étape (`api/parcours/[id]/quiz/route.ts` l. 51, Premium, sans XP). C'est exactement l'aide validée.

**Question sur le mot « pratique » (4.4 l. 690, section 8 l. 1003)** : le texte « {n} jours de pratique d'affilée » est un [CHOIX UTILISATEUR] du 07/10 (FP l. 73, recos s17 ; FP l. 71, D3 « streak compté sur la pratique »). Thomas a pris C4 le 12/11 en sachant que l'entraînement ne compte pas pour la série : il n'y a pas de fait nouveau. Reposer la question rouvre un choix documenté (P0 s8), même avec la reco « garder ». La v16 règle déjà l'écart à l'écran (l. 682 : série hors d'« Aujourd'hui », à côté du repère « 12 cartes »). Option C incohérente : « ne pas afficher la série sur « Aujourd'hui » » décrit ce que fait déjà le document (F3).

**Barre à 375 px (6.2 l. 812 à 816)** : le calcul est juste (343 px utiles / 6 = 57 px). Mais FP l. 161 (12/11, [CHOIX UTILISATEUR], Q3 = A) a déjà tranché : « barre de rubriques sous l'en-tête, **défilement au doigt sur téléphone**, 6 entrées au plus ». Deux des trois options posées comme « non tranchées » contredisent cette décision : une rangée basse à deux lignes (la barre n'est plus sous l'en-tête) et un menu qui regroupe les entrées (plus de barre). Seul le défilement est conforme (F1).

## 4. Notes, corrections et verdict

| # | Critère | T14 | T16 | Justification |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 10 | |
| C2 | Respect des décisions | 9 | 9 | La question « pratique » rouvre le texte du 07/10 (F3) |
| C3 | Zéro donnée inventée | 9 | 10 | D1 et D3 levées par le code ; textes de la série exacts |
| C4 | Rubriques | 10 | 8 | Options de la barre à 375 px contraires à Q3 = A (F1) |
| C5 | Ambition | 10 | 10 | |
| C6 | Cohérence | 10 | 8 | Cap « en tête de Parcours » contre le document des niveaux (F2) ; bonus à l'ouverture (F4) |
| C7 | Faisabilité | 10 | 10 | |
| C8 | Décisions et reste à trancher | 9 | 9 | Deux points « à trancher » déjà tranchés (barre, mot « pratique ») |
| C9 | Exemples | 10 | 10 | |
| C10 | Progression | 10 | 10 | |
| C11 | Pertinence pour l'audience | 10 | 10 | |

**Note globale : 9,5 / 10** (104 / 110 ; T14 : 9,7). D1 à D3 levées, décisions de Thomas bien reportées ; deux bloquants nouveaux.

1. **F1 (bloquant). 6.2 l. 812 à 816, « trois options sont posées, aucune n'est tranchée ici » (rangée basse à deux lignes, défilement, menu) ; section 8 l. 1003 et annexe B l. 1061.** Problème : Q3 = A (FP l. 161, 12/11) a déjà choisi « barre sous l'en-tête, défilement au doigt sur téléphone ». Correction : « À 375 px, la barre défile au doigt (décision Q3 = A, FP l. 161) : l'entrée active est toujours ramenée dans la zone visible, et le premier écran montre « Aujourd'hui » ; @ux et @design dessinent les libellés (longueur, coupure) dans ce cadre. » Retirer la rangée basse et le menu ; garder le test des deux tâches à 375 px, 200 % et au clavier, et le retirer de « Ce qui reste à trancher ». **Bloquant : oui** (choix documenté remis en question, P0 s8).
2. **F2 (bloquant). 4.4 l. 684 à 689, « La série et le cap : en tête de « Parcours » » ; « Le cap … s'affiche à côté de la série » ; aussi l. 9, 88, 769, 804, 825.** Problème : `niveaux-xp-s24.md` (3.0, « Place dans l'espace ») place le cap « dans « Parcours », **après les étapes faites (jamais en tête**, donc distinct du calendrier « Tes 4 premières semaines ») », et la v16 l. 769 met justement le cap en tête, au-dessus de ce calendrier. La v16 dit elle-même que l'affichage du cap relève du document des niveaux (l. 688). Correction : « Le cap : dans « Parcours », après les étapes faites, selon `niveaux-xp-s24.md` 3.0 (jamais en tête) ; la série reste en tête. » Corriger les lignes citées et la mise en page à 375 px (l. 689 : la série seule en tête). **Bloquant : oui** (deux livrables contradictoires sur le même écran).
3. **F3. 4.4 l. 690 et section 8 l. 1003, question « on le garde tel quel ? ».** Problème : voir section 3. Correction : remplacer la question par un fait : « Le texte validé le 07/10 (FP l. 73) reste inchangé : la série compte les étapes et les quiz (`progress/route.ts` l. 184, `quiz/route.ts` l. 51), la rafale a son propre repère (C4) ; aucune question. » Lever en même temps le [À VÉRIFIER] de l. 147, 685 et 1060. **Bloquant : non.**
4. **F4. 7.4 l. 940, « l'ouverture de l'espace ne l'attend pas si Thomas ne l'exige pas [RESTE À TRANCHER] ».** Problème : tout est ouvert (18/10) et une étape se valide en un clic, donc un cap peut être atteint dès le premier jour, et les abonnés actuels sont recalculés à l'ouverture. Un espace ouvert sans bonus aurait des caps qui ne débloquent rien, contre Q5, et ouvrirait par morceaux, contre « tout part d'un coup » (section 8 l. 1001). Correction : « Le contenu bonus fait partie de l'espace et part avec lui (déploiement d'un coup) ; nature et volume dans `niveaux-xp-s24.md` », et retirer le [RESTE À TRANCHER]. Même point que mon E2 du tour 7 sur les niveaux. **Bloquant : non** (dépend du document des niveaux).

**Conditions du 10/10** : F1 et F2, puis F3 et F4, puis un contrôle par Grep (« rangée basse », « menu qui regroupe », « en tête de « Parcours » » à côté de « cap », « on le garde », « ne l'attend pas »). **Verdict : NO-GO tant que F1 et F2 ne sont pas corrigés** (deux retouches courtes, aucun total touché).
