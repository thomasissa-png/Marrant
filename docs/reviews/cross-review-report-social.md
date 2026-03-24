# Revue croisée — Cohérence stratégie social media — Deviens-marrant.fr — 2026-03-24

> Agent : @reviewer | Périmètre : stratégie social media uniquement
> Documents audités : project-context.md, social-editorial-plan.json (v1.0 / 22-03-2026), docs/social/social-strategy.md, docs/social/content-templates.md, docs/copy/brand-voice.md, CLAUDE.md (section Social Media)
> Mode : audit read-only — aucun fichier modifié

---

## Résumé exécutif (non-technique)

La stratégie social media est globalement solide et bien construite. Les trois personas sont correctement pris en charge, le ton de marque est cohérent entre tous les documents, et le pipeline technique est clairement documenté. Deux incohérences mineures ont été identifiées et méritent une correction rapide : les jours de publication des threads Twitter varient entre les documents (mardi+vendredi vs mardi+mercredi), et le score minimum de validation par le Stand-Up Director est contradictoire entre les documents (7 vs 9). Ce second point est le plus important : si l'agent publie avec un seuil de 7 au lieu de 9, la qualité des posts sera inférieure à la promesse de marque. Une contradiction bloquante a été identifiée sur le statut d'Instagram : social-strategy.md déclare les trois plateformes en simultané dès le jour 1, tandis que CLAUDE.md et social-editorial-plan.json maintiennent Instagram en hold (API Meta non finalisée). L'état réel du pipeline doit être clarifié avant de continuer.

---

## Résumé technique

L'architecture des documents est cohérente sur les points fondamentaux : personas, ton, vocabulaire, formats, horaires et stratégie organique. Deux incohérences mineures (jours threads, seuil directeur) et une contradiction bloquante (statut Instagram) nécessitent une résolution avant déploiement complet. Recommandation : GO avec réserves — corriger la contradiction Instagram et le seuil de validation en priorité.

---

## Contradictions détectées

| Livrable A | Livrable B | Contradiction | Criticité | Résolution proposée |
|---|---|---|---|---|
| `social-strategy.md` section "Plateformes" : "Les 3 en simultané" + auto-évaluation "Twitter, LinkedIn, Instagram tournent en simultané — tout est automatisé" | `CLAUDE.md` section Social Media : "Phase 3 — Instagram EN HOLD (config API Meta en cours)" + `social-editorial-plan.json` phases : `"phase3": { "status": "active" }` avec `BUFFER_CHANNEL_INSTAGRAM` marqué optionnel | **Statut Instagram ambigu.** social-strategy.md affirme un déploiement simultané immédiat ; CLAUDE.md dit que Instagram est en hold ; le JSON dit que la phase 3 est "active". Ces trois déclarations ne peuvent pas être vraies en même temps. | BLOQUANT | Alex doit clarifier l'état réel : (1) si l'API Meta Buffer est configurée → mettre à jour CLAUDE.md et marquer Instagram actif partout ; (2) si elle ne l'est pas → corriger social-strategy.md pour retirer "en simultané" et aligner avec le statut "hold" de CLAUDE.md. Agent responsable : @social pour la correction documentaire. |
| `social-strategy.md` : "Thread Décryptage — 2 threads/semaine, **mardi + vendredi**" (sections 3 et 4) + `content-templates.md` : "2 threads/semaine (**mardi + vendredi**)" | `social-editorial-plan.json` planning hebdo : Thread Décryptage positionné le **mardi soir** ET le **mercredi soir** (pas de vendredi) | **Jours de publication Thread Décryptage incohérents.** La stratégie et les templates disent mardi+vendredi ; le planning hebdomadaire dit mardi+mercredi. | MAJEUR | Choisir une version et l'aligner partout. Mardi+vendredi est cohérent avec la logique "début de semaine éducatif + boost vendredi avant week-end". Mettre à jour le planning hebdo du JSON. Agent responsable : @social. |
| `social-strategy.md` section Pipeline : "Score ≥ 7 → status: APPROVED, directorValidated: true" + "Score < 9 → retry (max 3 tentatives)" | `social-editorial-plan.json` `directorValidation.minScore: 7` | **Seuil de validation contradictoire avec brand-voice.md et CLAUDE.md.** brand-voice.md et CLAUDE.md indiquent explicitement "Score minimum pour publication : 9/10 (APPROVED)". Le code de `standup-director-agent.ts` confirme le seuil 9 pour APPROVED social. Le fait que social-strategy.md écrive "Score ≥ 7 → APPROVED" est une erreur de documentation — cela ne correspond pas à la logique du code ni aux autres sources. | MAJEUR | Corriger social-strategy.md et social-editorial-plan.json pour aligner sur le seuil réel : score ≥ 9 = APPROVED (publication automatique), score 7-8 = NEEDS_REVISION (retry), score ≤ 6 = REJECTED. Le code standup-director-agent.ts est la source de vérité. Agent responsable : @social + @fullstack pour confirmation du code. |

