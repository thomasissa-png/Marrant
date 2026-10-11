# Audit réseaux sociaux Marrant : stratégie, ton, formats, cadence (s14, 01/10/2026)

Périmètre : export de 636 posts (mars à octobre 2026), prompt `apps/web/src/lib/ai/agents/social-media-agent.ts`, `docs/copy/brand-voice.md`, `docs/founder-preferences.md`. Hors périmètre : la notation à l'aveugle des 80 posts (critique parallèle) et la panne de publication (diagnostic développeur).

Conventions de ce document : les noms d'humoristes et de médias sont remplacés par `[humoriste]` ou `[média]` dans les citations (règle fondateur du 30/09). Les tirets cadratins des citations sont remplacés par `[tiret cadratin]`. Les comptages "sur 80" viennent de l'échantillon `aveugle-posts.txt` que j'ai lu en entier et compté à la main : ils décrivent cet échantillon (méthode de tirage non documentée), pas les 636 posts. Tout chiffre non issu des faits établis ou de ma lecture est marqué `[HYPOTHÈSE]`.

---

## 1. Verdict en 5 lignes

1. Thomas a raison : le problème n'est pas un réglage, c'est le modèle. Un générateur quotidien, noté par un directeur IA qui donne 8 ou 9 sur 10 à tout ce que j'ai lu, ne peut pas atteindre la barre « niveau Alexa ».
2. Le contenu publié contredit les règles de marque les plus fermes : humoristes nommés (39 posts sur 80), voix « je », tirets cadratins, fausses citations, threads, ton coach sur LinkedIn.
3. La marque n'a ni plan ni mesure : 518 tweets publiés (438 en avril, soit environ 14 par jour), 0 impression enregistrée, Instagram jamais publié (41 échecs), plus rien depuis le 15/06.
4. Le site possède déjà ce qu'il faut : 125 vannes validées à l'aveugle, 109 conseils validés, un article par semaine. Les réseaux doivent redistribuer ce stock, pas le concurrencer avec du contenu non relu.
5. Recommandation : Instagram en priorité (cartes de vannes), X en relais simple, LinkedIn en pause, production mensuelle préparée et relue, mesure hebdomadaire réelle. Zéro génération IA quotidienne.

---

## 2. Constats chiffrés

### 2.1 Volume, cadence, répartition (faits établis)

| Indicateur | Valeur | Lecture |
|---|---|---|
| Posts dans l'export | 636 | mars à octobre 2026 |
| Tweets publiés | 518 | dont 438 en avril, soit 14,6 par jour en moyenne (438 / 30), contre « 1 par jour et par plateforme » dans le prompt actuel |
| Tweets hors avril | 80 | sur mars, mai et juin réunis |
| LinkedIn publiés | 39 | page sans audience mesurée |
| Instagram publiés | 0 sur 41 | 41 échecs : aucune présence réelle sur cette plateforme |
| Échecs au total | 77 | 41 Instagram + 36 autres (Twitter et LinkedIn : limite de débit 429, erreurs 503, voir diagnostic développeur) |
| Dernière publication | 15/06/2026 | 3 mois et demi de silence |
| Statistiques d'audience | 0 | impressions, likes, retweets, réponses, clics tous à 0 sur la totalité de l'export |
| Génération | IA quotidienne à 4h UTC | en pause depuis le 30/09 |

Deux conséquences. (a) La rafale d'avril (une quinzaine de tweets par jour en moyenne, des publications parfois décalées de 3 jours sur leur création, plusieurs posts d'affilée à quelques minutes d'écart) est exactement le « 5 posts en 1 minute = absurde » que Thomas a signalé en mars : le compte ressemble à un robot, pas à un pote. (b) Les colonnes de statistiques existent en base mais aucune tâche ne les remplit : 6 mois de publication n'ont rien appris.

Répartition par format dans l'export (lecture des extraits, comptage exhaustif non fait) : on trouve les formats legacy `TWEET`, `TECHNIQUE_DU_JOUR`, `POST`, `THREAD` jusqu'en avril, puis les formats « canoniques » `MINI_STANDUP`, `POTE_AU_TAF`, `IMAGE_QUI_CLAQUE` après la refonte du 05/05. La refonte a changé les étiquettes plus que le fond (voir 2.4).

