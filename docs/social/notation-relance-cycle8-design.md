# Notation relance cycle 8 (@design, 07/10/2026 au soir) : K3 Visuels, K4 Formats

Base : ma notation cycle 7 (`notation-relance-cycle7-design.md`, mêmes critères, même échelle), `bannieres/` (`index.md`, `notation-design-cycle3.md`, PNG), `releves/2026-10-06.md` et `2026-10-07.md`, `REPLIT_ACTIONS.md` (l.52-58, l.115-118, l.122-125), `preparation/fiche-ig-21-10.md`, `preparation/lot-1a-dry-run-07-10.md`, `social-lot-v5-fixes.ts` (clé IG3), `strategie-relance-v5.md` §2.11 et §8, `carte-linkedin.ts`, `cartes-piste-a.test.tsx` (lu en entier), `image-linkedin.test.ts`, les 4 fichiers `opengraph-image.tsx` du site. **Limite de cet environnement** : Read, Glob, Write, Edit et WebSearch seulement (ni shell, ni Grep, ni accès au site, à Buffer ou à Instagram). Aucun `curl`, aucun redimensionnement, aucune capture téléphone : toute preuve « prod » ci-dessous est celle des relevés ou de @fullstack, pas la mienne. PNG relus cette fois : `x-entete.png`, `linkedin-couverture.png`, `x-entete-apercu-mobile.png`, `instagram-alaune-apercu-mobile.png`, `ig3-anniv-de-lea-4.png`, `li-v044-nicolas.png`. Positions lues à l'oeil (± 3 px).

## 1. Notes sur l'état réel

