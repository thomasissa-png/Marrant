# Audit noté s15 (angle GEO) : attirer et convertir, deviens-marrant.fr, 05/10/2026

> Agent @geo. Chiffres : uniquement `docs/analytics/snapshot-trafic-2026-10-05.md` (« snap. » + section). Code : `apps/web/src/app/robots.ts`, `apps/web/src/components/seo/json-ld.tsx`, `apps/web/src/app/llms.txt/route.ts`. Je n'ai aucun accès à ChatGPT, Perplexity, Gemini, Copilot ni Claude : baseline de citations `[À MESURER]`. Barème : 10 = référence du marché pour un site de cette taille, 1 = absent. Respect des [CHOIX UTILISATEUR] : aucun chiffre ni humoriste retiré, « 1 500+ » intouché, aucune mention « IA » dans le contenu.

## 1. Tableau des notes

| Sujet | Note /10 | Attirer ou Convertir | Fait clé | Action n°1 |
|---|---|---|---|---|
| S1 Article « 50 blagues 2026 » | 6 | Attirer (convertit à 1/10) | 343 clics 28 j = 78 % des clics, CTR 15,6 %, pos 5,5 ; mais 92 % de rebond, 28 s, 357 sorties pour 383 visites (snap. §2, §4) | Ajouter un pont de sortie utile (quiz, parcours) sans toucher au slug |
| S2 Blog éditorial | 4 | Attirer | 16 articles sur 36 sans impression en 90 j ; `5-types-humour` 4 clics pour 3 190 imp (§4) | Bloc « Définition » de 40-60 mots en tête des articles à impressions sans clic |
| S3 Piliers requêtes cœur | 3 | Attirer | « comment devenir drôle » 0 clic / 48 imp, pos 33,2 ; « comment être drôle » pos 44,4 ; pilier visible seulement sous `www.` (§4) | Lever le doublon `www.` / URL canonique, puis refondre le pilier |
| S4 Catalogue (133 vannes, 110 conseils, 90 vidéos) | 3 | Attirer | Hub `/vannes` 45 clics / 3 850 imp ; 19 pages conseils = 2 clics / 101 imp ; fiches et vidéos ≈ 0 ; 89 chemins vus sur 384 (§4) | Concentrer l'effort sur les hubs et indexer une sélection de fiches |
| S5 SEO technique, indexation | 5 | Attirer | Google : sitemap lu, 0 erreur, 383 URL ; Bing : 63 pages indexées sur 384, 0 lien entrant, 1 URL fantôme 404 (§2, §3) | IndexNow + inspection d'URL Bing sur les ~50 pages à valeur |
| S6 Snippets et CTR (avis secondaire) | 4 | Attirer | CTR 6,3 % puis 4,2 % entre deux périodes alors que les impressions passent de 7 836 à 10 520 ; `5-types` 0 / 856 imp à pos 8,3 (§2) | Relire GSC 28 j après les 5 réécritures s15, ajuster |
| S7 Hors site | 2 | Attirer | 0 lien entrant Bing ; referral 14 et social 13 visites en 90 j ; « deviens marrant » : 0 impression en 90 j (§1, §3, §4) | 10 à 15 mentions tierces réelles (annuaires, ressources, forums) |
| S8 Visibilité dans les IA | 4 | Attirer | 26 visites `utm_source` en 90 j (chatgpt.com 23) soit ~1 % de 2 399 ; tous les bots de recherche autorisés (`robots.ts:35-47`) ; `sameAs` en dur (`json-ld.tsx:104-108`) | Exécuter le baseline (10 prompts) puis blocs de définition citables |
| S9 Blog vers produit | 2 | Convertir | 1 463 vues sur l'article n°1 en 90 j contre `/abonnement` 8 et `/quiz-humour` 8 ; `blog-cta-clic` codé, 0 reçu en 180 j (§1, §4) | CTA contextuel vers le quiz humour, mesuré |
| S10 Funnel inscription vers Premium | 2 | Convertir | 0 vue `/onboarding` et `/register` en 180 j, `/login` 4, `OAuthCallback` ×3, `upgrade=cancel` 2 pour 1 `success` (§1, §4) | Coder les événements du funnel et corriger l'erreur OAuth |
| S11 Mesure et pilotage | 4 | Convertir | Trois API branchées (Umami, GSC, Bing) mais aucun événement d'inscription ni de checkout ; llm non croisé par page (§1) | Événements funnel + vue Umami « canal llm / utm_source par page » |
| S12 Rétention et réactivation (avis secondaire) | 3 | Convertir | Aucune donnée de rétention dans le snapshot ; promesse de newsletter retirée le 01/10 ; carnet mensuel validé le 03/10 (`founder-preferences.md:39,43`) | Poser 3 indicateurs de cohorte avant d'ajouter des relances |

