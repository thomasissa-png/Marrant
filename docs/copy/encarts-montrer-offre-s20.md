# Encarts « montrer l'offre » : textes (audit conversion s20, lot 1)

> Auteur : @copywriter, 13/10/2026. Pour : relecture à l'aveugle (règle d'or) puis collage dans `apps/web/src/config/textes/encarts-blog-s20.ts` (clés inchangées : `TEXTES_PARCOURS_BLOG`, `ENCARTS_ARTICLE_1`, `TEXTES_BLOC_FIN`) et `config/blog-cta.ts`. Textes `[PROVISOIRE]` de @fullstack remplacés ici.
> Sources lues : `audit-conversion-s20.md` §2 et §4, `audit-conversion-s20/{copywriter,growth}.md` (réécritures 1 à 3, actions 1 et 6), `founder-preferences.md`, `blog-article-parcours-maillage.tsx`, `blog-forte-frappe.ts`, `blog-clusters.ts`, `blog-articles.ts`, `donnees/texte-parcours.txt`, `etalons-chemin-premium-s15.md`.
> Références marché : non consultées (audit interne sur textes de prod, pas de WebSearch). Mots-clés SEO : aucun H1/H2/slug touché, `keyword-map.md` non relu.

## Règles tenues

- Tutoiement, zéro tiret cadratin, guillemets « », aucun prix et aucune urgence dans A et B (le prix reste dans le bloc de fin, validé 3.1). Aucun chiffre nouveau : durées et semaines viennent de `config/premium.ts` (Machine à Café 3 sem. / 15 min, Répartie 4 / 20, Confiance 6 / 20, Storytelling 6 / 20, Boulot 6 / 15). **Dans le code, ces chiffres sont injectés (`parcoursWeeks`, `timePerWeek`), jamais écrits en dur.**
- Phrases reprises ou resserrées de textes déjà en ligne (page `/parcours`, `llms.txt`, étalons 3.1/3.2c). Aucun témoignage : pas d'« Imagine Tom » dans un encart.
- Lien de A et B : variante A = libellé déjà validé du blog (« Lire la première étape gratuite », étalon 3.9 A, 31 car.). Variante B = « Étape 1 gratuite : {Parcours} » (le nom du parcours reste dans le lien, utile en lecture d'écran). Repli sans risque : « Lire l'étape 1 de {Parcours} » (étalon 3.2c validé), le surtitre « Parcours X · étape 1 gratuite » portant alors le mot « gratuite ».
- Limites vérifiées à la main (titre ≤ 60, phrase ≤ 140, lien ≤ 40). Colonne « Car. » = titre / phrase / lien. Espace insécable avant `?`, `:` et dans « » : convention du site, à garder au collage.

## A. Encart au fil du texte, un par parcours (2 variantes)

[Framework : Before-After-Bridge, version courte] [Conscience : Problem-Aware]. Le pont dit toujours la même chose : lire ne suffit pas, ça s'entraîne. Posé après un H2, vers 35 à 45 % de l'article (mécanique de `config/blog-encarts.ts`). **Objection traitée : « ça va me coûter / m'engager »** (lien qui dit « gratuite », « sans compte » dans le surtitre ou la note).

### Répartie (`repartie`), pour Yanis

| Var. | Titre | Phrase | Lien | Car. |
|---|---|---|---|---|
| A1 | Tu trouves la réplique dans le bus du retour ? | Lire des répliques, c'est un début. Le parcours Répartie t'entraîne à les sortir sur le moment, à ton rythme. | Lire la première étape gratuite | 46 / 109 / 31 |
| A2 | Muet quand on te chambre ? Ça s'entraîne | Personne ne te demande d'être brillant, juste de ne plus rester muet. Commence par l'étape 1 du parcours Répartie, sans compte. | Étape 1 gratuite : Répartie | 40 / 128 / 28 |

### Machine à Café (`machine-a-cafe`), pour Sophie

| Var. | Titre | Phrase | Lien | Car. |
|---|---|---|---|---|
| A1 | Une vanne en stock, c'est bien. La placer, c'est mieux | Le parcours Machine à Café t'apprend à sentir le bon moment, 15 minutes par semaine, sur 3 semaines. | Lire la première étape gratuite | 53 / 100 / 31 |
| A2 | La pause café mérite mieux que « Ça va ? » | Des vannes courtes, le bon moment pour les placer, et un week-end raconté pour qu'on te demande la suite. En 15 min par semaine. | Étape 1 gratuite : Machine à Café | 42 / 128 / 34 |

### Confiance (`confiance`), pour qui se croit pas drôle

| Var. | Titre | Phrase | Lien | Car. |
|---|---|---|---|---|
| A1 | Tu ne te crois pas drôle ? Ça se travaille, doucement | Lire qu'on peut être drôle, c'est un début. Le parcours Confiance te le fait vérifier, à ton rythme, une étape à la fois. | Lire la première étape gratuite | 53 / 121 / 31 |
| A2 | Pas besoin d'être drôle pour commencer | Observation, autodérision, place en groupe : tu reprends tout à ton rythme, sans personne pour te pousser sur scène. | Étape 1 gratuite : Confiance | 38 / 117 / 29 |

### Storytelling (`storytelling`)

| Var. | Titre | Phrase | Lien | Car. |
|---|---|---|---|---|
| A1 | Ton histoire est bonne, ta chute arrive trop tard ? | Lire comment raconter, c'est une chose. Le parcours Storytelling te fait travailler une vraie anecdote, étape après étape. | Lire la première étape gratuite | 51 / 122 / 31 |
| A2 | « Et donc ? » : apprends à ne plus perdre ta table | Coupe, personnages, chute, détour, détail qui revient : 6 semaines sur une seule anecdote vraie, la tienne. | Étape 1 gratuite : Storytelling | 50 / 106 / 31 |

### Boulot (`boulot`)

| Var. | Titre | Phrase | Lien | Car. |
|---|---|---|---|---|
| A1 | La vanne que tu gardes pour toi au boulot | Le parcours Boulot t'apprend à la sortir sans te griller, un cran à la fois, avec une version sans risque de chaque exercice. | Lire la première étape gratuite | 41 / 125 / 31 |
| A2 | Sortir une vanne au boulot sans te griller | Tu commences par observer une salle de réunion sans rien dire, et tu finis par un toast. Six semaines, 15 minutes par semaine. | Étape 1 gratuite : Boulot | 42 / 126 / 26 |

Vérités : chaque phrase vient de `/parcours` ou `llms.txt` (promesses, exemples d'étapes, « version sans risque »). Aucune ne promet de résultat chiffré.

## B. Article n°1 `meilleures-blagues-droles-2026` : 2 encarts spécifiques

[Framework : PAS] [Conscience : Problem-Aware]. Sur cet article, B1 et B2 **remplacent** l'encart générique A (pas d'addition). Aucun prix, aucune urgence.

**Placements exacts** (`blog-articles.ts`, intitulés identiques à la page en ligne, `texte-article-blagues-2026.txt` l.22 et l.54) :
- **Encart 1 (Répartie)** : après le H2 « Quelles blagues sortir en soirée ? (celles qui marchent à partir de 22h) » (ancre `#quelles-blagues-sortir-en-soiree-celles-qui-marchent-a-partir-de-22h`), après la vanne n°8 et la ligne « Il t'en faut d'autres pour ce soir ? … les blagues de soirée », juste avant le `---` (l.1423 à 1425).
- **Encart 2 (Boulot)** : après le H2 « Quelles blagues au bureau ? (le lundi matin est un sport de combat) » (ancre `#quelles-blagues-au-bureau-le-lundi-matin-est-un-sport-de-combat`), après la vanne n°16 et la ligne « De quoi tenir jusqu'à vendredi à la machine à café : les blagues de boulot », avant le `---` (l.1453 à 1455).
- **Phrase l.1451 gardée telle quelle** (« Si tu veux devenir la personne qu'on attend à la machine à café, le secret c'est la régularité : 15 minutes par semaine suffisent. », lien Machine à Café). Je n'y ajoute pas « la première étape se lit sans compte » (piste #2 de l'audit) : l'encart Boulot suit à 2 lignes, deux invitations à l'étape 1 collées feraient insistant. Machine à Café reste présent par cette phrase, Boulot par l'encart, avec un angle distinct (« sans te griller »).

