# Sessions planifiées (routines) de la relance des réseaux

> Créées par la session principale le 05/10/2026 (GO de Thomas, 05/10 : « Oui ok »). Plan de référence : `docs/social/plan-execution-s15.md` (§4 textes, §5 lots, §7 fiabilité, §8 démarrages, §9 pilotage). Heures de Paris. Toute routine se gère dans claude.ai (Routines) : pause, modification, suppression.

## Principe

- **Toutes les routines relancent la session principale** (`session_018LhMLAUcg6rWocuejGrCgR`), qui a le dépôt, les accès et tout le contexte. **Test du 05/10 21:14 (session neuve) : échec**, deux causes : (1) push refusé, le dépôt n'est pas dans les sources d'une session neuve créée par routine (« not in this session's authorized repository set ») ; (2) lecture Neon, Buffer et des variables refusée par le classifieur de permissions d'une session neuve (« Credential Exploration »). D'où le choix de relancer la session principale.
- **Jusqu'au 14/10** : pilotage quotidien et heures clés de la reprise. **À partir du 19/10** : deux routines hebdomadaires qui lisent le plan et font **ce qui est daté de la semaine**. Elles ne dépendent d'aucune liste figée : si le plan bouge, elles suivent le plan.
- **Filet** : les e-mails du job de couverture du Worker (déployé le 05/10) restent actifs ; si une routine ne part pas, Thomas colle le prompt reçu par e-mail.

## Registre (relu le 07/10/2026 sur la liste réelle des routines actives)

**Règle unique pour Thomas : ne jamais archiver ni supprimer la session `session_018LhMLAUcg6rWocuejGrCgR`**, renommée « Marrant · poste de contrôle (routines, ne pas archiver) ». On peut ouvrir autant de sessions neuves que voulu pour d'autres sujets ; ne pas y faire pousser la branche `claude/marrant-s10-session-recovery-CtZyw` en même temps qu'une routine.

| Routine | Quand (Paris) | Rôle |
|---|---|---|
| Pilotage quotidien | chaque jour 07:47, jusqu'au 14/10 (se désactive seule après) | tâches datées du jour du plan (lot 1a le 09/10, déploiement du 10/10, tests C2, itération 10/10) |
| Lecture des alertes | chaque jour 07:57 | `GET /api/admin/alertes` : classe B corrigée à chaud, e-mail à Thomas seulement si action requise |
| H+45 X du 07/10 | 07/10 13:15, une fois | post quiz X de 12:30 publié ou non |
| H+45 Instagram du 07/10 + cycle 8 | 07/10 20:15, une fois | post IG de 19:30, puis les 5 notateurs (cycle 8) |
| Contrôle avant la semaine 1 | dim. 11/10 17:30 | bilan semaine 0, lot 1a en base, canaux Buffer, correction avant lundi |
| Indexation du pilier J+7 | mar. 13/10 08:37 | inspection Search Console |
| Indexation du pilier J+14 | mar. 20/10 08:37 | inspection + position, message à Thomas |
| Liens de bio avant carrousels | mar. 03/11 08:07 | sinon retrait de « lien de la bio » des cartes |
| Relevé du lundi | lundi 07:52, du 19/10 au 29/03/2027 | relevé, fiche de jalon, message seulement si action |
| Production de la semaine | lundi 08:37, du 19/10 au 29/03/2027 | lots, vagues, articles, tests et déploiements datés de la semaine |

Hors réseaux, mêmes règles : la routine « préparation mensuelle » (20 du mois) tourne en session neuve. Les H+45 des 12 et 13/10 prévus à l'origine sont supprimés (démarrage avancé au 06/10) : les posts de la semaine 1 sont couverts par la lecture des alertes (échec = alerte) et le pilotage quotidien.
Filet si une routine ne part pas : e-mails du Worker (au plus un par jour), Thomas colle le prompt reçu dans la session de contrôle.

## Règles communes à toutes les routines

**Garde de déploiement (07/10, branche partagée avec la session s16 « audit des parcours »)** : la branche porte du code s16 marqué « À DÉPLOYER » dans `REPLIT_ACTIONS.md` (migration Neon `12_add_retractation_request` et réglages Stripe/Cloudflare à faire par Thomas AVANT). Tant que cette section n'est pas passée en « DÉPLOYÉ », **aucune routine ne lance `deploy:cf`** : les correctifs sociaux passent par la base ou les scripts (aucun déploiement nécessaire) ; si un déploiement devient indispensable, message à Thomas en 2 lignes, sans déployer. Avant chaque commit : `git pull --no-rebase` (fusion, jamais de force).

Lire `CLAUDE.md`, `project-context.md` puis le plan. Branche `claude/marrant-s10-session-recovery-CtZyw`. Aucun déploiement sans HEAD vert (tsc, lint, build, Jest). Aucun réseau rouvert sans les contrôles 1 à 6 (§5). **Jamais de mode 3/3/1 sans accord de Thomas (D8).** Zéro tiret cadratin dans tout texte publié (l'IA comme sujet de vanne est autorisée depuis le 30/09) ; humoristes nommés et cités autorisés (P0 s15). Base : pilote HTTP Neon. Toute action consignée dans `REPLIT_ACTIONS.md` et l'historique de `project-context.md`.
