# Tour 5, relecteur @ux (à l'aveugle) : `architecture-contenu-v5.md`

> Relu en entier (sections 0 à 9, annexe A et début de B). Fait donné par la session et pris comme vrai : le résultat du quiz n'est gardé que dans le navigateur (`viral-quiz.tsx` l. 36-46, localStorage), rien sur le compte. Références : mon tour 4, `founder-preferences.md` l. 161 à 165.
> Limite : je n'ai pas relu moi-même `quiz-data.ts`, `docs/legal/espace-client-s24-phrases.md`, le playbook ni les pièces du carnet ; leurs citations dans la v5 sont [NON VÉRIFIÉ] de mon côté.

## 1. Notes

| Critère | T3 | T4 | T5 | Justification courte |
|---|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 8 | 8 | 8 | Entrée par signal enfin honnête, fil de « Mes questions », courbe de progrès ; mais le défaut de la majorité des abonnés (sans signal) reste une décision que Thomas ne prend nulle part, et un message de détresse attend 1 à 2 jours sans ligne visible |
| C2 Décisions de Thomas | 7 | 8 | 8 | C10 correctement marquée, C2 pose le temps ; la reco A de C1 met le catalogue en « Plus » sans citer la décision du 12/11 (« bibliothèque en accès libre à côté ») |
| C3 Zéro donnée inventée | 8 | 8 | 8 | Totaux justes (je retrouve 40/64/79/66, 55-75, 24 à 96 et 120 à 480, 153, 185, 283) ; « mesurée sur Machine à Café » est une estimation de lecture ; le compte de cartes de 2.3 est périmé après la refonte des cartes du carnet |
| C4 Rubriques claires, 6 entrées au plus | 6 | 8 | 8 | 6 entrées réelles dans A, B, C, « Aujourd'hui » partout, ce que chaque variante sacrifie est dit ; la reco A rend la pièce maîtresse de l'offre (vannes, conseils, vidéos) atteignable en deux clics |
| C5 Ambition | 8 | 9 | 9 | V1 complète, moteur de progression, courbe de compétence, fils de questions, régime mensuel |
| C6 Cohérence entre documents et code | 7 | 7 | 8 | Table signal vers parcours conforme au code, cas d'essai recalés, temps par parcours ; restent le compte de cartes (2.3), « situations du parcours » contre carnet (3.10), la priorité des signaux |
| C7 Faisabilité | 7 | 8 | 9 | 7.3 bis couvre le mois, les réponses « Situation à gérer » avec réplique neuve, la base de relecture selon C8 ; norme de réponse réaliste (répliques déjà validées d'abord) |
| C8 Questions à Thomas | 7 | 8 | 8 | C2 (temps, 79 minutes), C9 (signal), C10 (réduite, avis seulement si Thomas le veut) sont nettes ; manquent la question du parcours par défaut et celle de la ligne « détresse » |
| C9 Exemples au ton maison | 7 | 8 | 8 | Poêle, rattrapage (la risquée « Un. » est bonne), frigo, faux secret avec contre-exemple, Accusé de réception aligné ; la réponse juste du bilan contredit la définition de « la sûre », et « Mieux vaut tard que jamais » est le sens normal de l'expression |
| C10 Progression pédagogique | 8 | 8 | 8 | Calendrier avec deux lignes de temps, marche selon le retour, bilan seulement pour Machine à Café ; la majorité des abonnés démarre par Répartie (INTERMEDIAIRE) sur une hypothèse |

**Note globale : 8,2 / 10** (82 sur 100 ; T1 6,1 ; T2 6,7 ; T3 7,3 ; T4 8,0). Pas encore 10/10 : 6 corrections bloquantes, petites chacune.

## 2. Statut de mes 9 corrections du tour 4

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| P1 | Table signal vers parcours, cas d'essai | OK | 4.2 reprend le code (Observateur Confiance, Storyteller Storytelling avec repli, Absurde Machine à Café, Punchlineur et Taquin Répartie) ; la conservation du quiz (navigateur seul) est dite ; 4.3 dit ce que le produit ferait et le test à faire ; 4.1 recalcule le temps par parcours et limite le bilan à Machine à Café. Les nouveaux défauts de ce chantier sont en Q2, Q3, Q11 |
| P2 | Temps hebdomadaire non posé | OK | C2 réécrite : promesse des parcours contre temps réel (40, 64, 79, 66), options marquées, libellé « Si tu as 5 minutes » ; deux lignes de temps dans 4.1. Réserve de vocabulaire en Q8 |
| P3 | « Mes questions » : délai, fil, Reply-To | OK | Un seul délai, « Continuer » (fil par envoi), adresse du compte lue en base, adresse de l'équipe sur l'e-mail de réponse, `/profil` garde une ligne de lien (E1b reste vrai) |
| P4 | C10 : avis non marqué, trois décisions | OK | C10 réduite à durée, sort après résiliation, retrait ; l'avis n'existe plus que comme option qui rouvre le 25/10 ; playbook cité. Il reste la détresse (Q1) |
| P5 | Reco de C1 inexacte | OK sur la phrase, PARTIEL sur le fond | Plus aucun « à un clic » faux, « Ce qu'elle sacrifie » pour chaque variante ; mais la reco A met le catalogue en « Plus » (Q5) |
| P6 | Base de relecture de 7.3 bis | OK | Plancher d'octobre, non borné avec C8 A, 2 avis sur 3 avec C8 B |
| P7 | Détournements, risquée du rattrapage | OK avec réserve | Rattrapage : très bien. Formules : la suite du détournement 1 est l'usage normal de l'expression (Q9) |
| P8 | Révision et courbe | OK | Cartes en trop glissent au lendemain ; courbe à partir de 10 cartes, texte neutre, pas de pente colorée |
| P9 | Numérotation et détails | OK | C1 à C10 sans trou ; « Plus » première ligne à tester ; ouverture au seuil dite (Q12 en réserve) |

## 3. Nouvelles corrections

### Bloquantes

**Q1. [BLOQUANT] Un message de détresse n'est vu qu'après 1 à 2 jours, et la ligne d'orientation est reléguée en note (C1, C8).**
Passages : 2.6 « Message sensible : Réponse à la main, sans humour, avec l'orientation vers l'aide officielle (3114) … même engagement de délai, aucune promesse de priorité » ; « **Détresse** : une ligne discrète sous le champ … n'est pas ajoutée en V1 ; si Thomas la veut, c'est un texte à faire valider ».
Problème : la seule protection est la réponse de l'équipe, au plus tôt le lendemain (jours ouvrés : un message du vendredi soir attend lundi). Le champ « Une situation à gérer » est précisément celui où une personne en difficulté (Marc est récemment séparé) écrira. Remettre la décision à une phrase conditionnelle dans une section technique, au lieu de la poser à Thomas, revient à décider sans lui.
Correction : ajouter à C10 un quatrième point à 2 options simples : A. une ligne discrète et fixe sous le champ (« Si tu traverses un moment très difficile, le 3114 répond à toute heure », texte à faire valider, jamais présenté comme un contenu de l'espace) ; B. rien, la réponse de l'équipe fait foi (délai inclus). Reco : A. Citer le playbook l. 595 pour le texte.

**Q2. [BLOQUANT] La priorité des signaux annule le geste « Où veux-tu être plus à l'aise ? » qu'elle prétend servir (C6, C10).**
Passages : 4.2 « Priorité : lien de retour, puis quiz (même appareil), puis la réponse au geste … (C9 B), puis la scène par défaut » ; C9 B « corrige le cas de Sophie et de Marc » ; 4.4 (quatre états d'« Aujourd'hui », sans ce geste).
Problème : une réponse explicite, donnée à l'instant, passe après un résultat de quiz ancien et implicite. Sophie qui a passé le quiz sur son téléphone (Observateur, donc Confiance) et répond « au boulot » reçoit quand même Confiance : le geste ne corrige rien sur le même appareil, alors que c'est le cas visé. Par ailleurs le geste « juste après le premier pas » n'est dans aucun des quatre états d'« Aujourd'hui », et n'est pas dit s'il est posé à qui a déjà un signal.
Correction : ordre « lien de retour, puis réponse au geste (si donnée), puis quiz (même appareil), puis scène par défaut » ; dire que le geste est posé une seule fois, après le premier pas, à tous (ou seulement sans signal, à choisir), et l'ajouter aux états de 4.4 comme élément secondaire, jamais comme action principale.

**Q3. [BLOQUANT] Le parcours par défaut de la majorité des abonnés n'est choisi par personne et n'est pas posé à Thomas (C8, C10, C2).**
Passages : 4.2 « Aucun signal : Répartie, étape 1 … [HYPOTHÈSE ; étape 1 à relire pour un débutant, repli Machine à Café] » ; « on suppose qu'elle est minoritaire tant que le quiz n'est pas rattaché au compte » ; C7 « Le parcours par défaut sans signal est Répartie, qui est INTERMEDIAIRE » (aucune option ne le tranche) ; C9 A.
Problème : puisque le quiz n'est pas lié au compte, l'abonné « sans signal » est probablement le cas courant. Son premier parcours est INTERMEDIAIRE, de 4 étapes à 20 minutes, choisi sur une hypothèse, alors que Machine à Café (DEBUTANT, 3 étapes, 15 minutes, étape gratuite déjà lue par beaucoup d'entre eux) est le parcours que la v4 recommandait. C7 expose le fait mais ses trois options ne portent pas sur ce choix. Autre cas non traité : l'abonné qui arrive d'une étape 1 gratuite (`returnTo` d'un parcours) se voit recommander « étape 1 » en semaine 2, qu'il a déjà lue.
Correction : poser le défaut à Thomas (dans C7 ou C9) avec 3 options : Répartie ; Machine à Café (reco proposée tant que l'étape 1 de Répartie n'est pas relue pour un débutant) ; les deux montrés au jour 2 sans défaut. Préciser pour `returnTo` vers une étape gratuite : la conseillée devient l'étape 2.

**Q4. [BLOQUANT] Le compte de cartes de 2.3 est périmé depuis la refonte des cartes du carnet (C6, C3).**
Passages : 2.3 « Cartes (situation x contexte) : 45 x 2 + 30 x 2 = 150 » et « 45 x 2 + 60 x 2 = 210 » ; 2.2 « Carte “Et toi ?” … une carte de production » ; « À défaut de carte à revoir, la place est prise par un autre contexte d'une situation déjà vue » ; 2.3 règle « un jour sur deux » (« cartes à revoir ou autre contexte »).
Problème : une carte du carnet « Et toi ? » n'a plus qu'un contexte (les deux ambiances sont affichées ensemble) : le carnet vaut 45 cartes, pas 90 ; le total est 105 à l'ouverture et 165 en V1 complète. Plus grave, 60 % des cartes à l'ouverture n'ont pas de « second contexte » : le remplissage prévu quand il n'y a pas de révision n'existe pas pour elles, et la règle « une situation nouvelle un jour sur deux » reste sans de quoi remplir les autres jours si le carnet est en retard.
Correction : recompter les cartes (45 + 60 à l'ouverture), dire ce qui occupe la place quand il n'y a ni révision ni second contexte (une carte « Quel registre ? » déjà vue avec l'autre contexte, ou rien : « c'est tout pour aujourd'hui » plutôt que de répéter), et refaire le test du carnet en retard avec ce nombre.

**Q5. [BLOQUANT] La reco A de C1 rend le catalogue difficile d'accès sans citer la décision du 12/11 (C2, C4).**
Passages : C1 option A « Sacrifie : le catalogue … passe en première ligne de “Plus”, à deux clics. Reco : ton mot “Vocabulaire” reste en haut » ; 6.2 « sur `/vannes` l'onglet actif serait “Plus” » ; `founder-preferences.md` l. 162 (12/11) : « Le reste du catalogue reste une bibliothèque en accès libre à côté ».
Problème : la v5 oppose le mot « Vocabulaire » (10/11) au catalogue « à un clic », mais ne cite pas la décision plus récente du 12/11 : le catalogue est une bibliothèque « à côté » du parcours, et « Bibliothèque » est le mot même de Thomas (variante B). C'est aussi le contenu que l'offre vend (« tout Deviens Marrant ouvert », 19/10) : l'abonné qui cherche une vanne (le geste le plus fréquent de tout le site) passe par « Plus », sans onglet qui le nomme. La reco peut être défendable, mais elle doit se présenter contre cette décision, ou être revue.
Correction : citer le 12/11 dans C1 ; faire passer le test des 3 secondes sur deux tâches avant de recommander (« où apprendre à construire une vanne ? » et « où trouver une vanne ? ») ; recommander B si A échoue sur la seconde (B garde les deux à un clic et ne sacrifie que l'étiquette « Vocabulaire », qui reste le titre d'un bloc).

**Q6. [BLOQUANT] La bonne réponse du bilan contredit la définition de « la sûre » (C9, C6).**
Passages : 3.10 question « registre » : B « Oui, merci, il était tranquille. Et toi, tu as pu te reposer ? » avec le retour « B. Il est pressé : une phrase qui se ferme toute seule » ; 2.2 « La sûre : … se ferme toute seule, la conversation reprend sans que l'autre ait à répondre » ; « La risquée : … lui rend la parole, elle appelle une réponse » ; 3.10 Format (« situations du parcours »).
Problème : la réponse B pose une question à l'autre, donc elle lui rend la parole : par la définition de 2.2 c'est la marque de « la risquée », pas d'une phrase qui se ferme toute seule. Le retour contredit la règle posée trois sections plus haut (faute objective au sens du 08/10). De plus, l'exemple est « tiré du carnet d'octobre » alors que le format dit « situations du parcours » : le bilan de Machine à Café doit s'appuyer sur ses propres situations (1.6 et les suivantes).
Correction : soit remplacer B par une réponse qui se ferme (par exemple sans question finale) en gardant le retour, soit changer le retour (« B : courte, elle rend la parole sans retenir ; la A demande qu'il ait le temps de sourire ») et nommer le registre juste ; prendre la scène dans une situation du parcours.

### Non bloquantes (à traiter pour 10/10)

**Q7. Carte « Quel registre ? » : l'ordre biaise la mesure et double le choix (C10, C1).** 2.2 : les répliques s'affichent avant « Tu avais une réponse tout de suite ? », puis un nouveau choix suit. (a) Après avoir lu la joueuse et la sûre, « Oui, proche de celle-ci » devient presque automatique : la mesure du « indicateur n°1 » est faussée par l'effet d'après-coup ; (b) « touche la réplique la plus proche » puis « choisis celle qui convient » sont deux touchers sur les trois mêmes répliques. Proposer à l'étalon E5 deux ordres et deux formulations, et décider quel ordre sert la mesure (avant les répliques) ou le choix.

**Q8. « Mesurée » contre « estimée » (C3).** 1.1 « Durée réelle … mesurée seulement sur Machine à Café » et C2 « mesuré sur Machine à Café » : INV 3.1 dit « estimation de lecture [HYPOTHÈSE : 200 mots/minute] » avec chronométrage à faire. Écrire « estimée ». Par ailleurs C2 : « Tout est facultatif sauf le cœur de l'étape » laisse croire que l'étape est imposée alors que l'ordre est conseillé, jamais un verrou (18/10) : écrire « le cœur de l'étape est ce que la promesse couvre ».

**Q9. Détournement 1 de 3.6 (C9).** « Mieux vaut tard que jamais, dit celui qui souhaite un bon anniversaire en mars » est l'emploi normal de l'expression, pas un détournement ; le détournement 2 (« Chassez le “on se voit bientôt” … ») est bon. Remplacer le premier avant l'étalon E2, ou le garder comme contre-exemple « ça ne détourne rien ».

**Q10. Mots et promesses à corriger (C3, C8).** « Retiré par l'abonné : suppression définitive de l'échange » : les e-mails de questions sont gardés 6 mois (25/10) ; écrire « retiré de ton historique » et aligner sur la phrase de @legal. C10 B : « à la réabonnement » (au réabonnement). C9 A : phrase finale vide.

**Q11. Premier pas avec `returnTo` (C10).** 4.2 : « Lien de retour : cette fiche » comme premier pas, « le parcours de cette fiche » comme conseillé. Si la fiche est une vanne ou un article, dire à quoi elle sert de premier pas (son exercice « À toi de jouer »), et si c'est une page publique non Premium (blog), quelle est la règle de repli.

**Q12. Entrée de barre qui apparaît (C4).** 6.2 : l'onglet « Vocabulaire et techniques » (variante A) n'apparaît qu'au seuil ; la barre passe donc de 5 à 6 entrées après l'ouverture. Dire que l'emplacement est réservé (ou que « Plus » garde le contenu prêt) pour éviter un onglet qui surgit sous les doigts de l'abonné.

## 4. Réponses directes

1. **Quiz dans le navigateur seulement** : bien intégré (4.2, 4.3, C9). Ce qui manque : l'ordre des signaux (Q2) et le défaut sans signal (Q3), puisque le quiz ne couvre qu'une minorité.
2. **Barre** : A, B, C comptent chacune 6 entrées, « Aujourd'hui » toujours présent, « Mon profil » hors des 6. La reco A est à revoir ou à justifier contre le 12/11 (Q5).
3. **« Mes questions »** : circuit unique, fil, adresses, états, charge, norme de réponse : solides. Manque la ligne de détresse posée à Thomas (Q1).
4. **Temps hebdomadaire** : bien posé (C2) ; reste le vocabulaire (Q8).

## 5. Points acquis (à ne pas perdre au tour 6)

- 4.1 (deux lignes de temps), 4.2 (table au code), 4.3 (cas d'essai honnêtes), 2.2 à 2.4 (progression par réussite, glissement des révisions, missions aux cas limites).
- 2.6 (un délai, un fil, adresses, `/profil` conserve un lien, norme de réponse, charge à 500 abonnés), C10 réduite.
- C2, C9, C10 bien posées ; 7.3 bis ; totaux de 5.3.
- Exemples de la poêle, du rattrapage (« Je vous laisse jusqu'à trois pour trouver ça drôle. Un. »), du frigo, du faux secret avec contre-exemple.
