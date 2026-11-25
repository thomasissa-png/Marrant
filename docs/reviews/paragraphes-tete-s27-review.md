# Relecture à l'aveugle : paragraphes de tête s27 (textes 2 à 6)

Date : 25/11/2026. Relecteur : @reviewer (n'a pas participé à l'écriture).
Source relue : `docs/copy/paragraphes-tete-s27-final.md`. Référence de ton : texte n°1 (étalon validé par Thomas, non modifié) et `docs/copy/ton-alex.md`.
Contexte vérifié dans `apps/web/src/lib/blog-articles.ts` : l. 127-157 (répartie), l. 384-416 (autodérision), l. 627-658 (5 types), l. 1503-1507 et 1570-1588 (meilleures blagues), l. 874-905 (cible du lien E2).

Numérotation : n°5 = phrase de lien R2, n°6 = phrase de lien E2.

## Verdicts

| N° | Texte | Verdict | Défaut principal |
|---|---|---|---|
| 2 | `comment-avoir-de-la-repartie` | OK après corrections | « avant qu'on te la lance » : le pronom renvoie à « ta réponse » (faux sens) |
| 3 | `autoderision-interactions` | OK après corrections | La définition (« avant que quelqu'un le remarque ») contredit l'exemple qui suit (un plantage public, déjà vu par tous) |
| 4 | `5-types-humour-lequel-pour-toi` | OK après corrections | « tu as trouvé ton style » promet trop, contredit « combinent 2-3 types » et redit le paragraphe suivant |
| 5 | R2 → `/blog/comment-avoir-de-la-repartie` | OK après corrections | « ensuite » flotte : après quoi ? |
| 6 | E2 → `/blog/exercices-developper-humour` | OK après corrections | « à faire chez toi » est faux pour une partie des 10 exercices |

Aucun tiret cadratin, aucun chiffre ni nom d'humoriste ajouté, aucune faute d'orthographe dans les 5 textes. Ancres et slugs cohérents (les deux cibles existent, l. 127 et l. 874, et l'article blagues ne pointe encore vers aucune des deux).

## Corrections

### N°2 : `comment-avoir-de-la-repartie`

1. **Faux sens (bloquant).** « tu as ta réponse prête avant qu'on te la lance » : le « la » renvoie grammaticalement au nom féminin le plus proche, « ta réponse ». À l'oral, ça donne « avant qu'on te lance ta réponse ».
2. **Logique boiteuse.** « écris la réplique que tu aurais voulu sortir, à côté de la pique » : la pique n'a pas été notée, donc il n'y a rien à côté de quoi écrire. Le geste (noter les deux, côte à côte) est ce qui permet ensuite de voir que « les piques se ressemblent » : il faut le dire.
3. **Répétition avec ce qui suit (mineur).** « on te lance une pique devant tout le monde » est repris deux paragraphes plus bas, presque mot pour mot : « quelqu'un te lance une remarque » (l. 133). Changer le verbe suffit.

Texte corrigé :

> Si on te balance une pique devant tout le monde et que tu réponds par un rire gêné, en rentrant, note la pique, et en face la réplique que tu aurais voulu sortir. Au bout de quelques soirées, tu remarques que les piques se ressemblent, et quand la suivante arrive, ta réponse est déjà prête.

Remarque non bloquante : l'article vise « en soirée comme au bureau » (excerpt, l. 130), alors que « quelques soirées » ne parle que des soirées. On peut le garder par symétrie avec l'étalon.

### N°3 : `autoderision-interactions`

1. **Contradiction interne (bloquant).** La phrase 1 définit l'autodérision comme le fait de rire de soi « avant que quelqu'un le remarque ». Or la phrase 2 parle d'un plantage « devant du monde », que tout le monde a donc déjà vu. Cette condition ne figure pas non plus dans l'article : ni dans « À retenir » (l. 390), ni dans les règles (l. 412-416), ni dans l'exemple de Blanche Gardin (l. 396). Il faut la retirer de la définition et garder l'idée d'anticiper pour le geste (« avant les autres »).
2. **Ambiguïté.** « avant que quelqu'un le remarque, en souriant, » : on peut comprendre que c'est « quelqu'un » qui sourit.
3. **Tournure peu naturelle.** « un petit défaut à toi » : à l'oral, on dit « un de tes petits défauts ».
4. **Accord du nombre.** On a « devant du monde » et « les épaules », mais « l'autre soit à l'aise » au singulier.
5. **Exemple obscur.** « mauvaise salle » : on ne voit pas tout de suite qu'il s'agit de se tromper de salle.

Texte corrigé :

> L'autodérision, c'est rire d'un de tes petits défauts avec le sourire, pour que les autres soient à l'aise au lieu d'être gênés pour toi. La prochaine fois que tu te plantes devant du monde (tu te trompes de salle, tu oublies un prénom), sors la vanne avant les autres, et tu verras les épaules se détendre.

Remarque non bloquante : « L'autodérision, c'est... » est suivi directement de « Bien dosée, l'autodérision... » (l. 388), donc deux phrases de suite ont le même sujet. C'est acceptable sous un titre qui commence par « Autodérision : définition ». Le corriger demanderait de toucher à l'article, ce qui sort du périmètre.

### N°4 : `5-types-humour-lequel-pour-toi`

1. **Promesse fausse (bloquant).** « tu as trouvé ton style » : un seul « c'est tellement vrai » ne suffit pas à trouver son style. Surtout, l'« En bref » qui suit dit que « la plupart des gens drôles combinent 2-3 types » (l. 631). Il faut présenter ce retour comme un indice, avec le vocabulaire de l'article (« Est-ce ton type ? », l. 648).
2. **Répétition avec ce qui suit.** « tu as trouvé ton style » est immédiatement suivi de « C'est que tu as déjà un style » (l. 633), et la reprise est flagrante. La correction 1 la supprime.
3. **Typographie.** La pensée citée est une question directe, il manque le point d'interrogation : « mais pourquoi tout le monde fait ça ? ». Les espaces autour des guillemets sont des espaces ordinaires dans le fichier source (l. 31). Il faut des espaces insécables (U+00A0 ou U+202F) après « et avant », et avant « ? ». Le blog n'en insère pas automatiquement (aucune occurrence dans le rendu blog).
4. **Répétition interne (mineur).** « tout le monde » revient dans la phrase 1 et dans la phrase 2.
5. **Tournure.** « si tu l'entends répondre » sonne écrit. À l'oral : « s'il te répond ».

Texte corrigé (espaces insécables autour des guillemets et avant « ? ») :

> L'humour observationnel, c'est dire à voix haute un truc que tout le monde a vécu sans jamais le formuler. La prochaine fois que tu te dis dans le métro « mais pourquoi ils font tous ça ? », dis-le tel quel à un pote, et s'il te répond « c'est tellement vrai », tu tiens peut-être ton type d'humour.

Remarque sur la note d'accompagnement (pas sur le texte) : elle affirme que le texte « ne cite aucun des 5 types », alors qu'il nomme l'observationnel, qui est le type 1. Le geste proposé recoupe aussi le « Test » du type 1 (l. 650 : décrire une absurdité à un ami et observer sa réaction). Ce n'est pas bloquant puisque les deux passages sont séparés par l'« En bref » et l'intro, mais il faut le savoir.

### N°5 : R2 (`meilleures-blagues-droles-2026`, l. 1582)

1. **Logique floue.** « Et si c'est toi qu'on chambre ensuite » : la phrase précédente parle d'adapter les prénoms et les situations, donc « ensuite » ne se raccroche à rien de précis. L'idée est la riposte à ta vanne, il faut le dire.
2. **Répétition de formule (mineur).** R2 et E2 commencent toutes les deux par « Et si » dans le même article, et R2 est suivie de « Si tu veux progresser » (l. 1584). La correction ci-dessous en garde un seul par endroit, ce qui reste acceptable.

Texte corrigé :

> Et si on te chambre en retour, voici comment [avoir de la répartie](/blog/comment-avoir-de-la-repartie) au lieu de rester sans voix.

Ancre « avoir de la répartie » : cohérente avec le titre cible (« Avoir de la répartie : 10 techniques »). RAS sur le lien.

### N°6 : E2 (`meilleures-blagues-droles-2026`, l. 1505)

1. **Affirmation inexacte.** « à faire chez toi » : l'exercice 1 de la cible consiste à repérer une situation absurde « autour de toi » dans la journée (l. 887), et l'« À retenir » prévoit de tester « en situation réelle » (l. 880). Ce n'est pas un programme à faire chez soi. « Entre deux soirées » suffit et reste vrai.

Texte corrigé :

> Et si tu veux que ça tombe juste plus souvent, il y a [des exercices pour développer ton humour](/blog/exercices-developper-humour) à faire entre deux soirées.

Ancre « des exercices pour développer ton humour » : cohérente avec le titre cible (« 10 exercices pour développer ton humour »). RAS sur le lien.

## Avant mise en ligne

- Les textes 2, 3 et 4 corrigés ci-dessus sont des réécritures partielles. Selon la règle P0 s18, ils repassent une relecture à l'aveugle avant d'être publiés.
- Le prérequis Umami (2 liens de plus dans l'article blagues sans perte de clics sur l'encart) reste ouvert : il n'a pas été vérifié ici.
