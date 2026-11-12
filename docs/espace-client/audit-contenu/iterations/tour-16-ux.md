# Tour 16, relecteur @ux (à l'aveugle) : `architecture-contenu-v16.md`

> Relu : en-tête, résumé (début), 3.12 en entier, 4.2 (page d'arrivée et connexion), 4.4 en entier (composition, série et cap, toucher, « Ton mois »), 6.2 et 6.3 en entier (dont le rendu de la barre à 375 px), section 8 (fin), section 9 (E5, E6), annexes A et B. Non relus ce tour : 0 à 2.9 (sauf renvois), 3.1 à 3.11, 5, 7 : je m'appuie sur l'annexe A pour les « déjà appliquées en v15 » (P1 a et b, P2, P4, P5, P6, P8) et je ne vérifie dans le texte que ce qui est cité plus bas [NON VÉRIFIÉ pour le reste de la v15].
> Références : `docs/founder-preferences.md` l. 168 (décisions du 12/11 sur la connexion et les niveaux), mon tour 14.

## 1. Statut de mes corrections du tour 14

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| P1 | Série : ce qui compte, rafale, question à Thomas | **OK, une précision** | « Une étape validée ou un quiz d'étape terminé » (aide validée s17, `parcours.ts` l. 82 à 84) [À VÉRIFIER contre `progression.ts`] ; la rafale a son propre repère neutre « 12 cartes cette semaine » ; question courte à Thomas (A garder, reco ; B changer le mot ; C ne pas afficher) sans rouvrir C4. Précision : Q1 (option C à réécrire) |
| P2 | Série à 375 px, singulier | **OK** | Sous 768 px : série sur sa propre ligne, au-dessus du cap puis du reste de l'en-tête (« Parcours » et « Ton mois ») ; au-dessus, une ligne ; test à 375 px et 200 % de texte (E5) ; « 1 jour de pratique d'affilée », « 1 carte cette semaine » |
| P3 a | « Affiche » plutôt que « sert » | **OK, mécanisme non écrit** | 3.12 : « l'espace n'affiche jamais ce contenu sans le geste « Entrer » (on écrit « affiche », pas « sert ») » ; le mécanisme du filtre (côté navigateur, ou témoin lu par le serveur) n'est pas dit : Q5 |
| P3 b | « Navigateur non entré » | **OK** | 3.12 et 7.5 i : « un navigateur qui n'est pas “entré” ne trouve aucune vanne repérée… (le même compte sur un autre appareil n'est pas entré) » |
| P3 c | Périmètre du repérage et après « Entrer » | **OK** | Le repérage marque TOUTES les vannes d'humour noir actives, le lot n'est qu'un sous-ensemble ; après « Entrer » elles reviennent dans la liste « Vannes », la recherche et les favoris, restent exclues de la vanne du jour, du toucher et de la rafale ; « pas un verrou de forfait » à montrer à Thomas à E6. **Fait neuf honnête** : le repérage n'existe pas aujourd'hui (aucun champ du schéma) ; la promesse n'est écrite qu'une fois le repérage créé (3.12, résumé) |
| P4 | « Tes répliques à toi pour {catégorie choisie} » ; « Peu importe » | **OK** | 4.4 : le mot suit la catégorie ; aucune ligne quand « Peu importe » est actif |
| P5 | Page de succès | **OK, une précision** | « Continuer » bouton dominant, lien « Renoncer au contrat ici » visible et accessible en un clic, texte légal inchangé ; l'écart d'au moins 44 px entre les deux n'est pas écrit : Q5 |
| P6 | Renvois au document des niveaux | **OK** | Section 8 et 1.1 renvoient à `niveaux-xp-s24.md` (v7) |
| P7 | Rendu de la barre à 375 px | **Posé, non tranché** | Trois options, test sur les deux tâches, dessin confié à @ux et @design. C'est mon chantier : je tranche en 3 (Q2) |
| P8 | Connexion en fenêtre | **OK, un fait à lever** | Le [À VÉRIFIER] devient un fait de code (aucune connexion en fenêtre depuis s15, la modale est retirée au profit de pages) : voir Q4 |

## 2. Les trois sujets demandés

