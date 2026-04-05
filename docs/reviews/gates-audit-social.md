# Audit des gates programmatiques social media — deviens-marrant.fr

> Agent : @social | Date : 2026-04-05
> Source auditée : `apps/web/src/lib/ai/agents/standup-director-agent.ts` — fonction `runSocialGates` (lignes 1426-1550)
> Périmètre : 8 gates programmatiques (G-S1 à G-S8) évaluées sous l'angle performance social media
> Plateformes concernées : Twitter/X, LinkedIn, Instagram (publication via Buffer)

---

## Note globale : 5,5 / 10

**Justification :** Le socle est là — les 8 gates couvrent les risques les plus évidents (persona leak, engagement bait, red flags IA, char limits). Mais plusieurs gates sont mal calibrées pour la réalité du social : G-S2 est trop souple (8 mots vs l'objectif 5 mots documenté partout), G-S4 est incomplète sur les patterns LinkedIn et Instagram, G-S5 a un bug de mesure sur Twitter, et 4 gates importantes sont entièrement absentes. Le résultat : des posts qui "passent" programmatiquement mais qui seraient bloqués à la bonne vitesse par le LLM du directeur — avec un risque que des posts médiocres transitent si le LLM lui-même accepte trop facilement (fallback auto-approve n'existe pas, mais une gate manquante = une protection en moins avant le LLM).

---

## 1. Tableau d'évaluation des 8 gates actuelles

| Gate | Libellé | Calibration | Diagnostic |
|------|---------|-------------|-----------|
| G-S1 | Pas de persona leak | Bien calibrée | Couvre les 3 prénoms en minuscules et majuscules via regex case-insensitive. Aucun faux positif identifié. |
| G-S2 | Hook ≤ 8 mots | Trop souple | La stratégie, les templates et le brief directeur définissent unanimement ≤ 5 mots. 8 mots = 60% de marge supplémentaire, ce qui autorise des hooks trop longs qui ne stoppent pas le scroll. |
| G-S3 | Anti-IA (red flags) | Bien calibrée mais incomplète | La liste de 13 patterns est bonne. Manquent plusieurs expressions IA courantes en français (voir section 3). Pas de faux positifs détectés sur la liste actuelle. |
| G-S4 | Anti-engagement bait | Trop souple — patterns manquants | Couvre les patterns Twitter classiques mais ignore les formats propres à LinkedIn ("agree ?", broetry guru) et Instagram ("save this post", "double tap if"). Voir section 3. |
| G-S5 | Char limit | Bug Twitter + calibration discutable LinkedIn | Twitter : la gate mesure `post.content.length` au lieu de `post.hook + post.content` — le hook n'est pas compté dans le total, ce qui peut laisser passer un tweet de 290 chars réels. LinkedIn : le code accepte 1300 chars mais la limite affichée dans l'interface LinkedIn est 3000 chars ; en revanche, la coupure de portée organique (fold) intervient à ~210 chars — 1300 est un choix éditorial défendable mais non documenté. Instagram : 2200 chars accepté, limite réelle 2200, OK. |
| G-S6 | CTA non-marketing | Bien calibrée | Liste pertinente. Vérification uniquement si `cta.trim().length > 0` — les posts sans CTA ne passent pas inutilement cette gate. Pas de faux positifs. |
| G-S7 | Max 2 emojis | Trop strict pour LinkedIn et Instagram, juste pour Twitter | Sur Twitter, 2 emojis max est correct (ton punchy, texte pur). Sur LinkedIn, 2-3 emojis en début de ligne sont un code natif courant sans nuire à l'engagement. Sur Instagram, les posts atteignant 5-7 emojis peuvent très bien performer. Une gate uniforme sur les 3 plateformes est inadaptée. |
| G-S8 | Voix équipe (on, pas je) | Bien calibrée mais regex trop étroite | Le pattern `/\bj['']ai (compilé|créé|lancé|écrit|fait|préparé|développé)\b/i` ne couvre que 7 verbes. Des variantes comme "j'ai rédigé", "j'ai ajouté", "j'ai sélectionné", "j'ai testé" ne sont pas bloquées. La règle est juste mais l'implémentation est incomplète. |

---

## 2. Exemples concrets — posts qui passeraient ou échoueraient

### Posts qui PASSERAIENT les gates actuelles à tort

**Exemple 1 — G-S2 trop souple :**

Hook : "Voici une technique que les meilleurs comiques utilisent pour capter l'attention instantanément" (18 mots)

