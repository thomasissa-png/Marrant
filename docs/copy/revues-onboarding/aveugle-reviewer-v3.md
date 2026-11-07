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
