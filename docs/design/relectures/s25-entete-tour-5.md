# Relecture design à l'aveugle, en-tête et menu mobile de l'espace, tour 5 (s25)

Étalon : `docs/captures/s25/etalon-accueil/` (1280 et 375 lus). Spec : `docs/ux/navigation-universelle-s24.md` v5 (choix Thomas non rediscutés, recherche à 176 px conservée). Captures lues dans `docs/captures/s25/entete-tour-5/` : bandeaux vannes visiteur et en-cours aux 12 largeurs, gratuit à 440, 641, 1024, 1280, nouvel à 1456 ; menus ouverts (visiteur 375, 320, 768 ; gratuit 375, 320, 768 ; en-cours 375, 320, 440, 768, 1024 ; nouvel 375, 320) ; cloche pleine (en-cours 320, 375, 1280) et vide (nouvel 320, 375, 768, 1920) ; compte sur /vannes et /profil (en-cours 768 et 1280, gratuit 768 et 1920) ; focus (en-cours 375, 768, 1280 ; visiteur 375, 1280). Limite : le visiteur sur /mon-espace et /profil est renvoyé à la connexion (bandeau noir, normal) ; les 12 largeurs de chaque compte n'ont pas toutes été ouvertes une par une, la lecture a couvert les 12 pour visiteur et en-cours.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à la langue de l'accueil | 10 |
| 2 | Cohérence entre comptes et pages | 10 |
| 3 | Hiérarchie et lisibilité | 10 |
| 4 | Menu mobile | 10 |
| 5 | Panneaux cloche et compte | 9 |
| 6 | Grandes largeurs 1456 et 1920 | 10 |
| 7 | Finition au pixel | 9 |

## 1. Fidélité à l'accueil : 10

Même bandeau que l'accueil à 1280 et 375 : logo en dégradé violet `font-display`, liens `text-sm` gris, recherche en champ sombre arrondi, bouton « Premium · 1,99 €/mois » violet plein, filet bas 1 px. Panneaux cloche et compte : `rounded-xl`, filet dégradé violet de 4 px en haut (`en-cours-cloche-1280.png`, `gratuit-compte-1920.png`), identiques aux cartes de l'accueil. Rien d'étranger (pas de gris froid, pas de second violet).

## 2. Cohérence entre comptes et pages : 10

Un même bandeau sur accueil, vannes, mon-espace, profil à chaque largeur (premier lien au même x, logo à 16 px dès 320). Seules différences : éléments propres au compte et lien courant allumé. Le champ de recherche est à x=782 (visiteur), 826 (gratuit), 956 (abonné) à 1280 : conséquence documentée de la recherche à 176 px, aucun lecteur ne voit deux comptes, conforme à la spec (critère 2 = même état, pas même x entre états). Pas retenu comme défaut.

## 3. Hiérarchie et lisibilité : 10

Plissé : logo, lien allumé (fond élevé, texte violet, soulignement 2 px) et bouton d'offre (visiteur, gratuit) ou cloche à point violet (abonné) ressortent. Une seule action dominante. Contrastes lus dans le thème : `text-secondary` #B3B3B3 et `accent-link` #A78BFA sur #0D0D0D et #2A2A2A, tous AA.

## 4. Menu mobile : 10

- Abonné 375 et 320 (`en-cours-menu-mon-espace-375.png`, `...-320.png`) : « Mon espace » et les 8 rubriques, de Quoi répondre à Carnet (dernière ligne à y≈507 sur 812), puis Parcours à Articles et Mon profil, sans défilement. Marge calculée par la spec (530 px sur 568) tenue.
- Alignements : texte « Mon espace », rail et liens du site à x=28 ; rubriques à x=53 ; actions du compte avec icône à x=28 et libellé à x=53, soit la même colonne que les rubriques. Pas de 44 px sans interstice, séparateurs 1 px seuls porteurs d'air.
- Graisse : parent « Mon espace » semi-gras blanc, rubriques et liens `font-medium` gris, semi-gras réservé à la ligne allumée (fond élevé, filet gauche violet, coins droits arrondis). Homogène sur les 5 vues.
- Visiteur et gratuit : séparateur puis offre, Connexion ou Favoris/Profil/Déconnexion, en une colonne.
- Observation mineure, non retenue : à l'ouverture sur /profil le menu remonte de 8 px (champ à y=73 au lieu de 81, `en-cours-menu-profil-375.png`) pour montrer la ligne allumée, comportement voulu (commentaire du code).