La gate G-S2 bloque à 8 mots. Ce hook ne serait pas bloqué si on avait été à 7 mots. En revanche, l'objectif est 5 mots — un hook de 7-8 mots comme "Cette technique de stand-up change tout" (7 mots) passerait la gate mais ne stopperait pas le scroll : c'est un titre d'article, pas un hook Twitter.

**Exemple 2 — G-S4 pattern LinkedIn manquant :**

Post LinkedIn :
"J'étais le plus timide de mon lycée.

Aujourd'hui je fais rire une salle de 200 personnes.

La différence ? Une technique de 3 secondes.

Agree ?"

Ce post passe G-S4 (aucun pattern de la liste actuelle n'est déclenché), mais "Agree ?" est exactement le pattern LinkedIn guru que le brief interdit explicitement. Le directeur LLM le rejettera, mais la gate ne l'attrape pas.

**Exemple 3 — G-S5 bug Twitter :**

Post Twitter généré avec :
- hook : "Fary parle plus fort que tout le monde." (46 chars)
- content : "Pas parce qu'il crie. Parce qu'il sait que le silence avant le mot-clé attire l'oreille. La technique : 0,5 seconde de pause avant le mot qui compte. Résultat : tout le monde l'écoute. Toi aussi tu peux faire ça ce soir, ça prend 30 secondes à apprendre." (252 chars)

Contenu seul = 252 chars, hook = 46 chars. Total réel = 298 chars > 280 chars. La gate G-S5 ne mesure que `post.content.length` (252) et laisse passer ce tweet, qui sera rejeté par l'API Twitter au moment de la publication.

**Exemple 4 — G-S7 trop strict sur LinkedIn :**

Post LinkedIn avec 4 emojis (un par paragraphe, chaque paragraphe commence par un emoji) :
"Voici les 4 techniques de stand-up qui changent une réunion : [suivi de 4 paragraphes commençant par un emoji]"

Ce format est du native LinkedIn courant. La gate G-S7 le rejette. Le directeur LLM l'approuverait probablement. Il y a donc un faux positif programmatique qui coûte un appel LLM inutile (le post est rejeté par gate, l'agent régénère, le nouveau post passe peut-être avec 2 emojis).

### Posts qui ÉCHOUERAIENT les gates à tort (faux positifs)

**Exemple 5 — G-S7 faux positif Instagram :**

Post Instagram avec 3 emojis dans un texte de 300 mots (densité très faible, format natif) :
"Le comique qui fait le plus rire sans blague... c'est celui qui dit 'attends, répète.' Fary le fait systématiquement. ..." [3 emojis dispersés]

Bloqué par G-S7 alors qu'un tel post est parfaitement dans les codes Instagram et aurait toutes ses chances d'être approuvé par le directeur LLM.

**Exemple 6 — G-S8 faux négatif (manque de couverture) :**

