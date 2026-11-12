# Tour 8, relecteur @ux (à l'aveugle) : `architecture-contenu-v8.md`

> Relu : sections 0 à 9 (en lisant les sections 3.3 à 4.5 et 6 à 9 en entier, et le reste par passages), annexes A à C. Fait donné par la session : depuis un article, le bouton d'abonnement passe `/abonnement?src=blog-<slug>` (`blog-article-view.tsx` l. 41), PAS `returnTo` ; la survie de ce `src` jusqu'après le paiement n'est pas vérifiée. Références : mon tour 7, `besoins-audience-donnees-internes-s24.md` (S5 : « 0 clic sur 69 vues d'encarts d'article »), `founder-preferences.md` l. 20.
> Limite : je n'ai relu ni `blog-article-view.tsx` ni le code du paiement ; je m'appuie sur le fait donné.

## 1. Notes

| Critère | T6 | T7 | T8 | Justification courte |
|---|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | 9 | Marc a sa ligne « aucun signal trouvé » ; le geste « pour plaire » sert la rencontre ; le trac est rattaché aux missions, à la rafale et à « Le blanc » |
| C2 Décisions de Thomas | 7 | 8 | 9 | Vocabulaire remis à 40 mots, C13 pose « Une vanne pour ce soir » avec le pivot du 06/05 cité et la reco B qui le respecte ; A de C1 marquée « rouvre le 12/11 » |
| C3 Zéro donnée inventée | 9 | 8 | 8 | Pages et requêtes distinguées, fenêtres dites ; mais le signal « article » repose sur `returnTo`, que le code n'utilise pas pour cela (c'est `src`) ; « entrée la plus fréquente » vaut chez les visiteurs seulement et l'encart d'article n'a produit aucun clic |
| C4 Rubriques claires, 6 entrées au plus | 8 | 9 | 9 | B recommandée, 6 entrées réelles, Bibliothèque ouverte sur les thèmes et la recherche |
| C5 Ambition | 9 | 9 | 9 | Inchangée : section 0, capteurs, règle de décision à J60 |
| C6 Cohérence | 8 | 8 | 8 | Totaux juste (155, 285, 100 hors parcours, 54 lues, 60 situations : je les recompte) ; mais la recommandation B de C13 montre la vanne du jour deux fois, et la règle de priorité n'est pas appliquée de la même façon au volume et à la place dans « Aujourd'hui » |
| C7 Faisabilité | 9 | 9 | 9 | Chantier compté, régime mensuel, seuils d'ouverture ; manque la capture du `src` |
| C8 Questions à Thomas | 8 | 8 | 9 | C13 est une bonne question (visiteurs contre abonnés, pivot cité, reco honnête B) ; C9 affirme encore le `returnTo` d'article |
| C9 Exemples au ton maison | 8 | 8 | 8 | Pas de nouvel exemple ; les univers ajoutés (rencontre, prise de parole) n'ont toujours pas de phrase écrite, seulement leur garde-fou |
| C10 Progression pédagogique | 9 | 9 | 9 | Calendrier, ordres de signaux, marches : stable |
| **C11 Pertinence pour l'audience réelle** | | 7 | **8** | Règle de priorité écrite, capteurs, règle de décision à J60, vocabulaire rétabli ; reste un signal d'entrée construit sur un mécanisme inexact, et une règle de preuve appliquée à géométrie variable |

**Note globale C1 à C10 : 8,7 / 10** (87 sur 100). **Avec C11 : 8,6 / 10** (95 sur 110). T6 8,4 ; T7 8,5 (8,4 avec C11). Pas encore 10/10 : 3 corrections bloquantes, courtes.

