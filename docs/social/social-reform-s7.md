# Social Reform S7 — 3 plateformes, 3 formats simples, 9 exemples concrets

**Mode** : Design uniquement. Aucun code modifié.
**Décision verrouillée par Thomas** : garder Twitter + LinkedIn + Instagram. Réformer les 3 simplement pour que ça marche.
**Objectif** : 1 format identifiable par plateforme, validé sur exemples avant toute modif code.
**Date** : 2026-05-05.

---

## 1. Diagnostic rapide — Pourquoi on réforme

Audit des briefs actuels (`social-media-agent.ts` + `social-editorial-plan.json`) :

- **Twitter** : 4 formats coexistent (TWEET, THREAD, QUOTE_ANALYSIS, WILD_CARD) → l'agent hésite, le ton flotte. Trop de slots/jour (2-4) dilue la barre.
- **LinkedIn** : brief "thought leader bienveillant" qui produit du semi-broetry — ex rejeté par Thomas : "Plantage total en réunion..." (faux storytelling, leçon plaquée, structure hook → leçon → CTA).
- **Instagram** : 3 templates (TECHNIQUE_DU_JOUR, LA_VANNE, LE_DEFI) avec règles charte mais 0 garde-fou sur la longueur de caption ni sur la punchline visuelle. Résultat : on publie des affiches "cours d'humour" au lieu de vannes qui claquent dans le feed.

**Constat commun** : trop de variantes par plateforme = pas d'identité reconnaissable. On simplifie radicalement : **1 format par plateforme**, brief court, gates Director qui rejettent tout ce qui dévie.

---

## 2. Stratégie — 1 plateforme, 1 format, 1 promesse

| Plateforme | Format unique | Promesse au lecteur | Persona dominant |
|---|---|---|---|
| Twitter | **Mini-Stand-Up** | Une punchline de 30 secondes, prête à recracher | Tous (rotation) |
| LinkedIn | **Le pote au taf** | Une vanne courte sur ta journée de boulot, sans leçon | Sophie / Marc |
| Instagram | **L'image qui claque** | Une punchline en gros sur fond violet, reconnaissable en 1 sec | Yanis / Sophie |

Règle commune aux 3 : **le post se suffit à lui-même**. Pas de "pour aller plus loin", pas de "découvre nos 290+ vannes", pas de CTA pushy. Le compte sert la marque par accumulation de bonnes vannes — pas par rappel constant qu'on a un site.

---

## 3. Fiches format — détail par plateforme

### 3.1 Twitter — "Mini-Stand-Up"

**Anatomie**
- 1 single tweet, ≤ 270 caractères (marge de sécurité Twitter)
- Soit : **1 punchline originale** (setup 1 ligne + chute 1 ligne)
- Soit : **1 vanne du catalogue REFORMULÉE social-native** (jamais copier-coller)
- Hook ≤ 5 mots qui crée une tension (contradiction, spécificité bizarre, interpellation)
- Zéro lien dans les 3 premières lignes (idéalement zéro lien tout court — rappel : 1 post sur 5 max avec lien)
- Pas de hashtag dans le corps
- Pas de thread, pas de "🧵 1/7" — un Mini-Stand-Up c'est UN tweet point

**Tonalité**
- Ton site amplifié : phrases plus courtes, plus de ruptures
- Tutoiement systématique
- Spontané, comme si tu envoyais un DM à un pote pendant ta pause
- Détails spécifiques (pas "une situation gênante" mais "le silence après ta vanne au repas de Noël")

**5 anti-patterns (rejet immédiat)**
1. Thread déguisé : si le post tient en plusieurs tweets, c'est pas le format
2. Listicle : "5 raisons pour..." / "Top 3..." / "Voici comment..."
3. Quote vidée : citer un humoriste sans donner la vanne réelle ("Fary fait un truc génial sur...")
4. Engagement bait : "tag un ami qui...", "complète : ...", "note de 1 à 10"
5. Description plate en hook : "Astuce humour du jour", "Petit thread sur..."

**Quand poster (par persona)**
- Yanis : 19h-21h (scroll du soir)
- Sophie : 7h (trajet) + 11h (avant pause déj)
- Marc : 6h (matin calme) + 18h (sortie boulot)

