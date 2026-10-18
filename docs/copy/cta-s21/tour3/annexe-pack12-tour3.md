# Annexe tour 3, packs 1 et 2 (hors relecture : ne pas transmettre aux relecteurs aveugles)

Pack : `pack-12-tour3.md` (6 duels). Clés et sources : `cles-pack12-tour3.md`. Pas de nouvelle recherche de marché : tour de correction sur les verdicts du tour 2 (3 relecteurs), puis deux consignes de Thomas reçues en cours de rédaction : (1) conversion d'abord, « · Droit de rétractation » retiré de `[S12]` sans report ni validation ; (2) tous les libellés sont libres sauf « 1 500+ » et les prix, et A doit faire désirer (scène vécue, désir du résultat, un mot de clarté suffit). Garde-fous conservés : rien de faux, aucune promesse de résultat chiffrée ou garantie.

## 1. Taux de changement par bloc (comptage manuel de mots contre le gagnant du tour 2, marge de quelques points)

| Bloc | A (fusionné) | B (gagnant + corrections bloquantes) | Ce qui change dans A |
|---|---|---|---|
| B1 | ≈ 25 % | ≈ 20 % | Note `[S7]` seule. Vanne, `[S1]`, `[S3]`, bouton intacts. |
| B2 | ≈ 55 % | ≈ 15 % | Paragraphe réécrit (scène + 3 contenus d'étape + défi), bouton, lien, `[S9]` (+ « l'abonnement du site »). Surtitre et titre intacts. |
| B18 | ≈ 60 % | ≈ 6 % | Sous-titre (mention honnête), titre (virgule), ligne repliée (fusion des deux angles), bouton de dépliage. |
| B3 | ≈ 80 % | ≈ 25 % | Bouton, lien et note réécrits. |
| B4 + B5 | ≈ 85 % | ≈ 25 % | Titre, `[S11]`, en-tête de prix, `[S12]`, deux boutons. `[S13]`, 4 avantages, « 1 500+ » intacts. |
| B6 | 0 % (même libellé que le gagnant) | 100 % (c'est le libellé en ligne) | Voir §2. |

Rappel de la règle de duel : B garde les libellés d'avant. Pour B6, « le libellé d'avant » est « Commencer » (celui qui est en ligne et qui sert de référence de largeur), pas « Voir les prix » : le duel tranche donc nouveau contre ancien. Si Thomas préfère rejouer « Voir les prix » contre « Les prix » (le repli), c'est un changement d'une ligne dans le pack.

Intouchables : prix (2,99 €, 24,99 €, 2,08 €, 10,89 €), « 1 500+ », `[S13]`, les 4 avantages, H1 / paragraphe / pastilles de l'accueil, titre et surtitre de B2, slugs et liens inchangés. Zéro tiret cadratin et aucun mot trahissant l'origine dans le pack (contrôle par recherche).

## 2. Libellés réécrits : ce qui part en relecture, et les propositions

Thomas a libéré les libellés. Dans A, un mot de clarté suffit : le prix dans le libellé dit déjà que la destination est une page d'abonnement.

| Libellé d'avant | Dans A | Alternatives (ordre de préférence) |
|---|---|---|
| « Accéder aux parcours complets » (B2, B3) | B3 : « Débloquer tous les parcours, 2,99 €/mois » ; B2 : « Débloquer toute Répartie, 2,99 €/mois » | « Voir Premium et ses prix » (proposé par 3 relecteurs sur 3, plus clair, moins désirable) ; ma proposition claire : « Voir les parcours complets et les prix » ; « Débloquer les parcours, 2,99 €/mois ». Éviter « dès 2,99 € » : l'annuel revient à 2,08 € par mois, « dès » serait faux. |
| « Lire la première étape gratuite de Répartie » (B2, B3, B4 + B5) | « Tester mes premières répliques, gratuit » (39 caractères au lieu de 43) | « Commencer Répartie, étape 1 gratuite » (36) ; « Essayer d'abord l'étape 1 de Répartie ». Le libellé de A est vrai pour Répartie parce que le titre de l'étape 1 est « Tes premières répliques ». Pour les autres parcours, je n'ai pas lu les titres d'étape 1 : gabarit « Tester {titre de l'étape 1}, gratuit » seulement si le titre se lit comme un objet (à contrôler parcours par parcours), sinon repli « Commencer {parcours}, étape 1 gratuite ». |
| « Commencer à 2,99 €/mois » (B4 + B5) | « Débloquer tous les parcours, 2,99 €/mois » | « S'abonner, 2,99 €/mois » (le plus direct) ; « Je commence à 2,99 €/mois » (formule de première personne, jugée marketing par un relecteur du tour 2). |
| « Voir l'offre » / « Voir les prix » / « Commencer » (B6) | « Voir les prix » | Repli de largeur : « Les prix ». Écartés : « S'abonner » (≈ 68 px, passe, mais pression à froid, déjà rejeté au tour 2), « Débloquer » (≈ 70 px, ne dit pas quoi), « Tout débloquer » et « Premium 2,99 € » (débordent). Nom accessible conseillé : « Voir les prix de Premium ». |

