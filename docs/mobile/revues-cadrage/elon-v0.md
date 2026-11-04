# Revue à l'aveugle du cadrage app native v0 (@elon, s23, 04/11/2026)

> AVIS CONSULTATIF : validation requise avant exécution. Objet relu : `docs/mobile/cadrage-app-native-s23.md`.
> Décision actée et non discutée ici : app iPhone native, Android ensuite (choix de Thomas). Cette revue challenge **comment la réussir**, pas le fait de la faire.
> Verdict fondé sur la valeur persona (commandement 5), jamais sur l'effort ou le ROI.
> Sources lues : `project-context.md`, `docs/founder-preferences.md`, `docs/strategy/personas.md`, `docs/mobile/revues-cadrage/donnees-gsc-2026-10.txt`, chiffres de la semaine du 26/10 au 01/11 fournis par la session, `apps/web/src/lib/champs-premium.ts`, `apps/web/prisma/schema.prisma` (catégories de vannes).

## 0. Verdict en une ligne

La partie technique et paiement est solide. La partie produit construit l'app autour du geste que **personne ne fait aujourd'hui** (le parcours) et relègue au second plan le geste que **tout le monde vient chercher** (une vanne prête à l'emploi). Inverser le centre de gravité, et le cadrage devient bon.

## 1. Notes

| Critère | Note /10 | Justification courte |
|---|---|---|
| Valeur persona | 5 | Le récit Yanis est juste sur le fond (pratiquer souvent, avant les moments), mais il ignore ce que les visiteurs mobiles cherchent réellement. Le décryptage (« Pourquoi ça marche », « À toi de jouer »), seul pont entre la vanne et l'apprentissage, est absent du cadrage. |
| Clarté du geste quotidien | 4 | Quatre « raisons d'ouvrir » de même poids = aucune. La « série de jours » repose sur un parcours au rythme hebdomadaire : elle restera à zéro six jours sur sept. |
| Centre de gravité du périmètre | 5 | V1 complète (bien, conforme au commandement 5), mais à plat : 10 écrans au même niveau. Le partage d'une vanne, moteur de bouche à oreille, n'est qu'une puce de l'écran Explorer. |
| Différenciation vs site | 6 | Les bons leviers sont listés (notification, widget, hors ligne, partage natif) mais rien n'est mesurable : aucun « 10× » chiffré en gestes ou en secondes. |
| Lien avec la conversion | 4 | L'écran d'offre est décrit (conforme Apple), les moments où l'envie de payer naît ne le sont pas. Les favoris, levier le plus naturel dans une app de poche, sont posés comme un écran, pas comme un déclencheur. |
| Hypothèses testables | 3 | H1 à H3 sans seuil, sans échantillon, sans date ; l'hypothèse fatale (« un visiteur du site installe l'app ») manque ; H3 est impossible à mesurer avec 4 abonnés ; le premier vrai utilisateur arrive au lot 12, après tout le reste. |
| **Globale** | **4,5** | Bonne fusée, mauvaise orbite. Le travail de fond (Apple, Stripe, jetons, hors ligne, risques de revue) est réutilisable tel quel ; la section 1 et l'ordre du plan sont à refaire. |

## 2. Constats (first principles)

### C1. Ce que les gens viennent chercher, d'après les données réelles
- **Mobile = 75 % des clics** (300 sur 398 en 28 jours, GSC). L'app vise donc le bon appareil.
- **Les requêtes sont des besoins de consommation immédiate**, pas d'apprentissage : « une vanne blague » (415 impressions), « blague humour noir 2026 » (383, 27 clics), « blague à mourir de rire 2026 » (236, 38 clics), « blague 2026 » (131, 20 clics), « blague halloween adulte » (109, 10 clics), « meilleur blague 2026 » (50, 16 clics). Les requêtes « apprendre » pèsent peu et ne cliquent pas : « comment devenir drôle » 34 impressions, 0 clic, position 21,9 ; « une répartie » 46, 0 clic ; « comment faire rire quelqu'un » 94, 0 clic.
- **Le comportement confirme** : semaine du 26/10 au 01/11, 205 visiteurs, 34 s en moyenne, 5 parcours ouverts, 1 quiz d'étape terminé, 0 inscription, 38 murs Premium vus, 1 clic vers le paiement, 4 abonnés actifs.
- **Conclusion physique** : le visiteur réel arrive avec le job de Sophie (« une blague courte, prête à ressortir mot pour mot ») et repart en 34 secondes. Le job de Yanis (« progresser en répartie ») est la promesse de la marque, pas la porte d'entrée.

