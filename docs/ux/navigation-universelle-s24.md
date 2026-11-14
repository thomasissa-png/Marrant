# Navigation universelle et gabarits de page (s24)

Principe : UN seul en-tête, 65 px de haut, sur toutes les pages, à toutes les largeurs. Aucune seconde barre. L'espace de l'abonné devient une entrée de ce menu, pas un autre site.
Contexte lu : en-tête actuel (`header.tsx`), barre de l'espace (`espace-barre.tsx`), gabarit (`gabarit.ts`), décisions du 17-18/10 et du 12/11, captures de diagnostic. Le pied de page n'a pas été relu : sa liste est à confronter (§2).

## 1. Les trois états de lecteur

Le visiteur et l'inscrit gratuit partagent la même base. Il n'y a plus de compte gratuit à créer (décision du 05/10) : l'état « inscrit gratuit » ne concerne que les 12 comptes existants.

### Ordinateur, 1280 px (logo, liens, recherche, actions)

| Élément (de gauche à droite) | Visiteur | Inscrit gratuit | Abonné Premium |
|---|---|---|---|
| Logo « deviens-marrant.fr » | lien vers l'accueil | idem | idem |
| Menu déroulant « Mon espace » | absent | absent | présent, premier de la liste (§4) |
| Liens | Parcours, Vannes, Conseils, Vidéos, Articles, La lettre | idem | Parcours, Vannes, Conseils, Vidéos, Articles (« La lettre » absente : l'abonné la reçoit chaque semaine et la relit dans Mon espace) |
| Recherche | champ de 176 px | idem | idem |
| Cloche | absente | absente | icône, point violet si nouveauté, panneau déroulant |
| Bouton d'offre | « Premium · 1,99 €/mois » (plein) | idem | absent |
| « Connexion » | lien texte à gauche du bouton | absent | absent |
| Menu du compte (icône bonhomme) | absent | Favoris, Mon profil, Déconnexion | Mon profil, Déconnexion |

Le lien de la page en cours est surligné (même style qu'aujourd'hui). Sur les pages de paiement (/abonnement, /register) le bouton d'offre est masqué (règle existante, inchangée).

### Tablette, 768 px (et jusqu'à 1023)

Le menu des liens passe dans le bouton « Menu ». Dans la barre, de gauche à droite : logo, loupe (ouvre le champ de recherche sous l'en-tête), puis :
- visiteur : « Connexion » (lien), « Premium · 1,99 €/mois » (plein), Menu ;
- inscrit gratuit : bouton d'offre, icône du compte, Menu ;
- abonné : cloche, icône du compte, Menu (pas de bouton d'offre).

De 1024 à 1279 px : comme à 1280 mais la recherche est une loupe et le bouton d'offre dit « Premium » (mesuré par le budget actuel).

### Téléphone, 375 px

- Visiteur et inscrit gratuit : logo, « Premium » (plein, 44 px), Menu. « Connexion », recherche et compte sont dans le menu (sous 440 px la recherche est en tête du menu).
- Abonné : logo, loupe, cloche, Menu. Le compte est dans le menu.

### Menu mobile (même contenu que le menu de bureau, mêmes mots, même ordre)

Panneau sous l'en-tête, défilant, fermable par Échap, croix et clic sur le voile. Ordre :
1. Champ de recherche (sous 440 px seulement).
2. Abonné seulement : groupe « Mon espace » (Aujourd'hui, Quoi répondre, Bibliothèque, Mes questions, Lettres, Favoris, Mes répliques, S'entraîner, Quiz d'humour, Carnet), ouvert par défaut.
3. Groupe « Parcours et contenus » : Parcours, Vannes, Conseils, Vidéos, Articles.
4. Visiteur et inscrit gratuit : La lettre.
5. Séparateur, puis visiteur : bouton « Premium · 1,99 €/mois » plein, « Connexion » ; inscrit gratuit : bouton plein, Favoris, Mon profil, Déconnexion ; abonné : Mon profil, Déconnexion.

## 2. Catégories : menu principal, menu Mon espace ou pied de page

Critère : une rubrique est dans la barre si l'utilisateur la cherche d'emblée ET si elle mène à la conversion ou à un contenu qui se positionne sur Google. Les adresses ne changent pas.

| Rubrique | Où | Justification |
|---|---|---|
| Parcours (/parcours) | Barre, 1er lien | C'est ce qu'on vend ; la conversion est la priorité (19/10) ; l'intention « apprendre à répondre » vient avant « picorer » |
| Vannes, Conseils, Vidéos | Barre | Pages qui se positionnent, porte d'entrée gratuite, l'abonné y revient chaque jour |
| Articles (/blog) | Barre | Premier trafic Google ; libellé « Articles » gardé (18/10) |
| La lettre | Barre (visiteur, inscrit gratuit) | Décision du 17/10 ; absente pour l'abonné qui la reçoit |
| Accueil | Logo seulement | Un onglet « Accueil » double le logo et coûte 70 px de largeur |
| Aujourd'hui, Quoi répondre, Bibliothèque, Mes questions, S'entraîner, Mes répliques, Lettres, Carnet, Favoris, Quiz d'humour | Menu « Mon espace » | Usage d'abonné, jamais cherché par un visiteur |
| Quiz d'humour, Blague du jour, Glossaire, Anatomie d'une vanne | Pied de page (et accueil pour le quiz) | Entrées ponctuelles : un quiz se fait une fois |
| À propos, Intégrer la vanne du jour, mentions légales, CGU, confidentialité, rétractation, résiliation | Pied de page | Pages de confiance et de service, pas de navigation quotidienne |
| Profil, déconnexion | Menu du compte | Réglages, pas contenu |

Libellés : 1 à 2 mots, pas d'emoji, pas de tiret cadratin. Le visiteur compte 6 liens (au plus 7 avec le bouton) : pas d'autre entrée dans la barre sans en retirer une.

## 3. Gabarits de page (3)

Tous : coque `max-w-7xl`, marges 16 px (375), 24 px (768), 32 px (1280), centrée. Le logo et le bord gauche des listes sont alignés. Titre de page (H1) en police du site, sous le fil d'Ariane, jamais de titre de page dans l'en-tête.

| Gabarit | Largeur du contenu | Titre et repères |
|---|---|---|
| A. Lecture | colonne centrée de 768 px (`COLONNE_LECTURE`), tout bloc pleine colonne | Fil d'Ariane au-dessus (public : Accueil, section, page ; espace : « Mon espace » puis page) ; sur mobile, seulement « Retour : {parent} » ; H1 aligné sur la colonne |
| B. Liste ou grille | pleine coque ; grille 1 colonne (375), 2 (768), 3 (1280) ; texte courant limité à 768 px | Fil d'Ariane ou lien retour ; H1 ; une phrase d'intro ; filtres sous l'intro, en ligne et repliables sur mobile |
| C. Tableau de bord | pleine coque ; cartes en grille 1 colonne (375), 2 égales (768 et 1280) ; la carte du jour est pleine largeur en tête | Pas de fil d'Ariane (page d'accueil d'une zone) ; H1 puis une ligne de contexte |

Interdits : colonne de 720 px collée à gauche, menu latéral, mini bloc collé au bord gauche avec un vide à droite.

Correspondance (espace) : Aujourd'hui /mon-espace = C ; S'entraîner = C ; Profil /profil = C ; Quoi répondre, Bibliothèque, Mes répliques, Lettres, Mes questions (liste) = B ; une situation, une fiche (jeu, bilan, vocabulaire, humour noir), un bonus, une lettre, un fil de question = A.
Correspondance (site) : accueil = hors gabarit (page de vente, inchangée) ; Vannes, Conseils, Vidéos, Articles, Parcours (liste), Glossaire, Favoris, thème de vannes, Carnet (liste) = B ; vanne, conseil, vidéo, article, parcours (étape), carnet du mois, Lettre, Abonnement, Quiz d'humour, Blague du jour, À propos, pages légales = A.

## 4. Navigation interne de l'espace

Pas de seconde barre. Démonstration : (1) la barre ajoute 46 px, soit 111 px collés en haut sur 667 px d'écran mobile (17 %) ; (2) 6 entrées défilantes cachent des rubriques au doigt (indice par fondu, accroche, chevron : une mécanique lourde pour un défaut de découverte) ; (3) elle a été rejetée par Thomas comme « innavigable » et rompt l'identité de l'en-tête. À la place, trois moyens complémentaires :
1. Le menu déroulant « Mon espace » dans l'en-tête, sur chaque page. Contenu en 3 groupes : (sans titre) Aujourd'hui, Quoi répondre, Bibliothèque, Mes questions (avec point violet si réponse non lue) ; « S'entraîner » : S'entraîner, Mes répliques, Quiz d'humour ; « Mon contenu » : Favoris, Lettres, Carnet. « Parcours » reste dans la barre (une seule fois).
2. Aujourd'hui est la page pivot : sous la carte du jour, une rangée de 4 cartes d'accès (Quoi répondre, Bibliothèque, Mes questions, Parcours) avec une phrase chacune.
3. Chaque page de l'espace porte un lien retour (« Aujourd'hui » ou la rubrique parente) et le menu « Mon espace » garde l'entrée courante surlignée (aria-current).
Chemins : toute page de l'espace est à 2 clics de n'importe où (ouvrir « Mon espace », choisir). Après connexion ou paiement : Aujourd'hui (C14 inchangé).

## 5. Critères de réussite (relecture à l'aveugle, 10/10)

1. À 375, 768 et 1280 px, l'en-tête d'un même état est identique au pixel près (hauteur 65 px, éléments, positions) sur toutes les pages, accueil, parcours, espace, légales et connexion comprises.
2. Aucune seconde barre sous l'en-tête, nulle part.
3. Le visiteur voit exactement les 6 liens du §1 dans l'ordre, l'abonné « Mon espace » + 5 liens ; aucun lien deux fois dans la barre et le menu de l'espace.
4. À 1280 px, aucun contenu n'est collé à gauche avec un vide à droite : chaque page suit A, B ou C, et le bord gauche du H1 des pages B et C est celui du logo.
5. Toute page de la correspondance est atteignable en 2 clics depuis l'en-tête (3 depuis une page profonde).
6. Aucun libellé coupé, aucun débordement, de 320 à 1920 px, dans les 3 états (le test `header-budget` est étendu aux 3 états).
7. Clavier complet : Tab, flèches et Échap dans « Mon espace » et le menu mobile ; focus visible ; cibles de 44 px ; contraste AA ; le menu mobile garde le focus et le rend au bouton.
8. Le lien de la page courante est signalé (surlignage et aria-current), y compris sur les pages publiques pour l'abonné.
9. Pages d'espace : aucune ne dépend d'une barre pour être comprise (titre, lien retour, état vide expliqué).
10. Visiteur et référencement inchangés : mêmes URL, mêmes liens dans le HTML serveur, aucune redirection ajoutée ; « Mon espace » et la cloche ne sont chargés que pour l'abonné.
11. Trajet de conversion inchangé : bouton « Premium » visible à toutes les largeurs pour visiteur et inscrit gratuit, masqué sur les pages de paiement.
12. Mesure : événements à ajouter pour clic dans « Mon espace » (entrée choisie) et clic sur le menu mobile, à confier à @data-analyst.

## 6. Écarts aux décisions passées (à confirmer par Thomas)

- [CHOIX UTILISATEUR] « ROUVRE : Q3 (12/11), barre de rubriques sous l'en-tête » remplacée par un menu déroulant « Mon espace » dans l'en-tête unique.
- [CHOIX UTILISATEUR] « ROUVRE : Q11 (12/11), barre de l'espace sur les pages publiques pour l'abonné » remplacée par le même en-tête sur toutes les pages (l'abonné y retrouve « Mon espace » partout).
- [CHOIX UTILISATEUR] « ROUVRE : C1 (12/11), barre Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus » : mêmes rubriques, mais Parcours passe dans la barre du site et « Plus » est supprimé (ses lignes sont réparties dans Mon espace).
- [CHOIX UTILISATEUR] « ROUVRE : menu du site, onglet Accueil retiré (le logo le remplace) et Parcours placé en premier, avant Vannes. »
- [CHOIX UTILISATEUR] « ROUVRE : l'onglet Carnet des abonnés (menu actuel) passe dans Mon espace. »
- [CHOIX UTILISATEUR] « ROUVRE : Favoris quitte le menu du compte de l'abonné pour Mon espace (il reste dans le menu du compte de l'inscrit gratuit). »
- [CHOIX UTILISATEUR] « ROUVRE : l'espace de l'abonné n'a plus sa propre colonne de 720 px collée à gauche : gabarits A, B et C. »
- Non rouvert : « La lettre » dans le menu (17/10), « Articles » (18/10), conversion prioritaire, pas de compte gratuit (05/10), bouton d'offre « Premium · 1,99 €/mois », cloche à point violet (E5).

## Risques

- Ordre « Parcours » en premier : peut déplacer des clics des Vannes (principal trafic), à mesurer sur 2 semaines.
- Doublon de sens entre « Bibliothèque » (contenu neuf) et les liens Vannes, Conseils, Vidéos : à lever par un libellé d'aide dans le menu (« contenu réservé aux abonnés »).
- « Mon espace » en menu coûte un clic de plus que la barre pour Aujourd'hui : compensé par le retour après connexion, la page pivot et les cartes d'accès.
- Retirer la barre supprime du code et des tests (ancres, `scroll-padding`) : à planifier avec @fullstack.
