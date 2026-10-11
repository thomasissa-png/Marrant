# Notation indépendante des visuels sociaux, cycle 2 (@reviewer, s15, 05/10/2026)

Périmètre : 14 PNG `docs/social/visuels-s15/v2/` (piste A), tous ouverts un par un, comparés à `ig-01`, `ig-02`, `ig-04` (anciens gabarits carrés). Grille du plan `docs/social/plan-relance-s15.md` : K3 visuels, K4 formats, K9 conformité. Notation faite sans lire celle de @design.

## Verdict

| Critère | Note | En une ligne |
|---|---|---|
| K3 Visuels | **7/10** (ancien gabarit : 4/10) | Le saut est net : chute cachée, aplat violet, 4:5. Restent des défauts de finition visibles à l'œil nu et une slide 1 trop sage pour arrêter le pouce. |
| K4 Formats | **7/10** | 4:5, 16:9 et 1,91:1 corrects ; carrousel conseil sans fin, extrait d'article qui montre la chute, carrousel Buffer non prouvé. |
| K9 Conformité | **9/10** | Zéro tiret cadratin, zéro mention IA, apostrophes typographiques ; un “ ” isolé et deux textes `[PROVISOIRE]` non tranchés. |

## K3, détail par sous-point (abonné 20-35 ans qui fait défiler)

