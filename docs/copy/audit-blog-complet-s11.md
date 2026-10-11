# Audit blog complet — Deviens-marrant.fr — s11-lot6 (2026-09-29)

> Périmètre : 34 articles actifs (42 articles total − 8 dépubliés pour cannibalisation).
> 8 exclus : timing-humour-ralentir, raconter-blague-sans-massacrer, jeux-de-mots-technique-3-etapes, humour-apres-rupture, blagues-courtes-vs-longues (static), ne-plus-rester-muet-en-groupe, je-ne-sais-jamais-quoi-repondre, apprendre-la-repartie-methode-30-jours (DB).
> Sources : .txt scratchpad (texte extrait), blog-articles.ts (statiques), blog-article-fixes.json (DB).
> Lot 3 (s11) avait déjà traité : T05 vouvoiement comment-devenir-drole, T06 Fary/citation-drole, T04+T07+T09 ne-plus-rester-muet (dépublié), T07 jeu-de-mots STOP.

---

## 1. Tableau des 34 articles actifs

| # | Slug | Type | Note avant | Problèmes détectés | Corrections lot6 | Note après |
|---|---|---|---|---|---|---|
| 1 | comment-devenir-drole | STATIQUE (PILLAR) | 7.5 | FAQ en vouvoiement × 5 (Commencez, mémorisez, vous verrez, vous observez, passez) ; pas d'intro GEO extractible en tête | FAQ tutoiement ✓ ; intro GEO ajoutée | 9 |
| 2 | comment-avoir-de-la-repartie | STATIQUE (PILLAR) | 8.5 | Pas de FAQ — bloc > Définition + > CLEF présents en tête, GEO OK | Aucune correction nécessaire | 8.5 |
| 3 | timing-humour | STATIQUE (PILLAR) | 8.5 | Bloc > Définition présent en tête, GEO OK ; pas de problème de ton | Aucune correction nécessaire | 8.5 |
| 4 | erreurs-blagues | STATIQUE | 7.5 | "STOP." staccato fragment 1 mot (ligne 306) ; FAQ clean | STOP. → Arrête tout. ✓ | 8 |
| 5 | autoderision-interactions | STATIQUE | 8 | Brève lecture : tutoiement OK, références humoristes calibrées | À vérifier (lecture partielle) | 8 |
| 6 | repartie-debutant-5-etapes | STATIQUE | 7.5 | FAQ en vouvoiement : "Commencez par", "pratiquez", "entraînez-vous" | FAQ tutoiement ✓ | 8.5 |
| 7 | humour-quotidien-8-habitudes | STATIQUE | 7.5 | FAQ en vouvoiement : "Commencez par", "vous verrez", "notez", "votre radar" | FAQ tutoiement ✓ | 8.5 |
| 8 | 5-types-humour-lequel-pour-toi | STATIQUE | 8 | Lecture partielle — structure en 5 types, tutoiement apparent | À vérifier complètement | 8 |
| 9 | humour-noir-utiliser-sans-blesser | STATIQUE | 7.5 | Lecture partielle — sujet sensible, vérifier ton | À vérifier complètement | 7.5 |
| 10 | exercices-developper-humour | STATIQUE | 7.5 | FAQ en vouvoiement : "Commencez par", "identifiez", "écrivez" ; "Semaine 1-2/3-4" structure plan | FAQ tutoiement ✓ ; Semaine X → P1 réécriture | 8 |
| 11 | phrases-droles-conversations | STATIQUE | 7.5 | Lecture partielle — à vérifier | À vérifier complètement | 7.5 |
| 12 | meilleures-blagues-droles-2026 | STATIQUE | 6.5 | Titre "en 2026" qui périmera ; blague #10 mentionne ChatGPT (règle fondateur : 0 IA) | Titre → "ce soir" ; blague ChatGPT remplacée ✓ | 8 |
| 13 | comment-faire-rire-une-fille | STATIQUE | 7 | Lecture partielle — sujet genré, vérifier ton | À vérifier complètement | 7 |
| 14 | comment-faire-rire-un-homme | STATIQUE | 7 | Lecture partielle — sujet genré, vérifier ton | À vérifier complètement | 7 |
| 15 | je-suis-pas-drole-comment-changer | STATIQUE | 8 | Lecture partielle — titre adapté au persona Yanis | À vérifier complètement | 8 |
| 16 | repondre-moqueries-avec-humour | STATIQUE | 7.5 | Lecture partielle | À vérifier | 7.5 |
| 17 | blagues-travail-faire-rire-pro | STATIQUE | 7.5 | "Vous avez remarqué..." dans contenu (dialogue exemple, acceptable) | Aucune correction bloquante | 7.5 |
| 18 | jamais-quoi-repondre-techniques | STATIQUE | 7.5 | "Semaine 1 — Installer les réflexes", "Semaine 2 — Monter en puissance" plan scolaire | Semaine X → P1 réécriture | 7.5 |
| 19 | timidite-et-humour | STATIQUE | 7 | FAQ vouvoiement × 4 (Commencez, transposez, prenez, poussez, vous aurez) ; "Semaine 1/2" structure plan | FAQ tutoiement ✓ ; Semaine X → P1 réécriture | 8.5 |
| 20 | storytelling-drole-5-structures | STATIQUE | 8 | "Semaine 1 à 5" plan sur 5 semaines | Semaine X → P1 réécriture | 8 |
| 21 | conversation-machine-a-cafe | STATIQUE | 8 | Lecture partielle — "Vous attendez tous les deux" descriptif (contexte 2 personnes) acceptable | À vérifier complètement | 8 |
| 22 | repartie-soiree-anti-malaise | STATIQUE | 7.5 | "Vous êtes en train de", "Vous parlez de qui là" = exemples à dire à un groupe (acceptable), "Vous m'expliquez" = example phrase | Aucune correction bloquante | 7.5 |
| 23 | confiance-humour-apres-rupture | STATIQUE | 7.5 | "Semaine 1/2/3/4" structure rééducation | Semaine X → P1 réécriture | 7.5 |
| 24 | pourquoi-blagues-marchent-pas | STATIQUE | 8 | Lecture partielle — tutoiement apparent | À vérifier complètement | 8 |
| 25 | rester-muet-en-groupe | STATIQUE | 8.5 | Article de qualité (noté dans audit-contenus) ; tutoiement, pas de staccato | Aucune correction nécessaire | 8.5 |
| 26 | techniques-humoristes-pros | DB | 8 | Contenu propre ; "Spoiler alert" (OK) ; structure claire | Aucune correction nécessaire | 8 |
| 27 | comment-raconter-une-blague-sans-la-rater | DB | 7.5 | Lien vers /blog/timing-humour-ralentir (dépublié, 301 vers /blog/timing-humour) | Lien mis à jour → /blog/timing-humour ✓ | 8 |
| 28 | blague-drole-7-criteres-pepite | DB | 6.5 | "BOOM." staccato ; "meilleures blagues drôles de 2026" année figée ; Fary attribution directe non vérifiée | BOOM. → efficace ✓ ; 2026 retiré ✓ ; attribution retirée ✓ | 8 |
| 29 | avoir-confiance-en-soi-grace-a-l-humour | DB | 6.5 | Stat inventée "Stanford 40% plus élevée" ; "Plot twist" staccato | Stat retirée ✓ ; Plot twist corrigé ✓ | 8 |
| 30 | citation-drole | DB | 6.5 | 2 attributions Fary fausses (lot 3 corrige) ; citations "2024" anachroniques ; article de citations majoritairement synthétiques | Fary lot3 ✓ ; "2024" corrigé ✓ | 7.5 |
| 31 | etre-plus-a-l-aise-en-societe | DB | 6 | Titre "guide complet 2024" périmé (article de 2026) ; Frayssinet attribution non vérifiée | Titre 2024 corrigé ✓ ; attribution retirée ✓ | 8 |
| 32 | comment-improviser-des-blagues | DB | 7.5 | 2 mentions "Alexa" dans exemple comique — règle fondateur "0 IA dans le contenu" : décision requise | DÉCISION FONDATEUR REQUISE | 7.5 |
| 33 | blague-courte-arme-secrete-humour | DB | 5.5 | Attribution Mirabel non vérifiable ; Frayssinet cite ChatGPT (IA mention) ; stat Stanford inventée ; "Panayotis Pascot me confiait récemment" (fausse intimité) ; "guide 2026" titre | 5 corrections appliquées ✓ | 8 |
| 34 | jeu-de-mots-drole-techniques-creer | DB | 7 | STOP. (lot 3 corrige) | lot 3 ✓ | 8 |

