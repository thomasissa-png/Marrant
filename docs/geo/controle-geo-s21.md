# Contrôle GEO de la branche s21 (info pour les moteurs IA)

Date : 18/10/2026. Agent : @geo. Périmètre : `llms.txt`, `llms-full.txt`, JSON-LD (Organization, WebSite, FAQPage, Product, Course), lu dans le worktree `agent-a6072b0ac19da7774` (commit annoncé f13b8e8).

Limites de la vérification (aucun shell, ni Grep, ni git) :
- Lecture de l'état des fichiers du worktree, pas du diff de la branche : je ne peux pas dire quelles lignes la branche a touchées, seulement ce qu'elles disent maintenant.
- Contenu dynamique non scanné : articles en base, fiches vannes / conseils / vidéos, textes des seeds JSON des parcours. Les slugs servis par la base ne sont pas vérifiables sans elle.
- Aucune réponse de ChatGPT / Perplexity / Gemini consultée : l'effet réel sur les citations est `[À MESURER]` (voir geo-monitoring-setup.md après mise en ligne).

## Réponse courte à la question de Thomas

Non, l'info LLM n'a été mise à jour qu'à moitié. Les prix (2,99 €/mois, 24,99 €/an) et les 5 parcours (dans llms.txt) sont bons, car tout est lu dans `config/premium.ts`. Mais le remboursement sous 14 jours est absent, "résiliable en ligne" remplace "depuis ton profil", llms-full.txt présente encore 3 parcours dans son introduction, et la lettre mensuelle n'est mentionnée nulle part. Le carnet de répartie est bien décrit. 5 corrections (C1 à C5) dont 2 prioritaires (C1, C2), plus 3 retouches mineures (C6 à C8).

## Tableau des verdicts

| # | Point | Verdict |
|---|---|---|
| 1 | Offre décrite comme sur le site | À CORRIGER (3 écarts : 14 jours, résiliation, intro à 3 parcours) |
| 2 | Lettre mensuelle et carnet | Carnet OK ; lettre À CORRIGER (absente) ; date du 05/11 à ne PAS publier |
| 3 | URL citées sans 404 | OK (réserve : slugs servis par la base non vérifiables) |
| 4 | Chiffres | OK, 2 signaux pour Thomas (choix fondateur, aucune correction) |
| 5 | Rien de faux, aucune promesse de résultat | OK (réserve mineure) |
| 6 | Zéro tiret cadratin, zéro concurrent | OK sur le texte statique ; contenu dynamique NON VÉRIFIÉ, garde-fou proposé |
| + | JSON-LD | FAQPage / Organization / WebSite OK ; Product À CORRIGER (`priceValidUntil` expire le 31/12/2026) |

## 1. L'offre est-elle décrite comme sur le site ?

Source de vérité du site : `config/premium.ts` L42-48 (prix), L72-85 (5 parcours, `PARCOURS_COUNT`), `config/textes/offre.ts` L39 (`REASSURANCE_UNIQUE` : "Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil."), `config/textes/avantages-premium.ts` L9-12 (4 avantages).

| Élément | Dans llms | Verdict |
|---|---|---|
| 2,99 €/mois | `llms-content.ts` L126, L79 via `PREMIUM_PRICE_LABEL` (même constante que le site) | OK |
| 24,99 €/an, soit 2,08 € par mois | `llms-content.ts` L141, L155 via `PREMIUM_ANNUAL_*` ; affiché seulement si `isAnnualPlanAvailable()` (comme `/abonnement`) | OK |
| 5 parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot) | `llms.txt/route.ts` L60-88 (dynamique, selon `STORYTELLING_PUBLIE` / `BOULOT_PUBLIE`, tous deux `true`), `llms-parcours.ts` L22-42 (5 programmes), `llms-content.ts` L126 (`PARCOURS_COUNT` = 5) | OK dans llms.txt. À CORRIGER dans llms-full.txt (C2) |
| Étape 1 de chaque parcours gratuite, sans compte | `llms-content.ts` L125 ; `llms-parcours.ts` L19 et L32 ("première étape gratuite", jamais "cours gratuit") | OK (cohérent avec "Lecture libre" et "Sans compte." du site) |
| Premier paiement remboursable sous 14 jours | Aucune occurrence dans `llms-content.ts`, `llms-parcours.ts`, ni les deux routes | À CORRIGER (C1) |
| Résiliation depuis le profil | `llms-content.ts` L126 dit "résiliable en ligne" ; L79 et L141 disent "depuis le profil" ; L155 mélange les deux | À CORRIGER (C1) : formulation à unifier sur celle du site |
| Aucune formulation ancienne | Plus de coaching 99 € (L145 le confirme), plus de "école", plus de 4,99 / 0,99 / 39,99 dans les fichiers lus | OK |
| Avantages Premium | `llms-content.ts` L126 : parcours, carnet mensuel, vannes / conseils / vidéos "dans les listes", favoris = les 4 avantages du site, avec la nuance exacte (fiches détail lisibles sans compte, choix du 04/10) | OK |
| Gratuit sans compte | `FREE_CATALOGUE_LIMITS_LABEL` (10 vannes, 3 conseils, 3 vidéos) = constantes qui bornent réellement les API | OK |