| Encart | Var. | Titre | Phrase | Lien | Car. |
|---|---|---|---|---|---|
| B1 Répartie | V1 | Et quand c'est toi qu'on chambre ? | Une vanne se choisit à l'avance. Une réplique se trouve sur le moment, et le parcours Répartie s'y entraîne. | Lire la première étape gratuite | 34 / 108 / 31 |
| B1 Répartie | V2 | Tes vannes sont prêtes. Ta réplique, pas encore ? | Une vanne, c'est préparé. Quand on te chambre, il faut répondre tout de suite : c'est ce que travaille le parcours Répartie. | Étape 1 gratuite : Répartie | 48 / 124 / 28 |
| B2 Boulot | V1 | Tu as une vanne de bureau que tu gardes pour toi ? | Le parcours Boulot t'apprend à la sortir sans te griller, un cran à la fois, de la salle de réunion au toast. | Lire la première étape gratuite | 50 / 109 / 31 |
| B2 Boulot | V2 | Drôle le samedi, ton de compte rendu le lundi ? | Ces vannes de bureau, tu peux les sortir. Le parcours Boulot t'apprend à le faire sans cibler personne et sans te griller. | Étape 1 gratuite : Boulot | 47 / 121 / 26 |

Vérités : « le lundi à 9 h, tu prends un ton de compte rendu » et « ta vanne vise toujours la situation, jamais quelqu'un » sont déjà sur `/parcours`. Piste V1 de B1 identique au titre provisoire de @fullstack (« Et quand c'est toi qu'on chambre ? » existe déjà dans `TEXTES_PARCOURS_BLOG.repartie`) : si V1 est retenue, ne pas la dupliquer sur un autre article.