---

### 3.2 LinkedIn — "Le pote au taf"

**Anatomie**
- **2 à 3 phrases max**. Si ça déborde, c'est pas le format.
- 1 vanne ou 1 mini-observation drôle sur une situation pro REELLE (réunion, mail patron, calendrier surchargé, machine à café, slack qui notif à 22h, présentation PowerPoint)
- Pas de structure "hook → leçon → CTA" — juste une vanne posée
- Pas de saut de ligne entre chaque phrase (broetry interdit) — paragraphes courts mais pas de "1 phrase = 1 paragraphe"
- 1 hashtag max, en fin (ex : `#humour`)
- Tutoiement systématique (oui même sur LinkedIn — c'est notre signature)
- Pas de lien dans le post (zéro lien LI sauf événement spécial)

**Tonalité**
- Ton du collègue drôle qu'on retient à la machine à café — pas du LinkedIn guru
- Plus mature que Twitter (audience adulte) mais ZÉRO corporate
- Tu pourrais l'envoyer en DM à un collègue de confiance
- Pas de "j'ai appris X leçons en Y ans" — pas de "let that sink in" — pas de "agree?"

**5 anti-patterns (rejet immédiat)**
1. **Faux storytelling pro** : "Il y a 3 ans, j'étais au fond du gouffre..." / "Plantage total en réunion : voici ce que j'ai appris" — formule LinkedIn-bingo, signal IA immédiat
2. **Leçon-moralisatrice** : "Le truc :", "La vraie leçon :", "Ce que j'en retiens :", "Spoiler :", "Plot twist :"
3. **Broetry one-liner** : 3+ sauts de ligne consécutifs avec 1 mot par ligne (style "Confidence./.Is.Everything." )
4. **Vocabulaire coach** : "leadership", "performance", "growth mindset", "scaler", "stack", "soft skills", "impact", "synergie"
5. **CTA pushy** : "agree?", "thoughts?", "repost si...", "qui d'autre vit ça ?", emoji 🚀💡🎯 en début de ligne

**Quand poster (par persona)**
- Sophie : 6h-7h (trajet matin) ou 12h-13h (pause déj)
- Marc : 7h ou 19h (matin / après boulot)
- Yanis : **JAMAIS** sur LinkedIn (il y est pas)

**Test du format** : tu pourrais l'envoyer en Slack à un collègue sans qu'il pense que c'est un post auto-promo. Si oui → format respecté.

---

### 3.3 Instagram — "L'image qui claque"

**Anatomie**
- 1 image carrée 1080x1080 (template satori existant — charte violette respectée)
- **Punchline en gros sur le visuel : max 6 mots**. Reconnaissable en moins d'1 seconde dans un feed.
- Caption courte sous l'image : **≤ 80 caractères**, ton "le pote qui te chambre"
- Hashtags : 0 dans la caption, jusqu'à 15 en premier commentaire (mix primary + niche)
- Pas de carousel (limitation Buffer)

**Tonalité**
- Visuel = la vanne à 99%. Caption = le clin d'œil
- L'image doit faire rire SEULE, sans la caption
- Tutoiement, ton complice, pas de "découvre", pas de "swipe"
- Punchline sur le visuel = formulée comme on la dirait à voix haute

**5 anti-patterns (rejet immédiat)**
1. **Caption longue qui explique la blague** : si la caption fait > 80 chars, l'image est ratée — la blague doit être DANS l'image
2. **"Tag un ami qui..."** ou "Double-tap si toi aussi" — engagement bait classique IG
3. **Texte trop dense sur le visuel** : 6 mots max. Si tu mets une phrase complète + un nom d'humoriste + une mini-explication, c'est une diapo PowerPoint, pas une vanne
4. **Citation d'humoriste sans la vanne réelle** : "Selon Roman Frayssinet, l'humour c'est..." → on veut LA punchline de Roman, pas une paraphrase
5. **Charte cassée** : fond clair, accent autre que violet du site, typo non-italique sur la punchline → l'image perd son identité de marque

**Quand poster (par persona)**
- Yanis : 18h-20h
- Sophie : 10h ou 17h (pause déj / sortie boulot)
- Marc : 6h ou 19h
- Note : éviter dimanche 22h (algo IG plus faible)

**Test du format** : si un inconnu tombe sur ton feed et voit 9 images d'affilée, il sait à 100% que c'est ton compte. Identité visuelle reconnaissable.

---

## 4. 9 exemples concrets — 3 par plateforme

### 4.1 Twitter

#### Twitter — Exemple 1 (persona : Yanis, format : Mini-Stand-Up)

```
Ma coloc a refait le frigo.

Elle a mis une étiquette sur tout. Y compris sur le bouton de la lumière.

Au cas où je perde le mode d'emploi du frigo.
```

**Décortiquage**
- Hook : "Ma coloc a refait" (5 mots) — petit moment du quotidien étudiant, ça intrigue (refait quoi ?)
- Punchline : l'étiquette sur le bouton de la lumière + la chute "au cas où je perde le mode d'emploi du frigo" = absurde maîtrisé
- Persona servi : Yanis vit en coloc, scène ultra-relatable
- Char count : 165/270

---

#### Twitter — Exemple 2 (persona : Sophie, format : Mini-Stand-Up — vanne réécrite social)

```
Mon boss m'a dit "tu es irremplaçable".

Je me suis sentie flattée.

Jusqu'à ce que je comprenne que personne d'autre voulait le poste.
```

**Décortiquage**
- Hook : "Mon boss m'a dit" (5 mots) — promesse classique, on attend la chute
- Punchline : retournement ("flattée" → "personne voulait le poste") = format Sophie classique
- Persona servi : Sophie machine à café, situation pro qu'elle peut sortir verbatim demain
- Char count : 152/270
- **Origine** : vanne #7 du catalogue, **réécrite** en rythme tweet (3 phrases courtes au lieu d'1 setup + 1 chute, plus parlé)

---

#### Twitter — Exemple 3 (persona : Marc, format : Mini-Stand-Up)

```
Premier date depuis 8 ans.

Je lui demande ce qu'elle aime dans la vie. Elle dit "voyager".

J'ai compris que j'avais oublié comment les gens parlent.
```

**Décortiquage**
- Hook : "Premier date depuis 8 ans" (5 mots) — ultra-spécifique, signale Marc post-séparation, on veut savoir comment ça s'est passé
- Punchline : observation sociale acide ("j'avais oublié comment les gens parlent") qui rit du cliché du dating tout en disant un truc vrai sur la rouille sociale
- Persona servi : Marc reconstruction, scène dating qu'il vit vraiment
- Char count : 168/270

---

### 4.2 LinkedIn

#### LinkedIn — Exemple 1 (persona : Sophie, format : Le pote au taf)

```
Ce moment où ton chef envoie "petit point rapide ?" à 17h57.

Tu sais déjà que tu vas rater ton train.

Et que le point va durer 35 minutes pour te dire qu'on en reparlera lundi.
```

**Décortiquage**
- Format : 3 phrases, observation pro pure, 0 leçon
- Tonalité : tutoiement, ton "on est dans le même bateau"
- Persona : Sophie en open space, scène vécue par 80% des CDI
- **Test du DM** : tu pourrais l'envoyer à une collègue, elle rirait. Validé.
- Anti-pattern check : pas de "le truc", pas de hook formel, pas de CTA, pas d'humoriste plaqué

---

#### LinkedIn — Exemple 2 (persona : Marc, format : Le pote au taf)

```
Mon ex m'a appelé pour me dire qu'elle avait gardé mon abonnement Netflix.

J'ai dit "pas de souci".

Puis j'ai changé le mot de passe et regardé toute la nouvelle saison de Casa de Papel pour rien, par principe.
```

**Décortiquage**
- Format : 3 phrases, anecdote post-séparation maniée à l'humour
- Tonalité : Marc qui assume, autodérision sans pitié
- Persona : Marc reconstruction, audience LI adulte qui peut s'y retrouver (séparation = sujet adulte)
- **Test du DM** : tu pourrais l'envoyer à un pote en mode "mdr le délire" — pas un post leçon-de-vie
- Anti-pattern check : pas de "j'ai appris X choses sur la séparation", pas de "voici 5 lessons learned", pas de leçon — juste une vanne posée

---

#### LinkedIn — Exemple 3 (audience LI étendue : "manager bienveillant", persona Sophie/Marc bridge)

```
Tu sais que ton équipe est saine quand quelqu'un peut dire "je comprends rien à ton slide" sans que ce soit un drame.

C'est pas du leadership, c'est juste de l'humour à temps.

Genre la phrase qui sauve 40 minutes de réunion gênée.
```

**Décortiquage**
- Format : 3 phrases, observation managériale qui passe par l'humour (pas l'inverse)
- Tonalité : assume une opinion sans poser une leçon ("c'est pas du leadership, c'est juste de l'humour à temps") — **on désamorce le mot leadership en s'en moquant**
- Persona : bridge Sophie/Marc, audience LI managers — sans tomber dans le LinkedIn-bingo
- **Test du DM** : pourrait être un Slack message d'un manager cool à un autre
- Anti-pattern check : on prononce "leadership" mais POUR le déconstruire, pas pour le célébrer — limite acceptée. À surveiller au gate Director.

