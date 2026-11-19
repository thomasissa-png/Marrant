# Relecture design à l'aveugle, La lettre et Profil, tour 2 (s26)

Périmètre : `/lettre` (visiteur, gratuit : inscription 7/5 ; abonné : archive), fiche `/mon-espace/lettres/[numero]` (code lu, pas de capture), `/profil` (gratuit, en-cours, nouvel). Captures lues : `docs/captures/s26/lot2-tour-2/{lettre,profil}/` à 375, 768, 1280, 1920 (1456 non ouvert, même grille que 1280). Code lu : `lettre-page-ouverte.tsx`, `lettre-page-inscription.tsx`, `lettres-abonne-cartes.tsx`, `archive-lettres.tsx`, `profil-ouvert.tsx`, `profil-cartes.tsx`, `cap-profil.tsx`, `ton-cap.tsx`, `prenom-card.tsx`, `supprimer-compte-card.tsx`, `ui/card.tsx`, `ui/input.tsx`.

## Gate typographique (cité de `TAILLES-*.md`)

| Page / compte | 375 | 768 | 1280 / 1920 |
|---|---|---|---|
| /lettre visiteur et gratuit | 4 tailles (24, 20, 16, 14), 6 combinaisons | 4, 6 | 4 (30, 20, 16, 14), 6 |
| /lettre en-cours et nouvel (archive) | 4, 5 | 4, 5 | 4, 5 |
| /profil gratuit | 4, 5 | 4, 6 | 4, 6 |
| /profil en-cours | 4, 5 | 4, 5 | 4, 6 |
| /profil nouvel | 4, 5 | 4, 5 | 4, 6 |
| /profil visiteur | 3, 4 (écran de connexion, pas /profil) | idem | idem |

`TAILLES-mon-espace_lettres.md` est identique à `TAILLES-lettre.md` (la page redirige en 308 vers `/lettre`). Toutes les valeurs sont dans {14, 16, 20, 24 ou 30}, graisses 400 et 600, aucune capitale. Gate PASS : aucune faute automatique. Un seul fond violet opaque par écran de /lettre (visiteur) et de /profil (abonné : « Reprendre l'étape 3 » ; gratuit : « S'abonner · 1,99 €/mois »), pastille « Premium » et interrupteurs neutres. L'archive de /lettre n'a aucun aplat plein (décision de code : pas de bouton « Lire »), seule la carte de la dernière lettre porte le fond et la bordure violets de `CARTE_ACTION`.

## La lettre

### Visiteur et gratuit (`/lettre`)
- 1280 : titre blanc 30 px à gauche, inscription en 7 colonnes (x 352 à 1048 en réel, bouton « Envoie-moi la lettre » à y ≈ 465, bien sous 450 + en-tête global, donc au premier écran), dernier numéro en 5 colonnes. La colonne d'inscription est collante (`lg:sticky lg:top-36 lg:self-start`, `lettre-page-ouverte.tsx` l.93) : le grand blanc sous le formulaire (y 580 à 2 590 sur la capture pleine page) n'existe pas à l'écran, le formulaire suit la lecture. Pas une faute.
- 1920 : coque limitée à 1216 px, mêmes proportions que 1280, pas de colonne centrée seule. 768 : inscription puis dernier numéro, pleine largeur, ordre correct. 375 : titre sur 2 lignes équilibrées, formulaire avant y = 563, dernier numéro dessous.
- Bloc d'inscription : champ 48 px, case avec libellé complet, bouton 16/600, mention légale en 14/400. Contraste du texte et du champ correct. Aucun vide > 32 px au milieu d'un bloc.
- Cohérence visiteur/gratuit : identique (même composant).

### Abonné (archive, `/lettre`, ex-`/mon-espace/lettres`)
- Titre « La lettre » + compteur « 2 » collé au titre (écart 17 px, bon). Dernière lettre en tuile pleine largeur (1216 px à 1280), 110 px de haut, titre 20/600 puis objet 16/400 : lisible, aérée, une zone dominante. Précédentes en grille 3/2/1 : à 1280 une seule carte (389 px) occupe 1/3 de la rangée, le reste est vide en fin de bloc (permis).
- Même rendu pour en-cours et nouvel (mêmes 2 lettres), 375 : cartes pleine largeur, gap 24 px, cibles ≥ 56 px.
- Fiche d'une lettre (`LettreVue`, code) : colonne 8 + rail 4 collant (`lg:top-36`), colonne de lecture `lg:max-w-[47.5rem]` = 760 px, rail à `divide-y`. Conforme à la spec, non capturé.

