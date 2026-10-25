# Relecture à l'aveugle comparative : lettre du mois n°1 (jeudi 05/11/2026), regard d'éditeur

> Relu le 25/10/2026 par @reviewer. Source : `docs/copy/n1-candidates-s22.md` (trois candidates). J'ai jugé les textes seuls, pas leur historique : la note 8,8 déjà obtenue par (a) n'a pas compté.
> Comparé au site : `joke-decryptages.json`, `carnet/2026-11.json` (et `2026-10.json`), `video-content-s20.json`, `lettre/hebdo-premium.json`, articles (`lib/blog-articles.ts`, fiche `articles-q4/S2`), étapes (`config/parcours-etapes.ts`), offre gratuite (`lib/llms-parcours.ts:19`, `config/premium.ts:32`).
> Barre : 9/10. Le fondateur a refusé une version pour trois raisons (saison décalée, entrée lente, réplique qui demandait un mode d'emploi), et chacune vaut ici critère éliminatoire.

## Résumé exécutif

Une seule candidate peut partir, la (a) « Alors, t'as perdu ta langue ? ». Telle qu'elle est écrite, elle vaut 8,7 et reste sous la barre à cause d'une phrase fausse (« Huit visages se tournent vers toi » alors que tu es l'un des huit), d'une redite dans le renvoi à l'article et d'un PS qui commence dans le vide. Avec les 7 retouches mot pour mot ci-dessous, elle monte à 9,5. La (b) est propre mais moyenne (7,6) : une faute de connecteur, une joueuse banale et un article qui ne traite pas sa situation. La (c) est éliminée (6,2) : elle double une fiche du carnet de novembre et contient trois phrases fausses.

## Classement

| Rang | Candidate | Note telle quelle | Verdict | Après retouches |
|---|---|---|---|---|
| 1 | (a) « Alors, t'as perdu ta langue ? » | **8,7** | NO-GO en l'état, **GO après les 7 retouches** | **9,5** |
| 2 | (b) L'étiquette de l'hôte | **7,6** | NO-GO (sous la barre, pas éliminatoire) | 8,5 au mieux sans réécrire la joueuse |
| 3 | (c) La raclette et le jeu | **6,2** | **ÉLIMINÉE** | sans objet |

## Gates ad hoc (définies avant la lecture)

| # | Gate | (a) | (b) | (c) |
|---|---|---|---|---|
| A1 | Objet de 45 caractères au plus (recompté) | PASS (29) | PASS (39) | PASS (37) |
| A2 | Zéro tiret cadratin ou demi-cadratin (Grep sur le fichier : 0) | PASS | PASS | PASS |
| A3 | Rien de commercial hors PS (« € », « Premium », `/abonnement` seulement l. 66-67, 126-127, 186-187) | PASS | PASS | PASS |
| A4 | L'article existe et colle à la lettre | PASS (`blog-articles.ts:3634`, « 7 techniques », « trois phrases d'entrée passe-partout » l. 3670) | **FAIL partiel** : l'article existe (fiche S2, en base depuis le 12/10, non relu en base) mais il apprend à se présenter, pas à répondre à la présentation d'un autre | PASS (`:1939`, 6 techniques, accord exagéré l. 1959, rebond sur mot-clé l. 1978) |
| A5 | L'étape de fin existe et colle | PASS : Répartie 3 « Retourner les piques avec le sourire » (`parcours-etapes.ts:27`), c'est exactement le sujet | **FAIL partiel** : Confiance 6 existe (`:37`), mais c'est la dernière étape d'un parcours « pour toi si tu sors d'une période compliquée » (`:39`) | **FAIL** : Storytelling 3 « Faire le bilan de ton raté » (`:45`) parle d'anecdote, pas de répartie |
| A6 | Pas de ressemblance avec une fiche existante | PASS (aucune pique sur le silence remarqué dans le carnet, les décryptages ou les vidéos ; seule occurrence : la lettre réservée W46 elle-même, `hebdo-premium.json:5`) | PASS | **FAIL éliminatoire** (voir (c)) |
| A7 | Aucune phrase fausse | **FAIL** (1 fausse, 1 bancale) | **FAIL** (1 faute de sens) | **FAIL** (3 fausses) |
| A8 | Ton (pote drôle, ni coach ni scolaire, humour au niveau validé) | PASS avec réserves (PS) | FAIL partiel (joueuse sous la barre) | FAIL (joueuse déjà entendue) |
| A9 | Saison juste, entrée directe, répliques sans mode d'emploi | PASS | PASS | **FAIL** (la pique elle-même demande à être expliquée) |
| G_PROOF | Chaque affirmation vérifiable est sourcée | PASS (prix `premium.ts:32`, première étape sans compte `llms-parcours.ts:19`, ancre `#etape-N` `parcours-step-card.tsx:206`, jeudi 05/11/2026 recalculé) | idem | idem |

