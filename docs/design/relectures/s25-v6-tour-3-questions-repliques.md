# Relecture DESIGN à l'aveugle, tour 3 : Mes questions + Mes répliques (navigation v6)

Captures lues : `docs/captures/s25/v6-tour-3/{questions,repliques}/` (visiteur, gratuit, en-cours, nouvel ; 375 à 1920). Visiteur et gratuit voient la même page d'aperçu (seul l'en-tête change). Lues en détail : 1280 des 4 comptes sur les deux pages, 375 en-cours (2 pages), 375 gratuit, 768 nouvel/gratuit, 1920 en-cours répliques ; 1456 et 1920 des autres comptes non ouverts un à un (le plafond `max-w-7xl` les rend identiques à 1280 d'après l'INDEX : hauteurs identiques).

## Notes (Design)

| Critère | Note |
|---|---|
| 1 Fidélité à l'accueil | 8 |
| 2 Hiérarchie et lisibilité | 9 |
| 3 Mise en page aux 5 largeurs | **6** |
| 4 Cohérence avec l'espace | 8 |
| 5 Finition au pixel | 8 |
| **Globale (minimum)** | **6** |

## Faute dure

**F1. Mes répliques (en-cours et nouvel), 1280 à 1920 : carte collée à gauche, vide à droite.**
Preuve : `en-cours-repliques-1280.png` (carte de x=32 à 800, rien de 800 à 1248), `en-cours-repliques-1920.png` (carte de 352 à 1120, environ 450 px vides jusqu'au bord de la coque à 1568), idem `nouvel-repliques-1280.png`. Le critère 3 interdit « colonne collée à gauche » et « vide à droite à 1280+ ». Mes questions, au même état, remplit les deux colonnes ; l'aperçu visiteur de Mes répliques, lui, est centré. Les trois mises en page de la même rubrique se contredisent.
Correction codable : `apps/web/src/components/espace/repliques/liste-repliques.tsx` (et `apps/web/src/app/(dashboard)/mon-espace/repliques/page.tsx`) : soit grille `grid gap-6 lg:grid-cols-2` des cartes de réplique (une carte par réplique, `rounded-xl` à filet violet comme aujourd'hui), soit conteneur `mx-auto max-w-3xl` avec titre centré comme l'aperçu. Pour l'état vide (nouvel) : même conteneur centré, carte `mx-auto max-w-xl text-center`.
Ce qui ferait 10 : à 1280+, aucune zone de 400 px vide à côté du contenu, ni pour une réplique, ni pour zéro.

## Pistes (ne retiennent pas la note)

- P1. Alignement du H1 qui change selon le compte : centré (aperçu visiteur/gratuit, comme l'accueil) puis à gauche (abonné). Défendable (gabarit B), mais la page change de personnalité au passage de l'abonnement. Piste : harmoniser sur un seul alignement dans les deux composants de page.
- P2. Remplissage interne des cartes : texte de la carte vide de `nouvel-repliques-1280.png` à x=65 contre x=57 pour la carte en-cours (`en-cours-repliques-1280.png`) ; 8 px d'écart. Piste : même `p-6` partout (`etat-vide`/`liste-repliques`).
- P3. Mes questions abonné, 1280 : colonne droite « Mes envois » finit à y=465 (en-cours) ou y=580 (nouvel) alors que le formulaire va à y=965 : 400 à 500 px vides en bas à droite. Acceptable pour un historique, piste : `lg:sticky lg:top-32` sur la colonne gauche inutile, ou rien.
- P4. Aperçu visiteur : le bas de la carte d'offre est à 33 px du pied de page (`visiteur-questions-1280.png`, `visiteur-repliques-1280.png`) contre le rythme aéré de l'accueil (sections à 80 px et plus). Piste : `pb-16` sur le conteneur de l'aperçu.
- P5. Aperçu de Mes répliques : le champ « Écris ta version, en une phrase » ressemble à un vrai champ actif ; non abonné, il invite à taper puis déçoit. Piste : le rendre visiblement inerte (`aria-disabled`, bordure atténuée) sans contraste sous AA, ou texte statique.
- P6. Mes répliques abonné : bouton Supprimer identique à Modifier (même style contour) ; piste : variante danger discrète. Titre de la carte en lien souligné violet : lisible, cohérent avec le thème.
- P7. Mobile 375/768 : conformes (cartes pleine largeur, cibles de 44 px, aucun débordement, bande défilante avec chip suivant tronqué comme voulu).

## Points conformes

- Filet violet en haut et coins `rounded-xl` sur toutes les cartes, langue de l'accueil respectée ; chips de type en pastille.
- Aperçu : H1, sous-titre validé, un vrai contenu, un seul bouton plein (`Premium · 1,99 €/mois`), lien Connexion uniquement pour le visiteur (absent pour le gratuit, correct) ; « … » allumé avec soulignement violet sur les 4 comptes.
- Aucune faute de contraste visible, aucun débordement horizontal.

NOTE GLOBALE : 6/10 (une faute dure)
