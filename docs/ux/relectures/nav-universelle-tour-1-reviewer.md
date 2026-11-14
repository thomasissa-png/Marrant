# Relecture à l'aveugle, tour 1 : `docs/ux/navigation-universelle-s24.md` (@reviewer, 14/11)

**Note : 5,5/10.** Le diagnostic est juste : les captures `espace-*-1280` montrent l'en-tête de l'abonné sans aucun lien du site, une barre de 46 px et une colonne de 720 px collée à gauche. Les réouvertures sont toutes marquées ROUVRE, et les critères clavier et budget sont sérieux. Six fautes dures bloquent pourtant le 10.

Vérifié : `header.tsx`, `footer.tsx`, `gabarit.ts`, les layouts `app/**`, la liste des `page.tsx`, les lignes 62-63, 109-126, 140 et 161-190 de `founder-preferences.md`, ainsi que les captures `espace-aujourdhui-1280`, `site-vannes-1280` et `espace-bibliotheque-375`.

## Fautes dures

**D1. Pages sans en-tête aujourd'hui, et correspondance incomplète (critères 1 et 4, -1).** Le groupe `(auth)` (/login, /register, /forgot-password, /reset-password, /onboarding) n'a pas de layout avec `<Header />` : seul `(dashboard)/layout.tsx:17` le monte. La spec exige pourtant l'en-tête « connexion comprises » (§5.1) et parle de « règle existante, inchangée » pour /register (§1 l.23). C'est faux : ajouter le menu complet sur l'étape d'inscription du tunnel est une décision de conversion (19/10), et elle n'est pas signalée. La correspondance oublie aussi /abonnement/success, /resiliation et /resiliation/confirmee, /lettre/confirmer, /lettre/desinscrire, /lettre/premium/arreter, /anatomie-vanne, /integrer-la-vanne-du-jour, /developers et la 404 (page neutre d'un bonus). Elle n'exclut pas explicitement /liens, /admin ni le widget.
Correction : ajouter au §3 une ligne par page oubliée avec son gabarit. Ajouter au §6 un écart « en-tête ajouté aux pages (auth) », avec deux options à faire trancher par Thomas : en-tête complet, ou en-tête complet sans liens sur /register. Écrire la liste des pages exclues.

**D2. L'interrupteur `ESPACE_CLIENT_PUBLIE` est absent (critère 7, -1).** `header.tsx:145` ne remplace l'en-tête que si l'interrupteur est ouvert. La spec retire « Carnet » des onglets de l'abonné et « Favoris » de son menu de compte pour les mettre dans « Mon espace ». Or, interrupteur fermé, ce menu n'existe pas : l'abonné en production perd l'accès à ces deux pages. Les changements côté visiteur (retrait d'Accueil, Parcours en premier) partiraient en plus avec le déploiement A (13/11), avant le go d'ouverture.
Correction : ajouter un tableau « fermé / ouvert » par état. Fermé, l'abonné garde Carnet et Favoris comme aujourd'hui. Pour les changements visiteur, dire explicitement s'ils dépendent de l'interrupteur ou s'ils partent dès A.

**D3. L'état actif n'est pas défini hors de /mon-espace (critère 2, -0,5).** /favoris, /carnet, /carnet/[mois], /quiz-humour et /profil sont des adresses publiques rangées dans « Mon espace » ou dans le compte. On ne sait pas ce qui est surligné quand l'abonné s'y trouve : le déclencheur « Mon espace », l'entrée du menu, ou rien. Même question pour une fiche /mon-espace/fiche/... qui appartient à une étape de parcours : Parcours ou Mon espace ? Par ailleurs, la même adresse /mon-espace s'appelle « Mon espace » dans le fil d'Ariane (§3) et « Aujourd'hui » dans le lien retour (§4.3).
Correction : écrire une table « préfixe d'adresse → élément surligné dans la barre → entrée surlignée dans le menu ». Donner un seul nom au parent /mon-espace dans le fil d'Ariane et dans le lien retour.

