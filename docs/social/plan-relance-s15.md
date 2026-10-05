# Plan de relance des réseaux sociaux : itération à 10/10 (s15, 05/10/2026)

> Demande de Thomas : relancer X, Instagram et LinkedIn « propre, comme il faut », après avoir fait itérer les agents à 10/10 sur tous les critères clés. Choix inscrit dans `docs/founder-preferences.md` (05/10). Point de départ : `docs/social/audit-note-s15.md` (4,0/10) et `docs/design/audit-visuels-sociaux-s15.md` (3,4/10).

## État au 05/10, 16 h UTC

- **Instagram retenu** : les 33 posts en file (visuels jamais validés) sont sortis de la file (statut REJECTED via l'admin), sauvegardés dans `docs/social/file-instagram-retenue-s15.json`. Rien ne part sur Instagram avant validation.
- **X retenu aussi** (Thomas, 05/10 16 h 09 UTC : « que ça parte pas ») : 40 posts sortis de la file, sauvegardés dans `docs/social/file-x-retenue-s15.json`. **Plus aucun post en attente** sur les 3 réseaux (base et Buffer vérifiés). Aucun job ne remplit la file seul (génération quotidienne coupée, préparation mensuelle manuelle).
- **LinkedIn** : débloqué dans le code (Worker `108da3e7`), en pause via l'interrupteur comme X et Instagram.
- **Baseline** (Thomas, 05/10) : 0 abonné sur X, Instagram et LinkedIn.
- Buffer : Instagram reconnecté par Thomas. Correctif « statut réel Buffer + alerte » commité (`0c13c5f`), non déployé.

## Critères clés (chacun doit atteindre 10/10 avant relance)

| # | Critère | Ce qui est noté | Notateurs indépendants |
|---|---|---|---|
| K1 | Stratégie 3 réseaux | rôle par réseau et par persona, cadence, part catalogue / contenu propre | @reviewer + @growth |
| K2 | Ton et qualité des posts | 9 étalons, puis le lot complet : voix marque, humour, fluidité, règles fondateur | @reviewer + @copywriter |
| K3 | Visuels | grille V1 à V8, notée sur les images RÉELLES rendues par le gabarit | @design + @reviewer |
| K4 | Formats par réseau | carrousel Instagram 4:5, tweet simple, post LinkedIn, déclinaisons | @design + @social |
| K5 | Calendrier | relais des articles (lundi et jeudi), saisonnalité, rythme | @social + @growth |
| K6 | Trafic et conversion | UTM, `/liens`, destination des liens (quiz, parcours), appel à l'action | @growth + @ux |
| K7 | Fiabilité de la chaîne | statut réel Buffer, alerte, LinkedIn débloqué, tests, prévu = publié | @qa |
| K8 | Mesure | baseline abonnés, relevé hebdo, seuils de succès / échec | @growth |
| K9 | Conformité | choix fondateur, zéro tiret cadratin, zéro mention IA, humoristes autorisés | @reviewer |

Croissance et engagement ne se notent qu'après publication (mesure à J+14 et J+28).

## Boucle (cap 5 cycles par critère)

1. **Notation** indépendante par 2 agents, sur le rendu réel (images, textes en base), avec corrections précises.
2. **Application** par l'agent producteur (@social textes, @fullstack gabarit et chaîne, @design direction).
3. **Passe de contrôle** : une correction ne doit pas en casser une autre (leçon s14) ; contradiction entre notateurs tranchée une fois et inscrite.
4. Retour à 1 jusqu'à 10/10 sur K1 à K9.

## Règles d'étalonnage tranchées (valables pour tous les cycles)

- **Drôlerie : 10/10 = au niveau ou au-dessus de la barre plancher fondateur** (vanne Alexa, [CHOIX] du 30/09 : « Rien en dessous »). Les notes à l'aveugle sont lues relativement à cette vanne : si elle reçoit 9, un post noté 9 est au niveau donc à 10. (Tranché par la session principale le 05/10, cycle 3.)
- Règles R1 à R5 de `docs/social/strategie-relance-v3.md` (remplacement des vannes sous le seuil, carrousel, légende, relais LinkedIn, lien LinkedIn).

## Ordre

1. Cycle 1 (en cours) : rendu réel de la piste visuelle A (prototype local, non déployé) ; notation de la stratégie et des 9 étalons.
2. Cycles suivants jusqu'à 10/10.
3. **Validation de Thomas** : 9 étalons et visuels (règle P0 s8 : étalons calibrés avec le fondateur).
4. Production du lot complet (octobre-novembre, 3 réseaux), notation à 10/10 du lot.
5. Code (gabarit, LinkedIn débloqué, plan mensuel), contrôles, déploiement, puis vérification chez Buffer.
