# Lot 1b : textes qui doivent encore passer la relecture à l'aveugle (après correction E1 à E5)

> @fullstack, 10/10/2026. Source : `controle-reviewer-lot-1b.md` (NO-GO, écarts E1 à E5), dry-run de la révision 7 (`lot-1b-dry-run-08-10.md`, sorties dans `/tmp/fs-1b-r7/`). **Aucun texte n'est écrit ici** : chaque entrée donne la case, ce qui manque et ses contraintes. Barre : 2 relecteurs, 8,5, texte lu dans son contexte (cartes ou vanne affichées). Tant qu'une entrée n'est pas tranchée, le dry-run lève l'erreur indiquée et le JSON du lot n'est pas écrit.

## Résumé : 7 entrées, 7 erreurs au dry-run

| # | Case | Ce qui manque | Erreur au dry-run |
|---|---|---|---|
| 1 | jeu. 22/10 12:30 IG, relais `relais-ig-22-10` | légende « À envoyer à... » | légende manquante |
| 2 | mer. 28/10 12:30 IG, vanne V050 (homonyme) | légende « À envoyer à... » | légende manquante |
| 3 | lun. 19/10 12:30 X, relais colocation | renvoi avant le lien | renvoi manquant |
| 4 | lun. 02/11 12:30 X, relais visio | renvoi avant le lien | renvoi manquant |
| 5 | lun. 19/10 19:30 IG, relais (vanne du concert) | renvoi après la légende | renvoi manquant |
| 6 | jeu. 29/10 19:30 IG, relais (vanne du TGV) | renvoi après la légende | renvoi manquant |
| 7 | lun. 02/11 19:30 IG, relais (vanne du théâtre) | renvoi après la légende | renvoi manquant |

## 1. Légendes à écrire puis relire (E4, E5)

### 1.1 Jeu. 22/10 12:30, Instagram, relais de `message-anniversaire-drole-par-situation` (E4)

- **Ligne servie** : n°4 de l'article, au niveau (« = » / « = », `lignes-articles-notes.json`), utilisée nulle part ailleurs (semaine 0, 1a et 1b vérifiés). Carte 1 : « J'ai relu mon discours dans le métro ce matin. Une dame a changé de wagon. » Carte 2 : « Je garde la version courte : joyeux anniversaire. »
- **Renvoi, inchangé** (formule v5, article de 21 textes) : « Les 20 autres textes : lien en bio. » (35 caractères).
- **Contraintes** : partie « À envoyer à... » de **44 caractères au plus**, espace avant le renvoi compris dans les 80 (80 − 35 − 1). Tournure : ni « ton/ta/tes » (le 23/10 : « À envoyer à ton ami… »), ni « qui » en tête (le 21/10 : « À envoyer à qui a déjà décroché… »). Restent « celui qui », « celle qui », « ceux qui » ou un article défini. Aucune URL, ni « deviens-marrant ».

### 1.2 Mer. 28/10 12:30, Instagram, vanne V050 `cs14jk7911857c4ff09eb025` (homonyme) (E5)

- **Vanne** (carte vanne, pas de carrousel), cartes 1 et 2 du catalogue : « Quand on tape mon nom sur Internet, on tombe sur un champion de tir à l'arc. » / « En entretien, on m'a demandé si j'étais dispo pour les régionales. »
- **Contraintes** : **80 caractères au plus**, sans renvoi (case vanne). Tournure : ni « ton/ta/tes » (le 27/10 : « À envoyer à ton tuteur de stage. »), ni « l'ami » (le 29/10 : « À envoyer à l'ami toujours à 2 % de batterie. »). Aucune URL, ni « deviens-marrant ».
- **Vigilance (V2 du contrôle)** : cette vanne a eu 6,5 / 6,5 en contexte de relais au cycle 8 (R03, « chute devinée ») ; la relire avec ses cartes.

## 2. Renvois sans formule exacte (E2, E3)

