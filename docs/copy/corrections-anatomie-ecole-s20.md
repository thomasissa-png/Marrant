# Corrections /anatomie-vanne (vannes 1 et 4) et retrait de « école » (s20, 13/10/2026)

> Décision de Thomas (13/10, non re-questionnable) : les vannes d'exemple 1 et 4 sont remplacées par des vannes écrites pour l'occasion. Aucun fichier de code modifié ici : ce document donne le texte exact à poser.
> Règle d'or s18 : rien ne passe en ligne avant la relecture à l'aveugle. Les candidates ci-dessous sont des propositions, à faire relire sans les analyses.
> [Framework : décryptage setup / pivot / punchline] [Conscience : Problem-Aware, lecteur qui cherche à comprendre la mécanique d'une vanne]

## Pourquoi le catalogue a échoué (M01 et M02, 3 relecteurs)

- **M01** : le champ `pivot` contenait la morale au lieu de la bascule (et contredisait l'analyse) ; l'analyse finissait en répétant cette morale ; « ça parle à beaucoup de familles » est une généralité non sourcée ; la chute « On est trois. » était télégraphiée (« douze » annonce tout), donc un sourire, pas un rire.
- **M02** : une seule phrase, donc pas de setup ni de chute séparés ; aucun mot ne portait deux sens successifs ; « mon date » était un anglicisme bancal.
- **Garde-fous appliqués ci-dessous** : pivot = bascule (« on attend X, on découvre Y »), jamais la morale ; une analyse qui finit sur la mécanique, pas sur une phrase-leçon ; zéro généralité sur « les gens » ; chute avec un second temps ; double sens installé par le setup et révélé par la chute.

Contrôle de catalogue : aucune amorce commune avec les 142 vannes actives (`vannes-actives-1310.json`). Deux voisinages écartés : « pot de départ » (déjà une vanne) et « série regardée à deux » (déjà une vanne). « Mon père m'envoie ses messages en MAJUSCULES » existe : j'ai changé l'amorce de la candidate B.

---

## 1. Vanne 1, catégorie Observation (tableau `vanneExamples`, premier élément)

Barre : setup plus long que la punchline, punchline de moins de 10 mots, comptes d'après la règle de la page (l'apostrophe compte pour un mot : « m'envoie » = 1).

### Classement

1. **A, la moutarde de la coloc** (choisie) : contexte neuf sur la page (la coloc, persona Yanis), chute sèche, un mot (« ancienneté ») qui fait tout le travail.
2. **B, la fleur du matin** : la plus narrative et la plus drôle à l'oral, mais elle ajoute un « père » et une « voisine » à une page qui a déjà un père (cartes Décalage et Anti-chute) et un voisin (vanne 3). À prendre si Thomas préfère le récit à la variété.
3. **C, l'agenda de fin de soirée** : juste et reconnaissable, rire plus léger (sourire net).

### A. La moutarde (recommandée)

- **Setup (15 mots)** : Dans le frigo de la coloc, il y a une moutarde que personne n'a achetée.
- **Pivot affiché** : On attend une moutarde à jeter, on découvre une colocataire historique
- **Punchline (8 mots)** : On ne la jette pas. Elle a l'ancienneté.
- **Analyse** : Setup de 15 mots : un détail de coloc, concret, et le « personne n'a achetée » plante déjà un petit mystère. Le pivot change le statut de la moutarde : elle quitte la catégorie des restes à jeter pour celle des résidents qu'on ne vire pas. La punchline tient en 8 mots, et « ancienneté » est un mot de ressources humaines qui n'a rien à faire dans un frigo : c'est ce décalage de vocabulaire qui fait rire.
- Lue à voix haute : la pause tombe après « jette pas », « ancienneté » arrive seul en fin de souffle. OK.

### B. La fleur du matin

- **Setup (12 mots)** : Chaque matin, mon père m'envoie une fleur qui scintille avec “Bonne journée”.
- **Pivot affiché** : Le bonjour du matin est en fait un contrôle de présence
- **Punchline (9 mots)** : Un matin sans réponse, il a appelé ma voisine.
- **Analyse** : Setup de 12 mots : un détail précis (la fleur qui scintille) plutôt qu'un portrait de père dépassé par la technologie, et un geste d'affection qui n'éveille aucun soupçon. Le pivot est le sens du message : ce qu'on lisait comme un bonjour fonctionne comme un contrôle de présence, et c'est son absence qui le révèle. La punchline tient en 9 mots, et la voisine fait l'escalade : le père ne se demande pas si tu es occupé, il passe directement au plan B.
- Lue à voix haute : « sans réponse » doit être dit plat, « ma voisine » en dernier. OK.

### C. L'agenda de fin de soirée

- **Setup (14 mots)** : En fin de soirée, quelqu'un lance toujours : “Il faut qu'on se voie plus souvent !”
- **Pivot affiché** : On attend une date proche, on découvre des agendas déjà pleins
- **Punchline (8 mots)** : Chacun sort son agenda. Premier créneau commun : mars.
- **Analyse** : Setup de 14 mots : la phrase de fin de soirée, sincère sur le moment, qui promet beaucoup et n'engage à rien. Le pivot est le passage de l'élan à la logistique : l'intention est vraie, mais les agendas la rattrapent en trois secondes. La punchline tient en 8 mots, et « mars » fait tout le travail : un mois précis est plus drôle qu'un vague « dans longtemps ».
- Lue à voix haute : correct, mais c'est la moins surprenante des trois.

### Bloc à poser (candidate A)

```ts
  {
    category: "Observation",
    setup: "Dans le frigo de la coloc, il y a une moutarde que personne n'a achetée.",
    pivot: "On attend une moutarde à jeter, on découvre une colocataire historique",
    punchline: "On ne la jette pas. Elle a l'ancienneté.",
    analysis:
      "Setup de 15 mots : un détail de coloc, concret, et le « personne n'a achetée » plante déjà un petit mystère. Le pivot change le statut de la moutarde : elle quitte la catégorie des restes à jeter pour celle des résidents qu'on ne vire pas. La punchline tient en 8 mots, et « ancienneté » est un mot de ressources humaines qui n'a rien à faire dans un frigo : c'est ce décalage de vocabulaire qui fait rire.",
  },
```

---

## 2. Vanne 4, pivot « Double sens » (champ `example`, section « Les 6 types de pivots »)

Contrainte : un mot ou une expression change de sens à la chute, sens et non son, lisible du premier coup. Ni « initiatives / vendredi » ni « responsabilités ». Pas de « psy » (déjà dans la carte Retournement voisine) ni de « voisin » (vanne 3).

### Classement

1. **Limites** (choisie) : « poser ses limites » (se protéger) devient la limite de vitesse. L'image est immédiate, et « personne n'a ralenti » fait écho au sens installé (les limites ne sont pas respectées) sans l'expliquer.
2. **Compter** : « compter sur lui » devient « compter » au sens arithmétique. Le plus clair des trois, situation boulot, chute chiffrée (zéro).
3. **Passer** : « passer me voir » devient « passer, et voir au passage ». Sec, deux sens bien séparés, rire plus discret.

### Les trois lignes exactes

1. `« Il paraît qu'il faut savoir poser ses limites. » → « J'ai planté un panneau 30 devant chez moi. Personne n'a ralenti. »`
2. `« Mon chef m'a dit que pour mon augmentation, je pouvais compter sur lui. » → « J'ai compté : ça fait zéro. »`
3. `« Un ami m'a dit qu'il passerait me voir. » → « Il est passé. Il m'a vu. Il a continué sa route. »`

Lectures à voix haute : (1) « limites » est entendu au sens thérapie, le panneau 30 retourne le mot en une image ; (2) la pause avant « zéro » fait la chute ; (3) trois phrases courtes, la dernière un cran plus basse. Les trois se comprennent sans connaître le jeu de mots à l'avance, et aucune ne repose sur une homophonie.

### Ligne à poser (candidate 1)

```ts
example: "« Il paraît qu'il faut savoir poser ses limites. » → « J'ai planté un panneau 30 devant chez moi. Personne n'a ralenti. »",
```

---

## 3. « école » retiré, liste alignée sur « boulot, couple, soirées, famille, gaming »

Les deux extraits sont uniques dans leur fichier (vérifié par Grep).

### 3.1 `apps/web/src/lib/llms-content.ts` (la ligne est la **102**, pas la 101)

- **Avant** : `par contexte (couple, boulot, école, soirées, dating…)`
- **Après** : `par contexte (boulot, couple, soirées, famille, gaming)`

Le point de suspension disparaît, la liste étant désormais complète. « dating » sort, car il n'est pas dans les 5 situations du site.

### 3.2 `apps/web/src/app/(dashboard)/blague-du-jour/page.tsx:48` (réponse de FAQ, alimente aussi le JSON-LD)

- **Avant** : `classé par situation : boulot, couple, soirée, école.`
- **Après** : `classé par situation : boulot, couple, soirées, famille, gaming.`

Phrase complète obtenue : « Dans le catalogue, classé par situation : boulot, couple, soirées, famille, gaming. ${count}, chacune avec sa chute. » (la variable `${count}` est inchangée ; la question de la FAQ aussi).

### 3.3 Restes de « école » signalés, NON touchés (hors périmètre demandé, à trancher par Thomas)

- `apps/web/src/components/home/feature-cards.tsx:15` : « École, boulot, couple, soirées : les vannes sont rangées par situation… » ; son test `apps/web/src/__tests__/dashboard/feature-cards.test.tsx:49` attend `/école, boulot, couple, soirées/i`. À corriger ensemble (texte + test) si « école » doit disparaître de l'accueil.
- La catégorie technique `ECOLE` (« École & Études ») existe encore dans `vannes-list.tsx:58,77`, `daily-content.tsx:63`, `favoris-list.tsx:67`, `vannes/[slug]/page.tsx:35`. Si le filtre reste visible, il contredit les deux textes alignés ci-dessus.
- `docs/copy/landings-s14.md:36` garde l'ancienne FAQ (document d'historique, pas du code).

---

## Contrôles

- Zéro tiret cadratin, guillemets « » (et “ ” à l'intérieur d'un setup, comme les exemples existants de la page).
- Aucun chiffre ni témoignage ajoutés : seuls des comptes de mots et des éléments de vanne (panneau 30, « zéro », « mars »).
- Aucun concurrent nommé, aucune généralité non sourcée dans les analyses.
- Comptes de mots recomptés à la main : A 15 / 8, B 12 / 9, C 14 / 8. Setup plus long que la punchline dans les trois cas, punchline sous 10 mots.

---
**Handoff → @orchestrator (puis @fullstack pour l'intégration, après relecture à l'aveugle)**
- Fichier produit : `/home/user/Marrant/docs/copy/corrections-anatomie-ecole-s20.md`
- Décisions : vanne 1 = A (moutarde de la coloc), B en alternative si Thomas préfère le récit ; vanne 4 = « limites / panneau 30 » (alternatives : compter, passer) ; pivots réécrits en bascule, sans morale ; liste des situations alignée sur les 5 du site, « dating… » retiré.
- Points d'attention : (1) relecture à l'aveugle obligatoire avant mise en ligne (règle d'or s18), à faire sans les analyses ; (2) llms-content.ts : la ligne est la 102 ; (3) restes de « école » hors périmètre : feature-cards.tsx + son test, et la catégorie `ECOLE` côté filtres ; (4) `REPLIT_ACTIONS.md` à mettre à jour par @fullstack au moment de l'intégration ; (5) après intégration, pre-commit code complet et CI verte.
---
