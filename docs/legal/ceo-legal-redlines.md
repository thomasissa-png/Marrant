# Red lines légales — CEO autonome Marrant
> Version 1.0 — 2026-05-05 — @legal
> Mandat Thomas : ces règles sont des contraintes techniques, pas des recommandations.
> Draft de référence — validation avocat recommandée avant prod auto S3+.

---

## RISQUES EN 5 POINTS (pour Thomas, non-juriste)

1. **Email B2C sans consentement = amende CNIL** — seuls les subscribers ayant coché la case à l'inscription peuvent recevoir des emails marketing. Zéro exception.
2. **DM outbound automatisé = ban de compte + violation RGPD** — les ToS Twitter/LinkedIn/Instagram l'interdisent explicitement. Déjà acté dans le scope.
3. **Article 22 RGPD : tout tri automatisé d'utilisateurs (dropoff vs actif vs churner)** qui déclenche une communication différenciée est une décision automatisée → droit de contestation humaine obligatoire.
4. **Anthropic et Resend traitent vos données utilisateurs** — DPA non signé = infraction RGPD art. 28. Action requise avant S3.
5. **Mention IA dans les emails** — décision Thomas requise (voir section 7). Sans décision, défaut = transparence totale (art. 22 RGPD + EU AI Act).

---

## 1. Base légale RGPD par type d'action CEO

| Action | Base légale | Article RGPD | Justification |
|---|---|---|---|
| Email outbound subscriber free actif | **Consentement** (art. 6.1.a) | + CPCE art. L34-5 (FR) | Le subscriber a coché une case au signup. Base = consentement explicite obtenu à l'inscription. Intérêt légitime **non** applicable en B2C pour email marketing (CNIL strict). |
| Email outbound free dropoff (>7j sans login) | **Consentement** (même base) | art. 6.1.a + L34-5 | Même base que ci-dessus. Le délai d'inactivité ne change pas la base légale. |
| Email winback churner premium | **Consentement** (même base) | art. 6.1.a + L34-5 | Consentement toujours valide si pas de désabonnement explicite. Au-delà de 36 mois d'inactivité : renouvellement de consentement obligatoire. |
| Email premium retention | **Exécution du contrat** (art. 6.1.b) | art. 6.1.b | Email lié à l'abonnement en cours = exécution du contrat. Opt-out non applicable (email transactionnel/relationnel). |
| Email RP/journaliste/blogueur | **Intérêt légitime** (art. 6.1.f) | art. 6.1.f | Professionnel joignable dans l'exercice de ses fonctions. Base = intérêt légitime presse. Mention + opt-out obligatoires dans chaque message. |
| Réponse email inbound | Aucune base requise | — | Initiative de l'utilisateur. Traitement inhérent à la relation. |
| DM social inbound (réponse) | Aucune base requise | — | Initiative de l'utilisateur. Réponse = exécution de la relation. |
| Commentaire public sur post lambda | **Intérêt légitime** (art. 6.1.f) | art. 6.1.f | Action publique sur un espace public. Pas de traitement de données personnelles privées si le commentaire ne mentionne pas de données privées de l'auteur. |
| Pitch backlink à blogueur/podcast | **Intérêt légitime** (art. 6.1.f) | art. 6.1.f | Même base que RP journaliste. Adresse pro, dans le cadre de leur activité publique. |

**Mention obligatoire minimale dans tout email outbound non-transactionnel :**
> "Tu reçois cet email car tu t'es inscrit(e) sur deviens-marrant.fr. [Lien désinscription 1 clic] | [Politique de confidentialité] | Marrant — 123 rue X, Paris."

---

## 2. Mentions obligatoires dans les emails outbound

Footer type à injecter automatiquement dans TOUT email outbound non-transactionnel :

```
---
Tu reçois cet email parce que tu t'es inscrit(e) sur deviens-marrant.fr.
[Me désinscrire en 1 clic] | [Politique de confidentialité]
Traitement fondé sur : [ton consentement donné à l'inscription / notre intérêt légitime]
Marrant — deviens-marrant.fr | contact@deviens-marrant.fr
[HYPOTHÈSE : adresse postale à ajouter — obligation légale LCEN art. 6-III-1]
```

