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
