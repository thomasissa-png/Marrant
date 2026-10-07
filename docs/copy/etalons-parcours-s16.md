# Étalons des nouvelles surfaces du parcours (s16, 07/10/2026)

> **Statut : à valider par Thomas avant toute application** (règle P0 s8). Rien n'a été modifié dans `src/`. Les développeurs gardent leurs textes provisoires jusqu'à ton retour.
> Décisions déjà actées et appliquées ici : « Premium » comme seul nom, annuel avec « plus de 3 mois offerts » ET « 10,89 € économisés », tutoiement partout, e-mails signés « L'Équipe Deviens Marrant ». Prix : 2,99 € TTC par mois, 24,99 € TTC par an (jamais écrits en dur dans le code, ils viennent de `config/premium.ts`).
> Règles tenues dans tous les textes : tutoiement, zéro tiret cadratin, aucune mention d'IA, rien d'infantilisant ni de culpabilisant, « e-mail » avec trait d'union, aucune promesse non codée. Ce qui dépend d'un fait à confirmer est marqué `[À VÉRIFIER]` ou `[À VALIDER @legal]`. Les `{{...}}` sont des champs remplis automatiquement.

> **Mise à jour 07/10 (validée par Thomas)** : étalon 1 (texte Stripe) ouvert par « En cliquant sur « S'abonner », tu passes une commande avec obligation de paiement : … » (+ « prélevé chaque mois jusqu'à ta résiliation » en mensuel) ; étalon 2, paragraphe rétractation remplacé par le texte de `docs/marrant/audit-parcours-s16/relecture-legal.md` ; remboursement 14 jours réservé au premier paiement. Texte en production : `apps/web/src/config/textes/paiement.ts`.

---

## Étalon 1 : ligne de réassurance près du bouton de paiement

**Où** : sous le bouton (page /abonnement, étape 2) et dans le texte de la page Stripe (`custom_text`, 1 200 caractères max). **Rôle** : lever la peur du piège juste avant de sortir la carte. [Framework : réassurance de tunnel] [Conscience : Most-Aware]

| | Texte site (une ligne sous le bouton) | Longueur |
|---|---|---|
| 1.1 | Mensuel : « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux. » Annuel : « 24,99 € TTC par an, remboursé sous 14 jours, résiliable en ligne quand tu veux. » | 85 car. |
| 1.2 | « Prix TTC, sans engagement. Tu as 14 jours pour te faire rembourser et tu résilies en ligne, depuis ton profil. » | 112 car. |
| 1.3 | « Tout est TTC. Si Premium ne te convient pas, tu as 14 jours pour être remboursé, et tu résilies en deux clics. » | 111 car. |

1.3 est écartée : « deux clics » est une promesse chiffrée que le portail Stripe n'a pas été vérifié pour tenir.

**Texte Stripe (`custom_text.submit.message`), à utiliser avec 1.1** (environ 330 caractères) :

> Premium : {{2,99 € TTC par mois}} ou {{24,99 € TTC par an, renouvelé chaque année}}. Tu as 14 jours pour te faire rembourser (formulaire : deviens-marrant.fr/retractation). Tu résilies en ligne depuis ton profil, quand tu veux : ton accès reste ouvert jusqu'à la fin de la période payée. En payant, tu acceptes les CGU : deviens-marrant.fr/cgu

