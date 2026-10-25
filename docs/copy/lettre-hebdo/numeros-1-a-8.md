# Lettre de la semaine : numéros 1 à 8 (document de travail pour la relecture à l'aveugle)

> Statut : BROUILLON. Rien n'est validé. Les 9 entrées de `apps/web/src/data/lettre/hebdo-premium.json` portent `"statut": "BROUILLON"` et la préférée de chaque numéro. Thomas passe à `VALIDE` après la relecture à l'aveugle des accroches et des 2 ponts (règle d'or P0 s18), puis approuve chaque numéro dans l'admin (verrou s22 : rien ne part sans approbation). `GABARIT_HEBDO.valide` est `true` depuis le 25/10 (gabarit figé, décision de Thomas).
> `[Framework : value-first, la fiche du carnet est le contenu, l'accroche ne fait que cadrer la saison et le rendez-vous]` · `[Conscience : Most Aware, un abonné Premium qui a coché la case, il connaît le carnet et veut juste son jeudi]`
> Sources : `docs/product/lettre-hebdo-premium-s21.md` (§2, §3), `docs/legal/lettre-hebdo-premium-s21.md` (C1 à C4), `apps/web/src/lib/lettre/numeros-hebdo.ts`, `config/textes/lettre-hebdo-s21.ts`, `data/carnet/2026-10.json` et `2026-11.json`, `docs/copy/carnet/novembre/departage-2026-11.md` (30 fiches à 10/10/10), `docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md`.

## 1. Les 8 fiches et la logique

Le format du code ne porte aucune date : `envoiPrevu` est calculé (jeudi 8 h Paris de la semaine ISO). Les fiches viennent toutes du carnet de novembre : il n'existe pas de `2026-12.json`, et la règle du code (`carnet.mois` au plus égal au mois du jeudi) autorise novembre pour toutes les semaines.

| N° | Semaine | Envoi (jeudi 8 h Paris) | Fiche (id, objet) | Contexte | Cadre de saison |
|---|---|---|---|---|---|
| 1 | 2026-W45 | 05/11/2026 | 2026-11-02, Le voisin en bonnet | quotidien | Premiers froids, le chauffage collectif |
| 2 | 2026-W46 | 12/11/2026 | 2026-11-09, Le renfort du samedi | amis | Le samedi qui approche (accroche B, relecture s22) |
| 3 | 2026-W47 | 19/11/2026 | 2026-11-19, Le coupable idéal | boulot | Matins de pluie, retards |
| 4 | 2026-W48 | 26/11/2026 | 2026-11-28, Le carton dans l'entrée | couple | Semaine du Black Friday (vendredi 27/11) |
| 5 | 2026-W49 | 03/12/2026 | 2026-11-15, La guirlande en boule | famille | Les décorations sortent des cartons |
| 6 | 2026-W50 | 10/12/2026 | 2026-11-11, Le capitaine et ses plots | sport | Le froid de décembre, le match du dimanche |
| 7 | 2026-W51 | 17/12/2026 | 2026-11-25, Le rayon des retardataires | famille | Les cadeaux, une semaine avant le 24 |
| 8 | 2026-W52 | 24/12/2026 | 2026-11-14, Le perdant officiel | amis | Après-midi de Noël, le jeu de société |
| 9 | 2026-W53 | 31/12/2026 | 2026-11-06, DJ désigné d'office | soirée | Réveillon, la musique |

> s22 (25/10) : 9 numéros d'avance (`data/lettre/hebdo-premium.json`). Le n°1 passe au jeudi 05/11 (W45, texte inchangé) et un numéro W46 est ajouté (relecture `docs/reviews/review-lettre-hebdo-w45-w46-s22.md`). Les tableaux des parties suivantes gardent la numérotation d'origine (1 à 8) : leur n°1 est le n°1 ci-dessus, leurs n°2 à 8 sont les n°3 à 9 ci-dessus. Le W46 n'y figure pas (décompte dans la relecture s22).

Logique : une montée du froid de novembre au réveillon, un contexte différent à chaque numéro (jamais deux fois de suite le même), et les deux numéros de fêtes les plus tardifs (jeu de société, playlist) calés sur les deux soirées où ils servent vraiment. Aucune fiche n'est la fiche offerte d'un mois (2026-10-15 et 2026-11-10 restent intactes pour le gratuit et l'extrait de /abonnement).

Écartées exprès : 2026-11-24 (table des enfants) et 2026-11-27 (grand-mère) tombent sur la matière de la mensuelle de décembre (vanne de la grand-mère, « Alors, t'as quelqu'un ? ») ; 2026-11-21 (pot de départ) touche la soirée de Noël au boulot de la mensuelle de novembre ; 2026-11-16 (chauffage de l'open space) doublerait le numéro 1 ; 2026-11-18 (heure d'été) garde une prémisse que Thomas a laissée telle quelle mais qui n'a rien à faire dans un envoi ; 2026-11-07 (« Mon médecin m'a conseillé ») touche la santé, écartée par la règle §2.3-5. Le carnet de novembre est visible à partir du 01/11 : la lettre part après.

## 2. Les accroches (3 variantes par numéro, lettres neutres pour l'aveugle)

Règles tenues : 1 à 2 phrases, jamais la réplique ni la situation rejouée, aucune offre, aucune promesse de résultat, aucun fait de saison inventé, « tu » et « on ». La préférée est donnée au §5.

**N°1 · Le voisin en bonnet (12/11)**
- A. Novembre a ses sujets de conversation imposés, et la température passe en tête. Autant avoir une réplique pour celui-là.
- B. Premier numéro de la lettre de la semaine, et on commence par un classique de novembre : le froid, et ce qu'on en dit.
- C. Le froid s'installe, et avec lui les conversations de voisinage. Cette semaine, on s'entraîne à y répondre.
- Pont : « La pause se travaille à l'étape 2 du parcours Répartie, « Le rythme et les silences ». » → `/parcours/repartie#etape-2`

**N°2 · Le coupable idéal (19/11)**
- A. Matin de pluie en novembre : tout le monde a sa théorie sur le coupable du retard.
- B. En novembre, on a l'impression d'arriver en retard même quand on est à l'heure. Cette semaine, une scène pour ceux qui le sont vraiment.
- C. Novembre donne à tout le monde une excuse toute trouvée pour arriver en retard, et à chaque bureau un collègue qui fait semblant d'y croire.

**N°3 · Le carton dans l'entrée (26/11)**
- A. Le Black Friday tombe vendredi. Ceux qui ont juré de ne rien acheter ont leur scène de la semaine.
- B. On se dit toujours qu'on va juste regarder. Voici la scène de ceux qui ont regardé d'un peu trop près.
- C. Mode d'emploi du week-end : ne rien promettre, et savoir quoi répondre à celui ou celle qui s'en souvient.

**N°4 · La guirlande en boule (03/12)**
- A. Décembre commence, et les cartons de décorations sortent des placards. Il y en a toujours un qui contient plus de nœuds que prévu.
- B. Premier jeudi de décembre : les sapins se montent, et la famille se répartit les tâches. Tu connais la tienne.
- C. À la maison, décembre commence souvent par un carton qu'on n'aurait pas dû ranger si vite.

**N°5 · Le capitaine et ses plots (10/12)**
- A. Le froid arrête rarement un match du dimanche matin, il refroidit seulement l'enthousiasme de ceux qui n'y tenaient pas.
- B. Décembre, des mains gelées et un ballon qui pique : les matchs du dimanche matin continuent quand même.
- C. Cette semaine, une scène pour ceux qui jouent par amitié, ou par politesse, un dimanche matin de décembre.
- Pont : « Rire de toi sans te rabaisser, c'est l'étape 2 du parcours Confiance. » → `/parcours/confiance#etape-2`

**N°6 · Le rayon des retardataires (17/12)**
- A. Plus qu'une semaine avant le 24. Les listes de cadeaux sont faites, ou en tout cas évoquées.
- B. Les listes de cadeaux circulent en famille, et chacun sait déjà qui s'y prendra tard.
- C. Il y a ceux qui ont fini leurs cadeaux en novembre, et les autres. Cette scène est pour les autres.

**N°7 · Le perdant officiel (24/12)**
- A. Bon réveillon. Voici une scène pour le moment où les assiettes sont vides et où quelqu'un dit « on fait une partie ? »
- B. Joyeux Noël d'avance, et bon courage pour l'après-midi qui traîne entre deux repas.
- C. Veille de Noël : les jeux de société sortent des placards, et les perdants habituels reprennent leurs places.

**N°8 · DJ désigné d'office (31/12)**
- A. Un soir de réveillon, tout le monde a un avis sur la musique, et personne ne veut être celui qui choisit.
- B. Dernier jeudi de l'année : bon réveillon à toi, et à ceux qui te tendront leur téléphone.
- C. Dernier numéro de l'année. Bon réveillon, et que la musique ne s'arrête pas au mauvais moment.

## 3. Ponts (facultatifs, 2 sur 8)

Seulement quand le lien est net et que le budget de mots le permet. Titres d'étapes pris dans `config/parcours-etapes.ts` (test de cohérence avec le seed) ; les deux étapes sont réservées à Premium (`free: false` dans `docs/content/parcours-seed.json`), donc déjà incluses pour le lecteur. Ancre `#etape-N` : `id="etape-<ordre>"` posé par `parcours-step-card.tsx` (vérifié par la mensuelle §1.6 et `parcours-s17-tour2.test.tsx`). Les cinq parcours sont publiés (`config/parcours-publication.ts`).
- N°1 : l'exercice insiste sur la pause (« si on n'entend pas la pause, recommence ») ; l'étape 2 de Répartie s'appelle « Le rythme et les silences » et traite du silence qui travaille pour toi.
- N°5 : la réplique est de l'autodérision ; l'étape 2 de Confiance s'appelle « Rire de toi sans te rabaisser ».
- Non retenu : N°4 (callback, étape 6 de Storytelling, « Un détail qui revient à la fin ») : exact, mais le budget de mots était à 7 mots de la limite. À reprendre au lot suivant si on desserre.
- Liens : `?utm_source=lettre-premium&utm_medium=email&utm_content=2026-w46-etape2` (et `2026-w50-etape2`), sans `-premium` en fin de `utm_content`.

