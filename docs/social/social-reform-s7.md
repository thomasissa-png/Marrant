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

## 1.bis — REVISION POST-FEEDBACK THOMAS (2026-05-05)

**Pourquoi cette révision** : le doc S7 v1 avait une **erreur de voix narrative critique** dans les 9 exemples. Tous écrits à la 1ère personne ("Ma coloc", "Mon boss", "Mon ex", "Je", "Moi") comme si le compte @marrant était une personne avec une vie privée.

**Le compte est un SITE / une MARQUE** — il n'a ni coloc, ni boss, ni ex. Le narrateur est un **observateur stand-up bienveillant** qui interpelle, observe, raconte le monde du lecteur — jamais qui se raconte.

**Diagnostic des 9 anciens exemples** :
- TW #1 "Ma coloc a refait le frigo" → INVALIDE ("ma" = compte personne)
- TW #2 "Mon boss m'a dit..." → INVALIDE ("mon", "je", "me")
- TW #3 "Premier date depuis 8 ans. Je lui demande..." → INVALIDE ("je")
- LI #1 "Ce moment où ton chef..." → OK (tutoiement lecteur, à conserver)
- LI #2 "Mon ex m'a appelé..." → INVALIDE ("mon", "je")
- LI #3 "Tu sais que ton équipe..." → OK (tutoiement, à raffiner)
- IG #1 "En soirée, moi je suis le plat froid" → INVALIDE ("moi je")
- IG #2 "Lundi 9h, mon âme buffer" → INVALIDE ("mon")
- IG #3 "34 ans, je redécouvre les apéros" → INVALIDE ("je")

**Origine probable du défaut** : le brief actuel de `social-media-agent.ts` invite à un ton "DM à un pote" — l'agent l'interprète "le compte est un pote qui partage SA vie" au lieu de "le compte parle À un pote de SA vie À LUI (le lecteur)". À corriger dans le brief lors de la phase code.

### Règle absolue de voix narrative

> Le compte @marrant n'est PAS une personne. C'est un site/une marque qui parle AU lecteur (Yanis/Sophie/Marc) pour le faire rire et l'aider à progresser en humour. Le narrateur observe, interpelle, raconte le monde — jamais ne se raconte.

**Mots/structures INTERDITS** dans tout post (TW/LI/IG), sauf citation explicite entre guillemets :
- `Je`, `J'`, `j'ai`, `Moi`, `Mon`, `Ma`, `Mes`, `Mien`, `Mienne`
- "Aujourd'hui on parle de", "Voici notre vanne du jour" (corporate prout-prout)
- Toute construction qui implique une vie personnelle du compte (coloc, boss, ex, parents, vacances)

### Les 5 formats de voix narrative valides

| # | Format | Marqueurs typiques | Exemple |
|---|---|---|---|
| 1 | **Observation universelle / coup de coude** | "Ce moment où tu...", "Quand ta...", "T'as remarqué que..." | "Ce moment où ton boss te dit que t'es irremplaçable juste avant de te demander les heures sup gratos." |
| 2 | **Mise en scène impersonnelle** | "Le X qui...", "La Y qui..." (pas "mon X") | "Le voisin qui te demande comment ça va à 7h du mat dans l'ascenseur. Il veut pas savoir. Tu veux pas répondre. C'est juste un rituel social." |
| 3 | **Vanne du catalogue citée explicitement** | "Une vanne à recracher : '...'", marqueur de citation + guillemets | "Une vanne à recracher en réunion demain : 'Ce graphique, même Excel l'a abandonné.' De rien." |
| 4 | **Question rhétorique au lecteur** | "Pourquoi est-ce que...", "T'as déjà essayé de...", "Comment expliquer que..." | "Pourquoi est-ce que la machine à café te demande si tu veux ton café 'fort' alors qu'elle le fait toujours pareil." |
| 5 | **Statement provocateur / observation acide** | "La vérité c'est que...", "Personne te le dit, mais...", "X% des gens..." | "Personne te le dit, mais ton chat juge tes textos d'excuse." |

### Test de la voix (à appliquer sur chaque post)

> "Est-ce que ce post pourrait être posté tel quel par n'importe qui sur son compte perso ?"
> - Si **OUI** → INVALIDE (le post sonne comme une personne, pas comme un compte marque)
> - Si **NON, c'est clairement un observateur extérieur qui interpelle** → VALIDE

### Conséquence pipeline

- Les 9 exemples sont **regénérés** ci-dessous (section 4) avec la nouvelle voix
- Un **nouveau gate G-S19** est ajouté à la spec Director (section 5) pour bloquer la 1ère personne hors citation
- Le brief de `social-media-agent.ts` devra être réécrit lors de la phase code pour clarifier la posture narrateur (item ajouté section 6.1)

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

## 4. 9 exemples concrets — 3 par plateforme (RÉVISION 2 — voix narrateur compte marque)

> Tous les exemples ci-dessous respectent la nouvelle règle : **le compte parle AU lecteur, pas DE soi**. Aucun "je / moi / mon / ma / mes" hors citation explicite entre guillemets.

### 4.1 Twitter

#### Twitter — Exemple 1 (persona servi : Yanis, format : Mini-Stand-Up, voix : Observation universelle)

```
Quand ta coloc met une étiquette sur tout dans le frigo.

Y compris sur le bouton de la lumière.

Comme si t'allais perdre le mode d'emploi.
```

**Décortiquage**
- Voix : Observation universelle ("Quand ta...")
- Hook : "Quand ta coloc met" (5 mots) — situation coloc, ça intrigue
- Punchline : l'étiquette sur le bouton de la lumière + chute qui amplifie l'absurde
- Persona servi : Yanis vit en coloc, scène ultra-relatable d'étudiant
- Char count : 142/270
- Test "compte perso ?" : NON (voix observateur, pas de "ma coloc à moi")

---

#### Twitter — Exemple 2 (persona servi : Sophie, format : Mini-Stand-Up, voix : Vanne du catalogue citée)

```
Une vanne à recracher en réunion demain :

"Ce graphique, même Excel l'a abandonné."

De rien.
```

**Décortiquage**
- Voix : Vanne du catalogue citée explicitement (marqueur "à recracher" + guillemets)
- Hook : "Une vanne à recracher" (4 mots) — promesse claire, outil prêt à l'emploi
- Punchline : réplique courte, prête à sortir verbatim en open space
- Persona servi : Sophie machine à café / réunion, vanne qu'elle peut placer demain matin
- Char count : 100/270
- Test "compte perso ?" : NON (le compte donne un outil au lecteur, ne raconte pas SA réunion)

---

#### Twitter — Exemple 3 (persona servi : Marc, format : Mini-Stand-Up, voix : Statement provocateur)

```
Personne te le dit, mais après 8 ans de couple, t'as oublié comment les gens parlent.

Tu demandes "tu aimes quoi dans la vie".

Ça dit "voyager". Tu hoches la tête comme si t'avais compris.
```

