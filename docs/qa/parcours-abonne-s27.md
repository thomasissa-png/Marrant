# QA s27 : l'expérience d'un abonné Premium, en vrai navigateur (26/11/2026)

> Go de Thomas du 26/11 : « Go pour qa oui ». Copie LOCALE de la version en ligne, abonné DE TEST, aucune écriture en production.
> Toutes les constatations sont **[LIVE local]** (Chromium headless réel, serveur réel, base jetable) sauf mention **[STATIQUE]** (lecture du code).
> Rien n'a été vérifié sur deviens-marrant.fr : les défauts ci-dessous sont reproduits sur la copie locale ; leur présence en ligne est probable (même code) mais **non vérifiée**.

## Verdict global : OK avec réserves

Le chemin de l'abonné réel passe de bout en bout sans erreur : inscription, paiement (simulé), « Paiement reçu ! », Aujourd'hui, Quoi répondre, conseil, réplique écrite puis retrouvée. Le parcours suivant (valider une étape, XP, série, étape 2, S'entraîner, Bibliothèque, Carnet, Mes questions, Profil, Résiliation) fonctionne aussi. Toutes les pages s'affichent en moins de 0,25 s en local. Aucune erreur serveur (5xx), aucun tiret cadratin visible, aucun « undefined », pas de débordement horizontal à 390 px.

Aucun défaut bloquant. Quatre défauts gênants, qui touchent directement un abonné dans ses premiers jours :
1. **Les favoris ne s'affichent pas sur les listes** : une vanne déjà en favori garde l'étoile vide, et un nouveau clic échoue sans rien dire (409).
2. **Pendant environ 2 s, un abonné voit la version payante** des fiches (conseil, vidéo) : « Tout ouvrir », cadenas sur la navigation, « Essayer ce conseil · 1,99 €/mois ».
3. **Fin du quiz d'étape** : le texte dit « Tu peux valider l'étape », mais le seul gros bouton visible est grisé (« Termine le quiz pour valider cette étape »). Le bon bouton est « Continuer », en contour.
4. **« Ton premier pas » reste affiché après avoir été fait** : une réplique écrite sur la situation proposée ne compte pas comme pratique, et le lendemain Aujourd'hui repropose la même chose.

## Montage (pour rejouer)

- Code : l'arbre `apps/` de la branche est identique à `5e795c19` (`git diff 5e795c19 HEAD -- apps` vide). L'interrupteur `ESPACE_CLIENT_PUBLIE` vaut déjà `true` dans ce commit : c'est le régime « ouvert » de la CI, sans bascule.
- Comme le job `e2e-local (ouvert)` : Postgres 16 local, base `marrant_e2e_s27`, `scripts/seed.sh` (80 vannes, 38 conseils, 89 vidéos, 3 parcours). Build `npm run build` avec les variables factices de la CI, puis serveur `node .next/standalone/server.js` sur le port 5300 (même commande que la CI). Faux Resend sur 127.0.0.1:5301, qui capte les envois sans rien envoyer.
- Navigateur : `chrome-headless-shell` 1243, scripts Playwright (bibliothèque `playwright`, hors runner), Umami et Cloudflare Insights coupés, `stripe.com` coupé.
- **Paiement simulé** : Stripe n'est pas joignable en local. Le navigateur intercepte `POST /api/stripe/checkout`, rejoue sur la base jetable l'effet du webhook (`activatePremium` : plan PREMIUM et ligne `Subscription` ACTIVE, mensuel, 199 centimes), puis renvoie la `success_url` de `lib/stripe.ts`. `verify-session` et `portal` sont bloqués dans le navigateur. Le formulaire Stripe Checkout lui-même n'est donc **pas** testé.
- Contenu : le seed local a moins de contenu que la production (pas de lettres envoyées, 38 conseils). Les écrans « La lettre » et les compteurs ne sont donc pas représentatifs du site en ligne.

### Incident de montage (à connaître avant de rejouer)

Le premier serveur local a été lancé **avec les variables d'environnement de la session**, qui contiennent des clés de production (Buffer, Stripe, réseaux sociaux, Anthropic, Umami…). Seules les variables de la CI avaient été écrasées. Le planificateur intégré (`[scheduler]`, 11 tâches) a démarré tout seul. D'après le journal du serveur, conservé dans le bloc-notes de la session :
- **2 appels à l'API Buffer réelle** (test d'authentification, puis lecture de la file), **refusés tous les deux en 429** (quota de 30 jours dépassé). Aucune publication : la file de la base locale était vide (« published 0 »).
- Aucune ligne Stripe dans le journal. Aucun envoi d'e-mail (Resend pointait vers le faux serveur). Lettres non envoyées (« pas approuvé », « semaine de la lettre du mois »). Génération IA coupée (`CONTENT_GENERATION_ENABLED` absent, CEO en `dryRun`). Prisma ne lit que `DATABASE_URL`, qui visait la base locale.

