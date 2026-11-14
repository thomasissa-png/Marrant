# Navigation universelle et gabarits de page (s24), v2

Principe : UN seul en-tête de 65 px sur toutes les pages du site, un seul lien « Mon espace » pour l'abonné, aucune seconde barre. Sources : `header.tsx`, `mobile-nav.tsx`, `footer.tsx`, `gabarit.ts`, `page-header.tsx`, liste des `page.tsx`, `docs/seo/point-etape-s20.md`, relectures de tour 1.

## 0. Interrupteur

Tout part avec `ESPACE_CLIENT_PUBLIE`, pour tous les lecteurs, le même jour.

| Interrupteur | En-tête, pied, gabarits | Abonné |
|---|---|---|
| Fermé | Exactement ceux d'aujourd'hui (onglet Accueil, ordre actuel, « Carnet » dans la barre abonné, « Favoris » dans le menu de compte, mises en page actuelles) | Aucun changement |
| Ouvert | Ceux de ce document, pour visiteur, inscrit gratuit et abonné | Nouvel état abonné (§1) |

## 1. Les trois états de lecteur (interrupteur ouvert)

Ordre unique, de gauche à droite, repris à l'identique dans le menu mobile : Parcours, Vannes, Conseils, Vidéos, Articles, La lettre.

| Élément (1280 px) | Visiteur | Inscrit gratuit | Abonné Premium |
|---|---|---|---|
| Logo | lien vers l'accueil | idem | lien vers `/mon-espace` (écart, §6) |
| « Mon espace » | absent | absent | lien direct vers Aujourd'hui, 1er de la liste |
| Liens | Parcours, Vannes, Conseils, Vidéos, Articles, La lettre | idem | Parcours, Vannes, Conseils, Vidéos, Articles |
| Recherche | champ de 176 px | idem | idem |
| Cloche | absente | absente | icône, point violet, panneau déroulant |
| Bouton d'offre | « Premium » + prix (libellé `EN_TETE.bouton`, prix lu dans la config) | idem | absent |
| « Connexion » | lien texte | absent | absent |
| Icône compte | absente | Favoris, Mon profil, Déconnexion | Mon profil, Déconnexion |

« La lettre » est gardée pour l'inscrit gratuit (page d'inscription et de lecture) et retirée pour l'abonné, qui la retrouve dans Mon espace (Lettres). Pas de bouton d'offre sur /abonnement (règle actuelle, inchangée).

- 1024 à 1279 px : comme 1280 ; recherche en loupe ; bouton d'offre en libellé court.
- 768 px : logo, loupe, puis visiteur « Connexion », bouton d'offre, Menu ; inscrit gratuit bouton d'offre, compte, Menu ; abonné cloche, compte, Menu.
- 375 px : visiteur et inscrit gratuit logo, bouton d'offre court, Menu ; abonné logo, cloche, Menu. Sous 440 px la loupe passe dans le menu, pour tous (une seule règle).
- Menu mobile, un seul ordre sans groupe : recherche (sous 440 px), « Mon espace » (abonné), Parcours, Vannes, Conseils, Vidéos, Articles, La lettre (visiteur, inscrit gratuit), séparateur, puis actions : visiteur bouton d'offre et Connexion ; inscrit gratuit bouton d'offre, Favoris, Mon profil, Déconnexion ; abonné Mon profil, Déconnexion. Échap, croix et voile ferment ; le focus revient au bouton Menu.

### État actif (barre et menu mobile)

Style : fond `bg-background-elevated`, texte `text-accent-link`, soulignement `border-b-2 border-accent-primary` en barre (menu mobile : même fond, `font-semibold`), `aria-current`.

| Adresse | Élément allumé |
|---|---|
| `/mon-espace` et `/mon-espace/*` (hors fiche « bilan »), `/favoris`, `/carnet`, `/carnet/[mois]` (abonné) | Mon espace |
| `/parcours`, `/parcours/*`, `/mon-espace/fiche/bilan/*` | Parcours |
| `/vannes*`, `/conseils*`, `/videos*`, `/blog*`, `/lettre*` | le lien du même nom (abonné compris) |
| `/profil` | l'icône du compte (même style) |
| `/abonnement*`, `/quiz-humour`, pages légales, accueil | aucun |

