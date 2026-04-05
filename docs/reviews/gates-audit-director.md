# Audit des gates programmatiques — Stand-Up Director

**Date :** 2026-04-05
**Auditeur :** Stand-Up Director (auto-audit)
**Fichier audité :** `apps/web/src/lib/ai/agents/standup-director-agent.ts`
**Fonctions couvertes :** `runJokeGates`, `runTipGates`, `runBlogGates`, `runSocialGates`

---

## Note globale : 6,5 / 10

### Justification

Le système de gates est fonctionnel et couvre les cas les plus grossiers. Il bloque efficacement les objets qui parlent, les personas leaks, et les red flags IA. Mais sur 26 gates au total, 8 présentent des défauts de calibration significatifs, et des trous entiers existent — notamment sur la qualité réelle du twist comique, la répétitivité du contenu, et la détection de vulgaire.

Le problème central : les gates actuelles vérifient surtout la **forme** (longueur, format, mots interdits) mais pas assez le **fond** (est-ce que ça fait rire ? est-ce actionnable ? est-ce original ?). Un contenu médiocre bien formaté peut passer toutes les gates sans problème.

---

## Tableau gate par gate

### Vannes — `runJokeGates` (7 gates)

| Gate | Pertinence | Calibration | Risque contournement | Risque faux positif | Note |
|---|---|---|---|---|---|
| **G-J1** Punchline existe (>= 3 chars) | Haute — une punchline vide est un bug fondamental | Trop souple — 3 caractères suffisent ("OK", "Si", "Ah") | Elevé : "Ah." passe la gate mais n'est pas une punchline | Nul | Seuil insuffisant. Passer à >= 15 chars minimum |
| **G-J2** Punchline < Setup (en mots) | Haute — règle stand-up fondamentale | Bonne | Moyen : une punchline de 1 mot passe même si elle est nulle | Moyen : certains formats valides ont punchline = setup (one-liner pur) | Règle correcte mais un seuil plancher pour la punchline manque |
| **G-J3** Pas d'objets qui parlent | Haute — critère de rejet absolu CLAUDE.md | Trop étroite — liste de 12 objets hardcodée, facilement contournée | Elevé : "une bouteille dit", "un frigo répond", "un avion annonce" passent | Nul | La liste doit être élargie ou remplacée par un pattern générique |
| **G-J4** Pas de persona leak | Critique — règle absolue du projet | Bonne, case-insensitive | Faible : les prénoms sont explicites, difficile de les rater | Nul | Solide |
| **G-J5** Longueur < 60 mots | Haute — concision stand-up | Correcte mais absolue | Faible | Moyen : certaines vannes narratives courtes dépassent 60 mots légitimement | Seuil raisonnable. Envisager 65 mots avec warning plutôt que FAIL dur |
| **G-J6** Punchline ≠ constat (heuristique) | Haute — détecte le problème le plus fréquent des vannes IA | Fragile — pattern regex simpliste, beaucoup d'exceptions | Elevé : un constat commençant par "Mon/ma/ton/sa" passe | Moyen : "Il était temps" passe le test regex mais est bien un twist | Bonne intention, exécution à revoir. La heuristique est trop étroite |
| **G-J7** Pas de format Carambar (Q&A sans twist) | Haute — format explicitement interdit | Correcte mais incomplète | Elevé : Q&A avec twist dans la question ("Comment j'explique à mon chat...") peut être rejeté à tort | Moyen : certains formats Q&A avec twist réel (style Roman Frayssinet) existent | La condition `!twistMarkers.test(punchline)` est bonne mais les twist markers sont trop limités |

**Bilan vannes :** 3/7 gates sont robustes (G-J4, G-J5, logique G-J2). Les 4 autres ont des contournements identifiables ou des faux positifs notables.

---

### Conseils — `runTipGates` (4 gates)

