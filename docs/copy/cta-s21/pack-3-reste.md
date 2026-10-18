# Pack 3 : murs, fiches, fenêtre, quiz, parcours, abonnement, inscription (B7 à B17)

> Document de relecture à l'aveugle (règle d'or P0 s18). Onze duels : B7 (murs des listes), B8 (fiche vanne), B9 (fiche conseil), B10 (fiche vidéo), B11 (fenêtre Premium), B12 (résultat du quiz d'humour), B13 (résultat du quiz d'onboarding), B14 (fin de l'étape 1 et carte « Étape 2 »), B15 (page des parcours), B16 (page d'abonnement), B17 (page de création de compte). Dans chaque duel, deux textes complets, « Texte 1 » et « Texte 2 ». Les étiquettes `[Sn]` renvoient aux emplacements de la spec de forme (`docs/design/cta-forme-place-s21.md`) : elles disent seulement où chaque morceau de texte s'affiche. Rien ici ne dit lequel des deux textes a été écrit comme « le meilleur » : les deux peuvent être mauvais.

## Consigne aux relecteurs (commune aux onze duels)

Tu relis des blocs d'appel à l'action de deviens-marrant.fr, un site d'humour et de répartie (tutoiement, ton de pote drôle et bienveillant, jamais de pression). Pour chaque duel :

1. Lis la **fiche de situation** et la **liste des faits vrais** : ce sont les seules affirmations autorisées dans les textes.
2. **Mets-toi dans la peau du visiteur décrit**, à ce moment précis (pas dans celle d'un relecteur, ni d'un client déjà convaincu).
3. **Choisis Texte 1 ou Texte 2** selon une seule question : « lequel me ferait cliquer, puis payer, sans me sentir manipulé ? »
4. **Note chaque texte sur 10 pour la conversion** (donne-t-il envie de cliquer, puis de s'abonner ? clair, crédible, sans friction ?) **et sur 10 pour la qualité d'écriture** (voix, justesse, fluidité, zéro cliché ni ton de publicité ou de coach).
5. Dis **ce qui manque pour atteindre 10** dans chacun.
6. Signale toute phrase qui **promet plus que les faits vrais**, qui sonne comme un texte écrit par une IA, ou qui met mal à l'aise.

Format de réponse, par duel :
`Choix : 1 ou 2 | Conversion : T1 /10, T2 /10 | Écriture : T1 /10, T2 /10 | Manque pour 10 : T1 ..., T2 ... | Alertes : ...`

## Faits vrais communs (valables pour tout le pack)

- Premium : 2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois, 10,89 € économisés par an). Résiliable en ligne quand on veut. Remboursement du **premier** paiement sur demande dans les 14 jours (jamais les renouvellements).
- 5 parcours : Machine à Café (3 semaines, 15 min par semaine), Répartie (4 semaines, 20 min), Confiance (6 semaines, 20 min), Storytelling (6 semaines, 20 min), Boulot (6 semaines, 15 min). Une étape par semaine ; chaque étape a son conseil, ses vannes, ses vidéos et son quiz.
- La **première étape de chaque parcours se lit sans compte et sans abonnement**, quiz compris. Pour les étapes suivantes, le titre et « ce que tu vas apprendre » sont visibles ; le reste est dans Premium.
- Il n'existe pas de compte gratuit : le compte se crée pour s'abonner, puis le paiement suit (deux étapes : compte, puis paiement sécurisé).
- Sans abonnement, les listes montrent 10 vannes, 3 conseils et 3 vidéos. Chaque fiche (vanne, conseil, vidéo) reste lisible sans compte, avec son « Pourquoi ça marche » (vannes) ou son exemple. L'exercice « À toi de jouer » (une consigne et un exemple à réutiliser) fait partie de Premium, de même que les favoris, le filtre par catégorie des vannes et le vote sur les nouveautés.
- Le carnet : un carnet de situations de répartie par mois, dans Premium ; la première situation du mois est offerte en accès libre.
- La lettre : gratuite, sans compte, une fois par mois, par e-mail (une vanne, ce qui la fait marcher, un exercice).
- Le quiz d'humour : 12 questions, environ 2 minutes, 5 profils, 100 % gratuit, sans inscription, refaisable.
- Le site affiche « 1 500+ membres » (formulation validée par le fondateur, à ne pas modifier ni commenter).
- Aucune promesse de résultat n'est faite ni autorisée.

---

