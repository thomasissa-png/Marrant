# Relecture UX à l'aveugle : Bibliothèque, s26 tour 3

Captures vues : 4 comptes x 375, 1280, 1920 (12 pleines pages). 768 et 1456 non ouverts (INDEX : 768 = 2 colonnes, hauteurs cohérentes). Code lu pour les cibles : `bibliotheque/page.tsx`, `bloc-bibliotheque.tsx`, `carte/styles.ts`.

## Gate typographique (TAILLES.md, citée)
- Aperçu (visiteur, gratuit) 375 et 1280 : « TAILLES DISTINCTES : 4 » (24 ou 30, 20, 16, 14), « COMBINAISONS : 6 » : seuils (4 et 6) tenus, pile à la limite.
- Abonné (en-cours, nouvel) 375 et 1280 : 4 tailles, 4 combinaisons. À 768 : 4 tailles, 6 combinaisons. Tout dans l'échelle 14/16/20/24-30, graisses 400/600, aucune capitale au premier écran.
- Gate : PASS pour les 4 comptes. Pas de faute dure typographique.

## Constats (captures)
**Prospect (visiteur, gratuit).** À 375 : bouton d'offre à y ≈ 320, avant tout contenu ; titre « Le faux secret » vers y 600, schéma entier lisible avant y 760 ; bouton de fin vers y 1925. À 1280 : hero 8/4, offre en haut à droite, tuile construction 7/5 avec ses 4 blocs fermés (verrou + barres), catalogue ; bouton de fin à y 1169 (> 900). L'aperçu se lit fermé : repère Premium unique, verrous, barres, contenu atténué, fondu sur « Formules à détourner ». Un seul plein par écran. Vides : fin de colonne droite (≈ 210 px sous « Vocabulaire », permis), fin de carte d'offre (permis). Aucun vide > 32 px au milieu d'un bloc : l'offre « gratuit » a un écart de ≈ 24 px entre ses deux phrases. À 1920 : même composition, contenu 1216 px centré comme le reste du site (marges latérales neutres, pas de colonne seule).

**Abonné (en-cours, nouvel).** Page sans bouton plein (conforme à la spec : lieu de référence). Trois colonnes 4/4/4 à 1280 et 1920, une colonne à 375 avec « Comment c'est construit » en premier, titre aligné à gauche. Compteurs « 0/12 », « 0/8 », « 0/12 » à droite des titres ; première ligne de chaque bloc en gras avec filet blanc de 2 px. Cibles : liens catalogue visuellement 20 px de haut mais `LIEN_NEUTRE` = `min-h-11` (44 px), pastilles de thèmes `min-h-11`, focus `ring-2` : OK au code. Vides de fin de colonne : 224 px (col. 3) et 164 px (col. 2) à 1280/1920, permis.

## Grille UX
| Critère | Note | Défaut précis et correction codable |
|---|---|---|
| 1 Prospect : envie en 3 s | 9 | Les 5 pastilles du hero répètent mot pour mot les titres des tuiles juste dessous (1280 : « Vannes, conseils, vidéos », « Thèmes », « Comment c'est construit »...). Redondance, pas un manque. Pour 10 : retirer les pastilles qui ont leur tuile visible au premier écran (`apercu-bibliotheque.tsx`, liste des pastilles du hero) ; ça libère aussi une ligne dans le hero. Piste, pas faute. |
| 2 Abonné : clarté | 9 | Trois « prochaines lignes » en concurrence (une par colonne), marquées seulement par gras + filet blanc de 2 px, discret à 1280 (« Le faux secret », « Quand on te lance une pique », « Proverbes »). Pour 10 : filet `border-l-4` ou fond `bg-background-elevated` sur la ligne marquée dans `liste-fiches.tsx` (`marquerProchaine`), sans ajout de taille ni de texte. |
| 3 Abonné : envie de continuer | 8 | La progression n'est qu'un « 0/12 » en 14 px gris à droite du titre : pas de repère global (combien de fiches au total, où j'en suis) ni de barre. Pour 10 : mini-barre `h-1 rounded-full bg-border-hover` / remplissage `bg-text-primary` sous chaque titre de bloc dans `BlocBibliotheque` (composant déjà utilisé par l'écran Aujourd'hui, aucun texte neuf, aucun violet). |
| 4 Nouvel abonné | 8 | Rendu strictement identique à « en-cours » (compteurs à 0, mêmes filets) : rien ne dit « commence ici » à un premier jour, trois points de départ égaux. Page non morte (tout est cliquable, catalogue visible) mais sans accueil. Pour 10 : marquer UNE seule ligne de départ (construction « Le faux secret ») plus fortement que les deux autres, dans `page.tsx` via la prop `marquerProchaine` (la passer au seul bloc construction tant que total faits = 0). Un texte d'accueil serait un texte à valider par Thomas (piste « ajouter un mot »). |
| 5 Accessibilité et cohérence | 9 | Cibles 44 px, focus visible, contrastes AA, gate OK, cohérent entre les 4 comptes. À 375 le bloc « Humour noir, fait bien » s'intercale entre vannes et vocabulaire : ordre logique mais un seul bouton « Entrer » (14/600, contour) isolé sans lien visuel avec le reste. Pour 10 : vérifier que `Entrer` a `min-h-11` (`coin-humour-noir.tsx`). |

## Fautes dures
Aucune. Gate typographique tenue, un seul aplat violet par écran (bouton d'offre ; le plein de fin est sous le pli à 1280 et à 375), aucun vide > 32 px au milieu d'un bloc, cibles 44 px confirmées au code.

## Pistes (3 max)
1. Une seule ligne de départ plus marquée pour le nouvel abonné (critères 2 et 4).
2. Mini-barre de progression sous le titre de chaque bloc (critère 3).
3. Retirer du hero les pastilles redoublées par les tuiles (critère 1).

NOTE GLOBALE : 8/10

Fautes dures : aucune.
