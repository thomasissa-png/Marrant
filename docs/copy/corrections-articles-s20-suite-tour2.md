# Corrections articles s20, suite, tour 2 (lot du 13/10)

Fichier cible : `/home/user/Marrant/apps/web/src/lib/blog-articles.ts` (non modifié ici). Chaque « Avant » est l'extrait exact et unique du fichier à la date de rédaction. Question de FAQ, liens, slugs et titres : inchangés.

[Framework : PAS pour la FAQ (problème, geste, résultat), consigne + exemple pour le paragraphe] [Conscience : Solution-Aware, le lecteur cherche un exercice à faire]

Écart à signaler : le texte relu à l'aveugle pour H01 disait « laisse passer un temps en conversation (une seconde environ) », alors que le fichier contient « pratique la règle des 3 secondes en conversation (compte « un, deux, trois » dans ta tête) ». La correction ci-dessous remplace la chaîne réelle du fichier et s'aligne sur « une seconde environ », valeur utilisée partout ailleurs dans l'article `timing-humour` (le H2 « Comment utiliser la règle des 3 secondes ? » du même article n'est pas touché ici).

---

## 1. `timing-humour`, réponse FAQ « Comment améliorer son timing comique ? » (ligne 316)

**Avant** (valeur de `answer`, sans les guillemets de la chaîne) :

`Trois exercices : analyse les silences dans les sketches de Roman Frayssinet ou Blanche Gardin (chronomètre en main), pratique la règle des 3 secondes en conversation (compte « un, deux, trois » dans ta tête avant de lâcher ta remarque), et marque des pauses volontaires avant tes punchlines. Inconfortable au début, redoutable au bout d'une semaine.`

**Après** (valeur de `answer`, prête à coller entre les guillemets de la chaîne) :

`Trois exercices, trois gestes différents. 1) Observer : regarde un extrait de spectacle de Roman Frayssinet ou de Blanche Gardin, chronomètre en main, et note pour trois chutes la durée du silence juste avant et la première phrase qui le suit. 2) Marquer un temps : en conversation, laisse passer une seconde environ après la phrase de l'autre avant de lâcher ta remarque. Un ami annonce « j'ai enfin rangé mon bureau » ? Tu attends, puis : « Il était temps, il demandait l'asile politique. » 3) Ralentir l'amorce : enregistre-toi en racontant une anecdote, réécoute, et si le début file trop vite, refais-le plus posément pour garder la vitesse pour la chute. Inconfortable au début, puis ça devient un réflexe.`

**Raison** (verdicts reviewer, UX, creative-strategy) :
- Les anciens exercices 2 et 3 étaient le même (une pause avant la remarque, une pause avant la punchline). Les trois sont maintenant distincts par la cible : écouter un pro (observer), agir en conversation (marquer un temps), travailler son propre récit (ralentir l'amorce).
- L'exercice 1 dit désormais quoi relever (durée du silence, phrase qui suit) et sur combien de chutes (trois).
- Un mini-exemple montre la remarque lâchée après la seconde d'attente.
- « redoutable au bout d'une semaine » (délai chiffré sans source) retiré : « puis ça devient un réflexe ».
- « sketches » remplacé par « spectacle » ; « une seconde environ » conservée (cohérence site) ; la « règle des 3 secondes » n'est plus évoquée dans la FAQ, pour ne pas contredire la seconde environ.
- Contrainte technique : aucun guillemet double droit dans le texte, la chaîne est entre ". Seuls « » et apostrophes droites sont utilisés.

---

## 2. `confiance-humour-apres-rupture`, paragraphe Waly Dia (ligne 3289)

Ce paragraphe suit la définition du 3e niveau (« Autodérision de recul ») et précède le renvoi vers l'article `autoderision-interactions`.

**Avant** :

`**Waly Dia** utilise systématiquement ce troisième niveau dans ses spectacles : il parle de ses expériences difficiles avec une précision d'entomologiste. Pas pour minimiser, mais pour montrer qu'il les a traversées et qu'il peut maintenant les cartographier.`

**Après** :

`L'autodérision de recul, c'est prendre du champ sur une situation pour en rire sans te rabaisser. Dans la veine de **Waly Dia**, dont les spectacles visent la politique et la société, choisis pour cible la situation, pas toi. Consigne pour ta rupture : raconte-la en trois phrases de compte rendu, comme un reporter qui couvre un fait divers, sans un seul adjectif, puis ajoute le détail le plus absurdement précis. Exemple imaginé : « Samedi, elle m'a proposé de faire un point. Le point a duré onze minutes. Elle avait préparé un support. » Tu ris de la scène, pas de ta valeur.`

**Raison** (verdicts reviewer H04, UX H04, creative-strategy H04) :
- Waly Dia est conservé (règle P0 : humoristes nommés autorisés), mais on ne lui prête plus ni intention (« pour montrer qu'il les a traversées »), ni fréquence (« systématiquement »), ni récit intime. Seul reste ce que la presse décrit de ses spectacles (satire politique et sociale), repris sous la forme « dans la veine de », cohérente avec les autres passages de l'article de blog sur lui (ex. « humour politique sur le racisme qu'il vit »).
- « ce troisième niveau » est remplacé par « L'autodérision de recul » : le paragraphe se comprend seul.
- Une seule image (le reporter qui couvre un fait divers) ; entomologiste et cartographe supprimés.
- Consigne applicable à la rupture (compte rendu factuel en trois phrases sans adjectif, puis détail absurdement précis), suivie d'un exemple marqué « imaginé » (aucun adjectif dans les trois phrases, détail précis : onze minutes, un support). L'exemple est différent de ceux déjà donnés au niveau 3 (thèse de 3 mois, rupture à 14h37).
- Rien d'inventé sur Waly Dia : aucun spectacle, citation ou anecdote personnelle ajoutés.

---

## Contrôle de diff

Les deux passages sont des réécritures complètes voulues (100 % du texte remplacé sur ces deux extraits). Intouchables inchangés : question de FAQ, ordre des FAQ, liens internes, slugs, titres H2, chiffres et prix du reste des articles. Le lien `autoderision-interactions` qui suit le paragraphe 2 est hors extrait et reste en place.

## Auto-contrôle

- Zéro tiret cadratin, guillemets « » uniquement dans les textes proposés, aucun guillemet double droit dans la réponse FAQ.
- Tutoiement partout, aucun chiffre ni délai non sourcé, aucun témoignage.
- Nouvelle relecture à l'aveugle requise avant mise en ligne (règle d'or s18).

**Handoff → @orchestrator** : corrections H01 (FAQ timing) et H04 (Waly Dia) prêtes dans `/home/user/Marrant/docs/copy/corrections-articles-s20-suite-tour2.md`, à repasser en relecture à l'aveugle ; attention, le texte relu pour H01 ne correspond pas à la chaîne réelle du fichier (« règle des 3 secondes »).
