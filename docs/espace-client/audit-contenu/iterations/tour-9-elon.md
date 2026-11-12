# Tour 9 : relecture à l'aveugle de l'architecture de contenu v9 (@elon)

> AVIS CONSULTATIF, validation requise avant exécution. Relecteur indépendant, sans accès aux autres avis du tour 9.
> Lu : `architecture-contenu-v9.md` (0, 0.1, 0 bis, 3.3 avec le plan des 60, 4.2, 7.6, C13, annexe A.1).
> Vérifié dans le code :
> - `blog-parcours.ts` l. 13 à 26 (cluster → parcours ; « fort-volume » → repartie ; défaut repartie).
> - `article-cta.tsx` l. 89 : `buildAbonnementUrl(`/parcours/${parcours}`, "monthly", src)`.
> - `premium-return.ts` l. 53 à 68 : l'URL porte `returnTo=/parcours/<parcours>` ET `src=blog-<slug>` ; commentaire l. 59 et 60 : `src` est « relayé par /abonnement jusqu'à /register pour la mesure du tunnel ».
> - Plan des 60 recompté : 12 x 4 = 48, + 2 x 2, + 8 x 1 = 60.

## Verdict en une phrase

Mes trois corrections du tour 8 sont traitées, et S1 l'est mieux que je ne l'avais demandé : la v9 a trouvé que le parcours de l'article voyage déjà dans `returnTo` (je le confirme dans le code), et elle ne construit la table des articles que si le signal arrive. Les trois ajouts de l'auteur tiennent par principes premiers, en particulier la règle à deux niveaux.

Il reste trois réglages et aucun bloquant de conception. Le plus important : **un parcours déduit par le site à partir de l'article passe avant le profil déduit de la personne**, ce qui contredit le principe que la v9 applique déjà au geste.

## Les trois ajouts de l'auteur, jugés

1. **Règle de priorité à deux niveaux** : juste, c'est la bonne physique de la décision. Se tromper sur ce qu'on écrit se corrige le mois suivant ; se tromper sur ce qui passe devant à l'écran touche tous les payants. Données visiteurs pour la première décision, données abonnés pour la seconde. La phrase « les deux décisions n'ont pas le même coût » (0.1) est la meilleure du document. Un seul ajout : le niveau 2 doit hériter de l'effectif minimal de 7.6, sinon trois touchers de quatre abonnés feraient un « [MESURÉ A] » (U2).
2. **Effectif minimal à J60** : juste. « Avec 4 abonnés actifs elle déciderait sur trois personnes. » Le « à J60 et au-delà de cet effectif » signifie qu'on prend la plus tardive des deux dates : c'est la bonne lecture.
3. **Affectation des 5 profils aux univers** (Observateur soirée, Storyteller amis, Punchlineur amis, Absurde boulot, Taquin coloc) : cohérente avec les scènes d'entrée de 4.2 (« un groupe où tu connais presque personne », « alors, quoi de neuf ? », la poêle…), marquée [HYPOTHÈSE], fixée à E1. Rien à redire.

## Notes

| # | Critère | T8 | T9 | Justification (passage cité) |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 10 | « pour plaire » : une situation de rencontre une seule fois dans la rafale, sans parcours. Simple, juste. |
| C2 | Respect des décisions | 10 | 10 | Pivot du 06/05 rappelé dans la règle de J60 et dans C13 ; « Aucune seconde table article-parcours » (le code fait foi). |
| C3 | Zéro donnée inventée | 9 | 9 | 0 bis : « l'article seulement dans `src=blog-<slug>`, perdu au paiement ». Ce n'est pas vérifié : le code dit « relayé [...] jusqu'à /register », la suite est inconnue, et l'annexe B le dit (« Si le `src` [...] peut être transporté »). Le document affirme en tête ce qu'il met en doute à la fin (U3). |
| C4 | Rubriques claires | 10 | 10 | Inchangé. |
| C5 | Ambition | 10 | 10 | Inchangé. |
| C6 | Cohérence | 9 | 9 | « La catégorie d'un article se dérive du cluster de `lib/blog-parcours.ts` [...] aucune seconde table » : les clusters du code (techniques-repartie, apprendre-humour, fort-volume, douleurs-personas, humour-contexte, saisonnier…) ne contiennent ni « Rencontre », ni « Autodérision », ni « Storytelling », ni les catégories `JokeCategory` dont le toucher a besoin (SOIREES, DATING…). La table du premier pas ne peut pas venir des seuls clusters (U4). |
| C7 | Faisabilité au niveau | 9 | 10 | Transport de la source au chantier de 7.3, interrupteur fermé, essai réel en 7.5 (e) et 7.4. |
| C8 | Questions à Thomas | 10 | 10 | C13 réduite à la forme d'un seul bloc, « on ne montre jamais la même vanne deux fois ». |
| C9 | Exemples | 10 | 10 | Inchangé. |
| C10 | Progression | 10 | 10 | Inchangé. |
| C11 | Pertinence pour l'audience réelle | 9 | 9 | La règle à deux niveaux et l'effectif minimal sont exactement ce qu'il fallait. Mais dans l'ordre 2, « Lien de retour vers un parcours sans étape (dont le parcours associé à un article) » passe avant le quiz. L'article n°1 (79,7 % des clics visiteurs) est du cluster « fort-volume », donc `returnTo=/parcours/repartie`, identique au défaut. Un abonné Observateur venu de cet article reçoit Répartie au lieu de Confiance (U1). |