Non vérifié par moi : « résiliable en ligne » (commun aux trois PS, à confirmer par @fullstack sur le portail Stripe avant l'envoi).

## Top 3 corrections prioritaires

1. **(a), phrase fausse** : « Huit visages se tournent vers toi. » La lettre vient de dire « Vous êtes huit », toi compris. Il ne reste que sept visages pour se tourner. Un lecteur attentif le voit dès la quatrième ligne de la vitrine du site.
2. **(a), renvoi à l'article** : « Notre article « Rester muet en groupe : 7 techniques… » donne sept techniques » répète le titre qu'il vient de citer, et la phrase d'avant (« n'a rien d'un défaut de caractère ») est le seul passage coach de la lettre.
3. **(a), PS** : « si cette lettre te parle, Premium est fait pour ça » : « ça » ne renvoie à rien, et la phrase suivante redit « une lettre » deux fois.

---

## (a) « Alors, t'as perdu ta langue ? » : 8,7/10 telle quelle

**Ce qui tient.** L'entrée est la meilleure des trois : pluie, salon, huit personnes, balcon impraticable, une demi-heure de silence, la pique en sixième ligne. Les trois répliques se comprennent sans notice. La joueuse (les objets trouvés et leur heure de fermeture) prend l'expression au pied de la lettre, et le détail administratif est trouvé. La risquée (« Tu parlais déjà pour trois. J'ai pris ma journée. ») est la meilleure réplique des trois lettres : courte, logique, une chute qu'on ne voit pas venir. L'erreur (« s'expliquer ») est vraie, bien illustrée, et annoncée dès l'introduction (« aucune ne s'explique »). L'étape de fin colle mot pour mot au sujet. La lettre ne ressemble à aucune fiche du site : le carnet donne une réplique et une version « si c'est tendu », la lettre donne trois crans et une règle pour choisir.

**Défauts.**
1. Phrase fausse : « Huit visages » (voir le Top 3). Le pré-en-tête « Une pique devant huit personnes » a le même défaut.
2. L'introduction des trois noms est lourde : deux parenthèses, « entre les deux », puis « entre elles » dans la même phrase.
3. La joueuse se passe un samedi soir. « Je repasse demain » renvoie donc à un dimanche, jour où ce genre de guichet est fermé. « Lundi » corrige la logique et allonge la chute : un week-end entier sans langue, dans les règles.
4. La risquée exige que Hugo parle beaucoup, mais la scène ne le montre pas : le lecteur découvre la condition après coup. En installant Hugo bavard dans la scène, la réplique tombe toute seule.
5. Renvoi à l'article : la redite et le passage coach (Top 3, n° 2).
6. PS : « ça » sans référent, et « une lettre » répété (Top 3, n° 3).
7. Mineur : « énergie sociale » sonne comme du jargon de développement personnel.

Non retenu (choix délibéré) : le masculin de « Je suis passé » et de « seul » suit la convention du site (le carnet écrit « fier », « nul ») ; une lectrice adapte d'elle-même. La signature « L'Équipe Deviens Marrant » est commune aux trois lettres, voir « Décisions à confirmer ».

### Retouches mot pour mot (de 8,7 à 9,5)

