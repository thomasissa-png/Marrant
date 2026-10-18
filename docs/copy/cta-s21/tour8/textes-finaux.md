# Textes finaux des 17 blocs d'appel (s21) : bloc → emplacement [Sn] → texte exact

> Pour @fullstack. Remplace `tour7/textes-finaux.md`. **Statut : à brancher seulement après la relecture à l'aveugle du tour 8** (règle d'or P0 s18 : rien ne se met en ligne sous la barre ; un bloc qui n'atteint pas 10 chez les trois repart en correction, pas en ligne). Cinq blocs sont validés et recopiés tels quels : B1, B6, B15, B17 (tour 6) et B7 (tour 7), ce dernier sans « si tu vois loin » (retrait fait dans la ligne de prix LP-A). Zéro tiret cadratin, UTF-8, espace insécable U+00A0 avant « € », « : », « ? » dans le rendu. Prix et gabarits : `docs/copy/cta-s21/tour5/annexe-pack12-tour5.md` §4 et `annexe-pack3-tour5.md`.

## Variables et lignes communes

- `{P}` = nom du parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot). `{N}` = nombre d'étapes (3, 4, 6, 6, 6). `{D}` = minutes par semaine (15, 20, 20, 20, 15). `{PARCOURS_COUNT}` = nombre de parcours publiés (5 aujourd'hui) ; `{AUTRES}` = `PARCOURS_COUNT - 1` (4). Source : `PREMIUM_PARCOURS` dans `apps/web/src/config/premium.ts`. Dans tous les textes ci-dessous, le « 5 » qui compte les parcours s'écrit `{PARCOURS_COUNT}` dans le code, et le « 4 » de « les 4 autres parcours » s'écrit `{AUTRES}` (B2 lien, B3 lien et `[S20]`, B4+B5 bouton, B7, B8, B9, B10, B11, B12, B13, B14, B16 bouton). Les textes sont écrits avec les valeurs d'aujourd'hui pour être relus tels quels.
- **Libellé d'ouverture** `OUVRIR` = `Ouvrir les {PARCOURS_COUNT} parcours · 2,99 €/mois` (point médian U+00B7 entouré d'espaces). Même mot et même forme que le bouton de la page d'abonnement (B16). Repli si `PARCOURS_COUNT` vaut 1 ou 0 : `Ouvrir tous les parcours · 2,99 €/mois`. Le mot « Débloquer » ne doit plus apparaître dans aucun libellé d'appel.
- **LP-A** (ligne de prix avec annuel, seulement si l'offre annuelle est disponible) : `2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.` (**changement : « si tu vois loin » retiré**.)
- **LP-M** (repli sans annuel) : `2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **Contour** `[S25]` : `Étape 1 de {P}, gratuite : {CONTENU}` (par défaut Répartie ; sur une fiche, le parcours qui colle à la catégorie). `{CONTENU}` = `5 vannes et un défi` (liste /vannes, fiche vanne), `un conseil et un défi` (liste /conseils, fiche conseil), `2 vidéos et un défi` (liste /videos, fiche vidéo). Vrai pour l'étape 1 des 5 parcours (`docs/content/parcours-*.json`).
- **Rythme des étapes (fait à respecter dans tout le code et les textes)** : avec Premium, **toutes les étapes d'un parcours sont ouvertes d'un coup**. Une étape par semaine est un rythme conseillé, jamais un déblocage (décision du 07/10, audit s17, D2). Ne jamais écrire « s'ouvrent ensuite », « une par semaine » comme un calendrier d'ouverture.

## B1 : encart de démonstration au milieu de l'article (VALIDÉ 10/10/10, inchangé)

Condition de publication : la situation montrée est la fiche offerte du mois **et** un chambrage. Sinon ne pas publier cet encart avec cette scène.

| Emplacement | Texte exact |
|---|---|
| `[S1]` | La situation offerte ce mois-ci |
| `[S2]` | Premier rendez-vous, au dessert. Tu viens de dire ta troisième phrase de la soirée, et on te lance : « Tu parles toujours aussi peu ? » |
| `[S3]` | Tu réponds quoi ? |
| `[S6]` (bouton plein) | Voir la réplique |
| `[S7]` | Gratuit, sans compte : la réplique, pourquoi elle marche et quoi dire si ça se tend. Chaque mois, de nouvelles situations arrivent dans Premium, l'abonnement du site. |

`[S1]` est vrai tant que la scène montrée est la situation offerte du mois (même condition que ci-dessus). La seconde phrase de `[S7]` ne s'affiche que si le carnet compte plus d'une fiche.

## B2 : bloc de fin d'article

| Emplacement | Texte exact |
|---|---|
| `[S1]` | Parcours Répartie · 4 semaines |
| `[S8]` (titre) | La vanne qui sort de ta bouche, pas de ton téléphone |
| `[S5']` | Tu viens de lire cinquante vannes. Le jour où on te chambre, tu n'auras pas le temps de les chercher dans ton téléphone : ça se joue en une seconde, et ça s'entraîne. Une étape par semaine, 20 minutes : tes premières répliques, le rythme et les silences, les piques qu'on retourne avec le sourire, et la vanne tombée à plat qui devient une deuxième chance. À chaque étape, un défi à tenter, en vrai ou à l'écrit. La première se lit tout de suite, sans compte. |
| `[S6]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| `[S9]` | Premium, l'abonnement du site : 2,99 € TTC par mois, ou 24,99 € TTC par an (2,08 € par mois). Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. |

## B18 : la lettre par e-mail dans l'article

| Emplacement | Texte exact |
|---|---|
| Ligne repliée (phrase) | Chaque mois, une vanne et de quoi écrire la tienne. |
| Ligne repliée (bouton) | Recevoir par e-mail |
| Formulaire complet, titre | La vanne du mois, et de quoi écrire la tienne |
| Sous-titre, ligne 1 | Une seule par mois, mais démontée, comme celle-ci : « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » |
| Sous-titre, ligne 2 | Tu reçois ce qui la fait marcher, puis trois étapes pour fabriquer la tienne, exemple à l'appui. Au passage, un mot sur Premium, notre abonnement, et une lecture à suivre. |
| Bouton du formulaire | Envoie-moi la lettre |
| Note | La lettre est gratuite, sans compte. Désinscription en un clic. |

La ligne repliée fait 51 caractères (2 lignes de 28 : OK) et le bouton 19 (moins de 20 : OK). La vanne de la ligne 1 vient de la donnée (dernière vanne déjà envoyée ; avant le premier envoi du 05/11/2026, la vanne ci-dessus). Si Thomas ne veut pas montrer d'extrait avant l'envoi : la ligne 1 devient `Une seule par mois, mais démontée.` et la ligne 2 reste inchangée.

## B3 : haut de l'accueil

| Emplacement | Texte exact |
|---|---|
| `[S19]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| `[S20]` | Dedans : un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz, à lire sans compte. C'est l'étape 1 de Répartie. La suite et les 4 autres parcours sont dans Premium, l'abonnement du site, résiliable en ligne quand tu veux. |

`[S20]` : « Répartie » (`{P}`), « 5 » (`{PARCOURS_COUNT}`) et « 4 » (`{AUTRES}`) suivent le parcours du bouton. La phrase « Un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz » est le format de l'étape 1 des 5 parcours. Le titre d'accueil « On va arranger ça » n'est pas touché. Plus de durée ni de remboursement dans `[S20]` (le remboursement est dit dans B4+B5 `[S13]` et sur la page d'abonnement).

## B4 + B5 : carte Premium d'accueil

| Emplacement | Texte exact |
|---|---|
| `[S10]` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? |
| `[S11]` | La table qui rit, et c'est ta réplique qui l'a lancée. Choisis ton parcours. Répartie, pour répondre quand on te chambre. Machine à Café, pour faire rire à la pause sans devenir le collègue qui force. Boulot, pour le lundi à 9 h, sans le ton de compte rendu. Confiance, pour retrouver ta légèreté. Storytelling, pour que ta chute arrive avant le dessert. Une étape par semaine, 15 à 20 minutes, avec un défi à tenter, dans la vie ou à l'écrit. |
| En-tête de carte | Premium · 2,99 €/mois |
| `[S12]` | Ou 24,99 €/an (2,08 €/mois, 10,89 € économisés). Prix TTC. |
| `[S12]` si le plan annuel n'est pas proposé | Prix TTC. |
| Bouton plein | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| Bouton contour | Tester mes premières répliques, gratuit |
| `[S13]` | Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. |
| Dernière ligne | Déjà 1 500+ inscrits, et toi ? |
| 4 avantages | inchangés (textes du site) |

`[S11]` : une phrase courte par parcours publié (`PREMIUM_PARCOURS`), dans cet ordre : Répartie, Machine à Café, Boulot, Confiance, Storytelling. Si un parcours est dépublié, sa phrase disparaît. La phrase finale (« 15 à 20 minutes ») suit le min et le max de `{D}`.

## B6 : bouton d'en-tête (VALIDÉ 10/10/10, inchangé)

| Emplacement | Texte exact |
|---|---|
| Bouton d'en-tête (3 endroits de `header.tsx`) | **2,99 €/mois** (avec U+00A0 entre « 2,99 » et « € ») |
| Nom accessible | 2,99 € par mois : voir l'offre Premium |

Le nom accessible contient le libellé visible (règle « label in name », WCAG 2.5.3) ; il remplace « Voir les prix de Premium ». Variante à mesurer au code seulement (pas dans ce fichier de branchement) : `Premium 2,99 €`, voir l'annexe du tour 6.

## B7 : murs des listes (VALIDÉ 10/10/10, inchangé sauf retrait de « si tu vois loin » dans LP-A)

| Emplacement | /vannes | /conseils | /videos |
|---|---|---|---|
| `[S21]` | Voilà les 10 premières vannes. La suite est juste en dessous, dans Premium. | Voilà les 3 premiers conseils. La suite est juste en dessous, dans Premium. | Voilà les 3 premières vidéos. La suite est juste en dessous, dans Premium. |
| `[S22]` (lien) | Tu y trouves aussi le filtre par catégorie, pour aller droit à celles qu'il te faut. | Tu y trouves aussi les filtres par niveau et par catégorie, pour aller droit à ceux qu'il te faut. | Tu y trouves aussi les filtres par niveau et par catégorie, pour aller droit à celles qu'il te faut. |
| `[S23]` titre | Et si la prochaine vanne qui fait rire la table était la tienne ? | Et si la bonne réplique sortait sur le moment, pas trois heures après ? | Tu les regardes pour rire. Et si tu les regardais pour faire rire ? |
| `[S24]` | Avec Premium : toute la liste, l'exercice « À toi de jouer » sous chaque vanne pour écrire la tienne, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). | Avec Premium : toute la liste, l'exercice « À toi de jouer » de chaque conseil pour l'essayer, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). | Avec Premium : toute la liste, les points clés et l'exercice de chaque vidéo, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). |
| Bouton plein | Voir la suite des vannes avec Premium | Voir la suite des conseils avec Premium | Voir la suite des vidéos avec Premium |
| `[S26]` | LP-A | LP-A | LP-A |
| `[S25]` contour | Étape 1 de Répartie, gratuite : 5 vannes et un défi | Étape 1 de Répartie, gratuite : un conseil et un défi | Étape 1 de Répartie, gratuite : 2 vidéos et un défi |

