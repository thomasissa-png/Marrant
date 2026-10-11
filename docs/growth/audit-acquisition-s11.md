# Audit acquisition — Deviens Marrant — Session 11 (2026-09-29)

> Produit par @growth. Budget acquisition : 0€ (100% organique).
> Objectifs : 1 000€ MRR à 6 mois, 10K followers cumulés à 12 mois.
> Périmètre : social media, backlinks/earned media, email/CEO, referral, partage natif, SEO programmatique.

---

## 1. Verdict global

**ACQUISITION EN STASE.** La stratégie est documentée, le code est prêt, mais rien n'est actif en production.
Cause racine unique : les branches s8/s9/s10 ne sont pas mergées dans master.
Tout l'agent CEO (emails, DMs, pitchs presse, backlinks proactifs) est inactif.
Le social (Buffer) génère du contenu quotidien mais vers 0 abonnés.
Les backlinks restent à 0 — aucune des actions QW1-QW5 documentées n'a été exécutée.

### Tableau par canal

| Canal | Statut prod | Preuve | Trou principal |
|---|---|---|---|
| Social (Twitter/LinkedIn/Instagram) | Actif — contenu publié via Buffer | social-editorial-plan.json phase3=active | 0 abonnés confirmés ; P1 LinkedIn JSON ; 0 interaction organique documentée |
| Backlinks | Inactif — 0 backlink externe | docs/seo/bing-audit-s10.md : "0 backlink externe" | QW1-QW5 documentés mais non exécutés par Thomas |
| Email / CEO nurture | Inactif — code non déployé | project-context.md L189 : "rien n'est actif en prod sans merge" | Sessions 8/9/10 non mergées, ~12 secrets Replit manquants |
| Backlinks proactifs (HARO/presse) | Inactif | ceo-agent-scope.md : haro-agent.ts existe mais SourceBottle non activé | Inscription SourceBottle non faite ; pipeline CEO non déployé |
| Referral (programme recommandation) | Absent | Aucun fichier docs/growth/ sur referral ; aucun modèle Prisma referral | Zéro mécanique referral planifiée, zéro partage natif de vannes |
| Partage natif / UGC vannes | Absent | Aucune spec de sharing button sur /vannes ni /contenu-du-jour | Contenu riche (265 vannes) mais non partageable hors plateforme |
| SEO programmatique | Partiellement actif | 21 articles blog en prod ; sitemap dynamique ; schemas JSON-LD | 0 backlink = autorité nulle ; indexation Bing bloquée (BWT non configuré) |
| Earned media (communiqués, data stories) | Absent | Pas de fichier docs/growth/earned-media-plan.md | Aucun communiqué envoyé, aucun directory soumis (Product Hunt, Uneed, BetaList…) |
| Capture email / newsletter | Partiel — inscriptions FREE actives | modèle User + Stripe + Resend en place | Taille liste inconnue ; séquences CEO inactives (non déployé) |

---

## 2. Tableau des trous P0/P1/P2

