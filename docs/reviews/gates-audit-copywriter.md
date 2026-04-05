# Audit copywriting — Gates programmatiques du Stand-Up Director

**Agent** : @copywriter
**Date** : 2026-04-05
**Fichier audité** : `apps/web/src/lib/ai/agents/standup-director-agent.ts`
**Fonctions analysées** : `runJokeGates`, `runTipGates`, `runBlogGates`, `runSocialGates`
**Périmètre** : évaluation sous l'angle brand voice, qualité rédactionnelle, red flags IA manquants, faux positifs

---

## Note globale : 6,5 / 10

### Justification

Les gates font un bon travail sur les deux missions faciles : bloquer les fuites de personas internes et filtrer les formats sémantiquement morts (Carambar, objets qui parlent, engagement bait). Sur ces points, le dispositif est solide et bien pensé.

Mais l'objectif déclaré du site est d'être le numéro 1 du stand-up français — et les gates programmatiques n'y contribuent presque pas. Elles filtrent le pathologique, pas le médiocre. Un contenu parfaitement propre techniquement, mais froid, générique, et sonant IA à plein nez peut passer toutes les gates sans frapper un seul FAIL.

Trois lacunes structurelles expliquent cette note :

1. Les red flags IA sont quasi absents des gates vannes et conseils (uniquement présents en social, et de façon incomplète).
2. Il n'y a aucune gate qui protège le tutoiement, pourtant non-négociable dans le brand voice.
3. G-S7 (max 2 emojis) est trop restrictive pour le contexte social media et va bloquer du bon contenu humain.

---

## Analyse détaillée par famille de gates

---

### 1. Vannes — `runJokeGates` (G-J1 à G-J7)

**Ce qui fonctionne**

G-J3 (objets qui parlent), G-J4 (persona leak) et G-J7 (format Carambar) sont les trois gates les plus utiles. Elles bloquent des patterns connus qui traversent la barre de qualité depuis longtemps. G-J6 (punchline ≠ constat) est une bonne heuristique même si l'implémentation par regex est fragile (voir faux positifs).

**Ce qui manque**

Il n'existe aucune gate programmatique pour détecter le ton robotique ou corporate dans une vanne. Or les LLM ont des tics d'écriture caractéristiques même sur du contenu court. Exemples concrets de vannes qui passeraient toutes les gates actuelles sans problème :

- "J'ai essayé d'améliorer ma communication interpersonnelle en soirée. Mes interactions sociales se sont révélées sous-optimales." → Aucun gate ne bloque ça. Pourtant c'est du ChatGPT brut.
- "Ma vie professionnelle et personnelle présentent des similitudes notables avec un algorithme non optimisé." → Passe G-J1 à G-J7 sans friction.
- "Le développement de compétences sociales nécessite une approche méthodique et structurée." → Idem.

Ces vannes sont froides, abstraites, et n'ont aucune chance de faire rire quelqu'un à une soirée. Mais elles ne déclenchent aucune gate.

**Gates anti-IA manquantes pour les vannes**

| Marqueur | Exemple de fuite | Pourquoi c'est un problème |
|---|---|---|
| Vocabulaire corporate dans setup/punchline | "communication interpersonnelle", "sous-optimal", "compétences sociales" | Aucun humain ne sort ça en soirée |
| Début par "En tant que" | "En tant que personne qui..." | Tournure de prompt IA typique |
| Vanne à la troisième personne sans ancrage | "Il semblerait que les êtres humains..." | Désincarnée, personne ne la raconterait |
| Setup abstrait sans situation | Aucune situation concrète (boulot, soirée, date, coloc) dans 50+ mots | Vanne non sortable oralement |

---

### 2. Conseils — `runTipGates` (G-T1 à G-T4)

**Ce qui fonctionne**