`[S22]` se lit à la suite de `[S21]` (« …, dans Premium. Tu y trouves aussi le filtre… », « y » = Premium) : ne jamais l'afficher seul ni avant `[S21]`. C'est une phrase entière, rendue comme lien vers la page d'abonnement.

## B8 : fiche d'une vanne

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Et si demain, c'était la tienne qu'on se répétait ? |
| `[S15]` | La mécanique, tu l'as. Reste à écrire ta version, celle que tu auras envie de sortir à la prochaine soirée : c'est l'exercice « À toi de jouer », une consigne et un exemple à réutiliser pour la fabriquer avec la même technique. Il est dans Premium, qui ouvre aussi les 5 parcours, une étape par semaine. |
| Bouton plein | Écrire la mienne avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Étape 1 de {P}, gratuite : 5 vannes et un défi |
| Lien discret (**modifié**) | Voir d'autres vannes |

## B9 : fiche d'un conseil

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Essaie-le avant le soir où il te servira |
| `[S15]` | Le conseil, tu l'as lu. Reste à l'essayer, tranquillement : l'exercice « À toi de jouer » te donne une consigne et un exemple à réutiliser. Il est dans Premium, avec 5 parcours pour t'entraîner : une étape par semaine, de 15 à 20 minutes, chacune avec un défi à tenter, dans la vie ou à l'écrit. |
| Bouton plein | Essayer ce conseil avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Étape 1 de {P}, gratuite : un conseil et un défi |
| Lien discret (**modifié**) | Voir d'autres conseils |

