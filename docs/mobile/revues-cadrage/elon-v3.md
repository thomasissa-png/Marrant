# Revue à l'aveugle du cadrage app native v3 (@elon, s23, tour 4, 04/11/2026)

> AVIS CONSULTATIF : validation requise avant exécution. Objet relu : `docs/mobile/cadrage-app-native-s23.md` (v3, 332 lignes).
> Décision actée et non discutée ici : app iPhone native, Android ensuite (choix de Thomas). Je challenge le comment.
> Verdict fondé sur la valeur persona (commandement 5). Revues v3 des autres relecteurs non lues.
> Sources : `project-context.md`, `docs/founder-preferences.md`, ma revue `elon-v2.md`, la grille `docs/mobile/attentes-utilisateur.md`. Deux contrôles dans le code : `apps/web/src/lib/progression.ts` (l. 8, 64, 71 : série en « jour civil de Paris ») et `apps/web/src/lib/ai/agents/joke-agent.ts` (l. 63, 243 : une vanne par exécution, sur une `plannedCategory`).

## 0. Verdict en une ligne

Les trois obligatoires v2 sont dans le texte, et bien : le défi de 30 s a une usine, le jour local est écrit, le chemin critique est juste. Il reste trois défauts, tous corrigeables par écrit sans attendre Thomas : (1) l'indicateur de stock que j'ai demandé devient muet à cause de la règle d'épuisement (il ne sonnera jamais) et le débit d'entrée a disparu ; (2) la série du compte Premium recrée le bug de minuit pour Yanis, juste après qu'il a payé ; (3) le « GO contenu » ajouté au build 0 y fait entrer 3b et 3c, donc le lot 1b.

## 1. Notes

| Critère | v0 | v1 | v2 | v3 | Justification courte |
|---|---|---|---|---|---|
| Valeur persona | 5 | 8 | 8,5 | **9** | Quatre vannes réelles, au niveau, copiées de la base. Le défi de 30 s a un format, un critère d'échec et une usine (§3.6). Les thèmes ont leur taille réelle et le vide est assumé (coloc, reprise de confiance). |
| Clarté du geste quotidien | 4 | 7,5 | 8,5 | **9** | Un seul modèle (`AssignationJour`), notification et icône sur le même identifiant, jour local avec bascule à 4 h pour tout le contenu, vanne retirée traitée. Le geste est spécifié de bout en bout. |
| Centre de gravité du périmètre | 5 | 7 | 8 | **8,5** | Le chemin critique est juste, C(a) part sans attendre, C(d0) et C(d1) sont séparés. Régression : le lot 7 dépend du « GO contenu » (§5.1), qui porte aussi sur 3b et 3c, donc sur 1b. Le build 0 attend l'offre, Parcours et Profil (NO6). |
| Différenciation vs site | 6 | 8 | 8,5 | **9** | La vanne assignée par thème, le défi de 30 s (absent du site), le hors ligne, Copier en 1 geste et le widget : aucun n'existe sur le site. |
| Lien avec la conversion | 4 | 7,5 | 8,5 | **8,5** | H6 défini, réserve et écran honnête au build 0, offre en lignes concrètes. Mais le premier jour Premium de Yanis peut casser sa série alors qu'il a pratiqué chaque nuit (NO5). |
| Hypothèses testables | 3 | 6,5 | 8 | **8,5** | Zone grise à J28, source des testeurs, H2 « amorce contre accroche » : fait. H-stock, la mesure qui protège le geste, ne peut pas déclencher d'alerte telle qu'elle est écrite, et le débit d'entrée n'est pas mesuré (NO4). |
| **Globale** | **4,5** | **7,5** | **8,5** | **8,5** | Le moteur et le tuyau sont bons. Le carburant n'a pas encore de jauge qui marche, ni de débit garanti par thème. Trois corrections écrites, aucune décision de Thomas nécessaire, et c'est 9. |

## 2. Statut des corrections v2 (vérifiées dans le corps du texte, pas dans le §16)

