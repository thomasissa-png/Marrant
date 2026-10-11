# Recoupements du 07/10/2026 (@copywriter, plan-execution-s15 §1, §2, §3, §4)

> Sources : `plan-execution-s15.md`, `validation-thomas-s15.md`, `social-pool.ts` (`POOL_STRICT`, 40), `social-calendrier.ts` (`RESERVEES_NOEL`, 4), `lot-semaine0.json` (10 `sourceId`), `complements-lot-s15.md` §1, `audit-conseils-s14.md`, `articles-forte-frappe/`, `articles-q4/`, `pilote-p0/`. `[À VÉRIFIER]` = non prouvé par les fichiers lus. Rien n'est inventé.

## 1. Exemptées (7) et Noël (4) contre le pool strict (40)

**Résultat : 7 recouvrements avec `POOL_STRICT` (3 exemptées + 4 de Noël). Aucun recouvrement entre les deux listes, ni avec les 10 de la semaine 0.**

Les 9 posts validés par Thomas = 7 vannes (X1, X2, X3, IG1, IG2, IG3, L1) + 2 textes de marque (L2, L3, sans vanne). Identifiants repris du texte exact dans `catalogue-vannes-valides.md`.

| Post | Date | Vanne (début) | Identifiant | Dans `POOL_STRICT` |
|---|---|---|---|---|
| X1 | 13/10 | Alexa, historique de recherches (V100) | `cmmnsqn130027th63at2ene9i` | non (retirée à la construction : 41 moins Alexa = 40) |
| X2 | 22/10 | Parents fiers de moi | `cs14jk0e4fedaac1a91fddf1` | non |
| X3 | 21/10 | Train, place réservée | `cs14jk50c85bb0d73deaebaf` | **OUI, V014** (9,0 / 8,5) |
| IG1 | 27/10 | Tuteur, rapport de stage | `cs14jke5d015b07714055538` | **OUI, V025** (9,0 / 9,0) |
| IG2 | 12/10 | Jeu de mimes, la timidité | `cs14jk8f28ff20e1cf82f3a8` | non |
| IG3 | 14/10 | Groupe sans moi, « Anniv de Léa » | `cs14jk04b4bc8bbf8a2d8a05` | **OUI, V019** (9,0 / 9,0) |
| L1 | 15/10 | Canapé de l'espace détente | `cs14jka89abf28d3769b05fe` | non |

Les 4 vannes de `RESERVEES_NOEL` (`social-calendrier.ts` l.105, `NOEL_DES` = 24/12) sont **toutes les 4 dans `POOL_STRICT`** :

| V | Identifiant | Notes |
|---|---|---|
| V097 | `cs14jkee5c537f7286c1da98` | 8,5 / 8,5 |
| V043 | `cs14jk4fe660e7238281ce47` | 8,5 / 9,0 |
| V066 | `cs14jkc4a2c545e132b38a92` | 8,5 / 8,5 |
| V079 | `cs14jkffeab1620070f2263e` | 8,5 / 9,0 |

Point annexe : V079 figure aussi dans `PAIN_IDS` (même fichier, l.108), donc Noël et « pain » (1 par fenêtre de 30 jours) se cumulent sur elle. Sans conséquence de stock, à garder en tête pour le tirage de décembre.

**Effet sur le stock du plan** (le « 30 au 12/10 » = 40 moins les 10 de la semaine 0) :

| Étape | Vannes |
|---|---|
| Pool strict | 40 |
| moins les 3 exemptées au niveau (jamais rejouées : V014, V019, V025) | 37 |
| moins les 10 de la semaine 0 (retour dès le 04/01) | 27 |
| moins les 4 de Noël (exclues avant le 24/12) | **23** (le plan affiche 30) |
| plus les 2 du pilote P0 (§6) | 25 (le plan affiche 32) |

Le « reste 23 après 1a » du plan §2 devient 16. À corriger dans `plan-execution-s15.md` §1 l.37 et §2 (tableau des tranches) : `[À VÉRIFIER]` que `--pool` exclut bien les 3 exemptées, ce que `POOL_STRICT` ne fait pas aujourd'hui (elles y sont). La section 2 retire encore 2 vannes (carrousels fixes), soit 21 libres pour octobre.

