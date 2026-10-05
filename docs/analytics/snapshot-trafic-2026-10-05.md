# Instantané trafic : 05/10/2026 (ouverture s15)

> Données brutes extraites le 05/10/2026 par la session principale via les API (Umami Cloud, Google Search Console via compte de service `search-console@deviens-marrant`, Bing Webmaster). Aucune donnée inventée. GSC : données jusqu'au 02/10 (délai Google de 3 jours).

## 1. Umami (deviens-marrant.fr)

| Période | Pages vues | Visiteurs | Visites | Rebonds | Taux de rebond | Temps moyen / visite |
|---|---|---|---|---|---|---|
| 7 j | 262 | 193 | 210 | 182 | 87 % | 41 s |
| 28 j | 956 | 607 | 713 | 631 | 88 % | 48 s |
| 90 j | 2 919 | 2 075 | 2 399 | 2 195 | 91 % | 33 s |
| 180 j | 5 096 | 3 773 | 4 224 | 3 853 | 91 % | 35 s |

- 28 j vs 28 j précédents : visiteurs 607 vs 638 (-5 %), pages vues 956 vs 896 (+7 %). Plateau ~20-30 visites/jour depuis août.
- **Canaux 28 j** : recherche organique 455, direct 145, LLM 5, referral 5, social organique 1. Sur 90 j : organique 1 597, direct 450, referral 14, social 13, LLM 9.
- **Référents 28 j** : google.com 401, bing.com 32, duckduckgo 10, ecosia 9, chatgpt.com 5 (+16 visites `utm_source=chatgpt.com`, 1 `utm_source=gemini`), checkout.stripe.com 2, betalist 1.
- **Appareils 28 j** : mobile 427, laptop 168, tablette 8, desktop 5. Pays : FR 422, US 30, CA 29, BE 26, CN 24, CH 18.
- **Pages d'entrée 28 j** : `/blog/meilleures-blagues-droles-2026` 364 (**51 % des visites**), `/blog/phrases-droles-conversations` 57, `/` 30, `/vannes` 29, `/blog/exercices-developper-humour` 20, reste < 10 chacune.
- **Pages vues 90 j** : article blagues 2026 = 1 463 / 2 919 (50 %). `/abonnement` 4 vues en 28 j, `/login` 4, `/profil` 2.
- **Événements reçus (180 j)** : `blog-scroll` 7, `blog-sortie-clic` 1. **Aucun événement d'inscription, d'onboarding, de checkout ni d'abonnement n'est codé** (événements présents dans le code : blog-scroll, blog-sortie-clic, blog-ancre-clic, blog-cta-clic, blog-vanne-partage, share_vanne). Le funnel visite → inscription → premium n'est pas mesurable dans Umami.
- Query strings 28 j : `?error=OAuthCallback` ×3 (échecs de connexion Google), `upgrade=cancel` ×2 (abandons checkout).
- Secret de session : `UMAMI_API_KEY` présent, `UMAMI_WEBSITE_ID` absent (résolu par nom de domaine, le compte Umami porte 8 sites).

## 2. Google Search Console (`sc-domain:deviens-marrant.fr`, accès siteFullUser)

| Période | Clics | Impressions | CTR | Position moy. |
|---|---|---|---|---|
| 04/09 → 02/10 | 442 | 10 520 | 4,2 % | 8,4 |
| 07/08 → 03/09 | 494 | 7 836 | 6,3 % | 10,5 |
| 04/07 → 02/10 (90 j) | 1 547 | 24 496 | 6,3 % | 8,9 |

**Hebdo (lundi)** : impressions ×2,3 en 3 mois, clics plats puis en baisse.
08/06 41/499 · 15/06 115/955 · 22/06 107/1 072 · 29/06 112/1 163 · 06/07 131/1 116 · 13/07 117/959 · 20/07 117/1 245 · 27/07 128/1 562 · 03/08 143/1 500 · 10/08 127/1 543 · 17/08 135/1 875 · 24/08 113/2 364 · 31/08 98/2 412 · 07/09 104/2 330 · 14/09 111/2 519 · 21/09 104/2 530 · 28/09 (partielle) 85/2 184 (clics/impressions).

