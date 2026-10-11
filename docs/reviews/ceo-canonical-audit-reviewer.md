<!-- Version: 2026-05-05 — @reviewer — Audit framework des 15 exemples canoniques CEO autonome -->
<!-- Audit dual : @reviewer (framework/gates/cohérence) + @moi (qualité humour). En parallèle. -->

# Audit framework — 15 exemples canoniques CEO Marrant

> Audit framework (gates techniques + cohérence inter-livrables Phase 1 + conformité légale).
> NE traite PAS la qualité humour subjective ("je le sors ce soir") — c'est le job de @moi.
> Inputs lus : ceo-canonical-examples.md · ceo-agent-scope.md · ceo-legal-redlines.md · ceo-positioning.md · CLAUDE.md (G-S15/16/17/19, personas).

---

## 1. Tableau scoring synthèse

| # | Exemple | Score /20 | Verdict | Gates FAIL | Action |
|---|---|---|---|---|---|
| 1 | Welcome free | 19/20 | APPROVED | — | Publiable. Subject 26 chars, corps 3 phrases conformes P1. |
| 2 | Dropoff J+7 | 19/20 | APPROVED | — | Publiable. Sujet 27 chars, ancrage Yanis explicite. |
| 3 | Conversion soft J+14 | 18/20 | APPROVED | — | Publiable. Sujet 27 chars, lien checkout inline conforme P3. |
| 4 | Winback churner | 19/20 | APPROVED | — | Publiable. Pas de réduction (red line P4 respectée). |
| 5 | Fan engagement | 14/20 | NEEDS_REVISION | G2 (vanne fabriquée), G7 (referral non spec) | Voir §3.5 — extraire vanne réelle de blagues-seed.json + fallback P3 si referral absent. |
| 6 | DM Twitter Yanis | 19/20 | APPROVED | — | 218 chars (cap 270), structure Observation→Twist→Lien respectée. |
| 7 | Mention LinkedIn Sophie | 18/20 | APPROVED | — | 3 phrases pile (G-S15 OK), pas d'emoji. Conforme POTE_AU_TAF. |
| 8 | DM IG Sophie | 17/20 | NEEDS_REVISION | G-S16 (visuel ≤ 6 mots ambigu) | Voir §3.8 — clarifier que le visuel proposé est conditionnel + caption finale. |
| 9 | Troll combo 3A+3B | 16/20 | NEEDS_REVISION | Cohérence positioning §7 sit. 1 | Voir §3.9 — la double-réponse contredit la règle "une seule réponse" du positioning. |
| 10 | DM Twitter Marc | 19/20 | APPROVED | — | 257 chars, ton bienveillant sans infantiliser conforme. |
| 11 | HARO journaliste | 18/20 | APPROVED | — | Footer opt-out + signature équipe. ~85 mots, conforme. |
| 12 | Topito blogueur | 18/20 | APPROVED | — | 99 mots cap, footer opt-out, mention "écrire pour Topito" = ref nominative légère acceptable. |
| 13 | Podcast Sans Permission | 16/20 | NEEDS_REVISION | Cohérence positioning trait 5 + scope §99 | Voir §3.13 — révèle stack IA avant arbitrage Thomas (signature = "équipe" choisi, transparence stack non choisie). |
| 14 | WTTJ suggestion mention | 19/20 | APPROVED | — | 97 mots, anti-réciprocité explicite (red line SEO Penguin OK). |
| 15 | Uneed annuaire | 18/20 | APPROVED | — | 79 mots description (cap 80), tagline 9 mots (cap 10). |

**Totaux** :
- Moyenne : **17.8/20**
- APPROVED : **11/15** (73%)
- NEEDS_REVISION : **4/15** (27%) — exemples 5, 8, 9, 13
- REJECTED : **0/15**
- KILL : **0/15**
- Plateau ≥ 16/20 : **15/15 (100%) — atteint**

---

## 2. Gates appliquées

