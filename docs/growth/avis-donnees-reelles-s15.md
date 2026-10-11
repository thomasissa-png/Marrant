# Avis growth sur les données réelles (s15, 05/10/2026)

Source unique des chiffres : `docs/analytics/snapshot-trafic-2026-10-05.md` (Umami, GSC, Bing). Les rares chiffres hors snapshot sont sourcés (décisions s14, inventaire des trous s14, préférences fondateur). Tout calcul dérivé ou seuil de succès non observé est marqué `[HYPOTHÈSE]`. Persona de référence : Yanis (20 ans, introverti, veut de la répartie).

## 1. Verdict en 3 lignes

1. L'objectif de 1 000 € MRR est très loin : 2 abonnés de lancement à 0,99 € (préférences fondateur, 01/10) pour 335 abonnés à 2,99 € nécessaires. À ~607 visiteurs/28 j et `[HYPOTHÈSE : 1 % visiteur vers payant]`, on obtient ~6 abonnés/mois, soit ~36 en 6 mois (~108 € MRR avant churn).
2. Le problème n'est pas le coût d'acquisition (CAC ≈ 0 €, canal 100 % organique) mais le volume et surtout la conversion : 713 visites en 28 j, 4 vues de `/abonnement`, 0 événement de conversion mesuré.
3. Maillon faible AARRR = Activation (visite vers inscription), aggravé par un angle mort de mesure ; le trafic est en plateau (607 visiteurs vs 638) et porté à 78 % des clics Google par un seul article.

## 2. Lecture du funnel réel

| Signal (snapshot) | Ce que ça signifie concrètement |
|---|---|
| 1 article = 51 % des visites (364/713) et 78 % des clics GSC (343/442) | Le reste du site (383 URL) produit 99 clics en 28 j. Le site est de fait une page, pas un catalogue. Une baisse de position sur cette page = -78 % de trafic Google. |
| Visiteurs venus pour "blague 2026", pas pour progresser | Intention : trouver une blague à ressortir, pas apprendre la répartie. Ce n'est pas l'audience de Yanis par défaut `[HYPOTHÈSE : audience majoritairement non-persona]`. Le pont vers le produit doit donc offrir de la valeur (technique, décryptage) avant toute offre. |
| Rebond 88 % (631/713), 1,34 page/visite, 48 s | 82 visites sur 713 vont plus loin. Chiffre peu fiable : seulement 7 événements `blog-scroll` en 180 j pour 5 096 pages vues, donc le suivi ne fonctionne probablement pas, et du trafic non humain existe `[HYPOTHÈSE : CN 24 visiteurs, bots]`. Ne pas piloter sur ce taux avant correction. |
| `/abonnement` 4 vues, `/login` 4, `/profil` 2 (28 j) | Moins de 1 % des visites touchent la monétisation ou le compte. Aucun levier de prix (2,99 €, annuel 24,99 €) ne peut s'évaluer à ce volume : il faut d'abord des visiteurs qui arrivent à la page. |
| `?error=OAuthCallback` ×3 pour 4 vues `/login` ; `upgrade=cancel` ×2 ; 2 retours de checkout.stripe.com | Le parcours est cassé aux deux extrémités : 3 échecs de connexion Google sur 4 vues de login (70 % des visiteurs sont sur mobile `[HYPOTHÈSE : navigateur intégré ou redirection]`) et 2 abandons au paiement sur 4 vues d'offre. Chaque échec est un Yanis perdu. |
| 0 événement inscription / onboarding / checkout / abonnement | Impossible de dire si 0, 5 ou 20 personnes se sont inscrites. Le funnel visite, inscription, premium est aveugle. `blog-cta-clic` existe dans le code mais n'a enregistré aucun événement en 180 j : CTA invisible ou suivi cassé. |
| Social organique : 1 visite (28 j), 13 (90 j) malgré 557 posts publiés (inventaire s14) | Un compte neuf sans audience ne génère pas de trafic même avec un volume élevé. La publication automatique est un coût ~0 mais n'est pas un canal d'acquisition à ce stade. |
| LLM : 5 visites (28 j), jusqu'à ~22 avec les UTM chatgpt.com/gemini ; 9 sur 90 j | Volume négligeable aujourd'hui, mais déjà présent et traçable via UTM. Signal de citation à entretenir, pas à scaler. |
| GSC : impressions +34 % (10 520 vs 7 836), clics -10,5 % (442 vs 494), CTR 6,3 % vers 4,2 %, position 10,5 vers 8,4 | On gagne en visibilité mais on perd en clics : les nouvelles impressions tombent sur des pages au CTR faible (`phrases-droles-conversations` 2 248 imp / 1,8 %, `5-types-humour` 856 imp / 0 clic, `/vannes` 1 426 imp / 1,2 %). Même position 5,5 que l'article n°1 (CTR 15,6 %) : l'écart vient du titre et de l'adéquation à la requête, pas du classement. |
| Bing : 63 pages indexées sur 384, 0 lien entrant | Indexation à 16 % : levier gratuit non exploité (quota 100 URL/jour, IndexNow réparé en s14). Aucun lien entrant : autorité nulle côté Bing. |