## 2. Vannes des carrousels contre le pool strict et la semaine 0

**Périmètre.** `complements-lot-s15.md` §1 ne contient que les **8 carrousels livrés (mercredis 04/11 au 30/12)**. Les 12 fiches Q1 (mercredis 06/01 au 24/03) n'ont **aucune vanne désignée** dans les fichiers lus : le recoupement porte donc sur ces 8 vannes (celles que le plan l.38 demande de recouper), et la règle des 90 jours est donnée plus bas pour le choix des vannes Q1. `[À VÉRIFIER]` si Thomas attendait une autre liste de 8.

**Résultat : 2 vannes dans le pool strict (V060, V083), 0 dans la semaine 0, 0 dans les 7 exemptées. V083 est à changer au 23/12 au titre des 90 jours** : le lot 1a la tire le 13/10 en Instagram (71 jours, `lot-1a-dry-run-07-10.md` l.50). Le costume (seul cas de semaine 0) est bien sorti du 23/12, mais sa remplaçante ne peut pas être V083.

| Date de la fiche | Vanne | Pool strict | Semaine 0 | Exemptées |
|---|---|---|---|---|
| mer. 04/11 | `cs14jkb81aae613b293f204b` | non | non | non |
| mer. 18/11 | `cs14jke956e7ca02641e25c5` (« pain ») | non | non | non |
| mer. 25/11 | `cs14jk20142f9a641e8ea80f` | non | non | non |
| mer. 02/12 | `cs14jkbdb9858fdd496e962a` | non | non | non |
| mer. 09/12 | `cs14jk577fa779cb48fa9b55` | **OUI, V060** (8,5 / 8,5) | non | non |
| mer. 16/12 | `cmp9fpyd4006ys60xwsegez9e` | non | non | non |
| mer. 23/12 | `cs14jka3336e7e90a453a9d6` (**à changer** : tirée le 13/10 par le lot 1a) | **OUI, V083** (9,0 / 9,0) | non (le costume `cs14jkdb222991fcbf194845` l'était : retiré) | non |
| mer. 30/12 | `cs14jkbe6b6bc15755d06863` | non | non | non |

Les 10 `sourceId` de la semaine 0 (`lot-semaine0.json`) : V044 `cs14jk0c96df8dc97a67e3f6` (06/10 X), V045 `cs14jkdf1cef669030ec828a` (06/10 IG), V074 `cmonlkgeu000ds60wu0gazutb` (06/10 LI), V070 `cs14jk34c841ef6e1abadb11` (07/10 X), V087 `cs14jkdb222991fcbf194845` (07/10 IG, costume), V033 `cs14jk18882246f6446df2b7` (08/10 X), V059 `cs14jk2fd7c7c96d7815407d` (08/10 IG), V049 `cs14jk0761c9f2d885762bb5` (08/10 LI), V076 `cs14jkafa211aede70b92cc8` (09/10 X), V101 `cs14jk2ef0aabfbf4784ad82` (09/10 IG). Les 10 sont dans `POOL_STRICT`.

**Deux points qui demandent une action.**
1. V028 et V060 (`RESERVEES_CARROUSEL`, `social-lot-v5-fixes.ts:151-154` ; V083 n'est pas réservée : tirée le 13/10 par le lot 1a) sont des vannes du pool prises par des fiches fixes : le script ne les arrête pas (`social-lot-v5.ts:153`, cité par le plan). Il faut les **retirer du tirage du pool** ou le tirage peut les reposer à moins de 90 jours de la fiche. Le stock libre d'octobre passe de 23 à **21** (liste ci-dessous).
2. Le créneau X du 11/12 (`c07449f36fe373722f52fc463`) portait V083 dans le dry-run : il doit recevoir une autre vanne. **Proposition** : V111 `cs14jk9a9e7a1b8e0e16264e` (« Au jeu deux vérités et un mensonge, j'ai dit trois vérités. », 8,5 / 9,0), jamais postée, hors semaine 0, exemptées, Noël et carrousels. Réserve : le dry-run (obsolète) la place le 15/10 en X ; au lot régénéré, ne la prendre le 11/12 que si elle n'est pas déjà tirée à moins de 90 jours, sinon la suivante de la liste libre.

**Liste libre au 12/10 (21 vannes)** = pool strict moins semaine 0 (10), exemptées (3), Noël (4), carrousels fixes (2) : V061, V105, V111, V007, V009, V011, V013, V015, V028, V035, V037, V040, V041, V046, V047, V050, V055, V058, V064, V094, V096.

**Règle pour choisir les vannes des 12 fiches Q1** : une vanne de la semaine 0 est admissible à partir de J+90 : V044, V045, V074 dès le 04/01 ; V070, V087 dès le 05/01 ; V033, V059, V049 dès le 06/01 ; V076, V101 dès le 07/01. Les 7 exemptées ne reviennent jamais. Pour la fiche du 06/01 : V044, V045, V074 sont à 92 jours, V070 et V087 à 91, V033, V059, V049 à pile 90 (limite, à éviter), V076 et V101 à 89 (refusées). Le costume (`cs14jkdb222991fcbf194845`, nommé « V150 » dans le plan et V087 dans `social-pool.ts`) : le plan le place à un mercredi du 13/01 ou après ; l'identifiant fait foi, `[À VÉRIFIER]` la numérotation V150 contre V087.

## 3. Vannes de bureau (BOULOT) dans le pool strict

**Réponse demandée : `[À VÉRIFIER en base]`.** Les commentaires de `social-pool.ts` (V, notes) et `stock-vannes-resultat-s15.md` (liste de V) ne portent **aucune catégorie** : le décompte BOULOT n'y est pas lisible.

**Décompte indicatif (hors des 2 fichiers prescrits)** : `catalogue-vannes-valides.md` (« généré le 01/10/2026 depuis la base ») classe les vannes par catégorie. Section BOULOT : 15 vannes, dont **5 dans `POOL_STRICT`** : V074 `cmonlkgeu000ds60wu0gazutb` (Rome), V049 `cs14jk0761c9f2d885762bb5` (voisine en visio), V044 `cs14jk0c96df8dc97a67e3f6` (Nicolas/Julien), V087 `cs14jkdb222991fcbf194845` (costume), V025 `cs14jke5d015b07714055538` (tuteur). Les 10 autres BOULOT du catalogue ne sont pas au niveau (dont le canapé `cs14jka89abf28d3769b05fe`, exemptée L1, et la vanne « pain »).

**Conséquence, à confirmer en base** : sur ces 5, **4 sont dans la semaine 0** (V044 X, V074 LI, V087 IG, V049 LI) et **1 est exemptée** (V025, IG1 le 27/10). **Vannes de bureau au niveau disponibles au 12/10 : 0.** La règle « LinkedIn tire d'abord les vannes de bureau » (plan §2, 48 posts) n'a plus de stock dans le pool actuel ; les 2 LinkedIn de la semaine 0 ont consommé V074 et V049. Aucune des 2 vannes P0 n'est BOULOT (§6 : ECOLE et PARENTS). Les 14 vannes hors lot (notées le 07/10) ne sont pas catégorisées ici : à regarder en base, c'est la seule source de bureau possible avant V1.

Limites : le catalogue date du 01/10 (les catégories ont pu bouger depuis), et une vanne d'une autre catégorie peut se passer au bureau (non vérifié vanne par vanne). Le décompte par thème « bureau » (plan §2) et la catégorie BOULOT ne sont donc pas strictement la même chose.

## 4. Réserve de conseils

**Comptes (tableau §3 de `audit-conseils-s14.md`, relus ligne à ligne)** : GARDER **26**, REECRIRE **80**, soit **106** retenables (438 audités, 332 RETIRER). Chiffres identiques à la synthèse du fichier.

**Note ≥ 8,5 : sans objet, la note n'existe pas.** L'audit ne porte que des verdicts (GARDER, REECRIRE, RETIRER) et un motif, aucune note chiffrée. Nombre de conseils à ≥ 8,5 : **0 mesuré**. La barre des conseils (`mix-formats-s15.md` §4) est au moins 8/10 chez 2 relecteurs `[HYPOTHÈSE]` : cette notation n'est pas faite `[À VÉRIFIER]`.

**Réserve S1 après les 38 : 106 moins 38 = 68 au plus (plafond du plan), confirmé.** La part à ≥ 8,5 de ces 68 est **non calculable** tant que les conseils ne sont pas notés ; 68 est un plafond, pas un stock au niveau.

**Répartition par scénario.** Le fichier ne porte pas de champ « scénario » : classement fait par moi à partir du titre et du motif de chaque ligne, **indicatif** (l'exemple complet n'est lisible que pour les 7 étalons). Un conseil dont le titre ne désigne aucun lieu est « neutre ».

| Scénario | GARDER | REECRIRE | Total |
|---|---|---|---|
| Yanis : soirée | 1 | 0 | 1 |
| Yanis : coloc | 1 | 1 | 2 |
| Yanis : potes | 1 | 2 | 3 |
| Yanis : date | 1 | 2 | 3 |
| **Yanis, 4 scénarios du plan** | **4** | **5** | **9** |
| Yanis hors liste : cours, amphi | 1 | 2 | 3 |
| Sophie : bureau | 1 | 15 | 16 |
| Sophie : afterwork, networking | 2 | 0 | 2 |
| **Sophie** | **3** | **15** | **18** |
| Neutre (technique sans lieu) | 18 | 58 | 76 |
| **Total** | **26** | **80** | **106** |

Identifiants du classement (pour contrôle) :
- Yanis, date : `cmnyax22y0021s60w3ghcmlem` (R, Saint-Valentin), `cmmw0tr280011mw62kxywuwdl` (G), `cmmp8ozsx000mqk63ux155ma1` (R, Tinder). Coloc : `cmmw0tre50017mw62ht9h43r3` (G), `cmmp8ozsx000dqk63y7qi81vo` (R, déduit du « frigo »). Potes : `cmmp8ozsx0015qk63val4k3gm` (G), `cmnfak3lg0000s60x6zvwqbnh` (R), `cmmw0trk3001amw62akk6qqy9` (R). Soirée : `cmmp8ozsx001lqk63asu6cqdz` (G). Cours : `cmmw0tri40019mw626p0l8azw` (G), `cmq3bn5l6005js60xyozpk0wo` (R), `cmp3cfv7v00qps60y14xysiko` (R).
- Sophie, bureau : `cmmw0tr870014mw62jnung2qp` (G), `cmpjlc3xu008ns60xhh5v36nk`, `cmq0gw85z00nas60xc0gno2ka`, `cmp9uqejc00fas60x6ode1ptm`, `cmp9xye1000h3s60xxu6ticwr`, `cmotllu8e000is60wt7n95sc1`, `cmntkvcaw0088s60zadb5qw8j`, `cmmw0tqgc000rmw62q9wh2zui`, `cmqdc6vay00fws60xfij2s5af`, `cmmw0tqkc000smw62bo1yfeyg`, `cmnl5yc92000cs60zfctq4dm2`, `cmparyf6a00jrs60x3not8c3d`, `cmo3l6nir0003s60xj0o0n38z`, `cmorynj4s000rs60w3dxwnx8h`, `cmom5ird30001s60w411n32fn`, `cmmp8ozsx001fqk6301jruvzj` (R pour tous sauf le premier). Afterwork : `cmmw0trc60016mw629l4o8rav` (G), `cmmw0tra60015mw62l0360wm9` (G, networking).

**Comparaison aux minima du §3 du plan (38 conseils = au moins 24 Yanis + au moins 14 Sophie, donc aucune place pour le neutre)**

| Côté | Minimum | Disponible | Écart |
|---|---|---|---|
| Sophie (bureau, afterwork) | 14 | 18 | **tenu**, marge de 4 |
| Yanis (soirée, coloc, potes, date) | 24 | 9 (12 avec cours et amphi) | **manque 15** (12 avec les cours) |

Lecture : même en prenant tous les conseils Yanis, il en manque 12 à 15. Le plan comble ce manque par « la réécriture d'un REECRIRE à scénario Yanis, technique conservée, rien d'inventé » : or il n'y a que 5 REECRIRE à scénario Yanis (7 avec les cours). Le reste ne peut venir que de la **transposition d'une technique neutre dans un scénario Yanis** (58 REECRIRE neutres, 18 GARDER neutres disponibles), ce qui est un exemple neuf, pas une retouche. À trancher par Thomas ou @orchestrator : soit cette transposition (exemples neufs validés par 2 relecteurs), soit abaisser le minimum Yanis, soit produire des conseils neufs (§3 du plan, réserve épuisée). Réserve scénarisée après les 38 (hypothèse : 14 Sophie et 9 Yanis pris, plus 15 transposés) : il resterait 4 Sophie, 0 Yanis, et le neutre non transposé. `[À VÉRIFIER en base]` : le scénario réel de chaque exemple, car le classement ci-dessus repose sur les titres et motifs ; il peut sous-estimer Yanis et Sophie (le plan donnait 69 % de bureau sur le stock complet, ici 17 % des 106 retenables).

## 5. Lignes d'article, notes à l'aveugle (semaines 1 à 5)

Fichier : `docs/social/preparation/lignes-articles-notes.json` (**67 lignes**, 6 articles notés sur 8).

**Écart de format à connaître avant d'utiliser le JSON.** Il n'existe **aucune note chiffrée** (8,5, 9) pour les lignes d'article : les relecteurs A et B ont rendu un verdict binaire par ligne, « = » (égale l'étalon Alexa, donc au niveau) ou « < » (en dessous). `note1` (relecteur A) et `note2` (relecteur B) contiennent donc `"="` ou `"<"`, jamais un nombre, et `auNiveau` = les deux relecteurs à « = » (équivalent de « ≥ 8,5 chez les 2 » du plan). Un script qui compare `note1 >= 8.5` doit lire `auNiveau` à la place. Champs ajoutés (ignorables) : `date` de l'article, `cand` (identifiant du candidat et numéro de relecture à l'aveugle), `emplacement` quand `rang` est `null`. Les lignes retenues avec un seul « = » l'ont été par l'orchestrateur (2 avis sur 3) : elles sont dans l'article, mais **pas au niveau** au sens de la barre stricte.

**Sources par type** : jeudis (A1, A3, A4) = tableaux de départage `A1-departage.md`, `A1v2-departage.md`, `A3-departage.md`, `A3v2-departage.md`, `A4-departage.md`, `A4v2-departage.md` (colonnes A et B), numéros de ligne des articles `A1-message-anniversaire-drole.md`, `A3-premier-message-appli-rencontre.md`, `A4-blagues-de-couple.md` (en-tête « ids utilisés » pour A4, appariement texte à texte pour A1 et A3). Lundis (S2, S3, S5) = `articles-departage-orchestrateur.md` (lot articles 1), `articles-lot1-critique-A.md` et `-B.md`, `candidates-lot1-map.json`.

| Date | Article (slug) | Lignes notées | Au niveau (les 2 « = ») | Rangs au niveau |
|---|---|---|---|---|
| lun. 12/10 | `se-presenter-avec-humour` | 2 | 1 | intro (« Le quatrième vient de la dire ») |
| lun. 19/10 | `humour-en-colocation-desamorcer-tensions` | 2 | 2 | 1, FAQ 3 |
| jeu. 22/10 | `message-anniversaire-drole-par-situation` | 21 | **6** | 1, 3, 4, 9, 11, 18 |
| lun. 26/10 | `blagues-sur-l-ia-assistants-vocaux` | **non noté** | 0 | sans objet |
| jeu. 29/10 | `premier-message-drole-appli-de-rencontre` | 17 | **3** | 5, 11, 18 |
| lun. 02/11 | `humour-en-visio-reunion-en-ligne` | 2 | 1 | 1 |
| jeu. 05/11 | `blagues-de-couple-drole` | 23 | **5** | 5, 9, 17, 20, 29 |
| lun. 09/11 | `chambrer-sans-blesser-entre-potes` | **non noté** | 0 | sans objet |
| **Total** | | **67** | **18** | |

**Articles non notés (rien inventé)** : `blagues-sur-l-ia-assistants-vocaux` (26/10) : 6 vannes du catalogue recopiées, « aucune candidate neuve » (`S4-blagues-ia-assistants-vocaux.md` l.4), donc aucune ligne d'article à noter ; `chambrer-sans-blesser-entre-potes` (09/11) : 2 vannes du catalogue, 0 neuve, les 4 emplacements C1 à C4 sont « retirés, aucune variante au niveau » (`articles-departage-orchestrateur.md`, lot articles 2). Les vannes du catalogue (S2, S3, S5, A3, A4 et ces deux articles) ne sont pas comptées ici : elles relèvent du pool (§1).

**Points à retenir pour le tirage**
- Le relais Instagram du 22/10 prévu sur la **n°13** de l'article anniversaire (« celui qui fait un discours est dispensé de vaisselle », A « = », B « < ») n'est **pas au niveau** : elle est dans l'article, pas dans le stock strict. Au niveau dans le même article : les rangs 1, 3, 4, 9, 11, 18 (`[À VÉRIFIER @orchestrator]` si le relais doit changer de ligne, plan §2 l.37 compte les lignes notées au niveau).
- L'article couple `blagues-de-couple-drole` reprend deux vannes du pool : n°18 (`cs14jkee5c537f7286c1da98`, V097, réservée Noël) et n°28 (`cs14jk18882246f6446df2b7`, V033, publiée en semaine 0). Ce sont des lignes du catalogue, hors de ce fichier. Dans le dry-run (obsolète), les relais du 29/12 visent le n°17 (au niveau, LinkedIn) et le n°13 (A « < », B « = », pas au niveau, Instagram).
- **Réserve au niveau, non placée** : 4 lignes de `blagues-de-couple-drole` notées « = » chez les 2 mais mises en réserve (doublon de mécanisme) : H9-13, H2-8, H3-7, H9-12 (`A4v2-departage.md`, `A4-blagues-de-couple.md` l.6). Elles ne sont dans aucun article : utilisables en ligne de relais seulement si on les ajoute à l'article (le renvoi chiffré « Les N autres » doit rester vrai).
- `rang` vaut `null` pour 3 lignes de lundi qui ne sont pas des lignes numérotées de l'article : les 2 de S2 (introduction et FAQ) et la ligne FAQ 3 de S3. `rang` est le numéro de situation ou de ressort pour S3 (1) et S5 (1 et 4), le numéro **N.** imprimé pour les 3 jeudis (les rangs 12 de A3 et 2, 7, 12, 14, 18, 24, 28 de A4 sont des vannes du catalogue, donc absents).

## 6. Décryptages P0 (P0-072 et P0-041)

Fichier : `docs/social/preparation/p0-a-inserer.json` (2 entrées, format `{ ref, content, punchline, category, decryptage }`). Textes repris mot pour mot de `pilote-p0/candidates-2.md` (P0-072) et `candidates-1.md` (P0-041) ; versées au pool par `resultat-p0.md` (P0-072 au niveau ≥ 8,5 chez les 2, P0-041 égale Alexa au départage).

| ref | Catégorie | Amorce | Chute |
|---|---|---|---|
| P0-072 | ECOLE (étiquette « études » du candidat) | Je suis allé à la BU chercher les quatre ouvrages cités par l'IA pour mon devoir. | La bibliothécaire m'a dit qu'aucun n'existait, mais que les titres étaient plutôt bons. |
| P0-041 | PARENTS (étiquette « famille » du candidat) | Mon père m'a dit qu'il fallait que je « fasse mes preuves ». | J'ai sorti mon justificatif de domicile : c'est chez lui. |

Décryptages « Pourquoi ça fait rire » : 27 mots (P0-072) et 28 mots (P0-041), registre des cartes 3 de `complements-lot-s15.md` §1 (22 à 28 mots, plafond 30, aucun guillemet, aucun tiret cadratin), même ton que les fiches `audit-vannes-s14/decryptage-ecrit-*.json`. Note : `catalogue-vannes-valides.md` ne contient aucun décryptage (vannes seules, par catégorie) ; l'exemple de registre vient donc de ces deux sources.

`[À VÉRIFIER]` : les codes ECOLE et PARENTS sont ceux des titres du catalogue (13 catégories) ; confirmer qu'ils existent tels quels dans la base avant l'insertion. Les identifiants de base seront créés à l'insertion (`ref` P0-xxx n'est pas un `id`). Avant toute reprise de ces vannes en carte, la règle R6 impose les « » sur la vanne publiée.

