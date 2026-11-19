# Relecture DESIGN à l'aveugle, La lettre et Profil, s26 lot 2 tour 1

Périmètre : `/lettre` (visiteur, gratuit, abonné avancé, nouvel abonné), `/mon-espace/lettres` (rendu identique à `/lettre` dans les captures : mêmes hauteurs, même page, pas de capture d'une lettre ouverte), `/profil` (visiteur renvoyé à la connexion). Captures lues : `docs/captures/s26/lot2-tour-1/{lettre,profil}/` à 375, 768, 1280, 1920 (1456 non rouvert, rendu du 1280). Code lu pour les classes : `lettres-abonne-cartes.tsx`, `archive-lettres.tsx`, `lettre-page-inscription.tsx`, `lettre-inscription.tsx`, `profil-ouvert.tsx`, `profil-cartes.tsx`, `cap-profil.tsx`. Décisions annoncées (titre blanc, filet blanc, un aplat, 8 col + rail, textes) non notées.

## 0. Gate typographique (cité)

`TAILLES-lettre.md` et `TAILLES-mon-espace_lettres.md` (identiques) : visiteur et gratuit, 4 tailles (24 ou 30, 20, 16, 14), **6 combinaisons** à 375, 768, 1280, 1920 ; en-cours et nouvel, 4 tailles, **5 combinaisons**. Graisses 400 et 600 partout. PASS.
`TAILLES-profil.md` : gratuit 375 (4 tailles, 5 combinaisons), gratuit 768/1280/1920 (4, **6**) ; en-cours (4, **6**) ; nouvel 375 (4, 5), 768/1280/1920 (4, **6**). Aucun dépassement du plafond (4 tailles, 6 combinaisons). PASS.
Signalement hors périmètre : visiteur sur `/profil` = page de connexion, mesurée 24/700 et 20/700 (graisse 700 hors échelle) ; ce n'est pas la page Profil, à traiter avec la connexion.

## 1. La lettre

### Constats (captures)
- Visiteur/gratuit 1280 : H1 blanc + phrase, carte d'inscription 7 col (bouton plein à y ≈ 440-485, spec < 450 : limite tenue), rail « dernier numéro » 5 col de 1 640 px de haut. Le formulaire s'arrête à y ≈ 560, la colonne gauche est vide sur ≈ 1 090 px (vide de FIN de colonne : permis par la règle, mais c'est le premier constat visuel de la page). Même rendu à 1920 (coque 1216 px).
- 375 : formulaire en premier, bouton à y ≈ 490 (< 700), puis le numéro en carte pleine. Aucun débordement.
- Le rail sticky de la spec (`lg:sticky lg:top-24`) est posé sur le bloc LONG : un bloc plus haut que la fenêtre et déjà le plus haut de la grille ne colle jamais, l'effet voulu est nul. C'est le formulaire (court) qui devrait coller.
- Abonné (en-cours, nouvel, identiques : 2 lettres) 1280/1920 : en-tête « La lettre » à gauche, **« 2 » seul à l'extrême droite**, à 1 216 px du titre (1 130 px à 1920), sans mot : orphelin, lu comme un défaut d'alignement. Tuile « dernière lettre » pleine largeur (`CARTE_ACTION`, bord violet), une seule carte neutre de 389 px dans une rangée de 1216 : 2/3 de la rangée vides. La tuile violette n'a ni chevron ni pied : rien ne dit qu'elle s'ouvre (mon seul indice est le bord violet).
- Aucun aplat violet sur l'archive (bouton « Lire » absent, assumé par le code) : l'œil n'a plus de point d'ancrage, la page se lit « vide » à 1280 (zone utile 1 216 × 260 px sur 1 057 px de page).
- Cohérence entre comptes : visiteur et gratuit identiques au pixel (champ e-mail prérempli chez gratuit), abonnés identiques entre eux : cohérent.

### Notes (globale = minimum)
| Critère | Note | Défaut précis et correction codable |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 8 | Visiteur sobre et propre. Archive : le « 2 » orphelin et la tuile sans pied. Piste 2 et 3. |
| 2 Hiérarchie, un accent | 8 | Visiteur : bouton dominant, bon. Abonné : tuile violette seule, sans verbe visuel. Piste 3. |
| 3 Usage de la largeur | 7 | Visiteur 1280/1920 : 1 090 px de colonne gauche vide, sticky au mauvais endroit. Abonné : rangée « précédentes » à 1/3. Pistes 1 et 2. |
| 4 Cohérence entre comptes | 9 | Aucun écart. |
| 5 Finition | 8 | Contrastes AA (secondaire #B3B3B3), liens soulignés neutres, case et champ alignés. Classes interdites par la spec encore dans `lettre-inscription.tsx` (voir fautes dures). Cible de la case non vérifiable au rendu (case ≈ 16 px, la zone cliquable dépend du `label`). |

NOTE de la page : 7/10 (critère 3).

### Pistes (3)
1. **Sticky sur le formulaire, pas sur le numéro.** `lettre-page-inscription.tsx` : envelopper `header` + carte dans un bloc `lg:sticky lg:top-24 lg:self-start` ; retirer `lg:sticky` du rail « dernier numéro » (page `app/(dashboard)/lettre/page.tsx`). Ce qui fait 10 : l'inscription reste visible pendant la lecture du numéro, la colonne gauche n'est plus un trou. Aucune taille ajoutée.
2. **Compteur et rangée de l'archive.** `lettres-abonne-cartes.tsx` : `<header className="flex flex-wrap items-baseline justify-start gap-4">` (le « 2 » colle au titre) ; quand `precedentes.length` est inférieur ou égal à 3, `lg:grid-cols-3` devient une grille 12 avec la dernière lettre `lg:col-span-8` et les précédentes en pile `lg:col-span-4`, pour que la largeur soit utilisée à 2 lettres comme à 20.
3. **Affordance de la tuile.** Dans `CARTE_ACTION`, ajouter le chevron déjà utilisé par la tuile « Reprendre » d'Aujourd'hui (`h-4 w-4 text-text-secondary`, `aria-hidden`, `absolute bottom-6 right-6`) : aucun texte neuf, aucun second violet.

## 2. Profil

### Constats (captures)
- 1280 et 1920, abonnés : grille 8/4 nette, titre blanc, sous-titre à gauche, « Reprendre ton parcours » seul aplat (header sans bouton d'offre : conforme), cap, statistiques, parcours à gauche ; abonnement, rappel, lettre, prénom, question à droite ; « Supprimer mon compte » en pied, pleine largeur, discret. Colonne gauche finit à y ≈ 1 044 contre ≈ 1 300 à droite : vide de fin de colonne, permis. Lecture propre, finition au niveau de l'accueil.
- Gratuit 1280 : « Prochaine étape » 8 col en 2 colonnes de pistes, la 3e piste seule à gauche avec un trou de 384 × 105 px à sa droite (dans la carte, fin de grille) ; offre « S'abonner · 1,99 €/mois » en tête de la colonne latérale, seul aplat. Bon. Pastille « Aucun abonnement » grise.
- **Sous 1024, abonnés (en-cours et nouvel), le contenu est coupé** : à 768 (nouvel) « Ton cap » fait 165 px de haut pour 105 px de contenu (vide interne ≈ 150 px), « Statistiques » est coupée après les chiffres (les 4 libellés « Vannes lues… » invisibles, carte de 56 px) et « Mes parcours » coupée sous sa phrase (bouton « Découvrir les parcours » invisible). À 375 (en-cours) : « Ton cap » étiré (≈ 220 px vides), « Statistiques » montre 2 compteurs sur 4, « Mes parcours » 1 parcours sur 2. Cause lue au code : `cap-profil.tsx` ligne 37 passe `h-full` à `TonCap` dans une colonne `flex flex-col` (`profil-ouvert.tsx`, `COLONNE`) à hauteur imposée par la grille ; les cartes sœurs rétrécissent et leur cadre rogne le contenu. À 1024 et plus, `lg:items-start` masque le défaut. [HYPOTHÈSE sur la cause, à confirmer au correctif ; le défaut visible est certain.]
- 768 : la carte « Ta question à l'équipe » occupe la moitié de la largeur (≈ 215 sur 454 en échelle capture) avec un trou à droite ; sa hauteur (≈ 103 px pour une ligne) donne ≈ 42 px de vide au-dessus et au-dessous du texte, hors `p-6` (24 px) : `profil-ouvert.tsx` l.104 pose `CADRE_CARTE_NEUTRE` sans `p-6` ni `md:col-span-2`.
- Connu à juger : (a) pastille « Premium » (carte Abonnement) : fond violet foncé + texte lavande, alors que la même pastille est grise en « Aucun abonnement » chez le gratuit : second violet de l'écran et incohérence entre comptes. À rendre neutre. (b) Interrupteur « lettre de la semaine » coché violet vif (#7C3AED) : c'est, après le bouton, la plus grosse tache violette de l'écran, il concurrence l'aplat du haut ; les deux interrupteurs côte à côte (rappel éteint gris, lettre allumé violet) disent l'état, mais le violet n'est pas nécessaire à ce message. À neutraliser (coché = `bg-text-primary`, pouce `bg-background`), état lisible par la position du pouce et un contraste ≥ 3:1.
- Visiteur : renvoyé à la connexion, page hors périmètre ; la carte « Connecte-toi » de `ConnexionProfil` n'est donc pas visible en capture (non jugée).

### Notes (globale = minimum)
| Critère | Note | Défaut précis et correction codable |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 8 | 1280/1920 propre ; pastille Premium et interrupteur violets. Piste 2. |
| 2 Hiérarchie, un accent | 7 | Aplat dominant OK ; pastille + interrupteur = 2 violets en concurrence, à 1280 comme à 375. |
| 3 Usage de la largeur | 5 | < 1024 abonnés : cartes coupées, 150 à 220 px de vide interne dans « Ton cap », contenu perdu. 1280/1920 : bon. |
| 4 Cohérence entre comptes | 7 | Pastille d'abonnement grise (gratuit) vs violette (abonné) ; sinon cohérent. |
| 5 Finition | 5 | Contenu rogné (Statistiques, Mes parcours), carte « question » sur-paddée, 2e colonne à demi-largeur à 768. |

NOTE de la page : 5/10 (critères 3 et 5, faute dure 1).

### Pistes (3)
1. **Corriger la coupe sous 1024** (c'est la faute dure 1) : retirer `h-full` de `cap-profil.tsx` l.37 (`"min-w-0"`) et ajouter `[&>*]:shrink-0` à `COLONNE` dans `profil-ouvert.tsx` l.29 ; vérifier à 375, 768, 1023 que Statistiques montre 4 libellés (2 × 2 à 375) et Mes parcours toutes ses lignes. Ce qui fait 10 : plus aucun vide interne ni contenu rogné à aucune largeur.
2. **Un seul violet à l'écran.** `AbonnementCard` : pastille Premium en `bg-background-elevated text-text-primary` comme « Aucun abonnement » (même gabarit, même `META_FORT`) ; interrupteurs cochés en `bg-text-primary` dans `lettre-hebdo-reglage.tsx` et `rappel-parcours-toggle.tsx` (focus en `accent-primary` inchangé).
3. **Finition des cartes courtes.** `profil-ouvert.tsx` l.104 : `cn(CADRE_CARTE_NEUTRE, "min-w-0 p-6 md:col-span-2 lg:col-span-1")` (carte « question » pleine largeur à 768, plus de vide haut et bas) ; `profil-cartes.tsx` l.73 : `<li className="min-w-0 sm:[&:last-child:nth-child(odd)]:col-span-2">` pour que la 3e piste ne laisse pas un trou de 384 px.

## 3. Fautes dures

NOTE GLOBALE La lettre : 7/10
NOTE GLOBALE Profil : 5/10

Fautes dures (chiffrables) :
1. Profil abonné, < 1024 (375 et 768, en-cours et nouvel) : contenu rogné et « Ton cap » étiré (« Statistiques » 56 px de haut avec 4 libellés invisibles à 768, 2 compteurs sur 4 à 375 ; « Mes parcours » 1 parcours sur 2 ; vide interne de « Ton cap » 150 à 220 px) : `apps/web/src/components/espace/cap-profil.tsx` (`h-full` l.37) et `apps/web/src/components/espace/profil/profil-ouvert.tsx` (`COLONNE` l.29).
2. `/lettre` formulaire ouvert, classes interdites par la spec s26 §0.11 encore rendues : `font-medium` (l.202), `gap-2.5` (l.207), `mt-1` (l.207), `mt-3` (l.191) dans `apps/web/src/components/lettre/lettre-inscription.tsx` (le rendu mesuré donne 14/600 : l'écart visible est nul, le défaut est la classe ; correction sans toucher au HTML fermé, derrière `ESPACE_CLIENT_PUBLIE` ou via la portée `ECHELLE_CARTES_PARTAGEES`).
