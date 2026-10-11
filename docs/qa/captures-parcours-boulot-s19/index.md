# Captures du Parcours Boulot (s19, 11/10/2026) : relecture du rendu @design / @ux, itération 5

Instance **locale jetable** (Postgres 127.0.0.1:55433, app en env propre, Chromium limité à localhost), jamais la prod. Script : `scripts/qa-parcours-boulot-s19/captures.sh` (fixtures `fixtures.py`, comptes `comptes.sh`, navigateur `captures.js`). Base : schéma + seed + état de la prod relevé le 10/10 (`boulot-base-s19.json`) ; build `BOULOT_PUBLIE` forcé à `true` en local, remis à `false` en sortie (`git diff` de l'interrupteur vide) ; `STORYTELLING_PUBLIE` jamais touché.

**Run de l'itération 5 (11/10/2026)** : **110 captures, 245 PASS, 0 FAIL**, toutes refaites sur le code de l'itération 5 (arbitrages de la session par délégation de Thomas) ; 3 nouvelles, contenu changé sur les 3 résultats du quiz et sur les encadrés « Version sans risque » (section « Itération 5 » ci-dessous). Interrupteur restauré, `git diff` vide, `STORYTELLING_PUBLIE` inchangé.

Run de l'itération 4 : **107 captures, 215 PASS, 0 FAIL**, toutes refaites sur le code de l'itération 4 (choix de Thomas « Go tout est ok pour moi! ») ; 9 nouvelles (section « Itération 4 » ci-dessous). Interrupteur restauré, `git diff` vide, `STORYTELLING_PUBLIE` inchangé. Textes contrôlés à jour : « Étape 3 · Le couloir : quinze secondes », « N XP gagnés sur 700, bonus de fin compris ».

Run précédent : **98 captures**, toutes refaites au run de l'itération 3 (les 85 de l'itération 2 remplacées, 13 nouvelles : arbitrages N2b, N4, S3, S6, S8 et §4 @ux, S1 à S4 @design). Remplacer `<w>` par 375 (mobile), 768 (tablette) ou 1280 (bureau). Contrôles du dernier run : **185 PASS, 0 FAIL** (dont les garde-fous B1 `[html <w>]` et « étape 1 complète » aux 3 largeurs, visiteur et Premium ; « Version sans risque » et « Aller au défi » sur les étapes 2 à 6 aux 3 largeurs), 98 captures ; interrupteur restauré, `git diff` vide.

Avant les captures, build avec l'interrupteur à `false` : tâche de démarrage complète (4 conseils mis à jour, 2 créés, 10 vannes neuves, 20 vannes en ligne conformes, parcours créé **inactif**, 6 étapes, 3 fiches vidéo corrigées), `/parcours/boulot` en **404**, hub, sitemap et `llms.txt` sans Boulot ; 2e démarrage : tâche sautée (idempotente).

**Ordre de la prod (itération 2, B1)** : le build à `true` est fait AVANT l'activation en base (comme au déploiement, où la tâche de démarrage active le parcours après le build). Le HTML pré-rendu est donc le **repli seed** (`seed-boulot`, journalisé par `captures.sh` et par le contrôle `[html <w>]`). Le contrôle `[html <w>]` lit ce HTML **JavaScript coupé** : l'étape 1 y a le conseil, l'exemple, le défi TRACE et « Alors, ce défi ? ». Dans les captures (JavaScript actif), le visiteur relit ensuite la base : d'où le lien « Lire la fiche du conseil ». Garde-fou : le script sort en erreur si l'étape 1 n'a pas ces blocs.

## Visiteur (non connecté)

