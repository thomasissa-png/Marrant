# Navigation v6 : menu des rubriques toujours affiché (s25)

Remplace en partie `navigation-universelle-s24.md` (v5). Décision ferme de Thomas du 15/11 : menu des rubriques de l'espace TOUJOURS affiché, pour tout le monde, en faisant comprendre intelligemment l'accès payant. Maquette à faire valider par Thomas avant tout code. Largeurs de texte ci-dessous = estimées (14 px, 500, mesurées sur la capture d'accueil pour les liens du site) ; `header-budget` tranche. Aucun libellé validé n'est modifié.

## 0. Ce qui reste vrai de la v5, ce qui change

| Sujet | v5 | v6 |
|---|---|---|
| En-tête | 1 barre de 65 px, liens du site dedans | Reste de 65 px (logo, recherche 176 px, Connexion, bouton d'offre, cloche, compte) ; **les liens du site en sortent** |
| Seconde barre | interdite | **Bande des rubriques sous l'en-tête, 49 px, sticky avec lui** : bloc collé de 114 px (§1). Rouvre « aucune seconde barre » (décision 15/11) |
| Lien « Mon espace » | en barre dès 768 px | **supprimé** : « Aujourd'hui » est la 1re rubrique ; le logo de l'abonné mène toujours à Aujourd'hui |
| Index « Dans ton espace » | carte d'Aujourd'hui + liste du menu mobile | **supprimé** (la bande le remplace) |
| Interrupteur | tout derrière `ESPACE_CLIENT_PUBLIE` | **inchangé** : fermé = site actuel |
| Recherche | 176 px, x variable selon le compte (15/11) | **inchangé** |
| Gabarits A, B, C, états actifs, pied de page, pages `(auth)` sans en-tête | v5 §1 à §3 | inchangés (sauf §4 ci-dessous) |
| Écarts [CHOIX UTILISATEUR] v5 §6 « barre sous l'en-tête » (Q3, Q11, C1 du 12/11) | rouverts par la v5 | **de nouveau suivis** : barre sous l'en-tête, défilement au doigt, mêmes rubriques pour tous |

## 1. Structure : où vit la barre

**Reco : bande sous l'en-tête, dans le même bloc sticky (114 px = 65 + 49), pleine coque `max-w-7xl`, sur toutes les pages qui ont l'en-tête (accueil compris), sauf /abonnement et ses sous-adresses (arbitrage du 15/11, voir §2).**

Pourquoi pas dans l'en-tête comme la référence : la référence n'a ni recherche, ni bouton d'offre, ni Connexion. Ici, à 1280 (coque 1216), visiteur : logo 188 + recherche 176 + Connexion 72 + bouton d'offre 174 + 3 écarts de 16 = 658, soit environ 558 px libres pour 12 rubriques de 90 px en moyenne : il en tiendrait 5 ou 6. La bande en offre 1216.

Pastille (comme la référence) : conteneur `rounded-xl border border-border`, 48 px de haut, rubriques de 44 px de haut, rubrique active `bg-background-elevated text-accent-link border-b-2 border-accent-primary` (état visible sans la teinte). Nav `aria-label="Rubriques"`.

**Ordre unique, identique pour les 3 états et à toutes les largeurs :**

| Groupe | Rubriques (libellés validés) | Adresse |
|---|---|---|
| 1. Espace Premium | Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, S'entraîner | `/mon-espace`, `/parcours`, `/mon-espace/quoi-repondre`, `/bibliotheque`, `/s-entrainer` |
| séparateur 1 px | | |
| 2. Gratuit pour tous | Vannes, Conseils, Vidéos, Articles, La lettre | `/vannes`, `/conseils`, `/videos`, `/blog`, `/lettre` |
| séparateur 1 px | | |
| 3. Raccourcis | Favoris, Carnet | `/favoris`, `/carnet` |
| « … » | Mes questions, Mes répliques | `/mon-espace/questions`, `/mon-espace/repliques` |

Décisions : (a) « Lettres » de l'index fusionne avec « La lettre » (décision 14/11 : une seule section à `/lettre`, archive pour l'abonné) ; `/mon-espace/lettres` garde son adresse, son retour mène à `/lettre`. (b) « … » reçoit les deux rubriques les plus personnelles et les moins visitées par un non-abonné ; c'est une liste de 2 lignes de 44 px (bouton `aria-expanded`, accessible « Plus », Échap ferme, focus rendu). Si Mes questions ou Mes répliques est la page courante, « … » s'allume. (c) Vannes, Conseils, Vidéos restent des pages publiques gratuites avec leur adresse ; Bibliothèque est la rubrique payante.

**Budget de largeur (px, estimé)**

| Élément | Largeur |
|---|---|
| Groupe 1 (5 chips, 14 px de cadenas inclus pour le non-abonné : +18 chacun) | 456 (sans cadenas) puis 546 (avec) |
| Groupe 2 (Vannes 66, Conseils 73, Vidéos 63, Articles 67, La lettre 70) | 339 |
| Groupe 3 (Favoris 66, Carnet 66) | 132 |
| 2 séparateurs avec écarts | 34 |
| « … » 44 + marge de la pastille 16 | 60 |
| **Total non-abonné (pire cas)** | **1 111** |
| Coque disponible à 1280, 1456 et 1920 | 1 216 (le plafond `max-w-7xl` rend les 3 largeurs identiques, voulu) |
| Libre | **105 (non-abonné), 195 (abonné)** ; plancher retenu : 80 (le Chrome de la CI élargit les graisses de 1 à 8 px par libellé, cf. 15/11) |

De 1024 à 1279 : même bande, coque de 960 à 1216 ; à 1024 (coque 960) le total 1 111 dépasse : la bande défile au doigt et à la molette, active centrée, comme au §3. Aucune rubrique n'est jamais comprimée ni tronquée.

Le reste de l'en-tête (65 px) : à 1280, visiteur 658 sur 1 216, la place libérée par les liens du site n'est pas réaffectée (aucun ajout).

## 2. Trois états de lecteur

Même bande pour tous, mêmes adresses. Seul change le signalement du groupe 1 et la page où mène son clic.

| Élément | Visiteur | Inscrit gratuit | Abonné |
|---|---|---|---|
| Groupe 1 | cadenas 14 px après le libellé, `text-text-secondary` (même couleur que le texte : AA, jamais un contraste plus bas) | idem | aucun cadenas |
| Groupes 2 et 3 | ouverts | ouverts (Favoris vit dans la bande, plus dans le menu du compte) | ouverts |
| Clic groupe 1 | **page d'aperçu** de la rubrique (même adresse que celle de l'abonné) | idem | la rubrique |
| « … » | 2 lignes avec cadenas, mêmes aperçus | idem | 2 rubriques |
| Bande sur /abonnement et /abonnement/success (et toute sous-adresse de /abonnement) | **absente** (arbitrage du 15/11 : la page de conversion validée en s21 garde son pli ; le bouton d'offre y est déjà masqué), rangée du haut gardée | idem | idem |
| Fenêtre de moins de 500 px de haut (`max-height: 499px`, 200 % de texte sur téléphone) | rangée et bande **non collantes** : le bloc défile avec la page, plus de réserve d'ancre (arbitrage du 15/11) ; au-dessus, inchangé | idem | idem |
| En-tête | Connexion + bouton d'offre | bouton d'offre + compte | cloche + compte |

**Pourquoi un cadenas par chip et pas un badge « Premium »** : un badge ajoute environ 50 px par chip (+250 px, déborde) ; le cadenas coûte 18 px, se lit seul, ne crie pas. Les 5 cadenas sont regroupés à gauche d'un séparateur : le visiteur comprend « à gauche c'est Premium, à droite c'est gratuit » sans légende. Nom accessible du chip : « {rubrique}, rubrique Premium » [À VALIDER PAR THOMAS : « rubrique Premium »].

**Page d'aperçu (jamais un mur, jamais une redirection)** : gabarit de la rubrique (B ou C, v5 §3), le chip reste allumé avec son cadenas.
1. Titre H1 = libellé de la rubrique ; sous-titre [À VALIDER PAR THOMAS : « Voici un exemple de cette rubrique. Elle est ouverte avec Premium. »].
2. **1 à 3 éléments réels** de la rubrique, lisibles en entier pour l'un d'eux (une vraie fiche déjà écrite, pas de texte inventé ni de flou décoratif) ; les autres en carte avec titre et début.
3. Bloc offre : bouton `EN_TETE.bouton` (prix lu dans la config, jamais écrit en dur), lien « Connexion » pour l'abonné non connecté. Un seul bouton plein par page.
4. Pas de fenêtre surgissante, pas de compte à rebours, pas de second appel à l'action. Parcours : la page publique `/parcours` EST déjà l'aperçu, inchangée.
5. HTML serveur du visiteur sans code de l'espace (v5 critère 9) : l'aperçu est une page statique.

**SEO** : chaque chip est un vrai `<a href>` dans le HTML serveur ; Googlebot = visiteur, il voit la bande et suit les liens. Les 5 liens gratuits sont désormais en lien interne site-entier (Vannes, Conseils, Vidéos, Articles, La lettre : gain de maillage). Pages d'aperçu : `noindex,follow` par défaut (contenu fin, copie du payant) [À ARBITRER @seo] ; `/parcours` et les pages gratuites gardent adresses, titres, indexation. Vérifier que `robots.txt` ne bloque pas `/mon-espace`.

**Conversion sans agresser** : la valeur est visible en permanence (5 rubriques nommées avec leur place), l'offre n'apparaît qu'au clic sur une rubrique payante ou via le bouton d'en-tête existant. Mesure : événements « clic rubrique {nom, état} », « vue aperçu {nom} », « clic offre depuis aperçu » (nommés par @data-analyst). HEART : Adoption = part des visiteurs qui ouvrent un aperçu ; Task success = clics offre / vues aperçu ; cible à fixer après 28 jours de mesure (aucune base : 5 clics abonnement en 28 j au 11/10).

## 3. Mobile (320 à 767) et tablette (768 à 1023)

**Reco : la même bande, défilante au doigt, toujours visible sous l'en-tête (sticky), à toutes les largeurs.**

| Largeur | En-tête (65) | Bande (49) | Total sticky |
|---|---|---|---|
| 320 à 439 | logo, bouton d'offre court (abonné : cloche), Menu | défile | 114 |
| 440 à 767 | + loupe, Connexion dès 520 (visiteur), bouton d'offre complet dès 640 | défile | 114 |
| 768 à 1023 | logo, loupe, Connexion ou offre, cloche, compte ; **plus de bouton Menu** (rien à y ranger) [HYPOTHÈSE : tient, à vérifier par `header-budget`] | défile, 7 chips visibles environ | 114 |

- À 375 : ~3 chips entiers (Aujourd'hui 106, Parcours 94, Quoi répondre 122) + 37 px de la suivante qui dépasse, signal de défilement ; fondu de 24 px à droite (puis à gauche quand on a défilé). Chips toujours à leur largeur naturelle. Ça respecte « 6 entrées au plus visibles » de Q3 (12/11) sur téléphone ; à 640 et plus, on voit 6 à 7 chips, jugé acceptable (aucune rubrique tronquée).
- **Rubrique active centrée à l'arrivée** : défilement positionné avant le premier affichage, sans animation (puis animé entre deux pages, sauf préférence de mouvement réduit) ; bornes respectées (Aujourd'hui reste collé au bord gauche, le dernier au bord droit). Page sans rubrique (accueil, abonnement) : début de bande.
- Hauteur à 375 x 667 : 114 px de bloc fixe, 553 px pour le contenu (83 %) ; à 568 px de haut, 454 px.
- Menu mobile (< 768) devient court : recherche (< 440), bouton d'offre, Connexion (visiteur), Mon profil, Déconnexion, soit 3 à 5 lignes ; plus aucune liste de liens du site ni de l'espace.
- Défilement horizontal : défilement géré par `overflow-x`, barre masquée, `scroll-snap` non imposé, chips tabulables (le focus fait défiler), cibles 44 px.
- Pied de page : inchangé.

## 4. Ce qui disparaît ou change

| Élément | Devient |
|---|---|
| Carte « Dans ton espace » d'Aujourd'hui | supprimée ; la colonne 2 de la carte du jour à 768 et 1280 est à redessiner par @design (risque de vide à droite, critère v5 5.4 : à vérifier à la maquette) |
| Liste de l'espace dans le menu mobile | supprimée (§3) |
| Lien « Mon espace » de la barre | supprimé ; remplacé par la rubrique « Aujourd'hui » ; l'intitulé non cliquable de 768 à 1023 px disparaît avec lui |
| « Retour : Mon espace » (pages B de l'espace, S'entraîner) | supprimé : la bande est le retour, Aujourd'hui est à 1 toucher |
| « Retour : {rubrique} » des pages A (fiches, bonus, questions, lettres, bilan) | **gardé**, ramène à la liste ; ce parent allume son chip |
| « Favoris » du menu du compte (inscrit gratuit) | supprimé (doublon avec la bande) |
| Texte `T.index.titre`, `T.monEspace` de `espace-navigation.ts` | plus utilisés ; à retirer par @fullstack |
| `rubriques.ts` | `INDEX_ESPACE` devient la liste de la bande (§1) ; `ligneEspaceAllumee` et `elementBarreAllume` fusionnent en une fonction de chip allumé |
| Cloche, compte, logo abonné vers Aujourd'hui | inchangés |

**Chip allumé** (une seule fonction pour tous les états) : `/mon-espace` seul → Aujourd'hui ; `/parcours*` et fiches « bilan » → Parcours ; `/mon-espace/quoi-repondre`, fiches situation et a-plat → Quoi répondre ; `/mon-espace/bibliotheque`, fiches construction, vocabulaire, formule, ecouter, humour-noir, bonus → Bibliothèque ; `/mon-espace/s-entrainer`, fiches jeu et seance → S'entraîner ; `/vannes*`, `/conseils*`, `/videos*`, `/blog*` → leur chip ; `/lettre*` et `/mon-espace/lettres*` → La lettre ; `/favoris` → Favoris ; `/carnet*` → Carnet ; questions et répliques → « … » ; `/profil` → icône du compte ; toute autre adresse → aucun.

## 5. Libellés

Aucun libellé validé modifié (Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, S'entraîner, Vannes, Conseils, Vidéos, Articles, La lettre, Favoris, Carnet, Mes questions, Mes répliques, Connexion, bouton d'offre `EN_TETE`). « Mes Notes » de la référence n'existe pas ici. Nouveaux, tous [À VALIDER PAR THOMAS] :
- sous-titre d'aperçu : « Voici un exemple de cette rubrique. Elle est ouverte avec Premium. »
- nom accessible du cadenas : « rubrique Premium » ; nom du bouton « … » : « Plus » (mot de la décision C1 du 12/11).
Zéro tiret cadratin, zéro emoji.

## 6. Critères de réussite (relecture à l'aveugle)

1. Même bande, même ordre, mêmes adresses pour les 3 états ; seuls les cadenas et le bouton d'en-tête diffèrent.
2. À 1280, 1456, 1920 : bande identique, ≥ 80 px libres au pire cas ; 320 à 1023 : défile, rien de tronqué.
3. Bloc sticky de 114 px ; ancres et focus clavier jamais cachés dessous (scroll-padding de 120 px, WCAG 2.2 : focus non masqué).
4. Chaque rubrique payante mène à un aperçu avec contenu réel et un seul bouton d'offre ; aucune redirection, aucun mur, `/parcours` inchangé.
5. Chaque chip est un `<a href>` dans le HTML serveur du visiteur ; aperçus sans code de l'espace.
6. Cibles 44 px, focus visible (anneau `accent-link`), contrastes AA, état actif sans la teinte (soulignement), Tab complet, Échap pour « … ».
7. Captures 3 états x 375, 768, 1280, 1456, 1920, interrupteur fermé et ouvert, page active au début, au milieu et à la fin de la bande.
8. Interrupteur fermé : aucune page ne change.

## 7. Questions pour Thomas (3 au plus)

1. **Cadenas sur chaque rubrique Premium** (14 px, sans badge, groupés à gauche) : OK ? Défaut : oui.
2. **Contenu d'exemple des aperçus** : quelle fiche réelle montrer en entier par rubrique ? Défaut : la première fiche déjà écrite de chaque rubrique, que tu confirmes (je n'en invente aucune).
3. **Bande de 49 px collée sous l'en-tête (total 114 px, toujours visible, même sur l'accueil)** et « … » = Mes questions et Mes répliques : OK ? Défaut : oui ; alternative écartée : rubriques dans l'en-tête, il n'en tient que 5 à 1280.

## Handoff @design
Maquette 375, 768, 1280 pour les 3 états + 1 page d'aperçu (Quoi répondre) + « … » ouvert. Points d'attention : colonne 2 d'Aujourd'hui sans index, nouvelle place du fondu, cadenas aux tokens existants (aucun contraste inférieur à AA), pastille cohérente avec le site (étalon : captures d'accueil), pas de reprise des couleurs de la référence.
