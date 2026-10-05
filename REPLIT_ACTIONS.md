# Actions Replit — Deviens-marrant.fr

## s15 (06/10/2026, ~00:15 Paris) : DÉPLOYÉ par la session, Worker `4eebf8aa-682d-4b7e-9f33-f2b3ed37bd9f` (N-1 `c5c0529b-db00-4cd7-bfca-218bf1273c01`)

- Contenu : `9c1367b` (test d'intégration route → vrai `buffer-client` par réseau, alerte de repli image → texte LinkedIn, marqueurs conservés sur échec, pont du quiz dans le générateur, test d'heure A/B par jour X et Instagram du 12/10 au 09/11 mardi à jeudi, heures B : X 09:00, IG 12:30 ; LinkedIn garde l'heure A pendant le test image).
- Contrôles : tsc 0, lint 0 erreur, Jest 3 155 PASS / 2 skipped (212 suites). Prod : `/`, `/liens`, `/liens/x`, `/liens/li`, `/register`, `/api/health` 200, `/liens/ig` 404 ; 3 réseaux ouverts, canaux ok.
- Dry-run `relance-s15` (non inséré) : 0 erreur bloquante jusqu'au 02/11 (38 posts) ; 122 manques de stock du 03/11 au 03/01 (attendu : pilote P0 du 09/10, 14 hors lot, vague V1). Les fichiers `lot-relance-s15.{md,json}` du dépôt restent l'ancienne version (140 posts) : NE PAS INSÉRER, régénérer.
- Carrousel 4 cartes du post IG du 07/10 (S1) NON appliqué : le rendu exige 5 parties dont « Le quiz est dans le lien de la bio. », fausse tant que les liens de bio ne sont pas posés ; le post reste en 2 cartes (format validé).

## s15 (05/10/2026, nuit) : correctifs cycle 7 (QA 1 et 5, @social F1 et S3) @fullstack : **À DÉPLOYER** (butoir : avant le 1er post `[heure:B]`, mer. 14/10 07:00 UTC ; l'alerte de repli avant le 13/10 06:00 UTC)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration (marqueurs dans `directorNote`), aucun package, aucune variable d'env, aucun event Umami. Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK, Jest 3 155 PASS / 2 skipped (212 suites).
> - **publish-social** : repli LinkedIn image → texte = e-mail d'alerte, 1 par jour (clé `social-repli-image-linkedin`, mécanisme `sendDailyPublishFailureAlert`, e-mail en échec sans effet sur l'envoi). Échec définitif (400/401/403, retry épuisé, X trop long) : les marqueurs `[variante:…]`, `[heure:…]`, `[article:…]`, `[repli:…]`, `[date:…]` sont conservés en tête de la note (compteur par bras juste).
> - **Test d'heure alterné par jour** (`mesure.md` §7 c) : `HEURE_B_PARIS` X 09:00, Instagram 12:30, LinkedIn 17:15 inactif ; `TEST_HEURE` X et Instagram du 12/10 au 09/11 exclu, LinkedIn `null` (heure A tant que le test image tourne) ; mar. à jeu. seulement : mar. A, mer. B, jeu. A, puis l'inverse (`src/lib/social/heure-test.ts`). Le script de lot pose `[heure:A|B]` ; la reprise (`replanifierRetards`) garde l'heure B d'un post `[heure:B]`.
> - **Pont du quiz** : `FORMULES.quizCourt` = « Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription : ».
> - **Test d'intégration** : `publish-social-buffer-reel.test.ts`, route + vrai `buffer-client` + vrai rendu de carte (seuls `fetch`, Prisma et e-mail simulés), textes exacts de `lot-semaine0.json`.
> - **Dry-run `relance-s15 --pool strict`** (rien inséré, fichiers du dépôt non modifiés) : lot complet 12/10 au 03/01 = 122 erreurs bloquantes, toutes de stock (« aucune vanne ne passe », dès le 03/11 ; identique avec l'ancien pont). Fenêtre `--fin 2026-11-02` : 0 erreur, 38 posts (X 16, Instagram 16, LinkedIn 6), 0 vanne de `semaine0`, LinkedIn image 2 / texte 2, heure X A 5 / B 4, Instagram A 5 / B 4.
> - **Après déploiement** : rien à vérifier en prod tant qu'aucun post `[heure:B]` ou `[variante:image]` n'est en base ; au 1er `[variante:image]`, suivre le point 4 de la notation QA cycle 7.

## s15 (05/10/2026, ~22:45 Paris) : DÉPLOYÉ par la session, Worker `c5c0529b-db00-4cd7-bfca-218bf1273c01` (N-1 `16638a00-0521-444a-9a85-642c1f498104`, avant : `c32b0f0b-ea8b-479d-a972-eaef036a1739`)

- Contenu : `81641f8` (LinkedIn carte unique 4:5 en test alterné dès le 13/10, contrôle « pain » sur la base) + `4c108db` (`/liens` 3 routes, `origine`/`contenu`, navigateur intégré, e-mail avant Google) + correctif de la session : `/liens/[reseau]` répondait 404 en prod avec `dynamicParams = false` (OpenNext) ; passé à `true`, 404 conservé par `notFound()` (test adapté).
- Contrôles avant déploiement : tsc 0, lint 0 erreur, Jest 3 133 PASS / 2 skipped (210 suites).
- Vérifié en prod : `/liens`, `/liens/x`, `/liens/li` 200 (UTM `utm_source=x|linkedin`, `utm_campaign=bio`, `utm_content=bio-*`), `/liens/ig` 404, `/register`, `/login`, `/quiz-humour`, article n°1 et `/api/health` 200 ; 3 réseaux ouverts, canaux Buffer ok.
- **Preuve Buffer avec les URL réelles (05/10, ~23:00)** : post LinkedIn de test `[variante:image]` inséré REJECTED (jamais publiable), `/api/social/image?postId=…&slide=0` = 200 `image/png` 1080×1350 en 3,0 s (rendu relu) ; brouillon Buffer LinkedIn 1 image `6ac4092438629554e340a405` et brouillon Instagram 2 cartes (post réel de semaine0, slides 0 et 1) `6ac409274e17d6a1b256ddc3` acceptés (`status: draft`, assets image) puis supprimés ; post de test supprimé de la base.
- Reste : liens de bio des 3 comptes à pointer vers `/liens` (Instagram), `/liens/x`, `/liens/li` (action dans les applications, Thomas ou session si accès) ; tests sur appareil des navigateurs intégrés `[À VÉRIFIER]` (Thomas a renoncé aux tests sur téléphone : surveillance des événements `inscription-*` par `origine`) ; lot `relance-s15` à régénérer avec les marqueurs `[variante:…]` avant le 13/10.

## s15 (05/10/2026, nuit) : parcours réseau → site, C2 et C3 (`/liens` 3 routes, `origine`/`contenu`, navigateur intégré) @fullstack : **À DÉPLOYER** (butoir 10/10, avant le J0 du 12/10)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration, aucun package, aucune variable d'env, aucun nouvel événement Umami (2 propriétés ajoutées). Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK (`/liens` ○, `/liens/x` et `/liens/li` ● prérendues, `/register` et `/login` ○ statiques), Jest 3 133 PASS / 2 skipped (210 suites).
> - **C1 `/liens`** : 3 routes (`/liens` Instagram, `/liens/x`, `/liens/li`, `liens/[reseau]` en `dynamicParams = false` : toute autre route = 404), ISR 300 s. Ordre : article publié depuis moins de 48 h, sinon quiz `/quiz-humour` ; l'autre ; vanne du jour ; Répartie ; vannes ; conseils. Chaque lien : `utm_source` du réseau, `utm_medium=social`, `utm_campaign=bio`, `utm_content=bio-*` du bloc. Article statique (date seule) : 48 h comptées depuis minuit UTC du jour.
> - **C2 attribution** : `utm_source`/`utm_content` lus à chaque page (sessionStorage, listes blanches `x|instagram|linkedin` et les 11 `utm_content` de v5 §2), ajoutés en `origine`/`contenu` à `quiz-termine`, `parcours-etape`, `inscription-envoi`, `inscription-reussie` (e-mail et retour Google), `onboarding-termine`, `blog-cta-clic` ; `src`, `methode` et autres propriétés intacts ; sans arrivée sociale, événement inchangé.
> - **C3 à C5 inscription** : `order-first` retiré (e-mail avant Google pour tous). Navigateur intégré détecté au montage (agent utilisateur, sans middleware ni `Vary`) sur `/register` ET `/login` : Google désactivé + message v5 §2.4 + « Ouvrir dans mon navigateur » (Android : URL `intent:` vers Chrome) et « Copier le lien » (en premier sur iOS) ; le lien garde `callbackUrl`, `src`, `origine`, `contenu`. **Réglage par application dans `apps/web/src/config/in-app-browser.ts`** : Instagram, Facebook, LinkedIn = Google bloqué ; X = Google actif `[HYPOTHÈSE : à reproduire sur appareil]`. Si le test contredit, changer la ligne de l'application, rien d'autre.
> - **Après déploiement** : `curl -s -o /dev/null -w "%{http_code}\n"` sur `/liens`, `/liens/x`, `/liens/li` (200) et `/liens/ig` (404) ; puis remplacer les liens de bio provisoires par `/liens`, `/liens/x`, `/liens/li`. **Tests appareil (v5 §2.6, avant le J0 de chaque réseau)** : dans Instagram, X, LinkedIn, puis Safari et Chrome : (1) marqueur détecté ou non, (2) Google refusé ou non (`disallowed_useragent`), (3) inscription e-mail aboutie dans l'application, (4) bascule : « Ouvrir dans mon navigateur » (Android) et copie du lien (iOS), arrivée sur `/register?…&origine=…&contenu=…`, (5) un événement Umami de test portant `origine`. Consigner ici les résultats et la date (registre des J0, `mesure.md` §6).

## s15 (05/10/2026, nuit) : LinkedIn carte unique 4:5 en test alterné texte / image dès le 13/10 @fullstack : **À DÉPLOYER** (avant le 1er post `[variante:image]`, au plus tard le 13/10 06:00 UTC)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration (marqueurs dans `directorNote`), aucun package, aucune variable d'env, aucun event Umami. Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK, Jest 3 133 PASS / 2 skipped (210 suites).
> - **`/api/social/image`** : un post LINKEDIN dont `directorNote` porte `[variante:image]` et qui est éligible (`threadParts` = [amorce, chute], texte de 2 lignes dont la 1re est l'amorce mot pour mot, sans lien, amorce de 140 caractères au plus) reçoit **1 carte 4:5 1080×1350**, exactement la carte chute violette d'Instagram (chute seule, « » R6, pied, sans « Glisse »). Les autres posts LinkedIn gardent l'ancien rendu (aperçu admin). `carteVanneUnique("linkedin")` passe de 1200×627 à 4:5 et n'a plus de repli amorce + chute (amorce > 140 refusée).
> - **publish-social** : un post `[variante:image]` éligible part par `createBufferImagePost` (1 image `slide=0`, texte = l'amorce seule, alt = amorce + chute avec « », sans métadonnée Instagram). La carte est d'abord **rendue dans le Worker** (pas d'appel à l'URL publique) ; si le rendu échoue ou si le post n'est pas éligible : **texte seul** (`post.content` complet, amorce + chute), post PUBLISHED, `directorNote` passé à `[variante:texte] … Repli texte seul (prévu avec carte) : <cause>`. `[variante:texte]`, X, Instagram : inchangés. `[variante:…]` survit aux relances.
> - **Script de lot** (hors Worker) : dès `LI_TEST_IMAGE_DES` = 13/10, les vannes LinkedIn éligibles alternent `[variante:image]` / `[variante:texte]` (paires de même note du pool si possible, sinon alternance simple, ordre inversé d'une paire à l'autre) ; bras image : `threadParts` = [amorce, chute], 1 URL `slide=0`. Compteur par bras dans le récapitulatif (.md et console). Relais avec lien (L3), textes de marque (L2) : hors test. **« pain »** : contrôlé aussi contre les posts déjà en base (30 jours, tous réseaux).
> - **Lot `relance-s15` à régénérer** pour porter les marqueurs (`--lot relance-s15 --pool strict`, dry-run), puis relecture avant insertion.
> - **Après déploiement** : `curl -s -o /dev/null -w "%{http_code} %{content_type} %{time_total}\n" "https://deviens-marrant.fr/api/social/image?postId=<id LinkedIn [variante:image]>&slide=0"` → 200 image/png ; brouillon Buffer LinkedIn image réel (preuve K4) puis suppression. Preuves locales : `docs/social/visuels-s15/v5-linkedin/` (2 PNG + `alt.json`, `scripts/render-carte-linkedin.ts`).

## s15 (05/10/2026, soir) : correctifs QA cycle 6 (R1 longueur X, R4 alerte 429, insertion HTTP) @fullstack : **DÉPLOYÉ** le 05/10 à 20:03 UTC par la session (Worker `c32b0f0b-ea8b-479d-a972-eaef036a1739`, N-1 pour `wrangler rollback` : `0edcaee7-9e95-4b61-9acb-4c22ff8861f0`). Preuve R1 : brouillon X réel du texte exact du post du 07/10 (328 bruts) accepté par Buffer (`status: draft`) puis supprimé ; interrupteurs relus : 3 réseaux ouverts ; accueil 200.

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé** (la session principale déploie). Aucune migration, aucun package, aucune variable d'env, aucun event Umami. Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK, Jest 3 026 PASS / 2 skipped (203 suites).
> - **BLOQUANT, à déployer avant le 07/10 10:15 UTC (R1)** : `src/lib/social/buffer-client.ts`, `ensureContentLength` compte X comme X (`longueurX`, lien = 23, même fonction que la route) au lieu de la longueur brute ; s'applique aux 2 chemins (texte seul et avec image). Sans ce déploiement, le post X du 07/10 (quiz, 328 bruts, 244 comptés par X) passe en FAILED « Contenu trop long ». LinkedIn et Instagram : inchangés (longueur brute).
> - **R4** : `publish-social`, un 429 Buffer (réseau bloqué 24 h) envoie maintenant une alerte, 1 par jour et par réseau (clé `social-429-<réseau>`, verrou existant) ; un e-mail en échec ne casse pas le passage.
> - **Script d'insertion** (`scripts/content/social-lot-v5-insert.ts`, hors Worker) : en `--driver=neon-http`, `--insert` = UNE instruction `INSERT` multi-lignes (`$executeRaw`, enums castés, `text[]`, `createdAt`/`updatedAt` = `NOW()`) et `--rollback --confirmer` = UN `UPDATE` (même filtre). Vérifié : `updateMany` échouait AUSSI en HTTP (« Transactions are not supported in HTTP mode »). Pilote `tcp` inchangé. Reste à prouver `[LIVE]` sur une branche Neon avant le lot 1a du 09/10 : `--insert --driver=neon-http` puis `--rollback --lot <id> --confirmer`.
> - **Après déploiement** : brouillon X réel (`saveToDraft`) du texte de `c2acdc88…` puis suppression (preuve R1, voir `docs/social/notation-relance-cycle6-qa.md`).

## s15 (05/10/2026, 21:45 Paris) : RÉSEAUX ROUVERTS, démarrage avancé au mar. 06/10 (Thomas : plan validé, « qu'est-ce qui ne va pas ? ») : FAIT par la session

- **Aucun déploiement** (Worker inchangé : `0edcaee7-9e95-4b61-9acb-4c22ff8861f0`, N-1 `108da3e7-bac9-42fe-b6b1-71bedcd0143d`).
- **Lot `semaine0` (06/10 au 09/10) inséré en APPROVED** (`approvedBy` « lot-semaine0 ») : 10 posts, X 4 (12:30), Instagram 4 (19:30, carrousel 2 cartes), LinkedIn 2 (mar. et jeu. 08:15). Vannes du pool strict uniquement (≥ 8,5 chez 2 relecteurs). Échanges manuels relus : vannes de bureau sur LinkedIn (Rome, visio), ~~vanne mentionnant « une IA » retirée~~ **erreur corrigée le soir même : la vanne du prof est rétablie le 09/10 (l'IA comme sujet de vanne est autorisée, choix du 30/09 ; la règle interdit seulement de dire qu'un contenu est écrit par une IA)**. Contrôles bloquants : 0 erreur, 0 doublon. Fichiers : `docs/social/preparation/lot-semaine0.{md,json}` (le .md est le dry-run d'avant les échanges, le .json fait foi).
- **Script** : `J0` du lot avancé au 06/10 pour les 3 réseaux (`apps/web/scripts/content/social-lot-v5-config.ts`) ; les jalons de mesure restent comptés depuis `J0_SOCIAL` = 12/10. Jest social : 335 tests OK.
- **Défaut trouvé** : `--insert --driver=neon-http` échoue (« Transactions are not supported in HTTP mode » : `createMany` via l'adaptateur HTTP). Insertion faite par une requête SQL multi-lignes unique (mêmes garde-fous : période, ids, autres posts actifs = 0). **À corriger dans le script avant le lot 1a du 09/10.**
- **Interrupteurs** : LINKEDIN, TWITTER, INSTAGRAM repris via `/api/admin/social/platforms` (05/10 19:44 UTC), canaux Buffer connectés (`isDisconnected:false`, files non en pause). Cartes Instagram vérifiées en prod (`/api/social/image`, slides 0 et 1).
- **Premiers posts** : LinkedIn 06/10 08:15, X 12:30, Instagram 19:30 ; vérifications H+45 programmées (routines).

## s15 (05/10/2026) : fiabilité de la relance sociale (QA cycles 1 à 3) : lots par tranche, reprise sûre, garde des relais, job de couverture @fullstack

> Commit local, non poussé, non déployé, **rien inséré en base**. **Aucune migration** (marqueurs dans `directorNote`), aucun package, aucune nouvelle variable d'env (`ADMIN_EMAIL`, `RESEND_API_KEY`, `BUFFER_*`, `ADMIN_PASSWORD` existants), aucun LLM, aucun event Umami. Contrôles : `tsc -p tsconfig.build.json` 0, `next lint` 0 erreur, `npm run build` OK, Jest 3 010 PASS (baseline 2 954).
> - **Déploiement normal** (`build:cf` puis `deploy:cf`). Effets en ligne, réseaux toujours en pause tant que l'admin ne les reprend pas.
> - **Script de lot** (`prepare-social-month.ts`, jamais lancé ici) : `--lot <id libre> --debut AAAA-MM-JJ --fin AAAA-MM-JJ [--pool fichier|strict]` (dry-run) ; `--pool` = vannes autorisées dans l'ordre (meilleures d'abord, sans mélange), `strict` = `src/config/social-pool.ts` (40 vannes au niveau, Alexa V100 exemptée, ordre par note moyenne des 2 relecteurs) ; retour à 90 jours **sur un autre réseau** que la 1re diffusion, sauf pénurie (avertissement). approvedBy = `lot-<id>` (`thomas-s15` pour `relance-s15`, bornes par défaut 12/10 au 03/01). `--insert [--driver=neon-http]` : refus si un autre post actif occupe la période, puis **contrôle après insertion** par réseau et par semaine (attendu contre inséré, code 1 si écart). `--rollback --lot <id>` : comptes seulement ; `--rollback --lot <id> --confirmer` : posts APPROVED jamais envoyés du lot en REJECTED, comptes avant et après ; réinsertion sous un nouvel identifiant.
> - **Marqueurs posés par le lot** : `[article:<slug>]` (relais), `[repli:<id>]` (relais d'un article pas encore visible : un **repli** en réserve, vanne du même thème sans lien, inséré en REJECTED avec `[repli-de:<id du relais>]`), `[date:AAAA-MM-JJ]` (pivot, saison). Le lot `relance-s15` déjà relu doit être **régénéré** pour porter ces marqueurs.
> - **publish-social** : garde `articleSlug` : un relais part seulement si l'article est visible (`findBlogArticle`, même règle que la page) ; sinon relais REJECTED et son repli part **sur le même créneau** ; sans repli, créneau vide ; alerte par réseau (`social-relais-<réseau>`). Alerte d'échec Buffer **par réseau** (`social-echec-<réseau>`, C8). Les marqueurs survivent aux relances.
> - **Reprise** (`/api/admin/social/platforms`) : **503 si Buffer est injoignable** ; posts en retard de plus de 24 h, relais et posts datés : REJECTED « expiré à la reprise » ; le reste 1 par jour, jamais un dimanche ni un jour de silence (11/11, 27/11), à l'heure de Paris du réseau (X 12:30, Instagram 19:30, LinkedIn 08:15, heure d'hiver comprise). Nouvelle action `{"platform":"TWITTER","action":"sauter-avant-j0","j0":"2026-10-19"}` : posts APPROVED datés avant le J0 passés en REJECTED.
> - **Job 5 ter « couverture »** (scheduler, 5h-21h UTC, verrou horaire) : pause automatique après 2 FAILED consécutifs depuis la reprise ; file basse (< 10 jours) ; tranche en retard à sa date de prêt (9 tranches du plan, J-14, insérés < prévus par réseau) ; **stock < 14 par réseau sur le pool strict** ; e-mails de lancement de tranche (et rappel si une file passe sous 21 jours), de vague V1 à V4 (démarrage et livraison), de jalon (dimanche d'avant J+14 à J+112, J0 12/10 dans `social-calendrier.ts`). 1 e-mail par jour, par réseau et par type, avec la consigne à coller. E-mail du lundi : consigne du relevé `docs/social/releves/AAAA-MM-JJ.md`.
> - **À tenir à jour** (commit + déploiement) : `src/config/social-pool.ts` à chaque vague validée ; `J0_SOCIAL` si un réseau glisse.
> - **Après déploiement** : `curl -s -X POST -H "Authorization: Bearer $ADMIN_PASSWORD" -H "Content-Type: application/json" -d '{"platform":"LINKEDIN","action":"sauter-avant-j0"}' https://deviens-marrant.fr/api/admin/social/platforms` → 400 (j0 manquant) ; `npx wrangler tail` : ligne `[scheduler:social-couverture]` au plus une fois par heure entre 5h et 21h UTC.

## s15 (05/10/2026) : lot complet de relance des 3 réseaux, préparé en DRY-RUN @fullstack

> Commit local, non poussé, non déployé, **rien inséré en base**. Aucune migration, aucune variable d'env, aucun event Umami. **1 devDependency** : `@prisma/adapter-neon@6.19.2` (+ `@neondatabase/serverless`), utilisée seulement par le script d'insertion (jamais importée par `src/`, absente du Worker).
> - **Lot** : `docs/social/preparation/lot-relance-s15.md` (relecture) et `lot-relance-s15.json` (lignes exactes) : 140 posts du 12/10/2026 au 03/01/2027 (X 58 à 12:30, Instagram 58 à 19:30, LinkedIn 24 à 08:15, heures de Paris, heure d'hiver du 25/10 vérifiée). Généré par `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15` (SELECT seulement).
> - **Insertion (plus tard, par la session principale)** : `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --insert` (Prisma TCP) ou `--insert --driver=neon-http` (adaptateur HTTP Neon si le port 5432 est bloqué). Insère le JSON tel quel en APPROVED, `approvedBy = thomas-s15` ; refus si des posts `thomas-s15` existent déjà sur la période. Les interrupteurs par réseau décident ensuite de la publication.
> - **publish-social (effet après déploiement)** : la limite X de 270 se compte comme X (lien = 23, `src/lib/social/longueur-x.ts`) ; avant, l'URL UTM complète faisait échouer en FAILED tout post X avec lien (X3, relais, quiz).
> - **Carrousel de décryptage** : `threadParts` à 5 parties (amorce, chute, mécanisme, consigne, renvoi) = 4 cartes rendues par `/api/social/image` (`carrouselDecryptage`).

## s15 cycle 4 (05/10/2026) : visuels sociaux v4 (R6 sur cartes, décryptage 4 cartes, relais 2 cartes) @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun nouvel event Umami.
> - **Gabarits** (`templates/cartes-piste-a.tsx`, `carte-marque.tsx`, `carrousel-piste-a.ts`) : vanne à la 1re personne entre « » (lilas, « suspendu), « géant du conseil retiré, trait d'union en Inter, chiffre géant des couvertures retiré (nombre du titre en lilas, 64 px garantis au-dessus du pied), amorce 88 px, `carrouselDecryptage` (4 cartes), `carrouselRelais` (2 cartes), `defautsLegende`. LinkedIn : bouton « Lien dans le post », plus de « Glisse ».
> - **Effet en production après déploiement** : les carrousels Instagram générés par `generate-post-image.ts` (vanne, article) prennent ce rendu ; aucun réseau ne publie tant que les interrupteurs restent en pause.
> - **Visuels** : `docs/social/visuels-s15/v4/` (11 PNG + 6 tests de charge, `index.md`, `alt.json`).

## s15 cycle 3 (05/10/2026) : visuels sociaux v3 + chaîne de publication (interrupteur par réseau, LinkedIn, carrousel Instagram) @fullstack

> Commits locaux, non poussés, non déployés. **1 migration** (`11_social_platform_switch`, additive, idempotente, testée 2 fois de suite sur une base Postgres jetable), aucun package, aucune nouvelle variable d'env (`BUFFER_*`, `RESEND_API_KEY`, `ADMIN_PASSWORD` existants), aucun LLM, aucun nouvel event Umami.
> - **1. Migration Neon AVANT le déploiement du code** (le client Prisma du nouveau code lit les nouvelles colonnes) : depuis `apps/web`, avec le `DATABASE_URL` de production :
>   `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/11_social_platform_switch/migration.sql`
>   Crée `SocialPlatformSetting` avec **les 3 réseaux EN PAUSE** (X, Instagram, LinkedIn : rien ne part après déploiement) et ajoute à `SocialPost` : `imageUrls`, `bufferStatus`, `bufferCheckedAt`, `alertedAt` (+ index). Rejouable : une 2e exécution ne change aucun réglage fait dans l'admin.
> - **2. Déploiement Cloudflare normal** (`build:cf` puis `deploy:cf`).
> - **Interrupteur** : admin social (`/admin/social`, bloc « Publication par réseau ») : Pause / Reprendre par réseau, sans redéploiement (`/api/admin/social/platforms`, Bearer `ADMIN_PASSWORD`). Ligne absente ou base illisible = pause. Reprise refusée tant que le canal Buffer est déconnecté (et, depuis la section « fiabilité » du 05/10 ci-dessus, si Buffer est injoignable) ; posts en retard : voir cette section (plus de 24 h, relais et posts datés = REJECTED, le reste 1 par jour hors dimanches et silences, à l'heure de Paris). `PAUSED_PLATFORMS` supprimé : LinkedIn se publie dès qu'il est repris.
> - **Pause automatique** : à chaque passage de publish-social, un canal Buffer `isDisconnected` / `isLocked` / introuvable met son réseau en pause + e-mail (1 seul, `alertSentAt` posé après envoi). Même chose sur une erreur d'autorisation à la remise ou à la relecture. **Constat du 05/10 : le canal Instagram est déconnecté chez Buffer** (requête `channels`) → au 1er passage, e-mail « Instagram mis en pause automatiquement ». **Action Thomas** : reconnecter Instagram dans Buffer avant de reprendre.
> - **Alertes (D1)** : verrou « 1 e-mail par jour » posé APRÈS l'envoi accepté par Resend (`sendAdminAlert` renvoie un booléen et lit `{ error }`). Les posts à signaler gardent `alertedAt = null` jusqu'à l'envoi : aucune alerte perdue.
> - **Relecture Buffer (D2, D4)** : pages de 100 posts avec curseur, puis lecture par identifiant des absents (25 max par passe). Supprimé chez Buffer → FAILED `introuvable` ; bloqué `scheduled`/`sending` 6 h après l'heure prévue → `non_confirme` ; fenêtre 30 jours ; note du directeur conservée ; `sentAt` illisible sans casser le lot.
> - **Fils X interdits** : plus de découpage automatique ; un post X de plus de 270 caractères passe en FAILED « fil X interdit » (`createBufferThread` supprimé).
> - **Carrousel Instagram** : chaque post Instagram préparé (vanne ou relais d'article) part en carrousel v3 4:5 (1 URL par slide `/api/social/image?postId=…&slide=N`, ou `imageUrls` en base), texte alternatif amorce + chute. Vérifié le 05/10 : brouillon Buffer réel (`saveToDraft`, jamais programmé) à 3 images + alt sur le canal Instagram, accepté (`type: post`, `carousel` refusé pour Instagram), id `6ac3d30ed394a1ebb7bb3853`, supprimé aussitôt (`deletePost` OK, relecture NOT_FOUND). Refait le 05/10 avec les cartes v4 : brouillons à **2 images** (`6ac3dcbaa3332ccdd882b57d`) et à **4 images** (`6ac3dcbb1e475b8bb4506a37`) acceptés (`status: draft`, `type: post`, assets `image/png`), supprimés, relecture NOT_FOUND (`docs/social/visuels-s15/v4/index.md`). Cartes v4 : colonne de texte fixe (x = 144), espace entre mots +0,06 em, lignes imposées par `\n` (`mise-en-lignes.ts`), aucune action Replit.
> - **LinkedIn** : `prepare-social-month.ts` prépare X + Instagram + LinkedIn selon la cadence de `strategie-relance-v2.md` (`CADENCE_V2`, paramétrable pour la v3) ; LinkedIn mar./jeu. 08:15, relais d'article à angle bureau (lien UTM en 1er commentaire, colonne `cta`) sinon vanne BOULOT ; X mercredi = vanne + quiz ; Instagram mercredi = carrousel décryptage à préparer à part (avertissement).
> - **Rapport « prévu contre publié »** : admin social (7 jours) + `/api/admin/social/report?jours=N` + section dans l'e-mail du lundi (écart = prévus échus non confirmés, doit être 0).
> - **Visuels v3** : `docs/social/visuels-s15/v3/` (35 PNG, `index.md`, `alt.json`) ; polices `PlusJakartaSans-Bold.ttf` et `-ExtraBold.ttf` ajoutées, `Syne-*.ttf` supprimées.
> - **Après déploiement** : `/admin/social` → les 3 réseaux « En pause », Instagram « Canal en panne » tant qu'il n'est pas reconnecté ; 1 e-mail de pause automatique Instagram ; `curl -s -H "Authorization: Bearer $ADMIN_PASSWORD" https://deviens-marrant.fr/api/admin/social/report?jours=7` → JSON. Reprise d'un réseau : seulement après validation des posts modèles par Thomas.

## s15 (05/10/2026) : prototype rendu des cartes sociales « piste A » (carrousel 4:5, X, LinkedIn) @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami. **Publication inchangée** : `generate-post-image.ts` et Buffer appellent toujours les anciens gabarits carrés.
> - **Nouveaux fichiers** : `src/lib/social/typo.ts` (typographie française), `templates/carte-marque.tsx` + `templates/cartes-piste-a.tsx` (cartes), `carrousel-piste-a.ts` (composition), `renderSlides()` dans `image-generator.ts` (largeur et hauteur par slide). Polices `public/fonts/Syne-Bold.ttf` et `Syne-ExtraBold.ttf` (OFL) ajoutées, lues comme Inter (fichier local, binding ASSETS sous Workers, repli CDN gstatic).
> - **Gabarits hérités** (audit §5.8-9) : « » au lieu de `&ldquo;`, « Glisse » au lieu de « Swipe », « 50+ techniques » retiré, italique non rendu retiré, aucun texte sous 28 px.
> - **Rendu local** : `cd apps/web && npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-visuels-piste-a.ts` → `docs/social/visuels-s15/v2/`.
> - **Après déploiement** : rien à vérifier côté publication (aucun appel des nouvelles cartes en production tant que Thomas n'a pas validé les modèles).

## s15 (05/10/2026) : relecture du statut réel des posts Buffer + alerte d'échec @fullstack

> Commit local, non poussé, non déployé. **Aucune migration**, aucun package, aucune nouvelle variable d'env (`BUFFER_ACCESS_TOKEN`, `BUFFER_ORGANIZATION_ID`, `RESEND_API_KEY`, `ADMIN_EMAIL` existants), aucun LLM, aucun event Umami.
> - **Déploiement normal.** Nouveau job du scheduler `runBufferStatusCheckJob` (après publish-social, verrou horaire `buffer-status-check-AAAA-MM-JJ-hHH` non relâché : 1 passage par heure) et tâche de démarrage `reconcileBufferPostStatusesTask` (rattrapage, idempotente). Un seul appel GraphQL Buffer (`posts`, statuts `sent` + `error`, 100 plus récents, timeout 5 s).
> - **Sens des statuts** : PUBLISHED = remis à Buffer. Confirmé = ligne « Publication confirmée par Buffer le <sentAt> : <lien réel> » ajoutée à `directorNote` et `publishedAt = sentAt`. Buffer en `error` → FAILED + note « Échec publication Buffer : <message> (détail : <rawError>) ». Candidats : PUBLISHED non confirmés, `publishedAt` de moins de 7 jours. Buffer injoignable : aucun changement, nouvel essai l'heure suivante.
> - **Alerte** : e-mail à `ADMIN_EMAIL` (plateforme, message Buffer, « reconnecter le canal dans Buffer »), au plus 1 par jour et par plateforme (verrou `buffer-status-alert-<plateforme>-AAAA-MM-JJ`).
> - **Publication inchangée** : `PAUSED_PLATFORMS` (LinkedIn) intact, aucun post republié automatiquement.
> - **Après déploiement** : `/api/cron/startup-tasks` (ou le premier tick) doit passer le post Instagram du 02/10 en FAILED (admin social : note « Échec publication Buffer : Buffer has lost authorization… ») et envoyer 1 e-mail Instagram. **Action Thomas** : reconnecter le canal Instagram dans Buffer, puis reprogrammer le post.

## s15 (05/10/2026) : tunnel visiteur → inscrit → Premium réparé et mesuré, IndexNow protégé et étendu au catalogue @fullstack

> **Déployé le 05/10/2026 (Worker `fa296917`).** Aucune migration, aucun package, aucune nouvelle variable d'env (`CRON_SECRET`, `ADMIN_PASSWORD`, `INDEXNOW_KEY` existants), aucun LLM. Détail : `docs/qa/tunnel-inscription-s15.md`.
> - **Déploiement normal.** Plus de modale d'inscription : tous les boutons « créer un compte » d'un anonyme sont des liens `/register?callbackUrl=<destination>&src=<origine>` (header, accueil, fin d'article, quiz, parcours, /abonnement, modale Premium, fiches). Header : lien « Connexion » ajouté. `/login` : bouton « Créer un compte ». `/onboarding` anonyme → `/register` en 1 saut ; `/profil`, `/favoris` → `/login` en 1 saut. Formule choisie sur /abonnement retrouvée après inscription.
> - **Nouveaux événements Umami** (kebab-case, aucune donnée personnelle) : `inscription-envoi`, `inscription-reussie` {methode, src}, `connexion-reussie` {methode}, `onboarding-termine` {parcours}, `abonnement-clic` {formule, src}, `abonnement-reussi` {formule}, `abonnement-annule`, `quiz-termine` {profil}, `parcours-etape` {parcours, etape}. Stripe : `success_url` annuel suffixé `&formule=annuel`.
> - **Sécurité** : `POST /api/indexnow` exige `Authorization: Bearer <CRON_SECRET>` ou `<ADMIN_PASSWORD>` (401 sinon). **Cron `weekly-seo`** : notifie aussi IndexNow des URL du sitemap dont le lastmod a moins de 8 jours (1 POST, réponse `indexnow` dans le JSON), y compris en mode contenu préparé.
> - **OAuthCallback Google** : config vérifiée par curl (redirect_uri et cookies corrects) ; les 3 retours viennent d'un callback sans cookies NextAuth (navigateur intégré d'appli, délai > 15 min). Message clair ajouté. **Action Thomas** : vérifier l'URI de redirection et l'écran de consentement « En production » dans Google Cloud, faire une inscription Google réelle sur mobile ; si l'erreur revient, `npx wrangler tail` → `OAUTH_CALLBACK_ERROR`.
> - **Après déploiement** : `curl -s https://deviens-marrant.fr/ | grep -o 'href="/register[^"]*"'` (liens présents) ; `curl -sI https://deviens-marrant.fr/onboarding` → 307 `/register?callbackUrl=%2Fonboarding` ; `curl -s -o /dev/null -w "%{http_code}" -X POST https://deviens-marrant.fr/api/indexnow` → 401 ; dans Umami, voir apparaître `inscription-envoi` sous 48 h.

## s15 (05/10/2026) : titles et metas des 5 pages à CTR ≈ 0 (données GSC réelles) @orchestrator

> **Déployé le 05/10/2026 (Worker `fa296917`).** Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal.** `lib/blog-articles.ts` : title (= H1) et excerpt (= meta) de `5-types-humour-lequel-pour-toi` (« Humour observationnel : les 5 types », meta d'origine conservée avec ses humoristes, P0 Thomas), `comment-avoir-de-la-repartie` (« Avoir de la répartie : 10 techniques »), `autoderision-interactions` (« Autodérision : définition et exemples ») ; meta seule de `phrases-droles-conversations`. `/vannes` : title « Vannes et blagues drôles à ressortir », meta avec le chiffre dynamique. `/conseils` : ancre et JSON-LD alignés sur le nouveau titre répartie. Slugs, H2, FAQ, liens, chiffres du corps inchangés (empreintes du test `blog-em-dash-static` identiques hors meta).
> - **Humoristes (P0 05/10)** : règle « zéro humoriste » retirée du prompt `seo-blog-agent` (citations réelles bienvenues) et du contrôle bloquant `scripts/content/social-controls.ts`.
> - **Après déploiement** : vérifier le `<title>` servi des 5 pages, puis annoter le 05/10 dans GSC ; mesure à J+28 (cibles : `docs/seo/avis-donnees-reelles-s15.md` §8).

## s14 (05/10/2026) : « À lire ensuite » des articles CATALOGUE en base (notation B4 iter1) @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal**. Les articles forte frappe en base n'héritent plus des satellites du cluster `fort-volume` (« Comment faire rire une fille » sous la fête des mères) : liste dédiée par slug (`src/config/blog-related-cards.ts`), puis l'étalon ; « faire rire une fille / un homme » gardé seulement sous premier message et couple. Pas de remplissage par catégorie : moins de 3 cartes si les voisins ne sont pas encore publiés.
> - **Visibilité** : un article non publié ou programmé n'est jamais proposé (filtre SQL + `isBlogArticleVisible`). Étalon et 30 articles statiques : maillage inchangé. À vérifier après déploiement : bas de page de B4 (fête des mères).

## s14 (05/10/2026) : forte frappe, correctifs de code des notations B1/B2/A5 iter2 et A1/A3/A4 iter3 @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami. Texte stocké des vannes inchangé (tout se joue au rendu).
> - **Déploiement normal, avant le 22/10** (1re publication programmée). **Dates** : `publicUpdatedAt` (`lib/blog-visibility.ts`) : un article corrigé avant sa sortie n'affiche plus « Mis à jour le », ni `dateModified`, ni `lastmod` du sitemap, ni « Mis à jour » dans llms-full ; affichage seulement si updatedAt > date de publication.
> - **Guillemets** : seul un « » DANS un « … » extérieur passe en “…” (B2, A4, affiché et partagé, « » extérieurs gardés) ; les « » des messages A3 en blockquote restent « » (1er niveau). **Typo** : « 4 812 » et « 23 h 40 » insécables.
> - **Config** : B2 `blagues-de-gamer-jeux-video` → encart Répartie ; A5 : bouton « Partager l'idée n°N », titre « Idée de poisson d'avril », lien inchangé (`with-url`).
> - **Import** : refus de tout commentaire HTML `<!--` (B1 « <!-- FIN --> ») ; avertissement de jour passé de lundi à jeudi (calendrier forte frappe). À vérifier après déploiement : aperçus A4 n°17 et B2 n°7 (390 px), en-tête d'A3 sans « Mis à jour ».

## s14 (05/10/2026) : aperçu admin d'un article programmé `/blog/apercu/[slug]` + script de captures @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune nouvelle variable d'env (`ADMIN_PASSWORD` existant), aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal**. `https://deviens-marrant.fr/blog/apercu/<slug>?cle=<ADMIN_PASSWORD>` : la clé est comparée en temps constant, un cookie httpOnly signé (2 h, chemin `/blog/apercu`, sans le mot de passe) est posé, puis redirection 303 sans le paramètre. Accepté aussi : `Authorization: Bearer <ADMIN_PASSWORD>`. Sans autorisation ou mauvaise clé : 404.
> - **Rendu** : même gabarit que `/blog/[slug]` (factorisé dans `components/blog/blog-article-view.tsx`), article programmé ou déjà publié, plus un bandeau « Aperçu : publication prévue le JJ/MM/AAAA » (« article publié le … » si déjà en ligne). Page publique inchangée : HTML et métadonnées des 30 articles statiques identiques octet pour octet avant/après.
> - **Discrétion** : `noindex, nofollow` (meta + `X-Robots-Tag`), `Cache-Control: private, no-store`, `force-dynamic`, absent du sitemap et de llms. Umami muet sous `/blog/apercu` : `data-before-send` sur le script (vues et événements) + garde dans `lib/umami.ts`.
> - **Captures** : `ADMIN_PASSWORD=… scripts/content/snapshot-article.sh <slug> <dossier>` (depuis apps/web) : curl de l'aperçu en Bearer, CSS et polices inlinées, Playwright en `file://` : `m00.png…` (390 px, tranches de 1600 px), `d-haut.png`, `d-bas.png` (1280 px). À vérifier après déploiement : 404 sans clé, puis captures d'un article programmé.

## s14 (05/10/2026) : articles à forte frappe en base, partage par ligne, CTA A1, parcours imposé @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal**. Config unique `src/config/blog-forte-frappe.ts` : l'étalon + 11 slugs (statiques ou en base) reçoivent un bouton par ligne numérotée. Formats : `**N.** « vanne »`, `**N.** texte` sans guillemets (A1, A2), titre `**N. Situation**` suivi d'un blockquote (A3, « » du message rendus en “…”). Texte partagé : la ligne seule, sans numéro, indication ni markdown.
> - **Mode par slug** : `with-url` (étalon et articles de blagues : comportement actuel) ; `text-only` pour les 7 articles de messages (« Envoyer le message n°N », texte seul, sans titre ni lien). Événement inchangé : `blog-vanne-partage` {slug, vanne, canal}.
> - **CTA** de `message-anniversaire-drole-par-situation` après le corps (`blog-cta.ts`). **Encart parcours** imposé : premier message et couple → Confiance, anniversaire → Répartie. **Rapport hebdo** : 12 articles suivis (+ lot B).
> - **Étalon** : rendu HTML des 30 articles statiques identique octet pour octet avant/après. À vérifier après publication d'A1 et A3 : boutons sur mobile (375 px).

## s14 (05/10/2026) : rapport hebdo des visites, section « Blog : articles à forte frappe » @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune nouvelle variable d'env (mêmes secrets `UMAMI_API_KEY`, `UMAMI_WEBSITE_ID`), aucun LLM.
> - **Déploiement normal**. L'email du lundi 7h et `POST /api/admin/visits-report?dryRun=1` (champ `report.blog`) ajoutent : événements `blog-sortie-clic`, `blog-cta-clic`, `blog-ancre-clic`, `blog-vanne-partage` semaine vs précédente, `blog-scroll` par palier (25, 50, 75, 100), puis pour chaque article de `src/config/blog-tracking.ts` (`TRACKED_ARTICLES`) : vues, variation, sorties, CTA, partages, part des vues lues à 75 %. Article non publié en base : « publication prévue le JJ/MM ».
> - **Endpoints Umami** : `metrics?type=event` (global et filtré `path=/blog/<slug>`), `metrics?type=path&path=/blog/<slug>`, `event-data/values?event=blog-scroll&propertyName=palier` (global et par path). Endpoint absent ou en erreur : section marquée « partielle », le reste de l'email part quand même.
> - **Correctif** : Umami a renommé `metrics?type=url` en `type=path` le 07/10/2025 ; le Top 5 des pages demande `path` et rejoue en `url` sur HTTP 400.
> - **À vérifier après déploiement** : lancer le dryRun, contrôler `report.blog.partial` et `report.blog.warnings` (aucune valeur secrète n'y figure).

## s14 (05/10/2026) : article « 50 blagues drôles », notation iter3, correctifs E1 à E3 @fullstack

> Correctifs de `docs/growth/notation-article-blagues-2026-iter3.md`. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun event Umami.
> - **Déploiement normal**. Contenu inchangé (0 ligne) : slug, title, meta, H1, H2 et 50 vannes (empreinte SHA-256) intacts ; FAQ du JSON-LD toujours en texte brut.
> - **Tous les articles (rendu seul)** : FAQ (questions et réponses) et titres des cartes Précédent / Suivant / « À lire ensuite » en typographie française (espace insécable avant ? ! : ; et après un nombre). `frTypo` ne pose jamais 2 insécables d'affilée.
> - **Tous les articles (rendu seul)** : mot composé court (2 parties de 8 lettres max : Post-it, week-end, Wi-Fi) jamais coupé en fin de ligne, via un span `whitespace-nowrap`. Aucun caractère ajouté, texte visible et copier-coller identiques. Mesuré : 297 mots sur les 30 articles statiques, dont 14 dans cet article.
> - **« À lire ensuite »** : 2 colonnes en desktop quand il n'y a que 2 cartes (3 sinon). Mobile inchangé. À vérifier après déploiement : captures m01, m03, m07 et desktop bas de page.

## s14 (05/10/2026) : article « 50 blagues drôles », notation iter2, correctifs D1 à D3 @fullstack

> Correctifs de `docs/growth/notation-article-blagues-2026-iter2.md`. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal**. Contenu de l'article inchangé (0 ligne) : slug, title, meta, H1, 8 H2, 50 vannes (empreinte SHA-256) intacts.
> - **Tous les articles** : « À lire ensuite » ne reprend plus un article déjà proposé en Suivant ou Précédent ; la place revient au prochain article du même cluster, sinon la section affiche moins de cartes.
> - **Tous les articles (rendu seul)** : une citation dans un passage déjà entre « … » s'affiche en “…”. Mesuré : 2 articles touchés sur 39 rendus (30 statiques + 9 réécritures en base), 40 occurrences (36 dans les 50 vannes, 4 dans techniques-humoristes-pros) ; aucun autre écart de texte visible.
> - **Surtitre de la navigation cluster** : « Blagues et vannes à ressortir », « Humour de saison », « Quand l'humour coince », « Timing et art de raconter » remplacent les libellés internes. À vérifier après déploiement : captures m00, m05, m07-m08.

## s14 (05/10/2026) : article « 50 blagues drôles », notation iter1, correctifs C1 à C13 @fullstack

> GO Thomas sur `docs/growth/notation-article-blagues-2026-iter1.md`. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM.
> - **Déploiement normal**. Slug, title, meta, H1, 8 H2, 50 vannes (empreinte SHA-256), Définition, CLEF et FAQ inchangés. Contenu : environ 15 lignes modifiées sur 210 (sommaire remonté en 2e paragraphe + ancre Inclassables, lien « machine à café » vers `/parcours/machine-a-cafe`, 4 sorties de section réécrites, thèmes en puces, « Toi aussi » retiré, 3e mention de la blague du jour reformulée).
> - **Cet article** : CTA placé juste après le corps (avant la FAQ), nouveau texte et note « Gratuit, sans carte… » ; bouton 2,99 €/mois conservé. Bouton Partager (le même que sur les cartes de vannes) sur chacune des 50 vannes, lien partagé ancré `#vanne-N`.
> - **Tous les articles** : bouton d'inscription du CTA vers `/onboarding?src=blog-<slug>` (même page qu'avant, `src` ignoré par l'onboarding, visible dans Umami) ; puces Markdown réduites à un lien = zone de tap de 44 px.
> - **Umami** : `blog-scroll` passe à 4 paliers {palier: 25 | 50 | 75 | 100} ; nouveau `blog-ancre-clic` {slug, cible} (les ancres ne comptent plus dans `blog-sortie-clic`) ; nouveau `blog-vanne-partage` {slug, vanne (numéro), canal : natif | copie}. À vérifier après déploiement : Umami > Events.

## s14 (05/10/2026) : article « 50 blagues drôles » : audit growth R1 à R5 + mesure Umami @fullstack

> GO Thomas sur `docs/growth/audit-article-blagues-2026-s14.md`. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM.
> - **Déploiement normal**. Article statique (`blog-articles.ts`) : la page `/blog/meilleures-blagues-droles-2026` est régénérée au build, `updatedAt` passe au 05/10/2026.
> - **Tous les articles** : chaque H2 reçoit un `id` stable (slug du titre, sans accents) ; texte des titres inchangé.
> - **Umami** (même script, `window.umami.track`) : `blog-sortie-clic` {slug, zone, section, cible}, `blog-cta-clic` {slug, bouton : inscription | premium | parcours}, `blog-scroll` {slug, palier: 75}, une fois par page. Actifs sur tous les articles de blog. À vérifier après déploiement : Umami > Events.
> - CTA de fin : textes propres à cet article (`src/config/blog-cta.ts`) ; bouton 2,99 €/mois inchangé ; autres articles inchangés.

## s14 (05/10/2026) : rapport hebdomadaire des visites (Umami) par email le lundi @fullstack

> Demande de Thomas. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucun LLM. Secrets Worker `UMAMI_API_KEY` et `UMAMI_WEBSITE_ID` déjà posés (05/10) ; `RESEND_API_KEY` déjà requis.
> - **Déploiement Cloudflare normal** (`build:cf` puis `deploy:cf`). Aucun autre geste : le job tourne dans le scheduler existant (Cron Trigger 15 min, route `/api/cron/scheduler-tick`).
> - **Déclenchement** : lundi 7h-8h heure de Paris (heure d'été et d'hiver gérées), 1 seul email par semaine (verrou `JobLock` `weekly-visits-report-<lundi>`, conservé 6 jours après l'envoi, relâché en cas d'échec pour retenter au tick suivant de la même heure).
> - **Contenu** : 7 derniers jours complets (lundi à dimanche, heure de Paris) comparés aux 7 précédents : visiteurs, visites, pages vues, taux de rebond (écart en points), temps moyen par visite, variation en % (« nouveau » si la semaine précédente est à zéro) ; visites par jour ; top 5 pages et top 5 sources ; inscriptions (`User.createdAt`) et nouveaux Premium (`Subscription` plan PREMIUM créée dans la semaine) avec le taux d'inscription.
> - **Destinataire** : `ADMIN_EMAIL` du mailer existant (`src/lib/email.ts`, alex@deviens-marrant.fr, la même adresse que les alertes). Objet : « Visites deviens-marrant.fr : semaine du 28/09 au 04/10 (+21 %) » (variation des visiteurs).
> - **Manuel** : `curl -X POST -H "Authorization: Bearer $ADMIN_PASSWORD" "https://deviens-marrant.fr/api/admin/visits-report?dryRun=1"` renvoie le JSON sans envoyer ; sans `dryRun`, envoie l'email (hors verrou hebdo). 503 si secrets Umami absents, 502 si Umami répond en erreur.
> - Secrets absents : rien n'est envoyé, avertissement `[weekly-visits]` dans les logs. La clé n'est jamais journalisée (header `x-umami-api-key`, timeout 5 s).

## s14 (04/10/2026) : formule annuelle Premium 24,99 €/an + rappel légal de reconduction @fullstack


> **05/10/2026, annuel en ligne + webhook Stripe réparé (fait par Claude, autorisé par Thomas)**
> - Migration `10_annual_plan_renewal_reminder` appliquée sur Neon prod (3 colonnes `Subscription`, table `RenewalReminder`, index et FK vérifiés).
> - Prix Stripe live annuel `price_1UN4pdRqTNSm2ji5hM2fWxbY` (24,99 € TTC/an, `tax_behavior=inclusive`) ; secret Worker `STRIPE_PREMIUM_ANNUAL_PRICE_ID` posé. Session de paiement test à 24,99 € créée puis expirée (aucun paiement).
> - Bug corrigé : les webhooks Stripe arrivent en version d'API basil (fin de période sur `items.data[].current_period_end`) : date invalide → 500 depuis le 01/10. Lecture désormais compatible avec les deux versions.
> - Endpoint webhook recréé `we_1UN4rpRqTNSm2ji5DIZCWPSt` (6 événements), son secret posé sur le Worker ; ancien `we_1ULIyN…` supprimé. Les 2 abonnés de lancement resynchronisés (0,99 €/mois, périodes correctes). **La variable `STRIPE_WEBHOOK_SECRET` de l'environnement Claude Code est obsolète** (le Worker a la bonne valeur).
> - Secrets Worker `UMAMI_API_KEY` et `UMAMI_WEBSITE_ID` posés (rapport hebdo des visites en cours de développement).

> Décision de Thomas (04/10/2026). Commit local, non poussé, non déployé. Aucun package. Aucun appel Stripe (tests sur mocks). CGU et /retractation NON modifiées (texte @legal à intégrer par l'orchestrateur, `docs/legal/annuel-renouvellement-s14.md`).
> - **1. Migration Neon AVANT le déploiement du code** (additive et idempotente, testée 2× sur une base jetable) : depuis `apps/web`, avec le `DATABASE_URL` de production :
>   `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/10_annual_plan_renewal_reminder/migration.sql`
>   Ajoute `Subscription.billingInterval`, `priceAmountCents`, `cancelAtPeriodEnd` (défaut false) et la table `RenewalReminder`. Ordre impératif : le client Prisma du nouveau code lit ces colonnes (webhook Stripe) ; code déployé sans migration = webhooks en 500 (retentés par Stripe, mais à éviter).
> - **2. Déploiement Cloudflare normal** (`build:cf` puis `deploy:cf`). Sans autre action, le site reste strictement mensuel (2,99 €/mois) : l'annuel est invisible partout et `POST /api/stripe/checkout {plan:"annual"}` répond 503, sans repli sur le mensuel.
> - **3. Activation de l'annuel, quand Thomas le décide** : créer dans Stripe un prix récurrent annuel 24,99 € EUR sur le produit Premium, puis poser le secret Worker `STRIPE_PREMIUM_ANNUAL_PRICE_ID` (`wrangler secret put STRIPE_PREMIUM_ANNUAL_PRICE_ID`). Aucun redéploiement : `/abonnement` (SSR dynamique : sélecteur Mensuel/Annuel, metadata, JSON-LD P1M + P1Y, FAQ) bascule à la requête suivante ; `llms.txt` / `llms-full.txt` (ISR 1 h) dans l'heure. Retirer le secret = retour au mensuel seul.
> - **Avant d'activer** (points @legal) : bouton « Résilier votre contrat » sur /profil (l'email de rappel le cite ; aujourd'hui « Gérer mon abonnement »), CGU §3/§6/§7, case de renonciation, TVA et médiateur.
> - Webhook : aucun traitement ne dépend du prix ni de l'intervalle (pas de comparaison à `STRIPE_PREMIUM_PRICE_ID`) ; il recopie désormais l'intervalle, le montant réel et `cancel_at_period_end`. Abonnés actuels (dont les 2 de lancement à 0,99 €) : aucun changement Stripe, champs remplis à leur prochain événement Stripe.
> - MRR admin : somme des montants réels mensualisés (annuel / 12) ; abonnement pas encore resynchronisé = `STRIPE_PREMIUM_PRICE_CENTS` comme avant.
> - **Job « rappel de reconduction »** (scheduler existant, Cron Trigger 15 min, fenêtre 8h UTC) : abonnés annuels actifs sans annulation programmée dont la période se termine dans 32 à 40 jours (cible J-40, jamais à J-31 ou après), un seul email par période (clé unique `RenewalReminder (subscriptionId, periodEnd)` insérée AVANT l'envoi, échec retenté). Texte exact @legal (`src/lib/emails/annual-renewal-reminder.ts`), envoi en texte simple via Resend (`RESEND_API_KEY` déjà requis). Rien ne part tant qu'aucun abonnement annuel n'existe.

## s14 (03/10/2026) : chiffres publics dynamiques (catalogue, limites gratuites, parcours) + arrondi à la dizaine @fullstack

> Demande de Thomas (« que tous les chiffres de vannes, vidéos, etc. soient bien dynamiques »). Aucun secret, aucune migration, aucun package, aucune donnée en base. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - Limites du compte gratuit : source unique `FREE_JOKE_LIMIT` / `FREE_TIP_LIMIT` / `FREE_VIDEO_LIMIT` dans `src/config/premium.ts`, importées par `/api/jokes`, `/api/tips`, `/api/videos` (valeurs inchangées : 10 / 3 / 3, protection identique) et par tous les textes (abonnement, CTA blog, avantages Premium, liste des vannes, llms.txt).
> - Parcours : nombre (`PARCOURS_COUNT`) et durées en semaines (`parcoursWeeks`, min/max) dans `config/premium.ts`, vérifiés contre `docs/content/parcours-seed.json` par test. Quiz (`QUIZ_QUESTIONS.length`), glossaire (`src/lib/glossary.ts`, extrait de la page) et exemples d'anatomie suivent la longueur de leurs données.
> - Arrondi des compteurs (GO Thomas 03/10) : dizaine inférieure (125 → 120+, 109 → 100+, 89 → 80+), implémentation unique `src/lib/marketing-round.ts` (serveur et hook client). Cache serveur des compteurs : 5 min.
> - Textes « 1 500+ membres » reformulés à la demande de Thomas : accueil (sous le H1) et à propos (2 phrases). Chiffre inchangé.

## s14 (03/10/2026) : audit de forme appliqué (`docs/design/audit-forme-s14.md`) @fullstack

> Demande de Thomas (« bien tout revoir sur la forme »). Aucun secret, aucune migration, aucun package, aucune donnée, aucun texte/prix/lien/slug/titre modifié. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - Classes et variantes uniquement : P0-1 à P0-3, P1-1 à P1-11, P2-2, P2-3, P2-5 à P2-9, et P2-4 (ordre des parcours du hero aligné sur le site, tranché par Thomas). Nouveau fichier `src/components/ui/chip.ts` (pastille unique : hero, filtres et thèmes de /vannes, archives du carnet).
> - Hero : 3 pastilles-liens, puis les 2 libellés « Un petit exercice par jour » / « Vannes prêtes à ressortir » sur une ligne à part (coche verte, sans fond ni bordure, non cliquables, masqués sous 640 px).
> - Non appliqués : P2-1 (preuve sociale violette dans l'offre, au choix de Thomas), P2-10 (libellés visibles Favoris/Mon profil en desktop : ajoute du texte visible).
> - Protection Premium du carnet et des parcours inchangée (aucun fichier serveur touché, seulement des classes).

## s14 (03/10/2026) : carnet mensuel de répartie Premium (`/carnet`) @fullstack

> Décision de Thomas (03/10/2026). Aucun secret, aucune migration, aucun package, aucune donnée en base, aucun appel IA. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - Contenu : un JSON par mois dans `apps/web/src/data/carnet/AAAA-MM.json`, embarqué au build (`require.context`, validé par zod dans `src/lib/carnet.ts`, fichier invalide écarté et signalé dans les logs). Ajouter un mois = déposer le JSON puis redéployer, rien d'autre à enregistrer. Un mois n'apparaît qu'à partir du 1er à minuit, heure de Paris (le carnet courant est le plus récent déjà commencé ; un mois futur répond 404).
> - `/carnet` et `/carnet/[mois]` (SSR dynamique, `noindex, nofollow`, hors sitemap) : abonné Premium (plan lu en base, `src/lib/session-plan.ts`) = toutes les fiches + liens vers les mois précédents ; non Premium (anonyme ou gratuit) = intro + première fiche entière + titres et contextes des autres, filtrés côté serveur (vérifié dans le build : aucune autre fiche dans le HTML ni dans `.next/static`), puis appel à l'abonnement vers `/abonnement?returnTo=%2Fcarnet`.
> - Avantages Premium : « le carnet mensuel de situations de répartie (nouveau chaque mois) » ajouté (`config/premium.ts`, `premium-benefits.tsx`, paywall, JSON-LD produit, `llms-content.ts`). Lien « Carnet » dans l'en-tête pour les abonnés Premium seulement.

## s14 (03/10/2026) : Premium à 2,99 €/mois @fullstack

> Décision de Thomas (03/10/2026). Aucune migration, aucun package, aucune donnée modifiée, aucun appel Stripe. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - **Secrets Worker, au MÊME déploiement** : `STRIPE_PREMIUM_PRICE_ID` doit passer au nouveau prix Stripe à 2,99 € (créé par l'orchestrateur), sinon le checkout facture encore 4,99 € alors que le site affiche 2,99 €. Si `STRIPE_PREMIUM_PRICE_CENTS` est défini sur le Worker, le passer à `299` (ou le supprimer : défaut du code désormais 299), il sert au calcul du MRR admin.
> - Affichage : toutes les mentions 4,99 € remplacées par 2,99 € (pages abonnement et metadata, accueil, à propos, parcours, glossaire, inscription, CGU, CTA, paywall, modale premium, quiz, listes, profil, FAQ, `config/premium.ts`, `llms-content.ts`, prompts des agents IA) ; JSON-LD `offers.price` = "2.99" ; `.env.example` à 299. Aucune offre annuelle.
> - Articles statiques (`blog-articles.ts`, 19 articles ; `blog-article-rewrites.json`, 1 article) : seul le prix change (un seul mot « 4 » devenu « 2 » par article, vérifié), aucune comparaison chiffrée devenue fausse. Empreintes `words`/`numbers` de ces 19 articles régénérées dans `blog-em-dash-baseline.json`.
> - Abonnés existants : restent sur l'ancien prix Stripe tant qu'ils ne sont pas migrés (décision et opération côté Stripe, hors code).

## s14 (03/10/2026) : parcours Premium protégés côté serveur, `/api/ai` coupée, offre Premium vraie, retour après paiement @fullstack

> Décisions de Thomas (03/10/2026). Aucun secret, aucune migration, aucun package, aucune donnée modifiée, aucun appel Stripe. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - Parcours : pour un visiteur non Premium (anonyme ou compte gratuit, plan lu en base comme les favoris), les étapes 2+ ne sortent plus du serveur qu'en aperçu (titre, format, une phrase « pourquoi », XP) : ni conseil, ni quiz, ni vannes, ni vidéos (`src/lib/parcours-preview.ts`, `api/parcours/by-slug/[slug]`, `Cache-Control: private, no-store`). Le HTML ISR de `/parcours/[slug]` est toujours en aperçu ; un abonné reçoit le contenu complet via l'API après hydratation. Le seed complet (quiz avec réponses, vidéos) ne part plus dans le JS public : `/parcours` reçoit ses données du serveur (`src/lib/parcours-catalogue.ts`) et `parcours-labels.ts` n'importe plus le seed.
> - `/api/ai` : 410 pour toute requête, message neutre, sans session, base ni LLM. `AI_USER_DAILY_LIMIT` devient inutile sur le Worker.
> - Offre : `/abonnement` (page et metadata), modale Premium, paywall, carte d'accueil et JSON-LD produit partagent une seule liste vraie (`components/premium/premium-benefits.tsx`, `src/config/premium.ts`) : les 3 parcours en entier (Machine à Café 15 min/semaine, Répartie et Confiance 20 min/semaine, première étape offerte), favoris, listes complètes. Retirés : « contenu quotidien », « filtres avancés », « favoris illimités », « nouveaux contenus chaque semaine », « streaks et XP ». Aucun annuel, aucun contenu mensuel promis.
> - Chiffres : fiches vannes « 550+ » remplacé par le nombre réel de vannes actives (même source que les compteurs), `llms.txt` dynamique, « Plus de 550 vannes » et « des centaines » (a-propos, image OG des vannes, conseils, `llms-content.ts`, replis si base KO) neutralisés, repli `numberOfItems: 200` supprimé.
> - Tunnel : « Commencer à 4,99 €/mois » de l'accueil mène à `/abonnement` après inscription. `returnTo` (chemin interne validé, `src/lib/premium-return.ts`) voyage du paywall jusqu'à Stripe (`success_url`/`cancel_url`) puis `/abonnement/success`, qui renvoie à l'intention d'origine, sinon `/parcours`, avec un bandeau de bienvenue (`?premium=bienvenue`). Erreurs de paiement de `/abonnement` : plus de message brut de l'API. Favoris : modale « Les favoris font partie de Premium ».

## s14 (01/10/2026) : fin de l'offre de lancement, Premium à 4,99 €/mois @fullstack

> Décision de Thomas (01/10/2026). Aucune migration, aucun package, aucune donnée modifiée, aucun appel Stripe. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - **Secrets Worker, au MÊME déploiement** : `STRIPE_PREMIUM_PRICE_ID` doit passer au nouveau prix Stripe à 4,99 € (créé par l'orchestrateur), sinon le checkout facture encore 0,99 € alors que le site affiche 4,99 €. Si `STRIPE_PREMIUM_PRICE_CENTS` est défini sur le Worker, le passer à `499` (ou le supprimer : défaut du code désormais 499), il sert au calcul du MRR admin.
> - Affichage : toutes les mentions 0,99 € remplacées par 4,99 € (pages abonnement, accueil, à propos, parcours, glossaire, inscription, CGU, CTA, paywall, modale premium, quiz, listes, FAQ, `llms-content.ts`, prompts des agents IA) ; JSON-LD `offers.price` = "4.99". Badges et mentions « Prix de lancement » retirés ; CGU : « (4,99 €/mois) » sans clause d'évolution du prix de lancement.
> - Articles statiques (`blog-articles.ts`, 19 articles ; `blog-article-rewrites.json`, 1 article) : seul le prix change, plus 7 comparaisons devenues fausses (café, croissant, soda, verre, bière) remplacées par « sans engagement » ou retirées. Empreintes de ces 19 articles régénérées dans `blog-em-dash-baseline.json`.
> - `api/admin/stats` : MRR = abonnements actifs × `PREMIUM_PRICE_CENTS` / 100 (plus de 0,99 codé en dur).
> - Abonnés existants : restent sur l'ancien prix Stripe tant qu'ils ne sont pas migrés (décision et opération côté Stripe, hors code).

## s14 (01/10/2026) : page `/liens` (bio Instagram automatique), newsletter retirée @fullstack

> Aucun secret, aucune migration, aucun package, aucune donnée modifiée. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - `/liens` (`src/app/liens/page.tsx`, ISR 5 min, `noindex, follow`, hors sitemap, sans en-tête ni pied de page) : dernier article visible (même source que `/blog`, via `src/lib/latest-blog-article.ts` et `blog-visibility.ts`), vanne du jour (`src/lib/daily-joke.ts`), puis liens fixes parcours Répartie, vannes, conseils. Tous les liens portent `utm_source=instagram&utm_medium=social&utm_campaign=bio`. Action Thomas, une seule fois après déploiement : mettre `https://deviens-marrant.fr/liens` dans la bio Instagram.
> - Préparation sociale : plus de note « Lien de la bio à mettre à jour ce lundi » (`scripts/content/social-month-plan.ts`, retirée aussi de `docs/social/preparation/2026-10.md` et `2026-11.md`) ; la légende Instagram du lundi reste « Lien en bio. ». `docs/social/mesure.md` à jour.
> - Newsletter : formulaire retiré (fin d'article de blog, résultat du quiz), composant `newsletter-inline.tsx` et texte de consentement « une technique par semaine » supprimés. `POST /api/newsletter` répond 410 (« Les inscriptions sont fermées pour le moment. »), sans écriture. Table `NewsletterSubscriber` et routes de confirmation et de désinscription conservées (newsletter mensuelle préparée à venir).

## s14 (01/10/2026) : publication Instagram corrigée, échecs tracés, génération IA sociale arrêtée, préparation mensuelle @fullstack

> Aucun secret, aucune migration, aucun package. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide. Rien n'est inséré en base au déploiement.
> - `src/lib/social/buffer-client.ts` : mutation Instagram conforme au schéma Buffer `AssetInput` (`assets: [{ image: { url } }]`), cause prouvée des 41 échecs (`Field "images" is not defined by type "AssetInput"`). À valider sur un post de test non public avant toute reprise.
> - `api/cron/publish-social` : message exact de chaque échec enregistré dans `SocialPost.directorNote` (préfixe « Échec publication Buffer : ») ; e-mails d'échec limités à 1 par jour UTC (verrou `JobLock` `publish-social-failure-alert-AAAA-MM-JJ`, `src/lib/social/publish-failure.ts`) ; LinkedIn exclu (pause) ; coupe-circuit 429 lu en `startsWith`.
> - Génération IA des posts arrêtée définitivement : `runDailySocialJob` et `/api/cron/daily-social` retournent immédiatement (aucun LLM, aucune écriture) ; `social-media-agent.ts` archivé (commentaire en tête, non patché).
> - [CHOIX UTILISATEUR] aucune IA ne produit seule : la relecture copy-review (`runCopyReviewJob`, `runDailyCopyReviewOnce`) et `backfillMissingJokeDecryptagesTask` ne tournent plus que si `CONTENT_GENERATION_ENABLED` = "true" (absent sur le Worker : coupés).
> - Carte Instagram « amorce // chute » : `generatePostImage` (IMAGE_QUI_CLAQUE + `threadParts` [amorce, chute]) rend le gabarit « La Vanne » ; image rendue par le Worker à la publication (`/api/social/image?postId=`), aucun upload R2 depuis le script.
> - Préparation mensuelle (depuis `apps/web`, `NEON_DATABASE_URL` définie) : `npx tsx scripts/content/prepare-social-month.ts --month 2026-10 --from 2026-10-02` (dry-run, SELECT seulement, écrit `docs/social/preparation/2026-10.md` avec l'échantillon de 10), puis, après validation de Thomas, la même commande avec `--write --echantillon-valide` (posts `APPROVED`, `approvedBy = preparation-mensuelle`, créneaux X 12:30 et Instagram 18:30 heure de Paris). Mesure : `docs/social/mesure.md`.

## s14 (01/10/2026) : remplaçant jamais déjà programmé, posts sociaux en pause, agent CEO coupé @orchestrateur

> Aucun secret, aucune migration, aucun package. Déployé (version a6dbeae7).
> - `quality-watch.ts` : une vanne de remplacement ne peut plus être une vanne programmée à ±90 jours (cas du 01/10 : vanne du 28/10 tirée en double).
> - `scheduler/jobs.ts` : génération quotidienne des posts sociaux (4h UTC) suspendue tant que `CONTENT_GENERATION_ENABLED` ≠ "true" (audit réseaux sociaux demandé par Thomas, même approche que les vannes).
> - Données : les 2 posts du 01/10 (non audités) repassés `PENDING` (non publiés). `CeoConfig.enabled = false` (agent CEO : file de tâches vide depuis sa création, dry-run ; réactivable par l'admin), entrée `CeoAuditLog`.

## s14 (01/10/2026) : contrôle qualité du matin, vannes GARDER plus rejugées @orchestrateur

> Aucun secret, aucune migration, aucun package. Déployé (version 00cff7bd). Le 01/10, le juge automatique a rejeté l'étalon E3 (réveil, vanne du jour validée) à 3/10 en le prenant pour une copie d'étalon, et l'a remplacé par une vanne déjà programmée le 28/10.
> - `src/lib/ai/quality-watch.ts` : vanne du jour `copyVerdict = GARDER` (catalogue relu à l'aveugle) conservée sans appel LLM ; seules les vannes non validées sont jugées. Validation impossible → remplacement.
> - Donnée : DailyContent du 01/10 remis sur la vanne prévue (réveil). Sans le correctif, même rejet attendu les 06/10 (Alexa), 03/11 (GPS) et 09/11 (erreurs).

## s14 (30/09/2026) : parcours, option A (5 étapes sous la barre) + tirets cadratins du seed parcours

> Aucun secret, aucune migration, aucun package. Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) : `docs/content/parcours-seed.json` est importé au build (textes « pourquoi », quiz, vidéos).
> - Base (déjà faite le 30/09, Neon) : `LearningPathStep.tipId` de 5 étapes pointe vers un conseil validé de même compétence (confiance 1 : « Énoncer la règle non écrite » ; repartie 1 : « L'ironie bienveillante » ; repartie 2 : « Le silence entre deux chansons » ; maitre-storytelling 5 et roi-repartie 2, parcours inactifs : « La question qui fait raconter », « Répondre au pied de la lettre »). Les 5 anciens conseils sont désactivés. Sauvegardes dans `docs/copy/audit-vannes-s14/`.
> - Seed : `tipTitle` et phrase « pourquoi » des 3 étapes actives alignés ; 33 tirets cadratins remplacés par deux-points (+ 1 dialogue en guillemets).

## s14 (30/09/2026) : publication programmée des articles préparés + script d'import @fullstack

> Aucun secret, aucune migration, aucun package. Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`). Donnée : l'article S1 n'est inséré en base que par la commande d'import lancée par Thomas (voir plus bas), jamais au déploiement.
> - `publishDueScheduledArticles` (`src/lib/scheduler/prepared-content.ts`), appelé à chaque tick de 15 min et par `/api/cron/weekly-seo` quand `CONTENT_GENERATION_ENABLED` ≠ "true" : passe `isPublished=true` sur les articles dont `publishedAt` est échu dans la semaine ISO en cours (compare-and-set, verrou `JobLock` seulement s'il y a un article échu), puis revalidation `/blog`, article, sitemap, llms (best effort, voir `src/lib/blog-revalidate.ts`) et ping IndexNow (`src/lib/indexnow.ts`, source unique, timeout 5 s). Sous OpenNext sans tag cache, `revalidatePath` est sans effet : la page article (jamais mise en cache avant) est servie dès la bascule (05:00-05:15 UTC), `/blog`, sitemap et llms se régénèrent par l'ISR 1 h (première visite après expiration du cache).
> - Garde-fou d'exposition : `/blog`, `/blog/<slug>`, sitemap, `llms.txt`, `llms-full.txt` n'affichent un article en base que s'il est publié ET daté du passé (`src/lib/blog-visibility.ts`).
> - FAQ des articles en base : section finale `## FAQ` + `### Question` dans `content`, rendue en bloc « Questions fréquentes » + JSON-LD FAQPage (`src/lib/blog-faq.ts`). Aucun article en base actuel n'a cette section (contrôlé en lecture seule le 30/09) : rendu existant inchangé.
> - Import (depuis `apps/web`, `NEON_DATABASE_URL` définie) : `npx tsx scripts/content/import-article.ts ../../docs/copy/articles-q4/S1-halloween.md` (dry-run, lecture seule) puis la même commande avec `--write`.

## s14 (30/09/2026) : lots S3a à S3d, landings vannes, sameAs, slugs canoniques @fullstack

> Aucune action manuelle : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`).
> - S3a `/blague-du-jour` (ISR, régénérée toutes les 5 min au plus) : vanne du jour avec chute et décryptage, même source que `/api/daily` (DailyContent du jour, sinon repli déterministe) via `src/lib/daily-joke.ts` en lecture seule ; FAQ + JSON-LD FAQPage, compteur de vannes dynamique.
> - S3b 7 pages `/vannes/theme/<slug>` (boulot, couple, dating, soirees, famille, gaming, autoderision ; « ecole » plus tard) : liste serveur paginée `?page=N`, canonical auto-référent, cache R2 `catalogue-theme-jokes-page-v1`. Liens depuis `/vannes` et `/blague-du-jour`. Ajoutées au sitemap avec `/blague-du-jour`.
> - S3c JSON-LD Organization : `sameAs` = Instagram, X, LinkedIn (constante `OFFICIAL_SOCIAL_PROFILES`) ; `NEXT_PUBLIC_SOCIAL_PROFILES` reste une surcharge.
> - S3d fiches vanne, conseil, vidéo actives demandées par un ancien slug : 308 vers le slug canonique. Inchangé : fiche inactive vers la liste (S2), slug inconnu en 404.

## s14 (30/09/2026) : lots Q1-Q4 « rien de moyen » (vanne du jour validée, copy-review sur la barre, gates de publication, contrôle du matin) @ia

> Aucun secret, aucune migration, aucun package. Modèles et effort inchangés. Action restante (orchestrateur) : brancher `GET /api/cron/quality-watch` (Bearer `CRON_SECRET`) dans le planificateur, recommandé 6h30 UTC (après `daily-content` 5h et 6h UTC). `?force=true` ignore le verrou quotidien.
> - Q1 : vanne du jour de repli (`/api/daily`, `daily-publisher`) = pool `isActive, copyVerdict GARDER, comedyTechnique non null` (`src/lib/ai/daily-joke-pool.ts`) ; pool vide → repli historique. Vanne générée APPROVED avec la barre → enregistrée `GARDER` (+ version, date).
> - Q2 : relecture copy-review des vannes avec la barre des étalons ; doute = REECRIRE ; réécriture écrite seulement si `validateJoke` (barre) = APPROVED, alors `GARDER` ; sinon original conservé, `REECRIRE` (hors vanne du jour). Conseils inchangés (doute = GARDER).
> - Q3 : `src/lib/ai/content-gates.ts` avant enregistrement des conseils, articles, posts sociaux et fiches vidéo : tirets cadratins corrigés ; gros mots, vouvoiement, auto-mention IA → une régénération, sinon repli ; marques signalées dans les logs.
> - Q4 : `src/lib/ai/quality-watch.ts` : 1 appel LLM/jour max, remplace la vanne sous la barre par une vanne GARDER, le conseil fautif par un conseil du stock propre, e-mail récap admin seulement si remplacement ou défaut.

## s14 (30/09/2026) : lot V7 anti-séries et barre qualité du générateur de vannes @ia (code `src/lib/ai/` uniquement)

> Aucune action manuelle : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Modèle et effort inchangés. Pris en compte au prochain `daily-content` (5h UTC) une fois la branche déployée sur le Worker.
> - `joke-series-guard.ts` (nouveau) : avant génération, lecture de tous les setups (actifs + inactifs) ; liste compacte des amorces déjà en série injectée au prompt (40 entrées max, 2 800 caractères max, bloc system caché) ; après génération, rejet d'un setup quasi identique (Jaccard ≥ 0,6), d'une 4e vanne active sur une même amorce (Jaccard des 12 premiers mots ≥ 0,5) et des tics d'écriture de l'audit s14. Une régénération au plus, sinon le repli sur le catalogue prend le relais. La réécriture du Director repasse le filtre.
> - `joke-quality-bar.ts` (nouveau) : les 4 étalons validés (Alexa, « des erreurs, principalement », réveil, GPS), les critères et les tics, injectés dans le générateur, dans `validateJoke` (option `dailyGeneration`, passée seulement par `daily-publisher`) et dans `directorRewriteJoke`.
> - Décision V6 : le générateur n'interdit plus les assistants et l'IA comme sujet ; en génération quotidienne, G-J11 laisse passer. Le copy-review (`validateJoke` appelé sans option) est inchangé.

## s14 (30/09/2026) : lot S1, catalogue crawlable (listes rendues côté serveur) @fullstack

> Aucune action Replit ni Cloudflare manuelle : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`).
> `/vannes`, `/conseils`, `/videos` passent en rendu serveur à la requête (lecture de `?page=N`) : le HTML contient les fiches de la page (12 vannes, 10 conseils, 12 vidéos) et une pagination en vrais liens ; données en cache serveur 1 h (`src/lib/catalogue-pages.ts`, entrées R2 `catalogue-*-page-v1`). `/blog` : liste complète dans le HTML statique. Accueil : 2 fiches par carte (vannes, conseils, vidéos). Base indisponible : repli sur le chargement client d'avant (pas de 500). À vérifier après déploiement : voir le handoff du lot S1 (comptage des liens au `curl`).

## s14 (30/09/2026) : BASCULE deviens-marrant.fr → Cloudflare Workers (étape D)

> **FAIT (Thomas, 30/09) : déploiement Replit mis en pause.** Rappel de la consigne : mettre en pause / arrêter le déploiement (Deployments → Autoscale). Le domaine ne pointe plus sur Replit, mais un visiteur de l'URL `*.replit.app` réveillerait son planificateur interne (posts sociaux en double, écritures dans l'ancienne base Replit). Ne pas supprimer : retour arrière possible (voir `docs/infra/bascule-checklist.md`).
> Fait : copie finale 35/35, 25 secrets live sur le Worker, `CRON_ENABLED=true`, déploiement `59178f0a`, DNS `A @`/`CNAME www` retirés, domaines personnalisés attachés, endpoint webhook Stripe live créé (`/api/stripe/webhook`). Détail et contrôles : `docs/infra/passation-s14.md` §4.

## s13 (30/09/2026) : images sociales sous Cloudflare Workers (polices Inter)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Chemin Replit inchangé (lecture de `public/fonts/` sur le disque).
> Constat du test s13 : sous Workers, `/api/social/image` renvoyait 500 (« No fonts are loaded ») : pas de système de fichiers, et les URL Google Fonts de secours renvoient 404. Correctif : sous Workers, les TTF de `public/fonts/` sont lues via le binding `ASSETS` (`src/lib/social/image-generator.ts`). Vérifié sur le Worker de test : 3 formats rendus en PNG 1080×1080 avec Inter. Sans ce correctif, `daily-social` n'aurait produit aucune image après la bascule.

## s12 (29/09/2026) : correctifs P1 et P2 du contrôle @qa 64 pages × 4 largeurs @fullstack (code front uniquement)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Commits `caa6f95` (P1-1 à P1-6 : étapes verrouillées lisibles, tirets et apostrophes des conseils retirés au rendu, 2 réponses de FAQ, focus de la modale, blanc sur `#7C3AED`, H1 de /forgot-password et /reset-password, bouton mot de passe de /login à 44 px) et `18f77ba` (P2 : case newsletter, fil d'Ariane et lien de parcours à 44 px en mobile, H1 sans mot seul à 390, index du glossaire à 1024, symbole ✗). Détail des constats : `docs/qa/verification-s12-3-largeurs.md`. À vérifier après déploiement : `/parcours/confiance` (étapes verrouillées), modale « Créer mon compte gratuit » au clavier (Tab reste dans la modale), `/glossaire` à 1024.

## s12 (29/09/2026) : vérification finale 3 largeurs, correctifs N1 à N19 @fullstack (code front + /api/tips)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Commit `c0b1df8`. Détail des constats : `docs/design/verification-finale-s12.md`. Header en mode mobile jusqu'à 1023 px (N1), correctifs d'accueil, parcours, glossaire, anatomie, auth ; tirets cadratins retirés au rendu (parcours, vidéos, quiz, FAQ à-propos ; titres et SEO intacts) ; guillemets imbriqués corrigés au rendu (N11) ; conseils au titre identique dédoublonnés à l'affichage par `/api/tips` (N12 : le total de conseils affiché baisse du nombre de doublons). À vérifier après déploiement : header à 768 et 1024 px, `/conseils` (3 conseils gratuits différents).

## s12 (29/09/2026) : tirets cadratins retirés des articles de blog @fullstack (règle n°12)

> Aucune action manuelle : aucun secret, aucune migration, aucun package.
> - Articles statiques (`src/lib/blog-articles.ts`) : 467 « — » du corps et des réponses FAQ remplacés (ponctuation seulement, mots identiques vérifiés par `__tests__/lib/blog-em-dash-static.test.ts`). Titres, excerpt, slugs, questions FAQ inchangés.
> - Articles en base : **automatique au boot**, `stripBlogEmDashesTask` (dernière tâche de `runStartupTasks`), une seule fois par article (marqueur `DataPatch` `blog-em-dash:v1:<slug>`, 2e boot = 0 update). Ne touche que `content` des articles publiés, jamais title/excerpt/meta ni les lignes de titre `#`. Contenu d'origine gardé dans `DataPatch.note` (retour arrière : requête SQL en commentaire de la tâche).

## s12 (29/09/2026) : correctifs « hors périmètre restant » @fullstack (code front uniquement)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée (casse « eN GROUPE », vannes liées et guillemets corrigés au rendu). Commits `7f96a45`, `0239d49`, `92391ad`, `11fd944`, `f9e235d`, `6f1be77`, `a3119c1`, `0c72322`, `d2abdd8`, `147c90c`. Détail : `docs/marrant/a-valider-s12.md`.

## s12 (29/09/2026) : passe UX @fullstack (code front + /api/jokes)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Détail : `docs/ux/passe-ux-s12.md`.
> Commits `d34b96b` (inscription modale -> onboarding, onboarding -> parcours recommandé, vannes dédoublonnées à l'affichage par `/api/jokes`, H1 accueil sur 2 blocs), `0d7acf7` (accueil et /vannes), `c3da858` (parcours), `47227d1` (auth, /abonnement, header, arbitrages Thomas). Doublons de vannes laissés en base (dédoublonnage dans le code uniquement).

## s12 (29/09/2026) : passe visuelle @design (code front uniquement)

> Aucune action Replit : aucun secret, aucune migration, aucune donnée modifiée. Déploiement prévu sur Cloudflare (branche `claude/marrant-s10-session-recovery-CtZyw`). Détail des correctifs : `docs/design/passe-visuelle-s12.md` (T1 à T12).
> Commits `7906100` (titres équilibrés, insécables au rendu, moteur markdown : citations `>`, séparateurs `---`, listes après intro), `5ad5b42` (contrastes AA, token `accent-link`), `d35cf73` (largeurs de page, dates et catégories en français), `483d96a` (cartes alignées, emojis, puces vidéo). Texte des articles/vannes en base inchangé.

## ⭐ s11 (29/09/2026) — Déploiement de la branche `claude/marrant-s10-session-recovery-CtZyw`

> Contexte : la génération IA (vannes, conseils, blog, social, vidéos) était à l'arrêt depuis le 15/06/2026 — le modèle `claude-sonnet-4-20250514` a été retiré par Anthropic. Le code est migré sur **Claude Sonnet 5.5** (`claude-sonnet-5-5`) + **Opus 5.5** pour le rapport CEO, Haiku supprimé, SDK `@anthropic-ai/sdk` 0.129.

### A. Automatique au déploiement (zéro action)
| Quoi | Mécanisme |
|---|---|
| Table `NewsletterSubscriber` (+ enum) | `prisma db push` au build (déjà dans `.replit`) |
| Corrections des articles de blog en base (tutoiement, citations, témoignages, staccato, mentions IA, années) | boot ~30 s : `fixPublishedBlogArticlesTask` (`src/data/blog-article-fixes.json`) |
| Dépublication des 3 articles cannibalisés en base | boot : `depublishCannibalizedDbArticlesTask` |
| URL de la page n°1 `/blog/meilleures-blagues-droles-2026` **conservée** (aucun renommage, choix fondateur) | — |
| Liens internes vers des URLs redirigées réécrits dans les articles en base | boot : `rewriteRedirectedBlogLinksTask` |
| Décryptage IA des vannes anciennes sans décryptage (15 / boot) | boot : `backfillMissingJokeDecryptagesTask` (désactivable : `SKIP_JOKE_DECRYPTAGE_AI_BACKFILL=1`) |
| 14 redirections 301/308 (cannibalisation, historique) | `next.config.js` ← `src/lib/seo-redirects.data.cjs` |
| Alerte email admin si l'IA tombe en panne (modèle retiré, clé, crédit) | `lib/ai/failure-alert.ts`, 1 alerte / type / 24 h |
| **Refonte copy (passe 2)** — 249/264 vannes + décryptages, 65 conseils, 89 fiches vidéos, 3 descriptions de parcours réécrits (id et URL conservés, favoris préservés via `previousContent` / `previousTitle` ; textes seulement : 0 création, 0 suppression, 0 désactivation, étapes de parcours intactes ; vérifié sur base locale : 0 créée, 249 renommées, 2e passe = 0 update). ⚠️ PAS via le seed (bloqué en `NODE_ENV=production`) | boot : `applyCatalogueContentTask`, une seule fois (marqueur `DataPatch` `catalogue-content:v1` ; bump `CATALOGUE_CONTENT_PATCH_VERSION` pour réappliquer) — rapport `docs/qa/catalogue-boot-s11.md` |
| **Refonte copy (passe 2)** — 9 articles de blog en base réécrits, `blog-article-rewrites.json` **v2** (une seule fois, marqueur `DataPatch` par version) | boot : `applyBlogArticleRewritesTask` |
| **Refonte copy** — relecture automatique des vannes et conseils générés (25 + 25 / jour, 3h-4h UTC ; retrait seulement sur motif fermé, sinon GARDER ; originaux conservés) | scheduler : job copy-review |
| Nouveaux champs `copyVerdict`, `copyReviewedAt`, `original*` (Joke, Tip) + table `DataPatch` | `prisma db push` au build (colonnes nullables, sans perte) |

### B. Secrets Replit — tous OPTIONNELS (le code a des défauts sûrs)
| Secret | Valeur | Effet |
|---|---|---|
| `ANTHROPIC_SONNET_MODEL` | *(vide)* → `claude-sonnet-5-5` | changer de modèle sans toucher au code (prochain retrait) |
| `ANTHROPIC_OPUS_MODEL` | *(vide)* → `claude-opus-5-5` | idem pour le rapport hebdo CEO |
| `ANTHROPIC_EFFORT` | *(vide)* → `low` | `low` / `medium` / `high` — qualité vs coût de toute la génération |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | clé `msvalidate.01` de Bing Webmaster Tools | débloque l'indexation Bing |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | clé Search Console (si pas déjà vérifié par DNS) | — |
| `NEXT_PUBLIC_SOCIAL_PROFILES` | URLs des profils officiels séparées par des virgules | `sameAs` JSON-LD (entité de marque pour les IA) |
| `COPY_REVIEW_ENABLED` | *(vide)* → actif | `false` pour suspendre la relecture automatique des contenus générés |
| `COPY_REVIEW_BATCH` | *(vide)* → `25` | nombre de vannes ET de conseils relus par jour |
| `COPY_REVIEW_VERSION` | *(vide)* → `1` | incrémenter pour relire tout le corpus après une évolution de la charte |
| ⚠️ Secret à SUPPRIMER s'il existe | `ANTHROPIC_HAIKU_MODEL` | plus lu par le code |

### C. Après le déploiement (5 min)
1. `curl https://deviens-marrant.fr/api/health` → `checks.ai.sonnetModel = "claude-sonnet-5-5"`, `database.status = "up"`. `llmSuccess` passe à `ok` après la 1re génération (fenêtre 5h-6h UTC, ou catch-up 7h-22h UTC).
2. Brancher UptimeRobot (gratuit) sur `/api/health`, mot-clé `"status":"ok"`, toutes les 5 min.
3. Vérifier `https://deviens-marrant.fr/llms.txt` : doit lister les articles du blog (≈ 26).
4. Soumettre le sitemap dans Google Search Console et Bing Webmaster Tools (≈ 1 100 nouvelles URLs /vannes, /conseils, /videos).

---

> **TL;DR (s10 — deploy auto-suffisant)** : la checklist web est passée de **11 étapes manuelles à 3**.
> Tout ce qui pouvait être automatisé l'a été dans le code (auto-seed config, crons CEO via scheduler interne, application instantanée des décryptages de vannes au boot, cleanup données). Détails ci-dessous.
> La section "Setup MOBILE V1" plus bas reste une checklist distincte (comptes Apple/Google, builds natifs) non concernée par cette automatisation.

---

## ⭐ s10 — Déploiement web auto-suffisant : AUTO vs MANUEL

> "Quand je déploie, tout se met à jour tout seul." Voici précisément ce qui se passe au 1er deploy, sans rien faire.

### A. CE QUI EST DÉSORMAIS AUTOMATIQUE (zéro action)

Au déploiement Replit, la chaîne `[deployment].build` (`prisma db push` + `prisma generate` + build) synchronise le **schéma** DB. Puis, **~30 s après le boot du serveur**, le scheduler interne (`apps/web/src/instrumentation.ts`) exécute des tâches de démarrage idempotentes, puis prend le relais des crons :

| Tâche | Quand | Mécanisme | Fichier |
|---|---|---|---|
| **Schéma DB à jour** (tables, colonnes) | au build | `prisma db push` (déjà dans `.replit`) | `.replit` `[deployment].build` |
| **Seed singleton `CeoConfig`** (FAIL-SAFE : `enabled=false`, `dryRun=true`) | au boot (~30 s) | `ensureCeoConfig()` idempotent + race-safe | `lib/startup-tasks.ts` → `lib/ai/ceo-helpers.ts` |
| **Cleanup `SocialPost` WILD_CARD** (format obsolète → `REJECTED`) | au boot (~30 s) | `$executeRawUnsafe` UPDATE idempotent (cast `::text`) | `lib/startup-tasks.ts` + migration `8_cleanup_wildcard_socialpost` |
| **Décryptage des 265 vannes** (pré-rédigé, SANS IA) | au boot (~30 s) | `applyJokeDecryptagesTask()` : applique les 3 champs depuis `src/data/joke-decryptages.json`, idempotent (ne touche que `comedyTechnique IS NULL`), `withDbRetry`, fail-safe | `lib/startup-tasks.ts` + `src/data/joke-decryptages.json` |
| **Désactivation des 24 vannes faibles** (soft delete, SANS IA) | au boot (~30 s) | `deactivateWeakJokesTask()` : `updateMany` `isActive=false` sur les 24 `content` de `src/data/weak-jokes.json`, idempotent (ne touche que `isActive: true`), `withDbRetry`, fail-safe | `lib/startup-tasks.ts` + `src/data/weak-jokes.json` |
| **CEO tick** (si activé) | scheduler, 2-4h UTC | time gate + lock + court-circuit kill-switch → fetch `/api/cron/ceo-tick` | `instrumentation.ts` job 9 |
| **CEO KPIs snapshot** (si activé) | scheduler, 5h UTC | time gate + lock + court-circuit → `snapshotCeoKpis()` | `instrumentation.ts` job 10 |

**Garanties** :
- Le CEO démarre **désactivé** (aucun coût, aucune action). Thomas l'active quand il veut via le toggle `/admin/ceo` ou `POST /api/admin/ceo/kill-switch`.
- Les **265 vannes sont décryptées INTÉGRALEMENT et INSTANTANÉMENT au boot**, en une passe, depuis le fichier pré-rédigé bundlé (`src/data/joke-decryptages.json`). **Zéro appel IA, zéro coût, zéro action manuelle.** Idempotent : une fois appliqué, les boots suivants ne touchent plus rien. (L'ancien back-fill IA progressif 50/jour a été retiré.)
- Les **24 vannes faibles** flaggées par les rédacteurs (s10, décision fondateur qualité > quantité) sont **désactivées (soft delete) au boot** via `deactivateWeakJokesTask()` : `isActive=false` sur les vannes dont le `content` figure dans `src/data/weak-jokes.json`. Le catalogue filtre déjà sur `isActive` → elles disparaissent du front **sans perte d'historique** (favoris/likes préservés). Idempotent (`WHERE isActive: true`), fail-safe, sans IA. **Réversibilité** : remettre `isActive=true` en DB OU retirer le content de `weak-jokes.json`. Catalogue actif : 289 → **265 vannes**.
- Les **nouvelles vannes quotidiennes** (générées par `generateDailyJoke`) reçoivent leur décryptage via l'IA **à la génération** — `generateJokeDecryptage` reste actif uniquement pour ce cas.
- Toutes les tâches sont **fail-safe** : si la DB est froide (Neon cold start), elles loggent mais ne crashent pas le démarrage. Le boot suivant rattrape.
- Triple verrou anti coûts (bug P0 s8) sur chaque job scheduler : **time gate horaire + `tryAcquireLock` + court-circuit kill-switch/vide**.

> **Note migrations versionnées** : le deploy Replit utilise `prisma db push` (pas `migrate deploy`), qui ne joue PAS les migrations de **données** (ex. `8_cleanup_wildcard`). C'est pourquoi le cleanup est aussi exécuté au boot via `startup-tasks.ts` (garanti + idempotent). Si tu préfères basculer sur `prisma migrate deploy` au build, c'est possible mais **risqué** (la DB a été initialisée via `db push`, pas via migrations → conflit de baseline `_prisma_migrations`). NE PAS changer sans test sur une DB jetable. Le contournement actuel (cleanup au boot) évite ce risque.

### B. LE MINIMUM IRRÉDUCTIBLE MANUEL (~3 étapes)

Ce qui ne PEUT PAS être dans le code (secrets, validations externes, action humaine) :

**1. Merge + Deploy** (l'action elle-même)
- Merge la branche dans `master`, clique **Deploy** sur Replit. Tout le reste s'enchaîne automatiquement (voir section A).

**2. Secrets Replit** (à poser une fois — Replit > Secrets)
Le code se **désactive proprement** si un secret manque (pas de crash). Liste minimale pour activer chaque feature :

| Secret | Pour quoi | Comment l'obtenir |
|---|---|---|
| `DATABASE_URL` | DB (déjà posé) | Auto Replit PostgreSQL |
| `CRON_SECRET` | scheduler ↔ crons HTTP | `openssl rand -hex 32` |
| `ANTHROPIC_API_KEY` | génération contenu + CEO + vannes | console.anthropic.com |
| `ADMIN_PASSWORD` | accès `/admin/*` (dont toggle CEO) | choisir une passphrase forte |
| `RESEND_API_KEY` | emails (rapport hebdo CEO, inbound) | resend.com dashboard |
| `UNSUBSCRIBE_HMAC_SECRET` | footer unsubscribe RGPD (sinon envoi email CEO bloqué) | `openssl rand -hex 32` |
| `ADRESSE_POSTALE` | conformité CPCE footer email | décision Thomas |
| `CEO_ADMIN_EMAIL` | destinataire rapport hebdo CEO | `alex@deviens-marrant.fr` |
| `NEXT_PUBLIC_BASE_URL` | liens unsubscribe | `https://deviens-marrant.fr` |
| `TWITTER_BEARER_TOKEN` | DM CEO (optionnel — se désactive si absent) | developer.twitter.com |
| `RESEND_WEBHOOK_SECRET` | webhook Resend inbound (optionnel) | `openssl rand -hex 32` |
| `BUFFER_*` | publication sociale (déjà posés probablement) | buffer.com |

> Total ≈ 12 secrets, dont ~5 réellement bloquants pour le cœur web (DATABASE_URL, CRON_SECRET, ANTHROPIC_API_KEY, ADMIN_PASSWORD, RESEND_API_KEY). Les autres débloquent des features spécifiques (CEO email, DM, inbound).

**3. Configs dashboard externes + légal** (one-shot, hors code)
- **Webhook Resend Inbound** (si replies email CEO souhaités) : dashboard Resend → endpoint `https://deviens-marrant.fr/api/webhooks/resend-inbound`, secret = `RESEND_WEBHOOK_SECRET`.
- **3 DPA légaux** (sous-traitants RGPD) : signer les Data Processing Agreements Anthropic, Resend, Neon (action juridique, pas technique).

**C'est tout.** Plus besoin d'insérer la config CEO en SQL, ni de lancer le back-fill à la main, ni de configurer les crons CEO sur Replit Scheduled Deployments (le scheduler interne les couvre). Les sections historiques ci-dessous restent comme référence des phases passées.

---

## Actions Replit — Setup MOBILE V1

> Ce fichier liste toutes les actions manuelles à effectuer par Thomas pour finaliser la V1 mobile (iOS + Android).
> Les livrables code et docs sont déjà produits dans le repo. Cette checklist couvre le "last mile" (comptes développeurs, certificats, premiers builds, submission).

## Hook pre-commit (anti-récidive bugs enum Prisma)

> Ajouté session 8 (commit eeb08f3) après 3 bugs P0 d'affilée sur l'enum `SocialFormat`.

Le hook `.githooks/pre-commit` du repo vérifie 2 choses avant chaque commit :
1. CLAUDE.md section Gradient ≤ 125L (existant)
2. **Cohérence enums Prisma vs usages code** — exécute `scripts/check-prisma-enums.sh` si `schema.prisma` ou `apps/web/src/` modifiés

Pour activer le hook (1 fois par poste local + sur Replit shell) :

```bash
git config core.hooksPath .githooks
```

Sans cette commande, **le hook n'est PAS exécuté** et la protection est inactive. À faire AU PLUS VITE pour ne plus reproduire les bugs MINI_STANDUP / WILD_CARD.

Pour tester manuellement à tout moment :
```bash
bash scripts/check-prisma-enums.sh
```

Si le hook bloque un commit légitime (nouvelle constante interne) → ajouter la valeur à WHITELIST dans `scripts/check-prisma-enums.sh`.

## Fix s10 — Retry Neon cold start (P1 ouvert depuis le 08/04)

> P1 PROD : Neon free tier suspend le compute DB après ~5 min d'inactivité. Au réveil d'un cron sur DB froide, le 1er appel Prisma tapait avant la fin du wake (1-5s) → erreur `P1001 Can't reach database server` → le cron plantait et spammait une alerte email (~toutes les 3h).

**Aucune action Replit requise.** Fix 100% code (Option A, budget 0€) :
- Nouveau helper `apps/web/src/lib/db-retry.ts` (`withDbRetry`) : retry 3× backoff exponentiel (500ms → 1s → 2s) UNIQUEMENT sur erreurs de connexion (`P1001`, `Can't reach database server`, `Connection terminated`, `ECONNREFUSED`, `ETIMEDOUT`). Les autres erreurs (P2002, validation) sont re-throw immédiatement.
- Wrappé sur le 1er appel Prisma des crons : `publish-social`, `social-analytics`, `daily-social`. `ceo-tick` déjà résilient (son `tryAcquireLock` est silent-fail, pas d'alerte).

**Comportement attendu post-deploy** : plus d'alertes email "cron a planté" liées au cold start. Le 1er appel se réveille au retry (~500ms-1.5s) au lieu de planter. Une alerte ne reste émise QUE si la DB est réellement injoignable après 3 tentatives (panne légitime).

**Si le spam persiste après deploy** (très improbable — wake Neon < 5s, budget retry ~1.5s mais pool_timeout=30s couvre la marge) : l'alternative est l'upgrade Neon (plan payant sans suspension du compute), **hors budget actuel**. À arbitrer avec Thomas seulement si le retry s'avère insuffisant en prod.

## Hotfix s10 (06/05/2026) — Bug Buffer rate limit 24h en boucle

> P0 PROD ACTIF. Toutes publications Twitter/LinkedIn/Instagram coupées tant que le rate limit 429 reste actif. Bloque acquisition organique = bloque MRR.

**Diagnostic** : `publish-social/route.ts` a un circuit breaker correct (skip plateformes FAILED 429 sur 24h via `recentRateLimits`), mais `social-analytics/route.ts` interrogeait Buffer SANS check circuit breaker → relance la fenêtre 24h en boucle à chaque exécution (toutes les 15 min côté Replit Scheduled Deployments).

**Fixes appliqués (commit s10)** dans `apps/web/src/app/api/cron/social-analytics/route.ts` :
1. **Time gate utcHour** : exécution effective uniquement aux heures paires (1× toutes les 2h). Bypass debug avec `?force=1`.
2. **Cache module-level 60 min** sur `getBufferScheduledPosts()` — amortit la pression Buffer même si le cron est appelé toutes les 15 min.
3. **Circuit breaker** : si TOUTES les plateformes (Twitter, LinkedIn, Instagram) sont en rate limit 24h (FAILED + `directorNote contains "429"`), on **NE LIT PAS** la queue Buffer. C'est le fix critique anti-boucle.

**Action manuelle Thomas (Replit Console)** :

Dans **Replit > Deployments > Scheduled Deployments**, réduire la fréquence du cron `social-analytics` :
- **Avant** : toutes les 15 min (`*/15 * * * *`)
- **Après** : toutes les 2h (`0 */2 * * *`)

Raison : le time gate interne renvoie `skipped:true` aux heures impaires, mais on évite quand même les invocations inutiles (Replit facture chaque exécution autoscale).

Le cron `publish-social` reste à sa fréquence actuelle (toutes les 30 min) — il n'est pas concerné par ce bug.

**Validation** : 9 nouveaux tests Jest dans `apps/web/src/__tests__/api/cron/social-analytics.test.ts` couvrent les 3 fixes. Lancer :
```bash
cd apps/web && npx jest src/__tests__/api/cron/social-analytics.test.ts
```

---

## Hook pre-commit (existant — rappel)

⚠️ **PRÉREQUIS BLOQUANT** : avant tout, vérifier que la branche `master` est à jour (Réflexe P0 #2).

```bash
git fetch origin
git log master..HEAD --oneline   # diff entre master et la branche actuelle
git show master:apps/web/src/lib/auth.ts | head -50   # vérifier la version déployée
```

Si écart important → résoudre AVANT le premier `cap sync`. Sinon l'app mobile en prod va appeler des endpoints potentiellement obsolètes (risque 6+ semaines de fixes invisibles).

---

## 0. Vue d'ensemble

| Étape | Action | Coût | Temps estimé |
|---|---|---|---|
| 1 | Créer compte Apple Developer | 99€/an | 5-10j (validation Apple) |
| 2 | Créer compte Google Play Console | 25€ one-shot | 1-2j (validation Google) |
| 3 | Créer compte RevenueCat | Gratuit (jusqu'à 10K$ MTR) | 15min |
| 4 | Créer projet Firebase + activer FCM | Gratuit | 30min |
| 5 | Générer clé APNs Apple | Inclus Apple Dev | 15min |
| 6 | Configurer RevenueCat avec App Store + Play | Inclus | 1h |
| 7 | Premier `cap add ios` + `cap add android` | - | 30min |
| 8 | Migration Prisma PushToken + WebhookEvent | - | 10min |
| 9 | Installer package `apn` (APNs serveur) | - | 5min |
| 10 | Créer middleware CORS | - | 15min |
| 11 | Modifier NextAuth cookies SameSite=None | - | 10min |
| 12 | Générer assets (icons + splash) via @capacitor/assets | - | 15min |
| 13 | Premier build iOS via Xcode | Mac requis | 1h |
| 14 | Premier build Android via Android Studio | - | 1h |
| 15 | Upload TestFlight (iOS internal testing) | - | 30min |
| 16 | Upload Play Console Internal Testing | - | 30min |
| 17 | Soumission App Store (review 24-48h) | - | 30min + attente |
| 18 | Soumission Play Store (review 1-7j) | - | 30min + attente |

---

## 1. Compte Apple Developer (99€/an)

1. Aller sur https://developer.apple.com/programs/enroll
2. Choisir "Individual" ou "Organization" (Organization recommandé pour projets pros)
3. Payer 99€
4. **Attente 5-10 jours** pour validation Apple (vérifications identité)
5. Une fois actif, accéder à App Store Connect : https://appstoreconnect.apple.com
6. **Créer une App** :
   - Bundle ID : `fr.deviensmarrant.app`
   - Name : `Deviens Marrant`
   - Primary Language : French
   - SKU : `dm-ios-001`

## 2. Compte Google Play Console (25€)

1. Aller sur https://play.google.com/console/signup
2. Payer 25€ (one-shot, lifetime)
3. **Attente 24-48h** validation Google
4. **Créer une App** :
   - App name : `Deviens Marrant`
   - Default language : Français (France)
   - App or game : App
   - Free or paid : Free (avec achats in-app)

## 3. RevenueCat — Setup IAP unifié

1. Créer compte gratuit : https://app.revenuecat.com/signup
2. Créer un projet "Deviens Marrant"
3. **Onglet Apps** :
   - Add app iOS : `fr.deviensmarrant.app` + uploader le `.p8` In-App Purchase Key (généré dans Apple Developer > Keys)
   - Add app Android : `fr.deviensmarrant.app` + uploader le service account JSON Google Play
4. **Onglet Products** :
   - Créer `premium_monthly` (lié aux deux stores)
   - Créer `premium_yearly` (optionnel V1, recommandé)
5. **Onglet Entitlements** : créer `premium`, lier les 2 products
6. **Onglet Offerings** : créer `default`, ajouter les 2 packages
7. **Onglet API Keys** : copier les 2 clés publiques (iOS + Android)
8. **Onglet Integrations > Webhooks** :
   - URL : `https://deviens-marrant.fr/api/iap/revenuecat-webhook`
   - Authorization Header Name : `Authorization`
   - Authorization Header Value : `Bearer <secret>` (générer un secret 32+ chars)

### Secrets Replit à ajouter

```
NEXT_PUBLIC_REVENUECAT_API_KEY_IOS=appl_xxxxx
NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_xxxxx
REVENUECAT_WEBHOOK_SECRET=<même secret que l'URL webhook>
```

## 4. Firebase + FCM (Push Android)

1. Créer projet : https://console.firebase.google.com
2. Add app Android : package `fr.deviensmarrant.app`
3. Télécharger `google-services.json` → placer dans `android/app/` après `cap add android`
4. Project Settings > Cloud Messaging > **Server key** (Legacy)
5. Si Server Key non visible : Cloud Console > APIs & Services > Library > activer "Cloud Messaging API (Legacy)" puis revenir

### Secret Replit

```
FCM_SERVER_KEY=AAAAxxxxx:APA91bxxxxx
```

## 5. APNs (Push iOS)

1. Apple Developer > Certificates, IDs & Profiles > **Keys** > "+"
2. Activer "Apple Push Notifications service (APNs)"
3. Continue + Register
4. **Télécharger le `.p8` UNE SEULE FOIS** (Apple ne permet pas de redownload — sauvegarder)
5. Noter le **Key ID** (10 caractères, ex : ABCD1234XY)
6. Account > Membership > **Team ID** (10 caractères)

### Secrets Replit

```
APNS_KEY_ID=ABCD1234XY
APNS_TEAM_ID=XXXXXXXXXX
APNS_BUNDLE_ID=fr.deviensmarrant.app
APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkw...
-----END PRIVATE KEY-----"
```

(Coller le contenu intégral du fichier `.p8`, retours ligne préservés. Replit Secrets supporte les multi-lignes.)

## 6. Migration Prisma — Modèles PushToken + WebhookEvent

Éditer `prisma/schema.prisma` (et la copie `apps/web/prisma/schema.prisma`) :

```prisma
model PushToken {
  id          String   @id @default(cuid())
  token       String   @unique
  platform    String   // "ios" | "android"
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  lastSeenAt  DateTime @default(now())

  @@index([userId])
  @@index([lastSeenAt])
}

// Vérifier si WebhookEvent existe déjà depuis l'audit du 15/03 — sinon ajouter :
model WebhookEvent {
  id          String   @id @default(cuid())
  eventId     String   @unique
  provider    String   // "stripe" | "revenuecat"
  eventType   String
  receivedAt  DateTime @default(now())

  @@index([provider, eventType])
}
```

Sur `model User`, ajouter :
```prisma
  pushTokens  PushToken[]
```

Puis :
```bash
cd apps/web
npx prisma db push
npx prisma generate
```

## 7. Installer package `apn` pour APNs serveur

```bash
cd apps/web
npm install apn
```

Puis finaliser `app/api/cron/daily-push/route.ts` fonction `sendAPNS()` selon le snippet documenté dans `docs/mobile/infrastructure-mobile.md` §1.

## 8. Middleware CORS

Créer `apps/web/src/middleware.ts` selon le contenu de `docs/mobile/infrastructure-mobile.md` §5.

## 9. NextAuth cookies SameSite=None

Modifier `apps/web/src/lib/auth.ts` :

```typescript
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      secure: true,
    },
  },
},
useSecureCookies: true,
```

⚠️ Tester en dev (HTTPS local nécessaire — utiliser `mkcert` ou tunnel Cloudflare).

## 10. Build check obligatoire

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build && BUILD_TARGET=mobile npm run build:mobile && npx jest --no-coverage
```

Si échec → corriger avant `cap sync`.

## 11. Capacitor — Premier add iOS + Android

Depuis la racine du projet :

```bash
# Install Capacitor (déjà fait via package.json après les ajouts)
cd apps/web
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android \
  @capacitor/push-notifications @capacitor/share @capacitor/app \
  @capacitor/status-bar @capacitor/splash-screen \
  @revenuecat/purchases-capacitor

# Build mobile (export statique)
BUILD_TARGET=mobile npm run build

# Retour à la racine
cd ../..

# Init (si pas déjà fait — capacitor.config.ts existe déjà)
# npx cap init "Deviens Marrant" "fr.deviensmarrant.app" --web-dir=apps/web/out

# Add platforms
npx cap add ios
npx cap add android

# Sync (copie l'export Web + plugins natifs)
npx cap sync
```

## 12. Génération assets icons + splash

Depuis la racine :

```bash
npm install --save-dev @capacitor/assets

# Convertir SVG → PNG master (si pas encore fait)
# Outil au choix : Figma, Inkscape, rsvg-convert
# Inputs requis dans apps/web/resources/ :
#   - icon.png (1024x1024)
#   - icon-foreground.png (1024x1024 alpha)
#   - icon-background.png (1024x1024)
#   - splash.png (2732x2732)
#   - splash-dark.png (2732x2732)

# Si tu as juste icon.png et splash.png, @capacitor/assets dérive le reste :
npx capacitor-assets generate \
  --iconBackgroundColor "#8B5CF6" \
  --iconBackgroundColorDark "#0F0817" \
  --splashBackgroundColor "#8B5CF6" \
  --splashBackgroundColorDark "#0F0817"
```

## 13. Build iOS (Mac requis)

```bash
npx cap open ios
# → Ouvre Xcode

# Dans Xcode :
# 1. Sélectionner le projet "App" dans le navigator
# 2. Tab "Signing & Capabilities"
#    - Team : ton Apple Developer team
#    - Bundle Identifier : fr.deviensmarrant.app (déjà défini)
#    - Activer "Automatically manage signing"
# 3. Add Capabilities :
#    - Push Notifications
#    - Background Modes > Remote notifications
# 4. Choisir un device "Any iOS Device (arm64)" pour archive
# 5. Product > Archive
# 6. Window > Organizer > Distribute App > App Store Connect > Upload
```

Une fois l'archive uploadée, elle apparaît dans App Store Connect > TestFlight après ~30 minutes (processing).

## 14. Build Android

```bash
npx cap open android
# → Ouvre Android Studio

# Dans Android Studio :
# 1. Build > Generate Signed Bundle / APK > Android App Bundle
# 2. Si pas de keystore : "Create new" — sauvegarder le keystore + mots de passe (CRITIQUE — sans ça pas de mise à jour possible)
# 3. Build variant : release
# 4. Le fichier .aab est dans android/app/release/app-release.aab
```

Recommandation : utiliser **Play App Signing** (Google gère la clé de signing). Plus safe.

## 15. Upload TestFlight (iOS)

1. App Store Connect > ton app > TestFlight
2. Le build uploadé via Xcode apparaît
3. Compléter "Test Information" (Beta App Description, Email)
4. Add Internal Testers (max 100, gratuit, pas de review Apple)
5. Tester sur device réel via app TestFlight
6. **Vérifier** :
   - [ ] Onboarding 5 écrans fluide
   - [ ] Push notif arrive bien à 9h (ou test manuel via cron)
   - [ ] Achat IAP fonctionne en sandbox (créer un Sandbox Tester dans App Store Connect > Users and Access > Sandbox)
   - [ ] Restore Purchases fonctionne
   - [ ] Suppression compte cascade
   - [ ] NextAuth login fonctionne dans le webview

## 16. Upload Play Console Internal Testing

1. Play Console > ton app > Testing > Internal testing
2. Create new release > Upload .aab
3. Add testers (email list)
4. Lien partagé aux testeurs → install via Play Store
5. Tests identiques iOS + spécifiques Android (back button, share intent)

## 17. Soumission App Store (review)

1. App Store Connect > ton app > **App Store** tab
2. Compléter :
   - **App Information** : catégorie Lifestyle, secondary Education
   - **Pricing and Availability** : Free (avec IAP)
   - **App Privacy** : remplir Privacy Nutrition Labels (voir `docs/mobile/legal-mobile.md` §1)
   - **Age Rating** : 12+
3. **Prepare for Submission** :
   - Description (copier `docs/mobile/aso-mobile.md` §1)
   - Keywords (idem)
   - Support URL : `https://deviens-marrant.fr/contact`
   - Marketing URL : `https://deviens-marrant.fr`
   - Privacy Policy URL : `https://deviens-marrant.fr/confidentialite-mobile`
4. **Screenshots** : uploader 5 captures par taille (6.7", 6.5", 5.5")
5. **Build** : sélectionner le build TestFlight validé
6. **In-App Purchases** : créer `premium_monthly` dans App Store Connect (lié à RevenueCat)
7. **Submit for Review**
8. Attente review : 24-48h en général

## 18. Soumission Play Store

1. Play Console > Production > Create new release
2. Promote depuis Internal testing OU upload nouveau .aab
3. Compléter :
   - **Store listing** : titre, description (`docs/mobile/aso-mobile.md` §3), screenshots, feature graphic
   - **Content rating** : remplir le questionnaire (Teen — humour suggestif occasionnel)
   - **Data safety** : remplir form (voir `docs/mobile/legal-mobile.md` §2 tableau)
   - **App content** : Privacy policy URL
   - **Subscriptions** : créer `premium_monthly` (lié RevenueCat)
4. **Send for review**
5. Attente review : 1-7 jours (variable)

---

## Risques persistants — À garder en tête

| # | Risque | Action |
|---|---|---|
| R1 | Master merge non confirmé | Vérifier `git show master:...` AVANT cap sync |
| R2 | IAP -30% commission = -9% MRR estimé | Monitor 90j, ajuster tarif mobile +30% si confirmé |
| R3 | Réflexe P0 #2 — vérifier branche déployée | Tout fix prod : commencer par `git show master:<file>` |

---

## Checklist finale avant submission

- [ ] Master merge confirmé (Réflexe P0 #2)
- [ ] Build web + mobile passent (`npm run build && BUILD_TARGET=mobile npm run build:mobile`)
- [ ] Tests passent (`npx jest --no-coverage`)
- [ ] Migration Prisma effectuée (PushToken + WebhookEvent)
- [ ] Package `apn` installé + sendAPNS finalisé
- [ ] Middleware CORS créé
- [ ] NextAuth cookies SameSite=None
- [ ] 8 secrets Replit ajoutés (FCM, APNs, RevenueCat)
- [ ] CGV mobile en ligne : `https://deviens-marrant.fr/cgv-mobile`
- [ ] Privacy mobile en ligne : `https://deviens-marrant.fr/confidentialite-mobile`
- [ ] Apple Developer + Google Play Console actifs
- [ ] RevenueCat configuré + webhook actif
- [ ] FCM Server Key + APNs `.p8` en place
- [ ] Premier build TestFlight + Play Console Internal validés
- [ ] Sandbox IAP testé avec succès
- [ ] Push notif testée (manuel + cron)

---

## Phase 5.A — CEO Agent — Couche données + agent core (session 10)

> Migration Prisma + squelette agent posé. Cette section liste les actions manuelles Replit pour activer la base CEO en production.
> Source : `docs/product/ceo-agent-specs.md` §2, `docs/ia/ceo-agent-architecture.md`, branche `claude/marrant-s10-ceo-implementation-*`.

### 1. Migration Prisma — créer les 9 tables CEO + extensions User

```bash
# Sur Replit shell, après merge de la branche dans master :
cd apps/web
npx prisma generate
npx prisma migrate deploy   # applique 5_add_ceo_tables/migration.sql
```

Tables créées :
- `CeoConfig` (singleton kill-switch + budget + dryRun)
- `CeoTask` (file de tâches PENDING/RUNNING/DONE/FAILED)
- `CeoMemory` (clé/valeur namespace, mémoire long-terme + TTL court-terme)
- `CeoLead` (CRM léger, score 0-50, status COLD→IN_SEQUENCE→CONVERTED)
- `CeoOutboundMessage` (messages outbound + inbound, UTM tracking)
- `CeoKpiSnapshot` (snapshot quotidien KPIs dashboard /admin/ceo)
- `CeoBacklink` (pitchs + acquisitions backlinks 5 canaux)
- `CeoAuditLog` (RGPD rétention 3 ans, PII hashé SHA256)
- `CeoDedup` (anti-spam 24h, hash SHA256)
- `CeoCommentBlacklist` (humoristes pros + influenceurs >10k + journalistes)
- **+ `SocialPostDailyLock`** (P1 race condition s08/04 — 1 run social/jour)

Colonnes ajoutées sur `User` :
- `lastCeoTouchpoint TIMESTAMP(3)` (fenêtre attribution conversion 7j)
- `emailOptOut BOOLEAN DEFAULT false` (CEO refuse cet utilisateur si true)

Migration **idempotente** : utilise `IF NOT EXISTS` partout. Peut être rejouée sans effet secondaire.

### 2. Seeder initial CeoConfig (kill-switch ON par défaut = SAFE)

Avant le 1er tick CEO, insérer la ligne singleton de config. **Par défaut `enabled = false`** (fail-safe — l'agent ne fait RIEN tant que Thomas ne l'active pas explicitement) :

```sql
-- À exécuter une fois en console Neon ou via prisma studio
INSERT INTO "CeoConfig" (
  "id", "enabled", "dailyBudgetEur", "maxActionsPerTick",
  "autoSendEmail", "autoSendDm", "socialOutboundEnabled", "dryRun", "updatedAt"
) VALUES (
  'ceo-config-singleton', false, 2.0, 3, false, false, false, true, NOW()
)
ON CONFLICT ("id") DO NOTHING;
```

### 3. Nouveaux Secrets Replit à ajouter (Phase 5.A — préparation 5.B)

À mettre dès maintenant dans Replit Secrets (mais pas encore utilisés en Phase 5.A) :

| Secret | Description | Source |
|---|---|---|
| `CEO_KILL_SWITCH_OVERRIDE` | (optionnel) String "true" pour forcer kill-switch même si DB activée | Manuel — dépannage urgence |
| `CEO_ADMIN_EMAIL` | Email destinataire alertes budget + reporting hebdo | `alex@deviens-marrant.fr` |
| `TWITTER_API_KEY` | OAuth dédié CEO (distinct de Buffer) | https://developer.twitter.com Phase 5.B |
| `TWITTER_API_SECRET` | idem | idem |
| `TWITTER_ACCESS_TOKEN` | idem | idem |
| `TWITTER_ACCESS_SECRET` | idem | idem |
| `INSTAGRAM_PAGE_ACCESS_TOKEN` | DMs inbound Business (fenêtre 24h) | Meta Business Suite Phase 5.B |
| `RESEND_INBOUND_WEBHOOK_SECRET` | Validation HMAC webhook Resend Inbound | Resend dashboard Phase 5.B |

**Important** : `TWITTER_*` du CEO doit être un **compte/app distinct** du Buffer daily-social pour éviter les rate limits croisés.

### 4. Vérifier que les tests existants passent

```bash
cd apps/web
npx jest --no-coverage
```

Attendu : **1051/1051 tests passent** (Phase 5.A n'ajoute que des `describe.skip` placeholders, zéro test fonctionnel — ceux-là arrivent en Phase 5.D).

### 5. Préparation Phase 5.B (HORS périmètre Phase 5.A)

À faire en Phase 5.B (prochaine sous-passe) :

- [ ] Créer `/api/cron/ceo-tick` (toutes 2-4h)
- [ ] Créer `/api/cron/ceo-kpis-snapshot` (daily 5h UTC)
- [ ] Créer `/api/ceo/contest` (endpoint art. 22 RGPD)
- [ ] Migrer `apps/web/src/lib/ai/agents/haro-agent.ts` (96 topics + ALEX_BIO + templates) vers le module backlinks de `ceo-agent.ts`
- [ ] Supprimer `haro-agent.ts` + `apps/web/src/app/api/cron/haro/route.ts` après Grep d'orphelins
- [ ] Implémenter `validateCeoOutbound()` dans `standup-director-agent.ts` (gate G-CEO1 anti-surveillance, G-CEO2 anti-FOMO, G-CEO3 valeur éducative > conversion)
- [ ] Intégrations APIs : Twitter v2 DM, Resend Inbound webhook, Instagram Graph
- [ ] Mettre à jour `enforceEmailFooter()` pour les emails CEO (footer opt-out RGPD obligatoire)
- [ ] Implémentation Resend pour envoi rapport hebdo Thomas

### 6. Préparation Phase 5.C / 5.D (HORS périmètre)

- Phase 5.C : Dashboard React `/admin/ceo` (8 composants : timeline, file drafts, funnel, budget, KPIs sem, kill-switch toggle, audit log, leads scoring)
- Phase 5.D : Tests Jest exhaustifs (cible 90% sur `ceo-agent.ts`, `ceo-helpers.ts`, `ceo-validate.ts`)

### Checklist Phase 5.A — done quand :

- [ ] Branche `claude/marrant-s10-ceo-implementation-*` mergée dans master
- [ ] `npx prisma migrate deploy` exécuté avec succès sur Replit (vérifie 11 nouvelles tables + 2 colonnes User)
- [ ] CeoConfig singleton inséré (kill-switch OFF par défaut)
- [ ] 8 nouveaux Secrets Replit ajoutés (vides ok pour Phase 5.A — utilisés en 5.B)
- [ ] Tests existants passent (1051/1051)
- [ ] `runDailySocialJob` lancé une fois → `SocialPostDailyLock` insère 1 ligne (vérifier en console Neon : `SELECT * FROM "SocialPostDailyLock" ORDER BY "createdAt" DESC LIMIT 5;`)

---

## Phase 5.B — CEO Agent — Crons + Director CEO + Footer email + Rapport hebdo (session 10)

### 1. Nouveaux Secrets Replit (BLOQUANTS — à ajouter avant déploiement)

| Secret | Description | Valeur recommandée |
|---|---|---|
| `UNSUBSCRIBE_HMAC_SECRET` | Clé HMAC-SHA256 pour signer les tokens unsubscribe (≥ 32 chars). Si compromis : la rotation invalide tous les liens existants — à générer 1 fois et garder stable. | `openssl rand -hex 32` |
| `ADRESSE_POSTALE` | Adresse postale identifiable pour conformité CPCE L34-5 (footer email obligatoire). Décision Thomas : adresse perso, domiciliation pro, ou formulation minimale type "France". | À trancher par Thomas |
| `CEO_ADMIN_EMAIL` | Email destinataire rapport hebdo CEO (Opus 4.7 lundi) | `alex@deviens-marrant.fr` (par défaut) |
| `NEXT_PUBLIC_BASE_URL` | URL base pour construire les liens unsubscribe (déjà existant probablement) | `https://deviens-marrant.fr` |

**Sans `UNSUBSCRIBE_HMAC_SECRET` configuré** : `enforceEmailFooter()` throw → tout envoi email CEO échoue (BLOQUANT pré-S3 conforme audit @legal).

### 2. Configurer les nouveaux crons Replit (Scheduled Deployments)

| Cron | Fréquence | Endpoint | Header auth |
|---|---|---|---|
| `ceo-tick` | Toutes les heures | `GET https://deviens-marrant.fr/api/cron/ceo-tick` | `Authorization: Bearer $CRON_SECRET` |
| `ceo-kpis-snapshot` | Toutes les heures | `GET https://deviens-marrant.fr/api/cron/ceo-kpis-snapshot` | `Authorization: Bearer $CRON_SECRET` |

**Time gate côté code** :
- `ceo-tick` ne s'exécute QUE entre 2h et 4h59 UTC (sinon retourne `skipped: out-of-window`)
- `ceo-kpis-snapshot` ne s'exécute QUE à 5h UTC (sinon `skipped: out-of-window`)

→ Sur Replit, configurer un cron horaire suffit (les autres heures retournent immédiatement, coût négligeable).

**Pour tester manuellement (force exécution hors fenêtre)** :
```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://deviens-marrant.fr/api/cron/ceo-tick?force=true"
curl -H "Authorization: Bearer $CRON_SECRET" "https://deviens-marrant.fr/api/cron/ceo-kpis-snapshot?force=true"
```

### 3. Endpoint manuel `/api/ceo/contest` (art. 22 RGPD)

Pas de cron — endpoint admin manuel utilisable depuis le futur dashboard `/admin/ceo` (Phase 5.C) ou via curl :

```bash
curl -X POST https://deviens-marrant.fr/api/ceo/contest \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"messageId":"<id>", "reason":"Ton trop directif sur le P3"}'
```

Effet : `CeoOutboundMessage.status = REJECTED`, audit log + blocage envoi.

### 4. Tester le footer email + désinscription

Après déploiement, vérifier que le pipeline complet fonctionne :

```bash
# 1. Lancer un tick CEO en force pour générer un draft email
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://deviens-marrant.fr/api/cron/ceo-tick?force=true"

# 2. Vérifier dans la DB que le footer est présent dans le content
psql $DATABASE_URL -c "SELECT content FROM \"CeoOutboundMessage\" ORDER BY \"createdAt\" DESC LIMIT 1;" | grep "CEO_FOOTER_V1"

# 3. Tester le lien unsubscribe (récupérer un token signé du draft)
# Le token est dans le HTML : <a href=".../api/unsubscribe?token=XXX">
curl -i "https://deviens-marrant.fr/api/unsubscribe?token=<token>"
# Attendu : 200 + page HTML "Désinscription confirmée"
```

### 5. Vérifier conformité Audit @legal s9 (BLOQUANT pré-S3)

- [ ] `enforceEmailFooter()` appelé dans `composeOutboundMessage()` AVANT `dualPassValidate()` (déjà câblé Phase 5.B)
- [ ] Footer contient adresse postale identifiable (`ADRESSE_POSTALE` configuré)
- [ ] Lien désinscription token signé HMAC valide
- [ ] Mention "Tu reçois cet email parce que tu t'es inscrit·e..." (CPCE L34-5)
- [ ] User.emailOptOut respecté dans `handleOutboundEmail` (skip envoi si true)
- [ ] CeoLead.optOut + status OPT_OUT respectés

### 6. HORS périmètre Phase 5.B (gardé pour 5.B.2 / 5.C / 5.D)

À faire en Phase 5.B.2 :
- [ ] Twitter v2 DM API (auth OAuth + send DM + Resend Inbound webhook)
- [ ] Instagram Graph API (drafts permanents)
- [ ] Suppression `haro-agent.ts` (migration des 96 topics + ALEX_BIO + templates → module backlinks CEO)
- [ ] Remplacement scraping Connectively/SourceBottle par RSS/Zapier (recommandation @legal)
- [ ] Lead scoring auto (signaux Umami + DB `User.streak`/`JokeLike`)

À faire en Phase 5.C :
- [ ] Dashboard React `/admin/ceo` (8 composants — cf docs/analytics/ceo-kpis-dashboard.md)
- [ ] UI contest message (bouton "Contester" sur chaque draft)
- [ ] UI kill-switch toggle

À faire en Phase 5.D :
- [ ] Tests Jest exhaustifs (cible 90% coverage `ceo-agent.ts`, `ceo-helpers.ts`, `ceo-email-footer.ts`)
- [ ] Tests E2E pipeline complet (draft → validation → footer → send → unsubscribe)

### 7. Pre-commit check (BLOQUANT — Règle n°6 CLAUDE.md)

Sur Replit avant tout commit :

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build
```

Si une commande échoue → corriger AVANT de commiter. Phase 5.B introduit 4 nouveaux fichiers + 3 modifs (ceo-agent.ts, ceo-helpers.ts, standup-director-agent.ts) — toute erreur TypeScript doit être traitée.

### Checklist Phase 5.B — done quand :

- [ ] 4 nouveaux Secrets Replit configurés (`UNSUBSCRIBE_HMAC_SECRET`, `ADRESSE_POSTALE`, `CEO_ADMIN_EMAIL`, `NEXT_PUBLIC_BASE_URL`)
- [ ] 2 crons configurés sur Replit Scheduled Deployments (ceo-tick, ceo-kpis-snapshot)
- [ ] `npx prisma migrate deploy` re-exécuté (rien de nouveau Phase 5.B mais idempotent OK)
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Test manuel `?force=true` sur les 2 crons → réponses JSON success
- [ ] Test manuel `/api/unsubscribe?token=...` → page HTML "Désinscription confirmée"
- [ ] Test manuel `POST /api/ceo/contest` → 200 + audit log inséré
- [ ] Vérifier en DB qu'un draft email contient bien le marker `CEO_FOOTER_V1`

---

## Phase 5.B.2 — APIs externes CEO (Twitter v2 DM + Resend Inbound + suppression haro-agent)

> Livrée session 9 (3e sous-passe Phase 5). Couvre l'envoi LIVE de DMs Twitter
> + la réception de replies email Resend + la migration haro-agent → ceo-backlinks.

### 1. Nouveaux Replit Secrets (BLOQUANT)

```
TWITTER_BEARER_TOKEN=AAAA...      # OAuth 2.0 Bearer (lookup user OK, DM POST exige user-context)
RESEND_WEBHOOK_SECRET=<32+ chars> # HMAC SHA-256 — généré via `openssl rand -hex 32`
```

**Note Twitter user-context (DM POST)** : le Bearer suffit pour `lookupTwitterUserId`, mais `POST /2/dm_conversations/...` exige OAuth 1.0a User Context en prod. Si Twitter retourne 401 sur le DM send, ajouter aussi :
```
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_SECRET=...
```
(Phase 5.B.3 — pour l'instant le Bearer reste le default, on log 401 et on traitera quand ça arrive.)

### 2. Configuration webhook Resend Inbound

Dashboard Resend → Webhooks :
1. Endpoint : `https://deviens-marrant.fr/api/webhooks/resend-inbound`
2. Events : `email.received` (inbound replies)
3. Signing secret : utiliser la valeur mise dans `RESEND_WEBHOOK_SECRET`
4. Test : Resend permet d'envoyer un payload test → vérifier 200 OK + entrée dans `CeoOutboundMessage` direction=`INBOUND_REPLY`

Si Resend Inbound n'est pas activé sur le compte (pricing payant), reporter en Phase 5.B.3 — le code est prêt et inerte sans webhook envoyé.

### 3. Suppression du cron HARO

Replit Scheduled Deployments → Supprimer le cron `/api/cron/haro` (s'il existait). La route est supprimée du code (404 sinon). Le module `haro-agent.ts` est remplacé par `ceo-backlinks.ts` (96 topics + bio collective + 8 templates) et la fonction `pitchToBacklinkOpportunity()` exposée par `ceo-agent.ts`.

### 4. Pre-commit check (BLOQUANT — Règle n°6 CLAUDE.md)

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build
```

3 nouveaux fichiers Phase 5.B.2 :
- `apps/web/src/lib/ai/ceo-backlinks.ts`
- `apps/web/src/lib/twitter/twitter-client.ts`
- `apps/web/src/app/api/webhooks/resend-inbound/route.ts`

2 fichiers modifiés :
- `apps/web/src/lib/ai/agents/ceo-agent.ts` (ajout `pitchToBacklinkOpportunity`, complétion `handleOutboundDm`, routage `DRAFT_DM_REPLY`)
- `apps/web/src/__tests__/lib/ceo-backlinks.test.ts` (remplace `haro-agent.test.ts`)

2 fichiers supprimés :
- `apps/web/src/lib/ai/agents/haro-agent.ts`
- `apps/web/src/app/api/cron/haro/route.ts`
- `apps/web/src/__tests__/lib/haro-agent.test.ts`

### 5. Checklist Phase 5.B.2 — done quand :

- [ ] 2 nouveaux Secrets configurés (`TWITTER_BEARER_TOKEN`, `RESEND_WEBHOOK_SECRET`)
- [ ] Webhook Resend configuré dashboard + test ping 200 OK
- [ ] Cron `/api/cron/haro` supprimé de Replit Scheduled Deployments
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Test manuel `POST /api/webhooks/resend-inbound` avec signature valide → entrée `CeoOutboundMessage direction=INBOUND_REPLY`
- [ ] Test manuel reply contenant "stop" → `User.emailOptOut=true` + `CeoLead.status=OPT_OUT`
- [ ] Tests Jest `ceo-backlinks.test.ts` PASS

### Hors périmètre Phase 5.B.2 (reporté Phase 5.B.3) :

- [ ] Instagram Graph API (drafts permanents)
- [ ] Lead scoring auto (signaux Umami + User.streak/JokeLike)
- [ ] Câblage `siteReturn48h` dans `snapshotCeoKpis` (Umami cross-session)
- [ ] Routage IA des replies entrants (le webhook persiste seulement)
- [ ] Twitter OAuth 1.0a User Context (si DM POST retourne 401 avec Bearer)
- [ ] Remplacement scraping Connectively → RSS/Zapier (handoff manuel Thomas, hors code)

---

## Phase 5.C — Dashboard `/admin/ceo` (frontend)

### Aucun nouveau Secret requis

L'auth utilise le `ADMIN_PASSWORD` existant (mêmes Bearer headers que `/admin/social`).
Aucune action env / Secrets / cron à effectuer côté Replit.

### Vérification post-déploiement

1. Aller sur `https://deviens-marrant.fr/admin/ceo`
2. Login avec `ADMIN_PASSWORD`
3. Vérifier que les 6 onglets se chargent : Tâches, Brouillons, Funnel 30j, KPIs, Backlinks, Audit
4. Si vide partout → c'est normal tant que la Phase 5.B.2 backend n'a pas tourné (pas de tasks, pas de drafts, pas de snapshots KPI)
5. Tester le toggle kill-switch (peut être OFF/ON sans risque tant que `dryRun=true` dans `CeoConfig`)

### Fichiers ajoutés Phase 5.C (frontend uniquement) :

- `apps/web/src/app/admin/ceo/page.tsx`
- `apps/web/src/components/admin/ceo/types.ts`
- `apps/web/src/components/admin/ceo/CeoHeader.tsx`
- `apps/web/src/components/admin/ceo/CeoTasksList.tsx`
- `apps/web/src/components/admin/ceo/CeoDraftsList.tsx`
- `apps/web/src/components/admin/ceo/CeoFunnel.tsx`
- `apps/web/src/components/admin/ceo/CeoKpiPanel.tsx`
- `apps/web/src/components/admin/ceo/CeoBacklinksList.tsx`
- `apps/web/src/components/admin/ceo/CeoAuditLog.tsx`
- `apps/web/src/app/api/admin/ceo/_helpers.ts`
- `apps/web/src/app/api/admin/ceo/data/route.ts`
- `apps/web/src/app/api/admin/ceo/kill-switch/route.ts`
- `apps/web/src/app/api/admin/ceo/run-task/route.ts`
- `apps/web/src/app/api/admin/ceo/approve/route.ts`
- `apps/web/src/app/api/admin/ceo/reject/route.ts`
- `apps/web/src/app/api/admin/ceo/contest/route.ts`
- `apps/web/src/__tests__/feature/CeoHeader.test.tsx`
- `apps/web/src/__tests__/feature/CeoDraftsList.test.tsx`
- `apps/web/src/__tests__/feature/CeoKpiPanel.test.tsx`

### Checklist Phase 5.C — done quand :

- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Tests Jest `CeoHeader / CeoDraftsList / CeoKpiPanel` PASS
- [ ] `/admin/ceo` accessible avec ADMIN_PASSWORD
- [ ] Kill-switch toggle fonctionnel (test ON → OFF → ON, vérifier `CeoConfig.enabled` en DB)
- [ ] Phase 5.D (tests exhaustifs) à lancer ensuite

## Hotfix s9 deploy bugs (07/05/2026 — TSC FAIL 30+ erreurs)

Découvert lors du `npx tsc --noEmit` post-merge de la branche s9. Mix de :
- Bugs Phase 5.A/B nouveaux (4) : casts SocialPlatform/SocialFormat, Prisma.InputJsonValue, union type outcome
- Bugs latents Phase 5 mobile session 7 (3) : `PushToken` model jamais déclaré, `WebhookEvent.eventId` champ jamais ajouté, ces erreurs masquées par `next.config.js ignoreBuildErrors:true` en build (tsc --noEmit ne triche pas)
- Configs (3) : tsconfig target trop bas (Set/Map iteration + regex `s` flag), `@types/jest` absent, `auth-cta` size "default" obsolète

### Actions Replit après merge du commit hotfix

```bash
# 1. Re-installer (pour @types/jest ajouté)
cd apps/web && npm install

# 2. Re-générer le client Prisma (pour PushToken + WebhookEvent.eventId)
npx prisma generate

# 3. Appliquer la nouvelle migration (idempotente — peut être rejouée sans casser)
npx prisma migrate deploy

# 4. Pre-commit check obligatoire (Règle n°6 CLAUDE.md)
npx tsc --noEmit && npx next lint && npm run build
```

### Migration `6_fix_pushtoken_webhookevent_schema/migration.sql`

Idempotente :
- `WebhookEvent` : ajout `eventId` UNIQUE + `provider` + `eventType` + `receivedAt` (backfill `eventId = id` pour rows existants)
- `PushToken` : nouveau modèle (id, userId, token UNIQUE, platform, lastSeenAt, createdAt) + FK `User.id` ON DELETE CASCADE

### Checklist hotfix done quand
- [ ] `npm install` réussit (lock file mis à jour)
- [ ] `npx prisma generate` régénère le client avec `pushToken` et `webhookEvent.eventId`
- [ ] `npx prisma migrate deploy` applique migration 6 sans erreur
- [ ] `npx tsc --noEmit` retourne 0 erreur
- [ ] `npx next lint` passe (warnings OK, errors NOK)
- [ ] `npm run build` réussit
- [ ] Smoke test : POST `/api/cron/ceo-tick?force=true` → 200 + JSON success

---

## Phase 1b — Vannes pédagogiques : décryptage des 265 vannes (session 10)

> Phase 1a (schéma `Joke.comedyTechnique/techniqueExplanation/howToApply` + agent `generateJokeDecryptage` + migration `7_add_joke_decryptage`) déjà livrée et mergée.
> Phase 1b : affichage UI du décryptage dans le catalogue + **application automatique au boot** des 265 décryptages pré-rédigés.
> **Note s10 (retrait vannes faibles)** : le catalogue est passé de 289 → 265 vannes (24 vannes faibles désactivées en soft delete au boot via `deactivateWeakJokesTask`). Les compteurs de cette section reflètent désormais 265.

### Aucune action manuelle requise — c'est appliqué au boot

Les 265 décryptages sont rédigés à la main et bundlés dans `apps/web/src/data/joke-decryptages.json`
(indexés par `content`). À chaque déploiement, ~30 s après le boot, `applyJokeDecryptagesTask()`
(`lib/startup-tasks.ts`) applique les 3 champs (`comedyTechnique`, `techniqueExplanation`,
`howToApply`) à toutes les vannes `comedyTechnique IS NULL`, **en une passe, SANS IA, SANS coût**.

- **Instantané** : le catalogue est décrypté intégralement dès le démarrage (pas de progressif 50/jour).
- **Idempotent** : ne touche que les vannes null → relançable, 0 effet une fois appliqué.
- **Robuste** : `withDbRetry` (cold start Neon) + try/catch global → ne bloque jamais le boot.
- **Log attendu** : `[startup] décryptages appliqués : 265/265.` puis `[startup] vannes faibles désactivées : 24` (au 1er boot post-déploiement ; 0 aux boots suivants car idempotent).

> La migration `7_add_joke_decryptage` (3 colonnes nullable) est appliquée par `prisma db push`
> au build. Le décryptage des données suit au boot.

### Nouvelles vannes quotidiennes (IA conservée)

`generateJokeDecryptage` (Sonnet) reste actif **uniquement** pour les NOUVELLES vannes générées
chaque jour par `generateDailyJoke` : elles reçoivent leur décryptage à la génération. Le catalogue
existant, lui, n'appelle plus jamais l'IA.

### Script manuel (optionnel, debug)

`apps/web/scripts/backfill-joke-decryptage.ts` reste lançable à la main si besoin :

```bash
cd apps/web
npx tsx scripts/backfill-joke-decryptage.ts            # ré-applique depuis le fichier (SANS IA, défaut)
npx tsx scripts/backfill-joke-decryptage.ts --dry-run  # log sans écrire
npx tsx scripts/backfill-joke-decryptage.ts --ai       # fallback IA pour les vannes ABSENTES du fichier
```

### Vérification

```bash
# Doit retourner 0 (toutes les vannes du catalogue sont décryptées)
psql $DATABASE_URL -c "SELECT count(*) FROM \"Joke\" WHERE \"comedyTechnique\" IS NULL AND \"isActive\" = true;"
```

Puis dans le catalogue `https://deviens-marrant.fr/vannes` : cliquer une vanne pour révéler
la chute → un bloc "Pourquoi ça marche — [technique]" + "À toi de jouer" apparaît sous la chute.

### Checklist Phase 1b — done quand :

- [ ] Migration 7 appliquée (via `prisma db push` au build)
- [ ] Au boot, log `[startup] décryptages appliqués : 265/265.`
- [ ] Au 1er boot post-déploiement, log `[startup] vannes faibles désactivées : 24` (puis 0 aux boots suivants)
- [ ] `count(*) WHERE comedyTechnique IS NULL AND isActive` = 0
- [ ] `count(*) WHERE isActive = true` = 265 (catalogue actif après retrait des 24 faibles)
- [ ] Vérif visuelle catalogue (bloc décryptage affiché)
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS

---

## s12 — Adaptation du code pour Cloudflare Workers (29/09/2026) : AUCUNE action Replit

**Aucune action requise sur Replit.** Rien n'est redéployé (décision fondateur du 29/09 : la prod
Replit reste telle quelle jusqu'à la bascule). Détails : `docs/infra/cloudflare-runbook.md`.

Le build et le démarrage Replit (`npm run build` / `npm start` racine, sortie standalone) sont
inchangés et vérifiés (`tsc -p tsconfig.build.json`, `next lint`, `next build` : PASS). Les
chemins Cloudflare passent par de nouveaux scripts (`build:cf`, `preview:cf`, `deploy:cf`) et la
variable `MARRANT_BUILD_TARGET=cloudflare`, jamais posée sur Replit.

Différences observables si cette branche était un jour redéployée sur Replit (retour arrière) :
- Planificateur : corps de `instrumentation.ts` déplacé tel quel dans `src/lib/scheduler/`
  (mêmes jobs, fenêtres, verrous, ordre, self-fetch `localhost`/`127.0.0.1:${PORT}`).
  `register()` ne l'importe que sous `NEXT_RUNTIME === "nodejs"` : l'instrumentation edge
  n'embarque plus de code Node (bundle middleware affiché 51 kB au build).
- 3 images OpenGraph (`/opengraph-image`, `/quiz-humour/…`, `/blog/[slug]/…`) passent du runtime
  edge au runtime Node (OpenNext refuse l'edge) : elles sont désormais prérendues au build
  (même rendu `next/og`).
- `npm install` installe en plus `@prisma/adapter-pg` (non chargé sous Node), `@opennextjs/cloudflare`
  et `wrangler` (dev, binaire workerd : installation plus longue).
- 2 nouvelles routes protégées par `CRON_SECRET` : `/api/cron/scheduler-tick`,
  `/api/cron/startup-tasks` (non planifiées sur Replit).
