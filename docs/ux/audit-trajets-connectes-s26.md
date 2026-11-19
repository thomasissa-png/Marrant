# Audit des trajets connectés et proposition liste + détail (s26, 19/11/2026)

> **Limite à lire en premier.** Cette session n'avait ni terminal ni navigateur : Playwright n'a PAS été lancé, aucune capture n'a été prise (`docs/captures/s26/audit-trajets/` n'existe pas), aucun temps n'a été chronométré. Tout ce qui suit vient de la LECTURE DU CODE (`[CODE]`) et des mesures déjà écrites dans les commentaires du code par les tours précédents (`[CITÉ]`). Rien n'est inventé : ce qui exigeait le navigateur était marqué « à mesurer », avec le script à lancer en §6. Fichiers lus : `rubriques.ts`, `lien-retour.tsx`, `liste-fiches.tsx`, `fiche.tsx`, `typo.ts`, pages `quoi-repondre`, `bibliotheque`, `s-entrainer`, `fiche/[type]/[id]`, `questions/[id]`, layouts `mon-espace` et `(dashboard)`, `parcours/[slug]` (en-tête). Non lus : Aujourd'hui, Parcours (composant client), Favoris, Mes répliques.
>
> **Passe de mesure (s26, même jour) `[LIVE]`.** Playwright (Chromium, `deviceScaleFactor: 1`) sur la préversion locale http://localhost:5400, comptes `abonne-en-cours` (« avancé ») et `nouvel-abonne` (« nouvel »), état remis par `comptes.sh` entre les passages. Chaque marque « à mesurer » de la version lue dans le code est remplacée par `[MESURÉ]` ou `[NON MESURABLE : raison]`. Délai = clic → URL changée ET H1 visible (navigation client, cache chaud ; premier passage à froid signalé à part). 33 captures dans `docs/captures/s26/audit-trajets/`. Le « menu latéral » n'existe pas : la navigation est une barre horizontale en haut, présente sur toutes les pages mesurées (tronquée à 375, capture `t5-parcours-etape-avance-375.png`).

## 1. Diagnostic : pourquoi Thomas a raison

