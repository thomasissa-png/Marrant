# Cartes du jour (accueil) : diagnostic et spec cible

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
