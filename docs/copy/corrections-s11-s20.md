# Corrections ciblées de la version s11 (9 articles) : proposition, rien appliqué

> @copywriter, 12/10/2026. Cible : champs `content` et `metaDescription` de `apps/web/src/data/blog-article-rewrites.json` (texte s11 en ligne depuis `ac0c937d`). **Aucune modification du JSON, aucun commit.** Les relecteurs sont cités R1, R2, R3 (`docs/copy/duel-s11-s20/verdicts-relecteur-1/2/3.md`). Les textes « avant » sont recopiés du JSON (guillemets droits `"` du JSON affichés tels quels).
> Application prévue après relecture à l'aveugle (règle d'or P0 s18) : voir la section « Liste anonymisée » en fin de fichier (la clé est tout en bas, à ne pas ouvrir avant les verdicts).

## 1. Synthèse

| Type | Corrigées | Détail |
|---|---|---|
| 1. Chiffres et études non sourcés | 5 | Stanford 40 % (C02), Stanford « 3 fois plus longtemps » (C04), « 90 % de gens » (C09), « 90 % des situations » (C18), claim neuro « victoire sportive » (C01) |
| 2. Faits sur des humoristes | 7 | Frayssinet « 5 secondes / 5 mots / 4 » (C03), Frayssinet « silences de 3 à 5 s » (C20), Waly Dia « 10 mots » (C22), Waly Dia « 2 mètres » (C25), Waly Dia « pause 2-3 s » (C30), Waly Dia « petites habitudes » (C19), attribution à Fary (C10) |
| 3. Phrases sous la barre | 18 | 3 pourquoi (C24), Churchill (C13), chiasme/contrepèterie (C28), mot-clé plaqué ×2 (C29, C31), CLEF FINALE (C32), papier cadeau (C11), pauses 0,5 s / 2-3 s (C05, C21), « 2,99 EUR » (C23), « 50 nouvelles chaque mois » (C07), « 2024 » (C14), « Chacune est pensée… » (C06), dialogue Connecter (C16), Bercy 15 000 hypothétique (C17), citation de fin sans auteur (C15), « 15 minutes de retard » (C26), « et en bien » (C27) |
| 4. Métas | 2 | Blague drôle (C12), Blague courte (C08) |
| **Total** | **32** | par article : confiance 2, blague courte 6, blague drôle 4, citation drôle 3, improviser 4, raconter 4, société 4, jeu de mots 1, techniques pros 4 |

