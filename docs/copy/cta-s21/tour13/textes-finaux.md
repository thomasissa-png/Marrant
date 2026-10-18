# Textes finaux des 17 blocs d'appel (s21) : bloc → emplacement [Sn] → texte exact

> Pour @fullstack. Remplace `tour12/textes-finaux.md`. **Statut : à brancher seulement après la relecture à l'aveugle du tour 13** (règle d'or P0 s18 : rien ne se met en ligne sous la barre ; un bloc qui n'atteint pas 10 chez les trois repart en correction, pas en ligne). Dix blocs sont validés et recopiés tels quels depuis `tour12/textes-finaux.md` : B1, B2, B6, B7, B11, B14, B15, B16, B17, B18. Les sept autres (B3, B4+B5, B8, B9, B10, B12, B13) sont la version du tour 13. Zéro tiret cadratin, UTF-8, espace insécable U+00A0 avant « € », « : », « ? » dans le rendu. Prix et gabarits : `docs/copy/cta-s21/tour5/annexe-pack12-tour5.md` §4 et `annexe-pack3-tour5.md`. Preuve de la formule de résiliation : `annexe-tour13.md` §1.

## Variables et lignes communes

- `{P}` = nom du parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot). `{N}` = nombre d'étapes (3, 4, 6, 6, 6). `{D}` = minutes par semaine (15, 20, 20, 20, 15). `{PARCOURS_COUNT}` = nombre de parcours publiés (5 aujourd'hui) ; `{AUTRES}` = `PARCOURS_COUNT - 1` (4). Source : `PREMIUM_PARCOURS` dans `apps/web/src/config/premium.ts`. Dans tous les textes ci-dessous, le « 5 » qui compte les parcours s'écrit `{PARCOURS_COUNT}` dans le code, et le « 4 » de « les 4 autres parcours » s'écrit `{AUTRES}` (B2 lien, B7, B12 ligne Premium, B14, B16 boutons). Les textes sont écrits avec les valeurs d'aujourd'hui pour être relus tels quels.
- `{TITRE1}` = titre de l'étape 1 de `{P}`, lu dans `moduleTitle` du premier module de `docs/content/parcours-*.json` (le texte suit la donnée) : Machine à Café « Des vannes courtes, faciles à ressortir » ; Répartie « Tes premières répliques » ; Confiance « Redécouvrir ce qui te fait rire » ; Storytelling « Ton anecdote, coupée au plus court » ; Boulot « La salle de réunion, sans un mot ».
- **`{PHRASE_PROFIL}` (B12 seulement, remplace `{ETAPE_PROFIL}` du tour 12)** = première phrase de la ligne Premium, **propre au profil du quiz** (clé = `HumorProfileType` de `apps/web/src/components/quiz/quiz-data.ts`). Elle cite une étape payante : `{ETAPE_PROFIL}` = `moduleTitle` du module indiqué, lu dans la donnée (jamais en dur) ; `{RANG}` = rang de ce module dans le parcours, écrit « 2e », « 3e », « 4e ». Table :