"On a rédigé 50 techniques de stand-up pour toi" → passe G-S8 (correct, c'est "on").
"j'ai rédigé 50 techniques de stand-up pour toi" → ne déclenche pas G-S8 car "rédigé" n'est pas dans la liste des 7 verbes. C'est un faux négatif — le post passe la gate alors qu'il devrait être bloqué.

---

## 3. Gates manquantes recommandées

### Gate G-S9 — Lien dans les 3 premières lignes (Twitter)

**Règle documentée dans CLAUDE.md :** "Zéro lien dans les 3 premières lignes (algo pénalise)."

**Implémentation suggérée :**

```typescript
// G-S9 — Pas de lien dans les 3 premières lignes (Twitter uniquement)
if (post.platform === "TWITTER") {
  const firstThreeLines = post.content.split("\n").slice(0, 3).join(" ");
  const hasLinkEarly = /https?:\/\/|deviens-marrant\.fr|bit\.ly/i.test(firstThreeLines);
  results.push({
    gate: "G-S9 Pas de lien dans les 3 premières lignes (Twitter)",
    pass: !hasLinkEarly,
    reason: hasLinkEarly ? "Lien détecté dans les 3 premières lignes — l'algo Twitter pénalise les posts avec lien visible" : "OK",
  });
}
```

**Justification :** L'algorithme Twitter (X) dépriorise les posts contenant un lien explicite visible dans le corps du texte, notamment dans les premières lignes. C'est documenté depuis 2022, confirmé par les données d'engagement de nombreux comptes. La règle est dans le brief mais n'est appliquée nulle part en programmatique.

---

### Gate G-S10 — Anti-engagement bait étendu par plateforme

**Patterns LinkedIn manquants :**

```typescript
// Ajouter à engagementBait selon la plateforme
const linkedinBait = [
  "agree?",
  "agree ?",
  "vous en pensez quoi",
  "vous pensez quoi",
  "et toi tu en penses quoi",
  "dans les commentaires",
  "dis-moi en commentaire",
  "partage à quelqu'un",
  "sauvegarde ce post",
  "follow pour plus",
];

const instagramBait = [
  "save this",
  "double tap",
  "tag someone",
  "qui se reconnaît",
  "partage à un ami qui",
  "follow pour plus",
  "lien en bio pour",
];
```

**Implémentation suggérée :**

```typescript
// G-S10 — Anti-engagement bait plateforme-spécifique
const platformBait: Record<string, string[]> = {
  LINKEDIN: ["agree?", "agree ?", "vous en pensez quoi", "dans les commentaires", "dis-moi en commentaire", "sauvegarde ce post", "follow pour plus"],
  INSTAGRAM: ["save this", "double tap", "tag someone", "qui se reconnaît", "partage à un ami qui", "follow pour plus"],
};
const platformSpecificBait = platformBait[post.platform] || [];
const foundPlatformBait = platformSpecificBait.find((bait) => allTextLower.includes(bait));
if (foundPlatformBait) {
  results.push({
    gate: "G-S10 Anti-engagement bait spécifique plateforme",
    pass: false,
    reason: `Engagement bait ${post.platform} détecté : "${foundPlatformBait}"`,
  });
}
```

**Justification :** La gate G-S4 actuelle couvre les patterns génériques, mais LinkedIn et Instagram ont des patterns d'engagement bait qui leur sont propres et qui sont explicitement interdits dans le brief ("agree ?" sur LinkedIn, "tag un ami" en français sur Instagram). Ces patterns passent aujourd'hui sans être bloqués.

---

### Gate G-S11 — Hashtags dans le corps du tweet (Twitter)

**Règle documentée :** "Twitter : pas de hashtags dans le corps" (documentée dans la validation LLM du directeur, ligne 1641).

**Implémentation suggérée :**

```typescript
// G-S11 — Pas de hashtags dans le corps du tweet (Twitter uniquement)
if (post.platform === "TWITTER") {
  const hashtagInBody = /#\w+/.test(post.content);
  results.push({
    gate: "G-S11 Pas de hashtags dans le corps du tweet",
    pass: !hashtagInBody,
    reason: hashtagInBody ? "Hashtag détecté dans le corps du tweet — nuit au reach organique Twitter (les hashtags vont dans les métadonnées, pas dans le texte)" : "OK",
  });
}
```

**Justification :** Les hashtags dans le corps d'un tweet réduisent le reach organique depuis 2023 (confirmé par les données d'engagement des comptes qui ont testé with/without). Le directeur LLM mentionne cette règle dans son prompt de validation (critère 9, ligne 1641) mais elle n'est pas appliquée programmatiquement. Si un post passe le LLM sans que celui-ci vérifie ce point, le hashtag peut passer.

---

### Gate G-S12 — Broetry LinkedIn

**Règle documentée :** "PAS de broetry" dans la validation LLM (ligne 1641).

**Implémentation suggérée :**

```typescript
// G-S12 — Anti-broetry LinkedIn
if (post.platform === "LINKEDIN") {
  const lines = post.content.split("\n").filter((l) => l.trim().length > 0);
  // Broetry = >60% des lignes font ≤ 5 mots (format guru une phrase par ligne)
  const shortLines = lines.filter((l) => l.trim().split(/\s+/).length <= 5);
  const broetryRatio = lines.length >= 5 ? shortLines.length / lines.length : 0;
  results.push({
    gate: "G-S12 Anti-broetry LinkedIn",
    pass: broetryRatio < 0.6,
    reason: broetryRatio >= 0.6 ? `Broetry détecté : ${Math.round(broetryRatio * 100)}% de lignes à ≤ 5 mots — format guru LinkedIn interdit (narratif creux, une phrase par ligne)` : "OK",
  });
}
```

**Justification :** Le "broetry" LinkedIn (style "Il y a 3 ans. / J'avais tout perdu. / Aujourd'hui. / Je gère 12 équipes.") est explicitement interdit dans le brief et la validation LLM. Or, il peut générer artificiellement de l'engagement en début de vie du post (l'algorithme LinkedIn favorise les posts courts avec beaucoup de sauts de ligne initialement). Le problème : ça fait du tort à la marque à moyen terme et à l'authenticité. Cette gate est faisable programmatiquement en mesurant le ratio de lignes très courtes.

