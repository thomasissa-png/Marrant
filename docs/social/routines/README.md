# Sessions planifiées (routines) de la relance des réseaux

> Créées par la session principale le 05/10/2026 (GO de Thomas, 05/10 : « Oui ok »). Plan de référence : `docs/social/plan-execution-s15.md` (§4 textes, §5 lots, §7 fiabilité, §8 démarrages, §9 pilotage). Heures de Paris. Toute routine se gère dans claude.ai (Routines) : pause, modification, suppression.

## Principe

- **Toutes les routines relancent la session principale** (`session_018LhMLAUcg6rWocuejGrCgR`), qui a le dépôt, les accès et tout le contexte. **Test du 05/10 21:14 (session neuve) : échec**, deux causes : (1) push refusé, le dépôt n'est pas dans les sources d'une session neuve créée par routine (« not in this session's authorized repository set ») ; (2) lecture Neon, Buffer et des variables refusée par le classifieur de permissions d'une session neuve (« Credential Exploration »). D'où le choix de relancer la session principale.
- **Jusqu'au 14/10** : pilotage quotidien et heures clés de la reprise. **À partir du 19/10** : deux routines hebdomadaires qui lisent le plan et font **ce qui est daté de la semaine**. Elles ne dépendent d'aucune liste figée : si le plan bouge, elles suivent le plan.
- **Filet** : les e-mails du job de couverture du Worker (déployé le 05/10) restent actifs ; si une routine ne part pas, Thomas colle le prompt reçu par e-mail.

## Registre

| Routine | Quand | Session | Rôle |
|---|---|---|---|
| Test (05/10) | 05/10 21:14, une fois | neuve | **échec** (voir Principe) ; seul le checkout a réussi |
| Pilotage quotidien | chaque jour 07:47, du 06/10 au 14/10 | principale | tâches datées du jour (pilote P0, notations, étalons conseil, lot 1a, déploiement du 10/10, tests C2) ; **06/10 en plus : correction du pilier non indexé** (`docs/seo/pilier-non-indexe-s15.md`, GO de Thomas du 05/10 : liens L1 à L7 déployés, étalons du haut de page soumis à Thomas avant tout brief copy) ; se désactive le 14/10 |
| GO/NO-GO et reprise | dim. 11/10 17:30 | principale | GO/NO-GO 18:00, reprise des 3 réseaux 20:00 à 20:30 |
| Vérifications H+45 | 12/10 13:15 (X), 12/10 20:15 (IG), 13/10 09:00 (LinkedIn) | principale | statut `sent`, lien réel, UTM, carrousel, texte alternatif |
| Relevé du lundi | lundi 07:52, du 19/10 au 29/03/2027 | principale | relevé (`releves/AAAA-MM-JJ.md`), fiche de jalon si un jalon tombe dans la semaine, alertes ; message à Thomas seulement s'il a quelque chose à faire |
| Production de la semaine | lundi 08:37, du 19/10 au 29/03/2027 | principale | lots, vagues V1 à V4, citations, articles, tests et déploiements datés de la semaine (§4 à §7) |

## Règles communes à toutes les routines

Lire `CLAUDE.md`, `project-context.md` puis le plan. Branche `claude/marrant-s10-session-recovery-CtZyw`. Aucun déploiement sans HEAD vert (tsc, lint, build, Jest). Aucun réseau rouvert sans les contrôles 1 à 6 (§5). **Jamais de mode 3/3/1 sans accord de Thomas (D8).** Zéro tiret cadratin et zéro mention d'IA dans tout texte publié ; humoristes nommés et cités autorisés (P0 s15). Base : pilote HTTP Neon. Toute action consignée dans `REPLIT_ACTIONS.md` et l'historique de `project-context.md`.
