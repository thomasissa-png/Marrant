# Cadre légal s23 : page de résiliation et e-mails d'accueil Premium (06/11/2026)

> Draft de référence, pas un avis juridique : validation par un avocat avant mise en ligne. Public : @ux, @design, @copywriter, @fullstack.

## Limite des sources (à lire d'abord)

Je n'ai qu'un outil de recherche qui renvoie des extraits, pas de lecteur de pages. **Je n'ai lu en entier ni L215-1-1, ni D215-1 à D215-3, ni L34-5 sur Légifrance.** Légifrance n'est pas ressorti en lien direct pour ces articles. Les règles ci-dessous viennent d'extraits DGCCRF, CNIL, Dalloz et d'avocats qui reprennent le texte. Chaque règle porte une étiquette : [LU-2D] relevé dans une source seconde concordante, [PRUDENCE] règle de prudence sans texte lu (aucune source ne l'interdit ni ne l'autorise).

## Risques en 5 points

1. Le motif de départ : **aucune source lue ne l'interdit ni ne l'autorise.** Le seul usage sûr est une question facultative qui ne bloque rien et ne s'ajoute à aucun écran.
2. Nombre de clics : le texte n'impose pas « 3 » en chiffre dans ce que j'ai lu ; le parcours décrit est : bouton, rubriques d'identification, page récapitulative, notification. Viser **3 clics maximum depuis n'importe quelle page** (portail Stripe compris) laisse de la marge.
3. Offre de rétention : aucune source trouvée. Un écran qui retient avant la résiliation est le plus gros risque (« étape de trop »). Une phrase sans bouton, sur l'écran de confirmation, est tenable.
4. Les e-mails d'accueil ne sont libres de consentement que s'ils parlent du service déjà souscrit sans pousser une autre offre. Toute promotion (passage à l'annuel, remise) les fait basculer en prospection : lien d'opposition obligatoire, base « client existant ».
5. Comptes gratuits : **exclus** de la séquence. Pour la CNIL, un simple compte ne crée pas de relation commerciale.

## A. Page de résiliation : règles binaires

Fondement : L215-1-1 (créé par la loi 2022-1158, art. 15) et D215-1 à D215-3 (décret 2023-417 du 31/05/2023, en vigueur le 01/06/2023, contrôles depuis le 01/09/2023) [LU-2D]. Sanction : amende administrative jusqu'à 15 000 € (personne physique) ou 75 000 € (personne morale), L241-3-1 [LU-2D, non relu].

**Accès**
- A1. Le premier point d'accès porte « Résilier ton contrat » (ou « Résilier votre contrat », ou formule analogue sans ambiguïté), lisible, sans autre libellé concurrent. [LU-2D, D215-1]
- A2. Ce point d'accès est direct et facile depuis l'interface (pied de page, profil, page d'abonnement), sans passer par un menu, une FAQ ou un contact. [LU-2D, DGCCRF]
- A3. Aucune création de compte ni d'espace personnel n'est exigée pour résilier. Un abonné Premium a déjà un compte : lui demander de se connecter est un point à faire valider (liste avocat). [LU-2D pour la création ; connexion : non tranché]
- A4. La résiliation en ligne est aussi simple qu'une résiliation écrite et mêmes conditions de fond (fin de période payée, pas de frais ajoutés). [LU-2D, DGCCRF]
- A5. Le lien du pied de page mène à la page de résiliation (ou directement au profil abonnement) en un clic, sans écran d'information intermédiaire.

**Parcours**
- A6. Total maximum : 3 clics de l'accueil à la notification finale, écran Stripe compris. Pied de page = clic 1. [PRUDENCE]
- A7. Un seul écran de confirmation final (le récapitulatif de D215-3). Interdit : deux confirmations successives (la nôtre puis celle de Stripe). Si la page maison envoie vers le portail Stripe, le portail devient ce récapitulatif et la page maison n'a pas de bouton « Confirmer ». [LU-2D, D215-3 ; articulation : PRUDENCE]
- A8. Avant l'envoi, le récapitulatif montre les informations de D215-2 : identité, référence du contrat, moyen de contact pour l'accusé. Pour un abonné connecté, tout est pré-rempli, rien à retaper. [LU-2D]
- A9. Le bouton de notification porte un libellé clair du type « Confirmer la résiliation » et est actif sans avoir répondu à quoi que ce soit.
- A10. Aucune étape ne retarde la résiliation : pas de délai d'attente, pas de rappel téléphonique, pas de courrier, pas de pièce justificative. [PRUDENCE]

**Motif et rétention**
- B1 (motif). Facultatif : visible comme tel (« Facultatif »), jamais bloquant, jamais requis pour activer le bouton de confirmation, aucune réponse pré-cochée. [PRUDENCE]
- B2. La question de motif ne crée pas d'écran supplémentaire : elle tient sur l'écran de confirmation, sous le bouton ou à côté, ou elle suit la confirmation (page de remerciement). Question avant le récapitulatif, sur un écran à part = interdit. [PRUDENCE]
- B3. Zéro texte libre obligatoire, zéro CAPTCHA, zéro relecture de réponse avant de résilier.
- B4 (rétention). Interdit : écran de rétention séparé, pop-up, compte à rebours, double confirmation « es-tu sûr(e) ? », remise conditionnée à la non-résiliation affichée avant le bouton. Permis : une phrase informative sur l'écran de confirmation (« tu gardes Premium jusqu'au {date} »). [PRUDENCE]
- B5. Ton neutre : aucune culpabilisation (« tu vas nous manquer », « tu perds tout »), aucun bouton « Rester » plus grand ou plus coloré que « Confirmer la résiliation », aucune option de refus formulée à l'envers. [PRUDENCE ; principe général des pratiques trompeuses/agressives, L121-1 et suivants, non relus]
- B6. Le bouton « Résilier » et ses effets (accès gardé jusqu'à la fin de la période, aucun nouveau prélèvement) disent la même chose partout (carte profil, page, e-mail). Cohérence avec `abonnement-card.tsx`.
- B7. Aucune donnée de motif n'est conservée avec l'identité sans besoin : motif rattaché à l'identifiant de compte, durée à fixer (voir avocat). Les motifs Stripe (`cancellation_details`) sont une option sans écran à nous : à activer côté portail si on garde Stripe comme récapitulatif. [Source Stripe non relue, voir `resiliations-s23-analyse.md` §4]

**Après le clic**
- C1. Accusé de réception immédiat (délai raisonnable), sur support durable (e-mail), confirmant la réception de la notification. [LU-2D, D215-2/3]
- C2. Le même e-mail, ou un second dans la foulée, donne la **date de fin du contrat** et **les effets de la résiliation** (accès jusqu'au terme, aucun prélèvement ensuite, ce qui est perdu). [LU-2D]
- C3. L'e-mail existant « C'est noté : ton Premium s'arrête le … » (webhook `customer.subscription.updated`) peut servir de support, à condition de contenir C1 et C2. Un échec d'envoi n'annule pas la résiliation et déclenche un message de repli à l'écran.
- C4. La résiliation prend effet à la fin de la période payée (cohérent avec la pratique actuelle). Remboursement : suit la règle du premier paiement (choix du 07/10), pas de nouveau droit créé ici.
- C5. L'abonné peut revenir sur sa résiliation (réactiver) sans re-souscrire : bonne pratique, non exigée.
- C6. Abonnement pris sur l'App Store : la résiliation passe par Apple ; hors périmètre de cette page, à traiter avec le lot app.

## B. Séquence d'e-mails d'accueil Premium : règles binaires

Fondement : L34-5 CPCE (consentement préalable pour la prospection par e-mail à un particulier ; exception « produits ou services analogues » pour les clients), RGPD, recommandations CNIL [LU-2D].

**Nature et base légale**
- D1. Cible unique : abonnés dont le paiement est confirmé (Premium actif). Comptes gratuits, visiteurs, inscrits à la lettre seule : **exclus**, aucune base légale (la CNIL écarte l'exception « client » pour un simple compte). [LU-2D]
- D2. Tant que le contenu informe sur le service déjà souscrit (comment s'en servir, ce qui est ouvert, comment poser une question à l'équipe), la séquence est relationnelle, sans consentement séparé. [LU-2D, CNIL]
- D3. Interdit dans ces e-mails : promotion d'une autre offre (passage à l'annuel, parrainage, produit nouveau), remise, urgence artificielle. Un seul de ces éléments requalifie en prospection. [LU-2D]
- D4. Si Thomas veut tout de même un passage à l'annuel : seule voie = exception « client existant » (même vendeur, service analogue, personne informée à la collecte, opposition possible à chaque envoi). Vérifier que l'information à la collecte existe (CGU, confidentialité, texte de paiement). [LU-2D ; état de la collecte : non vérifié]
- D5. Chaque e-mail de la séquence contient un lien d'arrêt en un clic, fonctionnel, hors e-mail de confirmation d'achat. Pas strictement dû pour un message purement relationnel, **dû dès qu'il y a prospection**, donc mis partout par prudence (cohérent avec la lettre hebdo, choix du 25/10). [LU-2D + PRUDENCE]
- D6. Expéditeur clairement identifié (L34-5), pas d'objet trompeur, pas de fausse urgence.
- D7. Pas de pixel d'ouverture ni de suivi de clic sans consentement : la CNIL ne les exempte pas pour un message de prospection ; à régler dans Resend. [LU-2D, CNIL pixels]
- D8. Ne pas s'adresser à l'abonné par des données qu'on n'a pas : prénom manquant = « Salut, » (choix du 07/10).

**Confirmation d'achat (reste complète)**
- E1. L'e-mail de confirmation (`emailConfirmationAbonnement`) garde toutes les informations contractuelles : offre, prix TTC, périodicité, date du prochain prélèvement, reconduction, mode de résiliation, rétractation (14 jours, formulaire type, lien « Renoncer au contrat ici »), lien CGU, identité du vendeur. [PRUDENCE ; L221-13 et L221-5 non relus]
- E2. L'ordre peut changer (accueil et premier contenu d'abord, comme la recommandation R2 de l'analyse s23), à condition que chaque mention reste dans le même e-mail, lisible sans clic, ni repliée ni réduite à un lien. [PRUDENCE]
- E3. Interdit : déplacer rétractation, résiliation ou reconduction vers l'e-mail J+1 ou vers un simple lien.
- E4. Le bloc d'accueil ajouté ne contient aucune incitation commerciale (D3).

**Calendrier et arrêts**
- F1. Durée courte, environ 3 semaines, cadence modérée (l'abonné reçoit déjà la lettre hebdo du jeudi : jamais deux envois le même jour). [PRUDENCE]
- F2. **Arrêt immédiat** de la séquence, sans relance : désinscription, résiliation programmée (`cancelAtPeriodEnd`), rétractation, paiement échoué, suppression du compte. [PRUDENCE]
- F3. Résilié pendant la séquence : plus aucun e-mail d'accueil, même si l'accès reste ouvert jusqu'au terme. Seuls restent les messages de service (accusé de résiliation, fin d'accès) et la lettre si non désinscrit.
- F4. Réabonnement après résiliation : nouvelle séquence autorisée seulement si le précédent arrêt n'était pas une désinscription.
- F5. Chaque envoi consigne en base (identifiant de compte, numéro d'e-mail, date) pour prouver l'arrêt et l'opposition. Aucune donnée supplémentaire.
- F6. L'invitation à poser des questions renvoie à la fonction « Ta question à l'équipe » (réponse dans les délais déjà fixés), sans engagement nouveau.

## À faire valider par l'avocat (liste unique)

1. Lecture intégrale de L215-1-1, D215-1 à D215-3, L241-3-1, L34-5 et L221-13 en vigueur (mon relevé repose sur des extraits).
2. Connexion au compte pour résilier : compatible avec « pas d'espace personnel imposé » quand le compte existe déjà ?
3. Question de motif facultative : toute forme est-elle admise, avant ou après la confirmation ? Phrase de rétention sans bouton : admise ?
4. Nombre maximal d'écrans : le texte fixe-t-il un plafond, et le portail Stripe compte-t-il ?
5. Contenu minimal de l'accusé (date de fin, effets) et délai « raisonnable ».
6. Séquence d'accueil : relationnelle sans consentement ? Lien d'arrêt obligatoire ou non ? Information à la collecte pour l'exception « client existant ».
7. Maintien de la séquence après résiliation programmée (j'ai retenu l'arrêt par prudence).
8. Information : le même raisonnement CNIL (un compte gratuit n'est pas un client) vaut pour la lettre du mois envoyée d'office aux comptes gratuits (choix du 25/10, non rouvert ici). Une décision du Conseil constitutionnel du 25/06/2026 sur les sanctions de L34-5, citée par une source unique, est à confirmer.
9. Durée de conservation des motifs et des journaux d'envoi.

## Sources

- DGCCRF, résiliation en ligne : https://www.economie.gouv.fr/dgccrf/actualites/resilier-ses-contrats-conclus-sur-internet-est-desormais-plus-facile (extrait lu seulement)
- DGCCRF, changements pour les professionnels : https://www.economie.gouv.fr/dgccrf/actualites/resiliation-des-contrats-quels-changements-pour-les-professionnels (extrait)
- Décret 2023-417 (JORF 01/06/2023), Dalloz actualité : https://www.dalloz-actualite.fr/document/decr-n-2023-417-31-mai-2023-jo-1er-juin (non lu)
- D215-3 : https://french-business-law.com/rench-legislation-art/article-d215-3-of-the-french-consumer-code (secondaire)
- Commentaires d'avocats : https://www.seban-associes.avocat.fr/la-resiliation-des-contrats-conclus-par-voie-electronique-en-trois-clics/ ; https://blog.avocats.deloitte.fr/la-resiliation-en-3-clics-nouvel-outil-au-service-des-consommateurs/
- CNIL, communications électroniques aux prospects et clients : https://www.cnil.fr/fr/communication-electronique-quelles-regles
- CNIL, prospection par courrier électronique : https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique-sms-mms-et-automate-dappel
- CNIL, pixels dans les e-mails : https://www.cnil.fr/fr/faq-recommandation-pixels-courriers-electroniques
- Texte de L34-5 (secondaire) : https://www.baumann-avocats.com/CPCE/article-l34-5-du-code-des-postes-et-des-communications-electroniques.php
- Légifrance : texte de L215-1-1 et D215-1 à D215-3 **non trouvé en lien direct, non lu**. Rétractation (même chantier) : `docs/legal/retractation-conformite-s23.md`. Analyse des 3 cas : `docs/analytics/resiliations-s23-analyse.md`.
