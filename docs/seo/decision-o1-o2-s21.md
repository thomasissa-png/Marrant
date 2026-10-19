# Décision O1 / O2 du 26/10 : dossier pour Thomas (@seo, préparé le 19/10/2026)

> Documentation seule : aucun code, aucun déploiement, aucune demande d'indexation. Lecture : 3 minutes.
> Trois mots, sans jargon. **Explorée** : Google est passé voir la page. **Indexée** : la page est dans Google et peut sortir dans les résultats. **Canonique étrangère** : Google a décidé que notre page est la copie d'une page d'un autre site (un site de paris en ligne, un site de cinémas) et ne la retient pas.

## En bref

- **Recommandation : O1 en pilote sur 10 fiches vidéo (pas les 89), et pas d'O2.** Détail et critère de changement au §3.
- **Pourquoi** : le frein n'est pas la qualité jugée (les pages explorées sont presque toutes indexées), c'est que Google passe peu (environ 5 pages par jour). Aucune des deux options ne change ça vite. O2 n'apporte rien à l'exploration et fait perdre une longue traîne jamais testée. O1 peut aider, mais on ne sait pas encore si le texte est la cause : on teste petit avant de réécrire grand.
- **Le 26/10, Thomas** : tests en direct et demandes d'indexation (30 minutes), puis un oui ou un non au pilote (§4).

## 1. La situation en chiffres réels (19/10, 423 pages au plan du site)