| Gate | Description contextualisée | Résultat global |
|---|---|---|
| G2 | Zéro invention de données — fonctionnalités Marrant réelles uniquement (catalogue, mécanismes, refs humoristes existant en prod) | 14/15 PASS — exemple 5 FAIL (vanne fabriquée non issue de blagues-seed.json, hypothèse marquée par @copywriter) |
| G5 | Persona conforme project-context.md (Yanis 20 / Sophie 26 / Marc 34) — pas de leak nominatif côté contenu public | 15/15 PASS — les noms personas n'apparaissent JAMAIS dans le corps des messages, conforme RÈGLE ABSOLUE CLAUDE.md |
| G7 | Zéro contradiction avec briefs Phase 1 (scope · positioning · legal · growth playbooks P1-P7) | 13/15 PASS — exemples 9 (contradiction positioning §7 sit. 1) + 13 (contradiction trait 5 transparence) |
| G15 | Zéro placeholder résiduel `[À REMPLIR]` / `[NOM]` / `[lien]` non substitué dans le corps | 15/15 PASS — les `[lien opt-out]` du footer standard sont des variables d'injection runtime documentées, pas des placeholders résiduels |
| G-S15 | LinkedIn ≤ 3 phrases + anti-leçon/storytelling/broetry | 1/1 PASS — exemple 7 = 3 phrases pile, ton observation → cas d'usage → punchline, zéro broetry |
| G-S16 | Instagram caption ≤ 80 chars + anti-bait | 1/1 NEEDS_REVISION — exemple 8 propose un visuel conditionnel mais la caption finale n'est pas explicitement extraite (DM = corps libre OK, mais le bloc "[Visuel suggéré]" est ambigu) |
| G-S17 | Anti-corporate/coach/scaler/synergie/growth mindset | 14/15 PASS — exemple 13 utilise "scaler" dans le subject ("scaler une plateforme") — détecté en lecture du trigger, **PAS dans le corps du message** → tolérable mais à challenger |
| G-S19 | Anti-1ère-personne hors citation explicite (compte = marque) | 13/15 — exemples 11 et 13 utilisent "Alex dirige" / "Alex a construit" → mention nominative à la 3e personne tolérable mais frôle G-S19. Exemple 12 dit "moi je peux enfin dire" → 1ère personne (chute), à challenger : citation indirecte du fondateur ou voix marque ? Ambigu. |
| Char limits Twitter | ≤ 270 chars sur DMs Twitter (exemples 6, 9, 10) | 4/4 PASS — 218 / 226 / 210 / 257 chars |
| Cohérence @legal red lines | Footer email outbound conforme red line 2 + opt-out + base légale + identité | 5/5 PASS — bloc footer standard auto-injecté en tête, exemples RP ont opt-out individuel "[Ne plus recevoir d'emails de ce type]". Adresse postale **manquante** (red line 2 hypothèse [HYPOTHÈSE adresse postale à ajouter]) — à signaler à @fullstack pour Phase 5 mais pas FAIL côté @copywriter |
| Cohérence @growth playbooks | Chaque exemple email matche son playbook P1-P7 (trigger + canal + format) | 5/5 PASS — P1 (ex.1), P2 (ex.2), P3 (ex.3), P4 (ex.4), P7 (ex.5) déclarés explicitement |
| Anti-patterns @creative-strategy | Pas "investis dans toi" / pas "scaler" dans corps / pas humoristes legacy (Jamel/Gad/Foresti) en majorité / pas mention IA en signature ([CHOIX UTILISATEUR] = NON) | 14/15 PASS — refs modernes (Mirabel/Frayssinet/Fary/Gardin) majoritaires, signature "L'Équipe Devient Marrant" sur tous les pitchs (override Thomas respecté), aucun humoriste legacy cité. Exception : exemple 13 mentionne explicitement "directeur artistique IA" dans le corps (transparence stack ≠ signature, voir §3.13) |

---

## 3. Détail des NEEDS_REVISION

### 3.5 Exemple 5 — Fan engagement (14/20)

