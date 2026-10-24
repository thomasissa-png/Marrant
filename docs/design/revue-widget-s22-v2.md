# Revue visuelle s22, tour 2 : widget « La vanne du jour » et page du programme

Revue @design sur 24 captures `v2-*.png` lues une à une (hôte clair et sombre, iframe et script, avant et après révélation, 1280 / 768 / 375 / 320, vanne longue et courte, focus clavier clair et sombre, coin à 400 %, repli, zoom 200 %, page du programme et ses deux aperçus) et sur la relecture de `embed-html.ts`, `widget.js`, `widget-vanne-du-jour.ts` et `page.tsx`. Périmètre : widget et page `/integrer-la-vanne-du-jour`.

## Verdict : NO-GO, 8,4 / 10 (barre : 9)

Gros progrès : tous les défauts de structure du tour 1 sont réglés (coins, thème, pied ancré, cibles 44 px, échelle 4 px, aperçus doubles). Trois défauts visibles empêchent le 9 : le vide de la carte avec la hauteur fixe de 504 px (majeur), l'anneau de focus rogné sur les côtés (majeur), le haut de la vanne coupé à 320 px en iframe seule (majeur). Les trois ont une correction de quelques lignes ; après elles, 9 à 9,3 attendu.

## Défauts du tour 1 : état

| Réf. | État | Preuve visuelle |
|---|---|---|
| B1 coins blancs sur hôte sombre | Corrigé | `v2-coin-hote-sombre-theme-clair-os-sombre-zoom400` : arrondi net à 12 px, aucun angle carré, y compris dans le cas le plus défavorable (hôte sombre, thème clair forcé, système sombre). Hôte sombre en `auto` : carte #1F1F1F sans dalle. |
| B2 hauteur fixe qui coupe | Partiellement corrigé | À 1280, 768 et 375 plus aucune coupure. À 320 (iframe réelle de 288 px) avec la vanne la plus longue, la zone défile et le haut est rogné, voir N2. Le format script s'agrandit correctement (carte de 548 px, pas de défilement). Le saut au chargement a disparu (hauteur de départ identique à la réserve). |
| M1 thème introuvable | Corrigé | Section « Thème » de la page, `data-theme` lu par `widget.js`, deux blocs de code ; capture script `theme-sombre` fidèle. |
| M2 vide et pied non ancré | Corrigé techniquement, effet secondaire visible | Pied épinglé avec filet, comme la carte du site. Mais avec 504 px le vide passe entre bouton et pied : voir N1. |
| M3 cibles tactiles | Corrigé | Pied de 44 px (liens `min-height:44px`), marque 14 px / 700. |
| M4 aperçu dalle blanche | Corrigé, un défaut de cadrage | Deux aperçus étiquetés, cadre crème et cadre #1A1A1A, plus de dalle ni d'angles carrés à 375. Reste N5 (carte collée à gauche à 1280). |
| m1 bande en croissant | Corrigé | Bande dégradée de 4 px rognée par l'arrondi, nette au zoom 400 %. |
| m2 échelles hors système | Corrigé | 12/16, 14/20, 16/24, 18/28, paddings 16/24, marges 8/16. Chute d'une ligne = 44 px = hauteur du bouton : aucun saut à la révélation (courte, 1280 : 310 à 354 avant et après). |
| m3 anneau de focus sur la chute | Corrigé | Pas d'anneau au clic ; anneau au clavier seulement (mais rogné, voir N3). |
| m4 attribution discrète | Corrigé | « Deviens Marrant » en gras, couleur du texte, souligné, lisible dans les deux thèmes. |
| m5 état actif du bouton | Corrigé | `#b:active{background:#5B21B6}` présent. |
| m6 repli | Corrigé en code, insuffisant au rendu | Centré, mais carte vide de 504 px : voir N6. |
| m7 `break-all` des blocs de code | Corrigé | Les lignes coupent aux espaces (« Deviens Marrant » entier, programme 1280 et 375). |
| m8 bouton « Copier » | Corrigé | Lisible comme un bouton (bordure et fond violet léger). |
| m9 code en ligne coupé au tiret | Non vérifiable | Le plein écran 375 de la page est réduit à 136 px de large à la lecture ; la ligne CSP reste lisible, aucune coupure nette repérée. À confirmer par une capture recadrée (voir captures à refaire). |

## Décision prioritaire : 504 px de hauteur fixe, acceptable chez un hôte ?

Non. Mesure sur capture (`v2-hote-clair-iframe-courte-avant-1280`) : 313 px de blanc entre le bouton et le filet du pied (354 à 667), soit 62 % de la carte, et 270 px environ à 375. Une carte de 504 px dont la moitié est vide se lit comme un bloc cassé ou une pub qui n'a pas chargé, pas comme une carte aérée. Critères AÉRÉ et PRO en échec, et l'hôte perd un demi-écran. La vanne la plus longue à 640 px n'utilise que 319 px (réserve de 504 px calibrée sur l'iframe de 288 px de large, cas le plus rare).

