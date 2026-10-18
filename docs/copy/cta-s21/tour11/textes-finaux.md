# Textes finaux des 17 blocs d'appel (s21) : bloc → emplacement [Sn] → texte exact

> Pour @fullstack. Remplace `tour10/textes-finaux.md`. **Statut : à brancher seulement après la relecture à l'aveugle du tour 11** (règle d'or P0 s18 : rien ne se met en ligne sous la barre ; un bloc qui n'atteint pas 10 chez les trois repart en correction, pas en ligne). Huit blocs sont validés et recopiés tels quels depuis `tour10/textes-finaux.md` : B1, B2, B6, B7, B14, B15, B16, B17. Les neuf autres (B3, B4+B5, B8, B9, B10, B11, B12, B13, B18) sont la version du tour 11 (B3 est identique à celle du tour 10). Zéro tiret cadratin, UTF-8, espace insécable U+00A0 avant « € », « : », « ? » dans le rendu. Prix et gabarits : `docs/copy/cta-s21/tour5/annexe-pack12-tour5.md` §4 et `annexe-pack3-tour5.md`.

## Variables et lignes communes

- `{P}` = nom du parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot). `{N}` = nombre d'étapes (3, 4, 6, 6, 6). `{D}` = minutes par semaine (15, 20, 20, 20, 15). `{PARCOURS_COUNT}` = nombre de parcours publiés (5 aujourd'hui) ; `{AUTRES}` = `PARCOURS_COUNT - 1` (4). Source : `PREMIUM_PARCOURS` dans `apps/web/src/config/premium.ts`. Dans tous les textes ci-dessous, le « 5 » qui compte les parcours s'écrit `{PARCOURS_COUNT}` dans le code, et le « 4 » de « les 4 autres parcours » s'écrit `{AUTRES}` (B2 lien, B7, B12 ligne Premium, B14, B16 boutons). B3 `[S20]` n'utilise pas `{AUTRES}`. Les textes sont écrits avec les valeurs d'aujourd'hui pour être relus tels quels.
- `{TITRE1}` = titre de l'étape 1 de `{P}`, lu dans `moduleTitle` du premier module de `docs/content/parcours-*.json` (le texte suit la donnée) : Machine à Café « Des vannes courtes, faciles à ressortir » ; Répartie « Tes premières répliques » ; Confiance « Redécouvrir ce qui te fait rire » ; Storytelling « Ton anecdote, coupée au plus court » ; Boulot « La salle de réunion, sans un mot ».
- `{TITRE2}` (nouveau, B12 seulement) = titre de l'étape 2 de `{P}`, lu dans `moduleTitle` du deuxième module, de la même façon : Machine à Café « Sentir le bon moment » ; Répartie « Le rythme et les silences » ; Confiance « Rire de toi sans te rabaisser » ; Storytelling « Des personnages qu'on entend » ; Boulot « Un PS drôle, sans finir en capture d'écran ». Cité entre guillemets français, tel quel dans la donnée.
- `{LIGNE_CARTE}` = la ligne de la carte du parcours, sans « Pour toi si » : Répartie « on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre » ; Machine à Café « tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force » ; Confiance « tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer » ; Storytelling « tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert » ; Boulot « tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu ». Source : les cartes des parcours (une seule source dans le code, pas de copie). Utilisée par B13 seulement.
- **Libellé d'ouverture** `OUVRIR` = `Ouvrir les {PARCOURS_COUNT} parcours · 2,99 €/mois` (point médian U+00B7 entouré d'espaces). Même mot et même forme que le bouton générique de la page d'abonnement (B16). Repli si `PARCOURS_COUNT` vaut 1 ou 0 : `Ouvrir tous les parcours · 2,99 €/mois`. Le mot « Débloquer » ne doit plus apparaître dans aucun libellé d'appel.
- **LP-A** (ligne de prix avec annuel, seulement si l'offre annuelle est disponible) : `2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **LP-M** (repli sans annuel) : `2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **Contour `[S25]`, deux gabarits qui coexistent** : (a) B7, validé et inchangé : `Étape 1 de {P}, gratuite : {CONTENU}` avec `{CONTENU}` = `5 vannes et un défi` (/vannes), `un conseil et un défi` (/conseils), `2 vidéos et un défi` (/videos). (b) B8, B9, B10 : `Gratuit : {CONTENU}, étape 1 de {P}` avec `{CONTENU}` = `5 vannes et un défi` (fiche vanne), `un défi à tenter et 5 vannes` (fiche conseil), `2 vidéos et un défi` (fiche vidéo). Par défaut `{P}` = Répartie ; sur une fiche, le parcours qui colle à la catégorie. Vrai pour l'étape 1 des 5 parcours (`docs/content/parcours-*.json`).
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
| Formulaire complet, titre | La vanne du mois, et la méthode pour écrire la tienne |
| Sous-titre, ligne 1 | « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » Voilà le genre de vanne que tu reçois chaque mois, avec ce qui la fait marcher. |
| Sous-titre, ligne 2 | Et surtout trois étapes pour fabriquer la tienne, avec un exemple. |
| Bouton du formulaire | Envoie-moi la lettre |
| Note | La lettre est gratuite, sans compte. En fin de message, une lecture à suivre et un mot sur Premium, notre abonnement. Désinscription en un clic. |

La ligne repliée (inchangée) fait 51 caractères (2 lignes de 28 : OK) et le bouton 19 (moins de 20 : OK). La vanne de la ligne 1 vient de la donnée (dernière vanne déjà envoyée ; avant le premier envoi du 05/11/2026, la vanne ci-dessus). Si Thomas ne veut pas montrer d'extrait avant l'envoi : la ligne 1 devient `Chaque mois, une vanne avec ce qui la fait marcher.` et la ligne 2 reste inchangée. La mention de Premium est descendue dans la note de réassurance, à côté de la désinscription : le corps du texte finit sur la méthode, pas sur l'abonnement. « En fin de message » situe la mention de Premium dans le message reçu (vrai : lecture à suivre, puis mention de Premium).

## B3 : haut de l'accueil

| Emplacement | Texte exact |
|---|---|
| `[S19]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| `[S20]` | Étape 1 du parcours Répartie, sans compte : conseil, défi, 5 vannes, 2 vidéos, quiz. La suite, c'est Premium, un abonnement résiliable en ligne quand tu veux. |

`[S20]` fait 159 caractères pour Répartie : **limite dure 159, ne pas rallonger**. « Répartie » (`{P}`) suit le parcours du bouton ; si `{P}` rend la note plus longue que 159 caractères (Machine à Café : 165, Storytelling : 163, Confiance : 160), utiliser `Étape 1 de {P}, sans compte : …` (retire « du parcours », 9 caractères de moins). La liste « conseil, défi, 5 vannes, 2 vidéos, quiz » est le format de l'étape 1 des 5 parcours. Le titre d'accueil « On va arranger ça » n'est pas touché. Pas de durée ni de remboursement dans `[S20]` (dits dans B4+B5 `[S13]` et sur la page d'abonnement). Le lien explicite avec « les 4 autres parcours » a été essayé et ne tient pas sous 160 caractères sans perdre « du parcours », « en ligne » ou « abonnement » : texte laissé tel quel.

## B4 + B5 : carte Premium d'accueil

| Emplacement | Texte exact |
|---|---|
| `[S10]` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? |
| `[S11]`, paragraphe 1 | La table qui rit, et c'est ta réplique qui l'a lancée. |
| `[S11]`, paragraphe 2 (intro) | Un seul prix ouvre les 5 parcours. Tu commences par celui qui te ressemble : |
| `[S11]`, liste (un parcours par ligne) | Répartie pour répondre quand on te chambre / Machine à Café pour faire rire à la pause sans forcer / Boulot pour le lundi à 9 h sans le ton de compte rendu / Confiance pour retrouver ta légèreté / Storytelling pour que ta chute arrive avant le dessert |
| `[S11]`, paragraphe 3 | Une fois abonné, tout est ouvert d'un coup : 15 à 20 minutes par étape, avec un défi à tenter, dans la vie ou à l'écrit. |
| En-tête de carte | Premium · 2,99 €/mois |
| `[S12]` | Ou 24,99 €/an (2,08 €/mois, 10,89 € économisés). Prix TTC. |
| `[S12]` si le plan annuel n'est pas proposé | Prix TTC. |
| Bouton plein | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| Bouton contour | Tester mes premières répliques, gratuit |
| `[S13]` | Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. |
| Dernière ligne | Déjà 1 500+ inscrits, et toi ? |
| 4 avantages | inchangés (textes du site) |

`[S11]` s'affiche en **trois blocs** : un paragraphe, puis un paragraphe d'intro suivi d'une **vraie liste** (`<ul>`, un `<li>` par parcours, sans puce décorative imposée, mots identiques à l'ancienne phrase), puis un paragraphe. Le « 5 » de « Un seul prix ouvre les 5 parcours » est `{PARCOURS_COUNT}`. Une ligne par parcours publié (`PREMIUM_PARCOURS`), dans cet ordre : Répartie, Machine à Café, Boulot, Confiance, Storytelling. Si un parcours est dépublié, sa ligne disparaît. La durée finale (« 15 à 20 minutes par étape ») suit le min et le max de `{D}`. Le mot « Premium » n'est pas dans `[S11]` : il est dans l'en-tête de carte juste dessous.

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
| `[S15]` | La mécanique, tu l'as. Reste à écrire ta version, celle que tu auras envie de sortir à la prochaine soirée. L'exercice « À toi de jouer » t'y aide : une consigne, un exemple, la même technique que cette vanne. Cet exercice est dans Premium, l'abonnement du site, avec tes favoris (pour garder cette vanne) et les 5 parcours en entier. |
| Bouton plein | Écrire la mienne avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Gratuit : 5 vannes et un défi, étape 1 de {P} |
| Lien discret | Voir d'autres vannes |

« Cet exercice » (et non « Il ») est voulu : la phrase d'avant finit sur « cette vanne », le pronom serait ambigu. Les favoris des vannes font partie de Premium (vrai).

## B9 : fiche d'un conseil

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Essaie-le avant le soir où il te servira |
| `[S15]` | Ce conseil se teste mieux ici qu'en direct : l'exercice « À toi de jouer » est l'endroit où rater ne coûte rien. Une consigne pour démarrer, un exemple à réutiliser le moment venu : c'est dans Premium, l'abonnement qui ouvre aussi les 5 parcours en entier. |
| Bouton plein | Essayer ce conseil avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Gratuit : un défi à tenter et 5 vannes, étape 1 de {P} |
| Lien discret | Voir d'autres conseils |

## B10 : fiche d'une vidéo

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Faire rire une salle, c'est son métier. Toi, une table te suffit |
| `[S15]` | Et ça s'entraîne, à petite dose. Les points clés de cette vidéo et son exercice sont dans Premium, l'abonnement : de quoi la revoir pour faire rire, plus seulement pour rire. Premium ouvre aussi les 5 parcours en entier, de 15 à 20 minutes par étape, avec un défi à chaque fois. |
| Bouton plein | Décrypter cette vidéo avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Gratuit : 2 vidéos et un défi, étape 1 de {P} |
| Lien discret | Voir d'autres vidéos |

Ne rien ajouter sur le contenu de l'analyse (aucun extrait n'est connu). `[S14]` et `[S15]` se lisent d'un trait (« …une table te suffit. Et ça s'entraîne, à petite dose. »). « 15 à 20 minutes » suit le min et le max de `{D}`. B8, B9, B10 : `[S15]` relie une fois « Premium » et « l'abonnement » (le visiteur arrivé d'un moteur de recherche comprend que le bouton et le texte parlent de la même chose) ; le prix vient juste après dans `[S16]`.

## B11 : fenêtre Premium (par geste)

Communs à tous les gestes : ligne de prix `2,99 € TTC / mois` ; ligne de garantie finale inchangée ; lien `[S28]` : `Ou lire d'abord l'étape 1 du parcours {P} (gratuite, sans compte)`. Ordre d'affichage : titre, intro, prix, `[S27]`, bouton, `[S28]`, garantie. Intro = `Deux étapes : ton compte, puis le paiement sécurisé. Et si tu fermes, {OBJET} reste là.` Chaque `[S27]` fait **90 caractères au plus** (2 lignes à 375 px) : ne pas rallonger.

| Geste | Titre | `{OBJET}` | `[S27]` | Bouton plein |
|---|---|---|---|---|
| Favori, vanne | Garde-la pour le soir où tu en auras besoin | la vanne | Avec Premium : tes favoris, l'exercice de chaque fiche et les 5 parcours en entier. | Je m'abonne et je la garde |
| Favori, conseil | Garde-le pour le soir où tu en auras besoin | le conseil | idem | Je m'abonne et je le garde |
| Favori, vidéo | Garde-la sous le coude | la vidéo | idem | Je m'abonne et je la garde |
| Vote | Pour voter, il ne te manque que Premium | la page | Avec Premium : ton vote, tes favoris et les 5 parcours en entier. | Je m'abonne et je vote |
| Carte floutée, /vannes | Le reste de la liste est juste derrière | la liste | Avec Premium : toute la liste, un exercice par vanne, le filtre et les 5 parcours. | Je m'abonne et j'ouvre toute la liste |
| Carte floutée, /conseils | Le reste de la liste est juste derrière | la liste | Avec Premium : toute la liste, un exercice par conseil, les filtres et les 5 parcours. | Je m'abonne et j'ouvre toute la liste |
| Carte floutée, /videos | Le reste de la liste est juste derrière | la liste | Avec Premium : toute la liste, points clés et exercice par vidéo, et les 5 parcours. | Je m'abonne et j'ouvre toute la liste |

Le titre « soir » n'existe que pour la vanne et le conseil ; la vidéo n'en parle jamais. Le bouton du favori suit le genre du titre (« la » pour la vanne et la vidéo, « le » pour le conseil). Intro complète d'un favori, par exemple : `Deux étapes : ton compte, puis le paiement sécurisé. Et si tu fermes, la vanne reste là.` Tous les `[S27]` suivent maintenant le moule « Avec Premium : … » (le vote aussi). Dans le geste vote, « Premium » est dit deux fois (titre, `[S27]`) : voulu, c'est le seul geste dont le titre le nomme. Longueurs des `[S27]` : 83 (favoris), 65 (vote), 82 (/vannes), 86 (/conseils), 84 (/videos).

## B12 : résultat du quiz d'humour (parcours conseillé = `{P}`)

| Emplacement | Texte exact |
|---|---|
| Phrase | Ta force, tu viens de la lire. Reste à t'en servir : l'étape 1 de {P}, « {TITRE1} », se lit tout de suite, sans compte. Dedans, un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. |
| Bouton plein | Commencer mon parcours {P}, étape 1 gratuite |
| Lien (ouvre la page d'abonnement) | Ouvrir {P} en entier · 2,99 €/mois |
| Ligne Premium, avec annuel | Premium ouvre d'un coup les {N} étapes de {P} ({D} minutes chacune), dont « {TITRE2} », et les {AUTRES} autres parcours : 2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement. |
| Ligne Premium, repli sans annuel | Premium ouvre d'un coup les {N} étapes de {P} ({D} minutes chacune), dont « {TITRE2} », et les {AUTRES} autres parcours : 2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement. |

Exemple (Confiance) : « Ta force, tu viens de la lire. Reste à t'en servir : l'étape 1 de Confiance, « Redécouvrir ce qui te fait rire », se lit tout de suite, sans compte. Dedans, un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. » Bouton : « Commencer mon parcours Confiance, étape 1 gratuite ». Lien : « Ouvrir Confiance en entier · 2,99 €/mois » (point médian U+00B7 entouré d'espaces, comme `OUVRIR`). Ligne : « Premium ouvre d'un coup les 6 étapes de Confiance (20 minutes chacune), dont « Rire de toi sans te rabaisser », et les 4 autres parcours : 2,99 € TTC par mois, … ». Machine à Café : « les 3 étapes de Machine à Café (15 minutes chacune), dont « Sentir le bon moment », et les 4 autres parcours ». Le lien annonce le prix parce qu'il mène à la page d'abonnement ; le bouton de B15 (« Commencer {P}, étape 1 gratuite ») reste différent et inchangé. Le lien ouvre la page d'abonnement et ramène ensuite sur ce parcours. Si la clause « dont … » devait alourdir la ligne à 375 px, la retirer seule suffit (le reste de la ligne ne dépend pas d'elle).

## B13 : quiz d'orientation, membre sans abonnement (par parcours)

Bouton : `Suivre {P} en entier · 2,99 €/mois`. Ligne de garantie : `Prix TTC, paiement sécurisé par Stripe. Tu résilies en ligne quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.` Gabarit, **trois paragraphes courts** (trois `<p>`), le dernier seul juste avant le bouton :

1. `Ton quiz te conseille {P} : pour toi si {LIGNE_CARTE}. L'étape 1 est offerte. {ENSUITE} : {PROGRAMME}.`
2. `Avec Premium, les étapes 2 à {N} sont ouvertes tout de suite, {D} minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les {PARCOURS_COUNT} parcours, pas seulement {P}.`
3. `Ton compte est prêt : il ne reste que le paiement.`

(« les étapes 2 et 3 » pour Machine à Café.) `{PROGRAMME}` = titres d'étapes lus dans `moduleTitle` des fichiers `docs/content/parcours-*.json` (première lettre en minuscule), jusqu'à 3. `{ENSUITE}` = `Ensuite` quand tous les titres des étapes 2 et suivantes sont cités (Répartie, Machine à Café), `Ensuite, entre autres` sinon. Pas d'annuel dans B13 (le bouton ouvre directement un paiement dont la formule n'est pas choisie). « Conseille » n'apparaît qu'une fois (paragraphe 1) ; le rythme se dit « idéalement une par semaine », entre parenthèses, jamais comme un calendrier d'ouverture. « Premium » n'est dit qu'une fois (paragraphe 2). Le mot « rythme » n'est volontairement pas utilisé hors des titres d'étapes (« le rythme et les silences »).

