# Audit UX/Conversion — deviens-marrant.fr — Session 11 (2026-09-29)

> Périmètre : funnel visiteur SEO → inscription gratuite → premium Stripe.
> Objectif business : 1 000 € MRR. Acquisition 100 % organique.
> Sources : instantanés live (scratchpad/live/*.txt), code src/app/(auth)/, composants marketing.

---

## 1. Verdict et score funnel

**Score global : 41/100**

Le contenu et le positionnement sont solides. Le funnel de conversion est troué à chaque étape.
Le problème structurel majeur : 99 % du trafic arrive froid via le blog, mais aucun mécanisme
ne capture l'attention avant de demander 0,99 €/mois. Le trafic organique file sans laisser de
trace — ni email, ni essai gratuit contextualisé, ni onboarding.

| Étape | Note | Diagnostic |
|---|---|---|
| Article blog → CTA produit | 4/10 | CTA unique "0,99€/mois" sur trafic froid, pas de free tier visible |
| Capture email / lead gen | 0/10 | Néant. Aucun formulaire newsletter, aucun lead magnet |
| Quiz public → conversion | 3/10 | Quiz complet (12 questions) sans capture email ni redirection inscr. |
| Inscription (register) | 6/10 | Page pleine (pas modal), callbackUrl ignoré pour email-signup |
| Onboarding post-inscription | 1/10 | /onboarding existe mais jamais atteint — register → /abonnement direct |
| Page /abonnement | 7/10 | Bon contenu, bonne FAQ. Manque d'urgence réelle et de social proof |
| Paywall catalogue | 5/10 | Limite free non visible en statique. Friction non anticipée |
| Rétention / réactivation | 2/10 | Aucun email de réactivation visible côté front ; streak non "vendu" |

---

## 2. Schéma du funnel actuel avec fuites identifiées

```
[Google Search]
      │
      ▼
[Article blog] ── aucune capture email ──► [FUITE 1 : 95%+ partent sans trace]
      │
      │ CTA en bas d'article : "Commencer à 0,99 €/mois"
      │ (pas de mention free tier, trafic froid)
      │
      ▼
[/quiz-humour]  ── 12 questions, résultat, ZÉRO email gate ──► [FUITE 2]
      │
      │ ou CTA direct
      ▼
[/register]  ── page pleine (pas modal), contexte perdu ──► [FUITE 3 : abandon estimé élevé]
      │
      │ Succès email → router.push("/abonnement")
      │ (callbackUrl=/vannes ignoré pour inscription email)
      │
      ▼
[/abonnement] ── Stripe Checkout → paiement
      │
      │ /onboarding (3 questions) jamais atteint ──────────────► [FUITE 4 : 0 personnalisation]
      │
      ▼
[Dashboard] ── streak/XP, mais zéro email de réactivation visible ──► [FUITE 5 : churn silencieux]
```

---

## 3. Tableau des trous P0/P1/P2

### P0 — Bloquants critiques (impact direct sur MRR)

| ID | Trou | Preuve | Impact | Fix recommandé | Agent |
|---|---|---|---|---|---|
| P0-1 | Aucune capture email sur le blog | Pages blog : aucun formulaire newsletter, aucun lead magnet visible (scratchpad/live/blog_comment-avoir-de-la-repartie.txt entier) | Perte de 95%+ des visiteurs SEO. Sans email, zéro réactivation possible | Ajouter bloc "Reçois 1 technique par semaine" après le §3 de chaque article + pop-up exit-intent sur blog. Resend est déjà câblé | @fullstack + @copywriter |
| P0-2 | CTA blog = prix payant d'emblée, free tier invisible | `blog_comment-avoir-de-la-repartie.txt` ligne 1 fin : "Commencer à 0,99 €/mois" uniquement. Aucune mention "gratuit" ni "Essaie gratuitement" | Trafic SEO froid + CTA payant = friction maximale. Taux de clic estimé très bas | Remplacer par double CTA : "Essaie gratuitement" (primaire) + "0,99€/mois pour tout débloquer" (secondaire). Le free tier existe mais n'est pas vendu sur les articles | @copywriter + @fullstack |
| P0-3 | /quiz-humour sans capture email ni gate inscription | `quiz-humour.txt` : quiz 12 questions, "100% gratuit et accessible sans inscription". Résultat = dead end sans redirection inscr. | Quiz = outil d'acquisition fort (2 min d'engagement) transformé en cul-de-sac | Après résultat quiz : modal "Ton profil est [X] — crée ton compte gratuit pour voir ton parcours personnalisé". Email optionnel avant résultat complet | @fullstack + @copywriter |
| P0-4 | Onboarding /onboarding jamais atteint après inscription | `register/page.tsx` ligne 109 : `router.push("/abonnement")` — jamais `/onboarding`. Page `/onboarding` existe (3 questions, HumorQuiz) mais orpheline | Zéro personnalisation post-inscription. L'utilisateur arrive sur une page de paiement sans avoir eu son aha moment | Modifier register.tsx : après succès, `router.push("/onboarding")`. L'onboarding doit mener à /vannes (ou /abonnement si skip) | @fullstack |
| P0-5 | Chiffres vannes incohérents (265 actives vs "290+" affiché) | project-context.md ligne 82 : "265 vannes actives (289 seedées dont 24 désactivées s10)". vannes.txt et home.txt : "290+ vannes". Ecart = 25 vannes | Promesse > réalité = risque de déception et perte de confiance. Si une vanne faible est désactivée, le compteur public doit aussi baisser | Aligner le compteur dynamique sur les vannes `active=true` seulement, ou re-activer des vannes de qualité après back-fill pédagogique | @fullstack |

### P1 — Frictions importantes (impact sur conversion et rétention)

| ID | Trou | Preuve | Impact | Fix recommandé | Agent |
|---|---|---|---|---|---|
| P1-1 | Inscription = page pleine, pas modal | `register/page.tsx` : `<main className="flex min-h-screen...">` — pleine page. Préférence fondateur : "Modal auth, pas page pleine" (CLAUDE.md) | L'utilisateur perd son contexte (article lu, parcours choisi). Taux d'abandon augmente | Transformer /register et /login en modaux superposés à la page courante. Conserver header/footer visibles | @fullstack + @ux |
| P1-2 | Votes roadmap "0" visibles publiquement | `home.txt` : "Je veux ça ! 0" × 4 fonctionnalités (WhatsApp, parcours, communauté, générateur) | Social proof négatif. Signale une base utilisateurs inactive ou insuffisante | Masquer les compteurs à 0 jusqu'à un seuil (ex : 10 votes). Afficher "Bientôt" sans compteur | @fullstack |
| P1-3 | "Prix de lancement" sans deadline | `home.txt` : "Prix de lancement · Profites-en tant que c'est dispo". `abonnement.txt` : même formule. Aucune date limite ni compteur | Urgence creuse = perte de crédibilité. L'utilisateur repassera "plus tard" (et ne reviendra pas) | Ajouter une date limite réelle ("jusqu'au [date]") ou supprimer la mention. Si prix amené à monter, annoncer la prochaine hausse de prix | @copywriter |
| P1-4 | Témoignages sans attribution | `parcours.txt` : 3 citations sans nom, sans photo, sans contexte ("Avant je restais muette..."). `home.txt` : "Déjà 1 500+ inscrits" sans preuves | Crédibilité limitée. Sans nom + photo, les témoignages ressemblent à du contenu inventé | Ajouter prénom + situation ("Camille, 24 ans, étudiante") ou relier à un post réseau social partagé. Si impossible, remplacer par une stat (ex "4,7/5 sur 200 avis") | @copywriter |
| P1-5 | /abonnement accessible à l'anonyme : conflation de deux états | `abonnement.txt` : CTA "Créer un compte pour commencer" pour anonyme + section Stripe pour inscrit. La page sert deux publics avec des messages différents | Confusion UX pour l'utilisateur inscrit non-premium qui revoit la page | Séparer : page /abonnement = anonyme → inscription gratuite d'abord ; état connecté = "Tu y es presque, active ton accès" bien différencié | @fullstack |
| P1-6 | Google OAuth callbackUrl ignoré en inscription email | `register/page.tsx` ligne 38 : `callbackUrl` défini mais ligne 109 : `router.push("/abonnement")` hard-codé pour inscription email. Google OAuth utilise `callbackUrl` | Un utilisateur venant de /parcours/repartie et cliquant "Commencer" arrive sur /abonnement au lieu d'être renvoyé au parcours | Utiliser `callbackUrl` en priorité, /onboarding en fallback | @fullstack |

### P2 — Améliorations (impact conversion secondaire)

| ID | Trou | Preuve | Impact | Fix recommandé | Agent |
|---|---|---|---|---|---|
| P2-1 | Limite free non expliquée avant inscription | `vannes.txt` : "290+ vannes... Clique pour révéler". Aucun mention "10 gratuites" en statique. Limite découverte après inscription (frustration) | Effet anti-surprise négatif. L'utilisateur se sent trompé si la limite n'est pas annoncée | Ajouter sur /vannes (non connecté) : "Accède à 10 vannes gratuitement, toutes pour 0,99€/mois" | @fullstack + @copywriter |
| P2-2 | Streak et XP absents des CTAs blog | Articles blog ne mentionnent pas la gamification (streak, XP, niveaux) dans les CTAs | Yanis (persona principal) est motivé par la progression gamifiée — c'est une valeur différenciante non vendue | Ajouter dans les CTAs fin d'article : "Suis ta progression avec streaks et XP" | @copywriter |
| P2-3 | FAQ identique × 5 pages (home, abonnement, parcours, vannes, blog) | Texte identique observé dans abonnement.txt, parcours.txt, home.txt, blog_comment-avoir-de-la-repartie.txt | Pas un bug mais opportunité : contextualiser la FAQ par page (FAQ parcours = questions sur les parcours, FAQ vannes = questions sur les catégories) | Créer des FAQ contextuelles par section. Garder le tronc commun mais ajouter 2-3 questions propres à chaque page | @copywriter |
| P2-4 | Quiz public /quiz-humour et quiz onboarding /onboarding = deux expériences non liées | quiz-humour.txt : 12 questions, 5 profils humoristes. onboarding/page.tsx : HumorQuiz "3 questions rapides". Les résultats ne s'alimentent pas | Duplication d'effort, expérience fragmentée | Relier : si l'utilisateur a fait le quiz public, pré-remplir l'onboarding avec son profil. Sinon, proposer le quiz complet dans l'onboarding | @fullstack |
| P2-5 | Aucun email de réactivation J+3/J+7 visible côté front | Sessions 8-10 non mergées master (project-context.md ligne 189). CEO agent en attente d'activation | Churn silencieux : utilisateurs qui ne reviennent pas après J+1 | Une fois CEO activé (backlog s11 item 1) : séquence email J+1 "Ta première vanne du jour", J+3 "Ton streak t'attend", J+7 "Tu es à 3 jours d'atteindre ton premier niveau" | @ia (CEO) |

---

## 4. Données manquantes (à extraire d'Umami/Stripe)

Les taux de conversion réels sont **inconnus**. Les priorités ne peuvent être confirmées sans :

| Donnée | Pourquoi critique | Source |
|---|---|---|
| Taux de rebond par article blog | Quantifier FUITE 1. Si >80%, confirme l'urgence P0-1/P0-2 | Umami — pages vues vs sessions |
| Taux inscription / visiteur unique | Quantifier l'impact de P0-2 et P1-1 | Umami — events "register_started" + "register_success" |
| Taux conversion inscription → premium | Mesurer si /abonnement convertit. Cible saine : >30% à 0,99€ | Umami + Stripe — sessions Checkout créées |
| Drop entre /register et soumission formulaire | Quantifier impact P1-1 (page pleine vs modal) | Umami — funnel /register → /abonnement |
| Taux complétion quiz public | Quiz = acquisition ? Combien finissent les 12 questions ? | Umami — events quiz_start vs quiz_complete |
| Rétention J7 et J30 | Mesurer l'urgence P2-5. Sans donnée, CEO reste une hypothèse | Umami — sessions actives cohort J0 |
| Nombre d'inscrits réels | Valider le "1 500+ membres" affiché | Back-office admin (déjà en place) |

---

## 5. Métriques HEART cibles (post-fix P0)

| Dimension | Métrique | Cible |
|---|---|---|
| Adoption | Taux activation (visite blog → inscription) | ≥ 3% (vs estimation <0,5% actuel) |
| Adoption | Taux conversion inscription → premium | ≥ 30% (trafic chaud 0,99€ = friction faible) |
| Happiness | NPS post-activation (J+7) | ≥ 8/10 |
| Engagement | Streak moyen J+7 | ≥ 3 jours |
| Retention | Rétention J30 | ≥ 40% |
| Task success | Complétion parcours semaine 1 | ≥ 60% |

---

## 6. Résumé P0/P1 (15 lignes max)

Les 5 trous P0 à corriger en priorité :

1. **Capture email zéro sur le blog** (P0-1) : 99 % du trafic arrive et repart sans trace. Ajouter un bloc newsletter inline dans chaque article.
2. **CTA articles = 0,99€ d'emblée** (P0-2) : le trafic SEO est froid. Remplacer par double CTA "Essaie gratuitement / Tout débloquer à 0,99€".
3. **Quiz public = cul-de-sac** (P0-3) : 12 questions d'engagement sans capture email ni redirection inscription. Gate le résultat complet sur email ou compte.
4. **Onboarding orphelin** (P0-4) : après inscription, `router.push("/abonnement")` — l'utilisateur n'a jamais son aha moment avant le paywall. Rediriger vers /onboarding.
5. **Compteur vannes incohérent** (P0-5) : "290+" affiché, 265 actives en base. Aligner sur le réel.

Les 3 trous P1 à corriger en parallèle :

6. **Auth = page pleine** (P1-1) : transformer /register et /login en modaux (préférence fondateur).
7. **Votes roadmap "0"** (P1-2) : masquer les compteurs à zéro — ils signalent une base inactive.
8. **Urgence vide** (P1-3) : "Prix de lancement" sans date = promesse sans engagement. Ajouter deadline réelle.

---

## Handoff

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/ux/audit-global-s11.md`
- Décisions prises : priorisation P0→P1→P2 basée sur impact funnel SEO→conversion. Taux réels manquants — priorisation conservative.
- Points d'attention critiques :
  - P0-4 (onboarding orphelin) = 1 ligne de code, impact maximum, à faire en premier
  - P0-1 (capture email) = nécessite composant + copywriting + Resend config
  - P0-2/P0-3 = copywriter avant fullstack
  - CEO activation (backlog s11) débloquera P2-5 automatiquement
- Agents à invoquer : @fullstack (P0-4, P0-5, P1-1, P1-2, P1-6), @copywriter (P0-2, P0-3 copy, P1-3, P1-4, P2-2, P2-3)