Écart interne en plus : la réponse "Combien ça coûte ?" (`llms-content.ts` L79 et L155) ne dit pas que l'étape 1 de chaque parcours et la situation du carnet sont offertes, alors que `LLMS_TARIFS` L125 le dit. Une IA qui cite la FAQ donne une offre gratuite plus pauvre que la réalité. Inclus dans C1.

Contrainte légale à respecter (`docs/legal/remboursement-abonnement-s21.md` §2 et §5) : la phrase des 14 jours ne vaut que pour le premier paiement. Ne jamais la reformuler sans "premier paiement", jamais "garantie" ni "satisfait ou remboursé". La reprise mot pour mot de `REASSURANCE_UNIQUE` est la solution la plus sûre (source unique).

## 2. Lettre mensuelle et carnet de répartie

Carnet :
- Mentionné : `llms-content.ts` L125 ("la situation offerte du carnet mensuel", gratuit) et L126 ("le carnet mensuel de situations de répartie (nouveau chaque mois)", Premium). Exact : `lib/carnet.ts` L94-103 (1 fiche offerte), `cta-pages.ts` L251-258 ("la réplique offerte", "Un nouveau carnet arrive chaque mois"), avantage du site "Un nouveau carnet de répartie chaque mois".
- Aucun mois nommé dans le texte : rien ne devient faux le 01/11. `lib/carnet.ts` L146-164 : un mois n'est visible qu'une fois commencé (heure de Paris), donc "nouveau chaque mois" est vrai avant et après le passage à novembre. Verdict : OK. Ne pas écrire "carnet de novembre" dans les fichiers llms.
- Aucune description du contenu d'une fiche : voir C3 (amélioration).
- Réserve : `/carnet` est `noindex` (`carnet/page.tsx` L18) et absent du sitemap. Un lien dans llms.txt est possible mais les bots de recherche ne l'indexeront pas : le texte du bloc doit donc se suffire à lui-même.

Lettre :
- Absente de llms.txt, llms-full.txt et du JSON-LD. La page existe sur la branche (`app/(dashboard)/lettre/page.tsx`) et les inscriptions sont ouvertes (`config/lettre.ts` L27 `LETTRE_INSCRIPTIONS_OUVERTES = true`) : elle est donc en ligne dès le déploiement. Verdict : À CORRIGER (C3), à livrer dans le même déploiement que la page (pas avant, sinon lien 404).
- Ne pas annoncer comme ouverte une page qui n'existe pas encore : respecté, car le texte proposé part avec la branche.
- Date du premier numéro (jeudi 05/11/2026, 8 h, `data/lettre/numeros.json` L3-6) : à NE PAS publier dans llms. Décision de Thomas du 17/10 : "la date du prochain numéro n'est jamais affichée" (`lettre/page.tsx` L18, `lettre-s21.ts` L136). Une IA qui la citerait afficherait une info que le site cache, et un numéro qui saute rendrait la phrase fausse. Seule formulation autorisée : "une fois par mois".
- Faits exacts disponibles (sources : `lettre-s21.ts` L56-57, L67, L72, L115) : une vanne décryptée par mois, un exercice, par e-mail, gratuit, sans compte, adresse confirmée par e-mail, désinscription en un clic, mention parfois de Premium. `/lettre` est `noindex` (`lettre/page.tsx` L27).

