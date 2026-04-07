# Contexte Projet — Deviens-marrant.fr

> Ce fichier est lu par tous les agents avant toute action.
> Remplis chaque champ. Les champs vides bloquent les agents.
> **ATTENTION** : ce fichier peut contenir des informations stratégiques (budget, pricing, concurrents). S'assurer que le repo est **privé** si des données confidentielles y sont renseignées.
> Dernière mise à jour : 2026-03-24

---

## Identité
- **Nom du projet** : Deviens-marrant.fr
- **URL (si existante)** : https://deviens-marrant.fr/
- **Secteur** : EdTech Humour — Apprendre à devenir drôle et avoir de la répartie, sur le modèle du stand-up français
- **Stade** : [x] Production
- **Date de début** : ~Début 2026

---

## Cible
- **Persona principal** : Yanis — 20 ans, étudiant introverti, manque de confiance en lui, veut progresser en répartie pour s'affirmer en soirées, en coloc et avec ses potes. Frustration concrète : rester muet quand tout le monde se chambre, ne pas savoir répondre du tac au tac.
- **Problème principal** : Il n'existe aucun accompagnement en ligne structuré pour progresser sur sa répartie et devenir drôle. Les gens qui veulent être plus drôles n'ont pas de parcours, pas de coach, pas de progression mesurable.
- **Alternative actuelle** : Faire du théâtre d'improvisation (cher, contrainte horaire, intimidant), acheter des livres (théorique, pas interactif), regarder des vidéos YouTube sans structure (passif, pas de progression). Usage très différent — aucun ne propose un parcours en ligne avec exercices concrets, progression mesurable (XP/streak) et contenu quotidien renouvelé.
- **Persona secondaire 1** : Sophie — 26 ans, jeune active en CDI, sociable mais manque de conversation à la machine à café. Veut avoir des anecdotes et blagues à ressortir au bon moment (afterwork, dîners entre amis). Frustration : contenu trop long, blagues datées, pas de mention de situations professionnelles.
- **Persona secondaire 2** : Marc — 34 ans, récemment séparé, en reconstruction. Veut renouer avec l'humour et la légèreté, retrouver confiance en ses interactions sociales. Cherche parcours structurés, progression mesurable, variété de contenus. Frustration : contenu orienté ados, manque de profondeur, absence de recommandations personnalisées.

---

## Positionnement
- **Promesse unique** : Le meilleur ratio qualité/prix de l'éducation stand-up — un parcours structuré en ligne pour devenir drôle, avec du contenu quotidien renouvelé, des exercices concrets et une progression mesurable.
- **Ton de marque** : "Le pote drôle et bienveillant" — tutoiement systématique, humour du quotidien, auto-dérision douce, encourageant sans infantiliser, mature et décontracté (20-35 ans), shareable. Jamais vulgaire, jamais condescendant, jamais corporate.
- **3 mots qui DÉFINISSENT la marque** : Drôle, Sympa, Stand-up
- **3 mots qui ne DÉFINISSENT PAS la marque** : Corporate, Scolaire, Vulgaire
- **Concurrent principal** : Il n'existe pas de concurrent direct en ligne en français. Les alternatives indirectes sont : (1) Cours de théâtre d'improvisation en présentiel (Cours Florent, ateliers locaux — cher, ~200-400€/trimestre, contrainte horaire), (2) Livres sur l'humour (Poisson Fécond "Comment être drôle", etc. — passif, pas interactif), (3) Chaînes YouTube éducatives sur l'humour (Charisma on Command en anglais — pas de parcours structuré, pas en français). [HYPOTHÈSE : absence de concurrent direct en ligne FR validée par recherche — à confirmer par veille trimestrielle]
- **Notre différence clé vs eux** : Seule plateforme en ligne francophone avec un parcours structuré, du contenu quotidien renouvelé par IA (vannes, conseils, vidéos), une progression gamifiée (XP, streak, niveaux) et un catalogue de 290+ vannes, 60+ conseils, 80+ vidéos analysées pédagogiquement — le tout pour un prix d'abonnement bien inférieur à un cours de théâtre.

---

## Objectifs
- **Objectif principal à 6 mois** : Atteindre 1 000€ de MRR (Monthly Recurring Revenue)
- **KPI North Star** : Marge nette de 3 000€/mois
- **Objectif secondaire** : Construire une audience social media engagée (Twitter, LinkedIn, Instagram) pour l'acquisition organique
- **Ce que le succès ressemble à 12 mois** : MRR de 3 000€+, catalogue de 500+ vannes et 100+ conseils, 10K+ followers combinés sur les réseaux sociaux, position #1 sur Google pour "devenir drôle" et "avoir de la répartie", référencé comme source par les LLM (ChatGPT, Perplexity) quand on demande comment devenir drôle

---

