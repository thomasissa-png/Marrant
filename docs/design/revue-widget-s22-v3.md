# Revue visuelle s22, tour 3 : widget « La vanne du jour » et page du programme

Revue @design, commit `b5e6e52c`. Captures `v3-*.png` lues : courte (`cs19jkboulot5`) et longue (`cs18jkstory5v4`) en iframe, clair, avant et après, à 375 et 320 ; 1280 clair et sombre, iframe et script ; 768 clair ; sombre à 375 et 320 ; focus clair (bouton, chute) et sombre (chute, marque) ; repli clair et sombre ; page du programme 1280 et 375, aperçus clair et sombre à 1280 et 375, ligne CSP. Non lues une à une : les autres combinaisons de la matrice (81 fichiers), jugées par échantillon. Relecture de `embed-html.ts`. Mesures de hauteur (93 vannes) reprises de @fullstack, non refaites ; recoupées sur capture.

## Verdict : NO-GO, 8,8 / 10 (barre : 9)

Tous les défauts majeurs du tour 2 sont corrigés (aucune vanne rognée, focus complet, pied sur une ligne à 320). Reste un seul point qui retient sous 9 : sur téléphone, une vanne courte laisse un grand vide au milieu de la carte (251 px médiane à 375). Il se règle par une ligne de CSS (section suivante). Avec elle : 9,2 attendu, sous réserve d'une capture de contrôle.

## Décision prioritaire : vide de 251 px (médiane) à 375 px

Mesure sur capture, 375, vanne courte (`v3-hote-clair-iframe-courte-avant-375`) : bouton fini à 409, filet du pied à 744, soit 335 px de blanc (le maximum annoncé) dans une carte de 518 px (65 %). Vanne longue : 84 px de marge (660 à 744), aucun rognage, donc la courbe est juste et ne doit pas descendre. À 320 : courte 340 px de vide (437 à 777), longue 87 px.

**Ordinateur (médiane 121, max 149) : acceptable.** À 1280, carte de 340 px, vide de 149 px sous le bouton avec pied ancré : c'est le motif de la carte du site, la composition tient (`v3-hote-clair-iframe-courte-avant-1280`).

**Téléphone (médiane 251 et 284) : non acceptable pour un 9.** En tour 2 je l'avais classé « coût inévitable » parce qu'aucune correction sans JavaScript n'était identifiée. Il en existe une : la carte a une hauteur imposée par la largeur, mais la place du contenu dans cette hauteur est libre. Le rendu actuel est un bloc plein en haut et un trou de la taille d'un écran de lecture, qui se lit comme un chargement inachevé, pas comme de l'air. Critères AÉRÉ et PRO en demi-échec sur 40 % environ des vannes à 375.

### Correction recommandée : contenu centré verticalement entre la bande et le pied

Une seule modification, `embed-html.ts` l.55 (CSS, aucun HTML, aucun JavaScript) :

```
.k{flex:1 1 auto;min-height:0;overflow-y:auto;display:flex;flex-direction:column;margin:-4px -4px 0;padding:4px 4px 0}
.k::before{content:"";flex:2 1 0}.k::after{content:"";flex:3 1 0}
```

Pourquoi cette forme et pas `justify-content:center` : si la vanne dépasse (texte agrandi, 200 %), `justify-content:center` rend le haut inaccessible au défilement. Deux entretoises flexibles (basis 0) tombent à zéro dès qu'il n'y a plus de place : la zone défile depuis le haut comme aujourd'hui. Le ratio 2:3 place le bloc légèrement au-dessus du centre (le pied attire l'œil vers le bas), ce qui est le centrage optique standard.

Chiffrage du vide, réparti au-dessus et en dessous du bloc (étiquette, amorce, bouton) :

| Largeur | Vide actuel (médiane / max) | Au-dessus | En dessous |
|---|---|---|---|
| 1280 | 121 / 149 | 48 / 60 | 73 / 89 |
| 375 | 251 / 335 | 100 / 134 | 151 / 201 |
| 320 | 284 / 340 | 114 / 136 | 170 / 204 |

La plus longue vanne n'est pas touchée (marge 84 px à 375, 87 px à 320, 37 px à 1280 : les entretoises valent 0 ou presque). Aucun effet sur la hauteur de l'iframe, donc aucun décalage de la page hôte, et la courbe de hauteur ne change pas. La CSS est dans le document de l'iframe, pas dans le script : pas d'empreinte CSP à recalculer.

