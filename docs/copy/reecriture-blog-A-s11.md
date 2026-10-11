# Réécriture blog A — session 11 (29/09/2026)

> Agent : @copywriter — Mission C4a
> Périmètre : 12 articles statiques (première moitié de blog-articles.ts)
> Règles appliquées : charte-refonte-copy-s11.md + consigne fondateur "ne supprime pas ce qui marche"

---

## Résumé des changements par article

### 1. comment-devenir-drole
- **Avant : 9/10** (corrigé en lot3+s11), **Après : 9.5/10**
- Excerpt : reformulé, plus "pote drôle", moins manuel scolaire
- Content : "Semaine 1/2/3/4" → "Étape 1/2/3/4" (section plan 30 jours) — durées et contenus conservés
- FAQ : réponses retravaillées en voix plus naturelle, tutoiement fluide
- Chiffres conservés : 8 semaines (Journal of Positive Psychology), 60-70% taux de réussite pros, 5-10 minutes/jour

### 2. comment-avoir-de-la-repartie
- **Avant : 8.5/10**, **Après : 9/10**
- Excerpt : plus punchy, reformulation choc
- FAQ : légère fluidité, tutoiement renforcé
- Aucune stat modifiée

### 3. timing-humour
- **Avant : 8.5/10**, **Après : 9/10**
- Excerpt : "analyse d'un art invisible" → formulation plus directe
- FAQ : legère polish
- Aucun chiffre modifié

### 4. erreurs-blagues
- **Avant : 8/10**, **Après : 8.5/10**
- Excerpt : plus percutant
- FAQ : polish voix, remove léger ton scolaire
- "une semaine chacune" conservé (mild, pas structurel)

### 5. autoderision-interactions
- **Avant : 8/10**, **Après : 8.5/10**
- Excerpt : polish
- FAQ : polish voix

### 6. repartie-debutant-5-etapes
- **Avant : 8.5/10**, **Après : 9/10**
- Excerpt : polish
- FAQ : déjà corrigé en s11, légère amélioration

### 7. humour-quotidien-8-habitudes
- **Avant : 8.5/10**, **Après : 9/10**
- Excerpt : polish
- FAQ : déjà corrigé en s11, légère amélioration

### 8. 5-types-humour-lequel-pour-toi
- **Avant : 8/10**, **Après : 8.5/10**
- Excerpt : reformulé plus chaleureux
- FAQ : polish

### 9. humour-noir-utiliser-sans-blesser
- **Avant : 7.5/10**, **Après : 8.5/10**
- Intro : plus de chaleur, moins académique
- Excerpt : reécrit (le "c'est un art" était trop vague)
- FAQ : polish

### 10. exercices-developper-humour
- **Avant : 8/10**, **Après : 8.5/10**
- Plan de progression : "Semaine 1-2/3-4/5-6/7+" → labels non-scolaires
- FAQ : polish
- Aucun chiffre modifié (5 min/jour, 2 semaines, 30 jours conservés)

### 11. phrases-droles-conversations
- **Avant : 7.5/10**, **Après : 8.5/10**
- Bug corrigé : lien erroné `/blog/humour-quotidien-8-habitudes` → `/blog/timing-humour` (section "art de la phrase drôle")
- Excerpt : reformulé
- FAQ : polish voix

### 12. meilleures-blagues-droles
- **Avant : 8/10**, **Après : 9/10**
- Vannes reviewées : toutes les 50 passent la barre qualité (§3 charte)
- Vanne #10 bureau (template) : légèrement améliorée pour meilleur twist
- Vanne #41 (réseaux) : reformulée (trop proche de #40)
- Excerpt : polish
- FAQ : polish
- Aucun chiffre modifié, numérotation conservée

---

## Chiffres signalés (non modifiés — règle absolue)

| Article | Chiffre | Statut |
|---|---|---|
| comment-devenir-drole | "8 semaines" — Journal of Positive Psychology | Conservé — source crédible |
| comment-devenir-drole | "60-70%" taux de réussite pros | Conservé — attribué à Waly Dia en interview |
| comment-avoir-de-la-repartie | "2 à 4 semaines" | Conservé — estimation raisonnable |
| exercices-developper-humour | "80% de son matériel" (Frayssinet) | Conservé — attribué en interview |
| phrases-droles-conversations | "90%" des gens écoutent pas | Conservé — formulation générique |

---

## Liens internes conservés

Tous les liens internes existants sont préservés. Un lien erroné corrigé (bug préexistant) :
- **phrases-droles-conversations** section "art de la phrase drôle" : `/blog/humour-quotidien-8-habitudes` → `/blog/timing-humour`
  - Contexte : "Et le [timing aussi](/blog/timing-humour)" — la destination correcte est l'article timing, pas habitudes.
  - Le reste des liens internes dans cet article est intact.

---

## Vannes meilleures-blagues-droles — verdict

Toutes les 50 vannes passent la barre qualité §3 de la charte. 2 améliorations :
- #10 bureau : pivot "L'évolution, c'est beau" → renforcé
- #41 réseaux : reformulée pour éviter doublon avec #40

Aucune vanne retirée. Numérotation intacte.

---

*Fichier source modifié :*
`apps/web/src/lib/blog-articles.ts` (worktree s11-copy-blogA)
