# Avis SEO sur données réelles : session 15 (05/10/2026)

> **Note du 05/10 (Thomas, P0)** : la règle « zéro humoriste nommé » du 30/09 est ANNULÉE. Les humoristes cités dans la meta et le corps de `5-types` restent. Ignorer toute mention contraire ci-dessous.

**Agent :** @seo · **Sources :** `docs/analytics/snapshot-trafic-2026-10-05.md` (seule source de chiffres), code `apps/web`, `curl` prod du 05/10, 2 WebSearch (SERP « humour observationnel définition » et « une vanne blague »). **Aucun fichier de code modifié.** Volumes/difficulté non disponibles (niche) : intentions qualitatives. Courbes de CTR par position : [HYPOTHÈSE : ordre de grandeur général, pos 5 ≈ 5-8 %, pos 7-8 ≈ 2-4 %, pos 10 ≈ 1-2 %, à ne pas lire comme une mesure].

## 1. Verdict

1. Les scores d'audit (78 en s11, 60 en s14) mesuraient la **conformité technique estimée**, pas la performance : la technique est saine (1 215 pages en 200 au crawl s14, sitemap lu sans erreur, 0 erreur 5xx côté Bing), mais la **visibilité réelle est fragile et concentrée** : 1 page = 78 % des clics et 51 % des visites, CTR hors de cette page ≈ 1 %.
2. Le problème n'est pas l'indexation Google (impressions ×2,3, position moyenne 10,5 → 8,4) mais la **conversion impression → clic** : les titles/metas ne répondent pas à l'intention exacte des requêtes qui amènent les impressions. Bing est à 63 pages sur 384 avec 0 lien entrant : quasi invisible.
3. Le gisement le plus rapide est éditorial (5 titles/metas, 1 définition courte par page), pas technique ; le risque n°1 est daté (« 2026 » en janvier). Prérequis hors SEO : aucun événement d'inscription ou de paiement dans Umami, donc impossible de dire si ce trafic convertit (91 % de rebond, 33 s) : à confier à @data-analyst / @fullstack.

## 2. Diagnostic : impressions ×2,3, clics plats

