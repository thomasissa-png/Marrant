# Onboarding Premium s23 : textes finaux E0, E1, E2 (v4.1, 07/11/2026)

Statut : BROUILLON v4.1 (corrige la v4 après les relectures à l'aveugle reviewer 8,5 et panel 7,3 à 8,2), à repasser en relecture à l'aveugle (barre 9/10, règle P0 s18), avis @legal final et approbation de Thomas. Rien n'est envoyé avant.
v4 = refonte demandée par Thomas le 07/11 (rejet de la v3.1 : « Le bienvenue est archi nul… Généraliste. Là, c'est ultra ciblé… On fait que ça en fait sur le site ?? »). Décision consignée dans `docs/founder-preferences.md` (07/11) : elle REMPLACE les étalons 2 C et 3 A et la fiche du carnet dans les e-mails. Restent valables : objet 1 A, E2 (4 A) inchangé, phrase 5 C (mensuel seulement), bloc contractuel mot pour mot, E1 aussi aux résiliés programmés (phrase de tête @legal, `docs/legal/onboarding-e1-resilies-s23.md`), signature, ton `docs/copy/ton-alex.md`.

[Framework : liste de bénéfices puis un pas (AIDA court) pour E0 ; porte ouverte puis invitation à répondre pour E1 ; question ouverte pour E2.]
[Conscience : Most-Aware pour E0 (l'abonné vient de payer, transactionnel) ; Product-Aware pour E1 (il a payé, il a peut-être à peine regardé).]

Conventions de rendu :
- Texte seul, tutoiement, « on », zéro tiret cadratin, zéro émoji. Apostrophes typographiques ’ comme dans `paiement.ts`. Les puces sont des tirets simples « - ».
- Pas de préheader : l'aperçu = « Salut {prénom}, » + première phrase du corps. `{prénom}` absent : « Salut, ».
- `{url}` = `siteUrl()`. `{N}` = `PARCOURS_COUNT` (`config/premium.ts:89`). `{listeParcours}` = noms seuls de `PREMIUM_PARCOURS` (`name`, sans le rythme `timePerWeek`, pour tenir sur mobile), virgules, dernier par « et » (`premium.ts:76-86`). Signature = `SIGNATURE` (`paiement.ts:27`) ; dans E1/E2 suivie de « deviens-marrant.fr ». Aucun chiffre en dur.

---

## E0 : bienvenue (J0, transactionnel, part tout de suite, jeudi compris)

**Objet** (étalon 1 A, inchangé) : `Ton abonnement est confirmé : Premium est ouvert, sers-toi`
Envoi : `replyTo` inchangé (e-mail de service). Pas de lien d'arrêt (transactionnel).

### Corps rendu

Blocs `[si …]` rendus seulement si la condition est vraie.

```
Salut {prénom}, voici tout ce que Premium t’ouvre, et par où commencer.

- Les vannes, les conseils et les vidéos : tout, sans limite, et les filtres pour trouver vite ce qui colle à ta situation.
- Les parcours : les {N}, en entier, de la première à la dernière étape.
[si carnet] - Le carnet de répartie : chaque mois, des situations et leurs répliques, carnets passés compris.
- Les exercices des vannes, conseils et vidéos : de quoi t’entraîner, pas seulement lire.
- Tes favoris, ta progression et ta série de jours de pratique : ce qui te plaît sous la main, et où tu en es.
[si état recoit] - La lettre du jeudi : chaque semaine par e-mail, un clic pour l’arrêter.
[si question] - « Ta question à l’équipe » : écris-nous depuis ton profil, on te répond.
- Le rappel de parcours : un e-mail pour ne pas perdre le fil, à activer depuis ton profil.

Par où commencer : la première étape d’un parcours, au choix parmi {listeParcours}. {url}/parcours

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

Longueur : 8 puces maximum (5 sans carnet, lettre ni question), chacune sur 2 à 3 lignes à 375 px ; avec « Par où commencer » (noms de parcours seuls) et la formule de bienvenue, l'objectif est environ un écran avant le bloc contractuel. [À vérifier au rendu réel iOS/Android à 375 px : estimation, non mesurée.]

### Conditions de rendu et vérifications dans le code

| Ligne | Condition | Source du fait |
|---|---|---|
| Vannes, conseils, vidéos : « tout, sans limite » (ligne fusionnée) | toujours | Gratuit limité à `FREE_CATALOGUE_LIMITS_LABEL` (`premium.ts:110-115`) ; `/api/jokes` : `isPremium` lève la limite ; tableau « Tout le catalogue : Sans limite » (`abonnement-vente.ts:124`) |
| « avec des filtres » | toujours | Filtres rendus par `conseils-list.tsx`, `videos-grid.tsx` ; vannes : « avec Premium, par les filtres » (`vannes/page.tsx:59`) |
| Parcours « les {N} en entier » | toujours | `PARCOURS_COUNT` ; tableau `abonnement-vente.ts:125` |
| Carnet + « mois passés » | `[si carnet]` : `getCarnetExtrait` non null | Tableau : « Toutes, carnets passés compris » (`abonnement-vente.ts:127`) ; ligne présente seulement si un carnet existe, comme le tableau |
| Exercices sur chaque vanne, conseil et vidéo (C2 appliquée) | toujours | Trois types d'exercice : `exercice-vanne`, `exercice-conseil`, `exercice-video` (`lib/abonnement-accroche.ts:23-25`) ; tableau `abonnement-vente.ts:130` |
| Favoris, progression, série de jours de pratique (ligne fusionnée) | toujours | Tableau `abonnement-vente.ts:131-132` (Gratuit : Non) ; série : `lib/progression.ts` (cité par le panel, non rouvert) |
| Lettre du jeudi | `[si état recoit]` (`LETTRE_HEBDO_INFO_PAIEMENT`) | `recoit` = « Premium sans arrêt explicite ni opposition » (`config/textes/lettre-hebdo-s21.ts:37`) : il la reçoit déjà, donc « si tu la veux » est retiré (C4 vérifiée) |
| Ta question à l’équipe | `[si question]` : `QUESTION_EQUIPE_OUVERTE` (`config/question-equipe.ts:11`) | Encadré du profil Premium, envoi par e-mail à l'équipe |
| Rappel de parcours | toujours | `profil/rappel-parcours-toggle.tsx`, `/profil#rappel-parcours` ; activable par l'abonné |

- Aucun autre avantage Premium réel dans le code : le quiz (« Quiz et vanne du jour ») est Gratuit et Premium (`abonnement-vente.ts:133`), le glossaire est public ; ils ne sont donc pas listés en E0 (« ce que Premium t’ouvre »), mais cités en E1 (sans mention gratuit ou payant, C7).
- « on te répond » (ligne question d'E0) : si l'équipe ne veut pas porter cet engagement, revenir à « on lit tout » (repli proposé par le reviewer) ; E1 garde « on lit tout ».
- Abonné en état « arretee » (lettre non reçue) : aucune ligne lettre en E0 ; une ligne « à activer depuis ton profil » reste à trancher par Thomas.
- « Par où commencer » : parcours (valeur centrale de l'offre, destination par défaut après paiement `PREMIUM_DEFAULT_RETURN = /parcours`, `premium.ts:118`), neutre, pas de fiche. `{listeParcours}` vient de `PREMIUM_PARCOURS`, jamais écrit en dur.
- **`[si mensuel]` (phrase 5 C) : formule mensuelle seulement.** En annuel, aucune phrase de remplacement. Aucun mot du bloc contractuel ne change (`paiement.ts` l. 279 à 291 et 295 à 299). Retiré du gabarit : « Tout est ouvert. Pour démarrer, choisis un parcours : {url}/parcours. ».
- **Aucun e-mail de rappel avant prélèvement** (décision Thomas 07/11).

---

## E1 : J5, « Une question ? » + ce qu'on fait sur le site

**Envoi** : `replyTo` = `QUESTION_EQUIPE_DESTINATAIRE` (alex@deviens-marrant.fr, `config/question-equipe.ts:22`). Jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel (jeudi, numéro de la semaine parti en retard, rappel de parcours du jour), ni la veille ou le lendemain d'un rappel de parcours : glisse au premier jour libre. Si aucun jour libre sous 7 jours, l'e-mail n'est pas envoyé (journalisé).

**Qui le reçoit** (décision Thomas 07/11 + cadre @legal) : tout abonné payant dont l'accès est ouvert, **y compris en résiliation programmée tant que l'accès payé court**. Pour ces derniers, un seul envoi (E1), **E2 reste arrêté**.
Arrêt immédiat, même programmé : rétractation exercée, remboursement, paiement échoué, suppression du compte, clic sur le lien d'arrêt, opposition reçue (une réponse « arrêtez » à alex@ vaut opposition, traitée sous un jour ouvré). Fin d'accès échue : aucun envoi. Abonné qui reprend son abonnement : régime normal.
Conditions @legal C1 à C8 : pas de pixel ni de suivi de clic (`?src=` sans identifiant), journal par envoi, le motif de résiliation jamais utilisé, phrase d'information à la collecte (C8) présente dans la confidentialité **avant** l'ouverture aux résiliés. Contenu, objet et version identiques pour tous : seule la phrase de tête s'ajoute.

**Phrase de tête (résiliation programmée uniquement)**, texte légal exact, juste après « Salut {prénom}, », avant tout le reste, sans autre appel, sans mention de résiliation, sans lien « rester », sans prix, sans urgence :
`Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.`
Dans la version PARCOURS (variante validée @legal le 07/11) : `Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici où tu en es.` `{finAcces}` = fin de la période payée [à brancher par @fullstack].

**Choix de la version** : PARCOURS si au moins une étape validée et parcours non terminé (même règle que `rappel-parcours.ts:180-186`) ; sinon GÉNÉRALE (défaut). Un seul objet pour les deux.

**Objet** : `Une question ? Voilà ce qu’on fait ici`

### Version GÉNÉRALE (défaut)
```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.

Une question, un doute, un truc qui manque ? Réponds à cet e-mail, on lit tout. Et pour t’y retrouver, voici tout ce qui t’attend sur le site :
- Vannes : des blagues rangées par situation, à ressortir au bon moment.
- Conseils : des techniques de répartie et d’humour, avec un défi à tester.
- Vidéos : du stand-up français décortiqué, pour voir ce qui fait rire.
- Parcours : {N} au choix, une étape par semaine, pour progresser pas à pas.
[si carnet] - Carnet : chaque mois, des situations et leurs répliques.
- Glossaire : le dico de l’humour (punchline, timing, callback…).
- Quiz : « Quel type d’humour es-tu ? », pour savoir d’où tu pars.

Et dans ton profil : tes favoris, ta progression et le rappel de parcours, à activer si tu veux un e-mail pour ne pas perdre le fil.

Pour commencer par un parcours : {url}/parcours?src=onboarding-premium
```

### Version PARCOURS (abonné avec un parcours en cours)
Même corps que la version GÉNÉRALE (même liste, même ligne profil), avec la ligne d'étape placée juste après la phrase de tête (obligatoire O2 du reviewer : jamais entre le deux-points et la première puce) et le lien principal remplacé :
```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici où tu en es.

Ta prochaine étape dans « {parcoursTitre} » : {etapeTitre} (étape {etapeNumero} sur {weeks}).

Une question, un doute, un truc qui manque ? Réponds à cet e-mail, on lit tout. Et pour t’y retrouver, voici tout ce qui t’attend sur le site :
[liste identique, ligne profil comprise]

Reprendre mon parcours : {lienEtape}
```
Le libellé de la ligne d'étape suit le panel (C11 : un seul deux-points) ; la place suit le reviewer. Replis : sans titre d’étape (repli « Étape {n} »), « Ta prochaine étape dans « {parcoursTitre} » : étape {etapeNumero} sur {weeks}. » ; parcours absent de `PREMIUM_PARCOURS`, sans « sur {weeks} » ; sans titre de parcours, la ligne est supprimée et le lien reste `{url}/parcours`. Données : `rappel-parcours.ts:200-215` (`parcoursTitre`, `etapeNumero`, `etapeTitre`, `lienEtape`) ; `weeks` dans `premium.ts:76-86`. `titreEtape` n'est pas exportée [@fullstack].

**Lien principal : `/parcours`** (justification : c'est la valeur centrale de l'offre, la promesse « un parcours structuré », et le lien le plus utile à quelqu'un qui n'a pas encore commencé ; le carnet, le quiz ou le glossaire restent cités sans lien pour ne pas disperser). Chez qui a un parcours en cours, le lien le plus utile est sa prochaine étape.

**Vérification des lignes** : vannes (`/vannes`, rangées par contexte, `vannes/page.tsx:59,69`), conseils (« un exemple, un dialogue et un défi à tester », `conseils/page.tsx:98`), vidéos (« décortiquées technique par technique », `videos/page.tsx:94`), parcours (`PARCOURS_COUNT`, une étape par semaine = `weeks`, `premium.ts:68`), carnet (`[si carnet]`, même garde qu'en E0), glossaire (`glossaire/page.tsx:28`), quiz (`quiz-humour/page.tsx:18`), ligne profil (favoris, progression, rappel activable : mêmes sources qu'E0). E1 n'affirme rien sur gratuit ou payant (C7). Aucune promesse hors code.

**`?src=onboarding-premium`** : `PARCOURS_SRC` est une liste fermée (`lib/parcours-tracking.ts:6-33`), toute valeur inconnue devient `direct` : la valeur est à ajouter [@fullstack, avis @legal s17]. Sans identifiant (C6). Pour la version PARCOURS, remplacer `src=rappel` de `lienEtape` par `src=onboarding-premium`.

### Pied commun E1 (après la signature)
```
L’Équipe Deviens Marrant
deviens-marrant.fr

---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : {lienArret}
```
`List-Unsubscribe` sur `{lienArret}`.

---

## E2 : J21, « Trois semaines : qu'est-ce qui manque ? » (inchangé)

**Envoi** : mêmes règles que E1 (jour libre, `replyTo` alex@, arrêts). **Non envoyé aux abonnés en résiliation programmée** (cadre @legal C2). Aucun lien d'action, aucun délai promis.
Objet (étalon 4 A) : `Trois semaines : qu’est-ce qui manque ?`
```
Salut {prénom}, ça fait trois semaines que tu es là. Dis-nous ce qui t’a servi, ce qui t’a fait lever les yeux au ciel et ce qui manque. Réponds simplement à cet e-mail, on lit chaque réponse.

Une ligne suffit, même pour dire que tu n’as pas encore eu le temps.

L’Équipe Deviens Marrant
deviens-marrant.fr

---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : {lienArret}
```

---

## Contrôles faits

- Zéro tiret cadratin, zéro émoji, aucun concurrent, aucun prix ajouté, aucune urgence ; `{N}` et `{listeParcours}` par constantes ; aucune fiche, aucun chiffre de fiches.
- Objections : « qu'est-ce que j'ai acheté » (liste complète d'E0), « par où commencer » (une ligne neutre), « personne ne me répond » (replyTo alex@, invitation à répondre), « résilier pour ne pas oublier » (phrase 5 C mensuel, décision Thomas).
- Références marché : non consultées (ton calé sur `ton-alex.md`).

## Points à trancher

1. **@legal** : (a) rien de nouveau sur E0 (bloc contractuel inchangé) ; (b) E1 est généraliste, sans fiche réservée : le point « fiche envoyée aux résiliés » de la v3.1 tombe ; (c) C8 avant ouverture aux résiliés.
2. **@fullstack** : `finAcces`, `[si carnet]`, `[si état recoit]`, `[si question]`, `src=onboarding-premium` dans `PARCOURS_SRC`, `titreEtape` exportée, règle de glissement et journal. Retrait du code E0 de la fiche (`ficheOfferte`, `nbAutres`) et de la version CARNET d'E1. `BIENVENUE_PREMIUM.lettre` périmé (`abonnement-vente.ts:175`).
3. **Revue à l'aveugle** : longueur mobile d'E0 ; ton des descriptions de la liste.

---

## Journal v4 → v4.1 (07/11, après relectures à l'aveugle v4)

| Changement | Source | Statut |
|---|---|---|
| E0 : liste de 11 à 8 puces maximum (ligne « Ce qui est à toi dès maintenant » retirée, la phrase de tête sert d'en-tête) | Reviewer O1 | Appliqué (texte du reviewer, sauf mots ci-dessous) |
| E0 : « tout le catalogue » devient « tout » ; « filtres » et « sans limite » une seule fois | Panel C1 | Appliqué (mots) |
| E0 : « exercices des fiches » devient « exercices sur chaque vanne, conseil et vidéo » | Panel C2 | Appliqué après vérification : 3 types d'exercice (`abonnement-accroche.ts:23-25`). Remplace la tournure « sur les fiches des vannes, conseils et vidéos » du reviewer (même sens, sans le mot interne) |
| E0 : « ta série de jours de pratique » | Panel C3 | Appliqué |
| E0 : « si tu la veux » retiré de la lettre | Panel C4 | Appliqué après vérification : `recoit` = déjà reçue (`lettre-hebdo-s21.ts:37`) |
| E0 : virgule du carnet | Panel C5 | Appliqué (via O1) |
| E0 : `{listeParcours}` sans les rythmes | Reviewer souhaitable | Appliqué |
| E1 PARCOURS : ligne d'étape juste après la phrase de tête, avant l'invitation | Reviewer O2, panel C10 | Appliqué |
| E1 PARCOURS : « Ta prochaine étape dans « {parcoursTitre} » : {etapeTitre} (étape {n} sur {weeks}). » | Panel C11 (mots) | Appliqué à la place de la ligne du reviewer, pour un seul deux-points |
| E1 : ligne « Et dans ton profil : favoris, progression, rappel de parcours » | Panel C6 | Appliqué (sources identiques à E0) |
| E1 : « en accès libre » retiré ; quiz « pour savoir d’où tu pars » | Panel C7, reviewer souhaitable | Appliqué : le cadre `onboarding-e1-resilies-s23.md` n'interdit rien ici (ni prix, offre, mention de résiliation ajoutés) et E1 n'affirme plus rien sur gratuit ou payant. À confirmer @legal à la relecture finale |
| E1 : « {N} au choix » ; « pour t’y retrouver, voici tout ce qui t’attend » | Panel C8, C9 | Appliqué |
| Phrase de tête résiliés (« voici par où commencer ») | Panel C12 | NON appliqué : texte légal figé mot pour mot, décision @legal requise |
| Déplacer « Ton abonnement Premium est activé… » | Panel (non retenu) | Non appliqué : bloc contractuel fixe |
| Inchangés | Consigne | Objet E0 (1 A), bloc contractuel, phrase 5 C mensuel, E2, phrases de tête @legal, signature |

Reste ouvert : mesure du rendu mobile d'E0 (estimation, non mesurée), « on te répond » (engagement à valider), ligne lettre pour l'état « arretee » (Thomas), relecture à l'aveugle v4.1 (aucune note v4.1 revendiquée ici).

---

## Journal v3.1 → v4 (07/11, après le rejet de Thomas)

| Changement | Source |
|---|---|
| E0 : fiche du carnet, « Pour commencer », « Cette semaine », « Ensuite », `ficheOfferte`, `nbAutres` supprimés ; remplacés par une liste généraliste de tout ce que Premium ouvre (une ligne chacune) | Thomas 06/11 et 07/11 ; `founder-preferences.md` (remplace étalons 2 C et 3 A) |
| E0 : une ligne « Par où commencer » (parcours, neutre) | Idem ; `premium.ts:118` |
| E0 : bloc contractuel, objet 1 A, phrase 5 C inchangés | Étalons 1 A, 5 C ; @legal |
| E1 : versions CARNET et OUVERTS supprimées ; version GÉNÉRALE (portes d'entrée en une ligne chacune, invitation à répondre, un lien `/parcours`) ; PARCOURS conservée mais généraliste (ligne de prochaine étape + même liste) | Thomas 07/11 (« pour présenter ce qu'on fait, s'ils ont des questions ») |
| E1 : objet « Une question ? Voilà ce qu’on fait ici » (l'étalon 3 A est remplacé) | Décision 07/11 |
| E1 : règle de fiche, `{nbAutres}`, « À toi de jouer » retirés | Idem |
| E1 : phrase de tête @legal et variante PARCOURS inchangées ; E2 inchangé | `onboarding-e1-resilies-s23.md` ; étalon 4 A |
| Journaux v1 → v2 et v2 → v3 retirés (obsolètes, historique git) | Conservation of rules |
| E0 : « Les exercices des vannes, conseils et vidéos » au lieu de « sur chaque » (fait faux) | Relecteur, contrôle v4.1 | `question-equipe-s22.ts:48` pour « on te répond » ; exercices selon décryptage |

---

## E1b : J12, pose-nous ta question (proposition, à approuver)

Statut : PROPOSITION, à approuver par Thomas (demande du 08/11 : « je valide mais manque un email genre pose nous une question »). E0, E1, E2 ci-dessus ne sont pas modifiés. Passer en relecture à l'aveugle (barre 9/10) et avis @legal avant tout envoi.
[Framework : invitation simple à un seul pas (une porte, un geste).] [Conscience : Product-Aware : il a payé, il sait ce qu'est le site, il ne sait pas qu'il peut nous écrire.]

**Envoi** : J12 (jours calendaires de Paris depuis la souscription). Mêmes règles que E1/E2 : jamais un jeudi, jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel, ni la veille ou le lendemain d'un rappel de parcours ; glisse au premier jour libre, mais **au plus tard J20** (pour ne jamais se télescoper avec E2 à J21). Aucun jour libre : non envoyé, journalisé. `replyTo` = alex@ (`ONBOARDING_REPLY_TO`). Mêmes arrêts immédiats que E1 (rétractation, remboursement, paiement échoué, suppression du compte, lien d'arrêt, opposition par réponse).

**Qui le reçoit (ce que je retiens)** : les abonnés payants dont l'accès est ouvert, **pas les résiliations programmées**, comme E2. Raison : le cadre `docs/legal/onboarding-e1-resilies-s23.md` ne l'autorise pas, il l'interdit (C2, l. 23 : « Un seul envoi, E1 à J5, rien d'autre »). Le choix de Thomas du 07/11 ne porte que sur E1.
**Conséquence légale à traiter avant l'envoi** : la puce C8 de la confidentialité (même fichier, l. 82) annonce « deux e-mails d'accueil, au bout de 5 jours puis de 21 jours ». Avec E1b il y en a trois (5, 12, 21 jours) : puce à corriger par @legal/@fullstack avant l'ouverture, sinon l'information à la collecte est fausse.

**Objet, option A (recommandée)** : `Une situation où la répartie t’a manqué ?`
Première ligne A : `Salut {prénom}, une situation où tu n’as pas su quoi répondre ?`
**Objet, option B** : `Pose-nous ta question`
Première ligne B : `Salut {prénom}, tu peux nous poser une question, directement depuis ton profil.`
Recommandation A : l'objet est la situation du lecteur, pas une consigne, et il se distingue de l'objet d'E1 (« Une question ? … »), reçu une semaine plus tôt. B est plus direct mais proche d'E1. Le corps ci-dessous suit les deux premières lignes sans changement.

### Corps recommandé (texte seul, environ 60 mots)
```
Salut {prénom}, une situation où tu n’as pas su quoi répondre ?

Un collègue te chambre devant tout le monde, ou un message que tu n’arrives pas à écrire : raconte-nous la situation.

Ça se passe dans « Ta question à l’équipe », sur ton profil. En général, réponse par e-mail sous 1 à 2 jours ouvrés. Rien n’est publié sans ton accord.

Poser ma question : {url}/profil

L’Équipe Deviens Marrant
deviens-marrant.fr

---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : {lienArret}
```
Pied identique à E1/E2 (mêmes deux lignes, `List-Unsubscribe` sur `{lienArret}`). Pas de vanne : « pas de vanne plutôt qu'une vanne moyenne » (`ton-alex.md`), l'e-mail est un geste utilitaire. Pas de `?src=` : aucune valeur à ajouter à `PARCOURS_SRC` (pas de suivi), le lien est `/profil` nu.

**Appel unique : le lien vers « Ta question à l’équipe » (et non « réponds à cet e-mail »)**. Justification : (1) c'est la seule porte qui affiche l'engagement de délai (1 à 2 jours ouvrés) et le cadre (CGU art. 10) ; une réponse à l'e-mail n'a ni l'un ni l'autre, et E1/E2 invitent déjà à répondre : E1b apporte une porte différente ; (2) une réponse « arrêtez » à alex@ vaut opposition (cadre C4) : mêler questions et oppositions dans la même boîte est un risque de traitement que le formulaire évite ; (3) le formulaire est déjà là et ouvert. Limite assumée : le lien demande une session ouverte (sinon connexion puis `/profil`) et l'encadré n'a pas d'ancre (il se trouve sous la carte abonnement). La réponse directe à l'e-mail reste possible (`replyTo` alex@) sans être proposée.

### Faits vérifiés

| Affirmation du texte | Source (fichier:ligne) |
|---|---|
| « Ta question à l’équipe » existe, sur le profil | `question-equipe-s22.ts:33` (titre) ; `profil-dashboard.tsx:373` (rendu `isPremium`) |
| Service ouvert | `question-equipe.ts:11` (`QUESTION_EQUIPE_OUVERTE = true`) |
| Exemple « un collègue te chambre devant tout le monde » | `question-equipe-s22.ts:37` (texte d'aide du champ) |
| Exemple « un message que tu n’arrives pas à écrire » | `question-equipe-s22.ts:34` (accroche) |
| « raconte-nous la situation » (le champ s'appelle « Ta situation ») | `question-equipe-s22.ts:36` |
| « En général, réponse par e-mail sous 1 à 2 jours ouvrés. » (verbatim) | `question-equipe-s22.ts:16` |
| « Rien n’est publié sans ton accord » | `question-equipe-s22.ts:125` (CGU art. 10) |
| Réservé Premium (le lecteur l'est) | `question-equipe-s22.ts:125` ; `profil-dashboard.tsx:373` |
| `replyTo` alex@ (E1b, non proposé comme appel) | `question-equipe.ts:22` ; `onboarding-premium.ts:33` |
| Pas d'ancre, d'où `/profil` nu | `question-equipe-card.tsx:107` (Card sans `id`) |
| Pas de résiliés | `onboarding-e1-resilies-s23.md:23` (C2) |
| Puce C8 à corriger (deux devient trois, 5/12/21) | `onboarding-e1-resilies-s23.md:82` |

Volontairement absents : limite de 1 000 caractères, limites d'envoi (jamais affichées, `question-equipe.ts:28`), « 3 jours ouvrés au plus tard » (CGU, pas dans l'encadré), « privé » (le message est lu par l'équipe et des outils de rédaction, `question-equipe-s22.ts:114`), toute promesse de résultat.
Objection traitée : « personne ne me répond vraiment » (délai affiché + réponse par e-mail). Références marché : non consultées (ton calé sur `ton-alex.md`).
À faire (@fullstack, hors périmètre ici) : E1b dans `onboarding-premium.ts`, règle de glissement J12 à J20, mêmes arrêts qu'E1, exclusion des résiliations programmées, journal.
