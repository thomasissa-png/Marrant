# Tour 4, relecture à l'aveugle @reviewer : niveaux et XP (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `docs/espace-client/niveaux-xp-s24.md` v4 (NX4). Même grille qu'aux tours 1 à 3.

## 1. Statut de mes corrections du tour 3

| T3 | Objet | Statut | Commentaire |
|---|---|---|---|
| A1 | « palier » pas libre (bloquant) | ok | §1.4 donne les faits ; §3.4 compare cap et palier ; reco « cap » argumentée ; « palier » gardé en option avec son conflit dit (« Chaque palier est un niveau à débloquer » contredit Q5 A) ; l'article n'est pas touché. |
| A2 | L'audit ne distingue pas la triche | ok, avec réserve | §2.6 dit la limite (« la base ne garde que le total ») et Q6 B ne baisse rien par défaut. Mais l'indice « non multiple de 5 » est présenté comme une **preuve**, et c'est moi qui l'avais formulé ainsi (C1). |
| A3 | Deux « Q6 » | ok | La cloche devient « la décision du 12/11 ». |
| A4 | Série non placée en v12 | ok | §3.0 et annexe B point 6. |

## 2. Ce qui est nouveau

- **Juste et vérifié** :
  - §1.1 et résumé : « le conseil du jour et celui d'une étape de parcours n'en rapportent pas » (seul `ConseilsList`, sur `/conseils`, appelle `addXp`).
  - §3.1 : « Le cap 5 ne s'atteint pas avant environ 18 étapes (trois grands parcours) ». J'ai recompté sur les `moduleXp` des seeds : 17 étapes plafonnent à 2 225 (Confiance, Storytelling et Répartie complets, puis la meilleure étape restante, 150) ; 18 étapes atteignent 2 300 (les trois grands parcours, ou Confiance, Storytelling et Répartie complets plus deux étapes de Boulot, 150 + 125). Le [à recompter sur les seeds] peut être levé.
  - Q4 B : 1 600 sur 3 100 = 52 %.
- **Choix nouveau, accepté** : §2.5 point 2. La table « un conseil une fois par compte » est construite tout de suite, avant la réponse à Q1, pour que la faille ne reste pas ouverte (300 XP par minute au montant fixe). C'est un changement par rapport à ma Z4 du tour 2, mais l'argument tient. L'anti-doublon voulu existe déjà dans le code (`completedTipIds`) : c'est la correction d'un défaut, pas une règle neuve.
- **Faux ou imprécis** : C1 (« preuve »), C2 (« Dès maintenant »).

## 3. Notes et corrections

| # | Critère | T1 | T2 | T3 | T4 | Justification |
|---|---|---|---|---|---|---|
| 1 | Exactitude des faits | 5 | 9 | 9 | 9 | Sources et minimum de 18 étapes justes. Mais « prouve l'usage de l'API » (C1) et « Dès maintenant » (C2). |
| 2 | Valeur pour les personas | 8 | 9 | 10 | 10 | Inchangé, au niveau. |
| 3 | Ton maison des noms | 7 | 9 | 9 | 10 | E1 tranché (« Tu es bien parti »), test de vérité passé, témoins écartés. |
| 4 | Respect des [CHOIX UTILISATEUR] | 6 | 10 | 10 | 10 | Le résumé dit honnêtement que C4 a été prise sans connaître les 10 XP par conseil, sans la rouvrir. |
| 5 | Qualité des questions | 7 | 9 | 8 | 9 | Q3 compare enfin deux mots réels. Q6 B repose sur une « preuve » qui n'en est pas une (C1). |
| 6 | Honnêteté des risques | 6 | 9 | 9 | 9 | Limite de l'audit dite. Reste C1. |
| 7 | Cohérence avec l'architecture | 7 | 10 | 9 | 10 | Annexe B à jour (conseil du jour et conseil d'étape sans XP, série). |

**Note globale : 9,6 / 10** (67 / 70 ; T3 : 9,1). Aucun bloquant.

1. **C1. §2.6 « Seul indice de triche prouvée : […] Un total qui n'est pas un multiple de 5 prouve l'usage de l'API » ; Q6 « les comptes dont le total prouve un usage de l'API à la main » ; Q6 B « les comptes où l'usage de l'API est prouvé ».** Problème : c'est mon formulé du tour 3, et il est trop fort. Le barème actuel ne produit que des multiples de 5, mais rien ne prouve qu'il en a toujours été ainsi :
   - `docs/content/progression-levels.md` décrit « +2 par blague lue » et « +5 par connexion » ;
   - les tests gardent une action `joke_read` (`apps/web/__tests__/unit/stores.test.ts` l. 88, `api-validation.test.ts` l. 282).

   Un ancien barème a donc pu créditer des montants non multiples de 5 à des abonnés honnêtes, et la reco B baisserait leurs points. Correction : écrire « indice fort, pas une preuve : un ancien barème (`progression-levels.md` : +2 par blague, +5 par connexion ; action `joke_read` dans les tests) a pu exister ; à confirmer par l'historique du dépôt avant de montrer la liste » ; dans Q6, remplacer « prouvé » par « très probable, vérifié dans l'historique ». **Bloquant : non**, mais requis avant de montrer la liste à Thomas.
2. **C2. Résumé : « Dès maintenant, lire un conseil ne rapporte plus de points en boucle. »** Problème : rien n'est livré. La correction part au chantier (§2.5), et aujourd'hui la boucle existe toujours. Correction : « Dès cette correction livrée, lire un conseil ne rapportera plus de points en boucle. » **Bloquant : non.**
3. **C3. §3.1 « [à recompter sur les seeds] ».** Problème : levable, le recompte est fait (section 2 : 17 étapes plafonnent à 2 225, 18 suffisent). Correction : remplacer la mention par ce résultat. **Bloquant : non.**

**Conditions du 10/10** : C1 à C3 (trois libellés), puis un contrôle par recherche de ces passages.
