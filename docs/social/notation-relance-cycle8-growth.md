# Notation cycle 8, angle acquisition (@growth, s15, 07/10/2026 au soir, état RÉEL du code et des documents)

> Notateur indépendant, mêmes critères et même échelle que le cycle 7 (K1 angle acquisition, K6 trafic et conversion, K8 mesure). Relus (lignes citées) : `notation-relance-cycle7-growth.md`, `mesure.md` en entier, `releves/2026-10-06.md` et `2026-10-07.md`, `mix-formats-s15.md`, `plan-execution-s15.md` (:1-60), `preparation/recoupements-07-10.md`, `resultat-hors-lot-07-10.md`, `REPLIT_ACTIONS.md` (:1-230), `founder-preferences.md` (:40-75), `strategie-relance-v5.md` (:28-67), `apps/web/src/lib/umami.ts` (:1-70). `[non relu]` : `viral-quiz.tsx`, `article-cta.tsx`, `config/blog-cta.ts`, `attribution.test.tsx`, `etalons-formats-sociaux-s15.md` (la preuve de ces points est celle de `REPLIT_ACTIONS.md`). **Production NON reproduite ici** : cette session n'a ni Bash ni curl. La preuve prod est celle des sessions de déploiement. **[CHOIX UTILISATEUR] non rejoués** : barre Alexa intacte, cadence 5/5/2 par le mix, pas de compte gratuit, aucun réseau en pause, clé Buffer `insights:read` « plus tard », pas de 3/3/1 sans accord (`founder-preferences.md`:59, :61-62, :65).

## Notes

| Critère | Cycle 7 | Cycle 8 | Raison courte |
|---|---|---|---|
| K1 Angle acquisition | 9 | **9,5** | K1-a soldé (base payante requalifiée) ; restent 3 phrases périmées de v5, le stock de vannes non aligné sur le recompte du 07/10, bios Instagram et LinkedIn non posées |
| K6 Trafic et conversion | 8 | **9** | `origine` sur `abonnement-*` et fin du compte gratuit en ligne depuis le 06/10, paiement réel prouvé le 07/10 ; restent 2 bios sur 3, la requête SQL des articles, la règle Google |
| K8 Mesure | 8,5 | **8,5** | clé Buffer et K1-a alignés ; `mesure.md` en retard sur le code livré le 06/10 (il dit « non codée », « À DÉPLOYER ») et ignore la panne Stripe du 30/09 au 07/10 ; preuve D8 toujours absente |

**Moyenne cycle 8 : 9,0** (cycle 7 : 8,5).

## Vérification de la liste « Pour 10/10 » du cycle 7

