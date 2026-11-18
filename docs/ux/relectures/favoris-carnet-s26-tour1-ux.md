# Relecture UX à l'aveugle, Favoris et Carnet, s26 tour 1

Grille : brief `docs/espace-client/travail-en-cours/brief-relecture-v7.md`. Barre : 9/10 sans faute dure. Captures : `docs/captures/s26/encarts-favoris-carnet-tour-1/{favoris,carnet}/`. Ouvertes : 375, 1280, 1920 des 4 comptes de Favoris ; 375, 1280, 1920 de visiteur et gratuit de Carnet, 375 et 1280 et 1920 de en-cours (pleine page).

Limite de lecture, dite franchement : les captures Carnet abonné (en-cours, nouvel) font 21 663 px (1280, 1920) et 40 225 px (375). Elles s'affichent à 118 px de large : je lis la structure grossière (3 colonnes de tuiles, rail à gauche, fiches en 2 colonnes) mais pas les détails au pixel. Pour l'abonné Carnet, le détail est jugé sur `carnet-ouvert.tsx` et sur `TAILLES.md`, pas sur l'image. En-cours et nouvel ont exactement la même hauteur : le Carnet ne dépend pas du compte abonné (cohérent, voulu).

Connu, non noté : fin d'extrait Carnet non-abonné pas encore objet Premium, « 1 500+ » dans la carte d'offre (en correction), absence de progression « lu » (voulu), vignettes vidéo en dégradé.

---

## 1. Favoris (`/favoris`)

### Gate typographique mesurée (`favoris/TAILLES.md`, cité)
- visiteur et gratuit, 375 : « TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6 » ; 768 idem ; 1280 et 1920 : « 4 30px, 20px, 16px, 14px | COMBINAISONS : 6 ».
- en-cours, tous formats : 4 tailles, 6 combinaisons (le 🔥 des réactions compte en 14/600).
- nouvel, tous formats : « 3 », « COMBINAISONS : 5 ».
- Gate : PASS aux 4 comptes (limite 4 tailles, 6 combinaisons). Échelle de référence respectée : 14/16/20/24-30, graisses 400 et 600, aucune capitale visible dans le contenu (les capitales du pied de page sont hors périmètre).

### Visiteur et gratuit (aperçu)
Constat (1280) : hero 8/4 avec offre en haut (bouton y = 203, spec < 450), puis vanne 5/7 conseil replié (2 lignes), tuile « Vidéo » fermée pleine largeur avec fondu, puis carte « La suite est dans Premium » (bouton y = 964 > 900). 375 : bouton d'offre y ≈ 348 (< 700), vanne visible dans le premier écran (812). Hauteur page 1280 : 1 604 px (spec <= 2 000, PASS). Zéro « Exemple », zéro badge coloré. Visiteur et gratuit identiques sauf le texte de la carte d'offre (cohérent).

Points forts : on voit un vrai favori (vanne avec sa chute, conseil), l'offre est la première chose lue, le verrou et la pastille « Premium » disent « fermé » sans ambiguïté, un seul aplat dans le premier écran. La promesse « Garde ce qui t'a servi, retrouve-le sans chercher. » est bien placée : sous le titre, en 16 gris, avant les pastilles et avant l'offre. Je la juge bien placée.

Défauts :
- [piste] Les 4 pastilles « Tout, Vannes, Conseils, Vidéos » ont la forme de vrais onglets (pilules sur fond relevé) alors qu'elles sont inertes, sans verrou (la spec UX 1.2 en demandait un). Fausse affordance : un prospect peut essayer de cliquer. Correction : verrou de `ApercuVerrouille` en préfixe, `aria-hidden`, `cursor-default`, pas de survol.
- [piste] La carte « La suite est dans Premium » est une colonne de 447 px centrée seule sur un contenu de 1 216 px (1280 et 1920), alors que la spec 3 critère 4 demande « jamais une colonne centrée seule à 1280 ». Son bord et son halo violets apparaissent à y = 871, donc dans le premier écran 1280x900 (29 px de carte) : un second cadre violet près du bas de l'écran. Ce n'est pas un aplat, donc pas une faute dure, mais l'objet est de l'encart Premium (hors de ce tour). À arbitrer : fin d'extrait alignée à gauche en 8 col comme sur le Carnet (cohérence entre les deux aperçus : le Carnet a un bloc d'appel à gauche sans cadre, Favoris un cadre centré).
- [piste] Le fondu ne couvre que la tuile Vidéo ; le conseil se termine par « ... » sans fondu (spec 1.2 : « fondu dans la tuile conseil » sur 375). Lecture « fermé » correcte quand même.
- [piste] Hero gauche 1280 : le texte occupe 400 px sur 8 colonnes, un vide horizontal de ~460 px à droite des pastilles. C'est une fin de ligne (permis), mais la zone paraît légère face à la carte d'offre.
- Le sous-titre « Voici un exemple de cette rubrique. Elle est ouverte avec Premium. » est toujours là (14 gris), alors que la spec le retire au profit de la promesse. Texte existant, pas une faute ; il aide à lire « fermé ». À signaler à Thomas, pas à corriger de ma part.

