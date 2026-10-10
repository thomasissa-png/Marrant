# Lot 1b (19/10 au 15/11/2026) : dry-run du 08/10 après versement des textes tranchés à l'aveugle

> @fullstack, 08/10/2026. Sources : `aveugle-1b-formats-resultat.md` (tours 1 et 2), `aveugle-1b-linkedin-resultat.md`, textes par numéro dans `aveugle-1b-formats.md`, `aveugle-1b-formats-t2.md`, `aveugle-1b-linkedin.md`, créneaux et vannes dans les 3 clés. **Rien n'a été inséré en base, rien n'a été déployé** (ni `deploy:cf`, ni `--insert`, ni `--rollback --confirmer`). Lectures Neon en SELECT seulement, sorties dans `/tmp/fs-1b/`, hors dépôt.

## Révision 6 (10/10, légendes des relais du 19/10 et du 05/11 versées) : prêt pour l'insertion

> @fullstack, 10/10/2026. Rien d'inséré, rien de déployé (ni `--insert`, ni `--rollback --confirmer`, ni `deploy:cf`). Lectures Neon en SELECT seulement. Commande (depuis `apps/web`) : `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict --debut 2026-10-19 --fin 2026-11-15 --out ../../docs/social/preparation/lot-1b.md --json ../../docs/social/preparation/lot-1b.json`. Fichiers du 1a (`lot-relance-s15.{md,json}`, inséré) non touchés.

**Versé** (`social-lot-v5-legendes.ts`, mot pour mot depuis `aveugle-1b-repli-resultat.md`, dernière section) :
- relais IG lun. 19/10, vanne du concert `cs14jkd9058d03e24961004a` : L38 « À envoyer à la sœur qui a « vu » Beyoncé. » (41 caractères ; 76 avec le renvoi) ;
- relais IG jeu. 05/11, vanne « fais tes preuves » `cp0465e601e49c114994d1a00` : L31 « À envoyer à celui qui a un CDI mais pas de bail. » (48 caractères ; 77 avec le renvoi).

Aucune autre modification de code : le tirage est celui de la révision 5 (mêmes 46 cases, mêmes sources), seules les 2 légendes manquantes sont désormais servies.

### Résultat : 46 posts (X 19, IG 19, LinkedIn 8), **0 erreur**, JSON écrit

- `docs/social/preparation/lot-1b.md` (relecture) et `docs/social/preparation/lot-1b.json` (les 46 lignes que `--insert` lira ; sha256 `eb1f00d60ae92646…`, 0 repli en réserve).
- **`--insert` accepte ce JSON** : `--insert` relit le fichier de `--json` (sinon `lot-<id>.json`, donc `lot-relance-s15.json` : à ne pas utiliser pour le 1b), vérifie `lot` = `relance-s15`, régénère le lot de la même commande et refuse au moindre écart (`ecartsFichierLot` : lot, approvedBy, bornes, graine, total, chaque ligne). Contrôle rejoué à l'identique : 2e dry-run de la même commande vers le scratchpad, JSON identique à l'octet (`cmp`), `ecartsFichierLot(régénéré, lot-1b.json)` = **0 écart**. Garde-fous de l'insertion, rejoués en SELECT sur la tranche 18/10 22:00 UTC au 15/11 23:00 UTC : « thomas-s15 » déjà présent **0**, ids du lot déjà en base **0**, autres posts actifs (PENDING, APPROVED, PUBLISHED) sur les 3 réseaux **0**.
- **Lot 1a inchangé** : même commande sur le 12/10 au 18/10, JSON identique à l'octet à `lot-relance-s15.json` (sha256 `63a2f315aed1c0d5…`, 12 posts, 2 replis).

### Mesures (script en lecture seule : `longueurX` de `src/lib/social/longueur-x.ts`, fuseau `Europe/Paris` par `Intl`)

| Mesure | Résultat |
|---|---|
| `longueurX` des 19 X | 105 à 260, **0 au-dessus de 270** |
| Légendes IG (19), renvoi compris | 25 à 80 caractères, **0 au-dessus de 80**, 0 sans « À envoyer à / au / aux » |
| Conseils par semaine (plafond 8, `PLAFONDS_MIX`) | 19/10 : 2 ; 26/10 : 0 ; 02/11 : 4 ; 09/11 : **8** (au plafond, 4 nominaux et 4 de repli) |
| Dimanches | **0** |
| Heures | 46 sur 46 dans les créneaux de Paris (08:15, 09:00, 12:30, 19:30) ; UTC = Paris moins 2 h jusqu'au 23/10, moins 1 h à partir du 26/10 (heure d'hiver le dim. 25/10) : **0 écart** |
| Reprises à moins de 90 jours | **0** : aucun `sourceId` ni texte (60 premiers caractères normalisés) commun avec la semaine 0 (`lot-semaine0.json`, 10), le 1a (`lot-relance-s15.json`, 12) et les 24 posts actifs en base des 90 jours avant le 19/10 |

### Tableau des 46 posts

