# Relecture UX à l'aveugle : « Quoi répondre », s26 tour 3

Captures lues : 4 comptes x 375, 1280, 1920 (pleine page). Spec UX et typo lues. Code lu : `apps/web/src/app/(dashboard)/mon-espace/quoi-repondre/page.tsx` (vue abonné). Le composant `apercu-quoi-repondre` n'a pas été ouvert : l'aperçu est jugé sur les captures.

## Gate typographique (TAILLES.md, premier écran)
- Visiteur et gratuit, 375/768 : 4 tailles (24, 20, 16, 14), 6 combinaisons. 1280/1920 : 4 tailles (30, 20, 16, 14), 6 combinaisons. Seuils respectés (4 / 6), pile à la limite sur les combinaisons.
- En-cours et nouvel, 375 à 1920 : 4 tailles, 5 combinaisons. Conforme.
- Graisses 400 et 600 uniquement, polices Jakarta (titres, chiffres) et Inter. Aucune taille hors échelle. Pas de faute dure typographique.
- Un seul aplat violet par premier écran : visiteur/gratuit, le bouton d'offre du hero (le second, « La suite est dans Premium », est à y = 1297 à 375 et 1113 à 1280, donc hors premier écran) ; abonné, « Voir ». Conforme. Critères chiffrables de la spec : bouton haut à y = 215 (375, < 700) et 202 (1280, < 450) ; bouton de fin sous 812 / 900 ; première tuile : titre vers y = 625 et 2 lignes de contenu avant 760 à 375. OK.

## Cognitive walkthrough
- Prospect 375 : titre, promesse, offre (bouton y = 215), puis un exemple ouvert « Coloc : la poêle » avec trois répliques fermées. Il sait quoi faire (le seul bouton) et voit ce qu'il achète. Pas de friction.
- Prospect 1280/1920 : hero 8/4, rangée 7/5, rangée 4/4/4, fondu, bouton de fin. Largeur utilisée, aucune colonne centrée seule. Lecture « fermé » : verrous, barres, fondu, un seul repère Premium. Pas de friction.
- Abonné en-cours : « Coloc : "C'est quoi, cette odeur ?" 5 min [Voir] » en tête : action immédiate. La compteur « 1/4 » et la barre pleine au quart montrent l'avancée. Le rail ouvert à gauche donne l'étendue.
- Nouvel abonné : « Coloc : la poêle [Voir] », même gabarit, jamais une page morte. Tous les compteurs à 0/n et barres vides : lisible mais sans élan.

## Audit Nielsen (flow abonné, résumé)
Visibilité de l'état : PASS (compteurs, barres, « Fait » avec coche). Vocabulaire persona : PASS. Contrôle : PASS (filtres par adresse, retrait possible). Cohérence entre comptes : PASS. Prévention d'erreurs : PASS. Reconnaissance : PASS (lieux et pastilles toujours visibles à 1024+). Raccourcis : PASS (prochaine action en un clic). Minimalisme : PASS. Erreurs/vide : PASS (`vide` + `raconte`, `error.tsx`, `loading.tsx`). Aide : PASS.

## Notes par critère (UX)

| Critère | Note | Justification |
|---|---|---|
| 1 Prospect, envie en 3 s | 9 | Fermé lisible, offre en haut à droite, une seule offre, exemple concret. Défaut mineur : à 1280/1920 la tuile situation garde ~100 px de vide sous les trois répliques fermées (y 770 à 870), fin de carte donc permis, mais c'est le plus gros « creux » de l'écran. |
| 2 Abonné, clarté | 9 | Un seul plein, « Voir », dessus de la liste ; rail ouvert ; sur 375 filtres repliés. |
| 3 Abonné, envie de continuer | 8 | La progression n'existe que par lieu (« 1/4 », « 0/6 »). Aucune vue d'ensemble : l'abonné ne voit pas « je suis à n sur 62 ». Treize barres identiques, quasi toutes vides pour un nouvel abonné, donnent plus une impression de montagne que d'élan. |
| 4 Nouvel abonné | 8 | Pas de page morte, action en tête. Mais compte identique à « en-cours » : rien ne distingue le premier jour (tout à 0/n) et la liste de 13 tuiles se déroule sans point d'appui. |
| 5 Accessibilité visible et cohérence | 9 | Boutons et pastilles lisibles, contrastes inchangés (7:1), cohérence visiteur/gratuit/abonnés, `aria-live` et libellés de section au code. Défaut mineur : à 1280 dans le rail, « Commerces, voisins, transports » se casse sur 3 lignes dans une pastille ovale (rendu serré). |

Cibles 44 px : « Voir » en `size: lg` (h-12), non contrôlé au pixel pour le lien « Le carnet du mois » (rail, texte souligné) : à vérifier au code (`LIEN_NEUTRE`), pas chiffrable sur capture.

## Fautes dures
Aucune faute chiffrable relevée (gate typo conforme, un seul aplat par écran, aucun vide au milieu d'un bloc > 32 px).

## Pistes (non bloquantes)
1. Progression globale (sans texte neuf) : afficher en tête de la zone liste, à côté de la tuile « Voir » ou en `META` sous le titre de page, le total `CompteFaits` de tous les lieux (même forme « n/62 »), calculé dans `page.tsx` avec `faits` et `retenues`. Monterait les critères 3 et 4 à 9.
2. Pastilles du rail : passer le libellé long (« Commerces, voisins, transports ») de `rounded-full` à `rounded-xl` quand il passe à la ligne, dans `filtres-situations.tsx`, pour lever l'ovale étriqué (critère 5 à 10).
3. Vide de la tuile situation (aperçu, 1280+) : réduire la hauteur de rangée 1 en laissant la tuile filtres au contenu (`items-start` sur la grille de rangée 1) ou y poser une des pastilles de la rangée 2 ; à arbitrer avec @design, car la tuile filtres impose la hauteur (critère 1 à 10).

NOTE GLOBALE : 8/10

Fautes dures :
(aucune)
