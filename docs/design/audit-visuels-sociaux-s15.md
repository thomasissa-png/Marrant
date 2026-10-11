# Audit des visuels sociaux, s15 (05/10/2026)

Périmètre : 12 cartes Instagram réelles (`docs/social/visuels-s15/ig-01` à `ig-12`, toutes ouvertes), gabarit `apps/web/src/lib/social/templates/instagram-templates.tsx`, rendu `image-generator.ts`, routage `generate-post-image.ts`, design system (`docs/design/design-system.md`). Aucun code modifié. Aucune carte n'a encore été vue du public : tout est refaisable.

## 1. Constat d'ensemble

- Répartition réelle : 8 cartes « article » (ig-01, 05, 07 à 12) et 4 cartes vanne (ig-02, 03, 04, 06).
- Cause de l'étiquette « LA VANNE » sur les articles : `generate-post-image.ts` l.49-54 envoie tout post sans paire amorce/chute dans `generateLaVanne` avec `setup: ""`, et `instagram-templates.tsx` l.233 code le badge « La Vanne » en dur. Le séparateur violet (l.273-281) s'affiche alors au-dessus du titre, sans amorce (ig-01, y≈518).
- Un seul gabarit, une seule ambiance : les 12 cartes sont interchangeables à 3 pixels près. Marque = violet `#8B5CF6` + Inter. La police titre du site (Syne, `design-system.md` l.36) n'est pas chargée (`image-generator.ts` l.56-60 : Inter seule), et le logo n'apparaît nulle part.
- Italique déclaré (`instagram-templates.tsx` l.289) mais non rendu : aucune fonte italique n'est chargée (ig-02, chute droite).

## 2. Grille V1 à V8

