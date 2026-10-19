# Concision des blocs d'appel : inventaire, règles, 6 étalons (à valider par Thomas)

> Statut : PROPOSITION. Rien n'est branché ni réécrit en bloc (règle P0 s8 : étalons d'abord). Textes du jour lus dans `apps/web/src/config/textes/`, `components/` et `app/` (worktree) et dans `textes-finaux-valides.md` / `textes-valides-boutons.md`.
> Cause : nos relectures à l'aveugle notaient l'envie de payer sans compter les mots. Chaque tour a gagné en ajoutant un fait pour lever une objection. Résultat : des blocs qui répondent à tout, que personne ne lit.

## 1. Inventaire (parcours d'achat complet, du plus long au plus court)

Comptage : mots séparés par un espace ; « · » non compté ; un montant (« 2,99 € », « 2,99 €/mois ») et « 1 500+ » = 1 mot ; valeurs du jour, annuel affiché, Répartie par défaut. **Boutons** = bouton plein + bouton contour ; liens et notes comptent dans « hors bouton ». Barème (hors bouton) : OK ≤ 25 · trop long 26 à 50 · pavé > 50.

| # | Surface | Où (profil) | Total | Hors bouton | Verdict |
|---|---|---|---|---|---|
| 1 | **Page /abonnement, entière** (hors FAQ et fiche du carnet) | Visiteur | 316 | 311 | pavé (détail §2) |
| 2 | **Page /abonnement, entière** (hors FAQ et fiche du carnet) | Compte sans abonnement (E3 + le reste) | 314 | 309 | pavé |
| 3 | B4+B5 carte Premium (dont 110 mots d'avantages) | Accueil (visiteur) | 260 | 250 | pavé |
| 4 | E1 paywall du carnet (dont 110 mots d'avantages) | /carnet (compte sans abonnement) | 182 | 176 | pavé |
| 5 | E-mail de confirmation / bienvenue (hors formulaire légal annexé) | Après paiement | 158 | n/a | pavé légal (§3, point 6) |
| 6 | B2 fin d'article | Articles (visiteur) | 145 | 140 | pavé |
| 7 | B12 résultat du quiz d'humour | Quiz (tous) | 120 à 142 | 113 à 135 | pavé (le plus long : L'Absurde) |
| 8 | B7 murs de liste | /vannes, /conseils, /videos (visiteur) | 121 à 123 | 104 à 106 | pavé |
| 9 | B8 fiche vanne | Fiche (visiteur) | 121 | 106 | pavé |
| 10 | B13 résultat du quiz d'orientation | Compte sans abonnement | 117 | 112 | pavé |
| 11 | B10 fiche vidéo | Fiche (visiteur) | 117 | 102 | pavé |
| 12 | E5 fin de /glossaire | Visiteur, sans abonnement | 114 | 109 | pavé |
| 13 | **Composant « 4 avantages »** (`PremiumBenefits`) | Répété sur /abonnement, accueil, /carnet | 110 | 110 | pavé (×3 surfaces) |
| 14 | B9 fiche conseil | Fiche (visiteur) | 110 | 93 | pavé |
| 15 | E6 fin de /a-propos | Visiteur, sans abonnement | 100 | 95 | pavé |
| 16 | B14 fin d'étape 1 | Parcours (visiteur) | 99 | 93 | pavé (carte « Étape 2 » non comptée) |
| 17 | E-mail paiement refusé (relance) | Abonné, prélèvement raté | 98 | n/a | pavé (§3, point 6) |
| 18 | **/register** (étape 1 sur 2) | Visiteur | 87 | 77 (61 hors champs) | pavé |
| 19 | B18 lettre dans l'article | Articles (tous) | 84 | 81 | pavé (hors case de consentement et mention, +57) |
| 20 | B11 fenêtre Premium, tous les gestes (favori vanne 78, conseil 78, vidéo 73, vote 74, carte floutée 78) | Visiteur (connecté : −8) | 73 à 78 | 67 à 72 | pavé |
| 21 | E4 carte « Abonnement » du profil | Compte sans abonnement | 62 | 59 | pavé |
| 22 | B1 encart démo (milieu d'article) | Articles (visiteur) | 60 | 57 | trop long : la scène (26 mots) est le produit, la note (26) est à couper |
| 23 | E-mail de résiliation | Abonné qui résilie | 51 | n/a | trop long (limite) |
| 24 | Bloc « Pas encore sûr ? » (cinq liens d'étape 1) | /abonnement (visiteur) | 50 | 25 | OK (limite) ; 30 avec un seul lien |
| 25 | **B3 haut de l'accueil (la capture)** | Accueil (visiteur) | 45 | 40 | **trop long** : 40 mots de petit texte pour un bouton de 5 |
| 26 | Paywall `premium-paywall.tsx` | À vérifier (web ou appli) | ≥ 42 | ≥ 42 | pavé (phrase de valeur seule ; prix et bouton non relus) |
| 27 | Quiz d'humour, bloc « Ton point de départ » | Quiz (tous) | 29 | 24 | OK |
| 28 | Mur d'une étape payante | Parcours (visiteur) | 26 | 21 | OK (2 phrases, à resserrer) |
| 29 | Carnet extrait (sur /abonnement) | Visiteur | 23 | 18 | OK |
| 30 | Page de retour après paiement (« Paiement reçu ! ») | Après Stripe | 10 | 10 | OK (voir 🎉, §3) |
| 31 | B15 carte de parcours | /parcours | 19 | 14 | OK |
| 32 | E2 ligne + bouton du compte connecté | Accueil, dans la carte | 19 | 14 | OK |
| 33 | Upsell annuel du profil abonné | Profil (abonné mensuel) | 12 | 12 | OK |
| 34 | Validation d'étape 1 | Parcours (visiteur) | 11 | 6 | OK |
| 35 | B6 bouton d'en-tête / lien « Voir Premium » des cartes verrouillées | Partout | 1 à 2 | 0 | OK |

Non chiffrés (données ou composants non lus, à compter au tour suivant) : FAQ de /abonnement et de l'accueil (7 questions, ≈ 600 mots dont ≈ 70 de questions ; pas des appels, mais deux phrases à corriger, §3), fiche du carnet et 14 cartes verrouillées de /carnet (texte issu des données), encart « Parcours recommandé » des articles, carte de prix `PlanSelector`, carte « Étape 2 » de B14, e-mail de rappel annuel. **Relance des comptes créés sans paiement : aucun e-mail n'existe dans le code** (hors chantier, décision du 18/10).
Bilan : **22 pavés, 3 trop longs, 10 OK**. Ce que Thomas a vu sur son téléphone n'est pas un accident, c'est la règle de fait. Le pire n'est pas un bloc B ou E : c'est la **page /abonnement (316 mots)** et le **composant d'avantages (110 mots) collé tel quel sur trois surfaces**.

## 2. Détail de /abonnement (visiteur) : 316 mots, dont ce qui se répète

Surtitre 14 · titre 11 · sous-titre 24 · pastille de formule ≈ 20 (estimé) · bouton 5 · « Deux étapes… Stripe » 10 · réassurance 19 · **4 avantages 110** · carnet extrait 23 · « Pas encore sûr ? » 50 · bloc « Tu annules quand tu veux » 29 · FAQ en plus.
Répétitions vérifiées dans le code (un fait dit 3 fois = 2 fois de trop) :
- **Étape 1 gratuite** : sous-titre (« reste en lecture libre »), avantage 1 (« est offerte »), bloc « Pas encore sûr ? » (« est gratuite »).
- **Résiliation** : réassurance (« résilies en ligne »), bloc « Tu annules quand tu veux », FAQ prix (« 1 clic »), plus l'accroche du formulaire /register (« annulable à tout moment »).
- **Contenu d'une étape** (conseil, vannes, vidéos, quiz) : avantage 1, et le paragraphe E3 pour un compte connecté.
- **Carnet** : avantage 2, extrait du carnet, et le titre E3.
- **Stripe / paiement sécurisé** : « Deux étapes… » et la FAQ.
Cible /abonnement : ≈ 120 mots (titre, 1 phrase, prix et bouton, 1 réassurance, 4 lignes d'avantages, extrait du carnet, 1 lien d'étape 1, FAQ inchangée).

## 3. Points à vérifier en passant (« rien de faux », décidés ailleurs)

1. **FAQ prix (2 versions) : « Tu annules en 1 clic depuis ton profil ».** Contredit la règle validée « jamais en un clic » (tour 13, `tour13/annexe-tour13.md` §1 : on confirme dans le portail Stripe). À corriger en « Tu résilies depuis ton profil ». Déjà signalé pour `llms-content.ts` l. 78 et l. 154.
2. **Sous-titre /abonnement : « une étape par semaine »** dit comme un fait. Règle du 18/10 : rythme conseillé, jamais un calendrier. À passer en « idéalement une par semaine » ou à couper.
3. **Six formulations de la même garantie** sur le parcours (« résilies en ligne », « depuis ton profil », « annulable à tout moment », « Tu annules quand tu veux », « Résilier ton contrat », « 1 clic »). Une seule suffit (règle 5).
4. **Page de retour après paiement : émoji 🎉.** Règle de marque : aucun émoji sur le site.
5. **E-mail de confirmation : « (la première se lit déjà sans compte) »** adressé à quelqu'un qui vient de créer son compte. À couper. Et « Pour bien démarrer » (le seul passage qui donne envie de s'y mettre) arrive en avant-dernier : à remonter.
6. **E-mails d'achat (confirmation, paiement refusé, résiliation) : validés par Thomas le 07/10 (s16) avec retouches @legal.** Je ne les réécris pas : la partie légale est incompressible. À toi de dire si on touche seulement à l'ordre (action d'abord, mentions ensuite).
7. FAQ Q2 : « progresser à ton rythme ». Règle du B16 : aucune formule de rythme libre. À arbitrer par Thomas (FAQ = chiffres et textes protégés, on ne retire rien sans son GO).

## 4. Règles de concision proposées (à valider)

1. **Une idée, un bouton.** Si le bloc veut dire deux choses, c'est deux blocs ou une seule chose.
2. **Titre ≤ 10 mots** (Thomas proposait 8 : trop serré pour les titres en image).
3. **Texte : 1 phrase ≤ 15 mots, ou rien.** Le titre peut suffire.
4. **Bouton = action + prix, ≤ 7 mots**, sans « de la coloc à l'afterwork » dans le libellé.
5. **Une seule formule de réassurance, ≤ 12 mots, collée au bouton qui déclenche le paiement.** Rien sous un bouton gratuit ni sous un lien vers /abonnement. Formule unique, partout : « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » (11 mots, vraie d'après `offre.ts` ; le mot « Premium » y reste, le nom de l'offre ne disparaît pas des petits blocs).
6. **Pas de liste de contenu, de nom d'étape ni de durée dans les petits blocs.** Le détail vit sur /abonnement, une fois.
7. **Lien secondaire : 4 à 6 mots.**
8. **Prix : une fois par bloc, dans le bouton.** Le prix annuel (24,99 €/an) vit sur /abonnement ; à Thomas de dire s'il veut le garder sur la carte d'accueil.
9. **Budget hors bouton : 25 mots (bloc, fiche, mur, fenêtre), 40 (carte d'accueil, haut de page), 120 (page /abonnement entière hors FAQ).**
10. **Un fait, une fois par page.** « Étape 1 gratuite », « résiliable », « 5 parcours » : dits une fois, jamais dans le bouton ET la note ET un bloc voisin.
11. **Avantages : un composant unique de 4 lignes ≤ 9 mots, 30 mots en tout.** Aujourd'hui 110 mots, copiés sur 3 surfaces.
12. **Le test : lisible en 5 secondes sur un téléphone, sans défiler.** Si une phrase peut sauter sans que le bloc perde l'envie, elle saute.

**Correction du processus (la vraie cause).** (a) Tout duel oppose la version à sa version raccourcie ; (b) les relecteurs notent « envie » ET « temps de lecture » ; (c) un fait entre dans un bloc seulement si le bloc sans lui perd à l'aveugle.

## 5. Les 6 étalons, avant / après

Tous les « après » : rien de faux (étape 1 gratuite sans compte, prix, 14 jours sur le premier paiement, résiliation depuis le profil), aucune promesse de résultat, « 1 500+ » et prix intacts, zéro tiret cadratin.

### Étalon 1 : B3, haut de l'accueil (la capture) · 45 mots → 12

**Avant** (45)
> [Tester mes premières répliques, gratuit]
> Ouvrir les 5 parcours, de la coloc à l'afterwork · 2,99 €/mois
> Sans compte : l'étape 1 du parcours Répartie (conseil, défi, 5 vannes, 2 vidéos, quiz). Les 3 suivantes, dont « Retourner les piques avec le sourire », c'est Premium, résiliable depuis ton profil.

**Après** (12)
> [Tester mes premières répliques, gratuit]
> Sans compte.
> Ouvrir les 5 parcours · 2,99 €/mois

Enlevé : la liste de l'étape, le nom d'une étape payante, la résiliation, « de la coloc à l'afterwork » (il vit dans la carte plus bas). Pourquoi ça donne plus envie : un bouton, une promesse de 2 mots, un lien à 5 mots. On a envie de cliquer, plus de lire.

### Étalon 2 : B2, fin d'article · 145 mots → 32

**Avant** (145) : surtitre « Parcours Répartie · 4 semaines » ; titre « La vanne qui sort de ta bouche, pas de ton téléphone » ; paragraphe de 85 mots (« Tu viens de lire cinquante vannes… une étape par semaine, 20 minutes : tes premières répliques, le rythme et les silences, les piques qu'on retourne avec le sourire, et la vanne tombée à plat… ») ; bouton ; lien `Ouvrir les 5 parcours · 2,99 €/mois` ; note de 35 mots (prix mensuel et annuel TTC, 14 jours, résiliation).

**Après** (32)
> La vanne dans ta bouche, pas dans ton téléphone
> Quand on te chambre, tu as une seconde, et ça s'entraîne.
> [Tester mes premières répliques, gratuit]
> Sans compte.
> Ouvrir les 5 parcours · 2,99 €/mois

Enlevé : le surtitre, les 4 titres d'étapes, le défi, les deux prix TTC et la garantie (le lien mène à /abonnement, qui les dit). Pourquoi ça donne plus envie : il reste l'image (la seconde où il faut répondre) et le geste. Le lecteur sort d'un article de vannes : il veut essayer, pas lire un programme.

### Étalon 3 : E3, haut de /abonnement (compte connecté) · 79 mots → 26

**Avant** (79) : pastille « Un abonnement, tout ouvert » ; titre « Les 5 parcours en entier, et un nouveau carnet de répartie chaque mois. » ; paragraphe de 57 mots (les 5 noms, « de 3 à 6 semaines chacun », « 15 à 20 minutes », « un conseil, un défi à tenter, 5 vannes, 2 vidéos et un petit quiz », toutes les vannes, conseils, vidéos) ; bouton `Ouvrir les 5 parcours · 2,99 €/mois`.

**Après** (26)
> Les 5 parcours, et un carnet de répartie chaque mois
> Tout s'ouvre d'un coup, vannes, conseils et vidéos du site compris.
> [Ouvrir les 5 parcours · 2,99 €/mois]

Enlevé : la pastille, les noms, les semaines, les minutes, le contenu d'une étape (il est dans la liste d'avantages juste dessous, dite une fois). Pourquoi ça donne plus envie : on lit « tout s'ouvre d'un coup » avant d'avoir compris quoi que ce soit d'autre, et le bouton est déjà sous les yeux.

### Étalon 4 : E1, paywall du carnet · 182 mots → 38

**Avant** (182) : titre « Ça, c'était la réplique offerte. Il en reste 14. » ; paragraphe de 33 mots (« Elles vont de la moins tendue à la plus tendue, alors tu commences tranquille et tu montes d'un cran… ») ; **les 4 avantages (110 mots)** ; bouton `Voir les 14 autres répliques · 2,99 €/mois` ; ligne de 24 mots sous le bouton (prix TTC, 14 jours, résiliation).

**Après** (38)
> Ça, c'était la réplique offerte. Il en reste 14.
> Du plus tranquille au plus tendu, et un nouveau carnet chaque mois.
> [Voir les 14 autres répliques · 2,99 €/mois]
> Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.

Enlevé : les 4 avantages (ceux d'un carnet, 3 sur 4 parlent d'autre chose), le « s'ouvrent toutes d'un coup » (le bouton le dit), le prix répété. Pourquoi ça donne plus envie : le titre est déjà la meilleure phrase du bloc ; on le laisse faire son travail au lieu de le noyer.

### Étalon 5 : carte Premium de l'accueil (B4+B5) · 260 mots → 51

**Avant** (260) : titre ; scène « La table qui rit, et c'est ta réplique qui l'a lancée. » ; intro et liste de 5 parcours (45 mots) ; paragraphe « 15 à 20 minutes par étape… » ; en-tête « Premium · 2,99 €/mois » ; ligne annuelle ; **les 4 avantages (110 mots)** ; deux boutons ; réassurance de 20 mots ; « Déjà 1 500+ inscrits, et toi ? ».

**Après** (51)
> Et si ton « j'aurais dû dire » devenait un « j'ai dit » ?
> Premium : 5 parcours, de la coloc à l'afterwork, et l'étape 1 de chacun est gratuite.
> [Ouvrir les 5 parcours · 2,99 €/mois]
> [Tester mes premières répliques, gratuit]
> Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.
> Déjà 1 500+ inscrits, et toi ?

Enlevé : la scène (le titre la contient), la liste de 5 lignes, la durée, l'en-tête de prix (le bouton le porte), le prix annuel (à décider, règle 8), les avantages. Pourquoi ça donne plus envie : le titre reste, la phrase dit ce qu'on vend en 15 mots, les deux boutons se lisent sans défiler. « 1 500+ » est intact.

### Étalon 6 : les 4 avantages, composant partagé · 110 mots → 30

Pire pavé hors blocs B/E : le même paragraphe sur /abonnement, l'accueil et /carnet.

**Avant** (110) : « Les 5 parcours en entier : Machine à Café (15 min/semaine), Répartie (20 min/semaine), Confiance (20 min/semaine), Storytelling (20 min/semaine), Boulot (15 min/semaine). Chaque étape avec son conseil, ses vannes, ses vidéos et son quiz. La première étape de chaque parcours est offerte. » + « Le carnet mensuel de situations de répartie (nouveau chaque mois) : ce qu'on te dit, quoi répondre, pourquoi ça marche et quoi faire si ça se tend. » + « Tes favoris : garde sous la main les vannes, conseils et vidéos à ressortir. » + « Les listes complètes (compteurs dynamiques : X+ vannes, X+ conseils, X+ vidéos analysées ; comptés ici comme 3 mots chiffrés), au lieu de 10 vannes, 3 conseils et 3 vidéos sans abonnement, avec le filtre par catégorie des vannes. »

**Après** (30)
> Les 5 parcours en entier
> Un nouveau carnet de répartie chaque mois
> Tes favoris : vannes, conseils et vidéos sous la main
> Toutes les vannes, tous les conseils, toutes les vidéos

Enlevé : les noms et durées des parcours (déjà sur /parcours), le contenu d'une étape, le détail du carnet, la comparaison « au lieu de 10 vannes… » (les murs la montrent déjà). Pourquoi ça donne plus envie : quatre lignes qu'on lit en trois secondes, au lieu d'un contrat. Les chiffres du catalogue (dynamiques) restent possibles sur une seule ligne si Thomas y tient.

## 6. Questions pour Thomas (5 réponses suffisent)

1. La formule unique de réassurance (règle 5) te va ?
2. Prix annuel (24,99 €/an) : sur /abonnement seulement, ou aussi sur la carte d'accueil ?
3. On corrige « 1 clic » dans les deux FAQ prix (c'est faux) ?
4. Les noms de parcours, durées et contenu d'une étape ne vivent plus que sur /abonnement et /parcours : d'accord ?
5. Les 6 étalons te donnent envie de cliquer ? Si oui, on les applique aux autres blocs par gabarit, chaque bloc en duel à l'aveugle contre sa version raccourcie, avec le critère « envie + temps de lecture ».
