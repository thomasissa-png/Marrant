# Tour 7 : relecture à l'aveugle de l'architecture de contenu v7 (@elon)

> AVIS CONSULTATIF, validation requise avant exécution. Relecteur indépendant, sans accès aux autres avis du tour 7.
> Lu : `architecture-contenu-v7.md` (section A, 0, 2.2, 3.3, 4.4, 6.2, 7.7, 8 en entier, recomptes), `besoins-audience-donnees-internes-s24.md` en entier, `besoins-audience-recherche-publique-s24.md` (structure et confrontation). Grille C1 à C10, plus C11 « pertinence pour l'audience réelle ».
> Totaux revérifiés : 60 situations (6+6+5+4+3+6+4+5+5+5+6+5) ; 152 fiches neuves, 282 distinctes, 185 emplacements ; 10 x 3 = 30 sorties.

## Verdict en une phrase

La section A fait ce qu'il fallait : elle sépare ce qui est mesuré de ce qui est supposé, elle dit que la seule donnée solide décrit des gens qui n'ont pas payé, et elle déplace l'espace en conséquence (Bibliothèque à un clic, carte « Une vanne pour ce soir », univers manquants, capteurs). Il reste un écart par principes premiers :
- **le besoin le mieux mesuré reçoit une réponse au hasard.** Quelqu'un qui veut « une vanne pour ce soir » ne veut pas n'importe quelle vanne : il veut celle de SA soirée. Un toucher suffit pour le savoir, et ce même toucher devient le meilleur capteur de demande de l'espace.

## Notes

| # | Critère | T6 | T7 | Justification (passage cité) |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 10 | Les univers des personas sont enfin tous présents (« Études et fac » 5, « Messages et groupes » 5, « Prise de parole courte » 6) ; « Une vanne pour ce soir » sans quitter l'écran. |
| C2 | Respect des décisions | 8 | 10 | C1 B recommandée, « fidèle au 12/11 » ; A marquée « Rouvre la décision du 12/11 » ; capteurs 7.7 « aucun ne rouvre une décision », votes et écran de résiliation laissés hors périmètre. |
| C3 | Zéro donnée inventée | 10 | 10 | Étiquettes [MESURÉ] / [OBSERVÉ] / [SUPPOSÉ] / [PISTE] sur chaque besoin, « Rien de ce tableau ne prouve ce que les abonnés veulent », base fictive des votes écartée. Chiffres conformes au document de @data-analyst. |
| C4 | Rubriques claires | 9 | 10 | Reco B ferme, deux tâches de test, un bloc qui s'ajoute dans un onglet existant (« aucun onglet ne surgit ») et qui est annoncé une seule fois. |
| C5 | Ambition | 10 | 10 | Inchangée, et mieux ciblée. |
| C6 | Cohérence | 9 | 9 | Les 6 situations de prise de parole « se lisent "quoi dire" plutôt que "quoi répondre" (pas de pique à renvoyer) » (3.3). Rien ne dit comment elles passent dans la carte « Quel registre ? » de la rafale, alors que les 60 situations neuves alimentent le stock (O3). |
| C7 | Faisabilité au niveau | 10 | 10 | Recomptes exacts, 30 sorties de rattrapage dans la capacité, lecture de Thomas recalculée (53 fiches sur 152). |
| C8 | Questions à Thomas | 9 | 10 | C6 cite la demande mesurée avec sa limite (« 3 et 4 clics seulement ; ce sont des visiteurs ») ; C12 nouvelle, avec une reco B sobre ; C10 b C met la ligne 3114 « là où le risque est ». |
| C9 | Exemples | 10 | 10 | Inchangés, au niveau. |
| C10 | Progression | 10 | 10 | « À moitié » a sa règle ; rien n'est cassé. |
| C11 | Pertinence pour l'audience réelle | nouveau | 8 | Ce qui tient : le geste mesuré n°1 (« 368 clics sur 462 », mobile, 34 à 48 s) a une porte à un clic et une carte au-dessus de la ligne de flottaison ; les univers absents sont ajoutés avec leur poids ; les capteurs sont prévus. Ce qui manque : la carte tire « une autre » vanne « du stock validé » sans tenir compte de la soirée de l'abonné (O1) ; aucune règle écrite à l'avance pour réorienter l'espace si les abonnés se comportent comme les visiteurs (O2) ; deux [PISTE] gratuites restent en « manque restant » sans action (O4). |

**Note globale : 9,7 / 10** (107 / 11 critères ; T6 : 9,5 sur 10 critères).

## Statut de mes corrections du tour 6

| # | Correction T6 | Statut | Commentaire |
|---|---|---|---|
| N1 | Reco C1 contre le 12/11 | OK | B recommandée « ferme », A marquée « Rouvre la décision du 12/11 », 6.3 réécrit pour B. Je corrige mon tour 6 : j'avais écrit que « Bibliothèque » était « le mot de Thomas ». La v7 est plus juste (« le mot de la reco que tu as suivie le 12/11 »). Le fond ne change pas. |
| N2 | « À moitié » sans règle | OK | « revient une fois à J+7 ; ne compte pas comme réponse pour les seuils (seul "Oui" compte) ; la courbe l'affiche à part ». |

Bilan sur 2 : 2 OK.

## Nouvelles corrections

