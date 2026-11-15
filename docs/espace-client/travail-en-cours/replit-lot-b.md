# Entrée REPLIT_ACTIONS à reporter par le coordinateur : nav v6, lot B (pages d'aperçu Premium)

### À DÉPLOYER (s25), détail, voir l'entrée JOUR DU GO : nav v6, lot B, pages d'aperçu des rubriques Premium, **COMMITÉ, NON DÉPLOYÉ, INTERRUPTEUR FERMÉ : rien ne change en ligne** (Jest d'inertie : 47 instantanés verts sans mise à jour)

**Ce que ça change, interrupteur ouvert seulement** (spec `docs/ux/navigation-v6-menu-rubriques.md` §2, décisions du 15/11, consignes du coordinateur) : le visiteur et l'inscrit gratuit qui ouvrent une rubrique Premium de la bande voient, À SA PROPRE ADRESSE, une page d'aperçu au lieu d'une redirection (avant : visiteur vers `/login`, gratuit vers `/abonnement`). Adresses : `/mon-espace` (Aujourd'hui), `/mon-espace/quoi-repondre`, `/mon-espace/bibliotheque`, `/mon-espace/s-entrainer`, `/mon-espace/questions`, `/mon-espace/repliques`, `/favoris`. Contenu : titre de la rubrique, sous-titre validé, un exemple réel (liste à confirmer : `apercus-fiches-a-confirmer.md`), un bloc d'offre (bouton de l'en-tête « Premium · 1,99 €/mois », prix lu dans `config/premium.ts`, vers `/abonnement?returnTo={rubrique}&src=apercu-{rubrique}` ; « Connexion » en plus pour le visiteur). Tête `noindex, follow` ; hors sitemap. L'abonné actif : rubriques inchangées.

**Aussi, ouvert seulement** : plus de « Retour : Mon espace » ni de place réservée au-dessus du titre sur les pages de premier niveau (Aujourd'hui, Quoi répondre, Bibliothèque, S'entraîner, Mes questions, Mes répliques, Favoris) ; index « Dans ton espace » retiré d'Aujourd'hui (colonne 2 vide, à redessiner dans la section Aujourd'hui).

**Middleware** : ouvert, l'adresse exacte `/favoris` n'est plus redirigée (ni visiteur vers `/login`, ni compte sans Premium vers `/abonnement`) ; fermé, inchangé. `/mon-espace/**` : la redirection était dans la garde du layout, désormais court-circuitée sur les 6 adresses pour le visiteur et l'inscrit gratuit.

**Ancien abonné (point à confirmer)** : non visé par la spec v6 (trois états : visiteur, inscrit gratuit, abonné) ; sur `/mon-espace/**` il garde son arrivée actuelle sur `/abonnement` avec ses lignes « historique gardé » (architecture 2.6, specs E2E `espace-profil-d10`, `espace-questions`, `espace-retours-d11b`) ; sur `/favoris`, la page d'avant et son mur Premium existant (le middleware ne le distingue pas d'un gratuit). Passer l'ancien abonné à l'aperçu = une ligne dans `components/espace/apercu/acces.ts`.

**Inchangé** : `/parcours` (déjà l'aperçu), fiches, bonus, fils de questions, lettres : garde d'avant.

**SEO, point ouvert (hors carte du lot B)** : `app/robots.ts` interdit `/mon-espace` et `/favoris` à tous les robots. La spec v6 §2 demande de vérifier qu'il ne bloque pas `/mon-espace` : bloquée, les aperçus ne sont jamais explorés (leur `noindex, follow` n'est pas lu). Arbitrage @seo en attente (« [À ARBITRER @seo] » de la spec), fichier non modifié.

**Mesure** : nouvelles valeurs de `src` du tunnel (`apercu-aujourdhui`, `apercu-quoi-repondre`, `apercu-bibliotheque`, `apercu-s-entrainer`, `apercu-questions`, `apercu-repliques`, `apercu-favoris`) : à ajouter au rapport du lundi s'il liste les sources une par une. Événements « vue aperçu » et « clic offre depuis aperçu » de la spec : pas encore nommés par @data-analyst, non posés.

**Fichiers** : `apps/web/src/middleware.ts`, `apps/web/src/app/(dashboard)/favoris/page.tsx`, `apps/web/src/app/(dashboard)/mon-espace/{layout,page}.tsx`, `mon-espace/{quoi-repondre,bibliotheque,s-entrainer,questions,repliques}/page.tsx`, `apps/web/src/components/espace/apercu/{acces.ts,exemples.ts,exemple.tsx,apercu-rubrique.tsx,favoris-ouvert.tsx}`, `apps/web/src/config/textes/espace-apercu.ts`, tests `apps/web/src/__tests__/espace/apercu-{rubriques,fiches,favoris-middleware}.test.ts*`, `playwright/tests/local/espace-apercu-v6.spec.ts`.

**Actions infra** : aucune (ni variable, ni paquet, ni migration). Déploiement : avec l'ouverture de l'espace, sur go écrit de Thomas.
