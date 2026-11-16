# Relecture UX à l'aveugle, s25 navigation v6, tour 4, groupe « favoris-profil »

Périmètre : `/favoris` (visiteur, gratuit, en-cours, nouvel) et `/profil` (gratuit, en-cours, nouvel).
Captures : `docs/captures/s25/v6-tour-4/{favoris,profil}/`. Lues : 375, 768 (en-cours favoris), 1280 et 1920 pour chaque compte, 375 pour les trois profils. Code vérifié : `favoris-list.tsx`, `profil-dashboard.tsx`, `question-equipe-card.tsx`.
Cibles tactiles : « Retirer » et onglets portent `min-h-11` (44 px) quand l'espace est ouvert (`favoris-list.tsx`, `CIBLE_44`) : conforme, aucune faute. Vignettes vidéo : aucune dans ces captures.

## Notes

| Critère | Note | Raison courte |
|---|---|---|
| D1 Fidélité à l'accueil | 9 | Filet violet, `rounded-xl`, titres centrés : OK. Bandeau « Reprendre ton parcours » sans filet (variante voulue, lisible). |
| D2 Hiérarchie et lisibilité | 9 | Titres et chiffres clairs. Textes `text-xs text-text-muted` nombreux (étapes, %, lettre) : limite basse. |
| D3 Mise en page 5 largeurs | 7 | Vides internes massifs (cartes vannes étirées, carte « question » quasi vide), voir fautes dures 1 et 2. |
| D4 Cohérence avec l'espace | 8 | Une carte sans titre parmi des cartes titrées. |
| D5 Finition | 8 | Décalage de 4 px entre texte de vanne et titre de conseil sur une même rangée. |
| U1 Compréhension | 9 | Titres et sous-titres immédiats. |
| U2 Action principale | 8 | Nouvel abonné : trois pistes de poids égal puis un second CTA « Découvrir les parcours ». |
| U3 États vides / nouvel | 9 | Favoris vide : emoji, phrase, CTA unique. Profil nouvel : jamais une page morte. |
| U4 Aperçu Premium | 9 | Une offre, un bouton, pas de mur ; gratuit sans « Connexion », visiteur avec : cohérent. |
| U5 Accessibilité / cohérence comptes | 9 | 44 px OK, onglets défilants avec indice de suite à 375. |

**NOTE GLOBALE : 7/10** (minimum des critères, deux fautes dures).

## Fautes dures

### 1. Favoris : cartes étirées, grands vides dans les vannes (D3)
- Fichiers : `favoris/en-cours-favoris-1280.png`, `-1456`, `-1920`, `-768.png`, aussi `nouvel` n'est pas concerné (vide).
- Défaut : `items-stretch` aligne la hauteur des 3 cartes sur le conseil déplié (texte entier visible). Les deux vannes montrent 2 lignes puis environ 200 px vides à 1280+ ; à 768 la première vanne a environ 270 px vides, et la 3e carte est seule en bas à gauche avec un trou à sa droite.
- Correction codable : `apps/web/src/components/favoris/favoris-list.tsx`, carte conseil : ajouter `line-clamp-5` au `<p>` du contenu quand `!isExpanded` (et le retirer à l'ouverture) pour ramener le conseil à une hauteur proche de celle des vannes ; grille : remplacer `items-stretch` par `items-start`, ou passer en colonnes (`md:columns-2 lg:columns-3 gap-4`, cartes `break-inside-avoid mb-4`) pour supprimer le trou à 768.
- Ce qui ferait 10 : rangée de cartes dont aucune n'a plus de 25 % de vide, et pas de carte orpheline avec trou à 768.

### 2. Profil Premium : carte « Ta question à l'équipe » sans titre et presque vide (D3, D4)
- Fichiers : `profil/en-cours-profil-1280.png`, `-1456`, `-1920`, `nouvel-profil-1280.png`.
- Défaut : seule carte sans titre de l'espace ; une ligne de texte posée au milieu d'une carte étirée à la hauteur de « La lettre de la semaine » (environ 160 px, 100 px vides). Elle ressemble à une carte cassée à côté de ses voisines titrées. À 375 la même carte est correcte (une ligne), le défaut est de 1024 px et plus.
- Correction codable (sans texte nouveau) : `apps/web/src/components/espace/profil/ligne-mes-questions.tsx` : centrer verticalement le contenu (`flex h-full items-center`) ; ou, dans `profil-dashboard.tsx`, sortir cette ligne du `GroupeCourt` pour la rendre pleine largeur sous la grille 2 colonnes (`lg:col-span-2`, hauteur naturelle). Un titre de carte serait une proposition de texte : « à valider par Thomas », sans effet sur la note.
- Ce qui ferait 10 : carte à hauteur naturelle ou contenu centré, cohérent avec les autres cartes.

## Pistes (ne retiennent pas la note)

1. Profil Premium, carte « Ton prénom » seule, centrée à demi-largeur sous une grille de 2 (`GROUPE_COURT`, `lg:[&>:last-child:nth-child(odd)]`). Voulu par le tour 3, lisible, mais la rupture de grille se voit. Option : pleine largeur avec champ borné.
2. Profil nouvel, « Prochaine étape » : trois cartes de poids égal sans bouton, puis « Découvrir les parcours » plus bas. Pour une action unique : mettre un seul lien en bouton primaire dans `profil-dashboard.tsx` (premier bloc `Link`) et garder les autres en lien discret. Cartes-liens sans chevron : ajouter une flèche « → » en `text-accent-link`.
3. Favoris : « Clique pour la chute » est un texte gris (`text-text-muted`) sans affordance de bouton, alors que l'accueil propose « Révéler la chute » en bouton. La carte entière est cliquable et accessible au clavier : OK. Piste : style bouton secondaire.
4. Favoris : « Retirer » est immédiat, à côté de « Partager », sans confirmation ni annulation visible sur les captures. Piste : toast « Retiré · Annuler ».
5. Favoris : alignement vertical vanne/conseil décalé de 4 px (`CardContent` sans `pt` contre `CardHeader`).
6. Profil gratuit : sous-titre « Ta progression, tes stats, ton parcours vers la légende » alors que le gratuit ne voit ni progression ni stats. Texte validé, à ne pas réécrire ; signalé pour Thomas.
7. Profil : carte « Supprimer mon compte » pleine largeur, texte borné à environ 640 px, moitié droite vide à 1280+. Convention de zone danger, acceptable.
8. Aperçu Premium des favoris : l'exemple montre une vanne et un conseil, mais pas le geste de sauvegarde (étoile, onglets). Ajouter une étoile pleine sur les cartes d'exemple montrerait la fonction sans nouveau texte.
9. Textes `text-xs text-text-muted` (étapes, pourcentage, mentions lettre) : vérifier le contraste AA dans `tailwind.config.ts` ; non mesurable sur capture.

## Points conformes
- Favoris vide (nouvel) : un message, un CTA unique, filet, onglets visibles. 375 sans débordement.
- Aperçu Premium favoris (visiteur, gratuit) : une offre, bouton unique, header et bande avec cadenas, cohérent 375 à 1920.
- Profil : « Reprendre ton parcours » en tête pour l'abonné avancé, états vides du nouvel abonné jamais morts, pas de débordement à 375, colonnes alignées à 1280, 1456 et 1920.

NOTE GLOBALE : 7/10
