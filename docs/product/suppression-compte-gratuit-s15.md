# Suppression du compte gratuit (s15, 05/10/2026)

> **[CHOIX UTILISATEUR] non re-questionnables** : pas de compte gratuit (parcours visiteur puis Premium) ; **aucune fonction ajoutée ni retirée aux visiteurs** ; 11 comptes FREE conservés ; 2,99 €/mois ou 24,99 €/an ; « 1 500+ » P0 ; zéro tiret cadratin ; zéro mention IA ; humoristes autorisés.
> Vérifié par lecture directe des fichiers cités (Grep indisponible dans cette session : §3.4 liste ce qui reste à balayer). Zéro chiffre inventé.

## 1. Modèle cible : 3 états, un seul palier payant
| État | Définition | Ce qu'il a |
|---|---|---|
| **Visiteur** | sans compte | **Inchangé** : 10 vannes / 3 conseils / 3 vidéos en liste (`config/premium.ts:92-94`), fiches publiques, contenu du jour, étape 1 lisible, quiz, 1 fiche du carnet, recherche 3 résultats, réactions en `localStorage` (`reaction-buttons.tsx:124`) |
| **Compte non abonné** | 11 comptes FREE + abonnés résiliés (`webhook` remet `plan: FREE`, `route.ts:116`) + inscriptions sans paiement abouti | Exactement ce qu'a un visiteur, rien de plus (voir §1.2) |
| **Premium** | plan PREMIUM | Listes complètes, filtres, favoris, parcours complets, carnet complet, recherche 5, **et ce qui était réservé au compte gratuit** |

