# Tour 9, relecteur @ux (à l'aveugle) : `architecture-contenu-v9.md`

> Relu : section 0 à 0 bis, 3.3 (plan et exemples), 4.2 à 4.5, 6.2 à 6.3, 7.4 à 7.7, section 8 (C1 à C14), section 9, annexes A à C ; le reste par passages (inchangé depuis la v8). Fait donné par la session : `lib/blog-parcours.ts` l. 13-26 donne cluster vers parcours (la plupart vers repartie ; douleurs-personas vers confiance ; humour-contexte vers boulot ; saisonnier vers machine-a-cafe ; défaut repartie). Références : mon tour 8, `founder-preferences.md` l. 20 et 162.
> Limite : je n'ai pas relu `blog-parcours.ts`, `premium-return.ts`, ni le code de paiement ; je m'appuie sur les faits donnés et sur ce que la v9 en cite.

## 1. Notes

| Critère | T7 | T8 | T9 | Justification courte |
|---|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | 9 | Inchangée ; les deux exemples ajoutés (rencontre, prise de parole) donnent un ton aux univers nouveaux |
| C2 Décisions de Thomas | 8 | 9 | 9 | Pivot du 06/05 cité en C13, réouverture du 25/10 marquée, Q8 du brief posée honnêtement (C14), reco B ferme |
| C3 Zéro donnée inventée | 8 | 8 | 8 | Faits de code exacts en tête (returnTo, src perdu au paiement) ; mais « la catégorie d'un article se dérive du cluster » et « aucune seconde table » sont démentis par le fait de session (V1) |
| C4 Rubriques claires, 6 entrées au plus | 9 | 9 | 9 | B recommandée, 6 entrées, bloc unique du contenu du jour (plus de carte en double) |
| C5 Ambition | 9 | 9 | 9 | Inchangée |
| C6 Cohérence | 8 | 8 | 8 | Les 30 premières situations somment juste (6 + 6 + 5 + 5 + 5 + 1 + 2 = 30 ; 30 restantes : 3 + 3 + 5 + 5 + 5 + 5 + 4 = 30) ; reste la table d'article sans source de catégorie, et la reco de C1 qui cite encore une mesure de visiteurs que la règle 2 ne laisse plus hiérarchiser |
| C7 Faisabilité | 9 | 9 | 9 | Essai réel du parcours d'abonnement au lot 0, tâche de transport du `src` dans le chantier, interrupteur fermé |
| C8 Questions à Thomas | 8 | 9 | 9 | C13 reformulée (forme de la vanne dans un seul bloc), C14 nouvelle, C9 corrigée ; toutes marquées |
| C9 Exemples au ton maison | 8 | 8 | 9 | Deux nouveaux exemples réels avec leur garde-fou, trois registres distincts ; la risquée de la rencontre reste une déclaration plus qu'une chute |
| C10 Progression pédagogique | 9 | 9 | 9 | Premier pas d'un parcours sans étape défini, `pour plaire` reçoit sa règle |
| **C11 Pertinence pour l'audience réelle** | 7 | 8 | **9** | La règle à deux niveaux est cohérente ; le signal d'article est honnête (conditionnel, [SUPPOSÉ], hors V1 par défaut) ; reste la viabilité de « une autre vanne » (taille du lot) |

**Note globale C1 à C10 : 8,8 / 10** (88 sur 100). **Avec C11 : 8,8 / 10** (97 sur 110). T7 8,5 ; T8 8,7. Pas encore 10/10 : 2 corrections bloquantes, courtes.

## 2. Statut de mes 9 corrections du tour 8

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| U1 | Signal d'article décrit avec `returnTo` | OK sur le fond, un détail faux | Formulation exacte (parcours associé dans `returnTo`, slug dans `src`, perdu au paiement), table conditionnelle, repli, essai réel au lot 0, tâche de transport, effet [SUPPOSÉ]. Mais la catégorie d'article est dite « dérivée du cluster » (V1) |
| U2 | Vanne du jour en double | OK | Un seul bloc : la vanne du jour porte le toucher et « une autre » ; jamais deux fois ; rendu à 375 px à l'étalon E5 |
| U3 | Règle de priorité à géométrie variable | OK | Deux niveaux : [MESURÉ V] pour choisir quoi écrire, [MESURÉ A] (vide) pour hiérarchiser l'écran ; C13 A marquée « va à l'encontre de la règle de 0.1 » |
| U4 | [OBSERVÉ] est de l'offre | OK | 0.1 : mesure de l'offre, +1 est un départage |
| U5 | Événement anonyme et non-répétition | OK avec une réserve | Catégorie comptée sans identité, non-répétition en mémoire du navigateur, zéro répétition inter-jours = liste par compte + phrase de @legal (non retenu). Réserve sur la taille du lot (V2) |
| U6 | Premier pas article si C13 = C | OK | Bibliothèque ouverte sur le thème de l'article et fiche d'une vanne |
| U7 | « Pour plaire » | OK | La prochaine situation nouvelle de la rafale est une situation de rencontre, une fois |
| U8 | Effectif minimal à J60 | OK | « Une quarantaine d'abonnés actifs [HYPOTHÈSE] », et la règle touche le pivot du 06/05 |
| U9 | Les 30 premières situations | OK | Liste par univers, entrées comprises, somme juste ; affectation des 5 profils (soirée, amis, amis, boulot, coloc) marquée [HYPOTHÈSE à fixer à E1], cohérente avec les scènes et les volumes de 3.3 |