| Sous-point | Note | Preuve | Correction précise |
|---|---|---|---|
| Arrêt du défilement | 6 | `ig-vanne-*-1` : fond noir, texte blanc moyen, 40 % du haut vide, seul signal = chevron violet 100 px. Dans un fil, ça ressemble à une citation de plus. Les couvertures article (« 8 », « 5 » géants) arrêtent mieux. | Passer l'amorce en Syne/Jakarta 800 (comme la chute) à 72-76 px, remonter le bloc au tiers haut, chevron 140 px. |
| Lisibilité mobile | 8 | Tous les corps ≥ 28 px, marges 96 px (zone sûre de la grille 3:4 respectée), contraste blanc/#6D28D9 fort. Le violet #8B5CF6 sur noir (`ARTICLE`, `CONSEIL`, extraits) est juste au seuil pour le petit texte. | Surtitres en #A78BFA ou blanc 70 %. |
| Typo FR | 6 | Espace élargie visible : « TGV,␣␣la » (`ig-vanne-tgv-1`), « L’audioguide␣␣du » (`ig-vanne-audioguide-1`), « voyagé␣␣à » (`x-vanne-tgv`). Chiffres elzéviriens de Syne qui plongent sous la ligne : « Les 7 autres » et « Les 4 autres » (`*-3`, le 7 se lit comme une barre), « n° 3 sur 5 » (`ig-article-se-presenter-2`), « 45 minutes » (`ig-conseil-…-1`). Coupure déséquilibrée « s’est éteint » seul sur sa ligne (`ig-vanne-audioguide-1`). Bons points : ’ partout, espace avant les deux-points, « n° » correct. | Supprimer l'espace parasite après virgule et après mot élidé dans `typo()` (bloc flex sans espace de fin) ; chiffres en Inter 800 ou passage en Plus Jakarta Sans (chiffres alignés) ; coupe « L’audioguide du musée s’est / éteint dans la première salle. » |
| Identité | 7 | L'aplat violet + gros texte large devient une signature reconnaissable. Mais la police (Syne) n'est pas celle du site (Plus Jakarta Sans, écart 1 de l'index) : le clic vers le site casse la continuité. `linkedin-vanne-tgv` est rendu dans une graisse moins large que `x-vanne-tgv` (même chute, deux silhouettes). Monogramme « d » 56 px quasi illisible dans le fil. | Décision Thomas sur la police (je recommande Plus Jakarta Sans 800 : résout aussi les chiffres et la largeur) ; même graisse X et LinkedIn ; monogramme 72 px. |
| Mise en scène de la chute | 8 | Vannes et conseil : amorce noire puis chute sur aplat, la bascule de couleur fait le « ba-dum ». `ig-vanne-tgv-2` en 2 temps est le meilleur visuel du lot. Faiblesse : `ig-article-*-2` montre amorce et chute sur la même slide (pas de révélation, contraire au principe amorce puis chute). | Extrait d'article en 2 slides : amorce (2/4) puis chute sur aplat (3/4), fin « Les N autres » (4/4). |
| Envie de partager | 6 | TGV : situation vécue, envoyable (« c'est toi »). Audioguide : chute plus faible. Rien n'invite à taguer ; les slides de fin article sont un cul-de-sac (URL écrite 2 fois, `*-3`). Le conseil promet un conseil mais ne montre qu'une réplique (aucune slide « pourquoi ça marche »). | Slide de fin unique pour tous les carrousels : « Envoie-la à ton pote qui… » + URL une seule fois ; conseil en 3 slides (situation, réplique, principe en 1 phrase tiré de `conseils-seed.json` id 42). |

Cohérence entre cartes : écart nombre/titre de 70 px sur `ig-article-halloween-1` contre 40 px sur `ig-article-se-presenter-1` (fixer un espacement constant) ; chevron « sur l'amorce des vannes mais sur la réplique du conseil (choisir une règle : le chevron marque toujours ce qui est dit, donc chute/réplique) ; nombre géant redondant avec le nombre du titre (« 8 » puis « 8 vannes ») ; deux vannes sur le musée dans le lot (audioguide, « guide de musée ») à ne pas publier la même semaine.

## K4 Formats par réseau

| Format | Verdict | Preuve et correction |
|---|---|---|
| Instagram carrousel 4:5 | OK, à compléter | 1080×1350 conforme ; zone sûre de la grille 3:4 respectée (texte à 96 px des bords). Manque la slide de fin sur le conseil et la séparation amorce/chute sur l'extrait d'article (voir K3). |
| Légende IG | À revoir | Index : légende = amorce seule. Or l'amorce est déjà sur la slide 1 : doublon lu deux fois. Légende = question ou tag (« Ton pire voyage en TGV ? »), jamais la chute. |
| X 1600×900 | OK | Chute seule, amorce dans le tweet : bonne révélation (texte lu avant l'image). Corriger « voyagé␣␣à ». |
| LinkedIn 1200×627 | OK, pas optimal | Format correct mais petit sur mobile ; un 1080×1080 occupe plus de fil pour un texte seul. Aligner la graisse sur X. |
| Chaîne de publication | Non prouvée | Carrousel Buffer `[À VÉRIFIER]` (index l.38) : tant qu'un brouillon à N images n'est pas passé, K4 ne peut pas dépasser 8. |

## K9 Conformité

- Zéro tiret cadratin sur les 14 images : PASS. Zéro mention IA : PASS. Humoristes : aucun cité, rien à vérifier.
- `ig-article-se-presenter-2` : “la timidité” s'affiche entre guillemets anglais alors que le guillemet ouvrant extérieur n'est qu'un pictogramme et n'est jamais fermé. La règle du 05/10 (“ ” seulement dans un « … ») n'est lisible que si l'extérieur l'est. Correction : afficher « la timidité » (le chevron est un ornement, pas un guillemet), ou fermer le bloc. À trancher une fois par Thomas.
- `[PROVISOIRE]` non validés : surtitre « Extrait : n° 2 sur 8 » (lourd, lu comme un numéro de dossier) et titre du conseil en surtitre. Proposition : « Vanne 2/8 » et « Accroche 3/5 ».

## Ce qu'il faut pour 10/10 (ordre d'impact)

1. Supprimer les 3 espaces élargies et les chiffres elzéviriens (le plus visible, visible par tous).
2. Décision police : Plus Jakarta Sans 800 (cohérence site, chiffres, X = LinkedIn), sinon chiffres en Inter.
3. Slide 1 plus forte : amorce en 800, bloc remonté, chevron plus grand.
4. Extrait d'article en amorce puis chute sur 2 slides, slide de fin commune avec invitation à envoyer à un pote, URL une seule fois.
5. Conseil en 3 slides avec le principe en une phrase.
6. Trancher « la timidité » et les deux surtitres provisoires.
7. Règle unique du chevron, espacement nombre/titre constant, monogramme 72 px, surtitres plus clairs.
8. Légende IG différente de l'amorce ; preuve d'un brouillon carrousel Buffer.

Sources externes : [grille Instagram 3:4, Oktopost](https://www.oktopost.com/blog/instagram-grid-size-guide/), [zone sûre carrousel, Krumzi](https://www.krumzi.com/blog/instagram-carousel-size-guide), [tailles LinkedIn, Kanbox](https://www.kanbox.io/blog/linkedin-image-size-guide).
