# Textes finaux, packs 1 et 2 (tour 5) : bloc → emplacement → texte exact

> Pour @fullstack. Chaque ligne donne le texte exact du texte A du tour 5 (la version polie). **Statut : à brancher seulement après la relecture à l'aveugle du tour 5** (règle d'or P0 s18 : rien ne se met en ligne sous la barre). Si B gagne un duel, brancher B (gagnant du tour 4, détaillé dans `cles-pack12-tour5.md`). Les étiquettes `[Sn]` sont celles du pack. Zéro tiret cadratin, UTF-8, espace insécable U+00A0 avant « € » et avant « : » et « ? » dans le rendu. Prix, `PARCOURS_COUNT`, `{N} vannes` et le reste des gabarits : voir `annexe-pack12-tour5.md` §4.

## B1 : encart de démonstration au milieu de l'article

Condition de publication : la situation montrée est la fiche offerte du mois **et** un chambrage (règle d'affichage, annexe tour 4 §5). Sinon ne pas publier cet encart avec cette scène.

| Emplacement | Texte exact |
|---|---|
| `[S1]` | Une situation de répartie |
| `[S2]` | Premier rendez-vous, au dessert. Tu viens de dire ta troisième phrase de la soirée, et on te lance : « Tu parles toujours aussi peu ? » |
| `[S3]` | Tu réponds quoi ? |
| `[S6]` (bouton plein) | Voir la réplique |
| `[S7]` | Gratuit, sans compte : la réplique, pourquoi elle marche et quoi dire si ça se tend. Et chaque mois, de nouvelles situations dans Premium, l'abonnement du site. |

La seconde phrase de `[S7]` ne s'affiche que si le carnet compte plus d'une fiche.

## B2 : bloc de fin d'article

| Emplacement | Texte exact |
|---|---|
| `[S1]` | Parcours Répartie · 4 semaines |
| `[S8]` (titre) | Quand on te chambre et que rien ne sort |
| `[S5']` | Tu viens de lire cinquante vannes. Reste la seconde qui compte : celle où la bonne vanne sort de ta bouche, pas de ton téléphone. Une étape par semaine, 20 minutes : tes premières répliques, le rythme et les silences, retourner les piques avec le sourire, et la vanne tombée à plat qui devient une deuxième chance. À chaque étape, un défi à tenter, en vrai ou à l'écrit. |
| `[S6]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | Débloquer les 5 parcours, 2,99 €/mois |
| `[S9]` | Premium, l'abonnement du site : 2,99 € TTC par mois, ou 24,99 € TTC par an (2,08 € par mois). Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. |

## B18 : la lettre par e-mail dans l'article

| Emplacement | Texte exact |
|---|---|
| Ligne repliée (phrase) | Une vanne gratuite par mois, et pourquoi elle marche. |
| Ligne repliée (bouton) | Recevoir par e-mail |
| Formulaire complet, titre | La vanne du mois et pourquoi elle marche |
| Formulaire complet, sous-titre (ligne 1) | Un e-mail par mois, avec une vanne comme celle-ci : « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » |
| Formulaire complet, sous-titre (ligne 2) | Puis ce qui la fait marcher, et un exercice en trois étapes pour écrire la tienne, exemple à l'appui. À la fin, une lecture à suivre et un mot sur Premium, notre abonnement. |
| Bouton du formulaire | Envoie-moi la lettre |
| Note | Gratuit, sans compte. Désinscription en un clic. |

La vanne de la ligne 1 vient de la donnée (dernière vanne déjà envoyée ; avant le premier envoi du 05/11/2026, la vanne validée ci-dessus). Si Thomas ne veut pas montrer d'extrait avant l'envoi : retirer la ligne 1, la ligne 2 doit alors commencer par « Un e-mail par mois : ce qui fait marcher une vanne, et un exercice en trois étapes pour écrire la tienne, exemple à l'appui. ».

## B3 : haut de l'accueil

| Emplacement | Texte exact |
|---|---|
| `[S19]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | Débloquer les 5 parcours, 2,99 €/mois |
| `[S20]` | Tes premières répliques se lisent sans compte, quiz compris. La suite est dans Premium, l'abonnement du site : tu résilies en ligne quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement. |

## B4 + B5 : carte Premium d'accueil

| Emplacement | Texte exact |
|---|---|
| `[S10]` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? |
| `[S11]` | La table qui rit, et la réplique, c'est toi qui l'as lancée. Chaque parcours avance d'une étape par semaine (15 à 20 minutes), avec à chaque fois un défi à tenter, dans la vie ou à l'écrit. Répartie quand on te chambre, Machine à Café et Boulot côté travail, Confiance pour retrouver ta légèreté, Storytelling pour raconter une anecdote. |
| En-tête de carte | Premium · 2,99 €/mois |
| `[S12]` | Ou 24,99 €/an (2,08 €/mois, 10,89 € économisés). Prix TTC. |
| `[S12]` si le plan annuel n'est pas proposé | Prix TTC. |
| Bouton plein | Débloquer les 5 parcours, 2,99 €/mois |
| Bouton contour | Tester mes premières répliques, gratuit |
| `[S13]` | Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. |
| Dernière ligne | Déjà 1 500+ inscrits, et toi ? |
| 4 avantages | inchangés (textes du site) |

`[S11]` : les noms de parcours et leur phrase suivent les parcours publiés (`PREMIUM_PARCOURS`). Si le nombre de parcours tombe à 1 ou 0 : bouton « Débloquer tous les parcours, 2,99 €/mois ».

## B6 : bouton d'en-tête (duel final, résultat du tour 5 à reporter)

| Emplacement | Texte exact |
|---|---|
| Bouton d'en-tête (3 endroits de `header.tsx`) | **Voir les prix** (texte A du duel) |
| Si le duel donne l'autre vainqueur | **2,99 €/mois** (avec U+00A0 entre « 2,99 » et « € », et test sur le trafic réel contre « Voir les prix ») |
| Nom accessible, dans les deux cas | Voir les prix de Premium |

Cette ligne est la seule du fichier dont le texte dépend du vote : le texte A n'est pas un texte « poli » mais le libellé que Thomas a demandé d'opposer à « 2,99 €/mois ». Ne rien brancher avant le résultat.
