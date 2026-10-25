# Relecture à l'aveugle : « Ta question à l'équipe » (s22), 25/10/2026

Périmètre lu : `config/textes/question-equipe-s22.ts`, `components/profil/question-equipe-card.tsx`, `config/question-equipe.ts`, `lib/question-equipe.ts`, `app/api/question-equipe/route.ts`, `lib/email.ts` (sendOrAlert), confidentialité (parties 4, 6, 9), CGU (articles 4, 7, 10), les 19 captures de `docs/qa/captures-question-equipe-s22/`. Pas lu : `docs/reviews/`, le scratchpad. Décisions de Thomas (délai, pas de limite affichée, rien en base, signature, pas de mention IA, IONOS vers Gmail) : appliquées comme référence, non discutées.

## Verdict : NO-GO, 8/10, 5 bloquants

| # | Critère | Note | En bref |
|---|---|---|---|
| 1 | Clarté et envie | 8,5 | Titre, accroche, exemple et délai se comprennent en 5 s. Mais le succès ne dit pas où arrive la réponse et la mention contredit l'exemple (B2) |
| 2 | Vérité | 7,5 | Rien en base, Reply-To pris en base, Premium revérifié : conforme. Deux messages d'erreur sont faux dans certains cas (B3, B5) |
| 3 | Cohérence encadré / confidentialité / CGU | 7 | Le délai est cohérent partout. La durée de conservation contredit CGU 7 et confidentialité 6 (B1). Tiers / nom de personne divergent (B2) |
| 4 | Ton maison | 9 | Tutoiement, phrases simples, CGU lisibles. Quelques tournures maladroites (« Ton champ est vide », « Ta situation dépasse ») |
| 5 | Forme (captures) | 7,5 | Mobile 360 propre, rien ne déborde, cible du bouton ≥ 44 px. Mais l'état « envoi impossible » n'est pas capturé (fichiers mal nommés) et le succès est noyé sous la mention |
| 6 | Règles maison | 9,5 | Aucun tiret cadratin ni demi-cadratin (Grep sur les 7 fichiers : 0), aucune mention IA ni « humain », rien d'inventé. Seul souci : l'e-mail interne que l'abonné risque de revoir (B4) |

Moyenne : 8,2, arrondie à 8/10. Il faut ≥ 9 et zéro bloquant pour le GO.

## Bloquants

**B1. Durée de conservation : contradiction avec CGU 7 et confidentialité 6** (critère 3)
- CGU art. 7 (`cgu/page.tsx:75`) : « La suppression est immédiate : tes données personnelles sont effacées ». Confidentialité 6 (`confidentialite/page.tsx:133`) : « Tes données sont conservées tant que ton compte existe ». Or la section 9 garde la question et l'adresse 6 mois après le dernier échange, que le compte existe ou non. Les factures sont citées en exception, les questions ne le sont pas.
- Proposé, CGU 7, après « …chez Stripe pour nos obligations comptables » : « Tes échanges par e-mail avec l'équipe (Ta question à l'équipe) restent 6 mois après le dernier échange, puis sont effacés (voir la politique de confidentialité). »
- Proposé, confidentialité 6 (nouveau paragraphe, affiché seulement interrupteur ouvert) : « Tes questions à l'équipe et nos réponses restent dans la boîte e-mail de l'équipe 6 mois après votre dernier échange, même si tu supprimes ton compte avant, puis sont effacées (voir la partie 9). »
- Agent : @legal (texte), @fullstack (affichage conditionnel).

**B2. « sur des tiers » contredit l'exemple de l'encadré** (critères 1 et 3)
- L'aide demande de décrire « un collègue te chambre devant tout le monde ». Juste en dessous, la mention dit « Évite les infos […] sur des tiers ». Le service consiste justement à raconter une situation avec quelqu'un. Les CGU, elles, disent « ni nom de personne » : la règle n'est pas la même.
- Actuel : « Ton message est lu par l'équipe pour te répondre. Évite les infos sur ta santé ou sur des tiers. Détails et droits : Confidentialité. »
- Proposé : « Ton message est lu par l'équipe pour te répondre. Évite les noms et les infos sur ta santé. Détails et droits : Confidentialité. »
- La phrase CGU (« ni information sensible sur toi, ni nom de personne ») reste compatible. Agent : @legal pour valider l'équivalence.

**B3. Limite par jour : « quelques minutes » est faux** (critère 2)
- `config/question-equipe.ts:33-36` : 3 envois par 10 min **et** 10 par 24 h. Si la limite du jour bloque, l'attente peut durer des heures, et la phrase « Patiente quelques minutes, puis renvoie. » devient fausse.
- Proposé (aucune limite affichée, décision respectée) : « Trop d'envois d'un coup. Réessaie plus tard, ou écris-nous à contact@deviens-marrant.fr. »
- Variante possible : lire `Retry-After` et afficher « Réessaie dans quelques minutes. » (≤ 15 min) ou « Réessaie demain. » (au-delà). Agent : @copywriter, puis @fullstack.

