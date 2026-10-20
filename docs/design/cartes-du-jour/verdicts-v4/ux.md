# Verdict relecteur n°3, « l'UX cohérence » : tour 4 (apres-v4)

Jugé tel quel, sur captures. Composition du fondateur respectée : bandeau Vanne pleine largeur dès 1024, Conseil + Vidéo dessous, pile sous 1024, « Révéler la chute » collé à 12 px de l'énoncé.
Rien de cassé : pas de débordement horizontal, bords gauche/droit communs au bandeau et à la rangée, pieds alignés à l'état fermé (1024, 1280, 1440). Acquis : cibles 44 px (`375-visiteur-zones.png`), focus net sur bouton, accordéon, partage, étoile (`1280-visiteur-focus-bouton.png`, `375-visiteur-focus-accordeon.png`), H2 rapproché du header, vide de 271 px disparu, pastilles lisibles (texte clair 12 px).

| # | Critère | Note |
|---|---|---|
| 1 | Clarté | 9 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 8 |
| 4 | Cohérence | 8 |
| 5 | Espacements et alignements | 8 |
| 6 | Mobile et tablette | 8 |
| 7 | Finition | 8 |
| | **Globale** | **8,3 / 10, sous la barre (10 attendu, aucun critère < 9)** |

## 1. Clarté (9)
- `1280-visiteur-avant.png` : le bandeau occupe 407 px, la rangée Conseil/Vidéo démarre à y=657 ; sur un écran de 720 px de haut seuls les en-têtes des 2 cartes affleurent. Mobile : la vidéo démarre à y~1018 à 375 (`375-visiteur-avant.png`), à 1,5 écran. Correction : sur PC, ramener le bandeau à ~360 px (énoncé 48 px au lieu de 56, haut de bandeau 24 px au lieu de 36) pour que le titre et le début du texte du Conseil et de la Vidéo soient visibles sans défiler.

## 2. « Révéler la chute » (9)
- `1280-visiteur-chute.png` : la chute (24 px, 600) est plus petite que l'énoncé (56 px, 400). La chute est le moment fort, elle pèse moins que sa mise en place. Correction : chute à 32 px/700 dès 1280 (30 px à 1024), ou énoncé à 44 px, pour que la chute soit >= l'énoncé en poids visuel.
- `1280-visiteur-vanne-longue-chute.png` : énoncé de 6 lignes à 36 px, bouton rejeté à y=566 ; au clic la page grandit de 106 px sans repère. Correction : après le clic, `scrollIntoView({block:"nearest"})` sur la chute et annonce `aria-live="polite"`.

## 3. Hiérarchie (8)
- `1440-visiteur-avant.png` : saut de 56 px (énoncé) à 18 px (titres Conseil/Vidéo) sans niveau intermédiaire ; la chute (24 px) ne s'intercale pas. Correction : échelle 56/32/20 ; titres des cartes du bas à 20 px.
- `1440-visiteur-avant.png` : titre de la vidéo (gras 18 px, à droite de la miniature) a la même force que le titre du conseil mais position différente. Correction : aligner la baseline du titre vidéo sur le haut de la miniature (y=753).

## 4. Cohérence (8)
- La carte Vidéo change de structure à chaque palier : miniature à gauche et accordéons à droite à 768 (`768-visiteur-avant.png`), miniature pleine largeur à 1024 (`1024-visiteur-avant.png`), miniature à gauche et accordéons dessous à 1280 (`1280-visiteur-avant.png`). Correction : 2 modèles seulement : miniature pleine largeur sous 1024 ; à >= 768, toujours miniature + titre à gauche/droite avec accordéons pleine largeur dessous.
- Extrait du Conseil : 4 lignes (768), texte entier (1024), 3 lignes (1280). Le lien « Lire la suite » apparaît puis disparaît. Correction : 4 lignes partout sauf cas du texte < 4 lignes, aussi à 1024.
- Bandeau centré (énoncé, bouton) avec en-tête et pied alignés à gauche (`1280-visiteur-chute.png`) : acceptable, à valider par le designer.

## 5. Espacements et alignements (8)
- `1024-visiteur-avant.png` : écarts de 33 à 36 px dans la carte Conseil (titre vers texte y 795 à 833 ; texte vers accordéons 1019 à 1055), au-delà de 24 px. Idem avec un conseil court : `1280-visiteur-conseil-court-avant.png` (titre vers texte ~34 px). Correction : plafonner les écarts répartis à 24 px ; le reste revient sous le pied ou dans le bas de carte (marge de 24 px avant le filet).
- `1280-visiteur-avant.png` : 35 à 40 px entre la pastille « Autodérision » (bas y=305) et l'énoncé (haut ~345). Correction : 24 px max.
- `768-visiteur-avant.png` : 63 px vides sous la miniature (x 121-372, y 1283 à 1346), colonne de gauche vide à côté des accordéons. Correction : accordéons pleine largeur sous la miniature (voir critère 4).
- Après ouverture (`1280-visiteur-lire-suite.png`) : bas du Conseil à y=1181 contre 1130 pour la Vidéo ; avec les 6 accordéons : 1766 contre 1912 (`1280-visiteur-accordeons.png`). Conforme au choix « voisine immobile », mais les filets se désalignent ; à tolérer et à signaler au fondateur.

## 6. Mobile et tablette (8)
- 320 et 375 propres, cibles 44 px prouvées, 4 lignes + lien, H2 à y~140 (`320-visiteur-avant.png`) ; vidéo à 1,5 écran.
- `768-visiteur-avant.png` : miniature de 251 px avec libellés d'accordéon serrés à droite (« Ce que tu vas apprendre » à 18 px des bords). Correction : voir critère 4.
- Focus vidéo : `375-visiteur-focus-video.png` et `1280-visiteur-focus-video.png` ne montrent qu'un bouton rouge légèrement plus grand, sans anneau net sur la miniature. Correction : `:focus-visible` = anneau 3 px #c4b5fd + liseré sombre 1 px, décalage 2 px, rayon 12 px, sur toute la miniature.

## 7. Finition (8)
- `1280-visiteur-avant.png` : le titre de la vidéo passe sur 3 lignes (« Roman Frayssinet - / L'intelligence / des animaux ») alors que 60 px restent libres à droite (x 1165 à 1223). Correction : retirer le `max-width` du bloc titre pour 2 lignes.
- Fondu de l'extrait : 3e ligne en gris à demi-opaque puis lien à 14 px (`1280-visiteur-avant.png`, y 866 à 895). Lisible mais ressemble à du texte rogné. Correction : fondu sur la dernière demi-ligne seulement, lien à 12 px du texte.
- Cartes, icônes, pastilles, rayons cohérents ; contraste du texte et des liens violets correct.

## Handoff (notes + corrections)
Notes : clarté 9, chute 9, hiérarchie 8, cohérence 8, espacements 8, mobile/tablette 8, finition 8 ; globale 8,3/10.
1. Carte Vidéo : un seul modèle >= 768 (miniature + titre en ligne, accordéons pleine largeur dessous) ; extrait Conseil à 4 lignes partout ; supprime le vide de 63 px à 768 et l'incohérence 768/1024/1280.
2. Hiérarchie : chute >= énoncé (32 px/700 dès 1280), échelle 56/32/20, bandeau ramené à ~360 px pour que la rangée affleure.
3. Écarts internes plafonnés à 24 px (1024, conseil court, tag vers énoncé), titre vidéo sur 2 lignes, anneau de focus visible sur la miniature vidéo, `scrollIntoView` + `aria-live` à la chute.
