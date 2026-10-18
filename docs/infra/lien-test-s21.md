# Lien de test s21 (version d'aperçu Cloudflare, hors production)

@infrastructure, 18/10/2026 vers 13 h 15 UTC. Branche `claude/marrant-s21-integration`, commit `1083e0b` (CI verte, QA v3 et revue d'ensemble v2 : GO lien de test).

## Lien d'aperçu

**https://8f69a315-marrant.thomas-issa.workers.dev/?ne-pas-compter=1**

Ouvrir d'abord ce lien tel quel (avec `?ne-pas-compter=1`) dans chaque navigateur utilisé : il coupe Umami pour ce site d'aperçu (le réglage de deviens-marrant.fr ne s'applique pas ici, c'est une autre adresse).

## Version de test et production

| | Identifiant | Tag | Trafic |
|---|---|---|---|
| Version de test (ce lien) | `8f69a315-64ec-4a37-b681-ef7793796ade` | `s21-test-1083e0b` | 0 % (lien d'aperçu seulement) |
| Production avant le téléversement | `5ea46dd8-1e31-4175-bc99-3d0873925901` | aucun | 100 % |
| Production après le téléversement | `5ea46dd8-1e31-4175-bc99-3d0873925901` | aucun | 100 % (inchangée) |

- Commandes passées : `rm -rf .open-next && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run build:cf`, puis `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npx opennextjs-cloudflare upload -- --tag s21-test-1083e0b` (depuis `apps/web`). Aucun `deploy`, aucun `versions deploy`, aucun changement de routage, de domaine ni de tâche planifiée.
- Une version plus ancienne `47b8c826-0a05-4e88-a7c5-c6791332b5e0` (tag `s21-test`, 18/10 01:03 UTC, commit antérieur aux corrections du jour) existe aussi : **périmée, ne pas l'utiliser**.
- Les tâches planifiées (`*/15`, lettre, social) ne tournent que sur la version en production : la version de test n'en lance aucune.

## Contrôles faits (curl, `?ne-pas-compter=1`, visiteur sans cookie)

- Aperçu, code 200 : `/`, `/abonnement`, `/carnet`, `/glossaire`, `/a-propos`, `/parcours`, `/blog/meilleures-blagues-droles-2026`, `/api/health`.
- Aperçu, textes : « Ouvrir les 5 parcours » sur `/` et `/abonnement` (et le bouton de fin de `/glossaire` et `/a-propos`) ; « Reste à s'en servir » sur `/glossaire` ; « Situation 15, offerte » sur `/abonnement` (« Situation 1, offerte » : 0) ; « Tester mes premières répliques, gratuit » sur l'accueil ; « Ça, c'était la réplique offerte. Il en reste … » et `returnTo=%2Fcarnet&src=carnet` sur `/carnet` ; « La situation offerte ce mois-ci » dans l'article ; « Active mon accès », « Débloquer », « Débloque tout le carnet », « Tu crois avoir tout essayé », « Accéder aux parcours complets » : 0 partout.
- Production (deviens-marrant.fr), ancienne version toujours servie : `/glossaire` contient « Place aux rires » et pas « Reste à s'en servir » ; `/carnet` contient « Débloque tout le carnet » ; l'accueil contient « Tu crois avoir tout essayé » ; `/abonnement` n'a pas « Situation 15, offerte ». (« Active mon accès » n'apparaissait que pour un compte connecté, invisible au curl visiteur.)

## Ce que l'aperçu partage avec la production

L'aperçu est le même Worker `marrant` : mêmes secrets et mêmes liaisons. Ce n'est **pas** un bac à sable.

- **Base Neon de production** (via Hyperdrive) : tout ce qu'on fait connecté s'écrit en vrai (XP, étapes validées, favoris, votes, quiz, inscription). Valider une étape ou créer un compte seulement avec un **compte de test**, jamais avec un vrai compte membre.
- **Stripe réel** : **NE PAS payer**. Le bouton d'abonnement ouvre une vraie page de paiement ; de plus, le retour après paiement est construit sur deviens-marrant.fr (pas sur l'aperçu).
- **Lettre** : **NE PAS s'inscrire à la lettre**. La migration 14 n'est pas jouée en production (voulu, elle fait partie de la mise en ligne P3) : l'inscription échouerait ou écrirait dans une table pas encore à jour.
- **Resend** : tout e-mail déclenché (création de compte, mot de passe oublié) part vraiment.
- **Umami** : le même site Umami. Toujours ouvrir l'aperçu avec `?ne-pas-compter=1` une première fois. Le rapport du lundi filtre sur `hostname=deviens-marrant.fr` : une visite oubliée ne fausse pas le rapport, mais elle reste dans le tableau Umami.
- **Cache des pages (R2)** : séparé par build, aucun effet sur les pages de la production. Les pages mises en cache de l'aperçu peuvent ne pas se rafraîchir seules (la régénération passe par le Worker en production) : sans importance pour une relecture.
- **Connexion** : par e-mail et mot de passe, le cookie est posé sur l'adresse de l'aperçu (non testé ici, pour ne rien écrire en base). **Connexion Google : ne marche pas sur l'aperçu** (elle renvoie sur deviens-marrant.fr). Si une action ramène sur deviens-marrant.fr, revenir au lien d'aperçu.