| Fichier | Ce qu'il montre |
|---|---|
| `visiteur-<w>-hub-haut.png` | Hub `/parcours`, premier écran, build forcé à `true` : intro tirée des parcours publiés (0441569) « 5 parcours pour progresser en humour, chacun taillé pour une situation : Machine à Café, Répartie, Confiance, Storytelling et Boulot » (S8 @ux, contrôlé aux 3 largeurs), quiz d'orientation. |
| `visiteur-<w>-hub.png` | Hub complet, pleine page : les 5 cartes, Boulot en dernier, puis « Explore aussi », FAQ, pied de page. |
| `visiteur-<w>-hub-carte-boulot.png` | Carte Boulot seule : badge de niveau, 6 semaines, 15 min/semaine, 700 XP, accroche, persona Anouk (typographie française : « 6 semaines », « « Redis-moi », « à midi » insécables), « Programme » replié, bouton « Commencer ce parcours ». Icône 💼 retenue par @design. |
| `visiteur-<w>-hub-programme-boulot.png` | **Nouveau (B2 @design)** : la même carte, « Programme » déplié : 6 étapes (badge, titre, scène avec son saut de paragraphe, « Format : », XP), aucun débordement horizontal (contrôlé). |
| `visiteur-<w>-page-haut.png` | `/parcours/boulot`, premier écran : fil d'Ariane, titre, badge, « 6 semaines · 15 min/semaine », description, « Pour qui ? », témoignage, encart « Étape 1 offerte, étapes 2 à 6 avec Premium ». |
| `visiteur-<w>-page.png` | Page complète, pleine page. |
| `visiteur-<w>-etape1.png` | Étape 1 dépliée, en lecture libre : pourquoi, scène, **conseil, exemple (une ligne par paragraphe), défi TRACE (libellé en gras) et « Alors, ce défi ? »**, encart « 5 vannes… avec Premium », 2 vidéos, quiz 1/3, bouton « Voir l'offre Premium » en bas. |
| `visiteur-375-etape1-quiz-question-repondue.png` | **Nouveau (S6 @ux)** : question 1 répondue (mauvaise réponse choisie) : « Pas tout à fait. La bonne réponse : … » et l'explication complète, avant « Question suivante ». |
| `visiteur-375-etape1-quiz-repondu.png` | **Nouveau (N8 @ux)** : quiz de l'étape 1 répondu (résultat, « Refaire le quiz »), puis « Valider l'étape fait partie de Premium » et le bouton plein. |
| `visiteur-<w>-etape2-apercu.png` à `etape6-apercu.png` | Étapes 2 à 6 en aperçu : cadenas, XP, « Fait partie de Premium », scène au même corps que l'étape 1 (16 px, interligne 28 px), format, texte du verrou, bouton « Voir l'offre Premium ». Ni conseil, ni vannes, ni quiz. |
| `visiteur-<w>-fin-de-page.png` | Bas de page (fenêtre). |

## Premium

