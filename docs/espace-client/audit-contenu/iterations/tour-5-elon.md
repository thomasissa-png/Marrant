# Tour 5 : relecture à l'aveugle de l'architecture de contenu v5 (@elon)

> AVIS CONSULTATIF, validation requise avant exécution. Relecteur indépendant, sans accès aux autres avis du tour 5.
> Document noté : `architecture-contenu-v5.md` (V5), même grille C1 à C10. Lu : sections 0 à 2.7, 3.6 à 3.10, 4.2 à 4.4, 6.1 et 6.2, 7.3 bis à 7.6, 8 en entier, annexe A.

## Verdict en une phrase

On y est presque. La carte est dans le bon ordre, le carnet sert à produire, l'aiguillage reprend le code et dit honnêtement que le quiz ne vit que dans le navigateur, la barre expose ses sacrifices, et l'avis juridique est marqué. Il reste deux fautes de logique qui touchent de vraies personnes :
- **le quiz passe avant la réponse que l'abonné vient de donner**, ce qui annule le correctif proposé pour Sophie et Marc ;
- **un message de détresse attend comme les autres**, jusqu'à 2 jours ouvrés.
Le reste est du réglage fin.

## Notes

| # | Critère | T4 | T5 | Justification (passage cité) |
|---|---|---|---|---|
| C1 | Valeur persona | 9 | 9 | Scène par défaut universelle (« La caisse »), un toucher « Où veux-tu être plus à l'aise ? » (C9 B), cartes « Et toi ? » de production, courbe avec texte neutre. Mais l'ordre « lien de retour, puis quiz (même appareil), puis la réponse au geste » (4.2) fait passer un quiz ancien avant le choix explicite d'aujourd'hui (P1), et « Message sensible [...] même engagement de délai, aucune promesse de priorité » (2.6) fait attendre une détresse (P2). |
| C2 | Respect des décisions | 9 | 9 | 25/10, 12/11 et 03/10 respectés et marqués ; l'avis d'avocat n'existe plus que comme option qui rouvre le 25/10 (C10). Reste : le 14/10, Thomas a dit pour un sujet sensible « on fait ça bien » ; retirer tout traitement prioritaire, même interne, ne le respecte pas (P2). |
| C3 | Zéro donnée inventée | 9 | 9 | Code du quiz et `localStorage` sourcés, playbook l. 595 cité. Deux chiffres ne suivent plus le modèle : « Cartes (situation x contexte) 45 x 2 » alors que les cartes « Et toi ? » n'ont plus de contexte (P3) ; « de 55 à 75 minutes avec seulement le cœur des étapes » (C2), alors que la semaine 1 en fait 40 (P7). |
| C4 | Rubriques claires | 9 | 10 | Trois variantes à 6 entrées réelles, une ligne « Ce qu'elle sacrifie » honnête pour chacune, coût d'un onglet « S'entraîner » écrit, ouverture au seuil sans onglet vide. Rien à redire : le choix revient à Thomas. |
| C5 | Ambition | 9 | 10 | Moteur adaptatif, mesure de compétence, fil de discussion dans « Mes questions », norme de réponse, régime mensuel chiffré jusqu'à 500 abonnés. |
| C6 | Cohérence | 8 | 9 | Ordre de la carte aligné partout (2.2, C3, E5). Restent : la priorité des signaux contredit la promesse de C9 B (P1) ; la question de bilan de 3.10 contredit sa propre explication (P4). |
| C7 | Faisabilité au niveau | 8 | 9 | Norme « Situation à gérer » et ligne dédiée dans 7.3 bis : bien. Mais « Lecture de Thomas : 0 » pour ces réponses, alors que la réponse est « relue et envoyée par l'équipe » et que l'équipe, c'est Thomas seul aujourd'hui (P5). |
| C8 | Questions à Thomas | 9 | 9 | C1 à C10 sans trou, sacrifices écrits, options marquées. C9 B affirme « corrige le cas de Sophie et de Marc », ce qui est faux tant que le quiz passe en premier (P1) ; C3 A propose de « reposer la question B en janvier » sans dire que le carnet de janvier s'écrit en décembre (P6). |
| C9 | Exemples | 9 | 9 | Détournements et risquée du rattrapage au niveau (« Je vous laisse jusqu'à trois pour trouver ça drôle. Un. »). Mais dans le bilan de 3.10, la bonne réponse B se termine par « Et toi, tu as pu te reposer ? », alors que le retour dit « une phrase qui se ferme toute seule » face à un collègue « pressé » (P4). |
| C10 | Progression | 8 | 10 | Ordre de tirage, compte à rebours proposé et jamais imposé, marches selon la réussite avec les cas limites, Répartie par défaut avec repli, courbe à partir de 10 cartes. |

**Note globale : 9,3 / 10** (93 / 10 critères ; T4 : 8,7 ; T3 : 8,6 ; T2 : 8,2 ; T1 : 5,6).

## Statut de mes corrections du tour 4

| # | Correction T4 | Statut | Commentaire |
|---|---|---|---|
| M1 | Ordre de la carte | OK | Ta réponse d'abord, répliques, « Tu avais une réponse tout de suite ? », choix, règle : identique en 2.2, C3 et E5. |
| M2 | Cartes du carnet en production | OK | Cartes « Et toi ? » sans étape de choix, révision sur « Rien », C3 A cohérente. Conséquence arithmétique en P3. |
| M3 | Aiguillage contraire au code | OK | 4.2 reprend `quiz-data.ts` ; les scènes d'entrée suivent le thème du parcours (Observateur : un groupe où l'on connaît peu de monde, terrain de Confiance) ; 4.3 dit ce que le produit ferait vraiment, avec une question de test par persona. Bonus : `localStorage` découvert et dit. |
| M4 | Persona principal entré par le bureau | OK | « La caisse » par défaut, Répartie avec repli, geste d'un toucher en C9 B (reco). Défaut de priorité en P1. |
| M5 | Avis juridique non marqué | OK | Phrases de @legal déjà écrites, aucun avis recommandé, l'avis d'avocat est une option marquée « rouvre le 25/10 ». |
| M6 | Répliques « Situation à gérer » non comptées | OK | Norme en 2.6 (méthode, puis 1 à 3 répliques validées avec lien, réplique neuve seulement si relue à l'aveugle dans le délai) et ligne dans 7.3 bis. Calcul juste (40 messages, 20 %, 8 répliques ; à 500 abonnés, 40). Détail en P5. |
| M7 | Mesure sans compte à rebours | OK | « tout de suite » et état du compte à rebours enregistré. |
| M8 | « Vocabulaire » hors de la barre | OK | La reco devient A, avec « Vocabulaire » en haut ; chaque variante dit ce qu'elle sacrifie. |
| M9 | Cas limites des missions | OK | Marche 5, marche 1, une seule mission ouverte. |
| M10 | Détournement sous la barre | OK | Remplacé (« dit celui qui souhaite un bon anniversaire en mars »), candidat à passer à l'aveugle. |

Bilan sur 10 : 10 OK.

## Nouvelles corrections

P1. **[BLOQUANT] Le quiz passe avant ce que l'abonné vient de dire (4.2, C9).**
- Passages : « Priorité : lien de retour, puis quiz (même appareil), puis la réponse au geste "Où veux-tu être plus à l'aise ?" » ; C9 B, « il marche sur tous les appareils et corrige le cas de Sophie et de Marc ».
- Problème : Sophie a passé le quiz il y a trois semaines sur ce téléphone, profil Observateur. Aujourd'hui elle touche « au boulot ». Avec cet ordre, le produit l'envoie quand même vers Confiance. Un signal frais, explicite et rattaché au compte perd contre un vieux résultat stocké dans le navigateur. Le correctif annoncé en C9 B ne corrige rien chaque fois que le quiz existe.
- Correction : deux priorités séparées. **Scène d'entrée** (jour 1) : lien de retour, puis quiz, puis défaut. **Parcours de la semaine 2** : réponse au geste, puis parcours de la fiche d'origine, puis quiz, puis défaut. Écrire que le geste est proposé à tout le monde, même à ceux qui ont un résultat de quiz. Ajuster la phrase de C9 B.

P2. **[BLOQUANT] Un message de détresse ne doit pas attendre son tour (2.6).**
- Passage : « Message sensible | Réponse à la main, sans humour, avec l'orientation vers l'aide officielle (3114) | [...] même engagement de délai, aucune promesse de priorité ».
- Problème : supprimer la promesse affichée de priorité était juste, car il ne faut pas promettre ce qu'un fondateur seul ne peut pas tenir. Mais la v5 a supprimé aussi le traitement prioritaire interne. Marc, récemment séparé, écrit un mardi soir dans « Situation à gérer » quelque chose qui n'est plus une situation drôle : son message attend derrière dix questions de paiement, jusqu'à 2 jours ouvrés. Le 14/10, Thomas a dit « on fait ça bien ».
- Correction : « Aucune promesse affichée. En interne, un message qui évoque une détresse est lu et traité en premier, dès qu'il est vu, et signalé par l'alerte interne. » Une phrase, aucun écran en plus.

P3. **[NON BLOQUANT] Les cartes du carnet n'ont plus deux contextes (2.3).**
- Passage : « Cartes (situation x contexte) | 45 x 2 + 30 x 2 = 150 | 45 x 2 + 60 x 2 = 210 ».
- Problème : les cartes « Et toi ? » montrent les deux répliques sur une seule carte, sans contexte. Le carnet donne donc 45 cartes et non 90 ; les totaux sont de 105 et 165. La phrase « la place est prise par un autre contexte d'une situation déjà vue » ne vaut que pour les situations neuves. Le stock de situations nouvelles (75 et 105) reste juste.
- Correction : corriger la ligne et préciser que les places libres sont remplies par les seconds contextes des situations neuves.

P4. **[NON BLOQUANT] La bonne réponse du bilan contredit son explication (3.10).**
- Passage : « Il est pressé, son café à la main, il regarde déjà son écran. [...] B) "Oui, merci, il était tranquille. Et toi, tu as pu te reposer ?" [...] Retour : B. Il est pressé : une phrase qui se ferme toute seule. »
- Problème : B finit par une question. Elle ne se ferme pas toute seule, elle oblige le collègue pressé à répondre. Et B est la sortie polie du carnet, que 2.2 refuse d'appeler « la sûre ». Le texte du carnet ne se modifie pas.
- Correction : changer le contexte et non la réplique (par exemple « il s'est arrêté, il a l'air d'avoir passé un week-end difficile », où B se défend), ou prendre une autre fiche dont la sortie polie se ferme vraiment. Réécrire le retour en conséquence.

P5. **[NON BLOQUANT] « Lecture de Thomas : 0 » pour les réponses (7.3 bis).**
- Problème : la règle du 25/10 dit « préparée en session, relue et envoyée par l'équipe », et l'équipe, c'est Thomas seul aujourd'hui. Il lit donc 100 % des réponses. À 500 abonnés, c'est environ 25 réponses par jour ouvré pour une seule personne : le vrai goulot, que les leviers réduisent sans le supprimer.
- Correction : écrire « chaque réponse, par l'équipe (Thomas seul aujourd'hui) » et un seuil de déclenchement [HYPOTHÈSE : par exemple 10 réponses par jour ouvré en moyenne sur un mois], au-delà duquel on pose à Thomas la question de l'aide (personne en plus, ou réponses types élargies).

