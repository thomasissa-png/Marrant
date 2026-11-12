# Niveaux et XP, tour 2 : relecture à l'aveugle de la v2 (@elon)

> AVIS CONSULTATIF. Relecteur indépendant, sans accès aux autres avis du tour 2.
> Document noté : `docs/espace-client/niveaux-xp-s24.md` v2. Même grille qu'au tour 1.
> Calculs revérifiés : 120 x 10 = 1 200 ; 1 200 / 3 100 = 39 % ; 30 x 10 = 300 XP par minute, donc 5 000 en 17 minutes et 2 300 en 8 minutes ; 30 x 500 = 15 000 XP par minute ; 3 100 - 800 = 2 300 sans Storytelling ; 3 100 - 700 = 2 400 sans Boulot. Tout est juste.

## Verdict en une phrase

La v2 est un bon document : les sources d'XP sont toutes sur la table, la triche est fermée sans attendre Thomas, C4 n'est plus reposée, la courbe est protégée par une règle écrite et l'option qui mesure un progrès réel est présentée honnêtement. Il ne reste aucun bloquant. Trois réglages ensuite :
- les noms « Tu + verbe » affirment une compétence que la règle A ne mesure pas ;
- la règle C peut récompenser la **marche tentée** plutôt que réussie, ce qui supprime l'essentiel de son risque ;
- deux limites de la règle C sont surestimées.

## Statut de mes corrections du tour 1

| # | Correction T1 | Statut | Commentaire |
|---|---|---|---|
| 1 | XP des conseils sans limite, endpoint qui fait confiance au navigateur | OK | 1.1 (4 sources), 1.2, 2.5 (correction de sécurité « sans te la demander »), Q1 avec reco B argumentée (« lire n'est pas pratiquer »). |
| 2 | Retirer la Q4 (C4 tranchée) | OK | C4 dans « Déjà décidé, non reposé ». |
| 3 | Option « marche de mission » | OK | Règle C, marquée « touche l'esprit de C4, accord requis », avec limites et repli sur A. Je corrige mon tour 1 : j'avais écrit que les retours de mission étaient « déjà stockés ». C'est vrai pour les retours d'exercice (`RETOURS_EXERCICE`), pas pour les missions. La v2 a raison. |
| 4 | La courbe ne nourrit jamais le cap | OK | Règle écrite en 2.3 et critère 8 testable. |
| 5 | Noms de scène | OK | Supprimés, noms de conversation (E1, E2). Voir X1. |
| 6 | Garde-fou sur toutes les sources | OK | 3.0 et critères 1 et 2, avec le cas du parcours dépublié. |
| 7 | Deux « niveaux » | OK, au-delà | Le mot « cap » règle la collision (difficulté des parcours, des conseils, XP). |

Bilan sur 7 : 7 OK.

## Notes

| Critère | T1 | T2 | Justification (passage cité) |
|---|---|---|---|
| Valeur persona | 7 | 9 | Pastilles sans pourcentage, phrase de passage sobre (« Nouveau cap : {nom}. »), rien dans « Aujourd'hui », caps jamais en baisse. Reste X1 : « Tu rebondis » à 300 XP et « Tu tiens la conversation » à 2 300 disent à l'abonné ce qu'il sait faire, alors que la règle A compte des étapes validées d'un clic. |
| Ambition | 6 | 9 | La question de fond est posée (Q2 C, « la seule option où le cap dit un progrès réel »). Il manque la variante qui la rend sûre (X2). |
| Exactitude | 5 | 9 | Tous les chiffres sont justes. Deux limites de la règle C sont présentées plus fortes qu'elles ne sont (X3). |
| Respect des décisions | 6 | 10 | C4 non reposée ; règle C et Q5 C marquées ; FAQ du 29/09, XP d'étape et bonus intouchés ; écart avec le brief sur « Aujourd'hui » dit et assumé. |
| Questions à Thomas | 7 | 10 | Q1 d'abord parce qu'elle fixe tous les seuils ; options réelles ; la reco B donne ses quatre raisons et son coût (« la bulle "+10 XP" disparaît »). |

**Note globale : 9,4 / 10** (T1 : 6,2).

## Corrections (aucune bloquante, toutes nécessaires pour 10)

X1. **Les noms E1 et E2 ne doivent pas affirmer une compétence que la règle A ne mesure pas (3.4).**
- Passages : 2.1, « Comique : un verdict de talent que rien ne prouve (XP déclarés et falsifiables) » ; 3.4, E1 « Tu rebondis », « Tu places tes vannes », « Tu tiens la conversation » ; E2 « Ton timing », « Ta patte ».
- Problème : c'est la même faute que « Comique », en plus doux. Sous la règle A, le cap compte des étapes validées ; « Tu tiens la conversation » dit à Yanis qu'il sait faire une chose que rien n'a vérifiée. Le document le pressent (« la plus proche d'un verdict »), mais seulement pour un nom.
- Correction : ajouter aux tests de relecture « Le nom affirme-t-il une compétence que la règle ne mesure pas ? (non attendu) ». Proposer, pour les règles A et B, une variante qui nomme le chemin et non la compétence. Par exemple : « Tu t'échauffes », « Tu te lances », « Tu as un parcours dans les jambes », « Tu as pris le rythme », « Tu as fait le chemin » (à l'étalon). Les noms de compétence (E1 actuel) n'ont de sens qu'avec la règle C, où ils décrivent un acte fait.