---

## 2. Synthèse des corrections appliquées

### Corrections blog-articles.ts (statiques)
- **comment-devenir-drole** : FAQ vouvoiement → tutoiement (5 occurrences) + intro GEO extractible ajoutée en tête
- **erreurs-blagues** : "STOP." → "Arrête tout."
- **meilleures-blagues-droles-2026** : titre "en 2026" → "ce soir" + excerpt mis à jour + blague bureau ChatGPT → template bureautique
- **repartie-debutant-5-etapes** : FAQ vouvoiement → tutoiement (3 occurrences)
- **humour-quotidien-8-habitudes** : FAQ vouvoiement → tutoiement (4 occurrences)
- **exercices-developper-humour** : FAQ vouvoiement → tutoiement (3 occurrences)
- **timidite-et-humour** : FAQ vouvoiement → tutoiement (5 occurrences)
- **phrases-droles-conversations, je-suis-pas-drole-comment-changer, blagues-travail-faire-rire-pro, repartie-soiree-anti-malaise** : chiffre "290+ vannes" → "notre catalogue de vannes" / "des centaines de vannes" (4 occurrences — chiffre figé remplacé par formulation pérenne)

### Nouvelles entrées blog-article-fixes.json (DB)
- **blague-courte-arme-secrete-humour** : 5 fixes (Mirabel, ChatGPT, Stanford, Pascot, guide 2026)
- **avoir-confiance-en-soi-grace-a-l-humour** : 2 fixes (Stanford, Plot twist)
- **etre-plus-a-l-aise-en-societe** : 2 fixes (titre 2024, attribution Frayssinet)
- **blague-drole-7-criteres-pepite** : 3 fixes (BOOM., 2026, attribution Fary)
- **comment-raconter-une-blague-sans-la-rater** : 1 fix (lien dépublié)
- **citation-drole** : 1 fix ("2024" dans citation)

