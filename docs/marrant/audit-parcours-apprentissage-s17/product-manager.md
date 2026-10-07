# Audit produit des parcours d'apprentissage (s17, 07/10/2026) : @product-manager

> Périmètre : C1 (quantité/couverture), C7 (conversion et valeur Premium), C8 (rétention et engagement), C12 (cohérence promesse/réalité) + définition des critères de succès d'une offre de parcours.
> Statut : COMPLET (07/10/2026, code 79b11f3, prod 712ee919). Audit seul : aucun fichier de code, de contenu ou de base modifié, aucun commit.
> Méthode : lecture du code et du seed (Grep indisponible dans cette session, fichiers lus un par un, liste en §8), données Umami/Stripe du snapshot du 05/10, repères de marché par recherche web (§3).
> Contraintes [CHOIX UTILISATEUR] respectées (non re-questionnées) : pas de compte gratuit, visiteurs inchangés, 2,99 €/mois ou 24,99 €/an TTC, « 1 500+ » P0, « 15 à 20 min/semaine selon le parcours », témoignages = exemples, humoristes autorisés.

## 1. TL;DR

1. Les parcours sont la valeur principale de Premium (premier avantage listé, `config/premium.ts:7`), mais l'offre réelle est petite : **3 parcours, 13 étapes, environ 4 h de contenu** au rythme annoncé (3x15 + 4x20 + 6x20 = 245 min), dont 3 étapes en lecture libre (22 % du temps).
2. Le contenu est bien structuré, mais **rien dans le produit ne fait avancer la personne d'une semaine à l'autre** : pas de rythme, pas de rappel, pas de retour sur l'exercice, pas de relance après abandon ou résiliation (C8 : 3/10).
3. Au moment décisif, la fin de l'étape 1, le visiteur lit « Tu peux valider l'étape » puis tombe sur un mur : **la progression mesurable promise n'apparaît qu'après paiement** (C7 : 5/10).
4. La promesse affichée est globalement vraie (3 parcours, 1re étape libre, prix), avec 4 écarts : vannes d'étape jamais montrées, deux rythmes contradictoires (par jour / par semaine), XP et série présentés à tous alors que réservés Premium, suite recommandée parfois déjà faite (C12 : 6/10).
5. Sur 15 critères de succès, 3 se lisent dans Umami, 5 par requête en base, 7 pas ou mal ; **62 vues de pages parcours en 90 jours** : à ce volume les seuils ne se jugent pas encore, il faut d'abord mesurer et amener du monde à l'étape 1.

## 2. Tableau de notes (C1, C7, C8, C12)

| Critère | Note /10 | Preuve courte |
|---|---|---|
| C1 Quantité et couverture | **5** | 3 parcours, 13 étapes, 245 min au rythme annoncé ; 1 parcours par persona (Sophie, Yanis, Marc) ; ni storytelling ni pro (annoncés « Prochainement », `upcoming-features.tsx:39-42`) ; durée réelle jamais mesurée (2 vidéos + 5 vannes + conseil + quiz par étape) |
| C7 Conversion et valeur Premium | **5** | Mur net à l'étape 2 (`parcours-access.ts:15,27`), aperçu honnête, prix affiché, `mur-vu` tracé depuis s16 ; mais valider l'étape 1 = Premium (`:31`), texte « Tu peux valider l'étape » avant le mur (`parcours-detail.tsx:168,749`), 0 donnée de conversion aux prix 2,99/24,99 € |
| C8 Rétention et engagement | **3** | Reprise OK (étape ouverte = première non validée, `parcours-detail.tsx:291-297`, bouton « Continuer ce parcours »), mais aucun rappel, aucun rythme (déblocage à la validation, `:540-542`), aucun e-mail de relance parcours (types d'e-mail `email.ts:30-38`), pas de retour sur l'exercice |
| C12 Cohérence promesse / réalité | **6** | Chiffres dynamiques et rythmes testés contre le seed (`premium-offer.test.ts`), 1re étape libre vraie ; écarts : vannes non montrées (`parcours-detail.tsx:244-262`), 5-10 min/jour (FAQ) contre 15-20 min/semaine, XP/série pour tous (FAQ), « offerte » = lecture seule |

Contraintes [CHOIX UTILISATEUR] respectées et non re-questionnées : pas de compte gratuit ; visiteurs inchangés (étape 1 lisible, plafonds 10/3/3) ; 2,99 €/mois ou 24,99 €/an TTC ; « 15 à 20 min/semaine selon le parcours » ; témoignages présentés comme exemples ; FAQ « 8 semaines » et « 50 XP par semaine » ; humoristes nommés autorisés ; aucune IA qui produit au fil de l'eau ; jamais de mention IA.

## 3. Grille de 15 critères clés de succès d'une offre de parcours

**Lecture en clair.** Un parcours réussi, pour Marrant, c'est : quelqu'un le trouve, lit l'étape 1, a envie de la suite, la paie, revient chaque semaine, va au bout, refait un parcours, et surtout **essaie vraiment ses répliques dans la vraie vie** (promesse du produit : « produit qui s'apprend », pas qui se vend). Les 15 critères suivent ce fil, dans l'ordre du parcours.

**Avertissement sur les seuils.** Aucun repère public ne porte sur « un parcours d'humour francophone à 2,99 €/mois ». Les seuils « bon » sont donc des **[HYPOTHÈSE]** construites à partir de repères d'applis d'apprentissage grand public (sources en fin de section), ajustées à nos particularités : parcours très courts (3 à 6 étapes), payants (les gens sont déjà motivés), volumes minuscules. Ce sont des cibles de travail à valider, pas des normes. Sources de qualité inégale : voir la colonne de fiabilité en fin de section.

