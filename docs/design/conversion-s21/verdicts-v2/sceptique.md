# Verdict à l'aveugle v2 : le sceptique

Persona : 35 ans, se méfie des abonnements, cherche le piège, veut savoir ce qu'il paie, ce qu'il a déjà gratuitement et comment il sort. Compare avec YouTube gratuit.
Matériel : `docs/design/conversion-s21/trajets-v2/` (375 x 700 et 320 x 640, plus FAQ ouverte et 1 280 px). Notes données sur **320 x 640**, comme le veut la grille (§11 de `docs/ux/trajet-conversion-s21.md`, lue seule). Aucun document de textes ni autre verdict lu.

## Verdict global : 9,1 / 10 (tour 1 : 7,5)

| Trajet | 1. Offre en 3 s | 2. Promesse tenue | 3. Clics | 4. Envie | 5. Confiance | Moyenne |
|---|---|---|---|---|---|---|
| T1 En-tête, mensuel | 9 | 9 | 10 | 8 | 9 | 9,0 |
| T1 En-tête, annuel | 9 | 10 | 10 | 8 | 9 | 9,2 |
| T2 Mur de liste | 9 | 10 | 10 | 8 | 9 | 9,2 |
| T3 Fin d'étape 1 | 9 | 10 | 10 | 9 | 8 | 9,2 |
| T4 Fenêtre Premium | 9 | 9 | 10 | 8 | 9 | 9,0 |
| T5 Fin d'article | 9 | 10 | 10 | 8 | 9 | 9,2 |
| C1 Connecté, en-tête | 9 | 10 | 10 | 8 | 9 | 9,2 |
| C2 Connecté, mur | 9 | 10 | 10 | 8 | 9 | 9,2 |

**Seuil (9 sur chaque critère)** : atteint partout sauf **Envie (8)** sur T1, T2, T4, T5, C1 et C2, et **Confiance (8)** sur T3. Je ne valide pas encore de mon côté.

Grand progrès pour le sceptique : l'annuel dit « Renouvelé chaque année, sauf résiliation. » à côté du bouton et sur /register ; Stripe est nommé pour le visiteur ; la FAQ prix répond aux questions que je posais (« Les 14 jours courent dès ton abonnement, annuel compris. Un renouvellement n'ouvre pas de nouveau délai. ») ; les limites gratuites ont une unité ; plus de page d'attente ; la promesse « S'abonner et la garder » est tenue (T4/07, étoile pleine).

## Détail par trajet (320 x 640)

### T1 En-tête, mensuel (01 → 06)
- **1. Offre : 9.** T1/02 : quoi, combien et ce qui est bloqué se lisent en 3 s ; « Deviens Marrant » en violet se lit enfin comme le nom du site. Cause du -1 : « Un nouveau carnet de répartie chaque mois » (3e coche) reste opaque sur le premier écran ; on comprend ce qu'est un carnet juste sous le pli (« La situation offerte d'octobre, et la réplique qui va avec. »). **Correction** : 3e coche « Un carnet de répartie chaque mois : des situations et la réplique qui va avec ».
- **2. Promesse : 9.** Échos bons jusqu'à Stripe. Cause du -1 : T1/06, je viens de /conseils et j'arrive sur /parcours avec « Reprends là où tu t'étais arrêté. » : je ne m'étais pas arrêté là. **Correction** : renvoyer vers la page d'origine du clic (la source est déjà mesurée), ou écrire « Tout est ouvert : les listes, les parcours, le carnet du mois. » sans la dernière phrase quand le retour ne se fait pas sur la page d'origine.
- **3. Clics : 10.** /abonnement, /register (2 champs ou Google), attente dans le bouton (T1/05), Stripe.
- **4. Envie : 8.** « Le carnet, en vrai » arrive maintenant juste sous le bloc prix (T1/03), bien mieux. Reste : le premier écran décrit encore un catalogue (« Tout le catalogue : vannes, conseils, vidéos ») avant tout bénéfice vécu, et la FAQ YouTube, ma vraie objection, reste fermée par défaut. **Correction** : 1re coche tournée vers la scène, par exemple « Une vanne prête pour le pot de départ, le dîner ou le date : tout le catalogue » (catégories vues sur /vannes) ; ouvrir par défaut la FAQ « C'est quoi la différence avec juste regarder des vidéos YouTube ? ».
- **5. Confiance : 9.** À 320 x 640, la garantie passe sous le pli : le bas du premier écran montre « Tu crées ton compte, puis tu paies par carte sur Stripe. » puis « Premium : premier paiement » coupé (T1/02, bas). La grille veut la garantie visible près du bouton. **Correction** : sous 360 px, inverser les deux lignes (garantie juste sous le bouton, puis la ligne compte et Stripe), ou réduire l'espace entre les coches.

