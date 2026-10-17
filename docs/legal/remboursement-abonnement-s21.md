# Remboursement « sous 14 jours » sur /abonnement (@legal, s21, 17/10/2026)

Draft de référence, pas un avis d'avocat. Chemins relatifs à `apps/web/src/`. Articles du Code de la consommation cités de mémoire et de guides secondaires, non relus sur Légifrance : `[À VÉRIFIER]`.

## Résumé en 5 points
1. La promesse est **vraie** : le site rembourse bien l'intégralité du premier paiement sur demande dans les 14 jours.
2. Elle est **légale** : ce n'est pas un cadeau commercial, c'est le droit de rétractation tel quel (L.221-18). Aucune renonciation n'est collectée, donc l'exception L.221-28 13° n'est pas invoquée : pas de conflit.
3. Elle est **cohérente** avec les CGU, la page /retractation et les e-mails. L'ambiguïté du libellé est réelle, mais les deux lectures sont vraies (voir §2).
4. Deux limites : le remboursement est **manuel** (Thomas dans Stripe) et il ne vaut que pour le **premier paiement**. Ne pas répéter la phrase ailleurs sans cette réserve.
5. Un vrai « satisfait ou remboursé » est possible mais ouvre des risques (§3). Verdict : **ne pas le faire pour l'instant**.

## 1. Ce que le site fait réellement
| Élément | Constat | Source |
|---|---|---|
| Phrase actuelle sous le bouton | « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux. » Étalon 1.1 VALIDÉ s16 (déjà dans le code, gardée telle quelle par le lot 2) | `config/textes/offre.ts` l.33-35 ; lot 2 §5.3 l.209, §5.6 l.264 |
| Texte de la page Stripe | « Tu as 14 jours pour te faire rembourser (formulaire : /retractation) » + obligation de paiement + résiliation en ligne | `config/textes/paiement.ts` l.119 |
| CGU art. 6 (pas de page CGV séparée : les CGU font office) | 14 jours dès la conclusion du contrat, sans motif ni pénalité ; remboursement « dans un délai de 14 jours suivant la réception de la demande » | `app/(dashboard)/cgu/page.tsx` l.46-48 |
| Périmètre | « ne vaut que pour le premier paiement, jamais pour un renouvellement » (règle Thomas 07/10) | `config/textes/juridique.ts` l.17-18 ; CGU l.50 ; `/retractation` l.42 |
| CGU art. 3 et 7 | Période payée non remboursée, « sous réserve de l'article 6 » ; suppression de compte = résiliation immédiate sans remboursement, sauf rétractation | CGU l.30-33, l.54-55 |
| Case de renonciation au checkout | **Absente.** Session Stripe sans `consent_collection` de renonciation ; seule case possible = CGU (`terms_of_service`), activée par variable d'environnement `[À VÉRIFIER en prod]` | `lib/stripe.ts` l.171-194, l.130-133, l.197-202 |
| Accès après paiement | Immédiat : Premium activé à `checkout.session.completed` | `app/api/stripe/webhook/route.ts` l.98-141 |
| Demande de rétractation | Enregistrée en base, e-mail à l'admin et accusé au client. **Aucun remboursement automatique** : l'e-mail admin dit « À faire dans Stripe : rembourser » | `app/api/retractation/route.ts` l.85-110 ; `paiement.ts` l.445 |
| Après le remboursement Stripe | Résiliation de l'abonnement Stripe et retour en gratuit, automatiques | `webhook/route.ts` l.326-371 ; `lib/stripe.ts` l.225-242 |
| Demande hors délai | Aucun refus automatique, accusé conditionnel, vérification par Thomas | `paiement.ts` l.373-386, l.422-427 |
| Choix fondateur | 04/10 : remboursement 14 jours pour tous, pas de case de renonciation ; 07/10 : premier paiement seulement | `docs/founder-preferences.md` l.47, l.69 |

