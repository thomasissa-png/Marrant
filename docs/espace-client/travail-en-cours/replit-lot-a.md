# Lot A (s25) : navigation v6, bande des rubriques, entrée à reporter dans `REPLIT_ACTIONS.md`

**Aucune action de déploiement requise.** Tout est derrière l'interrupteur `ESPACE_CLIENT_PUBLIE`, qui reste à
`false` dans le dépôt : interrupteur fermé, le site en ligne ne change pas (Jest d'inertie, 47 instantanés,
identiques sans mise à jour). Pas de migration, pas de variable d'environnement, pas de paquet, aucune écriture en
base.

Effet le jour de l'ouverture de l'espace (spec `docs/ux/navigation-v6-menu-rubriques.md`, maquette D validée le
15/11) :

- **En-tête** : la rangée perd les liens du site et « Mon espace » ; recherche de 176 px dès 768 px (loupe de 440 à
  767) ; bouton d'offre en libellé complet dès 640 px ; bouton Menu sous 768 px (visiteur : sous 520).
- **Bande des rubriques** sous la rangée, dans le même bloc collant (117 px sous 768, 121 px au-delà), pour
  visiteur, compte gratuit et abonné : Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, S'entraîner | Vannes,
  Conseils, Vidéos, Articles, La lettre | Favoris, Carnet | « … » (Mes questions, Mes répliques). Liens réels dans
  le HTML serveur ; cadenas et nom « {rubrique}, rubrique Premium » pour le non-abonné sur les 5 rubriques Premium,
  Favoris (réservé à l'abonné, arbitrage du 15/11) et les 2 lignes de « … » ; rubrique allumée selon l'adresse.
  Défile au doigt et à la molette quand la place manque (sous 1280 px ; non-abonné, de quelques pixels aussi dès
  1280, padding de 12 px gardé, arbitrage du 15/11), rubrique active entière, fondus aux bords.
- **Menu mobile** : recherche (sous 440 px), bouton d'offre, Connexion, Mon profil, Déconnexion ; plus de liens.
  Posé en surimpression sous le bloc collant, juste après la rangée dans l'ordre du clavier.
- **Menu du compte** : « Favoris » retiré (il est dans la bande), pour le compte gratuit aussi.
- **Fil d'Ariane visible** retiré sur /conseils, /videos, /blog, /parcours, /carnet, /glossaire (données
  structurées BreadcrumbList gardées) ; gardé sur les pages de détail (fiches, articles, /carnet/<mois>).
- **Espace** : plus d'index « Dans ton espace » sur Aujourd'hui, plus de « Retour : Mon espace » sur les rubriques ;
  retours des pages de détail gardés.
- `html { scroll-padding-top: 8rem }` posé par l'en-tête : ancres et focus jamais cachés sous le bloc collant.

Contrôles faits avant commit : voir le rapport du lot A (tsc build et complet, lint, build, Jest complet en
environnement vide, tsc Playwright, `nav-universelle-s24.spec.ts` et `header-budget.spec.ts` contre un serveur
ouvert local, port 5410).
