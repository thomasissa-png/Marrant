# Revue visuelle s22 : widget « La vanne du jour » V1 (iframe) et page du programme

Revue @design, sur 6 captures (hôte clair avant/après révélation à 1280 et 375, page du programme à 1280 et 375) et lecture du code. Périmètre : widget et page `/integrer-la-vanne-du-jour`. Aucune refonte du site.

## Verdict : NO-GO, 7,5 / 10 (barre : 9)

Le socle est bon : carte propre, bande violette reconnaissable, bouton 44 px, contrastes AA calculés dans les deux thèmes, tokens identiques à ceux du site (violet #8B5CF6 / #6D28D9, rayon 12 px, cartes à bande), isolation totale de la police et des couleurs de l'hôte. Trois défauts empêchent le 9 : le fond opaque en coins carrés sur hôte sombre, la hauteur fixe de 240 px qui coupe le contenu en mode iframe seule (surtout à 375 et 320), et l'absence de chemin documenté pour les hôtes sombres. Après correction des bloquants et majeurs, 9 à 9,5 attendu, sous réserve des captures demandées en fin de document.

Les 10 critères sur le rendu réel (hôte clair) : PRO oui, BEAU oui, BRAND-ALIGNED oui (bande, bouton, label violet), MÊME IDENTITÉ oui mais attribution faible, PROPRE oui, ALIGNÉ oui, AÉRÉ non (62 px de vide sous « Deviens Marrant » avant révélation contre 16 px en haut), CONVERSION oui (le bouton est dominant), HIÉRARCHIE oui (label, amorce, bouton lisibles en plissant les yeux), ACCESSIBLE partiel (cibles des liens trop petites, thème sombre non atteignable).

## Bloquants

### B1. Coins blancs opaques sur hôte sombre (déjà signalé par @fullstack)
Constat : capture programme 1280, l'aperçu est une dalle blanche à angles carrés autour de la carte arrondie sur le fond #0D0D0D de la page. Cause : le document de l'iframe ne déclare aucun `color-scheme` (valeur `normal`, donc clair) alors que l'hôte est sombre. Le navigateur impose alors un fond opaque à l'iframe, et `background:transparent` ne sert à rien. Le thème par défaut `:root` étant sombre, un visiteur au système sombre sur un hôte clair a l'inverse.
Correction en 3 couches (aucune ne suffit seule, car le schéma de l'hôte est inconnu depuis une iframe tierce) :
1. `embed-html.ts`, fonction `page()` (l.59) : ajouter dans `<head>` `<meta name="color-scheme" content="light dark">`. Dans `CSS` (l.35) ajouter `html{color-scheme:light dark}html.t-clair{color-scheme:light}html.t-sombre{color-scheme:dark}`.
2. Gabarits de code : ajouter `border-radius:12px;color-scheme:light dark` au `style` de l'iframe. `widget-vanne-du-jour.ts` l.76 devient `style="border:0;border-radius:12px;color-scheme:light dark;max-width:640px"`. `public/widget.js` l.13 : `border:0;border-radius:12px;color-scheme:light dark;display:block;width:100%;max-width:640px;height:...`. Le rayon de l'élément iframe rogne le fond opaque éventuel au même arrondi (12 px) que `main`, donc même dans le cas résiduel (thème forcé différent du système) aucun coin carré ne dépasse. Quand les deux `color-scheme` coïncident, le fond est transparent.
3. `page.tsx` l.96 : même `style` (`borderRadius: 12`, `colorScheme: "light dark"`).
Vérification attendue : capture 1 ci-dessous, zoom 400 % sur un angle.

### B2. Hauteur fixe 240 px : contenu coupé ou défilant dans l'iframe (option 1)
Constat : à 1280, 2 lignes d'amorce + 1 ligne de chute remplissent déjà 240 px à 8 px près (carte pleine après révélation). À 375 (capture), la carte mesure 238 px avant révélation et 283 px après : l'option 1 (iframe seule, aucun JS, `widget-vanne-du-jour.ts` l.52 et l.76) n'a aucun redimensionnement, donc 43 px de contenu défilent dans l'iframe, et la chute est à moitié masquée. À 320 px, avec 4 lignes d'amorce et 3 de chute : environ 330 px nécessaires. Le script (option 2) ne fait que grandir (`widget.js` l.19) : au chargement, l'hôte voit sa mise en page sauter de 40 à 90 px sans action de l'utilisateur.
Correction :
1. Hauteur réservée de l'option 1 : 280 px (`WIDGET_IFRAME_HEIGHT`, l.52), valeur à confirmer en mesurant la plus longue amorce et la plus longue chute de la liste blanche des 90 vannes à 320 px de large (marge de 8 px minimum). Poser une limite éditoriale vérifiable : amorce ≤ 120 caractères, chute ≤ 90 caractères, sinon la vanne n'entre pas dans la liste.
2. `widget.js` : après `insertBefore` (l.14), fixer la hauteur initiale selon la largeur réelle : `f.style.height = (f.offsetWidth < 480 ? 300 : 240) + "px"` pour supprimer le saut au chargement.
3. Page programme, texte de l'option 1 : écrire que la hauteur est fixe et que l'option 2 s'adapte seule (à valider par @copywriter, brouillon).
4. Voir M2 : le pied épinglé en bas rend les 40 px de marge invisibles sur desktop.

## Majeurs

### M1. Thème sombre introuvable pour l'hôte
Constat : `parseWidgetTheme` accepte `?theme=clair|sombre|auto` mais ni la page du programme ni les gabarits ne le mentionnent, et `widget.js` ne le transmet pas. Un blog sombre ou un hôte clair visité par un système sombre n'ont aucun levier. Le thème `auto` suit le système du visiteur, pas l'hôte : sur un blog parental clair, un visiteur au mode sombre reçoit une carte #1F1F1F ; lisible et reconnaissable, mais à documenter.
Correction :
1. `widget.js` : lire `data-theme` sur la balise script (valeurs `clair`, `sombre`, `auto` seulement) et construire `src = origin + "/embed/vanne-du-jour" + (theme ? "?theme=" + theme : "")`.
2. `page.tsx` après le bloc 2, ajouter un H2 « Thème » : une phrase, et deux lignes de code (`?theme=clair` pour iframe, `data-theme="sombre"` pour script). Ajouter `<h3>` « Sur fond clair » / « Sur fond sombre » si la page montre les deux aperçus (voir M4).
3. Ne pas changer le défaut `auto` ; il est cohérent avec les pratiques courantes.

### M2. Vide en bas de carte avant révélation, pied non ancré (AÉRÉ, ALIGNÉ)
Constat : capture 1280 avant révélation, 62 px de blanc sous le lien de marque contre 16 px de padding en haut. La carte du site, elle, ancre son pied (`mt-auto border-t border-border pt-4`).
Correction, `embed-html.ts` CSS l.39 et l.46-47 :
- `main{display:flex;flex-direction:column;min-height:100vh}`
- nouveau pied : un conteneur `.pied{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;margin-top:auto;border-top:1px solid var(--bd);padding-top:8px}` contenant « Pourquoi ça marche ? » à gauche (masqué avant révélation, `margin-right:auto` ne s'applique pas, la marque garde `margin-left:auto`) et « Deviens Marrant » à droite. Un seul pied de 44 px remplace les deux paragraphes actuels (22 + 8 + 20 px), donc plus court, plus propre, et le vide se place entre le bouton et le pied comme sur une carte du site.
- `renderEmbedVanne` l.75 et `page()` l.62 : déplacer les deux liens dans `<footer class="pied">`.

### M3. Cibles tactiles et taille des liens (WCAG 2.5.8, règle 44 px du système)
Constat : « Pourquoi ça marche ? » (15 px, interligne 22,5 px) et « Deviens Marrant » (13 px, 19,5 px) sont des liens isolés de moins de 24 px de haut, sous le seuil AA et loin des 44 px du système.
Correction : `.pied a{display:inline-flex;align-items:center;min-height:44px}` ; marque 14 px / 700. Avec M2, la hauteur totale baisse.

### M4. Aperçu de la page du programme : dalle blanche sur site sombre
Constat : captures programme 1280 et 375, la carte claire est un bloc blanc sans cadre sur le fond sombre ; à 375 elle déborde en pleine largeur avec des angles carrés. Elle donne l'impression d'un défaut du site et ne montre qu'un seul thème, alors que le widget en a deux.
Correction, `page.tsx` l.88-100 : deux aperçus étiquetés (H3 « Sur fond clair » avec `?theme=clair`, H3 « Sur fond sombre » avec `?theme=sombre`), chacun dans un cadre `rounded-xl p-4` qui simule l'hôte : clair `bg-[#FAF7F2]` (même crème que l'hôte de test), sombre `bg-background-light` (#1A1A1A). Iframe avec le `style` de B1 et `min-height` 280. Les angles carrés disparaissent, l'utilisateur voit les deux rendus, M1 est illustré.
Rappel : le texte « Amorce factice » visible dans les captures est un jeu d'essai ; en production la liste blanche vide donne le repli. Vérifier qu'aucune amorce factice n'est servie hors tests.

## Mineurs

1. **Bande violette en croissant** (l.39 : `border-top:4px` avec un rayon de 12 px s'effile aux coins, visible sur les 4 captures). Remplacer par `main{position:relative;overflow:hidden;border:1px solid var(--bd);padding-top:20px}` et `main::before{content:"";position:absolute;inset:0 0 auto 0;height:4px;background:linear-gradient(90deg,#8B5CF6,#6D28D9)}`, identique à la bande dégradée `h-1 from-accent-primary to-accent-secondary` de la vanne du jour de l'accueil.
2. **Échelles hors système** (l.37-47). Padding 16/18/12, marges 12, tailles 12/13/15/16/17/18. Ramener à l'échelle 4 px et à 4 tailles : label 12/16, marque 14/20, corps et lien 16/24, amorce et chute 18/28. Padding `16px 16px 4px`, puis `@media (min-width:480px){main{padding:24px 24px 8px}}` ; marges verticales 8 (label) et 16 (amorce, bouton, chute). Chute : `padding:8px 12px` et `margin:0 0 16px`, ce qui donne 44 px, la même hauteur que le bouton qu'elle remplace : plus aucun saut de hauteur à la révélation pour une chute d'une ligne. Budget à 640 px : 238 px avant et après, dans 240.
3. **Anneau de focus sur la chute** (l.42, l.44). Sur la capture après révélation, un cadre violet de 2 px entoure la chute comme un champ de saisie, alors que l'élément n'est pas interactif. Le focus programmatique sert aux lecteurs d'écran. Garder `outline` en `:focus-visible` uniquement (clavier), contraste 7,1:1 en clair et 6:1 en sombre : correct. Si la capture au clic souris (demandée plus bas) montre l'anneau, passer à `.chute:focus:not(:focus-visible){outline:none}`.
4. **Attribution discrète** (`.marque a`, 13 px gris #4A4A4A). Légalement visible mais peu mémorisable. Mettre `color:var(--tx);font-weight:700;text-underline-offset:3px` (contraste 17:1 en clair, 16:1 en sombre). Pas de logo ajouté.
5. **États du bouton** (l.43-44) : ajouter `#b:active{background:#5B21B6}` (blanc dessus : environ 10:1). Hover #7C3AED vérifié à 5,7:1.
6. **Repli sans vanne** (`renderEmbedRepli`, l.83-90) : sur 240 px la carte est presque vide. Avec M2, ajouter `justify-content:center` quand le corps est le repli (classe `.repli` sur `main`). Texte du repli en brouillon, à valider par @copywriter.
7. **Blocs de code de la page** (`bloc-code.tsx` l.42) : `break-all` coupe au milieu des mots même quand il y a de la place (« D / eviens Marrant » sur la capture 1280). Remplacer par `[overflow-wrap:anywhere]`.
8. **Bouton « Copier »** (`bloc-code.tsx` l.33) : c'est l'action primaire de la page, et c'est un lien-texte violet de 14 px. Ajouter `border border-accent-primary/40 bg-accent-primary/10` pour qu'il se lise comme un bouton ; hauteur 44 px déjà bonne.
9. **Code en ligne coupé au tiret** (`page.tsx` l.129 à 375 : `deviens-` / `marrant.fr`). Ajouter `break-all` sur `CODE` uniquement dans cette ligne, ou `whitespace-nowrap` avec défilement du paragraphe.

## Contrastes calculés (AA)

| Paire | Clair | Sombre |
|---|---|---|
| Texte / fond | #0D0D0D sur #FFFFFF, 19:1 | #FFFFFF sur #1F1F1F, 16:1 |
| Secondaire | #4A4A4A sur blanc, 8,9:1 | #B3B3B3 sur #1F1F1F, 7,9:1 |
| Lien et label | #6D28D9 sur blanc, 7,1:1 | #A78BFA sur #1F1F1F, 6,0:1 |
| Texte sur chute teintée | #0D0D0D sur #F3EEFC, environ 17:1 | #FFFFFF sur #2E2840, environ 13:1 |
| Bouton | blanc sur #6D28D9, 7,1:1 (hover 5,7:1) | identique |
| Anneau de focus | #6D28D9 sur blanc, 7,1:1 | #A78BFA sur #1F1F1F, 6,0:1 |

Mouvement : l'animation de la chute est bien sous `prefers-reduced-motion:no-preference`. Sans JavaScript, tout est visible : correct.

## Captures à produire (la session les fait faire)

1. **Hôte sombre** (fond #121212, texte #E6E6E6) : iframe `?theme=auto`, `?theme=clair`, `?theme=sombre`, chacune avec émulation système clair puis sombre (6 captures) à 1280 et 375, avant révélation, plus un zoom 400 % sur le coin supérieur gauche de l'iframe. Sert à valider B1.
2. **Largeur 320 px** (hôte à 320, iframe 100 %) avec la vanne la plus longue de la liste blanche (amorce et chute maximales), option 1 puis option 2, avant et après révélation. Sert à valider B2 et la hauteur de 280/300.
3. **Focus clavier** à 1280, clair puis sombre : Tab sur le bouton, Entrée (focus sur la chute), Tab sur « Pourquoi ça marche ? », Tab sur « Deviens Marrant ». Plus la même séquence avec un clic souris sur le bouton, pour trancher le mineur 3.
4. **Zoom texte 200 %** (ou `font-size` du navigateur à 32 px) à 375 : pas de coupure ni de défilement horizontal (WCAG 1.4.4 et 1.4.10).
5. **Repli** (liste vide) en clair et en sombre à 375.
6. Après correctifs : mêmes 6 captures de la série initiale, plus l'aperçu double de la page du programme à 1280 et 375, pour la contre-revue.

## Handoff @fullstack
Fichiers à toucher : `apps/web/src/lib/widget/embed-html.ts`, `apps/web/public/widget.js`, `apps/web/src/config/widget-vanne-du-jour.ts`, `apps/web/src/app/(dashboard)/integrer-la-vanne-du-jour/page.tsx`, `apps/web/src/components/widget/bloc-code.tsx`. Modifier `embed-script.data.cjs` change l'empreinte CSP automatiquement ; le CSS et le HTML ne la changent pas. Tokens inchangés (aucun nouveau token). Documenter la modification dans `REPLIT_ACTIONS.md`. Les textes de la page restent en brouillon pour @copywriter. Contre-revue @design après la série 6 ; objectif 9 / 10 minimum.