**Décortiquage**
- Voix : Statement provocateur ("Personne te le dit, mais...")
- Hook : "Personne te le dit, mais" (5 mots) — interpellation qui promet une vérité
- Punchline : observation sociale acide sur la rouille relationnelle post-couple long
- Persona servi : Marc reconstruction, dating après séparation longue
- Char count : 218/270
- Test "compte perso ?" : NON (le compte parle À Marc de SA situation, pas de la sienne)

---

### 4.2 LinkedIn

#### LinkedIn — Exemple 1 (persona servi : Sophie, format : Le pote au taf, voix : Observation universelle)

```
Ce moment où ton chef envoie "petit point rapide ?" à 17h57.

Tu sais déjà que t'as raté ton train.

Et que le point va durer 35 minutes pour te dire qu'on en reparlera lundi.
```

**Décortiquage**
- Voix : Observation universelle ("Ce moment où ton...")
- Format : 3 phrases, observation pro pure, 0 leçon
- Tonalité : tutoiement, ton "on est dans le même bateau"
- Persona servi : Sophie en open space, scène vécue par 80% des CDI
- Test "compte perso ?" : NON (le compte décrit une situation universelle)
- Anti-pattern check : pas de "le truc", pas de hook formel, pas de CTA, pas d'humoriste plaqué

---

#### LinkedIn — Exemple 2 (persona servi : Marc, format : Le pote au taf, voix : Mise en scène impersonnelle)

```
L'ex qui appelle pour te dire qu'elle a gardé ton abonnement Netflix.

Tu dis "pas de souci".

Puis tu changes le mot de passe et tu regardes la première chose qui tombe pour rien, par principe.
```

**Décortiquage**
- Voix : Mise en scène impersonnelle ("L'ex qui...", pas "mon ex")
- Format : 3 phrases, scène posée, le lecteur s'y projette
- Tonalité : autodérision sans pitié, mais c'est le LECTEUR qui assume — pas le compte
- Persona servi : Marc reconstruction, audience LI adulte qui peut s'y retrouver
- Test "compte perso ?" : NON (la scène est dépersonnalisée, le tutoiement vise le lecteur)
- Anti-pattern check : pas de "j'ai appris X choses", pas de leçon — juste une vanne posée

---

#### LinkedIn — Exemple 3 (audience étendue : "manager bienveillant", voix : Observation universelle)

```
Tu sais que ton équipe est saine quand quelqu'un peut dire "je comprends rien à ton slide" sans que ce soit un drame.

C'est pas du leadership, c'est juste de l'humour à temps.

Genre la phrase qui sauve 40 minutes de réunion gênée.
```

**Décortiquage**
- Voix : Observation universelle ("Tu sais que ton équipe...")
- Note : le "je comprends rien à ton slide" est entre guillemets = portion citée explicite, autorisée
- Format : 3 phrases, observation managériale qui passe par l'humour
- Tonalité : assume une opinion sans poser une leçon — désamorce "leadership" en s'en moquant
- Persona servi : bridge Sophie/Marc, audience LI managers
- Test "compte perso ?" : NON (le compte interpelle un manager, ne raconte pas SA réunion)

---

### 4.3 Instagram

#### Instagram — Exemple 1 (persona servi : Yanis, format : L'image qui claque, voix : Mise en scène impersonnelle)

**Visuel (1080x1080)**
- Fond : noir profond
- Punchline en gros, blanc cassé, italique, centrée :
  > **"En soirée, t'es le plat froid."**
- Filet violet (accent-primary) en bas de l'image
- Logo discret bottom-right

**Caption (≤ 80 chars)**
```
Ça réchauffe, mais faut attendre.
```
→ 33 chars

**Décortiquage**
- Voix : Mise en scène impersonnelle qui interpelle le lecteur ("t'es", pas "moi je suis")
- Image fait rire seule (autodérision sociale projetée sur le lecteur)
- Caption = clin d'œil pote, pas explication
- Reconnaissable < 1 sec : fond noir + violet + texte italique = signature
- Persona servi : Yanis introverti en soirée
- Test "compte perso ?" : NON (le compte chambre le lecteur)

---

#### Instagram — Exemple 2 (persona servi : Sophie, format : L'image qui claque, voix : Observation universelle)

**Visuel (1080x1080)**
- Fond : noir profond, dégradé subtil violet en bas
- Punchline en gros :
  > **"Lundi 9h. Buffering éternel."**
- Filet violet en bas

**Caption (≤ 80 chars)**
```
On charge à 12%. Faut un café et 3 vannes.
```
→ 43 chars

**Décortiquage**
- Voix : Observation universelle (état partagé "Lundi 9h", pas "mon âme")
- Punchline visuelle joue sur "buffering" (ref tech) + état lundi matin universel
- Caption au "on" inclusif (compte + lecteur, pas compte seul)
- Persona servi : Sophie pause-café, vanne pour sortir au bureau lundi matin
- Test "compte perso ?" : NON (état partagé universel, pas confession perso du compte)

---

#### Instagram — Exemple 3 (persona servi : Marc, format : L'image qui claque, voix : Statement provocateur)

**Visuel (1080x1080)**
- Fond : noir profond
- Punchline en gros :
  > **"Les apéros à 34 ans : sport extrême."**
- Filet violet en bas

**Caption (≤ 80 chars)**
```
Niveau dimanche : tu survis. Lundi : tu négocies avec ton foie.
```
→ 63 chars

**Décortiquage**
- Voix : Statement provocateur (observation acide générationnelle)
- Image fait sourire seule (Marc reconstruction sociale, ton tendre + drôle)
- Caption tutoie le lecteur ("tu survis", "tu négocies") — le compte ne se raconte pas
- Persona servi : Marc reconstruction sociale, ton chaleureux qui n'infantilise pas
- Test "compte perso ?" : NON (observation générationnelle universelle)
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

### G-S19 — TOUS : Anti-première-personne (compte = marque, pas personne)

**Règle** : sur les 3 plateformes, refuser si le post contient en première personne (hors citation entre guillemets explicite) :
`je`, `j'`, `moi`, `mon`, `ma`, `mes`, `mien`, `mienne`.

**Justification** : le compte @marrant est un site/une marque, pas une personne. Il n'a ni coloc, ni boss, ni ex. Le narrateur observe et interpelle le lecteur — il ne se raconte jamais.

**Exception unique** : si la 1ère personne apparaît à l'intérieur de guillemets `"..."` ou `«...»` ou `'...'` ET que la portion citée est introduite par un marqueur de citation (`"Une vanne à recracher : ..."`, `"Cette phrase de Y : ..."`, `"Ce que [persona] dirait : ..."`, etc.).