| # | Remplacer | Par | Pourquoi |
|---|---|---|---|
| R1 | Pré-en-tête : « Une pique devant huit personnes, trois réponses, et comment choisir selon la personne. » | « Une pique devant tout le salon, trois réponses, et comment choisir la tienne. » | Plus de compte faux ; « selon la personne » était flou. |
| R2 | « Hugo a fini par le remarquer : » | « Hugo, qui raconte son week-end depuis vingt minutes, a fini par le remarquer : » | Installe le bavard, et la risquée n'a plus besoin de mode d'emploi. Vingt minutes, contre ta demi-heure de silence : rien ne se contredit. |
| R3 | « Huit visages se tournent vers toi. » | « Sept visages se tournent vers toi. » | Phrase fausse. |
| R4 | « Voici trois réponses, de la plus prudente (la sûre) à la plus audacieuse (la risquée), la joueuse entre les deux, et comment choisir entre elles. » | « Voici trois réponses, de la plus prudente à la plus audacieuse : la sûre, la joueuse, la risquée. Puis comment choisir. » | Les noms sont dans l'ordre de lecture, sans parenthèses ni double « entre ». |
| R5 | « Je suis passé aux objets trouvés, mais ils ferment à 18 h. Je repasse demain. » et, dans le commentaire, « avant « Je repasse demain » » | « Je suis passé aux objets trouvés, mais ils ferment à 18 h. Je repasse lundi. » et « avant « Je repasse lundi » » | Juste un samedi soir, et le week-end sans langue ajoute un étage à la logique de guichet. |
| R6 | « Rester muet en groupe n'a rien d'un défaut de caractère. Notre article « Rester muet en groupe : 7 techniques pour reprendre la parole » donne sept techniques, dont des phrases d'entrée à garder en poche. Il est en lecture libre. » | « Et pour placer un mot avant qu'un Hugo le remarque, notre article « Rester muet en groupe : 7 techniques pour reprendre la parole » en donne sept, dont trois phrases d'entrée à garder en poche. Il est en lecture libre. » | Plus de redite ni de phrase coach. Le renvoi part de la scène, et « trois » est exact (`blog-articles.ts:3670`). |
| R7 | « PS : si cette lettre te parle, Premium est fait pour ça. Une lettre chaque jeudi : la lettre du mois, puis des lettres réservées aux abonnés, du même genre que celle-ci. Tu ouvres aussi » | « PS : avec Premium, une lettre comme celle-ci arrive chaque jeudi : la lettre du mois, puis des lettres réservées aux abonnés. Tu ouvres aussi » | Le « ça » sans référent disparaît, la redite aussi. La suite du PS ne change pas. |

Retouche facultative (ne compte pas dans le 9,5) : « ou quand il te reste peu d'énergie sociale » devient « ou quand tu n'as plus beaucoup d'énergie ce soir-là ».

**Après R1 à R7 : 9,5/10.** Le demi-point qui manque tient à la sûre (« je la garde au chaud ») : juste, mais attendue, ce qu'on demande à une sûre. Ne pas la durcir.

**Obligatoire si (a) part :** la retouche R5 crée une nouvelle réplique. Elle repasse une relecture à l'aveugle (règle d'or P0 s18) avant l'envoi. Il faut aussi retirer W46 de `hebdo-premium.json`, sinon les abonnés recevraient la même lettre le 12/11.

---

## (b) L'étiquette de l'hôte : 7,6/10

**Ce qui tient.** La scène est bien vue (odeur de pizza et de peinture fraîche, Théo qui claque dans ses mains). La risquée (« Et voici Théo, qui a trois histoires. Vous allez toutes les entendre ce soir. ») est bonne : elle rend la présentation sur le même ton et vient d'une observation vraie. L'erreur (« parler beaucoup pour prouver le contraire ») est neuve et juste.

