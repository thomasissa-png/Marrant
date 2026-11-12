# Tour 18, relecteur @ux (à l'aveugle) : `architecture-contenu-v18.md` (confirmation)

> Relu : en-tête, résumé (en entier), 3.13 (en entier), 4.1, 4.2 (page d'arrivée et connexion), 4.4 (composition, série et cap), 5.3 (ligne des bonus), 5.4, 5.5, 6.1 à 6.3 (dont la barre à 375 px), 7.3 (ligne bonus), 7.4 (ordre 8), 7.5 (e, i, j), section 9 (E4 à E6), annexes A, B, C. Non relus : 0 à 2.9, 3.1 à 3.11, 5.1 et 5.2, 7.1, 7.2, 7.6 et 7.7 : [NON VÉRIFIÉ].
> Références : `docs/founder-preferences.md` l. 73 (série validée 07/10), l. 161 (Q3 = A), l. 169 (bonus des caps, Q7 à Q10) ; mes tours 16 et 9.

## 1. Statut de mes corrections du tour 16

| # | Sujet | Statut | Preuve dans la v18 |
|---|---|---|---|
| Q1 a | « La série n'est pas sur Aujourd'hui » contre « Ton mois » | **OK** | 4.4 : la série n'est pas dans la ligne de salutation ; « Ton mois » est un bloc d'« Aujourd'hui » (à partir de J25) et « c'est le seul endroit de « Aujourd'hui » où la série figure » ; liste exacte « où ils n'apparaissent pas » |
| Q1 b | Option C de la question sur le mot « pratique » | **OK : question retirée** | 4.4 : « aucune question à Thomas » ; le texte « {n} jours de pratique d'affilée » est validé le 07/10 (je vérifie `founder-preferences.md` l. 73 : « série “{n} jours de pratique d'affilée” » dans les 16 choix des étalons s17) ; ce qui compte comme pratique est lu dans le code (`recordPractice`, `nextStreak` ne sont appelés que par la validation d'étape et la fin d'un quiz d'étape). J'accepte : plus de question de mot à poser |
| Q1 bis | Carte série + cap après l'étape en cours, jamais en tête | **OK, un ordre à préciser** | 4.4, 5.4, 6.2, 6.3, E5 : carte « Ton cap » après l'étape en cours, jamais en tête, « Tes bonus » juste après et seulement quand un bonus est ouvert ; reste que 4.4 et 6.2 ne disent pas la même chose sur l'emplacement exact (T1) |
| Q2 | Barre à 375 px | **OK** | 6.2 : décision de Thomas Q3 = A appliquée sans option ; calcul corrigé (343 px utiles, environ 57 px par entrée) ; contrôles (a) « Aujourd'hui » atteignable, (b) clavier, (c) 200 % de texte, (d) deux tâches ; « Plus » hors écran et « Bibliothèque » à la limite, deux chemins hors barre ; budget d'en-tête : recherche en bouton icône de 44 px à 375 px. **Mon option 3 est retirée.** Précision : T3 |
| Q3 | Flamme | **OK** | 4.4 : icône SVG décorative, jamais un émoji, masquée aux lecteurs d'écran, sans animation, contraste 3:1, texte porteur de l'état ; choix visuel à @design en E5 |
| Q4 a | Ancien abonné à la connexion | **OK** | 4.2 : « Aujourd'hui » vaut pour un abonné actif ; un ancien abonné suit la redirection vers `/abonnement` avec la ligne « Ton historique de questions et tes répliques sont gardés » ; essai du lot 0 (7.5 e) |
| Q4 b | Modale retirée en s15 contre la préférence UX | **Non traité** | Le fait « aucune connexion en fenêtre depuis s15 » est écrit sans dire si c'est une décision de Thomas : T5 |
| Q5 a | Mécanisme du filtre d'humour noir | **OK** | 7.5 i : « filtre côté navigateur sur des données déjà reçues (« n'affiche jamais » exact, « ne télécharge jamais » non) ou témoin lu par le serveur » ; annexe B |
| Q5 b | Écart de 44 px entre « Continuer » et la renonciation | **OK** | 4.2 : au moins 44 px, lien en texte, jamais un bouton de même poids ; vérifié à l'essai (7.5 e) |

## 2. La §3.13 (bonus des caps), vérifiée contre les décisions et contre mon S1

La §3.13 reprend `founder-preferences.md` l. 169 (Q7 à Q10, toutes les recos) sans rien reconcevoir et renvoie à `niveaux-xp-s24.md` §5.