| # | Jour | Paris | UTC | Réseau | Type (origine) | Source | Début du texte (X, LI) ou carte 1 (IG) | Mesure |
|---|---|---|---|---|---|---|---|---|
| 1 | lun. 19/10 | 12:30 | 10:30 | X | RELAIS (TIRAGE) | `humour-en-colocation-desamorcer-tensions#1` | « J'ai dit “je la fais tout à l'heure” à la poêle. » | X 176 |
| 2 | lun. 19/10 | 19:30 | 17:30 | IG | RELAIS (TIRAGE) | `cs14jkd9058d03e24961004a` | Un mec a filmé tout le concert devant moi, téléphone en l'air. J'ai su… | légende 76 |
| 3 | mar. 20/10 | 09:00 | 07:00 | X | VANNE (TIRAGE) | `cs14jke10b58d158ae638560` | « Mon copain m'a rendu le chargeur qu'il m'avait pris il y a un an. » | X 105 |
| 4 | mar. 20/10 | 12:30 | 10:30 | IG | VANNE (TIRAGE) | `cs14jk29357d022f6880a69e` | Pendant que j'étais aux toilettes, mon date a remonté tout mon Instagr… | légende 68 |
| 5 | mar. 20/10 | 08:15 | 06:15 | LI | VANNE (TIRAGE) | `cs14jk90226d6abb90287724` | « Ma mère me demande encore des nouvelles de mon ex. » | LI 84 |
| 6 | mer. 21/10 | 12:30 | 10:30 | X | VANNE_QUIZ (VALIDE X3) | `cs14jk50c85bb0d73deaebaf` | « Dans le train, la place à côté de moi était réservée. Personne n'est… | X 246 |
| 7 | mer. 21/10 | 19:30 | 17:30 | IG | VANNE (V5 IG-21-10) | `cmmnsqn130033th63b54ux45o` | Mon père a vu mon appart. Il a dit « c'est pas mal ». | légende 74 |
| 8 | jeu. 22/10 | 09:00 | 07:00 | X | RELAIS (VALIDE X2) | `cs14jk0e4fedaac1a91fddf1` | « Mes parents m'ont dit qu'ils étaient fiers de moi. J'ai demandé pour… | X 184 |
| 9 | jeu. 22/10 | 12:30 | 10:30 | IG | RELAIS (V5 relais-ig-22-10) | `message-anniversaire-drole-par-situation#13` | On m'a dit que celui qui fait un discours est dispensé de vaisselle. | légende 72 |
| 10 | jeu. 22/10 | 08:15 | 06:15 | LI | VANNE (V5 li-22-10) | `cs14jk69eb578cce484b6f87` | « Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un. » | LI 140 |
| 11 | ven. 23/10 | 12:30 | 10:30 | X | CONSEIL (MIX) | `cmptbp7nv002bs60xscu5ixmx` | Trois coups d'avance : ton pote voit ta note. « 8/20 en maths, aïe. » … | X 171 |
| 12 | ven. 23/10 | 19:30 | 17:30 | IG | CONSEIL (MIX) | `cmny1tkhw000rs60wsolieluq` | Consoler en exagérant | légende 56 |
| 13 | lun. 26/10 | 12:30 | 11:30 | X | RELAIS (V5 relais-x-26-10) | `cs14jkf0a20e0837fa95c784` | « J'ai demandé à une IA si mon message “tu viens ce soir ?” n'était pa… | X 205 |
| 14 | lun. 26/10 | 19:30 | 18:30 | IG | RELAIS (V5 relais-ig-26-10) | `cs14jke6736001250d3a940d` | J'ai demandé à l'IA un avis honnête sur mon manuscrit. Elle a répondu … | légende 75 |
| 15 | mar. 27/10 | 12:30 | 11:30 | X | VANNE (TIRAGE) | `cs14jka7e683e43af915bb60` | « Quelqu'un a récupéré le fauteuil que je venais de jeter à la déchett… | X 150 |
| 16 | mar. 27/10 | 19:30 | 18:30 | IG | VANNE (VALIDE IG1) | `cs14jke5d015b07714055538` | Mon tuteur a lu mon rapport de stage. Il m'a dit « les remerciements s… | légende 32 |
| 17 | mar. 27/10 | 08:15 | 07:15 | LI | VANNE (TIRAGE) | `cs14jkd11f7913f8177df395` | « Mon père a acheté une tondeuse robot pour ne plus avoir à tondre la … | LI 141 |
| 18 | mer. 28/10 | 09:00 | 08:00 | X | VANNE_QUIZ (TIRAGE) | `cs14jk177b62432b07f5d17a` | « Le jury m'a dit “prenez votre temps”. Je me suis tu quarante seconde… | X 218 |
| 19 | mer. 28/10 | 12:30 | 11:30 | IG | VANNE (TIRAGE) | `cs14jk7911857c4ff09eb025` | Quand on tape mon nom sur Internet, on tombe sur un champion de tir à … | légende 25 |
| 20 | jeu. 29/10 | 12:30 | 11:30 | X | RELAIS (TIRAGE) | `cs14jkb9ba433a0746280280` | « Mon date a enregistré mon numéro devant moi. Elle a tapé “Antoine ba… | X 181 |
| 21 | jeu. 29/10 | 19:30 | 18:30 | IG | RELAIS (TIRAGE) | `cs14jk76ca7ad32cce9041ce` | Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu. | légende 80 |
| 22 | jeu. 29/10 | 08:15 | 07:15 | LI | SITUATION (VALIDE L2) | `L2` | Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Tu passes… | LI 221 |
| 23 | ven. 30/10 | 12:30 | 11:30 | X | PIVOT (V5 halloween-x) | `blagues-halloween-soiree-deguisee#3` | « Je me suis déguisé en plante verte. » | X 154 |
| 24 | ven. 30/10 | 19:30 | 18:30 | IG | VANNE (V5 halloween-ig) | `cs14jk1bc86d3502a2cef27b` | Pour Halloween, j'ai proposé à mon date qu'on se déguise en couple. | légende 72 |
| 25 | lun. 02/11 | 12:30 | 11:30 | X | RELAIS (TIRAGE) | `humour-en-visio-reunion-en-ligne#3` | « Je me suis connecté dix minutes en avance à la visio. J'ai passé dix… | X 206 |
| 26 | lun. 02/11 | 19:30 | 18:30 | IG | RELAIS (TIRAGE) | `cs14jkbc3334e2de46753dcf` | Au théâtre, l'acteur s'est arrêté au milieu d'une phrase. Silence de d… | légende 79 |
| 27 | mar. 03/11 | 09:00 | 08:00 | X | CONSEIL (MIX) | `cmmw0tqkc000smw62bo1yfeyg` | Le PS qui détend : tu envoies le rapport du trimestre, mail sérieux de… | X 206 |
| 28 | mar. 03/11 | 12:30 | 11:30 | IG | CONSEIL (MIX) | `cmq0gw85z00nas60xc0gno2ka` | La manie en métier | légende 57 |
| 29 | mar. 03/11 | 08:15 | 07:15 | LI | RELAIS (TIRAGE) | `cp05d2c3950800b7575c12ce6` | « Je suis allé à la BU chercher les quatre ouvrages cités par l'IA pou… | LI 370 |
| 30 | mer. 04/11 | 12:30 | 11:30 | X | VANNE_QUIZ (TIRAGE) | `cs14jk55b4243d4d1c132b97` | « Mon date a posé son téléphone face contre la table pour me montrer q… | X 248 |
| 31 | mer. 04/11 | 19:30 | 18:30 | IG | VANNE (TIRAGE) | `cs14jk4f97079b992f85eeb1` | Mon ex est venue nous dire bonjour pendant mon rendez-vous. Mon date l… | légende 44 |
| 32 | jeu. 05/11 | 09:00 | 08:00 | X | RELAIS (TIRAGE) | `blagues-de-couple-drole#5` | « Elle s'est endormie sur moi, la télécommande hors d'atteinte. J'ai a… | X 174 |
| 33 | jeu. 05/11 | 12:30 | 11:30 | IG | RELAIS (TIRAGE) | `cp0465e601e49c114994d1a00` | Mon père m'a dit qu'il fallait que je « fasse mes preuves ». | légende 77 |
| 34 | jeu. 05/11 | 08:15 | 07:15 | LI | RELAIS (MIX) | `relais-linkedin-2026-11-05` | Entre deux réunions, ton téléphone vibre : l'autre te demande si tu re… | LI 347 |
| 35 | ven. 06/11 | 12:30 | 11:30 | X | CONSEIL (MIX) | `cmnfak3lg0000s60x6zvwqbnh` | L'escalade complice : ton pote lance « Ton pull, on dirait que ta gran… | X 257 |
| 36 | ven. 06/11 | 19:30 | 18:30 | IG | CONSEIL (MIX) | `cmmp8ozsx000pqk63pgbihclg` | La fausse naïveté | légende 66 |
| 37 | lun. 09/11 | 12:30 | 11:30 | X | CONSEIL (MIX) | `cmmp8ozsx000lqk63pgytfuuv` | La répartie bienveillante : ton pote renverse son verre en plein dîner… | X 167 |
| 38 | lun. 09/11 | 19:30 | 18:30 | IG | CONSEIL (MIX) | `cmp51ckjk012hs60ya03z0at2` | La fausse critique | légende 48 |
| 39 | mar. 10/11 | 12:30 | 11:30 | X | CONSEIL (MIX) | `cmnl5yc92000cs60zfctq4dm2` | Le tic collectif : en pause café, tout le monde secoue la dosette avan… | X 260 |
| 40 | mar. 10/11 | 19:30 | 18:30 | IG | CONSEIL (MIX) | `cmorynj4s000rs60w3dxwnx8h` | Le carnet d'absurdités | légende 56 |
| 41 | mar. 10/11 | 08:15 | 07:15 | LI | RELAIS (MIX) | `relais-linkedin-2026-11-10` | Lundi, un nouveau arrive dans l'équipe et reçoit la pique maison, cell… | LI 409 |
| 42 | jeu. 12/11 | 12:30 | 11:30 | X | CONSEIL (MIX) | `cmpdlrjvn00qts60x5u5im54k` | Détourner un proverbe : ton coloc regarde l'évier et demande où en est… | X 193 |
| 43 | jeu. 12/11 | 19:30 | 18:30 | IG | CONSEIL (MIX) | `cmov5buqv0024s60wto587pj7` | La vanne retenue | légende 57 |
| 44 | jeu. 12/11 | 08:15 | 07:15 | LI | RELAIS (MIX) | `relais-linkedin-2026-11-12` | Ton manager va recevoir quarante mails de vœux sur le même modèle : « … | LI 381 |
| 45 | ven. 13/11 | 12:30 | 11:30 | X | CONSEIL (MIX) | `cmmw0tqsb000wmw620z1lmqn4` | La patience du sniper : ton coloc annonce son régime à 12 h 15. À 12 h… | X 191 |
| 46 | ven. 13/11 | 19:30 | 18:30 | IG | CONSEIL (MIX) | `cmmp8ozsx0004qk63x4cxt89b` | L'anecdote qui déraille | légende 53 |

