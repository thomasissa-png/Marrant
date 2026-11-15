# Relecture DESIGN à l'aveugle, s25 v6 tour 2, groupe /vannes

Captures lues : `docs/captures/s25/v6-tour-2/vannes/` (visiteur, gratuit, en-cours ; nouvel = même rendu qu'en-cours, lu en repère) aux 5 largeurs. Les captures 375 pleine page (hauteur 5948 / 6170 px) sont réduites à l'affichage : jugées sur structure (empilement, bande, pastilles, cartes), pas au pixel. Visiteur et gratuit sont identiques hors en-tête (Connexion vs icône compte), c'est voulu.

## Notes

| Critère | Note |
|---|---|
| 1 Fidélité à l'accueil | 9 |
| 2 Hiérarchie et lisibilité | 9 |
| 3 Mise en page aux 5 largeurs | 9 |
| 4 Cohérence avec l'espace | 9 |
| 5 Finition au pixel | 7 |
| **Globale (minimum)** | **7** |

## Faute dure

**F1. Carte « fantôme » floutée sous le bloc d'offre (visiteur et gratuit, 5 largeurs).** Voir `visiteur-vannes-1280.png`, `gratuit-vannes-1280.png`, `visiteur-vannes-768.png`, `visiteur-vannes-375.png` : sous « Encore des vannes à ressortir », une carte à filet violet contient deux barres grises floues et un cadenas violet à droite. Elle se lit comme un squelette de chargement resté bloqué, pas comme une valeur. Le brief navigation v6 interdit « le flou décoratif » et demande du contenu réel ; elle ajoute aussi une seconde zone d'offre (cadenas) juste sous le bouton plein unique. Mur de pixels sans information, au milieu d'un bas de page par ailleurs propre.
- Correction codable : supprimer ce bloc (le composant de fin de liste dans `apps/web/src/components/vannes/vannes-list.tsx`, rendu par `apps/web/src/app/(dashboard)/vannes/page.tsx`), ou le remplacer par 1 à 2 vraies cartes de vannes verrouillées avec titre/début de texte réel et `rounded-xl`, même filet dégradé, sans bouton supplémentaire. La suppression suffit pour 10/10.
- Ce qui ferait 10 : le bloc d'offre `Ouvrir la suite des vannes` reste la seule fin de liste, directement suivi des Questions fréquentes.

## Pistes (ne retiennent pas la note)

- P1 (critère 1, 9) : le H1, le chapô et les titres de section (« Questions fréquentes », « Pourquoi ces vannes sont différentes », « La suite, si tu as pris goût ») sont alignés à gauche, l'étalon d'accueil centre hero et titres de section. À arbitrer avec les autres pages de l'espace (gabarit B/C v5 admet l'alignement à gauche) ; ne pas changer sur cette seule page. Pour 10 : décision écrite « listes alignées à gauche » ou titres de section en `text-center` partout.
- P2 (critère 3, 9) : à 1280, 1456 et 1920 le chapô est plafonné à environ 480 px (3 lignes) et laisse la moitié droite du hero vide, alors que les cartes en dessous remplissent la coque. Pas un débordement, mais déséquilibre. Piste : `max-w-2xl` sur le chapô au lieu de la largeur actuelle (`vannes/page.tsx`).
- P3 (critère 5) : la rangée de pastilles de thèmes se coupe sur « Abs… » derrière le chevron (1280, 1456, 1920, 768) avec une coupe franche. Ajouter un fondu de 24 px à droite (`rangee-defilante.tsx`, `mask-image`), comme la bande des rubriques.
- P4 (critère 5) : étoile et partage des cartes (cercles d'environ 32 à 38 px à 1280 d'après la capture, non mesuré) et flèche de la ligne « Révéler la chute » pourraient être sous 44 px ; vérifier à l'inspecteur et passer en zone tactile 44 px (`p-2.5` ou `min-h-11 min-w-11` avec cercle visuel inchangé). Les textes d'aide (« Clique pour la chute », gris 12 px sur fond sombre) et les pastilles de thème (texte violet 11 px) sont à confirmer AA par mesure, je ne peux pas les certifier sur capture.
- P5 (observation de contenu, hors note) : abonné avancé (`en-cours`), 11 des 12 cartes de la page 1 sont « Boulot & Collègues » alors que la pastille « Toutes » est active : le tri par défaut donne une impression de filtre déjà posé. À vérifier côté logique de tri, pas de texte à toucher.

## Ce qui est conforme

- Cartes `rounded-xl` à filet violet en haut, pastilles de thème, rythme aéré, 2 colonnes de 1216 px sans vide à droite des listes à 1280, 1456, 1920 (coque identique, voulu). 1 colonne à 375, 2 colonnes dès 768, aucune colonne collée ni débordement.
- Un seul bouton plein par page pour le visiteur (offre) ; Premium en en-tête mis à part, c'est l'en-tête. Bande des rubriques : Vannes allumée (soulignée et teintée), cadenas des 5 chips Premium pour visiteur et gratuit, absents pour l'abonné ; bande à 768 qui défile, « Conseils » coupé volontairement.
- Pagination abonné lisible, page 1 en pastille pleine ; FAQ en 3 accordéons alignés ; bloc « La suite » à 3 cartes à filet, cohérent avec « Trois outils » de l'accueil.
- Texte de la FAQ : nouvelle réponse validée, intégration au prochain tour, non notée.

NOTE GLOBALE : 7/10
