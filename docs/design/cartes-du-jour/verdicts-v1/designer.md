# Verdict v1 : le designer exigeant (UI senior)

Dossier jugé : `apres-v1/` (captures, 6 largeurs). Lu : `avant`, `chute`, `decryptage` à 320/375/768/1024/1280/1440, `accordeons` à 375/1024/1440, `focus` 1280.
Les captures `accordeons` 320, 768, 1280 et `focus` 375 ne sont pas lues. Les couleurs sont estimées à l'oeil : les tokens cités sont des hypothèses.

## Notes
| # | Critère | Note |
|---|---|---|
| 1 | Clarté | 9 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 8 |
| 4 | Cohérence | 8 |
| 5 | Espacements et alignements | 6 |
| 6 | Mobile et tablette | 9 |
| 7 | Finition | 8 |
| **Globale** | | **8/10** (barre de sortie 10/10 et aucun critère < 9 : non atteinte) |

## 1. Clarté (9)
- `1440-visiteur-avant.png` : le pointillé « Révéler la chute » est lisible, mais la pastille rouge de lecture et la bande jaune de la miniature sont les éléments les plus saturés de la rangée. Ils concurrencent l'action de la vanne. Correction : poser un voile `bg-black/15` sur la miniature, et passer le bouton play de rouge #dc2626 à une pastille blanche 56 px avec triangle violet (token accent), ou au moins réduire sa saturation.