### 2.1 La série (Parcours, Ton mois, état à 0, 375 px)

- **Placement** : en tête de « Parcours » et dans « Ton mois », hors de la ligne de salutation d'« Aujourd'hui ». Le raisonnement est juste : la série ne compte pas la rafale (C4), l'afficher à côté de « 12 cartes cette semaine » ferait lire « pratique » vide à qui joue la rafale tous les jours.
- **État à 0 validé** : « Ta série démarre à ta prochaine étape. » (texte validé s17, repris tel quel). J'accepte : il est neutre, il dit la règle (une étape) et il vit dans « Parcours », où l'étape est l'action. Il n'est pas du même genre que la phrase d'attente que j'ai refusée dans le document des niveaux (« Ton premier bonus arrive avec ton prochain cap ») : lui est un texte validé par Thomas, et il explique ce qui compte au lieu d'annoncer une récompense qu'on n'a pas.
- **375 px** : empilé (série, cap, puis le reste), à 200 % de texte à tester en E5 : bon. Deux réserves : la flamme (Q3), et le poids de l'en-tête de « Parcours » (Q1 bis : l'action de la page est l'étape à reprendre, pas deux lignes de repères).

### 2.2 La connexion

Décision de Thomas (l. 168) : « page d'origine, sinon « Aujourd'hui » (au lieu de la liste des vannes) ». **Appliquée fidèlement** : 4.2, 4.4 (état 1), 6.2, 6.3, résumé. Seule l'arrivée par défaut change (`/vannes` devient « Aujourd'hui »), le retour à la page d'origine reste et la barre de l'espace y apparaît.
Parcours simulé : l'abonné clique « Connexion » depuis une vanne → retour sur la vanne, barre visible (comme avant) ; l'abonné arrive par un lien direct vers `/login` (e-mail) → « Aujourd'hui », avec l'état qui convient (premier pas, rafale, étape en cours). Sait-il quoi faire ? Oui : une seule action principale (4.4). Le retour est immédiat. **Un cas à écrire (Q4)** : l'abonné dont l'abonnement est terminé ne doit pas arriver sur « Aujourd'hui » (l'espace est fermé) mais suivre la règle existante (redirection vers `/abonnement`, ligne « Ton historique de questions et tes répliques sont gardés »).

### 2.3 La barre à 375 px (P7) : décision de @ux

