# Inventaire des trous : IA non relue, tâches muettes, mesures jamais écrites, envois sortants (s14)

Date : 01/10/2026. Mode : lecture seule (code + SELECT sur Neon). Aucun appel sortant, aucun secret affiché.
Périmètre : `apps/web/src/lib/scheduler/jobs.ts`, `apps/web/src/app/api/cron/*`, `apps/web/cloudflare/worker.ts` + `wrangler.jsonc`, routes membres IA, e-mails, push, pages à contenu généré.

Légende : **[PROUVÉ]** = fichier:ligne ou requête SQL + résultat ; **[HYPOTHÈSE]** = déduit, non vérifié en exécution.

Hors périmètre (déjà établi) : génération IA quotidienne coupée depuis le 30/09 (`CONTENT_GENERATION_ENABLED` absent), posts sociaux en pause (audit à part), agent CEO coupé, échecs LLM joke/tip/video/seo-blog depuis juin (modèle retiré).

## 1. Crons réellement branchés (Cloudflare)

_(en cours)_

## 2. Tableau d'inventaire

| Élément | Ce qu'il fait | Quand | IA ? | Relu à la barre ? | Marche ? (preuve) | Risque | Gravité | Correctif proposé |
|---|---|---|---|---|---|---|---|---|

## 3. P0 avec preuves

## 4. P1 avec preuves

## 5. P2 (résumé)
