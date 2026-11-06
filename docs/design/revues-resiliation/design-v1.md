# Revue design /resiliation, v1 (s23, @design, 06/11/2026)

Référence : `docs/design/page-resiliation-s23-design.md` (critères §11). Captures lues (Read) : vide PC/mobile, vide premier écran mobile, raisons cochées PC, envoi mobile, erreur Stripe mobile, erreur Stripe page PC, annuel mobile, déjà résilié mobile, confirmée PC, sans abonnement PC. Code lu : `resiliation-formulaire.tsx`, `question-motif.tsx`, `barre-confirmation.tsx`, `recap-contrat.tsx`, `page.tsx`, `confirmee/page.tsx`. Non regardées (donc non notées) : connexion, envoi PC, annuel PC, sans client Stripe, confirmée mobile, captures pied de page. Contrastes : valeurs de la spec §9 (calculées sur les vraies couleurs) recoupées à l'œil sur les captures, pas remesurées au pixel.

## Note globale : 8,5 / 10

La page est propre, sobre, dans le système (zéro token nouveau, `Card`, `Badge`, `Button`, `rounded-lg`), et le bouton est dominant. Il manque 4 corrections de finition pour atteindre 10.

## Tableau

| # | Critère | Note | Constat (capture) |
|---|---|---|---|
| 1 | Hiérarchie (H1, date, bouton) | 9 | `resiliation-vide-pc-1440` : en plissant les yeux, H1 blanc 36 px, date 20 px bold dans le bloc surélevé, bouton violet plein : les 3 ressortent. La date pourrait peser un cran de plus (souhaitable S2). |
| 2 | Une action primaire dominante | 10 | Seul aplat violet de la page (le badge « Premium » est translucide). Cocher et « Garder » restent secondaires. |
| 3 | Bouton visible sans défilement, tous états | 9 | `vide-premier-ecran-mobile-390` : barre collée, bouton 48 px visible dès l'arrivée. `envoi-mobile` et `erreur-stripe-mobile` : toujours visible. La barre fait ~121 px (14 % de 844) et passe à ~141 px avec la ligne « Toujours en cours » : acceptable, 2 raisons sur 7 visibles au premier écran. |
| 4 | Lien « Garder » lisible mais secondaire | 9 | Souligné, `text-sm` #B3B3B3, 44 px de zone, jamais coupé (mobile centré sous le bouton, PC à droite). Conforme §10. |
| 5 | Cases : 48 px, coche, focus, pas de pré-coche | 10 | `vide-mobile` : lignes de 48 px (96 px à l'échelle 2x), toute la ligne cliquable, gap 8 px. `raisons-cochees-pc` : coche blanche sur violet + bordure violette + fond teinté (pas la couleur seule). Aucune pré-cochée. |
| 6 | Récap : droite, sans troncature | 9 | Compte et formule alignés à droite, retour à la ligne propre à 390 (`vide-mobile` : « Premium mensuel, / 1,99 € TTC par mois »), `annuel-mobile` tient sur une ligne. Doublon : badge « Premium » + ligne « Premium mensuel » (S1). |
| 7 | Zone de sécurité iOS | 8 | `pb-[max(0.75rem,env(safe-area-inset-bottom))]` en place, mais sans `viewport-fit=cover` (écart tranché par fullstack) `env()` vaut 0 : le bouton reste hors de la barre d'accueil dans Safari standard, aucune casse. Non vérifiable sur capture (émulation sans encoche). Accepté. |
| 8 | Aucun défilement horizontal | 10 | Aucun débordement sur les 10 captures lues, e-mail compris. |
| 9 | Même identité que /profil et /retractation | 9 | Cartes #1F1F1F, rayons, badges, typo Plus Jakarta/Inter identiques au pied et à l'en-tête. Seul écart : boutons `outline` dont la bordure disparaît (O3). |
| 10 | Pas d'espace arbitraire | 9 | Échelle Tailwind seule (`mt-4/6/8`, `p-5/6`), une valeur arbitraire (`safe-area`). Hors échelle visuelle : `mt-1` entre deux paragraphes de la page finale (O4). |
| 11 | Grille des raisons PC (2 colonnes) | 6 | `vide-pc-1440` : « Autre » seule à gauche, trou de 284 px à droite sous une grille par ailleurs pleine. Lignes 1 et 2 à 66 px (libellés sur 2 lignes), ligne 3 à 48 px : rythme irrégulier. O1. |
| 12 | Contraste WCAG AA | 9 | Texte blanc/#7C3AED 5,7:1 ; secondaire #B3B3B3 ; bordures de cases #707070 ~3,3:1 ; erreur rouge clair sur rouge sombre ~5:1 (lisible sur `erreur-stripe-mobile`). Point faible : bordure `outline` (#2A2A2A, ~1,3:1) sur les 3 boutons secondaires (O3). |
| 13 | Barre collée mobile / contenu masqué | 8 | `envoi-mobile` : la ligne de statut est alignée à gauche alors que bouton et lien sont centrés : rupture visible (O2). Fond opaque, trait `border-t`, rien ne passe sous le bouton : bon. |
| 14 | Couleur du bouton (violet primaire) | 10 | Juste, pas incitatif : ni rouge alarmiste (3,8:1, interdit §10), ni gris dissuasif ; même bouton que « Confirmer » de la rétractation. La dominance vient de la taille et du plein, pas de la couleur. Rien à changer. |
| 15 | États d'erreur | 9 | `erreur-stripe-page-pc` / `-mobile` : bandeau `rounded-lg` rouge discret, texte lisible, bouton « Réessayer » plein et jamais grisé, saisie conservée. Sur PC le bandeau (en haut) est à ~1000 px du bouton, compensé par `scrollIntoView` centré. |
| 16 | Déjà résilié / sans abonnement / confirmée | 8 | `deja-resilie-mobile` : badge vert « Enregistrée », récap complet, bouton outline quasi sans contour (O3). `confirmee-pc` : le paragraphe d'ouverture et sa ligne grise sont collés (165, 191, 218 px) : 3 lignes de tailles mixtes sans respiration (O4). |

## Corrections OBLIGATOIRES (4)

**O1. Grille des raisons : « Autre » pleine largeur sur PC** (critère 11)
`apps/web/src/components/resiliation/question-motif.tsx`, ligne 17 (constante `LIGNE`) : ajouter à la fin `md:last:col-span-2`. Les 7 raisons étant fixes, la 7e occupe toujours les 2 colonnes (576 px, une seule ligne) ; aucun changement mobile (grille 1 colonne). Alternative si Thomas préfère zéro libellé sur 2 lignes : ligne 36, remplacer `md:grid-cols-2` par rien (1 colonne partout, 7 x 48 px + 6 x 8 px = 400 px) ; je retiens `md:last:col-span-2` car c'est la demande « 2 colonnes » de la spec.

**O2. Ligne de statut de la barre centrée sur mobile** (critère 13)
`apps/web/src/components/resiliation/barre-confirmation.tsx`, ligne 36 : `className="text-sm text-text-secondary empty:hidden"` devient `className="text-center text-sm text-text-secondary empty:hidden sm:text-left"`. Ajouter aussi `mt-1` pour séparer du lien (44 px de zone tactile déjà dessus).

**O3. Bordure des boutons `outline` visible (3 emplacements)** (critères 9, 12)
Remplacer l'ajout par `cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border-input ...")` (`cn` de `@/lib/utils`, pas de concaténation : sinon `border-border` et `border-border-input` coexistent et l'ordre CSS décide) :
- `apps/web/src/app/(dashboard)/resiliation/page.tsx`, ligne 65 (« Réactiver mon abonnement », classes `mt-6 w-full sm:w-auto`) ;
- même fichier, ligne 76 (« Retour à l'accueil », `mt-4 w-full sm:w-auto`) ;
- `apps/web/src/app/(dashboard)/resiliation/confirmee/page.tsx`, ligne 44 (`w-full sm:w-auto`).
Valeur ajoutée exacte : `border-border-input` (#707070, 3,3:1, déjà utilisé par les cases). Ne pas toucher à la variante globale `outline` (hors périmètre, impact sur tout le site).

**O4. Respiration de l'ouverture de la page finale** (critère 10, 16)
`apps/web/src/app/(dashboard)/resiliation/confirmee/page.tsx`, ligne 39 : `mt-1` devient `mt-2` (la ligne grise se détache du paragraphe d'ouverture). Ligne 38 : `mt-4` reste.

## Souhaitables (non bloquants)

- S1. Badge « Premium » du récap redondant avec la ligne « Premium mensuel » : le garder (parité avec la carte du profil), mais ne pas le re-justifier ; à revoir si la formule revient dans le badge.
- S2. Date de fin : `text-xl` devient `text-2xl` dans `recap-contrat.tsx` ligne 63 (`dateFin ? "text-xl"`) pour un squint test encore plus net.
- S3. Boutons `outline` : envisager plus tard une bordure `border-input` dans la variante globale (touche tout le site, à planifier avec @fullstack + @qa snapshots).
- S4. Pied de page : sur page courte (`sans-abonnement-pc-1440`, 900 px) une bande de fond noir reste sous le pied ; corriger dans `(dashboard)/layout.tsx` avec `flex min-h-dvh flex-col` + `flex-1` sur `<main>` (layout partagé, hors périmètre de cette page).
- S5. Vérifier un vrai iPhone avec encoche : sans `viewport-fit=cover` aucun risque, mais la marge basse de la barre ne s'adapte pas.

## Trajectoire

O1 à O4 appliquées : critères 11, 13, 9, 12, 16 montent à 9-10, note globale attendue 9,5. Les 0,5 restants sont S2 et la validation sur appareil réel. Après correction : nouvelles captures PC 1440 + mobile 390 (vide, envoi, déjà résilié, confirmée) pour la v2.