| Réf. | Verdict | Preuve |
|---|---|---|
| K6-a bios | **Partiel (X seul), non consigné** | X : « Lien de profil (`/liens/x`) et bio : déjà posés par Thomas » (`REPLIT_ACTIONS.md`:122). LinkedIn : site web `/liens/li` à poser par Thomas, jeton expiré (:123). Instagram : impossible par API, à faire dans l'application (:124). Le registre `mesure.md`:114-116 reste `[à renseigner]` pour les 3 (date de pose et visite Umami), X compris. Aucune visite `/liens/x` vue dans Umami consignée |
| K6-b `abonnement-*` attribués | **Fait, déployé** | `umami.ts`:28-32 (`abonnement-clic`, `abonnement-reussi`, `abonnement-annule` dans `ATTRIBUTED_EVENTS`) ; `REPLIT_ACTIONS.md`:171-173 (Worker `fd1a595d`, 06/10 07:45) et :186 (`origine`/`contenu` + `declencheur`). Test `attribution.test.tsx` `[non relu]` |
| K6-c promesse « compte gratuit » | **Fait en prod sur 7 pages, reste 1 contrôle** | `REPLIT_ACTIONS.md`:175 (« compte gratuit » : 0 occurrence sur 7 pages dont `/quiz-humour`, `/register` = « Étape 1 sur 2 ») ; :185 (12 CTA de `blog-cta.ts` déclinés, CGU : seule la phrase retirée) ; fonction visiteur inchangée (:182, `founder-preferences.md`:63). **Reste** : requête SQL sur `BlogArticle.content` non faite (:177), or les articles de Marc sont en base (22/10, 29/10, 05/11) |
| K6-d règle Google par application | **Non fait** | aucune règle au `mesure.md` §3 (:39-53) ; `config/in-app-browser.ts` inchangé `[non relu]` |
| K8-a registre, test appareil, D8 | **Partiel** | en-tête §6 aligné (`mesure.md`:100, renonciation Thomas) ; **preuve D8 toujours `[à renseigner]`** (:102-104) ; échéance 11/10 (:106) : sans elle le J0 du 12/10 glisse |
| K8-b clé Buffer, lien provisoire | **Fait** | `mesure.md`:5, :44 (« plus tard », sans échéance), :20 (lien provisoire retiré) ; `founder-preferences.md`:61 |
| K8-c `abonnement-*` dans l'entonnoir | **Fait puis périmé par le code** | entonnoir `mesure.md`:50 en place. Mais :22 et :50 disent `abonnement-*` SANS `origine`, :93-94 « une fois la correction livrée », alors que `umami.ts`:30-32 la porte depuis le 06/10 07:45. :85 et :94 gardent `[À VÉRIFIER dans le code]` : réponse connue (`abonnement`, `etape-1`, `REPLIT_ACTIONS.md`:186) |
| K8-d ruptures de série, baseline 2 | **Non fait, et contredit** | `mesure.md`:123-124 `[à renseigner]`, :108 « commit du 06/10, À DÉPLOYER », :123 « non codée ». `REPLIT_ACTIONS.md`:176 affirme la rupture « datée du 06/10 07:45 (`mesure.md` §6) » : **le fichier ne porte pas cette date** (P0 s11, rapport non conforme au fichier). Baseline 2 : dimanche 11/10, futur |
| K1-a base payante | **Fait** | `mesure.md`:91-93 (CAC par abonné non calculé, LTV avec churn inconnu, base non établie, borne 0,26), :167 (majorant) |
| K1-b 4 phrases périmées de v5 | **1 sur 4 corrigée** | corrigée : `dynamicParams = true` + `notFound()` (`strategie-relance-v5.md`:62). Restent : :34 (C2 « ET test dans l'application DU réseau »), :59 (lien de bio provisoire « déploiement du 10/10 »), :67 point 6 (tests mobile dans l'application de chaque réseau, Thomas y a renoncé, `founder-preferences.md`:57). Aussi :64 (cinq événements, sans `blog-cta-clic` ni `abonnement-*`) |
| K1-c = K6-a | **Partiel** | voir K6-a |

**Fait nouveau depuis le cycle 7** : 5 posts sur 5 publiés à l'heure, liens réels, 0 FAILED (`releves/2026-10-06.md`:5-11, `2026-10-07.md`:5-19). Le post X du quiz (07/10 12:33) porte le lien `/quiz-humour` et `utm_content=quiz` (`2026-10-07.md`:7), conforme à `mesure.md`:14 ; le correctif `longueurX` est prouvé en ligne (313 caractères bruts acceptés, :8). Le seul trafic social suivi possible aujourd'hui est donc X (bio et 1 post avec lien) : Instagram n'a que la bio non posée (légendes sans lien, :15), LinkedIn n'a aucun lien (semaine 0 `cta: null`, `mesure.md`:20).

## K1 Angle acquisition : 9,5