La v5 (l.32) n'a que deux formules : CATALOGUE « Les N autres sont prêts à copier : », PRATIQUE « Les 4 autres exemples, et comment trouver le tien : » ; Thomas a validé pour Instagram « Les 4 autres exemples : lien en bio. » (IG2, `se-presenter-avec-humour`, 5 accroches). Aucune ne s'applique telle quelle aux cas ci-dessous. Dans le dry-run, ces posts partent **sans renvoi** (X : vanne puis lien ; Instagram : légende retenue seule) et lèvent une erreur.

**Appliqué, hors liste** : jeu. 29/10 12:30 X (`premier-message-drole-appli-de-rencontre`, CATALOGUE) : « Les 18 autres sont prêts à copier : » (18 messages numérotés dans l'article, compté en base). À vérifier au contrôle : la vanne montrée (« Antoine bar », `cs14jkb9ba433a0746280280`) est citée dans l'article mais hors des 18 messages numérotés.

**Candidats déjà écrits** (`complements-lot-s15.md` l.59-60, proposés par @copywriter, jamais relus) : X « D'autres exemples, et comment trouver le tien : » (47 caractères) ; Instagram « D'autres exemples : lien en bio. » (32 caractères). Repli si rien ne passe : X sans renvoi ni lien (repli du 1a, `aveugle-remplacements-cycle8-resultat.md` l.7), Instagram légende seule.

### 2.1 Lun. 19/10 12:30, X, `humour-en-colocation-desamorcer-tensions` (REPARTIE)

- **Pourquoi pas la formule v5** : la ligne montrée vient de l'article (n°1, la poêle), mais l'article compte 5 situations et **6 vannes citées** dans ces 5 situations (plus 1 exemple dans la FAQ) : « Les 4 autres exemples » ne tombe juste que si on compte par situation.
- **Contraintes** : `longueurX` du post sans renvoi = 126 ; renvoi de **143 caractères au plus** (270, espace compris), terminé par « : » avant le lien. Le passage « comment trouver le tien » est vérifié pour cet article (`complements-lot-s15.md` l.62).

### 2.2 Lun. 02/11 12:30, X, `humour-en-visio-reunion-en-ligne` (CONTEXTE)

- **Pourquoi pas la formule v5** : la ligne montrée vient de l'article (ressort 1, « dix minutes seul avec mon visage ») ; l'article compte 5 ressorts et **6 citations**, dont 4 dans les ressorts (le ressort 3 n'en a pas). Aucun compte ne donne « 4 autres exemples ».
- **Contraintes** : `longueurX` sans renvoi = 156 ; renvoi de **113 caractères au plus**. Passage « méthode » de l'article non vérifié (`controle-reviewer-lot-1b.md` E2) : à défaut, « D'autres exemples : » seulement.

### 2.3 Relais Instagram : lun. 19/10, jeu. 29/10, lun. 02/11 (19:30)

Les trois vannes montrées sont des vannes du catalogue **hors de l'article** (« Aucune ligne de l'article disponible ») : tout « Les N autres » est faux (`complements-lot-s15.md` l.55). La v5 n'a pas de formule Instagram sans « autres ».

| Case | Article (catégorie) | Légende retenue (longueur) | Renvoi au plus (80, espace compris) |
|---|---|---|---|
| lun. 19/10 | colocation (REPARTIE) | L38 « À envoyer à la sœur qui a « vu » Beyoncé. » (41) | 38 |
| jeu. 29/10 | premier message (CATALOGUE, 18 messages) | L24 « À envoyer à l'ami toujours à 2 % de batterie. » (45) | 34 |
| lun. 02/11 | visio (CONTEXTE) | L19 « À envoyer à la tante qui applaudit trop tôt. » (44) | 35 |

« lien en bio » une seule fois ; ne part que si les liens de bio sont posés la veille.

## Hors lot 1b (même règle, à prévoir)

Lot 2 : relais du lun. 30/11 (`toast-x`, `toast-ig`, article GUIDE) : même erreur « renvoi manquant » au dry-run synthétique.