Serveur arrêté dès la découverte, puis relancé avec `env -i` et les seules variables de la CI (environnement du processus vérifié). Le parcours B a été rejoué sur ce serveur propre. **Règle pour la suite** : tout serveur local de QA se lance sous `env -i`, jamais avec l'environnement de la session.

## Écran par écran

Temps = du `goto` au premier contenu utile visible (h1 ou élément attendu), en ms, serveur local sans bridage. Captures (pleine page, deviceScaleFactor 1) dans `docs/captures/s27-parcours-abonne/`, sous le nom `<id>-mobile.png` (390×844) ou `<id>-pc.png` (1280×800).

### Parcours A : le chemin de l'abonné réel (visiteur, puis abonné de test créé par /register)

| Id | Écran | Statut | Mobile | PC | Erreurs console / réseau | Remarque UX (Yanis, 20 ans) |
|---|---|---|---|---|---|---|
| a-01 | Accueil `/` | OK | 155 | 110 | aucune | « Tu parles et personne rit » : ça me parle tout de suite, j'ai envie de cliquer. |
| a-02 | `/vannes` | OK | 108 | 118 | aucune | Je pioche, c'est léger, mais rien ne me dit encore quoi faire ensuite. |
| a-03 | `/parcours` | OK | 85 | 116 | aucune | Les 4 étapes et le « teste l'étape 1 gratuite » rassurent. |
| a-04 | `/parcours/repartie#etape-1` (gratuite) | OK | 113 | 165 | aucune | Le quiz se fait vite ; la fin m'envoie vers l'offre sans forcer. |
| a-05 | `/abonnement` | OK | 63 | 116 | aucune | 1,99 €/mois, c'est le prix d'un kebab sauce à part : le frein, c'est la longueur de la page. |
| a-06 | `/register` | OK | 55 | 93 | aucune | « Ton compte, puis le paiement » : clair, 2 champs, Google en option. |
| a-07 | `/abonnement/success` | OK, réserve cosmétique | 2 783 (boucle de vérification) | 114 (capture prise pendant « On vérifie ton paiement ») | aucune | « Paiement reçu ! » rassure ; « Ton accès s'active… » à côté d'un bouton déjà prêt fait hésiter une seconde. |
| a-08 | `/mon-espace` (Aujourd'hui, 1re fois) | OK | 113 | 165 | aucune | Un seul gros bouton « Commencer » : je sais quoi faire. |
| a-09 | Quoi répondre, `amis-quoi-de-neuf` | OK | 85 | 193 | aucune | La scène est concrète ; « Tu avais une réponse ? » donne envie de jouer. |
| a-10 | Quoi répondre, `amis-tu-n-as-jamais-vu-ce-film` | OK | 92 | 177 | aucune | Même format, ça va vite, je peux enchaîner. |
| a-11 | Quoi répondre, `amis-tu-as-change-quelque-chose` | OK | 114 | 145 | aucune | Idem. |
| a-12 | Conseil « L'ironie bienveillante » (exercice) | OK après chargement, **défaut D2** pendant le chargement | 49 | 93 | aucune | L'exercice « Défi ironie douce » est bien ouvert ; avant ça, je vois « Essayer ce conseil · 1,99 €/mois » alors que j'ai déjà payé. |
| a-13 | Réplique écrite dans la situation | OK | n/a | n/a | aucune | « Enregistrer » s'active dès la saisie ; un retour arrière puis avant garde la réplique (elle est enregistrée). |
| a-14 | `/mon-espace/repliques` | OK | 88 | 125 | aucune (*) | Ma réplique est là, avec Modifier / Supprimer : je me sens chez moi. |

### Parcours B : ce qu'il fera ensuite (même compte)

| Id | Écran | Statut | Mobile | PC | Erreurs console / réseau | Remarque UX (Yanis, 20 ans) |
|---|---|---|---|---|---|---|
| b-01 | Connexion, arrivée sur Aujourd'hui | OK, **réserve D4** | 592 (connexion comprise) | 135 | aucune | On me repropose « Ton premier pas : Tu as changé quelque chose ? », alors que j'y ai déjà écrit ma réplique : j'ai l'impression d'avoir fait ça pour rien. |
| b-02 | `/parcours` (abonné) | OK | 79 | 136 | aucune | Clair. |
| b-03 | Répartie, étape 1 ouverte | OK | 88 | 208 | aucune | Fiches 1.1 à 1.4 bien découpées ; c'est long sur mobile, mais le menu « Étape 1 sur 4 » aide. |
| b-04 / b-04a | Fin du quiz d'étape | **Défaut D3** | n/a | n/a | aucune | « Tu peux valider l'étape » + un bouton gris « Termine le quiz… » : je crois que c'est cassé. |
| b-05 | Étape 1 validée | OK | ~170 (clic → confirmation) | n/a | aucune | « +50 XP gagnés ! », l'étape 2 s'ouvre toute seule : le vrai moment « je progresse ». |
| b-06 | Passage à l'étape 2 | OK | ouverture automatique | n/a | aucune (**) | Étape 2 déjà dépliée, avec « Prochaine étape conseillée le jeudi 3 décembre. Tu peux y aller dès maintenant ». |
| b-07 | Aujourd'hui après validation | OK | 132 | 149 | aucune | « 50 XP gagnés », « 1 jour de pratique d'affilée », « Étape en cours : Répartie 2 sur 4 » : motivant. |
| b-08 | `/profil` | OK | 60 | 110 | aucune | Abonnement « Premium », 1,99 €/mois, prochain prélèvement le 26/12/2026, « Résilier ton contrat » → `/resiliation` : honnête et lisible. |
| b-09 | S'entraîner | OK | 93 | 149 | aucune | Situation du jour + mission en 5 marches : bonne idée de progression. |
| b-10 | Mission, marche 1 | OK | n/a | n/a | aucune | Je peux dire « Essayé, ça a marché » ; rien ne dit ce qui débloque la marche 2. |
| b-11 | Bibliothèque | OK | 102 | 128 | aucune | Riche ; sur PC la première fiche s'ouvre d'office, sur mobile c'est une liste. |
| b-12 | Bibliothèque, « La règle de trois » | OK | 87 | 132 | aucune | Format court et concret. |
| b-13 | `/vannes`, ajout d'un favori | **Défaut D1** | 81 | 159 | `409 POST /api/favorites` | Je clique l'étoile d'une vanne déjà gardée : rien ne bouge, pas de message. |
| b-14 | `/favoris` | OK | 72 | 153 | aucune | Mes vannes y sont bien. |
| b-15 | Carnet de novembre | OK | 74 | 129 | aucune | 30 situations filtrables : énorme pour 1,99 €. |
| b-16 | Carnet, fiche 1 | OK, réserve cosmétique | 102 | 125 | aucune | « On te dit / Tu réponds / Si ça se tend » : le format le plus utile du site. |
| b-17 | La lettre (abonné) | OK, non représentatif | 70 | 102 | aucune (*) | « Tes lettres s'affichent ici dès leur envoi » : la base locale n'a aucune lettre envoyée, l'écran en ligne sera différent. |
| b-18 | Mes questions | OK | 93 | 122 | aucune | Les 3 types de message aident à formuler. |
| b-19 | Question envoyée | OK | ~2 500 (attente fixe du script, pas une mesure) | n/a | aucune | « Envoyé, l'équipe répond en général sous 1 à 2 jours ouvrés » ; le « 0 / 3 » à côté de « Mes envois » est obscur. Envoi capté par le faux Resend, rien n'est parti. |
| b-20 | `/resiliation` (affichage seul, non confirmé) | OK | 68 | 128 | aucune | Compte, formule, « Jusqu'au 26 décembre 2026, tu gardes tout ton Premium » : clair, sans piège. |
| b-21 | Quoi répondre après « À moitié » | OK, réserve cosmétique (D6) | 94 | n/a | aucune | Les 3 réponses (sûre, joueuse, risquée) et « Comment choisir » : c'est là que j'apprends vraiment. |

(*) et (**) : quelques `Failed to fetch RSC payload` et `CLIENT_FETCH_ERROR` sont apparus quand le script quittait une page pendant un préchargement Next.js (requête coupée par la navigation suivante). Ce sont des artefacts du test, pas des défauts : un humain ne les déclenche pas à ce rythme.

Contrôles automatiques sur les 35 écrans, en mobile et en PC : 0 tiret cadratin visible, 0 « undefined / null / NaN / [object Object] », 0 débordement horizontal, 0 réponse 5xx, un seul 4xx (le 409 de D1).

## Défauts classés

### Bloquants

Aucun.

### Gênants

**D1. Favoris : l'étoile ne reflète pas l'état réel, et le 2e clic échoue en silence** [LIVE local]
- Reproduction : abonné connecté, sur `/vannes`, cliquer « Ajouter aux favoris » sur une vanne : l'étoile passe à « Retirer des favoris » et la ligne est créée en base (`UserFavorite`). Recharger `/vannes` : la même vanne (vérifiée par son texte : « En cours, j'ai levé la main pour aller aux toilettes… ») affiche de nouveau « Ajouter aux favoris ». Cliquer : `POST /api/favorites` répond **409**, l'étoile ne change pas, aucun message. Sur `/favoris`, la vanne est bien là.
- Effet abonné : il croit que son favori n'a pas été gardé, reclique, rien ne se passe ; il ne peut pas retirer un favori depuis la liste.
- Piste [STATIQUE] : `components/providers/favorites-provider.tsx` (chargement des favoris à la connexion) n'est monté nulle part (`grep FavoritesProvider` : aucune importation). Le magasin des favoris ne se remplit donc que sur les pages qui appellent `fetchFavorites` elles-mêmes (`/favoris`, favoris de l'espace). À confirmer par @fullstack.