| ID | Trou | Preuve | Impact | Fix | Agent responsable |
|---|---|---|---|---|---|
| **T-P0-01** | Sessions 8/9/10 non mergées → tout le CEO inactif | project-context.md L189 | Bloquant total : emails, DMs, pitchs, backlinks CEO = 0 activité | Thomas : merge branch s10 → master + deploy Replit | Thomas (action manuelle) |
| **T-P0-02** | ~12 secrets Replit manquants (dont 5 bloquants) | project-context.md L190 | CEO ne peut pas tourner sans DATABASE_URL, ANTHROPIC_API_KEY, CEO_ADMIN_EMAIL, TWITTER_BEARER_TOKEN, RESEND_API_KEY | Thomas : renseigner les secrets dans Replit dashboard | Thomas (action manuelle) |
| **T-P0-03** | 0 backlink externe — autorité domaine nulle | docs/seo/bing-audit-s10.md | Indexation Google/Bing bloquée ; SEO organique dépend uniquement de la qualité du contenu sans signal de confiance externe | QW1-QW5 backlink-strategy.md non exécutés : plateformes produit, annuaires, Indie Hackers, SourceBottle, Quora FR | Thomas (soumissions one-shot < 1 journée) + @seo (préparation pitch) |
| **T-P0-04** | 0 mécanisme referral / partage natif | Aucun doc referral dans docs/growth/ ; aucun modèle Prisma referral | Acquisition virale = 0 ; contenu riche (265 vannes) non partageable | Concevoir partage natif de vannes (bouton share + URL OG par vanne) + programme referral basique | @product-manager + @fullstack |
| **T-P1-01** | P1 LinkedIn JSON conformité (ouvert 08/04) | project-context.md L206 | Posts LinkedIn potentiellement non publiés ou malformés | Audit format JSON Buffer LinkedIn → correctif code daily-social | @fullstack |
| **T-P1-02** | Bing Webmaster Tools non configuré (msvalidate.01 absent) | docs/seo/bing-audit-s10.md ; project-context.md L213-214 | 0% trafic Bing ; budget crawl minimal | Thomas : récupérer clé BWT → transmettre @fullstack pour layout.tsx | Thomas + @fullstack |
| **T-P1-03** | 0 earned media exécuté (directories SaaS, Product Hunt, data stories) | backlink-strategy.md QW1 non exécuté ; aucun fichier earned-media-plan.md | Manque 6-10 backlinks dofollow DA 40-90 qui pourraient sortir le domaine de la sandbox | Exécuter QW1 : BetaList, Uneed, TAAFT, FuturePedia, Microlaunch, StartupBase (< 3h one-shot) | Thomas (soumission) + @growth (préparation pitches) |
| **T-P1-04** | Taille liste email inconnue — pas de reporting | Umami + back-office en place mais données non remontées dans l'audit | Impossible de mesurer la progression acquisition | Thomas : fournir nb inscrits FREE, nb premium, MRR actuel | Thomas (données Umami + admin) |
| **T-P1-05** | Dépendance canal unique (Google SEO) | 0 backlink + 0 social followers + CEO inactif → seul trafic = Google organique | Fragile : une mise à jour algo Google = perte de tout le trafic | Diversifier : social (actif mais 0 audience) + earned media + CEO email | Séquence complète ci-dessous |
| **T-P2-01** | Aucun programme referral structuré | Aucune mention referral dans ceo-conversion-playbooks.md au-delà de P7 (JokeLike signal) | Manque boucle virale organique — pourtant humour = contenu naturellement partageable | Créer mécanisme simple : "Partage cette vanne à un pote → il reçoit 7 jours premium offerts" | @product-manager + @copywriter |
| **T-P2-02** | Aucune mécanique UGC / partage de vannes hors plateforme | Contenu du jour non shareable nativement | Humour = format naturellement viral (WhatsApp, SMS) non exploité | Bouton "Copier + partager" sur chaque vanne + image OG générée automatiquement | @fullstack + @design |
| **T-P2-03** | HARO/SourceBottle non activé malgré haro-agent.ts en prod | backlink-strategy.md QW2 non exécuté | 1-3 backlinks presse DA 40-80/mois manqués | Inscription SourceBottle (30 min, 0€) + test pipeline haro-agent | Thomas (inscription) |
| **T-P2-04** | Newsjacking et data stories absents | Aucun communiqué presse envoyé depuis le lancement | Backlinks éditoriaux DA 40-80 non générés | Activer pipeline earned media : 1 data story "vannes FR 2026" → @copywriter rédige → distribution EIN/Pressonify | @growth + @copywriter |
| **T-P2-05** | Google Alerts non configurées (surveillance mentions) | backlink-strategy.md pipeline C non activé | Mentions sans lien non détectées → backlinks potentiels manqués | Créer 5 alertes Google Alerts (0€, 10 min) | Thomas (action 10 min) |

---

## 3. Cinq leviers prioritaires

### Levier 1 — Débloquer le CEO (bloquant absolu) — Effort : Thomas, ~2-3h

Tout le funnel d'acquisition email repose sur le CEO. Tant que les branches s8/s9/s10 ne sont pas mergées et les secrets Replit renseignés, la liste email est un silo muet.