### 2.2 Répétition de structures (échantillon de 80 posts : 71 X, 9 LinkedIn, 0 Instagram)

| Structure répétée | Posts | Part |
|---|---|---|
| Humoriste nommé comme sujet ou caution (« [humoriste] fait ce truc… ») | 39 | 49 % |
| Consigne de devoir à la fin (« Teste ce soir », « Défi », « Essaie demain ») | 16 | 20 % |
| Ouverture « On dit / On fait / On finit tous… » + traduction | 11 | 14 % |
| Thème applis de rencontre | 11 | 14 % |
| Format thread ou pseudo-thread (🧵, « 1/ », « 1/4 ») | environ 10 | environ 12 % |
| CTA clone « 50+ techniques du genre → deviens-marrant.fr » ou « On a compilé 50 techniques » | 7 | 9 % |

Le prénom « Kevin » revient dans 4 posts, et un même humoriste est le sujet de 10 posts. Le générateur tourne en boucle sur 4 ou 5 mécaniques. La cause est dans le code : `getWinningPatterns()` réinjecte dans le prompt les posts les mieux notés par le directeur IA (score ≥ 8) des 14 derniers jours, donc il renforce ses propres tics au lieu de s'éloigner. Aucun signal d'audience n'entre dans la boucle (il n'y en a pas).

### 2.3 Règles de marque enfreintes (échantillon de 80, sauf mention)

| Règle (source) | Posts | Exemple verbatim court |
|---|---|---|
| Zéro humoriste nommé (fondateur 30/09) | 39 / 80 | « [humoriste] dit jamais non. » ; « Comment [humoriste] place TOUJOURS au bon moment » |
| Compte = marque, pas une personne, zéro « je / mon / ma » (fondateur 05/05) | au moins 8 / 80 | « Ma mère a rejoint BeReal. » ; « J'ai officiellement l'âge de voir mes références devenir vintage. » ; « Hinge me propose Emma. » |
| Zéro tiret cadratin (règle commune 12) | au moins 12 / 80 | « Défi 22h [tiret cadratin] dis : « non mais attends » » ; « C'est du stand-up involontaire : tu transformes ta routine en running gag. [tiret cadratin] technique d'auto-dérision préventive des pros » (12 posts au moins ; le prompt lui-même recommande « des tirets [tiret cadratin] pour lier deux idées ») |
| Personas jamais cités (brand-voice) | 1 / 80 | « Sophie dit JAMAIS non. » |
| Pas de thread (fondateur 05/05) | environ 10 / 80, dont 2 qui ne sont que la description d'un thread | « Thread techniques de stand-up utilisables ce soir [tiret cadratin] micro-doses d'humour du quotidien avec timing et observations chirurgicales » |
| LinkedIn : ni leçon, ni coach, ni « Spoiler » (fondateur 05/05) | 5 / 9 | « c'est du leadership déguisé » ; « Julie a eu 3 promotions en 2 ans. Coïncidence ? » ; « (Spoiler : 90 % du temps au bureau… » |
| Jamais vulgaire ni offensant (brand-voice) | au moins 5 / 80 | « ah merde » (3 fois), « l'histoire de tes merdes », « Hitler ? » en chute d'une blague sur les réunions à 8h ; hors échantillon, une caption Instagram du 16/05 évoque une drogue (« pivert sous MD ») |
| Zéro hashtag (prompt) | 100 % des posts lus dans l'export | 3 à 4 hashtags sur chaque post (`#colocation`, `#humour`, `#étudiant`) |
| Chiffres justes (fondateur 29/09) | 7 / 80 | « 50+ techniques » : le site affiche « 350+ conseils » et « 550+ vannes » |
| Pas de fausse expérience de la marque | au moins 4 / 80 | « On a testé hier en réu. » ; « Bon, on a testé 4 trucs de stand-up. C'était gênant au début » |

