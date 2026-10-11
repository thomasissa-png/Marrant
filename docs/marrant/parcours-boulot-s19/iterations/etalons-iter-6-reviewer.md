# Étalons Parcours Boulot : itération 6 (contrôle final), note @reviewer (s19, 10/10/2026)

Document noté : `docs/copy/etalons-parcours-boulot-s19.md` (395 lignes). Relus pour vérifier : ma note d'itération 5, l'historique des corrections, le lot Y1 (`lot-aveugle-conseils-s19-tour13.md`), les lots et les critiques A et B des tours 10, 11, 12 et 13 (plus les tours 7 à 9 pour l'abandon du « registre officiel »), les sources des 5 conseils (v1, v2, v5 P2-bis, v6 T-b), la spec s17 (§3, étape 2), `boulot-base-s19.json` et `conseils-seed.json` (fiche du PS en ligne), `founder-preferences.md` (lignes du 07/10 et du 08/10) et `schema.prisma` (enum `TipCategory`). Comme demandé, je ne note pas le texte des 5 conseils validés.

## Note : 9/10

**Résumé.** Les corrections 1 à 9 de l'itération 5 sont appliquées. La 10 ne l'est pas : il reste une ligne vide en fin de fichier. Le choix 7 tient sur l'essentiel. Le contenu et le défi du PS sont ceux de Y1 mot pour mot. L'exception à la règle d'or est dite en clair, comme une décision de Thomas. L'option « relancer l'aveugle » est offerte, et le handoff interdit à @fullstack d'importer avant l'inscription. Il manque pourtant ce qu'il faut à Thomas pour décider seul, puisque c'est lui qui remplace la relecture :
- l'historique de la chute a enjolive le tour 12 ;
- les raisons du « sous la barre » du tour 13 ne sont pas données, et l'une d'elles touche l'argument même de la reco ;
- une proposition de critique du tour 13 a disparu ;
- l'option d promet un retrait que personne n'est chargé de faire ;
- le nombre de tours est faux à quatre endroits.

**2 corrections bloquantes (1 et 2), 6 non bloquantes (3 à 8).**

## Vérifications faites (exactes)

| Point | Résultat |
|---|---|
| Contenu du PS (l. 107) contre Y1 l. 7 | identique mot pour mot |
| Défi du PS (l. 109) contre Y1 l. 11 | identique mot pour mot |
| Mail d'exemple (l. 108) contre Y1 l. 9 | identique (Inès, Camille, 14 h, salle B) |
| Chutes a, b, c : texte | a = X2 tour 12 et Y1 tour 13 ; b = V3 tour 10 et W1 tour 11 ; c = correction de la critique A au tour 13 |
| Historique de b | exact : tour 10, « = » chez A et « = » chez B après la correction de « finit » ; tour 11, « < » chez les deux |
| Historique de c | « proposée par une critique au tour 13, jamais relue » : exact (critique A) |
| Abandon du « registre officiel » | exact : trop proche de E3 (tour 8, critique B ; tour 9, départage C) |
| Catégorie ABSURDE | valeur valide de `TipCategory` (`schema.prisma` l. 238) |
| Exception à la règle d'or | exacte : la ligne du 08/10 (l. 76) exige que la version corrigée « en sorte au niveau » ; aucune des trois n'en est sortie |
| Garde-fou @fullstack | handoff, ligne « Après la réponse de Thomas » et point (2) : aucun import sans le choix a, b ou c ET l'inscription dans `founder-preferences.md` |
| 5 conseils validés | identiques à leurs sources, retours à la ligne des exemples compris : étape 1 = v5 l. 30-41, étape 3 = v2 l. 48-58, étapes 4 et 5 = v1 l. 48-58 et 66-77, étape 6 = v6 l. 28-41. Le DÉFI TRACE du §3 (l. 176) est identique à celui du §1 (l. 71) |
| Tableau des choix et « Je suis tes recos » | alignés de 1 à 9 ; 7 = a partout (tableau, réponse type, numéro 7, handoff « Attend Thomas ») |
| Charte | aucun tiret cadratin ; « blague », « carnet », « cours gratuit », « Expert » et « Sophie » n'apparaissent que dans des consignes internes ou dans le champ `persona` ; « vous » seulement dans le titre de Kev Adams ; tutoiement ; aucune chute ne vise une personne |
| Recomptes | description B 73 mots (18 + 37 + 18) ; phrase `[SI 6B]` 37 mots ; vannes 11 en ligne (8 fortes, 3 acceptables) + 19 neuves (3, 2, 3, 3, 3, 5) = 30 ; 7 vannes BOULOT écartées + le mug, 8 retenues |
| Traces caduques | aucune trace de « 12 en ligne », « 18 neuves », « 74 mots », « lecture restreinte », « EVJF », « EN COURS » ni d'une version antérieure du PS |

---

## Corrections bloquantes

**1. Historique des chutes : le rendre fidèle, et donner à Thomas les raisons du dernier verdict (l. 104, 112-114, 118).** Thomas décide à la place de la relecture : il doit lire ce que les critiques ont dit, pas seulement leur verdict.
- (a) **Tour 12, chute a.** Au tour 12, la critique B a noté le texte « < ». Elle a jugé sa chute « meilleur retournement du lot », mais elle l'a recalé pour une question de forme (« en dernier mot »), corrigée au tour 13 (`aveugle-conseils-tour12-critique-B.md` l. 12). Le lot ne comptait que deux variantes : « meilleur retournement du lot » veut seulement dire « préférée à « mais sept » ». Remplacer l. 112 par : « Historique : proposée par la critique A au tour 11 ; au tour 12, au niveau chez A ; chez B, chute préférée à l'autre variante du lot (« meilleur retournement du lot »), mais texte noté sous la barre pour une question de forme, corrigée depuis ; au tour 13, sous la barre chez les deux. » Même retouche l. 118 : « la chute que les deux critiques ont préférée à l'autre variante au tour 12 ».
- (b) **Raisons du tour 13, à donner en une ligne.** Pour a, la critique A écrit qu'on devine le sens (« ce n'était pas la machine, c'était moi »), parent du gag « entre la chaise et le clavier ». Pour la critique B, l'image est douce et se voit venir. Ajouter aussi l'objection que B fait au début de la phrase : « ce n'est pas au clavier que j'ai fait des reproches » se lit d'abord comme « en tapant » (tour 13, critique B, point 4). Elle vaut pour **les trois** chutes, puisqu'elles partagent ce début : à dire en clair, c'est un risque commun à a, b et c.
- (c) **L'argument de la reco contredit le contenu.** Le contenu dit « la scène, c'est toi et un objet ». Avec a, la version rectifiée est toi (ton reflet), pas un objet : la critique A du tour 13 le relève (critère 4). La reco (« elle ne vise que toi ») doit le dire : « l'exemple s'écarte d'un mot de sa propre règle (toi, pas un objet) ; c tient la règle, mais n'a jamais été relue ».
- (d) **Proposition manquante.** Au tour 13, la critique B a proposé une autre chute : « PS : pour être précis, ce n'est pas trois fois que j'ai salué la plante du couloir ce matin, mais quatre. » Elle n'apparaît nulle part, alors que c (la proposition de A au même tour) devient finaliste. Ajouter l. 114 : « La critique B a proposé au même tour une autre chute, jamais relue elle non plus : « … salué la plante du couloir ce matin, mais quatre » » ; puis l'ajouter en option, ou dire en une phrase pourquoi elle n'est pas finaliste. Les propositions du tour 12 (« deux et demie » chez A, « touche Échap » chez B) peuvent rester hors du document : la critique B qualifiait elle-même la sienne de piste « non testée ».

**2. Option d : le document promet le retrait de l'ancien PS, mais personne n'en est chargé (l. 118 contre handoff (2) et ligne « Après la réponse de Thomas »).** La l. 118 dit « Dans tous les cas, l'ancien conseil ne reste pas en ligne ». Or, avec d, le handoff dit seulement « ne rien importer pour l'étape 2 ». Le conseil en ligne, jugé sous la barre au tour 7, reste donc actif (`boulot-base-s19.json` : `isActive: true`, `cmmw0tqkc000smw62bo1yfeyg`). La seule option qui respecte la règle d'or laisserait en ligne un texte sous la barre, contre le choix du 08/10 (« tout ce qui est sous la barre est corrigé jusqu'à passer »). Ajouter au handoff (2) : « si Thomas a répondu d : désactiver le conseil `cmmw0tqkc000smw62bo1yfeyg` en base ET dans `conseils-seed.json` (`isActive: false`, comme les 3 conseils de Storytelling le 30/09) jusqu'à ce qu'une chute sorte au niveau ; l'étape 2 du parcours n'est pas importée d'ici là ». Ajouter le même ajout dans la ligne « Après la réponse de Thomas au choix 7 (session) », à « Si d ». Sinon, retirer « Dans tous les cas » de la l. 118, mais Thomas doit alors savoir que d laisse l'ancien texte en ligne.