**Champs obligatoires par type :**
- Subscribers (free/churn) : identité expéditeur + lien désinscription 1 clic + base légale "consentement" + lien CGU + lien politique de confidentialité
- RP/journalistes : identité expéditeur + lien opposition (art. 21 RGPD) + base légale "intérêt légitime" + raison du contact pro
- [DÉCISION THOMAS REQUISE] Mention agent IA : si OUI → ajouter "Cet email a été rédigé par un agent IA — Marrant" | si NON → "L'équipe Marrant"

**Délai légal opt-out** : la désinscription doit être effective dans les **10 jours ouvrés** (CNIL recommandation). En pratique : immédiat via DB (`User.emailOptOut = true`).

---

## 3. Droits utilisateurs RGPD à honorer

| Droit | Article RGPD | Workflow technique requis | Délai légal |
|---|---|---|---|
| **Art. 22 — Contestation décision automatisée** | Art. 22 RGPD | Endpoint `/api/ceo/contest` → flag `CeoTask.contestedAt` + blocage immédiat action + alerte Alex via email Resend. La contestation déclenche une revue humaine (Alex), pas une re-soumission au CEO. | Immédiat sur réception |
| **Droit d'accès** | Art. 15 | Endpoint `/api/user/data-export` — export JSON de toutes les données utilisateur (profil, favoris, logs actions CEO le concernant, historique abonnement). Accessible depuis `/profil`. | 30 jours calendaires |
| **Droit de rectification** | Art. 16 | Formulaire `/profil/edit` déjà existant. S'assurer que la mise à jour se propage aux `CeoMemory` associés. | 30 jours |
| **Droit à l'effacement** | Art. 17 | Endpoint `/api/user/delete` (déjà prévu dans CGU). Doit supprimer aussi `CeoMemory`, `CeoLead`, `CeoOutboundMessage` liés. | 30 jours |
| **Portabilité** | Art. 20 | Export JSON structuré via `/api/user/data-export` (format lisible par machine). S'applique aux données fournies activement par l'utilisateur. | 30 jours |
| **Opposition à la prospection** | Art. 21.2 | Lien désinscription emails + flag `User.emailOptOut`. Opposition = absolu, sans motif requis. `CeoAgent` vérifie ce flag avant TOUT envoi. | Immédiat |

**Art. 22 — scope d'application pour le CEO Marrant :**
Le tri automatisé des subscribers en segments (actif / dropoff / churner) combiné à l'envoi d'un email différencié constitue une décision automatisée "produisant des effets significatifs" (art. 22.1) si elle déclenche un traitement différencié de l'offre. Solution : le CEO envoie des messages différenciés **en fonction du segment**, mais la décision de quel abonnement proposer reste la même pour tous — pas de refus d'accès, pas de prix différent. Risque art. 22 = **faible** dans ce périmètre. L'endpoint `/api/ceo/contest` reste obligatoire pour couvrir les cas limites.

---

## 4. ToS plateformes — automatisation autorisée

### Twitter / X

