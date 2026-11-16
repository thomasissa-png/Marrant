# Relecture UX à l'aveugle : « Aujourd'hui », s25 v7, tour 12

Captures vues : 4 comptes à 375 et 1280 (premier écran), pleine page à 375, 768, 1280 (visiteur, nouvel, en-cours) et 1920 (visiteur, nouvel, en-cours). Gratuit : 375 et 1280 au premier écran, le reste lu par différence avec le visiteur. Code lu : `offre-apercu.tsx` seulement (pas de Grep disponible dans cette session, le reste du code n'a pas été parcouru : les contrôles 5 du design reposent sur les captures).

## 1. Gate typographique MESURÉE (`TAILLES.md`, même dossier que les captures)

Citation : « Gate PASS sur les 16 lignes ; aucune capitale ; graisses 400 et 600 seulement. » Résumé du fichier, premier écran de `main` :

| Compte | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| visiteur | 4 tailles (24, 20, 16, 14), 6 combinaisons | 4 (24/20/16/14), 6 | 4 (30/20/16/14), 6 | 4 (30/20/16/14), 6 |
| gratuit | 4, 6 | 4, 6 | 4, 6 | 4, 6 |
| en-cours | 4, 6 | 4, 6 | 4, 6 | 4, 6 |
| nouvel | 4, 6 | 4, 6 | 4, 6 | 4, 6 |

- Seuils du brief : plus de 4 tailles ou plus de 6 combinaisons = faute dure. Mesuré : 4 et 6 partout. **Pas de faute dure typographique.**
- Toutes les tailles sont dans l'échelle {14, 16, 20, 24 ou 30} du document `typo-harmonie-espace-s25.md` ; graisses 400/600 ; Jakarta seulement sur 24/30 et 20 (H1, titres de carte, chiffres).
- Réserve de lecture : la mesure ne porte que sur le premier écran. Les captures pleine page n'ont pas de 5e taille visible (titres de carte 20, texte 16, méta 14).

## 2. Accent violet

- **Visiteur et gratuit** : un seul aplat violet dans `main` au premier écran (bouton d'offre du hero). Le second bouton d'offre est en fin d'extrait (hors premier écran à 1280, 768 et 375 pleine page : jamais visible avec le premier). Aucun violet sur les tuiles, la pastille, les barres, « Connexion ». Conforme à la règle. (Le bouton violet de l'en-tête global est hors périmètre, c'est le même bouton, même libellé.)
- **Abonné** : le bouton plein de Z1 (« Commencer », « Les cartes du jour ») est l'unique aplat ; la carte Z1 porte teinte et bord violet doux, autorisé. Aucun second accent dans les autres cartes. Conforme. (Pastille violette de la cloche : en-tête global.)
- Aucune faute dure sur l'accent.

## 3. Design

| Critère | Note | Constat |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 9 | Cartes sobres, un bouton, rythme 24 px régulier, tout dans la coque de 1216 px alignée sur la bande. Piste : voir D1. |
| 2 Hiérarchie | 9 | Aperçu : H1 puis bouton en haut à droite, extrait dessous. Abonné : Z1 à gauche, teintée, avec le seul plein. |
| 3 Largeur aux 5 largeurs | 9 | 375 une colonne, 768 hero 2 colonnes + tuiles, 1280 et 1920 grille 12 colonnes identique (marges seules grandissent). Aucun débordement, aucune tuile creuse. Voir D1, D2. |
| 4 Cohérence entre comptes | 9 | Même cadre, mêmes cartes visiteur/gratuit ; l'abonné reprend les mêmes tuiles (cap, étape, mission). Écart assumé : la preuve « 1 500+ » est dans la carte d'offre à 768 et dans le hero ailleurs (voulu, `offre-apercu.tsx`). |
| 5 Finition | 9 | Cibles : boutons de 48 px, « Connexion » `min-h-11 min-w-11` (code vérifié). Contrastes : texte atténué `opacity-75` sur #B3B3B3 sur carte, environ 5:1 (calcul de ma part, pas un test). |

Défauts précis (pistes, non bloquants) :

- **D1 (visiteur et gratuit, 1280 et 1920)** : sous « 1 500+ » le hero laisse environ 75 à 90 px avant la légende « Voici un exemple… » (y 375 à 451), au lieu des 48 px (`mt-12`) du rythme. C'est un vide de fin de bloc, permis, mais il décolle la légende du hero au lieu de la rattacher à l'extrait. Correction : dans `extrait-coupe.tsx`, ramener l'espace du hero vers la légende à `mt-12` net (retirer le padding bas du hero ou aligner `items-start` + `pb-0` sur la colonne gauche). Ferait 10.
- **D2 (gratuit, 375 et 1280)** : phrase d'objet et réassurance, séparées de 24 px (`mt-6`), se lisent comme deux blocs dans une même carte ; rend la carte du gratuit plus haute de 60 px que celle du visiteur, donc la tuile Z1 touche le bas du premier écran à 375. Assumé dans le code (tour 8), à garder.
- **D3 (visiteur 768)** : sous les pastilles, vide d'environ 110 px dans la colonne gauche du hero face à la carte d'offre. Fin de colonne : permis.

## 4. UX

### Prospect (visiteur, gratuit)
- **Fermé au premier coup d'œil** : oui à 375 comme à 1280. Pastille « Premium » avec verrou au-dessus du H1, verrous sur les tuiles, bouton « Commencer » dessiné en contour éteint (lit « bouton inactif »), légende « Voici un exemple de cette rubrique. Elle est ouverte avec Premium. », fondu en bas, « La suite est dans Premium ». Aucun moment « je suis dedans ».
- **Produit verrouillé avec vrai contenu dès le premier écran** : oui. 375 : la tuile « Ton premier pas » (scène réelle, « 5 min », bouton) entière. 1280 : Z1 et Ton cap entiers, début d'Étape conseillée, Mission (texte réel de la marche) et Vanne du jour. Le prospect voit le tableau de bord, pas une promesse.
- **Offre en haut, unique** : oui, un bouton plein dans le premier écran, prix lu en config, réassurance dessous. Le second (fin d'extrait) est le même.
- **Envie de s'inscrire** : forte à 1280 (hero + aperçu dense). À 375 le tunnel est court : H1, promesse, preuve, offre, extrait. Les 6 pastilles « dedans » n'y sont que lues (sr-only), le prospect mobile ne voit donc pas la liste (Série, Mission, Contenu du jour) mais voit les tuiles correspondantes plus bas dans la page : acceptable.
- Textes T1 (promesse) et T2 (« La suite est dans Premium ») : jugés sur leur place. Place correcte : T1 sous le H1 avant l'offre, T2 sur le fondu juste avant le second bouton. Un texte faux à signaler : la tuile « Mission · Marche 1 » est montrée au prospect alors que le nouvel abonné n'a pas de mission le premier jour (Z4 y est remplacée par « Tes 4 premières semaines »). Écart de promesse mineur, conforme à la spec 3.2 (piste : montrer « Tes 4 premières semaines » plutôt que Mission dans `tableau-verrouille.tsx`).

### Abonné avancé (en-cours)
- **3 secondes** : oui. Premier écran à 375 : « Si tu as 5 minutes », bouton plein « Les cartes du jour », deux lignes Nouvelle / À revoir. À 1280 : Z1 à gauche, cap à droite, étape et mission dessous. Une seule action pleine.
- **Envie de continuer** : cap 2 sur 5 en pastilles, 250 XP, série d'un jour, aide de la série, étape 3 sur 3 avec barre, mission facultative. La progression est visible sans défiler à 1280. À 375 le cap n'apparaît qu'en bas du premier écran : acceptable.
- Z1 porte trois éléments cliquables (bouton, deux lignes de cartes) : dans la limite de 3 actions principales.

### Nouvel abonné
- **Jamais une page morte** : confirmé. Z1 « Ton premier pas » avec le seul plein, cap 1 sur 5, série à démarrer, étape conseillée, « Tes 4 premières semaines » (4 lignes), Contenu du jour (vanne, conseil, vidéo). Pas de zone vide ; les deux dernières rangées se partagent les 12 colonnes sans trou.
- Pas de XP affiché à 0 : conforme.

### Accessibilité visible, cohérence
- Titres par zone, un H1, cibles de 44 px dans l'offre, focus non évalué sur captures. Extrait inerte : aucune cible fausse. Cohérence visiteur/gratuit/abonné : bonne.

## 5. Grille et note

| Critère | Note |
|---|---|
| Design 1 Élégance | 9 |
| Design 2 Hiérarchie | 9 |
| Design 3 Largeur | 9 |
| Design 4 Cohérence | 9 |
| Design 5 Finition | 9 |
| UX 1 Prospect | 9 |
| UX 2 Abonné clarté | 10 |
| UX 3 Abonné envie | 9 |
| UX 4 Nouvel abonné | 10 |
| UX 5 Accessibilité, cohérence | 9 |

Globale = minimum = 9. Le 10 demanderait : D1 (légende rattachée), liste des « dedans » visible sur mobile, mission remplacée par « Tes 4 premières semaines » dans l'aperçu.

Aucune faute dure (gate 4 tailles / 6 combinaisons passée sur 16 lignes, un seul aplat violet par écran, aucun vide au milieu d'un bloc, aucun débordement).

NOTE GLOBALE : 9/10

Fautes dures : aucune.
