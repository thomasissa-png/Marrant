# Cartes LinkedIn v5 (carte unique 4:5, test texte / image)

Rendu réel `next/og` par `apps/web/scripts/render-carte-linkedin.ts` (chemin `slidesDuPost`, slide 0 : la carte chute 4:5 d'Instagram, Plus Jakarta Sans 800, aplat `#6D28D9`). Texte alternatif et texte du post : `alt.json`. Rien n'est publié par ce script.

| Fichier | Vanne | Taille | Lignes de la chute (relevé à l'oeil, ± 3 px) |
|---|---|---|---|
| `li-v074-rome.png` | Rome, « Ça fait 2h. On vient de récupérer les valises. » | 1080×1350 | colonne x ≈ 146, corps ≈ 100 à 104 px (nominal 100) |
| `li-v044-nicolas.png` | Nicolas / Julien, « Huit mois après, Nicolas est très apprécié. Julien, on ne sait pas. » | 1080×1350 | colonne x ≈ 146, 4 lignes, corps ≈ 74 px, « Nicolas est » à 48 % de la plus longue |

Relevés tirés de `notation-relance-cycle8-design.md` §2 (lecture visuelle des PNG, pas une mesure de pixels).

## Preuve Buffer avec les URL réelles (05/10/2026, vers 23:00 Paris)

Source : `REPLIT_ACTIONS.md`, section « DÉPLOYÉ par la session, Worker `c5c0529b-…` », l.228.

- Post LinkedIn de test `[variante:image]`, inséré **REJECTED** (jamais publiable), puis supprimé de la base.
- `/api/social/image?postId=…&slide=0` : 200 `image/png`, 1080×1350, 3,0 s à froid, rendu identique à `li-v074-rome.png`.
- Brouillon Buffer LinkedIn, 1 image : `6ac4092438629554e340a405`, `status: draft`, asset image, puis supprimé.
- Brouillon Buffer Instagram, 2 cartes (post réel de la semaine 0, slides 0 et 1) : `6ac409274e17d6a1b256ddc3`, accepté, puis supprimé.

## Reste à faire (corrections cycle 8)

- Rendre la carte de L1 canapé (15/10) et ajouter son fichier ici : `corrections-cycle8-design.md` §3.1.
- Aperçus à 390 px des cartes : §3.2.
- Aucune publication LinkedIn réelle avec carte avant le 15/10.
