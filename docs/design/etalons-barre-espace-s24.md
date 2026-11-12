# Étalons de la barre de rubriques, espace client Premium (s24, Q2)

> Auteur : @design, 12/11/2026. Prépare Q2 (nom de l'espace et des rubriques). Décisions déjà prises par Thomas, non re-questionnables : Q3 = A (barre sous l'en-tête), Q11 = A (barre aussi sur les pages publiques, pour l'abonné seulement), Q1 (écrans neufs sous `/mon-espace`, `/profil` = réglages, « Mon profil » reste visible).
> Étalons rendus : `docs/espace-client/etalons/barre/variante-a.html`, `variante-b.html`, `variante-c.html` (locaux, jamais déployés, tokens réels de `tailwind.config.ts`, thème sombre natif). Captures 320, 375 et 1280 px à faire par la session principale, puis relecture @design (critères 1 à 10 : aucun verdict visuel n'est posé ici, preuve visuelle absente).
> Aucune capture n'a été vue. Les largeurs de libellés ci-dessous sont des ESTIMATIONS (Inter 14 px, `font-medium`) à vérifier sur les captures.

## 1. Ce qui est identique dans les 3 variantes (le socle)

### 1.1 Constat franc
Les 5 rubriques visibles (Aujourd'hui, Parcours, Vannes, Conseils, Vidéos) sont déjà courtes et identiques dans A, B et C. Ce que Q2 décide réellement : (1) le nom de la porte d'entrée dans le menu de compte, (2) les libellés du menu « Plus », (3) le risque de confusion avec « Carnet » et « Mon profil ». La barre visible ne change pas d'une variante à l'autre.

### 1.2 Ordre des 6 entrées et arbitrage par fréquence d'usage
Ordre commun : **Aujourd'hui, Parcours, Vannes, Conseils, Vidéos, Plus**. « Plus » est épinglé à droite et reste visible sans défiler.

Écart avec la proposition du brief (§3.1 : Aujourd'hui, Parcours, Carnet, Favoris et notes, Écrire à l'équipe, Plus, avec Vannes, Conseils, Vidéos dans « Plus ») : je remonte Vannes, Conseils, Vidéos et je descends Carnet, Favoris et notes, Écrire à l'équipe dans « Plus ». Raisons :

| Rubrique | Usage attendu [HYPOTHÈSE : aucune mesure d'usage avant le lot 0] | Où | Raison |
|---|---|---|---|
| Aujourd'hui | quotidien | visible, 1re | porte de l'espace, premier pas, série |
| Parcours | plusieurs fois par semaine | visible, 2e | cœur de la valeur Premium, rythme d'une étape par semaine |
| Vannes | plusieurs fois par semaine (290+ fiches, le besoin de Sophie et Yanis : « ressortir une vanne ») | visible, 3e | plus gros catalogue |
| Conseils | hebdomadaire | visible, 4e | 1 tap aujourd'hui, ne pas dégrader |
| Vidéos | hebdomadaire | visible, 5e | 1 tap aujourd'hui, ne pas dégrader |
| Carnet | mensuel (nouveau mois, 15 puis 30 fiches) | Plus | Le bloc « Nouveautés » d'Aujourd'hui (brief §3.2, bloc 5) le met déjà en avant ; régression : 1 tap devient 2 |
| Favoris | irrégulier | Plus | 2 taps aujourd'hui (menu de compte), donc aucune régression |
| Mes notes | irrégulier, rubrique neuve | Plus | idem |
| Écrire à l'équipe | rare (garde-fou de charge du brief §3.7) | Plus | la rendre rare est voulu ; un raccourci dans Aujourd'hui reste à décider au lot 1 |
| Vocabulaire, Quiz, La lettre, Articles | rare | Plus | lettre reçue par e-mail, blog = SEO public |

Principe appliqué : ce qui est à 1 tap aujourd'hui dans l'en-tête de l'abonné (Vannes, Conseils, Vidéos, Parcours) reste à 1 tap. Régressions assumées : Carnet et Articles passent de 1 à 2 taps. Une mesure d'usage (lot 0) peut renverser l'ordre : Carnet remplacerait Vidéos si le carnet est plus ouvert.

### 1.3 Contenu du menu « Plus » (même ordre partout, 8 entrées, libellés selon variante)
Carnet, Favoris, Mes notes, Écrire à l'équipe, Vocabulaire, Quiz d'humour, La lettre, Articles.
Écart avec le brief : **« Mon compte » n'est pas dans « Plus »**. Ses contenus (abonnement, prénom, rappel, suppression) vivent à `/profil`, déjà atteint par « Mon profil » du menu de compte ; deux entrées pour la même page enfreignent « aucune rubrique deux fois ». « Ma progression » n'a pas d'entrée propre : atteinte par « Parcours » et par le bloc Progression d'Aujourd'hui, et `/mon-espace/progression` marque « Parcours » comme actif.

### 1.4 Doublons à connaître
- Le menu de compte contient « [nom de l'espace] » ET la barre contient « Aujourd'hui » : même destination (`/mon-espace`), libellés différents (l'un nomme le lieu, l'autre l'écran). Menu fermé par défaut ; à accepter ou à trancher par Thomas.
- « Favoris » quitte le menu de compte de l'abonné (il est dans « Plus »). Le menu du compte sans abonnement reste « Favoris, Mon profil, Déconnexion ».

## 2. Les 3 variantes

| | A. Mon espace | B. Mon carnet de bord | C. Mon compte |
|---|---|---|---|
| Menu de compte (3 entrées, dans l'ordre) | Mon espace, Mon profil, Déconnexion | Mon carnet de bord, Mon profil, Déconnexion | Mon compte, Mon profil, Déconnexion |
| 6 entrées (ordre) | Aujourd'hui, Parcours, Vannes, Conseils, Vidéos, Plus | identique | identique |
| Plus (8) | Carnet, Favoris, Mes notes, Écrire à l'équipe, Vocabulaire, Quiz d'humour, La lettre, Articles | identique à A | Carnet, Favoris, Notes, Équipe, Glossaire, Quiz, Lettre, Articles |
| `aria-label` de la barre | Rubriques de l'espace | Rubriques du carnet de bord | Rubriques du compte |
| Actif d'exemple dans l'étalon | Vannes (page `/vannes`) ; états `#plus`, `#compte`, `#actif=/carnet` | idem | idem |

### 2.1 Variante A : « Mon espace »
- Conflits : peu. « Espace » est clair, neutre, sans écho avec « Carnet » ni « Profil ». Banal, mais sans piège. Léger voisinage « Mon espace » / « Mon profil » dans le même menu : l'un = ce que je fais, l'autre = mes réglages ; lisible parce que « Mon profil » ne change pas (15 textes validés).
- Cohérence avec Q1 : l'adresse `/mon-espace` porte le même mot.

### 2.2 Variante B : « Mon carnet de bord » (ton maison)
- Conflit de vocabulaire FRANC : « carnet de bord » contre la rubrique « Carnet » (carnet mensuel Premium, contenu fait par l'équipe). Un abonné qui lit « Mon carnet de bord » puis voit « Carnet » dans « Plus » ne sait plus lequel est le sien. Il y a aussi « Mes notes » (personnel) qui ressemble à un carnet. Le nom promet un journal personnel alors que l'espace contient surtout le catalogue.
- Atténuation possible (hors mandat, à valider par Thomas) : renommer la rubrique « Carnet du mois » (14 caractères, tient dans « Plus »), à coordonner avec les textes qui disent « le carnet » [À VÉRIFIER au lot 0]. L'étalon B reste fidèle au brief (« Carnet ») pour montrer le conflit tel quel.
- Ton : le plus chaleureux, mais 18 caractères dans un menu étroit, et l'adresse `/mon-espace` ne porte pas le mot.

### 2.3 Variante C : « Mon compte » + rubriques courtes
- Conflit de vocabulaire GRAVE : « Mon compte » et « Mon profil » côte à côte dans un menu de 3 lignes, deux synonymes pour deux pages différentes. Dans le web, « Mon compte » veut dire réglages et facturation : l'abonné cherchera à résilier ici, alors que les textes validés disent « Résiliable depuis ton profil ». Risque sur l'accès à la résiliation en 1 clic (obligation légale, jamais à dégrader). Renommer « Mon profil » est exclu (§2.2 du brief).
- Les « rubriques courtes » ne raccourcissent rien de visible (les 5 libellés sont déjà courts). Dans « Plus », seuls changent : Notes, Équipe, Glossaire, Quiz, Lettre. « Équipe » seul est ambigu (à propos de l'équipe ?) et abandonne le vocabulaire validé « Écrire à l'équipe » ; « Glossaire » suit l'adresse `/glossaire` mais perd « Vocabulaire ».

## 3. Reco

**A : « Mon espace ».** Pour l'abonné : un mot simple qui dit « c'est chez moi » sans le confondre avec le Carnet du mois ni avec ses réglages de compte.
Si Thomas tient au ton maison : B seulement avec la rubrique renommée « Carnet du mois ». C : déconseillée (risque sur la résiliation).

## 4. Classes Tailwind exactes (identiques A, B, C ; seuls les libellés changent)

Tokens existants uniquement, aucune couleur en dur, aucune ombre (séparation par `border`).

### 4.1 En-tête de l'abonné (modifications de `header.tsx`)
- `<header>` inchangé : `sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md`. Rangée : `mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 min-[360px]:px-4 sm:gap-4 md:px-6 xl:px-8`.
- Abonné : le `<nav aria-label="Navigation principale">` n'est plus rendu ; « Accueil » = le logo (inchangé). Les blocs de droite sont regroupés dans `<div className="ml-auto flex items-center gap-1 xl:gap-3">` : champ de recherche (`hidden w-44 shrink-0 xl:block`), loupe (`hidden h-11 w-11 ... min-[440px]:flex xl:hidden`, mêmes classes qu'aujourd'hui), puis le menu de compte à TOUTES les largeurs.
- Mobile abonné : le burger « Menu » n'a plus de raison d'être (ses onglets sont dans la barre, ses 3 liens dans le menu de compte). Il est remplacé par le menu de compte (`h-11 w-11`). `MobileNav` reste pour visiteur et compte sans abonnement, sa hauteur max `max-h-[calc(100dvh-4rem-1px)]` n'est pas touchée.
- Cloche (plus tard, Q6) : bouton `h-11 w-11`, à gauche du menu de compte, dans le même groupe. Place prévue, rien affiché maintenant.

### 4.2 Menu de compte de l'abonné (`account-menu.tsx`)
Contenu et classes inchangés (`ITEM` : `flex min-h-11 w-full cursor-pointer select-none items-center gap-3 rounded-md px-3 text-sm font-medium text-text-secondary outline-none transition-colors data-[highlighted]:bg-background-elevated data-[highlighted]:text-text-primary` ; panneau `z-[60] min-w-[12rem] rounded-lg border border-border bg-background-card p-1 shadow-xl animate-fade-in`). Entrées abonné : [nom de l'espace], Mon profil, séparateur, Déconnexion. Compte sans abonnement : Favoris, Mon profil, Déconnexion (inchangé). Le menu doit donc connaître `isPremium`. Icône de la nouvelle entrée : à ajouter dans `header-icons.tsx` (`IconeEspace`, décorative `aria-hidden`) ou aucune icône ; le libellé texte porte le sens.

### 4.3 Barre de rubriques (composant neuf, un seul, sous `<Header />`)
Fichier suggéré : `components/layout/espace-nav.tsx` (rendu côté navigateur, session Premium seulement ; HTML serveur = visiteur).

| Élément | Classes |
|---|---|
| Conteneur | `sticky top-16 z-40 border-b border-border bg-background pt-px` (le `pt-px` absorbe le pixel de la bordure de l'en-tête : empilement 65 + 46 = 111 px, sous le plafond de 112 px) |
| `<nav>` | `aria-label="Rubriques de l'espace"` ; `mx-auto flex h-11 max-w-7xl items-stretch px-3 min-[360px]:px-4 md:px-6 xl:px-8` |
| Zone défilante (enveloppe) | `relative -ml-3 min-w-0 flex-1 lg:flex-none` (le `-ml-3` aligne le texte de la 1re entrée sur le logo) |
| Zone défilante (liste) | `flex h-11 snap-x snap-proximity items-stretch overflow-x-auto overscroll-x-contain scroll-px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden` (`scroll-px-8` : le focus clavier ne se range jamais sous le fondu ; propriétés natives Tailwind, aucune CSS ajoutée) |
| Entrée (commun) | `relative flex h-11 shrink-0 snap-start items-center whitespace-nowrap px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary` |
| Entrée inactive | `text-text-secondary hover:text-text-primary` |
| Entrée active | `text-text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-accent-primary` + `aria-current="page"` |
| Fondu de bord droit | `pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent transition-opacity lg:hidden` (`opacity-0` en fin de défilement), `aria-hidden="true"` |
| Fondu de bord gauche | idem, `left-0`, `bg-gradient-to-r`, `opacity-0` tant qu'on n'a pas défilé |
| Plus : enveloppe | `relative shrink-0` |
| Plus : bouton | `relative flex h-11 items-center gap-1 border-l border-border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary lg:border-l-0` + `aria-expanded`, `aria-haspopup="menu"`, `aria-controls` ; libellé texte « Plus » + chevron décoratif `h-4 w-4` `aria-hidden` ; mêmes états actif/inactif que l'entrée ; actif si la page courante est dans « Plus » : `aria-current="true"` sur le bouton, `aria-current="page"` sur l'entrée du panneau |
| Plus : panneau | mêmes classes que le panneau du menu de compte (`z-[60] min-w-[12rem] rounded-lg border border-border bg-background-card p-1 shadow-xl animate-fade-in`) plus `max-h-[calc(100dvh-8rem)] overflow-y-auto`, `align="end"`, rendu hors de la zone défilante (Radix `Portal`) ; entrées : classe `ITEM` du menu de compte, entrée active : `bg-background-elevated text-text-primary` + `aria-current="page"` |

Choix du « Plus » en menu ancré et non en bottom sheet : c'est une liste de 8 liens (pas un modal), même mécanique Radix que le menu de compte, clavier et Échap fournis ; le pattern bottom sheet reste réservé aux modals et à la cloche.

### 4.4 Comportement
- Téléphone : barre 44 px, défilement horizontal au doigt avec `snap-x`, fondu à droite (puis à gauche après défilement), « Plus » épinglé à droite donc toujours visible ; au chargement, la rubrique active est ramenée dans la vue (centrée) ; ordre de tabulation = ordre visuel.
- Estimations à 375 px (marges 16) : 5 entrées = environ 400 px, zone défilante environ 270 px, « Plus » environ 72 px : on voit Aujourd'hui, Parcours, Vannes entières et un bout de Conseils (indice de défilement). À 320 px (marges 12) : environ 224 px, Aujourd'hui et Parcours entières + un bout de Vannes. À mesurer.
- Ordinateur (lg et plus) : pas de fondu, pas de défilement, les 5 entrées puis « Plus » collés à gauche sur la largeur `max-w-7xl` du contenu, mêmes marges que l'en-tête.
- Empilement : en-tête 65 px + barre 46 px = 111 px à toutes les largeurs (plafond 112 px). Ancres : `scroll-pt-28` (112 px) sur `<html>` quand la barre est présente (critère 17).
- Aucun émoji, aucune icône seule, libellés 14 px, cibles de 44 px de haut, focus visible (anneau inversé `ring-inset` car la zone défilante coupe ce qui dépasse), `prefers-reduced-motion` déjà géré globalement.
- Contrastes (valeurs des tokens) : `text-secondary` #B3B3B3 et `text-primary` #FFFFFF sur #0D0D0D largement AA ; soulignement `accent-primary` #8B5CF6 sur #0D0D0D environ 4,6:1 (indicateur non textuel, seuil 3:1) ; l'actif est signalé par la forme (soulignement 2 px) en plus du texte blanc.

## 5. Points de vigilance
1. **Décalage de mise en page à l'hydratation** : `isPremium` n'est connu qu'après chargement de la session, donc 46 px apparaissent sous l'en-tête pour l'abonné sur les pages publiques (le visiteur n'a rien). L'en-tête fait déjà un saut du même genre (changement d'onglets). @fullstack et @qa : mesurer le CLS sur `/vannes` abonné ; réserver l'espace est impossible sans pénaliser le visiteur.
2. Décision de menu : « Favoris » quitte le menu de compte de l'abonné, « Mon compte » ne figure pas dans « Plus » (§1.3, §1.4). À annoncer à Thomas.
3. « Aujourd'hui » et « [Mon espace] » mènent au même écran (§1.4).
4. Les largeurs ci-dessus sont des estimations ; les captures 320, 375, 1280 px tranchent (libellé coupé = FAIL).
5. Aucune capture vue : les 10 critères visuels restent à scorer sur le rendu réel.
6. Le champ de recherche de l'étalon est une approximation (le composant `SearchBar` n'a pas été relu) ; en-tête, bouton de compte et menu reprennent les classes de `header.tsx` et `account-menu.tsx`.

## 6. Mise à jour de `playwright/tests/local/header-budget.spec.ts` (décrite, non codée)

À faire dans le même commit que l'en-tête de l'abonné, une fois le libellé de Q2 validé.
1. **Ligne 107 et 141-143** : pour l'état `PREMIUM`, il n'existe plus de `navigation` « Navigation principale » dans le bandeau ni de 7 onglets. Garder ces contrôles pour `visiteur` et `FREE` ; pour `PREMIUM`, vérifier qu'il n'y en a aucun (`toHaveCount(0)`).
2. **Nouveau test « barre de rubriques », état PREMIUM seulement**, aux 6 largeurs de `LARGEURS` et aux largeurs de téléphone (320, 360, 375, 414, 640, 768) : `getByRole("navigation", { name: "Rubriques de l'espace" })` (hors `banner`, la barre est une sœur de l'en-tête) visible ; 5 liens + 1 bouton « Plus » dans l'ordre Aujourd'hui, Parcours, Vannes, Conseils, Vidéos, Plus ; chaque cible >= 44 px de haut ; « Plus » entièrement dans la fenêtre sans défiler ; aucun libellé coupé ; `scrollWidth` de la page <= largeur de fenêtre ; en-tête + barre <= 112 px (boîtes mesurées, à 320 et 375 px en particulier) ; sur `/conseils` l'entrée « Conseils » porte `aria-current="page"` et est dans la vue ; aucun libellé de la barre n'apparaît aussi dans le bandeau (« aucune rubrique deux fois »).
3. **Menu « Plus »** : au clavier (Entrée, flèches, Échap, focus rendu au bouton), `menuitem` dans l'ordre exact des 8 libellés de la variante retenue (A : Carnet, Favoris, Mes notes, Écrire à l'équipe, Vocabulaire, Quiz d'humour, La lettre, Articles), boîte dans la fenêtre, entrées >= 44 px, sur `/carnet` le bouton « Plus » porte `aria-current="true"`.
4. **Menu de compte (ligne 218)** : ne plus comparer à `["Favoris", "Mon profil", "Déconnexion"]` pour tous. `FREE` : inchangé. `PREMIUM` : `["Mon espace", "Mon profil", "Déconnexion"]` (A ; B : « Mon carnet de bord » ; C : « Mon compte »).
5. **Mobile PREMIUM** : le bouton « Menu » n'existe plus (le test existant ne le vise que pour FREE et visiteur, rien à changer) ; ajouter qu'à 320 et 375 px le bouton de compte est visible, >= 44 px, et que la page ne défile pas horizontalement.
6. **Visiteur et FREE** : ajouter `toHaveCount(0)` pour la barre de rubriques (critère 20 du brief).
7. `mesurer()` (ligne 46) cible `header > div` : inchangé, la barre est hors du `<header>`. Joindre les mesures de la barre (largeur de chaque entrée, `scrollWidth`/`clientWidth` de la zone défilante) aux pièces `mesures-PREMIUM`.
8. Mettre à jour le commentaire de budget de `header.tsx` (l. 33-51) : les 7 onglets de l'abonné sont dans la barre.

## Handoff → @orchestrator (session principale)
- Fichiers : ce document + 3 étalons HTML dans `docs/espace-client/etalons/barre/`.
- Décision à prendre par Thomas : Q2 (reco A) ; annoncer aussi l'ordre arbitré (Vannes, Conseils, Vidéos visibles ; Carnet dans « Plus »), « Favoris » sorti du menu de compte, « Mon compte » absent de « Plus ».
- Suite : captures 320, 375, 1280 px (états `#plus`, `#compte`, `#actif=/carnet`), relecture @design, puis `page-compositions.md` (section espace) au lot 1.
