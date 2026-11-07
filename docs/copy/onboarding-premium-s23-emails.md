# Onboarding Premium s23 : textes finaux E0, E1, E2 (v3, 07/11/2026)

Statut : BROUILLON v3, avant nouvelle relecture à l'aveugle (barre 9/10), avis @legal final et approbation de Thomas. Rien n'est envoyé avant.
v3 = v2 + obligatoire reviewer (`revues-onboarding/aveugle-reviewer-v2.md`, O1 règle d'envoi) + arbitrage session principale (fiche offerte dans E0, autre fiche réservée dans E1) + panel v2 (`aveugle-panel-v2.md`, corrections vérifiées dans `apps/web/src`) + souhaitables reviewer. Décisions de Thomas du 07/11 (`founder-preferences.md`) non re-questionnées ; cadre `docs/legal/onboarding-e1-resilies-s23.md`.
Source des choix : `etalons-onboarding-s23.md` (1 A, 2 C, 3 A, 4 A, 5 C), repris mot pour mot, aucun mot d'étalon retiré (voir journal).

[Framework : AIDA court pour E0 ; PAS inversé pour E1 (situation vécue, puis la porte ouverte) ; question ouverte pour E2.]
[Conscience : Product-Aware à Most-Aware (l'abonné vient de payer), E0 transactionnel.]

Conventions de rendu (toutes les variantes) :
- Texte seul, tutoiement, « on », zéro tiret cadratin, zéro émoji. Apostrophes typographiques ’ comme dans `paiement.ts`.
- Texte seul = **pas de préheader** : l'aperçu dans la boîte est « Salut {prénom}, » suivi de la première phrase du corps. Chaque première phrase est écrite pour tenir lieu d'aperçu.
- `{prénom}` absent : « Salut, ». `{url}` = `siteUrl()`. `{N}` = `PARCOURS_COUNT` (`config/premium.ts:89`). `{listeParcours}` = `PREMIUM_PARCOURS` rendu « {name} ({timePerWeek}) », séparés par des virgules, le dernier par « et » (`premium.ts:76-86`, dynamique ; novembre 2026 : Machine à Café (15 min/semaine), Répartie (20 min/semaine) et Confiance (20 min/semaine)). `{nbAutres}` = `fiches.length` du carnet du mois moins 1 (`carnet.ts:61`, `totalFiches`). Signature = `SIGNATURE` (`paiement.ts:27`) ; dans E1/E2, suivie de « deviens-marrant.fr ».
- **Fiches rendues** (E0 et E1) : apostrophes droites des JSON (`J'ai`) normalisées en ’ au rendu (règle `APOSTROPHE_DROITE` de `frTypo`, `lib/fr-typo.ts:92`) ; « ... » en « … » à ajouter si `frTypo` ne le fait pas [à vérifier @fullstack]. Aucun mot changé.
- Dans E0, les libellés « Pour commencer », « Cette semaine », « Ensuite, à ton rythme » sont rendus sans astérisques.

---

## E0 : bienvenue (J0, transactionnel, part tout de suite, jeudi compris)

**Objet** (étalon 1 A) : `Ton abonnement est confirmé : Premium est ouvert, sers-toi`
Aperçu (texte seul) : « Salut {prénom}, voici ce qui vient de s’ouvrir, et par où commencer. » (phrase d'ouverture de l'étalon 1 A, inchangée.)
Envoi : `replyTo` inchangé (e-mail de service). Pas de lien d'arrêt (transactionnel).

### Corps rendu

Blocs `[si …]` rendus seulement si la condition est vraie.

```
Salut {prénom}, voici ce qui vient de s’ouvrir, et par où commencer.

Pour commencer : [si carnet] une fiche du carnet du mois, une situation et sa réplique.
[si carnet] {situation}
[si carnet] On te dit : « {onTeDit} »
[si carnet] Ta réplique : « {reponse} »
[si carnet] Pourquoi elle marche : {pourquoi}
[si carnet] À toi de jouer : {exercice}
[si carnet et nbAutres ≥ 2] {nbAutres} autres situations t’attendent dans le carnet de ce mois-ci.
[si carnet] Ouvrir le carnet : {url}/carnet
[sinon] la première étape d’un parcours, au choix parmi les {N} : {listeParcours}.
[sinon] Choisir mon parcours : {url}/parcours

Cette semaine : le catalogue sans limite, les exercices des fiches, tes favoris, ta progression et ta série.[si état recoit] La lettre de la semaine arrive chaque jeudi, incluse dans ton abonnement ; tu l’arrêtes en un clic, depuis chaque lettre ou ton profil.

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

Règle du « et » de « Ensuite » (le dernier élément rendu prend « et ») ; la 2e phrase est toujours rendue :
- carnet + question : `…en entier, les carnets passés et « Ta question à l’équipe » depuis ton profil.`
- carnet seul : `…en entier et les carnets passés.`
- question seule : `…en entier et « Ta question à l’équipe » depuis ton profil.`
- ni l'un ni l'autre : `…en entier.`

Conditions de rendu (code) :
- `[si carnet]` : `getCarnetExtrait` non null (carnet du mois en cours déposé, `carnet.ts:237`). **Fiche montrée en E0 = `ficheOfferte(carnet)`** (`carnet.ts:101`) : la fiche marquée `offerte`, sinon `fiches[0]` ; c'est déjà la fiche lisible sans compte (/abonnement, encart des articles), donc rien de réservé n'est divulgué. Champs (`carnet.ts:33-42`) : `situation`, `onTeDit`, `reponse`, `pourquoi`. L'exercice n'est volontairement pas montré en E0 (réservé à E1 pour ne pas répéter). Sans carnet du mois : « Pour commencer » bascule sur le parcours (comportement actuel).
- Le texte d'étalon 2 C de « Pour commencer » est intact : la fiche s'insère entre sa phrase et le lien « Ouvrir le carnet » (libellé étalon 3 A). Ligne `{nbAutres}` omise si le carnet n'a pas au moins 3 fiches.
- `[si état recoit]` : état `recoit` seulement (`LETTRE_HEBDO_INFO_PAIEMENT`) ; sinon la phrase lettre disparaît, le point qui précède reste.
- `[si question]` : `QUESTION_EQUIPE_OUVERTE` (`config/question-equipe.ts:11`).
- **`[si mensuel]` (phrase 5 C) : formule mensuelle seulement.** En annuel, aucune phrase de remplacement (cadre @legal partie b). Aucun mot de la phrase ne change.
- **Aucun e-mail de rappel avant prélèvement** (décision Thomas 07/11).
- Retiré du gabarit actuel : « Tout est ouvert. Pour démarrer, choisis un parcours : {url}/parcours. ». Le reste du bloc contractuel est inchangé mot pour mot (`paiement.ts` l. 279 à 291 et 295 à 299).

### Phrases nouvelles ou modifiées E0

| Phrase | Source du fait |
|---|---|
| Fiche du mois sous « Pour commencer » (« La fiche de ce mois-ci : », situation, On te dit, Ta réplique, Pourquoi elle marche) | Arbitrage session principale, dans la ligne du « oui » de Thomas 07/11 ; panel E0-1 (levier principal) ; `ficheOfferte`, `carnet.ts:101` ; libellés = champs `carnet.ts:37-40` |
| « {nbAutres} autres situations t’attendent dans le carnet de ce mois-ci. » | Panel E0-1 / E1C-2 (Sophie : « il y en a une ou trente ? ») ; `fiches.length`, `carnet.ts:61`. Le libellé du lien reste « Ouvrir le carnet » (étalon 3 A) |
| « au choix parmi les {N} : {listeParcours}. » (sans carnet) | Panel E0-2 ; noms et rythmes `premium.ts:76-86`. « au choix parmi les {N} » = mots d'étalon conservés, la liste est ajoutée après |
| « Dès maintenant : » | v2 (panel P3) |
| « Ensuite… » en deux phrases | v2 (panel P4) ; rappel activable depuis le profil (`rappel-parcours.ts`, `/profil#rappel-parcours`) |

---

## E1 : J5, « Une question ? » + par où commencer

**Envoi** : `replyTo` = `QUESTION_EQUIPE_DESTINATAIRE` (alex@deviens-marrant.fr, `config/question-equipe.ts:22`). Jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel (jeudi, numéro de la semaine parti en retard, rappel de parcours du jour), ni la veille ou le lendemain d'un rappel de parcours : glisse au premier jour libre. Le rappel étant hebdomadaire, un jour libre existe toujours dans les 5 jours ; si aucun ne se présente sous 7 jours, l'e-mail n'est pas envoyé (journalisé).

**Qui le reçoit** (décision Thomas 07/11 + cadre @legal) : tout abonné payant dont l'accès est ouvert, **y compris en résiliation programmée tant que l'accès payé court**. Pour ces derniers, un seul envoi (E1), **E2 reste arrêté**.
Arrêt immédiat, avant l'envoi même programmé : rétractation exercée, remboursement, paiement échoué, suppression du compte, clic sur le lien d'arrêt, opposition reçue (une réponse « arrêtez » à alex@ vaut opposition, traitée sous un jour ouvré, reportée dans la base). Fin d'accès échue : aucun envoi. Abonné qui reprend son abonnement : régime normal.
Conditions @legal pour les résiliés (C1 à C8) : pas de pixel ni de suivi de clic (`?src=` sans identifiant), journal par envoi (compte, numéro d'e-mail, date, cas d'arrêt), le motif de résiliation n'est jamais utilisé pour choisir ou personnaliser, phrase d'information à la collecte (C8) confirmée présente dans la confidentialité **avant** l'ouverture aux résiliés. Contenu, objet et version identiques pour tous : seule la phrase de tête ci-dessous s'ajoute.

**Phrase de tête (résiliation programmée uniquement)**, texte légal exact, juste après « Salut {prénom}, » (ou « Salut, »), avant tout le reste du corps, sans autre appel, sans mention de résiliation, sans lien « rester », sans prix, sans urgence :
`Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.`
`{finAcces}` = fin de la période payée [à brancher par @fullstack]. Appliquée telle quelle dans les trois versions.

**[À VALIDER @legal] Variante de tête pour la seule version PARCOURS** (reviewer S1) : `Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici où tu en es.` Raison : chez un résilié avec parcours en cours, « voici par où commencer » est suivi de « Tu reprends là où tu en étais », ce qui se contredit. Même fait, même neutralité, aucune offre. **Non appliquée** : tant que @legal ne l'a pas validée, la phrase légale ci-dessus reste en place.

**Fiche et version : choix** (ordre de test, identique pour tous) :
1. Parcours en cours (au moins une étape validée, parcours non terminé, même règle que `rappel-parcours.ts:180-186`) et pas (CARNET utilisable + rappel de parcours actif) : **PARCOURS**.
2. CARNET utilisable (carnet du mois en cours déposé ET au moins une fiche autre que la fiche offerte, c'est-à-dire au moins 2 fiches) : **CARNET** (défaut, y compris abonné avec rappel actif).
3. Sinon : **OUVERTS**.

### Version CARNET (étalon 3 A + réplique d'une fiche réservée aux abonnés)
Objet (étalon 3 A, inchangé) : `Une situation, une réplique`
```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.

Quelqu’un te balance une remarque devant tout le monde, et rien ne te vient. Le carnet part de ces moments-là : une situation, la réplique qui sauve la mise, pourquoi elle marche.

Une fiche du carnet de ce mois-ci :
{situation}
On te dit : « {onTeDit} »
Ta réplique : « {reponse} »
Pourquoi elle marche : {pourquoi}
À toi de jouer : {exercice}

[si nbAutres ≥ 2] {nbAutres} autres situations t’attendent dans le carnet de ce mois-ci.
Une question, un doute ? Réponds à cet e-mail, on lit tout.

Ouvrir le carnet : {url}/carnet?src=onboarding-premium
```
**Règle déterministe de la fiche d'E1** : `const carnet = getCurrentCarnet()` ; si `!carnet || carnet.mois !== currentParisMonth()`, pas de version CARNET (même garde que `getCarnetExtrait`, `carnet.ts:239`). Sinon `const offerte = ficheOfferte(carnet)` et `fiche = carnet.fiches.find((f) => f.id !== offerte.id && (f.contexte === "amis" || f.contexte === "soirée")) ?? carnet.fiches.find((f) => f.id !== offerte.id)` (comparaison par `id` : `getCarnetExtrait` renvoie une copie, `carnet.ts:244` ; filtre `amis`/`soirée` pour tenir la promesse de l'accroche « devant tout le monde », panel v3 K3 ; novembre 2026 : 5 fiches `amis`, 5 `soirée`, vérifié dans `src/data/carnet/2026-11.json`). C'est la première fiche du carnet qui n'est pas la fiche offerte, comparaison par identité d'objet comme `carnetViewForPlan` (`carnet.ts:178`). Le carnet est classé de la moins tendue à la plus tendue (`carnet.ts:174-175`) : l'abonné reçoit donc la plus douce des fiches réservées. Novembre 2026 (vérifié dans `data/carnet/2026-11.json`) : 30 fiches, fiche offerte = `2026-11-10` (ligne 117), donc E0 montre `2026-11-10` et E1 `2026-11-01` « Le vendeur dans ton dos ». Aucune répétition entre E0 et E1 tant que le carnet compte 2 fiches ou plus (sinon E1 bascule, voir ci-dessus). Même fiche pour tous, résiliés compris.
Pourquoi la fiche réservée est licite ici : le destinataire a un abonnement payant à l'accès ouvert (donc la vue Premium complète, `carnetViewForPlan`, toutes les fiches). [À vérifier @fullstack : le plan reste « premium » jusqu'à `finAcces` pour un résilié programmé ; sinon E1 CARNET ne part pas à ces abonnés.] E1 s'arrête à la fin d'accès (C1), donc jamais de fiche réservée vers un compte sans accès.
`{exercice}` = champ `exercice` de la fiche (`carnet.ts:42`, obligatoire au schéma), rendu dans l'application sous le titre « À toi de jouer » (`components/carnet/carnet-fiche-card.tsx:44`) : même libellé dans l'e-mail. `{nbAutres}` ne compte pas la fiche déjà montrée.

### Version PARCOURS (variante de l'étalon 3 A)
Objet (panel E1P-1) : `Ton parcours « {parcoursTitre} » : la suite` ; repli sans titre de parcours : `Ton parcours : la suite`
```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.

Dans ton parcours « {parcoursTitre} » ({timePerWeek}), la suite, c’est l’étape {etapeNumero} sur {weeks} : {etapeTitre}. Tu reprends là où tu en étais.
(`timePerWeek` et `weeks` lus dans `PREMIUM_PARCOURS` par slug, `premium.ts:76-86`. Replis : sans titre d’étape, « …c’est l’étape {etapeNumero} sur {weeks}. Tu reprends là où tu en étais. » ; parcours absent de `PREMIUM_PARCOURS`, phrase sans « ({timePerWeek}) » ni « sur {weeks} ».)

Une question, un doute ? Réponds à cet e-mail, on lit tout.

Reprendre mon parcours : {lienEtape}
```
Donnée vérifiée : `rappel-parcours.ts:200-215` calcule `parcoursTitre` (`learningPath.title`), `etapeNumero` (première étape non validée), `etapeTitre` (`titreEtape`, l. 123, repli `Étape {n}`) et `lienEtape` (`{baseUrl}/parcours/{slug}?src=rappel`, l. 215). Pour E1, remplacer `src=rappel` par `src=onboarding-premium` (voir plus bas). Parcours choisi si plusieurs en cours : le premier, comme le rappel. **Repli** si `etapeTitre` est le repli « Étape {n} » : `…la suite, c’est l’étape {etapeNumero}. Tu reprends là où tu en étais.` Si le titre du parcours manque : « Ton parcours continue à l’étape suivante, là où tu en étais. » `titreEtape` n'est pas exportée [à exporter ou dupliquer, @fullstack].

### Version OUVERTS (sans carnet utilisable, sans parcours en cours)
Objet (panel E1O-1) : `{N} parcours : lequel pour toi ?`
```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici par où commencer.

Les {N} parcours sont à toi en entier : {listeParcoursDurees}. Prends celui qui ressemble à ta semaine, la première étape suffit pour commencer.

Une question, un doute ? Réponds à cet e-mail, on lit tout.

Choisir mon parcours : {url}/parcours?src=onboarding-premium
```
Rendu novembre 2026 : « Les 3 parcours sont à toi en entier : Machine à Café (3 semaines, 15 min/semaine), Répartie (4 semaines, 20 min/semaine) et Confiance (6 semaines, 20 min/semaine). » (`{listeParcoursDurees}` = « {name} ({weeks} semaines, {timePerWeek}) », même source `premium.ts:76-86` ; E0 garde `{listeParcours}`, plus court.) Le mot « ouvert » ne revient plus qu'une fois chez les résiliés.

**`?src=onboarding-premium`** (reviewer S5, sur les trois liens d'E1) : `PARCOURS_SRC` est une liste fermée (`lib/parcours-tracking.ts:6-33`) ; toute valeur inconnue devient `direct` (l. 37-40). La valeur doit donc être ajoutée à la liste [@fullstack, avis @legal s17 pour toute nouvelle valeur] ; sans cela, la mesure des trois versions retombe sur `direct`. Paramètre d'URL sans identifiant (C6). `/carnet` ne passe pas par `PARCOURS_SRC` : [à vérifier @fullstack, sinon retirer le paramètre de ce lien].

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
| Fiche réservée (première non offerte) + « À toi de jouer : {exercice} » | Arbitrage session principale ; panel E1C-1 ; règle `ficheOfferte`/`find`, `carnet.ts:101,178` ; `exercice` `carnet.ts:42` et `carnet-fiche-card.tsx:44` |
| « Une fiche du carnet de ce mois-ci : » | Reviewer S2 (antécédent clair) ; le mot « autre » évité : il serait faux si E0 est parti sans carnet |
| « {nbAutres} autres situations t’attendent… » | Panel E1C-2 ; `fiches.length`, `carnet.ts:61`. Le lien garde « Ouvrir le carnet » (étalon 3 A) |
| Objet PARCOURS et « la suite, c’est l’étape… » | Panel E1P-1 et E1P-2 (corrige le « est ouverte » qui contredisait E0, reviewer S6) ; `rappel-parcours.ts:200-215` |
| Objet et corps OUVERTS avec `{listeParcours}` | Panel E1O-1 et E1O-2 ; `premium.ts:76-86` |
| Règle d'envoi (veille/lendemain, 7 jours) | Reviewer O1, texte exact du rapport |
| Phrase de tête résiliés | Texte exact imposé par @legal ; variante PARCOURS marquée [À VALIDER @legal], non appliquée |

---

## E2 : J21, « Trois semaines : qu'est-ce qui manque ? »

**Envoi** : mêmes règles que E1, y compris la règle de glissement du reviewer O1 (jour libre, `replyTo` alex@, arrêts). **Non envoyé aux abonnés en résiliation programmée** (décision Thomas / cadre @legal C2). Aucun lien d'action, aucun délai promis.
Objet (étalon 4 A) : `Trois semaines : qu’est-ce qui manque ?`
Aperçu (texte seul) : « Salut {prénom}, ça fait trois semaines que tu es là. »
```
Salut {prénom}, ça fait trois semaines que tu es là. Dis-nous ce qui t’a servi, ce qui t’a fait lever les yeux au ciel et ce qui manque. Réponds simplement à cet e-mail, on lit chaque réponse.

Une ligne suffit, même pour dire que tu n’as pas encore eu le temps.

L’Équipe Deviens Marrant
deviens-marrant.fr

---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : {lienArret}
```
Prénom absent : « Salut, ça fait trois semaines que tu es là. … ». **Le paragraphe de l'étalon 4 A est intact, mot pour mot** ; seul est ajouté, en paragraphe séparé juste après, « Une ligne suffit… » (panel E2 : donne une réponse possible à l'abonné qui n'a presque rien utilisé, sans lien ni délai).

---

## Contrôles faits

- Zéro tiret cadratin, zéro émoji, aucun concurrent, aucun prix ni promotion ajoutés, aucune urgence ; `{N}` et `{listeParcours}` par constantes.
- Promesses : lettre (jeudi, un clic) alignée sur `LETTRE_HEBDO_INFO_PAIEMENT.recoit` ; « Ta question à l'équipe » conditionnée à l'interrupteur ; rappel de parcours activable depuis le profil ; « une étape par semaine » = `weeks` d'un parcours (`premium.ts:68`) ; aucune promesse de rappel avant prélèvement. Aucun chiffre de fiches ou de durée écrit en dur : tout vient de variables lues dans le code.
- Objections : « résilier pour ne pas oublier » (phrase 5 C pour le mensuel, décision Thomas ; panel : Yanis et Sophie en tirent « je résilie maintenant », assumé, le levier est la fiche dès E0), « qu'est-ce que j'ai acheté » (liste), « par où commencer » (fiche dans E0, autre fiche dans E1), « personne ne me répond » (replyTo alex@).
- Références marché : non consultées (ton calé sur `ton-alex.md` et les étalons).

## Points à trancher

1. **Thomas, étalons non touchés** : panel E0-3 (aperçu E0 : changerait la phrase d'ouverture de l'étalon 1 A), E0-4 (« Ensuite », étalon 2 C), E2 « que tu es là » inexact pour un ancien inscrit gratuit devenu Premium (reviewer S4, « que tu es Premium » possible), lettre du mois (reviewer v2 S1).
2. **@legal** : (a) variante de tête PARCOURS résiliés ; (b) panel E0-5 (« Bienvenue, et merci. » à la place de « Bienvenue, et merci pour ta confiance. ») : phrase du bloc contractuel, non touchée ; (c) reviewer S7 : le bloc dit « bouton « Résilier ton contrat » » alors que l'interrupteur s23 en fait un lien (`abonnement-card.tsx:78`), bloc non modifié ; (d) C8 avant ouverture aux résiliés ; (e) fiche réservée envoyée aux abonnés en résiliation programmée : confirmer.
3. **@fullstack** : `finAcces`, plan premium jusqu'à `finAcces`, règle `find` de la fiche d'E1, `{nbAutres}`, `{listeParcours}`, `titreEtape` exportée, normalisation typographique des fiches, `src=onboarding-premium` dans `PARCOURS_SRC`, règle de glissement (veille/lendemain, 7 jours, journal), `BIENVENUE_PREMIUM.lettre` périmé (`abonnement-vente.ts:175`).
4. **Longueur mobile** : E0 avec la fiche est nettement plus long avant le bloc contractuel ; à relire au panel (repli : retirer « Pourquoi elle marche » d'E0, sans toucher l'étalon 2 C).

---

## Journal v2 → v3

| # | Changement | Source | Fait vérifié où |
|---|---|---|---|
| 1 | Règle d'envoi E1 (et E2) remplacée par le texte exact du reviewer (veille/lendemain d'un rappel, jour libre sous 5 jours, abandon journalisé après 7) | Reviewer O1 (obligatoire) | Rappel hebdomadaire : rapport reviewer, `rappel-parcours.ts` |
| 2 | E0 : fiche offerte du mois sous « Pour commencer » (situation, On te dit, Ta réplique, Pourquoi), aucun mot d'étalon retiré | Arbitrage session principale ; panel E0-1 | `ficheOfferte` `carnet.ts:101` ; champs `carnet.ts:37-40` ; `getCarnetExtrait` `carnet.ts:237` |
| 3 | E1 CARNET : autre fiche, réservée, = première fiche non offerte du carnet du mois ; repli si moins de 2 fiches | Arbitrage session principale ; panel §7 point 1 (option b) | `carnetViewForPlan` `carnet.ts:172-189` (Premium voit tout) ; `2026-11.json` : 30 fiches, offerte `2026-11-10` l. 117 |
| 4 | E1 CARNET : « À toi de jouer : {exercice} » ajouté | Panel E1C-1 | `exercice` `carnet.ts:42` ; libellé `carnet-fiche-card.tsx:44` ; champ obligatoire au schéma |
| 5 | Lignes « {nbAutres} autres situations t’attendent… » en E0 et E1 ; libellé du lien « Ouvrir le carnet » conservé | Panel E0-1/E1C-2 ; étalon 3 A | `fiches.length` `carnet.ts:61,245` ; aucun chiffre écrit en dur |
| 6 | E0 sans carnet : « au choix parmi les {N} : {listeParcours}. » | Panel E0-2 | `premium.ts:76-86` (noms, rythmes) |
| 7 | E1 PARCOURS : objet « Ton parcours « … » : la suite » et corps « la suite, c’est l’étape… » | Panel E1P-1/E1P-2 ; reviewer S6 | `rappel-parcours.ts:200-215` |
| 8 | E1 OUVERTS : objet « {N} parcours : lequel pour toi ? » et corps avec `{listeParcours}` | Panel E1O-1/E1O-2 | `premium.ts:76-86` |
| 9 | E2 : phrase « Une ligne suffit, même pour dire que tu n’as pas encore eu le temps. » en paragraphe séparé ; étalon 4 A intact | Panel E2 ; décision de cadrage session principale | Texte étalon 4 A ligne 116 de `etalons-onboarding-s23.md` |
| 10 | « Celle de ce mois-ci » remplacé : E0 « La fiche de ce mois-ci : », E1 « Une fiche du carnet de ce mois-ci : » | Reviewer S2 | Sans objet code |
| 11 | Normalisation des apostrophes des fiches au rendu | Reviewer S3 ; panel E1C-3 | `JSON` avec `'` (`2026-11.json`) ; `APOSTROPHE_DROITE` `fr-typo.ts:92` |
| 12 | `?src=onboarding-premium` sur les trois liens d'E1, avec condition de liste fermée | Reviewer S5 | `parcours-tracking.ts:6-40` (valeur inconnue = `direct`) |
| 13 | Variante de tête PARCOURS résilié proposée, non appliquée | Reviewer S1 | Texte légal inchangé (`onboarding-e1-resilies-s23.md`) |
| 14 | Non appliqués : E0-3 (aperçu = phrase d'étalon 1 A), E0-4 (étalon 2 C), E0-5 (bloc contractuel, @legal), E2 S4 (étalon 4 A), S7 (bloc contractuel, @legal), objet CARNET (étalon 3 A) | Contraintes de la mission | Étalons `etalons-onboarding-s23.md` l. 19, 63-65, 116 |

## Journal v1 → v2 (conservé)

| # | Changement | Source |
|---|---|---|
| 1 | Phrase 5 C rendue `[si mensuel]` seulement | Reviewer O1 v1 ; @legal (b) |
| 2 | Préheaders supprimés, aperçu = début du corps | Reviewer O2 v1 |
| 3 | Objet E1 PARCOURS « Une question sur ton parcours ? » (remplacé en v3) | Reviewer O3 v1 |
| 4 | E1 CARNET : fiche du mois dans l'e-mail (règle remplacée en v3 par une autre fiche) | Thomas 07/11 ; panel P5 |
| 5 | E1 aussi en résiliation programmée avec phrase de tête exacte ; E2 arrêté pour eux | Thomas 07/11 ; panel P10 ; @legal |
| 6 | « là où tu t’es arrêté » devenu « là où tu en étais » | Panel P6 |
| 7 | « Cette semaine » devenu « Dès maintenant » | Panel P3 |
| 8 | Bloc « Ensuite » en deux phrases | Panel P4 ; reviewer S4 v1 |
| 9 | OUVERTS : « d'un coup » devenu « comprises » | Panel P7 |
| 10 | Règle d'envoi E1 : pas la semaine du rappel (corrigée en v3) | Reviewer S3 v1 |


## Journal v3 → v3.1 (07/11, session principale, textes exacts des relectures v3)

| Changement | Source | Fait vérifié |
|---|---|---|
| E0 : ligne « La fiche de ce mois-ci : » supprimée | Reviewer v3 O2, panel v3 K1 | Sans objet |
| E0 : « À toi de jouer : {exercice} » après « Pourquoi elle marche » | Panel v3 K2 | Champ `exercice` présent dans chaque fiche (`src/data/carnet/2026-11.json`) |
| E0 : « Cette semaine » rétabli (étalon 2 C choisi par Thomas) à la place de « Dès maintenant » (non validé par Thomas) | Reviewer v3 O3 | `docs/founder-preferences.md`, 07/11 |
| Règle de la fiche d'E1 : `getCurrentCarnet`, comparaison par `id`, filtre `amis`/`soirée` avec repli | Reviewer v3 O1, panel v3 K3 | `contexte` : 5 `amis`, 5 `soirée` en novembre |
| E1 PARCOURS : rythme et « étape n sur N » | Panel v3 K4 | `premium.ts:76-86` (`timePerWeek`, `weeks`) |
| E1 OUVERTS : « sont à toi en entier » et durées | Panel v3 K5, K6 | `premium.ts:76-86` |
| Non appliqué : déplacer « Prends ton temps… » avant « Résilier » dans le bloc contractuel | Question du panel à @legal | Bloc contractuel gardé mot pour mot (choix de Thomas) |
| Non appliqué : lien vers le carnet dans E2 | Option du panel soumise à Thomas | Étalon 4 A : aucun lien |
