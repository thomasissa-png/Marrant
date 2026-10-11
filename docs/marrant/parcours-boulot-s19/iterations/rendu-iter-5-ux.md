# Rendu Parcours Boulot, itération 5 : relecture @ux (s19, 11/10/2026)

**Boulot (état publié) : 10/10. Non-régression des 4 parcours en ligne : 10/10 (sur ce qui est regardé, réserves en §5). Bloquants : 0. Défauts neufs : 0. S15 à S18 soldés.**
Verdict : **GO à l'activation** (`BOULOT_PUBLIE = true`). Plus aucune retouche en attente de ma part. Deux observations sans correction demandée (§3).

Périmètre lu (Read réel sur les PNG) : 22 sur 204 (110 + 94, hors index).
- Boulot, 12 : Q1 avec 💼, Q2 après « Au boulot », les 3 résultats du quiz (raconter, répondre, confiance), résultat de l'onboarding « Tout ça à la fois » + « Au boulot », étape 2 (375), étape 3 (375 et 1280), étape 6 (375 et 1280) avec « Version sans risque », « Aller au défi » (375, étape 3).
- Non-régression, 10 : Q1 (☕) et Q2 avec Boulot masqué, les 3 résultats du quiz avec Boulot masqué, onboarding avec Boulot masqué, étape 2 de Machine à Café (2 captures), de Confiance (typographie) et de Répartie (375).
- Code lu : `PARCOURS_EVENTS` de `lib/analytics/weekly-parcours.ts` et `implementation.md` (« Rendu itération 5 », en entier). Le tableau HTML du rapport (libellés des 2 lignes) n'est pas relu au code : doc et test seulement.
- Non regardés un à un : les ~180 autres PNG (variantes de largeur). Aucun contrôle automatique ne signale quoi que ce soit (245 PASS et 209 PASS, 0 FAIL).
Je ne touche à aucun code ni texte validé.

## 1. Statut de S15 à S18

| Point | Statut | Preuve |
|---|---|---|
| **S15** raison du quiz | **CORRIGÉ** | Les 3 résultats (`raconter`, `repondre`, `confiance`, 375) sont identiques : « Parcours Boulot », « Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. ». Elle est vraie pour « rien de drôle à raconter », « quoi répondre » et « perdu confiance en moi » : plus de contradiction avec la réponse. Même texte dans l'onboarding (« Tout ça à la fois » + « Au boulot », bouton « Voir par où commencer »). La phrase est la dernière de la description validée de la fiche (contrôle du script, mot pour mot). Lecture : 3 lignes en 375, aucune coupure disgracieuse, « Ton point de départ : » avec espace avant « : ». |
| **S16** titre « Version sans risque » | **CORRIGÉ** | 13 px medium gris sous « DÉFI X » (14 px semi-gras), mesuré aux 3 largeurs sur les étapes 2 à 6. Vu aux étapes 2, 3 et 6 (375, 1280) : le titre se lit nettement mieux qu'à 12 px et reste moins fort que le défi. |
| **S17** « : » en tête de ligne | **CORRIGÉ** | Machine à Café 375 : « tu ne dis / rien : tu laisses… » et « très calme : « Ils ont validé ? » » tiennent désormais sur la ligne. Confiance : « Écris-le d'abord en / verdict », « réécris-le » intacts. Répartie : « Toi, / d'une voix claire : ». Contrôle ligne à ligne du script : 0 ponctuation haute en tête de ligne sur les 4 parcours, 375 et 1280. Texte stocké inchangé (espaces insécables et gluons seulement, testé). |
| **S18** rapport du lundi | **FAIT** | `lien-etape-clic` et `defi-lien-clic` sont dans `PARCOURS_EVENTS` (lu au code). Test : 2 événements comptés et affichés. |

## 2. Autres changements de l'itération 5

| Changement | Vu | Verdict |
|---|---|---|
| 💼 sur « Au boulot, en réunion, à la pause » | Q1 Boulot publié : 💼, 🎉, 🌱 ; Boulot masqué : ☕, 🎉, 🌱 | Conforme : l'icône suit la carte Boulot, le comportement d'avant est intact quand Boulot est masqué. |
| Q2 après « Au boulot » (capture demandée) | « Question 2/2 », « Qu'est-ce qui coince le plus ? », 📝 / ⚡ / 💪, identique avec Boulot masqué | Conforme : la question 2 reste posée et utile, son effet est maintenant assumé par une raison vraie. Cibles larges, un seul écran d'action. |
| Critère sous l'encadré à 20 px | Étape 2 (375) : « C'est gagné si ton PS tient en une phrase… » nettement détaché du repli ; étape 6 (375, 1280) : « C'est réussi s'il fait entre 100 et 125 mots… » | Conforme : le critère se lit comme commun au défi et à son repli, plus comme la fin de l'encadré. |
| « Aller au défi » (capture demandée) | Étape 3, 375, après clic : « Exercice pratique » sous l'en-tête collant, le défi entier visible puis « Version sans risque » | Conforme : l'ancre tombe au bon endroit, rien n'est masqué par l'en-tête. |
| Typographie sur les 3 anciens parcours | Voir S17 ; étape 2 de Machine à Café, Confiance, Répartie lisibles, aucune coupure inattendue | Conforme, sans effet de bord visible. |

## 3. Défauts neufs