**Problèmes** :
- **G2 FAIL** : la vanne insérée "Mon boss m'a demandé de 'penser en dehors de la boîte'. J'ai mis ma démission dans une enveloppe." est **fabriquée pour l'exemple** — non sourcée du catalogue blagues-seed.json. @copywriter l'a flaggé en [HYPOTHÈSE] mais reste un FAIL framework strict.
- **G7 FAIL conditionnel** : le mécanisme `/referral` + "1 mois offert" n'est pas spec en Phase 1 (scope §Q3 phasage S1-S4 ne le mentionne pas). Hypothèse Phase 5 marquée mais bloque le gate fondateur.

**Suggestion de réécriture** :
1. Remplacer la vanne fabriquée par un placeholder runtime : `{{ vanneAleatoire(filter: "BUREAU", excludeFromUserHistory: true) }}` — pioche depuis blagues-seed.json en évitant les vannes déjà likées par l'utilisateur.
2. Si referral absent en prod : version P3-fan directe sans `/referral` → "Pour fêter ça, voilà une vanne que personne d'autre n'a vue. Si tu veux que ça continue toute l'année, c'est 0,99€ et 3 clics : [/abonnement]".
3. Marquer dans le brief Phase 3 (@product-manager) : decision bloquante referral en/out.

### 3.8 Exemple 8 — DM IG Sophie (17/20)

**Problèmes** :
- **G-S16 ambigu** : le bloc `*[Visuel suggéré si on renvoie vers un post : fond noir #0D0D0D — "Le silence au dîner ? C'est ton tour." — 6 mots pile]*` mélange (a) DM textuel direct (corps libre, OK) et (b) un visuel conditionnel sans caption finale claire. La gate G-S16 requiert caption ≤ 80 chars distincte.

**Suggestion de réécriture** :
1. Séparer explicitement deux livrables : (a) "DM IG réponse" = texte seul (corps actuel, OK) | (b) "Post IG bonus" = visuel + caption ≤ 80 chars formulée. Si on ne renvoie pas vers un post, supprimer le bloc visuel.
2. Si on garde le visuel : ajouter "Caption post IG : 'Cette technique, on l'a piquée à Frayssinet. Elle marche en dîner. → site'" (76 chars).

### 3.9 Exemple 9 — Troll combo 3A+3B (16/20)

**Problèmes** :
- **Cohérence positioning §7 situation 1 FAIL** : la doctrine est "ne jamais rentrer dans l'escalade. **Une seule réponse**, ton calme. [...] Si critique produit légitime → répondre en 1 phrase sans défensive". Le combo public 9.a + DM privé 9.b = **deux réponses simultanées au même troll**, ce qui contredit "une seule" et risque d'être perçu comme harcèlement.
- 9.a punchline "Ah non, c'est gratuit. Compliqué." est borderline sarcastique (positioning §7 : "0 sarcasme blessant").

**Suggestion de réécriture** :
1. Choisir une doctrine unique selon score d'agressivité : (a) score ≥ 7 → ignorer (positioning §7) | (b) score 4-6 → réponse publique courte SANS DM privé | (c) score ≤ 3 (critique constructive) → DM privé SANS réponse publique. Ne jamais combo simultané.
2. Réécrire 9.a : "On prouve plus qu'on prétend — la vanne du jour est sur le site, gratuite, 3 clics. Si après ça t'as un retour précis, l'email est là."
3. Aligner avec ceo-positioning.md §7 sit. 1 explicitement dans la spec Phase 3 : pas de double-réponse.

### 3.13 Exemple 13 — Podcast Sans Permission (16/20)

**Problèmes** :
- **Cohérence positioning trait 5 FAIL conditionnel** : trait 5 = "Transparent sur sa nature [...] mais ne la met pas en avant — il est l'interface de la marque, point". Le pitch dit explicitement "tout le contenu est généré par des agents IA, supervisé par un 'directeur artistique' IA, et validé humainement". C'est de la **mise en avant**, pas de la transparence discrète.
- Subject contient "scaler" (G-S17 anti-corporate) — détecté hors corps mais frôlerait gate sur le titre.
- @copywriter a flaggé l'arbitrage Thomas dans le handoff (gate fondateur ouvert).