| Critère | Cycle 7 | Cycle 8 | Raison |
|---|---|---|---|
| **K3 Visuels** | 9,5 | **9,0** | Cartes (15) et bannières (6) : niveau 10 sur ce que j'ai relu, rien de dégradé. La baisse vient du périmètre : les 4 images Open Graph (`opengraph-image.tsx`), que je n'avais pas lues, sont **hors système** (dégradé marine `#1a1a2e` à `#16213e`, texte dégradé violet-rose `#8B5CF6` à `#EC4899`, `fontFamily: "sans-serif"` au lieu de Plus Jakarta Sans, libellés de 14 à 20 px) et c'est le seul visuel de 3 posts X sur 5 (liens avec carte). Les 4 points K3 du cycle 7 (390 px, cas de charge, corps, test Jest) sont tous encore ouverts. Plafond 9,0 tant que l'OG n'est pas aligné et relu au rendu. |
| **K4 Formats** | 9 | **9,5** | X 10 (texte, R1 prouvé en ligne le 07/10). Instagram 9,5 : 2 carrousels de 2 images réellement publiés (06/10 et 07/10), alt relu par l'API le 07/10 ; le carrousel de 4 cartes (14/10) n'a jamais traversé Buffer. LinkedIn 9,5 : brouillon image accepté par Buffer (addendum du cycle 7), marqueur `[variante:image]` présent au dry-run du 15/10, mais lot non inséré et aucune publication réelle. Moyenne 9,67, arrondie au demi-point inférieur (même méthode qu'au cycle 7). |

**Moyenne : 9,25** (identique au cycle 7 : 9,5 et 9 hier, 9,0 et 9,5 aujourd'hui).

## 2. Ma liste « Pour 10/10 » du cycle 7, point par point

| Point (cycle 7) | Statut | Preuve |
|---|---|---|
| 1. Ligne `SocialPost` LinkedIn de test | **Fait** | Addendum du cycle 7 (05/10 ~23:00) : post de test `[variante:image]` REJECTED, puis supprimé. |
| 2. Route `/api/social/image` LinkedIn à froid, PNG relu | **Fait** | Addendum : 200 `image/png` 1080×1350 en 3,0 s, identique à `li-v074-rome.png`. `alt.json` inchangé (2 entrées). Je n'ai pas rejoué le `curl`. |
| 3. Brouillon Buffer LinkedIn avec l'URL réelle, puis suppression | **Fait, trace incomplète** | Addendum du cycle 7. Mais `visuels-s15/v5-linkedin/index.md` n'existe toujours pas (Glob : 2 PNG et `alt.json` seulement), et je n'ai pas retrouvé le détail dans les 208 premières lignes de `REPLIT_ACTIONS.md` (section du 05/10 plus bas, non relue). |
| 4. Brouillons Instagram 2 et 4 images par l'URL réelle | **Partiel** | 2 images : prouvé, et mieux qu'en brouillon : 2 publications réelles `sent` (`DeKVBhaIFPb` le 06/10, `DeM51N8lkhD` le 07/10), JPEG, alt présent sur les 2 images du 07/10 (relevé 07/10). **4 images : jamais testé** (IG3 du 14/10 : 4 slides, 5 `threadParts`, parties 4 et 5 sur la carte 4, dry-run l.36). Le relevé du 06/10 ne note pas l'alt. |
| 5. Lot régénéré avec `[variante:…]` avant le 13/10 06:00 UTC | **Partiel** | Dry-run du 07/10 : 15/10 L1 `[variante:image]`, 13/10 L3 hors test (relais avec lien), 0 erreur. **Rien n'est inséré** (« Insertion le 09/10 », `REPLIT_ACTIONS.md` l.112). Une seule variante image la 1re semaine, aucune paire. |
| 6. Capture 390 px de `ig2-mimes-1`, `ig3-1`, `ig3-4`, `li-v044-nicolas` | **Pas fait** | Aucun fichier à 390 px pour les cartes (seules les bannières ont un `-apercu-mobile.png`). Estimation seulement. |
| 7. Cas de charge LinkedIn 4:5 (chute 20-25 mots, amorce 140 car.) | **Pas fait** | Plus longue chute LinkedIn rendue : Nicolas, 13 mots, 4 lignes. Plafonds de `strategie-relance-v5.md` l.167 : toujours `[HYPOTHÈSE à confirmer au rendu de @design]`. |
| 8. Uniformiser le corps entre cartes voisines | **Pas fait** | Rome environ 104 px, Nicolas environ 74 px (écart 29 %). Rien d'écrit dans §8 (l.163-175 relues). |
| 9. Test Jest de composition (aucun mot seul, ligne ≥ 40 %) | **Pas fait** | `cartes-piste-a.test.tsx` lu en entier : `carteVanneUnique("linkedin")` n'est testé que pour la taille, l'identité avec la carte chute d'Instagram, l'absence de l'amorce et le refus d'une amorce > 140. `composition()` n'est testé que pour la marge des guillemets et la colonne 144. `image-linkedin.test.ts` : taille PNG, alt, éligibilité. Aucun test de ligne courte ni de mot seul. |
| Défauts mineurs du cycle 7 : coupe « On vient / de récupérer », colonnes 146 et 96 | **Inchangés** | `li-v044-nicolas.png` relu : même colonne x ≈ 146, mêmes 4 lignes, aucun mot seul ; « Nicolas est » 377 px sur 783, soit 48 % de la ligne la plus longue (guillemet fermant compris). |

## 3. Ce qui a changé depuis le cycle 7

| Élément | Constat | Preuve |
|---|---|---|
| **Bannières** (X, LinkedIn, 4 couvertures IG) | **Toujours 10/10, rien de dégradé.** X : titre 2 lignes, « plus drôle. » lilas, appel Inter en bas à droite, rien dans la zone photo. LinkedIn : 2 lignes alignées, bloc à x ≈ 348. Aperçu X mobile : titre lisible, photo ronde sans contact. IG : 4 pictogrammes de même poids dans les cercles de 64 px. **Pose** : X en ligne (API, 06/10, image servie identique) ; LinkedIn impossible (jeton expiré) et Instagram impossible par API : à poser par Thomas, aucune trace d'une pose. | PNG relus ; `notation-design-cycle3.md` ; `REPLIT_ACTIONS.md` l.122-124. « Sans inscription » reste vrai (visiteur inchangé, `REPLIT_ACTIONS.md` l.182). Réserve du cycle 3 (zones sûres non mesurées sur téléphone) : **fermable dès maintenant pour X**, bannière en ligne. |
| **Carrousels IG réels** (06/10, 07/10) | Format 2 cartes prouvé en production. **Rendu publié jamais relu** : aucune copie des 2 cartes publiées dans le dépôt (les `ig-02-10-06.png` et `ig-03-10-07.png` de la racine sont des maquettes v1 d'avant la piste A), aucune capture de l'écran Instagram. Je ne note donc pas leur rendu. | Relevés 06/10 et 07/10 : URL, `sent`, texte alternatif (07/10 seulement). |
| **Image Open Graph des articles en base** | **Bug corrigé** (plus de « Article introuvable »), vérifié en prod par @fullstack sur le titre. **Mais** gabarit hors système et jamais relu au rendu (voir §4). Le post X du 05/10 garde l'ancienne carte chez X, non purgeable par API. | `REPLIT_ACTIONS.md` l.117-118 ; `blog/[slug]/opengraph-image.tsx` ; test `blog-og-image-db.test.tsx` (existe, non lu). |
| **Fiche carrousel 21/10** (V028) | Texte conforme à la spec : cartes 3 et 4 sans guillemets, carte 3 à 26 mots (plafond 30), carte 4 à 31 mots (plafond 35), légende 67 caractères (≤ 80). **Aucune des 4 cartes n'est rendue.** Extrapolation depuis `ig3-anniv-de-lea-4.png` (30 mots, bloc de y 365 à 920, pied à y 1182, soit 262 px de marge, « Le quiz est » à 43 % de la ligne la plus longue) : un mot de plus tient. `[À MESURER]`. | `fiche-ig-21-10.md` ; `ig3-anniv-de-lea-4.png`. |
| **IG3 du 14/10** (`social-lot-v5-fixes.ts`) | Les 5 textes de la clé IG3 et la légende (72 car.) sont mot pour mot ceux de §8 l.171. Carte 4 relue : « À toi de jouer : » en lilas clair, 4 lignes, renvoi quiz en second bloc, pied logo et URL, sans bouton, sans guillemets. PASS à 1080 px. | Fichier TS ; PNG v4. |
| **Spec §2.11** | **Désaccord interne** : l.72 décrit encore une carte X 16:9 pour « un post TWITTER ou LINKEDIN » et « 3 PNG `visuels-s15/v5-xli/` » (dossier inexistant, Glob), alors que §8 l.165 dit X en texte, test à J+28, et que le code ne sert la carte qu'à LinkedIn (`estVarianteImage` : `platform === "LINKEDIN"`, test « TWITTER → null »). Le passage de LinkedIn 1200×627 à 4:5 est fait. | `strategie-relance-v5.md` l.72 et l.165 ; `carte-linkedin.ts` l.37-39. |
| **Test d'image LinkedIn dès le 13/10** | Prêt côté code (éligibilité, repli texte avec `noteRepliTexte`). Premier post éligible : L1 canapé du 15/10 (amorce 88 car.). **Sa carte n'a jamais été rendue** : c'est la première image LinkedIn réellement publiée, et ni sa chute ni son rendu ne sont connus de moi. | Dry-run l.53 ; `strategie-relance-v5.md` l.175. |

## 4. L'Open Graph, le visuel le plus vu de X

Chaque post X avec lien (3 sur 5 par semaine : relais du lundi et du jeudi, mercredi avec quiz) n'a pas d'image à lui : sa seule image est l'Open Graph de la page liée. Le post quiz du 07/10 (réel) porte celle de `/quiz-humour`.

| Constat (code lu, rendu non vu) | Écart avec le système |
|---|---|
| Fond `linear-gradient(135deg, #0D0D0D, #1a1a2e, #16213e)` sur les 4 gabarits (blog, quiz, accueil ; vannes non lu) | Les cartes sont en aplat `#0D0D0D` ou `#6D28D9`, et `cartes-piste-a.test.tsx` l.175 interdit `linear-gradient`. |
| Marque en texte dégradé `#8B5CF6` vers `#EC4899` (`backgroundClip: "text"`) | Violet-rose : le cliché que la DA exclut ; le pied des cartes est le logo « d » + URL en Inter. |
| `fontFamily: "sans-serif"`, aucune police chargée | Plus Jakarta Sans 800 sur toutes les cartes et bannières. Poids 800 probablement non rendu `[À VÉRIFIER au rendu]`. |
| Catégorie 18 px, « Blog humour & répartie » 20 px, noms de profils du quiz 14 px | Sur une carte X de 358 pt de large (échelle ≈ 0,30 `[HYPOTHÈSE : largeur de la carte mobile X, non mesurée]`), 14 à 20 px donnent 4 à 6 pt : illisible. Seuil visé : 11 pt, soit 36 px. |
| Quiz : 5 emojis dans des carrés arrondis, badge « QUIZ GRATUIT · 2 MINUTES » | Icône dans un carré arrondi : anti-look IA. Emojis : leur rendu sous Workers dépend d'un chargement externe `[À VÉRIFIER]`. « Gratuit » : `bannieres/index.md` (§ Contrôles du texte) l'exclut des visuels ; la bannière X dit « sans inscription ». |
| Fond marine hors palette (`#1a1a2e`, `#16213e`) | Aucun de ces deux tokens n'existe dans le design system. |

Verdict : le défaut fonctionnel est réglé, le défaut d'identité (critères 3 et 4) reste entier, sur la surface la plus exposée de X. Je n'ai pas de capture du rendu : je ne le valide pas.

## 5. Ce qui manque pour 10/10 (10 points)

**K4 → 10**
1. **Insérer le lot 1a le 09/10, puis relire en base** : le post L1 du 15/10 porte `[variante:image]`, `threadParts` = [amorce, chute], texte en 2 lignes (`vanneLinkedInImage` ne doit pas renvoyer null). Créer `visuels-s15/v5-linkedin/index.md` avec les ids de la preuve Buffer du 05/10 (cycle 7, point 3).
2. **Brouillon Buffer d'un carrousel de 4 images** par `/api/social/image?postId=<id IG3>&slide=0..3` (ou ligne de test), alt sur les 4 images, puis `deletePost` et relecture NOT_FOUND. À faire avant le 14/10 12:30 Paris. Consigner dans `REPLIT_ACTIONS.md`.
3. **Relevés avec preuve d'assets** : 14/10 (IG3 : 4 images, ordre, alt sur les 4) et 15/10 (LinkedIn : asset `image/png`, alt, `sent`, lien réel). Ajouter l'alt du post IG du 06/10 au relevé (non noté).
4. **Corriger §2.11 de `strategie-relance-v5.md` (l.72)** : remplacer « X 16:9 1600x900 … pour un post TWITTER ou LINKEDIN » par « LinkedIn 4:5 1080x1350 seulement ; X en texte, carte 16:9 à J+28 (§8) », et « 3 PNG `visuels-s15/v5-xli/` » par « 2 PNG `visuels-s15/v5-linkedin/` relus ».

**K3 → 10**
5. **Aligner les Open Graph** (`blog/[slug]`, `quiz-humour`, `opengraph-image.tsx` racine, `vannes/[slug]`) : fond aplat `#0D0D0D` (plus de dégradé, plus de `#1a1a2e`/`#16213e`), Plus Jakarta Sans 800 chargée depuis `public/fonts` comme la route des cartes, titre blanc 64 px interligne 68 (multiple de 4), nombre du titre en `#A78BFA` (comme `carteArticleUnique`), catégorie et pied à 36 px minimum, pied = logo « d » + `deviens-marrant.fr` (plus de texte dégradé, plus de « Blog humour & répartie »). Quiz : titre « Quel type d'humour es-tu ? », ligne « Quiz d'humour, 2 minutes, sans inscription » en Inter `#D4D4D4`, sans emojis ni carrés arrondis (`[À VALIDER @copywriter]` sur le libellé ; « sans inscription » est vérifié FAQ). Rendre un PNG par gabarit, déposer dans `visuels-s15/og/`, relecture @design. Préférable : un seul composant partagé, réutilisant le gabarit couverture article en 1200×630.
6. **Rendre les cartes qui seront réellement publiées avant leur date** : la carte LinkedIn de L1 canapé (15/10, via `scripts/render-carte-linkedin.ts`) et les 4 cartes du 21/10 (cartes 3 et 4 à 26 et 31 mots). Seuils : aucun mot seul, aucune ligne < 40 % de la plus longue, bloc à 64 px au moins du pied (`[À MESURER]` sur la carte 4 : 262 px de marge prévus moins une ligne). Les rendus valent cas de charge : retirer `[HYPOTHÈSE]` de §8 l.167 si PASS, sinon corriger les plafonds.
7. **Capture à 390 px** (aperçu 4:5 d'un navigateur mobile ou PNG ramené à 390×488) de `ig2-mimes-1`, `ig3-1`, `ig3-4`, `li-v044-nicolas`, **plus une capture d'écran téléphone du post IG du 07/10 publié** (4:5 non rogné, guillemets lilas lisibles après le JPEG).
8. **Écart de corps** : écrire en §8 « corps de la chute LinkedIn entre 74 et 104 px, écart toléré ≤ 30 % entre deux cartes voisines » (écart actuel 29 %), ou fixer un plancher et un plafond dans le gabarit.
9. **Test Jest de composition** dans `cartes-piste-a.test.tsx` : pour les chutes de Rome et de Nicolas (et de L1 dès rendue), `composition({ textes: [chute], taille, citation: "aplat" })` puis vérifier qu'aucune ligne n'est un mot seul et qu'aucune ligne ne mesure moins de 40 % de la plus longue.
10. **Poser les bannières LinkedIn et Instagram** (Thomas, ou nouveau jeton LinkedIn pour la session) et joindre une capture téléphone de chaque profil, X d'abord (déjà en ligne) : cela ferme la réserve « zones sûres non mesurées » du cycle 3 (photo 84 px, logo 72 à 80 pt, cercle 64 px).

**Ce qui dépend de Thomas** : la pose des bannières (point 10), et la suppression éventuelle du post X du 05/10 dont la carte affiche encore « Article introuvable » (X ne se purge pas par API ; son choix). Rien d'autre : aucun [CHOIX UTILISATEUR] n'est rejoué ici.

Handoff -> @orchestrator : `docs/social/notation-relance-cycle8-design.md` ; actions : @fullstack points 1, 2, 4, 5, 9 (le gabarit OG avec @design), @design (moi) points 5 (maquette), 6, 7, 8 avec un outil d'image, session points 3 et 10, @copywriter libellé du quiz (point 5).