Comparaison avec l'audit s11 : bien vu la dépendance au SEO Google (T-P1-05) et les 0 backlinks. Mal calibré : les leviers prioritaires (CEO email, referral) supposaient une base de membres actifs que les données n'attestent pas (4 vues `/login` en 28 j). La vraie question est en amont : convertir le trafic existant. Les données manquantes de s11 (inscrits réels, MRR, followers) restent absentes du snapshot.

## 3. Risque calendaire : la bascule « 2026 » du 1er janvier 2027

- 8 des 12 requêtes en tête du top GSC contiennent « 2026 » (celles qui portent l'article n°1) (ex. "blague à mourir de rire 2026" 52 clics pos 2,1 ; "blague 2026" 43 ; "blague humour noir 2026" 33). Dès début janvier 2027, les internautes tapent « 2027 » : la demande se déplace vers une requête où l'on ne se classe pas `[HYPOTHÈSE : décroissance progressive des « 2026 » sur janvier-février]`.
- Contraintes fondateur (non re-questionnables) : ne jamais changer l'URL de `/blog/meilleures-blagues-droles-2026`, garder les années dans les titres, ne rien supprimer qui marche.
- **Recommandation (défaut proposé, GO Thomas requis pour la suite) :**
  1. D'ici le 01/12 : publier une page sœur `meilleures-blagues-droles-2027` (nouvelle URL, contenu 100 % catalogue validé ou relu à l'aveugle, titre/H1 avec 2027), indexée via GSC + IndexNow bien avant le 01/01.
  2. Sur la page 2026 : ajouter seulement un lien/bandeau d'ajout vers l'édition 2027 (addition, pas amputation). Aucun 301, aucun changement de slug/H2/FAQ.
  3. Mi-janvier : lire GSC (clics « 2026 » vs « 2027 »). Si les « 2026 » chutent de plus de 50 % `[HYPOTHÈSE : seuil]`, soumettre à Thomas un échange de l'année dans le title de la page 2026 (URL inchangée). Décision sur données, pas avant.
  4. Nouveaux articles à l'avenir : slug sans année, l'année seulement dans title/H1, pour pouvoir la mettre à jour sur la même URL.
- Question ouverte pour Thomas : l'article n°1 (78 % des clics) est-il passé à la relecture à l'aveugle (barre Alexa) ? C'est la page où un défaut coûte le plus.

## 4. Top 5 actions classées par valeur pour le persona

