# Tour 13, relecteur @ux (à l'aveugle) : `architecture-contenu-v13.md`

> Relu : résumé, en-tête, sections 0 à 1.4 (par passages), 2.1 à 2.9 en entier, 3.3 à 3.12 (exemples et 3.12 en entier), 4.1, section 8, section 9 (E5, E6), annexes A, B, C. Non relus ce tour : 4.2 à 4.5, 5, 6, 7.1 à 7.6 (je m'appuie sur ce que l'annexe A en dit : [NON VÉRIFIÉ] pour 4.2 « connexion en fenêtre » et 6.2).
> Question posée : mes Y1 à Y8 du tour 12 sont-ils traités ? L'écart assumé (la cloche annonce un nombre, qui ne compte que les réponses de l'équipe) est-il acceptable ?

## 1. Statut de mes corrections du tour 12

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| Y1 | Cloche : accessibilité et état « lu » (bloquant) | **Traité**, une réserve | 2.9 reprend tout : bouton 44 x 44 px, point plein (forme, 3:1, sans animation), feuille basse sur mobile et fenêtre sur ordinateur, Échap, clic dehors, bouton « Fermer », focus qui entre, reste et revient au bouton, liens de 44 px, état vide, cloche dans l'en-tête sur mobile. La réponse reste non lue tant que le fil n'est pas ouvert (2.6 et 2.9 s'accordent). Écart sur le nombre : voir section 2. Réserve : N3 (le panneau après l'ouverture du fil, et un « lu » sans effet visible) |
| Y2 | Note « ma réplique à moi » : états et contrôle (bloquant) | **Traité**, deux défauts neufs | Tous les états demandés (vide, saisie, enregistrée, échec sans perte, modifiée, supprimée avec confirmation), retrouvée depuis la fiche et depuis « Mes répliques », « Montre ta réplique à l'équipe » en copie préchargée jamais envoyée, gardée après la résiliation, jamais de « Fait » ni de points, toutes les fiches à geste, « une phrase » (brief Q5b), nombre de caractères [RESTE À TRANCHER]. Défauts : N1 (la note sur la carte de révision, à quel moment) et N4 (l'écran « Mes répliques » n'a pas de spécification) |
| Y3 | Entrée volontaire du coin « Humour noir » (bloquant) | **Traité à moitié** | Le geste « Entrer » (titre, une phrase, bouton), contenu lisible après seulement, état « entré » dans le navigateur (aucune donnée de compte, donc aucune phrase @legal), cloche neutre : appliqués. Mais le périmètre de la promesse se contredit et laisse la porte ouverte par la Bibliothèque : N2 |
| Y4 | Archive « Lettres » | OK | Garantie (a) corrigée, version abonné sans invitation Premium [À VÉRIFIER], archive qui remonte à la première lettre, notification sans pastille qui double l'e-mail |
| Y5 | Connexion et page d'arrivée | OK | « Non tranchée par Thomas, à lui montrer » ; ligne pour l'ancien abonné redirigé (« Ton historique de questions et tes répliques sont gardés », vérifiée dans le tableau de 2.6). Connexion en fenêtre depuis une fiche : [NON VÉRIFIÉ] en 4.2 |
| Y6 | Après la résiliation | OK avec une précision | Lecture seule, sans « Continuer », adresse de l'équipe : voir N5 (lecture seule contre suppression) |
| Y7 | Cloche hors des 6 entrées | OK | 2.9 et 6.1 s'accordent, test étendu |
| Y8 | Volume des notifications | OK | Plafond écrit : une ligne par jour, au plus une par type et par semaine |
| Non bloquant tour 12 | « jamais lue par l'équipe », « jamais servi par surprise » sans preuve | OK | Le premier devient une vérification (2.7, 7.5 h), le second est écrit avec son périmètre (3.12), mais voir N2 |

## 2. L'écart assumé : la cloche annonce un nombre (nom accessible seulement)

**Verdict : acceptable, et je retire ma proposition du tour 12 sur ce point.** Raisons :
- Ma crainte (« pas de nombre : pression ») visait des notifications de contenu qu'on accumule. Le nombre ne compte ici que des réponses à une question que l'abonné a posée : ce n'est ni un reproche ni une relance, et il est rare (v13 : de 0 à 1 message par mois et par abonné [HYPOTHÈSE]).
- Parité vue et lecteur d'écran : la pastille est un point sans chiffre (« aucun chiffre affiché »), le nom accessible donne le nombre. Un lecteur d'écran en sait un peu plus qu'un voyant, sans que cela crée de pression (il n'entend rien quand tout est lu) : pas de défaut WCAG, aucune étiquette visible à faire correspondre (icône seule).
- Les nouveautés n'entrent pas dans le nombre : un abonné qui n'a que des nouveautés entend « aucune réponse non lue » et ne voit pas de point : même information des deux côtés.
Trois conditions d'écriture, à ajouter à 2.9 (test dans `header-budget.spec.ts`) : (1) le singulier (« 1 réponse de l'équipe non lue ») ; (2) le test vérifie que le nombre du nom accessible est égal au nombre de réponses non lues, jamais au nombre de lignes du panneau ; (3) le nom ne change pas en direct (pas d'annonce `aria-live` quand une réponse arrive pendant la lecture d'une page) : sinon l'annonce devient une interruption.

