# Relecture visuelle à l'aveugle, captures nav s24, tour 2 (design)

Vu à l'image (dossier `s24-nav-universelle-2/`) : 1280 abonné (Aujourd'hui, Quoi répondre, Bibliothèque, Mes questions, S'entraîner, Répliques, Lettres, Favoris, Carnet, Profil, Parcours, Vannes, fiche humour noir), accueil gratuit 1280, 375 (Aujourd'hui, Favoris, menu gratuit), 768 (Bibliothèque). Je n'ai pas relu l'INDEX.

## Note globale : 7,5 / 10 (tour 1 : 6,5)
En-tête et menus restent parfaits (gratuit : Premium + Favoris + Profil + Déconnexion, propre). Le contenu a nettement progressé ; il reste de l'harmonie entre pages à régler (hauteur du titre, largeurs).

## Mes 9 fautes du tour 1, vérifiées à l'image
1. Bibliothèque : CORRIGÉE (2 colonnes de 3 blocs, 1 405 / 1 537 px de haut, plus de trou ; propre aussi à 768).
2. S'entraîner : CORRIGÉE (Marche 3 pleine largeur ; reste ~110 px vides sous la carte « Boulot », tolérable).
3. Favoris : CORRIGÉE (3 colonnes alignées en haut ; à 375, marges haut identiques).
4. Pages vides : PARTIELLE. Bande noire sous le pied : supprimée. Mais voir F3 ci-dessous.
5. Cartes du jour : CORRIGÉE sur Aujourd'hui (extrait + vignette, Mission en carte). NON corrigée sur l'accueil visiteur et gratuit : « Vanne du jour » garde ~180 px de vide entre le bouton et le pied de carte (`inscrit-gratuit-accueil-1280.png`).
6. Largeurs : NON corrigée (F2).
7. Hauteur du haut de page : PARTIELLE (F1).
8. Carnet : CORRIGÉE (texte lisible, blocs aérés, « Tu réponds » mis en valeur).
9. Filtres Vannes : CORRIGÉE (dégradé de fondu à droite, plus de mot coupé net).

## Fautes dures (bloquent le 10)

F1. **Hauteur du H1 encore incohérente.** Mesuré au centre du titre : Aujourd'hui, Quoi répondre, Mes questions, S'entraîner, Lettres, Répliques, Bibliothèque = 162 px (le 141 haut du texte, bon). Mais Favoris et Profil = 118 px (titre 44 px plus haut, collé au header), Vannes = 152 px, Carnet = 181 px. En passant d'une page à l'autre le titre saute. Corriger : une seule enveloppe `pt-12` sur `main` + ligne réservée `h-6 mb-1` pour Retour/fil d'Ariane (vide quand il n'y en a pas) : ajouter `<div className="h-6 mb-1" />` sur Favoris et Profil, la mettre sur Vannes (fil `text-sm` dans le `h-6`), et sur Carnet supprimer le kicker + fil au-dessus du H1 (kicker sous le titre).
F2. **Largeurs toujours en deux mondes.** Pleine largeur 1 216 px : Aujourd'hui, Vannes, Profil, Favoris, Quoi répondre, Répliques. Colonne de 768 : Carnet, fiches, Parcours (x=256) ; Lettres : carte de 672 px centrée sous un H1 collé à gauche (`lettres-1280.png`, x=304 contre x=32). Corriger : règle écrite et appliquée : tableaux/listes `mx-auto max-w-screen-xl px-4 md:px-6 xl:px-8` ; lecture `mx-auto max-w-3xl` AVEC le H1 et le Retour dans le même conteneur (jamais un titre à gauche et une carte centrée). Lettres : carte `max-w-3xl` sans `mx-auto`, ou H1 dans le même `max-w-3xl`.
F3. **États vides pas finis.** Répliques : une carte pleine largeur à une phrase, puis ~480 px de noir avant le pied. Humour noir : pas de H1, carte flottante de 768 px au-dessus de ~550 px de noir. Lettres : idem, 520 px vides. Le pied collé en bas fait ressortir le trou. Corriger : carte d'état vide `max-w-3xl p-8` alignée à gauche avec H1 (Humour noir : `<h1 className="font-display text-4xl">Humour noir</h1>` et la carte en dessous), et réserver le vide par une phrase + lien utile en `mt-6` ; retirer `min-h` du `main` pour que le pied suive la carte (`min-h-[60dvh]` suffit).
F4. **Parcours (abonné) sans titre de page.** `abonne-en-cours-parcours-1280.png` : la page commence par la carte « Tes 4 premières semaines » à 76 px du header, aucun H1, aucun fil. Hiérarchie des titres rompue (tour 1 : « Parcours humour » existait en visiteur). Corriger : H1 `font-display text-4xl font-bold` + ligne `h-6 mb-1` comme F1, carte en `mt-8`.
F5. **Accueil visiteur/gratuit : carte « Vanne du jour » à moitié vide** (180 px de noir). Corriger : pied de carte en `mt-auto`, hauteur de carte `lg:self-start`, ou ajouter la chute en aperçu ; pas de `h-full` sur les trois cartes.

## Pistes (n'empêchent pas le 10)
- Aujourd'hui : bas des 3 cartes du jour inégal (1 150 / 1 068 / 1 168 px) ; `items-stretch` donnerait un alignement net.
- Profil : 9 cartes pleine largeur, textes `text-xs` (lettre, suppression) à passer en `text-sm`, carte « Ta question » `py-6` → `py-4`, stats `max-w-3xl`.
- Mes questions : « Mes envois » à 236 px, carte de gauche à 221 px (aligner avec `items-start` et `pt-0`).
- Quoi répondre : groupes par situation lisibles ; la 2e rangée de 2 filtres orphelins reste.
- S'entraîner : texte de la carte Marche sur 140 caractères (`max-w-prose`).
- Favoris 375 : onglet « Vidéos » coupé (« Vi ») avec chevron ; acceptable, fondu à ajouter.

## Notes par page (1280 sauf mention)
Aujourd'hui 8 · Quoi répondre 8 · Bibliothèque 9 · Mes questions 7 · S'entraîner 8 · Répliques 5 · Lettres 5 · Fiche humour noir 4 · Favoris 7 · Carnet 7 · Profil 6 · Parcours abonné 6 · Vannes 8 · Accueil gratuit 7 · Menus mobiles 9 · 375 Aujourd'hui/Favoris 9.
