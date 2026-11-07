# Onboarding Premium s23 : textes finaux E0, E1, E2 (v2, 07/11/2026)

Statut : BROUILLON v2, avant nouvelle relecture à l'aveugle (barre 9/10), avis @legal final et approbation de Thomas. Rien n'est envoyé avant.
v2 = v1 + relectures `revues-onboarding/aveugle-reviewer-v1.md` (O1 à O3) et `aveugle-panel-v1.md` (P1 à P10) + décisions de Thomas du 07/11 (`founder-preferences.md`, non re-questionnables) + cadre `docs/legal/onboarding-e1-resilies-s23.md`.
Source des choix : `etalons-onboarding-s23.md` (1 A, 2 C, 3 A, 4 A, 5 C), repris mot pour mot, sauf ajustements listés au journal en fin de fichier.

[Framework : AIDA court pour E0 ; PAS inversé pour E1 (situation vécue, puis la porte ouverte) ; question ouverte pour E2.]
[Conscience : Product-Aware à Most-Aware (l'abonné vient de payer), E0 transactionnel.]

Conventions de rendu (toutes les variantes) :
- Texte seul, tutoiement, « on », zéro tiret cadratin, zéro émoji. Apostrophes typographiques ’ comme dans `paiement.ts`.
- Texte seul = **pas de préheader** : l'aperçu dans la boîte est « Salut {prénom}, » suivi de la première phrase du corps. Chaque première phrase ci-dessous est écrite pour tenir lieu d'aperçu et n'est jamais une redite de l'objet.
- `{prénom}` absent : « Salut, ». `{url}` = `siteUrl()`. `{N}` = `PARCOURS_COUNT` (`config/premium.ts:89`, dynamique). Signature = constante `SIGNATURE` (`paiement.ts:27`), « L’Équipe Deviens Marrant » inchangée (choix antérieur, pas de signature Alex) ; dans E1/E2, suivie de « deviens-marrant.fr ».
- Dans E0, les libellés « Pour commencer », « Dès maintenant », « Ensuite, à ton rythme » sont rendus sans astérisques.

---

## E0 : bienvenue (J0, transactionnel, part tout de suite, jeudi compris)

**Objet** (étalon 1 A) : `Ton abonnement est confirmé : Premium est ouvert, sers-toi`
Aperçu (texte seul) : « Salut {prénom}, voici ce qui vient de s’ouvrir, et par où commencer. »
Envoi : `replyTo` inchangé (e-mail de service). Pas de lien d'arrêt (transactionnel).

### Corps rendu

Blocs `[si …]` rendus seulement si la condition est vraie ; prénom absent : « Salut, voici ce qui vient de s’ouvrir, et par où commencer. »

```
Salut {prénom}, voici ce qui vient de s’ouvrir, et par où commencer.

Pour commencer : [si carnet] une fiche du carnet du mois, une situation et sa réplique.
[si carnet] Ouvrir le carnet : {url}/carnet
[sinon] la première étape d’un parcours, au choix parmi les {N}.
[sinon] Choisir mon parcours : {url}/parcours

Dès maintenant : le catalogue sans limite, les exercices des fiches, tes favoris, ta progression et ta série.[si état recoit] La lettre de la semaine arrive chaque jeudi, incluse dans ton abonnement ; tu l’arrêtes en un clic, depuis chaque lettre ou ton profil.

Ensuite, à ton rythme : les {N} parcours en entier[si carnet], les carnets passés[si question] et « Ta question à l’équipe » depuis ton profil. Toutes les étapes sont ouvertes ; on conseille une étape par semaine, avec un rappel par e-mail si tu l’actives dans ton profil.

Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance.

Voici ta confirmation :
- Formule : Premium {annuel|mensuel}
- Prix : {prix}
- Souscrit le : {dateLongue(souscription)}
- Prochain prélèvement : {dateLongue(prochain)}, {montant} TTC. L’abonnement se reconduit automatiquement à cette date, jusqu’à ce que tu le résilies.
[si annuel] Avec l’annuel, tu as {ANNUEL_MOIS_OFFERTS_LABEL} : {économie} économisés par rapport au mensuel.

Résilier : en ligne, à tout moment, depuis ton profil, bouton « Résilier ton contrat » : {url}/profil. Ton accès reste ouvert jusqu’à la fin de la période payée.
[si mensuel] Prends ton temps pour te faire un avis : d’ici le {dateLongue(prochain)}, tout est ouvert, et tu pourras encore résilier la veille.

Droit de rétractation : tu as 14 jours à partir d’aujourd’hui, soit au moins jusqu’au {dateLongue(finRetractation)}, pour te rétracter sans donner de motif. On te rembourse alors l’intégralité de ce que tu as payé (mensuel comme annuel), sous 14 jours maximum après ta demande. Il suffit de remplir ce formulaire : {url}/retractation.

Les CGU qui s’appliquent à ton abonnement : {url}/cgu.

À très vite,
L’Équipe Deviens Marrant

============================================
{formulaireTypeRetractation(), inchangé}
```

Règle du « et » de « Ensuite » (le dernier élément rendu prend « et ») ; la 2e phrase (« Toutes les étapes… ») est toujours rendue :
- carnet + question : `…en entier, les carnets passés et « Ta question à l’équipe » depuis ton profil.`
- carnet seul : `…en entier et les carnets passés.`
- question seule : `…en entier et « Ta question à l’équipe » depuis ton profil.`
- ni l'un ni l'autre : `…en entier.`

Conditions de rendu (code) :
- `[si carnet]` : carnet du mois publié (même condition que la ligne `carnet` de `lignesTableau`). Sans carnet, « Pour commencer » bascule sur le parcours.
- `[si état recoit]` : état `recoit` seulement (`LETTRE_HEBDO_INFO_PAIEMENT`) ; sinon la phrase lettre disparaît, le point qui précède reste.
- `[si question]` : `QUESTION_EQUIPE_OUVERTE` (`config/question-equipe.ts:11`).
- **`[si mensuel]` (phrase 5 C) : formule mensuelle seulement.** En annuel, aucune phrase de remplacement : « Résilier » et « Droit de rétractation » du bloc contractuel suffisent, et le rappel avant renouvellement annuel existe (cadre @legal `onboarding-e1-resilies-s23.md`, partie b : en annuel, la phrase encouragerait à attendre alors que seuls les 14 jours remboursent). Aucun mot de la phrase ne change.
- **Aucun e-mail de rappel avant prélèvement** (décision Thomas 07/11) : la phrase 5 C reste telle quelle pour le mensuel, aucune annonce de rappel.
- Retiré du gabarit actuel : « Tout est ouvert. Pour démarrer, choisis un parcours : {url}/parcours. ». Le reste du bloc contractuel est inchangé mot pour mot (`paiement.ts` l. 279 à 291 et 295 à 299), « Ton abonnement Premium est activé… » placé sous la liste.

### Phrases nouvelles ou modifiées E0

| Phrase | Source du fait |
|---|---|
| « Dès maintenant : » (remplace « Cette semaine : ») | Panel P3 : lu comme une offre qui expire ; décision d'application par Thomas (brief v2) |
| « Ensuite… » en deux phrases, « si tu l’actives dans ton profil » | Panel P4, contenu identique ; rappel de parcours activable depuis le profil (`rappel-parcours.ts`, `lienChangerJour` = `/profil#rappel-parcours`, origine d'arrêt `profil`) |
| Libellés « Ouvrir le carnet », « Choisir mon parcours » | Étalon 3 A et variante ; routes `/carnet`, `/parcours` existantes |

---

## E1 : J5, « Une question ? » + par où commencer

**Envoi** : `replyTo` = `QUESTION_EQUIPE_DESTINATAIRE` (alex@deviens-marrant.fr, `config/question-equipe.ts:22`). Jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel (jeudi, numéro de la semaine parti en retard, rappel de parcours du jour), et pas la semaine où son rappel de parcours est parti : glisse au premier jour libre.

**Qui le reçoit** (décision Thomas 07/11 + cadre @legal) : tout abonné payant dont l'accès est ouvert, **y compris en résiliation programmée tant que l'accès payé court**. Pour ces derniers, un seul envoi (E1), **E2 reste arrêté**.
Arrêt immédiat, avant l'envoi même programmé : rétractation exercée, remboursement, paiement échoué, suppression du compte, clic sur le lien d'arrêt, opposition reçue (une réponse « arrêtez » à alex@ vaut opposition, traitée sous un jour ouvré, reportée dans la base). Fin d'accès échue : aucun envoi. Abonné qui reprend son abonnement : régime normal.
Conditions @legal pour les résiliés (C1 à C8) : pas de pixel ni de suivi de clic (`?src=` sans identifiant), journal par envoi (compte, numéro d'e-mail, date, cas d'arrêt), le motif de résiliation n'est jamais utilisé pour choisir ou personnaliser, phrase d'information à la collecte (C8) confirmée présente dans la confidentialité **avant** l'ouverture aux résiliés. Contenu, objet et version identiques pour tous : seule la phrase de tête ci-dessous s'ajoute.

**Phrase de tête (résiliation programmée uniquement)**, exacte, juste après « Salut {prénom}, » (ou « Salut, »), avant tout le reste du corps, sans autre appel, sans mention de résiliation, sans lien « rester », sans prix, sans urgence :
`Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.`
`{finAcces}` = fin de la période payée [à brancher par @fullstack ; même fait que la phrase « Ton accès reste ouvert jusqu’à la fin de la période payée » de E0]. L'aperçu devient « Salut {prénom}, Ton accès reste ouvert jusqu’au… », neutre.

**Choix de la version** (ordre de test, identique pour tous) :
1. Parcours en cours (au moins une étape validée, parcours non terminé, même règle que `rappel-parcours.ts:180-186`) et pas (carnet du mois publié + rappel de parcours actif) : **PARCOURS**.
2. Carnet du mois publié : **CARNET** (défaut, y compris abonné avec rappel actif).
3. Sinon : **OUVERTS**.

### Version CARNET (étalon 3 A + réplique du carnet, choix Thomas 07/11)
Objet (étalon 3 A, inchangé) : `Une situation, une réplique`
```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.

Quelqu’un te balance une remarque devant tout le monde, et rien ne te vient. Le carnet part de ces moments-là : une situation, la réplique qui sauve la mise, pourquoi elle marche.

Celle de ce mois-ci :
{situation}
On te dit : « {onTeDit} »
Ta réplique : « {reponse} »
Pourquoi elle marche : {pourquoi}

Une question, un doute ? Réponds à cet e-mail, on lit tout.

Ouvrir le carnet : {url}/carnet
```
**Fiche prise, règle déterministe** : `ficheOfferte(carnet)` (`lib/carnet.ts:101`) du carnet du mois en cours à Paris (`getCarnetExtrait`, `carnet.ts:237`, null si le carnet du mois n'est pas déposé) : la fiche marquée `offerte`, sinon `fiches[0]`. C'est la fiche lisible sans compte, la même que sur /abonnement et dans l'encart des articles : aucune vanne écrite pour l'e-mail, aucune fiche réservée divulguée. Champs (`carnet.ts:33-42`) : `situation`, `onTeDit` (ce qu'on te lance), `reponse` (la réplique), `pourquoi`. Sans carnet du mois en cours déposé : bascule PARCOURS ou OUVERTS, jamais le carnet d'un mois passé présenté comme « de ce mois-ci ». Même fiche pour tous, résiliés compris.

### Version PARCOURS (variante de l'étalon 3 A)
Objet (reviewer O3) : `Une question sur ton parcours ?`
```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.

Dans ton parcours « {parcoursTitre} », l’étape {etapeNumero} est ouverte : {etapeTitre}. Tu reprends là où tu en étais.

Une question, un doute ? Réponds à cet e-mail, on lit tout.

Reprendre mon parcours : {lienEtape}
```
Donnée vérifiée : `rappel-parcours.ts:200-215` calcule déjà `parcoursTitre` (`learningPath.title`), `etapeNumero` (première étape non validée), `etapeTitre` (`titreEtape`, repli `Étape {n}`) et `lienEtape` (`{baseUrl}/parcours/{slug}?src=…`). Parcours choisi si plusieurs en cours : le premier, comme le rappel. **Repli** si `etapeTitre` est le repli « Étape {n} » : on omet « : {etapeTitre} » (« …l’étape {etapeNumero} est ouverte. »). `titreEtape` n'est pas exportée aujourd'hui : [à vérifier @fullstack, l'exporter ou la dupliquer]. Si le titre du parcours manquait : « Ton parcours est ouvert à l’étape suivante, là où tu en étais. » (repli du panel). `?src=` propre à l'onboarding.

### Version OUVERTS (sans carnet du mois, sans parcours en cours)
Objet : `Les parcours sont ouverts`
```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.

Les {N} parcours sont ouverts, toutes les étapes comprises : choisis le tien.

Une question, un doute ? Réponds à cet e-mail, on lit tout.

Choisir mon parcours : {url}/parcours
```

### Pied commun E1 (après la signature, identique pour tous)
```
L’Équipe Deviens Marrant
deviens-marrant.fr

---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : {lienArret}
```
`List-Unsubscribe` sur `{lienArret}`. Prénom absent : « Salut, ».

### Phrases nouvelles ou modifiées E1

| Phrase | Source du fait |
|---|---|
| Bloc « Celle de ce mois-ci : … Pourquoi elle marche : … » | Décision Thomas 07/11 (P5) ; champs `carnet.ts:33-42` ; libellés « On te dit » et « Ta réplique » = `onTeDit` et `reponse` |
| Phrase de tête résiliés | Texte exact imposé par @legal (`onboarding-e1-resilies-s23.md`) |
| « Dans ton parcours « … », l’étape … est ouverte… Tu reprends là où tu en étais. » | Panel P6, objet O3 ; données `rappel-parcours.ts` |
| « toutes les étapes comprises » (OUVERTS) | Panel P7, partie texte seule ; fait : étapes toutes ouvertes (`parcours-detail.tsx:513`) |
| Pied d'arrêt | Cible unique @legal D1, calqué sur `parcours-emails.ts:75-76` (« un clic, sans connexion » à confirmer par @fullstack, jeton HMAC) |

---

## E2 : J21, « Trois semaines : qu'est-ce qui manque ? »

**Envoi** : mêmes règles que E1 (jour libre, `replyTo` alex@, arrêts). **Non envoyé aux abonnés en résiliation programmée** (décision Thomas / cadre @legal C2). Aucun lien d'action, aucun délai promis.
Objet (étalon 4 A) : `Trois semaines : qu’est-ce qui manque ?`
Aperçu (texte seul) : « Salut {prénom}, ça fait trois semaines que tu es là. »
```
Salut {prénom}, ça fait trois semaines que tu es là. Dis-nous ce qui t’a servi, ce qui t’a fait lever les yeux au ciel et ce qui manque. Réponds simplement à cet e-mail, on lit chaque réponse.

L’Équipe Deviens Marrant
deviens-marrant.fr

---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : {lienArret}
```
Prénom absent : « Salut, ça fait trois semaines que tu es là. … ». Texte étalon 4 A inchangé.

---

## Contrôles faits

- Zéro tiret cadratin, zéro émoji, aucun concurrent, aucun prix ni promotion ajoutés, aucune urgence ; `{N}` par constante.
- Promesses : lettre (jeudi, un clic) alignée sur `LETTRE_HEBDO_INFO_PAIEMENT.recoit` ; « Ta question à l'équipe » conditionnée à l'interrupteur ; rappel de parcours activable depuis le profil, livré s17. Aucune promesse de rappel avant prélèvement.
- Objections : « résilier pour ne pas oublier » (phrase 5 C pour le mensuel, décision Thomas ; le panel jugeait ce point non résolu sans rappel : assumé), « qu'est-ce que j'ai acheté » (liste), « par où commencer » (Pour commencer, E1 avec vraie fiche), « personne ne me répond » (replyTo alex@).
- Références marché : non consultées (ton calé sur `ton-alex.md` et les étalons).

## Points à trancher

1. **Étalons à soumettre à Thomas** (non appliqués, voir journal) : P8 (E2, ajout pour l'inactif), reviewer S1 (lettre du mois, jeudi, E0), P2.
2. **@legal** : confirmation de C8 (confidentialité) avant l'ouverture aux résiliés ; reviewer S5 (annoncer les deux e-mails d'accueil dans E0) non appliqué, le cadre D1 et C8 s'en chargent.
3. **@fullstack** : `finAcces`, `titreEtape` exportée, règle « pas la semaine du rappel », `BIENVENUE_PREMIUM.lettre` périmé (`abonnement-vente.ts:175`, invisible tant que `LETTRE_HEBDO_PROMESSE` est faux).

---

## Journal v1 → v2

| # | Changement | Source |
|---|---|---|
| 1 | Phrase 5 C rendue `[si mensuel]` seulement, aucune phrase en annuel | Reviewer O1 ; @legal (b) |
| 2 | Préheaders supprimés partout, remplacés par la règle « aperçu = début du corps » ; première ligne de chaque corps vérifiée comme aperçu | Reviewer O2 |
| 3 | Objet E1 PARCOURS : « Une question sur ton parcours ? » (remplace « Ta prochaine étape t’attend ») | Reviewer O3 |
| 4 | E1 CARNET : fiche du mois (situation, on te dit, réplique, pourquoi) dans l'e-mail ; règle `ficheOfferte` du carnet du mois en cours | Thomas 07/11 ; panel P5 |
| 5 | E1 part aussi en résiliation programmée avec la phrase de tête exacte ; E2 arrêté pour eux ; conditions d'arrêt et C1 à C8 | Thomas 07/11 ; panel P10 ; @legal |
| 6 | « là où tu t’es arrêté » remplacé par « là où tu en étais » ; parcours, étape et titre nommés (repli prévu) | Panel P6 ; `rappel-parcours.ts` |
| 7 | « Cette semaine » devient « Dès maintenant » | Panel P3, demande Thomas/brief |
| 8 | Bloc « Ensuite » coupé en deux phrases, même contenu | Panel P4 ; reviewer S4 |
| 9 | OUVERTS : « d'un coup » devient « comprises » | Panel P7 (partie texte) |
| 10 | Règle d'envoi E1 : pas la semaine où le rappel de parcours est parti | Reviewer S3 |
| 11 | Objet E1 CARNET gardé « Une situation, une réplique » | Panel P5 proposait « Quand on te balance une remarque devant tout le monde » : l'objet fait partie de l'étalon 3 A tranché par Thomas ; et il est désormais exact, l'e-mail contenant une situation et une réplique. Proposition soumise à Thomas si souhaitée |
| 12 | Non appliqués : P1 A/B (refus Thomas, pas de rappel) ; P9 (signature, choix antérieur) ; P2 (phrase de l'étalon 2 C, mot pour mot) ; P8 et S1 (modifient une phrase d'étalon 4 A / 5 C-adjacente, décision Thomas) ; P7 liste par parcours (descriptions et variables non vérifiées dans le code) ; objet P7 (promet une aide au choix que le corps ne donne pas) ; S2 (la scène du carnet citerait un carnet absent en OUVERTS) ; S5 (traité par @legal C8) | Raisons ci-contre |