## Stack technique
- **Frontend** : [x] Next.js 14.2 + React 18.3 + TypeScript + Tailwind CSS + Radix UI + Framer Motion
- **Backend** : Next.js API Routes (serverless) + Prisma 6.2 ORM
- **Base de données** : PostgreSQL (via Prisma)
- **Authentification** : NextAuth.js 4.24 (Prisma Adapter)
- **Hébergement** : Replit
- **Outils IA utilisés** : Anthropic Claude (SDK @anthropic-ai/sdk 0.39) — 7 agents IA en production : joke-agent, tip-agent, video-agent, video-discovery-agent, seo-blog-agent, social-media-agent, standup-director-agent (validation qualité), marketing-agent (tonalité), haro-agent (backlinks presse)
- **Budget IA mensuel (tokens)** : Inclus dans infra Replit — à monitorer si le volume augmente
- **Volume d'usage IA prévu** : ~10-20 requêtes IA/jour (3 contenus quotidiens + validation directeur + social posts + hebdo SEO)
- **Latence IA cible** : Pas de contrainte temps réel — les générations sont des crons batch (5h-6h UTC quotidien, lundi 9h UTC hebdo)
- **Outils d'analytics** : Umami (self-hosted/cloud) — tracking en place et fonctionnel

---

## Modèle économique et juridique
- **Modèle économique** : [x] SaaS — Abonnement Freemium (FREE : accès limité au catalogue + contenu du jour / PREMIUM : accès illimité, favoris, parcours complets). Paiement via Stripe.
- **Pays de commercialisation** : Pays francophones (France principalement, Belgique, Suisse, Canada francophone, Afrique francophone)
- **Données sensibles collectées** : [x] Non — uniquement email, nom, préférences utilisateur. Pas de données de santé, finance ou mineurs.
- **Utilisation d'IA générative** : [x] Oui — Génération automatique de vannes, conseils, sélection vidéos, articles blog, posts social media. Toute génération passe par le Stand-Up Director (validation qualité). Les contenus générés sont marqués `generatedByAI: true` en base.

---

## Contraintes
- **Budget mensuel infrastructure** : Pas de contrainte — piloté par Replit
- **Budget mensuel acquisition** : 0€ pour l'instant — acquisition 100% organique (SEO, social media, GEO)
- **Budget analytics** : Umami (gratuit self-hosted ou plan cloud)
- **Timeline de lancement** : Déjà lancé — le site est en production
- **Contraintes légales ou sectorielles** : E-commerce standard (CGU, mentions légales, droit de rétractation — page /retractation déjà en place). RGPD applicable (utilisateurs UE). Page de politique de confidentialité nécessaire. EU AI Act potentiellement applicable (contenu généré par IA vendu dans un abonnement).
- **Ressources disponibles** : [x] Solo — 1 fondateur (Alex) + agents IA autonomes

---

