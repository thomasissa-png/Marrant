# Rendu itération 4 : notation visuelle @design, Parcours Boulot (état publié) et non-régression (s19, 11/10/2026)

Base : `docs/qa/captures-parcours-boulot-s19/` (index, 107 PNG) et `.../regression/` (index, 89 PNG). Relecture précédente : `rendu-iter-3-design.md` (Boulot 10, non-régression 10, suggestions A à F). Corrections lues : `implementation.md`, section « Rendu itération 4 » (54da5a5). Aucun code ni token modifié. Les [CHOIX UTILISATEUR] du 11/10 ne sont pas re-questionnés.

## Ce qui a été réellement regardé (Read sur les PNG)

- **Carte de progression** : `premium-375/1280-carte-progression-0xp`, `…-en-cours`, `premium-375-carte-progression-erreur`, `premium-375-page-haut-progression`, `premium-375-erreur-chargement` et `…-page` (pleine page réduite : structure seulement). Non-régression : `<4 parcours>-375-premium-carte-progression-en-cours` (4 sur 4), `repartie-375/1280-…-0xp`, `repartie-375-…-erreur`, `repartie-375-premium-erreur-chargement-page` (pleine page réduite).
- **Étapes 2 et 6, repli et critère** : `premium-375-etape2-version-sans-risque`, `premium-375/1280-etape6-version-sans-risque`, `premium-375/1280-etape3-version-sans-risque` (témoin : critère propre au repli), `premium-375-etape2` et `premium-1280-etape2` (pleines pages réduites : structure et enchaînement seulement), `premium-375-etape3-aller-au-defi`, `premium-375-lien-etape-apres-clic`.
- **Défi sur les anciens parcours** : `regression/{machine-a-cafe,repartie,confiance}-{375,1280}-premium-etape2-exemple-defi` (6 sur 6), `repartie-375-visiteur-etape1` (pleine page réduite).
- **Quiz** : `visiteur-375-quiz-orientation-boulot-{raconter,repondre,confiance}` (3 sur 3), `regression/quiz-orientation-375-boulot-masque-{raconter,repondre,confiance}` (3 sur 3).
- **Hub** : `visiteur-375-hub-haut`, `visiteur-1280-hub-haut`, `visiteur-375-hub-carte-boulot` ; `regression/hub-375-visiteur-haut`, `regression/hub-1280-visiteur-haut`.
- **Cartes de fin** : `premium-375-fin-parcours-carte`, `premium-375-fin-machine-a-cafe-boulot-publie-carte`.
- **Non lues** : étapes 4 et 5 Premium, variantes 768, `visiteur-<w>-etape1`, `premium-1280-etape3` hors élément, hub pleine page, cartes de fin 1280. Le détail typographique est jugé sur des captures d'élément (343 à 768 px de large), jamais sur une pleine page réduite.

## Notes

| | Note | Pourquoi |
|---|---|---|
| **Parcours Boulot (état publié)** | **10 / 10** | Aucun bloquant. A, B, C corrigés et prouvés, le défi domine désormais son repli, la carte est équilibrée aux 3 largeurs, le quiz et le hub publiés sont cohérents. 3 défauts neufs, tous mineurs et non bloquants (N-1 à N-3) |
| **Non-régression des 4 parcours en ligne** | **10 / 10** | Aucun élément Boulot visible avec l'interrupteur à `false` (hub « 4 parcours », quiz inchangé). Les nouveautés communes (XP gagnés, défi en gras, lien d'étape) sont propres sur les 4. Deux défauts de coupe typographique sont **antérieurs** à l'itération 4 (R-1), non régressifs |

## Statut des suggestions A à C (et D, F de l'itération 3)