## B10 : fiche d'une vidéo

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Faire rire une salle, c'est son métier. Toi, une table te suffit |
| `[S15]` | Et ça s'entraîne. Les points clés de cette vidéo et son exercice sont dans Premium : de quoi la revoir pour faire rire, plus seulement pour rire. Les 5 parcours sont faits pour ça : une étape par semaine, de 15 à 20 minutes, avec un défi à chaque fois. Ça s'entraîne, et à petite dose. |
| Bouton plein | Décrypter cette vidéo avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Étape 1 de {P}, gratuite : 2 vidéos et un défi |
| Lien discret (**modifié**) | Voir d'autres vidéos |

Ne rien ajouter sur le contenu de l'analyse (aucun extrait n'est connu). `[S14]` et `[S15]` se lisent d'un trait (« …une table te suffit. Et ça s'entraîne. »).

## B11 : fenêtre Premium (par geste)

Communs à tous les gestes : ligne de prix `2,99 € TTC / mois` ; ligne de garantie finale inchangée ; lien `[S28]` : `Ou lire d'abord l'étape 1 du parcours {P} (gratuite, sans compte)`. Ordre d'affichage : titre, intro, prix, `[S27]`, bouton, `[S28]`, garantie. Intro = `{RAISON}` + `S'abonner, c'est deux étapes : ton compte, puis le paiement sécurisé. Si tu fermes cette fenêtre, ta page reste là.` (`{RAISON}` ci-dessous ; vide pour le vote, dont le titre dit déjà la raison).

