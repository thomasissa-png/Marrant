# Audit UX des parcours d'apprentissage, s17 (07/10/2026)

Brief compris : auditer l'expérience des 3 parcours (Machine à Café 3 étapes, Répartie 4, Confiance 6) et du chemin qui y mène, du point de vue de Yanis, Sophie et Marc, en visiteur puis en Premium. Audit seul, à partir du code à jour (79b11f3) : aucun fichier modifié hors ce rapport, aucun commit. Rien n'a été rendu dans un navigateur (pas de captures : voir bloc Vérifié / Non vérifié).

Périmètre : C3, C4, C6, C7, C8, C12 et avis sur C1. Pas de doublon avec l'audit s16 (`docs/marrant/audit-parcours-s16/ux.md`) : je ne reprends que ce qui touche les parcours.

Contraintes fondateur respectées (non re-questionnées) : pas de compte gratuit (visiteur vers Premium), étape 1 en lecture libre, « 15 à 20 min/semaine selon le parcours », témoignages présentés comme exemples (« Imagine Léa… »), FAQ « 8 semaines » et « 50 XP par semaine » gardées, « 1 500+ membres », offre 2,99 €/mois et 24,99 €/an, humoristes nommés, aucune identité du fondateur sur le site.

## 1. TL;DR

1. Le contenu d'une étape est bien construit (étape 1 ouverte d'emblée, rendu serveur, quiz, vidéos, retour au parcours après paiement), mais le **parcours autour est troué à trois moments clés** : le blocage de l'étape 2, la fin du parcours, le retour la semaine suivante.
2. **Blocage de l'étape 2 : le visiteur ne le voit jamais.** Les étapes 2 et suivantes sont verrouillées « Termine l'étape 1 pour débloquer », or terminer l'étape 1 demande déjà Premium. Le mur rédigé et validé en s16 (aperçu + prix) ne peut pas s'afficher pour un visiteur.
3. **Fin de parcours : la carte « Bravo » ne s'affiche pas quand on valide la dernière étape** (déduit du code, à confirmer sur le site), et la suite proposée tourne en rond.
4. **Rien ne fait revenir la semaine suivante** : toutes les étapes sont ouvertes d'un coup, aucun rappel, le streak compte les connexions et pas la pratique, l'accueil d'un abonné ne propose pas de « reprendre ».
5. Notes : C3 5, C4 4, C6 5, C7 5, C8 2, C12 4 (avis C1 : 5). Moyenne des 6 critères : 4,2/10.

## 2. Tableau des critères

| Critère | Note /10 | Preuve courte |
|---|---|---|
| C3 Découvrabilité et points d'entrée | 5 | Présent partout (en-tête « Parcours », pastilles et 3 cartes d'accueil, pied de page, encart d'article, quiz d'orientation) mais 27 vues de `/parcours` en 90 j (0,9 % des pages vues, snapshot 05/10), 9 à 13 par parcours ; le bouton principal de l'accueil mène au paiement, pas à l'étape gratuite ; l'abonné n'a aucun « reprendre » à l'accueil |
| C4 Parcours bout en bout | 4 | Mur de l'étape 2 inatteignable (`parcours-detail.tsx:539-544`), carte de fin absente à la dernière validation (`progress/route.ts:198` renvoie `completedAt` vide), suite de fin circulaire (`parcours-seed.json` nextParcours) |
| C6 UX/UI (lisibilité, mobile, accessibilité, progression) | 5 | Bien : cibles 44 px, rendu serveur, quiz et progression mémorisés, états de chargement et d'erreur écrits. Mal : gain d'XP visible 0,5 s, 4 faux « Parcours terminé ! », pas de focus visible sur l'en-tête d'étape, quiz corrigé par la couleur seule |
| C7 Conversion et valeur Premium | 5 | Cohérence de prix et de retour après paiement (`buildAbonnementUrl`, `PremiumWelcome`) ; mais mur rédigé jamais montré, événement `mur-vu` jamais déclenché pour un visiteur, message « tu peux valider l'étape » puis refus, aucun aperçu du contenu payant sur la page de décision |
| C8 Rétention et engagement | 2 | Aucune relance, aucun rythme réel (13 étapes ouvrables en une soirée), streak = nombre de connexions (`auth.ts:107-157`), profil « Prochaine étape » sans le parcours en cours, carnet mensuel non relié aux parcours |
| C12 Cohérence promesse / réalité | 4 | Vrai : étape 1 libre, prix, rythmes hebdomadaires. Faux ou flou : « un petit exercice par jour » et streak (le parcours est hebdomadaire), « vannes à pratiquer » (juste un lien générique), « Parcours terminé ! » affiché 4 fois trop tôt, XP total de fin faux, une vidéo « spectacle complet » dans un parcours « 20 min/semaine » |
| Avis C1 Quantité et couverture | 5 | 13 étapes au total, un parcours par persona (Sophie 3, Yanis 4, Marc 6) ; le plus court est épuisé en une soirée ; niveaux affichés identiques pour Machine à Café et Répartie (« Débutant → Intermédiaire ») ; aucune étape au-delà du niveau 1 |

## 3. Constats

Format de chaque constat : problème, effet pour l'utilisateur, ce qu'on fait (sans jargon), puis agent et effort. Le détail technique est dans l'annexe §7 (même numéro).

### UX-01 [P0] Le blocage de l'étape 2 n'existe pas pour le visiteur, et le verrou ment

