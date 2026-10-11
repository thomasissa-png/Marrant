# Rendu Parcours Boulot, itération 1 : relecture @ux (s19, 11/10/2026)

**Note : 7/10. Bloquants : 1. Non bloquants : 8** (dont 3 à faire avant l'itération 2, voir tableau final).
Verdict : NO-GO tant que le bloquant B1 n'est pas levé. Hors B1, le rendu vaudrait 8,5/10.

Périmètre : 75 captures `docs/qa/captures-parcours-boulot-s19/` (lues : 375 en entier, 768 et 1280 sur étape 1, fin de parcours, page haut, hub), index, code de `apps/web/src/components/parcours/` (lecture seule), comparaison de structure avec s18. Aucun texte validé (conseils, défis, vannes, scènes, quiz) n'est touché ici. Limite de lecture : les captures pleine hauteur à 375 (5 400 à 6 800 px) sont réduites à la lecture, je n'ai pu lire le détail que des captures d'élément courtes et des étapes 1 en 768 et 1280 ; les étapes 2 à 6 Premium ont été jugées sur leur structure et sur le code.

## Grille de la note

| Critère du fondateur | Verdict | Preuve |
|---|---|---|
| Le visiteur comprend en une seconde, lit l'étape 1 sans friction | PARTIEL | Titre, badge, promesse lisibles dès le premier écran (`visiteur-375-page-haut`). Mais l'étape 1 visiteur est amputée (B1), et la durée manque en haut de page (N1). |
| Passage vers Premium clair sans agressivité | OK | Encart neutre « Étape 1 offerte, étapes 2 à 6 avec Premium », un seul bouton par étape ouverte, prix et « sans engagement » sous chaque bouton, bouton en contour tant que le quiz n'est pas fini. |
| L'abonné voit où il en est et quoi faire aujourd'hui | PARTIEL | Barre « 0/6 », total d'XP, rythme conseillé après validation. Mais le pitch passe avant le programme et rien ne dit « aujourd'hui : étape N » (N2). |
| Durée affichée crédible | PARTIEL | « 15 min/semaine » sur le hub, « Environ 15 min, hors vidéos » dans l'étape, mais absente de l'en-tête de page et étape 6 à 20 min (N1, N7). |
| Exercice et version sans risque visibles | NON pour le visiteur (B1), PARTIEL pour l'abonné | Abonné : défi présent mais version sans risque noyée dans le bloc (N4). |
| Retour d'exercice et quiz faciles | OK sur ce qui est capturé | Trois boutons empilés de 44 px en 375, quiz à 4 réponses de 44 px. États après clic non capturés (N8). |
| Fin de parcours donne une suite | OK | `premium-375-fin-parcours-carte` : bilan des 6 acquis, 700 XP, bouton « Passer au parcours Storytelling » plein largeur, aucune impasse. |
| Aucun texte coupé, aucun bouton masqué en 375 | OK | Aucun débordement relevé sur les 25 captures 375 ; boutons « Voir l'offre Premium » visibles sur les aperçus 2 à 6. |

## Corrections

### BLOQUANT

**B1. L'étape 1 du visiteur n'affiche ni conseil, ni exemple, ni défi, ni version sans risque, ni retour d'exercice.**
- Captures : `visiteur-375-etape1`, `visiteur-768-etape1`, `visiteur-1280-etape1`, `visiteur-375-page`. Après « Environ 15 min, hors vidéos », on passe directement à « Vannes à pratiquer » puis aux vidéos et au quiz. Le Premium (`premium-375-etape1`, `premium-1280-etape1`) a bien « Le conseil », « Exemple concret », « Exercice pratique » et « Alors, ce défi ? ».
- Écart avec l'index : l'index annonce pour le visiteur « conseil, exemple, défi TRACE et retour d'exercice ». Les captures ne les montrent pas. L'index est à corriger ou la capture est fausse ; la capture fait foi.
- Pourquoi c'est bloquant : le visiteur lit « Format : un conseil, un défi… » puis ne voit ni l'un ni l'autre, le quiz lui demande quelle phrase « suit le conseil » alors qu'il ne l'a jamais lu, et la promesse de la page (« chaque exercice a une version sans risque ») est invérifiable. C'est la seule étape que le visiteur lit avant de payer.
- Cause probable [HYPOTHÈSE à vérifier] : la page ISR du visiteur est rendue sur le repli seed. Dans `apps/web/src/lib/parcours-data.ts`, `buildPathFromSeed` met `tip.content = moduleDetail`, `example = ""`, `exercise = ""`. Dans `apps/web/src/components/parcours/parcours-step-card.tsx`, le conseil est alors masqué par la règle T28 (l. 300), et l'exemple (l. 311) et l'exercice (l. 317) ne s'affichent pas. `findActivePath` ne lit que les parcours `isActive: true` : si le prérendu passe avant que la tâche de démarrage n'active le parcours (`parcours-boulot-sync.ts`), la page est figée sur le seed pour `revalidate = 3600`. Le même ordre build puis démarrage vaudra en production : le risque est réel à la mise en ligne, pas seulement dans l'instance locale.
- Corrections :
  1. `apps/web/src/components/parcours/parcours-detail.tsx` l. 164-167 : le visiteur ne rappelle jamais l'API (`if (status !== "authenticated") return;`). Faire aussi l'appel à `/api/parcours/by-slug/<slug>` quand `initialPath.id.startsWith("seed-")`, quel que soit le statut. L'API relit la base et sert l'étape 1 complète à tous.
  2. `apps/web/src/lib/parcours-boulot-sync.ts` : après avoir aligné `isActive`, appeler `revalidatePath("/parcours/boulot")` et `revalidatePath("/parcours")`, ou ajouter à `REPLIT_ACTIONS.md` une étape « purger le cache ISR de /parcours/boulot après le démarrage ».
  3. Garde-fou de capture : `scripts/qa-parcours-boulot-s19/captures.js` doit échouer si la page visiteur n'a pas « Exercice pratique » dans l'étape 1 (le « 114 PASS, 0 FAIL » a laissé passer ce défaut).
  4. Preuve attendue en itération 2 : captures visiteur 375, 768 et 1280 de l'étape 1 avec conseil, exemple, défi, version sans risque, « Alors, ce défi ? ».

### NON BLOQUANTS

**N1. La durée est absente de l'en-tête de la page (important pour une lectrice qui fuit les contenus longs).**
- Captures : `visiteur-375-page-haut`, `premium-375-page-haut`, `visiteur-1280-page-haut` : « 6 semaines » seul, alors que la carte du hub (`visiteur-375-hub-carte-boulot`) affiche « 15 min/semaine · 700 XP ». Une visiteuse arrivée de Google (la meta description promet « 15 min/semaine ») ne revoit pas la promesse avant l'étape 1.
- Correction : `parcours-detail.tsx` l. 518, afficher `path.duration` puis `path.timePerWeek` (déjà dans `PathData`), séparés par un point médian. Composant partagé : le gain vaut pour les 5 parcours ; si on veut figer le rendu validé de s18, conditionner à `slug === "boulot"`.

**N2. Abonné : le pitch passe avant le programme, et rien ne dit « aujourd'hui, étape N ».**
- Captures : `premium-375-page-haut` (le premier écran est entièrement l'argumentaire, la carte de progression est coupée en bas de l'écran), `premium-1280-page-haut` (l'étape 1 commence à 720 px).
- Pour une abonnée qui revient à l'étape 4, elle repasse sur description, « Pour qui ? » et scène d'Anouk à chaque visite. Le code ne replie l'argumentaire qu'à la fin du parcours (`parcours-detail.tsx` l. 522 et 609-622).
- Correction : (a) pour `isPremium` avec au moins une étape validée, afficher l'argumentaire après le programme, sur le modèle de `isPathCompleted` ; (b) dans la carte de progression (l. 528-598), ajouter une ligne d'action vers `#etape-N` de la première étape non validée (ancre déjà gérée l. 216-226). Le libellé de cette ligne est du microcopy neuf : à faire valider (étalon) avant code.

**N3. Le badge « Lecture libre » s'affiche aussi à l'abonné.**
- Captures : `premium-375-etape1`, `premium-1280-etape1` (badge à côté de « +50 XP »). Pour un abonné, l'étape 1 n'est pas « libre », c'est du bruit.
- Correction : `parcours-step-card.tsx` l. 180, ajouter `!isPremium &&` devant le badge `ETAPE_LIBRE_BADGE`.

**N4. Abonné : la version sans risque est noyée dans le bloc du défi, et le défi arrive après 2 écrans de lecture en 375.**
- Captures : `premium-1280-etape1` (« Pas de réunion en vue, ou elle se passe en visio ? Fais-le sur… » au milieu d'un bloc de 10 lignes), `premium-375-etape1`, `premium-375-etape6` (le défi arrive après scène, conseil et exemple, soit plus de 2 écrans).
- Le critère du fondateur demande que l'exercice et sa version sans risque soient visibles. Aujourd'hui le texte l'est, la fonction non.
- Correction (affichage seul, texte intact) : dans `StepContent` (`parcours-step-card.tsx` l. 317-338), pour `slug === "boulot"`, couper le défi à la première phrase qui commence par « Pas d… » et finit par « ? » (motif constant sur les étapes 1 à 4 du JSON), puis afficher la suite dans un second encadré titré « Version sans risque » (le mot vient de la description validée du parcours). Si le motif ne se retrouve pas, ne pas couper. Ajouter en tête d'étape un lien d'ancre « Aller au défi » vers `#etape-N-defi` (libellé neuf à valider).

**N5. Hub : le quiz d'orientation n'envoie jamais vers Boulot, et la carte Boulot est la dernière des cinq.**
- Captures : `visiteur-375-hub-haut` (première réponse « Au boulot, en réunion, à la pause »), `visiteur-375-hub`. Sophie (la persona) répond « Au boulot » et reçoit « Machine à Café » (`apps/web/src/lib/parcours-orientation.ts`, signal `work` ignoré). Le choix est consigné comme décision d'implémentation (`implementation.md` §1), pas comme `[CHOIX UTILISATEUR]` : je le signale pour décision de Thomas, sans le trancher.
- Correction proposée si Thomas la valide : quand `BOULOT_PUBLIE`, `recommendParcours` renvoie Boulot pour le signal `work` sans difficulté nommée ; ou, sans toucher au quiz, un badge « Nouveau » sur la carte Boulot dans `parcours-content.tsx`.

**N6. Écran de fin : barre pleine et carte de fin disent la même chose.**
- Captures : `premium-768-fin-parcours`, `premium-375-fin-parcours` (« Parcours terminé ! » sur une barre à 100 %, puis la carte « Parcours Boulot terminé »). Redondance sans gravité ; la carte de fin suffit.
- Correction : `parcours-detail.tsx` l. 526-600, ne pas afficher la carte de progression quand `isPathCompleted`. À regrouper avec N2.

**N7. Durée : l'étape 6 annonce « Environ 20 min » alors que le parcours promet « 15 min/semaine » (signalement, pas de réécriture).**
- Captures : `premium-375-etape6` (ligne de durée). Le texte vient du `dureeTexte` validé de l'étape 6. Le hub dit déjà « Compte 15 à 20 min/semaine ». Le défaut est un décalage entre deux textes validés ; à arbitrer par Thomas (par exemple « 15 à 20 min/semaine » sur la carte et l'en-tête de Boulot seulement). Aucune correction de code sans cet arbitrage.

**N8. Captures manquantes pour tenir le 10/10 (comparaison avec s18).**
- s18 contenait `premium-375-etape1-apres-validation` et `premium-375-retour-exercice` ; s19 n'a ni l'un ni l'autre. Je ne peux donc pas noter : le gain d'XP et la date conseillée après validation, l'état d'un bouton de retour d'exercice choisi et sa réponse, le quiz visiteur répondu (résultat, « Refaire le quiz »), une étape verrouillée par l'ordre conseillé, l'erreur de chargement abonné, et la page haute Premium avec progression (2/6, « prochaine étape conseillée le… »).
- Correction : ajouter ces 6 captures en 375 à `captures.sh` pour l'itération 2.

## Points solides à ne pas casser

- Aperçus 2 à 6 (`visiteur-375-etape2-apercu` à `etape6-apercu`) : scène, format, un seul bouton plein, prix en dessous, aucune impasse ; cohérents entre eux.
- Étape 1 visiteur : mur de validation discret (bouton en contour tant que le quiz n'est pas fini, un seul bouton plein à l'écran).
- Fin de parcours : bilan, XP bonus compris, suite dynamique, bouton plein largeur en 375.
- 768 et 1280 : colonne de lecture unique de 768 px max, vidéos en grille 2 colonnes, aucune rupture de mise en page entre les trois largeurs.

## Ordre de reprise pour l'itération 2

| Priorité | Correction | Fichier |
|---|---|---|
| 1 | B1 (levée du repli seed pour le visiteur, purge ISR, garde-fou de capture) | `parcours-detail.tsx`, `parcours-boulot-sync.ts`, `captures.js` |
| 2 | N1, N3, N6 (rapides, sans microcopy neuf) | `parcours-detail.tsx`, `parcours-step-card.tsx` |
| 3 | N2, N4 (microcopy neuf à valider avant code) | idem + `config/textes/parcours.ts` |
| 4 | N8 (captures) | `captures.sh` |
| Décision Thomas | N5, N7 | `parcours-orientation.ts`, textes |
