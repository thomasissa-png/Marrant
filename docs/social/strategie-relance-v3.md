# Stratégie de relance des 3 réseaux, v3 (cycle 3, s15, 05/10/2026)

> Document autonome. Remplace `audit-note-s15.md` §6 à §8 et la v2. Choix fondateur du 05/10 : relance de X, Instagram et LinkedIn, consignes du 01/10 annulées ; restent valables : compte = marque (vanne citée à la 1re personne admise), X sans thread, LinkedIn sans ton coach ni corporate (post de 3 phrases au plus, fluides, tutoiement, format POTE_AU_TAF), style fluide, humoristes nommés et cités autorisés (citation réelle, jamais inventée), zéro tiret cadratin, jamais de mention IA, contenu préparé par lot. Vannes = catalogue validé (`docs/copy/catalogue-vannes-valides.md`, mot pour mot) ou lignes des articles du site (`docs/copy/articles-q4/`, `docs/copy/articles-forte-frappe/`), relues à l'aveugle (2 relecteurs).
> Point de départ au 05/10 : aucun post en attente (les 33 posts Instagram et les 40 posts X sont retenus, §5) ; Instagram reconnecté dans Buffer ; LinkedIn muet depuis août ; abonnés inconnus ; 1 visite sociale en 28 jours contre 455 en recherche organique. Tout est à construire.

## 1. Stratégie des 3 réseaux

| Réseau | Étape du funnel | Rôle | Destination du lien | Métrique pilote | Personas |
|---|---|---|---|---|---|
| Instagram | Acquisition : notoriété et partage | « je l'envoie à un pote » | lien de bio `/liens` : article (s'il a moins de 48 h) ou quiz en premier | (partages + enregistrements) / couverture, clics bio | Yanis, Sophie ; Marc via les relais rencontre et couple |
| X | Acquisition : clic | tester ce qui circule ; lien direct dans le post | article (relais lundi et jeudi), quiz (mercredi) | visites `utm_source=x`, (réponses + citations) / impressions | Yanis, Sophie ; Marc via les mêmes relais |
| LinkedIn | Acquisition qualifiée | vanne de bureau, situation, relais d'article à angle travail | article en dernière ligne du post (pas de premier commentaire, §2) | (réactions + commentaires) / impressions, visites `utm_source=linkedin` | Sophie seule (Marc n'y est pas ciblé) |

Funnel commun : post, puis article ou quiz (valeur sans compte), puis CTA de la page (compte gratuit), puis `inscription-reussie`, puis `onboarding-termine` (activation). Le social ne mène jamais à `/abonnement` et ne parle jamais de prix (choix du 06/05).
**Marc** (34 ans, séparé) : hypothèse « Instagram et X » uniquement, via les relais rencontre (29/10) et couple (05/11). Seuil `[HYPOTHÈSE]` : au moins 15 visites sociales cumulées sur ces 2 articles et au moins 1 `quiz-termine` d'origine sociale. Lecture à J+28, verdict à J+56 seulement (l'article du 05/11 n'aurait que 4 jours à J+28) ; sous le seuil, hypothèse abandonnée.

**Grille hebdomadaire unique** (heures de Paris `[HYPOTHÈSE : créneaux à tester, relevé à J+28]`) : 12 posts.

| Jour | X 12:30 | Instagram 18:30 | LinkedIn 08:15 |
|---|---|---|---|
| Lundi | relais de l'article du lundi (une ligne de l'article + lien) | carte relais : une autre ligne de l'article, légende « lien en bio » | aucun |
| Mardi | vanne | carte vanne | relais du lundi si angle bureau, sinon vanne de bureau |
| Mercredi | vanne + lien du quiz | carrousel décryptage (4 cartes) | aucun |
| Jeudi | relais de l'article du jeudi, sinon vanne saisonnière | carte relais du jeudi, sinon carte vanne | relais du jeudi si angle bureau, sinon situation neuve ou vanne |
| Vendredi | vanne | carte vanne | aucun |

