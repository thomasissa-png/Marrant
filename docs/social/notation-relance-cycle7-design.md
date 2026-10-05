# Notation relance cycle 7 (@design, 05/10/2026) : K3 Visuels, K4 Formats

Base : ma notation cycle 6, `v5-linkedin/` (2 PNG ouverts + `alt.json`), `carte-linkedin.ts`, `strategie-relance-v5.md` §8-9, `REPLIT_ACTIONS.md`, `v4/index.md`, `notation-relance-cycle6-social.md` et `-qa.md`. **Limite de cet environnement** : pas de shell ni d'accès réseau (Read, Glob, Write seulement). Je n'ai pas pu lancer `curl`, appeler Buffer, redimensionner un PNG ni lire la branche déployée : toute preuve « prod » ci-dessous est celle consignée par @fullstack ou la session, pas la mienne. Positions lues à l'oeil (± 3 px).

## 1. Notes sur l'état réel

| Critère | Cycle 6 | Cycle 7 | Raison |
|---|---|---|---|
| **K3 Visuels** | 10 | **9,5** | Les 2 cartes LinkedIn passent les 10 critères au rendu 1080 px (§3). Le périmètre a grandi (15 cartes) et deux conditions que j'avais posées restent sans preuve : lecture à 390 px, rendu prod de la carte LinkedIn. Aucun cas de charge LinkedIn (chute longue). |
| **K4 Formats** | 9 | **9** | X texte seul : 10 (décision tranchée, R1 prouvé par brouillon réel). Instagram : 9 (rendu prod et temps relevés, Buffer jamais appelé avec l'URL réelle). LinkedIn : 9 (texte 10 hier ; l'image est déployée mais jamais passée par Buffer, repli texte prévu dans le code). |

## 2. Ma liste du cycle 6, point par point

| Point | Statut | Preuve |
|---|---|---|
| Brouillons Buffer IG 2 et 4 images par `/api/social/image?postId=…&slide=N` | **Pas fait** | `v4/index.md` l.55 : PNG servis par `raw.githubusercontent.com` (commit `86521ff`). Même mention `REPLIT_ACTIONS.md` l.83. Aucun brouillon plus récent consigné. |
| Temps de réponse de `/api/social/image` | **Fait pour Instagram** | @qa : slide 0 en 3,4 s, slide 1 en 2,1 s, 200 `image/png` (66 et 54 Ko), à froid. `REPLIT_ACTIONS.md` l.41 : cartes vérifiées en prod. **Pas fait pour LinkedIn** : aucun `curl` consigné. |
| Brouillon Buffer LinkedIn, image unique réelle, puis suppression | **Pas fait** | `REPLIT_ACTIONS.md` l.25 le liste en « Après déploiement » ; le bilan de déploiement (l.3-8) ne le mentionne pas. |
| 3 PNG X/LinkedIn rendus et relus | **Fait, périmètre réduit** | LinkedIn : `li-v074-rome.png` et `li-v044-nicolas.png`, 1080×1350 (confirmé par `alt.json`), relus (§3). X : 16:9 abandonné (X reste en texte, test à J+28), donc 0 PNG X attendu. Le 3e PNG prévu (vanne à 5 lignes) n'existe pas et personne n'a rendu de chute longue en 4:5. |
| Contrôle au zoom 390 px de `ig2-mimes-1`, `ig3-1`, `ig3-4` | **Pas fait** | Rien de consigné ; je n'ai pas d'outil d'image ici. Estimation seulement (§3). |
| Correction `strategie-relance-v5.md` §8 l.163 | **Fait** | L.163 : « X : texte par défaut ; test d'une carte unique 16:9 à partir de J+28 ; LinkedIn : texte + carte unique 4:5 en test ». |
| Correction §9 et IG2 | **Fait** | L.168 : « IG2 retenu : A, mimes ». L.177 : bandeau « gagnants du départage 05/10 » ; L.181 et L.183 : anciens « Retenu » barrés. |
| Plafonds de mots `[HYPOTHÈSE à confirmer au rendu de @design]` (l.165) | **Ouvert** | Vanne 25, carte 3 : 30, carte 4 : 35 mots : jamais testés par un rendu de charge en 4:5. À confirmer ou retirer. |
| Test de composition « aucun mot seul, aucune ligne < 40 % » | **Non vérifié** | Aucun fichier de test `*carte-linkedin*` trouvé (Glob). « Jest 3 133 PASS » ne dit pas s'il couvre la carte LinkedIn. |

## 3. Lecture des 2 PNG LinkedIn (critères Thomas)

| Carte | Constat chiffré |
|---|---|
| Rome | « Ça fait 2h. / On vient / de récupérer / les valises. » Colonne de texte à x ≈ 146 (même colonne que Instagram). « ouvrant à 57-118, » fermant à 697-757 en lilas clair, collé au dernier mot. Ligne la plus courte « On vient » : 414 px sur 635, soit 65 %. Bloc de 425 à 860 px, centre à 47 % de la hauteur. Pied logo + `deviens-marrant.fr` à y ≈ 1218. |
| Nicolas | 4 lignes, dernière « Julien, on ne sait pas. » Ligne la plus courte « Nicolas est » : 374 px sur 714, soit 52 %. Aucun mot seul. « à 83-127, » à 885-928 (marge droite ≈ 152 px). Même colonne x ≈ 146. |