| Profil (`HumorProfileType`) | Parcours (`recommendedParcours`) | Module cité (rang) | `{ETAPE_PROFIL}` | `{PHRASE_PROFIL}` (texte exact) |
|---|---|---|---|---|
| `OBSERVATEUR` | `confiance` | module 3 | « L'œil de l'observateur » | Ce que tu remarques et que personne ne voit a son étape : « {ETAPE_PROFIL} », la {RANG} de Confiance. |
| `STORYTELLER` | `storytelling` (publié aujourd'hui) | module 4 | « Une chute qui se lit de deux façons » | Les autres attendent la suite, et ta chute a son étape : « {ETAPE_PROFIL} », la {RANG} de Storytelling. |
| `ABSURDE` | `machine-a-cafe` | module 2 | « Sentir le bon moment » | Tes idées que personne n'attendait tombent mieux au bon moment : c'est le sujet de « {ETAPE_PROFIL} », la {RANG} étape de Machine à Café. |
| `PUNCHLINEUR` | `repartie` | module 2 | « Le rythme et les silences » | Les silences que tu sais utiliser ont leur étape : « {ETAPE_PROFIL} », la {RANG} de Répartie. |
| `TAQUIN` | `repartie` | module 3 | « Retourner les piques avec le sourire » | Les balles que tu renvoies ont leur étape : « {ETAPE_PROFIL} », la {RANG} de Répartie. |

  Règle de repli : si la clé (profil, parcours) n'a pas de ligne dans la table (par exemple `STORYTELLER` quand Storytelling n'est pas publié et que le code recommande Machine à Café), ou si le module cité n'existe plus dans la donnée, **la phrase de profil est omise** et la ligne Premium commence directement par la variante de repli ci-dessous (`Premium ouvre d'un coup les {N} étapes de {P} …`). Jamais de titre d'étape inventé ni de phrase de profil recopiée sur un autre profil. Le module cité se désigne par son rang et son titre se lit dans la donnée : si l'ordre des modules change, la table suit. Boulot n'est conseillé par aucun profil. L'Absurde n'a aucune étape qui lui corresponde exactement dans Machine à Café : le pont « bon moment » est voulu (l'étape 2 est présentée sur /parcours comme « …tu te demandes seulement si c'est le bon moment »).
- `{LIGNE_CARTE}` = la ligne de la carte du parcours, sans « Pour toi si » : Répartie « on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre » ; Machine à Café « tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force » ; Confiance « tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer » ; Storytelling « tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert » ; Boulot « tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu ». Source : les cartes des parcours (une seule source dans le code, pas de copie). Utilisée par B13 seulement.
- **Libellé d'ouverture** `OUVRIR` = `Ouvrir les {PARCOURS_COUNT} parcours · 2,99 €/mois` (point médian U+00B7 entouré d'espaces). Même mot et même forme que le bouton générique de la page d'abonnement (B16). Repli si `PARCOURS_COUNT` vaut 1 ou 0 : `Ouvrir tous les parcours · 2,99 €/mois`. Le mot « Débloquer » ne doit plus apparaître dans aucun libellé d'appel.
- **Libellé d'ouverture d'un parcours** `OUVRIR_P` = `Ouvrir {P} en entier · 2,99 €/mois` (même forme, point médian U+00B7). Utilisé par le lien de B12 et par le bouton plein de B13.
- **LP-A** (ligne de prix avec annuel, **blocs validés seulement : B7 `[S26]`, B14 `[S16]`, inchangée**) : `2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.` **LP-M** (repli sans annuel, mêmes blocs) : `2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **LP-A2** (nouvelle ligne de prix avec annuel, **utilisée par B8, B9, B10 `[S16]` et par la ligne Premium de B12**) : `2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable depuis ton profil quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.` **LP-M2** (repli sans annuel) : `2,99 € TTC par mois. Résiliable depuis ton profil quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.` Les deux formules (« en ligne » et « depuis ton profil ») sont vraies ; la seconde est plus précise. Si Thomas veut une seule formule partout, il faut rouvrir B2 `[S9]`, B7 et B14 (validés) : décision de Thomas, pas prise ici.
- **Contour `[S25]`, deux gabarits qui coexistent** : (a) B7, validé et inchangé : `Étape 1 de {P}, gratuite : {CONTENU}` avec `{CONTENU}` = `5 vannes et un défi` (/vannes), `un conseil et un défi` (/conseils), `2 vidéos et un défi` (/videos). (b) B8, B9, B10 : `Gratuit : {CONTENU}, étape 1 de {P}` avec `{CONTENU}` = `5 vannes et un défi` (fiche vanne), `un défi à tenter et 5 vannes` (fiche conseil), `2 vidéos et un défi` (fiche vidéo). Par défaut `{P}` = Répartie ; sur une fiche, le parcours qui colle à la catégorie. Vrai pour l'étape 1 des 5 parcours (`docs/content/parcours-*.json`).
- **Rythme des étapes (fait à respecter dans tout le code et les textes)** : avec Premium, **toutes les étapes d'un parcours sont ouvertes d'un coup**. Une étape par semaine est un rythme conseillé, jamais un déblocage (décision du 07/10, audit s17, D2). Ne jamais écrire « s'ouvrent ensuite », « une par semaine » comme un calendrier d'ouverture. Quand le rythme est dit, il ne vient ni en fin de phrase ni comme une limite ; l'argument à mettre en avant est « les 5 parcours en entier ».
- **Formule de résiliation (règle pour tout texte à écrire)** : dire « résiliable depuis ton profil » ou « tu résilies depuis ton profil ». **Ne jamais écrire « en un clic »** : le bouton du profil mène à l'écran de résiliation du portail Stripe, où l'on confirme (preuve : `annexe-tour13.md` §1). « Quand tu veux » reste vrai (aucune durée minimale).

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

## B3 : haut de l'accueil

