# Notation : B1 /blog/refuser-une-invitation-avec-humour (itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/B1-refuser-une-invitation-avec-humour.md` (numéros de ligne = ce fichier), `config/blog-cta.ts` l.65-71, `config/blog-forte-frappe.ts` l.22 et l.39-51, `config/blog-tracking.ts` l.15, `components/blog/blog-article-parcours-maillage.tsx`, `components/ui/markdown-renderer.tsx` (`headingId` l.180-193).
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Faits techniques du brief pris comme acquis (import, `faqs` + JSON-LD, `metaDescription`, CTA, partage texte seul, typo).
> Intouchables vérifiés : les 21 lignes sont identiques à `B1-candidates.md` / `B1-candidates-vague2.md` (contrôle sur n°3, 5, 7, 9, 11, 14) ; 0 tiret cadratin ou demi-cadratin (Grep) ; 0 humoriste. Aucun correctif ne touche le texte d'une ligne.
> Limites : pas de rendu ni de capture (programmé pour le 19/11) ; tests non exécutés ; pas de git (consigne).

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **9/10** | « En bref » et l.44 servent l'intention, mais le sommaire (l.48) passe après le paragraphe sur l'italique (l.46) : l'ordre corrigé sur A1 (C1) n'a pas été repris. |
| 2 | Sorties vers une 2e page | **9/10** | Couverture complète, mais autodérision proposée 2 fois dans le corps (l.136 puis l.161), et l'encart parcours retombe sur Machine à Café (CATALOGUE = `fort-volume`, aucune entrée dans `FORTE_FRAPPE_PARCOURS`), déjà lié en l.92 et sans rapport avec un refus. |
| 3 | CTA d'inscription | **10/10** | Entrée `blog-cta.ts` présente : CTA juste après le corps, titre « Le refus est parti. Reste la relance en face. » relié à la section 5, note vraie. |
| 4 | Lisibilité mobile et structure | **10/10** | Format étalon (numéro, ligne, indication), bouton « Envoyer le message n°N » en texte seul, FAQ sortie du corps en `faqs`, 6 ancres conformes à `headingId`. |
| 5 | Ton Marrant des textes ajoutés | **7/10** | Phrase cassée l.73, intro famille qui annonce « le dimanche, le dessert » absents des lignes (l.98), n°11 qui contredit la règle 1 (« bientôt » = le « on verra » de l.44), 2 indications qui exposent à un refus vexant (n°3, n°14), 3 indications obscures ou redondantes (n°5, n°18, n°19), FAQ 3 qui répète mot pour mot l'indication n°6. |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, promesses vraies, sauf « Dire non avec le sourire [...] le parcours Confiance est fait pour ça » (l.161) : Confiance promet « reprendre après une pause, trouver ta place dans un groupe qui rit » (maillage l.99-103), pas dire non. |
| 7 | Sécurité SEO | **10/10** | Title 55 car. avec la requête en tête, meta 144 car., H1, 6 H2 en question dont un reprend la requête, « annuler » et « sans vexer » présents, FAQPage via `faqs`. |
| 8 | Mesure | **10/10** | Slug dans `TRACKED_ARTICLES` (l.15), partage tracé, sorties, ancres et scroll hérités du gabarit. |

**Note globale : 9,25/10** (74/80).
**Après les 7 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 2. Top 3

1. **D4 (indications n°3, n°11, n°14)** : seuls points où un lecteur qui suit la page à la lettre peut vexer quelqu'un ou envoyer un « on verra ». C'est le cœur de la promesse « sans vexer ».
2. **D5 + D6 (parcours)** : une promesse inexacte sur Confiance et un encart Machine à Café hors sujet, alors que le CTA promet « la relance en face », c'est-à-dire la répartie.
3. **D1 + D2 + D3** : sommaire dans le 1er écran, une phrase cassée et une intro qui annonce ce que la section ne contient pas.

## 3. Correctifs exacts

Fichier : `B1-refuser-une-invitation-avec-humour.md`, puis réimport avec `--update`. Sauf mention, rien d'autre ne bouge.

### D1. Sommaire avant le paragraphe sur l'italique (critère 1)

**Avant** (l.46 puis l.48, dans cet ordre) : le paragraphe « Chaque réponse tient en une ou deux phrases. [...] que toi seul connais. » puis la ligne « Va direct à ta situation : [...] [les phrases drôles](/blog/phrases-droles-conversations). »
**Après** : les deux mêmes paragraphes, texte inchangé, ordre inversé (« Va direct à ta situation » en l.46, « Chaque réponse » en l.48).
Pourquoi : le sommaire remonte d'environ 140 à environ 85 mots du haut, dans le 1er écran mobile, comme sur A1 (C1 appliqué, A1 l.45-47).

