# Tour 14, relecteur @ux (à l'aveugle) : `architecture-contenu-v14.md`

> Relu : résumé, 1.1 (ligne XP et série), 2.2 à 2.9 en entier, 3.12 en entier, **4.2 en entier et 6.1 à 6.3 en entier (non vérifiés au tour 13)**, 4.4, 5.5, section 8 (fin), section 9 (E5, E6), annexes A et B. Non relus ce tour : 3.1 à 3.11, 4.1, 4.3, 4.5, 5.1 à 5.4, 7.1 à 7.7 (je m'appuie sur ce que l'annexe A en dit pour 7.3 et 7.5 i : [NON VÉRIFIÉ]).
> Question posée : mes N1 à N6 (et la section 2 du tour 13) sont-ils traités ? La série placée dans « Aujourd'hui » et « Ton mois » tient-elle ? 4.2 et 6.2 sont-ils conformes à C14 et C1 ?

## 1. Statut de mes corrections du tour 13

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| N1 (bloquant) | Note de révision après « Tu avais une réponse ? » | **OK** | 2.2 étape 4 : la note s'affiche avec les répliques, APRÈS la réponse, jamais avant ; même règle pour « Et toi ? » et pour la révision (2.2, 2.7) ; phrase de principe (« sinon Oui deviendrait vrai par simple lecture ») ; critère de test inscrit dans E5 (section 9) |
| N2 (bloquant) | Promesse du coin « Humour noir » | **OK, trois précisions** | Règle unique en deux cas (3.12) : avec repérage en base, promesse écrite sur tous les écrans de l'espace (rafale, vanne du jour, toucher, liste « Vannes », favoris proposés, recherche) ; sans repérage, la promesse n'est PAS écrite. La contradiction est levée et le résumé (Bibliothèque) le dit. Précisions : P3 |
| N3 | Cloche : ligne après ouverture du fil, état « lu » | **OK** | La ligne disparaît une fois le fil ouvert, une ligne par fil non ouvert ; les nouveautés n'ont aucun état « lu » (5 dernières, sans mémoire) ; une seule phrase de @legal |
| N4 | Écran « Mes répliques » | **OK, une précision** | État vide, plus récente d'abord, réplique entière et titre, modifier et supprimer depuis la liste, 44 px, lecture seule après résiliation, table de correspondance univers/catégorie [À VÉRIFIER]. Précision : P4 |
| N5 | Lecture seule contre suppression ; « ses réponses » | **OK** | 2.6 (ligne « Abonnement terminé ») et 2.7 : ni ajout ni modification, la suppression reste possible (C10 a) ; « ses répliques » |
| N6 | Accessibilité et liens du coin | **OK** | Bouton « Entrer » 44 px, focus visible, contenu non rendu avant le geste, focus au titre après, « Sortir » recommandé, liens depuis 3.8 vers l'écran d'entrée, lien de « quand tu as dit la mauvaise chose » à poser à E6 |
| Section 2 du tour 13 | Cloche : nombre annoncé | **OK** | Singulier juste, le test compare le nom accessible aux réponses non lues (jamais aux lignes du panneau), le nom ne change pas en direct |
| Remarque C3 | « 15 répliques » contre « 45 à 180 candidates » | OK | « 15 répliques à retenir, 45 à 180 candidates » (3.12, annexe C) |

## 2. Série dans « Aujourd'hui » et « Ton mois » : verdict

Placée en 4.4 (a) (« salutation et série sur une ligne ») et en « Ton mois » ; état à 0 : rien n'est affiché, pas de « 0 jour », jamais de « série menacée », « série perdue » ni de compte à rebours (2.5, 4.4, E5) ; règle existante, aucune règle nouvelle (C4). **Le principe est juste et bien posé** : un abonné qui n'a jamais pratiqué, ou qui a coupé, ne lit aucun reproche. Je lève mon point du tour 4 (la v13 ne la plaçait pas). Trois défauts de précision, non bloquants (P1, P2).

## 3. 4.2 et 6.2 (relus, non vérifiés au tour 13)