| Emplacement | Texte exact |
|---|---|
| `[S19]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| `[S20]` | Sans compte : l'étape 1 de Répartie (un défi à tenter, 5 vannes, 2 vidéos, un quiz). La suite, dont « Retourner les piques avec le sourire », c'est Premium, résiliable depuis ton profil. |

`[S20]` fait **186 caractères** (espaces compris, avec les valeurs d'aujourd'hui, guillemets et espaces comptés comme des caractères simples) : **limite dure 190, ne pas rallonger** ; **@fullstack vérifie le rendu à 360 px**. La note commence par « Sans compte » (le visiteur ne connaît pas encore le nom « Répartie »), nomme une étape payante réelle (« Retourner les piques avec le sourire », la 3e de Répartie, titre lu dans `moduleTitle`) et perd l'incise « l'un des 5 parcours » ainsi que « les 4 autres parcours » (le lien juste au-dessus dit « Ouvrir les 5 parcours »). Le bouton est celui de l'étape « Tes premières répliques » : `{P}` est toujours Répartie ici, la note ne varie pas avec le parcours (si `{P}` changeait un jour, recompter et relire le titre de l'étape payante citée). « La suite » = les étapes 2 à 4 de Répartie (vrai : le titre et « ce que tu vas apprendre » sont visibles, le reste est dans Premium). La liste « un défi à tenter, 5 vannes, 2 vidéos, un quiz » est le contenu de l'étape 1 des 5 parcours (le conseil n'est plus cité : retiré pour tenir 190, rien de faux). « 5 » du lien = `{PARCOURS_COUNT}`. Le titre d'accueil « On va arranger ça » n'est pas touché. Pas de durée ni de remboursement dans `[S20]` (dits dans B4+B5 `[S13]` et sur la page d'abonnement).

## B4 + B5 : carte Premium d'accueil

| Emplacement | Texte exact |
|---|---|
| `[S10]` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? |
| `[S11]`, paragraphe 1 | La table qui rit, et c'est ta réplique qui l'a lancée. |
| `[S11]`, paragraphe 2 (intro) | Un seul prix ouvre les 5 parcours, et l'étape 1 de chacun se lit gratuitement : |
| `[S11]`, liste (un parcours par ligne) | Répartie pour répondre quand on te chambre / Machine à Café pour faire rire à la pause sans forcer / Boulot pour le lundi à 9 h sans le ton de compte rendu / Confiance pour retrouver ta légèreté / Storytelling pour que ta chute arrive avant le dessert |
| `[S11]`, paragraphe 3 | Une fois abonné, tout est ouvert d'un coup : 15 à 20 minutes par étape, avec un défi à tenter, dans la vie ou à l'écrit. |
| En-tête de carte | Premium · 2,99 €/mois |
| `[S12]` | Ou 24,99 €/an (2,08 €/mois, 10,89 € économisés). Prix TTC. |
| `[S12]` si le plan annuel n'est pas proposé | Prix TTC. |
| Bouton plein | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| Bouton contour | Tester mes premières répliques, gratuit |
| `[S13]` | Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux. |
| Dernière ligne | Déjà 1 500+ inscrits, et toi ? |
| 4 avantages | inchangés (textes du site) |

Seul changement par rapport au tour 12 : `[S13]` (« en ligne » devient « depuis ton profil »). `[S11]` s'affiche en **trois blocs** : un paragraphe, puis un paragraphe d'intro (terminé par « : ») suivi d'une **vraie liste** (`<ul>`, un `<li>` par parcours, sans puce décorative imposée), puis un paragraphe. Le « 5 » de « Un seul prix ouvre les 5 parcours » est `{PARCOURS_COUNT}`. Une ligne par parcours publié (`PREMIUM_PARCOURS`), dans cet ordre : Répartie, Machine à Café, Boulot, Confiance, Storytelling. Si un parcours est dépublié, sa ligne disparaît. La durée finale (« 15 à 20 minutes par étape ») suit le min et le max de `{D}`. Le mot « Premium » n'est pas dans `[S11]` : il est dans l'en-tête de carte juste dessous.

## B6 : bouton d'en-tête (VALIDÉ 10/10/10, inchangé)

| Emplacement | Texte exact |
|---|---|
| Bouton d'en-tête (3 endroits de `header.tsx`) | **2,99 €/mois** (avec U+00A0 entre « 2,99 » et « € ») |
| Nom accessible | 2,99 € par mois : voir l'offre Premium |

Le nom accessible contient le libellé visible (règle « label in name », WCAG 2.5.3) ; il remplace « Voir les prix de Premium ». Variante à mesurer au code seulement (pas dans ce fichier de branchement) : `Premium 2,99 €`, voir l'annexe du tour 6.

## B7 : murs des listes (VALIDÉ 10/10/10, inchangé)

| Emplacement | /vannes | /conseils | /videos |
|---|---|---|---|
| `[S21]` | Voilà les 10 premières vannes. La suite est juste en dessous, dans Premium. | Voilà les 3 premiers conseils. La suite est juste en dessous, dans Premium. | Voilà les 3 premières vidéos. La suite est juste en dessous, dans Premium. |
| `[S22]` (lien) | Tu y trouves aussi le filtre par catégorie, pour aller droit à celles qu'il te faut. | Tu y trouves aussi les filtres par niveau et par catégorie, pour aller droit à ceux qu'il te faut. | Tu y trouves aussi les filtres par niveau et par catégorie, pour aller droit à celles qu'il te faut. |
| `[S23]` titre | Et si la prochaine vanne qui fait rire la table était la tienne ? | Et si la bonne réplique sortait sur le moment, pas trois heures après ? | Tu les regardes pour rire. Et si tu les regardais pour faire rire ? |
| `[S24]` | Avec Premium : toute la liste, l'exercice « À toi de jouer » sous chaque vanne pour écrire la tienne, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). | Avec Premium : toute la liste, l'exercice « À toi de jouer » de chaque conseil pour l'essayer, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). | Avec Premium : toute la liste, les points clés et l'exercice de chaque vidéo, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). |
| Bouton plein | Voir la suite des vannes avec Premium | Voir la suite des conseils avec Premium | Voir la suite des vidéos avec Premium |
| `[S26]` | LP-A | LP-A | LP-A |
| `[S25]` contour | Étape 1 de Répartie, gratuite : 5 vannes et un défi | Étape 1 de Répartie, gratuite : un conseil et un défi | Étape 1 de Répartie, gratuite : 2 vidéos et un défi |

`[S22]` se lit à la suite de `[S21]` (« …, dans Premium. Tu y trouves aussi le filtre… », « y » = Premium) : ne jamais l'afficher seul ni avant `[S21]`. C'est une phrase entière, rendue comme lien vers la page d'abonnement. `[S26]` garde LP-A (« Résiliable en ligne quand tu veux ») : bloc validé, non retouché.

## B8 : fiche d'une vanne

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Et si demain, c'était la tienne qu'on se répétait ? |
| `[S15]` | La mécanique, tu l'as. Reste à écrire ta version, celle que tu auras envie de sortir à la prochaine soirée. L'exercice « À toi de jouer » est fait pour ça : une consigne, un exemple, la même technique que cette vanne. Il est dans Premium, l'abonnement du site, qui ouvre aussi les 5 parcours en entier. Et tes favoris te gardent celle-ci sous la main. |
| Bouton plein | Écrire la mienne avec Premium |
| `[S16]` | LP-A2 |
| `[S25]` | Gratuit : 5 vannes et un défi, étape 1 de {P} |
| Lien discret | Voir d'autres vannes |

« exercice » n'est dit qu'une fois (l'exercice nommé, puis « Il »). Les favoris des vannes font partie de Premium (vrai). « celle-ci » = la vanne de la fiche. Les 5 parcours et les favoris sont dans deux phrases séparées : un seul « avec » ne porte plus trois éléments. « Et tes favoris » prolonge la liste de ce que Premium apporte (le sujet de la phrase d'avant). Le « 5 » = `{PARCOURS_COUNT}`.

## B9 : fiche d'un conseil

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Essaie-le avant le soir où il te servira |
| `[S15]` | À froid, rater ne coûte rien : c'est tout l'intérêt de l'exercice « À toi de jouer ». Une consigne pour démarrer, un exemple à réutiliser le moment venu. Il est dans Premium, l'abonnement du site, qui ouvre aussi les 5 parcours en entier. Et tes favoris te gardent ce conseil sous la main. |
| Bouton plein | Essayer ce conseil avec Premium |
| `[S16]` | LP-A2 |
| `[S25]` | Gratuit : un défi à tenter et 5 vannes, étape 1 de {P} |
| Lien discret | Voir d'autres conseils |

La première phrase ne redit plus le titre : elle ouvre sur « rater ne coûte rien ». Les favoris des conseils font partie de Premium (vrai). « Il » = l'exercice « À toi de jouer ».

## B10 : fiche d'une vidéo

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Faire rire une salle, c'est son métier. Toi, une table te suffit |
| `[S15]` | Et ça s'entraîne, à petites doses. Les points clés de cette vidéo, son exercice et tes favoris sont dans Premium, l'abonnement du site : de quoi la revoir pour faire rire, plus seulement pour rire. Le même abonnement ouvre les 5 parcours en entier : 15 à 20 minutes par étape, un défi à chaque fois. |
| Bouton plein | Décrypter cette vidéo avec Premium |
| `[S16]` | LP-A2 |
| `[S25]` | Gratuit : 2 vidéos et un défi, étape 1 de {P} |
| Lien discret | Voir d'autres vidéos |

Ne rien ajouter sur le contenu de l'analyse (aucun extrait n'est connu). `[S14]` et `[S15]` se lisent d'un trait (« …une table te suffit. Et ça s'entraîne, à petites doses. »). « 15 à 20 minutes » suit le min et le max de `{D}`. « Premium » n'est dit qu'une fois dans `[S15]`, relié à « l'abonnement du site » (le visiteur arrivé d'un moteur de recherche comprend que le bouton et le texte parlent de la même chose), puis repris par « Le même abonnement » ; le prix vient juste après dans `[S16]`. Les favoris des vidéos font partie de Premium (vrai). Plus de « Avec, en plus, » : la dernière phrase a un verbe. B8, B9, B10 : même logique.

## B11 : fenêtre Premium, par geste (VALIDÉ 10/10/10, inchangé)

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

Le titre « soir » n'existe que pour la vanne et le conseil ; la vidéo n'en parle jamais. Le bouton du favori suit le genre du titre (« la » pour la vanne et la vidéo, « le » pour le conseil). Intro complète d'un favori, par exemple : `Deux étapes : ton compte, puis le paiement sécurisé. Et si tu fermes, la vanne reste là.` Longueurs des `[S27]` : 83 (favoris), 65 (vote), 82 (/vannes), 86 (/conseils), 84 (/videos).

## B12 : résultat du quiz d'humour (parcours conseillé = `{P}`, profil = clé de la table `{PHRASE_PROFIL}`)

| Emplacement | Texte exact |
|---|---|
| Phrase (inchangée) | Ta force, tu viens de la lire. Reste à t'en servir : l'étape 1 de {P}, « {TITRE1} », se lit tout de suite, sans compte. Dedans, un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. |
| Bouton plein (inchangé) | Commencer mon parcours {P}, étape 1 gratuite |
| Lien (inchangé, ouvre la page d'abonnement) | `OUVRIR_P` (`Ouvrir {P} en entier · 2,99 €/mois`) |
| Ligne Premium, avec annuel (**trois temps : phrase de profil, ce que Premium ouvre, prix**) | `{PHRASE_PROFIL}` Premium ouvre d'un coup les {N} étapes ({D} minutes chacune) et les {AUTRES} autres parcours. LP-A2 |
| Ligne Premium, repli sans annuel | `{PHRASE_PROFIL}` Premium ouvre d'un coup les {N} étapes ({D} minutes chacune) et les {AUTRES} autres parcours. LP-M2 |
| Ligne Premium, repli sans phrase de profil (clé absente ou module introuvable) | Premium ouvre d'un coup les {N} étapes de {P} ({D} minutes chacune) et les {AUTRES} autres parcours. LP-A2 (ou LP-M2) |

Les cinq rendus (profil → texte exact de la ligne Premium, annuel disponible) :

- **L'Observateur** (Confiance) : « Ce que tu remarques et que personne ne voit a son étape : « L'œil de l'observateur », la 3e de Confiance. Premium ouvre d'un coup les 6 étapes (20 minutes chacune) et les 4 autres parcours. 2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable depuis ton profil quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement. » Phrase : « …l'étape 1 de Confiance, « Redécouvrir ce qui te fait rire », … ». Bouton : « Commencer mon parcours Confiance, étape 1 gratuite ». Lien : « Ouvrir Confiance en entier · 2,99 €/mois ».
- **Le Storyteller** (Storytelling) : « Les autres attendent la suite, et ta chute a son étape : « Une chute qui se lit de deux façons », la 4e de Storytelling. Premium ouvre d'un coup les 6 étapes (20 minutes chacune) et les 4 autres parcours. 2,99 € TTC… ». Phrase : « …« Ton anecdote, coupée au plus court »… ». Bouton : « Commencer mon parcours Storytelling, étape 1 gratuite ». Lien : « Ouvrir Storytelling en entier · 2,99 €/mois ».
- **L'Absurde** (Machine à Café) : « Tes idées que personne n'attendait tombent mieux au bon moment : c'est le sujet de « Sentir le bon moment », la 2e étape de Machine à Café. Premium ouvre d'un coup les 3 étapes (15 minutes chacune) et les 4 autres parcours. 2,99 € TTC… ». Phrase : « …« Des vannes courtes, faciles à ressortir »… ». Bouton : « Commencer mon parcours Machine à Café, étape 1 gratuite ». Lien : « Ouvrir Machine à Café en entier · 2,99 €/mois ».
- **Le Punchlineur** (Répartie) : « Les silences que tu sais utiliser ont leur étape : « Le rythme et les silences », la 2e de Répartie. Premium ouvre d'un coup les 4 étapes (20 minutes chacune) et les 4 autres parcours. 2,99 € TTC… ». Phrase : « …« Tes premières répliques »… ». Bouton : « Commencer mon parcours Répartie, étape 1 gratuite ». Lien : « Ouvrir Répartie en entier · 2,99 €/mois ».
- **Le Taquin** (Répartie) : « Les balles que tu renvoies ont leur étape : « Retourner les piques avec le sourire », la 3e de Répartie. Premium ouvre d'un coup les 4 étapes (20 minutes chacune) et les 4 autres parcours. 2,99 € TTC… ». Phrase, bouton, lien : comme le Punchlineur.

Dans chaque rendu, la suite « 2,99 € TTC… » est LP-A2 en entier : `2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable depuis ton profil quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.` Point médian U+00B7 entouré d'espaces dans le lien. Le lien annonce le prix parce qu'il mène à la page d'abonnement ; le bouton de B15 (« Commencer {P}, étape 1 gratuite ») reste différent et inchangé. Le lien ouvre la page d'abonnement et ramène ensuite sur ce parcours. La clause « dont « … » » du tour 12 disparaît : le titre d'étape est maintenant dans la phrase de profil, en tête de ligne. Si la ligne devait alourdir le rendu à 375 px, la phrase de profil peut être retirée seule (repli ci-dessus), jamais la ligne de prix.

## B13 : quiz d'orientation, membre sans abonnement (par parcours)

Bouton : `OUVRIR_P` = `Ouvrir {P} en entier · 2,99 €/mois` (point médian U+00B7 entouré d'espaces ; même libellé que le lien de B12). Ligne de garantie : `Prix TTC, paiement sécurisé par Stripe. Tu résilies depuis ton profil quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.` (seul changement par rapport au tour 12 : « en ligne » devient « depuis ton profil »). Gabarit, **trois paragraphes courts** (trois `<p>`), le dernier seul juste avant le bouton :

1. `Ton quiz te conseille {P} : pour toi si {LIGNE_CARTE}. L'étape 1 est offerte. {ENSUITE} : {PROGRAMME}.`
2. `Avec Premium, les étapes 2 à {N} sont ouvertes tout de suite, {D} minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les {PARCOURS_COUNT} parcours, pas seulement {P}.`
3. `Ton compte est prêt : il ne reste que le paiement.`