## 7. Correctifs X du 12/10 et du 21/10

Décisions de @copywriter, sans option laissée ouverte. Clés de `social-lot-v5-fixes.ts` : `relais-x-12-10` et `X3`.

### 7.1 Relais X du lun. 12/10 12:30 (`relais-x-12-10`) : solution (a)

V053 (9 / 8) sort : sous la barre. Je reprends la seule ligne de l'article notée au niveau (`se-presenter-avec-humour`, « Tu avais une phrase géniale. Le quatrième vient de la dire. », les 2 relecteurs à « = »), avec la phrase qui la précède dans le même paragraphe, mot pour mot (`S2-se-presenter-avec-humour.md` l.32). Je n'ai pas pris (b) : le pool libre n'a aucune vanne de présentation, et le relais d'un article sur le tour de table doit montrer la scène de l'article.

Texte du post, exact (2e personne, donc sans guillemets, R6 ne s'applique pas) :

> Le tour de table commence à gauche et tu comptes les places : tu es sixième. Tu avais une phrase géniale. Le quatrième vient de la dire.

Renvoi exact, suivi du lien `/blog/se-presenter-avec-humour` (contenu `lundi`) :

> La méthode pour trouver ta phrase, et 5 exemples avant/après :

Pourquoi ce renvoi : la ligne n'est pas un des « 4 autres exemples » (elle est dans l'introduction). L'article promet bien « une méthode pour trouver ton propre détail » et « 5 exemples avant/après » (l.34). Longueur : environ 136 + 62 caractères, plus le lien (23), soit environ 224, sous 270. Note de ligne à écrire dans `note` : « ligne d'introduction de l'article, au niveau (2 « = »), remplace V053 (9 / 8) ». V053 retourne au stock non notée au niveau : ne pas la remettre dans `POOL_STRICT`. L'ancienne note « accroche 2 de l'article (catalogue) » est à supprimer.