### 1.1 Ce qui était réservé au compte gratuit : décision par élément (valeur persona Yanis/Sophie/Marc, puis conversion)
| Élément (code actuel) | Décision | Argument |
|---|---|---|
| XP, niveau, `POST /api/user/xp` (conseils-list `:163-167`) | **Premium** (API 403 hors Premium) | La progression mesurable est la promesse du parcours (project-context : « XP/streak ») ; elle récompense l'effort payé, et un visiteur ne l'avait pas |
| Valider l'étape 1 (`api/parcours/[id]/progress`, `parcours-detail.tsx:772-783`) | **Premium** (toutes étapes) | Lire l'étape 1 reste libre (inchangé) ; valider = suivre sa progression = Premium. Évite un palier « 1 étape validée gratuite » incohérent avec la règle unique |
| Série (`lib/auth.ts:152`) et `/profil` Progression/Streak/Stats/Mes parcours (`profil-dashboard.tsx:149-345`) | **Premium** pour l'affichage ; l'enregistrement en base reste inchangé (aucun coût) | Les données d'un ex-abonné ne sont pas détruites : « ta progression t'attend » à la réactivation (rétention, sans promesse inventée). Défaut connu hors périmètre : la série ne s'incrémente qu'à la connexion (`auth.ts:148-153`) |
| « À toi de jouer » sur la fiche vanne (`how-to-apply-gate.tsx:21`) | **Premium** | Faux « verrou » à éviter : la liste et le contenu du jour montrent déjà l'exercice aux visiteurs sur leurs 10 vannes (`vannes-list.tsx:326-331`, `daily-content.tsx:201-206`). Sur les vannes hors des 10 premières, la fiche est le seul endroit : le verrou y garde un sens |
| Likes persistés (`api/jokes/[id]/like` POST) | **Premium** pour la persistance serveur ; hors Premium, repli `localStorage` déjà codé : le visiteur ne voit aucune différence | Zéro perte de fonction |
| Votes « Prochainement » (`api/features/vote` POST) | **Premium** (le bloc porte déjà le badge « Abonnés », `upcoming-features.tsx:161`) ; clic hors Premium : modale Premium (raison `vote` à ajouter) | Voter sur la suite du produit est un avantage d'abonné ; cohérent avec le badge |
| Fiches conseil et vidéo « exercice / analyse réservés aux inscrits » (`conseils/[slug]:196-209`, `videos/[slug]:214-229`) | **Accès complet** (CTA vers `/abonnement`, retour à la fiche) | Vrai : l'exercice et les analyses des conseils et vidéos hors des 3 premiers sont dans les listes Premium. À noter : ces fiches n'affichent l'exercice à personne aujourd'hui (le compte gratuit ne l'ouvrait pas) : la promesse actuelle est fausse |

### 1.2 Compte non abonné et 11 comptes FREE (défaut A, GO Thomas requis pour B)
- **A (recommandé)** : conservés tels quels en base (aucune suppression, XP/progression/likes/votes gardés), comportement = §1 ligne « non abonné ». Un seul code, pas de drapeau d'exception. `/profil` : bloc Abonnement + message unique « ta progression t'attend » seulement si `xp > 0` (donnée réelle). **B (rejeté)** : maintenir les droits FREE pour ces 11 via un drapeau : complexité durable pour 11 personnes, et contredit « plus de palier ».
- E-mail aux 11 : **brouillon** obligatoire (règle commune 10), pas d'envoi direct ; étalon n°5 §3.3. Ton « on offre, on n'impose ».

## 2. Parcours d'achat visiteur → Premium
1. **Entrées** : hero, CTA accueil, `/abonnement`, paywalls (étape 2+, carnet, listes, modale), fin d'article, fiches. Tous mènent à **un seul chemin**.
2. **`/abonnement`** (visiteur) : suppression du bloc « Compte gratuit » (`abonnement-view.tsx:134-153`) ; un seul bloc Accès complet ; bouton → `/register` portant `plan`, `returnTo`, `src`, `origine`, `contenu`.
3. **`/register` conservé comme URL** (noindex, utilisée par la bascule navigateur intégré et `mesure.md` §1) mais devient **« étape 1 sur 2 : ton compte »** avec rappel formule et prix. E-mail (formulaire existant) ou Google. Après création : **ouverture automatique de Stripe Checkout** (au lieu du détour par `/abonnement` + second clic) via `/abonnement?plan=…&returnTo=…&auto=1`.
   - `auto=1` retiré de l'URL (`history.replaceState`) avant l'appel pour qu'un rechargement ou un retour arrière ne relance pas ; échec (401/429/503) : bouton manuel + messages existants (`abonnement-view.tsx:45-50`).
   - E-mail déjà inscrit (409, `api/auth/register:37-41`) : lien « Connecte-toi » conservant `callbackUrl`, au lieu de l'erreur seule (cas : abonné résilié qui clique « Commencer »).
   - Alternative rejetée : créer le compte au paiement Stripe (checkout lié à `userId`, `webhook:48`, `returnTo`, Google OAuth) : refonte d'auth sans gain visiteur.
4. **`/login`** : inchangé pour abonnés et 11 FREE (défaut `/vannes`, `login/page.tsx:67`) ; bloc bas « Pas encore de compte ? » reformulé « Pas encore abonné ? » (`:231-237`) ; non abonné connecté : bouton « Activer mon accès » dans le header (`header.tsx:94-123`, aucun CTA aujourd'hui).
5. **`/onboarding`** : ~~public sans compte~~ **CORRIGÉ par la session (05/10) : contraire à la consigne de Thomas « pas de changement de fonction pour les visiteurs »** (un visiteur n'y a pas accès aujourd'hui). Il reste réservé aux comptes connectés comme aujourd'hui, n'est plus une étape avant paiement et n'est proposé qu'après l'abonnement ; un visiteur qui l'ouvre est renvoyé vers `/abonnement` au lieu de `/register`. Toujours noindex. `getPostSignupRedirect` : défaut `/onboarding` devient `/abonnement` (`safe-callback.ts:60-66`) ; callbacks d'intention conservés en `returnTo`. Après paiement : `/parcours` + message de bienvenue (existant, `premium-return.ts`). Pas de redirection 308 (l'événement `onboarding-termine` vit).
6. **Fin d'article** (`article-cta.tsx`) : visiteur et non abonné : CTA principal vers `/abonnement` + lien secondaire « lire l'étape 1 du parcours » (public, existant) ; Premium : « Continuer mon parcours » vers `/parcours` (et non `/onboarding`, `:46`).
7. **`parcours-content.tsx:188-194`** : « Commencer ce parcours » envoie aujourd'hui le visiteur à `/register` alors que l'étape 1 est libre : il va désormais direct à `/parcours/<slug>` (chemin propre, valeur avant paiement, aucune fonction ajoutée).

## 3. Inventaire des textes et appels (fichier:ligne, texte actuel, intention)
### 3.1 Textes faux ou trompeurs à réécrire (@copywriter après étalons §3.3)
| Fichier:ligne | Texte actuel | Intention |
|---|---|---|
| `abonnement-view.tsx:87,90` | « Crée ton compte, deviens drôle » ; « Compte gratuit d'abord (…) » | Un compte pour s'abonner ; plus de palier gratuit |
| `abonnement-view.tsx:138-149` | Bloc « Compte gratuit », « Crée ton compte gratuit », « Commence gratuitement… » | **Suppression** du bloc |
| `abonnement-view.tsx:20,75-77` | import `FREE_CATALOGUE_LIMITS_LABEL`, `freeSignupHref` (`src: abonnement-gratuit`) | Code mort à retirer |
| `article-cta.tsx:30-31` | « Essaie gratuitement » ; « Compte gratuit : 10 vannes, 3 conseils, 3 vidéos, contenu du jour. Sans carte. » | CTA abonnement ; note vraie (accès libre sans compte) |
| `config/blog-cta.ts` : text 19,26,33,40,47,54,61,68,75,82,89,96 ; primaryLabel 20,27,34,41,48,55,62,69,76,83,90,97 ; note 21,28,35,42,49,56,63,70,77,84,91,98 (12 articles) | « Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours » (**faux** : déjà public) ; « Créer mon compte gratuit » ; « Gratuit, sans carte… » | 12 CTA à réécrire sur le modèle de l'étalon n°3 : garder le titre (propre à l'article), changer promesse, bouton et note |
| `hero-section.tsx:46,65,70,72` | « Créer mon compte gratuit » + « Puis 2,99 €/mois pour tout débloquer… » | Entrée d'abonnement, prix visible ; garder « Voir les vannes gratuites » (`:77`, vrai) |
| `home-cta.tsx:30,36,38` | idem hero | idem hero (étalon n°1) |
| `a-propos/page.tsx:211-215` | « Créer mon compte gratuit » (callback `/`) | idem hero ; « 1 500+ membres » (`:86,208`) intact |
| `vannes-list.tsx:201-208` | « …sans compte » ; « Crée ton compte gratuit pour garder tes XP… » ; bouton « Créer mon compte » | Un seul CTA « Tout débloquer » ; ligne 201 reste vraie |
| `how-to-apply-gate.tsx:12-16,34-39` | « réservé aux membres. Crée ton compte gratuit pour le débloquer. » | « Fait partie de l'accès complet », lien `/abonnement` (étalon n°4) |
| `vannes/[slug]/page.tsx:140-143,233-234,278-283` | commentaires « membres connectés » ; bouton « Créer un compte gratuit » | Bouton vers `/abonnement` (retour fiche) |
| `conseils/[slug]/page.tsx:196-209` | « …t'attend avec ton compte gratuit » ; « Créer un compte gratuit » | Étalon n°4 ; vrai : accès complet |
| `videos/[slug]/page.tsx:214-229` | « …accessibles gratuitement quand tu crées ton compte. Tu récupères aussi ton contenu quotidien… » ; « Créer un compte gratuit » | Idem ; ne plus promettre le contenu du jour (déjà public) |
| `parcours-detail.tsx:797-803` | « Crée ton compte gratuit pour valider l'étape » (étape 1, visiteur) | Valider = accès complet, lien `/abonnement` avec `returnTo` |
| `parcours-detail.tsx:607-609` / `parcours-content.tsx:281-283` | Badge « Essai gratuit » (étape 1) | **Vrai (lecture libre), inchangé** ; à aligner sur « offerte » seulement si @copywriter le juge utile |
| `viral-quiz.tsx:97-104` | « Crée ton compte gratuit et commence un parcours » (src `quiz`) | Retirer ou relabelliser vers l'abonnement ; le bouton principal « Voir par où commencer » (`:90-95`) reste |
| `register/page.tsx:153,246` ; `register/layout.tsx:4-6` | « Crée ton compte, ta première vanne t'attend » ; « Créer mon compte » ; meta « Inscription… dès 2,99 €/mois » | Étape 1 sur 2 (étalon n°2) |
| `premium-benefits.tsx:55-56` | « …au lieu de 10 vannes, 3 conseils et 3 vidéos **en compte gratuit** » | « sans abonnement » (limites inchangées) |
| `profil-dashboard.tsx:352-354,361,387` | Badge « Gratuit » ; « les filtres avancés » | Badge « Aucun abonnement » ; aligner sur `premium-benefits` (filtre par catégorie, pas « avancés ») |
| `llms-content.ts:77,123,155` | « Un accès gratuit permanent… » ; « Accès gratuit : … » | « Sans abonnement et sans compte : … » |
| `login/page.tsx:70,231-237`, `auth-cta.tsx:28`, `header.tsx:129-131,235` | « Pas encore de compte ? / Créer un compte » ; « Créer un compte pour commencer » ; « Commencer » | Libellés qui disent « s'abonner » sans mentir |
| `premium-modal.tsx:19-26,108` | 2 raisons (favoris, défaut) ; « Créer un compte pour commencer » | Ajouter la raison `vote` ; bouton « Créer mon compte et m'abonner » |
| `upcoming-features.tsx:106-109` | clic anonyme : `/register` (src `accueil-vote`) | Modale Premium (raison `vote`) |
| `cgu/page.tsx:17,21` | « Un compte gratuit donne accès à une partie du contenu » | Voir §4 (@legal, GO Thomas) |
| `mobile/OnboardingFlow.tsx:216-219,225` | « Crée ton compte gratuit pour garder tes XP… » | [À VÉRIFIER usage, @fullstack] ; même intention |