Critères : PRO, BEAU, BRAND-ALIGNED (violet marque, logo « d », pied), MÊME IDENTITÉ (même gabarit que les cartes chute Instagram), PROPRE, ALIGNÉ, AÉRÉ (≈ 425 px libres au-dessus de Rome, 490 au-dessus de Nicolas), CONVERSION (pas d'action sur la carte, voulu : le lien est dans le post), HIÉRARCHIE (un seul bloc blanc sur aplat, lisible les yeux plissés), ACCESSIBLE (blanc sur l'aplat violet, contraste visuellement très au-dessus de 4,5:1 (ratio exact `[À MESURER]` sur la valeur du token) ; alt = amorce + chute avec « » dans `alt.json`) : **tous PASS à 1080 px**.

Défauts mineurs, non bloquants : (1) corps différent entre les deux cartes, environ 104 px (Rome, interligne 117) contre environ 74 px (Nicolas, interligne 83) : deux posts voisins dans le fil auront un poids visuel inégal ; (2) « On vient / de récupérer » coupe le groupe verbal (goût) ; (3) la colonne de texte (146) et le logo du pied (96) ne partagent pas la même marge, comme sur Instagram.
**Lecture à 390 px (estimation, non mesurée)** : échelle 0,361 ; corps de la chute ≈ 27 px (Nicolas) à 38 px (Rome), espaces entre mots ≈ 9 px, pied ≈ 11,6 px. Lisible, au niveau des cartes Instagram déjà validées.

## 4. Ce qui manque pour 10/10

**K4 → 10 (une seule session de preuve, ≈ 20 min, dépend de @fullstack ou de la session qui a Buffer)**
1. Créer une ligne `SocialPost` LINKEDIN de test (statut REJECTED, `directorNote` avec `[variante:image]`, `threadParts` = [amorce, chute], texte en 2 lignes, sans lien) : sans postId en base, l'URL réelle n'existe pas.
2. `curl -s -o carte.png -w "%{http_code} %{content_type} %{size_download} %{time_total}\n" "https://deviens-marrant.fr/api/social/image?postId=<id>&slide=0"` : attendu 200, `image/png`, 1080×1350, temps à froid noté. Déposer `carte.png` dans `v5-linkedin/` : je la relis et la compare à `li-v044-nicolas.png` (polices et colonne identiques en Worker).
3. Brouillon Buffer (`saveToDraft`) sur le canal LinkedIn avec **cette même URL** (pas un hébergement GitHub), texte = amorce seule, alt = amorce + chute : id, `status: draft`, asset `image/png`, puis `deletePost`, relecture NOT_FOUND. Consigner dans `REPLIT_ACTIONS.md` et `v5-linkedin/index.md` (qui n'existe pas encore).
4. Refaire les brouillons Instagram 2 et 4 images par `…&postId=<id>&slide=N` (posts réels `ig2-mimes` et `ig3-anniv`, ou lignes de test) : c'est la seule preuve que Buffer récupère nos URL à froid (risque R3 de @qa). Consigner les ids.
5. Rappel bloquant avant le 13/10 06:00 UTC : lot `relance-s15` régénéré avec les marqueurs `[variante:…]` (`REPLIT_ACTIONS.md` l.8 et l.24). Sans lui, aucun post LinkedIn ne porte la carte et le test ne démarre pas.

**K3 → 10 (à ma charge dès qu'un outil d'image est disponible, ou à la charge de la session)**
6. Capture à 390 px de large (aperçu 4:5 d'un navigateur mobile ou redimensionnement du PNG à 390×488) de `ig2-mimes-1`, `ig3-1`, `ig3-4`, `li-v044-nicolas` : j'y lis les espaces entre mots et le pied. Je ne mets pas 10 sur une estimation.
7. Cas de charge LinkedIn 4:5 : une chute de 20 à 25 mots et une amorce de 140 caractères (cible : aucun mot seul, aucune ligne < 40 %, bloc à 64 px au moins du pied). Cela confirme ou corrige les plafonds de la l.165, que je retire alors de l'état `[HYPOTHÈSE]`.
8. Uniformiser le corps entre cartes voisines (défaut 1) : plancher et plafond de corps pour le gabarit LinkedIn, ou accepter par écrit l'écart (≤ 30 %).
9. Test Jest de composition (aucun mot seul, ligne ≥ 40 %) appliqué à `carteVanneUnique("linkedin")`, avec les chutes de Rome et Nicolas comme cas.

**Ce qui ne dépend pas de moi** : la preuve Buffer (K4) est la plus courte et débloque la moitié de l'écart ; sans elle, K4 reste à 9 quelle que soit la qualité des cartes. K3 ne dépasse pas 9,5 tant que le contrôle à 390 px n'est pas fait.

Handoff -> @orchestrator : `docs/social/notation-relance-cycle7-design.md` ; actions : @fullstack points 1 à 5 et 9, @design (moi) points 6 à 8 avec un outil d'image ; décision Thomas : aucune nouvelle (X en texte, LinkedIn en test, déjà tranchés).

## Preuve faite par la session après cette notation (05/10, ~23:00)
Points « Preuve Buffer LinkedIn » 1 à 4 FAITS : post de test LinkedIn `[variante:image]` (REJECTED), route prod 200 `image/png` 1080×1350 en 3,0 s, PNG relu (identique à `li-v074-rome.png`) ; brouillons Buffer LinkedIn (1 image) et Instagram (2 cartes) créés avec les URL réelles `/api/social/image`, acceptés, supprimés ; post de test supprimé. Détail : `REPLIT_ACTIONS.md`. Reste : point 5 (régénération du lot avant le 13/10) et la liste K3.