## Pages à regarder

**Visiteur (navigation privée, sans compte)**
- `/` : haut de page « Tester mes premières répliques, gratuit », carte Premium « Ouvrir les 5 parcours, de la coloc à l'afterwork · 2,99 €/mois », bouton « 2,99 €/mois » de l'en-tête.
- `/abonnement` : « Situation 15, offerte », bouton « Ouvrir les 5 parcours · 2,99 €/mois ». `/abonnement?returnTo=%2Fparcours%2Fconfiance` : « Ouvrir Confiance et les 4 autres ».
- `/carnet` : fiche offerte « Le premier rendez-vous silencieux », « Il en reste 14 », bouton « Voir les 14 autres répliques ».
- Un article, par exemple `/blog/meilleures-blagues-droles-2026` : encart du milieu (démonstration du carnet), bloc de fin, lettre, FAQ en dernier.
- `/glossaire` et `/a-propos` (blocs de fin), `/parcours` puis `/parcours/repartie` (étape 1 ouverte, 2 et suivantes en aperçu), `/vannes` (mur en bas, cœur d'une vanne), une fiche vanne (bloc d'exercice), `/quiz-humour`, `/register`.

**Compte sans abonnement (compte de test, connexion par e-mail)**
- `/` (« Tu as déjà ton compte : … »), `/abonnement` (pastille « Un abonnement, tout ouvert »), `/profil` (carte « Abonnement », « Tout ouvrir · 2,99 €/mois »), `/carnet`, menu de compte → « Favoris » (arrive sur `/abonnement`), un cœur sur `/vannes` (fenêtre sans « Deux étapes »). Nulle part « Active mon accès ». S'arrêter avant la page de paiement Stripe.

**Abonné Premium (compte Premium de l'équipe)**
- `/` sans carte Premium ; un cœur sur `/vannes` ajoute aux favoris ; `/favoris` ; un article sans encart du milieu ; `/glossaire` et `/a-propos` sans bloc payant ; `/parcours/confiance` : toutes les étapes s'ouvrent (ne pas valider, l'XP serait réelle).

**Carnet de novembre** : visible seulement à partir du 01/11 00:00 Paris. Jusque-là, l'aperçu montre le carnet d'octobre (normal).

## Supprimer ou ignorer cette version

- **L'ignorer suffit** : elle ne reçoit aucun trafic de deviens-marrant.fr tant que personne ne la déploie. La mise en ligne réelle reste la procédure P0 à P8 de `REPLIT_ACTIONS.md` (build et `deploy:cf` du commit validé), pas un déploiement de cette version.
- **Ne jamais lancer** `npx wrangler versions deploy 8f69a315…` (ni pour 47b8c826) : cela mettrait la version en production sans la migration 14 ni les contrôles P2.
- **Couper le lien** : tableau de bord Cloudflare → Workers & Pages → `marrant` → Settings → Domains & Routes → « Preview URLs » désactivé. Cela coupe les liens d'aperçu de toutes les versions, pas deviens-marrant.fr ni `marrant.thomas-issa.workers.dev`. [À VÉRIFIER dans le tableau de bord : je n'ai pas trouvé de suppression d'une version seule ; les anciennes versions restent listées dans `wrangler versions list`, sans effet.]