(« les étapes 2 et 3 » pour Machine à Café.) `{PROGRAMME}` = titres d'étapes lus dans `moduleTitle` des fichiers `docs/content/parcours-*.json` (première lettre en minuscule), jusqu'à 3. `{ENSUITE}` = `Ensuite` quand tous les titres des étapes 2 et suivantes sont cités (Répartie, Machine à Café), `Ensuite, entre autres` sinon. Pas d'annuel dans B13 (le bouton ouvre directement un paiement dont la formule n'est pas choisie). « Conseille » n'apparaît qu'une fois (paragraphe 1) ; le rythme se dit « idéalement une par semaine », entre parenthèses, jamais comme un calendrier d'ouverture. « Premium » n'est dit qu'une fois (paragraphe 2). Le mot « rythme » n'est volontairement pas utilisé hors des titres d'étapes (« le rythme et les silences »). Le verbe du bouton est « Ouvrir » (comme les autres boutons payants du site) : il finit le geste de « ouvertes tout de suite », il n'annonce pas des semaines d'assiduité.

**Répartie**
> Ton quiz te conseille Répartie : pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre. L'étape 1 est offerte. Ensuite : le rythme et les silences, retourner les piques avec le sourire, improviser sur l'inattendu.
>
> Avec Premium, les étapes 2 à 4 sont ouvertes tout de suite, 20 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Répartie.
>
> Ton compte est prêt : il ne reste que le paiement.
>
> [ Ouvrir Répartie en entier · 2,99 €/mois ]