| Correction | Statut | Où dans le texte | Ce qui manque |
|---|---|---|---|
| **NO1** Lot C = chaîne de production du défi de 30 s | **Traitée** | §3.6 entier ; §1 étalon 3 ; §3.1 étape 4 ; §3.2 « Pool de l'app » (défi requis, pool vide sans lui) ; §3.3 (option C, la série est réécrite) ; H4 « si alerte » ; lots C(c), C(u), C(d0), C(e) ; lot 7 dépend de C(d0) ; 5b-0 dépend de C(u) ; décision 7 bis | Le rattrapage C(d0) est confié à « @copywriter, session principale » alors que §3.6 le fait passer par l'usine. Écriture à la main ou lot passé dans le pipeline ? À lever (SV5). |
| NO1, champ `defi30s` | **Traitée** | §3.6 « reco (B) champ distinct `defi30s` », site intact, consigne du site lisible dessous, même règle d'accès | Rien. |
| NO1, rattrapage des pools du build 0 | **Traitée** | §3.6 « Chaîne », C(d0) (93 + thèmes, relus à l'aveugle 2 sur 3) | Vu les tailles (93 + 69 avec recouvrement, pour 149 actives), C(d0) couvre presque tout le catalogue actif : C(d1) sera donc surtout de la production neuve. C'est cohérent, mais ça renforce NO4. |
| **NO2 (a)** Stock en jours avant la première répétition, par thème | **Traitée à la lettre, inopérante sur le fond** | §6 H-stock ; décision 7 | Avec la règle « thème épuisé : passer au tout public non vu » (§3.2), la première répétition arrive vers le 100e jour pour TOUS les thèmes (soirées : 9 jours de thème + 93 tout public, soit environ 102). L'alerte sous 60 ne sonne jamais, alors que Yanis n'a plus de vanne « soirées » au 27e jour. Le débit d'entrée validé par jour (demandé en v2) a disparu. Voir NO4. |
| NO2 (b) Épuisement d'un pool | **Traitée** | §3.2 « Thème épuisé », « jamais d'écran vide » | Rien, sauf son effet de bord sur la mesure (NO4). |
| NO2 (c) Mesures lancées sans attendre | **Traitée** | Lot C(a) « Dépend de : Rien » | Rien. |
| NO2 (d) Contenu du build 0 séparé de l'horizon | **Traitée** | C(d0) sert au lot 7, C(d1) au lot 13 | Rien. |
| NO2 (e) Chemin critique = étalons et réponses de Thomas | **Traitée** | §1 « Chemin critique » ; §13 « Tête de chaîne » ; « Les lots 3a et C(c) ne démarrent pas sans eux » | La décision 7 bis bloque C(u) : elle devrait être citée dans la tête de chaîne avec les étalons (une ligne). |
| **NO3** Jour local | **Traitée pour le contenu, rouverte pour la série du compte** | §3.2, tableau « trois horloges » ; §7 (`dernierEnvoiJour`, test de bascule à 4 h) ; §3.3 (idempotence par clé de jour local) | La série du compte garde le jour civil de Paris, avec bascule à minuit (`progression.ts:64-71`). Le bug nocturne revient pour tout abonné Premium, à Paris, et pas seulement « hors Europe » comme l'écrit le texte. Voir NO5. |
| SV1 Angle mort de Copier | **Traitée** | §3.1 « Angle mort assumé » ; H5 « portée non mesurable » ; build 0 sans nom d'app | Rien. |
| SV2 H6 et zone grise | **Traitée** | H6 avec ratio défini ; §6 « on garde et on relit à J28 » | Rien. |
| SV3 Source des 20 installés | **Traitée sur le principe** | §6 « Source des 20 installés », [À VÉRIFIER : taille] | La taille de la base se mesure aujourd'hui, en lecture seule, sans Thomas (SV7). |
| SV4 Accroche neutre et persona principal | **Traitée** | §3.2 (variante B d'abord sur SOIREES) ; H2 lu séparément | Les vannes réelles changent la reco, voir §3 et SV6. |

## 3. Ce que confirment les 4 vannes réelles du §2.1 et leurs « À toi de jouer » lus en base

1. **Le contenu existe et il est au niveau.** « Je suis devenu un endroit. », « Depuis, on se surveille. », « Ils m'ont laissé un avis Google : une étoile. » : courtes, à dire mot pour mot, sans contexte à expliquer. Le NO-GO du panel sur C3 portait sur des textes absents de la base. Le problème de l'app n'est pas la qualité de la vanne, c'est la quantité par thème et le format de l'exercice.
2. **Ma prédiction NO1 tient à 4 sur 4.** Les quatre « À toi de jouer » sont des consignes de fabrication (« Imagine une ruse d'évitement qui… », « montre comment quelqu'un t'a rangé dans une catégorie… ») : deux à cinq minutes d'écriture, pas 30 s dans le RER. Le champ distinct est justifié par les faits, pas par une intuition. La mesure « part faisable en 30 s » du lot C(a) ne conditionne plus rien : elle peut rester, mais elle ne doit retarder personne.
3. **Un actif caché.** Chaque consigne se termine par un exemple qui est déjà une mini-vanne utilisable (« Je suis un service. »). C'est de la matière pour l'étalon 3 : un type de défi « adapte l'exemple à ta vie en une phrase » ou « choisis entre la chute et l'exemple » coûte zéro production. C'est un format à soumettre à Thomas, je n'invente aucun texte (SV8).
4. **Le filtre de l'écran verrouillé exclut par catégorie, pas par contenu.** C (vaisselle en soirée) et D (« Antoine bar ») sont hors des 93 uniquement parce qu'elles sont SOIREES et DATING. Les deux sont inoffensives sur un écran verrouillé. L'accroche neutre presque quotidienne de Yanis vient donc d'une règle, pas d'un risque réel. Ça fait de la variante B la bonne reco, plutôt qu'une alternative (décision de Thomas, SV6 ; le [CHOIX UTILISATEUR] du 24/10 sur le widget intégrable n'est pas touché, la liste de l'app est distincte).
5. **« Pourquoi ça marche » est bon mais écrit comme une explication de texte** (« un « devenu » presque philosophique », « Le verbe « essuyer » est parfait »). C'est juste pour Marc et limite pour Yanis. Le cadrage renvoie le sujet à l'étalon 3, et c'est le bon endroit.
6. **Défaut de données** : B et D commencent par « À toi de jouer : » dans le champ lui-même. Le cadrage le traite au lot 3 pour l'app. [À VÉRIFIER : le site affiche-t-il le libellé en double sur ces fiches ?] Si oui, c'est un défaut en ligne, sans lien avec l'app (SV9).
7. **Les 149 actives sur 869 en base** confirment que le stock est la contrainte. Les 720 inactives sont une matière première : corrigées, puis relues à l'aveugle (règle d'or P0 s18), elles peuvent alimenter SOIREES et ECOLE plus vite qu'une génération neuve (NO4).

## 4. Ce qui fonctionne, ne pas toucher

- §3.2 `AssignationJour` figée, la contrainte unique qui départage les calculs concurrents, la vanne retirée réécrite une seule fois. C'est le meilleur passage du document.
- §3.2, tableau « trois horloges » : la réconciliation est écrite au lieu d'être cachée. Il faut juste corriger une ligne (NO5).
- §3.6 « Échec : pas de `defi30s` validé = la vanne n'entre pas dans le pool » : jamais de défi vide, jamais de génération en direct. Qualité d'abord, appliquée mécaniquement.
- §5.1 : proposer de juger le contenu sur du contenu, pas sur un cadrage. C'est honnête, et le risque est écrit (« un GO du cadrage ne vaut pas GO du contenu »).
- §2.1 : textes copiés de la base, identifiants donnés, A et B de la v2 retirés parce qu'absents. C'est de la rigueur, pas de la cosmétique.

## 5. Corrections OBLIGATOIRES (v3 vers v4) : ce qui bloque le 9/10

Aucune ne dépend d'une réponse de Thomas pour être ÉCRITE. Les choix de valeurs restent les siens (voir §7).

**NO4. Rendre H-stock capable de sonner, et lui donner un débit** (§6 H-stock, §3.2, décision 7, lots C(a), C(u), C(d1)). La plus importante.
- **Le bug de mesure** : « jours avant la première répétition » intègre le repli sur le tout public. Soirées : 9 jours de thème sur 27 jours, puis tout public, et la première répétition tombe vers le 102e jour. Même calcul pour chaque thème : tous dépassent 60, donc l'alerte ne sonne jamais et l'horizon de la décision 7 (« sortie + 90 jours ») est atteint sans produire une seule vanne. Le texte du §6 affiche « soirées 9, vie étudiante 5 » dans la colonne d'alerte : ce sont des tailles de pool, pas des jours. La colonne contredit sa propre mesure.
- **Fix, deux indicateurs** : (1) **jours de thème avant épuisement** = jours pendant lesquels une installation créée à la sortie reçoit son thème au rythme prévu (sous 60 vannes : 3 × pool utile avec `defi30s` validé). Aujourd'hui, avant validation et recouvrement : soirées 27, vie étudiante 15, couple et dates 78, boulot 87, et Yanis avec « soirées + vie étudiante » 42 [calcul sur les tailles du §3.2, À VÉRIFIER après C(d0)]. C'est cet indicateur qui porte l'alerte sous 60 et l'horizon de la décision 7. (2) Jours avant la première répétition, conservé comme garde-fou anti-répétition.
- **Le débit, absent de la v3** : le stock est une photo, le débit est le film. Le joke-agent produit une vanne par exécution sur une `plannedCategory` (`joke-agent.ts:63, 243`). Si la rotation est à peu près uniforme sur 14 catégories, SOIREES reçoit environ une vanne toutes les deux semaines [HYPOTHÈSE : règle de planification non lue]. Il en faut une tous les 3 jours pour tenir la règle de mélange. Il manque un facteur d'environ 5. À écrire : (a) C(a) mesure le **débit validé par catégorie** sur les 90 derniers jours (dates de création et d'activation en base) ; (b) C(u) **pilote `plannedCategory` par le déficit** (le thème qui a le moins de jours avant épuisement passe en premier) et peut monter à plusieurs vannes par jour, chaque vanne gardant validation Director puis relecture à l'aveugle (qualité inchangée, seul le débit monte : commandement 5) ; (c) C(d1) commence par **SOIREES et ECOLE** (persona principal), et la première matière est l'inactif de ces catégories (corriger, puis relire à l'aveugle, règle d'or), la génération neuve venant ensuite.
- **Critère binaire** : avant le lot 8 (premiers testeurs externes), chaque thème proposé affiche au moins N jours de thème avant épuisement, N étant l'horizon de la décision 7. Sinon le thème n'est pas proposé à l'écran 2 (c'est l'alternative D de la décision 5, appliquée thème par thème au lieu de tout ou rien).

**NO5. Série du compte : supprimer le bug de minuit pour les abonnés à Paris** (§3.2 « trois horloges », §3.3, §7).
- **Le cas, en heure de Paris** : Yanis Premium pratique la vanne du lundi lundi à 22 h, puis celle du mardi mercredi à 0 h 30 (jour de l'app : mardi, bascule à 4 h). Jours civils de Paris : lundi, puis mercredi. `nextStreak` voit un trou le mardi et la série casse, alors que l'app lui montre deux jours d'affilée faits. Après la fusion, c'est pareil dans l'autre sens : dernière pratique mercredi à 1 h 30 (jour de l'app : mardi), puis mercredi à 22 h (jour de l'app : mercredi) donne le même jour de Paris, et la série reste bloquée. Le persona principal, dans sa plage horaire réelle, au moment où il vient de payer. Le texte limite l'écart au « hors Europe » : c'est faux.
- **Fix (reco)** : une seule horloge pour la colonne, **jour de Paris avec bascule à 4 h** dans `nextStreak` (site et app). Pour un utilisateur à Paris, c'est exactement le jour local de l'app : les deux séries coïncident et l'objection de @fullstack (deux horloges sur une colonne) ne s'applique plus. Effet sur le site : une pratique entre minuit et 4 h compte pour la veille, ce qui est plus tolérant et ne retire rien. C'est un changement côté site, donc `REPLIT_ACTIONS.md` et go de Thomas (§12). Alternative : la route `pratique` de l'app transmet la clé de jour local déjà stockée et la série du compte avance sur cette clé (deux sources, plus fragile). Dans les deux cas, ajouter le test Jest « pratique à 22 h puis à 0 h 30 le surlendemain civil = +1 ».

**NO6. Séparer le GO contenu du build 0 de celui de la sortie** (§5.1, §13 lot 7).
- Le lot 7 dépend du « GO contenu du panel (§5.1) », et §5.1 fait porter ce GO sur 3a, 3b ET 3c. Or 3b et 3c dépendent de 1b (offre, Parcours, Explorer, Profil, états de session). Le build 0, censé ne dépendre que du geste (§13, ligne de tête), attend donc l'offre et Profil. C'est la N2 de la v1, revenue par la petite porte.
- **Fix** : GO contenu-0 = 5 vannes tirées en base avec leur défi + textes 3a (C3, C6, C7, C8 sur le geste), dépendance du lot 7. GO contenu-1 = 3b et 3c, dépendance des lots 10 et 13. Ajouter aussi la décision 7 bis à la tête de chaîne (§1, §13), puisque C(u) l'attend.

## 6. Corrections SOUHAITABLES

**SV5. Le rattrapage passe par l'usine, pas à la main.** C(d0) dit « @copywriter, session principale ». Reco : C(d0) = l'usine C(u) lancée en lot sur les vannes existantes (même prompt, mêmes critères, relecture à l'aveugle 2 sur 3) ; @copywriter ne reprend que les refus. Écrire environ 150 défis à la main, c'est réécrire la chaîne qu'on vient de concevoir, et c'est la recette pour que les vannes rattrapées ne ressemblent pas aux vannes produites ensuite.

**SV6. Passer la variante B en reco de la décision 5** (décision de Thomas). Fait nouveau : les deux vannes de situation lues en base (C, D) sont inoffensives sur un écran verrouillé, leur exclusion vient de la catégorie. Une relecture à l'aveugle « écran verrouillé » des 9 SOIREES (puis DATING, COUPLE), sur une liste propre à l'app, rend l'amorce au persona principal. Coût : une passe de relecture. Gain : la notification de Yanis retrouve son crochet.

**SV7. Mesurer maintenant la base de recrutement.** Comptes, inscrits à la lettre mensuelle et abonnés se comptent en lecture seule, sans Thomas, comme les mesures du 04/11. Si le total est de quelques dizaines (13 comptes au 05/10 d'après le constat 10 de la grille), H1, H3' et H7 à 20 installés ne seront pas atteints en 14 jours : il vaut mieux l'écrire avant, et prévoir le relais des 3 comptes sociaux (lancés le 06/10) dans S9, plutôt que de découvrir la règle J14 en cours de test.

**SV8. Ajouter un type de défi à soumettre à l'étalon 3** : partir de l'exemple qui termine chaque « À toi de jouer » (déjà validé, déjà en base). Format seulement, à caler avec Thomas (P0 s8).

**SV9. Vérifier le doublon « À toi de jouer : » sur le site** (fiches B et D). Si le libellé s'affiche deux fois en ligne, c'est un défaut du site à corriger maintenant, indépendamment de l'app (retrait d'un préfixe, pas de changement de contenu ; `REPLIT_ACTIONS.md`).

## 7. Ce qui bloque le 9/10, et ce qui dépend de Thomas

| Bloque le 9 (écriture du PM, aucune réponse de Thomas requise) | Dépend d'une décision de Thomas (ne bloque pas la note du cadrage) |
|---|---|
| NO4 : indicateur « jours de thème avant épuisement », débit par catégorie mesuré, usine pilotée par le déficit, critère binaire avant le lot 8 | Valeur de l'horizon (décision 7 : 60, 90 ou 180 jours de thème) et thèmes proposés si le seuil n'est pas atteint |
| NO5 : le cas nocturne écrit, une reco d'horloge unique, le test Jest | Accepter la bascule à 4 h sur la série du site (changement côté site, §12) ou retenir l'alternative |
| NO6 : GO contenu-0 et GO contenu-1, décision 7 bis en tête de chaîne | Décision 8 bis (méthode du panel), décision 7 bis (format du défi, B recommandé), décision 5 (variante B en reco, SV6), décision 4 (série du visiteur) |
| | Les 5 réponses du §1 et les étalons : condition de conformité à SA grille, pas de la qualité du plan |

## 8. Hypothèses de cette revue et zones non auditées

- [HYPOTHÈSE] Rotation de `plannedCategory` à peu près uniforme (planificateur non lu) : le facteur d'environ 5 de NO4 en dépend. C(a) le mesure.
- [À VÉRIFIER] Recouvrement BOULOT et tout public (chiffres de jours de thème calculés sans recouvrement) ; part des 720 inactives récupérable par catégorie ; taille de la base de testeurs ; affichage du doublon sur le site.
- [HYPOTHÈSE] Bascule à 4 h (reprise du cadrage, à caler par @ux).
- Non audité : faisabilité fine, règles Apple et juridique (revues @fullstack et @legal), maquettes inexistantes, §7 à §11 lus sans contre-vérification.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/elon-v3.md`
- Avis : globale 8,5/10 (valeur 9, geste 9, centre de gravité 8,5, différenciation 9, conversion 8,5, hypothèses 8,5). NO1, NO2 (b) à (e), SV1, SV2, SV4 traitées ; NO2 (a) traitée à la lettre mais inopérante ; NO3 traitée pour le contenu, rouverte pour la série du compte ; SV3 traitée sur le principe.
- Obligatoires : NO4 (H-stock qui sonne + débit, la plus importante), NO5 (série Premium nocturne), NO6 (GO contenu du build 0 séparé). Souhaitables : SV5 à SV9.
- À ré-invoquer : @product-manager (v4, trois corrections écrites), @data-analyst (débit par catégorie, base de testeurs), @ia et @fullstack (pilotage de `plannedCategory`, horloge de `nextStreak`).
- Points pour Thomas : décisions 7 (horizon en jours de thème), 7 bis, 8 bis, 5 (variante B), bascule à 4 h de la série du site.
- Rappel : ce sont des AVIS, pas des directives. L'utilisateur décide.
---
