# Audit global — deviens-marrant.fr — Session 11 (2026-09-29)

> **Consolidation** de 6 audits (SEO, GEO, contenus, UX, growth, infra) produits en s11.
> **Corrections orchestrateur** appliquées : la prod NE tourne PAS sur master s7 — plusieurs findings amont sont reclassés.
> **Destinataire** : Thomas (fondateur solo).
> **Mode** : lecture seule, zéro code touché ici.

---

## 1. TL;DR fondateur

**Est-ce qu'on progresse ?** Oui sur le contenu et le code (blog ×2, catalogue 600+, pivot pédagogique s10 déployé en prod). Non sur la traction : trafic organique file sans trace, 0 backlink, 0 abonné social, et la génération IA de nouveaux contenus est **à l'arrêt depuis mi-juin**. Le site est meilleur qu'il y a 4 mois, mais il ne pousse plus.

**Les 3 vrais problèmes :**
1. **La machine à contenu est en panne depuis 3,5 mois** — dernière vanne, dernier conseil et dernier article blog datent du 9-15 juin 2026. Diagnostic urgent (crédits Anthropic ? cron Replit ? scheduler ?).
2. **Le catalogue est sous-vendu partout** — 602 vannes / 400 conseils / 89 vidéos en base, mais le site affiche "290+", project-context dit "265". Personne (ni les visiteurs, ni les LLM, ni Google) ne sait ce qu'il y a vraiment dedans.
3. **Le funnel est troué à chaque étape** — 0 capture email sur le blog, CTA prix cash sur trafic froid, quiz en cul-de-sac, onboarding orphelin, cannibalisation SEO. Le trafic qui arrive ne se transforme jamais.

**Scores par domaine vs mesure précédente :**

| Domaine | s11 | Ref | Δ | Preuve courte |
|---|---|---|---|---|
| SEO | 55/100 | 50/100 (s10) | ↑ | Blog 21→42 articles, mais P0 s10 non appliqués |
| GEO | 54/100 | 82/100 estimé (mars) | ↓ | Rubrique élargie : entity confidence + off-site (nouveaux gaps découverts) |
| Contenus | 6.5/10 | — | = | Premier audit — baseline |
| UX/Funnel | 41/100 | — | = | Premier audit — baseline |
| Infra/Tech | 52/100 | — | ↓ | Gouvernance git cassée + monitoring zéro + génération IA muette |
| Growth | Stase | — | = | 0 backlink, 0 abonné, QW1-QW5 jamais exécutés |

**Verdict global : GO CONDITIONNEL** sur les corrections agents autonomes (fixes courts, forte valeur). **NO-GO nouveaux chantiers** tant que la génération IA n'est pas redémarrée et les chiffres catalogue alignés.

---

## 2. Top 10 des trous — priorisés, dédoublonnés

