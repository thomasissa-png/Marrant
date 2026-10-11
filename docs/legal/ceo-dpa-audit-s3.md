# Audit légal pré-S3 — CEO Agent autonome Deviens Marrant
> Version 1.0 — 2026-05-06 — @legal
> Scope : validation légale avant passage en mode auto-send S3 (emails outbound automatisés)
> Inputs : ceo-agent-scope.md v2, ceo-agent-specs.md v1, ceo-legal-redlines.md v1, ceo-backlinks-strategy.md, founder-preferences.md
> Draft de référence — validation avocat recommandée avant déploiement S3.

---

## 1. TL;DR — Verdict pré-S3

**Verdict : GO CONDITIONNEL**

Trois actions bloquantes (BLOQUANT) doivent être exécutées par Thomas avant le passage en auto-send S3. Sans elles, le risque CNIL et le risque ban de compte sont réels.

1. **Signer le DPA Resend** depuis le dashboard Resend (30 secondes, bloquant RGPD art. 28).
2. **Accepter les Commercial Terms Anthropic** qui intègrent automatiquement le DPA+SCCs — vérifier que le compte API est bien en "Commercial" et non en plan gratuit.
3. **Activer le footer RGPD obligatoire** dans le module d'envoi (`enforceEmailFooter()`) avant tout auto-send.

Les autres actions (Replit DPA, X DPA, Meta API) sont REQUISES avant fin S1 mais ne bloquent pas strictement le premier auto-send email.

---

## 2. Volet 1 — DPA prestataires

### 2.1 Anthropic (LLM Claude)