### 3.2 Appels et code sans texte à modifier
`safe-callback.ts:37,56-66` ; `middleware.ts:17,29-38,59-60` ; `parcours-detail.tsx:379-383,762-783` (bouton valider si `isPremium`) ; `parcours-content.tsx:188-194` ; `conseils-list.tsx:163-167` (XP si Premium) ; `reaction-buttons.tsx:85-122` ; `api/user/xp`, `api/parcours/[id]/progress:107-120` (403 hors Premium, toutes étapes), `api/jokes/[id]/like`, `api/features/vote` ; `lib/parcours-access.ts` (non lu : séparer lecture et validation) ; `blog-article-view.tsx:35-38,144-146` (`freeCallbackUrl="/onboarding"`).

### 3.3 Étalons à soumettre à Thomas AVANT tout brief copywriter (P0 s8, charte `docs/copy/charte-refonte-copy-s11.md`)
1. CTA d'entrée hero + accueil (bouton, note prix) ; 2. `/register` « étape 1 sur 2 » (titre, bouton, rappel prix) ; 3. CTA de fin d'article (défaut + 1 cas dédié, ex. couple) ; 4. bloc « fait partie de l'accès complet » (fiche vanne, conseil, vidéo, étape verrouillée) ; 5. e-mail aux 11 comptes FREE. Mesure du diff réel obligatoire (P0 s11), intouchables : slugs, H2, FAQ, liens, chiffres, prix.