| Action | Statut | Risque ban |
|---|---|---|
| Répondre aux DMs inbound reçus (1 DM inbound = 1 réponse auto) | ✅ Autorisé avec consentement implicite (l'utilisateur a initié) | Faible si rate-limité |
| Commentaires automatisés sous nos propres posts | ✅ Autorisé | Faible |
| Commentaires proactifs sur posts tiers (monitoring keywords) | ⚠️ Autorisé si non-spammy, non-bulk, délai > 1h, rate limit ≤ 5/jour | Moyen |
| DM outbound automatisé non sollicité | ❌ Interdit (X Automation Rules explicites) | Haut — suspension compte |
| Bulk DMs | ❌ Interdit | Très haut — ban permanent |

**Source** : [X Automation Rules](https://help.x.com/en/rules-and-policies/x-automation) — "You must always get explicit consent before sending automated DMs."

**Décision pratique** : Buffer pour les posts daily-social. API X directe pour la lecture des DMs inbound + réponse. Jamais Buffer pour DM outbound (pas disponible sur Buffer de toute façon).

### LinkedIn

| Action | Statut | Risque ban |
|---|---|---|
| Répondre aux DMs inbound reçus | ✅ Autorisé (initiative de l'autre) | Faible |
| Connection Requests automatisées en masse | ❌ Interdit (LinkedIn User Agreement § 8.2) | Très haut |
| InMails automatisés outbound | ❌ Interdit via API officielle | Haut |
| Commentaires automatisés sur posts tiers | ⚠️ **À CHECKER avec un juriste avant prod** — zone grise ToS LinkedIn. L'API officielle ne fournit pas de endpoint commentaires pour pages non gérées. | Haut si scraper non-officiel |
| Posts via API officielle | ✅ Autorisé | Faible |

**Décision pratique** : Buffer pour les posts. Réponses DMs inbound en semi-auto (draft → validation 1 clic). Commentaires proactifs LinkedIn : **suspendre** en attente de clarification ToS. Risque de ban LinkedIn = réputationnel majeur (audience professionnelle).

### Instagram

| Action | Statut | Risque ban |
|---|---|---|
| Répondre aux DMs inbound via Messenger API (Instagram Graph API) | ✅ Autorisé — Instagram Business permet les réponses automatisées aux messages entrants dans les 24h | Faible si compte Business |
| Commentaires automatisés sous nos posts | ✅ Autorisé | Faible |
| Commentaires proactifs sur posts tiers | ❌ Interdit via API officielle — pas de endpoint commentaires sur posts tiers. Nécessite scraper non-officiel = ToS violation | Très haut — ban Instagram |
| DM outbound non sollicité | ❌ Interdit (Instagram Platform Policy § 3.3) | Haut |

**Décision pratique** : Buffer pour posts. Instagram Graph API Business pour réponses DMs inbound dans fenêtre 24h. Zéro commentaires proactifs Instagram (techniquement impossible en officiel).

---

## 5. DPA et sous-traitants à valider

| Fournisseur | Rôle | DPA disponible | Transfert hors UE | Action requise |
|---|---|---|---|---|
| **Anthropic** | LLM — traite prompts (peuvent contenir données utilisateurs) | [HYPOTHÈSE : DPA disponible dans "Anthropic Commercial Terms" — À VÉRIFIER avant S3] | Oui — US (SCCs requis) | Signer DPA Anthropic ou vérifier que les Terms commerciaux incluent les SCCs. URL : anthropic.com/legal |
| **Resend** | Email transactionnel — traite emails + adresses destinataires | [HYPOTHÈSE : DPA disponible — À VÉRIFIER] | Oui — US | Vérifier et signer DPA Resend. URL : resend.com/legal/dpa |
| **Buffer** | Publication social — reçoit contenu posts, pas de données utilisateurs finaux | [HYPOTHÈSE : DPA disponible — À VÉRIFIER] | Oui — US | Vérifier DPA Buffer. URL : buffer.com/legal |
| **Replit** | Hébergement — accès potentiel à toutes les données en mémoire/DB | [HYPOTHÈSE : DPA disponible — À VÉRIFIER] | Oui — US | Vérifier DPA Replit ou migrer DB vers EU (Supabase EU) si DPA insuffisant |
| **APIs Twitter/LinkedIn/Instagram directes** | Lecture DMs inbound — traite les messages reçus | Pas de DPA standard — ToS plateformes font office de cadre | Oui — US | S'assurer que la politique de confidentialité Marrant mentionne ces transferts. Mentionner les plateformes comme sous-traitants dans le registre des traitements. |
| **Stripe** | Paiement — données bancaires | DPA inclus dans Stripe Master Subscription Agreement | Oui — US, SCCs en place | Aucune — déjà géré par Stripe |

**Registre des traitements (art. 30 RGPD)** : doit être mis à jour pour inclure le CEO comme nouveau traitement automatisé. Catégories : données d'abonnés, comportement d'usage, historique de communication.

---

## 6. Red lines techniques — à forcer dans le code (@fullstack Phase 5)

1. **Opt-out 1-clic auto-injecté** : le footer email (section 2) est injecté par le module d'envoi Resend, pas par le CEO. Si le footer est absent, l'email ne part pas. Implémentation : middleware `enforceEmailFooter()` appelé avant tout `resend.emails.send()`.

2. **Kill-switch DB-backed** : `CeoConfig.enabled = false` → le cron `/api/cron/ceo-tick` retourne `{status: "disabled"}` immédiatement sans aucune action. Pas de bypass possible. Champ booléen dans la table `CeoConfig`.

3. **Allowlist destinataires** : le CEO ne peut adresser que (a) users avec `emailOptOut = false` ET `createdAt` dans la DB (subscribers réels), ou (b) destinataires dont le message inbound est dans la table `CeoInbound` (DM/email reçu). Zéro envoi vers une adresse non présente dans ces sources.

4. **Blacklist commentaires proactifs** : table `CeoCommentBlacklist { handle, platform, reason }` — le CEO vérifie avant tout commentaire proactif. Pré-remplie avec catégories : humoristes professionnels, influenceurs >10k abonnés, journalistes (LCEN risques diffamation). Maintenue en CSV importable.

5. **Rate limits par canal et par destinataire** :
   - Email subscriber : max 1 email marketing / 14 jours / subscriber (hors transactionnel)
   - Commentaires proactifs : max 5 / jour / plateforme, délai minimum 60 min après publication du post cible
   - Pitchs RP : max 1 / destinataire / 60 jours
   - DM inbound réponse : max 3 messages dans une conversation avant flag "escalade humaine"

6. **Anti-spam déduplication** : hash `SHA256(destinataire + contenu_tronqué_100chars)` stocké dans `CeoDedup { contentHash, sentAt }`. Blocage si même hash dans les 24h.

7. **Log persistant 3 ans pour audit CNIL** : table `CeoAuditLog { id, timestamp, action, targetType, targetIdHashed, channel, aiDecisionScore, aiModel, outcome, contestedAt }`. Rétention 3 ans (1 095 jours). Champ `targetIdHashed` = SHA256 de l'email/handle (PII masqué mais traçable).

8. **PII masking dans les logs applicatifs** : les logs Replit/console ne doivent jamais contenir d'email en clair ou de handle. Utiliser `maskPii(str)` → remplace `@email.com` par `****@****.***` dans tous les appels `console.log/error` du CEO.

9. **Endpoint `/api/ceo/contest`** : reçoit `{ userId, ceoTaskId, reason }` → (a) flag `CeoTask.contestedAt = now()`, (b) suspend toute action CEO sur ce userId pendant 30 jours, (c) envoie email à `alex@deviens-marrant.fr` avec contexte. La contestation n'entraîne pas de re-soumission au CEO. Accessible depuis `/profil`.

10. **Vérification `emailOptOut` avant envoi** : requête DB synchrone obligatoire sur `User.emailOptOut` au moment de l'envoi, pas au moment de la planification (un utilisateur peut se désinscrire entre les deux).

11. **Mention expéditeur identifiable** : le champ `from` Resend doit être `Marrant <contact@deviens-marrant.fr>` ou `Alex de Marrant <alex@deviens-marrant.fr>`. Jamais un no-reply sans réponse possible (LCEN art. 6).

12. **[DÉCISION THOMAS REQUISE] Signature IA** : si OUI → injecter "— Marrant, agent IA" dans la signature. Si NON → "— L'équipe Marrant". Défaut d'implémentation = transparence totale (option OUI) pour conformité EU AI Act art. 52 (obligation de transparence chatbot/agent).

---

## 7. Risques résiduels et mitigations

### Risque 1 — Sanction CNIL malgré conformité formelle
**Scénario** : Un subscriber se plaint à la CNIL d'avoir reçu un email "harcelant" bien que son consentement soit valide et l'opt-out fonctionnel.
**Probabilité** : Faible (conformité formelle protège). Sanction maximale possible : mise en demeure + amende 4% CA global.
**Mitigation** : (a) Rate limit 1 email/14j est protecteur. (b) Conserver les preuves de consentement en DB (timestamp + IP du signup) pendant 3 ans. (c) Réponse à la CNIL dans les 72h. (d) Désignation d'un point de contact RGPD (Alex = DPO de fait pour structure <250 salariés).

### Risque 2 — Ban compte plateforme malgré ToS respectées
**Scénario** : Twitter ou Instagram suspend le compte suite à signalements multiples de commentaires proactifs perçus comme spam, même si rate-limités.
**Probabilité** : Moyenne. Les algorithmes de détection bot sont imprévisibles.
**Mitigation** : (a) Commentaires proactifs uniquement sur Twitter (pas Instagram, LinkedIn trop risqué). (b) Variabilité des délais (60-180 min aléatoire). (c) Contenu CEO distinct des posts daily-social (pas de duplication). (d) Procédure de contestation de ban préparée à l'avance (formulaire Twitter support + backup compte). (e) Kill-switch immédiat si taux de signalement > 0,1%.

### Risque 3 — Plainte utilisateur émotionnelle (humour mal reçu)
**Scénario** : Un subscriber en deuil reçoit un email "deviens drôle !" perçu comme indécent. Plainte publique ou juridique pour préjudice moral.
**Probabilité** : Faible mais non nulle — le contenu humour cible les 20-35 ans en bonne santé émotionnelle, mais aucun filtre sur l'état émotionnel de l'utilisateur.
**Mitigation** : (a) Le CEO ne personnalise pas les messages à partir d'inférences sur l'état émotionnel (pas de "je sais que tu traverses une période difficile"). (b) Les emails de winback churner sont neutres en ton ("on t'a mis de côté une vanne"), pas urgents. (c) Réponse humaine (Alex) garantie sur tout email inbound émotionnel (flag `CeoTask.requiresHumanReply`). (d) Page `/contact` avec réponse humaine garantie sous 48h.

---

## Handoff

---
**Handoff → @fullstack (Phase 5)**

Fichiers produits : `/docs/legal/ceo-legal-redlines.md`

TODO code — par priorité :

**P0 (bloquant avant S3 auto-send) :**
- [ ] Implémenter `enforceEmailFooter()` middleware Resend (red line 1)
- [ ] Implémenter vérification synchrone `emailOptOut` avant tout envoi (red line 10)
- [ ] Créer `CeoConfig.enabled` kill-switch DB + check dans `/api/cron/ceo-tick` (red line 2)
- [ ] Créer table `CeoAuditLog` avec rétention 3 ans (red line 7)
- [ ] Créer endpoint `/api/ceo/contest` (red line 9)
- [ ] Allowlist destinataires : bloquer tout envoi hors subscribers DB ou inbound reçu (red line 3)

**P1 (avant fin S1 drafts) :**
- [ ] Implémenter rate limits par canal en DB (table `CeoRateLimit`) (red line 5)
- [ ] Implémenter déduplication `CeoDedup` content_hash 24h (red line 6)
- [ ] Créer table `CeoCommentBlacklist` + seed initial humoristes/influenceurs (red line 4)
- [ ] `maskPii()` dans tous les console.log du module CEO (red line 8)
- [ ] Champ `from` Resend identifiable : `Marrant <contact@deviens-marrant.fr>` (red line 11)

**P2 (mois 2) :**
- [ ] Endpoint `/api/user/data-export` complet (inclure données CEO) (section 3)
- [ ] Propagation effacement vers `CeoMemory`, `CeoLead`, `CeoOutboundMessage` dans `/api/user/delete` (section 3)
- [ ] Lien `/api/ceo/contest` accessible depuis `/profil` (section 3)

**Handoff → @ia (Phase 3)**

Restrictions à intégrer dans le prompt système du CEO :
- "Tu n'envoies JAMAIS un message à une adresse non présente dans la table User (subscribers) ou dans la table CeoInbound (messages reçus)."
- "Avant tout email outbound, tu vérifies que `User.emailOptOut = false`. Si true, tu archives la tâche sans action."
- "Tu ne génères JAMAIS un email sans footer légal (opt-out + identité expéditeur). Si le module n'est pas disponible, tu marques la tâche PENDING."
- "Tu n'utilises JAMAIS d'inférence sur l'état émotionnel de l'utilisateur (deuil, dépression, crise) pour personnaliser un message."
- "Pour tout commentaire proactif, tu vérifies la blacklist `CeoCommentBlacklist` et le rate limit canal. Si l'un ou l'autre bloque, tu archives sans action."
- "Tu rends compte de chaque action dans `CeoAuditLog` avec le score de décision IA et le modèle utilisé."

**Décision binaire Thomas requise :**
> **Transparence IA dans signature email** : OUI ("— Marrant, agent IA") ou NON ("— L'équipe Marrant") ?
> Défaut si pas de réponse avant S3 : OUI (conformité EU AI Act art. 52 — obligation de transparence agent IA).

**[HYPOTHÈSE] À vérifier avant Phase 5 (P0) :**
- DPA Anthropic signé ? → Vérifier sur anthropic.com/legal. Si pas de DPA explicite : les "Commercial Terms" d'Anthropic incluent-ils des SCCs pour transfert US-UE ?
- DPA Resend signé ? → Vérifier sur resend.com/legal/dpa. Action : signer le DPA depuis le dashboard Resend.
- DPA Replit signé ? → Vérifier sur replit.com/site/privacy. Si hébergement US sans DPA EU adéquat : envisager PostgreSQL sur instance EU (Supabase EU, Neon EU).
- DPA Buffer signé ? → Vérifier sur buffer.com/legal.
---