O1. **[BLOQUANT pour C11] « Une vanne pour ce soir » doit savoir ce qu'est ce soir (4.4, 7.7).**
- Passage : « "Une vanne pour ce soir" : la vanne du jour du calendrier préparé [...], avec un bouton "une autre" qui en tire une du stock validé (149 vannes actives, sans répétition) ».
- Problème, par principes premiers : personne ne veut « une vanne ». On veut avoir quelque chose à dire **là où on va** : le pot de jeudi, le repas de famille de dimanche, le rencard de samedi. Une vanne de bureau tirée au hasard pour quelqu'un qui part en soirée, c'est zéro valeur. Le besoin n°1 mesuré du site obtient donc une réponse générique, alors que la taxonomie existe déjà en base (`JokeCategory` : SOIREES, BOULOT, PARENTS, DATING, ECOLE, RESEAUX_SOCIAUX… ; `besoins-audience-donnees-internes-s24.md` S15).
- Correction, sans contenu neuf : sous la vanne du jour (conservée par défaut, brief §3.2), un toucher **« Ce soir, c'est plutôt ? »** avec 4 ou 5 boutons (soirée, boulot, famille, rencard, peu importe), et « une autre » tire dans la catégorie choisie. Lien vers les situations du même univers dans « Quoi répondre ». Quand le stock de la catégorie est épuisé, retour à « peu importe », sans message. Le choix n'est pas gardé sur le compte. Il est compté comme événement anonyme au même titre que « une autre » (7.7, capteur 2), et c'est là le vrai gain : **le même toucher répond au besoin et mesure la demande réelle des abonnés par univers.** C'est la donnée qui manque à toute la section A pour pondérer les 60 situations. Ajouter à E5, et au capteur 2 de 7.7.

O2. **[NON BLOQUANT] Écrire à l'avance ce qu'on fait si les abonnés se comportent comme les visiteurs (7.6, 7.7).**
- Passage : A.1, « Rien de ce tableau ne prouve ce que les abonnés veulent » ; 7.6, « Réévaluation d'un type à 60 jours ».
- Problème : le cœur de l'espace (moteur, Quoi répondre) repose sur du [SUPPOSÉ], et la seule demande mesurée va vers des blagues toutes faites. Si à J60 les abonnés tirent beaucoup de « une autre vanne » et peu de cartes de rafale, il faut savoir d'avance quoi en conclure. Sinon, on lira les données à travers ce qu'on a envie de croire.
- Correction : une règle de décision écrite maintenant, avec des seuils fixés par @data-analyst [HYPOTHÈSE]. Par exemple : si la part des abonnés actifs qui jouent au moins une carte par semaine reste sous X % pendant que « une autre vanne » dépasse Y demandes par abonné et par semaine, on soumet à Thomas une repondération (plus de catalogue contextuel et de situations, moins de types de leçons). Une ligne dans 7.6.

O3. **[NON BLOQUANT] Les 6 situations de prise de parole dans la rafale (3.3, 2.2, 2.3).**
- Problème : elles comptent dans les 60 du stock, mais n'ont pas de pique pour « Ta réponse d'abord » ni de contexte défini pour « Quel registre ? ».
- Correction : une phrase. Soit elles entrent dans la rafale sous la forme « Ta première phrase d'abord », avec deux contextes (public proche, public large) et le choix entre trois ouvertures ; soit elles sortent de la rafale, et le stock passe à 54 neuves, avec marges recalculées (encore positives à J60 : 45 + 54 = 99).

O4. **[NON BLOQUANT] Deux pistes gratuites laissées en « manque restant » (A.2).**
- « nommer "l'esprit de l'escalier" dans une accroche [PISTE] » : c'est exactement ce que soigne la rafale (« on entraîne la réponse avant de voir les répliques », recherche publique, B1). Le confier à l'étalon E5 (accroche de la rafale dans « Aujourd'hui »), testé à l'aveugle. Coût : une ligne.
- « Le versant "avant" (trac) » : dire ce qui le couvre déjà (missions marches 1 et 2, rafale comme entraînement sans enjeu, « Le blanc ») et ce qui reste vraiment à couvrir, plutôt que de laisser croire que rien n'existe.

## Ce qui manque encore pour 10

O1 : un toucher qui rend pertinent le besoin le mieux mesuré du site et qui fournit, en même temps, la donnée d'audience qui manque partout. O2 à O4 sont du réglage, sans enjeu de structure.

---
**Handoff → session principale**
- Fichier : `docs/espace-client/audit-contenu/iterations/tour-7-elon.md` ; note 9,7/10 sur 11 critères (C11 pertinence : 8). Mes 2 corrections du tour 6 : 2 OK. Je retire au passage « Bibliothèque = mot de Thomas » (c'est le mot de la reco qu'il a suivie).
- Bloquant restant pour C11 (1) : O1, « Une vanne pour ce soir » tire au hasard ; il faut un toucher « Ce soir, c'est plutôt ? » (soirée, boulot, famille, rencard, peu importe) appuyé sur `JokeCategory`, qui sert aussi de capteur de la demande réelle des abonnés par univers.
- Non bloquants (3) : une règle de décision écrite d'avance si les abonnés préfèrent la vanne à la rafale ; la place des 6 situations de prise de parole dans la rafale ; « esprit de l'escalier » à confier à l'étalon E5, et le trac à rattacher aux missions.
- Ce sont des AVIS : Thomas décide.
---