Le « retour » est un lien FIXE vers le parent du type de fiche (`parentEspace`, « jamais par l'historique »). Chaque fiche est une page complète (`force-dynamic`), la liste est détruite à chaque clic. Conséquences `[CODE]` : le rail de filtres de Quoi répondre (le « menu à gauche » vu par Thomas) disparaît sur la fiche ; le retour pointe vers `/mon-espace/quoi-repondre` SANS `?ou=&pour=` (filtre perdu) ; un `Link` vers une nouvelle page repart en haut (position perdue) ; aucune fiche suivante. Chaque écran a été conçu et relu seul ; personne n'a dessiné le TRAJET.

`[MESURÉ]` Les quatre ruptures sont confirmées, dans les deux comptes et les deux largeurs : 16 liens de filtre visibles sur la liste filtrée à 1280, 0 sur la fiche ; « Retour : Quoi répondre » mène à `/mon-espace/quoi-repondre` sans `?ou=soiree` ; `scrollY` au retour = 0 pour les 12 retours par le bouton (T1, T1 sans filtre, T3 ; 2 comptes, 2 largeurs) ; aucune « fiche suivante ». À l'inverse, `page.goBack()` restaure filtre ET position dans 100 % des cas mesurés (ex. 1711 → 1711 à 375).

## 2. Tableau des trajets (clics = minimum déduit du code ; mesures en §2 bis)

| # | Trajet | Clics | Ruptures constatées `[CODE]` | Gravité |
|---|---|---|---|---|
| T1 | Quoi répondre : liste filtrée → fiche → retour → fiche suivante | 1 pour la 1re, puis 2 par fiche | Filtre perdu au retour ; position dans la liste perdue ; rail de filtres absent sur la fiche ; aucune « suivante » | Haute |
| T2 | Quoi répondre : « prochaine action » → fiche → Fait | 1 | Bon départ ; après « Fait », pas de pas suivant visible dans le code lu. `[MESURÉ]` : après « Essayé, ça a marché », 0 élément nouveau, URL et `scrollY` inchangés ; seul lien dans l'écran à 1280 : « Retour : Quoi répondre » ; 0 lien à 375 | Moyenne |
| T3 | Bibliothèque : bloc → fiche → retour → autre fiche | 2 par fiche | Plateau de 3 colonnes de blocs recréé à chaque retour ; bonus sur une autre route (`/bonus/[id]`) ; « Vannes, conseils, vidéos » sort vers le site public | Haute |
| T4 | S'entraîner : carte → mission | 0 à 1 | Rafale et mission déjà sur la même page (7 + 5 colonnes) : bon modèle, c'est le seul trajet sans rupture lue | Basse |
| T5 | Parcours : liste → parcours → étape → suivante → retour | `[MESURÉ]` 1 (« Reprendre ») à 1280 ; 2 à 375 pour l'abonné avancé (l'ancre `#etape-3` n'est pas atteinte, `scrollY` 0, un second « Reprendre » s'affiche) ; 0 bouton « suivant(e) » sur la page | Page publique ISR + contenu abonné chargé après hydratation (`/api/parcours/by-slug`) : temps mort probable ; bilan = saut espace → parcours public. `[MESURÉ]` : contenu abonné visible 52 à 84 ms après le H1 | Haute `[MESURÉ : rupture d'ancre à 375]` |
| T6 | Favoris → un favori | `[MESURÉ]` 1 clic, sur place : aucun lien dans la liste, la carte se déplie (conseil : document +540 px), URL inchangée | Favori = page publique (vanne, conseil, vidéo) avec barre de l'espace : retour vers la liste à vérifier. `[MESURÉ]` : aucune page publique ouverte depuis Favoris | Moyenne `[MESURÉ : pas de navigation]` |
| T7 | Mes questions → un fil | 1 | Déjà un rail des autres fils (4 col.) à côté du fil (8 col.) : liste + détail en germe, mais la liste est rechargée. `[MESURÉ]` : le seul lien vers le fil est « L'équipe t'a répondu » ; une fois lu, la liste rechargée n'a plus aucun lien vers ce fil (sélecteur expiré à 1280 et 375) ; `goBack()` montre encore l'ancien lien (état périmé) | Basse |
| T8 | Mes répliques → écrire | `[MESURÉ]` 2 + défilement : « Écrire ma prochaine réplique » mène à la LISTE Quoi répondre (0 champ), puis « Voir » → fiche ; champ à y 920 (écran de 900) et y 1180 (écran de 812) | `[MESURÉ]` : le bouton d'écriture n'ouvre pas d'écriture | Moyenne `[MESURÉ]` |
| T9 | Aujourd'hui → chaque action | `[MESURÉ]` 1 par action (7 liens avancé, 6 nouvel) ; `goBack()` restaure la position dans 100 % des cas | Vides signalés par Thomas mesurés en « Vides mesurés » ; « Reprendre » à 375 (avancé) arrive en haut de page (861 → 0) | Haute (retour Thomas) |

Cohérence des en-têtes `[CODE]` : le H1 de fiche est `text-3xl font-bold md:text-4xl` (30/36 px, graisse 700) alors que `TITRE_PAGE` = 24 sous 1024, 30 au-delà, graisse 600 : écart à `typo.ts` (4 tailles, graisses 400 et 600). « Retour : … » existe sur les fiches, pas sur les rubriques : deux logiques de retour. `[MESURÉ]` styles calculés : H1 de fiche 36 px / 700 à 1280, 30 px / 700 à 375 ; H1 de rubrique 30 / 600 et 24 / 600 ; H1 de parcours 30 / 600 et 24 / 600 ; H1 des pages publiques conseil et vidéo 30 / 700 et 24 / 700.

## 2 bis. Trajets mesurés `[LIVE]`

Clics = jusqu'à la 1re fiche + jusqu'à la fiche suivante par le bouton Retour (Retour, refiltrer, fiche). `scrollY` : avant le clic → après « Retour » de la page / après `goBack()`.

