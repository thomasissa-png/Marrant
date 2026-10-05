# Stratégie de relance des 3 réseaux, v4 (cycle 4, s15, 05/10/2026)

> Document autonome. Remplace `strategie-relance-v3.md` (et `audit-note-s15.md` §6 à §8). Choix fondateur du 05/10 : relance de X, Instagram et LinkedIn, consignes du 01/10 annulées ; restent valables : compte = marque, X sans thread, LinkedIn sans ton coach ni corporate (3 phrases au plus, fluides, tutoiement, format POTE_AU_TAF), style fluide, humoristes nommés et cités autorisés (citation réelle, jamais inventée), zéro tiret cadratin, jamais de mention IA, contenu préparé par lot. Vannes = catalogue validé (`docs/copy/catalogue-vannes-valides.md`, mot pour mot) ou lignes des articles du site (`docs/copy/articles-q4/`, `docs/copy/articles-forte-frappe/`), relues à l'aveugle (2 relecteurs).
> **Décision du 05/10 (session principale, règle R6)** : toute vanne à la 1re personne est publiée entre guillemets français « … » (citation explicite, choix fondateur du 05/05) ; le texte de marque autour ne parle jamais au nom d'une personne. Thomas pourra revenir dessus en validant les étalons.
> Point de départ : aucun post en attente (33 posts Instagram et 40 posts X retenus, §5) ; Instagram reconnecté dans Buffer ; LinkedIn muet depuis août ; abonnés inconnus ; 1 visite sociale en 28 jours contre 455 en recherche organique.

## 1. Stratégie des 3 réseaux

| Réseau | Étape du funnel | Rôle | Destination du lien | Métrique pilote | Personas |
|---|---|---|---|---|---|
| Instagram | Acquisition : notoriété et partage | « je l'envoie à un pote » | lien de bio `/liens` : article (s'il a moins de 48 h) ou quiz en premier | (partages + enregistrements) / couverture, clics bio | Yanis, Sophie ; Marc via les relais rencontre et couple |
| X | Acquisition : clic | tester ce qui circule ; lien direct dans le post | article (relais lundi et jeudi), quiz (mercredi) | visites `utm_source=x`, (réponses + citations) / impressions | Yanis, Sophie ; Marc via les mêmes relais |
| LinkedIn | Acquisition qualifiée | vanne de bureau, situation, relais d'article à angle travail | article en dernière ligne du post (pas de premier commentaire, §2) | (réactions + commentaires) / impressions, visites `utm_source=linkedin` | Sophie seule (Marc n'y est pas ciblé) |

Funnel commun : post, puis article ou quiz (valeur sans compte), puis CTA de la page (compte gratuit), puis `inscription-reussie`, puis `onboarding-termine`. Le social ne mène jamais à `/abonnement` et ne parle jamais de prix (choix du 06/05).
**Marc** (34 ans, séparé) : hypothèse « Instagram et X » uniquement, via les relais rencontre (29/10) et couple (05/11). Seuil `[HYPOTHÈSE]` (K8 growth) : au moins **8 visites sociales** cumulées sur ces 2 articles (2 articles sur 16 relayés pèsent environ 12 % des 100 visites X + Instagram du succès, soit 12) ET au moins **1 `inscription-envoi`** avec `src=blog-<slug de l'un des 2 articles>` et `origine` x ou instagram `[À VÉRIFIER avec @fullstack : forme exacte de `src`]`. Lecture à J+28 (l'article du 05/11 n'a alors que 4 jours), verdict à J+56 seulement ; sous le seuil, hypothèse abandonnée. Le `quiz-termine` du mercredi X n'est pas un signal Marc.

**Grille hebdomadaire unique** (heures de Paris `[HYPOTHÈSE : créneaux à tester, relevé à J+28]`) : 12 posts.

| Jour | X 12:30 | Instagram 18:30 | LinkedIn 08:15 |
|---|---|---|---|
| Lundi | relais de l'article du lundi | carte relais : une autre ligne de l'article, légende « lien en bio » | aucun |
| Mardi | vanne | carte vanne | relais du lundi si angle bureau, sinon vanne de bureau |
| Mercredi | vanne + lien du quiz | carrousel décryptage (4 cartes) | aucun |
| Jeudi | relais de l'article du jeudi, sinon vanne saisonnière | carte relais du jeudi, sinon carte vanne | relais du jeudi si angle bureau, sinon situation neuve ou vanne |
| Vendredi | vanne | carte vanne | aucun |