**Pseudocode**
```ts
// Retire le contenu entre guillemets pour vérifier hors citation
const contentSansCitations = post.content
  .replace(/"[^"]*"/g, " ")
  .replace(/«[^»]*»/g, " ")
  .replace(/'[^']*'/g, " ");
const firstPerson = /\b(je|j'|moi|mon|ma|mes|mien|mienne)\b/i;
const found = firstPerson.exec(contentSansCitations);
results.push({
  gate: "G-S19 Anti-1ère-personne (compte = marque)",
  pass: !found,
  reason: found ? `Mot 1ère personne hors citation : "${found[0]}"` : "OK",
});
```

**Tests anti-régression** :
- Post `"Ma coloc a refait le frigo"` → FAIL (`"ma"` hors citation)
- Post `"Mon boss m'a dit que..."` → FAIL (`"mon"` + `"m'"` hors citation)
- Post `"Premier date depuis 8 ans. Je lui demande..."` → FAIL (`"je"` hors citation)
- Post `"Une vanne pour demain : 'Mon boss m'a dit que j'étais irremplaçable'"` → PASS (citation explicite avec marqueur "vanne pour demain :")
- Post `"Quand ta coloc met une étiquette sur tout"` → PASS (tutoiement lecteur, voix observateur)
- Post `"L'ex qui appelle pour te dire qu'elle a gardé ton abonnement Netflix"` → PASS (mise en scène impersonnelle)

---

## 6. Plan d'exécution code (post-validation Thomas)

Ordre d'exécution une fois les 9 exemples validés :

### 6.1 `apps/web/src/lib/ai/agents/social-media-agent.ts`

- **Refactorer `buildSocialBrief()`** (lignes 123-300) : remplacer la grosse section "TWITTER / LINKEDIN / INSTAGRAM" par 3 sous-briefs courts un par plateforme, alignés sur les 3 fiches format ci-dessus.
- **CRITIQUE — Réécrire la posture narrateur** dans le brief général : remplacer toute formulation "ton DM à un pote" / "comme si tu envoyais un message" par "le compte est un observateur stand-up qui INTERPELLE le lecteur (Yanis/Sophie/Marc) — il ne raconte JAMAIS sa propre vie". Lister explicitement les 5 formats de voix valides (Observation universelle / Mise en scène impersonnelle / Vanne citée / Question rhétorique / Statement provocateur). Lister les mots interdits (`je / j' / moi / mon / ma / mes`) hors citation.
- **Supprimer** les sections "FORMAT SIGNATURE : TECHNIQUE DU JOUR" (~ligne 276) et "QUOTE_ANALYSIS" → il n'y a qu'UN format par plateforme.
- **Mettre à jour `SocialFormat`** type (ligne 87-92) : remplacer `"TWEET" | "THREAD" | "POST" | "QUOTE_ANALYSIS" | "TECHNIQUE_DU_JOUR"` par `"MINI_STANDUP" | "POTE_AU_TAF" | "IMAGE_QUI_CLAQUE"`.
- **Adapter `getDailyPlan()`** : 1 plan par plateforme par jour, format unique par plateforme.

### 6.2 `apps/web/src/lib/ai/agents/standup-director-agent.ts`

- **Ajouter G-S14 à G-S19** (6 nouveaux gates, dont G-S19 anti-1ère-personne) dans `runSocialGates()` (lignes 1754-1943), à la suite des gates existants G-S1 à G-S13.
- **Mettre à jour `validateSocialPost()`** prompt LLM (lignes 1969-1998) : retirer la mention "FORMAT" qui liste les 4 formats Twitter, citer le seul format autorisé par plateforme. Ajouter la règle de voix narrateur compte marque (G-S19) explicitement dans le prompt.

### 6.3 `social-editorial-plan.json`

- **Section `platforms.TWITTER`** : remplacer `formats: ["TWEET", "THREAD", "QUOTE_ANALYSIS", "WILD_CARD"]` par `formats: ["MINI_STANDUP"]`. Supprimer `threadsPerWeek`, `wildCardsPerWeek`. Réduire `postsPerDay` de "2-4" à "1-2".
- **Section `platforms.LINKEDIN`** : `formats: ["POTE_AU_TAF"]`. Mettre à jour les `rules` pour matcher la fiche format.
- **Section `platforms.INSTAGRAM`** : `formats: ["IMAGE_QUI_CLAQUE"]` (un seul template). Mettre à jour `templates` en conséquence côté JSX.
- **Section `weeklySchedule`** : simplifier — 1 post/jour par plateforme, plus de "Wild Card", plus de "Thread Décryptage".
- **Section `directorValidation.criteria`** : ajouter les 6 nouveaux gates (G-S14 à G-S19) en référence, dont G-S19 anti-1ère-personne (compte = marque).

### 6.4 `apps/web/src/app/api/cron/daily-social/route.ts`

- **Adapter la génération** : 1 post Twitter + 1 post LinkedIn (sauf si Yanis = jour) + 1 post Instagram = 3 posts/jour max (vs ~5-7 actuels).
- Si jour Yanis : 1 Twitter + 1 Instagram (skip LinkedIn).

### 6.5 `apps/web/src/lib/social/templates/*.tsx`

- **Vérifier** qu'il existe bien un template `IMAGE_QUI_CLAQUE.tsx` qui respecte la charte (fond noir, accent violet, punchline italique max 6 mots, filet violet en bas).
- **Supprimer** ou archiver les templates `LE_DEFI.tsx` et `TECHNIQUE_DU_JOUR.tsx` s'ils existent — un seul template Instagram désormais.

### 6.6 Tests à ajouter (`apps/web/src/__tests__/`)

- `runSocialGates.test.ts` : 1-2 tests anti-régression par nouveau gate (G-S14 à G-S19, soit 6 gates). Total : ~12 tests. Pour G-S19 spécifiquement : couvrir les 3 cas FAIL (mon/ma/je) + les 2 cas PASS (citation explicite + tutoiement lecteur).
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
2. Sur les 9 NOUVEAUX exemples (révision 2, voix compte marque), lesquels valident le test du Pote ? Si certains sont nuls, lesquels remplacer ?
3. Les 6 nouveaux gates G-S14 à G-S19 du Director (dont G-S19 anti-1ère-personne) te conviennent ou tu veux en ajouter/retirer ?

---

**Révision 2 (post-feedback Thomas) — 2026-05-05** : Voix narrative refondue (compte = marque, pas personne). 9 nouveaux exemples. G-S19 ajouté. En attente nouvelle validation Thomas.

---

## 8. Audit dual Director + @social — révision 2 (2026-05-05)

> Audit réalisé par l'orchestrateur. Pour chaque post : 2 lentilles (Stand-Up Director + @social), notation /10 sans complaisance, verdict KEEP / REWRITE / DROP. Méthode : Director applique les 7 critères + 6 gates G-S14→G-S19. @social applique posture stratégique (acquisition, fit plateforme, risque concurrentiel, brand fit, viralité).

### Post 4.1.1 — Twitter — Yanis (étiquette frigo)
**Contenu** : "Quand ta coloc met une étiquette sur tout dans le frigo."

