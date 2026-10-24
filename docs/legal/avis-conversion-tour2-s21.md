# Avis @legal, tour 2 des textes de conversion (s21, 19/10/2026)

Draft de référence, pas un avis d'avocat. Articles cités de mémoire, non relus sur Légifrance : `[À VÉRIFIER]`. Sources lues : `docs/copy/conversion-s21/textes-trajet-v2.md` (faits 4, 6, 8 ; A04, A14, A15, W04, G02), CGU art. 3, 6, 7 (`cgu/page.tsx`), `docs/legal/remboursement-abonnement-s21.md`, `config/textes/juridique.ts`.

## Résumé en 5 points
1. Point 1 (prix sans « TTC » hors cartes et Stripe) : **OK**. Le prix affiché à un consommateur doit être TTC ; la lettre « TTC » n'a pas à figurer à chaque occurrence si aucun prix HT n'est affiché et si le prix TTC est explicite là où le contrat se conclut.
2. Point 2 (renouvellement annuel) : **OK sur la carte, À CORRIGER (mineur) sur /register et l'attente**. Sans « sauf résiliation », « renouvelé chaque année » peut se lire comme un engagement pluriannuel.
3. Point 3 (FAQ, 14 jours) : **OK**. Les deux phrases reprennent les CGU art. 6 et `RETRACTATION_PERIMETRE`. Aucun droit de rétractation n'est restreint.
4. Aucun blocage de mise en ligne.
5. Une réserve hors périmètre, à vérifier avant mise en ligne : l'e-mail de confirmation doit porter l'information de rétractation sur support durable (voir §3).

