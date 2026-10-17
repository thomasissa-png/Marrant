# La lettre mensuelle gratuite : numéros 1 à 6 (novembre 2026 à avril 2027)

> Session 21, 17/10/2026. Statut : BROUILLONS à relire à l'aveugle (règle d'or s18), puis à valider par Thomas avant tout envoi. Rien n'est codé ni envoyé.
> Promesse tenue par chaque numéro : « Une vanne décryptée par mois » (`docs/ux/lettre-inscription-s21.md` §3), pas plus d'un e-mail par mois, gratuit, sans compte.
> Sources lues : `project-context.md`, `docs/founder-preferences.md` (01/10, 06/05, 14/10, 17/10), `docs/copy/ton-alex.md`, `docs/copy/charte-refonte-copy-s11.md`, `docs/ux/lettre-inscription-s21.md`, `docs/marrant/playbook.md` (test stand-up), `docs/seo/calendrier-editorial-q4-2026.md`, fiches des articles liés.
> `[Framework : value-first en trois temps (une vanne, son mécanisme, un geste à faire soi-même), puis une ressource gratuite, puis une seule invitation Premium en fin de lettre]` · `[Conscience : Problem-Aware, la personne s'est inscrite parce qu'elle veut être plus drôle, elle connaît son problème, pas encore la méthode]`

## 0. Synthèse

| N° | Mois | Fenêtre d'envoi conseillée (date plancher) | Thème | Vanne du catalogue (id) | Technique | Lien gratuit (article ou étape 1) |
|---|---|---|---|---|---|---|
| 1 | Nov. 2026 | 17 au 24/11 (plancher **16/11**) | Pot de fin d'année au bureau | `cs14jkf30f2d648e83002b90` (BOULOT) | L'aveu par le geste | `/blog/soiree-de-noel-entreprise-humour` |
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

1. **Objet** : une phrase de la vanne (la chute de préférence), jamais « Lettre n°X ». 3 variantes par numéro, une recommandée. 45 caractères au plus pour tenir sur mobile.
2. **Pré-en-tête** : une ligne qui dit ce que c'est (« La vanne du mois, … »), sans répéter l'objet.
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
9. **Garde-fou d'humour** : si une vanne tombe sous la barre à la relecture, le numéro part **sans vanne** (réserve de remplacement au §8), jamais avec une vanne moyenne.

---

## 2. Numéro 1 : novembre 2026, le pot de fin d'année