## Corrections non bloquantes (nécessaires pour le 10)

**3. « Sept tours de réécriture (8 à 13) » : il y en a six.** Les tours 8, 9, 10, 11, 12 et 13 font six tours (T1, U1-U2, V1-V3, W1, X1-X2, Y1 ; le départage du tour 9 relit U1, il ne réécrit rien). L'erreur apparaît à quatre endroits : l. 19 (tableau, choix 7), l. 41 (« réécrit pendant sept tours »), l. 58 (tableau d'état) et l. 104. Remplacer chaque fois par « six tours de réécriture (8 à 13) ». L'historique des corrections (l. 121) répète l'erreur : à corriger aussi par la session.

**4. Tableau des choix, l. 19 : « (texte non passé à l'aveugle) » est inexact.** a et b sont passées à l'aveugle et en sont sorties sous la barre ; seule c n'a jamais été relue. Remplacer par « (aucune de ces chutes n'est sortie au niveau de la relecture à l'aveugle) », la formule déjà juste de la l. 117.

**5. Portée de l'exception, à inscrire avec la décision (l. 33, l. 117, handoff).** Rien ne borne l'exception : un agent pourrait plus tard la lire comme un précédent. Choisir a, b ou c déroge aussi au second choix du 08/10 (`founder-preferences.md` l. 77 : « tout ce qui est sous la barre est corrigé jusqu'à passer »), pas seulement à la règle d'or (l. 76). Ajouter l. 117 et dans la consigne d'inscription du handoff : « Exception limitée à ce seul conseil (le PS de l'étape 2) ; la règle d'or reste entière pour tout le reste, y compris les 19 vannes neuves et les étapes 2 à 6 ». Ajouter aussi les deux lignes du 08/10 à l'entrée `[CHOIX UTILISATEUR]` qui sera inscrite.

**6. Format de l'exemple à importer (l. 108, handoff (2)).** La l. 108 n'est pas un texte importable (« le mail est le même pour les trois chutes : « … Camille. » Seule la dernière phrase (le PS) change »). Le handoff dit d'importer « le conseil complet du §1 avec la chute choisie » sans donner la forme du champ `example`. Ajouter au handoff (2) : « champ `example` = le mail et le PS dans une seule citation, comme Y1 l. 9 : « Bonjour Inès, la réunion budget de jeudi est décalée à 14 h, salle B. L'ordre du jour est inchangé. Peux-tu confirmer ta présence avant mercredi ? Bien cordialement, Camille. PS : pour être précis, ce n'est pas au clavier que j'ai fait des reproches ce matin, mais [fin de la chute choisie]. » ». Ajouter aussi, à l'étape de la session : « réécrire la l. 108 sous cette forme ».

**7. Difficulté du PS : la base la donne (l. 106).** « celle du conseil en ligne, inchangée `[À VÉRIFIER @fullstack sur la base de prod]` » devient « INTERMEDIAIRE (export de prod du 10/10, inchangée) ». L'en-tête pose « La base fait foi » : `boulot-base-s19.json` l. 89 et `conseils-seed.json` l. 379 donnent `INTERMEDIAIRE`.

**8. Retouches de cohérence.**
- l. 104 : « Plutôt que d'ajouter un tour, tu tranches ici » contredit l'option d, qui est justement un tour de plus. Remplacer par « Tu tranches : une des trois chutes, ou un tour de plus (d). »
- l. 309 (Croce « avion ») : « une forme officielle au service d'un détail dérisoire » décrit le ressort abandonné (le registre officiel, l. 104), pas le faux rectificatif. Remplacer « proche du PS en faux rectificatif » par « une phrase formelle qui retourne un détail, cousine du faux rectificatif (adéquation moyenne) », ou baisser l'adéquation annoncée.
- l. 331 (§7, étape 2) : « après relecture » vient de la spec (« test capture d'écran ») et non du défi du PS, qui dit « Il doit rester présentable si ton chef le lit ». Écrire « si tu l'envoies et qu'il reste présentable si ton chef le lit ».
- Fin de fichier : une ligne vide subsiste après « … `etalons-historique-corrections.md`). » (correction 10 de l'itération 5, annoncée faite). La supprimer.

---

## Pour la présentation à Thomas

Avec les corrections 1 à 8, le document est à 10. Aucune ne touche un texte validé à l'aveugle, ni le contenu ou le défi du PS. Aucune ne change de reco : la reco a peut rester, à condition que Thomas lise ses objections (correction 1). Les corrections 1 et 2 sont à faire avant tout envoi : sans elles, Thomas trancherait sur un historique incomplet, et l'option qui respecte sa règle laisserait en ligne un texte sous la barre.
