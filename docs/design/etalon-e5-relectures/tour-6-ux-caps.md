# E5 v8.1, caps et bonus : confirmation @ux (tour 6)

Ouvert : `bonus-etat-neutre-375`, `bonus-cap-3-375-zoom200`, `parcours-passage-cap-bonus-cap-2-375-zoom200`, `bonus-cap-5-375` ; source `parcours.html` l. 172 à 177 et 287 à 317 (script de l'annonce).

## Mes trois points du tour 5
1. **Page neutre : confirmé.** La capture montre la 404 du site (« Oups, cette page a oublié sa punchline », « Cette page n'existe pas, ou plus. », « Retour à l'accueil », « Voir les vannes »), en-tête et barre présents, **aucune entrée de barre active** : la page ne se distingue plus d'une adresse inexistante (5.4, critère 19).
2. **Annonce : confirmé au source.** Les phrases seules sont dans `aria-live="polite"` (l. 176, 310) ; « Ouvrir » et « Fermer » sont dans un groupe voisin `role="group"` (l. 177, 311) ; noms accessibles « Ouvrir le bonus : {titre} » et « Fermer l'annonce » (contiennent le libellé visible, 2.5.3) ; « Fermer » vide l'annonce et rend le focus à « Reprendre » (l. 313). À 200 %, boutons pleine largeur, « Ton cap » sur une ligne, « Tes bonus » à la suite, aucun débordement.
3. **« Fait » : vu sur les captures 200 % et cap 5** en contour (état coché non capturé, `aria-pressed` au source ; coche et contour de 2 px annoncés par le designer, à voir si une capture « pressé » est faite).
Nouveau et conforme : fiche du cap 5 rendue (« Comment la maison a choisi une réplique », « Pourquoi les autres ont été écartées », « Geste à faire », tout en crochets, « 5 min · Facultatif [HYPOTHÈSE] »), « Tes bonus » mène au dernier bonus ouvert (cap 5 compris), la Bibliothèque garde le cap de l'abonné.

## Notes /10
| C1 | C2 | C3 | C4 | C5 | C6 |
|---|---|---|---|---|---|
| 9 | 10 | 10 | 10 | 10 | 10 |

## Pour la seule note < 10
**C1 (9) : [Bonus, page neutre, 375]** le texte de l'écran (« Oups, cette page a oublié sa punchline ») et ses deux sorties (« Retour à l'accueil », « Voir les vannes ») ne sont pas ceux écrits en 5.5 et 3.13 (« Cette page n'est pas disponible », liens « Aujourd'hui » et « Bibliothèque »). L'identité avec la 404 réelle est la bonne règle (même réponse qu'une adresse inexistante) ; c'est le texte de l'architecture qui est à aligner. Correction : @creative-strategy remplace dans 5.5, 3.13 et `niveaux-xp-s24.md` 5.4 le titre et les liens par ceux de la 404 réelle (« la page neutre est la 404 du site »). Les « Voir les vannes » restent un lien sortant du catalogue, sans rien dire du bonus. L'émoji de la 404 est celui du site existant : à garder tel quel, la règle « aucun émoji » vise les écrans neufs de l'espace.

## Verdict
**GO** pour les écrans caps et bonus : aucune règle de 5.4 n'est violée, aucune correction de design restante. Reste une phrase d'architecture à aligner (C1).
