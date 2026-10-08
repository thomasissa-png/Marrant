# Lot 1b (19/10 au 15/11/2026) : dry-run du 08/10 après versement des textes tranchés à l'aveugle

> @fullstack, 08/10/2026. Sources : `aveugle-1b-formats-resultat.md` (tours 1 et 2), `aveugle-1b-linkedin-resultat.md`, textes par numéro dans `aveugle-1b-formats.md`, `aveugle-1b-formats-t2.md`, `aveugle-1b-linkedin.md`, créneaux et vannes dans les 3 clés. **Rien n'a été inséré en base, rien n'a été déployé** (ni `deploy:cf`, ni `--insert`, ni `--rollback --confirmer`). Lectures Neon en SELECT seulement, sorties dans `/tmp/fs-1b/`, hors dépôt.

## Révision 3 (08/10, fin de session) : relais LinkedIn validés avant les vannes hors thème bureau

> Décision de la session : la variante mesurée en révision 2 est appliquée. Justification : `mix-formats-s15.md` §2 (LinkedIn : « relais, sinon vanne ») et `plan-execution-s15.md` §2 (« LinkedIn tire d'abord les vannes de thème bureau »). Mêmes commandes, sorties dans `/tmp/fs-1b-v3/`. Remplace la « Décision à prendre (non codée) » de la révision 2.

**Code** (`social-lot-v5.ts`, `relaisLinkedInValide`) : sur une case LinkedIn, un relais validé dont le `creneau` est ce jour passe AVANT toute vanne qui n'est pas de thème bureau. Une vanne de thème bureau (`BOULOT`) au niveau et libre (mêmes règles que le tirage, sans pénurie) garde la priorité : elle prend la case, le relais est rendu au repli avec un avertissement (« plan §2 : une vanne de thème bureau passe avant le relais »). Le relais posé compte dans le relais LinkedIn de la semaine. Tests +2 : relais avant une vanne hors bureau (la vanne n'est pas consommée) ; vanne bureau libre prioritaire (relais rendu).

