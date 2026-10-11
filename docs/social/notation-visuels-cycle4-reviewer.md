# Notation indépendante des visuels sociaux, cycle 4 final (@reviewer, s15, 05/10/2026)

Périmètre : 17 PNG de `docs/social/visuels-s15/v4/` (11 cartes + 6 tests de charge) ouverts un par un, `index.md`, `alt.json`. Références : ma notation cycle 3, `strategie-relance-v5.md` §8 et R6, `duels-resultat-cycle5.md`, `founder-preferences.md`. Notation de @design non lue.

## Verdict

| Critère | Cycle 3 | Cycle 4 | Preuve en une ligne |
|---|---|---|---|
| K3 Visuels | 8 | **9/10** | Guillemets lilas suspendus, chute isolée sur l'aplat, une idée par carte : je m'arrête, je comprends, je glisse. Restent une coupe qui casse le temps comique et un saut d'alignement entre cartes 1 et 2. |
| K4 Formats | 6 | **8/10** | Gabarits v5 tous présents (vanne 2 cartes, décryptage 4 cartes, relais 2 cartes, « Lien dans le post »). Plafonné à 8 : brouillon Buffer carrousel non prouvé (`index.md` l.45), Halloween 30/10 non rendu. |
| K9 Conformité | 6 | **9/10** | R6 appliquée sur les 8 cartes vanne, “ ” imbriqués, textes mot pour mot v5 §8 et duels (IG2 = A mimes, IG3 = A Léa). Un écart : légende du relais périmée dans `index.md`. |

## Passe de contrôle de ma notation cycle 3

| # | Point | Statut | Preuve |
|---|---|---|---|
| 1 | R6 « … » et “ ” | Appliqué | 8 cartes vanne, paire par ligne de catalogue ; cartes 3, 4, surtitres, pied sans guillemets (`ig3-anniv-de-lea-3/-4`). Espace fine rendue en U+2009 (U+202F absente de la police, `mise-en-lignes.ts:19`) : acceptable. |
| 2 | Texte IG2 aligné | Appliqué | `ig2-mimes-1` : « Au jeu de mimes, ma carte disait “la timidité”. » mot pour mot. |
| 3 | « Lien en commentaire » | Appliqué | `charge/ig-conseil-3` : « Lien dans le post », ni « Glisse » ni pagination. |
| 4 | Décryptage 4 cartes, relais 2 cartes | Appliqué | `ig3-anniv-de-lea-1..4`, `ig-relais-blagues-ia-1/-2`. |
| 5 | Halloween 30/10 sans lien | **Non appliqué** | Aucun PNG ; « Halloween » absent de `render-visuels-piste-a.ts`. |
| 6 | Invitation à envoyer | Appliqué | Par la légende (v5 §8), `defautsLegende` appelé l.118 du script. IG1 51, IG2 79, IG3 72 caractères : recomptés, exacts. |
| 7 | Nombre redondant | Appliqué | Chiffre géant retiré, « 5 » et « 12 » en lilas dans le titre. |
| 8 | Pied écrasé en X | Appliqué | `charge/x-titre-95-car` : environ 140 px titre/pied. Sans objet en publication (X : texte seul). |
| 9 | Trait d'union | Appliqué | `charge/x-titre-stand-upper` : « stand-upper » se lit comme un trait d'union. |
| 10 | Coupes audioguide, TGV | Sans objet | Cartes retirées du contenu figé. |
| 11 | `alt.json` | Appliqué | Carte 2 = amorce + chute avec « », cartes 3 et 4 sans guillemets. |

## Défauts restants (réel = à corriger ; goût = libre)

| Type | Défaut | Preuve | Correction précise |
|---|---|---|---|
| Réel | La chute de l'amorce tombe en milieu de ligne, « sans » isolé de « moi » | `ig3-anniv-de-lea-1` : « un groupe sans / moi. J'ai boudé / trois jours. » | Coupe forcée : « J'ai découvert que / mes potes avaient / un groupe sans moi. / J'ai boudé trois jours. » (tient à 88 px, ligne la plus longue ≤ 860 px). |
| Réel | Le texte saute d'environ 20 px vers la droite entre carte 1 et carte 2 | Bord gauche du texte 123 px (`ig1-tuteur-1`, `ig3-anniv-de-lea-1`, `ig-relais-blagues-ia-1`) contre 143 à 145 px (cartes -2) | Marge gauche du texte fixe sur les deux cartes (ex. 136 px, « suspendu à 80 px), indépendante de la largeur du bloc. |
| Réel | Légende du relais 26/10 marquée `[À FOURNIR]` alors que v5 §8 l.165 la donne | `index.md` l.28 | Reporter « À envoyer à qui t'a fait lire son roman. Les 5 autres vannes : lien en bio. » (75, recompté) et la passer dans `defautsLegende`. |
| Réel | Halloween 30/10 non rendu | v5 §8 l.166 | Rendre 2 cartes : « Pour Halloween, j'ai proposé à mon date qu'on se déguise en couple. » / « Elle a dit “ne va pas trop vite”. », légende (60) sans lien en bio. |
| Goût | « mon rapport / de stage » coupe le groupe nominal | `ig1-tuteur-1` | Le correctif à 5 lignes viole la règle des 40 % (« Il m'a dit ») : laisser. |
| Goût | Amorce à 40 %, chute centrée : le bloc descend au glissement | cartes -1 contre -2 | Choix de @design, défendable (la chute « tombe »). |
| Goût | « Le quiz est / dans le lien de la bio. » déséquilibré | `ig3-anniv-de-lea-4` | « Le quiz est dans / le lien de la bio. » si @design le souhaite. |

Hors visuels, pour @social : v5 §8 l.163 titre encore « IG2 (retenu : C) » et §9 l.173 « Retenu : C », alors que `duels-resultat-cycle5.md` retient A. Les cartes suivent le résultat des duels, c'est correct ; le document est à mettre à jour.

Correcteur : apostrophes et guillemets typographiques, espace avant « : », « À » accentué, ordre ”. » conforme. Zéro tiret cadratin : PASS. Aucun texte de marque à la 1re personne : PASS.

## Verdict final

**GO pour présenter les 11 cartes à Thomas.** Avant la première publication (12/10), à faire : (1) coupe `ig3-anniv-de-lea-1`, (2) marge gauche fixe cartes 1 et 2, (3) légende du relais dans `index.md`, (4) rendu Halloween 30/10, (5) brouillon Buffer carrousel 2 et 4 images prouvé (v5 §2.6), seul point bloquant pour publier. (1) à (4) font passer K3 et K9 à 10 ; (5) fait passer K4 à 10.