Mesure : X = `longueurX` ; IG = longueur de la légende, renvoi compris ; LI = longueur du post.

**À savoir avant l'insertion** (déjà signalé en révision 5, inchangé) : les légendes L24 (TGV) et L20 (l'ex) suivent leur vanne, tirée le 29/10 et le 04/11 au lieu des cases relues (19/10, 02/11) ; L19 (théâtre) part le 02/11 au lieu du 29/10. Le carrousel C3 (04/11) et le conseil K63 (05/11 IG) ne sont pas utilisés : la vanne du parking reste libre pour le carrousel du 18/11 (lot 2a).

### Commande d'insertion (à lancer par Thomas, depuis `apps/web`)

```bash
npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict --debut 2026-10-19 --fin 2026-11-15 --json ../../docs/social/preparation/lot-1b.json --insert --driver=neon-http
```

Même pilote que pour l'insertion du 1a (`--driver=neon-http`, voir `REPLIT_ACTIONS.md`). Attendu : « Inséré : 46 posts APPROVED (thomas-s15) », puis contrôle conforme par réseau et par semaine. Annulation de la seule tranche 1b si besoin : même commande avec `--rollback` (comptes), puis `--rollback --confirmer`, sans jamais toucher au 1a.

### Contrôles

`npx tsc --noEmit -p tsconfig.build.json`, `npm run lint` (0 erreur, 1 avertissement `<img>` existant dans `admin/page.tsx`), `npm run build` : OK. `npx jest` : 271 suites, 3 906 tests passés (4 ignorés, déjà ignorés avant), 0 échec.

