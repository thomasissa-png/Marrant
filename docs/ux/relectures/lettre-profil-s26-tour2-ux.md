# Relecture UX à l'aveugle : La lettre et Profil, tour 2 (s26)

Périmètre : `/lettre` (visiteur, gratuit : inscription ; abonnés : archive), `/mon-espace/lettres` (308 vers `/lettre`, mêmes captures), `/profil`. Captures `docs/captures/s26/lot2-tour-2/{lettre,profil}/`, 375/1280/1920 ouverts pour les 4 comptes (768 et 1456 non ouverts). Décisions actées non notées : titre blanc, un aplat, colonne de lecture, textes validés, page de connexion du visiteur sur /profil.
Limite : mesures de position prises sur captures réduites (±4 px) ; elles sont à confirmer au DOM avant correction. Le nouvel abonné de /lettre voit les mêmes 2 lettres que l'abonné avancé : l'état vide `ArchiveLettres` n'est pas capturé, jugé au code seulement.

## Gate typographique (citée)
- `TAILLES-lettre.md` et `TAILLES-mon-espace_lettres.md` (identiques) : visiteur et gratuit 4 tailles (24 ou 30, 20, 16, 14 px), 6 combinaisons ; en-cours et nouvel 4 tailles, 5 combinaisons. PASS (seuils : > 4 tailles, > 6 combinaisons).
- `TAILLES-profil.md` : visiteur 3 tailles, 4 combinaisons ; gratuit 375 : 4/5, 768 à 1920 : 4/6 ; en-cours 375 et 768 : 4/5, 1280 et 1920 : 4/6 ; nouvel 375 et 768 : 4/5, 1280 et 1920 : 4/6. PASS, au plafond (6/6) dès 1280.
- Aplat violet : 1 seul sur chaque écran capturé (bouton d'inscription ; « S'abonner » ; « Reprendre l'étape 3 »). L'archive abonné n'en a aucun (tuile entière en lien).

## La lettre

### Design
1. Élégance : bonne. Titre gauche, carte formulaire sobre, aplat unique, même famille que l'accueil. 9.
2. Hiérarchie : visiteur, la zone dominante est le « dernier numéro » (1 640 px de haut à 1280) alors que l'action est à gauche, ce qui inverse les poids. Archive : la tuile violette domine, bien. 8.
3. Largeur : visiteur 1280 et 1920, colonne gauche vide de y ≈ 580 à y ≈ 2 590 (≈ 2 000 px) : vide de fin de colonne, donc permis par la règle, mais c'est la moitié de l'écran lors du défilement. Archive 1280/1920 : une seule carte précédente en 3 colonnes laisse deux tiers vides à droite (fin de rangée, permis). 7.
4. Cohérence entre comptes : visiteur et gratuit identiques ; en-cours et nouvel identiques ; cohérent. 9.
5. Finition : espacements réguliers (hero → précédentes 49 px, entre blocs), 375 sans débordement horizontal visible, cartes cliquables avec anneau de focus (`ANNEAU`), cibles 44 px (`min-h-11`). Bouton d'inscription : voir faute dure 1. 8.

### UX
1. Prospect en 3 secondes : promesse, e-mail, case, bouton et extrait d'une vraie lettre sont lisibles ; offre unique. À 375, bouton à y ≈ 590 (< 700, conforme). À 1280/1920, bouton à y ≈ 460-505 pour un seuil de 450. 8.
2. Abonné, clarté : la tuile de la dernière lettre se distingue (filet et dégradé violets) mais n'a aucun signe d'action (ni verbe, ni flèche) ; le code confirme « pas de bouton Lire », la carte entière est le lien. Le chiffre « 2 » à côté du titre n'a pas de libellé. 8.
3. Envie de continuer : le compteur est la seule progression (aucun état « lue » n'existe, décision actée). 8.
4. Nouvel abonné : l'état vide (code) a texte, sortie vers Aujourd'hui, cadre 8/4 : page non morte. Non vérifiable sur capture. 8.
5. Accessibilité : lien étiré avec anneau de focus visible, titres hiérarchisés, liens du corps soulignés. 9.

### Fautes dures
- F1 (à confirmer au DOM) : bouton « Envoie-moi la lettre » à y ≈ 460 px (haut du bouton) à 1280 et 1920, pour un critère de spec UX §3.1 « au-dessus de y = 450 ». Dépassement ≈ 10 px, venant du bloc titre + sous-titre + `p-6` de la carte. Fichier : `apps/web/src/components/lettre/` (`LettrePageInscription`), réduire l'espace entre le sous-titre et la carte et le padding haut du formulaire.

### Pistes (pas des fautes)
- P1 : rendre la carte du formulaire collante sur la colonne gauche (`lg:sticky lg:top-36 lg:self-start`) : le formulaire accompagne la lecture du dernier numéro et la colonne gauche n'est plus vide. Aucun texte. 10 sur Largeur et Prospect.
- P2 : ajouter un chevron SVG (sans texte) dans la tuile « dernière lettre » et les cartes, à droite (`ChevronRight`, `text-text-secondary`). Un libellé « Lire » serait un texte neuf à valider par Thomas. Dans `lettres-abonne-cartes.tsx`.
- P3 : à 1280, la tuile pleine largeur a 900 px vides à droite du texte ; mettre la précédente à côté (grille 12 : tuile 8 col + rail 4 col des deux précédentes) ou garder la tuile pleine mais avec le chevron aligné à droite.

## Profil

### Design
1. Élégance : titre gauche, grille 8/4 propre, un seul aplat par écran, statistiques lisibles. 9.
2. Hiérarchie : abonné avancé, « Reprendre ton parcours » (tuile teintée + bouton) domine ; gratuit, « S'abonner » en haut de la colonne 4 ; nouvel abonné, aucune zone dominante (voir UX 4). 8.
3. Largeur : 1280 bien utilisé. En fin de colonne gauche (en-cours) ≈ 240 px vides sous « Mes parcours » (permis). Gratuit : « Prochaine étape » en 2 colonnes avec 3 pistes laisse une cellule vide de ≈ 380 x 105 px (vide de fin de carte, permis, mais tuile creuse visible). Carte « Supprimer mon compte » : voir faute dure 3. 7.
4. Cohérence entre comptes : mêmes cartes ; la colonne gauche du nouvel abonné empile « Prochaine étape » (3 pistes) avant « Ton cap », celle de l'en-cours commence par « Reprendre » : logique. 9.
5. Finition : voir fautes dures 2 et 3. Rangée `sm:grid-cols-2` de « Prochaine étape » : `rounded-xl` hors du couple `rounded-md`/`rounded-lg` cité par le brief (à vérifier dans le thème). 7.

### UX
1. Prospect (gratuit) : le bouton « S'abonner · 1,99 €/mois » est en haut de la colonne droite (y ≈ 392, < 450), offre unique. Pas de projection de valeur (aucune progression fermée) : décidé par la spec. 8.
2. Abonné, clarté : un seul gros bouton « Reprendre l'étape 3 » en tête de page : on sait quoi faire. 9.
3. Envie de continuer : cap (« cap 2 sur 5 » et points), série, XP, barres de parcours, statistiques. Bon. 9.
4. Nouvel abonné : jamais une page morte (cap 1, série, parcours vide avec « Découvrir les parcours »), mais l'écran n'a aucune action forte : les 3 pistes se valent et le seul bouton est en contour tout en bas de la colonne. 8.
5. Accessibilité : interrupteurs neutralisés avec contraste, ancres conservées, ordre du DOM = ordre affiché (code). 9.

### Fautes dures
- F2 : paddings horizontaux différents entre cartes de la même colonne à 1280 (mesurés sur la capture en-cours) : « Ton cap » ≈ 16 px, « Reprendre ton parcours » ≈ 20 px, « Statistiques » et « Mes parcours » ≈ 24 px ; colonne droite : Abonnement, Rappel, Lettre, Prénom ≈ 16 px, « Ta question à l'équipe » 24 px (`p-6`). Les textes de cartes voisines ne s'alignent pas. Fichiers : `apps/web/src/components/espace/cap-profil.tsx`, `apps/web/src/components/home/reprendre-parcours.tsx`, `apps/web/src/components/profil/{abonnement-card,prenom-card}.tsx`, `rappel-parcours-toggle.tsx`, `lettre-hebdo-reglage.tsx` : tous au `p-6` de `CARTE_PROFIL` (profil-cartes.tsx).
- F3 : carte « Supprimer mon compte » à 1280/1920 : ≈ 355 px vides (> 32 px) entre la colonne de texte (≈ 580 px) et le lien rouge à droite, au milieu de la carte. Fichier : `apps/web/src/components/profil/supprimer-compte-card.tsx` (lien sous le texte, aligné à gauche, ou texte sur toute la largeur utile).

### Pistes
- P1 : nouvel abonné, promouvoir une des 3 pistes en bouton plein de la carte (seul aplat) : « Apprends les bases » en `buttonVariants`, les 2 autres en cartes. Aucun texte neuf. `profil-cartes.tsx`, `ProchaineEtape`.
- P2 : « Prochaine étape » à 3 pistes : passer à `sm:grid-cols-3` quand `pistes.length === 3` (supprime la cellule vide). Même fichier.
- P3 : colonne gauche abonné avancé, ≈ 240 px vides sous « Mes parcours » : placer « Statistiques » en 4 colonnes de la rangée 8/4 sous Ton cap, ou accepter (vide de fin de colonne).

NOTE GLOBALE La lettre : 7/10

NOTE GLOBALE Profil : 7/10

Fautes dures :
1. /lettre : bouton d'inscription à y ≈ 460 px à 1280/1920 pour un critère de 450 (à confirmer au DOM), `apps/web/src/components/lettre/` (`LettrePageInscription`).
2. /profil : paddings de cartes 16 / 20 / 24 px dans la même colonne, `components/espace/cap-profil.tsx`, `components/home/reprendre-parcours.tsx`, `components/profil/{abonnement-card,prenom-card}.tsx`, `rappel-parcours-toggle.tsx`, `lettre-hebdo-reglage.tsx`.
3. /profil : vide de ≈ 355 px au milieu de « Supprimer mon compte » à 1280/1920, `components/profil/supprimer-compte-card.tsx`.