Totaux : X 5 (3 vannes, 2 relais), Instagram 5 (2 cartes vanne, 1 carrousel, 2 relais), LinkedIn 2 (au moins 1 vanne ou situation par semaine, jamais 2 relais). Pas de relais du jeudi avant le 22/10.
**Piliers sur ces 12 posts** : vanne 6 (50 %), relais X et Instagram 4 (33 %), décryptage 1 (8 %), LinkedIn relais ou situation 1 (8 %). **Catalogue ou propre** : vannes du catalogue mot pour mot 7 (58 %, carrousel compris ; ses cartes 3 et 4 sont du texte neuf tiré de la fiche de décryptage), lignes d'article mot pour mot 4 (33 %), texte neuf relu à l'aveugle 1 (8 %). Une fois par mois, le carrousel du mercredi cite un humoriste (citation réelle sourcée, vérifiée avant). Chaque post tient à un pilier et à au moins un des 3E (éduquer, divertir, engager).
**Conditions de départ, J0 par réseau** (premier lundi où ses conditions sont réunies, au plus tôt le 12/10 ; baseline relevée le dimanche qui précède) : C1 validation des 9 étalons par Thomas (règle P0 s8) ; C2 e-mail avant Google pour tout navigateur intégré en ligne et test Google dans les 3 applications (§2) ; C3 `/liens` trois routes en ligne ; C4 LinkedIn débloqué dans le code et statut réel Buffer relu (@fullstack). **X = C1 + C2 ; Instagram = C1 + C2 + C3 ; LinkedIn = C1 + C2 + C4.** Les articles sont datés : un relais dont l'article a plus de 7 jours passe en vanne simple, sans lien ni « lien en bio ».
**Temps humain plafonné** : relevé du lundi 30 min (dont 10 min de statistiques natives), réponses 15 min par jour au plus (jusqu'à 105 min par semaine), réponse sous 24 h les jours ouvrés avec banque de réponses (pattern d'invitation du 06/05, troll : silence ou chaleur détachée).
**Stock et anti-répétition** : 7 vannes catalogue par semaine, soit 91 par fenêtre de 90 jours sur 125 validées, plus les lignes d'article catalogue reprises par les relais `[HYPOTHÈSE : marge faible]` : @copywriter livre 30 vannes neuves par mois, relues à l'aveugle, première livraison le 02/11. **Règle : aucune vanne ni ligne d'article n'est postée deux fois à moins de 90 jours, tous réseaux confondus** (remplace « 90 jours par réseau et 7 jours entre réseaux » de la v2). Le script de préparation lit le registre des posts du lot ET les posts publiés des 90 derniers jours en base, et bloque si le stock éligible tombe sous 7. Les articles eux-mêmes ne comptent pas comme posts.

## 2. Liens et attribution

| Paramètre | Valeur |
|---|---|
| `utm_source` | `x`, `instagram`, `linkedin` |
| `utm_medium` | `social` |
| `utm_campaign` | `AAAA-MM` du post ; `bio` pour `/liens` |
| `utm_content` | X : `lundi`, `jeudi`, `quiz` ; LinkedIn : `relais` ; `/liens` : `bio-article`, `bio-quiz`, `bio-vanne`, `bio-parcours`, `bio-vannes`, `bio-conseils` |

Destinations : quiz `/quiz-humour` (« environ 2 minutes » et « sans inscription » vérifiés dans la page), article `/blog/<slug>`, parcours `/parcours/repartie`. Aucun lien social ne mène à `/register` ni `/abonnement`. Aucun lien sans UTM, même ajouté à la main.

| Type de post | Appel à l'action |
|---|---|
| Vanne X (mardi, vendredi), carte vanne IG, vanne LinkedIn | aucun lien ; légende IG « À envoyer à... » ou rien, pied `deviens-marrant.fr` |
| Vanne X du mercredi | 2e bloc : renvoi au quiz, durée et « sans inscription », lien |
| Relais X (lundi, jeudi) | une ligne de l'article, puis « Les N autres sont prêts à copier : lien » |
| Relais IG, carrousel IG | « lien en bio » une seule fois. Relais : l'article a moins de 48 h donc il est en bloc 1. Carrousel (mercredi) : « le quiz est dans le lien de la bio » (vrai en bloc 1 ou 2) |
| Relais LinkedIn | lien UTM en dernière ligne du post, après la 3e phrase |