## 3. URL citées : existent-elles toutes sur la branche ?

Verdict : OK. Réserve : les slugs d'articles, vannes, conseils et vidéos viennent de la base ou de `catalogue-slug`, non vérifiables sans elle.

| URL citée | Où | Preuve d'existence |
|---|---|---|
| /vannes, /conseils, /videos, /blog, /glossaire, /anatomie-vanne, /quiz-humour | llms.txt L162-166, L43-58 ; llms-full L102-121 | `app/(dashboard)/<route>/page.tsx` présents |
| /parcours | llms.txt L165 ; llms-full L116 | `parcours/(liste)/page.tsx` |
| /parcours/machine-a-cafe, repartie, confiance | RESOURCE_PAGES des deux routes | `parcours/[slug]/page.tsx` L46-70 (`PARCOURS_META`) |
| /parcours/storytelling, /parcours/boulot | llms.txt L74-88 ; llms-parcours L23 | `parcours/[slug]/page.tsx` L73-98, conditionnés par les mêmes drapeaux `true` que llms |
| /parcours/<slug>#etape-1 | llms-parcours L39 | `parcours-detail.tsx` L59-63 (lecture du hash), L255 (`etape-${n}`) |
| /mentions-legales, /cgu, /confidentialite, /retractation | llms-content L129-134 | pages présentes (et au sitemap L70-73) |
| /llms-full.txt | llms.txt L189 | `app/llms-full.txt/route.ts` ; aucun `public/llms*.txt` ne masque les routes (Glob `public/*.txt` vide) |
| /blog/<slug> | filtres identiques à `sitemap.ts` L89-91 et L108-109 (dépubliés et redirigés exclus) | non vérifiable pour la base |
| /vannes/<slug>, /conseils/<slug>, /videos/<slug> | llms-full L193, L204, L212 | routes `[slug]` présentes |

Nouvelles URL proposées en C3 : `/lettre` (page présente, inscriptions ouvertes) et `/carnet` (page présente). Aucune des deux n'est au sitemap (cohérent avec `noindex`).

## 4. Chiffres

Verdict : OK avec 2 signaux pour Thomas. Aucun correctif demandé (choix fondateur).

- "1 500+" : absent des fichiers llms (présent sur le site seulement). Pas un défaut.
- Chiffres du catalogue : dynamiques (`jokeCount` arrondi, `glossary.length`, `QUIZ_QUESTIONS.length`), jamais en dur. Durées et rythmes : `PREMIUM_PARCOURS`. Prix : `config/premium.ts`. Tout est aligné sur la source du site.
- Signal 1, `llms-content.ts` L84 : "La majorité des membres se décrivent comme introvertis au départ." Affirmation sur la communauté sans donnée. `[CHOIX UTILISATEUR]` du 29/09/2026 (docs/founder-preferences.md l.26) : gardée, non re-questionnable.
- Signal 2, `llms-content.ts` L58 : "Des chercheurs de l'Université du Nouveau-Mexique ont montré que l'humour repose sur des mécanismes cognitifs précis (détection d'incongruité, résolution de tension, calibrage social)". Ma recherche web n'a trouvé aucune étude de cette université sur ce sujet : des travaux sur la détection et la résolution d'incongruité existent (IRM, 2013 et 2017), mais attribués à d'autres équipes, et "calibrage social" n'apparaît nulle part. Cette phrase est dans llms-full.txt seulement, pas dans la FAQ du site. Gardée selon la règle du 29/09 ("en cas de doute on GARDE et on signale, Thomas tranche"). Proposition à soumettre à Thomas, sans l'appliquer : remplacer par la source réelle (voir ci-dessous).
- Vérifié : Crawford et Caltabiano 2011, Journal of Positive Psychology, 8 semaines, bien-être émotionnel. L'étude existe : Crawford S.A., Caltabiano N.J. (2011), "Promoting emotional well-being through the use of humour", J. Positive Psychology 6(3), 237-252 ; programme de 8 semaines, groupe humour contre groupe social contre témoin, baisse du stress, de l'anxiété et de la dépression, hausse de l'optimisme et de l'affect positif (résumé consulté, texte intégral non accessible). La phrase llms ("améliorait significativement le bien-être émotionnel") est conforme. Source : https://researchonline.jcu.edu.au/18802/
- Signal 3 (site, pas llms, `lib/faqs.ts` L10) : "Nos membres gagnent en moyenne 50 XP par semaine". 50 XP est le gain d'une étape (seed Machine à Café, `moduleXp` 50), pas une moyenne mesurée. Cette phrase part dans le FAQPage JSON-LD de l'accueil (`page.tsx` L25, L62) et de `/abonnement`. Même règle du 29/09 : gardée, signalée.