## 2. Catégories : barre, espace, pied de page

Critère : intention de l'utilisateur, conversion, pages qui se positionnent. Données (Search Console 12/09 au 09/10, `point-etape-s20.md` §4, anciennes de 5 semaines) : l'article n°1 fait 368 clics sur 462 (79,7 %), `/vannes` 17 clics pour 1 366 impressions ; `/videos` inconnu de Google et `/parcours` non indexé à cette date. Donc Articles est la première porte Google ; l'ordre « Parcours en premier » repose sur la conversion (décision du 19/10), pas sur un trafic.

| Rubrique | Où | Pourquoi |
|---|---|---|
| Parcours | Barre, 1er | C'est ce qui s'achète ; `[HYPOTHÈSE]` placer en premier augmente les clics vers l'offre (non mesurable : 5 clics « abonnement » en 28 j au 11/10) |
| Vannes, Conseils, Vidéos | Barre | Portes gratuites, retour quotidien |
| Articles | Barre | Première porte Google (chiffres ci-dessus) |
| La lettre | Barre (visiteur, inscrit gratuit) | Décision du 17/10 |
| Aujourd'hui, Quoi répondre, Bibliothèque, Mes questions, S'entraîner, Mes répliques, Lettres, Favoris, Carnet | Mon espace (index, §4) | Usage d'abonné |
| Pied de page réel (`footer.tsx`) | Vannes, Conseils, Vidéos stand-up, Parcours, Comment devenir drôle, Articles, Glossaire, Quiz humour, Anatomie d’une vanne, Nos offres ; À propos, Mentions légales, CGU, Confidentialité, rétractation, résilier ; lettre, widget (si ouvert), réseaux | Inchangé, sauf une ligne ajoutée : « Blague du jour » (page jusqu'ici sans lien, §6) |

Le Quiz humour (libellé du pied) reste hors de l'espace : un quiz se fait une fois, son entrée est le pied et l'accueil. Libellés courts, ni tiret cadratin ni emoji.

## 3. Gabarits

Coque commune : `max-w-7xl`, marges 16 (375), 24 (768), 32 px (1280), centrée. Interdits : colonne de 720 px à gauche, menu latéral, bloc collé à gauche avec vide à droite. `maxWidth.lecture` (720 px) est supprimé du thème quand l'espace passe en A, B, C.

| | A. Lecture | B. Liste ou grille | C. Tableau de bord |
|---|---|---|---|
| Contenu | colonne centrée 768 px (`COLONNE_LECTURE`) | pleine coque ; colonnes existantes conservées (vannes, conseils : 2) ; pages neuves de l'espace : 1 colonne, 2 dès 768 | pleine coque, `grid-cols-1 md:grid-cols-2 gap-6` ; carte du jour pleine largeur, texte limité à 768 px |
| Repères | fil d'Ariane ou « Retour : {parent} », alignés sur la colonne (pas sur le logo) | fil d'Ariane ou retour, aligné sur le logo | pas de fil d'Ariane |

Parent de l'espace nommé partout « Mon espace » (fil d'Ariane, lien retour) ; la page porte le titre « Aujourd'hui ».
Rythme vertical commun (un seul `PageHeader` : fil d'Ariane, H1, intro) : haut de page `pt-8`, `md:pt-10`, `xl:pt-12` ; fil d'Ariane puis H1 `mb-4` ; H1 `font-display font-bold text-3xl md:text-4xl` ; intro `mt-3 md:mt-4 text-lg text-text-secondary max-w-3xl` ; sous le `PageHeader` `mb-8 md:mb-10` ; entre cartes `gap-6` ; entre sections `space-y-12` ; bas de page `pb-16`.

### Correspondance complète (toutes les `page.tsx`)

- Hors gabarit : accueil `/` (page de vente, inchangée).
- A : `/a-propos`, `/blague-du-jour`, `/anatomie-vanne`, `/integrer-la-vanne-du-jour`, `/developers`, `/blog/[slug]`, `/blog/apercu/[slug]`, `/conseils/[slug]`, `/vannes/[slug]`, `/videos/[slug]`, `/parcours/[slug]`, `/carnet`, `/carnet/[mois]`, `/lettre`, `/lettre/confirmer`, `/lettre/desinscrire`, `/lettre/premium/arreter`, `/abonnement`, `/abonnement/success`, `/quiz-humour`, `/mentions-legales`, `/cgu`, `/confidentialite`, `/retractation`, `/resiliation`, `/resiliation/confirmee`, `/mon-espace/fiche/[type]/[id]`, `/mon-espace/bonus/[id]`, `/mon-espace/lettres/[numero]`, `/mon-espace/questions/[id]`.
- B : `/vannes`, `/vannes/theme/[slug]`, `/conseils`, `/videos`, `/blog`, `/parcours`, `/glossaire`, `/favoris`, `/profil` (comme `gabarit.ts`), `/mon-espace/quoi-repondre`, `/mon-espace/bibliotheque`, `/mon-espace/repliques`, `/mon-espace/lettres`, `/mon-espace/questions`.
- C : `/mon-espace` (Aujourd'hui), `/mon-espace/s-entrainer`.
- Sans en-tête du site, comme aujourd'hui (groupe `(auth)`, démonstration contraire non faite) : `/login`, `/register`, `/forgot-password`, `/reset-password`, `/onboarding`.
- Hors périmètre, inchangés : `/liens`, `/liens/[reseau]`, `/admin`, `/admin/ceo`, `/admin/social`, `/admin/questions`, widget intégrable, page neutre d'un bonus (404 du site).

## 4. Navigation interne de l'espace

Pas de seconde barre : elle ajoute 46 px (111 px collés en haut), cache ses entrées derrière un défilement, et Thomas l'a jugée « innavigable ».
1. Aujourd'hui en 1 clic : « Mon espace » est un lien, et le logo de l'abonné y mène.
2. Aujourd'hui sert de sommaire : sous la carte du jour, une carte « Dans ton espace » avec l'index, une ligne de 44 px par rubrique (libellé et chevron, rien d'autre) : Quoi répondre, Bibliothèque, Mes questions (point violet si réponse non lue), S'entraîner, Mes répliques, Lettres, Favoris, Carnet. Une colonne à 375, deux colonnes dès 768 (`gap-6` entre cartes, pas de rangée de cartes à phrases).
3. Toute page de l'espace porte « Retour : Mon espace » (pages A) ou le fil d'Ariane (pages B).
Chemins : Aujourd'hui 1 clic ; chaque rubrique 2 clics (Mon espace, puis index).

## 5. Critères de réussite (relecture à l'aveugle)

1. Interrupteur fermé : aucune page ne change (comparaison de captures avant et après).
2. Ouvert : à 375, 768, 1280 px, l'en-tête d'un même état est identique pages d'accueil, parcours, espace, légales comprises, hors lien courant surligné et bouton d'offre masqué sur les pages de paiement.
3. Aucune seconde barre ; aucun lien deux fois dans la barre et le menu ; abonné : « Mon espace » et 5 liens.
4. À 1280 px aucun contenu collé à gauche avec vide à droite ; le rythme du §3 est respecté sur toutes les pages (mesures en pixels).
5. Accès : pages B, C et Aujourd'hui à 2 clics de toute page depuis l'en-tête ou le pied ; pages A à 3.
6. Aucun libellé coupé ni débordement de 320 à 1920 px ; `header-budget` mis à jour pour le nouvel état abonné (Mon espace, cloche), 6 largeurs.
7. Clavier complet (Tab, Échap), focus visible, cibles de 44 px, contrastes AA ; état actif visible sans dépendre de la teinte (soulignement).
8. États actifs conformes au tableau du §1, y compris `/favoris`, `/carnet`, `/profil`, fiche « bilan ».
9. Mêmes URL, aucune redirection ; la barre visiteur change comme au §6 ; HTML serveur du visiteur sans code de l'espace.
10. Conversion : bouton d'offre visible à toute largeur pour visiteur et inscrit gratuit, masqué sur /abonnement et sur /register.
11. Preuves : captures pages × 3 états × 3 largeurs, menus fermés et ouverts, dans `docs/captures/s24-nav-universelle/`.
12. Mesure : événements « clic Mon espace », « clic index Aujourd'hui », « clic Menu », nommés par @data-analyst sur la convention du plan Umami existant.

## 6. Écarts aux décisions passées (à confirmer par Thomas)

- [CHOIX UTILISATEUR] « ROUVRE : Q3 (12/11), barre de rubriques sous l'en-tête » remplacée par un lien « Mon espace » dans l'en-tête et un index dans Aujourd'hui.
- [CHOIX UTILISATEUR] « ROUVRE : Q11 (12/11), barre sur les pages publiques pour l'abonné » remplacée par le même en-tête partout.
- [CHOIX UTILISATEUR] « ROUVRE : C1 (12/11), barre à 6 entrées dont « Plus » » : Parcours rejoint la barre du site, « Plus » disparaît, ses lignes vont dans l'index d'Aujourd'hui.
- [CHOIX UTILISATEUR] « ROUVRE : Quiz d'humour quitte le menu de l'abonné » (reste au pied et à l'accueil).
- [CHOIX UTILISATEUR] « ROUVRE : le logo de l'abonné mène à `/mon-espace`, pas à l'accueil » (interrupteur ouvert ; Googlebot n'est jamais abonné).
- [CHOIX UTILISATEUR] « ROUVRE : menu du site, onglet Accueil retiré (le logo le remplace) et Parcours en premier. » Si Thomas préfère l'ordre actuel, seul cet écart tombe.
- [CHOIX UTILISATEUR] « ROUVRE : « Carnet » et « Favoris » de l'abonné passent dans l'index de Mon espace » (interrupteur ouvert seulement).
- [CHOIX UTILISATEUR] « ROUVRE : ajout de « Blague du jour » au pied de page. »
- [CHOIX UTILISATEUR] « ROUVRE : l'espace abandonne sa colonne de 720 px à gauche (gabarits A, B, C). »
- Non rouverts : « La lettre » (17/10), « Articles » (18/10), conversion prioritaire, pas de compte gratuit (05/10), pages `(auth)` sans en-tête, grilles publiques existantes.

## 7. Faute dure, correction

| Faute | Correction |
|---|---|
| D1 pages (auth) et correspondance incomplète | Comportement actuel gardé (pas d'en-tête sur les 5 pages `(auth)`, §3) ; liste exhaustive des `page.tsx` avec gabarit ou exclusion ; faux « règle existante » retiré |
| D2 interrupteur absent | §0 : tout (visiteur compris) dépend de `ESPACE_CLIENT_PUBLIE` ; fermé, site inchangé, Carnet et Favoris compris |
| D3 état actif hors /mon-espace, double nom | Tableau d'état actif du §1 ; parent nommé « Mon espace » partout |
| D4 contradictions et critères faux | Un seul ordre sans groupe (§1) ; quiz hors espace ; critères 1, 5, 9 réécrits (§5) |
| D5 gabarit B change les listes | Colonnes existantes conservées ; profil, favoris, glossaire en B et carnet en A comme `gabarit.ts` ; pas de grille changée |
| D6 données non sourcées, pied non lu | Chiffres Search Console sourcés ; Parcours en premier marqué `[HYPOTHÈSE]` ; §2 aligné sur `footer.tsx` ; Blague du jour ajoutée (ROUVRE) |
| FD1 Aujourd'hui en 2 clics, logo vers la vente | Lien direct, logo abonné vers `/mon-espace` (ROUVRE), menu déroulant supprimé, index dans Aujourd'hui, menu mobile court |
| FD2 quiz contradictoire | Retiré de l'espace |
| FD3 pied non lu | §2 recopie le pied réel ; libellé « Quiz humour » ; critère 5 « en-tête ou pied » |
| Design 1 rythme vertical | Tableau du §3, en tokens |
| Design 2 état actif de l'espace | Mon espace allumé sur toutes les adresses listées, fiches « bilan » vers Parcours (§1) |
| Design 3 cartes d'Aujourd'hui | Index en une carte, 1 colonne à 375, 2 dès 768, carte du jour pleine largeur ; pas de rangée de 4 cartes |

Pistes retenues : loupe dans le menu sous 440 px pour tous, suppression de `maxWidth.lecture`, soulignement actif, prix lu dans la config. À confirmer : site sombre seul (aucune bascule claire vue). Risque restant : un abonné n'a plus de lien vers l'accueil de vente, voulu.