| Gate | Pertinence | Calibration | Risque contournement | Risque faux positif | Note |
|---|---|---|---|---|---|
| **G-T1** Pas de persona leak | Critique | Bonne | Faible | Nul | Solide |
| **G-T2** Format DÉFI | Haute — standardisation du catalogue | Trop souple — vérifie uniquement la présence du mot "défi", pas le format complet "DÉFI [NOM] :" | Elevé : "Un défi pour toi :" passe mais ne respecte pas le format attendu | Faible | Passer à regex `/^DÉFI\s+\w+\s*:/i` pour valider le format complet |
| **G-T3** Contenu >= 60 mots | Haute — contre le contenu vide | Trop souple — 60 mots c'est 3 phrases. Un conseil de 60 mots est squelettique | Elevé : un contenu de 60 mots de filler passe | Nul | Le minimum devrait être 80-100 mots selon les specs CLAUDE.md ("120-180 mots" dans directorRewriteTip) |
| **G-T4** Exemple avec dialogue | Haute — critère de qualité documenté | Correcte dans l'intention, fragile dans l'implémentation — les patterns `«»"""''` ou `— |:` peuvent être contournés | Elevé : `Il répond : tu rigoles ?` passe sans dialogue réel | Moyen : du texte technique avec deux-points (ex: "Timing : 3 secondes") peut fausser la gate | Pattern trop permissif. Chercher dialogue complet, pas juste ponctuation |

**Bilan conseils :** 4 gates, dont 3 présentent des problèmes de calibration. Surtout G-T3 (seuil trop bas) et G-T2 (format incomplet).

---

### Blog — `runBlogGates` (7 gates)