**Résultat 1b** : **46 posts (X 19, IG 19, LinkedIn 8), 0 erreur de mix, 5 erreurs**, toutes de légende de relais IG (« légende sans « À envoyer à » en tête ») : 19/10, 29/10, 05/11, 09/11, 12/11. Chiffres identiques à la mesure de la révision 2.
- LinkedIn : **R08 jeu. 05/11, R07 mar. 10/11, R02 jeu. 12/11** sur leur case. Aucune vanne de thème bureau libre ces jours-là. Les autres cases LinkedIn : vannes les 20/10, 22/10 (li-22-10), 27/10 ; L2 le 29/10 ; relais d'article (visio) le 03/11. La semaine du 02/11 compte donc 2 relais LinkedIn (03/11 et 05/11), comme en révision 1.
- 12/11 X et IG : relais vœux servis par une vanne du thème (plus d'erreur « sans texte »).
- **Conseils** : 10, ven. 23/10, mar. 03/11, ven. 06/11, mar. 10/11, ven. 13/11 (X et IG). **Aucun le lundi, le jeudi ni sur LinkedIn** (vérifié sur le calendrier du dry-run).

| Relais IG | Vanne tirée | Renvoi | Max « À envoyer à... » |
|---|---|---|---|
| lun. 19/10 | `cs14jkd9058d03e24961004a` (concert filmé) | Les autres exemples : lien en bio. | 45 |
| jeu. 29/10 | `cs14jk29357d022f6880a69e` (Instagram remonté, bouc) | Les autres exemples : lien en bio. | 45 |
| jeu. 05/11 | `cs14jkbc3334e2de46753dcf` (théâtre, « c'est puissant ») | Les 30 vannes : lien en bio. | 51 |
| lun. 09/11 | `cs14jk4f97079b992f85eeb1` (l'ex et sa liste) | Les autres exemples : lien en bio. | 45 |
| jeu. 12/11 | `cp0465e601e49c114994d1a00` (« fais tes preuves ») | Les 27 messages : lien en bio. | 49 |

Commande pour @copywriter, avec textes des vannes et contraintes : **`lot-1b-legendes-a-commander.md`**. Les ids sont à relire après l'insertion du 1a (09/10) : le tirage peut encore changer.

**Lot 1a** : JSON identique à l'octet (sha256 `63a2f315aed1c0d5…`, comparé par `cmp` à la sortie de la révision 2), Markdown identique, sortie console identique hors chemin.

**Contrôles** : `npx tsc --noEmit -p tsconfig.build.json`, `npm run lint` (0 erreur, 1 avertissement `<img>` existant dans `admin/page.tsx`), `npm run build` : OK. `npx jest` : 267 suites, 3 854 tests passés (2 ignorés, déjà ignorés avant).

## Révision 2 (08/10, plus tard) : cases de conseil nominales et technique dans la carte 1

> Décision de la session, d'après `plan-execution-s15.md` §3 : les conseils ont des **cases nominales** (le vendredi avant le 03/11, avec 2 conseils le ven. 23/10 sur X et IG ; mardi et vendredi à partir du 03/11 ; X et IG), où le conseil passe AVANT la vanne. Jamais le lundi, jamais le jeudi, jamais sur LinkedIn. Mêmes commandes qu'en version 1, sorties dans `/tmp/fs-1b-v2/`. La version 1 ci-dessous (« Conflit du 03/11 ») est **remplacée** pour les conseils.

**Code** : `caseConseilNominale`, `conseilPermis`, `carteAvecSurtitre` (`social-lot-v5-mix.ts`) ; dans `social-lot-v5.ts`, une case nominale est servie par son conseil avant tout tirage ; le repli du mix ne propose plus de conseil le lundi ni le jeudi ; un conseil dont le créneau tombe hors case nominale est refusé à la lecture du fichier. Exceptions du plan §3 (30/10, 27/11, 25/12, 01/01) codées.

**Résultat 1b** : 44 posts (X 18, IG 18, LinkedIn 8), **6 erreurs** et non 3 comme attendu :
- K36 et K26 au ven. 23/10 (X, IG), K28 et K30 au mar. 03/11 (X, IG) : **conforme**. K09/K22 06/11, K04/K07 10/11, K25/K27 13/11 inchangés. Aucun conseil un lundi ou un jeudi.
- **4 erreurs de légende de relais IG** (et non 3) : la cascade du tirage change les vannes des relais.

| Relais IG | Vanne tirée | Texte (cartes 1 et 2) |
|---|---|---|
| lun. 19/10 | `cs14jkd9058d03e24961004a` (inchangée) | « Un mec a filmé tout le concert devant moi, téléphone en l'air. J'ai suivi le concert sur son écran. » / « À la fin, il m'a demandé si c'était bien. » |
| jeu. 29/10 | `cs14jk29357d022f6880a69e` (était `cs14jka7e683e43af915bb60`) | « Pendant que j'étais aux toilettes, mon date a remonté tout mon Instagram. » / « Elle m'a demandé pourquoi j'avais eu un bouc. » |
| jeu. 05/11 | `cs14jkbc3334e2de46753dcf` (était `cp0465e601e49c114994d1a00`) | « Au théâtre, l'acteur s'est arrêté au milieu d'une phrase. Silence de deux minutes. » / « Le monsieur devant moi a dit « c'est puissant ». » |
| lun. 09/11 (nouveau) | `cp05d2c3950800b7575c12ce6` | « Je suis allé à la BU chercher les quatre ouvrages cités par l'IA pour mon devoir. » / « La bibliothécaire m'a dit qu'aucun n'existait, mais que les titres étaient plutôt bons. » |

- **2 erreurs nouvelles : jeu. 12/11, X et IG** (relais vœux sans ligne au niveau). Avant, K28 et K30 y étaient rendus ; le jeudi n'admet plus de conseil, et il ne reste ni vanne ni ligne d'article notée. **À commander** : 2 lignes notées de `voeux-drole-nouvelle-annee` (X et IG), ou une décision.

**Pourquoi la cascade** : les 4 vannes libérées (23/10 et 03/11) sont tirées dès le 27/10 (ordre du pool), puis LinkedIn en prend 2 (mix §2, affectation n°1 : LinkedIn d'abord) : `cs14jk55b4243d4d1c132b97` (L13) au jeu. 05/11 et `cp0465e601e49c114994d1a00` au mar. 10/11. **R08 (05/11) et R07 (10/11) sont alors rendus et ne servent aucune case** (aucune case LinkedIn libre après eux). La vanne TGV `cs14jk76ca7ad32cce9041ce` passe au relais X du 05/11 (L12 reste attachée à la vanne, non utilisée sur X). L13 n'est pas servie (vanne sur LinkedIn). 04/11 IG : tondeuse `cs14jkd11f7913f8177df395`, légende existante « À envoyer à celui qui adore les gadgets. ».

**Décision à prendre (non codée)** : le tableau du mix §2 met au mardi LinkedIn « relais à angle travail, sinon vanne de bureau », et les vannes prises par LinkedIn ne sont pas de thème bureau. Mesure faite, sans la garder : si R08 et R07 tiennent leur créneau avant la vanne, le 1b compte **46 posts, 0 erreur de mix et 5 erreurs de légende de relais IG** (19/10, 29/10, 05/11, 09/11, 12/11). Je n'ai pas codé cette variante : la consigne limite la priorité aux cases de conseil.

**Technique dans la carte 1** : le gabarit du Worker n'affiche pas de surtitre (déploiement gelé). Le script met donc la technique en tête de la carte 1 (« La manie en métier : À la pause café… »), comme sur X. Le champ `surtitre` du fichier reste inchangé, et les cartes ne sont pas réécrites dans le JSON.

**Rendu vérifié en local** (`scripts/content/social-conseil-rendu.ts`, `generatePostImage` puis analyse des pixels hors zone) :

| Conseil IG | Carte 1 avec la technique | Carte 2 |
|---|---|---|
| 23/10 K26, Consoler en exagérant | tient | **DÉBORDE** (haut et bas, coupée) |
| 03/11 K30, La manie en métier | tient | tient |
| 06/11 K22, La fausse naïveté | tient | **DÉBORDE** (haut et bas) |
| 10/11 K07, Le carnet d'absurdités | tient | **DÉBORDE** (lignes trop larges, mots qui se chevauchent) |
| 13/11 K27, L'anecdote qui déraille | **DÉBORDE** (déborde déjà sans la technique : 75 rangées hors marge, 78 avec) | **DÉBORDE** |

Aucun mot coupé. **5 cartes sur 10 débordent, dont 4 sans lien avec la technique** : le gabarit des vannes (chute en corps 100) n'est pas fait pour des cartes de conseil de 30 mots. Autre défaut du gabarit : la carte 1 des 06/11 et 10/11 s'affiche entre « » lilas, car une 1re personne dans la carte 2 en fait une « vanne citée » (R6). **Bloquant avant l'insertion du 1b** : il faut un gabarit conseil (@design, puis déploiement à lever par la garde) ou des cartes raccourcies (@copywriter, relecture à l'aveugle). PNG de contrôle : `docs/social/visuels-s15/controle-conseil-ig-06-11-fausse-naivete-carte1.png`.

**Lot 1a** : JSON identique à l'octet (sha256 `63a2f315aed1c0d5…` avant et après), Markdown identique, sortie console identique hors chemin.

**Contrôles** : `npx tsc --noEmit -p tsconfig.build.json`, `npm run lint` (0 erreur), `npm run build` : OK. `npx jest` : 267 suites, 3 852 tests passés (2 ignorés, déjà ignorés avant).

## Commande

```bash
cd apps/web
npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict \
  --debut 2026-10-19 --fin 2026-11-15 --out /tmp/fs-1b/1b-new.md --json /tmp/fs-1b/1b-new.json
```

Sortie : catalogue 127 vannes GARDER, pool 42, stock éligible 22, 10 articles ; **46 posts (X 19, Instagram 19, LinkedIn 8), 3 erreurs**, 42 avertissements (JSON non écrit : erreurs bloquantes). Avant versement (même commande, `1b-ref`) : 33 posts, 18 erreurs.

## Ce qui a été versé

- **`textes-formats-valides.json`** : 13 entrées, extraites par script des fichiers d'aveugle (28 segments retrouvés mot pour mot : textes X, cartes, légendes, surtitres, relais). 10 conseils (`id` = id du conseil dans le stock, comme le demande la clé), 3 relais LinkedIn (`relais-linkedin-<date>`, `angleTravail: true`), notes des 2 relecteurs, `persona` repris de la clé.
- **Deux champs ajoutés au format** (`social-lot-v5-mix.ts`) : `creneau` (le texte sert d'abord sa case ; une vanne au niveau la garde, le texte est alors rendu au repli avec un avertissement ; créneau après la fin du lot = jamais pris) et `surtitre` (technique nommée de la carte 1 des conseils Instagram, 4 mots au plus). Sans `creneau`, le script prenait le 1er texte du fichier : R08 serait parti le 10/11 au lieu du 05/11.
- **Barres** : conseil 8 chez les 2 (déjà le cas, plan §3) ; relais LinkedIn relevé de 8 à **8,5** chez les 2 (`aveugle-1b-linkedin-resultat.md`). Tests ajoutés.
- **Légendes** (`social-lot-v5-legendes.ts`) : **L12** (vanne `cs14jk76ca7ad32cce9041ce`, TGV, 03/11) et **L13** (`cs14jk55b4243d4d1c132b97`, téléphone face contre la table, 04/11) : vannes du dry-run conformes à la clé, versées. L07, L16, L15 : non versées (voir Erreurs).

## Conflit du 03/11 Instagram (et trois cas identiques) : version 1, remplacée par la révision 2 ci-dessus

`mix-formats-s15.md` §2 : une vanne au niveau passe avant le conseil (affectation n°4 : X et Instagram du mardi). Donc :
- **la vanne `cs14jk76ca7ad32cce9041ce` garde le 03/11 Instagram, avec la légende L12** (la légende suit la vanne) ;
- **K30 est rendu au repli** et sert la case libre suivante d'Instagram : **jeu. 12/11** (relais vœux sans ligne au niveau).

Le dry-run montre le même conflit sur 3 autres créneaux, traités par la même règle :
- **03/11 X** : vanne `cs14jk7911857c4ff09eb025` (homonyme, tir à l'arc) ; **K28 passe au jeu. 12/11 X** ;
- **ven. 23/10 X et Instagram** : vannes `cmmnsqn15006kth63res9rqp9` et `cmmnsqn120000th63o435xsb0` ; **K36 et K26 passent au lun. 09/11** (relais chambrer sans ligne au niveau).

**Décision à prendre (orchestrateur ou @social)** : `plan-execution-s15.md` §3 fait du vendredi 23/10 un créneau de conseil nominal (« les 6 créneaux conseil de 1b, vendredis 23/10, 06/11 et 13/11 »), mais le générateur traite le vendredi comme une case de vanne (`GRILLE_V5`) : le « vendredi = conseil » n'est pas codé, je ne l'ai pas codé. À noter : `cmmnsqn120000th63o435xsb0` est la vanne IG du 16/10 du lot 1a ; une fois le 1a en base (09/10), le 1b régénéré ne la tirera plus.

## Tableau des posts (46)

| Date | Réseau | Type | Vanne ou texte | Mesure | Erreur |
|---|---|---|---|---|---|
| 19/10 | X | RELAIS | `cs14jka3336e7e90a453a9d6` | 191 car. X |  |
| 19/10 | IG | RELAIS | `cs14jkd9058d03e24961004a` | légende 34 | **légende manquante** |
| 20/10 | X | VANNE | `cmni62ad30005s60yc7qnog31` | 133 car. X |  |
| 20/10 | IG | VANNE | `cmnz0jqsx000rs60xrbrqm8kk` | légende 40 |  |
| 20/10 | LI | VANNE | `cs14jk9a9e7a1b8e0e16264e` | 1re ligne 65 |  |
| 21/10 | X | VANNE_QUIZ | `cs14jk50c85bb0d73deaebaf` | 246 car. X |  |
| 21/10 | IG | VANNE | `cmmnsqn130033th63b54ux45o` | légende 74 |  |
| 22/10 | X | RELAIS | `cs14jk0e4fedaac1a91fddf1` | 184 car. X |  |
| 22/10 | IG | RELAIS | `message-anniversaire-drole-par-situation#13` | légende 72 |  |
| 22/10 | LI | VANNE | `cs14jk69eb578cce484b6f87` | 1re ligne 67 |  |
| 23/10 | X | VANNE | `cmmnsqn15006kth63res9rqp9` | 139 car. X |  |
| 23/10 | IG | VANNE | `cmmnsqn120000th63o435xsb0` | légende 59 |  |
| 26/10 | X | RELAIS | `cs14jkf0a20e0837fa95c784` | 205 car. X |  |
| 26/10 | IG | RELAIS | `cs14jke6736001250d3a940d` | légende 75 |  |
| 27/10 | X | VANNE | `cmmnsqn130038th63fxn1wvhn` | 132 car. X |  |
| 27/10 | IG | VANNE | `cs14jke5d015b07714055538` | légende 32 |  |
| 27/10 | LI | VANNE | `cs14jke10b58d158ae638560` | 1re ligne 69 |  |
| 28/10 | X | VANNE_QUIZ | `cs14jk29357d022f6880a69e` | 242 car. X |  |
| 28/10 | IG | VANNE | `cs14jk90226d6abb90287724` | légende 37 |  |
| 29/10 | X | RELAIS | `cs14jkb9ba433a0746280280` | 181 car. X |  |
| 29/10 | IG | RELAIS | `cs14jka7e683e43af915bb60` | légende 34 | **légende manquante** |
| 29/10 | LI | SITUATION | `L2` (validé Thomas) | 1re ligne 221 |  |
| 30/10 | X | PIVOT | `blagues-halloween-soiree-deguisee#3` | 154 car. X |  |
| 30/10 | IG | VANNE | `cs14jk1bc86d3502a2cef27b` | légende 72 |  |
| 02/11 | X | RELAIS | `cs14jk177b62432b07f5d17a` | 178 car. X |  |
| 02/11 | IG | RELAIS | `cs14jkd11f7913f8177df395` | légende 75 |  |
| 03/11 | X | VANNE | `cs14jk7911857c4ff09eb025` | 151 car. X |  |
| 03/11 | IG | VANNE | `cs14jk76ca7ad32cce9041ce` + L12 | légende 59 |  |
| 03/11 | LI | RELAIS | `cp05d2c3950800b7575c12ce6` | 1re ligne 85 |  |
| 04/11 | X | VANNE_QUIZ | `cs14jkbc3334e2de46753dcf` | 252 car. X |  |
| 04/11 | IG | VANNE | `cs14jk55b4243d4d1c132b97` + L13 | légende 67 |  |
| 05/11 | X | RELAIS | `cs14jk4f97079b992f85eeb1` | 215 car. X |  |
| 05/11 | IG | RELAIS | `cp0465e601e49c114994d1a00` | légende 28 | **légende manquante** |
| 05/11 | LI | RELAIS | **R08** (couple) | 1re ligne 82 |  |
| 06/11 | X | CONSEIL | **K09** | 257 car. X |  |
| 06/11 | IG | CONSEIL | **K22** | légende 66 |  |
| 09/11 | X | CONSEIL | **K36** (prévu 23/10, rendu) | 171 car. X |  |
| 09/11 | IG | CONSEIL | **K26** (prévu 23/10, rendu) | légende 56 |  |
| 10/11 | X | CONSEIL | **K04** | 260 car. X |  |
| 10/11 | IG | CONSEIL | **K07** | légende 56 |  |
| 10/11 | LI | RELAIS | **R07** (chambrer) | 1re ligne 114 |  |
| 12/11 | X | CONSEIL | **K28** (prévu 03/11, rendu) | 206 car. X |  |
| 12/11 | IG | CONSEIL | **K30** (prévu 03/11, rendu) | légende 57 |  |
| 12/11 | LI | RELAIS | **R02** (vœux) | 1re ligne 97 |  |
| 13/11 | X | CONSEIL | **K25** | 191 car. X |  |
| 13/11 | IG | CONSEIL | **K27** | légende 53 |  |

Mesure IG = longueur du texte de légende (renvoi « lien en bio » compris pour les relais). 11/11 : silence. Semaine du 09/11 : 8 conseils, le plafond.

## Longueurs X (script, `longueurX`, liens à 23)

19 posts X : de 132 à 260 caractères, **aucun au-delà de 270** (le plus long : K04, 260 ; puis K09, 257). Les 5 conseils X : 171 à 260. Mesure : `buildLotV5` sur les mêmes entrées que le dry-run, puis `longueurX(content)` de chaque post X (`/tmp/fs-1b/1b-mesures.json`).

## Erreurs (3), toutes de légende de relais Instagram

| Relais IG | Vanne de la clé (légende retenue) | Vanne du dry-run | Pourquoi rien n'est forcé |
|---|---|---|---|
| lun. 19/10 | `cs14jkb03209d55cbfc17448`, voisin et dessert (L07, 9 / 8,5) | `cs14jkd9058d03e24961004a`, concert filmé | autre vanne : L07 ne lui correspond pas |
| jeu. 29/10 | `cs14jkd11f7913f8177df395`, tondeuse robot (L16, 9 / 9) | `cs14jka7e683e43af915bb60`, fauteuil de la déchetterie | autre vanne ; la tondeuse est tirée le 02/11 (relais IG, légende « celui qui adore les gadgets ») |
| jeu. 05/11 | `cs14jkfec1cb933d1931e868`, pulls assortis (L15, 8,5 / 9) | `cp0465e601e49c114994d1a00`, « fais tes preuves » | autre vanne |

Les ids de la clé correspondent bien aux textes du catalogue (vérifié en base) ; c'est le tirage qui a changé depuis `lot-relance-s15.md`. **Second obstacle, même si les vannes revenaient** : sur un relais, la légende inclut le renvoi dans ses 80 caractères (`ecartsLegende`, R3). L07 + « Les autres exemples : lien en bio. » = 107, L16 = 108, L15 + « Les 30 vannes : lien en bio. » = 89. Pour tenir, la partie « À envoyer à... » d'un relais fait 45 caractères au plus (renvoi « Les autres exemples ») ou 51 (« Les 30 vannes »). **À commander à @copywriter** : 3 légendes de relais pour les vannes du dry-run régénéré après le 1a, dans ces longueurs, puis relecture à l'aveugle.

## Avertissements à lire

- 4 textes rendus au repli (conflits ci-dessus), un avertissement chacun.
- **Surtitre des conseils Instagram non rendu en image** : le gabarit lit 2 `threadParts` comme une vanne (amorce, chute). Le surtitre est dans le JSON et dans la note du post, pas sur la carte. Plan §3 : « sans elle, un conseil de 2 phrases n'est qu'une mini-vanne ». À traiter avant l'insertion du 1b (@design pour la carte, @fullstack pour le rendu).
- Cartes de conseil : le plafond de 35 mots par carte n'est pas contrôlé par le script (les cartes de conseil sont exemptées du plafond de 25 des cartes vanne). Comptage de la clé : 17 à 34 mots.
- Inchangés par rapport au dry-run de référence : relais « aucun repli libre », tournures de légende répétées, « copain » 3 fois la semaine du 19/10, garde « lien en bio ».

## Lot 1a inchangé (preuve)

Même commande sur le 12/10 au 18/10, avant (`1a-ref`) et après le versement (`1a-new`) : JSON identique à l'octet (sha256 `63a2f315aed1c0d5…` des deux côtés), Markdown identique, sortie console identique hors chemin. 12 posts, 0 erreur. Un test garde aussi ce point (`lot 1a inchangé`, données simulées).

Dans le 1b, les 33 posts déjà posés avant le versement sont identiques, sauf la légende ajoutée des 03/11 et 04/11 IG ; les 13 nouveaux sont les textes du mix.

## Contrôles

`npx tsc --noEmit -p tsconfig.build.json`, `npm run lint` (0 erreur), `npm run build` : OK. `npx jest` : 267 suites, 3 847 tests passés (2 ignorés, déjà ignorés avant).

## Verdict

**Pas encore à 0 erreur : 3 erreurs, toutes des légendes de relais Instagram** (vannes tirées différentes de la clé, et longueurs avec le renvoi). Les 13 cases du mix sont servies (10 conseils, 3 relais LinkedIn), contre 13 erreurs avant. Le 1b sera régénéré après l'insertion du 1a (09/10) : les vannes des relais changeront sans doute encore. Il faut donc relire les ids **à ce moment-là**, puis commander les 3 légendes courtes.