Actions séquencées :
1. Thomas : merge `claude/marrant-s10-session-recovery-CtZyw` → master
2. Thomas : deploy sur Replit + renseigner les 5 secrets bloquants
3. Thomas : toggle `/admin/ceo` enabled=true, dryRun=true → valider 3 drafts emails
4. Thomas : passer dryRun=false, activer phasage S1

Impact attendu : séquences email actives → taux d'ouverture cible > 40% (objectif KPI CEO) → conversions free → premium.

### Levier 2 — Backlinks one-shot QW1-QW4 (6-10 liens dofollow DA 40-90) — Effort : Thomas, ~4h total

Sans backlinks, le SEO reste en sandbox. Les QW1-QW4 documentés depuis le 03/04/2026 n'ont pas été exécutés. Ce sont des soumissions de formulaires, pas du code.

Actions séquencées :
1. @growth prépare les pitches (taglines EN+FR, descriptions, catégories) — 1 batch prêt à copier-coller
2. Thomas soumet : BetaList, Uneed, TAAFT, FuturePedia, Microlaunch, StartupBase (QW1 — ~2h30)
3. Thomas poste sur Indie Hackers (QW4 — ~45 min, draft @copywriter)
4. Thomas s'inscrit sur SourceBottle (QW2 — 30 min)

Impact attendu : 6-10 backlinks dofollow DA 40-90 + sortie sandbox Google/Bing en 4-6 semaines.

### Levier 3 — Partage natif des vannes (boucle virale organique) — Effort : @fullstack, ~1 sprint

Les 265 vannes sont le contenu le plus naturellement partageable du site. Sans bouton de partage, l'humour reste confiné à la plateforme. L'humour se partage par WhatsApp, SMS, Twitter — pas en envoyant un lien de profil.

Mécanique minimale :
- Bouton "Copier la vanne" sur chaque carte vanne (1 clic → texte dans le presse-papier + source "via deviens-marrant.fr")
- URL canonique par vanne (/vannes/[id]) avec og:image auto-générée (fond noir + texte)
- Share button Twitter pré-rempli

Impact attendu : chaque utilisateur free actif devient un canal de distribution organique. [HYPOTHÈSE : 5% des utilisateurs actifs partagent 1 vanne/semaine → trafic référent mesurable en 30 jours.]

### Levier 4 — Referral simple (free → invite un pote) — Effort : @product-manager + @fullstack, ~1-2 sprints

Aucun programme referral n'existe. Le modèle freemium est parfait pour un referral "double-sided" à coût marginal nul.

Mécanique proposée :
- Utilisateur FREE invite un ami → l'ami crée un compte FREE → les deux reçoivent +7 jours d'accès premium
- Coût : 0€ (7 jours premium = coût marginal zéro sur une plateforme digitale)
- Tracking : champ `referredBy` sur le modèle `User` (à ajouter) + email CEO "Tu as converti un pote" (motivation sociale)
- Gate d'affichage : visible uniquement aux users ayant streak >= 3 (signal d'engagement)

Impact attendu : chaque utilisateur engagé devient un canal d'acquisition. [HYPOTHÈSE : taux de conversion invite → inscription 20-30% — benchmark referral SaaS freemium.]

### Levier 5 — Earned media : data story "L'Humour FR 2026" — Effort : @growth + @copywriter, ~1 semaine

Aucun communiqué, aucune présence dans les directories, aucun asset link bait. L'actif le plus immédiatement valorisable est l'analyse statistique du catalogue (265 vannes, 66 conseils, 89 vidéos).

Format : page web + PDF téléchargeable "Les 5 patterns des vannes qui marchent en France" avec données du catalogue. Les journalistes citent des études avec des stats originales.

Distribution :
- Communiqué Pressonify (~49€) ou EIN Presswire (~149$) — budget à valider avec Thomas
- Soumission sur Maddyness.com, FrenchWeb.fr, Madmoizelle (angle différent par titre)
- Cross-post technique sur Dev.to (pipeline IA) — angle "how I analyzed 265 jokes with AI"

Impact attendu [HYPOTHÈSE] : 2-5 reprises éditoriales, 2-5 backlinks DA 40-70, 1-3 mentions presse.

---

## 4. Données manquantes (à fournir par Thomas)