| Fichier | Compte | Ce qu'il montre |
|---|---|---|
| `premium-<w>-hub-haut.png`, `premium-<w>-hub.png`, `premium-<w>-hub-carte-boulot.png` | Premium neuf | Hub connecté, mêmes vues que le visiteur. |
| `premium-<w>-page-haut.png`, `premium-<w>-page.png` | Premium neuf | `/parcours/boulot` connecté, aucune étape commencée. |
| `premium-375-page-haut-progression.png`, `premium-1280-page-haut-progression.png` | 2 étapes validées | Premier écran avec progression 2/6, « 125 XP gagnés sur 700, bonus de fin compris » (itération 4 ; à gauche en 375, à droite en 1280), **lien « La prochaine étape t'attend. » avec « Étape 3 · Le couloir : quinze secondes » dessous, les 2 lignes en couleur de lien** (itération 3, N2b ; point médian et couleur : itération 4) ; l'argumentaire passe après le programme (N2 a @ux). |
| `premium-375-lien-etape-apres-clic.png` | 2 étapes validées | **Nouveau (itération 3)** : après le clic sur le lien d'étape, en-tête collant actif : étape 3 ouverte, calée à 112 px (sous la barre de 65 px), focus sur son en-tête (contrôlé). |
| `premium-375-erreur-chargement.png` | 3 étapes validées, API coupée | Alerte « Ta progression est intacte. », « Réessayer » ; itération 3 : plus de ligne d'XP dessous, plus de vide au-dessus. |
| `premium-375-erreur-chargement-page.png` | 3 étapes validées, API coupée | **Nouveau (S3 @ux)** : la même page en entier : étape 1 ouverte avec son contenu de repli ; ni « Voir l'offre Premium », ni « Lecture libre », ni ligne d'XP, ni « Le suivi de ta progression arrive bientôt » (itération 4, contrôlé). |
| `premium-<w>-etape1.png` | Premium neuf | Étape 1 complète (sans badge « Lecture libre », N3 @ux) : scène, conseil, exemple, défi TRACE, 5 vannes, 2 vidéos, quiz, validation. |
| `premium-375-etape2-ordre-conseille.png` | Premium neuf | Étape 2 verrouillée par l'ordre conseillé (« Termine l'étape 1 pour débloquer ») ; itération 3 : **un seul cadenas** (rond à gauche). |
| `premium-375-retour-exercice.png` | Premium neuf | **Nouveau (N8 @ux)** : « Essayé, ça a marché » choisi, réponse affichée dessous. |
| `premium-375-etape1-apres-validation.png`, `premium-1280-etape1-apres-validation.png` | Premium neuf | **Nouveau (N8 @ux)** : étape 1 validée, « +50 XP gagnés ! », prochaine étape conseillée. |
| `premium-<w>-etape2.png` à `etape6.png` | k-1 étapes validées | Étapes 2 à 6 dépliées : lien « Aller au défi » en tête (itération 3), défi en interligne 24 px, libellé « DÉFI X » en gras, puis l'encadré **« Version sans risque »** ; étape 6 : exemple chronométré en 4 paragraphes. |
| `premium-375-etape3-version-sans-risque.png`, `premium-1280-etape3-…`, `premium-375-etape6-…`, `premium-1280-etape6-…` | 2 ou 5 étapes validées | **Nouveau (itération 3, N4)** : section « Exercice pratique » seule : défi, puis encadré « Version sans risque » qui commence par « Pas de couloir aujourd'hui… » (étape 3) ou « Aucun pot en vue ? » (étape 6). |
| `premium-375-etape3-aller-au-defi.png` | 2 étapes validées | **Nouveau (itération 3, N4)** : fenêtre après le clic sur « Aller au défi », en-tête collant actif : « Exercice pratique » à 112 px du haut, sous la barre (contrôlé), ancre `#etape-3-defi`. |
| `premium-<w>-fin-parcours.png` | 6 étapes validées | Page en fin de parcours (fenêtre) : plus de barre « Parcours terminé ! » au-dessus de la carte de fin (N6 @ux). |
| `premium-<w>-fin-parcours-carte.png` | 6 étapes validées | Carte « Parcours Boulot terminé » : 700 XP bonus compris, les 6 acquis, « Passer au parcours Storytelling ». |
| `premium-375-fin-machine-a-cafe-boulot-publie.png`, `…-carte.png` | Machine à Café fini | **Nouveau (§4 @ux, réserve 2)** : Boulot publié (build forcé à `true`), la fin de Machine à Café propose **« Passer au parcours Boulot »** avec l'accroche de Boulot (contrôlé : `/parcours/boulot?src=suite`). |
| `premium-375-fin-storytelling-apres-machine-a-cafe.png`, `…-carte.png` | Machine à Café puis Storytelling finis | **Nouveau (§4 @ux, réserve 1)** : la fin de Storytelling propose **Répartie**, jamais Machine à Café déjà fini (contrôlé : `/parcours/repartie?src=suite`). |

## Itération 4 : nouvelles captures

| Fichier | Compte | Ce qu'il montre |
|---|---|---|
| `premium-375-carte-progression-0xp.png`, `premium-1280-…` | Premium neuf | Carte de progression avant toute étape : « 0 XP gagné sur 700, bonus de fin compris » (singulier, contrôlé aux 3 largeurs). |
| `premium-375-carte-progression-en-cours.png`, `premium-1280-…` | 2 étapes validées | « 125 XP gagnés sur 700, bonus de fin compris » ; lien « La prochaine étape t'attend. » puis « Étape 3 · Le couloir : quinze secondes », **les 2 lignes en couleur de lien** (contrôlé : même couleur calculée) ; marges haute / basse mesurées 26 / 28 px en 375, 26 / 26 px en 1280 (avant : environ 16 / 40). |
| `premium-375-carte-progression-erreur.png` | 3 étapes validées, API coupée | Carte en erreur : alerte « Ta progression est intacte. » et « Réessayer », sans ligne d'XP ; la page ne contient plus « arrive bientôt » (contrôlé). |
| `premium-375-etape2-version-sans-risque.png` | 1 étape validée | Section « Exercice pratique » de l'étape 2 : « DÉFI PS » dans son encadré, « Version sans risque » en pointillés neutres, titre en 12 px gris (13 px depuis l'itération 5), puis **« C'est gagné si ton PS tient en une phrase… » sous l'encadré** (critère commun). |
| `premium-375-etape6-version-sans-risque.png`, `premium-1280-…` (refaites) | 5 étapes validées | Même chose à l'étape 6 : repli « Aucun pot en vue ? … compte tes mots. », puis sous l'encadré « C'est réussi s'il fait entre 100 et 125 mots… » et « Rien à prononcer : … jusqu'au jour J. ». Étapes 3, 4, 5 : aucun 3e morceau (contrôlé aux 3 largeurs). |
| `visiteur-375-quiz-orientation-boulot-raconter.png`, `…-repondre.png`, `…-confiance.png` | Visiteur, build forcé à `true` | Quiz d'orientation : « Au boulot, en réunion, à la pause » puis chacune des 3 deuxièmes réponses : « Ton point de départ : Parcours Boulot », raison « Pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu. » (remplacée à l'itération 5, voir ci-dessous). Boulot masqué : voir `regression/quiz-orientation-375-boulot-masque-*.png`. |

