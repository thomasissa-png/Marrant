# Étalons Parcours Boulot : itération 5, note @reviewer (s19, 10/10/2026)

Document noté : `docs/copy/etalons-parcours-boulot-s19.md` (385 lignes). Relus : ma note d'itération 4, l'historique des corrections, les sources des conseils (`conseils-boulot-s19-v1.md`, `-v2.md`, `-v5.md` P2-bis, `-v6.md` T-b), la spec s17 §1 (RC1 à RC12) et §3, `boulot-base-s19.json` (fiches, titres et durées des vidéos citées), les réutilisations par `youtubeId` (`parcours-reecriture-s17.json`, `parcours-seed.json`, `parcours-storytelling-s18.json`), `founder-preferences.md` (07/10 et 08/10), le modèle s18 et le code des vannes de l'étape (`step-blocks.tsx`, `StepJokes`). Faits YouTube : ceux transmis par la session (aucune vidéo visionnée). Comme demandé, je ne note ni le texte des 5 conseils validés ni l'emplacement `[EN COURS…]` du PS.

## Note : 9,5/10

**Résumé.** Le bloquant de l'itération 4 est levé : le document ne désigne plus aucun fichier de version antérieure du PS comme texte à importer, et le handoff dit d'importer la version insérée au §1. Les corrections 2 à 7 sont appliquées. Pour la 8, il reste les lignes vides de fin de fichier. Le tableau des choix et « Je suis tes recos » sont exactement alignés de 1 à 9 (mêmes options, mêmes recos, mêmes vidéos nommées). La réponse type ne contient aucune condition.

J'ai recompté : `why` 39 mots ; `moduleDetail` 99 mots ; description B 74 mots (18 + 38 + 18) ; titres 60, 56 et 57 caractères ; quiz Q1 12/**11**/9/10, Q2 12/13/11/**12**, Q3 **12**/11/11/13 ; positions B, D, A ; explications de 2, 3 et 2 phrases. Vannes : 12 en ligne (8 fortes, 4 acceptables) et 18 neuves (3, 2, 3, 3, 2, 5), soit 30. Les durées et les fiches de la base sont conformes pour VDB, Tsamère, Croce « Tinder » et « avion », Brokerss, Guiz (les deux), Kev Adams, Roumanoff, Foresti, Haroun, Delmoitiez, Rollman « enterrements », Hamzawi et Vérino (`PT7M30S`). Aucune vidéo n'apparaît deux fois dans le parcours (RC4). Le visiteur ne voit que le nombre de vannes de l'étape 1, pas leur texte (`step-blocks.tsx` l. 142-143 : c'est vrai). Côté charte, aucun tiret cadratin ; « blague », « carnet », « cours gratuit » et « Expert » n'apparaissent que dans des consignes internes ; « Sophie » ne figure que dans le champ interne `persona`.

