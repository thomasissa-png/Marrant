# E1 aux abonnés en résiliation programmée, et phrase 5 C en annuel (07/11/2026)

> Draft de référence, pas un avis juridique : validation par un avocat. Complète `resiliation-onboarding-cadre-s23.md` (F2, F3 et point 7 de sa liste avocat sont modifiés ci-dessous). Le choix de Thomas du 07/11 (E1 aussi aux résiliés tant que l'accès est ouvert) n'est pas rouvert : on fixe les conditions d'exécution.
> Limite des sources : extraits CNIL (NS-048, FAQ pixels, délibération Accor SAN-2022-017) lus par recherche, L34-5, L121-1 et suivants, L221-5 et L215-1 non relus sur Légifrance. Étiquettes : [LU-2D] relevé dans une source seconde, [PRUDENCE] règle de prudence sans texte lu.

## Risques en 5 points

1. E1 reste défendable comme message sur le service déjà souscrit (contrat en cours, accès payé ouvert). Le risque est le contexte : envoyé à quelqu'un qui vient de dire qu'il part, il peut être lu comme une tentative de rétention, donc comme une promotion de l'image du service.
2. Par prudence, on le traite comme de la prospection « client existant » : expéditeur clair, lien d'arrêt, opposition respectée à chaque envoi. Ça existe déjà dans E1, donc coût nul.
3. Le vrai danger n'est pas l'envoi mais le texte : aucun mot qui culpabilise, presse ou offre de revenir. La phrase de tête du panel passe (une correction de grammaire).
4. Arrêt immédiat et prouvable si rétractation, remboursement, paiement échoué, suppression de compte ou opposition (y compris par réponse à l'e-mail, car `replyTo` = alex@).
5. O1 est justifié : en annuel, la phrase 5 C ne doit pas s'afficher.

## (a) E1 pour une résiliation programmée

**Nature.** Un e-mail qui explique comment se servir de ce qui est déjà payé, sans autre offre, relève des messages liés au contrat en cours (cadre D2) [LU-2D]. Il ne devient pas de la prospection du seul fait de la résiliation programmée : le contrat court jusqu'à la fin de période. Mais une résiliation exprime l'intention de ne plus acheter, et un message qui incite à rester peut être requalifié [PRUDENCE]. On applique donc le régime le plus strict, qui est aussi celui de E1 tel qu'écrit.

**Base si requalifié en prospection.** L34-5 CPCE, exception « produits ou services analogues » : adresse recueillie lors d'une vente, même vendeur, service analogue, possibilité de s'opposer gratuitement à la collecte et à chaque message, annonceur identifié [LU-2D, CNIL NS-048]. Un abonné payant est un client (le simple compte ne l'est pas, cadre D1). Pas de pixel d'ouverture ni de suivi de clic (la CNIL ne les exempte pas pour ces e-mails) [LU-2D].
**Base RGPD** : exécution du contrat (art. 6.1.b) pour le fond, intérêt légitime (6.1.f) si requalifié ; droit d'opposition absolu à la prospection (art. 21.2 et 21.3) [LU-2D].

**Conditions d'envoi (toutes obligatoires)**
- C1. Paiement confirmé et accès ouvert au moment de l'envoi (date de fin d'accès non échue). Aucun envoi après la fin d'accès.
- C2. Un seul envoi, E1 à J5, rien d'autre. E2 (J21) reste arrêté pour les résiliés : le choix de Thomas ne porte que sur E1, pas de relance, pas de variante « dernière chance ».
- C3. Arrêt immédiat, avant l'envoi même programmé, si : rétractation exercée, remboursement, paiement échoué, suppression du compte, clic sur le lien d'arrêt, opposition reçue. Un abonné qui a repris son abonnement (réactivation) repasse au régime normal.
- C4. Opposition : le lien d'arrêt en un clic sans connexion reste en pied, identique, avec `List-Unsubscribe`. Une réponse du type « arrêtez » à alex@ vaut opposition : traitée sous un jour ouvré et reportée dans la base (le lien d'arrêt suffit à la loi, mais ignorer une opposition écrite est une faute) [PRUDENCE].
- C5. Journal par envoi : identifiant de compte, numéro de l'e-mail, date, cas d'arrêt éventuel. Conserver la trace d'une opposition au moins 3 ans, utilisée uniquement pour la respecter [LU-2D, CNIL].
- C6. Pas de pixel ni de suivi de clic ; le `?src=` de lien reste un paramètre d'URL, sans identifiant personnel.
- C7. Le motif donné à la résiliation n'est jamais utilisé pour choisir ou personnaliser E1 (finalité distincte : amélioration du service) [PRUDENCE, RGPD art. 5.1.b].
- C8. Information à la collecte (point cadre D4, toujours non vérifié) : une phrase dans la confidentialité, du type « Après ton abonnement, on t’envoie deux e-mails d’accueil ; tu les arrêtes en un clic. » À confirmer présente avant l'ouverture aux résiliés (sinon l'exception « client existant » est fragile). Une phrase, pas de nouveau document.

**Ton et contenu : à éviter**
- Toute mention de la résiliation (« tu as résilié », « avant de partir », « tu vas nous manquer »), de motif, de regret, de « dernière occasion », de compte à rebours ou d'urgence.
- Tout bouton ou lien « annuler ma résiliation », « rester », « reprendre mon abonnement », tout lien vers la page abonnement, toute remise, tout prix, toute question « pourquoi pars-tu ? ».
- Le contenu de E1 reste identique pour tous (même carnet, même réplique). L'objet ne change pas et ne mentionne ni la date de fin ni l'abonnement.