## 2. Verdict : vraie, légale, cohérente
- **Légale.** Sans accord exprès de début d'exécution ni renonciation, le consommateur garde son droit entier, même s'il a tout lu pendant 14 jours. L.221-28 13° (contenu numérique) exige un accord préalable exprès et un renoncement exprès, rappelés sur support durable ; ce n'est pas déductible d'un paiement ou d'une acceptation générale des CGU. Le site n'a rien collecté : il ne peut donc pas refuser le remboursement et ne le prétend pas. Dire « remboursé sous 14 jours » est exactement ce que la loi impose, pas un engagement de plus.
- **Ambiguïté sans fausseté.** Lecture 1 (j'annule dans les 14 jours, je suis remboursé) : vrai. Lecture 2 (le remboursement arrive en 14 jours maximum, L.221-24) : vrai aussi, c'est la promesse de la CGU l.48 et de l'e-mail (`paiement.ts` l.258). Aucune des deux ne trompe, mais la phrase les mélange.
- **Réserves à connaître.**
  1. **Premier paiement seulement** : sous le bouton, au moment du premier achat, aucune fausse impression. Répétée dans un e-mail de renouvellement, sur le profil ou en social, elle serait trompeuse (renouvellement non remboursé).
  2. **Réabonnement après résiliation** : c'est un nouveau contrat, donc a priori un nouveau délai de rétractation. Le code le sait (`paiement.ts` l.425 : « réabonnement possible, vérifier dans Stripe »), mais la CGU dit « premier paiement » sans le préciser. À faire valider par un avocat.
  3. **Exécution manuelle** : le délai de 14 jours dépend de la lecture de l'e-mail admin. Thomas est absent du 18 au 25/10 : une demande reçue pendant ce créneau est à surveiller.
  4. **Achat via l'appli mobile** : hors de ce parcours (`paiement.ts` l.351 : « délai inconnu »). La promesse ne vaut que pour l'achat web.
  5. **Abus possible** (tout lire puis demander le remboursement) : conséquence assumée du choix du 04/10, pas un défaut juridique.

## 3. Formulations proposées (tutoiement, sans tiret cadratin)
Statu quo à garder si Thomas ne rouvre pas l'étalon 1.1 : « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux. » Il est vrai. Modifier l'étalon relève de Thomas (règle du 07/10) et d'un duel à l'aveugle (règle d'or s18).
| | Texte (mensuel ; l'annuel change le prix) | Avis |
|---|---|---|
| **A** | 2,99 € TTC par mois. **Tu as 14 jours pour te faire rembourser**, et tu résilies en ligne quand tu veux. | **Reco.** Reprend mot pour mot la formule Stripe déjà validée (`paiement.ts` l.119) : un seul message de bout en bout. Lève l'ambiguïté : 14 jours = ta fenêtre. |
| B | 2,99 € TTC par mois. Remboursé si tu changes d'avis dans les 14 jours, résiliable en ligne quand tu veux. | Clair et chaleureux. « Si tu changes d'avis » ne pose aucune condition de motif : exact (L.221-18). |
| C | 2,99 € TTC par mois. 14 jours pour te rétracter et être remboursé, résiliable en ligne quand tu veux. | Juridiquement la plus exacte, mais « te rétracter » est plus froid et plus long. |
À éviter : « satisfait ou remboursé » (suggère une condition de satisfaction ou un engagement au-delà de la loi), « garantie » (mot réservé, voir §4), « remboursé à tout moment ».

## 4. Pour une vraie garantie commerciale « satisfait ou remboursé »
Elle s'ajoute au droit de rétractation (au-delà de 14 jours, ou sur chaque paiement, ou après usage). À modifier :
1. **CGU art. 6** : scinder en « 6.1 Droit de rétractation (légal) » et « 6.2 Garantie commerciale Satisfait ou remboursé » (intitulé exact « garantie commerciale », mention qu'elle s'ajoute aux garanties légales).
2. **Contenu obligatoire de la garantie** (L.217-21 et suivants, `[À VÉRIFIER]` : conçus pour les biens, application aux contenus numériques à confirmer) : contenu, modalités, durée, étendue territoriale, exclusions, identité et adresse postale du garant (donc D3, toujours ouvert), remise sur support durable (e-mail de confirmation, `paiement.ts` l.231-271).
3. **Périmètre sans ambiguïté** : tous les paiements ou le premier ? Durée (30 jours ?) ? Remboursement total ou prorata ? Remplacer « premier paiement seulement » (`juridique.ts` l.17-18, repris dans CGU, /retractation et l'accusé).
4. **Alignement des textes** : `offre.ts` l.33-35, `paiement.ts` l.119 et l.258, accusé et e-mail admin, FAQ, JSON-LD éventuel, 34 encarts d'articles si repris.
5. **Process** : automatiser le remboursement ou fixer une règle d'instruction (Thomas seul dans Stripe), et écrire la procédure.
6. **Sortie du droit de rétractation (option 13°)** : si Thomas voulait un jour récupérer l'exception, il faudrait une case de renonciation au checkout (`lib/stripe.ts`), la confirmation sur support durable, et **retirer** la promesse du premier écran : elle deviendrait fausse pour ceux qui renoncent. À décider séparément, car contraire au choix du 04/10.

**Risques** : (a) double régime lisible comme une promesse trompeuse si les deux délais se mélangent (pratique commerciale trompeuse, L.121-2 `[À VÉRIFIER]`) ; (b) coût de remboursement sans plafond d'usage (2,99 € à 24,99 € par abus) ; (c) garantie défectueuse = due quand même, même si ses mentions sont incomplètes ; (d) charge manuelle pour un fondateur solo en déplacement ; (e) validation avocat indispensable avant mise en ligne.

## 5. Handoff
- **@copywriter / lot 2** : garder la phrase actuelle ou A ; ne pas la répéter ailleurs sans « premier paiement ». Si A, duel à l'aveugle et accord de Thomas (étalon 1.1).
- **@fullstack** : rien à coder. En option, automatiser le remboursement ; ajouter « réabonnement » à `RETRACTATION_PERIMETRE` après avis d'avocat.
- **Avocat** (liste s16 existante) : ajouter le réabonnement après résiliation et la garantie commerciale.
