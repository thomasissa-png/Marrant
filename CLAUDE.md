<!-- GRADIENT-AGENTS-START -->
# Gradient Agents — 8 commandements

Chaque ligne de ce fichier coûte des tokens sur CHAQUE agent. Ne contient QUE les règles universelles.
Détails, gates, protocoles : voir `_base-agent-protocol.md`. Référence gates : voir `_gates.md`.

## 0. Brief-first absolu

Première ligne de toute réponse = `Brief compris : <reformulation 1 ligne>` + `Plan : <3 puces max>`. AUCUNE lecture (Read/Grep/Glob/Task) avant ces 2 lignes. Si défaut évident (`founder-preferences.md`), trancher — ne pas demander A/B/C.

## 1. Contexte obligatoire

Avant toute action, lire `project-context.md`. S'il est absent : s'arrêter et demander à l'utilisateur de le remplir. Ne jamais commencer sans contexte validé.

## 2. Zéro invention de données

Ne JAMAIS inventer une donnée manquante. Signaler le manque, demander à l'utilisateur. Hypothèses acceptables uniquement si marquées `[HYPOTHÈSE : ...]` avec autorisation.

## 3. Écris d'abord, optimise ensuite (anti-timeout)

Le timeout vient d'un agent qui **lit trop avant d'écrire**. Règles :
- Max 10-15 Read/Grep avant le premier Write
- Write le squelette immédiatement, Edit les détails ensuite
- Max ~150 lignes par Write, sauvegarder au fur et à mesure
- Un fichier = un appel Write. Jamais plusieurs fichiers d'un coup

**Chaque prompt de lancement de sous-agent DOIT inclure** : `ANTI-TIMEOUT : écris le fichier IMMÉDIATEMENT après lecture. Write d'abord, Edit ensuite.`

## 4. Toujours déléguer aux agents spécialisés

Ne JAMAIS produire un livrable à la place d'un agent. Invoquer l'agent via `subagent_type`. Exceptions : éditions mineures, réponses aux questions, opérations git, modifications de project-context.md.

## 5. Mindset IA, pas équipe humaine

Calibrer sur la vélocité IA : V1 complète (pas MVP), parallélisation par défaut, plan par dépendances (pas sprints), ne jamais couper une feature "par manque de temps". Automatiser tout contenu récurrent. **Verdicts GO/NO-GO basés VALEUR persona, pas ROI/payback/effort humains** (un projet à valeur utilisateur élevée mais ROI négatif court terme = GO POC, pas NO-GO).

Exception : si project-context.md mentionne une équipe humaine, adapter la calibration.

## 6. Pre-commit build check

Avant tout commit de code dans `src/` :
```bash
npx tsc --noEmit && npm run lint && npm run build
```
Si échec : corriger d'abord, ne PAS commiter. (`npm run lint` = script ESLint/Biome du projet : `next lint` n'existe plus depuis Next.js 16.)

## 7. Anti-inflation de ce fichier

Seuil dur : **125 lignes max** (enforced par hook pre-commit). Avant d'ajouter une ligne, se demander : "concerne-t-elle TOUS les agents ?" Si non → `_base-agent-protocol.md` ou l'agent concerné.

## 8. Conservation of rules (net-zero par session)

Pour toute règle/learning ajouté en fin de session, une obsolète doit être supprimée ou fusionnée. Le framework grossit en valeur, pas en lignes. **Caps actifs** : `lessons-learned.md` 80L, `project-context.md` 250L hors historique (archiver entrées historique > 5 sessions vers `project-context-archive.md`), `CLAUDE.md` 125L. **TTL learnings** : 5 sessions OU 90 jours (le plus court) → promote en règle ou archive. **P0 jamais archivés automatiquement** (garde-fous silencieux). L'historique git garde tout, on ne perd rien.

---

## Règles communes (condensé)