| Geste | Titre | `{RAISON}` (début de l'intro) | `[S27]` | Bouton plein |
|---|---|---|---|---|
| Favori, vanne | Garde-la pour le soir où tu en auras besoin | Les favoris font partie de Premium. | Avec Premium : tes favoris prêts pour le bon moment, et 5 parcours pour t'entraîner, une étape par semaine. | Je m'abonne et je garde mes favoris |
| Favori, conseil | Garde-le pour le soir où tu en auras besoin | idem | idem | idem |
| Favori, vidéo | Garde-la sous le coude | idem | idem | idem |
| Vote | Voter sur les nouveautés, c'est dans Premium | (aucune) | Avec Premium : ton vote, tes favoris et 5 parcours pour t'entraîner, une étape par semaine. | Je m'abonne et je vote |
| Carte floutée, /vannes | Le reste de la liste est juste derrière | La suite de la liste fait partie de Premium. | Avec Premium : toute la liste, l'exercice « À toi de jouer » sous chaque vanne, le filtre par catégorie et 5 parcours pour t'entraîner. | Je m'abonne et j'ouvre toute la liste |
| Carte floutée, /conseils | Le reste de la liste est juste derrière | idem | Avec Premium : toute la liste, l'exercice « À toi de jouer » de chaque conseil, les filtres par niveau et par catégorie, et 5 parcours pour t'entraîner. | Je m'abonne et j'ouvre toute la liste |
| Carte floutée, /videos | Le reste de la liste est juste derrière | idem | Avec Premium : toute la liste, les points clés et l'exercice de chaque vidéo, les filtres, et 5 parcours pour t'entraîner. | Je m'abonne et j'ouvre toute la liste |

Le titre « soir » n'existe que pour la vanne et le conseil ; la vidéo n'en parle jamais. Intro complète d'un favori, par exemple : `Les favoris font partie de Premium. S'abonner, c'est deux étapes : ton compte, puis le paiement sécurisé. Si tu fermes cette fenêtre, ta page reste là.`

## B12 : résultat du quiz d'humour (parcours conseillé = `{P}`)

| Emplacement | Texte exact |
|---|---|
| Phrase | Ta force, tu viens de la lire. Reste à t'en servir : l'étape 1 de {P} se lit tout de suite, sans compte. Un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. Le parcours compte {N} étapes de {D} minutes, au rythme conseillé d'une par semaine. |
| Bouton plein (**modifié**) | Commencer mon parcours {P}, étape 1 gratuite |
| Lien (ouvre la page d'abonnement) | Voir les {PARCOURS_COUNT} parcours en entier avec Premium |
| Ligne Premium, avec annuel | Premium ouvre {P} en entier et les {AUTRES} autres parcours : 2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement. |
| Ligne Premium, repli sans annuel | Premium ouvre {P} en entier et les {AUTRES} autres parcours : 2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement. |

Exemple (Confiance) : « Ta force, tu viens de la lire. Reste à t'en servir : l'étape 1 de Confiance se lit tout de suite, sans compte. Un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. Le parcours compte 6 étapes de 20 minutes, au rythme conseillé d'une par semaine. » Bouton : « Commencer mon parcours Confiance, étape 1 gratuite ». Le bouton de B15 (« Commencer {P}, étape 1 gratuite ») reste différent et inchangé.

## B13 : quiz d'orientation, membre sans abonnement (par parcours)

Bouton : `Suivre {P} en entier · 2,99 €/mois`. Ligne de garantie : `Prix TTC, paiement sécurisé par Stripe. Tu résilies en ligne quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.` Gabarit : `Ton quiz te conseille {P}. C'est le parcours pour toi si {LIGNE_CARTE}. L'étape 1 est offerte. Au programme ensuite{ENTRE_AUTRES} : {PROGRAMME}. Avec Premium, les étapes 2 à {N} sont ouvertes tout de suite. Le rythme conseillé : une par semaine, {D} minutes. Pour 2,99 € par mois, tu ouvres les {PARCOURS_COUNT} parcours, pas seulement {P}. Ton compte est prêt : il ne reste que le paiement.` (« les étapes 2 et 3 » pour Machine à Café.) `{LIGNE_CARTE}` = la ligne de la carte du parcours, en entier, sans « Pour toi si ». `{PROGRAMME}` = titres d'étapes lus dans `moduleTitle` des fichiers `docs/content/parcours-*.json` (première lettre en minuscule), jusqu'à 3 ; `{ENTRE_AUTRES}` = `, entre autres` quand le parcours a plus d'étapes que de titres cités. Pas d'annuel dans B13 (le bouton ouvre directement un paiement dont la formule n'est pas choisie).

| Parcours | Texte exact avant le bouton |
|---|---|
| Répartie | Ton quiz te conseille Répartie. C'est le parcours pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre. L'étape 1 est offerte. Au programme ensuite : le rythme et les silences, retourner les piques avec le sourire, improviser sur l'inattendu. Avec Premium, les étapes 2 à 4 sont ouvertes tout de suite. Le rythme conseillé : une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Répartie. Ton compte est prêt : il ne reste que le paiement. |
| Machine à Café | Ton quiz te conseille Machine à Café. C'est le parcours pour toi si tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force. L'étape 1 est offerte. Au programme ensuite : sentir le bon moment, raconter une anecdote qu'on écoute jusqu'au bout. Avec Premium, les étapes 2 et 3 sont ouvertes tout de suite. Le rythme conseillé : une par semaine, 15 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Machine à Café. Ton compte est prêt : il ne reste que le paiement. |
| Confiance | Ton quiz te conseille Confiance. C'est le parcours pour toi si tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer. L'étape 1 est offerte. Au programme ensuite, entre autres : rire de toi sans te rabaisser, l'œil de l'observateur, être à l'aise en groupe. Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite. Le rythme conseillé : une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Confiance. Ton compte est prêt : il ne reste que le paiement. |
| Storytelling | Ton quiz te conseille Storytelling. C'est le parcours pour toi si tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert. L'étape 1 est offerte. Au programme ensuite, entre autres : des personnages qu'on entend, une chute qui se lit de deux façons, un détour qui ne perd personne. Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite. Le rythme conseillé : une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Storytelling. Ton compte est prêt : il ne reste que le paiement. |
| Boulot | Ton quiz te conseille Boulot. C'est le parcours pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu. L'étape 1 est offerte. Au programme ensuite, entre autres : un PS drôle sans finir en capture d'écran, le couloir en quinze secondes, un toast de soixante secondes. Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite. Le rythme conseillé : une par semaine, 15 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Boulot. Ton compte est prêt : il ne reste que le paiement. |

Seuls Répartie et Storytelling sont montrés aux relecteurs ; les trois autres suivent le même gabarit. Les titres d'étapes cités (Machine à Café, Confiance, Boulot) sont ceux de `parcours-reecriture-s17.json` et `parcours-boulot-s19.json` ; pour Boulot, « Le couloir : quinze secondes » devient « le couloir en quinze secondes » et « Un toast de soixante secondes, une seule vanne » est abrégé. Si les titres changent dans la donnée, le texte suit la donnée.

## B14 : fin de l'étape 1 et carte « Étape 2 » (par parcours)

- `[S17]`, titre de l'étape, `[S18]` : données publiques du parcours, inchangées.
- Phrase de suite et de validation (**modifiée**, sans nombre d'étapes ni durée) : `Bien joué pour l'étape 1. Avec Premium, l'étape 2 est ouverte tout de suite, comme toutes les suivantes, et tu valides celle que tu viens de finir. Le rythme conseillé : une par semaine, mais rien ne t'y oblige. Le même abonnement ouvre aussi les {AUTRES} autres parcours.`
- Bouton plein : `Passer à l'étape 2 avec Premium`
- `[S16]` : LP-A
- `[S30]` (lien discret) : `Ou la lettre gratuite, sans compte : une vanne décryptée et un exercice, une fois par mois par e-mail`

## B15 : page des parcours (par carte) (VALIDÉ 10/10/10, inchangé)

Bouton : `Commencer {P}, étape 1 gratuite`. `[S31]` : `Sans compte ni abonnement, quiz compris. Les étapes 2 à {N} sont dans Premium.` (« 2 et 3 » pour Machine à Café).

| Parcours | Bouton | `[S31]` |
|---|---|---|
| Machine à Café | Commencer Machine à Café, étape 1 gratuite | Sans compte ni abonnement, quiz compris. Les étapes 2 et 3 sont dans Premium. |
| Répartie | Commencer Répartie, étape 1 gratuite | Sans compte ni abonnement, quiz compris. Les étapes 2 à 4 sont dans Premium. |
| Confiance | Commencer Confiance, étape 1 gratuite | Sans compte ni abonnement, quiz compris. Les étapes 2 à 6 sont dans Premium. |
| Storytelling | Commencer Storytelling, étape 1 gratuite | Sans compte ni abonnement, quiz compris. Les étapes 2 à 6 sont dans Premium. |
| Boulot | Commencer Boulot, étape 1 gratuite | Sans compte ni abonnement, quiz compris. Les étapes 2 à 6 sont dans Premium. |

## B16 : page d'abonnement (selon le parcours d'origine)

| Parcours d'origine | Surtitre | Titre |
|---|---|---|
| Répartie, adresse directe, tout parcours sans texte propre (`[S33a]`) | Pour toi si tu trouves la bonne réponse, mais avec un temps de retard | Ta réplique pendant la soirée, pas dans le bus du retour |
| Machine à Café et Boulot (`[S33b]`) | Pour toi si tu veux faire rire au boulot, sans devenir le collègue qui force | Ta réplique pendant la réunion, pas dans l'ascenseur d'après |
| Confiance (`[S33c]`) | Pour toi si tu sors d'une période compliquée et que le rire te manque | Retrouver ta légèreté, 20 minutes par semaine, sans te forcer |
| Storytelling (`[S33d]`) | Pour toi si ta chute arrive quand tout le monde est passé au dessert | Ton histoire jusqu'à la chute, avant qu'on te dise « et donc ? » |

- Bouton plein, formule mensuelle : `Ouvrir les 5 parcours · 2,99 €/mois` ; formule annuelle choisie : `Ouvrir les 5 parcours · 24,99 €/an` (mensuel par défaut si l'annuel n'est pas disponible). Le libellé suit le sélecteur sans rechargement.
- `[S32]` : `Deux étapes : ton compte, puis le paiement sécurisé par Stripe.`
- Sous-titre et carte : inchangés. Le titre Confiance dit « 20 minutes par semaine » : à suivre `{D}` de Confiance si la durée change. Aucune formule de rythme libre (« à ton rythme ») ne doit apparaître nulle part.

## B17 : création de compte (VALIDÉ 10/10/10, texte tel quel)

- `[S34]` (libellé du champ prénom) : `Prénom (facultatif, pour te saluer dans nos e-mails)`
- `[S36]` (bouton plein) : `Créer mon compte et passer au paiement`
- `[S35]` (lien sous « Déjà un compte ? ») : `Tu préfères lire d'abord ? L'étape 1 du parcours {P}, gratuite et sans compte`

## Points d'attention pour @fullstack

- Grep après branchement, aucune de ces chaînes ne doit rester dans `src/` : `si tu vois loin`, `Voir toutes les`, `Voir tous les`, `Débloquer`, `s'ouvrent ensuite`, `Essayer gratuitement l'étape 1 du parcours`.
- B13 et B14 : ne jamais présenter l'ouverture des étapes comme hebdomadaire. Avec Premium, tout est ouvert ; « une par semaine » est un rythme conseillé. Vérifier dans le code que rien ne verrouille réellement les étapes suivantes (décision du 07/10, D2).
- B13 : `{PROGRAMME}` se lit dans les données des parcours (`moduleTitle`), pas en dur.
- B11 : l'intro est composée (`{RAISON}` + deux phrases communes) ; le vote n'a pas de `{RAISON}`. La carte floutée a trois textes `[S27]` distincts.
- B18 : le libellé du bouton de formulaire reste « Envoie-moi la lettre ».
- B3 `[S20]` : 3 phrases courtes, en petit ; vérifier le rendu à 360 px.
- B7 `[S22]` : phrase entière, toujours lue après `[S21]`.
- B2 `[S8]` : le titre fait 52 caractères ; vérifier qu'il tient sur 2 lignes à 360 px.
