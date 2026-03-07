# Variables d'environnement — deviensmarrant.fr

## Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@host:5432/deviensmarrant` |
| `NEXTAUTH_URL` | URL du site (base) | `https://deviensmarrant.fr` |
| `NEXTAUTH_SECRET` | Secret pour signer les JWT | (générer avec `openssl rand -base64 32`) |

## Authentification Google OAuth

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | ID client Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth |

## Claude API (Anthropic)

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Clé API Anthropic |

## Stripe

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `STRIPE_PREMIUM_PRICE_ID` | ID du prix Stripe pour l'abonnement premium |

## YouTube Data API

| Variable | Description |
|----------|-------------|
| `YOUTUBE_API_KEY` | Clé API YouTube Data v3 |
