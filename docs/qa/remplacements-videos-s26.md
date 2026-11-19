# Remplacements des vidéos YouTube à risque (s26, temps 1 : proposition)

> Date : 19/11/2026. **Proposition seulement** : aucun changement de code, de base ni de données.
> Source : `docs/qa/audit-videos-s26.md`. Décision de Thomas (19/11) : « Il faudra que tu les fasses remplacer, je compte sur toi. »
> Règle P0 : on ne retire pas un humoriste, on remplace la vidéo.

## 1. Méthode et limites

- Recherche : WebSearch (restreint à youtube.com, puis web ouvert pour identifier les ayants droit). Vérification : oEmbed (`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`), 1 requête toutes les 1,1 s, environ 75 appels. Aucune page `watch`, aucun cookie, aucune API interne.
- **Un identifiant n'est proposé que s'il a répondu 200 avec une chaîne officielle** (`author_name` / `author_url` relevés le 19/11, colonne « Preuve »).
- **Non vérifié ici, à faire avant le temps 2** :
  1. **Lecture en France** : oEmbed répond 200 même pour une vidéo bloquée par revendication (cas Gad). Thomas ouvre les remplaçants retenus depuis la France (2 minutes).
  2. **Contenu** : aucune vidéo n'a été visionnée. « Ce qu'il illustre » se fonde sur le titre, la chaîne et la fiche actuelle. Quand le passage change, il faut réécrire la description, les learnings, le défi et le « why » du parcours (@copywriter, puis relecture à l'aveugle : règle d'or P0 s18).
  3. **Durées** : oEmbed ne les donne pas. À lire au temps 2 avec l'API YouTube Data v3 (`contentDetails.duration`, même méthode qu'en s20) ou à relever à la main.

## 2. Remplaçants proposés

Chaînes : Montreux Comedy (`@MontreuxComedy`), Comédie+ (`@Comedieplus`, groupe Canal+), Jamel Comedy Club - CANAL+ (`@jamelcomedyclub`), On n'demande qu'à en rire (`@ondarprime`, émission de France 2), Topito (`@topito`, organisateur de la Topito Comedy Night), France Inter (`@FranceInter`).

