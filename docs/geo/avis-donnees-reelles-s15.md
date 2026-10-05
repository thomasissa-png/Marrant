# Avis GEO sur données réelles, deviens-marrant.fr, session 15, 05/10/2026

> Agent @geo. Source unique de chiffres : `docs/analytics/snapshot-trafic-2026-10-05.md`. Aucun accès à ChatGPT, Perplexity, Gemini, Copilot, Claude : baseline de citations `[À MESURER]`. Aucun autre fichier modifié.

## 1. Verdict en 3 lignes
1. Le score GEO (61 en s11, 63 en s14) mesure la **préparation technique**, pas la visibilité : le réel est faible, environ 22 visites d'origine IA en 28 j sur 713 (3 %), dont 5 en canal « llm » et 17 en `utm_source` (16 chatgpt.com, 1 gemini). [HYPOTHÈSE : les 17 visites `utm_source` sont comptées hors du canal « llm » ; si elles y sont incluses, le total est 17.]
2. Le score est trompeur sur un point : il note « accès bots » à 8/10 alors que Bing, qui alimente ChatGPT search et Copilot [HYPOTHÈSE : à reconfirmer dans la doc des éditeurs], n'indexe que 63 pages sur 384 (16 %) et ne voit aucun lien entrant. La grille s11 n'a aucune dimension « indexation chez les moteurs qui alimentent les IA ».
3. Bonne nouvelle : au moins un LLM cite déjà le site et envoie des clics (preuve que les bots de recherche passent malgré Cloudflare, P0-1 de l'audit s14 probablement levé pour ChatGPT). Le goulot n'est pas le code, c'est l'indexation Bing, l'absence de mentions tierces et l'absence de pages de définition citables.

## 2. Lecture des signaux réels

**Trafic IA.** 22 visites en 28 j (9 en canal llm sur 90 j) : trop peu pour une tendance, assez pour un signal. Le plateau global (20-30 visites/jour) ne vient pas de l'IA : 455 visites organiques (64 %) sur 713, Google = 401.

**Quelles pages reçoivent le trafic ChatGPT/Gemini ?** Non déductible du snapshot : il croise canal et page d'entrée seulement séparément. Éléments disponibles :
- 364 visites sur 713 entrent par `/blog/meilleures-blagues-droles-2026` (51 %). [HYPOTHÈSE : la majorité des 22 visites IA y arrive, car c'est la page la plus exposée et la mieux positionnée sur Bing, pos 5-6.]
- Bing indexe notamment : article blagues 2026, `phrases-droles-conversations`, `citation-drole`, `a-propos`. Un LLM qui s'appuie sur Bing ne peut citer que ce qui est indexé : les citations possibles se limitent aux 63 pages. [HYPOTHÈSE]
- **Conséquence pour l'objectif du project-context** (« référencé comme source quand on demande comment devenir drôle ») : les piliers pédagogiques ne sont probablement pas ceux qui sont cités. `comment-devenir-drole` n'apparaît pas dans le top pages GSC 28 j ; `comment-avoir-de-la-repartie` : 928 imp, 11 clics, pos 10.
- **Action de lecture (0 €)** : Umami permet de filtrer `referrer = chatgpt.com` ou `utm_source` par page d'entrée. À faire dès la semaine 1 et à noter dans le suivi.

**Lien indexation Bing / visibilité ChatGPT et Copilot.**
- Bing crawle (10-29 pages/jour, 0 erreur, 0 blocage) mais n'indexe pas : « crawlé, non indexé ». [HYPOTHÈSE : cause = 0 lien entrant + ~1 100 pages catalogue au gabarit répétitif qui diluent la qualité perçue du domaine. À confirmer par l'outil d'inspection d'URL de Bing.]
- Les impressions Bing ont été multipliées par 10 en 4 mois (45 à 501/semaine) mais 8 clics : visibilité qui commence, sans autorité.
- Une requête navigationnelle n°1 vers un autre site (graphie proche du nom de marque) suggère un risque de confusion d'entité : « Marrant » est un mot courant. [HYPOTHÈSE]

**Vérification WebSearch du 05/10/2026** (outil de recherche web, PAS un assistant IA ; indicatif) :
- « comment avoir de la répartie » : deviens-marrant.fr absent des 9 premiers résultats (écoles de théâtre, blogs de développement personnel). Cohérent avec GSC (pos 10).
- « comment devenir drôle exercices pour être plus drôle » : absent des 9 premiers résultats.
- « humour observationnel définition autodérision types d'humour » : `/blog/5-types-humour-lequel-pour-toi` présent (2e position), et la synthèse de l'outil **reprend la définition du site presque mot pour mot** (« décrire la réalité avec une précision… »). Le passage est extractible : le gisement est là.
- GSC confirme le paradoxe : « humour observationnel » = 2 832 imp, pos 7,4, **0 clic** sur 90 j. Visibilité sans clic : typique d'une réponse prise ailleurs (extrait ou synthèse IA). Pour le GEO, ce n'est pas une perte : c'est la preuve qu'une définition courte est lue. Il faut la rendre citable et attribuable.

## 3. Ce qui manque pour être cité
| Manque | Constat réel | Gravité |
|---|---|---|
| Mentions tierces | 0 mesurée (hors BetaList, audit s14) ; 0 lien entrant Bing ; comptes sociaux à 0 abonné | Critique |
| Indexation Bing | 63/384 | Critique |
| Pages/blocs de définition | Volume GSC : humour observationnel 2 832 imp, autodérision 255, autodérision définition 145, type d'humour 37, répartie 161 : tous quasi 0 clic | Haute |
| Données originales citables | Aucune statistique propre publiée (l'étude citée est tierce et contestée, P1-1 s14) | Haute |
| Entité de marque | `sameAs` absent en s14 (P0-3) [À VÉRIFIER : corrigé depuis ?], nom générique, pas de Wikidata (notabilité insuffisante) | Haute |
| llms.txt | Présent et dynamique : **ne plus investir** (aucun grand fournisseur n'a confirmé l'usage, audit s14 §1.3) | Faible |

## 4. Top 5 actions classées par valeur
**1. Faire indexer par Bing les ~50 pages à valeur (36 articles, 4 parcours, glossaire, a-propos, accueil, listes /vannes /conseils /videos).**
- Pourquoi : sans index Bing, pas de citation possible côté ChatGPT search ni Copilot. Quota réel : 100 URL/jour, IndexNow disponible (route déjà présente) : 50 URL tiennent en 1 jour.
- Agent : @seo (liste priorisée, inspection d'URL Bing, diagnostic « non indexé »), @fullstack (IndexNow à la publication de chaque article du jeudi). Aucune désindexation sans arbitrage @seo.
- Mesure : pages indexées Bing hebdo (63 au départ ; cible [HYPOTHÈSE : ≥ 120 sous 8 semaines]) ; part du canal llm + `utm_source=chatgpt.com` dans Umami.

**2. Ajouter un bloc « Définition » de 40-60 mots en tête des pages qui ont du volume et zéro clic.**
- Cibles : `5-types-humour` (humour observationnel, type d'humour), `autoderision-interactions` (autodérision définition), `comment-avoir-de-la-repartie` (répartie), `/vannes` (une vanne, c'est quoi). Pas de nouvelle URL : pas de cannibalisation, slugs/H2/FAQ/chiffres intouchables (règle P0 s11). Entrées du glossaire (DefinedTermSet) alignées mot pour mot.
- Pourquoi : la définition de `5-types` est déjà reprise par un synthétiseur ; la généraliser. Zéro langage promotionnel, un seul fait vérifiable par passage.
- Agent : @copywriter (après calibrage étalons avec Thomas, règle P0 s8), @seo (compatibilité keyword-map), @fullstack (DefinedTerm).
- Mesure : impressions/clics GSC sur ces requêtes à 4 et 8 semaines ; présence de la définition dans les réponses aux prompts de test.

**3. Obtenir 10 à 15 mentions/liens tiers réels (c'est aussi ce qui débloque l'index Bing).**
- Quoi : mettre à jour la fiche BetaList (chiffres actuels), annuaires et ressources sur l'humour/le développement personnel, réponses utiles sans lien promotionnel sur forums (3-5/semaine, compte de marque non personnifié : jamais le fondateur, choix du 29/09), reprise de `docs/growth/soumissions-backlinks-s11.md`.
- Agent : @growth (plan, exécution), @social (cartes/vidéos courtes). Statut du GO Thomas sur Q3 de l'audit s14 : [À VÉRIFIER].
- Mesure : liens entrants Bing (0 au départ), referral Umami (14 sur 90 j), recherche mensuelle de la marque entre guillemets.

**4. Consolider l'entité : `sameAs` en dur, graphie unique « Deviens Marrant », bios identiques, vérifier Cloudflare.**
- Quoi : URLs des 3 comptes de marque en dur dans le JSON-LD ; `AboutPage` sur /a-propos ; relire le journal AI Crawl Control (requêtes OAI-SearchBot, ChatGPT-User, PerplexityBot « Allowed »). Pour lever la confusion de nom : la définition « Deviens Marrant est… » en première phrase de /a-propos et du llms.txt.
- Agent : @fullstack (JSON-LD), Thomas (URLs, dashboard Cloudflare), @infrastructure (runbook).
- Mesure : réponse au prompt « Qu'est-ce que Deviens Marrant ? » (exactitude, prix 2,99 €, compteurs affichés en production) ; requête Bing de marque.

**5. Publier une donnée originale citable, sourcée et datée.**
- Quoi : un baromètre annuel « types d'humour » issu du quiz (12 questions) : répartition réelle des résultats, méthode, effectif, date, tableau extractible. [HYPOTHÈSE : les résultats du quiz sont stockés en base, à vérifier par @fullstack ; sinon aucune donnée n'est inventée, on attend 90 jours de collecte.] Aucun chiffre du site retiré ni remplacé (choix fondateur).
- Pourquoi : les LLM citent un chiffre qu'on ne trouve que chez nous ; c'est aussi un contenu relayable pour l'action 3.
- Agent : @data-analyst (extraction), @copywriter, @fullstack.
- Mesure : citations de la page (prompts de test), liens obtenus, impressions sur « quel type d'humour ».

## 5. Protocole de mesure (gratuit, ~10 min/semaine, ~45 min/mois)
**Baseline (une fois, 30 min, Thomas)** : exécuter les 10 prompts ci-dessous sur ChatGPT (recherche activée), Perplexity, Gemini, Copilot et Claude (versions gratuites) ; coller les réponses. Noter : cité O/N, URL, exactitude, sources citées. Tant que non fait : `[À MESURER]`.

Prompts : (1) comment avoir de la répartie ; (2) comment devenir drôle quand on est timide ; (3) exercices pour être plus drôle ; (4) c'est quoi l'humour observationnel ; (5) autodérision définition et exemples ; (6) types d'humour, lequel est le mien ; (7) meilleures blagues 2026 ; (8) site pour apprendre à être drôle en français ; (9) Qu'est-ce que Deviens Marrant ; (10) Deviens Marrant avis et prix.

**Hebdomadaire (lundi, avec le rapport Umami)** : canal llm, referrers chatgpt.com/gemini/perplexity et `utm_source` (visites, page d'entrée) ; pages indexées et liens entrants Bing ; clics GSC sur les 6 requêtes de définition/répartie.

**Mensuel (1er lundi)** : rejouer les 10 prompts, comparer au baseline ; Google Alerts gratuit sur « deviens-marrant.fr » et « Deviens Marrant » ; recherche manuelle des mentions ; relire les erreurs factuelles (prix, compteurs) et, si erreur, protocole de correction (contenu contradictoire structuré, signalement, suivi 30-60 j).
Consigner dans `docs/geo/geo-monitoring-setup.md` (à créer au premier cycle par @geo).

**Seuils de lecture** : < 30 visites IA/mois = bruit, ne pas conclure ; décision de passer à un outil payant de suivi des citations seulement si la charge manuelle gêne (tarifs à rechercher alors, aucun prix de mémoire).

## 6. Limites
- Aucun pourcentage d'étude externe cité ici (aucune source datée de moins de 12 mois recherchée).
- Les liens « ChatGPT alimenté par Bing » et « ChatGPT ajoute `utm_source=chatgpt.com` aux liens cités » sont des hypothèses à reconfirmer dans la documentation OpenAI/Microsoft avant décision.
- La vérification WebSearch ne prouve rien sur ChatGPT, Perplexity, Gemini, Copilot ou Claude.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/geo/avis-donnees-reelles-s15.md`.
- Décisions : priorité à l'indexation Bing et aux mentions tierces avant tout nouveau travail de code ; définitions en blocs dans les pages existantes (pas de nouvelles URL) ; llms.txt gelé.
- Points d'attention : ne rien changer aux slugs, H2, FAQ, chiffres, prix sans GO ; baseline toujours `[À MESURER]` ; monitoring hebdo + mensuel.
