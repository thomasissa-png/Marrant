# Relecture à l'aveugle du cadrage v3.1 de l'app iPhone : @reviewer (tour 5)

> Livrable relu : `docs/mobile/cadrage-app-native-s23.md` (v3.1, 04/11/2026, @product-manager, 340 lignes).
> Relu contre : ma revue `reviewer-v3.md` (N1 à N4, SOU-1 à SOU-7), la grille `docs/mobile/attentes-utilisateur.md` (l.38-54), les panels v2 (`panel-yanis-v2.md`, `panel-marc-v2.md`, `panel-sophie-v2.md`), `fullstack-v2.md` (origine des chiffres de pools), `apps/web/src/config/widget-vanne-du-jour.ts`.
> Revues v3.1 des autres relecteurs non lues. Aucun fichier modifié hors de celui-ci, rien commité. Le §1 en attente de Thomas, les [PROVISOIRE] et les décisions correctement posées ne sont pas pénalisés.
> Mesure de l'écart (P0 s11), à la lecture : §2.1 l.39 et l.54 réécrites (règle de choix), en-tête l.5, §15 l.311, §3.5 l.140, §4 l.159, lot 3a l.275, §5.1 l.183, décision 8 bis l.299, §3.2 l.82-86 (route de création, limite, purge, effacement), §3.3 l.120, décisions 18 et 19, §16 l.330-334. Retouche ciblée, conforme à l'annonce « corrections de rédaction seulement » (l.7).

## 1. Notes

| # | Critère | v3 | **v3.1** | En une ligne |
|---|---|---|---|---|
| 1 | Cohérence interne et avec le projet réel | 8,5 | **8,5** | N2 et N3 levées. Mais la v3.1 introduit une contradiction dans le modèle d'assignation : figée sauf retrait qualité (l.83) contre réécrite au changement de thèmes (l.85) (NO-A) |
| 2 | Conformité aux préférences fondateur | 9 | **9,5** | [CHOIX UTILISATEUR] du 24/10, du 30/09 et du 01/10 explicitement non rouverts (l.102, l.147) ; P0 s8, s11, s18 tenus ; 0 tiret cadratin |
| 3 | Zéro donnée inventée, sources, [À VÉRIFIER] justifiés | 8,5 | **9** | N1 levée : règle de choix honnête (« choix éditorial, sans ordre ni tirage »). Reste un [À VÉRIFIER] que la grille tranche déjà (NO-B) et une provenance un peu flatteuse (SOU-A) |
| 4 | Complétude du périmètre V1 | 9 | **9** | Route de création nommée (SOU-1 v3 traitée), purge et effacement depuis Profil ajoutés. Petits résidus : vanne de repli embarquée sans lot (SOU-D) |
| 5 | Clarté des décisions laissées à Thomas | 8,5 | **8,5** | Règle de GO de 8 bis écrite, mais son résultat reste ouvert par un faux [À VÉRIFIER] (NO-B) ; numérotation du §14 qui se décale au rendu Markdown, renvois « décision N » faux à l'écran (NO-C) |
| 6 | Plan par dépendances exploitable | 8,5 | **9** | N3 levée (4 états du build 0 au lot 3a, lot 7 dépend de 3a). Résidus non bloquants : critère « avant le lot 8 » de C(d1) sans arête dans le tableau, décision 19 absente de la ligne 5b-0 (SOU-E) |
| | **Note globale** | 8,5 | **8,5 / 10** | NO-GO pour 9/10, de très peu : N1, N2, N3 levées, N4 aux trois quarts. 3 corrections obligatoires, toutes de rédaction (une à trois lignes), aucune ne demande une décision de Thomas |

## 2. Statut de N1 à N4 (vérifié dans le texte, pas dans le §16)

