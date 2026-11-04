# Contrôle ciblé du cadrage v3.2 de l'app iPhone : @reviewer (tour 6, ciblé)

> Livrable contrôlé : `docs/mobile/cadrage-app-native-s23.md` (v3.2, 04/11/2026, @product-manager).
> Périmètre : mes 3 obligatoires de `reviewer-v3-1.md` (NO-A, NO-B, NO-C) et les passages listés à la ligne v3.2 du §16 (l.339). Pas un tour complet : le reste du document n'a pas été relu. Vérifié contre `attentes-utilisateur.md` l.38-54 et les panels v2 (`panel-sophie-v2.md` l.17-18, `panel-yanis-v2.md` l.33-34, `panel-marc-v2.md` l.31-32). Aucun fichier modifié hors de celui-ci, rien commité.
> Mesure de l'écart (P0 s11) : §3.2 l.83 et l.85 réécrites, §7 l.210 (résultat du test ajouté), §5.1 l.184, décision 8 bis l.301, §4 l.154-161 et §14 l.292-312 reformatés, en-tête l.7, §16 l.339-340. Retouche ciblée, conforme à l'annonce.

## 1. Statut des 3 obligatoires (vérifié dans le texte, pas dans le §16)

| v3.1 | Statut | Preuve dans la v3.2 |
|---|---|---|
| NO-A | **Levée** | l.83 : assignation « réécrite par mise à jour de la ligne dans deux cas seulement » : (1) retrait qualité, une fois par retrait ; (2) changement de thèmes, « J+1 et J+2 non envoyés, jamais J ». « Une seule fois » a disparu, le gel ne vise plus que les mouvements du pool. l.85 dit la même règle (une fois par jour et par installation, [HYPOTHÈSE]) et pose « 3 + 2 = 5 défis par installation », « 150 défis par IP et par jour » avec 30 créations. §7 l.210 : test « changement de thèmes » avec résultat attendu (J inchangé, J+1 et J+2 réécrits, un changement par jour, 5 et 150). Plus aucune trace de « au plus 3 » ni de « 90 par IP » (Grep) |
| NO-B | **Levée** | §5.1 l.184 : « seuls C9 et C10 sont notés » ; C1, C2, C4, C5, C11 réussi/échoué. Résultat écrit : Sophie 8,5 (C9 9, C10 8), Yanis 7,5 (C9 8, C10 7), Marc 7,5 (C9 7, C10 8), NO-GO de l'étape cadrage. Notes recontrôlées dans les trois panels : exactes. Plus aucun [À VÉRIFIER] dans §5.1 ni dans la décision 8 bis (Grep : les 4 restants, l.202, l.225, l.231, l.246, sont hors périmètre et légitimes). Décision 8 bis l.301 : même règle, même résultat |
| NO-C | **Levée** | §14 : chaque décision en puce non ordonnée « - **Décision N.** », donc plus aucune renumérotation au rendu ; 2 (l.293), 12 (l.305) et 16 (l.309) ont chacune leur ligne ; 7 bis et 8 bis aussi. §4 : « - **4.1** » à « - **4.8** », « 4.7 États transverses » sur sa ligne. Renvois contrôlés : décision 2 (l.246), 12 (l.113, l.248, l.304), 16 (l.239) ; §4.1 (l.170, l.174, l.335), §4.4, §4.5, §4.7, §4.8 : tous pointent vers le bon contenu |

## 2. Nouvelles contradictions introduites par la v3.2

**Aucune.** Gel et réécriture disent la même chose aux trois endroits (l.83, l.85, l.210) ; règle et résultat de 8 bis identiques entre §5.1 et §14 ; décision 5 renvoie au risque résiduel du §3.2 sans chiffre divergent.

## 3. Notes