## 2. Notes globales

- **ATTIRER : 3,7 / 10.** Pondération : S3 20 %, S5 15 %, S7 15 %, S8 15 %, S2 10 %, S4 10 %, S6 10 %, S1 5 % (les requêtes cœur et l'autorité pèsent plus qu'une page unique déjà performante).
- **CONVERTIR : 2,5 / 10.** Pondération : S10 35 %, S9 30 %, S12 20 %, S11 15 % (le goulot est le passage visiteur vers inscrit, invisible aujourd'hui).
- Lecture : 51 % des visites arrivent par une page de blagues (public de passage) pendant que les pages qui servent le persona Yanis (répartie, devenir drôle) sont hors de la première page. Trafic et produit ne se rencontrent pas.

## 3. Plan par sujet (notes ≤ 5)

| Sujet | Actions précises | Agent | Métrique de succès | Délai |
|---|---|---|---|---|
| S2 (4) | 1) Bloc Définition 40-60 mots sans nouvelle URL sur les articles à impressions sans clic (`5-types`, `autoderision`, `repartie`) ; 2) liste des 16 articles muets : titre/maillage interne vers les piliers ; 3) humoristes déjà cités gardés et vérifiés (Frayssinet, Mirabel, Gardin dans la meta de `5-types`), ajout d'une citation réelle par article neuf | @copywriter (étalons Thomas d'abord), @seo | Clics GSC sur « humour observationnel » (0 / 2 832 imp en 90 j), nb d'articles avec impression (20/36 au départ, cible [HYPOTHÈSE : 28/36]) | 6 à 8 sem. |
| S3 (3) | 1) Vérifier que `www.` redirige en 301 vers l'apex et que le canonical du pilier est l'apex [HYPOTHÈSE : redirection absente, car des résultats web renvoient l'URL en `www.`] ; 2) pilier `comment-devenir-drole` : réponse directe en tête, liste d'exercices extractible, liens vers parcours ; 3) pilier répartie : définition glossaire reprise mot pour mot | @fullstack (301), @seo (canonical), @copywriter | Impressions « comment devenir drôle » sous l'URL canonique (0 au départ), position (33,2 au départ, cible [HYPOTHÈSE : < 15]) | 2 sem. (technique), 8 sem. (position) |
| S4 (3) | 1) Hubs d'abord : `/vannes` (1 208 imp « une vanne blague », 0 clic) reçoit un bloc « une vanne, c'est quoi » ; 2) soumettre à Bing hubs + 20 fiches échantillon, mesurer l'indexation avant d'en pousser plus ; 3) fiches vannes avec 1 phrase d'analyse unique (pas de gabarit répété) | @seo, @copywriter, @fullstack | Pages catalogue indexées Bing (63 au total aujourd'hui), clics hub `/vannes` (45 / 90 j) | 4 sem. |
| S5 (5) | 1) Lancer IndexNow sur ~50 pages (quota 100/jour) puis à chaque article du jeudi ; 2) inspection d'URL Bing sur 10 pages « crawlées non indexées » pour lire la cause ; 3) corriger l'URL fantôme `jeux-de-mbras-technique-3-etapes` (301 vers l'article réel) | @seo, @fullstack | Pages indexées Bing hebdo (63, cible [HYPOTHÈSE : ≥ 120 à 8 sem.]) | 1 j (soumission), 8 sem. |
| S6 (4) | 1) Relire GSC à 28 jours sur les 5 pages réécrites (CTR 0 % à 1,8 % au départ) ; 2) si CTR < 2 %, tester une formulation en question + réponse courte ; 3) ne jamais changer un slug qui se positionne | @seo | CTR GSC des 5 pages ; CTR global (4,2 %) | 4 sem. |
| S7 (2) | 1) Mettre à jour la fiche BetaList (4 visites `ref=betalist`) ; 2) 10 à 15 annuaires/ressources humour ou confiance en soi, avec texte descriptif unique ; 3) réponses utiles sur forums par compte de marque (jamais le fondateur) ; 4) relayer le baromètre « types d'humour » (voir §4) | @growth, @social | Liens entrants Bing (0), referral Umami (14 / 90 j), requête « deviens marrant » > 0 impression | 4 à 8 sem. |
| S8 (4) | 1) Thomas exécute les 10 prompts du baseline (`avis-donnees-reelles-s15.md` §5) sur 5 assistants ; 2) filtrer Umami `utm_source=chatgpt.com` par page d'entrée ; 3) section « Humoristes cités » avec citations vérifiées et noms balisés (`about`/`mentions` Person) : atout d'entités pour les assistants ; 4) llms.txt gelé | Thomas, @geo, @fullstack | Visites `utm_source` + canal llm (26 / 90 j), cité O/N par prompt (`[À MESURER]`) | Baseline sem. 1, relevé hebdo |
| S9 (2) | 1) Fin d'article n°1 : bloc « Quel humour est le tien ? » vers `/quiz-humour` (gratuit, valeur d'abord, sans hook de surveillance) ; 2) bloc 2 vannes originales du catalogue + lien parcours ; 3) vérifier pourquoi `blog-cta-clic` n'arrive pas | @ux, @copywriter, @fullstack | Clics `blog-cta-clic`, vues `/quiz-humour` (8 / 90 j), rebond article n°1 (92 %) | 2 sem. |
| S10 (2) | 1) Événements Umami : inscription démarrée / terminée, onboarding terminé, checkout ouvert, abonnement ; 2) diagnostiquer `?error=OAuthCallback` ; 3) comprendre le 0 vue `/onboarding` et `/register` [HYPOTHÈSE : suivi absent sur ces routes ou inscription par un autre chemin] | @fullstack, @data-analyst | Taux visite vers inscrit, checkout ouvert vers abonné (non mesurables aujourd'hui) | 1 sem. (code), 4 sem. (lecture) |
| S11 (4) | 1) Fixer `UMAMI_WEBSITE_ID` ; 2) tableau hebdo : canal llm, `utm_source` par page, pages indexées Bing, clics GSC sur 6 requêtes cœur ; 3) seuil de lecture : < 30 visites IA / mois = bruit | @data-analyst | Rapport du lundi complet, 0 chiffre `[À MESURER]` sur le funnel | 1 sem. |
| S12 (3) | 1) Indicateurs : visiteurs de retour (direct 145 / 28 j, [HYPOTHÈSE : partie = membres de retour]), streak à J7, ouverture e-mail du lundi ; 2) livrer le carnet mensuel validé avant toute relance ; 3) e-mail de réactivation à valeur (1 vanne + 1 exercice) | @growth, @data-analyst, @copywriter | Rétention J7 / J30 (`[À MESURER]`) | 4 sem. |

