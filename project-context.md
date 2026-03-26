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

- **Date de clôture** : 26/03/2026
- **Résumé** : Session couvrant 3 volets : (1) SEO lot 2 terminé — 3 articles publiés (storytelling-drole, timidite-et-humour, conversation-machine-a-cafe) avec validation Director manuelle, (2) Social fixes majeurs — espacement posts (3-4 slots Twitter, 1 post/plateforme/run), pipeline Instagram réparé (metadata.instagram.type, pré-gen images, approvedBy), persona leak threadParts corrigé, (3) Stabilisation build — CAROUSEL cleanup 6 fichiers, next.config.js 3 fixes (TS errors, scoped externals, Node natifs). 960/961 tests passent. 13 commits pushés.
- **Travaux en cours** :
  - 15 articles blog restants en backlog (lots 3-7 dans orchestration-plan.md) — prochaine priorité : lot 3 (repartie-soiree-anti-malaise, humour-apres-rupture, confiance-humour-apres-rupture)
  - Score GEO ~82/100, objectif 90 — les nouveaux articles sont GEO-optimisés à la rédaction
  - CAROUSEL cleanup terminé
  - **Risque Instagram** : URLs images dépendantes du Repl actif (routes Next.js). Fix long terme nécessaire : CDN externe ou URLs Object Storage directes
- **Prochaines actions recommandées** :
  1. **@seo** : Produire lot 3 articles (repartie-soiree-anti-malaise, humour-apres-rupture, confiance-humour-apres-rupture) — cluster douleurs-personas + humour-contexte
  2. **@infrastructure** : Résoudre le risque URLs images Instagram — migrer vers URLs Object Storage directes ou CDN externe (Cloudflare R2 gratuit) pour que Buffer accède aux images même quand le Repl dort
  3. **@fullstack** : Vérifier que `BUFFER_CHANNEL_INSTAGRAM` est configuré dans Secrets Replit et qu'un post Instagram passe effectivement (test end-to-end)
- **Blockers** : Vérification manuelle requise côté Replit : (1) secret BUFFER_CHANNEL_INSTAGRAM présent ? (2) Repl "Always On" activé ? Sans ça, Instagram reste cassé malgré les fixes code.
- **Commande de reprise suggérée** : `@orchestrator Reprends le plan SEO/GEO sprint. Phase 4 terminée (lot 2 articles + social fixes). Produis le lot 3 d'articles (repartie-soiree-anti-malaise, humour-apres-rupture, confiance-humour-apres-rupture) et résous le risque URLs images Instagram (CDN ou Object Storage direct).`

---

## Hypothèses à valider

- [HYPOTHÈSE : Absence de concurrent direct en ligne FR — à confirmer par veille trimestrielle]
- [HYPOTHÈSE : Budget IA inclus dans infra Replit — à monitorer si volume requêtes augmente significativement]
- [HYPOTHÈSE : Date de début ~début 2026 — date exacte non connue]
