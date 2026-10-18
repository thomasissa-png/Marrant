# Textes finaux des 17 blocs d'appel (s21) : bloc → emplacement [Sn] → texte exact

> Pour @fullstack. Remplace `tour8/textes-finaux.md`. **Statut : à brancher seulement après la relecture à l'aveugle du tour 9** (règle d'or P0 s18 : rien ne se met en ligne sous la barre ; un bloc qui n'atteint pas 10 chez les trois repart en correction, pas en ligne). Six blocs sont validés et recopiés tels quels : B1, B6, B15, B17 (tour 6), B7 (tour 7) et B2 (tour 8). Les onze autres (B3, B4+B5, B8, B9, B10, B11, B12, B13, B14, B16, B18) sont la version du tour 9. Zéro tiret cadratin, UTF-8, espace insécable U+00A0 avant « € », « : », « ? » dans le rendu. Prix et gabarits : `docs/copy/cta-s21/tour5/annexe-pack12-tour5.md` §4 et `annexe-pack3-tour5.md`.

## Variables et lignes communes

- `{P}` = nom du parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot). `{N}` = nombre d'étapes (3, 4, 6, 6, 6). `{D}` = minutes par semaine (15, 20, 20, 20, 15). `{PARCOURS_COUNT}` = nombre de parcours publiés (5 aujourd'hui) ; `{AUTRES}` = `PARCOURS_COUNT - 1` (4). Source : `PREMIUM_PARCOURS` dans `apps/web/src/config/premium.ts`. Dans tous les textes ci-dessous, le « 5 » qui compte les parcours s'écrit `{PARCOURS_COUNT}` dans le code, et le « 4 » de « les 4 autres parcours » s'écrit `{AUTRES}` (B2 lien, B3 lien et `[S20]`, B4+B5 `[S11]` et bouton, B7, B8, B9, B10, B11, B12, B13, B14, B16 boutons). Les textes sont écrits avec les valeurs d'aujourd'hui pour être relus tels quels.
- `{TITRE1}` = titre de l'étape 1 de `{P}`, lu dans `moduleTitle` du premier module de `docs/content/parcours-*.json` (le texte suit la donnée) : Machine à Café « Des vannes courtes, faciles à ressortir » ; Répartie « Tes premières répliques » ; Confiance « Redécouvrir ce qui te fait rire » ; Storytelling « Ton anecdote, coupée au plus court » ; Boulot « La salle de réunion, sans un mot ».
- `{LIGNE_CARTE}` = la ligne de la carte du parcours, sans « Pour toi si » : Répartie « on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre » ; Machine à Café « tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force » ; Confiance « tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer » ; Storytelling « tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert » ; Boulot « tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu ». Source : les cartes des parcours (une seule source dans le code, pas de copie).
- **Libellé d'ouverture** `OUVRIR` = `Ouvrir les {PARCOURS_COUNT} parcours · 2,99 €/mois` (point médian U+00B7 entouré d'espaces). Même mot et même forme que le bouton générique de la page d'abonnement (B16). Repli si `PARCOURS_COUNT` vaut 1 ou 0 : `Ouvrir tous les parcours · 2,99 €/mois`. Le mot « Débloquer » ne doit plus apparaître dans aucun libellé d'appel.
- **LP-A** (ligne de prix avec annuel, seulement si l'offre annuelle est disponible) : `2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **LP-M** (repli sans annuel) : `2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **Contour** `[S25]` : `Étape 1 de {P}, gratuite : {CONTENU}` (par défaut Répartie ; sur une fiche, le parcours qui colle à la catégorie). `{CONTENU}` = `5 vannes et un défi` (liste /vannes, fiche vanne), `un conseil et un défi` (liste /conseils, fiche conseil), `2 vidéos et un défi` (liste /videos, fiche vidéo). Vrai pour l'étape 1 des 5 parcours (`docs/content/parcours-*.json`).
- **Rythme des étapes (fait à respecter dans tout le code et les textes)** : avec Premium, **toutes les étapes d'un parcours sont ouvertes d'un coup**. Une étape par semaine est un rythme conseillé, jamais un déblocage (décision du 07/10, audit s17, D2). Ne jamais écrire « s'ouvrent ensuite », « une par semaine » comme un calendrier d'ouverture. Quand le rythme est dit, il ne vient ni en fin de phrase ni comme une limite ; l'argument à mettre en avant est « les 5 parcours en entier ».

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

## B2 : bloc de fin d'article (VALIDÉ 10/10/10, inchangé)

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
| Sous-titre, ligne 1 | Une seule par mois, mais on t'explique pourquoi elle marche. Du genre de celle-ci : « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » |
| Sous-titre, ligne 2 | Tu reçois aussi une lecture à suivre et trois étapes pour fabriquer la tienne, exemple à l'appui. En fin de message, un mot sur Premium, notre abonnement. |
| Bouton du formulaire | Envoie-moi la lettre |
| Note | La lettre est gratuite, sans compte. Désinscription en un clic. |

La ligne repliée (inchangée) fait 51 caractères (2 lignes de 28 : OK) et le bouton 19 (moins de 20 : OK). La vanne de la ligne 1 vient de la donnée (dernière vanne déjà envoyée ; avant le premier envoi du 05/11/2026, la vanne ci-dessus). Si Thomas ne veut pas montrer d'extrait avant l'envoi : la ligne 1 devient `Une seule par mois, mais on t'explique pourquoi elle marche.` et la ligne 2 reste inchangée. L'ordre des éléments de la ligne 2 (lecture, exercice, puis Premium) n'a pas à suivre l'ordre du message : seule la mention de Premium doit rester dite en fin de message, ce qui est vrai.

## B3 : haut de l'accueil

| Emplacement | Texte exact |
|---|---|
| `[S19]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| `[S20]` | C'est l'étape 1 du parcours Répartie, pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre. Elle se lit sans compte : un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. Premium, l'abonnement du site, ouvre Répartie en entier et les 4 autres parcours, résiliable en ligne quand tu veux. |

`[S20]` : « Répartie » (`{P}`), la ligne de carte (`{LIGNE_CARTE}`) et « 4 » (`{AUTRES}`) suivent le parcours du bouton (le « 5 vannes » est le format de l'étape, pas un nombre de parcours). La phrase « un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz » est le format de l'étape 1 des 5 parcours. Le titre d'accueil « On va arranger ça » n'est pas touché. Plus de durée ni de remboursement dans `[S20]` (le remboursement est dit dans B4+B5 `[S13]` et sur la page d'abonnement).

## B4 + B5 : carte Premium d'accueil

| Emplacement | Texte exact |
|---|---|
| `[S10]` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? |
| `[S11]` | La table qui rit, et c'est ta réplique qui l'a lancée. Choisis par où tu commences, les 5 parcours sont compris. Répartie, pour répondre quand on te chambre. Machine à Café, pour faire rire à la pause sans devenir le collègue qui force. Boulot, pour le lundi à 9 h, sans le ton de compte rendu. Confiance, pour retrouver ta légèreté. Storytelling, pour que ta chute arrive avant le dessert. Une fois abonné, tout est ouvert d'un coup : 15 à 20 minutes par étape, avec un défi à tenter, dans la vie ou à l'écrit. |
| En-tête de carte | Premium · 2,99 €/mois |
| `[S12]` | Ou 24,99 €/an (2,08 €/mois, 10,89 € économisés). Prix TTC. |
| `[S12]` si le plan annuel n'est pas proposé | Prix TTC. |
| Bouton plein | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| Bouton contour | Tester mes premières répliques, gratuit |
| `[S13]` | Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. |
| Dernière ligne | Déjà 1 500+ inscrits, et toi ? |
| 4 avantages | inchangés (textes du site) |

`[S11]` : le « 5 » de « les 5 parcours sont compris » est `{PARCOURS_COUNT}`. Une phrase courte par parcours publié (`PREMIUM_PARCOURS`), dans cet ordre : Répartie, Machine à Café, Boulot, Confiance, Storytelling. Si un parcours est dépublié, sa phrase disparaît. La durée finale (« 15 à 20 minutes par étape ») suit le min et le max de `{D}`.

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
| `[S15]` | La mécanique, tu l'as. Reste à écrire ta version, celle que tu auras envie de sortir à la prochaine soirée. L'exercice « À toi de jouer » te donne la consigne et un exemple pour l'écrire avec la même technique. Il est dans Premium, qui ouvre aussi les 5 parcours en entier. |
| Bouton plein | Écrire la mienne avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Étape 1 de {P}, gratuite : 5 vannes et un défi |
| Lien discret | Voir d'autres vannes |

## B9 : fiche d'un conseil

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Essaie-le avant le soir où il te servira |
| `[S15]` | Le conseil, tu l'as lu. Reste à l'essayer, tranquillement : l'exercice « À toi de jouer » te donne une consigne pour t'y mettre et un exemple à réutiliser le soir venu. Il est dans Premium, qui ouvre aussi les 5 parcours en entier. |
| Bouton plein | Essayer ce conseil avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Étape 1 de {P}, gratuite : un conseil et un défi |
| Lien discret | Voir d'autres conseils |

## B10 : fiche d'une vidéo

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Faire rire une salle, c'est son métier. Toi, une table te suffit |
| `[S15]` | Et ça s'entraîne, à petite dose. Les points clés de cette vidéo et son exercice sont dans Premium : de quoi la revoir pour faire rire, plus seulement pour rire. Premium ouvre aussi les 5 parcours en entier, de 15 à 20 minutes par étape, avec un défi à chaque fois. |
| Bouton plein | Décrypter cette vidéo avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Étape 1 de {P}, gratuite : 2 vidéos et un défi |
| Lien discret | Voir d'autres vidéos |

Ne rien ajouter sur le contenu de l'analyse (aucun extrait n'est connu). `[S14]` et `[S15]` se lisent d'un trait (« …une table te suffit. Et ça s'entraîne, à petite dose. »). « 15 à 20 minutes » suit le min et le max de `{D}`.

## B11 : fenêtre Premium (par geste)

Communs à tous les gestes : ligne de prix `2,99 € TTC / mois` ; ligne de garantie finale inchangée ; lien `[S28]` : `Ou lire d'abord l'étape 1 du parcours {P} (gratuite, sans compte)`. Ordre d'affichage : titre, intro, prix, `[S27]`, bouton, `[S28]`, garantie. Intro = `{RAISON}` + `S'abonner, c'est deux étapes : ton compte, puis le paiement sécurisé. Si tu fermes cette fenêtre, ta page reste là.` (`{RAISON}` ci-dessous ; vide pour le vote, dont le titre dit déjà la raison). Chaque `[S27]` fait 100 caractères au plus (2 lignes à 375 px) : ne pas rallonger.

| Geste | Titre | `{RAISON}` (début de l'intro) | `[S27]` | Bouton plein |
|---|---|---|---|---|
| Favori, vanne | Garde-la pour le soir où tu en auras besoin | Les favoris font partie de Premium. | Avec Premium : tes favoris prêts pour le bon moment, et les 5 parcours en entier. | Je m'abonne et je la garde |
| Favori, conseil | Garde-le pour le soir où tu en auras besoin | idem | idem | Je m'abonne et je le garde |
| Favori, vidéo | Garde-la sous le coude | idem | idem | Je m'abonne et je la garde |
| Vote | Pour voter, il ne te manque que Premium | (aucune) | Avec Premium : ton vote, tes favoris et les 5 parcours en entier. | Je m'abonne et je vote |
| Carte floutée, /vannes | Le reste de la liste est juste derrière | La suite de la liste fait partie de Premium. | Avec Premium : toute la liste, un exercice par vanne, le filtre par catégorie et les 5 parcours. | Je m'abonne et j'ouvre toute la liste |
| Carte floutée, /conseils | Le reste de la liste est juste derrière | idem | Avec Premium : toute la liste, un exercice par conseil, les filtres et les 5 parcours. | Je m'abonne et j'ouvre toute la liste |
| Carte floutée, /videos | Le reste de la liste est juste derrière | idem | Avec Premium : toute la liste, points clés et exercice par vidéo, les filtres et les 5 parcours. | Je m'abonne et j'ouvre toute la liste |

Le titre « soir » n'existe que pour la vanne et le conseil ; la vidéo n'en parle jamais. Le bouton du favori suit le genre du titre (« la » pour la vanne et la vidéo, « le » pour le conseil). Intro complète d'un favori, par exemple : `Les favoris font partie de Premium. S'abonner, c'est deux étapes : ton compte, puis le paiement sécurisé. Si tu fermes cette fenêtre, ta page reste là.`

## B12 : résultat du quiz d'humour (parcours conseillé = `{P}`)

| Emplacement | Texte exact |
|---|---|
| Phrase | Ta force, tu viens de la lire. Reste à t'en servir : l'étape 1 de {P}, « {TITRE1} », se lit tout de suite, sans compte. Dedans, un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. Le parcours compte {N} étapes de {D} minutes, toutes ouvertes d'un coup avec Premium. |
| Bouton plein | Commencer mon parcours {P}, étape 1 gratuite |
| Lien (ouvre la page d'abonnement) | Ouvrir {P} en entier · 2,99 €/mois |
| Ligne Premium, avec annuel | Premium : {P} en entier et les {AUTRES} autres parcours, pour 2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement. |
| Ligne Premium, repli sans annuel | Premium : {P} en entier et les {AUTRES} autres parcours, pour 2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement. |

Exemple (Confiance) : « Ta force, tu viens de la lire. Reste à t'en servir : l'étape 1 de Confiance, « Redécouvrir ce qui te fait rire », se lit tout de suite, sans compte. Dedans, un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. Le parcours compte 6 étapes de 20 minutes, toutes ouvertes d'un coup avec Premium. » Bouton : « Commencer mon parcours Confiance, étape 1 gratuite ». Lien : « Ouvrir Confiance en entier · 2,99 €/mois ». Le bouton de B15 (« Commencer {P}, étape 1 gratuite ») reste différent et inchangé. Machine à Café : « 3 étapes de 15 minutes ». Le lien ouvre la page d'abonnement (comme avant) et ramène ensuite sur ce parcours ; son libellé suit le prix mensuel (le choix mensuel/annuel se fait sur la page).

## B13 : quiz d'orientation, membre sans abonnement (par parcours)

Bouton : `Suivre {P} en entier · 2,99 €/mois`. Ligne de garantie : `Prix TTC, paiement sécurisé par Stripe. Tu résilies en ligne quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.` Gabarit : `Ton quiz te conseille {P}, le parcours pour toi si {LIGNE_CARTE}. Au programme après l'étape 1, offerte{ENTRE_AUTRES} : {PROGRAMME}. Avec Premium, les étapes 2 à {N} sont ouvertes tout de suite ({D} minutes chacune, et on te conseille une par semaine), et pour 2,99 € par mois tu ouvres les {PARCOURS_COUNT} parcours, pas seulement {P}. Ton compte est prêt : il ne reste que le paiement.` (« les étapes 2 et 3 » pour Machine à Café.) `{LIGNE_CARTE}` : voir plus haut, en entier. `{PROGRAMME}` = titres d'étapes lus dans `moduleTitle` des fichiers `docs/content/parcours-*.json` (première lettre en minuscule), jusqu'à 3 ; `{ENTRE_AUTRES}` = `, entre autres` quand le parcours a plus d'étapes que de titres cités. Pas d'annuel dans B13 (le bouton ouvre directement un paiement dont la formule n'est pas choisie). Le mot « rythme » n'est volontairement pas utilisé hors des titres d'étapes (« le rythme et les silences »).

