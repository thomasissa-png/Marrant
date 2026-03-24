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
- **Outils d'analytics** : Aucun en place — à recommander

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
- **Budget analytics** : À recommander
- **Timeline de lancement** : Déjà lancé — le site est en production
- **Contraintes légales ou sectorielles** : E-commerce standard (CGU, mentions légales, droit de rétractation — page /retractation déjà en place). RGPD applicable (utilisateurs UE). Page de politique de confidentialité nécessaire. EU AI Act potentiellement applicable (contenu généré par IA vendu dans un abonnement).
- **Ressources disponibles** : [x] Solo — 1 fondateur (Alex) + agents IA autonomes

---

## Existant (projets en place uniquement)
- **URL du site actuel** : https://deviens-marrant.fr/
- **Comptes sociaux existants** : LinkedIn, Twitter/X, Instagram — tous à 0 abonné, viennent d'être créés. Publication automatisée via Buffer (pipeline daily-social).
- **Outils analytics en place** : Aucun
- **Contenu existant** : Catalogue riche — 289 vannes (13 catégories), 66 conseils (7 catégories), 89 vidéos analysées pédagogiquement, 3 parcours d'apprentissage (Machine à Café, Répartie, Confiance), 5+ articles blog SEO, pipeline social media automatisé, quiz d'humour, contenu quotidien renouvelé automatiquement
- **Historique SEO** : Domaine indexé depuis début 2026. Trafic approximatif inconnu (pas d'analytics). Sitemap dynamique en place, robots.txt optimisé (LLM bots autorisés), schemas JSON-LD complets (Organization, Article, FAQPage, HowTo, Course, etc.), score GEO estimé 78/100.

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

## Hypothèses à valider

- [HYPOTHÈSE : Absence de concurrent direct en ligne FR — à confirmer par veille trimestrielle]
- [HYPOTHÈSE : Budget IA inclus dans infra Replit — à monitorer si volume requêtes augmente significativement]
- [HYPOTHÈSE : Date de début ~début 2026 — date exacte non connue]
