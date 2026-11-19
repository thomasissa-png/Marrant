# Pilote liste + détail de Quoi répondre : mesures du tour 1 (19/11/2026)

[LIVE] Préversion locale http://localhost:5400, Chromium (Playwright), deviceScaleFactor 1, `load` + 1,5 s. Comptes remis à l'état de référence (`comptes.sh`) avant chaque trajet abonné (un « Fait » posé par trajet) et à la fin. « Fait » = bouton « Essayé, ça a marché » (route `fiche-fait`). Largeurs : 375x812, 768x1024, 1280x900, 1920x1080 (1024x768 non demandé, non mesuré). Références : spec design §8, spec UX §4.

Captures (80, plafond atteint) : `<compte>-<largeur>-<étape>.png`. Abonnés (`abonne-en-cours` = abonné avancé, `nouvel-abonne`) : 1-arrivee, 1-arrivee-pleine, 2-troisieme-fiche, 2-troisieme-fiche-pleine, 3-fait, 4-suivante, 5-soiree-fiche, 6-retour (bouton de page sous 1024, retour navigateur dès 1280). `visiteur`, `gratuit` : 1-arrivee, 1-arrivee-pleine. Non capturés faute de place (mesurés ci-dessous) : clic sur tuile fermée (aucun changement d'écran), adresse directe d'une fiche (arrive sur la même page que 1-arrivee). 3-fait est pris au défilement où se trouve le bouton.

## 1. Géométrie abonné dès 1024 (spec §8 ; identique pour les 2 abonnés, toutes étapes à scrollY 0)
| # | Mesure | Attendu | 1280 | 1920 |
|---|---|---|---|---|
| 1-3 | Liste / gouttière / panneau | 360 / 32 / 824 | 360 / 32 / 824 | 360 / 32 / 824 |
| 4 | Haut liste - haut carte A | 0 | 0 | 0 |
| 5 | Haut collé de la liste (page défilée de 150) | 144 | 144 | 24 (liste sous l'en-tête de 121) |
| 6 | Hauteur liste | 732 / 912 | 732 | 912 |
| 7 | Écart lignes de base titre liste / H1 | <= 2 | 0 | 0 |
| 8 | Blanc à droite du panneau | 0 | 0 | 0 |
| 9 | Vide entre blocs de fiche (A, B, suivante) | 24 | 24, 24 | 24, 24 |
| 10 | Fin de carte A et B (dernier élément visible -> bord intérieur) | <= 24 | 32 et 32 | 32 et 32 |
| 12 | Hauteur ligne / « Situation suivante » / « Retour » (sous 1024) | >= 44 | 44 (56 sur 2 lignes) / 48 / 44 | idem |
| 15 | Décalage du texte de ligne à l'activation | 0 | 0 (x = 57) | 0 (x = 377) |
Fin de carte 32 px : mesurée aussi à 375 et sur 4 fiches (sans id, odeur, samedi, tu pars déjà). Dernière ligne de la liste atteignable par défilement interne : oui (1280, 1920). Filet de la ligne active : blanc `rgb(255,255,255)` 2 px (spec §2 : `bg-accent-primary`). Ligne active : 14 px / 600.

## 2. Trajet abonné : défilements (avant le clic -> après), avancé et nouvel identiques sauf mention
| Largeur | Étape | scrollY page | scrollTop liste | Liste visible après | aria-current |
|---|---|---|---|---|---|
| 375 | 1 arrivée | 0 | - | 3 lignes | 0 |
| 375 | 2 3e fiche | 24 -> 24 (nouvel 0 -> 0) | - | non | 0 |
| 375 | 3 Fait | 649 -> 617 | - | non | 0 |
| 375 | 4 Suivante | 617 -> 0 | - | non | 0 |
| 375 | 5 Soirée puis fiche | 1194 -> 2 (nouvel 1191 -> 2) | - | non | 0 |
| 375 | 6 Retour (bouton) | 1194 -> 1247 (nouvel 1191 -> 1247) | - | non (pied de page seul à l'écran) | 0 |
| 768 | 1 / 2 / 3 | 0 / 0 -> 0 / 0 -> 0 | - | 10 lignes / non / non | 0 |
| 768 | 4 Suivante | 516 -> 0 | - | non | 0 |
| 768 | 5 Soirée puis fiche | 587 -> 0 | - | non | 0 |
| 768 | 6 Retour (bouton) | 587 -> 575 | - | 6 lignes + pied de page | 0 |
| 1280 | 1 / 2 / 3 | 0 / 0 -> 0 / 0 -> 0 | 0 -> 0 | oui (même nœud DOM) | 1 |
| 1280 | 4 Suivante | 522 -> 0 | 0 -> 0 | oui (même nœud) | 1 |
| 1280 | 5 Soirée puis fiche | 63 -> 63 | 0 -> 0 | oui (même nœud) | 1 |
| 1280 | 6 Retour navigateur | 63 -> 63 | 0 -> 0 | oui (même nœud) | 1 |
| 1920 | 1 à 6 | 0 -> 0 à chaque étape | 0 -> 0 | oui (même nœud) | 1 |

Après le choix « Soirée » (avant de cliquer une fiche) : le repli de filtres reste ouvert à toutes les largeurs. 1280 : corps de la liste réduit à 1 px de haut, 0 ligne cliquable (clic intercepté par le repli), les pastilles de filtre débordent du bas de la carte ; 1920 : corps 85 px, 3 lignes ; 375 : 0 ligne au premier écran ; 768 : 2 lignes. Dès 1024 le panneau affiche d'office la 1re fiche du filtre (« Et toi, tu fais quoi ? »).
Clics : 3 fiches lues dès 1024 = 2 clics (arrivée = fiche 1 d'office, 3e ligne, « Situation suivante ») ; fiche filtrée dès 1024 = 4 clics (ouvrir le repli, « Soirée », refermer le repli, ligne) ; sous 1024 = 4 clics (« Retour », repli, « Soirée », ligne). « Situation suivante » : 1 clic, 0 retour à la liste.
Historique, 2 retours navigateur depuis la fiche Soirée : dès 1280 -> `?ou=soiree` puis `coloc-samedi…` (fiche de l'étape 3 ; la fiche de l'étape 4 `coloc-tu-en-as-pour-longtemps` n'est plus dans l'historique) ; sous 1024, après le bouton Retour -> `/mon-espace/quoi-repondre` (sans filtre) puis `coloc-tu-en-as-pour-longtemps`.
Collant 1280 : page à 150 -> liste 144 à 876 (24 du bas) ; page à 600 -> haut -246 (la cellule de liste finit avec le panneau). 1920 : page à 150 -> haut 24, bas 936 = bas du panneau.

## 3. Aplats violets pleins au premier écran (en-tête compris)
| Compte | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| visiteur, gratuit (arrivée) | 1 (bouton d'offre) | 1 | 1 | 1 |
| abonnés, page liste (arrivée sous 1024) | 1 (« Voir ») | 1 (« Voir ») | - | - |
| abonnés, fiche avant « Fait » (2, 4, 5 sous 1024 ; 1, 2, 4, 5, 6 dès 1280) | 0 | 1 (« Enregistrer ») | 0 (étape 5 : 1, « Enregistrer ») | 1 (« Enregistrer ») |
| abonnés, liste après « Retour » (étape 6 sous 1024) | 0 | 0 | - | - |
| abonnés, après « Fait » (étape 3) | 1 (« Situation suivante ») | 0 (bouton à y = 1068) | 0 (bouton à y = 1012) | 1 (« Situation suivante ») |
| abonne-en-cours, en-tête | + 1 pastille 12x12 de la cloche, toutes étapes | idem | idem | idem |
« Enregistrer » (« Ma réplique à moi ») est le seul plein de la fiche avant « Fait » : `disabled`, opacité 0,5, `rgb(124,58,237)` ; aucun bouton plein sur le geste « À toi ». Page entière : 1 plein dans `main` à chaque étape (Enregistrer ou, après Fait, Situation suivante). Aperçu 375 et 1280 : 2e plein (bouton de fin d'extrait) sous le premier écran. Logo : texte en dégradé violet (non compté).

## 4. Typo du premier écran (référence `typo.ts` : 14, 16, 20, 24 sous 1024 / 30 dès 1024 ; 400, 600 ; 0 capitale)
| Écran | Tailles/graisses mesurées dans `main` | Hors échelle | Capitales |
|---|---|---|---|
| Aperçu visiteur, gratuit | 14/400, 14/600, 16/400, 16/600, 20/600, 24 ou 30/600 | aucune | aucune |
| Abonné, page liste (375, 768) | 14/400, 14/600, 16/600, 20/600 | aucune | aucune |
| Abonné, fiche (toutes largeurs) | 12/400, 12/600, 14/400, 14/600, 16/400, 16/600, 20/600 (dès 1024), 24/600 ou 30/600 | 12/600 « La scène », « À toi », pastille « Fait » ; 12/400 « 0 / 200 caractères » | « La scène », « À toi » |
| En-tête (tous) | 14/500 (onglets), 16/700 (logo 375) ou 20/700 | 500, 700 | aucune |
| Pied de page (écran 6-retour 375, 768) | - | - | « Produit », « Légal » |
Fiche dès 1024 : 5 tailles distinctes dans `main` (12, 14, 16, 20, 30) pour 4 attendues. H1 de fiche : 24/600 sous 1024, 30/600 dès 1024.

## 5. Vides > 32 px (getBoundingClientRect)
| Où | Largeur, étape | Mesure |
|---|---|---|
| Sous la carte de liste, à côté du panneau (colonnes voisines) | 1920, 5 (filtre Soirée) | liste finit à 645, panneau à 990 : 345 px, visible au premier écran |
| idem | 1280, 5 / 1280, 6 | 291 / 459 px (liste 636 ; panneau 927 / 1095, en partie sous le pli) |
| idem | 1280, 1-4 / 1920, 1 | 175 à 257 / 77 px, bas du panneau sous le pli |
| Fin des cartes A et B de la fiche | toutes | 32 px (8 de plus que `p-6`) |
| Bande hero -> légende de l'extrait (aperçu) | 768, 1280, 1920 | 48 px |
| Bas texte hero / bas carte d'offre (§8 #11) | 1280, 1920 | visiteur 21 px (335 / 356) ; gratuit 38 px (335 / 373) ; 768 : carte sous le texte |
Aucun vide > 32 px entre deux blocs d'une même carte ou entre blocs de fiche.

## 6. Adresses, codes HTTP (`curl -sI`) et preuve
| Adresse | Visiteur | Gratuit | Nouvel abonné |
|---|---|---|---|
| `/fiche/situation/<id>` (adresse du brief) | 404 | 404 | 404 |
| `/mon-espace/fiche/situation/<id>` (ancienne, spec UX §0) | 308 -> `/mon-espace/quoi-repondre/<id>` | 308, idem | 308, idem |
| idem avec `?ou=soiree&pour=desamorcer` | 308, query conservée | - | - |
| `/mon-espace/quoi-repondre/<id>` | 307 -> `/mon-espace/quoi-repondre` | 307, idem | 200 |
| `/mon-espace/quoi-repondre/inexistant-xyz` | 307 | 307 | 200 (page « introuvable », NEXT_NOT_FOUND dans le flux) |
Adresse directe dans le navigateur (visiteur, gratuit, 4 largeurs) : 307 puis 200 sur l'aperçu, scrollY 0. « 1 500+ » : absent du HTML et du payload RSC de `/mon-espace/quoi-repondre` et `/mon-espace` (visiteur, gratuit) et de toutes les captures ; présent sur `/` (HTML 2, RSC 1) et `/abonnement` (HTML 2).

## 7. Clic sur une tuile fermée (visiteur, gratuit ; verrou de la 1re tuile non nette)
4 largeurs, 2 comptes : élément sous le clic = conteneur de l'extrait (tuiles en `pointer-events-none`) ; 0 navigation ; scrollY inchangé à 600 ms (375 : 1017 et 1026, carte d'offre hors écran) ; contour et ombre de la carte d'offre identiques à 0, 100 et 600 ms ; 0 élément focusable dans l'extrait ; 6 tuiles fermées.

## 8. Écarts à la spec (liste brute)
1. Après choix d'un filtre, le repli reste ouvert : 1280, 0 ligne cliquable (corps 1 px) et filtres qui débordent de la carte ; 375, 0 ligne au premier écran ; un clic de plus pour refermer (UX §4.2, design §2).
2. Retour par le bouton de page sous 1024 : 375, scrollY 1194 -> 1247 (écart 53), écran = pied de page, 0 ligne ; 768, 587 -> 575 (écart 12) (UX §4.3 : ± 8).
3. Le choix d'un filtre retire de l'historique la fiche ouverte avant lui (dès 1280 : retour x2 -> liste filtrée puis fiche de l'étape 3) (UX §4.3).
4. Clic sur tuile fermée : aucune réaction (ni contour, ni défilement) (UX §1, §4.7).
5. Premier écran de fiche abonné : 0 aplat à 375 (étapes 2, 4, 5) et à 1280 (étapes 1, 2, 4, 6) ; seul plein ailleurs = « Enregistrer » désactivé (opacité 0,5), pas un bouton du geste (design §3.2, §6 ; UX §4.6).
6. Après « Fait », « Situation suivante » plein hors du premier écran à 768 et 1280 : 0 aplat visible.
7. Typo fiche : 12 px (600 et 400) sur « La scène », « À toi », « Fait », « 0 / 200 caractères » ; capitales sur « La scène », « À toi » ; 5 tailles dès 1024 (UX §4.8, design §0).
8. Fin des cartes A et B : 32 px au lieu de <= 24 (design §8 #10).
9. Liste collante à 1920x1080 : haut à 24 px (sous l'en-tête) dès 150 px de défilement, au lieu de 144 (design §8 #5).
10. Vide sous la liste filtrée à côté du panneau : 345 px visibles à 1920, 291 à 1280 (UX §4.5 : <= 32).
11. Filet de la ligne active blanc au lieu de violet (design §2, `[À VALIDER THOMAS]`).
12. Hero aperçu gratuit : bas du texte / bas de carte d'offre 38 px à 1280 et 1920 (design §8 #11 : <= 32).
13. Abonné sur id inconnu : HTTP 200 avec page « introuvable » (pas de 404 de statut).
14. Ancienne adresse sous la forme du brief `/fiche/situation/<id>` : 404 ; la forme `/mon-espace/fiche/situation/<id>` donne 308.
15. En-tête : graisses 500 (onglets) et 700 (logo) ; pastille violette pleine 12x12 de la cloche (abonne-en-cours).
16. Hero -> légende de l'extrait : 48 px (> 32) à 768, 1280, 1920.
