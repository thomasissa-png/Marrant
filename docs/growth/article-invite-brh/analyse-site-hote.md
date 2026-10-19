# Analyse du site hôte : Le blog des Rapports Humains (Christophe Peiffer)

> Relevé du 19/10/2026, en lecture seule : sitemap Yoast, API REST WordPress publique et pages HTML. Les comptes de mots portent sur le corps réel du texte, balises retirées, sources comprises.

## 1. Structure du blog
- **URL** : le-brh.com redirige en 301 vers **https://www.leblogdesrapportshumains.fr/** (WordPress, thème Divi). Le blog est à `/blog/`. Le slogan « Thérapie - Formations - Coaching » n'apparaît pas sur le site actuel (non trouvé). Le H1 de l'accueil est « Coaching & THÉRAPIE À CANNES, Individus - Couples - Familles ».
- **Catégories (nombre d'articles)** : Développement personnel 132, Coaching 71, **Articles invités 51**, Relations humaines 40, Vidéos 39, Psychologie 36, Lettres à toi 15, Test en ligne 12, Top 10 10, Articles sponsorisés 3, Non classé 3. Le sitemap compte 385 articles.
- **Rythme** : très faible et irrégulier. 4 articles en 2025 (avril, juillet, août, octobre) et 5 en 2026 (mars, avril, août, 8 sept., 25 sept.). Depuis 2025, Christophe n'a signé que 2 textes, tous deux des « Lettre à toi » (blues du dimanche, colère). **Le blog vit aujourd'hui surtout d'articles invités.**
- **Auteurs** : tous les articles sont publiés sous le compte WP « Christophe Peiffer » (API utilisateurs fermée). L'auteur invité n'apparaît jamais dans la signature WordPress.
- **Articles invités analysés** (catégorie Articles invités) :

| Article (date) | Auteur visible | Mots | Structure | Présentation de l'invité | Liens sortants |
|---|---|---|---|---|---|
| `/humour-dans-le-couple/` (08/09/2026) | aucun (pas de bio) | 1 589 | 7 H2, 3 listes, 1 encadré-exemple, liste de sources | aucune, sauf le produit cité dans le dernier H2 | 2 vers pleasetellmemore.fr (jeu « Tell Me More »), 5 études, 4 internes |
| `/isolement-et-depression-chez-les-personnes-agees/` (25/09/2026) | aucun | 848 | 5 H2, listes | aucune | 1 commercial (cohabitation), 2 sources officielles, 1 interne |
| `/pourquoi-le-manque-de-sommeil-deteriore-nos-relations-…/` (14/04/2026) | aucun | 1 355 | 6 H2, chapô en gras de 3 paragraphes, « Ce qu'il faut retenir » | aucune | **1 seul** (bienetreetconfort.com, en ancre contextuelle vers la fin) |
| `/le-jour-ou-jai-compris-que-mon-travail-mabimait/` (21/08/2025) | Christopher Symbrat, « Je vaux Plus » | 1 645 | 5 H3, récit de séance au « je », vouvoiement | **chapô de Christophe** (« Je reçois aujourd'hui en tant qu'invité… ») + signature finale | 4 vers jevauxplus.com, 1 asso, 4 internes |
| `/limportance-du-rapport-humain-dans-le-recrutement-…/` (06/04/2025) | aucun nommé | 1 529 | 8 H2, listes, capture d'écran | aucune | 1 lien commercial avec UTM `guestpost`, 3 sources |
| `/comment-lintelligence-emotionnelle-transforme-vos-relations-…/` (20/04/2024) | Virginie, lecercledeserenite.com | 1 673 | 5 H2, 10 H3, citations en encadré | chapô de Christophe (« Je reçois aujourd'hui une nouvelle invitée… ») | 2 vers son site, environ 10 internes |

- **À retenir** : les invités récents (2026) ne sont pas présentés du tout. Les plus anciens (2019-2025) ont un chapô d'accueil écrit par Christophe et une signature avec lien. Longueur type : 1 200 à 1 700 mots. Il y a toujours des H2, souvent un chapô en gras. Les liens internes vers les anciens articles sont nombreux et semblent ajoutés par l'hôte (motif récurrent : `/recule-encore-un-peu-part-12/`, `/frustration/`, `/le-defi-de-la-confiance-en-soi/`).

## 2. L'article « humour dans le couple »
- **URL** : https://www.leblogdesrapportshumains.fr/humour-dans-le-couple/ (publié le 08/09/2026, catégorie Articles invités, auteur affiché Christophe Peiffer, pas de bio). 1 589 mots, 7 H2, image à la une `humour-dans-le-couple.jpg`.
- **Plan (H2)** : Rire rapproche… biologiquement aussi / L'humour partagé, un langage secret / Pourquoi les couples qui rient ensemble gèrent souvent mieux les conflits / L'humour ne fait pas disparaître les problèmes… il change la manière de les vivre / La légèreté n'est pas une fuite / Cultiver l'humour, ça s'apprend / Un outil pour (re)créer ces moments / En résumé.
- **Idées clés** :
  - **rire ensemble** compte plus qu'être drôle ;
  - les codes du couple forment un « langage secret » ;
  - l'humour sert de « repair attempt » ;
  - **exemple des vacances** : une activité réservée depuis des semaines se révèle une arnaque. Soit la colère et la recherche d'un coupable, soit une blague après quelques minutes, et la mésaventure devient une anecdote. Le problème n'a pas disparu, mais on vit la difficulté « ensemble, **plutôt que l'un contre l'autre** » ;
  - la légèreté n'est pas l'évitement ;
  - « dans la même équipe » ;
  - liste de micro-gestes, dont « rire de ses propres ratés avant que l'autre ait à le faire » ;
  - « la légèreté, ça se propose, ça ne s'impose pas » ;
  - « 5 façons de remettre de l'humour » ;
  - placement final d'un jeu de conversation pour couples.
- **Références citées** (liste « Sources ») : Dunbar et al. 2012 (rire social, seuil de douleur, endorphines) ; Hall 2017 (méta-analyse sur l'humour dans le couple) ; Kurtz & Algoe 2015 (71 couples, rire simultané) ; Algoe, Greater Good Magazine (« voir le monde de la même façon ») ; Gottman Institute, « H is for Humor ».
- **Angle laissé libre (le revers)** : l'article ne parle jamais de l'humour qui blesse (taquinerie qui dérape, moquerie, sarcasme, blague « pour rire » qui humilie, rire *de* l'autre plutôt qu'*avec* lui). Notre article doit occuper exactement ce terrain. Il ne doit pas réexpliquer les endorphines, Hall, Kurtz & Algoe ni les repair attempts : il suffit d'y renvoyer.

## 3. Ton de Christophe et du blog
- **Adresse au lecteur** : **vouvoiement** dans les articles classiques et chez tous les invités, avec un usage abondant de « vous » et du « nous/on » généralisant. **Tutoiement** réservé à la série « Lettre à toi » (signature de Christophe). Un invité doit vouvoyer.
- **Registre** : grand public teinté psy et coaching (praticien narratif, ex-infirmier en psychiatrie). Il est pédagogique et chaleureux, sans jargon gratuit. Il cite volontiers une référence (Sénèque, Nardone, études), mais sans appareil universitaire lourd.
- **Phrases et « je »** : Christophe écrit au « je » avec des apartés et des parenthèses, des phrases moyennes à longues et des tournures orales. Il laisse passer de petites coquilles (« celà », « envahit » pour « envahi »), ce qui rejoint sa demande d'un style humain et imparfait.
- **Exemples concrets** : récit de séance, mini-scènes, listes de questions (« Partir ou rester ? Lui dire ou me taire ? »).
- **3 phrases représentatives (Christophe)** :
  - « J'aime bien cette phrase qui dit qu'on ne « dose » pas un poison. » (Lettre à toi que la colère envahit, 2026)
  - « Du conflit intrapersonnel au conflit interpersonnel, il y a de quoi se prendre la tête plus d'une fois par jour. » (Gestion des conflits, 2020)
  - « Qu'est ce qui se passe quand on se regarde dans le miroir? (avec un bémol pour le matin au réveil :-)) » (Pourquoi ce blog)

## 4. Conditions pour les invités
- Je n'ai trouvé **aucune page « proposer un article »**, ni charte éditoriale, ni conditions écrites (longueur, liens, format, images). Recherche faite dans le sitemap des pages et dans la recherche interne.
- Le pied de page propose un « kit média » partenaires (`/wp-content/uploads/2020/07/Kit-média-blog-des-rapports-humains.pdf`), mais le fichier renvoie une **404** : conditions non trouvées.
- Il existe une catégorie « Articles sponsorisés » (3 articles), distincte des invités. Le seul contact est le formulaire de `/contact-coach-cannes/`, et l'adresse christophe@leblogdesrapportshumains.fr figure sur `/regles-anti-spam/`.
- **Seule règle connue** : sa réponse (style humain, avec ses failles, mais sans faute d'orthographe).

## 5. Lectorat visible
- Les lecteurs sont des particuliers en quête de mieux-être relationnel et de « reprendre sa vie en main » (accroche Yoast). Le site vit du coaching à Cannes ou à distance (Christophe) et de la **thérapie systémique de couple et de famille** (Raja Elalaoui, associée, présente sur l'accueil et le contact).
- Témoignages : cadres et directeurs de centres de formation, assistantes RH. Le registre RH existe (recrutement, burn-out du dirigeant), mais il reste minoritaire.
- **BRH** : le nom alternatif déclaré dans le schéma du site est « le-brh », et le nom du site est « Le blog des Rapports Humains ». BRH = **Blog des Rapports Humains** (déduit de ces deux éléments, jamais écrit en toutes lettres).

## 6. Sujets voisins déjà traités (pour éviter le doublon et nourrir un éventuel lien interne)
- **Humour** : seul `/humour-dans-le-couple/` en parle vraiment. Les recherches « taquin », « moquerie », « ironie » et « autodérision » ne remontent que des mentions incidentes. **Le sujet « taquiner sans blesser » est libre.**
- **Conflit et couple** :
  - `/gestion-des-conflits/` (Requin ou Nounours, Christophe, 2 026 mots)
  - `/gestion-des-conflits-pensez-a-la-metacommunication/`
  - `/resoudre-un-conflit/` (invité)
  - `/pourquoi-certains-conflits-se-repetent/` (2026, cite la CNV)
  - `/styles-dattachement-relation-amoureuse/`
  - `/questions-sur-relation/` (lettre)
- **Critique et agressivité** :
  - `/formuler-une-critique-constructive-en-3-etapes-le-feedback-2-0/`
  - `/faire-face-a-la-critique/`
  - `/arretez-de-gerer-les-critiques/`
  - `/les-13-types-dagressions-verbales/` (corps illisible via l'API, probablement une vidéo : à vérifier avant de citer)
- **Émotions** : `/eviter-d-etre-envahi-par-la-colere/`, `/frustration/`, `/gerer-ses-emotions/`, `/quest-ce-que-lempathie/`.
- **Lien interne le plus naturel** : `/humour-dans-le-couple/` (notre article en est le revers). Ensuite `/gestion-des-conflits/` (texte de Christophe lui-même).

## Recommandations pour l'article
- **Longueur cible** : 1 400 à 1 600 mots, comme la médiane des invités et l'article humour (1 589). Viser au plus près de 1 500.
- **Structure** :
  - un chapô de 2 à 3 phrases, en gras (convention maison), qui rattache l'article à l'article humour (« on y voyait l'humour qui soude… et quand il fissure ? ») ;
  - 5 ou 6 H2 formulés comme des affirmations ou des questions simples ;
  - **une scène concrète en miroir de l'exemple des vacances** : même dispositif à deux issues, mais où la blague vise l'autre au lieu de viser la situation, soit l'inverse exact de « plutôt que l'un contre l'autre » ;
  - une liste courte de repères pratiques (taquinerie qui rapproche ou qui éloigne) ;
  - un « En résumé » final.
  - Les sources sont facultatives. Si l'article cite une étude, la sourcer vraiment (règle zéro invention), sans réutiliser celles de l'article humour.
- **Adresse** : **vouvoiement** du lecteur, « je » assumé de l'auteur avec une ou deux anecdotes vécues, « on/nous » pour généraliser. Pas de tutoiement (réservé aux « Lettre à toi » de Christophe).
- **Style** : humain et imparfait comme demandé. Phrases de longueur inégale, une digression ou une parenthèse, une tournure orale, un peu d'autodérision. Pas d'effet « liste parfaite ». Zéro faute d'orthographe. Ton de `docs/copy/ton-alex.md`.
- **Présentation de l'auteur** : rien n'est imposé. Les invités 2026 n'ont aucune bio. Proposer à Christophe une **signature d'une ligne en fin d'article** (format Je vaux Plus : « Prénom, du site Deviens Marrant ») et le laisser libre d'écrire un chapô d'accueil comme en 2024-2025. Photo : non trouvée chez les invités, donc ne pas en fournir sauf demande.
- **Le lien unique** vers `https://deviens-marrant.fr/blog/autoderision-interactions` :
  - placé en **ancre contextuelle dans le corps**, dans la section sur rire de soi plutôt que de l'autre (l'autodérision comme alternative à la taquinerie qui pique) ;
  - plutôt aux deux tiers de l'article, comme le lien du sommeil ;
  - jamais en bio seule, ni dans le dernier H2 (là où l'article humour place son produit).
  - Suggérer en option 1 ou 2 liens internes : `/humour-dans-le-couple/` et `/gestion-des-conflits/`. L'hôte en ajoute de toute façon.
- **À éviter** :
  - répéter Dunbar, Hall, Kurtz & Algoe, les repair attempts, le « langage secret » ou les « 5 façons de remettre de l'humour » ;
  - tout ton promotionnel ou H2 « outil » ;
  - les UTM ;
  - le tutoiement ;
  - le jargon psy non expliqué ;
  - les tirets cadratins ;
  - la mention de tout concurrent ;
  - un second lien sortant ;
  - des chiffres ou des études non vérifiés.
