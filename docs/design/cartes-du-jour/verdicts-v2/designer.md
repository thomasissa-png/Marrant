# Verdict v2.1 : le designer exigeant (UI senior)

Dossier : `apres-v2-1/`. Lu : `avant`, `chute`, `decryptage`, `lire-suite`, `accordeons` à 1440 ; `avant`/`chute` à 1280 et 1024 ; `decryptage` à 1024 ; `avant`/`chute`/`lire-suite`/`accordeons` à 375 ; `avant`/`decryptage` à 320 ; `avant` à 768 ; `focus-bouton`/`focus-accordeon` 1280 ; `miniature-1` à `-3` à 1280.
Non lues : `focus-partage`/`etoile`/`video`, `zones`, les `focus` 375 et les `miniature` 375. Couleurs estimées à l'oeil.
Contrainte fondateur respectée : « Révéler la chute » reste à 12 px sous l'énoncé, aucune proposition ci-dessous ne le déplace.

## Notes (v1 : 9, 9, 8, 8, 6, 9, 8, global 8)
| # | Critère | v2.1 |
|---|---|---|
| 1 | Clarté | 9 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 9 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 7 |
| 6 | Mobile et tablette | 8 |
| 7 | Finition | 8 |
| **Globale** | | **8,5/10** (barre non atteinte) |

Acquis depuis v1 : pieds alignés dès 1280 (`1440-visiteur-avant.png`), header calé sur le conteneur (Premium finit à x=1328, comme les cartes), icônes Lucide violettes à la place des emojis d'en-tête, titre Conseil en 2 lignes équilibrées, espacement des mots corrigé, accordéons à un seul format, bordures et filets visibles, anneau de focus net (`1280-visiteur-focus-bouton.png`, `-accordeon.png`), double guillemet corrigé (« “Non non, repose-toi.” »).

## 5. Espacements et alignements (7)
- `1440-visiteur-avant.png` : 271 px de vide dans la Vanne entre le bouton (bas y=462) et le filet (y=733). Les cartes sont maintenant à égalité mais la Vanne paraît « vide ». C'est le prix assumé de la contrainte, mais 271 px lisent comme un oubli. Corrections sans bouger le bouton :
  1. Raccourcir la rangée. Mettre le corps Conseil à `line-clamp-4` dès 1280 (-48 px) et ramener l'écart « Lire la suite » vers accordéon de 38 à 16 px (-22 px). Une rangée de ~520 px laisse un vide de ~200 px, plus supportable.
  2. Passer l'énoncé de 30/36 à 36/40 dès 1280 (`text-4xl`), avec `max-w` jusqu'à 3 lignes : -50 px de vide, et la vanne devient le point focal de la rangée.
  3. Ne pas combler avec du contenu inventé, un vide propre vaut mieux qu'un faux contenu.
- `1440-visiteur-decryptage.png` : la Vanne ouverte passe à 971 px et étire Conseil et Vidéo. On y trouve 417 px de noir (y 698 à 1115 dans Conseil, y 717 à 1115 dans Vidéo), pire que le défaut « ragged » de v1. Correction : quand le décryptage est ouvert, désactiver le stretch (`grid:has([data-open]) { align-items: start }`) : les pieds ne sont alors alignés qu'à l'état fermé, ce qui est acceptable.
- `1440-visiteur-lire-suite.png` : « Lire la suite » ouvre le Conseil à 892 px, le vide de la Vanne monte à 346 px. Même remède (stretch coupé quand une carte est étendue). Après `Réduire`, remonter la rangée est correct.
- `1024-visiteur-avant.png` : la colonne unique de 576 px laisse 224 px de vide de chaque côté, alors que le header est pleine largeur. Correction : `max-w-3xl` (768 px) dès 1024, ou 2 colonnes (Vanne + Vidéo à gauche, Conseil à droite).
- `1024-visiteur-avant.png` : la carte Vidéo a un vide de ~70 px à droite sous le titre, sous la miniature de 143 px de haut. Mettre la durée sur la ligne de la chaîne (voir 7) comble ce creux.

