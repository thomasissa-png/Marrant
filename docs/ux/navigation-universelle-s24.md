# Navigation universelle et gabarits de page (s24), v3

Principe : UN seul en-tête de 65 px sur toutes les pages du site, un seul lien « Mon espace » pour l'abonné, aucune seconde barre. Sources : `header.tsx`, `mobile-nav.tsx`, `footer.tsx`, `gabarit.ts`, `page-header.tsx`, les `page.tsx`, `docs/seo/point-etape-s20.md`, relectures des tours 1 et 2.

## 0. Interrupteur

Tout part avec `ESPACE_CLIENT_PUBLIE`, pour tous les lecteurs, le même jour.

| Interrupteur | En-tête, pied, gabarits | Abonné |
|---|---|---|
| Fermé | Exactement ceux d'aujourd'hui (onglet Accueil, ordre actuel, « Carnet » dans la barre abonné, « Favoris » dans le menu de compte, mises en page actuelles) | Aucun changement |
| Ouvert | Ceux de ce document, pour visiteur, inscrit gratuit et abonné | Nouvel état abonné (§1) |

## 1. Les trois états de lecteur (interrupteur ouvert)

Ordre unique, de gauche à droite en barre et de haut en bas dans le menu mobile : Parcours, Vannes, Conseils, Vidéos, Articles, La lettre.

| Élément (1280 px) | Visiteur | Inscrit gratuit | Abonné Premium |
|---|---|---|---|
| Logo | lien vers l'accueil | idem | lien vers `/mon-espace` (écart, §6) |
| « Mon espace » | absent | absent | lien direct vers Aujourd'hui, 1er de la liste |
| Liens | Parcours, Vannes, Conseils, Vidéos, Articles, La lettre | idem | Parcours, Vannes, Conseils, Vidéos, Articles |
| Recherche | champ de 176 px | idem | idem |
| Cloche | absente | absente | icône, point violet, panneau déroulant |
| Bouton d'offre | « Premium » + prix (libellé `EN_TETE.bouton`, prix lu dans la config) | idem | absent |
| « Connexion » | lien texte | absent | absent |
| Icône compte | absente | Favoris, Mon profil, Déconnexion | Mon profil, Déconnexion |

« La lettre » est gardée pour l'inscrit gratuit (page d'inscription et de lecture) et retirée pour l'abonné, qui la retrouve dans Mon espace (Lettres). Bouton d'offre masqué sur /abonnement (règle actuelle, inchangée).

Largeurs (règles uniques ; estimé, à vérifier par `header-budget` : aucun état ne déborde de 320 à 1280 px) :
- 1024 à 1279 px : comme 1280 ; recherche en loupe ; bouton d'offre au libellé court.
- 768 à 1023 px : les liens du site passent dans Menu ; l'icône compte apparaît dès 768 ; « Mon espace » reste en barre (abonné). Visiteur : logo, loupe, Connexion, bouton d'offre, Menu. Inscrit gratuit : logo, loupe, bouton d'offre, compte, Menu. Abonné : logo, Mon espace, loupe, cloche, compte, Menu.
- 440 à 767 px : loupe en barre (`min-[440px]`), « Connexion » dès 520 px (visiteur), pas d'icône compte (elle est dans Menu), cloche à toutes les largeurs pour l'abonné ; bouton d'offre « Premium » seul sous 640 px, libellé complet dès 640 px ; « Mon espace » seulement dans Menu et par le logo.
- 320 à 439 px : visiteur et inscrit gratuit logo, bouton d'offre court, Menu ; abonné logo, cloche, Menu ; la loupe est en tête du menu.
- Menu mobile, un seul ordre : recherche (sous 440 px) ; abonné « Mon espace » suivi directement de ses 8 entrées ; Parcours, Vannes, Conseils, Vidéos, Articles ; La lettre (visiteur, inscrit gratuit) ; séparateur ; actions (visiteur : bouton d'offre, Connexion ; inscrit gratuit : bouton d'offre, Favoris, Mon profil, Déconnexion ; abonné : Mon profil, Déconnexion). Échap, croix et voile ferment ; le focus revient au bouton Menu.
- Hiérarchie du menu abonné (tokens) : ligne « Mon espace » en `font-semibold text-text-primary`, masquée de 768 à 1023 px (`md:hidden`, elle est alors en barre) ; ses 8 entrées dans un bloc `ml-3 border-l border-border`, lignes de 44 px sans interstice, `pl-6 text-text-secondary` ; un séparateur `border-t border-border` (1 px) avant Parcours. Ligne active : `bg-background-elevated text-accent-link font-semibold`.
- Hauteur : à 375 x 667 (fenêtre CSS, `100dvh`) : en-tête 65 + marge haute du panneau 16 + recherche 52 + Mon espace 44 + 8 x 44 (352) = 529 px, 138 px libres ; à 568 px de haut, 39 px libres. Les barres du navigateur sont comptées dans la fenêtre testée.