**B6, largeur** (estimation par métriques d'Inter 600 à 14 px, sans rendu : pas d'outil d'exécution dans cette session) : « Commencer » ≈ 82 px, « Voir les prix » ≈ 80 px, « Les prix » ≈ 55 px, pour 83 à 98 px de texte disponible à 360 px (calcul de l'annexe du tour 2, §3). « Voir les prix » est donc aussi large que « Commencer », qui tient déjà : il passe, avec une marge de l'ordre de 2 px par rapport à ce libellé de référence. Le garde-fou `header-budget` ne couvre pas 360 et 375 px : à ajouter, et mesure au code obligatoire.

**Pourquoi A de B6 n'est pas plus « désirant »** : sous 85 px, aucun libellé riche ne tient, et les trois relecteurs ont noté 9 en conversion et 10 en écriture sur l'honnêteté du mot. Le désir est porté par la page d'arrivée (voir §6, point 5).

## 3. Ce que fait chaque A (pour désirer sans promettre)

- **Scène, pas résultat** : « Imagine la table qui rit, et la réplique, c'est toi qui l'as lancée » (B2), « La table qui rit, et la réplique, c'est toi qui l'as lancée » (B4 + B5), titre « Et si le « j'aurais dû dire » devenait un « j'ai dit » ? » : conditionnel et imagination, jamais « tu seras » ni « fini le ». C'est la phrase la plus proche de la limite : si un relecteur ou @legal la juge trop proche d'une promesse, repli de titre « Et si la bonne réplique arrivait enfin à temps ? ».
- **Raison de payer** (reprise du tour 2) : un défi à chaque étape, expliqué (« une petite mission à tenter, dans la vie ou à l'écrit »).
- **Gratuité moins répétée** : B4 + B5 A ne dit plus « étape gratuite » que dans le bouton contour et l'avantage 1 (le texte du tour 2 la disait quatre fois) ; « sans compte, quiz compris » n'apparaît qu'une fois.
- **Prix unifié** dans la carte de A : « Premium · 2,99 €/mois » et « Débloquer tous les parcours, 2,99 €/mois » ; « TTC » déplacé dans `[S12]` (« Prix TTC, ou 24,99 €/an (soit 2,08 €/mois, 10,89 € économisés) »). Les faits sont ceux de `config/premium.ts`. Si `isAnnualPlanAvailable()` est faux : `[S12]` = « Prix TTC ».
- **Garantie** : formule exacte de `REASSURANCE_PAIEMENT` partout (B2, B3, B4 + B5). B3 B garde « résiliable en ligne » plus la garantie, sans le mot « remboursable ».
- **Tics retirés** : « Au programme : », « ironie bienveillante », « Lire des vannes, c'est un début », « Après X, les Y », « à raison de », « Droit de rétractation ».
- **Framework / conscience / objections** : B1 démonstration puis un pas (Problem-Aware faible ; « ça coûte ? », « Premium, c'est quoi ? »). B2 scène puis preuve par le contenu (Problem-Aware vers Solution-Aware ; « c'est quoi exactement ? », « et si ça ne me va pas ? »). B18 valeur puis petit engagement (Unaware vers Problem-Aware ; « encore un e-mail commercial ? »). B3 essai gratuit puis offre (Problem-Aware ; « dois-je payer pour voir ? »). B4 + B5 [PAS léger : la scène manquée, puis le parcours] (Solution-Aware vers Product-Aware ; « pourquoi payer après le gratuit ? », « est-ce pour moi ? », « et si ça ne me va pas ? »). B6 transparence.

## 4. B18 : mention honnête, vérifiée dans les numéros

Les 6 numéros de `numeros.json` (worktree s21) contiennent tous : la vanne, « Pourquoi ça marche », « À toi de jouer » en 3 étapes avec un exemple, puis une lecture à suivre, puis un PS sur Premium. La lecture est **un article du blog dans les numéros 1, 2, 4 et 5, mais la première étape gratuite d'un parcours dans les numéros 3 et 6** : « un article du blog » serait donc faux pour deux numéros sur six. Formulation retenue : « une lecture à suivre et un mot sur Premium, notre abonnement ». « Pour écrire la tienne » est vrai : les exercices font écrire une vanne.
À corriger par @fullstack / Thomas : les 6 numéros contiennent « sans engagement » dans la mention Premium (faux pour l'annuel, qui est un paiement annuel) : remplacer par « résiliable en ligne ». Désinscription en un clic : vérifier le mécanisme réel (lien du pied de message, page « Me désinscrire », `List-Unsubscribe-Post`).

## 5. B1 : « Gratuit, sans compte » vrai chaque mois (gabarit) et points @fullstack

Le texte de B1 ne contient aucun mois, aucun nom de situation : seuls `[S2]` (et le contenu au clic) viennent des données. Pour que « Gratuit, sans compte » reste vrai :
1. L'encart n'affiche **que la fiche gratuite** du carnet du mois courant (Paris) : `getCurrentCarnet().fiches[0]` (`CARNET_FREE_FICHES = 1`), jamais une fiche Premium. Pas de carnet ouvert ce mois-ci : pas d'encart.
2. Le bouton ouvre **cette même fiche**, ancrée, et `carnetViewForPlan` la livre en entier à un visiteur anonyme (réplique, pourquoi, sortie polie, exercice). À tester le 1er de chaque mois.
3. La phrase « Les autres situations du mois t'attendent dans Premium » n'est affichée que si le carnet compte plus d'une fiche.
4. `[S2]` = `situation` raccourcie ou champ `accroche` (≤ 75 caractères) ajouté au schéma de fiche et au prompt de génération du carnet, avec la règle que `onTeDit` soit une phrase adressée au lecteur (sinon « Tu réponds quoi ? » est faux). `[S3]` et `[S1]` sont fixes.
5. Le pont avec l'article « 50 blagues » (soirée) est assuré par le choix de la fiche (champ `contexte`), pas par le texte. Octobre : l'ascenseur est « quotidien ».

## 6. Autres points pour @fullstack

1. **« · Droit de rétractation »** : retiré de `[S12]` dans les deux textes, non reporté (consigne de Thomas). Pour mémoire factuelle : le lien vers `/retractation` reste dans le parcours de paiement (`config/textes/paiement.ts` l. 119) et dans la suppression de compte (`config/textes/compte.ts` l. 120-123).
2. **B2** : remplir `finTexte`, supprimer `finPuces` pour Répartie ; `[S9]` par `prixTtcLabel`, annuel seulement si `isAnnualPlanAvailable()`, garantie par `REASSURANCE_PAIEMENT` ; remplacer la note `TEXTES_BLOC_FIN.note` (« sans engagement »). Hauteur de A estimée ≈ 420 px (sous 560). Vérifier que la description du parcours dans le seed (« exercices progressifs pensés pour les timides ») n'est pas affichée à côté.
3. **B3** : le bouton plein mène à l'étape 1 de Répartie, en lecture libre ; le lien à `/abonnement?src=accueil-cta`. Libellé de A : 39 caractères pour un bouton en pleine largeur avec retour à la ligne équilibré : mesurer à 360, 375, 390 px, et la hauteur du premier écran avec la note de 3 à 4 lignes.
4. **B4 + B5** : la phrase de correspondance parcours / persona se construit depuis `PREMIUM_PARCOURS` (Storytelling et Boulot dépendent de `STORYTELLING_PUBLIE` et `BOULOT_PUBLIE`) ; le prix de l'en-tête et du bouton vient d'une seule source (format « 2,99 €/mois »).
5. **B6** : libellé à changer aux trois endroits de `header.tsx` (l. 141, 171, 285), adresse `/abonnement?src=header`, bouton masqué sur `/abonnement` et `/register`, `__tests__/layout/header.test.tsx` (attend « Commencer »), `header-budget` à 360 et 375 px. Le premier écran de `/abonnement` devrait nommer les parcours et la scène (c'est là que se joue le désir, le bouton ne peut pas le porter).

## 7. Hors duel : « On va arranger ça » (accueil)

« Tu parles et personne rit. On va arranger ça. » frôle la promesse de résultat (« on » s'engage à arranger). Non modifié dans les duels. Propositions, de la plus désirante à la plus prudente : (a) « Tu parles et personne ne rit. Et si, cette fois, la table riait ? » ; (b) « Tu parles et personne ne rit. Ça se travaille. » ; (c) « Tu parles et personne ne rit. On t'aide à changer ça. » Note : « personne rit » est écrit sans « ne », oral voulu ou coquille à trancher par Thomas.

## 8. Autres notes

- La description du parcours Répartie dans le seed (`parcours-seed.json` l. 263) contient « exercices progressifs pensés pour les timides » et « juste de ne plus rester muet » : promesse de résultat existante, non reprise dans les textes.
- « 1 500+ membres » : non commenté.
- Pack 3 non traité ici.
