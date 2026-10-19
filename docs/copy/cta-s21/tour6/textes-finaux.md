# Textes finaux des 17 blocs d'appel (s21) : bloc → emplacement [Sn] → texte exact

> Pour @fullstack. Remplace `textes-finaux-12.md` et `textes-finaux-3.md` du tour 5. **Statut : à brancher seulement après la relecture à l'aveugle du tour 6** (règle d'or P0 s18 : rien ne se met en ligne sous la barre ; un bloc qui n'atteint pas 10 chez les trois repart en correction, pas en ligne). Zéro tiret cadratin, UTF-8, espace insécable U+00A0 avant « € », « : », « ? » dans le rendu. Prix et gabarits : `docs/copy/cta-s21/tour5/annexe-pack12-tour5.md` §4 et `annexe-pack3-tour5.md`.

## Variables et lignes communes

- `{P}` = nom du parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot). `{N}` = nombre d'étapes (3, 4, 6, 6, 6). `{D}` = minutes par semaine (15, 20, 20, 20, 15). `{PARCOURS_COUNT}` = nombre de parcours publiés (5 aujourd'hui) ; `{AUTRES}` = `PARCOURS_COUNT - 1` (4). Source : `PREMIUM_PARCOURS` dans `apps/web/src/config/premium.ts`. Dans tous les textes ci-dessous, le « 5 » qui compte les parcours s'écrit `{PARCOURS_COUNT}` dans le code, et le « 4 » de « les 4 autres parcours » s'écrit `{AUTRES}` (B2 lien, B3 lien, B4+B5 bouton, B7, B8, B9, B10, B11, B12, B13, B16 bouton). Les textes sont écrits avec les valeurs d'aujourd'hui pour être relus tels quels.
- **Libellé d'ouverture** `OUVRIR` = `Ouvrir les {PARCOURS_COUNT} parcours · 2,99 €/mois` (point médian U+00B7 entouré d'espaces). Remplace partout « Débloquer ». Même mot et même forme que le bouton de la page d'abonnement (B16). Repli si `PARCOURS_COUNT` vaut 1 ou 0 : `Ouvrir tous les parcours · 2,99 €/mois`. Le mot « Débloquer » ne doit plus apparaître dans aucun libellé d'appel (Grep `Débloquer` dans `src/` après branchement).
- **LP-A** (ligne de prix avec annuel, seulement si l'offre annuelle est disponible) : `2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois, si tu vois loin). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **LP-M** (repli sans annuel) : `2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **Contour** `[S25]` : `Essayer gratuitement l'étape 1 du parcours {P}` (par défaut Répartie ; sur une fiche, le parcours qui colle à la catégorie).

## B1 : encart de démonstration au milieu de l'article

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
| `[S8]` (titre) | Quand on te chambre et que rien ne sort |
| `[S5']` | Tu viens de lire cinquante vannes. Reste la seconde qui compte : celle où la bonne vanne sort de ta bouche, pas de ton téléphone. Une étape par semaine, 20 minutes : tes premières répliques, le rythme et les silences, les piques qu'on retourne avec le sourire, et la vanne tombée à plat qui devient une deuxième chance. À chaque étape, un défi à tenter, en vrai ou à l'écrit. |
| `[S6]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| `[S9]` | Premium, l'abonnement du site : 2,99 € TTC par mois, ou 24,99 € TTC par an (2,08 € par mois). Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. |

## B18 : la lettre par e-mail dans l'article

| Emplacement | Texte exact |
|---|---|
| Ligne repliée (phrase) | Une vanne gratuite par mois, et pourquoi elle marche. |
| Ligne repliée (bouton) | Recevoir par e-mail |
| Formulaire complet, titre | La vanne du mois et pourquoi elle marche |
| Sous-titre, ligne 1 | Un e-mail par mois, avec une vanne comme celle-ci : « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » |
| Sous-titre, ligne 2 | Puis ce qui la fait marcher, et un exercice en trois étapes pour écrire la tienne, avec un exemple. À la fin, une lecture à suivre et un mot sur Premium, notre abonnement. |
| Bouton du formulaire | Envoie-moi la lettre |
| Note | Gratuit, sans compte. Désinscription en un clic. |

La vanne de la ligne 1 vient de la donnée (dernière vanne déjà envoyée ; avant le premier envoi du 05/11/2026, la vanne ci-dessus). Si Thomas ne veut pas montrer d'extrait avant l'envoi : retirer la ligne 1 ; la ligne 2 commence alors par : `Un e-mail par mois : ce qui fait marcher une vanne, et un exercice en trois étapes pour écrire la tienne, avec un exemple. À la fin, une lecture à suivre et un mot sur Premium, notre abonnement.`

## B3 : haut de l'accueil

| Emplacement | Texte exact |
|---|---|
| `[S19]` (bouton plein) | Tester mes premières répliques, gratuit |
| Lien sous le bouton | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| `[S20]` | Tester mes premières répliques, c'est l'étape 1 du parcours Répartie : 20 minutes, sans compte, quiz compris. La suite est dans Premium, l'abonnement du site : tu résilies en ligne quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement. |

`[S20]` : « 20 minutes » = `{D}` de Répartie ; si le parcours du bouton change, le nom et les minutes suivent `{P}` et `{D}`.

## B4 + B5 : carte Premium d'accueil

| Emplacement | Texte exact |
|---|---|
| `[S10]` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? |
| `[S11]` | La table qui rit, et la réplique, c'est toi qui l'as lancée. Répartie quand on te chambre, Machine à Café et Boulot pour le travail, Confiance pour retrouver ta légèreté, Storytelling pour raconter une anecdote. Une étape par semaine, 15 à 20 minutes, avec un défi à tenter, dans la vie ou à l'écrit. |
| En-tête de carte | Premium · 2,99 €/mois |
| `[S12]` | Ou 24,99 €/an (2,08 €/mois, 10,89 € économisés). Prix TTC. |
| `[S12]` si le plan annuel n'est pas proposé | Prix TTC. |
| Bouton plein | `OUVRIR` (`Ouvrir les 5 parcours · 2,99 €/mois`) |
| Bouton contour | Tester mes premières répliques, gratuit |
| `[S13]` | Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. |
| Dernière ligne | Déjà 1 500+ inscrits, et toi ? |
| 4 avantages | inchangés (textes du site) |

`[S11]` : les noms de parcours et leur phrase suivent les parcours publiés (`PREMIUM_PARCOURS`) ; la phrase finale (« 15 à 20 minutes ») suit le min et le max de `{D}`.

## B6 : bouton d'en-tête

| Emplacement | Texte exact |
|---|---|
| Bouton d'en-tête (3 endroits de `header.tsx`) | **2,99 €/mois** (avec U+00A0 entre « 2,99 » et « € ») |
| Nom accessible | 2,99 € par mois : voir l'offre Premium |

Le nom accessible contient le libellé visible (règle « label in name », WCAG 2.5.3) ; il remplace « Voir les prix de Premium ». Variante à mesurer au code seulement (pas dans ce fichier de branchement) : `Premium 2,99 €`, voir l'annexe.

## B7 : murs des listes (par liste)

| Emplacement | /vannes | /conseils | /videos |
|---|---|---|---|
| `[S21]` | Voilà les 10 premières vannes. La suite est juste en dessous, dans Premium. | Voilà les 3 premiers conseils. La suite est juste en dessous, dans Premium. | Voilà les 3 premières vidéos. La suite est juste en dessous, dans Premium. |
| `[S22]` | Le filtre par catégorie aussi. | Les filtres par niveau et par catégorie aussi. | Les filtres par niveau et par catégorie aussi. |
| `[S23]` titre | Et si la prochaine vanne qui fait rire la table était la tienne ? | Et si la bonne réplique sortait sur le moment, pas trois heures après ? | Tu les regardes pour rire. Et si tu les regardais pour faire rire ? |
| `[S24]` | Avec Premium : toute la liste, l'exercice « À toi de jouer » sous chaque vanne pour écrire la tienne, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). | Avec Premium : toute la liste, l'exercice « À toi de jouer » de chaque conseil pour l'essayer, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). | Avec Premium : toute la liste, les points clés et l'exercice de chaque vidéo, tes favoris, et 5 parcours pour t'entraîner, une étape par semaine (de 15 à 20 minutes). |
| Bouton plein | Voir la suite des vannes avec Premium | Voir la suite des conseils avec Premium | Voir la suite des vidéos avec Premium |
| `[S26]` | LP-A | LP-A | LP-A |
| `[S25]` contour | Essayer gratuitement l'étape 1 du parcours Répartie | idem | idem |

`[S22]` se lit à la suite de `[S21]` (« …, dans Premium. Le filtre par catégorie aussi. ») : ne jamais l'afficher seul ni avant `[S21]`.

## B8 : fiche d'une vanne

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Et si demain, c'était la tienne qu'on se répétait ? |
| `[S15]` | La mécanique, tu l'as. Il te reste l'exercice « À toi de jouer » : une consigne et un exemple à réutiliser, pour écrire ta version, celle que tu auras envie de sortir à la prochaine soirée. L'exercice est dans Premium, qui ouvre aussi les 5 parcours, une étape par semaine. |
| Bouton plein | Écrire la mienne avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Essayer gratuitement l'étape 1 du parcours {P} |
| Lien discret (inchangé) | Voir toutes les vannes |

## B9 : fiche d'un conseil

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Ce conseil, avant le soir où il servira |
| `[S15]` | Le conseil, tu l'as lu. Reste à l'essayer, tranquillement : l'exercice « À toi de jouer » te donne une consigne et un exemple à réutiliser. Il est dans Premium, avec 5 parcours pour t'entraîner : chaque semaine, une étape de 15 à 20 minutes, avec un conseil, des vannes, des vidéos et un quiz. |
| Bouton plein | Tester ce conseil avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Essayer gratuitement l'étape 1 du parcours {P} |
| Lien discret (inchangé) | Voir tous les conseils |

## B10 : fiche d'une vidéo

| Emplacement | Texte exact |
|---|---|
| `[S14]` | Après le rire, le décryptage |
| `[S15]` | Sur scène, il faut faire rire une salle. Toi, une table te suffit, et ça s'entraîne. Les points clés de cette vidéo et son exercice sont dans Premium, avec 5 parcours : une étape par semaine, de 15 à 20 minutes. |
| Bouton plein | Décrypter cette vidéo avec Premium |
| `[S16]` | LP-A |
| `[S25]` | Essayer gratuitement l'étape 1 du parcours {P} |
| Lien discret (inchangé) | Voir toutes les vidéos |

Le titre et le bouton disent le même geste (décrypter). Ne rien ajouter sur le contenu de l'analyse (aucun extrait n'est connu).

## B11 : fenêtre Premium (par geste)

Communs à tous les gestes : intro `Tu peux fermer cette fenêtre, ta page reste là. S'abonner, c'est deux étapes : ton compte, puis le paiement sécurisé.` ; ligne de prix `2,99 € TTC / mois` ; ligne de garantie finale inchangée ; lien `[S28]` : `Ou lire d'abord l'étape 1 du parcours {P} (gratuite, sans compte)`.

| Geste | Titre | `[S27]` | Bouton plein |
|---|---|---|---|
| Favori, vanne | Garde-la pour le soir où tu en auras besoin | Avec Premium : tes favoris prêts pour le bon moment, et 5 parcours pour t'entraîner, une étape par semaine. | Je m'abonne et je garde mes favoris |
| Favori, conseil | Garde-le pour le soir où tu en auras besoin | idem | idem |
| Favori, vidéo | Garde-la pour la retrouver quand tu en auras besoin | idem | idem |
| Vote | Voter sur les nouveautés, c'est dans Premium | Avec Premium : ton vote, tes favoris et 5 parcours pour t'entraîner, une étape par semaine. | Je m'abonne et je vote |
| Carte floutée, /vannes | Le reste de la liste est juste derrière | Avec Premium : toute la liste, l'exercice « À toi de jouer » sous chaque vanne, le filtre par catégorie et 5 parcours pour t'entraîner. | Je m'abonne et j'ouvre toute la liste |
| Carte floutée, /conseils et /videos | Le reste de la liste est juste derrière | Avec Premium : toute la liste, les filtres par niveau et par catégorie, tes favoris, et 5 parcours pour t'entraîner. | Je m'abonne et j'ouvre toute la liste |

Le titre « soir » n'existe que pour la vanne et le conseil ; la vidéo n'en parle jamais.

## B12 : résultat du quiz d'humour (parcours conseillé = `{P}`)

| Emplacement | Texte exact |
|---|---|
| Phrase | Ton humour, tu viens de le découvrir. Ça se travaille : {P}, c'est {N} étapes de {D} minutes, une par semaine. La première se lit tout de suite, sans compte, quiz compris. |
| Bouton plein | Essayer gratuitement l'étape 1 de {P} |
| Lien (ouvre la page d'abonnement) | Voir les {PARCOURS_COUNT} parcours en entier avec Premium |
| Ligne Premium, avec annuel | Premium ouvre {P} en entier et les {AUTRES} autres parcours : 2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne. Tu as 14 jours pour te faire rembourser ton premier paiement. |
| Ligne Premium, repli sans annuel | Premium ouvre {P} en entier et les {AUTRES} autres parcours : 2,99 € TTC par mois. Résiliable en ligne. Tu as 14 jours pour te faire rembourser ton premier paiement. |

Exemple (Confiance) : « Ton humour, tu viens de le découvrir. Ça se travaille : Confiance, c'est 6 étapes de 20 minutes, une par semaine. La première se lit tout de suite, sans compte, quiz compris. » Ligne Premium : « Premium ouvre Confiance en entier et les 4 autres parcours : … ».

## B13 : quiz d'orientation, membre sans abonnement (par parcours)

Bouton : `Suivre {P} en entier · 2,99 €/mois`. Ligne de garantie : `Prix TTC. Tu résilies en ligne quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.` (inchangée). Gabarit : `Ton compte est prêt. {P}, c'est le parcours pour toi si {persona}. Plus qu'un pas pour la suite : étapes 2 à {N}, une par semaine, {D} minutes. Pour 2,99 € par mois, tu ouvres les {PARCOURS_COUNT} parcours, pas seulement {P}.` (étapes « 2 et 3 » pour Machine à Café). Pas d'annuel dans B13 (le bouton ouvre directement un paiement dont la formule n'est pas choisie).

| Parcours | Texte exact avant le bouton |
|---|---|
| Répartie | Ton compte est prêt. Répartie, c'est le parcours pour toi si on te chambre et que tu cherches encore quoi répondre. Plus qu'un pas pour la suite : étapes 2 à 4, une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Répartie. |
| Machine à Café | Ton compte est prêt. Machine à Café, c'est le parcours pour toi si tu veux faire rire à la pause sans devenir le collègue qui force. Plus qu'un pas pour la suite : étapes 2 et 3, une par semaine, 15 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Machine à Café. |
| Confiance | Ton compte est prêt. Confiance, c'est le parcours pour toi si tu sors d'une période compliquée. Plus qu'un pas pour la suite : étapes 2 à 6, une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Confiance. |
| Storytelling | Ton compte est prêt. Storytelling, c'est le parcours pour toi si ta chute arrive quand tout le monde est passé au dessert. Plus qu'un pas pour la suite : étapes 2 à 6, une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Storytelling. |
| Boulot | Ton compte est prêt. Boulot, c'est le parcours pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu. Plus qu'un pas pour la suite : étapes 2 à 6, une par semaine, 15 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Boulot. |

Seuls Répartie et Storytelling sont montrés aux relecteurs ; les trois autres suivent le même gabarit.

## B14 : fin de l'étape 1 et carte « Étape 2 » (par parcours)

- `[S17]`, titre de l'étape, `[S18]` : données publiques du parcours, inchangées.
- Phrase de validation : `Bien joué pour l'étape 1. Avec Premium, tu la valides, tu ouvres l'étape 2, puis toute la suite, {D} minutes par semaine.`
- Bouton plein : `Passer à l'étape 2 avec Premium`
- `[S16]` : LP-A
- `[S30]` (lien discret) : `Ou la lettre gratuite, sans compte : une vanne décryptée et un exercice, une fois par mois par e-mail`

## B15 : page des parcours (par carte)

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
| Confiance (`[S33c]`) | Pour toi si tu sors d'une période compliquée et que le rire te manque | Le rire, 20 minutes par semaine, sans te forcer |
| Storytelling (`[S33d]`) | Pour toi si ta chute arrive quand tout le monde est passé au dessert | Ton histoire jusqu'à la chute, avant qu'on te dise « et donc ? » |

- Bouton plein, formule mensuelle : `Ouvrir les 5 parcours · 2,99 €/mois` ; formule annuelle choisie : `Ouvrir les 5 parcours · 24,99 €/an` (mensuel par défaut si l'annuel n'est pas disponible). Le libellé suit le sélecteur sans rechargement.
- `[S32]` : `Deux étapes : ton compte, puis le paiement sécurisé par Stripe.`
- Sous-titre et carte : inchangés.
- Le titre Confiance dit « 20 minutes par semaine » : à suivre `{D}` de Confiance si la durée change. Aucune formule de rythme libre (« à ton rythme ») ne doit apparaître nulle part.

## B17 : création de compte (texte tel quel)

- `[S34]` (libellé du champ prénom) : `Prénom (facultatif, pour te saluer dans nos e-mails)`
- `[S36]` (bouton plein) : `Créer mon compte et passer au paiement`
- `[S35]` (lien sous « Déjà un compte ? ») : `Tu préfères lire d'abord ? L'étape 1 du parcours {P}, gratuite et sans compte`
