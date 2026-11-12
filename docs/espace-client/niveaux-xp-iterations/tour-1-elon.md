# Tour 1 : relecture à l'aveugle de « Niveaux et XP » (@elon)

> AVIS CONSULTATIF, validation requise avant exécution. Relecteur indépendant, sans accès aux autres avis.
> Document noté : `docs/espace-client/niveaux-xp-s24.md` (@product-manager, 12/11).
> Vérifié :
> - `founder-preferences.md` l. 167 : C4 est **décidée** (« aucune nouvelle règle de série ni de points pour l'entraînement et les fiches ») ; Q9 : « noms, seuils, affichage revus et itérés à 10/10, puis soumis ».
> - `components/conseils/conseils-list.tsx` l. 111 et 175 à 178 : ouvrir un conseil appelle `addXp(10, "tip_read")`, avec un garde-fou `completedTipIds` qui n'est qu'un état de la page (`useState(new Set())`), remis à zéro à chaque chargement.
> - `stores/user-store.ts` l. 57 : appelle `POST /api/user/xp` avec le montant choisi par le navigateur.
> - Faits de la session : XP des parcours Machine à Café 325, Répartie 475, Confiance 800 ; montant accepté de 1 à 500, 30 appels par minute.

## Par principes premiers : à quoi sert un niveau pour quelqu'un qui veut devenir drôle ?

Yanis, Sophie et Marc ne veulent pas des points : ils veulent **oser parler et sentir que ça marche**. Un niveau ne vaut que s'il rend visible un progrès qu'ils reconnaissent. Il existe trois mesures possibles :
1. **L'activité** (XP de parcours) : facile, mais c'est un compteur de tours de piste. Le document le dit lui-même : « Le niveau mesure donc une activité déclarée, pas une compétence en répartie. »
2. **La courbe « Tu avais une réponse ? »** : la meilleure mesure du réflexe. Mais **il ne faut jamais la récompenser** : c'est l'indicateur n°1 de la valeur de l'espace et il est déclaratif. Dès qu'un « Oui » fait monter un niveau, on appuie sur « Oui » et l'indicateur meurt (loi de Goodhart). Le document a raison de la garder à part ; il faut l'écrire comme une règle.
3. **La marche de mission réussie** (seul, un proche, un pote, un groupe, un inconnu) : c'est exactement le progrès que vit un introverti, un comportement dans la vraie vie, déjà stocké (« Essayé, ça a marché »), sans verdict de talent. C'est le seul candidat qui donne un sens au mot « niveau ». **Le document ne l'envisage pas.**

Le document fait un bon travail de remise en ordre (seuils atteignables, pas de pourcentage, pas de verdict, rien de débloqué). Mais il traite le niveau comme un affichage à réparer, alors que Thomas a dit « revoir tout ça ». Et il passe à côté d'une source d'XP réelle qui fausse tous ses calculs.

## Notes

| Critère | Note | Justification (passage cité) |
|---|---|---|
| Valeur persona | 7 | Bons garde-fous : « Pas de pourcentage ni d'XP restants », « jamais plus visible que la courbe », aucune relance, aucun verdict. Mais la reco N2 est une échelle de scène (« Premier micro », « Tête d'affiche ») pour trois personas dont aucun ne veut monter sur scène ; le document l'admet (« Yanis, qui veut de la répartie en soirée et non monter sur scène »). Le niveau reste sans lien avec ce qu'ils vivent. |
| Ambition | 6 | Recaler des seuils et renommer, c'est de la maintenance. Il manque l'option qui donne un sens au niveau (marches de mission, correction 3). |
| Exactitude | 5 | « Seules sources d'XP lues dans le code : la validation d'une étape [...] et le bonus » ; « Conforme à C4 : la rafale quotidienne et les fiches ne rapportent aucun XP » ; « [À VÉRIFIER @fullstack] qui l'appelle encore ». Faux : la liste des conseils l'appelle, 10 XP à chaque ouverture, sans limite d'un chargement à l'autre. Le total de 3 100, le diagnostic « inatteignable », le plafond « Comique » et la logique « seuils accrochés aux fins de parcours » tombent (correction 1). |
| Respect des décisions | 6 | La Q4 repose C4 (« pour mémoire, déjà posée en C4 ») alors que Thomas l'a tranchée le 12/11 (l. 167) : P0 s8, un [CHOIX UTILISATEUR] ne se re-questionne pas (correction 2). Le reste est respecté et marqué (18/10, 19/10, 07/10, intouchables des étalons s17). |
| Questions à Thomas | 7 | Format propre (3 options, une reco, marquages). Une question de trop (Q4), une manquante (XP des conseils), une option absente (niveau par marches). |