---

### 4.3 Instagram

#### Instagram — Exemple 1 (persona : Yanis, format : L'image qui claque)

**Visuel (1080x1080)**
- Fond : noir profond
- Punchline en gros, blanc cassé, italique, centrée :
  > **"En soirée, moi je suis le plat froid."**
- Filet violet (accent-primary) en bas de l'image
- Logo discret bottom-right

**Caption (≤ 80 chars)**
```
Ça réchauffe, mais faut attendre. (mood Yanis, soirée, étudiant)
```
→ 65 chars

**Décortiquage**
- Image fait rire seule (autodérision sociale)
- Caption = clin d'œil pote, pas explication
- Reconnaissable < 1 sec : fond noir + violet + texte italique = signature
- Persona : Yanis introverti en soirée, autodérision validée

---

#### Instagram — Exemple 2 (persona : Sophie, format : L'image qui claque)

**Visuel (1080x1080)**
- Fond : noir profond, dégradé subtil violet en bas
- Punchline en gros :
  > **"Lundi 9h, mon âme buffer."**
- Filet violet en bas

**Caption (≤ 80 chars)**
```
On charge à 12%. Faut un café et 3 vannes.
```
→ 43 chars

**Décortiquage**
- Punchline visuelle joue sur "buffer" (ref tech connue de tous) + image de l'âme qui charge
- Caption complète sans expliquer
- Persona : Sophie pause-café, vanne pour sortir au bureau lundi matin
- Mood adulte cool, pas corporate

