# Plan d'exécution de la relance des réseaux : 12/10/2026 au 28/03/2027 (cycle 1, s15, 05/10/2026)

> Autonome. Sources : `strategie-relance-v5.md`, `horaires-sources-s15.md`, `mesure.md`, `validation-thomas-s15.md`, `founder-preferences.md` (01/10 et 05/10), `production-trimestrielle.md`, `calendrier-editorial-q4-2026.md`, `preparation/lot-relance-s15.md` (dry-run, commit `9ca796e`), `preparation/stock-vannes-resultat-s15.md`. Dates exactes, heures de Paris. `[HYPOTHÈSE]` = à confirmer. Aucun humain opérationnel : tout passe par une session Claude Code, Thomas n'intervient que pour ce qui exige son téléphone, son compte ou son jugement (§5).
> Période : 24 semaines (lun. 12/10/2026 à dim. 28/03/2027), 284 posts : X 118, Instagram 118, LinkedIn 48 (5 + 5 + 2 par semaine, moins les silences du 11/11 et du 27/11). Lot dry-run : 140 posts jusqu'au 03/01 ; reste 144 posts du 04/01 au 28/03.

## 0. Trous trouvés et décisions à prendre

| # | Trou | Chiffre | Réponse |
|---|---|---|---|
| T1 | Stock de vannes à l'aveugle | 125 actives, 41 au niveau chez les 2 relecteurs (>= 8,5), 74 à la note d'Alexa (moyenne >= 8,25), 87 à >= 8. Le lot en publie 111 jusqu'au 03/01 | Épuisé le 13/11 (41), le 07/12 (74), le 17/12 (87) : §1.3 |
| T2 | Lundis sans article | 12 lundis du 04/01 au 22/03 (le calendrier Q4 s'arrête le 28/12, aucun calendrier Q1) | §3 |
| T3 | Jeudis sans article | 13 jeudis (15/10, 10/12, 07/01 à 18/02, 04/03 à 25/03) ; un seul article 2027 dans la période (25/02) ; 17/12, 24/12, 31/12 couverts par pivots | §3 |
| T4 | Fiches de décryptage (cartes 3 et 4) | 8 manquantes (04/11 à 30/12) + 12 pour les mercredis 06/01 à 24/03 = 20 ; 5 citations d'humoriste à fournir (04/11, 02/12, 06/01, 03/02, 03/03) | §1.4 |
| T5 | Lignes d'article non notées | aucune note exploitable par le script : les relais prennent une vanne du catalogue (13 posts du lot seulement en lignes d'article) | §1.4 |
| T6 | 2 formules de renvoi non relues | 24 posts (13 X et LinkedIn, 11 Instagram) | relecture à l'aveugle avant insertion (09/10) |
| T7 | 3 vannes collées dans 2 articles en base | `soiree-de-noel-entreprise-humour` n°5 et n°6 (publié 16/11), `etre-drole-sans-alcool-soiree` n°3 (publié 21/12) | correction `import-article.ts --update` avant le 23/10 |
| T8 | Bug limite X 270 (URL comptée en entier) | tout post X avec lien échouerait ; correctif non déployé | déployer avant la reprise de X (§4) |
| T9 | Aucun déclencheur ni alerte « file basse » | rien ne lance les lots de novembre à mars ; rien ne prévient si la file se vide | §2.3 |
| T10 | Conditions de J0 non vérifiées | C2 (test dans chaque application), C3 (`/liens` 3 routes en ligne `[À VÉRIFIER]`), liens de bio posés `[À VÉRIFIER]` | §4.1 |