Acquis : angle recalculé sur le parcours abonné (K1-a), économie du social chiffrée (0 € cash, 41 min par semaine, `mesure.md`:90), mix 5/5/2 sans toucher à la barre (`mix-formats-s15.md`:3, `founder-preferences.md`:65). **Défauts restants**
1. **Stock de vannes non aligné sur le recompte du 07/10.** `recoupements-07-10.md`:32-42 : 23 libres au 12/10, 25 avec P0, 21 hors carrousels fixes ; `resultat-hors-lot-07-10.md`:11 : 0 sur 14 au niveau. Or `mix-formats-s15.md`:9 donne « 32 au 12/10 », :11 « +5 hors lot `[HYPOTHÈSE]` » (infirmée), :12 « plancher 10 », :14 « manque 2 » ; `plan-execution-s15.md`:45 et :50 comptent encore « environ 5 hors lot ». Arithmétique des documents seule : 10 moins 7 (3 exemptées et 4 de Noël retirées) moins 5 (hors lot à 0) laisse un plancher au 03/11 nul ou négatif `[À RECOMPTER par --pool, non calculé ici]`. Aucune décision de cadence n'en découle (repli du mix, `mix-formats-s15.md`:23), mais l'angle chiffre un stock qui n'existe plus.
2. **Étalons déjà signés présentés comme à valider.** `founder-preferences.md`:67 : conseils E4, E7, E2, quiz seul, relais LinkedIn visio 03/11 et soirée de Noël 17/11, carrousels Nicolas/Julien et parking, **règle R9 acceptée** (06/10). `mix-formats-s15.md`:26 écrit R9 « proposée, sans veto sous 48 h » et :31-35, :61 listent encore ces étalons « à faire valider par Thomas (chemin critique, 08/10) ». Risque : redemander à Thomas un [CHOIX UTILISATEUR] déjà rendu. `[À VÉRIFIER dans etalons-formats-sociaux-s15.md : les « étalons de cartes » (conversion en 270 signes ou 2 cartes) sont-ils couverts par le choix du 06/10 ?]`
3. **3 phrases périmées de v5** (`strategie-relance-v5.md`:34, :59, :67) + :64.
4. **Premier levier incomplet** : 2 bios sur 3 non pointées (K6-a).
5. **LTV sur le seul mensuel** : `mesure.md`:92 calcule à 2,99 € ; la formule annuelle 24,99 € (2,08 €/mois, `founder-preferences.md`:47) n'entre pas dans l'ARPU `[HYPOTHÈSE : mix mensuel/annuel inconnu]`. Sans conséquence avant 30 jours de données, à écrire.

## K6 Trafic et conversion : 9

Chaîne livrée et en ligne : `/liens` 3 routes (cycle 7), fin du compte gratuit et tunnel « Étape 1 sur 2 » avec ouverture de Stripe sans clic (`REPLIT_ACTIONS.md`:184), `origine` jusqu'au paiement (`umami.ts`:30-32), visiteur inchangé (:182). **Fait majeur du 07/10** : aucun appel Stripe n'aboutissait sous Workers depuis la bascule du 30/09 (0 client, 0 session), corrigé par `httpClient: Stripe.createFetchHttpClient()` (`712ee919`) ; achat réel de Thomas, 3DS, e-mail de confirmation, remboursement, compte repassé FREE, « D1 validé » (`REPLIT_ACTIONS.md`:66). Le bout de l'entonnoir fonctionne désormais. s17 reste non déployé (:3-13, migration 13 d'abord), sans effet sur l'acquisition sociale avant sa mise en ligne. **Défauts restants**
- **K6-a** : bios Instagram et LinkedIn non posées ; registre non rempli, X compris.
- **K6-c (reste)** : contenu des articles en base non contrôlé (`REPLIT_ACTIONS.md`:177) : les relais pointent vers `se-presenter-avec-humour` (12/10) puis les articles Marc.
- **K6-d** : Google par application toujours `[HYPOTHÈSE]`, sans règle de correction à la mesure.

## K8 Mesure : 8,5