| Parcours | Texte exact avant le bouton |
|---|---|
| Répartie | Ton quiz te conseille Répartie, le parcours pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre. Au programme après l'étape 1, offerte : le rythme et les silences, retourner les piques avec le sourire, improviser sur l'inattendu. Avec Premium, les étapes 2 à 4 sont ouvertes tout de suite (20 minutes chacune, et on te conseille une par semaine), et pour 2,99 € par mois tu ouvres les 5 parcours, pas seulement Répartie. Ton compte est prêt : il ne reste que le paiement. |
| Machine à Café | Ton quiz te conseille Machine à Café, le parcours pour toi si tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force. Au programme après l'étape 1, offerte : sentir le bon moment, raconter une anecdote qu'on écoute jusqu'au bout. Avec Premium, les étapes 2 et 3 sont ouvertes tout de suite (15 minutes chacune, et on te conseille une par semaine), et pour 2,99 € par mois tu ouvres les 5 parcours, pas seulement Machine à Café. Ton compte est prêt : il ne reste que le paiement. |
| Confiance | Ton quiz te conseille Confiance, le parcours pour toi si tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer. Au programme après l'étape 1, offerte, entre autres : rire de toi sans te rabaisser, l'œil de l'observateur, être à l'aise en groupe. Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite (20 minutes chacune, et on te conseille une par semaine), et pour 2,99 € par mois tu ouvres les 5 parcours, pas seulement Confiance. Ton compte est prêt : il ne reste que le paiement. |
| Storytelling | Ton quiz te conseille Storytelling, le parcours pour toi si tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert. Au programme après l'étape 1, offerte, entre autres : des personnages qu'on entend, une chute qui se lit de deux façons, un détour qui ne perd personne. Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite (20 minutes chacune, et on te conseille une par semaine), et pour 2,99 € par mois tu ouvres les 5 parcours, pas seulement Storytelling. Ton compte est prêt : il ne reste que le paiement. |
| Boulot | Ton quiz te conseille Boulot, le parcours pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu. Au programme après l'étape 1, offerte, entre autres : un PS drôle sans finir en capture d'écran, le couloir en quinze secondes, un toast de soixante secondes. Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite (15 minutes chacune, et on te conseille une par semaine), et pour 2,99 € par mois tu ouvres les 5 parcours, pas seulement Boulot. Ton compte est prêt : il ne reste que le paiement. |