### D2. Phrase du timing qui tient debout (critère 5)

**Avant** (l.73) :
```md
Pour [améliorer ton timing](/blog/timing-humour), même à l'écrit, la phrase qui tombe en dernier est celle qui reste. Et pour les soirées où tu vas, [les blagues de soirée](/vannes/theme/soirees).
```
**Après** :
```md
Même à l'écrit, la phrase qui tombe en dernier est celle qui reste : [le timing de l'humour](/blog/timing-humour) t'explique pourquoi. Et pour les soirées où tu vas, [les blagues de soirée](/vannes/theme/soirees).
```
Pourquoi : « Pour améliorer ton timing » n'a pas de verbe principal qui lui réponde ; la phrase se lit comme une coquille.

### D3. Intro famille qui annonce ce que la section contient (critère 5)

**Avant** (l.98) :
```md
En famille, le refus fait plus de bruit qu'ailleurs : on le commentera. Garde le rire tendre, sur toi ou sur la situation (le dimanche, le téléphone, le dessert), jamais sur le menu ni sur ceux qui seront à table.
```
**Après** :
```md
En famille, le refus fait plus de bruit qu'ailleurs : on le commentera. Garde le rire tendre, sur toi ou sur la situation (ta chaise vide, le téléphone, la vaisselle), jamais sur le menu ni sur ceux qui seront à table. Et quand on te demande « tu viens quand ? », réponds en riant, puis donne une vraie date.
```
Pourquoi : aucune des 4 lignes ne parle du dimanche ni du dessert ; la nouvelle liste annonce les n°9, 11 et 12. La 2e phrase présente les n°10 et 11, qui répondent à « tu viens quand ? » et non à l'invitation elle-même, et pose la condition qui les rend cohérentes avec la règle 1.

### D4. Indications d'usage (critère 5 et respect)

Seule la ligne en italique change, la ligne numérotée au-dessus ne bouge pas.

| N° | Ligne | Avant | Après | Motif |
|---|---|---|---|---|
| 3 | l.63 | `*→ En vocal uniquement, d'une voix posée : par écrit, « ce vocal » ne veut plus rien dire. Une seule prise, sans rire à la fin.*` | `*→ En vocal uniquement (par écrit, « ce vocal » ne veut plus rien dire), à un pote qui te sait casanier, jamais pour une fête qu'il prépare depuis des semaines. Une seule prise, d'une voix posée.*` | Respect : « moins content de rester chez moi » avoue qu'on préfère son canapé. Drôle entre potes qui le savent, vexant pour quelqu'un qui a tout organisé. |
| 5 | l.69 | `*→ En fin de message d'invitation refusée, seulement si tu passes vraiment dimanche. Confirme l'heure dans la foulée, pour que la promesse tienne.*` | `*→ WhatsApp, avant samedi, seulement si tu passes vraiment dimanche. Confirme l'heure dans la foulée, pour que la promesse tienne.*` | « Message d'invitation refusée » ne veut rien dire : l'invitation vient de l'autre. |
| 11 | l.107 | `*→ Au téléphone aussi, d'une voix tranquille. Mets vraiment l'alarme : la phrase doit rester vraie.*` | `*→ Au téléphone aussi, d'une voix tranquille, et donne une vraie date juste après : seul, « bientôt » est le « on verra » de la règle 1. Mets vraiment l'alarme.*` | Seule, la ligne est une non-réponse, ce que l.44 (« le « on verra » est pire ») et la règle 1 condamnent. |
| 14 | l.126 | `*→ Dans le groupe, après le dernier changement de date. Remercie la personne qui organise dans un message à part : la ligne seule ne vise que ta propre habitude.*` | `*→ En message privé à la personne qui organise, après le dernier changement de date, avec un vrai merci dans la foulée. Dans le groupe, devant tout le monde, elle sonnerait comme un reproche.*` | Respect : lue par tout le groupe, une ligne qui compte les changements de date pointe l'organisateur, malgré l'indication. En privé, avec le merci, elle reste sur soi. |
| 18 | l.148 | `*→ À la relance « viens juste une heure ». À voix haute, avec une pause avant « C'était chez moi ». Par écrit, mets un point à cet endroit.*` | `*→ À la relance « viens juste une heure ». À voix haute, avec une pause avant « C'était chez moi ». Par écrit, envoie-la telle quelle : le point fait déjà la pause.*` | Le point est déjà dans la ligne : la consigne fait croire qu'il manque. |
| 19 | l.151 | `*→ À la deuxième relance aussi, plutôt à l'oral. Garde un ton tranquille et ne t'excuse pas.*` | `*→ À la relance « viens juste une heure », si la n°18 est déjà partie. Plutôt à l'oral, d'un ton tranquille, sans t'excuser.*` | « Aussi » renvoie à une « deuxième relance » qu'aucune ligne ne nomme. |