### 7.2 X3 du mer. 21/10 (`X3`) : renvoi raccourci de 19 caractères

La vanne (V014) et la formule signée « lequel des 5 profils d'humour est le tien » restent intactes. Renvoi exact, suivi du lien `/quiz-humour` (contenu `quiz`) :

> Humour d'Observateur. Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 min, sans inscription :

Coupes : « Ça, c'est de l'humour d'Observateur. » devient « Humour d'Observateur. » (15 caractères) et « Environ 2 minutes » devient « Environ 2 min » (4). Total de 283 à 264 caractères comptés par X, soit 6 sous la limite de 270 ; le pont vers les profils et la promesse « sans inscription » sont gardés. `[À VÉRIFIER]` au dry-run : le décompte réel du script (le chiffre de 283 vient du décompte X rapporté, pas recalculé ici).

## Points `[À VÉRIFIER]` (synthèse)

1. §1 : le pool strict contient 3 exemptées (V014, V019, V025) et les 4 de Noël ; stock réel au 12/10 = 23 (25 avec P0), pas 30 (32), et 21 une fois V028 et V060 retirées (`RESERVEES_CARROUSEL`, `social-lot-v5-fixes.ts:151-154` ; V083 n'est pas réservée : tirée le 13/10 par le lot 1a) (§2). Corriger plan §1 l.37 et §2.
2. §2 : les 12 fiches Q1 n'ont pas de vannes désignées ; recoupement fait sur les 8 carrousels de `complements-lot-s15.md` §1. Retirer V028 et V060 du tirage (`RESERVEES_CARROUSEL`, `social-lot-v5-fixes.ts:151-154` ; V083 n'est pas réservée : tirée le 13/10 par le lot 1a). Numéro du costume : V150 (plan) ou V087 (`social-pool.ts`).
3. §3 : catégorie BOULOT non lisible dans `social-pool.ts` ni `stock-vannes-resultat-s15.md` : `[À VÉRIFIER en base]` ; indicatif d'après le catalogue du 01/10 : 5 dans le pool, 0 disponible au 12/10.
4. §4 : aucune note chiffrée dans `audit-conseils-s14.md` ; scénarios classés par titre et motif ; Yanis 9 (12) contre minimum 24.
5. §5 : verdicts « = » / « < » et non notes chiffrées ; S4 et S6 non notés ; relais IG du 22/10 sur la n°13 (pas au niveau).
6. §6 : codes ECOLE et PARENTS à confirmer dans la base avant insertion.