Totaux : X 5 (3 vannes, 2 relais), Instagram 5 (2 cartes vanne, 1 carrousel, 2 relais), LinkedIn 2 (au moins 1 vanne ou situation par semaine, jamais 2 relais). Pas de relais du jeudi avant le 22/10.
**Relais, trois précisions** : (1) **le renvoi dépend de la catégorie de l'article** : CATALOGUE, « Les N autres sont prêts à copier : lien » ; PRATIQUE (ex. `se-presenter-avec-humour`, qui dit « pas de phrases à recopier »), « Les 4 autres exemples, et comment trouver le tien : lien ». (2) **Quand aucune ligne de l'article n'atteint 8 à l'aveugle** (cas du 22/10), le relais prend une vanne du catalogue du même thème (note 8 et plus) et renvoie à l'article. (3) **Article de plus de 7 jours : vanne simple, sans lien ni « lien en bio »**, avec UNE exception amendée une fois : les pivots saisonniers à leur pic, liste fermée, liens directs X et LinkedIn seulement, jamais Instagram (X 30/10 Halloween ; X et LinkedIn 31/12 ; X 01/01).
**Piliers sur ces 12 posts** : vanne 6 (50 %), relais X et Instagram 4 (33 %), décryptage 1 (8 %), LinkedIn relais ou situation 1 (8 %). **Catalogue ou propre** : vannes du catalogue mot pour mot 7 (58 %), lignes d'article mot pour mot 4 (33 %), texte neuf relu à l'aveugle 1 (8 %). **Carrousel avec citation d'humoriste** (citation réelle, source vérifiée par @copywriter avant la veille) : mer. 28/10, puis le 1er mercredi de chaque mois dès novembre ; repli sans citation si la source n'est pas vérifiée. Chaque post tient à un pilier et à au moins un des 3E.
**Conditions de départ, J0 par réseau** (premier lundi où ses conditions sont réunies, au plus tôt le 12/10 ; baseline le dimanche qui précède) : C1 validation des 9 étalons par Thomas (P0 s8) ; **C2 e-mail avant Google en navigateur intégré en ligne ET test dans l'application DU réseau (X pour X, Instagram pour Instagram, LinkedIn pour LinkedIn, §2.6)** ; C3 `/liens` trois routes en ligne ; C4 LinkedIn débloqué dans le code et statut réel Buffer relu (@fullstack). **X = C1 + C2 ; Instagram = C1 + C2 + C3 ; LinkedIn = C1 + C2 + C4.** Chaque J0 est inscrit au **registre des J0** (`mesure.md` §6 : date, C1 à C4, ligne `REPLIT_ACTIONS.md`). **C1 non validée le 12/10 : J0 = lundi suivant**, et ainsi de suite.
**Temps humain plafonné** : relevé du lundi 30 min, réponses 15 min par jour au plus (jusqu'à 105 min par semaine), réponse sous 24 h les jours ouvrés avec banque de réponses (pattern d'invitation du 06/05, troll : silence ou chaleur détachée).
**Stock et anti-répétition** : 7 vannes catalogue par semaine, soit 91 par fenêtre de 90 jours sur 125 validées, plus les lignes d'article catalogue reprises par les relais `[HYPOTHÈSE : marge faible]` ; @copywriter livre 30 vannes neuves par mois, relues à l'aveugle, première livraison le 02/11. **Aucune vanne ni ligne d'article n'est postée deux fois à moins de 90 jours, tous réseaux confondus.** **Réservées à Noël, exclues de tout relais, tirage et pivot avant le 24/12** : `cs14jkee5c537f7286c1da98`, `cs14jk4fe660e7238281ce47`, `cs14jkc4a2c545e132b38a92`, `cs14jkffeab1620070f2263e`, et la n°18 de `blagues-de-couple-drole`. Le script lit le registre du lot ET les posts publiés des 90 derniers jours, bloque si le stock éligible tombe sous 7 et applique la liste de réservation.

## 2. Liens et attribution

| Paramètre | Valeur |
|---|---|
| `utm_source` | `x`, `instagram`, `linkedin` |
| `utm_medium` | `social` |
| `utm_campaign` | `AAAA-MM` du post ; `bio` pour `/liens` |
| `utm_content` | X : `lundi`, `jeudi`, `quiz`, `saison` (pivots saisonniers avec lien : 30/10, 31/12, 01/01) ; LinkedIn : `relais` ; `/liens` : `bio-article`, `bio-quiz`, `bio-vanne`, `bio-parcours`, `bio-vannes`, `bio-conseils` |

