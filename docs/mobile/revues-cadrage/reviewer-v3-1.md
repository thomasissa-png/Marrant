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

## 4. Corrections OBLIGATOIRES restantes (bloquantes pour 9/10)

**NO-A. Le changement de thèmes contredit le gel de l'assignation (nouveau en v3.1).**
Emplacement : §3.2 l.83 contre l.85 ; tests du §7 l.209 (« changement de thèmes »).
Constat : l.83 dit l'assignation « figée face aux mouvements du pool (filtre des 7 jours du site, nouveaux lots, thèmes au-delà de J+2) » et « réécrite une seule fois, par mise à jour de la ligne, sur retrait qualité seulement ». l.85 dit « changer de thèmes réécrit seulement J+1 et J+2 non envoyés, au plus une fois par jour et par installation ». Les deux ne peuvent pas être vrais : soit un changement de thèmes touche J+1 et J+2, soit seul le retrait qualité réécrit. Et avec la l.85, une même ligne J+2 peut être réécrite le jour J (comme J+2), puis le jour J+1 (comme J+1), puis sur retrait : pas « une seule fois ». C'est le modèle que @fullstack implémente au lot 5b-0 (correction F-O3-4 du tour 4), et le test « changement de thèmes » n'a pas de résultat attendu.
Conséquence chiffrée : le risque résiduel de la l.85 (« au plus 3 défis d'avance », 90 par IP et par jour) ne tient que si les thèmes ne réécrivent rien. Avec la l.85 telle quelle, une installation reçoit jusqu'à 5 défis par jour (J à J+2 préchargés, puis J+1 et J+2 réécrits et rechargés), soit 150 par IP et par jour avec 30 créations. C'était mon SOU-2 de la v3, déclaré « non repris » au §16 : il devient obligatoire parce que la v3.1 l'écrit dans la même puce que la règle.
Correction : choisir une règle et l'écrire aux deux endroits. Soit « réécrite sur retrait qualité, ou sur changement de thèmes pour J+1 et J+2 non envoyés (une fois par jour) », avec un plafond recalculé (5 défis par installation et par jour, 150 par IP) et le résultat attendu du test du §7 ; soit les thèmes ne prennent effet qu'à J+3, la l.85 est retirée et « au plus 3 » reste juste.

**NO-B. Le résultat de la règle de GO de 8 bis est laissé ouvert par un [À VÉRIFIER] que la grille tranche.**
Emplacement : §5.1 l.183 (« [À VÉRIFIER : moyenne sur les 7 critères, à relire dans les panels v2] »).
Constat : la grille classe C1, C2, C4, C5, C11 en binaires (B) et C9, C10 en notés (N) (`attentes-utilisateur.md` l.38, l.41-51) ; la règle d'étape porte sur « la moyenne des critères notés » (l.54). Sur les 7 critères du cadrage, seuls C9 et C10 ont une note : une « moyenne sur les 7 critères » n'existe pas. La légende du cadrage (l.6) réserve [À VÉRIFIER] à ce que « ni le code ni une source primaire ne tranche » ; ici la source tranche, et les panels v2 sont dans le dépôt. Tant que la marque reste, Thomas ne sait pas si le cadrage est aujourd'hui GO ou NO-GO selon la méthode qu'on lui propose.
Correction (deux lignes) : « critères notés retenus : C9 et C10 (les cinq autres sont binaires) » ; « avec les notes du tour 3 : Sophie 8,5 (C9 9, C10 8, `panel-sophie-v2.md` l.17-18), Yanis 7,5, Marc 7,5 : NO-GO de l'étape cadrage, à lever par C10 de Yanis (lot 3b et extrait réel) ». Retirer le [À VÉRIFIER]. Même précision dans la décision 8 bis (l.299).

**NO-C. Numérotation des décisions (§14) et du §4 faussée au rendu Markdown.**
Emplacement : l.291-308 ; l.154-160.
Constat : voir §3 ci-dessus. Les numéros manquants ne sont pas des trous de fond, mais la liste renumérotée à l'affichage rend faux tous les renvois « décision N » pour le lecteur du rendu, qui est celui qui décide.
Correction : sortir les numéros du mécanisme de liste (au choix : `**1.**` en gras en tête de ligne, `1\.` échappé, ou un tableau « N° | Décision | Reco | Alternative ») et donner une ligne propre à 2, 12 et 16 (« **2.** Identifiant : voir 1. » ; « **12.** Storefronts : francophones d'abord (alt. monde entier), voir 11. » ; « **16.** Suppression : … » sur sa ligne). Même traitement au §4 (« **7.** États transverses » sur sa ligne).

## 5. Corrections SOUHAITABLES

**SOU-A. Provenance des tailles de pools (l.5).** « recomptées à l'identique par la revue v3 » : ma revue v3 a refait les additions (149, 40, 26) et comparé au catalogue, elle n'a pas relu la base. Écrire « additions vérifiées par la revue v3 ». Les chiffres eux-mêmes sont justes (`fullstack-v2.md` l.57-61).
**SOU-B. B représente aussi le thème boulot (l.39).** La parenthèse dit « A et B pour le tout public » alors que B (BOULOT) est aussi le seul exemple du thème boulot du §3.2. Écrire « B pour boulot (aussi dans les 93) ».
**SOU-C. Vie étudiante toujours sans exemple (l.39).** Raison donnée : « sa vanne sera lue en base au lot C(a) ». Or les 4 vannes ECOLE du catalogue ont leur amorce et leur chute copiables et sont dans les 93 ; seuls les deux champs manquent, lus le même jour pour A à D. Le thème ajouté pour Yanis, persona principal, reste le seul que le panel ne voit pas. Recevable en l'état, mieux avec l'exemple.
**SOU-D. Vanne de repli embarquée (l.86).** « une vanne tout public embarquée dans le build et relue » n'est rattachée à aucun lot (choix, relecture). L'ajouter au lot 3a (ou 1a) pour que le build 0 ne l'invente pas au dernier moment.
**SOU-E. Arêtes du plan.** (a) C(d1) l.272 pose « avant le lot 8, un thème qui ne tient pas l'horizon n'est pas proposé à l'écran 2 », mais la ligne du lot 8 (l.281) n'a pas cette condition : ajouter « contrôle des thèmes de C(d1) » à ses dépendances. (b) §15 l.311 met la décision 19 avant 5b-0 ; la ligne 5b-0 (l.278) ne la cite pas.
**SOU-F. Accroche neutre en deux lots.** Lot 3a (l.275) « accroche neutre » et §3.5 l.140 « accroche neutre du widget : lot 3c ». Dire si c'est le même texte (alors 3a seul) ou deux textes (notification en 3a, widget en 3c).
**SOU-G. Mes souhaitables v3 non repris (§16 l.334, assumé).** Toujours ouverts et toujours utiles : SOU-3 (« si décision 4 » à l.155 et l.158), SOU-5 (§9.1 l.234 cite encore la « newsroom Apple 18/08/2026 » comme source alors qu'elle n'a pas été lue), SOU-6 (décryptage de A qui parle de « ta cuisine », écrit pour l'ancienne amorce : à mesurer au lot C(a)). La ligne l.334 range aussi dans les « non repris » SOU-4 et SOU-7, qui sont en fait traités (l.88 « si décision 7 bis = B » ; l.39 pour vie étudiante) : ajuster la traçabilité.

## 6. Ce qui relève de Thomas (pas un défaut)

§1 (5 questions, étalons), décisions 1 à 19 sur le fond, dont la 8 bis (méthode) et les nouvelles 18 (bascule à 4 h de `nextStreak`, avec ce qu'elle change côté site) et 19 (horizon d'inactivité, repères @legal et @fullstack cités, à fixer avec l'avocat) : chacune a sa reco, son alternative et son risque. Les seuils de limite (10 par heure, 30 par jour), la règle de mélange, la réserve de 7 et la bascule à 4 h sont des [HYPOTHÈSE] marquées : normal à ce stade.

## 7. Ce qui est solide (à ne pas casser)

- §2.1 : 4 vannes recopiées au caractère près, champs lus en base, règle de choix désormais honnête ; constat « consignes de fabrication » tiré des vrais textes.
- §3.2 : route publique de création nommée et distincte de `/push`, secret de 32 octets en empreinte SHA-256 et comparaison en temps constant, marqueur hors trousseau contre la survie du trousseau iOS, purge en cascade, effacement depuis Profil, repli sans écran vide.
- §3.3 : `pratique` jamais en file hors ligne, unicité par compte et jour de Paris, 409 hors assignation, quatre tests Jest nommés.
- §3.6 et lots C : chaîne du défi par lot en session, sans job qui produit, [CHOIX UTILISATEUR] du 30/09 et du 01/10 cités ; import par identifiant avec empreinte.
- §5.1 : GO contenu-0 avant le build 0, GO contenu-1 avant les lots 10 et 13, risque « un GO du cadrage ne vaut pas GO du contenu » dit.
- Zéro tiret cadratin (0 occurrence), aucune durée en semaines, widget bien EN LIGNE (`widget-vanne-du-jour.ts` l.18 : `true`), chiffres H-stock justes (3 × 9, 3 × 5, 3 × 26, 3 × 29).

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/reviewer-v3-1.md`
- Verdict : NO-GO pour 9/10, note **8,5/10** (v3 : 8,5). N1, N2, N3 levées ; N4 partielle. Numéros 2, 12 et 16 du §14 : fusion assumée et renvois cohérents dans le texte, mais numérotation faussée au rendu Markdown
- **3 obligatoires, toutes de rédaction** : NO-A (gel de l'assignation contre réécriture au changement de thèmes, et plafond de défis qui en découle), NO-B (retirer le faux [À VÉRIFIER] de §5.1, écrire C9 et C10 comme critères notés et le résultat NO-GO actuel), NO-C (numéros du §14 et du §4 hors mécanisme de liste, lignes propres pour 2, 12 et 16) ; 7 souhaitables
- Agent à relancer : @product-manager (v3.2, corrections ciblées). Aucune décision de Thomas rouverte ni requise pour lever NO-A à NO-C
---