X2. **Règle C : récompenser la marche tentée, pas la marche réussie (3.3, Q2 C).**
- Passages : « le cap = la plus haute marche de mission où l'abonné a répondu "Essayé, ça a marché" » ; limite (2), « le récompenser par un cap le rend gagnable en cliquant (Goodhart) ».
- Problème, par principes premiers : pour un introverti, le progrès n'est pas que ça ait marché, c'est **d'avoir osé**. Récompenser la réussite déclarée crée exactement l'incitation à mentir que la v2 relève, et cela pollue le retour qui sert à proposer la marche suivante.
- Correction : cap = la plus haute marche **tentée** (« Essayé, bof » ou « Essayé, ça a marché »). Comme une marche n'est proposée qu'après la réussite de la précédente (v11 §2.4), « tentée à la marche k » implique déjà « réussie à k - 1 » : l'échelle reste exigeante. Déclarer « ça a marché » ne rapporte plus rien de plus, donc le retour reste honnête. Et le cap récompense l'acte qu'on veut encourager. Récrire la limite (2) en conséquence ; les noms E3 (« À voix haute », « Avec un proche »…) vont tels quels.

X3. **Deux limites de la règle C à remettre à leur juste poids (3.3, 3.5).**
- Passages : limite (3), « les retours de mission ne sont pas encore stockés : à construire [...] la règle dépend d'un chantier non construit » ; 3.5, « ne demande aucun chantier de plus ».
- Problème : (a) stocker les retours de mission fait déjà partie du chantier de l'espace (architecture v11 §7.3 : « de quoi retenir, par abonné, [...] les retours de mission »). La règle C ne crée pas ce chantier, elle en dépend comme le moteur lui-même ; seul le champ du cap est en plus. (b) La règle A est aussi déclarative : « valider une étape est un geste déclaratif [...] 3 100 XP en un week-end » (v1, 1.2). Goodhart vaut pour les deux règles. La vraie différence est ce qu'on récompense : des clics de validation (A) ou un acte dans la vraie vie (C, avec X2).
- Correction : réécrire (3) « dépend du stockage des retours de mission, déjà prévu au chantier de l'espace ; seul le champ du cap s'ajoute », et ajouter à la comparaison : « A et C sont toutes deux déclaratives ». La reco A reste défendable, puisqu'elle ne touche pas l'esprit de C4 ; elle doit simplement être choisie pour cette raison, pas pour un chantier qui n'en est pas un.

## Avis (si c'était mon projet)

Q1 B (retirer les 10 XP par conseil) : oui. Q2 : je proposerais à Thomas C avec X2 (marche tentée) en le prévenant clairement qu'elle touche l'esprit de C4. C'est la seule règle où le cap dit quelque chose de vrai sur la personne, et elle repose sur un stockage déjà prévu. S'il refuse, A avec des noms de chemin (X1). C'est lui qui appuie sur le bouton.

---
**Handoff → session principale**
- Fichier : `docs/espace-client/niveaux-xp-iterations/tour-2-elon.md` ; note 9,4/10 (T1 : 6,2). Mes 7 corrections du tour 1 : 7 OK. Je corrige au passage mon « retours de mission déjà stockés » : ils sont prévus au chantier de l'espace, pas encore stockés.
- Aucun bloquant. Trois réglages pour 10 : X1, les noms E1 et E2 affirment une compétence que la règle A ne mesure pas ; X2, la règle C doit récompenser la marche **tentée** (courage) et non la réussite déclarée, ce qui supprime l'essentiel du risque Goodhart ; X3, deux limites de C sont surestimées (le stockage est déjà prévu ; la règle A est aussi déclarative).
- Ce sont des AVIS : Thomas décide.
---