| # | Critère (en clair) | Seuil « bon » [HYPOTHÈSE] | Repère public | État actuel | Mesurable aujourd'hui ? |
|---|---|---|---|---|---|
| K1 | **Découverte** : part des visites qui voient une page parcours | ≥ 15 % des visites | Aucun repère public (propre à notre site) | **≈ 2,6 %** : 62 vues de pages parcours (27 hub + 13 + 13 + 9) pour 2 399 visites, 90 j au 05/10 (vues de pages, pas de visiteurs uniques) | Oui (Umami, pages vues) |
| K2 | **Démarrage** : part des gens sur un parcours qui ouvrent un programme ou une étape | ≥ 40 % ouvrent une étape | Aucun repère | 35 vues de pages parcours pour 27 vues du hub (90 j) : on arrive sur les pages parcours sans passer par le hub (pastilles du hero, blog). Ouverture d'étape : non mesurée | Partiel (pas d'événement « étape ouverte ») |
| K3 | **Lecture réelle de l'étape 1** : ouvre l'étape et va au bout du contenu | ≥ 50 % des arrivées | Éducation : J1 de rétention 14-15 % (benchmark d'applis, [passion.io](https://passion.io/blog/mobile-app-retention-benchmarks-for-creators-course-coaching-apps)), donc 50 % d'une étape ouverte est ambitieux mais l'étape est la vitrine | Non mesuré | Non |
| K4 | **Étape 1 terminée** : quiz bouclé (visiteur) ou étape validée (abonné) | ≥ 40 % de ceux qui ont ouvert l'étape 1 | MOOC : médiane 12,6 % de complétion sur cours entiers (Jordan 2015), nos étapes durent 15-20 min : on doit faire très au-dessus | Non mesuré côté visiteur (quiz en `sessionStorage`, aucun événement) ; côté abonné `parcours-etape` (n = 2 abonnés, ancien prix) | Non (visiteur) / Oui (abonné, rare) |
| K5 | **Arrivée au mur** de l'étape 2 | ≥ 20 % des visiteurs de pages parcours | Aucun repère | Aucune donnée avant s16 ; événement `mur-vu` (type `parcours-etape`) en ligne depuis le 07/10 | Oui, à partir du 07/10 |
| K6 | **Conversion au blocage** : du mur vu à l'abonnement payé | ≥ 3 % de ceux qui voient le mur | Appli en freemium : 2,1 % de téléchargements qui payent (médiane), 6-8 % pour les meilleures ; mur placé dans le produit : 10,7 % pour un mur dur ([RevenueCat 2025 via Subscription Insider](https://subscriptioninsider.com/article-type/news/revenuecats-state-of-subscription-apps-2025-report-ais-dominance-retention-challenges-and-the-shift-away-from-pure-subscriptions)) | Aucun achat aux prix 2,99/24,99 € avant l'achat test du 07/10 (remboursé) ; 90 j : 8 vues de `/abonnement`, 1 `/abonnement/success`, tous parcours confondus : n trop petit pour conclure | Oui, à partir du 07/10 (`mur-vu`, `abonnement-clic`, `abonnement-reussi`) |
| K7 | **Activation** : l'abonné valide l'étape 1 dans les 48 h | ≥ 70 % | Aucun repère ; il vient pour ça | Non mesuré (2 abonnés de lancement à 0,99 €, MRR 1,98 € au 05/10) | Oui par requête SQL (abonnement daté + progression) ; pas d'événement |
| K8 | **Passage étape 1 vers 2** : l'abonné valide la 2e étape | ≥ 70 % de ceux qui ont validé la 1re | Aucun repère | Non mesuré | Oui (événement `parcours-etape` étape 2, ou SQL) |
| K9 | **Rythme tenu** : au moins 1 étape validée par semaine pendant la durée annoncée | ≥ 50 % des semaines actives | Parcours rythmés / en cohorte : 64,2 % de complétion contre 48,2 % en libre-service (analyse de 32 000 cours, relayée par [Teachable](https://teachable.com/blog/improve-student-success) ; source éditeur) ; série de 7 jours = 3,6 fois plus de chances d'aller au bout ([Duolingo](https://blog.duolingo.com/how-duolingo-streak-builds-habit)) | Non mesuré ; **aucun rythme n'est imposé ni suggéré** par le produit | Partiel (événement `parcours-etape` daté, sans identifiant de compte ; la base ne garde pas la date par étape) |
| K10 | **Parcours terminé** : part des abonnés qui ont commencé et finissent | ≥ 40 % (plancher 25 %) | MOOC : médiane 12,6 %, de 0,7 % à 52,1 % ; plus la formation est longue, plus on décroche ([Jordan 2015, IRRODL](https://www.irrodl.org/index.php/irrodl/article/view/2112/3364)) ; libre-service 10-20 % contre 85-95 % en cohorte (blogs d'éditeurs, fiabilité faible) | Non mesuré | Oui (SQL : `UserPathProgress.completedAt`) |
| K11 | **Parcours suivant** : un autre parcours démarré dans les 7 jours après une fin | ≥ 50 % | Aucun repère | Non mesuré ; la suite est recommandée de façon statique (voir PM-07) | Oui (SQL) ; pas d'événement |
| K12 | **Retour à J7** : l'abonné actif revient dans la semaine qui suit son 1er passage | ≥ 40 % | Applis généralistes : J1 25 %, J7 11-13 %, J30 6 % ; éducation : J1 14-15 %, J30 2-3 % ([passion.io](https://passion.io/blog/mobile-app-retention-benchmarks-for-creators-course-coaching-apps), source secondaire). Un abonné payant doit être très au-dessus de la moyenne des applis gratuites | Non mesuré (la série compte les connexions, d'après `docs/product/suppression-compte-gratuit-s15.md` §1.1 ; code non relu) | À vérifier |
| K13 | **Rétention payante** : abonnés encore là au 2e et au 4e prélèvement, et résiliations dans les 14 jours qui suivent une fin de parcours (contenu épuisé) | ≥ 70 % au 2e prélèvement ; ≤ 30 % de résiliations juste après une fin | 30 % des abonnés annuels résilient dès le 1er mois (RevenueCat 2025, source ci-dessus) ; Duolingo : 8,5 % des utilisateurs mensuels payent (T3 2024, [investisseurs Duolingo](https://investors.duolingo.com/)) | n = 2 (lancement, 0,99 €) ; 0 abonné aux prix actuels | Oui (Stripe + base), croisement à construire |
| K14 | **Temps réel contre temps promis** : durée médiane d'une étape | médiane ≤ 20 min, 80 % des gens ≤ 30 min | Aucun repère | Non mesuré ; durée des vidéos jamais relevée, dont un « spectacle complet » (Kyan Khojandi, « Pulsions », étape 6 de Confiance) | Non (aucun horodatage début/fin d'étape) |
| K15 | **Résultat vécu** : la personne a essayé sa réplique en vrai, et ça a marché ou presque | ≥ 60 % « j'ai essayé » ; ≥ 70 % de ceux-là « ça a marché ou presque » | Aucun repère ; c'est le critère le plus fidèle à la promesse | N'existe pas : aucun retour sur l'exercice dans le produit | Non (à créer, voir PM-06) |

**Sources et fiabilité des repères.**
- Jordan 2015 (221 MOOC, médiane 12,6 %) : revue à comité de lecture, fiable, mais cours universitaires gratuits (public peu engagé) : sert de plancher, pas de cible.
- RevenueCat, État des applications par abonnement 2025 (freemium 2,1 % contre mur dur 10,7 %) : données de 75 000 applis, fiable ; lue ici via un résumé de presse spécialisée, pas le rapport complet. Aucune ventilation « éducation » obtenue : non vérifié.
- Duolingo (8,5 % d'abonnés payants sur les utilisateurs mensuels au T3 2024 ; série de 7 jours = 3,6 fois plus de chances d'aller au bout) : sources de l'éditeur, fiables mais produit mobile à très forte mécanique d'habitude, non transposable tel quel à un site à 713 visites par mois.
- Rétention d'applis éducation (J1 14-15 %, J30 2-3 %) et rythme/cohorte (85 % contre 15 %) : blogs d'éditeurs de plateformes de cours, **fiabilité faible**, ordres de grandeur seulement.

**Lecture produit.** Sur 15 critères : 3 se lisent dans Umami (K1, K5, K6, dont K5 et K6 avec un jour de recul), 5 demandent une requête en lecture sur la base ou Stripe (K7, K8, K10, K11, K13), 2 sont partiels (K2, K9), 5 ne sont pas mesurables du tout (K3, K4 côté visiteur, K12, K14, K15). Les critères qui disent si **l'offre marche vraiment** (K9, K12, K14, K15) sont ceux qui n'ont aucun point de mesure. Voir PM-08. Les requêtes SQL n'ont pas été lancées dans cette session (pas d'accès shell) : aucune valeur de progression réelle n'est donc donnée ici.

## 4. Écart promesse affichée / offre réelle

**Offre réelle (vérifiée dans le seed et le code).** 3 parcours : Machine à Café (3 étapes, 15 min/semaine, 225 XP), Répartie (4 étapes, 20 min/semaine, 375 XP), Confiance (6 étapes, 20 min/semaine, 700 XP) = **13 étapes, 1 300 XP + 3 bonus de fin de 100 XP = 1 600 XP au maximum**. Chaque étape : un conseil (avec exemple et exercice, texte lu en base), 5 vannes désignées par numéro, 2 vidéos intégrées, un quiz de 4 questions (5 pour la dernière étape de Répartie et de Confiance). Étape 1 de chaque parcours : lecture libre (3 étapes sur 13). Étapes 2 et suivantes : Premium. Valider une étape (donc XP et progression) : Premium, étape 1 comprise. Les étapes se débloquent dans l'ordre, dès que la précédente est validée, sans date.

Méthode de recensement : Grep « parcours » dans `apps/web/src` impossible (outil désactivé dans cette session, pas de shell). Les 14 fichiers qui portent la promesse ont été lus un par un (liste en §8). Un balayage complet reste à faire par la session avec `rg -i "parcours" apps/web/src` (corps des articles, e-mails, llms.txt et pages thèmes non relus).

| # | Promesse affichée (où) | Réalité | Verdict |
|---|---|---|---|
| E1 | « Accéder aux parcours complets » + « La première étape de chaque parcours reste en lecture libre » (hero `hero-section.tsx:73,76`, `/abonnement` `abonnement-view.tsx:141`) | Vrai : `LAST_FREE_PARCOURS_STEP = 1` (`parcours-access.ts:15`) | OK |
| E2 | « Les 3 parcours en entier [...] Chaque étape avec son conseil, ses vannes, ses vidéos et son quiz » (`premium-benefits.tsx:34-36`) | Conseil, vidéos, quiz : oui. **Vannes : jamais montrées.** L'étape affiche « 5 vannes sélectionnées pour ce module. Découvre-les dans le catalogue » avec un lien vers `/vannes` en général (`JokeTeaser`, `parcours-detail.tsx:244-262`). Les 5 numéros du seed ne sont ni affichés ni liés | **Partiel** (PM-04) |
| E3 | « Un petit exercice par jour » (pastille du hero, `hero-section.tsx:21`) | Un exercice par étape (donc par semaine) dans les parcours ; l'exercice quotidien existerait via « À toi de jouer » sur la vanne du jour (non vérifié ici) | **Partiel / à vérifier** |
| E4 | « Avec une pratique quotidienne de 5-10 minutes [...] Le Parcours Machine à Café dure 3 semaines » (FAQ `faqs.ts:24`) contre « 15 min/semaine » (cartes parcours, `/abonnement`) | Deux rythmes incompatibles : 5-10 min/jour = 35-70 min/semaine, soit environ 2 à 4 fois le rythme annoncé pour les parcours. Le produit n'impose ni l'un ni l'autre. Durée réelle d'une étape jamais mesurée | **Contradiction** (PM-05) |
| E5 | « En 3 semaines » / « 4 semaines » / « 6 semaines » (descriptions du seed) | Durées conseillées, pas tenues par le produit : une étape se débloque dès la précédente validée (`parcours-detail.tsx:540-542`), un abonné peut finir un parcours en une séance | **Partiel** (PM-01) |
| E6 | « Avec le système de streaks et d'XP, tu gardes la motivation sur la durée » (FAQ publique `faqs.ts:45`) | XP, série et profil de progression réservés aux abonnés depuis s15 (`docs/product/suppression-compte-gratuit-s15.md` §1.1) ; la série compte les connexions, pas la pratique ; aucun rappel ne la protège | **Partiel** (PM-12). Rappel : les chiffres de la FAQ (« 8 semaines », « 50 XP par semaine ») sont intouchables |
| E7 | « Des exercices que tu peux pratiquer seul avant de les tester en groupe » (FAQ `faqs.ts:19`) | L'exercice est un texte à lire (champ `tip.exercise`, contenu en base non relu) ; aucun retour, aucune trace de l'avoir fait | **Non vérifié** (qualité des exercices : périmètre C2) |
| E8 | « Progression mesurable » (promesse du `project-context.md`) ; barre « n/N étapes complétées », « N XP au total » (`parcours-detail.tsx:506-513`) | Ce qui se mesure = des étapes cliquées. Le quiz « ne compte pas » (`parcours-detail.tsx:169`), l'exercice n'est pas vérifié, aucun avant/après | **Partiel** (PM-06) |
| E9 | « La première étape est offerte » / badge « Lecture libre » (`config/textes/offre.ts:79,74`, provisoires s16) | « Lecture libre » est exact. « Offerte » laisse croire à une étape complète : on peut la lire et faire le quiz, pas la valider (pas de coche, pas d'XP) | **Partiel** (PM-03) |
| E10 | « Passer au parcours suivant » en fin de parcours (`parcours-detail.tsx:835-838`) | Bouton réel, mais la suite vient du seed et ne tient pas compte de ce qui est déjà fait : Confiance renvoie à Machine à Café (`parcours-seed.json:392`) même après les 3 parcours | **Partiel** (PM-07) |
| E11 | « De nouveaux parcours : plus poussés sur la répartie et le storytelling » (accueil, `upcoming-features.tsx:39-42`) | Étiqueté « Prochainement », vote réservé aux abonnés ; aucune date, aucun parcours Pro annoncé | OK honnête, risque d'attente |
| E12 | « Bienvenue dans Premium [...] Reprends là où tu t'étais arrêté » (`premium-welcome.tsx:29`) | Vrai : l'étape ouverte est la première non validée | OK |
| E13 | « Imagine Léa / Tom / Julien » (témoignages des parcours) | Présentés comme exemples, conformément au [CHOIX UTILISATEUR] du 29/09 | OK |

**Bilan.** Sur 13 promesses recensées : 4 OK, 1 contradiction (rythme), 6 partielles, 2 non vérifiées ou à vérifier. Aucune promesse fausse au sens strict, mais **trois d'entre elles portent le cœur de la valeur** (vannes de l'étape, progression mesurable, rythme) et sont plus riches à l'écran qu'à l'usage.

## 5. Manques fonctionnels vs un parcours d'apprentissage réussi

Priorisation par valeur persona : Impact (0-10) x Confiance (0-10), l'effort n'entre pas dans le calcul (contexte IA). Valeur persona 0-3 par personne : Y = Yanis, S = Sophie, M = Marc. Les confiances faibles sont des paris à tester (voir hypothèses ci-dessous).

| # | Élément d'un parcours réussi | Aujourd'hui | Y / S / M | Impact x Confiance | Verdict |
|---|---|---|---|---|---|
| F1 | **Rythme** : savoir où j'en suis dans la semaine, quelle étape est conseillée quand | Absent. Étapes déblocables d'affilée, aucune date cible. « 3 semaines » n'est qu'un texte | 3 / 3 / 3 | 9 x 7 = **63** | **GO**. Rythme conseillé et non imposé : l'étape suivante reste ouverte, on affiche « étape conseillée pour le jeudi 15 ». Le jour est choisi par la personne, pas par défaut |
| F2 | **Rappel** hebdomadaire | Absent. Seul envoi de rappel : renouvellement annuel (`email.ts:30-38`). Push du matin = mobile seulement, vanne du jour, appli non publiée | 2 / 3 / 2 | 9 x 7 = **63** | **GO** en e-mail, sur demande uniquement (case à cocher, jour et heure choisis), ton « on offre, on n'impose pas ». Brouillon d'e-mail obligatoire, étalon à valider (P0 s8), avis @legal (consentement, désinscription). Jamais de formule culpabilisante (P0 06/05) |
| F3 | **Exercice pratique** concret | Présent en texte, une fois par étape, contenu en base (non relu) | 3 / 3 / 3 | 8 x 6 = **48** | **GO** pour le découper en un « défi de la semaine » à faire dans une situation précise (qui, où, quoi dire) ; qualité de l'exercice à auditer (C2) |
| F4 | **Retour sur l'exercice** | Absent. Valider = cliquer, quiz qui « ne compte pas » | 3 / 2 / 3 | 9 x 8 = **72** | **GO**, en premier. Trois boutons à la fin d'étape : « Pas encore essayé » / « Essayé, bof » / « Essayé, ça a marché » + une ligne libre facultative. Donne enfin K15. Pas de correction par IA au fil de l'eau ([CHOIX] 01/10) : l'auto-évaluation suffit |
| F5 | **Bilan de fin de parcours** | « Bravo » + XP + bouton suite (`parcours-detail.tsx:821-851`) | 3 / 2 / 3 | 7 x 7 = **49** | **GO** : récap des techniques vues, ce que la personne a dit avoir essayé (F4), un défi pour la suite, carte partageable sobre |
| F6 | **Certificat / attestation** | Absent | 0 / 0 / 0 | 2 x 8 = **16** | **NO-GO** (voir encadré) |
| F7 | **Parcours suivant recommandé** | Statique (champ du seed), peut renvoyer à un parcours déjà fait | 2 / 2 / 3 | 6 x 8 = **48** | **GO** : suivant = premier parcours non commencé, sinon « bilan » ou nouveau parcours quand il existe |
| F8 | **Parcours Storytelling** | Annoncé « Prochainement » sur l'accueil (vote abonnés) | 2 / 3 / 3 | 8 x 6 = **48** | **GO en premier des nouveaux parcours** (matrice §6). Confiance à confirmer par les votes (non lus ici) |
| F9 | **Parcours Pro** (réunion, présentation, pot de départ, messages de bureau) | Au backlog, non annoncé publiquement | 1 / 3 / 2 | 7 x 5 = **35** | **GO en second** : valeur forte pour une seule persona (Sophie) ; l'appui actuel est le parcours Machine à Café, qui en couvre déjà une partie |
| F10 | **Reprise après abandon ou résiliation** (« tu en étais à l'étape 3 de Répartie ») | Absent. La progression est conservée en base (« ta progression t'attend »), jamais rappelée | 2 / 2 / 3 | 7 x 7 = **49** | **GO** : un seul e-mail brouillon ~30 jours après le dernier passage, avec l'étape exacte. Même règles que F2 |
| F11 | **Révision** après la fin (fiche mémo des techniques, rejouer un quiz) | Absent | 2 / 2 / 2 | 5 x 6 = **30** | **GO après F5** (le bilan sert de base) |
| F12 | **Niveaux et badges de parcours** | Niveaux sur l'XP (`docs/content/progression-levels.md`, code non relu) ; 1 parcours = 325 à 800 XP : niveau « Apprenti » seulement, sauf Confiance (800, « Farceur ») ; « Légende » (5 000 XP) hors de portée des parcours seuls | 3 / 1 / 2 | 5 x 6 = **30** | **À recaler** après mesure : badge de fin de parcours plutôt que nouvelle échelle |
| F13 | **Communauté / partage entre membres** | Annoncé « Prochainement » (vote) | 2 / 2 / 2 | 5 x 3 = **15** | **Pas maintenant** : modération et volume (13 comptes au 05/10) ; hors périmètre de cet audit |

**Encadré : pourquoi non au certificat (F6).** Un certificat n'a de valeur que pour quelqu'un qui doit prouver une compétence à un tiers. Ni Yanis (veut répondre en soirée), ni Sophie (veut une anecdote pour lundi), ni Marc (veut retrouver sa légèreté) n'en ont l'usage, et « Scolaire » fait partie des 3 mots qui ne définissent PAS la marque (`project-context.md`). La preuve de réussite qui compte ici est F4 puis F5 : « j'ai essayé, ça a marché ».

**Hypothèses à tester avant d'écrire les stories** (assumption map) :

| Hypothèse | Niveau de preuve | Test |
|---|---|---|
| H1 Un rappel hebdomadaire choisi par la personne augmente les étapes validées d'une semaine à l'autre (K9, K10) | Faible pour nous ; fort en général (série 7 jours = 3,6 fois plus de chances de finir, Duolingo ; parcours rythmés : 64 % contre 48 % de complétion) | Rappel opt-in sur les premiers abonnés ; comparer K9 des abonnés avec et sans rappel (n petit : lecture qualitative) |
| H2 Un retour sur l'exercice (F4) accroît le retour à J7 et le sentiment de progrès | Faible | Mettre F4 en ligne, lire K15 et K12 |
| H3 Le storytelling attire plus d'abonnés que le Pro | Faible (aucun vote lu, requêtes GSC « raconter une blague » en cannibalisation sur 5 articles : intérêt réel mais non chiffré) | Lire les votes `nouveaux-parcours` (`/api/features/vote`), croiser avec les requêtes Search Console |
| H4 Le mur placé à l'étape 2 est le bon endroit (plutôt qu'à la validation de l'étape 1) | Faible | Pas de test A/B possible à ce volume ; entretiens (5 à 8 visiteurs) + lecture de K5/K6 |
| H5 Le contenu actuel (13 étapes) ne retient pas un abonné au-delà de 2 à 3 mois | Moyenne (déduction : contenu fini, abonnement récurrent) | K13 : résiliations juste après une fin de parcours |

## 6. Matrice valeur persona (Yanis / Sophie / Marc) x parcours

Valeur 0 à 5 = à quel point CE parcours, tel qu'il est écrit, sert CETTE personne (pas seulement le parcours qui lui est « attribué »). Les 3 parcours existants sont jugés sur le seed (`docs/content/parcours-seed.json`) ; Storytelling et Pro sont des estimations sur le besoin décrit dans `project-context.md` (aucun contenu n'existe).

| Parcours | Yanis (20 ans, étudiant, répartie, timide) | Sophie (26 ans, CDI, machine à café, afterwork) | Marc (34 ans, séparé, reprendre confiance) | Total /15 |
|---|---|---|---|---|
| **Machine à Café** (3 étapes, 15 min) | **2** : décor open space et réunion, vannes courtes utiles mais hors vécu étudiant | **5** : réunion, pause, afterwork, anecdote de week-end ; court, pas de situation « pro » oubliée | **3** : l'étape 3 (anecdote) sert aux dîners ; le cadre bureau moins | 10 |
| **Répartie** (4 étapes, 20 min) | **5** : « chambré en soirée, en coloc ou en TD », exercices progressifs pour timides, ping-pong d'impro | **3** : techniques transférables (silence, retournement) mais exemples TD, BDE, coloc | **2** : exemples étudiants, tonalité jeune ; reste le besoin « répondre sans rester muet » | 10 |
| **Confiance** (6 étapes, 20 min) | **3** : timidité, autodérision, groupe : bon ; mais l'étape 3 « L'humour de trentenaire : MSN, K7 » et ses quiz (Ikea, Biarritz) sont hors cible pour 20 ans | **2** : écrit « pour le jour où ça fait longtemps que tu n'as fait rire personne », Sophie est déjà sociable | **4** : écrit pour lui (observation, autodérision, registres, style) ; manque profondeur/personnalisation signalés par la persona | 9 |
| *Storytelling (backlog, estimé)* | 3 : raconter sa soirée à ses potes | 4 : anecdotes pour afterwork et dîners | 5 : « storytelling » nommé dans son profil, dîners, reconstruction | **12** |
| *Pro (backlog, estimé)* | 1 : peu de contexte pro, stage éventuel | 5 : réunions, collègues, pot de départ, messages au bureau | 3 : monde du travail adulte, secondaire | 9 |

**Lecture.**
- **Yanis** est le mieux servi (Répartie, 5) mais la suite par défaut le mène à Confiance, dont une étape sur six lui est étrangère. Il lui manque surtout la preuve de progrès (F4) et un rappel (F2), les deux leviers de son profil (progression visible, rassurance).
- **Sophie** a son parcours (Machine à Café, 5) mais il est court (3 étapes, 45 min) : elle l'aura fini en une soirée et ne trouve ensuite que des parcours écrits pour d'autres (3, 3, 2). **C'est la persona la plus exposée à « j'ai tout fait, je résilie » (PM-02).** Le parcours Pro est son premier besoin non servi.
- **Marc** a un seul parcours à 4 et une suite par défaut (Machine à Café, 3). Son profil réclame du « storytelling », des « recommandations personnalisées » et de la « profondeur » : le parcours Storytelling (5) est celui qui lui apporte le plus de valeur.
- **Ordre de nouveaux parcours par valeur persona** : Storytelling (12) puis Pro (9). Sous réserve de H3 (votes à lire).
- **Suite par défaut à personnaliser (F7)** : Yanis Répartie, puis Storytelling, puis Confiance ; Sophie Machine à Café, puis Pro, puis Storytelling ; Marc Confiance, puis Storytelling, puis Machine à Café. Aujourd'hui tous suivent la même boucle statique Machine à Café, Répartie, Confiance, Machine à Café (champ `nextParcours` du seed).
- **Question pour Thomas (aucun document ne la tranche)** : le parcours Confiance reste-t-il écrit pour Marc, étape 3 comprise (assumé : un parcours par persona), ou une étape doit-elle devenir lisible pour un étudiant de 20 ans ? Exécution éventuelle : @copywriter, avec étalons.

## 7. Constats numérotés (PM-01 à PM-12)

Format : problème, effet pour la personne, ce qu'on fait (sans jargon) ; le détail technique est à part. Effort : rapide / moyen / long. Toute formulation nouvelle destinée au site ou aux e-mails passe d'abord par des étalons validés par Thomas (P0 s8) ; aucun chiffre existant du site n'est touché.

### PM-01 [P0] (C8) Rien ne fait revenir la personne d'une semaine à l'autre
- **Problème** : un parcours est annoncé « en 3, 4 ou 6 semaines, 15 à 20 min par semaine », mais le produit ne propose ni date, ni rythme conseillé, ni rappel, ni relance. La régularité, qui est ce qui fait réussir un parcours, est laissée entièrement à la bonne volonté.
- **Effet** : la personne commence l'étape 1 un soir, a prévu « la suite la semaine prochaine », et rien ne le lui rappelle. Pour Yanis (timide, besoin d'être guidé) et Marc (en reconstruction), c'est le risque d'abandon le plus fort. Pour le chiffre d'affaires : un abonné qui ne revient pas résilie.
- **Ce qu'on fait** : (1) un rythme conseillé affiché (« étape conseillée pour le jeudi 15 », jour choisi par la personne, étape suivante toujours ouverte) ; (2) un rappel par e-mail hebdomadaire **sur demande uniquement**, ton « on offre, on n'impose pas » ; (3) un e-mail de reprise ~30 jours après le dernier passage, avec l'étape exacte (F1, F2, F10). Jamais de phrase culpabilisante.
- **Détail technique et preuve** : déblocage à la validation de l'étape précédente, aucune date (`parcours-detail.tsx:540-542`) ; types d'e-mail client : réinitialisation, rappel annuel, confirmation, paiement refusé, résiliation, rétractation (`email.ts:30-38`) ; routes cron : aucune pour les parcours (`app/api/cron/`, 15 routes dont `daily-push` = push mobile « vanne du jour », appli non publiée) ; recherche de fichiers `*relance*`, `*inactiv*`, `*reactivation*` vide. Déduit, pas lu à 100 % : `lib/scheduler/jobs.ts` lu sur 150 lignes seulement. Série = connexions, d'après la spec s15 (code `auth.ts` non relu).
- **Agent / effort** : @product-manager (stories) puis @fullstack, @copywriter (étalons e-mail), @legal (consentement et désinscription) ; moyen.

### PM-02 [P1] (C1, C7) Le contenu payant est fini, l'abonnement ne l'est pas
- **Problème** : 13 étapes, environ 4 h, pour un abonnement mensuel récurrent. Au rythme annoncé, tout est consommé en 13 semaines, et en un week-end si la personne enchaîne. Les contenus qui se renouvellent (vanne, conseil et vidéo du jour) sont publics ; ne reste de nouveau, côté Premium, que le carnet mensuel (15 fiches le 1er mois, puis 30).
- **Effet** : Sophie finit Machine à Café (45 min) en une soirée et n'a ensuite que des parcours écrits pour d'autres. Marc a 6 étapes, puis une suite qui le renvoie à un parcours déjà fait. « J'ai tout vu, je résilie » est le scénario le plus probable.
- **Ce qu'on fait** : annoncer et tenir un calendrier d'ajouts (Storytelling d'abord, Pro ensuite, F8 et F9), plus un « défi du mois » par parcours ; mesurer les résiliations juste après une fin de parcours (K13) pour confirmer. Ne pas toucher aux prix ([CHOIX UTILISATEUR]).
- **Détail technique et preuve** : `parcours-seed.json` (13 étapes) ; `config/premium.ts:70-74` ; `upcoming-features.tsx:39-42` ; matrice §6 (Sophie 10/15 sur son parcours, 3/3/2 sur les autres) ; hypothèse H5 non encore testée (0 abonné aux prix actuels).
- **Agent / effort** : @product-manager (roadmap par dépendances), @copywriter + @ia (production du contenu préparé à l'avance et relu à l'aveugle, [CHOIX] 01/10) ; long.

### PM-03 [P1] (C7, C12) Au moment décisif, le visiteur lit « tu peux valider » puis trouve un mur
- **Problème** : à la fin du quiz de l'étape 1, tout le monde, visiteur compris, lit « Tu as tout compris. Tu peux valider l'étape. » Puis le bouton de validation est remplacé par « Valider l'étape fait partie de Premium » et « Voir l'offre Premium ». Le badge dit « Lecture libre », mais la page d'abonnement et le texte du mur disent « la première étape est offerte ».
- **Effet** : le seul moment où la personne sent qu'elle progresse (coche, XP, barre qui avance) est justement celui qu'on lui retire. L'achat arrive sur une déception plutôt que sur une envie, ce qui est à l'opposé du principe « produit qui s'apprend, pas qui se vend ».
- **Ce qu'on fait** : (1) pour un visiteur, remplacer le texte de fin de quiz par un texte vrai (ex. « Bien joué. Pour garder ta progression, il te faut l'accès complet ») ; (2) dire clairement « Étape 1 : lecture libre. Valider = Premium » ; (3) à décider par Thomas, car cela ajouterait une fonction aux visiteurs ([CHOIX] 05/10 : visiteurs inchangés) : une coche locale « fait » sans enregistrement. Reco par défaut : (1) et (2) seulement.
- **Détail technique et preuve** : `parcours-detail.tsx:159-175` (fin de quiz, aucun test de plan), `:747-751` (« Quiz bouclé, tu peux valider l'étape »), `:798-810` (remplacement par le mur pour `!isPremium && step.order === 1`), `config/textes/offre.ts:74,79,84-87` (textes marqués PROVISOIRE s16). Fonction « valider = Premium » décidée par la spec s15 §1.1, pas par un [CHOIX UTILISATEUR] explicite.
- **Agent / effort** : @copywriter (étalons) puis @fullstack ; rapide.

### PM-04 [P1] (C12, C1) Les « vannes de l'étape » promises ne s'affichent pas
- **Problème** : chaque étape a 5 vannes choisies pour elle, annoncées comme faisant partie de l'étape. À l'écran : « 5 vannes sélectionnées pour ce module. Découvre-les dans le catalogue », lien vers la liste générale.
- **Effet** : la personne doit retrouver elle-même 5 vannes parmi des centaines ; un non-abonné n'en voit que 10 en liste. La vanne « à pratiquer » est justement le support de l'exercice (c'est ce qu'on répète à voix haute).
- **Ce qu'on fait** : afficher les 5 vannes (texte et décryptage) dans l'étape, comme les vidéos. **D'abord vérifier** que les 5 numéros du seed pointent vers des vannes actives : le catalogue a été réduit le 30/09 (décision : 125 vannes validées, le reste en soft delete) et les numéros du seed vont jusqu'à 343 ; un numéro retiré donnerait un trou.
- **Détail technique et preuve** : `JokeTeaser` (`parcours-detail.tsx:244-262`) : compte + lien `/vannes`, rien d'autre ; `jokeIds` du seed jusqu'à 343 ; `premium-benefits.tsx:34-36` promet « ses vannes ». **Non vérifié** : correspondance des `jokeIds` avec les vannes actives (requête en lecture sur `Joke` à lancer).
- **Agent / effort** : @qa (vérification des numéros) puis @fullstack ; rapide à moyen.

### PM-05 [P1] (C12) Deux rythmes annoncés, durée réelle inconnue
- **Problème** : les parcours disent « 15 à 20 min par semaine », la FAQ et le pilier disent « 5-10 minutes par jour ». Une étape contient un conseil, un exemple, un exercice, 5 vannes, 2 vidéos et 4 à 5 questions ; la durée n'a jamais été mesurée, et l'étape 6 de Confiance propose un spectacle complet.
- **Effet** : la personne qui prend le message « chaque jour » trouve un programme hebdomadaire ; celle qui prend « 15 minutes » peut passer 30 à 45 min sur une étape et se sentir en retard.
- **Ce qu'on fait** : (1) mesurer la durée réelle (K14) ; (2) réconcilier les deux messages en découpant l'étape en 2 ou 3 micro-pratiques réparties dans la semaine (cela donne aussi le rythme de PM-01) ; (3) corriger les textes seulement après (le « 15 à 20 min/semaine selon le parcours » est un [CHOIX UTILISATEUR], intouchable sans GO).
- **Détail technique et preuve** : `faqs.ts:24`, `config/premium.ts:70-74`, `parcours-seed.json` (`timePerWeek`, `videos`, `moduleFormat`) ; pas d'horodatage début/fin d'étape ; durée des vidéos non relevée.
- **Agent / effort** : @data-analyst (mesure), @copywriter, @fullstack ; moyen.

### PM-06 [P1] (C12, C8) « Progression mesurable » veut dire « étapes cliquées »
- **Problème** : valider une étape = un clic. Le quiz est non bloquant et « ne compte pas », l'exercice est un texte lu, il n'y a aucun retour sur « as-tu essayé, ça a marché ? ». Le maximum d'XP des 3 parcours (1 600) ne dépasse que d'un cheveu le niveau « Comique » (1 500) ; un parcours seul donne 325 à 800 XP, soit « Apprenti » ou « Farceur ».
- **Effet** : ce que la personne voit progresser, c'est un compteur, pas sa répartie. Le critère qui compte (K15 : j'ai osé la réplique en vrai) n'existe pas dans le produit ; pour Yanis, la récompense de fin de parcours est mince.
- **Ce qu'on fait** : un retour d'exercice en 3 boutons à la fin de chaque étape (F4) ; un bilan de fin de parcours qui reprend ce que la personne a dit avoir essayé (F5) ; recaler niveaux et badges après mesure (F12). Pas de correction par IA au fil de l'eau ([CHOIX] 01/10).
- **Détail technique et preuve** : `parcours-detail.tsx:169` (« ce quiz ne compte pas »), `:773-784` (validation = POST sans contenu), `api/parcours/[id]/progress/route.ts:107-199` (XP du seed + 100 de bonus) ; barème `docs/content/progression-levels.md` (code des niveaux non relu).
- **Agent / effort** : @product-manager (stories), @ux, @fullstack ; moyen.

### PM-07 [P1] (C8) Fin de parcours : une suite figée, parfois déjà faite, et pas de bilan
- **Problème** : la fin affiche « Bravo », l'XP et un bouton « Passer au parcours suivant » dont la cible est inscrite dans le parcours : Machine à Café mène à Répartie, Répartie à Confiance, **Confiance à Machine à Café**. Une personne qui a fait les trois voit « Ton style est là. Le parcours Machine à Café te donne de quoi le faire vivre » pour un parcours qu'elle a déjà fini. Il n'y a ni récapitulatif, ni suite personnalisée.
- **Effet** : la fin du parcours, moment de plus forte fierté et de décision de continuer (ou de résilier), est une impasse ou une boucle.
- **Ce qu'on fait** : suite = premier parcours non commencé ; sinon bilan et annonce du prochain parcours ; bilan avec récap (F5, F7). Pas de certificat (F6, NO-GO).
- **Détail technique et preuve** : `parcours-seed.json:15-16,177-178,392-393` ; `parcours-detail.tsx:821-851`.
- **Agent / effort** : @fullstack + @copywriter ; rapide (suite) à moyen (bilan).

### PM-08 [P1] (C7, mesure) Seuls 3 critères de succès sur 15 se lisent dans Umami
- **Problème** : on ne sait pas combien de gens ouvrent une étape, la lisent, finissent le quiz, valident, reviennent. Les seuls événements « parcours » sont `parcours-etape` (validation, donc Premium seulement) et `mur-vu` (depuis le 07/10). Aucun événement pour : parcours ouvert, étape ouverte, quiz terminé en tant que visiteur, parcours terminé, clic sur une pastille du hero. Aucune date par étape en base.
- **Effet** : impossible de dire si une modification améliore ou dégrade quoi que ce soit, ni de juger les seuils du §3.
- **Ce qu'on fait** : poser 6 événements (voir handoff) et une section « Parcours » dans le rapport du lundi ; ajouter la date à chaque étape validée en base ; lancer les requêtes en lecture sur la progression (K7, K8, K10, K11) maintenant, même sur 2 abonnés.
- **Détail technique et preuve** : `lib/umami.ts:21-37` (liste des événements attribués) ; `parcours-detail.tsx:95,403` ; `parcours-content.tsx:190-192` (clic « Commencer » sans événement) ; snapshot du 05/10 §1 et §4.
- **Agent / effort** : @data-analyst (plan de mesure), @fullstack ; rapide à moyen.

### PM-09 [P1] (C7) Le volume d'entrée est très loin de ce que l'objectif de revenus demande
- **Problème** : les parcours sont la valeur principale, mais ils reçoivent 62 vues de pages en 90 jours (environ 21 par mois ; 35 sur les 3 pages parcours, soit environ 12 par mois). L'objectif de 1 000 € de revenus mensuels demande environ **335 abonnés mensuels** (1 000 / 2,99) ou 481 abonnés annuels (1 000 / 2,08).
- **Effet** : même avec une très bonne conversion au mur, l'offre ne peut pas porter l'objectif. À 3 % [HYPOTHÈSE : seuil K6] de conversion, il faut environ 11 200 personnes devant le mur sur 6 mois, soit environ 1 860 par mois, entre **90 et 155 fois** le volume actuel (selon qu'on compte le hub `/parcours` ou seulement les 3 pages parcours).
- **Ce qu'on fait** : faire de l'étape 1 de chaque parcours **le produit d'appel** : depuis chaque article qui répond à un besoin de persona (le maillage article vers parcours existe, `blog-article-parcours-maillage.tsx`), renvoyer vers l'étape 1 du bon parcours. Suivre K1 chaque lundi. Ce point relève de l'attraction (C3, autres agents) ; il est ici pour cadrer les seuils.
- **Détail technique et preuve** : `docs/analytics/snapshot-trafic-2026-10-05.md` §4 (vues 90 j) ; `docs/marrant/audit-note-s15.md` §2 (51 % des entrées sur un seul article, 92 % de rebond).
- **Agent / effort** : @growth + @seo + @ux ; moyen.

### PM-10 [P1] (C1) Couverture des personas inégale, et le parcours Confiance mélange deux publics
- **Problème** : un parcours par persona, mais Sophie n'a que 45 min (3 étapes), et l'étape 3 de Confiance (« L'humour de trentenaire : MSN, K7 ») est hors cible pour Yanis, qui est pourtant invité à ce parcours par la suite par défaut.
- **Effet** : une personne sur trois voit un contenu qui ne lui parle pas ; Marc, qui réclame « profondeur » et « recommandations personnalisées », n'a pas de parcours de suite écrit pour lui.
- **Ce qu'on fait** : voir matrice §6. Storytelling d'abord (12/15), Pro ensuite (9/15) ; suite personnalisée (F7) ; question à Thomas sur l'étape 3.
- **Détail technique et preuve** : `parcours-seed.json:491-538` (étape 3 de Confiance) ; `project-context.md` (frictions des personas).
- **Agent / effort** : @product-manager (specs), @copywriter ; long.

### PM-11 [P2] (C7) Le quiz d'orientation de /parcours ignore la vraie difficulté si on répond « partout »
- **Problème** : question 1 « Partout, je veux retrouver ma légèreté » + question 2 « Je ne sais pas quoi répondre sur le moment » donne **Confiance** (6 semaines), pas Répartie. La première réponse écrase la seconde. Dans l'onboarding, c'est l'inverse : l'objectif prime sur le contexte.
- **Effet** : une personne comme Yanis qui répond « partout » à la première question est orientée vers le plus long parcours, pas celui qui répond à son blocage.
- **Ce qu'on fait** : la difficulté précise (question 2) passe avant le contexte (question 1) sauf si elle vaut « confiance » ; aligner les deux quiz.
- **Détail technique et preuve** : `parcours-orientation.ts:20-40` (priorité `confiance` ou `global`, puis `repartie` ou `social`), `parcours-content.tsx:25-42` (questions).
- **Agent / effort** : @fullstack ; rapide.

### PM-12 [P2] (C12) La FAQ présente la série et l'XP comme acquises pour tous
- **Problème** : « Avec le système de streaks et d'XP, tu gardes la motivation sur la durée » est dans la FAQ publique ; ces fonctions sont réservées aux abonnés, et la série compte les connexions, pas la pratique.
- **Effet** : une personne attirée par la promesse découvre après paiement que la série tombe si elle ne se connecte pas un jour, sans rappel.
- **Ce qu'on fait** : après F2, ajuster la phrase (« avec Premium », rythme conseillé) via étalon validé. Les chiffres de la FAQ (« 8 semaines », « 50 XP par semaine ») restent intacts.
- **Détail technique et preuve** : `faqs.ts:45` ; `docs/product/suppression-compte-gratuit-s15.md` §1.1.
- **Agent / effort** : @copywriter (étalon) ; rapide.

## 8. Vérifié / Non vérifié (G_PROOF)
(à remplir)

## 9. Handoff
(à remplir)
