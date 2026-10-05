# Notation cycle 1, angle acquisition (@growth, s15, 05/10/2026)

> Notateur indépendant. Sources lues : `plan-relance-s15.md`, `audit-note-s15.md` (§6 et §8), `mesure.md`, `donnees-audit-s15.md`, `docs/qa/tunnel-inscription-s15.md`, `apps/web/src/app/liens/page.tsx`, `apps/web/src/lib/auth-links.ts`, `prepare-social-month.ts`, `founder-preferences.md` (ligne du 05/10). Correction de mon avis précédent : le tunnel est instrumenté depuis le Worker `fa296917` (événements `inscription-envoi`, `inscription-reussie`, `abonnement-clic`, `quiz-termine`, `parcours-etape`, liens `/register?src=…`). Le choix du 05/10 (relance des 3 réseaux, contenu préparé par lot, compte = marque) n'est pas re-questionné. Barème : 10 = prêt à lancer sans angle mort.

## Tableau

| Critère | Note | Preuve | Correction précise |
|---|---|---|---|
| K1 Stratégie 3 réseaux | **5** | Rôles et personas écrits (`audit-note-s15.md:59-65`), mais aucune étape de funnel ni destination par réseau. Instagram « partage et enregistrement » n'a aucun lien cliquable (légendes), donc zéro chemin vers le site sauf la bio. 6 des 9 étalons (X1, X3, IG1, IG3, L1, L2) n'ont aucun appel à l'action ni lien. Cadence passée de 9 à 12 posts par semaine (5 X, 5 IG, 2 LinkedIn) sur 3 audiences à zéro mesuré, alors que mon avis posait « tunnel avant volume ». La condition tunnel est remplie côté code, mais le test Google mobile (5 min Thomas, `tunnel-inscription-s15.md:44`) n'est pas fait. Marc sans réseau prouvé. | (1) Ajouter au §6 une colonne « étape AARRR, destination, métrique » : Instagram = notoriété et partage (destination `/liens` puis quiz), X = test de ce qui circule et seul lien direct (relais article 2 fois par semaine, lien quiz 1 fois par semaine), LinkedIn = trafic qualifié Sophie et Marc (lien en premier commentaire, destination article ou quiz). (2) Cadence : garder 5/5/2 car la production est automatisée, mais conditionner le point 12 posts par semaine à un test Google mobile réussi, et plafonner le temps humain à 30 min par semaine (relevé) plus 15 min par jour de réponses, sinon le protocole « 100 % sous 24 h » n'est pas tenable. (3) Une hypothèse Marc écrite : LinkedIn et Instagram, relevé séparé à J+28. |
| K6 Trafic et conversion | **4** | `/liens` : UTM figés `utm_source=instagram&utm_campaign=bio` (`page.tsx:24`), donc inutilisable pour X ou LinkedIn, aucun `utm_content` ; le quiz `/quiz-humour` existe mais n'est pas dans la page ; premier bouton = `/parcours/repartie` (étape qui demande un compte) alors que mon avis recommandait le quiz sans compte. Attribution : `src` (`auth-links.ts:17-35`) désigne le point d'entrée du site (`header`, `blog-<slug>`, `quiz`), jamais le réseau d'origine ; l'UTM n'est lu par Umami que sur la page d'arrivée, rien ne le conserve jusqu'à `inscription-reussie`. Résultat : une inscription venue d'Instagram est indiscernable d'une venue de Google. `mesure.md` §1 ignore LinkedIn (`utm_source` x et instagram seulement), L3 poste le lien en commentaire sans UTM défini. Navigateur intégré d'Instagram : Google OAuth y échoue (`tunnel-inscription-s15.md:42`), c'est le chemin principal de Yanis. | (1) `/liens` : source dynamique (`/liens?s=x`, `?s=ig`, `?s=li` ou paramètres `utm_*` relus), `utm_content` par bloc, bouton 1 = quiz « profil humour » (valeur sans compte), bouton 2 = article du jour, puis parcours Répartie, vannes, conseils. (2) Persister l'UTM à l'arrivée (sessionStorage) et l'envoyer comme propriété `origine` sur `inscription-envoi` et `inscription-reussie` (sans toucher à `src`, qui reste le point d'entrée). (3) `mesure.md` §1 : `utm_source=linkedin`, règle « lien en commentaire = même UTM », LinkedIn dans le plan. (4) CTA : une carte sur trois et un tweet sur deux avec CTA explicite (quiz, article), jamais vers `/abonnement`. (5) Si le référent est Instagram, `/register` met le formulaire email avant le bouton Google. (6) Test mobile Safari et Chrome avant le premier post Instagram. |
| K8 Mesure | **4** | `mesure.md` est encore le cadre du 01/10 : « LinkedIn en pause », « test de 8 semaines », pas de colonne LinkedIn (§4), lignes du 05/10 vides, baseline d'abonnés absente (0 abonné au 24/03, rien depuis). Critère de sortie « sous la médiane deux mois de suite » (§5) impossible à tenir et sans seuil absolu. Mes seuils à 8 semaines ne sont pas repris dans le plan. Le §3 dit « si l'événement d'inscription est visible » : il l'est maintenant, il faut le nommer. Aucun J+28 ni J+56 chiffré. | Appliquer les sections ci-dessous : baseline, relevé, seuils, tableau de bord. |

## Baseline et relevé (à écrire dans `mesure.md`)

- **Baseline** : Thomas relève avant le premier post (cible dimanche 11/10, J0 = lundi 12/10) abonnés X, Instagram, abonnés de la page LinkedIn, avec date et capture. Ajouter impressions Google de « deviens marrant » (0 sur 90 jours) et visites `utm_source` des 28 derniers jours (0). Sans ces 5 chiffres, rien n'est jugeable.
- **Relevé hebdo** (lundi, 30 min) : par réseau, abonnés nets, posts prévus / réellement publiés (statut Buffer relu), couverture ou impressions, partages + enregistrements (Instagram), réactions et commentaires (LinkedIn), visites Umami par `utm_source`, `inscription-reussie` par `origine`, taux de réponse sous 24 h.

## Seuils (tous `[HYPOTHÈSE : à valider par Thomas, aucun benchmark interne]`), cumul depuis J0

| Mesure | J+28 (09/11) succès / échec | J+56 (07/12) succès / échec |
|---|---|---|
| Visites `utm_source` x + instagram + linkedin (Umami) | ≥ 50 / < 10 | ≥ 130 / < 30 |
| Abonnés Instagram gagnés | ≥ +120 / < +30 | ≥ +300 / < +80 |
| Abonnés X gagnés | ≥ +40 / < +10 | ≥ +100 / < +30 |
| Abonnés page LinkedIn gagnés | ≥ +30 / < +10 | ≥ +80 / < +25 |
| Instagram, partages + enregistrements / couverture (médiane) | ≥ 2 % / < 0,5 % | ≥ 2 % / < 0,5 % |
| Quiz terminé depuis un lien social (`quiz-termine`, `origine`) | ≥ 10 / 0 | ≥ 30 / < 5 |
| Inscriptions attribuées (`inscription-reussie`, `origine` réseau) | ≥ 1 / 0 | ≥ 3 / 0 |
| Fiabilité : posts remis relus et publiés | 100 % / < 90 % | 100 % / < 95 % |

Décision : chaque réseau est jugé seul, sur 3 semaines consécutives sous le seuil d'échec (règle anti-bruit). Maintien : au moins 4 seuils en succès dont visites ou partages. Ajuster (créneaux, ratio vanne / article, destination) : le reste. Pause d'un réseau et réallocation vers SEO et tunnel : échec simultané sur abonnés, visites et partages. Le social n'est jamais jugé sur le MRR (≈ 0,2 abonné payant attendu à 8 semaines, `avis-reseaux-sociaux-s15.md` §2). Honnêteté : +400 abonnés combinés en 8 semaines n'atteint pas 10 000 à 12 mois (≈ 190 par semaine) ; objectif à réviser par Thomas à J+56 ou format à scaler.

## Tableau de bord minimal (1 page, relevé du lundi)

Une ligne par réseau et par semaine (colonnes ci-dessus) + 3 lectures Umami fixes : entonnoir `/liens` > quiz-termine > inscription-reussie par `origine`, top 5 pages d'arrivée sociales, part du social dans les 713 visites par 28 jours (0,14 % aujourd'hui). Point de contrôle J+14 (26/10) : 0 visite UTM ou abonnés < 10 % du seuil = vérifier lien de bio posé, `/liens` cliqué, OAuth Instagram, avant tout autre ajustement.

## Ce qu'il faut pour 10/10

1. K1 : colonne funnel (étape, destination, métrique) par réseau, conditions de cadence (test Google mobile, plafond de temps humain), hypothèse Marc.
2. K6 : `/liens` à source dynamique avec quiz en premier, `origine` persistée jusqu'à `inscription-reussie`, UTM LinkedIn, CTA par format, formulaire email prioritaire pour le référent Instagram.
3. K8 : `mesure.md` réécrit pour 3 réseaux (baseline, colonne LinkedIn, seuils J+28 et J+56 ci-dessus validés par Thomas, règle 3 semaines, contrôle J+14).
4. Décision à porter à Thomas : valider les seuils, le relevé de départ du 11/10 et le test Google mobile.