**6.2 : conforme à C1.** Six entrées, « Vocabulaire » dans la Bibliothèque, cloche et « Mon profil » hors des 6, trois blocs de Bibliothèque, « Plus » en trois groupes (S'entraîner, Mon contenu, Le reste) ; l'ouverture du bloc humour noir par la notification neutre ; le tableau 6.3 donne une seule porte par contenu. Rien à corriger. Un rappel qui est à moi (pas un défaut de la v14) : P7.

**4.2 : conforme à C14.** Parcours de l'abonné, simulé pas à pas (cognitive walkthrough, premier abonné venant d'un article de blagues) :
1. Il paie : la page de succès garde le bouton « Continuer » et le lien de renonciation. Sait-il quoi faire ? Oui, un seul bouton principal. **[FRICTION H8]** : à l'étape de la page de succès, le lien « Renoncer au contrat ici » (D.221-5) est juste à côté de « Continuer » ; un abonné pressé peut le toucher. Solution : « Continuer » en bouton principal, la renonciation en lien de texte secondaire, séparée d'au moins 44 px, avec la confirmation que le texte légal impose (P5).
2. Il arrive sur « Aujourd'hui » avec le premier pas visible (jamais « choisis un parcours »). L'action est visible, le lien but-action clair, le retour immédiat (la fiche est le premier pas, le favori d'avant paiement est confirmé). Sans signal (`/parcours/repartie` sans étape), la scène universelle neuve.
3. Il fait le premier pas, puis la question « Où veux-tu être plus à l'aise ? » apparaît une seule fois, élément secondaire.
4. Il revient le lendemain : la rafale, jamais une relance. Après connexion simple, « Aujourd'hui » : recommandation du brief, dite « non tranchée par Thomas, à lui montrer ».
**Le [À VÉRIFIER] sur la connexion en fenêtre se lève en partie** : la préférence du fondateur existe dans les préférences UX (tous projets) : connexion en fenêtre, fermable par X, clic dehors et Échap, en-tête et pied de page visibles, jamais une page pleine ; je n'ai pas pu relire le fichier du projet entier (pas de recherche). La phrase de 4.2 peut perdre son [À VÉRIFIER] et citer cette préférence.

## 4. Notes (grille C1 à C11)

| Critère | T12 | T13 | T14 | Justification courte |
|---|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | 9 | Série sans culpabilisation, note à soi, entrée volontaire de l'humour noir |
| C2 Décisions de Thomas | 9 | 10 | 10 | Toutes appliquées à l'intérieur de leur lettre ; 4.2 et 6.2 conformes à C14 et C1 |
| C3 Zéro invention | 9 | 9 | 9 | Aucun chiffre neuf ; la promesse du coin n'est écrite que si elle est vraie |
| C4 Rubriques claires, 6 entrées | 9 | 9 | 9 | Barre conforme ; « Mes répliques » spécifié ; le rendu mobile de la barre reste à dessiner (P7) |
| C5 Ambition | 10 | 10 | 10 | V1 complète |
| C6 Cohérence | 8 | 8 | 9 | Les trois contradictions du tour 13 sont levées ; restent des renvois ambigus (P6) |
| C7 Faisabilité | 9 | 9 | 9 | Le repérage en base devient une condition au chantier ; l'état « entré » côté navigateur demande un mécanisme dit (P3) |
| C8 Décisions et « reste à trancher » | 9 | 9 | 9 | Lignes courtes ; la question de la série et de la rafale n'est pas posée (P1) |
| C9 Exemples au ton maison | 9 | 9 | 9 | Pas d'exemple neuf ; messages au bon ton |
| C10 Progression pédagogique | 9 | 9 | 9 | Arrivée sur « Aujourd'hui », premier pas, rafale ; note après la réponse |
| **C11 Pertinence pour l'audience réelle** | 9 | 9 | 9 | Humour noir mesuré et enfermé derrière un geste ; série sans pression |

**Note globale C1 à C10 : 9,2 / 10** (92 sur 100). **Avec C11 : 9,2 / 10** (101 sur 110). T13 : 9,1 ; T12 : 9,0.

## 5. Corrections nouvelles

**Aucune bloquante.** Huit non bloquantes ; P1, P3 et P4 sont à traiter avant de montrer le document à Thomas.

**P1. Série : ce qui compte, et le mot « pratique » face à la rafale.**
Passages : 1.1 « série comptée sur la pratique, rythme doux de 7 jours » ; 2.2 « la rafale ne compte pas pour la série ni pour les points (C4) » ; 4.4 (a) « {n} jours de pratique d'affilée ».
Problème : le document ne dit nulle part ce qui compte comme « pratique » (valider une étape ? un exercice ? un conseil ?) et ne dit pas que la rafale, qui est l'entraînement quotidien (C3), n'en fait pas partie. Yanis qui joue la rafale tous les jours ne verra aucune série, avec le texte « jours de pratique ». Ce n'est pas un reproche (rien ne s'affiche à 0), mais le mot « pratique » et l'entraînement quotidien se contredisent à ses yeux. « Rythme doux de 7 jours » contredit aussi « d'affilée » à la lettre.
Correction : (a) écrire en une phrase ce qui compte aujourd'hui [À VÉRIFIER @fullstack, lecture de `progression.ts`] ; (b) dire en 4.4 que la rafale a son propre repère neutre (« 12 cartes cette semaine ») et pas de série ; (c) ajouter aux lignes « à trancher » une question courte pour Thomas, sans rouvrir C4 : « La série existante ignore la rafale ; le texte validé en s17 dit “pratique” : on le garde ? » La réponse change l'écran sans rien ajouter aux règles.

**P2. Série : ligne et accords à 375 px.**
« Salutation et série sur une ligne » ne tient pas à 375 px (343 px utiles : « {n} jours de pratique d'affilée » en 31 caractères occupe environ 250 px, la salutation environ 110 px). Écrire : sous 768 px, salutation, puis série, puis repère neutre, chacun sur sa ligne ; au-dessus, une ligne ; test à 375 px et à 200 % de texte (E5). Écrire aussi le singulier (« 1 jour de pratique d'affilée » ; « 1 carte cette semaine »).

