# Notation indépendante, cycle 3 : relance des 3 réseaux (s15, 05/10/2026, @reviewer)

Objet noté : `docs/social/strategie-relance-v3.md` (V3:ligne), au regard de ma notation du cycle 2 (C2:ligne), de `founder-preferences.md` (FP:ligne), des personas (`project-context.md` PC:20-24), du catalogue (CV:ligne), des articles et de la fiche de décryptage, tous ouverts. Barre : 10 = publiable tel quel. Drôlerie pure hors périmètre (notée à l'aveugle par @copywriter). Les [CHOIX UTILISATEUR] ne sont pas rediscutés.

## 1. Corrections du cycle 2 : vérification

| Correction C2 | Statut | Preuve |
|---|---|---|
| K1 (a) e-mail avant Google pour toute vue intégrée | Appliquée | V3:57 |
| K1 (b) premier commentaire LinkedIn | Refus **recevable** : c'était mon repli prévu ; offre payante confirmée (Buffer : Essentials et Team, pas le plan gratuit) | V3:59, V3:157 |
| K1 (c) +480, (d) 7 vannes | Appliquées, sommes justes (190/50, 480/135, 50/10, 130/30, « 3 fois » = 190 contre 60 par semaine) | V3:31, V3:96-98 |
| X2 « figer n°4 » | Refus **recevable** : 6,5 à l'aveugle (relecture-aveugle-cycle2:10) | V3:116 |
| « n°12 pour LinkedIn » | Refus **recevable** : n°12 est dans la section parents (A1:94-104) ; n°6 est bien dans la section bureau (A1:71-78) | V3:69 |
| X3, IG2, IG3, L2, L3 | Remplacés selon R1 à R5 ; L2 = Alt A mot pour mot ; IG1 = légende B mot pour mot | relecture-aveugle-cycle2:50, 73 |
| L1 « 10 » refusé | Refus **recevable** (7,5 à l'aveugle) | relecture-aveugle-cycle2:15 |
| K5 (a) à (d) | Appliqués : Alexa exclue (S4:40), n°18 réservée, 01/11 retiré | V3:70-71, V3:81 |
| Point 5 (125 décryptages) | Sans objet, plus de promesse | V3:138 |

Sources ouvertes : les 16 identifiants sont dans CV mot pour mot (CV:10, 11, 19, 20, 44, 46, 81, 90, 94, 106, 120, 126, 132, 145, 166, 168) ; X2 = A1:147 (21 messages, A1:11) ; IG2 = S2:74 (5 accroches, S2:11) ; S4 n°4 et n°5 = S4:68-82 ; Halloween n°3 = S1:56-60 ; IG3 = `decryptage-ecrit-2.json:21-24` (V206) ; quiz : titre, « L'Observateur (l'observation précise) », 5 profils, « Environ 2 minutes », « sans inscription » (`quiz-humour/page.tsx:11, 38, 43, 48`). Tirets cadratins dans V3 : 0 (Grep). Jours de semaine recalculés : tous justes.

## 2. Notes

| Critère | Note | Preuve | Correction précise |
|---|---|---|---|
| K1 Stratégie | 8 | Grille, piliers, J0 par réseau, mesure par réseau : solides. 5 défauts. (a) Le modèle de relais « Les N autres sont prêts à copier » (V3:48) est faux pour S2 : l'article est en catégorie PRATIQUE et dit « pas de phrases à recopier non plus » (S2:17, S2:34) ; il s'applique dès le relais X du 12/10 (V3:68). (b) La règle « article de plus de 7 jours : sans lien » (V3:29) contredit le pivot Halloween du 30/10 avec lien (V3:70) : S1 est publié le 05/10 (S1:15), soit 25 jours avant. (c) Le code du directeur garde des gates qui rejetteraient le lot s'il passe par lui : G-S19 refuse la 1re personne hors guillemets, G-S16 limite la légende IG à 80 caractères (`standup-director-agent.ts:2212-2226, 2442-2444`) ; la spec (V3:53-60) ne dit pas si l'insertion du lot les contourne. (d) R1 cite « reviewer 10 » (V3:153) : mes notes C2 étaient 9, 8, 10, 9, 7 (C2:24-29). (e) « Une fois par mois, un humoriste » (V3:28) : aucun carrousel désigné en octobre, le premier est le 04/11 (V3:71). | (a) V3:48 : « Relais X : une ligne de l'article, puis, si l'article est en catégorie CATALOGUE, « Les N autres sont prêts à copier : lien » ; si PRATIQUE, « Les N autres exemples, et comment trouver le tien : lien » ». (b) V3:29, ajouter : « Exception : pivot saisonnier à son pic (Halloween 30/10), lien gardé. » (c) Spec, point 8 : « Le lot préparé est inséré sans passer par les gates G-S2, G-S16, G-S19 du directeur, ou celles-ci sont alignées sur la v3 (@fullstack) ». (d) « reviewer 7 à 10 ». (e) « Carrousel avec citation d'humoriste : 28/10, puis le 1er mercredi du mois ». |
| K2 X1 Alexa | 9 | CV:10 mot pour mot, plancher FP:33, une seule date. Défaut transverse T1 : vanne à la 1re personne sans guillemets sur le compte de la marque ; FP:15 n'admet la 1re personne qu'en « citation explicite », et G-S19 la rejette hors guillemets. Point que j'ai laissé passer aux cycles 1 et 2. | Guillemets « » autour de chaque ligne, texte intact, comme dans les articles (S4:40-42) : « J'ai dit à Alexa de me raconter une blague. » puis « Elle m'a lu mon historique de recherches. » Ou Thomas confirme à C1 que la vanne nue vaut citation (une fois, pour tous les posts). |
| K2 X2 Anniversaire | 9 | A1:147 exact, « Les 20 autres » exact (21 messages), UTM complets, article publié le jour même. T1 : sans guillemets, « Hier, j'ai pensé à toi » se lit comme la marque qui parle. | Message entre « », puis la ligne de renvoi inchangée. |
| K2 X3 Voisin + quiz | 9 | CV:44 exact ; « Observateur » juste (le quiz le définit par « l'observation précise », page.tsx:43, et la vanne en est une) ; 5 profils, 2 minutes et « sans inscription » vérifiés ; environ 253 caractères (lien compté 23). T1. | Vanne entre « » ; 2e bloc inchangé (environ 261 caractères, sous 270). |
| K2 IG1 Mimes | 8 | Cartes = CV:145, guillemets bien imbriqués (FP:50). La légende redit la chute (« n'a besoin d'aucun geste pour être compris ») : contraire à R3 (« jamais ce qu'elle raconte ») ; 88 caractères (G-S16 : 80). | Légende : « À envoyer à ton binôme du prochain jeu de mimes. deviens-marrant.fr » (67 caractères). |
| K2 IG2 Archives | 7 | S2:74 = CV:90 exact, 5 accroches exact, article de moins de 48 h donc en bloc 1. La légende « À sortir au tour de table » invite à réciter l'anecdote d'Inès comme la sienne, ce que l'article déconseille (« une accroche qui n'est pas la tienne sonne faux », S2:34 ; « remplace le détail par le tien », S2:66) ; 94 caractères. | Légende : « À envoyer à qui commence un nouveau poste. Les 4 autres accroches : lien en bio. » (80 caractères). |
| K2 IG3 Carrousel Maxime | 8 | Cartes 1-2 = CV:120 ; carte 3 fidèle à la fiche (V206, ligne 23) mais en 2 phrases, alors que R2 en demande une ; carte 4 fidèle à `howToApply` (ligne 24), mais le renvoi au quiz arrive sans lien avec l'exercice (même défaut que l'ancien X3). Légende R3 conforme (76 caractères). | Carte 3 : « Pourquoi ça fait rire : le groupe parle de Maxime comme s'il était absent alors qu'il lit tout, et sa réponse, sans le moindre reproche, se contente de le constater. » Carte 4 : « À toi de jouer : repère une scène où l'on parle de quelqu'un comme s'il était absent, alors qu'il est là. Pour savoir si ce genre de détail est ton style, le quiz « quel type d'humour es-tu ? » est dans le lien de la bio. » |
| K2 L1 Canapé | 9 | CV:94 exact, 3 phrases, bureau (Sophie, PC:23), jeudi 15/10. T1. | Vanne entre « ». |
| K2 L2 « T'as deux minutes ? » | 10 | Logique juste (deux minutes demandées, quatre perdues), tutoiement, 3 phrases fluides, aucune leçon (FP:17, FP:23), repli CV:19 exact. Texte neuf : relecture à l'aveugle prévue. | Aucune (hors drôlerie). |
| K2 L3 Relais S2 | 10 | R4 respectée : 2 phrases de scène, renvoi de 8 mots, aucune chute de l'article, scène compréhensible seule ; « 5 accroches » exact ; lien dans le corps (R5) ; texte neuf compté, repli CV:11 exact. | Aucune (hors drôlerie). |
| K5 Calendrier | 8 | Jours justes, n°18 réservée, Alexa exclue, pas de doublon à 90 jours sur les lignes fixées (Grep des 16 identifiants dans les articles : seuls A4 et S9 en contiennent), Halloween IG sans lien. 4 défauts. (a) S9 (relais du lundi 30/11) contient 3 des 4 vannes catalogue réservées aux 24 et 25/12 (S9:4 : `cs14jk4fe660e7238281ce47`, `cs14jkc4a2c545e132b38a92`, `cs14jkffeab1620070f2263e`) : même risque que la n°18, rien n'est écrit. (b) LinkedIn du 22/10 : la n°6 fait 3 phrases (A1:78), plus le renvoi = 4, au-delà des 3 phrases (FP:17). (c) Halloween : voir K1 (b). (d) Semaine du 26/10 : 4 liens X sur 5 (lundi, mercredi, jeudi, Halloween) contre « 3 sur 5 » (V3:52). | (a) V3:75 : « 30/11 : relais S9 avec `cs14jk02047ed5635bab6a52` et une vanne neuve de l'article, jamais les 3 réservées aux 24 et 25/12 ». (b) 22/10 LinkedIn : n°6 seule, sans lien (compte comme vanne), ou n°8 (2 phrases, A1:84) + « Les 20 autres messages sont prêts à copier : lien », si sa note à l'aveugle atteint 8. (d) V3:52 : « 3 sur 5, 4 la semaine d'Halloween ». |
| K9 Conformité | 8 | 0 tiret cadratin, 0 émoji, IA seulement comme sujet (FP:34), X sans thread, aucun prix, aucun lien vers `/abonnement`, humoristes autorisés (FP:54), départ conditionné aux étalons. Écarts : T1 (4 posts en 1re personne nue, FP:15) ; une citation inexacte de notateur (K1 d). | Voir T1 et K1 (d). |

Moyenne K2 : 8,8 (79/90), contre 8,6 au cycle 2 (C2:35). Critères à 10 : L2, L3. Avec T1 et les 3 légendes corrigées, les 9 posts passent à 10 sur mes critères.

## 3. Passe de contrôle : défauts créés par les correctifs du cycle 2

1. **LinkedIn à 4 phrases (22/10)** : ma demande d'attribuer une ligne d'article au relais LinkedIn, combinée à R5 (lien dans le corps), produit un post de 4 phrases. R4 ne dit pas qu'une ligne d'article compte dans les 3 phrases.
2. **Halloween contre la règle des 7 jours** : mon correctif K5 (a) (« vanne de S1 + lien ») heurte une règle neuve de la v3 (V3:29), S1 ayant 25 jours le 30/10.
3. **Légende « À sortir au... » (IG2)** : née de ma proposition C2:27 et de R3, elle pousse à réciter l'anecdote d'un autre, contre la méthode de l'article. Défaut en partie de mon fait.
4. **Modèle « prêts à copier »** : tiré de l'article anniversaire (CATALOGUE), il a été généralisé à S2 (PRATIQUE), où il est faux.
5. **Vannes remplaçantes non notées** : X3, IG2, IG3, L1 ont été choisies au nom de R1 sans avoir encore leur note à l'aveugle (V3:110). Tant que la note de @copywriter n'est pas rendue, R1 n'est pas prouvée sur les modèles.
6. **Réservations sans garde-fou** : la réservation de la n°18 a été écrite, mais pas celle des 3 vannes de S9 pour Noël (même mécanisme).
Aucun écho de chute entre réseaux le même jour : 12/10 (X alternant2, IG archives), 13/10 (X Alexa, L3 scène neuve), 22/10 (n°21, n°13, n°6 : trois lignes distinctes).

## 4. Cohérence de R1 à R5 avec les choix fondateur

| Règle | Verdict | Motif | Ajout nécessaire |
|---|---|---|---|
| R1 | Cohérente | Barre 10/10 (FP:18), aveugle à 2 relecteurs (FP:37), catalogue intouchable : on remplace, on ne réécrit pas (FP:38). | « Exception : X1 Alexa, plancher fondateur (FP:33), n'est jamais soumise au seuil de 8. » Sinon une note à l'aveugle sous 8 remettrait en cause un [CHOIX UTILISATEUR]. |
| R2 | Cohérente | Valeur éducative d'abord (FP:20), carte 4 sans promesse non prouvée. | Rien, sauf appliquer « une phrase » à IG3. |
| R3 | Cohérente | La marque offre, n'impose pas (FP:22). | « Jamais une consigne de réciter la vanne telle quelle quand l'article enseigne une méthode. » |
| R4 | Cohérente | 3 phrases au plus, aucune leçon (FP:17). | « Une ligne d'article reprise compte dans les 3 phrases. » |
| R5 | Cohérente | Contenu préparé par lot, aucune action manuelle hebdomadaire (FP:39, FP:55) ; offre Buffer vérifiée. | Rien. |

## 5. Ce qu'il faut pour 10/10

1. @social : T1 (guillemets sur X1, X2, X3, L1, ou confirmation de Thomas à C1), légendes IG1 et IG2, cartes 3 et 4 d'IG3, textes ci-dessus.
2. @social : V3:48 (relais selon la catégorie de l'article), exception Halloween à V3:29, réservation S9 à V3:75, LinkedIn du 22/10, liens X de la semaine du 26/10, carrousel humoriste du 28/10, « reviewer 7 à 10 », ajouts à R1, R3 et R4.
3. @fullstack : confirmer que l'insertion du lot contourne G-S2, G-S16 et G-S19 du directeur, ou les aligner sur la v3 (point 8 de la spec).
4. @copywriter : notes à l'aveugle de X2 (n°21), X3, IG2, IG3, L1, L2, L3 ; tout post sous 8 est remplacé selon R1.
5. Toujours en attente : K3 (cartes rendues par le gabarit @design).

Verdict : **NO-GO à 10/10** (K1 8, K2 8,8, K5 8, K9 8). Aucun défaut bloquant pour Thomas ; tout se corrige en une passe d'édition.

Source externe : [Buffer, LinkedIn et premier commentaire (offres payantes)](https://support.buffer.com/article/560-using-linkedin-with-buffer).
