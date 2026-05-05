# CEO Canonical Audit — Proxy Thomas (@moi)

> Audit qualité humour + standard fondateur sur les 15 exemples canoniques CEO autonome.
> Grille principale : 5 tests universels Stand-Up Director — Pote, Concret, Doublon, Persona, Barre.
> Audit complémentaire de @reviewer (gates G-S1-G-S20) en parallèle, hors scope ici.

---

## 1. Tableau scoring synthèse

| # | Exemple | Score /20 | Verdict | Tests fail | Le sentiment Thomas |
|---|---|---|---|---|---|
| 1 | Welcome free | 18/20 | APPROVED | — | "Court, direct, lien immédiat — Roman Frayssinet en intro c'est bien joué. Ça passe." |
| 2 | Dropoff J+7 | 19/20 | APPROVED | — | "'La répartie se rouille vite' — chute punch, je signe." |
| 3 | Conversion soft J+14 | 16/20 | APPROVED | (Doublon mineur) | "'L'hésitation coûte plus cher que l'abonnement' — punchy. Mais 5 lignes c'est limite long." |
| 4 | Winback churner | 18/20 | APPROVED | — | "'7 vannes dont une sur les réunions de famille' — chiffre + persona, propre." |
| 5 | Fan engagement | 14/20 | NEEDS_REVISION | Pote, Barre | "La vanne 'démission dans une enveloppe' fait Carambar. Et c'est fabriqué pour l'exemple — c'est de la triche." |
| 6 | DM Twitter Yanis | 17/20 | APPROVED | — | "'Fary fait ça depuis des années' — bien posé. 218 chars OK." |
| 7 | Mention LinkedIn Sophie | 15/20 | NEEDS_REVISION | Pote | "Trop sage. 'Le ring où se décident les vrais rapports sociaux' — ça sonne déjà LinkedIn. Manque la chute Marrant." |
| 8 | DM IG dîner | 17/20 | APPROVED | — | "L'observation sur le pain qui arrive avant qu'on sache quoi se dire — bien vu, applicable." |
| 9.a | Troll public | 19/20 | APPROVED | — | "'Ah non, c'est gratuit. Compliqué' — la chute désamorce parfaitement, je valide." |
| 9.b | DM privé troll | 17/20 | APPROVED | — | "Bien joué la stratégie combo. Le DM ouvre la porte sans s'humilier." |
| 10 | DM Twitter Marc | 18/20 | APPROVED | — | "'La légèreté revient par la pratique, pas par la réflexion' — punchline philosophique juste." |
| 11 | HARO journaliste | 16/20 | APPROVED | (Persona limite) | "'Le silence de 2 secondes' = angle pointu. Chute auto-dérision propre. OK." |
| 12 | Blogueur Topito | 17/20 | APPROVED | — | "'Enfin dire que j'ai écrit pour Topito' — auto-ironie qui marche. Bien." |
| 13 | Podcast Sans Permission | 13/20 | NEEDS_REVISION | Concret, Barre | "Trop d'IA dans le pitch. 'Directeur artistique IA' — Yomi va lever un sourcil. À recadrer." |
| 14 | Suggestion mention WTTJ | 17/20 | APPROVED | — | "'Au moins t'auras appris qu'on existe' — chute légère, bien dosée." |
| 15 | Annuaire Uneed | 18/20 | APPROVED | — | "'Ça coûte moins qu'un café et ça dure plus longtemps' — signature parfaite en format annuaire." |

