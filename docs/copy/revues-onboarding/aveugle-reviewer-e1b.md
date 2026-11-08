# Relecture à l'aveugle @reviewer : E1b (J12, « pose-nous ta question »), 08/11/2026

Texte relu : section « E1b : J12, pose-nous ta question » de `docs/copy/onboarding-premium-s23-emails.md` (l. 229-285). E0, E1, E2 sont approuvés : servis uniquement à vérifier qu'E1b ne les redit pas. Fichier relu non modifié.

**Note : 8/10. NO-GO (barre 9/10).** Le fond est juste et vérifié. Trois défauts bloquent : l'objet et la première ligne posent deux fois la même question, l'encadré est introuvable sur mobile avec « sur ton profil » seul, et l'e-mail n'a pas de condition d'envoi si le service est fermé. Avec les corrections O1 à O4 ci-dessous, appliquées mot pour mot, la note visée est 9/10. Le texte corrigé repasse quand même en relecture à l'aveugle (P0 s18).

## Grille

| # | Critère | Note | Évidence |
|---|---|---|---|
| 1 | Demande tenue (un e-mail pour poser une question, appel clair) | 8 | Un seul appel, « Poser ma question : {url}/profil » (l. 253), conforme à la demande du 08/11. Mais avec l'objet A, l'aperçu dans la boîte de réception n'annonce nulle part qu'on peut nous écrire : la première ligne répète la question de l'objet au lieu de donner l'invitation (O1). |
| 2 | Exactitude | 8 | Délai repris mot pour mot de `question-equipe-s22.ts:16`. « Rien n’est publié sans ton accord » : CGU art. 10 (`question-equipe-s22.ts:125`) et confidentialité section 9 (l. 97). Titre de l'encadré : l. 33. Exemples tirés de l'aide (l. 37) et de l'accroche (l. 34), donc plausibles. Ils sont permis : aucun nom, aucune donnée de santé (CGU art. 10, mention l. 43). Service ouvert : `question-equipe.ts:11`. **Mais** « sur ton profil » est vrai et insuffisant. Dans `profil-dashboard.tsx`, l'encadré (l. 373) vient après Progression, Série, Statistiques, Mes parcours, Prochaine étape et Abonnement (l. 155-370). La carte n'a pas d'ancre (`question-equipe-card.tsx:107`), donc le lien `/profil` ouvre le haut de la page, plusieurs écrans au-dessus de l'encadré (O2). Enfin, rien ne lie l'envoi à `QUESTION_EQUIPE_OUVERTE` : si l'interrupteur est fermé, l'encadré n'est pas rendu et l'e-mail envoie vers rien (O3). |
| 3 | Ton d'Alex, zéro tiret cadratin, zéro émoji | 9 | Aucun tiret cadratin, aucun émoji, guillemets « », apostrophes ’, tutoiement. « Pas de vanne plutôt qu'une vanne moyenne » est respecté. Une phrase bancale (l. 249) : une proposition (« Un collègue te chambre… ») est coordonnée à un groupe nominal (« ou un message que… »), et ça accroche à la lecture à voix haute. Corrigé dans O1. Signature « L’Équipe Deviens Marrant » au lieu de « Alex, Deviens Marrant » (`ton-alex.md` l. 5) : gardée pour rester cohérent avec E1 et E2 déjà approuvés, sans pénalité. |
| 4 | Lisible en 20 s sur mobile | 9 | Environ 60 mots, 3 blocs et 1 lien. Le seul frein est l'aperçu redondant (O1). |
| 5 | Pas de redite d'E1/E2 | 8 | La porte est différente d'E1 (formulaire au lieu de « réponds à cet e-mail »), et l'objet A se distingue de « Une question ? … ». **Mais** la règle de glissement « au plus tard J20 » (l. 234) permet E1b à J20 puis E2 à J21. Ça fait deux e-mails de suite qui demandent un message (« raconte-nous », puis « dis-nous ce qui manque »), et E2 se lit alors comme une relance (O4). |
| 6 | Cadre (pied, lien d'arrêt, résiliés) | 9 | Le pied est identique à E1/E2, avec `List-Unsubscribe`. Les arrêts immédiats sont repris. Les résiliations programmées sont exclues, conformément à `onboarding-e1-resilies-s23.md:23` (C2, « un seul envoi, E1 à J5, rien d'autre »). Pas de `?src=`, pas de suivi. Le prérequis C8 (« deux » e-mails, l. 82, devient faux) est bien signalé par l'auteur. Il manque la condition d'ouverture du service (O3) et l'écart avec E2 (O4). |