Mesure « Aller au défi » (étapes 2 à 6, 3 largeurs) : 30 px entre le bas du texte du lien et « Pourquoi cette étape ? » (environ 40 px avant), cible de 44 px contrôlée.

## Itération 5 : nouvelles captures et captures dont le contenu change

| Fichier | Compte | Ce qu'il montre |
|---|---|---|
| `visiteur-375-quiz-orientation-q1-icone.png` | Visiteur, build forcé à `true` | **Nouveau (N-3 @design)** : question 1 du quiz, « Au boulot, en réunion, à la pause » avec l'icône **💼** (celle de la carte Boulot), les deux autres réponses inchangées (🎉, 🌱). Contrôlé : 💼, pas de ☕. Boulot masqué : `regression/quiz-375-boulot-masque-quiz-orientation-q1-icone.png` (☕). |
| `visiteur-375-quiz-orientation-q2-apres-boulot.png` | Visiteur, build forcé à `true` | **Nouveau (réserve §7 @ux)** : écran de la question 2 après « Au boulot » : « Question 2/2 », « Qu'est-ce qui coince le plus ? », les 3 réponses (📝 rien de drôle à raconter, ⚡ quoi répondre sur le moment, 💪 perdu confiance en moi), contrôlées. |
| `visiteur-375-quiz-orientation-boulot-raconter.png`, `…-repondre.png`, `…-confiance.png` (contenu changé) | Visiteur, build forcé à `true` | **S15 @ux** : « Parcours Boulot » et la raison **« Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. »**, identique pour les 3 deuxièmes réponses (contrôlé mot pour mot ; égale à la fin de la description validée de la fiche, contrôlé). |
| `premium-375-onboarding-tout-boulot-resultat.png` | Premium neuf (`qa-b375`) | **Nouveau (réserve §7 @ux)** : onboarding `/onboarding`, « Tout ça à la fois » + « Au boulot / machine à café » + « Parfois ça marche » : encart « Ton point de départ : Parcours Boulot », même raison que le quiz, bouton « Voir par où commencer ». Boulot masqué : `regression/onboarding-375-tout-boulot-masque-resultat.png` (Machine à Café). |
| `premium-375-etape3-aller-au-defi.png` (refaite) | 2 étapes validées | Fenêtre après le clic sur « Aller au défi » : « Exercice pratique » à 112 px du haut, sous l'en-tête collant de 65 px, ancre `#etape-3-defi` (contrôlé), défi entier puis l'encadré « Version sans risque » avec son titre en 13 px. |
| `premium-375-etape2-version-sans-risque.png`, `premium-<w>-etape6-version-sans-risque.png`, `premium-<w>-etape3-version-sans-risque.png` (contenu changé) | 1, 2 ou 5 étapes validées | **S16 @ux** : titre « Version sans risque » en **13 px** medium gris (12 avant), sous « DÉFI X » en 14 px semi-gras (mesuré aux 3 largeurs, étapes 2 à 6). **G @design** : étapes 2 et 6, critère « C'est gagné si… » / « C'est réussi s'il… » à **20 px** sous le repli, contre 12 px entre défi et repli (mesuré aux 3 largeurs), graisse normale (400). |

## Points à regarder (constat de la capture, non tranché)

1. Hub : la carte Boulot affiche **700 XP** (600 XP d'étapes + bonus de fin), cohérent avec la carte de fin.
2. Hub : le quiz d'orientation oriente vers Boulot sur « Au boulot… » une fois publié (N5 tranché par Thomas le 11/10, itération 4).
3. Étape 6 : « Environ 20 min » contre « 15 min/semaine » (N7 @ux) : gardé, choix de Thomas du 11/10.
4. Captures d'élément : découpées dans une capture pleine page (en 375, `element.screenshot()` laissait une bande noire en bas des éléments moins hauts que la fenêtre).