| # | Vidéo actuelle | Raison | Remplaçant proposé (id, titre exact oEmbed) | Chaîne : preuve oEmbed 200 | Même passage | Ce qu'il illustre / fiche concernée | Slug change |
|---|---|---|---|---|---|---|---|
| 1 | `PrQTbXOz2iU` Laura Domenge - La vie de couple (public + fiche **storytelling 2.4**) | 404, supprimée | `W7i0KRn_GLY` « "Se remettre avec son ex - Laura Domenge" - Topito Comedy Night #2 » | Topito, `youtube.com/@topito` | **Non** (« La vie de couple » introuvable sur une chaîne officielle ; l'autre copie JCC `BlQ4J3uGIp0` est aussi en 404) | Le couple, sujet de la fiche 2.4 (« un couple, rejoué avec les voix »). Le jeu des voix reste à confirmer au visionnage | **Oui** (nouveau titre) |
| 2 | `6lHjXqelKGo` Gad Elmaleh - Décalages (spectacle complet 1997), passage 2:00-14:00 | Revendication TF1 vue par Thomas ; copie tierce | `BY8kpWBf57M` « Gad Elmaleh : La visite d'appartement - " La vie normale" - Comédie+ » | Comédie+, `youtube.com/@Comedieplus` | **Non** (« Décalages » n'existe que sur des comptes tiers : `sOqwAGgB4Pg`, `70YUkPFZSSY`, `LGchP9vUzvY`) | Observation d'une scène du quotidien jouée par le corps (catégorie OBSERVATION) ; extrait du 2e spectacle (2000), le plus proche de l'époque de Décalages. Plus d'horodatage : c'est un extrait court | **Oui** |
| 3 | `agciwdzBH3w` Bun Hay Mean - Le Chinois marrant | Copie tierce (« Cedric Dric ») | `PaF0YbHim2E` « Bun Hay Mean - Chinois Marrant » | Montreux Comedy, `youtube.com/@MontreuxComedy` | **Probable** (même titre ; à confirmer au visionnage) | Clichés assumés puis retournés (ABSURDE), inchangé si c'est le même passage | **Non** (titre gardé) |
| 4 | `CdRedv9PM40` Fabrice Éboué - Plus rien à perdre (spectacle complet), passage 3:00-15:00 | Copie tierce (« Moulay Soultan ») | `gBILqA2eVrk` « Fabrice Eboué - Les Vegans » | CHEYENNE PROD, `youtube.com/@CHEYENNEPROD` | **Même spectacle, extrait** (« Les Vegans » vient de « Plus rien à perdre », dont les véganes sont un thème selon TheTVDB). `[HYPOTHÈSE : Cheyenne Productions est le producteur du spectacle ; seule source : IMDb]` | Auto-dérision et politiquement incorrect (AUTODERISION). Plus d'horodatage | **Oui** (ex. « Fabrice Éboué - Les vegans (Plus rien à perdre) ») |
| 5 | `3v8Y4C9Q5hE` Kev Adams - Du côté de chez vous (fiche **boulot 3.4**) | Copie tierce (« Valentin HENRY ») | `fSMhy3-7Xpk` « Kev Adams - Le tennis » | Montreux Comedy, `youtube.com/@MontreuxComedy` | **Non** (« Du côté de chez vous » introuvable sur une chaîne officielle) | Fiche 3.4 : « détail que tout le monde reconnaît », l'irritant partagé ; les codes d'un sport connu de tous s'y prêtent. Adéquation à confirmer au visionnage | **Oui** |
| 6 | `v-ySkBGAXLI` Thomas Ngijol - Le voisin (fiche **storytelling 1.4**) | Copie tierce (« Ryme Beast », titre YouTube « Thomas NGIJOL au Jamel Comedy Club ») | `l__Xirj2N6c` « Thomas Ngijol - Superman - Jamel Comedy Club (2006) » | Jamel Comedy Club - CANAL+, `youtube.com/@jamelcomedyclub` | **Inconnu** (le passage d'origine n'a pas de titre officiel ; « Le voisin » introuvable sur la chaîne du JCC) | Fiche 1.4 : la montée (« banal, puis agaçant, puis dément »). Que « Superman » serve l'escalade reste **à vérifier au visionnage** | **Oui** |
| 7 | `XwG5Ie10rEg` Fellag - Petits chocs des civilisations, passage 5:00-17:00 | Compte « MLP MUSIC » (`@MUSIQUESARABES`, label musical sans lien avec le spectacle) | `z563EqfnqQE` « Fellag - Petits Chocs Des Civilisations » | Fellag, `youtube.com/@MuhandFellag`. `[HYPOTHÈSE : chaîne de l'artiste (Mohamed Saïd Fellag), non certifiée]` | **Même spectacle** ; captation et horodatage à relire | Observation des chocs culturels (OBSERVATION) | **Non** |

Remplaçants de secours (tous vérifiés 200, chaîne officielle) si le visionnage écarte le premier choix :
- **Laura Domenge** : `hgfA_AaBwH0` « Laura Domenge – Les groupes Whatsapp de copines » (Montreux Comedy) ; `-K_jNxKkX5c` « Se rappeler d'être amoureux - Laura Domenge n'a pas compris » (France Inter, chronique sur le couple) ; `8_qoQjJXbow` « Laura Domenge - C'est pas facile d'être un homme - Comédie+ » ; `mhHccKb87WI` « Laura Domenge - Internet et insomnie - JAMEL COMEDY CLUB - SAISON 11 (2022) » (JCC - CANAL+).
- **Gad Elmaleh** : `VH7GYpqmD_Q` « Gad Elmaleh : Le blond dans l'avion - L'autre c'est moi - Comédie+ » ; `n34QxIKxPpw` « Gad Elmaleh - Les soirées alcoolisées - Comédie+ » ; `ocYHRzdWvB8` « Gad Elmaleh est Chouchou - CANAL+ » (CANAL+, personnage).
- **Bun Hay Mean** : `x9eoxqnAs_U` « Bun Hay Mean - Chinois Marrant - Comédie+ ».
- **Fabrice Éboué** : `znKP1vwe-tY` « Fabrice Eboué - Les vegans » (même chaîne CHEYENNE PROD, second envoi : garder le plus complet) ; `W2-GjEluR50` « Fabrice Eboué déchire sur scène à Montreux » (Montreux Comedy).
- **Kev Adams** : `etpEFBVvkSQ` « Montreux 2025 – Kev Adams (Sketch complet) » ; `yMUaUF2eTOE` « Kev Adams - Les 30 ans de Montreux Comedy » (Montreux Comedy).
- **Thomas Ngijol** : `8OVE4BuFekg` « THOMAS NGIJOL & CLAUDIA TAGBO - JAMEL COMEDY CLUB - SAISON 3 » ; `Vr-_aW_w5DA` « THOMAS NGIJOL & BLANCHE GARDIN - JAMEL COMEDY CLUB - SAISON 3 » (JCC - CANAL+, duos).
- **Fellag** : `6_LicVuwbdA` « Fellag met son couscous à la sauce picarde » (même chaîne Fellag).