**Note globale : 6,2 / 10.**

## Corrections

1. **[BLOQUANT] La lecture d'un conseil rapporte de l'XP, sans limite (1.1, 1.3, 2.2, 3.0, 3.4).**
   - Passages : « Seules sources d'XP lues dans le code » ; « Tout ce qu'un abonné peut gagner dans les 5 parcours fait 3 100 XP. Le dernier niveau demande 5 000 : il est inatteignable » ; « [À VÉRIFIER @fullstack] qui l'appelle encore ».
   - Fait : `conseils-list.tsx` l. 175 à 178, 10 XP par conseil ouvert. Le garde-fou n'existe que dans la page, donc chaque rechargement redonne 10 XP pour le même conseil. Le montant est fixé par le navigateur (1 à 500).
   - Conséquences : (a) l'XP n'est pas borné, donc « inatteignable » est faux, et 10 conseils ouverts et refermés font monter un niveau ; (b) même avec un conseil compté une seule fois, 120 conseils actifs ajoutent 1 200 XP [calcul : 120 x 10], soit 4 300 au total : 70 conseils ouverts (700 XP) atteignent « Première partie » sans aucune étape de parcours. Les seuils « accrochés aux fins de parcours » perdent leur sens, et les critères 1 et 2 de 3.7 sont faux ; (c) le « 10 appels de 500 donnent Légende » n'est pas une hypothèse, c'est l'état actuel.
   - Correction : réécrire 1.1 avec cette troisième source, refaire 1.3, 2.2 et 3.4. Séparer deux choses :
     - **une correction de sécurité**, qui ne change aucune règle : le serveur fixe lui-même le montant selon l'action et compte un conseil une seule fois par abonné. Le montant n'est plus jamais pris du navigateur ;
     - **une question à Thomas**, puisqu'elle touche une règle de points existante : « La lecture d'un conseil rapporte 10 XP aujourd'hui. A. On la garde, une fois par conseil (seuils recalculés avec 1 200 de plus). B. On la retire : le niveau parle des parcours seulement, comme le reste du document. C. On la garde sans limite (non recommandé : le niveau ne veut plus rien dire). » Mon avis : B, qui est la plus simple, rend le niveau lisible et s'aligne avec C4 (« aucune nouvelle règle de points pour les fiches », dont l'esprit est que lire ne rapporte pas).

2. **[BLOQUANT] Retirer la Q4 : C4 est tranchée (4, Q4).**
   - Passage : « Q4. La rafale quotidienne et les fiches doivent-elles compter pour le niveau ? (pour mémoire, déjà posée en C4) ».
   - Problème : Thomas a répondu le 12/11 (`founder-preferences.md` l. 167, « C4 aucune nouvelle règle de série ni de points pour l'entraînement et les fiches »). La reposer, même avec la reco « rien ne change », re-questionne un [CHOIX UTILISATEUR].
   - Correction : passer C4 dans « Tranché sans question », avec la référence. Corriger l'en-tête (« dont une qui rouvre ta décision du 12/11 (C4) ») et le résumé (« 4 questions »).

3. **[BLOQUANT] Proposer l'option qui donne un sens au niveau : la marche de mission réussie (3, Q1).**
   - Problème : les trois propositions mesurent toutes l'activité. Thomas a demandé de « revoir tout ça ». L'option de plus grande valeur pour les personas n'est pas sur la table.
   - Correction : une **proposition 4**. Le niveau = la plus haute marche de mission où l'abonné a répondu « Essayé, ça a marché » (5 marches, 5 niveaux), avec des noms qui disent ce qu'il a fait, jamais ce qu'il vaut. Par exemple : « À voix haute », « Avec un proche », « En face », « En groupe », « Avec quelqu'un de nouveau » (noms à l'étalon). L'XP de parcours reste un compteur visible (« tes parcours »), sans nom de niveau.
     - Pour : c'est le progrès réel d'un introverti (oser, dans la vraie vie) ; aucun verdict de talent ; donnée déjà stockée ; impossible d'y arriver en ouvrant des conseils ; le niveau ne baisse jamais (la plus haute marche réussie reste acquise).
     - Contre : déclaratif (comme tout l'espace) ; le premier passage dépend d'une mission, pas d'un clic ; nouvelle règle de niveau sur l'entraînement, donc **à marquer « touche l'esprit de C4, accord requis »** (ce n'est ni une série ni des points, mais c'est une règle neuve).
     - Mon avis : si Thomas accepte de toucher l'esprit de C4, c'est la meilleure option. Sinon, la proposition 2 corrigée.

4. **[BLOQUANT] Écrire la règle : la courbe « Tu avais une réponse ? » ne nourrit jamais le niveau (2.3, 3.0).**
   - Passage : « ne jamais passer devant la courbe ».
   - Problème : le document dit où se place la courbe, pas qu'elle doit rester sans récompense. Une itération future pourrait « relier le niveau au progrès réel » par ce chemin, et détruirait l'indicateur n°1 de l'espace (v11 7.6).
   - Correction : une phrase dans 3.0 : « La réponse à "Tu avais une réponse ?" ne rapporte ni XP ni niveau, aujourd'hui ni plus tard : un indicateur déclaratif qu'on récompense cesse de mesurer. »

5. **[NON BLOQUANT] Les noms de scène ne parlent pas aux personas (3.2, 3.5).**
   - Passages : « Premier micro », « Scène ouverte », « Première partie », « Tête d'affiche ».
   - Problème : trois personas qui veulent parler en coloc, à la machine à café, à un dîner ; aucun ne vise la scène. « Tête d'affiche » reste un verdict déguisé.
   - Correction : ajouter aux étalons un registre ancré dans leur vie, comme celui de la correction 3, et tester chaque jeu de noms avec la question « Yanis, Sophie ou Marc se reconnaîtrait-il dans ce nom ? ».

6. **[NON BLOQUANT] Garde-fou de 3.0 et critères de 3.7 sur toutes les sources d'XP.**
   - Correction : le test « dernier seuil inférieur ou égal à 80 % » se calcule sur toutes les sources retenues après la correction 1. Ajouter un critère : « aucun montant d'XP n'est choisi par le navigateur ; un même conseil ne rapporte qu'une fois ».

7. **[NON BLOQUANT] Ne pas confondre les deux « niveaux » pour Thomas (en-tête, section 1).**
   - Correction : une ligne disant que C7 (« niveaux actuels ») parle des niveaux de difficulté des parcours (DEBUTANT, INTERMEDIAIRE), et non des niveaux d'XP traités ici.

## Ce qui manque totalement

- Le diagnostic de la source d'XP des conseils et de l'endpoint qui fait confiance au navigateur (correction 1).
- Une option où le niveau dit quelque chose de vrai sur la personne (correction 3).

---
**Handoff → session principale**
- Fichier : `docs/espace-client/niveaux-xp-iterations/tour-1-elon.md` ; note 6,2/10 (valeur persona 7, ambition 6, exactitude 5, décisions 6, questions 7).
- Bloquant n°1 : ouvrir un conseil rapporte 10 XP, sans limite d'un chargement à l'autre (`conseils-list.tsx` l. 175 à 178), et le navigateur fixe le montant. Le total de 3 100, « inatteignable » et les seuils accrochés aux parcours sont donc faux. Il faut une correction de sécurité côté serveur et une question à Thomas (garder une fois par conseil, ou retirer ; mon avis : retirer).
- Bloquants n°2 à 4 : retirer la Q4 (C4 tranchée le 12/11, l. 167) ; ajouter l'option « niveau = plus haute marche de mission réussie », marquée « touche l'esprit de C4 » ; écrire que la courbe « Tu avais une réponse ? » ne nourrit jamais le niveau (sinon l'indicateur n°1 meurt).
- Ce sont des AVIS : Thomas décide.
---