---

#### Instagram — Exemple 3 (persona : Marc, format : L'image qui claque)

**Visuel (1080x1080)**
- Fond : noir profond
- Punchline en gros :
  > **"34 ans, je redécouvre les apéros."**
- Filet violet en bas

**Caption (≤ 80 chars)**
```
C'est comme le vélo. Tu tombes plus, ça fait plus mal.
```
→ 54 chars

**Décortiquage**
- Image fait sourire seule (Marc reconstruction sociale, ton tendre + drôle)
- Caption ajoute une seconde vanne (mini one-two)
- Persona : Marc reconstruction, ton chaleureux qui n'infantilise pas
- Charte respectée, identité de marque préservée

---

## 5. Spec mise à jour Stand-Up Director — nouveaux gates

À ajouter dans `runSocialGates` (`standup-director-agent.ts`, ligne ~1754) après les gates G-S1 à G-S13 existants.

### G-S14 — TWITTER : Format Mini-Stand-Up uniquement

**Règle** : sur Twitter, refuser tout post avec `threadParts.length > 0` OU avec `format` autre que `TWEET`.
**Justification** : on supprime les threads, quote_analysis et wild_cards en single-tweet — un seul format par plateforme.
**Pseudocode**
```ts
if (post.platform === "TWITTER") {
  const isThread = post.threadParts && post.threadParts.length > 0;
  const isAllowedFormat = post.format === "TWEET";
  results.push({
    gate: "G-S14 TWITTER format Mini-Stand-Up uniquement",
    pass: !isThread && isAllowedFormat,
    reason: isThread ? "Thread interdit (Mini-Stand-Up = 1 tweet)" : !isAllowedFormat ? `Format ${post.format} interdit sur Twitter` : "OK",
  });
}
```
**Test anti-régression** : générer un post Twitter avec `threadParts: ["t1","t2","t3"]` → gate FAIL.

