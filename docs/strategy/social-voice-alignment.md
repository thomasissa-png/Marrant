# Audit d'écarts de voix — daily-social (s7) vs voix unifiée v3

> Auteur : @creative-strategy | Date : 2026-05-06
> Source de vérité voix : `docs/strategy/ceo-voice-unified.md` v3
> Source de vérité social : `apps/web/src/lib/ai/agents/social-media-agent.ts` (brief s7)
> Référence historique : `docs/social/social-reform-s7.md`

---

## 1. Synthèse exécutive

La voix s7 et la voix unifiée v3 partagent la même fondation (compte = marque, tutoiement, anti-persona-leak, anti-corporate) mais divergent sur **3 points structurels** :

1. **Style de phrase** : s7 prescrit staccato ("phrases courtes, rythme parlé, ruptures") — v3 interdit explicitement ce registre ("anti-pattern banni — style staccato : Court. Direct. Je clique.").
2. **Densité humour** : s7 impose "au moins 1 trait d'humour" et chaque post = "micro-set setup → twist → sortie" — v3 prescrit "1 trait drôle sur 4-5 phrases" et "sobriété > saturation".
3. **Valeur éducative** : s7 dit "le compte sert la marque par accumulation de bonnes vannes, pas par showcase pédagogique" — v3 dit "la valeur éducative est au premier plan". Conflit de doctrine sur la mission du compte.

**Verdict global : PARTIELLEMENT ALIGNED**

Les 9 posts canoniques s7 ne sont pas tous à rejeter — 5 tiennent avec la voix v3, 4 nécessitent une révision de ton ou de structure. Aucun n'est en conflit irrémédiable.

**Coût estimé du patch** : édition du prompt système uniquement (3-4 blocs à modifier) + reformulation de 4 posts canoniques sur 9. Un cycle @copywriter (~45 min). Pas de refonte structurelle ni de modification des gates programmatiques existants. 1 nouveau gate G-S21 recommandé (anti-staccato).

---

## 2. Tableau d'écarts ligne par ligne

| Aspect | Voix s7 daily-social | Voix unifiée v3 | Conflit ? | Patch requis |
|---|---|---|---|---|
| **Style de phrase** | "Phrases courtes. Rythme parlé. Ruptures de ton." + "phrases incomplètes. Genre ça." | Phrases construites et fluides, transitions logiques. Staccato = anti-pattern banni explicitement | **OUI — conflit direct** | Supprimer les exemples staccato dans "CE QUI FAIT HUMAIN". Remplacer par : "Idées liées par une logique explicite — deux phrases reliées si elles forment une même unité de sens." |
| **Densité humour** | "chaque post doit contenir au moins UN trait d'humour" + "Chaque post = micro-set setup → twist → sortie" | "1 trait drôle bien placé sur 4-5 phrases. Quand tout est punchline, plus rien ne l'est." | **OUI — en tension** | Remplacer "au moins UN trait d'humour" par "1 trait drôle bien placé — pas de setup-twist-sortie mécanique à chaque post". Supprimer la métaphore "micro-set de 30 secondes". |
| **Voix narrative** | Compte = marque, anti-1ère-personne (G-S19). 5 formats de voix valides. | Compte = marque. Anti-1ère-personne sauf observation sur le lecteur. | **NON — aligné** | — |
| **Valeur éducative** | "Le compte sert la marque par accumulation de bonnes vannes — pas par showcase pédagogique." | "La valeur éducative est au premier plan — une insight concrète sur l'humour, pas un pitch." | **OUI — conflit de doctrine** | Ajouter dans le brief : "Un post peut délivrer une observation sur la technique d'humour — c'est de la valeur, pas du showcase. Twitter Exemple 2 (vanne à recracher) et LinkedIn Exemple 3 (humour à temps) sont les modèles." |
| **Invitation ressource** | CTA = rare, invisible, "dernier plan d'un pote" — 1 post sur 5 max avec lien | "Pattern invitation ressource : proposée sans pression. On peut te partager si tu veux." Jamais "50+ techniques → deviens-marrant.fr" | **OUI — ton CTA diverge** | Remplacer les exemples de "bon CTA" s7 ("50+ techniques comme celle-ci → deviens-marrant.fr", "On a compilé 50 techniques. Devine où.") par des formulations douces du type v3. |
| **Nom de marque dans CTA** | "deviens-marrant.fr" (URL nue) | "Deviens Marrant" (nom complet, signature constante) | **OUI — mineur** | Uniformiser CTA en "Deviens Marrant" ou lien seul — pas l'URL avec ".fr" en corps de post. |
| **Vocabulaire prescrit/banni** | Liste de vocabulaire coach bannie (G-S17) — alignée | Liste précise dans v3 (vanne vs blague, progresser vs apprendre, etc.) | **NON — compatible** | Intégrer le vocabulaire prescrit v3 dans la section VOIX DE MARQUE du brief. |
| **Trying too hard** | Aucune règle explicite contre la saturation de chutes | Anti-pattern 5 explicite : "deux punchlines dans 4 lignes annulent la première" | **OUI — gap** | Ajouter gate G-S21 ou intégrer comme règle dans TEST FINAL : "max 1 punchline par post — la 2e annule la 1ère." |
| **Ton "DM à un pote"** | "Comme un DM à un pote" — prescrit dans le brief | Non utilisé — v3 dit "quelqu'un qui sait ce qu'il dit et n'a pas besoin de convaincre" | **EN TENSION — mineur** | Remplacer "Comme un DM à un pote" par "comme un observateur qui a quelque chose à dire, pas quelque chose à prouver". |
| **Humoristes cités** | "Si tu cites un humoriste, donne sa vanne réelle ou geste concret (G-S18)" | Citer pour illustrer une technique, jamais pour faire malin. "Utilité > signal social." | **NON — aligné** | — |