Seuls Répartie et Storytelling sont montrés aux relecteurs ; les trois autres suivent le même gabarit. Les titres d'étapes cités (Machine à Café, Confiance, Boulot) sont ceux de `parcours-reecriture-s17.json` et `parcours-boulot-s19.json` ; pour Boulot, « Le couloir : quinze secondes » devient « le couloir en quinze secondes » et « Un toast de soixante secondes, une seule vanne » est abrégé. Si les titres changent dans la donnée, le texte suit la donnée.

## B14 : fin de l'étape 1 et carte « Étape 2 » (par parcours)

- `[S17]`, titre de l'étape, `[S18]` : données publiques du parcours, inchangées.
- Phrase de suite et de validation (sans nombre d'étapes ni durée) : `Bien joué pour l'étape 1. Avec Premium, tu la valides et tu enchaînes : l'étape 2 est ouverte tout de suite, les suivantes aussi. Le rythme conseillé : une par semaine, mais rien ne t'y oblige. Le même abonnement ouvre aussi les {AUTRES} autres parcours en entier.`
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

| Parcours d'origine | Surtitre | Titre | Bouton plein (mensuel ; annuel) |
|---|---|---|---|
| Adresse directe, tout parcours sans texte propre (`[S33a]`) | Pour toi si tu trouves la bonne réponse, mais avec un temps de retard | Ta réplique pendant la soirée, pas dans le bus du retour | `OUVRIR` : Ouvrir les 5 parcours · 2,99 €/mois ; Ouvrir les 5 parcours · 24,99 €/an |
| Répartie (`[S33a]`) | idem | idem | Ouvrir Répartie et les 4 autres · 2,99 €/mois ; … · 24,99 €/an |
| Machine à Café et Boulot (`[S33b]`) | Pour toi si tu veux faire rire au boulot, sans devenir le collègue qui force | Ta réplique pendant la réunion, pas dans l'ascenseur d'après | Ouvrir {P} et les 4 autres · 2,99 €/mois ; … · 24,99 €/an |
| Confiance (`[S33c]`) | Pour toi si tu sors d'une période compliquée et que le rire te manque | Retrouver le rire à table, 20 minutes par semaine, sans te forcer | Ouvrir Confiance et les 4 autres · 2,99 €/mois ; … · 24,99 €/an |
| Storytelling (`[S33d]`) | Pour toi si ta chute arrive quand tout le monde est passé au dessert | Ton histoire jusqu'à la chute, avant qu'on te dise « et donc ? » | Ouvrir Storytelling et les 4 autres · 2,99 €/mois ; … · 24,99 €/an |

- Bouton plein : le libellé suit le sélecteur mensuel/annuel sans rechargement (mensuel par défaut si l'annuel n'est pas disponible). **À mesurer à 375 px avant branchement** : « Ouvrir Machine à Café et les 4 autres · 2,99 €/mois » fait 51 caractères et passera sur deux lignes dans un bouton pleine largeur ; si le design n'accepte pas deux lignes, repli sur le libellé générique `OUVRIR` pour ce parcours (jamais de coupe en milieu de mot).
- `[S32]` : `Deux étapes : ton compte, puis le paiement sécurisé par Stripe.`
- Sous-titre et carte : inchangés. Le titre Confiance dit « 20 minutes par semaine » : à suivre `{D}` de Confiance si la durée change. Aucune formule de rythme libre (« à ton rythme ») ne doit apparaître nulle part.

## B17 : création de compte (VALIDÉ 10/10/10, texte tel quel)

- `[S34]` (libellé du champ prénom) : `Prénom (facultatif, pour te saluer dans nos e-mails)`
- `[S36]` (bouton plein) : `Créer mon compte et passer au paiement`
- `[S35]` (lien sous « Déjà un compte ? ») : `Tu préfères lire d'abord ? L'étape 1 du parcours {P}, gratuite et sans compte`

## Points d'attention pour @fullstack

- Grep après branchement, aucune de ces chaînes ne doit rester dans `src/` : `si tu vois loin`, `Voir toutes les`, `Voir tous les`, `Débloquer`, `s'ouvrent ensuite`, `Essayer gratuitement l'étape 1 du parcours`, `Choisis ton parcours`, `Voir les 5 parcours en entier avec Premium`, `Je m'abonne et je garde mes favoris`, `Voter sur les nouveautés, c'est dans Premium`, `démontée, comme celle-ci`, `au rythme conseillé d'une par semaine`, `Retrouver ta légèreté, 20 minutes`, `Dedans : un conseil`.
- B13 et B14 : ne jamais présenter l'ouverture des étapes comme hebdomadaire. Avec Premium, tout est ouvert ; « une par semaine » est un rythme conseillé. Vérifier dans le code que rien ne verrouille réellement les étapes suivantes (décision du 07/10, D2).
- B13 : `{PROGRAMME}` se lit dans les données des parcours (`moduleTitle`), pas en dur. B12 : `{TITRE1}` aussi.
- B11 : l'intro est composée (`{RAISON}` + deux phrases communes) ; le vote n'a pas de `{RAISON}`. La carte floutée a trois textes `[S27]` distincts. Le bouton du favori suit le genre du titre. Vérifier à 375 px que chaque `[S27]` tient sur 2 lignes.
- B18 : le libellé du bouton de formulaire reste « Envoie-moi la lettre ».
- B3 `[S20]` : 3 phrases, en petit ; vérifier le rendu à 360 px (plus long qu'avant : il passe par la ligne de carte du parcours).
- B7 `[S22]` : phrase entière, toujours lue après `[S21]`.
- B2 `[S8]` : le titre fait 52 caractères ; vérifier qu'il tient sur 2 lignes à 360 px.
- B16 : le bouton nomme le parcours d'origine ; vérifier la largeur à 375 px (voir plus haut).

