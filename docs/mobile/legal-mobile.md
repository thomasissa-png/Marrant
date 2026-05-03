# Audit conformité mobile — Apple / Google / RGPD

> Audit produit en session 7 (autopilote mobile).
> Objectif : checklist de conformité avant soumission TestFlight + Google Play Internal.

## 1. Apple App Store Review Guidelines

### Section 3.1.1 — In-App Purchase (CRITIQUE)

> "If you want to unlock features or functionality within your app, you must use in-app purchase."

**Statut Deviens Marrant** : ✅ Conforme — l'abonnement Premium mobile passe par Apple IAP via RevenueCat.

**Règles à respecter** :
- ❌ Pas de bouton "Acheter sur le web" / "Tarif moins cher en ligne"
- ❌ Pas de webview Stripe pour acheter le Premium dans l'app
- ❌ Pas de mention du prix web dans l'app mobile
- ✅ Mention IAP claire : "Abonnement géré par Apple. Annulation dans Réglages > Apple ID > Abonnements"
- ✅ Restore Purchases obligatoire (bouton accessible depuis l'app)

**Risque rejet majeur** : si Reviewer Apple détecte une référence au prix web ou un lien externe vers le checkout Stripe → rejet 3.1.1. Mitigation : `Capacitor.isNativePlatform()` masque toutes les CTAs Stripe.

### Section 4.0 — Design

- **4.2 Minimum Functionality** : l'app doit faire plus qu'un simple wrapper du site web. ✅ Couvert par : push notif quotidienne, partage natif, persistence offline, onboarding mobile-first.
- **4.2.3** : si l'app reflète principalement un site web, elle doit fournir une expérience native enrichie. ✅ Couvert par les features mobile-spécifiques.

### Section 5.1 — Privacy

- **5.1.1 (i)** : Privacy Policy obligatoire et accessible depuis l'app. ✅ Voir `privacy-mobile.md` + lien permanent dans menu Compte.
- **5.1.1 (iv)** : si collecte de données → consentement explicite. ✅ Push opt-in avec toggle clair (RGPD + iOS prompt natif).
- **5.1.2 Data Use and Sharing** : mention explicite des sous-traitants (RevenueCat, Firebase, Anthropic).

### Section 5.1.4 — Kids Category
- ❌ **Non applicable** — Deviens Marrant ne cible pas les enfants (15+ minimum en raison de l'humour). Rating App Store : **12+** (humour suggestif occasionnel).

### Privacy Nutrition Labels (App Store Connect)

À déclarer :
- **Données liées à l'utilisateur** : Email, Nom, Identifiant utilisateur (User ID NextAuth), Historique d'achats (IAP receipts)
- **Données NON liées à l'utilisateur** : analytics agrégés (si Umami activé en mobile)
- **Tracking** : aucun (Umami self-hosted, pas de tracking cross-app)

## 2. Google Play Policies

### Subscriptions Policy

- ✅ Renouvellement automatique mentionné explicitement
- ✅ Bouton "Gérer l'abonnement" qui pointe vers Google Play Subscriptions (deeplink `https://play.google.com/store/account/subscriptions?package=fr.deviensmarrant.app`)
- ✅ CGV mobile précise les modalités (voir `cgv-mobile.md`)
- ❌ Pas de période d'essai en V1 (à éviter, complexifie compliance — V2 si pertinent)

### Permissions Policy

- **POST_NOTIFICATIONS** (Android 13+) : justifiée par push notif quotidienne, opt-in obligatoire en onboarding
- **Aucune permission sensible** demandée (pas de localisation, pas de contacts, pas de caméra)

### Data Safety Form (à remplir dans Play Console)

| Catégorie | Donnée collectée | Partagée | Optionnelle | Finalité |
|---|---|---|---|---|
| Personal info | Email | Non | Non (compte) | Compte utilisateur |
| Personal info | Nom | Non | Oui | Personnalisation |
| App activity | Interactions in-app | Non | Non | Analytics |
| App info | Crash logs | Oui (RevenueCat) | Non | Diagnostic IAP |
| Device IDs | Push token (FCM) | Oui (Firebase) | Oui | Push notif |
| Financial info | IAP transactions | Oui (RevenueCat) | Non | Vérification abonnement |

**Chiffrement en transit** : ✅ Oui (HTTPS uniquement)
**Possibilité de demander la suppression des données** : ✅ Oui (page Compte > Supprimer mon compte)

## 3. RGPD — Conformité push + données mobile

### Push notifications

- **Base légale** : consentement (article 6.1.a RGPD)
- **Modalités de recueil** : opt-in explicite en onboarding (toggle "Recevoir la vanne du jour"), refus possible sans dégradation du service
- **Opt-out** : disponible à tout moment dans Paramètres > Notifications (renvoie vers settings OS si push système, et toggle interne pour le serveur)
- **Données collectées** : push token FCM/APNs uniquement, pas de profilage
- **Durée conservation token** : tant que l'utilisateur a l'app installée + 30 jours après désinstallation (purge auto si token invalide)

### App Tracking Transparency (iOS 14.5+)

**Statut** : ✅ Pas requis pour Deviens Marrant V1.

Justification : Umami self-hosted ne fait pas de cross-app/site tracking, pas d'IDFA, pas de fingerprinting. RevenueCat utilise un identifiant interne anonyme (App User ID) non lié à IDFA.

**Si Umami activé en mobile** : vérifier que les events ne contiennent pas d'IDFA. Sinon, ATT prompt obligatoire au premier launch.

### Droits utilisateur (Articles 15-22 RGPD)

Tous accessibles depuis Compte > Données personnelles :
- Accès (export JSON des données)
- Rectification (édition profil)
- Effacement (bouton "Supprimer mon compte" — irréversible)
- Portabilité (export JSON)
- Opposition (toggle email marketing, push notif)

### Sous-traitants RGPD (Article 28)

| Sous-traitant | Finalité | DPA signé |
|---|---|---|
| Apple Inc. | Distribution app, IAP | DPA Apple Developer Agreement |
| Google LLC | Distribution Android, FCM, Play Billing | DPA Google Play Developer + Firebase DPA |
| RevenueCat Inc. | Gestion abonnements cross-platform | DPA RevenueCat (à signer) |
| Firebase (Google) | Push notifications Android | Inclus DPA Google |
| Replit Inc. | Hébergement backend | DPA Replit |
| Resend | Emails transactionnels | DPA Resend |
| Anthropic | Génération contenu IA | DPA Anthropic |

## 4. Risques de rejet stores — Top 5

| # | Risque | Probabilité | Mitigation |
|---|---|---|---|
| 1 | **Apple 3.1.1** (mention prix web ou checkout Stripe en mobile) | Moyenne | Detection `Capacitor.isNativePlatform()` partout, audit avant chaque release |
| 2 | **Apple 4.2** (wrapper sans valeur native) | Faible | Push + share + offline + onboarding mobile-first apportent valeur |
| 3 | **Apple 5.1.1 (iv)** (push sans consentement) | Faible | Opt-in explicite documenté |
| 4 | **Google Play subscriptions** (cancel non accessible) | Faible | Bouton vers Play Subscriptions présent |
| 5 | **Data Safety mismatch** (déclaration vs réalité) | Moyenne | Form rempli en cohérence avec privacy-mobile.md, audit annuel |

## 5. Checklist soumission stores

### iOS (App Store Connect)

- [ ] Apple Developer account actif (99€/an) — **Last mile Thomas**
- [ ] App ID `fr.deviensmarrant.app` créé dans Apple Developer Portal
- [ ] Bundle Identifier configuré dans Xcode
- [ ] Privacy Policy URL (https://deviens-marrant.fr/confidentialite-mobile)
- [ ] Privacy Nutrition Labels remplis
- [ ] Age rating : 12+ (humour suggestif occasionnel)
- [ ] Screenshots 6.7" + 6.5" + 5.5" (3 tailles obligatoires)
- [ ] App Preview vidéo (optionnel mais recommandé)
- [ ] Description App Store FR + EN
- [ ] Keywords ASO (100 caractères)
- [ ] Catégorie primaire : Lifestyle / secondaire : Education
- [ ] IAP product ID configuré (`com.deviensmarrant.premium.monthly`)
- [ ] Tax & Banking infos remplis
- [ ] Test TestFlight interne avant submission

### Android (Google Play Console)

- [ ] Google Play Console account actif (25€ one-shot) — **Last mile Thomas**
- [ ] Package name `fr.deviensmarrant.app`
- [ ] Privacy Policy URL
- [ ] Data Safety form rempli (voir tableau §2)
- [ ] Content rating IARC : Teen
- [ ] Feature graphic 1024x500
- [ ] 8 screenshots (téléphone + tablette)
- [ ] Store description FR + EN
- [ ] In-app product configuré (`premium_monthly`)
- [ ] Signing key uploaded (Play App Signing recommandé)
- [ ] Test Internal Testing avant production

## Handoff → @orchestrator

- **Fichier produit** : `docs/mobile/legal-mobile.md`
- **Décisions clés** :
  - IAP obligatoire mobile (Apple 3.1.1) — décision Thomas validée
  - ATT iOS non requis V1 (Umami sans cross-tracking)
  - Rating 12+ iOS / Teen Android
  - 5 risques rejet identifiés avec mitigation
- **Points d'attention** :
  - DPA RevenueCat à signer par Thomas
  - Privacy Nutrition Labels + Data Safety form à compléter exactement comme documenté
  - Last mile : création comptes Apple Dev + Google Play Console
- **Prochaines étapes** : Lot 1 (impl IAP) + Lot 3 (review G1-G32) + last mile Thomas
