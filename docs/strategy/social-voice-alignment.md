# Audit d'écarts de voix — daily-social (s7) vs voix unifiée v3 (session 8)

> Auteur : @creative-strategy | Date : 2026-05-06
> Source de vérité voix : `docs/strategy/ceo-voice-unified.md` v3
> Source de vérité social : `apps/web/src/lib/ai/agents/social-media-agent.ts` (brief s7)
> Référence historique : `docs/social/social-reform-s7.md`

---

## 1. Synthèse exécutive

La voix s7 et la voix unifiée v3 partagent la même fondation (compte = marque, tutoiement,
anti-persona-leak, anti-corporate) mais divergent sur **3 points structurels** :

1. **Style de phrase** : s7 prescrit staccato ("phrases courtes, rythme parlé, ruptures de ton") —
   v3 interdit explicitement ce registre ("anti-pattern banni — style staccato : Court. Direct.
   Je clique.").
2. **Densité humour** : s7 impose "au moins 1 trait d'humour" et "micro-set setup → twist → sortie"
   — v3 prescrit "1 trait drôle sur 4-5 phrases" et "sobriété > saturation".
3. **Valeur éducative** : s7 dit "le compte sert la marque par accumulation de bonnes vannes, pas
   par showcase pédagogique" — v3 dit "la valeur éducative est au premier plan". Conflit de
   doctrine sur la mission du compte.

**Verdict global : PARTIELLEMENT ALIGNED**

Les 9 posts canoniques s7 ne sont pas tous à rejeter — 5 tiennent avec la voix v3, 4 nécessitent
une révision de ton ou de structure. Aucun n'est en conflit irrémédiable.

**Coût estimé du patch** : édition du prompt système uniquement (3-4 blocs à modifier) +
reformulation de 4 posts canoniques sur 9. Un cycle @copywriter (~45 min). Pas de refonte
structurelle ni de modification des gates programmatiques existants. 1 nouveau gate G-S21
recommandé (anti-staccato).

---

## 2. Tableau d'écarts ligne par ligne

| Aspect | Voix s7 daily-social | Voix unifiée v3 | Conflit ? | Patch requis |
|---|---|---|---|---|
| **Style de phrase** | "Phrases courtes. Rythme parlé. Ruptures de ton." + "Des phrases incomplètes. Genre ça." | Phrases construites et fluides, transitions logiques. Staccato = anti-pattern banni explicitement | **OUI — conflit direct** | Supprimer les exemples staccato dans "CE QUI FAIT HUMAIN". Remplacer par : "Idées liées par une logique explicite — deux phrases reliées si elles forment une même unité de sens." |
| **Densité humour** | "Chaque post doit contenir au moins UN trait d'humour" + "chaque post = micro-set setup → twist → sortie" | "1 trait drôle bien placé sur 4-5 phrases. Quand tout est punchline, plus rien ne l'est." | **OUI — en tension** | Remplacer "au moins UN trait d'humour" par "1 trait drôle bien placé — pas de setup-twist-sortie mécanique à chaque post". Supprimer la métaphore "micro-set de 30 secondes". |
| **Voix narrative** | Compte = marque, anti-1ère-personne (G-S19). 5 formats de voix valides. | Compte = marque. Anti-1ère-personne sauf observation sur le lecteur. | **NON — aligné** | — |
| **Valeur éducative** | "Le compte sert la marque par accumulation de bonnes vannes — pas par showcase pédagogique." | "La valeur éducative est au premier plan — une insight concrète sur l'humour, pas un pitch." | **OUI — conflit de doctrine** | Ajouter dans le brief : "Un post peut délivrer une observation sur la technique d'humour — c'est de la valeur, pas du showcase. TW Exemple 2 et LI Exemple 3 sont les modèles." |
| **Invitation ressource** | CTA = rare, invisible, "dernier plan d'un pote" — 1 post sur 5 max avec lien | "Pattern invitation ressource : proposée sans pression. On peut te partager si tu veux." Jamais "50+ techniques → deviens-marrant.fr" | **OUI — ton CTA diverge** | Remplacer les exemples de "bon CTA" s7 ("50+ techniques comme celle-ci → deviens-marrant.fr", "On a compilé 50 techniques. Devine où.") par des formulations douces du type v3. |
| **Nom de marque dans CTA** | "deviens-marrant.fr" (URL nue) — usage libre | "Deviens Marrant" (nom complet, signature constante) | **OUI — mineur** | Uniformiser CTA en "Deviens Marrant" ou lien seul — pas l'URL nue en corps de post. |
| **Vocabulaire prescrit** | Liste de vocabulaire coach bannie (G-S17) — alignée | Tableau prescrit complet (vanne vs blague, progresser vs apprendre, etc.) | **NON — compatible, lacune** | Intégrer le vocabulaire prescrit v3 dans la section VOIX DE MARQUE du brief. |
| **Trying too hard** | Aucune règle explicite contre la saturation de chutes | Anti-pattern 5 explicite : "deux punchlines dans 4 lignes annulent la première" | **OUI — gap** | Ajouter gate G-S21 ou règle dans TEST FINAL : "max 1 punchline par post — la 2e annule la 1ère." |
| **Posture "DM à un pote"** | "Comme un DM à un pote" — prescrit dans le brief | "Quelqu'un qui sait ce qu'il dit et n'a pas besoin de convaincre" — observateur, pas confident | **EN TENSION — mineur** | Remplacer "Comme un DM à un pote" par "comme un observateur qui a quelque chose à dire, pas quelque chose à prouver". |
| **Doctrine troll** | Non couverte dans s7 | Doctrine explicite : chaleur détachée, pas de riposte humoristique | **LACUNE** | Ajouter 4 lignes "doctrine troll" dans la section POSTURE NARRATEUR du brief. |

---

## 3. Audit des 9 posts canoniques s7

### Twitter Exemple 1 — Yanis, coloc, étiquettes frigo
> "Quand ta coloc met une étiquette sur tout dans le frigo. / Sur le bouton de la lumière. / Comme
> si t'allais perdre le mode d'emploi."

**Verdict : OK voix unifiée v3**
Structure fluide (3 phrases liées logiquement), observation juste, 1 seule chute, voix observateur.
Pas de staccato sec. Tient parfaitement.

---

### Twitter Exemple 2 — Sophie, vanne réunion "Excel l'a abandonné"
> "Une vanne à recracher en réunion demain : / 'Ce graphique, même Excel l'a abandonné.' / De rien."

**Verdict : OK voix unifiée v3**
Valeur outil directe, vanne citée avec guillemets, invitation sans pression ("De rien" — pas "50+
vannes sur le site"). "De rien" est une fermeture sobre, pas un staccato sec. Tient.

---

### Twitter Exemple 3 — Marc, dating après couple long
> "Personne te le dit, mais après 8 ans de couple, t'as oublié comment les gens parlent. / Tu
> demandes 'tu aimes quoi dans la vie'. / Ça dit 'voyager'. Tu hoches la tête comme si t'avais
> compris."

**Verdict : OK voix unifiée v3**
C'est la **Phrase-pivot 2** de v3 — validée par Thomas. Observation construite, 1 punchline
finale, fluidité logique entre les 3 phrases. Référence absolue à conserver.

---

### LinkedIn Exemple 1 — Sophie, "petit point rapide ?" 17h57
> "Ce moment où ton chef envoie 'petit point rapide ?' à 17h57. / Tu sais déjà que t'as raté ton
> train. / Et que le point va durer 35 minutes pour te dire qu'on en reparlera lundi."

**Verdict : OK voix unifiée v3**
C'est la **Phrase-pivot 1** de v3 — validée par Thomas. Observation en 3 temps liés, fluide, pas
de leçon. Post de référence absolu.

---

### LinkedIn Exemple 2 — Marc, ex + Netflix
> "L'ex qui appelle pour te dire qu'elle a gardé ton abonnement Netflix. / Tu dis 'pas de souci'.
> / Puis tu changes le mot de passe et tu regardes la nouvelle saison de Casa de Papel pour rien,
> par principe."

**Verdict : NEEDS REVISION — mineur**
Structure fluide et voix valide (mise en scène impersonnelle). Problème unique : "Casa de Papel"
est une référence datée (2017-2021). V3 prescrit des références modernes. Patch : rendre générique
("tu regardes la première chose qui tombe pour rien, par principe") ou remplacer par une série
actuelle. Pas de problème structurel.

---

### LinkedIn Exemple 3 — Manager, "je comprends rien à ton slide"
> "Tu sais que ton équipe est saine quand quelqu'un peut dire 'je comprends rien à ton slide' sans
> que ce soit un drame. / C'est pas du leadership, c'est juste de l'humour à temps. / Genre la
> phrase qui sauve 40 minutes de réunion gênée."

**Verdict : OK voix unifiée v3**
Observation avec valeur éducative implicite (l'humour comme outil en réunion), déconstruction
du mot "leadership" en le citant pour le vider — c'est précisément le registre v3. Tient.

---

### Instagram Exemple 1 — Yanis, "En soirée, t'es le plat froid"
> Visuel : "En soirée, t'es le plat froid." | Caption : "Ça réchauffe, mais faut attendre."

**Verdict : OK voix unifiée v3**
Image fait rire seule. Caption = clin d'œil, pas explication. Voix observateur ("t'es", chambre
le lecteur). Format Instagram respecté.

---

### Instagram Exemple 2 — Sophie, réunion 17h59
> Visuel : "Réunion à 17h59. Nouveau sport olympique." | Caption : "Médaille d'or : faire semblant
> d'avoir noté."

**Verdict : NEEDS REVISION — léger**
Le visuel "Réunion à 17h59. Nouveau sport olympique." est staccato sec — deux fragments sans
connecteur logique. V3 bannit ce registre. Patch visuel : "Réunion à 17h59 : nouveau sport
olympique." (deux-points = lien logique). Caption reste valide.

---

### Instagram Exemple 3 — Marc, apéros à 34 ans
> Visuel : "Les apéros à 34 ans : sport extrême." | Caption : "Dimanche : tu survis. Lundi :
> tu négocies avec ton foie."

**Verdict : NEEDS REVISION — modéré**
La punchline visuelle tient (observation juste, structure avec deux-points). La caption est un
staccato sec — deux fragments parallèles qui simulent l'énergie. Patch caption : "Le lendemain,
t'es en mode négociation avec ton foie. Faut ce qu'il faut." — même humour, structure liée.

---

**Récapitulatif :**

| Post | Verdict | Correction |
|---|---|---|
| TW #1 Yanis coloc | OK | — |
| TW #2 Sophie Excel | OK | — |
| TW #3 Marc dating | OK | — |
| LI #1 Sophie chef | OK | — |
| LI #2 Marc Netflix | NEEDS REVISION (mineur) | Actualiser "Casa de Papel" |
| LI #3 Manager slide | OK | — |
| IG #1 Yanis soirée | OK | — |
| IG #2 Sophie réunion | NEEDS REVISION (léger) | Point → deux-points sur le visuel |
| IG #3 Marc apéros | NEEDS REVISION (modéré) | Caption → 1 phrase liée |

**6/9 OK. 3/9 NEEDS REVISION. 0 REJECT.**

---

## 4. Patches proposés au brief système `social-media-agent.ts`

### Patch 1 — Bloc TON (2 occurrences identiques dans le brief — critique)

Avant :
```
- Tu écris comme tu PARLES. Phrases courtes. Rythme parlé. Ruptures de ton.
- Comme un DM à un pote — pas un post planifié par un CM
```

Après :
```
- Tu écris comme tu PARLES — mais de façon construite. Les idées s'enchaînent par une logique
  explicite. Deux phrases peuvent se lier si elles forment une même unité de sens. Pas de staccato
  sec qui simule l'énergie sans fond.
- Tu parles AU lecteur de SA vie. Observateur, pas confident.
```

### Patch 2 — Règle 8 dans RÈGLES NON NÉGOCIABLES (critique)

Avant :
```
8. Chaque post DOIT contenir au moins UN trait d'humour (vanne, observation drôle, auto-dérision)
```

Après :
```
8. 1 trait drôle bien placé — pas de setup-twist-sortie mécanique à chaque post. La 2e punchline
   dans un même post annule la 1ère.
```

### Patch 3 — Exemples "bon CTA" dans section CTA (critique)

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

### Patch 4 — Ajout dans TEST FINAL AVANT CHAQUE POST

Ajouter un 6e check :
```
6. "Est-ce qu'il y a plus d'une punchline dans ce post ?" → Si oui, supprimer la moins forte.
```

### Patch 5 — Ajout doctrine troll dans POSTURE NARRATEUR

Ajouter en fin de section :
```
TROLL : deux options valides.
Option 1 — silence. Une posture, pas un manque.
Option 2 — chaleur détachée sans riposte : "C'est noté. Le site est là si tu reviens."
INTERDIT : retourner l'humour contre le troll. Bienveillant > brillant.
```

---

## 5. Patches proposés à `standup-director-agent.ts`

La fonction `runSocialGates()` (G-S1 à G-S20) est compatible avec v3. Deux ajouts recommandés :

**G-S21 — Anti-staccato** : rejeter tout post contenant 3 fragments ou plus de moins de 4 mots
sans connecteur logique (virgule, tiret, deux-points) séparés par retour à la ligne ou ponctuation
finale. Non-bloquant si isolé — devient gate dur si couplé à un score Director < 8.

**Modification scoring Director existant** : pénaliser -1 point si le post contient 2 punchlines
structurées dans ≤ 6 lignes. Ce n'est pas un gate hard — c'est un signal de saturation qui fait
baisser le score sous 9 et déclenche NEEDS_REVISION.

Gates G-S14 à G-S20 : tous compatibles avec v3. Aucune modification requise.

---

## 6. Recommandation finale

**GO patches simples — 1 cycle @copywriter, ~45 min.**

6/9 posts canoniques s7 sont déjà au niveau voix v3 — dont les 2 Phrases-pivot de Thomas (TW#3 et
LI#1). Les 3 révisions sont mineures (1 référence à actualiser, 2 ponctuations de staccato à
lier). Les 5 patches de prompt sont des remplacements de paragraphes, pas des restructurations.

**Séquençage** : en parallèle de Phase 3 CEO. Les deux pipelines touchent le même territoire de
voix — les produire ensemble garantit la cohérence sans itération supplémentaire.

**[HYPOTHÈSE] Signal à remonter à Thomas** : les 3 posts s7 validés 20/20 qui ont été intégrés
comme Phrases-pivot dans v3 (TW#3, LI#1, et implicitement LI#3) montrent que la voix s7 à son
meilleur *est déjà* la voix v3. Le conflit n'est pas de nature mais de consistance : certaines
instructions s7 (staccato, micro-set, CTA agressif) produisent des posts inférieurs aux canoniques.
Le patch corrige la formulation du brief pour que l'agent atteigne systématiquement le niveau de
ses propres meilleurs exemples. Aucun ajustement de v3 n'est nécessaire dans l'autre sens.

---

## Handoff

**Handoff → @copywriter**
- Fichiers produits : `docs/strategy/social-voice-alignment.md`
- Mission : (1) appliquer les 5 patches de prompt dans `apps/web/src/lib/ai/agents/social-media-agent.ts` (sections TON ×2, RÈGLES #8, CTA, TEST FINAL, POSTURE NARRATEUR) — verbatim avant/après dans section 4 ci-dessus. (2) Reformuler les 3 posts NEEDS REVISION (LI#2 référence datée, IG#2 ponctuation visuelle, IG#3 caption) dans `docs/social/social-reform-s7.md` section 4 et dans les exemples canoniques du brief.
- Points d'attention : ne pas toucher les 6 posts OK. Ne pas réécrire l'architecture des gates G-S1 à G-S20 — c'est le job de @ia.

**Handoff → @ia**
- Mission : ajouter G-S21 anti-staccato dans `runSocialGates()` de `standup-director-agent.ts` + pénalité -1 si 2 punchlines dans ≤ 6 lignes dans le scoring Director social.
- Fichier : `apps/web/src/lib/ai/agents/standup-director-agent.ts`

**Handoff → @orchestrator**
- Verdict : patches simples, en parallèle de Phase 3 CEO. Coût : 1 cycle @copywriter + 1 micro-tâche @ia pour G-S21.
- Aucune escalade Thomas requise avant lancement. Signal [HYPOTHÈSE] section 6 à partager en fin de cycle pour validation.