Option pour le signal 2 (à soumettre à Thomas) : "Les recherches sur l'humour décrivent un mécanisme en étapes : repérer l'incongruité, puis la résoudre (Crawford et Caltabiano ne portent que sur le programme de 8 semaines)." Je ne l'applique pas : texte public, relecture à l'aveugle requise (règle d'or) et choix fondateur.

## 5. Rien de faux, aucune promesse de résultat

Verdict : OK, réserve mineure.
- Aucun "garantie", "satisfait ou remboursé", "résultat assuré", "100 %" dans les fichiers lus.
- Réserve : `llms-content.ts` L34 "permettent de progresser en quelques semaines" est une capacité, pas une garantie, et reste vague. Elle n'est pas à retirer (règle "améliorer, pas amputer"). Le site, lui, dit "2 à 4 semaines" (`lib/faqs.ts` L21) : les deux versions sont compatibles.
- Faits vérifiés contre le site : "avec Premium, la progression est suivie (XP à chaque étape validée, série des jours de pratique)" (L74) = `FAQ_SERIE_XP` (`entrees-parcours.ts` L60). "Toutes les étapes ouvertes d'un coup" (`llms-parcours.ts` L19) = "Premium ouvre la suite et les autres parcours d'un coup" (`cta-pages.ts` L187).
- Prudence légale (C1) : tout ajout sur le remboursement doit garder "premier paiement".

## 6. Tirets cadratins et concurrents

Verdict : OK sur le texte statique, NON VÉRIFIÉ sur le contenu dynamique.
- Texte statique : aucun tiret cadratin dans les chaînes servies de `llms-content.ts`, `llms-parcours.ts`, `llms.txt/route.ts`, `llms-full.txt/route.ts` (les seuls tirets cadratins relevés sont dans des commentaires de code, par exemple `llms.txt/route.ts` L24, jamais servis).
- Contenu dynamique : articles (base et code), vannes, conseils, vidéos, et textes des seeds `parcours-seed.json` / `parcours-storytelling-s18.json` / `parcours-boulot-s19.json` repris par `llms-parcours.ts` L26-35. Je n'ai pas pu les scanner (pas de Grep). Aucune des deux routes n'applique `stripEmDashes` (`lib/em-dash.ts` L186), alors que le JSON-LD Course et le hub le font (`parcours-jsonld.ts` L50-51). Un tiret réintroduit en base ou dans un seed partirait donc tel quel vers les IA. Garde-fou proposé : C5.
- Concurrents : aucun nom dans les fichiers llms (la FAQ dit "vidéos d'humoristes en ligne"). Hors llms : la FAQ du site et son JSON-LD citent "YouTube" (`lib/faqs.ts` L41, L65), plateforme d'hébergement des vidéos plutôt que concurrent ; je le signale sans le qualifier d'erreur. Humoristes nommés : autorisés partout (P0 s15).

## JSON-LD (Organization, WebSite, FAQPage, Product, Course)

- Organization (`json-ld.tsx` L126-157) et WebSite (L159-178) : `@id` stables, `sameAs` = 3 comptes confirmés par Thomas le 30/09, description identique au chapeau de llms.txt. Rien dans la branche ne les rend faux. OK.
- FAQPage de l'accueil (`page.tsx` L25, L62) et de `/abonnement` (`abonnement/layout.tsx` L47) : `FAQ_VENTE`, les 4 questions réellement affichées (`faqs.ts` L61-71). Conforme à la règle Google (balisage = contenu visible). OK. Observation GEO sans correction possible : la réponse prix ("C'est le prix, point.", `faqs.ts` L37, L54) est peu extractible, mais c'est un texte validé à l'aveugle (v5) : il ne bouge que par une nouvelle relecture à l'aveugle.
- Product (`json-ld.tsx` L368-402, rendu par `abonnement/layout.tsx` L46) : description (L374) = les 4 avantages du site, prix lus dans `config/premium.ts`, offre annuelle conditionnée à `isAnnualPlanAvailable()`. OK sauf `priceValidUntil: "2026-12-31"` (L349 et L395) : date en dur qui expire dans 74 jours. À CORRIGER (C4).
- Course (`parcours-jsonld.ts` L39-73) : prix 2.99 lu dans la config, `isAccessibleForFree: false` avec commentaire explicite (étape 1 lisible, suite payante). OK.

## Corrections pour @fullstack

Priorités : P1 = à livrer avec la mise en ligne s21 ; P2 = dans la foulée (avant le 31/12 pour C4) ; P3 = confort. Avant de modifier : chercher les tests qui importent `llms-content` (`LLMS_TARIFS`, `getLlmsTarifs`, `getLlmsFaqFull`, `LLMS_FULL_INTRO`) et `json-ld` (valeur "2026-12-31") et les mettre à jour. Tout texte public ci-dessous reprend mot pour mot une phrase déjà validée sur le site (`REASSURANCE_UNIQUE`, métadonnées de /carnet et /lettre) pour ne pas rouvrir la relecture à l'aveugle ; les phrases de description de la lettre et du carnet (C3) sont des assemblages de faits déjà publics : à passer en relecture rapide par Thomas avant mise en ligne.

### C1 (P1) : remboursement des 14 jours et résiliation depuis le profil

Fichier : `apps/web/src/lib/llms-content.ts`.

a) L124-127, `LLMS_TARIFS`. Texte actuel :
```
`Sans abonnement et sans compte : ${FREE_CATALOGUE_LIMITS_LABEL}, la première étape de chaque parcours, la situation offerte du carnet mensuel + contenu du jour renouvelé quotidiennement.`,
`Premium : ${PREMIUM_PRICE_LABEL} : les ${PARCOURS_COUNT} parcours en entier (première étape offerte), le carnet mensuel de situations de répartie (nouveau chaque mois), toutes les vannes, conseils et vidéos dans les listes, et les favoris, résiliable en ligne.`,
```
Texte proposé :
```
`Sans abonnement et sans compte : ${FREE_CATALOGUE_LIMITS_LABEL}, la première étape de chaque parcours, la situation offerte du carnet mensuel et le contenu du jour, renouvelé quotidiennement.`,
`Premium à ${PREMIUM_PRICE_LABEL} : les ${PARCOURS_COUNT} parcours en entier (première étape offerte), le carnet mensuel de situations de répartie (nouveau chaque mois), toutes les vannes, conseils et vidéos dans les listes, et les favoris.`,
```
(retrait de "résiliable en ligne", rendu par la ligne de réassurance ci-dessous ; le double deux-points disparaît.)