## 6. Mobile et tablette (8)
- `375-visiteur-avant.png`, `320-visiteur-avant.png`, `1024-visiteur-avant.png`, `768-visiteur-avant.png` : la pastille « 7 min » (bas droite de la miniature) recouvre le dernier « T » de « ROMAN FRAYSSINET » (« FRAYSSINE… »). La miniature a du texte incrusté, le badge est une collision garantie. Correction : sortir la durée de l'image, en `Montreux Comedy · 7 min` (même ligne que la chaîne, `text-gray-400` 14 px). Sinon, la pastille en haut à gauche (`top-2 left-2`, 12 px, `bg-black/70`).
- `375-visiteur-chute.png` : « dessert. « Pour pas / que tu te fatigues. » » coupe la citation en pleine phrase. Correction : envelopper « … » dans un `inline-block` (`white-space: nowrap` impossible), pour que la citation passe entière à la ligne et que la chute fasse 3 lignes.
- `768-visiteur-avant.png`, `1024-visiteur-avant.png` : la miniature de 255 × 143 px recadre le bas de la ligne « L'INTELLIGENCE DES ANIMAUX ». Correction : `object-position: 50% 40%` ou `aspect-[16/9]` avec la miniature 320 px de large (au lieu de 255 px).

## 7. Finition (8)
- `1440-visiteur-avant.png` : le `line-clamp` coupe au milieu d'un mot (« le visag… », « longues… » à 1024) et rappelle un bug de rendu. Correction : extrait au premier ou deuxième point (côté contenu), ou `mask-image: linear-gradient(#000 60%, transparent)` sans ellipse.
- `1440-visiteur-avant.png` : « Lire la suite » flotte à 25 px sous le texte et à 38 px au-dessus des accordéons. Correction : 8 px sous le texte (zone cliquable de 44 px en `padding`, pas en marge), et 16 px avant l'accordéon.
- `1440-visiteur-chute.png` : chute en 5 lignes de 30/36 (214 px de haut) dont la première, « Ils apportent », est courte et laisse 150 px de vide à droite dans le bloc. Correction : 26/32 dès 1280 (4 lignes, ~170 px), garder `text-wrap: balance`.
- `1440-visiteur-avant.png` : l'ampoule est optiquement plus petite que la tête rieuse et la claquette (traits fins, forme étroite). Correction : `size-5` partout, mais l'ampoule à `size-[22px]`, ou une icône plus carrée (`Lamp`).
- `1280-visiteur-miniature-3.png` : miniature de Chris Esquerre quasi noire, « 1 h 21 » sans fond lisible. Correction : le badge ne doit pas dépendre de l'image (voir 6, durée en texte).
- Positifs : `1280-visiteur-miniature-1.png`, `-2.png` (autres vidéos) : le cadre 16:9 tient avec la durée, même rendu pour 4 miniatures très différentes.

## Handoff
Notes v2.1 : clarté 9, chute 9, hiérarchie 9, cohérence 9, espacements 7, mobile/tablette 8, finition 8. Globale 8,5/10 (barre 10/10 et aucun critère < 9 : non atteinte).
Corrections majeures :
1. Vides PC : `line-clamp-4` + énoncé en `text-4xl` pour réduire le vide de la Vanne (271 px), stretch désactivé quand décryptage ou « Lire la suite » est ouvert (417 px de noir dans Conseil et Vidéo).
2. Durée vidéo : sortir la pastille « 7 min » de la miniature (elle recouvre le « T » de FRAYSSINET à 320, 375, 768, 1024), l'afficher à côté de la chaîne.
3. Chute et extrait : chute à 26/32 avec citation `inline-block` (pas de coupure « Pour pas / que »), extrait Conseil coupé à la phrase ou en dégradé, plus de « visag… ».