## 2. Statut de mes 9 corrections du tour 7

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| T1 | L'article de blagues n'est pas un signal | PARTIEL, mal fondé | 4.2 ajoute une table « catégorie d'article, premier pas » et un ordre 2 ; mais elle suppose que `returnTo` porte l'article. Le code passe `?src=blog-<slug>` à `/abonnement`, pas `returnTo`, et la survie du `src` jusqu'au premier écran de l'espace n'est pas établie (U1) |
| T2 | Vocabulaire réduit sans question | OK | Retour à 40 mots (8 fiches), justification réécrite, retiré des réductions ; 0.3 ; totaux recomptés |
| T3 | « Une vanne pour ce soir » sans question, contre le pivot | OK avec un défaut | C13 : trois options marquées (au-dessus, sous le contenu du jour, absente), mesure « chez les visiteurs » dite, pivot cité, reco B honnête ; toucher « Ce soir, c'est plutôt ? » et geste ajoutés. Défaut : en B, la vanne du jour apparaît deux fois (U2) |
| T4 | Répartition des 60 sans règle | OK avec une réserve | Règle écrite (4 de base, +2 mesuré, +1 observé, +0 supposé ou piste), calcul par univers juste, coloc et messages nommés « paris », ordre des 30 premières. Réserve : la règle n'est pas appliquée de la même façon ailleurs (U3) |
| T5 | Pages contre requêtes ; fenêtres | OK | « Deux pages, pas des recherches », 4 et 3 clics, 28 jours |
| T6 | Marc, geste, garde-fou de rencontre | OK | Ligne Marc, quatrième choix « pour plaire », garde-fou « taquiner, ne jamais insister ». Reste à dire où « pour plaire » met le filtre en avant (U7) |
| T7 | Nommage de la section | OK | Section 0 ; l'annexe garde la lettre A |
| T8 | Trouver une vanne dans la Bibliothèque | OK | Bloc ouvert sur les thèmes, recherche accessible depuis la barre |
| T9 | Étiquette de scène | OK | Une valeur par liste, « autre » pour un problème, ordre de grandeur honnête |

## 3. Nouvelles corrections

### Bloquantes

