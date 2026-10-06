# Notation design, cycle 3 (06/10/2026)

Méthode : 6 PNG, 6 contrôles et 3 aperçus mobiles ouverts et lus un par un. Les cotes viennent de la lecture du rendu (±5 px) et du recoupement avec les mesures `sharp` de `index.md` (je n'ai pas relancé de mesure moi-même). Zones sûres non mesurées sur téléphone : voir réserve en fin de fichier.

## Vérification des 4 corrections du cycle 2
| Correction | État | Constat sur le rendu |
|---|---|---|
| LinkedIn : bloc à x 348, titre 48, bloc monté de 6 px | Fait | Encre à x 351 à 982 sur les deux lignes (même bord droit), centrée verticalement (47 px en haut, 46 en bas). Recadrage 900 px : le logo (x 151 à 317) laisse 34 px (15 pt) avant le « D » et le « F », plus aucun contact. Titre 16,6 px et sous-titre 13,1 px en pleine largeur. |
| X : ligne d'appel 56 px | Fait | Glyphes x 539 à 1382, 14,6 px sur mobile (seuil 14). Marges latérales équilibrées (116 à gauche, 112 à droite), 0 pixel dans la photo et les recadrages. |
| Répartie : boîte 420, rayon 264,5, jeu de 22 px | Fait | Rayon 264,5 pour 360 de limite (marge 95 px, comme les 3 autres : 97 à 112). Plus de soudure : les deux bulles sont séparées par 22 px en horizontal et en vertical. Trait de 61 px identique aux 3 autres. |
| Vannes : tige prolongée | Fait | Plus d'encoche visible au raccord arc/tige/pied (colonnes x 509 à 570 pleines). Le petit décrochement restant (8 px de tige entre l'arc et le pied) est la géométrie normale d'un micro, pas un défaut. |

## Le crochet de la 2e bulle de Répartie (à 64 px)
Lu en grand et dans l'aperçu : la 2e bulle est un tracé ouvert dont chaque extrémité se termine par un bout rond (en haut à droite, x 637 à 737 ; en bas à gauche, x 475 à 550). C'est le même vocabulaire que les bouts ronds ouverts de l'ampoule et de l'arc du micro, donc il fait partie de la famille. À 64 px, le crochet fait environ 9 px, le jeu avec la 1re bulle 2 px : la 2e bulle se lit comme une bulle ouverte qui répond à la première, pas comme un « 1 » ni un défaut. Les deux extrémités sont symétriques par rotation, le glyphe est équilibré (centre de l'encre à 4 px et 12 px du centre de la boîte). Verdict : acceptable, aucune correction.

## Notes
| Visuel | Cycle 2 | Cycle 3 | Justification |
|---|---|---|---|
| X A | 9 | **10** | Titre dominant, « plus drôle. » en lilas, ligne d'appel lisible (14,6 px), composition en diagonale qui évite la photo. Contraste de la ligne d'appel supérieur à 10:1. |
| LinkedIn B | 8,5 | **10** | Bloc net, deux lignes alignées sur les deux bords, contraste #EDE9FE sur #6D28D9 environ 6:1, aucun contact avec le logo. |
| IG Quiz | 10 | **10** | Inchangé : net, rempli, centré (rayon 248). |
| IG Vannes | 9,5 | **10** | Encoche effacée, rayon 263 inchangé. |
| IG Conseils | 10 | **10** | Inchangé (rayon 250). |
| IG Répartie | 9 | **10** | Poids et marge alignés sur la famille, soudure supprimée, crochet cohérent. |

Moyenne 10 (9,3 au cycle 2). Aucune correction chiffrée à demander. Je n'ai trouvé aucun point inférieur à 10.

## Réserve (sans effet sur la note)
Zones sûres non mesurées sur téléphone réel : le rendu respecte les valeurs documentées les plus contraignantes (cercle de 64 px et zone de 720 px pour Instagram, logo de 80 pt et recadrage 900 px pour LinkedIn, photo de 84 px et recadrages de 70 px pour X). Précision LinkedIn : si le logo fait 80 pt (cas le plus défavorable), le jeu avec le texte tombe à environ 7 pt, sans contact.