---

## Points alignés — Synthèse positive

Les éléments suivants sont cohérents entre tous les documents audités :

**Personas — bien servis**
- Yanis (20 ans) : Twitter soir 21h-23h documenté partout (social-strategy.md, social-editorial-plan.json schedulingByPersona, content-templates.md). Refs gen Z (memes/TikTok, Netflix, rap FR, gaming, dating apps) présentes dans le JSON et CLAUDE.md — absentes de social-strategy.md mais ce document est antérieur aux directives v2 (22-03) et ce n'est pas bloquant.
- Sophie (26 ans) : LinkedIn exclu pour Yanis documenté dans social-editorial-plan.json ("PAS Yanis, il n'est pas sur LinkedIn") — cohérent avec le profil persona de project-context.md. Format prioritaire VANNE_REECRITE_SOCIAL bien documenté dans le JSON, CLAUDE.md, social-strategy.md et content-templates.md (Template T2).
- Marc (34 ans) : tweet dating le jeudi documenté dans social-editorial-plan.json (datingTweetDay: jeudi), CLAUDE.md et social-strategy.md. Ton actionnable (pas inspirant) documenté partout. Le post LinkedIn jeudi (Template L2, exemple "premier date après 8 ans") incarne exactement le persona Marc sans nommer le persona.

**Ton de marque — cohérence totale**
- Tutoiement systématique : respecté dans tous les exemples rédigés (T1, T2, T3, L1, L2, L3, I1, I2, I3)
- Zéro prénoms de personas dans le contenu public : règle présente dans brand-voice.md, content-templates.md ("ce qu'on ne dit jamais"), social-editorial-plan.json (contentRules.never), et tous les exemples la respectent
- Vocabulaire de marque : "vanne" (pas "blague"), "technique" (pas "méthode") — appliqué correctement dans tous les templates et exemples. L'exemple T2 utilise bien "vannes au catalogue"
- Ton social plus punchy que site : cohérent entre brand-voice.md (section "Social media") et social-strategy.md ("Ton par plateforme")
- Zéro engagement bait : documenté et respecté partout (social-editorial-plan.json contentRules.never, social-strategy.md, brand-voice.md par extension)

**Formats Twitter — cohérence entre documents**
- Les 4 formats signature (Technique du Jour, Vanne Réécrite Social, Thread Décryptage, Quote Analyse) sont documentés de manière cohérente dans CLAUDE.md, social-strategy.md et content-templates.md
- Wild Cards (mercredi + samedi) : présentes dans CLAUDE.md, social-editorial-plan.json et social-strategy.md — cohérence confirmée