**Phrase de tête.** Celle du panel convient, une faute corrigée (« jusqu’à la » devient « jusqu’au ») : fait vrai (accès jusqu'à la fin de la période payée, comme dit dans E0), neutre, sans pression, sans offre. Rendue seulement si résiliation programmée, juste après « Salut {prénom}, » (ou « Salut, »), avant le corps de chaque version :

`Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.`

Rien d'autre ne change dans E1 : même corps, même pied d'arrêt. Si la réplique du carnet (choix du 07/11) remplace le lien seul, la phrase de tête ne s'y ajoute pas d'appel supplémentaire.

## (b) O1 : phrase 5 C en annuel

**Justifié.** La phrase « Prends ton temps pour te faire un avis : d’ici le {date}, tout est ouvert, et tu pourras encore résilier la veille. » est vraie dans les deux cas. En annuel, {date} est dans douze mois, et elle encourage à attendre alors que seuls les 14 jours de rétractation ouvrent un remboursement intégral. Omettre ce qui change la décision de l'acheteur, au moment où on l'invite à ne pas décider, est le terrain de la pratique trompeuse par omission (L121-3, non relu) [PRUDENCE]. Le paragraphe de rétractation reste dans l'e-mail, mais la phrase pousse en sens inverse juste au-dessus.

**Ce n'est pas rouvrir l'étalon 5 C** : aucun mot ne change, la phrase est conservée pour le mensuel (où elle est exacte : un mois à attendre, rien à perdre). C'est une condition de rendu.

**Texte pour l'annuel : aucune phrase.** Les lignes « Résilier : … » et « Droit de rétractation : … » du bloc contractuel suffisent et disent le vrai. Ajouter une phrase de remplacement (« tu as 14 jours pour te faire un avis, remboursé en entier ») ne ferait que répéter la mention suivante. Condition de rendu à ajouter : `[si mensuel]` devant la phrase 5 C. Le rappel avant renouvellement annuel (J-40 à J-32) existe (choix du 04/10).

## v3 (07/11/2026) : variante PARCOURS et plan jusqu'à finAcces

Draft de référence, pas un avis juridique. Lu : `docs/copy/onboarding-premium-s23-emails.md` (v3) et `apps/web/src` (webhook, `stripe-subscription.ts`, `subscription-state.ts`).

**1. Variante de tête PARCOURS : VALIDÉE telle quelle.**
`Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici où tu en es.`
- Même fait que la phrase légale (accès payé jusqu'à la fin de période), aucune offre, aucune mention de résiliation, ni prix, urgence, lien « rester » : les critères du (a) sont tenus. Elle lève la contradiction avec « Tu reprends là où tu en étais ».
- Conditions : rendue seulement dans la version PARCOURS ET en résiliation programmée ; C1 à C8 inchangées. Les versions CARNET et OUVERTS gardent « voici par où commencer ». Le choix de version reste fondé sur l'avancement du parcours (règle identique pour tous les abonnés), jamais sur la résiliation ni son motif (C7).
- Le texte du copywriter peut passer de « [À VALIDER @legal] » à appliqué. Validation avocat inchangée (point 2 de la liste ci-dessous).

**2. Plan PREMIUM jusqu'à finAcces : confirmé, E1 CARNET peut promettre une fiche réservée.**
- Une résiliation programmée laisse l'abonnement Stripe `active` avec `cancel_at_period_end` : `STATUS_MAP.active = ACTIVE` (`apps/web/src/app/api/stripe/webhook/route.ts:37`), et `handleSubscriptionUpdated` pose `plan: "PREMIUM"` pour `active`/`trialing` (l. 194-198, écriture l. 200-208). Seul le drapeau `cancelAtPeriodEnd` est recopié (`stripe-subscription.ts:22-24`).
- Le passage à FREE n'arrive qu'à `canceled`/`unpaid`/`incomplete_expired` (route.ts:46, 192-194), à `customer.subscription.deleted` (l. 224-232, donc à la fin réelle) ou au remboursement total (l. 380-387). Ce sont exactement les cas d'arrêt C3.
- `subscription-state.ts:11,23` : la résiliation programmée n'existe que tant que le statut est en cours (ACTIVE, PAST_DUE, TRIALING).
- Réserve 1 : en PAST_DUE le plan reste PREMIUM (route.ts:193, 240) mais C3 arrête E1 pour paiement échoué ; le test d'envoi doit donc exiger `status` ACTIVE ou TRIALING, pas seulement `plan = PREMIUM`.
- Réserve 2 : `finAcces` ne doit pas être lu seul dans `currentPeriodEnd` : le webhook utilise `cancel_at` quand il existe (route.ts:172), alors que la base ne stocke que la fin de période (`periodEndData`, `stripe-subscription.ts:47-50`). Si `cancel_at` diffère, la date de la phrase de tête serait fausse. À corriger par @fullstack avant l'ouverture aux résiliés, sinon la phrase devient inexacte.
- Non relu : `carnetViewForPlan` (`carnet.ts:172-189`) lit le plan de l'utilisateur d'après le copywriter ; je n'ai pas rouvert ce fichier.

## À faire valider par l'avocat
1. E1 aux résiliés : relationnel ou prospection « client existant » (nous prenons le second par prudence).
2. Phrase de tête : une mention de la date de fin d'accès près d'une résiliation est-elle une pression ?
3. Information à la collecte (C8) suffisante pour l'exception.
4. Phrase 5 C en annuel : omission ou non ; durée de conservation du journal (C5).
