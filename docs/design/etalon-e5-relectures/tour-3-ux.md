# E5 v5, relecture à l'aveugle, tour 3 : @ux

Ouvert : aujourdhui 768 / zoom200 / habitué zoom200 / recherche ; parcours jour1, bonus, zoom200 ; carte-rafale notes (échec, confirmer), attente ; mes-questions zoom200 et « terminé » ; succes (375, 3 états, zoom200, 1280) ; mes-repliques (375, confirmer, terminé, modifier, soirée, zoom200) ; mission (375, bof, pas2, bilan, zoom200, 1280). **Non rouvertes ce tour : note enregistrée / supprimée, `sequence`, révision « Et toi ? », carte « Et toi ? » à 1280, mes-repliques vide, mes-questions retiré, 320 et 768 des nouvelles pages.** Ordre DOM et piège de focus : à confirmer au clavier (pas de source lue).

## Tour 2 : vérification
Corrigés et vus : `parcours-etat-jour1` (« Tu t'échauffes · cap 1 sur 5 », série à 0, « Commencer l'étape 1 »), capture bonus exploitable (« Tes bonus » à 24 px sous « Ton cap »), note `echec` (champ « [ta phrase] », 11 caractères) et `confirmer` (un seul « Supprimer » + « Annuler »), « Ton cap » sur une ligne à 200 %, « 5 min » sans collision, hero naturel à 768, fragment « thèque » disparu (« Bibliothèque » s'estompe), rafale en liste à 200 % (étiquette au-dessus du titre), `attente` (boutons grisés, « Prends ton temps » en texte), « [on] » retiré, semaine 1 « Parcours : facultatif cette semaine ».
Pas corrigé : débordement des étiquettes de boutons à 200 % (voir C4).

## Notes /10
| C1 | C2 | C3 | C4 | C5 | C6 |
|---|---|---|---|---|---|
| 9 | 10 | 9 | 9 | 9 | 9 |

## Pour chaque note < 10
**C1 (9)**
- **[Mes répliques et Mission, 375 et 1280]** aucune entrée de la barre n'est active et la barre n'est pas ramenée sur « Plus » (où vivent « Mon contenu » et « S'entraîner »). Contraire à 6.2 (active toujours ramenée dans la vue, `aria-current`). Correction : `aria-current="page"` sur « Plus » pour ces deux pages, défilement jusqu'à lui ; sur 1280, soulignement de « Plus ».
- **[Menu Plus ouvert, menu de compte]** aucune capture ; « Plus » est la porte de « Mes répliques » et des missions. À fournir au tour suivant.

**C3 (9)**
- **[Barre, 768 et 1280, tous écrans]** le chevron d'indice de suite s'affiche à droite alors que les six entrées tiennent (l'espace final ajouté en v5 rend la barre défilable). Faux indice. Correction : espace final et chevron seulement si `scrollWidth > clientWidth` sans cet espace.
- **[Aujourd'hui, recherche ouverte, 375]** le champ est vide, sans placeholder ni loupe visibles : un lecteur voit un rectangle muet. Correction : placeholder « Rechercher » [HYPOTHÈSE] et nom accessible, focus dans le champ, Échap ferme et rend le focus à la loupe (déjà annoncé, non vérifiable sur capture).
- **[Mes répliques, `modifier`]** la réplique s'affiche deux fois (citation et champ). Correction : masquer la citation pendant la modification.

**C4 (9)**
- **[Succès, 320 / 375 / 200 %]** la carte touche les bords de l'écran (marge 0, coins coupés) ; à 1280 elle est correcte. Correction : marge latérale de 16 px (8 px à 200 %).
- **[Mes questions et Mes répliques, 200 %]** « Retirer de mon historique », « Envoyer », « Modifier » : le texte (marqueur compris) touche ou dépasse le bord du bouton. Correction : `white-space: normal` sur le bouton **et** sur le marqueur, `min-width: 0`, padding 12 px ; recapturer avec `hyp=off` pour séparer l'artefact du défaut réel.

**C5 (9)**
- **[Mission, `bof`]** correct (3 sorties de 2.4) ; **[Bilan]** deux groupes de trois boutons de même poids (« Oui / À moitié / Rien » puis « Choix 1 à 3 ») sans hiérarchie. Correction : afficher la question de bilan seulement après le premier toucher, comme les répliques après « Tu avais une réponse ? ».
- **[Succès, `nonverifie`]** « Réessayer » (principal) et « Voir les parcours » : bon, mais rien n'annonce la fin de la vérification à un lecteur d'écran en passant de `verification` à `nonverifie`. Correction : `role="status"` conservé sur le conteneur, message mis à jour sans déplacer le focus.

**C6 (9)**
- **[Succès, `nonverifie`]** l'adresse « contact@deviens-marrant.fr » : 2.6 (l. 310) dit « questions vers alex@deviens-marrant.fr ». À confirmer contre `TEXTES_SUCCESS` ; sinon aligner. Les états `nonverifie` et `connexion` n'ont aucun marqueur (`hyp=off`) : la note doit dire quelles phrases viennent mot pour mot du code.
- **[Mission]** « Marche 2 sur 5 » côtoie « cap 3 sur 5 » (règle de voisinage de 3.0, pt 6) ; 2.4 donne « 5 marches » mais pas ce compteur. Correction : « Marche 2 » sans total, ou garder avec marqueur (il est déjà marqué [HYPOTHÈSE]).

## Verdict UX
Aucun blocage. Les points ci-dessus sont tous des corrections locales (CSS ou attribut) ; aucune ne rouvre une décision de la section 8.