Calcul : 375 px moins 2 marges de 16 px donnent 343 px utiles, soit environ 57 px par entrée (la v16 écrit « 375 divisé par 6, hors marges » : 375 / 6 = 62 ; le chiffre juste, marges comprises, est 57). À 11 ou 12 px de texte, « Aujourd'hui » (11 lettres, environ 62 à 66 px), « Bibliothèque » (12 lettres, 66 à 70 px) ne tiennent pas dans 57 px **même sur deux lignes** (aucun point de coupure dans le mot sans le trahir) ; « Quoi répondre » et « Mes questions » tiennent seulement sur deux lignes. Verdict des trois options :
- **Rangée basse à deux lignes** : échoue pour « Aujourd'hui » et « Bibliothèque », et dès 200 % de texte pour toutes.
- **Rangée qui défile** : « Mes questions » et « Plus » sortent de l'écran ; incompatible avec le critère du document (« sans défilement caché »).
- **Menu avec « Aujourd'hui » toujours visible** : seule option qui garde les six libellés entiers (décidés par Thomas, C1), passe à 200 % et au clavier, et laisse « Aujourd'hui » visible.
**Décision recommandée** : option 3, écrite ainsi : en 375 px à 767 px, une barre à **deux** éléments : le lien « Aujourd'hui » et un bouton « Menu » (nom accessible « Menu », `aria-expanded`, `aria-controls`) qui ouvre une feuille de cinq lignes de 44 px de haut minimum (Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus), l'entrée courante marquée autrement que par la couleur (`aria-current="page"` et coche), fermeture à Échap, au clic dehors et à un bouton « Fermer », le focus revient au bouton ; à partir de 768 px, les six entrées en rangée (la contrainte « 6 au plus à l'écran » tient : deux liens visibles fermé, six ouvert). À rendre à l'étalon E5 et à passer aux deux tâches (« où apprendre à construire une vanne ? » : Menu, Bibliothèque ; « où trouver une vanne ? » : Menu, Bibliothèque), au clavier et à 200 % de texte ; **coût honnête** : deux touchers au lieu d'un pour cinq rubriques sur mobile, à mesurer au test. Cette décision est une proposition de @ux à valider par @design au rendu.
**Budget d'en-tête à 375 px** (extension de P7) : `header-budget.spec.ts` impose une recherche d'au moins 160 px sur ses six largeurs ; à 375 px, logo (environ 100 à 120 px [HYPOTHÈSE]) + recherche 160 + cloche 44 + compte 44 + espaces dépassent les 343 px utiles. À 375 px la recherche devient un bouton icône de 44 px qui ouvre un champ pleine largeur ; le seuil de 160 px ne vaut qu'au-dessus de la largeur où la somme tient (à calculer au rendu).

## 3. Notes (grille C1 à C11)

| Critère | T14 | T16 | Justification courte |
|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | Série et cap sans pression, texte à 0 validé, connexion qui ramène là où l'on était |
| C2 Décisions de Thomas | 10 | 10 | Connexion et niveaux appliqués mot pour mot (l. 168) ; aucune décision rouverte |
| C3 Zéro invention | 9 | 9 | Fait neuf honnête (aucun champ d'humour noir en base) ; un calcul faux (« 375 / 6 hors marges ») |
| C4 Rubriques claires, 6 entrées | 9 | 9 | Barre conforme à C1 ; le rendu à 375 px reste à trancher (ma décision en 2.3) |
| C5 Ambition | 10 | 10 | V1 complète |
| C6 Cohérence | 9 | 9 | Reste une divergence avec le document des niveaux (Q1 bis) et une phrase à clarifier (Q1) |
| C7 Faisabilité | 9 | 9 | Repérage d'humour noir à créer (dit) ; budget d'en-tête à 375 px à reprendre (2.3) |
| C8 Décisions et « reste à trancher » | 9 | 9 | La question sur la série est posée, une de ses options est à réécrire (Q1) |
| C9 Exemples au ton maison | 9 | 9 | Inchangé |
| C10 Progression pédagogique | 9 | 9 | Inchangé |
| **C11 Pertinence pour l'audience réelle** | 9 | 9 | Inchangé |

**Note globale C1 à C10 : 9,2 / 10** (92 sur 100). **Avec C11 : 9,2 / 10** (101 sur 110). T14 : 9,2.

## 4. Corrections nouvelles

**Aucune bloquante.** Cinq non bloquantes (Q1 à Q5).

**Q1. Série : une phrase et une option à réécrire.**
(a) 4.4 écrit « La série n'est pas sur « Aujourd'hui » » ; or « Ton mois », où elle figure, est un bloc de la page « Aujourd'hui » (4.4 « En dessous : … Ton mois » ; 6.2, ligne « Aujourd'hui ») à partir de J25. Écrire : « La série n'est pas dans la ligne de salutation d'« Aujourd'hui » ; elle est en tête de « Parcours » et dans le bloc « Ton mois », qui s'affiche dans « Aujourd'hui » à partir de J25 ». Même dans « Ton mois », l'abonné qui joue la rafale voit « situations jouées » à côté d'une série à 0 : le texte validé à 0 (« Ta série démarre à ta prochaine étape ») lève l'ambiguïté, à garder.
(b) L'option C de la question (« Ne pas afficher la série sur « Aujourd'hui » ni dans « Ton mois » ») est en partie réglée (elle n'est déjà plus sur la ligne d'« Aujourd'hui ») : écrire « C. Ne pas l'afficher dans « Ton mois » ; elle reste en tête de « Parcours » ».
(c) **Q1 bis, divergence entre documents** : la v16 met la série et le cap « en tête » de « Parcours » ; `niveaux-xp-s24.md` (3.0) place le cap « après les étapes faites (jamais en tête, donc distinct du calendrier « Tes 4 premières semaines »)  » et la rubrique « Tes bonus » après le cap. À 375 px, trois lignes de repères (série, cap, pastilles) avant l'étape à reprendre repoussent l'action principale de la page. Arbitrage de @ux (la fonction prime) : en tête de « Parcours », le calendrier « Tes 4 premières semaines » et l'étape à reprendre ; **la série et le cap sur une seule carte compacte placée après l'étape en cours** (série, nom du cap, pastilles, empilés) ; à reporter dans les deux documents.

**Q2. Barre à 375 px : décision et calcul.** Voir 2.3 : corriger « 375 divisé par 6, hors marges » en « 343 px utiles, soit 57 px par entrée » ; retenir l'option 3 (deux éléments, « Aujourd'hui » et « Menu ») pour 375 à 767 px, six entrées en rangée à partir de 768 px ; écrire le budget d'en-tête de 375 px (recherche en bouton icône de 44 px).