| Mesure | Chiffre | Source |
|---|---|---|
| Pages indexées | **118 sur 423 (27,9 %)**. Elles étaient 94 le 11/10 (sur 414) et 98 le 15/10 (sur 422) | `point-etape-s20.md` §3 et §9 (J+3, J+7) |
| Autres statuts | 194 détectées mais jamais explorées, 93 inconnues de Google, 14 en canonique étrangère, 4 explorées mais non retenues | `point-etape-s20.md` §9 (J+7) |
| Jamais explorées | **287 sur 423 (68 %)**, contre 304 sur 415 (73 %) au 12/10 (bases différentes : 8 pages ajoutées au plan du site entre-temps). Objectif du 19/10 : 250 `[HYPOTHÈSE sans historique]`, **non atteint** | `point-etape-s20.md` §9 ; `maillage-decouverte-s20.md` §2.1 et §7 |
| Découvertes en 7 jours | 18 pages jamais explorées l'ont été (≈ 2,6 par jour, 18 ÷ 7) : 8 vannes, 5 vidéos, 4 conseils, 1 page. 16 indexées, 2 en canonique étrangère | `point-etape-s20.md` §9 (J+7) |
| Rythme réel de Google | **5 pages HTML par jour** (médiane, du 30/09 au 16/10). 120 pages du plan explorées sur 422 en 17 jours. **Section vidéos : 6 URL sur 90, dont le hub `/videos` (vu le 16/10) : soit 5 fiches sur 89** (le fichier source écrit « fiches vidéo : 6 sur 90 », l'export brut liste 5 fiches et le hub). 96,4 % de réponses correctes, 0 erreur serveur. 2,3 pages par jour du 03 au 09/10, puis 6,6 du 10 au 16/10 (hausse **pas attribuable** au maillage : pic du 10/10 déjà là) | `docs/infra/crawl-googlebot-s21.md` §1, §3, §5 (commit `acd51eb`, sur les branches s21, pas encore sur `main`) |
| Temps pour tout explorer une fois | **13 à 35 semaines**, sans compter les pages ajoutées | même fichier, §4 |
| Canoniques étrangères | **14 pages.** Aucune des 11 suivies n'a été recrawlée depuis le 12/10 ; 3 nouvelles. Sur les 28 pages explorées depuis le 12/10 : 24 indexées, **4 étrangères (14 %)** | `point-etape-s20.md` §9 (J+7) |
| Ces 14, par type | blog 1, vannes 4, conseils 6, vidéos 3 (recompté d'après les tableaux du §9) | `point-etape-s20.md` §9 |
| Part étrangère parmi les pages explorées | **vidéos 3 sur 9 (33 %)**, vannes 4 sur 31 (13 %), conseils 6 sur 68 (9 %) `[ESTIMATION : explorées = indexées + étrangères, par section du J+7]`. Arithmétique vérifiée (§5), mais effectifs très petits : l'écart entre types n'est pas statistiquement établi | calcul @seo sur `point-etape-s20.md` §9, vérifié par @data-analyst |
| Texte propre à la fiche | vidéo ≈ 40 mots (35 à 44), vanne 60 à 70, conseil 124 à 153 | `maillage-decouverte-s20.md` §1.5 (HTML de prod du 12/10 ~07:00 UTC ; le lot de textes vidéo s20, 84 fiches réécrites, a été déployé le même jour 12/10 selon `REPLIT_ACTIONS.md`, heure non notée : **à remesurer sur la prod avant de dimensionner O1**) |

Contre-indice à garder en tête : le pilier (1 562 mots) a lui aussi été classé « étranger » le 11/10, puis est sorti après un nouveau passage de Google, obtenu par le test en direct et la demande d'indexation de Thomas le 11/10 au soir (`maillage-decouverte-s20.md` §2.3 et A1) (`point-etape-s20.md` §1 et §9). La minceur seule n'explique donc pas tout, et la cause exacte reste `[À VÉRIFIER]` (Cloudflare est innocenté : `googlebot-cloudflare-s20.md`).

**Mises en ligne s21 (18 et 19/10)** : dates du plan du site mises à jour au 18/10 pour les pages de structure, canonique et `og:url` propres, `/lettre`, `/carnet` et `/register` en noindex (bingbot neutralisé), aucune URL changée (`REPLIT_ACTIONS.md`, branche `claude/marrant-s21-integration`, entrée SEO). Effet possible : plus de passages de Google sur les pages de structure. **Il faudra le séparer de l'effet du maillage du 12/10** quand on lira les chiffres du 26/10.

## 2. Les deux options, telles que définies au §5 de `maillage-decouverte-s20.md`

| | **O1 : étoffer le texte public des fiches vidéo** | **O2 : noindex des fiches minces jamais explorées** |
|---|---|---|
| **Ce qu'on fait** | Passer les 89 fiches de ≈ 40 mots propres à 100 à 120 mots lisibles sans compte, sans toucher à la frontière gratuit / Premium (choix du 04/10) ni aux URL. Réserve : « le moment à regarder » demande de **visionner** la vidéo. Sans visionnage, on reste sur la technique et le style, comme les 8 fiches neutres de s20 | Poser « ne pas mettre dans Google » sur les fiches durablement minces et jamais explorées (jusqu'à 287 pages au 19/10). Il faut aussi les sortir du plan du site, sinon on envoie deux signaux contraires (ajout @seo, hors définition du §5) |
| **Temps agent** | `[ESTIMATION : 2 à 3 sessions, par analogie avec le lot vidéo s20 (12 au 13/10, 5 tours de relecture à l'aveugle pour les 84 fiches, jusqu'au tour 7 pour les 2 dernières (`REPLIT_ACTIONS.md` s20)) ; ici du texte neuf à écrire et à vérifier, pas seulement à corriger]` | `[ESTIMATION : 0,25 jour @fullstack, comme S1 (0,25 j) au §6 de maillage-decouverte-s20.md]` |
| **Risque** | Inventer des faits sur des sketches (c'est pourquoi 8 fiches ont été neutralisées en s20). Règle d'or : chaque texte doit repasser la relecture à l'aveugle. Diff réel à mesurer (P0 s11) | Perdre de la longue traîne qui n'a jamais été évaluée. Va contre l'esprit du choix du 04/10 (fiches ouvertes « pour le SEO »). Contredit la consigne s20 : « mesurer avant de passer des fiches en noindex » |
| **Réversibilité** | Bonne : l'ancien texte est gardé par fiche (`note.before`, tâche `video-content-s20`) | Technique : immédiate. **En pratique lente** : Google ne relit un noindex qu'en repassant, soit quelques pages par jour. Revenir en arrière prend le même temps que tout explorer |
| **Gain attendu** | Pas de gain d'exploration direct. Sur l'indexation : parmi les vidéos explorées, 67 % sont indexées (6 sur 9) contre 87 à 91 % pour vannes et conseils. `[ESTIMATION : si cet écart de ≈ 23 points tenait sur 89 fiches et venait du texte, ≈ 20 fiches vidéo indexées de plus ; n = 9, hypothèse non démontrée]`. Visible seulement après un nouveau passage de Google : `[ESTIMATION : 89 fiches ÷ 0,6 fiche par jour (12 au 16/10, 3 fiches) ou ÷ 0,29 (moyenne 17 jours, 5 fiches) = 21 à 43 semaines ; corrigé : la version initiale comptait le hub /videos comme une fiche (0,8 et 0,35, soit 16 à 36 semaines). La lecture Search Console du 19/10 (9 vidéos explorées contre 2 au 12/10, soit 1 par jour) irait plus vite : ≈ 11 semaines pour les 80 restantes]`. Clics : aucune fiche vidéo dans le top 10 des pages (`point-etape-s20.md` §4) | **Exploration : ≈ 0.** Google précise qu'une page noindex continue d'être demandée par Googlebot (`crawl-googlebot-s21.md` §5.2). Indexation : 0 (ces pages ne sont pas indexées). Seul effet : l'affichage. `[ESTIMATION : 118 indexées sur 136 au plan (87 %) au lieu de 118 sur 423 (28 %) si on retirait les 287]` |
| **Valeur persona** | Réelle : une fiche de 40 mots plus un lecteur YouTube est une maigre « analyse pédagogique » pour Yanis | Nulle pour le visiteur |

## 3. Recommandation

**O1 en pilote, O2 écarté.**
1. **O2 non** : il ne libère aucune exploration, il n'indexe rien de plus et il détruit une option qu'on n'a jamais mesurée. Il ne redevient discutable qu'au 11/11 si, malgré tout, moins de 25 % des vannes et 10 % des vidéos sont explorées `[HYPOTHÈSE : seuils du maillage §7, sans historique]`.
2. **O1 en pilote, pas en lot de 89** : les vidéos sont le signal le plus net (1 explorée sur 3 classée étrangère, 6 indexées sur 89, texte le plus mince). Mais 89 fiches coûtent cher et le lien texte → Google n'est pas prouvé. Pilote : **10 fiches vidéo jamais explorées, 5 étoffées et 5 témoins non touchées**, test en direct puis demande d'indexation le même jour, lecture 7 jours après. Une demande d'indexation fait explorer en quelques heures (cas du pilier), ce qui évite d'attendre des mois. Si 4 étoffées sur 5 sont indexées contre 2 témoins sur 5 au plus `[HYPOTHÈSE : seuil de décision, n très petit]`, on lance les 79 autres.
3. **Ordre** : d'abord traiter les 14 pages étrangères par un nouveau passage propre (§4), sans changer un mot. Celles qui restent étrangères après ça sont les vrais cas de « rendu trop maigre ».

**Ce qui ferait changer cette recommandation**
- **Principal** : si au moins 10 des 14 pages étrangères redeviennent « nôtres » après un simple nouveau passage (sans retouche), le problème est un classement passager côté Google, pas le texte : **ni O1 ni O2**.
- **Secondaire** : si le test en direct montre une page vide, un défi ou une erreur, c'est un problème de serveur : ni O1 ni O2, la capture part à @infrastructure.

## 4. Contrôle J+14 du 26/10 et ce que Thomas fait

**Ordre du jour : @data-analyst lance le contrôle J+14 AVANT que Thomas demande quoi que ce soit** (une demande d'indexation provoque un passage et fausserait la mesure du rythme naturel). Règles : `point-etape-s20.md` §9, recette dans `maillage-decouverte-s20.md` §7.

| À mesurer le 26/10 | Aujourd'hui (19/10) | Lecture |
|---|---|---|
| Pages étrangères recrawlées seules depuis le 12/10, parmi les 14 | 0 sur 11 suivies | 5 ou plus : verdict page par page (règle 2) ; moins : pas de verdict, et c'est l'action de Thomas (ci-dessous) qui débloque |
| Part des nouveaux passages classée étrangère | 4 sur 28 (14 %) | stable ou en hausse : le phénomène persiste ; en baisse nette : il s'éteint |
| Pages jamais explorées | 287 | attendu ≈ 270 `[ESTIMATION : 287 moins 18 (rythme des 7 derniers jours), hors pages ajoutées au plan du site]` ; 250 ou moins = le maillage accélère, 280 ou plus = pas d'effet |
| Pages HTML par jour et vidéos explorées (relancer la requête Cloudflare sur le 17 au 25/10, scripts du scratchpad) | 5 par jour ; section vidéos 6 URL sur 90 (hub + 5 fiches) | rythme ≥ 6,6 tenu = le maillage compte ; retour à 2 ou 3 = le pic venait du plan du site. Les données du 30/09 disparaissent vers le 31/10 (rétention 31 jours) |
| Indexées, dont vidéos et vannes | 118 ; vidéos 6/89 ; vannes 27/156 | tendance seulement |
| Pages de structure (`/`, `/vannes`, `/conseils`, `/videos`, `/blog`, `/parcours`) revues après le 18/10 | à relever | effet de la date du plan du site (s21), à ne pas mélanger au maillage |
| Pilier | indexé, canonique nôtre | doit le rester ; relever ses impressions sous l'adresse sans `www` sur « comment devenir drôle » |
| `/lettre`, `/carnet`, `/register` | noindex en ligne depuis s21 | vérifier qu'ils restent hors Google |

**Ce que Thomas fait lui-même (≈ 30 minutes, 2 minutes par adresse)** :
1. **Test en direct de la vidéo Krief** : Search Console > Inspection de l'URL > coller `https://deviens-marrant.fr/videos/berengere-krief-filles-et-garcons-cmmp8p3lv0` > « Tester l'URL en direct » > « Afficher la page testée » > **capture d'écran** (page et HTML) à transmettre.
2. **Même test pour les 3 nouvelles** (pertinent : ce sont des passages récents, donc les preuves les plus fraîches) : la vanne « Sur le fond d'écran de mon mari… » (`/vannes/sur-le-fond-decran-de-mon-mari-il-y-avait-nous-deux-devant-cv1321baa3`), la vanne « Ma copine a fait un tableau des tâches ménagères… » (`/vannes/ma-copine-a-fait-un-tableau-des-taches-menageres-avec-un-cs14jkb13e`) et la vidéo Paul Séré (`/videos/paul-sere-jamel-comedy-club-saison-8-2015-cmmp8p1nw0`).
3. **Demande d'indexation, une seule fois par adresse, seulement si la page testée est complète.** Si elle est vide, en défi ou en erreur : ne rien demander, envoyer la capture. Ordre : les 4 plus récentes d'abord, puis les 10 du tableau (`point-etape-s20.md` §9). Quota d'une dizaine par jour `[À VÉRIFIER : non exposé par l'API]` : prévoir 2 jours.
4. **Dire si les demandes du lot 2 (13/10) ont déjà été faites.** Les fichiers ne le disent pas. Si elles l'avaient été, ces pages auraient sans doute été recrawlées (comme le pilier) : elles ne l'ont pas été.
5. **Répondre** : pilote O1 oui ou non, O2 écarté oui ou non.

Contrôle de confirmation : **48 heures après les demandes (28/10 pour le premier lot, 29/10 si les demandes s'étalent sur 2 jours)**, @data-analyst relit les 14 : combien sont recrawlées et combien redeviennent « nôtres » (critère principal du §3).

## 5. Vérification @data-analyst

> @data-analyst, 19/10/2026. **Aucun accès** à l'API Search Console ni au shell : les chiffres Search Console sont recalculés depuis les tableaux et totaux par section de `point-etape-s20.md` §3 et §9 et de `maillage-decouverte-s20.md` §2 (pas depuis les exports JSON d'inspection, qui ne sont pas dans le dépôt). Les chiffres Cloudflare sont recalculés depuis le tableau journalier de `crawl-googlebot-s21.md` §1 et l'export brut `urls_html_googlebot.json` du scratchpad.
>
> **Bilan : 23 lignes de contrôle (une ligne regroupe souvent plusieurs chiffres, environ 70 au total) : 13 vérifiées sans correction de valeur, 7 écarts corrigés dans le texte du dossier, 3 non vérifiables.**
> **Impact sur la recommandation : aucun changement de sens (O1 pilote, pas d'O2), mais trois fragilités à connaître avant le 26/10** (détail sous le tableau) : (1) l'écart « vidéos étrangères 33 % » repose sur 9 pages et n'est pas statistiquement établi ; (2) le « ≈ 40 mots » des fiches vidéo date d'une mesure du 12/10 qui coïncide avec le déploiement du lot de textes vidéo s20, à remesurer ; (3) le pilote 5 contre 5 ne peut pas trancher statistiquement.

| Chiffre à contrôler | Valeur du dossier | Valeur recalculée (source) | Écart | OK ? |
|---|---|---|---|---|
| Indexées / total (J+7) | 118 / 423 = 27,9 % | 118 / 423 = 27,90 % (`point-etape` §9 J+7) ; 94/414 et 98/422 également repris à l'identique (§3, J+3) | aucun | Vérifié |
| Statuts du J+7 | 194 + 93 + 14 + 4 + 118 | 194 + 93 + 14 + 4 + 118 = 423 | aucun sur les nombres ; **libellé corrigé** : « Détectée, non indexée » = jamais explorée, et non « vue mais pas retenue » | Écart (libellé) corrigé |
| Jamais explorées | 287 (68 %) ; 304 au 12/10 | 287 / 423 = 67,8 % ; 194 + 93 = 287 ; 304 / 415 = 73,3 % (`maillage` §2.1) | 68 % arrondi correct ; **bases différentes (415 contre 423)**, précisé dans le texte. De plus 304 − 18 = 286, pas 287 : l'écart de 1 suppose qu'une seule des 8 pages ajoutées reste inexplorée (le nouvel article) et que les 7 autres l'ont été, ce que le §9 ne dit pas | Vérifié, base précisée |
| Pages explorées depuis le 12/10 | 28 : 24 + 4 étrangères (14,3 %) | 4 / 28 = 14,29 % (`point-etape` §9 J+7) | aucun | Vérifié |
| Jamais explorées découvertes en 7 jours | 18 (8 / 5 / 4 / 1), ≈ 2,5 par jour, 16 + 2 | 8 + 5 + 4 + 1 = 18 ; 16 + 2 = 18 ; 18 / 7 = 2,57 | **≈ 2,6 par jour** (corrigé). Les écarts par section entre le 12 et le 19/10 donnent plutôt vidéos +7 (9 explorées contre 2), vannes +13, conseils +4, pages +1, soit 25 : les 7 de plus seraient des pages ajoutées au plan du site, mais cela n'explique pas vidéos (7 contre 5, aucune fiche vidéo ajoutée : 89 aux deux dates). Écart non résolu, à relire par @seo | Écart corrigé (2,6) ; ventilation par type non réconciliée |
| Étrangères : total et par type | 14 = 1 / 4 / 6 / 3 | Tableau des 10 : blog 1, vannes 2, conseils 6, vidéo 1 ; + Krief (vidéo) + 3 nouvelles (2 vannes, 1 vidéo) = 1 / 4 / 6 / 3 = 14 (`point-etape` §9) | aucun | Vérifié |
| Part étrangère par type (calcul @seo) | vidéos 3/9, vannes 4/31, conseils 6/68 | Indexées J+7 : vidéos 6, vannes 27, conseils 62 ; + étrangères 3, 4, 6 = **9, 31, 68** ; 3/9 = 33,3 %, 4/31 = 12,9 %, 6/68 = 8,8 % | **Aucun : le calcul de l'auteur est exact.** Réserves : (a) type des 4 « explorées non indexées » du J+7 non donné (au 11/10 : 4 articles de blog), s'ils n'étaient pas tous du blog les dénominateurs bougent ; (b) le total « vannes 156 » du §9 n'est pas les 142 fiches du 12/10 (regroupement non défini, thèmes et 7 ajouts possibles) ; (c) n très petit : intervalle à 95 % (Wilson) vidéos 12 à 65 %, vannes 5 à 29 %, conseils 4 à 18 %, **les trois se recoupent** ; vidéos contre vannes + conseils (3/9 contre 10/99) : p ≈ 0,075 unilatéral, non significatif à 5 % | Vérifié, non significatif |
| Taux d'indexation des explorées (calcul @seo) | vidéos 67 %, vannes 87 %, conseils 91 % ; écart ≈ 23 points ; ≈ 20 fiches de plus | 6/9 = 66,7 % ; 27/31 = 87,1 % ; 62/68 = 91,2 % ; vannes + conseils : 89/99 = 89,9 %, écart 23,2 points ; 89 × 0,232 = 20,6 | aucun | Vérifié |
| Explorées indexées (« presque toutes ») | non chiffré | 118 / (118 + 14 + 4) = 86,8 % | « presque toutes » = 87 %, 1 explorée sur 7,5 non retenue | Vérifié |
| Pages HTML par jour | 5 médiane, du 30/09 au 16/10 ; 2,3 puis 6,6 | Somme du tableau journalier = 164 ; moyenne 9,65 ; médiane (17 valeurs triées, 9e) = 5 ; 16/7 = 2,29 ; 46/7 = 6,57 (`crawl-googlebot-s21` §1) | aucun | Vérifié |
| Couverture du plan par Googlebot | 120 / 422 en 17 jours ; 96,4 % de 200 ; 0 erreur serveur | 120/422 et 635/659 = 96,4 % (§1, §3) ; 5xx = 0 ; 4 erreurs 404 sur anciens JS/CSS | aucun ; « réponses correctes » = codes 200 | Vérifié |
| Vidéos explorées (Cloudflare) | « 6 sur 90 » ; 0,8 par jour du 12 au 16/10 | Export brut : 5 fiches + le hub `/videos` ; 12 au 16/10 : Krief (13), Paul Séré (15), 1 fiche + hub (16) = **3 fiches, 0,6 par jour** ; 17 jours : **5 fiches, 0,29 par jour** | **Écart** : 6 sur 90 comptait le hub ; juste = 5 fiches sur 89 (+ hub). Libellé corrigé. L'erreur vient de `crawl-googlebot-s21.md` §1 et §5.2 (branche s21, à corriger là aussi) | Écart corrigé |
| 13 à 35 semaines pour tout explorer | 13 à 35 | 308 / 3,4 = 91 j = 12,9 semaines ; 308 / 1,25 = 246 j = 35,2 semaines (`crawl` §4) ; sur le stock actuel de 287 : ≈ 12 à 33 semaines | aucun sur la source ; légèrement pessimiste (stock du 15/10) | Vérifié |
| Texte propre par type | vidéo ≈ 40 (35-44), vanne 60-70, conseil 124-153 | Identique à `maillage` §1.5 (médianes par groupe de 40 fiches). Mesure sur le HTML du 12/10 ~07:00 UTC ; **lot de textes vidéo s20 déployé le 12/10** (`REPLIT_ACTIONS.md`, 84 fiches : description, 4 enseignements, exercice) | Cité à l'identique ; **peut être périmé** pour les vidéos | Non vérifiable (pas d'accès à la prod) |
| Projection 270 le 26/10 | 287 − 7 × 2,5 | 287 − 18 = 269 (rythme réel 18 en 7 jours) | Formule corrigée ; ignore les pages ajoutées au plan (+8 en 7 jours entre le 12 et le 19/10), donc plutôt un plancher | Vérifié, formule corrigée |
| Projection vidéos | 89 / 0,8 ou 0,35 = 16 à 36 semaines | 89 / 0,6 = 21 semaines ; 89 / 0,29 = 43 semaines. Lecture Search Console 19/10 : 9 explorées contre 2, soit 1 par jour, 80 restantes ≈ 11 semaines | **Corrigé : 21 à 43 semaines** (le hub était compté) ; la tendance du 12 au 19/10 est plus rapide | Écart corrigé |
| Projection 87 % | 118 / 136 | 423 − 287 = 136 ; 118 / 136 = 86,8 % | aucun | Vérifié |
| Seuil O2 du 11/11 | vannes < 25 %, vidéos < 10 % | Source `maillage` §7 identique. Aujourd'hui : vannes 31/156 = 19,9 %, vidéos 9/89 = 10,1 % | Le seuil vidéos est **déjà dépassé** : la condition de réouverture d'O2 ne peut plus être remplie au 11/11 (le nombre de pages explorées ne baisse pas). Renforce « pas d'O2 » | Vérifié, à noter |
| Pilier « sorti seul » | « sorti seul après un nouveau passage » | `maillage` §2.3 et A1 : exploré quelques heures après le test en direct et la demande d'indexation de Thomas (11/10 au soir) | **Faux, corrigé** : il n'est pas sorti seul. Le dossier le dit déjà au §3 (« cas du pilier ») : contradiction interne supprimée | Écart corrigé |
| Tours de relecture du lot vidéo s20 | « 6 tours » | `REPLIT_ACTIONS.md` s20 : 5 tours pour les 84 fiches, tour 7 pour les 2 dernières (Duval, Azencot) | **Corrigé** (« 5 à 7 ») ; « 8 fiches neutres » vérifié (`corrections-videos-s20-neutres.md`, ids 10, 11, 14, 15, 16, 25, 26, 27) | Écart corrigé |
| Autres repères | 0,25 j (S1), 30 min (14 URL × 2 min), 4 + 10 = 14 demandes, rétention 31 jours, « top des pages » sans vidéo | S1 0,25 j (`maillage` §6) ; 28 min ; 14 ; rétention « 4w3d » = 31 jours (`crawl` §6) ; `point-etape` §4 : top 10 sans fiche vidéo | « top des pages » = top 10 (précisé) ; quota d'indexation et durée : `[À VÉRIFIER]` déjà marqués | Vérifié |
| Mises en ligne s21, commit `acd51eb`, branche `claude/marrant-s21-integration` | cités | Absents de `main` et de ce worktree (`REPLIT_ACTIONS.md` sans entrée s21) | Aucun | Non vérifiable |
| Statut des demandes d'indexation du lot 2 | inconnu | Aucun fichier ne le dit. Indice, pas preuve : `crawl-googlebot-s21.md` §0 ne relève de Google-InspectionTool (tests en direct de Search Console) que le 30/09 et le 12/10 sur la période 30/09 au 16/10 ; aucun test en direct visible du 13 au 16/10, alors que le lot 2 était prévu le 13/10. Rien de lisible après le 16/10 | Seul Thomas peut trancher (question 4 du §4) | Non vérifiable |

**Lecture de l'écart « vidéos étrangères » (point signalé par l'auteur).** Le calcul par type est refait et exact : 3/9, 4/31, 6/68. Il ne dit pas que le texte mince cause le classement étranger : avec 3 pages, un seul cas de plus ou de moins déplace la part de 11 points. La cause reste `[À VÉRIFIER]` comme le dossier le dit déjà. Ce qui manque pour trancher : les types des 4 « explorées non indexées » du J+7, la définition exacte des regroupements par section du §9, et au moins une vingtaine de vidéos explorées.

**Pilote 5 contre 5.** Avec 4 étoffées indexées contre 2 témoins, le test exact donne p ≈ 0,26 (unilatéral) ; même 5 contre 2 donne p ≈ 0,08. Le pilote ne peut donc pas démontrer un effet, seulement signaler un écart très net (5 contre 0 : p ≈ 0,004). Le seuil « 4 sur 5 contre 2 au plus » du §3 est à lire comme un indice, pas une preuve, ce que le dossier marque déjà par `[HYPOTHÈSE]`.

**Points de méthode.** « Explorée = indexée + étrangère » exclut les 4 explorées non retenues : effet nul sur les vidéos si elles sont toutes du blog (au 11/10 elles l'étaient), non vérifié au J+7. Le plan du site passe de 415 (12/10) à 423 (19/10) : toute comparaison de parts doit citer sa base.

---
**Handoff → @orchestrator (puis @data-analyst, Thomas le 26/10)**
- Fichier produit : `/home/user/Marrant/docs/seo/decision-o1-o2-s21.md`.
- Décisions : O1 en pilote de 10 fiches vidéo (5 étoffées, 5 témoins), O2 écarté, ordre : nouveau passage propre des 14 pages avant toute réécriture.
- Points d'attention : `docs/infra/crawl-googlebot-s21.md` et l'entrée s21 de `REPLIT_ACTIONS.md` sont sur les branches s21, pas sur `main` ; toute fiche vidéo modifiée = relecture à l'aveugle, diff réel mesuré, URL et frontière gratuit / Premium intactes ; chiffres vérifiés par @data-analyst le 19/10 (§5), 7 corrigés, 3 non vérifiables ; `docs/infra/crawl-googlebot-s21.md` §1 et §5.2 écrivent « fiches vidéo : 6 sur 90 » alors que c'est 5 fiches et le hub, à corriger sur la branche s21.
---