G-T2 (format DÉFI) et G-T4 (dialogue dans l'exemple) sont des gates directement ancrées dans le brand voice. Elles garantissent que le conseil est concret et pas théorique. G-T3 (60 mots minimum) empêche le contenu anémique.

**Ce qui manque**

Même problème qu'avec les vannes : aucune gate sur le ton. Et pour les conseils, c'est encore plus critique car ce sont des textes longs où le robot peut s'exprimer librement. Un conseil intégralement rédigé dans un registre corporate passe toutes les 4 gates si l'exercice contient le mot "DÉFI" et si l'exemple a des guillemets.

Exemple concret de conseil qui passerait toutes les gates :

> **Titre** : Optimisez votre communication non-verbale  
> **Contenu** (200 mots, passe G-T3) : "La communication non-verbale représente 93% des interactions humaines selon les études de Mehrabian. Il convient donc d'optimiser ce vecteur de communication pour maximiser l'impact de vos échanges sociaux. Une approche méthodique..."  
> **Exemple** : « Mon interlocuteur : tu vas bien ? / Moi : effectivement, mes paramètres physiologiques sont dans les normes. »  
> **Exercice** : "DÉFI COMMUNICATION : analysez vos interactions de la journée."

Ce contenu est profondément hors-brand. Ton condescendant, registre corporate, vocabulaire technique. Il passe G-T1, G-T2, G-T3, G-T4 sans problème.

**Gates manquantes pour les conseils**

| Marqueur | Exemple | Pourquoi |
|---|---|---|
| Vouvoiement dans le contenu | "Il convient de...", "vous devriez..." | Brand voice = tutoiement systématique |
| Vocabulaire corporate | "communication interpersonnelle", "vecteur", "levier", "optimiser", "paramètre" | Interdit par le TONALITY_BRIEF |
| Titre en infinitif impersonnel | "Améliorer sa communication en société" | Pas du "pote drôle", plutôt un manuel RH |
| Conseil sans ancrage situationnel | Aucune mention de boulot/soirée/date/coloc/appli dans le contenu | Le conseil n'est pas relatable |

---

### 3. Blog — `runBlogGates` (G-B1 à G-B7)

**Ce qui fonctionne**

G-B4 (5 liens internes minimum) est une gate SEO bien calibrée. G-B7 (refs legacy ≤ 1) protège la modernité éditoriale de façon directe et sans ambiguïté. G-B2 et G-B3 sont des contraintes techniques utiles.

**Ce qui manque**

G-B6 (FAQ présente) détecte la présence du mot "faq" ou d'un "##.*?" mais ne vérifie pas si la FAQ a au moins 3 questions, ce qui est le minimum documenté dans CLAUDE.md. Un article avec une FAQ d'une seule question vide passerait.

Plus important : il n'existe aucune gate qui teste le ton dans les articles. Un article rédigé intégralement au vouvoiement ("vous apprendrez", "il vous faudra") ou avec un ton condescendant ("même les débutants peuvent comprendre") passe toutes les gates.

Exemple concret qui passe G-B1 à G-B7 :

> Titre : "Comment devenir drôle en société" (55 chars — G-B2 OK)
> 1500 mots intégralement au vouvoiement ("Si vous souhaitez progresser dans l'art de l'humour, il vous est recommandé de..."), avec FAQ d'une ligne, 5 liens internes mécaniquement insérés, 0 trait d'humour, 0 référence à une situation concrète du quotidien. → Passe toutes les 7 gates.

**Gates manquantes pour le blog**

| Marqueur | Exemple | Pourquoi |
|---|---|---|
| Vouvoiement dans le corps de l'article | "il vous est conseillé", "vous devriez" | Non-négociable dans le brand voice |
| Vocabulaire pédagogique formel | "il convient de noter", "nous verrons que", "comme nous l'avons vu" | Registre de cours, pas de pote drôle |
| FAQ insuffisante (< 3 questions) | Regex détecte "faq" mais pas le nombre de questions | CLAUDE.md exige 3-5 questions |

---

### 4. Social — `runSocialGates` (G-S1 à G-S8)

**Ce qui fonctionne**

G-S3 est la gate la plus élaborée et la plus utile du dispositif. Elle bloque des tournures IA facilement identifiables. G-S4 (engagement bait) est bien alignée sur la charte sociale. G-S6 (CTA non-marketing) est directement issue du brand voice — "n'hésitez pas" et "découvrez" sont effectivement des marqueurs corporate à éliminer.

**Ce qui manque dans G-S3**

La liste des red flags IA couvre les tournures formelles, mais manque les tics IA les plus courants en contenu "décontracté simulé". Les LLM actuels ont appris à éviter les tournures académiques — ils produisent maintenant du faux-naturel. Voici les patterns absents de G-S3 :

| Tic IA non détecté | Exemple concret | Pourquoi passe la gate |
|---|---|---|
| "Résultat ?" en question isolée | "Tu évites le blanc. Résultat ? Ils rient." | Absent de la liste |
| "Petite astuce" | "Petite astuce pour être drôle au bureau" | Marqueur de contenu IA formaté |
| "Et devinez quoi ?" | "Et devinez quoi ? Ça marche à chaque fois." | Faux suspense IA typique |
| "La vraie question c'est..." | "La vraie question c'est : pourquoi tu ris ?" | Rhétorique IA |
| "Spoiler :" | "Spoiler : tout le monde peut apprendre à être drôle." | Très courant dans les posts IA |
| "C'est simple." en phrase isolée | Post long → "C'est simple." → liste | Faux naturel IA |
| Répétition du mot-clé en conclusion | "Voilà pourquoi l'humour, c'est important." | Pattern de clôture IA |
| "On vous explique" / "On vous donne" | "On vous donne 3 techniques pour..." | Registre corporate-IA |
| Adverbes d'intensité vides | "vraiment", "totalement", "franchement" en ouverture | Filler IA pour paraître spontané |

**Problème de G-S7 (max 2 emojis) — risque de faux positif**

Cette gate est trop restrictive pour le contexte social media. Un tweet avec 3 emojis utilisés intelligemment ("🎤 Fary utilise le silence comme une arme. 2-3 secondes. Puis il dit une chose. 💀 Le public est mort de rire.") est du bon contenu dans le ton de la marque. La gate va le rejeter automatiquement.

La règle dans `validateSocialPost` dit "max 2 émojis, jamais en ouverture". La gate devrait vérifier l'emoji en position 0 (ouverture) plutôt que de compter aveuglément.

**Problème de G-S8 (voix équipe — "on" pas "je")**

La regex actuelle est trop étroite : elle ne détecte que `j'ai compilé|créé|lancé|écrit|fait|préparé|développé`. Un post avec "j'ai essayé", "j'ai remarqué", "j'ai testé" (tous des formulations courantes pour parler de la marque à la première personne) passerait sans être bloqué.

---

## 5. Risques de faux positifs sur le ton de marque

### G-J6 (punchline ≠ constat) — risque ÉLEVÉ

L'heuristique regex est fragile. La gate rejette une punchline qui commence par `il/elle/c'/ça/j'/je/ils/on` + verbe passé, ET qui ne contient pas de twist markers.

Exemple de bonne vanne qui serait bloquée à tort :

> Setup : "Mon coloc a mis 6 mois pour faire la vaisselle."
> Punchline : "Il a attendu que ce soit ma faute."

La punchline commence par "Il a attendu" et ne contient pas les twist markers listés. Elle échoue G-J6. Pourtant c'est une vanne avec un twist réel (manipulation passive-agressive du coloc) et elle passerait le test stand-up haut la main.

Autre exemple :

> Setup : "J'ai mis une alarme pour me lever tôt et être productif."
> Punchline : "Elle sonne encore."

La punchline est "Elle sonne encore." — début par "Elle" + verbe présent, pas de twist markers. Rejetée par G-J6. Pourtant c'est une excellente vanne absurde sur la procrastination.

**Recommandation** : ajouter les patterns suivants à `twistMarkers` : `encore|quand même|vraiment|non|zéro|rien|personne|jamais rien|pas du tout|la honte`.

### G-S7 (max 2 emojis) — risque MODÉRÉ

Voir analyse ci-dessus. Un post Twitter avec 3 emojis dans le ton serait bloqué. La marque "pote drôle et bienveillant" ne s'interdit pas les emojis — elle les utilise avec parcimonie et jamais en ouverture. La limite de 2 est arbitraire.

**Recommandation** : remplacer la gate par : "pas d'emoji en position 0 du hook" + "max 4 emojis". Ou passer G-S7 en avertissement dans la validation IA plutôt qu'en rejet automatique.

### G-J2 (punchline < setup) — risque FAIBLE mais réel

La règle "punchline plus courte que le setup" est valide en stand-up classique, mais certains formats courts légitimes ont une punchline de longueur égale :

> Setup : "Mon boss m'a demandé d'être plus spontané." (9 mots)
> Punchline : "Il me l'a envoyé par email." (7 mots — OK)

Mais :
> Setup : "Je suis nul en sport." (5 mots)
> Punchline : "C'est ce que dit mon kiné." (6 mots — FAIL G-J2)

La deuxième vanne est bonne (attribution humoristique d'une autorité médicale), mais elle échoue G-J2 d'un seul mot.

---

## Top 3 améliorations prioritaires

### Priorité 1 — Ajouter une gate anti-vouvoiement (concerne J, T, B, S)

Le tutoiement est la première règle du brand voice. Il n'existe aucune gate qui le protège. Un contenu au vouvoiement peut passer tous les filtres actuels.

Gate à créer : détecter `vous (?!trouverez|pouvez découvrir)` (en évitant les faux positifs du style "vous pouvez" dans un contexte narratif neutre) + `votre ` (adjectif possessif vouvoiement) + `il vous ` dans les contenus vannes, conseils et blog.

Implémentation suggérée :

```typescript
// Dans runTipGates et runBlogGates
const vouvoiementPattern = /\b(vous devez|vous pouvez|votre objectif|vous apprendrez|il vous est|il vous faut|à votre rythme)\b/i;
results.push({
  gate: "G-T5 Tutoiement (pas de vouvoiement)",
  pass: !vouvoiementPattern.test(fullText),
  reason: vouvoiementPattern.test(fullText) ? "Vouvoiement détecté — brand voice = tutoiement systématique" : "OK",
});
```

### Priorité 2 — Compléter G-S3 avec les tics du "faux naturel IA"

Les LLM de 2026 ont progressé : ils évitent "il convient de" et "force est de constater". Mais ils produisent maintenant du "faux naturel" avec des patterns reconnaissables. La gate G-S3 cible les marqueurs académiques des LLM de 2023, pas les marqueurs contemporains.

Patterns à ajouter à `iaRedFlags` :

```typescript
"petite astuce",
"et devinez quoi",
"spoiler :",
"résultat ?",
"la vraie question",
"c'est simple.",
"on vous donne",
"on vous explique",
"vraiment utile",
"totalement normal",
```

### Priorité 3 — Élargir les twist markers de G-J6

G-J6 produit des faux positifs sur des bonnes vannes courtes. Ajouter aux `twistMarkers` actuels :

```typescript
const twistMarkers = /comme|genre|en fait|finalement|tellement|carrément|sauf que|mais|du coup.*pas|jamais|toujours|même pas|déjà|encore|quand même|de toute façon|forcément|évidemment pas|bien sûr que non|rien|personne/i;
```

---

## Tableau de synthèse

| Famille de gates | Nb de gates | Protège le ton de marque ? | Red flags IA couverts ? | Risque de faux positif | Note |
|---|---|---|---|---|---|
| Vannes (G-J1 à G-J7) | 7 | Partiellement (G-J3, G-J7) | Absent | Moyen (G-J6) | 5,5/10 |
| Conseils (G-T1 à G-T4) | 4 | Partiellement (G-T4) | Absent | Faible | 5/10 |
| Blog (G-B1 à G-B7) | 7 | Non | Absent | Faible | 6/10 |
| Social (G-S1 à G-S8) | 8 | Oui (G-S3, G-S4, G-S6, G-S8) | Partiel (manque faux naturel IA) | Moyen (G-S7) | 7,5/10 |

---

## Ce qui n'est pas dans le périmètre des gates (et ne doit pas l'être)

Certains critères du brand voice ne peuvent pas être vérifiés programmatiquement sans LLM : le twist comique est-il surprenant, le ton est-il vraiment celui du "pote drôle", l'exemple est-il relatable. Ces critères sont correctement délégués à la validation LLM (Directeur Artistique). L'objectif des gates n'est pas de remplacer le jugement artistique, mais d'intercepter les cas évidents avant de consommer des tokens LLM.

Le scope correct des gates est : format, longueur, mots interdits, contraintes techniques. Tout ce qui relève du jugement qualitatif reste côté LLM. L'audit ne critique pas les gates sur ce qu'elles ne sont pas censées faire.

---

## Hypothèses à valider

Aucune hypothèse de fond dans cet audit — toutes les conclusions sont tirées de l'analyse directe du code et du TONALITY_BRIEF.

---

**Handoff → @fullstack**
- Fichiers produits : `docs/reviews/gates-audit-copywriter.md`
- Décisions prises : 3 améliorations prioritaires identifiées avec code d'implémentation suggéré
- Points d'attention :
  - Priorité 1 (gate vouvoiement) : ajouter dans `runTipGates` et `runBlogGates`, vérifier les faux positifs sur les vannes qui utilisent "vous" dans un dialogue (ex : "— Vous avez l'heure ?")
  - Priorité 2 (G-S3 enrichi) : tester les nouveaux patterns sur le catalogue social existant avant de les activer — certains posts pourraient contenir "spoiler :" de façon légitime
  - Priorité 3 (G-J6 twist markers) : régression à vérifier sur les tests unitaires `ai-agents.test.ts`
  - G-S7 (max 2 emojis) : décision à prendre — passer à max 4 ou bloquer uniquement l'emoji en position 0 du hook