**D4. Contradictions internes et critères faux par construction (critères 5 et 6, -1).**
(a) Le menu mobile promet le « même ordre » que le bureau (§1), mais §1.2 (Lettres, Favoris, Mes répliques, S'entraîner, Quiz, Carnet, sans groupes) diffère de §4.1 (3 groupes, S'entraîner avant Favoris).
(b) Le quiz est classé « usage d'abonné » (§2 l.59) et en même temps « un quiz se fait une fois » (l.60).
(c) Le critère 1 exige un en-tête identique « au pixel près » sur toutes les pages. C'est démenti par le bouton masqué sur /abonnement et /register et par le surlignage du lien courant.
(d) Le critère 10 dit « visiteur inchangé », alors que le §6 retire Accueil et met Parcours en premier pour le visiteur.
(e) Le critère 5 (« 2 clics ») est faux pour les pages A (situation, lettre, bonus : 3 clics) et pour les pages du pied. Le « 3 depuis une page profonde » n'a pas de sens, puisque l'en-tête est le même partout.
Correction : un seul ordre, recopié tel quel à l'identique dans §1 et §4. Le quiz va dans une seule catégorie. Critère 1 : « identique, hors lien courant surligné et bouton d'offre masqué sur les pages de paiement ». Critère 10 : « mêmes URL et aucune redirection ; la barre visiteur change comme au §6 ». Critère 5 : « pages B et C à 2 clics de toute page ; pages A à 3 ».

**D5. Le gabarit B change les listes publiques sans le dire (critère 7, -0,5).** Le gabarit B impose 3 colonnes à 1280 px. Or /vannes affiche aujourd'hui 2 colonnes (capture `site-vannes-1280`), une mise en page validée par la revue visuelle s21. Le §3 contredit aussi `gabarit.ts:4-8` : profil et favoris y sont rangés comme listes, le carnet comme page de lecture, alors que la spec met Profil en C et Carnet en B.
Correction : dans B, écrire « nombre de colonnes existant conservé (vannes et conseils : 2) ». Classer Profil, Favoris et Carnet comme `gabarit.ts`, sinon lister chaque écart au §6.

**D6. Catégories fondées sur des affirmations non sourcées et contradictoires (critère 3, CLAUDE.md n°2, -0,5).** Le §2 dit que « Articles » est le « premier trafic Google ». Les Risques disent que les Vannes sont le « principal trafic ». Aucune source n'est donnée, alors que ces affirmations décident de l'ordre du menu, soit la demande de Thomas « itérons bien les catégories ». Le §2 n'est pas non plus confronté au pied réel (`footer.tsx:12-37`) : « Blague du jour » y est absente, alors que la spec l'y range. « Comment devenir drôle » (pilier SEO présent sur tout le site) et « Nos offres » ne figurent pas dans le tableau.
Correction : donner les visites sur 28 jours par rubrique (Umami et Search Console), ou marquer `[HYPOTHÈSE]`. Mettre le §2 en regard de `footer.tsx` ligne par ligne, et indiquer d'où part le lien vers /blague-du-jour.

## Pistes (ne bloquent pas)

- P1. Les comptes gratuits ne sont pas que « les 12 existants » : un paiement abandonné après /register en crée de nouveaux (25/10, « et les futurs »). Ils reçoivent aussi la lettre d'office (25/10). La raison donnée pour masquer « La lettre » à l'abonné vaut donc pour eux : à trancher dans un sens ou dans l'autre.
- P2. La lettre hebdomadaire Premium est en opt-in (19/10). Remplacer « la reçoit chaque semaine » par « la retrouve dans Mon espace ».
- P3. Le test `header-budget` couvre déjà 6 largeurs × 3 états (`header.tsx:66`). Écrire « mis à jour pour le nouvel état abonné (Mon espace + cloche), de 320 à 1920 px » plutôt que « étendu aux 3 états ».
- P4. Ajouter une grille de captures vérifiable : pages × 3 états × 3 largeurs, menus fermés et ouverts, dossier `docs/captures/s24-nav-universelle/`.
- P5. Profil en « tableau de bord » (C) colle mal à une page de réglages. Le gabarit B (ou A pour un formulaire) serait plus naturel.
- P6. Ne pas figer « 1,99 €/mois » dans la spec : renvoyer à `PREMIUM_PRICE_LABEL` (`config/premium.ts:46`).
- P7. Nommer les événements du critère 12 dans la convention du plan de suivi existant (Umami), pour que @data-analyst n'ait rien à réinventer.