**Top pages 28 j** : `meilleures-blagues-droles-2026` 343 clics / 2 193 imp (CTR 15,6 %, pos 5,5) = **78 % des clics** · `phrases-droles-conversations` 40 / 2 248 (1,8 %, pos 5,5) · `/vannes` 17 / 1 426 (1,2 %, pos 6,4) · `comment-avoir-de-la-repartie` 11 / 928 (1,2 %, pos 10) · `exercices-developper-humour` 11 / 205 (pos 19,5) · `autoderision-interactions` 5 / 963 (0,5 %, pos 9,2) · `comment-faire-rire-un-homme` 4 / 463 · `comment-faire-rire-une-fille` 2 / 364 · `5-types-humour-lequel-pour-toi` **0 / 856** (pos 8,3) · `/blog` 1 / 564 (pos 28) · `/` 0 / 83 (pos 11,4).

**Top requêtes 28 j** (toutes datées « 2026 » en tête) : blague à mourir de rire 2026 52 clics (pos 2,1) · blague 2026 43 (2,8) · blague humour noir 2026 33 / 631 imp (pos 8,5, CTR 5,2 %) · blague drole 2026 15 · blagues 2026 11 · blague 2026 drole 10 · meilleur blague 2026 10 · meilleures blagues 2026 9 · phrases droles 5 / 30 · phrase de répartie drôle 3 · vanne drole 2 · avoir de la répartie 1 / 26 (pos 11,3). Queue longue « anniversaire … humour » à 1 impression, positions 2-4.

**Opportunités 90 j (position 5-20, ≥ 20 impressions, quasi 0 clic)** :
humour observationnel → 5-types-humour 2 832 imp pos 7,4 **0 clic** · une vanne blague → /vannes 1 208 imp pos 5,7 0 clic · vanne blague 340 imp pos 6,5 0 · autodérision 255 imp pos 15,2 0 · comment faire rire quelqu'un 178 imp pos 14,4 · répartie 161 imp pos 10,1 0 · autodérision définition 145 pos 12,5 · phrase drole 142 pos 13,4 · quelle repartie 99 · avoir de la répartie 96 pos 14,6 · faire des vannes 85 pos 9,2 · ta repartie 77 pos 7,9 · bonne vanne 44 pos 6,7 · exemple de vanne blague 39 · type d'humour 37 pos 9,7.

**Mobile** 351 clics / 7 229 imp (pos 7,4) · Desktop 80 / 3 091 (pos 10,9). Pays : FR 340, CA 32, BE 16, CH 13, MA 5.

**Sitemap** : `sitemap.xml` soumis 30/09, lu 03/10, 0 erreur, 383 URL déclarées (live : 384 = 133 vannes, 110 conseils, 90 vidéos, 36 blog, 4 parcours, 11 autres). URL fantôme vue en impression : `/blog/jeux-de-mbras-technique-3-etapes` (404).

## 3. Bing Webmaster (site vérifié)

- Hebdo clics/impressions : 15/06 1/45 · 13/07 2/125 · 03/08 11/212 · 31/08 11/275 · 21/09 7/374 · 28/09 8/501. Impressions ×10 en 4 mois, clics marginaux.
- **Pages indexées : 63** (stable fin septembre) vs 384 dans le sitemap. Crawl 10-29 pages/jour, 0 erreur 5xx, 0 bloqué robots.
- **Liens entrants : 0** (GetLinkCounts vide, InLinks = 1).
- Requête n°1 en impressions : « unsitemarrant.fr » (navigationnelle vers un autre site, ~250 imp cumulées pos 4-5). Puis citation drole, comment etre drole, devenir drole, type d'humour.
- Pages : article blagues 2026 (pos 5-6), phrases-droles-conversations, citation-drole, a-propos.
- Quota de soumission d'URL : 100/jour, 2 700/mois (IndexNow / SubmitUrl disponibles).

## 4. Complément (05/10, pour l'audit noté s15)

