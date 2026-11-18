# Relecture DESIGN à l'aveugle : Bibliothèque, s26 tour 1

Périmètre : aperçu verrouillé (visiteur, gratuit) et vue abonné (en-cours, nouvel). Captures lues : 375, 1280, 1920 des 4 comptes, plus 768 visiteur et en-cours (1456 non ouvert : même gabarit que 1280, conteneur plafonné). Code lu : `app/(dashboard)/mon-espace/bibliotheque/page.tsx`, `components/espace/bloc-bibliotheque.tsx`, `coin-humour-noir.tsx`, `apercu/apercu-bibliotheque.tsx`, `carte/styles.ts`.

Décisions déjà prises, non notées : verrouillage réel, titre d'aperçu en dégradé, promesse du hero, filet violet retiré, « La suite est dans Premium ».

## Gate typographique (TAILLES.md, premier écran, citée)

| Compte | 375 | 1280 |
|---|---|---|
| visiteur, gratuit | 4 tailles (24, 20, 16, 14), 6 combinaisons | 4 tailles (30, 20, 16, 14), 6 combinaisons |
| en-cours, nouvel | 4 tailles (24, 20, 16, 14), 5 combinaisons | 4 tailles (30, 20, 16, 14), 6 combinaisons |

Même résultat à 768 et 1920. Seuils (4 tailles, 6 combinaisons) respectés partout, aucune taille hors échelle, graisses 400/600 seulement. Gate PASS. L'aperçu a 6 combinaisons au plafond (16/600 du bouton d'offre, 14/600 des étiquettes) : aucune marge restante, toute correction doit réutiliser l'existant.

## Constats visuels