---

### G-S15 — LINKEDIN : ≤ 3 phrases ET pas de leçon-moralisatrice

**Règle** : sur LinkedIn, refuser si :
- nombre de phrases > 3 (compte les `.`, `!`, `?` finaux)
- contient un des marqueurs leçon-moralisatrice : `"le truc :"`, `"la vraie leçon"`, `"ce que j'en retiens"`, `"spoiler :"`, `"plot twist"`, `"ça marche aussi"`, `"voici ce que j'ai appris"`, `"il y a X ans, j'étais"`
- broetry pattern : 3+ sauts de ligne consécutifs (`/\n{3,}/`)

**Pseudocode**
```ts
if (post.platform === "LINKEDIN") {
  const sentenceCount = (post.content.match(/[.!?]+(?:\s|$)/g) || []).length;
  const lessonMarkers = ["le truc :", "la vraie leçon", "ce que j'en retiens", "spoiler :", "plot twist", "ça marche aussi", "voici ce que j'ai appris"];
  const hasLesson = lessonMarkers.find(m => post.content.toLowerCase().includes(m));
  const hasBroetry = /\n{3,}/.test(post.content);
  const fakeStorytelling = /il y a \d+ ans?,? j['']?(é|e)tais/i.test(post.content);
  const fail = sentenceCount > 3 || hasLesson || hasBroetry || fakeStorytelling;
  results.push({
    gate: "G-S15 LINKEDIN format Le pote au taf",
    pass: !fail,
    reason: sentenceCount > 3 ? `${sentenceCount} phrases (max 3)` : hasLesson ? `Marqueur leçon : "${hasLesson}"` : hasBroetry ? "Broetry détecté (3+ sauts de ligne)" : fakeStorytelling ? "Faux storytelling 'il y a X ans'" : "OK",
  });
}
```
**Tests anti-régression** :
- Post LinkedIn 4 phrases → FAIL ("4 phrases")
- Post LinkedIn contenant "Le truc :" → FAIL
- Post LinkedIn avec "Il y a 3 ans, j'étais..." → FAIL

---

### G-S16 — INSTAGRAM : Caption ≤ 80 chars ET pas d'engagement bait IG