Destinations : quiz `/quiz-humour` (« environ 2 minutes » et « sans inscription » vérifiés dans la page), article `/blog/<slug>`, parcours `/parcours/repartie`. Aucun lien social ne mène à `/register` ni `/abonnement`. Aucun lien sans UTM, même ajouté à la main.

| Type de post | Appel à l'action |
|---|---|
| Vanne X (mardi, vendredi), carte vanne IG, vanne LinkedIn | aucun lien ; légende IG « À envoyer à... » ou rien, pied `deviens-marrant.fr`, 80 caractères au plus pied compris |
| Vanne X du mercredi | 2e bloc : renvoi au quiz, durée et « sans inscription », lien |
| Relais X (lundi, jeudi), pivot saisonnier X | une ligne ou une vanne, puis le renvoi de la catégorie (§1) |
| Relais IG, carrousel IG | « lien en bio » une seule fois. Relais : l'article a moins de 48 h, donc en bloc 1. Carrousel : « le quiz est dans le lien de la bio » (vrai en bloc 1 ou 2) |
| Relais LinkedIn | lien UTM en dernière ligne du post, après la 3e phrase |

Liens ou CTA explicites : X 3 posts sur 5 (4 la semaine d'Halloween, 26/10), Instagram 3 sur 5, LinkedIn 1 sur 2 au plus.
**Spec pour @fullstack (pas de code ici)** :
1. `/liens` reste statique (ISR 300 s) : trois routes `/liens` (Instagram, bio actuelle compatible), `/liens/x`, `/liens/li`, via `generateStaticParams` avec **`dynamicParams = false`** (une 4e route renvoie 404), pas de `?s=` lu côté serveur ; `utm_source` = `instagram|x|linkedin`, `utm_campaign=bio`, un `utm_content` par bloc.
2. Ordre des blocs piloté par règle : (1) l'article s'il est publié depuis moins de 48 h, sinon le quiz ; (2) l'autre des deux ; (3) vanne du jour ; (4) parcours Répartie ; (5) toutes les vannes ; (6) conseils. Les promesses des posts sont vraies dans les deux cas.
3. Persistance : lire l'UTM à l'arrivée (sessionStorage) et l'envoyer sur `quiz-termine`, `parcours-etape`, `inscription-envoi`, `inscription-reussie`, `onboarding-termine` : `origine` = `utm_source`, `contenu` = `utm_content` (`src` inchangé). **Limite écrite : attribution = session d'arrivée** ; un retour le lendemain n'est pas attribué.
4. **`/register` reste prérendu statique.** Navigateur intégré (Instagram, LinkedIn, X/Twitter, Facebook) **détecté CÔTÉ CLIENT** (user-agent lu dans un composant client au montage ; liste des marqueurs confirmée par test sur appareil). Pas de middleware, pas de variante serveur, pas de `Vary: User-Agent` (même famille de défaut que `?s=` : un cache servirait la variante du premier visiteur à tous). Dans ces navigateurs : formulaire e-mail avant le bouton Google, **bouton Google désactivé** avec le message « Google n'accepte pas l'inscription depuis cette application. Inscris-toi par e-mail, ou ouvre le site dans ton navigateur. » (cause : `disallowed_useragent`, vérifié). Zone réservée au gabarit pour éviter le décalage ; si le saut d'ordre au montage reste visible, @ux tranche « e-mail en premier pour tous ».
5. **`origine` conservée à la bascule** : le message du point 4 offre « Ouvrir dans mon navigateur » (lien ou copie) vers `/register?origine=<origine>&contenu=<contenu>` ; à l'arrivée, ces paramètres sont relus et replacés en sessionStorage (l'UTM d'arrivée reste prioritaire). Restent non attribués ceux qui basculent sans ce bouton : l'écart est chiffré chaque lundi (clics bio natifs contre visites UTM, `mesure.md` §3).
6. Tests mobile avant le J0 de **chaque réseau**, dans l'application de CE réseau, plus Safari et Chrome. **Critère de réussite** : l'inscription par e-mail aboutit dans l'application, le bouton Google est désactivé avec son message, et Google fonctionne dans Safari et Chrome. Consigner dans `REPLIT_ACTIONS.md` (alimente le registre des J0).
7. LinkedIn : le premier commentaire programmé par Buffer exige une offre payante (pages d'aide Buffer, vérifié le 05/10) : **pas de premier commentaire**, le lien va dans le corps. 1 post LinkedIn sur 2 reste sans lien, lecture à J+28. Si Thomas prend l'offre payante, règle réexaminée une fois.
8. **Gates du directeur** : le lot préparé est inséré en contournant G-S2, G-S16 et G-S19 du directeur de stand-up, ou ces gates sont alignées sur la v4 (1re personne admise entre « », légende Instagram 80 caractères au plus) ; @fullstack tranche et l'écrit dans `REPLIT_ACTIONS.md`.
9. **Plafond Buffer** : l'offre gratuite limite à **10 posts programmés par canal à la fois** (pages d'aide Buffer, vérifié le 05/10 : Instagram et X à 5 par semaine tiennent 2 semaines, LinkedIn 5). Insertion **glissante** : le lot reste en base, une tâche quotidienne n'envoie à Buffer que les prochains posts, 8 au plus en file par canal ; échec d'insertion = alerte (limite d'1 e-mail par jour). Le mode retenu est écrit au registre.
10. `mesure.md` est aligné sur cette v4 (fait). @data-analyst : visites par `utm_source` et événements par `origine` via l'API Umami dans l'e-mail du lundi.

## 3. Calendrier

Lot 1 : lun. 12/10 au dim. 15/11 (après validation des étalons). Lot 2 : lun. 16/11 au dim. 03/01 (relu à l'aveugle avant le 09/11). Détail dans `docs/social/editorial-calendar.md` (Semaine, Date, Plateforme, Format, Pilier, Hook, CTA, Statut). Chaque article du lundi et du jeudi est relayé sur X et Instagram (**deux lignes différentes**), et sur LinkedIn quand l'angle est le travail. Lignes fixées ci-dessous ; les cases « tirage » sont remplies par le script (registre de 90 jours, liste de réservation).

| Semaine | Lundi (X + IG) | Jeudi (X + IG) | LinkedIn mar. / jeu. | Pivots |
|---|---|---|---|---|
| 12/10 | `se-presenter-avec-humour` (PRATIQUE) : X `cs14jkd6b11e811ffbf7f301`, IG `cs14jk8f28ff20e1cf82f3a8` (mimes, accroche 3) | aucun article le 15/10 : tirage | L3 relais (13/10) / L1 canapé (15/10) | mar. 13/10 X1 Alexa ; mer. 14/10 carrousel IG3 |
| 19/10 | `humour-en-colocation-desamorcer-tensions` : tirage | `message-anniversaire-drole-par-situation` (22/10) : X vanne `cs14jk10c844a13d108646fd` + renvoi, IG n°13 | vanne (20/10) / **n°6 de l'article seule, sans lien** (22/10) | mer. 21/10 X3 avec quiz |
| 26/10 | `blagues-sur-l-ia-assistants-vocaux` : X n°5 `cs14jkf0a20e0837fa95c784`, IG n°4 `cs14jke6736001250d3a940d` (n°1 Alexa exclue) | `premier-message-drole-appli-de-rencontre` (29/10, Marc) : tirage | vanne (27/10) / L2 situation (29/10) | mar. 27/10 IG1 tuteur ; mer. 28/10 carrousel avec citation d'humoriste ; ven. 30/10 Halloween : X ligne n°3 de `blagues-halloween-soiree-deguisee` + lien `utm_content=saison` (exception §1), IG carte `cs14jk1bc86d3502a2cef27b` sans lien ni « lien en bio » (la bio mène à l'article du 29/10) |
| 02/11 | `humour-en-visio-reunion-en-ligne` : tirage | `blagues-de-couple-drole` (05/11, Marc) : tirage, **jamais la n°18** (réservée) | relais (03/11) / vanne | mer. 04/11 carrousel avec citation d'humoriste |
| 09/11 | `chambrer-sans-blesser-entre-potes` | `voeux-drole-nouvelle-annee` (12/11), relais léger « à garder de côté » | vanne / vanne ou situation | 11/11 : silence ; fin du lot 1 |
| 16/11 | `soiree-de-noel-entreprise-humour` | article du 19/11 (invitation, fichier B1) | relais (17/11) / vanne | début du lot 2 |
| 23/11 | `repas-de-famille-questions-genantes-humour` | article du 26/11 (gamer, fichier B2) | vanne / vanne ou situation | Black Friday 27/11 : silence |
| 30/11 | `toast-drole-discours-qui-fait-rire` : `cs14jk02047ed5635bab6a52` et une des 2 vannes neuves de l'article (note 8 et plus), **jamais les 3 vannes de l'article réservées à Noël** | `mot-de-depart-collegue-drole` (03/12) | vanne / relais (03/12) | |
| 07/12 | `faire-rire-un-enfant-repas-de-fete` | aucun article programmé après le 03/12 `[À VÉRIFIER avec @seo]` : vannes de Noël hors liste réservée | vanne / situation de pot de fin d'année | |
| 14/12 | `jeux-de-repartie-soiree-nouvel-an` | `meilleures-blagues-droles-2026` passé à 2027 (17/12) | vanne / vanne | refonte 2027 du 15 au 20/12 |
| 21/12 | `etre-drole-sans-alcool-soiree` | 24/12 : X `cs14jkee5c537f7286c1da98`, IG `cs14jk4fe660e7238281ce47` | vanne / vanne (déplacée au mer. 23/12) | ven. 25/12 sans lien : X `cs14jkc4a2c545e132b38a92`, IG `cs14jkffeab1620070f2263e` |
| 28/12 | `resolution-nouvelle-annee-etre-plus-drole` | relais vœux (31/12, exception §1) ; ven. 01/01 : message de vœux de l'article (`saison`) | vanne (29/12) / relais vœux (31/12) | fin du lot 2 dim. 03/01 ; lun. 04/01 : vœux repris (lot 3) |

Contrôle de la passe : les 18 lignes identifiées de ce tableau (dont les 4 de Noël) et des modèles §6 sont toutes distinctes ; aucune n'apparaît deux fois à moins de 90 jours ; aucune vanne réservée n'apparaît avant le 24/12. Aucun pivot sur dimanche (heure d'hiver du 25/10 et Toussaint du 01/11 retirés).

## 4. Mesure

**Règle de jugement unique : par réseau.** Chaque réseau est jugé seul, à J+28 et J+56 de SON J0. Aucun seuil combiné. Détail et relevé : `docs/social/mesure.md` (aligné sur cette v4).
**Baseline** (captures datées, avant chaque J0) : abonnés du réseau, impressions Google de « deviens marrant » (0 sur 90 jours), visites `utm_source` des 28 derniers jours (0), **inscriptions totales par semaine toutes sources, comptées en base (`createdAt`)**, pas dans Umami (aucun `inscription-reussie` avant le déploiement) ; chaque lundi, les `inscription-reussie` Google sont comparés aux créations en base (le clic sur `/register` surcompte). **« Visite » = session Umami.** Plancher de contrôle : référents `t.co`, `l.instagram.com`, `lnkd.in` (un lien posé sans UTM y apparaît).
**Relevé du lundi** (30 min) : abonnés nets, posts prévus et publiés, couverture ou impressions, engagement, visites par `utm_source`, entonnoir `/liens` > `quiz-termine` > `inscription-reussie` > `onboarding-termine` par `origine`, écart clics bio contre visites UTM, taux de réponse sous 24 h, **minutes réelles passées**.

Seuils par réseau, cumulés depuis son J0 `[HYPOTHÈSE : à valider par Thomas, aucun benchmark interne]` :

| Mesure (succès / échec) | Instagram J+28 | X J+28 | LinkedIn J+28 | Instagram J+56 | X J+56 | LinkedIn J+56 |
|---|---|---|---|---|---|---|
| Abonnés gagnés | ≥ +120 / < +30 | ≥ +40 / < +10 | ≥ +30 / < +10 | ≥ +300 / < +80 | ≥ +100 / < +30 | ≥ +80 / < +25 |
| Visites `utm_source` | ≥ 20 / < 4 | ≥ 20 / < 4 | ≥ 10 / < 2 | ≥ 50 / < 10 | ≥ 50 / < 10 | **≥ 25 / < 5** |
| Engagement (médiane de tous les posts depuis J0) | partages + enreg. / couverture ≥ 2 % / < 0,5 % | (réponses + citations) / impressions ≥ 0,5 % / < 0,1 % | (réactions + commentaires) / impressions ≥ 3 % / < 1 % | idem | idem | idem |

Sommes de contrôle : abonnés au succès à J+56 = 300 + 100 + 80 = **480** (échec 135) ; à J+28 190 / 50 ; visites à J+28 20 + 20 + 10 = 50 (échec 10) ; à J+56 50 + 50 + 25 = **125** (échec 10 + 10 + 5 = **25**). LinkedIn visites : ×2,5 de J+28 à J+56 comme X et Instagram. Seuils d'engagement X et LinkedIn à fixer par Thomas avant J0.
**Décision, par réseau** : maintien si au moins 2 mesures sur 3 en succès ; ajustement sinon ; **pause et réallocation vers SEO et tunnel seulement si les 3 sont sous le seuil d'échec aux DEUX jalons**. **Ajustement aux deux jalons consécutifs : cadence réduite (X 3, Instagram 3, LinkedIn 1 par semaine) et minutes plafonnées à 60 par semaine**, pour qu'un réseau à 25 abonnés ne reste pas à pleine cadence. Quiz, inscriptions et activation attribués sont lus, jamais jugés ; le MRR n'est jamais un critère du social. **Contrôle J+14** : 0 visite UTM, ou abonnés sous 10 % du seuil de succès J+28 du réseau = vérifier le lien de bio, le clic sur `/liens`, l'OAuth dans l'application, avant tout ajustement.
Honnêteté : environ 480 abonnés combinés au succès à J+56 ne font pas 10 000 à 12 mois (il faudrait environ 190 par semaine, soit 3 fois le rythme du succès) : Thomas révise l'objectif à J+56 ou on change d'échelle.

## 5. Sort des files retenues

Format des deux fichiers : `id`, `scheduledAt`, `format`, `content`, `approvedBy`, `directorScore` nul. Aucun texte ne repart sans validation des 9 étalons. Tri par script puis relecture :
- **Garder** (re-datés sur la grille, vanne à la 1re personne passée entre « ») : toute vanne dont le texte est celui du catalogue mot pour mot, si elle passe la règle des 90 jours tous réseaux et la liste de réservation. Cartes à re-rendre avec le gabarit validé.
- **Réécrire** : les légendes Instagram qui recopient la carte (remplacées par « À envoyer à... »), les vannes à motif répété (trois vannes « pain » : 30 jours d'écart au moins).
- **Jeter** : tout post d'article au titre nu et tout post daté périmé (Halloween du 05/10) ; remplacés par le relais (§1).
- Statut : les 33 posts Instagram restent REJECTED et les 40 posts X retirés de la file jusqu'à validation ; lot refait sur la grille par @social, inséré par @fullstack (§2.9).

## 6. Les 9 posts modèles v4

Aucun émoji, aucun tiret cadratin, aucun hashtag les deux premières semaines. Tout texte neuf passe la relecture à l'aveugle (2 relecteurs) avant présentation à Thomas, avec repli indiqué. **Lecture du 10/10 de drôlerie** (plan, étalonnage) : au niveau de la note à l'aveugle d'Alexa (9 au cycle 3). Au cycle 3, X1 et L1 y sont (9) ; mimes, canapé, tuteur et vanne de la sœur sont à 8,5, voisin et Maxime à 8 : le cycle 4 de relecture à l'aveugle tranche, et toute vanne sous Alexa est remplacée par une vanne du catalogue notée à ce niveau (R1).

**X1, vanne, mar. 13/10 12:30**, pas de lien. JOKE `cmmnsqn130027th63at2ene9i` (plancher fondateur, mot pour mot, R6). Postée une seule fois.
> « J'ai dit à Alexa de me raconter une blague. »
> « Elle m'a lu mon historique de recherches. »

**X2, relais du jeudi, jeu. 22/10 12:30.** Article `message-anniversaire-drole-par-situation` (CATALOGUE, 21 messages). Aveugle cycle 3 : n°21 à 7 (« l'excuse avant la chute »), donc R1 : vanne du catalogue du même thème, JOKE `cs14jk10c844a13d108646fd` (8,5 à l'aveugle, mot pour mot, guillemets imbriqués “ ”).
> « Ma sœur m'a dit qu'elle m'avait “pardonné” mon retard à son anniversaire. »
> « Elle a précisé l'heure : 20 h 47. »
>
> Les 21 messages de l'article sont prêts à copier : https://deviens-marrant.fr/blog/message-anniversaire-drole-par-situation?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=jeudi

**X3, vanne avec quiz, mer. 21/10 12:30.** JOKE `cs14jk1a722c352c691f600e` (mot pour mot, 8 à l'aveugle) ; 2e bloc : réécriture A de la relecture (le bloc 6,5 « mode d'emploi » est abandonné), « environ 2 minutes » comme dans la page. Environ 250 caractères, lien compté 23. Repli : « Le quiz prend environ 2 minutes, sans inscription : lien ».
> « Mon voisin tousse tous les matins à 7h12. Ce matin, 7h20. »
> « J'ai passé la journée inquiet. »
>
> Ça, c'est de l'humour d'Observateur. Et toi, tu es lequel des 5 profils ? Le quiz prend environ 2 minutes, sans inscription : https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz

**IG1, carte vanne, mar. 27/10 18:30**, 2 cartes 4:5, pas de lien. JOKE `cs14jke5d015b07714055538` (tuteur, 8,5 à l'aveugle, mot pour mot ; elle remplace les mimes, passés au relais du 12/10).
> Carte 1 : « Mon tuteur a lu mon rapport de stage. Il m'a dit “les remerciements sont très bien”. » Carte 2 : « Ils sont en page 2. Le rapport commence page 3. »
> Légende (texte neuf, 49 caractères) : À envoyer à ton tuteur de stage. deviens-marrant.fr

**IG2, relais du lundi, lun. 12/10 18:30**, 2 cartes. Article `se-presenter-avec-humour` (PRATIQUE, 5 accroches), accroche 3, JOKE `cs14jk8f28ff20e1cf82f3a8` (mimes, 8,5 à l'aveugle, mot pour mot). Remplace les archives (7,5, chute dite deux fois).
> Carte 1 : « Au jeu de mimes, ma carte disait “la timidité”. » Carte 2 : « J'avais à peine bougé qu'ils avaient trouvé. »
> Légende (texte neuf, 79 caractères, sans pied) : À envoyer à qui a un tour de table demain. Les 4 autres exemples : lien en bio.

**IG3, carrousel décryptage, mer. 14/10 18:30**, 4 cartes, vanne `cs14jk44dcd2dbf3ec29324d` (mot pour mot ; fiche « L'ironie de situation », `docs/copy/audit-vannes-s14/decryptage-ecrit-2.json`, V206). Cartes 3 et 4 : texte neuf. Un second relecteur tranche le risque « mème de groupe » avant présentation ; repli : une autre vanne RESEAUX_SOCIAUX du catalogue.
> Carte 1 : « Dans le groupe de mon ancienne classe, quelqu'un a demandé “des nouvelles de Maxime ?”. » Carte 2 : « Maxime a répondu : “je suis dans le groupe”. »
> Carte 3 : Pourquoi ça fait rire : on parle de Maxime comme s'il était absent alors qu'il lit tout, et son calme, sans le moindre reproche, fait la chute.
> Carte 4 : À toi de jouer : repère cette semaine une conversation où l'on parle d'un absent qui est en fait présent, puis écris la réponse la plus calme qu'il pourrait donner. Pour savoir quel type d'humour est le tien, le quiz est dans le lien de la bio.
> Légende : À envoyer à celui qui lit le groupe sans jamais répondre. deviens-marrant.fr

**L1, vanne de bureau, jeu. 15/10 08:15**, pas de lien. JOKE `cs14jka89abf28d3769b05fe` (mot pour mot, 8,5 à l'aveugle, 3 phrases).
> « Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis. »
> « Il est là pour prouver qu'on pourrait. »

**L2, situation de bureau, jeu. 29/10 08:15**, pas de lien. Texte neuf, réécriture A de la relecture (3 phrases, 2e personne) ; repli : JOKE `cs14jkc13a4d9d7194d8e5ea` entre « » (R6). Second relecteur sur le risque « prémisse connue ».
> Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Tu passes les quatre minutes suivantes à t'inventer trois fautes graves, dont une dans un dossier que tu n'as jamais ouvert. Il voulait le code du photocopieur.

**L3, relais, mar. 13/10 08:15.** Article `se-presenter-avec-humour` (PRATIQUE). Texte neuf, réécriture B de la relecture (2 phrases de scène) ; renvoi de 13 mots qui n'invite pas à réciter (R3) ; 3 phrases en tout (R4). Repli : JOKE `cmmnsqn130030th6381ol5rxt` (accroche 5), entre « ». Lien dans le corps (R5).
> Au tour de table, la personne juste avant toi vient d'annoncer qu'elle a monté sa boîte à 19 ans. Ton plan tient en trois mots, « Bonjour, moi c'est », et la suite est confiée à l'inspiration. Pour ce moment-là, voici 5 accroches et la formule pour trouver la tienne : https://deviens-marrant.fr/blog/se-presenter-avec-humour?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10&utm_content=relais

## Règles tranchées (une fois, non rejouées)

- **R1, note à l'aveugle contre fidélité à la source** (reviewer 7 à 10 contre aveugle 6,5 à 7,5 au cycle 2) : source exacte et mot pour mot sont nécessaires, pas suffisants ; **une ligne se choisit à la note de drôlerie à l'aveugle (8 et plus pour entrer dans le lot, note d'Alexa pour être lue 10/10)**. Une vanne du catalogue sous le seuil est remplacée par une autre, jamais réécrite. **Exception : X1 Alexa, plancher fondateur (30/09), n'est jamais soumise au seuil.** Les vannes à moins de 8 (mug, entretien, chien, small talk, archives) sont tirées en dernier.
- **R2, carrousel** : carte 3 = une phrase sur le mécanisme adaptée de la fiche de décryptage, sans impératif et sans vocabulaire de fiche (« sobriété ») ; carte 4 = une consigne « à toi de jouer » et un renvoi vrai, sans promesse sur « chaque vanne ».
- **R3, légende** : elle dit pour qui ou quand sortir la vanne, jamais ce qu'elle raconte, **et jamais une consigne de réciter la vanne telle quelle quand l'article enseigne une méthode** (PRATIQUE : « remplace le détail par le tien »). Instagram : 80 caractères au plus, pied compris.
- **R4, relais LinkedIn** : 3 phrases au plus en tout ; 2 phrases de scène et 1 phrase de renvoi (15 mots au plus), jamais la chute de l'article, aucune référence qui exige l'article. **Une ligne d'article reprise compte dans les 3 phrases** : une ligne de 3 phrases (22/10, n°6) se poste seule, sans lien.
- **R5, lien LinkedIn** : dans le corps, dernière ligne, pas de premier commentaire (offre Buffer payante).
- **R6 (nouvelle, session principale, 05/10)** : **une vanne à la 1re personne est publiée entre guillemets français « … »** (un « » dans un « » s'affiche “ ”), une ligne par paire de guillemets comme dans les articles ; le texte de marque autour ne parle jamais au nom d'une personne (« on » = la marque). Valable sur X, Instagram (cartes), LinkedIn et dans les files retenues. Thomas peut y revenir à la validation des étalons.

## Réponse aux notateurs, cycle 3

**@reviewer** : K1 (a) renvoi selon la catégorie : appliqué (§1) ; (b) Halloween : appliqué par exception amendée une fois, liste fermée (§1) ; (c) gates G-S2, G-S16, G-S19 : appliqué (§2.8) ; (d) « reviewer 7 à 10 » : appliqué ; (e) humoriste au 28/10 : appliqué. K2 T1 guillemets sur X1, X2, X3, L1 : appliqué (R6) ; option « Thomas confirme que la vanne nue vaut citation » : **refusée**, décision de la session principale. IG1 légende « binôme » : **refusée**, la relecture à l'aveugle (légende 6) a produit des légendes plus drôles ; l'idée de la vanne passe d'ailleurs en IG2 (relais). IG2 légende du reviewer : appliquée (reformulée « tour de table demain », sans « lien en bio » avant « exemples »). IG3 carte 3 : appliquée (une phrase, mot « calme » de l'aveugle) ; carte 4 : renvoi quiz **gardé mais relié à l'exercice**, la réécriture de l'aveugle sans quiz est refusée (le quiz est l'entrée du funnel sans compte). L2 « 10 » : **refusé**, aveugle 8, réécriture A. L3 « 10 » : **refusé**, aveugle 8, réécriture B. K5 (a) vannes de Noël : appliqué (réservation, §1 et §3) ; (b) 22/10 LinkedIn : n°6 seule sans lien appliquée, variante n°8 + lien **refusée** (aucune note à l'aveugle, R1) ; (d) liens X 4 en semaine d'Halloween : appliqué. Ajouts à R1, R3, R4 : tous appliqués. K9 : appliqué.
**@growth** : K1 (a) test dans l'application du réseau : appliqué ; (b) registre des J0 et règle de C1 : appliqué (`mesure.md` §6) ; (c) cadence réduite et 60 min : appliqué ; (d) plafond Buffer : appliqué et vérifié (§2.9). K6 (1) variante serveur / middleware : **refusé**, détection côté client conservée pour le prérendu (instruction de la session principale) ; (2) bouton Google désactivé et critère de test : appliqué ; (3) bascule et `origine` : appliqué (§2.5) ; (4) `utm_content` du 30/10 : `saison` ; (5) `dynamicParams = false` : appliqué. K8 (a) à (e) : tous appliqués (§1 Marc, §4) ; la forme de `src` reste `[À VÉRIFIER]`.
**Relecture à l'aveugle** : X2 et IG2 remplacés (R1), X3 bloc 2, IG1 légende, IG3 cartes 3 et 4, L2, L3 réécrits ; second relecteur demandé sur IG3 (Maxime) et L2. Tous les textes neufs de cette v4 repassent à l'aveugle au cycle 4, avant présentation à Thomas.
