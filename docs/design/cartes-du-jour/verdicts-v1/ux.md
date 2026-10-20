# Verdict relecteur n°3, « l'UX cohérence » : captures apres-v1 (6 largeurs)

Parcours testé : avant clic, chute révélée, décryptage ouvert, accordéons, à 320/375/768/1024/1280/1440.
Constat global : rien de cassé (pas de débordement horizontal, pas de texte coupé, parcours identique partout). Les défauts sont d'équilibre PC, de longueur mobile et de cibles tactiles.

| # | Critère | Note |
|---|---|---|
| 1 | Clarté | 8 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 8 |
| 4 | Cohérence | 8 |
| 5 | Espacements et alignements | 6 |
| 6 | Mobile et tablette | 7 |
| 7 | Finition | 8 |
| | **Globale** | **7,7 / 10, sous la barre (aucun critère ne doit être < 9)** |

## Points validés
- Focus : anneau lavande 2 px + décalage, net sur fond sombre (`375-visiteur-focus.png`, `1280-visiteur-focus.png`), identique aux deux largeurs.
- Chute : même emplacement que le pointillé, 12 px sous l'énoncé, pas de saut de l'énoncé (`320-visiteur-avant.png` vs `320-visiteur-chute.png`). Seul le bas de carte et les cartes suivantes descendent de ~140 px.
- Accordéons : en-têtes de 46 px (cartes conseil et vidéo) et 58 px (vanne), donc cibles >= 44 px (`375-visiteur-avant.png`).
- Pieds de carte : même filet et même hauteur sur les 3 cartes à toutes les largeurs.

## 1. Clarté (8)
- `320-visiteur-avant.png` : rien n'annonce qu'il y a 3 contenus (vanne, conseil, vidéo). Au 1er écran on voit la vanne et le haut du conseil, la vidéo est 1,9 écran plus bas (y ~1260 sur 2025 px). Correction : sous le H2, une ligne de 3 pastilles-ancres (😂 Vanne, 💡 Conseil, 🎬 Vidéo), 32 px de haut, visibles <768 px uniquement.
- Libellés d'accordéons incohérents : « Exercice du jour » (`375-visiteur-avant.png`, carte conseil) vs « Exercice pratique » (carte vidéo). Correction : un seul libellé, « Exercice du jour », sur les deux cartes.

## 2. « Révéler la chute » (9)
- `1280-visiteur-focus.png` : double contour (pointillé + anneau plein) un peu chargé. Correction : à `:focus-visible`, passer le pointillé en trait plein 1 px (même violet) sous l'anneau.
- `320-visiteur-chute.png` : l'accordéon « Pourquoi ça marche » surgit sans transition visible sur capture. Correction : animer la hauteur 200 ms, `prefers-reduced-motion` respecté, et annoncer la chute via `aria-live="polite"`.

## 3. Hiérarchie (8)
- `1280-visiteur-decryptage.png` : le sous-titre « À toi de jouer » (blanc gras 14 px) a le même poids que le titre de l'accordéon « Pourquoi ça marche ». Correction : « À toi de jouer » en 13 px, gras 600, couleur violet clair (#a78bfa), marge haute 16 px.
- Pastilles (« Autodérision », « Débutant », « Timing ») : ~11 px, 18 px de haut, gris sur gris, à toutes les largeurs (`1440-visiteur-avant.png`). Correction : 12 px, 24 px de haut, texte #c4c4c8.

## 4. Cohérence (8)
- `1440-visiteur-avant.png` : pied de la vanne = réactions à gauche + partage/étoile à droite ; pieds conseil et vidéo = moitié gauche vide. Correction : mettre un libellé discret à gauche (ex. « 3 min » ou le niveau), ou accepter ce vide uniquement si le design le tranche.
- En-tête d'accordéon de la vanne sur 2 lignes (titre + « L'euphémisme poli »), 58 px, contre 46 px ailleurs (`375-visiteur-chute.png`). Correction : soit ajouter un sous-titre aux 4 autres accordéons, soit passer la vanne à 46 px (sous-titre déplacé dans le corps).
- Titre du conseil et de la vidéo en gras 17-19 px, énoncé de la vanne en 400 à 26 px : écart voulu, mais à confirmer par le designer.

