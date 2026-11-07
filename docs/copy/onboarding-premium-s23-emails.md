# Onboarding Premium s23 : textes finaux E0, E1, E2 (v4, 07/11/2026)

Statut : BROUILLON v4, avant relecture à l'aveugle (barre 9/10), avis @legal final et approbation de Thomas. Rien n'est envoyé avant.
v4 = refonte demandée par Thomas le 07/11 (rejet de la v3.1 : « Le bienvenue est archi nul… Généraliste. Là, c'est ultra ciblé… On fait que ça en fait sur le site ?? »). Décision consignée dans `docs/founder-preferences.md` (07/11) : elle REMPLACE les étalons 2 C et 3 A et la fiche du carnet dans les e-mails. Restent valables : objet 1 A, E2 (4 A) inchangé, phrase 5 C (mensuel seulement), bloc contractuel mot pour mot, E1 aussi aux résiliés programmés (phrase de tête @legal, `docs/legal/onboarding-e1-resilies-s23.md`), signature, ton `docs/copy/ton-alex.md`.

[Framework : liste de bénéfices puis un pas (AIDA court) pour E0 ; porte ouverte puis invitation à répondre pour E1 ; question ouverte pour E2.]
[Conscience : Most-Aware pour E0 (l'abonné vient de payer, transactionnel) ; Product-Aware pour E1 (il a payé, il a peut-être à peine regardé).]

Conventions de rendu :
- Texte seul, tutoiement, « on », zéro tiret cadratin, zéro émoji. Apostrophes typographiques ’ comme dans `paiement.ts`. Les puces sont des tirets simples « - ».
- Pas de préheader : l'aperçu = « Salut {prénom}, » + première phrase du corps. `{prénom}` absent : « Salut, ».
- `{url}` = `siteUrl()`. `{N}` = `PARCOURS_COUNT` (`config/premium.ts:89`). `{listeParcours}` = `PREMIUM_PARCOURS` rendu « {name} ({timePerWeek}) », virgules, dernier par « et » (`premium.ts:76-86`). Signature = `SIGNATURE` (`paiement.ts:27`) ; dans E1/E2 suivie de « deviens-marrant.fr ». Aucun chiffre en dur.

---

## E0 : bienvenue (J0, transactionnel, part tout de suite, jeudi compris)

**Objet** (étalon 1 A, inchangé) : `Ton abonnement est confirmé : Premium est ouvert, sers-toi`
Envoi : `replyTo` inchangé (e-mail de service). Pas de lien d'arrêt (transactionnel).

### Corps rendu

Blocs `[si …]` rendus seulement si la condition est vraie.

```
Salut {prénom}, voici tout ce que Premium t’ouvre, et par où commencer.

Ce qui est à toi dès maintenant :
- Les vannes : tout le catalogue, sans limite, avec des filtres pour trouver celle qui colle à ta situation.
- Les conseils : toutes les techniques de répartie et d’humour, sans limite, avec leurs filtres.
- Les vidéos : le stand-up décortiqué technique par technique, sans limite, avec leurs filtres.
- Les parcours : les {N} en entier, de la première à la dernière étape.
[si carnet] - Le carnet de répartie : chaque mois des situations et leurs répliques, et les carnets des mois passés.
- Les exercices des fiches : de quoi t’entraîner, pas seulement lire.
- Tes favoris : vannes, conseils et vidéos gardés sous la main.
- Ta progression et ta série : tu vois où tu en es.
[si état recoit] - La lettre du jeudi : par e-mail, chaque semaine, si tu la veux (un clic pour l’arrêter).
[si question] - « Ta question à l’équipe » : écris-nous depuis ton profil, on lit tout.
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

Longueur : 11 lignes de liste maximum (9 si carnet, lettre ou question absents), chacune sur une ligne ou deux à l'écran mobile ; la liste, la ligne « Par où commencer » et la formule de bienvenue tiennent à peu près un écran avant le bloc contractuel, à vérifier au rendu.

### Conditions de rendu et vérifications dans le code

| Ligne | Condition | Source du fait |
|---|---|---|
| Vannes, conseils, vidéos « sans limite » | toujours | Gratuit limité à `FREE_CATALOGUE_LIMITS_LABEL` (`premium.ts:110-115`) ; `/api/jokes` : `isPremium` lève la limite ; tableau « Tout le catalogue : Sans limite » (`abonnement-vente.ts:124`) |
| « avec des filtres » | toujours | Filtres rendus par `conseils-list.tsx`, `videos-grid.tsx` ; vannes : « avec Premium, par les filtres » (`vannes/page.tsx:59`) |
| Parcours « les {N} en entier » | toujours | `PARCOURS_COUNT` ; tableau `abonnement-vente.ts:125` |
| Carnet + « mois passés » | `[si carnet]` : `getCarnetExtrait` non null | Tableau : « Toutes, carnets passés compris » (`abonnement-vente.ts:127`) ; ligne présente seulement si un carnet existe, comme le tableau |
| Exercices, favoris, progression et série | toujours | Tableau `abonnement-vente.ts:130-132` (Gratuit : Non) |
| Lettre du jeudi | `[si état recoit]` (`LETTRE_HEBDO_INFO_PAIEMENT`) | « Chaque semaine, si tu la veux » (`abonnement-vente.ts:129`, `AVANTAGE_LETTRE`) |
| Ta question à l’équipe | `[si question]` : `QUESTION_EQUIPE_OUVERTE` (`config/question-equipe.ts:11`) | Encadré du profil Premium, envoi par e-mail à l'équipe |
| Rappel de parcours | toujours | `profil/rappel-parcours-toggle.tsx`, `/profil#rappel-parcours` ; activable par l'abonné |

- Aucun autre avantage Premium réel dans le code : le quiz (« Quiz et vanne du jour ») est Gratuit et Premium (`abonnement-vente.ts:133`), le glossaire est public ; ils ne sont donc pas listés en E0 (« ce que Premium t’ouvre »), mais cités en E1.
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

Une question, un doute, un truc qui manque ? Réponds à cet e-mail, on lit tout. Et si tu veux un repère, voici ce qu’on fait sur le site :
- Vannes : des blagues rangées par situation, à ressortir au bon moment.
- Conseils : des techniques de répartie et d’humour, avec un défi à tester.
- Vidéos : du stand-up français décortiqué, pour voir ce qui fait rire.
- Parcours : {N} parcours, une étape par semaine, pour progresser pas à pas.
[si carnet] - Carnet : chaque mois, des situations et leurs répliques.
- Glossaire : le dico de l’humour (punchline, timing, callback…), en accès libre.
- Quiz : « Quel type d’humour es-tu ? », en accès libre.

Pour commencer par un parcours : {url}/parcours?src=onboarding-premium
```

### Version PARCOURS (abonné avec un parcours en cours)
Même corps que la version GÉNÉRALE (même liste), avec la phrase de tête « voici où tu en es » pour les résiliés, une ligne ajoutée juste avant la liste, et le lien principal remplacé :
```
[…]
Ta prochaine étape : « {parcoursTitre} », étape {etapeNumero} sur {weeks} : {etapeTitre}.
[liste identique]

Reprendre mon parcours : {lienEtape}
```
Replis : sans titre d'étape (repli « Étape {n} »), « Ta prochaine étape : « {parcoursTitre} », étape {etapeNumero} sur {weeks}. » ; parcours absent de `PREMIUM_PARCOURS`, sans « sur {weeks} » ; sans titre de parcours, la ligne est supprimée et le lien reste `{url}/parcours`. Données : `rappel-parcours.ts:200-215` (`parcoursTitre`, `etapeNumero`, `etapeTitre`, `lienEtape`) ; `weeks` dans `premium.ts:76-86`. `titreEtape` n'est pas exportée [@fullstack].

**Lien principal : `/parcours`** (justification : c'est la valeur centrale de l'offre, la promesse « un parcours structuré », et le lien le plus utile à quelqu'un qui n'a pas encore commencé ; le carnet, le quiz ou le glossaire restent cités sans lien pour ne pas disperser). Chez qui a un parcours en cours, le lien le plus utile est sa prochaine étape.

**Vérification des lignes** : vannes (`/vannes`, rangées par contexte, `vannes/page.tsx:59,69`), conseils (« un exemple, un dialogue et un défi à tester », `conseils/page.tsx:98`), vidéos (« décortiquées technique par technique », `videos/page.tsx:94`), parcours (`PARCOURS_COUNT`, une étape par semaine = `weeks`, `premium.ts:68`), carnet (`[si carnet]`, même garde qu'en E0), glossaire (public, `glossaire/page.tsx:28`), quiz (`quiz-humour/page.tsx:18`, gratuit et Premium). Aucune promesse hors code.

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
