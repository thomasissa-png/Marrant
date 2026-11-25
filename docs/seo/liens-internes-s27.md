# Liens internes s27 (actions 1 et 5 du plan des pages qui vendent)

Date : 25/11/2026. Référence : `docs/seo/plan-pages-qui-vendent-s27.md` §3. Décision de Thomas du 25/11 : « Je suis les recos de l'équipe, qu'on fasse ça bien. »
Statut : **aucun texte modifié** (ni code, ni base). Constats et propositions ci-dessous.

## Action 5 : `phrases-droles-conversations` → `comment-avoir-de-la-repartie`

Déjà fait. L'article (statique, `apps/web/src/lib/blog-articles.ts`) pointe 3 fois vers `/blog/comment-avoir-de-la-repartie`, et les 3 liens sont dans le HTML public lu le 25/11 :

| Ligne | Ancre |
|---|---|
| 1213 (section machine à café) | « comment avoir de la répartie au travail » |
| 1268 | « l'art de la répartie s'apprend » |
| 1341 | « la répartie, ça s'apprend » |

Le plan demandait un seul lien utile : rien à ajouter. La 1re ancre contient déjà « avoir de la répartie ».

## Action 1 : `meilleures-blagues-droles-2026`

### Le postulat du plan est faux

Le plan (§1) dit que l'article « est en base (pas dans `blog-articles.ts`) ». Vérifié le 25/11 :
- l'article est **statique** dans `apps/web/src/lib/blog-articles.ts` (l. 1381 à 1604), présent dans le build en ligne `1998ae31` ;
- **aucune ligne** `BlogArticle` avec ce slug en base Neon (lecture seule) ;
- `findBlogArticle` (`src/lib/blog-article-page.ts`) sert les articles statiques en premier : même si une ligne existait en base, elle ne serait jamais affichée.

Conséquence : l'action 1 est une modification de **code**, visible seulement après un déploiement (pas d'écriture en base, pas d'effet ISR). Aucune écriture en base n'a été faite ; pas de sauvegarde de ligne à faire (rien à sauvegarder).

### Emplacements possibles (non écrits)

Le corps de l'article ne contient le mot « répartie » qu'une fois, et ne parle jamais de s'entraîner ni d'exercices (« entraînement » n'apparaît que dans une réponse de FAQ, intouchable). Il n'y a donc **pas d'endroit naturel sur des mots existants pour le lien vers les exercices**, et un seul, discutable, pour la répartie.

**Lien vers `/blog/comment-avoir-de-la-repartie`**

- R1, sur des mots existants (l. 1588), dans la liste de fin :
  - avant : `→ **[Nos conseils d'humour](/conseils)** : les techniques de timing et de répartie des pros.`
  - après : `→ **[Nos conseils d'humour](/conseils)** : les techniques de timing et de [répartie](/blog/comment-avoir-de-la-repartie) des pros.`
  - Réserve : ancre d'un seul mot, deuxième lien dans une puce qui renvoie déjà vers `/conseils`.
- R2, phrase nouvelle (copy à valider avec Thomas, relecture à l'aveugle), après la l. 1582 « **Adapte, n'apprends pas par cœur.** Change les prénoms, adapte les situations à ta vie. » :
  - ajout : `Et quand on te chambre en retour, c'est une autre compétence : [avoir de la répartie](/blog/comment-avoir-de-la-repartie).`

**Lien vers `/blog/exercices-developper-humour`**

- E1, sur des mots existants (l. 1584) :
  - avant : `Si tu veux progresser sérieusement, nos [parcours structurés](/parcours) te donnent un plan semaine par semaine.`
  - après : `Si tu veux [progresser sérieusement](/blog/exercices-developper-humour), nos [parcours structurés](/parcours) te donnent un plan semaine par semaine.`
  - Déconseillé : le lien colle au lien vers `/parcours` (celui qui vend) et l'ancre ne dit pas « exercices ».
- E2, phrase nouvelle (copy à valider), après la l. 1505 « C'est là que tout commence : faire rire sa bande avant de faire rire un public. » :
  - ajout : `Pour t'entraîner entre deux soirées, il y a [des exercices pour développer ton humour](/blog/exercices-developper-humour).`
  - Ancre alignée sur l'action 4 du plan (exercices = « s'entraîner », pas « comment devenir drôle »).

Reco : R2 + E2 (ancres descriptives, sans toucher aux liens commerciaux), avec le paragraphe de tête de l'action 2 dans le même passage copy. Prérequis du plan toujours ouvert : vérifier dans Umami que 2 liens de plus ne font pas baisser les clics de l'encart (658 vues, 36 clics).

### Vérifications publiques (25/11)

- `/blog/meilleures-blagues-droles-2026` : 200, contenu identique au statique (aucun lien vers les 2 cibles).
- `/blog/comment-avoir-de-la-repartie` : 200. `/blog/exercices-developper-humour` : 200.
