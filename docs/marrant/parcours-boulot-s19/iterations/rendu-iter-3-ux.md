# Rendu Parcours Boulot, itération 3 : relecture @ux (s19, 11/10/2026)

**Boulot : 10/10. Non-régression des 4 parcours en ligne : 10/10 (sur ce qui est regardé, réserves en §6). Bloquants : 0. Suggestions : 14 (9 de l'itération 2 soldées ou closes, 5 neuves, toutes faibles).**
Verdict : **GO au déploiement masqué** (`BOULOT_PUBLIE = false`). **GO à la publication** une fois levées les décisions N5 et N7 de Thomas et le visionnage des vidéos (§7). Rien ne régresse.
Les deux critères du fondateur qui restaient PARTIELS à l'itération 2 sont satisfaits : « où j'en suis et quoi faire » (N2b) et « version sans risque visible » (N4). Aucun défaut neuf n'est bloquant. N5 et N7 restent des décisions du fondateur, hors note, comme demandé.

Périmètre lu (regardé réellement avec Read) : 36 PNG sur 170.
- Boulot, 25 sur 98 : 375 (page haute avec progression, page après clic sur le lien d'étape, étapes 3 et 6 « Version sans risque », étape 3 après « Aller au défi », étape 6 entière, étape 1 visiteur entière, étape 1 validée, retour d'exercice, quiz répondu, question de quiz répondue, étape 2 verrouillée par l'ordre, erreur de chargement en fenêtre et en pleine page, hub haut avec Boulot publié, cartes de fin de Boulot, de Machine à Café avec Boulot publié, de Storytelling après Machine à Café) ; 768 (page haute Premium, étape 3) ; 1280 (page haute avec progression, étapes 2, 3, 4, 5 entières, étape 3 « Version sans risque »).
- Non-régression, 11 sur 72 : page haute Premium en cours des 4 parcours (375), aperçu de l'étape 2 (Répartie 375, Storytelling 1280), étape 1 visiteur Machine à Café (375) et Confiance (768), page haute Répartie (768), hub haut (375), carte de fin Storytelling (1280).
- Code lu : `parcours-detail.tsx` (lien d'étape, carte de progression, `allerAEtape`), `parcours-step-card.tsx` (`decouperRepli`, « Aller au défi », cadenas, lien de fiche réservé), `config/textes/parcours.ts` (`DEFI_BOULOT`, `PROCHAINE_ETAPE_DISPONIBLE`), `implementation.md` (« Rendu itération 3 »).
- Non regardés un à un : les ~134 autres PNG (variantes de largeur des mêmes états, étapes de non-régression 2, pages entières). Les contrôles automatiques (185 PASS et 162 PASS) ne signalent rien. Les pleines pages à 375 (jusqu'à 7 000 px) sont réduites à la lecture : j'ai jugé le détail sur les captures d'élément.
Je ne touche à aucun code ni texte validé.

## 1. Statut de N2b, N4 et S1 à S9

| Point | Statut | Preuve |
|---|---|---|
| **N2b** « où j'en suis, quoi faire » | **CORRIGÉ** | `premium-375-page-haut-progression` et `premium-1280-page-haut-progression` : « La prochaine étape t'attend. » (lien souligné) puis « Étape 3 : Le couloir : quinze secondes », juste sous la barre, au premier écran. `premium-375-lien-etape-apres-clic` : l'étape 3 est ouverte, calée à 112 px sous la barre de 65 px, titre et « Aller au défi » visibles, étape 2 repliée au-dessus. Code : `<a href="#etape-N">` à `min-h-[44px]`, anneau de focus défini, `allerAEtape` ouvre, défile (mouvement réduit respecté) et donne le focus à l'en-tête. L'état « date future » garde `prochaineEtapeTexte` (vu : « dimanche 18 octobre »). Aucun « aujourd'hui » ajouté : conforme au rythme doux (spec s17 §5.1 règle 3). Le lien n'apparaît que si la date est passée et qu'une étape reste à faire. |
| **N4** version sans risque visible | **CORRIGÉ** | Les 6 étapes vues avec l'encadré titré « Version sans risque », placé avant « Alors, ce défi ? » : étape 1 (`premium-375-retour-exercice`), 2, 3, 4, 5, 6 (1280 entières, 375 pour 3 et 6). Coupes vues : « Pas de réunion en vue… », « Pas de mail pro à envoyer aujourd'hui ? », « Pas de couloir aujourd'hui… », « Pas d'afterwork à venir ? », « Personne ne te le demande aujourd'hui ? », « Aucun pot en vue ? ». Étape 5 : la citation « tu fais quoi dans la vie ? » reste dans le défi principal, la coupe tombe sur la bonne phrase. Les quatre parcours en ligne n'ont ni encadré ni lien (étapes 1 vues : Machine à Café 375, Confiance 768). |
| **Lien « Aller au défi »** | **CONFORME** | Étapes 1 à 6 : lien sous la ligne XP, hors de l'en-tête qui se replie, cible 44 px (`min-h-[44px]`). `premium-375-etape3-aller-au-defi` : « Exercice pratique » à 112 px, sous l'en-tête collant, rien de masqué. Lien natif `#etape-N-defi` : l'ancre n'entre pas dans le motif `#etape-N` de `readHashStep`, donc aucun effet sur l'ouverture d'étape à la relecture de l'URL. |
| **S1** (carte « prochaine étape » sans numéro) | **CORRIGÉ** | Traité par N2b. |
| **S2** (XP à gauche sous 640 px) | **CORRIGÉ** | `premium-375-page-haut-progression` : « 700 XP au total, dont 100 de bonus à la / dernière étape » aligné à gauche. Le retour à la ligne reste (« à la / dernière étape »), sans orphelin à droite. À 768 et 1280 : une ligne, à droite. |
| **S3** (erreur pleine page, XP masqué) | **CORRIGÉ**, une remarque (S10) | `premium-375-erreur-chargement` : plus de vide, plus de ligne XP, alerte « Ta progression est intacte. » + « Réessayer » de 44 px. `…-erreur-chargement-page` : étape 1 ouverte avec son contenu, aucun « Voir l'offre Premium », aucun « Lecture libre » (code : badge réservé au visiteur). Voir S10 pour le bas de l'étape. |
| **S4** (un seul cadenas) | **CORRIGÉ** | `premium-375-etape2-ordre-conseille` : un cadenas (rond à gauche), « Termine l'étape 1 pour débloquer ». Aperçu visiteur (`regression/repartie-375-visiteur-apercu-etape2`) : cadenas à gauche + chevron, normal. |
| **S5** (place du lien de fiche) | **CORRIGÉ** au code, non visible en capture | `parcours-step-card.tsx` : bloc `aria-hidden` de 44 px sous le conseil quand le repli seed n'a pas encore l'identifiant, remplacé par le lien (même hauteur). `visiteur-375-etape1` : « Lire la fiche du conseil » présent après l'appel. Un décalage évité ne se prouve pas par une capture fixe. Si l'appel échoue, un blanc de 44 px reste sous le conseil : sans gravité. |
| **S6** (quiz avec explication) | **CORRIGÉ** | `visiteur-375-etape1-quiz-question-repondue` : A en rouge avec croix, B en vert avec coche (pas la couleur seule), « Pas tout à fait. La bonne réponse : … », explication lettre par lettre, « Question suivante ». La promesse « Les explications sont là pour ça » (`visiteur-375-etape1-quiz-repondu`) est maintenant prouvée. |
| **S7** (gras du libellé « DÉFI X » sur 2 parcours) | **Inchangé, arbitrage @design** | Étape 1 de Machine à Café et de Confiance : libellé en normal. Boulot et Storytelling : en gras. Non repris dans cette demande. |
| **S8** (hub avec Boulot publié) | **CORRIGÉ** | `visiteur-375-hub-haut` : « 5 parcours pour progresser en humour, chacun taillé pour une situation : Machine à Café, Répartie, Confiance, Storytelling et Boulot. Compte 15 à 20 min/semaine selon le parcours ». Sans Boulot (`regression/hub-375-visiteur-haut`) : « 4 parcours … Machine à Café, Répartie, Confiance et Storytelling ». |
| **S9** (captures en 768) | **CORRIGÉ** | Boulot en 768 (page haute, étapes, fin) et 12 captures 768 des 4 parcours. Vues : `regression/repartie-768-visiteur-page-haut`, `confiance-768-visiteur-etape1` : colonne unique, aucun débordement, boutons du défi en ligne. |

## 2. Les 4 réserves sur les fins de parcours

| # | Réserve | Statut |
|---|---|---|
| 1 | Boucle Machine à Café, Storytelling, Machine à Café | **LEVÉE**. `premium-375-fin-storytelling-apres-machine-a-cafe-carte` : compte qui a fini Machine à Café puis Storytelling, la carte propose « Passer au parcours Répartie ». Test `pickSuite` (SU-04) d'accord. |
| 2 | Fins avec Boulot publié | **LEVÉE pour Machine à Café et Boulot**. `premium-375-fin-machine-a-cafe-boulot-publie-carte` : « Passer au parcours Boulot », accroche de Boulot, cible `?src=suite`. Boulot vers Storytelling : `premium-375-fin-parcours-carte`. Non capturés avec Boulot publié : Répartie, Confiance et Storytelling ; la spec §5.5 range `pro` en dernier pour ces trois, et le test `pickSuite` ne le contredit pas. Risque très faible. |
| 3 | Confiance garde Répartie avant Machine à Café (COP-11 d) | **Inchangée**, invisible tant qu'une seule suite s'affiche. |
| 4 | Répartie vers Storytelling sert moins Yanis | **Inchangée**, hors défaut (spec §5.5, 6e parcours à la roadmap). |

## 3. Défauts neufs introduits par l'itération 3

Bloquants : **aucun**.

| # | Capture ou code | Symptôme | Gravité | Correction proposée |
|---|---|---|---|---|
| S10 | `premium-375-erreur-chargement-page` (fin de l'étape 1) et `parcours-step-card.tsx` l.509-511 | Dans l'état d'erreur de chargement, l'étape 1 est un repli seed et finit par « Le suivi de ta progression arrive bientôt sur ce parcours. » (texte lu en réduction, confirmé par le code : abonné + repli seed). Juste au-dessus de la page, l'alerte dit « Ta progression est intacte. » : deux messages contradictoires, et la phrase « arrive bientôt » laisse croire à une fonction absente. Texte antérieur à s19 (la capture S3 le met en évidence). N'arrive qu'en cas d'échec de l'API pour un abonné. | Faible | Ne pas afficher cette ligne quand `loadFailed` (aucun texte neuf). À faire confirmer par @qa avec une capture rognée du bas de l'étape. |
| S11 | `premium-375-page-haut-progression` | « Étape 3 : Le couloir : quinze secondes » : deux fois « : » quand le titre en contient un (étapes 3 et 4 de Boulot). Lisible, un peu lourd. | Faible | Séparer par un point médian, déjà dans la maison (« 6 semaines · 15 min/semaine », « PARCOURS BOULOT · 6 SEMAINES ») : « Étape 3 · Le couloir : quinze secondes ». Aucun mot neuf, mais l'arbitrage disait « Étape N : titre » : à Thomas ou @design, sinon on garde. |
| S12 | `parcours-detail.tsx` l.637-650 | Seule la première ligne du lien est soulignée et colorée ; la ligne « Étape 3 : … » a l'allure d'un texte et ne montre pas qu'elle est cliquable. La classe `group` est posée sans `group-hover`. | Faible | Souligner l'ensemble au survol et au focus (`group-hover:underline` sur la seconde ligne). Tout le bloc reste cliquable. |
| S13 | `premium-375-lien-etape-apres-clic`, `premium-1280-page-haut-progression` | « Aller au défi » : environ 40 px de blanc au-dessus et au-dessous (cible de 44 px + `space-y-6`). Le lien flotte entre l'en-tête et « Pourquoi cette étape ? ». | Très faible | Marge négative de 8 px haut et bas sur le lien (la cible de 44 px reste intacte). Arbitrage @design. |
| S14 | `parcours-detail.tsx` `allerAEtape`, lien « Aller au défi » | Aucun événement mesurable : `etape-ouverte` ne part pas quand l'étape est déjà ouverte (cas courant, c'est l'étape à faire), et « Aller au défi » n'a aucun événement. On ne saura pas si N2b et N4 servent. | Faible | Ajouter deux événements au schéma Umami avec motifs fermés (par exemple `lien-etape-clic`, `defi-lien-clic`, propriétés `parcours`, `etape`), noms à valider par @data-analyst. |

À vérifier par @qa, non visible en capture : clavier complet sur le lien d'étape (Tab, Entrée : le focus doit arriver sur l'en-tête de l'étape avec un anneau visible, comme après une validation) ; les captures sont prises à la souris, où l'anneau de focus programmatique n'apparaît pas (`premium-375-lien-etape-apres-clic`).

## 4. Changements visibles sur les 4 parcours en ligne au prochain déploiement

Ce ne sont pas des régressions, ce sont des changements voulus par l'arbitrage (« tous parcours »), indépendants de `BOULOT_PUBLIE`. À consigner dans `REPLIT_ACTIONS.md` : lien « La prochaine étape t'attend. » avec « Étape N : titre » (vu sur les 4 pages hautes Premium en cours), un seul cadenas sur l'étape verrouillée par l'ordre, total d'XP à gauche sous 640 px, ligne XP masquée en erreur, « En 6 semaines » lié, gluon invisible après les traits d'union d'impératif (« Choisis-en »). Rien d'autre ne bouge : aucun « Aller au défi » ni « Version sans risque » hors Boulot.

## 5. Non-régression des 4 parcours en ligne

**10/10 sur ce qui est regardé : aucune régression, aucun bloquant.**
- **Pages hautes Premium en cours** (Machine à Café 1/3, Répartie 1/4, Confiance 1/6, Storytelling 1/6) : barre, total d'XP à gauche, lien d'étape avec le bon titre (« Sentir le bon moment », « Le rythme et les silences », « Rire de toi sans te rabaisser », « Des personnages qu'on entend »), « Le programme » au premier écran, étape 2 ouverte juste dessous. Durée « 15 min/semaine » ou « 20 min/semaine » dans l'en-tête.
- **Étape 1 visiteur** (Machine à Café 375, Confiance 768) : conseil, exemple, défi, « Alors, ce défi ? », vannes en encart Premium, vidéos, quiz, bouton en contour, aucun bloc vide, aucun « undefined ».
- **Aperçu de l'étape 2** (Répartie 375, Storytelling 1280) : cadenas, « Fait partie de Premium », scène au même corps que l'étape ouverte, « Voir l'offre Premium » de 44 px, réassurance « 2,99 €/mois, sans engagement. ». Ni conseil, ni vannes, ni quiz.
- **Hub** : 4 parcours, Boulot absent, intro à 4 noms.
- **Carte de fin Storytelling** (1280) : 6 étapes, 800 XP, « Passer au parcours Machine à Café ». Conforme.
- **S7** (gras du libellé « DÉFI ») reste le seul écart visuel entre parcours.

## 6. Réserves sur la couverture

- 36 PNG sur 170 regardés ; les 134 autres sont des variantes de largeur ou des états voisins, couverts par les contrôles automatiques (185 + 162 PASS). Pour la non-régression, 11 sur 72 : l'étape 2 Premium et les cartes de fin des trois autres parcours n'ont pas été rouvertes (vues à l'itération 2, composants inchangés depuis hormis l'ensemble listé au §4).
- Les pleines pages 375 sont illisibles en réduction : S10 repose sur une lecture floue plus le code.
- Non capturés : connexion lente, retour après 30 jours, « bof » et « pas encore essayé » (hérité de l'itération 2).

## 7. Conditions de publication (pas de déploiement masqué)

| # | Condition | Qui | État |
|---|---|---|---|
| 1 | N5 : le quiz « Au boulot, en réunion, à la pause » n'envoie pas vers Boulot | Thomas | Ouvert (hors note) |
| 2 | N7 : « Environ 20 min » (étape 6) contre « 15 min/semaine ». Le hub dit déjà « 15 à 20 min/semaine selon le parcours » | Thomas | Ouvert (hors note) |
| 3 | Microcopy N2b et N4 | Thomas | **Fermé** (arbitrage délégué du 11/10) |
| 4 | Captures d'activation : fins avec Boulot publié, hub à 5 noms, Machine à Café puis Storytelling | @qa | **Fermé** (§2, S8) |
| 5 | Visionnage des 10 vidéos, revue des descriptions de `m30qZa8p_Js` et `qdqIc-uzdbA` | Thomas | Ouvert |
| 6 | Déployer même masqué active déjà dans le catalogue les 6 conseils et 10 vannes neuves (`implementation.md`, « Ce qui reste », point 2) | Thomas | À confirmer avant le déploiement |

## 8. Audit heuristique Nielsen 10 (rendu itération 3)

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état | PASS | Barre 2/6, « +50 XP gagnés ! », date conseillée, « Termine le quiz pour valider cette étape », « Termine l'étape 1 pour débloquer ». |
| H2 | Vocabulaire du persona | PASS | « Version sans risque », « Aller au défi », « vanne », « afterwork », tutoiement. |
| H3 | Contrôle et annulation | PASS | Étapes dépliables, quiz refaisable, retour d'exercice modifiable, aucun blocage dur. |
| H4 | Cohérence | PASS avec réserve | Même squelette sur 5 parcours ; S7 ; encadré et lien réservés à Boulot (assumé). |
| H5 | Prévention d'erreurs | PASS | Bouton en contour tant que le quiz n'est pas fini ; cible de 44 px sur les liens. |
| H6 | Reconnaissance plutôt que rappel | **PASS** (était PARTIEL) | « Étape 3 : Le couloir : quinze secondes » nommée dans la carte, cliquable. |
| H7 | Raccourcis experts | **PASS** (était PARTIEL) | « Aller au défi », lien d'étape, ancres `#etape-N`. |
| H8 | Minimalisme | PASS | Colonne unique, un seul bouton plein par état ; le repli en encadré rend le défi principal plus court (étape 6 : encore dense, accepté). |
| H9 | Messages d'erreur humains avec solution | PASS avec réserve | « Ta progression est intacte. » + « Réessayer » ; S10. |
| H10 | Aide dans le flux | PASS | « Pourquoi cette étape ? », exemple, version sans risque, explications du quiz. |

### Cognitive walkthrough (Sophie, abonnée de retour à l'étape 3, mobile 375)

| Étape | Sait-elle quoi faire ? | Résultat |
|---|---|---|
| Arrivée | Barre 2/6, « La prochaine étape t'attend. », « Étape 3 : Le couloir… » au premier écran | OUI |
| Action | Le lien est souligné, un tap ouvre l'étape et la cale sous la barre | OUI (S12 : seconde ligne sans affordance) |
| Défi long (étape 6) | « Aller au défi » ou lecture ; « Version sans risque » visible avant les boutons de retour | OUI |
| Pas de couloir aujourd'hui | Le repli ouvre par la question qui la décrit (« Pas de couloir aujourd'hui… ? ») | OUI |
| Retour d'exercice | 3 boutons de 44 px, réponse immédiate | OUI |
| Erreur de chargement | Message rassurant et « Réessayer » ; ligne contradictoire en bas d'étape | [FRICTION H9] : S10 |

### HEART (alimente `kpi-framework.md` via @data-analyst)

| Dimension | Signal | Cible | Mesure |
|---|---|---|---|
| Task success | Clic sur le lien d'étape suivi d'une validation dans la même session | à suivre, pas de cible inventée | événement à créer (S14) puis `parcours-etape` |
| Engagement | Retour d'exercice noté après lecture du repli | à suivre | `etape-retour`, `defi-lien-clic` (S14) |
| Retention | Étape N+1 validée dans les 14 jours | à suivre | `etape-ouverte` avec `conseillee` |
| Adoption | Entrée sur Boulot depuis la fin de Machine à Café | à suivre dès 30 cas | `suite-clic` |

## Handoff

---
**Handoff → @orchestrator (puis @fullstack, @qa, @design selon les lignes)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-3-ux.md`
- Notes : Boulot **10/10** (0 bloquant) ; non-régression **10/10** (0 régression). N5 et N7 hors note.
- Décisions prises : N2b et N4 **corrigés** ; S1 à S6, S8 et S9 **corrigés**, S7 inchangé (arbitrage @design) ; réserves 1 et 2 des fins de parcours **levées**, 3 et 4 inchangées. **GO au déploiement masqué** (`BOULOT_PUBLIE = false`). GO à la publication sous la décision de Thomas sur N5 et N7, le visionnage des vidéos et l'accord sur l'activation des conseils et vannes au déploiement.
- Points d'attention : (1) @fullstack, facultatif : S10 (masquer « arrive bientôt » en cas d'échec de chargement), S12 (survol du lien d'étape), S14 (deux événements, noms avec @data-analyst) ; (2) @design : S11 (point médian ou non), S13, S7 ; (3) @qa : clavier sur le lien d'étape, capture rognée du bas de l'étape en erreur (S10), fins de Répartie, Confiance et Storytelling avec Boulot publié (couverture, non nécessaire au GO) ; (4) consigner dans `REPLIT_ACTIONS.md` les changements du §4 qui touchent les 4 parcours en ligne ; (5) Thomas : N5, N7, vidéos, accord sur l'activation en catalogue ; (6) rien n'a été modifié dans le code ni les textes validés ; l'historique des interventions de `project-context.md` reste à compléter par la session principale.
---