## 5. Espacements et alignements (6)
- `1280-visiteur-avant.png` : bas des cartes à y=571 (vanne), 851 (conseil), 826 (vidéo) : rangée en escalier, vide de ~280 px sous la vanne, et écart de 25 px conseil/vidéo qui ressemble à une erreur. Même chose à 1024 (563/923/782) et 1440 (`1440-visiteur-avant.png`).
  Correction : `align-items: stretch` sur la grille à >= 1024 px, cartes en flex colonne, fond de carte étiré à la hauteur de la rangée, pied de carte NON épinglé en bas (donc le contenu des voisines ne bouge pas à l'ouverture d'un accordéon). Les 3 bas de carte s'alignent sur la plus haute.
- `1280-visiteur-avant.png` et `1440-visiteur-avant.png` : le bouton Premium du header finit à x=1269 (1349 à 1440) alors que la grille finit à x=1248 (1328), soit 21 px de décalage. À 1024 les deux sont alignés (x=999). Correction : même conteneur (max-width et padding) pour header et section.
- Mobile : ~90 px de vide entre header sticky et H2 (`375-visiteur-avant.png`, y 64 à 140). Correction : 48 px max.
- Le H2 à 320 px occupe 284 px sur 288 utiles (`320-visiteur-avant.png`) : marge de sécurité nulle. Correction : 26 px max sous 360 px.

## 6. Mobile et tablette (7)
- Longueur de défilement : à 320, le paragraphe du conseil fait 10 lignes (carte de 690 px, `320-visiteur-avant.png`), ce qui repousse la vidéo à 1,9 écran ; à 375, 1,8 écran. Le visiteur peut ne jamais voir la 3e carte. Correction : sous 768 px, limiter le paragraphe à 4 lignes (`line-clamp-4`) + lien « Lire la suite » 44 px de haut, qui déplie en place (gain ~190 px à 320).
- Cibles : boutons partage/étoile = disques de 32 px (`375-visiteur-avant.png`, x 257-288) et pastilles de réaction ~26 px de haut. L'index annonce un pied de 44 px mais la zone cliquable n'est pas démontrée. Correction : zone cliquable 44 x 44 (padding transparent), espacement de 8 px entre disques, pastilles de réaction à 44 px de zone.
- `768-visiteur-avant.png` : pile de 576 px avec miniature de 526 x 296 px, très haute (la vidéo prend ~580 px). Correction : à 768-1023, `max-height` 240 px sur la miniature (object-fit: cover) ou grille 2 colonnes (vanne + conseil, vidéo en pleine largeur dessous).
- `1024-visiteur-avant.png` : passage pile à 3 colonnes trop brutal, colonne de 309 px, texte du conseil sur 260 px (11 lignes, carte de 698 px), marges de 24 px. Correction : bascule à 3 colonnes à 1100 px ; entre 768 et 1099 garder la pile ou 2 colonnes.
- Focus : seul le bouton « Révéler la chute » est capturé. Focus des accordéons, partage, étoile, lecture vidéo non vérifiable : fournir les captures.

## 7. Finition (8)
- Guillemets doublés « » » dans tous les décryptages ouverts (`375-visiteur-decryptage.png`, `1440-visiteur-decryptage.png`, ligne « Non non, repose-toi. » »). Correction : guillemets internes en « “ ” » ou en simples, ou supprimer le doublon dans le contenu.
- Miniature vidéo : résidu de points lumineux sous la bande jaune, en bas à gauche (`1280-visiteur-avant.png`, y~510 ; `320-visiteur-avant.png`, y~1500). Correction : recadrer en 16:9 avec `object-position: center 40%` pour couper ce bas d'image.
- Bordure de carte (#2a2a2a sur #0c0c0c) à peine visible, surtout 1440 : passer à #3a3a3f.
- Contrastes texte relevés corrects (corps gris clair sur fond carte, lien violet, bouton Premium).

## Handoff (notes + 3 corrections majeures)
Notes : clarté 8, chute 9, hiérarchie 8, cohérence 8, espacements 6, mobile/tablette 7, finition 8 ; globale 7,7/10.
1. PC : aligner les bas de carte (grille stretch, pied non épinglé) et caler header/grille sur le même conteneur (décalage de 21 px à 1280 et 1440).
2. Mobile : limiter le paragraphe du conseil à 4 lignes + « Lire la suite », et ajouter 3 pastilles-ancres sous le H2 pour que la vidéo soit perçue.
3. Cibles : zones cliquables 44 px pour partage/étoile/réactions, bascule 3 colonnes à 1100 px, puis corriger le « » » doublé et fournir les captures de focus restantes.