---

## 3. Audit des 9 posts canoniques s7

### Twitter Exemple 1 — Yanis, coloc, étiquettes frigo
> "Quand ta coloc met une étiquette sur tout dans le frigo. / Sur le bouton de la lumière. / Comme si t'allais perdre le mode d'emploi."

**Verdict : OK voix unifiée v3**
Structure fluide (3 phrases liées logiquement, pas de staccato sec), observation juste, 1 seule chute, voix observateur. Tient parfaitement.

---

### Twitter Exemple 2 — Sophie, vanne réunion "Excel l'a abandonné"
> "Une vanne à recracher en réunion demain : / 'Ce graphique, même Excel l'a abandonné.' / De rien."

**Verdict : OK voix unifiée v3**
Valeur outil directe, vanne citée avec guillemets, invite sans pression ("De rien" — pas "50+ vannes sur le site"). C'est précisément le modèle "invitation ressource" que v3 prescrit.

---

### Twitter Exemple 3 — Marc, dating après couple long
> "Personne te le dit, mais après 8 ans de couple, t'as oublié comment les gens parlent. / Tu demandes 'tu aimes quoi dans la vie'. / Ça dit 'voyager'. Tu hoches la tête comme si t'avais compris."

**Verdict : OK voix unifiée v3**
C'est la **Phrase-pivot 2** de v3 — validée par Thomas. Observation construite, 1 punchline finale, fluidité logique entre les 3 phrases. Référence absolue à conserver.

---

### LinkedIn Exemple 1 — Sophie, "petit point rapide ?" 17h57
> "Ce moment où ton chef envoie 'petit point rapide ?' à 17h57. / Tu sais déjà que t'as raté ton train. / Et que le point va durer 35 minutes pour te dire qu'on en reparlera lundi."

**Verdict : OK voix unifiée v3**
C'est la **Phrase-pivot 1** de v3 — validée par Thomas. Observation en 3 temps, fluide, pas de leçon. Post de référence.

---

### LinkedIn Exemple 2 — Marc, ex + Netflix
> "L'ex qui appelle pour te dire qu'elle a gardé ton abonnement Netflix. / Tu dis 'pas de souci'. / Puis tu changes le mot de passe et tu regardes la nouvelle saison de Casa de Papel pour rien, par principe."

