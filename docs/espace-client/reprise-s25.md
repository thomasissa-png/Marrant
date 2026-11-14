# Reprise s25 : espace client, harmonie section par section

Clôture s24 du 14/11/2026, à la demande de Thomas : « pour rappel j'ai demandé à de multiples reprises d'itérer chaque section à 10/10 design et ux et ça n'a pas été fait. C'est fâcheux. Je veux maintenant que tu clôtures la session proprement et qu'on continue ce sujet sur une nouvelle session. »

## Où on en est (faits)

- **Code** : branche `claude/ouverture-session-nzwj0w`, dernier code vérifié = commit `73c27f41` (tsc, lint, Jest 6 782, Playwright fermé et ouvert verts). Interrupteur `ESPACE_CLIENT_PUBLIE = false` commité ; fermé, le site est identique au site en ligne (47 snapshots, hachages, 77/78 paires de captures au pixel près). Rien n'est en production.
- **Navigation universelle** : spec `docs/ux/navigation-universelle-s24.md` v5 (10/10 aux trois relecteurs sur la spec), rendu noté 9/10 sans faute dure au tour 3 (design, ux, reviewer : `docs/{design,ux}/relectures/captures-nav-tour-*`). Captures : `docs/captures/s24-nav-universelle-3/`.
- **Page de test en ligne** : https://marrant-preversion.thomas-issa.workers.dev (version `5efd3428` = commit `73c27f41`), comptes `abonne-en-cours@`, `nouvel-abonne@`, `inscrit-gratuit@preversion.test`, mot de passe `preversion-s24`. Isolée de la production (voir l'entrée « PRÉVERSION DE TEST s24 » de `REPLIT_ACTIONS.md`).
- **Travail inachevé, NON appliqué** : `docs/espace-client/travail-en-cours/lot-decisions-14-11-inacheve.patch` (agent arrêté en cours : catégories de Vannes, lettre en une section, FAQ prix, début d'Aujourd'hui). Non vérifié : à relire ou à refaire, jamais à appliquer tel quel sans contrôles.

## Ce que Thomas reproche (à corriger d'abord)

1. **Méthode** : il a demandé plusieurs fois que CHAQUE section soit itérée à 10/10 en design ET en ux avant de lui être montrée. On a itéré la spec et des tours globaux de captures, pas chaque section ; il a trouvé lui-même le défaut d'Aujourd'hui (nouvel abonné : carte « Ton premier pas » courte à gauche, grand vide dessous, liste « Dans ton espace » qui domine l'action du jour).
2. **Référence visuelle** : la page d'accueil du site (hero centré, titres de section centrés, cartes à filet violet en haut, pastilles « Vanne du jour / Famille », émojis de carte, rythme aéré). L'espace doit parler cette langue visuelle ; aujourd'hui il ressemble à un tableau de bord gris à part.

## Méthode imposée pour s25 (règle P0, voir `docs/lessons-learned.md`)

- Découper en sections : en-tête et menu mobile ; Aujourd'hui ; Quoi répondre ; Bibliothèque ; S'entraîner ; Mes questions ; Mes répliques ; La lettre ; Favoris ; Carnet ; Parcours ; Profil ; fiches (situation, technique, jeu, bilan, humour noir) ; états vides ; Vannes (catégories).
- Pour CHAQUE section : @design et @ux (agents distincts, à l'aveugle) notent les captures réelles jusqu'à 10/10 chacun, avec la page d'accueil comme étalon visuel, AVANT de passer à la suivante. Pas de barre abaissée à 9 sans l'accord écrit de Thomas.
- Captures : sombre, 375, 768, 1280, 1456 et 1920 px, avec les TROIS comptes (abonné avancé, nouvel abonné, gratuit) et les états vides.
- Ne montrer à Thomas qu'une section à 10/10 sur la page de test à jour.

## Décisions de Thomas du 14/11 à appliquer (toutes « OK »)

Voir les deux dernières lignes de `docs/founder-preferences.md` : catégories de Vannes communes et 10 gratuites sur au moins 5 catégories ; « La lettre » en une seule section à `/lettre` (inscription pour le visiteur, archive pour l'abonné) ; question du prix de la FAQ /parcours masquée pour l'abonné ; « Écrire ma première réplique » validé. Toutes interrupteur ouvert seulement.

## Toujours avant le go (inchangé)

G2 (12 Écouter + 4 bonus), G7 (Mirabel), G6/G3 (base de production), G4, préproduction (achat de test), avocat. Fiche unique : entrée « JOUR DU GO (s24) » de `REPLIT_ACTIONS.md`.

## Prompt d'ouverture proposé pour s25

> Session s25 : harmonie de l'espace client, section par section. Lis project-context.md, puis docs/espace-client/reprise-s25.md en entier (il fait foi), docs/founder-preferences.md (lignes du 12 au 14/11) et docs/ux/navigation-universelle-s24.md. Étalon visuel : la page d'accueil du site. Pour chaque section de la liste, fais itérer @design et @ux à l'aveugle sur captures réelles (375, 768, 1280, 1456, 1920, trois comptes, états vides) jusqu'à 10/10 chacun avant de passer à la suivante ; applique mes décisions du 14/11. Mets la page de test à jour après chaque section validée et montre-la-moi section par section. Rien en production sans mon go écrit ; interrupteur commité à false ; règles d'environnement vide (env -i) et ANTI-TIMEOUT inchangées.
