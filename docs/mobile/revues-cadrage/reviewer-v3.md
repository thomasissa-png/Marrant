# Relecture à l'aveugle du cadrage v3 de l'app iPhone : @reviewer (tour 4)

> Livrable relu : `docs/mobile/cadrage-app-native-s23.md` (v3, 04/11/2026, @product-manager, 332 lignes).
> Relu contre : ma revue `reviewer-v2.md` (M1 à M5, SOU-1 à SOU-11), `docs/copy/catalogue-vannes-valides.md` (base au 01/10), `apps/web/src/config/widget-vanne-du-jour.ts` (`WIDGET_JOKE_IDS`, 93 identifiants), la grille `docs/mobile/attentes-utilisateur.md`, les revues panel v2 (pour vérifier les chiffres cités au §5.1), 2 recherches web (04/11/2026).
> Revues v3 des autres relecteurs non lues. Aucun fichier modifié hors de celui-ci, rien commité. Le §1 en attente de Thomas, les sections [PROVISOIRE] et les décisions ouvertes correctement posées ne sont pas pénalisés.
> Mesure de l'écart (P0 s11), à la lecture, sans outil de diff : §2.1 réécrit en entier (4 vannes nouvelles, textes lus en base), §3.2 réécrit en entier (modèle unique, 2 tables, pools mesurés, mélange, thème épuisé, 3 horloges), §3.6 et §5.1 nouveaux, §13 (lots C découpés, lot 3c, dépendances 9 et 11), §14 (décisions 5, 7, 7 bis, 8 bis), §16 nouveau. Refonte de fond, pas une retouche.

## 1. Notes

| # | Critère | v2 | **v3** | En une ligne |
|---|---|---|---|---|
| 1 | Cohérence interne et avec le projet réel | 7,5 | **8,5** | Un seul modèle de vanne du jour, tables `Installation` et `AssignationJour`, aucune trace de `ensureDailyContentFromStock` côté app. Restent : l'en-tête et le §15 contredisent le §2.1 sur la lecture en base (N2), et les messages des états du build 0 sont au lot 3c dont le lot 7 ne dépend pas (N3) |
| 2 | Conformité aux préférences fondateur | 8,5 | **9** | Filtre DATING/SOIREES/COUPLE du 24/10 non rouvert, P0 s18 sur la vanne retirée, P0 s11 et s18 respectés par le champ distinct `defi30s` (site intact), étalons avant rédaction (P0 s8), 05/10 et s15 cités |
| 3 | Zéro donnée inventée, sources, [À VÉRIFIER] justifiés | 7,5 | **8,5** | Les 4 vannes et tous les comptages sont exacts (vérifiés ci-dessous). Mais la règle de choix annoncée est fausse pour B et absente pour C et D (N1), le même défaut que « lues dans l'ordre du fichier » en v2 ; le §5.1 se trompe sur le seuil de C9 (N4) |
| 4 | Complétude du périmètre V1 | 8,5 | **9** | Installation sans notification, lot 3c, chaîne du défi de 30 s, vanne retirée, jour local : complets. Réserve : la route qui crée l'installation sans jeton n'est pas nommée (SOU-1) |
| 5 | Clarté des décisions laissées à Thomas | 8,5 | **8,5** | Décisions 5, 7 bis et 8 bis bien posées, avec tailles réelles et risque résiduel. Mais la 8 bis ne dit pas quelle règle de GO s'applique au cadrage réduit à C1, C2, C4, C5, C9, C10, C11 (N4) |
| 6 | Plan par dépendances exploitable | 8,5 | **8,5** | Lot 3c, lots 9 et 11 corrigés, chaîne C(a) → C(c) → C(u) → C(d0) → lot 7, 5b-0 après C(u). Un trou : N3 |
| | **Note globale** | 8 | **8,5 / 10** | NO-GO pour 9/10, de peu : M1 à M5 sont traitées sur le fond. Il reste 4 corrections obligatoires, toutes de rédaction (une à trois lignes chacune), aucune ne demande une décision de Thomas |

## 2. Statut de mes corrections v2 (vérifiées dans le texte, pas dans le §16)

