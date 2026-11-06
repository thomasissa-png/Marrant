# Revue @legal v1 : page /resiliation (s23, 06/11/2026)

> Draft de référence, pas un avis juridique : validation par un avocat avant ouverture de l'interrupteur `RESILIATION_PAGE_OUVERTE`. Le choix de Thomas (motif demandé AVANT, écran maison) n'est pas rouvert : on contrôle son exécution. Sources : cadre `docs/legal/resiliation-onboarding-cadre-s23.md` (règles A1 à C6, texte de L215-1-1 et D215-1 à D215-3 **non lu en entier**, voir sa « Limite des sources »), spec `docs/ux/page-resiliation-s23-spec.md`, code et 29 captures de `docs/captures/s23-resiliation/` (préfixe `cap:`).

## Risques en 5 points

1. La fonction de résiliation est bien exécutée : accès direct, récapitulatif complet, bouton toujours actif, raison facultative, aucune rétention.
2. Le point faible est la **table de motifs** : aucune mention d'information près du champ libre, politique de confidentialité non mise à jour, aucune durée de conservation, aucune purge.
3. Le mot libre survit à la suppression du compte (`userId` passe à NULL) : un texte libre peut rester identifiant.
4. Le message « on résilie pour toi » promet un e-mail et une action sans délai ; en cas de panne base (503) aucun e-mail n'est envoyé à l'abonné.
5. La résiliation par le portail Stripe n'est coupée dans le code que pour le parcours `resilier` : la configuration du portail (action Thomas) doit être vérifiée avant ouverture.

## Note globale : 7 / 10