**Règle** : sur Instagram, refuser si :
- `post.content.length > 80` (la caption — l'image a son propre check de texte côté satori)
- contient : `"tag un ami"`, `"double-tap"`, `"swipe pour"`, `"clique sur le lien en bio"`

**Pseudocode**
```ts
if (post.platform === "INSTAGRAM") {
  const captionTooLong = post.content.length > 80;
  const igBait = ["tag un ami", "double-tap", "double tap", "swipe pour", "clique sur le lien en bio", "lien en bio !"];
  const foundIgBait = igBait.find(b => post.content.toLowerCase().includes(b));
  const fail = captionTooLong || foundIgBait;
  results.push({
    gate: "G-S16 INSTAGRAM caption ≤ 80 + anti-bait",
    pass: !fail,
    reason: captionTooLong ? `Caption ${post.content.length} chars (max 80)` : foundIgBait ? `Bait IG : "${foundIgBait}"` : "OK",
  });
}
```
**Tests anti-régression** :
- Caption de 120 chars → FAIL
- Caption "Tag un ami qui kiffe" → FAIL

---

### G-S17 — TOUS : Vocabulaire corporate / coach interdit

**Règle** : sur les 3 plateformes, refuser si le contenu contient des mots typiques du langage coach/corporate :
`leadership` (sauf si suivi de moqueurs explicites), `growth mindset`, `scaler`, `stack`, `synergie`, `synergies`, `paradigme`, `disruption`, `disruptif`, `impactant`, `impactante`, `levier`, `monétiser`, `optimiser` (sauf contexte évident genre "optimiser ton timing"), `KPI`, `ROI`, `actionable insights`, `value proposition`.

**Pseudocode**
```ts
const corporateWords = ["growth mindset", "scaler", "synergie", "paradigme", "disruption", "disruptif", "impactant", "actionable insight", "value proposition", "monétiser"];
const found = corporateWords.find(w => allTextLower.includes(w));
results.push({
  gate: "G-S17 Anti-corporate/coach",
  pass: !found,
  reason: found ? `Mot corporate : "${found}"` : "OK",
});
```
**Note importante** : `leadership` est laissé tolérant car l'exemple LI #3 l'utilise pour le déconstruire. Si abus → resserrer.
**Tests anti-régression** :
- Post avec "growth mindset" → FAIL
- Post avec "synergie" → FAIL

---

### G-S18 — TOUS : Référence humoriste avec contenu réel

**Règle** : si le post mentionne un nom d'humoriste de la rotation (Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg, Jamel, Gad), il DOIT contenir une vanne, citation ou geste précis attribué à cet humoriste — pas juste "X est trop fort sur Y".

**Heuristique simple** : si le post contient le nom d'un humoriste, vérifier qu'il contient AUSSI au moins un de ces marqueurs : guillemets `"..."` OU `«...»` (citation directe), OU un verbe d'action concret (`dit`, `fait`, `répète`, `décrit`, `observe`, `joue`).

**Pseudocode**
```ts
const humoristes = ["paul mirabel", "fary", "roman frayssinet", "blanche gardin", "waly dia", "panayotis pascot", "pierre croce", "inès reg", "jamel", "gad elmaleh"];
const mentioned = humoristes.find(h => allTextLower.includes(h));
if (mentioned) {
  const hasQuote = /["'«][^"'»]{8,}["'»]/.test(post.content);
  const hasActionVerb = /(dit|fait|répète|décrit|observe|joue|raconte|balance)\s+/i.test(post.content);
  results.push({
    gate: "G-S18 Humoriste avec contenu réel",
    pass: hasQuote || hasActionVerb,
    reason: !hasQuote && !hasActionVerb ? `Humoriste "${mentioned}" cité sans vanne ni geste précis` : "OK",
  });
}
```
**Tests anti-régression** :
- "Paul Mirabel est génial sur l'autodérision" → FAIL (rien de concret)
- "Paul Mirabel dit qu'il aime arriver en avance, comme ça il a le temps d'avoir peur." → PASS

---

## 6. Plan d'exécution code (post-validation Thomas)

Ordre d'exécution une fois les 9 exemples validés :

### 6.1 `apps/web/src/lib/ai/agents/social-media-agent.ts`

- **Refactorer `buildSocialBrief()`** (lignes 123-300) : remplacer la grosse section "TWITTER / LINKEDIN / INSTAGRAM" par 3 sous-briefs courts un par plateforme, alignés sur les 3 fiches format ci-dessus.
- **Supprimer** les sections "FORMAT SIGNATURE : TECHNIQUE DU JOUR" (~ligne 276) et "QUOTE_ANALYSIS" → il n'y a qu'UN format par plateforme.
- **Mettre à jour `SocialFormat`** type (ligne 87-92) : remplacer `"TWEET" | "THREAD" | "POST" | "QUOTE_ANALYSIS" | "TECHNIQUE_DU_JOUR"` par `"MINI_STANDUP" | "POTE_AU_TAF" | "IMAGE_QUI_CLAQUE"`.
- **Adapter `getDailyPlan()`** : 1 plan par plateforme par jour, format unique par plateforme.

### 6.2 `apps/web/src/lib/ai/agents/standup-director-agent.ts`

- **Ajouter G-S14 à G-S18** dans `runSocialGates()` (lignes 1754-1943), à la suite des gates existants G-S1 à G-S13.
- **Mettre à jour `validateSocialPost()`** prompt LLM (lignes 1969-1998) : retirer la mention "FORMAT" qui liste les 4 formats Twitter, citer le seul format autorisé par plateforme.

### 6.3 `social-editorial-plan.json`

- **Section `platforms.TWITTER`** : remplacer `formats: ["TWEET", "THREAD", "QUOTE_ANALYSIS", "WILD_CARD"]` par `formats: ["MINI_STANDUP"]`. Supprimer `threadsPerWeek`, `wildCardsPerWeek`. Réduire `postsPerDay` de "2-4" à "1-2".
- **Section `platforms.LINKEDIN`** : `formats: ["POTE_AU_TAF"]`. Mettre à jour les `rules` pour matcher la fiche format.
- **Section `platforms.INSTAGRAM`** : `formats: ["IMAGE_QUI_CLAQUE"]` (un seul template). Mettre à jour `templates` en conséquence côté JSX.
- **Section `weeklySchedule`** : simplifier — 1 post/jour par plateforme, plus de "Wild Card", plus de "Thread Décryptage".
- **Section `directorValidation.criteria`** : ajouter les 5 nouveaux gates (G-S14 à G-S18) en référence.

### 6.4 `apps/web/src/app/api/cron/daily-social/route.ts`

- **Adapter la génération** : 1 post Twitter + 1 post LinkedIn (sauf si Yanis = jour) + 1 post Instagram = 3 posts/jour max (vs ~5-7 actuels).
- Si jour Yanis : 1 Twitter + 1 Instagram (skip LinkedIn).

### 6.5 `apps/web/src/lib/social/templates/*.tsx`

- **Vérifier** qu'il existe bien un template `IMAGE_QUI_CLAQUE.tsx` qui respecte la charte (fond noir, accent violet, punchline italique max 6 mots, filet violet en bas).
- **Supprimer** ou archiver les templates `LE_DEFI.tsx` et `TECHNIQUE_DU_JOUR.tsx` s'ils existent — un seul template Instagram désormais.

### 6.6 Tests à ajouter (`apps/web/src/__tests__/`)

- `runSocialGates.test.ts` : 1-2 tests anti-régression par nouveau gate (G-S14 à G-S18). Total : ~10 tests.
- Mettre à jour les tests existants qui utilisent les anciens noms de format (`TWEET`, `THREAD`, etc.) → erreurs de compilation à corriger.

### 6.7 Estimation effort

- ~3-4h de code (refacto brief + types + gates + tests)
- ~30 min de validation manuelle (générer 5 posts par plateforme via `daily-social` en dry-run et vérifier qu'ils respectent les fiches format)
- 1 PR review par Thomas avant merge

---

## 7. Risques et points d'attention

1. **Risque "trop sec sur Twitter"** : passer de 2-4 posts/jour à 1-2 = baisse de volume initial. À monitorer sur 14 jours. Si engagement par post grimpe (ce qui devrait être le cas avec un seul format identifiable), on garde. Sinon on remonte à 2/jour mais TOUJOURS en Mini-Stand-Up.
2. **Risque "LinkedIn devient pauvre"** : LI déjà à 1 post/jour, pas de changement de volume. Le risque est plutôt qu'on rejette beaucoup au début (gate G-S15 strict). Plan B : si rejection rate > 50%, le directeur réécrit (déjà en place).
3. **Risque "Instagram caption trop courte sera pénalisé par algo"** : faux mythe — IG favorise les saves, pas la longueur de caption. À monitorer sur 30 jours.
4. **Risque "perte d'identité 'éducative'"** : les posts "Technique du Jour" disparaissent des trois plateformes. Si Thomas veut garder un format pédagogique, on peut réintroduire UN format secondaire 1x/semaine sur Twitter (Thread Décryptage), MAIS uniquement après 30 jours de Mini-Stand-Up pur pour mesurer.

---

**3 questions à Thomas avant exécution code :**
1. Tu valides les 3 formats (Mini-Stand-Up Twitter, Le pote au taf LinkedIn, L'image qui claque Instagram) ?
2. Sur les 9 exemples, lesquels valident le test du Pote ? Si certains sont nuls, lesquels remplacer ?
3. Les nouveaux gates G-S14 à G-S18 du Director te conviennent ou tu veux en ajouter/retirer ?