**Rôle dans le CEO** : traite tous les prompts envoyés par le CEO, qui peuvent contenir des données utilisateurs (email, streak, historique d'interactions). Est sous-traitant au sens de l'art. 28 RGPD.

**Articles RGPD pertinents** : art. 28 (sous-traitant), art. 32 (sécurité), art. 44-46 (transfert hors UE — Anthropic est basé aux États-Unis).

**Statut DPA** : Le DPA Anthropic est automatiquement inclus dans les "Anthropic Commercial Terms of Service" dès acceptation. Il incorpore les SCCs Module 2 (Contrôleur → Processeur) de la Décision d'exécution UE 2021/914. Pas de signature séparée nécessaire — le DPA entre en vigueur par l'acceptation des Terms commerciaux.

**Condition** : valide uniquement si Thomas a accepté les *Anthropic Commercial Terms* (compte API payant ou plan commercial). Le plan gratuit (Claude.ai) ne bénéficie pas du DPA complet.

**Verdict** : REQUIS — vérifier que le compte Anthropic est bien sous Commercial Terms (pas personal use). Action : se connecter à console.anthropic.com → Settings → Plan → confirmer "API commercial".

**Transfert hors UE** : Oui (US). Couvert par SCCs Module 2 inclus dans les Commercial Terms.

**Actions Thomas** :
- [ ] Vérifier que le compte Anthropic API est sur un plan commercial (pas free tier)
- [ ] Conserver une copie des Commercial Terms acceptées (date d'acceptation) dans le registre des traitements

---

### 2.2 Resend (envoi email transactionnel + outbound CEO)

**Rôle dans le CEO** : traite les adresses email des subscribers, les contenus des emails envoyés, et les métadonnées de livraison. Sous-traitant critique — tout auto-send S3 passe par Resend.

**Articles RGPD pertinents** : art. 28, art. 32, art. 44-46 (US).

**Statut DPA** : Resend dispose d'un DPA complet disponible sur resend.com/legal/dpa, incluant les SCCs EU (Décision 2021/914) et UK Addendum. Le DPA entre en vigueur lors de l'acceptation des Terms of Service OU sur exécution séparée.

**Verdict** : BLOQUANT pré-S3 — si le DPA n'a pas été explicitement accepté ou signé, l'infraction RGPD art. 28 est constituée dès le premier auto-send. L'acceptation des ToS seules peut ne pas suffire selon la configuration du compte.

**Transfert hors UE** : Oui (US). Couvert par SCCs inclus dans le DPA.

**Actions Thomas** :
- [ ] Se connecter au dashboard Resend → Settings → Legal → vérifier si le DPA est marqué "Signed" ou "Accepted"
- [ ] Si non : télécharger et signer le DPA sur resend.com/legal/dpa (formulaire en ligne, 5 min)
- [ ] Conserver la confirmation de signature dans le registre des traitements
- [ ] **BLOQUANT : ne pas activer l'auto-send S3 avant confirmation du DPA Resend signé**

---

### 2.3 Buffer (publication sociale — posts daily-social uniquement)

**Rôle dans le CEO** : Buffer n'est PAS utilisé pour les DMs ou l'outbound CEO (confirmé dans ceo-agent-scope.md). Buffer traite uniquement les posts daily-social via le pipeline social-media-agent. Il reçoit le contenu des posts et les métadonnées de scheduling, mais pas de données d'utilisateurs finaux (subscribers).

**Articles RGPD pertinents** : art. 28 (sous-traitant), art. 32. Art. 44-46 si données personnelles transmises.

**Statut DPA** : Buffer dispose d'une page légale sur buffer.com/legal. [HYPOTHÈSE : DPA Buffer disponible mais statut de signature non vérifié à ce jour — à confirmer Thomas.]

**Données traitées** : contenu des posts uniquement, pas d'email ni d'identifiant utilisateur final. Risque RGPD limité dans le périmètre CEO actuel.

**Verdict** : REQUIS (pas bloquant S3 email) — DPA à signer car sous-traitant actif sur les posts social. Priorité inférieure à Resend et Anthropic car pas de données utilisateurs finaux transmises via Buffer dans le périmètre CEO.

**Actions Thomas** :
- [ ] Vérifier buffer.com/legal pour localiser le DPA
- [ ] Signer ou accepter le DPA Buffer (plan Essentials ou Teams requis pour DPA formel)
- [ ] Si Buffer ne propose pas de DPA sur le plan actuel : contacter support@buffer.com

---

### 2.4 Twitter / X API (DMs sortants automatisés)

**Rôle dans le CEO** : lecture des DMs inbound reçus + envoi de réponses automatisées (1 DM inbound = 1 réponse auto). L'API X traite les handles Twitter et le contenu des conversations.

**Articles RGPD pertinents** : art. 28, art. 32, art. 44-46 (US). Art. 4.7 : X est co-responsable du traitement pour les données sur sa plateforme (cadre Controller-to-Controller), pas pur sous-traitant.

**Statut DPA** : X dispose d'un Global Data Processing Addendum (DPA) publié sur privacy.x.com/en/for-our-partners/global-dpa. Il inclut les SCCs (Décision 2021/914) et le UK Addendum. Applicable aux partenaires qui intègrent l'API X.

**Particularité** : X est qualifié de "Controller-to-Controller" pour les données des utilisateurs de la plateforme (pas de Module 2 Contrôleur→Processeur mais Module 3 Processeur→Processeur). La relation contractuelle est celle d'un transfert entre deux responsables de traitement, encadré par les SCCs Module 1.

**Verdict** : REQUIS avant activation DMs automatiques (S4). Pas strictement bloquant pour S3 (auto-send email uniquement), mais doit être traité avant activation des réponses DM automatiques.

**Actions Thomas** :
- [ ] Lire et accepter le X Global DPA sur privacy.x.com/en/for-our-partners/global-dpa
- [ ] S'assurer que la politique de confidentialité Marrant mentionne X comme partenaire traitant des données
- [ ] Vérifier que l'usage de l'API X pour les DMs respecte les X Automation Rules (voir ceo-legal-redlines.md section 4)

---

### 2.5 Meta API Instagram (DMs inbound — réponses automatisées)

**Rôle dans le CEO** : réponses aux DMs inbound Instagram via Instagram Graph API Business (fenêtre 24h). Pas de DM outbound proactif (interdit ToS Meta, confirmé dans scope). [HYPOTHÈSE : les "drafts permanents" mentionnés dans la mission se réfèrent aux projets de réponses DMs validés par Thomas avant envoi en S1-S2, pas à des DMs automatisés non sollicités.]

**Articles RGPD pertinents** : art. 28, art. 44-46. Meta est établi dans l'UE (Meta Platforms Ireland Ltd) pour les utilisateurs européens, ce qui simplifie partiellement le cadre de transfert.

**Statut DPA** : Meta dispose d'un Data Processing Agreement accessible sur facebook.com/legal/terms/dataprocessing. Pour les développeurs utilisant l'Instagram Graph API, Meta exige une "Data Protection Assessment" (DPA développeur) sur le portail Meta for Developers. Ces deux instruments sont distincts.

**Particularité** : Meta est une entité duale — co-responsable du traitement sur ses plateformes ET processeur pour les développeurs qui utilisent ses API. La qualification juridique dépend du type de données traitées.

**Verdict** : REQUIS avant activation des réponses DM Instagram automatiques. Deux actions distinctes.

**Actions Thomas** :
- [ ] Accepter les Meta Data Processing Terms sur facebook.com/legal/terms/dataprocessing
- [ ] Compléter la Data Protection Assessment Meta for Developers sur developers.meta.com (obligatoire pour les apps Instagram Graph API en production)
- [ ] Vérifier que le compte Instagram est bien un compte "Business" (requis pour Graph API messaging)

---

### 2.6 Replit (hébergement — base de données PostgreSQL)

**Rôle** : héberge l'ensemble des données du projet (DB PostgreSQL, code, variables d'environnement dont RESEND_API_KEY, ANTHROPIC_API_KEY). Accès potentiel à toutes les données personnelles en mémoire.

**Articles RGPD pertinents** : art. 28 (sous-traitant critique — héberge tout), art. 32, art. 44-46 (US).

**Statut DPA** : Replit dispose d'un DPA à jour (replit.com/dpa, mis à jour avril 2026), incluant SCCs pour transferts internationaux. Le DPA s'applique automatiquement aux clients ayant accepté les Terms of Service.

**Risque spécifique** : Replit héberge les données en infrastructure US. La base de données PostgreSQL contenant les emails et données comportementales des utilisateurs est donc soumise aux lois américaines (Cloud Act). Les SCCs couvrent ce transfert mais ne protègent pas contre les demandes légales US.

**Verdict** : REQUIS — vérifier que le compte Replit a bien accepté les Terms incluant le DPA. Envisager migration DB vers une instance EU (Supabase EU, Neon EU) si Thomas veut réduire l'exposition Cloud Act.

**Actions Thomas** :
- [ ] Vérifier que les Replit Terms of Service incluent bien le DPA (replit.com/dpa) pour votre plan actuel
- [ ] [RECOMMANDÉ] Évaluer migration PostgreSQL vers Supabase EU ou Neon EU pour réduire l'exposition Cloud Act américain sur les données des abonnés FR

---

## 3. Volet 2 — Base légale outreach par audience

### 3.1 Free users inactifs (> 7j sans login) — Playbook P2

**Base légale** : Consentement (art. 6.1.a RGPD) + CPCE art. L34-5 (droit français email marketing B2C).

**Justification** : Le subscriber s'est inscrit et a consenti à la communication email lors de l'inscription. L'inactivité ne modifie pas la validité du consentement. Limite : consentement périme au-delà de 36 mois d'inactivité totale (recommandation CNIL — renouvellement requis).

**Mécanisme opt-in/opt-out** :
- Opt-in : case cochée à l'inscription (à vérifier dans le formulaire `/register` — doit être non pré-cochée)
- Opt-out : lien de désinscription 1 clic dans chaque email + `User.emailOptOut = true` en DB
- Vérification synchrone de `emailOptOut` OBLIGATOIRE au moment de l'envoi (pas à la planification)

**Mentions obligatoires dans chaque email** :
```
Tu reçois cet email car tu t'es inscrit(e) sur deviens-marrant.fr.
[Me désinscrire en 1 clic] | [Politique de confidentialité]
Base légale : ton consentement donné à l'inscription.
Deviens Marrant — deviens-marrant.fr | contact@deviens-marrant.fr
[HYPOTHÈSE : adresse postale physique à ajouter — LCEN art. 6-III-1 obligatoire]
```

**Risque CNIL** : Faible si consentement documenté, opt-out fonctionnel et rate limit ≤ 1 email/14 jours respecté.

---

### 3.2 Free users bloqués par paywall — Playbook P3

**Base légale** : Consentement (art. 6.1.a) — même base que 3.1.

**Point d'attention** : Le trigger "paywall bloqué" dans P3 original est un signal technique (l'utilisateur a tenté d'accéder à du contenu premium). Ce signal ne constitue pas une "décision produisant des effets juridiques significatifs" au sens strict de l'art. 22 RGPD dans le périmètre de Marrant (aucun refus d'accès différencié — le contenu free reste accessible). Art. 22 s'applique de façon limitée ici (voir ceo-legal-redlines.md section 3 pour analyse complète).

**Pivot valeur éducative** : le CEO ne mentionne jamais "tu as touché une limite" comme hook — le trigger est interne, invisible dans le message. Ce pivot élimine le risque de perception de surveillance.

**Mécanisme** : Identique à 3.1. Opt-out 1 clic obligatoire.

**Risque CNIL** : Faible. Aucune inférence sur données sensibles.

---

### 3.3 Churners premium (winback) — Playbook P4

**Base légale** : Consentement (art. 6.1.a) — le consentement donné à l'inscription reste valide après résiliation de l'abonnement, sauf désinscription explicite.

**Limite temporelle** : Au-delà de 36 mois depuis la dernière interaction, le consentement doit être renouvelé (CNIL recommandation "opt-in renouvellement"). En pratique : si `User.updatedAt < now - 36 mois` ET `emailOptOut = false`, envoyer d'abord un email de renouvellement de consentement avant tout winback.

**Mécanisme** : Identique à 3.1.

**Risque CNIL** : Faible si durée respectée. Moyen au-delà de 36 mois sans renouvellement.

---

### 3.4 Presse (journalistes, blogueurs, podcasts FR)

**Base légale** : Intérêt légitime (art. 6.1.f RGPD).

**Justification** : Les journalistes et blogueurs sont contactés dans le cadre de leur activité professionnelle publique, sur leur adresse professionnelle, pour un sujet en lien avec leur domaine de publication. L'intérêt légitime de Marrant à promouvoir son contenu auprès de la presse est réel et ne prime pas sur les droits et libertés du journaliste (personne morale dans l'exercice de ses fonctions).

**Condition stricte** : uniquement sur des adresses professionnelles publiques (publiées sur leur média, profil LinkedIn professionnel, page "nous contacter" du blog). Jamais sur une adresse personnelle obtenue par autre moyen.

**Mentions obligatoires dans chaque email RP** :
```
Je vous contacte car votre couverture de [X] est alignée avec notre domaine d'expertise.
[...contenu du pitch...]
Vous pouvez vous opposer à tout futur contact via ce lien : [lien opposition art. 21]
Base légale : intérêt légitime (art. 6.1.f RGPD) — activité professionnelle publique.
Deviens Marrant — deviens-marrant.fr | contact@deviens-marrant.fr
```

**Fréquence max** : 1 pitch / destinataire / 60 jours (déjà dans les red lines techniques).

**Risque CNIL** : Faible si cadre respecté. La CNIL admet l'intérêt légitime pour la prospection B2B professionnelle. Risque moyen si le journaliste s'oppose et que l'opposition n'est pas respectée immédiatement.

---

### 3.5 Créateurs FR (commentaires proactifs sur posts publics)

**Base légale** : Intérêt légitime (art. 6.1.f RGPD) pour l'interaction publique. Pas de traitement de données personnelles privées si le commentaire répond à un post public sans exploitation de données personnelles de l'auteur au-delà du contexte public.

**Limite** : le monitoring de keywords pour identifier des posts pertinents peut constituer un traitement de données si les handles sont stockés. `CeoCommentBlacklist` et les logs de monitoring doivent appliquer un délai de rétention court (72h max pour les handles scannés non retenus).

**Risque CNIL** : Faible pour Twitter (posts publics, API officielle). Élevé pour Instagram (commentaires proactifs sur posts tiers non autorisés par l'API officielle — cf. ceo-legal-redlines.md section 4). LinkedIn : suspendu en attente clarification ToS.

---

## 4. Volet 3 — Scraping Connectively / SourceBottle / HARO

### 4.1 Cadre légal en France

**Droit applicable** : Le scraping de sites web est légal en France sous conditions. La Cour de cassation (Arrêt LinkedIn c. Scrap3in, 2020) a confirmé que le scraping de données publiques peut être licite même en violation des CGU d'un site, mais l'arrêt **ne crée pas de blanc-seing général** — il exige une analyse au cas par cas.

**CNIL (juin 2025)** : la CNIL a publié de nouvelles recommandations sur le scraping pour l'IA, admettant l'intérêt légitime comme base possible, sous réserve de :
1. Données publiquement accessibles uniquement
2. Pas de collecte de données personnelles sans nécessité
3. Mécanismes de mise à jour/effacement respectés
4. Information des personnes si les données les concernent

**Dans le périmètre Marrant** : Connectively, SourceBottle et les anciens flux HARO sont des plateformes qui publient des **appels à sources de journalistes** — il ne s'agit pas de données personnelles d'utilisateurs finaux mais d'opportunités éditoriales professionnelles. La qualification juridique est favorable.

### 4.2 Risque CGU des plateformes

| Plateforme | CGU scraping | Risque |
|---|---|---|
| **Connectively** (ex-HARO) | [HYPOTHÈSE : CGU interdisent le scraping automatisé — à vérifier sur connectively.co/terms] | Moyen — risque de résiliation compte + blocage IP |
| **SourceBottle** | [HYPOTHÈSE : CGU à vérifier sur sourcebottle.com/terms] | Moyen |
| **Qwoted** | [HYPOTHÈSE : API officielle disponible — à vérifier] | Faible si API officielle |
| **RSS/email digest** | Aucune restriction sur la lecture de flux RSS publics | Nul |

**Distinction critique** : scraper une page HTML protégée par compte = risque CFAA/CGU élevé. Lire un flux **RSS public** ou un **webhook/email digest** = légal.

### 4.3 Alternatives propres recommandées

**Option 1 — Flux RSS / email digest (recommandée)** : plusieurs services de type HARO proposent des alertes par email ou flux RSS. La lecture d'un email digest entrant ou d'un flux RSS public ne constitue pas du scraping au sens technique. L'agent CEO peut lire ces emails via IMAP ou ces flux via fetch() sans risque juridique.

**Option 2 — Zapier webhook** : connecter Connectively/SourceBottle à un webhook Zapier qui pousse les opportunités vers l'endpoint CEO. Zapier agit comme intégrateur autorisé (il utilise les API officielles ou les flux autorisés de la plateforme source).

**Option 3 — API officielle** : vérifier si Connectively/SourceBottle proposent une API partenaire. [HYPOTHÈSE : pas d'API publique connue à ce jour — à vérifier.]

**Verdict** : le scraping HTML direct de Connectively/SourceBottle est **déconseillé** (risque CGU, risque blocage). Utiliser flux RSS + email digest + Zapier = solution propre, zéro risque juridique, même résultat fonctionnel.

**Action Thomas** :
- [ ] Vérifier si Connectively propose un flux RSS ou un email digest pour les nouvelles opportunités
- [ ] Vérifier si SourceBottle propose un flux RSS ou une API partenaire
- [ ] Configurer Zapier comme source d'alimentation du CEO plutôt qu'un scraper HTML direct

---

## 5. Volet 4 — EU AI Act

### 5.1 Classification du risque — CEO Marrant

**Texte applicable** : EU AI Act (Règlement UE 2024/1689), entré en application par phases. Les obligations de transparence (art. 50, anciennement numéroté art. 52 dans les versions de travail) s'appliquent depuis **août 2026** pour les systèmes de risque limité.

**Analyse de classification** :

| Critère | Évaluation CEO Marrant |
|---|---|
| Système à risque inacceptable (Annexe I) | Non — pas de scoring social, pas de surveillance biométrique |
| Système à haut risque (Annexe III) | Non — pas de recrutement, crédit, médical, éducation notée avec effets juridiques |
| Système IA en interaction directe avec des personnes | OUI — emails + DMs rédigés par IA et envoyés à des humains |
| Génération de contenu (GPAI) | Partiel — le CEO génère du texte mais ne publie pas de contenu créatif au sens large |

**Classification retenue : Risque Limité** — art. 50.1.b du EU AI Act (système IA interagissant directement avec des personnes physiques).

### 5.2 Obligations de transparence (art. 50 EU AI Act)

L'art. 50.1.b impose que les "déployeurs" d'un système IA "qui interagit directement avec des personnes physiques" s'assurent que ces personnes sont **informées qu'elles interagissent avec un système IA**, sauf si c'est évident compte tenu du contexte.

**Application au CEO Marrant** :
- Emails outbound aux subscribers : l'utilisateur croit interagir avec "L'Équipe Deviens Marrant" — ce n'est pas évident qu'il s'agit d'une IA.
- Réponses DMs : l'utilisateur qui reçoit une réponse rapide et personnalisée peut raisonnablement penser qu'un humain a répondu.
- Pitchs journalistes : un journaliste recevant un pitch professionnel croit interagir avec une personne.

**Calendrier d'application** : les obligations art. 50 entrent en vigueur en **août 2026** (12 mois après publication du règlement, pour les systèmes de risque limité). A la date de déploiement CEO (S3, mai-juin 2026), ces obligations ne sont pas encore formellement applicables. Cependant, les **bonnes pratiques recommandées par l'AI Office** s'appliquent dès maintenant.

### 5.3 Risque résiduel — [CHOIX UTILISATEUR] "Mention IA jamais"

**Rappel du choix Thomas** (founder-preferences.md, 06/05/2026) : mention IA strictement interdite dans tout contenu et toute signature. Règle permanente, non re-questionnable. Signature systématique : "L'Équipe Deviens Marrant".

**Cartographie objective du risque résiduel** (documentation du risque, pas remise en cause du choix) :

| Risque | Probabilité | Impact | Fenêtre temporelle |
|---|---|---|---|
| Plainte utilisateur à la CNIL pour manque de transparence IA | Très faible — les utilisateurs de Marrant ont consenti à recevoir des emails de la marque, pas d'une personne physique identifiée | Faible — CNIL priorise les risques élevés, pas les EdTech humour | Mai → août 2026 : risque résiduel. Post-août 2026 : risque moyen si obligation art. 50 non respectée |
| Plainte journaliste pour pitch IA non déclaré | Faible — pas de relation contractuelle, pas de préjudice mesurable | Faible — maximum : publication d'un article critique sur les pratiques | Continu |
| Amende CNIL | Très faible — la CNIL n'a pas prononcé d'amende sur ce motif seul à ce jour | Potentiellement élevé (4% CA) mais CA quasi nul à ce stade | Post-août 2026 |

**Mitigation documentaire recommandée** (sans changer la signature) :
- Mentionner dans la **politique de confidentialité** que "certaines communications sont générées avec l'assistance d'outils IA" — formulation générique qui couvre le risque sans mentionner le CEO dans chaque email.
- Conserver les **logs complets** (`CeoAuditLog`) de toutes les décisions IA pour répondre à une éventuelle demande CNIL.
- Prévoir une **procédure de réponse rapide** à la CNIL (72h) documentée en avance.

**[HYPOTHÈSE : en l'absence de jurisprudence CNIL spécifique aux agents IA en EdTech B2C en mai 2026, le risque résiduel est estimé faible mais non nul. La situation réglementaire évolue rapidement — réévaluation recommandée en octobre 2026 quand les guidelines AI Office seront publiées.]**

### 5.4 Documentation technique requise (EU AI Act art. 13 + art. 50)

Indépendamment des obligations de transparence vers les utilisateurs, le EU AI Act requiert une documentation technique interne pour les déployeurs :

| Document | Contenu minimal | Statut |
|---|---|---|
| **Description du système** | Fonctions du CEO, canaux, modèles utilisés (Haiku/Sonnet/Opus), trigger, rate limits | À créer — `docs/ia/ceo-agent-architecture.md` v1 couvre déjà l'essentiel |
| **Logs d'audit** | Toutes les décisions automatisées du CEO avec modèle + score + outcome | `CeoAuditLog` en cours de spécification (ceo-agent-specs.md) |
| **Kill-switch** | Procédure d'arrêt d'urgence documentée | `CeoConfig.enabled = false` — à documenter dans le registre |
| **Registre des traitements (art. 30 RGPD)** | Nouveau traitement "CEO autonomous agent" à ajouter | À créer par Thomas — 1h de travail |

---

## 6. Récap actions Thomas — Tableau prioritisé

| Priorité | Action | Délai | Effort | Risque si non fait |
|---|---|---|---|---|
| **BLOQUANT** | Signer DPA Resend (dashboard Resend → Legal) | Avant S3 | 5 min | Infraction RGPD art. 28 sur tout auto-send email |
| **BLOQUANT** | Activer footer RGPD obligatoire dans `enforceEmailFooter()` (@fullstack) | Avant S3 | 2h dev | Violation CPCE art. L34-5, risque CNIL |
| **BLOQUANT** | Vérifier compte Anthropic API = plan commercial (console.anthropic.com → Settings → Plan) | Avant S3 | 5 min | DPA non applicable sur plan gratuit = infraction art. 28 |
| **REQUIS** | Vérifier et accepter DPA Replit (replit.com/dpa) | Avant fin S1 | 10 min | Hébergeur DB sans DPA = infraction art. 28 |
| **REQUIS** | Accepter X Global DPA (privacy.x.com/en/for-our-partners/global-dpa) | Avant activation DMs S4 | 15 min | Infraction art. 28 sur DMs automatisés |
| **REQUIS** | Accepter Meta Data Processing Terms + compléter Data Protection Assessment developers.meta.com | Avant activation IG S4 | 30 min | Accès API Instagram potentiellement révoqué |
| **REQUIS** | Vérifier Buffer DPA (buffer.com/legal) | Avant fin S1 | 15 min | Infraction art. 28 sur posts sociaux |
| **REQUIS** | Ajouter traitement "CEO agent" au registre des traitements (art. 30 RGPD) | Avant S3 | 1h | Absence de registre = infraction documentaire CNIL |
| **REQUIS** | Mentionner dans la politique de confidentialité l'usage d'IA pour certaines communications | Avant S3 | 30 min | Risque résiduel EU AI Act art. 50 (post-août 2026) |
| **REQUIS** | Remplacer scraping HTML direct Connectively/SourceBottle par RSS/email digest/Zapier | Avant activation module backlinks | 2h config | Risque CGU plateforme + blocage IP |
| **RECOMMANDÉ** | Évaluer migration DB PostgreSQL vers instance EU (Supabase/Neon EU) | Avant M3 | 4-8h | Exposition Cloud Act US — données subscribers FR en infrastructure US |
| **RECOMMANDÉ** | Documenter la procédure de réponse CNIL en 72h | Avant M2 | 2h | Délai de réponse dépassé en cas de plainte |
| **RECOMMANDÉ** | Implémenter renouvellement de consentement pour subscribers inactifs > 36 mois | Avant M6 | 4h dev | Risque CNIL sur campagnes winback long terme |

---

## 7. Hypothèses

Les éléments suivants n'ont pas pu être vérifiés directement et sont marqués comme hypothèses. Thomas doit les confirmer ou les corriger avant déploiement S3.

- **[HYPOTHÈSE : DPA Buffer non vérifié]** — la page buffer.com/legal existe mais le statut de signature/acceptation du DPA pour le compte actuel de Thomas n'a pas pu être vérifié. À confirmer dans le dashboard Buffer.
- **[HYPOTHÈSE : CGU Connectively interdisent le scraping HTML]** — basé sur la pratique standard des plateformes de type HARO. Vérification directe sur connectively.co/terms requise.
- **[HYPOTHÈSE : CGU SourceBottle à vérifier]** — même analyse que Connectively. Vérification sur sourcebottle.com/terms requise.
- **[HYPOTHÈSE : adresse postale physique absente du footer email]** — la LCEN art. 6-III-1 exige une adresse physique dans les emails commerciaux. Si Thomas travaille depuis une adresse personnelle, une domiciliation professionnelle (~20€/mois) résout le problème.
- **[HYPOTHÈSE : le formulaire d'inscription `/register` comporte une case opt-in email non pré-cochée]** — à vérifier dans le code. Une case pré-cochée invalide le consentement RGPD.
- **[HYPOTHÈSE : la Data Protection Assessment Meta for Developers n'a pas encore été soumise]** — standard pour les apps Graph API en début de déploiement. À vérifier sur developers.meta.com.

---

## 8. Handoff structuré

---
**Handoff → @fullstack (Phase 5 — implémentations code bloquantes)**

Fichiers produits : `/docs/legal/ceo-dpa-audit-s3.md`

Décisions prises :
- Resend DPA = bloquant pré-S3 (action Thomas requise, mais l'implémentation `enforceEmailFooter()` côté code est aussi bloquante)
- Footer RGPD obligatoire doit être injecté par le module Resend, pas par le CEO lui-même (red line 1 de ceo-legal-redlines.md confirmée)
- Vérification synchrone `User.emailOptOut` au moment de l'envoi confirmée
- RSS/email digest pour les sources Connectively/SourceBottle à implémenter (pas de scraper HTML direct)
- `CeoAuditLog` avec rétention 3 ans = obligation légale EU AI Act + RGPD art. 30

Points d'attention pour @fullstack :
- `enforceEmailFooter()` : middleware Resend à créer en P0 — si absent, l'email ne part pas (fail-safe, pas fail-open)
- `User.emailOptOut` : requête DB synchrone obligatoire au moment de l'envoi, pas au moment de la planification
- La case opt-in du formulaire `/register` doit être vérifiée — si pré-cochée → fix P0 immédiat (invalide le consentement)
- La Data Protection Assessment Meta developers.meta.com est une démarche admin Thomas, mais l'endpoint de réponse DM Instagram ne doit pas être activé avant confirmation

---
**Handoff → @orchestrator (décisions stratégiques requises)**

Deux décisions non résolues à soumettre à Thomas :

1. **Scraping vs RSS** : confirmer que le module backlinks CEO utilisera uniquement des flux RSS/email digest/Zapier pour alimenter les opportunités Connectively/SourceBottle — aucun scraper HTML direct.

2. **Adresse postale footer email** : la LCEN art. 6-III-1 exige une adresse physique dans chaque email commercial. Options : (a) adresse personnelle de Thomas, (b) domiciliation professionnelle (~20€/mois), (c) case "Marrant — Paris, France" suffisante pour les emails B2C non-réglementés (risque faible mais non nul). Décision Thomas requise avant activation footer.

---