P6. **[NON BLOQUANT] Calendrier de C3 B (8, C3).**
- Passage : « On pourra reposer la question B en janvier, avec la première mesure. »
- Problème : le carnet d'un mois s'écrit avant le 30 du mois précédent (7.3 bis). Décider en janvier, c'est un premier carnet à trois registres en février, au plus tôt.
- Correction : « Pour un carnet de janvier à trois registres, décision avant le 15/12 [HYPOTHÈSE de délai] ; sinon, février au plus tôt. »

P7. **[NON BLOQUANT] Fourchette de temps de C2.**
- Passage : « de 55 à 75 minutes avec seulement le cœur des étapes ».
- Correction : « de 40 (semaine 1, sans étape) à 75 minutes ».

## Ce qui manque encore pour 10

P1 et P2 : deux phrases à réécrire. Les points P3 à P7 sont du réglage. Je ne vois plus de défaut de conception dans le moteur ni dans la valeur persona.

---
**Handoff → session principale**
- Fichier : `docs/espace-client/audit-contenu/iterations/tour-5-elon.md` ; note 9,3/10 (T4 : 8,7). Mes 10 corrections du tour 4 : 10 OK.
- Bloquants restants (2) : P1, le quiz (navigateur) passe avant le geste « Où veux-tu être plus à l'aise ? », ce qui annule le correctif de Sophie et Marc : séparer la priorité de la scène d'entrée et celle du parcours ; P2, un message de détresse attend jusqu'à 2 jours ouvrés : traitement interne en premier, sans promesse affichée.
- Non bloquants (5) : cartes du carnet comptées deux fois, contradiction dans la question de bilan, Thomas lit en réalité 100 % des réponses, date de C3 B, fourchette de C2.
- Ce sont des AVIS : Thomas décide.
---