**Note globale : 9,7 / 10** (107 / 11 critères ; T8 : 9,6).

## Statut de mes corrections du tour 8

| # | Correction T8 | Statut | Commentaire |
|---|---|---|---|
| S1 | Signal d'article mal nommé, peut-être inexistant | OK, au-delà | Mécanisme exact (`returnTo` = parcours associé, `src` = article), table « à construire, conditionnelle », transport au chantier de 7.3, essai réel au lot 0, priorité ramenée à « utile, pas prioritaire ». Seul reste : « perdu au paiement » affirmé (U3). |
| S2 | Premier pas si C13 = C | OK | « Si C13 = C, le premier pas ouvre la Bibliothèque sur le thème de la catégorie de l'article et la fiche d'une vanne. » |
| S3 | Règle de J60 et pivot du 06/05 | OK | « Cette repondération touche le pivot du 06/05 : la question posée à Thomas le lui rappelle. » |

Bilan sur 3 : 3 OK.

Note pour la session : le « fait vérifié » transmis au tour 8 (« PAS `returnTo` ») était incomplet. Le bouton envoie les deux : `returnTo` pour le parcours et `src` pour l'article (`premium-return.ts` l. 62 à 66). La v9 a raison.

## Nouvelles corrections

Aucun bloquant de conception. Ces quatre réglages restent nécessaires pour un 10.

U1. **[NON BLOQUANT, nécessaire pour 10] Le parcours déduit de l'article ne doit pas passer avant le profil de la personne (4.2, ordre 2).**
- Passage : « réponse explicite (si donnée), puis parcours de la fiche ou du parcours d'origine, puis quiz » ; « Lien de retour vers un parcours sans étape (dont le parcours associé à un article) | ce parcours (signal faible si c'est le défaut "repartie") ».
- Problème : ce `returnTo` est une correspondance faite par le site (cluster vers parcours), pas un choix de l'abonné. Le produit ne peut pas distinguer « repartie par cluster » de « repartie par défaut », et c'est justement le cas de l'article n°1. La v9 a posé le bon principe pour le geste (« une préférence déclarée aujourd'hui vaut mieux qu'un profil déduit ») ; par la même logique, un profil tiré de la personne vaut mieux qu'un parcours tiré de l'article.
- Correction : ordre 2 = réponse explicite, puis étape d'origine (`#etape-N`, l'abonné a vraiment ouvert l'étape), puis quiz, puis parcours sans étape (associé à l'article), puis défaut. La mention « signal faible » devient une règle : `/parcours/repartie` sans étape équivaut à « pas de signal ».

U2. **[NON BLOQUANT] Le niveau 2 de la règle de priorité doit hériter de l'effectif minimal (0.1, 7.6).**
- Passage : « seul un [MESURÉ A] peut faire passer un contenu devant un autre ».
- Correction : ajouter « [MESURÉ A] = relevé au-delà de l'effectif minimal de 7.6 ». Sinon, les premiers touchers de quatre abonnés suffiraient à réordonner l'écran de tous.

U3. **[NON BLOQUANT] Ne pas affirmer « perdu au paiement » (0 bis, en-tête).**
- Correction : « relayé jusqu'à /register (`premium-return.ts` l. 59 et 60) ; au-delà, non vérifié (essai réel au lot 0) ». Ainsi l'en-tête dit la même chose que l'annexe B.

U4. **[NON BLOQUANT] Les clusters ne suffisent pas pour la table du premier pas (4.2).**
- Passage : « La catégorie d'un article se dérive du cluster de `lib/blog-parcours.ts` [...] aucune seconde table article-parcours ».
- Problème : la table du premier pas a besoin de « Rencontre », « Autodérision », « Storytelling », « Blagues » et d'une catégorie `JokeCategory` pour prérégler le toucher. Les clusters du code ne portent pas ces valeurs.
- Correction : dire qu'il faudra une petite correspondance cluster (ou `article.category`, que `resolveArticleParcours` reçoit déjà) vers catégorie de premier pas, distincte de la table article-parcours (qui, elle, n'est pas doublée). Elle est à construire avec le reste de la table conditionnelle, [À VÉRIFIER] avec la liste réelle des catégories d'articles.

## Ce qui manque encore pour 10

U1 (une ligne déplacée dans l'ordre 2) et U2 à U4 (trois précisions de rédaction). Le moteur, la valeur persona, la pertinence et la production sont au niveau.

---
**Handoff → session principale**
- Fichier : `docs/espace-client/audit-contenu/iterations/tour-9-elon.md` ; note 9,7/10 sur 11 critères (T8 : 9,6). Mes 3 corrections du tour 8 : 3 OK, S1 au-delà. Les trois ajouts (deux niveaux de preuve, effectif minimal, profils par univers) sont jugés justes.
- Aucun bloquant de conception ; 4 réglages pour 10. Le principal, U1 : dans l'ordre 2, le parcours déduit de l'article (`returnTo=/parcours/repartie` pour l'article n°1, identique au défaut) passe avant le quiz ; il doit passer après.
- Autres : U2, le niveau « [MESURÉ A] » hérite de l'effectif minimal ; U3, « perdu au paiement » n'est pas vérifié (le code relaie `src` jusqu'à /register) ; U4, il faut une petite correspondance cluster (ou `article.category`) vers catégorie de premier pas.
- Pour la session : le fait « PAS `returnTo` » du tour 8 était incomplet, le bouton envoie `returnTo` (parcours) ET `src` (article). Ce sont des AVIS : Thomas décide.
---