## 3. Les 6 vidéos YouHumour : pas de remplaçant au même niveau, recommandation de garder

`UbaqKoflh_A` Ahmed Sylla, `tj6qta_9PaM` et `jgNSu968qD4` Anne Roumanoff, `R5ophuvAqho` Claudia Tagbo, `JRJJwIdpL00` Constance, `FM1rtYhkSjE` Lamine Lezghad : toutes sur `youtube.com/@YouHumour`.

- **YouHumour n'est pas un compte tiers anonyme** : société créée en 2008 par Philippe Vaillant, producteur d'Anne Roumanoff (et de Laurent Ruquier, Laurent Gerra), qui filme elle-même les « Soirées YouHumour » et son festival ; IMDb Pro la liste comme société de production (ex. « Anne Roumanoff - Best-of 2017 »). Elle entre donc dans la définition « chaîne d'une production ou d'un festival ». `[HYPOTHÈSE : droits détenus par YouHumour ; sources : notice everybodywiki, IMDb Pro, Purepeople ; à confirmer par le test en France]`.
- **Recommandation** : garder les 6 si elles se lisent en France. Les mêmes passages n'existent sur aucune autre chaîne officielle trouvée.
- **Secours si l'une est bloquée en France** (passage différent : textes de fiche à réécrire) :

| Vidéo | Recherché | Secours vérifié (200, chaîne officielle) | Même passage |
|---|---|---|---|
| Ahmed Sylla - La théorie du genre | « Ahmed Sylla théorie du genre sketch » | `aSgOs99hauI` « Ahmed Sylla - Le code de la route #ONDARalamaison » (On n'demande qu'à en rire) | Non |
| Anne Roumanoff - Carmen et la crise | « Anne Roumanoff Carmen sketch officiel » ; autres copies : `tUm7D0dX9TA` (« Ayam »), `pa0qmWncKoM` (« Stand Up Comédie ») : tiers | `qPG7M23xdzY` « Sketch ! Anne Roumanoff : "L'expérience de la vie" - Vivement Dimanche 3 mars 2024 » (Vivement Dimanche - France Télévisions) | Non |
| Anne Roumanoff - La chirurgie esthétique | même recherche | **Aucun secours sur le même thème.** Même secours générique que ci-dessus | Non |
| Claudia Tagbo - Les athlètes | « Claudia Tagbo les athlètes », « Claudia Tagbo Montreux Comedy sketch sport » : aucun passage sportif officiel | `oVzVmHVBeiQ` « Claudia Tagbo - Nous les Femmes... » (Montreux Comedy) ; `3N4orwmdSUk` « Claudia Tagbo - Crazy - La Grande Soirée du rire » (France Télévisions) | Non |
| Constance - Le rendez-vous coquin | « Constance Montreux Comedy OR On n'demande qu'à en rire » | `3OW4BUKaJog` « Constance [21] Le boom des robots aspirateurs - ONDAR » ; `Hb99a0usQU8` « Constance [5] Conseils pour être heureux en 2011 - ONDAR » | Non |
| Lamine Lezghad - Le recruteur raciste | « Lamine Lezghad sketch recruteur » | `B0trLyBsIFI` « Florent Peyre [31] et Lamine Lezghad [25] Les ingénieurs recrutés grâce au poker - ONDAR » (thème du recrutement, en duo) | Non |

Écartés après oEmbed (compte tiers ou non officiel) : « Bloop fun » (`@Bloopfuntv`, suffixes « KS » / « KM » dans les titres, lien avec une production non établi), « Athéna + », « Stand Up Comédie », « Comediefolie », « Malik B », « TV Retro K7 », « Sweet Channel », « Imad Eddine », « Show Box », « Zack Nani Foot & Live ». En 404 ou 403 : `BlQ4J3uGIp0`, `DvU7WIDZoRk`, `dnWCNjfP06c`, `jE376tSr-io`, `vvjO3J5WFpE`, `Kxdou7TTvWM`, `6ZRY3pCNFpY`, `90K6fvRBIrY`, `FIaMCD6xvj8`, `1YYbwgJR6lY` (404) ; `4ad0D_ShVJU`, `s3qyEKMHtus`, `P2WEUIQ-yNA`, `nZ9iJ6IRcoQ` (403).

