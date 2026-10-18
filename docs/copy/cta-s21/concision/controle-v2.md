# Contrôle v2 : concision du parcours d'achat

> Sources : `textes-v2-a.md`, `-b.md`, `-c.md`. « Avant » = chiffres de `inventaire-et-etalons.md` §1 (total / hors bouton). v1 = `controle-v1.md`. v2 = mots hors bouton selon la convention de `textes-v2-a.md` §0 (liens d'action exclus, REASS de 11 mots à part, sauf /abonnement où liens et REASS sont comptés). Les 12 arbitrages ont été appliqués ; les retouches des trois relectures ont été reprises quand deux convergent, sinon la meilleure (voir §6).

## 1. Tableau récapitulatif (mots hors bouton)

| # | Surface | Avant | v1 | v2 | Budget | OK |
|---|---|---|---|---|---|---|
| 1 | /abonnement visiteur (liens et REASS compris) | 316 / 311 | 115 | 106 max (annuel 104) | 120 | OK |
| 2 | /abonnement compte connecté | 314 / 309 | 93 | 95 max | 120 | OK |
| 3 | Carte Premium accueil (+ REASS) | 260 / 250 | 30 | 19 (+11) | 40 | OK |
| 4 | Paywall /carnet (+ REASS) | 182 / 176 | 21 | 21 (+11) | 25 | OK |
| 5 | Fin d'article | 145 / 140 | 22 (19 à 24) | 22 (18 à 20) | 25 | OK |
| 6 | Quiz d'humour | 120-142 / 113-135 | 22 à 25 | 19 à 25 | 25 | OK |
| 7 | Murs de liste (+ REASS) | 121-123 / 104-106 | 17 à 19 | 11 à 13 | 25 | OK |
| 8 | Fiche vanne / conseil / vidéo (+ REASS) | 121 / 110 / 117 | 22 / 23 / 22 | 17 / 18 / 21 | 25 | OK |
| 9 | Quiz d'orientation (+ REASS) | 117 / 112 | 16 à 20 | 14 à 18 | 25 | OK |
| 10 | Fin de /glossaire (+ REASS) | 114 / 109 | 21 | 21 | 25 | OK |
| 11 | Fin de /a-propos (+ REASS) | 100 / 95 | 14 | 11 | 25 | OK |
| 12 | Fin d'étape 1 + lettre (+ REASS) | 99 / 93 | 25 | 23 | 25 | OK |
| 13 | /register | 87 / 77 | 20 | 20 (22 max) | 25 | OK |
| 14 | Lettre dans l'article | 84 / 81 | 16 | 13 | 25 | OK |
| 15 | Fenêtre Premium, 7 gestes (+ REASS) | 73-78 / 67-72 | 14 à 24 | 6 à 10 | 25 | OK |
| 16 | /profil sans abonnement (+ REASS) | 62 / 59 | 11 | 9 | 25 | OK |
| 17 | Encart démo (hors scène) | 60 / 57 | 10 | 7 | 25 | OK |
| 18 | Haut de l'accueil (hors H1) | 87 | 21 | 18 | 40 | OK |
| 19 | Paywall web (+ REASS) | ≥ 42 | 15 | 12 | 25 | OK |
| 20 | Page d'un parcours, aperçu | 55 | 15 | 12 | 25 | OK |
| 21 | Page de retour après paiement | 10 | 10 | 6 | 25 | OK |
| 22 | Cartes /parcours | 19 / 14 | 6 | 5 | 25 | OK |
| 23 | Carte d'accueil, compte connecté (+ REASS) | 19 / 14 | 35 | 23 (+11) | 40 | OK |
| 24 | Validation d'étape, quiz en cours (+ REASS) | 11 / 6 | 6 | 6 | 25 | OK |
| 25 | Bouton d'en-tête | 1 | 1 | 1 | 0 levé | OK |
| 26 | Avantages (composant, /abonnement seulement) | 110 (×3) | 30 | 26 | 30 | OK |
| 27 | Intro /carnet (donnée) | 53 | 13 | 13 | 40 | OK |

Somme des maxima des surfaces 1 et 3 à 24 (avantages inclus dans /abonnement, REASS à part) : v1 568, v2 478 (-16 % de mots vs v1 ; vs « avant » ≈ 2 400 : -80 %). **Mesure du diff v1 → v2** (comptage à la main des blocs) : sur 171 blocs de texte (titre, phrase, note, libellé), **99 changent (≈ 58 %)**, 72 restent identiques ; par partie : A 15 sur 35, B 54 sur 82, C 30 sur 54. Les e-mails de paiement refusé et de résiliation ne sont pas touchés.

## 2. Libellés uniques et où ils sont

| Libellé | Emplacements |
|---|---|
| « Tester mes premières répliques, gratuit » (GRATUIT_ACCUEIL) | A§1 bouton du haut d'accueil ; A§3 bouton de fin d'article générique ; A§4 et A§5 lien de la carte d'accueil |
| « Tester l'étape 1 de {P}, gratuite » (GRATUIT_P) | A§3 5 déclinaisons ; B§1 lien des 3 murs ; B§2 lien des 3 fiches ; B§4 bouton du quiz d'humour ; B§7 bouton des 5 cartes ; C§1 « Pas encore sûr ? » ; C§4 lien de /register ; C§8 lien de /glossaire et /a-propos |
| « Ouvrir les 5 parcours · 2,99 €/mois » (OUVRIR) | A§3 lien fin d'article ; A§4 bouton carte ; B§4 lien du quiz d'humour ; B§5 plein du quiz d'orientation ; B§8 `APERCU_LIEN` et valeur générique de `MUR_PREMIUM_BOUTON` ; C§1 bouton ; C§7 bouton du profil ; C§8 boutons ; C§9 paywall |
| Libellés de geste conservés | « Voir la suite des vannes / conseils / vidéos · 2,99 €/mois » (murs) ; « Écrire la mienne », « Essayer ce conseil », « Décrypter cette vidéo » (fiches) ; « Passer à l'étape 2 · 2,99 €/mois » (fin d'étape 1) ; « Voir les {N} autres répliques · 2,99 €/mois » (carnet) ; « Je m'abonne et … » (fenêtre) ; « Créer mon compte et passer au paiement » (/register) ; « 2,99 €/mois » (en-tête) |
| Supprimés (Grep = 0 hors lignes « Disparaît ») | « Ouvrir {P} en entier », « Ouvrir toutes les étapes », « Tout ouvrir », « S'abonner », « Voir Premium », « Voir ce que contient Premium », « Commencer {P}, étape 1 gratuite », « Lire l'étape 1 de {P}, gratuite », « Lire l'étape 1, sans compte », « Tester mes premières vannes, gratuit » |