Risque juridique à faire examiner par @legal : plusieurs posts attribuent à des humoristes réels des citations et des anecdotes inventées par le modèle (une panne de micro dans une salle précise, des répliques entre guillemets, « [humoriste] dit : "Si tu regardes pas ton public, tu existes pas." »). Ce sont de fausses citations de personnes réelles, publiques, et elles restent en ligne.

### 2.4 Même après la refonte du 05/05, les règles ne tiennent pas (posts de mai et juin lus dans l'export)

| Règle | Constat |
|---|---|
| Instagram : légende ≤ 80 caractères | légendes de 250 à 400 caractères, avec hashtags |
| Instagram : « l'image fait rire seule » | le champ `content` contient un texte long, parfois une note de production visible : « (Technique stand-up : personnification [tiret cadratin] donner des émotions humaines aux objets pour révéler l'absurdité du quotidien) » |
| X : ≤ 270 caractères, une idée | « 30 ans = eau pétillante » : environ 70 mots et 8 phrases construites sur « Celui qui… », « Celui qui… » |
| LinkedIn : 3 phrases maximum, zéro broetry | « Le mail 'urgent' » : environ 90 mots, « PAS DE RUSH. » isolé en capitales, « littéralement » (adverbe banni par le prompt lui-même) |
| Zéro 1ère personne | « Mon ordinateur fait semblant d'avoir un bug. » (Instagram, mai) |
| Pas de listes à tirets dans un tweet | « Coloc mode ninja : [tirets] Chuchote… [tirets] Ouvre le frigo… » + « Merci Dylan » |
| Contrôle qualité | tous les `directorScore` lus sont à 8 ou 9 sur 10 (un seul null), y compris sur les posts ci-dessus. Le score ne discrimine pas : il ne peut pas servir de filtre. |

### 2.5 Ce qui n'a aucun sens pour la marque

1. Publier un post qui est la description d'un thread au lieu du thread (deux cas dans l'échantillon).
2. Faire enseigner l'humour par des portraits d'humoristes (« comment il fait ») : la marque promet « des vannes que tu n'as jamais entendues » et un parcours pour que Yanis devienne drôle, pas un cours d'analyse sur d'autres.
3. Le format « conseil, exemple, exercice » en 20 % des posts : le brand-voice interdit ce schéma sur les réseaux (« pas de structure conseil-exemple-exercice ») et « Scolaire » est un des 3 mots exclus de la marque.
4. LinkedIn comme canal : un ton « collègue brillant » sur la plateforme que Thomas juge « fumeuse », pour une marque tutoyante dont le persona principal a 20 ans.
5. Un Instagram qui échoue 41 fois sur 41 sans que personne ne le voie, pendant que la génération continue à produire pour lui chaque jour.
6. Des CTA qui promettent « 50+ techniques » alors que le site annonce des chiffres d'un autre ordre, et qui vendent alors que la ligne fondateur est « le produit s'apprend, il ne se vend pas ».
7. Un directeur IA qui valide ses propres textes avec 8 ou 9 sur 10, une seule tentative de régénération autorisée (`MAX_VALIDATION_ATTEMPTS_SHORT = 1`), et aucune relecture humaine à l'aveugle.

---

## 3. Ton : écart avec la brand voice et avec la barre des vannes

### 3.1 Écart avec `brand-voice.md`

| Attendu (brand-voice, social) | Constaté |
|---|---|
| Plus punchy que le site, 0 filler, chaque mot compte | posts de 100 à 250 mots (un tweet « streamers » fait environ 250 mots en 5 points numérotés) |
| Plus « entre nous », comme un DM à un pote | ton de conférencier : « Technique : l'accord incomplet. », « Résultat : rires nerveux → vraie discussion → respect » |
| Auto-dérision douce, on rit de soi, jamais des autres | beaucoup de chutes qui rabaissent un tiers (« Bravo Kevin, tu viens d'inventer le refus premium », « Mec, t'as littéralement écrit URGENT ») |
| Encourageant sans moraliser | morales explicites en fin de post : « L'autodérision, c'est de la défense préventive. », « La punchline qui traîne, c'est la punchline qui meurt. » |
| Jamais corporate | LinkedIn : « leadership déguisé », « ancrage cognitif », « l'effet dernière intervention » |
| Shareable : on l'envoie à un pote | un pote n'envoie pas un mode d'emploi en 5 points ; il envoie une chute |