**Mesure du diff** (P0 s11) : pas de shell disponible dans cette session, donc pas de calcul automatique. Estimation manuelle : 32 passages, 20 à 250 caractères chacun, soit environ 3 % du texte des 9 articles (≈ 115 000 caractères). Intouchables non modifiés : slugs, tous les H2 et H3, toutes les FAQ, toutes les URL de lien (les ancres de liens des phrases corrigées sont conservées à l'identique), prix (2,99 reste 2,99, seule la graphie change), les 5 phrases S4 (conversation-machine-a-cafe, storytelling-drole-5-structures ×2, techniques-humoristes-pros, citation-drole) restent mot pour mot. C06, C07 et C19 touchent la même phrase qu'une S4 mais pas la phrase S4 elle-même.

## 2. Règles appliquées pour trier les chiffres

- **GO de Thomas du 12/10** (founder-preferences, ligne « Duel s11 ») : corrections ciblées sur « chiffres non sourcés Stanford, 90 % ». Ces deux familles sont donc corrigées.
- **Règle du 08/10** : un chiffre pédagogique non sourcé, cohérent et plaisant à lire est GARDÉ (« on n'est pas une recherche en science sociale »). Un chiffre incohérent dans le même texte reste une faute. Charte s11 §1.1 et §1.4 : on ne retire pas un chiffre sans GO, on le signale. Conséquence : « dix fois plus de chances », « 50 % », règle 70/30, 4-7-8, règle des 3 secondes, 3-2-1, « 0,3 % » (exagération comique), « 80 % » restent (liste en section 4).
- **Chiffre ou précision attribué à une personne réelle** (Frayssinet, Waly Dia) : invérifiable, donc retiré, la mention de l'humoriste est conservée (P0 05/10 : on ne supprime pas les humoristes).
- **Pauses** : une seule échelle dans tout le corpus : 1 à 2 secondes (0,5 s en art. 2 et 2-3 s en art. 6 étaient contradictoires, faute selon la règle du 08/10). La règle 3-2-1 de l'art. 3 (2 s de suspense) et l'exemple « pause de 2 secondes » de l'art. 9 sont déjà dans cette échelle.

## 3. Faits vérifiés (WebSearch du 12/10/2026, pages de résultats, pas de lecture intégrale des sources)

| Fait (article) | Verdict | Source |
|---|---|---|
| Paul Mirabel « remplit / fait exploser Bercy » (art. 3, 9 et excerpt art. 9) | **VRAI** : 2 dates à l'Accor Arena (Bercy, ≈ 20 000 places) les 10 et 11/04/2026 ; Dôme de Paris complet en 2025. « Complet » à Bercy : une seule fiche secondaire l'affirme. Gardé tel quel, aucune correction. | https://www.accorarena.com/en/events-and-tickets/paul-mirabel--942cc ; https://www.sortiraparis.com/en/what-to-see-in-paris/shows/articles/305061-paul-mirabel-upcoming-dates-for-his-prime-aux-molieres-show |
| Waly Dia « ne mesure pas 2 mètres » (art. 7) | **NON VÉRIFIABLE** : aucune source éditoriale ne donne sa taille. Mention gardée, la précision physique retirée (C25). | recherches « Waly Dia taille » sans résultat fiable |
| Blague « cow-boys / Indiens, on était tous Indiens » attribuée à Fary (art. 3) | **NON VÉRIFIABLE** : aucune trace dans ses spectacles consultés (Hexagone traite bien de la cité et des origines). Attribution remplacée par « dans la veine de Fary » (C10). | https://www.timeout.fr/paris/comedie/fary-dans-hexagone ; https://www.dhnet.be/medias/divers/2019/02/18/fary-sinterroge-sur-lidentite-francaise-dans-son-one-man-show-il-y-a-le-rire-et-il-y-a-lattaque-AKYJONLQDNHHBLYMKZSHPDCGB4/ |
| Waly Dia « part de nos petites habitudes du quotidien » (art. 5) | **INEXACT** : humour décrit comme politique et de société. Corrigé (C19). | https://www.letemps.ch/culture/waly-dia-le-sniper-de-punchlines-fier-rempart-de-l-humour-politique ; https://www.politis.fr/articles/2022/01/waly-dia-eclats-de-rire-sur-france-reac-43985 |
| Frayssinet « silences de 3 à 5 s », « punchlines < 5 s, setup 5 mots, chute 4 » ; Waly Dia « rarement plus de 10 mots », « silence de 2-3 s » | **NON VÉRIFIABLES** (mesures jamais publiées). Chiffres retirés, mentions gardées (C03, C20, C22, C30). | aucune |
| Inès Reg « s'est fait connaître avec des formats courts sur les réseaux » (art. 2) | **VRAI** : vidéo Instagram virale de 2019 (« des paillettes dans ma vie, Kevin »). Gardé. | https://www.dexerto.fr/divertissement/des-paillettes-dans-ma-vie-kevin-video-ines-reg-enflamme-reseaux-sociaux-958404/ |
| « L'expérience, c'est le nom que chacun donne à ses erreurs » (Oscar Wilde, art. 4) | **VRAI** : Le Portrait de Dorian Gray (ch. 4) et variante dans L'Éventail de Lady Windermere. Gardé. | https://wist.info/wilde-oscar/52665/ |
| « L'humour, c'est la politesse du désespoir » (art. 4, sans auteur dans le texte) | **Attribution la plus étayée : Chris Marker** (Dominique Noguez), souvent prêtée à tort à Vian. Le texte n'attribue pas : gardé tel quel. | https://www.guichetdusavoir.org/question/voir/46475 |
| « L'humour, c'est la seule chose sérieuse dans la vie » (art. 4, fin) | **AUCUN AUTEUR TROUVÉ**. Reprise comme opinion du site (C15), plus de « comme dit la formule ». | recherche sans attribution fiable |
| Technique de respiration 4-7-8 (art. 7) | **RÉELLE** (Andrew Weil : inspirer 4, retenir 7, expirer 8, 3 cycles). Gardée, pas de preuve clinique solide mais c'est un exercice, pas une promesse. | https://www.parismatch.be/lifestyle/beaute/2022/10/06/le-4-7-8-la-technique-de-respiration-infaillible-pour-sendormir-en-60-secondes-4ZI3RFHVDJEFTO3KV7UWDMO2RM/ |
| Netflix « clips de 30 secondes » (art. 2) | **PLAUSIBLE** : Fast Laughs / « Pour rire », extraits de 15 à 45 s (source 2019-2021, statut 2026 non vérifié). Gardé. | https://www.techradar.com/news/netflix-adds-tiktok-style-fast-laughs-to-mobile-app |
| Étude Stanford « confiance 40 % plus élevée » (art. 1) | **INTROUVABLE**. Les vrais chiffres Stanford sur l'humour concernent les managers (satisfaction +15 %, +27 % motivants), pas la confiance. Remplacée par une étude réelle (C02). | https://gsb.stanford.edu/insights/not-joke-cost-being-humorless |
| Étude Stanford « < 15 mots retenues 3 fois plus longtemps » (art. 2) | **INTROUVABLE**. Reformulée sans chiffre ni attribution (C04). | recherche sans résultat |
| « Mêmes zones que lors d'une victoire sportive » (art. 1) | **APPROXIMATIF** : l'étude fMRI montre que les blagues drôles activent le circuit de la récompense (noyau accumbens), mesuré chez des gens qui REGARDENT des dessins drôles, pas chez ceux qui font rire. Corrigé (C01). | Mobbs et al., Neuron 2003 : https://arcane.org/2003/12/11/jokes-activate-same-brain-region-as-cocaine/ ; réplique 2011 : https://pubmed.ncbi.nlm.nih.gov/21750952/ |
| Promesse « 50 nouvelles [vannes] chaque mois » (art. 2) | **FAUX / NON TENU** : aucune trace dans `apps/web/src` hors la phrase elle-même ; l'offre réelle est « toutes les vannes, conseils et vidéos dans les listes » + carnet mensuel (`apps/web/src/lib/llms-content.ts` l.124, `apps/web/src/config/premium.ts` l.106-115) et le contenu est préparé par lots mensuels ou trimestriels (founder-preferences 01/10). Remplacée (C07). | code du dépôt |
| Prix 2,99 € / mois | **VRAI** (founder-preferences 03/10, `llms-content.ts`). | code du dépôt |

## 4. Corrections détaillées (avant / après exacts)

Convention : Origine = relecteur(s) qui ont relevé le point dans la version s11.

### Article 1 : `avoir-confiance-en-soi-grace-a-l-humour`

**C01** | type 1 | origine R1, R3 (R2 : « affirmation générale ») | `content`
- Avant : `Les neurosciences vont dans ce sens : quand tu fais rire quelqu'un, ton cerveau active les mêmes zones que lors d'une victoire sportive. Sans le short et sans les courbatures.`
- Après : `Les neurosciences vont dans ce sens : quand une blague te fait rire, ton cerveau active son circuit de la récompense, celui qui s'allume aussi quand on remporte une victoire. Sans le short et sans les courbatures.`
- Source : Mobbs et al. 2003 (circuit mésolimbique, noyau accumbens) et réplique 2011, URL en section 3.

**C02** | type 1 | origine R1, R2, R3 | `content`
- Avant : `Une étude de l'Université de Stanford a montré que les personnes qui utilisent l'humour dans leurs interactions sociales développent une confiance en eux 40% plus élevée que la moyenne. L'explication tient en une phrase : l'humour crée du lien tout de suite.`
- Après : `Des chercheurs de la Wharton School et de la Harvard Business School ont observé qu'une blague réussie fait passer son auteur pour quelqu'un de plus sûr de lui et de plus compétent aux yeux du groupe. L'explication tient en une phrase : l'humour crée du lien tout de suite.`
- Source : Bitterly, Brooks et Schweitzer, huit expériences : l'humour réussi augmente le statut perçu, via la confiance et la compétence perçues. https://knowledge.wharton.upenn.edu/article/using-humor-in-the-office-when-it-works-when-it-backfires/ ; https://www.bps.org.uk/research-digest/done-tastefully-joke-telling-work-could-make-you-appear-more-confident-and ; https://news.harvard.edu/gazette/story/2016/10/laugh-your-way-to-success/. Aucun chiffre repris (le papier ne donne pas « 40 % »). Ni année ni revue citées dans le texte, faute de les avoir confirmées.

### Article 2 : `blague-courte-arme-secrete-humour`

**C03** | type 2 | origine R1, R3 | `content`
- Avant : `Regarde Roman Frayssinet : ses meilleures punchlines durent moins de 5 secondes. Un setup de 5 mots, une chute de 4, et la salle est déjà partie.`
- Après : `Regarde Roman Frayssinet : beaucoup de ses punchlines tiennent en quelques secondes. Un setup court, une chute plus courte encore, et la salle est déjà partie.`
- Mesure jamais publiée : chiffres retirés, humoriste conservé.

**C04** | type 1 | origine R1, R2, R3 | `content`
- Avant : `Une étude de l'Université de Stanford sur la mémorisation humoristique va dans le même sens : les blagues de moins de 15 mots sont retenues 3 fois plus longtemps que celles de plus de 50 mots. Nos [conseils](/conseils) partent du même principe : court, clair, facile à ressortir.`
- Après : `Les humoristes le savent depuis toujours : ce qui est court se retient mieux et se ressort plus facilement. Nos [conseils](/conseils) partent du même principe : court, clair, facile à ressortir.`
- Étude introuvable (section 3). Lien `/conseils` conservé.

**C05** | type 3 | origine R1 (contradiction 0,5 s / 2-3 s), R2 | `content`
- Avant : `**Un silence de 0,5 seconde avant la chute**`
- Après : `**Un silence d'une seconde avant la chute**`
- Seul le gras est modifié (la ligne contient un tiret cadratin déjà couvert par le patch de démarrage, voir section 6).

**C06** | type 3 | origine R2, R3 | `content`
- Avant : `Chacune est pensée pour son contexte : sortie au mauvais endroit, une vanne courte tombe aussi vite qu'elle est partie.`
- Après : `Chacune est pensée pour son contexte : au mauvais endroit, une vanne courte tombe aussi vite qu'elle est partie.`
- La fin de phrase (ancre de la S4 qui suit) est intacte.

**C07** | type 3 | origine R1, R2 (promesse à vérifier) | `content`
- Avant : `Si tu en veux d'autres, notre [abonnement](/abonnement) en propose 50 nouvelles chaque mois.`
- Après : `Si tu en veux d'autres, notre [abonnement](/abonnement) débloque toutes les vannes du catalogue, avec leur décryptage.`
- Promesse absente du code et du modèle de contenu (section 3). Le lien `/abonnement` est conservé. La phrase S4 qui précède (« Dans le même esprit, on a rangé… ») n'est pas touchée.

**C08** | type 4 | origine R2 (trop longue), R1/R3 (verdict méta) | `metaDescription`
- Avant (156 caractères, 1 de trop, comptés à la main) : `La blague courte, arme secrète de l'humour : l'anatomie d'une vanne qui marche, 3 pièges à éviter, la méthode pour raccourcir et 15 exemples par situation.`
- Après (147 caractères) : `Blague courte, l'arme secrète de l'humour : anatomie d'une vanne qui marche, 3 pièges à éviter, méthode pour raccourcir et 15 exemples à ressortir.`
- « 15 exemples » est exact (la liste en compte 15).

### Article 3 : `blague-drole-7-criteres-pepite`

**C09** | type 1 | origine R1, R2, R3 | `content`
- Avant : `Bienvenue dans le club des 90% de gens qui confondent "blague qui me fait rire" et "blague qui fait rire".`
- Après : `Bienvenue dans le club, très fréquenté, de ceux qui confondent "blague qui me fait rire" et "blague qui fait rire".`

**C10** | type 2 | origine R1, R2 | `content`
- Avant : `**Exemple de Fary :**`
- Après : `**Exemple dans la veine de Fary :**`
- Attribution non vérifiable (section 3). La blague et son analyse sont inchangées.

**C11** | type 3 | origine R1, R2, R3 (3 sur 3) | `content`
- Avant : `→ Inattendu (on compare un enfant à du papier cadeau) mais cohérent : à force de resservir chaque année, le papier finit par avoir de l'ancienneté.`
- Après : `→ Inattendu (certaines feuilles étaient dans la famille avant le narrateur) mais cohérent : à force de resservir chaque année, le papier finit par avoir de l'ancienneté.`

**C12** | type 4 | origine R1, R2, R3 (méta « plate ») | `metaDescription`
- Avant : `Une blague drôle qui marche vraiment coche 7 critères, de la surprise à la règle des 3 secondes : la grille pour reconnaître une pépite avant de la raconter.`
- Après (141 caractères) : `Pourquoi ta blague ne fait rire que toi ? Les 7 critères d'une blague drôle, de la surprise au timing, et une grille pour tester les tiennes.`
- Aucun chiffre inventé : « 7 critères » correspond à l'article.

### Article 4 : `citation-drole`

**C13** | type 3 | origine R1, R2, R3 | `content`
- Avant : `Une précision honnête : quelques-unes revisitent des classiques (l'auteur est cité quand on en est sûr), toutes les autres sont des formules maison. Pas de faux Churchill ici : tu peux les ressortir comme si elles venaient de toi.`
- Après : `Une précision honnête : quelques-unes revisitent des classiques (l'auteur est cité quand on en est sûr), toutes les autres sont des formules maison. Celles-là, tu peux les ressortir comme si elles venaient de toi.`

**C14** | type 3 | origine R1, R2, R3 (3 sur 3) | `content` (citation n° 39)
- Avant : `39. **"2024 m'a appris que j'étais plus résistant que prévu. Et plus créatif pour les excuses."**` puis `*Pour faire le bilan d'une année difficile. Remplace 2024 par l'année que tu préfères oublier.*`
- Après : `39. **"Cette année m'a appris que j'étais plus résistant que prévu. Et plus créatif pour les excuses."**` puis `*Pour faire le bilan d'une année difficile. Remplace « cette année » par l'année que tu préfères oublier.*`
- Même logique que le retrait de « 2019 » accepté le 30/09 (tic d'écriture daté).

**C15** | type 3 | origine R1 (répétition), R2, R3 (citation sans auteur) | `content`
- Avant : `Comme dit la formule : "L'humour, c'est la seule chose sérieuse dans la vie." Alors prends ces citations au sérieux... mais pas trop quand même.`
- Après : `Ici, l'humour est la seule chose sérieuse dans la vie. Alors prends ces citations au sérieux... mais pas trop quand même.`
- Aucun auteur trouvé pour la formule (section 3) : elle devient une opinion du site. L'ouverture de l'article (« Comme dit la formule, "L'humour, c'est la politesse du désespoir." ») reste, la répétition disparaît.

### Article 5 : `comment-improviser-des-blagues`

**C16** | type 3 | origine R2, R3 | `content` (section « Connecter »)
- Avant : `Tu relies cette observation à quelque chose de familier : ton stagiaire, qui essaie de paraître pro.` / `"Mon stagiaire, explique-moi la synergie collaborative."` / `"Il m'a regardé 5 secondes et m'a proposé de faire une pause café."`
- Après : `Tu relies cette observation à quelque chose de familier : ton stagiaire, qui essaie de paraître pro. Dans ta tête, ça donne :` / `"Et si je demandais à mon stagiaire d'expliquer la synergie collaborative ?"` / `"Il me regarderait 5 secondes, puis il proposerait une pause café."`
- On sait enfin qui parle ; la section « Transformer » (récit au passé) enchaîne sans changement.

**C17** | type 3 (exemple inventé présenté comme fait) | origine R1, R2, R3 | `content`
- Avant : `Quand un humoriste fait rire 15 000 personnes à Bercy avec une remarque sur le prix du parking, il ne l'a pas forcément écrite dans son salon.`
- Après : `Quand un humoriste fait rire toute une salle avec une remarque sur le prix du parking, il ne l'a pas forcément écrite dans son salon.`

**C18** | type 1 | origine R1, R3 (R2 : « 90 % » et « 80 % » incohérents entre eux) | `content`
- Avant : `Il existe des **schémas humoristiques** qui fonctionnent dans 90% des situations. Voici les 5 incontournables :`
- Après : `Il existe des **schémas humoristiques** qui fonctionnent dans la grande majorité des situations. Voici les 5 incontournables :`
- « 80% des situations sociales » (CLEF plus bas) est gardé (règle du 08/10) : plus d'incohérence entre deux pourcentages.

**C19** | type 2 | origine R1 | `content`
- Avant : `il part de nos petites habitudes du quotidien, les relie à des situations que tout le monde connaît, et en tire des **punchlines** qui tapent juste.`
- Après : `il part de ce qu'il observe autour de lui (la société, l'actualité, le quotidien), le relie à des situations que tout le monde connaît, et en tire des **punchlines** qui tapent juste.`
- Sources en section 3. La fin de phrase (ancre S4) et la S4 qui suit sont intactes.

### Article 6 : `comment-raconter-une-blague-sans-la-rater`

**C20** | type 2 + pauses | origine R1, R2, R3 | `content`
- Avant : `**Roman Frayssinet** sait exactement quand marquer un temps d'arrêt pour laisser la tension monter : chronomètre ses silences, tu en trouveras de 3 à 5 secondes avant certaines punchlines. En conversation, c'est plus discret : une micro-pause de 2-3 secondes avant la chute suffit à créer l'attente qui décuple l'effet.`
- Après : `**Roman Frayssinet** sait exactement quand marquer un temps d'arrêt pour laisser la tension monter : écoute ses silences avant certaines punchlines, tu verras qu'il laisse la salle attendre. En conversation, c'est plus discret : une micro-pause d'une seconde environ avant la chute suffit à créer l'attente qui décuple l'effet.`

**C21** | type 3 (pauses) | origine R1 | `content` (CLEF du timing)
- Avant : `Une pause de 2-3 secondes avant la punchline transforme un sourire en éclat de rire.`
- Après : `Une pause d'une ou deux secondes avant la punchline transforme un sourire en éclat de rire.`

**C22** | type 2 | origine R1, R2, R3 | `content`
- Avant : `**Waly Dia** en est un bon exemple : ses punchlines font rarement plus de 10 mots.`
- Après : `**Waly Dia** en est un bon exemple : ses punchlines vont droit au but, sans un mot de trop.`
- La CLEF « Les meilleures chutes tiennent en moins de 10 mots » est une consigne pédagogique cohérente : gardée.

**C23** | type 3 | origine R1, R3 | `content`
- Avant : `**2,99 EUR/mois** : beaucoup moins cher que le silence après une blague massacrée.`
- Après : `**2,99 €/mois** : beaucoup moins cher que le silence après une blague massacrée.`

### Article 7 : `etre-plus-a-l-aise-en-societe`

**C24** | type 3 | origine R1 (R2 aime le dialogue, R3 non cité) | `content`
- Avant (puce du milieu) : `- "Ça me rappelle que je ne sais jamais quoi dire."`
- Après : `- "Mal. J'ai pas su quoi dire."`
- Séquence obtenue : « J'ai passé un weekend difficile. » / « Qu'est-ce qui s'est passé ? » / « Des problèmes familiaux. » / « Et toi, tu l'as vécu comment ? » / « Mal. J'ai pas su quoi dire. » / « Tu aurais aimé réagir comment ? ». La réponse colle enfin à la question.

**C25** | type 2 | origine R1 | `content`
- Avant : `Waly Dia dégage une assurance naturelle, pas parce qu'il mesure 2 mètres, mais parce qu'il occupe son espace sans s'en excuser.`
- Après : `Waly Dia dégage une assurance naturelle : il occupe son espace sans s'en excuser.`

**C26** | type 3 | origine R1, R2 (conseil présenté comme code « universel ») | `content`
- Avant : `15 minutes de retard, c'est de la décontraction. 45 minutes, c'est de l'irrespect déguisé en nonchalance.`
- Après : `15 minutes de retard à une soirée, c'est de la décontraction. 45 minutes, c'est de l'irrespect déguisé en nonchalance.`

**C27** | type 3 | origine R2, R3 (promesse non tenable) | `content`
- Avant : `Tes petites bizarreries, c'est ce dont on parlera après ton départ, et en bien.`
- Après : `Tes petites bizarreries, c'est souvent ce dont on se souviendra après ton départ, et plutôt en bien.`

### Article 8 : `jeu-de-mots-drole-techniques-creer`

**C28** | type 3 | origine R1, R2, R3 | `content` (le H2 « Technique 3 : La contrepèterie élégante… » est protégé et reste)
- Avant : `En conversation, garde la version qui se comprend du premier coup : l'inversion de deux éléments d'une même phrase. "Avant, je rangeais pour recevoir. Maintenant, je reçois pour me forcer à ranger."`
- Après : `En conversation, garde la version qui se comprend du premier coup : l'inversion de deux éléments d'une même phrase. Techniquement, on n'inverse plus des sons mais des mots, et ça s'appelle un chiasme : le cousin sage de la contrepèterie. "Avant, je rangeais pour recevoir. Maintenant, je reçois pour me forcer à ranger."`
- Chiasme = deux couples inversés en AB/BA (définition standard, ex. https://sherpas.com/blog/chiasme-figure-style/).

### Article 9 : `techniques-humoristes-pros`

**C29** | type 3 | origine R1 | `content` (intro)
- Avant : `Ce sont les **techniques humoristes à appliquer** en premier, et aucune ne demande d'être né drôle.`
- Après : `Ce sont les **techniques d'humoristes** à appliquer en premier, et aucune ne demande d'être né drôle.`

**C30** | type 2 | origine R1, R2, R3 | `content`
- Avant : `Waly Dia maîtrise l'art de la pause : ce silence de 2-3 secondes avant la chute qui fait toute la différence entre une vanne qui tombe à plat et une punchline qui explose.`
- Après : `Waly Dia maîtrise l'art de la pause : ce silence juste avant la chute qui fait toute la différence entre une vanne qui tombe à plat et une punchline qui explose.`

**C31** | type 3 | origine R1 (« même tournure au début du plan d'action ») | `content`
- Avant : `Maintenant que tu connais les **techniques humoristes à appliquer**, voici comment les tester sans risquer le malaise :`
- Après : `Maintenant que tu connais les **techniques d'humoristes**, voici comment les tester sans risquer le malaise :`

**C32** | type 3 | origine R3 | `content`
- Avant : `> **CLEF FINALE :** Ces techniques, c'est comme un instrument de musique…`
- Après : `> **CLEF :** Ces techniques, c'est comme un instrument de musique…` (reste du paragraphe inchangé)
- Aucun traitement spécial de « CLEF FINALE » dans le rendu (`grep` dans `apps/web/src`) : le libellé « CLEF : » est la convention des 8 autres articles.

## 5. Points relevés et NON corrigés (avec la raison)

**5.1 Chiffres gardés** (règle du 08/10, charte s11 §1.1 et §1.4 : le GO du 12/10 ne nomme que Stanford et « 90 % ») :
- « dix fois plus de chances de marcher » (art. 6, R1 R2) ; « 50% de l'art de raconter » (art. 9, R1) ; règle 70/30, technique 4-7-8 (réelle), règle des 3 secondes de regard (art. 7, R1 R2 R3) ; règle 3-2-1 et 3 × 1 seconde de traitement (art. 3, R1 R2) ; « 0,3% de la population » (art. 3, exagération comique, R2) ; « 80% des situations sociales » (art. 5, cohérent après C18) ; phases 0,2 / 0,3 / 0,5 s du cerveau (art. 2, R1 R2) ; « 3 minutes d'une observation » (art. 9) ; FAQ « 3-4 semaines, 6 mois » (art. 5, FAQ protégée) ; CLEF 30/30/40 (art. 8, blague assumée).
- Si Thomas veut aller plus loin sur « dix fois » ou « 50% », une formulation sans chiffre est prête sur demande (« bien plus de chances », « une grande part de l'art »). Non proposée ici : cela retirerait un chiffre sans GO.

**5.2 Un seul avis sur trois, désaccord de goût** (règle du 08/10 : seule la faute objective force la correction) :
- Art. 1 : « la confiance y a même son propre parcours » (R1), répétition en fin d'article (R2). Art. 2 : blagues 2, 4 et 15, ambiguïté « Fary l'a compris » (R2, R1). Art. 3 : transition « Parce que tu connais la scène » (R3). Art. 4 : #13 « La critique est facile. Surtout celle-là. » (R2 et R3, plate) et #30 « Le café du bureau a un goût de réunion » (R2) : les remplacer exige une nouvelle vanne validée à l'aveugle, à produire dans un lot de vannes si Thomas le souhaite. Art. 5 : pattern 4 « J'avance ma montre » (R1), exercice 3 « girafe » (R2), « club des improvisateurs » (R3). Art. 6 : « Garde ta question… » et « à tous les coups » (R2), « C'était pas son anniversaire » (R3), généralisations sur Pascot (R1 R2). Art. 7 : vanne d'ouverture « chaise et verre d'eau » (R2), « Félicitations » (R3). Art. 8 : « le Graal », « Netflix annule » (R2), exemple procrastination/documentation et longueur (R3), « no pain, no gain » rangé en homophonie (R2). Art. 9 : image de l'instrument de musique, « règle de 3 » creuse (R2), « les mêmes outils » (R3).

**5.3 Bloqués par vos contraintes** (à trancher par Thomas) :
- Art. 3 : la numérotation saute le critère #3 (H2 « Comment reconnaître le timing parfait… » sans numéro), R1 R2. H2 protégés.
- Art. 8 : le H2 « Technique 3 : La contrepèterie élégante (inverser les sons subtilement) » reste inexact malgré C28 (le corps le dit désormais franchement).
- Art. 6 : guillemets imbriqués droits dans l'ouverture (R3). La règle du 05/10 prévoit l'affichage « … » puis “…” au rendu : à contrôler sur une capture de prod avant de toucher au texte.
- Excerpt de `techniques-humoristes-pros` : « Paul Mirabel remplit Bercy » est vrai, rien à changer.

## 6. Points d'attention pour la suite (hors mission, rien touché)

- **Même promesse ailleurs** : `citation-drole`, dernière phrase : « notre abonnement te donne accès à une bibliothèque mise à jour chaque semaine ». Non relevée par les relecteurs, mais même famille que « 50 nouvelles chaque mois » et le contenu est préparé par lots mensuels ou trimestriels (founder-preferences 01/10). À décider (proposition : « une bibliothèque de vannes décryptées »).
- **`apps/web/src/lib/blog-articles.ts`** (articles statiques) : « 2,99 EUR » aux lignes 113, 221, 309, 372, 444, 524, 612, 704, 783, 861 et « pause de 2-3 secondes » à la ligne 1570 : mêmes défauts, à harmoniser séparément.
- **`apps/web/src/lib/blog-liens-s4-s20.ts`** l.60-62 et 97-99 : les chaînes `before`/`after` contiennent encore « 80% » et « 50 nouvelles chaque mois ». Sans effet tant que les marqueurs `DataPatch` existent, mais à aligner avec le JSON corrigé pour qu'un rejeu reste cohérent.
- **Tirets cadratins** : 8 lignes du JSON en contiennent encore (les 9 articles en contenaient avant `a8ac0a07`). Le patch de démarrage `BLOG_EM_DASH_PATCH_VERSION = 3` (`startup-tasks.ts`) les retire côté base. Tous les « après » ci-dessus sont sans tiret cadratin. À décider : nettoyer aussi le JSON à la source.
- **Application** (après relecture à l'aveugle) : éditer le JSON puis faire réécrire les 9 articles en base (bump de `_meta.version` ou patch ciblé : à cadrer avec @fullstack, le bump réécrit aussi les excerpts et rejoue la chaîne de patches). Documenter dans `REPLIT_ACTIONS.md`, `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`.
- **Méthode** : recherches web par moteur de résumé, aucune page ouverte en intégralité ; les comptes de caractères des métas sont faits à la main (pas de shell). À recompter par script avant mise en ligne (≤ 155).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/copy/corrections-s11-s20.md` (aucune modification du JSON, aucun commit).
- Décisions : framework = correction éditoriale ciblée (pas de réécriture) ; conscience = Problem-Aware (lecteur Yanis arrivé de Google) ; registre inchangé « pote drôle et bienveillant », tutoiement, zéro tiret cadratin ; échelle de pause unique 1 à 2 s ; Stanford remplacé par une étude réelle ou retiré ; humoristes tous conservés.
- Points d'attention : section 5 (non corrigés, dont les chiffres gardés par la règle du 08/10) et section 6 ; relecture à l'aveugle de la liste ci-dessous avant toute mise en ligne (règle d'or P0 s18).

---

## 7. Liste anonymisée pour la relecture à l'aveugle (32 passages, ordre mélangé)

> Consigne au relecteur : pour chaque lettre, juger le passage corrigé (au niveau de la barre, ou non) dans son contexte. Les phrases voisines sont données telles qu'elles seront en ligne. Les métas sont jugées seules, avec le titre de l'article. Dans cette section, « Avant » et « Après » désignent la phrase précédente et la phrase suivante dans l'article (pas l'ancienne version du passage) ; « Passage » est le texte corrigé à juger.

**A**
- Avant : **Technique concrète :** la méthode des "3 pourquoi". Quand quelqu'un te dit quelque chose, creuse avec des questions ouvertes :
- Passage : "J'ai passé un weekend difficile." / "Qu'est-ce qui s'est passé ?" (Pourquoi 1) / "Des problèmes familiaux." / "Et toi, tu l'as vécu comment ?" (Pourquoi 2) / "Mal. J'ai pas su quoi dire." / "Tu aurais aimé réagir comment ?" (Pourquoi 3)
- Après : Tu viens de transformer un "weekend difficile" en vraie conversation. Et sans parler de ton chat une seule fois.

**B** (méta, titre : « Blague courte : pourquoi c'est l'arme secrète de l'humour »)
- Passage : Blague courte, l'arme secrète de l'humour : anatomie d'une vanne qui marche, 3 pièges à éviter, méthode pour raccourcir et 15 exemples à ressortir.

**C**
- Avant : Ici, chacune vient avec son mode d'emploi, parce qu'une vanne mal placée, c'est comme des chaussettes avec des sandales : techniquement possible, socialement risqué.
- Passage : Une précision honnête : quelques-unes revisitent des classiques (l'auteur est cité quand on en est sûr), toutes les autres sont des formules maison. Celles-là, tu peux les ressortir comme si elles venaient de toi.
- Après : (nouvelle section) Rien de pire qu'un silence qui s'éternise lors d'une première rencontre. De quoi transformer le malaise en moment complice :

**D**
- Avant : Les humoristes pros reposent sur 7 mécaniques que tu peux reprendre telles quelles en conversation : l'observation précise, le callback, le contraste, l'autodérision préventive, l'escalade, l'ancrage physique et la pause calculée.
- Passage : Ce sont les **techniques d'humoristes** à appliquer en premier, et aucune ne demande d'être né drôle.
- Après : Tu as vu Paul Mirabel remplir Bercy avec sa timidité, Fary retourner une salle avec un pivot que personne n'avait vu venir, Roman Frayssinet faire un sketch entier d'un détail que tu n'aurais même pas remarqué.

**E**
- Avant : Et bonne nouvelle, ce talent n'est pas réservé aux pros du Jamel Comedy Club.
- Passage : Quand un humoriste fait rire toute une salle avec une remarque sur le prix du parking, il ne l'a pas forcément écrite dans son salon.
- Après : Il applique des **méthodes d'improvisation** que tu peux apprendre toi aussi.

**F**
- Avant : Les neurosciences vont dans ce sens : quand une blague te fait rire, ton cerveau active son circuit de la récompense, celui qui s'allume aussi quand on remporte une victoire. Sans le short et sans les courbatures.
- Passage : Des chercheurs de la Wharton School et de la Harvard Business School ont observé qu'une blague réussie fait passer son auteur pour quelqu'un de plus sûr de lui et de plus compétent aux yeux du groupe. L'explication tient en une phrase : l'humour crée du lien tout de suite.
- Après : Quand tu fais rire, tu ne subis plus la situation, tu y participes.

**G**
- Avant : Le débit compte aussi. Trop rapide, ton public n'a pas le temps de voir la scène. Trop lent, il regarde son téléphone. L'idéal : un rythme légèrement plus lent que ta conversation habituelle, qui accélère sur les moments drôles et ralentit sur les détails importants.
- Passage : > **CLEF :** Le timing, c'est le silence entre deux notes : c'est lui qui donne envie d'entendre la suivante. Une pause d'une ou deux secondes avant la punchline transforme un sourire en éclat de rire.
- Après : Pour aller plus loin, notre guide sur [le timing en humour](/blog/timing-humour) détaille ces techniques chez Frayssinet et Blanche Gardin.

**H**
- Avant : "On était tellement pauvres que ma mère gardait le papier cadeau pour le Noël d'après. Certaines feuilles étaient dans la famille avant moi."
- Passage : → Inattendu (certaines feuilles étaient dans la famille avant le narrateur) mais cohérent : à force de resservir chaque année, le papier finit par avoir de l'ancienneté.
- Après : (intertitre) La formule de la chute parfaite : / - **Elle recontextualise** tout ce qui précède

**I**
- Avant : Une maladresse assumée met les gens plus à l'aise qu'une aisance jouée.
- Passage : Tes petites bizarreries, c'est souvent ce dont on se souviendra après ton départ, et plutôt en bien.
- Après : > **CLEF :** L'aisance sociale, c'est accepter d'être imparfait en public. Et découvrir que c'est exactement ce qui rend les autres à l'aise avec toi.

**J**
- Avant : **Les 3 règles d'or du timing court :**
- Passage : - **Un silence d'une seconde avant la chute**, juste assez pour créer l'attente
- Après : - **Un setup dit sans traîner**, on arrive vite à l'essentiel

**K**
- Avant : (intertitre) La pause calculée : maîtriser le silence qui tue
- Passage : Waly Dia maîtrise l'art de la pause : ce silence juste avant la chute qui fait toute la différence entre une vanne qui tombe à plat et une punchline qui explose.
- Après : **Le principe en pratique :** tu installes une phrase qui a l'air sérieuse, tu laisses le silence travailler, puis la chute retourne la phrase contre elle-même.

**L**
- Avant : Si ça te fait sourire, teste sur un proche. Si ça le fait sourire aussi, tu tiens ta signature humoristique.
- Passage : Ici, l'humour est la seule chose sérieuse dans la vie. Alors prends ces citations au sérieux... mais pas trop quand même.
- Après : Tu veux aller plus loin ? Découvre notre [parcours complet](/parcours) pour développer ton humour naturel, ou explore nos [vidéos](/videos) pour voir ces techniques en action.

**M**
- Avant : 3. **Transformer** : exagérer ou retourner la situation
- Passage : Waly Dia est un bon exemple de cette méthode : il part de ce qu'il observe autour de lui (la société, l'actualité, le quotidien), le relie à des situations que tout le monde connaît, et en tire des **punchlines** qui tapent juste.
- Après : Si la pause café te fait plus peur que la réunion, voilà comment [tenir la conversation à la machine à café](/blog/conversation-machine-a-cafe).

**N**
- Avant : On t'a longtemps fait croire qu'une bonne blague avait besoin d'un contexte, de personnages et d'un développement. Pas forcément.
- Passage : Regarde Roman Frayssinet : beaucoup de ses punchlines tiennent en quelques secondes. Un setup court, une chute plus courte encore, et la salle est déjà partie.
- Après : Compare avec ton pote qui raconte l'histoire du gars qui entre dans un bar avec un pingouin, puis croise un barman borgne, puis... Au bout de 3 minutes, tout le monde a décroché, sauf lui.

**O**
- Avant : L'objectif : que dans 3 mois, tes collègues te demandent « Depuis quand t'es drôle, toi ? », au lieu de se dire « Attention, blague en approche ».
- Passage : > **CLEF :** Ces techniques, c'est comme un instrument de musique : au début, ça sonne faux et tes voisins souffrent. Puis ça devient une extension naturelle de ta personnalité. Les humoristes pros ont juste commencé plus tôt que toi.
- Après : Alors vas-y, vole-leur leurs outils. Paul Mirabel survivra très bien au fait que tu utilises ses techniques à la machine à café.

**P**
- Avant : Parce que tu connais la scène : tu racontes une blague qui t'avait fait pleurer de rire la veille, et autour de la table, rien. Un pote fixe son verre, un autre te demande si c'est fini.
- Passage : Bienvenue dans le club, très fréquenté, de ceux qui confondent "blague qui me fait rire" et "blague qui fait rire".
- Après : La différence n'a rien de mystique.

**Q**
- Avant : Toi, tu **observes** ce qui cloche : il vient de dire une phrase où aucun mot ne veut rien dire, et tout le monde hoche la tête.
- Passage : Tu relies cette observation à quelque chose de familier : ton stagiaire, qui essaie de paraître pro. Dans ta tête, ça donne : "Et si je demandais à mon stagiaire d'expliquer la synergie collaborative ?" / "Il me regarderait 5 secondes, puis il proposerait une pause café."
- Après : Tu retournes la situation, à la machine à café, après la réunion : "J'ai demandé à mon stagiaire ce qu'était la synergie collaborative. Il a réfléchi 5 secondes et il a proposé une pause café. Honnêtement, je crois que c'est exactement ça."

**R**
- Avant : **Les codes universels à connaître :**
- Passage : - **Le timing des salutations** : 15 minutes de retard à une soirée, c'est de la décontraction. 45 minutes, c'est de l'irrespect déguisé en nonchalance.
- Après : - **L'art du "ça va ?"** : ce n'est pas une vraie question médicale.

**S**
- Avant : 15. "Mes enfants m'entendent jamais. Sauf quand je chuchote le mot 'glace'."
- Passage : Chacune est pensée pour son contexte : au mauvais endroit, une vanne courte tombe aussi vite qu'elle est partie.
- Après : Dans le même esprit, on a rangé [40 citations drôles avec leur mode d'emploi](/blog/citation-drole) par situation.

**T** (méta, titre : « Blague drôle : 7 critères pour reconnaître une pépite »)
- Passage : Pourquoi ta blague ne fait rire que toi ? Les 7 critères d'une blague drôle, de la surprise au timing, et une grille pour tester les tiennes.

**U**
- Avant : D'abord, elle doit vraiment surprendre. Si ton public devine la fin dès le milieu, il sourira par politesse. Le rire naît du décalage entre ce qu'on attend et ce qui arrive.
- Passage : Ensuite, la formulation. Chaque mot compte. **Waly Dia** en est un bon exemple : ses punchlines vont droit au but, sans un mot de trop.
- Après : Chasse les mots parasites, les hésitations, les "euh" : ils diluent l'effet au pire moment.

**V**
- Avant : > **CLEF :** L'humour transforme l'énergie du doute en énergie de connexion. Le rire des autres, c'est la preuve dont ta petite voix avait besoin pour se calmer.
- Passage : Les neurosciences vont dans ce sens : quand une blague te fait rire, ton cerveau active son circuit de la récompense, celui qui s'allume aussi quand on remporte une victoire. Sans le short et sans les courbatures.
- Après : Des chercheurs de la Wharton School et de la Harvard Business School ont observé qu'une blague réussie fait passer son auteur pour quelqu'un de plus sûr de lui et de plus compétent aux yeux du groupe.

**W**
- Avant : La contrepèterie, c'est l'art d'échanger des sons entre deux mots pour faire apparaître une autre phrase. Les plus célèbres sont souvent grivoises, et presque toutes sont impossibles à placer à l'oral : ton public doit faire l'inversion dans sa tête, et en soirée, personne n'a le temps.
- Passage : En conversation, garde la version qui se comprend du premier coup : l'inversion de deux éléments d'une même phrase. Techniquement, on n'inverse plus des sons mais des mots, et ça s'appelle un chiasme : le cousin sage de la contrepèterie. "Avant, je rangeais pour recevoir. Maintenant, je reçois pour me forcer à ranger."
- Après : (intertitre) Le mode d'emploi : Prends une formule à deux éléments ("je range pour recevoir").

**X**
- Avant : (intertitre) Quand tout va mal en même temps
- Passage : 39. **"Cette année m'a appris que j'étais plus résistant que prévu. Et plus créatif pour les excuses."** / *Pour faire le bilan d'une année difficile. Remplace « cette année » par l'année que tu préfères oublier.*
- Après : 40. **"Ma vie est en travaux. Merci de ne pas déranger les ouvriers : ils sont en pause."**

**Y**
- Avant : > **CLEF :** En humour, la longueur ne fait pas l'effet. C'est comme le piment : une petite dose bien placée vaut mieux qu'un plat entier immangeable.
- Passage : Les humoristes le savent depuis toujours : ce qui est court se retient mieux et se ressort plus facilement. Nos [conseils](/conseils) partent du même principe : court, clair, facile à ressortir.
- Après : **Pourquoi nos cerveaux préfèrent-ils le format court ?**

**Z**
- Avant : Si la préparation, c'est les fondations, le [timing](/blog/timing-humour) c'est l'architecture de ta blague. C'est lui qui décide si la table rit ou si quelqu'un relance la conversation sur la météo. Et non, ce n'est pas inné : ça se travaille.
- Passage : D'abord, les pauses. **Roman Frayssinet** sait exactement quand marquer un temps d'arrêt pour laisser la tension monter : écoute ses silences avant certaines punchlines, tu verras qu'il laisse la salle attendre. En conversation, c'est plus discret : une micro-pause d'une seconde environ avant la chute suffit à créer l'attente qui décuple l'effet.
- Après : Le débit compte aussi.

**AA**
- Avant : (intertitre) Plan d'action : intégrer ces techniques dans tes conversations
- Passage : Maintenant que tu connais les **techniques d'humoristes**, voici comment les tester sans risquer le malaise :
- Après : **Étape 1, l'observation :** Chaque jour, note 3 micro-détails absurdes de ton quotidien.

**AB**
- Avant : Dans le même esprit, on a rangé [40 citations drôles avec leur mode d'emploi](/blog/citation-drole) par situation.
- Passage : Si tu en veux d'autres, notre [abonnement](/abonnement) débloque toutes les vannes du catalogue, avec leur décryptage.
- Après : (nouvelle section) Challenge 30 jours : maîtriser l'art de la concision humoristique. Un mois pour que le réflexe du format court devienne naturel.

**AC**
- Avant : Ta présence physique parle avant même que tu ouvres la bouche.
- Passage : Waly Dia dégage une assurance naturelle : il occupe son espace sans s'en excuser.
- Après : (intertitre) La respiration : ton ancrage invisible

**AD**
- Avant : Une **blague drôle** fonctionne comme un tour de magie : tu montres une chose, tu en révèles une autre. Mais la révélation doit être à la fois surprenante et cohérente.
- Passage : **Exemple dans la veine de Fary :**
- Après : "J'ai grandi dans une cité. On était pauvres. Tellement pauvres que quand on jouait aux cow-boys et aux Indiens... on était tous Indiens."

**AE**
- Avant : (intertitre) 4. Les patterns humoristiques universels à maîtriser
- Passage : Il existe des **schémas humoristiques** qui fonctionnent dans la grande majorité des situations. Voici les 5 incontournables :
- Après : (intertitre) Pattern 1 : La règle de 3 avec chute. "Sur mon CV : ponctuel, organisé, créatif. Surtout créatif."

**AF**
- Avant : Pour structurer cette progression, nos [parcours](/parcours) te guident étape par étape avec des exercices, et nos [conseils](/conseils) de livraison te donnent des techniques à essayer en situation.
- Passage : **2,99 €/mois** : beaucoup moins cher que le silence après une blague massacrée.
- Après : (fin de l'article)

---

## 8. Clé de la liste anonymisée (NE PAS OUVRIR AVANT LES VERDICTS)

> Pour la relecture, extraire la section 7 dans un fichier séparé, sans cette clé ni les sections 1 à 6.

| Lettre | Correction | Lettre | Correction | Lettre | Correction | Lettre | Correction |
|---|---|---|---|---|---|---|---|
| A | C24 | I | C27 | Q | C16 | Y | C04 |
| B | C08 | J | C05 | R | C26 | Z | C20 |
| C | C13 | K | C30 | S | C06 | AA | C31 |
| D | C29 | L | C15 | T | C12 | AB | C07 |
| E | C17 | M | C19 | U | C22 | AC | C25 |
| F | C02 | N | C03 | V | C01 | AD | C10 |
| G | C21 | O | C32 | W | C28 | AE | C18 |
| H | C11 | P | C09 | X | C14 | AF | C23 |

---

## 9. Tour 2 : réécritures après relecture croisée (27 passages sur 32 validés, ne plus y toucher)

> Verdicts : `docs/copy/relecture-corrections-s11/verdicts-relecteur-1/2/3.md`. À réécrire : C, F, G, R, AE (2 avis sur 3 ou faute objective), plus N par garde-fou (fait sur Frayssinet). Les avant/après ci-dessous REMPLACENT ceux de C13, C02, C21, C26, C18 et C03 en section 4. Tous sans tiret cadratin. Passages à relire à l'aveugle : `docs/copy/relecture-corrections-s11/passages-aveugle-tour2.md` (lettres P1 à P6, clé ci-dessous, à ne pas ouvrir avant les verdicts).

**C13 révisé (lettre C)** | article `citation-drole` | défauts : « Une précision honnête » (tic), « formules maison » (originalité invérifiable), ton de mention légale
- Avant (s11 du JSON) : `Une précision honnête : quelques-unes revisitent des classiques (l'auteur est cité quand on en est sûr), toutes les autres sont des formules maison. Pas de faux Churchill ici : tu peux les ressortir comme si elles venaient de toi.`
- Après final : `Quelques-unes revisitent des classiques, et on cite l'auteur quand on le connaît. Les autres, tu peux les ressortir comme si elles venaient de toi.`
- On n'affirme plus d'origine ; on dit seulement qu'il n'y a pas d'auteur à citer. Les citations attribuées (Wilde, vérifié) restent annotées dans la liste.

**C02 révisé (lettre F)** | article `avoir-confiance-en-soi-grace-a-l-humour` | défauts : « L'explication tient en une phrase » (tic), lien social non étayé par l'étude, nuance « bien choisie » perdue
- Avant (s11 du JSON) : `Une étude de l'Université de Stanford a montré que les personnes qui utilisent l'humour dans leurs interactions sociales développent une confiance en eux 40% plus élevée que la moyenne. L'explication tient en une phrase : l'humour crée du lien tout de suite.`
- Après final : `Les autres le remarquent aussi : des chercheurs de la Wharton School et de la Harvard Business School ont montré qu'une blague bien choisie fait paraître son auteur plus sûr de lui et plus compétent, donc mieux placé dans le groupe. À condition qu'elle tombe au bon moment : une blague déplacée fait l'effet inverse.`
- La phrase suivante du JSON (« Quand tu fais rire, tu ne subis plus la situation, tu y participes. ») est conservée telle quelle.
- Source relue (WebSearch, 12/10) : Bitterly, Brooks et Schweitzer, « Risky Business: When Humor Increases and Decreases Status », Journal of Personality and Social Psychology, 2017, huit expériences. Ce que dit l'étude : l'humour réussi augmente le statut, avec la confiance et la compétence perçues comme médiateurs ; raconter une blague signale la confiance quel que soit le résultat ; une blague inappropriée signale une faible compétence et fait baisser le statut ; dans une expérience, l'utilisateur d'humour efficace est plus souvent choisi comme chef du groupe suivant. Rien sur le « lien social ». Stanford n'est pas remis. https://doi.org/10.2139/ssrn.2656617 ; https://knowledge.wharton.upenn.edu/article/using-humor-in-the-office-when-it-works-when-it-backfires/ ; https://www.hbs.edu/ris/Publication%20Files/Bitterly%20Brooks%20Schweitzer%20JPSP%202016_54efbab5-2561-4408-b008-38d958e0ad50.pdf
- Cohérence avec la lettre V (neurosciences, validée) : la phrase V reste juste avant, sans doublon.

**C21 révisé (lettre G)** | article `comment-raconter-une-blague-sans-la-rater` | défauts : durée en désaccord avec Z, promesse trop forte
- Avant (s11 du JSON) : `Une pause de 2-3 secondes avant la punchline transforme un sourire en éclat de rire.`
- Après final : `Une seconde de pause avant la punchline, et un sourire peut devenir un éclat de rire.` (le début de la CLEF, « Le timing, c'est le silence entre deux notes : c'est lui qui donne envie d'entendre la suivante. », reste celui du JSON)
- **Valeur unique retenue : une seconde** (Z « une seconde environ », J « une seconde »). Restent à aligner, hors des 32 passages et non touchés ici : art. 9, exemple `[pause de 2 secondes, regard vers ton public]` (proposition : `[pause d'une seconde, regard vers ton public]`) ; art. 3, règle 3-2-1 (« 2 secondes de suspense ») qui est un rythme de scène complet et non une pause isolée, à garder ou à reformuler au choix de Thomas ; `blog-articles.ts` l.1570 (« 2-3 secondes »).

**C26 révisé (lettre R)** | article `etre-plus-a-l-aise-en-societe` | défauts : libellé sans rapport avec le contenu, seuils posés comme universels
- Avant (s11 du JSON) : `**Les codes universels à connaître :**` puis `- **Le timing des salutations** : 15 minutes de retard, c'est de la décontraction. 45 minutes, c'est de l'irrespect déguisé en nonchalance.`
- Après final : `**Les codes de base à connaître :**` puis `- **L'heure d'arrivée** : à un dîner, 15 minutes de retard passent pour de la décontraction. 45 minutes, pour de l'irrespect déguisé en nonchalance. En soirée, c'est beaucoup plus souple.`
- Les seuils sont rattachés à un contexte (dîner) et l'exception soirée est dite ; « universels » disparaît de l'intertitre gras (ce n'est pas un H2).

**C18 révisé (lettre AE)** | article `comment-improviser-des-blagues` | défauts : « Il existe des… », « incontournables » (corporate), « grande majorité des situations » (invérifiable)
- Avant (s11 du JSON) : `Il existe des **schémas humoristiques** qui fonctionnent dans 90% des situations. Voici les 5 incontournables :`
- Après final : `Certains **schémas humoristiques** reviennent d'un sketch à l'autre, et tu peux les piquer sans scrupule. En voici 5, à garder sous le coude :`
- Plus aucun pourcentage dans cette phrase (le « 80% » de la CLEF est gardé, règle du 08/10). « Ces patterns sont partout dans le stand-up » plus bas n'est pas répété.

**C03 révisé (lettre N)** | article `blague-courte-arme-secrete-humour` | garde-fou P0 s15 : vérifier, ne pas retirer Frayssinet
- Verdict du fait : **non étayé, et plutôt contredit.** Les descriptions trouvées de ses spectacles parlent d'humour absurde, de « flights of fancy » parfois difficiles à suivre, de parcours d'anecdotes (Corse, hôtel breton), pas de punchlines ultra-courtes. La Presse (2017) : https://www.lapresse.ca/arts/festivals/juste-pour-rire/critiques/201707/17/01-5116820-le-savoureux-delire-de-roman-frayssinet.php ; TheTVDB, synopsis de « O dedans » : https://thetvdb.com/movies/roman-frayssinet-o-dedans/people ; Sans Crier Art : https://www.sanscrierart.com/2026/08/roman-frayssinet-o-dedans.html. On garde Frayssinet, on change la qualité illustrée : l'anecdote longue, mais le rire vient de la phrase qui tombe au bon endroit.
- Avant (s11 du JSON) : `Regarde Roman Frayssinet : ses meilleures punchlines durent moins de 5 secondes. Un setup de 5 mots, une chute de 4, et la salle est déjà partie.`
- Après final : `Regarde Roman Frayssinet : ses spectacles sont pleins d'anecdotes et de digressions, mais ce qui fait éclater la salle, c'est la phrase qui tombe au bon endroit. Un setup court, une chute plus courte encore, et c'est parti.`
- Le « la salle est déjà partie » ambigu disparaît. La phrase suivante (« Compare avec ton pote qui raconte l'histoire du gars qui entre dans un bar avec un pingouin… ») enchaîne toujours.
- Cohérence : Z (« écoute ses silences avant certaines punchlines »), validée, reste vraie avec ce portrait.

**Clé du tour 2 (NE PAS OUVRIR AVANT LES VERDICTS)** : P1 = C26 révisé (R) ; P2 = C03 révisé (N) ; P3 = C18 révisé (AE) ; P4 = C13 révisé (C) ; P5 = C21 révisé (G) ; P6 = C02 révisé (F).

**Non touchés malgré une note isolée** : AD (« dans la veine de Fary », 1 avis sur 3 demande de préciser que la blague est imaginée), K/U/AC (éloges de Waly Dia, avis non chiffrés, à vérifier sur un extrait précis, pas à retirer), AF (le prix 2,99 € doit rester celui de `/abonnement` à la mise en ligne), AB (« avec leur décryptage » à confirmer côté produit : non vérifié dans le code).

---

## 10. Application (@fullstack, 12/10/2026, non commité)

**32/32 corrections appliquées** dans `apps/web/src/data/blog-article-rewrites.json` : C01, C04 à C12, C14 à C17, C19, C20, C22 à C25, C27 à C32 en version §4 (26) ; C02 (F), C03 (N), C13 (C), C18 (AE), C21 (G), C26 (R) en version §9 (6), correspondance vérifiée par les clés §8 et §9. 36 remplacements exacts (C14 : 2 lignes, C16 : 3 lignes, C26 : 2), extraits par script de ce fichier (aucune recopie à la main), chaque « avant » trouvé exactement une fois, aucun refus. C32 : « avant » tronqué par « … » appliqué sur son préfixe exact.

**Passage R (demande coordinateur, doublon relevé par les 3 relecteurs)** : « **Les codes … à connaître :** » était le seul intertitre gras de la liste (le gras suivant, « **Comment garder ta personnalité dans tout ça ?** », ouvre un paragraphe hors liste). Ligne supprimée, aucun autre mot touché : « Voici les essentiels : » est suivi directement de « - **L'heure d'arrivée** : … ».

**Tirets cadratins** : `stripEmDashes` (même fonction que `stripBlogEmDashesTask`) appliqué à `content` et `metaDescription` : 59 tirets retirés à la source, 0 restant hors titres. `BLOG_EM_DASH_PATCH_VERSION` reste à 3. Le tiret de la ligne J donne « **Un silence d'une seconde avant la chute** : juste assez… » (deux-points, règle des puces), identique à ce qui est en ligne, alors que la liste à l'aveugle affichait une virgule. Reste 1 « — » dans l'`excerpt` de `comment-raconter-une-blague-sans-la-rater` (champ hors périmètre, non touché par la tâche des tirets).

`_meta.version` 3 → 4. `blog-liens-s4-s20.ts` : chaînes de l'appariement 10 alignées sur C07 (§6, tâche non branchée).

**Diff réel v3 → v4** (`content` + `metaDescription`, jetons séparés par des espaces ; « % changé » = jetons remplacés, retirés ou ajoutés / jetons v3 ; « dont tirets » = part due au seul retrait des « — »). H2/H3 et liens comparés liste contre liste (texte et URL) ; slug et excerpt inchangés partout. Seul `comment-improviser-des-blagues` a sa FAQ dans le JSON : section identique au caractère près. Les 5 phrases S4 sont intactes (tests `blog-liens-s4-s20`).

| Article | Mots v3 | Mots v4 | % changé | dont corrections | dont tirets | % caractères | H2/H3 | Liens |
|---|---|---|---|---|---|---|---|---|
| `avoir-confiance-en-soi-grace-a-l-humour` | 1600 | 1619 | 5,5 % | 5,0 % | 0,5 % | 4,5 % | = (24) | = (8) |
| `blague-courte-arme-secrete-humour` | 1960 | 1953 | 4,8 % | 4,1 % | 0,8 % | 3,7 % | = (10) | = (9) |
| `blague-drole-7-criteres-pepite` | 1945 | 1947 | 2,1 % | 2,1 % | 0 % | 2,2 % | = (15) | = (9) |
| `citation-drole` | 1851 | 1837 | 2,1 % | 2,1 % | 0 % | 1,4 % | = (27) | = (10) |
| `comment-improviser-des-blagues` | 1920 | 1940 | 3,2 % | 3,1 % | 0,2 % | 2,3 % | = (31) | = (9) |
| `comment-raconter-une-blague-sans-la-rater` | 2009 | 2012 | 2,2 % | 2,0 % | 0,2 % | 1,5 % | = (8) | = (11) |
| `etre-plus-a-l-aise-en-societe` | 2067 | 2061 | 2,0 % | 2,0 % | 0 % | 1,9 % | = (22) | = (6) |
| `jeu-de-mots-drole-techniques-creer` | 2185 | 2205 | 1,9 % | 0,9 % | 1,0 % | 1,0 % | = (35) | = (9) |
| `techniques-humoristes-pros` | 1648 | 1643 | 0,9 % | 0,5 % | 0,4 % | 0,5 % | = (8) | = (8) |
| **Total** | **17 185** | **17 217** | **2,7 %** | | | | | |

Non touchés (hors périmètre) : « pause de 2 secondes » (art. 9) et règle 3-2-1 (décision Thomas en attente), « 2,99 EUR » de `blog-articles.ts`. Métas > 155 caractères déjà en v3 et non corrigées : `avoir-confiance…` 160, `comment-raconter…` 159, `techniques-humoristes-pros` 156.