### Abonné avec favoris (en-cours)
Constat (1280, 1920) : titre à gauche, rail sticky de 3 col (onglets verticaux avec effectifs 3, 2, 1, 0, actif = filet blanc + fond relevé), liste de 9 col : carte de tête dépliée (teinte `CARTE_ACTION`, chute, réactions), puis deux cartes 6/6. Aucun aplat violet, aucun badge coloré, « Retirer » en lien gris souligné. 375 : onglets en défilement avec chevron de suite, cartes en 1 col, un seul violet (la teinte de la carte de tête).

Fautes :
- **[FAUTE DURE 1] Vide de 86 px au milieu d'une carte** (1280 et 1920, carte « Mes amis adorent venir dîner chez moi. » à droite) : « Clique pour la chute » est à y = 707, le filet des actions à y = 793. La carte est étirée à la hauteur de sa voisine (conseil) et `Actions` est collée en bas par `mt-auto pt-6` : le vide est entre le texte et le pied, donc AU MILIEU du bloc, pas en fin. La carte conseil voisine a 34 px au même endroit (limite). Correction : `apps/web/src/components/espace/favoris/cartes-abonne.tsx`, dans `Actions`, remplacer `mt-auto pt-6` par `pt-6` (le pied suit le contenu, le vide d'égalisation passe en fin de carte, permis). Ce qui ferait 10 : plus aucun vide > 32 px entre contenu et filet.

Autres défauts :
- [piste] Pas de signal « envie de continuer » pour l'abonné qui a des favoris : seuls les effectifs. Le lien « Explorer les vannes » (`ctaLabel` existant, texte déjà validé) n'existe qu'à vide. Piste : le remettre en lien gris `LIEN_NEUTRE` de 44 px sous le rail (texte existant, à faire valider par Thomas pour cet emplacement). Pas de bouton plein.
- [piste] 375 : l'écart entre la rangée d'onglets et la première carte est de ~53 px (soulignement y = 312, carte y = 365) contre `gap-6` = 24 ailleurs. C'est entre deux blocs, pas dans un bloc : pas une faute dure, mais un rythme plus lâche que les autres pages. Piste : `RangeeOnglets`, retirer la marge basse ajoutée au-dessus de `gap-6`.
- [piste] Le bouton « Partager » est un rond d'icône de ~32 px visible (x 683 à 715 à 1920) sans libellé. Le code affirme une cible de 44 px (`ShareButton`, `-ml-2.5`) : non mesurée sur la capture. À vérifier au code par @qa.
- Les emojis 🔥 et 💀 des réactions sont ceux de `ReactionButtons` (fonctionnels, spec « inchangés ») : pas noté.

### Nouvel abonné (aucun favori)
Constat : rail à 0, 0, 0, 0 et carte d'état vide avec étoile, « Aucun favori pour l'instant », phrase d'aide, bouton plein « Explorer les vannes » (seul aplat de l'écran). Jamais une page morte : l'action est évidente, le bouton est vers `/vannes`. 375 : même chose, bouton y = 580.
- [piste] Quatre « 0 » dans le rail à côté d'un état vide disent quatre fois la même chose. Piste : rail masqué ou grisé tant que le total est 0 (aucun texte neuf).
- [piste] 1280 et 1920 : bas du rail (y = 479) et bas de la carte vide (y = 467) décalés de 12 px, vide de 96 px sous les deux avant le pied (fin de colonne, permis).

