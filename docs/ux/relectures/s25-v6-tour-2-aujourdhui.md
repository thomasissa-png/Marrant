# Relecture UX à l'aveugle, tour 2 : groupe « aujourdhui » (navigation v6, s25)

Captures : `docs/captures/s25/v6-tour-2/aujourdhui/` (20 PNG, 4 comptes x 5 largeurs, toutes ouvertes). Étalon : accueil 1280. Barre : 9/10 sans faute dure.
Fichiers de code probables (non lus, déduits de l'arborescence) : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx` (aperçu visiteur et gratuit), `apps/web/src/config/textes/espace-apercu.ts` (textes).

## Constat par compte

- **visiteur / gratuit** (même page d'aperçu, gratuit sans lien « Connexion », cohérent) : H1 « Aujourd'hui », sous-titre d'aperçu, une fiche réelle lisible en entier (« Amis : Tu as changé quelque chose, non ? »), un bloc offre avec un seul bouton plein « Premium · 1,99 €/mois ». À 375 et 768 : fiche puis bloc offre en dessous, propre. À 1280, 1456, 1920 : fiche en colonne gauche (~700 px), bloc offre en colonne droite (~490 px).
- **en-cours** : carte héros « Si tu as 5 minutes » + bouton unique « Les cartes du jour », deux lignes Nouvelle / À revoir, carte Mission, carte « Où veux-tu être plus à l'aise ? », puis « Contenu du jour » en 3 cartes (2 + 1 pleine largeur à 768, empilées à 375).
- **nouvel** : héros « Ton premier pas » + « Commencer » (5 min), puis « Contenu du jour ». Pas de page morte.

## Notes

### Design
| Critère | Note | Détail |
|---|---|---|
| 1 Fidélité accueil | 9 | Filet dégradé violet en haut des cartes, `rounded-xl`, pastilles, bouton plein violet : conforme. Écart léger : H1 et titres de section alignés à gauche là où l'accueil centre ; identique sur toute la rubrique, donc piste, pas faute. |
| 2 Hiérarchie, lisibilité | 9 | H1 > carte > détail net. Piste : « Prends ton temps » et le corps gris de « Ta réponse d'abord » restent petits et peu contrastés (visiteur-aujourdhui-1280). |
| 3 Mise en page 5 largeurs | **6** | **Faute dure** : à 1280, 1456, 1920 (visiteur et gratuit), le bloc offre ne fait que ~95 px de haut dans une colonne droite de ~490 px, sous lequel il reste un trou d'environ 490 x 310 px jusqu'au pied de page (`visiteur-aujourdhui-1280.png`, `-1456`, `-1920`, `gratuit-aujourdhui-1280`, `-1920`). Le bloc offre est en plus quasi vide : un bouton et un lien dans une carte large. Brief : « aucun vide à droite à 1280+ ». Autres comptes : pas de débordement, pas de colonne collée (en-cours et nouvel sont pleine largeur à 1280+, corrects). |
| 4 Cohérence espace | 9 | Rythme et cartes homogènes entre comptes. Piste : en-cours-aujourdhui-1280, la carte Mission et la carte Conseil du jour ont la moitié basse vide (cartes étirées à la hauteur du voisin). |
| 5 Finition pixel | 9 | Alignements propres, cibles ~44 px (boutons, pastilles). Piste : à 375 la fin du chip « Quoi répondre » est coupée par le fondu, conforme à la spec de la bande. Les vignettes vidéo sont un dégradé sans image (en-cours-aujourdhui-1280) : à confirmer que ce n'est pas un chargement. |

### UX
| Critère | Note | Détail |
|---|---|---|
| 1 Compréhension | 10 | H1 + sous-titre d'aperçu + chip allumé : on sait où on est. |
| 2 Action principale unique | 9 | Un seul bouton plein par page dans les 3 états. Piste : dans l'aperçu, les boutons « Oui / À moitié / Rien » ressemblent à des commandes inactives grises sans dire qu'elles sont réservées ; à clarifier (texte, à valider par Thomas). |
| 3 États vides, nouvel abonné | 10 | « Ton premier pas » avec une action claire, aucun vide. |
| 4 Aperçu Premium | 8 | Valeur visible (vraie fiche), une seule offre, pas de mur ni de pop-up. Faiblesse : le bloc offre ne dit rien de ce que Premium ouvre ; une phrase serait un texte nouveau, **à valider par Thomas**, ne retient pas la note. Le vide du desktop affaiblit aussi l'offre. |
| 5 Accessibilité, cohérence | 9 | Lien « Connexion » souligné, chip actif souligné (pas seulement la teinte), cadenas présents pour visiteur et gratuit, absents pour l'abonné. Cohérent entre comptes. |

## Faute dure

1. Vide d'environ 490 x 310 px à droite sous le bloc offre, à 1280, 1456 et 1920, pour visiteur et gratuit. Correction codable dans `apercu-rubrique.tsx` : ne plus mettre le bloc offre en colonne 2 d'une grille de 2 colonnes ; le placer pleine largeur sous la fiche (comme déjà fait à 375 et 768, donc `grid-cols-1` à toutes les largeurs, offre en `w-full` avec bouton et lien centrés, `rounded-xl` à filet violet comme l'étalon), ou un bloc offre `sticky top-[130px]` si la colonne droite est conservée et alors enrichi avec des éléments réels de la rubrique (2 ou 3 cartes, spec §2 point 2). Ce qui ferait 10 : disposition sans trou à 1280+, offre centrée, et une 2e/3e carte réelle d'aperçu.

## Pistes (ne retiennent pas la note)
- Cartes étirées à hauteur égale avec contenu court (Mission, Conseil) : `items-start` sur la grille ou contenu aligné, `apps/web/src/components/espace/` (carte Aujourd'hui).
- Contraste des petits textes gris dans la fiche d'aperçu : vérifier `text-text-secondary` sur fond carte.
- Titres alignés à gauche vs centrés sur l'accueil : décision de gabarit, à arbitrer avec @design.

NOTE GLOBALE : 6/10
