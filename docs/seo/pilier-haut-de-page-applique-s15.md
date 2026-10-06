# Haut de page du pilier `/blog/comment-devenir-drole` : appliqué (s15, 06/10/2026) @fullstack

Spec : `docs/copy/etalons-pilier-s15.md`, étalons **1A** (En bref), **2A** (title = H1), **3B** (intro). GO de Thomas du 06/10 (`docs/founder-preferences.md`, dernière ligne : « Et sinon je suis tes recos »). **Non déployé** (voir `REPLIT_ACTIONS.md`, section « À DÉPLOYER »).

## Mesure du diff réel (P0 s11)

Base : `git show HEAD` contre l'arbre de travail, article `comment-devenir-drole` de `apps/web/src/lib/blog-articles.ts`.

| Mesure | Avant | Après | Ajoutés / retirés |
|---|---|---|---|
| Mots du `content` markdown (séparés par espaces, même méthode que `liens-pilier-appliques-s15.md`) | 1 508 | 1 589 | +115 / −35 (diff mot à mot git) |
| Mots du corps, empreinte du test (lettres/chiffres, `content` + réponses FAQ) | 1 773 | 1 850 | +114 / −37 (alignement LCS) |
| Title (= H1, fil d'Ariane, JSON-LD, cartes) | 5 mots | 11 mots | +9 / −2 |
| Liens internes du `content` | 13 | 14 | +1 (`/blog/exercices-developper-humour`, 2e lien vers cet article, le 1er étant celui de L6 sous le plan) |
| Tirets cadratins | 5 | 5 | 0 (les 5 sont dans les H3, préexistants) |

**Taux de changement : 9,9 %** du `content` ((115 + 35) / 1 508), soit 7,6 % ajouté et 2,3 % retiré. L'étalon annonçait ≈ 7 % sur 1 433 mots ; l'écart vient de la base (1 508 mots depuis les liens L6) et du remplacement complet de l'En bref.

## Avant / après

**Title** (`title`, l.20)
- Avant : « Comment devenir drôle : le guide »
- Après : « Comment devenir drôle : 5 piliers et un plan sur 30 jours » (57 caractères)

**En bref** (1re ligne du `content`)
- Avant : « Devenir drôle est une compétence qui s'apprend, pas un talent inné. L'humour s'appuie sur 3 leviers (observation, surprise, timing) que n'importe qui peut développer. Un programme structuré de 8 semaines suffit à progresser significativement, quel que soit le niveau de départ. »
- Après (1A, texte exact) : « Pour devenir drôle, note chaque jour une situation absurde, reformule-la en 3 versions, teste la meilleure sur un proche, puis réutilise ce qui a fait sourire. 5 à 10 minutes par jour pendant 30 jours suffisent à la plupart des gens pour sentir la différence : l'humour est une compétence, pas un talent inné. »

**Intro** : le paragraphe de l'oncle est conservé à l'identique ; ajouté juste après (3B, texte exact) : « Reste à savoir comment. Au programme : pourquoi les humoristes ne sont pas « nés drôles » (ils ont enchaîné les bides avant de remplir des salles), ce que la science dit de l'apprentissage, les 5 piliers, puis un plan sur 30 jours pour passer de « comprendre » à « produire ». Quand tu voudras t'entraîner séance par séance, direction nos [10 exercices pour développer ton humour](/blog/exercices-developper-humour). »

**Effets de bord** (titre codé en dur, JSON-LD `relatedArticles`) : `app/(dashboard)/vannes/page.tsx:96` et `app/(dashboard)/videos/page.tsx:92` alignés sur le nouveau title.

## Intouchables vérifiés

Slug, excerpt (meta description), H2, H3, questions et réponses FAQ, liens existants, humoristes (Mirabel, Fary, Gardin…), citation Crawford et Caltabiano et sa source, prix : inchangés (empreintes `headings` identiques, `faqs` identiques, contrôle par `pilier-haut-de-page-s15.test.ts`). `updatedAt` : déjà `2026-10-06` (date du jour, posé par L7), **non modifié** ; à reporter si le déploiement a lieu un autre jour. Chiffres : seuls ceux de l'En bref changent (« 3 leviers » et « 8 semaines » sortent, « 3 versions », « 5 à 10 minutes », « 30 jours » entrent) ; « 3 leviers » (À retenir, FAQ 2) et « 8 semaines » (l'étude) restent dans le corps, comme prévu par Q1.

## Signalé, non touché

- **Tirets cadratins dans les 5 H3 « Pilier n : … — … »** (l.49, 57, 66, 72, 78) : titres intouchables, laissés tels quels. À traiter dans une passe dédiée avec GO (ancres SEO à vérifier).
- **Bloc « Commence ici » de `/blog`** (`app/(dashboard)/blog/page.tsx:147`) : la carte affiche toujours « Comment devenir drôle : le guide » (libellé de carte, hors liste des effets de bord ; le sous-titre dit déjà « Les 5 piliers… un plan sur 30 jours »). Aligner seulement sur demande.
- Le lien vers `exercices-developper-humour` existait déjà sous le plan (L6) : l'étalon le disait absent (rédigé avant L6). Il y a désormais 2 liens vers cet article, avec la même ancre.

## Empreintes du test des tirets cadratins

`apps/web/src/__tests__/lib/fixtures/blog-em-dash-baseline.json` : empreintes `comment-devenir-drole` recalculées (mots, liens, chiffres, meta ; `headings` inchangé), entrée tracée dans `_meta.rebaselines` (session « s15 haut de page »). Aucun tiret cadratin ajouté.
