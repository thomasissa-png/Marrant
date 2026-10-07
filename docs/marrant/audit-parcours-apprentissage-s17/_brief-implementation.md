# Brief commun — Implémentation des recos de l'audit des parcours d'apprentissage s17 (07/10/2026)

Thomas : « Je suis toutes les reco sans exception. » Source : `docs/marrant/audit-parcours-apprentissage-s17.md` §4 (recos 1 à 19) et §5 (D1 à D8). Rapports détaillés avec preuves fichier:ligne : `docs/marrant/audit-parcours-apprentissage-s17/{ux,qa,fullstack,copywriter,seo,product-manager,data-analyst}.md`. Décision inscrite : dernière ligne de `docs/founder-preferences.md`.

## Décisions appliquées

- D1 : le visiteur ouvre les étapes 2 et suivantes **en aperçu** (titre, ce qu'on apprend `moduleDetail`, format, durée estimée, texte du blocage validé en s16, bouton d'abonnement avec `src=parcours-apercu`), sans ordre imposé pour lui. **Jamais** le contenu payant (conseil complet, quiz, vidéos) dans le HTML ni l'API pour un non-Premium. L'abonné garde l'ordre conseillé.
- D2 : rythme **doux** : « prochaine étape conseillée le … » (7 jours après la précédente validation), rien n'est bloqué.
- D3 : streak compté sur la **pratique** (validation d'étape, quiz d'étape terminé), plus sur la connexion.
- D4 : les 5 vannes de l'étape **affichées dans l'étape** (vannes actives seulement ; identifiants introuvables 82, 85, 180 à remplacer par des vannes actives de même technique, liste dans le rapport).
- D5 : réécriture des contenus après étalons validés par Thomas (en cours par @copywriter) : les agents de code n'écrivent AUCUN contenu pédagogique.
- D6 : parcours Storytelling puis Pro (specs @product-manager en cours ; rien à coder maintenant).
- D7 : rappel e-mail des parcours **uniquement sur demande** (désactivé par défaut, jour choisi par la personne, lien de désabonnement), avis @legal en cours.
- D8 : les 4 titres de `seo.md` §6 ; « première étape gratuite », jamais « cours gratuit ».
- Pas de certificat. « 15 à 20 min/semaine » inchangé. Prix, « 1 500+ membres », humoristes : intouchables.

## Règles de travail (3 agents @fullstack en parallèle dans le même dépôt)

1. **Propriété des fichiers** : chaque agent ne modifie QUE les fichiers de son lot. Besoin d'un changement ailleurs → section « Demandes aux autres lots » du rapport, ne pas le faire.
2. **Textes client** : tout NOUVEAU texte visible (UI, e-mails, erreurs) va dans `apps/web/src/config/textes/parcours.ts` (lot B) ou `apps/web/src/config/textes/parcours-emails.ts` (lot A), version provisoire simple, tutoyée, sans tiret cadratin, marquée `// PROVISOIRE s17, étalon à valider`. Les étalons de @copywriter remplaceront ces valeurs.
3. **Pas d'écriture en prod** (base, Umami, Resend, Cloudflare), **pas de déploiement, pas de commit** : l'orchestrateur committe après vérification globale.
4. **Vérifications avant de rendre** : `cd apps/web && npx tsc --noEmit -p tsconfig.build.json`, ESLint sur tes fichiers, jest sur tes zones + nouveaux tests pour chaque correctif (dont les cas visiteur et parcours de 4 à 6 étapes). **Pas de `npm run build`** (dossier `.next` partagé : l'orchestrateur le lance à la fin).
5. Schéma Prisma, migrations, `admin-alerts.ts`, `auth.ts` : **lot A uniquement** (migration SQL idempotente `IF NOT EXISTS`, comme les migrations existantes et la tâche de démarrage qui les applique).
6. Événements Umami : noms et propriétés EXACTS de `data-analyst.md` §5 (kebab-case français, aucun renommage d'événement existant).
7. Zéro tiret cadratin côté client, UTF-8, tutoiement, signature « L'Équipe Deviens Marrant », jamais de mention IA. Appli mobile (Capacitor) : ne rien casser.

## Lots

- **Lot A, serveur et données** : `prisma/schema.prisma` + migration (table des dates par étape `UserPathStepCompletion` avec contrainte d'unicité, préférence de rappel), `app/api/parcours/[id]/progress/route.ts` (renvoyer la fiche APRÈS la date de fin, double validation impossible, ordre conseillé pour l'abonné, limite d'essais fiable sous Workers, alerte sur erreur), `lib/auth.ts` (streak sur la pratique), niveaux (recalcul à la validation, « Comique » et « Légende » ajoutés au code), `lib/admin-alerts.ts` (3 alertes de `data-analyst.md` §7), `lib/analytics/weekly-parcours.ts` + raccord au rapport du lundi (requêtes §6, exclusion des comptes de test via une variable d'environnement de liste d'e-mails), rappel e-mail sur demande (job + gabarit, désactivé par défaut), correction de la vidéo MàC 3 (`tpIOLzv11qo`) dans le seed ET en base via tâche de démarrage idempotente, vannes 82/85/180, alignement de `conseils-seed.json` sur les textes en base (FS-12), passage minuté de la vidéo de Confiance 6 si @copywriter le fournit (sinon laisser).
- **Lot B, interface des parcours** : `components/parcours/*`, `app/(dashboard)/parcours/**` (dont page d'erreur, chargement, 404 propre), `lib/parcours-*.ts`, `app/api/parcours/by-slug/**` et `app/api/parcours/route.ts`, `lib/umami.ts`, `config/textes/parcours.ts`. Recos A1, A2 (côté écran), B4 (événements côté navigateur), D9 vannes dans l'étape, liens vers les fiches conseil et vidéo citées, sous-titres H2, F17 accessibilité du quiz (annonce vocale, pas que la couleur, explication), bouton « réessayer », gain d'XP visible assez longtemps, D8 titres + metas + aperçu de partage (og/twitter) + JSON-LD dédoublonné (`@id`, prix non écrit en dur), barre de progression masquée au visiteur, rythme doux affiché, suite de fin non circulaire + lien carnet, emplacement des 3 boutons de retour d'exercice (textes provisoires).
- **Lot C, entrées et maillage** : `components/blog/*` (maillage et CTA vers l'étape 1 du bon parcours, `?src=`), `components/home/*` (bouton secondaire « Lire gratuitement l'étape 1 », « Reprendre ton parcours » pour l'abonné), `app/(dashboard)/profil/**` (parcours en cours en avant), `components/onboarding/humor-quiz.tsx` (recommande un parcours), pages fiches `app/(dashboard)/{vannes,conseils,videos}/**` (lien vers le parcours qui les utilise), `app/(dashboard)/abonnement/**` et `components/premium/*` (lien vers un parcours ; promesse « vannes » alignée), `app/llms*.txt`, `app/sitemap.ts` (lastmod réels des parcours). FAQ : la série et l'XP décrites telles qu'elles fonctionnent.

## Rapport de fin (≤ 80 lignes) : `docs/marrant/audit-parcours-apprentissage-s17/impl-lot-<a|b|c>.md`

Recos traitées (numéro → changement, fichiers), tests ajoutés et résultats, textes provisoires (clé → texte), actions prod nécessaires (migration, variable d'environnement, Thomas), demandes aux autres lots, ce qui reste.

ANTI-TIMEOUT : écris le fichier IMMÉDIATEMENT après lecture. Write d'abord, Edit ensuite.
