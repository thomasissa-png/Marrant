# Revue à l'aveugle du pack d'étalons de l'app, @reviewer v2 (s23, 04/11/2026)

> Objet : `docs/mobile/etalons-app-s23.md` v2 (7 étalons, 3 options chacun, reco et ligne « Revenu : »), contre ma revue `reviewer-v1.md` (7/10, 19 corrections obligatoires O1 à O19, 15 souhaitables S1 à S15).
> Lu : `CLAUDE.md`, `docs/founder-preferences.md` (en entier, 149 lignes), `docs/copy/ton-alex.md`, cadrage `cadrage-app-native-s23.md` §1, §2.1, §3 (3.1 à 3.6), §4, §9. Aucune autre revue ni `panel-v1.md` lus (relecture à l'aveugle) : les phrases du pack attribuées au panel sont jugées sur leur cohérence avec le cadrage seulement.
> Vérifications : Grep tiret cadratin et demi-cadratin (0), mots interdits du §3.5 (1 occurrence à l'écran, N4), « tout haut » / « à voix haute » (seulement la ligne fixe) ; comparaison mot à mot de 2C et du rappel des vannes avec le §2.1 (exacts ; “ ” au 2e niveau conforme au choix du 05/10) ; recomptage à la main de toutes les longueurs de l'étalon 3 (toutes justes : 90, 109, 33, 42, 70, 36 ; seuil de 87 caractères pour B exact) et des défis de l'étalon 1 ; WebSearch sur les paliers de prix Apple en euros.

## Résumé pour Thomas (sans jargon)

Les 19 corrections du premier tour sont toutes faites, au mot près, et le pack couvre maintenant les 5 étalons que le cadrage exige. Il est presque prêt, mais pas encore à 9. Ce qui coince : à l'écran des thèmes, on laisse croire que la vanne du lendemain collera à ta situation, alors qu'avec 9 vannes « soirées » ce ne sera qu'un jour sur trois. La reco de l'étalon 6 change sans le dire une décision du cadrage (l'offre au 8e « Garder »). Une ligne de l'offre promet « toutes les vannes avec leur défi » avant que les défis existent. Deux des trois suites d'aide de la vanne A redisent la vanne au lieu de la prolonger. Le plafond de 150 caractères ne marche que pour l'option A. 10 corrections, toutes courtes, avec le texte exact plus bas.

## Notes (barre 9)

| # | Critère | v1 | v2 | Motif principal |
|---|---|---|---|---|
| 1 | Options utilisables telles quelles et différentes | 7 | 8,5 | Options vraiment différentes sur les 7 étalons, écran d'offre complet. Mais la place de l'« accroche d'angle » (4A, 4C) n'est pas définie sur l'écran (N5) ; la phrase d'ouverture de l'étalon 1 annonce un défi par situation, « coloc » comprise, qui n'existe pas (N2). |
| 2 | Défis faisables en 30 s, fidèles | 6,5 | 8,5 | O1 à O7 levées : ligne fixe « À voix haute ou dans ta tête », 1A-B et 1B-C justes. Restent : plafond de 150 incompatible avec B (jusqu'à 166) et C (plus de 230), alors que la question le pose pour toutes les options (N1) ; suites A+ de la vanne A hors de leur amorce (N3). |
| 3 | Ton d'Alex, tutoiement, zéro tiret, zéro mot interdit | 8 | 9 | Zéro tiret, guillemets imbriqués corrigés, plus de 1re personne nue en notification. « en cours » à l'écran (N4) ; deux accords non épicènes en options non recommandées (SW3, SW4). |
| 4 | Exactitude, rien d'inventé, rien de contraire aux choix | 6 | 8 | 2C exact, comptes justes, plus de délai implicite, « tout ouvert » du 19/10 tenu. Mais : promesse de thèmes fausse (N8), décision 6 modifiée sans le dire (N9), « toutes les vannes avec leur défi » conditionnelle (N6), palier de prix Apple non signalé (N7). |
| 5 | Recos motivées, questions claires | 7 | 8,5 | Recos argumentées, chacune avec ce qui ne se départage qu'en TestFlight. Reco 5 sur une prémisse fausse (N8), reco 6 qui prête au panel un refus que le cadrage situe au 1er « Garder » (N9), reco 4 qui avance un plafond de 8 au panel sans en tirer la conséquence (N10). |
| 6 | Orientation revenu sans pression | 7 | 9 | Ligne « Revenu : » sous les 7 recos, aucun prix en notification, aucun compte à rebours, lettre de la semaine sur l'écran d'offre. Revenu 5 repose sur la même promesse fausse que N8. |
| | **Globale** | **7** | **8,5** | **NO-GO pour la séance en l'état. Après N1 à N10 : relecture des seuls passages modifiés.** |

Points forts à garder : intégration littérale des 19 corrections et des 15 souhaitables ; écran d'offre enfin complet (prix, renouvellement, restauration, liens, lettre, extrait réel marqué) ; « Aucune ligne de remboursement » (exact pour un achat Apple, §9.2) ; étalon 7 B (voie privée vraie, §3.1) ; reco 7 qui écarte A parce qu'elle redit la ligne fixe ; marques [EXTRAIT RÉEL À PRÉLEVER] et [À VÉRIFIER @legal] justifiées.

## Statut O1 à O19

| # | Objet | Statut | Évidence dans la v2 |
|---|---|---|---|
| O1 | « à voix haute » imposé | Levée | l. 15 ligne fixe ; défis A l. 18-21 au mot près ; « tout haut » absent (Grep) |
| O2 | libellé B en doublon | Levée | l. 30 « Et chez toi ? » |
| O3 | 1A-B trahit la vanne B | Levée | l. 19 au mot près |
| O4 | 1B-C prémisse fausse | Levée | l. 33 au mot près |
| O5 | option C et barre Alexa | Levée | l. 41 au mot près |
| O6 | plafond et types | Levée, avec réserve | l. 43 et 45 ; mais le plafond ne vaut que pour A : voir N1 (défaut issu de ma propre formulation v1, calée sur A) |
| O7 | « 15 s » inventé | Levée | l. 43 |
| O8 | lettres des options | Levée | l. 49 |
| O9 | 2C-A copie exacte | Levée | l. 60 = §2.1 l. 49, mot à mot |
| O10 | 2A-D ambiguë | Levée | l. 53 |
| O11 | 1re personne en notification | Levée | l. 70, 73, 77 ; comptes 90 et 109 recomptés justes |
| O12 | titre contradictoire | Levée | l. 70 et 84 |
| O13 | 4A, 4C en sous-ensemble | Levée | l. 101-103 et 112-114 au mot près, « le tri » retiré |
| O14 | délai implicite | Levée | l. 103, 114, 115 |
| O15 | accroche de 4B | Levée | l. 91, devenue accroche commune aux 3 options |
| O16 | lettre de la semaine | Levée | l. 96 |
| O17 | « quatre moments » | Levée | l. 117 : vrai désormais, grâce à « avec leur défi » (S11) ; mais voir N6 |
| O18 | ligne « Revenu : » | Levée | l. 44, 65, 85, puis 118, 140, 163, 183 |
| O19 | lot 3a débloqué trop tôt | Levée (autrement) | étalons 5, 6, 7 ajoutés ; handoff l. 189 bloque les lots 3a et C(c) |

Souhaitables S1 à S15 : toutes intégrées. Deux m'étaient imputables : S4 (« t'aurait enregistré », non épicène, SW3) et O6 (N1).

## Top 3

1. **N8 (étalon 5)** : l'écran des thèmes et sa reco promettent une vanne du lendemain « qui te ressemble », alors que tous les thèmes sont sous 90 vannes (§3.2 : un jour sur trois). Sophie qui coche « soirées » le verra dès le 2e jour.
2. **N9 (étalon 6)** : la reco A déplace l'écran d'offre du 8e « Garder » (décision 6 du cadrage, recos suivies le 04/11) au second toucher, sans le dire, sur l'écran qui fait le revenu.
3. **N6 + N10 (étalon 4)** : une ligne de l'offre vraie seulement quand tout le catalogue aura son défi, et une reco qui annonce 8 au mieux au panel sans le présenter comme un écart à la barre de 9.

## Nouvelles corrections OBLIGATOIRES (texte exact)

**N1. Étalon 1, plafond valable pour A seulement (l. 43 et 45).** Recompté : défis A de 86 à 117 caractères (guillemets compris), B jusqu'à 166 (1B-A), C plus de 230 (1C-A). Poser « 150 par défi » pour toutes les options contredit B et C tels qu'écrits. L. 43, remplacer « Plafond proposé : 150 caractères par défi, aide exclue, mesuré au lot C(a). » par : « Plafond proposé pour A : 150 caractères par défi, aide exclue (les quatre défis A font de 86 à 117) ; mesuré au lot C(a). B (jusqu'à 166) et C (plus de 230) le dépassent : si tu retiens B ou C, plafond à refixer sur l'option. » L. 45, remplacer « Et un plafond de 150 caractères par défi te va ? » par « Et, si c'est A, un plafond de 150 caractères par défi te va ? »

**N2. Étalon 1, phrase d'ouverture inexacte (l. 15).** « Chaque défi existe pour chaque situation (coloc, boulot, date, soirée) » laisse croire à quatre variantes par défi (coût multiplié par quatre) et cite une « coloc » qui n'existe ni dans les quatre vannes ni dans les thèmes (§2.1 l. 57, §3.2). En production, une vanne a un seul `defi30s` (§3.6). Remplacer la phrase par : « Les quatre exemples couvrent quatre situations (chez soi, boulot, soirée, date) ; en production, chaque vanne a un seul défi, dans sa propre situation (§3.6), pour que chaque thème coché reçoive des défis qui lui parlent (panel, C7). »

**N3. Étalon 1, suites A+ de la vanne A (l. 24).** L'amorce parle d'un service d'hygiène et d'une cuisine « dans un tel état » ; deux suites sur trois ramènent les pompiers et la cuisson de la vanne d'origine (la suite redit la vanne au lieu de la prolonger), et « On est sortis vivants » est un avis-type déjà lu partout (vanne déjà connue = faible, choix du 29/09). C'est l'exemple que Thomas lira pour juger A+ : il doit être au niveau. Proposition, à relire à l'aveugle comme les 11 autres (mention « textes de calibrage, pas validés » inchangée) : « Une étoile : “Même les fourmis ne reviendront pas.” » / « Deux étoiles : “On a retrouvé l'évier.” » / « Trois étoiles : “Personnel accueillant, surtout les moisissures.” »

**N4. Étalon 1, mot interdit à l'écran (l. 25).** « en cours » tombe sous le §3.5 (« cours ») et sous le critère binaire de relecture (« sans mot interdit relevé ») ; l'en-tête du pack (l. 5) annonce zéro mot interdit. Remplacer « on ne se regarde plus en cours. » par « on ne se regarde plus en classe. »

**N5. Étalon 4, place de l'accroche d'angle (l. 93).** L'écran « complet » liste 7 blocs, mais A et C ajoutent une « Accroche d'angle » que la liste ne place nulle part (deux titres ?). Remplacer le point 3 par : « 3. **Les 3 lignes** de l'option choisie ; pour A et C, l'accroche d'angle s'affiche juste au-dessus, en sous-titre de l'accroche commune (B n'en a pas). »

**N6. Étalon 4, ligne 1 de B conditionnelle (l. 106).** « Toutes les vannes avec leur défi » n'est vraie que lorsque chaque vanne visible dans l'app a son `defi30s` validé ; le cadrage le produit d'abord pour les pools du build 0, puis « le reste du catalogue » (§3.6 c), et exige que les lignes ne promettent rien qu'un abonné Apple ne reçoive pas (§3.4). Ajouter sous l'option B : « Ligne 1 vraie seulement si toutes les vannes de l'app ont leur défi validé à la soumission (§3.6 c) ; sinon, elle devient « Toutes les vannes, tous les conseils, toutes les vidéos. » et la reco ne couvre plus le moment (c). »

**N7. Étalon 4, palier de prix Apple non signalé (l. 94).** Le cadrage marque « Paliers 1,99 € et 16,99 € à confirmer en France [À VÉRIFIER] » (§9.1) ; la grille euro d'Apple a déjà bougé (hausse d'octobre 2022 : le palier 1,99 € est passé à 2,49 €, presse) et ma recherche n'a trouvé aucune source qui confirme un palier à 16,99 €. Ajouter après « (prix en vigueur, 24/10) » : « [À VÉRIFIER : paliers Apple en France, §9.1, lot 10 ; si un palier manque, le prix de l'app diffère du site et revient à Thomas] ».

**N8. Étalon 5, promesse de thèmes fausse (l. 127, 139, 140).** Tous les thèmes sont sous 90 vannes (§3.2 : soirées 9, couple et dates 26, boulot 29, vie étudiante 5) : la règle de mélange tire dans le thème un jour sur trois, et « soirées » s'épuise au 27e jour. « La vanne du lendemain colle déjà à la situation choisie » est faux. Remplacements :
- l. 127 : « Thèmes : « Des vannes plus proches de ta vie ? Coche jusqu'à 3 situations (facultatif). » »
- l. 139, 2e phrase : « C'est le cadrage (§4.1) : les thèmes cochés entrent dans le tirage dès le lendemain (un jour sur trois tant que le thème compte moins de 90 vannes, §3.2), et ils restent facultatifs. »
- l. 140, après « rétention des futurs abonnés ; » : « les thèmes rapprochent les vannes de la vie de la personne (un jour sur trois au départ, §3.2 ; motif de désinstallation de Yanis) et décident de l'extrait montré sur l'écran d'offre. »

**N9. Étalon 6, décision 6 modifiée sans le dire (l. 162).** Le cadrage (§3.4, recos suivies le 04/11) prévoit : « À la 8e vanne : écran d'offre (moment (a)) avec extrait réel ». A met une sortie gratuite en bouton principal et l'offre au second toucher : c'est un changement de décision, légitime dans un étalon, mais à écrire. Et le refus du panel cité contre B porte, d'après le cadrage, sur l'offre au **premier** « Garder » (§3.4 l. 126), que la réserve de 7 règle déjà. Remplacer la reco par : « **Reco : A.** La personne ne reste pas bloquée et ne se sent pas piégée (doctrine du 06/05), et « Voir Premium » ouvre l'écran complet avec extrait. A modifie le cadrage (§3.4, décision 6 : écran d'offre dès la 8e vanne) : l'offre passe au second toucher ; B est la version du cadrage et encaisse plus vite ; C offre une porte de sortie sans lien avec l'achat. Choisir A, c'est accepter ce changement. »

**N10. Étalon 4, reco sous la barre sans le dire (l. 117).** « 8 n'est atteignable qu'avec cet écran complet » présente comme un argument ce qui est un écart à la barre de 9 du 04/11 (panel de personas). Source non vérifiable à l'aveugle : la phrase doit citer sa ligne. Remplacer la 3e phrase par : « Le panel notait l'écran à 7 sans extrait réel, prix ni restauration (`panel-v1.md`, [ligne à citer]) ; avec l'écran complet, il voit 8 au mieux, sous la barre de 9 du 04/11 : écart à lire en TestFlight, que tu acceptes ou non ici. »

## Corrections SOUHAITABLES

- **SW1. Libellé de l'aide (l. 23)** : « vois trois suites » sonne traduit. « Tu sèches ? Trois suites possibles ».
- **SW2. Suites A+ faibles (l. 26, 27)** : « m'a suivi, et il a pris les glaçons pour lui » (deux « il », chute floue) et « toujours en retard d'un feu rouge » (sens obscur) ; à remplacer avant la relecture à l'aveugle de production.
- **SW3. 1B-D, accord non épicène (l. 34, issu de ma S4)** : « Invente le nom sous lequel ton pire contact a pu te ranger dans son répertoire, et dis-le très calmement. »
- **SW4. 7C, accord non épicène (l. 180)** : « tu es seul à la lire » devient « personne d'autre ne la lira ».
- **SW5. 5A, titre ambigu (l. 126)** : « Quand tu veux ta vanne ? » se lit aussi « quand tu veux » (= n'importe quand). « Tu la veux à quelle heure, ta vanne ? »
- **SW6. 5A, heure des moments** : préciser « l'heure de chaque moment s'affiche sous son libellé (fixée par @ux, lot 1a) », sinon « à l'heure choisie » suppose qu'on la connaît.
- **SW7. 5C (l. 136)** : ajouter « même pied que A », pour garder le texte qui dit ce que la permission reçoit (§4.1) et le lien Confidentialité (§9.6).
- **SW8. 4, bouton annuel (l. 94)** : écrire le libellé, « S'abonner · 16,99 €/an » (calqué sur le site, 19/10).
- **SW9. 4, extrait (l. 92)** : « fiche **non offerte** du carnet » (la fiche offerte est gratuite) ; sans thème coché : extrait tout public.
- **SW10. 4A, ligne 1 (l. 101)** : « celle qui colle » après « vannes, conseils, vidéos » : « pour trouver la vanne qui colle à ta soirée ».
- **SW11. En-tête (l. 3)** : le format de réponse doit permettre « 1A+ » (A avec l'aide).
- **SW12. Handoff (l. 190)** : avec les guillemets, la limite de 110 laisse 106 caractères d'amorce pour A, 87 pour B ; écrire la mesure ainsi.
- **SW13. 7B, @fullstack** : « il reste sur ton téléphone » reste vrai si la réponse n'est jamais envoyée au serveur (§3.1) ; la sauvegarde iCloud est celle de la personne. À confirmer au lot 5b.

## Angles morts

- **Phrase de confidentialité de l'écran 1** (§4.1, « libellé à caler, étalons ») : absente du pack, hors des 5 étalons du §1 ; la formule de travail « identifiant anonyme » est inexacte (identifiant relié aux thèmes et au compte éventuel : pseudonyme). À caler au lot 3a avec @legal, sans en faire un 8e étalon.

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution, responsable |
|---|---|---|---|---|
| Pack 5A l. 127, 139, 140 | Cadrage §3.2 (pools, règle de mélange) | Thème promis chaque jour | Haute | N8, @copywriter |
| Pack reco 6 l. 162 | Cadrage §3.4, décision 6 (04/11) | Offre déplacée au 2e toucher sans le dire | Haute | N9, @copywriter |
| Pack 4B l. 106 | Cadrage §3.4, §3.6 c | Promesse avant production des défis | Haute | N6, @copywriter |
| Pack reco 4 l. 117 | Choix du 04/11 (barre 9) | Plafond 8 présenté comme argument | Moyenne | N10, @copywriter |
| Pack l. 43-45 | Pack options B et C | Plafond 150 dépassé | Moyenne | N1, @copywriter |
| Pack l. 94 | Cadrage §9.1 | Palier Apple non signalé | Moyenne | N7, @copywriter |

## Décisions à confirmer par Thomas (déjà dans le pack, à garder)

Les 7 lettres ; « indépendant » vrai tel quel (4C) ; plafond de 150 si A ; avec N9 : accepter ou non l'offre au second toucher ; avec N10 : accepter ou non un écran d'offre à 8 au panel.

## Recommandation

**NO-GO pour la séance en l'état (8,5/10).** Relancer @copywriter sur N1 à N10 (toutes à texte fourni), puis contrôle des seuls passages modifiés. Les 19 corrections du tour 1 sont closes ; aucun bloquant de structure ; les recos 1A+, 2B, 3A, 4B, 5A, 6A, 7B restent défendables après correction.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/mobile/revues-etalons/reviewer-v2.md`
- Décisions : NO-GO (8,5/10, v1 : 7) ; O1 à O19 levées ; 10 nouvelles corrections obligatoires (N1 à N10), 13 souhaitables ; pack non modifié, rien commité.
- Points d'attention : N8 (promesse de thèmes), N9 (décision 6), N6 et N10 (écran d'offre) ; agent à relancer : @copywriter.
---

Sources (WebSearch du 04/11/2026, paliers euro) : [Blog du Modérateur, hausse des prix App Store en France](https://www.blogdumoderateur.com/apple-augmente-prix-app-store-france/) ; [iPhoneSoft, prix App Store France](https://iphonesoft.fr/2022/09/20/app-store-prix-france-augmenter).