### T1 annuel (02 → 05b)
- **1. Offre : 9.** Même cause que T1 mensuel.
- **2. Promesse : 10.** « S'abonner · 24,99 €/an » → /register « Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. » → 05b « Ton compte est prêt. Premium, 24,99 €/an, renouvelé chaque année. » Écho exact.
- **3. Clics : 10.**
- **4. Envie : 8.** Même cause et correction que T1.
- **5. Confiance : 9.** « Renouvelé chaque année, sauf résiliation. » est au bon endroit. Même cause de pli que T1 : le bouton est visible (T1-annuel/02, bas), la ligne compte et la garantie sont dessous. Même correction.

### T2 Mur de liste (01 → 05)
- **1. Offre : 9.** Même cause que T1.
- **2. Promesse : 10.** « Ouvrir la suite des vannes · 2,99 €/mois » → « Pour la suite des vannes » (16 px, lisible) → « Premium ouvre tout » → /register « Après le paiement, la suite des vannes s'ouvre. ». Rupture du tour 1 réglée.
- **3. Clics : 10.**
- **4. Envie : 8.** Le moment est bon (T2/01 : « Les 10 vannes gratuites, c'est fait. », carte au cadenas), mais /abonnement repart sur la description générale. Même correction que T1.
- **5. Confiance : 9.** Même pli que T1 (T2/02 : bas du bouton à 613 px, la garantie n'apparaît pas). Même correction.

### T3 Fin d'étape 1 (01a → 01 → 04 → 05)
- **1. Offre : 9.** T3/01a : « Étape 2 sur 4 », « Le rythme et les silences », « Premium ouvre la suite et les autres parcours d'un coup. » Cause du -1 : la seule phrase qui dit ce que j'apprends est tronquée, « Ici, tu apprends à repére… » (T3/01a, carte). **Correction** : afficher la description entière de l'étape (2 ou 3 lignes à 320 px).
- **2. Promesse : 10.** « Passer à l'étape 2 » → /register « l'étape 2 de Répartie s'ouvre : Le rythme et les silences. »
- **3. Clics : 10.**
- **4. Envie : 9.** « Bien joué ! » puis l'étape suivante nommée, au moment où je viens de finir : le meilleur trajet. -1 : même description tronquée. Même correction.
- **5. Confiance : 8.** (a) « TTC » n'apparaît nulle part sur ce trajet : bouton « 2,99 €/mois », /register « Premium, 2,99 €/mois. » (en v1, /register disait « 2,99 € TTC par mois ») ; (b) l'annuel à 24,99 € reste invisible sur ce trajet (déjà relevé au tour 1). **Correction** : /register « Premium, 2,99 € TTC/mois. » (vaut pour tous les trajets) ; sous « D'abord ton compte, puis le paiement. », un lien « Ou 24,99 € TTC/an » qui coche l'annuel, si /register peut le prendre.

### T4 Fenêtre Premium (01 → 07)
- **1. Offre : 9.** T4/02 : « Garde-la avec Premium », rappel de la vanne, « Il ouvre aussi tout le catalogue et les 5 parcours. », 2,99 €, « D'abord ton compte, puis le paiement. » : tout y est. Cause du -1 : la citation est coupée au milieu de la phrase, « Moi, dix... » (la vanne complète, T4/01, dit « Moi, dix euros. ») ; on croit à un bug. **Correction** : citer la phrase entière, ou couper à la fin d'une phrase.
- **2. Promesse : 9.** « S'abonner et la garder » → /register « Après le paiement, ta vanne est dans tes favoris. » → T4/07 étoile pleine : promesse tenue. Cause du -1 : la bienvenue (T4/06) ne parle pas de la vanne, et il faut défiler pour voir l'étoile. **Correction** : dans la bienvenue, quand on arrive de la fenêtre, « Ta vanne est dans tes favoris. » à la place de « Reprends là où tu t'étais arrêté. ».
- **3. Clics : 10.**
- **4. Envie : 8.** Bien mieux qu'au tour 1 (6 → 8) : je vois enfin ce que Premium contient. Reste : le favori est le motif le plus faible du site, et la fenêtre ne montre rien de vécu au-delà de la vanne que je garde. **Correction** : remplacer « Il ouvre aussi tout le catalogue et les 5 parcours. » par « Premium ouvre aussi toutes les vannes et les 5 parcours. » (sujet explicite, « vannes » plus concret que « catalogue » ici).
- **5. Confiance : 9.** Le prix de la fenêtre est « 2,99 € /mois », sans « TTC » (T4/02, aux deux tailles), et /register non plus : « TTC » n'apparaît nulle part sur ce trajet. **Correction** : « 2,99 € TTC / mois », comme sur /abonnement.

### T5 Fin d'article (01 → 05)
- **1. Offre : 9.** Même cause que T1.
- **2. Promesse : 10.** « Tout ouvrir · 2,99 €/mois » (bouton plein) → « Premium ouvre tout » → « Après le paiement, tout s'ouvre. ». Le bloc dit aussi « Premium ouvre tout : le catalogue et les 5 parcours. » : écho complet.
- **3. Clics : 10.**
- **4. Envie : 8.** Même cause et correction que T1 pour /abonnement. Le bloc d'article, lui, est juste : bouton payant en premier, sortie gratuite « Tester mes premières répliques, gratuit · Sans compte. » en dessous.
- **5. Confiance : 9.** Même pli que T1 (T5/02). Même correction.

### C1 et C2 (compte sans abonnement)
- **C1** : 9 / 10 / 10 / 8 / 9. « Paiement sécurisé par Stripe » sous le bouton, attente dans le bouton (C1/04) : rien à redire sur le trajet. Envie et pli de la garantie (« Premium : premier paiement » coupé en bas de C1/02) : mêmes causes et corrections que T1.
- **C2** : 9 / 10 / 10 / 8 / 9. Même écho que T2 (« Ouvrir la suite des vannes » → « Pour la suite des vannes »). Mêmes réserves.

### Ordinateur, 1 280 px (hors note)
Premier écran complet : prix, deux formules, bouton, ligne Stripe, garantie, « Le carnet, en vrai » qui pointe en bas. Seul détail : dans la carte « Mensuel », le prix est centré verticalement alors que celui de « Annuel » est en haut, donc « 2,99 € » et « 24,99 € » ne sont pas sur la même ligne. **Correction** : aligner les deux cartes en haut.

## Revérification des 5 défauts du tour 1

| # | Défaut du tour 1 | État en v2 | Preuve |
|---|---|---|---|
| 1 | La fenêtre vend un favori, pas Premium ; « je la garde » non prouvé | **Réglé** (reste TTC et citation coupée) | T4/02 ligne Premium et ligne compte ; T4/04 ; T4/07 étoile pleine |
| 2 | Le meilleur argument arrive trop tard, FAQ fermées | **En partie** : le carnet est remonté sous le bloc prix ; la FAQ YouTube reste fermée, le premier écran reste descriptif | T1/03 ; T1/02 |
| 3 | Limites gratuites sans unité | **Réglé** | T2/01 « Les 10 vannes gratuites » ; tableau « 10 vannes, 3 conseils, 3 vidéos dans les listes », « 1 situation par carnet » |
| 4 | Renouvellement, Stripe, ce qu'on garde après résiliation | **Presque réglé** : renouvellement et Stripe dits, FAQ prix claire. Reste sans réponse : ce que je garde si j'arrête | T1-annuel/02 ; T1/02 ; FAQ-prix |
| 5 | Contexte perdu sur /register, écran d'attente en trop | **Réglé** | /register « Ton compte, puis le paiement » + ligne de contexte par trajet ; T1/05 attente dans le bouton |

## Phrases douteuses du tour 1 : revérification

- « Voir la suite des vannes » : **réglé** (« Ouvrir la suite des vannes »).
- « Les 10 gratuites, c'est fait. », « 10, 3 et 3 » : **réglés**.
- « Situation 15, offerte » / « Il en reste 14 » : **réglé** (« La situation offerte d'octobre »).
- « Premium ouvre tout Deviens Marrant » lu comme un ordre : **réglé** par la couleur de marque.
- « Te voilà connecté. » : **réglé** (attente dans le bouton ; « Ton compte est prêt. » sur l'attente de connexion).
- Garantie « 14 jours à compter de quoi, annuel compris ? » : **réglé** dans la FAQ prix.
- Renouvellement de l'annuel : **réglé**.
- Lettre gratuite contre carnet Premium : **en partie**. Le formulaire de lettre a quitté le bloc T5, mais T3/01a met « Lettre gratuite : une vanne décryptée par mois. » juste sous le bouton payant, alors que Premium promet « Un nouveau carnet de répartie chaque mois ». Pas une faute de la grille, mais le sceptique hésite entre les deux.
- « Toutes les situations » (tableau) contre « le carnet du mois » (bienvenue, T1/06) : **reste ambigu**. Avec Premium, j'ai les carnets passés ou seulement celui du mois ?

## Nouveaux défauts relevés en v2

1. **« TTC » a disparu de /register** (« Premium, 2,99 €/mois. », tous trajets) et de la fenêtre T4 (« 2,99 € /mois »). Sur T3 et T4, qui ne passent pas par /abonnement, le visiteur ne voit jamais « TTC ». Critère Confiance de la grille.
2. **À 320 x 640, la garantie passe sous le pli** sur le premier écran de /abonnement (T1, T1 annuel, T2, T5, C1, C2) : le bouton est visible, la garantie est coupée juste dessous.
3. **La barre fixe « S'abonner · 2,99 €/mois » cache la fin de la réponse prix** à 320 x 640 (FAQ-prix/320x640, bas : la réponse s'arrête à « …annuel compris. Un »). À 375 x 700, la réponse est entière. **Correction** : marge basse de la page égale à la hauteur de la barre. À vérifier aussi : la barre doit afficher « 24,99 €/an » quand l'annuel est coché (je ne le vois pas sur les captures).
4. **« Reprends là où tu t'étais arrêté. »** est faux pour T1 : départ de /conseils, arrivée sur /parcours (T1/06).
5. **Textes tronqués** : « Ici, tu apprends à repére… » (T3/01a) et « Moi, dix... » (T4/02).
6. Détail typographique : sur la page de retour à 320 px, le titre passe à la ligne avant les deux-points (« Parcours humour / : deviens drôle », T1/06). **Correction** : espace insécable avant « : ».

## Les 5 défauts les plus coûteux, après le tour 2

1. **Envie bloquée à 8** : le premier écran de /abonnement décrit un catalogue au lieu d'une scène, et la FAQ YouTube reste fermée. C'est le seul critère sous le seuil sur 6 trajets.
2. **« TTC » absent sur T3 et T4 de bout en bout**, et absent de /register partout.
3. **Garantie sous le pli à 320 x 640** sur le premier écran de /abonnement.
4. **Barre fixe qui masque la réponse prix** à 320 x 640 (et formule de la barre à vérifier en annuel).
5. **Retour après paiement approximatif** : « Reprends là où tu t'étais arrêté. » faux en T1, vanne non mentionnée en T4 ; et toujours aucune réponse à « Si j'arrête, je garde quoi ? ».

Contrôles de la grille : chiffres cohérents partout (2,99 €, 24,99 €, 2,08 €/mois, « plus de 3 mois offerts », « 1 500+ » inchangé) ; phrase de garantie intacte ; aucune mention légale dans un bouton ; aucun tiret cadratin vu ; aucune promesse de résultat vue.