### 3.4 Non couvert (Grep indisponible) : balayage obligatoire avant livraison
Non lus : corps des articles (base `BlogArticle.content` + `src/data/blog-article-*.json`, `lib/blog-articles.ts`), `lib/ai/**` (e-mail de bienvenue, étalon 2 de `docs/strategy/ceo-voice-unified.md`), `glossaire`, `anatomie-vanne`, `blague-du-jour`, `vannes/theme`, `conseils/page`, `videos/page`, `favoris`, `confidentialite`, `mentions-legales`, `retractation`, `search-bar`/`api/search`, `app/layout`, `(dashboard)/layout`, `llms*.txt/route.ts`, `liens`, `newsletter`, `docs/content`. Commande : `rg -i "gratuit|inscri|compte|crée ton|créer un compte|sans carte|réservé aux (membres|inscrits)|membres? connect" apps/web/src docs/content` + requête SQL `ILIKE` sur `BlogArticle.content` ; tout résultat est classé vrai/faux (« accès libre » vrai, « compte gratuit » faux).

## 4. Impacts
- **Umami** : garder `inscription-envoi`/`inscription-reussie` (historique, `mesure.md` §1,§3,§5) mais ils deviennent « compte créé pour s'abonner » (ajouter `etape: "abonnement"`). Le jugement porte sur `abonnement-clic` (ajouter `declencheur: auto|manuel`) puis `abonnement-reussi`. `src` retirés : `abonnement-gratuit`. `data-blog-cta="inscription"` (`article-cta.tsx:80`) à renommer `abonnement` : **rupture de série**, à dater (critère hypothèse Marc, `mesure.md` §5, à reformuler par @data-analyst). Le taux visite vers compte (5 pour 2 399 visites, §8) n'est plus comparable : à noter dans le registre §6 à la date de déploiement.
- **`mesure.md`** : confirme que le social n'est jamais jugé sur l'inscription (§5, §8) ; ajouter le marqueur de rupture ; la baseline 2 du 11/10 (« inscriptions totales par semaine ») change de sens à la mise en ligne. Les comptes existants : 13 (11 FREE + 2 PREMIUM lancement, §8 + brief).
- **@legal** : CGU §2 (« compte gratuit », `:21`) devient inexact ; **conflit avec le [CHOIX UTILISATEUR] du 29/09 « juridique laissé en l'état »** : ne rien modifier sans GO de Thomas pour **une seule phrase** (proposition : compte = accès à l'abonnement). Aussi CGU §3 (`:26`, « contenu quotidien » listé dans Premium alors que public), confidentialité (finalité du compte), mentions inchangées. Rétractation : statu quo.
- **SEO** : `/register` et `/login` déjà noindex ; aucune URL indexée supprimée ; fiches, listes, `/quiz-humour` inchangées ; JSON-LD sans mention « gratuit » (`json-ld.tsx` lu) ; `llms.txt` et FAQ `quizFaqs` (« 100 % gratuit, sans inscription », vrai) à garder.
- **E-mails** : brouillon aux 11 ; e-mail de bienvenue à relire (§3.4) ; reset mot de passe inchangé (`email.ts:56-81`).
- **Tests à adapter (liste non exhaustive : Glob tronqué à 100 sur 570)** : `stripe-checkout`, `parcours-progress`, `parcours-by-slug-premium`, `parcours-user-simulation`, `profil-dashboard`, `hero-section`, `faq-section`, `vannes-list`, `conseils-list`, `videos-grid`, `abonnement-layout-annual`, `blog`, `landings-s14`, `premium-offer`, `daily-content`, `safe-callback`, `blog-article-parcours-maillage` ; lancer toute la suite pour trouver les autres.
- **Hors périmètre, signalé** : les compteurs de likes et de votes ajoutent des bases fictives (`like/route.ts:10-18`, `vote/route.ts:16-21`) ; la page `/profil` ne montre aucune suppression de compte alors que la CGU §7 la promet (non vérifié ailleurs) ; plus aucune capture d'e-mail avant paiement (conséquence assumée du choix).