**Les deux pistes proposées ne marchent pas telles quelles :**
- Deux hauteurs selon la longueur de la vanne du jour : le code collé par l'hôte est statique (attribut `height` écrit une fois), la vanne change chaque jour. Le serveur ne peut agir que sur l'intérieur de l'iframe, jamais sur sa hauteur côté hôte. Inapplicable à l'option 1, et à l'option 2 sans décalage.
- Agrandir par message au chargement (format script) : c'est le saut de 40 à 90 px du tour 1. Réduire par message est pire : la réserve de l'hôte (`min-height`) ne se libère pas sans décalage.

**Solution retenue : la hauteur dépend de la largeur, pas de la vanne.** Le besoin réel est une fonction de la largeur (340 px suffisent à 640 px, 430 px à 343 px, 550 px à 288 px), alors que la longueur de la vanne ne joue que de 112 px à 640 px. Une expression CSS dans l'attribut `style` suit cette courbe sans JavaScript, avant tout chargement, donc sans aucun décalage :

`height:clamp(340px,calc(340px + (672px - 100vw) * .6),560px)`

Valeurs : 340 px dès 672 px de fenêtre et plus (ordinateur), 518 px à 375, 551 px à 320. Une source unique (`WIDGET_IFRAME_HEIGHT_CSS` dans `widget-vanne-du-jour.ts`) pour : style de l'iframe, `min-height` du conteneur script, `f.style.cssText` de `widget.js`, aperçus de `page.tsx`. Garder `height="420"` en attribut de repli (hôtes qui suppriment `style`). Le script continue de n'agrandir qu'après le clic (garde-fou colonne étroite).

Effet attendu à 1280 : vanne courte, vide de 313 à environ 150 px (bouton, filet et pied sur 340 px) ; vanne la plus longue : 20 px de marge. C'est le motif de la carte du site (pied ancré, espace entre contenu et pied), acceptable. Sur téléphone le vide d'une vanne courte reste d'environ 280 px : coût inévitable d'une iframe sans JavaScript, à dire dans la page (« sur petit écran la carte est plus haute »).

