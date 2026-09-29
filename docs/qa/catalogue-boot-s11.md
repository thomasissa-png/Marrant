# Application au boot de la refonte du catalogue (s11, passe 2)

> Problème P0 : la refonte copy s11 (vannes + décryptages, conseils, fiches vidéos, descriptions des parcours) vit dans les fichiers de seed, or `prisma/seed-data.ts` s'arrête en `NODE_ENV=production` (build Replit). Sans correctif, rien n'aurait été appliqué en prod.
> Correctif : `applyCatalogueContentTask` (`apps/web/src/lib/startup-tasks.ts`), exécutée au boot après `ensureCeoConfig` et le nettoyage social, AVANT `applyJokeDecryptagesTask`. Textes seulement, idempotente, fail-safe, lots de 50, marqueur `DataPatch` `catalogue-content:v1` écrit après succès des 4 sections.

## Vérification réelle — base locale (29/09/2026)

Base : `postgresql://postgres@127.0.0.1:55432/marrant`, sauvegarde `pg_dump` prise avant. Scénario : textes de l'ANCIEN catalogue (commit `556cdaf`) remis en base (264 vannes, 65 conseils, 89 vidéos, 3 parcours), marqueur absent, puis exécution de la tâche en `NODE_ENV=production`.

| Contrôle | Résultat |
|---|---|
| 1re passe | vannes : 251 mises à jour (**249 renommées** via `previousContent`, 2 mises à jour sur place), 13 inchangées, 0 absente ; conseils : 65 (1 renommé via `previousTitle`) ; vidéos : 89 ; parcours : 3 (description seule) ; ~1,3 s |
| Créations / suppressions / désactivations | 0 / 0 / 0 (265 vannes non IA avant et après, 0 content en doublon) |
| Conformité au seed | 264/264 vannes (texte, chute, décryptage) ; 65/65 conseils ; 89/89 vidéos ; 3/3 parcours |
| Vannes seed actives avec décryptage | 264 |
| 2e passe (marqueur présent) | skip total : « déjà appliqué » |
| 2e passe après suppression du marqueur | 0 update (264 + 65 + 89 + 3 inchangés) |
| Cas limite : vanne IA + vanne seed doublon portant l'ancien texte | intactes toutes les deux, « 1 alias ignoré (doublon évité) », 1 seule ligne avec le nouveau texte |
| Build de production | OK ; les 4 JSON de seed et `joke-decryptages.json` sont embarqués dans le chunk serveur d'`instrumentation.js` |

Écart avec la simulation précédente (247 renommées) : ici 249, parce que la restauration a remis les 249 anciens textes. En prod, le nombre dépend des textes réellement en base ; une vanne dont ni le nouveau texte ni un alias n'existe est comptée « absente » et n'est pas créée.

## Réappliquer après une nouvelle réécriture des seeds

Incrémenter `CATALOGUE_CONTENT_PATCH_VERSION` dans `startup-tasks.ts` (nouveau patchId `catalogue-content:v2`), ou supprimer la ligne `DataPatch` `catalogue-content:v1`.
