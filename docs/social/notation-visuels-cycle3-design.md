# Notation cycle 3 des visuels sociaux (K3 visuels, K4 formats), @design, s15, 05/10/2026

Base : les 24 PNG de `docs/social/visuels-s15/v3/` ouverts un par un, plus 6 PNG de `charge/` (vanne 25 mots, repli LinkedIn, titres 90 caractères x3, « 7 »), `index.md`, `alt.json`, polices de `apps/web/public/fonts/`, `docs/design/design-system.md` l.36, règle R6 de `strategie-relance-v4.md`. Contrastes recalculés : blanc sur `#6D28D9` 7,1:1 ; `#A78BFA` sur `#0D0D0D` 7,1:1. Pixels téléphone = ×0,36 (390 px).

**Note K3 : 8,5 / 10** (cycle 2 : 7,4). **K4 : Instagram 8, X 8,5, LinkedIn 7,5.** Les 12 points du cycle 2 sont appliqués sur 9 ; il reste un écart de règle (R6), une contradiction avec la v4 (bouton LinkedIn) et le test Buffer jamais fait.

## 1. Les 12 points du cycle 2, un par un

| # | Point | Verdict | Preuve |
|---|---|---|---|
| 1 | Police Plus Jakarta 800/700 | Appliqué | Toutes les cartes ; `PlusJakartaSans-*.ttf` présents, aucun fichier Syne ; `design-system.md` l.36 corrigé |
| 2 | Césure mesurée | Appliqué, 2 coupes faibles | Plus de trou ni de mot seul (`ig-vanne-audioguide-2.png`) ; reste « On n'en / a jamais parlé » (`ig-vanne-tgv-2.png`), « 8 vannes » à 37 % de la ligne suivante (`ig-article-halloween-1.png`) |
| 3 | Chiffres sur la ligne de base | Appliqué | « 45 » (`ig-conseil-ironie-bienveillante-1.png`), « n° 3 sur 5 » (`ig-article-se-presenter-2.png`), « 7 » et « 12 » (`charge/ig-titre-7.png`, `ig-titre-90-car-12.png`) |
| 4 | Tailles | Appliqué | Amorce 80, chute 100, pied 32 (11,5 px téléphone), nombre 220 ; X chute 88 (`x-vanne-tgv.png`), LinkedIn 60 |
| 5 | Guillemet | Partiel | Retiré de l'amorce et des extraits ; conseil garde un « géant noir, voir §2 |
| 6 | Slide de fin | Appliqué | `ig-article-halloween-4.png` : bouton blanc 287x94, texte violet, URL retirée |
| 7 | Surtitre « Vanne n° N sur T » | Appliqué | `ig-article-halloween-2.png`, `ig-article-se-presenter-2.png` |
| 8 | Pagination retirée, « Glisse → » en slide 1 | Appliqué | Aucune pagination ; « Glisse → » sur les 5 slides 1 |
| 9 | Couvertures et test de charge | Appliqué | `x-/linkedin-article-*.png`, `linkedin-conseil-*-1 à 3.png`, 11 PNG `charge/` (6 mots, 25 mots, 90 caractères, 1/7/12) |
| 10 | Règles de publication | Partiel | `alt.json` 35 entrées, amorce + chute ; mais « Lien en commentaire » contredit la v4 (§3) |
| 11 | Test Buffer carrousel 2 et 3 images | **Non fait** | Aucune trace (`index.md` n'en parle pas, aucun doc) ; reste bloquant K4 |
| 12 | Contrôle final 390 px et vignette 3:4 | Fait par moi | Marge gauche 96 px et « Glisse → » à 100 px du bord : la découpe 3:4 (34 px par côté) ne coupe rien |

## 2. Cohérence avec R6 (vanne à la 1re personne entre « »)

**Non appliquée sur aucune carte.** Vannes nues : `ig-vanne-audioguide-2.png` (« J'ai hoché »), `ig-vanne-tgv-2.png`, `x-vanne-tgv.png`, `linkedin-vanne-tgv.png`, `ig-article-halloween-2/-3.png`, `ig-article-se-presenter-2/-3.png`, `charge/linkedin-vanne-repli.png`. Le niveau 1 « la timidité » devrait être imbriqué en “ ” dans un « » (R6 et IG2 de la v4). `alt.json` sans guillemets non plus. La slide de réplique du conseil (`ig-conseil-ironie-bienveillante-2.png`) garde un « noir de 90 px, sans » fermant : à cette taille il se lit comme une icône « retour arrière » (défaut déjà relevé au cycle 2, atténué mais pas supprimé).

**Affichage élégant, à spécifier à @fullstack :**
- Une paire par ligne de vanne, comme les articles : amorce = 1 paire ; chute = 1 paire par phrase (« J'ai voyagé à genoux devant lui. » puis « On n'en a jamais parlé. », séparées par le blanc de 48 px existant). Conseil : 1 paire autour de la réplique entière, le « géant supprimé.
- Guillemets de la même police et du même corps que le texte, en lilas (`#A78BFA` sur noir ; `#DDD6FE` sur l'aplat, 5,0:1), espace fine insécable (U+202F) à l'intérieur, jamais en blanc : la voix reste blanche, la citation se lit sans concurrencer.
- Ponctuation suspendue : « à 70 % du corps, accroché dans la marge (bord gauche ≥ 48 px, hors zone de découpe 3:4), pour que toutes les lettres restent alignées à x = 96 ; » fermant collé au dernier mot (mesure-texte le compte dans la ligne). Repli si la marge ne tient pas : en ligne, 100 %, première ligne seule décalée.
- Imbriqué : “ ” (Plus Jakarta a les glyphes) ; ajouter au test de charge « Dans le groupe… “des nouvelles de Maxime ?” » (IG3 de la v4).
- Surtitres, boutons, pied : jamais de guillemets (la marque ne parle pas au nom de quelqu'un).

## 3. Notes V1 à V8

| Critère | Note (c2) | Preuve | Correction |
|---|---|---|---|
| V1 Arrêt du défilement | 8 (7) | Chutes fortes (`ig-vanne-audioguide-2.png`). Slide 1 : 4 lignes à 80 px sur 18 % de la hauteur, 600 px de noir sous le bloc (`ig-vanne-tgv-1.png`) | Amorce à 88-96 px quand elle tient en 4 lignes, bloc centré à 40 % de la hauteur |
| V2 Lisibilité | 9 (7) | Chute 36 px téléphone, contrastes ≥ 7:1, pied 11,5 px | Aucune bloquante |
| V3 Typo française | 8,5 (7) | Apostrophes ’, insécables, pas d'orphelin, point et virgule rapprochés (« TGV, la ») ; défauts : « On n'en / a jamais parlé », « 8 vannes » (37 %), trait d'union de « stand-upper » qui se lit comme un demi-cadratin (`charge/ig-titre-7.png`) | Points 4 et 5 de la liste |
| V4 Identité | 9,5 (6) | Même police que le site, aplat, monogramme, pied sur les 24 cartes | Chiffre « 8 » décalé de 8 px vers la droite (x = 105 contre 97) : le recaler |
| V5 Mise en scène | 9 (9) | Noir puis violet, second temps isolé (`ig-vanne-tgv-2.png`) | Les guillemets R6 renforcent le « dit » |
| V6 Adaptation réseau | 8 (8) | Étiquettes et formats justes ; mais carrousel décryptage IG3 (cartes 3 « Pourquoi ça fait rire » et 4 « À toi de jouer », mer. 14/10) sans gabarit ; v4 prévoit 2 cartes pour un relais, v3 en rend 4 | Gabarits des cartes 3 et 4 ; @social tranche 2 ou 4 cartes de relais |
| V7 Partage / enregistrement | 8,5 (7) | Chute isolée, réplique à capturer, bouton net (`ig-article-halloween-4.png`) | Légende « À envoyer à... » à brancher (v4 R3) |
| V8 Conformité | 7,5 (8) | Zéro tiret cadratin, zéro IA, textes sourcés. Retenues : R6 absente, bouton « Lien en commentaire » (`linkedin-conseil-ironie-bienveillante-3.png`) alors que la v4 §2.7 et R5 interdisent le premier commentaire (lien dans le corps) | Bouton « Lien dans le post » ; R6 |

Moyenne 8,5.

**K4.** Instagram 8 : 4:5 sûr au recadrage 3:4 ; Buffer non testé. X 8,5 : 1600x900, couvertures propres ; titre de 90 caractères à 4 lignes à 30 px du pied (`charge/x-titre-90-car-12.png`), limite acceptée sur des titres réels de 55 caractères. LinkedIn 7,5 : 1200x627 propre ; le carrousel conseil en images sort en mosaïque dans le fil, pas en défilement, et « Glisse → » devient faux `[À VÉRIFIER avec @fullstack / Buffer : image multiple contre document PDF]`.

## 4. Passe de contrôle : un correctif a-t-il créé un défaut ?

- **Coupe préférée après « : »** (césure) : crée la couverture en entonnoir inversé (795 / 315 / 843 px, `ig-article-halloween-1.png`). Défaut mineur.
- **Retrait du chevron (cycle 2, point 5)** : conforme au cycle 2, mais fait diverger les cartes de R6 écrite le même jour ; défaut de cohérence, pas de rendu.
- **Passage à Plus Jakarta** : crée le trait d'union long. Aucun titre publié n'en contient (« stand-upper » seulement en charge).
- **Bouton LinkedIn** : issu de la stratégie v2, périmé par la v4. Défaut de contenu créé par la dérive documentaire.
- Aucun débordement, aucun mot seul, aucun espace double, aucune collision nouvelle sur les 24 PNG livrables.

## 5. Ce qu'il faut pour 10/10 (ordre d'application pour @fullstack)

1. **R6 sur toutes les cartes vanne** (spec §2) : regénérer `ig-vanne-*`, `ig-article-*-2/-3`, `x-` et `linkedin-vanne-tgv`, `charge/linkedin-vanne-repli`, `ig-conseil-*-2` et `linkedin-conseil-*-2` ; “ ” imbriqués ; `alt.json` avec « ».
2. **Bouton LinkedIn** « Lien dans le post » (`linkedin-conseil-*-3.png`), alt aligné.
3. **Test Buffer** : brouillon de carrousel 2, 3 et 4 images Instagram ; LinkedIn en images multiples contre PDF (si mosaïque, exporter le carrousel en document PDF 1080x1350 et retirer « Glisse → » des images).
4. **Césure** : ne jamais séparer « n'en », « l' », « s' », « t' » du verbe (« On n'en a / jamais parlé »), dernière ligne et ligne intermédiaire ≥ 40 % de la plus longue (couverture Halloween : 795 / 560 / 540) ; recaler le chiffre géant de 8 px.
5. **Trait d'union** : glyphe d'Inter (plus court) ou espace insécable fine ; tester « stand-upper » à 76 px.
6. **Titre à 4 lignes en X** : plafond de 3 lignes ou suppression du nombre géant (30 px au-dessus du pied sinon).
7. **Gabarits décryptage IG3** (cartes 3 et 4) et décision 2 ou 4 cartes pour le relais, avant le 14/10.
8. **Amorce slide 1** à 88-96 px, bloc à 40 % de la hauteur (V1 8 vers 9).
9. **Contrôle final** : regénérer, réduire à 390 px, vérifier la vignette 3:4 avec les « suspendus, puis notation cycle 4 (cible 10/10 sur V1 à V8).
