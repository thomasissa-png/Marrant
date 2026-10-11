# Corrections documentaires, cycle 7, social (@social, 05/10/2026)

> Sources : `notation-relance-cycle7-reviewer.md` (K9, K1, K5), `notation-relance-cycle7-social.md` (S1 à S4, R8, D1, D3), décision de la session (un facteur à la fois par réseau). Aucun [CHOIX UTILISATEUR] rejoué : `founder-preferences.md` l.61 (commentaires), l.62-63 (pas de compte gratuit) appliquées telles quelles.
> Périmètre : 4 fichiers. Hors périmètre : `mesure.md` (@growth), `complements-lot-s15.md` (@copywriter), code et base (@fullstack, session).

## 1. Corrections faites

| # | Correction | Fichier, lignes (après édition) |
|---|---|---|
| 1 | K9 : plus de relance quotidienne de Thomas (clé Buffer et D8), plus d'échéance au 08/10 pour la clé, plus de fenêtre de réponse. Texte aligné sur l.61 : notifications = signal, 24 h les jours ouvrés, clé « plus tard », rappel au seul relevé du lundi | PE l.13, 14, 16, 24, 179, 181, 182 ; V5 l.36, 196 (R8) |
| 2 | K1 : funnel sans compte gratuit ; seuil de Marc reformulé sur visites + clic CTA (`blog-cta-clic`), `inscription-reussie` sorti du critère, aucun seuil ajouté | V5 l.17-18 |
| 3 | K5 : « à coder » devenu « fait » (`81641f8`, `social-lot-v5.ts:519-531`, tests `-variantes.test.ts:95-113`) | V5 l.37 ; PE l.126 |
| 4 | Bandeau du lot : vrais écarts = LinkedIn 06/10 et 08/10, 4 légendes IG, pont du quiz ; X 09/10 n'est plus un écart (vanne du prof rétablie). PE l.19 aligné | `lot-semaine0.md` l.5 ; PE l.19 |
| 5 | Horaires §6 : alternance par jour (et non par semaine), posts par bras recalculés (X et IG : 6, soit 12 posts sur 4 semaines ; l'ancien 10 et 8 supposait l'alternance par semaine), LinkedIn à J+56 comme V5 §4 | `horaires` l.54, 52, 58-60 |
| 6 | Séquence : heure par jour de J0 à J+28, PUIS vendredi contre dimanche d'Instagram à cadence constante de J+28 à J+56 ; X garde l'image comme facteur de cette période. Inscrit au calendrier V5 §3 (S5 à S9), au plan §7 (ligne avant le 09/11) et à horaires §6 | V5 l.20, 83-87 ; PE §7 ; `horaires` l.62 |
| 7 | S4 : « dès le 13/10 » devenu « dès la semaine du 13/10, 1er post éligible L1 du 15/10 » (L3 du 13/10 porte un lien) | V5 l.6, 110, 174 |
| 8 | D3 : V5 §2 `dynamicParams = true` + `notFound()` (état du code en prod) ; baseline « 28 derniers jours (0) » précisée (seconde baseline du 11/10) | V5 l.61, 97 |
| 9 | Traçabilité : ligne « Amendements du cycle 7 » | V5 l.7 |

## 2. Calendrier du test vendredi contre dimanche (si J0 = 12/10)

Ven. 13/11 = A, dim. 22/11 = B (le ven. 20/11 est déplacé), ven. 27/11 silence (Black Friday, hors test), ven. 04/12 = A, dim. 13/12 = B (le ven. 11/12 est déplacé). **Conséquence calculée** : 3 posts seulement tombent avant J+56 (07/12), le 4e du 13/12 complète la lecture ; lecture indicative à J+56, complète le 14/12. Si J0 glisse, tout glisse d'autant.

## 3. Mesure du diff (P0 s11)

Pas de shell dans cette session : décompte manuel des lignes modifiées, `git diff --stat` reste à faire par la session pour confirmer ces taux.

| Fichier | Lignes avant | Modifiées | Ajoutées | Taux |
|---|---|---|---|---|
| `strategie-relance-v5.md` | 202 | 16 | 1 | 8 % |
| `plan-execution-s15.md` | 246 | 9 | 1 | 4 % |
| `horaires-sources-s15.md` | 66 | 6 | 0 | 9 % |
| `lot-semaine0.md` | 42 | 1 | 0 | 2 % |

Intouchables : slugs, H2, FAQ, prix, seuils chiffrés de V5 §4 (table 120/30, 40/10, etc.), 8 visites de Marc, textes des 10 posts : intacts. Aucun prix ni tiret cadratin ajoutés.

## 4. Choix de ma part à confirmer (hors source littérale)

- D8 (PE l.16) : « relance chaque jour » remplacé par « une seule fois, rappel au relevé du lundi » (étend la règle l.61 au-delà de la clé).
- D6 (PE l.14) : échéance 08/10 remplacée par « clé en suspens » ; D4 passée à « Tranchée ».
- Marc : critère ramené à « 8 visites ET 1 clic CTA » ; la valeur du bouton après suppression du compte gratuit reste à lire par @growth.
- Lundi et vendredi hors test d'heure (reprise de V5 : test mar. à jeu.).

## 5. Reste hors de mes 4 fichiers

- @growth `mesure.md` : M:28, M:32/36 (baseline), M:43 (clé « plus tard »), M:89 (CAC sans « inscrits »), §3 et §7 (par jour, vendredi contre dimanche après l'heure, colonne « lien oui/non »).
- @fullstack : heure B avec `[heure:B]` avant le 09/10, case dimanche `[jour:dimanche]` avant le 09/11, `FORMULES.quizCourt` (S3), régénération des lots 1a et 1b (S4).
- Session : S1 (carrousel IG du 07/10, avant 17:30 UTC) non appliquée dans les docs, faute de décision ; si exécutée, réaligner V5 §1 (« Écarts à la grille »), PE l.19 et PE §1 (carrousels). S2 : consigner dans `REPLIT_ACTIONS.md`.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/social/corrections-cycle7-social.md` ; modifiés : `strategie-relance-v5.md`, `plan-execution-s15.md`, `horaires-sources-s15.md`, `preparation/lot-semaine0.md`
- Décisions : séquence heure puis vendredi/dimanche (Instagram seul), R8 alignée sur FP:61, funnel sans compte gratuit
- Points d'attention : `git diff --stat` à lancer ; §4 à confirmer ; `mesure.md` doit s'aligner
---
