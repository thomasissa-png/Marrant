# Audit conversion s20 : angle mesure et lecture des chiffres (@data-analyst, 13/10/2026)

Sources : `donnees/LISEZ-MOI.md`, `donnees/umami-28j.json`, `donnees/base-conversion.json`, `docs/marrant/audit-note-s15.md`, code `apps/web/src` (lu, non modifié). Aucun benchmark externe cité : aucune cible sectorielle n'est avancée ici, seulement de l'arithmétique sur vos propres volumes.

## 1. Notes (preuve = chiffre ou fichier:ligne)

| # | Axe | Note | Preuve principale |
|---|---|---|---|
| M1 | Couverture du funnel | **7 / 10** | Chaque marche a un événement dans le code (`mur-vu`, `abonnement-vu`, `abonnement-clic`, `inscription-envoi/reussie/echec`, `abonnement-reussi`, `abonnement-annule`, `blog-scroll`, `blog-cta-clic`, `parcours-ouvert/termine`). Trous : exposition du CTA d'article (aucun `blog-cta-vu`), ouverture/échec du checkout Stripe (aucun événement entre `abonnement-clic` et `abonnement-reussi`, `abonnement-view.tsx:149-166`). |
| M2 | Fiabilité | **4 / 10** | Trois écarts non expliqués (voir 2). `abonnement-clic` double-compte une même personne. Aucun filtre du trafic interne dans Umami (`/admin` 6 vues, `/parcours/slug-inexistant-qa` 1 entrée). Le funnel du lundi n'applique pas `emailsExclus()` (utilisé seulement dans `weekly-parcours.ts:154` et `parcours-alertes.ts:30`). |
| M3 | Lisibilité du pilotage | **5 / 10** | Bon : chiffres absolus assumés, `n.d.` sans plantage (`weekly-funnel.ts:1-9`). Insuffisant : aucun dénominateur (visiteurs, entrées de l'article), aucune comparaison à la semaine précédente, aucun seuil ni action par ligne (`weekly-funnel.ts:126-137`), libellé « Clics vers le paiement » trompeur (voir 2). |
| M4 | Capacité à tester | **3 / 10** | 683 visiteurs / 28 j (< 1 000 / mois), 1 paiement / 28 j. Un test A/B sur le paiement est impossible ; sur le CTA de l'article n°1 il faut 5 à 15 semaines (voir 4). |

**CONVERSION globale, angle mesure : 4,5 / 10** (moyenne 4,75, arrondie vers le bas car M2 conditionne tout le reste). Progrès net sur le S11 « Mesure et pilotage » de s15 (3,0 / 10) : le tunnel est instrumenté de bout en bout. Mais les chiffres du tunnel ne sont pas encore assez propres ni assez lisibles pour décider.

## 2. Ce qui rend les chiffres fragiles (M2 détaillé)

1. **Le funnel « 28 jours » est en réalité un funnel d'environ une semaine.** Le compte gratuit a disparu le 06/10 à 07:45 Paris (`weekly-funnel.ts:15-19`). Les 15 vues de `/abonnement` de la semaine du 05/10 représentent 15 des 19 vues des 28 jours ; s15 en comptait 12 sur 180 jours. Les 5 `abonnement-clic` des 28 jours sont les mêmes 5 que ceux du rapport du 12/10. Les dates de mise en ligne de chaque événement ne sont pas dans le dossier : `[À FOURNIR : date de déploiement par événement]`.
2. **Cette semaine ressemble à une semaine de tests.** Indices (aucune preuve) : `/admin` 6 vues, un slug QA, un abonnement à 2,99 € créé et résilié le même jour (07/10, `base-conversion.json` : `cree` = `maj` = 2026-10-07, statut CANCELED), `/abonnement` qui passe de 12 vues en 180 j à 15 en 7 j. `[HYPOTHÈSE : une part du funnel de la semaine du 05/10 vient de Thomas ou de la QA ; à vérifier avec l'e-mail du payeur du 07/10]`.
3. **Écart vues / événements sur `/abonnement`** : 19 pages vues contre 6 `abonnement-vu` (32 %). Cause non établie (déploiement de l'événement après le début de la période ? délai du tracker, `trackUmamiWhenReady` abandonne après 10 s, `umami.ts:61-73` ? bloqueurs ?).
4. **Écart paiement** : `/abonnement/success` 4 vues, `abonnement-reussi` 1, paiement en base 1. `abonnement-reussi` ne part qu'une fois le plan PREMIUM vérifié par polling (`success/page.tsx:80-108`) : un visiteur qui ferme l'onglet avant est perdu pour Umami. Et `checkout.stripe.com` apparaît 3 fois comme source alors que `abonnement-annule` vaut 0.
5. **Écart comptes** : 5 comptes créés en base sur 28 j (3 en septembre, 2 en octobre) contre 2 `inscription-reussie` (+1 `connexion-reussie`). Compatible avec des inscriptions antérieures aux événements, non démontré.
6. **`abonnement-clic` compte des étapes, pas des personnes.** Le visiteur clique sur `/abonnement` (`statut: visiteur`, `abonnement-view.tsx:259`) puis, après `/register`, le paiement s'ouvre seul (`declencheur: auto`, `statut: membre`, ligne 149) : un même acheteur produit 2 événements. Le rapport affiche la somme sous « Clics vers le paiement » (`weekly-funnel.ts:129`), et `LISEZ-MOI.md` la lit ainsi. Sans ventilation par `statut` et `declencheur`, « 5 clics » vaut peut-être 2 à 3 personnes.
7. **« Paiements reçus » mélange acquisition et renouvellements** (`weekly-funnel.ts:24-25`, ligne 56 : tout `invoice.payment_succeeded`). Les 2 abonnés à 0,99 € qui se renouvellent gonflent le chiffre sans rien dire de la conversion.
8. **Rebond 91 % à 74 % et durée 21 026 s à 49 649 s (≈ 32 s à 62 s par visite) : ne pas lire comme une amélioration.** `blog-scroll` est en ligne depuis le 04-05/10 (s15). `[HYPOTHÈSE : des événements personnalisés peuvent sortir une visite du « rebond » et allonger sa durée dans Umami ; à vérifier dans la doc Umami ou en comparant une page sans événement avant de conclure]`.
9. **Trafic exotique** : CN 53 visiteurs (7,8 %), US 59, CA 34 sur 683, pour un site en français. Bots non filtrés possibles. Non tranché : la répartition par page d'entrée de ces pays n'est pas dans le dossier.
10. Détail mineur : `stats_precedente` (577 visiteurs) et `stats.comparison` (574) ne coïncident pas à 3 près : fenêtres décalées. On retient 574, valeur de `LISEZ-MOI.md`.

## 3. Le funnel chiffré sur 28 jours (15/09 au 12/10)

Légende : **lisible** = assez de volume pour parler d'un ordre de grandeur ; **trop faible** = ne pas conclure. Les pourcentages sont indicatifs, avec intervalle à 95 % (Clopper-Pearson, ou Poisson pour un compte seul).

| Étape | Volume | Perte vs étape précédente | Verdict |
|---|---|---|---|
| Visiteurs / visites | 683 / 803 | | Lisible. Pages vues 1 166 (1,45 par visite). Google 402 sources sur 803 visites. |
| Visites entrant par l'article n°1 | 397 | 49 % des visites (58 % des entrées listées, liste tronquée à 50 lignes) | Lisible. Concentration forte. |
| Lecture (`blog-scroll`) | 201 événements, tous articles et paliers | non calculable | Inexploitable en l'état : un lecteur envoie jusqu'à 4 événements (25/50/75/100, `blog-article-tracking.tsx:7`), et la répartition par palier n'a pas été extraite. |
| Sortie de l'article vers une 2e page | `blog-sortie-clic` 10, `blog-ancre-clic` 4 (ancres = même page), `blog-cta-clic` **0** | 385 sorties sur 397 entrées : 97 % partent de l'article ; au plus ≈ 12 visites (3 %) continuent | Lisible pour le 97 %. Le « 0 » CTA n'est pas une preuve de panne (test unitaire OK, `blog-article-tracking.test.tsx:225`), mais personne n'a vérifié un clic réel en prod, et on ignore combien de lecteurs voient le CTA. |
| Mur Premium vu (`mur-vu`) | 16 événements | 16 sur 683 visiteurs : 2,3 % (événements, pas personnes) | Trop faible. Types de mur (vannes, conseils, vidéos, modale, parcours) non extraits. |
| Vue de l'offre | `/abonnement` 19 pages vues (9 entrées directes), `abonnement-vu` 6 | 19 sur 683 : 2,8 % en pages vues. Semaine du 05/10 : 15 sur 223 visiteurs, 6,7 % | Trop faible, et écart 19 / 6 non expliqué. |
| Clic d'offre (`abonnement-clic`) | 5, tous de la semaine du 05/10 | 5 sur 15 vues : 33 % (IC 12 à 62 %) | Trop faible. Mélange visiteur et membre (point 2.6). |
| Page `/register` | 14 vues (6 entrées), `/login` 15 | | Trop faible. 6 des 14 vues sont des entrées directes (retours de comptes existants possibles), donc pas toutes issues du tunnel. |
| Envoi d'inscription | `inscription-envoi` 3 | 3 sur 14 vues : 21 % (IC 5 à 51 %) | Trop faible. |
| Inscription réussie | `inscription-reussie` 2, `inscription-echec` 1 | 2 sur 3 (IC 9 à 99 %) | Trop faible. 1 échec sur 3 tentatives est un signal qualitatif à lire dans `motif` (`register/page.tsx:130`), pas un taux. |
| Paiement | `abonnement-reussi` 1, 1 paiement en base à 2,99 € (07/10), résilié | 1 sur 5 clics : 20 % (IC 0,5 à 72 %) | Trop faible, et possible test (point 2.2). |
| Abonnés actifs / MRR | 2 (0,99 €) / 1,98 € | | Le seul chiffre solide. Pas d'abonné à 2,99 € ou 24,99 € actif. |

**Visiteur à paiement : 1 sur 683 (0,15 %, IC 0,004 à 0,8 %)**. L'intervalle contient 0 de façon plausible : le taux réel de conversion est **inconnu**, pas « 0,15 % ».

Ce que l'on sait : (1) le trafic est une seule porte (article n°1, Google) ; (2) 97 % des entrées de cette porte repartent sans 2e page ; (3) l'aval du tunnel compte moins de 20 événements par étape, donc aucune perte aval n'est mesurable. Ce que l'on ne sait pas : combien de lecteurs voient le CTA, pourquoi 4 clics sur 5 ne paient pas (abandon Stripe ou erreur technique), quelle part du funnel est interne.

Arithmétique de l'objectif (aucune hypothèse de churn, inconnu) : 335 abonnés actifs en 12 mois = 28 nouveaux par mois = **4,1 % des 683 visiteurs mensuels actuels**, contre 0,15 % observé (au plus 0,8 %). L'écart se comble par le volume autant que par le taux : mesurer ne remplace pas ce levier.

<!-- SUITE -->