## 3. Notes

| Critère | T12 | T13 | Justification courte |
|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | Note à soi, archive, cloche sans pression ; l'entrée volontaire protège Marc ; le coin « humour noir » reste un bloc où l'on va exprès |
| C2 Décisions de Thomas | 9 | 10 | Les 14 décisions appliquées à l'intérieur de leur lettre ; C5 passe à la lecture littérale (« rien n'empêche après », plus de délai de 3 mois) ; tous les écarts avec les relecteurs sont dits (annexe A) |
| C3 Zéro invention | 9 | 9 | Aucun chiffre neuf ; humour noir sans texte avant E6 ; vérifications annoncées comme telles ; un seul bémol : « 15 répliques d'humour noir » (annexe C) à rapprocher de « 45 à 180 candidates » (3.12) |
| C4 Rubriques claires, 6 entrées | 9 | 9 | Barre B inchangée, cloche hors des 6, « Plus » en trois blocs ; « Mes répliques » n'a pas son écran spécifié (N4) |
| C5 Ambition | 10 | 10 | V1 complète |
| C6 Cohérence | 8 | 8 | Les contradictions du tour 12 sont levées ; trois neuves : promesse du coin contre sa propre vérification et contre la Bibliothèque (N2), note de révision contre la règle « réponse avant les répliques » (N1), « lecture seule » contre « suppression d'une note » (N5) |
| C7 Faisabilité | 9 | 9 | Chantier complet ; l'état « lu » des nouveautés ajoute une donnée sans usage visible (N3) |
| C8 Décisions et « reste à trancher » | 9 | 9 | Lignes courtes ; Y1 à Y3 de conception closes aux deux défauts près |
| C9 Exemples au ton maison | 9 | 9 | Pas d'exemple neuf ; message d'entrée au bon ton |
| C10 Progression pédagogique | 9 | 9 | Aucun changement ; N1 corrige la seule entorse |
| **C11 Pertinence pour l'audience réelle** | 9 | 9 | Humour noir fondé sur une mesure [MESURÉ V] et enfermé derrière un geste ; note et archive sans promesse de talent |

**Note globale C1 à C10 : 9,1 / 10** (91 sur 100). **Avec C11 : 9,1 / 10** (100 sur 110). T12 : 9,0.

## 4. Corrections nouvelles

### Bloquantes

