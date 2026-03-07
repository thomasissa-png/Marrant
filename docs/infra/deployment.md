# Guide de déploiement — deviensmarrant.fr

## Prérequis

- Node.js 18+
- PostgreSQL 15+
- Compte Replit (pour hébergement)
- Compte Stripe (pour paiements)
- Clé API Anthropic (pour IA)
- Clé API YouTube Data v3

## Déploiement local

```bash
# 1. Installer les dépendances
cd apps/web && npm install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Configurer les variables d'environnement dans .env

# 4. Générer le client Prisma
npx prisma generate

# 5. Pousser le schéma en BDD
npx prisma db push

# 6. Lancer le seed
npm run db:seed

# 7. Démarrer le serveur de développement
npm run dev
```

## Déploiement Replit

1. Créer un Repl Node.js
2. Configurer les Secrets Replit avec toutes les variables d'environnement
3. Le fichier `.replit` configure automatiquement le build et le start
4. Utiliser Replit Deployments pour le déploiement production

## Base de données

- En développement : PostgreSQL local ou Neon.tech (gratuit)
- En production : PostgreSQL Replit ou Neon.tech (plan pro)

## Mobile (Expo EAS)

```bash
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Se connecter
eas login

# 3. Build iOS
cd apps/mobile && eas build --platform ios

# 4. Build Android
eas build --platform android

# 5. Soumettre aux stores
eas submit --platform ios
eas submit --platform android
```