**Machine à Café**
> Ton quiz te conseille Machine à Café : pour toi si tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force. L'étape 1 est offerte. Ensuite : sentir le bon moment, raconter une anecdote qu'on écoute jusqu'au bout.
>
> Avec Premium, les étapes 2 et 3 sont ouvertes tout de suite, 15 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Machine à Café.
>
> Ton compte est prêt : il ne reste que le paiement.
>
> [ Ouvrir Machine à Café en entier · 2,99 €/mois ]

**Confiance**
> Ton quiz te conseille Confiance : pour toi si tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer. L'étape 1 est offerte. Ensuite, entre autres : rire de toi sans te rabaisser, l'œil de l'observateur, être à l'aise en groupe.
>
> Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite, 20 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Confiance.
>
> Ton compte est prêt : il ne reste que le paiement.
>
> [ Ouvrir Confiance en entier · 2,99 €/mois ]

**Storytelling**
> Ton quiz te conseille Storytelling : pour toi si tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert. L'étape 1 est offerte. Ensuite, entre autres : des personnages qu'on entend, une chute qui se lit de deux façons, un détour qui ne perd personne.
>
> Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite, 20 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Storytelling.
>
> Ton compte est prêt : il ne reste que le paiement.
>
> [ Ouvrir Storytelling en entier · 2,99 €/mois ]