**Effet de bord à mesurer** : à la révélation, le bloc grandit (bouton 60 px remplacé par une chute de 60 px à une ligne, 88 à deux lignes, 116 à trois). À une ligne, aucun mouvement (cas des captures courtes). À deux et trois lignes, l'amorce remonte de 11 à 22 px (40 % de la croissance, grâce au ratio 2:3). Demander à @fullstack de compter les vannes dont la chute fait 2 lignes ou plus à 375 avec un vide supérieur à 100 px. S'il y en a plus de 10 %, passer à la variante sans mouvement : le bouton et la chute dans une même cellule de grille (chute en `visibility:hidden` avant clic), ce qui réserve la hauteur finale dès le départ ; c'est un changement de HTML, donc seulement si la mesure l'exige.

**Pistes écartées** : (a) pied qui suit le contenu : le trou passe sous le pied, la carte paraît tronquée et le pied n'est plus ancré (défaut M2 du tour 1 qui revient) ; (b) abaisser la courbe de hauteur : gagner 30 à 35 px (pente .5) réduit la marge de la plus longue de 84 à 50 px, soit moins de deux lignes pour absorber les différences de police entre systèmes (SF, Roboto, Segoe), risque de rognage contre un gain marginal ; (c) bouton ancré au pied : amorce en haut, bouton en bas, trou au milieu, même problème.

## Défauts du tour 2 : état