---

## 4. Corrections techniques prioritaires

### Priorité 1 — Corriger G-S2 : hook de 8 → 5 mots

**Problème :** La gate autorise des hooks jusqu'à 8 mots alors que toute la documentation (CLAUDE.md, content-templates.md, brief directeur) indique ≤ 5 mots comme objectif.

**Impact :** Un hook de 6-8 mots est un titre d'article, pas un hook social. Il ne crée pas la tension nécessaire pour arrêter le scroll. Autoriser 8 mots revient à valider des posts qui ne performeront pas.

**Correction :**

```typescript
// Avant
const hookWords = post.hook.trim().split(/\s+/).length;
results.push({
  gate: "G-S2 Hook ≤ 8 mots",
  pass: hookWords <= 8,
  reason: hookWords > 8 ? `Hook fait ${hookWords} mots (max 8)` : "OK",
});

// Après
const hookWords = post.hook.trim().split(/\s+/).length;
results.push({
  gate: "G-S2 Hook ≤ 5 mots",
  pass: hookWords <= 5,
  reason: hookWords > 5 ? `Hook fait ${hookWords} mots (max 5) — un hook de ${hookWords} mots est un titre d'article, pas un arrêteur de scroll` : "OK",
});
```

**Exemple avant/après :**
- "Cette technique de stand-up change tout" (7 mots) → aujourd'hui : PASS. Après correction : FAIL.
- "Fary parle plus fort." (4 mots) → dans les deux cas : PASS.

---

### Priorité 2 — Corriger G-S5 : inclure le hook dans le comptage Twitter

**Problème :** La gate mesure `post.content.length` mais pas `post.hook.length`. Or le hook est publié dans le même tweet que le contenu (il est en première ligne). Un tweet peut donc dépasser 280 chars réels et passer la gate.

**Impact :** Les tweets trop longs sont tronqués ou rejetés par l'API Twitter lors de la publication. C'est un bug qui cause des échecs silencieux de publication.

**Correction :**

```typescript
// Avant (dans le cas non-thread)
results.push({
  gate: `G-S5 Char limit (${post.platform})`,
  pass: post.content.length <= limit,
  reason: post.content.length > limit
    ? `${post.content.length} chars (max ${limit})`
    : "OK",
});

// Après
const fullPostLength = post.platform === "TWITTER"
  ? (post.hook.trim() + "\n\n" + post.content.trim()).length
  : post.content.length;