## C. Bloc de fin d'article unique (remplace le bloc CTA et la carte « Parcours recommandé »)

[Framework : bridge + CTA doux] [Conscience : Product-Aware]. Ordre fixe : 1) étape 1 gratuite (contour), 2) Premium (plein). Un seul parcours par article (table D).

### C.1 Article n°1 (parcours : Répartie)

| Élément | Texte | Origine |
|---|---|---|
| Surtitre | Parcours Répartie · 4 semaines | mécanique `TEXTES_BLOC_FIN.surtitre`, semaines dynamiques |
| Titre | Tu les as lues. Reste à les sortir pour de vrai. | **inchangé**, `blog-cta.ts` l.28 (étalon 3.1) |
| Phrase V1 (reco) | Les parcours complets : de quoi t'entraîner à les placer au bon moment, pas juste à les connaître. | **inchangée**, `blog-cta.ts` l.29 |
| Phrase V2 | Le parcours Répartie t'entraîne à renvoyer la balle quand l'autre te répond du tac au tac, étape après étape. | étalon 3.2c verbatim (déjà sur l'article couple : redite possible) |
| Puces | « Une étape par semaine, environ 20 minutes » · « Des situations que tu connais : le chambrage entre potes, la pique en TD, le raté à rattraper » | 2 premières puces de la carte actuelle ; la 3e (« Des XP… ») retirée : « XP » jamais expliqué |
| Bouton 1 (contour) | V1 : Étape 1 gratuite : Répartie · V2 : Lire l'étape 1 de Répartie | V2 = lien 3.2c validé (surtitre porteur de « gratuite ») |
| Bouton 2 (plein) | V1 : Passer à Premium · V2 : Accéder aux parcours complets | V1 = libellé en ligne ; V2 = étalon 1.2 (CTA accueil, [CHOIX UTILISATEUR]) |
| Note | {prix}, sans engagement. Les vannes de cette page restent en accès libre. | **inchangée**, `blog-cta.ts` l.31, prix lu dans `config/premium.ts` |

**Ce qui change et pourquoi (seulement le nécessaire pour fusionner)** : (1) le parcours passe de Machine à Café à Répartie (le titre, la phrase et la note ne bougent pas) ; (2) l'ordre des boutons s'aligne sur la carte (gratuit d'abord), ce que l'audit @copywriter relevait comme « hiérarchie inversée » ; (3) le nom du parcours vit dans le surtitre et le bouton 1 puisque la phrase V1 reste générique ; (4) « Lire la première étape d'un parcours » disparaît : le lien nomme maintenant le parcours.

**Reco bouton 2 : V2 « Accéder aux parcours complets »**. Le lecteur n'a jamais vu « Premium » défini (audit W2/W3), alors que la phrase juste au-dessus parle de « parcours complets », et c'est le même libellé que le CTA de l'accueil. Écart à signaler : l'étalon 3.1 validé s'appelle « Passer à l'accès complet », or le code affiche « Passer à Premium » (`blog-cta.ts`, `article-cta.tsx`, `TEXTES_BLOC_FIN`). Trois libellés pour un bouton : à passer à l'aveugle avec le lot 2 (unification), Thomas arbitre.

### C.2 Les autres articles : titre et phrase par parcours

Titres validés réutilisés quand ils existent (`HINT_BY_PARCOURS`). Boutons identiques à C.1 (bouton 1 : « Lire la première étape gratuite » si la phrase nomme le parcours). Les articles dotés d'un texte 3.2c dans `blog-cta.ts` (couple, gamer, premier message, fêtes, vacances) **gardent titre, phrase, bouton Premium et note actuels** : seul l'ordre des boutons change.

| Parcours | Titre | Phrase | Origine |
|---|---|---|---|
| Répartie | Ces techniques, entraîne-les dans un parcours guidé | Le parcours Répartie t'entraîne à renvoyer la balle quand l'autre te répond du tac au tac, étape après étape. | titre `techniques-repartie` ; phrase 3.2c |
| Machine à Café | Sois drôle au bureau sans avoir l'air d'essayer | Des vannes courtes, le bon moment pour les placer et des anecdotes qu'on écoute jusqu'au bout, 15 min par semaine. | titre `humour-contexte` ; puces actuelles fusionnées |
| Confiance | Reprends confiance, une conversation à la fois | Le parcours Confiance t'entraîne, étape après étape, à trouver ta place dans un groupe qui rit, sans personne pour te pousser sur scène. | titre `douleurs-personas` ; deux puces fusionnées |
| Storytelling | Une anecdote, travaillée jusqu'à ce qu'on te la redemande | Le parcours Storytelling te fait retravailler une seule anecdote vraie, d'étape en étape, 20 min par semaine. | **nouveau**, tiré de `/parcours` (57 / 110 car.) |
| Boulot | Ta vanne du lundi, sans te griller | Le parcours Boulot t'apprend à la sortir un cran à la fois, de la salle de réunion au toast. Chaque exercice a une version sans risque. | **nouveau**, tiré de `/parcours` (34 / 135 car.) |

## D. Correspondance article → parcours

« Actuel » = règle du code aujourd'hui : `FORTE_FRAPPE_PARCOURS` d'abord, sinon cluster de `blog-clusters.ts`, sinon catégorie (relevé `texte-blog.txt`, 12/10). Règles de tranche : blagues et phrases à ressortir, chambrage, soirée, blanc → Répartie ; drague, timidité, se croire pas drôle → Confiance ; anecdote et chute → Storytelling ; **bureau : Boulot quand la réputation pro ou la prise de parole est en jeu (réunion, tour de table, pot, patron), Machine à Café quand il s'agit de la conversation de pause** (3 semaines, débutant, 15 min : le parcours doux pour Sophie). Raison : 8 mots maximum.

| Slug | Actuel | Proposé | Raison |
|---|---|---|---|
| meilleures-blagues-droles-2026 | Machine à Café | **Répartie** | Cherche des vannes, reste muet face au chambrage |
| phrases-droles-conversations | Machine à Café | **Répartie** | Phrases à placer en soirée, pas au bureau |
| blagues-halloween-soiree-deguisee | Machine à Café | **Répartie** | Soirée déguisée entre potes |
| blague-courte-arme-secrete-humour | Machine à Café | **Répartie** | Blagues courtes à ressortir sur le moment |
| citation-drole | Machine à Café | **Répartie** | Citation à sortir pendant un blanc |
| repartie-soiree-anti-malaise | Machine à Café | **Répartie** | Soirée, chambrage, malaise : promesse de Répartie |
| repondre-moqueries-avec-humour | Confiance | **Répartie** | Chambrage subi : exactement la promesse de Répartie |
| jamais-quoi-repondre-techniques | Confiance | **Répartie** | Le blanc face à la pique |
| rester-muet-en-groupe | Confiance | **Répartie** | « Ne plus rester muet » : promesse de Répartie |
| comment-faire-rire-une-fille | Machine à Café | **Confiance** | Drague : oser, sans forcer |
| comment-faire-rire-un-homme | Machine à Café | **Confiance** | Même logique : oser, tenir la conversation |
| autoderision-interactions | Répartie | **Confiance** | L'autodérision est un axe de Confiance |
| timidite-et-humour | Répartie | **Confiance** | Timidité : Confiance, à son rythme |
| blagues-travail-faire-rire-pro | Machine à Café | **Boulot** | Réputation pro en jeu : sans te griller |
| se-presenter-avec-humour | Répartie | **Boulot** | Tour de table, premier jour : cadre pro |
| comment-raconter-une-blague-sans-la-rater | Répartie | **Storytelling** | Raconter jusqu'à la chute : cœur du parcours |
| storytelling-drole-5-structures | Répartie | **Storytelling** | Structures d'anecdote : même sujet |
| conversation-machine-a-cafe | Machine à Café | Machine à Café | Pause café : nom et sujet du parcours |
| comment-devenir-drole | Répartie | Répartie | Pilier général, parcours le plus large |
| comment-avoir-de-la-repartie | Répartie | Répartie | Sujet même du parcours |
| repartie-debutant-5-etapes | Répartie | Répartie | Débutant en répartie : même sujet |
| timing-humour | Répartie | Répartie | Rythme et silences travaillés dans Répartie |
| erreurs-blagues | Répartie | Répartie | Inchangé, parcours le plus large |
| pourquoi-blagues-marchent-pas | Répartie | Répartie | Inchangé, parcours le plus large |
| humour-quotidien-8-habitudes | Répartie | Répartie | Inchangé, parcours le plus large |
| exercices-developper-humour | Répartie | Répartie | Exercices progressifs : étapes de Répartie |
| 5-types-humour-lequel-pour-toi | Répartie | Répartie | Trouver son registre, puis l'entraîner |
| humour-noir-utiliser-sans-blesser | Répartie | Répartie | Registre à doser, pas de parcours dédié |
| jeu-de-mots-drole-techniques-creer | Répartie | Répartie | Rebondir sur un mot : technique de répartie |
| blague-drole-7-criteres-pepite | Répartie | Répartie | Qualité d'une vanne : inchangé |
| comment-improviser-des-blagues | Répartie | Répartie | Rebondir sur l'instant : cœur de Répartie |
| techniques-humoristes-pros | Répartie | Répartie | Techniques de pros : vidéos des étapes |
| je-suis-pas-drole-comment-changer | Confiance | Confiance | « Je suis pas drôle » : cœur de Confiance |
| confiance-humour-apres-rupture | Confiance | Confiance | Reprendre confiance : sujet identique |
| avoir-confiance-en-soi-grace-a-l-humour | Confiance | Confiance | Sujet identique |
| etre-plus-a-l-aise-en-societe | Confiance | Confiance | Aisance sociale, à son rythme |

**Programmés (jeudis, `FORTE_FRAPPE_PARCOURS`)** :

| Slug | Actuel | Proposé | Raison |
|---|---|---|---|
| message-anniversaire-drole-par-situation, refuser-une-invitation-avec-humour, blagues-de-gamer-jeux-video, blagues-poisson-d-avril-adultes | Répartie | Répartie | Inchangé : réplique à l'oral, déjà motivé dans le code |
| premier-message-drole-appli-de-rencontre, message-drole-fete-des-meres, message-drole-fete-des-peres, blagues-vacances-ete-entre-amis | Confiance | Confiance | Inchangé : oser, déjà motivé |
| blagues-de-couple-drole | Confiance (carte), Répartie (CTA 3.2c) | **Répartie** | Texte 3.2c validé nomme Répartie |
| mot-de-depart-collegue-drole | non forcé | **Boulot** | Pot de départ : le toast clôt Boulot |
| voeux-drole-nouvelle-annee | non forcé | **Machine à Café** | Collègues et patron, déjà lié dans le corps |

**Alerte couple** : la règle de tranche voudrait Confiance, mais le CTA de cet article est l'étalon 3.2c validé le 06/10 (« Le parcours Répartie t'entraîne à renvoyer la balle… »), alors que `FORTE_FRAPPE_PARCOURS` envoie la carte vers Confiance : deux parcours sur une même page. Je propose Répartie (aucun texte validé à réécrire) ; si Thomas préfère Confiance, il faut un nouveau CTA à passer à l'aveugle.

**Pour @fullstack (valeurs à poser, rien à saisir article par article)** : `PARCOURS_BY_CLUSTER` : `fort-volume` → repartie, `humour-contexte` → boulot, autres clusters inchangés. Surcharges par slug (extension de `FORTE_FRAPPE_PARCOURS`, `ParcoursSlug` à 5 valeurs) : confiance = comment-faire-rire-une-fille, comment-faire-rire-un-homme, autoderision-interactions, timidite-et-humour ; repartie = repartie-soiree-anti-malaise, blague-courte-arme-secrete-humour, citation-drole, repondre-moqueries-avec-humour, jamais-quoi-repondre-techniques, rester-muet-en-groupe, blagues-de-couple-drole ; storytelling = comment-raconter-une-blague-sans-la-rater, storytelling-drole-5-structures ; boulot = se-presenter-avec-humour, mot-de-depart-collegue-drole ; machine-a-cafe = conversation-machine-a-cafe, voeux-drole-nouvelle-annee. Les 4 autres changements de la table (n°1, phrases-droles-conversations, blagues-halloween-soiree-deguisee, blagues-travail-faire-rire-pro) viennent des deux changements de cluster. Slugs de `blog-clusters.ts` absents du blog au 12/10 (devenir-drole-30-jours, comment-faire-rire-ses-amis, creer-ses-propres-blagues, humour-self-deprecating, saisonniers, apprendre-des-pros) : règle du cluster. Les 5 slugs dépubliés (`UNPUBLISHED_STATIC_SLUGS`) sont hors périmètre. L'audit compte 34 articles, le relevé en liste 36 : écart non expliqué.

## Points d'attention

- Fiches `docs/copy/articles-forte-frappe/*` : les CTA y mentionnent encore « Le compte gratuit t'ouvre… » (supprimé le 05/10). Le code (`blog-cta.ts`) est déjà propre ; ne pas recoller ces anciens textes.
- Mesure : propriété `position` (milieu-1, milieu-2, fin) sur le clic, comme prévu par l'action 1 de @growth.

---
**Handoff → @orchestrator (puis @fullstack pour le collage, relecture à l'aveugle avant)**
- Fichier : `/home/user/Marrant/docs/copy/encarts-montrer-offre-s20.md` ; A = 5 parcours × 2 variantes, B = 2 encarts × 2 variantes (placements exacts dans `blog-articles.ts`), C = bloc de fin (titre, phrase, note de 3.1 gardés), D = 36 articles + 11 programmés (17 changements, alerte couple).
- Décisions : lien validé « Lire la première étape gratuite » en variante A ; bouton 2 reco « Accéder aux parcours complets » (écart code/étalon 3.1 à arbitrer par Thomas) ; bureau = Boulot (réputation pro) ou Machine à Café (pause) ; aucun prix dans A et B ; chiffres de durée à injecter depuis `config/premium.ts`.
- Objections traitées : coût (« gratuite », « sans compte »), temps (15 à 20 min), « je suis pas drôle » (Confiance, A2). Références marché non consultées ; aucun texte déjà relu à l'aveugle (règle d'or).

