# Relecture UX à l'aveugle : navigation v6, variantes A, B, C (s25)

Méthode : lecture de la spec `navigation-v6-menu-rubriques.md`, de la référence de Thomas et du persona (Yanis, 20 ans, introverti, mobile d'abord), puis des captures `nav-v6/variantes/` : pour chaque variante, visiteur-vannes 375, 768, 1280, 1920, abonné-aujourd'hui 375 et 1280, gratuit-aperçu 375 et 1280, abonné-vannes-menu-1280. Aucune relecture existante lue. Les mesures en px CSS sont déduites des captures (facteur 2 à 375, 1,5625 à 1280) : à confirmer au DOM, elles ne remplacent pas `header-budget`.

## 1. Constats par variante

### A : bande sous l'en-tête, texte seul, soulignement actif

- Bande pleine coque sous l'en-tête, alignée sur le logo à 1280 et 1920. Les 13 entrées (5 + 5 + 2 + « … ») sont visibles d'un coup dès 1280 pour les trois états. « Menu toujours affiché » respecté.
- Actif : texte blanc plein + soulignement violet sous le chip, lisible sans la teinte (le blanc contre le gris et le trait). À 375, la rubrique active est centrée (visiteur sur Vannes : « S'entraîner cadenas | Vannes Conseils Vidéos »), l'abonné sur Aujourd'hui est collé à gauche (borne respectée).
- Premium : cadenas fin après le libellé, même couleur que le texte, regroupé à gauche d'un blanc. Lisible, discret. Sur l'aperçu (Quoi répondre), le chip reste allumé avec son cadenas, la fiche « Coloc : la poêle » est réelle, pas de mur.
- 768 : fondu visible à gauche (« ndre ») et à droite (« F »), signal de défilement correct.
- Défauts : (a) les séparateurs 1 px de la spec ne se voient pas, seuls des blancs séparent les groupes ; (b) hauteur de bande mesurée environ 36 px à 1280 et 50 px (bordure comprise) à 375, contre 49 annoncés : cible 44 px non prouvée par la capture ; (c) à 375, aucun fondu net à droite (« Vidéos » coupé net à 718/750) ; (d) à 1280 visiteur, « … » finit environ 38 px avant le bord de la coque, sous le plancher de 80 px de la spec ; (e) « … » n'est atteignable qu'au bout du défilement à 375 et 768 ; (f) le sous-titre d'aperçu affiche « [À VALIDER PAR THOMAS] » dans la page, et à 1280 « THOMAS] » retombe seul sur une ligne.

### B : bande en pastille, chip actif en pilule pleine

- Même structure que A, la bande est une pastille arrondie fond gris. Actif : pilule violet très sombre autour du libellé, texte un peu plus clair.
- La pilule (violet sombre sur gris sombre) contraste peu avec la bande ; l'état repose surtout sur la teinte et une légère différence de blanc, pas de trait ni de graisse. Chip visible environ 36 px de haut dans une pastille de 44 px.
- Bloc sticky à 375 : environ 116 px contre 100 en A : 16 px de contenu perdus sur un téléphone de 667 px.
- La pastille encadre bien « une barre », mais ajoute une couche de décor sans gagner en groupement : les groupes ne sont toujours séparés que par des blancs. À 768, la pastille coupe « dre » et « Fa » dans ses bords arrondis (rendu moins propre que le fondu de A).
- Mêmes défauts (a), (e), (f) que A.

### C : rubriques dans l'en-tête, « … » en débordement

- Les liens sont dans la barre d'en-tête de 65 px ; pas de seconde bande. À 1280 visiteur : seulement Aujourd'hui, Parcours, Vannes, « … » ; abonné : Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Vannes, Conseils, « … ».
- Le menu « … » ouvert à 1280 (abonné) ne contient que Mes questions et Mes répliques : S'entraîner, Vidéos, Articles, La lettre, Favoris, Carnet n'apparaissent nulle part. Elles sont inatteignables d'un geste. À 1920 le visiteur n'a toujours que 3 entrées alors qu'il reste environ 700 px libres dans l'en-tête.
- Visiteur sur 1280 : 2 cadenas seulement visibles sur 5 ; il ne peut pas deviner qu'il y a cinq rubriques Premium. Un abonné sur Vidéos ou Articles n'a aucune rubrique allumée (« … » ne s'allume pas dans la capture).
- Points forts : en-tête le plus léger (aucun bloc de plus), à 375 et 768 identique à A (bande défilante). Le défaut est propre aux largeurs desktop, et il contredit la décision du fondateur (menu toujours affiché) et la spec (§1, la bande a été choisie justement parce que l'en-tête ne tient que 5 chips).

## 2. Notes /10

| Critère | A | B | C |
|---|---|---|---|
| 1 Orientation (actif visible à toutes les largeurs) | 9 | 8 | 5 (actif perdu si la rubrique est dans « … ») |
| 2 Découvrabilité (toutes vues ou à un geste) | 8 | 8 | 3 |
| 3 Premium compris sans agresser | 8 | 8 | 5 |
| 4 Charge cognitive | 7 (13 entrées, groupes par blancs) | 7 (idem + décor + 16 px) | 8 (peu d'éléments, mais parce qu'on en cache) |
| 5 Accessibilité visible | 8 | 6 (pilule peu contrastée, état à la teinte) | 8 |
| **Globale = minimum** | **7** | **6** | **3** |

## 3. Variante recommandée : A

Elle seule cumule la bande complète (décision respectée), un état actif lisible sans teinte, et le coût vertical le plus bas. B n'apporte que du décor et un état moins accessible ; C casse « toujours affiché ».

## 4. Retouches codables qui mènent A à 10

1. **Séparateurs visibles** : entre groupe 1 et 2, et entre 2 et 3, un `span` `w-px h-5 bg-border` `aria-hidden` avec 12 px de marge de chaque côté (la spec les prévoit, la capture ne les montre pas). Résultat : 4 paquets lisibles (5 | 5 | 2 | …), charge 9.
2. **Actif double cue** : ajouter à l'actif le `bg-background-elevated` de la spec §1 (absent de la capture) et passer le soulignement de 2 à 3 px sur toute la largeur du chip (la graisse reste inchangée pour ne pas bouger le budget de largeur). `aria-current="page"` sur le lien.
3. **Cibles 44 px prouvées** : `min-h-11` (44 px) sur chaque `a` de la bande et sur « … » ; bande à 49 px ; ajouter au test `header-budget` une assertion de hauteur de boîte ≥ 44 pour tous les chips à 375, 768, 1280. Aujourd'hui la hauteur visible mesurée est inférieure.
4. **Fondus de défilement** : à 375 et 768, dégradé de 24 px `from-background to-transparent` à droite tant qu'il reste du contenu, à gauche dès qu'on a défilé (spec §3, absent à 375 sur la capture). Test visuel : un chip toujours coupé net à droite = échec.
5. **Plancher de largeur à 1280** : mesurer au Chrome de la CI visiteur 1280 ; si moins de 80 px libres (la capture suggère environ 38), réduire l'écart entre chips (16 vers 12 px) ou les marges de séparateur, sans réduire la cible 44 px (padding horizontal seul).
6. **« … » atteignable en mobile** : à 375 et 768, il est en queue de défilement. Option à trancher par Thomas : doublon de Mes questions et Mes répliques dans le menu Menu pour l'abonné (2 lignes ajoutées au menu mobile court). Si refusé, ajouter un fondu de fin de liste et laisser tel quel (note 9 sur le critère 2).
7. **Cadenas** : taille 14 px, couleur `text-text-secondary` (conforme). Ajouter l'infobulle clavier/survol « Premium » sur le cadenas [texte à valider par Thomas] et conserver le nom accessible « {rubrique}, rubrique Premium » [à valider par Thomas].
8. **Aperçu** : retirer de la page l'étiquette « [À VALIDER PAR THOMAS] » (artefact de maquette, et orphelin « THOMAS] » à 1280). Vérifier hors capture que le bloc offre (un seul bouton plein) est présent sous la fiche : les captures s'arrêtent avant.
9. **Page sans rubrique** (accueil, abonnement) : début de bande, aucun chip allumé, aucun artefact de soulignement ; à joindre aux captures de recette (non fournies ici).
10. **« … » allumé** sur Mes questions et Mes répliques, avec soulignement identique aux chips (à vérifier : aucune capture de la page).

Aucun texte nouveau hors points 7 et 6 (option) ; ils sont à valider par Thomas.

## 5. Limites de la relecture

Captures de l'abonné et du gratuit à 768 et 1920, états « page active en milieu et fin de bande » et pages d'aperçu au-delà du premier écran non examinés. Les mesures en px sont déduites des images.

RECOMMANDÉE : A — NOTE : 7/10
