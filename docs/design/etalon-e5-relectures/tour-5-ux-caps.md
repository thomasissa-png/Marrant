# E5 v8, caps et bonus : relecture à l'aveugle @ux (ajouts seuls)

Ouvert : parcours passage (cap 2, cap 3 à 200 %, cap seul, bonus seul), parcours cap 1 et cap 5 ; bibliotheque cap 1 / 3 / 5, cap 3 à 200 %, 1280 ; bonus cap 3 (375 et 320) et « neutre ». Source lue : `parcours.html` l. 150 à 209, `bonus.html` l. 100 à 219. **Non fournies : bonus à 200 %, passage cap 2 à 200 %, page neutre (voir C1).** Ordre DOM et focus : à confirmer au clavier.

## Vérifications demandées
- **Annonce** : région `aria-live="polite"` présente dès le chargement (source l. 174), remplie par script, « Fermer » présent dans les 4 états, « Ouvrir » seulement avec un bonus (absent en « cap seul »), aucune disparition automatique (jusqu'à fermeture). OK. L'action principale reste « Reprendre » (violet), « Ouvrir » et « Fermer » sont secondaires et de même poids.
- **Aucun cadenas, « verrouillé », « il te manque »** : rien sur aucune capture (cap 1, 2, 3, 5, annonce, Bibliothèque, fiche). OK.
- **Aucun bonus non ouvert visible** : Bibliothèque cap 1 sans bonus, cap 3 avec les caps 2 et 3, cap 5 avec les quatre ; aucune ligne grisée ni phrase d'attente. OK.
- **« Tes bonus » absent au cap 1** (capture `parcours-cap-1`), présent aux caps 2, 3 et 5. OK.
- **200 %** : annonce (boutons pleine largeur, « Ton cap » sur une ligne) et Bibliothèque (rangées et thèmes sur une colonne) sans débordement. OK.

## Notes /10
| C1 | C2 | C3 | C4 | C5 | C6 |
|---|---|---|---|---|---|
| 9 | 10 | 9 | 9 | 9 | 10 |

## Pour chaque note < 10
**C1 (9)**
- **[Bonus, page neutre]** la capture `bonus-neutre-375.png` est identique à la fiche du cap 3 (hash appliqué sans rechargement, comme `parcours-jour1` au tour 2) : la page neutre n'est pas vue, seulement lue dans le source (« Cette page n'est pas disponible », deux liens, aucun « s'ouvre au cap N » : conforme). Recapturer avec rechargement, à 375, 320 et 200 %.
- **[Bonus, état neutre, source l. 124]** `aria-current="page"` reste posé sur « Bibliothèque » : une adresse inexistante n'a aucune rubrique active, donc la page neutre se distingue d'elle et révèle que l'adresse existe (5.4, critère 19 : « même réponse »). Correction : retirer `aria-current` et le soulignement dans cet état.

**C3 (9)**
- **[Annonce, 4 états]** « Ouvrir » et « Fermer » sont dans la région vivante : un lecteur d'écran les lira avec la phrase, et « Ouvrir » n'a pas de destination dans son nom. Correction : phrase seule dans `aria-live`, boutons dans un groupe voisin ; noms accessibles « Ouvrir : {titre du bonus} » et « Fermer l'annonce » ; au « Fermer », focus sur « Reprendre ».
- **[Bibliothèque, lignes de fiche]** « Voir » et « Fait » sont de petites pastilles dans une ligne : vérifier que la ligne entière est le lien (cible de 44 px, déjà 56 px de haut) et que le statut est lu avec le titre (« Bonus du cap 3 · Tu avances bien, {titre}, Fait »).

**C4 (9)**
- **[Bonus et passage cap 2, 200 %]** captures absentes (la note les annonçait). À fournir ; point à regarder : la citation à barre violette, la grille Oui / Non et « Fait » dans une colonne de 140 px.

**C5 (9)**
- **[Bonus, `Fait`]** « Fait » est un bouton outline de même poids que « Oui / Non » ; son état coché n'a que `aria-pressed`. Correction : mêmes coche + contour de 2 px que les puces quand il est pressé, et libellé conservé.
- **[Parcours, annonce]** la page d'arrivée après « valider l'étape » n'est pas rendue (déclaré) : l'annonce est montrée sur « Parcours », ce qui suffit pour l'étalon à condition que la page réelle garde l'annonce près du bouton « Reprendre ».

## Verdict
Aucune règle de 5.4 n'est violée sur les écrans vus. Seuls restent deux points à corriger (page neutre sans `aria-current`, région vivante sans boutons) et deux captures à refaire (page neutre, bonus à 200 %).