### Notes La lettre (grille Design)
| Critère | Note | Défaut / ce qui ferait 10 |
|---|---|---|
| 1 Élégance, fidélité accueil | 9 | La carte de la dernière lettre est la seule du site à porter le dégradé et la bordure violets alors que les cartes voisines sont neutres : accent discret mais réel. Piste : bordure `border-border-hover` (`CARTE_ACTION` dans `aujourdhui/tableau.tsx`) ou garder, décision à confirmer par Thomas. |
| 2 Hiérarchie | 9 | Archive : aucun bouton, la tuile n'annonce pas qu'elle se clique (le lien est un `after:absolute`). Piste : chevron `text-text-secondary` à droite du titre (`lettres-abonne-cartes.tsx`), sans nouvelle taille. |
| 3 Largeur 5 largeurs | 9 | Archive 1280 et 1920 : une carte sur trois colonnes, 2/3 de la rangée vide (fin de bloc, permis). Piste : sous 3 précédentes, grille `lg:grid-cols-3` inchangée mais rail à droite avec le lien vers Aujourd'hui (`META`). |
| 4 Cohérence comptes | 10 | Visiteur = gratuit, en-cours = nouvel. |
| 5 Finition | 9 | Carte d'inscription : marge haute interne ≈ 52 px (carte y 245, libellé y 297) contre ≈ 35 px en bas (légale y 545, bord y 580) : le haut est plus lourd de ≈ 28 px, probablement un `p-*` interne de `LettreInscription` (`plein`) en plus du `p-6` de `lettre-page-inscription.tsx` l.36. Au bord de la carte, donc hors règle des 32 px, mais asymétrique. Retours à la ligne durs du texte du numéro (« l'étape 3 / du parcours Répartie ») visibles à 5 colonnes : texte validé, signalé seulement. |

Note globale La lettre : minimum = 9. Aucune faute dure chiffrable.

## Profil

### Constats (captures et code)
- 1280 en-cours : colonne principale 8 (Reprendre, Ton cap, Statistiques, Mes parcours), latérale 4 (Abonnement, Rappel, La lettre de la semaine, Prénom, Ta question), suppression en bas à pleine largeur. La colonne principale finit à y ≈ 1 041, la latérale à y ≈ 1 283 : 240 px vides en fin de colonne (permis). Une zone dominante (carte Reprendre + bouton plein), un seul violet fort ; « Premium » et interrupteurs neutres (OK).
- 1280 gratuit : « Prochaine étape » (8) en tête, offre en haut de la colonne latérale (bouton plein y ≈ 392), pas de progression. Sous-tuiles 2 + 1 : la case en bas à droite de « Prochaine étape » reste vide (fin de bloc, 385 x 105 px).
- 768 : 1 colonne pleine largeur, ordre action, abonnement, réglages, suppression. 375 : pile propre, boutons pleine largeur.
- Gate PASS (voir tableau).