## 3. Nouvelles corrections

### Bloquantes

**V1. [BLOQUANT] « La catégorie d'un article se dérive du cluster » et « aucune seconde table » sont contredits par le code (C3, C6).**
Passages : 4.2 « La catégorie d'un article se dérive du **cluster de `lib/blog-parcours.ts`** [À VÉRIFIER : liste des clusters et correspondance] : **aucune seconde table article-parcours** n'est créée » ; table « catégorie d'article, premier pas » (Blagues, Répartie, Autodérision, Boulot, Rencontre, Storytelling) ; annexe A (UX8 U1 : « dérivée du cluster ») ; annexe B.
Problème : le fait de session répond à l'[À VÉRIFIER] et il est négatif. `blog-parcours.ts` associe un cluster à un PARCOURS (la plupart vers repartie ; douleurs-personas vers confiance ; humour-contexte vers boulot ; saisonnier vers machine-a-cafe ; défaut repartie). Ces clusters ne sont pas des catégories de contenu : rien n'y distingue un article de blagues, de rencontre, d'autodérision ou de storytelling, tous renvoyés à repartie. La table à sept lignes ne peut donc pas se dériver du cluster ; elle suppose un attribut « catégorie » par article (ou une petite table slug vers catégorie) que le document dit ne pas vouloir créer. De plus, la catégorie « Blagues » demande une `JokeCategory` (SOIREES, BOULOT, PARENTS, DATING) qui n'existe pas non plus au niveau de l'article. Conséquence pratique : presque tous les arrivants d'article reçoivent déjà « repartie », c'est-à-dire la même chose que le défaut proposé en C11.
Correction : écrire le fait (clusters, parcours associés, défaut) à la place de l'[À VÉRIFIER] ; supprimer « aucune seconde table » ; dire que la table de premier pas par catégorie exige un attribut ou une petite correspondance article vers catégorie (une quarantaine de lignes au plus, maintenue à la main, à chiffrer dans 7.3), ou bien la retirer de la V1 et ne garder que « parcours associé » (ce que le code fournit) ; ajouter que, pour la majorité des articles, le signal vaut « repartie » (signal faible, déjà dit) et que seuls « douleurs-personas » (confiance), « humour-contexte » (boulot) et « saisonnier » (machine-a-cafe) apportent une information.

**V2. [BLOQUANT] La viabilité de « une autre vanne » repose sur une taille de lot non vérifiée, et la restriction « pas d'inédits » est incohérente avec la Bibliothèque (C7, C11, C4).**
Passages : 4.4 « « une autre » tire dans la catégorie choisie, **jamais dans les vannes inédites réservées au contenu du jour** (seulement des vannes déjà passées au calendrier …) … la non-répétition vit dans la mémoire du navigateur … d'un jour à l'autre, une vanne déjà vue peut revenir, ce qui est accepté [HYPOTHÈSE : taille du lot de vannes déjà passées au calendrier, à vérifier] » ; 6.2 B (« Vannes, conseils, vidéos » ouvert sur les thèmes, catalogue de 149 vannes actives) ; annexe B (« taille du lot »).
Problème : le toucher répond au besoin « le mieux mesuré » ; il ne vaut que si le tirage a de la matière. (a) Le lot « déjà passées au calendrier » est inconnu et, par catégorie (SOIREES, BOULOT, PARENTS, DATING), peut tenir en quelques unités : avec une non-répétition limitée à la visite, un abonné revoit les mêmes vannes d'un jour à l'autre, ce qui réduit le geste à une répétition. (b) La Bibliothèque expose pourtant les vannes actives (149) ; réserver des « inédits » au contenu du jour n'a de sens que si ces inédits sont masquées ailleurs, ce que le document ne dit pas : sinon la restriction réduit le choix sans protéger rien. (c) « Quand la catégorie est épuisée : retour à peu importe, sans message » rend l'épuisement invisible.
Correction : avant l'étalon E5, compter par catégorie le nombre de vannes tirables (actives, hors vanne du jour des 14 prochains jours) et fixer un seuil (par exemple au moins 10 vannes pour proposer une catégorie ; sinon elle n'apparaît pas dans le toucher) ; dire si les vannes futures du calendrier sont visibles dans la Bibliothèque ; si oui, retirer la restriction « jamais d'inédits » et ne protéger que la vanne du jour ; garder la non-répétition par visite, et mesurer la part de revues d'un jour à l'autre dès le lot 1 (événement déjà prévu) avant de décider d'une liste par compte.

