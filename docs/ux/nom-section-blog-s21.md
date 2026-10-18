# Nom de la section « Blog » : faut-il le changer ? (s21, 18/10/2026)

> @ux avec l'angle @seo. Aucun code, aucun git, rien modifié sur le site.
> Sources lues : `CLAUDE.md`, `project-context.md` (personas, ton), `docs/copy/ton-alex.md`, le worktree `agent-a6072b0ac19da7774` (`header.tsx`, `mobile-nav.tsx`, `footer.tsx`, `blog/page.tsx`, `blog-list-client.tsx`, `blog-labels.ts`, pages `/conseils`, `/vannes`, `/videos`, `/parcours`), `docs/qa/captures-s21/final/header-budget-resultat.txt`, la capture `docs/qa/captures-s21/integration/menu-1280.png`, `docs/analytics/snapshot-trafic-2026-10-05.md`, `docs/seo/point-etape-s20.md`, `docs/seo/maillage-decouverte-s20.md`, `docs/copy/audit-blog-complet-s11.md`, `docs/growth/articles-forte-frappe-s14.md`.
> Limite : le lien de test (`workers.dev`) n'a pas pu être ouvert, cet environnement n'a pas d'outil de lecture web (seulement la recherche). Tout vient du code du worktree, des captures et des documents. Le 1er avis sur le rendu en ligne reste à faire par une session qui peut ouvrir le lien.

## 0. Réponse courte

- « Blog » n'est pas faux, mais c'est le nom le plus faible des 7 onglets : il dit un format générique, il ne dit pas ce qu'on y trouve, et il ne se distingue pas de « Conseils » (les deux parlent de répartie, de timing, d'autodérision).
- Meilleur candidat : **« Articles »**. 2e : **« Blog »** (le statu quo), donc le duel à l'aveugle décide « on change » ou « on garde », ce qui est la vraie question.
- SEO : changer le libellé du menu sans toucher à `/blog` n'a aucun effet sur l'indexation. Changer l'adresse : **déconseillé** (§3).
- Largeur : tous les candidats tiennent à 1280 px. Seul « Articles » est limite entre 1024 et ~1060 px pour un visiteur non connecté (§2.2).

## 1. Ce que contient vraiment la section

### 1.1 Chiffres et formes (mesures du dépôt, pas d'impression)

| Élément | Valeur | Source |
|---|---|---|
| Articles en ligne | 36 dans le sitemap au 11/10 (34 actifs après la fusion s11, plus les nouveaux) ; 11 articles « forte frappe » programmés chaque jeudi du 22/10/2026 au 03/06/2027 | point-etape-s20 §3, project-context, historique s14 |
| Longueur | 853 à 2 072 mots sur 16 articles mesurés le 12/10, soit environ 4 à 10 min de lecture à 200 mots/min [calcul de la session] | maillage-decouverte-s20 §1.2 |
| Catégories affichées (puces de filtre) | Répartie, Autodérision, Storytelling, Psychologie, Analyse, Catalogue, Contexte, Guide, Habitudes, Pratique, Timing | `blog-labels.ts` |
| Rôle dans l'acquisition | 1 495 clics Google sur ~1 547 en 90 j = 97 % viennent d'un article ; l'article n°1 seul pèse 80 % des clics sur 28 j | snapshot 05/10, point-etape-s20 §4 |
| La page liste `/blog` elle-même | 1 clic pour 564 impressions en 28 j (position 28) : on n'y arrive presque jamais depuis Google | snapshot 05/10 §2 |

Conséquence : le nom de l'onglet ne joue pas sur l'arrivée (Google envoie sur les articles, pas sur la liste). Il joue sur la circulation : le visiteur qui a fini une vanne ou un article et cherche « la suite ».

### 1.2 Les 6 familles d'articles (lecture du catalogue s11 et du plan s14)

