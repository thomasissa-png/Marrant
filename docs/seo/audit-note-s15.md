# Audit noté s15 : angle SEO (05/10/2026)

**Agent :** @seo. **Sources :** `docs/analytics/snapshot-trafic-2026-10-05.md` (seule source de chiffres GSC/Bing/Umami), `curl` prod du 05/10 (lecture seule), code `apps/web`. Aucun fichier de code modifié. Volumes et difficulté indisponibles (niche) : lecture par intentions. Objectif jugé : (1) ATTIRER, (2) CONVERTIR visiteur, inscrit, abonné Premium. Barème : 10 = référence du marché pour un site de cette taille, 5 = freine, 3 = bloque, 1 = absent. Les titles/metas du commit e1728a5 (non déployé) sont comptés comme « à venir », pas comme acquis.

## 1. Tableau des notes

| Sujet | Note /10 | Axe | Fait clé | Action n°1 |
|---|---|---|---|---|
| S1 Article « 50 blagues 2026 » | **7** | Attirer (convertit à 2) | 1 347 clics / 5 944 imp en 90 j, pos 4,4, 78 % des clics ; mais 92 % de rebond, 28 s, 357 sorties sur 383 visites | Ajouter un passage vers le quiz/parcours au milieu de l'article ; basculer 2027 du 15 au 20/12 (CHOIX actée) |
| S2 Blog éditorial (36 + 11 forte frappe) | **5** | Attirer | 20 articles sur 36 ont des impressions ; 16 à zéro ; 5 articles font 99 % des clics hors n°1 | Fusionner/différencier les articles qui se marchent dessus, titles à la requête exacte |
| S3 Piliers requêtes cœur | **3** | Attirer | « comment devenir drôle » pos 33,2 (0/48), « comment être drôle » pos 44,4 (0/17), pilier visible seulement sous `www.` | Plan §3 : consolider le pilier, lien depuis l'accueil, GSC inspection des 2 hôtes |
| S4 Catalogue (133 / 110 / 90) | **3** | Attirer | Conseils : 19 pages, 2 clics / 101 imp ; fiches vannes et vidéos ≈ 0 ; 89 chemins visités sur 384 en 180 j | Indexer et relier les 40 meilleures fiches, laisser le reste en l'état (pas de noindex sans mesure) |
| S5 SEO technique et indexation | **7** | Attirer | Sitemap 384 URL lu sans erreur, 8 articles testés 200/index/canonical absolu ; Bing 63 pages sur 384 ; 6 slugs fantômes dans `blog-clusters.ts` (404) | IndexNow en lot (384 URL) + route protégée ; nettoyer les clusters fantômes |
| S6 Snippets et CTR | **5** | Attirer | CTR 6,3 % puis 4,2 % (impressions ×2,3, clics plats) ; `5-types` 0 clic / 2 832 imp ; 5 réécritures prêtes mais non déployées | Déployer e1728a5, puis 4 titles supplémentaires (§2 S6) |
| S7 Présence hors site | **2** | Attirer | Bing : 0 lien entrant ; 14 referrals / 90 j, 13 social ; « deviens marrant » : 0 impression en 90 j | Exécuter le dossier `docs/growth/soumissions-backlinks-s11.md` (5 domaines) |
| S8 Visibilité IA (avis secondaire) | **5** | Attirer | Tous les bots IA en `Allow` (robots.txt), `llms.txt` en 200, `sameAs` + `Organization.logo` présents ; mais LLM = 9 visites / 90 j, `utm_source=chatgpt.com` 23 | Définitions de 30-45 mots en tête des pages visées (double SEO+GEO, GO Thomas) |
| S9 Passage blog → produit | **3** | Convertir | CTA présents (`article-cta.tsx` l.63 et 68) mais `/parcours` 27 vues / 90 j, `/quiz-humour` 8, `/abonnement` 8 pour 2 075 visiteurs ; 0 événement `blog-cta-clic` reçu | Bloc contextuel « teste ton style » dans l'article n°1 (cible quiz) |
| S10 Funnel inscription → Premium | **2** | Convertir | 0 vue `/register` et `/onboarding` en 180 j, `/abonnement/success` 1, `upgrade=cancel` 2, `OAuthCallback` en erreur ×3 | Corriger la mesure (S11) avant tout test, puis réparer l'échec Google OAuth |
| S11 Mesure et pilotage (avis secondaire) | **2** | Convertir | Seuls 7 `blog-scroll` et 1 `blog-sortie-clic` reçus en 180 j pour 5 096 pages vues ; aucun événement inscription/checkout | 5 événements funnel + vérifier pourquoi `blog-scroll` ne remonte pas |
| S12 Rétention et réactivation (avis secondaire) | **4** | Convertir | Direct 145 / 28 j (20 %) ; cron `daily-push` et un seul gabarit email (`annual-renewal-reminder.ts`) ; promesse newsletter retirée ; aucune séquence de réactivation repérée [HYPOTHÈSE : audit de code partiel] | Lancer l'email mensuel préparé (CHOIX 01/10) avec lien parcours |