b) L143-147, `getLlmsTarifs`. Ajouter `import { REASSURANCE_UNIQUE } from "@/config/textes/offre";` puis remplacer le corps :
```
export function getLlmsTarifs(annualAvailable: boolean): string[] {
  const base = annualAvailable ? [...LLMS_TARIFS, ANNUAL_TARIF] : LLMS_TARIFS;
  // Réassurance identique au site (source unique) : premier paiement remboursable, résiliation depuis le profil.
  return [...base, REASSURANCE_UNIQUE];
}
```
et L141, `ANNUAL_TARIF`, retirer la fin ", résiliable depuis le profil" (doublon) : "... par rapport au mensuel), renouvelé chaque année."
Résultat servi : "Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil." (identique à la réassurance du site, aucune reformulation juridique).

c) L77-80, réponse "Combien ça coûte ?" (mensuel). Texte actuel :
```
`Sans abonnement et sans compte : ${FREE_CATALOGUE_LIMITS_LABEL} et le contenu du jour. Premium est à ${PREMIUM_PRICE_LABEL}, résiliable depuis le profil, à tout moment.`
```
Proposé :
```
`Sans abonnement et sans compte : ${FREE_CATALOGUE_LIMITS_LABEL}, la première étape de chaque parcours, la situation offerte du carnet du mois et le contenu du jour. Premium est à ${PREMIUM_PRICE_LABEL}, résiliable depuis le profil, à tout moment. Le premier paiement est remboursable sous 14 jours.`
```