**U1. [BLOQUANT] Le signal « article » est décrit avec un mécanisme que le code n'utilise pas, et sa survie n'est pas établie (C3, C6, C7, C11).**
Passages : 4.2 « Le lien de retour (`returnTo`) : l'abonné vient d'une fiche **ou d'un article du blog** … L'article est donc un signal … [À VÉRIFIER] : que `returnTo` porte le slug de l'article » ; table « catégorie d'article » ; C9 (« Le lien d'où il vient, y compris un article de blog, est un signal ») ; Annexe A (T1 « Appliqué ») ; Annexe B (« Si `returnTo` porte le slug »).
Problème : le fait vérifié est inverse : depuis un article, l'abonnement passe `/abonnement?src=blog-<slug>`. `src` est un paramètre d'attribution de page d'abonnement, `returnTo` est le retour vers un contenu : deux mécanismes différents. La v8 range le cas en « Appliqué » alors que son point d'appui est faux, et qu'aucun trajet ne dit comment `src` survit à l'écran d'abonnement, au paiement externe, au retour sur la page de succès et à la création du premier écran de l'espace (le premier pas doit être le même sur la page de succès et dans « Aujourd'hui »). Le chantier de développement de 7.3 ne mentionne pas cette capture. Enfin, la donnée S5 (« 0 clic sur 69 vues d'encarts d'article ») montre que le chemin article vers abonnement était, à la mesure, presque inexistant : la part d'abonnés concernée est inconnue et peut être très faible.
Correction : réécrire 4.2, C9 et l'annexe avec `src` (nom du paramètre, format `blog-<slug>`) ; ajouter au chantier de 7.3 : conserver `src` jusqu'au paiement et le rattacher au compte (ou à la session de paiement) pour que le premier écran le lise, [À VÉRIFIER avec @fullstack] ; dire explicitement le repli : si `src` est perdu, scène par défaut ; marquer l'effet [SUPPOSÉ] tant que la part d'abonnés venus d'un article n'est pas mesurée (7.7 la mesure déjà : la citer) ; préciser comment le slug devient une catégorie (champ `categorie` de l'article, ou table de correspondance maintenue à la main). Garder `returnTo` pour les fiches du catalogue et les étapes (cas des liens internes).

**U2. [BLOQUANT] La composition recommandée de « Aujourd'hui » montre la même vanne deux fois (C6, C4).**
Passages : 4.4 « (c) le contenu du jour du brief §3.2, inchangé : **vanne**, conseil et vidéo du jour ensemble ; (d) juste dessous, la carte secondaire **« Une vanne pour ce soir »** » et « La vanne affichée est la vanne du jour du calendrier préparé (par défaut) » ; C13 option B (reco).
Problème : dans la variante recommandée, la vanne du jour figure en (c) et la carte (d) affiche par défaut cette même vanne : deux blocs, un seul contenu, l'un sous l'autre. Le toucher « Ce soir, c'est plutôt ? » ne change rien tant qu'il n'est pas utilisé. Un écran d'accueil qui se répète à 375 px est un défaut visible dès le premier jour.
Correction : en option B, intégrer la carte dans le bloc du contenu du jour : la vanne du jour devient la vanne de la carte, avec le toucher et « une autre » sous elle ; le conseil et la vidéo du jour restent à côté (ou dessous). Les options A et C gardent leurs descriptions. Mettre la capture d'écran du rendu à l'étalon E5.

**U3. [BLOQUANT] La règle de priorité est dite « appliquée partout » mais traite la même preuve de deux façons (C6, C11).**
Passages : 0.1 « Règle de priorité, écrite et appliquée partout (répartition des 60 situations en 3.3, ordre de production en 7.4, place dans “Aujourd'hui” en 4.4 et C13) : [MESURÉ] > [OBSERVÉ] > [SUPPOSÉ] > [PISTE]. Un besoin d'un niveau inférieur ne passe jamais devant un besoin mesuré » ; 3.3 (soirée +2, rencontre +2 sur des mesures de visiteurs) ; C13 option B (reco) qui place la carte sous le contenu du jour parce que la mesure « porte sur des visiteurs ».
Problème : pour le volume des situations, un [MESURÉ] de visiteurs (pages de Google) compte plein tarif (+2) ; pour la place de la vanne, le même [MESURÉ] de visiteurs ne suffit plus et passe après le conseil et la vidéo, c'est-à-dire derrière des contenus de niveau inférieur : la règle énoncée (« ne passe jamais devant ») est violée par la reco B. Les deux choix se défendent, mais pas sous la même règle écrite. Un lecteur qui refait le calcul trouve une règle à géométrie variable.
Correction : séparer deux niveaux explicites : **[MESURÉ chez les visiteurs]** (vaut pour choisir quoi écrire ; ne vaut pas pour hiérarchiser l'écran d'un abonné) et **[MESURÉ chez les abonnés]** (n'existe pas encore, viendra des capteurs de 7.7). Écrire la règle ainsi, l'appliquer au volume (le +2 reste, c'est un choix d'écriture) et à C13 (la mesure de visiteurs ne place pas la carte au-dessus). Retirer « ne passe jamais devant » ou le restreindre au volume.

### Non bloquantes (à traiter pour 10/10)

**U4. [OBSERVÉ] est de l'offre, donc proche du supposé (C11).** 0.1 définit [OBSERVÉ] comme ce que contiennent le carnet, les lettres, la taxonomie. C'est ce que l'équipe a écrit à partir de ses propres hypothèses ; la note de données le dit (« là encore choix de l'équipe »). Donner +1 aux univers du carnet entretient ces hypothèses (et défavorise la coloc parce que le carnet n'en a pas, non parce que l'audience n'en veut pas). Dire dans 0.1 que [OBSERVÉ] mesure l'offre, pas la demande, et que l'écart +1 est un tiebreak, pas une preuve.

**U5. « Événement anonyme » et « sans répétition pour l'abonné » ne vont pas ensemble (C3, C7).** 4.4 : « Le choix n'est pas gardé sur le compte ; il est compté comme événement anonyme » et la vanne tirée « sans répétition pour l'abonné ». Pour ne pas répéter une vanne, il faut retenir ce qu'a vu chaque abonné : c'est une donnée par compte, pas un événement anonyme. Dire ce qui est gardé (liste des vannes vues, par abonné ; ou une graine de tirage), ce qui est compté sans identité (la catégorie touchée), et faire vérifier si la phrase de @legal de « Mes questions » couvre ce stockage ou s'il en faut une.

**U6. Si C13 = C, le premier pas d'un article de blagues pointe vers une carte qui n'existe pas (C6).** 4.2, table des articles : « Blagues : “Une vanne pour ce soir” et son “À toi de jouer” ». Sous l'option C de C13 (pas de carte), dire que le premier pas est la fiche d'une vanne de la Bibliothèque et son « À toi de jouer ».

**U7. « Pour plaire » : où le filtre est-il « mis en avant » ? (C10).** 4.2 : le choix ne mène à aucun parcours, « le filtre rencontre est mis en avant ». Dire où (la page « Quoi répondre », la rafale du lendemain, un bandeau d'« Aujourd'hui ») ; le plus simple est que la prochaine situation nouvelle de la rafale soit une situation de rencontre, une fois, puis l'ordre normal reprend.

**U8. Règle de décision à J60 : un effectif minimal (C7).** 7.6 : « si, à J60, la part des abonnés actifs qui jouent … reste sous X % … » : avec 4 abonnés actifs, une règle à seuils décide sur trois personnes. Ajouter un effectif minimal (par exemple une quarantaine d'abonnés actifs, à fixer par @data-analyst) avant tout déclenchement.

**U9. Les « 30 premières situations » : une somme ambiguë (C6).** 7.4 : « 5 entrées + soirée 6 + rencontre 6 + boulot 5 + réunion 5 + amis 3 = 30 » ; 3.3 dit que les 5 entrées comptent dans les volumes (dont une de coloc, la poêle). Si elles comptent dans les volumes, l'ensemble des 30 couvre moins d'univers que ce que la somme laisse croire (les entrées sont déjà dans soirée, boulot, coloc). Écrire la liste des 30 par univers, entrées incluses.

## 4. Réponses directes (grille C11)

1. **Le chemin sert-il d'abord les besoins mesurés ?** Oui pour le plus mesuré (une vanne à ressortir) par la Bibliothèque à un clic et la carte (placement posé à Thomas) ; pour la rencontre, par six situations et le geste « pour plaire ». Le signal d'entrée par l'article est la bonne idée mais pas encore un mécanisme (U1).
2. **La règle de preuve tient-elle ?** Elle est écrite (0.1) et le calcul est juste ; elle n'est pas appliquée à l'identique au volume et à l'écran (U3), et [OBSERVÉ] reste de l'offre (U4).
3. **Les capteurs ?** Oui : étiquettes de scène, toucher par catégorie, répartition du geste, part des abonnés avec un signal (y compris un article), règle de décision à J60 (avec effectif minimal à ajouter, U8).

## 5. Points acquis (à ne pas perdre au tour 9)

- Section 0 (fiabilité, conventions, règle de priorité, manques), 0.3 (vocabulaire à 40 mots, bilan allégé dit non nommé), 7.7 (capteurs).
- C13 (visiteurs contre abonnés, pivot du 06/05 cité, trois options, reco B honnête), C1 (A marquée « rouvre le 12/11 »), C6 et C12 avec leurs mesures et leurs biais.
- 3.3 (règle de volume avec son calcul : 48 + 4 + 8 = 60), 4.2 (deux ordres, quatre choix du geste), 4.4 (toucher et geste de la carte).
- Totaux : 155 fiches neuves, 285 distinctes, 100 hors parcours, 54 lues, 1 150 à 3 750 candidates.
