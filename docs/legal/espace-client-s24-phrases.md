# Espace client s24 : phrases à changer (confidentialité et CGU art. 10)

Brouillon de référence, à faire relire par un avocat si Thomas le souhaite. Fichiers concernés : `apps/web/src/app/(dashboard)/confidentialite/page.tsx` et `apps/web/src/config/textes/question-equipe-s22.ts`. Rien d'autre à revoir (sections 5, 7, 9 puce 2, 3 et 5, CGU art. 7 : restent vraies).

## Bloc 1. Mesure d'usage (en ligne d'abord)

**Seule phrase devenue fausse** : partie 3, ligne 117, « de façon globale » (les événements sont rattachés à chaque compte, seule la lecture est anonymisée).

Actuelle :
> Comprendre, de façon globale, où les membres avancent ou bloquent dans les parcours pour les améliorer : intérêt légitime (tu peux t’y opposer, voir la partie 7)

Proposée :
> Comprendre où les abonnés avancent ou décrochent (souscription, parcours, résiliation), à partir d’événements rattachés à ton compte et lus sous forme anonymisée, pour améliorer le service : intérêt légitime (tu peux t’y opposer, voir la partie 7)

**Une puce à ajouter** en partie 2 (la liste des données serait sinon incomplète, art. 13 RGPD). Elle porte aussi la durée, donc rien à toucher en partie 6 :
> Usage du service, si tu es ou as été abonné : la date et la formule (mensuelle, annuelle ou app) de ta souscription et de chaque renouvellement payé, ton premier contenu Premium affiché (son type ou son étape), ta première étape ou ton premier quiz terminé, chaque jour où tu termines un quiz, chaque ouverture du portail de paiement avec l’action choisie, et, si tu programmes ta résiliation, son heure et le motif choisi dans une liste. Aucun texte libre ni adresse IP. Ces données sont effacées avec ton compte

**Base légale** : intérêt légitime (amélioration du service, art. 6.1.f), le même que celui déjà publié pour la progression et pour la résiliation. Pas de consentement ni de bandeau : l'étape dépliée et l'exercice vu sont détectés dans la page par le JavaScript du site (IntersectionObserver), puis envoyés à notre serveur (`fetch` vers `/api/mesure/acces`), mais rien n'est lu ni écrit dans le stockage du terminal (ni cookie, ni stockage local, ni empreinte de navigateur) en dehors du cookie de session déjà exempté ; rien n'est envoyé à Umami. L'art. 82 de la loi Informatique et Libertés (ePrivacy 5.3) vise la lecture ou l'écriture d'informations dans le terminal : l'absence de consentement tient tant que le code ne lit ni n'écrit rien d'autre (à garder vrai à chaque évolution du script).
**Marqueur d'opposition** (`mesure-usage:opposition:<userId>`) : à effacer avec le compte (il n'a plus d'usage une fois le compte supprimé, minimisation) ; le garder serait toléré seulement comme identifiant orphelin, mais mieux vaut le supprimer, y compris pour ceux de l'onboarding déjà en place.

**Mention d'opposition : déjà présente, rien à ajouter.** Droit d'opposition obligatoire à signaler clairement pour un intérêt légitime (art. 21.4) : la parenthèse « tu peux t’y opposer, voir la partie 7 » le fait, et la partie 7 le détaille. L'opposition durable (plus aucune écriture pour ce compte) rend cette phrase plus vraie, sans la changer : rien à ajouter. Elle doit être effective avant la mise en ligne du texte.

Hors texte (une ligne pour @fullstack) : ajouter l'ouverture de cette mesure dans `datesConfidentialite()` pour la date de mise à jour.

## Bloc 2. « Mes questions » (avec l'espace client)

**Confidentialité, section 9, puce 1.** Actuelle :
> Ce qu'on reçoit : le texte de ta question (1 000 caractères au plus) et l'adresse e-mail de ton compte, pour te répondre. Le site ne les garde pas dans sa base de données : ton message est envoyé par e-mail à l'équipe.

Proposée (seule la 2e phrase change) :
> Ce qu'on reçoit : le texte de ta question (1 000 caractères au plus) et l'adresse e-mail de ton compte, pour te répondre. Le site garde ta question et notre réponse dans sa base de données, pour que tu retrouves ton historique dans « Mes questions », et les envoie aussi par e-mail à l'équipe.

**Confidentialité, section 9, puce 4.** Actuelle :
> Combien de temps : ta question et notre réponse restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt.

Proposée :
> Combien de temps : dans ton espace, ta question et notre réponse sont gardées tant que ton compte existe, et effacées avec lui. Leurs copies par e-mail restent dans les boîtes de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt.

**Confidentialité, partie 6, dernier paragraphe** (`CONSERVATION_QUESTION_EQUIPE.confidentialite`) : remplacer seulement le début « Tes questions à l'équipe et nos réponses suivent leur propre durée » par « Les copies par e-mail de tes questions à l'équipe et de nos réponses suivent leur propre durée » (sinon la phrase laisse croire que rien n'est effacé avec le compte). La phrase CGU art. 7 dit déjà « échanges par e-mail » : inchangée.

**Confidentialité, partie 4, ligne Neon** (facultatif, un mot) : « base de données (compte, progression, abonnement) » devient « base de données (compte, progression, abonnement, tes questions et nos réponses) ».

**CGU art. 10** (`CGU_QUESTION_EQUIPE.texte`), deux retouches dans la même phrase de départ :
- « tu peux écrire à l'équipe depuis ton profil » devient « tu peux écrire à l'équipe depuis ton espace (Mes questions) » ;
- « L'équipe répond par e-mail, en général sous 1 à 2 jours ouvrés » devient « L'équipe répond par e-mail, et tu retrouves ta question et sa réponse dans ton espace, en général sous 1 à 2 jours ouvrés » (le délai reste attaché à la réponse : si la tournure gêne, mettre « Tu retrouves ensuite ta question et sa réponse dans ton espace. » en phrase séparée).
Le reste de l'article ne change pas (« les e-mails déjà reçus restent dans ta boîte » reste vrai).

**Base légale** : exécution du contrat (service compris dans l'abonnement Premium, l'historique en fait partie), déjà écrite dans la puce 2.

**Mention d'opposition : non obligatoire.** Le droit d'opposition de l'art. 21 ne s'applique pas à l'exécution du contrat, et les droits d'accès et d'effacement sont déjà en puce 5 et partie 7.

**À confirmer par Thomas** : durée « tant que le compte existe » (défaut retenu ci-dessus). Si l'abonnement s'arrête, l'historique reste gardé (compte conservé) : la phrase est vraie quel que soit l'affichage choisi, tant qu'on ne promet pas de l'afficher aux non-abonnés.