Aperçu (visiteur, gratuit) :
- Se lit fermé : repère « Premium » unique, bouton d'offre en haut à droite (1280/1920, 768) ou juste sous la promesse (375), tuiles en cadenas avec barres grises, fondu sur la dernière rangée à 375, « La suite est dans Premium » en pied. Un seul aplat violet par écran (le deuxième bouton plein n'apparaît qu'en bas de page, jamais dans le même viewport 900 px). Conforme au modèle d'« Aujourd'hui ».
- Largeur : hero en deux zones (texte / carte d'offre), rangée 7/5 colonnes, rangée 6/6. Aucun débordement à 375, 768, 1280, 1920.
- Vide au milieu d'un bloc : aucun supérieur à 32 px relevé (hero 30 px entre pastilles et « 1 500+ », 48 px entre blocs, 26 px entre « Voici un exemple » et les tuiles).
- Tuile « Vannes, conseils, vidéos » à 1280 et 1920 : étirée à la hauteur de « Comment c'est construit », vide d'environ 230 px sous les liens Vannes/Conseils/Vidéos (y 670 à 902 sur la capture 1280). Vide en fin de carte, donc permis, mais c'est une tuile creuse : voir critère 3.
- Carte d'offre visiteur : environ 56 px sous « Connexion » (fin de carte, permis) ; version gratuite remplie par la phrase d'objet : même hauteur, cohérent.
- À 768, la preuve « 1 500+ » passe dans la carte d'offre et la colonne gauche du hero garde environ 70 px libres sous les pastilles (fin de colonne, permis).

Abonné (en-cours, nouvel) :
- Trois colonnes dès 1024 px (CSS columns, `break-inside-avoid`) : col 1 = Vannes + Humour noir + Construit (12 lignes), col 2 = Vocabulaire (8), col 3 = Formules (12). Hauteurs mesurées sur la capture 1280 (x1,10) : col 1 environ 1 560 px, col 3 environ 860 px, col 2 environ 600 px. Vide sous la colonne 2 : environ 800 px, sous la colonne 3 : environ 540 px, identique à 1280, 1456 et 1920. Fin de colonne, donc permis par la règle, mais c'est la moitié basse de la page vide à droite : le 3 colonnes n'utilise la largeur que sur le premier tiers de la hauteur.
- À 768 (2 colonnes) : colonnes quasi équilibrées (environ 1 300 / 1 350 px), rien à redire. À 375 : pile unique propre, 4 cartes, 24 px entre cartes.
- Cibles 44 px vérifiées au code : pastilles de thèmes `min-h-11`, liens du catalogue `LIEN_NEUTRE` (`min-h-11`), « Entrer » `BOUTON_SECONDAIRE` (`min-h-11`), lignes de liste de 50 à 55 px. Compteurs « 0/12 » en 14/400 `text-secondary`, lisibles.
- Marqueur « prochaine » (filet blanc à gauche de la première ligne, graisse 600) : lisible, sobre, un seul par liste. Le filet suit l'arrondi de la ligne ; correct.
- Comptes : en-cours et nouvel sont pixel-identiques (0/12, 0/8, 0/12, Entrer fermé). La capture « en-cours » ne montre donc aucun état d'avancement : la vue « abonné avancé » n'est pas démontrée visuellement (à corriger côté jeu de données de capture, pas côté design).
- Cohérence aperçu / abonné : titre blanc 24/30 sans dégradé côté abonné contre dégradé côté aperçu (décidé). Mêmes rayons 12 px, mêmes paddings 24 px, mêmes écarts 24 px, mêmes tailles.

## Notes par critère (Design)

1. Élégance et fidélité à l'accueil : **9/10**. Une seule couleur d'accent, retenue, alignements francs à gauche sur les 5 largeurs. Pour 10 : résoudre la tuile creuse (voir 3).
2. Hiérarchie : **9/10**. Aperçu : bouton plein en haut à droite domine, titre ensuite, tuiles atténuées. Abonné : pas de zone dominante (trois listes de poids égal), acceptable pour une bibliothèque. Pour 10 : aucun second accent, rien à retirer ; la dominance de l'abonné viendrait de la prochaine ligne (déjà marquée).
3. Usage de la largeur : **8/10**. Défauts : (a) abonné, vide d'environ 800 px sous la colonne centrale et 540 px sous la colonne droite dès 1024 px ; (b) aperçu, tuile Vannes creuse de 230 px à 1280/1920. Aucune faute dure (vides de fin de colonne et de fin de carte permis), mais c'est ce qui empêche 9. Corrections codables ci-dessous.
4. Cohérence entre comptes : **9/10**. Même gabarit d'aperçu pour visiteur et gratuit, même cadre d'abonné pour en-cours et nouvel. Retire 1 point pour la preuve non montrée de l'état d'avancement (en-cours = nouvel).
5. Finition au pixel : **9/10**. Cibles 44 px au code, focus visibles (`ring-2 ring-accent-primary`), rayons et paddings tenus, textes `text-primary`/`text-secondary` en AA. Reste mineur : `BOUTON_SECONDAIRE` (`carte/styles.ts`) garde `hover:border-text-muted` et `aria-disabled:text-text-muted` alors que l'échelle supprime `text-muted` de l'espace (invisible hors survol/désactivé, piste).

## Corrections codables (pistes, pas fautes dures)

- P1, abonné, vide de colonnes : remplacer `md:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid` dans `bibliotheque/page.tsx` par une grille `grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-start` avec trois colonnes explicites en `lg` : colonne A = Construit, colonne B = Formules, colonne C = Vannes + Humour noir + Vocabulaire (empilés `space-y-6`) ; en `md` garder les colonnes CSS actuelles (équilibrées). Hauteurs estimées 780 / 785 / 1 050 px : le plus grand vide tombe de 800 à environ 270 px en fin de colonne. Aucune taille ni classe typo ajoutée.
- P2, aperçu, tuile creuse : dans `apercu-bibliotheque.tsx`, passer `items-start` sur la rangée 1 (`lg:items-start`) pour que la tuile Vannes prenne sa hauteur de contenu au lieu d'être étirée ; le vide devient un vide de colonne, pas de carte. Alternative : à 1024+ placer Vocabulaire sous Vannes dans la colonne 5/12 et Formules sous Construit, ce qui remplit la zone sans texte nouveau.
- P3, données de capture : peupler le compte en-cours (faits > 0, prochaine ligne avancée) pour que la vue « abonné avancé » soit relisible. Hors code design.

## Fautes dures

Aucune : gate typographique PASS, un seul aplat violet par écran, aucun vide supérieur à 32 px au milieu d'un bloc, aucun débordement, cibles 44 px au code. Les deux vides relevés sont en fin de colonne ou de carte (permis).

NOTE GLOBALE : 8/10

Fautes dures :
(aucune)