### Fautes dures chiffrables
1. **Padding des cartes 16 px au lieu de 24 px.** `ui/card.tsx` (`Card` = `p-4`) donne 16 px à Abonnement, Rappel de parcours, La lettre de la semaine, Prénom, Supprimer mon compte ; `ton-cap.tsx` l.46 (`carteDuProfil` : `p-4`) à Ton cap. Les cartes voisines (`CARTE_PROFIL`, `profil-cartes.tsx` l.17 : Prochaine étape, Statistiques, Mes parcours, Ta question) ont 24 px. Sur la capture 1280, retrait du texte : 17 px (Ton cap, Abonnement, Supprimer) contre 26 px (Statistiques, Mes parcours) dans la même colonne ; spec §0 et §8.4 : `p-6` partout. Correction : sous `ESPACE_CLIENT_PUBLIE`, `className="p-6"` sur ces cartes (`prenom-card.tsx`, `supprimer-compte-card.tsx`, `abonnement-card.tsx`, `lettre-hebdo-reglage.tsx`, `rappel-parcours-toggle.tsx`) et `carteDuProfil ? "space-y-3 p-6"` dans `ton-cap.tsx`.
2. **Champ prénom 40 px et bouton 44 px (cible < 44, alignement cassé).** `ui/input.tsx` : `h-10` dès 768 px (`max-md:h-11` seulement en dessous) ; `prenom-card.tsx` l.90 : bouton `md:h-11`. Capture 1280 : champ y 607-647 (40 px), bouton y 603-647 (44 px), bord haut décalé de 4 px. Correction : `className="border-border-input md:h-11"` sur l'`Input` de `prenom-card.tsx` (ouvert seulement).
3. **Suppression du compte : vide horizontal de 355 à 380 px au milieu de la carte à partir de 1024.** `supprimer-compte-card.tsx` l.23 (`lg:flex lg:justify-between`) + `max-w-prose` : texte jusqu'à x ≈ 700 (en-cours : avertissement jusqu'à 703), bouton « Supprimer mon compte » à x ≈ 1 058-1 218. Correction : `SUPPRESSION_CONTENU_OUVERT` sans `justify-between` (bouton `lg:ml-8` collé au texte) ou action sous le texte comme à 768/375.

### Pistes (hors faute dure)
- Cohérence des textes : « Tout le catalogue est à toi… », « Formule mensuelle », « Ta question à l'équipe » sont en blanc (`text-primary`, conversion `.text-accent-link` / classes partagées), alors que les aides voisines sont en gris : unifier sur `META` gris (`profil-ouvert.tsx`, `ECHELLE_CARTES_PARTAGEES`).
- Bouton « Supprimer mon compte » : texte rouge nu (`variant="ghost"`, `text-error-text`), la spec demandait `BOUTON_SECONDAIRE` discret ; un contour 1 px lui donnerait une forme de bouton (`supprimer-compte-card.tsx` l.100).
- « Prochaine étape » gratuit à 1280 : 2 + 1 tuiles laissent une case vide ; `lg:grid-cols-3` rendrait 3 tuiles de 240 px (texte plus serré) ou ne rien changer.
- Repères du cap : `border-2` (`ton-cap.tsx` l.68), tolérés comme composant existant.
- Libellé du prénom coupé à ≈ 190 px dans une carte de 354 px (`prenom-card.tsx`, `lg:flex-row`) : retirer la contrainte de largeur du label.

### Notes Profil (grille Design)
| Critère | Note | Défaut |
|---|---|---|
| 1 Élégance | 8 | Deux familles de cartes (16 et 24 px) dans la même grille : faute 1 ; suppression en barre déséquilibrée : faute 3. |
| 2 Hiérarchie | 9 | Une zone dominante et un seul violet fort par compte, offre en haut de la colonne latérale (gratuit). |
| 3 Largeur 5 largeurs | 8 | 8/4 correct ; vide horizontal de la suppression (faute 3) ; 240 px de fin de colonne permis. |
| 4 Cohérence comptes | 9 | Même grille et mêmes cartes ; gratuit sans progression, cohérent. |
| 5 Finition | 7 | Faute 2 (cible 40 px, décalage 4 px) et faute 1 (retrait 17 contre 26 px). |

Note globale Profil : minimum = 7.

NOTE GLOBALE La lettre : 9/10
NOTE GLOBALE Profil : 7/10

Fautes dures :
1. Profil : padding 16 px (`Card` `p-4`, `TonCap carteDuProfil p-4`) au lieu de 24 px sur 6 cartes : `apps/web/src/components/ui/card.tsx` (surcharge via `prenom-card.tsx`, `supprimer-compte-card.tsx`, `abonnement-card.tsx`, `lettre-hebdo-reglage.tsx`, `rappel-parcours-toggle.tsx`) et `apps/web/src/components/espace/ton-cap.tsx` l.46.
2. Profil : champ prénom `h-10` = 40 px (cible < 44, décalage de 4 px avec le bouton de 44) : `apps/web/src/components/ui/input.tsx` l.12 / `apps/web/src/components/profil/prenom-card.tsx` l.88.
3. Profil : vide horizontal de 355 à 380 px dans la carte « Supprimer mon compte » dès 1024 px : `apps/web/src/components/profil/supprimer-compte-card.tsx` l.23.
