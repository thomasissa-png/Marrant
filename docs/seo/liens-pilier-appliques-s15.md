# Liens vers le pilier `/blog/comment-devenir-drole` : appliqués (s15, 06/10/2026) @fullstack

Spec : `docs/seo/pilier-non-indexe-s15.md` §4.1 (L1 à L7), GO de Thomas du 05/10. **Non déployé** (voir `REPLIT_ACTIONS.md`, section « À DÉPLOYER »).

## Mesure du diff réel (P0 s11)

Mots comptés sur le markdown du `content` (`git show HEAD` contre l'arbre de travail, diff mot à mot).

| Article | Mots avant > après | Ajoutés / retirés | Taux | Liens internes | H2 | Tirets cadratins |
|---|---|---|---|---|---|---|
| `comment-devenir-drole` (pilier) | 1 433 > 1 508 | +75 / 0 | 5,2 % | 8 > 13 | identiques | 5 > 5 (préexistants, H3) |
| `meilleures-blagues-droles-2026` | 2 251 > 2 264 | +13 / 0 | 0,6 % | 23 > 24 | identiques | 0 > 0 |
| `comment-avoir-de-la-repartie` | 1 360 > 1 377 | +17 / 0 | 1,2 % | 8 > 9 | identiques | 0 > 0 |
| `5-types-humour-lequel-pour-toi` | 1 256 > 1 268 | +12 / 0 | 1,0 % | 6 > 7 | identiques | 5 > 5 (préexistants, H2) |
| `phrases-droles-conversations` | 1 829 > 1 839 | +10 / 0 | 0,5 % | 12 > 13 | identiques | 0 > 0 |
| `autoderision-interactions` | 964 > 972 | +8 / 0 | 0,8 % | 6 > 7 | identiques | 0 > 0 |

Intouchables vérifiés : 0 mot retiré, slugs, titres, H1, H2, FAQ, chiffres, prix et liens existants inchangés ; humoristes nommés et cités tous conservés (7 dans le pilier). Aucune URL changée, rien supprimé. Les tirets cadratins préexistants (titres H3 du pilier, H2 de `5-types`) ne sont pas touchés : les titres sont intouchables ici, à signaler à @copywriter.

## L1 : footer (`components/layout/footer.tsx`)
- Avant : liste Produit `Vannes, Conseils, Vidéos stand-up, Parcours, Blog, …`
- Après : `…, Parcours, `**`Comment devenir drôle`**` (/blog/comment-devenir-drole), Blog, …`

## L2 : accueil (`app/(dashboard)/page.tsx`), sous les 3 cartes « Tu te reconnais ? », avant `HomeCta`
- Avant : rien.
- Après : « Tu veux d'abord comprendre le mécanisme ? Lis notre guide **[comment devenir drôle]**. »

## L3 : `/blog` (`app/(dashboard)/blog/page.tsx`), au-dessus de la liste
- Avant : rien (le pilier n'était qu'une carte parmi la liste triée par date, en bas).
- Après : bloc `<aside>` « Commence ici » avec une carte **[Comment devenir drôle : le guide]** et la ligne « Les 5 piliers, ce qu'en dit la science et un plan sur 30 jours. » (reprise de l'excerpt du pilier). Pas de nouveau titre Hn : hiérarchie de `/blog` inchangée.