| Donnée | Pourquoi critique | Source |
|---|---|---|
| Nombre d'inscrits FREE actuels | Mesurer le funnel de base ; sans ça, impossible de savoir si l'acquisition fonctionne | Back-office /admin ou Prisma |
| Nombre d'abonnés premium et MRR actuel | KPI North Star à 1 000€ MRR à 6 mois — baseline inconnue | Stripe dashboard |
| Followers Twitter/X, LinkedIn, Instagram (chiffres réels) | "0 abonnés à la création" mais date non précisée ; croissance inconnue | Chaque plateforme |
| Trafic organique mensuel (visites uniques) | SEO actif mais volume inconnu — Umami en place | Umami dashboard |
| Taux d'ouverture emails transactionnels (Resend) | Résend en place — les emails de bienvenue sont-ils ouverts ? | Resend dashboard |
| QW1-QW5 exécutés ou non | La stratégie backlinks date du 03/04/2026 — Thomas a-t-il soumis sur les plateformes ? | Confirmation Thomas |
| Agent CEO mergé/déployé ou non | P0 absolu — Replit Secrets en place ? | Thomas |
| BWT configuré ou non | Impacte indexation Bing | Thomas (vérification Bing Webmaster Tools) |

---

## 5. Handoff

---
**Handoff → @orchestrator**

**Fichiers produits :**
- `/home/user/Marrant/docs/growth/audit-acquisition-s11.md`

**Décisions prises (audit, pas recommandations de code) :**
- Canal CEO inactif = bloquant P0 absolu — aucune acquisition email tant que merge non effectué
- 0 backlink externe confirmé (bing-audit-s10.md) + QW1-QW5 non exécutés depuis 6 mois
- Referral absent = trou structurel dans un produit où le partage d'humour est natif
- Partage natif de vannes absent = boucle virale zéro malgré 265 vannes en catalogue
- Earned media : aucun communiqué, aucun directory soumis, aucune data story publiée
- Dépendance canal unique (SEO Google) = risque structurel

**Actions fondateur bloquantes (P0) :**
1. Merge branch s10 → master + deploy Replit (~2h)
2. Renseigner les 5 secrets bloquants Replit (~30 min)
3. QW1 soumissions plateformes produit (BetaList, Uneed, TAAFT, FuturePedia, Microlaunch, StartupBase) (~3h)

**Points d'attention pour la session 11 :**
- Sans le merge CEO, aucun canal d'acquisition actif ne peut progresser
- Le levier le plus rapide après deploy = earned media QW1 (soumissions plateformes, 1 journée, 6-10 backlinks DA 40-90)
- Le levier le plus structurant long terme = partage natif + referral (spec @product-manager requis)
- Données manquantes critiques : MRR actuel, taille liste email, followers réels → Thomas doit fournir ces chiffres pour que le prochain audit mesure la progression

---

## Résumé P0/P1 (15 lignes max)

Le projet est en stase d'acquisition depuis la session 7 (mars 2026). Le code est complet mais non déployé : tout l'agent CEO (emails, DMs, pitchs presse, backlinks) repose sur les branches s8/s9/s10 non mergées dans master — P0 absolu qui bloque tout le funnel email. Deuxième P0 : 0 backlink externe confirmé depuis mai 2026, et les quick wins documentés (QW1-QW5 dans backlink-strategy.md) n'ont jamais été exécutés malgré leur faible effort (< 1 journée de soumissions). Le social publie quotidiennement via Buffer mais vers une audience inconnue (données manquantes). Quatre trous structurels absents de tout plan : (1) referral/programme recommandation inexistant ; (2) partage natif de vannes absent (265 vannes non partageables hors plateforme) ; (3) earned media jamais activé (aucun communiqué, aucun directory, aucune data story) ; (4) dépendance exclusive à Google SEO sans aucun canal de backup actif. La priorité absolue est séquencée : Thomas merge + deploy + 5 secrets Replit (P0-01 + P0-02), puis QW1 soumissions plateformes (P0-03 — 3h, 6-10 backlinks DA 40-90), puis partage natif vannes (@fullstack), puis referral (@product-manager).