## 4. Comment les vidéos arrivent en production

| Canal | Fichier | Effet en production |
|---|---|---|
| Seed | `docs/content/videos-seed.json`, lu par `apps/web/prisma/seed-data.ts` (upsert **par `youtubeId`**, désactive les vidéos absentes du seed) | **Aucun** : `prisma db seed` est bloqué en production (`startup-tasks.ts`, l. 7 et 829). Le seed sert aux bases neuves et à la préversion. Changer un `youtubeId` dans le seed puis lancer le seed sur une base existante créerait une **nouvelle ligne** (nouvel id, donc nouveau slug, favoris perdus) et désactiverait l'ancienne : on ne passe pas par là pour la production. |
| Tâche de démarrage | Modèle : `apps/web/src/lib/video-content-s20.ts` + `src/data/video-content-s20.json` (champ `cible.youtubeId`, utilisé pour Dany Boon `U80fwIfPC4M` vers `JNo86HEt86w`), branchée dans `src/lib/startup-tasks.ts` (l. 1458), puis `video-durations-s20.ts` (l. 1466) pour la durée | Mise à jour **sur place** de la ligne `Video` au démarrage qui suit le déploiement : même `id`, donc favoris, « Contenu du jour » et slug conservés si le titre ne change pas. Garde-fou par empreinte, refus si l'id cible existe déjà (`youtubeId @unique`), marqueur `DataPatch`, `note.before` pour le retour arrière. Les tâches s20 sont **déjà passées** (marqueurs posés) : il faut une **nouvelle** tâche, pas une modification des JSON s20. |
| Parcours (fiches de l'espace et pages parcours) | `docs/content/parcours-storytelling-s18.json` (étapes 1 et 2 : Ngijol, Domenge) et `docs/content/parcours-boulot-s19.json` (étape 3 : Kev Adams), importés dans le bundle par `src/lib/parcours-seed.ts` ; découpage `src/data/espace/parcours-fiches.json` (fiches 1.4, 2.4, 3.4 avec `empreinte` du bloc) | Le bloc vidéo (`youtubeId`, `title`, `why`) est **lu depuis le bundle** (`components/parcours/step-blocks.tsx`) : il change au déploiement, sans tâche. L'empreinte des 3 fiches doit être recalculée (le test des fiches s24 échoue sinon, c'est voulu). |
| Horodatage de passage | `recommendedTimestamp` existe **seulement** dans `videos-seed.json` (fiches Gad 2:00-14:00, Fellag 5:00-17:00, Éboué 3:00-15:00) ; aucune colonne en base, aucun usage dans `src/` | Aucun affichage en ligne aujourd'hui : à retirer ou relire dans le seed, sans effet public. |
| Slug public | `buildVideoSlug` (`src/lib/catalogue-slug.ts`) = titre + 10 premiers caractères de l'`id` ; la page `/videos/[slug]` cherche par préfixe puis renvoie en 308 vers le slug canonique | Titre gardé : URL identique. Titre changé : nouvelle URL. Les 89 vidéos partagent 3 préfixes d'id (note s11) : l'ancienne URL retomberait sur le score de mots, au risque d'ouvrir une autre vidéo. Il faut donc une **301 explicite** dans `src/lib/seo-redirects.data.cjs` (ancien slug vers nouveau), calculée avec les `id` de **production** (lecture seule). |

## 5. Plan du temps 2 (après les choix de Thomas)

**Préalables** : (a) Thomas choisit un remplaçant par ligne (premier choix ou secours) et ouvre les remplaçants retenus et les 6 YouHumour depuis la France ; (b) durées lues avec l'API YouTube Data ; (c) pour chaque passage différent (Domenge, Gad, Éboué, Kev Adams, Ngijol, et toute vidéo YouHumour bloquée) : nouvelle description, learnings, défi et « why » par @copywriter (charte et étalons), relecture à l'aveugle (P0 s18), mesure du diff (P0 s11).

**Fichiers**
1. `apps/web/src/data/video-remplacements-s26.json` (nouveau) : par vidéo, `youtubeId` actuel, `attendu` (empreinte du titre et du texte en base), `cible` = `youtubeId`, `title`, `channelName`, `duration`, et les textes réécrits si le passage change.
2. `apps/web/src/lib/video-remplacements-s26.ts` (nouveau), calqué sur `video-content-s20.ts` : garde-fou, refus si l'id cible existe, marqueur `video-remplacements-s26:v1:<ancien id>` dans la même transaction, `note.before`, SQL de retour arrière en commentaire, jamais de `throw`.
3. `apps/web/src/lib/startup-tasks.ts` : brancher la tâche **après** `applyVideoDurationsS20Task()`.
4. `docs/content/videos-seed.json` : mêmes identifiants, titres, durées, textes ; `recommendedTimestamp` retiré pour Gad et Éboué, relu pour Fellag ; Dany Boon aligné sur `JNo86HEt86w` (retard du seed signalé par l'audit). Effet : préversion et bases neuves seulement.
5. `docs/content/parcours-storytelling-s18.json` (étapes 1 et 2) et `docs/content/parcours-boulot-s19.json` (étape 3) : `youtubeId`, `artist`, `title`, `why`. Puis `apps/web/src/data/espace/parcours-fiches.json` : empreintes des fiches 1.4, 2.4 et 3.4 recalculées.
6. `apps/web/src/lib/seo-redirects.data.cjs` : une 301 par titre changé (prévu : Domenge, Gad, Éboué, Kev Adams, Ngijol ; aucune pour Bun Hay Mean et Fellag si leur titre est gardé).
7. Ne pas toucher : `src/data/video-content-s20.json`, `video-durations-s20.json` (déjà appliqués, marqueurs posés) ni `docs/content/boulot-base-s19.json` (photo de la production au 10/10).

**Tests** : nouveau `apps/web/src/__tests__/lib/video-remplacements-s26.test.ts` (garde-fou, collision d'id, idempotence au 2e démarrage, `note.before`, aucune écriture sur refus) ; mise à jour de `src/__tests__/lib/parcours-contenu-s19-boulot.test.ts` (cite `3v8Y4C9Q5hE`) et de `src/__tests__/espace/fiches-contenu-s24.test.ts` (empreintes) ; un test qui vérifie que chaque nouvel id existe dans le seed, dans le JSON de la tâche et dans les parcours. Avant commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, puis `npx tsc --noEmit` et Jest sans secrets Stripe ; CI verte. Contrôle après coup : oEmbed des nouveaux ids (200 et chaîne attendue) et Grep des anciens ids dans `src/` et `docs/content/` (seuls restent les JSON s20 et la photo s19).

**Ligne `REPLIT_ACTIONS.md`** (section « À DÉPLOYER ») :
> ### s26, remplacement de N vidéos YouTube à risque (supprimée, revendiquée ou copie tierce) par des chaînes officielles, COMMITÉ, NON DÉPLOYÉ : rien ne change en ligne
> - **Quoi** : nouvelle tâche de démarrage `applyVideoRemplacementsS26Task` (`src/lib/video-remplacements-s26.ts`), branchée après `applyVideoDurationsS20Task` : N fiches `Video` changent de `youtubeId`, titre, chaîne et durée sur place (même id : favoris et « Contenu du jour » gardés). Parcours Storytelling 1.4 et 2.4, Boulot 3.4 : nouveau bloc vidéo. 301 des anciens slugs dans `seo-redirects.data.cjs`. Seed aligné (sans effet en production).
> - **Garde-fou / retour arrière** : marqueur `DataPatch` `video-remplacements-s26:v1:<ancien id>`, SQL de retour arrière dans l'en-tête du fichier (garder les marqueurs).
> - **Env / migrations / packages** : aucun. Production : rien sans le go écrit de Thomas.

**Effet sur le site public** : rien avant le déploiement autorisé par Thomas. Au premier démarrage qui suit : les pages `/videos/[slug]` concernées affichent le nouveau lecteur (fin du lecteur cassé Domenge et du blocage Gad), les anciennes URL renvoient en 301 vers les nouvelles, la grille `/videos` et le sitemap prennent les nouveaux titres, et les fiches 1.4, 2.4 et 3.4 de l'espace montrent la nouvelle vidéo et son nouveau « why ».
