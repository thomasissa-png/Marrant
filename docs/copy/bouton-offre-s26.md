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
