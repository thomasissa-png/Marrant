# Relecture design à l'aveugle : « Quoi répondre » (s26, tour 2)

Captures lues : `docs/captures/s26/rubriques-tour-2/quoi-repondre/` (visiteur, gratuit, en-cours, nouvel, à 375, 1280, 1920 ouverts). Code lu pour confirmer les classes : `apps/web/src/app/(dashboard)/mon-espace/quoi-repondre/page.tsx`, `components/espace/apercu/apercu-quoi-repondre.tsx`. Non notés (décisions) : verrouillage réel, titre en dégradé, promesse du hero (place jugée : correcte, sous le H1, avant les pastilles), filet violet retiré, « La suite est dans Premium ».

## Gate typographique (`TAILLES.md`)
- Visiteur et gratuit, 375/768 : 4 tailles (24, 20, 16, 14), 6 combinaisons. 1280/1920 : 4 tailles (30, 20, 16, 14), 6 combinaisons. PASS (seuils : 4 et 6).
- En-cours et nouvel, 375/768 : 4 tailles (24, 20, 16, 14), 5 combinaisons ; 1280/1920 : 4 tailles (30, 20, 16, 14), 5 combinaisons. PASS.
- Graisses 400 et 600 seulement ; Jakarta réservé à 24/30 et 20 (`TITRE_PAGE`, `TITRE_CARTE`) ; aucun élément hors échelle relevé. Aucune taille ajoutée.

## Aplat violet
- Visiteur/gratuit : un seul aplat au premier écran (le bouton d'offre en haut, y ≈ 202 à 1280, y ≈ 344 à 375). Le second « Premium · 1,99 €/mois » (fin de page, y ≈ 1137 à 1280) est hors premier écran. PASS.
- Abonnés : un seul aplat (« Voir »), plus la teinte `CARTE_ACTION` (permise). Barres neutres. PASS.

## Observations par capture
- Aperçu 1280/1920 : hero 8/4, offre en haut à droite, extrait en 7/5, trois tuiles fermées en 4/4/4 sous le fondu. Se lit FERMÉ : verrous, répliques en barres, boutons absents, extrait fondu. Largeur utilisée (contenu 1216 px à 1920, même gabarit que l'en-tête). 375 : offre au premier écran, tuiles empilées, une seule tuile fermée sous le fondu (voulu).
- Aperçu : la tuile « Coloc : la poêle » garde ~105 px vides en bas (y 765 à 870, 1280) parce qu'elle s'étire à la hauteur du rail de filtres. Vide en fin de carte : permis, pas une faute.
- Abonné 1280/1920 : rail 3 colonnes (x 31 à 319 à 1280), tuile d'action et lieux en 9 colonnes (x 342), tuiles par lieu avec compteur et barre, lignes en 2 colonnes. Rythme `gap-6`/`p-6` constant. En-cours : « Fait » avec coche verte, barre à 1/4 ; nouvel : barres vides à 0/n, jamais une page morte.
- Abonné 375 : tuile d'action en tête (titre sur 2 lignes, « Voir » pleine largeur), filtres repliés « Filtrer les cartes », puis lieux en une colonne. Aucun débordement horizontal visible.

## Notes par critère (grille Design)
1. Élégance et fidélité à l'accueil : 9/10. Retenue, 2 graisses, un violet. Défaut : pastille de rail « Commerces, voisins, transports » sur 2 lignes en `rounded-full` (capsule déformée, rail 1280/1920 abonnés).
2. Hiérarchie : 9/10. Aperçu : offre en haut domine. Abonné : tuile d'action + « Voir » dominent. 
3. Usage de la largeur aux 5 largeurs : 8/10. Faute dure n°1 ci-dessous.
4. Cohérence entre comptes : 9/10. Mêmes gabarits, mêmes tailles ; l'offre du gratuit ajoute une phrase (texte, pas mise en page).
5. Finition au pixel : 9/10. Pastilles de rail ≈ 45 px (cible 44 OK, `min-h-11`), lignes ≈ 54 px ; contrastes du texte inerte (`opacity-75` sur #B3B3B3) non mesurés dans les captures : à confirmer par le test @qa, pas une faute chiffrée.

## Fautes dures (chiffrables)
1. Vide horizontal au MILIEU de la tuile d'action abonné : le titre se termine à x ≈ 702 (1280) et le bouton « Voir » commence à x ≈ 1046, soit ≈ 344 px vides (identique à 1920, 1367 − 1023). Cause : `lg:flex-row lg:items-center lg:justify-between` dans `page.tsx` ligne 87 (spec design §1.2 et §4.4 : « pas de `justify-between` sur grand écart »). Règle : vide > 32 px au milieu d'un bloc.

## Pistes (non bloquantes)
- Correction de la faute 1, codable : retirer `lg:justify-between` et garder `lg:gap-6` (`page.tsx` l.87) ; le bouton se pose à côté du titre, le vide passe en fin de tuile (permis). Variante : `lg:grid lg:grid-cols-[1fr_auto]` avec le bouton collé au texte via `lg:justify-start`. Aucune taille ajoutée.
- Pastille du rail sur 2 lignes : `rounded-full` remplacé par `rounded-xl` quand le texte passe à 2 lignes, ou `whitespace-nowrap` impossible (largeur 3 col.) : `filtres-situations.tsx`, classe de la pastille `rounded-xl` (12 px, déjà dans l'échelle).
- Aperçu : `lg:items-start` sur la rangée 1 de `apercu-quoi-repondre.tsx` (grille `data-apercu-rangee="1"`) retire les ~105 px vides de la tuile « Coloc : la poêle » ; à décider, ce vide est permis.

## Ce qui ferait 10
Faute 1 corrigée (critère 3 à 10), pastille du rail propre (critère 1 et 5 à 10), contrastes de l'extrait mesurés.

NOTE GLOBALE : 8/10

Fautes dures :
1. Tuile d'action abonné : ≈ 344 px vides entre titre et « Voir » à 1280 et 1920 (`apps/web/src/app/(dashboard)/mon-espace/quoi-repondre/page.tsx` l.87, classes `lg:justify-between lg:flex-row`).
