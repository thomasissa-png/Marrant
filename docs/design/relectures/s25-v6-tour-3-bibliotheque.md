# Relecture DESIGN à l'aveugle, tour 3, groupe Bibliothèque (navigation v6)

Captures lues : `v6-tour-3/bibliotheque/` (visiteur 375/1280, gratuit 768/1920, en-cours 375/768/1280/1920, nouvel 1280) et `v6-tour-3/fiches/` (en-cours a-plat, formule, vocabulaire, humour-noir, construction à 1280 ; nouvel construction 375). Étalon : accueil visiteur 1280. Les autres captures du groupe (visiteur et gratuit, largeurs non listées) n'ont pas été ouvertes une à une, une partie est donc inférée de leur identité de gabarit avec celles lues.

## Constats

**Aperçu Premium (visiteur, gratuit)** : H1 centré + sous-titre validé, une fiche réelle ("Le faux secret") lisible en entier dans une carte `rounded-xl` à filet violet, un seul bloc d'offre (bouton plein "Premium · 1,99 €/mois" ; lien Connexion chez le visiteur seulement, absent chez le gratuit à 768, correct). Chip Bibliothèque allumé avec cadenas, soulignement violet. Colonne de lecture centrée (768 px) à 1280 et 1920 : pas de vide parasite, pas de débordement à 375 ni 768. Rythme proche de l'accueil (titre centré, carte à filet). Seule réserve : le bloc d'offre n'est qu'un bouton dans une carte vide, plus pauvre que la carte d'offre de l'accueil (titre + phrase) ; texte à ne pas ajouter sans validation Thomas.

**Hub abonné (en-cours, nouvel)** : captures identiques entre les deux comptes (catalogue statique, pas d'état vide à prévoir, jamais une page morte). Quatre cartes à filet violet : Vannes/conseils/vidéos (pastilles 44 px de haut), Humour noir (carte + bouton Entrer 44 px), Comment c'est construit (11 lignes), Vocabulaire (8), Formules à détourner (13). 2 colonnes à 768 et 1280+, 1 colonne à 375, plafond max-w-7xl respecté à 1456/1920, aucune colonne collée, aucun débordement. Lignes de liste hautes (~50 px), chevrons alignés, contrastes bons.

**Fiches** (a-plat, formule, vocabulaire, humour-noir, construction) : même gabarit A (retour, H1, filet, carte contenu, carte "À toi"), colonne 768 centrée, chip parent allumé conforme à la spec (a-plat : Quoi répondre ; les 4 autres : Bibliothèque). Cohérent entre fiches et entre comptes ; à 375 la fiche construction tient sans débordement.

## Notes (Design)

| Critère | Note | Justification |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Cartes, filet, pastilles, aération conformes. Écart : le hub abonné a un H1 aligné à gauche et sans sous-titre, alors que l'aperçu de la même adresse est centré comme l'accueil (`en-cours-bibliotheque-1280.png` vs `visiteur-bibliotheque-1280.png`). |
| 2 Hiérarchie, lisibilité | 9 | H1 > titres de cartes > lignes, net. Fiche vocabulaire : trois niveaux de gris/blanc en 13 px serrés, lisibles mais denses (`en-cours-fiche-vocabulaire-1280.png`). |
| 3 Mise en page 5 largeurs | 9 | Aucun vide à droite. À 1280+ la colonne gauche du hub finit ~130 px plus haut que la droite (1408 contre 1540 sur la capture réduite), léger creux sous "Comment c'est construit". |
| 4 Cohérence espace | 9 | Cartes, filets, rythme identiques entre hub, fiches et aperçu. L'écart de centrage H1 ci-dessus est le seul. |
| 5 Finition | 9 | Alignements et contrastes AA bons. Liens texte isolés sous 44 px : "Vannes Conseils Vidéos" (~22 px de haut, `en-cours-bibliotheque-1280.png`), "Connexion" de l'aperçu, "Définition complète" des fiches vocabulaire. Ils passent le minimum WCAG 2.2 de 24 px au mieux, pas l'objectif 44 px du brief. |

Aucune faute dure : tout est conforme à la spec v6 (une seule offre, aucun mur, contenu réel, bande identique, cadenas groupés).

## Pistes (ne retiennent pas la note)

1. Hub abonné : centrer le H1 comme l'aperçu et l'accueil, ou aligner l'aperçu à gauche ; choisir un seul parti pour l'adresse. Fichier : page `apps/web/src/app/mon-espace/bibliotheque/page.tsx` (ou son gabarit B), classes `text-center` sur l'en-tête.
2. Cibles : donner aux liens isolés `inline-flex min-h-11 items-center` (Vannes/Conseils/Vidéos de la carte hub, Connexion de l'aperçu, "Définition complète"). Ferait 10 en critère 5.
3. Équilibre des colonnes du hub à 1280+ : répartir les cartes pour que les deux colonnes finissent à ±40 px (ex. Humour noir sous Vocabulaire). Ferait 10 en critère 3.
4. Fiche vocabulaire : espacer davantage "En deux temps" et "À ne pas confondre" (`space-y-2`) ou passer le corps à 14 px.
5. Signalé, texte non touché : le H1 de la fiche ("Vocabulaire : quand on te lance une pique") diffère du libellé du hub ("Quand on te lance une pique") ; vérifier que c'est voulu.

NOTE GLOBALE : 9/10

Fautes dures : aucune.
