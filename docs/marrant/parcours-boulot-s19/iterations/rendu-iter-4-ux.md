# Rendu Parcours Boulot, itération 4 : relecture @ux (s19, 11/10/2026)

**Boulot (état publié) : 9,5/10. Non-régression des 4 parcours en ligne : 10/10 (sur ce qui est regardé, réserves en §7). Bloquants : 0. Suggestions : 5 neuves (S15 à S19), S10 à S14 soldées.**
Verdict : **GO à l'activation** (`BOULOT_PUBLIE = true`). Le visionnage des 10 vidéos est fait (`docs/founder-preferences.md`, 11/10), N5 et N7 sont tranchés. Un point mérite une retouche d'une ligne, avant ou juste après l'activation, sans bloquer : la phrase de raison du quiz (§2). Le déploiement masqué est déjà fait (bcd071ca), donc les 6 conseils et 10 vannes sont déjà au catalogue.

Périmètre lu (Read réel sur les PNG) : 26 sur 196.
- Boulot, 17 : quiz « Au boulot » avec les 3 deuxièmes réponses (375), carte de progression à 0 XP, en cours (375 et 1280), en erreur, page haute avec progression 2/6 (375), erreur de chargement en pleine page, étapes 2 (375) et 6 (375 et 1280) avec « Version sans risque » et critère sous l'encadré, hub haut (5 noms), carte Boulot du hub, carte de fin de Machine à Café avec Boulot publié.
- Non-régression, 9 : quiz avec Boulot masqué (« raconter », « répondre »), carte à 0 XP de Répartie, carte en cours de Confiance, carte en erreur de Répartie, zone exemple et défi de l'étape 2 (Machine à Café 375, Répartie 375, Confiance 1280).
- Code lu : `lib/parcours-orientation.ts` (règle du quiz et de l'onboarding), test `parcours-orientation-boulot.test.tsx`. `implementation.md` (« Rendu itération 4 ») lu en entier. Les événements Umami ne sont pas relus au code (doc et tests seulement).
- Non regardés un à un : les ~170 autres PNG (variantes de largeur). Aucun contrôle automatique ne signale quoi que ce soit (215 PASS et 189 PASS, 0 FAIL).
Je ne touche à aucun code ni texte validé.

## 1. Statut de S10 à S14

| Point | Statut | Preuve |
|---|---|---|
| **S10** « arrive bientôt » en erreur | **CORRIGÉ** (contrôle automatique), non relu à l'oeil | `premium-375-carte-progression-erreur` : alerte « Ta progression est intacte. » + « Réessayer », rien d'autre. Page entière (`erreur-chargement-page`, 375x6946) illisible en réduction : l'absence de la phrase repose sur le contrôle du script (« la page ne contient plus arrive bientôt ») et le test. Même état sur Répartie en non-régression : alerte, puis ligne de rappel e-mail, cohérent. |
| **S11** point médian | **CORRIGÉ** | « Étape 3 · Le couloir : quinze secondes », « Étape 2 · Rire de toi sans te rabaisser » (Confiance). Le « : » du titre reste, sans doublon de séparateur. |
| **S12** 2e ligne en lien | **CORRIGÉ** | Les 2 lignes en couleur de lien (375 et 1280). Seule la 1re est soulignée au repos, la 2e au survol : le bloc se lit comme un lien. |
| **S13** blanc réduit | **CORRIGÉ** (mesure), carte vue | Carte de progression : marges 26/28 px (375), 26/26 px (1280), équilibrées à l'oeil. « Aller au défi » : 30 px mesurés par le script, cible de 44 px contrôlée ; non regardé en capture cette fois. |
| **S14** événements Umami | **FAIT au code selon le doc, à confirmer** | `lien-etape-clic`, `defi-lien-clic` (propriétés `parcours`, `etape`). Pas relus au code. Non ajoutés au rapport du lundi : voir S18. |

## 2. Le quiz d'orientation : « Au boulot » mène toujours à Boulot

Rappel de l'écran (`visiteur-375-hub-haut`) : Q1 « Dans quelle situation tu voudrais être plus drôle ? » (Au boulot, en réunion, à la pause / En soirée, avec mes potes, en coloc / Partout, je veux retrouver ma légèreté), Q2 sur la difficulté (« rien de drôle à raconter », « quoi répondre sur le moment », « perdu confiance en moi »). Le choix du fondateur n'est pas rediscuté.

**Mon avis : la règle est juste pour l'utilisateur, et ne pose pas de problème de fond.** Raisons :
- C'est le seul parcours fait pour la situation que la personne vient de nommer. Boulot couvre la pause et le couloir (étape 3), l'afterwork (étape 4), « tu fais quoi dans la vie ? » (étape 5), pas seulement les réunions. Machine à Café reste une carte du hub juste dessous, et le résultat s'intitule « Ton point de départ », pas « le seul parcours ».
- Persona Sophie (project-context : CDI, machine à café, frustration « pas de mention de situations professionnelles ») : elle trouvait Machine à Café, qui parle du bureau en général ; Boulot la sert plus précisément. Les 3 difficultés de Q2 sont toutes traitées dans Boulot (anecdote à la pause, répartie en réunion, version sans risque pour la confiance).
- Le test de cohérence tient : Boulot masqué, le comportement d'avant est identique (vu : « raconter » donne Machine à Café, « répondre » donne Répartie).

**Le défaut est ailleurs : la phrase de raison.** Elle est la même pour les 3 réponses : « Pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu. » (`parcours-orientation.ts`, tagline de la fiche). Après « rien de drôle à raconter » ou « perdu confiance en moi », elle affirme que la personne fait rire ses amis : le verdict contredit sa propre réponse, et la question 2 semble ignorée. `[FRICTION H2 et H5]` : à l'étape du résultat, la personne qui s'est dite sans confiance lit qu'elle fait rire ses amis. Solution : une raison vraie pour les 3 réponses.
- **Règle minimale proposée (une ligne, aucun mot neuf, à valider par @copywriter ou Thomas car c'est un choix de texte)** : garder la règle telle quelle et remplacer la raison de Boulot par la seconde moitié de l'accroche validée de la carte : « Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. » Vraie pour « rien à raconter », « quoi répondre » et « perdu confiance », et elle répond à la peur de la personne sans confiance. Mettre à jour le test (`RAISON_BOULOT`) en conséquence.
- Variante non retenue : un lien secondaire vers le parcours que Q2 aurait donné. Plus complet, mais il demande un texte neuf et rouvre le choix du fondateur.
- Observation, sans correction demandée : le quiz et l'onboarding divergent légèrement par construction. Dans l'onboarding, l'objectif prime (« Faire rire les gens » + « Au boulot » donne Machine à Café, « Répondre du tac au tac » + « Au boulot » donne Répartie) ; seul « Tout ça à la fois » + « Au boulot » atteint Boulot, comme annoncé. Dans le quiz, la situation prime. Cohérent en interne ; à noter si des visiteurs signalent des résultats différents.
- Limite : « Refaire le quiz » avec « Au boulot » redonne toujours Boulot. Machine à Café reste atteignable par les deux autres Q1 et par le hub. Acceptable.

## 3. Choix du fondateur appliqués

| Choix | Vu | Verdict |
|---|---|---|
| XP « N gagnés sur T, bonus de fin compris » | 0 XP gagné sur 700 (Boulot), 0 XP gagné sur 475 (Répartie), 125 sur 700, 50 sur 800 (Confiance) | Conforme, singulier à 0. Lecture claire en 375 (gauche) et 1280 (droite). Le « 125 XP gagnés » ne se lit pas comme incluant le bonus : le bonus est dans le total. |
| Défi en gras sur les 5 parcours | « DÉFI BLANCS », « DÉFI SILENCE », « DÉFI FAIT DIVERS » en gras, suite normale (3 anciens parcours, 375 et 1280) | Conforme. S7 (écart entre parcours) est **soldé**. |
| Exemple en paragraphes | Les exemples des anciens parcours tiennent sur une ligne ou un paragraphe : un seul bloc, interligne 24 px | Conforme, sans effet de bord. |
| Titres vidéo de Répartie | Déclaré aligné (« JCC 8è saison », « Jamel Comedy Club Saison 9 ») ; non rouvert cette fois | Non revu en capture. |
| Étape 6 « Environ 20 min » | Gardé | Hors note. |
| Critère de réussite hors de l'encadré | Étape 2 (375) : « C'est gagné si ton PS tient en une phrase… » sous l'encadré. Étape 6 (375, 1280) : « C'est réussi s'il fait entre 100 et 125 mots… » puis « Rien à prononcer… » | Conforme et mieux compris : le critère vaut pour les deux versions. Étapes 3, 4, 5 : aucun 3e morceau. |

## 4. Défauts neufs (aucun bloquant)

| # | Où | Symptôme | Gravité | Correction |
|---|---|---|---|---|
| S15 | Quiz, résultat Boulot | Raison identique pour les 3 réponses de Q2, fausse pour 2 d'entre elles (§2) | Moyenne (non bloquante) | Règle minimale du §2 |
| S16 | `premium-375-etape2-version-sans-risque`, `premium-1280-etape6-…` | Encadré en pointillés sans fond, titre « Version sans risque » en 12 px gris : plus discret qu'à l'itération 3. C'est l'option de repli de la personne qui n'a pas de réunion, donc sa porte d'entrée. Lisible, mais le titre est le moins visible de l'écran | Faible | Titre à 13 ou 14 px, même gris (arbitrage @design, aucune couleur neuve) |
| S17 | `regression/machine-a-cafe-375-premium-etape2-exemple-defi` | Deux « : » en tête de ligne dans l'exemple (« tu ne dis rien / : tu laisses… », « très calme / : « Ils ont validé ? » »). Typographie française non protégée sur les 3 anciens parcours (`frTypoParcours` réservé à Storytelling et Boulot). **Antérieur à l'itération 4, pas une régression** | Faible | Étendre la liaison de l'espace avant « : » à tous les parcours (seules des espaces deviennent insécables, testable comme à l'itération 3) |
| S18 | Rapport du lundi | `lien-etape-clic` et `defi-lien-clic` partent mais ne sont pas dans `PARCOURS_EVENTS` : personne ne les lira | Faible | Les ajouter avec @data-analyst |
| S19 | Étape 6 | Après l'encadré : 2 paragraphes d'environ 120 mots avant les boutons. Texte validé, hérité | Très faible | Aucune (H8 accepté) |

## 5. Changements visibles au déploiement sur les 4 parcours en ligne (à consigner dans `REPLIT_ACTIONS.md`)

L'itération 4 n'est pas encore déployée. À la prochaine mise en ligne, les 4 parcours en ligne changent par choix du fondateur : XP « N XP gagnés sur T, bonus de fin compris », libellé « DÉFI X » en gras, interligne de l'exemple à 24 px, « Étape N · titre » en couleur de lien, titres vidéo de Répartie, « arrive bientôt » masqué en erreur. Le quiz ne change qu'à l'activation.

## 6. Non-régression des 4 parcours en ligne

**10/10 sur ce qui est regardé : aucune régression, aucun bloquant.**
- Quiz avec Boulot masqué : « raconter » donne Machine à Café, « répondre » donne Répartie, texte identique à avant.
- Cartes de progression : 0 XP, en cours, en erreur sur Répartie et Confiance, mêmes marges, aucune ligne XP en erreur, rappel e-mail conservé.
- Étape 2 : exemple et défi lisibles à 375 et 1280, boutons « Alors, ce défi ? » en colonne puis en ligne. Aucun « Version sans risque » ni « Aller au défi » hors Boulot (contrôlé par le script, Storytelling compris).

## 7. Réserves sur la couverture

- 26 PNG sur 196 regardés. Non vus : écran de Q2 du quiz avec Boulot publié (le libellé exact des 3 réponses vient du test), résultat de l'onboarding « Tout ça à la fois » + « Au boulot », page entière en erreur (illisible en réduction), « Aller au défi » après l'itération 4, fins de Répartie, Confiance et Storytelling avec Boulot publié (hérité), titres vidéo de Répartie, clavier sur le lien d'étape (hérité), connexion lente, retour après 30 jours.
- Aucune de ces réserves ne justifie de retarder l'activation. Demande à @qa : capture de Q2 et de l'onboarding avec Boulot publié.

## 8. Audit heuristique Nielsen 10 (itération 4)

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état | PASS | « 125 XP gagnés sur 700, bonus de fin compris », barre 2/6, lien d'étape. |
| H2 | Vocabulaire du persona | PASS avec réserve | « Version sans risque », « vanne ». Raison du quiz hors sujet pour 2 réponses (S15). |
| H3 | Contrôle et annulation | PASS | « Refaire le quiz », étapes dépliables, retour d'exercice modifiable. |
| H4 | Cohérence | PASS | Défi en gras sur les 5 parcours, même carte de progression. |
| H5 | Prévention d'erreurs | PASS avec réserve | Q2 posée puis ignorée pour « Au boulot » (S15). |
| H6 | Reconnaissance | PASS | « Étape 3 · Le couloir : quinze secondes » nommée et cliquable. |
| H7 | Raccourcis experts | PASS | « Aller au défi », ancres `#etape-N`. |
| H8 | Minimalisme | PASS | Critère sorti de l'encadré, un seul bouton plein par état (S19 accepté). |
| H9 | Erreurs humaines | PASS | « Ta progression est intacte. » + « Réessayer », plus de contradiction (S10). |
| H10 | Aide dans le flux | PASS | « Version sans risque » (S16 : discrète), « Pourquoi cette étape ? ». |

### Cognitive walkthrough (visiteur qui répond « Au boulot » puis « perdu confiance en moi », 375)

| Étape | Sait-il quoi faire ? | Résultat |
|---|---|---|
| Q1 | 3 choix clairs, icônes | OUI |
| Q2 | 3 choix sur la difficulté | OUI |
| Résultat | « Parcours Boulot », bouton « Voir ce parcours » visible | OUI |
| Raison | Dit qu'il fait rire ses amis le samedi : contredit sa réponse | **[FRICTION H2] S15** |

### HEART (via @data-analyst)

| Dimension | Signal | Cible | Mesure |
|---|---|---|---|
| Adoption | `orientation-resultat` avec `parcours: boulot`, puis entrée sur la page Boulot | à suivre, pas de cible inventée | Umami, 30 cas minimum |
| Task success | `lien-etape-clic` puis validation de l'étape | à suivre | à ajouter au rapport (S18) |
| Engagement | `defi-lien-clic`, retour d'exercice noté | à suivre | idem |
| Retention | étape N+1 validée sous 14 jours | à suivre | `etape-ouverte` avec `conseillee` |

## Handoff

---
**Handoff → @orchestrator (puis @fullstack, @copywriter, @design, @data-analyst, @qa selon les lignes)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-4-ux.md`
- Notes : Boulot **9,5/10**, non-régression **10/10**, 0 bloquant. **GO à l'activation.**
- Décisions prises : S10 à S14 soldées (S14 à confirmer au code). Quiz : la règle « Au boulot donne Boulot » est juste pour l'utilisateur, sans changement ; le seul défaut est la phrase de raison, fausse pour 2 réponses sur 3.
- Points d'attention : (1) @copywriter ou Thomas, avant ou juste après l'activation : valider la raison du quiz « Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. », puis @fullstack modifie `parcours-orientation.ts` et le test (10/10 attendu ensuite) ; (2) @design : S16 (titre « Version sans risque »), S17 avec @fullstack (espace insécable avant « : » sur les 3 anciens parcours, hors régression) ; (3) @data-analyst : S18 ; (4) @qa : captures de Q2 et de l'onboarding avec Boulot publié, « Aller au défi » ; (5) consigner dans `REPLIT_ACTIONS.md` les changements du §5 ; (6) rien n'a été modifié dans le code ni les textes validés ; l'historique de `project-context.md` reste à compléter par la session principale.
---