| Suggestion | Statut | Preuve vue |
|---|---|---|
| **A** Lien d'étape : allure de lien sur les 2 lignes | **Corrigée** | `premium-375-carte-progression-en-cours` : « La prochaine étape t'attend. » (souligné) et « Étape 3 · Le couloir : quinze secondes » (même violet de lien, non souligné hors survol). Les 2 lignes se lisent comme un seul lien. Même rendu sur Machine à Café, Répartie, Confiance, Storytelling (« Étape 2 · Sentir le bon moment », « Le rythme et les silences », « Rire de toi sans te rabaisser », « Des personnages qu'on entend ») : aucune coupe en 375, même la plus longue (« Des personnages qu'on entend ») tient sur une ligne. Le point médian remplace bien le deux-points, donc plus de double « : » dans « Étape 3 · Le couloir : quinze secondes » |
| **B** Hiérarchie défi / repli | **Corrigée** | `premium-375-etape2-version-sans-risque`, `etape6-…`, `etape3-…` : le défi garde son fond teinté violet et sa bordure pleine, « DÉFI X » en semi-gras blanc ; le repli n'a plus de fond, une bordure en pointillés neutre et un titre « Version sans risque » en 12 px gris. En plissant les yeux, un seul bloc ressort (le défi), le repli s'efface en second. Réponse à la question posée : **oui, le défi domine** |
| **C** Marge basse de la carte | **Corrigée** | 375 : environ 26 px en haut (au-dessus de « 2/6 ») et 26 px sous « Règle-le dans ton profil » dans `premium-375-page-haut-progression` ; 1280 : même équilibre, rappel sur une ligne. Carte à 0 XP (pas de lien d'étape) : marges aussi régulières, 375 et 1280 |
| **D** (S5) « 700 XP au total » | **Corrigée par choix Thomas** | « 125 XP gagnés sur 700, bonus de fin compris » (en cours), « 0 XP gagné sur 700, bonus de fin compris » (singulier juste). Plus d'ambiguïté avec l'avancement 2/6 |
| **F** Mesure de contraste | **Toujours ouverte** | Non mesuré à l'outil par moi. Le texte gris 12 px du titre du repli et la bordure en pointillés sont de **nouveaux** éléments à mesurer par @qa (voir N-1) |

## Les deux points à juger

**1. Critère de réussite sorti de l'encadré, aligné à gauche sans retrait** (`premium-375-etape2-version-sans-risque`, `premium-375/1280-etape6-version-sans-risque`)
- **Lisible : oui.** Texte de corps (16 px, interligne généreux en 375, environ 95 caractères par ligne en 1280, supportable), même gris que les autres textes courants. À 375, aucune coupe disgracieuse, « C'est gagné si ton PS tient en une phrase et que la version rectifiée en est la toute fin. » tient sur 2 lignes. Le bord gauche coïncide avec le bord extérieur des encadrés (pas avec leur texte intérieur retiré de 13 px) : c'est cohérent avec la note « Ici, … veut dire que… » de l'étape 3 et avec « Alors, ce défi ? », donc la grille tient.
- **Hiérarchisé : à moitié.** Trois niveaux se lisent bien (défi plein, repli pointillé, texte nu). Mais :
  - le critère n'a aucune amorce visuelle : à l'étape 6 (9 lignes à 375, `etape6-version-sans-risque`), c'est le plus long paragraphe de la section et il se lit comme une suite de texte, pas comme « la règle du jeu » ;
  - il est collé sous le repli pointillé et se rattache visuellement à lui (étape 2 : « Pas de mail pro… Écris le PS… » puis « C'est gagné si ton PS tient en une phrase… »), alors qu'il vaut pour le défi **et** le repli. Le critère de l'étape 3, lui, est dans le repli et il y a donc deux logiques de placement ;
  - critère et note de retour d'exercice (« Ton PS resté en brouillon compte… », « Ici, … ») ont le même corps et la même couleur : un seul bloc de 3 paragraphes semblables.
- **Verdict** : non bloquant, la lecture reste juste. Amélioration possible sans toucher au texte (suggestion G).

## Défauts bloquants

Aucun, ni sur Boulot ni sur la non-régression.

## Défauts neufs (tous non bloquants)

**N-1. Pointillés et titre 12 px : poids très faible** (`premium-375-etape6-version-sans-risque`, `…1280-…`)
- Constat : la bordure en pointillés est visible mais très discrète sur fond sombre, surtout en 375 (étape 6, bloc de 4 lignes). Le titre « Version sans risque » est en 12 px gris moyen. L'effet voulu (alternative secondaire) est atteint, mais l'alternative se rapproche d'un texte sans cadre. Le contraste du gris 12 px et de la bordure n'a pas été mesuré à l'outil.
- Correction (CSS, optionnelle) : bordure d'un cran plus marquée (token de bordure existant) ou titre en `text-sm` (14 px) gris. À mesurer par @qa avant tout changement.

**N-2. Boulot en erreur : le rappel e-mail n'apparaît pas, il apparaît sur Répartie** (`premium-375-carte-progression-erreur` contre `regression/repartie-375-premium-carte-progression-erreur`)
- Constat : sur Boulot, la carte en erreur ne contient que l'alerte et « Réessayer ». Sur Répartie, la même alerte est suivie de « Envie d'un rappel par e-mail… » et « Règle-le dans ton profil ». Même composant en principe : l'écart vient sans doute de l'état du compte de test (rappel déjà réglé ou non) [HYPOTHÈSE : non vérifiée, aucune lecture du code]. Aucun des deux rendus n'est faux.
- À faire : @fullstack confirme que le rappel s'affiche de la même façon pour deux comptes dans le même état.

**N-3. Icône du quiz : ☕ mène à Boulot** (`visiteur-375-hub-haut`, `visiteur-1280-hub-haut` contre `visiteur-375-quiz-orientation-boulot-*`)
- Constat : la réponse « Au boulot, en réunion, à la pause » porte ☕ (icône de Machine à Café), et le résultat est « Parcours Boulot » (💼 sur la carte du hub). Petite dissonance de repère visuel. Les 3 captures « Boulot » sont identiques (attendu : la 2e réponse n'influe plus).
- Correction optionnelle : icône 💼 sur cette réponse quand Boulot est publié seulement (l'état masqué doit rester ☕ pour ne rien changer en ligne).

## Anciens parcours : non-régression et défauts antérieurs

- **Défi en gras, exemple en paragraphes** : propre sur Machine à Café, Répartie, Confiance (375 et 1280). « DÉFI BLANCS », « DÉFI SILENCE », « DÉFI FAIT DIVERS » en semi-gras blanc, suite en gris, encadré inchangé. Les exemples tiennent sur un paragraphe, avec un interligne un peu plus aéré qu'avant : lisible, aucun trou. Ni « Version sans risque » ni « Aller au défi » sur ces parcours.
- **Carte de progression des 4 parcours** : « 50 XP gagnés sur 325 / 475 / 800 / 800, bonus de fin compris » et lien d'étape en violet, identiques à Boulot. Répartie à 0 XP, 375 et 1280 : singulier correct, marges régulières. Erreur : plus de « arrive bientôt », page cohérente (étape 1 de repli ouverte).
- **Vidéos de Répartie** : « JCC 8è saison » sous Marina Rollman (`repartie-375-visiteur-etape1`), lisible.
- **Hub sans Boulot** : « 4 parcours … Machine à Café, Répartie, Confiance et Storytelling », quiz « Au boulot » → Machine à Café, Répartie, Confiance selon la 2e réponse, comme avant. Dans `quiz-orientation-375-boulot-masque-repondre`, le bouton « Refaire le quiz » a un fond plein, absent des deux autres : état survol ou focus de la capture, pas un défaut du site [HYPOTHÈSE].
- **R-1. Coupes typographiques sur les anciens parcours (antérieur à l'itération 4, non régressif)** : `machine-a-cafe-375-premium-etape2-exemple-defi` : deux lignes commencent par « : » (« …tu ne dis rien\n: tu laisses… », « …très calme\n: « Ils ont validé ? » »). `confiance-375-premium-etape2-exemple-defi` : « réécris-\nle ». Ce sont les défauts que `frTypoParcours` corrige sur Storytelling et Boulot, réservé aux deux parcours récents par décision. Non bloquant, mais maintenant que le défi est homogène sur les 5 parcours, la typographie est la dernière différence visible (suggestion H).

## Boulot publié : le reste

- **Hub** : « 5 parcours … Storytelling et Boulot » sur 3 lignes en 375 sans orphelin, 3 lignes en 1280 ; carte Boulot complète (💼, « Débutant → Intermédiaire », 6 semaines, 700 XP, accroche, Anouk, « Programme », CTA plein).
- **« Aller au défi »** (`premium-375-etape3-aller-au-defi`, `premium-375-etape2`) : espace sous l'en-tête et au-dessus de « Pourquoi cette étape ? » désormais voisins (environ 30 px de chaque côté en 375), lien aligné sur le texte. Après le clic, « Exercice pratique » arrive sous la barre collante, défi entier visible.
- **Cartes de fin** : Boulot (6 acquis, 700 XP, CTA Storytelling), Machine à Café avec Boulot publié (« Passer au parcours Boulot », accroche de Boulot). Sans défaut.

## Suggestions (non bloquantes)

**G. Critère de réussite (étapes 2 et 6)** : donner une amorce sans changer le texte, par exemple « C'est gagné si » / « C'est réussi s'il » en semi-gras, ou note de retour d'exercice (« Ici, … », « Ton PS resté en brouillon… ») en 14 px gris secondaire pour la distinguer du critère. Fichier : `parcours-step-card.tsx`, bloc `defi-suite` et note. À re-capturer : `premium-375-etape2-version-sans-risque`, `premium-375-etape6-version-sans-risque`.

**H. Typographie des anciens parcours** : étendre `frTypoParcours` à Machine à Café, Répartie, Confiance (supprime les « : » en début de ligne et « réécris-le » coupé). C'est un changement sur des parcours en ligne : à valider par Thomas (la décision d'itération 4 gardait la typographie pour les deux récents), puis re-capturer la non-régression complète.

**I. Pointillés et titre du repli (N-1)** : mesure de contraste par @qa ; si insuffisant, bordure et titre d'un cran plus marqués.

**J. Rappel en erreur (N-2) et icône du quiz (N-3)** : voir ci-dessus, optionnels.

**K. Carte à 1280, ligne d'XP** : alignée à droite, détachée de « 2/6 étapes complétées » à gauche (`premium-1280-carte-progression-en-cours`). Cohérent avec le choix précédent (à gauche en mobile, à droite dès `sm:`), cosmétique, aucune action requise.

## Pour déployer à 10 / 10

1. Rien de bloquant : le déploiement ne dépend pas de G à K.
2. Mesure de contraste par @qa (F, I) : seul point de contrôle visuel encore ouvert.
3. Ne rien déployer sous `BOULOT_PUBLIE = true` hors feu vert de Thomas (visionnage fait selon le brief) et sans entrée `REPLIT_ACTIONS.md`.

---
**Handoff → @orchestrator (puis @fullstack pour G à J si retenues)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-4-design.md`
- Décisions : Boulot publié 10/10, non-régression 10/10 ; A, B, C corrigées et prouvées ; 0 bloquant ; défi dominant face au repli confirmé ; critère sous l'encadré lisible mais peu hiérarchisé (G) ; 3 défauts neufs mineurs (poids du repli, rappel en erreur Boulot contre Répartie, icône ☕ du quiz) ; 1 défaut antérieur sur les anciens parcours (coupes « : » et « réécris-le », suggestion H à valider par Thomas)
- Points d'attention : aucun code ni token modifié ; aucun texte proposé pour le site (aucun tiret cadratin) ; contraste du texte 12 px et des pointillés à mesurer par @qa ; hypothèses marquées (N-2, bouton « Refaire le quiz ») ; pleines pages 375 lues en vue réduite, détail jugé sur captures d'élément
---
