# Notation de la relance, cycle 8 : K7 Fiabilité de la chaîne (@qa, 07/10/2026, soir)

> Objet : même critère et même échelle qu'au cycle 7 (K7, chaîne base → `publish-social` → Buffer, plus le script de lot). État réel du 07/10 au soir : semaine 0 publiée, lot 1a en dry-run, à insérer au plus tard le 09/10. Aucun fichier de code modifié. Les travaux s16 et s17 (parcours, compte) sont hors du périmètre.
> `[LIVE]` = lecture réelle ; `[LIVE local]` = vrai code exécuté dans ce shell (Jest, dry-run dans `/tmp`) ; `[STATIQUE]` = lecture du code ; `[DÉCLARÉ]` = preuve consignée par la session dans `REPLIT_ACTIONS.md` ou un relevé, non revérifiable d'ici (pas d'accès Neon ni Buffer dans cette notation).
> HEAD = `32e4c45`.

## Note K7 : (en cours)

## Les 5 points « Pour 10/10 » du cycle 7
(en cours)

## Tests Jest `[LIVE local]`
`npx jest src/__tests__/lib/social src/__tests__/api src/__tests__/scripts` : **58 suites, 804 tests PASS** (24,2 s). Le worker forcé à quitter du cycle 7 est toujours là (fuite de minuterie, non isolée).

## Dry-run du lot 1a `[LIVE local]`
(en cours)

## Défauts et angles morts
(en cours)

## Pour 10/10 (liste exacte)
(en cours)