**B4. L'abonné risque de revoir l'e-mail interne dans la réponse** (critères 2 et 6)
- L'équipe répond depuis Gmail avec « Répondre » (Reply-To). L'abonné reçoit alors l'objet « Re: Ta question à l'équipe : nouvelle question d'un abonné Premium ». Gmail cite aussi par défaut tout le message d'origine, dont les « Rappels (avis @legal du 25/10) : […] dans un outil de rédaction, coller seulement le texte […] Reply-To, lue dans la session […] 3114 […] » (`question-equipe-s22.ts:45-56`). C'est du jargon interne visible par le client, et une allusion aux outils de rédaction que la décision « aucune mention IA » veut éviter.
- Proposé : objet lisible par l'abonné, « Ta question à l'équipe Deviens Marrant ». Corps limité à « Ta question : » suivi du texte. Les rappels vont dans le playbook interne ou dans un modèle de réponse Gmail, pas dans l'e-mail. Si les rappels doivent rester dans l'e-mail, il faut une consigne écrite « supprimer la citation avant envoi », mais c'est fragile.
- Agent : @fullstack (gabarit), @legal (rappels déplacés, pas supprimés).

**B5. Premium arrêté entre l'affichage et l'envoi : « Réessaie » est faux** (critère 2)
- La route renvoie 403 `non-premium`. Le composant (`question-equipe-card.tsx:28-33`) le traite comme « envoi » : « Ton message n'est pas parti. Réessaie dans un instant… ». Réessayer ne servira jamais.
- Proposé (nouvel état `non-premium`) : « Ton abonnement Premium n'est plus actif, et cette fonction en fait partie. Ton texte est toujours dans le champ. » Ajouter un lien « Voir les offres ». Agent : @copywriter, puis @fullstack (avec capture @qa).

## À corriger

