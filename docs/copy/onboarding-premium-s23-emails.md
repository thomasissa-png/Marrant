# Onboarding Premium s23 : textes finaux E0, E1, E2 (07/11/2026)

Statut : BROUILLON, avant relecture à l'aveugle (barre 9/10), panel des 3 personas sur la chaîne enchaînée, avis @legal et approbation de Thomas en session. Rien n'est envoyé avant.
Source des choix : `etalons-onboarding-s23.md` (Thomas, 07/11 : 1 A, 2 C, 3 A, 4 A, 5 C), repris mot pour mot. Cadre : `docs/growth/onboarding-premium-s23-plan.md`, `docs/legal/resiliation-onboarding-cadre-s23.md`.

[Framework : AIDA court pour E0 (accueil, liste, premier pas) ; PAS inversé pour E1 (une situation vécue, puis la porte ouverte) ; question ouverte pour E2.]
[Conscience : Product-Aware à Most-Aware (l'abonné vient de payer), E0 transactionnel.]

Conventions de rendu (toutes les variantes) :
- Texte seul, tutoiement, « on », zéro tiret cadratin, zéro émoji. Apostrophes typographiques ’ comme dans `paiement.ts` (les étalons notent ', même texte).
- `{prénom}` absent : « Salut, ». `{url}` = `siteUrl()`. `{N}` = `PARCOURS_COUNT` (`config/premium.ts:89`, dynamique, jamais en dur). Signature = constante `SIGNATURE` (`paiement.ts:27`) ; dans E1/E2, suivie de « deviens-marrant.fr » comme le rappel de parcours.
- Dans E0, les libellés « Pour commencer », « Cette semaine », « Ensuite, à ton rythme » sont rendus sans astérisques (texte seul).

---

## E0 : bienvenue (J0, transactionnel, part tout de suite, jeudi compris)

**Objet** (étalon 1 A) : `Ton abonnement est confirmé : Premium est ouvert, sers-toi`
**Préheader** (79 car.) : `Le catalogue, les parcours et le reste sont ouverts. Voici par où commencer.`
Envoi : `replyTo` inchangé (e-mail de service). Pas de lien d'arrêt (transactionnel, cadre E1 à E4).

### Corps rendu

Ordre exact du rendu (blocs balisés `[si …]` rendus seulement si la condition est vraie ; prénom absent : « Salut, voici ce qui vient de s’ouvrir, et par où commencer. ») :

```
Salut {prénom}, voici ce qui vient de s’ouvrir, et par où commencer.

Pour commencer : [si carnet] une fiche du carnet du mois, une situation et sa réplique.
[si carnet] Ouvrir le carnet : {url}/carnet
[sinon] la première étape d’un parcours, au choix parmi les {N}.
[sinon] Choisir mon parcours : {url}/parcours

Cette semaine : le catalogue sans limite, les exercices des fiches, tes favoris, ta progression et ta série.[si état recoit] La lettre de la semaine arrive chaque jeudi, incluse dans ton abonnement ; tu l’arrêtes en un clic, depuis chaque lettre ou ton profil.

Ensuite, à ton rythme : les {N} parcours en entier (toutes les étapes sont ouvertes, une par semaine reste le rythme conseillé, avec un rappel par e-mail sur demande)[si carnet], les carnets passés[si question], « Ta question à l’équipe » depuis ton profil.

Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance.

Voici ta confirmation :
- Formule : Premium {annuel|mensuel}
- Prix : {prix}
- Souscrit le : {dateLongue(souscription)}
- Prochain prélèvement : {dateLongue(prochain)}, {montant} TTC. L’abonnement se reconduit automatiquement à cette date, jusqu’à ce que tu le résilies.
[si annuel] Avec l’annuel, tu as {ANNUEL_MOIS_OFFERTS_LABEL} : {économie} économisés par rapport au mensuel.

Résilier : en ligne, à tout moment, depuis ton profil, bouton « Résilier ton contrat » : {url}/profil. Ton accès reste ouvert jusqu’à la fin de la période payée.
Prends ton temps pour te faire un avis : d’ici le {dateLongue(prochain)}, tout est ouvert, et tu pourras encore résilier la veille.

Droit de rétractation : tu as 14 jours à partir d’aujourd’hui, soit au moins jusqu’au {dateLongue(finRetractation)}, pour te rétracter sans donner de motif. On te rembourse alors l’intégralité de ce que tu as payé (mensuel comme annuel), sous 14 jours maximum après ta demande. Il suffit de remplir ce formulaire : {url}/retractation.

Les CGU qui s’appliquent à ton abonnement : {url}/cgu.

À très vite,
L’Équipe Deviens Marrant

============================================
{formulaireTypeRetractation(), inchangé}
```

Règle du « et » final de « Ensuite » : le dernier élément rendu prend « et » à la place de la virgule. Les quatre rendus :
- carnet + question : `…sur demande), les carnets passés et « Ta question à l’équipe » depuis ton profil.`
- carnet seul : `…sur demande) et les carnets passés.`
- question seule : `…sur demande) et « Ta question à l’équipe » depuis ton profil.`
- ni l'un ni l'autre : `…sur demande).`

Conditions de rendu (code) :
- `[si carnet]` : carnet du mois publié (même condition que la ligne `carnet` de `lignesTableau`). Sans carnet, « Pour commencer » bascule sur le parcours.
- `[si état recoit]` : état du compte `recoit` seulement (`LETTRE_HEBDO_INFO_PAIEMENT`) ; `arretee`, `opposition` ou illisible : la phrase lettre disparaît, le point qui précède reste (« …ta progression et ta série. »).
- `[si question]` : `QUESTION_EQUIPE_OUVERTE` (`config/question-equipe.ts:11`, true aujourd'hui).
- Retiré du gabarit actuel : la ligne « Tout est ouvert. Pour démarrer, choisis un parcours : {url}/parcours. » (remplacée par « Pour commencer », étalon 2, règle S11) et l'ancienne phrase d'ouverture à la place de l'objet 2.2. Tout le reste du bloc contractuel est inchangé, mot pour mot (lignes 279 à 291 et 295 à 299 de `paiement.ts`), y compris « Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance. », déplacé sous la liste, devant « Voici ta confirmation ».
- Étalon 5 C : sa phrase est sur sa propre ligne, juste après « Résilier … », avant « Droit de rétractation », sans retirer ni déplacer aucune mention.

### Phrases nouvelles E0 (non issues d'un étalon)

| Phrase | Source du fait |
|---|---|
| Préheader : « Le catalogue, les parcours et le reste sont ouverts. Voici par où commencer. » | Étalon 1 A (« ce qui vient de s'ouvrir ») et étalon 2 C (liste, « Pour commencer ») ; aucun nombre, aucun délai |

Les deux lignes de lien (« Ouvrir le carnet : {url}/carnet », « Choisir mon parcours : {url}/parcours ») reprennent les libellés d'étalon 3 A et de sa variante sans carnet ; routes `/carnet` et `/parcours` existent déjà dans le gabarit actuel (`/parcours`) et l'étalon 3 (`/carnet`).

---

## E1 : J5, « Une question ? » + par où commencer

**Envoi** : jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel (jeudi, numéro de la semaine parti en retard, rappel de parcours du jour) : glisse au premier jour libre. `replyTo` = `QUESTION_EQUIPE_DESTINATAIRE` (alex@deviens-marrant.fr, `config/question-equipe.ts:22`). Arrêt si résiliation programmée, rétractation, opposition, clic sur le lien d'arrêt.

**Choix de la version** (ordre de test) :
1. Parcours en cours (au moins une étape validée, parcours non terminé) et pas (carnet publié + rappel de parcours actif) : **version PARCOURS**.
2. Carnet publié : **version CARNET** (cas par défaut, y compris abonné avec rappel actif).
3. Sinon (pas de carnet, pas de parcours en cours) : **version OUVERTS**.

### Version CARNET (étalon 3 A, mot pour mot)
Objet : `Une situation, une réplique`
Préheader (70 car.) : `Une situation, sa réplique, et une porte ouverte si tu as une question.`
```
Salut {prénom},

Quelqu’un te balance une remarque devant tout le monde, et rien ne te vient. Le carnet part de ces moments-là : une situation, la réplique qui sauve la mise, pourquoi elle marche.

Une question, un doute ? Réponds à cet e-mail, on lit tout.

Ouvrir le carnet : {url}/carnet
```

### Version PARCOURS (variante de l'étalon 3 A : remplace la scène, la phrase du carnet et son lien)
Objet : `Ta prochaine étape t’attend`
Préheader (62 car.) : `Ta prochaine étape de parcours t’attend, là où tu t’es arrêté.`
```
Salut {prénom},

Ta prochaine étape de parcours t’attend, là où tu t’es arrêté.

Une question, un doute ? Réponds à cet e-mail, on lit tout.

Reprendre mon parcours : {lienEtape}
```

### Version OUVERTS (sans carnet publié, sans parcours en cours)
Objet : `Les parcours sont ouverts`
Préheader (56 car.) : `Les parcours sont ouverts, toutes les étapes d’un coup.`
```
Salut {prénom},

Les {N} parcours sont ouverts, toutes les étapes d’un coup : choisis le tien.

Une question, un doute ? Réponds à cet e-mail, on lit tout.

Choisir mon parcours : {url}/parcours
```

### Pied commun E1 (après la signature)
```
L’Équipe Deviens Marrant
deviens-marrant.fr

---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : {lienArret}
```
Prénom absent : « Salut, ». `{lienEtape}` = lien direct de la prochaine étape, construit comme `rappel-parcours.ts:215` (`{baseUrl}/parcours/{slug}`), avec un `?src=` propre à l'onboarding. En-têtes : `List-Unsubscribe` sur `{lienArret}`.

### Phrases nouvelles E1 (non issues d'un étalon)

| Phrase | Source du fait |
|---|---|
| Préheaders des trois versions (70, 62 et 56 car.) | Reprennent des phrases des étalons 3 A et de ses variantes ; aucun délai, aucun nombre en dur (`{N}` absent des préheaders) |
| « Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr. » | Cible unique du cadre @legal D1 (paiement confirmé), même mécanique que le pied du rappel de parcours (`parcours-emails.ts:75`) |
| « Arrêter ces e-mails d'accueil (un clic, sans connexion) : {lienArret} » | Libellé imposé par la mission et le cadre @legal D5 ; « un clic, sans connexion » calqué sur le rappel de parcours (`parcours-emails.ts:76`), à confirmer par @fullstack (jeton HMAC) |

Faits vérifiés dans le code : le carnet porte une situation, une réplique et un champ `pourquoi` (`lib/carnet.ts:40, 261`) ; `PARCOURS_COUNT` dynamique (`premium.ts:89`) ; « on lit tout » : la boîte alex@ reçoit « Ta question à l'équipe » (`question-equipe.ts`), la réponse à l'e-mail y arrive par `replyTo`.

---

## E2 : J21, « Trois semaines : qu'est-ce qui manque ? »

**Envoi** : mêmes règles que E1 (jour libre, `replyTo` alex@, arrêts). Si J21 est occupé, glisse au premier jour libre. Aucun lien d'action, aucun délai promis.
Objet (étalon 4 A) : `Trois semaines : qu’est-ce qui manque ?`
Préheader (66 car.) : `Ce qui t’a servi, ce qui manque : réponds à cet e-mail, on lit tout.`
```
Salut {prénom}, ça fait trois semaines que tu es là. Dis-nous ce qui t’a servi, ce qui t’a fait lever les yeux au ciel et ce qui manque. Réponds simplement à cet e-mail, on lit chaque réponse.

L’Équipe Deviens Marrant
deviens-marrant.fr

---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : {lienArret}
```
Prénom absent : « Salut, ça fait trois semaines que tu es là. … ».

| Phrase nouvelle | Source du fait |
|---|---|
| Préheader E2 | Reprend l'étalon 4 A, sans promesse nouvelle |
| Pied (« Tu reçois cet e-mail… », « Arrêter ces e-mails d'accueil… ») | Identique à E1 (mêmes sources) |

---

## Contrôles faits

- Zéro tiret cadratin, zéro émoji, aucun concurrent, aucune promotion ni prix ajouté (les prix et montants de E0 viennent de la confirmation existante), aucune urgence ; aucun chiffre en dur : `{N}` par constante.
- Promesses : lettre (jeudi, un clic) alignée sur `LETTRE_HEBDO_INFO_PAIEMENT.recoit` ; « Ta question à l'équipe » conditionnée à l'interrupteur ; rappel de parcours « sur demande depuis ton profil » déjà livré (s17).
- Objections traitées : « résilier pour ne pas oublier » (phrase 5 C), « qu'est-ce que j'ai acheté » (liste 2 C), « par où commencer » (Pour commencer, E1), « personne ne me répond » (replyTo alex@, E1/E2).
- Références marché : non consultées (ton calé sur `ton-alex.md` et les étalons validés).

## Points à trancher

1. Préheader et texte seul : un texte brut n'a pas de préheader masqué, le client affiche les premiers caractères du corps. À moins d'ajouter une partie HTML minimale, les préheaders ci-dessus ne s'afficheront pas tels quels (E0 aurait « Salut, voici ce qui vient de s'ouvrir… » en aperçu, ce qui est acceptable).
2. Objet « …Premium est ouvert, sers-toi » puis corps « Ton abonnement Premium est activé. Bienvenue… » sous la liste : redite légère, gardée car la ligne appartient au gabarit contractuel (« tout le bloc, mot pour mot »).
3. Pour @fullstack : `BIENVENUE_PREMIUM.lettre` (« s'active depuis ton profil », `abonnement-vente.ts:175`) est périmé depuis l'inscription d'office ; hors de ces textes.
