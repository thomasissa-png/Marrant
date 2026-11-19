# Bouton d'offre « Premium · 1,99 €/mois » : 3 propositions (s26, 19/11/2026)

Demande de Thomas : « pas sûr pertinent toujours. Ne veut-on pas mettre un truc plus marketing ? Genre débloque tout ? »
Le prix est lu dans `config/premium.ts` (gabarit `{prix}` ci-dessous). Les décomptes de caractères comptent « 1,99 €/mois » (11) et les espaces. Plafond : 32.

## Où c'est défini, ce que ça touche

- Définition : `apps/web/src/config/textes/cta-articles-accueil.ts`, constante `EN_TETE` (`bouton`, `boutonCourt`, `nomAccessible`).
- Consommateurs (Grep) : `components/layout/header.tsx` (l. 226 à 271), `en-tete-universel.tsx` (l. 198 à 208), `menu-mobile-universel.tsx` (l. 115), `mobile-nav.tsx` (l. 70), et `config/textes/espace-apercu.ts` l. 31 (`offre`, carte d'offre et carte de fin des aperçus).
- **ATTENTION, décision de Thomas avec effet en production** : l'en-tête et le menu mobile sont ceux du **site PUBLIC actuel**, pas seulement de l'espace. Changer `EN_TETE.bouton` change le bouton de TOUTES les pages publiques au prochain déploiement.
- Tests à mettre à jour : `apercu-rubriques`, `inertie-espace` (+ snapshot), `concision-v5-textes`, `cta-textes-finaux`, et les tests d'en-tête qui lisent la constante.
- Largeur : le repli `boutonCourt` « Premium » existe parce que « Premium · 1,99 € » (21 car.) a déjà débordé à 320 px, et de 1 024 à 1 279 px (commentaire du fichier). Un libellé de 25 à 30 car. aggrave le cas : à re-mesurer par @qa avant déploiement. `boutonCourt` reste « Premium » dans les trois options.

## Les 3 options

| | Libellé | Car. | Pourquoi (15 mots) |
|---|---|---|---|
| **A** | `Tout ouvrir · {prix}` | 25 | Même verbe que « Ouvrir tout le carnet » et que toutes les portes déjà en ligne. |
| **B** | `Tout débloquer · {prix}` | 28 | Le plus marketing, mais « débloquer » est le mot des caps et des bonus. |
| **C** | `Rejoindre Premium · {prix}` | 30 | Garde le nom de l'offre, promet un acte, aucun « tout » à justifier. |

Actuel pour mémoire : `Premium · {prix}` (21 car.).

## Verdict d'honnêteté sur « tout »

**« Tout » reste vrai, à une condition de formulation, et « débloquer » est le mauvais verbe.**

- Vrai : `niveaux-xp-s24.md` 5.1 : « un abonné au cap 1 a tout ce que l'offre annonce, dès l'abonnement ». Les caps 2 à 5 ouvrent un bonus chacun, **en plus** (Q5 et Q8, 12/11). 5.2 : « Premium ouvre tout reste honnête si le bonus s'AJOUTE ». Le 19/10, Thomas a décidé « Premium se vend comme tout Deviens Marrant ouvert ».
- Vrai aujourd'hui sans réserve : l'espace est inerte derrière `ESPACE_CLIENT_PUBLIE`, aucun bonus de cap n'existe en production.
- Piège de « débloquer » : après l'ouverture de l'espace, un abonné qui lit « Tout débloquer » puis voit « Un bonus s'ouvre dans la Bibliothèque : {titre} » après un cap peut conclure que « tout » n'était pas tout. Le mot « débloquer » promet un déverrouillage complet immédiat, alors que le produit débloque par paliers. « Ouvrir » est le verbe du site (« Premium ouvre tout », `espace-caps.ts` : « Ouvrir ») et ne promet pas l'absence de palier.
- Formulation exacte si on veut zéro risque : option C (pas de « tout »). Si « tout » est gardé : toujours le dire avec « ouvrir », et garder la ligne Q8 « Et à chaque cap franchi dans les parcours, un bonus en plus » sur la page d'offre.
- Rappel de 5.2 : tout texte « tout » retouché revient à Thomas pour un go, avis @legal conseillé (promesse commerciale).

## Reco

**A, `Tout ouvrir · {prix}`.** Ma reco de départ (« Tout débloquer ») change après vérification : A donne le « truc plus marketing » voulu par Thomas (le bénéfice remplace le nom de l'offre), reste vrai, et colle aux boutons existants (« Tout ouvrir · 1,99 €/mois » sur l'accueil et en fin d'article). Contre : l'en-tête et la carte d'accueil porteraient le même libellé, et le mot « Premium » disparaît du bouton (il reste dans le nom accessible et dans `boutonCourt`). B si Thomas tient à « débloquer », en acceptant le risque ci-dessus.

## Noms accessibles (commencent par le texte visible, WCAG 2.5.3 ; même patron que l'actuel)

- A : `Tout ouvrir, 1,99 € par mois : voir l’offre Premium`
- B : `Tout débloquer, 1,99 € par mois : voir l’offre Premium`
- C : `Rejoindre Premium, 1,99 € par mois : voir l’offre`

Le nom contient « Premium » dans A et B pour que le nom de l'offre reste annoncé (le visible ne le dit plus). Prix en gabarit via `formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)`, comme aujourd'hui.

## Contrôles

Zéro tiret cadratin, émoji, exclamation. Le point médian « · » avec espace insécable (`POINT_MEDIAN`) est conservé. Aucun fichier de code modifié.

## Tour 2 (19/11)

Thomas n'a retenu ni A, ni B, ni C : « Fais itérer bien. » Budget : 32 car. prix compris = **18 car. de libellé** (le point médian et ses espaces pèsent 3, « 1,99 €/mois » 11). Correction du tour 1 : C vaut 31 car., pas 30.
Persona : Yanis (20 ans, muet quand on se chambre) ; promesse de `/abonnement` : « Premium ouvre tout Deviens Marrant », listes sans limite, parcours en entier.

### Filtres durs (appliqués avant la notation)

- **« Débloquer » est mort, pas seulement risqué** : `espace-caps.ts` l. 13 l'interdit (« ni verrouillé, ni cadenas, ni débloquer, ni exclusif », test critère 13). B était incompatible avec l'espace.
- **Pas de promesse de résultat** : « Plus jamais muet », « Savoir répondre », « Avoir la répartie », « Répondre enfin », « Répondre à temps » promettent ce que l'entraînement ne garantit pas. Écartés. Le bouton peut vendre l'effort et la direction (« mieux »), pas l'arrivée.
- **Lisible en 2 s à côté de « Connexion »** : un verbe + le prix. Écartés pour obscurité : « Aller au bout » (au bout de quoi ?), « Du tac au tac » (aucun verbe, aucun objet), « Passer à l'acte » (lecture équivoque), « Sans limite » et « Accès complet » (étiquettes de tableau, pas des boutons).
- **Largeur** : plus le libellé est long, plus l'en-tête déborde (21 car. déborde déjà à 320 px et de 1 024 à 1 279 px). À 28 car. et plus, le repli `boutonCourt` fait le travail ; @qa mesure avant déploiement.

### 24 candidats, 4 angles (les « 18 max » sont respectés ; ✗ = écarté par un filtre)

| Angle | Candidats |
|---|---|
| Bénéfice (peur de rester muet) | Mieux répondre (28) · Mieux répliquer (29) · Répondre mieux (28) · Gagner en répartie (32) · Bosser ta répartie (32) · ✗ Plus jamais muet · ✗ Savoir répondre · ✗ Répondre enfin |
| Accès complet | Ouvrir Premium (28) · Ouvrir la suite (29) · Tout le catalogue (31) · ✗ Aller au bout · ✗ Sans limite · ✗ Accès complet |
| Passage à l'acte | Je m'abonne (25) · S'abonner (23, libellé exact du bouton de la page) · Passer à Premium (30) · Je prends Premium (31) · ✗ Passer à l'acte · ✗ Essayer Premium (aucun essai gratuit n'existe) |
| Ton Alex, clin d'œil | Bosser ta répartie (écho de « inscrits bossent leur humour ») · Le dire à temps (29, écho de « j'aurais dû dire ») · ✗ Du tac au tac · ✗ J'ai dit |

### 5 finalistes, relecture à l'aveugle (envie / clarté / honnêteté / ton, sur 10)

| Libellé | Env. | Clar. | Hon. | Ton | Total | Une ligne |
|---|---|---|---|---|---|---|
| Bosser ta répartie | 7 | 6 | 9 | 9 | 31 | Parle d'effort et de la peur de Yanis, dit « bosser » comme le site ; ne dit pas « tout ». |
| Mieux répondre | 7 | 6 | 9 | 8 | 30 | Bénéfice net, sans promesse d'arrivée ; discret sur ce qu'on achète. |
| Ouvrir Premium | 5 | 7 | 9 | 6 | 27 | Écho exact de « Premium ouvre tout », mais « ouvrir une offre » sonne administratif. |
| Je m'abonne | 4 | 8 | 10 | 6 | 28 | Le plus clair, prolonge le bouton de la page, aucun désir créé. |
| Tout le catalogue | 5 | 6 | 9 | 5 | 25 | Descriptif, long (31), et « catalogue » ne dit rien à Yanis. |

### Itération : les 2 meilleurs réécrits et renotés

- **Bosser ta répartie** : variante « Gagner en répartie » (32) : 7 / 7 / 9 / 7 = 30. Clarté +1 (verbe plus sûr), ton −2 (coach). L'original reste devant. Clarté basse à corriger côté page, voir plus bas.
- **Mieux répondre** : variante « Mieux répliquer » (29) : 7 / 7 / 9 / 7 = 30. « Répliquer » est le mot du carnet mais sonne combat ; « répondre » reste le mot de la promesse d'accueil (« répondre quand on te chambre »). Égalité, original gardé (plus court).
- Aucune réécriture ne bat l'original : les deux sont stables. « Tout le catalogue » sort (25).

### Les 3 finalistes classés

**1. `Bosser ta répartie · {prix}`** (32 car., 31/40)
- `boutonCourt` : garder « Premium » (7). « Répartie » (8) est aussi le nom d'un parcours (`étape 1 de Répartie`) : confusion.
- Nom accessible : `Bosser ta répartie, 1,99 € par mois : voir l’offre Premium`
- Prolonge : `ABONNEMENT_HAUT.preuve` « 1 500+ inscrits bossent leur humour. » (même verbe, même promesse d'effort). Écart : le titre de la page reste « Premium ouvre tout Deviens Marrant » ; le bouton parle d'entraînement, la page d'accès. Compatible, pas identique.

**2. `Mieux répondre · {prix}`** (28 car., 30/40)
- `boutonCourt` : « Premium » inchangé.
- Nom accessible : `Mieux répondre, 1,99 € par mois : voir l’offre Premium`
- Prolonge : la ligne « Carnet de répartie » du tableau et l'intro d'accueil « répondre quand on te chambre » ; sur `/abonnement` même écart de titre que le n° 1.

**3. `Je m'abonne · {prix}`** (25 car., 28/40)
- `boutonCourt` : « Premium » inchangé.
- Nom accessible : `Je m’abonne, 1,99 € par mois : voir l’offre Premium`
- Prolonge : le bouton `ABONNEMENT_ACHAT.bouton` « S’abonner · 1,99 €/mois » (`libelleSabonner`), quasi mot pour mot. Le plus honnête, le moins « marketing » : repli sûr si Thomas veut zéro écart.

### Reco

**Le n° 1, « Bosser ta répartie · {prix} »**, à une condition : @qa le mesure à 320 px et de 1 024 à 1 279 px (c'est le plus long). Si ça déborde, le n° 2 (4 car. de moins) prend la place, sans autre changement. Franchement : aucun des trois ne donne l'effet « débloque tout » ; seul « Tout ouvrir » (tour 1, A) le fait sans mentir. Si Thomas tient à « tout », A reste le bon choix ; si c'est le bénéfice qui l'intéresse, c'est le n° 1. Retouche de « tout » ou de promesse : go de Thomas, avis @legal conseillé (5.2). Aucun fichier de code touché.

## Mesure en situation (orchestrateur, 19/11, préversion locale, page d'accueil, visiteur)

Libellé substitué dans l'en-tête après hydratation (script `docs/espace-client/outils-s26/bouton-largeurs.mjs`), sans changer le repli « Premium » (sous 640 px et de 1 024 à 1 279 px). Débordement = défilement horizontal de la page.

| Largeur | Tout ouvrir (188 px) | Bosser ta répartie (235 px) | Mieux répondre (221 px) |
|---|---|---|---|
| 640 | tient (68 px à droite) | **déborde de 3 px** | tient |
| 700 | tient | tient | tient |
| 768 | tient | **déborde de 43 px** | **déborde de 29 px** |
| 1280 | tient | tient | tient |

Actuel (« Premium · 1,99 €/mois ») : 175 px. Seul « Tout ouvrir » tient à toutes les largeurs sans toucher à l'en-tête. Les deux autres demandent de repousser le repli « Premium » au-delà de 768 px (le bouton complet disparaîtrait alors de 640 à ~800 px). Captures : `docs/captures/s26/bouton-offre/`.