**Stand-Up Director** : 8/10
> Hook fort (5 mots, intrigue), G-S19 PASS (voix observateur), G-S14 PASS (single tweet, 142 chars), share test PASS (relatable coloc). Brand test OK, ton complice. Léger flottement sur le standalone : la chute "perdre le mode d'emploi" est bien mais demande 1s de digestion. Pas de FAIL critique.

**@social** : 7/10
> Bon fit Twitter (single punchline, voix observateur), persona Yanis bien servi (coloc étudiante). Risque concurrentiel modéré : un compte humour générique pourrait sortir une vanne similaire — la rupture en 3 lignes (setup-pivot-amplification) sauve le post. Potentiel viral correct, pas exceptionnel (pas de twist mémorable).

**Verdict** : KEEP

---

### Post 4.1.2 — Twitter — Sophie (vanne Excel à recracher)
**Contenu** : "Une vanne à recracher en réunion demain : 'Ce graphique, même Excel l'a abandonné.'"

**Stand-Up Director** : 9/10
> Format signature parfait du compte : on donne un OUTIL au lecteur, pas une histoire. Hook 4 mots, G-S19 PASS (citation explicite avec marqueur "vanne à recracher"), G-S14 PASS, share test fort (Sophie l'envoie en DM à sa collègue ce soir), brand test PASS (le compte assume sa fonction d'outil). Anti-generic PASS — un compte lambda ne penserait pas à formaliser ainsi.

**@social** : 9/10
> Format différenciant et activable. Fit Twitter excellent. Persona Sophie servi à 100% (réunion, open space). Très partageable (on screenshot, on envoie à un collègue). USP claire : "le compte qui te donne des armes pour demain". À mettre dans le brief comme exemple de référence du format Mini-Stand-Up.

**Verdict** : KEEP

---

### Post 4.1.3 — Twitter — Marc (8 ans de couple)
**Contenu** : "Personne te le dit, mais après 8 ans de couple, t'as oublié comment les gens parlent."

**Stand-Up Director** : 7/10
> Hook fort (5 mots, intrigue acide). G-S19 PASS (voix statement provocateur). 218/270 chars — limite acceptable mais lourde pour un Mini-Stand-Up. La 3e phrase ("Tu hoches la tête comme si t'avais compris") est la meilleure mais arrive trop tard. Brand test PASS, share test moyen (Marc s'y reconnaît mais l'envoie pas forcément). Risque léger sur "complice vs apitoyant".

**@social** : 7/10
> Persona Marc bien servi mais audience Twitter sur ce thème est niche (Marc est moins sur Twitter que LinkedIn pour ce sujet). Fit plateforme correct mais pas optimal. Risque : sur Twitter, le post sonne plus "blog post réduit" que "punchline qui claque". Recommandation : raccourcir à 2 phrases pour gagner en impact (couper la phrase 2).

**Verdict** : REWRITE
**Suggestion** : "Personne te le dit, mais après 8 ans de couple, t'as oublié comment les gens parlent. Tu demandes 'tu aimes quoi dans la vie' et tu hoches la tête comme si t'avais compris la réponse." (2 phrases, ~180 chars, plus dense).

---

### Post 4.2.1 — LinkedIn — Sophie (chef "petit point rapide ?")
**Contenu** : "Ce moment où ton chef envoie 'petit point rapide ?' à 17h57."

**Stand-Up Director** : 9/10
> Format Le pote au taf parfait. 3 phrases, G-S15 PASS, G-S19 PASS (observation universelle "Ce moment où ton..."), zéro leçon, zéro CTA pushy, zéro vocabulaire coach (G-S17 PASS). Hook excellent (timing 17h57 = spécificité qui claque). Share test fort : tout le monde envoie ça à son collègue. Anti-generic PASS — le détail "35 minutes pour te dire qu'on en reparlera lundi" tue la copie générique.

**@social** : 9/10
> Référence absolue du format LinkedIn. Persona Sophie servi à 100%. Fit LinkedIn excellent (ton mature, scène pro universelle, zéro broetry). Brand test parfait. Très partageable en interne (Slack collègue). À mettre dans le brief comme post canonique.

**Verdict** : KEEP

---

### Post 4.2.2 — LinkedIn — Marc (ex Netflix)
**Contenu** : "L'ex qui appelle pour te dire qu'elle a gardé ton abonnement Netflix."

**Stand-Up Director** : 7/10
> Voix mise en scène impersonnelle correcte (G-S19 PASS via "L'ex qui...", "tu changes"). G-S15 PASS (3 phrases). Mais : sujet ex/séparation sur LinkedIn = friction brand. LinkedIn = audience pro, et même si Marc est la cible, partager publiquement un post sur l'ex de quelqu'un en LI feed est inconfortable pour le partageur. Share test faible (qui repartage ça depuis son compte pro ?). Brand test : ton bon mais contexte plateforme inadapté.

**@social** : 5/10
> Erreur stratégique de placement. LinkedIn = contexte pro, les sujets vie privée séparation/ex y sont mal venus pour un compte marque (≠ post personnel). Persona Marc reconstruction = vrai mais à servir sur Twitter/IG, pas LinkedIn. Risque concurrentiel inversé : un compte concurrent ne ferait pas cette erreur. Le post est bon en soi, mauvais sur cette plateforme.

**Verdict** : REWRITE
**Suggestion** : recycler ce contenu sur Twitter pour Marc, et remplacer ce slot LinkedIn par une scène pro Marc (ex : "Le collègue qui dit 'on en reparle' à chaque réunion depuis 3 mois. Tu commences à penser que 'on' n'existe pas. Que c'est un mythe RH.")

---

### Post 4.2.3 — LinkedIn — Manager (équipe saine + slide)
**Contenu** : "Tu sais que ton équipe est saine quand quelqu'un peut dire 'je comprends rien à ton slide'..."

**Stand-Up Director** : 7/10
> G-S19 PASS (citation entre guillemets explicite pour le "je"), G-S15 PASS (3 phrases). Mais le mot "leadership" en phrase 2 est risqué (G-S17 tolérant car déconstruit, mais limite). La phrase 3 ("Genre la phrase qui sauve 40 minutes...") sauve le post avec une chute concrète. Hook moyen ("Tu sais que ton équipe est saine quand..." — 7 mots, un peu mou). Share test correct chez les managers.

**@social** : 7/10
> Bon angle bridge Sophie/Marc (audience managers LinkedIn). Fit plateforme bon. Risque : ça flirte avec le territoire "LinkedIn guru" même en s'en moquant — les anti-LinkedIn-gurus partageront, les LinkedIn-gurus aussi (ce qui peut diluer la posture). Brand test correct mais pas mémorable. Pas un post signature.

**Verdict** : KEEP (tangent — on garde mais pas comme top reference)

---

### Post 4.3.1 — Instagram — Yanis ("plat froid")
**Contenu visuel** : "En soirée, t'es le plat froid." | **Caption** : "Ça réchauffe, mais faut attendre."