### État actif (barre et menu mobile)

Style : fond `bg-background-elevated`, texte `text-accent-link`, soulignement `border-b-2 border-accent-primary` (tous les liens portent `border-b-2 border-transparent`, pas de saut, sans arrondi bas) ; menu mobile : même fond et `font-semibold` ; `aria-current`.

| Adresse | Élément allumé |
|---|---|
| `/mon-espace`, `/mon-espace/*` sauf fiche « bilan », `/carnet`, `/carnet/[mois]` (abonné) | Mon espace |
| `/favoris` | Mon espace (abonné) ; icône du compte (inscrit gratuit) |
| `/parcours`, `/parcours/*`, `/mon-espace/fiche/bilan/*` | Parcours |
| `/vannes*`, `/conseils*`, `/videos*`, `/blog*` | le lien du même nom (abonné compris) |
| `/lettre*` | La lettre (visiteur, inscrit gratuit) ; aucun pour l'abonné |
| `/profil` | l'icône du compte |
| Menu mobile abonné : la ligne du parent (§4.3) s'allume (Quoi répondre pour une situation, Carnet pour `/carnet/[mois]`), « Mon espace » seulement sur Aujourd'hui | ligne parente |
| Toute autre adresse (accueil, abonnement, quiz, glossaire, anatomie, blague du jour, à propos, légales, carnet du visiteur) | aucun |

## 2. Catégories : barre, espace, pied de page

Critère : intention de l'utilisateur, conversion, pages qui se positionnent. Données (Search Console 12/09 au 09/10, `point-etape-s20.md` §4, anciennes de 5 semaines) : l'article n°1 fait 368 clics sur 462 (79,7 %), `/vannes` 17 clics pour 1 366 impressions ; `/videos` inconnu de Google et `/parcours` non indexé à cette date. Articles est donc la première porte Google ; « Parcours en premier » repose sur la conversion (19/10), pas sur un trafic.

| Rubrique | Où | Pourquoi |
|---|---|---|
| Parcours | Barre, 1er | C'est ce qui s'achète ; `[HYPOTHÈSE]` le placer en premier augmente les clics vers l'offre (non mesurable : 5 clics « abonnement » en 28 j au 11/10) |
| Vannes, Conseils, Vidéos | Barre | Portes gratuites, retour quotidien |
| Articles | Barre | Première porte Google (chiffres ci-dessus) |
| La lettre | Barre (visiteur, inscrit gratuit) | Décision du 17/10 |
| Quoi répondre, Bibliothèque, Mes questions, S'entraîner, Mes répliques, Lettres, Favoris, Carnet | Index de Mon espace (§4) | Usage d'abonné |
| Pied de page réel (`footer.tsx`) | Vannes, Conseils, Vidéos stand-up, Parcours, Comment devenir drôle, Articles, Glossaire, Quiz humour, Anatomie d’une vanne, Nos offres ; À propos, Mentions légales, CGU, Confidentialité, rétractation, résilier ; lettre, widget (si ouvert), réseaux | Inchangé, plus une ligne « Blague du jour » (page liée ailleurs mais pas depuis le pied, §6) |

