# Relecture à l'aveugle express : lettre de la semaine (s22 v4)

Date : 2026-10-25 · Relecteur : @reviewer · Périmètre : texte A (profil, sous l'interrupteur), texte B (page « Lettre de la semaine arrêtée »), 6 captures `docs/qa/captures-question-equipe-s22/v7-*.png`.

## Verdict

**Note : 9/10 · GO**

## Critères

| Critère | Texte A | Texte B |
|---|---|---|
| Vrai (faits du brief) | PASS : incluse dans l'abonnement, envoi le jeudi à l'adresse affichée, lettre du mois en pause puis reprise à l'arrêt ou à la fin de l'abonnement. « deviens-marrant SAS » est aussi le nom utilisé sur la page Confidentialité (`apps/web/src/app/(dashboard)/confidentialite/page.tsx`) | PASS : l'abonnement n'est pas touché, la lettre du mois reprend, la lettre de la semaine peut reprendre depuis le profil tant que l'abonnement Premium court |
| Clair au premier coup d'œil | PASS : quatre phrases dans l'ordre logique (quoi, effet sur la lettre du mois, responsable, lien) | PASS : trois phrases courtes qui répondent aux trois questions qu'on se pose juste après l'arrêt |
| Tutoiement simple | PASS | PASS |
| Zéro tiret cadratin | PASS | PASS |
| Pas de juridique en plus | PASS : une seule phrase sur le responsable, plus le lien | PASS : rien |

## Captures (6/6 lues)

- 390 px (activé, arrêté) : l'adresse tient sur une seule ligne sans coupure, rien ne déborde de la carte et l'interrupteur se lit bien dans les deux états.
- 1440 px (activé, arrêté) : l'adresse est seule sur sa ligne, sans coupure ; la largeur du texte est bornée, donc il reste lisible et ne déborde pas.
- Page d'arrêt (390 et 1440) : le titre et le texte sont propres et aucune ligne n'est orpheline au point de gêner la lecture.

## Bloquants

Aucun.

## Non bloquants (pour info, pas d'action demandée)

- Texte A : le « elle » de la 2e phrase change de référent (lettre de la semaine, puis lettre du mois). On le comprend quand même, parce que « lettre du mois » arrive juste avant.
- Texte B : « reprend » et « reprendre » se suivent à une phrase d'écart. Ça ne gêne pas.
