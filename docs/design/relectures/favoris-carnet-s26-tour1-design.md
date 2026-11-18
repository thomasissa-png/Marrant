# Relecture DESIGN à l'aveugle, tour 1 (s26) : Favoris et Carnet

Captures : `docs/captures/s26/encarts-favoris-carnet-tour-1/{favoris,carnet}/`. Ouvertes : 375, 1280, 1920 des 4 comptes de Favoris ; Carnet visiteur 375/1280/1920, gratuit 375/1280, abonné (en-cours 375/1280/1920) en pleine page seulement.
Limite de preuve : les captures Carnet abonné sont des pages entières (1280 x 21 663 ; 375 x 40 225), illisibles une fois réduites. Je ne vois que la structure (sommaire en 3 colonnes, puis rail 3 + fiches 9). Alignements, vides et cibles du sommaire et des fiches ne sont pas vérifiés sur pixels : à recapturer en fenêtre (premier écran + un écran de fiche).

## Gate typographique (TAILLES.md, cité)
Favoris : visiteur et gratuit 4 tailles / 6 combinaisons aux 4 largeurs ; en-cours 4 tailles (30 ou 24, 20, 16, 14) / 6 combinaisons ; nouvel 3 tailles / 5 combinaisons. Limites 4 / 6 : PASS (6 = au plafond, sans marge).
Carnet : visiteur et gratuit 375/768 : 4 tailles / 5 comb. ; 1280/1920 : 4 tailles / 6 comb. ; en-cours et nouvel : 3 tailles / 4 comb. PASS.
Échelle 14/16/20/24-30, graisses 400/600 : respectée. Un seul aplat violet par écran au premier écran : PASS partout (hero visiteur/gratuit ; « Explorer les vannes » seul chez le nouvel ; aucun aplat chez l'en-cours).

## FAVORIS

### Visiteur et gratuit (aperçu)
Points forts : titre blanc, hero 8/4 avec l'offre en haut (bouton y = 203 à 1280, ~348 à 375), extrait 5/7 sur 12 colonnes, fermé lisible (verrous, tuile Vidéo estompée), page 1 604 px à 1280 (< 2 000). Visiteur et gratuit identiques sauf la ligne « Premium ouvre tout » : cohérent. Bouton de fin à y = 964 (> 900), 1 050 x 1,26 (> 812).
Défauts :
- Pastilles Tout / Vannes / Conseils / Vidéos : ressemblent à des onglets actifs alors qu'elles sont inertes (même gris que les cartes). Piste, pas faute.
- Carte Vanne à 375 : texte renvoyé à la ligne à ~190 px sur 300 (réserve du verrou), bord droit irrégulier. Cosmétique.
- Tuile Vidéo : deux barres grises seulement ; lisible comme fermée, mais pauvre à 1920 (1 216 px de large pour ~120 px de contenu). Piste.
- 1920 : le bloc de fin (446 px) est seul au centre sous un contenu de 1 216 px (objet Premium (b), déjà connu : non noté).
Critères : 1 élégance 9 ; 2 hiérarchie 9 ; 3 largeur 8 ; 4 cohérence 9 ; 5 finition 9.

### En-cours (abonné, 3 favoris) et nouvel (vide)
Points forts : rail 3 + liste 9 propre, filet blanc actif, effectifs alignés à droite, première carte teintée (CARTE_ACTION) avec chute visible, états vides sans emoji de décor, bouton plein unique chez le nouvel, rangée défilante à 375 avec chevron.
Défauts :
- **Vide de 73 px au milieu de la carte « Vanne / Mes amis adorent venir dîner chez moi » (en-cours 1280 et 1920)** : « Clique pour la chute » finit à y = 715, le séparateur est à y = 793, la carte étant étirée à la hauteur de sa voisine (Conseil). Dépasse 32 px à l'intérieur du bloc (haut + pied). Faute dure chiffrable. Correction : `favoris-list.tsx`, grille de cartes en `lg:items-start` (cartes à hauteur propre) ou pied sans `mt-auto`, jamais en grossissant un texte.
- « Partager » est une pastille icône seule (32 px visible, zone 44 px confirmée dans `share-button.tsx`), alors que la spec demande un lien `META` souligné « Partager » ; pastille décalée de ~4 px à gauche de la colonne de texte (cercle à x = 363, texte à x = 367). Piste : passer le libellé en texte `META underline` comme « Retirer » (labels > icônes) ou rattraper l'alignement par `-ml-1` inverse.
- Réactions : emoji 🔥 et 💀 (la spec §5.7 dit « zéro emoji », la spec §2.3 dit « ReactionButtons inchangés » : contradiction de spec, à arbitrer ; pas classé faute).
- 375 : rangée d'onglets coupée après « Conseils » (Vidéos hors champ, chevron seul) : acceptable, piste = effectif collé au libellé.
- Nouvel : rail à quatre « 0 » le premier jour : correct mais lourd à côté d'une carte vide ; vide de fin de colonne permis. Piste : rien à changer côté design, le rail reste utile.
Critères : 1 élégance 9 ; 2 hiérarchie 9 ; 3 largeur 8 (vide 73 px) ; 4 cohérence 9 ; 5 finition 8 (pastille Partager, vide de carte).

Pistes (3) : 1. cartes à hauteur propre (`lg:items-start`) ; 2. « Partager » en lien texte aligné ; 3. pastilles de l'aperçu rendues visiblement inertes (texte `META` sans fond) ou retirées au premier écran.

NOTE GLOBALE Favoris : 8/10

## CARNET

### Visiteur et gratuit
Points forts : titre blanc, hero 8/4, tuile Programme à 4 colonnes avec verrous, fiche offerte en deux colonnes 8/12, premier écran 1280 : bouton y = 203 (< 450), 375 : y ≈ 330 (< 700), bouton de fin y = 1 172 / ~2 100 (> 900 / > 812) : un seul plein visible au premier écran. 375 : ordre offre, programme, fiche, bien hiérarchisé. 1920 identique à 1280 (conteneur 1 216 px) : cohérent avec Favoris.
Défauts (hors « déjà en correction » : fin d'extrait, « 1 500+ » dans la carte, vide à gauche du hero) :
- Le kicker « Carnet de novembre 2026, 30 situations » répète le H1 « Carnet de novembre » juste dessous : redondance de texte à signaler (pas réécrite).
- Sous la tuile Programme (visiteur y 821 à 1 236, gratuit y 810 à 1 225), la colonne de 4 est vide sur ~400 px à côté de la fin d'extrait : vide de fin de colonne, permis, et la tuile est sticky en usage réel. Piste : mettre la preuve ou l'objet Premium dans cette colonne (déjà dans la correction en cours).
- Colonne gauche de la fiche : contenu fini à y = 955, colonne droite à 1 030 (~75 px) : fin de colonne, permis. Colonne gauche sans sous-titre alors que la droite en a trois : léger déséquilibre, piste (étiquette « Le contexte » en `TEXTE_FORT`, texte neuf donc à valider).
- Visiteur vs gratuit : l'ordre « 1 500+ » / « Connexion » change dans la carte (cohérent avec le compte, non fautif).
Critères : 1 élégance 9 ; 2 hiérarchie 9 ; 3 largeur 8 ; 4 cohérence 9 ; 5 finition 9.

### Abonné (en-cours, nouvel)
Structure vue : sommaire en 3 colonnes de tuiles (1280), rail sticky 3 + fiches 9, 30 fiches ; aucun aplat violet ; tailles : 3 / 4 comb. Identique entre en-cours et nouvel (TAILLES.md égal) : cohérent. Alignements, hauteur des tuiles (>= 44 px), filet blanc de la première fiche, « Retour au sommaire » : non vérifiables sur ces captures (voir limite). Aucune faute dure démontrable.
Critères : 1 9 ; 2 9 ; 3 8 (preuve partielle) ; 4 9 ; 5 non établi (8 par prudence).

Pistes (3) : 1. combler la colonne de 4 sous le programme avec l'objet de preuve (en correction) ; 2. recapturer l'abonné en fenêtres (premier écran, écran de fiche, bas de page) pour valider les alignements ; 3. rééquilibrer la colonne gauche de la fiche.

NOTE GLOBALE Carnet : 8/10

## Fautes dures
1. Favoris abonné, carte Vanne étirée : vide de 73 px entre « Clique pour la chute » et le séparateur (en-cours 1280 et 1920) : `apps/web/src/components/favoris/favoris-list.tsx` (classes de grille `items-start` / pied de carte `mt-auto`).
