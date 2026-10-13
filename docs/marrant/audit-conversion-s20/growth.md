# Audit CONVERSION s20, angle @growth (13/10/2026)

Périmètre : visiteur vers paiement Premium (modèle sans compte gratuit, [CHOIX UTILISATEUR] du 05/10). Sources : `donnees/umami-28j.json` (15/09 au 12/10), `donnees/base-conversion.json`, `donnees/texte-*.txt`, captures 375 px, `docs/founder-preferences.md`, `docs/marrant/audit-note-s15.md`. Persona de calibrage : Yanis (20 ans, muet quand on le chambre). Barème s15 repris : 10 = référence pour un site de cette taille, 7 = bon, 5 = freine, 3 = bloque, 1 = absent.

## 1. Verdict

- **CONVERSION globale : 4,3 / 10** (s15 : 2,8). Le gain est un gain de capacité (tunnel réparé, mesuré, offre claire), pas de résultat : **0 payant organique à 2,99 € sur 28 jours** et un MRR inchangé à 1,98 €.
- **Le goulot n'est pas la page de paiement (G4 = 7/10), c'est l'exposition** : 0,9 à 2,3 % des visiteurs voient une offre (abonnement-vu 6, mur-vu 16 pour 683 visiteurs), et rien ne rattrape les autres (G6 = 1,5/10).
- **Maillon AARRR le plus faible : Activation.** Le visiteur de l'article n°1 (≈ 58 % des entrées) lit 50 vannes gratuites, ne rencontre aucun produit avant le bas d'une page de ≈ 14 500 px mobile, puis part (385 sorties pour 404 vues, 95 %).
- Conclusion de méthode : on ne polit pas `/abonnement` (19 vues en 28 j) avant d'avoir créé les moments où un visiteur éprouve la valeur. Aucune dépense payante : conversion non prouvée, budget acquisition 0 €.

## 2. Ce que disent les chiffres

### 2.1 Entonnoir réel (Umami, 28 j)

| Étape | Volume | Lecture |
|---|---|---|
| Visiteurs / visites | 683 / 803 | US 59 + CN 53 = 112 (16 %), probablement hors cible [HYPOTHÈSE] ; FR 435 (64 %) |
| Rebond | 597 sur 803 (74 %) | 91 % sur les 28 j précédents (607 sur 666) : net progrès |
| Durée par visite | 62 s (49 649 / 803) | 32 s avant (21 026 / 666) |
| Article n°1 | 397 entrées, 404 vues, 385 sorties | 95 % des vues sont une sortie |
| Pages parcours | 35 vues sur 1 166 (3 %) | `/parcours` 16, Machine à Café 9, Confiance 5, Répartie 5 |
| `mur-vu` | 16 | 2,3 % des visiteurs ; `/vannes` = 57 vues |
| `abonnement-vu` | 6 | `/abonnement` 19 vues dont 9 entrées directes : écart non expliqué |
| `abonnement-clic` | 5 | 5 sur 6 |
| `inscription-envoi` puis `-reussie` | 3 puis 2 (1 échec) | 5 comptes créés en 28 j en base : écart 5 contre 2 non expliqué |
| `abonnement-reussi` | 1 | 3 retours depuis checkout.stripe.com pour 1 paiement |
| Payants actifs à 2,99 € | **0** | |

- **Le paiement du 07/10 est très probablement le test d'achat réel D1 de Thomas** (project-context, s16 : « achat réel D1 validé, remboursement, résiliation auto » ; abonnement 2,99 € créé et annulé le 07/10 dans `base-conversion.json`). [HYPOTHÈSE à confirmer par Thomas]. Même chose probable pour une partie des 15 vues `/abonnement` de la semaine du 05/10 (rapport du lundi) : l'exclusion des 3 comptes de Thomas des funnels n'est pas confirmée.
- Tous les taux d'étape ci-dessus reposent sur n ≤ 16 : ils indiquent l'absence de fuite visible, pas un taux.
- Le dossier ne dit pas si les événements comptent des occurrences ou des visiteurs uniques.

### 2.2 Économie unitaire (obligatoire)

