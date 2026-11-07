# Relecture à l'aveugle v2 : onboarding Premium s23 (E0, E1 x3, E2), @reviewer, 07/11/2026

Texte relu : `docs/copy/onboarding-premium-s23-emails.md` lignes 1 à 205 (journal v1 → v2 et revues précédentes non lus avant notation).
Références : `docs/copy/ton-alex.md`, `docs/legal/onboarding-e1-resilies-s23.md`, `docs/founder-preferences.md` (07/11, non re-questionné), code `apps/web/src`.

## Faits vérifiés dans le code

| Fait annoncé | Vérifié | Évidence |
|---|---|---|
| `ficheOfferte` = fiche `offerte`, sinon `fiches[0]` | Oui | `lib/carnet.ts:101-103` |
| Champs `situation`, `onTeDit`, `reponse`, `pourquoi` | Oui | `lib/carnet.ts:33-42` |
| `getCarnetExtrait` (null sans carnet du mois) | Oui (ligne) | `lib/carnet.ts:237` |
| Parcours en cours (≥ 1 étape validée, ≥ 1 restante), premier parcours retenu | Oui | `rappels/rappel-parcours.ts:180-186, 200` |
| `parcoursTitre`, `etapeNumero`, `etapeTitre` (repli « Étape n »), `lienEtape ?src=` | Oui | `rappel-parcours.ts:123-125, 211-215` ; `titreEtape` non exportée (l. 123), signalé à juste titre |
| Rappel activable depuis le profil | Oui | `rappel-parcours.ts:217` (`/profil#rappel-parcours`) |
| Toutes les étapes ouvertes avec Premium | Oui | `parcours-detail.tsx:512-513` |
| `{N}` = `PARCOURS_COUNT` | Oui | `config/premium.ts:89` |
| Bloc contractuel mot pour mot | Oui | `config/textes/paiement.ts:279-291, 295-299` ; seule « Tout est ouvert… » (l. 293) retirée |
| `SIGNATURE` « L’Équipe Deviens Marrant » | Oui | `paiement.ts:27` |
| `replyTo` alex@ | Oui | `config/question-equipe.ts:22` |
| Lettre « chaque jeudi, un clic, chaque lettre ou profil » | Oui, incomplet | `lettre-hebdo-s21.ts:42-43` dit aussi « une semaine par mois, c'est la lettre du mois » (déjà en attente Thomas, S1) |

## Notes

| # | Critère | Note /10 | Constat |
|---|---|---|---|
| 1 | Exactitude | 8 | Faits produit tous justes. Mais la règle d'envoi « pas la semaine où son rappel de parcours est parti : glisse au premier jour libre » (l. 89, reprise pour E2 l. 176) bloque E1 et E2 indéfiniment pour un abonné au rappel actif : le rappel est hebdomadaire, donc chaque semaine contient un rappel (rappel le lundi : aucun jour libre n'existe jamais). |
| 2 | Ton d'Alex, tirets, émojis, pression | 9 | Zéro tiret cadratin, zéro émoji, aucune urgence. Ouverture E1 carnet juste et concrète ; « lever les yeux au ciel » (E2) bien dosé. Seul reste corporate : « merci pour ta confiance », figé dans le bloc contractuel. Apostrophes droites des fiches (`'` dans `2026-11.json`) mêlées aux ’ du gabarit. |
| 3 | Clarté mobile, aperçu | 9 | Chaque première ligne tient lieu d'aperçu, sans redite d'objet, sauf E2 (« Trois semaines » dans l'objet et l'aperçu, étalon 4 A). « Celle de ce mois-ci : » a un antécédent flou (la situation ? la réplique ?). |
| 4 | Rétention sans pression | 9 | E1 carnet apporte de la valeur avant le lien (vraie réplique) ; PARCOURS ramène au bon endroit ; E2 ouvre la conversation. OUVERTS est mince mais honnête. |
| 5 | Cohérence entre e-mails et variantes | 8,5 | Résilié + PARCOURS : « voici par où commencer. » suivi de « Tu reprends là où tu en étais. » se contredit. `?src=` d'onboarding sur le lien parcours seulement, pas sur `/carnet` ni `/parcours` (OUVERTS). |
| 6 | Cadre légal | 9,5 | Bloc contractuel intact ; 5 C conditionnée au mensuel ; E1 résiliés conforme (C1 à C7 repris, objet inchangé, aucune mention de résiliation, aucun lien abonnement, E2 arrêté) ; C8 correctement mis en préalable. |

**Note globale : 8,5/10. Sous la barre (9/10) : NO-GO**, levé par la seule correction obligatoire ci-dessous (note attendue après correction : 9/10).

## Correction OBLIGATOIRE (texte exact)

**O1. Règle de glissement (l. 89, valable aussi pour E2 via l. 176).** Remplacer :
`Jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel (jeudi, numéro de la semaine parti en retard, rappel de parcours du jour), et pas la semaine où son rappel de parcours est parti : glisse au premier jour libre.`
par :
`Jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel (jeudi, numéro de la semaine parti en retard, rappel de parcours du jour), ni la veille ou le lendemain d'un rappel de parcours : glisse au premier jour libre. Le rappel étant hebdomadaire, un jour libre existe toujours dans les 5 jours ; si aucun ne se présente sous 7 jours, l'e-mail n'est pas envoyé (journalisé).`

## Corrections souhaitables (une ligne chacune)

- S1. Résilié + PARCOURS : soumettre à @legal une phrase de tête « …jusqu’au {date} : voici où tu en es. » pour cette seule version (texte imposé par le cadre, donc pas modifié ici).
- S2. CARNET : « Celle de ce mois-ci : » → « La fiche de ce mois-ci : » (antécédent clair).
- S3. CARNET : normaliser `'` en ’ dans les champs de fiche rendus dans l'e-mail.
- S4. E2 : « ça fait trois semaines que tu es là » est faux pour un ancien inscrit gratuit devenu Premium ; signaler à Thomas (« que tu es Premium »), étalon 4 A non modifié.
- S5. `?src=` d'onboarding aussi sur `/carnet` et `/parcours` (OUVERTS, E0 non concerné), pour mesurer les trois versions à égalité.
- S6. PARCOURS : « l’étape {n} est ouverte » laisse croire à un déverrouillage alors que tout est ouvert ; « t’attend » serait plus exact.
- S7. Bloc contractuel : « bouton « Résilier ton contrat » » alors que s23 en fait un lien (`abonnement-card.tsx:78`) ; à signaler à @legal, sans toucher au bloc ici.