### Notes Favoris
| Critère | Note | Raison |
|---|---|---|
| Design 1 élégance, fidélité accueil | 9 | retenue, blanc, gris, un violet |
| Design 2 hiérarchie | 9 | offre dominante (prospect), carte de tête (abonné) |
| Design 3 largeur 5 largeurs | 8 | carte de fin centrée 447 px, hero gauche léger |
| Design 4 cohérence comptes | 9 | visiteur et gratuit alignés, abonné et nouvel alignés |
| Design 5 finition | 7 | faute dure 1 (86 px), 12 px de décalage rail/carte |
| UX 1 prospect | 9 | offre en haut, vrai favori, pastilles fausses affordances |
| UX 2 abonné clarté | 9 | carte de tête dépliée, rail lisible |
| UX 3 envie de continuer | 8 | effectifs seulement |
| UX 4 nouvel abonné | 9 | état vide avec action, rail de zéros |
| UX 5 accessibilité et cohérence | 9 | cible « Partager » à vérifier |

NOTE GLOBALE Favoris : 7/10 (min des critères, faute dure 1 présente ; 9 atteignable avec la correction 1 et les pistes 1 et 2).

---

## 2. Carnet (`/carnet`)

### Gate typographique mesurée (`carnet/TAILLES.md`, cité)
- visiteur et gratuit, 375 et 768 : « 4 24px, 20px, 16px, 14px | COMBINAISONS : 5 » ; 1280 et 1920 : « 4 30px, 20px, 16px, 14px | COMBINAISONS : 6 ».
- en-cours et nouvel, tous formats : « TAILLES DISTINCTES : 3 », « COMBINAISONS : 4 » (30 ou 24, 16, 14).
- Gate : PASS aux 4 comptes. Échelle respectée, une seule taille de titre.

### Visiteur et gratuit (aperçu)
Constat (1280) : kicker 14 sans capitales « Carnet de novembre 2026, 30 situations », titre blanc, intro, hero 8/4 avec carte d'offre à droite (bouton y = 203), puis fiche offerte en 8 col (« On te dit » visible à y = 765 dans le premier écran 900) et tuile « Au programme » (3 titres avec verrou, « Et 26 autres répliques ») en 4 col. Fin d'extrait sous la fiche (bouton y = 1 184 > 900). 375 : bouton y ≈ 328, tuile programme puis fiche en 1 col, ordre contexte, on te dit, tu réponds, pourquoi, appel. Hauteur 1 810 px (1280). Un seul aplat dans le premier écran. Les deux comptes sont cohérents.

Points forts : l'offre est en haut, la valeur est visible (une vraie fiche en 2 colonnes, avec la réplique « J'ai suivi une recette. Elle a résisté. »), la tuile programme avec verrous dit « le reste est fermé » et donne l'envie des 29 autres. Les 1 280 px sont utilisés sur 12 colonnes, aucune colonne centrée seule.

Fautes :
- **[FAUTE DURE 1] Désalignement de 16 px entre la carte d'offre du hero et la tuile « Au programme »**, qui sont deux blocs de 4 col empilés sur la même colonne de droite. 1280 : bord gauche de la carte d'offre x = 876, de la tuile x = 860 (largeurs 372 et 388). 1920 : x = 1196 et x = 1180. Cause : `carnet-ouvert.tsx`, le hero est en `lg:gap-12` (48 px) et la grille du dessous en `lg:gap-6` (24 px). Les bords droits coïncident (1 248), pas les gauches. Correction : passer le hero à `lg:gap-x-6` (ligne 71, `md:gap-8 lg:gap-12` devient `md:gap-8 lg:gap-x-6 lg:gap-y-4`) pour que les colonnes 9 à 12 des deux grilles aient la même origine. Ce qui ferait 10 : bords gauche et droit alignés à 0 px.