**Envoi** : 17 au 24/11 (jamais avant le 16/11, publication de l'article lié).
**Objet (3 variantes)**
1. **Il a payé le café. Sans un mot.** (RECOMMANDÉ : la chute seule intrigue, rien d'autre ne dit de quoi il s'agit, le pré-en-tête répond)
2. On a comparé nos salaires
3. Avant le pot de Noël : une vanne qui ne vise personne

**Pré-en-tête** : La vanne du mois, avant le pot de fin d'année.

**Corps**

Salut,

Le pot de fin d'année approche. C'est la soirée de bureau où l'on a le plus le droit d'être drôle, et celle où une vanne ratée dure jusqu'en janvier. Voici la vanne du mois, et elle ne vise personne.

> Avec un collègue, on a enfin comparé nos salaires.
> Il a payé le café. Sans un mot.

**Pourquoi ça marche**
Personne ne prononce de mot : le geste dit tout. Payer le café sans rien dire, c'est reconnaître que l'écart de salaire était réel, et injuste. Le rire vient du fait que la révélation reste sous-entendue, ce qui la rend plus lourde.

**À toi de jouer**
Après une révélation gênante, remplace toute conversation par un geste de compensation que personne n'ose commenter. Exemple : « En comparant nos primes, ma collègue a acheté les viennoiseries du lundi pour les six prochains mois. Personne n'a commenté. »
Écris la tienne en deux phrases, et garde-la pour la machine à café. Au pot, on rit de la situation, jamais de la personne.

**Pour le pot lui-même**
Arrivée, discussion avec la direction, Secret Santa, départ : l'article donne un plan par moments et la règle des 3 zones pour rester drôle sans déraper. Il est en lecture libre.
Lire l'article sur le pot de Noël : https://deviens-marrant.fr/blog/soiree-de-noel-entreprise-humour?utm_source=lettre&utm_medium=email&utm_content=n1-article

Si l'envie te prend de t'entraîner ensuite, les parcours complets sont dans Premium, sans engagement. La première étape de chacun se lit sans compte, tu peux commencer par là.
Voir les parcours complets : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n1-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `docs/content/vannes-actives-s19.json`, id `cs14jkf30f2d648e83002b90` ; décryptage : `docs/copy/audit-vannes-s14/decryptage-ecrit-1.json` (vid V144), identique dans `docs/content/boulot-base-s19.json`.
- **Trace de relecture** : tour 2 à l'aveugle, « = » chez les deux relecteurs (`neuves-aveugle-2-critique-A.md` l.66 et `-B.md` l.66 ; B la place dans son top 4, A la range parmi les « = » les plus fragiles). Pas de relecture à l'aveugle individuelle depuis : à repasser avec le numéro.
- **Lien** : `soiree-de-noel-entreprise-humour`, fiche `docs/copy/articles-q4/S7-soiree-de-noel-entreprise.md`, validée par Thomas (GO 03/10), publication prévue le 16/11. **Cette vanne n'est pas dans l'article** (ses 5 vannes sont d'autres ids). [À VÉRIFIER en base avant envoi : article publié.]
- **Faits repris** : « Secret Santa », « règle des 3 zones », étapes du plan (fiche S7).
- **Objection traitée** : « je vais dire une bêtise devant la direction » (garde-fou « on rit de la situation, pas de la personne » + plan de l'article).
- **Voix** : décryptage du catalogue gardé presque mot pour mot (barre s11 §4) ; accroche et ponts écrits pour la lettre.

---

## 3. Numéro 2 : décembre 2026, le repas de famille

**Envoi** : 7 au 16/12 (jamais avant le 23/11, publication de l'article lié ; avant les repas du 24 et du 25).
**Objet (3 variantes)**
1. **Quelqu'un de plus haut placé** (RECOMMANDÉ : la fin de la chute, sans le début, donne envie de remonter la phrase)
2. « T'as quelqu'un ? », version Noël
3. Noël : la question de ta grand-mère

**Pré-en-tête** : La vanne du mois, avant le repas de Noël.

**Corps**

Salut,

À Noël, il y a toujours quelqu'un pour poser la question. Tu sais laquelle. Voici la vanne du mois, à garder pour le jour où ça arrive.

> Ma grand-mère m'a demandé si j'avais quelqu'un dans ma vie. J'ai dit non.
> Elle a dit qu'elle allait en parler à quelqu'un de plus haut placé.

**Pourquoi ça marche**
Le mot « quelqu'un » a un sens amoureux pour toi et un sens hiérarchique pour ta grand-mère. Elle répond avec sa logique à elle, parfaitement cohérente, et on comprend en une seconde ce qu'elle a compris. La chute est douce parce que la grand-mère est prête à tout pour t'aider, quitte à passer par le haut de l'échelle.

**À toi de jouer**
Choisis un mot qui a deux sens courants et fais qu'un personnage réponde au second avec conviction. Exemple : « Mon oncle m'a demandé si j'avais des vues sur la maison. J'ai dit non. Il a fermé les volets. »
Et si c'est toi qu'on questionne à table : on rit de la situation, jamais de la personne qui pose la question.

**Pour les autres questions**
L'article réunit les six questions de Noël qui piquent, avec des réparties qui désamorcent sans froisser et un plan B si on insiste. Il est en lecture libre.
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
- **Faits repris** : « six questions », « plan B si on insiste » (extrait de la fiche S8).
- **Objection traitée** : « je vais vexer ma famille » (on rit de la situation, pas de la personne).
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
Choisis une stratégie pour te faire des amis ou de la place, et montre qu'elle profite à l'intermédiaire. Exemple : « J'ai pris un abonnement à la salle pour rencontrer du monde. Ils connaissent tous le coach. Moi, je connais le casier 114. »

**Si « être plus drôle » est dans tes résolutions**
L'article propose une habitude de quelques minutes et un suivi sur quatre semaines, pour ne pas lâcher avant la mi-janvier. Il est en lecture libre.
Lire l'article sur la résolution : https://deviens-marrant.fr/blog/resolution-nouvelle-annee-etre-plus-drole?utm_source=lettre&utm_medium=email&utm_content=n3-article

Si tu préfères un cadre, les parcours complets sont dans Premium, sans engagement, à raison de 15 à 20 minutes par semaine selon le parcours. La première étape de chacun se lit sans compte.
Voir les parcours complets : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n3-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cs14jk9cc844b92fde69e845` ; décryptage : `decryptage-ecrit-2.json` (vid V414), même texte dans `vannes-actives-s17.json` l.130 ; liste « validées » : `docs/copy/catalogue-vannes-valides.md` l.17.
- **Trace de relecture** : tour 2 à l'aveugle, A « = » (`neuves-aveugle-2-critique-A.md` l.109), B « < » (« trope, chute jolie mais devinable », `-B.md` l.109), puis départage C « = » (`departage-critique-C.md` l.96) : 2 sur 3. **La plus fragile des six** : si la relecture la juge sous la barre, remplacer par la réserve R1 (§8).
- **Lien** : `resolution-nouvelle-annee-etre-plus-drole`, fiche S13 (GO Thomas 03/10), publication 28/12. Cette vanne n'est pas dans S13 (elle est dans A3 et S11, articles qui ne sont pas liés ici).
- **Faits repris** : « quelques minutes », « suivi sur quatre semaines », « avant la mi-janvier » (extrait S13) ; « 15 à 20 minutes par semaine selon le parcours » (founder-preferences 29/09). Le « 114 » est un détail de la vanne d'exemple.
- **Objection traitée** : « je n'ai pas de temps » (quelques minutes, 15 à 20 minutes par semaine).

---

## 5. Numéro 4 : février 2027, avant la Saint-Valentin

**Envoi** : 1 au 10/02 (article lié publié depuis le 29/10/2026).
**Objet (3 variantes)**
1. **Il a vibré onze fois. Elle a tenu dix.** (RECOMMANDÉ : la chute chiffrée se retient, et intrigue sans contexte)
2. Le téléphone face contre la table
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
Transforme une bonne intention en épreuve chronométrée, avec un score serré. Exemple : « J'avais juré de ne plus regarder mes notifications pendant le repas. J'ai tenu jusqu'à l'entrée. »

**Pour le premier message**
Si tu en es encore à l'écrire, l'article part d'une bio, d'une photo de voyage ou d'un animal, et explique comment relancer après un silence sans insister. Le rire tombe sur toi ou sur la situation, jamais sur la personne. Il est en lecture libre.
Lire l'article sur le premier message : https://deviens-marrant.fr/blog/premier-message-drole-appli-de-rencontre?utm_source=lettre&utm_medium=email&utm_content=n4-article

Pour retrouver un humour qui te ressemble, à ton rythme, le parcours Confiance est dans Premium, sans engagement. Son étape 1 se lit sans compte.
Voir le parcours Confiance : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n4-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cs14jk55b4243d4d1c132b97` ; décryptage : `decryptage-ecrit-1.json` (vid V036), identique dans `vannes-actives-s17.json` l.980.
- **Trace de relecture** : tour 2, A « < » (« trope », `neuves-aveugle-2-critique-A.md` l.190), B « = » (« observation vraie, courte, précise », `-B.md` l.190), départage C « = » (`departage-critique-C.md` l.86) : 2 sur 3.
- **Lien** : `premier-message-drole-appli-de-rencontre`, fiche `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md`, publication 29/10/2026 (avancée du 03/12). La vanne n'y figure pas. **Redite à connaître** : A3 contient la vanne du n°3 (chien) ; assumé, le n°3 étant lu trois semaines plus tôt. Alternative sans redite : lier `blagues-de-couple-drole` (A4, publié le 05/11/2026).
- **Faits repris** : bio, photo de voyage, animal, relance après un silence (extrait A3). « 14 février » : date de calendrier.
- **Objection traitée** : « je ne sais pas quoi écrire au premier message » ; « je me sens nul en rendez-vous » (parcours Confiance : « un humour qui te ressemble », description du parcours).

---

## 6. Numéro 5 : mars 2027, avant le 1er avril

**Envoi** : 15 au 26/03 (jamais avant le 25/02, publication de l'article lié ; avant le 1er avril).
**Objet (3 variantes)**
1. **Je lui ai demandé s'il partait** (RECOMMANDÉ : la chute entière, courte, qui appelle la question « partir de quoi ? »)
2. Le chargeur, un an après
3. Avant le 1er avril, méfie-toi des gentillesses

**Pré-en-tête** : La vanne du mois, avant le 1er avril.

**Corps**

Salut,

Le 1er avril approche, la date où un geste gentil et inattendu passe pour un piège. Voici la vanne du mois.

> Mon copain m'a rendu le chargeur qu'il m'avait pris il y a un an.
> Je lui ai demandé s'il partait.

**Pourquoi ça marche**
Rendre un objet qu'on doit rendre est la chose la plus normale du monde, mais un an de retard a changé la lecture : ce retour ressemble à un adieu. Tu inverses la logique de la situation, et c'est l'habitude du retard qui devient la règle. La chute est une simple question, ce qui la rend encore plus sèche.

**À toi de jouer**
Choisis un comportement correct devenu tellement rare chez quelqu'un qu'on le prend pour un symptôme. Exemple : « Mon collègue est arrivé à l'heure trois jours de suite. J'ai demandé si tout allait bien chez lui. »

**Pour le 1er avril**
L'article réunit des idées de canulars pour adultes, classées par terrain : bureau, famille, potes et couple. Aucune ne fait peur, ne coûte d'argent ni ne vexe : on rit avec la personne, jamais à ses dépens. Il est en lecture libre.
Lire les idées de canulars : https://deviens-marrant.fr/blog/blagues-poisson-d-avril-adultes?utm_source=lettre&utm_medium=email&utm_content=n5-article

Et le jour où c'est toi la cible, le parcours Répartie t'apprend à répondre à voix haute et au bon moment. Il est dans Premium, sans engagement, et son étape 1 se lit sans compte.
Voir le parcours Répartie : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n5-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cs14jke10b58d158ae638560` ; décryptage : `decryptage-ecrit-1.json` (vid V003), identique dans `vannes-actives-s17.json` l.560 ; `catalogue-vannes-valides.md` l.80.
- **Trace de relecture** : tour 1 à l'aveugle, « = » chez les deux relecteurs (`neuves-aveugle-1-critique-A.md` l.217 : « net, imprévu » ; `-B.md` l.217 : « implication inattendue, courte, vraie »).
- **Lien** : `blagues-poisson-d-avril-adultes`, fiche `A5-blagues-poisson-d-avril-adultes.md`, publication 25/02/2027. La vanne n'y figure pas. Le nombre d'idées de l'article n'est volontairement pas cité (la fiche demande de le corriger si une idée change).
- **Faits repris** : terrains (bureau, famille, potes, couple) et garde-fous « ne fait peur, ne coûte d'argent ni ne vexe » (extrait A5). La vanne figure en revanche dans le parcours Machine à Café (`parcours-seed.json` l.297) : sans conséquence pour la lettre.
- **Objection traitée** : « je ne veux pas blesser avec un canular » ; « et si c'est moi qu'on piège » (Répartie).

---

## 7. Numéro 6 : avril 2027, les festivals d'été

**Envoi** : 8 au 20/04 (aucun plancher : la ressource est l'étape 1 gratuite d'un parcours déjà en ligne).
**Objet (3 variantes)**
1. **Je vais acheter une guitare** (RECOMMANDÉ : la chute entière, en cinq mots, on veut le prix qui la précède)
2. Le prix d'un festival, un plan à rallonge
3. Une vanne pour les budgets de festival

**Pré-en-tête** : La vanne du mois, et son plan à rallonge.

**Corps**

Salut,

Dès que les jours rallongent, quelqu'un regarde le prix d'un festival d'été et pousse un soupir. Voici la vanne du mois.

> J'ai regardé les prix des pass 3 jours pour les Eurockéennes.
> Je vais acheter une guitare.

**Pourquoi ça marche**
Face à un prix trop haut, la réaction normale serait de renoncer ou de râler. Toi, tu proposes un plan à rallonge, présenté comme une évidence : apprendre la guitare pour finir sur scène, donc entrer gratuitement. Le maillon manquant n'est jamais écrit, et c'est celui qui écoute qui le reconstitue, ce qui fait rire.

**À toi de jouer**
Pars d'une dépense qui te freine, puis propose comme remède le détour le plus long possible, sans expliquer le raisonnement. Exemple : « J'ai regardé le prix d'un billet pour Roland-Garros. Je m'inscris pour ramasser les balles. »

**Pour celles qui se sortent sur le moment**
Une vanne comme celle-ci se prépare tranquillement chez soi. Pour les répliques qu'il faut trouver en direct, l'étape 1 du parcours Répartie se lit sans compte.
Lire l'étape 1 de Répartie : https://deviens-marrant.fr/parcours/repartie?utm_source=lettre&utm_medium=email&utm_content=n6-etape1#etape-1

Si l'étape te plaît, la suite de ce parcours et celle des quatre autres sont dans Premium, sans engagement.
Voir les parcours complets : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n6-premium

Rendez-vous le mois prochain,
L'Équipe Deviens Marrant

*Pied de page standard (§1.5).*

**Contrôle**
- **Source de la vanne** : `vannes-actives-s19.json`, id `cmp9gspno007ms60xngd592ct` ; décryptage et « À toi de jouer » : `docs/copy/audit-vannes-s14/decryptage-5-anciennes-ecrit.json` (même texte dans `vannes-actives-s17.json` l.420).
- **Trace de relecture** : référence « au niveau » (`references-au-niveau.txt` l.4), « = » critique B et n°1 de son classement (`aveugle-1-critique-B.md` l.165 et l.185), GARDER du lot A (`lot-A.md` l.286). **La plus solide des six.**
- **Lien** : `/parcours/repartie#etape-1` (route `parcours/[slug]`, étape 1 ouverte au visiteur, `lib/entrees-parcours.ts` ; « la première étape se lit sans compte » est écrit dans `config/blog-cta.ts`). Les cinq parcours sont publiés (`config/parcours-publication.ts`), d'où « les quatre autres ».
- **Objection traitée** : « je ne trouve rien à répondre sur le moment » (Répartie, « pensés pour les timides »).
- **Nommés** : un festival et un tournoi, dans le texte même de la vanne et de son exemple (catalogue validé) ; aucun concurrent.

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

**Références de marché** : `[SANS BENCHMARK : WebSearch non concluant]` (une recherche le 17/10/2026, aucun exemple français de lettre mensuelle qui décortique une vanne ; seules des lettres d'humour en anglais et des formats « analyse d'un exemple » sont ressorties, sans enseignement exploitable). Le niveau visé est donc celui des étalons internes de la charte s11, pas celui d'un concurrent.

**À faire avant l'envoi du n°1** (liste courte) : relecture à l'aveugle du n°1 (pack `pack-relecture-n1.md`), puis des cinq autres ; confirmer en base que chaque article lié est `isPublished` à la date d'envoi ; fixer les jours d'envoi (Thomas) ; compléter `{{mention_editeur}}` après l'avis @legal ; ajouter `lettre` à l'attribution (`lib/attribution.ts`) ; vérifier les 6 URL en production le jour de l'envoi.

**Points à trancher par Thomas**
1. N3 (chien) est la vanne la plus fragile (2 sur 3) : la garder, ou passer à R1 ?
2. N4 : lier l'article des messages (A3, retenu) ou celui des blagues de couple (A4, sans redite) ?
3. Adresse de réponse : aucune n'est définie pour la lettre (e-mail automatique, `noreply@`). Les numéros n'invitent donc jamais à répondre.

**Fabrication des numéros suivants (lot de 6 préparé à l'avance, jamais généré au fil de l'eau, décision du 01/10)** : (1) choisir 6 vannes actives de l'export le plus récent, une catégorie et une technique par numéro, sans aucune présente dans l'article lié ; (2) recopier décryptage et exemple du catalogue, ne réécrire que le tutoiement ; (3) écrire accroche, pont vers l'article et invitation Premium dans la trame du §1 ; (4) relecture à l'aveugle à deux, puis validation de Thomas ; (5) import en `NewsletterIssue` (objet, pré-en-tête, corps, date prévue, statut BROUILLON puis VALIDÉ). Aucun envoi sans le statut VALIDÉ.

