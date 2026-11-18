# Relecture UX à l'aveugle, Aujourd'hui, s26 tour 14

Captures ouvertes : visiteur 375/1280/1920, gratuit 375/1280, en-cours 375/1280/1920, nouvel 375/1280. Lecture faite sans relecture existante.

## Gate typographique (TAILLES.md, citée)

Premier écran, 4 comptes, 375 et 1280 : TAILLES DISTINCTES = 4 (24/20/16/14 px à 375 ; 30/20/16/14 px à 1280), COMBINAISONS = 6 sur les 16 lignes. Seuils (plus de 4 tailles, plus de 6 combinaisons) respectés : pas de faute dure typographique. Aucune taille ajoutée par les barres verrouillées (hors texte).

## Barres des répliques verrouillées (seul changement)

Visibles et lisibles comme « texte fermé » : 2 barres par réplique, cadenas à droite du nom (La sûre, La joueuse, La risquée), à 375 comme à 1280/1920. Elles fonctionnent : le prospect voit la situation en clair et comprend que les réponses sont réservées. Rien à corriger.

## Notes par critère

### UX 1. Prospect, envie en 3 secondes : 8/10
Points forts : bouton plein en haut (y = 178 à 1280, y = 238 à 375), une seule offre, prix, réassurance, preuve « 1 500+ », extrait fermé par pastilles cadenas et fondu, second bouton en fin.
Défaut précis (faute dure) : le H1 « Aujourd'hui » de l'aperçu est en violet (visiteur et gratuit, 375/1280/1920), à côté du bouton plein violet. Brief : un seul accent violet fort par écran, tout second accent est une faute dure. Le même H1 est blanc chez l'abonné (en-cours, nouvel) : incohérence entre comptes. Correction : dans `apps/web/src/components/espace/apercu/apercu-verrouille.tsx`, remplacer la classe de couleur du H1 par la couleur du H1 abonné (`text-text-primary`). Ce qui ferait 10 : ce changement seul.
Piste (pas une faute dure) : à 1280 la carte d'offre a environ 55 px vides sous « Connexion » (contenu fini à y = 320, carte jusqu'à y = 377), alors que le padding haut est de 25 px. Un `self-start` ou `items-start` sur la carte, ou un `min-h` retiré, supprimerait ce vide.

### UX 2. Abonné, clarté : 9/10
En-cours : un seul bouton plein (« Les cartes du jour »), Z1 dominante en col-8, cap en col-4 à hauteur égale. Nouvel : « Commencer » seul bouton plein. Chaque zone a un titre lisible, lignes entières cliquables (Reprendre, Facultative, chevrons).
Défaut : chez le nouvel abonné, la carte Z1 répète la scène : le titre « Quelqu'un te lance « Tiens, tu as changé quelque chose, non ? » » puis le paragraphe reprend la même citation. Texte signalé, pas réécrit : la répétition alourdit l'action du jour (piste, pas faute dure). Ce qui ferait 10 : ne montrer la citation qu'une fois (`premierPas` dans la page `mon-espace`).

### UX 3. Abonné, envie de continuer : 9/10
Cap en 5 pastilles dès le premier jour, XP et série visibles (en-cours : 250 XP, 1 jour), Étape n sur N avec barre, mission facultative, contenu du jour. Piste : la série à 1 jour reste tout en bas des signaux ; rien de chiffrable à corriger.

### UX 4. Nouvel abonné, jamais une page morte : 10/10
Premier pas, cap 1 sur 5, « Étape conseillée Répartie, Étape 1 sur 4 », « Tes 4 premières semaines » (4 lignes), contenu du jour. Tout le premier écran 1280 est rempli et actionnable. À 375 la page reste dense sans trou.

### UX 5. Accessibilité visible et cohérence entre comptes : 8/10
Cibles : boutons et lignes visuellement au moins 44 px (bouton offre 48 px, Commencer 48 px, lignes Reprendre et Étape 1 environ 46 px). Ordre de lecture cohérent, extrait inerte, pastilles avec le mot « Premium ».
Défaut chiffrable : la couleur du H1 diffère entre aperçu (violet) et abonné (blanc) : même faute que UX 1. Le gris des textes sous fondu (« Tes premières répliques », corps de la mission) descend vers le fond par le masque, ce qui est voulu et exempté (aria-hidden).
Ce qui ferait 10 : corriger le H1.

## Responsive (constats chiffrés)

- 375 : l'extrait montre 3 blocs (premier pas, cap, début d'étape) puis le fondu et le second bouton ; offre à y = 238, premier écran complet. Conforme à la spec.
- 1280/1920 : coque plafonnée à 1216 px, marges latérales seules à grandir, bande des rubriques alignée sur la coque : conforme à la spec (§1 largeur).
- En-cours 1920 : rendu identique à 1280, aucun débordement.

## Verdict

Une faute dure : second accent violet (H1) et incohérence entre comptes. Le reste est au niveau 9 ou plus.

NOTE GLOBALE : 8/10

Fautes dures :
1. H1 « Aujourd'hui » en violet sur l'aperçu (visiteur et gratuit), second accent à côté du bouton plein et différent du H1 blanc des abonnés : `apps/web/src/components/espace/apercu/apercu-verrouille.tsx` (passer le H1 à la couleur du H1 abonné).
