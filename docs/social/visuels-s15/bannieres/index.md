# Bannières des réseaux (s15, cycle 3, 06/10/2026)

Rendu réel `next/og` (même moteur que les cartes « piste A » v4 et la carte LinkedIn v5) : Plus Jakarta Sans 800/700, Inter pour la ligne d'appel X, noir `#0D0D0D`, aplat `#6D28D9`, lilas `#A78BFA` sur noir, `#EDE9FE` sur l'aplat. Lignes calculées sur les largeurs réelles des glyphes (`mise-en-lignes.ts`).

Script : `cd apps/web && npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-bannieres.ts`. Chaque visuel a trois fichiers : le PNG à publier, un `-controle.png` (zones masquées en surimpression : rouge = élément d'interface, orange = recadrage mobile) et un `-apercu-mobile.png` (affichage simulé à taille réelle sur un téléphone de 390 px). J'ai ouvert chaque PNG. Les cotes ci-dessous sont mesurées sur les pixels rendus. Rien n'est publié et le site n'est pas modifié.

Arbitrage du cycle 2 : X = version A seule, LinkedIn = version B seule, Instagram = 4 couvertures sans libellé (Bureau remplacée par Répartie). Fichiers abandonnés supprimés : X B, LinkedIn A, Bureau.

Cycle 3 (corrections des notations design et growth du cycle 2, arbitrées par la session) : LinkedIn décalé à x 348, titre 48 px, bloc monté de 6 px, 2e simulation mobile en recadrage 900 px ; ligne d'appel X à 56 px ; glyphe Répartie réduit à 420 px avec bulles séparées ; tige du micro Vannes prolongée. Mesures du cycle 3 en fin de fichier.

## X, en-tête 1500×500

| Fichier | Texte | Composition (mesurée) |
|---|---|---|
| `x-entete.png` | Une vanne par jour pour devenir **plus drôle.** (« plus drôle. » en lilas) | Noir, 2 lignes Jakarta 800 à 84 px, x 116 à 1087, glyphes à partir de y 97 (bloc remonté, top 75). |
| | Quiz d'humour, sans inscription. | Inter 400, 56 px, `#D4D4D4`, alignée à droite (bord de boîte x 1388), glyphes x 539 à 1382, y 351 à 403, ligne de base y 392. |

Contrôle (`x-entete-controle.png`) : 0 pixel de texte dans la photo de profil (x 0 à 400, y 300 à 500) et dans les recadrages (y 0 à 70 et 430 à 500). Aperçu (`x-entete-apercu-mobile.png`) : titre à environ 22 px, ligne d'appel à 14,6 px (56 × 0,26), la photo ronde ne touche aucun texte.

## LinkedIn, couverture de page entreprise 1128×191

| Fichier | Texte | Composition (mesurée) |
|---|---|---|
| `linkedin-couverture.png` | Des vannes pour le bureau. / Fais le quiz de ton profil d'humour. | Aplat, bloc à x 348, top 35. Titre Jakarta 800 48 px blanc (encre x 351 à 982, y 47 à 92), sous-titre Jakarta 700 38 px `#EDE9FE` (encre x 351 à 982, y 109 à 144, ligne de base y 137), écart 8 px. Ni pied ni URL. |

Contrôle : 0 pixel de texte dans la zone du logo pleine largeur (x 0 à 260, y 90 à 191) ni dans celle du logo en recadrage 900 px (x 151 à 335, y 90 à 191, logo de 80 pt au pire) ; bandes orange = parties coupées par le recadrage (x 0 à 114 et 1014 à 1128). Aperçu (`linkedin-couverture-apercu-mobile.png`), deux simulations : pleine largeur (titre 16,6 px, sous-titre 13,1 px) et recadrage central 900 px avec le logo par-dessus (titre 20,8 px, sous-titre 16,5 px, texte de x 103 à 376 pt sur 390, 15 pt après le logo).

## Instagram, couvertures de stories à la une 1080×1920

Aplat `#6D28D9`, pictogramme blanc au trait, aucun libellé (le nom s'affiche sous le cercle dans l'appli). Boîte de 520 px centrée en (540, 960), viewBox 24, trait 2,8 (61 px) ; Répartie en boîte de 420 px, trait 3,5 (même 61 px à l'écran). Contrôle : rayon maximal de l'encre mesuré depuis le centre, limite 360 px.

| Ordre | Fichier | Nom à saisir dans Instagram | Pictogramme | Rayon max |
|---|---|---|---|---|
| 1 | `instagram-alaune-quiz.png` | Quiz | Point d'interrogation dans un cercle | 248 px |
| 2 | `instagram-alaune-vannes.png` | Vannes | Micro de scène sur pied | 263 px |
| 3 | `instagram-alaune-conseils.png` | Conseils | Ampoule | 250 px |
| 4 | `instagram-alaune-repartie.png` | Répartie | Deux bulles de dialogue, séparées | 265 px |

Contrôle : `instagram-alaune-*-controle.png` (cercle pointillé de rayon 360, boîte du pictogramme en pointillé fin, extérieur en rose). Aperçu : `instagram-alaune-apercu-mobile.png` (les 4 cercles de 64 px dans l'ordre ci-dessus, nom en 12 px dessous). Créer les stories à la une dans cet ordre : Quiz, Vannes, Conseils, Répartie.

## Dimensions d'interface utilisées pour les aperçus

Les aperçus sont rendus à 1 px = 1 point d'écran, sur un téléphone de 390 points de large, fond clair. La photo de profil est simulée par le monogramme « d ».

| Réseau | Valeurs retenues | Sources |
|---|---|---|
| X | Bannière 390×130 (échelle 0,26). Photo ronde de 84 px, bord blanc 4 px, à x 16, y 78 : c'est la zone retenue x 0 à 400, y 300 à 500 ramenée à l'échelle. Recadrage 70 px en haut et en bas. | Formats 1500×500 et 400×400 : [X Help](https://help.x.com/en/managing-your-account/how-to-customize-your-profile). Photo en bas à gauche, environ 220×220, 60 px rognés en haut et en bas : [Neal Schaffer 2026](https://nealschaffer.com/twitter-banner-size/). Environ 50 px rognés sur mobile : [Tweet Archivist](https://www.tweetarchivist.com/twitter-image-size-guide). Recadrage haut et bas 50 à 60 px : [postfa.st, septembre 2026](https://postfa.st/sizes/x/header). |
| LinkedIn | Couverture 390×66 (échelle 0,346). Logo carré de 72 px, bord blanc 2 px, à x 16, y 31 : zone retenue x 0 à 260, y 90 à 191 ramenée à l'échelle. | Format 1128×191, logo carré 300×300 en bas à gauche, environ 900 px centraux visibles sur mobile : [ConnectSafely](https://connectsafely.ai/articles/linkedin-company-banner-size), [Creobee 2026](https://www.creobee.com/sizes/linkedin-company-cover). |
| Instagram | Cercle de 64 px, anneau gris de 72 px, nom en 12 px. Zone vue dans le cercle : diamètre 720 px au centre de la story. | Zone de 720 px et cercle d'environ 80 px : [SocialPreviewing 2026](https://www.socialpreviewing.com/blog/instagram-highlight-cover-size-2026-exact-dimensions-circle-crop), [Selzee](https://selzee.com/blog/instagram-highlight-covers). Le cercle de 64 px vient de l'arbitrage de la session : il est plus petit que les 80 px annoncés, donc c'est le cas le plus exigeant. |

[HYPOTHÈSE : les tailles de la photo X (84 px) et du logo LinkedIn (72 px) sur mobile sont déduites des zones retenues, pas mesurées dans les applis. Les guides se contredisent, par exemple sur la position de la photo X sur mobile (gauche ou centre). À vérifier sur un vrai téléphone après la mise en ligne.]

## Contrôles du texte

Les textes ne contiennent aucun tiret cadratin, aucun prix, aucun « gratuit » et aucune mention de l'IA. « Sans inscription » vaut pour le quiz (FAQ vérifiée par @growth). Les textes reprennent les bios signées (`corrections-cycle7-copy.md` §5).

## Mesures du cycle 3 (pixels rendus, outil `sharp`, seuil d'encre clair sur fond)

| Visuel | Consigne | Mesure | Verdict |
|---|---|---|---|
| LinkedIn | Bloc x 300 → 348 | Encre à partir de x 351 (approche du « D » et du « F ») | Fait |
| LinkedIn | Titre 52 → 48 px, sous-titre 38 px `#EDE9FE` | Titre x 351 à 982, sous-titre x 351 à 982 (même bord droit) | Fait, fin à 32 px de la limite 1014 |
| LinkedIn | Bloc monté de 6 px | Top 41 → 35. Encre y 47 à 144 : marges 47 en haut et 46 en bas (descendantes), ligne de base finale y 137 | Fait, encre centrée verticalement |
| LinkedIn | Logo en recadrage 900 px | Logo x 151 à 317 (72 pt) ou 335 (80 pt) : jeu de 34 px ou 16 px avec le texte ; 0 pixel de texte dans la zone | Fait |
| X | Appel 52 → 56 px, bord droit 1388, base y 392 | Glyphes x 539 à 1382 (point final ; 1388 = bord de boîte), y 351 à 403, dernière rangée pleine y 392 | Fait |
| X | Hors zones masquées | 0 pixel dans la photo (x 0 à 400, y 300 à 500) et dans les recadrages (y 0 à 70, 430 à 500) ; descendantes à y 403, 27 px avant 430 ; titre y 97 à 274 | Fait |
| Répartie | Boîte 520 → 420, trait inchangé | Trait 61 px (3,5/24 × 420) ; encre x 335 à 736, y 763 à 1156, centre de l'encre (536, 948) | Fait |
| Répartie | Rayon max ≤ 270 | 264,5 px en (730, 1144), pointe de la 2e bulle ; marge 95 px dans le cercle de 360 | Fait |
| Répartie | Jeu de 22 px, plus de soudure | Horizontal : x 615 à 636 (22 px) entre la 1re bulle et le départ de la 2e ; vertical : y 982 à 1003 (22 px). Intérieur bulle 1 : 157 px en largeur, 95 px en hauteur ; bulle 2 : 140 px en largeur | Fait |
| Vannes | Tige jusqu'à y 1110 | Tige en bout droit de y 1110 à 1177, noyée dans l'arc (y 1077 à 1142) et le pied : colonnes x 509 à 570 pleines de y 1077 à 1206, aucune encoche ; rayon max 263 px inchangé | Fait |

Écart signalé : au cycle 2, la ligne de base de l'appel X mesurait y 396 (la notation l'estimait à 392 ±5) ; la consigne y 392 est appliquée, la ligne monte donc de 4 px. Sur Vannes, un bout rond à y 1110 dépassait de 2 px dans le creux de l'arc : la tige est en bout droit (seul changement visible : 10 px d'anticrénelage en y 1081). Le départ de la 2e bulle de Répartie forme un crochet court (style des pictogrammes au trait) : à relire par @design sur l'aperçu à 64 px.