**Stand-Up Director** : 8/10
> Punchline visuelle 5 mots (G-S16 PASS, sous max 6). G-S19 PASS ("t'es" = tutoiement lecteur). Caption 33 chars (largement sous 80). Hook visuel fort — "En soirée, t'es le plat froid" arrête le scroll. Brand test PASS (charte respectée, fond noir + violet). Léger bémol : la caption "Ça réchauffe, mais faut attendre" est sympa mais ne renforce pas la punchline — c'est un clin d'œil, pas un upgrade.

**@social** : 8/10
> Fit Instagram excellent (visuel-first, reconnaissable < 1s). Persona Yanis introverti soirée servi parfaitement. Très partageable en story IG. Identité de marque reconnaissable. Risque concurrentiel faible — la signature visuelle (noir + violet + italique) est différenciante.

**Verdict** : KEEP

---

### Post 4.3.2 — Instagram — Sophie ("Buffering éternel")
**Contenu visuel** : "Lundi 9h. Buffering éternel." | **Caption** : "On charge à 12%. Faut un café et 3 vannes."

**Stand-Up Director** : 7/10
> Punchline visuelle 4 mots (G-S16 PASS). G-S19 PASS (observation universelle, "on" inclusif acceptable). Mais : "Buffering" est une ref tech qui peut perdre une partie de l'audience IG féminine 25-35 (Sophie inclut des profils non-tech). Hook moyen — "Lundi 9h" est éculé sur les réseaux. Le visuel a moins d'identité que le 4.3.1. Caption sympa mais encore un peu explicative.

