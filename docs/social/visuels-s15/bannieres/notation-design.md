# Notation design des bannières s15 (06/10/2026)

Méthode : les 8 PNG et les 8 `-controle.png` ouverts et lus, comparés à `v4/` (cartes noires) et `v5-linkedin/` (carte aplat). Cotes relevées sur le rendu (±5 px) et recoupées avec `apps/web/scripts/render-bannieres.ts`. Échelles mobile : X 0,26 (écran 390 px), LinkedIn 0,35, Instagram 0,074 (cercle d'environ 80 px).

## Zones sûres 2026 (les sources divergent, à vérifier sur téléphone avant mise en ligne)
- X : en-tête 1500×500, profil 400×400 ([X Help](https://help.x.com/en/managing-your-account/how-to-customize-your-profile)). Recadrage haut et bas 50 à 60 px, photo de profil en bas à gauche (220×220 selon une source, environ 400×200 dans notre contrôle), contenu clé dans les 350 px du haut ([postfa.st, mis à jour septembre 2026](https://postfa.st/sizes/x/header), [Neal Schaffer 2026](https://nealschaffer.com/twitter-banner-size/)).
- LinkedIn page : 1128×191, logo à gauche (260 à 320 px selon source), mobile : environ 900 px centraux visibles, source unique non recoupée ([Creobee 2026](https://www.creobee.com/sizes/linkedin-company-cover), [ConnectSafely 2026](https://connectsafely.ai/articles/linkedin-company-banner-size)).
- Instagram : zone vue d'environ 720 px de diamètre et cercle de 80 px à l'écran ([SocialPreviewing 2026](https://www.socialpreviewing.com/blog/instagram-highlight-cover-size-2026-exact-dimensions-circle-crop)). L'index retient 1080 px : écart à corriger, tout tenir dans r = 360 px.
- Seul postfa.st affiche un mois. Les autres guides disent « 2026 » sans date précise.

## Notes
| Bannière | Note | Constat mesuré |
|---|---|---|
| X A message | 8/10 | Cohérente avec v4 (noir, Jakarta 800, lilas), titre 22 px mobile, une seule cible. Le « p » de « pour » descend à y 292, soit 8 px de la zone photo (y 300). Pied 44 px = 11 px mobile, à cheval sur y 350. Texte identique à la bio. |
| X B vanne | 7,5/10 | Deux points focaux : l'aplat violet pèse plus que le message. Vanne 46 px = 12 px mobile (seuil 14). « plus » à 5 px de la zone photo. Pied à 30 px du panneau et à 24 px de la photo, non aligné sur le titre (x 424 contre 96). |
| LinkedIn A noir | 7/10 | Marges 32 px en haut, 22 px en bas, bloc serré. Pied 24 px = 8 px mobile. Lilas sur « pour le bureau » (mauvais mot). Deux lignes de même corps, ligne 2 finit à x 1003, soit 11 px du bord du recadrage mobile possible (1014). |
| LinkedIn B aplat | 8,5/10 | Hiérarchie nette (54 px, puis 32 px), aéré (45 px haut et bas), même aplat que v5. Sous-titre 32 px = 11 px mobile. Titre fini à x 1015, au bord du recadrage possible. Pas de pied (le logo de page est à côté). |
| IG Vannes | 6/10 | Les « » en chevrons se lisent comme « retour / avance rapide ». Picto 108 px de haut contre 410 px pour l'ampoule. Groupe 56 px trop bas (centre y 1016). |
| IG Conseils | 7,5/10 | Ampoule lisible (19×30 px). Coin bas gauche de « Conseils » à 409 px du centre, hors du cercle de 720. |
| IG Quiz | 7/10 | « ? » plein, alors que ampoule et mallette sont au trait. Picto 200 px, petit. Groupe 37 px trop bas. |
| IG Bureau | 7,5/10 | Mallette la plus lisible (30×27 px). « Bureau » à 378 px du centre, hors du cercle de 720. |

Cohérence générale : aplat #6D28D9 et lilas #DDD6FE conformes à v5, contrastes OK (blanc 7,1:1, lilas clair 5,1:1, lilas sur noir 7,1:1). Pas de monogramme sur Instagram : acceptable, la photo de profil le porte.

## Corrections (notes < 10)
- **X A** : bloc titre top 91 → 75 (84 px inchangé, glyphes y 97 à 276, jeu photo 24 px). Pied : monogramme 72 → 56, adresse 44 → 36, bottom 82 → 100 (y 344 à 400), il reste décoratif.
- **X B** : bloc message monté de 16 px. Vanne 46 → 50 px, marge droite 64 → 48 (largeur 560, 3 lignes), re-centrée dans y 70 à 430. Pied x 424 → 440. Plafond structurel : environ 13 px sur mobile.
- **LinkedIn B** : sous-titre 32 → 36 px (700), couleur #DDD6FE → #EDE9FE (6:1). Titre 54 → 52 px (fin à x 988, précaution source unique), écart titre/sous-titre 6 → 8 px.
- **LinkedIn A** (si gardée) : supprimer le pied, centrer le texte (y 51 à 140), lilas sur « Des vannes », corps 42 px pour finir à x 980.
- **Instagram, les 4** : supprimer le libellé du visuel (Instagram affiche le nom sous le cercle, et 132 px = 10 px à l'écran). Picto 520 px de côté, centre exact (540, 960), blanc #FFFFFF (7,1:1 au lieu de 5,1:1), trait 2,2 → 2,8 (viewBox 24). Famille au trait unique : micro (Vannes, à la place des « »), ampoule, point d'interrogation dans un cercle (Quiz), mallette. Même boîte 520×520 pour les 4.

## Recommandation
- **X : A.** Meilleure note, titre lisible à 22 px, une seule cible. Choisir B seulement si le fondateur veut montrer une vanne dès l'en-tête (la bio redit le message de A). Garder A + corrections.
- **LinkedIn : B.** Hiérarchie claire, plus aéré, même aplat que la carte v5 validée. A est trop serrée et son pied est illisible sur mobile.
- Après corrections attendues : X A 9,5, LinkedIn B 9,5, Instagram 9. Rien n'atteint 10 sans test sur téléphone réel (zones sûres non confirmées).
