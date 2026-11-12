# Tour 11, relecteur @ux (à l'aveugle) : `architecture-contenu-v11.md` (confirmation finale)

> Relu : résumé pour Thomas (en entier), en-tête et faits de code, 0.2, 4.2 (principe, `returnTo`, ordres 1 et 2), 4.4 (toucher), 7.5 à 7.7, section 8 (C13 et C14 en entier, le reste par passages), section 9, annexes A à B. Demande : vérifier mes W1 à W6, la lisibilité du résumé en 2 minutes sans jargon, que rien d'autre n'a bougé, et le point « un conseil ou une vidéo rattaché à une étape compte comme étape d'origine [À VÉRIFIER] ».
> Limite : je compare à ma lecture de la v10 ; je n'ai pas refait un diff mot à mot du corps inchangé (sections 2, 3, 5, 6, 7.1 à 7.4).

## 1. Notes

| Critère | T9 | T10 | T11 | Justification courte |
|---|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | 9 | Inchangée |
| C2 Décisions de Thomas | 9 | 10 | 10 | Aucune reco ne rouvre une décision marquée ; chaque option qui en rouvre une le dit |
| C3 Zéro donnée inventée | 8 | 9 | 10 | Faits de code exacts (« six clusters sur neuf » ajouté), seuil de vannes « à lire en base », essai du `src` formulé comme un contrôle, rattachement conseil/vidéo marqué [À VÉRIFIER] |
| C4 Rubriques claires, 6 entrées au plus | 9 | 9 | 9 | Inchangée ; le résumé nomme les rubriques dans les mots de Thomas |
| C5 Ambition | 9 | 10 | 10 | Inchangée |
| C6 Cohérence | 8 | 9 | 9 | Tout est aligné ; une clause de 4.2 est encore ambiguë pour un conseil ou une vidéo de l'étape 1 gratuite (X1) |
| C7 Faisabilité | 9 | 9 | 9 | Inchangée |
| C8 Questions à Thomas | 9 | 9 | 9 | Jargon retiré de C14 et C10 a, C2 B, C7, C11 ; « discrets » devenu « compacts » ; le résumé donne la reco de chaque question, mais pas son prix principal (X2) |
| C9 Exemples au ton maison | 9 | 9 | 9 | Inchangée |
| C10 Progression pédagogique | 9 | 9 | 9 | Page de succès avec bouton « Continuer », bandeau qui désigne le geste sur la page même |
| **C11 Pertinence pour l'audience réelle** | 9 | 9 | **9** | Inchangée ; le résumé dit en trois phrases ce que l'on sait et ne sait pas de l'audience |

**Note globale C1 à C10 : 9,3 / 10** (93 sur 100). **Avec C11 : 9,3 / 10** (102 sur 110).

## 2. Statut de mes 6 réglages du tour 10

| # | Sujet | Statut | Où |
|---|---|---|---|
| W1 | Page de succès : redirection ou bouton | OK | 4.2 et C14 : « la page de succès reste affichée avec un bouton “Continuer”, sans redirection automatique » (message de bienvenue et lien pour renoncer au contrat lisibles) |
| W2 | « `/parcours/repartie` sans étape » dépend de C11 | OK | 4.2 : « n'est neutre que si C11 = A » ; sous B ou C le coût est dit (l'abonné venu de l'article de blagues ou qui avait choisi Répartie reçoit un autre parcours), corrigé par le geste de C9 B et le quiz ; C11 B et C disent leur conséquence |
| W3 | Toucher sous le seuil | OK | 4.4 : « si aucune catégorie n'atteint le seuil, la rangée disparaît et seul “Une autre” reste » |
| W4 | L'essai présuppose son résultat | OK | 7.5 (e) : « il vérifie si le `src` atteint l'espace (le code lu dit que non) » |
| W5 | Fiche d'origine liée à un parcours | OK avec une précision à ajouter | 4.2, ordre 2 : un conseil ou une vidéo rattaché à une étape compte comme étape d'origine, [À VÉRIFIER : rattachement existant dans les données]. Voir X1 |
| W6 | « Discrets » contre 44 px | OK | C13 B : « boutons compacts » |

## 3. Le point demandé : « un conseil ou une vidéo rattaché à une étape compte comme étape d'origine »