Liens ou CTA explicites : X 3 posts sur 5, Instagram 3 sur 5, LinkedIn 1 sur 2 au plus.
**Spec pour @fullstack (pas de code ici)** :
1. `/liens` reste statique (ISR 300 s) : trois routes `/liens` (Instagram, bio actuelle compatible), `/liens/x`, `/liens/li`, via `generateStaticParams`, pas de `?s=` lu côté serveur ; `utm_source` = `instagram|x|linkedin`, `utm_campaign=bio`, un `utm_content` par bloc. Les 3 bios pointent vers leur route.
2. Ordre des blocs piloté par règle : (1) l'article s'il est publié depuis moins de 48 h, sinon le quiz ; (2) l'autre des deux ; (3) vanne du jour ; (4) parcours Répartie ; (5) toutes les vannes ; (6) conseils. Les promesses des posts (relais : article ; carrousel : quiz) sont vraies dans les deux cas.
3. Persistance : lire l'UTM à l'arrivée (sessionStorage), l'envoyer en propriété `origine` sur `quiz-termine`, `parcours-etape`, `inscription-envoi`, `inscription-reussie`, `onboarding-termine` (`src` inchangé). **Limite écrite : attribution = session d'arrivée** ; une personne qui revient le lendemain n'est pas attribuée.
4. `/register` : navigateur intégré détecté côté serveur par user-agent (Instagram, LinkedIn, X/Twitter, Facebook) : formulaire e-mail avant le bouton Google, quel que soit `origine` (Google refuse l'OAuth dans les vues intégrées, erreur `disallowed_useragent`, vérifié ; le serveur évite que les boutons changent d'ordre après l'affichage).
5. Tests mobile avant le J0 de chaque réseau : Google dans les applications Instagram, LinkedIn et X, plus Safari et Chrome. Consigner dans `REPLIT_ACTIONS.md`.
6. LinkedIn : le premier commentaire programmé par Buffer exige une offre payante (pages d'aide Buffer, vérifié le 05/10) : **pas de premier commentaire**, le lien va dans le corps du post. Reach moindre sur les posts à lien assumé : 1 post LinkedIn sur 2 reste sans lien, lecture à J+28. Si Thomas prend l'offre payante, la règle sera réexaminée une fois.
7. `mesure.md` est aligné sur cette v3 (fait). @data-analyst : visites par `utm_source` et événements par `origine` via l'API Umami dans l'e-mail du lundi.

## 3. Calendrier

Lot 1 : lun. 12/10 au dim. 15/11 (après validation des étalons). Lot 2 : lun. 16/11 au dim. 03/01 (relu à l'aveugle avant le 09/11). Détail post par post dans `docs/social/editorial-calendar.md` (colonnes Semaine, Date, Plateforme, Format, Pilier, Hook, CTA, Statut). Chaque article du lundi et du jeudi est relayé sur X et Instagram (**deux lignes différentes**), et sur LinkedIn quand l'angle est le travail (une troisième ligne ou une scène neuve). Les lignes ci-dessous sont fixées ; les cases « tirage » sont remplies par le script, avec le registre de 90 jours.

| Semaine | Lundi (X + IG) | Jeudi (X + IG) | LinkedIn mar. / jeu. | Pivots |
|---|---|---|---|---|
| 12/10 | `se-presenter-avec-humour` : X `cs14jkd6b11e811ffbf7f301`, IG `cs14jk0aa83dd779a1c72b43` | aucun article le 15/10 : tirage | L3 relais (13/10) / L1 canapé (15/10) | mar. 13/10 X1 Alexa ; mer. 14/10 carrousel IG3 |
| 19/10 | `humour-en-colocation-desamorcer-tensions` : tirage | `message-anniversaire-drole-par-situation` (22/10) : X n°21, IG n°13 | vanne (20/10) / n°6 de l'article, carte du bureau (22/10) | mer. 21/10 X3 avec quiz |
| 26/10 | `blagues-sur-l-ia-assistants-vocaux` : X n°5 `cs14jkf0a20e0837fa95c784`, IG n°4 `cs14jke6736001250d3a940d` (n°1 Alexa exclue, déjà postée le 13/10) | `premier-message-drole-appli-de-rencontre` (29/10, Marc) : tirage | vanne (27/10) / L2 situation (29/10) | mar. 27/10 IG1 mimes ; ven. 30/10 Halloween : X ligne n°3 de `blagues-halloween-soiree-deguisee` + lien, IG carte `cs14jk1bc86d3502a2cef27b` sans lien ni « lien en bio » (le bio mène alors à l'article du 29/10) |
| 02/11 | `humour-en-visio-reunion-en-ligne` : tirage | `blagues-de-couple-drole` (05/11, Marc) : tirage, **jamais la n°18** (réservée au 24/12) | relais (03/11) / vanne | mer. 04/11 carrousel avec citation d'humoriste (1er du mois) |
| 09/11 | `chambrer-sans-blesser-entre-potes` | `voeux-drole-nouvelle-annee` (12/11), relais léger « à garder de côté » | vanne / vanne ou situation | 11/11 : silence ; fin du lot 1 |
| 16/11 | `soiree-de-noel-entreprise-humour` | article du 19/11 (invitation, fichier B1) | relais (17/11) / vanne | début du lot 2 |
| 23/11 | `repas-de-famille-questions-genantes-humour` | article du 26/11 (gamer, fichier B2) | vanne / vanne ou situation | Black Friday 27/11 : silence |
| 30/11 | `toast-drole-discours-qui-fait-rire` | `mot-de-depart-collegue-drole` (03/12) | vanne / relais (03/12) | |
| 07/12 | `faire-rire-un-enfant-repas-de-fete` | aucun article programmé après le 03/12 `[À VÉRIFIER avec @seo]` : vannes de Noël | vanne / situation de pot de fin d'année | |
| 14/12 | `jeux-de-repartie-soiree-nouvel-an` | `meilleures-blagues-droles-2026` passé à 2027 (17/12, vannes de la page publiée) | vanne / vanne | refonte 2027 du 15 au 20/12 |
| 21/12 | `etre-drole-sans-alcool-soiree` | 24/12 : X `cs14jkee5c537f7286c1da98`, IG `cs14jk4fe660e7238281ce47` | vanne / vanne (déplacée au mer. 23/12) | ven. 25/12 sans lien : X `cs14jkc4a2c545e132b38a92`, IG `cs14jkffeab1620070f2263e` |
| 28/12 | `resolution-nouvelle-annee-etre-plus-drole` | relais vœux (31/12) ; ven. 01/01 : message de vœux de l'article | vanne (29/12) / relais vœux (31/12) | fin du lot 2 dim. 03/01 ; lun. 04/01 : vœux repris (lot 3) |

Contrôle de la passe : les 20 identifiants de ce tableau et des modèles §6 sont tous distincts ; aucun n'apparaît deux fois à moins de 90 jours. Pas de pivot sur dimanche (heure d'hiver du 25/10 et Toussaint du 01/11 retirés : aucune vanne au catalogue, aucun post ce jour-là).

## 4. Mesure

**Règle de jugement unique : par réseau.** Chaque réseau est jugé seul, à J+28 et J+56 de SON J0 (J0 = lundi de départ du réseau, §1 ; baseline relevée le dimanche qui précède). Aucun seuil combiné ne décide de quoi que ce soit. Détail, tableau de relevé et lectures Umami : `docs/social/mesure.md` (aligné sur cette v3).
**Baseline** (captures datées, avant chaque J0) : abonnés du réseau, impressions Google de « deviens marrant » (0 sur 90 jours), visites `utm_source` des 28 derniers jours (0), **inscriptions totales par semaine toutes sources** (dénominateur). **Relevé du lundi** (30 min, dont ~10 min de statistiques natives ; Umami par API) : abonnés nets, posts prévus et publiés (statut Buffer), couverture ou impressions, engagement du réseau, visites par `utm_source`, entonnoir `/liens` > `quiz-termine` > `inscription-reussie` > `onboarding-termine` par `origine`, taux de réponse sous 24 h, **minutes réelles passées** (comparées au résultat à J+56).

Seuils par réseau, cumulés depuis son J0 `[HYPOTHÈSE : à valider par Thomas, aucun benchmark interne]` :

| Mesure (succès / échec) | Instagram J+28 | X J+28 | LinkedIn J+28 | Instagram J+56 | X J+56 | LinkedIn J+56 |
|---|---|---|---|---|---|---|
| Abonnés gagnés | ≥ +120 / < +30 | ≥ +40 / < +10 | ≥ +30 / < +10 | ≥ +300 / < +80 | ≥ +100 / < +30 | ≥ +80 / < +25 |
| Visites `utm_source` | ≥ 20 / < 4 | ≥ 20 / < 4 | ≥ 10 / < 2 | ≥ 50 / < 10 | ≥ 50 / < 10 | ≥ 30 / < 10 |
| Engagement (médiane des posts) | partages + enreg. / couverture ≥ 2 % / < 0,5 % | (réponses + citations) / impressions ≥ 0,5 % / < 0,1 % | (réactions + commentaires) / impressions ≥ 3 % / < 1 % | idem | idem | idem |

Sommes de contrôle : abonnés au succès à J+56 = 300 + 100 + 80 = **480** (à l'échec 80 + 30 + 25 = **135**) ; à J+28 190 / 50 ; visites à J+28 20 + 20 + 10 = 50 (échec 10) ; à J+56 50 + 50 + 30 = 130 (échec 30). Les seuils d'engagement X et LinkedIn sont des hypothèses à fixer par Thomas avant J0.
**Décision, par réseau, sur les 3 mesures ci-dessus** : maintien si au moins 2 sont en succès ; ajustement (créneaux, ratio vanne et relais, destination) sinon ; **pause et réallocation vers SEO et tunnel seulement si les 3 sont sous le seuil d'échec aux DEUX jalons, J+28 et J+56**. Quiz, inscriptions et activation attribués sont lus, jamais jugés (volumes trop faibles par réseau) ; le MRR n'est jamais un critère du social. **Contrôle J+14** de chaque réseau : 0 visite UTM, ou abonnés sous 10 % du seuil de succès J+28 du réseau = vérifier le lien de bio, le clic sur `/liens`, l'OAuth dans l'application, avant tout ajustement.
Honnêteté : environ 480 abonnés combinés au succès à J+56 ne font pas 10 000 à 12 mois (il faudrait environ 190 par semaine, soit 3 fois le rythme du succès) : Thomas révise l'objectif à J+56 ou on change d'échelle.

## 5. Sort des files retenues

Format des deux fichiers : `id`, `scheduledAt`, `format`, `content`, `approvedBy`, `directorScore` nul. Aucun texte ne repart sans validation des 9 étalons. Tri par script puis relecture :
- **Garder** (re-datés sur la grille) : toute vanne dont le texte est celui du catalogue mot pour mot (X ou carte Instagram), si elle passe la règle des 90 jours tous réseaux (plusieurs sont en double sur X et Instagram à moins de 7 jours, par exemple « faire la vaisselle »). Cartes à re-rendre avec le gabarit validé.
- **Réécrire** : les légendes Instagram qui recopient la carte (remplacées par « À envoyer à... »), les vannes à motif répété (trois vannes « pain » : 30 jours d'écart au moins).
- **Jeter** : tout post d'article au titre nu (titre + lien) et tout post daté périmé (Halloween du 05/10) ; remplacés par le relais à ligne d'article (§1).
- Statut : les 33 posts Instagram restent REJECTED et les 40 posts X retirés de la file jusqu'à validation ; lot refait sur la grille par @social, inséré par @fullstack.

## 6. Les 9 posts modèles v3

Aucun émoji, aucun tiret cadratin, aucun hashtag les deux premières semaines (puis test de 3 sur une carte sur deux). Les phrases neuves sont marquées « texte neuf » : relecture à l'aveugle (2 relecteurs) avant présentation à Thomas, avec repli indiqué. Les vannes remplaçantes (X3, IG2, IG3, L1) et la ligne d'article de X2 ont passé la relecture s14 du catalogue ou des articles, mais n'ont pas encore leur note de drôlerie à l'aveugle du cycle 3 (seuil 8, R1) : à passer avant la présentation à Thomas.

**X1, vanne, mar. 13/10 12:30**, pas de lien. JOKE `cmmnsqn130027th63at2ene9i` (plancher fondateur, mot pour mot). Postée une seule fois.
> J'ai dit à Alexa de me raconter une blague.
> Elle m'a lu mon historique de recherches.

**X2, relais du jeudi, jeu. 22/10 12:30.** Article `message-anniversaire-drole-par-situation`, message n°21 (21 messages, donc « Les 20 autres » exact).
> Joyeux anniversaire. Hier, j'ai pensé à toi. Mon téléphone était dans l'autre pièce. J'ai jugé la distance trop grande.
>
> Les 20 autres messages sont prêts à copier : https://deviens-marrant.fr/blog/message-anniversaire-drole-par-situation?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=jeudi

**X3, vanne avec quiz, mer. 21/10 12:30.** JOKE `cs14jk1a722c352c691f600e` (mot pour mot) ; seul le 2e bloc est du texte neuf (profil « L'Observateur » et « 5 profils » vérifiés dans la page du quiz ; repli : le 2e bloc seul, « Le quiz prend environ 2 minutes, sans inscription »).
> Mon voisin tousse tous les matins à 7h12. Ce matin, 7h20.
> J'ai passé la journée inquiet.
>
> Ça, c'est de l'humour d'Observateur. Le quiz « quel type d'humour es-tu ? » compte 5 profils et prend environ 2 minutes, sans inscription : https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz

**IG1, carte vanne, mar. 27/10 18:30**, 2 cartes 4:5, pas de lien. JOKE `cs14jk8f28ff20e1cf82f3a8` (mot pour mot ; la vanne n'est pas retouchée, seule la légende est neuve).
> Carte 1 : « Au jeu de mimes, ma carte disait “la timidité”. » Carte 2 : « J'avais à peine bougé qu'ils avaient trouvé. »
> Légende : À envoyer à quelqu'un qui n'a besoin d'aucun geste pour être compris. deviens-marrant.fr

**IG2, relais du lundi, lun. 12/10 18:30**, 2 cartes. Article `se-presenter-avec-humour`, accroche 1 (JOKE `cs14jk0aa83dd779a1c72b43`, mot pour mot ; l'article en compte 5).
> Carte 1 : « J'ai passé mon stage à ranger les archives par ordre alphabétique. » Carte 2 : « Depuis, plus personne ne retrouve rien. Ils avaient un système. »
> Légende : À sortir au tour de table de rentrée. Les 4 autres accroches de l'article sont en lien en bio.

**IG3, carrousel décryptage, mer. 14/10 18:30**, 4 cartes, vanne `cs14jk44dcd2dbf3ec29324d` (mot pour mot ; décryptage « L'ironie de situation » dans `docs/copy/audit-vannes-s14/decryptage-ecrit-2.json`, V206). Cartes 3 et 4 : texte neuf tiré de cette fiche.
> Carte 1 : « Dans le groupe de mon ancienne classe, quelqu'un a demandé “des nouvelles de Maxime ?”. » Carte 2 : « Maxime a répondu : “je suis dans le groupe”. »
> Carte 3 : « Pourquoi ça fait rire : le groupe parle de Maxime comme s'il n'était pas là, alors qu'il lit tout. Il ne proteste pas, il constate, et c'est cette sobriété qui fait rire. »
> Carte 4 : « À toi de jouer : repère une scène où l'on parle de quelqu'un comme s'il était absent, alors qu'il est là. Le quiz « quel type d'humour es-tu ? » est dans le lien de la bio. »
> Légende : À envoyer à celui qui lit le groupe sans jamais répondre. deviens-marrant.fr

**L1, vanne de bureau, jeu. 15/10 08:15**, pas de lien. JOKE `cs14jka89abf28d3769b05fe` (mot pour mot).
> Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis.
> Il est là pour prouver qu'on pourrait.

**L2, situation de bureau, jeu. 29/10 08:15**, pas de lien. Texte neuf ; repli : JOKE `cs14jkc13a4d9d7194d8e5ea`.
> Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Tu passes les quatre minutes suivantes à relire tes trois derniers mois et à te trouver coupable de deux choses. Il voulait le code du photocopieur.

**L3, relais, mar. 13/10 08:15.** Article `se-presenter-avec-humour` (5 accroches). Texte neuf (la scène du tour de table n'est pas dans l'article) ; repli : JOKE `cmmnsqn130030th6381ol5rxt` (accroche 5 de l'article, sans scène ; `cs14jkd6b11e811ffbf7f301` est déjà sur X le 12/10). Le lien est dans le corps du post.
> Au tour de table, la personne juste avant toi vient d'annoncer qu'elle a monté sa boîte à 19 ans. Toi, tu as préparé « Bonjour, moi c'est » et tu comptes sur l'inspiration pour la suite. On a réuni 5 accroches pour ce moment-là : https://deviens-marrant.fr/blog/se-presenter-avec-humour?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10&utm_content=relais

## Règles tranchées (une fois, non rejouées)

- **R1, note à l'aveugle contre fidélité à la source** (reviewer 10 contre aveugle 6,5 à 7,5 sur X2, X3, L1, IG2, IG3) : source exacte et mot pour mot sont nécessaires, pas suffisants ; **le choix d'une ligne se fait à la note de drôlerie à l'aveugle (8 et plus)**. Une vanne du catalogue notée sous 8 est remplacée par une autre, jamais réécrite (texte du catalogue intouchable). Les vannes à moins de 8 (mug, entretien, chien, small talk) sortent des modèles et sont tirées en dernier.
- **R2, carrousel** (reviewer : carte 3 « pas pour toi » contre aveugle : « explique la vanne ») : carte 3 = une phrase sur le mécanisme, reprise de la fiche de décryptage existante, sans impératif ; carte 4 = une consigne « à toi de jouer » et un renvoi vrai, sans promesse sur « chaque vanne ».
- **R3, légende** : elle dit pour qui ou quand sortir la vanne (« À envoyer à... », « À sortir au... »), jamais ce qu'elle raconte.
- **R4, relais LinkedIn** : 2 phrases de scène et 1 phrase de renvoi (15 mots au plus), jamais la chute de l'article, aucune référence qui exige l'article pour être comprise.
- **R5, lien LinkedIn** : dans le corps, dernière ligne, pas de premier commentaire (offre Buffer payante).

## Réponse aux notateurs

**Cycle 1** : appliqués tels que décrits dans la v2 (grille unique, piliers, files, stock, Halloween, lot 2). Le point « Marc sur LinkedIn » est désormais cohérent partout (§1).
**@reviewer cycle 2** : K1 (a) navigateurs intégrés : appliqué, e-mail avant Google pour toute vue intégrée par user-agent (§2.4) ; (b) premier commentaire : **refusé** (offre Buffer payante, R5), lien dans le corps ; (c) +480 et (d) 7 vannes : appliqués. X2 « figer n°4 » : **refusé**, 6,5 à l'aveugle, n°21 retenu (R1). « n°12 pour LinkedIn » : **refusé**, la n°12 est dans la section parents de l'article (à table), LinkedIn prend la n°6 (section bureau). X3 : bloc quiz adapté (profils réels), vanne remplacée (R1). IG2 : légende appliquée (R3), vanne remplacée par l'accroche 1. IG3 : cartes du reviewer remplacées par R2, carte 4 sans « chaque vanne a son décryptage » (G_PROOF). L1 : 10 du reviewer **refusé**, 7,5 à l'aveugle (R1). L2 : sa réécriture « trois petits points » **refusée**, la réécriture A de la relecture à l'aveugle règle le même défaut. L3 : sa réécriture avec « alternant2 » **refusée** (cryptique sans l'article, R4), remplacée ; texte neuf compté. K5 (a) Halloween, (b) n°18 réservée au 24/12, (c) Alexa exclue du relais du 26/10, (d) pivots dimanche retirés : tous appliqués. K9 : appliqué. Point 5 (125 décryptages en base) : sans objet, aucune promesse. Point 7 (cartes rendues, K3) : hors périmètre, en attente de @design.
**@growth cycle 2** : K1 (a) J0 par réseau, (b) seuil Marc et tableau §1, (c) `onboarding-termine`, (d) minutes réelles : appliqués. K6 (1) ordre de `/liens` par règle, (2) pages statiques, (3) e-mail pour toute vue intégrée et test dans 3 applications, (5) limite d'attribution, (6) durée du quiz vérifiée dans la page : appliqués ; (4) workflow du premier commentaire : sans objet (R5). K8 : 480 contre 135, seuils par réseau, règle unique par réseau, pause sur deux jalons, J+14 sur 10 % du seuil J+28, relevé Umami par API, dénominateur d'inscriptions, `mesure.md` réécrit : tous appliqués. Seuils d'engagement X et LinkedIn : proposés en `[HYPOTHÈSE]`, Thomas décide.
**Relecture à l'aveugle cycle 2** : X2, X3, L3 (les 3 plus faibles) remplacés ; pour chaque post sous 10, une réécriture proposée est retenue ou le texte est changé (L2 : réécriture A ; L3 : réécriture B ; IG1 : légende B, la vanne reste intacte ; IG2, IG3, L1, X2, X3 : autre texte validé par R1). Réécriture A d'IG1 et réécritures de vanne refusées : texte du catalogue intouchable (R1).