Conditions pour que la courbe tienne (tests de @fullstack et @qa) :
1. Pied sur une seule ligne à 288 px (aujourd'hui sur deux lignes : 88 px au lieu de 44, voir `v2-hote-clair-iframe-longue-apres-320`) : `@media (max-width:359px){main{padding-left:12px;padding-right:12px}.pied{gap:0 12px}.pied a:not(.marque){font-size:14px}}`. Gain 44 px, courbe validée à 320.
2. Mesurer les 93 vannes (liste blanche) à 288, 343, 448 et 640 px de large et vérifier `hauteur utilisée + 8 px <= hauteur de la courbe` ; si une poignée de vannes dépasse, les sortir de la liste plutôt que de relever la courbe. La limite éditoriale du tour 1 (amorce 120 caractères, chute 90) n'est pas appliquée : la vanne « longue » des captures fait environ 195 caractères d'amorce. À poser ou à mesurer avant de figer 340.
3. Colonne étroite sur ordinateur (barre latérale de 300 px) : la courbe se base sur la fenêtre, pas sur la colonne. Le dégradé est sûr (zone qui défile, pied visible) mais à signaler sur la page : pour une colonne étroite, préférer l'option 2.
4. Mettre à jour le texte de la page : « Sa hauteur est fixe (504 px), prévue pour la vanne la plus longue » devient « Sa hauteur s'adapte à la largeur de l'écran » (brouillon, @copywriter) et les trois blocs de code (`min-height:504px` du script).

## Nouveaux défauts

### Majeurs

**N1. Hauteur fixe 504 px : vide de 313 px sur vanne courte.** Voir la section ci-dessus. Correction : courbe CSS et pied sur une ligne à 288 px.

**N2. 320 px, iframe seule, vanne la plus longue : haut de la vanne rogné après révélation** (`v2-hote-clair-iframe-longue-apres-320` : étiquette absente, première ligne coupée à mi-hauteur). La chute reçoit le focus, la zone défile pour la montrer, et 551 px sont nécessaires pour 504 px réservés. Corrections : (a) la courbe de N1 supprime le défilement à 320 ; (b) dans le script embarqué (`embed-script.data.cjs`), `c.focus({preventScroll:true})` puis, seulement si `k.scrollHeight > k.clientHeight`, `c.scrollIntoView({block:"nearest"})` ; (c) recompter l'empreinte CSP (le fichier change). Le zoom 200 % à 375 (`v2-zoom200-script-longue-apres-375`, fenêtre de 188 px) montre le même rognage : acceptable sous 320 px, la zone reste défilable.

**N3. Anneau de focus rogné à gauche et à droite** (`v2-focus-clair-1-bouton-1280`, `v2-focus-clair-2-chute-1280`) : seules les lignes du haut et du bas sont visibles, les côtés sont coupés par `.k{overflow-y:auto}` (le bouton et la chute occupent toute la largeur, l'anneau de 2 px + 2 px de décalage sort de la zone). Indicateur de focus partiellement masqué (WCAG 2.4.7, critère ACCESSIBLE). Correction, `embed-html.ts` l.53 : `.k{margin:0 -4px;padding:4px;...}` (4 px = anneau 2 + décalage 2). Aucun changement de mise en page (la marge négative compense le padding). Même cause pour l'anneau du bas : ajouter `margin-bottom:-4px;padding-bottom:4px` si l'anneau du bouton est coupé en bas. Vérifier en clair et en sombre, capture à refaire.

### Mineurs

**N4. Page du programme : aperçu « Sur fond sombre » vide en capture pleine page** (`v2-programme-1280`, `v2-programme-375` : rectangle gris sans carte), alors que `v2-programme-apercu-sombre-*` montre la carte. Probablement l'iframe `loading="lazy"` non déclenchée par la capture ; aucune correction de code attendue. Refaire la capture pleine page en défilant jusqu'à l'aperçu. Si le défaut se reproduit chez un visiteur, passer `loading="eager"` sur le second aperçu.

**N5. Aperçus de la page : carte collée à gauche** (`v2-programme-apercu-clair-1280` : 640 px de carte dans un cadre de 768 px, bande crème de 64 px à droite ; idem en sombre). Correction `page.tsx` : cadre `mx-auto max-w-[calc(640px+2rem)]` (ou `flex justify-center`) ; garder le style de l'iframe identique au code des hôtes. Avec N1, les deux aperçus passent de 536 à 372 px de haut : la page gagne environ 330 px avant « Le code à copier ».

**N6. Repli : carte vide de 504 px** (`v2-repli-clair-375` : deux petites lignes au milieu d'un grand blanc). Correction, `embed-html.ts` l.65 : `main.repli{height:auto;align-self:flex-start;padding:16px}` ; le reste de l'iframe reste transparent. Texte du repli inchangé (aucune phrase non validée).

**N7. Pied qui s'enroule à 288 px** (`v2-hote-clair-iframe-longue-apres-320`) : « Pourquoi ça marche ? » à gauche et marque seule à droite sur deux lignes. Réglé par la condition 1 de la section hauteur ; à défaut, aligner la marque à gauche quand elle passe seule.

## Contrastes (inchangés, vérifiés sur les captures)

Texte, secondaire, lien et label, bouton, chute teintée : mêmes valeurs que le tour 1, AA dans les deux thèmes. Anneau de focus #6D28D9 sur blanc 7,1:1, #A78BFA sur #1F1F1F 6:1 (visible sur `v2-focus-sombre-3-pourquoi-1280`). Mouvement : animation de la chute sous `prefers-reduced-motion:no-preference`.

## 10 critères Thomas (rendu réel, hôte clair et sombre, 1280 / 375 / 320)

1. PRO : oui, sauf la carte à moitié vide (N1). 2. BEAU : oui. 3. BRAND-ALIGNED : oui. 4. MÊME IDENTITÉ : oui (bande, bouton, marque en gras). 5. PROPRE : oui, coins nets. 6. ALIGNÉ : oui, sauf aperçu collé à gauche (N5). 7. AÉRÉ : non tant que 313 px de vide (N1). 8. CONVERSION : oui, bouton violet dominant. 9. HIÉRARCHIE : oui (étiquette, amorce, bouton). 10. ACCESSIBLE : partiel (anneau rogné, N3).

## Note : 8,4 / 10. NO-GO (barre 9)

Pour passer à 9 : N1, N2, N3 (trois correctifs CSS et une ligne de script). Pour 9,3 : N4 à N6.

## Captures à refaire après correctifs (contre-revue tour 3)

1. Courte et longue à 1280, 768, 375, 320, avant et après, iframe et script, clair et sombre : vide visible sur la courte, aucune coupure sur la longue (iframe de 288 px de large incluse).
2. Focus clavier 1280 (bouton, chute, pourquoi, marque) clair et sombre, anneau complet sur les 4 côtés.
3. Mesures des 93 vannes aux 4 largeurs (tableau fourni par @fullstack ou @qa).
4. Page du programme à 1280 et 375, plein écran avec les deux aperçus chargés, plus un recadrage de la ligne CSP à 375.
5. Repli clair et sombre à 375.

## Handoff @fullstack
Fichiers : `apps/web/src/lib/widget/embed-html.ts` (N3, N6, N7), `apps/web/src/lib/widget/embed-script.data.cjs` (N2, empreinte CSP à recalculer), `apps/web/public/widget.js`, `apps/web/src/config/widget-vanne-du-jour.ts` (constante CSS de hauteur, trois gabarits), `apps/web/src/app/(dashboard)/integrer-la-vanne-du-jour/page.tsx` (N1, N5, texte de la hauteur). Aucun nouveau token. Documenter dans `REPLIT_ACTIONS.md`. Textes de la page en brouillon pour @copywriter.