## Duel B7 : le mur des listes (/vannes, /conseils, /videos)

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme sur la liste des vannes (même logique pour les conseils et les vidéos). Il arrive d'un moteur de recherche, d'un lien d'article ou du menu. Il veut plus de vannes à ressortir.
- **Où il est** : il vient de parcourir les 10 premières vannes de la liste. Sous la dixième carte s'affiche le bloc ci-dessous, puis des cartes floutées (« Voir Premium »). Il n'y a plus de bandeau d'annonce en haut de la liste.
- **Ce qu'il cherche** : la suite de la liste. Il a peut-être remarqué que chaque vanne a sa propre page, lisible sans compte.
- **Ce que le bloc peut obtenir** : un clic sur le bouton plein (page d'abonnement) ou sur le bouton contour (étape 1 gratuite de Répartie).
- **Composition imposée** : une ligne `[S21]` sous la dixième carte ; une ligne `[S22]` sur le filtre par catégorie (lien discret) ; puis une carte : titre `[S23]`, texte `[S24]`, bouton plein « Tout débloquer », ligne `[S26]`, bouton contour `[S25]`.

### Texte 1

> `[S21]` Tu as fait le tour des 10 premières.
> `[S22]` Le filtre par catégorie est réservé à Premium.
>
> `[S23]` **Une vanne se lit. Un parcours t'apprend à la sortir.**
> `[S24]` Premium ajoute les 5 parcours en entier, le carnet mensuel de situations de répartie, les favoris et toute la liste. Chaque vanne garde sa fiche en accès libre.
> [ Tout débloquer ]
> `[S26]` 2,99 € TTC par mois, ou 24,99 € TTC par an. Premier paiement remboursable sous 14 jours.
> `[S25]` [ Lire la première étape gratuite de Répartie ]

*Au clic : le bouton plein ouvre la page d'abonnement ; le bouton contour ouvre l'étape 1 de Répartie, en lecture libre.*

### Texte 2

> `[S21]` Voilà les 10 premières vannes. La suite de la liste est dans Premium.
> `[S22]` Le filtre par catégorie fait partie de Premium.
>
> `[S23]` **La suite de la liste, et de quoi les ressortir**
> `[S24]` Premium ouvre toute la liste et le filtre par catégorie, garde tes favoris, et ajoute sur chaque fiche l'exercice pour ressortir la vanne avec tes mots.
> [ Tout débloquer ]
> `[S26]` 2,99 € TTC par mois. Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux.
> `[S25]` [ Lire la première étape gratuite de Répartie ]

*Au clic : identique au Texte 1.*

Pour /conseils et /videos, mêmes textes avec « conseils » ou « vidéos » à la place de « vannes » (limites : 3 conseils, 3 vidéos ; pas de ligne sur le filtre).

---

## Duel B8 : la fiche d'une vanne, sous le décryptage

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme sur la fiche publique d'une vanne : arrivé de la liste, d'un article ou d'un moteur de recherche. Pas de compte.
- **Ce qu'il vient de lire** : la vanne, puis « Pourquoi ça marche : {technique} », une explication de deux ou trois phrases. Juste en dessous, une courte section « Comment la ressortir » en prose : « Le meilleur moment ? Quand personne ne s'y attend. Retiens la structure (setup court + chute qui décale) et applique-la à ta propre situation. » Le bloc ci-dessous vient ensuite (une seule section d'appel, plus de deuxième bouton).
- **Ce qu'il cherche** : comprendre et peut-être la ressortir. Le décryptage lui a donné de la valeur gratuitement.
- **Ce que le bloc peut obtenir** : un clic sur le bouton plein (page d'abonnement) ou sur le bouton contour (étape 1 gratuite du parcours qui colle à la catégorie de la vanne ; ici, Répartie). Les textes ci-dessous ne doivent rien promettre sur ce que contient l'exercice au-delà de « une consigne et un exemple à réutiliser ».
- **Composition imposée** : titre `[S14]`, texte `[S15]`, bouton plein « Voir ce que contient Premium », ligne `[S16]`, bouton contour `[S25]`, lien discret « Voir toutes les vannes ».

### Texte 1

> `[S14]` **À toi de jouer**
> `[S15]` Une consigne en une phrase, puis un exemple à réutiliser : de quoi refaire cette vanne avec ta propre situation. Cet exercice fait partie de Premium.
> [ Voir ce que contient Premium ]
> `[S16]` 2,99 € TTC par mois. Tu as 14 jours pour te faire rembourser ton premier paiement.
> `[S25]` [ Lire la première étape gratuite de Répartie ]
> Lien : Voir toutes les vannes

*Au clic : le bouton plein ouvre la page d'abonnement avec retour sur cette fiche ; le bouton contour ouvre l'étape 1 de Répartie.*

### Texte 2

> `[S14]` **Maintenant, la tienne**
> `[S15]` L'exercice t'aide à passer d'une vanne lue à une vanne que tu sais sortir. Il fait partie de Premium. Pas sûr ? La première étape de chaque parcours se lit sans compte.
> [ Voir ce que contient Premium ]
> `[S16]` Premium : 2,99 € TTC par mois, résiliable en ligne. Premier paiement remboursable sous 14 jours.
> `[S25]` [ Lire la première étape gratuite de Répartie ]
> Lien : Voir toutes les vannes

*Au clic : identique au Texte 1.*

---

## Duel B9 : la fiche d'un conseil, sous l'exemple concret

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme sur la fiche publique d'un conseil (une technique d'humour expliquée), arrivé d'un moteur de recherche, d'une liste ou d'un article.
- **Ce qu'il vient de lire** : le conseil et son exemple concret, en entier, gratuitement.
- **Ce qu'il cherche** : comprendre la technique, éventuellement l'appliquer.
- **Ce que le bloc peut obtenir** : un clic sur le bouton plein (page d'abonnement) ou sur le bouton contour (étape 1 gratuite du parcours le plus proche du sujet du conseil ; ici, Répartie).
- **Composition imposée** : titre `[S14]`, texte `[S15]`, bouton plein « Voir ce que contient Premium », ligne `[S16]`, bouton contour `[S25]`, lien discret « Voir tous les conseils ».

### Texte 1

> `[S14]` **L'exercice de ce conseil**
> `[S15]` Une consigne et un exemple pour appliquer cette technique. Il fait partie de Premium, comme les parcours en entier : cinq parcours, une étape par semaine.
> [ Voir ce que contient Premium ]
> `[S16]` Premium : 2,99 € TTC par mois, résiliable en ligne. Premier paiement remboursable sous 14 jours.
> `[S25]` [ Lire la première étape gratuite de Répartie ]
> Lien : Voir tous les conseils

### Texte 2

> `[S14]` **À toi de jouer**
> `[S15]` Tu as la technique et son exemple. L'exercice te fait l'appliquer à ta propre situation, avec une consigne et un exemple à réutiliser. Il fait partie de Premium.
> [ Voir ce que contient Premium ]
> `[S16]` 2,99 € TTC par mois. Tu as 14 jours pour te faire rembourser ton premier paiement.
> `[S25]` [ Lire la première étape gratuite de Répartie ]
> Lien : Voir tous les conseils

*Au clic (deux textes) : le bouton plein ouvre la page d'abonnement avec retour sur cette fiche ; le bouton contour ouvre l'étape 1 de Répartie.*

---

## Duel B10 : la fiche d'une vidéo, sous le résumé

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme sur la fiche d'une vidéo de stand-up analysée, arrivé d'un moteur de recherche ou d'une liste. Il est venu voir un humoriste.
- **Ce qu'il vient de voir** : la vidéo et un résumé de la fiche. Il ne voit rien du contenu de l'analyse pédagogique complète.
- **Ce qu'il cherche** : regarder, peut-être comprendre pourquoi ça marche.
- **Ce que le bloc peut obtenir** : un clic sur le bouton plein (page d'abonnement) ou sur le bouton contour (étape 1 gratuite ; ici, Répartie).
- **Fait précis** : « Les points clés et l'exercice de cette vidéo font partie de Premium. » Aucun teaser du contenu de l'analyse n'est disponible : `[S15]` ne doit rien en dévoiler ni en inventer.
- **Composition imposée** : titre `[S14]`, texte `[S15]`, bouton plein « Voir ce que contient Premium », ligne `[S16]`, bouton contour `[S25]`, lien discret « Voir toutes les vidéos ».

### Texte 1

> `[S14]` **L'analyse complète**
> `[S15]` Tu as la vidéo et son résumé. Les points clés et l'exercice de cette vidéo font partie de Premium.
> [ Voir ce que contient Premium ]
> `[S16]` 2,99 € TTC par mois. Tu as 14 jours pour te faire rembourser ton premier paiement.
> `[S25]` [ Lire la première étape gratuite de Répartie ]
> Lien : Voir toutes les vidéos

### Texte 2

> `[S14]` **Regarder avec un œil de pro**
> `[S15]` Les points clés à repérer dans cette vidéo et l'exercice qui va avec sont dans Premium. Pas sûr ? La première étape de chaque parcours se lit sans compte.
> [ Voir ce que contient Premium ]
> `[S16]` Premium : 2,99 € TTC par mois, résiliable en ligne. Premier paiement remboursable sous 14 jours.
> `[S25]` [ Lire la première étape gratuite de Répartie ]
> Lien : Voir toutes les vidéos

*Au clic (deux textes) : le bouton plein ouvre la page d'abonnement avec retour sur cette fiche ; le bouton contour ouvre l'étape 1 de Répartie.*

---

## Duel B11 : la fenêtre Premium

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme qui vient de toucher le cœur « favori » d'une vanne (ou d'un conseil, d'une vidéo). Il voulait la garder. Moins souvent : il a voté sur une nouveauté, ou touché une carte floutée.
- **Où il est** : une fenêtre s'ouvre par-dessus la page (sur mobile, un panneau qui monte du bas). Le visiteur est interrompu au milieu d'un geste qu'il croyait gratuit.
- **Ce qu'il cherche** : garder la vanne. Il n'a pas décidé de s'abonner. Il peut fermer la fenêtre, la vanne reste là.
- **Ce que le bloc peut obtenir** : un clic sur le bouton plein « Créer mon compte et m'abonner » (compte, puis paiement). Un lien discret propose l'étape 1 gratuite.
- **Composition imposée** : titre (selon le geste), phrase d'intro, « 2,99 € TTC / mois », ligne `[S27]` (l'avantage lié au geste, en deux lignes au plus ; les quatre avantages complets ne sont plus affichés), bouton plein « Créer mon compte et m'abonner », lien discret `[S28]`, puis les deux lignes de garantie déjà en place (premier paiement remboursable sous 14 jours, résiliation en ligne ; droit de rétractation).

### Texte 1

> **Geste : favori**
> Titre : **Les favoris font partie de Premium**
> Intro : S'abonner se fait en deux étapes : ton compte, puis le paiement sécurisé.
> `[S27]` Garde sous la main les vannes, conseils et vidéos à ressortir.
> [ Créer mon compte et m'abonner ]
> `[S28]` Lien : Pas sûr ? Lis d'abord la première étape gratuite de Répartie, sans compte
>
> **Geste : vote**
> Titre : **Le vote sur les nouveautés fait partie de Premium**
> Intro : S'abonner se fait en deux étapes : ton compte, puis le paiement sécurisé.
> `[S27]` Dis quelles nouveautés tu veux voir arriver.
>
> **Geste : carte verrouillée**
> Titre : **Passe à Premium**
> Intro : S'abonner se fait en deux étapes : ton compte, puis le paiement sécurisé.
> `[S27]` Toute la liste, les filtres et les favoris.

### Texte 2

> **Geste : favori**
> Titre : **Pour la garder, il te faut Premium**
> `[S27]` Tes favoris, rangés au même endroit. Avec eux, les 5 parcours en entier.
> [ Créer mon compte et m'abonner ]
> `[S28]` Lien : Pas maintenant ? Lire d'abord la première étape gratuite de Répartie
>
> **Geste : vote**
> Titre : **Pour voter, il te faut Premium**
> `[S27]` Tu votes sur les nouveautés, et tu as les 5 parcours en entier.
>
> **Geste : carte verrouillée**
> Titre : **Ce contenu fait partie de Premium**
> `[S27]` Toute la liste, le filtre par catégorie et les favoris, avec les 5 parcours en entier.

*Au clic (deux textes) : le bouton plein ouvre la création de compte (étape 1 sur 2), puis le paiement ; le lien ouvre l'étape 1 de Répartie.*

---

## Duel B12 : le résultat du quiz « Quel type d'humour es-tu ? »

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme qui vient de répondre aux 12 questions du quiz (environ 2 minutes, gratuit, sans inscription). Il arrive d'un lien, d'un article ou d'un réseau social. Il est en mode divertissement.
- **Ce qu'il vient de voir** : son profil (ici, « L'Observateur »), « Ta force », « Le conseil pour progresser », un bouton de partage, puis la carte « Ton point de départ : Parcours Confiance » avec une raison (« Tu vois ce que les autres ne remarquent pas : ce parcours commence justement par regarder ton quotidien avec un œil comique. »). Ces éléments sont identiques dans les deux textes. Le parcours conseillé change selon le profil ; Confiance dure 6 semaines, 20 minutes par semaine.
- **Ce qu'il cherche** : un résultat sur lui-même, à partager ou à garder. Il n'a rien demandé d'autre.
- **Ce que le bloc peut obtenir** : un clic vers l'étape 1 gratuite du parcours conseillé, ou vers la page d'abonnement.
- **Composition imposée** : sous la carte du parcours, un bouton plein, un lien ou un bouton secondaire, et une ligne de réassurance. Plus bas, la lettre par e-mail (autre duel).

### Texte 1

> `[S29]` [ Lire la première étape gratuite de Confiance ]  *(bouton plein)*
> L'étape 1 se lit sans compte, quiz compris.
> Lien : Accéder aux parcours complets
> 2,99 € TTC par mois. Premier paiement remboursable sous 14 jours.

*Au clic : le bouton ouvre l'étape 1 de Confiance, en lecture libre ; le lien ouvre la page d'abonnement avec retour sur ce parcours.*

### Texte 2

> Ton style, tu l'as. Reste à l'entraîner, une étape par semaine.
> `[S29]` [ Lire la première étape gratuite de Confiance ]  *(bouton contour)*
> [ Accéder aux parcours complets ]  *(bouton plein)*
> 2,99 €/mois, sans engagement.

*Au clic : le bouton contour ouvre l'étape 1 de Confiance, en lecture libre ; le bouton plein ouvre la page d'abonnement avec retour sur ce parcours.*

---

## Duel B13 : le résultat du quiz d'orientation, pour un membre sans abonnement

### Fiche de situation (neutre)

- **Qui** : une personne qui a créé son compte (mot de passe, e-mail) mais n'a pas fini le paiement : elle n'est donc pas abonnée. Elle est connectée. Très peu de monde est dans ce cas aujourd'hui.
- **Ce qu'elle vient de faire** : un quiz d'orientation de 3 questions. Le résultat est affiché au-dessus du bloc ci-dessous. Un lien « Refaire le quiz » existe à côté.
- **Ce qu'elle cherche** : son résultat. Elle a déjà fait une partie du chemin vers l'abonnement.
- **Ce que le bloc peut obtenir** : un clic sur le bouton plein « Active mon accès · 2,99 €/mois » (paiement directement, le compte existe déjà).
- **Composition** : une phrase, le bouton plein, une ligne de garantie, le lien discret « Refaire le quiz ». Emplacement de texte non numéroté dans la spec (forme seulement).

### Texte 1

> Il te reste une étape : le paiement. Ton compte existe déjà, pas besoin de le refaire.
> [ Active mon accès · 2,99 €/mois ]
> Premier paiement remboursable pendant 14 jours. Résiliation en ligne, quand tu veux.

### Texte 2

> Ton compte est prêt. Il manque l'accès Premium pour suivre ton parcours.
> [ Active mon accès · 2,99 €/mois ]
> Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux.

*Au clic (deux textes) : le bouton ouvre directement le paiement sécurisé.*

---

## Duel B14 : la fin de l'étape 1 d'un parcours

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme qui vient de lire en entier l'étape 1 de Répartie (sans compte) et de répondre au petit quiz de l'étape. C'est le moment où il sait le mieux ce que le site propose.
- **Ce qu'il voit juste au-dessus** : le résultat du quiz, « Sans faute. » ou « 3 sur 4. Les explications sont là pour ça. ».
- **Ce qu'il cherche** : savoir si c'est fini, ce qu'il y a après, et ce que ça lui coûte pour continuer. Il ne peut pas valider l'étape sans Premium.
- **Ce que le bloc peut obtenir** : un clic sur le bouton plein « Voir ce que contient Premium » (page d'abonnement). Une alternative discrète existe pour qui n'est pas prêt.
- **Composition imposée** : une carte « Étape 2 » (`[S17]` surtitre, titre de l'étape et `[S18]` texte, qui sont des données déjà publiques ; rien de payant n'est dévoilé), puis la phrase déjà validée « Valider l'étape fait partie de Premium. » (à ne pas modifier), le bouton plein « Voir ce que contient Premium », la ligne `[S16]`, et un lien discret `[S30]` vers la lettre.
- **Données d'exemple (réelles, étape 2 de Répartie)** : titre « Le rythme et les silences » ; format « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. » ; début de l'aperçu « Certaines phrases ne demandent aucun talent, seulement un bon timing. Ici, tu apprends à repérer un instant que tout le monde ressent en même temps sans que personne le dise, et à t'en servir pour prendre la parole. »

### Texte 1

> `[S17]` Étape 2, à ton rythme
> **Le rythme et les silences**
> `[S18]` Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. Certaines phrases ne demandent aucun talent, seulement un bon timing.
>
> Valider l'étape fait partie de Premium.
> [ Voir ce que contient Premium ]
> `[S16]` Premium : 2,99 € TTC par mois, résiliable en ligne. Premier paiement remboursable sous 14 jours.
> `[S30]` Lien : Pas prêt pour la suite ? La lettre gratuite met une vanne décryptée dans ta boîte mail, une fois par mois.

### Texte 2

> `[S17]` Étape 2 sur 4
> **Le rythme et les silences**
> `[S18]` Certaines phrases ne demandent aucun talent, seulement un bon timing. Ici, tu apprends à repérer un instant que tout le monde ressent en même temps sans que personne le dise, et à t'en servir pour prendre la parole.
>
> Valider l'étape fait partie de Premium.
> [ Voir ce que contient Premium ]
> `[S16]` 2,99 € TTC par mois. Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux.
> `[S30]` Lien : Pas encore ? La lettre gratuite t'envoie une vanne décryptée par mois.

*Au clic (deux textes) : le bouton ouvre la page d'abonnement avec retour sur ce parcours ; le lien ouvre le formulaire de la lettre.*

Source des données d'exemple : `docs/content/parcours-seed.json` (Répartie, semaine 2).

---

## Duel B15 : la page qui liste les 5 parcours

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme qui choisit un parcours : il vient de l'accueil, du menu ou d'un article. Il compare cinq cartes (Machine à Café, Répartie, Confiance, Storytelling, Boulot).
- **Ce qu'il voit sur une carte** (ici, Répartie) : difficulté, durée, rythme (4 semaines, 20 minutes par semaine), titre, « Pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre », une description (« Pour toi qui as toujours la bonne réplique… dans ta tête, avec un temps de retard… »), un exemple de membre fictif présenté comme tel (« Imagine Tom, 21 ans, étudiant… »), le programme replié, puis le bloc ci-dessous.
- **Ce qu'il cherche** : le parcours qui lui correspond, et ce qu'il peut en voir avant de payer. Rien sur la page ne dit où est la frontière entre le gratuit et le payant.
- **Ce que le bloc peut obtenir** : un clic vers l'étape 1 gratuite. Il n'y a aucune offre Premium sur la carte : un seul bouton par carte, jamais deux.
- **Composition imposée** : un bouton plein et une ligne `[S31]` sous le bouton.

### Texte 1

> [ Lire la première étape gratuite de Répartie ]
> `[S31]` Étape 1 offerte, étapes 2 à 4 avec Premium

*(Pour les autres cartes : « étapes 2 et 3 » pour Machine à Café, « étapes 2 à 6 » pour les trois parcours de 6 semaines.)*

### Texte 2

> [ Lire l'étape 1 de Répartie ]
> `[S31]` L'étape 1 est gratuite, sans compte. Les étapes 2 à 4 sont dans Premium.

*Au clic (deux textes) : l'étape 1 du parcours, en lecture libre.*

---

## Duel B16 : la page d'abonnement

### Fiche de situation (neutre)

- **Qui** : un visiteur anonyme qui a décidé de regarder l'offre : il est arrivé par le bouton d'en-tête, par un bouton « Voir ce que contient Premium » ou par une adresse directe. Il vient souvent d'un parcours précis (ici, Répartie, quand il vient d'un article ou d'un parcours Répartie ; la page s'adapte).
- **Ce qu'il voit** : un surtitre, le titre « Ta réplique pendant la soirée, pas dans le bus du retour », le sous-titre « 5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre. », la carte Premium (mensuel 2,99 € TTC ou annuel 24,99 € TTC), le bouton plein « Commencer à 2,99 €/mois », puis la garantie, l'extrait du carnet, des liens vers les étapes gratuites et une FAQ. Seuls le surtitre et la ligne sous le bouton changent d'un texte à l'autre.
- **Ce qui se passe au clic sur le bouton** : un formulaire de création de compte (« Étape 1 sur 2 »), puis le paiement sécurisé (« Étape 2 »). Rien près du bouton ne le dit aujourd'hui.
- **Ce qu'il cherche** : savoir si c'est pour lui, combien ça coûte, ce qui se passe s'il clique.
- **Ce que le bloc peut obtenir** : un clic sur le bouton « Commencer à 2,99 €/mois ».
- **Contraintes de forme** : le surtitre tient sur 2 lignes au maximum sur mobile (environ 80 caractères) ; la ligne `[S32]` s'affiche juste sous le bouton, en petit, avant la ligne de garantie. Trois surtitres, selon le parcours d'origine : `[S33a]` Répartie (et par défaut), `[S33b]` Machine à Café et Boulot, `[S33c]` Confiance.

### Texte 1

> `[S33a]` Pour toi si on te chambre en soirée, en coloc ou en TD.
> `[S33b]` Pour toi si tu sèches à la machine à café.
> `[S33c]` Pour toi si ça fait longtemps que tu n'as fait rire personne.
>
> *(titre, sous-titre, carte, bouton : inchangés)*
> `[S32]` Le bouton ouvre la création de ton compte (étape 1 sur 2), puis le paiement sécurisé (étape 2).

### Texte 2

> `[S33a]` C'est pour toi si tu restes muet quand on te chambre.
> `[S33b]` C'est pour toi si la machine à café te laisse sans rien à dire.
> `[S33c]` C'est pour toi si tu veux retrouver ta légèreté.
>
> *(titre, sous-titre, carte, bouton : inchangés)*
> `[S32]` Ensuite : la création de ton compte, puis le paiement sécurisé par Stripe.

*Pour la relecture : lis chaque texte avec le titre « Ta réplique pendant la soirée, pas dans le bus du retour » juste dessous le surtitre.*

---

## Duel B17 : la page de création de compte

### Fiche de situation (neutre)

- **Qui** : un visiteur qui vient de cliquer sur « Commencer à 2,99 €/mois » depuis la page d'abonnement. Il est décidé, ou presque. Anonyme jusqu'ici.
- **Ce qu'il voit** : « Étape 1 sur 2 », « Ton compte », un rappel du plan Premium choisi, les champs (e-mail, mot de passe d'au moins 8 caractères, prénom en dernier et facultatif), le bouton plein « Créer mon compte », un bouton « S'inscrire avec Google », la phrase « Étape 2 : le paiement sécurisé, juste après. », « Tu as 14 jours pour te faire rembourser ton premier paiement. », les CGU, « Déjà un compte ? Connecte-toi ».
- **Ce qu'il cherche** : en finir vite. Mais il peut hésiter devant le mot de passe.
- **Ce que le bloc peut obtenir** : le compte créé (pas encore le paiement) ; sinon, une sortie douce vers l'étape gratuite plutôt qu'un abandon.
- **Composition imposée** : un libellé de champ `[S34]` (le prénom, facultatif) et un lien discret `[S35]` sous « Déjà un compte ? ».

### Texte 1

> `[S34]` Prénom (facultatif)
> `[S35]` Lien : Pas encore décidé ? Lire d'abord la première étape gratuite

### Texte 2

> `[S34]` Ton prénom, pour te dire bonjour (tu peux le laisser vide)
> `[S35]` Lien : Pas sûr ? Lis d'abord une étape, sans compte

*Au clic sur le lien (deux textes) : une étape gratuite en lecture libre.*

---

## Annexe production (hors relecture : ne pas transmettre aux relecteurs aveugles)

Les clés de tirage sont dans `docs/copy/cta-s21/cles.md`. Cette annexe décrit chaque texte par son numéro. Température au sens de la spec design : B7, B8 à B10 tièdes (plein Premium, contour étape 1) ; B11, B13, B14, B16, B17 chauds (plein Premium seul) ; B12, B15 froids (plein étape 1).

### B7 (murs de liste)
- **Forme et place** : `MurListe`, spec §4 B7 : `[S21]` sous la 10e carte, `[S22]` lien discret, carte `[S23]` `[S24]` `[S26]` `[S25]`, plein « Tout débloquer » [CHOIX] vers `/abonnement?src=mur-<liste>`, cartes floutées « Voir Premium » inchangées ; plus de bandeau en haut.
- **Ce qui change** : le bandeau du haut (« Aperçu gratuit : 10 vannes accessibles sans abonnement… ») disparaît ; le bloc de bas de liste « Accède à tout le catalogue pour 2,99 €/mois » + « Voir ce que contient Premium » (qui ouvrait la fenêtre) est remplacé par ce bloc ; une seule destination (/abonnement). « Tout débloquer » et « Voir Premium » [CHOIX] intacts. Texte 2 vend l'usage (liste, filtre, favoris, exercice) ; Texte 1 vend l'entraînement (parcours, carnet) et dit que les fiches restent en accès libre.
- **Framework et conscience** : Texte 2 [PAS : manque (la suite) puis solution] ; Texte 1 [pont gratuit vers payant honnête] ; [Conscience : Solution-Aware]. Objection traitée : prix et « puis-je tester avant » (`[S25]`, `[S26]`).
- **Point d'attention** : « Chaque vanne garde sa fiche en accès libre » (Texte 1) est vrai (décision du 04/10) et supprime l'impression de mur ; à relire sur le critère « ne pas faire fuir un acheteur » au duel.

### B8, B9, B10 (fiches)
- **Forme et place** : `BlocExercice` (§3.3), `[S14]` `[S15]` `[S16]` `[S25]` + plein « Voir ce que contient Premium » [CHOIX] + lien discret « Voir toutes les … » ; juste après le décryptage / l'exemple / l'analyse gratuits.
- **Ce qui change** : le bloc pointillé « À toi de jouer » + le lien « Voir Premium » + les deux boutons de « Comment la ressortir » (plein et « Voir toutes les vannes ») sont remplacés par un seul bloc ; le texte en prose de « Comment la ressortir » est conservé, **sans la phrase « Les variantes et le parcours complet sont dans les parcours Premium »** (existence de variantes non vérifiée : à confirmer ou à laisser retirée) ; ajout de l'étape 1 gratuite (contour) sur toute fiche ; prix et garantie près du plein.
- **Framework et conscience** : B8 Texte 1 [fait puis pas] / Texte 2 [transformation lue vers sortie + réassurance] ; B9 Texte 2 chaleureux / Texte 1 factuel (ton) ; B10 Texte 1 sobre / Texte 2 « œil de pro » ; [Conscience : Product-Aware]. Objections : prix et garantie (`[S16]`), « est-ce que ça vaut le coup » (réassurance étape gratuite).
- **Points d'attention** : `[S15]` n'affiche aucune ligne réelle de la consigne (l'exercice est un seul champ « consigne + exemple », non séparable sans le dévoiler) : seul son format est dit, ce qui est vrai. B10 : aucun teaser de l'analyse (non exploitable, spec). `[S25]` : le parcours « qui colle à la catégorie » est une table à définir par @fullstack (non disponible dans ce que j'ai lu), Répartie sert d'exemple. « cinq parcours, une étape par semaine » (B9 Texte 2) vient de `config/premium.ts`.

### B11 (fenêtre Premium)
- **Forme et place** : `PremiumModal` en bottom sheet (spec B11) : titre et intro par geste, `[S27]` (2 lignes), plein « Créer mon compte et m'abonner » (exception motivée du lot 2, conservé), lien L2 `[S28]` dans le pied collant, garanties existantes en dessous.
- **Ce qui change** : la liste de 4 avantages (dont une de 8 lignes) n'est plus affichée ; titres du Texte 2 réécrits (ceux du Texte 1 sont les titres actuels) ; ligne « deux étapes » (Texte 1) ajoutée ; lien vers l'étape gratuite ajouté.
- **Framework et conscience** : Texte 2 [bénéfice du geste puis un pas] ; Texte 1 [transparence sur ce qui suit] ; [Conscience : Product-Aware]. Objection traitée : « qu'est-ce qui m'attend au clic ? » (Texte 1) ; « et si je veux juste garder une vanne ? » (sortie `[S28]`).
- **Point d'attention** : « Tu votes sur les nouveautés » : le vote existe (cartes « Je veux ça ! » de l'accueil). Les 3 gestes sont écrits pour les deux textes.

### B12 (quiz d'humour)
- **Forme et place** : sous la carte « Ton point de départ », `[S29]` ; Texte 1 = règle de la spec (plein = étape 1, E1 en lien L1, prix et garantie en petit) ; Texte 2 = ancien ordre (étape 1 en contour, E1 en plein), avec la phrase d'accroche « Ton style, tu l'as. Reste à l'entraîner, une étape par semaine. ». La lettre suit, inchangée.
- **Ce qui change** : le bouton gratuit nomme le parcours (patron validé « … de {parcours} ») ; E1 [CHOIX 06/10] intact en libellé ; l'ordre plein/contour change dans le Texte 1.
- **Framework et conscience** : divertissement d'abord, parcours ensuite ; [Conscience : Problem-Aware]. Objection : « c'est payant ? » (« sans compte, quiz compris »).
- **Point d'attention** : le nom du parcours est dynamique (profil ; capture : Confiance). L'option « carte du quiz dans « À lire ensuite » » de la spec §3.1 n'est pas écrite ici (accord de Thomas requis).

### B13 (quiz d'orientation, membre sans abonnement)
- **Forme et place** : spec B13 : plein « Active mon accès · {prix} », « Refaire le quiz » en lien L2 ; phrase d'accroche non numérotée (aucun `[S]` dans la spec) ajoutée au-dessus du bouton. Trafic ≈ 0 : forme et texte courts, aucun temps de plus.
- **Ce qui change** : le lien gris « Tout débloquer à 2,99 €/mois » devient un bouton plein avec phrase et garantie. [CHOIX] « Tout débloquer » : l'emplacement B13 n'en est pas un (le libellé reste sur /vannes).
- **Framework et conscience** : [rappel d'une étape en cours] ; [Conscience : Product-Aware, déjà engagé]. La relance des comptes sans paiement reste hors de ce chantier.

### B14 (fin d'étape 1)
- **Forme et place** : `CarteEtapeSuivante` (§3.4), `[S17]` `[S18]` ; phrase 4.1, bouton E4, `[S16]`, lien L2 `[S30]` ; aperçus des étapes 2+ : plus de plein, lien L2 « Voir ce que contient Premium ».
- **Ce qui change** : ajout de la carte au-dessus de la phrase validée (« Valider l'étape fait partie de Premium. » **non modifiée**, [CHOIX s16]) ; ajout de la garantie et d'un repli (la lettre : nouvel emplacement, **accord de Thomas requis**, spec lettre).
- **Framework et conscience** : Texte 2 [félicitation implicite, étape suivante, un pas] ; Texte 1 [rythme doux, format de l'étape] ; [Conscience : Product-Aware].
- **Points d'attention** : titre, aperçu et format de l'étape 2 sont des données (seed `parcours-seed.json`, Répartie semaine 2) : à confirmer contre l'aperçu réellement affiché avant mise en ligne ; « Étape 2 sur 4 », « 5 vannes, 2 vidéos » sont dynamiques. Tant que le quiz n'est pas fini, la carte n'apparaît pas.

### B15 (page des parcours)
- **Forme et place** : un plein par carte, ligne `[S31]` sous le bouton (spec B15).
- **Ce qui change** : le bouton « Commencer ce parcours » est remplacé (G9 du lot 2, jamais appliqué dans le code lu) ; la ligne de frontière est ajoutée. Texte 1 : libellé G9 + phrase déjà validée de `progressionVisiteurTexte` (« Étape 1 offerte, étapes 2 à N avec Premium »). Texte 2 : libellé validé 3.2c + phrase qui dit « sans compte ».
- **Framework et conscience** : [choix guidé, pas gratuit] ; [Conscience : Solution-Aware].

### B16 (page d'abonnement)
- **Forme et place** : `[S33a/b/c]` surtitres de 2 lignes au plus à 375 ; `[S32]` sous le bouton, avant la garantie (position du bouton inchangée) ; H1 et sous-titre validés conservés.
- **Ce qui change** : le surtitre devient variable selon `returnTo` (aujourd'hui un seul, validé) ; Texte 2 garde le surtitre validé pour `[S33a]` et écrit les deux autres, Texte 1 réécrit les trois à partir des lignes de persona de `/parcours` ; la ligne « ce qui suit » est nouvelle. Le haut de page (surtitre, H1, sous-titre) a été validé ensemble à l'aveugle : tout changement de surtitre repasse la relecture avec le H1. « Commencer à {prix} » [CHOIX 1.1] intact. L'aperçu public de l'étape 2 (carte, spec B16) utilise les textes de B14 et n'est pas dupliqué ici.
- **Framework et conscience** : [identification (« c'est pour toi si… ») puis levée de l'incertitude sur l'étape suivante] ; [Conscience : Product-Aware]. Objection : « qu'est-ce qui se passe si je clique ? » (`[S32]`).
- **Points d'attention** : Storytelling n'a pas de surtitre propre (retombe sur `[S33a]` ou ajouter une variante `[S33d]`) ; la mention « Stripe » est déjà sur la page (« Paiement sécurisé par Stripe »).

### B17 (création de compte)
- **Forme et place** : `[S34]` libellé du champ prénom (dernier, facultatif), `[S35]` lien L2 sous « Déjà un compte ? ».
- **Ce qui change** : prénom devenu facultatif et placé en dernier (effet sur la personnalisation des e-mails : repli « Salut, » déjà prévu, à vérifier par @fullstack) ; lien vers l'étape gratuite ajouté. « Créer mon compte » [CHOIX 2.1] intact.
- **Framework et conscience** : [réduction de friction] ; [Conscience : Most-Aware]. Point d'attention : le libellé du Texte 2 est long (58 caractères), 2 lignes à 375 : à vérifier par @design ; « pour te dire bonjour » suppose que le prénom sert aux salutations des e-mails (vrai avec repli sans prénom, à confirmer).