Cadre solide (deux modes de relevé, baseline 2, limite de puissance, base payante requalifiée). **Défauts restants**
1. **`mesure.md` en retard sur le code du 06/10** : :22, :50, :93-94 (`abonnement-*` sans `origine`), :108 « À DÉPLOYER », :123 « non codée ». Le lecteur du lundi ignorerait `origine` sur les 3 événements qui comptent.
2. **Rupture non datée alors que `REPLIT_ACTIONS.md`:176 dit l'inverse** : la date 06/10 07:45 (Worker `fd1a595d`) n'est écrite ni en :123 ni en :124.
3. **Panne de paiement absente de la mesure** : du 30/09 au 07/10 ~15:15, aucun paiement ne pouvait aboutir (`REPLIT_ACTIONS.md`:66). Toute `abonnement-clic` de la semaine 0 est sans issue possible, et la base payante des 90 jours (`mesure.md`:93) compte 7 jours de checkout cassé. Autres changements du tunnel le 07/10 : s16 déployé 14:31 (`submit_type: "subscribe"`, case CGU, :60-62), correctif 15:15. Aucune ligne au registre des ruptures (§6).
4. **Preuve D8 absente** (:102-104), échéance 11/10 (:106) : le J0 du 12/10 en dépend.
5. **Relevés du 06 et 07/10 non branchés** : la ligne semaine 0 de `mesure.md`:136-138 est vide ; les postes « prévus/publiés » (X 2, Instagram 2, LinkedIn 1 à ce soir) et « avec/sans lien » existent dans `releves/` (X 06/10 sans lien, X 07/10 avec lien). Rien ne les relie à §6.
6. **Baseline 2** : 11/10, non produisible avant.

## Correction exacte restante (toute note < 10)

**K6 vers 10**
- **K6-a** (Thomas, 2 x 1 min : Instagram dans l'application ; LinkedIn page, site web, ou nouveau jeton `LINKEDIN_ACCESS_TOKEN` pour que la session le pose) : Instagram `https://deviens-marrant.fr/liens`, LinkedIn `https://deviens-marrant.fr/liens/li` ; X déjà posé. Date de pose des 3 dans `mesure.md`:114-116 et `REPLIT_ACTIONS.md` ; preuve : 1 visite `/liens/x`, `/liens` et `/liens/li` vue dans Umami (la ligne X peut se remplir dès aujourd'hui, la date de pose de Thomas est à lui demander une fois, jamais présumée).
- **K6-c** (@fullstack ou @data-analyst) : requête SQL en lecture sur `BlogArticle.content` et `title` pour « compte gratuit », « gratuitement », « Crée ton compte » ; 0 attendu sur les articles relayés (12/10, 19/10, 22/10, 26/10, 29/10, 05/11, 09/11). Sinon correction par étalon Thomas, diff mesuré (P0 s8, P0 s11), sans toucher slugs, H2, FAQ, liens, chiffres.
- **K6-d** (`mesure.md` §3) : au relevé du lundi, par `origine`, `inscription-envoi methode=google` ≥ 5 avec 0 `inscription-reussie methode=google` : passer la ligne de l'application à `true` dans `config/in-app-browser.ts`.

**K8 vers 10** (@growth + @data-analyst, 1 passe, `mesure.md` seul)
- **K8-a** : preuve D8 : 1 événement Umami de test par `origine` (x, instagram, linkedin), date et heure consignées en :102-104, exclus des relevés et soustraits de la baseline 2 ; avant le 11/10, sinon J0 au 19/10.
- **K8-c** : :22 et :50 « `abonnement-clic|reussi|annule` portent `origine`/`contenu` depuis le 06/10 07:45 » ; :93-94 retirer « une fois livrée » ; :85 et :94 remplacer `[À VÉRIFIER dans le code]` par « bouton `abonnement` (étape `etape-1`) depuis le 06/10 07:45 ».
- **K8-d** : §6 : :123 date 06/10 07:45, Worker `fd1a595d`, « déployé » (supprimer « non codée ») ; :124 même date ; :108 retirer « À DÉPLOYER ». Ajouter 2 lignes de rupture : « 30/09 au 07/10 ~15:15 : checkout Stripe inopérant, corrigé `712ee919` ; toute `abonnement-clic` antérieure est sans issue » et « 07/10 14:31 : s16 (Checkout `subscribe`, case CGU) ». Ligne de la base payante (:93) : « 7 jours de checkout cassé dans les 90 jours ».
- **K8-e** : §6 : reporter les relevés de `releves/*.md` dans la ligne semaine 0 (posts prévus/publiés, avec/sans lien, Remarque « échauffement »), et citer `releves/` comme source de la colonne ; semaine 0 complète après le 09/10.
- **K8-f** : baseline 2 du 11/10 (captures datées, comptes créés, abonnements actifs et créés, MRR Stripe, impressions Google), seule pièce que le calendrier interdit avant cette date.