### C2. La proposition de valeur du cadrage répond à la marque, pas à la demande
« Le site sert à trouver et à lire. L'app sert à pratiquer. » C'est vrai pour Yanis motivé, faux pour la majorité de ceux qui arriveront par le site (C1 : requêtes de blagues prêtes à l'emploi, 5 parcours ouverts sur 205 visiteurs). Le cadrage parie que l'app transformera des chercheurs de blagues en élèves. Aucun mécanisme ne fait ce pont. Or il existe déjà dans le produit : chaque vanne du catalogue porte un décryptage « Pourquoi ça marche » et un exercice « À toi de jouer » (`project-context.md`, contenu existant). **C'est le cheval de Troie** : on vient pour la vanne, on repart avec la technique. Cela respecte la doctrine de Thomas (« produit qui s'apprend », 06/05 : la vraie valeur est dans le décryptage, pas dans le catalogue) sans aller contre la demande.

### C3. Le geste quotidien n'est pas défini, il est listé
Une app quotidienne a **un** geste qui prend moins de 30 secondes. Le cadrage en propose quatre (vanne du jour, défi de parcours, carnet, catalogue). Trois d'entre eux ne sont pas quotidiens par nature : le parcours est hebdomadaire (15 à 20 min par semaine, choix du 29/09), le carnet est mensuel, le catalogue est une recherche ponctuelle. Seule la vanne du jour a le bon rythme. Elle est déjà en tête du tableau ; il faut en faire **le** centre, pas la première ligne d'une liste.

### C4. La série de jours est cassée par construction
La série « {n} jours de pratique d'affilée » compte la pratique (choix D3 du 07/10). Si la seule pratique reconnue est une étape de parcours, un utilisateur assidu fait une étape par semaine : sa série vaut 1 et retombe à 0 le lendemain. Une mécanique de série qui punit l'usage conseillé démotive au lieu de retenir. Il faut une pratique quotidienne de 30 secondes qui compte : l'« À toi de jouer » de la vanne du jour. C'est de la pratique au sens strict, donc cohérent avec D3.

### C5. Le partage est le seul moteur d'acquisition que l'app possède en propre, et il est enterré
Base installée de départ quasi nulle (le cadrage le dit : 2 abonnés de lancement, 12 comptes gratuits). Le site apporte environ 150 visiteurs mobiles par semaine [HYPOTHÈSE : 75 % de 205, en appliquant la part de clics GSC aux visiteurs Umami]. Les moments clés des personas sont des groupes (« chambrages dans le groupe WhatsApp » pour Yanis, afterwork pour Sophie). Une vanne envoyée dans un groupe en deux touches, sous forme de carte lisible avec la marque et un lien universel, est à la fois de la valeur (le persona brille) et de la distribution. Le cadrage la range dans « Explorer ».

