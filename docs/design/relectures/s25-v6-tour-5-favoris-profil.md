# Relecture design à l'aveugle, s25 navigation v6, tour 5, groupe favoris-profil

Captures lues : `docs/captures/s25/v6-tour-5/favoris/` (visiteur 375/768/1280/1456/1920 non tous rouverts : 1280 ; gratuit 375, 768, 1280, 1920 ; en-cours 375, 768, 1280, 1920 ; nouvel 375, 1280, 1920) et `profil/` (gratuit, en-cours, nouvel : 375, 1280, 1920 ; en-cours 768). Étalon : `etalon-accueil/visiteur-accueil-1280.png`. Code lu pour les cibles : `components/favoris/favoris-list.tsx`, `components/profil/*`, `components/ui/button.tsx` (`sm` = `h-8 max-md:h-11`, donc 44 px sous 768 ; `md:h-11` = 44 px dès 768), `components/espace/ton-cap.tsx`, `components/ui/card.tsx`.

## Notes

| Critère | Note |
|---|---|
| D1 Fidélité à l'accueil | 9 |
| D2 Hiérarchie, lisibilité | 9 |
| D3 Mise en page aux 5 largeurs | 9 |
| D4 Cohérence avec l'espace | 8 |
| D5 Finition au pixel | 8 |
| U1 Compréhension | 9 |
| U2 Action principale | 9 |
| U3 États vides, nouvel abonné | 10 |
| U4 Aperçu Premium | 9 |
| U5 Accessibilité, cohérence entre comptes | 8 |

**NOTE GLOBALE : 8/10** (minimum). Barre de 9 non atteinte : 2 fautes dures.

## Ce qui est conforme (à ne pas toucher)
- Favoris, 4 comptes : titre centré, cartes `rounded-xl` à filet violet, rangée d'onglets (cibles `min-h-11`), « Retirer » et partage à 44 px, grille 3 colonnes à 1280/1920 sans vide à droite (`en-cours-favoris-1280.png`, `-1920.png`), 2 colonnes + carte pleine largeur à 768 (`en-cours-favoris-768.png`), état vide centré avec une seule action « Explorer les vannes » (`nouvel-favoris-*`).
- Aperçu Favoris (visiteur, gratuit) : vraie vanne et vrai conseil lus en entier, un seul bouton plein, « Connexion » seulement pour le visiteur, pas de mur (`visiteur-favoris-1280.png`, `gratuit-favoris-1280.png`).
- Profil : `Prochaine étape` en tête, grille 2 colonnes cohérente à 1280/1920, pas de débordement à 375, nouvel abonné jamais page morte (« Découvrir les parcours », « Prochaine étape »). Boutons `sm` : tous à 44 px (max-md:h-11 sous 768, `md:h-11` ensuite ; « Enregistrer » `min-h-11`).
- Contrastes : `text-muted` #9A9A9A sur #1F1F1F environ 6:1, `error-text` AA, aucun défaut relevé.

## Fautes dures

