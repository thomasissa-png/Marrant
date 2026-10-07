# Formule annuelle 24,99 €/an : reconduction tacite (s14)
Draft de référence, pas un avis juridique : faire valider par un avocat avant mise en ligne. Textes vérifiés par WebSearch le 04/10/2026 (Légifrance, DGCCRF). Les modifs CGU se limitent à ce que l'annuel impose (cohérent avec le [CHOIX UTILISATEUR] du 29/09 « juridique en l'état »).
**Mise à jour s16 (07/10/2026, audit parcours, D6 et D13)** : l'offre gratuite n'existe plus, donc l'e-mail de rappel dit « puis ton abonnement s'arrête » (plus « ton compte repasse en gratuit ») ; tutoiement partout, CGU comprises (M5 est en ligne au « tu ») ; libellé unique du bouton de résiliation « Résilier ton contrat » (profil, e-mails, CGU : formule analogue à « résilier votre contrat » au sens du décret 2023-417, lue dans `TEXTES_ABONNEMENT.resilier`). L'e-mail de la section 2 reste la référence du code (`lib/emails/annual-renewal-reminder.ts`).
## Risques en 5 points
1. Email de rappel absent ou hors fenêtre (L.215-1) : résiliation libre à tout moment dès le renouvellement + remboursement au prorata sous 30 jours. Criticité haute.
2. Pas de bouton de résiliation en 3 clics (L.215-1-1, mention « résilier votre contrat » ou formule analogue ; sur le site : « Résilier ton contrat ») : amende DGCCRF jusqu'à 15 000 € (personne physique) / 75 000 € (personne morale).
3. CGU et /retractation promettent 14 jours de remboursement sans condition : sans case de renonciation, l'accès immédiat n'efface pas le droit.
4. Prix : 24,99 € = 8,36 mois de mensuel (économie 10,89 €, environ 30 %, soit plus de 3 mois offerts). Ne pas écrire « 4 mois offerts » (reliquat du calcul sur 4,99 €).
5. TVA (mention TTC) et médiateur de la consommation : informations absentes, à fournir par le fondateur.
## 1. Obligations et mise en oeuvre
| Obligation | Sur le site | Dans les emails |
|---|---|---|
| L.215-1 (durée déterminée + reconduction tacite) | CGU §3 : durée 1 an, reconduction, prix, comment s'y opposer | Email dédié (ni newsletter ni promo), entre 3 mois et 1 mois avant la date limite de non-reconduction (ici = date de renouvellement), termes clairs, date limite dans un encadré |
| L.215-1-1, D.215-1 à D.215-3 (3 clics, depuis le 01/06/2023) | Bouton permanent « Résilier ton contrat » sur /profil (vers le portail Stripe), puis « Confirmer la résiliation », gratuit, sans motif | Confirmation sur support durable : date et heure, date d'effet (fin de période), accès maintenu jusqu'à |
| L.221-18 (14 jours) + L.221-28 13° | Case non précochée avant paiement : accès immédiat + renonciation expresse ; CGU §6 et /retractation alignées | Confirmation de commande (L.221-13) : récap, renonciation actée, CGU, comment résilier |
| L.112-1, L.221-5, L.221-14 | Prix total TTC, durée, reconduction, résiliation affichés avant paiement ; bouton « avec obligation de paiement » | Reçu ou facture Stripe |
Réserve 13° : l'accès Premium peut être qualifié de service continu et non de contenu numérique. Régime sûr alternatif : L.221-25 (rétractation possible, prorata dû si accès immédiat demandé). À arbitrer avec l'avocat.
## 2. Email de rappel (prêt à coder, texte simple)
Objet : `Ton abonnement annuel Deviens Marrant se renouvelle le {date_renouvellement}`
```
Salut {prenom},

Ton abonnement annuel Premium à Deviens Marrant va être renouvelé automatiquement. On te prévient pour que tu décides en connaissance de cause.

============================================
RENOUVELLEMENT AUTOMATIQUE
Date de renouvellement : {date_renouvellement}
Montant : {montant} TTC pour 12 mois, prélevé sur ton moyen de paiement enregistré
Pour ne pas renouveler : résilie avant le {date_renouvellement}
============================================

Si tu ne fais rien, ton abonnement est reconduit pour un an et {montant} est prélevé à cette date. Si tu résilies, tu gardes ton accès Premium jusqu'à la fin de la période déjà payée, puis ton abonnement s'arrête, sans nouveau prélèvement.

Pour gérer ou résilier ton abonnement : {lien_gestion}
Tu peux aussi passer par ton profil, bouton « Résilier ton contrat ». Un email te confirme la résiliation et sa date d'effet.

Tu peux résilier à tout moment, même après un renouvellement : la résiliation prend alors effet à la fin de la période en cours.

Une question ? contact@deviens-marrant.fr

L'Équipe Deviens Marrant
```
Variables : `{montant}` = « 24,99 € » (ou le prix annuel réel de l'abonnement), `{date_renouvellement}` = « 12 novembre 2026 » (jour complet en français, fuseau Europe/Paris), `{lien_gestion}` = URL profil ou portail Stripe.
Envoi : cible J-40 avant `current_period_end`, cron quotidien avec rattrapage autorisé de J-45 à J-32 (jamais après J-31, la limite légale étant 1 mois). Canal transactionnel, sans désabonnement marketing, aucun contenu promo.
Anti-doublon : un seul envoi par période, clé unique `(subscriptionId, current_period_end)` insérée AVANT l'envoi, avec date d'envoi et statut. Ne pas envoyer si `cancel_at_period_end = true`, abonnement non actif ou intervalle différent de l'annuel. Prix modifié après envoi : nouvel envoi obligatoire avant J-31, sinon reconduction à l'ancien prix.
Stripe propose ses propres rappels de renouvellement : [À VÉRIFIER dans le dashboard] leur délai et leur texte avant de s'y fier, l'email maison reste la référence (encadré, date limite).
## 3. Modifications des CGU (`cgu/page.tsx`, 6 modifications)
**M1 §3 al.1.** Avant : « L'abonnement Premium (2,99 €/mois) donne accès à l'ensemble du catalogue : vannes, conseils, vidéos, parcours et contenu quotidien. » Après : « L'abonnement Premium donne accès à l'ensemble du catalogue : vannes, conseils, vidéos, parcours et contenu quotidien. Il est proposé en deux formules, prix toutes taxes comprises : mensuelle à 2,99 €/mois, ou annuelle à 24,99 €/an (soit 2,08 €/mois), payable en une seule fois. »
**M2 §3 al.2.** Avant : « L'abonnement est sans engagement et peut être annulé à tout moment depuis l'espace profil. L'accès reste actif jusqu'à la fin de la période payée. » Après : « La formule mensuelle est sans engagement et reconduite tacitement chaque mois. La formule annuelle est conclue pour une durée d'un an à compter du paiement, puis reconduite tacitement par périodes successives d'un an, au tarif annuel en vigueur indiqué dans l'email de rappel. Chaque formule peut être résiliée à tout moment depuis l'espace profil (article 7). »
**M3 §3 nouvel al.** Ajout : « Avant chaque reconduction de la formule annuelle, l'éditeur informe l'utilisateur par email dédié, au plus tôt trois mois et au plus tard un mois avant la date limite de non-reconduction, de la possibilité de ne pas reconduire le contrat, de cette date limite, du montant et de la date du prélèvement. À défaut, l'utilisateur peut résilier à tout moment à compter de la reconduction et être remboursé des sommes versées pour la période postérieure à la résiliation (article L.215-1 du Code de la consommation). »
**M4 §6.** Al.1 : « à compter de la souscription » devient « à compter de la conclusion du contrat ». Ajout après al.1 : « Pour la formule annuelle, si vous demandez l'accès immédiat au contenu Premium pendant ce délai et renoncez expressément à votre droit de rétractation en cochant la case prévue avant le paiement, vous ne pouvez plus l'exercer une fois l'accès fourni (article L.221-28, 13°, du Code de la consommation). »
**M5 §7 al.2.** Avant : « L'abonnement Premium peut être annulé avant la fin de la période en cours. L'accès Premium reste actif jusqu'à la fin de la période payée. » Après : « Vous pouvez résilier l'abonnement Premium (mensuel ou annuel) à tout moment, gratuitement, en ligne depuis votre profil, via le bouton « Résilier ton contrat » puis « Confirmer la résiliation ». La résiliation prend effet à la fin de la période en cours (mois ou année) : l'accès Premium reste actif jusqu'à cette date et aucun nouveau prélèvement n'est effectué. La période déjà payée n'est pas remboursée, sous réserve de l'article 6. Un email confirme la résiliation et sa date d'effet. »
**M6 en-tête.** « Dernière mise à jour : 8 mars 2026 » devient la date réelle de mise en ligne de l'annuel. Collatéral : aligner le texte de `/retractation` (« tout abonnement ») sur M4.
## 4. Checklist du tunnel annuel (avant le paiement)
- [ ] Prix total « 24,99 € TTC, payé une fois par an » en premier, « soit 2,08 €/mois » en second, mensuel et annuel de même visibilité
- [ ] Durée 12 mois, reconduction tacite annuelle, prix de reconduction, rappel par email avant le renouvellement
- [ ] Résiliation à tout moment depuis le profil, effet à la fin de la période, sans remboursement de la période entamée
- [ ] Case non précochée « J'accepte les CGU » (lien) + case d'accès immédiat et renonciation (L.221-28 13°), journalisées (userId, formule, horodatage, version CGU)
- [ ] Bouton final « Je m'abonne et je paie 24,99 € » (obligation de paiement) ; aucun libellé ambigu type « Continuer »
- [ ] Email de confirmation de commande (support durable) avec récap, CGU, date de renouvellement, lien de résiliation
- [ ] Portail Stripe : annulation « en fin de période » activée ; bouton « Résilier ton contrat » sur /profil et accessible en 3 clics maximum
- [ ] Mention du médiateur de la consommation (CGU) et du régime TVA (mention TTC ou « TVA non applicable ») : [À COMPLÉTER PAR LE FONDATEUR]
## Points bloquants
1. Régime TVA et médiateur de la consommation à fournir (zéro invention) ; 2. arbitrage renonciation 13° (avocat) ou maintien du remboursement 14 jours ; 3. suppression de compte avec annuel actif : comportement et remboursement à définir.
