# Revue visuelle et parcours de l'intégration s21 (@design, principes @ux)

Date : 17/10/2026. Périmètre : branche `claude/marrant-s21-integration` (worktree `agent-a6072b0ac19da7774`), captures `docs/qa/captures-s21/apres-correctifs/` et `integration/`. Aucun code modifié, aucun git.
Preuves : 60 captures lues (375, 320, 1024, 1280, 1440) + lecture du code (`header.tsx`, `search-bar.tsx`, `abonnement-view.tsx`, `plan-selector.tsx`, `lettre-inscription.tsx`, `lettre-accueil.tsx`, `footer.tsx`, `button.tsx`, `article-cta.tsx`, `viral-quiz.tsx`, `tailwind.config.ts`).

## 1. Note : 7,0 / 10 (GO sous condition : B1 corrigé, M1 à M4 corrigés dans la même mise à jour)

| Zone | Note | Raison en une ligne |
|---|---|---|
| Page /abonnement (titre, carte, pastille, avantages) | 8,0 | Titre et ordre bouton puis avantages réussis ; marge de 73 px seulement sous le bouton à 375 x 812, saut de mise en page au changement de formule, anneau de focus qui reste après un clic. |
| Boutons d'achat vs boutons gratuits (2 niveaux) | 6,5 | Premium plein toujours dominant, mais le niveau 2 existe en deux versions (bordure violette / bordure grise quasi invisible). |
| Formulaire de la lettre (article, quiz, /lettre) | 7,5 | Étiquette, champ 48 px, erreurs, succès propres ; case blanche native criarde, bloc lourd sur mobile, quiz sans capture. |
| Entrée « La lettre » du menu | 6,5 | Bonne place en dernier onglet ; absente de la barre de 1024 à 1279 px, et le menu mobile n'a pas de hauteur maximale. |
| Bloc d'accueil | 8,5 | Discret, aucun bouton, hiérarchie juste ; espacements haut/bas asymétriques. |
| Pied de page | 8,0 | Lien bien placé ; listes à 2 colonnes lues en zigzag, 6 / 5 déséquilibré. |
| En-tête, toutes largeurs | 4,0 | Recherche écrasée à 86 px (1280, connecté sans abonnement), débordement de 70 px à 1024, placeholder coupé à 1024 anonyme. |

Grille des 10 critères (0 à 1 chacun, total 7,5 ramené à 7,0 par le défaut bloquant) :

| # | Critère | Score | Preuve visuelle |
|---|---|---|---|
| 1 | PRO | 0,8 | « Rech » tronqué dans l'en-tête (`menu-1280-connecte-sans-abonnement.png`), « Déconn » coupé (`menu-1024-connecte-sans-abonnement.png`). |
| 2 | BEAU | 0,8 | Cartes, titres, espacements cohérents ; case blanche native sur fond noir (`lettre-375-page-vide.png`). |
| 3 | BRAND-ALIGNED | 0,8 | Violet réservé à Premium respecté partout, ton des textes validés tenu. |
| 4 | MÊME IDENTITÉ | 0,7 | Deux bordures de niveau 2 différentes (`lot2-375-video-fiche-parcours.png` : violette pour l'étape 1, grise pour « Voir toutes les vidéos »). |
| 5 | PROPRE | 0,6 | Texte tronqué en en-tête, anneau de focus résiduel sur « Annuel ». |
| 6 | ALIGNÉ | 0,7 | Pied de page 6 / 5 en zigzag ; pastille « plus de 3 mois offerts » qui disparaît et décale prix et bouton de 26 et 18 px. |
| 7 | AÉRÉ | 0,8 | Bon partout ; accueil : 47 px au-dessus de la lettre, 112 px en dessous. |
| 8 | CONVERSION | 0,8 | Bouton Premium dominant partout où il est présent ; au premier écran de /abonnement il est à la limite (voir M2). |
| 9 | HIÉRARCHIE | 0,8 | 3 éléments lisibles en plissant les yeux sur /abonnement 375 (titre, prix, bouton) ; sur l'article, le bloc lettre pèse presque autant que le bloc Premium. |
| 10 | ACCESSIBLE | 0,7 | Contrastes OK (voir §6) ; menu mobile inaccessible en bas sur petit écran, bordure grise du niveau 2 à 1,4:1. |

Avertissement sur les preuves : dans `apres-correctifs/`, les captures `lot2-375-abonnement-{mensuel,annuel}.png`, `lot2-320-abonnement-*.png` et `lot2-1280-abonnement-*.png` montrent l'ANCIEN titre (« Accéder aux parcours complets ») et les avantages AU-DESSUS du bouton : elles ne représentent pas le code de la branche (qui a le nouveau titre, le bouton avant les avantages). J'ai jugé l'abonnement sur `lot2-abonnement-titre-*` et `lot2-abonnement-bouton-*`, plus le code. @qa doit régénérer ou supprimer les anciennes avant toute validation.

## 2. En-tête : cause racine et solution durable (tranchée)

### 2.1 Cause racine (arithmétique, pas un accident)
Contenu utile : 1248 px dès 1280 (max-w-7xl, donc IDENTIQUE à 1280, 1440, 1536 et 1920). Le logo, la navigation et les actions sont `shrink-0` ; la recherche (`w-48`, sans `shrink-0` ni plancher) est le seul élément qui encaisse tout. Budget estimé d'après les captures, connecté sans abonnement, 1280 : logo 188 + navigation 7 onglets 534 + actions 382 (« Activer mon accès » 154, étoile 44, profil 44, « Déconnexion » 104, écarts 36) + 3 écarts de 16 = 1152, il reste 96 px pour la recherche (mesuré : 86). À 1024 (992 utiles), il manque 70 px avant même que la recherche existe. Corollaires : le `2xl:w-64` ne sert à rien (la barre ne s'élargit plus après 1280) ; le commentaire de `header.tsx` « dès 1280, plus aucun débordement » est faux pour ce cas.
Conclusion : aucun réglage de largeur de la recherche ne tient. Il faut retirer de la barre ce qui n'a pas besoin d'y être en permanence.

