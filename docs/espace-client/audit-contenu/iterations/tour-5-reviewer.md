# Tour 5, relecture à l'aveugle @reviewer : « sections de contenu » (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `architecture-contenu-v5.md` (V5). Même grille C1 à C10 que les tours 1 à 4. Faits contrôlés dans le dépôt (FP = `founder-preferences.md`).

## 1. Notes

**Faits contrôlés et justes** : `recommendedParcours` (`quiz-data.ts` l. 51, 64, 76, 88, 100) repris exactement en §1.1 et §4.2 ; quiz gardé dans le navigateur (`viral-quiz.tsx` l. 36 à 47, `localStorage`) ; phrases de @legal (`docs/legal/espace-client-s24-phrases.md` : section 9 puces 1 et 4, partie 6, partie 4 ligne Neon, CGU art. 10, « Base légale : exécution du contrat », « Mention d'opposition : non obligatoire ») ; carnet `2026-10-03` « Le lundi à la machine à café » (réponse l. 34, `siTendu` l. 36) ; e-mail E1b « Poser ma question : {url}/profil » ; arithmétique de §4.1 (55 à 60, 70 à 75, 57 à 62) et §7.3 bis. Zéro tiret cadratin.

| # | Critère | T1 | T2 | T3 | T4 | T5 | Justification (passage cité) |
|---|---|---|---|---|---|---|---|
| C1 | Valeur persona | 6 | 8 | 9 | 9 | 9 | Carte « Et toi ? » sans choix trivial, « Si tu as 5 minutes », missions bornées aux deux extrémités, « Mes questions » avec fils et norme de réponse. Reste : la majorité des abonnés (sans signal) part sur un parcours INTERMEDIAIRE sans que ce choix soit posé (Q3). |
| C2 | Respect des décisions | 5 | 7 | 8 | 8 | 9 | P2 et P5 bien corrigés : « Vocabulaire et techniques » en haut dans la reco, l'avis juridique n'est plus qu'une option marquée « rouvre ta décision du 25/10 ». Rien de rouvert sans marquage. Reste : le défaut « Répartie » est un choix de produit tranché sans question (Q3). |
| C3 | Zéro donnée inventée | 6 | 8 | 8 | 8 | 8 | Faits de code justes. Mais « environ 22 à 25 minutes (mesuré sur Machine à Café) » (C2), « étape complète (mesurée sur Machine à Café : 24 min) » (§4.1) : c'est une estimation de lecture (INV 3.1, [HYPOTHÈSE] « à chronométrer »), jamais une mesure (Q2). La reco de C9 avance un effet (« corrige le cas de Sophie et de Marc ») que la règle de priorité du document rend faux (Q1). |
| C4 | Rubriques claires, 6 max | 5 | 7 | 8 | 8 | 9 | La contrainte est dite en une phrase, « Ce qu'elle sacrifie » est honnête pour chaque variante, la barre s'ouvre au seuil. Plus rien à redire sur la structure ; le test des 3 secondes reste à faire sur rendu, ce qui relève de l'étape suivante. |
| C5 | Ambition | 8 | 8 | 9 | 9 | 9 | Fils dans « Mes questions », norme d'une réponse « Situation à gérer », régime mensuel complet. |
| C6 | Cohérence | 5 | 7 | 8 | 7 | 8 | P1 corrigé au code. Mais : priorité « quiz, puis geste » (§4.2) contre « le geste de C9 B (« au boulot ») l'envoie vers Machine à Café » (§4.3) (Q1) ; le bilan « construit sur des situations du parcours » est construit sur une fiche du carnet, avec un distracteur neuf alors que « le contexte est le seul texte neuf » (Q5) ; la scène d'entrée « La caisse » double la carte du carnet `2026-10-02` (Q6). |
| C7 | Faisabilité | 6 | 7 | 8 | 8 | 9 | Régime mensuel complet, y compris les réponses « Situation à gérer » ; la relecture du carnet suit C8. La nouvelle donnée de C9 B/C n'a pas sa phrase juridique prévue (Q8), mineur. |
| C8 | Questions | 6 | 7 | 8 | 8 | 8 | C1, C2, C10 exemplaires. Mais la reco de C9 repose sur un effet faux (Q1), et le parcours par défaut pour la majorité n'est l'objet d'aucune option (Q3). |
| C9 | Exemples au ton maison | 5 | 8 | 8 | 8 | 8 | « Chassez le "on se voit bientôt", il revient chaque fin d'été, intact » tient. « Mieux vaut tard que jamais, dit celui qui souhaite un bon anniversaire en mars » ne donne pas l'ancre (quel anniversaire, quand ?) : la chute n'est pas logique en l'état (Q7). |
| C10 | Progression | 5 | 8 | 9 | 8 | 9 | Entrée recâblée sur le code, calendrier par parcours. Reste : la question « Tu avais une réponse tout de suite ? » est posée APRÈS avoir vu les répliques, ce qui biaise l'indicateur n°1 (Q4). |

**Note globale : 8,6 / 10** (86 / 100 ; T1 5,7 ; T2 7,5 ; T3 8,3 ; T4 8,1). Aucun critère à 10.

## 2. Statut de mes corrections du tour 4

| T4 | Objet | Statut | Commentaire |
|---|---|---|---|
| P1 | Profils du quiz contre le code | ok | §4.2 conforme au code (vérifié) ; scènes d'entrée appariées au terrain de chaque parcours ; cas d'essai recalés. L'option C9 B crée un nouveau problème (Q1). |
| P2 | Barre sans « Vocabulaire » | ok | Reco A, contrainte dite, « Ce qu'elle sacrifie » symétrique. |
| P3 | Carte du carnet triviale | ok | Carte « Et toi ? » sans choix, révision sur « Rien » seulement. |
| P4 | E-mail J12 | ok | Rectifié (E1b vers `/profil` sans ancre ; E1 et J21 recopiés). |
| P5 | Avis juridique dans C10 | ok | Hors reco, option marquée. |
| P6 | Relecture mensuelle du carnet | ok | « Selon C8 », coût par option. |
| P7 | Carnet corrigé revient à Thomas | ok | §1.4 et C8. |
| P8 | [À VÉRIFIER] levés | ok | Quiz, playbook (« sans humour »). |
| P9 | Accusé de réception | ok | Aligné sur `glossary.ts` l. 79. |
| P10 | Exemples sous la barre | ok en partie | Rattrapage et 2e détournement remplacés ; le 1er détournement a une chute sans ancre (Q7). |
| P11 | Bilan sur la poêle | mal traité en partie | Thème Machine à Café, mais matière = carnet `2026-10-03`, pas le parcours ; distracteur neuf (Q5). |
| P12 | Temps dans C2 | ok, avec réserve | Bien posé, mais « mesuré » au lieu d'« estimé » (Q2). |

**Bilan : 9 ok, 1 ok avec réserve, 2 partiels, 0 non traité.**

## 3. Nouvelles corrections

1. **Q1. C9 B, reco : « il marche sur tous les appareils et corrige le cas de Sophie et de Marc » ; §4.3 : « le geste de C9 B (« au boulot ») l'envoie vers Machine à Café », « (« partout ») l'envoie vers Confiance ».** Problème : §4.2 fixe la priorité « lien de retour, puis quiz (même appareil), puis la réponse au geste ». Une Sophie passée par le quiz en Observateur reste donc envoyée vers Confiance, un Marc Storyteller vers Storytelling : le geste ne corrige rien dans les cas cités, et l'argument principal de la reco est faux. Correction : soit le geste passe avant le quiz pour le parcours de la semaine 2 (une préférence déclarée vaut mieux qu'un profil déduit), dit dans §4.2 et dans C9 ; soit on retire la phrase « corrige le cas de Sophie et de Marc » et §4.3 se limite aux abonnés sans quiz. **Bloquant : oui.**
2. **Q2. C2 « environ 22 à 25 minutes (mesuré sur Machine à Café) », §4.1 « étape complète (mesurée sur Machine à Café : 24 min) », §1.1 « mesurée seulement sur Machine à Café ».** Problème : INV 3.1 donne des ESTIMATIONS de lecture (« [HYPOTHÈSE : ≈ 200 mots/minute…] à valider par un essai chronométré »). Présenter à Thomas une estimation comme une mesure est une donnée inventée. Correction : « estimé (lecture) », et proposer le chronométrage avec un lecteur avant de trancher C2. **Bloquant : non**, requis pour 10/10 en C3.
3. **Q3. §4.2 « Aucun signal : « La caisse » […] Répartie, étape 1 « Tes premières répliques » (gratuite) […] [HYPOTHÈSE ; étape 1 à relire pour un débutant, repli Machine à Café] » ; C7 et C9 l'énoncent comme un fait.** Problème : c'est le chemin de la majorité supposée des abonnés (« on suppose qu'elle est minoritaire tant que le quiz n'est pas rattaché au compte »), et il passe de Machine à Café (v4) à Répartie (INTERMEDIAIRE) sans option soumise à Thomas. De plus, le doute « à relire pour un débutant » a déjà une source : l'étape 1 de Répartie fait partie des 3 étapes gratuites réécrites en B, avec « repli solo », validées par Thomas (FP l. 73, 07/10). Correction : citer FP l. 73 au lieu du [À VÉRIFIER] ; mettre le parcours par défaut en option dans C9 (A : Répartie, promesse du site ; B : Machine à Café, seul parcours débutant court), avec une reco argumentée. **Bloquant : non.**
4. **Q4. §2.2, ordre de la carte : « 3. Les répliques apparaissent » puis « 4. « Tu avais une réponse tout de suite ? » ».** Problème : la question vient après avoir vu les trois répliques. Un abonné reconnaît après coup une réponse qu'il n'avait pas (« Oui, proche de celle-ci »), ce qui gonfle l'indicateur n°1 de §7.6, la courbe de la répartie. La v4 posait la question avant. Correction : demander « Tu avais une réponse ? Rien / Oui » avant de montrer les répliques, puis « Proche de laquelle ? » après ; ou garder l'ordre et nommer ce biais en §7.6 (la courbe se lit comme « reconnu », pas « produit »). **Bloquant : non**, requis pour 10/10 en C10.
5. **Q5. §3.10, question « registre » : « réponses A et B tirées du carnet d'octobre, fiche 3 » ; format : « construites sur des situations du parcours […] (le contexte est le seul texte neuf : 20 en tout) ».** Problème : A et B sont la réponse et la sortie polie de `2026-10-03` (l. 34 et 36), pas une situation du parcours Machine à Café. L'abonné a déjà vu cette scène en carte « Et toi ? », avec l'étiquette « tendue » sur la sortie polie : le bilan recrée le choix évident que la v5 vient de retirer de la rafale (P3). Enfin, l'option C (« Alors, samedi : j'ai d'abord pris le bus, puis... ») est un texte neuf non compté. Correction : construire la question sur une matière du parcours (quiz, vannes ou conseil de Machine à Café, ou une situation neuve rattachée à une de ses étapes), et compter les distracteurs neufs en §7.3. **Bloquant : non.**
6. **Q6. §4.2 « Quiz : Punchlineur | « La caisse : "Vous avez la carte du magasin ?" » (inspirée du carnet d'octobre) » et « Aucun signal | « La caisse » ».** Problème : la fiche du carnet `2026-10-02` « La carte du magasin » est aussi une carte de la rafale : l'abonné sans signal croise la même scène deux fois dans ses premiers jours. Correction : soit la fiche du carnet sert elle-même d'entrée (aucun texte neuf), soit on choisit une autre scène de caisse. **Bloquant : non.**
7. **Q7. §3.6 « Mieux vaut tard que jamais, dit celui qui souhaite un bon anniversaire en mars. »** Problème : sans l'anniversaire de référence, « en mars » n'est pas en retard pour le lecteur ; la chute repose sur une information absente (barre Alexa : « logique »). Correction : remplacer par « [à écrire à l'étalon E2] » ou par une version qui porte son ancre. **Bloquant : non.**
8. **Q8. C9 B et C « Une phrase à ajouter à la confidentialité, au plus court ».** Problème : le fichier de @legal ne couvre que « Mes questions » ; le signal retenu sur le compte (geste ou profil du quiz) n'a pas sa phrase, et §7.5 (c) ne le prévoit pas. Correction : si C9 B ou C est retenue, phrase de @legal au plus court ajoutée aux prérequis de §7.5. **Bloquant : non.**

## 4. Conditions du 10/10

Lever Q1, traiter Q2 à Q8 ou les refuser avec raison, puis un nouveau tour à l'aveugle. La structure (barre, types, chemin, production, questions) est désormais au niveau ; il reste des points de précision.
