# Relecture design à l'aveugle, v6 tour 1 : « Aujourd'hui » (/mon-espace)

Périmètre : `docs/captures/s25/v6-tour-1/aujourdhui/` (visiteur, gratuit = aperçu ; en-cours, nouvel = rubrique), 375, 768, 1280, 1456, 1920. Lues : visiteur 375/1280, gratuit 768/1280, nouvel 375/768/1280/1920, en-cours 768/1280/1920, étalon accueil 1280. 1456 identique à 1280/1920 (coque `max-w-7xl`). Code : `mon-espace/page.tsx`, `aujourdhui/premier-pas.tsx`, `aujourdhui/contenu-du-jour.tsx`, `apercu/apercu-rubrique.tsx`.

## Notes

| Critère | Note |
|---|---|
| Design 1 Fidélité à l'accueil | 6 |
| Design 2 Hiérarchie, lisibilité | 6 |
| Design 3 Mise en page 5 largeurs | **4** |
| Design 4 Cohérence avec l'espace | 7 |
| Design 5 Finition | 8 |
| UX 1 Compréhension | 9 |
| UX 2 Action principale unique | 7 |
| UX 3 États vides, nouvel abonné | 8 |
| UX 4 Aperçu Premium | 8 |
| UX 5 Accessibilité, cohérence comptes | 9 |

**NOTE GLOBALE (minimum) : 4/10. Barre de 9 non atteinte.**

## Fautes dures

