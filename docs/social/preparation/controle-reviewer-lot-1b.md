# Contrôle @reviewer du lot social 1b (19/10 au 15/11/2026, 46 posts), avant insertion

> @reviewer, 10/10/2026. Étape 5 de la recette d'un lot (`plan-execution-s15.md` §5, l.113). Objet contrôlé : `lot-1b.md` (texte exact des 46 posts), `lot-1b-dry-run-08-10.md` révision 6, `founder-preferences.md`. Croisements : les `*-resultat.md` de `preparation/`, `lignes-articles-notes.json`, `validation-thomas-s15.md`, `strategie-relance-v5.md`, `apps/web/src/config/social-pool.ts`. Aucun autre fichier modifié.

## Verdict : **NO-GO** (5 écarts, 9 posts concernés)

Les choix de Thomas sont tenus sur les 46 posts (tiret cadratin, prix, « gratuit », compte gratuit, LinkedIn, R6, compte = site). Le blocage vient des contenus validés : les 9 posts concernés portent un texte qui n'a jamais été « retenu » à l'aveugle (le lot l'affiche lui-même : `lot-1b.md` l.17 à 24, « Textes NEUFS (4) », alors que le 1a en avait 0), une ligne d'article est notée sous le niveau, et le post LinkedIn du 03/11 remplace l'étalon visio signé par Thomas.

## Top 3

1. **E1, LinkedIn mar. 03/11** : l'étalon visio validé par Thomas est remplacé par une vanne hors thème. C'est un `[CHOIX UTILISATEUR]`.
2. **E4, Instagram jeu. 22/10** : la ligne n°13 de l'article est sous le niveau (`auNiveau: false`), et sa légende n'a jamais été relue.
3. **E2 et E3, les 6 relais du 19/10, du 29/10 et du 02/11 (X et IG)** : les renvois « Les autres exemples… » sont neufs et n'ont pas été relus. Sur Instagram, ils sont faux, parce que la vanne montrée ne vient pas de l'article.

## Écarts

| # | Post | Règle | Constat | Correction exacte |
|---|---|---|---|---|
| E1 | mar. 03/11 08:15 LinkedIn, RELAIS (`cp05d2c3950800b7575c12ce6`, la BU) | Choix de Thomas (`founder-preferences.md` l.67 : étalons des formats = recos de `etalons-formats-sociaux-s15.md`, dont « relais LinkedIn visio 03/11 ») ; v5 l.32 (2), « vanne du même thème » ; texte neuf relu à l'aveugle | Le texte publié est une vanne sur les références inventées par une IA à la BU, sans rapport avec la visio, suivie du renvoi neuf « Les autres exemples, et comment trouver le tien : ». « Les autres » est faux : la vanne n'est pas dans l'article. L'étalon V-A validé (`etalons-formats-sociaux-s15.md` l.193) n'est pas servi : il manque dans `textes-formats-valides.json`. | Remplacer le contenu par l'étalon V-A, mot pour mot : « Tu lances une phrase légère en visio et il ne se passe rien : aucun rire, des micros coupés. Pas drôle, ou drôle mais en muet : tu ne le sauras pas. Voici les 5 ressorts de l'humour en visio, et comment les placer : » puis, à la ligne, `https://deviens-marrant.fr/blog/humour-en-visio-reunion-en-ligne?utm_source=linkedin&utm_medium=social&utm_campaign=2026-11&utm_content=relais`. @fullstack le verse dans `textes-formats-valides.json` (relais LinkedIn, créneau 2026-11-03, `angleTravail: true`). La vanne de la BU retourne au pool. Régénérer le dry-run et vérifier que la cascade ne change aucune autre case. |
| E2 | lun. 19/10 12:30 X (colocation n°1) ; jeu. 29/10 12:30 X (`cs14jkb9ba433a0746280280`) ; lun. 02/11 12:30 X (visio, ligne notée) | Tout texte neuf passe l'aveugle (recette §5 (3) et (4)) | Le renvoi « Les autres exemples, et comment trouver le tien : » est classé NEUF par le script (`lot-1b.md` l.21). Il n'apparaît dans aucun `*-resultat.md`. Ce n'est pas la formule v5 (l.32 : « Les 4 autres exemples, et comment trouver le tien : », avec le nombre). La relecture prévue par le plan (`plan-execution-s15.md` l.87, échéance 08/10) n'a pas eu lieu. Le passage « méthode » (« comment trouver le tien ») n'est vérifié que pour l'article colocation (`complements-lot-s15.md` l.62). | Faire relire à l'aveugle (2 relecteurs, barre 8,5) la variante retenue « D'autres exemples, et comment trouver le tien : » (`complements-lot-s15.md` l.59). Avant, vérifier le passage méthode dans `premier-message-drole-appli-de-rencontre` et dans `humour-en-visio-reunion-en-ligne`. Là où il manque, utiliser « D'autres exemples : ». Si la formule ne passe pas l'aveugle, appliquer le repli du 1a (`aveugle-remplacements-cycle8-resultat.md` l.7) : le post part sans renvoi ni lien. |
| E3 | lun. 19/10 19:30 IG (concert, L38) ; jeu. 29/10 19:30 IG (TGV, L24) ; lun. 02/11 19:30 IG (théâtre, L19) | Tout texte neuf passe l'aveugle ; le renvoi doit être vrai | Les légendes L38, L24 et L19 sont retenues (`aveugle-1b-repli-resultat.md` l.10, l.11 et l.54). Le renvoi « Les autres exemples : lien en bio. » n'a jamais été noté : les consignes disaient « il n'est pas à noter » (`aveugle-1b-repli.md` l.11, `aveugle-1b-legendes-r5.md` l.11). Il est classé NEUF (`lot-1b.md` l.22 à 24). Il est aussi faux : aucune des 3 vannes ne vient de l'article (« Aucune ligne de l'article disponible »), alors que « Les autres » dit le contraire (`complements-lot-s15.md` l.55). | Remplacer par « D'autres exemples : lien en bio. » (`corrections-cycle7-copy.md` l.64, `complements-lot-s15.md` l.60) après une relecture à l'aveugle, faite avec E2. Si la formule ne passe pas, la légende part seule (« À envoyer à la sœur qui a « vu » Beyoncé. », « À envoyer à l'ami toujours à 2 % de batterie. », « À envoyer à la tante qui applaudit trop tôt. »). C'est déjà le repli prévu par le lot quand les liens de bio manquent. |
| E4 | jeu. 22/10 12:30 IG, relais-ig-22-10 (`message-anniversaire-drole-par-situation#13`) | Lignes d'article notées au niveau seulement ; règle d'or [P0 s18] ; chaque légende est « retenue » à l'aveugle ; tournure différente d'un post IG au suivant (`corrections-cycle7-copy.md` §3) | (a) La ligne n°13 est notée « = » puis « < », donc `auNiveau: false` (`lignes-articles-notes.json` l.21). Son remplacement était demandé par `corrections-cycle8-copy.md` l.88 et n'a pas été fait. (b) La légende « À envoyer à ton hôte d'anniversaire. » vient de `corrections-cycle7-copy.md` l.70 et n'apparaît dans aucun `*-resultat.md`. (c) « ton/ta » revient deux jours de suite, le 22/10 puis le 23/10 (« ton ami »), ce que le lot signale (l.70). | Servir la ligne n°4, au niveau (« = / = », l.12). Carte 1 : « J'ai relu mon discours dans le métro ce matin. Une dame a changé de wagon. » Carte 2 : « Je garde la version courte : joyeux anniversaire. » Remplaçante si le registre des 90 jours la refuse : la n°11 (l.19). Le renvoi « Les 20 autres textes : lien en bio. » ne change pas. Commander 3 légendes et les faire relire à l'aveugle (barre 8,5). Contraintes : 44 caractères au plus (80 moins les 36 du renvoi), ni « ton/ta » (le 23/10) ni « qui » en tête (le 21/10), donc « celui qui », « celle qui » ou un article défini. |
| E5 | mer. 28/10 12:30 IG, vanne V050 (`cs14jk7911857c4ff09eb025`, homonyme) | Chaque légende est « retenue » à l'aveugle ; tournure différente d'un post IG au suivant | La légende « À envoyer à ton homonyme. » vient de `corrections-cycle7-copy.md` l.46 et de `complements-lot-s15.md` l.92. Elle n'apparaît dans aucun `*-resultat.md` : le créneau du 16/10, pour lequel elle avait été écrite, est passé au détecteur de fumée avant la relecture du 1a. « ton/ta » revient deux jours de suite, le 27/10 (« ton tuteur ») puis le 28/10, ce que le lot signale (l.71). | Commander 3 légendes et les faire relire à l'aveugle (barre 8,5, vanne en contexte), en même temps que E4. Contraintes : 80 caractères au plus, sans renvoi (case vanne), ni « ton/ta » (le 27/10) ni « l'ami » (le 29/10). |

**Après correction** : régénérer le dry-run (révision 7). La section « Textes NEUFS » doit compter **0** texte, comme pour le 1a. Ensuite, je revérifie uniquement E1 à E5.

## Contrôles passés (46 posts)

**Choix de Thomas**
- **Tiret cadratin, prix, « gratuit », compte, abonnement, Premium** : Grep sur `lot-1b.md`, 0 occurrence dans les 46 textes.
- **R6 et compte = site** : sur les 19 posts X et les 8 posts LinkedIn, chaque phrase à la 1re personne est entre « ». Les conseils, les légendes et les relais LinkedIn sont au « tu ». Les « je » des cartes de conseil (K42, K07, K27) sont tous dans des « ».
- **LinkedIn** : 0 conseil. Les 8 posts se répartissent en 3 vannes (20/10, 22/10, 27/10), 1 situation (L2) et 4 relais. Les relais R08, R07 et R02 sont retenus à 8,5 et plus chez les 2 relecteurs. Aucun « Le truc : » ni morale. Le régime du 03/11 (v5 l.31 : « LinkedIn sans vanne = 2e relais de la semaine ») couvre les 2 relais des semaines du 02/11 et du 09/11.

**Contenus validés, mot pour mot**
- **14 conseils** : K04, K07 et K09 (`aveugle-1b-formats.md`) ; K22, K25, K26, K27, K28, K30 et K36 (`-t2.md`) ; K42, K53 et K59 (`aveugle-1b-repli.md`) ; K76 (`-repli-t3.md`). Pour les conseils IG, surtitre, cartes et légende sont identiques.
- **Relais LinkedIn** : R08, R07 et R02, identiques à `aveugle-1b-linkedin.md`.
- **Posts signés par Thomas** : X3 (avec la formule quiz du 06/10), X2, IG1 et L2, identiques à `validation-thomas-s15.md`.
- **Légendes retenues** : L38, L29, L24, L19, L20 et L31 (`aveugle-1b-repli-resultat.md`), R07 du 21/10 et R01 du 30/10 (`aveugle-remplacements-cycle8-resultat.md`). La légende du 26/10 est écrite dans la v5 (§8), validée par Thomas le 05/10.
- **Vannes tirées** : les 15 sont dans `POOL_STRICT` (`social-pool.ts`, 15 sur 15).
- **Lignes d'article** : colocation n°1, visio (rang 1, reconnue par son texte) et couple n°5 sont `auNiveau: true`. Halloween n°3 et le relais X du 26/10 sont des posts fixes de la v5 (§3). Seule exception : la n°13 d'anniversaire (E4).

**Cohérence**
- **Doublons** : aucun `sourceId` en double sur les 46 posts.
- **Renvois chiffrés** : X2 annonce « 21 messages » et l'IG du 22/10 « 20 autres », pour 21 rangs dans l'article. Les relais du 26/10 portent « 5 autres » sur X et sur IG (article de 6 vannes). Couple : « 29 autres » sur X (ligne de l'article), « 30 vannes » sur IG (vanne du catalogue).
- **UTM** : conformes à la v5 l.47. `utm_campaign` vaut 2026-10 ou 2026-11 selon le mois ; `utm_content` vaut lundi, jeudi, quiz, saison (30/10) ou relais (LinkedIn).
- **Légendes Instagram** : 19, aucune URL.
- **Cadence** : 5/5/2 les semaines du 19/10, du 26/10 et du 02/11, puis 4/4/2 la semaine du 09/11 à cause du silence du 11/11 (calendrier v5, `plan-execution-s15.md` l.139). Aucun dimanche.

## Points de vigilance (non bloquants)

- **V1, X mar. 20/10 (chargeur, `cs14jke10b58d158ae638560`)** : c'est aussi le repli Instagram du 12/10 dans le lot 1a (`lot-relance-s15.json` l.284 à 307, REJECTED tant que le repli n'est pas déclenché). Si l'article `se-presenter-avec-humour` n'est pas en ligne le 12/10 à 19:30, la même vanne repasse 8 jours plus tard. `--insert`, qui régénère le lot puis le compare au JSON, refusera l'insertion dans ce cas. Relire le statut de ce repli avant d'insérer et régénérer le lot s'il a été publié.
- **V2, IG mer. 28/10 (V050)** : la vanne est au pool strict (8,5 / 8,5 au stock). Elle a pourtant eu 6,5 / 6,5 en contexte de relais au cycle 8 (R03, « chute devinée »). Conforme sur la forme ; je le signale pour la relecture de E5.
- **V3, en-tête de `lot-1b.md` (l.5)** : la ligne d'insertion lit `lot-relance-s15.json`, et la ligne d'annulation n'a pas de bornes de dates. Utiliser uniquement la commande de la révision 6 (`--json ../../docs/social/preparation/lot-1b.json`). @fullstack corrige le gabarit d'en-tête du script.
- **V4, aucun carrousel sur les 4 semaines** : le 28/10 et le 04/11 passent en carte vanne. Le repli « sans citation » est prévu par la v5 l.33, et C3 est gardé pour le 18/11. Aucun humoriste n'est cité dans ce lot.
- **V5, cartes et légendes qui ne disent pas la même chose** : K30 (légende « absolument », carte « effectivement ») et K76 (légende « discours du chef », carte « le prof »). Les deux ont été retenues ainsi à l'aveugle : ce ne sont pas des écarts.
- **V6, 14 relais sans repli libre** : si l'article n'est pas en ligne à l'heure, le créneau reste vide. Les articles sont programmés en base (`founder-preferences.md` l.49).

## Handoff → session principale

- **Fichier produit** : `docs/social/preparation/controle-reviewer-lot-1b.md`.
- **Décision** : NO-GO pour l'insertion du 1b.
- **Agents à relancer** : @fullstack pour E1, E4 et la régénération ; @copywriter et 2 relecteurs à l'aveugle pour E2, E3, E4 (légende) et E5.
- **Ensuite** : je revérifie uniquement E1 à E5.
