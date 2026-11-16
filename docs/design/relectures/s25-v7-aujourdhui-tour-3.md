# Relecture DESIGN à l'aveugle, « Aujourd'hui » s25 v7, tour 3

Périmètre : captures `docs/captures/s25/v7-aujourdhui-tour-3/aujourdhui/` (pleine page et `*-ecran-*`). Ouvertes : visiteur 375, 768, 1280, 1920 (pleine page) et 375 (écran) ; gratuit 375 (écran) et 1280 (écran) ; nouvel 375, 768, 1280, 1920 (écran) ; en-cours 375, 768, 1280, 1920 (écran). 1456 non ouvert (même rendu que 1280 par construction, coque plafonnée). Étalon : `etalon-accueil/visiteur-accueil-1280.png`. Code lu : `apercu/{tableau-verrouille,extrait-coupe,hero-apercu,offre-apercu,tuile-fermee,badge-premium,apercu-verrouille}.tsx`, `aujourdhui/{tableau,cap-du-jour,etape-en-cours,mission-lien,action-du-jour,cartes-du-jour}.tsx`, `mon-espace/page.tsx`. Textes non jugés (T1, T2 jugés sur leur place : bien placés).

## Constats positifs (rendu réel)

- Aperçu 1280 : fermé au premier coup d'œil (pastille « Premium » avec le mot, tuiles atténuées, fondu, rangée 2 coupée entre deux lignes), bouton d'offre en haut dans la seule carte encadrée (`border-2 border-accent-primary`), une seule offre (réassurance, preuve, « Connexion » dans la carte). H1 aligné sur la barre. Le halo remplit 1920.
- Abonné : Z1 dominante (seule carte teintée, seul plein), Z2 à hauteur égale, rangée 2 sans cellule vide, H1 à gauche avec date. Même grammaire que l'accueil (`rounded-xl`, filet violet de Z6).
- 375 : bouton d'offre visible dans le premier écran (y 450-495 sur 812), 3 rangées de pastilles propres, aucun débordement.
- Cibles (au code) : boutons `size lg` (h-12), pied de tuile `min-h-12`, lien « Connexion » `min-h-11 min-w-11`, cartes de rafale `min-h-14`, tuile Mission entièrement cliquable. Focus : anneaux présents partout (`ring-inset` dans les tuiles à `overflow-hidden`, `ring-offset` sur la tuile lien). Aucun `outline-none` sans anneau.
- Contrastes (au code et calculés) : `accent-link` sur carte, `text-secondary`, `text-muted` (5,9:1) conformes ; segments et rails `bg-accent-primary` / `bg-border-hover` non textuels. Extrait inerte : bouton « Commencer » atténué 0,75 environ 4,5:1, pied de tuile violet 0,75 environ 4:1, au-dessus de 3:1 (exempté, `aria-hidden`, `inert`). Aucune faute de contraste ni de cible.

## Notes

### Design

| Critère | Note | Justification |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 9 | Retenue, un accent, bords fins. Sept pastilles « Premium » sur l'aperçu 1280 (hero + 4 tuiles + fin + titre) : un peu répétitif, voir piste P3. |
| 2 Hiérarchie | 9 | Aperçu : carte d'offre puis H1 puis Z1. Abonné : Z1 puis Z2. En plissant les yeux, H1, Z1/offre, bouton lisibles. |
| 3 Usage de la largeur | 8 | Hero de l'aperçu à 1280, 1456, 1920 : colonne texte 800 px qui s'arrête à y 350 alors que la carte d'offre va à y 410, puis 80 px de marge avant l'extrait (y 490) : zone vide d'environ 140 px sur toute la colonne gauche (captures visiteur-1280 et 1920, gratuit-ecran-1280). Pas de débordement, pas de tuile creuse. |
| 4 Cohérence entre comptes | 9 | Mêmes tuiles abonné/aperçu (composants partagés) ; gratuit = visiteur + phrase d'objet, sans « Connexion ». |
| 5 Finition au pixel | 9 | Titres de la rangée 2 de l'extrait non alignés : « Contenu du jour » à y 733 contre « Répartie » et « À voix haute » à y 756 (1280). Détail, voir P2. |

### UX

| Critère | Note | Justification |
|---|---|---|
| 1 Prospect, envie en 3 s | 9 | Fermé lisible, valeur (tableau de bord concret), offre en haut, une seule offre. |
| 2 Abonné, clarté | 9 | Z1 évidente dans les 4 états vus, un seul plein. |
| 3 Abonné, envie de continuer | 9 | Cap, XP, série, « Étape n sur N », 4 premières semaines. |
| 4 Nouvel abonné | 9 | Jamais une page morte : premier pas, cap, étape, feuille de route, contenu du jour. |
| 5 A11y visible et cohérence | 9 | Voir constats positifs. |

Critère 3 Design à 8 : défaut précis ci-dessus. Correction codable (sans toucher au repli sous le premier écran, la marge `lg:mt-20` de `extrait-coupe.tsx` reste pour que le bouton de fin soit sous 900 px) : dans `hero-apercu.tsx`, équilibrer la colonne texte avec la carte d'offre : H1 `md:text-5xl lg:text-6xl`, promesse `md:text-xl lg:text-2xl`, pastilles `mt-6 lg:mt-8`. La colonne gauche passe d'environ 200 px à environ 255 px, comme la carte, et le vide tombe sous 90 px. Ce qui ferait 10 : ce même équilibre, vérifié à 1280 et 1920 avec le bouton de fin toujours sous le pli de 900 px.

## Pistes (pas des fautes dures)

- P1 (`etape-en-cours.tsx`, `BarreProgression`) : « Étape 3 sur 3 » avec une barre remplie aux deux tiers (en-cours-1280) se lit comme une incohérence. La barre compte les étapes validées (ordre - 1). Aucun nouveau texte : soit remplir jusqu'à l'étape en cours, soit laisser tel quel et assumer. À arbitrer par @ux.
- P2 (`tableau-verrouille.tsx`) : la tuile « Contenu du jour » de l'extrait n'a pas d'étiquette comme ses voisines, son titre est 23 px plus haut. Ajouter `pt-[23px]` à son contenu ou `mt-7` sur le titre à `lg`.
- P3 : réduire les pastilles « Premium » des tuiles de l'extrait à un verrou seul, sans mot, serait contraire à la règle « le verrou ne vit jamais seul » : à ne PAS faire. Garder.
- P4 (768, `offre-apercu.tsx`) : le bouton d'offre fait 636 px de large (barre pleine largeur de page). Un `md:mx-auto md:max-w-md` sur la carte donnerait une carte centrée plus fine. Goût.
- P5 (768, abonné, tuile Vidéo du jour) : environ 100 px vides sous le lien dans la moitié droite. Composant de l'accueil, hors périmètre.

## Verdict

Barre de 9/10 non atteinte sur un seul critère (largeur, 8), sans faute dure de contraste, de cible ni de débordement. Le défaut est une zone vide du hero de l'aperçu (desktop), à corriger avant validation.

NOTE GLOBALE : 8/10

Fautes dures :
1. Hero de l'aperçu desktop (1280, 1456, 1920) : vide d'environ 140 px sous les pastilles, colonne texte nettement plus courte que la carte d'offre ; équilibrer la colonne (`apps/web/src/components/espace/apercu/hero-apercu.tsx`, H1 `lg:text-6xl`, promesse `lg:text-2xl`, pastilles `lg:mt-8`).