d) L155, même réponse en version annuelle. Texte actuel :
```
answer: `Sans abonnement et sans compte : ${FREE_CATALOGUE_LIMITS_LABEL} et le contenu du jour. Premium est à ${PREMIUM_PRICE_LABEL}, résiliable en ligne, ou ${PREMIUM_ANNUAL_PRICE_LABEL} payé en une fois (${PREMIUM_ANNUAL_EQUIVALENT_LABEL}, ${PREMIUM_ANNUAL_SAVINGS_LABEL}). Les deux formules se renouvellent automatiquement et se résilient depuis le profil, à tout moment.`,
```
Proposé :
```
answer: `Sans abonnement et sans compte : ${FREE_CATALOGUE_LIMITS_LABEL}, la première étape de chaque parcours, la situation offerte du carnet du mois et le contenu du jour. Premium est à ${PREMIUM_PRICE_LABEL}, ou ${PREMIUM_ANNUAL_PRICE_LABEL} payé en une fois (${PREMIUM_ANNUAL_EQUIVALENT_LABEL}, ${PREMIUM_ANNUAL_SAVINGS_LABEL}). Les deux formules se renouvellent automatiquement et se résilient depuis le profil, à tout moment. Le premier paiement est remboursable sous 14 jours.`,
```

### C2 (P1) : llms-full.txt présente 3 parcours sur 5 dans son introduction

Contradiction interne : `LLMS_FULL_INTRO` et `RESOURCE_PAGES` listent 3 parcours, alors que le même fichier dit "les 5 parcours" (tarifs) et détaille 5 programmes (`renderLlmsParcoursProgramme`). Le "Sommaire" compte aussi 3 parcours (L155 : `RESOURCE_PAGES.length` = 6). llms.txt est déjà correct.

a) `llms-content.ts` L116-119. Texte actuel :
```
### Parcours structurés (${LLMS_BASE_URL}/parcours)
- **Machine à Café** (${parcoursWeeks("machine-a-cafe")} semaines, 15 min par semaine) : avoir des vannes et anecdotes à ressortir au bureau et en afterwork
- **Répartie** (${parcoursWeeks("repartie")} semaines, 20 min par semaine) : savoir quoi répondre quand on se fait chambrer
- **Confiance** (${parcoursWeeks("confiance")} semaines, 20 min par semaine) : retrouver son humour et sa légèreté après une période difficile
```
Proposé : sortir les lignes dans une constante construite avant `LLMS_FULL_INTRO` (importer `PREMIUM_PARCOURS` depuis `@/config/premium` et `BOULOT_PUBLIE`, `STORYTELLING_PUBLIE` depuis `@/config/parcours-publication`) :
```
const semainesParcours = (slug: string) => PREMIUM_PARCOURS.find((p) => p.slug === slug)?.weeks;
const LIGNES_PARCOURS = [
  `- **Machine à Café** (${parcoursWeeks("machine-a-cafe")} semaines, 15 min par semaine) : avoir des vannes et anecdotes à ressortir au bureau et en afterwork`,
  `- **Répartie** (${parcoursWeeks("repartie")} semaines, 20 min par semaine) : savoir quoi répondre quand on se fait chambrer`,
  `- **Confiance** (${parcoursWeeks("confiance")} semaines, 20 min par semaine) : retrouver son humour et sa légèreté après une période difficile`,
  ...(STORYTELLING_PUBLIE
    ? [`- **Storytelling** (${semainesParcours("storytelling")} semaines, 20 min par semaine) : raconter ses histoires jusqu'au bout (coupe, voix, chute, détour, détail qui revient)`]
    : []),
  ...(BOULOT_PUBLIE
    ? [`- **Boulot** (${semainesParcours("boulot")} semaines, 15 min par semaine) : oser une vanne au travail sans se griller, du silence en réunion au toast`]
    : []),
].join("\n");
```
et dans le gabarit : `### Parcours structurés (${LLMS_BASE_URL}/parcours)\n${LIGNES_PARCOURS}`. Les durées et rythmes (6 semaines / 20 min Storytelling, 6 / 15 Boulot) viennent de `config/premium.ts` L78 et L81 ; les accroches reprennent celles déjà servies par llms.txt (`llms.txt/route.ts` L79 et L86).