- **CAC cash = 0 €** (budget acquisition 0 €, 100 % organique). LTV:CAC non défini : la contrainte n'est pas le coût, c'est le volume et l'exposition. Aucun canal n'a CAC > LTV, aucun n'est exclu ; **paiement publicitaire : NON** tant que la conversion visiteur vers payant n'est pas mesurée hors comptes de test (reprise d'évaluation à ≥ 30 clics `abonnement-clic` hors Thomas).
- **ARPU** : 2,99 € TTC/mois (≈ 2,49 € HT si TVA 20 % [HYPOTHÈSE de taux]) ; annuel 24,99 € TTC = 2,08 €/mois.
- **Churn** : aucune donnée (les 2 abonnés à 0,99 € sont actifs depuis le 18/03 et le 14/08 ; l'abonnement à 2,99 € a vécu 0 jour). **LTV = 2,99 × 1/churn** ; avec [HYPOTHÈSE sans source : churn 8 %/mois, fourchette 5 à 10 %] LTV ≈ 37 € TTC (30 à 60 €). La recherche RevenueCat 2026 n'a fourni aucun chiffre de churn pour l'éducation : à recalculer sur données réelles. Payback : immédiat (CAC cash 0).
- **Benchmark de conversion** : Piano (déc. 2024, éditeurs de presse payante) donne ≈ 0,20 % visiteur vers payant, Europe 0,15 % [HYPOTHÈSE : proxy, aucun benchmark éducation grand public trouvé]. À 683 visiteurs, ce benchmark donne ≈ 1 payant par 28 j : **le site est déjà au niveau d'un benchmark de presse, le poli de page ne suffira pas**.
- **Arithmétique de l'objectif** (1 000 € de MRR = 335 abonnés mensuels, ou 481 annuels) : à 1 % de conversion il faut ≈ 33 500 visiteurs cumulés, soit ≈ 5 600/mois sur 6 mois (×8 le trafic actuel) ; à 0,2 %, ×41. Lecture : **la conversion et le trafic doivent progresser ensemble** ; ce n'est pas un verdict GO/NO-GO (valeur persona, CLAUDE.md n°5), c'est la répartition de l'effort.

| Canal (28 j) | Visites | CAC cash | Payants attribués | Lecture |
|---|---|---|---|---|
| Google | 402 + 4 (google.fr) | 0 € | 0 prouvé | quasi tout sur l'article n°1 |
| Autres moteurs (Bing 50, DDG 13, Ecosia 12, Yahoo 6, Qwant 3) | 84 | 0 € | 0 prouvé | |
| Assistants IA (chatgpt.com) | 3 | 0 € | 0 | trop faible pour juger |
| Réseaux (t.co) | 1 | 0 € | 0 | relance J0 le 12/10 : trop tôt, indicateur avancé à 90 j |

Attribution d'un paiement à une page impossible aujourd'hui (propriétés des événements non fournies dans le dossier) : c'est l'action 7.

## 3. Notes par critère, avec preuves

| Critère | Note /10 | Raison en une ligne |
|---|---|---|
| G1 Proposition de valeur et offre | **6,5** | Douleur de Yanis nommée, prix et gratuit/payant clairs ; 3 pitchs différents selon la page |
| G2 Blog vers produit (article n°1) | **3,5** | Un seul bloc produit, tout en bas ; 95 % de sorties |
| G3 Moments de bascule | **4,0** | Murs lisibles mais placés là où il n'y a pas de trafic ; bascule étape 1 non mesurée |
| G4 `/abonnement` et tunnel | **7,0** | Réassurance complète, 2 étapes annoncées ; aucune fuite visible mais n minuscule |
| G5 Preuve et confiance | **4,0** | Garantie 14 jours et vignettes honnêtes ; aucun extrait réel du payant |
| G6 Capture des non-acheteurs | **1,5** | Aucun e-mail, aucune relance, 74 % de rebond |

### G1, 6,5 : ce qu'on paie est lisible, le message n'est pas unique
- Pour : hero accueil « Tu restes muet quand on te chambre ? » (texte-accueil l.7), CTA « Accéder aux parcours complets » + « 2,99 €/mois, sans engagement. La première étape de chaque parcours reste en lecture libre. » (l.11 à 13). `/abonnement` l.24 : « au lieu de 10 vannes, 3 conseils et 3 vidéos sans abonnement » ; l.18 : 5 parcours, 15 à 20 min/semaine.
- Contre : trois pitchs. Le mur de `/vannes` vend « tout le catalogue, les filtres et les favoris » (texte-vannes l.19), `/abonnement` vend les parcours, la fiche vidéo vend « l'analyse pédagogique complète » (texte-video-fiche l.21 à 25). Le fondateur place la valeur dans les parcours et pas dans le volume de vannes (founder-preferences 06/05).
- Contre : le H1 de `/abonnement` décrit un accès, pas un résultat ; 2 puces sur 4 sont de l'inventaire (listes « 140+ vannes, 120+ conseils »). La promesse de transformation n'existe que dans les vignettes de `/parcours`.

### G2, 3,5 : l'article n°1 donne tout et ne propose rien avant la fin
- Premier écran mobile (capture article-blagues-2026-mobile-ecran1) : titre, auteur, intro, 7 ancres de sections ; aucun lien produit. Les liens de l'intro mènent vers du gratuit (blague du jour, catalogue, pilier).
- Seul bloc produit : « Passer à Premium / Lire la première étape d'un parcours » (texte l.209 à 212) et la carte Machine à Café (l.243 à 255), après la FAQ et « À lire ensuite » (capture tranche09 : environ 14 500 px de défilement sur 375 px).
- Les chiffres : 404 vues, 385 sorties ; `blog-sortie-clic` 10 et `blog-ancre-clic` 4 sur **tout** le blog ; `blog-scroll` 201 (seuil non documenté) ; aucun `blog-cta-clic` dans la liste des événements 28 j (0 ou renommé : à vérifier, l'objectif s15 était ≥ 3 % des entrées). Deuxième article d'entrée `phrases-droles-conversations` : 51 entrées, 51 sorties.
- Désaccord d'intention : la requête « meilleures blagues 2026 » veut des blagues à copier, déjà toutes données gratuitement (la page dit « Les vannes de cette page restent en accès libre », l.212). Ce qu'on peut vendre est autre chose, et la page le dit déjà : « Tu les as lues. Reste à les sortir pour de vrai. » (l.205). Ce moment est en bas, pas dans le fil.
- Persona : la carte finale propose Machine à Café (Sophie). Yanis (soirée, chambrage) est servi par Répartie, absent de la page. Progrès depuis s15 (S9 2,7) : le bloc bas existe, rebond global 91 % vers 74 %.

### G3, 4,0 : de bons murs, au mauvais endroit
- Pour : `/vannes` « Aperçu gratuit : 10 vannes accessibles sans abonnement » (l.17), 4 « Débloquer », « 134 vannes supplémentaires » (l.131) ; fiche vidéo « Les points clés et l'exercice de cette vidéo font partie de Premium. » + « Voir Premium » (l.23 à 25) ; la première étape de chaque parcours est un vrai aperçu ; `mur-vu` 16 devient `abonnement-vu` 6 (37 %).
- Contre : `/vannes` pèse 57 vues (4,9 % des pages vues) et les fiches ≤ 2 entrées chacune, alors que 404 vues sont sur un article sans mur. Les murs vendent le volume (cf. G1) et pas un moment de besoin.
- Contre : aucun événement `parcours-*` dans l'export 28 j alors que 5 parcours sont en ligne (s17 l'avait déjà noté : 0 reçu) ; la bascule étape 1 vers Premium n'est pas mesurable. La page étape 1 n'est pas dans le dossier : **non notée, à capturer**.
- Accueil : la vanne du jour avec « Révéler la chute » est un bon déclencheur d'envie d'apprendre, sans passerelle.

### G4, 7,0 : page propre, goulot ailleurs
- Pour : « ÉTAPE 1 SUR 2 » et « Étape 2 : le paiement sécurisé, juste après. » (texte-register l.3, l.18) ; prix TTC, 14 jours, résiliation répétés sur `/abonnement` l.27, `/register` l.20, accueil l.140 ; « Droit de rétractation · Paiement sécurisé par Stripe » (l.29) ; « Pas encore sûr ? Lis d'abord une étape » avec 5 liens (l.31 à 39) ; FAQ de 8 questions dont « C'est quoi la différence avec juste regarder des vidéos YouTube ? » et « timide ou introverti ? » ; bascule mensuel/annuel ; Google proposé en option.
- Les chiffres : `abonnement-vu` 6, `abonnement-clic` 5, `inscription-envoi` 3, `-reussie` 2, `abonnement-reussi` 1. Aucune fuite lisible, mais n ≤ 6 : la note juge la qualité de la page, pas une conversion prouvée.
- Points ouverts : état « Annuel » non capturé (affiche-t-il 2,08 €/mois ?) ; réponses de FAQ repliées, non fournies ; 3 retours checkout.stripe.com pour 1 paiement sans événement d'annulation ; `/abonnement/success` (4 vues) non capturée.

### G5, 4,0 : honnête, mais on ne voit jamais le produit payant
- Pour : vignettes « Imagine Léa / Tom / Julien / Samir / Anouk » (texte-parcours), présentées comme exemples (conforme au [CHOIX] du 29/09) ; remboursement 14 jours ; « Pas de frais cachés, pas de piège » (abonnement l.43).
- Contre : le carnet mensuel est décrit (l.20), jamais montré ; aucune étape payante, même partielle, sur `/abonnement`. Aucun avis réel n'existe dans le dossier : rien à afficher, rien à inventer.
- À vérifier : les compteurs « Je veux ça ! » 47 / 34 / 62 / 21 (accueil l.167 à 191), origine non documentée (votes réels ou valeurs initiales ?). Si ce sont des valeurs initiales, c'est une preuve sociale fabriquée, à aligner sur la base. Rien dans le dossier ne permet de trancher. « 1 500+ » : [CHOIX UTILISATEUR], hors périmètre de cet audit.

### G6, 1,5 : 97 % des visiteurs repartent sans lien avec nous
- Aucun champ e-mail pour un non-acheteur dans les 6 pages lues ; promesse de newsletter retirée le 01/10 « en attendant une newsletter mensuelle préparée » (founder-preferences) ; pas de compte gratuit ([CHOIX]).
- 597 visites sur 803 à une seule page (74 %) ; part de visiteurs revenants absente du dossier (manque).
- Le quiz (texte article l.182, « sans inscription ») est le seul dispositif interactif ouvert : `quiz-termine` 1 pour 8 vues `/quiz-humour`, sans sortie e-mail ni retour programmé.
- Réseaux ≈ 0 visite (t.co 1) : pas de canal de retour avant l'effet de la relance (J0 le 12/10).

## 4. Note globale et comparaison avec s15

- **CONVERSION = 4,3 / 10** (moyenne des six notes : 4,4 ; pondération 2 pour G2 et G3, qui gouvernent l'exposition : (6,5 + 7 + 8 + 7 + 4 + 1,5) / 8 = 4,25). **s15 : 2,8** consolidé (growth seul : 3,2). Écart : +1,5 (+1,1 en growth seul). Grilles différentes (s15 : 5 sujets de conversion, ici 6 critères) : comparaison d'ordre de grandeur.
- **Ce qui a changé** : `/register` 0 vue en 180 j, aujourd'hui 14 vues, 6 entrées directes, 15 vues `/login` ; événements du funnel présents (0 en s15) ; prix TTC, 14 jours, résiliation, annuel 24,99 € ; paiement réel validé le 07/10 après correction du SDK Stripe (aucun paiement possible du 30/09 au 07/10) ; 5 parcours avec première étape gratuite ; rebond 91 % vers 74 %, durée 32 vers 62 s, pages vues +46 % (799 vers 1 166), visiteurs +19 %.
- **Ce qui n'a pas changé** : article n°1 sans passerelle avant le bas ; aucune capture e-mail ; MRR 1,98 € ; 0 payant organique.
- G6 (1,5) est plus bas que S12 s15 (3,7) car l'objet diffère (capture de non-acheteurs, pas rétention d'abonnés) : pas une régression.

## 5. Sept actions

Classées par valeur pour Yanis puis impact attendu sur la conversion (pas par effort : calibrage vélocité IA). Textes à calibrer sur étalons avec Thomas avant tout brief copywriter (P0 s8), relecture à l'aveugle avant mise en ligne (règle d'or). Cibles = [HYPOTHÈSE], à recaler à J+30 sur données réelles. Indicateurs jugés à 30 jours (clics) puis 90 jours (payants).

### Action 1. Passerelles en contexte dans l'article n°1 (G2, G3)
- **Page** : `/blog/meilleures-blagues-droles-2026` (slug inchangé, [CHOIX] 28/09), via le gabarit blog.
- **Changement** : 2 blocs dans le fil, sans fenêtre surgissante, barre collante ni compte à rebours. Après la vanne 8 (fin « Soirée ») : lien vers la première étape gratuite de **Répartie** (l'angle de Yanis : une bonne vanne ne sert à rien si on reste muet quand on te chambre). Après la vanne 16 (fin « Bureau ») : **Boulot**. Pas de prix dans ces blocs (étape gratuite seulement), le prix reste dans le bloc final, où Répartie s'ajoute à Machine à Café. Ton « on offre, on n'impose pas » (founder-preferences 06/05).
- **Indicateur Umami** : `blog-sortie-clic` (le plus proche de l'ancien `blog-cta-clic`, correspondance à confirmer) avec propriété `position` (milieu-1, milieu-2, fin). Baseline : 10 clics sur tout le blog. Cible : ≥ 3 % des entrées de l'article (≈ 12 clics/28 j, objectif s15) à J+28 ; taux de sortie de l'article sous 90 % (95 % aujourd'hui) ; vues `/parcours/*` en hausse (35 aujourd'hui).

### Action 2. Lettre mensuelle sur e-mail seul (G6)
- **Pages** : fin de l'article n°1 (après la FAQ), résultat du quiz humour, bas de l'accueil.
- **Changement** : un champ e-mail, promesse précise (« Une situation de répartie par mois : ce qu'on te dit, la réplique, pourquoi elle marche. Rien d'autre. »), double confirmation, désinscription en un clic. Contenu préparé par lot trimestriel et relu à l'aveugle (aucune génération au fil de l'eau, [CHOIX] 01/10), envoi planifié par Resend, une ligne discrète vers un parcours en pied. Le carnet complet reste Premium.
- **Compatibilité** : pas de compte, pas de palier gratuit, aucun accès ajouté ou retiré ; applique la ligne du 01/10 (« newsletter mensuelle préparée »). **Go de Thomas à demander** (nouveau canal e-mail).
- **Indicateur Umami** : nouveaux événements `lettre-inscription` et `lettre-confirmee`. Baseline : 0. Cible : 1 à 2 % des entrées article (4 à 8 par 28 j), puis à J+90 `abonnement-reussi` avec `src=lettre`. Un canal composé se juge sur les inscrits à 90 jours, pas sur le revenu du premier mois.

### Action 3. Fin de l'étape 1 gratuite = démonstration et bascule (G3, G1)
- **Pages** : étape 1 des 5 parcours (non fournie au dossier : capturer d'abord).
- **Changement** : en bas de l'étape 1, montrer ce que contient l'étape 2 (titre du conseil, la vidéo, le défi, durée, XP), un seul CTA vers Premium, rappel « 2,99 € TTC par mois, remboursé sous 14 jours ». Si l'aperçu visiteur de s17 le fait déjà, ne rien ajouter : mesurer.
- **Indicateur Umami** : `parcours-etape-vue` (étape 1) puis `abonnement-clic` avec `src=parcours-etape-1`. Baseline : aucun événement `parcours-*` dans l'export (tracking muet ou absent : à confirmer). Cible : ≥ 5 % des vues d'étape 1 cliquent vers `/abonnement` à J+30.

### Action 4. Murs alignés sur la valeur parcours (G1, G3)
- **Pages** : mur de `/vannes`, murs des fiches vannes, conseils, vidéos.
- **Changement** : remplacer « tout le catalogue, les filtres et les favoris » et « 134 vannes supplémentaires » par le geste enseigné : « 10 vannes pour lire, 5 parcours pour apprendre à les sortir ». CTA principal « Lire la première étape gratuite », secondaire « Voir Premium ». Pas de compteur de limite ni de culpabilisation (founder-preferences 06/05 : pas de « T'as touché la limite »).
- **Indicateur Umami** : `mur-vu` vers `abonnement-vu` (6/16 = 37 %) ; nouvel événement `mur-clic` avec `cible` (étape 1 ou Premium). Cible : ≥ 50 % de passage mur vers `/abonnement` ou étape 1 à J+30.

### Action 5. `/abonnement` : montrer le payant, promettre le résultat (G1, G5)
- **Page** : `/abonnement`.
- **Changement** : (a) sous le H1, la promesse déjà validée de Répartie (« personne ne te demande d'être brillant, juste de ne plus rester muet ») ; (b) un extrait réel d'une fiche du carnet (~100 mots : situation, phrase reçue, réplique, pourquoi, sortie polie, exercice), fiche passée à l'aveugle ; (c) un aperçu de l'étape 2 (titre et défi) ; (d) afficher « soit 2,08 €/mois » quand « Annuel » est choisi (si absent). Aucun avis inventé.
- **Indicateur Umami** : `abonnement-clic` ÷ `abonnement-vu` (5/6, gonflé par les tests). **Illisible sous 30 `abonnement-vu` hors comptes de Thomas** (19 vues/28 j aujourd'hui) : à livrer maintenant, à juger après les actions 1 et 2. Ajouter `abonnement-scroll` (profondeur).

### Action 6. Passerelle généralisée aux articles par cluster (G2)
- **Pages** : les 34 articles ; priorité `phrases-droles-conversations` (51 entrées, 51 sorties), `exercices-developper-humour` (19), `citation-drole` (8).
- **Changement** : un champ `parcoursCible` par cluster (répartie ou moqueries vers Répartie ; bureau ou machine à café vers Machine à Café ou Boulot ; timidité ou rester muet vers Confiance ; raconter vers Storytelling ; blagues génériques vers quiz + Répartie), rendu automatique par le gabarit de l'action 1. Aucune saisie manuelle par article.
- **Indicateur Umami** : `blog-sortie-clic` par slug ; taux de sortie de `phrases-droles-conversations` 51/63 vues (81 %) vers moins de 70 % à J+30.

### Action 7. Mesure de preuve, livrée avec l'action 1 (prérequis, < 24 h)
- **Pages** : événements du tunnel, rapport du lundi.
- **Changement** : (1) propriétés `src` et `page` sur `abonnement-vu`, `abonnement-clic`, `inscription-envoi`, `abonnement-reussi` pour attribuer un paiement à une page ; (2) exclure les 3 comptes de Thomas des événements et du rapport (en attente depuis s17) ; (3) événement d'annulation au retour de Stripe sans paiement (3 retours pour 1 paiement) ; (4) expliquer `abonnement-vu` 6 contre 19 vues `/abonnement` ; (5) confirmer que les `parcours-*` arrivent ; (6) visiteurs nouveaux contre revenants dans le rapport.
- **Indicateur Umami** : les propriétés apparaissent dans l'export à J+7 ; le rapport du lundi sort le funnel par page d'origine. Sans cela, aucun ROI par action n'est démontrable.

### Séquence et seuils de coupe
- Jour 0 : actions 1 et 7 ensemble (gabarit blog, premier levier < 24 h). Puis 4, 3, 6, 2 (go de Thomas), 5.
- J+30 : un bloc sous 1 % de clic = revoir le texte avant d'ajouter des blocs. J+90 : jugement sur les payants attribués et les inscrits à la lettre ; rien n'est dépensé en publicité avant ≥ 30 clics `abonnement-clic` hors Thomas.

## 6. Choix fondateur respectés (rien de ce qui précède n'y touche)
Pas de compte gratuit ; prix 2,99 € / 24,99 € TTC ; plafonds visiteurs 10 / 3 / 3 inchangés ; « 1 500+ » intact ; pas de photo ni d'identité du fondateur ; aucun faux témoignage, aucune urgence, fenêtre surgissante ou barre collante ; humoristes cités conservés ; slug de l'article n°1 conservé.

## 7. Manques de données (rien inventé)
- Propriétés des événements ; visiteurs nouveaux contre revenants ; part de bots (CN 53, US 59 non qualifiés).
- Texte et capture de l'étape 1 de chaque parcours, de `/abonnement/success`, de `/abonnement` en mode Annuel, réponses de FAQ repliées.
- Écart 5 comptes créés contre 2 `inscription-reussie` ; requête `onboardingCompleted` en erreur dans `base-conversion.json` (colonne inexistante), onboarding non lisible.
- Origine des compteurs « Je veux ça ! » ; confirmation par Thomas que le paiement du 07/10 est son test ; churn réel (aucune donnée).

## 8. Sources externes
- [Piano, benchmark d'abonnement 2025 (visiteur vers payant ≈ 0,20 %, Europe 0,15 %)](https://nynewspapers.com/wp-content/uploads/2025/04/Mar2025_NYPA_Benchmarks_Belyus.pdf), proxy presse, pas éducation.
- [RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps) : aucun chiffre de churn éducation obtenu.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/marrant/audit-conversion-s20/growth.md` ; CONVERSION 4,3/10 (s15 : 2,8), goulot = exposition (G2 3,5, G3 4, G6 1,5) et non la page de paiement (G4 7).
- Décisions prises : 7 actions (passerelles article n°1, lettre mensuelle e-mail seul, fin d'étape 1, murs alignés, `/abonnement` avec extrait réel, généralisation par cluster, mesure) ; PLG sans compte gratuit conservé, aucun paiement publicitaire avant ≥ 30 clics hors Thomas.
- Points d'attention : go de Thomas pour la lettre (action 2) ; confirmer que le paiement du 07/10 est son test et exclure ses 3 comptes ; trafic ×8 nécessaire en plus de la conversion pour 1 000 € de MRR.