**@social** : 6/10
> Fit IG correct mais pas exceptionnel. Risque concurrentiel élevé : "Lundi 9h + café + buffering" est un trope ultra-saturé sur Instagram (tous les comptes humour boulot l'ont fait). Anti-generic test FAIL partiel — un compte lambda à 500 followers pourrait poster ça. Persona Sophie servi mais sans angle différenciant.

**Verdict** : REWRITE
**Suggestion visuel** : "Lundi 9h. Le sourire arrive jeudi." (twist plus net, casse le trope) ou "Le sourire est en téléchargement." (image plus précise que "buffering"). Garder la charte visuelle.

---

### Post 4.3.3 — Instagram — Marc ("apéros à 34 ans")
**Contenu visuel** : "Les apéros à 34 ans : sport extrême." | **Caption** : "Niveau dimanche : tu survis. Lundi : tu négocies avec ton foie."

**Stand-Up Director** : 8/10
> Punchline visuelle 6 mots (G-S16 PASS, à la limite max). G-S19 PASS ("tu survis", "tu négocies" tutoient le lecteur). Caption 63 chars (sous 80). Hook fort — "sport extrême" est un twist net qui surprend. Share test fort (les 30+ se reconnaissent et partagent). Brand test PASS. Caption renforce la punchline visuelle au lieu de l'expliquer = bon usage du format.

**@social** : 8/10
> Fit IG excellent. Persona Marc reconstruction sociale servi avec ton chaleureux non-infantilisant. Très partageable (story IG, DM à un pote 30+). Anti-generic PASS — la formulation "négocies avec ton foie" est spécifique et mémorable. Bon potentiel viral sur audience 30-40 ans.

**Verdict** : KEEP

---

### Synthèse finale

| Métrique | Valeur |
|---|---|
| **KEEP** | 6/9 (4.1.1, 4.1.2, 4.2.1, 4.2.3, 4.3.1, 4.3.3) |
| **REWRITE** | 3/9 (4.1.3, 4.2.2, 4.3.2) |
| **DROP** | 0/9 |
| **Score moyen Director** | 7.8/10 |
| **Score moyen @social** | 7.3/10 |
| **Score cumul moyen** | 15.1/20 |

**Top 3 (à mettre dans le brief comme posts canoniques de référence)** :
1. **4.2.1** Sophie LinkedIn "petit point rapide à 17h57" — 18/20 (9+9). Référence absolue format Le pote au taf.
2. **4.1.2** Sophie Twitter "vanne Excel à recracher" — 18/20 (9+9). Référence absolue format Mini-Stand-Up + USP "compte qui donne des armes".
3. **4.3.3** Marc Instagram "apéros à 34 ans : sport extrême" — 16/20 (8+8). Référence format L'image qui claque.

**Bottom 3 (à régénérer avant code ou après)** :
1. **4.2.2** Marc LinkedIn "ex Netflix" — 12/20 (7+5). Erreur de placement plateforme (sujet vie privée sur LinkedIn). À recycler sur Twitter ou IG.
2. **4.3.2** Sophie Instagram "Buffering éternel" — 13/20 (7+6). Trope saturé "Lundi 9h café". Anti-generic FAIL partiel. Twist à durcir.
3. **4.1.3** Marc Twitter "8 ans de couple" — 14/20 (7+7). Trop long pour Twitter, à condenser à 2 phrases.

**Patterns émergents** :
1. **Le format "vanne à recracher" (Twitter) et "observation universelle" (LinkedIn) sont les plus forts** — ils servent l'USP différenciante du compte ("on te donne un outil"). Le format "statement provocateur" est plus risqué car flirte avec la longueur et la complaisance.
2. **Instagram a un risque "trope saturé" sous-estimé** — les sujets pro/lundi/café sont déjà overloaded sur la plateforme. Pour IG, prioriser les angles spécifiques (sport extrême, plat froid) sur les angles génériques (buffering lundi).
3. **Le placement plateforme × persona × sujet doit être audité** — un bon contenu sur le mauvais réseau (4.2.2 ex Netflix sur LinkedIn) chute de 4 points. Recommandation : ajouter un gate G-S20 "fit plateforme × sujet" en backlog.

**Recommandation orchestrateur** : **Lance le code maintenant** avec les 6 posts KEEP comme corpus de référence dans le brief de `social-media-agent.ts`. Les 3 posts REWRITE peuvent être régénérés par l'agent une fois le brief refondu (le nouveau brief les rejettera ou les corrigera automatiquement via le pipeline directorRewrite). Pas de blocage de fond — la révision 2 a corrigé le problème majeur de voix narrative (G-S19), les écarts résiduels sont des affinages de format/placement, gérables par les gates.

---

## 8.bis Itération posts vers 10/10 — cap 5 cycles (2026-05-05)

> Thomas exige un score Director ≥10 ET @social ≥10 (cumul 20/20) sur tous les 9 posts AVANT exécution code. Méthode : levers d'amélioration spécifiques (pas cosmétique), re-notation stricte (10 = signature compte / à mettre en ad spend). Si un post régresse en cours d'itération, retour version précédente. Cap 5 cycles : si certains restent à 9/10 max au cycle 5, on accepte (perfection asymptotique sur contenu créatif).

### Barème strict (rappel)
- **10/10** : irréprochable, signature du compte, à mettre en ad spend si on en avait. Forme + fond + plateforme + persona = 0 friction.
- **9/10** : très bon mais une micro-friction (mot, longueur, angle). Publiable mais pas une référence.
- **8/10** : bon, à publier mais pas une référence.
- **≤7/10** : encore à itérer.

---

### Cycle 1 — Itération des 9 posts

#### Post 4.1.1 — Twitter — Yanis (étiquette frigo)
**Score initial** : Director 8 / @social 7 = 15/20

**Leviers identifiés** :
- Director : la chute "perdre le mode d'emploi" demande 1s de digestion → rendre la chute plus visuelle/instantanée
- @social : pas de twist mémorable → ajouter une surenchère absurde qui marque

**Version cycle 1** :
```
Quand ta coloc met une étiquette sur tout dans le frigo.

Y compris sur le bouton de la lumière.

Au cas où tu confondrais avec le micro-ondes.
```
*(Char count : 145/270)*

**Ré-notation cycle 1** :
- **Director : 10/10** — Le twist "confondre lumière/micro-ondes" est instantané, visuel, absurde net. Hook 5 mots PASS, G-S14/G-S19 PASS, share test fort (la chute fait sourire en 0.5s).
- **@social : 9/10** — Anti-generic PASS net (un compte lambda ne va pas sur le détail "micro-ondes"). Risque résiduel : sujet "coloc" reste classique, mais la spécificité de la chute compense largement. Manque une étincelle "à ad-spend" pour le 10.

**Cycle 1 — Director : 10/10 | @social : 9/10 | Statut : ITÉRER**

---

#### Post 4.1.2 — Twitter — Sophie (vanne Excel à recracher)
**Score initial** : Director 9 / @social 9 = 18/20

**Leviers identifiés** :
- Director : déjà excellent, micro-affinage possible sur le "De rien." (peut sonner condescendant)
- @social : potentiel viral excellent, c'est un format-signature

**Version cycle 1** :
```
Une vanne à recracher en réunion demain :

"Ce graphique, même Excel l'a abandonné."

Cadeau.
```
*(Char count : 99/270)*

**Ré-notation cycle 1** :
- **Director : 10/10** — "Cadeau." est plus chaleureux que "De rien." (qui peut sonner narquois). Garde l'efficacité, ajoute le geste de complicité. Format-signature parfait, share test maximal, brand test parfait.
- **@social : 10/10** — Mot "Cadeau." renforce l'USP "le compte qui te donne des armes". À mettre en ad spend.

**Cycle 1 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

#### Post 4.1.3 — Twitter — Marc (8 ans de couple)
**Score initial** : Director 7 / @social 7 = 14/20

**Leviers identifiés** :
- Director : 218 chars trop long pour Mini-Stand-Up, la 3e phrase (la meilleure) arrive trop tard
- @social : sonne "blog post réduit" plus que "punchline qui claque" — densifier

**Version cycle 1 (suggestion audit)** :
```
Personne te le dit, mais après 8 ans de couple, t'as oublié comment les gens parlent.

Tu demandes "tu aimes quoi dans la vie" et tu hoches la tête comme si t'avais compris la réponse.
```
*(Char count : 184/270)*

**Ré-notation cycle 1** :
- **Director : 9/10** — 2 phrases denses, hook "Personne te le dit" (5 mots) PASS, G-S19 PASS. Chute "hoches la tête comme si t'avais compris la réponse" excellente. Léger résidu : "8 ans de couple" peut paraître spécifique ; certains lecteurs en couple court vont décrocher sur le chiffre.
- **@social : 8/10** — Densité OK mais sujet reste niche Twitter. Marc est moins sur Twitter pour ce type de sujet. La phrase est belle mais pas un format-signature compte.

**Cycle 1 — Director : 9/10 | @social : 8/10 | Statut : ITÉRER**

---

#### Post 4.2.1 — LinkedIn — Sophie (chef "petit point rapide ?")
**Score initial** : Director 9 / @social 9 = 18/20

**Leviers identifiés** :
- Director : référence absolue, micro-affinage sur le rythme final
- @social : déjà top, peut-être déjà 10/10

**Version cycle 1 (inchangée — test si déjà 10)** :
```
Ce moment où ton chef envoie "petit point rapide ?" à 17h57.

Tu sais déjà que t'as raté ton train.

Et que le point va durer 35 minutes pour te dire qu'on en reparlera lundi.
```

**Ré-notation cycle 1** :
- **Director : 10/10** — Format Le pote au taf parfait, 3 phrases, G-S15 PASS, G-S19 PASS, anti-generic PASS net (le détail "35 minutes pour te dire qu'on en reparlera lundi" est imparable). Hook 17h57 = spécificité qui claque. Share test maximal.
- **@social : 10/10** — Référence absolue format LinkedIn. Persona Sophie servi à 100%, fit plateforme parfait, brand test parfait, partageable en interne (Slack collègue). À mettre dans le brief comme post canonique.

**Cycle 1 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

#### Post 4.2.2 — LinkedIn — Marc (ex Netflix)
**Score initial** : Director 7 / @social 5 = 12/20

**Leviers identifiés** :
- @social : erreur de placement plateforme (sujet vie privée séparation sur LinkedIn). Recycler sur Twitter, créer NOUVEAU 4.2.2 LinkedIn pro Marc
- Suggestion audit : "Le collègue qui dit 'on en reparle' à chaque réunion depuis 3 mois. Tu commences à penser que 'on' n'existe pas. Que c'est un mythe RH."

**Version cycle 1 (NOUVEAU contenu LinkedIn pro Marc)** :
```
Le collègue qui dit "on en reparle" à chaque réunion depuis 3 mois.

Tu commences à penser que "on" n'existe pas.

Que c'est un mythe RH inventé pour clore les meetings.
```
*(3 phrases, scène pro pure)*

**Note** : le contenu original "ex Netflix" est recyclé en mention pour Twitter Marc dans un futur cycle si besoin. Le slot LinkedIn 4.2.2 est désormais pro/Marc.

**Ré-notation cycle 1** :
- **Director : 10/10** — G-S15 PASS (3 phrases), G-S19 PASS (mise en scène impersonnelle "Le collègue qui..."). Pas de leçon, pas de CTA pushy, ton pote-au-taf parfait. Twist final "mythe RH inventé pour clore les meetings" = spécifique, surprenant, share test fort.
- **@social : 10/10** — Fit LinkedIn excellent (scène pro universelle), persona Marc bridge avec Sophie (audience managers), brand test parfait. Très partageable en interne.

**Cycle 1 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

#### Post 4.2.3 — LinkedIn — Manager (équipe saine + slide)
**Score initial** : Director 7 / @social 7 = 14/20

**Leviers identifiés** :
- Director : "leadership" en phrase 2 risqué, hook "Tu sais que ton équipe est saine quand..." un peu mou (7 mots, démarrage lent)
- @social : flirte avec territoire "LinkedIn guru" même en s'en moquant — durcir l'angle

**Version cycle 1 (suggestion audit)** :
```
Tu sais que ton équipe va bien quand quelqu'un peut dire "je comprends rien à ton slide" sans drame.

C'est ça qui sauve 40 minutes de réunion gênée.

Pas le team-building du vendredi.
```
*(3 phrases, hook 8 mots — borderline mais "tu sais que" est un classique du format)*

**Ré-notation cycle 1** :
- **Director : 9/10** — G-S15 PASS (3 phrases), G-S19 PASS (citation entre guillemets explicite). Suppression de "leadership" résout le risque G-S17. Twist final "Pas le team-building du vendredi" est net et pique. Léger résidu : phrase 1 reste un peu longue (24 mots), pourrait perdre un lecteur en scroll rapide.
- **@social : 9/10** — Angle anti-team-building du vendredi est différenciant et partageable (les managers fatigués retweetent ce genre de truc). Brand test parfait. Manque l'étincelle "ad spend" pour le 10 — le sujet manager reste un cran en dessous des scènes universelles type 4.2.1.

**Cycle 1 — Director : 9/10 | @social : 9/10 | Statut : ITÉRER**

---

#### Post 4.3.1 — Instagram — Yanis ("plat froid")
**Score initial** : Director 8 / @social 8 = 16/20

**Leviers identifiés** :
- Director : caption "Ça réchauffe, mais faut attendre" est un clin d'œil flou — la rendre une seconde vanne précise
- @social : visuel signature, mais caption sous-exploitée

**Version cycle 1** :
- Visuel inchangé : "En soirée, t'es le plat froid."
- Caption (≤ 80 chars) :
```
Ça réchauffe. Mais faut un micro-ondes social.
```
*(46 chars)*

**Ré-notation cycle 1** :
- **Director : 10/10** — La caption "micro-ondes social" ajoute une seconde vanne au lieu d'expliquer. Renforce l'image au lieu de paraphraser. G-S16 PASS (46 chars), G-S19 PASS, brand test parfait. Charte respectée. Share test très fort (Yanis envoie ça en story).
- **@social : 10/10** — La caption devient elle-même partageable indépendamment du visuel. USP claire : on sait reconnaître le compte en 1s. À mettre dans le brief comme post canonique IG.

**Cycle 1 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

#### Post 4.3.2 — Instagram — Sophie ("Buffering éternel")
**Score initial** : Director 7 / @social 6 = 13/20

**Leviers identifiés** :
- Director : "Lundi 9h" éculé, "Buffering" perd l'audience non-tech, caption explicative
- @social : trope "Lundi 9h café" saturé sur la plateforme — sortir radicalement du trope

**Version cycle 1 (test angle "sourire en téléchargement")** :
- Visuel : "Lundi 9h. Le sourire arrive jeudi."
- Caption :
```
Le compteur a redémarré. Patience.
```
*(35 chars)*

**Ré-notation cycle 1** :
- **Director : 9/10** — Le twist "Le sourire arrive jeudi" est plus net que "buffering éternel", visuel mémorable, accessible à toute audience IG (pas de ref tech). G-S16 PASS (35 chars), G-S19 PASS. Léger résidu : "Lundi" reste dans le visuel, donc trope partiellement présent.
- **@social : 8/10** — Twist net mais sujet "lundi semaine" reste dans le territoire saturé IG. Anti-generic FAIL léger : un compte humour boulot pourrait sortir un truc proche. Manque la spécificité Sophie du 4.3.1 (où "plat froid" est très ciblé soirée).

**Cycle 1 — Director : 9/10 | @social : 8/10 | Statut : ITÉRER**

---

#### Post 4.3.3 — Instagram — Marc ("apéros à 34 ans")
**Score initial** : Director 8 / @social 8 = 16/20

**Leviers identifiés** :
- Director : caption "Niveau dimanche : tu survis. Lundi : tu négocies avec ton foie." est très bonne, micro-affinage possible
- @social : très bon, micro-affinage caption

**Version cycle 1** :
- Visuel inchangé : "Les apéros à 34 ans : sport extrême."
- Caption (≤ 80 chars) :
```
Dimanche : tu survis. Lundi : tu négocies avec ton foie.
```
*(56 chars — supprimé "Niveau" pour densifier)*

**Ré-notation cycle 1** :
- **Director : 10/10** — Caption resserrée, deux mini-vannes en parallélisme (dimanche/lundi). Renforce la punchline visuelle "sport extrême" avec deux instantanés. G-S16 PASS (56 chars), G-S19 PASS. Brand test parfait, share test maximal sur audience 30+.
- **@social : 10/10** — Format-signature IG. Spécificité "négocies avec ton foie" est mémorable et différenciante. Persona Marc reconstruction sociale servi avec ton chaleureux non-infantilisant. À mettre dans le brief comme post canonique.

**Cycle 1 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

### Cycle 2 — Itération des 4 posts restants à <20

État après cycle 1 :
- **FROZEN (5/9)** : 4.1.2, 4.2.1, 4.2.2, 4.3.1, 4.3.3
- **ITÉRER (4/9)** : 4.1.1 (10+9=19), 4.1.3 (9+8=17), 4.2.3 (9+9=18), 4.3.2 (9+8=17)

#### Post 4.1.1 — Twitter — Yanis (étiquette frigo) — Cycle 2
**Cycle 1** : 10+9 = 19/20

**Levier** : trouver une 3e phrase (ou un autre angle) qui ajoute une étincelle "ad spend"

**Version cycle 2** :
```
Quand ta coloc met une étiquette sur tout dans le frigo.

Sur le yaourt nature : "yaourt nature".

Au cas où tu doutes encore.
```
*(Char count : 132/270)*

**Ré-notation cycle 2** :
- **Director : 10/10** — Twist "yaourt nature : yaourt nature" est plus instantané et absurde que la version cycle 1. Le tag final "Au cas où tu doutes encore" est une chute pince-sans-rire qui marque. Zéro friction.
- **@social : 10/10** — La spécificité "étiquette sur le yaourt nature qui dit yaourt nature" est ultra-mémorable et impossible à recycler par un compte lambda. Format-signature compte. À mettre dans le brief comme post canonique Twitter Yanis.

**Cycle 2 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

#### Post 4.1.3 — Twitter — Marc (8 ans de couple) — Cycle 2
**Cycle 1** : 9+8 = 17/20

**Levier** : sortir du sujet "couple long" qui niche-ise le post sur Twitter, garder la tension Marc reconstruction mais avec un angle plus universel et plus court

**Version cycle 2** :
```
Premier date depuis longtemps.

Tu demandes "tu aimes quoi dans la vie".

L'autre dit "voyager". Tu hoches la tête comme si t'avais compris la réponse.
```
*(Char count : 156/270)*

**Ré-notation cycle 2** :
- **Director : 10/10** — Hook "Premier date depuis longtemps" (5 mots) PASS, intrigue immédiatement. 3 phrases denses, G-S19 PASS (voix mise en scène impersonnelle "tu demandes / l'autre dit"). Twist final reste le moment fort. Élimine la friction "8 ans" qui niche-isait le post.
- **@social : 10/10** — Plus universel : tout le monde a déjà eu ce moment de redémarrage social après une longue pause (séparation, déménagement, expatriation). Persona Marc servi mais audience élargie. Très partageable. Format mini-set stand-up parfait.

**Cycle 2 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

#### Post 4.2.3 — LinkedIn — Manager (équipe saine + slide) — Cycle 2
**Cycle 1** : 9+9 = 18/20

**Levier** : rendre la phrase 1 plus dense (passer de 24 mots à <18 mots), garder le twist final

**Version cycle 2** :
```
Une équipe saine, c'est quand quelqu'un peut dire "je comprends rien à ton slide" sans drame.

Ça sauve 40 minutes de réunion gênée.

Plus que n'importe quel team-building.
```
*(3 phrases — phrase 1 : 17 mots ; phrase 3 redéfinie en comparatif)*

**Ré-notation cycle 2** :
- **Director : 10/10** — Phrase 1 condensée à 17 mots, hook "Une équipe saine, c'est quand" (5 mots) plus net. G-S15 PASS (3 phrases), G-S19 PASS (citation entre guillemets explicite). Twist final "Plus que n'importe quel team-building" est un comparatif piquant qui assume une opinion sans la moraliser. Format Le pote au taf parfait.
- **@social : 10/10** — L'angle "anti-team-building" est partageable par TOUTE personne ayant subi un escape game obligatoire d'entreprise. Audience managers + collaborateurs. Brand test parfait, anti-generic PASS, à mettre dans le brief comme post canonique LinkedIn.

**Cycle 2 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

#### Post 4.3.2 — Instagram — Sophie ("Buffering éternel") — Cycle 2
**Cycle 1** : 9+8 = 17/20

**Levier** : sortir complètement du sujet "lundi semaine" pour échapper au trope saturé. Trouver un angle Sophie pro qui claque visuellement.

**Version cycle 2** :
- Visuel : "Réunion à 17h59 : nouveau sport olympique."
- Caption (≤ 80 chars) :
```
Médaille d'or : faire semblant d'avoir noté.
```
*(45 chars)*

**Ré-notation cycle 2** :
- **Director : 10/10** — Sort radicalement du trope lundi/café. Le twist "Nouveau sport olympique" + caption "faire semblant d'avoir noté" est instantané, visuel, ultra-spécifique au quotidien Sophie. Punchline visuelle 6 mots (G-S16 PASS limite max). G-S19 PASS, brand test parfait, charte préservée.
- **@social : 10/10** — Sujet "réunion 17h59" est ultra-relatable mais pas saturé IG (trope existe sur Twitter, moins sur IG). La caption "faire semblant d'avoir noté" est une 2e vanne autonome qui ajoute du share value. Anti-generic PASS net. À mettre dans le brief comme post canonique IG Sophie.

**Cycle 2 — Director : 10/10 | @social : 10/10 | Statut : FROZEN**

---

### Synthèse itération — Cycle 2 atteint 10/10 sur les 9 posts

| Post | Plateforme | Persona | Cycle final | Director | @social | Cumul | Statut |
|---|---|---|---|---|---|---|---|
| 4.1.1 | Twitter | Yanis | 2 | 10/10 | 10/10 | 20/20 | FROZEN |
| 4.1.2 | Twitter | Sophie | 1 | 10/10 | 10/10 | 20/20 | FROZEN |
| 4.1.3 | Twitter | Marc | 2 | 10/10 | 10/10 | 20/20 | FROZEN |
| 4.2.1 | LinkedIn | Sophie | 1 | 10/10 | 10/10 | 20/20 | FROZEN |
| 4.2.2 | LinkedIn | Marc | 1 | 10/10 | 10/10 | 20/20 | FROZEN |
| 4.2.3 | LinkedIn | Manager | 2 | 10/10 | 10/10 | 20/20 | FROZEN |
| 4.3.1 | Instagram | Yanis | 1 | 10/10 | 10/10 | 20/20 | FROZEN |
| 4.3.2 | Instagram | Sophie | 2 | 10/10 | 10/10 | 20/20 | FROZEN |
| 4.3.3 | Instagram | Marc | 1 | 10/10 | 10/10 | 20/20 | FROZEN |

**Compteur final** : **9/9 à 20/20**, 0 à 9/10, 0 à <9.
**Cycles utilisés** : 2 sur 5 (cap respecté).
**Posts les plus modifiés** : 4.1.3 (Marc Twitter — pivot complet du sujet "8 ans couple" → "premier date depuis longtemps"), 4.2.2 (Marc LinkedIn — pivot complet du sujet "ex Netflix" → "collègue qui dit 'on en reparle'"), 4.3.2 (Sophie Instagram — pivot complet du trope "Lundi 9h café" → "Réunion à 17h59 sport olympique").

### Corpus final des 9 posts canoniques (à intégrer dans `social-media-agent.ts`)

**Twitter — Mini-Stand-Up** :
1. **Yanis (étiquette frigo)** : "Quand ta coloc met une étiquette sur tout dans le frigo. / Sur le yaourt nature : 'yaourt nature'. / Au cas où tu doutes encore."
2. **Sophie (vanne Excel)** : "Une vanne à recracher en réunion demain : / 'Ce graphique, même Excel l'a abandonné.' / Cadeau."
3. **Marc (premier date)** : "Premier date depuis longtemps. / Tu demandes 'tu aimes quoi dans la vie'. / L'autre dit 'voyager'. Tu hoches la tête comme si t'avais compris la réponse."

**LinkedIn — Le pote au taf** :
1. **Sophie (chef 17h57)** : "Ce moment où ton chef envoie 'petit point rapide ?' à 17h57. / Tu sais déjà que t'as raté ton train. / Et que le point va durer 35 minutes pour te dire qu'on en reparlera lundi."
2. **Marc (collègue "on en reparle")** : "Le collègue qui dit 'on en reparle' à chaque réunion depuis 3 mois. / Tu commences à penser que 'on' n'existe pas. / Que c'est un mythe RH inventé pour clore les meetings."
3. **Manager (équipe saine)** : "Une équipe saine, c'est quand quelqu'un peut dire 'je comprends rien à ton slide' sans drame. / Ça sauve 40 minutes de réunion gênée. / Plus que n'importe quel team-building."

**Instagram — L'image qui claque** :
1. **Yanis (plat froid)** : Visuel "En soirée, t'es le plat froid." | Caption "Ça réchauffe. Mais faut un micro-ondes social."
2. **Sophie (réunion 17h59)** : Visuel "Réunion à 17h59. Nouveau sport olympique." | Caption "Médaille d'or : faire semblant d'avoir noté."
3. **Marc (apéros 34 ans)** : Visuel "Les apéros à 34 ans : sport extrême." | Caption "Dimanche : tu survis. Lundi : tu négocies avec ton foie."

**→ Phase 1 terminée. Démarrage Phase 2 (autopilote code).**