| Critère | Note | Preuve | Correction n°1 |
|---|---|---|---|
| V1 Arrêt du défilement | 3 | ig-01 : titre sur 130 px de haut dans une carte de 1080, ~60 % de noir vide au-dessus. Seul accent : un badge de 190 px. Les 12 cartes se confondent dans un fil. | Format 4:5, titre en Syne 800 qui remplit ≥ 60 % de la surface, un aplat de couleur du système (`#6D28D9`) sur la slide chute. |
| V2 Lisibilité mobile | 5 | Contrastes bons (blanc sur `#0D0D0D`, `#B3B3B3` ≈ 9:1), chute 56 px lisible (ig-02). Mais URL 22 px et badge 24 px (l.71, l.91) = ~8 px sur un téléphone de 390 px. Amorce grise 40 px, faible. | Plancher 28 px pour tout texte (10 px à l'écran), amorce 56 px, chute 80 px. |
| V3 Typographie française | 3 | Apostrophes droites sur les 12 cartes (« d'Halloween » ig-01, « L'audioguide » ig-02). Orphelins : « 8 » ig-01, « 5 » ig-05 et ig-10, « à » ig-09, « heures. » seul en ligne 2 ig-02, « lui. » ig-03. Article « les » / « aux » en fin de ligne (ig-07, ig-12). Guillemets anglais `&ldquo;` en l.201. | Fonction de typographie unique : ’ , U+202F avant ; ? !, U+00A0 avant : et dans « », nombre collé à son nom, 2 derniers mots collés. |
| V4 Identité de marque | 3 | Palette identique au site (`#0D0D0D`, `#8B5CF6`), donc cohérente, mais « noir + violet + Inter » est le look générique du dark mode. Pas de Syne, pas de logo (le « d » violet de `favicon.svg` existe, non utilisé), URL en gris `#9A9A9A` 22 px. | Syne pour titre/chute, monogramme « d » + nom du site en pied de chaque slide, violet en aplat plein et non en filet. |
| V5 Mise en scène de l'humour | 4 | Hiérarchie amorce grise / chute blanche plus grosse correcte (ig-03, ig-06). Mais amorce et chute sont lues d'un seul regard : aucune attente, aucune surprise. La chute est répétée dans la légende (`index.txt` l.2-4, 6) si c'est bien la légende. | Carrousel : slide 1 amorce, slide 2 chute. Légende = amorce ou teaser, jamais la chute. |
| V6 Adaptation type / réseau | 2 | Étiquette fausse sur 8 cartes sur 12. Article, conseil et vanne indiscernables. Aucun appel à l'action sur l'image (« Lien en bio » n'est que dans la légende). `SIZE = 1080` carré en dur (`image-generator.ts` l.31). Aucune déclinaison X ni LinkedIn. | Un `kind` (vanne / article / conseil) qui pilote étiquette, composition et pied de carte ; tailles X et LinkedIn. |
| V7 Envie de partager / enregistrer | 3 | Les vannes ig-03 et ig-04 se partagent grâce au texte, pas à la carte. Les 8 articles n'offrent rien à enregistrer : ig-07 n'est qu'un titre, sans promesse ni extrait. | Slide 2 d'une carte article = une vanne tirée de l'article, mot pour mot (contenu validé), slide 3 = « les autres sur le site ». |
| V8 Conformité et finition | 4 | OK : pas de mention IA, pas de tiret cadratin, pas de concurrent, vannes à la 1re personne autorisées (choix fondateur). KO : étiquette fausse, apostrophes droites, « 50+ techniques » en dur (l.417, hors des chiffres dynamiques du site), « Swipe » (l.364), double filet violet redondant (séparateur + barre l.110-119). | Retirer les chiffres en dur, tout en français, un seul élément graphique de séparation. |

**Note globale : 3,4 / 10** (moyenne simple). Base saine (palette alignée au site, contrastes), exécution à refaire : ce ne sont pas des visuels de marque, ce sont des captures de texte.

## 3. Défauts par carte

| Fichier | Défauts précis |
|---|---|
| ig-01-10-05.png | Badge « LA VANNE » sur un article. Filet orphelin au-dessus du titre. « : 8 » en fin de ligne 1, « vannes » coupé de son chiffre. Apostrophe droite « d'Halloween ». Zéro visuel Halloween. |
| ig-02-10-06.png | Chute coupée : « heures. » seul en ligne 2. Apostrophes droites (L'audioguide, s'est, J'ai). Chute visible dès l'ouverture. |
| ig-03-10-07.png | Deux phrases dans la chute (« On n'en a jamais parlé. » est un second temps, à isoler sur une slide ou une ligne). Apostrophes droites. |
| ig-04-10-09.png | Bonne vanne, carte vide : chute sur une ligne, 700 px de noir. Apostrophes droites (qu'il, m'avait, s'il). |
| ig-05-10-12.png | « LA VANNE » sur un article. « : 5 » en fin de ligne, « accroches » rejeté en ligne 2. |
| ig-06-10-13.png | Chute visible d'emblée, légende qui répète la chute. Seule carte vanne sans apostrophe : typographie correcte, mais carte aussi vide que les autres. |
| ig-07-10-19.png | « LA VANNE » sur un article. « les / tensions » coupé, « l'humour » apostrophe droite. Aucun extrait ni promesse. |
| ig-08-10-26.png | « LA VANNE » sur un article, alors que le thème (assistants vocaux) est le plus visuel du lot. « l'IA », « : 6 » en fin de ligne. |
| ig-09-11-02.png | « LA VANNE » sur un article. « à » orphelin en fin de ligne 1. |
| ig-10-11-09.png | « LA VANNE » sur un article. « : 5 » en fin de ligne, « règles » seul avec « entre potes ». |
| ig-11-11-16.png | « LA VANNE » sur un article. Le « : » reste en fin de ligne 1 (acceptable, à garder collé au mot par U+00A0) ; seul défaut propre à la carte : titre de 2 lignes dans une carte vide. |
| ig-12-11-23.png | « LA VANNE » sur un article. « aux » en fin de ligne 1, « questions gênantes » en ligne 2. |

Défauts communs : `padding: 72` met badge et URL à 72 px du bord ; avec la grille de profil Instagram en 3:4 (recadrage central d'un carré, [À VÉRIFIER sur le compte réel]), 135 px sont coupés de chaque côté et le badge comme l'URL peuvent disparaître de la vignette.

## 4. Nouvelle direction visuelle : 2 pistes

Règles communes aux deux pistes : uniquement les tokens du design system (`#0D0D0D`, `#1F1F1F`, `#8B5CF6`, `#A78BFA`, `#6D28D9`, blanc, `#B3B3B3`), pas de dégradé, pas d'illustration, pas d'emoji ; Syne 800/700 pour titres et chutes, Inter 400/700 pour le reste ; texte aligné à gauche (ton « pote », pas affiche officielle) ; pied de carte = monogramme « d » du favicon + « deviens-marrant.fr » à 28 px minimum ; zone de sécurité 96 px de chaque côté ; typographie française appliquée par une fonction unique ; plancher de texte 28 px.

### Piste A : « Carrousel 4:5, amorce puis chute » (recommandée)

- **Format** : 1080×1350 (4:5), carrousel de 2 à 3 slides, pagination « 1/2 » en pied.
- **Vanne** : slide 1 sur `#0D0D0D`, grand « de Syne 800 violet `#8B5CF6` (160 px), amorce en Syne 700 blanc 64 px, indice « Glisse » en bas. Slide 2 sur aplat `#6D28D9`, chute en Syne 800 blanc 84 px (contraste ≈ 7:1), rien d'autre. Le changement de fond joue le rôle du rire. La légende ne contient que l'amorce.
- **Article** : étiquette « ARTICLE » (pas « Vanne »). Slide 1 : numéro de la liste en géant violet (« 8 ») et titre Syne 800 72 px, nombre et nom collés. Slide 2 : une vanne de l'article reprise mot pour mot (catalogue validé). Slide 3 sur `#6D28D9` : « Les 7 autres sur deviens-marrant.fr, lien en bio ». Si l'article n'a pas de vanne extractible : slide 1 + slide 3 seules.
- **Conseil** : étiquette « CONSEIL ». Slide 1 : la situation (la phrase reçue). Slide 2 : la réplique, sur aplat `#6D28D9`. Même mécanique que la vanne, valeur pratique.
- **X** : 1600×900. Pour un article : couverture (slide 1 recadrée, sans pagination). Pour une vanne : on testera la slide chute seule, le tweet portant l'amorce. Texte du tweet inchangé (single post).
- **LinkedIn** : 1200×627 pour un lien d'article (couverture sans étiquette de type), 1080×1350 pour un carrousel conseil. Même cartes, même ton, sans emoji ni formule de coach.
- **Points forts** : seule piste qui donne une vraie surprise (V5), de quoi enregistrer sur les articles (V7), signature reconnaissable par l'aplat violet + Syne (V4).
- **Risques** : le pipeline actuel produit une image par post. À vérifier par @fullstack : `instagram-client.ts` et `image-storage.ts` (non lus dans cet audit) gèrent-ils un carrousel ? Si non, le chantier est à chiffrer ; repli = piste B.

### Piste B : « Affiche typographique monobloc 4:5 »

- **Format** : 1 seule image 1080×1350, aplat `#6D28D9` sur toute la carte, pas de swipe.
- **Vanne** : amorce en haut (Syne 700 52 px, blanc à 80 %, 3 lignes max), chute en bas, en Syne 800 96 px blanc, remplissant la moitié de la carte. Lecture en deux temps par l'écart de taille, pas par le swipe.
- **Article** : titre Syne 800 88 px en 4 lignes max, nombre en `#A78BFA`, étiquette « ARTICLE », « Lien en bio » en pied. **Conseil** : situation en haut, réplique en bas, même grille que la vanne.
- **X** 1600×900 et **LinkedIn** 1200×627 : même composition recalée, aucune adaptation de contenu.
- **Points forts** : une image, pipeline inchangé, déclinaison X et LinkedIn triviale, très lisible en miniature (V1, V2).
- **Limites** : chute visible avec l'amorce (V5 plafonne vers 5), moins de raisons d'enregistrer un article (V7), aplat violet plein sur toute la carte moins « pote dark » que le site.

### Recommandation

Piste A, avec le fallback B si le carrousel n'est pas gérable côté publication. Raison : le défaut principal est l'absence de mise en scène de la chute (V5) et de valeur à enregistrer (V7), que seul le carrousel corrige ; l'identité (V4) se joue sur Syne, l'aplat `#6D28D9` et le monogramme, communs aux deux pistes. Les 3 éléments de la couverture article (nombre géant, Syne, pied de marque) sont réutilisables à l'identique en B. [HYPOTHÈSE : les carrousels génèrent plus d'enregistrements que les images fixes, usage courant non mesuré sur ce compte]. Thomas choisit ; validation à faire sur 3 modèles (1 vanne, 1 article, 1 conseil) avant de regénérer les 12.

## 5. Modifications exactes dans `instagram-templates.tsx` (piste A)

1. Constantes : remplacer la hauteur 1080 de `SlideWrapper` (l.48-49) par `WIDTH = 1080` / `HEIGHT = 1350`, padding horizontal 96, aucune nouvelle couleur hors `COLORS`. Utiliser `accentSecondary` (`#6D28D9`) comme fond des slides chute et dernière slide.
2. Ajouter une prop `kind: "vanne" | "article" | "conseil"` à `SlideWrapper`. Supprimer le badge violet en dur (l.65-82, l.233) : étiquette en texte `#A78BFA` 28 px, libellé selon `kind`. Vanne : pas d'étiquette.
3. Pied de carte : supprimer la barre dégradée (l.109-119) et le séparateur (l.272-281). Pied = monogramme « d » (d'après `favicon.svg`) + « deviens-marrant.fr » 28 px `#B3B3B3` (et non `#9A9A9A` 22 px, l.88-89) + pagination.
4. Scinder `LaVanne` (l.231-300) en `LaVanneAmorce` et `LaVanneChute` : amorce en Syne 700 64 px blanc alignée à gauche avec guillemet « violet ; chute en Syne 800 84 px blanc sur fond `#6D28D9`. Supprimer `fontStyle: italic` (l.289, jamais rendu).
5. Créer `ArticleCover` (nombre extrait du titre en violet 200 px, titre Syne 800 72 px), `ArticleExtrait` (une vanne reprise telle quelle) et `ArticleFin` (« Les N autres sur deviens-marrant.fr, lien en bio »).
6. Créer `ConseilSituation` et `ConseilReplique` (même grille que la vanne).
7. Ajouter une fonction `typo(text)` appliquée à tout texte affiché : ’ à la place de ', U+00A0 avant « : », U+202F avant « ; ? ! », espaces dans « », nombre collé au nom suivant, deux derniers mots collés. Vérifier si la version de satori installée gère `textWrap: balance` ; sinon équilibrage manuel.
8. Gabarits hérités : l.201 `&ldquo; &rdquo;` remplacé par « », l.364 « Swipe » remplacé par « Glisse », l.417 « 50+ techniques » retiré (chiffre en dur non aligné sur les compteurs dynamiques du site).
9. Plancher : aucun `fontSize` sous 28 (l.71, l.91, l.184, l.212, l.359, l.456 à relever).
10. Hors gabarit, mais indispensable : `image-generator.ts` (SIZE l.31, l.143-144, l.152-153, l.158 → largeur et hauteur séparées, + Syne 700/800 en TTF dans `public/fonts/` et dans `loadFonts`) ; `generate-post-image.ts` (l.36-54 : router par `kind`, ne plus envoyer un article dans `generateLaVanne`, et supprimer le repli `LeDefi` l.76-82 qui rend n'importe quel format inconnu) ; support carrousel côté publication à confirmer par @fullstack.
11. Après validation de Thomas : regénérer les 12 PNG, audit visuel sur les rendus réels (miniature 3:4 de la grille de profil incluse), puis relance des 3 réseaux.