**D2. Un abonné voit pendant ~2 s la version payante des fiches** [LIVE local]
- Reproduction : abonné connecté, ouvrir `/conseils/lironie-bienveillante-…` (la même chose se produit sur une fiche vidéo, et dans l'en-tête de `/vannes`). Le HTML servi est la version visiteur : bouton « Tout ouvrir » dans l'en-tête, cadenas sur « Aujourd'hui » et « Parcours », et à la place de l'exercice un bloc « Essaie-le avant le soir où il te servira » avec le bouton « Essayer ce conseil · 1,99 €/mois » (`/abonnement?…&src=exercice-conseil`). La version abonné remplace le tout une fois la session lue dans le navigateur.
- Durée mesurée : 100 à 150 ms en local non bridé ; **1,8 à 2,1 s** avec un mobile simulé (CPU ×4, latence 150 ms, 200 ko/s), sur 6 mesures (conseil, vidéo, `/vannes`).
- Effet abonné : le jour même de son paiement, il voit « 1,99 €/mois » sur l'exercice qu'il vient d'acheter, et peut cliquer dessus pendant ces 2 s. Le premier accès Premium de l'abonné réel était justement cet exercice.
- Captures : `a-12b-conseil-ironie-premier-rendu-{mobile,pc}.png` (au premier rendu), `a-12c-conseil-ironie-verrou-transitoire-{mobile,pc}.png` (mobile bridé, verrou affiché).

**D3. Fin du quiz d'étape : le message et les boutons se contredisent** [LIVE local]
- Reproduction : abonné, `/parcours/repartie#etape-1`, répondre aux 4 questions puis « Voir le résultat ». La carte affiche « 1/4 bonnes réponses… Tu peux valider l'étape. » avec un bouton **contour** « Continuer », et juste dessous le bouton plein-largeur **grisé** « Termine le quiz pour valider cette étape ». « Valider cette étape » n'apparaît qu'après un clic sur « Continuer ». Le lien « Étape 2 · Le rythme et les silences › » est déjà visible avant la validation.
- Effet abonné : le quiz est fini, mais le seul bouton « valider » visible dit de le finir et ne répond pas ; il peut aussi passer à l'étape 2 sans valider (pas de +50 XP, pas de jour de série).
- Capture : `b-04a-quiz-resultat-mobile.png`.

**D4. « Ton premier pas » repropose ce que l'abonné vient de faire** [LIVE local]
- Reproduction : comme l'abonné réel, ouvrir la situation `amis-tu-as-change-quelque-chose` (celle du « premier pas ») et y enregistrer une réplique. Revenir sur Aujourd'hui (nouvelle connexion) : la carte du haut est toujours « Ton premier pas · Quelqu'un te lance « Tiens, tu as changé quelque chose, non ? » · Commencer », et « Ta série démarre à ta prochaine pratique. » La carte ne change qu'après une étape de parcours validée (b-07 : elle devient « S'entraîner »).
- Effet abonné : demain, l'abonné réel retrouvera en tête le premier pas qu'il a déjà fait, et sa réplique ne compte pas comme pratique (« Un jour compte quand tu valides une étape ou que tu termines un quiz d'étape »).
- Captures : `b-01-connexion-arrivee-mobile.png` puis `b-07-aujourdhui-apres-mobile.png`.

### Cosmétiques

- **D5.** `/abonnement/success`, état prêt : « Merci. Ton accès s'active… » s'affiche à côté du bouton « Continuer » déjà actif (texte `pretTexte`, `config/textes/paiement.ts:147`). Les points de suspension laissent croire que ça charge encore. Capture `a-07-success-mobile.png`.
- **D6.** Quoi répondre, à 390 px : une fois choisi, le bouton « À moitié » (avec la coche) se coupe au milieu du mot : « À / moiti / é ». Capture `b-21-qr-revelation-mobile.png`.
- **D7.** Mes questions : « Mes envois » est suivi de « 0 / 3 » sans libellé (en fait réponses reçues / envois, `liste-envois.tsx:49`). On peut le lire comme un quota épuisé. Capture `b-19-question-envoyee-mobile.png`.
- **D8.** Carnet, fiche (`/carnet/2026-11/1`) en mobile : aucun h1 visible (le h1 « Carnet de novembre » est masqué, le titre de la fiche n'est pas un titre de niveau 1). Le PC a un h1 visible. Point d'accessibilité mineur.
- **D9.** Bibliothèque : 2 h1 dans le DOM (« Bibliothèque » et celui de la fiche) ; un seul est visible selon la largeur. Mineur, même famille que D8.

Non testé ou non représentatif : le formulaire Stripe Checkout (simulé), les lettres reçues par un abonné (aucune en base locale), le portail Stripe « Gérer mon abonnement » (non cliqué), la confirmation de résiliation (non confirmée, comme demandé), les performances en ligne (Cloudflare, Neon) : les temps ci-dessus sont locaux.

## 3 améliorations pour les premiers jours d'un abonné (non codées)

1. **Faire compter Quoi répondre dans la progression des premiers jours.** L'abonné réel a fait 3 situations, un exercice et une réplique, mais rien n'est validé et sa série « démarre à ta prochaine pratique ». Proposition : une réplique enregistrée ou un « Ton retour » sur une situation compte comme un jour de pratique (et fait passer le premier pas), avec un retour visible du type « 1 jour de pratique ». C'est ce qui donne envie de revenir le lendemain.
2. **Après le paiement, montrer le chemin des 7 premiers jours.** Aujourd'hui affiche « Tes 4 premières semaines » (« Le parcours peut attendre ») juste sous « Étape conseillée : Répartie · Commencer l'étape 1 » : deux conseils qui se contredisent. Proposition : une seule ligne de route pour la 1re semaine (jour 1 : la situation ; jour 2 : étape 1 de Répartie ; jour 3 : une mission…), et la case du jour cochée dès qu'elle est faite.
3. **Faire de la validation d'étape le geste évident.** Après le quiz, un seul bouton plein « Valider l'étape (+50 XP) » à la place de « Continuer » puis « Valider cette étape » (corrige D3), et masquer « Étape 2 › » tant que l'étape 1 n'est pas validée. Le « +50 XP gagnés ! » avec l'étape suivante ouverte est le meilleur moment du parcours : il faut que Yanis y arrive à coup sûr.