- **Effet de mélange, pas de perte.** L'article 2026 tient (343 clics / 28 j, CTR 15,6 %, pos 5,5) ; tout le reste a gagné des impressions sur des requêtes informationnelles courtes (définitions, « comment », « type de ») où l'on se classe en pos 6-15 sans correspondance exacte avec le title. CTR global 6,3 % → 4,2 % mécaniquement.
- **Contre-preuve interne :** le CTR est de 15,6 % quand le title contient les mots exacts de la requête (« blagues … 2026 ») et ≈ 1 % quand ce n'est pas le cas (« observationnel », « vanne blague », « autodérision définition » absents des titles). C'est le levier le plus fiable de ce rapport.
- **Intention :** une bonne part des impressions vient de requêtes **définitionnelles** (dictionnaires, encyclopédies, réponses IA en tête de SERP). Une page « guide pratique » ou « catalogue » y est vue mais peu cliquée. Les clics baissent depuis août (143 → ~100/semaine) pendant que les impressions montent : cohérent avec ce mécanisme [HYPOTHÈSE : l'érosion par réponses IA est possible mais non mesurée, `[À MESURER : export GSC page × requête × appareil, 28 j]`].
- **Mobile** : 351 clics / 7 229 imp (4,9 %) contre 80 / 3 091 (2,6 %) sur desktop : les titles tronqués pèsent plus sur desktop ? Non conclu, ne pas surinterpréter.
- **Limite :** le snapshot ne donne pas les requêtes par page (sauf opportunités 90 j). Les causes ci-dessous sont des hypothèses fortes mais à confirmer par l'export page × requête.

## 3. Les 5 pages à CTR ≈ 0 : cause et correctif

Convention : suffixe ` | deviens-marrant.fr` ajouté par le template (`layout.tsx`), total title ≤ 60 ; meta ≤ 155 ; aucun tiret cadratin. **Une seule page à la fois par lot de deux semaines, ou un seul élément (title OU meta) par page**, pour attribuer l'effet dans GSC. Slugs, H1, H2, FAQ, chiffres : inchangés ; tout ajout de texte visible = **à valider Thomas** (règle chiffres/copy).

| Page (état prod 05/10) | Cause probable | Title proposé (total) | Meta proposée (car.) |
|---|---|---|---|
| `/blog/5-types-humour-lequel-pour-toi` : « Les 5 types d'humour : trouve le tien » ; 2 832 imp 90 j, pos 7,4, **0 clic** | Requête = **définition** ; le title n'a pas le mot « observationnel » ; la meta cite 3 humoristes par leur nom (hors sujet de la requête, et contraire au [CHOIX UTILISATEUR] du 30/09 « zéro humoriste nommé » : à signaler à Thomas, corps de l'article compris, sans décider à sa place). La SERP montre des définitions encyclopédiques. | `Humour observationnel : les 5 types` (56) | `L'humour observationnel, c'est rire de ce que tout le monde vit sans le dire. Sa définition en une phrase, puis 4 autres types pour trouver ton style.` (150) |
| `/vannes` : « 120+ vannes drôles à ressortir ce soir » ; 1 208 imp, pos 5,7, 0 clic (+ « vanne blague » 340 imp) | « une vanne blague » est **lexicale** : la SERP est occupée par les dictionnaires (Wiktionnaire, Robert, CNRTL, etc.), pas par des catalogues. Aucun title de catalogue ne gagnera ce clic. Le risque est de sacrifier le title pour une requête non cliquable. | `Vannes et blagues drôles à ressortir` (57) | `120+ vannes (ou blagues) rangées par situation : soirée, boulot, couple, école. Chacune a sa chute et son décryptage pour la replacer au bon moment.` (148) ; « 120+ » reste dynamique |
| `/blog/phrases-droles-conversations` : « 30 phrases drôles prêtes à ressortir » ; 2 248 imp, 40 clics (1,8 %), pos 5,5 | Title déjà exact-match : le défaut est la **meta** (33 dans la meta, 30 dans title/H1 : incohérence de chiffre, à aligner sur le nombre réel affiché) et une intention probable « phrases/statuts pour WhatsApp » plus large que le contenu. `[À MESURER : requêtes de cette page]` | **Inchangé** | `Phrases drôles pour la soirée, le date, WhatsApp ou la réunion : 30 répliques à placer, chacune avec le moment où la sortir pour qu'elle fasse rire.` (148) ; « 30 » = nombre réel à confirmer |
| `/blog/comment-avoir-de-la-repartie` : « Répartie : 10 techniques efficaces » ; 928 imp, 11 clics, **pos 10** | Pas un problème de snippet : à pos 10, 1,2 % est normal. Problème de **position** et de requête exacte (« avoir de la répartie » 96 imp pos 14,6, absent du title). Cluster partagé avec `/parcours/repartie` et `/conseils` (cannibalisation, voir s14 P1-7). | `Avoir de la répartie : 10 techniques` (57) | `Avoir de la répartie, c'est trouver la réplique sur le moment, pas sous la douche. 10 techniques concrètes, en soirée comme au bureau.` (~135) |
| `/blog/autoderision-interactions` : « Autodérision : le guide pratique » ; 963 imp, 5 clics, pos 9,2 (« autodérision » 255 imp pos 15,2 ; « définition » 145 imp pos 12,5) | Requête **définitionnelle** ; le title promet un « guide », pas la définition. Position moyenne due à des requêtes en pos 12-15. | `Autodérision : définition et exemples` (58) | `L'autodérision, c'est rire de soi sans se rabaisser. Définition, règles d'or et exemples pour être sympathique en 30 secondes sans te démolir.` (142) ; « exemples » = vrai si l'article en contient (à confirmer) |

**Complément éditorial (à valider Thomas, 1 phrase par page, sans toucher aux H2) :** une définition de 30 à 45 mots en tout début de section (« L'humour observationnel est… », « L'autodérision est… »), format qui vise le featured snippet et l'extrait IA. Pour `/vannes`, ne rien promettre : garder le catalogue, ajouter dans le H2 « Pourquoi ces vannes sont différentes » une phrase « Une vanne, c'est une blague qui… » seulement si Thomas le souhaite.
**Test :** si le title `Humour observationnel : les 5 types` fait perdre « type d'humour » (37 imp, pos 9,7, faible), le sous-titre/H2 « 5 types d'humour » le garde. Risque jugé faible.

## 4. Risque « 2026 » (78 % des clics)

- **Fait :** le title/H1/meta contiennent « 2026 », les 10 requêtes vedettes aussi. À partir de janvier 2027, la demande se déplace vers « 2027 » : la page peut perdre l'essentiel de ses clics en quelques semaines. [HYPOTHÈSE : décalage progressif entre mi-décembre et fin janvier, à vérifier dans GSC fin décembre].
- **Contrainte :** [CHOIX UTILISATEUR] 29/09 : ne jamais changer l'URL de `/blog/meilleures-blagues-droles-2026`. Ce choix est respecté : **pas de nouveau slug, pas de 308 sur cette page.** L'année dans l'URL reste, Google classe sur le contenu et le title (pratique courante sur des pages vivantes).
- **Plan (aucune action avant décembre, sauf préparation) :**
  1. **Maintenant à fin novembre :** ne rien toucher (la page marche) ; préparer le jeu de vannes 2027 (100 % vannes originales, barre « Alexa », relecture à l'aveugle) et la section « Les meilleures de 2026 » à conserver en bas de page.
  2. **Du 15 au 20/12 :** passer title/H1/meta à 2027 : title `50 blagues drôles à ressortir en 2027` (58), meta `Les 50 meilleures blagues courtes de 2027, testées et approuvées. Soirée, boulot, date, famille : la bonne vanne pour chaque situation.` (135). Renouveler une partie du contenu (≥ 30 % de vannes nouvelles), mettre à jour `dateModified` réel et le `lastmod` du sitemap (réel, pas de build), puis IndexNow + Bing SubmitUrl.
  3. **Du 02/01 au 31/01 :** suivre 3 requêtes cibles (« blague 2027 », « blagues 2027 », « blague à mourir de rire 2027 ») ; si les clics 2026 chutent avant le 15/12, avancer le basculement.
  4. **Filet de sécurité :** conserver l'ancienne mention « 2026 » dans le corps (section bilan) pour la traîne résiduelle. Diversifier (action 4) pour que la page ne pèse plus 78 %.
- **Rejeté :** doublon `/blog/blagues-2027` (cannibalisation) ; 308 vers un nouveau slug (contre le [CHOIX], et risque de fluctuation sur la page qui fait 78 % des clics).

## 5. Bing : 63 pages indexées sur 384, 0 lien entrant

- **IndexNow : câblé, mais seulement pour les articles.** `lib/indexnow.ts` (POST `api.indexnow.org`, `keyLocation=/indexnow-key.txt`) est appelé à la publication d'un article planifié (`prepared-content.ts`, jeudis 05:00 UTC) et par le cron `weekly-seo` ; jamais pour les 133 vannes, 110 conseils, 90 vidéos, ni les hubs. La route `POST /api/indexnow` existe mais n'est pas authentifiée (s14 P2-5, ouvert).
- **Clé : vérifier.** Le 05/10, `/indexnow-key.txt` et `/35cc97ed….txt` servent tous deux `bfacf934…` (le 30/09 le premier servait `35cc97ed…`). Les deux routes lisent `INDEXNOW_KEY` : cohérent entre elles, mais le **nom** du fichier `35cc97…` ne correspond plus à la clé (sans effet tant que `keyLocation` est utilisé). Aucun ping de test envoyé depuis cette session (effet de bord externe) : `[À MESURER : réponse 200/202 au 1er envoi]`.
- **Cause probable du 63/384 :** autorité nulle (0 lien entrant), site récent et pages catalogue courtes ; Bing indexe peu et lentement dans ce cas. Les liens internes se sont améliorés depuis s14 (`/blog` : 35 liens article en HTML ; `/vannes` : 19 liens fiche en HTML) mais le catalogue reste peu relié.
- **Plan (J0 à J10) :**
  1. **J0 :** soumettre en un lot les 384 URL du sitemap via IndexNow (limite d'un POST : 10 000 URL, sans lien avec le quota Bing de 100/jour) en protégeant la route par secret.
  2. **J0 à J4 :** SubmitUrlBatch Bing, 100/jour par priorité : jour 1 = 36 articles + 4 parcours + hubs + `/a-propos` ; jours 2-4 = vannes/conseils/vidéos les mieux notées. Ne pas dépasser 2 700/mois.
  3. Continu : ajouter vannes, conseils et vidéos du jour programmés au ping IndexNow (valeur : fraîcheur réelle).
  4. Maillage : accueil et articles vers 3-6 fiches du catalogue chacun ; vérifier le « mot-clé exact » title/H1/P1 sur les 4 pages de tête Bing (article 2026, phrases-droles, citation-drole, a-propos).
- **Réaliste :** 63 → 200 pages à J+30, 300 à J+60 si le contenu est jugé qualitatif ; au-delà, dépend des backlinks.
- **Lecture Bing :** 8 clics / 501 imp (28/09), requête n°1 « unsitemarrant.fr » = navigationnelle vers un autre site, à ignorer. Signaux sociaux : coordonner avec @social (liens `/liens`, profils `sameAs` toujours absents).

## 6. Backlinks : 0 lien mesuré

- **État :** Bing 0, GSC non extrait (rapport Liens non exposé par l'API) `[À MESURER : onglet Liens GSC par Thomas]`. 5 referrals/28 j seulement.
- **Priorité réaliste (valeur, pas effort) :** secondaire derrière les titles et Bing, car sans CTR réparé, plus d'autorité n'ajoute que des impressions. Mais indispensable à 60-90 j pour l'indexation Bing.
  1. Exécuter le dossier `docs/growth/soumissions-backlinks-s11.md` (Uneed, There's An AI For That, Microlaunch, annuaires FR, SourceBottle ; BetaList écarté) : ~5 domaines référents. Aucune mention de l'identité du fondateur (CHOIX 29/09).
  2. Profils réseaux (Instagram `/liens`, X) + `NEXT_PUBLIC_SOCIAL_PROFILES` pour `sameAs` (entité, pas de PageRank).
  3. Pitch journaliste/HARO sur l'étalon 3 validé, sans nommer de personne.
  4. Pas d'achat de liens, pas de pages « satellites ».
- **Objectif :** ≥ 5 domaines référents mesurés dans Bing/GSC à J+60 ; 0 en dessous = signal de revoir l'angle.

## 7. URL fantôme `/blog/jeux-de-mbras-technique-3-etapes` (404 avec impressions)

- Le slug n'apparaît dans aucun fichier du dépôt (hors snapshot). Il ressemble à une variante déformée de `/blog/jeux-de-mots-technique-3-etapes`, déjà redirigé en 308 vers `/blog/jeu-de-mots-drole-techniques-creer` (`seo-redirects.data.cjs`, l. 35). [HYPOTHÈSE : ancien article publié par le cron avant la panne IA de juin, retiré de la base.]
- **Recommandation : oui, redirection 308** vers `/blog/jeu-de-mots-drole-techniques-creer`, une ligne dans `seo-redirects.data.cjs` (même raison que la ligne 35). Coût nul, récupère les impressions. Avant : vérifier dans GSC (page × requête) que la requête concerne bien les jeux de mots ; sinon laisser en 404 propre. À faire par @fullstack, déclaré dans `REPLIT_ACTIONS.md`.

## 8. Top 5 actions classées par valeur

| # | Action | Responsable | Métrique de succès |
|---|---|---|---|
| 1 | Réécrire les 5 titles/metas du §3 (lots séquentiels, 1 variable par page) + définitions courtes (GO Thomas) | @seo brief, @copywriter, @fullstack | GSC page × requête : `5-types` ≥ 2 % de CTR sur « humour observationnel » à J+28 (≥ 15 clics/28 j, contre 0) ; `/phrases-droles` 1,8 % → ≥ 3 % ; `/autodérision` 0,5 % → ≥ 2 % ; clics hors article 2026 : 99 → ≥ 150 par 28 j |
| 2 | Basculer l'article 2026 vers 2027 du 15 au 20/12, sans changer le slug | @copywriter, @fullstack | Fin janvier 2027 : clics 28 j de la page ≥ 80 % des 343 de septembre ; position ≤ 4 sur « blague 2027 » |
| 3 | Bing : IndexNow en lot + SubmitUrlBatch 100/j + IndexNow sur tout contenu du jour, route protégée | @fullstack, @seo | Bing pages indexées 63 → ≥ 200 à J+30 ; impressions Bing hebdo 501 → ≥ 800 ; réponse IndexNow 200/202 vérifiée |
| 4 | Diversifier : faire circuler l'autorité de l'article 2026 (51 % des visites) vers `comment-avoir-de-la-repartie`, `phrases-droles` et `5-types` (3 liens contextuels chacun, blocs « À lire ensuite » déjà existants à vérifier) ; viser pos 10 → ≤ 6 sur « avoir de la répartie » | @fullstack, @copywriter | Part de l'article 2026 dans les clics GSC 78 % → ≤ 65 % à J+60 ; pages/visite Umami > 1,1 ; `comment-avoir-de-la-repartie` ≥ 30 clics/28 j |
| 5 | Backlinks : dossier s11 (5 soumissions) + 308 de l'URL fantôme (§7) | Thomas (soumissions), @fullstack (308) | ≥ 5 domaines référents Bing/GSC à J+60 ; 0 impression sur 404 à J+30 |

**Mesure :** annoter dans GSC chaque changement de title ; ne pas comparer avant J+14 (délai de recrawl) ; relever le suivi chaque lundi (rapport Umami 7h déjà actif).

## Handoff

**Handoff → @orchestrator (puis @fullstack, @copywriter, @data-analyst)**
- Fichier produit : `/home/user/Marrant/docs/seo/avis-donnees-reelles-s15.md`.
- Décisions prises : le CTR est le levier prioritaire (pas la technique) ; slug de l'article 2026 conservé et bascule 2027 par title/H1/meta ; IndexNow lot unique + SubmitUrl 100/j ; 308 de l'URL fantôme vers l'article jeux de mots.
- Points d'attention : (1) GO Thomas avant tout ajout de texte visible (définitions) ; (2) humoristes nommés dans la meta et le corps de `5-types` vs [CHOIX] 30/09 : à trancher par Thomas ; (3) chiffre 30/33 de `phrases-droles` à aligner sur le réel ; (4) double optimisation SEO+GEO : définitions courtes en tête de section (extrait IA) ; (5) funnel inscription/paiement non mesuré dans Umami : prérequis pour juger la valeur du trafic SEO ; (6) références SERP : dictionnaires en ligne et encyclopédies sur « une vanne blague » / « humour observationnel définition » (standard à dépasser : définition courte + exemple concret).