| Trajet | Compte | Largeur | Clics | Contexte perdu | scrollY retour (bouton / goBack) | Délai clic → H1 (ms) |
|---|---|---|---|---|---|---|
| T1 filtre `?ou=soiree` | avancé | 1280 | 1 + 3 | oui : filtre, position, rail (16 → 0) | 203 → 0 / 203 | 76 (retour 67) |
| T1 filtre | avancé | 375 | 1 + 3 | oui : filtre, position | 244 → 0 / 244 | 131 (retour 106) |
| T1 filtre | nouvel | 1280 | 1 + 3 | oui | 203 → 0 / 203 | 84 (retour 67) |
| T1 filtre | nouvel | 375 | 1 + 3 | oui | 244 → 0 / 244 | 89 (retour 56) |
| T1 sans filtre (Famille) | avancé | 1280 / 375 | 1 + 2 | oui : position | 936 → 0 / 936 ; 1711 → 0 / 1711 | 65 / 77 |
| T1 sans filtre | nouvel | 1280 / 375 | 1 + 2 | oui : position | 936 → 0 / 936 ; 1683 → 0 / 1683 | 61 / 79 |
| T2 | avancé | 1280 / 375 | 1 + « Fait » | pas de suite proposée | inchangé : 0 ; 560 | 106 / 136 |
| T2 | nouvel | 1280 / 375 | 1 + « Fait » | pas de suite proposée | inchangé : 0 ; 628 | 103 / 116 |
| T3 (Contes → Comptines) | avancé | 1280 / 375 | 1 + 2 | oui : position | 190 → 0 / 190 ; 2272 → 0 / 2272 | 75 / 74 |
| T3 | nouvel | 1280 / 375 | 1 + 2 | oui : position | 190 → 0 / 190 ; 2272 → 0 / 2272 | 66 / 65 |
| T4 (marche 3) | avancé | 1280 / 375 | 1 | non (document non rechargé) | ancre 0 → 511 ; 756 → 1169 ; goBack 0 ; 756 | 94 / 89 |
| T4 | nouvel | 1280 / 375 | 1 | non | ancre 0 → 511 ; 750 → 1215 ; goBack 0 ; 750 | 70 / 90 |
| T5 (Reprendre) | avancé | 1280 | 1 | non | 267 → 558 (ancre) ; fil « Parcours » 130 ; goBack 137 / 137 | 118 (abonné 190) |
| T5 | avancé | 375 | 2 | oui : ancre non atteinte | 467 → 0 ; fil 0 ; goBack 361 / 361 | 96 (abonné 180) |
| T5 (Commencer) | nouvel | 1280 / 375 | 1 | non | 109 → 353 ; 309 → 998 ; fil 0 ; goBack restauré | 91 / 107 |
| T6 | avancé | 1280 / 375 | 1, sur place | non | sans objet | `[NON MESURABLE : pas de navigation]` |
| T6 | nouvel | 1280 / 375 | 0 | sans objet | sans objet | `[NON MESURABLE : 0 favori]` |
| T7 | avancé | 1280 / 375 | 1 | oui après lecture : plus de lien vers le fil | 0 → 0 (liste courte) | 55 / 56 |
| T7 | nouvel | 1280 / 375 | 0 | sans objet | sans objet | `[NON MESURABLE : aucun fil]` |
| T8 | avancé | 1280 / 375 | 2 + défilement | arrive sur une liste, pas un champ | sans objet | 48 + 71 / 45 + 95 |
| T8 | nouvel | 1280 / 375 | 2 + défilement (champ y 936 / 1164) | idem | sans objet | 62 + 76 / 84 + 74 |
| T9 (7 actions) | avancé | 1280 | 1 par action | non (goBack restauré) | ex. conseil 870 → 0 / 870 | 83 à 122 ; à froid conseil 934, vidéo 927 |
| T9 | avancé | 375 | 1 ; « Reprendre » sans ancre | oui pour « Reprendre » (861 → 0) | goBack restauré | 56 à 126 |
| T9 (6 actions) | nouvel | 1280 / 375 | 1 par action | non | goBack restauré | 60 à 91 / 54 à 83 |

Mesure contre reco : §3 Favoris (« la fiche publique en panneau, route interceptée ») suppose une navigation Favoris → page publique ; mesuré, aucun favori n'est un lien (0 lien dans la liste, ouverture sur place, URL inchangée).
Mesure contre reco : §3 S'entraîner (« la mission consultée via `?marche=` ne recharge plus la rafale ») ; mesuré, `?marche=3` ne recharge pas le document (marqueur `window` conservé, 70 à 94 ms) ; le re-rendu serveur de la rafale `[NON MESURABLE : invisible côté navigateur]`.

