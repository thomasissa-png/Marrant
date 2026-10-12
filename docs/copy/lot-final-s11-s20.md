# Lot final s11-s20 : pause « une seconde » et 3 métas > 155 car. (proposition, rien appliqué)

> Source : `apps/web/src/data/blog-article-rewrites.json` (`_meta.version` 4). Rien appliqué, pas de commit. Une phrase modifiée par endroit. Zéro tiret cadratin. Comptage des caractères à la main, par code points Unicode (é, à, ç = 1), vérifié : les trois « avant » donnent bien 160, 159 et 156, comme annoncé en `corrections-s11-s20.md` §10.

Repères : @fullstack applique par remplacement exact (chaque « avant » existe une seule fois dans le champ). Le champ `content` est une chaîne JSON : les guillemets internes y sont échappés (`\"`).

---

## 1. Durée de pause

Valeur de référence du site : **une seconde** de pause avant la chute (art. `comment-raconter-une-blague-sans-la-rater` : « Une seconde de pause avant la punchline… »).

### L1 | `techniques-humoristes-pros` | champ `content`

- Avant : `[pause de 2 secondes, regard vers ton public]`
- Après : `[pause d'une seconde, regard vers ton public]`
- Une seule phrase touchée (l'indication scénique de l'exemple « Mon père m'a toujours dit… »). Le reste de la ligne est identique.

### L2 | `blague-drole-7-criteres-pepite` | champ `content` (encadré CLEF du critère #3, timing)

- Avant : `> **CLEF :** Le timing d'une blague drôle suit la règle du 3-2-1 : 3 secondes pour planter le décor, 2 secondes de suspense, 1 seconde pour la chute qui claque.`
- Après : `> **CLEF :** Le timing d'une blague drôle suit la règle du 3-2-1, qui découpe la blague entière : 3 secondes pour planter le décor, 2 secondes de suspense (dont une seconde de silence juste avant la chute), 1 seconde pour la chute qui claque.`
- Choix assumé : la règle 3-2-1 est un rythme de blague complet (6 secondes), pas une pause isolée. Elle reste intacte (3, 2, 1 inchangés, la règle n'est pas cassée). La phrase dit maintenant que la montée de 2 secondes contient la seconde de silence, ce qui rejoint le « une seconde » du reste du site. Pas d'alignement brut sur « une seconde » : cela ferait un 3-1-1, une autre règle, moins mémorisable.
- Lecture : c'est une reformulation, pas une retouche de chiffre. Elle passe donc en relecture à l'aveugle (règle d'or P0, liste plus bas).

### Hors périmètre, signalé

`apps/web/src/lib/blog-articles.ts` l.252 (« Une pause de 2… ») et l.1570 (« pause de 2-3 secondes ») disent encore autre chose que « une seconde ». Ces textes sont dans le code (articles statiques), non touchés ici. Tests qui citent « pause de 2 secondes » : `daily-content.test.tsx` l.44 et `ai-agents.test.ts` l.652, hors articles du JSON, non concernés.

---

## 2. Métas > 155 caractères

| Slug | Avant (car.) | Après (car.) | Retrait |
|---|---|---|---|
| `avoir-confiance-en-soi-grace-a-l-humour` | 160 | 150 | « pratiques » (redondant avec « concrètes ») |
| `comment-raconter-une-blague-sans-la-rater` | 159 | 145 | « à destination » |
| `techniques-humoristes-pros` | 156 | 152 | « Les » en tête |

### M1 | `avoir-confiance-en-soi-grace-a-l-humour` | champ `metaDescription`

- Avant (160) : `La confiance en soi grâce à l'humour, ça se construit : 3 étapes concrètes, 5 exercices pratiques et un programme de 30 jours pour changer ta timidité en force.`
- Après (150) : `La confiance en soi grâce à l'humour, ça se construit : 3 étapes concrètes, 5 exercices et un programme de 30 jours pour changer ta timidité en force.`

### M2 | `comment-raconter-une-blague-sans-la-rater` | champ `metaDescription`

- Avant (159) : `Comment raconter une blague sans la rater : 7 techniques, de la préparation au timing et de la voix à la chute, pour que ta vanne arrive entière à destination.`
- Après (145) : `Comment raconter une blague sans la rater : 7 techniques, de la préparation au timing et de la voix à la chute, pour que ta vanne arrive entière.`

### M3 | `techniques-humoristes-pros` | champ `metaDescription`

- Avant (156) : `Les techniques des humoristes pros, du callback à la pause calculée : 7 mécaniques de stand-up à voler dès maintenant pour tes soirées et tes conversations.`
- Après (152) : `Techniques des humoristes pros, du callback à la pause calculée : 7 mécaniques de stand-up à voler dès maintenant pour tes soirées et tes conversations.`

Promesse conservée dans les trois cas : mot-clé en tête, nombre d'étapes / exercices / techniques / mécaniques, tutoiement, aucun chiffre ajouté ni retiré (3, 5, 30, 7 inchangés).

---

## 3. Liste anonymisée pour la relecture à l'aveugle

Voir `docs/copy/lot-final-s11-s20-aveugle.md` (même contenu, seul fichier à donner aux relecteurs). Le titre H1 des articles n'est pas dans le JSON (il est en base) : les métas sont présentées avec le sujet de l'article, déduit du slug. `[À CONFIRMER : H1 exact en base]` si les relecteurs en ont besoin.

## 4. Clé (NE PAS OUVRIR AVANT LES VERDICTS)

| Lettre | Correction |
|---|---|
| A | M3 (`techniques-humoristes-pros`, méta) |
| B | L1 (`techniques-humoristes-pros`, pause d'une seconde) |
| C | M1 (`avoir-confiance-en-soi-grace-a-l-humour`, méta) |
| D | L2 (`blague-drole-7-criteres-pepite`, règle 3-2-1) |
| E | M2 (`comment-raconter-une-blague-sans-la-rater`, méta) |

Étalon de comparaison pour D si la relecture la juge sous la barre : variante de repli, alignement brut `3 secondes pour planter le décor, 1 seconde de suspense, 1 seconde pour la chute qui claque` (règle renommée 3-1-1), à n'utiliser qu'en dernier recours.