**Principe : bon et bien marqué.** Un conseil ou une vidéo d'une étape donne un parcours aussi sûr que l'étape elle-même, et le texte dit qu'il faut vérifier que le rattachement existe dans les données ; tant que ce n'est pas vérifié, la règle ne s'applique pas et l'ordre normal (quiz, parcours d'origine, défaut) reprend. Rien à retirer.

**X1 (non bloquant, une phrase). La clause « si l'abonné vient de l'étape 1 gratuite, l'étape conseillée est l'étape 2 » se lit désormais aussi pour un conseil ou une vidéo.** La ligne du tableau de l'ordre 2 réunit « une étape (ou un conseil, une vidéo rattaché) » et « si l'abonné vient de l'étape 1 gratuite : étape 2 ». Un abonné venu d'une seule vidéo ou d'un seul conseil de l'étape 1 n'a pas parcouru l'étape (la règle « il l'a vraiment ouverte » de 4.2 vaut pour `#etape-N`, pas pour une fiche). Écrire : pour un conseil ou une vidéo d'origine, le parcours est celui de l'étape et l'étape conseillée de la semaine 2 reste **l'étape 1** (le premier pas, lui, est déjà l'exercice de cette fiche, ordre 1) ; « l'étape 2 » ne vaut que pour une arrivée par l'étape 1 ouverte.

## 4. Le résumé pour Thomas

| Test | Verdict |
|---|---|
| Lisible en 2 minutes | **Oui** : environ 480 mots, 5 blocs (contenu, ce qui change pour l'abonné, l'audience, les 14 questions avec reco, les 5 étalons), une ligne par question |
| Sans jargon | **Oui** : plus de `returnTo`, de chemin d'adresse, de D.221-5, de mesure codée ; les mots sont ceux de Thomas (aujourd'hui, parcours, carnet, bibliothèque, étalons) ; « rafale » n'apparaît pas (« Si tu as 5 minutes ») |
| Fidèle au document | **Oui** : 60 situations neuves + 45 du carnet, 155 fiches neuves, 285 avec l'existant, 14 questions, reco de chaque question identique à la section 8, 5 étalons identiques à la section 9 |
| Ce qui manque | **X2 (non bloquant)** : le résumé ne dit pas le prix principal de la reco de C1 (le mot « Vocabulaire » n'est plus sur la barre, il devient un bloc de « Bibliothèque »), ni ce que le projet demande à Thomas lui-même (il relit 54 fiches avant l'ouverture, puis chaque réponse de « Mes questions », environ 5 par jour ouvré à 100 abonnés). Deux lignes suffisent |

**X2, deux lignes proposées** (à insérer sans toucher au reste) : en tête de la liste des questions, « Aucune de nos recos ne rouvre une décision déjà prise » (vrai : les options qui en rouvrent une sont marquées et ne sont pas recommandées) ; et dans « Ce qui change », « Ce que ça te demande : lire les 5 étalons puis 3 fiches sur 10 par lot (54 fiches avant l'ouverture), et, une fois l'espace ouvert, relire et envoyer chaque réponse de “Mes questions” ».

## 5. Rien d'autre n'a bougé ?

Ce que j'ai vérifié comme différent de la v10 est entièrement tracé en annexe A : résumé (nouveau), bandeau de C14 C (désigne le geste sur la page), page de succès avec bouton « Continuer », rattachement conseil/vidéo, rangée du toucher sous le seuil, essai du `src`, « compacts », « six clusters sur neuf », ligne « rencontre » de 0.2, jargon retiré de C14, C10 a, C2 B, C7, C11. Les totaux (155, 285, 100 hors parcours, 54 lues, 60 = 30 + 30), le sommaire, les 14 questions et les 5 étalons sont identiques. Une retouche de sens, déclarée : le bandeau ne renvoie plus vers « Aujourd'hui » mais vers l'exercice de la page ; E5 cite toujours « le bandeau “Ton premier pas” » sans le contredire.

## 6. Verdict

**Prêt à présenter : OUI.** Plus aucun bloquant, six réglages précédents traités, résumé lisible et sans jargon, chemin de l'abonné cohérent de bout en bout. Pour viser 10/10 partout, deux retouches d'une phrase chacune, hors périmètre bloquant : X1 (clause « étape 2 » réservée à l'étape ouverte) et X2 (prix de la reco de C1 et charge de Thomas dans le résumé).