### Verdict : **GO pour l'insertion du 1b** (0 erreur, 46 posts, toutes les mesures dans les plafonds)

## Révision 5 (10/10, lignes notées au tirage et repli versé)

> @fullstack, 10/10/2026. Rien d'inséré, rien de déployé (ni `--insert`, ni `--rollback --confirmer`, ni `deploy:cf`). Lectures Neon en SELECT seulement. Commande (depuis `apps/web`) : `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict --debut 2026-10-19 --fin 2026-11-15 --out /tmp/fs-1b-v5/1b-v5.md --json /tmp/fs-1b-v5/1b-v5.json`. Mesures : script `/tmp/fs-1b-v5/mesure.txt` (`longueurX`, longueur des légendes, conseils par semaine). Référence avant modification : `/tmp/fs-1b-v5/1b-ref.md` (identique à la révision 4).

**Constat vérifié** : avec `--pool strict`, `libre()` refuse toute clé absente de `POOL_STRICT` (`if (rang && !rang.has(v.cle))`). Une ligne d'article qui n'est pas une vanne du catalogue (`slug#rang`) n'y figure jamais : aucune des 18 lignes au niveau de `lignes-articles-notes.json` ne pouvait être tirée. En plus, le `rang` du fichier est souvent le numéro de section de l'article (`**5. Sa photo est prise au bord de l'eau.**`) et pas le rang que l'extracteur donne à la ligne : 5 lignes (visio 1, anniversaire 3, appli 5, 11 et 18) ne se retrouvaient pas par leur rang. Elles se retrouvent par leur texte, présent mot pour mot dans l'article en base (contrôlé sur les 18).

**Code** : `social-lignes-notees.ts` (lecture, `auNiveau` contrôlé contre « = » / « = », doublons refusés) ; `prepare-social-month.ts --lignes-notees` (défaut `lignes-articles-notes.json`) ; dans `social-lot-v5.ts`, une ligne notée n'est admise hors pool que dans `ligneRelais`, pour le relais de SON article, juste après les vannes du catalogue citées dans l'article et avant la vanne du catalogue de repli (v5 §1, relais (2)). Clé : celle de la ligne reconnue au même texte (`slug#rang` de l'article, ou id du catalogue si c'est une vanne du catalogue), sinon `slug#rang` du fichier, sinon `slug#<texte normalisé>` (rang nul ou rang déjà pris par une autre ligne). Registre des 90 jours, doublon de texte avec une vanne déjà tirée et refus du réseau de 1re diffusion inchangés. Une ligne d'un article de messages ne sort jamais de son relais (`lignesPubliees` et le tirage la refusent toujours). Instagram : ligne notée seulement si sa légende « À envoyer à... » existe (aucune aujourd'hui), sinon la case suit le tirage. 13 tests (`social-lot-lignes-notees.test.ts`). Contrôle des légendes : « À envoyer au » et « À envoyer aux » acceptés (contraction ; K63 « À envoyer au pote... » était refusée à tort), 1 test.