Pour atteindre 10, il reste à corriger un fait dépassé par la dernière vérification de la session (`m30qZa8p_Js` est publique et intégrable) et à nommer trois écarts à la spec (étape 5 à une seule vidéo, budget de temps RC7, objectif de l'étape 1). Le reste, ce sont des retouches de précision.

**0 correction bloquante, 10 non bloquantes (1 à 10), plus une note hors notation sur le PS.**

## Vérification des 5 conseils (copie à l'identique)

| Étape | Source | Document | Titre, catégorie, difficulté | contenu | exemple | exercice |
|---|---|---|---|---|---|---|
| 1 | v5, P2-bis (l. 30-41) | l. 69-74 | identiques | identique | identique, 2 lignes | identique (DÉFI TRACE) |
| 3 | v2 (l. 48-58) | l. 76-80 | identiques (« (conservé) » retiré) | identique | identique | identique (DÉFI CROISEMENT) |
| 4 | v1 (l. 48-58) | l. 82-86 | identiques (« (conservé) » retiré) | identique | identique | identique (DÉFI TRENTE SECONDES) |
| 5 | v1 (l. 66-77) | l. 88-94 | identiques (« (conservé) » retiré) | identique | identique, 2 lignes | identique (DÉFI DEUX PHRASES) |
| 6 | v6, T-b (l. 28-41) | l. 96-104 | identiques | identique | identique (83 + 16 + 8 = 107 mots) | identique (DÉFI SOIXANTE SECONDES) |

Le DÉFI TRACE du §3 (l. 166) est mot pour mot celui du §1 (l. 74). Aucun écart.

## Alignement tableau des choix / « Je suis tes recos »

| # | Tableau (reco) | Réponse type | Liste numérotée | Aligné |
|---|---|---|---|---|
| 1 | Valider les 5 textes | 1 oui | 5 textes, étapes 1, 3, 4, 5, 6 | oui |
| 2 | B (3 champs) | 2 B | description, accroche, témoignage B | oui |
| 3 | A, slug `boulot` | 3 A | titre A cité en entier, slug | oui |
| 4 | A | 4 A | 12 + 18 = 30 | oui |
| 5 | B (étapes 1 fac., 2, 4, 5, 6) | 5 B | les 5 changements et celles qui restent sont nommés | oui |
| 6 | B | 6 B | un seul test | oui |
| 7 | Valider | 7 oui | version corrigée (texte en §1) | oui (emplacement en cours, non noté) |
| 8 | a | 8 a | aucune vidéo découpée | oui (voir correction 5) |
| 9 | Valider | 9 oui | titre, `why`, scène, défi, quiz, légendes | oui |

---

## Corrections non bloquantes (nécessaires pour le 10)

**1. `m30qZa8p_Js` : le document dit l'inverse de la dernière vérification.** La session a constaté que cette vidéo est publique et intégrable (oEmbed). Le document affirme encore qu'elle « refuse la lecture » ou que sa lecture est restreinte, et il en tire une action sur Répartie 1, un parcours en ligne. Thomas lit ce fait dès l'en-tête.
- l. 8 : remplacer « dure 5 min 08 et refuse la lecture (« Vidéo non disponible » : intégration à vérifier) » par « dure 5 min 08, est publique et s'intègre (vérifié par oEmbed) ». La suite reste (« rien ne confirme qu'elle traite des relations sociales, elle n'est donc plus proposée »).
- l. 46 : « (lecture restreinte, intégration à vérifier) » devient « (titre générique, contenu non confirmé) ».
- l. 290 : « lecture restreinte » devient « publique et intégrable ».
- l. 361, (b) : supprimer « et l'API lecteur répond « Vidéo non disponible » (lecture restreinte) » ; remplacer « **vérifier qu'elle se lit dans le site**, sinon la retirer du parcours » par « elle est publique et s'intègre : rien à retirer. Seules la fiche, le titre et la durée sont en cause ; si la légende de Répartie 1 s'appuie sur la fiche « relations sociales », la relire au visionnage `[À VÉRIFIER]` ».
- l. 374, handoff (1) : « titre et durée de `m30qZa8p_Js` et contrôle de sa lecture dans Répartie 1 » devient « titre, durée et fiche de `m30qZa8p_Js` (vidéo publique et intégrable) ».

**2. Étape 5 à une seule vidéo : l'écart à la spec n'est pas nommé, et l'argument contredit celui de l'étape 6.** RC4 prévoit une vidéo obligatoire et une facultative par étape. En B, l'étape 5 n'a que Delmoitiez : « Haroun sort » (l. 34, l. 298, l. 305). Le document dit bien « 10 vidéos contre 11 », mais il ne présente jamais cela comme un écart. Pire, l. 301, il refuse l'étape 6 sans vidéo au motif que « la spec (RC4) demande une vidéo à l'étape 6 comme aux autres » : le même RC4 demande deux vidéos à l'étape 5. Or Haroun pourrait rester en facultative entière avec 8a. Il faut donc donner la raison qui l'écarte.
- l. 298, colonne « Pourquoi », après « Haroun sort » : « Écart à la spec (RC4 : deux vidéos par étape), l'étape 5 n'en garde qu'une. Haroun ne reste pas en facultative : sa fiche ne parle pas de la question, et son titre YouTube (« Jamel Comedy Club Saison 9 ») ne confirme pas la fiche, la même raison qui écarte Rollman « relations sociales ». Je n'ai pas trouvé d'autre fiche qui porte le « tu fais quoi dans la vie ? » parmi les 89. »
- l. 301 : « parce que la spec (RC4) demande une vidéo à l'étape 6 comme aux autres » devient « parce que la spec (RC4) demande au moins une vidéo par étape : l'étape 5 en garde une, l'étape 6 aussi ».
- l. 34, numéro 5 : « Delmoitiez « J'ai pas confiance en moi et j'ai raison » en vidéo unique (Haroun sort) » devient « … en vidéo unique (Haroun sort ; la spec en prévoyait deux) ».

**3. Budget de temps : l'écart à RC7 n'est pas dit, et la l. 158 mélange deux bases de calcul.** La spec compte la vidéo obligatoire dans les 15 minutes (RC7 : « ≈ 9 + vidéo ≤ 5 = 14 min » ; §3.2 : « 9 min hors vidéo + vidéo obligatoire = 13 min 30 »). Le choix 8 s'appuie sur la convention du site, « Environ 15 min, hors vidéos ». C'est un argument valable, mais il s'écarte de la base de la spec, et c'est sur elle que reposait le plafond de 5 minutes. Thomas doit le lire en clair.
- l. 308, après « (signalement 7) » : « Écart à la spec : son budget (RC7) comptait la vidéo obligatoire dans les 15 minutes, et le plafond de 5 min venait de là. Le site affiche la durée hors vidéos, comme sur les autres parcours, et c'est cette durée que lit la lectrice. »
- l. 158 : « (la spec estime 13 min 30) » devient « (la spec estime 13 min 30 vidéo obligatoire comprise, soit 9 min hors vidéo) ».

**4. Étape 1 : l'écart à la spec n'est pas signalé.** La spec (§3.2, étape 1) prévoit « Repérer expressions toutes faites et rituels d'une réunion, viser le système, préparer un commentaire », avec un exercice « Bingo mental […], puis le raconter à un collègue complice. Repli : une réunion déjà passée ou une visio ». L'étape écrite observe les traces des objets, ne fait rien raconter, et prend comme repli « la première pièce où tu passes ». La question 3 du quiz fait même de « de mémoire » (une réunion passée) une mauvaise réponse. C'est cohérent avec le conseil validé (RC1), et la progression « observer sans risque » est tenue. Mais Thomas valide le 9 sans savoir que l'étape s'éloigne de la spec qu'il a suivie en s17.
- l. 134, après « aucune personne dans la phrase » : « Écart à la spec, porté par le conseil validé : l'étape lit les traces des objets de la salle au lieu des expressions et rituels de la réunion, rien n'est raconté à un collègue, et le repli n'est plus une réunion déjà passée mais la première pièce où tu passes. La technique (observation sans parole) et la place dans la progression ne changent pas. »
- Tableau des choix, ligne 9, colonne « Ce que ça change » : ajouter « Elle s'écarte de la spec (objets de la salle au lieu des rituels de réunion, rien à raconter) : voir §3 ».

**5. Numéro 8 : les extraits reviennent aussi avec « B sauf étape 5 » et « B sauf étape 6 ».** l. 37 : « avec 5A, les deux extraits de la spec (Haroun, Rollman « enterrements ») restent à minuter ». Or « B sauf étape 5 » remet Haroun en première vidéo (5 min 45, extrait), et « B sauf étape 6 » remet Rollman « enterrements » (6 min 40, extrait), que la l. 301 annonce déjà. Correction l. 37 : « avec 5A, ou avec « B sauf étape 5 » ou « B sauf étape 6 », les extraits de la spec concernés (Haroun, Rollman « enterrements ») restent à minuter ». Même ajout en fin de l. 308.

**6. Fiches citées entre guillemets mais non mot pour mot, et une déduction présentée comme un fait.**
- l. 299 : « sa fiche dit « lucidité et auto-dérision, style introspectif et mordant » ». La fiche dit : « avec sa lucidité et son auto-dérision signature. Son style introspectif et mordant ». Citer mot pour mot, ou retirer les guillemets.
- l. 214 : « (fiche : « L'objet sacré : un distributeur de baguettes, un truc que personne ne remarque, regardé comme un étranger ») ». Ce texte n'est pas celui de la fiche (« TECHNIQUE DE L'OBJET SACRÉ. Vérino prend un distributeur de baguettes […] un truc que personne ne remarque […] en le regardant comme un étranger »). Reprendre les fragments exacts déjà donnés l. 222, ou retirer les guillemets.
- l. 20 et l. 299 : « texte écrit d'avance puis lu » pour Hamzawi. La fiche ne le dit pas. On le déduit du genre (« chronique France Inter » dans le titre), et la vidéo n'a pas été visionnée. Or c'est un des arguments de la reco. Ajouter « (d'après le genre, la chronique de radio ; à confirmer au visionnage) » l. 299, et « (chronique de radio) » à la place de « texte écrit d'avance puis lu » l. 20.

**7. Signalement 11, dernière phrase (l. 361) : « Rollman « EVJF » » n'existe pas.** Aucune vidéo « EVJF » dans la base ni dans les parcours. La vidéo citée ailleurs est « Marina Rollman - Les enterrements de vie » (`4t9a0To2ygo`). Remplacer par « Rollman « Les enterrements de vie » ».

**8. l. 343 : « restent dans les exercices » est inexact pour l'étape 5.** « Ni métier ni employeur moqués » se trouve dans le `contenu` du conseil de l'étape 5 (« L'autodérision tombe sur toi, jamais sur ton métier ni sur ton employeur »), pas dans son défi. Correction : « restent dans les conseils et leurs défis ».

**9. Handoff (3) : la mise en ligne oublie le choix du 07/10 sur le rendu.** L'interrupteur doit être « activé sur feu vert de Thomas seulement ». Le choix du 07/10 (`founder-preferences.md` l. 75) impose aussi que le rendu soit relu par @design et @ux jusqu'à 10/10 avant toute mise en ligne (captures 375/768/1280, visiteur et Premium). Correction : « activé sur feu vert de Thomas, après la relecture du rendu par @design et @ux jusqu'à 10/10 (captures 375/768/1280, visiteur et Premium ; choix du 07/10) ».

**10. Lignes vides de fin de fichier (l. 382-385).** Elles sont toujours là, alors que l'historique (R8) les dit retirées. Les supprimer.

---

## Hors notation : à faire au moment de l'insertion du PS

Je ne pénalise pas l'emplacement `[EN COURS…]`. Mais la session prévoit de soumettre directement à Thomas les chutes finalistes, parce que la relecture à l'aveugle ne converge plus. Or le document répète que le PS ne sera validé « une fois passé à l'aveugle » : tableau des choix lignes 1 et 7, numéro 7, tableau d'état l. 61, l. 107-109 (dont « Règle d'or : elle n'entre en base qu'après avoir passé la relecture à l'aveugle »), handoff (2) et checklist d'insertion. Si Thomas tranche à la place de la relecture :
- remplacer chaque « une fois passée à l'aveugle » par le mode de décision réel (« choisie par toi parmi les finalistes ») ;
- dire en clair à Thomas que c'est une exception à sa règle d'or du 08/10 (P0 s18 : « la version corrigée ne revient que si elle repasse la même relecture à l'aveugle ») et qu'il la pose lui-même. Sinon, le handoff (2) contredit le texte qui sera inséré, et @fullstack ne saura pas si l'import est autorisé ;
- ajouter cette décision à `founder-preferences.md` (`[CHOIX UTILISATEUR]`), pour qu'aucun agent ne la re-questionne.

## Ce qui a été vérifié et est exact

- Les 5 conseils sont identiques à leurs sources (tableau ci-dessus).
- Corrections de l'itération 4 : 1 à 7 appliquées ; 8 appliquée sauf les lignes vides (correction 10).
- Spec : XP 50, 75, 100, 100, 125, 150 + 100 ; `dayNumber` 3 ; 3 questions (4 à la dernière) ; RC4 sans doublon interne ; RC8 (aperçu : l'écart sur la durée est signalé au handoff 7b) ; RC9 (« Imagine… », tutoiement, « vanne »). Les écarts déjà signalés (Delmoitiez à 6 min en première place, étape 6 Hamzawi, doublons) sont justifiés ; les trois qui manquent sont les corrections 2 à 4.
- Faits YouTube transmis par la session : Vérino 5 min 51 s, titre `qdqIc-uzdbA`, titre et durée de `m30qZa8p_Js` repris exactement. Seul le statut de lecture de `m30qZa8p_Js` est dépassé (correction 1).
- Décisions acquises : aucune n'est re-proposée. Les choix du 07/10 et du 08/10 sont respectés, à la correction 9 près.
- Étape 1 et quiz : la scène suit le défi (trois traces, deux phrases au présent, un chiffre et une durée, aucune personne) ; aucune bonne réponse ne reprend un mot plein de sa question ; aucune n'est la plus longue ni la plus courte ; chaque mauvaise réponse enfreint une seule consigne nommée par l'explication.

## Pour l'itération 6

Appliquer les corrections 1 à 10. Ce sont des retouches locales : aucune ne change une reco ni ne touche un texte validé à l'aveugle. Avec elles, le document est à 10. La note hors notation se traite au moment où la session insère la décision de Thomas sur le PS.