Le Quiz humour reste hors de l'espace : un quiz se fait une fois, son entrée est le pied et l'accueil. Libellés courts, ni tiret cadratin ni emoji.

## 3. Gabarits

Coque commune : `max-w-7xl`, marges 16 (375), 24 (768), 32 px (1280), centrée. Interdits : colonne de 720 px à gauche, menu latéral, bloc collé à gauche avec vide à droite. `maxWidth.lecture` (720 px) est supprimé du thème quand l'espace passe en A, B, C ; lot @fullstack : les 14 fichiers de `mon-espace/` et `espace/` qui l'emploient (dont `axe-espace.tsx:18`), aucune classe morte.

| | A. Lecture | B. Liste ou grille | C. Tableau de bord |
|---|---|---|---|
| Contenu | colonne centrée 768 px (`COLONNE_LECTURE`) | pleine coque ; colonnes existantes conservées (vannes, conseils : 2) ; pages neuves de l'espace : 1 colonne, 2 dès 768 | pleine coque, `grid-cols-1 md:grid-cols-2 gap-6`, aucune carte limitée à 768 px (seuls les paragraphes le sont, `max-w-3xl`) |
| Repères | public : repères actuels inchangés ; espace : « Retour : {parent} » (§4.3), aligné sur la colonne | idem, aligné sur le logo | aucun fil d'Ariane ; Aujourd'hui sans retour ; S'entraîner porte « Retour : Mon espace » |

Rythme vertical : l'espace reprend celui du public tel qu'il est, sans rien ajouter au public. Haut et bas de page = le `py-8` de `main` (32 px, aucune marge de plus) ; `PageHeader` actuel (H1 `font-display font-bold text-3xl md:text-4xl`, intro `mt-3 md:mt-4 text-lg text-text-secondary max-w-3xl`, `mb-8 md:mb-10`) ; entre cartes de l'espace `gap-6`, entre sections de l'espace `space-y-12`. Les pages publiques gardent leurs valeurs et leurs fils d'Ariane.

Aujourd'hui (C), à 1280 px : colonne 1 = carte du jour, colonne 2 = carte « Dans ton espace » (`min-w-0`), rien à droite de vide ; dessous « Contenu du jour » (vanne, conseil, vidéo) en `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`, la 3e carte en `md:col-span-2 xl:col-span-1`. À 375 : une colonne, carte du jour d'abord. À 768 : le bouton plein « Les cartes du jour » reste l'élément le plus visible ; l'index n'a ni bouton plein ni fond de carte par ligne. S'entraîner (C) : une carte par colonne, `gap-6`, mêmes colonnes que Aujourd'hui.

### Correspondance complète (toutes les `page.tsx`)