**Répartie**
> Ton quiz te conseille Répartie : pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre. L'étape 1 est offerte. Ensuite : le rythme et les silences, retourner les piques avec le sourire, improviser sur l'inattendu.
>
> Avec Premium, les étapes 2 à 4 sont ouvertes tout de suite, 20 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Répartie.
>
> Ton compte est prêt : il ne reste que le paiement.

**Machine à Café**
> Ton quiz te conseille Machine à Café : pour toi si tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force. L'étape 1 est offerte. Ensuite : sentir le bon moment, raconter une anecdote qu'on écoute jusqu'au bout.
>
> Avec Premium, les étapes 2 et 3 sont ouvertes tout de suite, 15 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Machine à Café.
>
> Ton compte est prêt : il ne reste que le paiement.

**Confiance**
> Ton quiz te conseille Confiance : pour toi si tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer. L'étape 1 est offerte. Ensuite, entre autres : rire de toi sans te rabaisser, l'œil de l'observateur, être à l'aise en groupe.
>
> Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite, 20 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Confiance.
>
> Ton compte est prêt : il ne reste que le paiement.

**Storytelling**
> Ton quiz te conseille Storytelling : pour toi si tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert. L'étape 1 est offerte. Ensuite, entre autres : des personnages qu'on entend, une chute qui se lit de deux façons, un détour qui ne perd personne.
>
> Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite, 20 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Storytelling.
>
> Ton compte est prêt : il ne reste que le paiement.

