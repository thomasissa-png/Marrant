# Parcours Boulot : refrain « un seul test » et défis longs (diagnostic s19, 11/10/2026)

> **Statut : DIAGNOSTIC + PROPOSITIONS, rien n'est remplacé.** Règle d'or P0 : un texte validé ne change que si la nouvelle version repasse la relecture à l'aveugle et en sort au niveau. Aucun JSON, aucun code, aucun test n'a été touché.
> Source des textes : `docs/content/parcours-boulot-s19.json` (`parcours.steps[].moduleDetail` et `_meta.conseils[].exercise`), relue le 11/10. Éditorial : `parcours-boulot-etapes-2-6-s19.md`, `etalons-parcours-boulot-s19.md` (choix 6 B, choix 7 a).
> `[Framework : consigne, critère, repli]` `[Conscience : Solution-Aware]`. Pas de WebSearch : la question est la cohérence interne du parcours, pas le positionnement marché.
> **Comptage** : à la main, un mot à la fois, convention des étalons (élision = 1 mot, trait d'union = 1 mot, « DÉFI X » compté, nombre = 1 mot). Marge ±2 : @fullstack doit recompter par script avant arbitrage. En séparant les élisions, le défi 6 passe à environ 262 mots, ce qui explique le « plus de 250 » des relectures.

## 0. Verdicts en un coup d'œil

| Point | Verdict | Pourquoi en une ligne |
|---|---|---|
| A. Refrain « un seul test » (étapes 1 à 6) | **GARDER** | Fil voulu (choix 6 B, « le même du début à la fin »), annoncé à l'étape 1, verrouillé par un test. Rien à varier. |
| A bis. Antécédent de « la » à l'étape 6 | **Micro-retouche optionnelle** (+2 mots, hors refrain) | « Avant de la sortir » n'a pas de nom féminin clair juste avant. On ajoute « vanne comprise » au paragraphe 1, le refrain reste identique. |
| B. Défi étape 6 (246 mots) | **CHANGER (proposition 6)** : 246 vers 204 mots, ou **6 bis** prudente : 246 vers 226 | Redondances réelles, et le critère de réussite tombe dans l'encadré « Version sans risque ». |
| B. Défi étape 2 (105 mots) | **Pas long.** Réordonnancement seul **optionnel** (proposition 2) : 105 vers 105 | Aucune graisse à couper. Même défaut de structure que l'étape 6 (critère dans l'encadré). |
| B. Autres défis > 180 mots | **Aucun** (147, 123, 95, 95) | Rien à proposer. |
| C. Variantes du refrain | **Aucune** | Verdict A = garder. |

## A. Le refrain

### A.1 Relevé (champ `moduleDetail`, dernier paragraphe, séparé par un saut de ligne)

| Étape | Phrase exacte | Fonction |
|---|---|---|
| 1 | « Un seul test pour toute la suite : ta phrase passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? Ici, ta phrase ne parle que d'un objet : elle passe ce test d'avance. » | **Pose** la règle et l'annonce comme valable « pour toute la suite ». Seule occurrence différente, avec son application au cas de l'étape (objet, donc sans risque). |
| 2 | « Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? » | Garde-fou avant de décider d'envoyer ou de garder le PS en brouillon. |
| 3 | Identique mot pour mot. | Garde-fou avant de dire la phrase au passage d'un collègue. |
| 4 | Identique mot pour mot. | Garde-fou avant de raconter l'histoire à un petit groupe. |
| 5 | Identique mot pour mot. | Garde-fou avant de répondre à des gens qu'on connaît peu. |
| 6 | Identique mot pour mot. | Garde-fou avant la vanne du toast, devant la personne honorée. Le test y est le plus fort, puisqu'elle est dans la salle. |

Six occurrences : une formulation d'ouverture (étape 1), cinq identiques (étapes 2 à 6). Les défis (`exercise`) ne contiennent pas le refrain : le geste du défi et le test vivent dans deux champs séparés.

### A.2 Défaut ou fil voulu ?

**C'est un fil voulu, et il tient. Verdict : garder.** Les raisons, dans l'ordre de leur poids :