| Point demandé | Verdict | Constat |
|---|---|---|
| **Portes** | **OK** | Une seule par bonus : les trois passages (caps 2 à 4) dans la Bibliothèque, bloc « Vannes, conseils, vidéos », avec « Écouter, repérer » ; la fiche « coulisses de la maison » (cap 5) dans le bloc « Vocabulaire et techniques ». Reprises en 6.2 (ligne Bibliothèque) et 6.3 (deux lignes de porte). C'est ma correction S1 (d) du tour 9 |
| **Surprise (Q9)** | **OK** | « On annonce qu'il existe, pas ce qu'il contient » (résumé, 3.13), conforme à la décision de Thomas (« son existence est annoncée, pas son contenu ») ; aucune phrase d'attente ; l'offre dit « à chaque cap franchi dans les parcours, un bonus en plus » |
| **Page neutre** | **OK, une précision** | « Cette page n'est pas disponible », la même qu'une adresse inexistante, jamais « s'ouvre au cap N » ni « il te manque » (3.13, 5.5) ; voir T2 pour l'orientation de l'abonné |
| **Absence avant ouverture** | **OK** | Un bonus non ouvert est absent de la liste de la Bibliothèque, de la recherche, des favoris proposés, de la rafale, de la cloche et de toute suggestion, sans ligne grisée (3.13, 5.5, 6.2 : « n'apparaît dans aucune de ces entrées », 6.3 : « jamais un bonus » dans la cloche) ; test inscrit en 7.5 j (compte au cap 1 : rien dans la liste, la recherche, les favoris ni la rafale ; adresse directe : page neutre). C'est ma correction S1 (a, b, e) |
| **Deux annonces** | **OK** | 3.13 : « Nouveau cap » et « Un bonus s'ouvre dans la Bibliothèque » indépendantes, renvoi à `niveaux-xp-s24.md` 5.4 ; l'architecture n'en redessine pas le texte |
| Volumes et production | OK | 4 bonus (3 passages, 1 fiche) comptés à part ; aucun total modifié (163, 293, 108, 58, 1 200 à 3 930) ; produits et validés avant l'ouverture (7.4, ordre 8 : « l'espace n'ouvre pas avec des caps qui ne débloquent rien ») ; le passage du cap 2 passe en premier |
| Accessibilité | OK | Citations vérifiées par un relecteur indépendant, sous-titres et transcription du passage cité (7.5 j) ; E4 clarifié (le passage du cap 2 est en plus des 12, 3.13, section 9) |
| Offre | OK | Titre et sous-titre inchangés, ligne ajoutée sous eux (page d'abonnement et e-mail E0), chaque texte touché revient à Thomas pour go, avis @legal (7.5 d) |

## 3. Notes (grille C1 à C11)

| Critère | T14 | T16 | T18 | Justification courte |
|---|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | 9 | Bonus en surprise sans pression ; le cap 1 ne perd rien |
| C2 Décisions de Thomas | 10 | 10 | 10 | Q3 = A, connexion, niveaux, bonus (l. 161, 168, 169) appliqués sans rien reconcevoir |
| C3 Zéro invention | 9 | 9 | 9 | Séries et sources vérifiées (l. 73, code) ; aucun chiffre neuf ; trois passages « à choisir avec Thomas » restent annoncés comme tels |
| C4 Rubriques claires, 6 entrées | 9 | 9 | 9 | Barre conforme, décision de Thomas appliquée ; dessin des libellés à @ux et @design |
| C5 Ambition | 10 | 10 | 10 | V1 complète avec bonus |
| C6 Cohérence | 9 | 9 | 9 | Contradictions du tour 16 levées ; reste un ordre d'emplacement à une phrase près (T1) et deux renvois (T4) |
| C7 Faisabilité | 9 | 9 | 9 | Chantier complet (repérage, déblocage serveur, page neutre, tests) |
| C8 Décisions et « reste à trancher » | 9 | 9 | 10 | Question sur « pratique » retirée avec sa source ; lignes « reste à trancher » courtes et exactes |
| C9 Exemples au ton maison | 9 | 9 | 9 | Inchangé |
| C10 Progression pédagogique | 9 | 9 | 9 | Inchangé |
| **C11 Pertinence pour l'audience réelle** | 9 | 9 | 9 | Bonus désirables (passages d'humoristes connus) pour des personas qui aiment « savoir pourquoi la salle part » |

**Note globale C1 à C10 : 9,3 / 10** (93 sur 100). **Avec C11 : 9,3 / 10** (102 sur 110). T16 : 9,2.

## 4. Corrections nouvelles

**Aucune bloquante.** Cinq précisions non bloquantes (T1 à T5).

**T1. Emplacement exact de la carte « Ton cap » dans « Parcours » : une seule phrase.**
Passages : 4.4 (« après l'étape en cours (et après les étapes faites, comme le dit `niveaux-xp-s24.md` 3.0) ») ; 6.2 (ligne Parcours : « en tête … ; puis les 5 parcours ; la carte « Ton cap » après l'étape en cours ; le raccourci « Tes bonus » ») ; `niveaux-xp-s24.md` 3.0 (« après l'étape en cours, jamais en tête »).
Problème : trois formulations pour un seul emplacement. La lecture de 6.2 place la carte après la liste des 5 parcours (donc très bas, hors écran à 375 px) ; « après les étapes faites » est l'ancienne règle du document des niveaux.
Correction : écrire partout « immédiatement après le bloc d'en-tête (« Tes 4 premières semaines » et l'étape à reprendre), avant la liste des 5 parcours » ; supprimer « et après les étapes faites » ; reprendre dans 4.4 la règle de voisinage de `niveaux-xp-s24.md` 3.0 point 6 (intitulé « Ton cap » de niveau 2, 24 px d'espace, texte lu sans le mot « étape »), car l'étape à reprendre est juste au-dessus et affiche « Étape n sur 6 » : la phrase actuelle (« « étape n sur 6 » vit sous la liste des étapes faites ») ne suffit plus.

**T2. Page neutre : une sortie pour l'abonné.**
« Cette page n'est pas disponible » (3.13, 5.5) laisse l'abonné sans suite. Ajouter, sans rien dire du bonus : deux liens (« Retour à la Bibliothèque », « Aujourd'hui »), statut de page introuvable, `noindex`, même mise en page et même réponse que pour une adresse inexistante (aucune différence observable, sinon la page trahit l'existence du bonus). Cela répond à l'heuristique « message d'erreur avec solution ».

**T3. Barre qui défile : trois règles manquantes dans l'architecture.**
Les contrôles (a) à (d) de 6.2 sont bons ; il manque ce que j'ai reporté au document des niveaux (Annexe B point 9 de `niveaux-xp-s24.md`) : l'entrée courante porte `aria-current="page"` et la région est nommée « Mon espace » ; pas de défilement animé si l'abonné demande moins de mouvement ; un indice visible qu'il y a une suite à droite (l'entrée suivante coupée de 16 à 24 px) : 6.2 le confie à @ux et @design, à l'écrire comme contrainte de test E5 (« un lecteur voit qu'il peut défiler »).

**T4. Renvois et mots à corriger.**
(a) Résumé, « Bonus : les trois passages d'humoristes sont à choisir avec toi (5.5 de `niveaux-xp-s24.md`…) » : la nature des bonus et le choix des passages sont en 5.3 du document des niveaux (5.5 traite de l'ancienne faille d'XP) ; vérifier le numéro dans la version courante. (b) 7.4, ordre 8 : « conçus dans `niveaux-xp-s24.md` v8 » : la version courante est la v9 ou plus récente ; écrire « version courante ». (c) Résumé, 4e puce de la Bibliothèque : « sans être annoncés d'avance » : dire « leur contenu n'est pas annoncé d'avance » (l'existence l'est, par la ligne de l'offre ; c'est ce que dit la décision de Thomas). (d) Résumé, décision C2 « texte de l'offre inchangé » : préciser « la promesse de temps inchangée », puisque la page d'abonnement reçoit une ligne de plus.

**T5. Connexion en fenêtre : le [À VÉRIFIER] du tour 16 reste ouvert.**
4.2 écrit « aucune connexion en fenêtre depuis s15 (la modale a été retirée au profit de pages) » sans dire s'il s'agit d'une décision de Thomas. La préférence UX du fondateur est la connexion en fenêtre (fermable, en-tête et pied de page visibles, jamais une page pleine). [À VÉRIFIER : la suppression de la modale en s15 est-elle un [CHOIX UTILISATEUR] ? Sinon, la dire à Thomas dans le résumé ; sans effet sur la décision d'arrivée, qui protège déjà la page d'origine.]

## 5. Ce qui est solide (à garder)

- 3.13 : décisions de Thomas reportées mot pour mot (l. 169), sans conception dupliquée ; portes, surprise, absence avant ouverture et page neutre cohérentes avec 5.5, 6.2, 6.3 et le test 7.5 j.
- Série : texte validé (l. 73) repris, définition de « pratique » lue dans le code, état à 0 validé, flamme SVG décorative, empilement à 375 px.
- Barre : décision de Thomas Q3 = A appliquée telle quelle, contrôles clairs, chemins des bonus hors « Plus » pour les téléphones, budget d'en-tête à 375 px (recherche en bouton icône).
- Page de succès : « Continuer » dominant, 44 px avant la renonciation, texte légal inchangé ; connexion pour l'ancien abonné.
- Production : quatre bonus avant l'ouverture, vérification des citations facteur limitant, aucun total modifié.

## 6. Verdict

**Prêt à présenter à Thomas.** Aucun bloquant : Q1 à Q5 du tour 16 sont tous traités (sauf le [À VÉRIFIER] sur la modale, T5, sans effet sur le parcours), la §3.13 respecte la décision de Thomas et ma correction du tour 9, et rien n'a été reconçu. T1 (une phrase d'emplacement de la carte « Ton cap ») et T2 (deux liens sur la page neutre) valent d'être écrits avant l'étalon E5 ; T3 à T5 se règlent à la relecture.