**Boulot**
> Ton quiz te conseille Boulot : pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu. L'étape 1 est offerte. Ensuite, entre autres : un PS drôle sans finir en capture d'écran, le couloir en quinze secondes, un toast de soixante secondes.
>
> Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite, 15 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Boulot.
>
> Ton compte est prêt : il ne reste que le paiement.

Seuls Répartie et Storytelling sont montrés aux relecteurs ; les trois autres suivent le même gabarit. Les titres d'étapes cités (Machine à Café, Confiance, Boulot) sont ceux de `parcours-reecriture-s17.json` et `parcours-boulot-s19.json` ; pour Boulot, « Le couloir : quinze secondes » devient « le couloir en quinze secondes » et « Un toast de soixante secondes, une seule vanne » est abrégé. Si les titres changent dans la donnée, le texte suit la donnée.

## B14 : fin de l'étape 1 et carte « Étape 2 » (par parcours) (VALIDÉ 10/10/10, inchangé)

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

## B16 : page d'abonnement (selon le parcours d'origine) (VALIDÉ 10/10/10, inchangé)

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

- Grep après branchement, aucune de ces chaînes ne doit rester dans `src/` : `si tu vois loin`, `Voir toutes les`, `Voir tous les`, `Débloquer`, `s'ouvrent ensuite`, `Essayer gratuitement l'étape 1 du parcours`, `Choisis ton parcours`, `Voir les 5 parcours en entier avec Premium`, `Je m'abonne et je garde mes favoris`, `Voter sur les nouveautés, c'est dans Premium`, `démontée, comme celle-ci`, `au rythme conseillé d'une par semaine`, `Retrouver ta légèreté, 20 minutes`, `Dedans : un conseil`, `Une seule par mois, mais`, `Tu reçois aussi une lecture à suivre`, `Choisis par où tu commences`, `Les favoris font partie de Premium`, `Étape 1 de {P}, gratuite : 5 vannes` (B8), `Essayer ce conseil` hors du bouton B9, `Il ouvre ton vote`, `ta page reste là`, `Reste à t'y mettre`, `Le conseil, tu l'as lu`, `ce soir-là`, `pour en écrire une`, `exemple à l'appui`, `un mot sur Premium, notre abonnement` hors de la note B18, `Ensuite, au programme`, `on te conseille d'en faire une par semaine`, `Ouvrir {P} en entier` sans le prix (lien B12).
- B3 `[S20]` : 159 caractères au plus pour Répartie, en petit ; à `{P}` plus long, retirer « du parcours » (voir B3). Vérifier le rendu à 360 px.
- B4+B5 `[S11]` : un paragraphe, un paragraphe d'intro suivi d'une liste `<ul>` (un `<li>` par parcours publié, dynamique), un paragraphe. Pas de coupe de mots dans un `<li>` ; une ligne par parcours suffit sur 360 px (le plus long, « Machine à Café pour faire rire à la pause sans forcer », 54 caractères, peut passer sur deux lignes : accepté).
- B11 : l'intro est composée (deux phrases communes + `{OBJET}`, « la page » pour le vote). La carte floutée a trois textes `[S27]` distincts ; le vote a un `[S27]` « Avec Premium : ton vote, … ». Vérifier à 375 px que chaque `[S27]` tient sur 2 lignes (90 caractères au plus).
- B12 : le lien « Ouvrir {P} en entier · 2,99 €/mois » affiche de nouveau le prix (il mène au paiement) ; la ligne Premium cite `{TITRE2}` (donnée `moduleTitle` du module 2). Libellé du lien distinct de `OUVRIR`.
- B13 : trois `<p>` ; `{PROGRAMME}` se lit dans les données des parcours (`moduleTitle`), pas en dur. B12 : `{TITRE1}` et `{TITRE2}` aussi. Ne jamais présenter l'ouverture des étapes comme hebdomadaire : avec Premium, tout est ouvert (décision du 07/10, D2) ; vérifier dans le code que rien ne verrouille réellement les étapes suivantes.
- B7 `[S25]` garde l'ancien gabarit (« Étape 1 de {P}, gratuite : … ») car B7 est validé et intouché ; B8 à B10 portent le nouveau (« Gratuit : …, étape 1 de {P} »).
- B18 : le libellé du bouton de formulaire reste « Envoie-moi la lettre ». La mention de Premium est dans la note sous le bouton, plus dans le sous-titre.
- B7 `[S22]` : phrase entière, toujours lue après `[S21]`.
- B2 `[S8]` : le titre fait 52 caractères ; vérifier qu'il tient sur 2 lignes à 360 px.
- B16 : le bouton nomme le parcours d'origine ; vérifier la largeur à 375 px (voir plus haut).

