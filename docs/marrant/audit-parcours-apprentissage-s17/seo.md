# Audit SEO + GEO des pages Parcours d'apprentissage (s17, 07/10/2026)

> Agent : @seo (périmètre C10, C3 maillage/acquisition, C11 SSR/indexabilité). Audit seul : aucune modif de code, aucune soumission, aucun commit.
> Code audité : 79b11f3 ; prod 712ee919 ; mesures live du 07/10/2026. Chiffres bruts : `scratchpad/parcours-umami.json` (Umami), `scratchpad/bing-parcours.json` (Bing).

## 1. TL;DR

1. Les 4 pages sont bien construites pour les moteurs : tout le texte est dans le HTML servi (SSR/ISR), canonical correct, présentes au sitemap, à llms.txt et llms-full.txt, et l'étape 2+ n'est pas divulguée.
2. Elles n'amènent presque personne : 15 arrivées en 90 j sur 2 131 (0,7 %), 0 depuis Google, 3 depuis Bing (toutes sur /parcours), 1 depuis ChatGPT. Bing n'a affiché que /parcours (12 impressions, 3 clics en 6 mois) ; les 3 pages parcours individuelles : 0 impression.
3. Le maillage interne, lui, est bon : /parcours est dans le menu et le pied de page des 386 pages, les 35 articles renvoient tous vers un parcours, l'accueil renvoie vers les 3. Le problème n'est donc pas « on ne les trouve pas sur le site », c'est « les moteurs ne les proposent pas ».
4. Défauts concrets à corriger vite : aperçu de partage de /parcours qui déclare l'accueil comme adresse (og:url), titres de partage génériques sur les 4 pages, pas de H2 sur les 3 pages détail, 2 versions différentes du balisage « Course » pour chaque parcours, et des titres qui visent les mêmes mots que les articles (risque de cannibalisation).
5. Google ne montre plus l'affichage enrichi « Course » depuis septembre 2025 : le balisage sert surtout à Bing et aux IA, pas à gagner une vignette Google. Search Console : non mesuré (pas de clé), les parcours n'apparaissent pas dans le top des pages du 05/10.

## 2. Notes par critère

| Critère | Note /10 | Preuve courte |
|---|---|---|
| C10 SEO/GEO des pages parcours | **5** | Technique propre (title, meta, canonical, Course, Breadcrumb, llms) mais OG/Twitter faux, H1 puis H3 sans H2, JSON-LD dupliqué, titres en collision avec les articles, GEO minimal (3 lignes dans llms-full, aucune donnée citable), 0 entrée Google/90 j |
| C3 Découvrabilité et points d'entrée (maillage + acquisition) | **5** (maillage 8, acquisition 2) | Lien dans 386/386 pages, 35/35 articles, accueil x3 ; mais 15 entrées/90 j, 37 sessions touchant un parcours en 90 j dont 14 US (7 = tests du 07/10) ; fiches vannes/conseils/vidéos (332) sans lien vers un parcours |
| C11 SSR et indexabilité | **7** | HTML complet sans JS (1 984 / 760 / 627 / 601 mots), ISR (`s-maxage` 1 600 s détail, 300 s liste), 404 propre, sitemap OK ; Bing a crawlé les 4 mais `machine-a-cafe` pas depuis le 10/08 ; lastmod figé au 29/09 ; Core Web Vitals non mesurés (quota PSI épuisé) |

## 3. Constats

Format : problème / effet pour l'utilisateur / ce qu'on fait. Détail technique en §4.

**SEO-01 (P1) Les moteurs n'envoient presque personne sur les parcours**
- Problème : 15 visiteurs arrivés directement sur une page parcours en 90 j (0,7 % des arrivées ; une 16e entrée est la page de test `slug-inexistant-qa`), dont 3 par Bing, 1 par ChatGPT, 0 par Google. Seulement 5 arrivées sur les 3 pages détail (repartie 3, confiance 1, machine-a-cafe 1).
- Effet : les personnes qui tapent « cours d'humour » ou « apprendre la répartie » ne tombent pas sur le programme, mais sur les articles (déjà bien placés) ou sur personne. Le produit principal n'est pas visible là où les gens cherchent.
- On fait : repositionner chaque page sur une demande de type « programme / cours » que les articles ne visent pas (§6), ajouter un lien retour article vers parcours avec ancre explicite, mesurer à 30 j.
- Preuve : Umami 90 j entrées `/parcours` 10, `repartie` 3, `confiance` 1, `machine-a-cafe` 1 ; Bing `GetPageQueryStats` : 9 requêtes sur /parcours, 0 sur les 3 autres.
- Agent : @seo (specs), @fullstack (métadonnées). Effort : rapide pour les métadonnées, moyen pour l'effet mesuré.

