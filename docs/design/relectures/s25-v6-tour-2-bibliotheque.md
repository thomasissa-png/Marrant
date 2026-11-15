# Relecture DESIGN à l'aveugle, tour 2, groupe bibliotheque (navigation v6)

Captures lues : `v6-tour-2/bibliotheque/` visiteur 1280 et gratuit 375 (le gratuit partage le gabarit du visiteur, l'INDEX donne les mêmes hauteurs), en-cours 375 et 1280, nouvel 768 (même hauteur que en-cours) ; `v6-tour-2/fiches/` en-cours formule 1280, vocabulaire 1920, construction 768, nouvel humour-noir 1280, nouvel a-plat 375. Étalon : accueil visiteur 1280. Les autres largeurs (1456, 1920) partagent la coque `max-w-7xl` selon la spec : non rouvertes une à une, à confirmer.

## Notes (Design)

| Critère | Note | Constat |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Cartes `rounded-xl` à filet violet en haut, pastilles, rythme aéré : conforme. Le H1 est aligné à gauche (gabarit B de l'espace, pas centré comme l'accueil) : cohérent entre les pages de l'espace, pas une faute. |
| 2 Hiérarchie, lisibilité | 9 | H1, titres de cartes, listes à lignes de 44 px lisibles ; fiches : titres de section en gras, corrections en gris atténué mais lisibles. |
| 3 Mise en page 5 largeurs | 6 | Faute dure à 1280+ sur l'aperçu Premium (visiteur, gratuit), voir 1. Abonné : 2 colonnes équilibrées à 768 et 1280, une seule colonne à 375, aucun débordement ; fiches centrées en colonne de lecture, rien de collé à gauche. |
| 4 Cohérence espace | 9 | Fiches et rubrique parlent la même langue (carte « À toi » à filet, pastilles « Ton retour »). |
| 5 Finition | 9 | Alignements propres. Pistes seulement (voir plus bas). |

## Fautes dures

1. Aperçu Premium visiteur/gratuit à 1280, 1456, 1920 (`visiteur-bibliotheque-1280.png`, `gratuit-bibliotheque-1280.png`) : la colonne de droite ne contient qu'une carte basse de ~95 px (bouton « Premium · 1,99 €/mois » et « Connexion », sans titre ni phrase de valeur) puis un vide de ~720 px jusqu'au pied de page, face à la fiche de 820 px à gauche. C'est le « vide à droite à 1280+ » interdit par la grille. Correction codable : rendre la carte offre `lg:sticky lg:top-[130px]` (sous le bloc de 114 px) pour qu'elle suive la lecture, ou passer l'aperçu en colonne unique centrée `max-w-3xl mx-auto` avec la carte offre sous la fiche (comme à 375, qui est correct) ; aligner le contenu de la carte (bouton centré `w-full`, lien Connexion dessous centré). Ce qui ferait 10 : l'une des deux solutions, sans ajouter de texte non validé.

## Pistes (ne retiennent pas la note)

- `en-cours-bibliotheque-1280.png` : colonne gauche finit ~130 px plus haut que la droite (Formules à détourner). Équilibrage possible en déplaçant « Vocabulaire » ou en `items-start`, déjà acceptable.
- Liens « Vannes Conseils Vidéos » de la carte 1 : texte seul souligné, cible < 44 px de haut ; ajouter `inline-flex min-h-[44px] items-center` (fichier de la page bibliothèque).
- `nouvel-fiche-a-plat-375.png` : boutons « Oui / À moitié / Rien » très sombres, bord et texte peu contrastés ; vérifier le 3:1 du bord (`border-border` vers `border-border-strong`).
- Pied de page : colonne « Produit » à deux sous-colonnes avec un grand intervalle à 1280 (hors périmètre).

## Verdict

Barre 9/10 non atteinte à cause de la faute dure 1 (aperçu Premium à 1280+). Fiches et vue abonné/nouvel : au niveau 9.

NOTE GLOBALE : 6/10