**Charte visuelle Instagram — cohérence**
- Fond noir/très sombre + accent violet + texte blanc cassé + punchlines en italique x1.5 : documenté de manière identique dans CLAUDE.md, social-editorial-plan.json (charteVisuelle) et content-templates.md (Templates I1, I2)
- Le lien avec le design system (accent-primary = violet/gradient) est explicitement mentionné dans CLAUDE.md et social-editorial-plan.json — cohérent avec la charte

**Horaires par persona — cohérence code vs documentation**
- social-editorial-plan.json schedulingByPersona YANIS twitter: [19, 21], SOPHIE twitter: [7, 11], MARC twitter: [6, 18]
- social-strategy.md : Yanis 21h-23h, Sophie 8h-9h + 12h-13h, Marc 7h-8h + 20h-21h
- CLAUDE.md : Yanis 21h-23h, Sophie 8h-9h + 12h-13h, Marc 7h-8h + 20h-21h
- social-media-agent.ts getSchedulingHint() : cohérent avec ces plages (YANIS = "Ce post sera lu en soirée", SOPHIE = matin + pause déj, MARC = tôt matin + soirée)
- Note mineure : le JSON utilise des entiers [7, 11] pour Sophie (7h et 11h) quand les documents parlent de 8h-9h et 12h-13h. L'écart est marginal (1h) et ne compromet pas la stratégie.

**Stratégie organique 0€**
- Contrainte budget acquisition 0€ documentée dans project-context.md et social-strategy.md — cohérent avec l'absence de toute mention de publicité payante dans les templates et le planning

**Pipeline technique**
- Buffer comme couche de publication, crons daily-social (4h UTC) + publish-social (30 min) + social-analytics (1x/jour) : cohérents entre CLAUDE.md, social-strategy.md et social-editorial-plan.json
- Fallback directorValidated: false → PENDING → review manuelle : documenté dans CLAUDE.md (audit 22-03), social-strategy.md pipeline et social-editorial-plan.json directorValidation

**Feedback loop**
- Les top posts (directorScore ≥ 8, 14 derniers jours) injectés dans le prompt : documenté uniquement dans social-editorial-plan.json (feedbackLoop) et dans CLAUDE.md implicitement. social-strategy.md n'en parle pas — ce n'est pas bloquant (c'est un détail d'implémentation), mais une mention dans la stratégie renforcerait la cohérence documentaire.

---

## Angles morts

**1. Gestion de crise et contenu sensible**
Aucun document ne couvre le cas d'un post qui serait perçu comme offensant, mal reçu, ou qui tomberait lors d'un événement tragique. En stand-up, le timing est tout — un post sur l'humour noir (thème d'octobre dans le planning mensuel) publié automatiquement le jour d'un drame national serait catastrophique. Recommandation : définir un protocole de pause d'urgence du pipeline et une liste de sujets à blacklister temporairement (Alex doit pouvoir couper le cron en 30 secondes).

**2. TikTok — exclusion justifiée mais non documentée**
project-context.md note que TikTok a été écarté "contenu 100% automatisé texte + image est difficilement adapté au format Reels TikTok natif". C'est une décision rationnelle mais elle n'est pas reprise dans social-strategy.md. Si un agent ou un collaborateur lit uniquement la stratégie sociale, il ne comprend pas pourquoi TikTok est absent. Recommandation : ajouter une section courte dans social-strategy.md expliquant l'exclusion de TikTok et les conditions de réexamen (ex: si Alex peut produire du contenu vidéo).

**3. Stratégie de réponse et engagement actif**
social-strategy.md mentionne brièvement (Levier 5) qu'Alex doit commenter intelligemment les posts des humoristes "quand pertinent — action manuelle". Mais aucun template, aucune fréquence, aucun critère de qualité n'est défini pour ces interactions. C'est un angle mort opérationnel : sans guide, la qualité des commentaires sera aléatoire, et un mauvais commentaire sur le post de Fary peut faire plus de mal que du bien.