### Non bloquantes (à traiter pour 10/10)

**V3. C14 : le premier pas doit « se voir tout de suite », la reco C ne le garantit pas (C10, C8).** C14 C : l'abonné venu d'une fiche, d'une étape ou d'une vanne arrive sur ce contenu ; le premier pas est ce contenu (4.2), mais rien ne le rend visible (aucun repère « ton premier pas » sur la page d'arrivée). Ajouter à C : un bandeau unique, la première fois, sur la page d'arrivée (« Ton premier pas : … ») qui mène à « Aujourd'hui ». Dire aussi ce que devient la page de succès (brief : elle garde « Renoncer au contrat ici », D.221-5) quand l'abonné arrive directement sur un contenu, et ce que l'e-mail de bienvenue approuvé (E0) lui renvoie : la décision de Thomas porte aussi sur ces deux obligations.

**V4. La reco de C1 invoque encore une mesure de visiteurs pour placer le catalogue (C6, C2).** 6.2 : « Reco : B … et le besoin le mieux mesuré chez les visiteurs ». La règle de 0.1 (niveau 2) interdit qu'une mesure de visiteurs hiérarchise l'écran d'un abonné ; la barre en fait partie. La reco B tient seule par le `[CHOIX UTILISATEUR]` du 12/11 et la promesse du 19/10 ; retirer l'argument de la mesure, ou le dire « pour mémoire, sans rôle ». Dans 3.3, le +2 de « soirée » repose sur une mesure marquée « indirecte » (page « phrases drôles en conversation », pas « soirée ») : soit +1 (départage), soit le dire dans la ligne.

**V5. Spécifier le toucher « Ce soir, c'est plutôt ? » (C4, accessibilité).** 4.4 le décrit comme « un lien discret sous » la vanne, alors qu'il propose cinq choix (soirée, boulot, famille, rencard, peu importe). Dire : une rangée de puces (chacune de 44 px au moins, passant sur deux lignes à 375 px), la sélection active marquée autrement que par la couleur, la vanne qui change annoncée aux lecteurs d'écran (zone `aria-live` polie), le focus conservé sur la puce choisie. À rendre à l'étalon E5, comme annoncé.

**V6. Ton de la risquée de la rencontre (C9).** 3.3 : « Si on se revoit, c'est moi qui réserve. » est une intention plus qu'une chute et suppose un second rendez-vous : le garde-fou le dit bien (« ne passe que si l'autre a déjà ri »). Pour l'étalon E1, proposer une version où la risquée a aussi un trait d'humour (la première partie de la phrase), sans insister.

## 4. Réponses directes

1. **L'entrée par l'article, avec les clusters de `blog-parcours.ts`** : la v9 la traite honnêtement (conditionnelle, [SUPPOSÉ], hors V1 par défaut, repli). Il reste à écrire ce que les clusters apportent réellement (peu : presque tout vaut repartie) et à renoncer à la table par catégorie ou à la chiffrer (V1).
2. **Affectation des 5 profils aux univers** : acceptable, cohérente avec les scènes (soirée, amis, amis, boulot, coloc), comptée dans les volumes, et la somme des 30 premières est juste.
3. **Non-répétition dans la mémoire du navigateur** : choix prudent sur la vie privée, mais inabouti tant que la taille du lot n'est pas connue (V2).
4. **Vanne du jour qui porte le toucher** : bon arbitrage (un seul bloc, même poids que le conseil et la vidéo, le brief respecté) ; à spécifier comme composant (V5).

## 5. Points acquis (à ne pas perdre au tour 10)

- Règle à deux niveaux (0.1), [OBSERVÉ] redéfini, plan des 60 avec son calcul, liste des 30 premières, exemples rencontre et prise de parole.
- 4.2 (deux ordres, parcours sans étape, repli quand la source est perdue), 7.5 (e) (essai réel), 7.7 (capteurs sans identité), 7.6 (effectif minimal).
- C13 (un seul bloc, trois formes, pivot cité), C14 (Q8 du brief posée), C9 corrigée.
- Totaux : 155 fiches neuves, 285 distinctes, 100 hors parcours, 54 lues, 1 150 à 3 750 candidates.
