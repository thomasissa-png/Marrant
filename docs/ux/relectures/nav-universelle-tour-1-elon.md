# Relecture à l'aveugle, tour 1 (elon) : `docs/ux/navigation-universelle-s24.md`

AVIS CONSULTATIF : validation requise avant exécution.

## Note : 7,6 / 10

Le principe est bon : on supprime au lieu d'ajouter. Un en-tête unique, plus de seconde barre ni de colonne de 720 px collée à gauche, plus d'onglet « Accueil », trois gabarits A/B/C, et le « Plus » est supprimé. C'est la bonne direction et je ne la touche pas. Le problème #1, c'est que la spec optimise l'arborescence alors que la valeur se joue sur un seul geste : l'abonné revient chaque jour à « Aujourd'hui ». Ce geste coûte 2 clics, et le logo l'envoie sur une page de vente. Une usine bien rangée ne sert à rien si la porte d'entrée n'est pas celle par laquelle les ouvriers arrivent.

## Fautes dures (bloquent le 10)

**FD1. Le geste quotidien coûte 2 clics et le logo de l'abonné mène à la page de vente.**
Faute : §4 ferme « Mon espace » dans un menu déroulant de 10 entrées (la spec avoue « un clic de plus », l. 119). La compensation « retour après connexion » ne couvre pas le cas réel : une session ouverte et un retour par le logo ou l'adresse tapée, qui mènent à l'accueil (« page de vente, inchangée », l. 79). Sur mobile (abonné : logo, loupe, cloche, Menu), il faut toucher Menu, puis Aujourd'hui.
Correction exacte :
- §1 et §4 : pour l'abonné seulement, le logo pointe vers `/mon-espace`. Le rendu est identique, seule la destination change, comme pour le bouton d'offre. Aucune redirection, Googlebot n'est jamais abonné, le critère 10 tient. C'est ce qui ramène le geste quotidien à 1 toucher à 375 px.
- « Mon espace » devient un lien direct vers `/mon-espace` : 1 clic, surligné (aria-current) sur toute page `/mon-espace/*`. L'argument « doublon du logo » (l. 58) ne vaut que pour le visiteur : chez l'abonné, la barre récupère les 182 px du bouton d'offre et ceux de « Connexion ».
- Le menu déroulant est supprimé, ce qui fait tomber les 3 groupes, le titre de groupe « S'entraîner » identique à son entrée « S'entraîner », la gestion des flèches du critère 7 et la ligne de risque l. 119. À la place, « Aujourd'hui » porte l'index COMPLET des rubriques de l'espace (une liste compacte, une ligne chacune, le point violet sur « Mes questions »), placé sous la carte du jour, et non 4 cartes avec une phrase (§4.2). Toute rubrique reste à 2 clics depuis n'importe où : « Mon espace », puis la rubrique.
- Menu mobile : le groupe ouvert de 10 entrées est remplacé par une ligne « Mon espace » en tête. Le panneau devient court, avec les mêmes mots que sur ordinateur.

**FD2. Contradiction interne sur le quiz.** L. 60 : le quiz va au pied de page parce qu'« un quiz se fait une fois ». L. 43 et 84 : « Quiz d'humour » est rangé dans « Mon espace », groupe « S'entraîner ». Correction : retirer « Quiz d'humour » de l'espace (pied de page et accueil suffisent), ou écrire en quoi le quiz de l'abonné diffère et se refait. Si rien n'est écrit, on le retire.

**FD3. Le pied de page n'est pas lu (l. 4), donc le §2 et le critère 5 sont faux.** Vérifié dans `footer.tsx` l. 12-37 : « Blague du jour » n'y figure pas (la page est orpheline côté navigation), le libellé est « Quiz humour » et non « Quiz d'humour », et « Nos offres » (`/abonnement`) comme « Comment devenir drôle » (pilier SEO) ne sont classés nulle part. Le critère 5 exige « 2 clics depuis l'en-tête » pour Glossaire, Blague du jour, À propos et les pages légales, qui ne sont pas dans l'en-tête.
Correction : au §2, ajouter la colonne « pied de page réel » recopiée de `footer.tsx`, puis décider pour la Blague du jour (l'ajouter au pied, ou la retirer de la correspondance A). Unifier le libellé du quiz. Critère 5 : « depuis l'en-tête ou le pied de page ».

## Pistes (ne bloquent pas le 10)

- P1. Risque « Bibliothèque contre Vannes, Conseils, Vidéos » (l. 118) : ne rien ajouter. Le libellé d'aide est un process de plus, et la Bibliothèque porte déjà les 3 liens (décision du 13/11). Supprimer la mesure d'atténuation.
- P2. « Parcours en premier, à mesurer sur 2 semaines » : sans seuil ni effectif minimal, ce n'est pas une mesure. Écrire la règle de retour arrière (seuil de clics vers `/abonnement` depuis l'en-tête, effectif minimal), ou retirer la phrase.
- P3. Gabarit C : la carte du jour en pleine largeur fait 1 216 px de ligne à 1 280. Limiter son texte à 768 px, comme en B.
- P4. Critère 1, « identique au pixel près » : ajouter « hors bouton d'offre masqué sur les pages de paiement » (l. 23 et 101), sinon le critère se contredit.

## Réponses de fond

- Navigation la plus simple ? Presque. Une fois FD1 appliquée, elle supprime un composant entier (le menu déroulant) au lieu d'en recréer un. Le superflu : le menu déroulant, les groupes, les 4 cartes à phrase, le libellé d'aide. Ce qui manque : la destination du logo pour l'abonné, et le pied de page.
- « Aujourd'hui » comme porte de l'abonné : oui, sans hésiter. C'est le seul écran qui porte l'action du jour (« Les cartes du jour »). Il doit être à 1 clic et servir aussi de sommaire de l'espace.
- Catégories : bonnes. Visiteur : Parcours, Vannes, Conseils, Vidéos, Articles, La lettre (conversion d'abord, choix du 17/10 respectés). Abonné : Mon espace + les 5 liens du site, ce qui garde l'identité de l'en-tête que Thomas réclame. Carnet, Lettres et Favoris dans l'espace : juste.
- Pour monter à 10 : appliquer FD1 à FD3. Ce sont 3 corrections, et 2 d'entre elles retirent du contenu à la spec.

---
Handoff → @ux (auteur) puis session principale. Ce sont des avis : Thomas décide. Le logo de l'abonné vers `/mon-espace` change un comportement, à lui présenter en une ligne.