**Verdict : NEEDS REVISION — mineur**
Structure fluide et voix valide. Problème : "Casa de Papel" est une référence datée (2017-2021). V3 prescrit des références modernes calibrées. Patch : remplacer par une série actuelle ou rendre la référence générique ("tu regardes la nouvelle saison de la première chose qui tombe pour rien, par principe"). Pas de problème structurel.

---

### LinkedIn Exemple 3 — Manager, "je comprends rien à ton slide"
> "Tu sais que ton équipe est saine quand quelqu'un peut dire 'je comprends rien à ton slide' sans que ce soit un drame. / C'est pas du leadership, c'est juste de l'humour à temps. / Genre la phrase qui sauve 40 minutes de réunion gênée."

**Verdict : OK voix unifiée v3**
Observation avec valeur éducative implicite (l'humour comme outil en réunion), déconstruction du mot "leadership" en le citant pour le vider — c'est précisément le registre v3. Tient.

---

### Instagram Exemple 1 — Yanis, "En soirée, t'es le plat froid"
> Visuel : "En soirée, t'es le plat froid." | Caption : "Ça réchauffe, mais faut attendre."

**Verdict : OK voix unifiée v3**
Image fait rire seule. Caption = clin d'œil, pas explication. Voix observateur ("t'es", chambre le lecteur). Format Instagram respecté.

---

### Instagram Exemple 2 — Sophie, "Lundi 9h. Buffering éternel."
> Visuel : "Lundi 9h. Buffering éternel." | Caption : "On charge à 12%. Faut un café et 3 vannes."

**Verdict : NEEDS REVISION — léger**
Le visuel "Lundi 9h. Buffering éternel." est staccato — deux fragments sans lien logique apparent. V3 bannit ce registre. Patch : "Lundi 9h : chargement en cours." (lien logique explicite) ou "Lundi 9h, encore en mode buffering." La caption mentionne "3 vannes" — c'est une micro-invitation ressource acceptable. Tient sur la voix, à affiner sur le style visuel.

---

### Instagram Exemple 3 — Marc, "Les apéros à 34 ans : sport extrême"
> Visuel : "Les apéros à 34 ans : sport extrême." | Caption : "Dimanche : tu survis. Lundi : tu négocies avec ton foie."

**Verdict : NEEDS REVISION — modéré**
La caption est un staccato sec ("Dimanche : tu survis. Lundi : tu négocies") — deux fragments parallèles qui simulent l'énergie sans fond. V3 bannit ce pattern. La punchline visuelle tient (observation juste). Patch caption : "Le lendemain, t'es en mode négociation avec ton foie. Faut ce qu'il faut." — même humour, structure plus fluide.

---

## 4. Patches proposés au brief système `social-media-agent.ts`

**Bloc à modifier : ═══ TON — STAND-UP SOCIAL ═══ (2 occurrences identiques dans le brief)**

Avant :
```
- Tu écris comme tu PARLES. Phrases courtes. Rythme parlé. Ruptures de ton.
- Comme un DM à un pote — pas un post planifié par un CM
```

Après :
```
- Tu écris comme tu PARLES — mais de façon construite. Les idées s'enchaînent par une logique explicite.
  Deux phrases peuvent se lier si elles forment une même unité de sens. Pas de staccato sec qui simule l'énergie.
- Tu parles AU lecteur de SA vie, pas de la tienne. Observateur, pas confident.
```

**Bloc à modifier : ═══ RÈGLES NON NÉGOCIABLES ═══ — règle 8**

Avant :
```
8. Chaque post DOIT contenir au moins UN trait d'humour (vanne, observation drôle, auto-dérision)
```

Après :
```
8. 1 trait drôle bien placé — pas de setup-twist-sortie mécanique. La 2e punchline annule la 1ère.
```

**Bloc à modifier : ═══ CTA — RARE ET INVISIBLE ═══ — exemples "bon CTA"**

Avant :
```
- "50+ techniques comme celle-ci → deviens-marrant.fr"
- "Le reste est sur deviens-marrant.fr (ouais on fait notre pub)"
- "On a compilé 50 techniques du genre. Devine où."
```

Après :
```
- "On a décrypté ça en détail sur Deviens Marrant, si tu veux creuser."
- Simplement le lien seul. Sec. Sans phrase d'intro.
- "La technique complète est sur Deviens Marrant."
```

**Bloc à ajouter : dans ═══ TEST FINAL AVANT CHAQUE POST ═══**

Ajouter check 6 :
```
6. "Est-ce qu'il y a plus d'une punchline dans le post ?" → Si oui, supprimer la moins forte.
```

---

## 5. Patches proposés à `standup-director-agent.ts`

La fonction `validateSocialPost()` / `runSocialGates()` est alignée sur les gates G-S1 à G-S20. Deux ajouts recommandés :

**G-S21 — Anti-staccato** : rejeter tout post où 3 phrases ou plus sont des fragments inférieurs à 4 mots sans connecteur logique. Implémentation : détecter les séquences de fragments courts séparés par retours à la ligne ou ponctuation finale sèche.

**Critère additionnel dans le scoring Director** : pénaliser (-1 point) si le post contient 2 punchlines structurées dans ≤ 6 lignes. Ce n'est pas un gate hard — c'est un signal de saturation qui fait baisser le score sous 9 et déclenche NEEDS_REVISION.

Pas de refonte des gates existants nécessaire. G-S14 à G-S20 sont compatibles avec v3.

---

## 6. Recommandation finale

**GO patches simples — 1 cycle @copywriter, ~45 min.**

Les 9 posts canoniques s7 sont majoritairement compatibles avec la voix v3 (5 OK, 3 NEEDS REVISION mineurs, 0 REJECT). Ils ont été écrits avec les mêmes instincts — la divergence est de registre (staccato vs fluide) plus que de doctrine.

Les 4 modifications de prompt et le 1 nouveau gate G-S21 suffisent à aligner les deux pipelines sans refonte.

**Séquençage recommandé** : patches en parallèle de la Phase 3 CEO (pas après). Les deux touchent le même brief de voix — les produire ensemble garantit la cohérence et évite un 3e cycle d'alignement.

**[HYPOTHÈSE] Signal inverse à remonter à Thomas** : les 3 posts canoniques s7 validés 20/20 (TW#3, LI#1, LI#3) sont précisément ceux que v3 a intégrés comme Phrases-pivot. Ce n'est pas un hasard — la voix s7 à son meilleur *est déjà* la voix v3. Le conflit n'est pas de nature mais de consistance : certaines instructions s7 (staccato, micro-set, CTA agressif) produisent des posts inférieurs aux canoniques. Le patch corrige la formulation du brief pour que l'agent atteigne systématiquement le niveau de ses propres exemples.

---

## Handoff

**Handoff → @copywriter**
- Fichiers produits : `docs/strategy/social-voice-alignment.md`
- Mission : appliquer les 4 patches de prompt (section 4) dans `apps/web/src/lib/ai/agents/social-media-agent.ts` + reformuler les 3 posts canoniques NEEDS REVISION (LI#2 référence datée, IG#2 visuel staccato, IG#3 caption staccato)
- Points d'attention : ne pas toucher les 5 posts OK. Ne pas réécrire la structure des gates G-S1 à G-S20 — c'est le job de @ia (G-S21 uniquement).

**Handoff → @ia**
- Si G-S21 est priorisé : ajouter détection anti-staccato dans `runSocialGates()` de `standup-director-agent.ts`. Critère : 3+ fragments < 4 mots en séquence = flag. Score Director : pénalité -1 si 2 punchlines dans ≤ 6 lignes.

**Handoff → @orchestrator**
- Verdict : patches simples, en parallèle de Phase 3 CEO. Coût : 1 cycle @copywriter + 1 micro-tâche @ia pour G-S21.
- Aucune escalade Thomas requise. La voix v3 ne remet pas en cause la doctrine s7 — elle en complète le brief pour en atteindre le niveau des meilleurs exemples.