| v3 | Sujet | Statut | Preuve dans la v3.1, et réserve |
|---|---|---|---|
| N1 | Règle de choix des vannes du §2.1 | **Levée** | l.39 : « Choix éditorial : une vanne lisible par thème, sans ordre ni tirage (A et B pour le tout public, C pour soirées, D pour couple et dates) ; ce n'est pas un échantillon, le tirage au hasard est au lot C(e) ». Plus aucune règle « première du catalogue » ; l.54 : `cs19jkboulot1` « non retenue » faute de source copiable, substituable à B après lecture (plus « écartée au profit de B »). Réserve de forme : B est aussi l'exemple du thème boulot, non nommé dans la parenthèse (SOU-B) |
| N2 | Accès à la base, en-tête et §15 | **Levée** | l.5 : la session a lu elle-même les 4 vannes ; tailles des pools reprises de @fullstack v2 (vérifié : `fullstack-v2.md` l.57-61, chiffres identiques). §15 l.311 : la lecture des vannes A à D n'est plus un bloquant. Réserve : « recomptées à l'identique par la revue v3 » surestime ma vérification (SOU-A) |
| N3 | Messages des états du build 0 | **Levée** | §4 l.159 : 4 états du build 0 au lot 3a, 4 autres au lot 3c ; §3.5 l.140 idem ; lot 1a l.273 (contenu retiré ajouté) ; lot 3a l.275 (« messages des 4 états du build 0 ») ; lot 7 l.280 dépend de 3a et de GO contenu-0, qui couvre les textes 3a |
| N4 | Règle de GO de la décision 8 bis | **Partielle** | Levé : règle écrite (§5.1 l.183, décision 8 bis l.299), C9 de Marc reconnu au seuil, blocage par la moyenne (Yanis et Marc à 7,5) juste au regard des panels v2 (Yanis l.33-34, Marc l.31-32), réserves corrigées (C5 et C11 chez Marc, C1 et C11 chez Sophie : `panel-sophie-v2.md` l.25). Reste : « [À VÉRIFIER : moyenne sur les 7 critères, à relire dans les panels v2] » rouvre la question que N4 devait fermer ; la grille la tranche (NO-B) |

## 3. Numérotation du §14 (numéros 2, 12 et 16)

| Numéro | Ce que dit le texte | Renvois ailleurs | Verdict sur le fond |
|---|---|---|---|
| 2 | « 2. voir 1. » en fin de ligne de la décision 1 (l.291) ; l'identifiant y est bien traité | §10 l.245 « (décision 2) », lot 0 l.268 « Décisions 1, 2, 8 » | Fusion assumée, renvois cohérents |
| 12 | Seulement « storefronts francophones d'abord (12) » dans la décision 11 (l.302), alternative « monde entier » dans la même ligne | §3.2 l.113 « décision 12 : storefronts », §10 l.247 « storefronts (décision 12) » | Fusion de fait, mais le numéro n'apparaît qu'entre parenthèses : un lecteur qui cherche « 12. » ne le trouve pas |
| 16 | « 16. **Suppression** » au milieu de la ligne de la décision 15 (l.305) | §9.5 l.238 « (décision 16) » | Fusion assumée, renvoi cohérent |

**Sur le fond : pas de trou**, les trois décisions existent et chaque renvoi pointe vers le bon contenu dans le texte brut. **À l'affichage : défaut réel** (NO-C). Les lignes l.291 à l.308 forment une seule liste ordonnée Markdown ; en CommonMark (GitHub, Obsidian, aperçus), seul le premier numéro est lu, les suivants sont renumérotés 2, 3, 4… Rendu : « 3. Achat » s'affiche « 2. », la décision 5 s'affiche « 4. », la 18 « 15. », la 19 « 16. ». « 7 bis » et « 8 bis » ne sont pas des marqueurs de liste : ils se collent au paragraphe des décisions 7 et 8. Tous les renvois « décision N » du document (§1, §3.2, §3.3, §9, §13, §15) deviennent faux pour qui lit le rendu, c'est-à-dire Thomas. Même mécanisme au §4 (l.154-160) : « 8. Widget » s'affiche « 7. », et « 7. États transverses » est en milieu de ligne, donc les renvois « §4.7 » et « §4.8 » du §16 (l.322, l.330) ne correspondent plus à l'écran.