1. **Textes à ressortir ou à envoyer** : « meilleures blagues » (l'article n°1), phrases drôles en conversation, citations, et à venir messages d'anniversaire, vœux, poisson d'avril, mot de départ. Intention : copier-coller, sortir une phrase ce soir.
2. **Guides « comment »** : comment devenir drôle (le pilier, 1 562 mots), comment avoir de la répartie, timing. Intention : comprendre et suivre un plan.
3. **Exercices et habitudes** : 10 exercices, 8 habitudes quotidiennes. Intention : s'entraîner seul.
4. **Situations** : faire rire une fille ou un homme, machine à café, soirée sans malaise, répondre aux moqueries. Intention : « j'ai ce cas demain ».
5. **Confiance et psychologie** : timidité, après une rupture, « je suis pas drôle ». Intention : lever un blocage (Yanis, Marc).
6. **Analyses de technique** : 5 types d'humour, humour noir, erreurs de blagues, storytelling. Intention : comprendre le mécanisme.

La famille 1 est la plus visitée et ressemble à « Vannes » ; les familles 2 à 4 ressemblent à « Conseils ». C'est là que se loge l'ambiguïté.

### 1.3 En quoi la section se distingue des autres onglets

| Onglet | Ce qu'on y fait | Unité | Effort demandé |
|---|---|---|---|
| Vannes | Cliquer pour révéler la chute, ressortir la vanne ce soir (≈ 600 actives) | 1 phrase + décryptage | quelques secondes |
| Conseils | Apprendre une technique : exemple, dialogue, défi du jour (≈ 400) | 1 fiche | une minute |
| Vidéos | Regarder un extrait de stand-up décortiqué (89) | 1 vidéo annotée | quelques minutes |
| Parcours | Suivre un programme semaine par semaine (5, Premium après l'étape 1) | 1 étape | 15 à 20 min par semaine |
| **Blog** | **Lire un texte long qui explique ou donne une liste** | **1 article** | **4 à 10 min de lecture** |
| La lettre | Recevoir chaque mois une vanne et un lien | 1 e-mail | passif |

Ce qui distingue vraiment la section : **c'est le seul endroit où l'on lit un texte long**. Le sujet ne la distingue pas : « répartie », « timing », « storytelling » et « autodérision » sont à la fois des catégories de Conseils (`/conseils`) et d'articles (`blog-labels.ts`). Un nom qui parle de sujet (« Guides », « Techniques ») aggraverait la confusion ; un nom qui parle de format la lève.

### 1.4 Ce que Yanis attend derrière chaque libellé

| Libellé | Yanis s'attend à | Correspond au réel ? |
|---|---|---|
| Vannes | des blagues à sortir | oui |
| Conseils | des astuces pour répondre du tac au tac | oui |
| Vidéos | des extraits de stand-up | oui |
| Parcours | un programme à suivre | oui |
| Blog | du texte « en plus » : des actus du site, des avis, du facultatif ; pas le catalogue de textes à ressortir ni les plans en 30 jours | **à moitié** : le contenu est utile et pratique, le nom le range dans le rayon « bonus » |

[FRICTION H2] : à l'étape « je veux progresser en répartie », le first-time user (Yanis, 20 ans, qui rate ses réponses en soirée) hésite entre « Conseils » et « Blog » : les deux promettent de la répartie, et « Blog » ne dit ni la durée ni l'utilité. Solution : un nom de format (ce qu'on y lit), et une phrase de pont sur la page (§4, pour @copywriter, aucun texte écrit ici).
Sophie (« contenu trop long » est sa frustration) : « Blog » n'annonce pas 10 minutes de lecture, mais la durée est déjà sur chaque carte (« X min de lecture »). Ce n'est pas le rôle du nom.

## 2. Cinq noms évalués

Notes de 1 à 5, **jugement comparatif de @ux, pas une mesure** (aucune donnée de clic sur le menu n'existe dans ce que j'ai lu). Pondération : clarté ×2 et distinction ×2 (c'est la question de Thomas), largeur, ton et SEO ×1.

### 2.1 Grille

| Nom | Clarté au 1er coup d'œil | Distinction | Largeur | Ton (pote drôle, ni scolaire ni corporate) | SEO (libellé) | Total /35 |
|---|---|---|---|---|---|---|
| **Articles** | 5 : on sait qu'on lit | 4 : s'oppose aux fiches de Conseils ; parallèle à « Vidéos » (deux onglets nommés par format) | 4 | 3 : neutre, sans couleur | 4 | **29** |
| **Blog** (référence) | 4 : compris de tous, ne dit rien du contenu | 3 : « blog » et « conseils » se recouvrent | 5 | 3 : sonne un peu blog d'entreprise, daté pour 20 ans | 4 : colle au `<title>` « Blog humour » | **26** |
| **À lire** | 3 : se lit comme une recommandation, pas comme une rubrique ; seul verbe d'une barre de noms | 4 : dit l'effort (lecture) | 5 | 4 : naturel, oral | 2 : ancre sans nom | **25** |
| **Le mag** | 3 : « mag » suggère un numéro périodique, risque de confusion avec « La lettre » | 4 | 4 | 4 : décontracté | 2 | **24** |
| **Guides** | 3 : promet du mode d'emploi, or l'entrée la plus visitée est une liste de blagues | 2 : « guide » et « conseil » sont des synonymes | 4 | 2 : tire vers « scolaire » (mot exclu de la marque) | 3 | **19** |

Écartés avant évaluation : « Décryptages » (le mot est déjà celui des vannes : « Pourquoi ça marche » ; 11 caractères, déborde), « Dossiers » (trop lourd pour un texte de 4 minutes et pour des listes de blagues), « Coulisses » et « Labo » (promettent autre chose : les coulisses du site, des expériences).

### 2.2 Largeur dans la barre (mesures du fichier `header-budget-resultat.txt`)

Constat de départ, à partir des mesures du 17/10 : le plus petit écart entre blocs (logo, onglets, recherche, actions) est **43,0 px à 1280 px** et **23,0 px à 1024 px**, pour un visiteur non connecté (le cas le plus serré : « Connexion » et « Commencer » sont présents). Le plancher de l'écart est de 16 px (`sm:gap-4` dans `header.tsx`, tout est `shrink-0`). Les 3 écarts se partagent l'espace libre à parts égales : la marge totale avant dépassement vaut donc (écart mesuré - 16) × 3, soit **≈ 81 px à 1280 px** et **≈ 21 px à 1024 px**. Un libellé plus long mange cette marge.

Largeur d'un caractère : ≈ 7 px (« Blog » ≈ 30 px, « Conseils » ≈ 58 px et « La lettre » ≈ 54 px sur la capture 1280). Les surcoûts ci-dessous sont des **majorants par nombre de caractères, `[À MESURER]` par `header-budget.spec.ts` avant livraison**.

| Nom | Surcoût vs « Blog » | Écart min. à 1280 px (visiteur) | Écart min. à 1024 px (visiteur) | Verdict |
|---|---|---|---|---|
| Blog | 0 | 43,0 px | 23,0 px | mesuré, vert |
| À lire | ≈ +14 px | ≈ 38 px | ≈ 18 px | tient |
| Guides | ≈ +14 px | ≈ 38 px | ≈ 18 px | tient |
| Le mag | ≈ +17 px | ≈ 37 px | ≈ 17 px | tient, limite basse à 1024 |
| Articles | ≈ +20 à +28 px | ≈ 34 à 36 px | ≈ 14 à 16 px | **tient à 1280 px ; entre 1024 et ~1060 px il peut passer sous le plancher de 16 px et faire échouer le test (barre plus large que sa boîte)** |

Lecture : à 1280 px, aucun candidat ne casse le budget (il resterait plus de 30 px entre blocs). Pour « Articles », le risque est étroit (1024 à ~1060 px, visiteur seulement : à 1100 px l'écart mesuré est de 48,3 px). Si la mesure le confirme, le remède est une décision @design (par exemple retirer 2 px de remplissage par onglet de 1024 à 1099 px, soit ~28 px gagnés), pas un renoncement au nom. Menu mobile et pied de page : listes verticales, aucune contrainte de largeur.

## 3. Point SEO tranché

**Changer le libellé sans changer l'adresse `/blog`.** Aucun effet sur l'indexation : Google indexe l'URL, sa canonique et son contenu ; le texte d'un lien du menu n'en fait pas partie. Effet sur le classement : négligeable, le texte d'ancre passe d'un mot générique (« Blog ») à un autre mot générique (« Articles ») sur ~470 pages (en-tête et pied de page) vers `/blog`. Aucune perte attendue, aucun gain à espérer non plus. [Jugement de @seo, non mesurable : `/blog` reçoit 1 clic pour 564 impressions en 28 j.]
Ce qu'il ne faut pas toucher dans ce chantier : l'adresse, le `<title>` (« Blog humour : guides et techniques », qui porte la requête « blog humour »), le H1 de la page, les événements Umami `blog-*`, le paramètre `?category=`. Les requêtes avec le mot « blog » existent à peine (« blog marrant » : 6 impressions en 90 j, position 41,8, 0 clic) et le titre suffit à les servir.

**Changer l'adresse (`/blog` vers `/articles` par exemple) : déconseillé.** Raisons, toutes propres à ce site aujourd'hui :
1. Une adresse ne donne aucun gain mesurable : le mot de l'URL pèse très peu, et le label du menu ne dépend pas de l'URL.
2. Coût : 36 articles (et 11 programmés jusqu'en juin 2027) changeraient d'adresse. Google doit revisiter chaque ancienne et nouvelle URL ; la documentation Google sur les déménagements d'adresses précise que, pour les 301 (qui ne font pas perdre de PageRank), Googlebot doit passer au moins une fois sur chaque URL, et que des fluctuations temporaires de classement sont possibles ([How to move a site, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)).
3. Moment : le goulot du site est justement l'exploration (304 URL sur 415 jamais explorées, `maillage-decouverte-s20`), le pilier vient de sortir d'un classement en doublon étranger le 12/10, et 10 URL sont encore à contrôler les 15 et 19/10. Ajouter 36 redirections à reprendre en charge par Google, pendant ce suivi, brouillerait la lecture de ce que fait le reste.
4. Ce qui est déjà parti : 6 numéros de la lettre pointent vers des articles, les posts réseaux et les articles s'appellent entre eux (maillage S4, 9 liens). Chaque lien passerait par une redirection de plus.
5. 97 % du trafic Google arrive sur un article, dont 80 % sur un seul (`/blog/meilleures-blagues-droles-2026`) : c'est précisément l'adresse à ne pas exposer à un déménagement.
À rouvrir seulement si le duel à l'aveugle donne un gagnant net ET après stabilisation du canonique (contrôle du 19/10) ET avec 28 jours de données : sinon jamais.

**Cohérence à tenir si le libellé change** (Nielsen H4, et les données structurées doivent refléter ce que la page affiche) : un même mot partout, sinon le menu dit « Articles » et le fil d'Ariane « Blog ». À reprendre par @fullstack (Grep « Blog » sur tout le code, aucune liste de ma part n'est garantie) : `header.tsx` (liste des onglets et commentaires), `footer.tsx`, fil d'Ariane et JSON-LD `BreadcrumbList` de `/blog` (`blog/page.tsx`) et des pages article, `llms.txt`, tests Playwright qui cherchent un lien « Blog », docs.

## 4. Recommandation

**Pour Thomas, en une phrase** : je te conseille « Articles » à la place de « Blog », parce que c'est ce que Yanis va réellement trouver (des textes à lire), ça se distingue clairement des fiches courtes de « Conseils », ça tient dans la barre et ça ne change rien pour Google tant qu'on garde l'adresse /blog.

**2e meilleur : « Blog »** (le nom actuel, 26 contre 29). Duel à l'aveugle recommandé : « Articles » contre « Blog », car la vraie décision est « change-t-on ? ». Règle de décision à fixer avant le duel : si « Articles » ne gagne pas nettement, on garde « Blog » (zéro coût, zéro risque de cohérence). Les 3 autres noms restent derrière : « À lire » (3e, 25) est le plus naturel à l'oral mais le moins clair dans une barre de noms ; à ne reprendre que si Thomas veut un ton plus oral.

**Mesure après changement** (HEART, dimension Engagement) : part des visiteurs d'une page hors blog qui ouvrent la liste `/blog` ou un article via le menu. Aucune cible chiffrée : pas de base de départ (ne pas inventer). Relever 28 jours avant et après, avec `?ne-pas-compter=1` pour exclure les tests. `[À VÉRIFIER]` : un événement « clic menu » existe-t-il ? Sinon le duel à l'aveugle est la seule preuve disponible.

**Pour que le nom suffise à distinguer les onglets** (à confier à @copywriter, en respectant `docs/copy/ton-alex.md`, relecture à l'aveugle avant mise en ligne) : le chapeau de `/blog` (aujourd'hui « Guides pratiques... ») gagnerait une phrase de pont qui dit que les conseils sont les fiches d'une minute et que les articles sont les lectures plus longues, avec un lien vers `/conseils`. Aucun texte n'est écrit ici.

## 5. Audit rapide (le périmètre est un libellé, pas un parcours)

Nielsen, seulement les heuristiques touchées (les 6 autres ne s'appliquent pas à un nom d'onglet) :

| Heuristique | « Blog » aujourd'hui | « Articles » |
|---|---|---|
| H2 Correspondance avec le vocabulaire du persona | FAIL partiel : ne dit pas ce que contient la section | PASS : « article » est le mot de Yanis pour un texte à lire |
| H4 Cohérence | PASS (menu, pied de page, fil d'Ariane disent « Blog ») | PASS sous condition : renommer menu, pied de page, fil d'Ariane et JSON-LD ensemble (§3) |
| H6 Reconnaissance plutôt que rappel | FAIL partiel : « Blog » et « Conseils » se recoupent | PASS : le format sépare les deux |
| H8 Minimalisme | PASS | PASS (mais 1024 à ~1060 px : à mesurer, §2.2) |

Accessibilité WCAG 2.2 AA : aucun changement de cible (onglets déjà 44 px de haut, `header-budget`), onglet actif toujours repéré par la couleur et le fond (`isActivePath` garde l'onglet actif sur `/blog/<slug>`). « À lire », en cas de choix, serait lu seul par un lecteur d'écran sans nom de rubrique : un point de plus contre lui.

## Handoff

- Fichier : `/home/user/Marrant/docs/ux/nom-section-blog-s21.md`.
- Décision proposée : « Articles » (29) contre « Blog » (26) en duel à l'aveugle, on garde « Blog » s'il n'y a pas de gagnant net ; adresse `/blog` inchangée (déconseillé de la changer).
- Points d'attention : mesurer « Articles » à 1024 à 1060 px (visiteur) avant livraison ; renommer partout ensemble (menu, pied de page, fil d'Ariane, JSON-LD) ; lien de test non ouvert faute d'outil de lecture web.