**P3. Promesse du coin « Humour noir » : trois précisions.**
(a) « Sert » ou « affiche » : l'état « entré » est gardé dans le navigateur (aucune donnée de compte). Un filtre côté serveur n'a pas cette information sans un témoin envoyé par le navigateur (cookie ou en-tête). Dire le mécanisme (filtre côté navigateur, ou témoin lu par le serveur) ; sinon écrire « n'affiche jamais » et non « ne sert jamais ». (b) Le test (« un compte non entré ne trouve aucune vanne du lot ») doit dire « un navigateur non entré » : le même compte sur un autre appareil n'est pas entré. (c) « Les vannes du lot » ou « toutes les vannes d'humour noir actives » : 3.12 emploie les deux. Si ce sont toutes les vannes repérées, celles qui ne sont pas dans le lot sont invisibles dans la Bibliothèque jusqu'à « Entrer » ; dire aussi ce qui se passe après « Entrer » (elles reviennent partout, y compris dans le toucher et la vanne du jour ? 4.4 les exclut sans condition). À montrer à Thomas dans E6 : un geste d'entrée n'est pas un verrou de forfait (la décision du 12/11 sur l'accès libre tient), mais cache une partie du catalogue à qui n'est pas entré.

**P4. « Tes répliques à toi pour la soirée » : mot fixe et état par défaut du toucher.**
4.4 écrit « pour la soirée » en dur alors que le toucher a quatre catégories (soirée, boulot, famille, rencard). Écrire « Tes répliques à toi pour {catégorie choisie} » ; et dire ce qui s'affiche quand « Peu importe » (le choix par défaut) est actif : aucune ligne (recommandé) ou les plus récentes. Dans 2.7, la table de correspondance univers et catégorie reste [À VÉRIFIER] ; en attendant, la ligne ne s'affiche que pour une correspondance certaine.

**P5. Page de succès : hiérarchie des deux liens** (voir friction H8 en 3). Écrire dans 4.2 : « Continuer » bouton principal ; renonciation en lien de texte, séparé d'au moins 44 px, avec la confirmation que le texte légal impose. Texte légal inchangé (aucun texte validé touché).

**P6. Renvois ambigus avec le document des niveaux.** 1.1, ligne XP : « question Q3 posée à Thomas dans ce document » : « ce document » désigne `niveaux-xp-s24.md`, pas l'architecture (la phrase est dans un renvoi). Écrire « dans le document des niveaux ». 4.4 : « Ton mois » liste la série et la courbe, mais le document des niveaux place aussi le cap dans « Ton mois » (3.0) : ajouter « et le cap (document des niveaux) » ou dire que l'architecture n'y touche pas. Aussi, le point 6 de l'annexe B des niveaux (« placer la série ») est maintenant résolu : le dire au document des niveaux.

**P7. Rendu de la barre sur mobile (rappel de mon propre chantier, pas un défaut de la v14).** 6.2 fixe six libellés ; à 375 px il reste environ 57 px par entrée dans une rangée de six : « Bibliothèque », « Quoi répondre » et « Mes questions » ne tiennent pas sur une ligne à 11 ou 12 px. Le dessin est confié à @ux et @design (annexe A.2, refus maintenu) ; mon wireframe devra trancher (rangée basse à deux lignes de libellé, défilement, ou menu avec « Aujourd'hui » toujours visible) et passer le test des deux tâches de 6.2 à 375 px, à 200 % de texte, au clavier.

**P8. Correspondance avec la préférence « connexion en fenêtre ».** Voir section 3 : retirer le [À VÉRIFIER] de 4.2 et de l'annexe B (point « Connexion »), citer la préférence.

## 6. Ce qui est solide (à garder)

- 2.2 : l'ordre de la carte (scène, ta réponse d'abord, « Tu avais une réponse ? », répliques et note, choix, règle) avec la phrase de principe.
- 2.9 : spécification de la cloche complète, testable, sans pression ; panneau qui se vide à l'ouverture du fil.
- 2.7 : états de la note, « Mes répliques », jamais de « Fait » ni de points ; 2.6 : lecture seule sans effacement forcé.
- 3.12 : règle unique en deux cas, promesse non écrite si elle n'est pas vraie ; entrée accessible.
- 4.2 : arrivée toujours « Aujourd'hui » après le paiement, deux effets de code nommés ; 6.2 : barre conforme à C1.
- 4.4 : série sans culpabilisation (état à 0, jamais menacée ni perdue).

## 7. Verdict

**Prêt à présenter à Thomas après trois précisions courtes** : ce que compte la série et le mot « pratique » (P1), le mécanisme de l'état « entré » et le périmètre exact de la promesse (P3), le mot fixe « soirée » (P4). Aucun bloquant : 9,2 contre 9,1. 4.2 et 6.2 sont conformes à C14 et C1.
