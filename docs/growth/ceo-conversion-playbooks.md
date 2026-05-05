<!-- Version: 2026-05-05 — @growth — Phase 1 CEO Marrant -->
# CEO Autonome Marrant — Funnel + Scoring + Playbooks de conversion

> Livrable Phase 1 pour le CEO autonome. North Star CEO : 300 abonnés premium convertis à 6 mois = 300€ MRR.
> Toutes les métriques sans données réelles sont marquées [HYPOTHÈSE]. Prix premium : 0,99€/mois.

---

## 1. Funnel free → premium détaillé à 0,99€

| Étape | Action utilisateur | Signal d'engagement | Drop estimé | Opportunité CEO |
|---|---|---|---|---|
| **Signup** | Création compte (email + mdp) | `User.createdAt` | [HYPOTHÈSE : 40% abandonnent le formulaire] | Email welcome J+0 — P1 |
| **Onboarding** | Quiz d'humour + persona détecté | `User.level = NOVICE`, xp = 0 | [HYPOTHÈSE : 30% ne finissent pas le quiz] | Séquence J+3 si quiz incomplet |
| **Engagement J1-J7** | Lecture vanne du jour + 1 like | `JokeLike.createdAt`, `User.streak >= 1` | [HYPOTHÈSE : 50% drop après J1] | Reactivation J+7 si streak = 0 — P2 |
| **Engagement J7-J14** | Atteinte limite free (10 blagues) | `User.xp >= 30`, limite blagues touchée | [HYPOTHÈSE : 60% des actifs atteignent la limite] | Conversion soft J+14 — P3 |
| **Décision premium** | Vue page /abonnement | Navigation vers /abonnement (Umami) | [HYPOTHÈSE : 8% des inscrits voient la page] | Email "prix d'un café" si vu 2x sans convert |
| **Checkout** | Stripe checkout ouvert | `Subscription.status = pending` | [HYPOTHÈSE : 25% abandonnent le checkout] | Pas d'action CEO (friction technique Stripe) |
| **Activation premium** | Premier accès favoris ou parcours complet | `User.plan = PREMIUM`, 1er favori | [HYPOTHÈSE : 95% activent dans 24h] | Email confirmation + tip d'activation J+0 |

**Note friction 0,99€** : la friction psychologique du prix est quasi nulle (< 1 café). La friction réelle est comportementale : sortir sa CB pour un achat habituel = 1min d'effort. Le CEO doit supprimer cette friction par un déclencheur émotionnel (moment de frustration sur la limite, ou moment de fierté sur un progrès), pas par un argument prix.

---

## 2. LTV calc à 0,99€ — 3 scénarios

### Hypothèses de durée d'abonnement [HYPOTHÈSE — à valider avec Thomas sur données réelles M1]

| Scénario | Durée moy. abonnement | LTV brute | Marge Stripe (~3%) | LTV nette |
|---|---|---|---|---|
| **Pessimiste** | 3 mois | 2,97€ | 0,09€ | **2,88€** |
| **Médian** | 6 mois | 5,94€ | 0,18€ | **5,76€** |
| **Optimiste** | 12 mois | 11,88€ | 0,36€ | **11,52€** |

### CAC max acceptable (LTV × marge brute contenu ≈ 85%)

| Scénario | LTV nette | CAC max (ratio 1:1 payback) | CAC max (ratio 3:1 cible growth) |
|---|---|---|---|
| Pessimiste | 2,88€ | 2,88€ | **0,96€** |
| Médian | 5,76€ | 5,76€ | **1,92€** |
| Optimiste | 11,52€ | 11,52€ | **3,84€** |

### Implications pour le CEO

- Avec budget LLM CEO = 1,35€/jour × 30j = **40,50€/mois**, le CEO doit convertir un minimum d'abonnés pour couvrir son propre coût.
- Scénario médian (LTV nette 5,76€) : CAC break-even = 5,76€ → **7 abonnés/mois minimum** pour couvrir les 40,50€ de coût LLM.
- Cible CEO Phase 1 (300 abonnés à 6 mois) : 50 abonnés/mois → CAC = 40,50€ / 50 = **0,81€/abonné** → ROI positif sur les 3 scénarios.
- [HYPOTHÈSE durée : Thomas doit confirmer après M1 si la durée réelle est plus proche de 3 ou 6 mois — cela change le ratio ROI du CEO de x3.]

