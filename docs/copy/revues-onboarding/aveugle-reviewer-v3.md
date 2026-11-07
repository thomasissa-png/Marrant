# Relecture à l'aveugle v3 : onboarding Premium s23 (E0, E1 x3, E2), @reviewer, 07/11/2026

Texte relu : `docs/copy/onboarding-premium-s23-emails.md` (lignes 1 à 229, journal non lu avant notation). Cadres : `docs/legal/onboarding-e1-resilies-s23.md`, `docs/founder-preferences.md:151-155`, `docs/copy/ton-alex.md`. Faits contrôlés dans `apps/web/src`.

## Notes

| # | Critère | Note | Évidence |
|---|---|---|---|
| 1 | Exactitude | 8 | OK : `ficheOfferte` (`lib/carnet.ts:101-103`), 2026-11 = 30 fiches, offerte `2026-11-10` (`data/carnet/2026-11.json:117`), 1re non offerte `2026-11-01` « Le vendeur dans ton dos » (l. 7-8) ; `{listeParcours}` et rythmes = `config/premium.ts:76-86` ; ordre « moins tendue → plus tendue » = commentaire `carnet.ts:174-175` ; bloc contractuel = `config/textes/paiement.ts:279-291, 295-299` ; « Résilier ton contrat » = `config/textes/compte.ts:89`. **KO** : la règle d'E1 part de `getCarnetExtrait`, qui renvoie un `CarnetExtrait` sans `fiches` et une **copie** de la fiche (`carnet.ts:244`, `{ ...fiche }`) : comparaison par identité impossible ou toujours vraie, donc répétition E0/E1 possible dès qu'un carnet n'a pas de fiche marquée `offerte` (repli `fiches[0]`). Mineur : `carnet.ts:61` n'est pas `totalFiches` (l. 186 et 245). |
| 2 | Ton d'Alex, zéro tiret cadratin, zéro émoji, pression | 9 | Grep `—`/`–` : 0. Aucun émoji, aucune urgence, aucune vanne maison (donc rien sous la barre). Phrases fluides, tutoiement, guillemets « ». |
| 3 | Clarté et longueur mobile | 8 | E0 tient en environ 1,5 écran avant le bloc contractuel avec la fiche gratin (courte). Mais trois « mois » en sept lignes (« carnet du mois », « La fiche de ce mois-ci : », « carnet de ce mois-ci ») et un intertitre redondant avec la phrase d'étalon juste au-dessus. |
| 4 | Rétention sans pression | 9 | Valeur dès J0 (fiche entière), fiche réservée + exercice à J5, question ouverte à J21. Phrase 5 C assumée (choix Thomas). |
| 5 | Cohérence entre e-mails et variantes | 9 | Pas de répétition de fiche si la règle est codée par `id` (voir 1). Même phrase « {nbAutres} autres situations t’attendent dans le carnet de ce mois-ci. » dans E0 et E1 à 5 jours d'écart (souhaitable). |
| 6 | Cadre légal | 9 | Phrase de tête identique au texte @legal (cadre l. 38) ; C1 à C8 repris ; E2 arrêté pour les résiliés ; objet inchangé ; aucun lien abonnement ; `[si mensuel]` sur 5 C (cadre partie b). Restent ouverts et bien tracés : C8, fiche réservée aux résiliés, variante PARCOURS. |

**Note globale : 8,5/10. Sous la barre (9/10) : NO-GO en l'état.** Les 3 corrections obligatoires ci-dessous suffisent à la passer (1 → 9, 3 → 9).

## Corrections OBLIGATOIRES (texte exact)

**O1. Règle de la fiche d'E1 (l. 136), remplacer la première phrase par :**
> **Règle déterministe de la fiche d'E1** : `const carnet = getCurrentCarnet()` ; si `!carnet || carnet.mois !== currentParisMonth()`, pas de version CARNET (même garde que `getCarnetExtrait`, `carnet.ts:239`). Sinon `const offerte = ficheOfferte(carnet)` et `fiche = carnet.fiches.find((f) => f.id !== offerte.id)`. Ne pas partir de `getCarnetExtrait` : il ne renvoie pas `fiches` et sa fiche est une copie (`carnet.ts:244`), sur laquelle une comparaison par identité est toujours vraie.

Et dans le tableau E1 (l. 185) : `règle ficheOfferte/find par id, carnet.ts:101,239`.

**O2. E0, supprimer la ligne 33** `[si carnet] La fiche de ce mois-ci :` (la phrase d'étalon 2 C juste au-dessus annonce déjà « une fiche du carnet du mois, une situation et sa réplique »). Rendu :
```
Pour commencer : une fiche du carnet du mois, une situation et sa réplique.
{situation}
On te dit : « {onTeDit} »
```
Mettre à jour la ligne 89 du tableau (retirer « « La fiche de ce mois-ci : » »).

**O3. Étalon 2 C : l'intertitre « Cette semaine » choisi par Thomas (`founder-preferences.md:153`, `etalons-onboarding-s23.md:64`) est rendu « Dès maintenant ».** La ligne 5 (« repris mot pour mot, aucun mot d'étalon retiré ») est donc fausse en l'état. Soit rétablir `Cette semaine :` (l. 43 et l. 15), soit ajouter au point 1 des « Points à trancher » : `Étalon 2 C : intertitre « Cette semaine » rendu « Dès maintenant » (panel P3, v2) ; à confirmer par Thomas, sinon retour à « Cette semaine ».` et corriger la ligne 5 en conséquence.