**N1. [BLOQUANT] La note « ma réplique à moi » sur la carte de révision peut gonfler la réponse à « Tu avais une réponse ? ».**
Passages : 2.2 « Si l'abonné a écrit “ma réplique à moi” sur cette situation, elle réapparaît sur la carte de révision (“Ta réplique la dernière fois : …”) » ; 2.2 « La réponse est donnée avant de voir les répliques : elle ne peut pas être gonflée après coup » ; 2.7 « Elle revient au bon moment ».
Problème : l'ordre de la carte (scène, « Ta réponse d'abord », « Tu avais une réponse ? », répliques) est la garantie de la courbe. La v13 ne dit pas où s'affiche « Ta réplique la dernière fois ». Affichée avec la scène, elle fournit à l'abonné une réponse toute faite : « Oui » devient vrai par lecture, la courbe cesse de mesurer (même faute que celle qu'on évite pour les répliques) et « Oui » compte pour le seuil P3.
Correction : écrire l'ordre : la note s'affiche **après** « Tu avais une réponse ? », avec les répliques (étape 4), jamais avant ; sur la carte « Et toi ? » de même. Ajouter au critère de test de l'étalon E5 : « aucune note de l'abonné n'est visible avant la réponse ».

**N2. [BLOQUANT] La promesse du coin « Humour noir » se contredit et ne couvre pas les listes de la Bibliothèque.**
Passages : 3.12 « Promesse exacte : l'espace ne sert jamais ce contenu sans le geste “Entrer” » ; « Le catalogue public et la recherche de l'en-tête restent hors du coin : les mêmes vannes y restent visibles comme aujourd'hui, la promesse ne les couvre pas » ; « [À VÉRIFIER : … que la recherche ne les remonte pas dans les écrans de l'espace tant que le geste n'est pas fait] » ; 3.12 lot « sélectionnées parmi les vannes actives » ; 0.2 « Bibliothèque : le catalogue de vannes en accès libre ».
Problème : (a) la phrase dit que la recherche reste hors du coin (la promesse ne la couvre pas) et la vérification demande qu'elle ne remonte rien dans l'espace avant le geste : deux règles opposées pour la même recherche. (b) La liste de la promesse (rafale, situations, parcours, vanne du jour, toucher, cloche) oublie le premier bloc de la Bibliothèque, « Vannes, conseils, vidéos » : les vannes du lot sont des vannes actives, donc déjà listées là sans geste. Un abonné qui ouvre la Bibliothèque lit ces vannes sans être « entré » : l'entrée volontaire de Y3 est contournée, et la promesse faite à l'abonné serait fausse. (c) Même question pour les favoris (étoile) et les liens depuis « Quand ça tombe à plat ».
Correction : trancher une règle unique, recommandée : **dans les écrans de l'espace (liste « Vannes » de la Bibliothèque, recherche de l'en-tête quand l'abonné est connecté, vanne du jour, toucher, favoris suggérés), les vannes du lot ne remontent qu'après « Entrer »** ; le catalogue public d'avant l'abonnement reste ce qu'il est (hors espace, dit comme tel). Réécrire la promesse avec la liste complète et supprimer la phrase « la promesse ne les couvre pas » pour la recherche de l'espace. Ajouter au [À VÉRIFIER] : un repérage en base (champ ou liste) qui sert aux quatre écrans, pas seulement au toucher ; sans lui, **ne pas écrire la promesse** (la phrase d'entrée « Ici, on rit de sujets graves… » reste, mais « jamais servi sans le geste » sort du texte tant que le repérage n'est pas fait). Test : un compte qui n'est pas « entré » ne trouve aucune vanne du lot dans ces quatre écrans.

### Non bloquantes (pour 10/10)

**N3. Cloche : panneau après l'ouverture du fil, et état « lu » des nouveautés.** (a) Dire ce que devient la ligne « L'équipe t'a répondu » une fois le fil ouvert (reste en lue, grisée, ou disparaît) et ce qui se passe avec deux réponses dans deux fils (une ligne par fil). (b) « Les nouveautés sont marquées lues à l'ouverture du panneau » : sans pastille ni mise en forme, cet état n'a aucun effet visible, et il ajoute une donnée de compte à la phrase de @legal (2.6, point 3). Simplifier : les nouveautés n'ont aucun état « lu » (les 5 dernières, sans mémoire), seul l'état des réponses est conservé.

**N4. L'écran « Mes répliques » n'a pas de spécification.** 2.7 dit « chaque ligne renvoie à sa fiche ». Ajouter : état vide (« Tu n'as pas encore écrit de réplique. Elles apparaissent ici. », sans reproche) ; ordre (la plus récente d'abord) ; chaque ligne montre la réplique entière et le titre de la fiche ; modifier et supprimer depuis la liste (avec la même confirmation) ; cibles de 44 px ; lecture seule après la résiliation (N5). Dire aussi comment une réplique est « rattachée à l'univers de sa fiche » pour s'afficher sous « Ce soir, c'est plutôt ? » : les catégories du toucher sont des catégories de vannes, les fiches ont des univers (3.3) ; une table de correspondance, ou « Tes répliques à toi pour la soirée » ne s'affiche que pour les univers que les deux listes partagent.

**N5. « Lecture seule » après résiliation contre « supprimer ».** 2.6 (« lecture seule, sans Continuer ») et 2.7 (« rien n'est effacé sauf suppression d'une note ou du compte, demandée par l'abonné ») : écrire que lecture seule veut dire ni ajout ni modification, **la suppression d'une note ou d'un envoi reste possible** (décision C10 a : « sauf demande explicite »). Corriger aussi « ses réponses “ma réplique à moi” » (2.6, ligne « Abonnement terminé ») en « ses répliques » : « réponses » désigne ailleurs celles de l'équipe.

**N6. Coin « Humour noir » : accessibilité et liens d'entrée.** (a) Le geste « Entrer » : bouton d'au moins 44 px, focus visible, contenu **non rendu** avant le geste (pas masqué par CSS, sinon un lecteur d'écran le lit) ; après « Entrer », le focus va au titre du contenu. (b) Les liens depuis « quand tu as dit la mauvaise chose » et « Lire la salle » (3.8) arrivent sur l'écran d'entrée, pas sur le contenu, et leur texte reste neutre (« Rire de sujets graves, sans blesser : la limite »). Pour la fiche « quand tu as dit la mauvaise chose », qui s'adresse à quelqu'un de mortifié, ce lien est à poser à l'étalon E6 : il peut mal tomber. (c) Dire si l'abonné peut ressortir du coin (« Sortir », qui oublie l'état dans le navigateur) : recommandé, une ligne.

## 5. Ce qui est solide (à garder)

- Spécification de la cloche : complète, testable, sans pression ; l'écart sur le nombre est bien pesé.
- Les états de la note, « jamais de perte », la copie préchargée côté navigateur et « jamais dans l'adresse », l'absence de « Fait » et de points.
- Périmètre positif, définitions de « deuil » et de « rupture » sans rouvrir C6, exemples jamais écrits avant E6.
- Annexe A : chaque numéro de mon tour 12 traité à un endroit précis, l'écart avec Y1 écrit en clair.

## 6. Verdict

Presque prêt pour Thomas. Deux bloquants courts : placer la note de révision **après** « Tu avais une réponse ? » (N1), et fermer la promesse du coin « Humour noir » (une règle unique pour la recherche, les listes de la Bibliothèque et les favoris, ou ne pas l'écrire sans repérage en base) (N2). Le reste est de la précision.