**Q3. Flamme du compteur de série.** « Composant existant (`streak-counter.tsx`, avec sa flamme) » : si la flamme est un émoji, elle viole la règle « aucun émoji » (règles tenues du document). Écrire : la flamme est une icône décorative (masquée aux lecteurs d'écran, aucune animation), jamais un émoji, jamais le seul porteur de l'état ; le texte « {n} jours de pratique d'affilée » porte l'information ; le contraste de l'icône est de 3:1 au moins. Le choix visuel reste à @design en E5.

**Q4. Connexion : un cas et une réserve.**
(a) Écrire en 4.2 : « « Aujourd'hui » après une connexion vaut pour un abonné dont l'abonnement est actif ; un ancien abonné suit la règle existante (redirection vers `/abonnement`, ligne « Ton historique de questions et tes répliques sont gardés »). »
(b) Le fait « aucune connexion en fenêtre depuis s15 (modale retirée au profit de pages) » contredit la préférence UX du fondateur (connexion en fenêtre, fermable, en-tête et pied de page visibles, jamais une page pleine). [À VÉRIFIER : la suppression de la modale en s15 est-elle une décision de Thomas ? Si oui, c'est un [CHOIX UTILISATEUR] et la préférence cède ; sinon c'est un écart de code à signaler à Thomas.] Dans les deux cas, la règle « page d'origine » est ce qui protège les repères : ne pas la toucher.

**Q5. Deux précisions courtes.** (a) 3.12 : écrire qui filtre l'humour noir pour un navigateur non entré : un filtre côté navigateur sur les données déjà reçues (le contenu est alors téléchargé mais pas affiché : « n'affiche jamais » est exact, « ne télécharge jamais » ne l'est pas), ou un témoin envoyé au serveur (le serveur ne renvoie rien). À trancher par @fullstack au chantier (7.5 i). (b) 4.2 : l'écart entre « Continuer » et « Renoncer au contrat ici » est d'au moins 44 px (cible tactile), le lien de renonciation en texte (jamais un bouton de même poids) ; le texte légal ne change pas.

## 5. Ce qui est solide (à garder)

- Connexion : décision de Thomas appliquée sans rien ajouter, faits de code cités, seule l'arrivée par défaut change.
- Série : texte à 0 validé repris tel quel, définition de ce qui compte sourcée sur l'aide validée, rafale avec son repère neutre, jamais « menacée » ou « perdue ».
- 3.12 : règle unique en deux cas ; aveu clair que le repérage n'existe pas (schéma sans champ d'humour noir) ; promesse non écrite tant qu'il n'existe pas ; comportement après « Entrer » dit.
- Toucher « Ce soir, c'est plutôt ? » : mot qui suit la catégorie, aucune ligne à « Peu importe ».
- Niveaux et points : renvoi propre vers le document des niveaux, aucune conception dupliquée, aucun total modifié (163, 293).

## 6. Verdict

**Prêt à présenter à Thomas.** Aucun bloquant : les P1 à P8 du tour 14 sont tous traités ou, pour P7, posés avec ma décision (2.3). Les cinq précisions Q1 à Q5 ne touchent aucune décision de Thomas ; la plus utile est Q1 bis (arbitrage série et cap sur une carte compacte après l'étape en cours, à reporter dans le document des niveaux) et Q2 (barre à 375 px : deux éléments et un menu, à rendre à l'étalon E5).