« Gratuite » partout pour l'étape 1 ; « offerte » ne reste que pour la fiche du carnet (« la réplique offerte », « Situation offerte ce mois-ci »), un autre objet.

## 3. Comptes des tics (dans le texte exact, hors lignes « Disparaît »)

| Tic | Limite | Compte | Où |
|---|---|---|---|
| « X, pas Y » | 2 | 2 | fin d'article générique ; titre /abonnement Répartie |
| « Et si… ? » | 1 | 1 | titre de la carte d'accueil (variantes visiteur et connecté du même titre) |
| « sans (te) forcer » | 1 | 1 | titre /abonnement Confiance |
| « d'un coup » | 1 par page | 1 par page | carte d'accueil ; fin d'étape 1 ; sous-titre /abonnement (retiré du profil et du connecté) |
| « le soir où » | 1 | 1 | titre de la fiche conseil (retiré des favoris de la fenêtre) |
| « ça s'entraîne » | 1 | 1 | fin d'article (retiré du glossaire) |
| « à la fois », « cran par cran », « une conversation à la fois » | 0 | 0 | « d'un cran » reste une fois dans l'intro du carnet (donnée) |
| Même blague sur deux surfaces voisines | 0 | 0 | mur /videos garde « pour rire / pour faire rire » ; la fiche vidéo n'y joue plus. Quiz Storytelling (dessert) et /abonnement : le surtitre est supprimé |
| « 1 500+ inscrits » | 1 par page | 1 par page | accueil (haut) ; /a-propos (fin ; le corps ne porte plus le chiffre) ; carte d'accueil sans preuve |

## 4. Conformité aux 12 arbitrages

1 libellés uniques : §2. 2 en-tête « 2,99 €/mois ». 3 FAQ prix : réponse mensuelle exacte du brief (la question « c'est vraiment tout ? Pas de frais cachés ? » va avec « Oui. ») ; variante annuelle pour /abonnement ; « paiement sécurisé » une fois par état de /abonnement. 4 Machine à Café : « Étape 2 sur {N} » lu dans la donnée, « Sans compte. La suite : Premium. », « La suite avec Premium », plus aucun « étapes 2 à 4 ». 5 inscrits : fait. 6 tics : §3. 7 carte connectée : la ligne remplace la phrase, une raison (« Ton compte est prêt : de la coloc à l'afterwork, tout s'ouvre d'un coup. »). 8 /abonnement ≤ 120 dans tous les cas (106 au plus), surtitres supprimés, économie annuelle dite une fois par état. 9 /profil : plus de ligne XP ni de « tout s'ouvre » ; bouton OUVRIR, phrase sur le carnet. 10 fenêtre : 4 éléments, plus de « reste là », plus de lien étape 1. 11 reprises des relecteurs : B§8, B§6, B§5, C§9, FAQ (§6). 12 protégés présents : « 15 à 20 minutes » (sous-titre /abonnement), titre d'accueil, prix, REASS unique ; « 8 semaines » et « 50 XP » (FAQ Q1) non touchés ; YouTube (FAQ Q4) non touché.

## 5. Vérifications « rien de faux »