| Gate | Pertinence | Calibration | Risque contournement | Risque faux positif | Note |
|---|---|---|---|---|---|
| **G-B1** Pas de persona leak | Critique | Bonne | Faible | Nul | Solide |
| **G-B2** Titre < 60 chars | Haute — SEO non négociable | Correcte — seuil exact | Nul | Nul | Parfaite |
| **G-B3** Excerpt < 155 chars | Haute — meta description | Correcte | Nul | Nul | Parfaite |
| **G-B4** Min 5 liens internes | Haute — maillage interne | Fragile — le regex `/\/(vannes|conseils|videos|parcours|blog\/[a-z])/g` peut compter le même lien répété 5 fois | Elevé : répéter 5 fois `/vannes` dans le contenu suffit à passer la gate | Nul | Ajouter une déduplication des liens avant le comptage |
| **G-B5** Min 1000 mots | Haute — qualité SEO | Trop souple — les specs disent 1500-2500 mots. 1000 mots = article court qui n'atteint pas le standard | Elevé : un article de 1050 mots passe mais est sous le standard | Nul | Aligner sur le standard réel : 1500 mots minimum |
| **G-B6** FAQ présente | Haute — schema FAQ obligatoire | Fragile — `##.*\?` est trop permissif (n'importe quel H2 sous forme de question suffit) | Elevé : un H2 "Comment ça marche ?" dans le corps de l'article n'est pas une FAQ | Faible | Chercher plutôt `## (FAQ|Questions fréquentes|Questions courantes)` |
| **G-B7** Refs legacy <= 1 | Haute — standard qualité CLAUDE.md | Correcte | Faible | Nul | Solide |

**Bilan blog :** 2 gates parfaites (G-B2, G-B3), 2 solides (G-B1, G-B7), 3 avec défauts notables (G-B4 doublons, G-B5 seuil trop bas, G-B6 faux positif FAQ).

---

### Social — `runSocialGates` (8 gates)

| Gate | Pertinence | Calibration | Risque contournement | Risque faux positif | Note |
|---|---|---|---|---|---|
| **G-S1** Pas de persona leak | Critique | Bonne | Faible | Nul | Solide |
| **G-S2** Hook <= 8 mots | Haute — stand-up strategy | Bonne. Le brief dit "5 mots" mais 8 est plus réaliste pour le français | Moyen : hook de 8 mots banals passe mais ne stoppe pas le scroll | Faible | Correct. La validation IA prend ensuite le relais pour la qualité du hook |
| **G-S3** Anti-IA red flags | Haute — identité de marque | Bonne liste mais incomplète — manquent "absolument", "pertinent", "impactant", "paradigme", "synergies", "optimiser" mentionnés dans le prompt IA mais absents des gates | Moyen : red flags IA non listés passent | Nul | Aligner la liste programmatique avec la liste du prompt IA |
| **G-S4** Anti-engagement bait | Critique — règle absolue CLAUDE.md | Bonne liste pour les cas explicites | Moyen : "Dis-moi en commentaire..." ou "Répondez à cette question..." ne sont pas dans la liste | Nul | Liste partielle. Ajouter les variantes françaises courantes |
| **G-S5** Char limit par plateforme | Haute — contrainte technique | Correcte pour Twitter/LinkedIn/Instagram. Mais : Twitter 280 chars = limite officielle, la limite réelle avec emojis est ~270 — incohérence avec le fix documenté dans CLAUDE.md | Nul — contrainte technique | Faible | Alignement requis avec le fix Twitter 270 chars documenté dans l'historique |
| **G-S6** CTA non-marketing | Haute — voix de marque | Correcte dans l'intention. La liste est partielle — "offrez-vous", "profitez de", "rejoignez" manquent | Moyen : CTA marketing non listé passe | Nul | Enrichir la liste |
| **G-S7** Max 2 emojis | Haute — ton stand-up pro | Calibration discutable — le brief dit "max 2 emojis" mais la validation IA dit "jamais en ouverture". Ces deux règles ne sont pas les mêmes. La gate ne vérifie pas la position | Elevé : 2 emojis en ouverture passent la gate mais violent la règle de voix | Faible | Ajouter un check : pas d'emoji dans les 5 premiers caractères du hook |
| **G-S8** Voix équipe (on, pas je) | Haute — cohérence de marque | Fragile — le pattern regex `j'ai (compilé|créé|...)` est trop limité. "j'ai pensé que", "j'ai voulu savoir", "je trouvais" passent | Elevé : nombreuses formulations en "je" non couvertes | Faible | Élargir le pattern à toute formulation `\bj[''](?:ai |veux |pense |crois |trouve )\b` |

**Bilan social :** 3 gates solides (G-S1, G-S2, G-S5), 5 avec des défauts de calibration ou des listes incomplètes. La gate la plus problématique est G-S3 dont la liste programmatique est désalignée de la liste dans le prompt IA.

---

## Ce qui manque — Gates absentes

### Vannes

| Gate manquante | Problème qu'elle résout | Priorité |
|---|---|---|
| **Unicité du concept** | Un doublon conceptuel exact (même comparaison, même setup reformulé) peut passer toutes les gates | Haute |
| **Autodérision sans punch** | "Je suis nul à rien / Je suis toujours le dernier" sans retournement comique passe G-J6 facilement | Haute |
| **Vulgaire détecté** | Le CLAUDE.md interdit explicitement le vulgaire mais aucune gate ne le bloque programmatiquement | Haute |
| **Setup trop court** | Un setup d'un seul mot passe G-J1 et G-J2 sans problème | Moyenne |

### Conseils

| Gate manquante | Problème qu'elle résout | Priorité |
|---|---|---|
| **Technique nommée dans le titre** | Un conseil sans technique identifiable passe les 4 gates actuelles | Haute |
| **Doublon de catégorie** | Un conseil identique à un conseil existant sur la même technique n'est pas détecté | Haute |
| **Exercice faisable aujourd'hui** | G-T2 vérifie le format "DÉFI" mais pas que l'exercice soit réalisable dans la journée | Moyenne |

### Blog

| Gate manquante | Problème qu'elle résout | Priorité |
|---|---|---|
| **Présence du mot-clé dans l'intro** | Critère SEO non négociable (prompt IA) non vérifié programmatiquement | Critique |
| **Présence du mot-clé dans au moins un H2** | Idem — critère SEO cité mais non gatisé | Critique |
| **Lien sortant YouTube interdit** | Le prompt IA interdit les liens sortants YouTube mais aucune gate ne le bloque | Haute |
| **Minimum 3 H2 (structure)** | Un article sans structure H2 peut passer les gates actuelles | Haute |
| **Humour présent (au moins 1 vanne)** | La règle "minimum 3 traits d'humour" existe dans le prompt mais n'est pas gatisée | Haute |

### Social

| Gate manquante | Problème qu'elle résout | Priorité |
|---|---|---|
| **Format dialogue reconstitué** | "Moi : ... / Mon pote : ..." est un rejet automatique dans le prompt (score <= 3) mais aucune gate ne le bloque | Critique |
| **Lien dans les 3 premières lignes** | Le CLAUDE.md interdit explicitement les liens dans les 3 premières lignes (algo pénalise) | Haute |
| **Hashtag dans le corps du tweet** | Pour Twitter, le brief interdit les hashtags dans le corps — seule la liste de hashtags séparée est valide | Haute |
| **Thread : dernier tweet = CTA** | Structure obligatoire des threads non vérifiée | Moyenne |

---

## Top 3 améliorations prioritaires

### Priorité 1 — Ajouter la gate anti-vulgaire (Vannes)

**Impact :** critique. Le CLAUDE.md dit "jamais vulgaire" comme valeur de marque absolue. Il n'existe aucune gate programmatique qui bloque un contenu vulgaire avant le LLM. Un agent mal calibré peut générer une vanne grossière qui passe les 7 gates actuelles sans problème.

**Implémentation :** ajouter G-J8 avec une liste de termes explicites et de patterns vulgaires courants. Vérifier sur `fullText`. Un seul match = FAIL.

---

### Priorité 2 — Aligner les seuils de mots sur les specs réelles (Blog + Conseils)

**Impact :** haute. G-B5 accepte des articles à partir de 1000 mots, alors que le standard est 1500 mots (pillar) / 1000 mots (satellite). G-T3 accepte des conseils à partir de 60 mots, alors que le directeur lui-même réécrit les conseils à 120-180 mots. Ces incohérences entre les gates et les specs réelles signifient que des contenus sous-standard passent les gates et arrivent à la validation IA — coûtant des tokens pour une validation qui devrait être bloquée en amont.

**Implémentation :**
- G-B5 : passer à 1200 mots (seuil conservatif entre 1000 satellite et 1500 pillar)
- G-T3 : passer à 100 mots

---

### Priorité 3 — Ajouter la gate anti-dialogue reconstitué (Social)

**Impact :** critique. Le format "Moi : ... / Mon pote : ..." est qualifié de rejet automatique à score <= 3 dans le prompt IA, et identifié comme "le format le plus saturé de Twitter". Mais c'est justement un format que les agents IA génèrent fréquemment (c'est facile à produire). Sans gate programmatique, ce format doit payer une validation LLM complète avant d'être rejeté, coûtant du temps et des tokens.

