# Relecture UX à l'aveugle s25 v6 tour 1 : Favoris et Profil

Périmètre : `/favoris` (aperçu visiteur et gratuit ; états vide et rempli abonné), `/profil` (gratuit, en cours, nouvel). Captures `docs/captures/s25/v6-tour-1/{favoris,profil}/` (toutes ouvertes pour 375, 768, 1280, 1456, 1920 sauf 1456 et 1920 de certains comptes jugés identiques à 1280 par le plafond `max-w-7xl`). Code : `favoris/page.tsx`, `profil/page.tsx`, `rappel-parcours-toggle.tsx`, `components/profil/*`, `components/favoris/favoris-list.tsx`, `components/espace/apercu/*`.

Limite : aucune capture à 290 ni 320 px n'existe dans les dossiers. Le débordement connu est donc analysé dans le code (section Profil), non constaté sur image.

## FAVORIS

### Notes

| Critère | Note |
|---|---|
| D1 fidélité à l'accueil | 8 |
| D2 hiérarchie, lisibilité | 8 |
| D3 mise en page aux 5 largeurs | 6 |
| D4 cohérence avec l'espace | 7 |
| D5 finition | 8 |
| U1 compréhension | 8 |
| U2 action principale unique | 9 |
| U3 états vides, nouvel abonné | 8 |
| U4 aperçu Premium | 5 |
| U5 accessibilité, cohérence comptes | 8 |
| **Globale (minimum)** | **5/10** |

### Défauts

**F1 (faute dure, U4 et D3) : l'aperçu n'montre pas de favori, il montre un état vide.**
Captures `visiteur-favoris-1280.png`, `gratuit-favoris-375.png` : sous le sous-titre « Voici un exemple de cette rubrique. Elle est ouverte avec Premium. », la carte dit « Aucun favori pour l'instant ». La promesse (« un exemple ») est contredite par le contenu : le non-abonné voit une page vide, pas la valeur. La spec v6 §2 demande 1 à 3 éléments réels, lisibles. Correction codable : `apps/web/src/components/espace/apercu/exemple.tsx` (`ExempleFavoris`) : afficher 2 ou 3 cartes de favoris réelles, les mêmes que celles de l'abonné (badge Vanne + catégorie, texte de la vanne, « Clique pour la chute », ou un conseil), prises dans des fiches déjà publiées (aucun texte inventé ; choix des fiches à valider par Thomas), sans bouton « Retirer » ni partage actifs ; l'offre reste sous la carte. Ce qui fait 10 : un visiteur comprend en 3 secondes « mes vannes sauvegardées, ici » avec un vrai exemple.

**F2 (faute dure, D3) : vide à droite à 1280, 1456 et 1920 dans l'aperçu.**
`visiteur-favoris-1280.png` : carte large de 768 px sur 1216 (`max-w-3xl` dans `apercu-rubrique.tsx`, ligne de l'`<article>`), 448 px vides à droite ; à 1920 : carte de 768 sur 1216, 448 vides aussi. Le critère « aucun vide à droite à 1280+ » n'est pas tenu. Correction : dans `apercu-rubrique.tsx`, passer l'`<article>` en `lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-6` avec l'exemple à gauche et le bloc d'offre (`data-apercu-offre`, sans `border-t`) dans une colonne droite alignée en haut ; en dessous de 1024 px, l'empilement actuel (exemple puis offre). Alternative : 3 cartes d'exemple en grille `lg:grid-cols-3` pleine largeur, offre dessous (cela règle F1 et F2 d'un coup pour Favoris). Ce qui fait 10 : aucune zone morte à 1280+ et un seul bouton plein.

**F3 (faute dure, D3) : trou sous la première carte à 768, compte abonné avec favoris.**
`en-cours-favoris-768.png` : vanne 1 à gauche (hauteur 170 px), conseil déplié à droite (430 px), vanne 3 en pleine largeur dessous : environ 260 px vides sous la vanne 1. La cause est `dernierCourtSeul` + `md:col-span-2` (`favoris-list.tsx`, constante `seulSurSaRangee`) combiné à `items-start`. Correction : espace ouvert, remplacer la grille par des colonnes CSS `md:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid` pour vannes et conseils (la vidéo reste dans une grille à part pleine largeur), ou supprimer le `col-span-2` du dernier élément impair et laisser une demi-rangée. À 1280 et 1920 (3 colonnes, `en-cours-favoris-1280.png`) les colonnes 1 et 3 sont aussi courtes sous le conseil déplié : même correction. Ce qui fait 10 : colonnes remplies sans trous visibles.

