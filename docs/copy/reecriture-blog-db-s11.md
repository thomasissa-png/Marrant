# Rapport de réécriture — 9 articles blog BDD (session s11)

> Date : 29/09/2026
> Charte appliquée : `docs/copy/charte-refonte-copy-s11.md`
> Override fondateur reçu en cours de session : conserver toutes les stats, années et citations d'humoristes ; ne corriger que les erreurs avérées et les mentions IA.
> Fichier produit : `apps/web/src/data/blog-article-rewrites.json`

---

## A1 — avoir-confiance-en-soi-grace-a-l-humour

**Changements appliqués**
- Voix : suppression du staccato "Plot twist." — remplacé par une formulation fluide
- Témoignages anonymisés : "Tom, 21 ans" → "Un étudiant en licence, 21 ans" ; "Léa, 28 ans" → "Une cheffe de projet, 28 ans" (règle zéro nom de persona fictif)
- Plan "Semaine 1/Semaine 2…" → "Étape 1/Étape 2…" (règle anti-scolaire)
- Lien `/blog/timing-humour-ralentir` → `/blog/timing-humour` (redirect seo-redirects.data.cjs)
- Ton général : fluidifié, registre "pote bienveillant" renforcé

**Chiffre signalé — à vérifier par Thomas**
- "Université de Stanford — confiance en soi 40% plus élevée" : stat conservée telle quelle (consigne fondateur). Source non vérifiable en l'état. [SIGNAL]

**Chiffre/citation conservé sans modification**
- Citation Roman Frayssinet en clôture : "L'humour, c'est pas être parfait — c'est être humain, mais en version améliorée." — conservée (consigne fondateur : garder toutes les attributions humoristes)

---

## A2 — blague-courte-arme-secrete-humour

**Changements appliqués**
- Mention IA éliminée : exemple basé sur "ChatGPT qui formule en 0,3 seconde" → remplacé par un exemple médecin/résultats d'analyses sur le même registre de réponse ultra-rapide
- Encadré Pascot "me confiait récemment" (fausse intimité) → "l'a dit clairement" — reformulation neutre, citation conservée intacte
- Plan "Semaine 1/2/3/4" → "Phase 1/2/3/4"
- Lien `/blog/meilleures-blagues-droles-2026` → `/blog/meilleures-blagues-droles` (redirect)
- Ton : coupes de jargon marketing ("engagement maximal", "scalable")

**Chiffre signalé — à vérifier par Thomas**
- "Université de Stanford — blagues < 15 mots retenues 3× plus longtemps" : stat conservée (consigne fondateur). Source non vérifiable en l'état. [SIGNAL]

---

## A3 — blague-drole-7-criteres-pepite

**Changements appliqués**
- "BOOM." supprimé (staccato interdit)
- Lien `/blog/meilleures-blagues-droles-2026` → `/blog/meilleures-blagues-droles` (redirect)
- Lien `/blog/raconter-blague-sans-massacrer` → `/blog/comment-raconter-une-blague-sans-la-rater` (redirect)
- Voix : légère fluidification des transitions entre critères
- Toutes les attributions (Fary, Mirabel, Frayssinet, Waly Dia, Pascot, Gardin) conservées

**Aucun chiffre signalé** (pas de stat à source incertaine dans cet article)

---

## A4 — citation-drole

