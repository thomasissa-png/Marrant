# Verdict relecteur n°3, « l'UX cohérence » : tour 5 (apres-v4-1)

Jugé tel quel, sur captures. Composition du fondateur respectée (bandeau Vanne dès 1024, rangée Conseil + Vidéo, pile sous 1024, chute collée sous l'énoncé).
Rien de cassé : pas de débordement, header et grille alignés à 1280 et 1440, rangée de même hauteur et filets alignés à l'état fermé (1024, 1280, 1440, et avec conseil court : `1280-visiteur-conseil-court-avant.png`).

| # | Critère | Note |
|---|---|---|
| 1 | Clarté | 9 |
| 2 | « Révéler la chute » | 10 |
| 3 | Hiérarchie | 9 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 10 |
| 6 | Mobile et tablette | 9 |
| 7 | Finition | 9 |
| | **Globale** | **9,3 / 10, proche de la barre mais pas atteinte (aucun critère < 9 : OK ; globale 10 attendue)** |

## Points demandés, vérifiés
- Modèle Vidéo unique 768 à 1440 : miniature à gauche, titre et « Montreux Comedy · 7 min » à droite, accordéons pleine largeur dessous, sur `768-visiteur-avant.png`, `1024-visiteur-avant.png`, `1280-visiteur-avant.png`, `1440-visiteur-accordeons.png`. Le vide de 63 px sous la miniature à 768 a disparu (16 px). Acquis.
- Écarts internes : plus aucun vide > 24 px, y compris conseil court (`1280-visiteur-conseil-court-avant.png`), vanne longue (`1280-visiteur-vanne-longue-chute.png`), 1024 (`1024-visiteur-avant.png`). Acquis.
- Focus miniature : anneau lavande 2 px net sur toute la miniature (`1280-visiteur-focus-video.png`, `375-visiteur-focus-video.png`). Acquis.
- Chute : 32 px gras en cadre violet à 16 px de l'énoncé de 40 px, la chute pèse enfin autant que la mise en place (`1280-visiteur-chute.png`). Bandeau 359 px : à 1280 la rangée affleure dès y=609.
- Ouvertures : la chute apparaît sans déplacer l'énoncé ; le décryptage pousse la rangée vers le bas sans la déformer (`1280-visiteur-decryptage.png`) ; « Lire la suite » n'agrandit que le Conseil (+72 px à 1280, `1280-visiteur-lire-suite.png` ; +147 px à 1024, `1024-visiteur-lire-suite.png`). Conforme au principe « les voisines ne bougent pas » ; bas de cartes désalignés assumé.

## 1. Clarté (9)
- `375-visiteur-avant.png` : la vidéo démarre encore à y~1018, hors du 1er écran de 667 px ; seule la vanne et la moitié du conseil sont vues. Correction : sous 768 px, extrait du Conseil à 3 lignes (au lieu de 4, gain 24 px) et écart entre cartes 12 px (au lieu de 16, gain 8 px) pour remonter la vidéo à y~985.

## 3. Hiérarchie (9)
- `1024-visiteur-avant.png` : l'extrait du Conseil n'a que 2 lignes dont la 2e est déjà estompée, soit une seule ligne lisible en entier. Correction : à 1024, extrait à 3 lignes (voir correction 1 ci-dessous), et sur toutes les largeurs, fondu limité à la dernière demi-ligne (`1280-visiteur-avant.png`, y 806 : 3e ligne à ~40 % d'opacité).

## 4. Cohérence (9)
- La miniature change de taille d'un palier à l'autre : 237 px à 768, 202 px à 1024, 253 px à 1280 ; titre vidéo sur 3 lignes à 1024 contre 2 ailleurs (`1024-visiteur-avant.png`, « Roman Frayssinet - / L'intelligence / des animaux »). Correction 1 : à 1024 uniquement, titre vidéo 1 à 2 px plus petit (18 px) pour tenir en 2 lignes dans la colonne de 428 px (202 + 16 + ~207 = 425 px), ce qui libère 24 px et permet l'extrait à 3 lignes.

## 6. Mobile et tablette (9)
- 320, 375, 768 propres ; cibles 44 px (`375-visiteur-zones.png`) ; modèle Vidéo cohérent à 768. Reste la même réserve qu'au critère 4 pour 1024.

## 7. Finition (9)
- `1280-visiteur-decryptage.png` (y 835 à 860) : « tous : “Non / non, repose-toi.” » » coupe le « Non non » entre deux lignes. Correction : espaces insécables dans « “Non non, repose-toi.” » » (et dans « Ex : « Quand je propose »).
- Même capture : la ligne « Montre ton défaut … justifiée par une » s'arrête à x=868 alors que le cadre va à x=959 (retour à la ligne précoce dû à l'insécable précédent). Correction : appliquer l'insécable au seul groupe « Non non » pour libérer la ligne.

## Handoff (notes + corrections)
Notes : clarté 9, chute 10, hiérarchie 9, cohérence 9, espacements 10, mobile/tablette 9, finition 9 ; globale 9,3/10.
1. 1024 : titre vidéo à 18 px (2 lignes, miniature 202 px) et extrait du Conseil à 3 lignes, pour aligner ce palier sur 768 et 1280.
2. Fondu d'extrait limité à la dernière demi-ligne ; mobile : extrait 3 lignes et écart entre cartes 12 px pour remonter la vidéo.
3. Insécable sur « Non non » dans le décryptage de la vanne.