## 2. « Révéler la chute » (9)
- `375-visiteur-chute.png` : la chute casse en « … « Pour pas que tu te / fatigues. » », avec un orphelin « fatigues. » ». Correction : `text-wrap: balance` sur le bloc chute, plus une espace insécable avant « » ». Même défaut en moindre mesure à `1440-visiteur-chute.png` (« tu te fatigues. » » sur la dernière ligne).
- `1440-visiteur-avant.png` et `1280-visiteur-focus.png` : le bord haut du bouton est à 12 px du texte de l'énoncé, et l'anneau de focus (2 px + offset) frôle la ligne « chez moi. ». Correction : 16 px (`gap-4`) entre énoncé et emplacement. Garder la même valeur dans l'état chute, pour éviter tout saut de 4 px.
- `1440-visiteur-avant.png` : la bordure pointillée violette (~#5b3fa0 sur #25213a) tombe à ~2,5:1. Correction : bordure `violet-400/70`, pour viser ≥ 3:1 (WCAG 1.4.11).
- Positif : la chute prend la place exacte du bouton (même y, même largeur), sans saut. Le bloc boxed en semi-gras 24 px se lit bien.

## 3. Hiérarchie (8)
- `1440-visiteur-avant.png` : trois titres, trois styles. Vanne 26/32 Inter regular. Conseil 18/28 display semi-gras. Vidéo 18/28 display semi-gras. Le titre Conseil a un interlignage de 1,55, trop lâche pour un titre. Correction : 18/24 (`leading-6`) pour les titres Conseil et Vidéo.
- `1440-visiteur-avant.png`, `375-visiteur-avant.png` : l'espacement des mots des titres display est trop serré. On lit « dujour » (H2), « etle silence » (Conseil), « L'intelligence » collé. Correction : réduire le letter-spacing négatif (-0.025em vers -0.01em) ou ajouter `word-spacing: 0.06em` sur la famille display.
- `1440-visiteur-avant.png` : le titre Conseil casse à 232 px alors que la colonne en fait 340. Il part sur 2 lignes (« …tes / meilleurs alliés ») quand « La pause et le silence : tes meilleurs » tiendrait (~320 px). Cause probable : une `max-width` ou un `balance` appliqué. Correction : retirer toute contrainte de largeur sur le titre, `text-wrap: pretty`. Même constat à `1280-visiteur-avant.png`.
- `1440-visiteur-avant.png` : le corps du Conseil (white pur sur #1f1f1f) est plus contrasté que les textes d'accordéon (gris ~#a0a0a0). C'est cohérent, mais le corps à 14/24 pèse 10 lignes et domine la rangée. Voir critère 5.

## 4. Cohérence (8)
- `1440-visiteur-decryptage.png` : l'accordéon « Pourquoi ça marche » (en-tête 2 lignes, 58 px, titre + sous-titre collés sans interligne) diffère des 4 autres (1 ligne, 46 px). Correction : soit mêmes 46 px avec le sous-titre déplacé dans le corps, soit les 5 en-têtes à 2 lignes. Ne pas laisser un seul format.
- `1440-visiteur-accordeons.png` : fermé = aplat #2a2a2a sans bordure. Ouvert = bordure 1 px + fond identique. Le passage fermé vers ouvert ajoute une bordure et fait bouger le contour d'1 px. Correction : bordure 1 px `border-transparent` à l'état fermé (la même `border-white/8` à l'ouvert).
- `1440-visiteur-avant.png` : le pied de carte est correct (filet + 44 px) mais la Vanne affiche pastilles 🔥 8 / 💀 1 à gauche, Conseil et Vidéo un vide à gauche. Pas un bug, mais le vide est inexpliqué. À assumer, ou bien ajouter un libellé « Partager » (texte > icône seule).
- `1440-visiteur-decryptage.png` : « À toi de jouer » (semi-gras blanc 14) est collé à son paragraphe (0 px) mais précédé d'une ligne vide de 24 px. Correction : `mt-4 mb-1`, en `text-xs uppercase tracking-wide violet-300`, pour le distinguer d'un titre d'accordéon.
- `1440-visiteur-decryptage.png` : « repose-toi. » » : double guillemet fermant (citation imbriquée). Défaut typographique visible, à corriger dans le contenu (« … » puis ‹ … › ou guillemets anglais intérieurs).
- Icônes : deux langages. Emojis couleur 24 px en en-tête (😂 💡 🎬) et en pastilles de réaction (🔥 💀), face à des pictos linéaires 16 px pour œil, partager, étoile, chevrons. Les emojis varient selon l'OS (le 🎬 est gris-bleu plat à `1440-visiteur-avant.png`). Correction : Lucide `Laugh`, `Lightbulb`, `Clapperboard`, 20 px, stroke 1.75, `violet-300`. Garder 🔥 💀 seulement s'ils sont un choix de marque.

## 5. Espacements et alignements (6) : critère le plus faible
- `1440-visiteur-avant.png` : la rangée est déséquilibrée. Hauteurs 346 px (Vanne, bas à y=571), 626 px (Conseil, y=851), 601 px (Vidéo, y=826). Trois pieds de carte sur trois lignes différentes, et 280 px de vide noir sous la Vanne. Correction : `items-stretch` et pied `mt-auto` (carte en `flex flex-col`, pied collé en bas) pour aligner les filets de pied.
- Pour réduire l'écart d'origine : limiter le corps Conseil à 6 lignes sur PC (`line-clamp-6` + « Lire la suite »), ou couper le texte éditorialement. Cible : un écart ≤ 80 px entre les trois cartes.
- `1024-visiteur-avant.png` : l'écart est encore plus fort (Vanne 338 px contre Conseil 698 px), soit 360 px de vide. Même correction.
- `1440-visiteur-decryptage.png` : après ouverture, la Vanne passe à 895 px, Conseil 625 px, Vidéo 600 px. Les trois bords bas divergent à nouveau. Le stretch règle cela mais laisse du vide dans les cartes courtes. À arbitrer avec l'équipe (le choix « bord haut commun, hauteurs libres » est assumé par l'index, mais le résultat visuel reste ragged).
- `1440-visiteur-avant.png` et `1280-visiteur-avant.png` : le header déborde à droite. « Premium » finit à x=1349 (1440) et x=1269 (1280), alors que les cartes finissent à 1328 et 1248, soit +21 px. Le header est asymétrique : marge gauche 112 px, marge droite 91 px (1440). Correction : même conteneur (`max-w-7xl px-…`) pour le header et la section.
- Rythme vertical, correct sinon : 16 px entre blocs, 8 px entre accordéons, gouttière 24 px. Image vers titre 21 px et tags vers image 17 px, alors que tags vers titre en fait 21 : un 16 px commun serait plus net.
- `1440-visiteur-avant.png` : l'énoncé de la Vanne passe à la ligne tôt, « chez moi. » seul. Correction : `text-wrap: balance` donne « Mes amis adorent venir / dîner chez moi. ».

## 6. Mobile et tablette (9)
- `375-visiteur-avant.png` : les boutons partager et étoile font 32 px et les pastilles 🔥 💀 24 px de haut, sous les 44 px demandés. Correction : zone cliquable 44 px (`before:-inset-2` ou `size-11` avec picto 16 px), sans changer le visuel.
- `768-visiteur-avant.png` : la colonne unique de 576 px donne une mesure de ~85 caractères pour le corps du Conseil (trop long). Correction : `max-w-[65ch]` sur le texte courant, ou 2 colonnes (Vanne + Conseil, puis Vidéo pleine largeur).
- `320`, `375`, `1024` : rien de coupé, pieds sur une ligne à 320. OK.

## 7. Finition (8)
- `1440-visiteur-avant.png` : la bordure de carte (~#2e2e2e sur #0d0d0d, ~1,3:1) et le filet de pied (~#2a2a2a sur #1f1f1f, ~1,2:1) sont à peine perceptibles. Correction : bordure de carte `white/10`, filets `white/8` au minimum. Aplat des accordéons fermés `white/6` sur la carte.
- `1440-visiteur-avant.png` : la miniature a 4 à 5 px de points lumineux résiduels sous la bande jaune (x≈987 et 1010, y≈512), signe d'un recadrage d'une vignette 4:3. Correction : `object-cover object-[50%_35%]` ou `scale-[1.03]` avec overflow caché. Même défaut visible à `1024-visiteur-avant.png`.
- `1440-visiteur-avant.png` : les tags (12 px, gris ~#a0a0a0 sur #2b2b2b) restent lisibles (~5:1) mais petits. Correction : 12/16 avec `px-2.5 py-1`, le texte à `gray-300`.
- Positifs : anneau de focus violet 2 px net (`1280-visiteur-focus.png`), liseré violet haut cohérent sur les 3 cartes, rayons homogènes.

## Handoff
Notes : clarté 9, chute 9, hiérarchie 8, cohérence 8, espacements 6, mobile/tablette 9, finition 8. Globale 8/10 (barre non atteinte).
3 corrections majeures :
1. Rangée PC (`1440`/`1024-avant`) : `items-stretch` et pied `mt-auto`, `line-clamp-6` sur le corps Conseil, header et section dans le même conteneur (+21 px de débord à droite).
2. Typo : retirer la contrainte de largeur du titre Conseil (casse à 232/340 px), rétablir l'espacement des mots display (« dujour »), `text-wrap: balance` sur l'énoncé et la chute (orphelin « fatigues. » » à 375), et corriger « » » ».
3. Finition : bordures et filets à `white/10` et `white/8`, un seul format d'en-tête d'accordéon (46 px), icônes d'en-tête en un seul langage (Lucide), cibles tactiles 44 px, recadrage de la miniature.