| # | ID | Trou | Preuve | Impact | Fix | Agent | Bloqueur |
|---|---|---|---|---|---|---|---|
| 1 | GEN-01 | **Génération IA à l'arrêt depuis mi-juin** | `/api/jokes` tri desc : dernière vanne 2026-06-15. `/api/tips` : dernier conseil 2026-06-15. Sitemap blog : dernier lastmod 2026-06-09. Vanne du jour 29/09 = créée 26/03, sans décryptage | 3,5 mois sans nouveau contenu = signal fraîcheur mort côté SEO/GEO (+28% citations LLM à contenu <2 mois perdus), pipeline social alimenté à vide, promesse "nouveaux contenus chaque semaine" fausse | Diagnostic Replit (logs `LlmUsageLog`, crédits Anthropic, cron scheduler, deployment en veille) puis relance | @infrastructure diag → @ia fix | **Thomas** (accès Replit logs + secrets) |
| 2 | CAT-01 | **Chiffres catalogue faux partout** | `/api/content-stats` = 602 jokes / 400 tips / 89 vidéos. `/api/jokes` = `totalReal:636`. Site home + /vannes = "290+ vannes". project-context.md = "265 vannes actives". Écart 602 vs 636 = anomalie soft-delete | Sous-annonce systémique de la valeur (site vend 45% du stock réel), incohérence base ↔ compteur ↔ doc interne, promesse dépréciée | (a) Aligner compteur dynamique sur `active=true` (b) mettre à jour home + vannes vers "600+ vannes" (c) expliquer 636 vs 602 (d) corriger project-context | @fullstack + @copywriter | Aucun — autonome |
| 3 | GIT-01 | **Gouvernance git cassée** | `origin/master` = commit `88bb582` clôture s7 (mars). Default branch GitHub = `claude/init-project-setup-jcI9q` (11/03). Prod Replit sert du code **plus récent que master** (routes /admin/ceo, /api/unsubscribe, /api/cron/ceo-tick présentes en prod, absentes de origin/master). CI `.github/workflows/tests.yml` cible `[main]` — branche inexistante | Impossible de savoir quel commit tourne en prod, CI ne s'exécute jamais, filet de sécurité zéro, futures PR partent d'une branche morte | (a) Identifier le commit Replit servi (b) fast-forward master vers ce commit (c) default branch GitHub → master (d) CI cible master (e) tag `v-prod-s11` | Thomas (a→d) + @infrastructure (e) | **Thomas** (droits GitHub + Replit) |
| 4 | TW-01 | **twitter:image = 404** | `curl -I https://deviens-marrant.fr/og-image.png` → 404. `/opengraph-image` → 200. HTML home : `twitter:image` pointe le PNG statique manquant | Toutes les cartes Twitter/X cassées, 0 engagement partage social | Créer `/public/og-image.png` 1200×630 OU faire pointer `twitter:image` vers `/opengraph-image` dynamique | @fullstack | Aucun (30 min) |
| 5 | IA-01 | **Mention "générés par IA" sur la home** | home : `"✓ Nouveaux contenus chaque semaine générés par IA"`. founder-preferences 06/05/2026 (P0) : `"Mention IA = JAMAIS dans le contenu, JAMAIS en signature — règle PERMANENTE"` | Violation directe règle fondateur permanente, contradiction voix "pote naturel" | Remplacer par `"Nouveaux contenus chaque semaine"` (retirer suffixe) | @fullstack (1 ligne) | Aucun |
| 6 | CAN-01 | **Cannibalisation blog : 8 paires indexées** | Sitemap live 29/09 : 8 paires d'URLs distinctes couvrent la même intention (rester-muet, quoi répondre, timing, raconter blague, jeux de mots, humour rupture, blagues courtes, apprendre répartie). Aucune canonical | 16 pages se disputent 8 intentions → autorité SEO divisée par ~2 sur chaque cible pillar | Arbitrer paire par paire : fusion ou 301. Ajouter check anti-cannibalisation dans le prompt seo-blog-agent | @seo (arbitrage) + @copywriter (fusion) + @fullstack (301) | Aucun |
| 7 | UX-01 | **Aucune capture email sur le blog** | 42 articles, 0 formulaire newsletter, 0 lead magnet, 0 pop-up exit-intent | 95%+ trafic SEO file sans trace, zéro base pour relancer, Resend câblé mais silo muet | Bloc "Reçois 1 technique/semaine" inline article + exit-intent | @copywriter (copy) + @fullstack (composant) | Aucun |
| 8 | LT-01 | **Zéro URL individuelle catalogue** | `/vannes/1` = 404, `/conseils/1` = 404, `/videos/1` = 404. 602+400+89 = **1 091 pages longue traîne manquantes** | Le plus gros gisement SEO/GEO du site, invisible : "vanne sur [thème]", "conseil humour [situation]", "analyse [humoriste]". Contenu pédagogique s10 (comedyTechnique/techniqueExplanation/howToApply) déjà en base = ≥300 mots par vanne assurés | Créer `/vannes/[slug]`, `/conseils/[slug]`, `/videos/[slug]` avec Article schema. Ajout au sitemap + llms-full.txt | @fullstack (routes) + @seo (schema) | Aucun (chantier 3-5j) |
| 9 | BL-01 | **0 backlink externe** | bing-audit-s10 confirmait 0 ; QW1-QW5 (BetaList, Uneed, TAAFT, FuturePedia, Microlaunch, StartupBase, IndieHackers, SourceBottle) documentés depuis avril, jamais soumis. haro-agent en prod mais publications non confirmées | Autorité domaine nulle, sandbox Google/Bing structurelle, dépendance canal unique | Batch pitches prêts à copier-coller → Thomas soumet en ~4h (6-10 backlinks DA 40-90) | @growth (pitches) → Thomas (soumission) | **Thomas** (soumissions manuelles) |
| 10 | RENDER-01 | **/parcours/repartie invisible pour bots** | HTML serveur `/parcours/repartie` = header+footer uniquement, contenu rendu client-only, `cache-control: no-store`. Idem probable pour autres parcours | Trou SEO/GEO : bots sans JS ne voient rien. NB : côté utilisateur JS-enabled, la page s'affiche normalement — ce n'est PAS "page vide" comme dit l'audit copy T08 | Passer les pages parcours en SSR/SSG (Next.js) ou pré-rendre le contenu statique | @fullstack | Aucun |

