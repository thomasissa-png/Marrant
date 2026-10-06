# Bannières des réseaux (s15, cycle 2, 06/10/2026)

Rendu réel `next/og` (même moteur que les cartes « piste A » v4 et la carte LinkedIn v5) : Plus Jakarta Sans 800/700, Inter pour la ligne d'appel X, noir `#0D0D0D`, aplat `#6D28D9`, lilas `#A78BFA` sur noir, `#EDE9FE` sur l'aplat. Lignes calculées sur les largeurs réelles des glyphes (`mise-en-lignes.ts`).

Script : `cd apps/web && npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-bannieres.ts`. Chaque visuel a trois fichiers : le PNG à publier, un `-controle.png` (zones masquées en surimpression : rouge = élément d'interface, orange = recadrage mobile) et un `-apercu-mobile.png` (affichage simulé à taille réelle sur un téléphone de 390 px). J'ai ouvert chaque PNG. Les cotes ci-dessous sont mesurées sur les pixels rendus. Rien n'est publié et le site n'est pas modifié.

Arbitrage du cycle 2 : X = version A seule, LinkedIn = version B seule, Instagram = 4 couvertures sans libellé (Bureau remplacée par Répartie). Fichiers abandonnés supprimés : X B, LinkedIn A, Bureau.

## X, en-tête 1500×500

| Fichier | Texte | Composition (mesurée) |
|---|---|---|
| `x-entete.png` | Une vanne par jour pour devenir **plus drôle.** (« plus drôle. » en lilas) | Noir, 2 lignes Jakarta 800 à 84 px, x 116 à 1087, glyphes à partir de y 97 (bloc remonté, top 75). |
| | Quiz d'humour, sans inscription. | Inter 400, 52 px, `#D4D4D4`, alignée à droite, x 598 à 1388, glyphes y 356 à 406. Remplace le monogramme et l'adresse. |

Contrôle (`x-entete-controle.png`) : 0 pixel de texte dans la photo de profil (x 0 à 400, y 300 à 500) et dans les recadrages (y 0 à 70 et 430 à 500). Aperçu (`x-entete-apercu-mobile.png`) : titre à environ 22 px, ligne d'appel à environ 13 px, la photo ronde ne touche aucun texte.

## LinkedIn, couverture de page entreprise 1128×191

| Fichier | Texte | Composition (mesurée) |
|---|---|---|
| `linkedin-couverture.png` | Des vannes pour le bureau. / Fais le quiz de ton profil d'humour. | Aplat, titre Jakarta 800 52 px blanc (x 300 à 982), sous-titre Jakarta 700 38 px `#EDE9FE` (x 300 à 929), écart 8 px, bloc y 41 à 150, encre y 54 à 155. Ni pied ni URL. |

Contrôle : 0 pixel de texte dans la zone du logo (x 0 à 260, y 90 à 191). Aperçu : titre à environ 18 px, sous-titre à environ 13 px.
Point à vérifier sur téléphone : si LinkedIn recadre la couverture sur les 900 px centraux (source unique, voir plus bas), le texte tient dans le recadrage (fin x 982 < 1014) mais le logo agrandi pourrait mordre le début des lignes. L'aperçu fourni suit la largeur entière.

## Instagram, couvertures de stories à la une 1080×1920

Aplat `#6D28D9`, pictogramme blanc au trait, aucun libellé (le nom s'affiche sous le cercle dans l'appli). Boîte de 520 px centrée en (540, 960), viewBox 24, même trait de 2,8 pour les 4. Contrôle : rayon maximal de l'encre mesuré depuis le centre, limite 360 px.

| Ordre | Fichier | Nom à saisir dans Instagram | Pictogramme | Rayon max |
|---|---|---|---|---|
| 1 | `instagram-alaune-quiz.png` | Quiz | Point d'interrogation dans un cercle | 248 px |
| 2 | `instagram-alaune-vannes.png` | Vannes | Micro de scène sur pied | 263 px |
| 3 | `instagram-alaune-conseils.png` | Conseils | Ampoule | 250 px |
| 4 | `instagram-alaune-repartie.png` | Répartie | Deux bulles de dialogue | 328 px |

Contrôle : `instagram-alaune-*-controle.png` (cercle pointillé de rayon 360, boîte de 520 px, extérieur en rose). Aperçu : `instagram-alaune-apercu-mobile.png` (les 4 cercles de 64 px dans l'ordre ci-dessus, nom en 12 px dessous). Créer les stories à la une dans cet ordre : Quiz, Vannes, Conseils, Répartie.

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