Aucun. Deux observations, sans correction demandée :
- **Contour en pointillés de « Version sans risque »** : très peu contrasté sur fond sombre (visible surtout en 375 ; en 1280, il se devine à peine). Le titre, le texte et l'espacement portent seuls la lecture, et le contour n'est pas un composant interactif : sans impact fonctionnel. Pour @design si un jour on veut le renforcer (token existant, pas de couleur neuve).
- **Icône de l'onboarding** : la réponse « Au boulot / machine à café » garde ☕ alors que le quiz du hub affiche 💼. Écart déjà signalé par @fullstack (« hors arbitrage »), cohérent avec le libellé « machine à café » de cette réponse. Aucune action.

## 4. Non-régression des 4 parcours en ligne

**10/10 sur ce qui est regardé : aucune régression, aucun bloquant.**
- Quiz avec Boulot masqué : « raconter » donne Machine à Café, « répondre » donne Répartie, « confiance » donne Confiance, avec les raisons d'avant, icône ☕ conservée.
- Onboarding avec Boulot masqué : « Tout ça à la fois » + « Au boulot » donne Machine à Café comme avant.
- Étape 2 des anciens parcours : DÉFI en gras, exemple en un paragraphe, boutons « Alors, ce défi ? » en colonne, aucun « Version sans risque » ni « Aller au défi » hors Boulot.
- Changements visibles à la mise en ligne, par choix du fondateur (à consigner dans `REPLIT_ACTIONS.md`, avec ceux de l'itération 4 : XP « N XP gagnés sur T, bonus de fin compris », DÉFI en gras, interligne de l'exemple, « Étape N · titre » en couleur de lien, titres vidéo de Répartie, « arrive bientôt » masqué en erreur) : typographie française (espaces insécables avant « : », traits d'union protégés) sur les 3 anciens parcours.

## 5. Réserves sur la couverture

- 22 PNG sur 204 regardés. Non vus à l'oeil cette fois : carte de progression et fins de parcours (vus à l'itération 4, non modifiés), page entière en erreur (illisible en réduction), 768 px, clavier sur le lien d'étape, connexion lente, retour après 30 jours, libellés du tableau HTML du rapport du lundi.
- Aucune ne justifie de retarder l'activation. Les réserves d'itération 4 (Q2 et onboarding avec Boulot publié) sont levées.

## 6. Audit heuristique Nielsen 10 (itération 5)

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état | PASS | Q1/Q2 « Question 2/2 », carte de progression, XP gagnés. |
| H2 | Vocabulaire du persona | PASS | Raison du quiz vraie pour les 3 réponses (S15), « version sans risque », « vanne ». |
| H3 | Contrôle et annulation | PASS | « Refaire le quiz », étapes dépliables. |
| H4 | Cohérence | PASS | 💼 quiz et carte Boulot ; défi en gras et typographie sur les 5 parcours. |
| H5 | Prévention d'erreurs | PASS | La question 2 n'est plus contredite par le verdict. |
| H6 | Reconnaissance | PASS | Lien d'étape nommé, « Aller au défi ». |
| H7 | Raccourcis experts | PASS | « Aller au défi », ancres `#etape-N`. |
| H8 | Minimalisme | PASS | Un seul bouton plein par état, critère commun détaché de l'encadré. |
| H9 | Erreurs humaines | PASS | « Ta progression est intacte. » + « Réessayer ». |
| H10 | Aide dans le flux | PASS | « Version sans risque » à 13 px, « Pourquoi cette étape ? ». |

### Cognitive walkthrough (« Au boulot » puis « perdu confiance en moi », 375)

| Étape | Sait-il quoi faire ? | Résultat |
|---|---|---|
| Q1 | 3 choix, 💼 sur le sien | OUI |
| Q2 | 3 difficultés | OUI |
| Résultat | « Parcours Boulot », bouton « Voir ce parcours » | OUI |
| Raison | « Chaque exercice a une version sans risque au boulot… » : rassure la personne sans confiance, ne contredit rien | OUI (S15 levé) |

### HEART (via @data-analyst)

| Dimension | Signal | Cible | Mesure |
|---|---|---|---|
| Adoption | `orientation-resultat` avec `parcours: boulot`, puis entrée sur la page Boulot | à suivre, pas de cible inventée | Umami, 30 cas minimum |
| Task success | `lien-etape-clic` puis validation de l'étape | à suivre | rapport du lundi (S18 fait) |
| Engagement | `defi-lien-clic`, retour d'exercice noté | à suivre | idem |
| Retention | étape N+1 validée sous 14 jours | à suivre | `etape-ouverte` avec `conseillee` |

## Handoff

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-5-ux.md`
- Notes : Boulot **10/10**, non-régression **10/10**, 0 bloquant, 0 défaut neuf. **GO à l'activation** (`BOULOT_PUBLIE = true`).
- Décisions prises : S15 à S18 soldés. Deux observations sans action (contour en pointillés très discret ; ☕ conservé dans l'onboarding).
- Points d'attention : (1) consigner dans `REPLIT_ACTIONS.md` les changements visibles des 4 parcours en ligne (§4, avec ceux de l'itération 4) ; (2) après activation, vérifier en prod le quiz « Au boulot » (3 réponses) et l'onboarding, puis suivre `orientation-resultat` et les 2 nouveaux événements dans le rapport du lundi ; (3) rien n'a été modifié dans le code ni les textes validés ; l'historique de `project-context.md` reste à compléter par la session principale.
---
