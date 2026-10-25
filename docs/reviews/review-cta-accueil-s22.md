# Relecture à l'aveugle : bouton principal de l'accueil (s22)

Date : 2026-10-25 · Relecteur : @reviewer · Mode : à l'aveugle (rien lu dans `docs/copy/cta-accueil-s22/` ni dans `docs/reviews/`).
Sources lues : `docs/copy/ton-alex.md`, capture `hero-mobile.png` (390 px, bouton actuel = candidat B), `project-context.md` (personas).

## Faits de référence (ce que le clic ouvre)
Étape 1 gratuite, sans compte, du parcours Répartie : un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz, environ 20 min hors vidéos. Elle enseigne l'ironie bienveillante (répondre à une pique avec une phrase, avec le sourire, sans conflit). La suite (4 semaines) est payante. Le même libellé sert de bouton secondaire (contour) sous la carte Premium.

## Mesure largeur à 390 px
Sur la capture, B (39 caractères) occupe environ 268 px d'un bouton d'environ 358 px : il tient, mais c'est le plus long. Tous les autres candidats font 26 à 32 caractères : une ligne sans risque dans le hero. Pour la carte Premium (bouton plus étroit à cause du padding de la carte), seul B (39) est à surveiller.

## Lecture par visiteur
| | Étudiant timide (Google : « quoi répondre quand on se moque de moi ») | Salariée 35 ans (plus drôle au boulot) | Sceptique pressé |
|---|---|---|---|
| A | Écho direct de sa recherche, il clique. Peut croire à un générateur de réponse à sa situation. | Moyen : elle ne cherche pas « quoi répondre ». | « Gratuit » visible, mais ne sait pas ce qu'il obtient. |
| B | « Mes répliques » : il n'en a pas, ça l'intimide. | Vague. | Long, flou sur le contenu, il passe. |
| C | Il sait exactement ce qu'il va apprendre. | « Pique » = la remarque du collègue en réunion : ça lui parle. | Clair, note « Gratuit, sans compte. » rassurante. |
| D | « Étape 1 » de quoi ? Aucun lien avec sa recherche. | Ne lui dit rien. | Honnête (~20 min), mais zéro envie. |
| E | Joli, mais que se passe-t-il au clic ? On ne répond à personne en cliquant. | Le « en souriant » lui plaît. | Lit un slogan, pas une action. |
| F | « Chambrage » = son quotidien de coloc. | « Chambrage » sonne potes plus que bureau. | Clair. |
| G | « Répondre » à quoi ? Le sous-titre aide, le bouton seul est creux. | Générique. | Apprécie « gratuit » et « ~20 min ». |

## Notes /10
| Critère | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| Clarté du clic | 6 | 5 | 9 | 6 | 4 | 8 | 7 |
| Envie de cliquer | 8 | 6 | 7 | 4 | 8 | 7 | 5 |
| Vérité de la promesse | 7 | 5 | 10 | 9 | 8 | 8 | 9 |
| Cohérence H1 / sous-titre | 8 | 6 | 8 | 4 | 8 | 7 | 7 |
| Ton maison | 7 | 6 | 7 | 6 | 9 | 8 | 6 |
| Une ligne à 390 px | 10 | 9 | 10 | 10 | 10 | 10 | 10 |
| Bouton secondaire sous Premium | 8 | 7 | 5 | 8 | 4 | 5 | 9 |
| **Total /70** | **54** | **44** | **56** | **47** | **51** | **53** | **53** |

Éliminations : aucune promesse franchement fausse. Deux réserves :
- **B (limite)** : « Tester mes premières répliques » suppose qu'on teste SES propres répliques. Le clic donne 5 vannes du site, un conseil, un défi et un quiz. Si le défi ne demande pas de placer une réplique soi-même, B devient trompeur et sort du classement.
- **A, D, G** : « ~20 min » (D, G) est exact hors vidéos seulement ; ce n'est pas faux mais le temps réel est plus long. Ne pas en faire un argument.

## Classement
1. **C** (56) · 2. **A** (54) · 3. **F** et **G** (53) · 5. **E** (51) · 6. **D** (47) · 7. **B** (44, actuel)

## Gagnant : C, « Apprends à répondre à une pique » + « Gratuit, sans compte. »
- **Vérité totale** : c'est mot pour mot ce que l'étape 1 enseigne (répondre à une pique avec le sourire). Personne n'est déçu au clic.
- **Prolonge le sous-titre sans le répéter** : « quand on te chambre » puis « une pique » ; « pique » couvre à la fois la moquerie de l'étudiant et la remarque du collègue, là où « chambrage » (F) reste entre potes.
- **Le sceptique a sa réponse sous le bouton** : action claire au-dessus, « Gratuit, sans compte. » en dessous, rien à deviner.

Point faible : sous la carte Premium, sans « gratuit » dans le libellé, un bouton contour « Apprends à répondre à une pique » peut se lire comme une partie de l'offre payante.

## Retouche proposée (conditionnelle)
- Libellé : « Apprends à répondre à une pique, gratuit »
- Sous-note : « Sans compte. »

Gain : règle le bouton secondaire sous Premium (5 → 8) sans toucher à la vérité ni à la clarté. Total estimé 57/70.
Condition : 40 caractères, un de plus que B. Ça tient dans le hero (B tient sur la capture), mais il faut vérifier à 390 px que le bouton contour de la carte Premium ne passe pas sur deux lignes. S'il casse : garder C tel quel et afficher « Gratuit, sans compte. » aussi sous le bouton de la carte Premium.

Contrôles : aucun tiret cadratin ni émoji dans les candidats ; tutoiement respecté partout sauf B (« mes »), qui rompt avec le « tu » du H1.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-cta-accueil-s22.md`
- Décision : gagnant **C**, « Apprends à répondre à une pique » + « Gratuit, sans compte. », 56/70. Retouche conditionnelle : « Apprends à répondre à une pique, gratuit » + « Sans compte. » (57/70) si le bouton tient sur une ligne dans la carte Premium à 390 px.
- Points d'attention : B (libellé actuel) arrive dernier et devient trompeur si le défi de l'étape 1 ne fait pas placer une réplique soi-même. Vérifier le rendu dans la carte Premium avant de déployer la retouche.
---
