# Captures du Parcours Boulot (s19, 11/10/2026) : relecture du rendu @design / @ux

Instance **locale jetable** (Postgres 127.0.0.1:55433, app en env propre, Chromium limité à localhost), jamais la prod. Script : `scripts/qa-parcours-boulot-s19/captures.sh` (fixtures `fixtures.py`, comptes `comptes.sh`, navigateur `captures.js`). Base : schéma + seed + état de la prod relevé le 10/10 (`boulot-base-s19.json`) ; build `BOULOT_PUBLIE` forcé à `true` en local, remis à `false` en sortie (`git diff` de l'interrupteur vide) ; `STORYTELLING_PUBLIE` jamais touché.

**75 captures** : 25 par largeur, en 375 (mobile), 768 (tablette) et 1280 (bureau). Remplacer `<w>` par la largeur dans les noms. Contrôles du dernier run : 114 PASS, 0 FAIL.

Avant les captures, build avec l'interrupteur à `false` : tâche de démarrage complète (4 conseils mis à jour, 2 créés, 10 vannes neuves, 20 vannes en ligne conformes, parcours créé **inactif**, 6 étapes, 3 fiches vidéo corrigées), `/parcours/boulot` en **404**, hub, sitemap et `llms.txt` sans Boulot ; 2e démarrage : tâche sautée (idempotente).

## Visiteur (non connecté)

| Fichier | Ce qu'il montre |
|---|---|
| `visiteur-<w>-hub-haut.png` | Hub `/parcours`, premier écran (« 5 parcours… », quiz d'orientation). |
| `visiteur-<w>-hub.png` | Hub complet, pleine page : les 5 cartes, Boulot en dernier, puis « Explore aussi », FAQ, pied de page. |
| `visiteur-<w>-hub-carte-boulot.png` | Carte Boulot seule : badge de niveau, 6 semaines, 15 min/semaine, 700 XP, accroche, persona Anouk, « Programme » replié, bouton « Commencer ce parcours ». Icône 💼 provisoire. |
| `visiteur-<w>-page-haut.png` | `/parcours/boulot`, premier écran : fil d'Ariane, titre, badge, description, « Pour qui ? », encart « Étape 1 offerte, étapes 2 à 6 avec Premium ». |
| `visiteur-<w>-page.png` | Page complète, pleine page, étapes repliées. |
| `visiteur-<w>-etape1.png` | Étape 1 dépliée, en lecture libre : pourquoi, scène, conseil, exemple, défi TRACE et retour d'exercice, encart « 5 vannes… avec Premium » (les vannes restent Premium, comme dans les autres parcours), 2 vidéos (Thomas VDB, Vérino), quiz 1/3, bouton « Voir l'offre Premium » à la place de la validation. |
| `visiteur-<w>-etape2-apercu.png` à `etape6-apercu.png` | Étapes 2 à 6 dépliées en aperçu : cadenas, XP, badge « Fait partie de Premium », scène (« Ce que tu vas apprendre »), format et durée, texte du verrou et bouton « Voir l'offre Premium ». Ni conseil, ni vannes, ni quiz. |
| `visiteur-<w>-fin-de-page.png` | Bas de page (fenêtre) : pied de page. |

## Premium

| Fichier | Compte | Ce qu'il montre |
|---|---|---|
| `premium-<w>-hub-haut.png`, `premium-<w>-hub.png`, `premium-<w>-hub-carte-boulot.png` | Premium neuf | Hub `/parcours` connecté, mêmes vues que le visiteur. |
| `premium-<w>-page-haut.png`, `premium-<w>-page.png` | Premium neuf | `/parcours/boulot` connecté, aucune étape commencée. |
| `premium-<w>-etape1.png` | Premium neuf | Étape 1 complète : scène, conseil, exemple, défi TRACE, 5 vannes, 2 vidéos, quiz, validation. |
| `premium-<w>-etape2.png` | 1 étape validée | Étape 2 dépliée : PS (scène, conseil, exemple, défi, 5 vannes, 2 vidéos, quiz). |
| `premium-<w>-etape3.png` | 2 étapes validées | Étape 3 : le couloir (5 vannes, Guiz « cabillauds » et Kev Adams, quiz). |
| `premium-<w>-etape4.png` | 3 étapes validées | Étape 4 : l'afterwork (5 vannes, 2 vidéos, quiz). |
| `premium-<w>-etape5.png` | 4 étapes validées | Étape 5 : « Tu fais quoi dans la vie ? » (5 vannes, 1 vidéo, quiz). |
| `premium-<w>-etape6.png` | 5 étapes validées | Étape 6 : le toast de soixante secondes (exemple chronométré, 5 vannes, 1 vidéo Hamzawi, quiz 1/4). |
| `premium-<w>-fin-parcours.png` | 6 étapes validées | Page en fin de parcours (fenêtre). |
| `premium-<w>-fin-parcours-carte.png` | 6 étapes validées | Carte « Parcours Boulot terminé » : 700 XP bonus compris, les 6 acquis, suite proposée « Passer au parcours Storytelling ». |

## Points à regarder (constat de la capture, non tranché)

1. Hub : la carte Boulot affiche **700 XP** (600 XP d'étapes + bonus de fin), cohérent avec la carte de fin.
2. Hub : le quiz d'orientation n'oriente pas vers Boulot (choix de l'implémentation, quiz hors import, `implementation.md` §1).
3. Icône 💼 `[PROVISOIRE]` partout (hub, page) : choix @design attendu.
4. Captures d'élément : découpées dans une capture pleine page (en 375, `element.screenshot()` laissait une bande noire en bas des éléments moins hauts que la fenêtre, qui masquait le bouton « Voir l'offre Premium » des aperçus 2, 3 et 6 ; artefact de capture, pas du rendu).