(Le code n'affiche que la formule choisie.) `[À VÉRIFIER @fullstack : Stripe affiche-t-il les liens en cliquable ? Sinon l'adresse en clair, comme ci-dessus, reste lisible.]`

**Reco : 1.1** (site) et le texte Stripe ci-dessus. Les trois promesses de Thomas (TTC, 14 jours, en ligne) tiennent en une phrase qui se lit sans pause, avec le prix collé au mot « TTC ». 1.2 est plus douce mais dilue le prix.
**Règles** : tutoiement oui, 0 tiret cadratin, 0 mention IA, aucun ton culpabilisant, mentions TTC, 14 jours, résiliation en ligne, reconduction annuelle, CGU présentes. **Auto-évaluation : 9/10** (Thomas validerait : oui ; qualité : courte et exacte ; pertinence : reprend l'audit D11 à l'identique). Le dixième point dépend de la vérification des liens Stripe.

---

## Étalon 2 : e-mail de confirmation d'abonnement (sert aussi de bienvenue)

**Déclencheur** : paiement réussi. Il contient tout ce que L.221-13 impose : formule, prix TTC, date, reconduction, résiliation en ligne, droit de rétractation 14 jours avec lien du formulaire, lien des CGU. [Framework : confirmation puis première action] [Conscience : Most-Aware]

**Objets**

| | Objet | Longueur |
|---|---|---|
| 2.1 | Ton abonnement Premium est confirmé | 35 car. |
| 2.2 | Bienvenue dans Premium, ton abonnement est confirmé | 51 car. |
| 2.3 | Premium est activé, voici ta confirmation | 41 car. |

**Corps A (récapitulatif en liste, environ 190 mots)**

> Salut {{prénom}},
>
> Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance.
>
> Voici ta confirmation :
> - Formule : Premium {{mensuel / annuel}}
> - Prix : {{2,99 € TTC par mois / 24,99 € TTC par an}}
> - Souscrit le : {{date}}
> - Prochain prélèvement : {{date de renouvellement}}, {{montant}} TTC. L'abonnement se reconduit automatiquement à cette date, jusqu'à ce que tu le résilies.
>
> {{SI annuel : Avec l'annuel, tu as plus de 3 mois offerts : 10,89 € économisés par rapport au mensuel.}}
>
> **Résilier** : en ligne, à tout moment, depuis ton profil, rubrique « Gérer mon abonnement » : {{lien /profil}}. Ton accès reste ouvert jusqu'à la fin de la période payée.
>
> **Droit de rétractation** : tu as 14 jours à partir d'aujourd'hui, soit jusqu'au {{date + 14 jours}}, pour te rétracter et être remboursé, sans donner de motif. Il suffit de remplir ce formulaire : {{lien /retractation}}.
>
> Les CGU qui s'appliquent à ton abonnement : {{lien /cgu}}.
>
> **Pour bien démarrer** : ouvre un parcours et lance l'étape 2 (la première se lit déjà sans compte) : {{lien /parcours}}.
>
> À très vite,
> L'Équipe Deviens Marrant

**Corps B (en phrases, plus court, environ 120 mots)**

> Salut {{prénom}},
>
> C'est fait : Premium est activé sur ton compte. Ton abonnement {{mensuel / annuel}} coûte {{prix}} TTC et se reconduit automatiquement le {{date}}, jusqu'à ce que tu le résilies.
>
> Tu peux résilier en ligne à tout moment depuis ton profil ({{lien}}), et tu gardes l'accès jusqu'à la fin de la période payée. Tu as aussi 14 jours, jusqu'au {{date}}, pour te rétracter et être remboursé : le formulaire est ici ({{lien}}). Les CGU sont là : {{lien}}.
>
> Premier réflexe conseillé : ouvre un parcours et lance l'étape 2 ({{lien}}).
>
> À très vite,
> L'Équipe Deviens Marrant

**Reco : corps A avec objet 2.2.** La liste rend chaque obligation légale repérable d'un coup d'œil (utile si le client revient chercher la date ou le lien de rétractation), et l'objet dit à la fois « bienvenue » et « confirmé », donc il sert aux deux rôles. B est plus fluide mais cache les mentions dans un bloc de texte.
**À confirmer** : `[À VALIDER @legal : formulation du droit de rétractation et du remboursement des 14 jours, y compris pour l'annuel]` ; `[À VÉRIFIER @fullstack : adresse de réponse, pour ajouter « Une question ? Réponds à cet e-mail »]` ; la ligne annuelle utilise les deux formules actées, 10,89 € est le calcul 35,88 moins 24,99.
**Règles** : tutoiement oui, 0 tiret cadratin, signature oui, 0 IA, ton neutre et chaleureux, toutes les mentions L.221-13 présentes. **Auto-évaluation : 9/10** (Thomas validerait : oui ; qualité : complet sans lourdeur ; pertinence : première action concrète). Le dixième point reste à @legal.

## Étalon 3 : e-mail « paiement refusé »

**Déclencheur** : première tentative de prélèvement refusée (Premium gardé pendant les nouvelles tentatives). Il faut être clair sans faire peur, et surtout ne rien reprocher : une carte expire, un plafond se dépasse. [Framework : PAS court, problème puis solution] [Conscience : Problem-Aware]

**Objets**

| | Objet | Longueur |
|---|---|---|
| 3.1 | Ton paiement Premium n'est pas passé | 36 car. |
| 3.2 | Ton paiement n'est pas passé, ton Premium reste actif | 53 car. |
| 3.3 | Mets à jour ta carte pour garder Premium | 40 car. |

**Corps A (environ 120 mots)**

> Salut {{prénom}},
>
> Le prélèvement de ton abonnement Premium ({{montant}} TTC, prévu le {{date}}) n'est pas passé. Ça arrive : carte expirée, plafond atteint, vérification de la banque.
>
> Rien n'est coupé pour l'instant : ton accès Premium reste ouvert pendant que le prélèvement est retenté automatiquement dans les prochains jours. `[À VÉRIFIER @fullstack : durée et nombre réels des tentatives, pour la nommer si possible]`
>
> Si ta carte a changé ou si ta banque a bloqué le paiement, tu peux la mettre à jour ici : {{bouton : Mettre à jour ma carte}}.
>
> Si le paiement reste impossible à la fin des tentatives, l'abonnement s'arrête et l'accès Premium se ferme. Tu pourras te réabonner quand tu veux.
>
> L'Équipe Deviens Marrant

**Corps B (très court, environ 60 mots)**

> Salut {{prénom}},
>
> Ton prélèvement Premium du {{date}} n'est pas passé. Pas de panique : ton accès reste ouvert pendant les nouvelles tentatives.
>
> Pour que ça passe, mets ta carte à jour : {{bouton : Mettre à jour ma carte}}.
>
> L'Équipe Deviens Marrant

**Reco : corps A avec objet 3.2.** L'objet donne le fait et la bonne nouvelle d'un coup (le client n'ouvre pas l'e-mail en paniquant), et le corps dit honnêtement ce qui se passe si ça échoue, sans menace. B est bon pour un second rappel.
**Règles** : tutoiement oui, 0 tiret cadratin, signature oui, 0 IA, aucun reproche (« ça arrive »), pas de « tu as oublié ». « Tu pourras te réabonner » est vrai (bouton /abonnement). **Auto-évaluation : 9/10** (le seul point ouvert est la durée des tentatives, que je ne chiffre pas faute de donnée).

## Étalon 4 : messages d'erreur (une phrase chacun)

Toutes en ton « pote » : on explique la cause quand elle est connue, on donne la sortie, on ne reproche rien. Point final partout. [Framework : réparation, une phrase] [Conscience : Most-Aware]

| Cas | Variante a | Variante b | Variante c | Reco |
|---|---|---|---|---|
| **Identifiants incorrects** | E-mail ou mot de passe incorrect. | Ça ne correspond pas : vérifie ton e-mail et ton mot de passe. | E-mail ou mot de passe incorrect. Réessaie, ou réinitialise ton mot de passe. | **c** : donne la sortie en même temps que le constat |
| **Trop d'essais** | Trop de tentatives pour le moment. Patiente un peu avant de réessayer. | Trop d'essais pour l'instant, c'est une sécurité. Attends un peu, ou réinitialise ton mot de passe. | Trop d'essais d'affilée. Fais une pause, puis réessaie. | **b** : explique que c'est une protection, pas un reproche |
| **Compte créé avec Google** | Ce compte a été créé avec Google. Utilise « Continuer avec Google » pour te connecter. | Si tu as créé ton compte avec Google, clique sur « Continuer avec Google ». | Pas de mot de passe sur ce compte : connecte-toi avec Google. | **b** (voir note ci-dessous) |
| **Adresse déjà liée à un compte avec mot de passe** (inscription Google) | Un compte avec mot de passe existe déjà pour cette adresse. Connecte-toi avec ton e-mail et ton mot de passe. | Cette adresse a déjà un compte avec mot de passe : connecte-toi avec, ou demande-en un nouveau si tu l'as oublié. | Cette adresse a déjà un compte. Connecte-toi avec ton mot de passe. | **b** : donne les deux sorties (connexion, oubli) |
| **Erreur serveur** | Quelque chose a coincé de notre côté. Réessaie. | Quelque chose a coincé de notre côté. Réessaie dans un instant. | Un grain de sable chez nous. Réessaie dans un instant. | **b** : garde la phrase déjà en place sur le site (voix maison) en ajoutant « dans un instant » |

**Notes de choix**
- Compte Google : la variante a confirme à n'importe qui qu'une adresse a un compte (fuite d'information). La b s'affiche comme aide sous l'erreur générique et ne révèle rien. Si tu préfères la a (plus directe), c'est possible, avec ce risque connu. Option à valider avec @fullstack : l'interface doit pouvoir distinguer ces cas. `[À VÉRIFIER @fullstack]`
- Trop d'essais : je n'écris aucune durée (« quelques minutes ») tant que la durée réelle du blocage n'est pas confirmée. `[À VÉRIFIER @fullstack]`
- Aucun message technique brut (« Erreur serveur », « Données invalides », « Email requis ») ne doit plus s'afficher : ils sont remplacés par la ligne ci-dessus ou par un message du même style.

**Règles** : tutoiement oui, 0 tiret cadratin, 0 IA, aucune phrase culpabilisante (pas de « tu as dû te tromper »). **Auto-évaluation : 9/10** (Thomas validerait : oui ; qualité : sobre, pas de fausse blague sur un moment d'agacement ; pertinence : un message par cause réelle).

## Étalon 5 : succès sans connexion, retour de paiement annulé, résiliation

### 5a. Page de succès quand le client n'est pas connecté

**Problème à corriger** : aujourd'hui n'importe qui voit « Paiement reçu ! » même sans paiement. Ici, le texte reste vrai à chaque instant. [Framework : orientation, un seul geste] [Conscience : Most-Aware]

| | Titre | Texte | Bouton | Lien discret |
|---|---|---|---|---|
| 5a.1 | Connecte-toi pour retrouver ton accès | Si tu viens de t'abonner, ton Premium est rattaché à ton compte. Connecte-toi pour en profiter. | Me connecter | Voir Premium |
| 5a.2 | Connecte-toi pour retrouver ton abonnement | Tu n'es pas connecté sur cet appareil, alors on ne peut pas confirmer ton paiement d'ici. Si tu viens de t'abonner, connecte-toi : ton accès apparaîtra dans ton profil. | Me connecter | Pas encore abonné ? Voir Premium |
| 5a.3 | Une dernière étape : te connecter | Connecte-toi avec le compte créé pour ton abonnement, ton Premium t'y attend. | Me connecter | Voir Premium |

**Reco : 5a.2.** Elle dit pourquoi la page ne confirme rien (aucune fausse promesse), reste conditionnelle (« si tu viens de t'abonner ») et s'adresse aussi à celui qui est arrivé là par erreur. 5a.1 est plus courte, 5a.3 affirme un paiement qu'on ne peut pas vérifier.

### 5b. Message au retour d'un paiement annulé (bandeau court)

| | Texte | Longueur |
|---|---|---|
| 5b.1 | Paiement annulé, tu peux réessayer quand tu veux. | 48 car. (texte déjà en place) |
| 5b.2 | Paiement annulé, rien n'a été prélevé. Tu peux réessayer quand tu veux. | 71 car. |
| 5b.3 | Tu as quitté la page de paiement, rien n'a été prélevé. On t'attend quand tu veux. | 82 car. |

**Reco : 5b.2.** Elle garde ta phrase actuelle et ajoute la seule chose que quelqu'un qui revient d'une page de paiement veut savoir. « Rien n'a été prélevé » est vrai quand on quitte la page Stripe avant de payer. 5b.1 reste un très bon plan B si tu préfères ne rien changer.

### 5c. E-mail de confirmation de résiliation (court)

**Déclencheur** : résiliation enregistrée. Le mail de rappel annuel promet déjà « un e-mail te confirme la résiliation et sa date d'effet » : celui-ci tient la promesse. [Framework : confirmation, zéro friction] [Conscience : Most-Aware]

**Objets** : 5c.1 « Ta résiliation est confirmée » (27 car.) · 5c.2 « Ton abonnement Premium est résilié » (36 car.) · 5c.3 « C'est noté : ton Premium s'arrête le {{date}} » (environ 45 car.)

**Corps (environ 65 mots)**

> Salut {{prénom}},
>
> Ta résiliation est bien prise en compte. Tu gardes l'accès Premium jusqu'au {{date de fin}}, puis l'abonnement s'arrête : aucun nouveau prélèvement.
>
> Tu peux te réabonner quand tu veux : {{lien /abonnement}}. Les premières étapes des parcours restent en lecture libre.
>
> Merci d'avoir bossé ton humour avec nous.
>
> L'Équipe Deviens Marrant

**Reco : objet 5c.3 et le corps ci-dessus.** La date dans l'objet est la seule information utile, et la fin du mail remercie sans retenir ni culpabiliser (pas de « dommage de te voir partir », pas de relance d'offre). Option, à ta décision : une phrase « Un retour à nous faire ? Réponds à cet e-mail » `[À VÉRIFIER @fullstack : adresse de réponse]`.

**Règles (5a, 5b, 5c)** : tutoiement oui, 0 tiret cadratin, signature sur l'e-mail, 0 IA, aucun texte culpabilisant. **Auto-évaluation : 9/10** pour chacun des trois (5a.2 : honnête et claire ; 5b.2 : changement minimal et utile ; 5c : court, daté, sans pression).

---

## Handoff

**Handoff → @orchestrator (puis Thomas pour validation, ensuite @fullstack pour l'intégration)**
- Fichier produit : `/home/user/Marrant/docs/copy/etalons-parcours-s16.md` (aucun autre fichier modifié, pas de commit).
- Recos : 1.1 + texte Stripe ; e-mail confirmation A + objet 2.2 ; e-mail paiement refusé A + objet 3.2 ; erreurs c / b / b / b / b ; succès non connecté 5a.2 ; paiement annulé 5b.2 ; résiliation objet 5c.3 + corps.
- À trancher par Thomas : un choix par étalon (ou « je suis tes recos ») ; compte Google : message qui ne révèle rien (reco) ou explicite.
- À vérifier avant mise en ligne : formulation du droit de rétractation et du remboursement des 14 jours (@legal) ; liens cliquables dans le texte Stripe, durée des tentatives de prélèvement, durée du blocage « trop d'essais », adresse de réponse des e-mails, distinction des cas d'erreur côté interface (@fullstack). Aucun chiffre inventé : 2,99 €, 24,99 €, 10,89 € et 14 jours viennent des décisions et du code.
- Objections traitées : « c'est un piège à abonnement » (étalons 1, 2, 5c), « je perds mon accès sans le savoir » (3), « mon paiement est-il passé ? » (5a, 5b), « je suis bloqué sans savoir pourquoi » (4). Références marché : aucune recherche web, la charte et les étalons s15 font foi, aucun concurrent cité. Après validation et intégration : mesure du diff réel obligatoire (P0 s11).