---

## 3. Scoring de lead — signaux comportementaux

Chaque signal est calculé à partir du schéma Prisma réel (`User`, `JokeLike`, `UserFavorite`, `UserPathProgress`, `Subscription`).

| # | Signal | Source DB | Poids | Persona corrélé | Déclencheur CEO |
|---|---|---|---|---|---|
| S1 | `streak >= 3` (3 jours consécutifs) | `User.streak` | 5 | Yanis (habitude rituelle) | Email P3 si pas premium |
| S2 | `JokeLike.count >= 5` (5+ likes) | `JokeLike` WHERE userId | 4 | Sophie (consommatrice de vannes) | Playbook P7 referral |
| S3 | Limite blagues touchée (10 vues en session) | front signal ou count DailyContent views | 5 | Tous | Email P3 immédiat |
| S4 | Vue /abonnement 2x+ | Umami event `page_view /abonnement` | 5 | Marc (compare avant d'acheter) | Email pitch "prix d'un café" |
| S5 | Quiz complété + score partageable | `User.level >= APPRENTI` | 3 | Yanis | Email P3 avec résultat quiz |
| S6 | `UserPathProgress` row créée (parcours démarré) | `UserPathProgress.userId` | 4 | Marc (cherche structure) | Email focus complétion parcours |
| S7 | `User.xp >= 50` (engagement significatif) | `User.xp` | 3 | Tous | Signal de maturité lead |
| S8 | `UserFavorite.count >= 3` (favoris premium wall) | `UserFavorite` — en réalité les favoris sont premium → signal de frustration | 5 | Sophie | Email "tes 3 favorites t'attendent" |
| S9 | Inactif > 7j (`lastActiveAt` > J-7) | `User.lastActiveAt` | -3 | Tous | Email reactivation P2 |
| S10 | Inactif > 30j | `User.lastActiveAt` > J-30 | -5 | Tous | Winback P4 si ex-premium |
| S11 | DM entrant sur social | `CeoOutboundMessage.direction = inbound` | 4 | Yanis (Twitter) | Réponse P5 dans l'heure |
| S12 | `createdAt < 24h` (nouveau inscrit) | `User.createdAt` | 3 | Tous | Email welcome P1 immédiat |

**Score total /50 = somme des poids des signaux actifs.**

- **Score 0-10** : lead froid — aucune action CEO (laisser faire le funnel automatique)
- **Score 11-20** : lead tiède — séquence email automatique J+7 ou J+14
- **Score 21-35** : lead chaud — email conversion + réponse social < 4h
- **Score 36-50** : lead brûlant — action CEO immédiate (email dans l'heure) + DM si disponible

**Calcul en cron** : `ceo-tick` toutes 2-4h recalcule le score lead pour les FREE actifs des 30 derniers jours. Les leads ≥ 21 entrent dans la file `CeoLead.status = PENDING_ACTION`.

---

## 4. Playbooks de conversion CEO (P1 à P7)

---

### P1 — Welcome free
**Objectif** : Activer l'abonné free en < 24h, planter le hook émotionnel avant le drop J1.

**Trigger** : `User.createdAt` ≤ 1h → score S12 activé.

**Cible** : Tous les nouveaux inscrits free — segment A.

**Canal** : Email via Resend (`alex@deviens-marrant.fr`).

**Séquence** :
1. J+0 (< 2h après signup) : email 3 phrases — vanne de bienvenue + 1 action concrète ("ta vanne du jour t'attend") + lien direct `/vannes`.
2. J+3 si `streak = 0` : rappel soft — "la vanne d'hier était bonne, t'as loupé ça".

**Timing** : Envoi entre 12h-14h ou 19h-22h (FR). Si signup hors créneau → attendre la prochaine fenêtre.

**Critère succès** : `User.streak >= 1` dans les 72h post-signup. [HYPOTHÈSE cible : 35% activation J3.]

---

### P2 — Engagement reactivation
**Objectif** : Ramener un free dropoff avant qu'il soit perdu (fenêtre 7-21 jours).

**Trigger** : `User.lastActiveAt` > J-7 ET `User.plan = FREE` ET `User.createdAt` < J-7.

**Cible** : Free dropoffs — segment B. Persona dominant : Yanis (routine cassée).

**Canal** : Email via Resend. 1 seul email, pas de relance (anti-spam).

**Séquence** :
1. J+7 sans login : email 4 lignes — observation de situation drôle sur le "manque de répartie", lien direct vanne du jour, aucun pitch premium. L'objectif est de faire rire, pas de convertir.

**Timing** : Envoi 19h-22h (créneau soirée — persona étudiant).

**Critère succès** : reconnexion dans les 48h. [HYPOTHÈSE cible : 15% reconversion.]

---

### P3 — Conversion soft (anti-friction pure)
**Objectif** : Déclencher l'abonnement à 0,99€ au moment de friction maximal (limite touchée ou streak fort).

**Trigger** : Score lead ≥ 21 ET `User.plan = FREE` ET (limite blagues touchée OU `streak >= 3` OU vue /abonnement 2x).

**Cible** : Leads chauds — tous personas. Message différencié par persona détecté via `User.level` + historique catégories likées.

**Canal** : Email via Resend. 1 email principal, 1 relance à J+3 max.

**Séquence** :
1. J+0 (trigger) : email 5 lignes — "tu viens de toucher la limite" + 1 vanne de la catégorie préférée de l'utilisateur (extraite du dernier JokeLike) + lien checkout `/abonnement` + phrase anti-friction ("0,99€/mois, soit moins qu'un Kinder"). Pas de bouton CTA énorme — lien texte inline.
2. J+3 si pas converti : dernière relance — "la vanne que t'as likée lundi t'attend encore". Pas de 3e email.

**Timing** : Email P3.1 dans l'heure du trigger (fenêtre de friction chaude). Email P3.2 même créneau 19h-22h.

**Critère succès** : `User.plan = PREMIUM` dans les 72h post-email. [HYPOTHÈSE cible : 8% conversion sur leads chauds.]

---

### P4 — Winback churner premium
**Objectif** : Reconvertir un ex-premium annulé dans la fenêtre de 90 jours (mémoire positive encore fraîche).

**Trigger** : `Subscription.status = cancelled` ET `Subscription.endedAt` entre J-7 et J-90.

**Cible** : Ex-premium churners — segment C. Persona probable : Marc (reconstruction, budget contrôlé).

**Canal** : Email via Resend. Séquence max 2 emails espacés de 14 jours.

**Séquence** :
1. J+7 après annulation : email court — ton complice (pas de plainte), 1 chiffre ("depuis ton départ il y a eu 7 nouvelles vannes qui font mouche"), lien retour direct. Pas de réduction (anti-dévaluation du produit à 0,99€ — déjà le prix le plus bas possible).
2. J+21 si pas de retour : email final — vanne de la catégorie la plus likée par l'utilisateur avant son départ (extraite de `JokeLike`) + 1 question directe ("la répartie te manque ou c'est juste moi ?"). Lien retour. Dernier contact.

**Timing** : Envoi 12h-14h (créneau actif Marc / adulte actif).

**Critère succès** : `Subscription.status = active` dans les 30j post-premier-email. [HYPOTHÈSE cible : 12% reconversion churners < 90j.]

---

### P5 — Inbound social (DMs reçus)
**Objectif** : Convertir les DMs entrants en abonnés — chaque DM reçu est un lead ultra-chaud.

**Trigger** : DM entrant sur Twitter/LinkedIn/Instagram détecté via Buffer API → `CeoOutboundMessage.direction = inbound`.

**Cible** : Tous personas. Différenciation par plateforme + contenu du message.

**Canal** : DM direct via Buffer API. 1 réponse, 1 relance max si pas de réponse 48h.

**Séquence** :
- **Twitter (probable Yanis)** : réponse < 4h, ton pote, 1 vanne courte en rapport avec le message, lien site en fin si question produit — sinon juste vanne + follow up "tu veux qu'on t'envoie la vanne du lundi ?".
- **LinkedIn (probable Sophie)** : réponse < 6h, ton légèrement plus pro mais toujours humour, 1 observation de bureau, pas de pitch direct — mentionner le site si la question produit est explicite.
- **Instagram (probable Yanis / Sophie)** : réponse < 4h, court, émoji autorisé, 1 punchline, CTA léger vers site.

**Timing** : S1 cibles < 4h (humain), S4 auto après 30 drafts validés.

**Critère succès** : Reply rate ≥ 25% sur DMs où une réponse a été envoyée. [HYPOTHÈSE cible : 5% conversion DM → signup dans les 7 jours.]

---

### P6 — Commentaire proactif lambda (douleur exprimée)
**Objectif** : Être présent au moment de la douleur ("je suis nul en vanne") et rediriger vers Marrant — acquisition pure.

**Trigger** : Monitoring keywords API (Twitter/X) : "je suis nul en blague", "répartie zéro", "j'arrive pas à faire rire", "je sais jamais quoi dire en soirée" + variantes. Signal `CeoTask.type = PROACTIVE_COMMENT`. Triage Haiku (score pertinence ≥ 7/10).

**Cible** : Utilisateurs lambda (non-influenceurs, < 5K followers). Blacklist : humoristes / journalistes / influenceurs.

**Canal** : Commentaire public sous le post de l'utilisateur, via Buffer API. Rate limit : ≤ 5 commentaires/jour, délai > 1h après publication du post (anti-stalking).

**Séquence** :
1. 1 commentaire unique — observation drôle sur la douleur exprimée (ne pas répéter le mot-clé robotiquement) + 1 phrase positionnant Marrant comme solution. Jamais de lien direct dans le commentaire si ça ressemble à du spam (préférer "je t'envoie un truc en DM" si ça colle).

**Timing** : Fenêtre optimale post-publication : 1h-4h (post encore dans les feeds). S1 → drafts, S3+ auto après validation.

**Critère succès** : taux de clics profil ou DM reçus en retour / commentaires envoyés. [HYPOTHÈSE cible : 3% des commentaires génèrent un DM entrant ou visite profil.]

---

### P7 — Referral signal "fan" détecté
**Objectif** : Transformer un power user free (5+ likes, 3+ jours streak) en ambassadeur avant même de le convertir en premium.

**Trigger** : Score S1 + S2 actifs simultanément (streak ≥ 3 ET likes ≥ 5) ET `User.plan = FREE`.

**Cible** : Power users free — Yanis (habitude + jeux) et Sophie (catalogue actif). Segment A enrichi.

**Canal** : Email via Resend.

**Séquence** :
1. Email unique — "on t'a pas encore vu en premium mais t'es clairement un habitué" + 1 vanne exclusive non visible en free + phrase referral simple : "si t'en parles à 1 pote, t'as un mois premium offert" (mécanisme referral à implémenter côté @product-manager + @fullstack). Si referral non implémenté en Phase 5 → email de conversion directe P3 avec ton "fan".

**Timing** : Envoi dans les 24h du trigger, créneau 19h-22h.

**Critère succès** : conversion premium OU partage referral documenté. [HYPOTHÈSE cible : 15% conversion directe, 5% referral actif si mécanisme en place.]

---

## 5. Calcul cost-per-acquired-subscriber CEO

### Budget LLM fixe
- Coût CEO = 1,35€/jour × 30j = **40,50€/mois** (budget Haiku triage + Sonnet rédaction + Opus stratégie 1×/sem)

### Tableau break-even par objectif de conversion

| Objectif conversions/mois | CAC CEO (40,50€ / n) | LTV médiane (5,76€) | ROI mois 1 | ROI durée vie |
|---|---|---|---|---|
| 7 abonnés | 5,79€ | 5,76€ | -0,03€ (neutre) | +24€ sur 6 mois |
| 15 abonnés | 2,70€ | 5,76€ | +3,06€ | +46€ sur 6 mois |
| 30 abonnés | 1,35€ | 5,76€ | +4,41€ | +92€ sur 6 mois |
| **50 abonnés** | **0,81€** | **5,76€** | **+4,95€** | **+207€ sur 6 mois** |
| 100 abonnés | 0,41€ | 5,76€ | +5,35€ | +535€ sur 6 mois |

**Conclusion** : seuil de viabilité CEO = **7 abonnés/mois minimum** (scénario médian LTV 6 mois). La cible Phase 1 de 50 abonnés/mois donne un CAC de 0,81€ — ROI fort dès M1. Si le scénario réel est pessimiste (LTV 3 mois = 2,88€), le seuil de viabilité monte à **15 abonnés/mois**.

[HYPOTHÈSE — À recalculer à M1 avec la durée réelle d'abonnement observée dans `Subscription.endedAt - createdAt`.]

---

## 6. Fréquence et timing par segment

### Règles de cadence (non-négociables)

| Segment | Canal | Fréquence max | Fenêtre d'opt-out |
|---|---|---|---|
| A — Free actifs | Email | 2 emails/mois (welcome + conversion) | Opt-out auto dans chaque email (légal RGPD) |
| B — Free dropoffs | Email | 1 email/mois (reactivation) | Idem |
| C — Churners premium | Email | 2 emails sur 21j (winback), puis silence | Idem |
| D — Premium actifs | Email | 1 email/mois max (rétention / upsell futur) | Idem |
| Inbound DM | Social | Réponse unique + 1 relance 48h | Pas de relance si pas de réponse à la relance |
| Commentaires proactifs | Social | ≤ 5/jour global, 1/utilisateur/30j | Aucune relance commentaire |

### Fenêtres horaires optimales (FR)

- **Emails subscribers** : 12h-14h (pause déjeuner, mobile fort) OU 19h-22h (soir, engagement maximal). Éviter 7h-9h (mails pro) et après 22h.
- **DM sociaux Twitter** : 18h-23h (Yanis actif soir).
- **DM LinkedIn** : 8h-10h ou 12h-13h (pause bureau Sophie / Marc).
- **Commentaires proactifs** : dans l'heure du post (S1 : délai > 1h, S3+ : triage immédiat 1h-4h post-publication).
- **Timing semaine** : mardi-jeudi > lundi-vendredi > weekend pour emails pro. Weekend pour social Yanis.

### Règles anti-bruit

- `CeoLead.lastContactAt` : ne pas contacter un lead si < 14 jours depuis dernier email.
- Déduplication par hash(userId + playbook_type) sur 30 jours.
- Si un lead répond négativement → `CeoLead.optOut = true`, suppression de la file pour 90 jours.
- Maximum 3 touchpoints CEO sur la durée de vie free avant conversion (welcome + reactivation + conversion soft).

---

## 7. KPIs satellites + dashboard `/admin/ceo`

### Champs à tracker en DB (`CeoLead`, `CeoOutboundMessage`, `CeoTask`)

| KPI | Source DB | Fréquence calcul | Seuil alerte |
|---|---|---|---|
| Taux de conversion par playbook (%) | `CeoOutboundMessage.playbook` + `User.plan` delta | Quotidien | < 2% sur P3 après 50 envois |
| MRR delta attribué CEO (€) | `Subscription.createdAt` dans les 72h d'un `CeoOutboundMessage.sentAt` | Quotidien | North Star tracking |
| Leads scorés en attente | `CeoLead.status = PENDING_ACTION` count | Temps réel (toutes 2-4h) | > 50 leads en attente → alerte |
| Drafts en file d'attente | `CeoTask.status = DRAFT` count | Temps réel | > 100 drafts → alerte sur cadence |
| Reply rate emails | `CeoOutboundMessage.type = EMAIL`, replied / sent | Hebdomadaire | < 5% → revoir les templates |
| Response rate sociales | `CeoOutboundMessage.type = SOCIAL`, replied / sent | Hebdomadaire | < 10% → revoir les messages |
| Taux erreurs par canal | `CeoTask.status = FAILED` / total | Quotidien | > 5% → alerte infra |
| Budget LLM CEO (€/jour) | `LlmUsageLog.agent = 'ceo'` sum coûts J | Temps réel | > 2€/jour → alerte kill-switch |
| Commentaires proactifs envoyés/jour | `CeoOutboundMessage.type = COMMENT` count | Quotidien | > 5/jour → violation rate limit |
| Score lead distribution | `CeoLead.score` buckets (0-10, 11-20, 21-35, 36-50) | Hebdomadaire | Signal de santé du funnel |

### Vues dashboard `/admin/ceo` prioritaires

1. **Timeline actions (24h)** : liste chronologique des tasks exécutées/en attente avec statut et canal.
2. **File drafts** : tous les `CeoTask.status = DRAFT` avec bouton validation 1-clic et bouton rejet.
3. **Funnel CEO** : free inscrits ce mois → leads scorés → actions envoyées → conversions attribuées.
4. **Budget LLM jour** : barre de progression 0→2€/jour avec alerte rouge > 1,8€.
5. **KPIs semaine** : tableau 7 lignes (MRR delta, conversions, reply rate, reply social, backlinks acquis).

---

## Handoff

**Pour @copywriter Phase 2 — 10 contenus canoniques prioritaires à produire :**

| # | Playbook | Contenu à produire | Canal | Persona cible |
|---|---|---|---|---|
| 1 | P1 — Welcome free | Email J+0 (3 phrases, vanne d'accueil, lien /vannes) | Email | Tous |
| 2 | P1 — Welcome free (J+3) | Email J+3 streak=0 (rappel soft avec vanne) | Email | Yanis |
| 3 | P2 — Reactivation | Email J+7 dropoff (observation drôle, pas de pitch) | Email | Yanis |
| 4 | P3 — Conversion soft | Email conversion (limite touchée, vanne catégorie, lien checkout) | Email | Sophie |
| 5 | P4 — Winback churner | Email J+7 post-annulation (complice, chiffre "7 vannes ratées") | Email | Marc |
| 6 | P5 — Inbound social | Réponse DM Twitter (pote, vanne courte, CTA léger) | DM Twitter | Yanis |
| 7 | P5 — Inbound social | Réponse DM LinkedIn (ton bureau, observation, pas de pitch dur) | DM LinkedIn | Sophie |
| 8 | P5 — Inbound social | Réponse DM Instagram (court, émoji OK, punchline) | DM Instagram | Yanis/Sophie |
| 9 | P6 — Commentaire proactif | Commentaire sous post "manque de répartie" (observation drôle + Marrant) | Commentaire Twitter | Yanis |
| 10 | P7 — Referral fan | Email power user (fan reconnu, vanne exclusive, referral) | Email | Sophie |

Les 5 pitchs backlink (HARO, blogueur humour FR, podcast, mention éditoriale, annuaire) sont dans le périmètre du module backlinks CEO — à produire en Phase 2 côté @seo + @copywriter.

**Pour @data-analyst Phase 3 — KPIs prioritaires à instrumenter dès J1 :**
- Attribution CEO : `CeoOutboundMessage.sentAt` → `Subscription.createdAt` dans fenêtre 72h (window attribution)
- Score lead : calcul cron toutes 2-4h sur `CeoLead` avec signaux S1-S12
- Budget LLM : `LlmUsageLog.agent = 'ceo'` avec alerte > 2€/jour
- Reply rate : `CeoOutboundMessage.repliedAt IS NOT NULL` / total envoyés par type

**Pour @ia + @fullstack Phase 3-5 — Structure DB CeoLead :**
```
CeoLead {
  id, userId, score (Int), signals (Json),
  status (COLD | PENDING_ACTION | IN_SEQUENCE | CONVERTED | OPT_OUT),
  lastContactAt, lastPlaybook, attempts (Int default 0),
  createdAt, updatedAt
}
CeoOutboundMessage {
  id, leadId, type (EMAIL | DM_TWITTER | DM_LINKEDIN | DM_INSTAGRAM | COMMENT),
  playbook, content (Text), status (DRAFT | SENT | DELIVERED | REPLIED | FAILED),
  directorValidated (Boolean), directorScore,
  sentAt, repliedAt, externalId, createdAt
}
```
Signaux à calculer dans `ceo-tick` : streak (User.streak), jokelikesCount (JokeLike count), favoritesCount (UserFavorite count), pathStarted (UserPathProgress exists), lastActiveAt delta, subscriptionPageViews (Umami event).

**[HYPOTHÈSE à valider avec Thomas] :**
1. Durée moyenne abonnement observée au M1 → choisir scénario LTV (3 / 6 / 12 mois) pour calibrer le CAC cap réel du CEO.
2. Taux de conversion baseline actuel (si des abonnés premium existent déjà) → ajuster les seuils du scoring lead.
3. Mécanisme referral (P7) : à valider si Thomas veut implémenter en Phase 5 ou reporter en Phase 6+.