Fonction de résiliation et absence d'entrave : 9 / 10. RGPD de la table : 4 / 10. Cas d'erreur : 7 / 10. Les 6 corrections obligatoires ci-dessous ramènent la note à 10 / 10 (sous réserve de l'avocat).

## 1. Fonction de résiliation (L215-1-1, D215-1 à D215-3)

| Exigence | Statut | Preuve |
|---|---|---|
| A1 libellé « Résilier ton contrat », seul, lisible | OK | `config/textes/compte.ts:89` (source unique) ; H1 `app/(dashboard)/resiliation/page.tsx:50` ; cap: `resiliation-vide-pc-1440.png` |
| A2/A5 accès direct, en un clic, depuis le pied de page | OK (interrupteur ouvert) | `components/layout/footer.tsx:95-100` ; cap: `apres-pied-de-page-pc-1440.png`, `-mobile-390.png`. Lien présent aussi sur la page de résiliation elle-même |
| A2 accès aussi depuis la carte profil | NON VÉRIFIÉ | Seule la capture « avant » existe (`avant-profil-carte-abonnement-*.png`) ; aucune capture « après » du profil |
| A3 pas de création de compte ; connexion d'un abonné existant | OK sous réserve avocat (point 2) | `page.tsx:30` redirige vers `/login?callbackUrl=/resiliation` ; cap: `resiliation-connexion-pc-1440.png` (message « Tu reviens ici juste après ») |
| A6 3 clics maximum | OK connecté (pied, Confirmer = 2) ; connexion = 3e étape | spec §1 ; cap: connexion |
| A7 une seule confirmation (la nôtre) | OK dans le code, **à vérifier côté Stripe** | `portal/route.ts:45-47` ; voir O6 |
| A8 récapitulatif D215-2 : identité, formule, prix TTC, date de fin, effets, tout pré-rempli | OK | `recap-contrat.tsx:29-76` ; cap: `resiliation-vide-pc-1440.png` (« 1er décembre 2026 », « Premium mensuel, 1,99 € TTC par mois », « Aucun nouveau prélèvement après. »). Annuel : `resiliation-annuel-mobile-390.png` |
| A8 référence du contrat | ÉCART MINEUR | Aucune référence lisible affichée (spec : « à décider »). Compte (prénom + e-mail) + formule identifient le contrat ; à faire valider (avocat, point 1) |
| A9 bouton « Confirmer la résiliation », actif sans réponse | OK | `barre-confirmation.tsx:19-27` (jamais `disabled`), `resiliation-formulaire.tsx:128-141` ; cap: `resiliation-vide-*` |
| A10 aucun délai, pièce, rappel | OK | `lib/resiliation.ts:321-372` (Stripe d'abord, effet immédiat) |
| C1 accusé durable immédiat (e-mail) | OK | `lib/resiliation.ts:368-371` ; `resiliation-emails.ts:57-87` (date et heure de la demande) |
| C2 date de fin et effets dans l'accusé | OK | `resiliation-emails.ts:66-75` (formule, fin du contrat, aucun prélèvement, renouvellement annuel, accès gratuit ensuite) ; page finale cap: `resiliation-confirmee-pc-1440.png` |
| C3 échec d'envoi n'annule rien | OK | `lib/resiliation.ts:368-371` (`trySend…`) ; la page finale affiche déjà date et effets |
| C4 effet en fin de période payée | OK | `cancel_at_period_end: true`, `lib/resiliation.ts:324-328` ; date relue chez Stripe (`finAccesStripe`, l. 80) |
| C5 réactivation | OK | `LienReactivation` ; cap: `resiliation-confirmee-pc-1440.png` |
| Remboursement du reste de l'annuel non mentionné | À SOUMETTRE | Aucune phrase, cohérent avec la règle du premier paiement ; point avocat 3 |

## 2. Aucune entrave

| Exigence | Statut | Preuve |
|---|---|---|
| B1 motif facultatif, étiqueté, rien de pré-coché | OK | `question-motif.tsx:27-35` (Badge « Facultatif » + « Tu peux résilier sans répondre. ») ; cap: `resiliation-vide-pc-1440.png` |
| B2 pas d'écran ajouté, question sur l'écran de confirmation | OK | une seule page ; cap: `resiliation-vide-mobile-390.png` |
| B3 zéro texte libre obligatoire, zéro CAPTCHA | OK | `route.ts:32-38` (tout est toléré, jamais d'erreur sur le motif) |
| B4 pas de rétention : pop-up, compte à rebours, double confirmation, remise | OK | aucun dans le code ni sur les captures |
| B5 ton neutre, « Garder mon abonnement » plus discret que le bouton | OK | `barre-confirmation.tsx:28-34` (lien souligné, petit) ; cap: `resiliation-vide-pc-1440.png` |
| Phrase d'aide après résiliation (page finale) | OK avec réserve | `aide-apres-resiliation.tsx`, `textes/resiliation.ts:75-106` : après la confirmation, sans bouton ni offre. Réserve : la ligne « Après le … restent libres » est informative, pas promotionnelle ; à garder ainsi (aucune remise) |
| Le motif ne conditionne pas la résiliation | OK | `lib/resiliation.ts:363-365` (try/catch, `enregistrerMotif` ne lève jamais) |
| Bouton « Réessayer » après erreur | RECO | `barre-confirmation.tsx:26` remplace « Confirmer la résiliation » : voir R2 |
| Écran de connexion pour résilier | RECO | cap: `resiliation-connexion-pc-1440.png` : sans en-tête ni pied de page, et propose « Créer mon compte et m'abonner » (bruit commercial sur un parcours de résiliation) : voir R1 |

## 3. Cas d'erreur Stripe et autres états

| Exigence | Statut | Preuve |
|---|---|---|
| Erreur Stripe : demande transmise à l'équipe, accusé « demande reçue » | OK | `lib/resiliation.ts:329-345`, `206-252` ; `resiliation-emails.ts:90-111` ; cap: `resiliation-erreur-stripe-pc-1440.png` |
| Délai de traitement annoncé | **ÉCART (O5)** | `textes/resiliation.ts:42-43` et `resiliation-emails.ts:102` : « Dès qu'elle est faite » sans délai ; spec : « [À FIXER par Thomas] » |
| Date d'effet : celle de la demande | **ÉCART (O5)** | Non écrit dans l'accusé de demande (seul « Tu gardes Premium jusqu'au … » figure) |
| Panne base (503) : promesse « on te le confirme par e-mail » | **ÉCART (O4)** | `route.ts:71-78` : e-mail à l'équipe seulement, aucun accusé à l'abonné, alors que `formulaire.tsx:116` affiche le message « on résilie pour toi » pour le 503 |
| Premium sans client Stripe (offert, manuel) | OK avec réserve | `lib/resiliation.ts:299-317` ; cap: `resiliation-sans-client-stripe-mobile-390.png`. Réserve R3 : « à la fin de la période déjà payée » est faux pour un accès offert |
| Aucun abonnement, déjà résilié | OK | `page.tsx:60-81` ; cap: `resiliation-sans-abonnement-*`, `resiliation-deja-resilie-*` |
| Erreur de réseau ou 429 : on ne promet rien | OK | `formulaire.tsx:117-121` (message « Pas de connexion. Rien n'est perdu, réessaie. ») |

## 4. App Store (C6)

Statut : OK avec réserve. Message « Ton abonnement passe par Apple… » (`textes/resiliation.ts:53`) ; détection par l'origine de l'appli et l'absence de client Stripe (`lib/resiliation.ts:303`), marquée HYPOTHÈSE dans le code. Réserve R4 : un abonné Apple qui ouvre le site web (origine non mobile) tombe dans « Premium sans client Stripe », reçoit « on résilie pour toi », et l'équipe ne peut pas résilier chez Apple. À traiter avec le lot app (un abonnement Apple se résilie uniquement chez Apple).

## 5. RGPD de la table `CancellationFeedback` (`schema.prisma:1255-1270`)

| Exigence | Statut | Preuve |
|---|---|---|
| Minimisation (ni e-mail, ni IP, ni user-agent, ni prix) | OK | `schema.prisma:1249-1254`, `lib/resiliation.ts:183-194` ; aucune ligne sans raison ni mot |
| Pas de journalisation du texte libre | OK | `lib/resiliation.ts:199-200` (code d'erreur seulement) |
| Base légale | **À DOCUMENTER (O2)** | Proposition : intérêt légitime (comprendre les départs, améliorer le contenu), réponse facultative, opposition possible. Aucune base écrite dans la politique |
| Information au point de collecte (mention près du champ libre) | **ABSENT (O1)** | `question-motif.tsx:54-75` : aucune mention ; cap: `resiliation-vide-pc-1440.png` |
| Politique de confidentialité à jour | **NON (O2)** | `app/(dashboard)/confidentialite/page.tsx:79-90` (données), `:92-103` (bases), `:132-152` (durées) ne parlent pas des motifs de résiliation |
| Durée de conservation | **ABSENTE (O3)** | Aucune durée dans le code ni la politique ; aucune tâche de purge trouvée dans `lib/` |
| Suppression de compte | **ÉCART (O3)** | `schema.prisma:1266` `onDelete: SetNull` : la ligne reste, dite « anonyme », mais le mot libre (500 caractères) peut contenir un nom ou un fait identifiant ; la politique (`page.tsx:134`) affirme que les données sont « effacées tout de suite » |
| Droits (accès, effacement) | PARTIEL | Sur compte actif la ligne est rattachée à l'identifiant : accès possible par contact@ ; à dire dans la politique (O2) |
| Prestataires | OK | Resend (accusés) et Neon déjà listés (`page.tsx:36-44`). Umami : événements sans motif ni donnée perso (spec §3) |

## 6. Corrections OBLIGATOIRES (6), en texte exact

Les durées entre crochets sont à fixer par Thomas ; la valeur proposée est une `[HYPOTHÈSE : 24 mois, à confirmer]`, pas une règle sourcée.

**O1. Mention d'information sous le champ « Un mot de plus ? »** (nouveau paragraphe dans `question-motif.tsx`, sous le compteur, taille `text-xs`, lien vers la politique) :
> Ta réponse est facultative. Elle est rattachée à ton compte, lue par l'équipe pour améliorer le site, et effacée après [24 mois]. N'y mets pas d'information sensible. Détails et droits : politique de confidentialité.

Lien vers `/confidentialite#resiliation` (ancre à créer, O2). Ne rien ajouter qui retarde le bouton.

**O2. Politique de confidentialité** (`confidentialite/page.tsx`), trois ajouts, section 8 ou nouvelle section « Résiliation » à ancre `id="resiliation"` :
- Partie 2 (données) : « Résiliation, si tu réponds à la question facultative : les raisons cochées, ton mot libre, ta formule (mensuelle ou annuelle), l’ancienneté de ton abonnement en jours et la date. Ni ton adresse e-mail ni ton adresse IP ne sont ajoutées. »
- Partie 3 (bases) : « Comprendre pourquoi des abonnés résilient, pour améliorer le site : intérêt légitime. Ta réponse est facultative et tu peux t’y opposer (voir la partie 7). »
- Partie 7 (droits), ajout : « Tu peux demander l’accès ou l’effacement de ta réponse à la résiliation en écrivant à contact@deviens-marrant.fr. »
- Mettre à jour la date « Dernière mise à jour ».

**O3. Durée de conservation et suppression de compte.**
- Partie 6 de la politique, ajout : « Ta réponse à la question de la résiliation est gardée [24 mois], puis effacée. Si tu supprimes ton compte, ton mot libre est effacé et tes raisons cochées sont détachées de ton compte. »
- Implémentation (@fullstack, hors périmètre de cette revue) : purge planifiée des lignes de plus de [24 mois] ; à la suppression du compte, mettre `comment` à NULL en plus du `SetNull` de `userId` (sinon corriger la phrase « effacées tout de suite » de la partie 6 pour exclure ce cas).

**O4. Panne base (503) : promesse tenue ou message corrigé.** Soit envoyer à l'abonné l'accusé « Ta demande de résiliation est bien reçue » à l'adresse de la session (`route.ts:71-78`, l'adresse est dans la session sans lecture en base), soit, tant que ce n'est pas fait, afficher pour le 503 le message `horsLigne` (« Pas de connexion. Rien n’est perdu, réessaie. ») et non `erreurStripe` (`resiliation-formulaire.tsx:116`).

**O5. Délai et date d'effet de « on résilie pour toi ».** Texte de l'e-mail `emailDemandeResiliationRecue` (remplace la 3e et 4e lignes, `resiliation-emails.ts:102-103`), délai [À FIXER par Thomas, ex. « un jour ouvré » à confirmer] :
> On s’occupe de ta résiliation et on te confirme par e-mail sous [délai]. Ta demande date du {date et heure} : c’est cette date qui compte, même si on la finalise plus tard. Tu gardes Premium jusqu’au {date de fin}.

Même délai dans le bandeau `erreurStripe` (`textes/resiliation.ts:42-43`) : « Ça n’a pas marché de notre côté. Ta demande est bien enregistrée : on résilie pour toi sous [délai] et on te le confirme par e-mail. » Si Thomas ne peut pas tenir un délai, ne pas ouvrir.

**O6. Portail Stripe : une seule confirmation, avant ouverture** (action Thomas, mode « Accept edits »). Désactiver « Annuler les abonnements » dans la configuration du portail Stripe (le repli « portail simple », `portal/route.ts:70-72`, permettrait sinon de résilier hors de notre écran, sans accusé maison). Ajouter à `REPLIT_ACTIONS.md` la preuve (capture du réglage). Fournir aussi une capture « après » de la carte abonnement du profil et lister les e-mails dont le lien « Résilier » doit pointer vers `/resiliation` (non vérifiés ici).

## 7. Recommandations (non bloquantes)

- R1. Sur `/login?callbackUrl=/resiliation`, masquer « Pas encore abonné ? Créer mon compte et m'abonner » ; garder en-tête et pied (spec §1).
- R2. Garder le libellé « Confirmer la résiliation » après une erreur (au lieu de « Réessayer »), pour la cohérence B6.
- R3. Cas sans client Stripe : remplacer « à la fin de la période déjà payée » (`recapFinInconnue`) par « à la date de fin que l’équipe te confirme par e-mail » pour un accès offert.
- R4. Abonné Apple depuis le web : lot app, message « Ton abonnement passe par Apple » à détecter via RevenueCat.
- R5. Indiquer dans l'e-mail à l'équipe (`emailEquipeResiliation`) que seul le retrait de Premium est possible si l'achat vient d'Apple.

## 8. Points à soumettre à l'avocat

1. Lecture intégrale de L215-1-1, D215-1 à D215-3, L241-3-1 en vigueur : notre écran maison tient-il lieu de récapitulatif, avec question de motif facultative sur le même écran ? Référence du contrat obligatoire à l'écran ?
2. Connexion exigée avant `/resiliation` pour un compte existant : compatible, et compte-t-elle dans les « 3 clics » ?
3. Mention du remboursement (ou non) du reste de l'annuel ; date d'effet retenue (date de la demande) et délai de traitement manuel.
4. Base légale du motif (intérêt légitime retenu), durée de conservation, sort du mot libre après suppression du compte.
5. Contenu minimal de l'accusé et délai « immédiat » ; valeur de l'accusé « demande reçue » en cas d'erreur Stripe.
6. Résiliation encore possible par le portail Stripe si elle ne peut être désactivée.
7. Ligne d'aide de la page finale (après confirmation) : admise sans qualification de rétention ?

## Handoff

Destinataire : @orchestrator puis @fullstack (O1, O3 code, O4, O5, R1 à R3), Thomas (O5 délai, O3 durée, O6 réglage Stripe).
- Fichier produit : `/home/user/Marrant/docs/legal/revues-resiliation/legal-v1.md`
- Décisions : base légale du motif = intérêt légitime, réponse facultative ; aucun blocage sur la fonction de résiliation.
- Points d'attention : interrupteur `RESILIATION_PAGE_OUVERTE` à garder fermé tant que O1 à O6 ne sont pas faits ; validation par un avocat avant ouverture ; notifier @fullstack (mention, suppression de compte) et @data-analyst (aucun changement de tracking).