**Versé** : `textes-formats-valides.json` : K59 (09/11 X), K42 (09/11 IG), K53 (12/11 X), K63 (05/11 IG), K76 (12/11 IG), tous `role: "repli"`, et le carrousel C3 (`carrousel-r9-2026-11-04`, vanne du parking `cs14jk34c841ef6e1abadb11`). Cartes 1 et 2 de C3 = la vanne du catalogue mot pour mot, sans les « / » de mise en page de la fiche. 1re publication du parking en base : X, 07/10/2026 10:33 UTC (`c2acdc88db93f4686071f6068`, seule diffusion), soit 28 jours au 04/11 : R9 tenue. `social-lot-v5-legendes.ts` : L24 (TGV, remplace L12, trop longue avec le renvoi), L19 (théâtre), L20 (l'ex), L29 (bouc).

### Résultat : 46 posts (X 19, IG 19, LinkedIn 8), **2 erreurs**

- **05/11 X servi** : relais `blagues-de-couple-drole#5` (« Elle s'est endormie sur moi... »), 174 caractères.
- Lignes notées tirées, conformément à la règle « relais, ligne notée » (plan §2, mix §2) : **19/10 X** (`humour-en-colocation-desamorcer-tensions#1`, la poêle) et **02/11 X** (`humour-en-visio-reunion-en-ligne#3`, dix minutes seul avec son visage). Ces deux relais prenaient une vanne du catalogue de repli. Les vannes ainsi libérées passent aux cases suivantes : **8 cases changent** par rapport aux décisions de la clé (tableau ci-dessous).
- 22/10 X (X2, post fixe de Thomas) et 29/10 X (vanne du catalogue citée dans l'article) : inchangés, comme le veut l'ordre existant.

**Vannes tirées différentes de la clé (non forcées, signalées)** :

| Case | Clé (décision du 10/10) | Tirage révision 5 | Effet |
|---|---|---|---|
| 19/10 IG relais | TGV + L24 | concert `cs14jkd9058d03e24961004a` | **ERREUR : légende manquante** (45 caractères au plus, renvoi « Les autres exemples : lien en bio. ») |
| 29/10 IG relais | théâtre + L19 | TGV + L24 | légende de 80 caractères, renvoi compris : conforme, sur un autre relais que celui relu |
| 02/11 IG relais | l'ex + L20 | théâtre + L19 | 79 caractères : conforme, autre relais que celui relu |
| 04/11 IG | carrousel C3 | carte vanne l'ex + L20 (44 caractères) | C3 rendu au repli, non utilisé : la vanne du parking reste libre (le carrousel du 18/11, lot 2a, n'a plus à changer de vanne) |
| 04/11 X quiz | « fais tes preuves » `cp0465e601e49c114994d1a00` | téléphone face contre la table `cs14jk55b4243d4d1c132b97` | aucun |
| 05/11 IG relais | conseil K63 | « fais tes preuves » `cp0465e601e49c114994d1a00` | **ERREUR : légende manquante** (51 caractères au plus, renvoi « Les 30 vannes : lien en bio. ») ; K63 rendu au repli, non utilisé |
| 19/10 X, 02/11 X | vannes concert, téléphone | lignes notées | voir plus haut |

**Variante mesurée, non retenue** (lignes notées APRÈS la vanne du catalogue de repli, c'est-à-dire seulement quand le pool est épuisé) : **0 erreur, 46 posts**, JSON écrit (`/tmp/fs-1b-v5/1b-B2.json`) ; seule la case du 05/11 X change (couple#5) et toutes les décisions de la clé tiennent (L24 le 19/10, L19 le 29/10, L20 le 02/11, C3 le 04/11, K63 le 05/11). Non retenue parce qu'elle contredit le plan §2 et le mix §2 (« relais, ligne notée » d'abord). Choix à confirmer par l'orchestrateur ou Thomas (voir verdict).

### Mesures (script)

- **X** : 19 posts, `longueurX` de 105 à 260, **0 au-dessus de 270**.
- **Légendes Instagram** : 19, de 25 à 80 caractères renvoi compris, **0 au-dessus de 80** ; 2 sans « À envoyer à » (les 2 erreurs).
- **Conseils par semaine** (plafond 8, nominaux compris) : semaine du 19/10 : 2 ; du 26/10 : 0 ; du 02/11 : 4 ; du 09/11 : **8** (au plafond, 4 nominaux et 4 de repli).
- LinkedIn : 1 relais la semaine du 02/11 (03/11) plus le relais validé du 05/11, comme en révisions 3 et 4 ; 2 relais validés la semaine du 09/11 (10/11, 12/11).

### Tableau des 46 posts

| # | Jour | Heure | Réseau | Type | Source | Début du texte (X, LI) ou carte 1 (IG) | Mesure |
|---|---|---|---|---|---|---|---|
| 1 | lun. 19/10 | 12:30 | X | RELAIS | `humour-en-colocation-desamorcer-tensions#1` | « J'ai dit “je la fais tout à l'heure” à la poêle. » | X 176 |
| 2 | lun. 19/10 | 19:30 | IG | RELAIS | `cs14jkd9058d03e24961004a` | Un mec a filmé tout le concert devant moi, téléphone en l'air. J'ai su… | légende 34, **ERREUR** (sans « À envoyer à ») |
| 3 | mar. 20/10 | 09:00 | X | VANNE | `cs14jke10b58d158ae638560` | « Mon copain m'a rendu le chargeur qu'il m'avait pris il y a un an. » | X 105 |
| 4 | mar. 20/10 | 12:30 | IG | VANNE | `cs14jk29357d022f6880a69e` | Pendant que j'étais aux toilettes, mon date a remonté tout mon Instagr… | légende 68 |
| 5 | mar. 20/10 | 08:15 | LI | VANNE | `cs14jk90226d6abb90287724` | « Ma mère me demande encore des nouvelles de mon ex. » | LI 54 (amorce) |
| 6 | mer. 21/10 | 12:30 | X | VANNE_QUIZ (X3) | `cs14jk50c85bb0d73deaebaf` | « Dans le train, la place à côté de moi était réservée. Personne n'est… | X 246 |
| 7 | mer. 21/10 | 19:30 | IG | VANNE (IG-21-10) | `cmmnsqn130033th63b54ux45o` | Mon père a vu mon appart. Il a dit « c'est pas mal ». | légende 74 |
| 8 | jeu. 22/10 | 09:00 | X | RELAIS (X2) | `cs14jk0e4fedaac1a91fddf1` | « Mes parents m'ont dit qu'ils étaient fiers de moi. J'ai demandé pour… | X 184 |
| 9 | jeu. 22/10 | 12:30 | IG | RELAIS (relais-ig-22-10) | `message-anniversaire-drole-par-situation#13` | On m'a dit que celui qui fait un discours est dispensé de vaisselle. | légende 72 |
| 10 | jeu. 22/10 | 08:15 | LI | VANNE (li-22-10) | `cs14jk69eb578cce484b6f87` | « Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un. » | LI 67 (amorce) |
| 11 | ven. 23/10 | 12:30 | X | CONSEIL | `cmptbp7nv002bs60xscu5ixmx (conseil)` | Trois coups d'avance : ton pote voit ta note. « 8/20 en maths, aïe. » … | X 171 |
| 12 | ven. 23/10 | 19:30 | IG | CONSEIL | `cmny1tkhw000rs60wsolieluq (conseil)` | Consoler en exagérant | légende 56 |
| 13 | lun. 26/10 | 12:30 | X | RELAIS (relais-x-26-10) | `cs14jkf0a20e0837fa95c784` | « J'ai demandé à une IA si mon message “tu viens ce soir ?” n'était pa… | X 205 |
| 14 | lun. 26/10 | 19:30 | IG | RELAIS (relais-ig-26-10) | `cs14jke6736001250d3a940d` | J'ai demandé à l'IA un avis honnête sur mon manuscrit. Elle a répondu … | légende 75 |
| 15 | mar. 27/10 | 12:30 | X | VANNE | `cs14jka7e683e43af915bb60` | « Quelqu'un a récupéré le fauteuil que je venais de jeter à la déchett… | X 150 |
| 16 | mar. 27/10 | 19:30 | IG | VANNE (IG1) | `cs14jke5d015b07714055538` | Mon tuteur a lu mon rapport de stage. Il m'a dit « les remerciements s… | légende 32 |
| 17 | mar. 27/10 | 08:15 | LI | VANNE | `cs14jkd11f7913f8177df395` | « Mon père a acheté une tondeuse robot pour ne plus avoir à tondre la … | LI 80 (amorce) |
| 18 | mer. 28/10 | 09:00 | X | VANNE_QUIZ | `cs14jk177b62432b07f5d17a` | « Le jury m'a dit “prenez votre temps”. Je me suis tu quarante seconde… | X 218 |
| 19 | mer. 28/10 | 12:30 | IG | VANNE | `cs14jk7911857c4ff09eb025` | Quand on tape mon nom sur Internet, on tombe sur un champion de tir à … | légende 25 |
| 20 | jeu. 29/10 | 12:30 | X | RELAIS | `cs14jkb9ba433a0746280280` | « Mon date a enregistré mon numéro devant moi. Elle a tapé “Antoine ba… | X 181 |
| 21 | jeu. 29/10 | 19:30 | IG | RELAIS | `cs14jk76ca7ad32cce9041ce` | Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu. | légende 80 |
| 22 | jeu. 29/10 | 08:15 | LI | SITUATION (L2) | `L2` | Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Tu passes… | LI 221 (amorce) |
| 23 | ven. 30/10 | 12:30 | X | PIVOT (halloween-x) | `blagues-halloween-soiree-deguisee#3` | « Je me suis déguisé en plante verte. » | X 154 |
| 24 | ven. 30/10 | 19:30 | IG | VANNE (halloween-ig) | `cs14jk1bc86d3502a2cef27b` | Pour Halloween, j'ai proposé à mon date qu'on se déguise en couple. | légende 72 |
| 25 | lun. 02/11 | 12:30 | X | RELAIS | `humour-en-visio-reunion-en-ligne#3` | « Je me suis connecté dix minutes en avance à la visio. J'ai passé dix… | X 206 |
| 26 | lun. 02/11 | 19:30 | IG | RELAIS | `cs14jkbc3334e2de46753dcf` | Au théâtre, l'acteur s'est arrêté au milieu d'une phrase. Silence de d… | légende 79 |
| 27 | mar. 03/11 | 09:00 | X | CONSEIL | `cmmw0tqkc000smw62bo1yfeyg (conseil)` | Le PS qui détend : tu envoies le rapport du trimestre, mail sérieux de… | X 206 |
| 28 | mar. 03/11 | 12:30 | IG | CONSEIL | `cmq0gw85z00nas60xc0gno2ka (conseil)` | La manie en métier | légende 57 |
| 29 | mar. 03/11 | 08:15 | LI | RELAIS | `cp05d2c3950800b7575c12ce6` | « Je suis allé à la BU chercher les quatre ouvrages cités par l'IA pou… | LI 85 (amorce) |
| 30 | mer. 04/11 | 12:30 | X | VANNE_QUIZ | `cs14jk55b4243d4d1c132b97` | « Mon date a posé son téléphone face contre la table pour me montrer q… | X 248 |
| 31 | mer. 04/11 | 19:30 | IG | VANNE | `cs14jk4f97079b992f85eeb1` | Mon ex est venue nous dire bonjour pendant mon rendez-vous. Mon date l… | légende 44 |
| 32 | jeu. 05/11 | 09:00 | X | RELAIS | `blagues-de-couple-drole#5` | « Elle s'est endormie sur moi, la télécommande hors d'atteinte. J'ai a… | X 174 |
| 33 | jeu. 05/11 | 12:30 | IG | RELAIS | `cp0465e601e49c114994d1a00` | Mon père m'a dit qu'il fallait que je « fasse mes preuves ». | légende 28, **ERREUR** (sans « À envoyer à ») |
| 34 | jeu. 05/11 | 08:15 | LI | RELAIS | `relais-linkedin-2026-11-05 (relaisLinkedIn)` | Entre deux réunions, ton téléphone vibre : l'autre te demande si tu re… | LI 82 (amorce) |
| 35 | ven. 06/11 | 12:30 | X | CONSEIL | `cmnfak3lg0000s60x6zvwqbnh (conseil)` | L'escalade complice : ton pote lance « Ton pull, on dirait que ta gran… | X 257 |
| 36 | ven. 06/11 | 19:30 | IG | CONSEIL | `cmmp8ozsx000pqk63pgbihclg (conseil)` | La fausse naïveté | légende 66 |
| 37 | lun. 09/11 | 12:30 | X | CONSEIL | `cmmp8ozsx000lqk63pgytfuuv (conseil)` | La répartie bienveillante : ton pote renverse son verre en plein dîner… | X 167 |
| 38 | lun. 09/11 | 19:30 | IG | CONSEIL | `cmp51ckjk012hs60ya03z0at2 (conseil)` | La fausse critique | légende 48 |
| 39 | mar. 10/11 | 12:30 | X | CONSEIL | `cmnl5yc92000cs60zfctq4dm2 (conseil)` | Le tic collectif : en pause café, tout le monde secoue la dosette avan… | X 260 |
| 40 | mar. 10/11 | 19:30 | IG | CONSEIL | `cmorynj4s000rs60w3dxwnx8h (conseil)` | Le carnet d'absurdités | légende 56 |
| 41 | mar. 10/11 | 08:15 | LI | RELAIS | `relais-linkedin-2026-11-10 (relaisLinkedIn)` | Lundi, un nouveau arrive dans l'équipe et reçoit la pique maison, cell… | LI 114 (amorce) |
| 42 | jeu. 12/11 | 12:30 | X | CONSEIL | `cmpdlrjvn00qts60x5u5im54k (conseil)` | Détourner un proverbe : ton coloc regarde l'évier et demande où en est… | X 193 |
| 43 | jeu. 12/11 | 19:30 | IG | CONSEIL | `cmov5buqv0024s60wto587pj7 (conseil)` | La vanne retenue | légende 57 |
| 44 | jeu. 12/11 | 08:15 | LI | RELAIS | `relais-linkedin-2026-11-12 (relaisLinkedIn)` | Ton manager va recevoir quarante mails de vœux sur le même modèle : « … | LI 97 (amorce) |
| 45 | ven. 13/11 | 12:30 | X | CONSEIL | `cmmw0tqsb000wmw620z1lmqn4 (conseil)` | La patience du sniper : ton coloc annonce son régime à 12 h 15. À 12 h… | X 191 |
| 46 | ven. 13/11 | 19:30 | IG | CONSEIL | `cmmp8ozsx0004qk63x4cxt89b (conseil)` | L'anecdote qui déraille | légende 53 |

### Lot 1a inchangé (preuve)

Même commande sur le 12/10 au 18/10, avant (`/tmp/fs-1b-v5/1a-ref.*`) et après toutes les modifications (`1a-new.*`) : JSON identique à l'octet (`cmp`, sha256 `63a2f315aed1c0d5…`, le même que `lot-relance-s15.json`, le 1a inséré), Markdown identique, sortie console identique hors chemin. Test : `lot 1a inchangé` (`social-lot-lignes-notees.test.ts`, lignes du dépôt).

### Contrôles

`npx tsc --noEmit -p tsconfig.build.json`, `npm run lint` (0 erreur, 1 avertissement `<img>` existant dans `admin/page.tsx`), `npm run build` : OK. `npx jest` : 271 suites, 3 906 tests passés (4 ignorés, déjà ignorés avant), 0 échec.

### Verdict : **pas prêt pour l'insertion du 14/10 en l'état (2 erreurs)**

Il manque 2 légendes « À envoyer à... » relues à l'aveugle (barre 8,5) : **relais IG lun. 19/10**, vanne du concert `cs14jkd9058d03e24961004a`, 45 caractères au plus ; **relais IG jeu. 05/11**, vanne « fais tes preuves » `cp0465e601e49c114994d1a00`, 51 caractères au plus. Ensuite : versement dans `social-lot-v5-legendes.ts`, nouveau dry-run, puis insertion. Autre voie, immédiate : retenir la variante « ligne notée après la vanne de repli » (0 erreur mesurée), ce qui demande une décision explicite parce qu'elle s'écarte du plan §2.

## Révision 4 (10/10, après insertion du 1a)

> @fullstack, 10/10/2026. Aucune modification de code. Rien d'inséré, rien de déployé (ni `--insert`, ni `--rollback --confirmer`, ni `deploy:cf`). Commande (depuis `apps/web`) : `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict --debut 2026-10-19 --fin 2026-11-15 --out /tmp/1b-0910.md --json /tmp/1b-0910.json`. Sorties hors dépôt ; les fichiers par défaut `lot-relance-s15.{md,json}` (lot 1a inséré) ne sont pas touchés. Comparaison avec `/tmp/fs-1b-v3/1b-new.md` (révision 3).

**Console** : catalogue 132 vannes GARDER (127 en rév. 3), pool strict 42 (inchangé, `social-pool.ts` non modifié depuis), **stock éligible 15 (22)**, **26 posts récents (14 : +12, les 12 posts du 1a)**. **39 posts (X 16, IG 15, LinkedIn 8)**, contre 46 (19 / 19 / 8). **12 erreurs** (5 en rév. 3), 0 repli en réserve. JSON non écrit.

**Cause unique des différences** : la révision 3 tournait sans le 1a en base, et le 1b réutilisait donc **7 vannes du 1a** : `cs14jka3336e7e90a453a9d6` (19/10 X), `cmni62ad30005s60yc7qnog31` (20/10 X), `cmnz0jqsx000rs60xrbrqm8kk` (20/10 IG), `cs14jk9a9e7a1b8e0e16264e` (20/10 LI), `cmmnsqn15006kth63res9rqp9` (27/10 X), `cmmnsqn120000th63o435xsb0` (27/10 LI), `cmmnsqn130038th63fxn1wvhn` (28/10 X). L'anti-répétition de 90 jours les exclut désormais (stock 22 moins 7 = 15). Chaque case concernée prend la vanne suivante du pool, toute la suite remonte d'un cran, et **les 7 dernières cases restent sans vanne**. Le pool strict étant inchangé, les 5 vannes GARDER de plus au catalogue n'entrent pas dans le tirage. Inchangés : les 10 conseils, L2 (29/10), R08 (05/11), R07 (10/11), R02 (12/11), les relais d'article des 22/10 et 26/10, Halloween (30/10), et les 3 posts validés par Thomas (X3 21/10, X2 22/10, IG1 27/10).

| Case | Rév. 3 | Rév. 4 | Pourquoi |
|---|---|---|---|
| 19/10 X relais | `cs14jka3336e7e90a453a9d6` | `cs14jkd9058d03e24961004a` (concert) | vanne du 1a sortie ; le concert passe de l'IG au X |
| 19/10 IG relais | `cs14jkd9058d03e24961004a` | `cs14jk76ca7ad32cce9041ce` (TGV) + L12 | remonte du 05/11 X |
| 20/10 X | `cmni62ad30005s60yc7qnog31` | `cs14jke10b58d158ae638560` (chargeur) | 1a ; remonte du 28/10 IG |
| 20/10 IG | `cmnz0jqsx000rs60xrbrqm8kk` | `cs14jk29357d022f6880a69e` (bouc) | 1a ; remonte du 29/10 IG relais |
| 20/10 LI | `cs14jk9a9e7a1b8e0e16264e` | `cs14jk90226d6abb90287724` (mère et ex) | 1a ; remonte du 02/11 IG relais |
| 27/10 X | `cmmnsqn15006kth63res9rqp9` | `cs14jka7e683e43af915bb60` (fauteuil) | 1a ; remonte du 04/11 X |
| 27/10 LI | `cmmnsqn120000th63o435xsb0` | `cs14jkd11f7913f8177df395` (tondeuse) | 1a ; remonte du 04/11 IG |
| 28/10 X quiz | `cmmnsqn130038th63fxn1wvhn` | `cs14jk177b62432b07f5d17a` (jury) | 1a ; remonte du 02/11 X |
| 28/10 IG | `cs14jke10b58d158ae638560` | `cs14jk7911857c4ff09eb025` (homonyme) | le chargeur part au 20/10 ; l'homonyme remonte du 03/11 LI |
| 29/10 IG relais | `cs14jk29357d022f6880a69e` | `cs14jkbc3334e2de46753dcf` (théâtre) | le bouc part au 20/10 ; le théâtre remonte du 05/11 IG |
| 02/11 X relais | `cs14jk177b62432b07f5d17a` | `cs14jk55b4243d4d1c132b97` (téléphone face contre la table) | remonte du 09/11 X |
| 02/11 IG relais | `cs14jk90226d6abb90287724` | `cs14jk4f97079b992f85eeb1` (l'ex et sa liste) | remonte du 09/11 IG |
| 03/11 LI relais | `cs14jk7911857c4ff09eb025` | `cp05d2c3950800b7575c12ce6` (BU) | remonte du 12/11 X |
| 04/11 X quiz | `cs14jka7e683e43af915bb60` | `cp0465e601e49c114994d1a00` (« fais tes preuves ») | remonte du 12/11 IG |
| 04/11 IG | `cs14jkd11f7913f8177df395` | **vide** | stock épuisé |
| 05/11 X et IG relais | `cs14jk76ca7ad32cce9041ce`, `cs14jkbc3334e2de46753dcf` | **vides** | stock épuisé |
| 09/11 X et IG relais | `cs14jk55b4243d4d1c132b97`, `cs14jk4f97079b992f85eeb1` | **vides** | stock épuisé |
| 12/11 X et IG relais | `cp05d2c3950800b7575c12ce6`, `cp0465e601e49c114994d1a00` | **vides** | stock épuisé |

**Erreurs, rév. 3 contre rév. 4** :
- Rév. 3 : 5 × « légende sans « À envoyer à » en tête » (relais IG 19/10, 29/10, 05/11, 09/11, 12/11).
- Rév. 4 : 12 erreurs.
  - 29/10 et 02/11 IG relais : « légende sans « À envoyer à » » (2).
  - 19/10 IG relais : « trop long (94 > 80) » et « légende de 94 caractères » (2). L12, écrite pour une case de vanne, ne tient pas avec le renvoi.
  - 20/10 IG vanne : « légende manquante » pour le bouc (1).
  - 04/11 IG, 05/11 X et IG, 09/11 X et IG, 12/11 X et IG : « repli du mix sans texte validé » (7). Le 04/11 IG attend un carrousel R9, sinon un conseil ou une ligne d'article notée ; les 6 autres attendent une ligne d'article notée.

**Vannes des relais Instagram (à figer)** :

| Relais IG | Rév. 3 | Rév. 4 | Renvoi | Max « À envoyer à... » |
|---|---|---|---|---|
| lun. 19/10 | `cs14jkd9058d03e24961004a` | `cs14jk76ca7ad32cce9041ce` (L12 trop longue) | Les autres exemples : lien en bio. | 45 |
| jeu. 22/10 | n°13 de l'article | inchangé, légende OK | | |
| lun. 26/10 | `cs14jke6736001250d3a940d` | inchangé, légende OK | | |
| jeu. 29/10 | `cs14jk29357d022f6880a69e` | `cs14jkbc3334e2de46753dcf` | Les autres exemples : lien en bio. | 45 |
| lun. 02/11 | `cs14jk90226d6abb90287724` (légende OK) | `cs14jk4f97079b992f85eeb1` | Les autres exemples : lien en bio. | 45 |
| jeu. 05/11, lun. 09/11, jeu. 12/11 | vannes tirées | aucune vanne | | |

Commande mise à jour (4 légendes : 3 relais et la vanne IG du 20/10, avec textes, renvois et voisines) : **`lot-1b-legendes-a-commander.md`**. L'ancienne commande (5 relais, rév. 3) est caduque : n'écrire aucune de ses légendes.

**Décision à prendre (orchestrateur ou Thomas), non tranchée ici** : 7 cases sans texte. Options :
- (a) commander 6 lignes d'article notées (05/11 couple, 09/11 chambrer, 12/11 vœux, X et IG) et 1 carrousel R9 pour le 04/11, puis les faire passer à l'aveugle ;
- (b) élargir le pool strict (`src/config/social-pool.ts`, lu aussi par le Worker) avec des vannes au niveau ;
- (c) laisser ces 7 cases en silence.

Avec (b), le tirage change : il faut relancer le dry-run avant d'écrire les 4 légendes. Avec (a) ou (c), les vannes des 19/10, 20/10, 29/10 et 02/11 ne devraient pas bouger [HYPOTHÈSE : à confirmer par un dry-run après versement].

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

> **Mise à jour (08/10, gabarit carte conseil codé)** : les conseils IG ont désormais `threadParts = [surtitre, carte 1, carte 2]` (plus de « Technique : » dans le texte) et leur propre gabarit. Rendu réel : 10 cartes sur 10 tiennent (`docs/social/visuels-s15/conseils-1b/index.md`). Le gabarit est commité mais pas déployé : voir `REPLIT_ACTIONS.md`.

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