| # | Critère | v3.1 | **v3.2** | En une ligne |
|---|---|---|---|---|
| 1 | Cohérence interne et avec le projet réel | 8,5 | **9** | NO-A levée sans nouvelle contradiction ; reste une imprécision de portée du plafond (S-2) |
| 2 | Conformité aux préférences fondateur | 9,5 | **9,5** | Aucune décision de Thomas présumée ni rouverte, 0 tiret cadratin dans les passages modifiés |
| 3 | Zéro donnée inventée, sources, [À VÉRIFIER] justifiés | 9 | **9,5** | Faux [À VÉRIFIER] retiré, notes du panel sourcées et justes, plafond marqué [calcul sur hypothèse] |
| 4 | Complétude du périmètre V1 | 9 | **9** | Inchangé (hors périmètre du contrôle) |
| 5 | Clarté des décisions laissées à Thomas | 8,5 | **9** | Thomas sait que l'étape cadrage est NO-GO selon la règle proposée et lit les décisions avec leurs vrais numéros ; levier de Marc non dit (S-1) |
| 6 | Plan par dépendances exploitable | 9 | **9** | Inchangé ; le test du lot 5b-0 a désormais un résultat attendu |
| | **Note globale** | 8,5 | **9 / 10** | **GO pour la barre 9/10** : NO-A, NO-B, NO-C levées, aucune obligatoire restante |

## 4. Corrections obligatoires restantes

**Aucune.**

## 5. Souhaitables nés du contrôle (à faire si une v3.3 a lieu, non bloquants)

**S-1. Le levier de Marc n'est pas dit (§5.1 l.184).** Le texte nomme « C10 de Yanis (7 pour un seuil de 8) » comme « le point à lever ». C'est vrai pour Yanis, mais Marc reste à 7,5 même si Yanis passe : avec C10 à 8, il lui faut C9 à 8 (il est à 7, au seuil). Son motif (`panel-marc-v2.md` l.31 : « pas un truc à tester aujourd'hui lié à mon avancée ») est la progression de fond, hors cadrage (question 1). Ajouter une phrase : « chez Marc, la moyenne demande C9 à 8, motif lié à la progression de fond, donc à la réponse de Thomas à la question 1 ». Cette lacune vient de ma propre formulation de NO-B (« à lever par C10 de Yanis »), que le PM a reprise : erreur du relecteur, pas du PM.

**S-2. Portée du plafond (l.85, l.210).** (a) « 5 défis par installation » vaut pour le jour de création : ensuite, une installation ajoute au plus 3 défis par jour (le nouveau J+2 et 2 réécrits). Écrire « par installation et par jour » ; au §7, le résultat « au plus 5 défis servis par installation » doit porter sur une journée, sinon le test Jest affirme une borne fausse dès le deuxième jour. (b) « 150 par IP et par jour » ne compte que les installations créées le jour même ; les installations des jours précédents s'y ajoutent. (c) À dire à Thomas dans le risque résiduel de la décision 5 : 150 dépasse le pool de l'app (149 actives au plus, moins les vannes sans champs ni défi) ; l'anti-moisson empêche la collecte facile, pas la collecte de tout le pool par une IP décidée en un jour. Aucune contradiction : la règle est juste, seule la portée du chiffre « exact » est à préciser.

**Toujours ouverts, non repris par choix (§16 l.340) :** SOU-A à SOU-G de `reviewer-v3-1.md`. Recevables en l'état.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/reviewer-v3-2.md`
- Verdict : **GO pour la barre 9/10, note 9/10** (v3.1 : 8,5). NO-A, NO-B, NO-C levées et vérifiées dans le texte ; aucune nouvelle contradiction dans les passages modifiés
- Obligatoires restantes : aucune. 2 souhaitables : S-1 (levier de Marc, issu de ma propre formulation de NO-B), S-2 (portée par jour du plafond de défis, et 150 supérieur au pool)
- Point d'attention pour Thomas : selon la règle proposée en 8 bis, l'étape cadrage est aujourd'hui NO-GO côté panel (Yanis et Marc à 7,5) ; le GO de @reviewer ne la change pas
- Agent à relancer : aucun obligatoirement ; @product-manager seulement si une v3.3 est ouverte pour d'autres raisons
---
