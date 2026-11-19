# Audit des trajets connectés et proposition liste + détail (s26, 19/11/2026)

> **Limite à lire en premier.** Cette session n'avait ni terminal ni navigateur : Playwright n'a PAS été lancé, aucune capture n'a été prise (`docs/captures/s26/audit-trajets/` n'existe pas), aucun temps n'a été chronométré. Tout ce qui suit vient de la LECTURE DU CODE (`[CODE]`) et des mesures déjà écrites dans les commentaires du code par les tours précédents (`[CITÉ]`). Rien n'est inventé : ce qui exige le navigateur est marqué `[À MESURER]`, avec le script à lancer en §6. Fichiers lus : `rubriques.ts`, `lien-retour.tsx`, `liste-fiches.tsx`, `fiche.tsx`, `typo.ts`, pages `quoi-repondre`, `bibliotheque`, `s-entrainer`, `fiche/[type]/[id]`, `questions/[id]`, layouts `mon-espace` et `(dashboard)`, `parcours/[slug]` (en-tête). Non lus : Aujourd'hui, Parcours (composant client), Favoris, Mes répliques.

## 1. Diagnostic : pourquoi Thomas a raison

Le « retour » est un lien FIXE vers le parent du type de fiche (`parentEspace`, « jamais par l'historique »). Chaque fiche est une page complète (`force-dynamic`), la liste est détruite à chaque clic. Conséquences `[CODE]` : le rail de filtres de Quoi répondre (le « menu à gauche » vu par Thomas) disparaît sur la fiche ; le retour pointe vers `/mon-espace/quoi-repondre` SANS `?ou=&pour=` (filtre perdu) ; un `Link` vers une nouvelle page repart en haut (position perdue) ; aucune fiche suivante. Chaque écran a été conçu et relu seul ; personne n'a dessiné le TRAJET.

## 2. Tableau des trajets (clics = minimum déduit du code, `[À MESURER]` en navigateur)

| # | Trajet | Clics | Ruptures constatées `[CODE]` | Gravité |
|---|---|---|---|---|
| T1 | Quoi répondre : liste filtrée → fiche → retour → fiche suivante | 1 pour la 1re, puis 2 par fiche | Filtre perdu au retour ; position dans la liste perdue ; rail de filtres absent sur la fiche ; aucune « suivante » | Haute |
| T2 | Quoi répondre : « prochaine action » → fiche → Fait | 1 | Bon départ ; après « Fait », pas de pas suivant visible dans le code lu `[À MESURER]` | Moyenne |
| T3 | Bibliothèque : bloc → fiche → retour → autre fiche | 2 par fiche | Plateau de 3 colonnes de blocs recréé à chaque retour ; bonus sur une autre route (`/bonus/[id]`) ; « Vannes, conseils, vidéos » sort vers le site public | Haute |
| T4 | S'entraîner : carte → mission | 0 à 1 | Rafale et mission déjà sur la même page (7 + 5 colonnes) : bon modèle, c'est le seul trajet sans rupture lue | Basse |
| T5 | Parcours : liste → parcours → étape → suivante → retour | `[À MESURER]` | Page publique ISR + contenu abonné chargé après hydratation (`/api/parcours/by-slug`) : temps mort probable ; bilan = saut espace → parcours public | Haute `[À MESURER]` |
| T6 | Favoris → un favori | `[À MESURER]` | Favori = page publique (vanne, conseil, vidéo) avec barre de l'espace : retour vers la liste à vérifier | Moyenne `[À MESURER]` |
| T7 | Mes questions → un fil | 1 | Déjà un rail des autres fils (4 col.) à côté du fil (8 col.) : liste + détail en germe, mais la liste est rechargée | Basse |
| T8 | Mes répliques → écrire | `[À MESURER]` | Non lu | Inconnue |
| T9 | Aujourd'hui → chaque action | `[À MESURER]` | Non lu ; vides signalés par Thomas (Parcours, « Conseil du jour ») à mesurer | Haute (retour Thomas) |

Cohérence des en-têtes `[CODE]` : le H1 de fiche est `text-3xl font-bold md:text-4xl` (30/36 px, graisse 700) alors que `TITRE_PAGE` = 24 sous 1024, 30 au-delà, graisse 600 : écart à `typo.ts` (4 tailles, graisses 400 et 600). « Retour : … » existe sur les fiches, pas sur les rubriques : deux logiques de retour.

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
- Bibliothèque : vides de fin de colonne 0, 164 et 224 px (288, 0 et 286 avant le tour 3) ; coin fermé 202 px de haut.
- Quoi répondre : rail de filtres 922 px à 1280, 1002 à 1100, 1082 à 1024 ; sticky actif seulement au-delà de 78 rem (1248 px) de haut ou 68 rem dès 1280, donc sur un écran de 900 px de haut le rail défile avec la page ; tuile « prochaine action » avec le vide de fin de tuile déplacé à droite (tour 3).
- Lisible dans le code, `[À MESURER]` : H1 de fiche hors échelle (30/36, 700) ; liste en 2 colonnes dès 768 px dans des tuiles de lieu : la dernière tuile peut finir à moitié vide.
- Non mesurés, signalés par Thomas : vides sur Parcours et dans « Conseil du jour », alignement du parcours abonné.

Script de mesure à lancer par une session avec terminal (ne modifie rien) : pour chaque abonné et chaque trajet T1 à T9, à 1280x900 et 375x812 : clics, URL, `scrollY` avant/après retour, présence de la barre, hauteur des vides (`getBoundingClientRect` du dernier enfant vs conteneur), délai clic → H1 visible ; captures `deviceScaleFactor: 1` dans `docs/captures/s26/audit-trajets/`.

## 7. Ordre de mise en œuvre

0. **Correctifs sans changement d'adresse** (indépendants) : filtres reportés sur retour et lien de fiche ; « Fiche suivante » dans le groupe ; restauration du défilement ; H1 de fiche sur `TITRE_PAGE` ; `loading.tsx` des fiches.
1. **Pilote Quoi répondre** : layout + `[id]` + 308 + « Fait » rafraîchi + mobile. Valide la primitive.
2. **Mes questions** (le plus proche) puis **Bibliothèque** (+ route des bonus).
3. **Favoris** (route interceptée), puis **S'entraîner** (retouche seule).
4. **Parcours V2** (sommaire client) après mesure de T5.
Chaque étape : captures de trajets (pas de pages isolées), relecture à l'aveugle notée sur le trajet enchaîné, jamais sur capture fixe seule.

Questions pour Thomas : (a) accord pour changer l'adresse des fiches avec 308 (étape 1) ? (b) Parcours en V2 seulement, d'accord ?
