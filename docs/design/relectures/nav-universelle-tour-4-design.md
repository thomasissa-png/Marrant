# Relecture design à l'aveugle, tour 4 : navigation universelle s24 (v4)

Note : 9/10. La hiérarchie du menu et le recalcul tiennent. Une faute dure nouvelle, née de la correction du doublon.

## Vérifications

| Point | Statut | Détail |
|---|---|---|
| Hiérarchie du menu abonné | Corrigée (sauf cas ci-dessous) | « Mon espace » en `font-semibold text-text-primary`, 8 entrées `ml-3 border-l border-border pl-6 text-text-secondary` (retrait de 36 px, filet), `border-t` avant Parcours : trois niveaux lisibles, hauteur inchangée |
| Recalcul 529 px | Juste | 65 + 16 + 52 + 44 + 8 x 44 (352) = 529 ; 667 - 529 = 138 ; 568 - 529 = 39. Avec le séparateur de 1 px : 530 et 38 libres (le §1 l'omet alors que le critère 5 dit « séparateur compris ») |
| Largeurs, 320 à 1280 | Inchangées | tour 3 : plus serré 640 px, 12 px libres |

## Faute dure (1)

1. Entrées orphelines de 768 à 1023 px (-1). `md:hidden` sur la ligne « Mon espace » laisse les 8 entrées indentées (`ml-3 border-l pl-6`) en tête du panneau, sous aucun titre : le filet et le retrait annoncent un parent qui n'existe pas, et la recherche n'est plus là (elle n'est en tête que sous 440 px). Correction : garder la ligne à toutes les largeurs mais, de 768 à 1023 px, en faire un intitulé non cliquable (`md:max-lg:pointer-events-none md:max-lg:text-sm md:max-lg:font-semibold md:max-lg:text-text-muted`, sans `href` à ce rendu, ou `<p>` en `hidden md:block lg:hidden`), plus de lien dupliqué (critère 3 tenu) et un parent visible pour l'indentation.

## Pistes

- Le titre du document dit encore « v3 » : le passer en « v4 ».
- Séparateur : écrire 530 px (et 38 px libres à 568) au §1, sinon un testeur trouvera 1 px d'écart.
- À 568 px de haut, Parcours (premier lien d'achat) démarre à 530 et sort de la fenêtre (574 > 568) : à 667 il reste visible, 3 liens du site sur 5 ; acceptable, la conversion passe par le bouton « Premium » ? Pas pour l'abonné, donc sans enjeu.
- Aujourd'hui à 1280 : deux colonnes en haut, trois en dessous (`xl:grid-cols-3`) : les gouttières ne s'alignent pas d'une rangée à l'autre. Acceptable si les rangées sont séparées par `space-y-12` et un `h2` ; à vérifier sur capture (critère 14 le couvre à 768 seulement : l'étendre à 1280).
- Mode clair toujours à confirmer.