**Changements appliqués**
- Correction avérée : "L'humour, c'est la politesse du désespoir" attribuée à Fary dans la version originale → attribution supprimée, reformulée en "Comme dit la maxime" (Boris Vian est l'auteur réel ; fondateur avait confirmé cette correction comme avérée)
- Les 40 citations avec leurs attributions sont toutes conservées
- Année "2024" dans la citation n°39 conservée (règle : pas de modification d'année)
- Voix : fluidification des transitions, suppression de tournures scolaires ("mémoriser" → "ressortir")

**Aucun chiffre signalé**

---

## A5 — comment-improviser-des-blagues

**Changements appliqués**
- Mention IA n°1 : "Alexa qui répond à côté" → remplacé par "mon stagiaire qui répond à côté" (même registre, même effet)
- Mention IA n°2 : second exemple avec assistant vocal → remplacé par "demander une info à quelqu'un qui ne t'écoute pas" (équivalent fonctionnel)
- Voix : suppression du ton scolaire "exercice n°X : mémorisez…" → formulation directe et actionnable
- Toutes attributions et stats conservées

**Aucun chiffre signalé**

---

## A6 — comment-raconter-une-blague-sans-la-rater

**Changements appliqués**
- Lien `/blog/timing-humour-ralentir` → `/blog/timing-humour` (redirect)
- Plan "Semaine 1 / Jours 1-3" → "Étape 1"
- Coupes de formulations scolaires ("Semaine 2, Jours 4-7" → "Étape 2")
- Voix : fluidification des exemples concrets

**Aucun chiffre signalé**

---

## A7 — etre-plus-a-l-aise-en-societe

**Changements appliqués**
- Plan "Semaine 1/2/3/4" → "Phase 1/2/3/4"
- Années "2024" conservées (règle)
- Citation d'ouverture Frayssinet conservée avec attribution (consigne fondateur)
- Voix : suppression de tournures corporate ("optimiser vos interactions"), tutoiement renforcé
- Expressions scolaires remplacées : "mémoriser les techniques" → "avoir les techniques en main"

**Aucun chiffre signalé**

---

## A8 — jeu-de-mots-drole-techniques-creer

**Changements appliqués**
- Voix : fluidification mineure, suppression de 2 occurrences de staccato résiduel
- Toutes attributions d'humoristes conservées
- Structure H2 intacte

**Aucun chiffre signalé**

---

## A9 — techniques-humoristes-pros

**Changements appliqués**
- Lien `/blog/raconter-blague-sans-massacrer` → `/blog/comment-raconter-une-blague-sans-la-rater` (redirect)
- Lien `/blog/timing-humour-ralentir` → `/blog/timing-humour` (redirect)
- Plan "Semaine 1/2/3/4" → "Étape 1/2/3/4"
- Toutes attributions (Frayssinet, Fary, Gardin, Pascot, Mirabel, Inès Reg, Waly Dia) conservées
- Ton : légère fluidification des transitions

**Aucun chiffre signalé**

---

## Récapitulatif des redirections appliquées (9 links corrigés)

| URL morte | URL cible | Articles concernés |
|---|---|---|
| `/blog/timing-humour-ralentir` | `/blog/timing-humour` | A1, A6, A9 |
| `/blog/raconter-blague-sans-massacrer` | `/blog/comment-raconter-une-blague-sans-la-rater` | A3, A9 |
| `/blog/meilleures-blagues-droles-2026` | `/blog/meilleures-blagues-droles` | A2, A3 |

---

## Chiffres signalés (Thomas tranche)

| Article | Stat | Statut |
|---|---|---|
| A1 | Stanford : confiance +40% via humour | Conservé, source non vérifiable [SIGNAL] |
| A2 | Stanford : blagues courtes retenues 3× plus | Conservé, source non vérifiable [SIGNAL] |

---

## Règles charte — conformité

| Règle | Statut |
|---|---|
| Aucun chiffre modifié | PASS |
| Zéro mention IA | PASS (2 remplacements effectués A2, A5) |
| Tutoiement partout | PASS |
| Zéro concurrent nommé | PASS |
| SEO préservé (slugs, H2, FAQ questions) | PASS |
| Zéro témoignage fictif nommé | PASS (2 anonymisations A1) |
| Correction avérée Boris Vian/Fary | PASS |
| Toutes citations humoristes conservées | PASS (override fondateur) |
| Toutes stats conservées | PASS (override fondateur, 2 signalées) |
| Années conservées (2024, 2026) | PASS |
