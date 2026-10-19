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
| Autres statuts | 194 vues mais pas retenues, 93 inconnues de Google, 14 en canonique étrangère, 4 explorées mais non retenues | `point-etape-s20.md` §9 (J+7) |
| Jamais explorées | **287 sur 423 (68 %)**, contre 304 au 12/10. Objectif du 19/10 : 250 `[HYPOTHÈSE sans historique]`, **non atteint** | `point-etape-s20.md` §9 ; `maillage-decouverte-s20.md` §2.1 et §7 |
| Découvertes en 7 jours | 18 pages jamais explorées l'ont été (≈ 2,5 par jour) : 8 vannes, 5 vidéos, 4 conseils, 1 page. 16 indexées, 2 en canonique étrangère | `point-etape-s20.md` §9 (J+7) |
| Rythme réel de Google | **5 pages HTML par jour** (médiane, du 30/09 au 16/10). 120 pages du plan explorées sur 422 en 17 jours. **Vidéos : 6 sur 90.** 96,4 % de réponses correctes, 0 erreur serveur. 2,3 pages par jour du 03 au 09/10, puis 6,6 du 10 au 16/10 (hausse **pas attribuable** au maillage : pic du 10/10 déjà là) | `docs/infra/crawl-googlebot-s21.md` §1, §3, §5 (commit `acd51eb`, sur les branches s21, pas encore sur `main`) |
| Temps pour tout explorer une fois | **13 à 35 semaines**, sans compter les pages ajoutées | même fichier, §4 |
| Canoniques étrangères | **14 pages.** Aucune des 11 suivies n'a été recrawlée depuis le 12/10 ; 3 nouvelles. Sur les 28 pages explorées depuis le 12/10 : 24 indexées, **4 étrangères (14 %)** | `point-etape-s20.md` §9 (J+7) |
| Ces 14, par type | blog 1, vannes 4, conseils 6, vidéos 3 (recompté d'après les tableaux du §9) | `point-etape-s20.md` §9 |
| Part étrangère parmi les pages explorées | **vidéos 3 sur 9 (33 %)**, vannes 4 sur 31 (13 %), conseils 6 sur 68 (9 %) `[ESTIMATION : explorées = indexées + étrangères, par section du J+7]` | calcul @seo sur `point-etape-s20.md` §9 |
| Texte propre à la fiche | vidéo ≈ 40 mots (35 à 44), vanne 60 à 70, conseil 124 à 153 | `maillage-decouverte-s20.md` §1.5 |

Contre-indice à garder en tête : le pilier (1 562 mots) a lui aussi été classé « étranger » le 11/10, puis est sorti seul après un nouveau passage de Google (`point-etape-s20.md` §1 et §9). La minceur seule n'explique donc pas tout, et la cause exacte reste `[À VÉRIFIER]` (Cloudflare est innocenté : `googlebot-cloudflare-s20.md`).

**Mises en ligne s21 (18 et 19/10)** : dates du plan du site mises à jour au 18/10 pour les pages de structure, canonique et `og:url` propres, `/lettre`, `/carnet` et `/register` en noindex (bingbot neutralisé), aucune URL changée (`REPLIT_ACTIONS.md`, branche `claude/marrant-s21-integration`, entrée SEO). Effet possible : plus de passages de Google sur les pages de structure. **Il faudra le séparer de l'effet du maillage du 12/10** quand on lira les chiffres du 26/10.

## 2. Les deux options, telles que définies au §5 de `maillage-decouverte-s20.md`

| | **O1 : étoffer le texte public des fiches vidéo** | **O2 : noindex des fiches minces jamais explorées** |
|---|---|---|
| **Ce qu'on fait** | Passer les 89 fiches de ≈ 40 mots propres à 100 à 120 mots lisibles sans compte, sans toucher à la frontière gratuit / Premium (choix du 04/10) ni aux URL. Réserve : « le moment à regarder » demande de **visionner** la vidéo. Sans visionnage, on reste sur la technique et le style, comme les 8 fiches neutres de s20 | Poser « ne pas mettre dans Google » sur les fiches durablement minces et jamais explorées (jusqu'à 287 pages au 19/10). Il faut aussi les sortir du plan du site, sinon on envoie deux signaux contraires (ajout @seo, hors définition du §5) |
| **Temps agent** | `[ESTIMATION : 2 à 3 sessions, par analogie avec le lot vidéo s20 (12 au 13/10, 6 tours de relecture à l'aveugle) ; ici du texte neuf à écrire et à vérifier, pas seulement à corriger]` | `[ESTIMATION : 0,25 jour @fullstack, comme S1 (0,25 j) au §6 de maillage-decouverte-s20.md]` |
| **Risque** | Inventer des faits sur des sketches (c'est pourquoi 8 fiches ont été neutralisées en s20). Règle d'or : chaque texte doit repasser la relecture à l'aveugle. Diff réel à mesurer (P0 s11) | Perdre de la longue traîne qui n'a jamais été évaluée. Va contre l'esprit du choix du 04/10 (fiches ouvertes « pour le SEO »). Contredit la consigne s20 : « mesurer avant de passer des fiches en noindex » |
| **Réversibilité** | Bonne : l'ancien texte est gardé par fiche (`note.before`, tâche `video-content-s20`) | Technique : immédiate. **En pratique lente** : Google ne relit un noindex qu'en repassant, soit quelques pages par jour. Revenir en arrière prend le même temps que tout explorer |
| **Gain attendu** | Pas de gain d'exploration direct. Sur l'indexation : parmi les vidéos explorées, 67 % sont indexées (6 sur 9) contre 87 à 91 % pour vannes et conseils. `[ESTIMATION : si cet écart de ≈ 23 points tenait sur 89 fiches et venait du texte, ≈ 20 fiches vidéo indexées de plus ; n = 9, hypothèse non démontrée]`. Visible seulement après un nouveau passage de Google : `[ESTIMATION : 89 fiches ÷ 0,8 vidéo par jour (12 au 16/10) ou ÷ 0,35 (moyenne 17 jours) = 16 à 36 semaines]`. Clics : aucune fiche vidéo dans le top des pages (`point-etape-s20.md` §4) | **Exploration : ≈ 0.** Google précise qu'une page noindex continue d'être demandée par Googlebot (`crawl-googlebot-s21.md` §5.2). Indexation : 0 (ces pages ne sont pas indexées). Seul effet : l'affichage. `[ESTIMATION : 118 indexées sur 136 au plan (87 %) au lieu de 118 sur 423 (28 %) si on retirait les 287]` |
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
| Pages jamais explorées | 287 | attendu ≈ 270 `[ESTIMATION : 287 moins 7 jours × 2,5]` ; 250 ou moins = le maillage accélère, 280 ou plus = pas d'effet |
| Pages HTML par jour et vidéos explorées (relancer la requête Cloudflare sur le 17 au 25/10, scripts du scratchpad) | 5 par jour, vidéos 6 sur 90 | rythme ≥ 6,6 tenu = le maillage compte ; retour à 2 ou 3 = le pic venait du plan du site. Les données du 30/09 disparaissent vers le 31/10 (rétention 31 jours) |
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

Contrôle de confirmation : **48 heures après les demandes (28/10)**, @data-analyst relit les 14 : combien sont recrawlées et combien redeviennent « nôtres » (critère principal du §3).

## 5. Vérification @data-analyst

> À remplir par @data-analyst avant que Thomas lise. Recalculer chaque ligne depuis les exports bruts, noter l'écart.

| Chiffre à contrôler | Valeur du dossier | Valeur recalculée | Écart | OK ? |
|---|---|---|---|---|
| Indexées / total (J+7) | 118 / 423 = 27,9 % | | | |
| Jamais explorées | 287 (68 %) ; 304 au 12/10 | | | |
| Pages explorées depuis le 12/10 | 28 : 24 + 4 étrangères (14,3 %) | | | |
| Jamais explorées découvertes en 7 jours | 18 (8 / 5 / 4 / 1) | | | |
| Étrangères : total et par type | 14 = 1 / 4 / 6 / 3 | | | |
| Part étrangère par type (calcul @seo) | vidéos 3/9, vannes 4/31, conseils 6/68 | | | |
| Taux d'indexation des explorées (calcul @seo) | vidéos 67 %, vannes 87 %, conseils 91 % | | | |
| Pages HTML par jour, vidéos explorées | 5 médiane ; 6/90 ; 0,8 par jour du 12 au 16/10 | | | |
| Projections `[ESTIMATION]` | 270 le 26/10 ; 16 à 36 semaines ; 87 % | | | |
| Statut des demandes d'indexation du lot 2 | inconnu | | | |

Points de méthode à trancher : « explorée = indexée + étrangère » exclut les 4 explorées non retenues (articles de blog) ; le plan du site est passé de 415 à 423 pages entre le 12 et le 19/10.

---
**Handoff → @orchestrator (puis @data-analyst, Thomas le 26/10)**
- Fichier produit : `/home/user/Marrant/docs/seo/decision-o1-o2-s21.md`.
- Décisions : O1 en pilote de 10 fiches vidéo (5 étoffées, 5 témoins), O2 écarté, ordre : nouveau passage propre des 14 pages avant toute réécriture.
- Points d'attention : `docs/infra/crawl-googlebot-s21.md` et l'entrée s21 de `REPLIT_ACTIONS.md` sont sur les branches s21, pas sur `main` ; toute fiche vidéo modifiée = relecture à l'aveugle, diff réel mesuré, URL et frontière gratuit / Premium intactes ; aucun chiffre de ce dossier n'est validé avant le §5.
---