## 1. Prix « 2,99 €/mois » sans « TTC » : OK
- **Base** : le prix est dû et affiché en euros, toutes taxes comprises, au consommateur (Code de la consommation L.112-1 et arrêté du 3 décembre 1987 sur l'information sur les prix ; information précontractuelle L.111-1 et L.221-5 ; directive 2011/83/UE art. 6 §1 e) `[À VÉRIFIER]`). Je n'ai pas trouvé de texte qui impose la lettre « TTC » à chaque affichage d'un prix de service. Ce qui est sanctionné, c'est un prix incomplet ou trompeur (en 2018, 315 000 € contre deux opérateurs pour un total à payer non indiqué), pas l'absence d'un sigle sur un bouton.
- **Pourquoi c'est tenu ici** : (a) le site ne montre aucun prix HT nulle part, donc le prix lu est le prix payé ; (b) « TTC » est sur la carte de formule, où le visiteur choisit, et chez Stripe, au moment de l'obligation de paiement ; (c) les CGU art. 3 disent « prix toutes taxes comprises » ; (d) le site est B2C.
- **Risque** : faible. Il remonte à « pratique commerciale trompeuse par omission » seulement si un prix HT apparaissait ailleurs, ou si le total payé différait du prix affiché (frais, TVA ajoutée au paiement). Ce n'est pas le cas.
- **Garde-fous à tenir** : ne jamais afficher un prix HT sans TTC ; le montant chez Stripe doit rester identique au montant affiché (2,99 € et 24,99 €). `[HYPOTHÈSE à confirmer par Thomas : la TVA est bien incluse dans ces montants, ou le statut est la franchise en base (art. 293 B CGI, mention sur facture). Je n'ai pas cette donnée.]`
- **Forme minimale, si Thomas veut zéro discussion** : garder le texte actuel. Aucune correction exigée.

## 2. « Renouvelé chaque année, sauf résiliation. » : carte OK, /register et attente à corriger

**Carte annuelle de /abonnement : OK, texte inchangé.**
- Exact au regard des CGU art. 3 : annuel conclu pour un an, reconduit tacitement par périodes d'un an, résiliable à tout moment depuis le profil (art. 7). « Sauf résiliation » est vrai (la résiliation prend effet en fin de période).
- Suffisant : l'information de reconduction tacite et de résiliation est donnée avant le contrat (L.221-5, L.111-1 `[À VÉRIFIER]`), ici par la carte, la réassurance « Résiliable depuis ton profil » juste sous le bouton, et la page Stripe (« 24,99 € TTC par an, renouvelé chaque année »). Le rappel avant reconduction (32 à 40 jours) est dans la fenêtre « 3 mois à 1 mois » de L.215-1 : cohérent avec CGU art. 3.
- Point de vigilance : ne jamais écrire « au même prix ». Les CGU prévoient le « tarif annuel en vigueur indiqué dans l'e-mail de rappel ».

**/register (G02) et attente (A18) : À CORRIGER, mineur mais gratuit.**
- « Premium, 24,99 €/an, renouvelé chaque année. » est exact mais incomplet : sans la sortie, la phrase se lit comme une obligation de se réengager. La réassurance qui suit le dit, mais c'est la dernière ligne vue avant Stripe qui pèse.
- Texte exact corrigé, identique à la carte : **« Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. »**

## 3. FAQ prix : « Les 14 jours courent dès ton abonnement » : OK

- **Textes concernés** : A14 « Les 14 jours courent dès ton abonnement. Un renouvellement n'ouvre pas de nouveau délai. » ; A15 « Les 14 jours courent dès ton abonnement, annuel compris. Un renouvellement n'ouvre pas de nouveau délai. »
- **Exact vs CGU** : art. 6 (« à compter de la conclusion du contrat ») ; `RETRACTATION_PERIMETRE` (« à partir de ta souscription ; un renouvellement n'ouvre pas un nouveau délai de 14 jours »). « Dès ton abonnement » = la conclusion du contrat, au paiement (L.221-18 : prestation de services et contenu numérique non fourni sur support matériel, délai dès la conclusion `[À VÉRIFIER]`).
- **Exact vs politique de remboursement** : premier paiement seulement, mensuel ou annuel (24,99 € inclus), un renouvellement exclu. Identique. Pas de contradiction avec la réassurance « premier paiement remboursable sous 14 jours ».
- **Risque sur la rétractation** : aucun ajouté. Les phrases ne retirent rien au droit légal, ne collectent aucune renonciation (L.221-28 13° non invoqué), et ne conditionnent pas le remboursement à un motif. Le renouvellement tacite relevant de L.215-1 (rappel, résiliation, remboursement post-résiliation) et non d'un nouveau contrat, l'exclusion d'un nouveau délai est défendable `[À VALIDER par un avocat, déjà dans la liste s16]`.
- **Deux réserves, hors texte** :
  1. Le réabonnement après résiliation est a priori un nouveau contrat, donc un nouveau délai. Les phrases ne le nient pas (elles parlent de « renouvellement »). Ne pas les reformuler en « une seule fois par personne ».
  2. Si l'information de rétractation (délai, modalités, modèle de formulaire) n'est pas reçue sur support durable, le délai peut s'allonger jusqu'à 12 mois (L.221-20 `[À VÉRIFIER]`), et « les 14 jours courent » deviendrait inexact. À contrôler dans l'e-mail de confirmation (`paiement.ts`, accusé de souscription) : mention de la rétractation, lien `/retractation`, modèle de formulaire.

## 4. Handoff
- **@orchestrator / @fullstack** : appliquer la seule correction du §2 (G02 et A18, formule annuelle) ; mettre à jour le test de textes correspondant et consigner dans `REPLIT_ACTIONS.md`. Le reste s'intègre tel quel.
- **@copywriter** : rien d'autre. Le texte corrigé reprend la carte, donc pas de nouvelle relecture à l'aveugle distincte hors de celle du trajet.
- **Thomas** : confirmer TVA incluse ou franchise en base ; faire contrôler l'e-mail de confirmation (§3, réserve 2) ; avocat : réabonnement et renouvellement sans nouveau délai.