**Implémentation :** ajouter G-S9 avec pattern `/^(moi\s*:|lui\s*:|elle\s*:|mon pote\s*:|ma boss\s*:|prof\s*:|chef\s*:)/im` sur le contenu du post et les threadParts. Un match = FAIL immédiat.

---

## Synthèse des incohérences internes détectées

| Incohérence | Localisation | Sévérité |
|---|---|---|
| G-B5 accepte 1000 mots, prompt IA exige 1500-2500 mots | `runBlogGates` vs `validateBlogArticle` | Haute |
| G-T3 accepte 60 mots, `directorRewriteTip` génère 120-180 mots | `runTipGates` vs `directorRewriteTip` | Haute |
| G-S5 utilise 280 chars Twitter, le fix documenté utilise 270 chars | `runSocialGates` vs historique CLAUDE.md | Moyenne |
| G-S3 liste 13 red flags IA, le prompt liste ~20 red flags (dont 7 absents des gates) | `runSocialGates` vs `validateSocialPost` prompt | Moyenne |
| G-S8 couvre uniquement 8 verbes en "je", le prompt interdit tout "je" pour la marque | `runSocialGates` vs `validateSocialPost` prompt | Moyenne |
| `validateNewVideo` utilise un seuil APPROVED >= 7 au lieu de >= 9 (standard universel) | `validateNewVideo` prompt vs `parseValidationResult` | Haute — le parseValidationResult override de toute façon à >= 9, créant une incohérence dans le prompt |

---

## Hypothèses à valider

- [HYPOTHÈSE : seuil G-B5 à 1200 mots — à confirmer selon la répartition pillar/satellite du catalogue actuel]
- [HYPOTHÈSE : pattern anti-dialogue reconstitué — à tester sur le catalogue social existant pour éviter les faux positifs]

---

**Handoff → @fullstack**
- Fichiers produits : `docs/reviews/gates-audit-director.md`
- Décisions prises : 26 gates auditées, note globale 6,5/10, 3 priorités d'amélioration identifiées, incohérences internes documentées
- Points d'attention pour la suite : les 3 améliorations prioritaires (gate anti-vulgaire, alignement seuils, gate anti-dialogue reconstitué) sont toutes dans `standup-director-agent.ts`, fonctions `runJokeGates`, `runTipGates`, `runBlogGates`, `runSocialGates`. Chaque correction est une modification ciblée de quelques lignes.