**Boulot**
> Ton quiz te conseille Boulot : pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu. L'étape 1 est offerte. Ensuite, entre autres : un PS drôle sans finir en capture d'écran, le couloir en quinze secondes, un toast de soixante secondes.
>
> Avec Premium, les étapes 2 à 6 sont ouvertes tout de suite, 15 minutes chacune (idéalement une par semaine). Un seul prix, 2,99 € par mois, ouvre les 5 parcours, pas seulement Boulot.
>
> Ton compte est prêt : il ne reste que le paiement.
>
> [ Ouvrir Boulot en entier · 2,99 €/mois ]

Sous chaque bouton, la ligne de garantie ci-dessus (nouvelle formule). Seuls Répartie et Storytelling sont montrés aux relecteurs ; les trois autres suivent le même gabarit. Les titres d'étapes cités (Machine à Café, Confiance, Boulot) sont ceux de `parcours-reecriture-s17.json` et `parcours-boulot-s19.json` ; pour Boulot, « Le couloir : quinze secondes » devient « le couloir en quinze secondes » et « Un toast de soixante secondes, une seule vanne » est abrégé. Si les titres changent dans la donnée, le texte suit la donnée.

## B14 : fin de l'étape 1 et carte « Étape 2 » (par parcours) (VALIDÉ 10/10/10, inchangé)

