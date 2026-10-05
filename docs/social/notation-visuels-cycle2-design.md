# Notation cycle 2 des visuels sociaux (K3 visuels, K4 formats), @design, s15, 05/10/2026

Base : les 14 PNG de `docs/social/visuels-s15/v2/` tous ouverts un par un, `index.md`, code `cartes-piste-a.tsx`, `carte-marque.tsx`, `typo.ts`, comparaison avec les anciennes cartes (`ig-03-10-07.png` en témoin). Contrastes calculés (WCAG) ; tailles converties en pixels téléphone (390 px de large = ×0,36 sur 1080).

**Note K3 : 7,4 / 10** (cycle 1 : 3,4). **K4 : Instagram 8, X 7, LinkedIn 7**. Le prototype est une vraie marque (aplat violet, amorce puis chute, monogramme). Il reste de la finition, une décision de police et deux trous de couverture.

## 1. Décisions à trancher (recommandation ferme)

**Police : passer à Plus Jakarta Sans 800/700, abandonner Syne.** Vérifié : `layout.tsx` l.21-26 charge Plus Jakarta Sans (`--font-display`), `tailwind.config.ts` l.42 aussi. Syne n'est chargée nulle part sur le site : `design-system.md` l.36 est périmé, et mon audit s'est appuyé dessus (erreur d'audit, reconnue). Un visiteur qui passe de la carte au site change d'identité typographique (critère 4 « même identité » en échec). Syne 800 coûte aussi trois défauts visibles :
- Chiffres elzéviriens : « 45 minutes » (`ig-conseil-ironie-bienveillante-1.png`) et « n° 3 sur 5 » (`ig-article-se-presenter-2.png`) ont des 4, 5, 3 qui descendent sous la ligne ; le « 7 » de « Les 7 autres vannes » (`ig-article-halloween-3.png`) est déformé, le « 1 » est écarté.
- Chasse très large : lignes courtes et déchirées (« pendant » seul dans `ig-vanne-audioguide-2.png`, 5 lignes pour le titre Halloween), corps réduit par `corpsSansDebordement`.
- Le guillemet « de Syne est un chevron « qui se lit comme un bouton « retour arrière » (`ig-vanne-tgv-1.png`).
Effet d'affiche : il vient de l'aplat, de l'échelle et du blanc sur violet, pas du dessin des lettres. Plus Jakarta 800 est plus étroite, donc plus grosse à nombre de mots égal. Coût : 1 constante + 2 TTF. Une seule police d'affichage, jamais deux.

**X et LinkedIn, chute seule : oui, lisible, sous 3 conditions.** Le texte du post s'affiche au-dessus de l'image : le lecteur lit l'amorce puis découvre la chute, ce qui reproduit le glissement Instagram (`x-vanne-tgv.png`, `linkedin-vanne-tgv.png`).
1. Le tweet est l'amorce seule, mot pour mot, sans URL ni hashtag avant elle.
2. LinkedIn : l'amorce tient dans les 140 premiers caractères (avant « voir plus ») ; sinon repli sur une carte avec amorce et chute.
3. Texte alternatif de l'image = amorce + chute (accessibilité et capture isolée) [À VÉRIFIER : champ alt dans l'API Buffer].
Risque accepté : image partagée seule hors contexte, la chute est alors énigmatique, mais elle porte la marque.

**Espaces après « TGV, » et « L'audioguide » : défaut réel, pas mineur.** Écart d'environ 30 px au lieu de 15 (`ig-vanne-tgv-1.png` y≈650, `ig-vanne-audioguide-1.png`), et « voyagé  à » dans `x-vanne-tgv.png`, plus le « : » détaché de « d'Halloween : ». Cause : blocs flex + marge fixe 0,24 em. Se règle par le point 2 de la liste, pas par un réglage de marge.

