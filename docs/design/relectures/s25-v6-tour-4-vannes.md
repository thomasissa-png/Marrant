# Relecture DESIGN à l'aveugle, s25 navigation v6, tour 4, groupe « vannes »

Périmètre : `docs/captures/s25/v6-tour-4/vannes/` (visiteur, gratuit, en-cours, nouvel : 375, 768, 1280, 1456, 1920 ; 375, 768, 1280 et 1920 ouvertes, 1456 identique à 1280 par le plafond `max-w-7xl`) et `dediees/*vannes*` (fenêtre basse 375x480 et 1280x480, menu ouvert, « Plus » ouvert 1280x900). Aucune relecture existante lue.

## Constat visuel
- Hero centré (H1 + chapeau), rangée de filtres en pastilles, cartes `rounded-xl` à filet violet en haut, pastille de catégorie, bloc d'offre centré en bas de liste pour visiteur et gratuit, FAQ, texte éditorial, trois cartes « La suite », pied de page : la page parle la langue de l'accueil (filet, pastilles, rythme aéré, centrage des titres).
- 1280, 1456, 1920 : coque 1216 centrée, aucun vide à droite, aucune colonne collée à gauche ; deux colonnes de cartes alignées, hauteurs égales par rangée, pied d'action à la même place d'une carte à l'autre.
- 768 : deux colonnes, bande et chips défilent (coupe franche « Éco » sans chevron, normal sous 1024 px selon le code : chevrons dès 1024). 375 : une colonne, H1 sur 3 lignes, chips défilent avec coupe franche signalant le défilement, aucun débordement.
- Cibles tactiles : favoris et partage = bouton `h-11 w-11` (44 px) pour une pastille visible de 32 px (`favorite-button.tsx`), « Révéler la chute » `min-h-11`, pagination en cellules 44 px (`list-pagination.tsx`). Pas de faute.
- Visiteur et gratuit : 10 vannes puis un seul bouton plein (« Ouvrir la suite des vannes · 1,99 €/mois »), pas de pagination, pas de mur : conforme à la décision du 14/11. En-cours et nouvel : 12 cartes, pagination 1 à 8, pas d'offre : cohérent.
- Dédiées : fenêtre basse, la bande est masquée et ses rubriques passent dans le menu (cadenas pour visiteur et gratuit, aucun pour en-cours et nouvel, Vannes allumée, ordre identique). « Plus » ouvert : deux lignes de 44 px, cadenas visiteur et gratuit, aucun pour abonnés, filet violet cohérent avec les cartes. La liste recouvre la fin du H1 : c'est une surcouche normale, pas un défaut.

## Notes
| Critère | Note | Justification |
|---|---|---|
| Design 1 Fidélité à l'accueil | 9 | Filet, pastilles, centrage, rythme conformes. Le hero n'a pas de pastille d'accroche comme l'accueil, mais la page de liste n'en a pas besoin (pas de faute). |
| Design 2 Hiérarchie, lisibilité | 9 | H1 puis chapeau puis filtres puis cartes ; texte des cartes bien lisible, textes secondaires AA. |
| Design 3 Mise en page 5 largeurs | 10 | Rien ne déborde, aucun vide, coque identique à 1280, 1456, 1920. |
| Design 4 Cohérence espace | 9 | Cartes, titres, bloc d'offre et filets identiques aux autres listes. |
| Design 5 Finition | 9 | Alignements propres, cibles 44 px vérifiées dans le code. Un détail : le chevron de défilement recouvre la pastille « Abs… » à 1280 (comportement voulu). |
| UX 1 Compréhension | 9 | Titre explicite, geste « Révéler la chute » évident. |
| UX 2 Action principale | 9 | Une seule offre pleine par page (en tête : bouton d'offre de l'en-tête, en pied de liste : bouton du bloc) pour visiteur et gratuit. |
| UX 3 États vides, nouvel | 9 | Aucun état vide propre à cette page ; « nouvel » identique à « en-cours », pas de page morte. |
| UX 4 Aperçu Premium | 9 | La page est gratuite : valeur visible (10 vannes), une seule offre, pas de mur. |
| UX 5 Accessibilité, cohérence comptes | 9 | Menu fenêtre basse, cadenas et page allumée cohérents entre comptes. |

## Pistes (ne retiennent pas la note)
1. Abonné, « Toutes », page 1 : onze cartes sur douze portent « Boulot & Collègues » (`en-cours-vannes-1280.png`). Tri du catalogue plutôt que mise en page : mélanger les catégories ferait sentir la variété du filtre « Toutes » (à voir côté tri de `/api/jokes`, pas de fichier de design).
2. Chevron de défilement qui coupe la dernière pastille à 1280 (`components/vannes/rangee-defilante.tsx`) : élargir le fondu pour que la coupe se lise comme voulue. Subjectif, existant conforme.
3. Gratuit, pied de bloc d'offre : le lien « Tester l'étape 1 de Répartie, gratuite » est un second appel, discret (lien souligné), acceptable ; hors aperçu, la règle « pas de second appel » ne s'applique pas.

Aucune faute dure.

NOTE GLOBALE : 9/10
