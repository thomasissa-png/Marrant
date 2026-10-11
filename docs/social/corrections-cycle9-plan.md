# Cycle 9 : plan des corrections (session principale, 11/10/2026)

> Notes cycle 9 : @reviewer 9,5 (K1 9,5, K2 9,5, K5 9, K9 10) ; @design 9,25 (K3 9, K4 9,5) ; @social 9,20 ; @qa K7 9,5 ; @growth 9,2 (K1 9,5, K6 9, K8 9). Sources : `notation-relance-cycle9-*.md`.

## Décisions de la session (tranchées une fois)

- **C9 (@social, 4 conseils à 8/8)** : la barre des conseils reste **8 chez les 2** (`plan-execution-s15.md` §3, `mix-formats-s15.md` §4). Le point tombe ; K2 est lu avec cette barre.
- **G4 (@growth, substitution d'IG2 par le chargeur)** : non retenue. La règle écrite au lot s'applique (`lot-relance-s15.md`, Avertissements) : sans lien de bio posé, légende tronquée à sa 1re phrase (programmé le 12/10 15:00 UTC), et IG3 sans sa 5e partie (13/10 19:00 UTC). Le chargeur reste réservé (V1, 20/10 X).
- **R2 (@qa) et G9 (@growth), titres « NE PAS INSÉRER »** : corrigés le 11/10 (`1b50534`).
- **R1 (@qa), `--rollback` sans dates** : corrigé (`d019b2c`).
- **K2 (@reviewer), guillemets du X du 15/10** : corrigé en base le 11/10 ; source au catalogue et contrôle bloquant après l'insertion du 1b.
- **S12 (@social), cartes 1a** : 13 cartes Instagram (12 au 16/10) rendues en ligne et relues le 11/10, conformes (R6, aucun débordement ; 5e partie d'IG3 dans la carte 4). Carte LinkedIn du 15/10 relue.

## Répartition

| Lot | Points | Agent | Butoir |
|---|---|---|---|
| OG | @design 1 (4 Open Graph alignés, `corrections-cycle8-design.md` §1) : code, rendu relu, déploiement | @fullstack, @design, session | déployé avant le 13/10 06:15 UTC |
| Mesure | G2 baseline 2 (hors captures d'abonnés), G3 SQL « compte gratuit », G5, G6, G7, G10 | @data-analyst (seul à éditer `mesure.md`) | G3 avant le 12/10 04:30 UTC ; le reste 12/10 |
| Stratégie | G8 (stock 22), G11 (dates), clause Marc (@reviewer K1), chiffres du plan (@reviewer K5) | @growth (hors `mesure.md`) | 12/10 |
| Copy | C10 (LinkedIn bureau, 2e tour de 6 situations, à l'aveugle), V083 hors du 23/12 dans les docs (@reviewer) | @copywriter puis 2 relecteurs | 19/10 (vanne LinkedIn du 20/10) |
| Scripts | F5 (dry-run lot 2a 16/11 au 03/01), F4 (`[jour:dimanche]`), guillemets à la source + contrôle bloquant, C7 « date » en avertissement | @fullstack, après l'OG et après l'insertion du 1b | 26/10 |
| Insertion 1b | S13 : contrôles avant et après | session | 13/10 06:30 UTC (programmé) |
| H+45 | carte LinkedIn du 15/10 | session | 15/10 07:00 UTC (programmé) |
| Thomas | T1 liens de bio, T2 bios et bannières, T3 épingler le X du 07/10, captures d'abonnés (baseline 2), client Stripe de test | Thomas | 11/10 |
| Trace | `git diff --stat` consigné pour chaque correction (@reviewer, point 8) | session | à chaque commit de correction |

## Avancement au 11/10, 08:40 Paris

| Lot | État |
|---|---|
| OG | **Déployé** (version `151dcc45`), relecture @design GO, C1 à C4 faits ; suivi : résolution des vannes à préfixe d'id partagé (`cs18jkstor…`) |
| Mesure | Fait (`aaf29ad`) ; G3 0 occurrence ; baseline 2 relevée (`ae93b83`), abonnés `[à relever par Thomas]` |
| Stratégie | Fait (`e19c554`, 12 lignes) |
| Copy | C10 tranché (`437d79b`) : 20/10 n°6, 27/10 n°1 ; échange en base programmé le 13/10 07:30 UTC ; V083 retirée des docs (`29099c9`, 7 lignes) |
| Scripts | `--rollback` sans dates refusé (`d019b2c`) ; F5, F4, guillemets à la source après le 13/10 |
| K2 | guillemets du X du 15/10 corrigés en base |