### C6. L'App Store est un canal de recherche que le cadrage oublie
Le §1 liste les entrées : bannière du site, page `/app`, widget intégrable, bouche à oreille. Il manque la recherche dans l'App Store elle-même, alors que les requêtes Google montrent une demande massive sur « blague », « vanne », « humour noir », « blague 2026 ». Le choix du nom et du sous-titre (décision 9) est traité comme une question de cohérence de marque ; c'est d'abord une décision d'acquisition. [HYPOTHÈSE : la recherche « blague » existe aussi dans l'App Store France ; volume à mesurer avant de figer les métadonnées.]

### C7. Le plan teste tout à la fin
Lot 12 = premier TestFlight, après les lots 5 à 9. Autrement dit, on construit les 10 écrans, l'achat intégré, le widget et le push avant de savoir si une seule personne ouvre la notification deux jours de suite. Le lot 0 (compte Apple) est déjà le chemin critique : dès qu'il est fait, un build minimal peut partir en TestFlight pendant que le reste se construit en parallèle. On ne vole pas une fusée complète pour tester un moteur.

### C8. La conversion a déjà un mécanisme naturel dans le code, le cadrage ne l'exploite pas
Dans les listes, l'exercice « À toi de jouer » d'une vanne n'est envoyé qu'aux membres Premium (`apps/web/src/lib/champs-premium.ts`, appliqué par `/api/jokes`, `/api/tips`, `/api/videos`). `/api/daily` n'appelle pas cette fonction : l'exercice de la vanne du jour est donc vraisemblablement ouvert à tous [À VÉRIFIER par @fullstack]. Cela donne une conversion par la valeur, sans forcer : **chaque jour, l'utilisateur goûte gratuitement une vanne décryptée avec son exercice ; Premium, c'est le même plaisir sur tout le catalogue, quand il veut**. Deuxième moment naturel : vouloir **garder** une vanne pour samedi soir (favoris = Premium). Le désir de garder naît au moment exact où la vanne a fait rire. Aucun de ces deux moments n'est écrit dans le cadrage.

### C9. Ce qui dilue la V1
- **Vidéo du jour sur l'écran Aujourd'hui** : une vidéo de plusieurs minutes, dans le métro, n'est pas un geste de 30 secondes. Elle reste dans Explorer.
- **Quiz d'humour en écran autonome** : 1 quiz d'étape terminé dans la semaine sur le site. Sa vraie fonction est l'orientation vers un parcours : il vit dans l'onglet Parcours, pas dans la barre de navigation.
- **Conseil du jour sur Aujourd'hui** : utile, mais en second rang, sous la vanne et son exercice. L'écran a une action principale, pas trois cartes de même poids.
- Rien d'autre ne dilue : parcours, carnet, favoris, profil et widget servent tous la valeur Premium ou l'habitude. On garde la V1 complète, on change la hiérarchie.

### C10. Ce qui fonctionne, ne pas toucher
- §3 à §6 : Expo et builds de développement, authentification par jeton sans dupliquer les routes, plafonds appliqués côté API, hors ligne avec file idempotente, push via le service d'Expo, aucun SDK de pistage, RevenueCat, une seule source d'abonnement par compte, abonnés de lancement jamais migrés, suppression de compte dans l'app, risques de revue et parades.
- Notification = mise en place seulement, la chute se révèle dans l'app : excellent déclencheur de curiosité, déjà validé sur le site (« Révéler la chute »).
- Heure choisie par l'utilisateur, permission demandée après une première vanne, aucune promotion dans les notifications.
- Pas de compte gratuit, droits du visiteur identiques au site : cohérent avec les choix du 05/10.
- Plan par dépendances sans semaines, lot 0 lancé tout de suite.

## 3. Corrections OBLIGATOIRES (avant validation du cadrage)

**O1. Réécrire le §1 autour d'un seul geste quotidien.** Remplacer le tableau à quatre lignes par une phrase de valeur et un geste, par exemple : « Chaque jour, à l'heure que tu choisis, une vanne au niveau arrive sur ton téléphone ; tu révèles la chute, tu comprends pourquoi elle marche, tu fais ta version en 30 secondes, et tu peux l'envoyer à tes potes. » Les trois autres lignes (parcours, carnet, catalogue) passent en « ce qui fait rester et payer », pas en « raison d'ouvrir ». Libellé final à calibrer par @copywriter (étalons avec Thomas, P0 s8) ; ici on fixe le fond, pas le texte.

**O2. Ajouter au §1 un paragraphe « Ce que les gens cherchent » fondé sur les données réelles** (GSC 28 jours, semaine du 26/10 au 01/11, chiffres du §2 C1 de cette revue, sans arrondi flatteur), et en tirer explicitement : porte d'entrée = vanne prête à l'emploi ; valeur durable = décryptage et pratique ; persona d'entrée = Sophie, persona de progression = Yanis et Marc.

**O3. Définir la boucle du geste quotidien dans le §2 (écran Aujourd'hui), dans cet ordre et avec une seule action principale par étape** : (1) notification avec la mise en place ; (2) ouverture directe sur la vanne, chute à révéler ; (3) « Pourquoi ça marche » visible après la révélation ; (4) « À toi de jouer » de la vanne du jour, faisable en 30 secondes ; (5) partage et « Garder ». Le conseil du jour passe en dessous, la vidéo du jour quitte l'écran (reste dans Explorer). Critère d'acceptation : de l'appui sur la notification à la chute lue, un seul geste ; de la chute au partage, deux gestes au plus.

**O4. Redéfinir la série de jours dans le §2** : un jour compte si l'utilisateur fait l'« À toi de jouer » de la vanne du jour **ou** valide une étape, un défi ou un quiz de parcours. Révéler la chute seule ne compte pas (ce n'est pas de la pratique, cohérence avec D3). Format de l'exercice dans l'app : réponse écrite gardée sur l'appareil, jamais publiée ni envoyée (aucun contenu d'utilisateur, donc aucune modération ni risque de revue 1.2), ou case « je l'ai fait à voix haute ». Choix du format à trancher par @ux. Si Thomas considère que cela touche D3, le lui soumettre en une ligne plutôt que de le présumer.

**O5. Sortir le partage d'Explorer et en faire une fonctionnalité de premier rang** (§2 Fonctionnalités) : bouton de partage sur la vanne du jour et sur chaque fiche ; envoi d'une **carte image** (mise en place, chute, marque) plus d'un lien universel ; le lien ouvre l'app si elle est installée, sinon la fiche du site avec une bannière d'installation. Ajouter l'événement « vanne partagée » à l'entonnoir du §3.6. @design pour la carte, @fullstack pour le rendu (le site génère déjà des cartes pour les réseaux sociaux : `apps/web/src/lib/social/templates/`, réutilisation à vérifier).

**O6. Écrire au §2 les moments de conversion de l'app, et seulement ceux-là** : (a) « Garder » une vanne (favori) sans Premium ouvre l'écran d'offre avec la promesse « Premium ouvre tout Deviens Marrant » ; (b) la 11e vanne d'une liste ; (c) l'exercice d'une vanne hors vanne du jour ; (d) l'étape 2 d'un parcours ou la deuxième fiche du carnet. Interdits : écran d'offre avant la première chute révélée, écran d'offre au lancement, prix dans une notification, compte à rebours, « tu as atteint ta limite » (doctrine du 06/05). Faire vérifier par @fullstack que l'exercice de la vanne du jour reste ouvert à tous côté API (C8), sinon le geste quotidien est amputé pour 100 % des non-abonnés.

**O7. Ajouter l'hypothèse fatale H0 et chiffrer toutes les hypothèses** (§1, assumption map). H0 : « un visiteur mobile du site installe l'app ». Pour H0 à H3 : métrique exacte, mode de mesure, échantillon, date de lecture, seuil de poursuite et seuil d'alerte. Les seuils sont fixés par @data-analyst **avant** le premier TestFlight (le cadrage le dit déjà, mais sans échéance). Remplacer H3 (« la série augmente le passage à Premium », non mesurable avec 4 abonnés) par un indicateur avancé mesurable : part des installés qui font le geste quotidien au moins 4 jours sur 7 la deuxième semaine.

**O8. Avancer un premier TestFlight dans le §7** : nouveau lot « build 0 », dépendant seulement des lots 0 et 4 (partie jetons et `bootstrap`), contenant uniquement la boucle de O3 (vanne du jour, chute, décryptage, exercice, partage, notification à l'heure choisie, série). Il part en TestFlight dès qu'il tourne, pendant que les lots 6 à 9 continuent en parallèle. L'achat intégré n'est pas nécessaire pour ce build (pas besoin des contrats bancaires). Le lot 12 reste la recette complète avant soumission.

**O9. Ajouter la recherche App Store comme canal d'entrée** (§1 « Fait à garder en tête » et décision 9) : le nom, le sous-titre et les mots-clés sont choisis sur des données de recherche, pas seulement sur la marque. Point de départ obligatoire : les requêtes GSC réelles (« blague », « vanne », « humour noir », « blague 2026 », « autodérision »). @seo ou @growth mesure la demande dans l'App Store avant de figer les métadonnées ; « Deviens Marrant » reste le nom, la question porte sur le sous-titre et les mots-clés.

## 4. Corrections SOUHAITABLES

**S1. Premier lancement : supprimer l'écran de promesse.** La vanne du jour EST la promesse. Écran 1 : la vanne, chute à révéler. Écran 2 : heure de la vanne et permission de notification (texte de permission qui dit ce qu'on reçoit). Pas d'écran 3. Moins d'étapes avant la première valeur, c'est la seule optimisation d'onboarding qui compte.

**S2. Refus de la notification : proposer le widget en alternative**, une seule fois, avec un geste pour l'ajouter. Le widget porte la même mise en place que la notification ; c'est le même geste par un autre canal.

**S3. Widget : préciser le contenu.** Un widget d'écran d'accueil est vu par l'entourage. Recommandation : la sélection tout public déjà relue pour le widget intégrable (93 vannes, s22) quand la vanne du jour est d'une catégorie exclue (DATING, SOIREES, COUPLE). Vérifier que le stock couvre le calendrier [À VÉRIFIER : stock de vannes du jour par catégorie, `/api/health` indiquait 124 jours d'inédits au 18/10].

**S4. Navigation : 4 onglets au plus** (proposition : Aujourd'hui, Parcours, Explorer, Profil), le quiz d'humour dans Parcours (sa fonction est l'orientation), favoris et carnet accessibles depuis Explorer ou un onglet propre selon les maquettes. Arbitrage final à @ux.

**S5. Chiffrer le « 10× » dans le §1**, trois mesures que le site ne peut pas égaler : gestes de la notification à la chute lue (1), gestes de la chute au partage (2 au plus), vanne du jour et exercice lisibles sans réseau (toujours). Seuil de temps d'ouverture à fixer par @fullstack. Ce sont des critères d'acceptation, pas des slogans.

**S6. Explorer : collections calées sur la demande réelle.** Les thèmes les plus cherchés (« blague 2026 », « humour noir », « halloween adulte », « autodérision ») ne correspondent pas tous aux catégories de vannes en base (`JokeCategory` : pas de catégorie humour noir ni saisonnière). Proposer des collections éditoriales tirées du catalogue validé (saison en cours, meilleures de l'année, autodérision). L'humour noir est une décision de Thomas (contenu, questionnaire d'âge Apple, risque 1.1) : la lui soumettre, ne pas la présumer.

**S7. Notification : vérifier que la mise en place tient seule.** Certaines mises en place n'accrochent pas sans contexte. Ajouter au lot 3 un étalon du format de notification (mise en place seule, ou accroche courte préparée et relue à l'aveugle, jamais générée en direct, règle du 01/10).

**S8. Mesurer le geste sur le site avant de coder** : @data-analyst lit dans Umami, sur mobile, le taux de révélation de la chute de la vanne du jour et les partages, sur les quatre dernières semaines [À VÉRIFIER : quels événements existent]. Ordre de grandeur du geste avant même le build 0.

**S9. Test de H0 sans rien de faux** : dès que le build 0 passe la revue bêta d'Apple, un lien public TestFlight « Essayer l'app en avant-première » sur la page de la vanne du jour et sur `/app`, mobile seulement. On mesure les clics et les installations réelles ; aucune liste d'attente fictive.

**S10. Recruter les testeurs du build 0 dans l'existant** : inscrits à la lettre, 12 comptes gratuits, 4 abonnés, par un e-mail dédié en brouillon envoyé par Thomas (hors lettres approuvées, pour ne pas toucher à leur approbation). Au septième jour, trois questions dans l'app (qu'est-ce qui t'a fait ouvrir, qu'as-tu envoyé à quelqu'un, qu'est-ce qui manque). Viser un mélange des trois personas.

## 5. Hypothèses fragiles et tests TestFlight

| # | Hypothèse | Pourquoi elle est fragile | Test le plus tôt | Mesure (seuils fixés par @data-analyst avant le test) |
|---|---|---|---|---|
| H0 | Un visiteur mobile du site installe l'app | 205 visiteurs par semaine, 34 s de visite, 0 inscription : l'engagement actuel est faible | S9, lien public TestFlight après le build 0 | Clics vers TestFlight / visiteurs mobiles ; installations / clics |
| H1 | L'utilisateur active la notification après sa première vanne | Dépend de la qualité de cette vanne précise | Build 0, testeurs S10 | Part des installés qui acceptent la notification |
| H2 | La notification ramène chaque jour | Rien ne le montre aujourd'hui (le site n'a pas d'équivalent) | Build 0, deux semaines | Ouvertures depuis la notification par jour ; jours actifs sur 7, semaine 1 contre semaine 2 |
| H4 | L'exercice de 30 secondes est fait, pas sauté | 1 quiz d'étape terminé en une semaine sur le site : la pratique est rare | Build 0 | Part des chutes révélées suivies de l'exercice |
| H5 | Les gens envoient des vannes à leurs potes | Le partage par lien existe sur le site, son usage n'est pas connu | Build 0 + S8 | Partages par utilisateur actif ; installations venues d'un lien partagé |
| H6 | « Garder » déclenche l'envie de Premium | Les favoris Premium ne sont pas mesurés sur le site | Après le lot 7 (achat en bac à sable) | Écrans d'offre vus depuis « Garder » ; achats test |

H3 du cadrage est remplacée par l'indicateur avancé de O7. Règle de lecture : avec quelques dizaines de testeurs, on lit des comportements et des verbatims, pas des pourcentages ; aucune décision sur un écart de quelques points.

## 6. Vision 10x

L'app n'est pas « le site dans la poche ». C'est **la salle de sport de 30 secondes de l'humour** : une vanne au niveau Alexa chaque jour, comprise, refaite à sa façon, envoyée au bon groupe. Le site attire avec des blagues ; l'app transforme ce réflexe en entraînement quotidien, et l'entraînement quotidien rend le parcours désirable. Suite logique, hors V1 : alterner avec « la réplique du jour » (situation de chambrage, réplique, sortie polie) dès que les 90 situations prévues pour le widget sont validées à l'aveugle (choix du 24/10). C'est le geste exact de Yanis, au rythme d'une app.

## 7. Hypothèses de cette revue et zones non auditées

- [HYPOTHÈSE] ~150 visiteurs mobiles par semaine (part des clics GSC appliquée aux visiteurs Umami).
- [HYPOTHÈSE] La demande « blague » existe dans la recherche de l'App Store France ; non mesurée.
- [À VÉRIFIER] Exercice de la vanne du jour ouvert à tous côté `/api/daily` ; présence d'un décryptage sur chaque vanne du calendrier ; événements Umami existants.
- Non audité : faisabilité technique fine, règles Apple (déjà marquées `[À VÉRIFIER]` dans le cadrage), maquettes (inexistantes), données de rétention (aucune).

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/elon-v0.md`
- Avis : globale 4,5/10 (valeur 5, geste 4, centre de gravité 5, différenciation 6, conversion 4, hypothèses 3). Correction la plus importante : O1 + O3, un seul geste quotidien (vanne du jour, chute, pourquoi ça marche, ta version en 30 s, partage) au centre de la V1.
- À ré-invoquer : @product-manager (O1 à O9 dans le cadrage v1), @data-analyst (seuils de O7, S8), @fullstack (vérification C8), @ux (format de l'exercice O4, navigation S4), @seo ou @growth (O9).
- Points pour Thomas : définition de la série si jugée liée à D3 (O4) ; humour noir (S6) ; e-mail de recrutement des testeurs (S10).
- Rappel : ce sont des AVIS, pas des directives. L'utilisateur décide.
---