Contradictions internes du cadre lui-même (à corriger, sinon l'écart revient) :
- `brand-voice.md` dit en haut que « Stand-up » se définit par trois humoristes cités nommément (ligne 44) et exige des « refs modernes obligatoires » (lignes 66 et 67) pour le blog, puis ligne 84 « Aucun humoriste nommé » : deux règles incompatibles dans le même fichier.
- Le prompt `social-media-agent.ts` contient une `HUMORISTES_ROTATION` de 8 noms, une « inspiration du jour » avec un humoriste imposé, des « modèles de pensée » nominatifs et deux médias nommés comme modèles d'écriture. Il demande aussi « des tirets [tiret cadratin] pour lier deux idées » et « la valeur éducative au premier plan, pas l'humour pour l'humour » : c'est ce dernier ordre qui produit des leçons déguisées en posts.
- Le prompt exige « zéro hashtag » mais le schéma de sortie contient un champ `hashtags` que le modèle remplit toujours.
- La signature d'e-mail du brand-voice (« Alex ») contredit la décision du 06/05 (« L'Équipe Deviens Marrant »). Hors périmètre social, à nettoyer au passage.

### 3.2 Écart avec la barre des vannes (étalon : « J'ai dit à Alexa de me raconter une blague. // Elle m'a lu mon historique de recherches. »)

La barre : deux lignes, une chute non télégraphiée par le setup, une observation vraie, jamais entendue ailleurs, aucune explication.

