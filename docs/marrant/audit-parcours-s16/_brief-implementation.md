# Brief commun — Implémentation des recos de l'audit parcours s16 (07/10/2026)

Thomas : « Je suis tes recos, implémente tout sauf D3. » Source : `docs/marrant/audit-parcours-s16.md` §4 (recos 1 à 20) et §5 (D1 à D8). Rapports détaillés (preuves fichier:ligne) : `docs/marrant/audit-parcours-s16/*.md`. Décisions non re-questionnables : voir `_brief.md` du même dossier + `docs/founder-preferences.md`.

## Décisions appliquées

- D2 : la procédure de remboursement de Thomas est inconnue → le code doit être sûr dans les deux cas (résilier chez Stripe de façon idempotente : un abonnement déjà résilié ne doit pas faire d'erreur).
- D3 EXCLU : ne pas toucher SIREN, n° de TVA, forme juridique, adresse, médiateur. Tout le reste de la reco 18 (hébergeur Cloudflare, politique de confidentialité à jour, clause « tribunaux de Paris ») est à faire.
- D4 : le mot de l'offre est **« Premium »** partout (plus « accès complet »).
- D5 : l'annuel affiche **les deux** : « plus de 3 mois offerts » et « 10,89 € économisés » (jamais « 4 mois »).
- D6 : **tutoiement** partout, pages légales et bouton de résiliation compris (sauf formule légale imposée mot pour mot).
- D7 : environnement Stripe de test → besoin d'une clé `sk_test` fournie par Thomas ; ne pas bloquer dessus.
- D8 : appli mobile (Capacitor, RevenueCat, `api/iap`) HORS PÉRIMÈTRE : ne rien y changer, mais ne rien casser.

## Règles de travail (3 agents @fullstack en parallèle dans le même dépôt)

1. **Propriété des fichiers** : chaque agent ne modifie QUE les fichiers de son lot (liste dans son prompt). Besoin d'un changement dans le lot d'un autre → l'écrire dans la section « Demandes aux autres lots » de ton rapport, ne pas le faire.
2. **Textes client** : la règle P0 du projet impose de calibrer les nouveaux textes avec Thomas (étalons, en cours par @copywriter). Donc tout NOUVEAU texte visible par le client (UI, e-mails, erreurs) va dans un fichier de textes de ton lot (`apps/web/src/config/textes/<lot>.ts`), en version provisoire simple, tutoyée, sans tiret cadratin, marquée `// PROVISOIRE s16, étalon à valider`. Les textes existants validés (étalons s15) ne bougent pas, sauf défaut listé dans l'audit.
3. **Pas d'écriture en prod** (base, Stripe live, Resend, Cloudflare) : réservé à @infrastructure. Pas de déploiement. **Pas de commit** : l'orchestrateur committe après vérification globale.
4. **Vérifications avant de rendre** : `cd apps/web && npx tsc --noEmit -p tsconfig.build.json`, ESLint sur tes fichiers modifiés, jest sur tes zones + nouveaux tests pour chaque correctif. **Pas de `npm run build`** (dossier `.next` partagé : l'orchestrateur le lance une fois à la fin).
5. Schéma Prisma et migrations : **lot A uniquement** (convention du projet : migration SQL idempotente `IF NOT EXISTS`, voir `apps/web/prisma/migrations/` et la tâche de démarrage qui les applique).
6. Alertes admin (`admin-alerts.ts`) : **lot A uniquement**. Les autres lots appellent `recordAdminAlert` avec une clé existante ou demandent une clé au lot A via leur rapport.
7. Zéro tiret cadratin dans le client-facing, UTF-8, tutoiement, signature e-mail « L'Équipe Deviens Marrant », jamais de mention IA.

## Rapport de fin (≤ 80 lignes) : `docs/marrant/audit-parcours-s16/impl-<lot>.md`

Recos traitées (numéro → ce qui a changé, fichiers), tests ajoutés et résultats, textes provisoires créés (clé → texte), actions prod nécessaires (pour @infrastructure ou Thomas), demandes aux autres lots, ce qui reste.

ANTI-TIMEOUT : écris le fichier IMMÉDIATEMENT après lecture. Write d'abord, Edit ensuite.