## 3. Proposition : liste + détail (≥ 1024), fiche plein écran (< 1024)

Principe : la liste de la rubrique est un LAYOUT qui reste monté ; la fiche s'ouvre dans le panneau de droite ; seule la fiche change.

| Rubrique | 1280 (≥ 1024) | 768 | 375 |
|---|---|---|---|
| Quoi répondre | Gauche 360 px, sticky, défilement propre : filtres en puces au-dessus (le rail de 3 col. disparaît), situations par lieu, ligne active `aria-current`. Droite : fiche (colonne de lecture). Rien d'ouvert : la « prochaine action » existante, pas de texte neuf | Liste seule ; fiche plein écran | Idem ; filtres repliés comme aujourd'hui |
| Bibliothèque | Gauche : index des groupes (construction, formules, vocabulaire, écouter, bonus, coin) ; « Vannes, conseils, vidéos » reste une entrée de sortie vers le catalogue. Droite : fiche ou, par défaut, le tableau actuel de progression | Index plein écran puis fiche | Idem |
| S'entraîner | Pas de liste + détail : déjà cartes (7 col.) + mission (5 col.). Garder, mais la mission consultée via `?marche=` ne recharge plus la rafale | Une colonne (existant) | Idem |
| Favoris | Gauche : favoris par type. Droite : la fiche publique en panneau (route interceptée, §4) | Plein écran | Plein écran |
| Mes questions | Déjà proche : liste à gauche (4 col. aujourd'hui à droite : l'inverser) et fil à droite | Fil puis rail | Fil, retour en haut |
| Parcours | OUI en V2 : sommaire des étapes à gauche (« Fait » compris), étape à droite, bouton « étape suivante » à la place du retour. Seulement côté client, après hydratation | Sommaire plein écran puis étape | Idem |

Mobile (< 1024) : la fiche prend l'écran ; « Retour » = `router.back()` quand on vient de la liste (même position, même filtre), sinon lien vers la liste AVEC `?ou=&pour=`. Position : mémoriser `scrollY` en `sessionStorage` (clé rubrique + filtres), restaurer à la réapparition de la liste (le document rétrécit, le navigateur ne le fait pas seul).

Règles communes : adresse propre et partageable par fiche, filtres dans la query de la liste ET reportés sur le lien de la fiche, bouton retour du navigateur = fiche précédente puis liste, clavier : flèches haut/bas dans la liste, focus rendu au titre de la fiche, cibles ≥ 44 px, un seul aplat violet par écran (la ligne active porte le filet de 2 px existant `FILET_PROCHAINE`, pas un aplat). Aucun texte neuf.

## 4. Implications techniques (Next.js App Router)