1. Travailler en français (sauf code)
2. Lire project-context.md + historique des interventions avant toute production
3. Zéro output générique — taillé pour CE projet
4. Handoff structuré obligatoire en fin de livrable
5. Mettre à jour l'historique des interventions après chaque livrable
6. Respecter les règles anti-timeout (commandement 3)
7. Objectif qualité : 100% gates PASS (9 gates G1/G3/G5/G7/G12/G13/G15/G17 + G_PROOF bloquant, voir `_gates.md`)
8. UTF-8 dans le code (é, è, à — jamais `\u00E9`)
9. Zéro mention de concurrent par nom dans les livrables client-facing
10. Emails client-facing = brouillons obligatoires (jamais envoi direct)
11. Après tout renommage global (repo, branche par défaut, domaine, nom de projet), Grep l'ancien nom dans tous les fichiers et remplacer
12. Zéro tiret cadratin (—) dans le client-facing et la marque (site, landing, copy, emails, livrables, posts) : c'est une signature d'écriture IA. Restructurer avec virgule, deux-points, parenthèses ou phrase séparée. Pas exigé dans les instructions internes (prompts, .md d'agents).

## Routage automatique

**L'utilisateur n'a PAS besoin de taper `@agent`.** La session principale identifie le(s) domaine(s) de la demande et délègue elle-même via Task (table ci-dessous). `@agent` explicite = override qui force le routage. Demande multi-domaine ou projet complet → la session principale lit `.claude/agents/_orchestration-protocol.md` (son protocole de coordination — ce N'EST pas un 20e agent, c'est la session principale qui l'applique) et l'exécute.

| Demande | Agent délégué |
|---|---|
| Projet complet / multi-domaine | protocole @orchestrator (appliqué par la session principale) |
| Code / dev | @fullstack |
| Stratégie | @creative-strategy |
| Specs / roadmap | @product-manager |
| UX / parcours | @ux |
| Design / UI | @design |
| Contenu / texte | @copywriter |
| SEO | @seo |
| Visibilité IA | @geo |
| Analytics | @data-analyst |
| Acquisition | @growth |
| Social media | @social |
| Vente | @sales-enablement |
| Tests / QA | @qa |
| Infrastructure | @infrastructure |
| IA / LLM | @ia |
| Juridique | @legal |
| Review qualité | @reviewer |
| Audit stratégique | @elon |
| Créer un agent | @agent-factory |

Agents dans `.claude/agents/`. Ambiguïté de domaine → trancher soi-même (founder-preferences), ne pas demander.

## Modèles (19 agents spécialisés)

- **Opus 5.5** (`claude-opus-5-5`, 7 agents) : agent-factory, reviewer, elon, fullstack, ia, qa, infrastructure
- **Sonnet 5.5** (`claude-sonnet-5-5`, 12 agents) : copywriter, creative-strategy, data-analyst, design, geo, growth, legal, product-manager, sales-enablement, seo, social, ux
- **Protocole d'orchestration** : appliqué par la session principale (pas un agent invocable — voir `_orchestration-protocol.md`). Tourne sur le modèle de la session.

## Références

- Protocoles communs, conventions de chemin, mémoire organisationnelle : `_base-agent-protocol.md`
- Gates binaires 9 gates + G_PROOF + verdicts : `_gates.md`
- Protocole de test du framework : `_base-agent-protocol.md` section "Test du framework"
- Préférences fondateur et stack par défaut (Cloudflare, Umami, VPS en renfort) : `docs/founder-preferences.md` (projets clients : `.claude/founder-preferences.md` globales + `docs/founder-preferences.md` du projet, prioritaire)
- Historique des sessions du framework : `CHANGELOG.md` (repo Agent-Team)
<!-- GRADIENT-AGENTS-END -->

# Règles propres à Marrant (hors section Gradient — préservées par update.sh)

- **Détails Marrant** : `docs/marrant/playbook.md` · historique des audits : `docs/marrant/audits-history.md` · préférences fondateur : `docs/founder-preferences.md` · lessons : `docs/lessons-learned.md`.
- **[P0 s8] `[CHOIX UTILISATEUR]` documenté = non re-questionnable** par aucun agent (@reviewer compris). Doc fondateur > toute reco agent. **[P0 s18] Règle d'or : jamais remettre en ligne un contenu sous la barre** ; corriger oui, mais la version corrigée repasse la relecture à l'aveugle et doit en sortir au niveau. **[P0 s15] Humoristes nommés et cités = autorisés partout** (« on est un site d'humoriste ») : jamais de règle « zéro humoriste », jamais de suppression ; citation douteuse = vérifier, pas retirer.
- **[P0 s8] « Le fix ne marche pas »** : seule première action = `git show <branche déployée>:fichier` vs `git show HEAD:fichier`. Ne jamais accuser l'outil avant ce check.
- **[P0 s8] Projet copy** : calibrer 3-5 étalons AVEC le fondateur avant tout brief copywriter (charte : `docs/copy/charte-refonte-copy-s11.md`).
- **[P0 s11] Aucun rapport d'agent validé sans mesure du diff réel** (taux de changement, intouchables : slugs/H2/FAQ/liens/chiffres/prix) — la refonte s11 passe 1 annonçait « réécriture complète » pour 3-5 % de changement.
- **Déploiement** : toute modification code/config est documentée dans `REPLIT_ACTIONS.md` (Replit déploie la branche indiquée par Thomas).
- **Pre-commit code** (`src/`) : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`.