| # | Quoi | Pourquoi (snapshot) | Agent | Succès mesurable |
|---|---|---|---|---|
| 1 | Réparer la connexion Google (OAuthCallback) et auditer l'abandon checkout (mobile d'abord) | 3 `error=OAuthCallback` pour 4 vues `/login` ; 2 `upgrade=cancel` ; ~70 % de visiteurs sur mobile | @fullstack (+ @qa) | 0 `error=OAuthCallback` sur 14 j consécutifs ; événement `inscription-reussie` > 0 |
| 2 | Pont de valeur dans l'article n°1 : bloc contextuel après les blagues vers l'étape 1 gratuite du parcours / le décryptage d'une vanne (offrir, pas vendre) ; vérifier pourquoi `blog-cta-clic` = 0 | 364 entrées/28 j, rebond 88 %, 0 CTA enregistré | @copywriter (étalons s11), @ux, @fullstack | `blog-cta-clic` ≥ 3 % des entrées article `[HYPOTHÈSE : seuil]` ; `parcours-etape1-demarre` ≥ 10 sur 28 j (base : 0) |
| 3 | Bascule 2027 : page sœur + bandeau + indexation (section 3) | Requêtes en « 2026 » = cœur des 343 clics de l'article n°1 | @seo, @copywriter | Page 2027 indexée avant 15/12 ; clics sur requêtes « 2027 » > 0 en GSC en décembre, puis part du trafic article n°1+2027 stable en janvier |
| 4 | Réécrire title et meta (jamais URL, H2, FAQ, liens, chiffres) des pages à fort volume d'impressions et CTR faible, en reprenant le motif de l'article n°1 (promesse précise, requête exacte) | `phrases-droles-conversations` 2 248 imp 1,8 % ; `5-types-humour` 856 imp 0 clic (2 832 imp sur 90 j, pos 7,4) ; `/vannes` 1 426 imp 1,2 % ; `autoderision-interactions` 963 imp 0,5 % | @seo (+ @copywriter) | CTR GSC de ces 4 pages ≥ 4 % à J+28 `[HYPOTHÈSE : cible]` ; gain potentiel ~+100 clics/28 j si 3-5 % `[HYPOTHÈSE : calcul]`. Ces pages visent aussi l'intention de Yanis (répartie, humour, autodérision) |
| 5 | Indexation Bing de masse (384 URL via IndexNow, 4 jours au quota) puis 1res soumissions d'annuaires / premiers liens entrants (prép. @growth, soumission manuelle Thomas) | 63/384 pages indexées ; 0 lien entrant ; 1 seul referral betalist | @seo (IndexNow), @growth + @copywriter (prép. annuaires) | Bing pages indexées ≥ 200 à J+30 `[HYPOTHÈSE : seuil]` ; liens entrants Bing > 0 ; referrals Umami en hausse |