1. **Layout partagé + segment `[id]` (recommandé).** `mon-espace/quoi-repondre/layout.tsx` (liste, client) + `quoi-repondre/[id]/page.tsx`. Un layout ne reçoit PAS `searchParams` et ne se re-rend pas quand l'enfant change : filtres lus côté client (`useSearchParams`) sur une liste complète légère (titres, lieu, durée) fournie par le layout ; ~50 situations, charge négligeable `[HYPOTHÈSE : à confirmer au nombre réel]`.
2. **« Fait » périmé.** Le layout persistant ne se rafraîchit pas : après « Fait », `revalidatePath(rubrique, "layout")` côté serveur ou `router.refresh()` + état optimiste côté client. C'est le vrai coût du chantier.
3. **Adresses.** `/mon-espace/fiche/situation/[id]` devient `/mon-espace/quoi-repondre/[id]` ; l'ancienne répond 308. À mettre à jour : `hrefFiche`, `parentEspace`, `rubriqueAllumee`, liens de lettres, de cloche, d'e-mails. Les bilans restent sous Parcours.
4. **Mobile.** `useSelectedLayoutSegment()` masque la liste quand `[id]` est actif (`hidden lg:block`) ; `loading.tsx` dans `[id]` : squelette du seul panneau droit (supprime le temps mort d'écran blanc).
5. **Routes parallèles (`@detail`)** : écartées pour les rubriques (le panneau vide par défaut et les `default.tsx` compliquent sans rien gagner). **Routes interceptées `(.)`** : retenues pour Favoris seulement : navigation douce = panneau, chargement direct = la page publique inchangée.
6. **Liens.** `prefetch={false}` sur les lignes (pages dynamiques, Workers/OpenNext) ; `scroll={false}`.

## 5. Risques

- **SEO** : les fiches de l'espace sont `noindex`, derrière la garde abonné : aucun risque. Vrai risque : les pages publiques (`/vannes`, `/conseils`, `/videos`, `/parcours/[slug]` en ISR avec étape 1 et aperçu) ne doivent JAMAIS entrer dans un layout de l'espace ; Parcours V2 = surcouche client, HTML initial inchangé.
- **Rendu fermé identique** : `ESPACE_CLIENT_PUBLIE=false` doit rendre la 404 avant toute lecture ; chaque nouveau layout rappelle `notFound()` en premier. Contrôle : comparer le HTML fermé avant/après (comme au lot D0).
- **Coin « Humour noir »** : la page n'affiche pas même le titre avant « entrée » (cookie). La liste partagée doit masquer ces fiches tant que le cookie manque.
- **Accessibilité** : `aria-current`, focus, annonce du changement de panneau (région `aria-live` polie), pas de piège de focus entre liste et détail.
- **Sticky** : la liste collante doit tenir dans `100dvh` moins l'en-tête (le rail actuel dépasse l'écran, cf. commentaire `[CITÉ]` : 922 px à 1280).

## 6. Défauts visibles « permis mais visibles »

Mesurés par les tours précédents `[CITÉ]` (commentaires du code, 1280 et 1920) :
- Bibliothèque : vides de fin de colonne 0, 164 et 224 px (288, 0 et 286 avant le tour 3) ; coin fermé 202 px de haut. `[MESURÉ]` 0, 164 et 224 px à 1280 et 1920 : confirmé.
- Quoi répondre : rail de filtres 922 px à 1280, 1002 à 1100, 1082 à 1024 ; sticky actif seulement au-delà de 78 rem (1248 px) de haut ou 68 rem dès 1280, donc sur un écran de 900 px de haut le rail défile avec la page ; tuile « prochaine action » avec le vide de fin de tuile déplacé à droite (tour 3). `[MESURÉ]` rail de 922 px à 1280 (y 221 → 1143) ; à `scrollY` 936 sur 900 px de haut, 2 liens de filtre visibles sur 15 : il défile bien avec la page.
- Lisible dans le code, `[MESURÉ]` : H1 de fiche hors échelle, 36 px / 700 à 1280 et 30 px / 700 à 375 (rubriques 30 / 600 et 24 / 600) ; liste en 2 colonnes dès 768 px dans des tuiles de lieu : la dernière tuile finit avec la colonne droite 64 à 66 px plus courte à 768 (8 tuiles), 64 px à 1280 et 1920 ; une seule colonne à 375.
- Signalés par Thomas, `[MESURÉ]` ci-dessous : vides sur Parcours et dans « Conseil du jour », alignement du parcours abonné.

Méthode `[LIVE]` : fin de carte = bas de la boîte de contenu du conteneur moins bas du dernier enfant (`getBoundingClientRect`) ; fin de colonne = bas de la dernière carte de chaque colonne d'une grille moins le bas le plus bas de la grille. Faux positifs écartés à la lecture des captures : colonne prolongée par le bloc suivant, puces de filtres, pastilles de quiz, liste `sr-only`. Scripts hors dépôt (scratchpad de session), rien n'est modifié.

### Vides mesurés