Autres défauts :
- [piste, design 3] Zone morte à gauche du hero (1280 et 1920) : le texte (kicker, titre, intro) fait 120 px de haut, la carte d'offre 308 px ; entre y = 290 et y = 500 il reste ~210 px de vide sur 8 colonnes, avant la fiche. C'est une fin de colonne (permis), mais c'est le vide le plus visible de la page et il retarde la fiche. Piste codable : `lg:items-stretch` plus la carte d'offre moins haute, par exemple retirer le bloc Connexion de la carte pour le visiteur (déjà en correction avec la preuve « 1 500+ »). Ne pas combler en grossissant le titre.
- [piste, dans le périmètre « déjà en correction »] Dans la carte d'offre visiteur, « Connexion » flotte à 50 px sous « 1 500+ » sans filet (1280, y = 357 à 407). Je ne le compte pas en faute dure, car la carte est en cours de refonte ; à revérifier au tour 2.
- [piste, cohérence entre les deux aperçus] Fin d'extrait du Carnet = texte + bouton sans cadre aligné à gauche ; fin d'extrait Favoris = carte encadrée centrée. Deux gestes pour le même rôle.
- La fiche : la colonne gauche s'arrête à y = 955, la fiche à y = 1 051 (vide de fin de colonne de 96 px, permis).

### Abonné (en-cours et nouvel)
Constat sur capture (coarse) et code (`carnet-ouvert.tsx`) : en-tête à gauche (kicker 14, titre 30/24, intro), sommaire en tuiles `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (30 tuiles, numéro 14, titre 16/600, contexte 14, `min-h-11`, `p-6`), la première tuile marquée d'un filet blanc 2 px et fond relevé, puis fiches en 9 col avec rail sticky de 3 col dès 1024, « Retour au sommaire » sous chaque fiche, carnets précédents alignés à gauche. Aucun aplat, aucun bouton plein : conforme (lieu de référence).

Évaluation :
- Clarté : le sommaire en 3 colonnes ouvre la page, la prochaine action est claire (cliquer une tuile), ancres et retour au sommaire présents.
- [piste] Envie de continuer : la tuile 1 ne se distingue que par un filet blanc et un fond à peine plus clair, sans libellé. Piste : renforcer le fond (`bg-background-elevated` plus marqué) ou ajouter une étiquette « 1 » existante ; pas de texte neuf, pas de progression simulée.
- [piste] 375 : 30 tuiles en une colonne avant la première fiche (page de 40 225 px, soit ~50 écrans). Piste : tuiles plus compactes à 375 (`p-4`, contexte sur la même ligne que le numéro), à tester ; sans rail sous 1024, le « Retour au sommaire » reste la seule issue.
- Je n'ai pas pu vérifier sur capture : alignement des 30 tuiles (4/4/4), cibles 44 px, position courante du rail. Le code donne `min-h-11` et `p-6` : conforme sur le papier.
- Nouvel abonné : jamais une page morte (30 tuiles, première marquée).

### Notes Carnet
| Critère | Note | Raison |
|---|---|---|
| Design 1 élégance, fidélité accueil | 9 | sobre, blanc, un violet |
| Design 2 hiérarchie | 9 | offre dominante, fiche puis programme |
| Design 3 largeur | 8 | zone morte ~210 px à gauche du hero |
| Design 4 cohérence comptes | 9 | visiteur et gratuit identiques, abonnés identiques |
| Design 5 finition | 7 | faute dure 1 (16 px) |
| UX 1 prospect | 9 | offre en haut, fiche réelle, programme fermé |
| UX 2 abonné clarté | 9 | sommaire en tuiles, ancres |
| UX 3 envie de continuer | 8 | tuile 1 peu marquée, pas de progression (voulu) |
| UX 4 nouvel abonné | 9 | sommaire complet dès le premier jour |
| UX 5 accessibilité | 9 | `min-h-11`, focus ring au code, abonné non vérifié sur image |

NOTE GLOBALE Carnet : 7/10 (faute dure 1 présente ; 9 atteignable avec la correction 1 et la piste 1).

---

## Fautes dures (liste numérotée)
1. Favoris abonné : vide de 86 px au milieu de la carte vanne « Clique pour la chute » (1280 et 1920), `apps/web/src/components/espace/favoris/cartes-abonne.tsx` (`Actions`, retirer `mt-auto`).
2. Carnet visiteur et gratuit : carte d'offre du hero et tuile « Au programme » désalignées de 16 px (x 876 contre 860 à 1280, 1196 contre 1180 à 1920), `apps/web/src/components/espace/carnet/carnet-ouvert.tsx` (ligne 71, `lg:gap-12` en `lg:gap-x-6`).
