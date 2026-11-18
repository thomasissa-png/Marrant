# Relecture DESIGN à l'aveugle, Favoris et Carnet, s26 tour 2

Captures lues : `docs/captures/s26/encarts-favoris-carnet-tour-2/{favoris,carnet}/` (375, 768, 1280, 1920 selon compte) et `carnet-fenetres/` (en-cours 375 et 1280, 3 positions). Code consulté : `carnet-page.tsx` et `favoris-list.tsx` (ce sont les rendus FERMÉS ; le rendu ouvert vit dans `components/espace/...`, non relu au code : les points « à vérifier » ci-dessous sont déduits du rendu).

## Gate typographique (`favoris/TAILLES.md`, `carnet/TAILLES.md`, premier écran)
| Page | Compte | Tailles | Combinaisons | Verdict |
|---|---|---|---|---|
| Favoris | visiteur, gratuit, en-cours | 4 (24 ou 30, 20, 16, 14) à 375/768/1280/1920 | 6 | PASS |
| Favoris | nouvel | 3 (24 ou 30, 16, 14) | 5 | PASS |
| Carnet | visiteur, gratuit | 4 (24 ou 30, 20, 16, 14) | 5 à 375/768 et 6 à 1280/1920 | PASS |
| Carnet | en-cours, nouvel | 3 (24 ou 30, 16, 14) | 4 | PASS |

Graisses 400/600 seulement, aucune capitale dans le contenu (les capitales PRODUIT/LÉGAL sont le pied de page global). Aucune taille ajoutée.

## FAVORIS

### Ce qui est juste
- Aperçu (visiteur, gratuit) : se lit fermé (pastille Premium unique, verrous, tuile Vidéo estompée avec fondu, offre en haut à droite, bouton y 203 à 1280, y 347 à 375). Extrait 5/7 à 1280, vanne et conseil de même hauteur (193 px), rangée Vidéo pleine largeur : la largeur est utilisée.
- Abonné : rail 3 + liste 9, onglet actif au filet blanc, effectifs alignés à droite, première carte teintée (`CARTE_ACTION`) sans second aplat. Vide (nouvel) : un seul bouton plein, rail conservé, étoile discrète. 1920 : colonne bornée à 1 216 px, rien de creux.
- Un seul aplat par écran abonné ; deux offres violettes sur l'aperçu mais jamais ensemble au premier écran (la seconde est à y 870+ à 1280, 983+ à 375).

