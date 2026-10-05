# Notation indépendante des visuels sociaux, cycle 3 (@reviewer, s15, 05/10/2026)

Périmètre : 35 PNG de `docs/social/visuels-s15/v3/` (24 cas + 11 tests de charge) ouverts un par un, plus `index.md` et `alt.json`. Références : ma notation cycle 2, `strategie-relance-v4.md` (R6, §2, §5), `founder-preferences.md`. Notation de @design non lue.

## Verdict

| Critère | Cycle 2 | Cycle 3 | En une ligne |
|---|---|---|---|
| K3 Visuels | 7 | **8/10** | Finition typographique enfin propre, silhouette du site retrouvée ; il manque l'envie d'envoyer et deux défauts visibles en charge. |
| K4 Formats | 7 | **6/10** | Les rendus sont bons mais les gabarits suivent la stratégie v2, pas la v4 : bouton « Lien en commentaire », carrousel décryptage absent. |
| K9 Conformité | 9 | **6/10** | R6 n'est appliquée sur aucune carte : toutes les vannes à la 1re personne sont nues, sans « … ». |

## Passe de contrôle des 8 points du cycle 2

| # | Point | Statut | Preuve |
|---|---|---|---|
| 1 | Espaces élargies, chiffres elzéviriens | Appliqué | « TGV, la » (`ig-vanne-tgv-1`), « 45 » (`ig-conseil-…-1`), « n° 3 sur 5 », « 7 », « 12 » alignés. |
| 2 | Police | Appliqué | Plus Jakarta Sans partout ; X et LinkedIn de même graisse (`x-vanne-tgv`, `linkedin-vanne-tgv`). |
| 3 | Slide 1 plus forte | Appliqué | Amorce en 800, bloc au tiers haut, « Glisse → ». Bas de carte encore vide sur 45 % (`ig-vanne-tgv-1`). |
| 4 | Amorce puis chute ; slide de fin | Partiel | Amorce et chute séparées (`ig-article-*-2/-3`). Invitation « Envoie-la à ton pote qui… » absente ; URL dite une fois : OK. |
| 5 | Conseil en 3 slides | Appliqué | `ig-conseil-…-3` : principe mot pour mot, lisible. |
| 6 | « la timidité » et surtitres | Appliqué, mais dépassé par R6 | `ig-article-se-presenter-2` montre « la timidité » au 1er niveau ; R6 impose « Au jeu de mimes, ma carte disait “la timidité”. » Ma correction du cycle 2 tombe. |
| 7 | Chevron, espacement, monogramme | Appliqué | Chevron sur la réplique seule ; nombre/titre à ~70 px sur les deux couvertures ; monogramme 72 px. |
| 8 | Légende IG, preuve Buffer | Non appliqué | Légende renvoyée à @social ; aucun brouillon carrousel Buffer prouvé. |

## K3, défauts restants (abonné 20-35 ans, puis correcteur)