**SEO-02 (P1) Aperçu de partage faux sur /parcours, générique sur les 4 pages**
- Problème : sur /parcours, `og:url` vaut `https://deviens-marrant.fr` (l'accueil), `og:title` et `twitter:title` valent « Comment devenir drôle et avoir de la répartie ». Sur les 3 pages détail, `og:title` et `og:url` sont corrects mais `twitter:title`, `twitter:description` restent ceux de l'accueil. Même image 1200x630 générique partout.
- Effet : quand quelqu'un partage /parcours (LinkedIn, Facebook, messagerie), l'aperçu annonce l'accueil et le réseau peut rattacher le partage à l'accueil. Les posts du plan social qui renverraient vers un parcours auraient un aperçu sans rapport.
- On fait : définir `openGraph` et `twitter` dans les métadonnées de /parcours, `twitter` dans celles de /parcours/[slug] ; une image par parcours (@design, option).
- Preuve : `curl` sur les 4 URL (balises relevées §4.1) ; `parcours/page.tsx:17-30` (aucun `openGraph`), `parcours/[slug]/page.tsx:114-127` (pas de `twitter`).
- Agent : @fullstack. Effort : rapide.

**SEO-03 (P1) Titres de deux parcours en collision avec des articles**
- Problème : `/parcours/repartie` (title « Avoir de la répartie : le parcours guidé ») vise le même mot que l'article « Avoir de la répartie : 10 techniques » (96 impressions, pos 14,6 en 90 j). `/parcours/confiance` (« Retrouver confiance grâce à l'humour ») recoupe l'article « Confiance en soi grâce à l'humour : guide pratique » et `confiance-humour-apres-rupture`. L'audit s15 (S, point 1) avait déjà signalé le chevauchement répartie.
- Effet : deux pages se disputent la même recherche, aucune ne monte ; la personne qui veut un programme tombe sur un article de conseils, celle qui veut un conseil sur une page produit.
- On fait : l'article répond à la question (conseils, exemples), le parcours vend le programme (durée, étapes, XP). Titres parcours au format « Parcours Répartie : 4 semaines pour répondre du tac au tac » sans reprendre « avoir de la répartie » en tête (propositions §6).
- Agent : @seo + @copywriter. Effort : rapide (3 titres + 3 metas), validation Thomas (titres = [CHOIX] à re-signer).

**SEO-04 (P2) Balisage « Course » en double, incohérent, et sans effet Google**
- Problème : /parcours publie 3 blocs Course (noms « Parcours Machine à Café — Deviens drôle au bureau », descriptions avec « blagues ») et chaque page détail publie un autre bloc Course (nom « Parcours Machine à Café », description = meta). Pas d'`@id`, pas de liste ItemList. Le prix 2,99 est écrit en dur dans `buildCourseJsonLd` (pas lu depuis `config/premium`). `isAccessibleForFree: false` alors que l'étape 1 est lisible sans compte. La FAQ balisée de /parcours est la FAQ de l'accueil (8 questions), aucune question propre aux parcours.
- Effet : pour Bing et les IA, deux « cours » différents par parcours ; si le prix change, le balisage ment. Google a retiré l'affichage « Course Info » (annoncé le 12/06/2025, retiré de la Search Console et du Rich Results Test le 09/09/2025) : aucune vignette Google à espérer.
- On fait : sur /parcours, une seule liste (ItemList de 3 liens vers les pages détail, sans redéfinir les cours) ; sur chaque détail, un Course avec `@id`, prix lu depuis la config, et une phrase honnête sur l'étape 1 libre ; FAQ propre aux parcours (durée réelle, ce qui est gratuit, pour qui). Jamais de tiret cadratin dans les noms (règle 12 : « — » présent dans les 3 noms de /parcours).
- Agent : @fullstack, FAQ @copywriter. Effort : rapide à moyen.