| v2 | Sujet | Statut | Preuve dans la v3, et réserve |
|---|---|---|---|
| M1 | Vannes du §2.1 absentes de la base | **Traitée** | l.39-46 : 4 vannes du catalogue validé, identifiants donnés ; l.48-52 : « Pourquoi ça marche » et « À toi de jouer » lus en base ; exemple couple retiré, remplacé par les tailles de sections (l.55) ; « lues dans l'ordre du fichier » retiré ; constat sur « À toi de jouer » refait sur les vrais textes (l.53) et mesure renvoyée au lot C(a) (l.56). Réserve : la règle de choix est fausse pour B (N1) |
| M2 | Trois sources pour la vanne du jour | **Traitée** | l.80 : « jamais celle du calendrier du site ni la rotation du widget intégrable », `ensureDailyContentFromStock` et `getWidgetVanneDuJour` ne servent plus à l'app ; l.84 : la route réutilise seulement `widgetJokeWhere` ; l.209 : `daily-push` lit `AssignationJour` ; l.198 : H-stock par thème ; l.113 et décision 5 : l'élargissement de l'offre concerne tout le monde, et c'est dit |
| M3 | Installation sans notification, anti-moisson | **Traitée** | l.82 : installation créée au premier lancement, avant toute permission, secret, thèmes côté serveur, limite par IP ; l.84 : route authentifiée par le secret, thèmes jamais en paramètre ; l.85 : défi servi seulement pour l'assignation enregistrée, risque résiduel écrit et reporté dans la décision 5 ; l.153 : création à l'écran 1. Réserves : SOU-1 (route de création), SOU-2 (comptage du risque) |
| M4 | Taille des thèmes | **Traitée** | l.88 : 149 actives par catégorie, 14 catégories, datées du 04/11, écart avec le catalogue expliqué ; l.90-98 : tableau des thèmes, « tous sous 60 » ; l.99-100 : règle de mélange et thème épuisé ; ECOLE ajouté (vie étudiante) ; décision 5 et H-stock reprennent les chiffres. J'ai recompté : somme = 149, « tout le reste » = 40, couple et dates = 26 |
| M5 | Lot de textes hors geste | **Traitée** | l.139 et l.274 : lot 3c (Parcours, Explorer, Profil, 8 états, suppression, widget, noms) ; lot 9 dépend de 3c et 6b ; lot 11 de 3a et 3c. Résidu : N3 |
| SOU-1 | Plan B et `TRANSFER` | Traitée | l.253, décision 3 |
| SOU-2 | Jour UTC hors d'Europe | Traitée | l.104-112 : jour local pour le contenu, série du compte à Paris, exemple de Montréal juste (UTC-5 contre UTC+1 : 14 h le 5 = 20 h à Paris le 5, 23 h le 6 = 5 h à Paris le 7) |
| SOU-3 | Vanne retirée | Traitée | l.103 |
| SOU-4 | « si décision N » | **Partielle** | Fait l.151, C4, C8. Manque l.154 (Aujourd'hui, « série (masquable) ») et l.157 (Profil, « série masquable ») : ajouter « si décision 4 » |
| SOU-5 | §9 provisoire | Traitée | l.232 |
| SOU-6 | SDK Expo | Traitée | l.226 ; exigence Xcode 26 et SDK iOS 26 au 28/04/2026 confirmée par Apple (§7 ci-dessous) |
| SOU-7 | Dates du stock | Sans objet | Le chiffre du calendrier du site a disparu avec M2 |
| SOU-8 | Liens universels | Traitée | l.74 (build 0 : le lien ouvre le site), l.159, lot 9 |
| SOU-9 | Inventaire PREMIUM | Traitée | lot 5a l.276 ; mesure 04/11 l.210 |
| SOU-10 | « Comme Apple le prévoit » | Traitée | décision 8 l.297 |
| SOU-11 | Commission UE | Traitée, rédaction à reprendre | l.233 : [À VÉRIFIER] posé, mais la phrase cite « newsroom Apple 18/08/2026 » comme source alors que personne ne l'a lue : SOU-5 |

Bilan : **M1 à M5 traitées, 9 souhaitables traitées, 1 partielle (SOU-4), 1 sans objet.**

## 3. Contrôle du §2.1 contre le catalogue et `WIDGET_JOKE_IDS`

| Élément | Comparé à | Résultat |
|---|---|---|
| A `cmmnsqn120000th63o435xsb0`, amorce et chute | catalogue l.8 | Identique au caractère près ; AUTODERISION juste |
| B `cs14jkefbc9f40abb6f8a2ca` | catalogue l.99 | Identique ; BOULOT juste |
| C `cs14jk0d9dfe9b5c26db5f8d` | catalogue l.143 | Identique ; SOIREES juste |
| D `cs14jkb9ba433a0746280280` | catalogue l.137 | Identique ; DATING juste |
| Colonne « Dans les 93 » | `widget-vanne-du-jour.ts` l.31 (A), l.37 (B) ; C et D absents | Juste (et C, D tombent en plus sous `WIDGET_CATEGORIES_EXCLUES`) |
| `cs19jkboulot1` dans les 93, absente du catalogue | config l.37 ; catalogue sans aucun `cs19` | Juste |
| COUPLE 16, DATING 9, SOIREES 8, ECOLE 4 | catalogue l.67-82, 130-138, 142-149, 104-107 | Juste |
| « La première du catalogue qui est dans les 93 » | A : 1re d'AUTODERISION (l.8), dans les 93 : **juste**. B : la 1re de BOULOT est `cmoapu9k80020s60x7jv317hv` (l.86), **dans les 93** (config l.34) ; B est la 14e | **Faux pour B** (N1) |
| Règle de choix de C et D | C est la 2e de SOIREES, D la 8e de DATING | **Non dite** (N1) |
| Cohérence des 4 « Pourquoi ça marche » et « À toi de jouer » avec le texte du catalogue | B, C, D : chaque élément cité existe dans l'amorce ou la chute (« quatorze », « essuyer », « devenu », « Antoine bar ») | Cohérents. **A** : « tu fais noter ta cuisine » alors que l'amorce validée ne parle plus de cuisine ; c'était l'ancienne amorce (« Je suis tellement mauvais en cuisine que… », `audit-vannes-s14/export-vannes-actives.txt` l.259). Le décryptage date d'avant la réécriture s14 : SOU-6 |
| Doublon « À toi de jouer : » en tête de B et D | textes cités l.50 et l.52 | Constat juste |

Aucune invention : tout est recopié et tous les chiffres se recomptent. Le seul défaut porte sur la description de la méthode de choix.

## 4. Nouvelles corrections OBLIGATOIRES (bloquantes pour 9/10)

**N1. La règle de choix des vannes du §2.1 est fausse pour B et absente pour C et D.**
Emplacement : l.39 (« la première du catalogue qui est dans les 93 pour les thèmes tout public »), l.54.
Constat : en BOULOT, la première vanne du catalogue présente dans les 93 est `cmoapu9k80020s60x7jv317hv` (« Ma collègue m'a briefé pendant 45 minutes… », catalogue l.86, config l.34), pas B. Pour SOIREES et DATING (hors des 93 par construction), aucune règle n'est donnée, et ni C ni D ne sont les premières de leur section. Ma correction M1 demandait « dire comment elles ont été choisies » : c'est dit, mais faux pour une vanne sur deux concernées. C'est le même défaut que « lues dans l'ordre du fichier » en v2, dans la section écrite précisément pour que le panel juge sans biais.
Correction : soit prendre `cmoapu9k80020s60x7jv317hv` en B (en lisant ses deux champs en base, comme pour les autres), soit écrire la vraie règle (« choisies par le PM pour… ») vanne par vanne, y compris pour C et D. Ajuster la l.54 en conséquence (`cs19jkboulot1` n'a pas été « écartée au profit de B » si B n'est pas la première).

**N2. L'en-tête et le §15 contredisent le §2.1 sur la lecture en base.**
Emplacement : l.5 (« cette session n'a pas d'accès à la base »), l.308 (bloquant : « lecture en base des textes des vannes A à D (§2.1) par @fullstack ») contre l.48 (« lus en base de production en lecture seule par la session le 04/11/2026 »).
Constat : le document affirme à la fois que la session n'a pas accès à la base et qu'elle a lu les 4 vannes en base, et garde en bloquant une lecture déjà faite.
Correction : aligner l.5 sur l.48 (préciser ce que la session a lu elle-même et ce qui vient de la revue @fullstack v2, notamment les tailles de la l.88), retirer la lecture des vannes A à D des bloquants du §15 (ou la remplacer par « lecture de `cmoapu9k…` » si N1 est corrigée ainsi).

**N3. Les messages des états du build 0 sont au lot 3c, dont le lot 7 ne dépend pas.**
Emplacement : §4.7 l.158 (« hors build 0 pour session, Premium et achat » : hors ligne, erreur réseau, contenu vide, contenu retiré SONT dans le build 0) ; lot 1a l.272 (hors ligne, erreur réseau, contenu vide) ; l.103 (message « contenu retiré ») ; lot 3c l.274 (« 8 états transverses ») ; lot 7 l.279 (dépend de 3a, pas de 3c).
Constat : le build 0 affichera des messages d'état qui ne sont dans aucun lot de textes dont il dépend. Soit le lot 7 attend le lot 3c, qui dépend de 1b (Parcours, Explorer, Profil, offre), et le build 0 n'est plus « réduit au geste » ; soit il part avec des messages non relus, contre P0 s18 et le §3.5. C'est le résidu de M5.
Correction : mettre au lot 3a les messages des 4 états présents au build 0 (hors ligne, erreur réseau, contenu vide, contenu retiré), et laisser au lot 3c ceux de session expirée, mise à jour obligatoire, Premium requis et double touche.

**N4. La décision 8 bis ne dit pas quelle règle de GO vaut pour le cadrage, et cite un seuil faux.**
Emplacement : §5.1 l.182, décision 8 bis l.298.
Constat : (a) La grille fixe C9 à ≥ 7 (`attentes-utilisateur.md` l.50) : le 7 de Marc en C9 atteint le seuil, il n'y a rien « à lever » au sens du critère. (b) Ce qui bloque, c'est la règle d'étape (l.54 de la grille : moyenne des critères notés ≥ 8 et aucun persona sous 7). Si le cadrage n'est jugé que sur C9 et C10 comme critères notés, Yanis fait (8 + 7) / 2 = 7,5 et Marc (7 + 8) / 2 = 7,5 (panels v2 : Yanis l.33-34, Marc l.31-32) : NO-GO tant que C10 de Yanis reste à 7. Le §5.1 ne dit pas si cette règle s'applique, ni avec quels critères notés. Thomas ne peut pas trancher une méthode dont la règle de décision n'est pas écrite. (c) Détail : les réserves sur les bloquants sont C5 et C11 chez Marc, mais C1 et C11 chez Sophie (`panel-sophie-v2.md` l.25).
Correction : écrire la règle proposée pour l'étape « cadrage » (critères notés retenus, moyenne ≥ 8, aucun persona sous le seuil du critère) et ce qu'elle donne aujourd'hui avec les notes v2 ; corriger « C9 chez Marc » en « moyenne de Marc et de Yanis à 7,5 » ; corriger la liste des réserves.

## 5. Corrections SOUHAITABLES

**SOU-1. Route de création de l'installation (§7 l.208, l.218).** Le modèle dit « créée au premier lancement, jeton facultatif » (l.82), mais la seule route publique nommée, `POST/PATCH/DELETE /api/mobile/push`, exige un « jeton Expo validé ». Nommer la route qui crée l'installation et enregistre thèmes et heure sans jeton (ou dire que `/push` accepte le jeton facultatif), et l'ajouter au lot 5b-0 et aux tests (l.208 cite bien le cas « installation sans notification »).
**SOU-2. Comptage du risque résiduel (l.85).** Le préchargement sert J+1 et J+2 « défi compris » (l.102), et changer de thèmes réécrit J+1 et J+2 une fois par jour : une installation peut donc recevoir jusqu'à 5 défis (et 5 « À toi de jouer » réservés à Premium sur le site) par jour, pas « 3 d'avance ». Écrire le bon plafond, ou ne réécrire que les jours pas encore préchargés. Dire aussi que « ce jour-là » s'entend J à J+2.
**SOU-3. SOU-4 v2 à finir.** « si décision 4 » aux l.154 et l.157 ; « si décision 5 (volet exercice) » à la l.151 (« vanne du jour et son défi » dans les droits du visiteur).
**SOU-4. Pool de l'app et décision 7 bis (l.87).** La condition « `defi30s` non nul » ne vaut que si Thomas retient (B). Ajouter « si décision 7 bis = B ; sinon pool = validé avec les deux champs ».
**SOU-5. Commission UE (l.233).** Remplacer « newsroom Apple 18/08/2026, confirmé par la presse seulement » par « presse (Nasdaq, iClarified, Game World Observer), page Apple non lue ». La presse diverge en plus sur le point de départ des 15 % d'un abonnement (après la 1re année ou dès la 2e année) : à lire sur la page Apple avant le lot 10.
**SOU-6. Décryptage de A antérieur à la réécriture s14.** « Fais noter ta cuisine » renvoie à l'ancienne amorce. Ne rien corriger ici (texte du site), mais ajouter au lot C(a) la mesure « décryptages écrits pour une version antérieure de la vanne », qui peut concerner d'autres réécritures s14 et toucher le « Pourquoi ça marche » affiché dans l'app.
**SOU-7. Vie étudiante sans vanne d'exemple au §2.1.** Le §2.1 annonce « une vanne par thème proposé en §3.2 », mais ECOLE, ajouté pour Yanis, n'en a pas. Ajouter une vanne ECOLE des 93 (les 4 du catalogue y sont, config l.42) avec ses deux champs lus en base, ou retirer « une par thème ».

## 6. Ce qui relève de Thomas (pas un défaut)

§1 (5 questions et étalons), décisions 3, 4, 5, 6, 7, 7 bis, 8 bis (sur le fond), 9 à 17, question à part sur l'exercice du jour et S10 : chacune a sa reco, son alternative et son risque. La reco 8 bis elle-même (reporter C3, C6, C7, C8 à l'étape contenu) est recevable, le risque est dit (« un GO du cadrage ne vaut pas GO du contenu ») ; seule sa règle de décision manque (N4). La règle de mélange, la bascule à 4 h et la réserve de 7 sont des [HYPOTHÈSE] marquées : normal à ce stade.

## 7. Ce qui est solide (à ne pas casser)

- §3.2 : un modèle, `AssignationJour` figée et unique, contrainte d'unicité qui départage les calculs concurrents, thème épuisé sans écran vide, table des 3 horloges avec la raison de chacune.
- §3.6 : le défi de 30 s traité comme une chaîne de production (pipeline quotidien, rattrapage des pools du build 0 d'abord, échec = la vanne n'entre pas dans le pool), et `defi30s` qui laisse le site intact.
- §9.5 : l'installation survit à la suppression, interrupteur non coché, « supprimer à l'échéance » retiré avec sa raison.
- Zéro tiret cadratin (0 occurrence), aucune durée en semaines dans le plan, net par abonné juste (1,99 / 1,2 × 0,85 = 1,41).

## 8. Vérifications externes (04/11/2026)

| Point | Résultat | Source |
|---|---|---|
| Xcode 26 et SDK iOS 26 exigés au 28/04/2026 (§8) | Confirmé par Apple | [Apple, SDK minimum requirements](https://www.developer.apple.com/news/upcoming-requirements/) |
| Commission UE 26 % / 15 % au 01/10/2026 (§9.1) | Confirmé par la presse, page Apple non trouvée ; descriptions divergentes du point de départ des 15 % | [Game World Observer 19/08/2026](https://gameworldobserver.com/2026/08/19/apple-will-reduce-the-app-store-commission-in-the-eu-to-resolve-disagreements-with-the-european-commission), [basic-tutorials](https://basic-tutorials.com/news/apple-app-store-eu-new-fees-and-rules-effective-october-1-2026/), [iGeeksBlog](https://www.igeeksblog.com/eu-welcomes-apple-new-app-store-terms/) |

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/reviewer-v3.md`
- Verdict : NO-GO pour 9/10, note **8,5/10** (v2 : 8). M1 à M5 traitées ; souhaitables v2 : 9 traitées, 1 partielle, 1 sans objet. **4 obligatoires nouvelles (N1 à N4), toutes de rédaction** ; 7 souhaitables
- Top 3 : N1 (règle de choix du §2.1 fausse pour B), N3 (messages des états du build 0 hors des lots dont il dépend), N4 (règle de GO de la décision 8 bis)
- Agent à relancer : @product-manager (v3.1, corrections ciblées). Aucune décision de Thomas rouverte ni requise pour lever N1 à N4
---
