# Contrôle v1 : concision du parcours d'achat

> Sources : `textes-v1-a.md`, `-b.md`, `-c.md`. « Avant » = chiffres de `inventaire-et-etalons.md` §1 (total / hors bouton) ; « (r) » = recompté par moi sur le code du worktree. « Après » = mots hors bouton selon la convention de `textes-v1-a.md` §0 : les libellés des boutons pleins et des liens d'action sont exclus, **la réassurance fixe de 11 mots (REASS) est comptée à part** (voir « Points à trancher » n°1). Aucun texte validé en étalon n'a été modifié.

## 1. Tableau récapitulatif

| # | Surface | Mots avant (total / hors bouton) | Mots après (hors bouton) | Budget | OK |
|---|---|---|---|---|---|
| 1 | /abonnement visiteur (hors FAQ et fiche) | 316 / 311 | 115 (117 en état annuel) | 120 | OK |
| 2 | /abonnement compte connecté (E3) | 314 / 309 | 93 | 120 | OK |
| 3 | Carte Premium accueil (B4+B5) | 260 / 250 | 30 (+ REASS 11 = 41) | 40 | OK hors REASS (strict : +1) |
| 4 | E1 paywall du carnet | 182 / 176 | 21 (+ REASS 11 = 32) | 25 | OK hors REASS |
| 5 | E-mail de confirmation | 158 | non réécrit | n/a | signalement (§4) |
| 6 | B2 fin d'article | 145 / 140 | 22 (déclinaisons : 19 à 24) | 25 | OK |
| 7 | B12 résultat quiz d'humour | 120-142 / 113-135 | 22 à 25 | 25 | OK |
| 8 | B7 murs de liste | 121-123 / 104-106 | 17 à 19 (+ REASS) | 25 | OK |
| 9 | B8 fiche vanne | 121 / 106 | 22 (+ REASS) | 25 | OK |
| 10 | B13 résultat quiz d'orientation | 117 / 112 | 16 à 20 (+ REASS) | 25 | OK |
| 11 | B10 fiche vidéo | 117 / 102 | 22 (+ REASS) | 25 | OK |
| 12 | E5 fin de /glossaire | 114 / 109 | 21 (+ REASS) | 25 | OK |
| 13 | Composant « 4 avantages » | 110 (×3 surfaces) | 30 (×1 surface) | 30 | OK |
| 14 | B9 fiche conseil | 110 / 93 | 23 (+ REASS) | 25 | OK |
| 15 | E6 fin de /a-propos | 100 / 95 | 14 (+ REASS) | 25 | OK |
| 16 | B14 fin d'étape 1 (+ lettre) | 99 / 93 | 25 (+ REASS) | 25 | OK |
| 17 | E-mail paiement refusé | 98 | non réécrit | n/a | n/a |
| 18 | /register | 87 / 77 | 20 (hors champs, REASS, CGU) | 25 | OK |
| 19 | B18 lettre dans l'article | 84 / 81 | 16 (hors case et mention) | 25 | OK |
| 20 | B11 fenêtre Premium, 7 gestes | 73-78 / 67-72 | 14 à 24 (+ REASS) | 25 | OK |
| 21 | E4 carte « Abonnement » du profil | 62 / 59 | 11 (+ REASS) | 25 | OK |
| 22 | B1 encart démo | 60 / 57 | 10 hors scène (36 avec la scène de 26 mots) | 25 | OK (scène = le produit, exemptée) |
| 23 | E-mail de résiliation | 51 | non réécrit | n/a | n/a |
| 24 | « Pas encore sûr ? » | 50 / 25 | 9 | 25 | OK |
| 25 | B3 haut de l'accueil (hors H1 gardé) | 45 / 40 (bloc) ; 87 / 82 (haut entier, r) | 21 | 40 | OK |
| 26 | Paywall `premium-paywall.tsx` (web) | ≥ 42 | 15 (+ REASS) | 25 | OK |
| 27 | « Ton point de départ » (quiz d'humour) | 29 / 24 | fondu dans B12 (ligne 7) | 25 | OK |
| 28 | Mur d'une étape payante (aperçu, parcours) | 26 / 21 ; page 60 (r) | 15 (aperçu complet) | 25 | OK |
| 29 | Carnet extrait (/abonnement) | 23 / 18 | 10 (+ lien 4) | 25 | OK |
| 30 | Page de retour après paiement | 10 / 10 | 10 (émoji retiré) | 25 | OK |
| 31 | B15 carte de parcours | 19 / 14 | 6 | 25 | OK |
| 32 | E2 compte connecté (carte d'accueil) | 19 / 14 | 10 (ajoutés au titre et à la phrase de la carte : 35 + REASS) | 40 | OK hors REASS |
| 33 | Upsell annuel du profil abonné | 12 / 12 | 12 (inchangé, 1 phrase) | 15 | OK |
| 34 | Validation d'étape 1 (quiz en cours) | 11 / 6 | 6 (+ REASS) | 25 | OK |
| 35 | B6 bouton d'en-tête | 1-2 / 0 | 1 / 0 | n/a | OK (inchangé) |
| + | /carnet intro (donnée) | 53 (r) | 13 | 40 | OK |
| + | FAQ de vente accueil et /abonnement | 8 questions, ≈ 600 mots | 4 questions | 4 | OK |

**Mesure du diff** : le total hors bouton des surfaces du tableau passe d'environ 2 400 mots à environ 570 (-76 %, somme des lignes ci-dessus sans doublon, REASS à part) ; les 22 « pavés » de l'inventaire sont tous ramenés sous leur budget. Étalons 1 à 6 repris mot pour mot, sauf un écart assumé : le lien payant du haut de l'accueil (étalon 1) est retiré par la règle validée le même jour. Intouchables vérifiés : « 1 500+ » (hero, carte d'accueil, E6) ; prix 2,99 €/mois (partout), 24,99 €/an, 2,08 € par mois, 10,89 € économisés (uniquement /abonnement) ; titre d'accueil « Tu parles et personne rit. / On va arranger ça. » ; FAQ : « 8 semaines », « 50 XP par semaine », « introvertis » intacts (Q1, Q2 gardées telles quelles) ; slugs, H2, liens de navigation non touchés.

## 2. Faits par page (un fait une fois par page)

| Page | Fait | Dit une fois, où | Répétitions assumées |
|---|---|---|---|
| Accueil (visiteur) | Étape 1 gratuite / sans compte | haut : bouton « …gratuit » + « Sans compte. » | la carte (étalon 5) le redit (phrase + lien) ; version stricte prête (textes-v1-a §4) |
| | Résiliation et remboursement | REASS de la carte, seule | aucune ; la FAQ prix ne les redit plus |
| | Prix mensuel | bouton de la carte | chip « 2,99 €/mois » du header (composant permanent) |
| | « 1 500+ » | hero (sous le H1) | carte (« Déjà 1 500+ inscrits ») : deux formulations fixées par le choix du 03/10, écrans différents |
| | 5 parcours | phrase de la carte | label du bouton |
| Article | Sans compte | B1 (la fiche), B2 (l'étape 1), B18 (la lettre) | trois objets distincts (réplique, étape, lettre) |
| | Prix | lien de B2 | aucune |
| Fiche vanne / conseil / vidéo | Prix et garantie | bouton + REASS | aucune (le lien d'étape 1 ne redit rien) |
| Mur de liste | Limite gratuite (10/3/3) | ligne unique | aucune |
| Fenêtre Premium | Prix | prix en gros | pas dans le bouton (6 gestes sur 7 n'ont pas de prix dans le bouton) |
| Quiz humour / orientation | Étape 1 gratuite (humour) ; parcours conseillé (orientation) | une fois chacun | aucune |
| Page parcours (visiteur) | Étape 1 offerte, étapes 2 à N Premium | barre de progression | fin d'étape 1 redit « les suivantes s'ouvrent d'un coup » (autre fait : l'ouverture) |
| /abonnement | Durée d'une étape | sous-titre | aucune |
| | Étape 1 gratuite | « Pas encore sûr ? » | aucune |
| | Résiliation / remboursement | REASS | aucune (FAQ prix sans résiliation) |
| | Prix annuel et économie | sélecteur (pastille en mensuel, ligne en annuel) | aucune |
| | Contenu (parcours, carnet, favoris, listes) | avantages (4 lignes) | titre E3 pour le compte connecté (étalon 3) redit parcours + carnet |
| | Stripe | FAQ prix (visiteur) / ligne sous le bouton (connecté) | aucune |
| /register | Prix | sous-titre | aucune |
| | Remboursement / résiliation | REASS sous le plein | aucune |
| /carnet | Nombre de fiches restantes | titre du paywall | « Voir les 14 autres répliques » (étalon 4) |
| /profil | Offre | « tout s'ouvre d'un coup » | aucune |
| /glossaire, /a-propos | Étape 1 gratuite | lien | aucune ; /a-propos redit « 1 500+ » dans son corps (P0, gardé) |

## 3. Vérifications « rien de faux »

- Toutes les étapes s'ouvrent d'un coup avec Premium : « les suivantes s'ouvrent d'un coup » (B14), « Tout s'ouvre d'un coup » (E3, profil, 5 fins de page). Jamais « une par semaine » comme calendrier ; plus aucune formule de rythme dans les blocs (le « idéalement une par semaine » de B13 disparaît).
- Résiliation : seulement « Résiliable depuis ton profil » (REASS) ; « en 1 clic » supprimé de la FAQ prix (faux, à corriger aussi dans `llms-content.ts` l. 78 et 154) ; plus aucun « en ligne » ni « annulable à tout moment » dans le parcours (les 6 formulations tombent à 1).
- Remboursement : premier paiement seulement, sous 14 jours, dans REASS. Aucun texte ne parle de renouvellement remboursable.
- Étape 1 lisible sans compte : « Sans compte. » (haut d'accueil, B2, B12, B15), « Lire l'étape 1, sans compte » (/register). Vrai pour les 5 parcours.
- Aucune promesse de résultat : « pour répondre quand on te chambre » (but, pas résultat), « ça s'entraîne » (pas « tu seras drôle »). « Retrouver le rire à table, sans te forcer » (titre /abonnement Confiance) est le titre déjà validé.
- Zéro émoji (🎉 de la page de retour retiré), guillemets « », tutoiement partout ; aucun nom de concurrent ajouté (seule occurrence : « YouTube » dans la question 4 de la FAQ, texte existant gardé tel quel, à signaler à Thomas).
- **Grep tirets cadratins (caractère U+2014) dans `docs/copy/cta-s21/concision/` : 0 occurrence** (fichiers a, b, c et ce contrôle).

## 4. Points à trancher par Thomas (6 réponses suffisent)

1. **REASS hors budget** : comptée à part (11 mots), car les étalons 4 et 5 validés dépassent sinon le budget (32 et 41 mots). OK ?
2. **Lien payant du haut de l'accueil** : retiré (règle validée) ; l'étalon 1 le gardait. On suit la règle ? (ligne prête sinon)
3. **FAQ prix** : retirer les 3 chiffres annuels de la réponse (déjà dans le sélecteur) et la fausse « 1 clic » ? Repli prêt qui ne corrige que « 1 clic ». Et « progresser à ton rythme » (Q2) : on garde ou on remplace ?
4. **Titre /abonnement Répartie** : « Ta réplique en soirée, pas dans le bus du retour » (10 mots) à la place de « pendant la soirée » (11). OK ? Les surtitres et titres des 3 autres parcours sont raccourcis aussi.
5. **Carte d'accueil, version stricte** (phrase de 8 mots sans « l'étape 1 de chacun est gratuite » puisque le haut le dit) : oui ou non ?
6. **Google avant le formulaire** sur /register (reco audit, non validée le 18/10) : non touché. Et le prénom se demande dans /profil (champ existant) : OK ?

Phrase de l'e-mail de confirmation à corriger : voir `textes-v1-c.md` §10 (retirer « (la première se lit déjà sans compte) »).