| Page | Bloc | Largeur | px |
|---|---|---|---|
| Parcours (avancé, annonce de cap affichée) | Colonne du rail « Ton cap » vide sous le rail, à côté de « Tes 4 premières semaines » (rail 153 → 327, bloc → 830) | 1280 et 1920 | 503 |
| Parcours (avancé, annonce consommée) | idem (bloc → 700) | 1280 | 373 |
| Parcours (nouvel) | idem (rail → 355, bloc → 672) | 1280 et 1920 | 317 |
| Parcours (avancé) | Colonne droite (389 px) vide du bas du rail au bas du quiz « Quel parcours est fait pour toi ? » | 1280 / 1920 | 3177 / 3307 |
| Parcours (nouvel) | idem | 1280 et 1920 | 3009 |
| Parcours | Alignements : haut du H1 = haut de « Ton cap » (153) ; bords gauches du H1, de l'annonce et de « Tes 4 premières semaines » (32 ; 352 à 1920) ; bas de l'annonce = bas du rail (327) | 1280 et 1920 | 0 |
| Parcours | Gouttière colonne / rail (835 → 859) | 1280 et 1920 | 24 |
| Parcours | « Vide sous le texte du hero à côté du quiz » | 1280 et 1920 | `[NON MESURABLE : aucun hero rendu à côté d'un quiz pour ces deux comptes ; le quiz est seul dans la colonne de 803 px, la colonne droite est vide (ligne 3177 / 3307)]` |
| Parcours Machine à Café (avancé) | Colonne droite (carte de progression) vide sous la carte, au chargement | 1280 et 1920 | 2665 |
| Aujourd'hui (2 comptes) | « Conseil du jour » : blanc au-dessus du lien de bas de carte | 1280 et 1920 | 16 |
| Aujourd'hui (2 comptes) | « Vidéo du jour » : blanc entre la vidéo et le lien | 1280 et 1920 | 59 |
| Aujourd'hui | Bas de « Conseil du jour » et de « Vidéo du jour » (1423 et 1423) | 1280 et 1920 | 0 |
| Quoi répondre `?ou=soiree` | Tuile « prochaine action » étirée à 351 px : vide au-dessus et au-dessous du contenu | 1280 et 1920 | 148 + 148 |
| Quoi répondre (sans filtre) | même tuile (106 px) | 1280 et 1920 | 25 + 25 |
| Quoi répondre `?ou=soiree` | Colonne de liste qui finit avant le rail (898 contre 1143) | 1280 | 245 |
| Quoi répondre (sans filtre) | Colonne du rail vide sous le rail, à côté de la liste | 1280 et 1920 | 3424 |
| Quoi répondre (sans filtre) | Tuiles de lieu à nombre impair : colonne droite plus courte (8 tuiles) | 768 / 1280 et 1920 | 64 à 66 / 64 |
| Bibliothèque | Fins de colonne gauche / milieu / droite | 1280 et 1920 | 0 / 164 / 224 |
| S'entraîner | Colonne des cartes (699 px) plus courte que la mission | 1280 et 1920 | 106 |
| Mes questions | Colonne de droite (803 px) plus courte que la gauche (389 px) | 1280 et 1920 | 300 |
| Mes répliques | Carte « Écrire ma prochaine réplique » : vide de fin de carte | 1280 et 1920 | 93 |
| Favoris | Colonne des onglets (286 px) vide sous les onglets | 1280 et 1920 | 400 |
| Favoris | Carte vanne de droite plus courte que la carte conseil voisine | 1280 et 1920 | 52 |
| Les 12 pages des trajets | Aucun vide de fin de carte ou de colonne > 32 px (hors puces et pastilles de quiz) | 375 | 0 |

## 7. Ordre de mise en œuvre

0. **Correctifs sans changement d'adresse** (indépendants) : filtres reportés sur retour et lien de fiche ; « Fiche suivante » dans le groupe ; restauration du défilement ; H1 de fiche sur `TITRE_PAGE` ; `loading.tsx` des fiches.
1. **Pilote Quoi répondre** : layout + `[id]` + 308 + « Fait » rafraîchi + mobile. Valide la primitive.
2. **Mes questions** (le plus proche) puis **Bibliothèque** (+ route des bonus).
3. **Favoris** (route interceptée), puis **S'entraîner** (retouche seule).
4. **Parcours V2** (sommaire client) après mesure de T5.
Chaque étape : captures de trajets (pas de pages isolées), relecture à l'aveugle notée sur le trajet enchaîné, jamais sur capture fixe seule.

Questions pour Thomas : (a) accord pour changer l'adresse des fiches avec 308 (étape 1) ? (b) Parcours en V2 seulement, d'accord ?
