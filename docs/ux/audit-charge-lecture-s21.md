# Audit UX : charge de lecture et friction du tunnel (s21)

> Date : 18/10/2026. Périmètre : parcours visiteur / compte sans abonnement / abonné, mobile 375 d'abord. Source : captures réelles du lien de test (`.claude/worktrees/agent-a6072b0ac19da7774/docs/qa/captures-s21-v2` et `-v3`, plus `captures-s21` pour /register et le quiz). Aucun code ni texte modifié. Les textes ne sont pas réécrits : seule la structure est décrite. Les règles chiffrées du §3 sont des propositions à valider avec Thomas (choix du 18/10 : « règles chiffrées et étalons à valider avant la réécriture d'ensemble »). Respecte les choix fondateur : « 1 500+ » et les prix restent, aucun juridique ajouté, conversion d'abord.

**Limites de l'audit (honnêteté)** : les pages entières (accueil 12 écrans, /abonnement 5,4 écrans, murs de liste, carnet) n'existent qu'en capture très réduite : la structure et le nombre d'éléments sont fiables, la lecture mot à mot ne l'est pas. La fin d'étape 1 vient des captures s17 (pas de capture s21 de cet écran). Le checkout Stripe n'est pas capturé : nombre de champs Stripe `[À VÉRIFIER]`.

## 0. Diagnostic en 6 lignes

Le fondateur a raison, et c'est systémique, pas local. Trois causes :
1. **Le même bloc d'offre est collé partout** : la carte « 4 puces (~90 mots) + bouton + bouton outline + 3 lignes grises » apparaît presque à l'identique sur l'accueil, /abonnement, le bas du carnet, et sous forme de paragraphe dans /profil, /glossaire, /a-propos, les fiches, la fin d'article. L'utilisateur relit la même phrase (« 15 à 20 min par étape : un conseil, un défi, 5 vannes, 2 vidéos, un quiz, première étape gratuite ») 4 à 6 fois dans un parcours.
2. **Chaque bloc veut tout dire** : bénéfice + description du contenu + détail gratuit + prix mensuel + prix annuel + remboursement + résiliation. Un bloc d'appel doit faire une seule chose : donner envie, puis laisser le bouton agir.
3. **Deux boutons de même poids** (plein + contour, souvent de 2 lignes de texte) et un lien : le visiteur doit choisir avant d'agir. Le bouton gratuit-en-contour est un faux concurrent du bouton payant.

## 1. Audit écran par écran (mobile 375)

Légende : **O** = ce que l'œil voit en 3 s ; **C** = éléments en concurrence avec le bouton principal ; **P** = pavés / répétitions / lignes grises ; **F** = friction vers le paiement ; **V** = verdict.