1. **C'est une décision fondateur, pas un tic.** Choix 6 B (validé le 10/10, `[CHOIX UTILISATEUR]`) : « un seul test, le même du début à la fin », avec pour bénéfice « une seule question à retenir au lieu de six consignes ». La valeur du garde-fou est qu'on le sache par cœur. Une variante par étape redonne les six consignes que le choix 6 B a écartées.
2. **Il est annoncé.** L'étape 1 dit « pour toute la suite ». Le lecteur qui retrouve la phrase aux étapes 2 à 6 y retrouve la promesse, pas une redite.
3. **Il est typographié comme un rituel.** Dernier paragraphe, isolé par un saut de ligne, après la scène « Imagine Anouk… » et « Dans cette étape, tu… ». Il se lit comme une signature de fin d'étape, pas comme une phrase de prose répétée par paresse.
4. **Le rythme de lecture le protège.** Le parcours dure 6 semaines (jours 3, 10, 17, 24, 31, 38 : une étape par semaine). Une membre lit la phrase une fois par semaine, pas d'affilée.
5. **Le test n'est pas décoratif.** Il est le seul garde-fou de la promesse « sans te griller », et la phrase y est exacte à chaque étape (y compris « la personne dont elle parle », qui prend tout son sens au pot de l'étape 6).

**Où le risque « mécanique » existe vraiment.** Un visiteur qui ouvre les aperçus des étapes 2 à 6 à la suite (`LockedStepPreview`, « Ce que tu vas apprendre »), ou un relecteur qui lit le JSON d'un bloc, voit la phrase cinq fois en quelques minutes. C'est la situation de la relecture, pas celle d'une membre. Et sur une page qui vend « sans te griller », la même garantie répétée mot pour mot est plutôt rassurante. Je ne la juge pas un défaut.

**Ce que coûterait un changement** (information, pas une proposition) : casser le choix 6 B, et faire échouer `parcours-contenu-s19-boulot.test.ts` (constante `TEST_FINAL`, `endsWith` sur les étapes 2 à 6) et la citation de la phrase dans le document d'étalons.

**Autre rythme identique, pour mémoire, à garder aussi** : « Imagine Anouk, [jour], [heure], … » ouvre les six scènes, puis « Dans cette étape, tu… ». C'est la forme B (scène) validée. Même logique que le refrain : un format reconnaissable, pas un défaut.

### A bis. Un vrai petit défaut, à l'étape 6 : « Avant de la sortir » sans antécédent

Fin du paragraphe 1 de l'étape 6 : « … tu écris ton toast de la même façon, pour un vrai pot ou pour un pot imaginé : rien ne se prononce avant le jour J. » Puis le refrain : « Avant de la sortir… ». Aux étapes 2 à 5, « la » reprend un nom féminin proche (ta ligne, ta phrase, ton histoire, ta réponse). À l'étape 6, les noms proches sont « toast » (masculin) et « jour J » (masculin) ; le seul féminin disponible est « façon », qui n'a aucun sens ici. Le lecteur comprend « la vanne » en une demi-seconde, mais il trébuche.