### D5. Fin de section 5 : promesse exacte, plus de doublon (critères 2 et 6)

**Avant** (l.161) :
```md
Dire non avec le sourire demande un peu d'entraînement : le [parcours Confiance](/parcours/confiance) est fait pour ça. Et pour rire de toi sans te rabaisser : [les blagues d'autodérision](/vannes/theme/autoderision).
```
**Après** :
```md
Tenir ton non quand on insiste, ça s'entraîne : le [parcours Répartie](/parcours/repartie) t'apprend à rebondir et à tenir un silence, une étape par semaine.
```
Pourquoi : « rebondir, tenir un silence » et « une étape par semaine » sont les mots du parcours (`blog-article-parcours-maillage.tsx` l.41 et l.53) ; la relance est exactement une situation de répartie, et c'est la promesse du CTA. Autodérision reste en l.136 et dans la liste de fin (l.189). Reporter dans les métadonnées (l.18) : `/parcours/confiance` devient `/parcours/repartie` (toujours 15 liens, tous existants).

### D6. Encart parcours sur Répartie (critère 2)

Fichier : `apps/web/src/config/blog-forte-frappe.ts`. **Avant** (l.50-51) :
```ts
  "message-anniversaire-drole-par-situation": "repartie",
};
```
**Après** :
```ts
  "message-anniversaire-drole-par-situation": "repartie",
  // Refus d'invitation : la suite naturelle est la relance en face (CTA de l'article,
  // section « t'es sûr de pas venir ? »), donc rebondir et tenir son non, pas
  // Machine à Café (cluster déduit de CATALOGUE), déjà lié dans la section boulot.
  "refuser-une-invitation-avec-humour": "repartie",
};
```
Pourquoi : sans entrée, l'encart affiche « Des blagues toutes faites à ta propre voix » (maillage l.119-130), hors sujet pour un refus et en doublon de l.92. Code : pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, ligne dans `REPLIT_ACTIONS.md`.

### D7. FAQ 3 sans répétition de l'indication n°6 (critère 5)

Dans `faqs` (réimport `--update`). **Avant** (l.207) : `Avant d'envoyer, relis-le en imaginant ton manager derrière ton épaule.`
**Après** : `Si tu hésites sur une ligne, prends la variante sans humour : au travail, un non poli ne coûte jamais rien.`
Pourquoi : la même phrase figure déjà sous la n°6 (l.82), au mot près ; la FAQ ajoute maintenant une vraie consigne.

### Récapitulatif

| # | Critère(s) | Emplacement | Type |
|---|---|---|---|
| D1 | 1 | l.46-48 | ordre |
| D2 | 5 | l.73 | texte |
| D3 | 5 | l.98 | texte |
| D4 | 5, respect | l.63, 69, 107, 126, 148, 151 | indications |
| D5 | 2, 6 | l.161 + métadonnées l.18 | texte |
| D6 | 2 | `blog-forte-frappe.ts` | code (1 entrée) |
| D7 | 5 | FAQ 3 (`faqs`) | texte |

Diff réel attendu (P0 s11) : 9 lignes de contenu modifiées et 2 déplacées sur environ 165, 4 lignes de config ; 0 caractère modifié dans les 21 lignes, le « 21 » reste juste partout.

## 4. Vérifications demandées

### SEO

