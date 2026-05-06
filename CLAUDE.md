<!-- GRADIENT-AGENTS-START -->
# Gradient Agents — 8 commandements

Chaque ligne coûte des tokens sur CHAQUE agent. Ne contient QUE les règles universelles.
Détails Marrant : `docs/marrant/playbook.md`. Protocoles communs : `.claude/agents/_base-agent-protocol.md`. Gates : `.claude/agents/_gates.md`.

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

Ne JAMAIS produire un livrable à la place d'un agent. Invoquer l'agent via `subagent_type`. Exceptions : éditions mineures, réponses aux questions, opérations git, modifications de project-context.md, maintenance gouvernance (CLAUDE.md, _gates.md, lessons-learned).

## 5. Mindset IA, pas équipe humaine

Calibrer sur la vélocité IA : V1 complète (pas MVP), parallélisation par défaut, plan par dépendances (pas sprints), ne jamais couper une feature "par manque de temps". Automatiser tout contenu récurrent. **Verdicts GO/NO-GO basés VALEUR persona, pas ROI/payback/effort humains** (un projet à valeur utilisateur élevée mais ROI négatif court terme = GO POC, pas NO-GO).

**Refonte de pipeline de génération** : audit dual + 5-10 exemples canoniques + itération jusqu'au plateau (cap 5 cycles) AVANT de coder le brief. Détail : `_base-agent-protocol.md` section "Pattern d'itération qualité dual avant code (P0)".

**Calibration étalons fondateur AVANT brief copywriter (P0 s8)** : pour tout projet copy, Phase 0 DOIT inclure 3-5 étalons calibrés AVEC le fondateur (orchestrator propose verbatims courts, fondateur réagit "OK / trop X / refais"). Évite 3-4 cycles de tâtonnement.

Exception : si project-context.md mentionne une équipe humaine, adapter la calibration.

## 6. Pre-commit build check

Avant tout commit de code dans `src/` :
```bash
npx tsc --noEmit && npx next lint && npm run build
```
Si échec : corriger d'abord, ne PAS commiter.

## 7. Anti-inflation de ce fichier

Seuil dur : **125 lignes max** (enforced par hook pre-commit `.githooks/pre-commit`, compte la section entre les markers GRADIENT-AGENTS-START/END). Avant d'ajouter une ligne, se demander : "concerne-t-elle TOUS les agents ?" Si non → `_base-agent-protocol.md`, `docs/marrant/playbook.md` ou l'agent concerné.

## 8. Conservation of rules (net-zero par session)

Pour toute règle/learning ajouté en fin de session, une obsolète doit être supprimée ou fusionnée. Le framework grossit en valeur, pas en lignes. **Caps actifs** : `lessons-learned.md` 80L, `project-context.md` 250L hors mémo + 5 dernières sessions (archiver vers `project-context-archive.md`), `CLAUDE.md` 125L (section gradient), `founder-preferences.md` soft-cap 150L (alerte 180). **TTL learnings** : 5 sessions OU 90 jours → promote en règle ou archive. **P0 jamais archivés automatiquement**. L'historique git garde tout.

---

## Règles communes (condensé)

1. Travailler en français (sauf code)
2. Lire project-context.md + historique des interventions avant toute production
3. Zéro output générique — taillé pour CE projet
4. Handoff structuré obligatoire en fin de livrable
5. Mettre à jour l'historique des interventions après chaque livrable
6. Respecter les règles anti-timeout (commandement 3)
7. Objectif qualité : 100% gates PASS (32 gates G1-G32, voir `.claude/agents/_gates.md`)
8. UTF-8 dans le code (é, è, à — jamais `é`)
9. Zéro mention de concurrent par nom dans les livrables client-facing
10. Actions Replit dans `REPLIT_ACTIONS.md` si modification code/config
11. Emails client-facing = brouillons obligatoires (jamais envoi direct)
12. Après tout renommage global (repo, branche par défaut, domaine, nom de projet), Grep l'ancien nom dans tous les fichiers et remplacer
13. **[P0 s8]** Quand `[CHOIX UTILISATEUR]` documenté, agents NE PEUVENT PAS re-questionner même via @reviewer/@moi. Doc fondateur > toute reco agent.
14. **[P0 s8]** Au premier signalement "le fix ne marche pas", SEULE première action : `git show master:file` vs `git show HEAD:file`. Ne jamais accuser l'outil avant ce check.

## Routage agents

| Demande | Agent principal |
|---|---|
| Projet complet | @orchestrator |
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
| Tests / QA | @qa |
| Infrastructure | @infrastructure |
| IA / LLM | @ia |
| Juridique | @legal |
| Review qualité | @reviewer |
| Audit stratégique | @elon |
| Proxy fondateur | @moi |
| Créer un agent | @agent-factory |

Multi-domaine → @orchestrator. Tâche ciblée → agent directement. Définitions dans `.claude/agents/`.

## Modèles

- **Opus** : orchestrator, agent-factory, reviewer, elon, fullstack, ia, qa, infrastructure, moi
- **Sonnet** : copywriter, creative-strategy, data-analyst, design, geo, growth, legal, product-manager, seo, social

## Références

- **Playbook Marrant (règles spécifiques projet)** : `docs/marrant/playbook.md`
- **Historique des audits** : `docs/marrant/audits-history.md`
- **Protocoles communs agents** : `.claude/agents/_base-agent-protocol.md`
- **Gates binaires G1-G32** : `.claude/agents/_gates.md`
- **Préférences fondateur** : `docs/founder-preferences.md`
- **Lessons learned actives** : `docs/lessons-learned.md`
- **Lessons archivées** : `docs/lessons-learned-archive.md`
- **Plan d'orchestration** : `docs/orchestration-plan.md`
<!-- GRADIENT-AGENTS-END -->
