# QA indépendante : widget « La vanne du jour », tour 2 (s22)

Commit audité : `6040311f` (branche `claude/ouverture-session-nzwj0w`), non déployé, `WIDGET_VANNE_DU_JOUR_PUBLIE = false`.
24/10/2026, @qa. Aucun déploiement, aucune écriture en base, aucun commit. Rapport @fullstack non pris pour preuve : tout est rejoué.

## Verdict

(en cours)

## Contrôles

| # | Contrôle | Statut | Preuve |
|---|---|---|---|
| L1 | Liste blanche = `selection-finale.md`, aucune catégorie exclue | PASS | `[STATIQUE]` 93 identifiants extraits de la config, 93 uniques, `diff` avec le bloc de `selection-finale.md` : vide. Jointure avec les 114 candidates de `widget-candidats-s22.md` : 93/93 trouvées, ABSURDE 7, AUTODERISION 10, BOULOT 21, CULTUREL 9, ECOLE 4, GAMING 3, OBSERVATIONNEL 5, PARENTS 15, RESEAUX_SOCIAUX 9, SITUATION 10 ; 0 DATING/SOIREES/COUPLE ; les 8 désaccords absents |

## Défauts restants

(en cours)