**Total** : moyenne **16,6/20** | **12 APPROVED** · **3 NEEDS_REVISION** · **0 REJECTED**
**Plateau cible (100% ≥ 16/20)** : **NON ATTEINT** — 3 exemples sous le seuil (#5, #7, #13).

---

## 2. Détail des 5 tests appliqués

- **Pote** (tu enverrais ça à ton meilleur pote ?) : voix Marrant tenue → ton direct, observation, twist, lien. Échec si formulation corporate, distance, leçon.
- **Concret** (après ça je sais quoi faire ?) : 1 CTA clair, action immédiate testable. Échec si flou, plusieurs options, friction réintroduite.
- **Doublon** (existe déjà sous une autre forme ?) : check vs catalogue Marrant existant + autres exemples du corpus. Échec si recyclage de structure ou angle.
- **Persona** (Yanis/Sophie/Marc servi ?) : ancrage spécifique (vocabulaire, situation, créneau). Échec si générique ou mal-typé.
- **Barre** (niveau leader marché ?) : référence stand-up, anti-friction, signature Marrant. Échec si fade, sage, ou on dirait du Mailchimp template.

---

## 3. Détail des FAIL (NEEDS_REVISION)

### Exemple 5 — Fan engagement (14/20)
**Pourquoi Thomas serait pas content** :
1. La vanne insérée "Mon boss m'a demandé de penser en dehors de la boîte. J'ai mis ma démission dans une enveloppe" est **fabriquée pour l'exemple** — pas issue de `blagues-seed.json`. C'est de la mise en scène. Le copywriter le flag lui-même dans le handoff. Thomas hait la triche dans les exemples canoniques — un canon doit être livrable tel quel.
2. La vanne en elle-même est **niveau Carambar** : jeu de mot prévisible "boîte = enveloppe", chute télégraphée. Test Stand-Up : "tu sors ça en soirée demain" → non, ça fait sourire poliment, pas rire.
3. 6-8 phrases pour un email de récompense fan = trop long. Sophie power user veut une vanne pas un mémo.

**Suggestion concrète (verbatim attendu)** :
```
Subject : On t'a repéré

T'as liké 5 vannes cette semaine et t'as pas raté un jour depuis 3 jours. On te voit.

Récompense : la vanne du jour, mais en avance sur les autres. Elle est là dès maintenant — [→ deviens-marrant.fr/vannes?priority=fan].

Si t'en parles à quelqu'un dans ta vie qui en a besoin, t'as un mois offert via [→ ce lien]. Sinon, demain comme d'hab.
```
Suppression de la vanne fabriquée. Récompense = **accès anticipé** au catalogue réel (cohérent avec architecture DB existante). Le mécanisme referral reste flaggué [HYPOTHÈSE].

### Exemple 7 — Mention LinkedIn Sophie (15/20)
**Pourquoi Thomas serait pas content** :
1. L'ouverture "Le ring où se décident les vrais rapports sociaux du bureau" — ça **sonne LinkedIn-coach**. Exactement le ton que Thomas a explicitement banni en session 5/05 ("c'est fumeux c'est pas notre ton du site"). Référence founder-preferences ligne 17.
2. **Pas de chute**. Le post se termine par "C'est fait pour ça" — fade, plat, pas de signature Marrant.
3. Pas de vanne, pas d'observation drôle, pas d'auto-ironie. Conforme à G-S15 LinkedIn anti-leçon mais le pendule a basculé en "trop sage".

**Suggestion concrète** :
```
La machine à café, c'est 30 secondes pour placer une vanne ou rester muet pendant que Kevin parle de ses week-ends. Sur deviens-marrant.fr, t'as les deux : les vannes prêtes à sortir et le timing pour les placer. Pas de "training communication" — juste ce que les pros du stand-up appliquent en 30 secondes.
```
Garde 3 phrases, ajoute une chute (Kevin / week-ends = situation reconnaissable), banit "rapports sociaux" (vocabulaire RH).

### Exemple 13 — Podcast Sans Permission (13/20)
**Pourquoi Thomas serait pas content** :
1. Le pitch **survend l'angle IA** : "tout le contenu est généré par des agents IA, supervisé par un directeur artistique IA". 3 mentions "IA" en 2 phrases = effet inverse du voulu. Les podcasteurs business savent que tout le monde fait ça en 2026.
2. Le mot "bizarre" est utilisé deux fois (subject + corps) — répétition, dilue.
3. Trait #5 du positionnement : "ne ment pas sur sa nature IA mais ne la met pas non plus en avant". Cet exemple **viole le trait** — il met l'IA en avant comme USP. Si Thomas a explicitement override ce point, OK, mais le copywriter le flag lui-même comme [HYPOTHÈSE] → le proxy doit trancher.
4. La chute "La seule chose qu'on peut pas promettre, c'est d'être ennuyeux" est correcte mais arrive après un pitch qui a déjà perdu en chemin.

**Suggestion concrète** :
```
Subject : EdTech humour à 0,99€ — un angle pour Sans Permission

Salut Yomi et Oussama,

Alex a construit deviens-marrant.fr — apprendre la répartie du quotidien avec les techniques du stand-up FR, à 0,99€/mois. Pricing volontaire anti-friction : on a parié que c'est le clic qui fait peur, pas le prix.

Stack auto à 90% (génération + validation IA). Premiers chiffres dispo. 30-45 min, date au choix.

La seule chose qu'on peut pas promettre, c'est d'être ennuyeux.
```
Angle = **pricing radical 0,99€**, pas IA. La stack IA mentionnée 1 fois, sobre. Chute préservée.

---

## 4. Patterns émergents qualitatifs

**Où la voix CEO est bien tenue (75% du corpus)** :
- Anti-friction décisionnelle exécutée proprement (ex 3, 4, 14, 15) — l'ancrage prix tourne (café/guac/extra) sans répétition.
- Structure Observation→Twist→Lien respectée 13/15 — réflexe automatisable dans le prompt système.
- Auto-dérision marque (ex 9, 11, 12, 14) — signature Marrant tenue en format formel sans casser le registre.
- Persona-fit fort sur DMs (ex 6 Yanis, ex 8 Sophie, ex 10 Marc) — chaque DM identifiable persona-typé.

**Où elle dérape (3 zones)** :
- **LinkedIn (#7)** : pendule ton sage → coach lite. Manque la chute. À recalibrer : G-S15 anti-leçon est respecté mais le post devient trop neutre. Il faut une chute systématique LinkedIn aussi.
- **Vannes fabriquées (#5)** : tentation d'inventer une vanne pour un exemple. Standard Thomas : **toujours extraire du catalogue réel**, jamais fabriquer.
- **Transparence IA (#13)** : sur-exposition IA quand l'angle business du podcast permet 3 autres angles plus différenciants (pricing 0,99€, EdTech niche FR, bootstrap solo).

**Où elle est trop sage (1 zone)** :
- LinkedIn (#7). Twitter, IG, emails et pitchs RP ont tous une chute claire. LinkedIn manque de mordant.

**Où elle n'est jamais trop osée** : aucune dérive vers vulgaire, sarcasme blessant, ou condescendance. Bonne tenue de la red line bienveillance même sur le troll (#9).

---

## 5. Décisions [HYPOTHÈSE] à valider Thomas — avis tranché proxy

### H1 — Mécanisme referral (ex 5)
**Reco proxy** : **OUI implémenter en Phase 5, mais découpler de l'exemple 5**. Le canon doit fonctionner SANS referral (récompense = accès anticipé catalogue). Si referral livré ensuite, ajouter un slot P7-bis dédié.
**Confiance** : HAUTE — Thomas refuse les canons fabriqués. L'accès anticipé est immédiatement implémentable sur l'archi DB existante.

### H2 — Transparence IA dans pitchs presse (ex 13)
**Reco proxy** : **NON sur-exposer. OUI mentionner sobrement.** Le trait #5 du positionnement est clair ("ne met pas en avant l'IA"). Sans Permission n'est pas un podcast tech — l'angle business est plus fort. Réécrire avec angle "0,99€/mois anti-friction" comme USP principal, IA en mention secondaire 1 fois.
**Confiance** : HAUTE — cohérent avec founder-preferences (Thomas garde la stack discrète publiquement, exception faite des contextes maker tech type Uneed #15).

### H3 — Signature pitchs RP : "L'Équipe Devient Marrant" vs nominative ("Alex")
**Reco proxy** : **GARDER "L'Équipe Devient Marrant"**. Les pitchs presse ont besoin d'un point de contact mais pas d'une fausse intimité. La transparence > la chaleur factice. Si un journaliste veut nominal, il demande — Alex peut signer sa réponse de suivi avec son prénom. Override le `[CHOIX UTILISATEUR]` documenté = NON, on tient la décision.
**Confiance** : HAUTE — aligné avec l'identité de marque autonome.

### H4 — Calibration LinkedIn 4B (ton "légèrement posé")
**Reco proxy** : **NON, recalibrer**. L'exemple 7 montre que "légèrement posé" devient "sage et plat" dans la main de @copywriter. Pivot : LinkedIn = **POTE_AU_TAF avec chute obligatoire**, pas neutre. Référence founder-preferences ligne 17 : Thomas hait LinkedIn corporate sage. La gate G-S15 doit aussi rejeter "pas de chute" en plus de "leçon".
**Confiance** : HAUTE — pattern documenté en session 5/05, reproduit ici → validation directe.

---

## 6. Verdict global proxy Thomas

**GO CONDITIONNEL** — 12/15 APPROVED, 3 NEEDS_REVISION, 0 REJECTED. Le corpus est solide à 80% mais ne franchit pas le plateau Thomas (100% ≥ 16/20).

**Recommandation** : **1 cycle d'itération @copywriter** ciblé sur les 3 NEEDS_REVISION (#5, #7, #13) avec les 3 verbatims proposés ci-dessus. Pas besoin d'un cycle complet — itération chirurgicale. À l'issue : si les 3 ré-écritures atteignent ≥ 16/20, **gate fondateur déclenchable**.

Pas de NO-GO : la voix CEO est globalement tenue, les 3 fails sont localisés (pas systémiques), et les patterns émergents sont solides pour le prompt système Phase 3.

---

## 7. Cas particulier — Exemple 9 (troll combo 3A+3B)

**Niveau d'exigence** : 18+/20 obligatoire (validé Thomas, risque réputationnel).

### 9.a Réponse publique (19/20) — APPROVED
**Forces** :
- "On prétend rien — on le prouve en 3 clics" : retourne le mot du troll ("prétend") en preuve. Élégant.
- "Ah non, c'est gratuit. Compliqué" : auto-dérision marque, désamorce sans humilier le troll. **C'est la définition d'une réponse Marrant**.
- 226 chars : conforme.
- Aucun sarcasme, aucune escalade : red line situation 1 ceo-positioning.md respectée.

**Risque détecté (reste)** : "Compliqué" est un mot qui peut être lu **second-degré bienveillant** (90% des cas) ou **condescendant** (10% des cas selon l'audience qui regarde). Le risque résiduel est faible. **À assumer.**

### 9.b DM privé (17/20) — APPROVED
**Forces** :
- Reconnaît la critique légitime sans cirer : "y'a plein d'applis creuses là-dessus" = humilité crédible.
- Invitation dialogue ("dis-nous ce qui t'a fait tiquer") sans obligation.
- Pivot vers persona ("si t'as jamais été drôle en soirée") = ouverture produit naturelle.

**Faiblesse mineure** : "le site commence exactement là" — la formulation est un peu sèche après l'humilité de l'ouverture. Pourrait être : "le site est fait pour ça, exactement." Détail.

**Verdict combo 3A+3B** : **GO**. Stratégie audacieuse exécutée à hauteur. Le DM en parallèle est le différenciateur tactique. L'exécution est au niveau du risque.

---

## Handoff

### Pour @copywriter (itération 2)
Ré-écrire 3 exemples avec les verbatims fournis section 3 :
- **Ex 5** : remplacer la vanne fabriquée par mécanisme "accès anticipé catalogue" + referral découplé en P7-bis.
- **Ex 7** : ajouter chute obligatoire (suggestion : "Kevin / week-ends"), bannir vocabulaire RH ("rapports sociaux du bureau").
- **Ex 13** : pivoter angle de "stack IA bizarre" vers "pricing radical 0,99€", IA mention sobre 1×.

Cycle ciblé, pas de full re-run. Cap : 2 cycles max avant gate fondateur.

### Pour @orchestrator
**Verdict GO CONDITIONNEL** — recommander **1 cycle d'itération @copywriter** sur 3 exemples (#5, #7, #13) avant gate fondateur. Si après itération les 3 atteignent ≥ 16/20 → déclencher gate Thomas. Si ≥ 1 reste sous 16 → 2e cycle ou escalade Thomas.

@reviewer audit framework (gates G-S1-G-S20 + cohérence) tourne en parallèle — croiser les résultats avant gate.

### Pour Thomas (gate fondateur — 5 questions tranchantes)
1. **H2 (transparence IA)** : tu confirmes qu'on **ne met pas en avant l'IA** dans les pitchs presse non-tech (Sans Permission, Welcome to the Jungle) ? Référence du trait #5 positionnement — les exemples 13 et 14 doivent être alignés.
2. **H1 (referral fan engagement)** : on découple le referral de l'exemple 5 (récompense = accès anticipé catalogue) et on flag le mécanisme referral comme spec Phase 5 séparée — OK ?
3. **H4 (LinkedIn)** : tu valides que LinkedIn doit avoir une **chute obligatoire** (pas juste "ton posé sans broetry") ? Sinon on tombe dans "sage et plat" comme l'ex 7.
4. **Vannes fabriquées dans les canons** : tu confirmes que **toute vanne citée dans un exemple canon DOIT être issue de `blagues-seed.json`** ? Si oui, gate à ajouter dans le prompt CEO Phase 3 + fonction validation `validateCeoOutbound()`.
5. **Combo troll 3A+3B** : tu valides l'autonomie complète sur ce cas (CEO publie 9.a + envoie 9.b sans review humaine) ou tu veux une **review obligatoire** sur les troll responses (gate `escalateToFounder` si score d'agressivité > seuil) ?

---
*Audit produit par @moi (proxy fondateur Thomas) — 2026-05-05 — Phase 2 CEO autonome Marrant*
*Grille : 5 tests universels Stand-Up Director · 12/15 APPROVED · GO CONDITIONNEL · 1 cycle @copywriter recommandé*