**Défauts.**
1. Faute de sens dans la sûre : « Théo a raison. En échange, j'écoute tout et je retiens tout. » Avoir raison ne s'échange contre rien. Il faudrait « En revanche » ou « Mais ». Elle est reprise telle quelle dans l'exercice (« En échange, … »).
2. La joueuse est sous la barre : « rythme de croisière » est une expression toute faite. Et la réplique fait onze mots alors qu'elle annonce six mots par heure. Cette contradiction n'est pas exploitée, elle passe pour un oubli.
3. La règle de choix sépare « affectueux » et « complice », deux tons que le lecteur ne sait pas distinguer en direct.
4. L'article apprend à se présenter soi-même au tour de table (fiche S2, l. 30-42), pas à répondre à la présentation d'un autre. La phrase de transition (« c'est subir sa formule ») reconnaît l'écart sans le combler.
5. L'étape de fin est Confiance 6, la dernière étape d'un parcours dont la cible est « tu sors d'une période compliquée » : ce n'est ni le bon public ni la bonne porte d'entrée.
6. Calendrier : W46, le 12/11, garde le chambrage sur le silence en soirée, avec une risquée qui retourne elle aussi le bavardage de l'autre. Les abonnés auraient deux fois le même ressort en sept jours. L'article est aussi celui de la lettre n°5 (04/03).

Pas d'éliminatoire au sens strict, mais quatre défauts de fond : elle ne monte pas à 9 sans une nouvelle joueuse, qui repasserait une relecture à l'aveugle.

---

## (c) La raclette et le jeu : 6,2/10, ÉLIMINÉE

**Éliminatoire 1 : elle double une fiche existante.** `carnet/2026-11.json:164-173`, « Le perdant officiel » : « Il pleut dehors, quelqu'un sort une boîte de jeu de société », pique « Toi, tu perds à tous les jeux de société. » Le sujet réel de la lettre, c'est « on te chambre après une défaite au jeu » : l'exercice le dit (« la dernière fois qu'on t'a chambré après une défaite »), la règle (le score) et les trois répliques aussi. Le décor, la saison et la situation sont ceux de cette fiche, dans le carnet du même mois. En plus, la fiche du samedi 07/11 (`:79-89`, « Le poêlon sous surveillance ») est une raclette, le jour même de la scène.

**Éliminatoire 2 : la pique demande un mode d'emploi.** « Tu joues comme tu parles : pas un mot. » Aux cartes, on ne joue pas avec des mots, et la pique ne dit pas si elle vise ton silence ou tes défaites. Les réponses, elles, parlent toutes du score. C'est exactement le motif du refus précédent, et c'est aussi l'objet du mail.

**Phrases fausses.**
1. « Elle le félicite sans te rabaisser » : la sûre (« Tu as quatre points d'avance, pas un de plus ») ne félicite pas Nico.
2. « Si tu perds largement, la sûre ou la joueuse : tu ris de toi » : la sûre ne rit pas de toi, elle surveille le score de l'autre.
3. « Je vais voir si le fromage est prêt » : à une raclette, le fromage fond sur la table, devant tout le monde. Il n'y a rien à surveiller en cuisine.
4. Chronologie : le jeu de cartes est sorti « pour la suite », alors que tu as déjà perdu trois parties pendant que l'appareil « chauffe ».

**Autres défauts.** La joueuse (« je t'ai laissé gagner exprès ») est déjà entendue partout. La risquée exige que tu ne sois pas dernier, alors que la scène vient de te faire perdre trois parties de suite : la lettre interdit sa propre risquée. « Une demande de revanche est la meilleure des répliques » contredit les trois répliques proposées. L'étape Storytelling 3 n'a pas de rapport avec le sujet. Les trois répliques font 16 mots chacune.

---

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| (a), lettre du mois du 05/11 | `lettre/hebdo-premium.json:5` (W46, 12/11) | Même lettre à sept jours d'écart | Bloquante si (a) part | Retirer W46 et écrire la lettre d'études prévue par le plan (@copywriter) |
| `lib/llms-content.ts:148` (« Une vanne décryptée par mois, avec un exercice ») | Format « trois réponses » des lettres du mois | La promesse publique de la lettre ne décrit pas ce qu'elle devient | Moyenne (concerne aussi `numeros.json:10`, non relu) | @copywriter et @fullstack alignent la description avant le 05/11 |
| Fiche S2, l. 19 (« zéro humoriste ») | CLAUDE.md, P0 s15 (« humoristes nommés autorisés partout ») | Règle obsolète dans une fiche validée | Faible (pas de lien avec la n°1) | Signaler à @copywriter, sans toucher à l'article publié |

## Angles morts

- « Résiliable en ligne » n'est vérifié dans aucun des trois dossiers : @fullstack doit le confirmer (portail de facturation accessible depuis le compte).
- Le lien vers l'étape 3, hors PS, mène un lecteur à compte gratuit sur une étape réservée, sans prévenir. Ce n'est pas commercial dans le texte, mais c'est un mur au clic. Le format l'a voulu ainsi (plan § 5), donc je ne le compte pas en défaut. Voir les décisions.

## Décisions à confirmer par l'utilisateur

1. Choisir (a) supprime W46 du 12/11 (le plan prévoit une lettre d'études à sa place) : à confirmer.
2. Signature « L'Équipe Deviens Marrant » : en français courant, on écrirait « L'équipe Deviens Marrant » (L'Équipe avec majuscule, c'est le quotidien sportif). À trancher pour toute la série, la n°1 n'est pas seule concernée.
3. Faut-il ajouter « (réservée aux abonnés) » au lien d'étape, ou garder le format actuel ?

## Recommandation

**GO pour (a), sous trois conditions** : appliquer R1 à R7 mot pour mot, faire relire la réplique modifiée par R5 à l'aveugle, retirer W46. **NO-GO pour (b)**, sous la barre. **(c) éliminée.** Agents à relancer : @copywriter (retouches de (a), retrait de W46, description publique de la lettre), @fullstack (vérification de « résiliable en ligne »).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-n1-candidates-s22-editeur.md`
- Décisions prises : (a) 8,7 puis 9,5 après retouches, GO conditionnel ; (b) 7,6, NO-GO ; (c) 6,2, éliminée (doublon de `carnet/2026-11.json:164`, pique à mode d'emploi, trois phrases fausses)
- Points d'attention : retrait de W46 obligatoire si (a) part ; R5 repasse une relecture à l'aveugle ; « résiliable en ligne » non vérifié ; promesse « une vanne décryptée par mois » (`llms-content.ts:148`) à aligner
---