**Funnel Umami (pages vues)** : 90 j : `/parcours` 27, `/parcours/machine-a-cafe` 13, `/parcours/repartie` 13, `/parcours/confiance` 9, `/abonnement` 8, `/quiz-humour` 8, `/login` 4, `/profil` 3, `/abonnement/success` 1. Sur **180 j : 0 vue de `/onboarding` et de `/register`** (script Umami chargé dans le layout racine, filtre limité à `/blog/apercu` : vérifié). Seulement **89 chemins distincts visités en 180 j** sur 384 URL du sitemap. `?upgrade=cancel` 2, `?upgrade=success` 1 (90 j).
**Article n°1, 28 j** : 383 visites, 352 rebonds (92 %), temps moyen 28 s. **Accueil, 28 j** : 41 visites, 37 rebonds.
**Pages de sortie 28 j** : article n°1 357, phrases-droles 53, `/vannes` 32, `/` 26.
**Paramètres 90 j** : `utm_source=chatgpt.com` 23, copilot 1, gemini 1, perplexity 1 ; `ref=betalist` 4 ; `fbclid` (Facebook/Instagram) 5.

**GSC 90 j par section** : blog 20 pages avec impressions (sur 36) → 1 495 clics / 20 551 imp ; `/vannes` (hub seul) 45 / 3 850 ; conseils 19 pages → 2 clics / 101 imp ; accueil 4 / 235 ; fiches vannes individuelles et vidéos ≈ 0.
**GSC 90 j par article** : blagues-2026 1 347 / 5 944 (pos 4,4) · phrases-droles 52 / 2 935 (7,6) · comment-avoir-de-la-repartie 25 / 2 369 (10,9) · exercices-developper-humour 23 / 499 (20,5) · autoderision 14 / 1 865 (11,0) · faire-rire-un-homme 12 / 1 085 (9,1) · faire-rire-une-fille 6 / 901 (9,4) · jeux-de-mots-technique 6 / 237 · 5-types-humour 4 / 3 190 (7,9) · les autres articles < 3 clics ; **16 articles sur 36 : aucune impression en 90 j**. `comment-devenir-drole` (article pilier) : impressions seulement sous `www.` (47 imp, pos 19,4), aucune sous l'URL canonique.
**Requêtes cœur (objectif « #1 sur devenir drôle / répartie »)** : comment devenir drôle 0 / 48 (pos 33,2) · comment être drôle 0 / 17 (pos 44,4) · comment être drôle dans une conversation 0 / 8 (pos 43) · avoir de la répartie 1 / 96 (pos 14,6) · comment avoir de la répartie 1 / 33 (pos 15,8) · exercices-developper-humour sur « comment devenir drôle » pos 54. **Requête de marque « deviens marrant » : 0 impression en 90 j.**
**Requêtes de l'accueil** : être marrant 0 / 16 (pos 17,5), blog marrant 0 / 6 (pos 41,8).

## 5. Données business et indexation (05/10, 21 h Paris, lues par la session : corrige « à fournir par Thomas » de `docs/marrant/audit-note-s15.md` §5)

- **Base (Neon, lecture seule)** : **13 comptes** (premier le 16/03/2026, dernier le 02/10) ; par mois : mars 4, avril 2, juin 2, août 1, septembre 3, octobre 1 ; 30 j : 4, 90 j : 5. Plans : 11 FREE, 2 PREMIUM. `Subscription` : 2 ACTIVE à 0,99 €/mois (ancien prix). Aucun e-mail de test repéré (filtre « test », « example »).
- **Stripe (mode live, lecture seule)** : 2 abonnements actifs à 0,99 €/mois, 1 `incomplete_expired` ; 6 clients ; 9 paiements réussis pour 8,91 € au total ; 0 remboursement. **MRR = 1,98 €.**
- **Inspection d'URL Search Console (API, 05/10)** : **le pilier `comment-devenir-drole` est « Explorée, actuellement non indexée »** (dernière exploration le 19/08/2026, canonique respectée, robots et récupération OK, **une seule page du site le cite** : `storytelling-drole-5-structures`). La version `www.` a le même statut. Explique les 0 impression sous l'URL canonique. Contrôle : `meilleures-blagues-droles-2026` est « Envoyée et indexée » (exploré le 04/10).
- **Buffer** : statistiques par post disponibles dans l'API (impressions, portée, likes, commentaires, partages, enregistrements, abonnements gagnés, clics) mais **clé actuelle sans la permission `insights:read`** ; aucun total d'abonnés par canal dans l'API.