## 5. Plan de livraison par dépendances et critères d'acceptation
**L0** (bloquant) : GO Thomas sur D1 (§1.2 défaut A), D2 (e-mail brouillon aux 11), D3 (phrase CGU), D4 (`/onboarding` : corrigé, réservé aux comptes, après abonnement) ; 5 étalons §3.3 validés. **L1** (socle, seul) : helper `isPremium` serveur et client, `canValidateStep` séparé de `canAccessParcoursStep`, `getPostSignupRedirect`. **L2 et L3 en parallèle après L1** : L2 = §1.1 (API 403 + UI) ; L3 = §2 (register étape 1/2, `auto=1`, `/abonnement`, login, header, onboarding réservé aux comptes (après abonnement), `parcours-content`). **L4** (après L0 et L3) : textes §3.1 par @copywriter, diff mesuré. **L5** : Umami, `mesure.md`, @legal, `llms-content`, tests. **L6** : balayage §3.4 à zéro faux, E2E, `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, ligne dans `REPLIT_ACTIONS.md`.

| # | Given / When / Then (binaire) |
|---|---|
| 1 | Visiteur, `/vannes` : 10 vannes, 3 conseils, 3 vidéos, mêmes cartes verrouillées qu'avant ; aucun texte « compte gratuit » |
| 2 | Visiteur, fiche vanne/conseil/vidéo, étape 1 d'un parcours, contenu du jour, `/quiz-humour`, 1re fiche du carnet : accessibles comme avant |
| 3 | Visiteur clique « Commencer ce parcours » : arrive sur `/parcours/<slug>` sans passer par `/register` |
| 4 | Visiteur clique le CTA hero : `/register` affiche « étape 1 sur 2 », prix et formule choisie |
| 5 | Inscription e-mail ou Google réussie : redirection vers Stripe Checkout sans clic intermédiaire ; rechargement de l'URL : pas de seconde session |
| 6 | Checkout abandonné (`upgrade=cancel`) : `/abonnement` avec bouton manuel, événement `abonnement-annule`, aucun lancement automatique |
| 7 | `/register` avec e-mail existant : message + lien « Connecte-toi » gardant `callbackUrl` |
| 8 | Compte non abonné (dont un des 11 FREE) : `POST /api/user/xp`, `/api/parcours/<id>/progress` (étape 1 comprise), like serveur, vote : tous 403 ; aucune ligne supprimée en base |
| 9 | Même compte : `/profil` sans XP/série ; badge « Aucun abonnement » ; header avec « Activer mon accès » ; réaction like visible en local |
| 10 | Premium : XP, validation (étape 1 comprise), likes serveur, votes, « À toi de jouer » fonctionnent ; `/abonnement` redirige vers `/vannes` (`middleware.ts:41`) |
| 11 | `/onboarding` sans session : quiz affiché, pas de redirection `/register`, `onboarding-termine` émis |
| 12 | Balayage §3.4 : 0 occurrence fausse de « compte gratuit » (hors CGU en attente D3), 0 tiret cadratin ajouté, « 1 500+ », prix et slugs inchangés |

## Handoff
**Handoff → @orchestrator** (puis @copywriter, @fullstack, @legal, @data-analyst, @qa)
- Fichier : `/home/user/Marrant/docs/product/suppression-compte-gratuit-s15.md`
- Décisions prises : 3 états ; XP, série, validation, likes serveur, votes, « À toi de jouer » = Premium ; visiteurs inchangés ; 11 comptes en état « non abonné » (défaut A) ; compte créé à l'abonnement avec Checkout automatique ; `/onboarding` public hors tunnel
- Points d'attention : D1 à D4 à valider par Thomas ; CGU §2 en conflit avec le choix du 29/09 (une phrase, GO) ; rupture de série Umami à dater ; balayage §3.4 (articles en base, e-mails, pages non lues) obligatoire car Grep était indisponible ; howToApply déjà présent dans la charge de la page ISR (verrou d'interface, pas de sécurité)