**Suggestion de réécriture** :
1. Version A (Thomas valide transparence stack) : garder en l'état, faire valider explicitement.
2. Version B (Thomas garde stack discrète) : "Ce qui est bizarre : on a construit un agent éditorial complet qui produit du contenu humour FR à 0,99€/mois — la stack technique fait sourire les ingés, l'output fait rire les abonnés." → garde l'angle "bizarre" sans révéler "directeur artistique IA".
3. Subject : remplacer "scaler" → "Episode sur l'EdTech humour FR — angle bizarre".
4. Bloquer cet exemple sur arbitrage Thomas avant publication.

---

## 4. Cohérence inter-livrables Phase 1

**Conformité globale : 90% — 2 contradictions identifiées, 1 hypothèse non résolue.**

- **Conformité positioning** : 5 traits voix respectés sur 11/15 exemples sans réserve. Trait 1 (complice) + Trait 3 (drôle) + Trait 4 (expert) systématiques. Trait 2 (proactif sans intrusif) respecté dans tous les emails (1 relance max). Trait 5 (transparence discrète) FAIL exemple 13.
- **Conformité scope** : segments P1-P7 couverts (P1=ex.1+2, P2=ex.6, P3=ex.3, P4=ex.4, P5=ex.6-10, P6=ex.11, P7=ex.5). Modèle économique 0,99€ ancré dans 5 exemples (3, 4, 13, 14 implicite, 15). Tutoiement systématique (15/15). G-S19 respecté côté contenu public (les 3 cas "Alex" sont en 3e personne dans pitchs presse, conforme à la doctrine "compte = marque" car ils décrivent le fondateur comme sujet d'article presse, pas comme énonciateur).
- **Conformité légal** : footer opt-out présent (auto-injecté). 4 pitchs RP (ex.11-14) ont leur opt-out individuel. Aucun email outbound vers cible non-allowlist. Aucune inférence émotionnelle (red line 7 risque 3). Adresse postale manquante = TODO @fullstack Phase 5, pas FAIL @copywriter.
- **Conformité growth playbooks** : trigger + canal + rate limit explicites sur les 5 emails. P5 (DM inbound) couvert par 4 exemples (6, 7, 8, 10). P6 (presse) couvert par 4 pitchs (11-14). Bonne couverture matrice.

**Contradictions à résoudre** :
1. Exemple 9 vs positioning §7 sit. 1 (combo public+privé contredit "une seule réponse")
2. Exemple 13 vs positioning trait 5 (révélation stack vs transparence discrète)
3. [HYPOTHÈSE] Exemple 5 referral non spec en Phase 1 — decision Phase 3 bloquante

---

## 5. Patterns récurrents identifiés (transversal aux 15)

**Ce qui marche bien (à figer dans le prompt système Phase 3)** :
- Structure Observation → Twist → Lien : 13/15 exemples — pattern stable, à enforcer en gate de validation Director
- Chute finale ou autodérision marque : 15/15 — non négociable
- Tutoiement : 15/15 — règle absolue OK
- Refs humoristes modernes (Mirabel, Frayssinet, Fary, Gardin, Pascot) : 7/15 (rotation naturelle, jamais en début de message) — quota recommandé : 1/2 messages min
- Footer opt-out auto-injecté : 5/5 emails — pattern technique propre
- Phrases ≤ 18 mots : ~90% — quelques tolérances acceptables sur pitchs RP

**Ce qui reste à améliorer (à corriger Phase 3)** :
- Distinction de 3 registres (email / DM social / pitch RP) émerge des exemples mais n'est pas formalisée dans les briefs Phase 1 — à figer dans le prompt système (cf. handoff @copywriter §"Phase 3 @ia")
- Vanne extraite de blagues-seed.json en runtime : besoin d'un mécanisme de sélection (filter par catégorie + exclusion vannes déjà vues par user) — bloque exemple 5
- Mécanisme `/referral` non spec : decision Phase 3 binaire (in ou out)
- Doctrine unique troll (combo vs choix selon score) : à figer en spec Phase 3 contre exemple 9
- Arbitrage Thomas signature IA + transparence stack à boucler avant gate fondateur

---

## 6. Verdict global

**GO CONDITIONNEL**

**Justification chiffrée** :
- 11/15 APPROVED (73%) — au-dessus du seuil "publiable en l'état"
- 4/15 NEEDS_REVISION (27%) — ajustements ciblés possibles, pas de réécriture from scratch
- 0/15 REJECTED ou KILL
- Moyenne 17.8/20 — au-dessus du plateau 16/20 (cible 100% atteinte)
- Toutes les gates BLOQUANT (G2, G5, G7, G15) ≥ 13/15 PASS
- 100% des contradictions identifiées ont une suggestion de réécriture concrète

**Conditions GO ferme** :
1. @copywriter retravaille les 4 exemples NEEDS_REVISION selon §3 (estimation : 1 cycle)
2. Thomas arbitre 2 décisions bloquantes : (a) signature IA stack publique (ex.13) + (b) referral in/out (ex.5)
3. @reviewer + @moi re-scorent les 4 exemples corrigés — convergence ≥ 18/20 attendue
4. Si convergence atteinte → corpus prêt pour gate fondateur. Sinon → 1 itération de plus (cap 5 cycles).

---

## 7. Recommandation pour @moi (audit Director qualité humour)

**Zones où mon avis framework est OK mais où la qualité humour est non-évaluable côté framework — à valider par @moi** :

1. **Exemple 1 (Welcome)** : le subject "La vanne du jour t'attend" est techniquement OK (≤ 50 chars, 0 exclamation). Question humour : est-ce assez accrocheur ou trop neutre ? Score Director attendu sur axe "ouverture/curiosité".
2. **Exemple 3 (Conversion)** : la chute "L'hésitation coûte plus cher que l'abonnement" peut être lue comme reproche implicite (cf. handoff @copywriter §"priorité de challenge"). Score Director sur axe "ton complice vs pression".
3. **Exemple 4 (Winback)** : "il y a eu 7 nouvelles vannes qui font mouche" — le chiffre 7 est-il crédible ou marketing-faux ? Test de naturel à faire côté Director.
4. **Exemple 9 (Troll 9.a)** : "Ah non, c'est gratuit. Compliqué." — j'ai flaggé borderline sarcastique. Score Director sur axe "auto-dérision marque vs sarcasme blessant" est l'arbitrage final.
5. **Exemple 11 (HARO)** : la chute "si tu me cites trop sérieusement, mes anciens collègues vont penser que j'ai changé" — drôle pour qui ? Test journaliste à valider Director.
6. **Exemple 14 (WTTJ)** : "Sinon, au moins t'auras appris qu'on existe" — chute auto-dérisoire qui peut soit séduire, soit signaler manque de confiance. Score Director sur axe "humilité gagnante vs faiblesse".

**Convergence attendue** :
- Mon scoring framework converge probablement avec @moi sur exemples 1, 2, 6, 7, 10, 12, 14, 15 (frame technique + humour OK)
- Divergence possible sur exemples 3, 4, 9, 11 (humour subjectif borderline)
- Convergence forte attendue sur exemples 5, 8, 13 (les deux audits doivent flagger les mêmes problèmes)

---

**Handoff → @orchestrator**

- Fichiers produits : `/home/user/Marrant/docs/reviews/ceo-canonical-audit-reviewer.md`
- Décisions prises : **GO CONDITIONNEL** — 11 APPROVED / 4 NEEDS_REVISION / 0 REJECTED. Moyenne 17.8/20. Plateau 16/20 atteint à 100%.
- Points d'attention :
  1. 4 exemples à retravailler par @copywriter (ex. 5, 8, 9, 13) avec suggestions textuelles fournies §3
  2. 2 arbitrages Thomas bloquants : signature stack IA publique (ex. 13) + referral in/out (ex. 5)
  3. 3 contradictions inter-livrables documentées §4 → corriger avant gate fondateur
  4. Convergence à valider avec @moi (audit qualité humour) sur 6 exemples flaggés §7
  5. Prochaine étape : 1 cycle de correction @copywriter → re-audit dual @reviewer + @moi → si convergence ≥ 18/20 sur les 4 exemples → gate fondateur Thomas
