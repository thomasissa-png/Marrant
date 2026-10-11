# Corrections cycle 8, relance sociale : code et données (@fullstack, 07/10/2026, soir)

> Sources : `notation-relance-cycle8-qa.md` (D1 à D4), `notation-relance-cycle8-reviewer.md` §3 (K5 a et d), `notation-relance-cycle8-social.md` §4 (S5 à S8, C7), `corrections-cycle8-copy.md` §3, décisions de la session (relecture à l'aveugle du 07/10). Reprise d'un travail non commité après redémarrage. **Aucun déploiement, aucun `--insert`, aucun `--rollback --confirmer`** : dry-runs et SELECT seulement, sorties dans `/tmp/fs-c8/`.

## Points, statut, preuve

| # | Point | Statut | Preuve |
|---|---|---|---|
| 1 | QA D1 : `--rollback` borné par `--debut`/`--fin` | **Fait** | `annulerLot(..., periode?)` et `requeteAnnulation(..., periode?)` (`social-lot-v5-insert.ts`) filtrent `scheduledAt` sur `bornesLot(debut, fin)` (comptes, `updateMany` en `tcp`, `UPDATE` en `neon-http`) ; `prepare-social-month.ts` passe `a.debut`/`a.fin`. Test `social-lot-rollback-tranche.test.ts` : 2 tranches du même approvedBy en base simulée, rollback de la 2e = 1re intacte (APPROVED), bornes UTC dans le SQL HTTP ; sans période, tout le lot (ancien comportement) |
| 2 | QA D2 : contrôle après insertion limité aux replis du lot inséré | **Fait** | `replisLus` filtré par `scheduledAt: periode` ; même test : 2e tranche insérée après la 1re = 0 écart |
| 3 | Reviewer K5 d, Social S6 : V028 et V060 exclues du tirage | **Fait** | `RESERVEES_CARROUSEL` (`social-lot-v5-fixes.ts`) lu par `libre()` (tirage, replis, relais) ; erreur bloquante dans `controlerLot` si l'une est tirée. Test `social-lot-v5-legendes.test.ts` : les 2 en tête de `--pool`, la 3e (témoin) est tirée, elles non. Dry-run 1b (19 au 25/10) : 0 occurrence de V028 et de V060 |
| 4 | Fiche IG du 21/10 (V028) en post fixe du lot 1b | **Non intégrée, sur décision de la session** | Cartes 3 et 4 en échec à la relecture à l'aveugle : la fiche de remplacement arrive dans une passe suivante. V028 reste exclue du tirage. Technique vérifiée en base (SELECT `Joke`) : « La litote prise au sérieux », même texte que `vannes-actives-s17.json` l.382-391 (le `[À VÉRIFIER @fullstack]` de `fiche-ig-21-10.md` est levé) |
| 5 | V083 | **Documenté, lot 1a inchangé** | V083 n'est pas réservée : tirée en IG le 13/10 par 1a ; le carrousel du 23/12 prendra une autre vanne avec le lot 2b (commentaire de `RESERVEES_CARROUSEL`, `lot-1a-dry-run-07-10.md`) |
| 6 | Social S7 : pieds de légende dans le code | **Fait** | 0 « deviens-marrant » dans les légendes : IG3, IG1, Halloween sans pied, relais 22/10 « À envoyer à ton hôte d'anniversaire. Les 20 autres textes : lien en bio. » ; `FORMULES.pied` supprimé ; les tirages Instagram ne reçoivent plus le pied mais la légende de leur vanne (`social-lot-v5-legendes.ts`, 46 légendes recopiées des livrables @copywriter, source par ligne) |
| 7 | Social S7 et copy §3.2 : contrôle des légendes au dry-run | **Fait** | `controlerLegendesInstagram` : erreur si absente, sans « À envoyer à » en tête, plus de 80 caractères, lien ou « deviens-marrant » (posts et replis) ; avertissement si même tournure deux fois de suite. Tests dans `social-lot-v5-legendes.test.ts` |
| 8 | Copy §3.3 (S8) : garde du lien de bio | **Fait (avertissement)** | Avertissement pour toute carte « Le quiz est dans le lien de la bio. » et toute légende finissant par « lien en bio », avec la date de la veille ; aucune lecture de `mesure.md` (contrôle manuel, comme demandé) |
| 9 | Copy §3.4 (C7) : plafond « copain / copine » | **Fait en avertissement** | `COPAIN_RE`, `PLAFOND_COPAIN_PAR_SEMAINE = 2` `[HYPOTHÈSE]` (`social-lot-v5-config.ts`), avertissement par semaine dans `controlerLot`, jamais d'erreur ni de remplacement. Dry-run 1a : 3 la semaine du 12/10 (IG 13, X 14, X 15), signalés, non remplacés |
| 10 | X3 du 21/10 : renvoi = `FORMULES.quizCourt` | **Fait** | « Humour d'Observateur. » retiré ; texte du dry-run 1b : 330 bruts, **246 `longueurX`** (≤ 270). Test dédié. Relais X du 12/10 non touché |
| 11 | Copy §3.1 (entrée FIXES du 21/10), §3.5 (renvois) | **Non appliqués** | §3.1 : voir point 4. §3.5 : seul X3 est tranché (point 10) ; renvoi du 12/10 attendu |
| 12 | Fiche `lot-1a-dry-run-07-10.md` refaite | **Fait** | Dry-run relancé sur le code actuel ; V053 retirée (`fa67cfe`), 12 posts, verdict à jour, stock expliqué |
| 13 | Lot 1a identique sur ses 12 posts | **Prouvé, sauf 5 légendes IG** | Même commande sur `4e84336` (worktree) contre le code actuel : 15 lignes (12 posts, 3 replis), 17 champs, mêmes `id` ; 0 différence hors légende Instagram. Les 5 légendes changent par correction nécessaire ([CHOIX UTILISATEUR] du 06/10 : pas de pied). **3 légendes manquent** : dry-run 1a bloqué tant que @copywriter ne les fournit pas |
| 14 | Relevé du 07/10 : 313 ou 328 caractères | **Corrigé : 328** | SELECT du texte en base (`c2acdc88db93f4686071f6068`) : 328 bruts (328 points de code), **244 `longueurX`** ; `releves/2026-10-07.md` l.7 corrigée (313 et environ 229 étaient faux) |
| 15 | Stock 22 contre 23 | **Expliqué** | Exclusions au 12/10 : 11 vannes en base depuis moins de 90 jours, pas 10. La 11e est `cs14jk72ac436450535a3c29`, publiée sur X le 02/10 (`preparation-mensuelle`, SELECT `SocialPost`). Matin (pool 40) : 40 − 3 − 4 − 11 = 22. Soir (pool 42, V028 et V060 exclues) : 42 − 3 − 4 − 11 − 2 = 22 |

## Ce qui bloque encore, par qui

- **@copywriter, avant le 09/10 10:15 UTC** : 3 légendes « À envoyer à... » pour le lot 1a : `cs14jk9a9e7a1b8e0e16264e` (IG 15/10), `cmmnsqn120000th63o435xsb0` (IG 16/10), `cs14jke10b58d158ae638560` (repli IG 12/10). Ligne à ajouter dans `apps/web/scripts/content/social-lot-v5-legendes.ts`.
- **Lot 1b (prêt du 14/10)** : à régénérer après l'insertion de 1a (le tirage changera : V083 et V007 sortent aujourd'hui en 1b faute de 1a en base). Légendes à fournir pour les vannes tirées, fiche du 21/10 de remplacement, renvoi du 12/10.
- Décision d'erreur bloquante pour une légende absente : une légende vide n'est pas prouvée acceptée par Buffer pour Instagram, et le pied est exclu par Thomas ; aucun texte inventé.

## Vérifications

`npx tsc --noEmit -p tsconfig.build.json` : 0 ; `npm run lint` : 0 erreur ; `npm run build` : OK ; `npx jest` : 262 suites, **3 787 PASS**, 2 ignorés comme avant ; les 2 fichiers de test neufs portent 22 tests. Les 28 erreurs `tsc` du `tsconfig.json` complet sont antérieures et hors périmètre (tests `lib/*`), aucune dans les fichiers touchés. Fichier temporaire `scripts/content/.tmp-compare-1a.ts` supprimé (copie hors dépôt `/tmp/fs-c8/compare.ts`).