Après ces 5 : une page dédiée « humour noir » (631 imp, pos 8,5, 33 clics via l'article n°1) à proposer à Thomas pour le lot articles ; pas imposée, le calendrier du jeudi reste acté.

Économie unitaire : CAC ≈ 0 € (organique, coût agents seulement). LTV = ARPU 2,99 € / churn mensuel ; `[HYPOTHÈSE : churn 5-10 %/mois non sourcé, soit LTV de 30 à 60 €]`, à remplacer par les données Stripe dès 30 jours d'abonnés réels. Le ratio LTV:CAC n'est pas la contrainte : c'est le volume de visiteurs qualifiés et le taux d'activation. Audit Stripe (inventaire s14 #12 : 0 `WebhookEvent`) à lever avant toute lecture du MRR.

## 5. Instrumentation Umami prioritaire (événements nommés, kebab-case)

À poser côté serveur quand l'événement est transactionnel (résiste aux bloqueurs), sans donnée personnelle dans les propriétés.

| Étape | Événement | Propriétés |
|---|---|---|
| Engagement article | `blog-scroll` (vérifier : 7 en 180 j), `blog-cta-clic` | `slug`, `depth` (25/50/75/100), `position` |
| Activation contenu | `vanne-decryptage-ouvert`, `parcours-etape1-demarre`, `quiz-demarre`, `quiz-termine` | `slug` ou `parcours` |
| Inscription | `inscription-vue`, `inscription-reussie`, `inscription-erreur` | `methode` (google/email), `code` (ex. OAuthCallback), `source` |
| Connexion | `connexion-reussie`, `connexion-erreur` | `methode`, `code` |
| Onboarding / rétention | `onboarding-termine`, `exercice-termine`, `streak-3` | `parcours` |
| Monétisation | `premium-cta-vue`, `premium-cta-clic`, `checkout-demarre`, `checkout-abandonne` (équivaut `upgrade=cancel`), `abonnement-reussi`, `abonnement-resilie` | `source`, `plan` (mensuel/annuel) |
| Partage / social | `share_vanne` et `blog-vanne-partage` (unifier le nom), `lien-bio-clic` | `destination`, `canal` |

- Funnel Umami à créer : page d'entrée article n°1, `blog-cta-clic`, `inscription-vue`, `inscription-reussie`, `checkout-demarre`, `abonnement-reussi`.
- UTM systématiques sur tous les posts automatiques et sur `/liens` (sinon le social reste invisible dans Umami).
- Filtrer le trafic non humain (CN 24 visiteurs) dans les lectures de rebond `[HYPOTHÈSE]`. Agent : @data-analyst (spec), @fullstack (code).

## 6. À arrêter ou déprioriser

- **Referral (s11, levier 4) : différé.** Pas de base de membres actifs mesurée pour le multiplier. Reprendre quand le funnel est mesuré et que les premiers activés existent.
- **Attente de trafic social : arrêter d'en attendre en 2026.** Garder le test 8 semaines déjà acté (coût ~0, tout est automatisé), critère de sortie : si < 1 % des visites en provenance du social à la fin du test `[HYPOTHÈSE : seuil]`, réduire sans dépenser de temps humain. LinkedIn en pause confirmé.
- **Communiqués payants et tout canal payant : non, tant que 0 conversion mesurée.** Annuaires gratuits d'abord. Un canal payant doit prouver son ROI en 30 jours : impossible sans événements.
- **Production de pages supplémentaires comme levier de trafic** : 384 URL pour 99 clics hors article n°1. Le goulot est le CTR et la conversion, pas le nombre de pages. Le calendrier de lots déjà acté reste, mais sans extension.
- **Pilotage par impressions GSC et par le taux de rebond** : vanité tant que la mesure n'est pas corrigée. Piloter sur clics, CTR des pages cibles et événements d'activation.
- **Bing comme levier de croissance** (8 clics/semaine) : seulement l'indexation de masse (gratuite), pas de temps d'optimisation dédié ; ignorer la requête n°1 Bing (navigationnelle vers un autre site).
- **Tests de prix (2,99 € / annuel 24,99 €)** : pas de signal exploitable à 4 vues d'offre en 28 j.

## 7. Données encore manquantes (à fournir par la session principale)

Inscrits réels par semaine en base, nombre d'abonnés Premium actifs et MRR Stripe (webhook à vérifier), nombre de pages Google indexées (GSC, hors snapshot), followers réels par réseau.

---
**Handoff → @orchestrator (session principale)**
- Fichiers produits : `/home/user/Marrant/docs/growth/avis-donnees-reelles-s15.md`
- Décisions prises : pas de canal payant ni de referral avant mesure du funnel ; réparer connexion Google et instrumenter en premier ; pont de valeur (offrir, jamais pression) dans l'article n°1 ; page sœur 2027 sans toucher l'URL 2026.
- Points d'attention : actions 1 et 3 à planifier avant le 01/12 ; décision Thomas requise sur l'échange d'année dans le title 2026 (mi-janvier, sur données) ; rappel [CHOIX UTILISATEUR] : aucun slug, H2, FAQ, chiffre ou année supprimé.