| # | Où | Actuel | Proposé | Agent |
|---|---|---|---|---|
| C1 | Succès (`succes`) | « Bien reçu. On regarde ta situation. En général, réponse par e-mail sous 1 à 2 jours ouvrés. » | « Bien reçu. On te répond à l'adresse e-mail de ton compte, en général sous 1 à 2 jours ouvrés. » (on y dit où arrive la réponse, ce que l'encadré ne dit nulle part, et le délai ne change pas) | @copywriter |
| C2 | Erreur trop long | « Ta situation dépasse 1 000 caractères. Raccourcis-la pour garder l'essentiel, puis renvoie. » | « Ton message dépasse 1 000 caractères. Garde l'essentiel, puis envoie. » (rien n'est parti : « renvoie » est faux, et « ta situation dépasse » se lit mal) | @copywriter |
| C3 | Erreur vide | « Ton champ est vide. Décris ta situation en quelques lignes, puis envoie. » | « Le champ est vide. Décris ta situation en quelques lignes, puis envoie. » | @copywriter |
| C4 | Confidentialité 9, « Qui y accède » et « Combien de temps » | « l'équipe, dans la boîte contact@deviens-marrant.fr » / « restent dans la boîte e-mail de l'équipe 6 mois » | « l'équipe, dans la boîte contact@deviens-marrant.fr (hébergée chez IONOS, qui la transfère vers une messagerie Gmail) » / « restent dans la boîte e-mail de l'équipe (IONOS et Gmail) 6 mois… ». Ainsi la section 9 suit la partie 4 | @legal |
| C5 | Confidentialité 9, durée chez Resend | Rien sur la copie gardée par Resend | Resend garde les e-mails envoyés dans ses journaux pendant une durée qui dépend du plan. Les sources publiques se contredisent (de 1 à 30 jours en gratuit, de 3 à 60 jours en Pro) : [HYPOTHÈSE à vérifier sur la page Tarifs de Resend et dans le compte]. Une fois la durée confirmée, ajouter « Resend en garde une copie technique X jours. » ou réduire la durée de conservation dans le compte | @legal, Thomas |
| C6 | CGU 10, périmètre | « pour décrire une situation où la répartie leur a manqué » | « pour décrire une situation où ils n'ont pas su quoi répondre ou quoi écrire ». L'encadré propose aussi « un message te bloque » | @legal |
| C7 | Captures | Les fichiers `erreur-envoi-360/390/1440.png` montrent l'erreur « Trop d'envois », pas « Ton message n'est pas parti » | Refaire « envoi » sous son vrai nom, et ajouter « trop », « session », « envoi en cours », « non-premium » (B5) en 360 et en 1440 | @qa |
| C8 | Succès (forme) | Le message s'affiche sous la mention en petits caractères, en gris comme le corps, et répète le délai déjà affiché en haut (`succes-360.png`, `succes-1440.png`) | Le placer juste sous le bouton, au-dessus de la mention, avec le style succès (token success + icône), pour qu'il se distingue au premier coup d'oeil | @design, @fullstack |
| C9 | Fil Gmail (à tester) | L'objet est le même pour toutes les questions et l'expéditeur aussi | D'après les règles publiées par Google, deux e-mails sans en-tête References, avec le même objet et le même expéditeur, peuvent se regrouper dans une seule conversation. « Répondre » viserait alors le dernier abonné du fil. Faire un test réel avec 2 comptes. S'ils se regroupent, ajouter une référence courte sans donnée personnelle dans l'objet (« n° 4821 », aléatoire) | @qa, @fullstack |

## Optionnel

- **O1. Accroche au masculin.** Actuel : « On t'a chambré, tu es resté sans voix, un message te bloque ? Raconte, l'équipe te répond. » Proposé : « Une vanne qui t'a cloué le bec, un silence gênant, un message que tu n'arrives pas à écrire ? Raconte, l'équipe te répond. » La phrase est neutre en genre et reprend les trois cas du service.
- **O2.** Le libellé dit « Ta situation » et le bouton « Envoyer ma question ». Proposé : « Envoyer à l'équipe ».
- **O3.** Erreur « envoi » : mettre contact@deviens-marrant.fr en lien `mailto:`.
- **O4.** Titre CGU 10 « La lettre et ta question à l'équipe » alors que le texte parle d'abord de la question. Proposé : « Ta question à l'équipe et la lettre ».
- **O5.** « rien n'est publié ni repris ailleurs sans ton accord » (CGU et confidentialité) peut se lire comme contraire à l'usage d'outils de rédaction. Proposé : « rien n'est publié ni réutilisé sur le site sans ton accord ».
- **O6.** En 1440, le formulaire occupe la moitié gauche de la carte et la droite reste vide. Ça passe, mais on peut limiter la largeur de la carte ou mettre l'exemple en colonne à droite.
- **O7.** Le compteur compte le texte non nettoyé (espaces de bord compris), la validation compte le texte nettoyé. On peut afficher « 1 001 » en rouge et envoyer quand même. C'est sans gravité.

## Vérifié conforme (sans correction)

- Rien en base : la route ne fait qu'un `findUnique` en lecture. La limite d'envois utilise une clé hachée sans texte. L'alerte d'échec garde seulement le domaine de contact@ et l'objet fixe.
- Qui lit, où ça va : seule destinataire contact@. Reply-To = adresse du compte lue en base, nettoyée. Les champs envoyés dans le corps sont ignorés.
- Délai : la même formule partout (encadré, succès, CGU, rappel interne). Les CGU donnent le maximum de 3 jours ouvrés, comme décidé.
- Prestataires (partie 4) : Resend, Google (Gmail), IONOS et outils de rédaction sont déclarés, ce qui suit le trajet réel du message.
- Compte gratuit : aucun encadré (`compte-gratuit-aucun-encadre-390.png`), et l'API revérifie Premium.
- Accessibilité : `role="alert"` sur les erreurs, `aria-live` sur le statut, focus rendu au champ, texte gardé en cas d'erreur, bouton `min-h-11`.

## Points à confirmer par Thomas (process, hors code)

1. **Effacement à 6 mois** : rien ne l'automatise, ni dans IONOS ni dans Gmail. Prévoir un rappel mensuel ou un filtre et un libellé Gmail, sinon la promesse de la section 9 ne sera pas tenue.
2. **Adresse d'envoi des réponses** : si Gmail n'est pas réglé en « Envoyer en tant que contact@deviens-marrant.fr », l'abonné reçoit la réponse d'une adresse Gmail personnelle. Le texte « L'Équipe Deviens Marrant » et la confidentialité seraient alors en décalage.

## Top 3

1. B4 : l'abonné voit l'objet et les rappels internes dans la réponse.
2. B1 : la durée de conservation contredit CGU 7 et confidentialité 6.
3. B2 + B3 + B5 : trois phrases d'interface fausses ou contradictoires, chacune corrigée en une ligne.

Sources externes : [Google Workspace Updates, threading Gmail (2019)](https://workspaceupdates.googleblog.com/2019/03/threading-changes-in-gmail-conversation-view.html?hl=da) ; [automationatlas.io, offre gratuite Resend](https://automationatlas.io/answers/resend-free-tier-explained-2026/) ; [iconpolls.com, avis Resend 2026](https://iconpolls.com/blogs/resend-review-2026-email-api-sign-up-login-free-plan-pricing-user-experience-and-faqs) ; [devtune.ai, tarifs Resend](https://devtune.ai/verticals/communications-apis/resend/pricing).