| Réf. | État | Preuve visuelle |
|---|---|---|
| N1 vide 313 px | Partiellement corrigé | Courbe en place : 1280 passe de 313 à 149 px max. Reste le vide à 375 et 320, voir ci-dessus. |
| N2 haut rogné à 320 | Corrigé | `v3-hote-clair-iframe-longue-apres-320` et version sombre : étiquette visible, première ligne entière, 87 px de marge, plus de défilement. |
| N3 anneau rogné | Corrigé | `v3-focus-clair-1-bouton-1280`, `-2-chute-1280`, `v3-focus-sombre-2-chute-1280` : anneau de 2 px complet sur les quatre côtés, violet #6D28D9 en clair, #A78BFA en sombre, sans changement de mise en page. |
| N4 aperçu sombre vide en pleine page | Partiellement corrigé | 1280 : les deux aperçus sont chargés. 375 pleine page : l'aperçu sombre est toujours un rectangle vide, alors que `v3-programme-apercu-sombre-375` montre la carte. Voir M1. |
| N5 aperçu collé à gauche | Corrigé | `v3-programme-1280` : cartes centrées dans leur cadre (crème et #1A1A1A), marges égales. |
| N6 repli de 504 px | Corrigé | `v3-repli-clair-375` et sombre : petite carte de 77 px, étiquette à gauche, marque à droite, aucune phrase. |
| N7 pied sur deux lignes à 288 px | Corrigé | `v3-hote-clair-iframe-longue-apres-320` : « Pourquoi ça marche ? » et « Deviens Marrant » sur une ligne, filet pleine largeur. |
| m9 code en ligne coupé au tiret | Non corrigé | `v3-programme-ligne-csp-375` : « https://deviens- » puis « marrant.fr » sur la ligne suivante. Voir M2. |

Autres éléments revérifiés : texte de la page « Sa hauteur s'adapte à la largeur de l'écran : sur petit écran, la carte est plus haute » présent, blocs de code avec `height:420px;height:clamp(...)` en repli ; saut de page nul (le paragraphe de l'hôte garde sa position avant et après, 375 et 1280) ; coins nets, bande de 4 px sans croissant ; format script identique à l'iframe à 1280 (carte de 340 px).

## Nouveaux défauts

### Majeur

**V1. Vide central sur vanne courte, téléphone** (375 et 320). Voir la décision ci-dessus. Correction : deux entretoises dans `.k`.

### Mineurs

**M1. Aperçu sombre de la page, pleine page 375 : rectangle vide** (`v3-programme-375`). Le second aperçu est en `loading="lazy"` et la capture pleine page ne le déclenche pas. Même cause qu'en tour 2 ; sur 1280 il se charge. Un visiteur qui défile le verra charger, mais l'iframe vide d'un instant reste visible. Correction, `page.tsx` : `loading="eager"` sur les deux aperçus (la page est une page de documentation, deux iframes légères). À défaut, refaire la capture en défilant.

**M2. Code en ligne coupé au tiret dans « deviens-marrant.fr »** (`v3-programme-ligne-csp-375`). Deux fragments de code (`frame-src https://deviens-marrant.fr` et `script-src https://deviens-marrant.fr`) se coupent à l'intérieur de l'adresse, ce qui gêne la copie. Correction, `page.tsx` : classe `whitespace-nowrap` sur chaque `<code>` de cette phrase (l'adresse ne fait que 26 caractères, elle tient en 343 px) ; le saut de ligne se fait alors avant `frame-src`.

**M3. Anneau de focus de la marque non vérifiable** (`v3-focus-sombre-4-marque-1280`). La capture est recadrée à 380 px de haut : le côté bas de l'anneau est hors cadre ; le haut touche le filet du pied (anneau de 2 px décalé de 2 px sur un lien de 44 px dont le haut est le filet). Pas de défaut avéré, pas de preuve. Refaire la capture avec la carte entière ; si l'anneau est rogné par `main{overflow:hidden}` en bas, passer `padding-bottom` de `main` de 8 à 12 px (hors échelle : prendre 12 = md/16 moins 4, ou 16).

**M4. Repli : trou de 440 px chez l'hôte** (`v3-repli-clair-375`). La carte de repli fait 77 px, mais l'iframe réservée de 518 px laisse un espace transparent sous elle avant le paragraphe suivant. Inévitable avec une hauteur statique (on ne peut pas réduire sans décaler la page). Cas rare (widget non publié ou domaine bloqué). À documenter dans la page du programme, une phrase (brouillon @copywriter : « Si le widget est indisponible, il affiche une petite carte et laisse la place libre »), pas de correction de code.

## Contrastes (inchangés, revérifiés)

Texte, étiquette, lien, bouton, chute teintée : mêmes valeurs qu'aux tours 1 et 2, AA dans les deux thèmes (étiquette #A78BFA sur #1F1F1F 6:1, lien « Pourquoi ça marche ? » lisible en sombre, filet #2A2A2A discret mais purement décoratif). Anneau 7,1:1 en clair, 6:1 en sombre.

## 10 critères Thomas (rendu réel, 1280 / 375 / 320, clair et sombre)

1. PRO : oui, sauf le vide à 375 sur vanne courte (V1). 2. BEAU : oui. 3. BRAND-ALIGNED : oui. 4. MÊME IDENTITÉ : oui. 5. PROPRE : oui, coins nets, pas de coupure. 6. ALIGNÉ : oui, aperçus centrés. 7. AÉRÉ : oui à 1280, partiel à 375 et 320 (V1). 8. CONVERSION : oui, bouton violet dominant à chaque largeur. 9. HIÉRARCHIE : oui (étiquette, amorce, bouton). 10. ACCESSIBLE : oui, anneau complet, cibles 44 px, contrastes AA ; M3 à confirmer.

## Note : 8,8 / 10. NO-GO (barre 9)

Pour 9 : V1 (une ligne de CSS) et capture de contrôle. Pour 9,3 : M1 à M3.

## Captures de contrôle après correction (tour 4, courtes)

1. Courte et longue, iframe clair, avant et après, à 375 et 320, plus la courte à 1280 : bloc centré, 0 défilement sur la longue (`scrollHeight == clientHeight`), aucune différence de position de l'amorce entre avant et après sur la courte.
2. Une vanne à chute de 2 ou 3 lignes et amorce courte à 375, avant et après : mesurer le déplacement de l'amorce (attendu 11 à 22 px) ; compte des vannes concernées parmi les 93.
3. Texte agrandi 200 % à 375 sur la plus longue : le haut reste accessible au défilement (test de l'entretoise).
4. Focus clavier sur la marque, carte entière, clair et sombre.
5. Page du programme 375 pleine page avec aperçu sombre chargé, et recadrage de la ligne CSP.

## Handoff @fullstack
Fichiers : `apps/web/src/lib/widget/embed-html.ts` (V1, l.55 ; M3 éventuel), `apps/web/src/app/(dashboard)/integrer-la-vanne-du-jour/page.tsx` (M1, M2, phrase M4 en brouillon). Courbe de hauteur inchangée. Pas d'empreinte CSP à recalculer (CSS hors script). Documenter dans `REPLIT_ACTIONS.md`. Prévenir @qa : instantanés visuels du widget à rebaser.
