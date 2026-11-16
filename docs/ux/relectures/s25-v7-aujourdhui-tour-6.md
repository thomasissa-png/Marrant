# Relecture à l'aveugle, « Aujourd'hui », s25 v7, tour 6

Sources lues : brief v7, `project-context.md`, spec UX `docs/ux/aujourdhui-refonte-s25.md`, spec design `docs/design/typo-harmonie-espace-s25.md`, `TAILLES.md` du tour 6. Captures : 4 comptes (visiteur, gratuit, en-cours, nouvel) en pleine page à 375, 768, 1280, 1920 ; premiers écrans `*-ecran-*` à 375 et 1280. Code : `aujourdhui/{tableau,action-du-jour,contenu-du-jour}.tsx`, `apercu/{tuile-fermee,badge-premium,hero-apercu,extrait-coupe,tableau-verrouille}.tsx`, `carte/styles.ts`. Non relus : `offre-apercu`, `hero` des autres états, `mon-espace/page.tsx` (la page se lit sur captures).

## 1. Gate typographique MESURÉE (citée de `TAILLES.md`)

| Compte | 375 | 1280 |
|---|---|---|
| visiteur | 4 tailles (24, 20, 16, 14), 6 combinaisons | 4 tailles (30, 20, 16, 14), 6 combinaisons |
| gratuit | 4 (24, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 |
| en-cours | 4 (24, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 |
| nouvel | 4 (24, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 |

Combinaisons relevées : 24 ou 30/600 display, 20/600 display, 16/400, 16/600, 14/400, 14/600 ; aucune capitale, aucune graisse 500 ou 700. Les 8 lignes tiennent dans le seuil (<= 4 tailles, <= 6 combinaisons) et dans l'échelle de la spec design : **gate typographique PASS**. Le tour 6 ne change que le placement, la sortie est identique à celle du tour 5, comme annoncé. Limite : la mesure ne couvre que le premier écran ; sous le pli le code reste dans l'échelle (`TITRE_CARTE`, `TEXTE`, `META`), sauf les écarts de rythme listés en piste.

Second accent violet (gate du brief : un seul, le bouton plein) : **FAIL**, voir faute dure 1.

## 2. Constat par compte (captures)

- **Visiteur et gratuit, 1280/1920** : hero en 2 colonnes (pastille, H1, promesse, 6 pastilles à gauche ; carte d'offre à droite avec bouton plein en haut). Le placement du tour 6 corrige le trou entre promesse et pastilles : elles suivent la promesse à 24 px. Reste environ 110 px de vide sous les pastilles, en bas de la colonne gauche : vide de fin de bloc, permis. Dessous : Z1 « Ton premier pas » (bouton contour éteint), « Ton cap », rangée 2 coupée par le fondu, « La suite est dans Premium », second bouton, légende. Une seule offre, une seule pastille « Premium » écrite.
- **Visiteur et gratuit, 375** : pastille, H1, promesse, pastilles 3 + 3, carte d'offre avec bouton plein à y = 435 px, donc dans le premier écran de 812 px. Z1 commence au bas de l'écran avec son verrou. Bon.
- **768** : hero 60/40, offre à droite, pastilles 3 + 2 (« Mission », « Contenu du jour » sur la 2e ligne : correct). Z1 en bandeau, « Ton cap » en bandeau, rangée 2 en 2 colonnes coupée par le fondu. Aucun débordement.
- **En-cours (abonné avancé)** : Z1 « S'entraîner / Si tu as 5 minutes » avec le seul bouton plein, « Ton cap » (cap 2 sur 5, 250 XP, 1 jour d'affilée, aide de série), « Étape en cours » avec barre, « Mission », « Contenu du jour », question C9. Aucun vide au milieu d'un bloc ; à 1280 la tuile « Étape en cours » a environ 55 px entre sa dernière ligne et son pied « Reprendre » (pied collé en bas par `mt-auto` parce que la tuile Mission est plus haute) : lu comme fin de corps avant une barre d'action, je le classe en piste.
- **Nouvel abonné** : Z1 « Ton premier pas » avec « Commencer » plein, « Ton cap » au cap 1, « Étape conseillée » + lien « Commencer l'étape 1 », « Tes 4 premières semaines », « Contenu du jour ». Jamais une page morte. Z1 a environ 80 px de vide en bas de carte à 1280/1920 : vide de fin de carte, permis (le tour 6 l'a bien déplacé là).
- **1920** : même rendu que 1280, coque de 1216 px centrée, marges latérales seules qui grandissent. Conforme à la spec (arbitrage de coque).

## 3. Grille de notes

### Design

| Critère | Note | Justification |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 8 | Retenue et alignements bons. Le filet violet de 4 px sur Z1 (et sur les cartes de contenu du jour) est un second accent (faute 1). |
| 2 Hiérarchie (une zone dominante, un seul accent fort) | **7** | Zone dominante claire (Z1 en 8 colonnes, ou offre en haut). Mais deux violets simultanés au premier écran : le bouton plein et le filet gradient de Z1 (`before:from-accent-primary to-accent-secondary`). Chez l'abonné en-cours à 1280, 4 filets violets dans la page. |
| 3 Largeur aux 5 largeurs | 8 | Plus de colonne centrée, grilles 12 colonnes, pas de tuile creuse ni de débordement. Vides restants tous en fin de bloc ou de colonne. Piste : hero gauche à 1280/1920 (110 px sous les pastilles). |
| 4 Cohérence entre comptes | 9 | Mêmes tuiles, mêmes gabarits, mêmes 4 tailles dans les 4 comptes. La seule discordance est le « contenu du jour » en 2 colonnes (vanne + conseil empilés, vidéo à droite) alors que la spec UX dit 3 x col-4 : choix documenté dans `contenu-du-jour.tsx` (tour 2), je ne le retiens pas en faute. |
| 5 Finition au pixel | 8 | Cibles : `min-h-11` des boutons, `min-h-12` des pieds de tuile, OK. Écarts de rythme hors pas de 8 px : `px-2.5` des pastilles du hero (`hero-apercu.tsx`), `-mb-2.5` du lien de carte (`contenu-du-jour.tsx`), `lg:mt-7` du titre « Contenu du jour » de l'aperçu (`tableau-verrouille.tsx`). Contraste du contenu atténué : `opacity-75` sur #B3B3B3 sur #1F1F1F donne environ 5:1 par calcul (AA) ; je ne l'ai pas mesuré dans un navigateur. |

### UX

| Critère | Note | Justification |
|---|---|---|
| 1 Prospect : envie de s'inscrire en 3 secondes | 8 | Voir §4. |
| 2 Abonné : je sais quoi faire | 9 | Un seul bouton plein par écran (« Commencer » ou « Les cartes du jour »), Z1 en première position, étiquette qui dit d'où vient l'action. |
| 3 Abonné : envie de continuer | 9 | Cap en 5 segments, XP, série avec flamme, « Étape n sur N » avec barre, mission facultative, contenu du jour, C9. |
| 4 Nouvel abonné | 9 | Premier pas, cap 1, parcours conseillé, feuille de route 4 semaines, contenu du jour. Aucune page morte. |
| 5 Accessibilité visible, cohérence | 9 | Extrait `aria-hidden` + `inert`, verrou décoratif, phrase lue seule, cibles 44 px. Une réserve : la tuile Mission n'est cliquable que par une ligne entière avec un chevron nu (pas de libellé d'action), acceptable (ligne entière cliquable, spec §4.3). |

## 4. Points d'attention du brief

**Le prospect lit-il TOUJOURS « fermé » avec un petit verrou sans le mot « Premium » par bloc ?** Oui dans l'ensemble, mais avec moins de marge qu'il n'en faut. Cinq signaux jouent : pastille « Premium » (verrou + mot) et bouton d'offre au-dessus de tout ; verrou gris 16 px dans chaque tuile ; contenu atténué ; bouton de Z1 en contour éteint ; fondu puis « La suite est dans Premium ». À 375 le bouton d'offre précède Z1 dans le premier écran : lecture « fermé » certaine. À 1280, c'est la zone à risque : le premier écran montre Z1 avec un filet violet vif et « Ton cap » avec un segment blanc plein, c'est-à-dire exactement le rendu d'un tableau de bord vivant (comparer `visiteur-aujourdhui-ecran-1280.png` et `nouvel-aujourdhui-1280.png` : seules différences, le bouton contour et un verrou de 16 px). Le filet violet sur Z1 dit « actif » ; le verrou nu seul ne suffit pas à le contredire. Retirer le filet des tuiles fermées renforce le « fermé » sans réintroduire de pastille.

**Donne-t-il envie de s'inscrire ?** Oui : prix, réassurance, preuve (« 1 500+ »), une seule offre, et un extrait qui montre le produit réel (premier pas, cap, étape, mission, contenu du jour). Faiblesse : la valeur tient dans la promesse de 16/400 en gris et dans 6 pastilles de libellés ; l'extrait montre des tuiles génériques sans trace de progression forte. Je n'invente pas de contenu ; piste : rien à changer côté texte, juger la valeur de l'extrait après retrait du filet.

**L'abonné voit-il quoi faire et a-t-il envie de continuer ?** Oui (notes 9).

**Vides.** Aucun vide au milieu d'un bloc relevé ; les vides restants sont en fin de carte (Z1 nouvel, Z1 aperçu) ou en bas de colonne (hero).

## 5. Fautes dures

1. Second accent violet : le filet gradient de 4 px sur Z1 et sur les cartes de contenu du jour (`CADRE_CARTE` / `FILET_CARTE` dans `carte/styles.ts`, appliqué par `CARTE_ACTION` dans `aujourdhui/tableau.tsx` et `CARTE` dans `aujourdhui/contenu-du-jour.tsx`). Le brief du 16/11 (un seul accent, le bouton plein) et la spec design §2.1 (« ne l'appliquer ni à Z1 ni aux tuiles d'Aujourd'hui ») le proscrivent ; le commentaire de `tableau.tsx` dit au contraire que « le filet reste (choix de Thomas du 15/11) ». Je ne trouve pas de `[CHOIX UTILISATEUR]` sur Aujourd'hui postérieur au 16/11 : à arbitrer par Thomas, mais selon le brief c'est une faute dure.

Correction codable : définir `CADRE_CARTE_NEUTRE = "relative overflow-hidden rounded-xl border border-border bg-background-card"` (sans `FILET_CARTE`) dans `carte/styles.ts`, l'utiliser dans `CARTE_ACTION` (`tableau.tsx`) et dans `CARTE` de `contenu-du-jour.tsx`. Les autres rubriques gardent `CADRE_CARTE`. Ce qui ferait 10 : un seul violet par écran (le bouton plein), l'aperçu qui se lit plus fermé au premier écran de 1280.

Aucune autre faute dure : gate typographique PASS, un seul bouton plein par écran, aucun débordement, aucun vide de milieu de bloc, aucune taille de police ajoutée.

## 6. Pistes (non bloquantes)

- Rythme hors pas de 8 px : `px-2.5` → `px-3` (`apercu/hero-apercu.tsx`, ligne des `<li>`, comme la constante `PASTILLE` de `tableau.tsx`) ; `-mb-2.5` → valeur du pas (`contenu-du-jour.tsx`, `lienCarte`) ; `lg:mt-7` du titre « Contenu du jour » (`apercu/tableau-verrouille.tsx`) à ramener à `lg:mt-8` ou `lg:mt-6` selon l'alignement voulu avec les voisines.
- Hero à 1280/1920 : 110 px sous les pastilles en colonne gauche, permis ; pour l'éviter sans grossir un texte, aligner verticalement la colonne gauche au centre de la carte d'offre est une option, mais déplace la pastille « Premium » (alignée sur le H1 des autres rubriques) ; je ne la recommande pas.
- Tuile « Étape en cours » à 1280 : si Thomas lit les 55 px avant le pied comme un vide de milieu de bloc, repasser le pied en `mt-4` (ne plus le coller en bas) et laisser le vide sous le pied.

NOTE GLOBALE : 7/10

Fautes dures :
1. Filet violet gradient sur Z1 et sur les cartes de contenu du jour = second accent violet (`apps/web/src/components/espace/carte/styles.ts`, `apps/web/src/components/espace/aujourdhui/tableau.tsx` (`CARTE_ACTION`), `apps/web/src/components/espace/aujourdhui/contenu-du-jour.tsx` (`CARTE`)).
