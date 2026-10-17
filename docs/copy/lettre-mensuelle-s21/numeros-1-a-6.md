# La lettre mensuelle gratuite : numéros 1 à 6 (novembre 2026 à avril 2027)

> Session 21, 17/10/2026. Statut : BROUILLONS à relire à l'aveugle (règle d'or s18), puis à valider par Thomas avant tout envoi. Rien n'est codé ni envoyé.
> **Mise à jour tour 2 (17/10)** : le duel à l'aveugle du n°1 (3 relecteurs, 3 sur 3) a donné gagnante la version à exercice en 3 temps, jugée « de peu sous la barre ». Elle est retouchée ci-dessous (n°1) et les mêmes leçons sont appliquées aux n°2 à 6. Le n°1 retouché a repassé le duel (`pack-relecture-n1-tour2.md`) : **VALIDÉ, 3 relecteurs sur 3, au niveau (8/10 chacun)**. **Les n°2 à 6 n'ont jamais été relus à l'aveugle** : les remarques mineures du n°1 (référent ambigu du pont, répétition entre le texte et le libellé du lien) leur ont été appliquées, puis chaque numéro est opposé à une 2e version complète dans `pack-relecture-n2-a-6.md` (5 duels, clé de tirage conservée par l'orchestrateur, jamais dans ce dossier). Les textes ci-dessous sont les versions actuelles des n°2 à 6, **en attente de ce duel** (voir §8).
> Promesse tenue par chaque numéro : « Une vanne décryptée par mois » (`docs/ux/lettre-inscription-s21.md` §3), pas plus d'un e-mail par mois, gratuit, sans compte.
> Sources lues : `project-context.md`, `docs/founder-preferences.md` (01/10, 06/05, 14/10, 17/10), `docs/copy/ton-alex.md`, `docs/copy/charte-refonte-copy-s11.md`, `docs/ux/lettre-inscription-s21.md`, `docs/marrant/playbook.md` (test stand-up), `docs/seo/calendrier-editorial-q4-2026.md`, fiches des articles liés.
> `[Framework : value-first en trois temps (une vanne, son mécanisme, un geste à faire soi-même), puis une ressource gratuite, puis une seule invitation Premium en fin de lettre]` · `[Conscience : Problem-Aware, la personne s'est inscrite parce qu'elle veut être plus drôle, elle connaît son problème, pas encore la méthode]`

## 0. Synthèse

| N° | Mois | Fenêtre d'envoi conseillée (date plancher) | Thème | Vanne du catalogue (id) | Technique | Lien gratuit (article ou étape 1) |
|---|---|---|---|---|---|---|
| 1 | Nov. 2026 | 17 au 24/11 (plancher **16/11**) | Soirée de Noël au boulot | `cs14jkf30f2d648e83002b90` (BOULOT) | L'aveu par le geste | `/blog/soiree-de-noel-entreprise-humour` |
| 2 | Déc. 2026 | 7 au 16/12 (plancher **23/11**) | Repas de famille de Noël | `cs14jk46b113c7c6bcb044ba` (OBSERVATIONNEL) | La double lecture | `/blog/repas-de-famille-questions-genantes-humour` |
| 3 | Janv. 2027 | 5 au 15/01 (plancher **28/12**) | Résolutions de janvier | `cs14jk9cc844b92fde69e845` (AUTODERISION) | Le rôle de figurant | `/blog/resolution-nouvelle-annee-etre-plus-drole` |
| 4 | Févr. 2027 | 1 au 10/02 (plancher **29/10/2026**) | Saint-Valentin, premiers rendez-vous | `cs14jk55b4243d4d1c132b97` (DATING) | La précision absurde | `/blog/premier-message-drole-appli-de-rencontre` |
| 5 | Mars 2027 | 15 au 26/03 (plancher **25/02**) | Avant le 1er avril | `cs14jke10b58d158ae638560` (COUPLE) | Le geste normal devenu suspect | `/blog/blagues-poisson-d-avril-adultes` |
| 6 | Avr. 2027 | 8 au 20/04 (aucun plancher) | Festivals d'été, budgets | `cmp9gspno007ms60xngd592ct` (CULTUREL) | La solution démesurée | `/parcours/repartie#etape-1` (étape 1 gratuite) |

- **Jours d'envoi : à fixer par Thomas** (aucune date décidée, `lettre-inscription-s21.md` §7.1). Les fenêtres ci-dessus sont des conseils tirés de la saison ; la contrainte dure est la **date plancher** : un numéro ne part jamais avant la publication de l'article qu'il cite. Le modèle `NewsletterIssue` porte une date prévue par numéro, donc rien n'oblige à un même jour du mois.
- **Une catégorie différente par numéro**, six techniques différentes, aucune vanne déjà utilisée dans l'article lié (vérifié par recherche dans les fichiers des articles, voir §8).
- **Origine des vannes** : `docs/content/vannes-actives-s19.json` (export prod en lecture seule du 11/10/2026, 132 vannes actives). Textes recopiés mot pour mot. Décryptages : catalogue (`docs/copy/audit-vannes-s14/decryptage-ecrit-1.json` et `-2.json`, `decryptage-5-anciennes-ecrit.json`), repris presque à l'identique, retouchés seulement pour le tutoiement.
- **Rien d'inventé** : aucun chiffre hors des vannes et des faits déjà publiés sur le site (« 15 à 20 minutes par semaine selon le parcours », 29/09 ; « quatre semaines », « six questions », « règle des 3 zones », chiffres de leurs articles). Aucun prix (la constante `PREMIUM_PRICE_LABEL` peut changer : on n'écrit pas le montant dans un numéro préparé).