**FD1. Colonne 2 vide : la moitié droite de la page est morte à 768 et plus (Design 3, Design 1).** C'est exactement le « grand vide » reproché en s24, déplacé de dessous à droite.
- `nouvel-aujourdhui-1280.png` : carte « Ton premier pas » 596 px de large sur 1216, 620 px vides à sa droite, de y=233 à 462, puis la rangée « Contenu du jour » en trois colonnes pleine largeur. Idem `nouvel-aujourdhui-1456/1920.png` (à 1920, 620 px vides à droite du titre ET de la carte).
- `en-cours-aujourdhui-1280.png` et `-1920.png` : trois cartes empilées (cartes du jour, mission, « Où veux-tu être plus à l'aise ? ») sur 596 px, de y=261 à 963, 620 px vides à droite sur 700 px de haut.
- `nouvel-aujourdhui-768.png` : carte 346 px sur 720, moitié droite vide.
- Cause : `page.tsx` l.116 `grid md:grid-cols-2`, une seule colonne remplie (l.117-124), commentaire l.99-102 qui le reconnaît.
- Correction codable : supprimer la grille à 2 colonnes vide. Le bloc du jour devient pleine coque.
  - Nouvel (état 1) : `PremierPas` pleine largeur, en bandeau horizontal à md+ : `premier-pas.tsx` l.78 `flex flex-col` devient `md:flex-row md:items-center md:justify-between md:gap-8`, texte à gauche, bouton `sm:w-auto` à droite (l.88 retirer `mt-auto`, `md:pt-0`), titre `lg:text-xl` remplacé par `md:text-2xl`.
  - En cours (états 2 à 4) : `page.tsx` l.116 `md:grid-cols-2` conservé mais rempli : colonne 1 = `CartesDuJour` (+ `EtapeEnCours` au-dessus si présente), colonne 2 = `MissionLien` + `QuestionAise` + `TonMois` ; `data-carte-du-jour` devient un `contents` pour que les enfants se placent directement dans la grille. Colonne 1 plus lourde (`md:grid-cols-[3fr_2fr]`), `items-start` gardé.
- Ce qui ferait 10 : à 1280/1920, aucune zone de plus de 120 px de large vide dans la coque ; à 768, deux colonnes pleines ou une seule colonne pleine largeur, jamais une demi-page vide.

**FD2. Aperçu (visiteur, gratuit) : la carte s'arrête à 768 px, 448 px vides à droite à 1280, 1152 à 1920 (Design 3).**
- `visiteur-aujourdhui-1280.png` et `gratuit-aujourdhui-1280.png` : carte de x=32 à 800, rien à droite de y=262 à 744 ; sous-titre idem. À 1920 la carte occupe 40 % de la coque (même code).
- Cause : `apercu-rubrique.tsx` l.49 `max-w-3xl` sans colonne voisine.
- Correction : à `lg`, passer en deux colonnes `lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6 lg:items-start` : colonne 1 = `<article>` (fiche), colonne 2 = le bloc d'offre existant (`data-apercu-offre`, bouton `BOUTON_PRINCIPAL` + lien Connexion), sorti de l'article, dans une carte `rounded-xl` à filet comme l.51, `lg:sticky lg:top-32` (le bloc collant fait 114 px). Aucun texte nouveau, aucun second bouton. En dessous de `lg`, l'offre reste sous la fiche (comportement actuel, bon à 375 et 768). Le composant étant partagé, la correction vaut pour toutes les rubriques d'aperçu : à relayer au relecteur des autres groupes.
- Ce qui ferait 10 : l'offre toujours visible à côté de la fiche à 1280+, aucune coque à moitié vide.

## Pistes (ne retiennent pas la note seules)

**P1. Fidélité à l'étalon (Design 1, 6/10).** L'accueil : cartes `rounded-xl` à filet dégradé violet en haut. Ici : `premier-pas.tsx` l.78 et `contenu-du-jour.tsx` l.30 (`CARTE`) en `rounded-lg` (12 px) sans filet ; seul l'aperçu (`apercu-rubrique.tsx` l.49-51) a `rounded-xl` + filet. Un abonné voit donc une autre langue que le visiteur sur la même adresse. Correction : `rounded-xl` + filet `absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover` (déjà codé en l.51) sur la carte de l'action du jour (`PremierPas`, `CartesDuJour`) ; les cartes du « Contenu du jour » passent en `rounded-xl` sans filet pour garder une hiérarchie. Titre « Contenu du jour » : l'étalon centre les titres de section ; ici ils sont à gauche (choix d'outil d'espace, cohérent entre rubriques) : non retenu en faute.

**P2. Action du jour dominée (Design 2 / UX 2, 6 et 7).** `nouvel-aujourdhui-1280.png` : carte du premier pas 230 px de haut, texte 20 px ; juste dessous, trois cartes de 280 à 324 px, plus hautes et plus chargées (vidéo avec vignette 190 px et lien violet souligné). À l'œil plissé, ce qui domine est « Contenu du jour », pas « Commencer ». Le bandeau pleine largeur de FD1 (titre 24 px, filet, bouton à droite) règle l'essentiel ; en plus, `contenu-du-jour.tsx` l.50 `h3` reste en `text-base` (bien), mais passer l'intertitre « Contenu du jour » en `text-xl text-text-secondary`-like n'est pas nécessaire.

**P3. Hauteurs inégales des trois cartes du jour (Design 4/5).** `nouvel-aujourdhui-1280.png` : Vanne 280 px, Conseil 200 px, Vidéo 324 px, `items-start`, trois bas de carte à y=837, 755, 879 : rangée en dents de scie. Correction : `items-stretch` sur la grille de `contenu-du-jour.tsx` (carte conseil étirée, lien en bas par `mt-auto`).

**P4. À 768, vidéo : vignette de 350 px dans une carte de 720, vide à droite, et titre de la vidéo écrit deux fois** (légende dans la vignette y=1206 et lien dessous y=1265), `nouvel-aujourdhui-768.png`, `en-cours-aujourdhui-768.png`. `TROISIEME = "md:col-span-2 xl:col-span-1"` (l.45) : la vignette n'est pas étirée (`max-w` du lecteur). Correction : à md, vignette `w-full` ou carte vidéo en disposition horizontale (vignette 50 % + titre). Titre dédoublé : retirer l'une des deux occurrences (`youtube-player`, légende) ; c'est du composant, pas du texte validé.

**P5. Aperçu : boutons Oui / À moitié / Rien (UX 4, 8).** `gratuit-aujourdhui-1280.png` y=586-630 : trois boutons à filet presque invisible et texte gris, d'apparence désactivée, sans explication ; l'inscrit gratuit qui les touche ne comprend pas pourquoi rien ne se passe. L'offre vient après, c'est bien (une seule, bouton plein unique). Correction : les rendre explicitement inertes (`aria-disabled`, `cursor-default`) ou les relier visuellement à l'offre ; vérifier que le contraste du texte atteint 4,5:1 (non mesuré ici). Aucune proposition de texte.

**P6. Bande : « Carnet » rogné à 1280 pour visiteur et gratuit** (`visiteur-aujourdhui-1280.png`, `gratuit-aujourdhui-1280.png`, x=1148-1190, fondu du bord), alors que la spec annonce 105 px libres. Hors périmètre (groupe bande), signalé car il casse la lecture de l'en-tête de la page. Au passage, le lien « Connexion » de l'aperçu (`LIEN`, 14 px souligné, `visiteur-aujourdhui-375.png`) : vérifier la cible de 44 px.

## Ce qui est conforme
- Tutoiement, titre unique H1, sous-titre d'aperçu validé, un seul bouton plein par page (aperçu et rubrique), « Connexion » seulement pour le visiteur : cohérent entre comptes.
- Nouvel abonné : jamais une page morte (premier pas + contenu du jour). Bouton « Commencer » 48 px (`h-12`), pleine largeur à 375.
- 375 : une colonne, rien ne déborde, carte du jour en tête, bouton au premier écran (`nouvel-aujourdhui-375.png`).
- Ancien index « Dans ton espace » bien retiré, rien d'orphelin visible.
- Aucun tiret cadratin, aucun emoji vus.

## Ce qui ferait 9+
FD1 et FD2 corrigés + P1 (filet/rounded-xl sur la carte du jour) + P2/P3. Design 3 passe alors à 9, Design 1 à 8 à 9, Design 2 à 9.