## 5. Panneaux cloche et compte : 9

Points justes : décollement net (fond élevé, ombre, anneau), 8 px sous le filet, bord droit sur la marge de la coque (compte à x=1248 = icône à 1248 à 1280) ; état vide propre (`nouvel-cloche-vide-375.png` : titre, « Fermer », une phrase) ; cloche ou compte ouverts = tuile grise sans soulignement, page en cours = soulignement violet + « Mon profil » allumé dans le panneau (`en-cours-compte-profil-1280.png`) : les deux états sont distincts.

**Défaut 1 (piste de finition, pas faute dure)** : cloche pleine, le titre « Notifications » est à x=945 (1280) et x=33 (375) alors que titres de groupe et libellés de lignes sont à 12 px de plus (x=957, x=45) ; en état vide, la phrase est alignée sur le titre (x=1265 = 1265 à 1920). Sur la même page, la carte « Dans ton espace » aligne titre et lignes sur une seule verticale. Cause : `LIGNE` et `h3` en `px-3` dans `cloche-lignes.tsx`.
Correction : dans `cloche-lignes.tsx`, `LIGNE` : ajouter `-mx-3` ; `Groupe` `h3` : `px-0` ; sans changer les 44 px ni le survol (le fond survolé déborde de 12 px dans le padding `p-4`, anneau de focus à 4 px du bord, vérifier à 320 avec `max-e300:px-3`).
Ce qui ferait 10 : titre, titres de groupe, libellés et phrase vide sur une seule verticale, comme l'état vide.

**Défaut 2 (mineur, 320)** : `nouvel-cloche-vide-320.png`, la phrase passe sur 2 lignes et le bord bas du panneau (y≈207) mord de 5 px sur la carte dessous (haut y≈202), les deux fonds se touchent au lieu de se superposer franchement. Recouvrement normal pour un panneau flottant, rendu lisible grâce à l'ombre ; piste seulement.

## 6. Grandes largeurs : 10

1456 et 1920 : coque `max-w-7xl` centrée, logo à x=120 (1456) et 352 (1920), sur la verticale du contenu de page (titre « Vannes drôles… » à x=352 à 1920), actions calées à la marge droite (icône compte et bouton Premium à 1568). Filet bas pleine largeur. Aucun vide collé à gauche, aucun débordement.

## 7. Finition au pixel : 9

OK : aucune troncature ni débordement aux 12 largeurs (le plus serré, 641 visiteur, tient) ; cibles `h-11 w-11` ; focus identique partout (anneau violet 2 px arrondi, logo, cloche, Menu, liens, Premium : `en-cours-focus-*`, `visiteur-focus-05-1280.png`) ; point de la cloche détaché par bordure.

**Défaut (faute légère, 1 à 2 px)** : à 1280 le texte des liens de barre est centré 2 px plus haut (y≈31) que Connexion, Premium, logo et « Rechercher » (y≈32 à 33), `visiteur-vannes-1280-bandeau.png`. Cause : `classeLienBarre` (`en-tete-universel.tsx`) est un `h-11` avec `border-b-2`, la zone de contenu fait 42 px, centre à 21 au lieu de 22.
Correction : ajouter `pt-0.5` à `classeLienBarre` (centre à 22, soulignement et pastille inchangés). Même ligne de base que le reste de la barre.
Ce qui ferait 10 : liens, logo, recherche, Connexion et bouton sur une même ligne de base.

## Résumé

Fautes dures : aucune. Pistes : (a) `pt-0.5` sur les liens de barre ; (b) alignement du titre de la cloche et des lignes (`-mx-3`) ; (c) recouvrement de 5 px de la cloche vide à 320 (facultatif). Toutes compatibles avec la recherche à 176 px, aucun texte ajouté.

NOTE GLOBALE : 9/10