## 4. Contrôles

Décompte de mots du corps assemblé, pied exclu, gabarit validé (sans marqueur). Deux mesures : « mots » (suites contenant une lettre ou un chiffre, l'URL comptée pour 1) et « jetons » (tout ce qui est séparé par une espace, donc « : », « « », « » », « ? » et « ! » comptent). Limite : 230. C'est la mesure « jetons » que le test de `lettre-hebdo-numeros-s21.test.ts` applique.

| N° | Fiche (mots) | Gabarit (mots) | Accroche | Pont | Total mots | Total jetons |
|---|---|---|---|---|---|---|
| 1 | 125 | 33 | 17 | 18 | 193 | 212 |
| 2 | 113 | 33 | 16 | 0 | 162 | 175 |
| 3 | 141 | 33 | 20 | 0 | 194 | 211 |
| 4 | 130 | 33 | 23 | 0 | 186 | 205 |
| 5 | 134 | 33 | 17 | 15 | 199 | 217 |
| 6 | 152 | 33 | 20 | 0 | 205 | 220 |
| 7 | 130 | 33 | 13 | 0 | 176 | 185 |
| 8 | 149 | 33 | 16 | 0 | 198 | 213 |

Anti-offre (liste de `motifsInterdits`), relue à la main sur chaque corps assemblé, objet et pré-en-tête compris : tiret cadratin 0 ; émoji 0 ; `[À COMPLÉTER` 0 (hors celui, attendu, du gabarit non validé) ; `/abonnement` 0 ; `utm_content` en `-premium` 0 ; `€` 0 ; mots `annuel`, `parrain`, `promo`, `remise`, `réduction`, `offre` en début de mot : 0 sur les 8 fiches, les 8 accroches retenues et leurs variantes, les 2 ponts (« promettre » du N°3 C commence par « prom » + « e », pas « promo » ; « Black Friday » est un nom de date, pas une offre). Objet = titre de la fiche, 17 à 26 caractères (limite 45), aucun ne contient la réplique. Fiches recopiées par le code (champs jamais retapés).

Objections et risques traités : « c'est le carnet que j'ai déjà » (angle de saison, rendez-vous, aucune fiche rejouée dans l'accroche) ; « promesse sans livraison » (8 numéros d'avance, aucun mot de garantie) ; « ça devient de la pub » (zéro offre, zéro lien /abonnement, 2 ponts vers des étapes déjà incluses).

## 5. Préférées (dans le JSON) et doutes

| N° | Préférée | Pourquoi |
|---|---|---|
| 1 | C | Courte, installe le rituel (« on s'entraîne »), ne rejoue pas le hall ni le bonnet |
| 2 | A | Une seule phrase, l'écho « coupable » sans spoiler le métro |
| 3 | B | Ne dépend pas de la date, aucune incitation à l'achat |
| 4 | A | Observation de saison, petit clin d'œil au « nœuds » sans rejouer la scène |
| 5 | B | Image concrète (« un ballon qui pique »), reste vraie sans dire que rien n'est annulé |
| 6 | C | Seule à avoir un vrai tour (« les autres » repris) |
| 7 | B | Complice, ne dit pas le jeu de société |
| 8 | C | Clôt l'année et fait écho à la scène sans la rejouer |

Doutes :
1. **Dates collées au calendrier.** Les N°7 et N°8 (réveillon), et dans une moindre mesure N°3, N°4 et N°6, n'ont de sens qu'à leur date. Si le premier envoi glisse au 19/11, ne pas décaler les 8 `semaine` d'un cran (le N°8 tomberait le 07/01) : laisser le N°1 (W46) en BROUILLON ou le retirer, et garder les 7 autres sur leurs semaines. La spec §3.4 dit l'inverse (« on décale `semaine` des 8 numéros ») : à trancher par Thomas.
2. **Le N°3 parle du Black Friday** (fiche validée 10/10 au carnet). Rien d'une offre, et aucun mot interdit, mais @legal peut vouloir confirmer que la mention d'une date commerciale ne fait pas lire la lettre comme promotionnelle.
3. **Le lot 2** (2027-W01 à W13) doit être validé au plus tard à la semaine 2026-W49 (03/12) : le N°8 dit « Dernier numéro de l'année » et le gabarit « À la semaine prochaine », ce qui suppose un numéro le 07/01.
4. **Mesure des mots.** Marge minimale de 10 jetons (N°6). Un compteur qui sépare aussi sur l'apostrophe ou le trait d'union dépasserait la limite sur plusieurs numéros : le test applique `split(/\s+/)`.