## L4 : article n°1 `meilleures-blagues-droles-2026`, 3e paragraphe de l'intro (ligne 7 du contenu)
- Avant : « … Que du concret, du testable, du sortable. »
- Après : « … Que du concret, du testable, du sortable. Et si un jour tu veux écrire les tiennes, lis **[comment devenir drôle]**. »
- Le lien final (« → Comment devenir drôle : le guide complet… ») reste. À coordonner avec le CTA du haut (priorité 1 de l'audit, pas encore livré) : ce lien d'intro est LE lien pilier du haut, le CTA ne doit pas en ajouter un second.

## L5 : 4 articles les mieux vus (1 phrase chacun, dans le corps, jamais dans le dernier paragraphe)
| Article | Emplacement | Phrase ajoutée (ancre en gras) |
|---|---|---|
| `comment-avoir-de-la-repartie` | fin du paragraphe « Un dernier truc important » (avant le paragraphe d'offre) | « Si tu veux travailler ton humour au-delà de la répartie, lis le guide pour **[devenir plus drôle]**. » |
| `5-types-humour-lequel-pour-toi` | fin du paragraphe « Le conseil : identifie ton type dominant… » | « Pour travailler ton style au quotidien, lis notre guide **[comment devenir drôle]**. » |
| `phrases-droles-conversations` | section « L'art de la phrase drôle », fin du 1er paragraphe | « Pour fabriquer les tiennes, lis **[le guide pour devenir drôle]**. » |
| `autoderision-interactions` | section « Comment s'entraîner », fin de l'étape 3 | « C'est d'ailleurs un des piliers pour **[devenir drôle]**. » |

Avant : 0 lien vers le pilier dans ces 4 articles. Après : 1 chacun.

## L6 : liens sortants du pilier (5 ajouts, haut de page non touché)
| Emplacement | Phrase ajoutée (ancre en gras) |
|---|---|
| Pilier 1 (observation), fin du paragraphe « En 30 jours, tu auras 30 observations… » | « Pour en faire un réflexe, pioche dans nos **[8 habitudes simples d'humour au quotidien]**. » (`/blog/humour-quotidien-8-habitudes`) |
| Plan 30 jours, nouveau paragraphe après l'étape 4 | « Pour t'entraîner sur chaque étape, fais nos **[10 exercices pour développer ton humour]**. » (`/blog/exercices-developper-humour` : le pilier renvoie au détail, cohérent avec la répartition des rôles §4.2) |
| Erreurs, nouveau paragraphe après « Forcer » | « Et si tes vannes tombent quand même à plat, lis **[pourquoi tes blagues ne marchent pas]**. » (`/blog/pourquoi-blagues-marchent-pas`) |
| « À qui ça s'adresse ? », fin du paragraphe | « Si c'est surtout la répartie qui te manque, commence par **[avoir de la répartie en 10 techniques]**. » (`/blog/comment-avoir-de-la-repartie`) |
| « À qui ça s'adresse ? », nouveau paragraphe | « Tu ne sais pas encore quel humour est le tien ? Fais le **[quiz humour]**. » (`/quiz-humour`) |

Bidirectionnels : les 4 satellites citent déjà le pilier (`comment-avoir-de-la-repartie` depuis L5).

## L7 : `updatedAt` du pilier
- Avant : `2026-09-29`. Après : `2026-10-06` (date réelle de la modification). **Si le déploiement a lieu après le 06/10, reporter la date au jour du déploiement** (alimente `Article.dateModified` et le `lastModified` du sitemap). Les 5 autres articles gardent leur `updatedAt` (ajout d'une phrase, hors périmètre L7).

## Base de données
Aucune requête SQL : les 6 articles sont statiques et `findBlogArticle` lit les statiques en premier (`lib/blog-article-page.ts`).

## Tests
`src/__tests__/feature/liens-pilier-s15.test.tsx` (16 tests) : liens rendus du footer (position avant Blog), de l'accueil (section personas), du bloc « Commence ici » (sans titre Hn), HTML du markdown pour L4 (avant le 1er H2, lien final conservé), L5 (ancre exacte, hors dernier paragraphe), L6 (5 cibles), L7, H2/FAQ/humoristes du pilier inchangés, pas de tiret cadratin ajouté. `blog.test.tsx` : le titre du pilier apparaît désormais 2 fois sur `/blog` (carte « Commence ici » + liste). `fixtures/blog-em-dash-baseline.json` : empreintes des 6 articles recalculées et tracées dans `_meta.rebaselines` (session s15). Champs changés : mots et liens partout, plus pour le pilier les nombres (seuls ajouts : « 8 » et « 10 » dans les ancres) et la meta (`updatedAt`). Les **titres** (empreinte `headings`) n'ont changé nulle part.

## Après déploiement (Thomas, §4.4 de la spec)
Search Console > Inspection d'URL > `https://deviens-marrant.fr/blog/comment-devenir-drole` > « Tester l'URL en direct » > « Demander une indexation ». IndexNow pour le pilier, `/blog` et `/` [À VÉRIFIER : non fait dans ce lot].