- Hors gabarit : accueil `/` (page de vente, inchangée).
- A : `/a-propos`, `/blague-du-jour`, `/anatomie-vanne`, `/integrer-la-vanne-du-jour`, `/developers`, `/blog/[slug]`, `/blog/apercu/[slug]`, `/conseils/[slug]`, `/vannes/[slug]`, `/videos/[slug]`, `/parcours/[slug]`, `/carnet`, `/carnet/[mois]`, `/lettre`, `/lettre/confirmer`, `/lettre/desinscrire`, `/lettre/premium/arreter`, `/abonnement`, `/abonnement/success`, `/quiz-humour`, `/mentions-legales`, `/cgu`, `/confidentialite`, `/retractation`, `/resiliation`, `/resiliation/confirmee`, `/mon-espace/fiche/[type]/[id]`, `/mon-espace/bonus/[id]`, `/mon-espace/lettres/[numero]`, `/mon-espace/questions/[id]`.
- B : `/vannes`, `/vannes/theme/[slug]`, `/conseils`, `/videos`, `/blog`, `/parcours`, `/glossaire`, `/favoris`, `/profil` (comme `gabarit.ts`), `/mon-espace/quoi-repondre`, `/mon-espace/bibliotheque`, `/mon-espace/repliques`, `/mon-espace/lettres`, `/mon-espace/questions`.
- C : `/mon-espace` (Aujourd'hui), `/mon-espace/s-entrainer`.
- Sans en-tête du site, comme aujourd'hui (groupe `(auth)`) : `/login`, `/register`, `/forgot-password`, `/reset-password`, `/onboarding`.
- Hors périmètre, inchangés : `/liens`, `/liens/[reseau]`, `/admin`, `/admin/ceo`, `/admin/social`, `/admin/questions`, widget intégrable, page neutre d'un bonus (404 du site).

## 4. Navigation interne de l'espace

Pas de seconde barre : elle ajoute 46 px (111 px collés en haut), cache ses entrées derrière un défilement, et Thomas l'a jugée « innavigable ».
1. Aujourd'hui en 1 geste : « Mon espace » est un lien (dès 768 px en barre, sinon première ligne du menu) et le logo de l'abonné y mène.
2. Index : carte « Dans ton espace », une ligne de 44 px par rubrique (libellé et chevron), dans cet ordre : Quoi répondre, Bibliothèque, Mes questions, S'entraîner, Mes répliques, Lettres, Favoris, Carnet. Une colonne de lignes. Même liste dans le menu mobile sous « Mon espace ». Le point violet n'est que sur la cloche (un fait, un signal).
3. Retour, fixé par le type de page (sans état ni paramètre). Le parent règle aussi l'élément allumé (§1) :

| Page | « Retour : » |
|---|---|
| `/mon-espace/fiche/situation/*`, `/fiche/a-plat/*` | Quoi répondre |
| `/mon-espace/fiche/jeu/*`, `/fiche/seance/*` | S'entraîner |
| `/mon-espace/fiche/construction`, `vocabulaire`, `formule`, `ecouter`, `humour-noir`, `/bonus/*` | Bibliothèque |
| `/mon-espace/fiche/bilan/*` | {nom du parcours d'origine}, vers `/parcours/[slug]` ; élément allumé : Parcours |
| `/mon-espace/lettres/[numero]` | Lettres |
| `/mon-espace/questions/[id]` | Mes questions |
| Pages B de l'espace (`/mon-espace/*` : Quoi répondre, Bibliothèque, Mes répliques, Lettres, Mes questions) et S'entraîner | Mon espace |
| Aujourd'hui | aucun |
| `/favoris`, `/carnet`, `/carnet/[mois]` | repères publics actuels, pour tous les états (page publique : rien n'est ajouté) ; pour l'abonné, parent d'état actif de `/carnet/[mois]` : Carnet |

Lot @fullstack : `rubriques.ts` est aligné sur ce document (`/carnet` sort des portes de Quoi répondre et devient l'entrée « Carnet » ; `/vannes`, `/conseils`, `/videos` sortent des portes de Bibliothèque, car ces pages allument leur propre lien).

Les rubriques de l'index sont à 2 gestes de toute page : ordinateur Mon espace puis ligne ; téléphone Menu puis ligne, sans défilement.

## 5. Critères de réussite (relecture à l'aveugle)

1. Interrupteur fermé : aucune page ne change (captures avant et après).
2. Ouvert : à 375, 768, 1280 px, l'en-tête d'un même état est identique sur toutes les pages qui en ont un, hors lien courant allumé et bouton d'offre masqué sur /abonnement.
3. Aucune seconde barre ; hors logo, aucun lien deux fois dans la barre et le menu ; abonné : « Mon espace » et 5 liens.
4. À 1280 px aucun contenu collé à gauche avec vide à droite (Aujourd'hui compris) ; l'espace suit les valeurs du §3 (mesures en pixels) ; le haut des pages publiques ne change pas d'un pixel.
5. Accès : pages B, C et Aujourd'hui à 2 clics de toute page depuis l'en-tête ou le pied ; pages A à 3. À 375 px, chaque rubrique de l'espace est à 2 touchers (Menu, ligne) sans défilement du menu, de 320 à 414 px de large pour une fenêtre CSS (`100dvh`, viewport Playwright) de 568 px au moins, marges et séparateur compris (§1).
6. Aucun libellé coupé ni débordement de 320 à 1920 px, y compris 440 à 767 px ; `header-budget` mis à jour pour le nouvel état abonné (Mon espace, cloche), 6 largeurs plus 640 et 641 px (cas le plus serré, visiteur, ~12 px libres).
7. Clavier complet (Tab, Échap), focus visible, cibles de 44 px, contrastes AA ; état actif visible sans dépendre de la teinte.
8. États actifs conformes au tableau du §1, y compris `/favoris` (abonné et inscrit gratuit), `/carnet`, `/profil`, fiche « bilan », `/lettre` (abonné : aucun).
9. Mêmes URL, aucune redirection ; la barre visiteur change comme au §6 ; HTML serveur du visiteur sans code de l'espace.
10. Conversion : bouton d'offre visible à toute largeur pour visiteur et inscrit gratuit, masqué sur /abonnement ; l'accueil vu par un abonné ne lui propose aucun achat (vérification sur capture, aucune modification attendue : `premium-cta.tsx` et `carte-premium-achat.tsx` gèrent déjà le Premium).
11. Preuves : captures pages × 3 états × 3 largeurs, menus fermés et ouverts, dans `docs/captures/s24-nav-universelle/`.
12. Mesure : événements « clic Mon espace », « clic index », « clic Menu », nommés par @data-analyst sur la convention du plan Umami existant.
13. Chaque page A de l'espace renvoie à sa rubrique selon la table du §4.3 ; l'élément allumé de la barre est celui de ce parent (Mon espace, ou Parcours pour un bilan) et, dans le menu mobile, la ligne du parent s'allume. Aujourd'hui n'a pas de retour ; `/favoris` et `/carnet` gardent leurs repères publics.
14. Aujourd'hui à 768 px (capture) : carte du jour et index côte à côte, « Les cartes du jour » est le bouton le plus visible, l'index ne pèse pas autant que l'action du jour.

## 6. Écarts aux décisions passées (à confirmer par Thomas)

- [CHOIX UTILISATEUR] « ROUVRE : Q3 (12/11), barre de rubriques sous l'en-tête » remplacée par un lien « Mon espace » dans l'en-tête et un index dans Aujourd'hui et dans le menu mobile.
- [CHOIX UTILISATEUR] « ROUVRE : Q11 (12/11), barre sur les pages publiques pour l'abonné » remplacée par le même en-tête partout.
- [CHOIX UTILISATEUR] « ROUVRE : C1 (12/11), barre à 6 entrées dont « Plus » » : Parcours rejoint la barre du site, « Plus » disparaît, ses lignes vont dans l'index.
- [CHOIX UTILISATEUR] « ROUVRE : Quiz d'humour quitte le menu de l'abonné » (reste au pied et à l'accueil).
- [CHOIX UTILISATEUR] « ROUVRE : le logo de l'abonné mène à `/mon-espace`, pas à l'accueil » (interrupteur ouvert ; Googlebot n'est jamais abonné).
- [CHOIX UTILISATEUR] « ROUVRE : menu du site, onglet Accueil retiré (le logo le remplace) et Parcours en premier. » Si Thomas préfère l'ordre actuel, seul cet écart tombe.
- [CHOIX UTILISATEUR] « ROUVRE : « Carnet » et « Favoris » de l'abonné passent dans l'index de Mon espace » (interrupteur ouvert seulement).
- [CHOIX UTILISATEUR] « ROUVRE : ajout de « Blague du jour » au pied de page. »
- [CHOIX UTILISATEUR] « ROUVRE : l'espace abandonne sa colonne de 720 px à gauche (gabarits A, B, C). »
- [CHOIX UTILISATEUR] « ROUVRE : l'icône du compte apparaît dès 768 px en barre pour l'inscrit gratuit et l'abonné (aujourd'hui dès 1024 px). »
- Non rouverts : « La lettre » (17/10), « Articles » (18/10), conversion prioritaire, pas de compte gratuit (05/10), pages `(auth)` sans en-tête, grilles, fils d'Ariane et haut de page publics.

## 7. Faute dure, correction

| Faute | Correction |
|---|---|
| D1 (auth), correspondance | Pages `(auth)` sans en-tête ; liste de toutes les `page.tsx` (§3) |
| D2 interrupteur | §0 ; fermé = site actuel |
| D3 état actif, double nom | Tableau complet (§1, avec `/favoris` inscrit gratuit, `/lettre` abonné, « toute autre adresse : aucun ») ; parent selon la table §4.3 |
| D4 contradictions | Un seul ordre ; quiz hors espace ; critères 2, 3, 5, 9, 10 réécrits (hors logo, hors /register) |
| D5 listes publiques | Colonnes existantes conservées, classement de `gabarit.ts` |
| D6 données, pied | Chiffres sourcés, `[HYPOTHÈSE]`, §2 aligné sur `footer.tsx`, formule « pas liée depuis le pied » |
| FD1 Aujourd'hui en 1 geste | Lien direct, logo abonné (ROUVRE), index, menu déroulant supprimé |
| FD2 quiz, FD3 pied | Quiz hors espace ; pied recopié, libellé « Quiz humour » |
| FD4 et N3 retour vers Aujourd'hui | Table du §4.3 par type de page, état actif suivant le parent, critère 13 ; j'ai ajouté `a-plat` (Quoi répondre) et `jeu`, `seance` (S'entraîner) comme dans `rubriques.ts`, au lieu de les mettre en Bibliothèque |
| N1 rythme vertical sur le public | Refus partiel argumenté : `pt-8/10/12` s'ajouterait au `py-8` de `main` (64 à 80 px au lieu de 32). Le public ne change pas ; l'espace reprend ses valeurs ; critère 4 |
| N2 trois touchers sur téléphone | Menu mobile : « Mon espace » suivi des 8 entrées, tenue sans défilement calculée, critère 5 réécrit |
| Design 1 carte du jour | Carte du jour et index côte à côte dès 768 px, « Contenu du jour » en 2 puis 3 colonnes, plus de limite à 768 px sur les cartes |
| Design 2 plage 440 à 767 px | Règles du §1 (loupe, compte, cloche, bouton d'offre) ; icône compte dès 768 px (ROUVRE) |
| R1 repères contradictoires | Gabarit C sans fil d'Ariane, Aujourd'hui sans retour, S'entraîner « Retour : Mon espace », `/favoris` et `/carnet` gardent leurs repères publics (§3, §4.3) |
| Design : menu mobile sans hiérarchie | Tokens du §1 (`font-semibold`, `ml-3 border-l border-border`, `pl-6`, `border-t border-border`), ligne « Mon espace » masquée de 768 à 1023 px (doublon) |
| Pistes du tour 3 (P9 à P12, reviewer, design) | P9 `/carnet/[mois]` et refonte de `rubriques.ts` ; P10 fenêtre CSS, marges comptées (529 px) ; P11 bilan vers `/parcours/[slug]` ; P12 critère 14 ; menu mobile allumé, « estimé » pour `header-budget` 640 et 641, vérification de l'accueil, S'entraîner en colonnes |
| Pistes appliquées | Critère 3 « hors logo » ; `border-transparent` ; « Mon espace » en barre dès 768 px ; point violet sur la cloche seule ; lot @fullstack des 14 fichiers `lecture` |

À confirmer : site sombre seul (aucune bascule claire vue). Pas retenu : point sur le bouton Menu quand on est dans l'espace (non indispensable).