| Post (échantillon) | Pourquoi il est sous la barre |
|---|---|
| « On dit « pas mal » quand c'est TRÈS bien… On complimente en mode damage control depuis la sixième. » | observation connue de tous, pas de retournement d'idée, la chute reformule le setup |
| « « Effectivement. » Le silence qui suit = chef d'œuvre… Mais c'est ça le génie. » | le texte annonce lui-même que c'est drôle, au lieu de l'être |
| « On devrait se faire ça plus souvent ! … C'est notre façon polie de dire « c'était sympa mais on a une vie ». » | idée de classique des réseaux (la barre exclut ce qui est déjà connu), chute télégraphiée |
| « Dating apps = Hunger Games… Le seul tribute qui gagne c'est Deliveroo. » | comparaison déjà vue partout |
| « Tu fais genre tu écoutes mais ton cerveau est parti commander une pizza. … Ah. » | dialogue reconstitué (format banni dans le prompt) ; la chute « Perpignan » est correcte mais noyée dans un setup de 3 lignes |
| Posts « technique » (« [humoriste] dit jamais « ok »… Technique : l'accord incomplet. ») | aucune vanne : une description d'une vanne d'un autre, ce n'est pas une vanne |
| Légende Instagram « pivert sous MD » | image bizarre sans idée, et référence à éviter pour la marque |

Lecture honnête : 3 ou 4 posts de l'échantillon contiennent une vraie idée (le prénom de secours qu'on donne au café, l'échelle « J'arrive » / « J'arrive vraiment », le profil qui « a décrit 4 milliards d'humains », « Elle a cassé l'algorithme en étant... normale »). Même ceux-là sont trop longs, expliqués ou terminés par une morale, donc sous le niveau « Alexa ». Le taux exact de posts au niveau est mesuré par le critique à l'aveugle, pas ici.

---

## 4. Stratégie recommandée

### 4.1 Principe

Les réseaux ne fabriquent pas du contenu : ils redistribuent le contenu déjà validé du site, dans un format natif, au rythme du site. Le site tutoie, observe, fait rire en deux lignes ; les réseaux font exactement la même chose sans rien ajouter qu'on n'a pas relu. Objectif 6 mois du project-context : construire une audience engagée pour l'acquisition organique, avec la ligne fondateur « valeur éducative d'abord, l'abonnement est une conséquence ».

### 4.2 Plateformes (persona : Yanis 20 ans, Sophie 26 ans, Marc 34 ans ; marque tutoyante, humour français, B2C)

Faits à confirmer avec Thomas : nombre d'abonnés actuel de chaque compte (non fourni, `[À FOURNIR]`) et statistiques natives (analytics X et LinkedIn exportables, Instagram à créer ou vérifier).

| Plateforme | Décision | Objectif | Pourquoi |
|---|---|---|---|
| Instagram | GARDER, priorité 1 | Partage et sauvegarde des vannes (envoi en message privé à un pote), notoriété auprès de Yanis et Sophie | Le format carte « setup // chute » est exactement la structure des vannes validées. Aucune présence réelle aujourd'hui : on part de zéro, sans passif à nettoyer. Aucune photo ni visage requis (règle fondateur d'identité respectée). |
| X | GARDER, priorité 2, format simple | Relais texte des mêmes vannes, test de ce qui circule ; référencement croisé | Une vanne en deux lignes se publie telle quelle. Single posts uniquement (règle du 05/05). Audience mesurable gratuitement. Réserve : audience française de moins de 25 ans `[HYPOTHÈSE : à confirmer avec les analytics natifs]`. |
| LinkedIn | PAUSE, page statique | Aucun pour l'instant | Ton de plateforme incompatible avec la marque (Thomas : « c'est fumeux, c'est pas notre ton »), persona principal absent. Le thème « bureau » reste un thème de vannes sur Instagram et X. Réévaluer au bout de 8 semaines seulement si les analytics montrent une demande. |
| TikTok / Reels | À TESTER APRÈS 8 SEMAINES | Découverte par la vidéo courte | Le persona de 20 ans y est naturellement. Mais la vidéo exige un format (texte à l'écran, sans visage) à valider avant production. Voir décision 5. |

On n'ouvre pas de 4e plateforme. Règle : une plateforme n'existe que si on tient la cadence avec du contenu validé.

### 4.3 Piliers éditoriaux (5, rattachés au site)

| Pilier | Source (existe déjà) | Format | Place dans la semaine |
|---|---|---|---|
| 1. La vanne du jour | catalogue de 125 vannes, vanne du jour programmée sur le site | carte 2 images (setup, chute) ou 2 lignes sur X | 2 fois par semaine par plateforme |
| 2. Le conseil en une carte | 109 conseils validés (étalons E2, E3, E4, E6, E7 : détail précis, décalage de registre, ironie bienveillante) | 1 carte, 1 geste concret, sans humoriste | 1 fois |
| 3. La répartie en situation | réparties validées des articles (12 sur 290 écrites), réserve : escalade, ascenseur, vote, aspirateur, chat, pétanque | « Quelqu'un te dit X » puis la réplique | 1 fois, en alternance avec le pilier 4 |
| 4. Pourquoi ça marche | décryptage associé à chaque vanne (champ existant) | 1 vanne + 1 phrase de mécanisme, sans jargon | 1 fois, en alternance |
| 5. L'article de la semaine | article du lundi (13 lundis, S1 Halloween le 05/10) | 1 extrait drôle de l'article + lien (le seul lien de la semaine) | lundi |

Répartition cible sur X (5 posts par semaine) : 40 % vanne, 20 % conseil, 20 % répartie ou décryptage, 20 % article. Sur Instagram (4 posts par semaine) : 50 % vanne, 25 % conseil, 25 % article. `[HYPOTHÈSE : ces ratios sont des points de départ, à réviser après 8 semaines de statistiques]`.

### 4.4 Cadence et rythme (réaliste, car 100 % réutilisation)

La cadence n'est pas limitée par la production (les contenus existent déjà) mais par la qualité perçue : un seul créneau par jour et par plateforme, jamais deux posts à moins de 3 heures `[HYPOTHÈSE : à ajuster]`.

| Jour | X | Instagram |
|---|---|---|
| Lundi | pilier 5 (article, avec lien) | pilier 5 (carte, lien en bio) |
| Mardi | pilier 1 (vanne du jour) | pilier 1 (2 cartes) |
| Mercredi | pilier 2 (conseil) | pilier 2 |
| Jeudi | pilier 3 ou 4 en alternance | rien |
| Vendredi | pilier 1 (vanne du jour) | pilier 1 |
| Week-end | rien | rien |

Total : 5 posts X et 4 posts Instagram par semaine, soit environ 20 et 17 par mois. Saisonnalité : Halloween (vannes du 31/10) et Noël (autour du 24/12) suivent le calendrier du site. Le post du jour reprend la vanne du jour du site : ce n'est pas du stock consommé en plus.

### 4.5 Lien avec le site et le parcours

- Une vanne postée = la vanne du jour du site ce jour-là ; la carte porte un petit nom de marque en pied, sans CTA.
- Un seul lien par semaine, le lundi, vers l'article (règle « 1 post sur 5 avec lien » respectée sans effort). L'URL exacte de la page vanne du jour est `[À CONFIRMER]`.
- Pattern d'invitation validé : « On peut te partager X si tu as envie d'en savoir plus » reste réservé aux réponses et messages privés. Pas de « [→ lien] ».
- Troll ou critique publique : doctrine du 06/05 conservée (silence ou chaleur détachée).
- Réponses aux commentaires : 10 à 15 minutes par jour en manuel, hors périmètre automatisation tant qu'il n'y a pas d'audience.
- Parcours : les cartes « conseil » reprennent les 109 conseils des parcours, ce qui renvoie naturellement vers eux depuis la bio ; aucune promesse chiffrée nouvelle (règle du 29/09).

---

## 5. Modèle de production : préparé chaque mois, relu, jamais généré au jour le jour

### 5.1 Principe

- Aucun texte publié n'est produit par un modèle le jour même. Aucun texte n'est publié sans être issu d'un contenu déjà validé à l'aveugle (même procédure que les vannes : niveau « Alexa » ET jamais entendu ailleurs).
- Le texte d'une vanne, d'un conseil ou d'une répartie n'est jamais retouché pour les réseaux. L'adaptation est une mise en forme : coupure setup / chute, carte, ligne de légende. Le travail humain porte sur le visuel et la cohérence, pas sur l'humour.
- Ce modèle applique la décision du 30/09 (« contenu préparé à l'avance, génération quotidienne coupée ») aux réseaux, qui avaient été oubliés : le cron `daily-social` reste coupé et doit être retiré du planning.

### 5.2 Cycle mensuel (greffé sur l'étape 5 du cycle du 20 de `production-trimestrielle.md`, une fois la programmation du site de M+1 faite)

| Étape | Action | Qui |
|---|---|---|
| 1 | Extraction déterministe (script, zéro appel LLM) : vannes du jour de M+1, conseils, répartie de la réserve, articles du lundi, décryptages associés | @fullstack (script une seule fois) |
| 2 | Assemblage par gabarits fixes : carte ou 2 lignes, légende ≤ 80 caractères, hashtags 0 sur X, 3 maximum sur Instagram `[HYPOTHÈSE]`, pied de carte = nom de marque | script |
| 3 | Rendu des visuels en lot avec le gabarit existant (charte violette, fond sombre) | script |
| 4 | Contrôle bloquant sans LLM : noms d'humoristes (liste noire versionnée), tirets cadratins, « je / mon / ma » hors citation, prénoms des personas, vouvoiement, vulgarité, longueurs, nombre de hashtags, mention d'IA, chiffres du site. Il étend `runWithContentGates`, qui existe déjà | script |
| 5 | Validation : Thomas relit un échantillon de 10 posts (texte et visuel). Si un seul est sous la barre, le lot est refait | Thomas |
| 6 | Chargement de tout le mois en file de programmation, avec le calendrier `docs/social/calendrier/AAAA-MM.md` (colonnes : Semaine, Date, Plateforme, Format, Pilier, Hook, CTA, Statut) | script |
| 7 | Contrôle de fiabilité hebdomadaire : posts planifiés contre publiés, alerte si aucune publication sur 48 h (c'est ce qui a manqué de juin à septembre) | @fullstack |
| 8 | Bilan mensuel des statistiques et réglage des ratios (section 6) | @social |

Anti-répétition : un registre `docs/social/registre-posts.md` (identifiant du contenu source, plateforme, date, pilier). Règle : un même contenu source n'est repris qu'une fois par plateforme sur 90 jours `[HYPOTHÈSE]`, jamais avec la même mise en forme deux fois de suite.

### 5.3 Ce que le catalogue couvre (calcul sur la cadence 4.4, sur un trimestre de 13 semaines)

| Contenu | Besoin par trimestre | Stock existant | Conclusion |
|---|---|---|---|
| Vannes du jour (X et Instagram reprennent les mêmes) | 26 | 125 validées, dont 92 programmées sur le site au T4 et 26 en réserve | couvert, aucune vanne consommée en plus (reprise de la vanne du jour) |
| Conseils | 13 | 109 actifs | couvert plus de 8 trimestres |
| Décryptages « pourquoi ça marche » | environ 6 | un décryptage par vanne validée (5 anciennes vannes encore sans décryptage) | couvert |
| Réparties | environ 7 | 12 validées dans les articles + 6 sujets en réserve | juste : le rendement mesuré est de ~4 %, donc ~25 candidates par réplique voulue ; sinon on remplace par un décryptage |
| Articles du lundi | 13 | calendrier T4 (13 lundis) | couvert |

Seul besoin de création : les réparties, déjà dans le cycle mensuel de production du site.

### 5.4 À arrêter ou à ne pas reconduire

- Cron `daily-social` : arrêt définitif, prompt archivé et non patché. Les patchs successifs (s7 à s11) n'ont pas tenu parce que le modèle de production est le défaut.
- `HUMORISTES_ROTATION`, « inspiration du jour », modèles nominatifs, recommandation de tirets, injonction « valeur éducative au premier plan, pas l'humour pour l'humour » : tous incompatibles avec les choix fondateur.
- `getWinningPatterns()` : boucle de renforcement sur un score IA qui ne discrimine pas.
- Notation par directeur IA comme garantie de qualité : seule la relecture à l'aveugle fait foi.
- 3 personas en rotation avec le thème imposé par jour : le persona principal (Yanis) est un angle, pas un calendrier. Les personas restent invisibles en public.

---

## 6. Mesure

### 6.1 Constat

0 statistique d'audience dans l'export (impressions, likes, retweets, réponses, clics). Les colonnes existent mais aucune tâche ne les remplit. Résultat : on ne sait pas si une seule personne a lu un post en 6 mois, et la « boucle de feedback » du prompt s'alimente de notes IA.

### 6.2 Dispositif

1. Source de vérité = analytics natifs de chaque plateforme (gratuits), relevés chaque lundi, 15 minutes. Première étape : exporter l'historique X et LinkedIn pour établir un état des lieux avant tout nettoyage.
2. Automatisation : une tâche hebdomadaire qui alimente les colonnes existantes en base. `[HYPOTHÈSE : l'accès API aux métriques peut être limité ou payant, à vérifier par @fullstack avant de promettre l'automatisation ; repli = saisie manuelle des exports]`.
3. Côté site : paramètres UTM sur le lien du lundi (source = plateforme, support = social, campagne = slug de l'article) et lecture des sources de trafic et des inscriptions dans Umami (en place).

### 6.3 Indicateurs

| Niveau | Indicateur | Pourquoi |
|---|---|---|
| Post | portée ou impressions, sauvegardes, envois (Instagram), réponses, clics sur lien | les envois et sauvegardes mesurent le « je l'envoie à un pote » qui définit la marque |
| Plateforme | abonnés nets par mois, visites de profil, taux d'engagement (interactions / portée) | croissance et résonance |
| Pilier | médiane d'envois + sauvegardes par pilier | pour régler les ratios 4.3 |
| Site | sessions et inscriptions venant des réseaux (UTM, source de trafic Umami) | lien avec l'objectif d'acquisition organique |
| Fiabilité | publiés / planifiés, délai de publication, jours sans publication | évite un nouveau silence de 3 mois |
| Conformité | violations détectées par le contrôle bloquant (cible 0), échantillon validé par Thomas (cible 10 sur 10) | maintient la barre |

### 6.4 Seuils

Aucun seuil chiffré n'est fixé aujourd'hui : on n'a aucune base (zéro donnée, abonnés non communiqués). Règle : les 4 premières semaines servent de référence. À la semaine 5, on fixe pour chaque plateforme un seuil au-dessus de la médiane observée et on décide : un format dont les envois + sauvegardes par portée restent sous la médiane deux mois de suite est remplacé. Objectif de croissance : le project-context vise 10 000 abonnés combinés à 12 mois ; la croissance mensuelle requise = (10 000 moins le total actuel) / 12, à calculer dès que Thomas donne les abonnés actuels `[À FOURNIR]`.

---

## 7. Décisions à faire trancher par Thomas

1. **Plateformes.** Instagram en priorité (cartes de vannes), X en relais simple, LinkedIn en pause (page statique), TikTok non ouvert. *Ma reco : oui.* Le persona principal n'est pas sur LinkedIn, le ton de la plateforme est celui que tu rejettes, et Instagram n'a jamais publié : on y part sans passif.
2. **Les posts déjà en ligne (518 tweets, 39 LinkedIn).** *Ma reco :* (a) exporter d'abord les analytics natifs, sans rien supprimer ; (b) supprimer en lot tous les posts qui nomment un humoriste, attribuent une citation ou une anecdote à une personne réelle, parlent en « je », sont des threads ou contiennent un tiret cadratin ou un sujet à éviter ; (c) ne garder le reste que s'il a une audience mesurée. Les fausses citations à des personnes réelles sont à passer à @legal. Tu avais demandé de ne pas supprimer ce qui marche : ici on ne supprime que ce qui enfreint tes règles, et on garde ce que les chiffres défendent.
3. **Modèle de production.** Contenu 100 % repris du catalogue validé, assemblé par script, relu sur échantillon de 10 par mois ; génération IA quotidienne arrêtée définitivement, prompt archivé. *Ma reco : oui.* C'est la décision du 30/09 étendue aux réseaux.
4. **Cadence et mix.** 5 posts X et 4 posts Instagram par semaine, ratios de 4.3, test de 8 semaines puis bilan avec décision de réglage. *Ma reco : oui,* parce que la cadence est tenable à coût nul de création et que les statistiques réelles permettent ensuite de décider sur des faits.
5. **Vidéo courte (Reels, puis TikTok).** *Ma reco :* ne pas produire de vidéo avant la semaine 9 ; si les cartes Instagram dépassent la médiane d'envois, lancer des Reels « vanne en texte à l'écran, sans visage » à partir du même catalogue ; ouvrir TikTok seulement si les Reels tiennent. À valider : acceptes-tu un format vidéo sans voix ni visage ?

---

## Points techniques pour @fullstack (hors décisions fondateur)

- Instagram : 41 échecs sur 41, diagnostic en cours côté développeur ; ne pas relancer la publication avant le nettoyage décidé en 7.2.
- Alerte si 48 h sans publication ; tâche hebdomadaire de relevé des statistiques ; extension du contrôle bloquant (liste noire de noms, tirets, voix « je », personas, hashtags, longueur).
- Retirer `daily-social` du planning et archiver `social-media-agent.ts` (modèle de prompt incompatible avec les choix du 30/09).
- Aucune modification faite par moi : tout changement de code ou de configuration devra être consigné dans `REPLIT_ACTIONS.md`.

## Handoff

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/social/audit-s14/audit-strategie-ton.md`
- Décisions proposées : Instagram + X (LinkedIn en pause, TikTok plus tard), 5 piliers rattachés au site, 100 % réutilisation du catalogue validé, cadence 5 X + 4 Instagram par semaine, mesure native hebdomadaire.
- Points d'attention : abonnés actuels inconnus `[À FOURNIR]`, accès API aux métriques `[HYPOTHÈSE]`, fausses citations d'humoristes à passer à @legal, `brand-voice.md` se contredit sur les humoristes et la signature (@copywriter), notation précise des 80 posts dans le travail du critique à l'aveugle.