- `[S17]`, titre de l'étape, `[S18]` : données publiques du parcours, inchangées.
- Phrase de suite et de validation (sans nombre d'étapes ni durée) : `Bien joué pour l'étape 1. Avec Premium, tu la valides et tu enchaînes : l'étape 2 est ouverte tout de suite, les suivantes aussi. Le rythme conseillé : une par semaine, mais rien ne t'y oblige. Le même abonnement ouvre aussi les {AUTRES} autres parcours en entier.`
- Bouton plein : `Passer à l'étape 2 avec Premium`
- `[S16]` : LP-A (inchangée : « Résiliable en ligne quand tu veux »)
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

## B18 : la lettre par e-mail dans l'article (VALIDÉ 10/10/10, inchangé)

| Emplacement | Texte exact |
|---|---|
| Ligne repliée (phrase) | Chaque mois, une vanne et de quoi écrire la tienne. |
| Ligne repliée (bouton) | Recevoir par e-mail |
| Formulaire complet, titre | La vanne du mois, et la méthode pour écrire la tienne |
| Sous-titre, ligne 1 | « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » Voilà le genre de vanne que tu reçois chaque mois, avec ce qui la fait marcher. |
| Sous-titre, ligne 2 | Et surtout trois étapes pour fabriquer la tienne, avec un exemple. |
| Bouton du formulaire | Envoie-moi la lettre |
| Note | La lettre est gratuite, sans compte. En fin de message, une lecture à suivre et un mot sur Premium, notre abonnement. Désinscription en un clic. |

La ligne repliée fait 51 caractères (2 lignes de 28 : OK) et le bouton 19 (moins de 20 : OK). La vanne de la ligne 1 vient de la donnée (dernière vanne déjà envoyée ; avant le premier envoi du 05/11/2026, la vanne ci-dessus). Si Thomas ne veut pas montrer d'extrait avant l'envoi : la ligne 1 devient `Chaque mois, une vanne avec ce qui la fait marcher.` et la ligne 2 reste inchangée. La mention de Premium est dans la note de réassurance, à côté de la désinscription. « Désinscription en un clic » concerne la lettre (lien de désinscription), pas l'abonnement Premium : cette phrase reste vraie.

## Points d'attention pour @fullstack

- **Résiliation (tour 13)** : dans B3 `[S20]`, B4+B5 `[S13]`, B8, B9, B10 `[S16]`, B12 (ligne Premium) et B13 (garantie), la formule est « depuis ton profil » (LP-A2 / LP-M2). B2 `[S9]`, B7 `[S26]`, B14 `[S16]` (LP-A / LP-M) gardent « en ligne » : validés, intouchés. Les deux formules sont vraies. Ne jamais écrire « en un clic » pour la résiliation Premium : ce n'est pas exact (voir `annexe-tour13.md` §1, qui signale aussi deux textes du code à corriger : `apps/web/src/lib/llms-content.ts` l. 78 et l. 154).
- Grep après branchement, aucune de ces chaînes ne doit rester dans `src/` : `si tu vois loin`, `Voir toutes les`, `Voir tous les`, `Débloquer`, `s'ouvrent ensuite`, `Essayer gratuitement l'étape 1 du parcours`, `Choisis ton parcours`, `Voir les 5 parcours en entier avec Premium`, `Je m'abonne et je garde mes favoris`, `Voter sur les nouveautés, c'est dans Premium`, `démontée, comme celle-ci`, `au rythme conseillé d'une par semaine`, `Retrouver ta légèreté, 20 minutes`, `Dedans : un conseil`, `Une seule par mois, mais`, `Tu reçois aussi une lecture à suivre`, `Choisis par où tu commences`, `Les favoris font partie de Premium`, `Étape 1 de {P}, gratuite : 5 vannes` (B8), `Essayer ce conseil` hors du bouton B9, `Il ouvre ton vote`, `ta page reste là`, `Reste à t'y mettre`, `Le conseil, tu l'as lu`, `ce soir-là`, `pour en écrire une`, `exemple à l'appui`, `un mot sur Premium, notre abonnement` hors de la note B18, `Ensuite, au programme`, `on te conseille d'en faire une par semaine`, `Suivre {P} en entier` et `Suivre Répartie en entier` (ancien bouton B13), `t'y aide`, `Cet exercice est dans Premium`, `se teste mieux ici`, `Tu commences par celui qui te ressemble`, `La suite, c'est Premium, un abonnement résiliable en ligne quand tu veux`, `Étape 1 du parcours Répartie, sans compte`, `dont « Rire de toi sans te rabaisser »`, **et, nouveaux au tour 13** : `l'un des 5 parcours`, `un abonnement résiliable en ligne`, `C'est le rôle de l'exercice`, `Mieux vaut tester ce conseil`, `Avec, en plus,`, `à petite dose` (sans « s »), `dont « {ETAPE_PROFIL} »` et tout `dont « … »` dans la ligne Premium de B12, `Tu résilies en ligne quand tu veux, et tu as 14 jours` (ancienne garantie B13), `La suite et les 4 autres parcours, c'est Premium`. À ne pas confondre : « tu résilies en ligne quand tu veux » reste légitime dans B2 `[S9]` (validé) et « Résiliable en ligne quand tu veux » dans LP-A (B7, B14).
- B3 `[S20]` : 186 caractères (190 au plus), en petit ; vérifier le rendu à 360 px. `{PARCOURS_COUNT}` dynamique pour le lien. Le titre de l'étape payante cité vient de `moduleTitle` (Répartie, module 3).
- B4+B5 `[S11]` : un paragraphe, un paragraphe d'intro suivi d'une liste `<ul>` (un `<li>` par parcours publié, dynamique), un paragraphe. Pas de coupe de mots dans un `<li>` ; une ligne par parcours suffit sur 360 px (le plus long, « Machine à Café pour faire rire à la pause sans forcer », 54 caractères, peut passer sur deux lignes : accepté).
- B8, B9, B10 : `[S15]` en une seule `<p>` ; `[S16]` = LP-A2 (LP-M2 sans annuel).
- B11 : l'intro est composée (deux phrases communes + `{OBJET}`, « la page » pour le vote). La carte floutée a trois textes `[S27]` distincts. Vérifier à 375 px que chaque `[S27]` tient sur 2 lignes (90 caractères au plus).
- B12 : **le texte dépend du profil.** Brancher la table `{PHRASE_PROFIL}` (clé `HumorProfileType`, parcours `recommendedParcours`, rang du module) avec lecture du titre dans `moduleTitle` et du rang dans l'ordre des modules (jamais en dur) ; repli sans phrase de profil si la clé est absente ou le module introuvable. La ligne Premium est en trois temps (phrase de profil, ce que Premium ouvre, prix). Le lien (`OUVRIR_P`) mène à la page d'abonnement. Tester les 5 profils (dont `STORYTELLER` avec `STORYTELLING_PUBLIE` à `true` puis à `false` : à `false`, repli sans phrase de profil).
- B13 : trois `<p>` ; `{PROGRAMME}` se lit dans les données des parcours (`moduleTitle`), pas en dur. Bouton `OUVRIR_P`. Ne jamais présenter l'ouverture des étapes comme hebdomadaire : avec Premium, tout est ouvert (décision du 07/10, D2) ; vérifier dans le code que rien ne verrouille réellement les étapes suivantes.
- B7 `[S25]` garde l'ancien gabarit (« Étape 1 de {P}, gratuite : … ») car B7 est validé et intouché ; B8 à B10 portent le nouveau (« Gratuit : …, étape 1 de {P} »).
- B18 : le libellé du bouton de formulaire reste « Envoie-moi la lettre ». La mention de Premium est dans la note sous le bouton.
- B7 `[S22]` : phrase entière, toujours lue après `[S21]`.
- B2 `[S8]` : le titre fait 52 caractères ; vérifier qu'il tient sur 2 lignes à 360 px.
- B16 : le bouton nomme le parcours d'origine ; vérifier la largeur à 375 px (voir plus haut).
