# Captures et contrôles locaux des parcours (s17)

Scripts de @qa utilisés pour les tours 1 à 3 de la relecture visuelle (design et UX) des parcours d'apprentissage, sauvegardés depuis le scratchpad de la session s17 (éphémère).

- `refaire-captures.sh <dossier-sortie> [--smoke] [--sans-build] [--seul <script.js>]` : recrée une base Postgres LOCALE jetable (seed + vannes + comptes de test), build l'app, la lance avec un environnement vidé de tout secret de prod (`cleanenv.sh` ; arrêt si une variable NEON/Stripe/Resend/etc. est présente), joue `local-visiteur.js`, `local-premium.js`, `local-etats.js`, axe-core, la suite smoke `@s16` (sans `@achat`), écrit `index.md` (`gen-index.js`), puis arrête tout et supprime la base.
- **À adapter avant de relancer** : les chemins absolus vers l'ancien scratchpad (`/tmp/claude-0/...`) dans `refaire-captures.sh`, `local-common.js`, `gen-index.js`, `probe-profil.js`, `pw-smoke.config.ts` ; la fixture des vannes (`fixtures-vannes-actives.json`) = `docs/content/vannes-actives-s17.json`.
- **Règle de sécurité** : jamais contre la prod (les tâches de démarrage écrivent en base). Navigateur limité à localhost, Umami intercepté.
- Prochain tour attendu : tour 4 dans `docs/qa/captures-parcours-apprentissage-s17/iter-4/` (voir le mémo de reprise de `project-context.md`).