**K1 vers 10**
- **K1-a'** : aligner sur `recoupements-07-10.md` et `resultat-hors-lot-07-10.md` : `mix-formats-s15.md`:9 (25 au 12/10), :11 (hors lot : 0 mesuré), :12 et :14 (plancher et manque recalculés par `--pool`, marqués `[À RECOMPTER]` tant que non exécutés) ; `plan-execution-s15.md`:45 et :50 (retirer « environ 5 hors lot »). Aucun seuil, aucune cadence, aucune barre modifiés.
- **K1-b** : `strategie-relance-v5.md`:34 (C2 sans test dans l'application du réseau), :59 (supprimer le lien provisoire), :67 point 6 (test de session + preuve D8), :64 (ajouter `blog-cta-clic`, `abonnement-*`).
- **K1-b'** : `mix-formats-s15.md`:26, :31-35, :61 : renvoyer au choix signé du 06/10 (`founder-preferences.md`:67) pour R9 et les étalons déjà validés ; ne lister « à valider » que ce que `etalons-formats-sociaux-s15.md` ne couvre pas. Aucune question à Thomas sur un point signé.
- **K1-c** = K6-a.
- **K1-d** : `mesure.md`:92 : ajouter la formule annuelle (24,99 € / 12 = 2,08 €/mois) à l'ARPU, `[HYPOTHÈSE : mix inconnu]`, recalcul à 30 jours.

**Points restants : 12** (K1 : a', b, b', d = 4 ; K6 : a, c, d = 3 ; K8 : a, c, d, e = 4 ; K8-f baseline 2 du 11/10 = 1, calendaire ; K1-c compté dans K6-a). Je renote 10 quand ils sont livrés et prouvés (`git show <branche déployée>:fichier` pour chaque ligne, événement Umami de test par `origine`, requête SQL jointe) ; la baseline 2 du 11/10 est la seule pièce que le calendrier ne permet pas de produire avant cette date.

Contrôle prod à lancer hors de cette session : `for u in /liens /liens/x /liens/li /liens/ig /register /quiz-humour; do curl -s -o /dev/null -w "$u %{http_code}\n" https://deviens-marrant.fr$u; done` (attendu 200, 200, 200, 404, 200, 200) ; `curl -s https://deviens-marrant.fr/quiz-humour | grep -ci "compte gratuit"` (attendu 0).

---
**Handoff → @orchestrator** (puis Thomas K6-a, @fullstack ou @data-analyst K6-c, @data-analyst K8-a à K8-f, @growth K1-a' à K1-d, @social K1-b)
- Fichier produit : `/home/user/Marrant/docs/social/notation-relance-cycle8-growth.md`
- Décisions : K1 9,5, K6 9, K8 8,5, moyenne 9,0 ; aucun seuil, aucune cadence, aucune barre rouverts ; aucun réseau en pause
- Points d'attention : 2 bios sur 3 non pointées ; `mesure.md` périmé sur le code du 06/10 et rapport `REPLIT_ACTIONS.md`:176 non conforme au fichier ; panne Stripe du 30/09 au 07/10 absente de la mesure ; stock de vannes de `mix-formats-s15.md` non aligné sur le recompte du 07/10 ; preuve D8 due le 11/10 ; prod non reproduite par cette session