---

## 3. Tableau complet P0/P1/P2 par domaine

Chaque ligne renvoie à son audit source. **Reclassements** (marqués R) appliquent les corrections orchestrateur.

### SEO — `docs/seo/audit-global-s11.md`
| ID source | Prio | Trou | Statut |
|---|---|---|---|
| P0-01 | P0 | msvalidate.01 absent en prod | Actif (Thomas doit fournir clé BWT) |
| P0-02 | P0 | twitter:image → /og-image.png 404 | Actif — Top 10 #4 |
| P0-03 | P0 | Cannibalisation 8 paires | Actif — Top 10 #6 |
| P0-04 | P0 | 0 URL longue traîne catalogue | Actif — Top 10 #8 (nombres corrigés : 1091 pages, pas 445) |
| P1-01 | P1 | Organization.logo string vs ImageObject | Actif |
| P1-02 | P1 | www redirect 3 sauts | Actif |
| P1-03 | P1 | 4 intentions mots-clés non couvertes | Actif |
| P1-04 | P1 | Maillage blog → parcours individuels | Actif |
| P1-05 | P1 | Slug daté `meilleures-blagues-droles-2026` | Actif |
| P2-01 à P2-04 | P2 | Sitemap lastmod / OG cohérence / backlinks / pagination | Actif |
| DM-07 | R | "Sitemap : aucun article post-9 juin — cron bloqué ?" | **Reclassé en GEN-01** (Top 10 #1) — vrai P0 nouveau |

### GEO — `docs/geo/audit-global-s11.md`
| ID | Prio | Trou | Statut |
|---|---|---|---|
| G1 | P0 | llms-full.txt : 5/42 articles cités, aucun URL individuel | Actif |
| G2 | P0 | Pas de `sameAs` Organization/Person | Actif — nécessite profils Thomas (LinkedIn, Wikidata) |
| G3 | P0 | dateModified = datePublished figé | Actif |
| G4 | P1 | 0 monitoring citations LLM | Actif (protocole hebdo fourni) |
| G5 | P1 | Pillar non rafraîchis 6+ mois | Actif — aggravé par GEN-01 |
| G6-G8 | P1 | Pages clés absentes llms.txt / Person sans identifiants / 0 Reddit | Actif |
| G9-G11 | P2 | rel next/prev / articles PAA / Wikidata | Actif |

### Contenus — `docs/copy/audit-contenus-s11.md`
| ID | Prio | Trou | Statut |
|---|---|---|---|
| T01 | R | "290+ vs 265 vannes" | **Reclassé en CAT-01** — les DEUX chiffres sont faux (réalité 602) |
| T02 | P0 | "générés par IA" home | Actif — Top 10 #5 |
| T03 | P0 | Doublon rester-muet-en-groupe | Actif (dans CAN-01 paire 1) |
| T04 | P0 | Témoignages fictifs Lucas/Marine/Thomas = personas internes | Actif |
| T05 | P1 | FAQ vouvoiement dans pillar | Actif |
| T06 | P1 | Citations Fary mal attribuées | Actif |
| T07 | P1 | Staccato résiduel (Boom / Plot twist / STOP.) | Actif — patch seo-blog-agent |
| T08 | R | "Parcours répartie vide en prod" | **Reclassé en RENDER-01** (Top 10 #10) — rendu client-only, pas vide |
| T09 | P1 | Ton scolaire "Semaine 1 / Jours 1-3" | Actif |
| T10 | R | "Décryptages invisibles en prod" | **FAUX** — `/api/jokes` renvoie bien comedyTechnique/techniqueExplanation/howToApply. **NUANCE** : la vanne du jour n'a pas de décryptage (créée 26/03, back-fill s10 ne couvre pas le stock ancien) → nouveau P1 : back-fill complet |
| T11 | P1 | 0 parcours pro (Sophie) ni storytelling (Marc) | Actif |
| T12-T15 | P2 | Citations synthétiques / SSR blog / booking coaching / dating | Actif |

### UX — `docs/ux/audit-global-s11.md`
| ID | Prio | Trou | Statut |
|---|---|---|---|
| P0-1 | P0 | 0 capture email blog | Actif — Top 10 #7 |
| P0-2 | P0 | CTA blog = 0,99€ cash, free tier invisible | Actif |
| P0-3 | P0 | Quiz public = cul-de-sac | Actif |
| P0-4 | P0 | Onboarding orphelin (`router.push("/abonnement")`) | Actif — 1 ligne de code |
| P0-5 | R | "290+ vs 265 vannes" | **Reclassé en CAT-01** |
| P1-1 | R | "Register modal — préf CLAUDE.md" | **CLAIM FAUX** — CLAUDE.md ne mentionne rien sur modal auth. Aucune préférence documentée. À rejeter jusqu'à décision fondateur explicite |
| P1-2 à P1-6 | P1 | Votes 0 visibles / urgence sans deadline / témoignages / /abonnement dual / callbackUrl ignoré | Actif |
| P2-1 à P2-5 | P2 | Limite free / streak dans CTA / FAQ contextuelle / quiz relié / emails réactivation | Actif |

### Growth — `docs/growth/audit-acquisition-s11.md`
| ID | Prio | Trou | Statut |
|---|---|---|---|
| T-P0-01 | R | "Sessions 8/9/10 non mergées → CEO inactif" | **PARTIELLEMENT FAUX** — la prod tourne sur code s9/s10. L'état du CEO (toggle admin, secrets) reste **INCONNU** → nouveau P0 : Thomas vérifie `/admin/ceo` + Replit Secrets |
| T-P0-02 | P0 | ~12 secrets Replit manquants | Actif — inconnu tant que Thomas ne confirme pas |
| T-P0-03 | P0 | 0 backlink | Actif — Top 10 #9 |
| T-P0-04 | P0 | 0 referral / partage natif | Actif |
| T-P1-01 | P1 | LinkedIn JSON conformité | Actif |
| T-P1-02 | P1 | BWT non configuré | Actif |
| T-P1-03 à T-P1-05 | P1 | Earned media / liste inconnue / canal unique | Actif |
| T-P2-01 à T-P2-05 | P2 | Referral / UGC / HARO / newsjacking / Google Alerts | Actif |

### Infra — `docs/infra/audit-global-s11.md`
| ID | Prio | Trou | Statut |
|---|---|---|---|
| T01 | R | "50 commits s8+s9+s10 non mergés dans master" | **RECLASSÉ en GIT-01** (Top 10 #3) — le fait est vrai côté master, mais la prod tourne déjà sur le code plus récent. Le trou n'est pas "déployer", c'est "aligner master + default branch + CI" |
| T02 | P0 | Default branch GitHub = branche orpheline | Actif — dans GIT-01 |
| T03 | P0 | /api/health = 404 | Actif |
| T04 | P0 | CI Actions cible `main` inexistant | Actif — dans GIT-01 |
| T05 | P0 | 37 vulns npm (12 web + 25 root) | Actif |
| T06 | P1 | CSP unsafe-inline + unsafe-eval | Actif |
| T07 | P1 | `ignoreBuildErrors: true` next.config.js | Actif |
| T08 | P1 | .env.example obsolète ≥10 vars | Actif |
| T09-T15 | P1 | Sentry / uptime / backup / SPF-DKIM-DMARC / rate-limit / prisma.config / HSTS doublé | Actifs |
| T16-T20 | P2 | prisma db push / Lighthouse / doc Neon / env.md / Neon cold start | Actifs |

---

## 4. Contradictions entre audits — arbitrages

| # | Audit A | Audit B | Contradiction | Arbitrage orchestrateur | Impact |
|---|---|---|---|---|---|
| C1 | Copy T01 : "265 vs 290+" | UX P0-5 : "265 actives vs 290+ affiché" | Les deux prennent project-context comme vérité | **Les DEUX faux** — réalité DB = 602. Site sous-annonce, project-context est périmé. Fix = afficher "600+", corriger project-context, expliquer écart 602 vs 636 | Bloquant confiance |
| C2 | Copy T10 : "décryptages invisibles en prod" | Corrections orch. : "/api/jokes renvoie bien les champs s10" | Copy présume non-déploiement | **Copy T10 FAUX** — décryptages sont en base. Reste à vérifier : (a) rendu HTML SSR de /vannes (b) back-fill vanne du jour 26/03 sans décryptage | Requalifié en P1 rendu + P1 back-fill |
| C3 | Copy T08 : "parcours répartie vide" | Corrections orch. : "rendu client-only" | Interprétation différente du même symptôme | **Reclassé RENDER-01** : pas vide pour user, invisible pour bots. Trou SEO/GEO | Prio P1 SEO, pas P0 UX |
| C4 | Growth T-P0-01 : "CEO inactif car s8-10 non mergées" | Corrections orch. : "prod tourne sur s9/s10, routes CEO présentes" | Growth s'appuie sur hypothèse fausse | **CEO potentiellement déployé** — état réel INCONNU (toggle admin, dryRun, secrets, dernière séquence envoyée). Nouveau P0 : audit CEO par Thomas | Débloque tout le funnel email si actif |
| C5 | Infra T01 : "prod = mars 2026" | Corrections orch. : "prod = s9/s10 confirmé par routes" | Infra a lu origin/master, pas la prod | **Infra T01 partiellement faux** — le trou n'est pas "50 commits à déployer" mais "master n'est pas à jour vs prod + default branch orpheline + CI ne tourne pas" (GIT-01) | Change nature du fix |
| C6 | UX P1-1 : "register modal (préf fondateur CLAUDE.md)" | CLAUDE.md ne mentionne rien | Invention d'une préférence | **Claim rejeté** — aucune préférence documentée. UX doit soit trouver la source, soit retirer. Fondateur à consulter si sujet | Évite refonte inutile |
| C7 | SEO 55/100 (↑) | GEO 54/100 (↓ vs 82) | Directions opposées | **Non contradictoire** — SEO recalcule sur même grille (progression contenus), GEO élargit rubrique (nouveaux gaps découverts). Les deux vrais. | Baseline claire s11 |
| C8 | Copy T01 (chiffres périmés) | Copy T10 (décryptages absents) | Les deux reposent sur "s10 non déployée" | Les deux hypothèses de départ sont fausses (voir C1 + C2) | Copy à re-lire à froid |

---

## 5. Répartition du travail — Thomas vs agents autonomes

### 5.1 Ce que Thomas seul peut faire (ordonné, avec durée)

| # | Action | Durée | Dépend de |
|---|---|---|---|
| 1 | **Diagnostiquer génération IA à l'arrêt** — Replit logs `LlmUsageLog`, crédits Anthropic dashboard, statut cron scheduler, deployment actif | 30 min | Rien — **BLOQUANT #1** |
| 2 | **Vérifier état CEO en prod** — `/admin/ceo` login, toggle enabled ?, dryRun ?, dernier envoi ? | 15 min | Rien |
| 3 | **Inventorier Replit Secrets** — cocher les 12 secrets (5 cœur + 7 CEO/RGPD) présents/absents/rotation | 20 min | Rien |
| 4 | **Aligner master sur le code prod** — identifier commit Replit servi, fast-forward master local + push | 45 min | 1-3 faits |
| 5 | **Default branch GitHub → master** + CI `tests.yml` cible `[master]` | 10 min | 4 fait |
| 6 | **Fournir données manquantes** — MRR Stripe, inscrits FREE, followers Tw/LI/IG, Umami (trafic + referrers Bing), Resend open rates, GSC positions "devenir drôle" / "avoir de la répartie" | 30 min | Rien |
| 7 | **Récupérer clé msvalidate.01** BWT + INDEXNOW_KEY + confirmer présence secrets | 20 min | 3 fait |
| 8 | **Snapshot DB Neon** (`pg_dump` + SHA256 stocké) + configurer backup quotidien vers R2/B2 | 45 min | Rien |
| 9 | **Soumissions QW1** — BetaList, Uneed, TAAFT, FuturePedia, Microlaunch, StartupBase (pitches préparés par @growth) | 3h | Batch @growth prêt |
| 10 | **Créer profils sameAs** — LinkedIn Alex Durand + Twitter/X + Instagram + entrée Wikidata minimaliste | 2h | Rien |
| 11 | **UptimeRobot free** (5 URLs) + **Sentry free** (wizard Next.js) | 1h | 4 fait |
| 12 | **Post Indie Hackers** (QW4) + inscription SourceBottle (QW2) + 5 Google Alerts | 1h30 | Batch @growth |
| 13 | **Signer DPA** Anthropic + Resend + Neon | 30 min | Rien |

**Total blocage Thomas critique : ~2h** (actions 1-3 + 4-5 + 6) pour débloquer 80% du reste.

### 5.2 Ce que les agents peuvent enchaîner sans Thomas (plan par dépendances, parallélisation max)

**Bloc A — Fixes courts immédiats (parallélisables, ~1 journée cumulée)**
- @fullstack : (a) mention IA home 1 ligne (IA-01) — (b) twitter:image fix (TW-01) — (c) Organization.logo → ImageObject (P1-01 SEO) — (d) dateModified dissocier (G3 GEO) — (e) onboarding routing `router.push("/onboarding")` (P0-4 UX) — (f) callbackUrl priorité (P1-6 UX) — (g) chiffres catalogue dynamiques 600+ (CAT-01) — (h) masquer votes roadmap à 0 (P1-2 UX) — (i) HSTS doublé (T15 infra)
- @copywriter : (a) FAQ pillar : vouvoiement → tutoiement (T05) — (b) retirer citations Fary mal attribuées (T06) — (c) anonymiser témoignages Lucas/Marine/Thomas (T04) — (d) reformuler "prix de lancement" avec date ou retirer (P1-3 UX)
- @copywriter : patch prompt système `seo-blog-agent.ts` anti-staccato + anti-vouvoiement FAQ + anti-témoignages-avec-prénoms-personas (T07)

**Bloc B — Chantiers structurants (~1-2 semaines, parallélisables)**
- @seo + @copywriter : arbitrer les 8 paires cannibalisation, fusionner/rediriger 8×2 = 16 pages (CAN-01)
- @copywriter : générer 4 articles manquants (cours humour en ligne, stand-up débutant, humour adulte reconstruction, blagues intelligentes non vulgaires) via seo-blog-agent (P1-03 SEO)
- @copywriter : rafraîchir les 5 pillar articles (mise à jour dateModified + bloc "Mis à jour le") — dépend GEN-01 débloqué (Bloc P) et Bloc A(d) fait
- @fullstack : régénérer llms-full.txt dynamiquement depuis sitemap avec URL + résumé 1 ligne (G1 GEO) + ajouter pages ressources
- @fullstack + @copywriter : capture email blog — bloc inline + exit-intent (UX-01)
- @fullstack + @copywriter : quiz gate email + double CTA blog "gratuit / premium" (P0-2 + P0-3 UX)
- @fullstack : back-fill décryptages sur vannes ancien stock (dont vanne du jour 26/03) — dépend audit de couverture
- @infrastructure : redirect www 1 saut (P1-02 SEO)
- @infrastructure : `/api/health` route (T03 infra) — dépend Bloc P #4 (CI qui tourne)

**Bloc C — Chantiers longs (~1 mois)**
- @fullstack : URLs individuelles `/vannes/[slug]`, `/conseils/[slug]`, `/videos/[slug]` avec Article schema + entrée sitemap + entrée llms-full.txt (LT-01 = Top 10 #8)
- @fullstack : passer /parcours/[slug] en SSR/SSG (RENDER-01 = Top 10 #10)
- @product-manager + @copywriter : specs 2 nouveaux parcours (Humour au boulot / Storytelling) (T11)
- @product-manager + @fullstack : specs referral simple (+7j premium croisés) + partage natif vannes (bouton copy + og:image auto) (T-P0-04 growth + Top 10 #9 complément)
- @infrastructure : Sentry + UptimeRobot + rate-limiting middleware + backup Neon documenté + SPF/DKIM/DMARC vérifiés
- @growth : préparer batch pitches directories (QW1-QW4) — livrable copy prêt à coller pour Thomas
- @geo : activer protocole monitoring citations LLM hebdo (5 prompts × 4 LLM = 20 tests/semaine)

**Bloc P — Dépend de Thomas (bloqueurs)**
- @ia : redémarrage joke-agent / tip-agent / seo-blog-agent / social-agent — après diag Thomas #1
- @fullstack : msvalidate.01 dans layout.tsx — après clé Thomas #7
- @fullstack : sameAs dans JSON-LD Organization/Person — après profils Thomas #10
- @seo + @growth : soumettre pitches — après batch prêt + validation Thomas #9
- @infrastructure : @sentry/nextjs wizard — après compte Thomas #11
- @infrastructure : plan de merge/rollback CI — après default branch réglée #5

---

## 6. Données manquantes (dédoublonnées)

| # | Donnée | Source | Bloque quoi |
|---|---|---|---|
| DM-1 | Cause de la panne génération IA depuis 15 juin | Replit logs + Anthropic dashboard | Tout le contenu neuf (GEN-01) |
| DM-2 | État CEO en prod (enabled, dryRun, dernier envoi) | `/admin/ceo` + Replit Secrets | Funnel email complet |
| DM-3 | Commit exact servi par Replit | Replit deploy dashboard | Alignement master (GIT-01) |
| DM-4 | MRR actuel + nb abonnés premium | Stripe dashboard | Mesure objectif 1 000€ MRR |
| DM-5 | Nb inscrits FREE + taille liste email | Back-office /admin + Prisma | Mesure funnel |
| DM-6 | Followers Twitter/X, LinkedIn, Instagram | Chaque plateforme | Mesure social |
| DM-7 | Trafic organique mensuel + referrers (Bing incl.) | Umami | Baseline SEO/Bing |
| DM-8 | Positions GSC "devenir drôle" / "avoir de la répartie" | GSC | Mesure progression pillar |
| DM-9 | Core Web Vitals (LCP/INP/CLS) mobile + desktop | GSC ou PageSpeed | Diagnostic perf |
| DM-10 | Bing Webmaster Tools : configuré ? pages indexées ? clé msvalidate.01 | BWT dashboard | P0-01 SEO |
| DM-11 | INDEXNOW_KEY présent dans Replit Secrets | Replit Secrets | Soumissions IndexNow |
| DM-12 | haro-agent : publications depuis mai ? domaines ? | Logs + BDD | T-P2-03 growth |
| DM-13 | Résultat quiz : taux complétion 12 questions | Umami events | Priorisation P0-3 UX |
| DM-14 | Rétention J7 / J30 cohort | Umami cohortes | Priorisation P2-5 UX |
| DM-15 | Écart 602 vs 636 vannes : cause soft-delete ? doublons ? | Prisma query | CAT-01 propre |
| DM-16 | Couverture back-fill s10 : combien de vannes ont un décryptage ? | Prisma query `WHERE comedyTechnique IS NULL` | T10 copy requalifié |
| DM-17 | Baseline citations LLM (ChatGPT/Perplexity/Claude/Gemini) | Tests manuels Thomas | Monitoring GEO |

---

## 7. Handoff

---
**Handoff → @orchestrator**

**Fichier produit :** `/home/user/Marrant/docs/marrant/audit-global-s11.md`

**Décisions prises :**
- Verdict global : **GO CONDITIONNEL** pour les Blocs A + B agents autonomes (fixes courts + chantiers structurants sans dépendance Thomas). **NO-GO** nouveaux chantiers tant que GEN-01 (génération IA) + CAT-01 (chiffres catalogue) + GIT-01 (gouvernance git) ne sont pas résolus.
- 3 vrais P0 nouveaux non identifiés par les audits amont : GEN-01, CAT-01, GIT-01.
- 6 contradictions/erreurs factuelles corrigées (voir §4) — les audits copy T01/T08/T10, growth T-P0-01, infra T01, UX P1-1 doivent être relus par leurs agents à froid.

**Points d'attention critiques :**
- **Top 3 corrections prioritaires (impact décroissant) :**
  1. GEN-01 — sans redémarrage, tous les fixes fraîcheur GEO/SEO sont vains
  2. CAT-01 — le site vend 45% de la valeur réelle du produit
  3. UX-01 (capture email) — sans ça, aucune progression MRR mesurable même après fix funnel
- Le "vrai" plan de travail Thomas fait ~2h de bloqueurs critiques (actions 1-6 §5.1) pour débloquer 80% de la chaîne agents.
- L'audit UX P1-1 invente une préférence fondateur (register modal) — à retirer.
- L'audit copy T10 (décryptages absents) est faux côté données, à requalifier en (a) couverture back-fill (DM-16) et (b) rendu SSR à vérifier.
- 3 audits (growth, infra, copy) reposent partiellement sur "prod = master s7" qui est faux. Les priorités restent globalement bonnes mais la nature des fixes change (pas "déployer" mais "aligner master + audit état réel").
- Recommander l'invocation de @ia (diag génération) et @data-analyst (chiffres catalogue + baseline metrics) — non couverts en s11.

**Agents à réinvoquer pour corrections d'audit :**
- @copywriter : requalifier T01, T08, T10 (contradictions C1, C2, C3, C8)
- @growth : requalifier T-P0-01 (contradiction C4)
- @infrastructure : requalifier T01 (contradiction C5)
- @ux : retirer P1-1 ou fournir source réelle (contradiction C6)

---

## TL;DR final + Top 10 (format compact)

**TL;DR :** Le site est meilleur (contenu ×2, pivot pédagogique déployé) mais il ne pousse plus : machine à contenu en panne depuis 3,5 mois, catalogue vendu à 45% de sa valeur réelle (602 vannes affichées "290+"), funnel troué à chaque étape (0 capture email, quiz cul-de-sac, onboarding orphelin), 0 backlink, 0 abonné social. Verdict : **GO** sur ~30 fixes agents autonomes (24-72h), **NO-GO** nouveaux chantiers tant que GEN-01 + CAT-01 + GIT-01 non résolus. Bloqueur Thomas critique = ~2h (diag IA + audit CEO + secrets + alignement git + data manquante).

**Top 10 :**
1. GEN-01 — Génération IA à l'arrêt depuis 15/06 (vannes/tips/blog) → Thomas diag Replit + @ia
2. CAT-01 — Chiffres catalogue faux partout (602/400/89 réel vs 290+/60+ affiché vs 265 doc) → @fullstack + @copywriter
3. GIT-01 — master obsolète + default branch orpheline + CI cible `main` → Thomas
4. TW-01 — twitter:image /og-image.png = 404 → @fullstack (30 min)
5. IA-01 — "générés par IA" home viole règle fondateur → @fullstack (1 ligne)
6. CAN-01 — 8 paires cannibalisation blog → @seo + @copywriter
7. UX-01 — 0 capture email sur le blog → @fullstack + @copywriter
8. LT-01 — 0 URL individuelle catalogue (1 091 pages manquantes) → @fullstack + @seo
9. BL-01 — 0 backlink externe (QW1-QW5 jamais soumis) → @growth (batch) + Thomas (4h)
10. RENDER-01 — /parcours/repartie invisible aux bots (rendu client-only) → @fullstack
