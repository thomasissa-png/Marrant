# Onboarding mobile — Specs UX

> Specs détaillées du flow d'onboarding mobile-first (5 écrans).
> Composant React : `apps/web/src/components/mobile/OnboardingFlow.tsx`

## Objectif UX

Convertir un téléchargement en utilisateur engagé en 60 secondes, sans friction d'auth, en détectant le persona dès l'ouverture pour personnaliser les push et les CTA.

## Flow global

```
Launch app → Splash 2s → Écran 1 Welcome
            → Écran 2 Quiz persona (2 questions, ~15s)
            → Écran 3 Permission push (opt-in)
            → Écran 4 Premier daily content (cadeau)
            → Écran 5 Login soft (skippable)
            → Home
```

## Écran 1 — Welcome

- **Visuel** : émoji 🎤 grand format (96px), fond gradient violet
- **H1** : "Tu vas devenir le pote drôle."
- **Sous-titre** : "Vannes du jour, conseils stand-up, exos de répartie. Bref, t'es bien tombé."
- **CTA** : "On y va" (bouton plein largeur, violet)
- **Pas de skip** : single CTA pour focus
- **Métrique** : `onboarding_started`

## Écran 2 — Quiz persona (2 questions)

### Question 1 — Tranche d'âge

- **H1** : "T'as quel âge en gros ?"
- **Options** :
  - 🎓 "Moins de 22 ans" → score Yanis +2
  - 💼 "Entre 22 et 30 ans" → score Sophie +2
  - 🧘 "Plus de 30 ans" → score Marc +2

### Question 2 — Objectif

- **H1** : "Pour quoi tu veux progresser ?"
- **Options** :
  - 🥊 "Pour avoir de la répartie en soirée" → Yanis +1
  - 💬 "Pour alimenter mes conversations" → Sophie +1
  - ✨ "Pour reprendre confiance / la légèreté" → Marc +1

### Détection persona

```typescript
function detectPersona(age, goal): "YANIS" | "SOPHIE" | "MARC" {
  if (age === "u22" || goal === "repartie") return "YANIS";
  if (age === "22-30" || goal === "convers") return "SOPHIE";
  return "MARC";
}
```

### Stockage

- `localStorage.setItem("detectedPersona", persona)`
- Envoyé en analytics : `onboarding_completed` + persona

## Écran 3 — Permission push

- **Visuel** : émoji 🔔 + texte personnalisé selon persona

| Persona | Message |
|---|---|
| Yanis | "Yo, on va te faire briller en soirée 🍻" |
| Sophie | "On va remplir ta machine à café d'anecdotes ☕" |
| Marc | "On va t'aider à retrouver ta légèreté 😌" |

- **Sous-titre** : "On t'envoie une vanne par jour à 9h. Pile au bon moment pour la sortir au boulot, en cours ou à la machine à café."
- **CTA primaire** : "Allez, je veux ma vanne quotidienne"
  - Déclenche `PushNotifications.requestPermissions()` Capacitor
  - Si granted → `PushNotifications.register()` puis POST `/api/push/register-token`
  - Métrique : `push_opted_in`
- **CTA secondaire** : "Plus tard"
  - Métrique : `push_dismissed`
  - Pas de blocage — passage à l'écran 4

### Best practice push iOS

- Demander la permission au bon moment (après valeur reçue, pas dès le launch)
- Expliquer le bénéfice AVANT le prompt OS natif (sinon refus à 50%+)
- Une seule chance — si refus, l'utilisateur doit aller dans Réglages

## Écran 4 — Premier daily content

- **Visuel** : émoji 🎁
- **H1** : "Première vanne offerte"
- **Sous-titre** : "On a sélectionné une vanne pile pour toi. Pas besoin de compte, c'est cadeau."
- **CTA** : "Découvrir"
- **Logique** : pré-charge le daily content du jour pour affichage immédiat à l'écran suivant

## Écran 5 — Login soft

- **Visuel** : émoji 💾
- **H1** : "Garde tes favoris"
- **Sous-titre** : "Crée un compte (gratos) pour sauvegarder tes vannes préférées et reprendre tes parcours sur tous tes appareils."
- **CTA primaire** : "Créer mon compte" → redirect `/auth/register`
- **CTA secondaire** : "Plus tard, laisse-moi explorer" → redirect `/`

### Important

- **Pas de paywall ici** — onboarding ≠ conversion
- La conversion Premium se déclenche plus tard, sur friction concrète (limite de favoris atteinte, parcours bloqué)
- Le persona stocké en localStorage permettra de personnaliser le timing du paywall

## Différences vs onboarding web

| Dimension | Web | Mobile |
|---|---|---|
| Nombre d'écrans | 1 modal sur la home | 5 écrans plein écran |
| Auth | Optionnelle, modal au besoin | Reportée à la fin |
| Persona detection | Quiz humour 7 questions | Quiz court 2 questions |
| Push | N/A | Opt-in central |
| Cookie banner | RGPD oui | Non (pas de cookies tiers) |

## Métriques

- `onboarding_started` (écran 1)
- `quiz_q1_answered` (avec valeur)
- `quiz_q2_answered` (avec valeur)
- `onboarding_completed` (avec persona détecté)
- `push_opted_in` ou `push_dismissed`
- `onboarding_login_chosen` ou `onboarding_skip_chosen`

## États UI

| Cas | Comportement |
|---|---|
| Launch first time | Splash → écran 1 |
| Launch subsequent | Skip onboarding → home directe |
| Quiz incomplet (back/kill app) | Reprendre à l'écran courant via localStorage |
| Push permission denied | Continue normalement, pas de relance immédiate |
| Pas de réseau | Onboarding fonctionne 100% local ; le call /api/push/register-token retry au retour réseau |

## Critères de validation

- [ ] L'onboarding s'affiche au premier launch et UNIQUEMENT au premier launch
- [ ] Le persona détecté est stocké en localStorage et persiste après kill de l'app
- [ ] La permission push iOS/Android est demandée APRÈS l'écran 3 (pas avant)
- [ ] L'utilisateur peut skipper le login à l'écran 5 et accéder à l'app sans compte
- [ ] Si push opted-in, le token est envoyé au serveur dans les 5 secondes
- [ ] Aucun message ne mentionne le prix Premium ou les CTAs paywall

## Handoff → @orchestrator

- **Fichier produit** : `docs/mobile/onboarding-mobile.md` (le composant `OnboardingFlow.tsx` a été produit en Lot 1)
- **Décisions clés** :
  - 5 écrans, ~60s pour compléter
  - Persona détecté en 2 questions seulement (vs 7 sur le web)
  - Permission push en écran 3 (après value, avant l'app)
  - Auth différée à l'écran 5, skippable
- **Points d'attention** :
  - Tester le flow sur un device iOS réel pour valider le timing du prompt push (pas avant écran 3)
  - Persona peut être ajusté plus tard via Compte > Mon profil
- **Prochaines étapes** : tests E2E mobile (Lot 2 qa)
