# Politique de confidentialité — Application mobile Deviens Marrant

> Version mobile, applicable aux utilisateurs des apps iOS et Android.
> Pour les utilisateurs du site web, se référer à la politique de confidentialité web.
> Dernière mise à jour : 03/05/2026

## 1. Responsable du traitement

Le responsable du traitement des données personnelles est **[Alex — fondateur, statut juridique à confirmer par Thomas]**.

Email DPO / contact RGPD : alex@deviens-marrant.fr

## 2. Données personnelles collectées

### 2.1 Données fournies directement par l'utilisateur

| Donnée | Finalité | Base légale | Conservation |
|---|---|---|---|
| Email | Création de compte, communication | Exécution contrat | Durée du compte + 3 ans |
| Nom (optionnel) | Personnalisation | Consentement | Durée du compte |
| Mot de passe (haché) | Authentification | Exécution contrat | Durée du compte |
| Préférences (favoris, parcours suivis) | Personnalisation expérience | Exécution contrat | Durée du compte |
| Quiz d'humour (résultats) | Détection persona, recommandations | Consentement | Durée du compte |

### 2.2 Données collectées automatiquement

| Donnée | Finalité | Base légale | Conservation |
|---|---|---|---|
| Push token (FCM Android / APNs iOS) | Envoi notification quotidienne | Consentement (opt-in) | Tant que l'app est installée + 30 jours après désinstallation |
| Historique des achats IAP | Vérification abonnement Premium | Exécution contrat | Durée du compte + 10 ans (obligation comptable) |
| Logs techniques (crash, erreurs) | Diagnostic | Intérêt légitime | 90 jours |
| App User ID anonyme (RevenueCat) | Lien achat ↔ compte | Exécution contrat | Durée du compte |

### 2.3 Données NON collectées en V1

- ❌ IDFA / Advertising ID (pas de tracking publicitaire)
- ❌ Géolocalisation
- ❌ Contacts, photos, micro
- ❌ Données de santé ou financières (au-delà des reçus IAP gérés par Apple/Google)
- ❌ Cookies tiers (pas de cookies publicitaires)

## 3. Push notifications

### 3.1 Finalité

Envoi quotidien (à 9h heure locale) de la "vanne du jour" pour entretenir la pratique d'humour des utilisateurs.

### 3.2 Recueil du consentement

- **iOS** : double opt-in obligatoire :
  1. Écran d'onboarding mobile : explication de l'intérêt + toggle utilisateur
  2. Si toggle ON → prompt système iOS natif (consentement OS)
- **Android** : opt-in via toggle onboarding + permission `POST_NOTIFICATIONS` (Android 13+)

### 3.3 Modalités de retrait

À tout moment :
- Paramètres OS (iOS : Réglages > Notifications > Deviens Marrant / Android : Paramètres > Notifications)
- Toggle interne dans l'app : Compte > Notifications

### 3.4 Données de routage

Le push token est stocké sur nos serveurs (Replit + DB PostgreSQL) chiffré au repos. Il est transmis à Firebase (Android) ou APNs (iOS) au moment de l'envoi du push, jamais conservé par ces tiers au-delà de la livraison.

## 4. Achats In-App (IAP)

### 4.1 Données collectées lors d'un achat

- Receipt d'achat (Apple ou Google) — token cryptographique de validation
- Plan choisi (mensuel / annuel)
- Statut abonnement (actif / expiré / résilié)

### 4.2 Sous-traitants

- **Apple Inc.** (iOS) : facturation, validation receipt, gestion abonnement
- **Google LLC** (Android) : facturation, validation, gestion abonnement
- **RevenueCat Inc.** (cross-platform) : agrégation receipts, webhook serveur, sync DB
- **Notre serveur Replit** : stockage statut abonnement + email pour matching compte ↔ achat

### 4.3 Webhook RevenueCat

Lorsqu'un événement IAP se produit (achat, renouvellement, résiliation), RevenueCat appelle notre webhook `/api/iap/revenuecat-webhook` qui met à jour le champ `user.plan` dans notre base de données.

Aucune donnée bancaire n'est jamais reçue par Deviens Marrant. Les paiements sont gérés exclusivement par Apple et Google.

## 5. Utilisation de l'IA générative

L'Application affiche du contenu généré par IA (vannes, conseils, articles) via Anthropic Claude.

