# Cartes du jour (accueil) : diagnostic et spec

## Spec v2 (tour 2, après relecture à l'aveugle de la v1, code 5b7b245)
Notes v1 : designer 8, visiteur mobile 8, UX 7,7 ; point faible commun : espacements et alignements (6), rangée PC en escalier, conseil trop long sur mobile, finition. **La v2 remplace la v1 là où elle la contredit** ; le reste de la v1 (historique plus bas) reste valable. Faits relus dans le code v1 et les captures `apres-v1/`.

### V2.1 Grille et seuils
- Sous 1280 px : pile d'une colonne `max-w-xl` centrée (576 px, ≈ 75 caractères par ligne), cartes à hauteur naturelle. Dès 1280 px (`xl`) : `xl:grid-cols-3 xl:items-stretch xl:max-w-none`, gap 24 px. La constante `GRILLE` passe de `lg:` à `xl:`.
- Justification : à 1024 px la carte fait 309 px (texte 261 px) : conseil sur 11 lignes, titre cassé, c'est l'étriqué relevé par l'UX. Dès 1280 px le texte fait 340 px, largeur déjà relue à 1280 et 1440. `xl` est dans l'échelle du design system ; 1100 px aurait été une valeur arbitraire. Entre 1024 et 1279 px, une colonne de lecture de 576 px est volontairement sobre.
- Vidéo en pile (768 à 1279 px) : lecteur et titre côte à côte, `grid gap-4 md:max-xl:grid-cols-2 md:max-xl:items-start` (lecteur ≈ 256 px, 144 px de haut au lieu de 296) ; titre et chaîne à droite ; accordéons et pied dessous en pleine largeur. Hors de cette plage : empilé comme en v1.
- **Conteneur : ne pas modifier celui de la section.** Elle est déjà dans le gabarit commun (`max-w-7xl px-8`, 1216 px utiles) comme toutes les sections ; le logo du header et la 1re carte partent tous deux de x = 112 px à 1440 px. Le débord de 21 px est DU HEADER : ses éléments `shrink-0` font ≈ 1237 px dans 1216 (Premium finit à 1349 px au lieu de 1328). Élargir la section seulement à droite la désalignerait de toutes les autres sections. **Décision orchestrateur** : corriger le header (piste d'une ligne : onglets `px-2` → `px-1.5` dès 1280 px, soit 7 × 4 = 28 px gagnés, à confirmer par `header-budget.spec.ts`).

### V2.2 Hauteurs égales dès 1280 px, bouton toujours collé à la vanne
- Carte `xl:h-full`, corps `flex flex-1 flex-col gap-4`, `Pied` en `mt-auto` : les 3 filets de pied sont alignés. Conseil et Vidéo : l'écart résiduel (≈ 10 à 20 px) tombe entre accordéons et pied.
- **Choix pour l'espace libre de la Vanne : groupe centré verticalement, non étiré.** Le groupe (énoncé + emplacement de la chute + accordéon) est un enfant `xl:flex-1 xl:flex xl:flex-col xl:justify-center` (jamais de `my-auto` combiné au `mt-auto` du pied : les marges auto se partageraient en trois). L'espace libre se répartit en parts égales au-dessus et au-dessous du groupe : une vanne posée au centre de sa carte se lit comme voulue, et l'emplacement reste à 12 px de l'énoncé dans tous les cas. Rejeté : agrandir l'énoncé (30 px ferait de la Vanne la carte la plus haute sur une vanne longue), ancrer en haut (vide en bas, c'est le défaut v1).
- **Le groupe ne doit jamais bouger au clic** (centré, une variation de hauteur déplacerait l'énoncé) : (a) emplacement « fantôme » : le bouton et un clone invisible de la chute (`invisible aria-hidden select-none pointer-events-none`, mêmes classes de boîte que la chute, texte réel) occupent la même cellule `grid` (`col-start-1 row-start-1`) ; l'emplacement a donc dès le départ sa hauteur finale. Au clic, le bouton ET le clone sont démontés et la vraie chute (`ref`, `tabIndex={-1}`, sans `aria-hidden`) prend la cellule : le DOM change, `aria-live` l'annonce, rien n'est lisible avant. (b) accordéon « Pourquoi ça marche » : rendu dès le départ, fermé, `invisible aria-hidden` et `max-xl:hidden` avant la chute (espace réservé seulement dès 1280 px, pas de vide en pile), visible après.
- Estimation à 1440 px : Vanne 440 à 540 px selon la longueur, Conseil ≈ 590, Vidéo ≈ 600 ; reste libre dans la Vanne de 50 à 150 px, soit 25 à 75 px de chaque côté du groupe. À vérifier sur capture.
- Conséquence assumée : ouvrir « Pourquoi ça marche » (+ 250 px) ou un accordéon fait grandir la rangée ; les pieds restent alignés, les voisines ont un vide sous leurs accordéons (transitoire, voulu par le visiteur). Un accordéon ouvert ailleurs recentre la Vanne de 40 px au plus.

### V2.3 Conseil : texte tronqué + « Lire la suite » (toutes largeurs)
- Corps `line-clamp-4 md:line-clamp-6` (4 lignes sous 768 px : gain ≈ 190 px à 320 px ; 6 lignes dès 768 px), texte intact. Les 3 relecteurs ne demandaient pas de couper le texte : il reste complet, replié en CSS.
- Bouton « Lire la suite » (déplié : « Réduire »), `button type="button" aria-expanded aria-controls`, 8 px sous le corps : `inline-flex min-h-[44px] items-center text-sm font-semibold text-accent-link hover:underline focus-visible:ring-2 focus-visible:ring-accent-link`. Rendu SEULEMENT si le texte est réellement tronqué (`ref` + `ResizeObserver` : `scrollHeight > clientHeight`) ou déjà déplié. Déplier en place, pas d'animation de hauteur.
- Pas de pastilles-ancres sous le titre (arbitrage 2) : le clamp raccourcit le défilement. Pas de coupure ni de gras dans le texte du conseil (arbitrage 9).

### V2.4 Typographie
- Énoncé : `text-xl leading-7 md:text-2xl md:leading-8 font-medium [text-wrap:balance]` (24/32 dès 768 px, plus de `xl:`). Chute : mêmes tailles, `font-semibold`, `[text-wrap:balance]` (corrige l'orphelin « fatigues. » »). Le global `p { text-wrap: pretty }` est écrasé par la classe.
- Titres de carte (h3 Conseil et Vidéo) : `font-display text-lg font-bold leading-6 [text-wrap:balance]` (18/24). Le `pretty` de la v1 isolait le dernier mot et cassait le titre du Conseil à 232 px sur 340 : avec `balance`, deux lignes égales. Repli si un relecteur juge encore la coupe trop tôt : `[text-wrap:wrap]` + espace insécable entre les deux derniers mots.
- « dujour » : le H2 et les h3 de la section reçoivent `[word-spacing:0.08em]` (aucun `tracking-*` dans le code : c'est l'espace de la police display à 36 px). À contrôler à 1440 px ; si encore serré, 0,12em. Locale à la section ; élargir au site = décision orchestrateur.
- H2 : `max-[359px]:text-2xl` (24 px, il occupait 284 px sur 288 à 320 px). Le `py-12` de la section ne change pas (rythme commun à toutes les sections ; le « vide » de 65 à 90 px vu sur capture vient du défilement de la capture, 24 px sous le header).

### V2.5 Guillemets doublés (« … » ») : à corriger au rendu, pas en base
- Cause : la donnée contient une réplique « … » imbriquée dans un « … » (`howToApply`, ex. « Quand je propose de conduire… : « Non non, repose-toi. » ») ; `contenuAffiche` ne gère pas ce niveau. Chercher d'abord le helper déjà utilisé pour les articles (choix du 05/10 : un « » dans un « … » s'affiche en “…”) et le réutiliser ; sinon en créer un local `guillemetsImbriques(texte)` : parcours avec compteur de profondeur (borné à 0), « et » de profondeur 2 et plus remplacés par “ et ”, avec suppression de l'espace insécable que `frTypo` a posé à l'intérieur. Appliquer aux chaînes de cette section (chute, énoncé, décryptage, `howToApply`, exemple, exercices, apprentissages). `contenuAffiche` et la base ne changent pas.

### V2.6 Finition
- **Icônes d'en-tête** : Lucide (`lucide-react ^0.469` déjà installé) `Laugh`, `Lightbulb`, `Clapperboard`, et `Eye` pour l'emplacement de la chute, `size={20} strokeWidth={1.75} aria-hidden className="shrink-0 text-accent-link"` ; la prop `emoji` de `EnTete` devient `icone: ReactNode`, l'`Oeil` inline disparaît. Hors de cette passe, signalés à l'orchestrateur : les 😂 💡 🎬 de `FeatureCards` (juste dessous sur la même page) et les 🔥 💀 de `ReactionButtons` (composant partagé, aussi sur /vannes) : les passer en Lucide (`Flame`, `Skull`) est cohérent avec la marque, 3 lignes chacun, effet visuel sur d'autres pages donc à valider.
- **Bordures et filets** : carte, filet du pied et filet avant « À toi de jouer » en `border-border-hover` (#3A3A3A, token existant, ≈ 1,7:1 sur le fond de page au lieu de 1,3:1) ; FeatureCards garde `border-border` (écart léger, à aligner si l'orchestrateur le veut). Accordéon fermé `border border-transparent`, ouvert `border-border-hover` (plus de saut de 1 px).
- **Un seul format d'en-tête d'accordéon** : une ligne, 44 px minimum, sur les 6. Le nom de la technique quitte le summary : « Pourquoi ça marche » seul, puis dans le corps, 1re ligne, le nom de la technique (`text-sm font-semibold text-accent-link`), puis l'explication. Corps d'accordéon en `text-text-primary` 14/24 (même couleur que le corps des cartes). « À toi de jouer » : après un filet `mt-4 border-t border-border-hover pt-4`, `text-sm font-semibold text-accent-link`, 4 px au-dessus de son texte. Libellés « Exercice du jour » et « Exercice pratique » inchangés (textes intouchables, objets différents).
- **Emplacement de la chute** (remplace §2.4 v1 sur ces points) : `border-[1.5px] border-dashed border-accent-primary/90 bg-accent-primary/10 hover:bg-accent-primary/15 focus-visible:border-solid` (≈ 4:1, pointillé lisible comme un bouton ; en focus le pointillé passe en plein sous l'anneau). Chute révélée : `border-[1.5px] border-solid border-accent-primary/60 bg-accent-primary/10 p-4`, même gabarit que l'emplacement. Écart énoncé / emplacement : `gap-4` (16 px, l'anneau de focus ne frôle plus l'énoncé), identique dans les deux états.
- **Pastilles** : Badge `className="py-1"` (24 px de haut, 12/16) ; variante `default` inchangée.
- **Cibles tactiles : aucun changement de composant partagé.** `ShareButton` et `FavoriteButton` sont déjà `h-11 w-11` (44 px, disque visible de 32 px) ; `ReactionButtons` étend sa zone de 10 px en haut et en bas (`after:-inset-y-2.5`, ≈ 44 px) pour des pastilles de 48 à 51 px de large. Les relecteurs ont mesuré le disque visible. À prouver : test Playwright `boundingBox` ≥ 44 pour partage et étoile, `elementFromPoint` à ± 10 px de la pastille de réaction, et une capture « zones » (contour pointillé injecté sur les `button`).
- **Miniature** : `YouTubePlayer` reçoit une prop optionnelle `recadrage="serre"` (défaut inchangé : /videos et fiches ne bougent pas) qui applique `origin-top scale-[1.05]` à l'image dans le conteneur `overflow-hidden` : ≈ 9 px coupés en bas, plus de bande de points lumineux. À valider sur 3 vidéos différentes de la rotation. Bouton de lecture rouge conservé (affordance vidéo reconnue) ; option O2 pour l'orchestrateur : pastille violette à anneau blanc via une 2e prop.
- **Durée de la vidéo** (visiteur) : la donnée `duration` existe déjà dans `/api/daily` mais n'est pas affichée. Si elle est lisible telle quelle (à vérifier sur la réponse réelle, ne pas la reformater ni l'inventer) : badge `absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white pointer-events-none` sur le lecteur, absent si vide.
- **Pied** : structure v1 inchangée (réactions à gauche pour la Vanne seulement, partage puis étoile à droite, 44 px). Le vide à gauche de Conseil et Vidéo est assumé : les réactions n'existent que pour les vannes.

### V2.7 Non retenu, avec raison
Pastilles-ancres (arbitrage 2) ; paragraphes et gras dans le conseil (arbitrage 9) ; sous-titres aux accordéons (un seul format sans sous-titre) ; libellés visibles sur les réactions (composant partagé, `aria-label` déjà présent) ; 2 colonnes à 1024 px (trois compositions différentes selon la largeur) ; animation de hauteur des accordéons (hors besoin, `details` natif).

### V2.8 Captures v2 et critères de relecture ajoutés
- Captures aux 6 largeurs (320, 375, 768, 1024, 1280, 1440) : `avant`, `chute`, `decryptage`, `accordeons`, `lire-suite` (conseil déplié), plus `focus-bouton`, `focus-accordeon` (summary du Conseil), `focus-partage`, `focus-etoile`, `focus-video` (bouton de lecture) à 375 et 1280, et `zones` (zones cliquables contourées) à 375.
- Critères : (1) dès 1280 px les 3 bords hauts ET les 3 filets de pied sont alignés, aucun vide intérieur supérieur à 80 px, aucun vide sous le bouton « Révéler la chute » ; (2) l'énoncé ne bouge pas d'un pixel entre `avant` et `chute` ; (3) le texte du Conseil est tronqué à 4 lignes sous 768 px et à 6 ensuite, avec « Lire la suite » à 44 px ; (4) à 1024 px, une colonne de 576 px, rien d'étriqué ; (5) plus de « » » ni de « dujour », chute sans orphelin ; (6) 6 en-têtes d'accordéon identiques ; (7) bordures de carte et filets visibles à 100 % de zoom ; (8) miniature sans bande résiduelle ; (9) icônes d'en-tête Lucide, aucune dans un carré.

---
# Historique : diagnostic et spec v1

@design · branche `claude/marrant-cartes-du-jour` · sources : `daily-content.tsx` (372 l.), captures `avant/` (PC 1440 et 1280, mobile 375 et 320), `tailwind.config.ts`, `gabarit.ts`, `feature-cards.tsx`. Mesures lues sur les captures, à ± 5 px.
Artefact de capture (pas un défaut du site) : les captures PC sont rognées aux bords de la section (cartes collées au viewport) et le header sticky recouvre le haut des captures « chute révélée » et mobile 320. Les captures « après » se font en viewport complet, header inclus, section en milieu d'écran.

## 1. Diagnostic (B = bloquant, M = majeur, m = mineur)

### Avant clic
- **B1 Bouton détaché de la vanne.** Vide entre la dernière ligne de la vanne et « Révéler la chute » : 268 px (PC 1440), 302 px (375), 394 px (320). Cause : `items-stretch` sur la grille, `flex-1` sur le corps, `mt-auto` sur le bouton. Le bouton se lit comme une action de pied de carte, pas comme la suite de la phrase.
- **B2 Rien ne dit ce qui va apparaître.** Bouton pleine largeur, libellé seul, aucun emplacement matérialisé : on s'attend à un contenu et on ne voit pas où il viendra. Il ressemble à un bouton de navigation.
- **B3 Mobile : carrousel.** La carte suivante est rognée (14 % de la largeur) et montre des fragments de texte illisibles (« Q / lo / ré… »), donc un bug apparent ; la 3e carte est invisible, sans point ni flèche ; toutes les cartes prennent la hauteur de la plus haute (667 px à 375, 786 px à 320) ; zone défilante rendue focusable (`tabIndex=0`) pour contenter axe.
- **M4 Cartes étirées.** Conseil et Vidéo sont étirées à 576 px (PC) : vide de 45 px (Conseil) et 17 px (Vidéo) avant le pied, qui explose après clic (B14).
- **M5 Tablette 768 à 1023 px.** 3 colonnes de ≈ 230 px avec `p-4` : texte serré ; le conseil est coupé par `md:max-lg:line-clamp-6` sans « lire la suite » (contenu perdu).
- **M6 En-têtes hétérogènes.** Emoji 24 px (≈ 30 px rendu) à côté d'une pastille de 20 px ; 2 à 4 pastilles en 3 variantes (primary, secondary « Débutant », default) ; le type est dit deux fois (emoji + pastille primary) ; sur mobile, « Digital & Gaming » passe à la 2e ligne, donc le corps ne démarre pas à la même hauteur d'une carte à l'autre.
- **M7 Trois hiérarchies typo.** Vanne : 20/28 medium sans titre. Conseil : h3 18 + corps 14. Vidéo : h3 16. Aucun premier niveau commun.
- **M8 Accordéons.** Deux styles (gris, violet teinté), libellés 12 px MAJUSCULES violet à fort tracking, séparés de 16 px comme des blocs indépendants ; corps en `leading-relaxed` (22,75 px, hors grille de 4).
- **M9 Pied incohérent.** Vanne : 🔥 💀 + partage + favori ; Conseil et Vidéo : partage + favori seulement, calés à gauche. Les icônes ne tombent pas au même endroit d'une carte à l'autre.
- **M10 Marges hors gabarit.** `p-6 / md:p-4 / lg:p-6` au lieu de `MARGE_ENCADRE` (`p-5 max-[399px]:px-4 md:p-6`) déjà utilisée par FeatureCards, juste en dessous.
- **m11 Titre vidéo étroit.** Lignes de ≈ 205 px dans une colonne de 340 px : `text-wrap: balance` hérité (probable). Le nom de chaîne répète le début du titre (« Karim Duval - Élever… » puis « Karim Duval »).
- **m12 Vignette YouTube.** Bandes noires latérales et texte coupé en haut : vignette source (`hqdefault`), pas du code. Hors périmètre.
- **m13 Barres dégradées de 4 px.** Trois variantes quasi indiscernables ; identité commune avec FeatureCards, on garde.

### Après clic sur « Révéler la chute »
- **B14 La carte Vanne explose.** 576 → 801 px (PC 1440), 667 → 1010 (375), 786 → 1236 (320). Sur PC, Conseil et Vidéo sont étirées avec 270 px et 242 px de vide sous leurs accordéons (B1 aggravé).
- **M15 La chute est sous-traitée.** 16 px violet sur violet 10 %, plus petite que l'énoncé (20 px) : c'est pourtant la phrase qui fait rire.
- **M16 Encadrés empilés.** Chute (encadré) + « Pourquoi ça marche » (encadré) + « À toi de jouer » (encadré dans l'encadré) + lien : trois niveaux de fonds et bordures. Libellé « POURQUOI ÇA MARCHE : LE RETOURNEMENT DE PERSPECTIVE » en 12 px majuscules sur 3 lignes à 375 px ; lien en 12 px muted.
- **M17 Interaction non soignée.** Le bouton disparaît (saut de mise en page), le focus clavier est perdu, rien n'est annoncé aux lecteurs d'écran, `animate-fade-in` sans `motion-reduce`.

## 2. Spec cible

### 2.1 Principes
- Même squelette pour les 3 cartes : barre dégradée 4 px (inchangée), en-tête, corps, pied. Carte : `relative flex flex-col overflow-hidden rounded-xl border border-border bg-background-card`.
- Zone interne : `flex flex-col gap-4 ${MARGE_ENCADRE}` (import `@/components/layout/gabarit`). Écarts : 16 px entre blocs, 12 px énoncé/emplacement, 8 px entre accordéons et entre ligne d'en-tête et pastilles.
- Plus de `items-stretch`, `flex-1`, `mt-auto`, `min-h` d'égalisation. Uniquement les tokens existants : `background-*`, `accent-*`, `text-*`, `border`, `animate-slide-up` (300 ms ease-out). Site en thème sombre unique : contrastes AA vérifiés sur `background-card` et `background-elevated` (`accent-link` ≥ 4,5:1, bordure `accent-primary/80` ≈ 3,2:1).

### 2.2 Grille et mobile
- Sous 1024 px : pile verticale, 1 colonne, `grid gap-4 md:gap-6` ; dès 768 px `mx-auto max-w-xl` (576 px). Dès 1024 px : `lg:grid-cols-3 lg:max-w-none lg:items-start` (gap 24 px). Pas de `line-clamp` sur le conseil.
- Carrousel écarté, justification : (a) la Vanne passe à ≈ 1000 px une fois révélée, incompatible avec des cartes côte à côte ; (b) contenu rogné et 3e carte invisible ; (c) geste horizontal non découvrable. En pile, les 3 contenus se suivent à 16 px d'écart ; la Vanne repliée mesure ≈ 380 px, donc le haut de la 2e carte apparaît dès le premier écran quand la section est atteinte. Aucun composant de navigation ajouté.
- Retirer `role="region"`, `tabIndex={0}` et `overflow-x-auto` ; `<section aria-labelledby="contenu-du-jour-titre">` suffit.
- Skeleton : mêmes classes de grille, 3 cartes `min-h-[360px]` (limite le saut de mise en page à l'arrivée des données).

### 2.3 En-tête (identique sur les 3)
- Ligne 1 `flex items-center gap-2` : emoji inchangé (😂 💡 🎬, ceux de FeatureCards) en `text-xl leading-7`, `aria-hidden`, puis le type (textes inchangés : « Vanne du jour », « Conseil du jour », « Vidéo du jour ») en `<p class="text-sm font-semibold leading-5 text-text-primary">`. Plus de Badge `primary` pour le type.
- Ligne 2, seulement s'il y a des pastilles : `flex flex-wrap gap-2`, Badge `variant="default"` UNIQUEMENT (plus de `primary` ni `secondary`). Vanne : catégorie. Conseil : difficulté puis catégorie. Vidéo : catégorie puis technique (règle de dédoublonnage actuelle conservée).

### 2.4 Carte Vanne
Ordre : en-tête, énoncé + emplacement de la chute, (après clic) accordéon « Pourquoi ça marche », pied.
- Bloc `flex flex-col gap-3` : énoncé `<p class="text-xl font-medium leading-7 text-text-primary [text-wrap:pretty] xl:text-2xl xl:leading-8">`, puis l'emplacement de la chute, 12 px dessous, jamais plus : il fait corps avec la phrase.
- Emplacement = `<div id="chute-du-jour" aria-live="polite">`.
  - Avant clic, un seul `<button type="button" aria-expanded="false" aria-controls="chute-du-jour">` qui EST l'emplacement : `flex min-h-[72px] w-full items-center justify-center gap-3 rounded-lg border border-dashed border-accent-primary/80 bg-accent-primary/5 px-4 text-base font-semibold text-text-primary transition-colors duration-150 hover:border-accent-primary hover:bg-accent-primary/10 active:bg-accent-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background-card`. Contenu : icône œil SVG inline `h-5 w-5 text-accent-link` (`aria-hidden`, trait 2 comme les chevrons) + « Révéler la chute » (libellé inchangé). Le pointillé dit « place vide à remplir » : on sait où le contenu arrivera.
  - Exception assumée à la règle « `outline-accent` unique » de `button.tsx` : c'est un contrôle de révélation, pas une action d'entrée dans le produit ; classes dans une constante locale `CHUTE_EMPLACEMENT`, `Button` non modifié.
  - Au clic, le bouton est remplacé au MÊME endroit par `<div tabIndex={-1} class="min-h-[72px] rounded-lg border border-accent-primary/40 bg-accent-primary/10 p-4 animate-slide-up motion-reduce:animate-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link">` contenant la chute `<p class="text-xl font-semibold leading-7 text-text-primary xl:text-2xl xl:leading-8">` (même taille que l'énoncé, blanche, un cran plus grasse). Le pointillé devient plein : l'emplacement s'est rempli. Le focus passe sur ce div (ref + effet), la région live annonce la chute.
  - Pas de bouton « masquer » (fonction inchangée).
- Si `comedyTechnique` : sous la chute, un seul `details` fermé (style §2.7). Summary : « Pourquoi ça marche » (texte existant) et, sur une 2e ligne `text-sm font-normal text-text-secondary`, le nom de la technique (`contenuAffiche(comedyTechnique)`, sans « : » ni majuscules forcées). Ouvert : `techniqueExplanation`, puis, après un filet `mt-3 border-t border-border pt-3` et SANS encadré imbriqué, « À toi de jouer » (`text-sm font-semibold text-text-primary`) et `howToApply` (14/24 secondary), puis la phrase du lien vers « L'anatomie d'une vanne » en `text-sm text-text-secondary` (plus de 12 px), lien `text-accent-link underline underline-offset-2`.
- **Décision D1 à valider** : décryptage fermé par défaut (recommandé : la carte grandit d'≈ 90 px au lieu d'≈ 330 px, même pattern que Conseil et Vidéo, contenu à un tap sous la chute). Variante : attribut `open` posé à la révélation si Thomas veut le décryptage visible d'emblée ; rien d'autre ne change.
- Sans `data.joke` : message inchangé, pas de pied.

### 2.5 Cartes Conseil et Vidéo
- **Conseil** : en-tête ; `h3` `font-display text-lg font-bold leading-7 text-text-primary [text-wrap:pretty]` ; corps complet `text-sm leading-6 text-text-primary` (14/24) ; accordéons « Exemple concret » puis « Exercice du jour » dans `flex flex-col gap-2` ; pied.
- **Vidéo** : en-tête ; lecteur `aspect-video rounded-lg` (inchangé) ; `h3` identique à celui du Conseil + `line-clamp-3` (fin du `balance`, 16 → 18 px) ; ligne chaîne `mt-1 text-sm text-text-secondary`, non rendue si le titre commence déjà par le nom de la chaîne (comparaison insensible à la casse, affichage seul, donnée intacte) ; accordéons « Ce que tu vas apprendre » puis « Exercice pratique » ; pied. Blocs séparés de 16 px.
- Sans donnée : message inchangé, pas de pied.

### 2.6 Pied de carte (identique sur les 3)
`flex min-h-[44px] items-center justify-between gap-2 border-t border-border pt-3`. Gauche : `ReactionButtons`, Vanne seulement (aucune fonction ajoutée aux autres cartes). Droite : `div.ml-auto.flex.items-center.gap-1` avec `ShareButton` puis `FavoriteButton`, dans cet ordre sur les 3 cartes : partage et favori tombent au même x partout. Composants partagés inchangés (cibles 44 px, 🔥 💀 communs avec `/vannes`). À 320 px : ≈ 225 px requis pour 256 px utiles, à confirmer sur capture.

### 2.7 Accordéons (les 6, un seul style)
- Conteneur : `group/d rounded-lg border border-border bg-background-elevated open:border-border-hover`. Fin de la variante violette : le violet reste réservé à l'emplacement de la chute et aux liens.
- Summary : `flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-semibold text-text-primary [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link`. Casse normale, plus de majuscules.
- Chevron `text-accent-link transition-transform duration-150 motion-reduce:transition-none`. Corps `px-4 pb-4 text-sm leading-6 text-text-secondary`. Ouvrir un accordéon ne modifie que sa propre carte (§2.8).

### 2.8 Hauteurs
Cartes alignées en haut (`items-start`), chacune à sa hauteur naturelle ; ouvrir la chute ou un accordéon n'étire jamais les voisines. Tout étirement recrée le vide (B1, M4, B14). Écart de bas de cartes assumé et hors des cartes : Vanne repliée ≈ 380 px, Conseil et Vidéo ≈ 470 px à 1440 px.

## 3. Ce qui ne change pas
- Tous les textes (libellés, titres, messages vides, « Révéler la chute », « Pourquoi ça marche », « À toi de jouer », phrase du lien), les données `/api/daily`, `contenuAffiche`, `frTypo`, `fixInvertedCase`, `splitLearning`, `slice(0, 2)` des apprentissages, l'ordre Vanne, Conseil, Vidéo, le H2 et `py-12 md:py-16`.
- Fonctions : réactions (serveur Premium, sinon localStorage), partage, favoris (`contentType`, id, `apercu`), lecteur YouTube lite, lien `/anatomie-vanne`, `details` natifs, états de chargement et de vide. Aucune fonctionnalité retirée ni ajoutée.
- Tracking : aucun appel dans `daily-content.tsx` (vérifié sur les 372 lignes) ; `Badge`, `Button`, `ReactionButtons`, `ShareButton`, `FavoriteButton`, `YouTubePlayer` ne sont pas modifiés. Emojis d'en-tête et barres dégradées conservés (identité commune avec FeatureCards).
- Pour @fullstack : chercher dans les tests (Playwright, Jest) `contenu-du-jour-titre`, le rôle `region` et « Révéler la chute » (le bouton garde ce nom accessible) ; régénérer les captures de référence ; consigner dans `REPLIT_ACTIONS.md`.

## 4. Critères de relecture à l'aveugle
Captures : PC 1440, 1280, 1024 ; tablette 768 ; mobile 375, 320. Pour chacune : repliée ; chute révélée + « Pourquoi ça marche » ouvert ; Conseil et Vidéo avec accordéons ouverts. Plus un focus clavier sur « Révéler la chute ». Header hors champ.
1. En 3 secondes : 3 contenus distincts, type de chacun identifiable, mêmes en-têtes (emoji, libellé, pastilles neutres) alignés.
2. Vanne repliée : l'emplacement pointillé est à 12 px de l'énoncé ; on comprend que la chute viendra là. Aucun vide intérieur supérieur à 24 px dans aucune carte.
3. Chute révélée : elle apparaît à la place du bouton, en blanc, de taille égale ou supérieure à l'énoncé ; aucun encadré imbriqué ; au plus 2 niveaux de fonds.
4. Bords hauts des cartes alignés à 1024 px et plus ; aucune carte étirée ; Conseil et Vidéo identiques avant et après clic.
5. Pieds : même hauteur, même filet, partage et favori alignés à droite sur les 3, réactions à gauche sur la Vanne seulement.
6. Mobile 375 et 320 : pile verticale, aucun défilement horizontal, aucun texte rogné, 16 px entre cartes ; le pied tient sur une ligne à 320 px.
7. Tablette 768 : une colonne de 576 px centrée, aucun texte coupé (plus de `line-clamp`).
8. Typo : aucun texte sous 14 px hors pastilles (12 px) ; aucun libellé en majuscules ; titres Conseil et Vidéo à 18 px ; titre vidéo pleine largeur de colonne.
9. Accordéons : un seul style, chevron visible, zone cliquable de 44 px, pas de violet de fond.
10. Marges internes identiques sur les 3 cartes (`MARGE_ENCADRE`), bords de texte alignés ; aucun tiret cadratin dans le texte visible.
11. Accessibilité : anneau de focus visible sur tous les contrôles, contrastes AA, `prefers-reduced-motion` sans animation, focus déplacé sur la chute après clic.
12. Les 10 critères visuels de Thomas (pro, beau, marque, identité, propre, aligné, aéré, conversion, hiérarchie, accessible) à 10/10 sur le rendu réel.