b) `llms-full.txt/route.ts` L46-48, ajouter après la ligne Confiance (importer `PREMIUM_PARCOURS` depuis `@/config/premium`, `BOULOT_PUBLIE` et `STORYTELLING_PUBLIE` depuis `@/config/parcours-publication`) :
```
  ...(STORYTELLING_PUBLIE
    ? [{ path: "/parcours/storytelling", label: "Parcours Storytelling", summary: `Parcours de ${PREMIUM_PARCOURS.find((p) => p.slug === "storytelling")?.weeks} semaines (20 min par semaine) pour raconter ses histoires jusqu'au bout : coupe, voix, chute, détour et détail qui revient.` }]
    : []),
  ...(BOULOT_PUBLIE
    ? [{ path: "/parcours/boulot", label: "Parcours Boulot", summary: `Parcours de ${PREMIUM_PARCOURS.find((p) => p.slug === "boulot")?.weeks} semaines (15 min par semaine) pour oser une vanne au travail sans se griller, du silence en réunion au toast.` }]
    : []),
```
(le tableau devient un spread ; `RESOURCE_PAGES.length` du Sommaire passe à 8.) Variante plus simple : exporter la liste de parcours de `llms.txt/route.ts` dans un module commun pour les deux routes.

### C3 (P2) : décrire la lettre et le carnet, à livrer avec la page `/lettre`

a) `llms-content.ts`, dans `LLMS_FULL_INTRO`, après le bloc "Parcours structurés" et avant "Articles" (L121) :
```
### Carnet de répartie du mois (${LLMS_BASE_URL}/carnet)
Chaque mois, des situations du quotidien et la réplique qui va avec : ce qu'on te dit, quoi répondre, pourquoi ça marche, quoi faire si ça se tend, et un exercice. Une situation est offerte à tous ; le carnet complet, renouvelé chaque mois, fait partie de Premium.

### La lettre du mois (${LLMS_BASE_URL}/lettre)
Une vanne décryptée par mois, avec un exercice pour s'entraîner, envoyée par e-mail. Gratuite, sans compte. L'adresse est confirmée par un e-mail, et la désinscription se fait en un clic. La lettre mentionne parfois Premium.
```
Sources : `carnet/page.tsx` L16-17, `lib/carnet.ts` L94-103, `lettre-s21.ts` L56-57, L67, L72. Aucune date, aucun numéro, aucun mois nommé (voir point 2).

b) `llms.txt/route.ts`, après la ligne Parcours (L165) :
```
lines.push(`- [Carnet de répartie du mois](${BASE_URL}/carnet): des situations du quotidien avec ce qu'on te dit et la réplique qui va avec ; une situation offerte, le carnet complet dans Premium.`);
lines.push(`- [La lettre](${BASE_URL}/lettre): une vanne décryptée par mois et un exercice, par e-mail. Gratuit, sans compte.`);
```
c) `LLMS_TARIFS` : déjà couvert par C1 (ajouter au besoin, en fin de la 1re ligne, "La lettre mensuelle est aussi gratuite, sans compte.").

### C4 (P2, avant le 31/12/2026) : `priceValidUntil` figé à 2026-12-31

Fichier : `apps/web/src/components/seo/json-ld.tsx` L349 (`premiumOffer`) et L395 (offre mensuelle seule). Texte actuel : `priceValidUntil: "2026-12-31",`. Passé cette date, l'offre est lue comme expirée par Google et par les IA qui exploitent le balisage. Proposé : supprimer la propriété (facultative), ou la calculer, la page `/abonnement` étant `force-dynamic` : `const PRICE_VALID_UNTIL = \`${new Date().getUTCFullYear() + 1}-12-31\`;` et `priceValidUntil: PRICE_VALID_UNTIL,`. Mettre à jour `__tests__/ui/json-ld.test.tsx` si elle fige la valeur.

### C5 (P2) : garde-fou tiret cadratin sur la sortie des deux routes