## 1. Trame commune (identique aux six numéros)

1. **Objet** : l'amorce de la vanne ou sa situation, **jamais la chute** (tour 1 : l'objet qui donne la chute grille la vanne, 3 relecteurs sur 3), jamais « Lettre n°X ». 3 variantes par numéro, une recommandée. 45 caractères au plus pour tenir sur mobile.
2. **Pré-en-tête** : une ligne qui dit ce que c'est (« La vanne du mois, … »), sans répéter l'objet, sans énumération par trois, sans promesse d'usage (« dès ce soir », « à ressortir à… ») que le numéro ne tient pas.
3. **Corps** (cible : 200 à 240 mots, une lecture de 1 à 2 minutes) : salut, une accroche de saison de 2 phrases, la vanne en citation, « Pourquoi ça marche », « À toi de jouer », un lien vers un contenu gratuit, **une seule** invitation vers Premium (en bas, jamais en haut), signature.
4. **Signature** : « L'Équipe Deviens Marrant » (e-mail automatique, règle du 14/10). Voix du site : « tu », « on », jamais de « je » (le « je » est celui des vannes).
5. **Pied de page standard** (recopié dans chaque numéro) :
   > Tu reçois cette lettre parce que tu as demandé à la recevoir sur deviens-marrant.fr. Elle arrive une fois par mois, pas plus.
   > Te désinscrire en un clic : `{{lien_desinscription}}`
   > Deviens Marrant, `{{mention_editeur}}` · Confidentialité : https://deviens-marrant.fr/confidentialite · Mentions légales : https://deviens-marrant.fr/mentions-legales
   - `{{lien_desinscription}}` = `buildUnsubscribeUrl` (`lib/newsletter.ts`) ; l'en-tête `List-Unsubscribe` One-Click est prévu au §7.2 de la spec UX.
   - `{{mention_editeur}}` = `[À COMPLÉTER : identification de l'éditeur, formulation selon l'avis @legal, question 3 du §8 de lettre-inscription-s21.md]`. Rien n'est inventé ici.
6. **Liens** : `https://deviens-marrant.fr<chemin>?utm_source=lettre&utm_medium=email&utm_content=nX-article` (ou `nX-premium`). Vers un parcours : ajouter `#etape-1`. Point pour @fullstack : `lettre` n'est pas dans la liste blanche `Origine` de `lib/attribution.ts` (sinon l'origine est perdue) ; et `/abonnement?…` est bloqué aux robots (`robots.ts`), sans effet sur les clics.
7. **Vocabulaire protégé** : « la lettre », jamais « newsletter » ni « abonnement » pour la lettre (« abonné » = Premium payant). Pas de « sans pub » (une mention Premium existe). Rien sur la lettre hebdomadaire Premium tant qu'elle n'existe pas.
8. **Une invitation Premium par numéro**, formulée comme une proposition (ton d'Alex : on propose, on n'impose), toujours vraie : « sans engagement » et « la première étape de chaque parcours se lit sans compte » sont des phrases déjà publiées sur le site.
9. **Leçons du tour 1, appliquées à chaque numéro** : (a) l'exemple de « À toi de jouer » **transpose le mécanisme dans une autre situation**, il ne rejoue pas la vanne avec d'autres mots ; (b) les étapes de l'exercice ne se contredisent pas ; (c) le pont vers l'article décrit ce que l'article fait réellement, sans « plan complet » ni autre promesse large, et ne prétend pas que la vanne y figure ; (d) pas de morale de clôture (« on rit de la situation, jamais de la personne ») ; (e) pas de triple énumération, pas de répétition de mot à courte distance ; (f) le même mot pour le même objet (titre de l'article, libellé du lien, texte).
10. **Garde-fou d'humour** : si une vanne tombe sous la barre à la relecture, le numéro part **sans vanne** (réserve de remplacement au §8), jamais avec une vanne moyenne.

---

## 2. Numéro 1 : novembre 2026, la soirée de Noël au boulot

> **Version retenue : « A » du tour 1 (exercice en 3 temps), retouchée** selon les 3 verdicts à l'aveugle (A choisie 3 sur 3, notes 7, 7,5 et 7,5 sur 10, « de peu sous la barre »). La version « B » du tour 1 (objet = chute) est abandonnée, sauf son trait « une vanne ratée dure jusqu'en janvier », repris. Statut : **VALIDÉ au duel tour 2** (`verdict-n1-tour2-reviewer-{1,2,3}.md` : A choisie 3 sur 3, « = », 8/10 ; B « < »). Deux retouches de confort restent possibles (référent de « Celle de ce mois », libellé du lien qui répète « la soirée de Noël au boulot ») : **non appliquées**, car toute modification repasse la relecture à l'aveugle (règle d'or s18) et le texte est déjà au niveau.