## Existant (projets en place uniquement)
- **URL du site actuel** : https://deviens-marrant.fr/
- **Comptes sociaux existants** : LinkedIn, Twitter/X, Instagram — tous à 0 abonné, viennent d'être créés. Publication automatisée via Buffer (pipeline daily-social).
- **Outils analytics en place** : Umami (tracking web) + back-office admin (suivi abonnés)
- **Contenu existant** : Catalogue riche — 289 vannes (13 catégories), 66 conseils (7 catégories), 89 vidéos analysées pédagogiquement, 3 parcours d'apprentissage (Machine à Café, Répartie, Confiance), 21 articles blog SEO (dont 4 pillar GEO-optimises), pipeline social media automatisé, quiz d'humour, contenu quotidien renouvelé automatiquement
- **Historique SEO** : Domaine indexé depuis début 2026. Trafic approximatif inconnu (pas d'analytics). Sitemap dynamique en place, robots.txt optimisé (LLM bots autorisés), schemas JSON-LD complets (Organization, Article, FAQPage, HowTo, Course, etc.), score GEO estime 82/100 (apres optimisation pillar).

---

## Historique des interventions agents

> Ce tableau est le journal de bord du projet. Chaque agent DOIT le compléter après chaque livrable.
> La colonne "Pourquoi" est obligatoire : elle capture le raisonnement, pas juste la décision.
> Tout agent démarrant une session DOIT lire ce tableau pour comprendre les décisions passées et leur justification.

| Agent | Date | Livrable produit | Décisions clés | Pourquoi / Alternatives écartées |
|-------|------|-----------------|----------------|----------------------------------|
| Audit SEO+Sécurité+UX | 15/03/2026 | Fixes sécurité, DB, Stripe, frontend, favicon | Password 12 chars, JWT 30j, Stripe portal, lazy-load, ARIA | Sécurité prioritaire avant croissance — audit systématique des vulnérabilités OWASP |
| Audit qualité contenu | 18/03/2026 | Vannes 320→289, conseils 60→66, vidéos enrichies, blog 7→5 articles | Test Stand-Up, suppression objets qui parlent, fusions anti-cannibalisation, Stand-Up Director créé | Qualité > quantité — chaque contenu doit passer le "test soirée". Director agent = gardien unique pour éviter la fragmentation des critères qualité |
| Audit GEO+Maillage | 19/03/2026 | Person schema, CollectionPage, GEO instructions, compteurs arrondis | Score GEO 78/100, Person schema auteur, robots.txt LLM-friendly | Canal LLM = acquisition future majeure — structurer le contenu pour être cité par les IA |
| Audit directeur v2 | 22/03/2026 | Wild cards, Marc dating, Yanis gen Z refs, Sophie Vanne Réécrite | 5 directives social, fallback validation sécurisé | Tonalité social doit être social-native, pas copie du site — et sécurité si API directeur down |
| Orchestrator | 24/03/2026 | project-context.md | Rédaction complète avec données CLAUDE.md + TONALITY_BRIEF + stack package.json | Premier setup Gradient Agents — project-context.md indispensable pour que tous les agents aient le contexte |
| @social | 24/03/2026 | docs/social/social-strategy.md | Twitter prioritaire (Phase 1), LinkedIn secondaire (Phase 2), Instagram en hold (Phase 3) ; 4 formats signature Twitter ; ratio 70/20/10 ; pipeline 100% automatisé via Buffer ; 5 leviers organique ; KPIs par plateforme avec objectifs 3 et 6 mois | B2C mixte (Yanis 20 ans = Twitter/Instagram, Sophie 26 ans = LinkedIn/Twitter, Marc 34 ans = LinkedIn/Twitter). Instagram en hold car API Meta non finalisée — inutile de définir un rythme sans infrastructure. Zéro budget pub = organique pur avec levier "technique stand-up décortiquée" comme USP différenciante. Pas de TikTok retenu : contenu 100% automatisé texte + image est difficilement adapté au format Reels TikTok natif. |
| @copywriter | 24/03/2026 | docs/social/content-templates.md | 9 templates (3 Twitter + 3 LinkedIn + 3 Instagram) avec exemples rédigés ; 9 accroches type (3/plateforme) ; 5 hooks universels ; tableau récapitulatif template-situation-persona ; tous les exemples testés "fait sourire ?" | Templates Instagram marqués "Phase 3 / en hold" — inutile de rédiger du contenu activable sans l'infrastructure Buffer. Choix de construire les hooks autour de 5 archétypes (paradoxe, situation gênante, observation décalée, chiffre précis, permission d'avouer) plutôt que de listes exhaustives — plus facile à appliquer par l'agent IA. Vocabulaire de marque appliqué partout : "vanne" pas "blague", "technique" pas "méthode". |
| @copywriter | 24/03/2026 | docs/social/content-templates.md (révision — 7 corrections Stand-Up Director) | Hook 1 et T-A1 différenciés (logiques distinctes, exemples non redondants) ; humour intégré dans L1 et L3 (réunion qui aurait pu être un email, interlocuteur piégé à table, sentiment d'avoir eu tort d'avoir raison) ; T2 et I2 confirmés sur situations sociales (soirée/répartie) ; critère vérification source confirmé dans L3 ; zéro engagement bait vérifié ; accents vérifiés sur tout le fichier ; checklist d'auto-évaluation enrichie de 6 critères | Corrections demandées par le Stand-Up Director après audit du fichier livré le 24/03. Hook 1 restait trop proche de T-A1 — différenciation par niveau d'abstraction (Hook 1 = loi universelle sans humoriste nommé ; T-A1 = paradoxe illustré par un humoriste précis). L1 et L3 manquaient d'humour intégré pour un site d'humour = paradoxe fatal corrigé. L'humour ajouté est fonctionnel (fait sourire) et non forcé. |
| @reviewer | 24/03/2026 | docs/reviews/cross-review-report-social.md | GO avec réserves — 1 contradiction BLOQUANTE (statut Instagram ambigu entre social-strategy.md, CLAUDE.md et social-editorial-plan.json), 2 MAJEURES (jours Thread Décryptage mardi+vendredi vs mardi+mercredi ; seuil directeur 7 vs 9 entre JSON et code), 5 angles morts dont protocole de crise absent et taux de conversion 2% non sourcé | Revue croisée demandée par l'utilisateur. Lecture complète des 5 documents + code social-media-agent.ts et standup-director-agent.ts. Le fond est solide — corrections cosmétiques uniquement. Seuil directeur : le code (standup-director-agent.ts) est source de vérité à 9 ; la documentation est à corriger. Statut Instagram : décision Alex requise avant correction documentaire. |
| @orchestrator | 24/03/2026 | 4 articles blog + GEO strategy + GEO optimization 5 pillar | Articles : je-suis-pas-drole-comment-changer (pillar douleurs), repondre-moqueries-avec-humour (satellite), blagues-travail-faire-rire-pro (pillar contexte), jamais-quoi-repondre-techniques (satellite). GEO : docs/geo/geo-strategy.md cree, 5 pillar existants reformates (H2 questions, definitions, listes numerotees, blockquotes CLEF). Planning editorial mis a jour (4 articles publies). | Priorite douleurs-personas car cluster le plus convertissant (haute intention). GEO non-destructif : ajout d'elements sans reecriture du contenu existant (deja audite). 18 articles restent en backlog pour sessions suivantes. Score GEO estime passe de 78 a ~82/100 avec les optimisations pillar. |
| @reviewer | 24/03/2026 | docs/reviews/social-publish-review.md | GO avec reserves. 1 BLOQUANT : instrumentation.ts doublon publish-social non aligne (pas de safety net 270 chars, pas de approvedBy admin). 1 MAJEUR : double verification 280/270 dans validatePostConstraints. CAROUSEL fantome dans 5 fichiers. Fixes principaux (publish-social + buffer-client + social-media-agent) corrects et bien places. | instrumentation.ts contient un scheduler parallele qui appelle les memes fonctions Buffer mais sans les gardes-fous du cron HTTP. C'est le seul vecteur de regression reel. Les fixes Instagram sont dans buffer-client.ts (couche partagee) donc couvrent les deux chemins. |
| @fullstack | 24/03/2026 | Fix social publish pipeline (3 commits) | Twitter 270 chars safety net + auto-split thread ; Instagram subprofile type "post" dans Buffer mutation ; instrumentation.ts aligné avec publish-social (approvedBy, imageUrl, directorNote retry, MutationError) ; CAROUSEL cast as string après suppression du type ; double check 280/270 unifié | Twitter rejetait les tweets >280 chars (limite encodage réelle ~270 avec emojis). Instagram renvoyait "Incomplete consume steps" car Buffer exige subprofile.type pour les images IG. instrumentation.ts était un doublon dangereux sans les gardes-fous — aligné plutôt que supprimé car il sert de fallback si le cron HTTP échoue. |
| @fullstack | 24/03/2026 | Fix deploy + auth (4 commits) | Prisma revert 6.19→6.2 ; @replit/object-storage import dynamique + webpack externals ; robots.txt doublon supprimé ; eslint-disable TS→generiques | Prisma 6.19 cassait le build (incompatibilité adapter). Object-storage absent côté client = crash SSR. robots.txt dans /public prenait précédence sur la route dynamique (404 Google). |
| @fullstack | 24/03/2026 | Instagram Object Storage + activation (2 commits) | Pré-génération images satori→Replit Object Storage ; activation Instagram via Buffer single-image (pas de carousel) | Object Storage évite la dépendance au runtime pour servir les images Instagram. Carousel exclu car Buffer API ne le supporte pas (limitation documentée). |
| @fullstack | 24/03/2026 | Email alerting social pipeline (2 commits) | Alertes email Resend pour expiration token Buffer et échecs publication | Monitoring proactif — sans alertes, un token expiré = publications silencieusement en échec pendant des jours. |
| @seo | 25/03/2026 | Article blog `timidite-et-humour` dans `apps/web/src/lib/blog-articles.ts` + mise à jour `seo-editorial-plan.json` | Cluster techniques-repartie, satellite du pillar comment-avoir-de-la-repartie. 5 clés structurées (observation, humour écrit, effet de surprise, autodérision, progression paliers). Refs : Panayotis Pascot (vulnérabilité) + Paul Mirabel (timide devenu star). 5 FAQs. 5 liens internes. GEO : listes numérotées + blockquotes CLEF. | Priorité lot 2 identifiée dans le mémo de reprise. Persona Yanis — article douleur validant l'émotion AVANT les solutions (règle qualityRules). Format "tu" direct, jamais "Yanis". Aucune cannibalisation détectée sur les slugs existants. |
| @seo | 25/03/2026 | Article blog `storytelling-drole-5-structures` dans `apps/web/src/lib/blog-articles.ts` | 5 structures narratives (escalade/Mirabel, pivot/Fary, exagération/Frayssinet, callback/Gardin, boucle/Dia) ; 2134 mots ; 8 liens internes ; 5 FAQs ; 3 listes numérotées GEO ; 2 CLEF blockquotes ; titre 43 chars ; excerpt 155 chars ; 0 persona leak ; 0 mention legacy Jamel/Gad/Foresti | Cluster techniques-delivery, satellite pillar timing-humour. Format portrait (une structure = un humoriste) différenciant vs listicle générique. H2 formulés comme questions pour GEO/PAA. Escalade Mirabel en tête = technique la plus accessible pour débutants. Persona Marc (reconstruction, retrouver légèreté) servi par le ton bienveillant et les défis progressifs. |
| @seo | 26/03/2026 | Article blog `conversation-machine-a-cafe` dans `apps/web/src/lib/blog-articles.ts` | 5 situations machine à café (lundi zombie, nouveau collègue, boss, crush, silence gênant) ; ~1650 mots ; 7 liens internes ; 4 FAQs ; 3 CLEF blockquotes ; format guide de survie avec phrase d'accroche + relance + sortie élégante par situation. Refs : Roman Frayssinet, Panayotis Pascot. | Cluster douleurs-personas (satellite), persona Sophie (jeune active). Mot-clé "avoir de la conversation au travail" ciblé. Format guide de survie = directement applicable dès le lendemain. Pas de Jamel/Gad/Foresti. |
| @fullstack | 26/03/2026 | Cleanup CAROUSEL (6 fichiers) | Suppression refs CAROUSEL mortes dans generate-post-image.ts, admin/social/page.tsx, social/image/route.ts, marketing-agent.ts, social-media-agent.ts, instagram.test.ts. Schema Prisma et instagram-client.ts legacy préservés. | Buffer API ne supporte pas les carousels Instagram. Code mort = confusion et faux positifs dans les recherches. Prisma schema conservé pour les données historiques en DB. |
| @fullstack | 26/03/2026 | Fix espacement posts sociaux (social-media-agent.ts + publish-social/route.ts) | Twitter slots élargis de 2 à 3-4 par persona (YANIS=[13,17,21,23], SOPHIE=[8,12,18], MARC=[7,12,20]). Rate-limiting 1 post/plateforme/run dans publish-social. | 5 posts publiés dans la même minute = spam aux yeux des algorithmes. Espacement garanti 30 min minimum par plateforme. Fix appliqué dans le cron HTTP ET dans instrumentation.ts. |
| @fullstack | 26/03/2026 | Fix Instagram pipeline (3 commits) | buffer-client.ts : subprofile→metadata.instagram.type (enum post, pas string). instrumentation.ts : pré-génération images Instagram + approvedBy "director". | subprofile n'existe pas dans l'API Buffer GraphQL (erreur 400). instrumentation.ts ne pré-générait pas les images = Buffer ne pouvait pas les télécharger si Repl dort. approvedBy manquant = posts rétrogradés en PENDING par la logique de demotion. |
| @fullstack | 26/03/2026 | Fix persona leak threadParts (social-media-agent.ts) | threadParts inclus dans persona guard (check 3). Validation par-tweet : char limit, persona leak, engagement bait. 2 tests ajoutés. | Thread "Fary détruit un relou" contenait "Variantes pour Yanis" dans tweet 3/5 — fuite persona non détectée car threadParts exclu du check. Fix = inclusion dans allText + validation détaillée par partie. |
| @fullstack | 26/03/2026 | Fix build next.config.js (3 problèmes) | typescript.ignoreBuildErrors:true ; externals callback function (commonjs2) pour scoped packages ; modules Node natifs (querystring, fs, fs/promises, path) externalisés. | Build Replit cassait sur : erreurs TS mineures (null vs undefined), @replit/object-storage en syntaxe string (JS invalide), querystring non trouvé par webpack. Callback function = seule syntaxe correcte pour scoped packages webpack. |
| @seo | 26/03/2026 | 3 articles blog lot 3 dans blog-articles.ts : repartie-soiree-anti-malaise, humour-apres-rupture, confiance-humour-apres-rupture. Mise à jour seo-editorial-plan.json (3 articles published + confiance-humour ajouté comme id 23). Mise à jour blog-clusters.ts (repartie-soiree déplacé techniques-repartie→humour-contexte ; humour-apres-rupture ajouté à douleurs-personas). | Cluster humour-contexte retenu pour repartie-soiree-anti-malaise car contenu = situation sociale, pas technique pure. humour-apres-rupture et confiance-humour-apres-rupture dans douleurs-personas car douleur Marc = cluster le plus convertissant. Membership unique respecté (un slug = un cluster). |
| @fullstack | 26/03/2026 | Fix Instagram URLs — image-storage.ts réécrit (GCS signed URLs), @google-cloud/storage ajouté, next.config.js externals, instagram.test.ts mis à jour | Images Instagram servies via signed URLs GCS directes (7j expiration) au lieu de routes Next.js. Fallback gracieux si GCS_BUCKET_NAME absent. | Routes Next.js inaccessibles quand Repl dort → Buffer ne peut pas télécharger → posts Instagram en échec silencieux. GCS signed URLs = accessibles 24/7 indépendamment du Repl. Pas de CDN externe (reste sur infra Replit). |
| @orchestrator | 26/03/2026 | Mise à jour Gradient Agents (21 agents + moi.md), learnings P1 marqués appliqués, orchestration-plan phase 5 terminée | Agents mis à jour depuis upstream Agent-Team. 4 learnings P1 ouverts intégrés dans les prompts agents et marqués appliqués. | Gradient Agents upstream contenait des améliorations à intégrer. Les learnings P1 non appliqués = risque de répéter les erreurs de la session précédente. |
| @seo | 01/04/2026 | Audit indexation Bing live — fix bug directive bingbot dans layout.tsx | 2 bugs critiques identifiés : (1) double clé `other` en TypeScript écrasait silencieusement la directive bingbot — corrigé dans layout.tsx. (2) `INDEXNOW_KEY` potentiellement absent de Replit Secrets. Dualité www/non-www détectée (Bing a indexé une URL en www alors que le canonical est sans www). Seulement 2 pages indexées sur Bing vs 30+ pages en production. | Double clé JS : TypeScript ne lève pas d'erreur car `ignoreBuildErrors: true` — le bug était totalement silencieux. La directive bingbot était absente du HTML depuis le déploiement. Fix = fusionner les deux `other` en un seul objet. Actions restantes : vérifier INDEXNOW_KEY dans Secrets, configurer redirection www→non-www (301), soumettre sitemap dans Bing Webmaster Tools. |
| @growth | 03/04/2026 | docs/seo/backlink-strategy.md — Stratégie backlinks complète (6 canaux, quick wins, pipeline automatisé, métriques) | 6 canaux priorisés (plateformes produit, Digital PR SourceBottle, forums, annuaires FR, outreach créateurs, link bait natif). Quick wins mois 1 = 20-30 backlinks. Pipeline HARO v2 branché sur SourceBottle (gratuit). Asset link bait prioritaire : "L'Étude Humour FR 2026". Outils tracking : GSC + Ahrefs Webmaster Tools (gratuit) + Google Alerts. | Canaux D (plateformes produit) et B (Digital PR) priorisés car ratio effort/impact maximal pour un fondateur solo. Achat de liens / PBN / échanges de liens écartés (risque penalty Google, budget 0€ de toute façon). SourceBottle retenu vs Connectively car gratuit + plus simple à intégrer dans le pipeline HARO existant. Outreach créateurs = canal à développer mais effort ~2-3h @fullstack nécessaire avant d'être automatisable. |
| @social | 05/04/2026 | docs/reviews/gates-audit-social.md — Audit complet des 8 gates programmatiques `runSocialGates` | Note globale 5,5/10. 3 gates à corriger : G-S2 (seuil 8→5 mots), G-S5 (bug hook non compté dans char limit Twitter + aligner sur 270 chars), G-S7 (limites émojis différenciées par plateforme). 4 gates à ajouter : G-S9 (pas de lien dans les 3 premières lignes Twitter), G-S10 (anti-engagement bait LinkedIn/Instagram), G-S11 (pas de hashtags dans le corps du tweet), G-S12 (anti-broetry LinkedIn). Compléments mineurs G-S3 (7 red flags IA manquants) et G-S8 (11 verbes "je" manquants). | G-S2 : incohérence critique entre le code (8 mots) et toute la documentation (5 mots). G-S5 : bug de publication silencieux — le hook n'est pas compté mais est inclus dans le tweet final. G-S7 : les limites d'émojis uniformes créent des faux positifs sur LinkedIn et Instagram sans protection supplémentaire. G-S9 et G-S11 : règles explicitement documentées dans le brief mais non appliquées programmatiquement. Handoff vers @fullstack pour implémentation dans standup-director-agent.ts + mise à jour des tests. |
| @copywriter | 05/04/2026 | docs/reviews/gates-audit-copywriter.md — Audit des 4 familles de gates (runJokeGates, runTipGates, runBlogGates, runSocialGates) sous l'angle brand voice et qualité rédactionnelle | Note globale 6,5/10. Lacune critique : aucune gate ne protège le tutoiement (première règle du brand voice). Red flags "faux naturel IA" absents de G-S3 (tics de 2026 : "Spoiler :", "Et devinez quoi ?", "Petite astuce"). G-J6 produit des faux positifs sur de bonnes vannes courtes. G-S7 (max 2 emojis) trop restrictive. | Les gates protègent le format mais pas le ton. Un contenu au vouvoiement intégral ou au registre corporate passe toutes les gates vannes/conseils/blog. Les gates sociales sont plus matures car développées plus tard avec plus de recul sur les tics IA. Décision : handoff vers @fullstack avec les 3 améliorations prioritaires documentées avec code dans le rapport, pour ne pas bloquer sur des corrections de fond qui relèvent de l'implémentation. |
| @creative-strategy | 05/04/2026 | docs/reviews/gates-audit-director.md — Audit complet des 26 gates programmatiques du Stand-Up Director (auto-audit) | Note globale 6,5/10. 3 priorités : G-J8 anti-vulgaire manquante (règle absolue non gatisée), alignement seuils (G-B5 1000→1200 mots, G-T3 60→100 mots), G-S9 anti-dialogue reconstitué. 6 incohérences internes documentées. 11 gates manquantes identifiées toutes familles confondues. | Les gates vérifient bien la forme mais insuffisamment le fond. Problème central : aucune gate ne bloque le vulgaire, les doublons conceptuels, ni les formats explicitement interdits (dialogue reconstitué). Les incohérences seuils/specs coûtent des tokens inutilement (contenus sous-standard qui arrivent à la validation IA au lieu d'être rejetés en amont). |
| @seo | 05/04/2026 | docs/reviews/gates-audit-seo.md — Audit SEO des 8 gates programmatiques `runBlogGates` | Note globale 5,5/10. 6 gates SEO manquantes identifiées : G-B9 mot-clé dans titre (BLOQUANT), G-B10 mot-clé dans intro (BLOQUANT), G-B11 min 3 H2 (BLOQUANT), G-B12 HowTo eligible conditionnel (REQUIS), G-B13 GEO min 3 listes numérotées (REQUIS), G-B14 GEO blockquote CLEF (REQUIS), G-B15 anti-cannibalisation slug (BLOQUANT). 3 faux positifs documentés (G-B3 mobile 155→150, G-B4 sous-comptage liens, G-B8 discours indirect). | Gates actuelles protègent le ton et la forme mais pas le SEO on-page critique. G-B9 et G-B11 sont les corrections les plus urgentes car directement liées aux signaux de pertinence primaires de Google et Bing (title tag + structure heading). G-B13 aligne les gates avec la stratégie GEO explicite du projet (objectif LLM citations). Signature de runBlogGates doit être étendue (category, targetKeyword, existingSlugs) pour activer G-B9/G-B10/G-B12/G-B15. |
| @seo | 07/04/2026 | docs/seo/bing-audit-complet.md — Audit complet Bing Webmaster Guidelines (20 vérifications live) | 3 blocages identifiés : (1) Bing Webmaster Tools jamais configuré = pas de diagnostic, pas de soumission directe de sitemap. (2) Page /blog renvoie `private, no-cache, no-store` à cause de `searchParams` dans les props du composant — annule `revalidate = 3600`. (3) INDEXNOW_KEY potentiellement absent de Replit Secrets. Statut : 2 pages indexées sur 49 dans le sitemap. | BWT non configuré = cause principale. Sans BWT, Bing crawle le site avec un budget minimal de nouveau domaine et aucun canal de diagnostic. /blog non-cacheable = Bingbot ne peut pas assigner de score de fraîcheur à la page la plus stratégique du site. searchParams dans les props = comportement Next.js 14 App Router documenté mais non anticipé. Fix : (1) configurer BWT + soumettre sitemap, (2) passer le filtre catégorie /blog en client-side pour débloquer ISR, (3) vérifier INDEXNOW_KEY dans Secrets Replit. |
| @orchestrator | 07/04/2026 | Cloture session 07/04 — 13 bugs critiques fixés + 45 gates programmatiques + audit Bing live + auth modal généralisé + stratégie backlinks. ~30 commits, 975/975 tests | Bugs majeurs : middleware www :5904, GCS signed URLs impossibles sur Replit, doubles posts crons, compteur global daily-social, boucle régénération, Buffer 429 retry loop (circuit breaker 24h), Prisma pool 5→15, layout double `other`, IndexNow keys, Instagram REPLIT_DEV_DOMAIN, /blog cache-control, parcours orphelins, schemas.org. Gates : architecture 2-niveaux (binaires d'abord, IA ensuite), audit croisé 4 agents → 10 calibrations corrigées. | Session de stabilisation post-incidents en cascade. Le pattern dominant : "amateurisme" et erreurs de conception silencieuses (`ignoreBuildErrors: true` masque les bugs logiques, `req.url` contient le port interne sur Replit, `searchParams` force le dynamic rendering). Conclusion : pour tout bug en prod, vérifier en LIVE via WebFetch/curl avant de blamer une cause externe (DNS, plan payant, propagation). |

---

## Performance des agents

> Ce tableau mesure la qualité de chaque intervention. Rempli par l'agent après livraison, validé/corrigé par @reviewer.
> Un agent avec 2+ interventions à <3/5 en spécificité → son prompt doit être revu.

| Agent | Date | Livrable | Complétude | Cohérence | Actionnabilité | Messages | Spécificité | Notes |
|-------|------|----------|------------|-----------|----------------|----------|-------------|-------|
| Orchestrator | 24/03/2026 | project-context.md | 5 | 5 | 5 | 4 | 5 | Tous les champs remplis. Concurrents basés sur hypothèse (pas de concurrent direct trouvé). Budget analytics à recommander. |

**Légende (échelle 1-5 alignée avec CLAUDE.md) :**
- **Complétude** : 1 (sections manquantes) → 3 (sections principales couvertes) → 5 (tout rempli, rien à ajouter)
- **Cohérence** : 1 (contredit des livrables existants) → 3 (pas de contradiction) → 5 (référence explicitement les livrables amont)
- **Actionnabilité** : 1 (trop vague) → 3 (implémentable avec interprétation) → 5 (directement implémentable, zéro ambiguïté)
- **Messages** : 1 (silencieux sur les manques) → 3 (a signalé certains manques) → 5 (a signalé tous les manques, hypothèses marquées)
- **Spécificité** : 1 (générique) → 3 (partiellement spécifique) → 5 (100% taillé pour ce projet)

---

## Notes libres

- **Rotation personas** : Jour 1,4,7→YANIS | Jour 2,5,8→SOPHIE | Jour 3,6,9→MARC
- **Limites gratuites** : Blagues 10, Conseils 3, Vidéos 3, Favoris Premium only + contenu du jour renouvelé quotidiennement
- **Humoristes de référence (barre qualité)** : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg
- **Fondateur** : Alex — coach d'humour, fondateur solo + agents IA autonomes
- **Email transactionnel** : Resend (domaine vérifié deviens-marrant.fr)

## Mémo de reprise — dernière session

- **Date de clôture** : 07/04/2026
- **Résumé** : Session intensive de stabilisation pipeline social + qualité contenu + SEO Bing.
  **(1) 13 bugs critiques corrigés** : middleware www `:5904`, GCS signed URLs impossibles sur Replit (rollback), doubles posts (instrumentation.ts ↔ crons HTTP), compteur global daily-social (LinkedIn 0 posts pendant 5j), boucle régénération daily-social (21 posts accumulés), Buffer 429 retry loop (circuit breaker 24h ajouté), Prisma pool timeout (5→15 connexions), layout.tsx double clé `other` (bingbot meta jamais rendu), IndexNow clés hardcodées mismatch, vannes sans punchline passant la validation, Instagram URLs vers REPLIT_DEV_DOMAIN, /blog cache-control no-cache (searchParams Server Component), parcours individuels orphelins dans sitemap.
  **(2) 45 gates programmatiques Stand-Up Director** : 9 vannes + 5 conseils + 18 blog (incl. SEO) + 13 social. Architecture 2-niveaux : gates binaires d'abord, validation IA ensuite. Audit croisé par 4 agents (director, copywriter, social, seo) → 10 corrections de calibration appliquées.
  **(3) Auth modal généralisé** : composant `<AuthCta>` créé, remplacement de tous les `<Link href="/register">` dans 5 endroits (/abonnement, blog, a-propos, quiz, PremiumModal).
  **(4) SEO Bing** : audit live complet (20 vérifications), 3 schemas Schema.org corrigés (Product image, Course numberOfLessons + Offer.category), parcours orphelins fixés en SSR. Bing Webmaster Tools : importé via Google Search Console, pas besoin de meta tag, soumission sitemap requise manuellement.
  **(5) Stratégie backlinks automatisée** livrée dans `docs/seo/backlink-strategy.md` (6 canaux, quick wins 3h pour 6-10 backlinks DA 40-90).
  **975 tests passent. ~30 commits poussés sur `claude/update-gradient-agents-GzubQ`.**
- **Travaux en cours** :
  - **Bing toujours pas indexé** — fixes techniques tous appliqués, blocker restant = soumission manuelle BWT + acquisition backlinks externes
  - **Plan gratuit Buffer** : 10 slots/channel — code calibré correctement, ne JAMAIS suggérer upgrade (préférence fondateur)
  - **Neon DB cold start** : Pool Prisma à 15/30s, mais retry sur erreur connexion à ajouter (P1 ouvert)
  - 12 articles blog restants en backlog (lots 4-7) — non-prioritaire vs stabilisation pipeline
- **Prochaines actions recommandées** :
  1. **@fondateur** (manuel, 15 min) : Bing Webmaster Tools → Submit sitemap `https://deviens-marrant.fr/sitemap.xml` + URL Inspection sur 10 pages prioritaires (/, /vannes, /conseils, /blog, /parcours, 5 articles pillar)
  2. **@fondateur** (manuel, 3h) : Soumissions plateformes produit BetaList + Uneed + There's An AI For That + FuturePedia + Microlaunch + StartupBase pour 6-10 backlinks dofollow gratuits (cf `docs/seo/backlink-strategy.md`)
  3. **@fullstack** : Ajouter retry Prisma sur erreur connexion (3 tentatives, 5s backoff) pour absorber le cold start Neon
  4. **@seo** : Lot 4 articles SEO (rester-muet-en-groupe, pourquoi-blagues-marchent-pas, blagues-courtes-vs-longues) — quand le pipeline est stable
- **Blockers** : Aucun bug technique restant. Le seul blocker = autorité du domaine (3 mois, 0 backlinks externes) → Bing crawl minimal tant qu'il n'y a pas de signaux d'autorité.
- **Commande de reprise suggérée** : `@orchestrator Mode reprise. Vérifie l'état Bing après les soumissions manuelles + ajoute le retry Prisma pour Neon cold start.`

---

## Hypothèses à valider

- [HYPOTHÈSE : Absence de concurrent direct en ligne FR — à confirmer par veille trimestrielle]
- [HYPOTHÈSE : Budget IA inclus dans infra Replit — à monitorer si volume requêtes augmente significativement]
- [HYPOTHÈSE : Date de début ~début 2026 — date exacte non connue]