- Tout s'ouvre d'un coup avec Premium : repris des faits v1 (toutes les étapes suivantes, les 5 parcours). Aucune formule de rythme.
- Résiliation : REASS seule. « Pas de reconduction surprise » et « en 1 clic » retirés de la FAQ (faux) ; même correction à faire dans `llms-content.ts` l. 78 et 154.
- Remboursement : premier paiement, sous 14 jours, dans REASS uniquement.
- « Sans compte » : seulement sous un bouton qui ouvre l'étape 1 ou le quiz (une fois par article).
- Aucune promesse de résultat ; aucun témoignage ; aucun nom de concurrent ajouté (YouTube : FAQ Q4, texte existant non touché).
- Calculs annuels : 24,99 / 12 = 2,08 € ; 24,99 € = 8,4 mois payés, donc « plus de 3 mois offerts » exact.
- **Grep tiret cadratin (U+2014) dans `docs/copy/cta-s21/concision/` : 0 occurrence** (textes-v2-a, -b, -c et ce fichier).

## 6. Reprises des relectures et choix à connaître

- **Reprises convergentes** : suppression des surtitres /abonnement et du paragraphe connecté (R1, R3) ; ligne annuelle « Soit 2,08 € par mois, plus de 3 mois offerts. » (R1, R3) ; avantage 3 « Tes favoris sous la main » (les 3) ; `APERCU_INTRO` supprimé (les 3) ; « Ton parcours : {P} » (R2, R3) ; titre de la fiche vanne « Demain, c'est peut-être la tienne qu'on répète » (R2, R3) ; « Ces techniques, rode-les avant la prochaine pique » (R1, R2) ; Machine à Café et Boulot (R2, R3) ; note de la démo supprimée (R1, R3) ; lettre « Gratuite, par e-mail… » (R1, R3) ; titres favori « sous le coude » (R1, R3) ; /register « Ton compte, puis le paiement » (R1, R3) ; carnet « Un nouveau carnet arrive chaque mois. » (R2, R3).
- **Choisies faute de convergence** : phrase de fin d'étape 1 (R2, répond à la peur « payer pour débloquer au compte-gouttes ») ; limite des murs « Fin des N … gratuit(e)s. » (R1) ; texte conseil (R3) ; texte vidéo (R2) ; raisons TAQUIN et ABSURDE (R1) ; phrase Confiance du quiz d'orientation (R3) ; retour de paiement « Merci. Ton accès s'active… » (R2, évite la promesse « quelques secondes ») ; texte du paywall (R1 + R2).
- **Nouveaux textes sans relecture** (à passer à l'aveugle) : titres de mur « D'autres vannes à ressortir plus bas » et « Pour la prochaine fois qu'on te chambre » ; titre vidéo « Une salle, c'est son métier. Toi, une table suffit. » (épicène) ; titres Machine à Café / Boulot de /abonnement « Faire rire au bureau, au bon moment » ; phrase de carte « De la coloc à l'afterwork, tout s'ouvre d'un coup. » ; phrase profil « Avec Premium, un nouveau carnet de répartie chaque mois. » ; titres favori « Mets-la de côté », « Garde-la pour la revoir ». Aucune nouvelle vanne : titres neutres.

## 7. Points d'attention pour @fullstack / @design / @legal

1. **Libellés de geste conservés** (murs, fiches, fin d'étape 1, carnet, fenêtre, /register) : lecture de l'arbitrage 1. Si OUVRIR doit aussi les remplacer, seuls les boutons de B§1, B§2 et B§6 changent.
2. **Variante quiz en cours** (`ValidationWall`, `quizPending`) : le texte ne dit plus « Valider l'étape fait partie de Premium » ; vérifier que le bouton « Passer à l'étape 2 » convient à cet état (et le rendre plein, REASS dessous).
3. **Carte floutée des murs** : sans libellé, cliquable en entier, ouvre la fenêtre.
4. **FAQ** : deux variantes de la réponse prix (mensuel / annuel), donc JSON-LD différent de /abonnement quand l'annuel est proposé ; les 3 autres questions ne sont pas reprises dans les textes (non touchées).
5. **Chiffre « 10,89 € économisés »** : disparaît de /abonnement et de la FAQ (« plus de 3 mois offerts » le résume).
6. **Tests** : `hero-section.test.tsx` l. 30 et l. 86 attendent « 1 500+ membres bossent leur humour. Rejoins-les. » ; `offre-s16-lot-c.test.tsx` l. 111 (« 1 500+ intact ») à relire. `premium-cta.tsx` l. 114 (inscrits) disparaît ; `a-propos/page.tsx` l. 86 et 208-209 changent.
7. **Retour de paiement** : aucun bouton de suite dans le texte, à vérifier côté page.
8. **/glossaire** est une surface froide avec un plein payant (v1) : question ouverte pour @design.
9. **REASS sur /profil** : « depuis ton profil » est lue sur le profil lui-même, mineur ; à valider par @legal avec « remboursable sous 14 jours » sans « sur demande ».
10. **/profil, abonné mensuel** : la ligne d'upsell annuel n'est pas touchée.