**F4 (piste, U3 et D1) : l'état « nouvel abonné » ne parle pas la langue de l'aperçu.**
`nouvel-favoris-1280.png` : carte plate sans filet violet, emoji étoile jaune, bouton « Explorer les vannes » petit, centré, alors que l'aperçu a un filet dégradé et un bouton plein aligné à gauche. L'étoile emoji (et 😅, 🎓, 🎬 dans les onglets) va contre « zéro emoji » du doc nav v6 §5 pour les libellés. Correction : `favoris-list.tsx` (`TABS[].emptyEmoji` et la `Card` vide) : remplacer l'emoji par une pastille ronde `rounded-full bg-accent-primary/10` avec une icône trait existante, ajouter à la carte le filet `absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover` et `relative overflow-hidden rounded-xl`. Le bouton garde « Explorer les vannes » (libellé existant, non réécrit). Ne retient pas la note à elle seule : l'emoji est ancien et l'état n'est pas une page morte (un seul bouton clair, onglets visibles).

**F5 (piste, D4) : titre « Favoris » (aperçu) contre « Mes favoris » (abonné).**
`gratuit-favoris-1280.png` contre `en-cours-favoris-1280.png`. Les deux libellés viennent de textes validés (`TEXTES_APERCU.titres`, `page.tsx`) : à signaler à Thomas, non retouché. La bande, elle, dit « Favoris » pour tous : cohérente.

**F6 (piste, D5) : hors périmètre, à passer au groupe bande.** À 1280, 1456 et 1920, visiteur et gratuit : « Carnet » est coupé par un fondu (`Carnet` à demi lisible) dans la bande, alors que la spec v6 §1 promet « aucune rubrique tronquée » et 80 px libres. Le fondu droit est actif sans besoin de défilement.

### Ce qui est conforme
- Un seul bouton plein (« Premium · 1,99 €/mois », prix de la config) dans l'aperçu ; « Connexion » seulement pour le visiteur ; aucun mur ni fenêtre. Une seule offre.
- Chip « Favoris » allumé avec cadenas pour visiteur et gratuit, sans cadenas pour l'abonné : cohérent entre comptes.
- Titres et sous-titres à la même hauteur que les autres rubriques (H1 à y=174 à 1280), pas d'espace réservé inutile.
- États abonné : onglets avec compteurs, cartes à la hauteur de leur contenu, boutons « Retirer » et partage visibles, `Retirer` a un `aria-label`, cartes focalisables au clavier (Entrée, Espace) avec anneau de focus.
- Aucun débordement horizontal visible à 375 et 768.

## PROFIL

### Notes

| Critère | Note |
|---|---|
| D1 fidélité à l'accueil | 7 |
| D2 hiérarchie, lisibilité | 7 |
| D3 mise en page aux 5 largeurs | 6 |
| D4 cohérence avec l'espace | 6 |
| D5 finition | 7 |
| U1 compréhension | 8 |
| U2 action principale unique | 8 |
| U3 états vides, nouvel abonné | 9 |
| U4 aperçu Premium (compte gratuit) | 8 |
| U5 accessibilité, cohérence comptes | 6 |
| **Globale (minimum)** | **6/10** |

### Défauts

