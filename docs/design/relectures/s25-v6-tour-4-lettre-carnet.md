# Relecture DESIGN à l'aveugle, s25 navigation v6, tour 4, groupe lettre-carnet

Périmètre : `lettre/` (visiteur, gratuit, en-cours, nouvel ; /lettre et /mon-espace/lettres), `carnet/` (visiteur, gratuit, en-cours, nouvel, tranches 375 et 1280 échantillonnées : 1-2-3-7-13 à 1280, 1-2-18 à 375), `dediees/*mon-espace-lettres*` (375 et 1280, visiteur et gratuit). Captures : `docs/captures/s25/v6-tour-4/`. Étalon : accueil 1280 (thème sombre, cartes `rounded-xl` à filet violet, titres centrés).
Code lu pour vérifier : `components/carnet/carnet-page.tsx`, `components/lettre/lettre-inscription.tsx`, `components/lettre/lettres-abonne-cartes.tsx`.

## Constats visuels par page

- **/lettre visiteur et gratuit** (375, 768, 1280, 1456, 1920) : H1 centré « Une situation, trois répliques, chaque mois » + sous-titre, carte formulaire à filet violet (768 px centrés), séparateur, libellé « À quoi ça ressemble : le dernier numéro », carte-exemple à filet. Chip « La lettre » allumé. Un seul bouton plein (« Envoie-moi la lettre », 47 px de haut à 1280). Case à cocher de 24 px dans un label `min-h-11` (code l.242-256), champ `h-12` : cibles conformes. Aucun vide à droite, aucun débordement à 375. Le gratuit a l'e-mail pré-rempli, le visiteur voit le placeholder : cohérent.
- **/lettre abonné (en-cours et nouvel, identiques)** : H1 « La lettre » centré, deux cartes à filet avec chevron, 2 colonnes dès 640 (cartes 376 px à 1280, centrées dans 768). Pas de page morte : l'archive contient 2 lettres même pour le nouvel abonné. Pas de vide à droite à 1280 et 1920 (colonne centrée comme les autres pages de l'espace). L'espace sous les cartes (≈110 px à 1280 avant le pied de page) est raisonnable.
- **/mon-espace/lettres** : rendu strictement identique à /lettre pour les 4 comptes (redirection OK), la bande allume « La lettre ». Dédiées 375x812 et 1280x900 : pli propre, H1 et formulaire visibles dès l'ouverture.
- **/carnet visiteur et gratuit** : aperçu Premium exemplaire : sur-titre, H1 centré, fiche offerte lisible en entier (blocs « On te dit » et « Tu réponds » bien différenciés), carte d'offre à filet avec un seul bouton plein + réassurance, « Au programme » (3 fiches à cadenas, « Et 26 autres répliques »). Colonne 768 centrée à 1280 et 1920, 375 sans débordement. Aucun mur, aucune redirection.
- **/carnet en-cours et nouvel (identiques)** : sommaire des 30 situations en 2 colonnes (1 colonne à 375), liens soulignés, cibles `min-h-11` (code l.84 et 89, donc 44 px : pas de faute), puis 30 fiches à filet, puis « Les carnets précédents » en fin de page. Cohérent avec l'étalon et avec les autres pages de l'espace. Le nouvel abonné voit le carnet complet : pas d'état vide à prévoir.

## Défauts relevés

1. **Sommaire du carnet : désalignement des liens entre 1-9 et 10-30** (`en-cours-carnet-1280-tranche-1.png`, `nouvel-carnet-1280-tranche-1.png`, `en-cours-carnet-375-tranche-1.png`). Le numéro est un `<span>` de largeur naturelle : le texte des liens 1 à 9 démarre à x=277 et celui des liens 10 à 30 à x=286 (colonne 1 à 1280), idem en colonne 2 (673 contre 682) et à 375 (x=37 contre 46). Défaut de finition visible sans zoom, pas bloquant. Correction : `components/carnet/carnet-page.tsx` ligne 84, donner une largeur fixe au numéro, par exemple ajouter `min-w-[2.5ch] justify-end` (ou `w-7`) à la classe `inline-flex min-h-11 items-center tabular-nums`. Ce qui ferait 10 : tous les titres alignés sur une même verticale.
2. **Apostrophes droites dans les cartes de l'archive de la lettre** (`en-cours-lettre-1280.png` : « Après l'exposé », « t'as perdu »), alors que le reste de la page (pied de page « d’une vanne », sous-titre « t’entraîner ») utilise l'apostrophe typographique. Le corps de l'e-mail d'exemple (`visiteur-lettre-1280.png`) a la même incohérence (« n'as », « t'as »). Correction pour les cartes : `components/lettre/lettres-abonne-cartes.tsx` lignes 60-61, passer `l.titre` et `l.objet` dans `frTypo()` (déjà importé ailleurs, `@/lib/fr-typo`). Le corps de l'e-mail relève du contenu (hors périmètre, signalé seulement). Finition, pas bloquant.

## Pistes (ne retiennent pas la note)

- Carnet abonné : page de ≈25 800 px (≈35 400 px à 375) sans retour au sommaire depuis une fiche profonde. Un lien « Sommaire » en haut de chaque fiche ou un bouton de retour flottant aiderait. Texte nouveau : à valider par Thomas. La spec de l'ancre existante est conforme.
- Lettre, aperçu de l'exemple : le paragraphe d'ouverture se coupe sur une ligne courte (« a fini par / le remarquer : ») parce que le texte source porte un retour à la ligne forcé. Contenu : à signaler, pas à réécrire.
- Archive de la lettre côté abonné : rien ne dit si la lettre arrive aussi par e-mail pour lui. Texte nouveau : à valider par Thomas.

## Notes (/10)

| Critère | Note | Justification |
|---|---|---|
| Design 1 fidélité à l'accueil | 10 | Filets violets, titres centrés, cartes `rounded-xl`, sur-titre en capitales violettes, sombre : même langue que l'étalon |
| Design 2 hiérarchie et lisibilité | 10 | Un seul plein par page, blocs « On te dit » / « Tu réponds » nets, contrastes lisibles sur fond sombre |
| Design 3 mise en page aux 5 largeurs | 10 | Colonne centrée `max-w-3xl` aux 3 grandes largeurs, aucun débordement à 375 et 768, aucun vide à droite |
| Design 4 cohérence espace | 10 | Mêmes colonne, rythme, cartes et titres entre lettre, carnet et aperçus |
| Design 5 finition au pixel | 9 | Sommaire désaligné (défaut 1), apostrophes droites (défaut 2) ; cibles 44 px vérifiées au code |
| UX 1 compréhension | 10 | Chip allumé, H1 explicite, sur-titre « Carnet de novembre · 30 situations » |
| UX 2 action principale | 10 | « Envoie-moi la lettre » seule action de /lettre visiteur ; « Ouvrir tout le carnet » seule offre du carnet (hors bouton d'en-tête) |
| UX 3 états vides et nouvel abonné | 10 | Archive de lettres et carnet pleins pour le nouvel abonné, jamais de page morte |
| UX 4 aperçu Premium | 10 | Fiche réelle lisible, une seule offre, programme verrouillé sans mur |
| UX 5 accessibilité et cohérence entre comptes | 10 | Cibles `min-h-11`, label cliquable, soulignements permanents, rendus cohérents pour les 4 comptes |

Faute dure : aucune.

NOTE GLOBALE : 9/10