**4. Métriques de conversion social → premium**
social-strategy.md et social-editorial-plan.json définissent des KPIs de followers et d'engagement, mais le lien entre performance sociale et objectif business (1 000€ MRR à 6 mois) n'est que partiellement documenté. Le KPI "conversionRate: 2%" dans social-editorial-plan.json est cité sans source ni benchmark. C'est une hypothèse non marquée comme telle — ce qui va à l'encontre de la Règle n°2 du framework (zéro invention de données). Recommandation : marquer ce chiffre [HYPOTHÈSE] ou demander à @data-analyst de produire un tracking plan social → abonnement.

**5. Refs gen Z dans social-strategy.md**
Les directives v2 (Yanis gen Z refs : memes/TikTok, Netflix, rap FR, gaming, dating apps) sont documentées dans CLAUDE.md et social-editorial-plan.json mais absentes de social-strategy.md. Ce document étant daté du 24-03 (postérieur à l'audit directeur v2 du 22-03), c'est un oubli à corriger pour que la stratégie soit auto-suffisante.

---

## Décisions à confirmer

1. **Statut Instagram** : Instagram est-il actif (phase 3 "active" dans le JSON) ou en hold (CLAUDE.md) ? Alex doit trancher et aligner tous les documents.

2. **Seuil Stand-Up Director pour les posts sociaux** : le seuil d'approbation automatique est-il 7 (social-editorial-plan.json minScore) ou 9 (brand-voice.md, CLAUDE.md, standup-director-agent.ts) ? La réponse est dans le code (seuil 9), mais la documentation est contradictoire et confuse pour quiconque lirait le JSON comme source de vérité.

3. **Taux de conversion social 2%** : ce chiffre est-il une hypothèse de travail ou une cible validée ? Si c'est une hypothèse, la marquer comme telle dans le JSON.

---

## Recommandation

**GO avec réserves**

La stratégie social media est cohérente sur les points fondamentaux et opérationnelle pour Twitter et LinkedIn. Le travail des agents @social et @copywriter est de qualité — personas correctement servis, ton aligné, formats bien définis, pipeline documenté. Les trois réserves à lever avant de considérer le périmètre social comme "verrouillé" :

1. **Résoudre la contradiction Instagram** (BLOQUANT) — clarifier le statut réel avec Alex et aligner les 3 documents
2. **Aligner le seuil directeur** (MAJEUR) — corriger social-strategy.md et social-editorial-plan.json pour refléter le seuil réel du code (9, pas 7)
3. **Aligner les jours Thread Décryptage** (MAJEUR) — choisir entre mardi+vendredi et mardi+mercredi, et corriger le document minoritaire (le JSON)

Ces corrections sont cosmétiques — elles ne remettent pas en cause l'architecture stratégique. Une fois résolues, le périmètre social est GO.

---

## Handoff → @orchestrator

**Fichiers produits :**
- `/home/user/Marrant/docs/reviews/cross-review-report-social.md`

**Décisions prises :**
- Recommandation : GO avec réserves
- 1 contradiction BLOQUANTE (statut Instagram), 2 contradictions MAJEURES (jours threads, seuil directeur)
- 5 angles morts identifiés dont 1 risque opérationnel immédiat (absence protocole crise)

**Points d'attention — à traiter en priorité :**
- La contradiction sur le statut Instagram nécessite une décision d'Alex avant tout travail supplémentaire sur le pipeline Instagram
- Le seuil de validation directeur doit être corrigé dans social-strategy.md et social-editorial-plan.json pour éviter toute confusion future (le code est correct, c'est la documentation qui ment)
- Les agents @social et @copywriter sont responsables des corrections documentaires — pas @fullstack (le code est correct)
- L'angle mort "protocole de crise" devrait être adressé par @social ou @product-manager avant que le pipeline social soit en production à plein régime
- Le taux de conversion 2% dans social-editorial-plan.json doit être marqué [HYPOTHÈSE] ou validé par @data-analyst
