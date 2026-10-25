# Relecture à l'aveugle : rythme lettre de la semaine / lettre du mois (s22, 25/10/2026)

Périmètre lu : `apps/web/src/config/textes/lettre-hebdo-s21.ts`, `apps/web/src/components/lettre/arret-lettre-hebdo.tsx`, §10 de `docs/legal/lettre-hebdo-premium-s21.md`, `docs/qa/apercu-mensuelle-n1-s22.md`, les 16 captures `docs/qa/captures-question-equipe-s22/v8-*.png` (toutes ouvertes), `docs/copy/ton-alex.md`. Le 1er paragraphe sur la lettre de la semaine dans l'article 10 des CGU est hors périmètre, comme demandé.

## Note : 7/10. Verdict : NO-GO (2 bloquants, retouches d'un mot à une phrase)

Le gros du travail tient. Le profil, le retour de paiement, la page d'arrêt (avant et après), l'article 10 des CGU (2e ajout) et la fin de Premium disent la même chose : chaque jeudi une lettre, une fois par mois c'est la lettre du mois, et l'arrêt coupe tout, sauf inscription séparée. Le texte est tutoyé, il n'y a aucun tiret cadratin, et le rendu est propre en 390 comme en 1440 (pas de débordement, titres sur une ou deux lignes, bouton pleine largeur en 390). La version Premium de la lettre n°1 n'a aucun trou là où l'invitation a été retirée : le paragraphe de l'article enchaîne directement sur la formule de fin.

Il reste deux phrases fausses pour une partie des abonnés.

## Bloquants

### B1. Lettre du mois, version Premium : « Rendez-vous le mois prochain, » est faux pour un abonné

- Où : corps des numéros dans `apps/web/src/data/lettre/numeros.json` (n°1 et suivants). Visible dans `docs/qa/apercu-mensuelle-n1-s22.md` l. 82, et dans la capture admin, version des abonnés Premium.
- Ce que lit l'abonné : le jeudi 05/11, la lettre se termine par « Rendez-vous le mois prochain, ». Pourtant, une lettre réservée lui arrive le 12/11. Il peut aussi croire que sa lettre est passée au rythme mensuel. La version Premium ne se lit donc pas comme une lettre complète d'abonné.
- Retouche minimale, valable pour les deux versions, donc sans code et sans toucher au reste de la lettre gratuite. Dans chaque numéro de `numeros.json`, remplacer
  `Rendez-vous le mois prochain,`
  par
  `À bientôt,`
  (C'est vrai pour l'inscrit gratuit comme pour l'abonné. La lettre gratuite modifiée repasse l'aveugle, comme le veut la règle d'or.)

### B2. Confidentialité, finalité : « plus aucun numéro ne t'est envoyé » est faux pour l'abonné inscrit séparément

- Où : `CONFIDENTIALITE_LETTRE_HEBDO.finalite` (`lettre-hebdo-s21.ts` l. 170), capture `v8-confidentialite-section-8-lettre-*.png`, 4e puce.
- Ce que lit l'abonné : la phrase commence par « dont la lettre du mois une semaine par mois », puis dit « plus aucun numéro ne t'est envoyé ». Celui qui s'est inscrit séparément comprend qu'il perd aussi la lettre du mois. C'est faux, et ça contredit la page d'arrêt, les CGU et la fin de Premium, qui donnent toutes l'exception.
- Retouche minimale. Remplacer
  `Tu peux l'arrêter en un clic à tout moment : plus aucun numéro ne t'est envoyé.`
  par
  `Tu peux l'arrêter en un clic à tout moment : plus aucun numéro ne t'est envoyé, sauf la lettre du mois si tu t'y es inscrit séparément.`
  (Pas de juridique nouveau : c'est l'exception déjà écrite sur les autres écrans. Le §10.6 de l'avis est à aligner sur cette phrase.)

## Mineurs (non bloquants)

1. Retour de paiement (`LETTRE_HEBDO_INFO_PAIEMENT.recoit`) : dans « Tu peux l'arrêter en un clic », le « l' » renvoie grammaticalement à « la lettre du mois », la dernière nommée. Le sens reste juste, puisque l'arrêt la coupe aussi. Si on retouche : « Tu peux arrêter la lettre de la semaine en un clic, depuis chaque lettre ou ton profil. »
2. Profil, après désactivation (`LETTRE_HEBDO_UI.succesArret`) : « C'est arrêté. Ton abonnement continue. » ne redit pas que la lettre du mois s'arrête aussi, alors que la page d'arrêt le dit. Ce n'est pas faux, parce que la ligne du réglage dit déjà que la lettre du mois fait partie de la lettre de la semaine. Aucune capture de cet état.
3. CGU art. 10 et Confidentialité partie 8 : « lettre mensuelle » et « lettre du mois » désignent la même lettre (texte antérieur au chantier). On comprend, mais le même mot partout serait plus net. À traiter seulement au prochain passage sur ces pages.

## Contrôle par cas

| Cas | Profil | Paiement | Page d'arrêt | CGU | Confidentialité | E-mail |
|---|---|---|---|---|---|---|
| Abonné qui reçoit | vrai | vrai | n/a | vrai | vrai | **B1** |
| Abonné aussi inscrit séparément | vrai | vrai | vrai | vrai | **B2** | vrai (un seul e-mail, version Premium) |
| Abonné qui arrête | vrai | n/a | vrai (avant et après) | vrai | **B2** si inscrit séparément | vrai (cas particulier : version sans invitation, pied de la lettre du mois) |

Admin (interne, pas public) : le libellé « Ne part pas : semaine de la lettre du mois » et la mention « Part aussi aux N abonnés Premium… Cette semaine-là, pas de lettre réservée. » sont clairs. Les URL `localhost` ne viennent que de l'aperçu (jeton `apercu-sans-effet`).