| Défaut | Preuve | Correction précise |
|---|---|---|
| Rien n'invite à envoyer | `ig-article-halloween-4`, `ig-conseil-…-3` : seule action = « Lien en bio ». | Sur les cartes vanne, légende « À envoyer à… » (v4 §2) ; sur les fins de carrousel, une ligne au-dessus du bouton. |
| Nombre redondant | « 8 » géant puis « 8 vannes » (`ig-article-halloween-1`, idem « 5 », « 12 »). | Retirer le nombre du titre affiché (« Blagues d'Halloween pour ta soirée déguisée ») ou le chiffre géant. |
| Pied écrasé | `charge/x-titre-90-car-12` : 30 px entre titre et pied, « 12 » collé à ARTICLE. | Plafond 4 lignes en X, sinon corps -15 % ; écart minimal titre/pied 64 px codé dans `mesure-texte.ts`. |
| Trait d'union qui ressemble à un tiret | « stand–upper » (`charge/ig-titre-1`, `-7`) : se lit comme un demi-cadratin sur une marque qui bannit les tirets. | Rendre le seul « - » en Inter 800 (comme le pied `deviens-marrant.fr`), sans attendre Thomas. |
| Coupe déséquilibrée | `ig-vanne-audioguide-1` : « s'est éteint » seul au milieu (40 % de la ligne 1). | « L'audioguide du musée s'est / éteint dans la première salle. » ou corps 76 px. |
| Rythme de chute | `ig-vanne-tgv-2` : « J'ai voyagé / à genoux / devant lui. » en 3 lignes courtes, X le met en 2. | Même coupe sur IG et X : « J'ai voyagé à genoux / devant lui. » |

## K4 Formats (fraîcheur : `index.md` cite la stratégie v2, la v4 l'a remplacée)

- **Bouton « Lien en commentaire »** (`linkedin-conseil-…-3`) : contredit v4 §2.7 (pas de premier commentaire, offre payante Buffer ; lien dans le corps). Correction : bouton retiré ou « Lien dans le post ».
- **Carrousel décryptage IG3 absent** : v4 §5 demande 4 cartes (vanne en 2, carte 3 « Pourquoi ça fait rire », carte 4 « À toi de jouer » + quiz en bio). v3 n'a que le conseil en 3 slides « Pourquoi ça marche ». Gabarit à créer, rendu sur le texte Maxime.
- **Relais IG = 2 cartes** en v4 (IG2 mimes), pas un carrousel couverture + 4 slides ; IG Halloween du 30/10 = carte **sans** « lien en bio ». Rendre ces deux cas réels.
- Légende IG : 80 caractères au plus, pied compris (v4 §2) ; à vérifier dans `carrousel-piste-a.ts`.
- Buffer accepte 10 images par carrousel Instagram (aide Buffer) : faisable, mais tant qu'un brouillon réel n'est pas passé, K4 plafonne à 8.

## K9 Conformité

- **R6 FAIL** sur 12 cartes publiables : `ig-vanne-tgv-2`, `ig-vanne-audioguide-2`, `ig-article-halloween-2/-3`, `ig-article-se-presenter-2/-3`, `x-vanne-tgv`, `linkedin-vanne-tgv` (+ tests de charge). Correction : « … » autour de chaque bloc de vanne à la 1re personne, une paire par carte ; guillemets internes en “ ” (`charge/ig-vanne-longue-1` : « vous descendez ? » devient “vous descendez ?”). Amorces de marque (« Dans le TGV… ») : à trancher dans le gabarit, une règle pour tous.
- **Texte IG2** : la carte montre « Moi, c'est Camille. Au jeu de mimes… », la v4 §5 donne « Au jeu de mimes, ma carte disait “la timidité”. » mot pour mot. Aligner sur le JOKE `cs14jk8f28ff20e1cf82f3a8`.
- `alt.json` l.14, l.17 : « L'ironie bienveillante : Ton pote » (majuscule après deux-points), l.7 et l.11 : citation sans « ». `charge/linkedin-vanne-repli` : « Robert toute l'heure », à vérifier contre le catalogue.
- Zéro tiret cadratin : PASS (sous réserve du trait d'union ci-dessus). Zéro mention IA : PASS.

## Ce qu'il faut pour 10/10 (ordre d'impact)

1. Appliquer R6 dans le gabarit (« … » et “ ”), re-rendre les 12 cartes, aligner IG2 sur le texte v4.
2. Réaligner sur la v4 : retirer « Lien en commentaire », créer le carrousel décryptage 4 cartes, rendre le relais IG 2 cartes et la carte Halloween sans lien.
3. Ajouter l'invitation à envoyer (légende ou fin de carrousel) ; supprimer la redondance du nombre.
4. Écart titre/pied garanti en X, trait d'union en Inter, coupe audioguide et TGV identiques IG/X.
5. Prouver un brouillon carrousel Buffer ; corriger `alt.json`.

Source externe : [Using Instagram with Buffer, aide Buffer](https://support.buffer.com/en-us/articles/using-instagram-with-buffer-YSjg2dXFV8).