**Envoi** : 17 au 24/11 (jamais avant le 16/11, publication de l'article lié).
**Objet (3 variantes)**
1. **On a comparé nos salaires** (RECOMMANDÉ : l'amorce de la vanne, un sujet tabou, la chute reste dans le corps ; 3 relecteurs sur 3 l'ouvriraient)
2. On a enfin comparé nos salaires
3. Une vanne avant la soirée de Noël

**Pré-en-tête** : La vanne du mois, et pourquoi elle tombe juste.
(Piste « à ressortir au pot de fin d'année » écartée : l'article classe les salaires en zone rouge, voir Contrôle.)

**Corps**

Salut,

> Avec un collègue, on a enfin comparé nos salaires.
> Il a payé le café. Sans un mot.

C'est la vanne du mois.

**Pourquoi ça marche**
Le geste remplace la conversation. Payer le café, c'est avouer que l'écart de salaire était réel, et injuste, sans jamais le dire. Plus la révélation reste sous-entendue, plus elle pèse : le rire vient de là.

**À toi de jouer**
1. Pense à une vérité gênante que chacun préfère ne pas dire tout haut.
2. Au lieu d'en parler, fais réagir ton personnage par un geste petit et précis, qui avoue tout.
3. Écris deux phrases, la seconde plus courte que la première.

Exemple : « Mon coloc a fini par remarquer que sa chambre faisait le double de la mienne, pour le même loyer. Depuis, il descend les poubelles. »

À la soirée de Noël au boulot, une vanne ratée dure jusqu'en janvier. L'article suit la soirée moment par moment, de l'arrivée au départ, avec la règle des 3 zones pour savoir de quoi rire et de quoi s'abstenir. Celle de ce mois parle de salaires : il les range en zone rouge, donc elle reste pour la machine à café. L'article est en lecture libre.
Lire l'article sur la soirée de Noël au boulot : https://deviens-marrant.fr/blog/soiree-de-noel-entreprise-humour?utm_source=lettre&utm_medium=email&utm_content=n1-article

PS : si une vanne par mois ne te suffit pas, les parcours complets sont dans Premium, sans engagement. La première étape de chacun se lit sans compte.
Voir les parcours : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n1-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `docs/content/vannes-actives-s19.json`, id `cs14jkf30f2d648e83002b90` ; décryptage : `docs/copy/audit-vannes-s14/decryptage-ecrit-1.json` (vid V144), identique dans `docs/content/boulot-base-s19.json`.
- **Trace de relecture** : vanne : tour 2 à l'aveugle, « = » chez les deux relecteurs (`neuves-aveugle-2-critique-A.md` l.66 et `-B.md` l.66 ; B la place dans son top 4, A la range parmi les « = » les plus fragiles). Numéro entier : tour 1 du duel (`verdict-n1-reviewer-{1,2,3}.md`), A choisie 3 sur 3 mais « < » de peu ; version retouchée à repasser (`pack-relecture-n1-tour2.md`).
- **Retouches du tour 2 (6 convergences des verdicts)** : (1) pré-en-tête sans triple ni « dès ce soir » ; (2) exemple « coloc » qui transpose le mécanisme (aveu par le geste) dans une autre situation, étapes 1 et 2 rendues cohérentes (une vérité qu'on ne dit pas, puis un geste, plus de « moment sans conversation » suivi de « remplacer la conversation ») ; (3) « voici le plan complet » supprimé, remplacé par « l'article suit la soirée moment par moment » ; (4) « personne » : 4 occurrences en 11 lignes réduites à 0 dans le texte de la lettre (hors vanne), « sans un mot » une seule fois (dans la vanne) ; (5) trait « une vanne ratée dure jusqu'en janvier » repris de B, placé dans le pont vers l'article (où il sert le lien) ; (6) faits vérifiés, voir ci-dessous.
- **Lien** : `soiree-de-noel-entreprise-humour`, fiche `docs/copy/articles-q4/S7-soiree-de-noel-entreprise.md`, validée par Thomas (GO 03/10), publication prévue le 16/11. **Cette vanne n'est pas dans l'article** (ses 5 vannes sont d'autres ids). [À VÉRIFIER en base avant envoi : article publié.] L'article n'est pas dans `blog-articles.ts` (recherche faite) : il entre en base par `scripts/import-article`, la fiche S7 est donc la seule source de contenu dans le dépôt.
- **Vérifications contre la fiche S7 (6e convergence)** :
  - « règle des 3 zones » : exacte (vert = toi et la situation, orange = un collègue précis, rouge = ce qu'on ne touche pas).
  - Liste des moments : l'article en compte **cinq** (arrivée, direction, Secret Santa, **verre de trop**, départ). L'ancienne liste de quatre en omettait un : remplacée par « de l'arrivée au départ ».
  - « La première étape se lit sans compte » : exact (`config/blog-cta.ts` : « La première étape se lit sans compte » ; `lib/llms-parcours.ts` : première étape « en lecture libre et sans compte »). « Sans engagement » : exact (`lib/llms-content.ts`).
  - **Écart découvert, corrigé** : la fiche S7 range **« l'argent (salaires, primes) » en zone rouge**. Dire de cette vanne (salaires) qu'« elle ne vise personne » et qu'on peut « la sortir au pot » contredisait l'article lié. Le pont le dit maintenant en une phrase et renvoie la vanne à la machine à café. Le point d'attention du relecteur 1 (salaires devant la direction) est ainsi traité.
  - Libellé : l'article s'intitule « Soirée de Noël au boulot » ; le texte, le lien et la synthèse disent désormais tous « soirée de Noël au boulot » (plus de « pot de fin d'année » ni de « pot de Noël »).
- **Faits repris** : « règle des 3 zones », parcours de l'arrivée au départ, zone rouge pour l'argent (fiche S7).
- **Objection traitée** : « je vais dire une bêtise devant la direction » (règle des 3 zones citée, zone rouge nommée, plan de l'article).
- **Voix** : décryptage du catalogue gardé presque mot pour mot (barre s11 §4), seul « sans un mot » retiré du décryptage pour ne pas doubler la vanne ; accroche et ponts écrits pour la lettre.

---

## 3. Numéro 2 : décembre 2026, le repas de famille

**Envoi** : 7 au 16/12 (jamais avant le 23/11, publication de l'article lié ; avant les repas du 24 et du 25).
**Objet (3 variantes)**
1. **La question de ta grand-mère, à Noël** (RECOMMANDÉ : la situation, sans la chute, que tout le monde reconnaît)
2. « T'as quelqu'un ? », version Noël
3. Une vanne de grand-mère, pour Noël

**Pré-en-tête** : La vanne du mois, avant le repas de Noël.

**Corps**

Salut,

À Noël, il y a toujours un proche pour poser la question. Tu sais laquelle. Voici la vanne du mois.

> Ma grand-mère m'a demandé si j'avais quelqu'un dans ma vie. J'ai dit non.
> Elle a dit qu'elle allait en parler à quelqu'un de plus haut placé.

**Pourquoi ça marche**
Le mot « quelqu'un » a un sens amoureux pour toi et un sens hiérarchique pour ta grand-mère. Elle répond avec sa logique à elle, parfaitement cohérente, et on comprend en une seconde ce qu'elle a compris. La chute est douce parce que la grand-mère est prête à tout pour t'aider, quitte à passer par le haut de l'échelle.

**À toi de jouer**
1. Choisis un mot qui a deux sens courants.
2. Fais-le employer, dans le premier sens, par quelqu'un qui te pose une question.
3. Réponds-lui avec aplomb dans le second.

Exemple : « Mon banquier m'a demandé si j'avais des économies. J'ai dit que je ne chauffais plus que la cuisine. »

**Pour les autres questions**
Dans l'article, cette question ouvre une liste de six questions de Noël qui piquent : cinq ont leurs réparties, la sixième une limite posée avec le sourire, et chacune une sortie si on insiste. Le tout est en lecture libre.
Lire l'article sur le repas de famille : https://deviens-marrant.fr/blog/repas-de-famille-questions-genantes-humour?utm_source=lettre&utm_medium=email&utm_content=n2-article

Pour répondre du tac au tac sans avoir préparé, le parcours Répartie est dans Premium, sans engagement. Son étape 1 se lit sans compte.
Voir le parcours Répartie : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n2-premium

Bonnes fêtes. Rendez-vous en janvier,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cs14jk46b113c7c6bcb044ba` ; décryptage : `decryptage-ecrit-2.json` (vid V487) et `docs/content/vannes-actives-s17.json` l.280 (même texte).
- **Trace de relecture** : tour 1 à l'aveugle, « = » chez les deux relecteurs (`neuves-aveugle-1-critique-A.md` l.155 : « chute imprévue, logique » ; `-B.md` l.155 : « courte, tendre », dans son top 7).
- **Lien** : `repas-de-famille-questions-genantes-humour`, étalon S8 (`docs/copy/articles-q4/S8-repas-de-famille.md`, GO Thomas 30/09), publication 23/11. La vanne n'y figure pas (elle est dans `phrases-droles-conversations`, `blog-articles.ts` l.1277, autre article). [À VÉRIFIER en base : article publié.]
- **Faits repris** : « six questions », « plan B si on insiste », « Alors, t'as quelqu'un ? » en question n°1 (fiche S8, lignes 11 et 55). « Réparties désamorçant sans froisser » (excerpt S8) volontairement non repris : promesse plus large que ce que la lettre peut garantir.
- **Tour 2** : titre d'objet = la situation (plus la fin de la chute) ; exemple « banquier » = même mécanisme (double lecture) dans une autre situation, en 2 phrases, avec les 3 étapes en miroir ; morale de clôture retirée. **Exemple à relire à l'aveugle.**
- **Objection traitée** : « je vais vexer ma famille » (réparties et plan B de l'article).
- **Parcours Répartie** : « apprends à la dire à voix haute et au bon moment » (description du parcours dans `docs/content/parcours-seed.json`), à contrôler en prod.

---

## 4. Numéro 3 : janvier 2027, les résolutions

**Envoi** : 5 au 15/01 (jamais avant le 28/12, publication de l'article lié).
**Objet (3 variantes)**
1. **J'ai pris un chien pour me faire des amis** (RECOMMANDÉ : le début de la vanne, on veut la suite)
2. Moi, je tiens la laisse
3. Résolution : se faire des amis, version chien

**Pré-en-tête** : La vanne du mois, pour les plans de janvier.

**Corps**

Salut,

Bonne année. Janvier, c'est la saison des plans pour changer de vie, et certains sont plus ingénieux que d'autres. En voici un, côté amitié.

> J'ai pris un chien pour me faire des amis.
> Il en a plein. Moi, je tiens la laisse.

**Pourquoi ça marche**
Le plan marche, mais au profit de quelqu'un d'autre : le chien est le vrai sociable, toi tu tiens la laisse. Tu vois l'image, le narrateur au bout d'une corde, à peine dans la scène. Les deux dernières phrases sont volontairement plates, ce qui accentue la tristesse comique.

**À toi de jouer**
1. Choisis un but, par exemple qu'on vienne te parler.
2. Ajoute un intermédiaire censé t'aider à l'atteindre.
3. Raconte le résultat : c'est lui qui en profite, toi tu restes à l'arrière-plan.

Exemple : « J'ai acheté une plante pour qu'on vienne me parler au bureau. Tout le monde passe la voir. Moi, j'arrose. »

**Si « être plus drôle » est dans tes résolutions**
L'article propose une habitude de quelques minutes et un suivi sur quatre semaines, pour ne pas lâcher avant la mi-janvier. Il est en lecture libre.
Lire l'article : petit, daté, suivi : https://deviens-marrant.fr/blog/resolution-nouvelle-annee-etre-plus-drole?utm_source=lettre&utm_medium=email&utm_content=n3-article

Si tu préfères un cadre, les parcours complets sont dans Premium, sans engagement, à raison de 15 à 20 minutes par semaine selon le parcours. La première étape de chacun se lit sans compte.
Voir les parcours : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n3-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cs14jk9cc844b92fde69e845` ; décryptage : `decryptage-ecrit-2.json` (vid V414), même texte dans `vannes-actives-s17.json` l.130 ; liste « validées » : `docs/copy/catalogue-vannes-valides.md` l.17.
- **Trace de relecture** : tour 2 à l'aveugle, A « = » (`neuves-aveugle-2-critique-A.md` l.109), B « < » (« trope, chute jolie mais devinable », `-B.md` l.109), puis départage C « = » (`departage-critique-C.md` l.96) : 2 sur 3. **La plus fragile des six** : si la relecture la juge sous la barre, remplacer par la réserve R1 (§8).
- **Lien** : `resolution-nouvelle-annee-etre-plus-drole`, fiche S13 (GO Thomas 03/10), publication 28/12. Cette vanne n'est pas dans S13 (elle est dans A3 et S11, articles qui ne sont pas liés ici).
- **Faits repris** : « quelques minutes », « suivi sur quatre semaines », « avant la mi-janvier » (extrait S13) ; « 15 à 20 minutes par semaine selon le parcours » (founder-preferences 29/09).
- **Tour 2** : exemple « plante au bureau » = même mécanisme (l'intermédiaire récolte, toi tu tiens la laisse) dans une autre situation que les amis et le chien ; l'ancien exemple (salle de sport, coach, casier) refaisait la même quête d'amis. Exercice en 3 étapes. **Exemple à relire à l'aveugle.**
- **Objection traitée** : « je n'ai pas de temps » (quelques minutes, 15 à 20 minutes par semaine).

---

## 5. Numéro 4 : février 2027, avant la Saint-Valentin

**Envoi** : 1 au 10/02 (article lié publié depuis le 29/10/2026).
**Objet (3 variantes)**
1. **Le téléphone face contre la table** (RECOMMANDÉ : le décor de la vanne, une image qu'on a tous vue, la chute chiffrée reste dans le corps)
2. Mon date m'écoutait, téléphone retourné
3. Saint-Valentin : un rendez-vous, un téléphone

**Pré-en-tête** : La vanne du mois, avant le 14 février.

**Corps**

Salut,

Le 14 février approche, que tu aies un rendez-vous ou une soirée sur le canapé. Voici la vanne du mois, au cas où tu aurais déjà vu un téléphone s'inviter à table.

> Mon date a posé son téléphone face contre la table pour me montrer qu'elle m'écoutait.
> Il a vibré onze fois. Elle a tenu dix.

**Pourquoi ça marche**
Deux chiffres presque identiques, onze et dix, transforment l'écoute en épreuve d'endurance. Le téléphone gagne de justesse, comme un rival dans un match serré. Le verbe « tenu » fait basculer l'attention en effort sportif, et le décompte rend l'image impossible à oublier.

**À toi de jouer**
1. Prends une promesse, petite et sincère.
2. Mesure combien de temps elle a tenu.
3. Donne le score, serré : l'écart doit être minuscule.

Exemple : « Ma voisine a promis de baisser la musique à minuit. Elle a tenu jusqu'à minuit cinq. »

**Pour le premier message**
Si tu en es encore à écrire ton premier message, l'article part d'une bio ou d'une photo de voyage, et explique comment relancer après un silence sans insister. Il est en lecture libre.
Lire l'article : quoi écrire sur une appli : https://deviens-marrant.fr/blog/premier-message-drole-appli-de-rencontre?utm_source=lettre&utm_medium=email&utm_content=n4-article

Pour retrouver un humour qui te ressemble, à ton rythme, le parcours Confiance est dans Premium, sans engagement. Son étape 1 se lit sans compte.
Voir le parcours Confiance : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n4-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cs14jk55b4243d4d1c132b97` ; décryptage : `decryptage-ecrit-1.json` (vid V036), identique dans `vannes-actives-s17.json` l.980.
- **Trace de relecture** : tour 2, A « < » (« trope », `neuves-aveugle-2-critique-A.md` l.190), B « = » (« observation vraie, courte, précise », `-B.md` l.190), départage C « = » (`departage-critique-C.md` l.86) : 2 sur 3.
- **Lien** : `premier-message-drole-appli-de-rencontre`, fiche `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md`, publication 29/10/2026 (avancée du 03/12). La vanne n'y figure pas. **Redite à connaître** : A3 contient la vanne du n°3 (chien) ; assumé, le n°3 étant lu trois semaines plus tôt. Alternative sans redite : lier `blagues-de-couple-drole` (A4, publié le 05/11/2026).
- **Faits repris** : bio, photo de voyage, relance après un silence (extrait A3 ; « animal » et la phrase « le rire tombe sur toi… » retirés : triple énumération et morale). « 14 février » : date de calendrier.
- **Tour 2** : objet = le décor, plus la chute ; exemple « voisine, musique » = même mécanisme (score serré qui fait basculer une bonne intention en épreuve) dans une autre situation que le téléphone à table ; l'ancien exemple (notifications au repas) rejouait la vanne. Exercice en 3 étapes. **Exemple à relire à l'aveugle.**
- **Objection traitée** : « je ne sais pas quoi écrire au premier message » ; « je me sens nul en rendez-vous » (parcours Confiance : « un humour qui te ressemble », description du parcours).

---

## 6. Numéro 5 : mars 2027, avant le 1er avril

**Envoi** : 15 au 26/03 (jamais avant le 25/02, publication de l'article lié ; avant le 1er avril).
**Objet (3 variantes)**
1. **Le chargeur, un an après** (RECOMMANDÉ : l'objet et le délai, la chute reste dans le corps)
2. Mon copain m'a rendu mon chargeur
3. Avant le 1er avril, un geste trop gentil

**Pré-en-tête** : La vanne du mois, avant le 1er avril.

**Corps**

Salut,

Le 1er avril approche, la date où un geste gentil et inattendu passe pour un piège. Voici la vanne du mois.

> Mon copain m'a rendu le chargeur qu'il m'avait pris il y a un an.
> Je lui ai demandé s'il partait.

**Pourquoi ça marche**
Rendre un objet qu'on doit rendre est la chose la plus normale du monde, mais un an de retard a changé la lecture : ce retour ressemble à un adieu. Tu inverses la logique de la situation, et c'est l'habitude du retard qui devient la règle. La chute est une simple question, ce qui la rend encore plus sèche.

**À toi de jouer**
1. Choisis un comportement tout à fait correct, mais devenu rare chez quelqu'un de précis.
2. Montre-le en une phrase, sans le commenter.
3. Réagis comme devant un symptôme.

Exemple : « Mon frère a répondu à mon message dans l'heure. J'ai demandé à ma mère s'il était malade. »

**Pour le 1er avril**
L'article réunit des idées de canulars pour adultes, classées par terrain. Aucune ne fait peur ni ne vexe, et tout est en lecture libre.
Lire l'article sur le poisson d'avril : https://deviens-marrant.fr/blog/blagues-poisson-d-avril-adultes?utm_source=lettre&utm_medium=email&utm_content=n5-article

Et le jour où c'est toi la cible, le parcours Répartie t'apprend à répondre à voix haute et au bon moment. Il est dans Premium, sans engagement, et son étape 1 se lit sans compte.
Voir le parcours Répartie : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n5-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cs14jke10b58d158ae638560` ; décryptage : `decryptage-ecrit-1.json` (vid V003), identique dans `vannes-actives-s17.json` l.560 ; `catalogue-vannes-valides.md` l.80.
- **Trace de relecture** : tour 1 à l'aveugle, « = » chez les deux relecteurs (`neuves-aveugle-1-critique-A.md` l.217 : « net, imprévu » ; `-B.md` l.217 : « implication inattendue, courte, vraie »).
- **Lien** : `blagues-poisson-d-avril-adultes`, fiche `A5-blagues-poisson-d-avril-adultes.md`, publication 25/02/2027. La vanne n'y figure pas. Le nombre d'idées de l'article n'est volontairement pas cité (la fiche demande de le corriger si une idée change).
- **Faits repris** : idées « classées par terrain » et garde-fou « aucune ne fait peur ni ne vexe » (extrait A5, 2 des 3 garde-fous : la triple énumération et la liste de terrains sont retirées ; la fiche A5 signale d'ailleurs que le terrain « couple » est fusionné avec « potes », donc la liste de quatre terrains de l'excerpt est à éviter). La vanne figure en revanche dans l'étape 1 du parcours **Répartie** (`parcours-seed.json` l.297, correction s21 : la première version de cette ligne disait « Machine à Café », à tort) : sans conséquence pour le n°5, mais **le n°6 (version actuelle) renvoie justement vers l'étape 1 de Répartie** : redite d'un mois sur l'autre à trancher (voir §8).
- **Tour 2** : objet = l'objet et le délai, plus la chute ; exemple « frère qui répond dans l'heure » = même mécanisme (le comportement correct devenu suspect) dans une autre situation que l'objet rendu ; l'ancien exemple (collègue à l'heure) restait proche. Exercice en 3 étapes. **Exemple à relire à l'aveugle.**
- **Objection traitée** : « je ne veux pas blesser avec un canular » ; « et si c'est moi qu'on piège » (Répartie).

---

## 7. Numéro 6 : avril 2027, les festivals d'été

**Envoi** : 8 au 20/04 (aucun plancher : la ressource est l'étape 1 gratuite d'un parcours déjà en ligne).
**Objet (3 variantes)**
1. **J'ai regardé les prix des pass 3 jours** (RECOMMANDÉ : l'amorce, chacun connaît la suite du soupir ; la chute reste dans le corps)
2. Le prix d'un festival d'été
3. Une vanne pour les budgets de festival

**Pré-en-tête** : La vanne du mois, avant la saison des festivals.

**Corps**

Salut,

Dès que les jours rallongent, quelqu'un regarde le prix d'un festival d'été et pousse un soupir. Voici la vanne du mois.

> J'ai regardé les prix des pass 3 jours pour les Eurockéennes.
> Je vais acheter une guitare.

**Pourquoi ça marche**
Face à un prix trop haut, la réaction normale serait de renoncer ou de râler. Toi, tu proposes un plan à rallonge, présenté comme une évidence : apprendre la guitare pour finir sur scène, donc entrer gratuitement. Le maillon manquant n'est jamais écrit, et c'est celui qui écoute qui le reconstitue, ce qui fait rire.

**À toi de jouer**
1. Pars d'un prix ou d'un obstacle qui te freine.
2. Propose comme remède le détour le plus long possible.
3. N'explique pas le raisonnement : c'est à celui qui lit de le reconstituer.

Exemple : « Le déménageur m'a donné son prix. Je commence la musculation. »

**Quand il faut répondre sur le moment**
Une vanne comme celle-ci se prépare tranquillement chez soi. Pour les répliques qu'il faut trouver en direct, le parcours Répartie commence par une étape qu'on lit sans compte.
Lire l'étape 1 : tes premières répliques : https://deviens-marrant.fr/parcours/repartie?utm_source=lettre&utm_medium=email&utm_content=n6-etape1#etape-1

Si l'étape te plaît, la suite de ce parcours et celle des quatre autres sont dans Premium, sans engagement.
Voir les parcours : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n6-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cmp9gspno007ms60xngd592ct` ; décryptage et « À toi de jouer » : `docs/copy/audit-vannes-s14/decryptage-5-anciennes-ecrit.json` (même texte dans `vannes-actives-s17.json` l.420).
- **Trace de relecture** : référence « au niveau » (`references-au-niveau.txt` l.4), « = » critique B et n°1 de son classement (`aveugle-1-critique-B.md` l.165 et l.185), GARDER du lot A (`lot-A.md` l.286). **La plus solide des six.**
- **Lien** : `/parcours/repartie#etape-1` (route `parcours/[slug]`, étape 1 ouverte au visiteur, `lib/entrees-parcours.ts` ; « la première étape se lit sans compte » est écrit dans `config/blog-cta.ts`). Les cinq parcours sont publiés (`config/parcours-publication.ts`), d'où « les quatre autres ».
- **Objection traitée** : « je ne trouve rien à répondre sur le moment » (Répartie, « pensés pour les timides »).
- **Tour 2** : objet = l'amorce, plus la chute ; pré-en-tête sans « plan à rallonge » (spoilait le mécanisme) ; exemple « déménageur, musculation » = même mécanisme (la solution démesurée, maillon non écrit) dans une autre situation. **Remplace l'exemple du catalogue** (billet de tournoi, ramasseur de balles), qui refaisait la vanne (prix d'un événement, entrée par un rôle). **Si le nouvel exemple échoue à l'aveugle, revenir à l'exemple du catalogue** (validé) plutôt qu'en garder un moyen. Exercice en 3 étapes.
- **Nommés** : un festival dans le texte de la vanne (catalogue validé) ; plus aucun tournoi nommé dans le numéro ; aucun concurrent.

---

## 8. Contrôles transversaux, réserves et suites

**Réserves de remplacement** (décryptage complet dans `decryptage-ecrit-1.json`, à repasser à l'aveugle avant usage) : R1 `cs14jkdb222991fcbf194845` (« Robert commence en septembre », V150, B « = », meilleure que V126) ; R2 `cs14jk177b62432b07f5d17a` (« prenez votre temps », V201, B « = ») ; R3 `cs14jkb9ba433a0746280280` (« Antoine bar », V082, B « presque »).

**Vérifications faites par recherche dans le dépôt** (aucune ne remplace la relecture) :
| Contrôle | Résultat |
|---|---|
| Vannes recopiées mot pour mot depuis l'export prod | 6 sur 6 |
| Vanne déjà présente dans l'article lié | 0 sur 6 |
| Tiret cadratin ou demi-cadratin dans les deux fichiers (recherche du glyphe) | 0 (à refaire par script avant import : le test de non-tiret du composant doit couvrir `NewsletterIssue`) |
| Mention d'IA ou de concurrent | 0 |
| Chiffres hors vannes | « 15 à 20 minutes par semaine », « quatre semaines », « six questions », « 3 zones », « quatre autres » (5 parcours publiés), tous sourcés ci-dessus |
| Prix, témoignage, compteur d'inscrits | 0 |
| Une seule invitation Premium par numéro, en bas | 6 sur 6 |
| Signature « L'Équipe Deviens Marrant » | 6 sur 6 |
| Objet sans la chute de la vanne (tour 2) | 6 sur 6 |
| Exemple de « À toi de jouer » dans une autre situation que la vanne (tour 2) | 6 sur 6 (n°2 à 6 : exemples neufs, **jamais relus à l'aveugle**, duel préparé dans `pack-relecture-n2-a-6.md`) |
| Morale de clôture (« on rit de la situation… ») et triple énumération dans les textes écrits pour la lettre | 0 |
| Faits du pont n°1 contre la fiche S7 (3 zones, moments, zone rouge « argent ») | vérifiés, un écart corrigé (voir n°1) |

**Références de marché** : `[SANS BENCHMARK : WebSearch non concluant]` (une recherche le 17/10/2026, aucun exemple français de lettre mensuelle qui décortique une vanne ; seules des lettres d'humour en anglais et des formats « analyse d'un exemple » sont ressorties, sans enseignement exploitable). Le niveau visé est donc celui des étalons internes de la charte s11, pas celui d'un concurrent.

**Duel des n°2 à 6** (`pack-relecture-n2-a-6.md`, s21) : chaque version actuelle est opposée à une 2e version complète (même vanne, objet, pont, exercice et lien différents ; n°6 : exemple du catalogue). Liens alternatifs utilisés dans les 2es versions : n°2 `jamais-quoi-repondre-techniques` (publié le 24/03/2026, générique, pas Noël) ; n°3 étape 1 de Confiance ; n°4 `blagues-de-couple-drole` (05/11/2026, ne parle pas de la Saint-Valentin) ; n°5 `chambrer-sans-blesser-entre-potes` (09/11/2026, ne parle pas du 1er avril) ; n°6 étape 1 de Machine à Café. **Redites à connaître si une 2e version gagne ou si la version actuelle du n°6 part** : l'étape 1 de Répartie (lien du n°6 actuel) contient la vanne du n°5 (chargeur) ; l'étape 1 de Machine à Café (lien du n°6, 2e version) contient la vanne du n°1 (salaires) ; `jamais-quoi-repondre-techniques` est antérieur à la lettre et son contenu cite des humoristes (autorisé, règle P0 s15). Un numéro dont les deux versions sortent « < » repart en réécriture, il ne part pas.

**À faire avant l'envoi du n°1** (liste courte) : ~~duel du n°1~~ fait (VALIDÉ, voir en tête), puis relecture à l'aveugle des numéros 2 à 6 (pack ci-dessus) ; confirmer en base que chaque article lié est `isPublished` à la date d'envoi ; fixer les jours d'envoi (Thomas) ; compléter `{{mention_editeur}}` après l'avis @legal ; ajouter `lettre` à l'attribution (`lib/attribution.ts`) ; vérifier les 6 URL en production le jour de l'envoi.

**Points à trancher par Thomas**
1. N3 (chien) est la vanne la plus fragile (2 sur 3) : la garder, ou passer à R1 ?
2. N4 : lier l'article des messages (A3, retenu) ou celui des blagues de couple (A4, sans redite) ?
3. Adresse de réponse : aucune n'est définie pour la lettre (e-mail automatique, `noreply@`). Les numéros n'invitent donc jamais à répondre.

**Fabrication des numéros suivants (lot de 6 préparé à l'avance, jamais généré au fil de l'eau, décision du 01/10)** : (1) choisir 6 vannes actives de l'export le plus récent, une catégorie et une technique par numéro, sans aucune présente dans l'article lié ; (2) recopier le décryptage du catalogue (tutoiement seulement) et écrire un exemple qui transpose le mécanisme dans une autre situation (relu à l'aveugle) ; (3) écrire accroche, pont vers l'article et invitation Premium dans la trame du §1 ; (4) relecture à l'aveugle à deux, puis validation de Thomas ; (5) import en `NewsletterIssue` (objet, pré-en-tête, corps, date prévue, statut BROUILLON puis VALIDÉ). Aucun envoi sans le statut VALIDÉ.