### Fautes dures
1. **Vide de 106 px au milieu d'une carte, 768, en-cours** (`en-cours-favoris-768.png`) : la carte « Vanne » de droite s'étire à la hauteur du conseil (« Clique pour la chute » finit à y 807, le séparateur est à y 913 ; vide d'environ 106 px entre contenu et séparateur, seuil 32). Cause : grille `md:grid-cols-2` en `items-stretch` avec séparateur poussé en bas. Fichier : `components/favoris/favoris-list.tsx` (grille ouverte, `md:` seulement) ou le composant de carte du rail ouvert. Correction : `md:items-start` comme à `lg`, ou séparateur à `mt-6` juste après le contenu (pas `mt-auto`). 1280/1920 ne l'ont pas (cartes en `items-start`, hauteurs 302 et 250).

### Notes /10
| Critère | Note | Justification |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 9 | retenue, 1 accent ; l'icône ronde de partage jure avec le lien souligné « Retirer » juste à côté (deux langages dans la même rangée) |
| 2 Hiérarchie | 9 | aperçu : offre dominante ; abonné : carte teintée en tête |
| 3 Largeur 5 largeurs | 8 | faute dure 1 à 768 ; hero aperçu à 1920 : texte s'arrête à x 720, offre commence à x 1195, soit 475 px de noir (piste, pas faute : c'est le jeu 8/4 d'un hero) |
| 4 Cohérence entre comptes | 9 | même gabarit ; gratuit 768 passe l'offre en horizontal (bouton à gauche, réassurance à droite, décalés verticalement) |
| 5 Finition pixel | 8 | pastille de partage décalée de 3 px à gauche du texte de la carte (cercle x 364, texte x 367) ; écart rangée d'onglets / première carte d'environ 53 px à 375 et 768 (spec : `gap-6` 24 px) ; cibles 44 px non vérifiables au code ouvert |

**NOTE GLOBALE Favoris : 8/10**

### Pistes (max 3)
- P1 : à 768, `items-start` (ou séparateur collé au contenu) dans la grille de liste. Règle la faute 1.
- P2 : « Partager » en lien `META underline underline-offset-2 min-h-11` comme la spec §2.3 (le cercle icône seul contredit la spec et le principe label texte > icône ; aligne aussi le bord gauche sur le texte).
- P3 : resserrer rangée d'onglets vers liste à 375/768 (`gap-6` réel, supprimer le `mb`/padding de `RangeeOnglets`), mesurer.

## CARNET

### Ce qui est juste
- Visiteur 1280 : hero 8/4, offre en haut, fiche 8 + « Au programme » 4 sticky, fiche en 2 colonnes, offre de fin sous la fiche, aucun bloc creux. 375 : bouton y 227*1,65 = 375 < 700, ordre lisible. 768 : offre horizontale, programme, fiche en 2 colonnes.
- Abonné 1280 : sommaire 4/4/4, 12 tuiles visibles dès le premier écran, aucune zone morte, aucun bouton plein, première tuile au filet blanc. Fiches : rail 3 + fiche 9, intérieur 2 colonnes, « Retour au sommaire » en lien souligné après chaque fiche. Bas de page : « Les carnets précédents » aligné à gauche, pastille unique.
- 375 : fiche lisible, blocs « On te dit » / « Tu réponds » bien rythmés, padding 24 px.

### Fautes dures
2. **Rail des fiches tronqué (à confirmer au code)** (`en-cours-carnet-1280-2-milieu-fiche.png`, `-3-bas-de-page.png`) : le rail se termine à « 17. Des piles et un mystère » dans les deux captures, y compris en bas de page, alors que le carnet a 30 situations : 13 entrées sur 30 invisibles. S'il s'agit d'un `max-h` + `overflow-y-auto`, aucun indice de défilement n'existe (pas de fondu, pas de scrollbar) ; sinon c'est une troncature. Fichier : `components/espace/carnet/carnet-ouvert.tsx` (rail `lg:sticky lg:top-24`). Correction : `lg:max-h-[calc(100dvh-8rem)] overflow-y-auto` avec défilement automatique vers l'élément `aria-current`, plus fondu bas ; ou rail scindé en 2 colonnes.

### Défauts non classés « durs » (abaissent la note)
- Rail : titres 1 à 9 commencent à x 96, 10 à 17 à x 105 (décalage de 9 px) : numéro sans largeur fixe. Correction : `tabular-nums` + `min-w-[3ch]` ou `w-8` sur le numéro. Lignes à deux titres (3, 4, 5, 7, 8) : texte de 40 px dans `min-h-11`, 0 px d'air vertical contre 12 px pour les lignes simples ; correction `py-2` sur chaque ligne.
- Tuile active du sommaire : le filet `border-l-2` décale le texte de 1 px par rapport aux tuiles voisines de la même colonne (« 1 » x 58, « 4 » x 57). Correction : `border-l` 1 px + `shadow-[inset_2px_0_0]` blanc, ou `-ml-px`.
- Sommaire à 375 : 30 tuiles de 114 px empilées, 4 116 px avant la première fiche (selon `INDEX.md`). Techniquement conforme, mais la fiche est à 5 632 px de défilement. Piste ci-dessous.
- Visiteur 1280 : sous « Au programme » la colonne de droite reste vide sur 230 px (y 745 à 975) : vide de fin de colonne, permis.

### Notes /10
| Critère | Note | Justification |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 9 | sobre, cohérent avec Favoris |
| 2 Hiérarchie | 9 | visiteur : offre dominante ; abonné : sommaire sans zone dominante mais la première tuile marquée suffit |
| 3 Largeur | 8 | rail à 17/30 (faute 2) ; 375 : longueur du sommaire |
| 4 Cohérence entre comptes | 9 | visiteur et gratuit identiques ; en-cours et nouvel identiques (pas de suivi simulé) |
| 5 Finition pixel | 8 | décalages de 9 px (rail) et 1 px (tuile active), lignes de rail serrées |

**NOTE GLOBALE Carnet : 8/10**

### Pistes (max 3)
- P1 : rail : défilement interne + `aria-current` suivi + numéro à largeur fixe + `py-2` par ligne (règle faute 2 et décalages).
- P2 : sommaire sous 768 en liste compacte (`divide-y`, lignes `min-h-11`, numéro + titre sur une ligne, contexte en `META` à droite) : environ 1 400 px au lieu de 4 116 px, sans taille nouvelle.
- P3 : aligner le texte de la tuile active (bord gauche 1 px + filet interne) pour supprimer le décalage de 1 px.

## Liste numérotée des fautes dures
1. Favoris, 768, vide de 106 px au milieu de la carte « Vanne » étirée : `apps/web/src/components/favoris/favoris-list.tsx` (grille ouverte, séparateur/`items-stretch`).
2. Carnet abonné, rail des fiches limité à 17 entrées sur 30 sans indice de défilement (à confirmer au code) : `apps/web/src/components/espace/carnet/carnet-ouvert.tsx`.
