# Avis acquisition et conversion : réseaux sociaux (s15, 05/10/2026)

> Angle @growth, complément de l'audit principal @social. Sources : `docs/social/donnees-audit-s15.md`, `docs/analytics/snapshot-trafic-2026-10-05.md`, `docs/social/mesure.md`, `docs/marrant/audit-note-s15.md`. Choix fondateur du 01/10 (Instagram prioritaire, X relais, LinkedIn en pause, pas de TikTok, 5 X + 4 IG par semaine, 8 semaines, `/liens`) non re-questionné. Barème : 10 = référence pour un site de cette taille, 5 = freine, 1 = absent.

## 1. Notes (6 critères, un fait chacune)

| Critère | Note | Fait qui porte la note |
|---|---|---|
| C2 Croissance de l'audience | **2** | Aucun relevé d'abonnés depuis « 0 abonné » au 24/03 ; 3 posts publiés depuis la reprise du 01/10. La trajectoire est inconnue, donc l'objectif « 10K combinés à 12 mois » n'est pas pilotable. |
| C7 Engagement et communauté | **2** | `impressions`, `likes`, `replies`, `clicks` à 0 sur les 140 posts publiés lus (aucune remontée) ; aucune statistique native relevée. La doctrine de réponse existe (troll détaché, invitation à la ressource), mais aucune preuve d'usage. |
| C8 Retour en trafic | **2** | 1 visite sociale en 28 j (0,14 % des 713 visites), 13 en 90 j ; 0 visite `utm_source=x` ou `instagram` ; `/liens` absente des 89 chemins visités en 180 j. Le câblage (UTM, `/liens`) est prêt, le résultat est nul. |
| C9 Conversion depuis les réseaux | **1** | Aucun événement d'inscription ni de checkout codé ; 0 vue de `/register` et `/onboarding` en 180 j. Une conversion sociale est aujourd'hui inobservable, même si elle arrivait. |
| C10 Mesure et pilotage | **4** | Bon : UTM systématiques, relevé du lundi en 15 min, indicateur principal défini (partages + enregistrements). Faible : tableau §4 vide, pas d'API, seuil de la semaine 5 relatif à la médiane (aucun seuil absolu), **aucun critère de sortie chiffré** ni règle d'arrêt à la semaine 8. |
| C1 Choix des réseaux (effet sur l'objectif) | **5** | Instagram colle à la cible (mobile = 427 des 713 visites, persona 20 ans) et au format carte à partager. Mais les légendes ne sont pas cliquables : le seul chemin vers le site est le lien de bio, donc l'acquisition directe est structurellement faible. X est le seul réseau à lien cliquable, mais un seul post par semaine en porte un. |

Moyenne des 6 : **2,7 / 10**. Lecture : le volet est bien outillé en production (file prête jusqu'au début décembre, 0 échec) mais aveugle en résultat. Le problème n'est pas la qualité des posts, c'est l'absence de preuve.

## 2. Valeur relative face aux autres canaux

| Canal (28 j) | Visites | Part des 713 |
|---|---|---|
| Recherche organique | 455 | 64 % |
| Direct | 145 | 20 % |
| IA (LLM) | 5 | 0,7 % |
| Referral | 5 | 0,7 % |
| **Social organique** | **1** | **0,14 %** |

Rapport recherche / social = 455 pour 1. Un article (« 50 blagues drôles 2026 ») fait 51 % des entrées et 78 % des clics Google : le trafic est une rente SEO fragile, le social n'y contribue pas.

- **Le social ne peut pas porter l'objectif de 1 000 € de MRR** (≈ 335 abonnés à 2,99 €). Même au seuil de succès du test ci-dessous (120 visites, 3 % d'inscription `[HYPOTHÈSE]`, 5 % de passage Premium `[HYPOTHÈSE]`), cela donne ≈ 0,2 abonné sur 8 semaines. Pas de promesse de revenu pour ce canal.
- **Unit economics** : budget cash 0 €, coût réel = 15 min de relevé par lundi (production automatisée, file approuvée). CAC cash 0 mais incalculable (0 inscription attribuée). LTV `[HYPOTHÈSE : churn 10 %/mois, ARPU 2,99 €]` ≈ 30 €. Le canal est donc viable tant que son coût reste ce relevé ; il ne doit jamais recevoir de budget payant avant preuve.
- **Valeur propre du social** (canal composé, jugé à 90 jours sur indicateurs avancés) : (a) créer de la demande de marque, car « deviens marrant » = 0 impression Google en 90 j ; (b) fournir des partages qui sont le seul vrai levier viral du produit ; (c) produire des mentions et liens (0 lien entrant Bing) ; (d) nourrir les personas en valeur de divertissement avant la valeur éducative, conformément à la mission « la conversion est la conséquence ».
- **Priorité d'allocation** : le goulot est le tunnel (S10 = 2,3/10), pas le volume. Ajouter du trafic social vers un tunnel à 0 inscrit est du gaspillage ; les correctifs de tunnel passent avant toute hausse de cadence sociale. Ne pas diriger le social vers `/abonnement`.

## 3. Ce que le test de 8 semaines doit prouver

Trois choses : (1) les cartes se **partagent** (indicateur principal), (2) elles **ramènent** des visiteurs mesurables, (3) elles **créent de la marque** (recherche de marque, abonnés). Pré-requis bloquant : baseline d'abonnés X et IG relevée avant le 12/10, sinon C2 reste inobservable.

Seuils proposés à Thomas, tous `[HYPOTHÈSE : à valider avec Thomas, pas de benchmark interne]`. Cumul X + IG sur les semaines 1 à 8, extraction du lundi 30/11 (fin du test).

| Mesure | Succès | Zone grise | Échec |
|---|---|---|---|
| Visites Umami `utm_source` x + instagram | ≥ 120 (≈ 15/sem, 8 % du trafic actuel) | 30 à 119 | < 30 (bruit) |
| Abonnés IG gagnés (vs baseline) | ≥ +300 | +80 à +299 | < +80 |
| Abonnés X gagnés | ≥ +100 | +30 à +99 | < +30 |
| Instagram : partages + enregistrements / couverture (médiane des posts) | ≥ 2 % | 0,5 à 1,9 % | < 0,5 % |
| Impressions Google de la requête « deviens marrant » (28 j, S8) | ≥ 30 | 1 à 29 | 0 |
| Inscriptions attribuées aux UTM (si événement codé) | ≥ 3 | 1 à 2 | 0 |

- **GO maintien** : au moins 3 seuils en succès dont partages ou visites. **Ajuster** (IG seul, X coupé ou réduit, créneaux, ratio vanne / article) : le reste. **Pause** (réallocation vers SEO et tunnel) : échec simultané sur visites, abonnés IG et partages.
- **Point de contrôle semaine 4 (02/11)** : si 0 visite UTM et < +30 abonnés, corriger le canal (lien de bio posé ? cible du lien ?) sans attendre la semaine 8. Cela complète `mesure.md` §5 qui n'a pas de règle d'arrêt.
- **Honnêteté de trajectoire** : 10K abonnés combinés à 12 mois = ≈ 190 abonnés/semaine. Le seuil de succès (+400 combinés en 8 sem) ne l'atteint pas. Soit un format sort du lot (partages ×5), soit l'objectif 10K est à réviser par Thomas à la semaine 8.
- **Limite structurelle à connaître** : 1 seul lien cliquable par semaine sur X, lien de bio unique sur IG. Les 120 visites ne sont réalistes que si `/liens` est effectivement posé en bio (0 visite à ce jour : à vérifier).

## 4. Trois actions pour la valeur persona

1. **Mesurer d'abord (activable en 24 h)** : relever abonnés X et IG, visites de profil, clics de bio (15 min, tableau `mesure.md` §4) ; vérifier que `/liens` est bien en bio ; coder les événements `liens-clic`, `inscription`, `onboarding`, `checkout` (@data-analyst + @fullstack). Sans cela, C2, C7, C9 restent à 1-2.
2. **Donner de la valeur sans compte au clic** (Yanis et Sophie arrivent depuis leur téléphone) : faire pointer `/liens` et le lien X du lundi vers le quiz « profil humour » ou la première étape du parcours Répartie, pas vers l'abonnement ; l'article du jour reste en second. Succès : 15 % des visites UTM atteignent une 2e page.
3. **Faire de la carte un objet à envoyer à un pote** : une carte IG par semaine avec le nom du site lisible sur le visuel et une légende d'envoi (« à envoyer à celui qui… »), puis comparer partages + enregistrements des cartes signées et non signées. Double effet : le partage Yanis / coloc, et la demande de marque mesurée dans Search Console.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/growth/avis-reseaux-sociaux-s15.md`
- Décisions à valider par Thomas : seuils du §3 (hypothèses), règle d'arrêt, point de contrôle semaine 4, cible des liens (quiz / parcours).
- Points d'attention : social = canal composé sans promesse de MRR ; tunnel avant volume ; baseline abonnés avant le 12/10.