Fichiers : `llms.txt/route.ts` L197 et `llms-full.txt/route.ts` L242. Importer `import { stripEmDashes } from "@/lib/em-dash";` puis :
```
const body = stripEmDashes(renderLlmsTxt(articles, stats.jokes));
const body = stripEmDashes(renderLlmsFullTxt(articles, catalogue));
```
La fonction est idempotente, ne change aucun mot, ne touche ni les titres `#`, ni les liens, ni les URL. En plus, un test Jest qui vérifie l'absence de "—" dans `renderLlmsParcoursProgramme().join("\n")`, `getLlmsTarifs(true)`, `getLlmsFaqFull(true)` et `LLMS_FULL_INTRO` (le test de `lettre-s21` fait déjà ce contrôle pour la lettre).

### C6 à C8 (P3, confort)

- C6 : `llms.txt/route.ts` L166, libellé `[Blog]` ; le site dit "Articles" depuis le choix du 18/10 (`LIBELLE_SECTION_ARTICLES`, `cta-articles-accueil.ts` L30) et `llms-content.ts` L121 l'utilise déjà. Proposé : `[${LIBELLE_SECTION_ARTICLES}](${BASE_URL}/blog): ...` et le titre L177 "Articles de blog" en "Articles". L'URL `/blog` ne change pas.
- C7 : `llms-content.ts` L141, fin de `ANNUAL_TARIF` maladroite ("10,89 € économisés par an par rapport au mensuel"). Proposé : remplacer `${PREMIUM_ANNUAL_SAVINGS_LABEL} par rapport au mensuel` par `${ANNUEL_AVANTAGE_LABEL}` (importé de `@/config/textes/offre` : "plus de 3 mois offerts, 10,89 € économisés par an", libellé déjà sur le site, jamais "4 mois").
- C8 : pour @seo, hors périmètre llms : `sitemap.ts` L14 et L67, `lastModified` de `/abonnement`, `/a-propos`, `/glossaire`, `/quiz-humour` figé au 2026-09-29 alors que leurs textes changent avec s21 (la constante est à mettre à jour quand le texte d'une page change, commentaire L28-30). À confirmer par @seo.

## Après la mise en ligne (à faire par Thomas, l'agent ne peut pas interroger les IA)

Prompts de test à exécuter dans ChatGPT, Perplexity et Gemini, puis coller les réponses dans `docs/geo/geo-monitoring-setup.md` (baseline `[À MESURER]`) :
1. "Combien coûte deviens-marrant.fr et que contient l'abonnement ?" (attendu : 2,99 €/mois, 24,99 €/an, 5 parcours, premier paiement remboursable sous 14 jours)
2. "Y a-t-il une newsletter gratuite sur deviens-marrant.fr ?" (attendu : une lettre par mois, gratuite, sans compte, sans date de numéro)
3. "Quels parcours propose deviens-marrant.fr ?" (attendu : 5 parcours)
Contrôle d'exactitude : aucune IA ne doit citer un prix de 0,99 / 4,99 / 39,99 € ni le coaching à 99 €. Cadence : hebdomadaire pendant 4 semaines, puis mensuelle.

## Handoff

- À @fullstack : C1 à C5 (P1 : C1, C2), C6 et C7 en option. Fichiers : `apps/web/src/lib/llms-content.ts`, `apps/web/src/app/llms.txt/route.ts`, `apps/web/src/app/llms-full.txt/route.ts`, `apps/web/src/components/seo/json-ld.tsx`. Documenter dans `REPLIT_ACTIONS.md` à la livraison. Pre-commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, plus `npx tsc --noEmit` et Jest si des tests changent.
- Contenus à ne pas modifier sans re-vérification GEO : `REASSURANCE_UNIQUE` (offre.ts L39, valable pour le premier paiement seulement), la FAQ de vente (4 questions, JSON-LD identique), les labels de prix dans `config/premium.ts`.
- Décisions pour Thomas : (1) la phrase de l'Université du Nouveau-Mexique (point 4, signal 2), garder ou remplacer ; (2) relecture rapide des deux blocs de C3 ; (3) confirmer qu'on ne publie jamais la date du premier numéro de la lettre.
- Fréquence de monitoring : hebdomadaire.