- **Problème.** Sur `/parcours/<nom>`, les étapes 2 et suivantes sont grisées avec « Termine l'étape 1 pour débloquer » et on ne peut pas les ouvrir. Mais terminer (valider) l'étape 1 demande déjà Premium. Le texte validé en s16 (« La première étape est offerte, les suivantes viennent avec l'abonnement à 2,99 €/mois ») et l'aperçu de l'étape (ce que tu vas apprendre, format) ne s'affichent donc jamais pour un visiteur.
- **Effet.** Yanis lit l'étape 1, fait le quiz, et croit qu'il débloquera la suite gratuitement. À la fin du quiz le site lui dit « Tu peux valider l'étape », puis le seul bouton disponible dit « Valider l'étape fait partie de Premium ». Trois messages qui se contredisent au moment exact où il décide de payer. Sophie et Marc ne voient pour les étapes suivantes que le titre et les XP, alors que la page liste `/parcours` donne bien plus (détail, format).
- **Ce qu'on fait.** (1) Laisser le visiteur ouvrir les étapes 2 et suivantes en aperçu : « Ce que tu vas apprendre », format, durée estimée, et le texte du mur avec le bouton d'abonnement (le composant existe déjà, il est inatteignable). (2) Remplacer « Termine l'étape 1 pour débloquer » par « Fait partie de Premium » pour un visiteur, et garder « Termine l'étape N pour débloquer » seulement pour un abonné. (3) Pour un visiteur, remplacer « Tu peux valider l'étape » (fin du quiz) par « Bien joué. Pour garder ta progression, passe à Premium ». Une fois corrigé, l'événement de mesure `mur-vu` se déclenchera enfin (il est à 0 aujourd'hui côté visiteur).
- **Agent / effort.** @fullstack, rapide ; textes à valider avec Thomas (étalons du chemin Premium).

### UX-02 [P0] La carte de fin de parcours ne s'affiche pas quand on termine (à confirmer sur le site)

- **Problème.** Quand l'abonné valide la dernière étape, le serveur enregistre bien la fin du parcours et donne les +100 XP, mais renvoie au navigateur une fiche de progression où la fin n'est pas encore notée. Le navigateur n'utilise pas l'information « parcours terminé » qu'il reçoit aussi. Résultat : barre à « 3/3 étapes complétées » (et pas « Parcours terminé ! »), pas de carte « Bravo, tu as terminé… », pas de bouton vers la suite, jusqu'à ce que la personne recharge la page.
- **Effet.** Le plus beau moment du parcours (Marc qui termine ses 6 semaines) est un non-événement : un message d'XP de 3 secondes, puis rien. Aucune suite proposée au moment où l'envie d'enchaîner est maximale.
- **Ce qu'on fait.** Afficher la carte de fin dès la réponse du serveur « parcours terminé » ; ajouter un test automatique de ce moment précis (valider la dernière étape, vérifier que la carte apparaît sans recharger).
- **Agent / effort.** @fullstack puis @qa, rapide. Statut de la preuve : déduit de la lecture du code, non rejoué en navigateur (paiement réel nécessaire pour tester côté Premium).

### UX-03 [P0] Rien ne fait revenir la semaine suivante

- **Problème.** La promesse est « une étape par semaine, 15 à 20 minutes ». En réalité toutes les étapes s'ouvrent l'une après l'autre sans délai (seul verrou : valider la précédente) : un abonné peut faire les 13 étapes en une soirée. Aucun rappel n'existe : les seuls e-mails clients sont transactionnels (paiement, résiliation, rétractation, mot de passe, rappel annuel) et la notification mobile ne porte que la vanne du jour. L'accueil d'un abonné propose « Explorer les vannes / Voir les conseils », jamais « Reprendre ton parcours ». Le profil, lui, propose « Apprends les bases » ou « Approfondis tes techniques » (liens vers les conseils) même quand un parcours est en cours.
- **Effet.** Sophie (parcours de 3 étapes, 15 min/semaine) a tout vu au bout de 45 minutes, puis plus rien ne justifie 2,99 € par mois. Yanis qui s'arrête à l'étape 2 n'a aucune raison de revenir et personne ne le lui rappelle. Pas de rendez-vous, donc pas d'habitude, donc résiliation au 2e prélèvement.
- **Ce qu'on fait (choix par défaut, rythme doux, rien de bloqué).** (1) À la validation d'une étape : « Ton exercice de la semaine : [exercice]. Reviens le [date + 7 jours] pour l'étape suivante (tu peux continuer maintenant si tu veux) ». (2) Accueil et en-tête d'un abonné avec parcours en cours : bouton « Reprendre : Répartie, étape 3 ». (3) Profil : « Prochaine étape » = le parcours en cours en premier. (4) E-mail de rappel hebdomadaire de l'étape suivante, en brouillon à valider (règle projet), avec case d'accord à l'inscription ou au profil et désinscription en un clic ; contenu préparé à l'avance, pas écrit par une IA au fil de l'eau (décision 01/10). (5) Relier la fin d'un parcours au carnet mensuel (voir UX-06).
- **Agent / effort.** @product-manager (règle de rythme) puis @fullstack, @copywriter (textes, étalons à calibrer avec Thomas) et @legal (accord pour le rappel e-mail) ; moyen.

### UX-04 [P1] Le streak compte les connexions, et le site promet un rythme quotidien que les parcours ne portent pas

- **Problème.** Le streak n'est mis à jour qu'au moment de se connecter (`auth.ts:202-207`), et la connexion reste ouverte 30 jours : un abonné actif tous les jours garde un streak à 1. Valider une étape ne touche pas au streak. Et le site vend un rythme quotidien (« Un petit exercice par jour » en accueil, « 5 minutes chaque jour valent mieux qu'une heure par semaine » en FAQ, « un streak pour garder le rythme » sur les cartes Sophie et Marc) alors que le parcours est hebdomadaire.
- **Effet.** Marc voit « 1 jour de suite » après trois semaines de pratique : le compteur démotive au lieu de motiver. Sophie cherche l'exercice du jour dans son parcours et n'en trouve pas.
- **Ce qu'on fait.** Compter le streak sur l'action réelle (valider une étape, lire le contenu du jour) ou le retirer du profil et des textes d'accueil tant qu'il n'est pas juste ; dire clairement deux rythmes : « ton parcours : une étape par semaine » et « ton contenu du jour : 5 minutes » (la FAQ « 8 semaines / 50 XP par semaine » reste intacte, choix fondateur).
- **Agent / effort.** @fullstack (compteur) et @copywriter (textes), moyen. Décision à Thomas : garder le streak en le rendant juste, ou le retirer des textes.

### UX-05 [P1] Les récompenses de progression sont invisibles ou fausses

- **Problème.** (a) Le message « +50 XP gagnés ! » apparaît dans l'étape qui vient d'être validée, mais 0,5 s plus tard cette étape se referme et la suivante s'ouvre : le message disparaît presque aussitôt. L'animation « +X XP » globale du site existe mais n'est pas utilisée ici. (b) Le message ajoute « Parcours terminé ! » dès que le gain atteint 100 XP : c'est faux à l'étape 3 de Répartie, aux étapes 3, 4 et 5 de Confiance (4 faux messages sur 13 étapes). (c) La carte de fin et l'en-tête annoncent « 225 XP » (Machine à Café) alors que l'abonné en a gagné 325 : le bonus de fin de parcours (+100) n'est annoncé nulle part. (d) Après validation, rien ne fait défiler la page vers l'étape suivante ni ne déplace le curseur clavier.
- **Effet.** Le « petit plaisir » de la gamification, pilier du persona Yanis (progression mesurable), est raté. Marc, à l'étape 3 sur 6, lit « Parcours terminé ! » puis constate qu'il reste trois étapes : le site se contredit sur un sujet sensible pour lui (retrouver confiance).
- **Ce qu'on fait.** Garder le message visible 3 s sans refermer l'étape avant (ou notification globale), n'écrire « Parcours terminé ! » que quand le serveur le confirme, annoncer le bonus de fin avant (« +100 XP à la dernière étape »), faire défiler jusqu'à l'étape suivante et lui donner le focus.
- **Agent / effort.** @fullstack, rapide.

### UX-06 [P1] La suite proposée en fin de parcours tourne en rond et ignore ce que la personne a déjà fait

- **Problème.** Chaque parcours renvoie vers un « parcours suivant » fixe : Machine à Café vers Répartie, Répartie vers Confiance, Confiance vers Machine à Café. Le bloc « Tu y prends goût ? Jette un œil au parcours suivant » s'affiche aussi en cours de route. Un abonné qui a fini les trois se voit proposer de recommencer le premier. Aucun lien vers le carnet mensuel (seule autre valeur récurrente de Premium), aucun récapitulatif, aucune invitation à pratiquer.
- **Effet.** Après 13 semaines, la personne arrive au bout et le site ne sait pas quoi lui dire : « Passer au parcours suivant » la renvoie sur un parcours terminé. Marc finit Confiance (sa fin de parcours est la plus chargée émotionnellement) et se voit proposer… Machine à Café, un parcours « bureau ».
- **Ce qu'on fait.** Proposer le premier parcours non terminé ; si tout est terminé : « Tu as fait les 3 parcours. Ton carnet du mois t'attend » (lien carnet) et un récapitulatif (étapes, XP, ce que tu sais faire maintenant). Retirer le bloc « parcours suivant » en cours de route pour un abonné qui n'a pas fini, ou le garder seulement s'il aide (à décider avec les données).
- **Agent / effort.** @fullstack et @copywriter, rapide à moyen.

### UX-07 [P1] Le contenu d'une étape ne tient pas tout ce que le format annonce

- **Problème.** Le format annoncé est « Conseil technique + vannes à pratiquer + vidéo + quiz ». Les « vannes à pratiquer » se résument à « 5 vannes sélectionnées pour ce module. Découvre-les dans le catalogue », avec un lien vers `/vannes` en général : on ne voit pas les 5 vannes choisies. La validation de l'étape (« Valider cette étape ») se fait juste après le quiz, donc avant d'avoir pratiqué l'exercice, qui est pourtant le cœur de la valeur. Aucune durée n'est indiquée par étape, et la dernière étape de Confiance contient « Pulsions (spectacle complet) » de Kyan Khojandi : un spectacle entier dans un parcours à « 20 min/semaine » (durée non mesurée, déduite du titre).
- **Effet.** Yanis cherche ses 5 vannes, tombe sur la liste générale (limitée à 10 sans abonnement) et décroche. Sophie, pressée, ne peut pas savoir si l'étape tient dans sa pause. Valider avant de pratiquer apprend à cocher, pas à répondre du tac au tac.
- **Ce qu'on fait.** Afficher les 5 vannes de l'étape (liste courte repliable, comme le contenu du jour) ; indiquer « environ 15 min » et la durée de chaque vidéo ; remplacer le spectacle complet par un extrait (ou l'annoncer comme bonus facultatif) ; changer le bouton en « J'ai fait l'exercice » avec l'exercice rappelé juste au-dessus (et, plus tard, une question « Comment ça s'est passé ? » en un tap).
- **Agent / effort.** @fullstack (vannes, durée), @copywriter (formulations), @creative-strategy pour trancher le rôle de « valider » ; moyen.

### UX-08 [P1] Les parcours sont peu découverts, et l'accueil n'envoie pas vers l'étape gratuite

- **Problème.** Mesure du 05/10 : 27 vues de `/parcours` en 90 jours, 13, 13 et 9 vues pour les trois parcours, sur 2 919 pages vues (la moitié du trafic arrive par un seul article de blagues, avec une intention « rire », pas « apprendre » ; l'encart de parcours en bas d'article existe mais le thème de cet article ne le mène pas forcément à un parcours pertinent, non vérifié). Le gros bouton de l'accueil, « Accéder aux parcours complets », mène à l'inscription puis au paiement, sans passer par l'étape gratuite ; l'étape gratuite n'est qu'une phrase en note et les trois pastilles sous le bouton. Pour un abonné, l'accueil et l'encart de fin d'article (« Continuer mon parcours ») renvoient à la liste, pas au parcours en cours. Aucun lien vers un parcours depuis le contenu du jour (vanne, conseil, vidéo).
- **Effet.** Yanis (anxieux à l'idée de payer) lit « Accéder aux parcours complets » et doit payer avant d'avoir goûté. Le visiteur qui aurait aimé l'étape 1 passe à côté ; la page où l'on décide n'est visitée que par quelques personnes par mois.
- **Ce qu'on fait.** (1) Sous le bouton principal de l'accueil, remplacer « Voir les vannes gratuites » par « Lire gratuitement l'étape 1 » (modification d'un lien secondaire, pas de l'étalon 1.2 validé ; à confirmer par Thomas). (2) Dans le contenu du jour, une ligne « Ce conseil fait partie de l'étape 2 du parcours Répartie » quand c'est le cas. (3) Vérifier à quel parcours mène l'article n°1 (mappage par thème) et le tester. (4) « Reprendre mon parcours » pour les abonnés (voir UX-03).
- **Agent / effort.** @growth et @fullstack, rapide à moyen.

### UX-09 [P1] Accessibilité : plusieurs points qui bloquent le clavier et le lecteur d'écran

- **Problème.** (a) L'en-tête de chaque étape est un bouton fait maison sans contour de focus (rien dans `globals.css`, aucune classe `focus-visible`) : au clavier, on ne voit pas où l'on est. (b) Quiz : bonne et mauvaise réponses ne se distinguent que par la couleur (vert/rouge) ; aucune annonce vocale du résultat ; le focus reste sur la réponse au lieu d'aller sur « Question suivante ». (c) Le message d'XP est dans une zone vocale qui disparaît avec l'étape refermée : il n'est jamais annoncé. (d) Après « Valider cette étape », le bouton disparaît et le focus retombe en haut de page.
- **Effet.** Une personne qui navigue au clavier ou au lecteur d'écran ne peut pas suivre son avancée ; une personne daltonienne ne voit pas la correction du quiz. Non conforme à l'objectif WCAG 2.2 AA du projet (focus visible, 2.4.7 ; information non portée par la couleur seule, 1.4.1).
- **Ce qu'on fait.** Contour violet visible sur l'en-tête d'étape ; icône et texte « Bonne réponse » / « Pas tout à fait » dans le quiz, annoncés ; déplacer le focus sur le titre de l'étape suivante après validation ; zone d'annonce permanente pour le gain d'XP.
- **Agent / effort.** @fullstack, rapide ; @design pour l'icône et le texte du quiz.

### UX-10 [P2] Les quiz d'orientation se contredisent, et le niveau affiché ne guide pas

- **Problème.** (a) Il y a trois quiz sans lien entre eux (orientation de `/parcours`, `/onboarding`, `/quiz-humour`). (b) Dans le quiz de `/parcours`, répondre « Partout, je veux retrouver ma légèreté » envoie toujours vers Confiance, même si la personne dit ensuite « je ne sais pas quoi répondre » ; l'onboarding, lui, ne le fait pas (même fonction, mais « partout » n'y transmet aucun signal). (c) L'onboarding n'est plus proposé à personne après le paiement (la redirection du visiteur va à `/abonnement`, le paiement renvoie vers `/parcours`) et son bouton « Tout débloquer à 2,99 €/mois » s'afficherait aussi à un abonné ; le prix y est écrit en dur. (d) Les niveaux affichés sont identiques pour Machine à Café et Répartie (« Débutant → Intermédiaire »), et Confiance affiche « Débutant → Expert », peu rassurant pour qui sort d'une période difficile (« sans te forcer »).
- **Effet.** Yanis (introverti) répondra le plus souvent « j'ai perdu confiance » et sera dirigé vers Confiance, le parcours écrit pour Marc (« tu sors d'une période compliquée »), alors que Répartie lui convient mieux. Aucune différence de niveau lisible entre les deux premiers parcours.
- **Ce qu'on fait.** Un seul quiz court, présenté en tête de `/parcours` et en fin de `/quiz-humour` ; « Partout » ne tranche pas seul (la douleur nommée l'emporte) ; supprimer ou rebrancher `/onboarding` ; niveaux distincts : Machine à Café « Débutant », Répartie « Débutant → Intermédiaire », Confiance « À ton rythme » (formulation à valider).
- **Agent / effort.** @product-manager (règle), @fullstack, @copywriter ; moyen.

### UX-11 [P2] États et petites ruptures à nettoyer

- Un abonné dont le chargement du contenu échoue en silence peut voir « Chargement du contenu de l'étape… » sans fin ni bouton « Réessayer » (`parcours-detail.tsx:335-358, 644-647`).
- Pendant que la session se charge, un abonné voit une seconde l'invitation « Valider l'étape fait partie de Premium » (état « session en cours » traité comme visiteur) ; durée non mesurée.
- Reprise : la page s'ouvre sur l'étape 1 dépliée, puis saute à la première étape non faite une fois les données arrivées : décalage de page, surtout sur mobile.
- La liste `/parcours` affiche « Continuer ce parcours » même sur un parcours terminé, retrouve la progression par le titre (fragile), et affiche trois fois les mêmes titres (3 liens pour les robots puis 3 cartes) ; aucun « Reprendre » en haut pour un abonné.
- **Ce qu'on fait.** Bouton « Réessayer », contenu qui ne bascule pas de visiteur à abonné pendant le chargement, ouverture directe sur l'étape à reprendre, état « Terminé » sur la carte, progression retrouvée par identifiant. @fullstack, rapide.

## 4. Parcours des 3 personas (visiteur puis Premium)

Légende : OK = fluide ; `[FRICTION H{n}]` = heuristique de Nielsen n violée pour une première visite.

### Yanis, 20 ans, étudiant introverti, mobile, hésite à payer

| Étape | Ce qu'il voit et fait | Verdict |
|---|---|---|
| Découverte | Arrive d'une recherche « avoir de la répartie » sur un article, ou sur l'accueil. Pastille « Avoir de la répartie » ou carte « Je reste muet quand on me chambre » mène à `/parcours/repartie`. | OK. Mais le gros bouton de l'accueil le pousse vers le paiement : `[FRICTION H2]` à l'étape accueil, Yanis lit « Accéder aux parcours complets » comme « payer maintenant ». Solution : lien « Lire gratuitement l'étape 1 » à côté (UX-08). |
| Aperçu | La page s'ouvre directement sur l'étape 1 dépliée (« Lecture libre »), avec pourquoi, conseil, exemple, exercice, vidéos, quiz. Bon temps jusqu'à la valeur. | OK (point fort). Page très longue sur mobile (estimation non mesurée), aucun bouton d'abonnement avant la fin de l'étape. |
| Fin de l'étape 1 | Quiz fini : « Tu peux valider l'étape », puis « Valider l'étape fait partie de Premium » + « Voir l'offre Premium ». | `[FRICTION H4]` messages contradictoires (UX-01). Solution : « Bien joué. Pour garder ta progression, passe à Premium ». |
| Étape 2 | Titre grisé, « Termine l'étape 1 pour débloquer », non cliquable. | `[FRICTION H1]` il ne sait pas ce qui est derrière ni combien. Solution : aperçu ouvrable + prix (UX-01). |
| Paiement | Clic, `/abonnement` avec retour au parcours, inscription, Stripe, retour sur `/parcours/repartie?premium=bienvenue` avec le quiz de l'étape 1 déjà mémorisé. | OK : retour sur l'étape, quiz conservé (avec réserve : la mémoire du quiz est propre à l'onglet). Réassurance près du bouton : vue en s16. |
| Premium, étape 1 | Bouton « Valider cette étape », 4 questions de quiz déjà faites ou à faire. Valide : « +50 XP gagnés » pendant 0,5 s, l'étape 2 s'ouvre. | `[FRICTION H1]` récompense quasi invisible (UX-05). |
| Étapes suivantes | Il peut enchaîner les 4 étapes dans la soirée. | Pas de rythme (UX-03). |
| Fin | Valide l'étape 4 : message d'XP « Parcours terminé ! », pas de carte de fin. | `[FRICTION H1]` UX-02. Au rechargement : carte « Bravo » + « Passer au parcours Confiance » (écrit pour Marc). |
| Semaine suivante | Rien : pas d'e-mail, accueil « Explorer les vannes », streak à 1. | `[FRICTION H7]` UX-03, UX-04. |

### Sophie, 26 ans, active, pressée, ordinateur au bureau et mobile le soir

| Étape | Ce qu'elle voit et fait | Verdict |
|---|---|---|
| Découverte | Carte d'accueil « Je n'ai jamais rien de drôle à dire » : « Parcours Machine à Café · 3 semaines → ». Ou encart de bas d'article « Sois drôle au bureau sans avoir l'air d'essayer ». | OK, bon ton, promesse courte (15 min). |
| Aperçu | Étape 1 « Des vannes courtes, faciles à ressortir » : 2 vidéos (Paul Séré, Karim Duval), 4 questions. Pas de durée affichée. | `[FRICTION H10]` elle ne sait pas si cela tient en 15 min (UX-07). Solution : « environ 15 min ». |
| Décision | Mêmes messages contradictoires qu'avec Yanis ; l'étape 2 « Sentir le bon moment » est exactement ce qu'elle voudrait lire, mais elle n'en voit que le titre. | UX-01. |
| Premium | Étape 1 validée, étapes 2 et 3 enchaînées : parcours fini en moins d'une heure ; 100 XP de bonus non annoncés. | La plus exposée au problème de rythme : 3 étapes seulement (UX-03). |
| Fin | Pas de carte de fin au moment de la dernière validation (UX-02), puis « Passer au parcours Répartie » (suite plausible pour elle). | Suite acceptable, mais sans carnet ni récap. |
| Semaine suivante | Plus rien à faire dans son parcours ; le carnet du mois existe (nav « Carnet ») mais n'est jamais cité. | UX-06. |

### Marc, 34 ans, en reconstruction, veut des repères et de la douceur

| Étape | Ce qu'il voit et fait | Verdict |
|---|---|---|
| Découverte | Carte « J'ai perdu ma légèreté » vers `/parcours/confiance`, ou le quiz d'orientation (« J'ai perdu confiance en moi » mène à Confiance, juste pour lui). | OK. Badge de niveau « Débutant → Expert » : peu cohérent avec « sans te forcer » (UX-10). |
| Aperçu | Étape 1 « Redécouvrir ce qui te fait rire » : « pas d'exercice à rater », bon ton. Vidéos Frayssinet, Pierre Croce. Quiz correct. | OK (point fort : le texte d'étape est calibré pour lui). |
| Décision | Il voit 6 étapes dont 5 grisées ; il ne voit pas le détail de la progression qu'on lui promet. | UX-01. |
| Premium | Valide les étapes ; à l'étape 3, 4 et 5 : « +100/125/150 XP gagnés ! Parcours terminé ! » alors qu'il en reste. | `[FRICTION H1]` faux message de fin (UX-05), sensible pour son profil. |
| Fin (étape 6) | « +300 XP » puis aucune carte ; il recharge pour la voir : « Passer au parcours Machine à Café » (déjà proposé pour Sophie). | UX-02, UX-06. |
| Semaine suivante | Aucun rendez-vous, streak à 1. Pour lui, la régularité est la valeur (« progression mesurable ») et elle n'est pas portée. | UX-03, UX-04. |

## 5. Audit heuristique Nielsen 10 (parcours d'apprentissage)

| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | FAIL | Barre « N/M étapes » et coche d'étape (PASS) ; mais carte de fin absente à la dernière validation, XP visible 0,5 s, faux « Parcours terminé ! » (`parcours-detail.tsx:757`), pas de date de prochaine étape |
| H2 Langage du persona | PASS partiel | Tutoiement, ton « pote drôle » (erreurs « ce parcours a raté son entrée en scène », « La connexion a lâché en route ») ; mais « Valider l'étape fait partie de Premium » pour quelqu'un qui n'a pas compris qu'il y aurait un « valider » |
| H3 Contrôle / annulation | PASS | Étapes repliables, retour au parcours, quiz refaisable, « Refaire le quiz » ; aucune action destructive |
| H4 Cohérence | FAIL | « Tu peux valider » contre « Valider fait partie de Premium » ; « Termine l'étape 1 pour débloquer » alors qu'elle est payante ; quotidien (accueil, FAQ) contre hebdomadaire (parcours) ; niveaux identiques |
| H5 Prévention d'erreurs | PASS | Validation séquentielle côté écran et côté serveur (403 pour un non-abonné), limite de débit avec message humain, quiz mémorisé en cas de détour par l'inscription |
| H6 Reconnaissance > rappel | PASS partiel | Rappel du pourquoi, du format et de l'exercice dans l'étape ; mais l'exercice n'est plus visible à la validation et les vannes de l'étape ne sont pas montrées |
| H7 Raccourcis experts | FAIL | Pas de « Reprendre » (accueil, en-tête, e-mail), pas de lien direct vers l'étape à faire depuis le profil |
| H8 Minimalisme | PASS partiel | Étape dépliée une à la fois ; mais étape 1 très dense (7 blocs + 2 vidéos + quiz) sans table des matières, et 3 titres de parcours affichés deux fois sur `/parcours` |
| H9 Messages d'erreur humains | PASS partiel | 429, échec de validation, perte de connexion bien écrits ; chargement de l'étape qui peut rester bloqué sans « Réessayer » |
| H10 Aide contextuelle | FAIL | Aucune durée par étape, aucune explication de ce que « valider » signifie ni de ce qu'est un XP avant d'y être, pas d'aide sur l'ordre des étapes |

## 6. Mobile 375 px, accessibilité, états, HEART, tests

**Mobile 375 px (lu dans les classes Tailwind, non rendu).** PASS : bouton `sm` à 44 px sous 768 px (`button.tsx` `max-md:h-11`), résumé « Programme » `min-h-[44px]`, liens de fil d'Ariane `max-md:py-3.5`, boutons de paiement `min-h-[44px]`/`min-h-10`, quiz d'orientation en colonne (`flex-col sm:flex-row`), modules de programme empilés (`flex-col`). À surveiller : étape 1 très longue avec l'unique appel à l'action en bas, sans barre collante (proposition de s12 non reprise) ; ligne niveau + durée en `flex` sans retour à la ligne sous l'icône (`parcours-detail.tsx:480-485`) ; bouton « Question suivante » à 44 px mais aligné à droite loin du pouce. Pas de capture : à confirmer en rendu réel.

**Accessibilité (WCAG 2.2 AA).** PASS : saut au contenu, `aria-expanded` sur les étapes, `role="progressbar"` nommé, `role="alert"` sur l'erreur de validation, vidéos avec bouton nommé, `prefers-reduced-motion` global. FAIL : voir UX-09 (focus invisible, couleur seule, zone d'annonce démontée, focus perdu). Contrastes : texte secondaire `#B3B3B3` et muet `#9A9A9A` sur `#1F1F1F` suffisants (calcul sur les jetons, non mesuré à l'écran) ; vert et rouge du quiz sur fond teinté non calculés.

**États.** Chargement : squelette PASS (liste et détail). Vide : message « les parcours s'échauffent » (composant `ParcoursList`, probablement inutilisé, voir §8). Erreur : page d'erreur `error.tsx` PASS, message de chargement échoué PASS, blocage silencieux de l'étape (UX-11). Hors ligne : validation avec message humain PASS. Retour après 30 jours : un abonné retrouve sa progression mais atterrit sur l'étape 1 dépliée avant de sauter (UX-11). Connexion lente : contenu complet de l'étape 2+ arrivé seulement après hydratation et appel API (pas de squelette dédié).

**État des constats passés touchant les parcours.** Réglés : badge « Essai gratuit » remplacé par « Lecture libre » (s16 reco 16 ; `offre.ts:74`), « Connecte-toi pour valider » retiré (s12), prix et rythmes issus d'une source unique (`config/premium.ts`), lecteur vidéo intégré (T31), quiz mémorisé après inscription (T29), liens de l'accueil vers le parcours précis (T06), pastilles-liens (T02), programme replié (T24). Non réglés : « Prochaine étape » du profil sans parcours (s16 C14) ; mur d'étape 2 « non relu » en s16 : relu ici, il est inatteignable (UX-01) ; événement `mur-vu` (s16 reco 17) codé mais jamais déclenché pour un visiteur.

**Mesure HEART (propositions à passer à @data-analyst).**

| Flux | Dimension | Signal observable | Cible | Mesure |
|---|---|---|---|---|
| Découverte vers étape 1 | Adoption | `parcours-ouvert` puis `etape-lue` (à créer) par source | ≥ 60 % des arrivées sur `/parcours/*` lisent l'étape 1 | Umami |
| Étape 1 vers paiement | Conversion | `mur-vu` (parcours-etape) puis `abonnement-clic` src `parcours-etape` puis `abonnement-reussi` | à calibrer (aucune donnée) | Umami + Stripe |
| Avancée | Task success | `parcours-etape` (existe) par étape ; `parcours-termine` (à créer) | ≥ 90 % de ceux qui commencent une étape la valident ; 60 % valident l'étape 2 sous 7 jours (cible s11) | Base + Umami |
| Retour hebdomadaire | Rétention | Abonnés avec une validation chaque semaine / abonnés actifs | [HYPOTHÈSE : ≥ 50 % à 4 semaines, à valider] | Base |
| Fin de parcours | Happiness | Question « Ce parcours t'a servi ? » 0-10 en carte de fin | ≥ 8/10 | Umami |

**Tests UX.**

| Test | Résultat |
|---|---|
| Parcours persona sans aide | Yanis, Sophie, Marc : frictions UX-01 à UX-05 (voir §4) |
| Charge cognitive (≤ 3 actions principales par écran) | PASS sur `/parcours/*` en repli ; FAIL sur étape 1 dépliée pour un visiteur (vidéos, quiz, abonnement, étapes 2+ : 4 familles d'actions) |
| Time-to-value | PASS : visiteur voit le contenu de l'étape 1 dès l'arrivée (0 étape) ; valeur « suivre ma progression » : 3 étapes (inscription, paiement, retour) |
| Edge cases | Voir états ci-dessus |
| Accessibilité | FAIL partiel (UX-09) |

**Agents spécialisés recommandés (@agent-factory).**

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| testeur-persona (Yanis, Sophie, Marc) | Simulation | Rejouer chaque étape en visiteur puis abonné, noter ce qui donne envie de revenir | Les 3 trous majeurs sont des moments de ressenti (mur, fin, retour) | Haute |
| validateur de rythme hebdomadaire | Workflow métier | Vérifier que l'exercice de la semaine tient en 15-20 min et qu'il se pratique hors écran | La promesse centrale et le rythme ne sont validés par personne | Moyenne |

## 7. Annexe technique (par constat)

| ID | Fichier:ligne | Détail |
|---|---|---|
| UX-01 | `parcours-detail.tsx:539-544` | `isSequentiallyLocked = !previousStepsCompleted && !isCompleted` ; pour un visiteur `completedSteps` est vide, donc `canExpand` est faux dès l'étape 2 : `LockedStepPreview` (`:92-120`, événement `mur-vu` `:94-96`) n'est atteint que par un ancien compte gratuit ayant déjà validé l'étape 1. `:611-615` texte « Termine l'étape … » ; `:168-170` fin de quiz « Tu peux valider l'étape » ; `:798-809` bloc « Valider fait partie de Premium » ; `offre.ts:78-80` texte du mur jamais rendu. |
| UX-02 | `api/parcours/[id]/progress/route.ts:160-198` | `progress` = résultat de l'`upsert` (avant la mise à jour de `completedAt` faite à part en `:186-189`, dont le résultat n'est pas réutilisé) ; la réponse renvoie cet objet (`completedAt` nul). Client : `setProgress(data.progress)` (`:402`) ; `isPathCompleted` lu dans `progress.completedAt` (`:459`) ; `data.pathCompleted` jamais lu. |
| UX-03 | `lib/email.ts:30-38`, `api/cron/daily-push/route.ts`, `hero-section.tsx:50-64`, `profil-dashboard.tsx:287-344`, `parcours-detail.tsx:532-542` | Types d'e-mail client : 8, tous transactionnels. Aucune date de déverrouillage par étape ; seule règle d'ordre : étapes précédentes validées. |
| UX-04 | `lib/auth.ts:107-157, 190-207` | `updateStreak` appelé seulement quand `user` est présent dans le callback `jwt` (connexion) ; session de 30 jours ; `api/user/xp/route.ts` et `progress/route.ts` n'y touchent pas. `hero-section.tsx:21`, `lib/faqs.ts:24,45`, `(dashboard)/page.tsx:106,138`. |
| UX-05 | `parcours-detail.tsx:404-412, 754-760` ; `ui/xp-notification.tsx` | `setTimeout(setExpandedStep(next), 500)` alors que le message d'XP est rendu dans l'étape qui se referme ; condition `xpGained.xp >= 100`. XP des étapes (seed) : Machine 50/75/100, Répartie 50/75/100/150, Confiance 50/75/100/125/150/200 ; bonus +100 (`progress/route.ts:190-195`) ; `totalXp` (`:460`) sans bonus. |
| UX-06 | `docs/content/parcours-seed.json` (`nextParcours`) ; `parcours-detail.tsx:830-866` | Boucle fixe machine-a-cafe, repartie, confiance, machine-a-cafe. |
| UX-07 | `parcours-detail.tsx:244-262, 773-784` ; seed Confiance étape 6 | `JokeTeaser` : compte et lien `/vannes` seulement. Vidéo `u41ujNodvnM` « Pulsions (spectacle complet) ». |
| UX-08 | `hero-section.tsx:66-84`, `article-cta.tsx:72-79`, `snapshot-trafic-2026-10-05.md` §4 | Premium : lien `/parcours` générique. |
| UX-09 | `parcours-detail.tsx:558-575, 187-206, 753-760` ; `styles/globals.css` | `role="button"` sans classe de focus ; `StepQuiz` vert/rouge par classes ; zone `aria-live` à l'intérieur du contenu replié. |
| UX-10 | `lib/parcours-orientation.ts:20-27, 43-56` ; `middleware.ts:28-33` ; `humor-quiz.tsx:209-215` ; `parcours-seed.json` `difficultyLabel` | Quiz de `/parcours` passe `global` brut ; onboarding mappe `GLOBAL` sans signal. |
| UX-11 | `parcours-detail.tsx:335-358, 644-647, 291-297, 330-333` ; `parcours-content.tsx:154-186, 303` | Échec de l'appel d'enrichissement silencieux ; `isPremium` exige `status === "authenticated"` ; titre comparé `hp.title === p.title`. |

## 8. Vérifié / Non vérifié (G_PROOF)

**Vérifié (lecture directe du code au 07/10, HEAD 79b11f3) :** tout ce qui est cité avec fichier:ligne ci-dessus ; les 3 étapes de mur (affichage, jeton `canExpand`, texte) ; l'API de progression (accès Premium, XP, bonus, réponse) ; le calcul du streak ; les points d'entrée (en-tête, accueil, pied de page, article, profil, onboarding, quiz) ; les contenus du seed (13 étapes, XP, vidéos, quiz) ; le trafic réel du snapshot du 05/10.

**Déduit sans exécution :** UX-02 (carte de fin absente) : raisonnement sur la réponse du serveur, à rejouer avec un compte Premium de test (branche Neon et clés Stripe test prévues à la prochaine session) ; UX-05 (0,5 s) : durée lue dans le code, non chronométrée ; contrastes du quiz ; durée des vidéos et de l'étape 1 sur mobile.

**Non vérifié :** rendu réel et captures (aucun navigateur utilisé, donc pas de `docs/qa/captures-parcours-apprentissage-s17/` de ma part) ; contenu des conseils en base (exemple et exercice de chaque étape, que le seed n'a pas) ; qualité pédagogique des exercices (hors périmètre, C2) ; usage réel de `ParcoursList` (`components/parcours/parcours-list.tsx`) : non importé dans les fichiers lus, annonce un bonus d'XP selon une autre formule (`steps*20+100`), à supprimer ou corriger si vivant ; page des quiz `/quiz-humour` (destination `recommendedPath` non lue) ; thème de l'article n°1 et parcours qu'il recommande ; mesure d'événements (aucune donnée de progression réelle : 2 abonnés à 0,99 € au 05/10).

## 9. Handoff

**Handoff vers @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/marrant/audit-parcours-apprentissage-s17/ux.md`.
- Décisions prises : note moyenne des 6 critères 4,2/10 ; 3 P0 (UX-01 mur de l'étape 2, UX-02 fin de parcours, UX-03 retour hebdomadaire), 6 P1, 2 P2.
- Points d'attention : UX-02 à confirmer par un test avec un compte Premium avant correction ; UX-01 et UX-05 sont des corrections rapides et indépendantes ; UX-03 demande une règle de rythme (@product-manager) et un accord légal pour un rappel par e-mail (@legal) ; décisions pour Thomas : (1) rythme doux (conseillé) ou verrouillage hebdomadaire, (2) streak : le rendre juste ou le retirer des textes, (3) lien secondaire de l'accueil « Lire gratuitement l'étape 1 » (hors étalon 1.2, à confirmer).
- À ajouter à la prochaine session : événements `parcours-ouvert`, `etape-lue`, `parcours-termine` ; test E2E de la dernière validation ; captures mobile 375 px des 3 parcours en visiteur et en Premium.
