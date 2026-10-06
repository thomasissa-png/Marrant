# Bannières des réseaux (s15, 06/10/2026)

Rendu réel `next/og` (même moteur que les cartes « piste A » v4 et la carte LinkedIn v5) : Plus Jakarta Sans 800/700, Inter pour l'adresse, noir `#0D0D0D`, aplat `#6D28D9`, lilas `#A78BFA` sur noir et `#DDD6FE` sur l'aplat, monogramme « d » + deviens-marrant.fr. Les lignes sont calculées sur les largeurs réelles des glyphes (`mise-en-lignes.ts`). La vanne suit la règle R6 : une paire « » par ligne, « suspendu, » collé au dernier mot.

Script : `cd apps/web && npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-bannieres.ts`. Chaque PNG a sa version `-controle.png`, avec les zones masquées en surimpression (rouge : élément d'interface ; orange : recadrage mobile ; zone rose hors du cercle sur Instagram). J'ai ouvert et vérifié chaque PNG. Rien n'est publié et le site n'est pas modifié.

## X, en-tête 1500×500 (choisir A ou B)

| Fichier | Texte | Composition |
|---|---|---|
| `x-entete-a-message.png` | Une vanne par jour pour devenir **plus drôle.** (bio validée, « plus drôle. » en lilas) | Noir, 2 lignes à 84 px (x 112, y 91 à 279), pied en bas à droite (monogramme 72, adresse 44 px). |
| `x-entete-b-vanne.png` | Même message (3 lignes à 60 px, y 84 à 286) + vanne du pool strict `cs14jk90226d6abb90287724`, mot pour mot : « Ma mère me demande encore des nouvelles de mon ex. » « Je n'en ai pas. Elle, si. » | Message sur noir à gauche, vanne sur l'aplat à droite (x 780 à 1500, 46 px, y 111 à 389). Pied (48 / 30 px) à droite de la photo de profil. |

Zones sûres retenues : photo de profil x 0 à 400 sur y 300 à 500 ; recadrage mobile de 70 px en haut et en bas, soit une bande utile de y 70 à 430. Rien de ces zones n'est occupé (contrôle : `x-entete-*-controle.png`).
Lisibilité mobile (écran de 390 px, échelle 0,26) : message A environ 22 px, message B environ 16 px, vanne B environ 12 px, adresse environ 8 à 11 px (secondaire, déjà présente dans le profil). **A est la plus lisible ; B montre le ton dès l'en-tête.**

## LinkedIn, couverture de page entreprise 1128×191 (choisir A ou B)

| Fichier | Texte | Composition |
|---|---|---|
| `linkedin-couverture-a-noir.png` | Des vannes **pour le bureau**, / un quiz pour ton profil d'humour. (bio, coupe imposée après la virgule) | Noir, 2 lignes à 44 px (x 300 à 1003), pied sous le texte (monogramme 36, adresse 24 px), y 22 à 169. |
| `linkedin-couverture-b-aplat.png` | Des vannes pour le bureau. / Un quiz pour ton profil d'humour. | Aplat, titre 54 px blanc + sous-titre 32 px lilas clair (x 300 à 1008, y 45 à 147), sans pied. |

Zone sûre retenue : logo de la page x 0 à 260 sur y 90 à 191 ; tout le texte part de x 300 et garde au moins 20 px de marge en haut, en bas et à droite. Sur mobile (échelle 0,35 environ), les textes de 44 et 54 px font 15 à 19 px.

## Instagram, couvertures de stories à la une 1080×1920

Instagram n'a pas de bannière. J'ai fait 4 couvertures sur l'aplat, avec un pictogramme lilas clair et un libellé blanc à 132 px, centrés dans le cercle de 1080 px de diamètre (centre 540, 960). Aucun émoji.

| Fichier | Libellé | Pictogramme |
|---|---|---|
| `instagram-alaune-vannes.png` | Vannes | Guillemets « » (Plus Jakarta 800, calés sur 440 px de large) |
| `instagram-alaune-conseils.png` | Conseils | Ampoule (tracé) |
| `instagram-alaune-quiz.png` | Quiz | « ? » (Plus Jakarta 800) |
| `instagram-alaune-bureau.png` | Bureau | Mallette (tracé) |

Contrôle : `instagram-alaune-*-controle.png` (cercle pointillé, extérieur en rose). Au moment de créer la story à la une, donner aussi le même nom dans Instagram : le cercle du profil est petit et le nom affiché dessous reste la référence.

## Contrôles du texte

Les textes ne contiennent aucun tiret cadratin, aucune mention de l'IA, aucun prix, aucun « gratuit » et aucun nom de personne. La vanne vient du pool strict (`config/social-pool.ts`) et du catalogue validé.
Hypothèse : les zones masquées sont des relevés approximatifs des interfaces en octobre 2026. Les vérifier après la mise en ligne, sur un téléphone et sur un ordinateur.