**Proposition (optionnelle, refrain intact, +2 mots)** : on ne touche pas au refrain, on ajoute un féminin avant lui, en fin de paragraphe 1.
- Avant : « … pour un vrai pot ou pour un pot imaginé : rien ne se prononce avant le jour J. »
- Après : « … pour un vrai pot ou pour un pot imaginé : rien ne se prononce avant le jour J, vanne comprise. »
- Diff réel : 2 mots ajoutés sur le `moduleDetail` de l'étape 6 (environ 140 mots), soit environ 1,5 %. Le dernier paragraphe, donc `TEST_FINAL`, reste identique : le test unitaire ne bouge pas. @fullstack vérifie qu'aucun test ne plafonne la longueur de la scène.
- À repasser en relecture comme tout texte validé (règle d'or). Si Thomas préfère zéro changement, c'est défendable : ce n'est pas une erreur de langue, c'est un anaphorique léger.

## B. Les défis longs

### B.1 Comptage des 6 défis et contenu de l'encadré « Version sans risque »

`decouperRepli` coupe à la **dernière** (et unique) phrase interrogative hors citation, et tout ce qui suit passe dans l'encadré. Les mots se comptent donc des deux côtés de la coupe.

| Étape | Défi | Mots | Hors encadré | Dans l'encadré | Au-dessus de 180 ? |
|---|---|---|---|---|---|
| 1 | DÉFI TRACE | 147 | 113 | 34 | non |
| 2 | DÉFI PS | **105** | 64 | **41** (dont le critère de réussite) | non |
| 3 | DÉFI CROISEMENT | 123 | 59 | 64 (repli avec son propre critère) | non |
| 4 | DÉFI TRENTE SECONDES | 95 | 71 | 24 | non |
| 5 | DÉFI DEUX PHRASES | 95 | 70 | 25 (repli avec son propre critère) | non |
| 6 | DÉFI SOIXANTE SECONDES | **246** | 143 | **103** (dont le critère de réussite) | **oui, seul cas** |

**Constat franc sur l'étape 2** : à 105 mots, le défi n'est pas long, il est plus court que celui de l'étape 1. Le sentiment de longueur ne vient pas du nombre de mots.

**Constat plus important, étapes 2 et 6** : ce sont les deux seuls défis dont le **critère de réussite principal se trouve après le « ? »**. Avec la coupe actuelle, il s'affiche donc dans l'encadré « Version sans risque » : à l'étape 6, 103 mots sur 246 sont dans l'encadré, dont tout le « C'est réussi s'il fait entre 100 et 125 mots… ». Pour qui fait la version normale, le critère se lit comme appartenant au repli. (Déduit du code de `decouperRepli`, à confirmer sur capture.) Aux étapes 1, 3, 4 et 5, le critère principal précède le « ? » ou le repli porte le sien. D'où le principe commun des propositions 2 et 6 : **le critère de réussite passe avant la phrase interrogative**, l'encadré ne contient plus que le repli.

### B.2 Étape 6 : redondances relevées

| Segment | Mots | Pourquoi c'est redondant |
|---|---|---|
| « Pas besoin d'être sur place : » | 5 | « imagine-toi au pot » dit déjà qu'on n'y est pas ; « Rien à prononcer » le redit à la fin. |
| « qui seraient » (« deux choses qui seraient vraies ») | 2 | « deux choses vraies pour toi » suffit. |
| « , c'est l'étape qui fait d'un fait une vanne » | 8 | Commentaire de méthode : le conseil, affiché juste au-dessus, explique déjà le rappel. C'est la seule coupe qui retire un peu de voix, je la signale. |
| « si l'ambiance n'est pas celle que tu imaginais, » | 8 | Justification de la vanne de rechange, déjà dans le conseil (« une de rechange dans ta poche ne coûte rien ») et dans la scène. |
| « Pas besoin de chrono : compte tes mots. » | 7 | Le critère « entre 100 et 125 mots » impose déjà de compter. |
| Deux clauses de cible : « (ou contre ce détail, jamais contre la personne qui l'a dit ou donné) » puis « sans viser la personne honorée, l'organisation, le buffet ni un responsable » | environ 13 de gain après fusion | Même interdit dit deux fois : la personne qui a dit ou donné le détail est, dans l'exemple et dans le repli, la personne honorée. |
| « La première dit ce qui t'arrive, la seconde fait revenir le détail… » | 20, **gardés** | Répète le conseil, mais c'est le geste lui-même : sans elle, « écris deux phrases » est ambigu. |

Ce qui ne bouge dans aucune version : les trois blocs, la vanne en rappel, les deux choses vraies pour toi avec leurs trois exemples, un détail différent pour chaque, la meilleure pour le toast et l'autre en rechange, 100 à 125 mots, la vanne après le souvenir, le détail repris et retourné contre soi, la liste des cibles interdites, la vanne de rechange notée, le repli (« Aucun pot en vue ? Choisis quelqu'un qui t'a dépanné au travail et imagine son pot de départ. »), « Rien à prononcer ».

### B.3 Proposition 6 (recommandée) : 246 mots vers 204 (-42, -17 %), critère avant le repli

> DÉFI SOIXANTE SECONDES : écris un toast en trois blocs : un souvenir précis, une seule vanne en rappel, une phrase de fermeture. Imagine-toi au pot et note deux choses vraies pour toi ce soir-là (ce que tu ressentirais, ce que tu aurais préparé, ce que tout le monde ferait en attendant que tu parles). Transforme chacune en rappel : pars d'un détail de ton souvenir (une phrase, un objet, un geste), un différent pour chaque, puis écris deux phrases. La première dit ce qui t'arrive, la seconde fait revenir le détail contre toi, de préférence sur le dernier mot. Garde la meilleure pour ton toast et l'autre en vanne de rechange : le jour J, tu peux changer de vanne sans toucher au reste. C'est réussi si ton toast fait entre 100 et 125 mots (c'est ta minute), si la vanne arrive après le souvenir, en reprend un détail et se retourne contre toi ou contre ce détail, jamais contre la personne honorée, l'organisation, le buffet ni un responsable, et si une vanne de rechange attend à côté. Aucun pot en vue ? Choisis quelqu'un qui t'a dépanné au travail et imagine son pot de départ. Rien à prononcer : le toast reste sur ta feuille jusqu'au jour J.

- **Mots** : avant 246, après **204** (21 + 32 + 24 + 20 + 24 + 54 + 17 + 12). Rendu : hors encadré 175, encadré **29** (avant : 143 et 103).
- **Diff réel** : environ 42 mots nets en moins ; 5 coupes sèches (voir B.2), une fusion de critères (-13 net, dont +2 pour « si ton toast » à la place de « s'il », qui avait perdu son antécédent), un remplacement (« tu changes » devient « tu peux changer », +1), un bloc de 54 mots déplacé avant le repli. Environ 80 % des mots d'origine sont conservés dans le même ordre.
- **Même geste, même critère, même repli** : oui. Les chiffres (100, 125, soixante, trois, deux) sont inchangés. Une nuance fusionnée : « jamais contre la personne qui l'a dit ou donné » devient « jamais contre la personne honorée ». À soumettre explicitement aux relecteurs.
- **Garde-fous techniques** : une seule phrase interrogative hors citation (« Aucun pot en vue ? »), qui ouvre le repli et reste le début attendu par `REPLIS[6]` ; libellé « DÉFI SOIXANTE SECONDES : » conservé ; zéro tiret cadratin ; pas de guillemets, donc rien qui perturbe le repérage des citations.
- **Plancher** : sous environ 200 mots, il faudrait retirer un exemple (la parenthèse des trois « choses vraies ») ou un critère. Ce ne serait plus raccourcir le défi, mais le modifier. Je ne le propose pas.

### B.4 Proposition 6 bis (prudente) : 246 mots vers 226 (-20, -8 %)

Même défi, texte d'origine conservé à l'identique sauf trois coupes sèches (« Pas besoin d'être sur place : », « , c'est l'étape qui fait d'un fait une vanne », « Pas besoin de chrono : compte tes mots. ») et le critère de réussite déplacé avant le repli. Risque de relecture minimal.

> DÉFI SOIXANTE SECONDES : écris un toast en trois blocs : un souvenir précis, une seule vanne en rappel, une phrase de fermeture. Imagine-toi au pot et note deux choses qui seraient vraies pour toi ce soir-là (ce que tu ressentirais, ce que tu aurais préparé, ce que tout le monde ferait en attendant que tu parles). Transforme chacune en rappel : pars d'un détail de ton souvenir (une phrase, un objet, un geste), un différent pour chaque, puis écris deux phrases. La première dit ce qui t'arrive, la seconde fait revenir le détail contre toi, de préférence sur le dernier mot. Garde la meilleure pour ton toast et l'autre en vanne de rechange : le jour J, si l'ambiance n'est pas celle que tu imaginais, tu changes de vanne sans toucher au reste. C'est réussi s'il fait entre 100 et 125 mots (c'est ta minute), si la vanne arrive après le souvenir, si elle reprend un détail de ce souvenir et se retourne contre toi (ou contre ce détail, jamais contre la personne qui l'a dit ou donné), sans viser la personne honorée, l'organisation, le buffet ni un responsable, et si tu as noté une vanne de rechange à côté. Aucun pot en vue ? Choisis quelqu'un qui t'a dépanné au travail et imagine son pot de départ. Rien à prononcer : le toast reste sur ta feuille jusqu'au jour J.

- **Mots** : avant 246, après **226** (21 + 34 + 24 + 20 + 31 + 67 + 17 + 12). Rendu : hors encadré 197, encadré 29.
- Seul avantage sur la 6 : tous les critères sont littéralement ceux de la version validée. Inconvénient : le défi reste long (226).
- **Ma reco** : la 6. Si Thomas veut zéro risque de nuance perdue, la 6 bis.

### B.5 Étape 2 : proposition 2 (optionnelle, réordonnancement seul) : 105 mots vers 105

Verdict : **le défi n'a pas de graisse.** Chaque phrase porte un élément distinct (le geste, la garde « présentable si ton chef le lit », le choix du mail, le brouillon qui compte, le repli, le critère). « il compte quand même » fait écho à la scène de l'étape, c'est voulu. La seule retouche utile est de sortir le critère de l'encadré.

> DÉFI PS : aujourd'hui, écris un PS d'une phrase qui corrige une erreur que personne n'a faite : prends une petite scène vraie de ta journée, rectifie un seul détail et finis sur la version rectifiée. Il doit rester présentable si ton chef le lit. Choisis un mail à faible enjeu, entre collègues, et si tu hésites, garde le PS en brouillon : il compte quand même. C'est gagné si ton PS tient en une phrase et que la version rectifiée en est la toute fin. Pas de mail pro à envoyer aujourd'hui ? Écris le PS que tu aurais ajouté au dernier mail sérieux que tu as envoyé.

- **Mots** : avant 105, après **105**, aucun mot retiré ni ajouté, une phrase de 19 mots déplacée. Rendu : hors encadré 83, encadré 22 (avant : 64 et 41).
- Même geste, même critère, même repli ; une seule phrase interrogative hors citation, début du repli inchangé (« Pas de mail pro à envoyer aujourd'hui ? ») ; libellé « DÉFI PS : » conservé ; zéro tiret cadratin.
- **Attention** : le conseil de l'étape 2 est celui de l'exception limitée du choix 7 a (contenu et défi « mot pour mot » du tour 13). L'exception ne couvre que la chute de l'exemple : même un simple déplacement du défi repasse la relecture à l'aveugle. Si la relecture n'est lancée que pour l'étape 6, **garder l'étape 2 telle quelle est cohérent** (le défaut est mineur, le texte est court).

## C. Variantes du refrain

Aucune. Verdict A = garder. La seule retouche liée au refrain est A bis (ajout de « vanne comprise » à l'étape 6), qui laisse la phrase du test identique.

## D. Suite à donner (rien n'est fait ici)

1. **Décision Thomas** : (a) refrain : garder (reco) ; (b) A bis : oui ou non ; (c) étape 6 : proposition 6 (reco), 6 bis, ou garder ; (d) étape 2 : proposition 2 (seulement si une relecture est lancée) ou garder.
2. **Relecture à l'aveugle** de chaque texte retenu (2 relecteurs indépendants, version d'origine non montrée, contre les étalons de l'audit s14). Consigne à ajouter : vérifier geste, critère de réussite et repli identiques à la version validée, et que rien n'est devenu plus sec. Une version qui sort sous la barre n'entre pas en ligne, la version validée reste en place.
3. **Si GO après relecture, @fullstack** : remplacer `exercise` (étapes 2 et/ou 6) dans `parcours-boulot-s19.json`, `conseils-seed.json` et la base (avec sauvegarde, comme pour les conseils de Storytelling), et `moduleDetail` de l'étape 6 si A bis. `parcours-rendu-s19-iter3.test.ts` doit rester vert sans modification (un seul « ? » hors citation, début du repli inchangé). `parcours-contenu-s19-boulot.test.ts` ne bouge pas tant que le refrain est gardé. Documenter dans `REPLIT_ACTIONS.md`.
4. **Hors périmètre, constaté** : aux étapes 3, 4 et 5, le repli du défi est aussi nommé dans le `moduleDetail` (demi-phrase voulue par l'éditorial, « chaque moduleDetail nomme sa version sans risque »). Je ne le touche pas.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/copy/boulot-refrain-defis-s19-diagnostic.md`. Aucun autre fichier modifié (historique des interventions non mis à jour, conformément à la consigne).
- Décisions : refrain GARDER (choix 6 B, rituel annoncé, rythme hebdomadaire, test unitaire) ; défi 6 : proposition 6 (204 mots) ou 6 bis (226) ; défi 2 : pas long (105), réordonnancement optionnel ; aucun autre défi au-dessus de 180.
- Points d'attention : comptage manuel à recompter par script ; critère de réussite dans l'encadré aux étapes 2 et 6 (déduit du code, à confirmer sur capture) ; nuance fusionnée « personne qui l'a dit ou donné » ; toute proposition retenue passe la relecture à l'aveugle avant d'entrer en ligne.
---


---
**Arbitrage de la session (11/10, délégation de Thomas « Go tout est ok »)** : refrain GARDÉ (choix 6 B) ; A bis non retenu (2 mots, ne justifie pas une relecture à l'aveugle) ; défis des étapes 2 et 6 GARDÉS tels quels (propositions 6, 6 bis et 2 non lancées) ; le défaut réel (critère de réussite rangé dans l'encadré « Version sans risque ») est corrigé dans le code (découpe en 3 morceaux : défi, repli, critère), sans changer le texte validé.