**Note globale ATTIRER : 4,3 / 10** (moyenne pondérée : S3 ×2, S7 ×1,5, S8 ×0,5, autres ×1). **Note globale CONVERTIR : 2,6 / 10** (S9 et S10 ×2, S1 côté conversion = 2, S11 et S12 ×1). Le trafic existe (2 075 visiteurs / 90 j) mais il n'est ni diversifié ni transformé ; la mesure empêche de savoir s'il convertit.

## 2. Actions détaillées (sujets notés 5 ou moins)

**S2 Blog éditorial (5).**
1. Résoudre les chevauchements : trois articles « répartie » (`comment-avoir-de-la-repartie`, `repartie-debutant-5-etapes`, `repartie-soiree-anti-malaise`) + `/parcours/repartie` ; cinq articles « raconter une blague / blague courte » (`raconter-blague-sans-massacrer`, `comment-raconter-une-blague-sans-la-rater`, `blagues-courtes-vs-longues`, `blague-courte-arme-secrete-humour`, `timing-humour`) ; deux « après rupture ». Un seul article porte la requête principale, les autres changent d'intention (situation, niveau) ou sont redirigés en 308 vers lui (jamais sans mesure d'impressions). Fichiers : `apps/web/src/lib/blog-articles.ts`, `seo-redirects.data.cjs`. Agent : @seo (carte), @copywriter, @fullstack. Succès : 16 → ≤ 8 articles à zéro impression à J+60 (export GSC pages).
2. Garder le calendrier forte frappe (11 articles saisonniers à leur pic) et exiger pour chacun un title qui reprend la requête exacte en tête (« blague anniversaire », « message d'invitation drôle »). Agent : @copywriter. Succès : chaque article ≥ 100 impressions à J+30 de publication.
3. Retirer les 6 slugs fantômes de `apps/web/src/lib/blog-clusters.ts` (`devenir-drole-30-jours`, `humour-self-deprecating`, `techniques-standup-vie-sociale`, `voler-techniques-standup-soiree`, `processus-creatif-humoristes-applique`, `parcours-humour-30-jours-retour` : 404 au 05/10) ou publier les articles ; le cluster « Apprendre des pros » a son pilier en 404. Agent : @fullstack. Succès : 0 lien interne vers 404 au crawl.

**S3 Piliers (3).** Voir §3.

**S4 Catalogue (3).**
1. Constat : 90 j, `/vannes` hub 45 clics / 3 850 imp, mais conseils 19 pages = 2 clics, fiches ≈ 0. Les fiches sont courtes et l'intention de requête (« blague + thème ») est servie par le hub. Relier 40 fiches (les mieux notées) depuis les articles et l'accueil (3 à 6 liens contextuels par article, composant `blog-article-related.tsx`). Agent : @fullstack, @copywriter. Succès : Bing pages indexées 63 → 200 à J+30 ; 10 fiches avec ≥ 20 imp GSC à J+60.
2. Ne pas noindexer le reste avant J+60 : [HYPOTHÈSE : le gain d'une taille de crawl réduite est inférieur au risque de perdre des fiches qui montent]. Succès : décision prise sur export GSC.
3. Rendre les fiches utiles à la requête (une phrase de contexte « quand la sortir » existe pour les vannes ; vérifier qu'elle est visible en HTML). Agent : @copywriter, GO Thomas pour tout texte visible. Succès : CTR fiches ≥ 1 % sur celles qui ont des impressions.

**S6 Snippets et CTR (5).** Les 5 réécritures (e1728a5) suffisent pour 5 pages (≈ 8 500 impressions sur 90 j, 0 à 40 clics) mais ne couvrent ni le pilier (title « Comment devenir drôle : le guide », aucune promesse), ni `comment-faire-rire-un-homme` (4 / 463), `comment-faire-rire-une-fille` (2 / 364), ni `/blog` hub (1 / 564, pos 28), ni l'accueil (0 / 83). Actions : (1) déployer e1728a5 puis ne comparer qu'à J+14 ; (2) 4 titles de plus, un par lot de deux semaines, une seule variable par page ; (3) les résultats enrichis FAQ/HowTo sont posés sur le pilier (FAQPage + HowTo dans le HTML) mais Google les affiche très peu hors santé et institutions : ne pas compter dessus pour le CTR. Agent : @seo brief, @fullstack. Succès : CTR hors article n°1 de 1 % à ≥ 2,5 % sur 28 j, clics hors n°1 de 99 à ≥ 150.

**S7 Présence hors site (2).**
1. Soumissions du dossier s11 (annuaires, lancements, presse spécialisée) : 5 domaines référents. Agent : Thomas pour les comptes, @growth pour les textes. Succès : ≥ 5 domaines référents Bing/GSC à J+60 (aujourd'hui 0).
2. Instagram (`/liens`) et X : 5 X + 4 Instagram par semaine déjà décidés ; mesurer `fbclid` (5 / 90 j) et social (13 / 90 j). Agent : @social. Succès : social ≥ 40 visites / 90 j à J+90.
3. Marque : « deviens marrant » à 0 impression ; une fois les profils et annuaires en ligne, vérifier la requête de marque à J+60. Agent : @seo. Succès : ≥ 10 impressions sur la marque.

**S8 Visibilité IA (5, secondaire).** Les portes sont ouvertes, l'effet est marginal : LLM 5 visites / 28 j. Actions : définitions courtes de 30-45 mots (coordination @geo, aucune page ne doit viser une requête que @geo traite autrement) ; relever les citations dans les réponses IA tous les mois. Succès : LLM ≥ 20 visites / 28 j à J+90.

**S9 Passage blog → produit (3).**
1. Article n°1 : un bloc après la 10e vanne « Quel humour est le tien ? » vers `/quiz-humour`, puis le CTA parcours en fin ; fichier `apps/web/src/components/blog/article-cta.tsx` et `blog-article-view.tsx`. Pas de pub déguisée (ton CHOIX 06/05 : on offre). Agent : @fullstack, @copywriter. Succès : sorties de l'article de 93 % à ≤ 85 %, quiz ≥ 40 vues / 28 j.
2. Même logique sur `phrases-droles-conversations` (57 visites d'entrée) vers `/parcours/repartie`. Succès : `/parcours` ≥ 60 vues / 28 j.
3. Rendre `blog-cta-clic` fiable (voir S11). Succès : événement visible dans Umami à J+7.

**S10 Funnel (2).**
1. Corriger l'échec de connexion Google (`?error=OAuthCallback` ×3 en 28 j, `apps/web/src/app/(auth)/login/page.tsx`). Agent : @fullstack. Succès : 0 erreur à J+14.
2. Événements : `inscription_demarree`, `inscription_validee`, `onboarding_termine`, `checkout_ouvert`, `abonnement_actif` ; chaque page piège (`/register`, `/onboarding`) est à vérifier (0 vue en 180 j alors que le site annonce 1 500+ membres : la mesure ou le script sont en cause). Succès : taux visite → inscrit lisible à J+7.
3. Ne pas toucher au prix (2,99 €, CHOIX 03/10) ni aux chiffres ; tester seulement l'ordre des éléments de `/abonnement`. Succès : `/abonnement` ≥ 30 vues / 28 j (8 en 90 j aujourd'hui).

**S11 Mesure (2).** `trackUmami` expose 5 noms d'événements, mais 7 `blog-scroll` seulement en 180 j : [HYPOTHÈSE : seuil de déclenchement ou script non chargé sur les pages blog servies en cache]. Actions : test de bout en bout avec un navigateur réel, tableau de bord Umami unique (entrées par page, CTA, funnel), export GSC page × requête mensuel dans le rapport du lundi. Agents : @data-analyst, @fullstack. Succès : ≥ 5 types d'événements reçus à J+7.

**S12 Rétention (4).** Email mensuel préparé (CHOIX 01/10) avec 1 lien parcours ; séquence J+3, J+14 sans connexion, ton « on offre ». Agents : @growth, @copywriter. Succès : retour direct 145 → ≥ 200 visites / 28 j à J+60.

## 3. Requêtes cœur : pourquoi pos 33-54, et le plan

**Constat :** « comment devenir drôle » 0 / 48 imp pos 33,2 ; « comment être drôle » 0 / 17 pos 44,4 ; « comment être drôle dans une conversation » pos 43 ; `exercices-developper-humour` sort en pos 54 sur la même requête que le pilier, et le title de l'accueil (« Devenir drôle et avoir de la répartie ») vise aussi ce cluster.

**Vérification de `/blog/comment-devenir-drole` (curl 05/10) : aucun défaut technique.** `www` → apex en 301 (`middleware.ts` l.93-99, identique avec un user-agent Googlebot) ; apex en 200 ; canonical `https://deviens-marrant.fr/blog/comment-devenir-drole` ; `robots` = `index, follow` ; présent dans le sitemap (l.160, lastmod 29/09 stable) ; 1 941 mots, 9 H2, Article + FAQPage + HowTo + fil d'Ariane. Conclusion : les 47 impressions (pos 19,4) sont affichées sous `www.` parce que Google n'a pas encore substitué l'URL canonique dans ses résultats (ancien hôte indexé, ou liens externes vers `www`) ; sous l'apex, il n'y a aucune impression. [HYPOTHÈSE : consolidation encore en cours, non confirmée sans l'outil « Inspection d'URL » de GSC]. Conséquence : la meilleure position du pilier (pos 19) est invisible pour le suivi, et chaque semaine sans consolidation retarde le gain.

**Pourquoi la position 33-54, par ordre de poids :**
1. **Autorité nulle** : 0 lien entrant Bing, 0 impression de marque, 14 referrals / 90 j. Une requête à intention « guide » en position 1-10 est tenue par des sites installés ; sans lien ni marque, la page ne passe pas la barre.
2. **Cannibalisation interne** : 3 URL du site entrent en concurrence (pilier, `exercices-developper-humour` pos 54, accueil). Google en choisit une par requête et change selon les jours.
3. **Pilier mal relié** : 19 pages sur 40 testées le lient, mais l'accueil (H1 « Tu parles et personne rit ») n'a qu'un lien vers `/blog`, pas vers le pilier, alors que c'est la page la plus puissante du site.
4. **Title sans promesse** : « Comment devenir drôle : le guide » ne se différencie pas ; les autres pages à CTR élevé (15,6 %) portent les mots exacts de la requête plus un bénéfice. [HYPOTHÈSE : un title avec un bénéfice chiffré aide le CTR, pas la position.]
5. **Engagement** : 91 % de rebond et 33 s en moyenne [HYPOTHÈSE : signal indirect, non démontré].

**Plan, sans changer aucune URL :**
- **J0 (Thomas)** : GSC, inspecter `www.…/comment-devenir-drole` et l'apex, demander l'indexation de l'apex. @fullstack : IndexNow sur le pilier.
- **J0 à J7 (@fullstack)** : lien depuis l'accueil (bloc « Par où commencer » vers le pilier) ; vérifier que les 5 satellites et le hub renvoient vers lui avec l'ancre « comment devenir drôle ».
- **J7 à J14 (@copywriter, GO Thomas)** : réponse en 40 mots en tête du pilier (« Devenir drôle s'apprend : … »), title `Comment devenir drôle : méthode en 5 piliers` (≤ 60 total), H2 conservés, FAQ et chiffres inchangés.
- **J14 à J30 (@seo)** : `exercices-developper-humour` cesse de viser « comment devenir drôle » (title sur « exercices pour développer son humour », lien vers le pilier) ; le title de l'accueil garde « répartie » et lâche « devenir drôle » seulement avec GO.
- **J30 à J90** : 5 domaines référents (S7) dont 2 pointent vers le pilier ; un article forte frappe sur un cas précis (« devenir drôle quand on est timide ») relié au pilier.
- **Succès :** pilier visible sous l'apex en 14 j ; « comment devenir drôle » pos ≤ 20 à J+60, ≤ 10 à J+120 ; objectif 12 mois : top 5. Réaliste : cette trajectoire dépend du rythme des liens entrants.

## 4. Pourquoi 16 articles sur 36 n'ont aucune impression

Le snapshot ne donne pas la liste des 16. Tests faits sur 8 articles (`timing-humour`, `erreurs-blagues`, `repartie-debutant-5-etapes`, `humour-quotidien-8-habitudes`, `timidite-et-humour`, `storytelling-drole-5-structures`, `conversation-machine-a-cafe`, `blague-courte-arme-secrete-humour`) : tous en 200, `index, follow`, canonical absolu, présents dans le sitemap, 1 300 à 2 750 mots. **Ce n'est donc pas un blocage technique.** Le sitemap et le hub listent les mêmes 35 articles (écart de 1 avec le « 36 » du snapshot : [HYPOTHÈSE : le hub est compté]). Causes probables : (1) cannibalisation (3 « répartie », 5 « raconter une blague »), (2) titles génériques sans requête exacte (« Timing humour : le secret de la blague », « Répartie débutant : 5 étapes simples »), (3) sujets sans demande propre (« rester muet en groupe », « humour après rupture »), (4) indexation partielle : Bing ne garde que 63 pages sur 384 ; pour Google [À MESURER : statut « Détectée, non indexée » dans Pages de GSC, par Thomas]. [HYPOTHÈSE : ces 8 exemples ne sont pas forcément parmi les 16.]

## 5. Les 3 actions qui feraient gagner le plus de points (par valeur)

1. **Mesurer le funnel puis brancher l'article n°1 sur le produit (S9, S10, S11).** 5 événements + bloc quiz dans l'article n°1 (51 % des visites). Gain estimé : CONVERTIR 2,6 → ~4,5 ; sans mesure, aucune autre optimisation de conversion n'est lisible. Agents : @fullstack, @data-analyst. Délai : 7 jours.
2. **Consolider le pilier et le cluster « devenir drôle » (S3, S2, S6).** Inspection GSC des 2 hôtes, lien depuis l'accueil, title et définition, fin de la cannibalisation avec `exercices-developper-humour`. Gain : S3 3 → 6, ATTIRER +0,6. Agents : @seo, @copywriter, @fullstack. Délai : 14 jours, effet sur 60 à 120 jours.
3. **Autorité : liens entrants + Bing (S7, S5).** 5 domaines référents, IndexNow en lot, 100 URL Bing par jour. Gain : S7 2 → 5, S5 7 → 8, ATTIRER +0,5 ; c'est aussi le plafond de la requête cœur. Agents : Thomas, @growth, @fullstack. Délai : 30 à 60 jours.

## Handoff

**Handoff → @orchestrator (puis @growth, @geo)**
- Fichier produit : `/home/user/Marrant/docs/seo/audit-note-s15.md`.
- Décisions : notes S1-S12 ci-dessus ; slugs conservés ; aucune règle contre les humoristes cités ; tout texte visible ajouté reste soumis au GO de Thomas.
- Points d'attention : double SEO+GEO (définitions courtes) ; la mesure du funnel est le prérequis de toute décision conversion ; inspection GSC à faire par Thomas (non accessible via API) ; e1728a5 non déployé à ce jour.
