# Relecture DESIGN à l'aveugle, v6 tour 3 : favoris + profil

Captures lues : `docs/captures/s25/v6-tour-3/favoris/` et `profil/`. Vues en détail : gratuit-favoris 375 et 1280, en-cours-favoris 768, 1280 et 1920, nouvel-favoris 1280, gratuit-profil 1280 et 1920, en-cours-profil 375 et 1280, nouvel-profil 1280. Les autres largeurs (1456, versions visiteur, 768 profil) n'ont pas été ouvertes ; les tailles de page de l'INDEX montrent un gabarit identique à 1280, 1456 et 1920.

## Notes

| Critère | Note |
|---|---|
| 1 Fidélité à l'accueil | 9 |
| 2 Hiérarchie et lisibilité | 9 |
| 3 Mise en page aux 5 largeurs | 8 |
| 4 Cohérence avec l'espace | 9 |
| 5 Finition au pixel | 8 |

Globale : 8/10 (minimum). Sous la barre de 9 : 2 fautes dures.

## Ce qui est conforme
- Cartes à filet violet en haut, coins arrondis, fonds et pastilles de l'accueil, rythme aéré. Le profil et les favoris parlent la même langue que l'accueil.
- Conteneur centré à 1216 px à 1456 et 1920 (gratuit-profil-1920, en-cours-favoris-1920) : aucun vide à droite, aucun débordement.
- États vides propres : nouvel-favoris-1280 (étoile, phrase, bouton unique « Explorer les vannes »), nouvel-profil-1280 (« Mes parcours » vide avec « Découvrir les parcours »).
- Compte gratuit : une seule offre, « S'abonner · 1,99 €/mois », bien dominante (gratuit-profil-1280). Cadenas cohérents dans la bande.
- Encadré ambre de suppression de compte lisible (en-cours-profil-1280), 375 propre sans débordement (en-cours-profil-375).

## Fautes dures

1. **Aperçu Favoris (gratuit), trou dans la grille** (gratuit-favoris-1280, 1456, 1920). Deux cartes côte à côte de hauteurs très différentes : la vanne (170 px) laisse un vide d'environ 900 px sous elle, colonne gauche abandonnée. Critère 3.
   - Correction : dans l'aperçu, remplacer la grille 2 colonnes par une colonne unique `mx-auto max-w-2xl space-y-6`, ou garder la grille avec `grid md:grid-cols-2 items-start` mais en rangeant les deux cartes dans la même hauteur (`items-stretch` et `line-clamp` sur l'exemple du conseil).
   - Ce qui ferait 10 : aperçu équilibré, sans colonne vide.
   - Fichier : `apps/web/src/app/(dashboard)/favoris/page.tsx` (bloc aperçu non abonné).

2. **Cibles tactiles < 44 px sur les cartes de favoris** (en-cours-favoris-1280, 768). Le bouton partager est un rond d'environ 32 px, « Retirer » est un texte nu de faible hauteur. Critère 5, cible 44 px.
   - Correction : `min-h-11 min-w-11` (44 px) sur le bouton partager et sur « Retirer » (`px-3 min-h-11 inline-flex items-center`).
   - Ce qui ferait 10 : trois contrôles de 44 px alignés sur la ligne des pastilles.
   - Fichier : `apps/web/src/components/favoris/favoris-list.tsx`.

## Pistes (ne retiennent pas la note)
- Carte « Ta question à l'équipe » sans titre (en-cours-profil-1280, y≈1066) : seule carte du profil sans `h2`, avec un vide en haut. Ajouter un titre ou une classe de padding identique. Fichier : `apps/web/src/components/profil/question-equipe-card.tsx`.
- Bouton « Enregistrer » du prénom quasi invisible (fond sombre sur sombre, filet très faible) face à un champ à bordure claire (gratuit-profil-1280). Passer à `variant secondaire` avec `border-border` plus marqué. Fichier : `apps/web/src/components/profil/prenom-card.tsx`.
- Textes de 11 px (mentions de la lettre de la semaine, « Ouvre pour l'exemple et le défi », badge « Aucun abonnement ») : monter à `text-xs` (12 px) minimum. Fichiers : `profil-dashboard.tsx`, `favoris-list.tsx`, `abonnement-card.tsx`.
- Cartes de vannes très hautes pour peu de contenu à 1280+ (en-cours-favoris-1280) : hauteur égalisée avec le conseil ; acceptable, mais `items-start` donnerait un rendu moins vide.
- Lignes longues (~1000 px) dans « Supprimer mon compte » à 1920 : `max-w-prose` sur les paragraphes.
- Carte CTA de l'aperçu Favoris : un bouton seul dans une carte vide (gratuit-favoris-1280). Un texte de valeur serait mieux, mais tout texte nouveau est « à valider par Thomas ».
- Hors périmètre : la bande rognée à 375 (« Carne »).

## Contexte connu, non retenu
Carte Abonnement sans bouton chez en-cours et nouvel : données de test hors Stripe.

NOTE GLOBALE : 8/10
