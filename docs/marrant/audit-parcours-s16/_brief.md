# Brief commun — Audit parcours utilisateurs s16 (07/10/2026)

Demande de Thomas : « se concentrer sur les parcours utilisateurs et leur expérience de connexion, achat, etc. S'assurer que tout fonctionne, que tout marche. Audit complet. Pour tout, une note sur dix. On décidera ensemble ensuite de ce qu'on doit implémenter ou changer. »

**AUDIT SEULEMENT** : aucune modification de code, de contenu, de config ni de `project-context.md`. Pas de commit (l'orchestrateur consolide et committe). Seul fichier à écrire : ton rapport.

## Contexte produit (à jour au 07/10/2026)

- Site : https://deviens-marrant.fr — Next.js (apps/web), servi par **Cloudflare Workers** (OpenNext, `apps/web/wrangler.jsonc`) depuis le 30/09 ; Replit en pause. Base Postgres Neon (Prisma). NextAuth 4 (email + mot de passe, Google). Stripe live. E-mails Resend. Analytics Umami (événements de funnel ajoutés le 05/10).
- Code des parcours : `apps/web/src/app/(auth)/` (login, register, forgot-password, reset-password, onboarding), `apps/web/src/app/(dashboard)/abonnement/` (+ `success/`), `(dashboard)/profil`, `(dashboard)/favoris`, `(dashboard)/carnet`, `apps/web/src/app/api/auth/*`, `apps/web/src/app/api/stripe/*` (checkout, webhook, verify-session, portal, status), `apps/web/src/app/api/iap`, `apps/web/src/app/api/user`, `apps/web/src/lib/` (auth, stripe, email…). Appli mobile Capacitor : `capacitor.config.ts`, `docs/mobile/`.
- Docs utiles : `docs/ux/audit-tunnel-premium-s14.md`, `docs/ux/user-flows.md`, `docs/copy/etalons-chemin-premium-s15.md`, `docs/marrant/audit-note-s15.md`, `REPLIT_ACTIONS.md` (journal des déploiements), `docs/founder-preferences.md`.

## Décisions de Thomas NON re-questionnables ([CHOIX UTILISATEUR])

- **Pas de compte gratuit** : parcours visiteur → Premium. Les visiteurs gardent tout ce qu'ils avaient (plafonds 10/3/3 sur les listes défilantes, fiches détail lisibles, contenu du jour, étape 1 des parcours, quiz, carnet, recherche). La création de compte ne sert plus qu'à l'abonnement. 11 anciens comptes FREE conservés.
- **Prix TTC** : Premium **2,99 €/mois**, annuel **24,99 €/an** (« plus de 3 mois offerts », jamais « 4 mois »). Abonnés de lancement à 0,99 € gardés à vie.
- **Rétractation** : remboursement 14 jours pour tous, pas de case de renonciation. Rappel L.215-1 par e-mail J-40 à J-32 pour l'annuel. Médiateur : obligatoire, adhésion à faire par Thomas.
- « 1 500+ membres / inscrits » reste sur le site (seule la formulation peut bouger). Humoristes cités : autorisés partout. Jamais de mention IA dans le client-facing.
- Étalons du chemin vers Premium validés : `docs/copy/etalons-chemin-premium-s15.md` (1.2, 2.1, 3.1 + 3.2c, 4.1, 5.2).

## Parcours dans le périmètre

- **J1 Découverte → mur** : visiteur qui atteint un plafond / une porte Premium, comprend l'offre.
- **J2 Achat** : /abonnement → création de compte (e-mail + mot de passe ou Google) → Stripe Checkout (mensuel / annuel) → retour /abonnement/success → Premium effectif partout.
- **J3 Connexion** : login e-mail, Google, session persistante, déconnexion, redirections `callbackUrl`.
- **J4 Mot de passe oublié / réinitialisation.**
- **J5 Compte** : profil, gestion de l'abonnement (portail Stripe), changement de formule, résiliation, suppression de compte.
- **J6 Cas d'échec** : carte refusée, 3DS, abandon du checkout, webhook en retard, impayé / renouvellement, remboursement 14 jours.
- **J7 Les 11 anciens comptes FREE** : que voient-ils aujourd'hui ?
- **J8 E-mails transactionnels** : bienvenue, confirmation d'abonnement, reçu, réinitialisation, rappel annuel.
- **J9 Appli mobile** (Capacitor + achats intégrés) : statut réel à établir avant de noter.

## Preuves déjà disponibles

Captures prod du 07/10 (ordinateur 1440 px + iPhone 13) : `docs/qa/captures-parcours-s16/*.png` et journal `docs/qa/captures-parcours-s16/_log.txt`. Constats bruts de l'orchestrateur à confirmer ou infirmer :
1. `/register` ne passe jamais à « networkidle » (timeout 30 s, ordinateur et mobile) : une requête reste ouverte.
2. Sur mobile, le 1er bouton « abonne/premium » de /abonnement n'est pas cliquable (timeout) ; sur ordinateur, le 1er bouton trouvé est celui du header → `/register?callbackUrl=%2Fabonnement&src=header`.
3. Toutes les pages : script `static.cloudflareinsights.com/beacon.min.js` bloqué par la CSP (erreur console).
4. `/abonnement/success` en visiteur : un appel renvoie 401.
5. `/onboarding` en visiteur → redirigé vers `/abonnement` ; `/profil` et `/favoris` → `/login?callbackUrl=…`. Le bouton Google mène bien à accounts.google.com.

## Règles de sécurité (prod)

- Prod en **lecture seule** : AUCUNE création de compte, AUCUNE session Stripe Checkout, AUCUN e-mail déclenché (pas de « mot de passe oublié » sur une vraie adresse), AUCUNE écriture en base, AUCUNE écriture Stripe/Resend/Cloudflare. GET seulement.
- Données personnelles : uniquement des comptes agrégés dans les rapports (jamais d'e-mail, nom, identifiant client).
- Tests locaux (jest, tsc, build) autorisés.

## Format du rapport (obligatoire)

1. `Brief compris` + note globale du domaine /10.
2. Tableau des critères : **Critère | Parcours | Note /10 | Preuve (fichier:ligne, capture, sortie de commande) | Ce qui manque pour 10/10 | Sévérité P0/P1/P2**. 8 à 15 critères, choisis par toi pour ton domaine. Note = état réel constaté, pas le potentiel.
3. Bugs / défauts constatés (P0 = un utilisateur ne peut pas se connecter, payer ou accéder à ce qu'il a payé, ou risque légal/financier ; P1 = friction ou risque notable ; P2 = finition).
4. Recommandations classées par **valeur pour l'utilisateur** (pas par effort), sans rien implémenter.
5. Ce que tu n'as pas pu vérifier, et pourquoi (`[À VÉRIFIER]`).

Zéro invention : toute affirmation est prouvée ou marquée `[À VÉRIFIER]`. Zéro tiret cadratin dans les exemples de texte client proposés. Rapport en français, ≤ 250 lignes.

ANTI-TIMEOUT : écris le fichier IMMÉDIATEMENT après lecture. Write d'abord, Edit ensuite.
