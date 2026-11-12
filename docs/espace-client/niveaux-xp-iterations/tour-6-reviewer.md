# Tour 6 (confirmation), relecture à l'aveugle @reviewer : niveaux et XP (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `docs/espace-client/niveaux-xp-s24.md` v6 (NX6). Même grille qu'aux tours 1 à 5.

## 1. Statut de D1 à D4

| N° | Statut | Évidence |
|---|---|---|
| D1 (« règle d'hier ») | **Levée** | Q6 l. 256, titre « … gagnés avant la livraison de la correction ? » et « la règle actuelle repaie à chaque visite, jusqu'à la livraison de la correction » ; 2.6 l. 122 « que le site paie de lui-même tant que la correction n'est pas livrée ». Plus aucun « hier » ni « payait » dans le document. |
| D2 (« 18 étapes environ ») | **Levée** | Q4 A l. 247 « au moins 18 étapes ». |
| D3 (« quel que soit l'ordre ») | **Levée** | 3.1 l. 156 et 3.4 l. 185 : « pour les XP d'étapes et de bonus », un compte qui garde des XP de conseils d'avant la correction peut être plus haut ; Q6 l. 256 : risque d'un cap élevé sans les étapes, Q1 C l'éviterait. |
| D4 (« triche prouvée ») | **Levée** | Note de l'annexe A l. 288 : la reco Q6 de la v4 est remplacée en v5 par l'indice et la reco B. |

## 2. Ce qui a bougé d'autre

Les autres changements viennent du tour 5 de @ux (M1 à M7, annexe A ter l. 317 à 321). Je les ai contrôlés :
- **Parcours publiés** : `STORYTELLING_PUBLIE = true` (l. 12) et `BOULOT_PUBLIE = true` (l. 25) dans `apps/web/src/config/parcours-publication.ts`, lus. 3.0 l. 143 : le test lit les parcours publiés, et le « 18 au minimum » ne vaut que si les cinq sont publiés. C'est juste. Sans Storytelling : 1 600 / 2 300 = 69,6 %, soit « 70 % » ; sans Boulot : 2 400. Total : 2 600 d'étapes + 500 de bonus = 3 100. Tout est exact.
- **Comptes de test** ramenés à la somme de leurs étapes validées et de leurs bonus, au lieu de zéro (résumé l. 10, 2.6 l. 120, 3.0 l. 142, critère l. 214, Q6 B l. 258). C'est cohérent partout et ne touche aucun abonné.
- **Recalcul silencieux** (3.0 l. 142), sans phrase de passage ni événement. C'est cohérent avec « aucune notification liée aux caps ».
- **E2, cap 5 « Tu as fait la plus grande part »** (l. 182 et 242) : au moins 18 étapes sur 25 (72 %), ou 19 par quatre parcours. Le nom est vrai, avec la réserve de D3, et n'a aucun accord de genre.
- **Correction 2.5 « livrée seule et en premier »** (résumé l. 10, 2.5 l. 109). La raison est écrite : la correction ferme une route existante, sans lien avec l'ouverture de l'espace. Ce n'est pas contraire à la décision « tout part d'un coup », qui porte sur l'espace.
- Rien d'autre n'a bougé : grille des seuils, Q1 à Q5, 2.5 points 1 à 6, annexes A et A bis (hors note l. 288), annexe B.

**Deux retouches facultatives, sans effet sur la note** :
1. l. 28 : « Sans Storytelling (non publié) » se lit comme « Storytelling n'est pas publié », ce que la phrase suivante contredit. Écrire « S'il était dépublié, sans Storytelling : 2 300 ».
2. l. 28 : « Boulot est publié depuis le 11/10 (historique du projet) ». Citer plutôt le code, `BOULOT_PUBLIE = true` (l. 25), et l'ajouter en 3.0 l. 143 à côté de Storytelling, puisque le test doit lire les deux.

## 3. Note et verdict

| # | Critère | T5 | T6 |
|---|---|---|---|
| 1 | Exactitude des faits | 9 | 10 |
| 2 | Valeur pour Yanis, Sophie, Marc | 10 | 10 |
| 3 | Ton maison des noms | 10 | 10 |
| 4 | Respect des [CHOIX UTILISATEUR] (dont C4) | 10 | 10 |
| 5 | Qualité des questions à Thomas | 10 | 10 |
| 6 | Honnêteté des risques | 9 | 10 |
| 7 | Cohérence avec l'architecture | 10 | 10 |

**Global : 10 / 10** (70 / 70 ; T5 : 9,7). D1 à D4 sont levées et rien de faux n'a été introduit. **Verdict : prêt à présenter à Thomas.**