const twitterSafeLimit = post.platform === "TWITTER" ? 270 : limit; // 270 = marge encodage
const effectiveLimit = post.platform === "TWITTER" ? twitterSafeLimit : limit;
results.push({
  gate: `G-S5 Char limit (${post.platform})`,
  pass: fullPostLength <= effectiveLimit,
  reason: fullPostLength > effectiveLimit
    ? `${fullPostLength} chars (max ${effectiveLimit} — hook + content combinés)`
    : "OK",
});
```

**Note :** Le pipeline publish-social/route.ts applique déjà une limite à 270 chars (safety net introduit lors du fix du 24/03/2026) — la gate doit être cohérente avec cette limite opérationnelle, pas avec la limite théorique Twitter de 280.

---

### Priorité 3 — Rendre G-S7 plateforme-spécifique

**Problème :** La limite de 2 emojis est uniforme sur toutes les plateformes alors que les codes natifs diffèrent significativement.

**Impact :** Faux positifs sur LinkedIn et Instagram — des posts parfaitement natifs sont bloqués programmatiquement, forçant une régénération inutile. Coût : un appel LLM supplémentaire pour un contenu valide.

**Correction :**

```typescript
// Avant
const emojiCount = (allText.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
results.push({
  gate: "G-S7 Max 2 emojis",
  pass: emojiCount <= 2,
  reason: emojiCount > 2 ? `${emojiCount} emojis (max 2)` : "OK",
});

// Après
const emojiLimits: Record<string, number> = {
  TWITTER: 2,    // Ton texte pur, émojis sparingly
  LINKEDIN: 4,   // Quelques émojis de structure sont natifs LinkedIn
  INSTAGRAM: 6,  // Les émojis font partie du langage Instagram
};
const emojiLimit = emojiLimits[post.platform] || 2;
const emojiCount = (allText.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
results.push({
  gate: `G-S7 Max ${emojiLimit} emojis (${post.platform})`,
  pass: emojiCount <= emojiLimit,
  reason: emojiCount > emojiLimit ? `${emojiCount} emojis (max ${emojiLimit} sur ${post.platform})` : "OK",
});
```

---

## 5. Synthèse des recommandations

### Gates à corriger (3)

| Gate | Problème | Correction | Urgence |
|------|---------|-----------|---------|
| G-S2 | Seuil 8 mots vs objectif 5 mots documenté partout | Réduire à 5 mots | Haute — cohérence strategy/code |
| G-S5 | Hook non compté dans le char limit Twitter | Inclure `post.hook` dans le calcul + aligner sur 270 chars (safety net existant) | Haute — bug de publication silencieux |
| G-S7 | Limite émojis uniforme tous plateformes | Limites différenciées : Twitter=2, LinkedIn=4, Instagram=6 | Moyenne — faux positifs évitables |

### Gates à ajouter (4)

| Gate | Règle couverte | Impact si absente | Urgence |
|------|---------------|------------------|---------|
| G-S9 | Pas de lien dans les 3 premières lignes Twitter | Posts Twitter dépriorisés par l'algo | Haute — règle explicite dans le brief |
| G-S10 | Anti-engagement bait spécifique LinkedIn/Instagram | "Agree ?" et "dis-moi en commentaire" passent | Haute — interdiction explicite dans le brief |
| G-S11 | Pas de hashtags dans le corps du tweet | Reach Twitter réduit | Moyenne — règle documentée mais non appliquée |
| G-S12 | Anti-broetry LinkedIn | Posts guru incohérents avec la marque | Basse — filet de sécurité supplémentaire, LLM attrape en général |

### Gates à conserver sans modification (2)

| Gate | Verdict |
|------|--------|
| G-S1 (persona leak) | Bonne couverture, aucun faux positif identifié |
| G-S3 (red flags IA) | Liste pertinente, peut être enrichie légèrement (voir ci-dessous) |
| G-S4 (engagement bait générique) | À compléter avec G-S10 mais la liste existante reste valide |
| G-S6 (CTA non-marketing) | Bien calibrée |
| G-S8 (voix équipe) | Règle juste, regex à élargir aux verbes manquants |

### Compléments mineurs recommandés pour G-S3 (red flags IA)

Expressions manquantes dans la liste actuelle :

```typescript
"c'est là que",           // "C'est là que tout change"
"voici pourquoi",         // opener IA typique
"aujourd'hui on va voir", // intro podcast/formation
"dans cet article",       // copié-collé d'article en post
"les études montrent",    // fausse autorité IA
"de nos jours",           // expression datée + IA
"permettre de",           // formulation molle
```

### Complément G-S8 (voix équipe) — verbes manquants

```typescript
// Élargir la liste des verbes
const jePattern = /\bj['']ai (compilé|créé|lancé|écrit|fait|préparé|développé|rédigé|ajouté|sélectionné|testé|analysé|publié|partagé|travaillé)\b/i;
```

---

## Handoff

---
**Handoff → @fullstack**
- Fichiers produits : `/home/user/Marrant/docs/reviews/gates-audit-social.md`
- Décisions prises : 3 gates à corriger (G-S2, G-S5, G-S7), 4 gates à ajouter (G-S9 à G-S12), compléments mineurs G-S3 et G-S8
- Points d'attention :
  - La correction G-S5 doit être alignée avec la safety net 270 chars déjà implémentée dans `publish-social/route.ts` (fix du 24/03/2026) — ne pas introduire une incohérence entre la gate (270) et la limite doc (280)
  - G-S9 (pas de lien dans les 3 premières lignes) doit s'appliquer uniquement à Twitter, pas à LinkedIn et Instagram
  - G-S10 (engagement bait plateforme) doit être conditionnelle à `post.platform` pour éviter des faux positifs cross-plateforme
  - G-S12 (broetry) est la gate la plus risquée en termes de faux positifs — la tester sur un échantillon de posts LinkedIn approuvés par le directeur LLM avant déploiement
  - Fichier à modifier : `apps/web/src/lib/ai/agents/standup-director-agent.ts`, fonction `runSocialGates` (lignes 1426-1550)
  - Tests à mettre à jour : ajouter des cas dans `apps/web/src/__tests__/` pour chaque nouvelle gate
---