Contrôle après notation (journal lu ensuite, notes inchangées) : le journal v1 → v2 (l. 261-262) confirme que « Cette semaine » → « Dès maintenant » et la réécriture du bloc « Ensuite » viennent du panel (P3, P4), sans accord de Thomas tracé, alors que la l. 249 présente l'étalon 2 C comme non touché. O3 maintenue ; le bloc « Ensuite » relève du même arbitrage Thomas. O2 retire la ligne ajoutée sur le S2 v2 (l. 245) : l'antécédent reste clair grâce à la phrase d'étalon.

## Souhaitables (une ligne chacun)

- S1. `{finAcces}` existe déjà : `currentPeriodEnd` quand `cancelAtPeriodEnd` (`lib/account.ts:21-23`, `lib/resiliation.ts:369`) ; remplacer « [à brancher] » par cette source.
- S2. `{nbAutres}` : citer `carnet.ts:245` (`totalFiches` de l'extrait) au lieu de `carnet.ts:61`.
- S3. E1 : varier la phrase `{nbAutres}` pour ne pas répéter mot pour mot celle d'E0 (ex. « Il en reste {nbAutres} dans le carnet de ce mois-ci. »), à relire au panel.
- S4. Variante PARCOURS résiliés : alternative sans attendre @legal, retirer « Tu reprends là où tu en étais. » pour tous (redondant avec « la suite »), ce qui supprime la contradiction avec « voici par où commencer ».
- S5. L'accroche d'E1 (« devant tout le monde ») ne colle pas à la fiche de novembre (vendeur seul à ton épaule) ; une accroche sans « devant tout le monde » tiendrait pour toutes les fiches.
- S6. Ellipse `Il est... intéressant` dans la fiche offerte de novembre (l. 121) : la normalisation « … » est bien à vérifier avant envoi.

## Contrôle v3.1 (07/11/2026, commit a0b3f33, fichier relu non modifié)

### Vérifications

| Point | Verdict | Évidence |
|---|---|---|
| O1 règle fiche d'E1 | PASS dans le code proposé, FAIL dans le texte qui l'entoure | `getCurrentCarnet` (`carnet.ts:162`), `currentParisMonth` (`carnet.ts:135`), garde identique à `carnet.ts:239`, `ficheOfferte` (`carnet.ts:101`), comparaison par `id` : OK (l. 136). Mais la même l. 136 dit encore « comparaison par identité d'objet » et annonce pour novembre E1 = `2026-11-01` « Le vendeur dans ton dos » : faux avec le filtre, la règle donne `2026-11-04` « Le chemin de la dernière fois » (`2026-11.json:43-46`, `amis`). Tableau l. 186 non mis à jour (O1 demandait `par id, carnet.ts:101,239`). |
| O2 ligne « La fiche de ce mois-ci : » | PASS dans le corps, résidu l. 89 | Corps E0 l. 32-37 OK. Tableau l. 89 la cite encore. |
| O3 « Cette semaine » | PASS l. 43, résidus | l. 92 garde la ligne « Dès maintenant : ». Le bloc « Ensuite » d'E0 (l. 45) reste reformulé par rapport à l'étalon 2 C (`etalons-onboarding-s23.md:65` : « une par semaine reste le rythme conseillé, avec un rappel par e-mail sur demande » rendu « on conseille une étape par semaine, avec un rappel par e-mail si tu l’actives dans ton profil ») ; l. 5 « aucun mot d'étalon retiré » donc toujours fausse, et ce point n'est pas soumis à Thomas. |
| K1 | PASS | l. 32-33. |
| K2 exercice E0 | PASS texte, résidu l. 77 | `exercice` obligatoire (`carnet.ts:42`), présent l. 125 pour `2026-11-10`, faisable seul. l. 77 dit encore « L'exercice n'est volontairement pas montré en E0 ». |
| K3 filtre amis/soirée | PASS | `contexte` `amis` : 04, 08, 09, 10 (offerte), 12 ; `soirée` : 05, 06, 07, 14, 26. « 5 `amis` » compte la fiche offerte (à préciser). Exercice de `2026-11-04` sans accessoire (K7 tenu en novembre). |
| K4 PARCOURS | PASS phrase, FAIL replis | `weeks` = nombre d'étapes (`premium.ts:68`), `timePerWeek` (`premium.ts:77-79`). La note de repli l. 147 est **dans** le bloc de code du corps (risque d'être copiée dans l'e-mail) ; le repli l. 153 (« …c’est l’étape {etapeNumero}. ») contredit celui de l. 147 (« …sur {weeks}. »). |
| K5, K6 OUVERTS | PASS corps, résidu l. 190 | Rendu l. 167 = `premium.ts:77-79` (3, 4, 6 semaines). Tableau l. 190 cite encore `{listeParcours}`. |
| Régressions | PASS | Grep `—`/`–` : 0. Étalons 1 A, 3 A, 4 A, 5 C intacts. Bloc contractuel = `paiement.ts:279-291, 295-299` mot pour mot. E0 (`2026-11-10`) et E1 (`2026-11-04`) : aucune répétition de fiche ni d'exercice. |
| Longueur E0 mobile | PASS avec réserve | Environ 1 500 signes avant le bloc contractuel en novembre, soit environ 2 écrans à 375 px (v3 : 1,5). Fiche et exercice finissent vers le bas du 1er écran : la valeur reste visible sans défiler loin. Réserve : longueur variable selon la fiche offerte du mois ; le repli du point 4 reste valable. |

### Note

Textes client des e-mails : 9. Documentation de rendu (ce que @fullstack code et ce que Thomas lit) : 8, à cause de l. 136 (mauvaise fiche annoncée) et de l. 5 (étalon). **Note globale : 8,5/10. NO-GO pour présentation à Thomas en l'état** ; R1 à R3 ne touchent aucun mot client, elles passent la note à 9 et le GO sur simple contrôle Grep, sans nouvelle relecture à l'aveugle.

### Corrections restantes (texte exact)

**R1. l. 136**, remplacer « novembre 2026 : 5 fiches `amis`, 5 `soirée` » par « novembre 2026 : 5 fiches `amis` dont la fiche offerte, 5 `soirée` », puis remplacer de « C'est la première fiche du carnet » jusqu'à « « Le vendeur dans ton dos ». » par :
> C'est la première fiche `amis` ou `soirée` qui n'est pas la fiche offerte (repli : la première fiche non offerte), comparaison par `id`. Le carnet est classé de la moins tendue à la plus tendue (`carnet.ts:174-175`) : l'abonné reçoit donc la plus douce des fiches réservées de ces deux contextes. Novembre 2026 (vérifié dans `data/carnet/2026-11.json`) : 30 fiches, fiche offerte = `2026-11-10` (ligne 117), donc E0 montre `2026-11-10` « Le gratin « intéressant » » et E1 `2026-11-04` « Le chemin de la dernière fois » (ligne 43).

Et l. 186, colonne 1 : `Fiche réservée (première amis/soirée non offerte, repli : première non offerte) + « À toi de jouer : {exercice} »` ; colonne 2 : remplacer `règle ficheOfferte/find, carnet.ts:101,178` par `règle ficheOfferte/find par id, carnet.ts:101,239`.

**R2. Résidus v3 :**
- l. 77 : remplacer « Champs (`carnet.ts:33-42`) : `situation`, `onTeDit`, `reponse`, `pourquoi`. L'exercice n'est volontairement pas montré en E0 (réservé à E1 pour ne pas répéter). » par « Champs (`carnet.ts:33-42`) : `situation`, `onTeDit`, `reponse`, `pourquoi`, `exercice` (panel v3 K2 ; E1 montre une autre fiche, donc rien ne se répète). »
- l. 89, colonne 1 : `Fiche du mois sous « Pour commencer » (situation, On te dit, Ta réplique, Pourquoi elle marche, À toi de jouer)`.
- l. 92 : supprimer la ligne `| « Dès maintenant : » | v2 (panel P3) |`.
- l. 190 : remplacer « avec `{listeParcours}` » par « avec `{listeParcoursDurees}` ».
- l. 147 : sortir la note entre parenthèses du bloc de code (la placer juste après la ligne ```` ``` ```` de fermeture, l. 152).
- l. 153 : remplacer « **Repli** si `etapeTitre` est le repli « Étape {n} » : `…la suite, c’est l’étape {etapeNumero}. Tu reprends là où tu en étais.` » par « **Repli** si `etapeTitre` est le repli « Étape {n} » : celui de la note sous le corps (`…c’est l’étape {etapeNumero} sur {weeks}. Tu reprends là où tu en étais.`). »

**R3. Étalon 2 C, bloc « Ensuite »** (P0 s8, choix de Thomas) :
- l. 5 : remplacer « repris mot pour mot, aucun mot d'étalon retiré (voir journal). » par « repris mot pour mot, sauf le bloc « Ensuite » d'E0, reformulé en v2 (panel P4) et soumis à Thomas (Points à trancher, point 1). »
- Points à trancher, point 1, ajouter : « Étalon 2 C, bloc « Ensuite » d'E0 : reformulé en v2 (panel P4) sans accord tracé (`etalons-onboarding-s23.md:65`) ; à confirmer par Thomas, sinon retour au texte de l'étalon. »

Souhaitables : titre et statut (l. 1 et 3) en « v3.1 » ; S3 (phrase `{nbAutres}` identique en E0 et E1) toujours ouvert.