### 1.1 Accueil, haut (visiteur)
- **O** : H1 fort, puis un paragraphe de 5 lignes, la preuve sociale, le gros bouton violet gratuit. Le bouton payant du header (2,99 €/mois) est déjà là.
- **C** : au premier écran, 3 appels : bouton plein gratuit, lien souligné payant « Ouvrir les 5 parcours · 2,99 €/mois » (2 lignes), chip 2,99 € du header, plus les chips de thèmes qui dépassent. Soit 3 appels à action avant le premier scroll, dont 2 payants.
- **P** : paragraphe grisé de 3-4 lignes sous le lien payant (« Sans compte : l'étape 1 du parcours Répartie (conseil, défi, 5 vannes, 2 vidéos, quiz). Les 3 suivantes… ») : il explique le gratuit alors que le bouton le dit déjà. Le paragraphe d'intro est une liste de 4 douleurs + l'offre en 5 lignes.
- **F** : le bouton gratuit mène à l'étape 1, pas au paiement : bon pour l'envie, mais le chemin payant n'a aucun écran « fort » avant le scroll.
- **V : ALLÉGER**. Supprimer le paragraphe gris sous le lien. Supprimer le lien payant souligné du hero (le chip du header porte déjà le payant en permanence). Ramener l'intro à 2 phrases. Résultat : un titre, une phrase, une preuve, un bouton. Les chips de thème descendent sous le bouton avec le reste.

### 1.2 Accueil, reste de la page et carte Premium
- **O** : page de 12 écrans (10 045 px) : contenu du jour, « Trois outils » (3 cartes), « Tu te reconnais ? » (3 cartes persona), derniers articles, section Premium, FAQ de 8 questions, « question décryptée », « Prochainement », lettre, footer.
- **C** : section Premium = un titre, 5 lignes d'intro, **une liste de 5 parcours avec leur promesse (~70 mots)**, puis la carte (prix, 4 puces ~90 mots, bouton plein de 2 lignes, bouton contour de 2 lignes, 3 lignes grises, « Déjà 1 500+ inscrits »). Les 5 parcours sont donc décrits deux fois (liste + puce 1) et l'offre une 3e fois dans l'intro.
- **P** : puce 1 contient les 5 noms avec leurs durées (« Machine à Café (15 min/semaine), Répartie (20 min/semaine)… »), puce 2 le carnet, puce 3 les favoris, puce 4 les compteurs (80+ / 30+ / 80+ / 10-3-3). C'est un tableau de caractéristiques, pas un bénéfice. Les chiffres « 10 vannes, 3 conseils et 3 vidéos sans abonnement » dans une puce de vente racontent la limite du gratuit au moment où on veut donner envie.
- **F** : 2 boutons de même largeur côte à côte verticalement : le visiteur hésite.
- **V : ALLÉGER FORT**. Supprimer l'intro de 5 lignes ET la liste de 5 parcours (garder l'une des deux, pas les deux, et pas la puce 1 en plus). Carte = prix + 3 bénéfices d'une ligne + bouton plein + 1 ligne de réassurance + « 1 500+ ». Le bouton « Tester… gratuit » devient un lien texte d'une ligne. FAQ de 8 à 4 (prix/frais cachés, annulation, timide/introverti, différence avec YouTube). Retirer « Prochainement » (lettre) de la zone entre la carte et le footer si Thomas le permet : ce bloc concurrence la fin de page (à lui de trancher, B18 déjà refusé au milieu des articles).

