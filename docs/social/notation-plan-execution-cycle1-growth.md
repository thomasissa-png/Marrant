# Notation indépendante, cycle 1 : `plan-execution-s15.md` (angle pilotage, contenu et blog, @growth, 05/10/2026)
> Lu : plan d'exécution, `mesure.md`, `strategie-relance-v5.md`, `stock-vannes-resultat-s15.md`, calendrier Q4, `production-trimestrielle.md`, `founder-preferences.md`, plus `weekly-seo/route.ts`, `prepared-content.ts`, `wrangler.jsonc`, dossier `app/liens`. Choix fondateur du 05/10 (cadence 5/5/2, 9 modèles, seuils) non re-questionné.
| Grille | Note | Verdict en une ligne |
|---|---|---|
| G1 Pilotage | **7/10** | Dates, relevé, règles et charge existent, mais un jalon unique pour 3 réseaux et un trou de décision de 16 semaines |
| G2 Flux de contenu | **6/10** | Mathématique des vannes solide jusqu'au 03/01, 2027 suspendu à D3 sans plan si refusé |
| G3 Arbitrage qualité / volume | **7/10** | Barre relative juste et chiffrée, mais plan B tardif et vannes rejouées aux mêmes abonnés |
| G4 Lien social vers site | **7/10** | UTM et garde d'article solides, suivi `origine` non planifié en déploiement |
| **Total** | **27/40** | |
## G1 Pilotage (7/10)
**Preuves.** J+14 26/10, J+28 09/11, J+56 07/12 (§6) ; relevé du lundi par routine, `docs/social/releves/` (dossier absent, normal avant J0) ; règles v5 (2 mesures sur 3, pause si 3 sous l'échec aux 2 jalons) ; charge §5 chiffrée.
**Défauts.**
1. Jalons uniques alors que `mesure.md` §2 les compte par réseau : aucune table de glissement. J0 = 19/10 donne J+56 = 14/12, le jour du lancement du lot 3 (prêt 18/12) ; J0 = 26/10 donne 21/12, après le lancement. La promesse « verdict avant le lot 3 » tombe dès qu'un réseau glisse (C3 et liens de bio sont encore `[À VÉRIFIER]` ; `/liens` n'a qu'une route dans le code).
2. Contradiction de relevé : `mesure.md` §3 veut 10 min de statistiques natives chaque lundi ; le plan §5 n'en demande que 3 captures aux jalons. Entre jalons, aucun abonné ni impression (sert pourtant au contrôle J+14 « sous 10 % du seuil »). La médiane d'engagement par post ne se calcule pas avec 20 min de captures pour 3 réseaux.
3. Le gel de 14 jours borne l'effet du J+28 : le lot 2 (16/11 au 03/01) est inséré le 06/11, donc à la décision du 09/11 seules les dates à partir du 23/11 sont modifiables.
4. Après le 07/12, plus aucun jalon avant le bilan du 29/03 : les lots 4, 5, 6 partent (11/01, 08/02, 08/03) sans revue planifiée.
5. Routines `[À VÉRIFIER]` : si elles échouent, l'alerte « file basse » ne couvre pas le relevé Umami du lundi.
6. Charge sous-estimée : les lignes du §5 font 91 min, pas 1 h 45 ; manquent les 3 étalons conseils (D2, 10 min), les relevés natifs hebdomadaires, le bilan du 29/03.
**Correction.** Table des jalons par réseau avec formule J0+14/28/56 et règle « J+56 après le 11/12 : lot 3 en 3/3/1 par défaut, relancé au verdict » ; arbitrer natifs : soit 10 min le lundi (4 h au total, ajoutées au §5), soit abonnés seulement aux jalons et à J+7 ; ajouter J+84 (04/01) et J+112 (01/02) en fiche d'une demi-page ; routine de secours = e-mail du lundi du Worker.
## G2 Flux de contenu jusqu'au 28/03/2027 (6/10)
**Preuves.** Calcul d'épuisement juste : 41 vannes tiennent 5 semaines, 74 huit semaines (74 / 9,25), V1 de 45 = 37 + 8 (semaines 9 à 13), retours à 90 jours à partir du 11/01 (environ 9 par semaine) contre 8 de besoin si D3 est acceptée. Fiches Q1 12 sur 12 datées avec les lots. Mécanisme de publication vérifié : `publishDueScheduledArticles` tourne à chaque tick de 15 min et couvre lundi comme jeudi dans la semaine ISO.
**Défauts.**
1. 2027 est une recommandation (D3), pas un acquis : `calendrier-editorial-q1-2027.md` n'existe pas (échéance 02/11), 12 articles à 1 500 candidats de réparties. Si D3 est refusée ou si l'article glisse, 12 lundis et 13 jeudis sont vides : 11 emplacements par semaine contre 9 retours, 19 à 28 vannes manquantes, sans repli chiffré hors O4.
2. Zéro marge : notes de lignes du lot 1 livrées le 09/10 = date de « prêt » du lot ; notes du reste le 06/11 = « prêt » du lot 2 ; `--pool` n'existe pas encore et conditionne le lot 1.
3. T5 : 24 relais sur 28 prenaient une vanne faute de ligne notée ; le gain « 8 au lieu de 11 » de 2027 suppose des lignes notées pour chaque article Q1, rien ne l'impose au brief copywriter.
4. Le cycle mensuel du site (`production-trimestrielle.md` : 60 vannes neuves si stock < 60 jours) puise dans le même vivier que V1 et V2 (60 au total) : aucun arbitrage écrit entre vanne du jour du site et social. La v5 promettait 30 neuves par mois ; le plan passe à 60 au total sans le dire.
5. Les 5 fiches avec citation d'humoriste dépendent de sources à vérifier (repli sans citation prévu, bien).
**Correction.** Faire de D3 une décision à date (avant le 23/10), avec défaut explicite ; planifier le brief Q1 avec « 3 lignes notées par article » comme critère de livraison ; avancer les notes au 07/10 et au 30/10 ; fusionner V1/V2 avec le cycle mensuel du site (un seul pot) et le dire.
## G3 Arbitrage qualité / volume (7/10)
**Preuves.** Barre = niveau d'Alexa mesuré par les mêmes relecteurs (8,32 et 8,16), cohérente avec « rien en dessous » (30/09) ; options O1 à O4 chiffrées ; rendement 13 % posé en `[HYPOTHÈSE]` avec sa dérivation (19 % x 67 %) ; déclencheur O4 à 30/10.
**Défauts.**
1. Le plan sert surtout le partage de vannes. Pour les personas (Yanis apprend la répartie, Sophie veut du court et du travail, Marc de la profondeur) et pour la ligne du 06/05 (« conseils > vannes, produit qui s'apprend »), les 88 conseils validés et 21 conseils de parcours, sans coût de production, ne sont qu'un plan B tardif.
2. Les mêmes vannes reviennent aux mêmes abonnés à 90 jours (semaines 14 à 24), alors que la promesse est « jamais entendue » ; plus fort : les 41 meilleures sont rejouées en premier en janvier.
3. Biais de mesure : J+28 juge les 41 meilleures (semaines 1 à 5), J+56 les 33 suivantes ; un recul à J+56 serait lu comme un échec du réseau alors qu'il serait un effet du stock.
4. Déclencheur O4 « V1 < 40 retenues le 30/10 » : V1 est « livrée » le 23/10 à 45, donc ambigu (45 après filtre ou candidats ?) ; aucun déclencheur pour V2 ; les 3 étalons conseils ne sont pas calendés.
5. Les 14 vannes hors lot, déjà GARDER en base, sont comptées « aucune réserve » faute de note : une relecture à l'aveugle les rend utilisables (environ 9 attendues à 67 %).
**Correction.** Noter les 14 hors lot cette semaine ; faire valider les 3 étalons conseils avec D1 à D5 (10 min) pour que O4 soit activable en 24 h ; réserver 1 emplacement conseil par semaine dès le lot 3 si Thomas l'accepte (sinon rester sur O4) ; lire J+28 contre le stock utilisé (rapport de note moyenne des posts) ; définir « retenues » et un seuil V2.
## G4 Lien social vers site (7/10)
**Preuves.** UTM complets, listes blanches, référents `t.co` / `l.instagram.com` / `lnkd.in` en plancher, écart clics de bio contre visites ; garde lundi et jeudi qui remplace un relais si l'article n'est pas en 200 ; lundis Q4 programmés jusqu'au 28/12 et jeudis jusqu'au 03/12 (programmés en base d'après `founder-preferences.md`) ; publication bornée à la semaine ISO, repli prévu.
**Défauts.**
1. Le déploiement du 08/10 (§4.1) ne liste que le correctif X 270 et les routes `/liens`. Le suivi `origine` / `contenu` (v5 §2.3), le crochet e-mail avant Google (C2) et la bascule `callbackUrl` ne sont ni datés ni attribués ; aucun fichier d'attribution ou d'UTM n'apparaît dans `apps/web/src` (à confirmer par @fullstack). Sans eux, l'entonnoir par réseau est vide et le critère Marc (J+56) est illisible.
2. La garde (05:30 UTC) protège X 12:30 et LinkedIn 08:15, pas le relais Instagram de 19:30 : sa légende « lien en bio » pointerait un bloc quiz si l'article manque.
3. Q1 : sans D3, plus aucun lien de relais pendant 12 semaines (le social ne ferait plus que le quiz du mercredi) ; la visite UTM tombe sous le seuil sans que les posts soient en cause.
4. Hors garde : formule de renvoi « et comment trouver le tien » exige un passage méthode, vérifié à la main le 08/10 seulement pour 24 posts.
**Correction.** Ajouter au §4.1 le déploiement du suivi, du crochet C2 et de `/liens/x` / `/liens/li` avec test d'événement Umami avant le 11/10 ; étendre la garde au relais Instagram du lundi à 17:00 UTC ; relier le seuil de visites à « lundis avec article » dans la lecture J+28.
## Ce qu'il faut pour 10/10
1. Table de jalons par réseau (glissement, règle lot 3), arbitrage relevé natif hebdomadaire, jalons J+84 et J+112, secours de routine, charge Thomas recomptée.
2. D3 tranchée avant le 23/10 avec défaut ; brief Q1 avec 3 lignes notées par article ; notes avancées au 07/10 et au 30/10 ; pot de vannes unique avec le cycle mensuel du site.
3. 14 vannes hors lot notées ; étalons conseils validés avec D1 à D5 ; 1 emplacement conseil hebdomadaire dès le lot 3 ; V1 « retenues » défini, déclencheur V2 ; lecture J+28 corrigée du stock.
4. Suivi d'attribution, C2 et `/liens/x`, `/liens/li` datés et testés avant le 11/10 ; garde étendue à Instagram.