### F1. « Ton cap » n'a ni le padding ni le titre des cartes voisines (D4, D5)
Constat : `en-cours-profil-1280.png` et `-1920.png`, rangée « Ton cap » / « Statistiques » : le titre « Ton cap » (20 px) est plus gros et plus bas (environ 8 px d'écart de ligne de base) que « Statistiques » (18 px), et son retrait gauche est d'environ 24 px contre 16 px. Même écart à 768 (`en-cours-profil-768.png`, « Ton cap » décalé de 5 px à gauche par rapport à « Statistiques », « Mes parcours »). Cause : `ton-cap.tsx` porte `p-4 md:p-6` et `text-xl`, alors que `Card` est en `p-4` avec `CardTitle` en `text-lg`.
Correction codable : dans `apps/web/src/components/espace/cap-profil.tsx`, passer à `TonCap` un `className` qui ramène le cadre à `p-4` (`md:p-4`) et ajouter une prop `titreClassName` (ou `compact`) dans `ton-cap.tsx` pour mettre le `h2` en `text-lg`, SEULEMENT dans le profil (Parcours et Aujourd'hui gardent `text-xl` / `md:p-6`, hors périmètre). Vérifier que `space-y-3` laisse le titre à la même ordonnée que « Statistiques » (CardHeader : `pb-4`).
Ce qui ferait 10 : les deux cartes de la rangée ont le même retrait gauche, le même corps de titre et la même ligne de base.

### F2. Lien « Renoncer au contrat ici » de la carte Abonnement : cible d'environ 14 px (U5, D5)
Constat : `en-cours-profil-1280.png` (et 375, 768, `nouvel-profil-*`), tout en bas de la carte Abonnement : lien `text-xs` souligné, gris, sans aucune hauteur de cible (< 24 px, sous WCAG 2.5.8 et très loin des 44 px de la grille). Ce n'est pas un lien dans une phrase. Il est obligatoire légalement, donc il doit être facile à atteindre. Code : `components/profil/abonnement-card.tsx` (`<p className="mt-4 text-xs"><Link ... className="text-text-muted underline ...">`).
Correction codable : sur le `Link`, ajouter `inline-flex min-h-11 items-center` (le texte reste `text-xs`, le lien devient une cible de 44 px) et retirer le `mt-4` du `<p>` si l'espace paraît trop grand (`-my-2` possible). Contraste inchangé.
Ce qui ferait 10 : cible de 44 px sans changer l'aspect du texte.

## Pistes (ne retiennent pas la note)
1. `profil` gratuit : le sous-titre « Ta progression, tes stats, ton parcours vers la légende. » promet des contenus que ce compte n'a pas (`gratuit-profil-1280.png`). Texte validé : à signaler, non modifié. Proposition éventuelle d'une variante gratuit : à valider par Thomas.
2. « Enregistrer » (variante `outline`, bordure #2A2A2A sur carte #1F1F1F) a un contour presque invisible (`gratuit-profil-1280.png`) : l'étiquette suffit, mais `border-border-input` aurait un meilleur contraste (`prenom-card.tsx`, bouton).
3. « Voir tout » (ghost `text-text-secondary`) se lit comme du texte simple (`en-cours-profil-1280.png`) ; `text-accent-link` l'aurait signalé comme lien (`profil-dashboard.tsx`).
4. `en-cours-favoris-768.png` : la vanne de gauche garde un vide d'environ 70 px sous « Clique pour la chute » (cartes de même hauteur par design, tour 1 point 14). Acceptable.
5. Favoris porte un cadenas dans la bande pour le visiteur et le gratuit alors que `navigation-v6-menu-rubriques.md` §2 écrit « Groupes 2 et 3 ouverts » : l'aperçu est livré et cohérent (cadenas et page d'aperçu vont ensemble). À confirmer avec Thomas que la spec s'est bien déplacée (décision non lue dans mon périmètre de lecture).
6. Aperçu Favoris : le bloc d'offre est un bouton seul dans une carte vide (`gratuit-favoris-1280.png`). Une ligne de réassurance existante (`Reassurance`) rapprocherait l'aperçu du bloc d'offre de l'accueil. Piste.
7. Carte « Abonnement » d'un abonné avec résumé chargé : les boutons `sm` « Gérer », « Changer de formule », « Résilier » n'ont pas `md:h-11` (32 px dès 768) ; non visibles sur ces captures (résumé absent), à traiter si un état actif est capturé.

## Faute dure, liste
1. « Ton cap » : padding et titre différents de « Statistiques » : `apps/web/src/components/espace/cap-profil.tsx` et `apps/web/src/components/espace/ton-cap.tsx`.
2. « Renoncer au contrat ici » : cible d'environ 14 px : `apps/web/src/components/profil/abonnement-card.tsx`.