**SEO-05 (P1) Pages détail : plan de page et liens sortants trop pauvres**
- Problème : H1 puis H3 (pas de H2) sur les 3 pages ; les étapes sont des H3 et les blocs internes des H4. Liens du bloc principal : `/`, `/parcours`, un autre parcours, `/vannes`, `/abonnement` (5 liens). Le conseil de l'étape 1 est recopié mot pour mot de la fiche `/conseils/lhumour-a-la-machine-a-cafe-cmmp8ozsx0` (même texte « plante du couloir »), sans lien vers elle ; les vidéos (Paul Séré, Karim Duval) sont citées sans lien vers leurs fiches ; « Découvre-les dans le catalogue » ne mène nulle part de précis.
- Effet : les moteurs et les IA comprennent mal la structure (qu'est-ce qu'une étape ? un chapitre ?), et la personne qui veut approfondir une étape n'a pas de piste cliquable. Texte dupliqué entre deux pages du même site : le moteur choisit seul laquelle montrer.
- On fait : H2 « Le programme » (étapes en H3), H2 « Pour qui » ; lien de chaque étape vers sa fiche conseil et ses vidéos ; une phrase d'introduction en tête de l'étape 1 qui diffère de la fiche (ou lien « fiche complète »).
- Agent : @fullstack (composant `parcours-detail.tsx`). Effort : moyen.

**SEO-06 (P2) Fiches vannes, conseils et vidéos ne renvoient pas vers le parcours qui les utilise**
- Problème : sur 332 fiches (134 vannes, 109 conseils, 89 vidéos), 0 lien vers `/parcours/<slug>` ; seule la navigation globale mène à `/parcours`. En revanche des visiteurs font déjà le chemin vidéos, vannes, conseils vers /parcours (25 passages sur 37 sessions, probablement via le menu).
- Effet : une personne qui lit un conseil de répartie ne voit pas qu'il fait partie d'un programme guidé.
- On fait : bloc « Ce conseil est l'étape N du parcours X » sur les fiches concernées (étape 1 de chaque parcours d'abord), bloc « Cette vidéo est travaillée dans… ».
- Agent : @fullstack. Effort : moyen.

**SEO-07 (P2) Date du sitemap figée, une page peu revisitée par Bing**
- Problème : `lastmod` des 4 URL = 29/09/2026 (constante `STRUCTURAL_PAGES_LASTMOD`, stable, ce qui est voulu) mais les composants parcours ont changé les 05, 06 et 07/10 (git). Bing : dernière exploration `machine-a-cafe` le 10/08/2026, `repartie` 23/09, `/parcours` 05/10, `confiance` 07/10.
- Effet : Bing peut garder une ancienne version de `machine-a-cafe` (2 mois). Le tableau « 4 parcours soumis le 05/10 » du plan s15 n'a pas donné une exploration pour celle-ci.
- On fait : passer la constante à la date réelle de la prochaine modification de texte ; relire `GetUrlInfo` dans 7 j. Pas de nouvelle soumission décidée ici.
- Agent : @fullstack (constante), @seo (suivi). Effort : rapide.