| Point | État | Verdict |
|---|---|---|
| Title ≤ 60 car. avec la requête | « Refuser une invitation avec humour : 21 réponses prêtes » = 55 car., requête exacte en tête | PASS |
| Meta ≤ 155 car. | `metaDescription` = 144 car., « refuser une invitation », « sans vexer », les 4 situations, « 21 », « copier-coller » | PASS |
| H2 en question | 6 sur 6 (la FAQ passe en `faqs`) ; le H2 5 finit sur « » » avec le « ? » dans la citation : c'est bien une question | PASS |
| Requête dans un H2 | l.165 « Comment refuser une invitation avec humour sans vexer personne ? » | PASS |
| Secondaires | « annuler à la dernière minute » (H2 1), « excuse » (règle 3, n°17), « sans vexer » (H2 6, meta) | PASS |
| Ancres du sommaire | les 6 calculées avec `headingId` (minuscules, NFD, non-alphanumérique en tiret) correspondent | PASS |
| FAQPage | 4 Q/R en `faqs` + JSON-LD (brief) | PASS |

### Respect (aucun refus vexant)

| N° | Verdict | Motif |
|---|---|---|
| 1, 2, 4, 5 | OK | Rire sur soi ; n°2, 4 et 5 conditionnées à un fait vrai. |
| 3 | Corrigé (D4) | Avoue préférer rester chez soi : limité à un pote qui le sait, jamais pour une fête préparée. |
| 6 à 8 | OK | Rire sur soi (photos, mail, crayon) ; n°7 suivie d'un vrai merci, cohérente avec FAQ 3 (pot de départ = mot vrai en face). |
| 9, 10, 12 | OK | Tendres : la chaise, la date, la vaisselle. n°10 taquine la réplique du parent sans le viser. |
| 11 | Corrigé (D4) | Non-réponse, contraire à la règle 1, sans date derrière. |
| 13, 15, 16 | OK | La faute reste à l'auteur (retard, message oublié, chips remboursées). |
| 14 | Corrigé (D4) | En public, pointe les 3 changements de date de l'organisateur. |
| 17 à 21 | OK | Fermes et sur soi ; aucune excuse inventée (n°17 dit justement qu'il n'y en a pas). |
| 5 variantes | OK | Merci, présence, autre date : aucune ne culpabilise. |

Après D4 : 0 ligne qui fasse rire sur l'invitation, l'organisateur ou les autres invités, conforme à la règle 2 (l.173).

### Cannibalisation

Aucune. Grep sur `apps/web/src` et `docs/copy` : aucun autre article ne vise « refuser », « décliner » ni « annuler ». La seule mention d'invitation de l'étalon (`blog-articles.ts` l.1498, vanne n°32) est une blague, pas un texte à envoyer. Voisins vérifiés :
- `phrases-droles-conversations` : phrases pour l'oral, liée depuis l.48 avec l'ancre « les phrases drôles », qui renforce sa requête.
- `rester-muet-en-groupe` (l.3625) et `timidite-et-humour` (l.2336) existent bel et bien (la l.19 de B1 les dit « non vérifiés ») : intentions différentes (reprendre la parole, oser), aucun lien nécessaire. Corriger la l.19 en conséquence (métadonnée interne, hors note).
- `mot-de-depart-collegue-drole` (B3, 03/12) : la n°7 (refuser le pot de départ) touche « message pot de départ », mais l'intention diffère (dire non, pas écrire le mot). B3 sortant après B1, c'est B3 qui peut lier B1 (« si tu ne viens pas au pot »), pas l'inverse (lien mort jusqu'au 03/12).

## 5. Ne comptent pas contre le 10

- **« Je suis sûr » au masculin** (n°17, variante section 5) : la ligne est intouchable, la variante suit son accord.
- **Deux H2 qui finissent par « quand tu ne viens pas ? »** (sections 2 et 4) : chacun porte une requête distincte (pot, groupe WhatsApp) ; les varier coûterait de la précision.
- **Blague du jour proposée 2 fois en fin d'article** (l.183, l.193) : gabarit commun noté 10/10 (iter4).
- **Date imposée 19/11 au lieu du 26/11** du calendrier growth : décision du brief.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B1-iter1.md
- Décisions prises : 9,25/10 (74/80) ; 7 correctifs avant/après (D1 à D7) pour 10/10, sans toucher au texte des 21 lignes ni au title, à la meta ou au slug ; aucune ligne retirée ni déplacée ; SEO PASS ; aucune cannibalisation ; 3 indications corrigées pour le respect (n°3, 11, 14).
- Points d'attention : @copywriter applique D1 à D5 et D7 dans le fichier B1, puis réimport `--update` ; @fullstack ajoute D6 (1 entrée de config, pre-commit, `REPLIT_ACTIONS.md`) ; relecture des textes ajoutés contre `docs/copy/charte-refonte-copy-s11.md` ; captures 375/768/1280 après mise en ligne le 19/11.
---