### 1.3 Fin d'article
- **O** : carte sombre : étiquette « Parcours Répartie · 4 semaines », titre en 2 lignes, paragraphe de 8 lignes, bouton plein gratuit (2 lignes), lien souligné payant, bloc gris de 4 lignes (« Premium, l'abonnement du site : 2,99 € TTC par mois, ou 24,99 € TTC par an (2,08 € par mois). Tu as 14 jours… »).
- **C** : 2 appels (plein + lien), bien. Le bouton plein envoie vers le gratuit, le lien vers le payant : le plus rentable est donc le plus discret.
- **P** : paragraphe de 8 lignes qui liste le programme (rythme, silences, piques, vanne tombée à plat, défi par étape). Ligne grise de 4 lignes avec 4 chiffres de prix (2,99 / 24,99 / 2,08) : personne ne lit ça au bas d'un article.
- **V : ALLÉGER**. Garder la structure (1 bouton, 1 lien). Paragraphe à 2-3 lignes. Ligne grise : une seule phrase de réassurance, sans prix annuel (le prix est déjà dans le lien).

### 1.4 Fiche vanne, fiche conseil, fiche vidéo
- **O** : après la chute et l'explication, une carte avec un titre (2 lignes), un paragraphe de 5 à 7 lignes, un bouton plein, 3 lignes grises, un bouton contour de 2 lignes (« Gratuit : 5 vannes et un défi, étape 1 de Répartie »), un lien « Voir d'autres vannes ».
- **C** : 4 éléments cliquables dans la carte (bouton plein, bouton contour, lien, + partage / copier le lien au-dessus). La fiche vidéo ajoute une 2e carte « Dans un parcours » juste dessous : un 2e appel immédiatement après le 1er.
- **P** : le paragraphe de la fiche conseil explique le bloc « À toi de jouer » **et** Premium **et** les 5 parcours **et** les favoris : 4 idées. La ligne grise de 3 lignes répète les prix annuels + résiliation + 14 jours. Même contenu que 1.3.
- **F** : le bouton plein ouvre la fenêtre ou /register (voir 1.8) : bon. Le bouton contour de 2 lignes est un paragraphe déguisé en bouton.
- **V : ALLÉGER**. 1 bouton plein, 1 phrase de bénéfice (l'exercice de CETTE fiche, rien d'autre), 1 ligne grise. Le bouton contour devient un lien texte d'une ligne ou disparaît (le gratuit a déjà sa place dans la fiche : bouton « révéler la chute »). Supprimer « Voir d'autres vannes » de la carte (déjà dans la navigation de fin de page). Fiche vidéo : fusionner les deux cartes en une, ou espacer la 2e plus bas.

### 1.5 Encart au milieu d'un article (carnet : « La situation offerte »)
- **O** : une situation concrète, une question (« Tu réponds quoi ? »), bouton plein « Voir la réplique », 4 lignes grises.
- **P** : seul défaut, la ligne grise de 4 lignes (« Gratuit, sans compte : la réplique, pourquoi elle marche… »).
- **V : GARDER** (c'est la seule vraie démonstration : on joue avant de payer). Ligne grise ramenée à 1 ligne.

### 1.6 Murs de liste (vannes, conseils, vidéos ; visiteur)
- **O** : titre long + paragraphe de 4 lignes + 8 chips de catégories, puis 10 cartes. Chaque carte = étiquette de catégorie, étiquette « One-liner », texte, bouton « Révéler la chute » (ou chute), lien gris « Page dédiée ». Après la 10e carte : phrase d'annonce, bloc « Et si la prochaine… » (titre, paragraphe de ~4 lignes, 3 lignes grises, bouton plein, bouton contour de 2 lignes), 3 cartes verrouillées « Voir Premium », pagination de 6 pages, FAQ, bloc SEO, 3 cartes « La suite », footer. Page de 7-8 écrans.
- **C** : au point de blocage, 8 éléments pour un seul bouton plein (annonce, paragraphe, gris, bouton plein, bouton contour, 3 cartes verrouillées, pagination). Le visiteur voit en plus **6 pages de pagination** alors que le mur annonce 10 vannes `[À VÉRIFIER : cohérence pagination / limite 10]`.
- **P** : 3 lignes (étiquette + « One-liner » + « Page dédiée ») de métadonnées grises par carte × 10 = 30 petites lignes. Les 3 cartes verrouillées sont 3 fois « Voir Premium ».
- **V : ALLÉGER**. Carte : retirer l'étiquette « One-liner » et le lien « Page dédiée » (le titre de la carte est déjà un lien). Mur : titre + 1 ligne + 1 bouton plein + 1 lien. 3 cartes verrouillées → 1 carte floutée. Le bloc SEO et la FAQ restent sous le mur mais ne doivent jamais passer avant. Hors mur, le texte d'en-tête (4 lignes) peut descendre à 2.

### 1.7 Page parcours et fin d'étape 1 (visiteur)
- **O** (capture s17, à reconfirmer en s21) : en fin d'étape 1, bloc « 2 sur 4. Les explications sont là pour ça » + bouton contour « Refaire le quiz » ; une phrase « Valider l'étape fait partie de Premium » ; bouton plein « Voir l'offre Premium » ; 1 ligne « 2,99 €/mois, sans engagement » ; puis 2 étapes verrouillées en pointillé (cadenas, +XP, badge « Fait partie de Premium » ×2) ; puis « Tu y prends goût ? Jette un œil au parcours suivant ».
- **C** : 4 appels (Refaire le quiz, Voir l'offre, 2 lignes verrouillées cliquables, lien parcours suivant). Moment de plus haute envie du tunnel (le visiteur vient de finir et d'obtenir un résultat) et le bouton dit « Voir l'offre » : il décrit une page, pas un bénéfice, et il envoie vers /abonnement (un écran de plus avec 5 écrans de lecture).
- **P** : bien : peu de texte. Défaut : le badge « Premium » répété 3 fois, 2 cadenas qui répètent la même info.
- **F** : fin d'étape → /abonnement → /register → Stripe : 3 écrans avant carte. Ici, aller directement à /register (ou à la fenêtre) retire un écran dans le meilleur moment du tunnel.
- **V : ALLÉGER légèrement, PRIORITÉ HAUTE**. « Refaire le quiz » devient un lien. Les 2 lignes verrouillées → une phrase unique « Étapes 2 à 6 : Premium » sous le bouton. Le bouton plein ouvre la fenêtre/inscription, pas la page offre. Rendre visible ce que l'utilisateur vient de gagner (XP, étape faite) avant l'appel.

### 1.8 Résultat du quiz d'humour
- **O** : « Ton point de départ : Parcours Confiance », 3 lignes, bouton plein « Essayer gratuitement l'étape 1 », lien souligné « Voir les 5 parcours en entier avec Premium » (2 lignes), gris 3 lignes. Au-dessus : bouton « Partage ton résultat ».
- **C** : 3 actions, dont partager au-dessus du résultat.
- **P** : gris 3 lignes (prix + remboursement) alors que le lien mène à une page qui l'affiche.
- **V : GARDER**, retirer la ligne grise (ou 1 ligne), partager sous le bouton principal.

### 1.9 /carnet (visiteur)
- **O** : titre, intro de 5 lignes, la fiche offerte en entier (« On te dit / Tu réponds / Pourquoi ça marche / Si ça se tend / À toi de jouer », ~110 mots), puis « Les 14 autres situations » = **14 lignes verrouillées**, puis le bloc d'achat avec **les 4 puces complètes** (~100 mots) et un bouton « Voir les 14 autres répliques · 2,99 €/mois ». Page de 7 écrans, bouton d'achat au bas du 6e.
- **C** : 14 lignes cadenassées avant le seul bouton ; le chip du header est le seul appel visible pendant tout le scroll.
- **P** : le bloc d'achat redit tout ce que la page vient de prouver (« Ça, c'était la réplique offerte. Il en reste 14 » est bon, la puce 1 « 5 parcours… » ne l'est pas).
- **F** : le bouton est loin de l'envie : l'envie est maximale juste après la fiche offerte, 14 lignes plus haut.
- **V : ALLÉGER**. Replier « Si ça se tend » et « À toi de jouer » derrière un seul « Voir la suite » (ou garder 3 blocs). Liste verrouillée : 3 lignes visibles + « 11 autres ». Bouton d'achat juste après la fiche (et pas après la liste). Bloc d'achat = titre + 1 phrase + bouton + 1 ligne. Retirer la liste de 4 puces.

### 1.10 /abonnement (compte sans abonnement, 375x812)
- **O** : étiquette, titre 3 lignes, **chapô de 5 lignes** (liste des 5 parcours, durées, contenu d'une étape, et le reste du site), carte Premium : toggle Mensuel/Annuel, badge « plus de 3 mois offerts » qui flotte seul, prix, ligne violette de 2 lignes (24,99 € / 2,08 € / 10,89 € économisés), **espace vide d'environ 50 px**, bouton plein, 2 lignes grises + « Paiement sécurisé par Stripe », 4 puces (~90 mots).
- Sous la carte : « Carnet d'octobre » (étiquette + titre + 1 ligne + carte de la situation complète + lien « Lire la fiche en entier »), « Pas encore sûr ? » (5 liens, un par parcours), « Tu annules quand tu veux », FAQ de 8 questions. Total 5,4 écrans.
- **C** : au premier écran, le bouton est visible (v3 : y≈630-680 sur 812) : bon. Autour de lui : le toggle (2 choix), le badge, 2 prix, 3 lignes de réassurance. Après lui : 5 liens vers des étapes gratuites (5 sorties), 8 FAQ.
- **P** : même argument 4 fois sur la page : chapô (« 5 parcours, 3 à 6 semaines, 15 à 20 min, un conseil, un défi, 5 vannes, 2 vidéos, un quiz »), puce 1 (la même liste avec les durées), puce 4 (le reste du site), et « Pas encore sûr » (l'étape 1 gratuite de chacun). La réassurance est dite 3 fois : sous le bouton, bloc « Tu annules quand tu veux », FAQ « 2,99 €/mois, c'est vraiment tout ? ».
- **F** : prix annuel visible à la fois dans le toggle, le badge et la ligne violette (3 façons de dire la même économie) alors que le mensuel est présélectionné.
- **V : ALLÉGER FORT (page-clé du tunnel)**. Chapô à 1-2 lignes. Puces : 3 maximum, 1 ligne chacune (les compteurs 80+/30+ et les durées par parcours disparaissent, ils appartiennent à la FAQ ou aux pages parcours). Supprimer l'espace vide. Un seul endroit pour l'économie annuelle. Une seule réassurance (sous le bouton) + « Paiement sécurisé par Stripe » en icône. « Pas encore sûr » → un seul lien (Répartie) ou rien. FAQ 8 → 4. Carnet en démonstration : garder, mais SOUS la FAQ ou réduit à l'extrait.

### 1.11 /register (étape 1 sur 2)
- **O** : titre « Ton compte », sous-titre, 3 champs (email, mot de passe, prénom facultatif), bouton plein de 2 lignes, bouton Google en contour, 3 lignes grises, « Déjà un compte ? », lien « Tu préfères lire d'abord ? », « Retour à l'accueil ». ~14 éléments, 1 écran et demi.
- **C** : bouton Google au même poids visuel que le bouton principal et placé après lui : le chemin le plus court (Google = 0 champ) est le plus bas. 4 sorties (Connecte-toi, Lire d'abord, Retour accueil, + logo) autour du bouton.
- **P** : 3 lignes grises empilées (« Étape 2 : le paiement… », « Tu as 14 jours… », « En créant ton compte, tu acceptes les CGU ») ; le libellé du prénom fait 2 lignes (« facultatif, pour te saluer dans nos e-mails »).
- **F** : c'est le point de friction n°1 du tunnel après la décision : 2 champs obligatoires + 1 facultatif qui ne sert pas au paiement. Chemin complet visiteur : bloc → (fenêtre) → /register → Stripe → succès = 3 écrans de saisie avant la confirmation ; Google réduit à 2. Le toast d'erreur (capture « Le paiement n'a pas pu démarrer ») **recouvre le bouton de paiement** sur /abonnement.
- **V : ALLÉGER**. Supprimer le champ prénom (le demander après paiement, une fois le compte créé : une surprise de moins). Google en premier. 3 lignes grises → 1 (la mention CGU peut rester, elle porte le contrat). Fusionner « Tu préfères lire d'abord ? » et « Retour à l'accueil » en une seule sortie. Toast d'erreur en haut de page, jamais sur le bouton.

### 1.12 Fenêtre Premium (clic sur le coeur, visiteur et compte sans abonnement)
- **O** : titre 2 lignes, 1 ligne de promesse (« Deux étapes… »), prix très lisible, 1 ligne de bénéfices, bouton plein, lien souligné, 1 ligne grise. Fermeture X visible.
- **C** : 3 éléments (bouton, lien, X) : correct.
- **P** : deux lignes de contenu au-dessus du prix : « Deux étapes… » + « Avec Premium : tes favoris, l'exercice de chaque fiche et les 5 parcours en entier ». La 2e liste, pour la 4e fois, ce que le site dit partout.
- **V : GARDER** : c'est le meilleur écran du tunnel. Retirer la ligne « Avec Premium… » ou la ligne « Deux étapes ». La ligne grise passe au-dessus du pli sur 700 px de hauteur : à vérifier sur 640 px.

### 1.13 /profil (compte sans abonnement)
- **O** : carte « Abonnement » + badge « Aucun abonnement », 3 lignes d'offre, « Tu as déjà 120 XP », 2 lignes grises, bouton « Tout ouvrir · 2,99 €/mois ».
- **V : GARDER la structure, ALLÉGER**. La phrase d'offre répète encore la liste (parcours, carnet, vannes, conseils, vidéos, favoris). Garder « Tu as déjà 120 XP » (personnalisation : le meilleur argument ici) puis le bouton, 1 ligne grise. C'est l'écran de la personne qui s'est inscrite sans payer : elle n'a pas besoin qu'on lui réexplique l'offre.

### 1.14 /glossaire et /a-propos
- **O** : carte de fin : titre 2 lignes, **paragraphe de 9 lignes**, bouton plein de 2 lignes, 3 lignes grises, lien « Lis d'abord une étape, elle est offerte ». Le paragraphe est **le même sur les deux pages** (« 15 à 20 minutes par semaine. Chaque étape : un conseil, un défi, 5 vannes, 2 vidéos, un quiz. La première étape de chaque parcours se lit sans compte, pour juger sur pièce, et le reste s'ouvre d'un coup quand tu t'abonnes ») et sur l'accueil, la fiche, le carnet, /abonnement.
- **C** : 1 bouton, 1 lien : correct. Mais le gros de la carte est un paragraphe.
- **V : ALLÉGER**. Paragraphe 9 → 2 lignes spécifiques à la page (le glossaire parle de vocabulaire, l'à-propos de la promesse du site). Supprimer le lien « Lis d'abord » quand le bouton gratuit existe déjà plus haut sur la page.

### 1.15 Abonné (contrôle)
Les 3 pages vues (accueil, carnet, parcours) n'ont pas de blocs de vente (conforme). L'accueil abonné et le haut de parcours ne montrent pas de pavé commercial ; reste le contenu (« Ce que tu vas apprendre ») qui est de l'enseignement, hors périmètre de cet audit.

## 2. Top 10 des changements par impact conversion

(classés par impact estimé ; l'ordre est un jugement UX, non mesuré. Les chiffres réels connus : 0 clic sur 69 vues d'encarts du 14 au 18/10.)

1. **Une seule carte d'offre courte, réutilisée partout** (prix, 3 bénéfices d'une ligne, bouton, 1 réassurance). Supprimer les 4 puces de ~90 mots collées sur accueil, /abonnement, carnet, et la phrase équivalente dans profil, glossaire, à-propos, fiches.
2. **Fin d'étape 1 (visiteur) : appel direct à /register ou à la fenêtre, avec le bénéfice**, pas « Voir l'offre » ; retirer « Refaire le quiz » en bouton ; une seule phrase pour les étapes verrouillées. C'est le pic d'envie du tunnel.
3. **Un seul bouton plein par bloc d'appel** : le bouton gratuit en contour (2 lignes de texte) devient un lien d'une ligne ; plus de 2 boutons de même poids dans un bloc (fiches, mur, carte accueil, /register).
4. **Une seule ligne de réassurance par écran, sous le bouton**, identique partout, sans prix annuel ni économies. Supprimer les lignes grises de 3 à 4 lignes.
5. **/abonnement raccourci de 5,4 à ~3 écrans** : chapô 1-2 lignes, 3 puces d'1 ligne, FAQ 8 → 4, « Pas encore sûr » 5 liens → 1, vide sous le prix supprimé, économie annuelle dite 1 fois.
6. **/register : supprimer le champ prénom, Google en premier, 3 lignes grises → 1, une seule sortie** ; toast d'erreur qui ne recouvre plus le bouton.
7. **Accueil, haut : un titre, une phrase, une preuve, un seul bouton plein** (supprimer le paragraphe gris et le lien payant souligné ; le chip du header porte le payant). Milieu : retirer la liste des 5 parcours doublonnant la carte, FAQ 4 questions, accueil de 12 écrans à ~8.
8. **Carnet visiteur : le bouton d'achat juste après la fiche offerte** (pas après 14 lignes cadenassées) ; liste verrouillée = 3 lignes + « +11 autres » ; fin de page sans les 4 puces.
9. **Murs de liste : mur = titre + 1 ligne + 1 bouton + 1 lien** ; 3 cartes verrouillées → 1 ; retirer « One-liner » et « Page dédiée » de chacune des 10 cartes ; vérifier la pagination de 6 pages en regard du plafond de 10.
10. **Fiches (vanne/conseil/vidéo) et fin d'article : un bénéfice propre à la fiche en 2 à 3 lignes** au lieu du paragraphe qui répète le programme ; fiche vidéo : ne plus empiler 2 cartes d'appel ; glossaire/à-propos : paragraphe de 9 lignes → 2.

## 3. Règles de structure (propositions à valider avec Thomas)

**Bloc d'appel (fiches, fin d'article, mur, glossaire, à-propos, profil)**
- Budget : 1 titre (≤ 8 mots) + 1 phrase (≤ 3 lignes mobile) + 1 bouton plein + 1 ligne grise + 1 lien texte au plus. ~45 mots au total, hors bouton.
- **Max sous un bouton plein : 1 ligne grise (≤ 2 lignes mobile) + 1 lien.** Pas de 2e bouton, jamais de 2e bouton de même largeur.
- Un bouton tient en 1 ligne, 2 au pire (≤ 28 caractères visibles) ; il ne décrit pas une liste de contenu.
- Max 2 éléments de décision visibles par écran de 812 px (bouton + lien), le chip du header ne compte pas.

**Réassurance**
- Une seule phrase d'un seul type (remboursement + résiliation) : sous le bouton, jamais avant, jamais en doublon sur le même écran. Les prix annuels, les économies et les compteurs n'y vivent pas.
- Elle vit à 3 endroits : sous le bouton de la fenêtre, sous le bouton de /abonnement (+ FAQ), sur /register (1 ligne). Dans un bloc d'appel de contenu, elle tient en 1 ligne ou disparaît quand le bouton mène à une fenêtre qui la porte déjà.
- Preuve sociale (« 1 500+ ») : une fois par écran, au-dessus du bouton si possible.

**Détail de l'offre**
- Il vit à **un seul endroit : /abonnement**, en 3 puces d'une ligne ; les compteurs, durées par parcours et listes vivent dans la FAQ ou les pages parcours. Partout ailleurs : un bénéfice propre à la page + le prix. Le gratuit (étape 1, 10-3-3) ne se décrit jamais sous un bouton payant.
- Le prix mensuel apparaît une fois par bloc (dans le bouton) ; le prix annuel seulement sur /abonnement.

**Longueur de page et répétition**
- Une idée, une fois par écran : si une phrase de l'offre figure déjà dans l'écran, elle ne se redit pas.
- Plafonds mobile : /abonnement ≤ 3 écrans, accueil ≤ 8, carnet visiteur ≤ 5, FAQ de vente ≤ 4 questions, /register tient dans 1 écran de 812 px sans scroll.
- Petites lignes grises : 1 par écran, jamais empilées.

**Chemin d'achat**
- Maximum 3 écrans avant la carte : bloc → /register (ou fenêtre) → Stripe. Un compte Google en 2. Aucun écran intermédiaire de lecture (« Voir l'offre ») entre un bloc d'appel et le paiement, sauf demande explicite de l'utilisateur.
- Un champ demandé avant le paiement doit servir au paiement (le prénom se demande après).

## 4. Mesure (HEART, à brancher via @data-analyst)

| Dimension | Signal | Cible proposée | Méthode |
|---|---|---|---|
| Adoption | clic bouton payant / vue du bloc, par emplacement (fiche, article, mur, fin d'étape, carnet) | > 0 clic/vue sur chaque emplacement (point de départ : 0/69) | événements Umami par emplacement |
| Task success | /abonnement → /register → Stripe → succès | complétion de /register ≥ 85 % | entonnoir Umami, 4 étapes |
| Engagement | profondeur de scroll /abonnement et accueil | 80 % des visiteurs voient le bouton avant la mi-page | événement de scroll |
| Happiness | abandon à /register par champ | suppression prénom : -1 champ | comparaison avant/après |

## 5. Points à trancher par Thomas

1. Valider ou ajuster les plafonds chiffrés du §3 (45 mots par bloc, 1 ligne grise, 3 puces, 3 écrans pour /abonnement).
2. Supprimer le champ prénom du formulaire d'inscription (le demander après paiement).
3. Faire disparaître le lien payant souligné du premier écran de l'accueil (le chip du header reste).
4. Fin d'étape 1 : bouton direct vers l'inscription plutôt que vers /abonnement.

Choix 3 et 4 touchent des libellés/structures rouverts le 18/10 (critère unique : l'envie de payer). « 1 500+ » et les prix restent intacts dans toutes les recos ci-dessus.