**P1 (faute dure, U5 et gestion) : aucune action de gestion visible dans la carte Abonnement du compte « en cours » et du « nouvel ».**
`en-cours-profil-1280.png`, `nouvel-profil-375.png` : la carte Abonnement n'affiche que la phrase, « Formule mensuelle » et le lien discret « Renoncer au contrat ici ». Aucun « Gérer mon abonnement », « Changer de formule », « Résilier », ni échéance (« prochain prélèvement »), alors que la carte Supprimer, plus bas, parle de « jusqu'au 25 novembre 2026 ». Dans `abonnement-card.tsx`, ces boutons n'existent que si `etat` vaut `actif` ou `resilie` (`summary.hasPortal`) ; `premium-hors-stripe` (cas des comptes de test) tombe sans bouton. Soit les captures utilisent un compte sans portail et ne prouvent pas l'état réel, soit un vrai abonné de ce type est en cul-de-sac (résiliation en ligne facile obligatoire, L.215-1-1). Correction : (a) recapturer en-cours et nouvel avec `hasPortal: true` pour prouver l'état normal ; (b) dans `abonnement-card.tsx`, pour `premium-hors-stripe`, afficher au moins le bouton `boutonResilier()` vers `RESILIATION_HREF` quand `RESILIATION_PAGE_OUVERTE` (le parcours /resiliation ne dépend pas de Stripe) ; toute phrase nouvelle : à valider par Thomas. Ce qui fait 10 : l'abonné voit toujours Gérer et Résilier, ou la carte dit où aller.

**P2 (faute dure, D4 et D3) : le H1 du profil est plus bas que celui des autres rubriques.**
`gratuit-profil-1280.png` : H1 à y=210 contre y=174 dans `en-cours-favoris-1280.png`, soit 36 px de plus (même écart à 375 : y=152 contre 168 en pixels des captures respectives, décalage net). Cause : `profil/page.tsx` rend `<div aria-hidden className={PLACE_REPERE} />` quand `ESPACE_CLIENT_PUBLIE`, alors que la bande est désormais le repère (le commentaire de `favoris/page.tsx` le dit : « plus de place du repère »). Correction : supprimer la ligne `{ESPACE_CLIENT_PUBLIE && <div aria-hidden="true" className={PLACE_REPERE} />}` et l'import `PLACE_REPERE` dans `profil/page.tsx`. Ce qui fait 10 : le titre saute de la bande à la même hauteur partout.

**P3 (faute dure, D3) : débordement horizontal à 290 et 320 px (code, non constaté sur image).**
Candidat principal : dans `profil-dashboard.tsx`, la ligne de chaque parcours (`<div className="flex items-center justify-between mb-2">` avec titre + « 2/3 étapes ») n'a ni `gap`, ni `flex-wrap`, ni `min-w-0` : « Parcours Machine à Café » (environ 150 px) + « 2/3 étapes » (environ 70 px) dépassent la largeur utile d'environ 176 px à 290 px. Correction : `flex flex-wrap items-center justify-between gap-x-3 gap-y-1`, et sur le bloc titre `min-w-0` avec `[overflow-wrap:anywhere]`. Autres à vérifier à 290 : ligne « Ta série… » + « Tu te lances · cap 2 sur 5 » + 5 points de `cap-profil.tsx` (ajouter `flex-wrap`), bouton S'abonner (déjà `whitespace-normal`, ok), formulaire prénom (empilé sous `sm`, ok), le sélecteur de jour (`flex-wrap`, ok). Ce qui fait 10 : `scrollWidth === clientWidth` à 290 et 320 sur les 3 comptes, preuve par capture.

**P4 (piste retenant D2) : lignes de texte trop longues et cartes à contenu mince à 1280 et plus.**
`en-cours-profil-1280.png` : le texte de Supprimer mon compte et l'encadré ambre courent sur environ 1100 px (plus de 130 caractères par ligne), les 4 statistiques sont éparpillées sur 1180 px, les cartes Rappel, Lettre et Ligne « Ta question » ont une moitié droite vide. Correction : dans `profil-dashboard.tsx`, passer les cartes de réglages (Rappel, Abonnement, Lettre, Prénom, Supprimer) en grille `lg:grid-cols-2` (réglages sur 2 colonnes), garder « Reprendre », « Ton cap », Statistiques, Mes parcours pleine largeur ; ou borner les paragraphes avec `max-w-prose`. Ce qui fait 10 : lignes de 60 à 80 caractères et pas de moitié de carte vide.

**P5 (piste, D5) : la ligne « Ta question à l'équipe : écris-la dans Mes questions » est mal centrée.**
`en-cours-profil-1280.png` : carte de 70 px, texte décalé vers le haut (31 px au-dessus, 36 px au-dessous) mais collé au niveau du centre visuel ; ressemble à une carte vide. Correction : `components/espace/profil/ligne-mes-questions.tsx` : une seule ligne `flex min-h-11 items-center` avec le même padding que les autres cartes ; envisager de la fusionner dans la carte Abonnement ou de la placer avant Supprimer.

