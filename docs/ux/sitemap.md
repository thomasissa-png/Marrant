# Sitemap — deviensmarrant.fr

## Pages publiques
- `/` — Home (hero + blague/conseil du jour)
- `/login` — Connexion
- `/register` — Inscription
- `/forgot-password` — Mot de passe oublié

## Pages connectées (dashboard)
- `/` — Home avec blague/conseil du jour + streak + use-case tags personas
- `/blagues` — Section blagues (filtres, recherche, pagination)
- `/conseils` — Section conseils (niveaux, catégories, progression)
- `/videos` — Section vidéos stand-up (filtres, embed YouTube)
- `/parcours` — Parcours guidés structurés (progression pas à pas)
- `/favoris` — Favoris personnels (blagues, conseils, vidéos)
- `/profil` — Profil utilisateur (progression, stats, abonnement, recommandations « Prochaine étape »)
- `/onboarding` — Quiz "Découvre ton profil humour" (objectif + contexte + niveau)

## Pages légales
- `/mentions-legales` — Mentions légales
- `/cgu` — Conditions générales d'utilisation
- `/confidentialite` — Politique de confidentialité

## API Routes
- `/api/auth/*` — Authentification NextAuth
- `/api/jokes` — CRUD blagues
- `/api/tips` — CRUD conseils
- `/api/videos` — CRUD vidéos
- `/api/daily` — Contenu du jour
- `/api/favorites` — Favoris utilisateur
- `/api/ai` — Génération IA (Claude)