## 4. Les 3 actions qui font gagner le plus de points (par valeur)

1. **Pont blog vers produit + instrumentation du funnel (S9, S10, S11).** 351 des 713 visites de 28 j entrent par une page à 92 % de rebond, et on ne voit rien après. CTA utile (quiz, premier pas d'un parcours), événements Umami, lecture OAuth. Gain estimé : S9 2 vers 5, S10 2 vers 4, S11 4 vers 6, soit CONVERTIR 2,5 vers environ 4,5 [HYPOTHÈSE : estimation, pas une mesure].
2. **Indexation Bing + 10 à 15 mentions tierces réelles (S5, S7, S8).** Sans index ni lien, un assistant qui s'appuie sur Bing [HYPOTHÈSE : à reconfirmer dans la documentation éditeur] ne peut pas citer. Gain estimé : S7 2 vers 4, S5 5 vers 6, S8 4 vers 6, ATTIRER environ +0,8 pt.
3. **Piliers « devenir drôle » et « répartie » : canonical, réponse directe en tête, définitions glossaire reprises (S3, S2, S8).** C'est l'objectif de marque du `project-context.md`. Gain estimé : S3 3 vers 5, S2 4 vers 5, ATTIRER environ +0,7 pt.

## 5. Vérification web (moteur de recherche, PAS un assistant IA ; indicatif)

- « site pour apprendre à être drôle » : le site apparaît 4e, sous `www.`, avec un résumé exact (apprentissage structuré en 8 semaines, chiffre de la FAQ).
- « comment devenir drôle exercices répartie » : l'article `repartie-debutant-5-etapes` apparaît 2e. Ce résultat contraste avec GSC (pos 14,6 sur « avoir de la répartie ») : un moteur web ne remplace pas GSC, mais il confirme que le contenu peut se classer.
- Aucune de ces vérifications ne dit quoi que ce soit de ChatGPT, Perplexity, Gemini, Copilot ou Claude.

## 6. Limites

- Aucun pourcentage d'étude externe cité. Hypothèse Bing/ChatGPT/Copilot non reconfirmée.
- Rétention (S12) : aucune donnée, note provisoire. Indexation Google des 384 URL : non présente dans le snapshot.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/geo/audit-note-s15.md`.
- Décisions : priorité 1 pont + funnel, 2 Bing + mentions, 3 piliers. llms.txt gelé.
- Points d'attention : ne rien changer aux slugs, H2, FAQ, chiffres, prix, humoristes cités ; baseline `[À MESURER]` tant que Thomas n'a pas exécuté les 10 prompts ; relevé hebdomadaire.