**Textes provisoires :**
- « Extrait : n° 2 sur 8 » : garder le principe (donnée réelle, donne la raison de glisser) mais écrire « Vanne n° 2 sur 8 » et « Accroche n° 3 sur 5 » : le nom est déjà utilisé en slide 3, aucune invention.
- Titre du conseil en surtitre (« L'ironie bienveillante ») : valider, il nomme le concept ; contraste 7:1.

## 2. Grille V1 à V8

| Critère | Note | Preuve | Correction |
|---|---|---|---|
| V1 Arrêt du défilement | 7 (3) | Slides chute très fortes : `ig-vanne-audioguide-2.png`, `ig-conseil-ironie-bienveillante-2.png` (aplat, texte sur 60 % de la hauteur). Mais la slide 1 est celle de la grille de profil : `ig-vanne-tgv-1.png` = texte 64 px sur ~25 % de la surface, 480 px vides au-dessus, 23 px sur téléphone. | Amorce en 80 px / 800, chute 100 px, nombre 220 px (point 4). |
| V2 Lisibilité mobile | 7 (5) | Contrastes : blanc sur `#6D28D9` 7,1:1 ; `#A78BFA` sur `#0D0D0D` 7,1:1 ; `#B3B3B3` ≈ 9:1 ; `#8B5CF6` sur `#0D0D0D` 4,5:1 (gros texte seulement). Chute 84 px = 30 px téléphone. Mais label « ARTICLE » 28 px et pied 30 px = 10-11 px téléphone (`ig-article-halloween-1.png`). | Pied et label à 32 px minimum (11,5 px), chiffres alignés (point 3). |
| V3 Typo française | 7 (3) | Acquis : apostrophes ’, insécables, « n° », guillemets, aucun « les / aux » en fin de ligne. Défauts : « déguisée » orphelin ligne 5 (`ig-article-halloween-1.png`, la règle des 2 derniers mots saute au-delà de 18 caractères), « pendant » seul (`ig-vanne-audioguide-2.png`), trous d'espace, chiffres elzéviriens. | Points 1, 2, 3. |
| V4 Identité | 6 (3) | Aplat violet + monogramme + pied = signature reconnaissable sur les 14 cartes. Mais Syne absente du site, et monogramme en Inter 800 alors que le favicon est `system-ui` bold. | Plus Jakarta (point 1) ; monogramme gardé en Inter 800, proche du favicon. |
| V5 Mise en scène | 9 (4) | Fond sombre puis aplat : le changement de fond joue le rire (`ig-vanne-tgv-1.png` puis `-2.png`). Second temps isolé par un blanc de 48 px. Point manquant : la légende « amorce seule » n'est pas encore codée, non vérifiable ici. | Coder et tester la règle de légende. |
| V6 Adaptation type/réseau | 8 (2) | Étiquettes justes (ARTICLE, CONSEIL, aucune pour la vanne), formats 4:5, 16:9, 1,91:1. Manquent : couverture article X, couverture article et carrousel conseil LinkedIn, non rendus. | Point 9. |
| V7 Envie de partager/enregistrer | 7 (3) | Extraits réels = valeur à garder (`ig-article-halloween-2.png`, chute violette lisible), réplique de conseil à capturer. Mais la slide 3 (`ig-article-halloween-3.png`) : l'appel à l'action « Lien en bio » est le plus petit élément (40 px) et l'URL est répétée juste au-dessus du pied. | Point 6. |
| V8 Conformité/finition | 8 (4) | Zéro tiret cadratin, zéro mention IA, zéro concurrent, textes tirés des contenus validés. Retenues : deux textes provisoires, pagination redondante avec le compteur natif d'Instagram. | Points 7 et 8. |

Moyenne 7,4. Aucun débordement ni coupure constaté sur les 14 PNG ; marge droite la plus serrée : 19 px (`ig-article-se-presenter-2.png`, « qu'ils avaient »), à fiabiliser par la mesure réelle (point 2).

## 3. K4 formats par réseau

- **Instagram 8** : 4:5 correct ; marge de 96 px ≥ recadrage 3:4 de la grille (34 px par côté) [À VÉRIFIER sur le compte réel]. Bloquant 10/10 : carrousel Buffer non testé (`index.md` « Carrousel côté Buffer »).
- **X 7** : 1600×900, chute 76 px = 24 px à l'écran, lisible. Manque : couverture d'article et règle texte + alt.
- **LinkedIn 7** : 1200×627, chute 56 px = 18 px sur téléphone, lisible. Manque : couverture d'article, carrousel conseil, garde-fou « voir plus ».

## 4. Ce qu'il faut pour 10/10 (ordre d'application pour @fullstack)

1. **Police** : `FONT_TITRE = "Plus Jakarta Sans"`, TTF ExtraBold et Bold (OFL) dans `public/fonts/`, chargés par `loadFonts` (`image-generator.ts`). Inter reste pour pied et labels. Retirer Syne. Corriger `design-system.md` l.36 (hors de ce livrable).
2. **Mise en lignes mesurée** : remplacer blocs flex + `CHASSE_SYNE` par une césure calculée sur les largeurs réelles de glyphes de la police chargée ; chaque ligne = un `div` sans retour automatique, espaces normales. Équilibrer : dernière ligne ≥ 40 % de la plus longue, jamais un mot seul en fin ni en milieu (« pendant »), « : » collé au mot. Corps réduit par mesure, plancher 28 px. Supprime les trous d'espace et les orphelins sans toucher `typo()`.
3. **Chiffres** : vérifier au rendu « 45 », « n° 3 sur 5 », « 7 », « 1 » : tous alignés sur la ligne de base.
4. **Tailles** (Instagram) : amorce 80/800, chute 100, titre couverture 76, nombre 220, pied et label 32. X : chute 88. LinkedIn : chute 60.
5. **Guillemet** : « de Plus Jakarta 800 ; si la forme évoque encore un bouton, le retirer de l'amorce vanne et le garder sur extraits et répliques.
6. **Slide 3 article** : supprimer « sur deviens-marrant.fr » (le pied le porte), « Lien en bio » dans un bouton blanc, texte `#6D28D9`, 40 px / 800, rayon 12 px (token `lg`), sous « Les N autres vannes ».
7. **Surtitre extrait** : « Vanne n° N sur T » / « Accroche n° N sur T » (nom repris de la slide 3).
8. **Pagination** « n/N » retirée (compteur natif Instagram) ; « Glisse → » gardé sur les slides 1.
9. **Couverture** : rendre X article (1600×900, sans pagination), LinkedIn article (1200×627, sans étiquette), LinkedIn conseil (1080×1350). Test de charge : vanne de 6 mots, vanne de 25 mots, titre de 90 caractères, nombres 1, 7, 12.
10. **Règles de publication** : tweet = amorce seule, LinkedIn amorce dans les 140 premiers caractères, alt = amorce + chute, légende Instagram = amorce seule.
11. **Test Buffer** : brouillon de carrousel 2 et 3 images avant tout branchement (bloquant K4).
12. **Contrôle final** : regénérer les 14 PNG, les réduire à 390 px de large pour relire, vérifier la vignette 3:4, puis nouvelle notation @design (cible 10/10 sur V1 à V8).