**Décisions à demander à Thomas en un seul message (défauts proposés, 5 min)** :
- D1 barre vannes = **note d'Alexa chez les mêmes relecteurs (>= 8,25 de moyenne, 74 vannes), les 41 meilleures d'abord, production de vannes neuves** (§1.3, option O3).
- D2 plan B pré-autorisé : si la production de vannes manque son objectif le 30/10, jusqu'à 2 emplacements vanne par semaine (le vendredi X et Instagram) passent en cartes « conseil » du catalogue validé s14, après validation de 3 étalons (§1.3, O4).
- D3 Q1 2027 : un article par lundi (12) au lieu de deux par semaine, relais X du jeudi sur une 2e ligne du lundi, et tout article au gabarit de l'étalon S8 publié sans validation individuelle (§3).
- D4 réponses aux commentaires et messages : 2 passages de 10 min par semaine par Thomas, ou aucun (§5).
- D5 autorisation de déployer le correctif X et GO de reprise conditionnelle (§4.1).

## 1. Stock et besoin de contenu

### 1.1 Règle de calcul
Emplacements « vanne » par semaine : X 5 (le relais porte une vanne), Instagram 5, LinkedIn 1 = **11** ; LinkedIn a en plus 1 texte neuf (relais ou situation). Total période : 124 emplacements du 12/10 au 03/01 (dont 13 en ligne d'article, **111 vannes du catalogue**, observé au dry-run), puis 132 du 04/01 au 28/03. Noël (4 vannes réservées) et les silences (11/11, 27/11) sont déduits. Un relais n'allège le catalogue que si une ligne d'article notée (>= 8,25) existe : sinon il prend une vanne du thème.

### 1.2 Semaine par semaine
| S | Lundi | Article lundi | Article jeudi | Empl. vanne | LI neuf | Fiche décryptage (mercredi) |
|---|---|---|---|---|---|---|
| 1 | 12/10 | `se-presenter-avec-humour` | aucun (15/10) : vanne | 11 | 1 (L3 fait) | 14/10 IG3 faite |
| 2 | 19/10 | coloc | 22/10 anniversaire | 11 | 0 | 21/10 fiche de l'article Halloween |
| 3 | 26/10 | IA assistants vocaux | 29/10 appli de rencontre | 11 | 1 (L2 fait) | 28/10 fiche d'article, citation absente (repli) |
| 4 | 02/11 | visio | 05/11 couple (hors n°18) | 11 | 1 | **04/11 manque** + citation |
| 5 | 09/11 | chambrer | 12/11 vœux | 9 (silence 11/11) | 1 | aucune |
| 6 | 16/11 | soirée de Noël | 19/11 invitation | 11 | 1 | **18/11 manque** |
| 7 | 23/11 | repas de famille | 26/11 gamer | 9 (silence 27/11) | 1 | **25/11 manque** |
| 8 | 30/11 | toast | 03/12 mot de départ | 11 | 1 | **02/12 manque** + citation |
| 9 | 07/12 | enfants | aucun (10/12) : vanne | 11 | 1 | **09/12 manque** |
| 10 | 14/12 | jeux de répartie | 17/12 pivot X (refonte 2027) | 11 | 0 | **16/12 manque** |
| 11 | 21/12 | sans alcool | 24/12 Noël (4 réservées) | 7 | 0 | **23/12 manque** |
| 12 | 28/12 | résolution | 31/12 pivot vœux | 11 | 1 | **30/12 manque** |
| 13 | 04/01 | **aucun** (ligne vœux, sans lien) | aucun | 11 | 1 | **06/01 manque** + citation |
| 14 à 16 | 11/01, 18/01, 25/01 | **aucun** | aucun | 11 par semaine | 1 par semaine | **3 manquent** (13, 20, 27/01) |
| 17 à 19 | 01/02, 08/02, 15/02 | **aucun** | aucun | 11 par semaine | 1 par semaine | **3 manquent** (dont 03/02 + citation) |
| 20 | 22/02 | **aucun** | 25/02 poisson d'avril | 11 | 1 | **24/02 manque** |
| 21 à 24 | 01/03, 08/03, 15/03, 22/03 | **aucun** | aucun | 11 par semaine | 1 par semaine | **4 manquent** (dont 03/03 + citation) |

Avec la reco §3 (un article chaque lundi du 04/01 au 22/03), chaque semaine 2027 gagne 3 lignes d'article (X lundi, Instagram lundi, X jeudi) : 8 emplacements vanne au catalogue au lieu de 11.

### 1.3 Stock de vannes : le vrai trou
- **Mesure du 05/10** (2 relecteurs, 111 vannes, Alexa = 8,32 et 8,16 chez eux) : 41 au niveau chez les 2 ; 48 en moyenne >= 8,5 ; 74 >= 8,25 ; 87 >= 8. Les 14 vannes hors lot ne sont pas notées : aucune réserve.
- **Épuisement** (9,25 vannes par semaine, lot actuel) : barre stricte 41 = fin de la semaine du 09/11 ; 74 = semaine du 30/11 ; 87 = semaine du 14/12 ; les 111 = 03/01. Ensuite la règle des 90 jours rend une vanne réutilisable : celles de la semaine 1 reviennent le 11/01, celles de la semaine 11 le 22/03, soit 9 retours par semaine environ.
- **Besoin sans article en 2027** : 11 par semaine contre 9 retours : déficit croissant, 19 à 28 vannes de plus avant le 28/03. **Avec un article par lundi** : 8 par semaine, couvert par les retours.
- **Options pour Thomas**
  - **O1 stricte** (>= 8,5 chez les 2, 41 vannes) : au-dessus de la barre d'Alexa elle-même (8,24 en moyenne chez ces relecteurs) ; exige 70 vannes neuves, environ 560 candidats. Non retenue.
  - **O2 >= 8** (87) : 0,24 sous Alexa en lecture relative, contraire au « rien en dessous » du 30/09 ; couvre jusqu'au 17/12, puis le trou revient. Non retenue.
  - **O3 par défaut** : barre = Alexa relative (>= 8,25 de moyenne, aucune note sous 8 chez l'un), **ordre d'usage : les 41 d'abord** (semaines 1 à 5, celles du jugement J+28), puis les 33 suivantes (semaines 5 à 8), puis les neuves. Production **V1 = 45 vannes livrées le 23/10** (37 pour les semaines 9 à 12 + 8 pour la semaine 13) et **V2 = 15 vannes livrées le 15/01** (marge et variété). Méthode s14 : plusieurs candidats par emplacement, 2 critiques, départage, vérification « jamais entendue ». Volume `[HYPOTHÈSE : 13 % des candidats passent la barre relative (19 % s14 x 67 % observé), soit 8 candidats par vanne : V1 = 360 candidats, V2 = 120]`. Insertion en base `isActive`, `copyVerdict = GARDER`, décryptage rempli (elles enrichissent aussi le site).
  - **O4 complément (plan B, D2)** : cartes « conseil » (88 conseils validés s14) sur 2 emplacements du vendredi par semaine : besoin de vannes de 11 à 9 par semaine, 48 vannes économisées sur la période. Exige 3 étalons validés par Thomas (règle P0 s8, 10 min) et change la part de vannes (50 % à 33 %), d'où la décision préalable. Déclencheur : V1 < 40 vannes retenues le 30/10.
- **Contrôles du script** (déjà prévus, à conserver) : registre 90 jours tous réseaux, « pain » 30 jours, réservées Noël avant le 24/12, blocage si stock éligible < 7. Ajout demandé à @fullstack : option `--pool <fichier>` (liste blanche ordonnée par note) pour refaire le lot 1 et le lot 2 avec la barre O3.

### 1.4 Textes neufs : combien, qui, quand
| Texte | Volume | Produit par | Livré au plus tard |
|---|---|---|---|
| Notes des lignes d'article (compilation des `-aveugle.md` dans `lignes-articles-notes.json`) | 20 articles Q4 | @copywriter | 09/10 (articles de S1 à S5), 06/11 (le reste) |
| 2 formules de renvoi, relues à l'aveugle (2 relecteurs) | 2 (24 posts) | @copywriter + 2 relecteurs | 08/10 |
| Fiches de décryptage (cartes 3 et 4, R2, 2 candidats, 2 relecteurs) | 8 (04/11 à 30/12) | @copywriter | 23/10 (la fiche du 04/11 est remise à Buffer vers le 24/10) |
| Fiches Q1 | 12 | @copywriter | 18/12 (4), 22/01 (4), 19/02 (4) |
| Citations d'humoriste réelles et sourcées (@copywriter vérifie) | 5 | @copywriter | 23/10 (04/11), puis 6 jours avant chaque 1er mercredi ; repli sans citation |
| LinkedIn : relais ou situation de bureau, duel à 3 candidats | 19 (7 de novembre à janvier dont relais, 12 de janvier à mars) | @copywriter | avec chaque lot |
| Légendes Instagram « À envoyer à... » (80 caractères) | environ 60 pour 2027 | @copywriter | avec chaque lot |
| Corrections des 3 vannes collées | 2 articles | @copywriter + @seo | 23/10 |
Gel : tout post du lot se modifie en base au plus tard 14 jours avant sa date (les 11 jours précédents sont déjà chez Buffer, plafond 8 posts par canal `[À VÉRIFIER @fullstack : une mise à jour après remise ne corrige pas Buffer]`).

### 1.5 Relais d'articles : y en a-t-il chaque lundi ET jeudi ?
Non. Lundis : oui du 12/10 au 28/12 (12), puis plus rien. Jeudis : 7 du 22/10 au 03/12, puis 25/02 seulement. Remplacement : voir §3. Le dry-run montre que même quand l'article existe, 24 relais sur 28 ont pris une vanne du catalogue faute de ligne notée (T5) : la compilation des notes (09/10 et 06/11) est donc la mesure la plus rentable pour le stock.

## 2. Chaîne de production récurrente

### 2.1 Lots (dates exactes, prêt = inséré APPROVED, noté, vérifié)
| Lot | Posts | Lancement | Prêt au plus tard | Marge | Particularité |
|---|---|---|---|---|---|
| 1 | lun. 12/10 au dim. 15/11 | 05/10 (en cours) | ven. 09/10 | 3 j (exception : relance décidée le 05/10) | 41 meilleures vannes, renvois relus, fiche du 04/11 par mise à jour avant le 23/10 |
| 2 (novembre et décembre) | lun. 16/11 au dim. 03/01 | lun. 26/10 | ven. 06/11 | 10 j | vannes V1, fiches 18/11 à 30/12, correction des 3 vannes collées, Noël, pivots |
| 3 (janvier) | lun. 04/01 au dim. 31/01 | lun. 14/12 | ven. 18/12 | 17 j | après J+56 (07/12) ; articles Q1 prêts le 11/12 ; Noël sans travail |
| 4 (février) | lun. 01/02 au dim. 28/02 | lun. 11/01 | ven. 22/01 | 10 j | V2 livrée le 15/01 ; poisson d'avril 25/02 |
| 5 (mars) | lun. 01/03 au dim. 28/03 | lun. 08/02 | ven. 19/02 | 10 j | heure d'été le 28/03 testée dans le lot 6 |
| 6 (avril, préparation) | lun. 29/03 au dim. 02/05 | lun. 08/03 | ven. 19/03 | 10 j | pivot poisson d'avril 01/04, articles Q2 |

### 2.2 Recette d'un lot (une session de pilotage, sous-agents en parallèle)
1. **Stock** : @fullstack lit la base (Neon HTTP, TCP bloqué en session) : vannes éligibles par date sur 90 jours, articles de la période publiés ou programmés, stock < 14 = alerte rouge.
2. **Tirage** : `prepare-social-month.ts --lot <id> --pool <fichier>` en dry-run, **contrôles bloquants = 0 erreur** (tirets, gros mots, « je » hors « », 270 caractères X avec lien compté 23, légende 80, LinkedIn 3 phrases, registre 90 jours).
3. **Textes neufs** (§1.4) par @copywriter.
4. **Relecture à l'aveugle** : 2 relecteurs notent les vannes tirées et les textes neufs contre Alexa ; un texte sous la barre est remplacé (jamais réécrit sur place).
5. **Contrôle** : @reviewer (conformité : tirets, mention IA, humoristes cités vérifiés), @qa (comptage par réseau et par semaine, UTM, dimanches, heure Paris en UTC avec changement d'heure), **mesure du diff réel** (règle P0 s11).
6. **Insertion** `--insert --driver=neon-http` en APPROVED, puis contrôle : posts insérés = posts du dry-run, par réseau et par semaine.
7. **Traçabilité** : commit, ligne `REPLIT_ACTIONS.md`, 5 lignes à Thomas (ce qui est prêt, jusqu'à quelle date, stock restant). Rien d'attendu de lui.
8. **Reprise** : si un réseau est en pause, l'interrupteur n'est rouvert qu'après les contrôles 1 à 6.

### 2.3 Déclenchement fiable (trois filets indépendants)
- **Routines planifiées de Claude Code** (exécution dans le cloud d'Anthropic sans machine allumée, déclencheur planifié, intervalle minimal 1 heure : [Builder.io](https://www.builder.io/blog/claude-code-routines), [MakerKit](https://makerkit.dev/blog/tutorials/claude-code-routines-guide)) `[À VÉRIFIER : offre de Thomas, accès au dépôt, secrets Neon / Buffer / ADMIN_PASSWORD dans l'environnement de la routine]`. Test d'essai le **mer. 07/10** (la routine lit la base et écrit un fichier). Quatre routines : lancement de lot (dates §2.1, une fois chacune), **contrôle du lundi** (07:30 UTC, §6), **garde des articles** (lundi et jeudi 05:30 UTC, §4.3), vérification d'après-publication (§4.1, 3 occurrences uniques).
- **Alerte « file basse » dans le Worker** (demande @fullstack, `REPLIT_ACTIONS.md`) : si le dernier post APPROVED d'un réseau est à moins de 10 jours, e-mail à `ADMIN_EMAIL` avec le texte du prompt de relance à coller, 1 par jour. C'est le filet si les routines ne tournent pas.
- **Garde dans le contrôle du lundi** : un lot non prêt à J-10 de sa date de prêt, ou stock < 14, ouvre une issue GitHub (notification e-mail native).
- Plan B sans routine : Thomas reçoit l'e-mail de file basse et colle le prompt (1 min, §5).
- Buffer : la file n'est pas le stock (8 posts remis au plus par canal : environ 11 jours pour X et Instagram, 28 jours pour LinkedIn) ; **le stock est la base**, la tâche quotidienne remet au fil de l'eau.

## 3. Dépendance au blog
- **État** : lundis programmés jusqu'au 28/12, jeudis jusqu'au 03/12, puis 25/02, 22/04, 13/05, 03/06 (`founder-preferences.md` 05/10). Génération IA coupée (`CONTENT_GENERATION_ENABLED` ≠ "true") : tout article 2027 est écrit en session.
- **Reco (D3)** : 12 articles, un chaque lundi du 04/01 au 22/03, plus l'article du 25/02. Jeudi : X relaie une 2e ligne de l'article du lundi (moins de 7 jours, lien autorisé, v5 §1) ; Instagram jeudi = carte vanne sans « lien en bio » (plus de 48 h) ; LinkedIn mardi relaie l'article du lundi si l'angle est le travail. Thomas a ouvert la porte (« un article par semaine », 05/10). Saint-Valentin est le dimanche 14/02 : `[HYPOTHÈSE]` article du 08/02 sur ce thème, choisi par @seo.
- **Qui et quand** : @seo livre `docs/seo/calendrier-editorial-q1-2027.md` (12 lundis, mots-clés distincts, maillage, risque de cannibalisation) le **lun. 02/11** ; @copywriter produit en lot du 09/11 au 04/12, notes de lignes comprises, avec 2 critiques à l'aveugle et départage ; **les 12 articles sont insérés `isPublished=false`, `publishedAt` le lundi, par `import-article.ts`, au plus tard le ven. 11/12** (avant le lot 3). Publication automatique le lundi 05:00 UTC par `weekly-seo`.
- **Impact** : un article qui glisse retire ses lignes du lot ; chaque relais a un repli (vanne du même thème sans lien, §4.3). Le rendement des réparties est d'environ 4 % : prévoir environ 1 500 candidats pour 12 articles, c'est la charge de relecture la plus lourde du plan (risque R5).
- **Refonte 2027** de `meilleures-blagues-droles-2026` du 15 au 20/12 : vérifiée le 16/12 par la garde ; sinon le pivot X du 17/12 devient une vanne simple (v5 §1).

## 4. Exploitation et incidents

### 4.1 Reprise et vérifications (J0 = lun. 12/10 pour les trois, `[HYPOTHÈSE]` si les conditions sont réunies)
| Étape | Date | Qui | Condition ou contrôle |
|---|---|---|---|
| Tests C2 dans X, Instagram, LinkedIn (+ Safari et Chrome) et liens de bio `/liens/x`, `/liens`, `/liens/li` | avant le dim. 11/10 | Thomas (15 min) | inscription e-mail aboutit dans l'application ; Google désactivé seulement si l'échec est reproduit |
| Déploiement du correctif X 270 + routes `/liens` si absentes | jeu. 08/10 | session, après D5 | `tsc`, lint, build, tests ; `wrangler rollback` prêt |
| Lot 1 inséré, vérifié chez Buffer (`channels` connectés, 3 canaux) | ven. 09/10 | session | écart prévu/publié = 0 |
| **GO/NO-GO** | dim. 11/10 18:00 | session | C1 à C4, correctif déployé, lot 1 en base, canaux connectés ; sinon J0 = lun. 19/10 pour le réseau concerné (posts datés avant J0 sautés, v5) |
| Reprise **LinkedIn** (premier risque : jamais publié depuis août) | dim. 11/10 20:00 | session (interrupteur admin) | 1er post mar. 13/10 08:15 |
| Reprise **X** | dim. 11/10 20:15 | session | 1er post lun. 12/10 12:30 |
| Reprise **Instagram** (C3 obligatoire) | dim. 11/10 20:30 | session | 1er post lun. 12/10 19:30 |
| Vérification après 1re publication de chaque réseau | 12/10 12:45 (X), 12/10 19:45 (Instagram), 13/10 08:30 (LinkedIn) | routine + Thomas (2 min par réseau, regarder son fil) | statut Buffer `sent` et lien réel relu, UTM présent, carrousel à 2 images avec texte alternatif, aucun lien Instagram |
Si un 1er post échoue : le réseau est mis en pause automatiquement (alerte), correction, reprise après nouveau contrôle.

### 4.2 Alertes existantes et incidents
- **Alertes (e-mail `ADMIN_EMAIL`, 1 par jour et par réseau)** : échec Buffer, canal déconnecté (pause automatique), « prévu ≠ publié » dans le rapport du lundi ; à ajouter : file basse (§2.3).
- **Buffer se déconnecte** : pause automatique + e-mail ; Thomas reconnecte (3 min, sa connexion de compte) ; une session vérifie `channels`, rouvre l'interrupteur (les retards sont replanifiés à 1 par jour) ; les posts datés expirés de plus de 24 h sont REJECTED, pas rattrapés.
- **Lot non prêt** : à J-3 de la date de prêt, mode dégradé (cadence réduite 3/3/1 avec les seules vannes déjà notées) ; si rien n'est inséré, le réseau se vide proprement (aucun post vaut mieux qu'un post sous la barre) ; l'alerte file basse prévient 10 jours avant.
- **Heure d'hiver dim. 25/10** : le dry-run est testé ; contrôle lun. 26/10 : `sentAt` du post X = 11:30 UTC, Instagram 18:30 UTC, LinkedIn mar. 27/10 07:15 UTC. **Heure d'été dim. 28/03/2027** : à tester dans le lot 6 (lun. 29/03 12:30 = 10:30 UTC).
- **Plafond Buffer (10 par canal)** : remise de 8 au plus ; une erreur de plafond = alerte et nouvel essai le lendemain ; jamais de remise en rafale.
- **Retour arrière** : pause par réseau (immédiate, admin), suppression chez Buffer (`deletePost`) et REJECTED en base, `wrangler rollback` pour le code. Un post déjà publié se retire dans l'application du réseau : Thomas (2 min), seul cas.

### 4.3 Garde des articles (lundi et jeudi, 05:30 UTC)
Pour chaque relais du jour : article `isPublished` et page en 200 ; sinon la session supprime le post chez Buffer, le passe REJECTED et insère son repli (vanne du même thème sans lien, prévue au lot) avant 08:15 (LinkedIn) et 12:30 (X). Demande @fullstack : un post relais (`articleSlug`) n'est remis à Buffer que si l'article est publié, sinon bascule sur le repli.

## 5. Charge de Thomas (exhaustive, hors incident)
| Quand | Quoi | Durée |
|---|---|---|
| Avant le 08/10 | Répondre « ok défauts » à D1 à D5 | 5 min |
| Avant le 11/10 | Tests C2 sur téléphone (3 applications) et liens de bio | 15 min |
| 12/10 et 13/10 | Regarder le 1er post de chaque réseau | 3 x 2 min |
| lun. 26/10, 09/11, 07/12 | Jalons J+14, J+28, J+56 : 3 captures de statistiques natives (X, Instagram, LinkedIn) + réponse à la fiche de décision | 3 x 20 min |
| 02/11 | Échantillon de 10 vannes neuves (existant, `[supprimable]` si D1 acceptée) | 5 min |
| Chaque semaine | Réponses aux commentaires avec la banque de réponses (D4) : mar. et ven. | 2 x 10 min, 8 h sur 24 semaines ; 0 si moins de 5 interactions au J+28 |
| Seulement si incident | Reconnecter Buffer ; retirer un post publié ; coller le prompt de relance après e-mail de file basse | 3 min ; 2 min ; 1 min |
Total fixe : environ 1 h 45 sur 24 semaines, hors réponses. Tout le reste (lots, insertion, reprise, vérification Buffer, relevé Umami, alertes, déploiements, sous réserve de ton accord) est fait par session.

## 6. Pilotage
- **Contrôle du lundi** (routine, 07:30 UTC, sans Thomas) : prévu / publié et statut réel Buffer, FAILED, couverture de file en jours, stock éligible de vannes, articles de la semaine, visites Umami par `utm_source`, entonnoir par `origine`, référents `t.co` / `l.instagram.com` / `lnkd.in`. Écrit `docs/social/releves/AAAA-MM-JJ.md` et ouvre une issue GitHub si rouge. Les abonnés et l'engagement natifs n'ont pas d'API : ils viennent de Thomas aux seuls jalons.
- **Rendez-vous** (J0 = 12/10) : **J+14 lun. 26/10** (contrôle lien de bio, OAuth, `/liens`, stock vannes) ; **J+28 lun. 09/11** (seuils §4 v5, test de créneaux, hypothèse Marc lue) ; **J+56 lun. 07/12** (verdict par réseau, objectif 10 000 abonnés révisé ou non, **avant le lot 3**) ; **bilan Q1 lun. 29/03**. La session prépare la fiche d'une page le dimanche, Thomas répond « ok » ou choisit.
- **Ajustements déclenchés** : règle v5 (2 mesures sur 3 en succès = maintien ; sinon ajustement ; 3 sous l'échec aux 2 jalons = pause) ; stock éligible < 14 vannes ou file < 10 jours = lot ou production en urgence ; 2 semaines de suite « prévu ≠ publié » = pause du réseau ; V1 < 40 le 30/10 = O4 ; lot 3 prévu en cadence pleine mais découpable en 3/3/1 si J+56 l'exige.

## 7. Registre des risques
| # | Risque | P | I | Prévention | Plan B |
|---|---|---|---|---|---|
| R1 | Stock de vannes à la barre épuisé (T1) | Élevée | Élevé | O3, V1 le 23/10, V2 le 15/01, 41 d'abord, alerte stock < 14 | O4 (conseils), puis cadence 3/3/1 |
| R2 | Routines indisponibles ou sans secrets | Moyenne | Élevé | test d'essai le 07/10, alerte file basse du Worker | Thomas colle le prompt (1 min) |
| R3 | Article publié en retard ou absent | Moyenne | Moyen | garde lundi et jeudi 05:30 UTC, repli prévu dans le lot | vanne simple sans lien |
| R4 | Buffer déconnecté ou plafond | Moyenne | Moyen | pause auto, remise de 8 au plus | reconnexion Thomas, REJECTED des posts expirés |
| R5 | Charge de relecture à l'aveugle (V1 360 + articles 1 500 + fiches) | Élevée | Moyen | échelonnement 06/10 à 18/12, parallélisation | moins de réparties par article Q1 |
| R6 | Bug de publication (X 270, heure d'hiver, LinkedIn jamais publié) | Moyenne | Élevé | correctif déployé avant X, tests de l'heure, 1er post vérifié réseau par réseau | pause immédiate, rollback |
| R7 | C2 ou C3 non réunis le 11/10 | Moyenne | Moyen | tests le 07/10, GO/NO-GO du 11/10 | J0 = 19/10 pour ce réseau |
| R8 | Vanne répétée à 90 jours jugée lassante, notes relecteurs instables (8,32 et 8,16 pour Alexa) | Moyenne | Moyen | étalon Alexa mesuré par les mêmes relecteurs, seuil relatif | rotation des 41 meilleures |
| R9 | Audience nulle à J+28 (0 abonné au départ) | Moyenne | Élevé | seuils par réseau, contrôle J+14 | réduction de cadence, réallocation SEO |
| R10 | Gel de 14 jours bloque une correction urgente | Faible | Moyen | suppression chez Buffer + REJECTED | remplacement par vanne du stock |
| R11 | Contenu publié contraire aux choix fondateur (mention IA, tiret, humoriste inventé) | Faible | Élevé | @reviewer à chaque lot, citation sourcée | retrait dans l'application (Thomas) |
| R12 | Session sans accès Neon HTTP ou Buffer | Faible | Élevé | `--driver=neon-http` déjà prévu | report du lot, file basse prévient |

## 8. Hypothèses et handoff
`[HYPOTHÈSE]` : J0 identique pour les 3 réseaux ; routines disponibles ; rendement de 13 % des candidats ; Q1 à un article par lundi accepté ; 14 vannes hors lot sans réserve ; calendrier Q4 et jeudis 2027 comme dans `founder-preferences.md`.

**Handoff → @orchestrator** : @fullstack (option `--pool`, garde `articleSlug`, alerte file basse, déploiement correctif X), @copywriter (notes de lignes, V1, fiches, citations), @seo (calendrier Q1 le 02/11), @reviewer et @qa (contrôles de lot), @social (grille jeudi Q1). Points d'attention : T1, T2, T9 sont les trois trous qui font échouer la relance en novembre et en janvier.