### 2.2 Solution (3 changements + 1 garde-fou) dans `components/layout/header.tsx`
1. **Compte en menu** : remplacer étoile + profil + « Déconnexion » (3 contrôles, 200 px) par UN menu de compte (icône utilisateur, 44 px) qui ouvre « Favoris », « Mon profil », « Déconnexion » (textes existants, rien de réécrit). « Activer mon accès » reste hors du menu : c'est le bouton Premium, il reste visible et violet plein. Nouveau composant `components/layout/account-menu.tsx` construit sur `@radix-ui/react-dropdown-menu` (déjà dans `package.json`, donc zéro dépendance ajoutée : clavier, `Escape`, focus rendu au bouton, rôles ARIA fournis). Contenu : `DropdownMenu.Item asChild` autour de deux `Link` (« Favoris », « Mon profil ») et un item « Déconnexion » (`signOut({ callbackUrl: "/" })`) ; surface `bg-background-card border border-border rounded-lg`, items `min-h-11`. Seul texte neuf : `aria-label="Mon compte"` (non affiché, à faire valider). Même composant pour Premium. Le menu mobile garde sa liste à plat (déjà correcte).
2. **Recherche en deux états** : champ visible seulement dès `xl` (`<SearchBar className="hidden shrink-0 xl:block xl:w-44" />`, supprimer `lg:block`, `w-36`, `2xl:w-64`) ; de `lg` à `xl`, un bouton icône 44 px (`hidden lg:flex xl:hidden`, `aria-label="Rechercher"`, `aria-expanded={isMobileSearchOpen}`, `aria-controls="mobile-search"`) qui ouvre le panneau déjà existant `#mobile-search`, dont la classe passe de `lg:hidden` à `xl:hidden`. Même geste qu'au téléphone : cohérent, zéro nouveau composant. `shrink-0` + largeur fixe : plus jamais d'écrasement silencieux.
3. **Onglet « La lettre » = onglet comme les autres** : supprimer `LETTRE_ONGLET_ORDINATEUR`, `desktopClassName` et le `cn("hidden", …)` ; `lettreNavItem` rejoint la liste normale, visible dès `lg`. Budget après 1 et 2 (estimé) : 1024 connecté sans abonnement 886 + 74 = 960 sur 992 (marge 32 px) ; anonyme 954 (marge 38) ; Premium 794 (pas d'onglet lettre). 1280 : 1026 + recherche 176 = 1202 sur 1248 (marge 46). Si la mesure à 1024 donne une marge < 16 px, repasser l'onglet en `xl` (une seule classe), le reste tient.
4. **Garde-fou** (c'est ce qui rend la solution durable) : test Playwright `header-budget` : largeurs 1024, 1100, 1280, 1440, 1536, 1920 x états anonyme / connecté sans abonnement / Premium. Assertions : `scrollWidth <= clientWidth` sur la barre ; aucun enfant dont `getBoundingClientRect().right` dépasse la fenêtre ; recherche, quand le champ est affiché, de largeur >= 160 px et placeholder non coupé (`input.scrollWidth <= input.clientWidth`) ; libellés des actions non coupés. Remplacer le commentaire de `header.tsx` par le tableau de budget ci-dessus : tout futur onglet doit y trouver sa place ou passer en menu.

Effets sur les captures attendues : 1280 connecté sans abonnement, recherche de 176 px avec « Rechercher... » entier ; 1024, plus de débordement, icône loupe ; aucune régression anonyme à 1280 et 1440 (même rendu qu'aujourd'hui).

## 3. Défauts et corrections exactes

### BLOQUANT (1)

**B1. En-tête écrasé ou débordant (1024 et 1280 et plus, connecté sans abonnement ; 1024 anonyme)**
Preuves : `integration/menu-1280-connecte-sans-abonnement.png` (recherche 86 px, « Rech »), `menu-1024-connecte-sans-abonnement.png` (« Déconn » coupé, débordement 70 px), `menu-1024.png` (placeholder « Rechercher.. » coupé). Régression de ce lot pour le cas 1280 (l'onglet ajoute 74 px), défaut antérieur pour 1024.
Correction : §2.2 en entier (menu de compte Radix, recherche icône de `lg` à `xl`, onglet normal, test `header-budget`). Fichiers : `components/layout/header.tsx`, nouveau `components/layout/account-menu.tsx`, `__tests__/layout/header.test.tsx` (mettre à jour les attentes de classes), nouveau test Playwright. Critère de sortie : 6 largeurs x 3 états sans coupe, recherche >= 160 px quand le champ est affiché.

### MAJEUR (4)

**M1. Menu mobile sans hauteur maximale : « Connexion » et bas du menu inaccessibles sur petit écran**
Preuve : `integration/menu-mobile-ouvert-375.png` : le panneau descend jusqu'à 638 px (7 entrées de 52 px dont « La lettre » ajoutée par ce lot, recherche de 56 px sous 440 px). Un iPhone SE ou un Android 360 x 640 avec barre du navigateur offre 550 à 600 px : le bas dépasse et, l'en-tête étant `sticky`, on ne peut pas le faire défiler. Sous 520 px, « Connexion » n'existe que dans ce menu.
Correction, `header.tsx`, `<nav aria-label="Navigation mobile">` : ajouter `max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]` (le `py-4` devient `pt-4`). Vérifier à 375 x 550.

**M2. /abonnement : le bouton d'achat tient au premier écran avec 73 px de marge seulement**
Preuve : `apres-correctifs/lot2-abonnement-bouton-375-mensuel.png` : bouton de 691 à 739 sur 812 ; pas de texte de réassurance entièrement visible. Sur Safari réel (barres), la hauteur utile est de 660 à 700 : le bouton est coupé. Critère demandé « sans défiler » non tenu en conditions réelles.
Correction, `components/premium/abonnement-view.tsx`, mobile seulement (pas de texte touché) : carte `mt-10` devient `mt-6 sm:mt-10` ; `CardContent` `p-6 sm:p-8` devient `p-5 sm:p-8` ; sous-titre `text-lg` devient `text-base sm:text-lg` ; bouton `mt-8` devient `mt-6 sm:mt-8` (2 occurrences, bouton visiteur et bouton connecté). Gain d'environ 48 px : bouton de 643 à 691. Cible : bouton entier visible à 375 x 700. Contrôler aussi `app/abonnement/page.tsx` (padding haut de la section, non lu) et recapturer 375 x 700 et 320 x 568 (le bouton y restera sous le pli : acceptable, « Commencer » de l'en-tête est visible).

**M3. Deux bordures de « niveau 2 » : bordure violette (étape 1 gratuite) et grise (lettre, « Voir toutes les vidéos »)**
Preuves : `lot2-375-video-fiche-parcours.png`, `lot2-375-article-bloc-fin.png` (violette) contre `lettre-375-article-bloc-lettre.png` (grise, 1,4:1 sur le fond, la forme du bouton disparaît). Aujourd'hui l'étape 1 s'écrit par surcharge locale (`article-cta.tsx` ligne 100 : `border-accent-primary/60 hover:border-accent-primary`), pas par le système de boutons.
Correction : (a) dans `components/ui/button.tsx` ajouter la variante `outline-accent` : `border border-accent-primary/80 text-text-primary hover:bg-background-elevated hover:border-accent-primary focus-visible:ring-accent-primary` (3,2:1, contre 2,3:1 à /60). (b) Règle écrite dans `docs/design/design-system.md` : niveau 1 = `primary` plein (Premium seul) ; niveau 2 = `outline-accent` (toute action gratuite qui entre dans le produit : étape 1, lettre) ; `outline` neutre = utilitaire seulement (annuler, retour, voir tout). (c) Remplacer la surcharge de `article-cta.tsx` et les surcharges identiques ailleurs (chercher `border-accent-primary/60` dans `components/`) par `variant: "outline-accent"` ; bouton de `lettre-inscription.tsx` ligne 198 : `variant="outline-accent"`. (d) Dette de nom : `secondary` est un violet plein (`bg-accent-secondary`), piège pour le prochain développeur ; marquer `@deprecated` et renvoyer vers `primary`.

**M4. Case de consentement : carré BLANC natif sur fond noir**
Preuves : `lettre-375-page-vide.png`, `lettre-1280-page-vide.png`, `lettre-375-article-bloc-lettre.png` : c'est l'élément le plus clair du bloc, il attire l'œil avant le champ et le bouton (le `accent-accent-primary` ne colore que l'état coché).
Correction, `components/lettre/lettre-inscription.tsx` ligne 178 : ajouter `[color-scheme:dark]` aux classes de l'`input` case (Chrome, Safari, Firefox dessinent alors une case sombre, violette cochée). Variante plus large et préférable si le site est 100 % sombre : `color-scheme: dark` sur `html` dans `app/globals.css` (corrige aussi barres de défilement et champs natifs ; à recapturer). Vérifier aussi `text-error` (ligne 156, 184, 192) : le jeton AA du projet pour le texte d'erreur est `text-error-text` (#F87171), `error` est réservé aux bordures et fonds.

### MINEUR (8)

- **m1. Anneau de focus qui reste sur « Annuel » après un clic** (`lot2-abonnement-bouton-375-annuel.png`, 1280 annuel : double contour qui se lit comme une double sélection). `components/premium/plan-selector.tsx` ligne 55 : remplacer `focus-within:ring-2 focus-within:ring-accent-primary focus-within:ring-offset-2` par `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-primary has-[:focus-visible]:ring-offset-2` (Tailwind 3.4.17 le gère). L'anneau reste pour le clavier.
- **m2. Saut de mise en page au changement de formule** : prix décalé de 26 px, bouton de 18 px (pastille « plus de 3 mois offerts » absente en annuel, ligne « Payé en une fois » en plus). `plan-selector.tsx` : garder la pastille dans le flux en annuel avec `className="invisible"` + `aria-hidden` (au lieu de ne pas la rendre) ; envelopper les lignes sous le prix dans un bloc `min-h` égal à la hauteur annuelle mesurée à 375 et à 1280. Le bouton ne doit plus bouger sous le pouce.
- **m3. Pastille « Mensuel » active en violet plein, même teinte que le bouton d'achat** : trois violets pleins au premier écran 375 (en-tête, pastille, bouton). Le bouton reste dominant (pleine largeur, 48 px). Pour renforcer la hiérarchie : état actif de `chipClass` sur ce sélecteur en `bg-accent-primary/20 border border-accent-primary text-text-primary` au lieu du plein (à valider sur captures ; ne pas changer `chipClass` ailleurs).
- **m4. Pied de page : listes lues en zigzag, 6 / 5** (`lettre-1280-pied-de-page.png`, `lettre-375-pied-de-page.png` : « Nos offres » seul à gauche, « La lettre du mois » loin de « Quiz humour » à 375). `footer.tsx` `<ul>` Produit : remplacer `grid grid-cols-2 gap-x-6 sm:grid-cols-1 lg:grid-cols-2 lg:gap-x-8` par `grid grid-flow-col grid-cols-2 grid-rows-6 gap-x-6 sm:grid-flow-row sm:grid-cols-1 sm:grid-rows-none lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-6 lg:gap-x-8` ; ordre de lecture en colonnes : gauche Vannes à Blog, droite Glossaire, Quiz humour, La lettre du mois, Anatomie, Nos offres. Le nombre de rangées (6) vaut `ceil(11 / 2)` : à recalculer si un lien est ajouté.
- **m5. Accueil : espacements du bloc lettre asymétriques** (`accueil-375-bloc-lettre.png` : 47 px entre le filet et le titre, 112 px entre le lien et la pastille « Abonnés »). La lettre se lit comme rattachée à la FAQ et non comme une section. `components/home/lettre-accueil.tsx` : `py-8 md:py-10` devient `pt-10 pb-6 md:pt-12 md:pb-8`, et réduire le padding haut de la section « Prochainement » (fichier de la page d'accueil, non lu) pour que l'écart sous le lien ne dépasse pas l'écart au-dessus de plus de 16 px.
- **m6. Poids du bloc lettre en fin d'article sur 375** (`lettre-375-article-bloc-lettre.png` : environ 470 px, autant que le bloc Premium). Les textes sont validés : agir sur la mise en forme seulement. `lettre-inscription.tsx` : fusionner « Gratuit, sans compte. » et la mention dans un seul `<p className="mt-2 text-xs text-text-muted">` (le lien suit en ligne) ; `grid gap-3` devient `gap-2.5` ; zone tactile du lien par `inline-flex min-h-11 items-center` plutôt que `py-3` (évite la ligne haute irrégulière). La hiérarchie vient surtout de la bordure et du poids du bouton (voir M3).
- **m7. /lettre : titre sur 3 lignes à 375 et aligné à gauche** alors que les pages d'offre sont centrées (`lettre-375-page-vide.png`). Ajouter `text-balance` au H1 de la page `/lettre` (fichier de la page, non trouvé sous `app/lettre` dans le worktree : à localiser) et `text-2xl sm:text-3xl` pour tenir sur 2 lignes ; l'alignement à gauche est acceptable pour une page formulaire.
- **m8. Quiz : conflit d'espacement dans le cas « revient sur le quiz »** (`viral-quiz.tsx` lignes 173 à 175) : `space-y-4` du conteneur écrase le `mt-6` du bloc lettre (16 px d'écart au lieu de 24 px). Envelopper `{lettre(result)}` dans un `<div className="pt-2">` ou retirer `space-y-4` au profit de `mt-` explicites.

## 4. Parcours (principes @ux) : ce qui passe

- **Premium reste l'action principale partout** : /abonnement (bouton plein pleine largeur sous le prix) ; article (étape 1 contour puis Premium plein, lettre en dessous séparée par un filet) ; accueil (la lettre est un lien texte sans fond ni bouton) ; menu (« La lettre » = onglet ordinaire, « Commencer » / « Activer mon accès » plein) ; pied de page (lien). /lettre n'a qu'une action, le formulaire, et « Commencer » reste le seul plein de la page.
- **Titre de /abonnement** : « Ta réplique pendant la soirée, pas dans le bus du retour » (3 lignes à 375, 2 à 1280, bien équilibré) ; carte de prix lisible : prix 36 px, ligne annuelle violette lisible (#A78BFA sur #1F1F1F, environ 6:1), pastille « plus de 3 mois offerts » alignée sous « Annuel » et qui suit « Annuel » à la ligne à 320 px (le correctif s21 tient).
- **Parcours de saisie de la lettre** : étiquette visible, placeholder exemple seulement, une colonne à toutes les largeurs (ordre visuel = ordre clavier), erreur de champ en texte avec « ! » et lien `aria-describedby`, focus sur le champ en erreur, succès sans saut de hauteur (`minHeight` conservé), compte à rebours en texte (`lettre-375-page-succes.png`).
- **Accessibilité** : contrastes vérifiés au calcul (blanc sur #7C3AED environ 5,7:1 ; #9A9A9A sur #0D0D0D environ 7:1 ; pastille violette environ 4,9:1 ; texte d'erreur #EF4444 environ 5,2:1) ; cibles 44 px sur menu mobile, champs 48 px, liens du pied de page `min-h-[44px]`.

## 5. Ce qui manque pour atteindre 10 / 10

1. B1, M1 à M4 corrigés, puis m1 à m8 (aucun ne touche un texte validé).
2. **Captures manquantes** (je n'ai pas pu juger visuellement) : résultat du quiz avec le bloc lettre (375 et 1280, premier passage et « revient sur le quiz ») ; aucune capture à **768** (la consigne demande 375, 768, 1280 ; 768 = barre mobile avec « Connexion » et loupe) ; /abonnement 320 et 375 x 700 avec le NOUVEAU layout ; menu mobile ouvert à 375 x 550 ; en-tête à 1100, 1536 et 1920 dans les 3 états (anonyme, connecté sans abonnement, Premium) ; menu de compte ouvert ; accueil 768 ; statuts `/lettre?statut=confirmee|desinscrit|invalide|erreur` ; états de focus clavier du formulaire et du sélecteur Mensuel / Annuel.
3. **Régénérer ou supprimer** les captures périmées signalées au §1 (ancien titre, avantages au-dessus du bouton) et les doublons à la racine de `captures-s21/` (`lot2-375-*`, `lettre-375-*`) pour qu'un lecteur ne juge pas l'ancien rendu.
4. Mesure réelle (Playwright) des budgets du §2 : mes largeurs d'éléments sont estimées d'après les captures, à confirmer ; le test `header-budget` est la définition de « fini ».
5. Documenter dans `docs/design/design-system.md` : règle des deux niveaux de boutons (M3), budget de l'en-tête (§2), `color-scheme: dark`. Un onglet ou un bouton de plus dans la barre = d'abord une place dans le budget, sinon dans le menu de compte ou le menu déroulant.
6. Revue de l'ensemble sur captures après correction : visée 9,5 à 10 une fois B1 et M1 à M4 en place.

---
**Handoff → @orchestrator (puis @fullstack, @qa)**
- Fichier : `/home/user/Marrant/docs/design/revue-integration-s21.md` ; NOTE 7,0 / 10 (en-tête 4, boutons 6,5, lettre 7,5, abonnement 8, accueil 8,5, pied 8).
- Bloquant : en-tête (cause = budget de largeur dépassé) ; solution : menu de compte Radix + recherche en icône de lg à xl + onglet « La lettre » normal + test `header-budget`.
- Majeurs : menu mobile sans `max-h`/scroll, bouton /abonnement trop juste au premier écran, deux niveaux de bordure (variante `outline-accent`), case blanche native.
- Manques de preuve : aucune capture du quiz, du 768, ni du nouveau layout /abonnement à 320 ; plusieurs captures `apres-correctifs/lot2-*` montrent l'ancien rendu.
---

# Tour 2 (revue du 17/10/2026, commit 46d455f ou plus récent)

Périmètre : 37 captures sur les 51 de `docs/qa/captures-s21/tour2/` lues une à une (375, 375 x 550, 375 x 700, 1024, 1280, 1440 ; les 14 non ouvertes sont des doublons 1280 / 375 des mêmes états) + `mesures.json` + code du worktree (`header.tsx`, `account-menu.tsx`, `mobile-nav.tsx`, `button.tsx`, `plan-selector.tsx`, `abonnement-view.tsx`, `lettre-inscription.tsx`, `lettre-statut.tsx`, `lettre-bouton-action.tsx`, `lettre-accueil.tsx`, `footer.tsx`, `globals.css`, `blog-article-view.tsx`, `header-budget.spec.ts`, `design-system.md`). Aucun code modifié, aucun git. Limite : je n'ai pas de `grep` ; l'absence de surcharges `border-accent-primary/60` ailleurs n'est pas vérifiée par moi (la capture de la fiche vidéo n'est pas dans ce tour).

## T2.1 Note : 9,0 / 10 (GO : rien de bloquant ni de majeur ; 4 mineurs et des preuves à compléter pour atteindre 10)

| Zone | Tour 1 | Tour 2 | Raison en une ligne |
|---|---|---|---|
| En-tête, toutes largeurs | 4,0 | 9,5 | Plus aucune coupe sur 12 captures (3 états x 1024, 1280, 1440 + recherche ouverte + menu de compte ouvert) ; seul manque : pas de mesure chiffrée ni de capture 1100, 1536, 1920. |
| Menu mobile | 6,5 | 9,5 | Hauteur bornée, défilement interne, « Connexion » atteignable à 375 x 550. |
| Page /abonnement | 8,0 | 9,0 | Bouton entier à 375 x 700 (597 à 645) ; plus de saut au changement de formule ; reste un trou de 60 px en mensuel et 18 px seulement en annuel sous le texte. |
| Boutons niveau 1 / niveau 2 | 6,5 | 9,5 | Une seule variante `outline-accent` partout où je la vois ; Premium plein reste dominant. |
| Formulaire de la lettre | 7,5 | 9,0 | Case sombre, bouton niveau 2, titre sur 2 lignes ; quiz non capturé. |
| Pages de statut et sous-pages /lettre | n/a | 8,0 | Bandeaux violets (anneau de focus) sur des messages d'erreur ; colonne et titre différents de /lettre. |
| Bloc d'accueil | 8,5 | 9,5 | 41 / 40 px (375) et 49 / 48 px (1280) mesurés : symétrique. |
| Pied de page | 8,0 | 9,5 | Lecture en colonnes, 6 / 5 propre à 375 et 1280. |

Grille des 10 critères (total 9,2 ramené à 9,0 : la preuve visuelle manque pour le quiz et 768) :

| # | Critère | Tour 1 | Tour 2 | Preuve |
|---|---|---|---|---|
| 1 | PRO | 0,8 | 0,95 | Plus de texte tronqué : `menu-1280-gratuit.png` (« Rechercher... » entier), `menu-1024-gratuit.png`. |
| 2 | BEAU | 0,8 | 0,9 | Case sombre `lettre-vide-375.png` ; menu de compte propre `menu-compte-ouvert-1024-gratuit.png`. |
| 3 | BRAND-ALIGNED | 0,8 | 0,95 | Violet plein = Premium seul ; bémol : violet fort sur les bandeaux d'erreur (N1). |
| 4 | MÊME IDENTITÉ | 0,7 | 0,9 | Un seul niveau 2 (bordure violette) partout ; sous-pages /lettre/confirmer et /desinscrire décalées (N2). |
| 5 | PROPRE | 0,6 | 0,9 | Plus de coupe, plus d'anneau résiduel sur « Annuel ». |
| 6 | ALIGNÉ | 0,7 | 0,85 | Bouton à 597,8 px en mensuel ET annuel (`mesures.json`) ; contenu /lettre à x = 320 contre x = 400 sur les sous-pages (N2). |
| 7 | AÉRÉ | 0,8 | 0,9 | Accueil symétrique ; lettre d'article 16 px sous Premium contre 56 px dessous (N4). |
| 8 | CONVERSION | 0,8 | 0,95 | Bouton Premium entier au premier écran 375 x 700, un seul plein par écran. |
| 9 | HIÉRARCHIE | 0,8 | 0,95 | Titre, prix, bouton ; la lettre pèse moins (bouton contour). |
| 10 | ACCESSIBLE | 0,7 | 0,95 | Menu mobile accessible en bas, bordure niveau 2 à environ 3,2:1, focus visibles, cibles 44 px. |

## T2.2 Défauts du tour 1 : verdict un par un

| Réf. | Verdict | Preuve et remarque |
|---|---|---|
| B1 En-tête écrasé / débordant | **Corrigé** | `menu-1280-gratuit.png` : recherche 176 px, « Rechercher... » entier, « Activer mon accès » + icône compte. `menu-1024-gratuit.png`, `menu-1024-visiteur.png` : loupe, 7 onglets, aucune coupe, marge droite 16 px. `menu-1024-recherche-ouverte.png` : panneau pleine largeur avec suggestions. `menu-compte-ouvert-1024-*` : menu Favoris / Mon profil / Déconnexion lisible, dans l'écran. Code : `account-menu.tsx` (Radix, items `min-h-11`), `header.tsx` (loupe `lg:flex xl:hidden`), test `header-budget.spec.ts` écrit (6 largeurs x 3 états). Réserve : le résultat du test n'est pas dans `mesures.json` (voir T2.4 point 3). |
| M1 Menu mobile sans hauteur max | **Corrigé** | `menu-mobile-ouvert-375x550.png` : le panneau tient dans l'écran, le bouton « Commencer » du bas est coupé, signe qu'il défile. Code : `max-h-[calc(100dvh-4rem-1px)] overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]`. Aucun défaut nouveau. |
| M2 Bouton /abonnement trop juste | **Corrigé** | `abonnement-mensuel-375x700.png` : bouton de 597 à 645 sur 700, soit 55 px de marge et deux lignes de réassurance déjà visibles ; sur 812, bouton + réassurance + début des avantages. |
| M3 Deux bordures de niveau 2 | **Corrigé** | Variante `outline-accent` (`button.tsx`), utilisée par `lettre-inscription.tsx`, `article-cta.tsx`, `lettre-bouton-action.tsx`. Captures : `article-bloc-lettre-1280.png` (étape 1 et lettre ont la même bordure), `lettre-vide-1280.png`, pages confirmer / désinscrire. `secondary` marqué `@deprecated`, règle écrite dans `design-system.md`. |
| M4 Case blanche native | **Corrigé** | `color-scheme: dark` sur `:root` (`globals.css`) : case grise sombre 24 px, violette cochée (`lettre-focus-confidentialite-375.png`). Texte d'erreur en `text-error-text` (#F87171) vérifié dans le code et sur `lettre-erreur-adresse-375.png`. Remarque de cohérence : le design system dit « Jamais de case native sur fond sombre » (rubrique Interrupteur) alors que la case de consentement reste native ; à reformuler (« case native en `color-scheme: dark` acceptée pour un consentement »). |
| m1 Anneau résiduel « Annuel » | **Corrigé** | `abonnement-annuel-375.png` et `-1280.png` : un seul contour (la sélection), pas de double anneau ; `has-[:focus-visible]` dans le code. |
| m2 Saut de mise en page | **Corrigé** | `mesures.json` : bouton à y = 597,83 en mensuel et en annuel (375) ; 626,59 aux deux états (1280). Mais voir N3 (trou et ligne serrée). |
| m3 Pastille « Mensuel » violet plein | **Corrigé** | Pastille active en `bg-accent-primary/20` + bordure violette : le seul violet plein du premier écran est le bouton d'achat. |
| m4 Pied de page en zigzag | **Corrigé** | `pied-de-page-1280.png` : colonne gauche Vannes à Blog (6), droite Glossaire à Nos offres (5). 375 : même lecture. `rangs-produit` calculé. |
| m5 Accueil asymétrique | **Corrigé** | `mesures.json` : 41 px au-dessus du titre et 40 px sous le lien (375), 49 et 48 (1280). |
| m6 Poids du bloc lettre (375) | **Corrigé** | `article-bloc-lettre-375.png` : bloc d'environ 450 px (470 avant), un paragraphe pour la mention, le bouton contour pèse nettement moins que le bloc Premium. Pas de nouveau défaut. |
| m7 Titre /lettre sur 3 lignes | **Corrigé** | `lettre-vide-375.png` : 2 lignes (« Une vanne décryptée, / chaque mois »). |
| m8 Quiz : espacement | **Corrigé dans le code, non prouvé visuellement** | `viral-quiz.tsx` : `div` sans `space-y-4`, `mt-6` de la lettre conservé. Aucune capture du quiz dans le tour 2 : impossible de valider le rendu. |
| Captures périmées (ancien titre) | **Corrigé** | `tour2/` ne contient que le nouveau rendu (titre « Ta réplique pendant la soirée... », bouton avant les avantages). |

## T2.3 Nouveaux défauts (tous mineurs, aucun bloquant)

**N1. Bandeaux de statut de /lettre : anneau violet de 2 px sur des messages d'erreur et de confirmation**
Preuves : `lettre-statut-erreur-375.png` (« Un souci de notre côté »), `lettre-statut-invalide-375.png` et `-1280.png` (« Ce lien ne marche plus »), `lettre-confirmee-1280.png`. Le bandeau reçoit le focus par script au chargement (`lettre-statut.tsx` ligne 25) et `focus-visible:ring-2 ring-accent-primary` s'affiche : un gros cadre violet entoure une erreur, ce qui se lit comme un encart Premium et non comme un message d'erreur. Le défaut vient du focus programmatique, pas d'un choix de design.
Correction (`components/lettre/lettre-statut.tsx` ligne 39) : retirer `focus-visible:ring-2 focus-visible:ring-accent-primary` et garder `focus:outline-none` (élément non interactif, `tabIndex={-1}`, annoncé par `role="status"`) ; la bordure reste `border-border`. Option si on veut un repère : `border-l-4 border-l-accent-primary` seulement pour `confirmee`, jamais pour invalide / erreur.

**N2. Sous-pages /lettre/confirmer et /lettre/desinscrire : colonne et titre différents de /lettre**
Preuves : `lettre-desinscrire-page-1280.png` (texte à x = 400, H1 24 px) contre `lettre-vide-1280.png` (x = 320, H1 30 px) ; à 375 le haut de page est 7 px plus bas (py-12 contre py-10).
Correction (`components/lettre/lettre-bouton-action.tsx` ligne 19-20) : `max-w-2xl px-4 py-10` au lieu de `max-w-lg px-4 py-12`, et H1 `text-balance font-display text-2xl font-bold text-text-primary sm:text-3xl` (mêmes classes que `lettre-page-inscription.tsx`). Le texte garde sa longueur de ligne en ajoutant `max-w-lg` au paragraphe seulement.

**N3. /abonnement : trou en mensuel, ligne serrée en annuel (375)**
Preuves : `abonnement-mensuel-375.png` (60 px vides entre « économisés par an » et le bouton) contre `abonnement-annuel-375.png` (18 px entre « résiliable depuis ton profil » et le bouton). À 1280 : 59 px contre 34 px. Le trou est le prix de la hauteur réservée (m2) ; il se lit comme de l'air devant le bouton (acceptable), mais les 18 px en annuel sont le seul endroit de la page où le texte colle au bouton.
Correction (`components/premium/abonnement-view.tsx` lignes 265 et 276) : `mt-4 sm:mt-8` devient `mt-5 sm:mt-8` (4 px de plus à 375 : bouton de 602 à 650, marge de 50 px à 375 x 700, toujours entier). Optionnel : réserver le trou plus petit en laissant `grid` mais en passant `mt-1` des deux paragraphes annuels à `mt-0.5`.

**N4. Article : la lettre est collée au bloc Premium et loin de la suite**
Preuves : `article-bloc-lettre-375.png` (filet à 17 px sous la carte Premium, 56 px entre « Confidentialité » et le filet suivant), `article-bloc-lettre-1280.png` (16 px contre 56 px). Le bloc se lit comme un appendice de la carte au lieu d'une section propre.
Correction (`components/blog/blog-article-view.tsx` ligne 57) : `className="mt-4 border-t border-border pt-4"` devient `className="mt-8 border-t border-border pt-6"` (écart de 32 px au-dessus, 24 px sous le filet).

**Observations sans action requise** : (a) en 1280 et 1440, la navigation se décale de 61 px entre visiteur (début x = 259) et Premium (x = 320) car la barre est en `justify-between` : toléré, pas de saut visible dans un même état ; (b) menu de compte et loupe en icône seule avec `aria-label` et `title` : acceptable en front public (la règle « labels > icônes » vise les back-offices) ; (c) le lien « Confidentialité » du formulaire est cerclé de blanc au focus alors que le reste est violet : cohérent avec l'intention (lisible sur texte gris), non bloquant ; (d) `shadow-xl` du menu de compte : en mode sombre uniquement, le contour `border-border` suffit, l'ombre est invisible.

## T2.4 Ce qui manque exactement pour 10 / 10

1. **N1** : `components/lettre/lettre-statut.tsx` ligne 39, retirer l'anneau violet de focus (voir T2.3).
2. **N2** : `components/lettre/lettre-bouton-action.tsx`, aligner colonne (`max-w-2xl`, `py-10`) et H1 (`text-balance sm:text-3xl`) sur /lettre.
3. **N3** : `components/premium/abonnement-view.tsx` lignes 265 et 276, `mt-5 sm:mt-8` ; **N4** : `components/blog/blog-article-view.tsx` ligne 57, `mt-8 border-t border-border pt-6`.
4. **Preuves manquantes** (je ne peux pas valider ce que je ne vois pas) : résultat du quiz avec le bloc lettre à 375 et 1280, premier passage et « revient sur le quiz » (m8) ; une capture à 768 (barre mobile, `/abonnement`, `/lettre`, accueil) ; `/abonnement` à 320 x 568 ; en-tête à 1100, 1536 et 1920 dans les 3 états ; menu mobile ouvert en connecté sans abonnement et en Premium (375 x 550) ; focus clavier du sélecteur Mensuel / Annuel ; fiche vidéo du parcours à 375 (étape 1 en `outline-accent` vérifiée seulement par le code).
5. **Chiffres** : consigner dans `mesures.json` (ou la sortie du test) le résultat réel de `header-budget.spec.ts` (largeur recherche, marge droite par largeur et par état). Sans cette ligne verte, « aucun débordement » repose sur 12 captures, pas sur les 18 combinaisons du garde-fou.
6. **Capture** : les captures de pied de page en pleine hauteur à 375 (`pied-de-page-375.png`) montrent l'en-tête sticky au milieu de l'image (il cache le titre « PRODUIT ») ; prendre le pied de page en capture d'élément.
7. **Doc** : `design-system.md`, rubrique Interrupteur, nuancer « Jamais de case native » (la case de consentement l'est, en `color-scheme: dark`).

Les points 1 à 3 sont des changements de classes Tailwind (aucun texte, aucun jeton nouveau), 5 minutes de développement. Avec 1 à 4 faits et les preuves du point 4 fournies sans nouveau défaut, la note passe à 10 / 10.

---
**Handoff Tour 2 → @orchestrator (puis @fullstack, @qa)**
- Fichier : `/home/user/Marrant/docs/design/revue-integration-s21.md` (section « Tour 2 ») ; NOTE 9,0 / 10, GO : B1, M1 à M4 et m1 à m8 corrigés (m8 seulement vérifié dans le code).
- 4 mineurs à corriger (classes seulement) : N1 anneau violet sur les bandeaux de statut (`lettre-statut.tsx`), N2 sous-pages /lettre décalées (`lettre-bouton-action.tsx`), N3 `mt-5` bouton /abonnement, N4 `mt-8 pt-6` lettre d'article.
- Preuves manquantes pour 10 : quiz, 768, 320 /abonnement, en-tête 1100 / 1536 / 1920, menu mobile connecté, résultat chiffré de `header-budget`.
---