**SEO-08 (P2) GEO : pages difficiles à citer pour une IA**
- Problème : `llms-full.txt` ne décrit chaque parcours qu'en 1 phrase (lignes 124-140), sans liste des étapes ni résultat attendu ; aucune date de mise à jour visible sur les pages ; aucun chiffre sourcé (le seul « sourcé » du site est dans la FAQ de l'accueil, non reprise sur les parcours) ; les 3 histoires « Imagine Léa / Tom / Julien » sont des cas fictifs (honnêtement introduits par « Imagine »).
- Effet : à la question « existe-t-il un programme pour apprendre la répartie en 4 semaines ? », une IA n'a pas de contenu précis à citer (étapes, durée, ce qui est gratuit). 1 seule visite ChatGPT sur 90 j sur /parcours.
- On fait : ajouter au llms-full la liste des étapes (titres + durée) et la mention « première étape gratuite » ; un bloc « En bref » en tête de page (durée, niveau, ce que tu sais faire à la fin) ; `dateModified` visible. À coordonner avec @geo (aucune collision : l'article répond, le parcours décrit le programme).
- Agent : @geo + @seo, @fullstack. Effort : rapide.

**SEO-09 (P2) Mesure : aucun événement parcours reçu, trafic de test mélangé**
- Problème : les événements `mur-vu` (type parcours-etape) et `parcours-etape` existent dans `parcours-detail.tsx` (l.95, l.403) mais 0 événement reçu sur les 37 sessions parcours en 90 j. 14 des 37 sessions sont des visites US dont 7 le 07/10 (tests de la session).
- Effet : on ne sait pas combien de personnes ouvrent l'étape 1, ni combien butent sur l'étape 2. Les chiffres de vues parcours sont gonflés d'environ 20 à 40 % par les tests (non filtrés).
- On fait : confirmer l'envoi en prod (data-analyst, C9) ; filtrer les sessions de test.
- Agent : @data-analyst. Effort : rapide.

**SEO-10 (P2) Vitesse : non mesurée ; première visite lente observée**
- Problème : PageSpeed Insights refuse la requête (quota 429) : LCP, CLS, INP non mesurés. Mesures `curl` depuis la session (via proxy, indicatives) : TTFB 0,35 à 1,3 s en cache HIT ; 3,0 s sur une réponse `x-nextjs-cache: STALE` (régénération) de /parcours.
- Effet : la première personne après une régénération attend 3 s (rare, 1 fois par 5 min sur /parcours).
- On fait : mesure terrain (CrUX / PSI avec clé) avant tout chantier ; ne rien changer sans chiffre.
- Agent : @infrastructure / @qa. Effort : rapide.

**SEO-11 (P2) Page 404 de parcours : deux balises robots contradictoires**
- Problème : `/parcours/slug-inexistant` renvoie 404 avec `robots: noindex` ET `robots: index, follow` dans le HTML. Sans effet réel (le code 404 prime) ; à nettoyer.
- Agent : @fullstack. Effort : rapide.

Contraintes non re-questionnées : prix 2,99 €/mois et formule annuelle 24,99 €, pas de compte gratuit, 1 500+ membres, humoristes nommés (vidéos de l'étape 1), titres/metas à re-signer par Thomas avant changement.

## 4. Détail technique (HTML servi, JSON-LD, sitemap, llms, maillage)

### 4.1 HTML servi sans JavaScript (curl, UA Googlebot, 07/10/2026)

| URL | Code | Title | H1 | H2 | Mots (main) | Canonical | Robots |
|---|---|---|---|---|---|---|---|
| /parcours | 200 | Cours humour en ligne : deviens drôle \| deviens-marrant.fr | Parcours humour : deviens drôle pas à pas | 6 (3 parcours, quiz, Explore aussi, FAQ) | 1 901 | absolue, OK | index, follow |
| /parcours/machine-a-cafe | 200 | Drôle au bureau : parcours Machine à Café | Parcours Machine à Café | 0 | 678 | absolue, OK | index, follow |
| /parcours/repartie | 200 | Avoir de la répartie : le parcours guidé | Parcours Répartie | 0 | ~600 | absolue, OK | index, follow |
| /parcours/confiance | 200 | Retrouver confiance grâce à l'humour \| deviens-marrant.fr | Parcours Confiance | 0 | ~580 | absolue, OK | index, follow |

- Meta description présente et propre aux 4 pages (3 parcours, durée, promesse). `/parcours` : « 3 parcours pour devenir drôle (Machine à Café, Répartie, Confiance) : 15 à 20 min/semaine… ».
- Bing (mot exact title + H1 + premier paragraphe) : title et H1 ne se répondent pas sur /parcours (« Cours humour en ligne » / « Parcours humour ») ni sur `confiance` (« Retrouver confiance » / « Parcours Confiance ») ; la requête Bing réelle est « cours d'humour » (avec « d' »), absente du title.
- OG/Twitter : voir SEO-02. `og:image` = `/opengraph-image` (1200x630) sur les 4, avec un paramètre de hash seulement sur /parcours ; `twitter:card` = summary_large_image partout ; `og:locale` fr_FR.
- Contenu étape 1 complet dans le HTML (conseil, exemple, exercice, 2 vidéos, quiz) ; étapes 2+ : titre, format, XP, « pourquoi » seulement (aperçu). Aucune fuite de contenu Premium (code : `toPublicPath`, `redactParcoursForPlan`, `parcours/[slug]/page.tsx`).
- Cache : `s-maxage` 1 590 s, `stale-while-revalidate` 30 j sur les détails (ISR, `revalidate = 3600`) ; ~300 s sur /parcours. Redirections : `www` vers apex en 301, `/parcours/` vers `/parcours` en 308. Slug inconnu : 404.
- Mots de la page /parcours : le texte de présentation (étapes de chaque parcours) est dans le HTML, donc pas de contenu mince (> 600 mots utiles par page, seuil indicatif fixé ici à 300).

### 4.2 JSON-LD relevé (Rich Results Test non disponible pour Course : retiré le 09/09/2025)

| Page | Types présents | Remarques |
|---|---|---|
| /parcours | Organization, WebSite, BreadcrumbList (2 niveaux), Course x3, FAQPage (8 Q, FAQ accueil) | Course : name, description, provider (Organization + logo), url, hasCourseInstance (online, `P3W`/`P4W`/`P6W`), educationalLevel, inLanguage, isAccessibleForFree false, offers 2.99 EUR. Pas d'ItemList ni `@id`. Noms avec « — ». |
| /parcours/<slug> | Organization, WebSite, BreadcrumbList (3 niveaux), Course x1 | Mêmes champs, `name` « Parcours X » ≠ nom de /parcours. Champs obligatoires Google Course (name, description, provider) présents. Pas de `teaches`, de plan d'étapes, ni de `dateModified`. |

- JSON-LD valides syntaxiquement (analysés en Python), Breadcrumb cohérent avec le fil d'Ariane visible. Source : `components/seo/json-ld.tsx:444-483`, `parcours/page.tsx:34-72`.
- `Organization.logo` en accueil : hors périmètre (vérifié au s11).

### 4.3 Sitemap, llms.txt, llms-full.txt, robots

- `/sitemap.xml` : les 4 URL présentes ; `lastmod` 2026-09-29, priorités 0.8 (liste) et 0.7 (détail), `changefreq` weekly/monthly. Stable (constante), pas régénéré à chaque build.
- `/llms.txt` (l.20, 46-48) : `/parcours` et 3 parcours avec durée et niveau ; ligne tarifs cohérente (« la première étape de chaque parcours » libre, Premium 2,99 €/mois). `/llms-full.txt` : 3 lignes de résumé par parcours (l.124-140), pas de liste d'étapes.
- `robots.txt` : `/parcours` autorisé pour tous les bots (dont bingbot et bots IA listés) ; seuls `/api/`, `/admin/`, `/login`, `/onboarding`, `/profil`, `/favoris`, etc. bloqués.

### 4.4 Maillage (386 pages du sitemap récupérées en HTML)

| Source | Vers /parcours | Vers un parcours individuel |
|---|---|---|
| Menu et pied de page (386 pages) | 386/386 (« Parcours ») | non |
| Accueil | oui (2 blocs) | 3/3 (« Briller à la machine à café », « Avoir de la répartie », « Reprendre confiance en toi », puis cartes avec durée) |
| 35 articles (composant `blog-article-parcours-maillage`) | oui | 35/35 : repartie 24, machine-a-cafe 10, confiance 8 (un article peut en lier plusieurs) |
| Fiches vannes (134), conseils (109), vidéos (89) | via menu seulement | 0 |
| /abonnement, /glossaire, /a-propos, /quiz-humour | via menu | 0 |

- Liens entrants vers `confiance` : 11 pages (dont 8 articles), `machine-a-cafe` : 13, `repartie` : 27 (profondeur : accueil, 1 clic).
- Sortants des pages détail : voir SEO-05 (5 liens dans le bloc principal) ; un seul lien « parcours suivant » (boucle machine-a-cafe, repartie, confiance, machine-a-cafe).
- Profondeur : 1 clic depuis l'accueil et le menu (cocon respecté).

## 5. Mesures Umami et Bing

### 5.1 Umami Cloud (site deviens-marrant.fr, extraction 07/10/2026)

Pages vues (PV) / visiteurs / rebonds, par chemin exact (`/stats`) :

| Page | 30 j PV | 30 j visiteurs | 30 j rebonds | 90 j PV | 90 j visiteurs | 90 j rebonds | Entrées 30 j / 90 j |
|---|---|---|---|---|---|---|---|
| /parcours | 28 | 16 | 11 | 45 | 30 | 23 | 6 / 10 |
| /parcours/machine-a-cafe | 15 | 10 | 7 | 21 | 16 | 13 | 1 / 1 |
| /parcours/repartie | 8 | 7 | 6 | 19 | 14 | 13 | 1 / 3 |
| /parcours/confiance | 7 | 6 | 5 | 12 | 11 | 10 | 1 / 1 |
| **Total 4 pages** | **58** | n.d. (sessions distinctes : voir plus bas) | 29 | **97** | n.d. | 59 | 9 / 15 |
| Site entier | 1 169 | 713 | 703 | 3 078 | 2 131 | 2 215 | 713 / 2 131 |

- Part des 4 pages : 5,0 % des pages vues sur 30 j, 3,2 % sur 90 j ; 0,7 % des entrées sur 90 j (15 sur 2 131). Les 30 j précédents : 27 PV (58 vs 27, mais le 07/10 contient 7 sessions US de test).
- Sources (90 j, par page) : /parcours : direct 26, recherche organique 3 (bing.com 3), LLM 1 (chatgpt.com 1) ; détails : 100 % « direct » (en interne ou sans referrer). Google : 0.
- Sorties 90 j : /parcours 8, repartie 6, machine-a-cafe 4, confiance 3 (+ page de test). Appareils 90 j (4 pages) : mobile 37, laptop 32. Pays : FR 28, US 33 (dont 7 sessions de tests du 07/10), BE 6.
- Parcours des 37 sessions touchant un parcours en 90 j (18 FR, 14 US, 2 BE, 3 autres) : page précédente = /parcours 18, entrée directe 11, /videos 9, /vannes 8, /conseils 8, un autre parcours 19, accueil 5, Bing 3 ; page suivante = sortie 21, /parcours 13, un autre parcours 24, /conseils 9, /vannes 5, /videos 5, un article 13, /abonnement 1 ; 7 sessions sur 37 voient /abonnement à un moment. Pages vues par session : 1 page (29 sessions), 2 (7), 4 (1).
- Événements (90 j, site entier) : blog-scroll 58, abonnement-clic 4, abonnement-vu 3, blog-sortie-clic 2, inscription-envoi 2, inscription-reussie 1, inscription-echec 1, connexion-reussie 1, abonnement-reussi 1. **Événements parcours : 0** (`mur-vu` et `parcours-etape` jamais reçus). Aucun événement rattaché à un chemin /parcours*.
- Fichiers : `scratchpad/parcours-umami.json` (agrégats + journeys par session, utilisables par le data-analyst).

### 5.2 Bing Webmaster (API, clé de session, 07/10/2026)

| URL | Découverte | Dernière exploration | Taille | Impressions Bing (17/04 → 02/10) |
|---|---|---|---|---|
| /parcours | 28/04/2026 | 05/10/2026 | 102 Ko | 12 (4 jours-semaines), 3 clics, position 1 à 5 |
| /parcours/machine-a-cafe | 22/04/2026 | **10/08/2026** | 40 Ko | 0 |
| /parcours/repartie | 04/06/2026 | 23/09/2026 | 40 Ko | 0 |
| /parcours/confiance | 09/04/2026 | 07/10/2026 | 40 Ko | 0 |

- Statut d'indexation : l'API `GetUrlInfo` retourne `IsPage: true` et une taille de document pour les 4 URL, ce qui indique qu'elles sont connues et explorées ; elle ne donne pas de champ « indexée » explicite (`HttpStatus` renvoie 0). Lecture prudente : connues et explorées, indexation effective non prouvée pour les 3 pages détail (0 impression).
- Requêtes sur /parcours (Bing, 9 lignes) : « cours d'humour » (pos 6), « cours d'humour en ligne gratuit » (pos 2, 1 clic), « cours d'humour » (pos 2, 1 clic), « cours d'humour gratuit » (pos 1), « etudiant apprendre les vours humour » (pos 2), « comment apprendre le visa marrant » (pos 4), « competence drole humour » (pos 8), « trop marrant comment tu cours » (pos 3), « how to treat seasonal allergies » (pos 8, parasite).
- Site : 103 clics / 2 692 impressions sur la fenêtre (17/04 → 02/10) ; les parcours = 3 clics et 12 impressions, soit 3 % des clics et 0,4 % des impressions. Liens entrants Bing (`GetLinkCounts`) : 0.
- Fichier : `scratchpad/bing-parcours.json`.

### 5.3 Search Console

Non mesuré en session (pas de clé). Snapshot du 05/10 : aucune page `/parcours*` dans les top pages 28 j ni dans les opportunités ; section par section, seuls blog, `/vannes`, conseils et accueil sont listés. Impressions et position des parcours sur Google : **non mesuré**.

## 6. Potentiel de requêtes (sans cannibalisation)
_à écrire_

## 7. Vérifié / Non vérifié (G_PROOF)
_à écrire_

## 8. Handoff
_à écrire_
