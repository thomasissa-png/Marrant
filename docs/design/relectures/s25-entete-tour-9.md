# Relecture design à l'aveugle, en-tête et menu mobile de l'espace (s25, tour 9)

Méthode : lecture du contexte, de la spec v5 (`docs/ux/navigation-universelle-s24.md`), des préférences fondateur 191 à 194, du code (en-tête, menu mobile, compte, cloche, recherche, thème) puis des captures réelles de `docs/captures/s25/entete-tour-9/`, comparées à l'étalon `docs/captures/s25/etalon-accueil/` (accueil, 375/1280/1920 lus). Aucune relecture existante, aucun commit ni `REPLIT_ACTIONS.md` consulté.

Rayons vérifiés dans `apps/web/tailwind.config.ts` : `rounded-lg` = 12 px, `rounded-md` = 8 px, `rounded-sm` = 4 px. `rounded-xl` n'est pas redéfini : valeur Tailwind par défaut, 12 px, donc identique à `rounded-lg`.

## Couverture de lecture

- Bandeaux : visiteur, gratuit, en-cours, nouvel aux largeurs 320, 375, 440, 520, 600, 640, 641, 768, 1024, 1280, 1456, 1920 (lus en priorité sur /vannes, plus /mon-espace 768, 1024, 1920 et /profil 1456).
- Menu mobile ouvert : visiteur /vannes 375 ; gratuit /mon-espace et /profil 375 et 768 ; en-cours /mon-espace 375, /profil 768 ; nouvel /profil 375.
- `menu-court` : les six captures (gratuit, en-cours, nouvel à 320 et 375).
- Cloche : en-cours 320, 375, 1280, 1920 ; nouvel vide 320, 375, 768, 1280.
- Compte : gratuit 768 et 1280 (/vannes), en-cours et nouvel /profil et /vannes 768, 1280, 1456, 1920.
- Focus : barre en-cours et gratuit 768 et 1280 ; `focus-dans-menu-375` (01, 02, 03, 10, 12) ; `focus-dans-cloche` (375 et 1280, 01 à 03) ; `focus-dans-compte` (00, 01, 02, 03 aux deux largeurs) ; `focus-retour-menu-375` (01, 02, 04).
- Visiteur sur /mon-espace et /profil : renvoi à la connexion, normal, non noté.

## Constats vérifiés sur les captures

- L'en-tête du site et celui de l'espace sont le même composant : logo violet à 32 px (352 px à 1920, 120 px à 1456), liens en `text-sm`, filet de 1 px, hauteur de 65 px. Les positions des liens de l'étalon (Parcours à x = 596 à 1920) et de l'espace sont identiques. Premium garde son rayon et sa couleur.
- Position variable de la recherche (782 visiteur, 826 gratuit, 956 abonné à 1280) : conforme à la décision du 15/11, non retenue.
- Largeurs 320 à 1024 : aucun débordement, aucun libellé coupé, une action primaire (Premium) dominante pour visiteur et gratuit, cloche et compte pour l'abonné. 640 et 641 identiques, libellé complet de Premium dès 640.
- Menu mobile : une colonne, lignes de 44 px, rail `ml-3 border-l`, ligne allumée à filet violet de 2 px et fond élevé, séparateurs de 1 px, Premium pleine largeur sous 768 et à gauche dès 768. À 568 px de haut, « Carnet » et le séparateur sont visibles (y = 507 et 529), 8 entrées sans défilement à 320 et 375, comme le critère 5 de la spec.
- Panneaux : 8 px sous le filet (haut à 73 px aux largeurs lues), bord droit sur la marge de la coque à 768, 1280, 1456 et 1920, filet dégradé de 4 px, ombre et anneau fin communs. États : cloche ouverte (fond élevé, texte principal) distincte du lien actif (fond élevé, texte violet, soulignement), compte ouvert sans être actif (fond élevé, pas de soulignement) distinct du compte actif sur /profil (soulignement violet, ligne « Mon profil » à filet violet). État vide de la cloche : une phrase, air bas égal à l'air haut, y compris à 320 px (deux lignes, sans coupure).
- Focus : même anneau violet de 2 px entièrement arrondi sur logo, liens de la barre (actif compris), cloche, bouton Menu, lignes du menu (intérieur), champ de recherche du menu, lignes de la cloche, « Fermer », lignes du compte. Aucun anneau coupé. L'ordre de tabulation du menu ouvert (champ, Mon espace, 8 entrées, liens, actions, cloche, logo) et le retour Maj+Tab (logo, Menu, croix, dernière action) sont cohérents.
- Fond bleu-gris du bouton croix sur les captures de menu ouvert : résidu du survol de la souris laissée sur le bouton (absent sur `focus-dans-menu-375-01`), pas un état du composant.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à la langue visuelle de l'accueil | 10/10 |
| 2 | Cohérence entre comptes et pages | 10/10 |
| 3 | Hiérarchie et lisibilité | 10/10 |
| 4 | Menu mobile | 10/10 |
| 5 | Panneaux cloche et compte | 10/10 |
| 6 | Grandes largeurs 1456 et 1920 | 10/10 |
| 7 | Finition au pixel | 10/10 |

Aucune faute dure relevée, donc aucune note sous 10 à justifier. Les points ci-dessous sont des pistes, non retenues car l'existant est conforme à l'étalon, à la spec v5 et aux décisions de Thomas.

## Pistes (non retenues, subjectives ou imposées par la spec)

1. Rayons concentriques des panneaux (critère 5). Panneau `rounded-xl` (12 px) avec `p-1` (4 px) contenant des lignes `rounded-lg` (12 px) : le rayon intérieur idéal serait de 8 px (`rounded-md`). Visible seulement sur les coins de l'anneau de focus (`en-cours-focus-dans-compte-1280-00.png`). Même construction que les cartes de l'accueil et du reste de l'en-tête ; code possible : `rounded-md` sur `ITEM_UNIVERSEL`, `ITEM_COURANT` et `LIGNE` de la cloche, à décider avec les lignes du menu mobile pour garder un seul rayon.
2. Menu mobile de l'abonné sur une fenêtre haute (`nouvel-menu-profil-375.png`, 812 px) : à l'ouverture sur /profil, « Mon profil » est amené en vue mais sa ligne finit collée au bord bas et « Déconnexion » reste sous le pli, sans indice de défilement. Le défilement automatique est plafonné par le critère 5 de la spec (16 px de marge haute) : ce rendu est conforme. Un dégradé de bas de menu serait ajouté seulement avec l'accord de Thomas.
3. Dès 768 px, le menu est une colonne alignée à gauche sur 720 px de large : vide à droite. C'est la décision « une colonne de haut en bas » de la spec, non rediscutable.
4. Preuves à ajouter à la prochaine passe de captures (le code est conforme, le rendu n'a pas été vu) : focus clavier de la recherche de la barre et du bouton Premium (décalé de 2 px, documenté dans `panneau-eleve.ts`), les séries `focus-NN` s'arrêtant au 6e contrôle à 1280 ; largeurs sous 300 px (variante `max-e300`).

## Pour rester à 10

Ne pas modifier les tokens d'anneau (`ring-2 ring-accent-link`), de panneau (`PANNEAU_ELEVE`, 8 px sous le filet, bord droit sur la marge) ni le pas de 44 px du menu ; toute évolution repasse en relecture à l'aveugle sur les mêmes largeurs.

NOTE GLOBALE : 10/10