## Objet : A retenu

Objet retenu : `Une situation où la répartie t’a manqué ?`

- C'est la définition même du service dans les CGU (« décrire une situation où la répartie t'a manqué », `question-equipe-s22.ts:125`) : l'objet annonce exactement ce que le formulaire traite.
- Il se distingue de l'objet d'E1 (« Une question ? Voilà ce qu’on fait ici »), reçu une semaine plus tôt. B (« Pose-nous ta question ») redit E1.
- Sa faiblesse : il ne dit pas qu'on peut écrire. La première ligne doit donc porter l'invitation au lieu de reposer la question (O1).

## Corrections OBLIGATOIRES (texte exact)

**O1. Corps : remplacer le bloc des lignes 247 à 253 par ce texte exact** (objet A inchangé, pied inchangé) :

```
Salut {prénom}, raconte-nous, l’équipe te répond.

Un collègue qui te chambre devant tout le monde, un message que tu n’arrives pas à écrire : décris la situation dans « Ta question à l’équipe », sur ton profil, juste sous ton abonnement.

En général, réponse par e-mail sous 1 à 2 jours ouvrés. Rien n’est publié sans ton accord.

Poser ma question : {url}/profil
```

Ce que ça corrige :
- L'aperçu lu sous l'objet donne la question puis la réponse (« Une situation où la répartie t’a manqué ? » / « Salut X, raconte-nous, l’équipe te répond. »), sans la répéter.
- « Raconte, l'équipe te répond » reprend l'accroche réelle de l'encadré (l. 34).
- Les deux exemples ont maintenant la même construction.
- Le délai et « rien n'est publié » restent mot pour mot.
- Si `{prénom}` est absent : « Salut, raconte-nous, l’équipe te répond. »

**O2. Emplacement : « juste sous ton abonnement » obligatoire** (déjà intégré à O1). Fait vérifié dans `profil-dashboard.tsx:365-373` (« sous la carte abonnement », commentaire l. 372). Si @fullstack déplace la carte avant l'envoi, cette mention doit suivre. Option souhaitable : ajouter `id="question-equipe"` sur la Card (`question-equipe-card.tsx:107`) et utiliser le lien `{url}/profil#question-equipe`. À vérifier : l'ancre doit survivre à la redirection de connexion (`middleware.ts:76`, `callbackUrl`). La mention « juste sous ton abonnement » reste dans le texte dans tous les cas.

**O3. Ajouter à « Envoi », ligne exacte** :
`Condition : [si question] QUESTION_EQUIPE_OUVERTE (config/question-equipe.ts:11), comme la puce d’E0. Interrupteur fermé : E1b n’est pas envoyé (journalisé).`

**O4. Dans « Envoi », remplacer « mais **au plus tard J20** (pour ne jamais se télescoper avec E2 à J21) » par ce texte exact** :
`mais **au plus tard J19** (jamais la veille ni le jour d’E2 : au moins un jour libre entre les deux)`
Et dans « À faire (@fullstack) », remplacer « règle de glissement J12 à J20 » par « règle de glissement J12 à J19 ».

## Prérequis hors note (déjà signalés par l'auteur, à garder bloquants)

- @legal : réécrire la puce C8 (`onboarding-e1-resilies-s23.md:82`), qui dit « deux e-mails d’accueil, au bout de 5 jours puis de 21 jours ». Avec E1b, c'est faux. Le texte est à rédiger par @legal, pas ici.
- Approbation de Thomas, puis relecture à l'aveugle du texte corrigé (P0 s18).

## Observations non bloquantes

- « on lit tout » (E1), « on lit chaque réponse » (E2) et « l’équipe te répond » (E1b) sont trois engagements différents mais compatibles. E1b est le seul adossé à un délai écrit (CGU art. 10).
- Mesure du diff (P0 s11) : O1 change 3 lignes sur 5 du corps. Intouchables conservés : délai mot pour mot, « Rien n’est publié sans ton accord », lien `/profil`, pied.