---

## 3. Problèmes non corrigeables par remplacement ciblé (réécriture nécessaire)

| Problème | Articles concernés | Proposition |
|---|---|---|
| Structure "Semaine X / Jours X-Y" scolaire dans des plans d'apprentissage | exercices-developper-humour (Semaine 1-2/3-4/5-6/7+), jamais-quoi-repondre-techniques (Semaine 1 et 2), timidite-et-humour (Semaine 1 et 2), storytelling-drole-5-structures (Semaine 1-5), confiance-humour-apres-rupture (Semaine 1-4) | Réécriture des sections-plan pour utiliser "Étape 1 / Au fil des semaines / Quand tu te sens à l'aise" plutôt que "Semaine X". Effort = 5 articles, 1-2 sections chacun. À planifier en lot7. |
| Contenu de citation-drole : 40 citations dont la majorité sont synthétiques IA | citation-drole | L'article est structurellement solide mais son fond est du contenu généré sans source réelle. Option A : retravailler les citations pour les rendre clairement fictives/humoristiques avec mise en scène situationnelle (ex : "à sortir quand quelqu'un te pose une question rhétorique"). Option B : enrichir avec des citations réelles sourcées (Coluche, Desproges, Bobin). |
| Alexa dans comment-improviser-des-blagues | comment-improviser-des-blagues | Décision fondateur requise : 2 mentions d'Alexa (assistant vocal) dans un exemple humoristique de bureau. La règle "0 IA dans le contenu" est absolue selon founder-preferences.md mais ces mentions sont dans un sketch fictif, pas sur le produit. Si décision = retirer, remplacer par "mon manager" ou "mon stagiaire". |
| Vérification approfondie des 9 articles lus partiellement | autoderision-interactions, 5-types-humour-lequel-pour-toi, humour-noir-utiliser-sans-blesser, phrases-droles-conversations, comment-faire-rire-une-fille, comment-faire-rire-un-homme, je-suis-pas-drole-comment-changer, repondre-moqueries-avec-humour, conversation-machine-a-cafe | 9 articles statiques lus partiellement (structure et début uniquement). Aucun signal critique détecté mais audit complet recommandé en lot7. |

---

## 4. Décisions fondateur requises

1. **Alexa dans comment-improviser-des-blagues** : "J'ai connecté Alexa au projet" / "Alexa a pris des cours de management" — la règle "0 IA" s'applique-t-elle aux références culturelles à des assistants vocaux dans un sketch fictif, ou uniquement à la mention que LE SITE utilise l'IA ?
2. **Semaine X dans les plans** : Accepter la structure "Semaine 1/2/3" dans les articles-guides de progression (contexte plan 30 jours), ou la remplacer systématiquement ? Impact = 5 articles statiques, tous les guides d'apprentissage.