**P6 (piste, D5) : mention de réassurance centrée sous un bouton aligné à gauche (compte gratuit).**
`gratuit-profil-1280.png` : « Premium : premier paiement remboursable sous 14 jours… » est centrée au milieu de la carte alors que la phrase et le bouton sont à gauche. Correction : `components/ui/reassurance.tsx` ou son appel dans `abonnement-card.tsx` : `text-left sm:text-left` (aligner à gauche dans cette carte). À 375 le centrage sous un bouton pleine largeur est acceptable.

**P7 (piste, D1) : aucune carte du profil n'a le filet dégradé violet de l'étalon.**
Toutes les captures de profil : cartes grises plates, hiérarchie portée seulement par les titres. L'aperçu Favoris a le filet, le profil non. Correction : `components/ui/card.tsx` option, ou classe locale sur « Reprendre ton parcours » et « Abonnement » seulement (les deux cartes d'action) : filet `h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover`. Sous-titre du profil (« Ta progression, tes stats, ton parcours vers la légende ») : pour le compte gratuit, il annonce une progression que la page ne montre pas (cartes Prochaine étape et Abonnement). Texte validé : signalé, non réécrit.

**P8 (piste, U5) : petits textes de réglage et de légal.**
Le bloc de consentement de la lettre (`en-cours-profil-1280.png`) est en `text-xs text-text-muted`, environ 12 px sur 6 lignes, et « Renoncer au contrat ici » en `text-xs text-text-muted`. Vérifier le contraste de `text-muted` sur `bg-background-card` (≥ 4,5:1 requis pour du texte de 12 px) ; je n'ai pas pu le mesurer. Ordre des cartes en-cours : Reprendre, Cap, Stats, Parcours (progression) puis Rappel, Abonnement, Question, Lettre, Prénom, Supprimer (réglages), sans séparateur entre progression et réglages : un titre de section discret « Réglages » (texte nouveau, à valider par Thomas) aiderait le repérage.

### Ce qui est conforme
- Compte gratuit : une seule offre (« S'abonner · 1,99 €/mois »), un seul bouton plein, pas de mur ; Prochaine étape et Prénom accessibles.
- Nouvel abonné : « Mes parcours » vide avec « Découvrir les parcours », cap et statistiques à zéro lisibles, aucune page morte.
- Interrupteur du rappel : `role="switch"`, cible 44 px, focus visible, sélecteur désactivé tant que le rappel est éteint, message `aria-live`.
- Carte Supprimer : consigne claire, encadré ambre sur la période payée, lien de rétractation présent, action destructive en rouge, pas en bouton plein.
- Aucun débordement visible à 375 et 768 sur les 3 comptes.

## Synthèse

NOTE GLOBALE : 5/10 (Favoris 5/10, Profil 6/10)

Fautes dures :
1. Aperçu Favoris : un état vide au lieu d'un exemple réel (`apps/web/src/components/espace/apercu/exemple.tsx`, `ExempleFavoris`).
2. Aperçu : vide de 448 px à droite à 1280, 1456 et 1920, carte plafonnée à `max-w-3xl` (`apps/web/src/components/espace/apercu/apercu-rubrique.tsx`).
3. Favoris abonné : trou d'environ 260 px sous la première carte à 768 (et colonnes inégales à 1280+) (`apps/web/src/components/favoris/favoris-list.tsx`).
4. Profil : carte Abonnement sans Gérer, Résilier ni échéance pour les comptes en cours et nouvel (`apps/web/src/components/profil/abonnement-card.tsx`, avec recapture à `hasPortal: true`).
5. Profil : H1 décalé de 36 px par `PLACE_REPERE` (`apps/web/src/app/(dashboard)/profil/page.tsx`).
6. Profil : débordement horizontal probable à 290 et 320 px, ligne des parcours sans wrap (`apps/web/src/components/profil/profil-dashboard.tsx`, aussi `apps/web/src/components/espace/cap-profil.tsx`).
