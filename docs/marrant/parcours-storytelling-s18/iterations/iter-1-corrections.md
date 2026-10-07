# Itération 1 : corrections des étalons Storytelling (s18)

Fichier corrigé par Edit : `docs/copy/etalons-parcours-storytelling-s18.md`. Sources : `iter-1-reviewer.md` (R1 à R20) et `iter-1-ux.md` (X1 à X14).
Bilan : 34 défauts traités, 34 corrigés, 0 écarté en entier. Trois corrections s'écartent partiellement de la proposition du relecteur, motif en dernière colonne : X2 (durée non chiffrée), X3 (un seul choix au lieu de deux), X12 (« tes histoires » et non « ton histoire »).
Vannes de remplacement vérifiées : « On m'a volé le cadenas de mon vélo. Pas le vélo. » et « Mon père a acheté une tondeuse robot… » sont actives au texte exact (`vannes-actives-s17.json` l. 234 et 1234) et absentes des 13 étapes de `parcours-reecriture-s17.json` (grep).
Recompte des mots refait pour les 5 vannes et pour l'exemple du conseil 1a (voir le fichier d'étalons).

| Défaut | Statut | Motif en une ligne |
|---|---|---|
| R1 | corrigé | Vanne du bus remplacée par le cadenas (contexte 8 mots, chute 6). |
| R2 | corrigé | Exemple 1a : contexte étoffé, 11 mots contre 8 pour la chute (version de X1, même effet). |
| R3 | corrigé | Tous les décryptages réécrits avec des comptes vérifiés (17/3/6, 8/3/6, 11/4/9, 15/6/4, 12/5) et phrase manquante supprimée. |
| R4 | corrigé | Règle 1b reformulée (« un mot ou un détail déjà dit, qui change de sens ») et explication de l'exemple sur le mot « préparer ». |
| R5 | corrigé | « La blague à tiroirs, c'est une vanne qui en contient d'autres » ; autocontrôle du handoff précisé. |
| R6 | corrigé | Titre A : « raconter tes histoires en 6 semaines » (60 caractères). |
| R7 | corrigé | Accroche B et témoignage B réécrits (trois champs, trois idées, réplique qui fait sourire, plus de contradiction avec les trois minutes de l'étape 1). |
| R8 | corrigé | Argument contre « Construire une histoire drôle » aligné sur son texte en base, sans le grief EXPERT. |
| R9 | corrigé | Phrase sur Pascot gardée et marquée `[À VÉRIFIER]` ; ajoutée à la liste « Attend Thomas ». |
| R10 | corrigé | Désaccord avec la spec de s17 écrit noir sur blanc ; phrase A passée à « tes histoires … en découper une ». |
| R11 | corrigé | `moduleDetail` raccourci (environ 70 mots), détail drôle ajouté (le fromage), plus de répétition avec `why`. |
| R12 | corrigé | Description B cite maintenant le détour ; la vérification devient exacte. |
| R13 | corrigé | Les deux couettes (et la tondeuse) marquées « déjà en étape 1 » dans la ligne de l'étape 4. |
| R14 | corrigé | Repli du défi 1b dédoublonné (« teste-les sur un proche, à l'oral ou par message »). |
| R15 | corrigé | RC1, RC2, RC10, COP-01, s14 REECRIRE/GARDER et balises de conscience retirés des passages pour Thomas ; codes gardés dans le handoff seulement. |
| R16 | corrigé | Signalement 1 réécrit : « décidé par la règle la base fait foi, rien à trancher aujourd'hui ». |
| R17 | corrigé | `[À VÉRIFIER @fullstack]` ajouté sur la désignation des vannes par texte (seedId null, spec en `jokeIds`). |
| R18 | corrigé | Date retirée : « inactifs en prod (export du 08/10) ». |
| R19 | corrigé | « 34 ans » retiré du témoignage A. |
| R20 | corrigé | Justification Tinder réécrite (« n'apporte rien à la chute, alors qu'Uber Eats et Ikea la portent »). |
| X1 | corrigé | Même correction que R2 ; version X1 retenue (« dans un bistrot près de chez moi », contexte 11 mots, chute 8). |
| X2 | corrigé, écart partiel | Défi réécrit (critère de réussite, notes, autre personne, repli « rien en tête », séance contre ce soir, garde-fou). Durée « une dizaine de minutes » non reprise : non mesurée, je n'écris pas de chiffre dans le texte public. |
| X3 | corrigé, écart partiel | Défis 1b et 1c reprennent l'anecdote du parcours ; la fiche passe à « au fil des étapes » ; décision pour les étapes 3 et 6 posée en un seul choix 6 (A adoucir, reco / B retoucher les deux conseils actifs, textes prêts) au lieu de deux choix 1d et 1e, pour tenir 8 choix au maximum. |
| X4 | corrigé | « les seuls détails qui servent la chute » dans le conseil ; plus de « détails » dans `moduleDetail`. |
| X5 | corrigé | Deux questions livrées : Q1 « quel détail couper » (D), Q2 le contexte (B), un seul prénom dans l'étape, positions D, B, A, C. |
| X6 | corrigé | Même correction que R4 (le mécanisme est le mot « préparer »). |
| X7 | corrigé | Même correction que R1. |
| X8 | corrigé | Légendes réécrites avec les seuls faits de la fiche et une consigne d'observation : plus de `[À VÉRIFIER]` dans les légendes. Mirabel et Pascot restent marqués, jamais retirés (règle P0 s15). |
| X9 | corrigé | Fusionné dans X2 : écrire dans la séance, dire à quelqu'un ce soir. |
| X10 | corrigé | Fusionné dans X2 : « un rendez-vous » retiré, phrase finale « si l'histoire te pèse un peu… ». |
| X11 | corrigé | Même correction que R5. |
| X12 | corrigé, écart partiel | Tutoiement corrigé (« tes ») ; le singulier « ton histoire » est écarté : le titre promet la compétence (raconter), la fiche promet le travail sur une anecdote. |
| X13 | corrigé | Même correction que R3. |
| X14 | corrigé | Définition des trois actes retirée du `moduleDetail` (elle reste dans `why` et dans le conseil). |

## Changement non demandé, à signaler

La vanne 4 de l'étape 1 (« J'ai bloqué quelqu'un sur les réseaux… ») a été remplacée par la tondeuse robot : au recompte, sa chute (8 mots) dépasse son contexte (6 mots), alors que le critère affiché est « chute plus courte que le contexte ». Les 5 vannes respectent maintenant le critère mot à mot.