### 5.1 Données envoyées à Anthropic

- Prompts système (incluant les personas de référence Yanis/Sophie/Marc — anonymes, pas de données utilisateur réelles)
- **AUCUNE donnée personnelle utilisateur** n'est transmise à Anthropic. La génération de contenu est globale (pas de personnalisation par user).

### 5.2 Conformité EU AI Act

Conformément à l'EU AI Act, le contenu généré par IA est marqué `generatedByAI: true` en base. Une mention "Contenu généré et validé par IA" est affichée sur les contenus générés (badge subtil).

## 6. Sous-traitants

| Sous-traitant | Finalité | Localisation données | DPA |
|---|---|---|---|
| Apple Inc. | Distribution app, IAP iOS | USA | Apple Developer Agreement |
| Google LLC | Distribution Android, FCM, Play Billing | USA + UE | Google Play DPA + Firebase DPA |
| RevenueCat Inc. | Abonnements cross-platform | USA | DPA RevenueCat |
| Replit Inc. | Hébergement backend | USA + UE | DPA Replit |
| Resend | Emails transactionnels | USA + UE | DPA Resend |
| Anthropic | Génération contenu IA | USA | DPA Anthropic |

Tous les transferts hors UE sont encadrés par les Clauses Contractuelles Types (CCT) de la Commission européenne.

## 7. Tes droits (RGPD)

Tu disposes des droits suivants, exerçables à tout moment depuis Compte > Données personnelles :

- **Droit d'accès** (Art. 15) : export JSON de tes données
- **Droit de rectification** (Art. 16) : édition de ton profil
- **Droit à l'effacement** (Art. 17) : bouton "Supprimer mon compte"
- **Droit à la limitation** (Art. 18) : nous contacter à alex@deviens-marrant.fr
- **Droit à la portabilité** (Art. 20) : export JSON
- **Droit d'opposition** (Art. 21) : toggle email marketing, push notif

### Délai de réponse

Toute demande exercée par email reçoit une réponse sous 30 jours (extensible à 60 jours pour les demandes complexes).

### Réclamation

Tu peux à tout moment introduire une réclamation auprès de la CNIL :
- https://www.cnil.fr/fr/plaintes
- 3 Place de Fontenoy, 75007 Paris

## 8. Sécurité

### 8.1 Mesures techniques

- Chiffrement HTTPS (TLS 1.3) pour toutes les communications
- Mot de passe haché (bcrypt, salt rounds 12)
- JWT signé pour l'authentification
- Cookies `SameSite=None; Secure; HttpOnly`
- Headers HSTS, CSP, X-Frame-Options
- Backups DB chiffrés

### 8.2 Mesures organisationnelles

- Accès aux données limité au fondateur
- Sous-traitants sélectionnés selon leur conformité RGPD
- Journal des accès aux données

### 8.3 Notification en cas de violation

En cas de violation de données personnelles affectant tes droits, tu seras notifié par email dans les 72 heures (Art. 33-34 RGPD).

## 9. Cookies et traceurs

L'app mobile **ne dépose aucun cookie tiers**.

L'analytics interne (Umami, optionnel) est self-hosted, ne suit pas l'utilisateur cross-app/site, et n'utilise pas l'IDFA. Aucun consentement cookie banner n'est requis.

## 10. Mineurs

L'Application est accessible à partir de **13 ans**. Pour les utilisateurs entre 13 et 15 ans, le consentement parental est requis (article 8 RGPD).

L'Application n'est pas destinée aux enfants de moins de 13 ans.

## 11. App Tracking Transparency (iOS)

Conformément aux exigences Apple iOS 14.5+, Deviens Marrant **ne demande pas** de permission ATT car nous ne suivons pas l'utilisateur à travers les apps et sites tiers.

## 12. Modifications

Cette politique peut être modifiée. La version en vigueur est toujours accessible depuis l'app (Compte > Confidentialité) et sur https://deviens-marrant.fr/confidentialite-mobile.

Toute modification substantielle te sera notifiée par email ou push 30 jours avant entrée en vigueur.

## 13. Contact

Pour toute question :
- Email : alex@deviens-marrant.fr
- Adresse : [à compléter par Thomas]

---

**Date de prise d'effet : 03/05/2026**
