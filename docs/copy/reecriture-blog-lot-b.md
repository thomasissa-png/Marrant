# Réécriture blog — lot B (s11, passe 2 bis) — 29/09/2026

> Fichier modifié : `apps/web/src/lib/blog-articles.ts` (worktree `wt-blog-b`). Charte : `docs/copy/charte-refonte-copy-s11.md`. Brief : `docs/copy/brief-reecriture-blog-s11.md`.
> Intacts : slugs, titres, H2/H3, questions de FAQ, liens internes, chiffres (tous conservés, les douteux sont signalés). `updatedAt: "2026-09-29"` présent sur les 12 articles.
> Méthode : un article à la fois — inventaire exhaustif numéroté → verdict (GARDER / RÉÉCRIRE) → défauts de prose → Edit.

## Bilan global

**240 exemples/formulations inventoriés sur 12 articles — 180 réécrits (75 %), 60 gardés.**
Le décompte mélange les vannes/répliques citées et les formulations « punch » de la prose (capitales criées, staccato, CTA). Sur les seules listes de vannes, le taux est du même ordre : `phrases-droles-conversations` 25/33 réécrites.

| Article | Audit | Exemples | Réécrits | Réponse citable en tête |
|---|---|---|---|---|
| comment-devenir-drole | 2,8 | 18 | 13 | « En bref » existant gardé, intro resserrée |
| comment-avoir-de-la-repartie | 2,8 | 20 | 17 | « En bref » ajouté |
| timing-humour | 2,8 | 22 | 19 | « En bref » ajouté |
| 5-types-humour-lequel-pour-toi | 3,0 | 15 | 12 | « À retenir » remonté en tête (« En bref ») |
| phrases-droles-conversations | 2,6 | 33 | 25 | — (catalogue) |
| comment-faire-rire-une-fille | 2,8 | 19 | 15 | réponse courte ajoutée au 2e paragraphe |
| erreurs-blagues | 3,4 | 17 | 13 | — |
| autoderision-interactions | 3,4 | 18 | 13 | — |
| repartie-debutant-5-etapes | 3,2 | 19 | 13 | — |
| humour-quotidien-8-habitudes | 3,2 | 25 | 16 | — |
| humour-noir-utiliser-sans-blesser | 3,0 | 12 | 9 | — |
| exercices-developper-humour | 3,6 | 22 | 15 | — |

**Doublons inter-articles traités (liste audit)** : trope « mon corps m'a envoyé X / objet qui porte plainte » retiré de mes 3 articles concernés (`comment-devenir-drole`, `comment-avoir-de-la-repartie`, `humour-quotidien`) — il ne reste que « mail de rupture » dans `raconter-blague-sans-massacrer` (hors lot) ; « pompiers » retiré des 2 emplacements ; « réunion / testament » retiré ; « disséquer grenouille / papillon » retiré des 2 articles ; DJ reggaeton + serveur désormais uniquement dans `comment-faire-rire-une-fille` (l'autre agent doit les retirer de `comment-faire-rire-un-homme`). Doublons internes au lot supprimés : rebond « toujours en retard / samedi », setup « Tu manges encore ? », « 30 observations / au moins 10 », « on va faire court / aller à l'essentiel », « monte, monte, monte ».

**Non modifié (volontairement)** : slugs, titres, H2/H3 (y compris ceux en capitales : « Le contexte est ROI », « (BON humour noir) », « Quand ça ne marche PAS », « L'art de la **phrase drôle** »), questions de FAQ, liens internes, tous les chiffres, excerpts (meta descriptions : certains restent en staccato ou reprennent une image retirée du corps — « nitroglycérine » implicite dans `humour-noir`, « Le problème ? Pas ta blague. Ton timing. » dans `timing-humour` — à revoir côté SEO si souhaité). Aucune nouvelle personnalité réelle ajoutée ; une mention de David Pujadas retirée (`comment-avoir-de-la-repartie`, remplacée par « ton du 20h »). Aucune mention d'IA, aucun concurrent. `meilleures-blagues-droles-2026` non touché. `updatedAt: "2026-09-29"` déjà présent sur les 12 articles.

**Build** : pas d'accès shell dans cette session — `npx tsc --noEmit && npx next lint && npm run build` à lancer avant commit. Toutes les modifications sont à l'intérieur de chaînes existantes (template literals et chaînes FAQ), sans backtick ni `${` ajouté.

---

## 1. `comment-devenir-drole` (pilier, audit 2,8/5)

**Réponse directe citable** : l'« En bref » en tête (3 phrases) est conservé mot pour mot, il répond déjà à la question. C'est l'intro qui suit qui tardait : l'oncle arrivait deux fois (excerpt + intro) et « Spoiler : » faisait remplissage. Intro resserrée à 3 phrases.

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « Généralement, c'est le même oncle qui raconte la même blague sur les blondes depuis 2003. Lui, il est "né drôle", paraît-il. Spoiler : l'humour est une compétence… » | RÉÉCRIRE (tic « Spoiler », 2 phrases pour 1 idée) | « Celui qui dit ça, c'est souvent l'oncle qui raconte la même blague sur les blondes depuis 2003. Il est "né drôle", paraît-il. L'humour est une compétence, pas un chromosome : ça s'apprend. » |
| 2 | « Derrière chaque "naturel", il y a un disque dur plein de vannes ratées. C'est rassurant, non ? » | RÉÉCRIRE (chute-question molle) | « Derrière chaque "naturel", il y a des centaines de bides que personne n'a filmés. » |
| 3 | « 8 semaines. C'est moins que le temps qu'il faut pour apprendre à faire un créneau. » | RÉÉCRIRE (staccato, bonne idée) | « 8 semaines : moins que ce qu'il faut à la plupart des gens pour réussir un créneau. » |
| 4 | « Mais c'est EXACTEMENT ça » | RÉÉCRIRE (capitales) | « mais c'est exactement ça » |
| 5 | « Le collègue qui répond "bien et toi ?" sans écouter la réponse. » | RÉÉCRIRE (constat sans twist, doublon d'idée avec le n°7) | « Le collègue qui répond "bien et toi ?" à "bon week-end !". » |
| 6 | « Le mec qui fait semblant de chercher dans son sac au moment de payer au resto. » | GARDER (observation juste, relatable) | — |
| 7 | « …alors que LE MEC S'EN FICHE COMPLÈTEMENT de comment tu vas. » | RÉÉCRIRE (capitales, explication) | « Le mail pro qui commence par "J'espère que tu vas bien", envoyé par quelqu'un qui n'a jamais attendu la réponse. » |
| 8 | « et BOOM — la chute est aux antipodes » | RÉÉCRIRE (staccato interdit §5) | « …et il atterrit à l'exact opposé de là où tu l'attendais. » |
| 9 | « Comme GPS qui recalcule, mais en drôle. » | RÉÉCRIRE (filler « mais en drôle », faute d'article) | « Un GPS qui recalcule, mais exprès. » |
| 10 | Exemple nul : « J'ai essayé le yoga. C'est dur. » | GARDER (contre-exemple pédagogique voulu) | — |
| 11 | « J'ai essayé le yoga. Mon corps m'a envoyé une lettre de démission. » | RÉÉCRIRE (trope « mon corps m'a envoyé X » saturé, 4 occurrences sur le blog) | « J'ai essayé le yoga. La prof a corrigé ma posture, puis elle est allée chercher une collègue. » |
| 12 | « débitent leur blague comme un communiqué de presse » | GARDER (image juste, courte) | — |
| 13 | « Tu ris AVEC lui, pas de lui. » | RÉÉCRIRE (capitales) | « Tu ris avec lui, jamais de lui. » |
| 14 | « (Oui, celui-ci inclus. C'est l'ironie du truc.) » + « en ESSAYANT de faire rire » | RÉÉCRIRE (chute qui s'explique, capitales) | « (Oui, celui-ci compris. On assume.) » + « en essayant de faire rire » |
| 15 | « en scrollant LinkedIn (mine d'or d'absurdité involontaire) » | GARDER | — |
| 16 | « Tu fais de la R&D comique. » | GARDER | — |
| 17 | « C'est le mec qui dit "ATTENDS j'ai une blague" et qui tue l'ambiance avant même d'avoir commencé. » | RÉÉCRIRE (capitales, chute longue) | « C'est le mec qui annonce "attends, j'ai une blague" : l'ambiance meurt avant la blague. » |
| 18 | CTA « C'est 0,99 EUR/mois — moins cher qu'un café. Et beaucoup plus drôle. » | RÉÉCRIRE (« moins cher qu'un café » = cliché pub, chute plate) | « C'est 0,99 EUR/mois : moins cher qu'un café, et ça t'empêche pas de dormir. » |

**Bilan** : 18 exemples, 13 réécrits, 5 gardés.

**Défauts de prose traités** : capitales criées (EXACTEMENT, LE MEC S'EN FICHE, AVEC, ESSAYANT, ATTENDS) ; staccato « BOOM » ; « Spoiler : » ; « C'est rassurant, non ? » ; « La différence ? » (question rhétorique → phrase) ; « Des vannes à mémoriser » → « à ressortir » (charte §5) ; « se sent à 10 kilomètres » gardé (chiffre comique).

**Chiffres / citations douteux (gardés, signalés)** : « Université du Nouveau-Mexique / mécanismes cognitifs » et « Journal of Positive Psychology / 8 semaines » (aucune source) ; « Waly Dia : taux de réussite de 30 % à ses débuts » (attribution non sourcée) ; « les pros ont un taux de réussite de 60-70 % » ; « Blanche Gardin a mis plus de 10 ans… » (parcours à vérifier).

---

## 2. `comment-avoir-de-la-repartie` (pilier, audit 2,8/5)

**Réponse directe citable** : l'article ouvrait sur une scène (écran bleu) et ne répondait qu'au 3e bloc. Ajout d'un « En bref » en tête, construit uniquement avec le contenu de la CLEF existante (réflexes, 3 techniques, 5 minutes/jour, 2 à 4 semaines) — aucun chiffre nouveau.

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « Ton cerveau fait l'écran bleu de Windows. Bouche ouverte. Rien ne sort. » | RÉÉCRIRE (staccato en triplet) | « ton cerveau affiche un écran bleu, rien ne sort » (phrase fluide) |
| 2 | « la réplique PARFAITE te vient sous la douche, 2 heures plus tard. Comme si ton cerveau avait un délai de livraison. » | RÉÉCRIRE (capitales ; bonne idée, chute attendue) | « …la réplique parfaite arrive sous la douche, 2 heures plus tard. Ton cerveau livre bien, mais en point relais. » |
| 3 | « testées en soirée, en réunion et à la machine à café » | RÉÉCRIRE (prospectus, audit) | « En voici 10, de la plus simple à la plus culottée. » |
| 4 | Définition : « Comme les arts martiaux : les mouvements sont répétés jusqu'à devenir automatiques. » | RÉÉCRIRE (comparaison paresseuse, audit) | « Ceux qui ont l'air d'improviser ont surtout beaucoup répété. » |
| 5 | « C'est le "chargement en cours" de la répartie. » | GARDER (image juste, courte) | — |
| 6 | « Toujours ? Non, l'autre jour j'étais pile à l'heure. Sauf que c'était un samedi et le bureau était fermé. » | RÉÉCRIRE (setup bavard, bonne chute) | « Toujours ? Non. Une fois, j'étais pile à l'heure. Le bureau était fermé, on était samedi. » |
| 7 | « Et toi, tu surveilles encore ce que mangent les gens ? Tu songes à une reconversion dans la nutrition ? » | RÉÉCRIRE (chute filler longue, audit) | « Et toi, tu surveilles encore mon assiette ? C'est un métier ou un hobby ? » |
| 8 | « Quelqu'un fait une remarque, et hop — retour à l'envoyeur, mais en plus drôle. » | RÉÉCRIRE (« et hop », « mais en plus drôle » = filler) | « Une remarque du public, et elle repart à l'envoyeur avec un supplément. » |
| 9 | « expliquer une vanne, c'est comme disséquer une grenouille : techniquement instructif, mais la grenouille meurt… » | RÉÉCRIRE (citation connue, doublon avec `erreurs-blagues`) | « une pique qu'on explique, c'est un tour de magie refait au ralenti : plus personne n'applaudit. » |
| 10 | « Bonus : ça te donne du temps pour préparer ta contre-attaque pendant que l'autre s'enlise. » | GARDER | — |
| 11 | « Merci, et sinon t'as vu que les chercheurs ont appris à un pigeon à jouer au ping-pong ? Le monde est fou. » | RÉÉCRIRE (filler final qui tue le twist, audit) | « Merci. Et sinon, tu savais que des chercheurs ont appris à un pigeon à jouer au ping-pong ? » |
| 12 | « Et c'est ça, le vrai pouvoir. » | RÉÉCRIRE (cliché) | supprimé, phrase précédente suffit |
| 13 | « Fatigué ? Je suis au-delà. Je suis à un stade où mon oreiller a déposé une main courante pour harcèlement. Mon lit me ghoste. » | RÉÉCRIRE (2 chutes, trope « objet qui porte plainte » saturé sur le blog) | « Fatigué ? Je suis au-delà. Hier, j'ai bâillé pendant ma sieste. » |
| 14 | « il part d'une observation banale et monte, monte, monte… chaque cran doit être PLUS surprenant » | RÉÉCRIRE (répétition staccato, capitales) | « il part d'une observation banale et grimpe cran par cran… chaque cran doit surprendre plus que le précédent » |
| 15 | « Bizarre par rapport à qui ? À toi ? Parce que si tu es la norme, on est tous bizarres, non ? » | RÉÉCRIRE (moralisant, audit) | « Bizarre par rapport à qui ? À toi ? » |
| 16 | « Ah, tu as remarqué ! Ça veut dire que tu m'écoutes. C'est le plus beau jour de ma vie. » | RÉÉCRIRE (chute usée, audit) | « Ah, tu as remarqué ? Donc tu m'écoutes. On avance, tous les deux. » |
| 17 | Miroir : « (ton de David Pujadas) "T'es bizarre. Mesdames, messieurs, bonsoir." L'effet est immédiat et imparable. » | RÉÉCRIRE (chute à l'envers, « imparable » = cliché) | « (ton du 20h) "Mesdames, messieurs, bonsoir. Ce soir, en France : je suis bizarre." » |
| 18 | « Un sourire confiant. Un regard amusé. Et le silence. » | RÉÉCRIRE (staccato) | « un sourire, un regard amusé, et du silence. » |
| 19 | « Le silence dit : "Ta remarque ne mérite même pas que je dépense des mots." » | GARDER | — |
| 20 | CTA « 0,99 EUR/mois — c'est le prix d'une répartie ratée en moins par jour. » | RÉÉCRIRE (calcul flou, pas de retournement) | « 0,99 EUR/mois : de quoi arrêter de répondre sous la douche. » (callback de l'intro) |

**Bilan** : 20 exemples, 17 réécrits, 3 gardés.

**Défauts de prose traités** : intro sans réponse (En bref ajouté) ; capitales (PARFAITE, UN mot, PLUS) ; « Bonne nouvelle : » ; « La plus simple. La plus sous-estimée. » (staccato → phrase) ; « si il » → « s'il » ; « tellement random » → « tellement inattendue » ; « désarme à tous les coups » et « immédiat et imparable » remplacés par l'explication concrète du mécanisme ; « vannes à mémoriser » → « à ressortir ».

**Chiffres / citations douteux (gardés, signalés)** : « mieux que 80 % des gens » (pas de source) ; « Blanche Gardin peut tenir un silence de 5 secondes » (à vérifier) ; « parcours Répartie de 4 semaines » (vérifier que la durée correspond au parcours réel).

---

## 3. `timing-humour` (pilier, audit 2,8/5)

**Réponse directe citable** : ajout d'un « En bref » en tête, bâti sur le contenu existant de « À retenir » (pause de 2 à 3 secondes, tension, moment social). L'intro passait par « Tu te dis "mais WTF". Je vais te dire WTF » : « je » narratif de la marque (interdit charte §1.3) + anglicisme familier → réécrite.

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « Puis un pote raconte EXACTEMENT la même chose… Tu te dis "mais WTF". Je vais te dire WTF : le problème, c'était pas ta blague. » | RÉÉCRIRE (capitales, « je » de marque, remplissage) | « 10 minutes plus tard, un pote raconte exactement la même, et la table explose. Le problème, c'était pas ta blague, c'était ton timing. » |
| 2 | « "Je t'aime" et "Je t'aime... toi aussi Sandrine." » | GARDER (exemple fort, audit) | — |
| 3 | « Mêmes mots. Résultats très, très différents. » | RÉÉCRIRE (staccato, chute plate) | « Presque les mêmes mots, pas du tout la même soirée. » |
| 4 | « il REGARDE le public… en "mais il va dire quoi ??" » | RÉÉCRIRE (capitales, ponctuation doublée) | « il regarde le public… en mode "mais il va dire quoi ?" » |
| 5 | « (On a tous ce pote. Ne sois pas ce pote.) » | RÉÉCRIRE (formule mème connue) | « (On a tous ce pote, et on a tous arrêté de lui raconter des trucs.) » |
| 6 | « le train est parti, le moment est mort, tu es resté sur le quai avec ta vanne » | RÉÉCRIRE (triplet, image diluée) | « le train est parti et tu es resté sur le quai avec ta vanne » |
| 7 | « 3 secondes. Le sweet spot. Ça donne l'impression que tu réfléchis » | RÉÉCRIRE (staccato + anglicisme) | « 3 secondes, c'est le bon dosage : assez pour avoir l'air de réfléchir, pas assez pour avoir l'air de dormir. » |
| 8 | « La plupart des gens ont peur du silence. Comme s'il allait les mordre. » | RÉÉCRIRE (image gratuite) | « …ont peur du silence : trois secondes sans parler et ils ont l'impression d'avoir cassé la soirée. » |
| 9 | « ils débitent leur blague à la vitesse d'un CGV » | RÉÉCRIRE (comparaison paresseuse, audit ; « un CGV » fautif) | « ils débitent leur blague comme les mentions légales à la fin d'une pub radio » |
| 10 | « C'est comme jouer de la musique sans silences entre les notes : ça s'appelle du bruit. » | RÉÉCRIRE (moralisant, audit) | « Sans silences entre les notes, c'est plus de la musique : c'est du bruit. » |
| 11 | « Le silence EST la blague. » | RÉÉCRIRE (capitales) | « Le silence, c'est la blague. » |
| 12 | « freine BRUTALEMENT… et PAF, le freinage te projette dans le rire » | RÉÉCRIRE (capitales + staccato interdit) | « freine d'un coup avant la chute… ton cerveau est lancé à pleine vitesse, et le coup de frein le projette dans le rire » |
| 13 | « Voici la structure secrète en 4 étapes » | RÉÉCRIRE (« secrète » = racolage) | « Voici la structure en 4 étapes » |
| 14 | « ou est-ce qu'on parle du licenciement de Kevin ? » | RÉÉCRIRE (« Kevin » = prénom-cliché moqueur) | « ou est-ce qu'on parle du pot de départ de quelqu'un qui ne voulait pas partir ? » |
| 15 | « comme mettre du ketchup sur un soufflé — techniquement possible, mais personne ne te le pardonnera » | RÉÉCRIRE (longue, audit) | « c'est du ketchup sur un soufflé : techniquement légal. » |
| 16 | « Le silence naturel quand tout le monde boit une gorgée en même temps » | GARDER (observation juste) | — |
| 17 | « Quand tu es le seul à trouver que c'est le bon moment (spoiler : c'est pas le bon moment) » | RÉÉCRIRE (chute qui s'explique) | parenthèse coupée : la ligne se suffit |
| 18 | « C'est TRÈS inconfortable au début. Mais l'effet… est radical. » | RÉÉCRIRE (capitales, promesse creuse) | « Au début, tu vas avoir l'air de buguer. Ensuite, tu auras l'air de réfléchir. » |
| 19 | « marque une pause AVANT la chute… essaie une fois et tu seras converti » | RÉÉCRIRE (capitales, cliché) | « marque une pause avant la chute… essaie une fois : la différence se voit sur les visages » |
| 20 | CTA « et tu ne raconteras plus jamais une blague trop tôt (ni trop tard) » | RÉÉCRIRE (sur-promesse) | « et tes blagues arriveront enfin à l'heure » |
| 21 | FAQ : « Trois exercices qui changent tout » / « Le silence est ton allié, pas ton ennemi. » | RÉÉCRIRE (clichés) | « Trois exercices » / « Laisse le silence bosser pour toi. » |
| 22 | FAQ : « Une bonne blague au mauvais moment... fait rien. » | GARDER | — |

**Bilan** : 22 exemples/formulations, 19 réécrits, 3 gardés.

**Défauts de prose traités** : pas de réponse en tête (En bref ajouté) ; « je » de marque ; 7 capitales criées ; staccato (PAF, « 3 secondes. Le sweet spot. », « Mêmes mots. ») ; « tombe a plat » → « à plat » ; « Les MAUVAIS moments » → minuscules ; « QUAND » dans la CLEF → « quand ». Excerpt (meta description) non modifié.

**Chiffres douteux (gardés, signalés)** : « le timing social représente 50 % du succès d'une blague » (aucune source) ; « silences de 3-4 secondes » chez Roman Frayssinet et « immobile 5 secondes » chez Blanche Gardin (observations non sourcées).

---

## 4. `5-types-humour-lequel-pour-toi` (pilier, audit 3,0/5)

**Réponse directe citable** : le bloc « À retenir » (les 5 types + « la plupart des gens drôles combinent 2-3 types ») arrivait après un paragraphe de remplissage (« l'humour n'est pas un bloc monolithique »). Il passe en tête sous « En bref », mot pour mot ; l'intro est réduite à 3 phrases.
Note audit : la réunion/testament et l'enterrement/croissant ne sont plus dans cet article (déjà retirés) ; ils restent dans `humour-noir-utiliser-sans-blesser`, traités là-bas. La citation Blanche Gardin (psy) est aussi dans `humour-noir`, pas ici.

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « "ça, c'est MON type d'humour" ? Ce sentiment de reconnaissance, c'est parce que l'humour n'est pas un bloc monolithique… » | RÉÉCRIRE (capitales, remplissage, réponse tardive) | « "ça, c'est mon humour" ? C'est que tu as déjà un style, même si tu ne l'as jamais nommé. Le trouver, c'est le moyen le plus simple d'être drôle sans forcer. » |
| 2 | Frayssinet : « tu ris parce que c'est TOI… parce que c'est EXACTEMENT ça » | RÉÉCRIRE (capitales) | « tu ris parce que c'est toi… parce que c'est exactement ça » |
| 3 | « Tu dis souvent "nan mais c'est vrai quoi". » | GARDER (portrait juste) | — |
| 4 | « Les gens rient AVEC toi, pas de toi. » | RÉÉCRIRE (capitales ; formule déjà dans `comment-devenir-drole`) | « Et quand tu racontes une galère, les gens rient avec toi, jamais contre toi. » |
| 5 | « "Mon médecin m'a dit de faire du sport. J'ai pris rendez-vous chez un autre médecin." » (présentée dans le paragraphe Paul Mirabel) | RÉÉCRIRE (vieille blague connue, attribution implicite à Mirabel → détachée) | Exemple d'escalade absurde : « Mon médecin m'a dit de marcher tous les jours. Je l'ai écouté. Là, je suis en Belgique. » |
| 6 | « L'absurde, c'est la liberté totale. » | RÉÉCRIRE (cliché) | « L'absurde n'a qu'une règle : suivre sa propre logique jusqu'au bout. » |
| 7 | « "Ça va, mais mes plantes me jugent" » | RÉÉCRIRE (cliché Instagram, audit) | « "Ça va. Mon grille-pain et moi, on s'est réconciliés." » |
| 8 | « pas le calembour de tonton qui nécessite 3 minutes d'explication » | GARDER | — |
| 9 | « en changeant UN mot dans une phrase » | RÉÉCRIRE (capitales) | « en changeant un seul mot » |
| 10 | « "Qui vivra verra" → "Qui vivra, Vera. C'est une prophétie sur une meuf qui s'appelle Vera." » | RÉÉCRIRE (calembour phonétique pur, interdit §3 ; « meuf ») | Consigne recentrée sur la polysémie (prendre l'expression au pied de la lettre) : « "Mettre de l'eau dans son vin" → "J'ai mis de l'eau dans mon vin. Mon oncle ne m'adresse plus la parole." » |
| 11 | « (ou soupirent avec un sourire) » | GARDER | — |
| 12 | « C'est de la dynamite comique — puissant mais dangereux si mal dosé. » | RÉÉCRIRE (cliché ; doublon d'image avec la « nitroglycérine » de `humour-noir`) | « C'est le piment du placard : une pincée relève tout, une cuillère gâche le repas. » |
| 13 | « Mais attention : le contexte est TOUT. Ce qui marche avec tes potes ne marche pas avec ta grand-mère. » | RÉÉCRIRE (capitales, formule plate) | « Mais le contexte décide de tout : ce qui passe entre potes ne passe pas forcément au repas de Noël. » |
| 14 | « Un observationnel qui ajoute de l'absurde, c'est redoutable. Un autodérisif qui ajoute des jeux de mots, c'est irrésistible. » | RÉÉCRIRE (staccato publicitaire) | « Un observateur qui s'autorise un peu d'absurde, ou un autodérisif qui glisse un jeu de mots, ajoute une surprise de plus à chaque vanne. » |
| 15 | CTA « 0,99 EUR/mois — pour trouver ta voix comique et la développer. » | RÉÉCRIRE (plat) | « 0,99 EUR/mois, et ton style arrête d'être un secret, même pour toi. » |

**Bilan** : 15 exemples/formulations, 12 réécrits, 3 gardés.

**Défauts de prose traités** : intro de remplissage ; 5 capitales ; staccato publicitaire ; attribution implicite d'une vieille blague à Paul Mirabel retirée. H2 (« Tu l'as ? Tu l'as ? », « Trop loin ? Pas assez loin. ») conservés.

**Citations / faits douteux (gardés, signalés)** : les sketchs attribués à Roman Frayssinet (« gens dans le métro », « messages vocaux de 7 minutes de ta mère ») ne sont pas sourcés ; « Fary glisse des jeux de mots » (classement de Fary en « jeux de mots » discutable).

---

## 5. `phrases-droles-conversations` (fort volume, audit 2,6/5)

Toutes les phrases numérotées gardent leur numéro et leur section. Les consignes « → *contexte* » sont ajustées quand la vanne change.

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « Je suis pas en retard, je suis en décalage horaire émotionnel. » | RÉÉCRIRE (tic « je suis pas X, je suis Y émotionnel », pas de retournement) | « Je suis pas en retard. Je vous ai laissé le temps de faire le café. » |
| 2 | « Ce café a le même goût que mes perspectives de carrière : amer et tiède. » | GARDER (chute « tiède » juste) | — |
| 3 | « J'ai lu mon horoscope ce matin, il disait 'restez chez vous'. J'aurais dû écouter. » | GARDER (court, net) | — |
| 4 | « Je suis au régime. Je ne mange que de la nourriture qui me rend triste. Donc en gros, la cantine. » | RÉÉCRIRE (économie : la consigne dit « le twist doit arriver vite ») | « Je suis au régime : je mange que ce qui me rend triste. Donc la cantine. » |
| 5 | « Mon week-end ? J'ai rangé un tiroir. Le tiroir de ma vie était plein aussi, mais ça c'est pour la thérapie. » | RÉÉCRIRE (chute bavarde qui explique sa métaphore) | « Mon week-end ? J'ai rangé un tiroir. Un seul. Il m'a fallu le dimanche pour m'en remettre. » |
| 6 | « Je pense que ma boîte mail me ghoste. J'envoie des trucs, personne ne répond. » | RÉÉCRIRE (la 2e phrase explique la 1re) | « Ma boîte mail, c'est un journal intime : j'écris, personne répond. » |
| 7 | « Je suis venu en Uber. Enfin, c'est mon anxiété sociale qui conduit, moi je suis passager. » | RÉÉCRIRE (métaphore filée qui s'explique) | « J'ai failli pas venir. La dernière fois, c'était dans l'ascenseur. » |
| 8 | « J'ai une mémoire incroyable. Je me souviens de chaque moment gênant de ma vie. En boucle. À 3h du mat. » | RÉÉCRIRE (mème connu, staccato) | « J'ai une mémoire incroyable. Elle me réveille à 3h du mat pour me rappeler un truc que j'ai dit en CM2. » |
| 9 | « J'ai mis 'spontané' sur mon profil. En vrai, j'ai besoin de 48h de préavis et d'un plan B. » | RÉÉCRIRE (même amorce que la n°17 de la page n°1 « Sur mon profil j'ai mis… ») | « Je suis très spontané. Il me faut juste 48h de préavis. » |
| 10 | « Je suis bilingue : je parle français et mauvaises décisions. » | RÉÉCRIRE (cliché Twitter, audit) | « Je suis bilingue : français et "vas-y, on verra bien". » |
| 11 | « J'ai commencé une série hier. J'en suis à la saison 3. Quelqu'un devrait vérifier si je suis en vie. » | RÉÉCRIRE (chute cliché ; contexte incohérent) | « J'ai commencé une série hier soir. Je suis à la saison 3 et je connais mieux leur famille que la mienne. » (contexte : « Quand on te demande ce que t'as fait de ton week-end ») |
| 12 | « Être adulte c'est dire 'on se fait un truc bientôt' et ne jamais se revoir. » | RÉÉCRIRE (mème très répandu) | « La dernière fois, on s'était dit "on se fait un truc bientôt". Voilà. C'est ça, le truc. » |
| 13 | « Mon médecin m'a dit de manger équilibré. Alors je mets du Nutella des deux côtés de la tartine. » | RÉÉCRIRE (vanne de forum connue, audit ; amorce « Mon médecin m'a dit » déjà prise) | « Je mange équilibré : un dessert dans chaque main. » |
| 14 | « Je te préviens, je suis beaucoup plus drôle par message. En vrai c'est une version bêta. » | GARDER | — |
| 15 | « Mon dernier date Tinder m'a dit que j'étais 'intéressant'. C'est le 'bien' des compliments. » | GARDER (observation fine) | — |
| 16 | « Je suis le genre de personne qui prépare des sujets de conversation dans le métro en venant. Et là je suis en hors-piste complet. » | RÉÉCRIRE (setup bavard) | « J'avais préparé des sujets de conversation dans le métro. Là, on est officiellement hors de mes fiches. » |
| 17 | « …on s'est battus pour le dernier avocat au supermarché. » | GARDER | — |
| 18 | « Je cuisine super bien. Enfin, je commande super bien. C'est un talent aussi. » | RÉÉCRIRE (formule connue, chute qui s'excuse) | « Je cuisine très bien. Mon livreur peut en témoigner. » |
| 19 | « Mon green flag à moi c'est que j'ai un plan Netflix ET un plan B… Les deux sont du canapé, mais c'est un plan. » | RÉÉCRIRE (jargon daté, chute convenue, audit) | « J'ai toujours un plan B. C'est le même canapé, mais de l'autre côté. » |
| 20 | « J'ai repris les soirées après 6 mois d'hibernation. Mon small talk est rouillé mais ma tolérance à l'alcool aussi, donc ça s'équilibre. » | RÉÉCRIRE (setup + chute longs) | « Je ressors après 6 mois d'hibernation. Soyez indulgents : ma dernière conversation, c'était avec la caisse automatique. » |
| 21 | « On me dit 'faut se remettre en selle'. J'ai même pas de vélo. J'ai même pas de selle. Mais merci le conseil. » | RÉÉCRIRE (triplet, chute diluée) | « Tout le monde me dit de me remettre en selle. J'ai même pas de vélo. » |
| 22 | « J'ai recommencé à dîner avec des gens. Le niveau de conversation a baissé depuis que je parlais plus qu'à mon chat. Mais je progresse. » | RÉÉCRIRE (chute confuse) | « Je recommence à dîner avec des gens. C'est dur, ils répondent. Mon chat, lui, me laissait finir. » |
| 23 | « Je suis pas mort, je suis juste en mode avion social. » | RÉÉCRIRE (calembour paresseux, audit) | « Désolé, ça fait 3 jours que je rédige la réponse parfaite. La voici : "coucou". » |
| 24 | « Mon téléphone a 3% de batterie et je choisis de les utiliser pour t'écrire. C'est pratiquement une déclaration. » | GARDER (consigne : « Drôle ET flatteur » → minuscules) | — |
| 25 | « Je suis en PLS depuis ce matin. PLS = Position Latérale de Scrolling. » | RÉÉCRIRE (calembour sur acronyme, interdit §3) | « Ça va. Je suis dans mon lit depuis ce matin, mais assis, donc c'est productif. » |
| 26 | « Alerte : j'ai cuisiné ce soir. Aucun pompier n'a été appelé. Jour historique. » | RÉÉCRIRE (cliché pompiers, doublon `autoderision-interactions`) | « Alerte : j'ai cuisiné ce soir. Le détecteur de fumée est resté calme. On a grandi tous les deux. » |
| 27 | « Mon historique de recherche Google est le seul qui me connaît vraiment. Et il me juge pas. Enfin je crois. » | RÉÉCRIRE (chute molle ; amorce « historique Google » déjà prise par la page n°1) | « Le seul qui connaît vraiment ma vie, c'est mon clavier. Il propose "désolé" dès que je tape une lettre. » |
| 28 | « Je n'ai pas d'avis, mais je l'ai avec conviction. » | GARDER (pépite) | — |
| 29 | « Ce meeting aurait pu être un mail. Ce mail aurait pu être un emoji pouce. » | RÉÉCRIRE (mème international connu) | « Parfait. On fixe une réunion pour décider quand on décide ? » |
| 30 | « Je suis en mode brainstorm. Pour l'instant c'est surtout le storm, le brain arrive. » | RÉÉCRIRE (calembour phonétique, audit) | « Des idées ? J'en ai une. Elle est pas bonne, mais elle est à moi. » |
| 31 | « Mon KPI préféré c'est l'heure du déjeuner. » | GARDER (court ; consigne « punchy » retirée) | — |
| 32 | « J'ai mis 'proactif' sur mon CV. En vrai je suis réactif. Et encore, quand on me relance. » | RÉÉCRIRE (3e amorce « j'ai mis X sur mon… » du site) | « Je suis très réactif. À partir de la deuxième relance. » |
| 33 | « Si le travail c'est la santé, alors les congés c'est de la médecine préventive. » | RÉÉCRIRE (proverbe retourné = vanne de tonton, audit) | « Je pose des congés préventifs. Pour protéger mes collègues. » |

**Bilan** : 33 phrases, 25 réécrites, 8 gardées (la note c = 2/5 de l'audit et les amorces en doublon avec la page n°1 justifient le taux).

**Défauts de prose traités** : « phrase drôle » en gras répété (stuffing, audit) → gras retiré hors H2 ; métaphore guerrière « arsenal / dégainer / chargeur / viser » (audit) → « stock de phrases rodées », « ta réserve » ; « LA phrase drôle », « que TU sors », « ET un plan B » (capitales) ; « Bonne nouvelle : » ; « le open mic » → « l'open mic » ; « frappent comme un shot de tequila » (cliché) coupé ; « l'humour est ton meilleur allié » (cliché) ; CTA final « devenir la personne la plus drôle de ton groupe » (sur-promesse) → « pour que ce soit toi qu'on cite le lendemain ». H2 « L'art de la **phrase drôle** » laissé tel quel (règle : aucun H2 modifié).

**Chiffres / citations douteux (gardés, signalés)** : « Comme le dit Paul Mirabel : l'humour, c'est 10 % de talent et 90 % de préparation » (formule proverbiale, attribution non sourcée — probablement à tort : Thomas tranche) ; « Waly Dia l'a théorisé : "le rythme c'est la ponctuation et le retour à la ligne" » (citation non sourcée) ; « Dernier conseil de Fary : "T'as pas besoin de 200 vannes…" » (citation non sourcée) ; incohérence titre « 30 phrases » / excerpt « 33 phrases » / texte « Les 30 phrases au-dessus » ; « moins de 25 mots » (corps) vs « moins de 15 mots » (FAQ) ; « Parcours Confiance — 6 semaines » et « 3 à 6 semaines » (durées à vérifier vs parcours réels).

---

## 6. `comment-faire-rire-une-fille` (fort volume, audit 2,8/5)

**Doublons fille/homme** : dans ce worktree, la vanne du DJ reggaeton n'était que dans `comment-faire-rire-un-homme` ; la vanne serveur existait en deux versions (ici « partir sans payer », là-bas « braquer la caisse »). Consigne appliquée : les deux vivent désormais ici. Le DJ reggaeton remplace l'exemple « le mec qui danse comme s'il recevait le Wi-Fi » — qui se moquait d'un inconnu, en contradiction avec la section « L'humour méchant » du même article. **L'autre agent doit bien retirer DJ + serveur de `comment-faire-rire-un-homme`.**

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « Tu veux faire rire une fille. Cool. Mais si ton plan c'est… assieds-toi, on va parler. » | RÉÉCRIRE (condescendant, audit) | « Tu veux faire rire une fille ? Bonne idée, tant que ton plan n'est pas de sortir "Tu connais la différence entre…" suivi d'un jeu de mots douteux. » |
| 2 | « Pas une performance. Pas un numéro. Une connexion. » | RÉÉCRIRE (staccato) | « Faire rire quelqu'un, c'est créer une connexion, pas faire un numéro. » |
| 3 | « Raconte un truc où tu passes pour un idiot. Mais un idiot attachant. » | RÉÉCRIRE (légère, fluidité) | « Raconte un truc où tu passes pour un idiot — un idiot attachant. » |
| 4 | « J'ai voulu faire le mec qui connaît les vins au resto. J'ai dit 'il est charpenté'. C'était une bière. » | GARDER (pépite : chute de 3 mots) | — |
| 5 | Contre-exemple « Je suis tellement nul que personne ne veut de moi. » | GARDER (contre-exemple voulu) | — |
| 6 | « pointe un truc absurde que vous vivez ENSEMBLE » | RÉÉCRIRE (capitales) | « ensemble » |
| 7 | « Tu vois le mec là-bas qui danse comme si son corps recevait le Wi-Fi par intermittence ? » | RÉÉCRIRE (se moque d'un inconnu : contredit la règle anti-chambrage de l'article) | « Le DJ enchaîne le reggaeton comme si c'était une urgence médicale. » (vanne rapatriée de l'article homme) |
| 8 | « C'est moi ou le serveur nous regarde comme si on allait partir sans payer ? » | GARDER (le « nous » crée la complicité) | — |
| 9 | « …et après t'as parlé de ta collection de cactus et j'ai su que c'était plus profond que ça. » | RÉÉCRIRE (chute filler, audit) | « Au début, je t'ai trouvée normale. Et puis t'as parlé de ta collection de cactus. Ouf. » |
| 10 | « mais un VRAI changement de direction » | RÉÉCRIRE (capitales) | « un vrai changement de direction » |
| 11 | « Bon, on traverse ou tu veux un gilet pare-pigeons ? » | GARDER (callback propre) | — |
| 12 | « Toi, tu RECYCLES ce qu'on te dit » | RÉÉCRIRE (capitales) | « Toi, tu recycles… » |
| 13 | « Pas un mensonge — une amplification comique. » | RÉÉCRIRE (méta-commentaire qui tue l'exemple, audit) | coupé |
| 14 | « OK donc en gros si on va au resto et que le plateau de fromages arrive, je te perds pour le reste de la soirée. Je deviens le deuxième choix après un comté 18 mois. » | RÉÉCRIRE (setup bavard, bonne chute) | « Donc si le plateau de fromages arrive, je te perds pour la soirée. Je passe derrière un comté 18 mois. » |
| 15 | « Le silence, c'est une arme. » | RÉÉCRIRE (cliché guerrier) | « Le silence n'est pas un trou à boucher. » |
| 16 | « ceux qui ESSAIENT… quand tu DIS un truc que tu PENSES » | RÉÉCRIRE (capitales) | minuscules |
| 17 | « Ta vanne tombe à plat ? NEXT. Passe à autre chose. L'humour, c'est pas un combat, c'est une danse. » | RÉÉCRIRE (staccato + cliché) | « Ta vanne tombe à plat ? Passe à autre chose. Personne n'a jamais sauvé une vanne en la répétant plus fort. » |
| 18 | « Le rire est un MOYEN, pas une fin. » | RÉÉCRIRE (capitales) | « Le rire est un moyen, pas une fin. » |
| 19 | FAQ : « EN TEMPS RÉEL… L'authenticité bat toujours la préparation. » | RÉÉCRIRE (capitales, cliché) | « en temps réel… Ce qui se passe devant vous sera toujours plus drôle que ce que t'as préparé. » |

**Bilan** : 19 exemples/formulations, 15 réécrits, 4 gardés.

**Défauts de prose traités** : ton condescendant de l'intro (audit) ; ajout d'une réponse courte en tête (« arrête de performer, commence à observer ») ; 9 capitales criées ; staccato « NEXT » ; clichés « c'est une arme », « c'est une danse ». H2 numérotés de façon incohérente (« 2. », « 3. », « 5. », « 6. » mais pas 1 ni 4) laissés tels quels (règle H2) — à corriger côté SEO si souhaité.

**Point non traité, justifié** : l'audit note une audience (homme hétéro) non listée dans les personas — décision stratégique, hors copy.

**Citations / chiffres douteux (gardés, signalés)** : citation de Fary « L'autodérision, c'est montrer qu'on est assez confiant pour rire de soi » (non sourcée) ; « le callback, technique préférée de Blanche Gardin » ; « 90 % des gens attendent juste leur tour pour parler » ; « 10 fois plus intime », « 10 fois plus drôle ».

---

## 7. `erreurs-blagues` (satellite, audit 3,4/5)

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « Tu racontes une blague. Tu arrives à la chute. Et... rien. Le silence. Pas le silence de "je cherche de l'air parce que j'ai trop ri", non. Le silence de "quelqu'un a un sujet de conversation de rechange ?". » | RÉÉCRIRE (staccato ; bonne chute gardée) | « Tu arrives à la chute de ta blague, et... rien. Pas le silence de ceux qui reprennent leur souffle : celui de "quelqu'un a un sujet de conversation de rechange ?". » |
| 2 | « Tu viens de commettre un meurtre comique. Expliquer une blague, c'est comme disséquer un papillon : techniquement intéressant, mais le papillon est mort. » | RÉÉCRIRE (image connue, doublon avec `comment-avoir-de-la-repartie`, audit) | « Expliquer une blague, c'est offrir un cadeau déjà déballé. » |
| 3 | « il CONTINUE comme si de rien n'était » | RÉÉCRIRE (capitales) | « il continue comme si de rien n'était » |
| 4 | Exemple du setup interminable (« Attends attends… le cousin de la sœur de… ») | GARDER (illustration juste) | — |
| 5 | « Mon frère. Tu as perdu ton public à "en fait". Et ta punchline est maintenant à 3 kilomètres derrière un mur de contexte inutile. » | RÉÉCRIRE (« Mon frère » = tic retiré aussi de la page n°1 ; setup lourd) | « Tu as perdu ton public à "en fait", et ta punchline est à 3 kilomètres, derrière un mur de contexte. » |
| 6 | « Maximum. Si ta blague a besoin de 5 minutes d'introduction, c'est pas une blague, c'est un podcast. » | RÉÉCRIRE (staccato ; « c'est un podcast » = tic web, audit) | « Si ta blague a besoin de 5 minutes d'introduction, c'est pas une blague, c'est un audiolivre. » |
| 7 | « Chaque mot compte. Rien de superflu. C'est du chirurgien, pas du romancier. » | RÉÉCRIRE (triplet staccato, « chirurgical » répété) | « setup minimal, punchline chirurgicale, pas un mot de trop. » |
| 8 | « papy tousse, mamie parle de la météo, et tu fixes ta purée en te demandant pourquoi tu existes » | GARDER (salué par l'audit) | — |
| 9 | « et elle est drôle partout. Parce qu'elle calibre. » | RÉÉCRIRE (fragment) | « et elle est drôle partout, parce qu'elle calibre. » |
| 10 | « va COMPRENDRE le contexte » | RÉÉCRIRE (capitales) | « va comprendre le contexte » |
| 11 | « un demi-sourire gêné qui dit "pardon d'exister" » | GARDER (pépite) | — |
| 12 | « parce que TOI tu n'y crois pas » + « Regarde les yeux. Assume. » | RÉÉCRIRE (capitales, staccato) | « parce que toi, tu n'y crois pas » + « Regarde les gens dans les yeux et assume. » |
| 13 | « Parce qu'il est DEDANS. » | RÉÉCRIRE (capitales) | « Parce qu'il est dedans : il revit la scène… » |
| 14 | « SAUF QUE le groupe est en train de parler de la grand-mère de Thomas qui est malade. Et toi tu balances ta vanne sur les pigeons. … c'est la BASE. » | RÉÉCRIRE (capitales ; prénom du fondateur pris au hasard) | « Sauf que le groupe parle de la grand-mère d'un pote, qui est malade. Et toi, tu balances ta vanne sur les pigeons. … c'est la base. » |
| 15 | « ton manager qui fait sa face de "j'attends une vraie réponse" » | GARDER | — |
| 16 | « Choisis UNE erreur » | RÉÉCRIRE (capitales) | « Choisis une erreur » |
| 17 | CTA « l'investissement le plus rentable depuis que tu as arrêté de raconter des blagues Carambar » | RÉÉCRIRE (vanne de comptoir dans un article qui les condamne, audit) | « et le prochain silence après ta chute sera celui de gens qui reprennent leur souffle. » (callback de l'intro) |

**Bilan** : 17 exemples/formulations, 13 réécrits, 4 gardés.

**Défauts de prose traités** : « Corrigez-les » (vouvoiement dans « À retenir ») → « Corrige-les » ; 8 capitales criées ; staccato ; « Mon frère ». H2 « Le setup de 47 minutes » gardé.

**Chiffres / faits douteux (gardés, signalés)** : « Paul Mirabel a un sketch entier sur ce thème… 30 secondes plus tard, le rire arrive » (non sourcé) ; « timing social = 50 % du succès » (FAQ, même chiffre que `timing-humour`, non sourcé).

---

## 8. `autoderision-interactions` (satellite, audit 3,4/5)

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « L'autodérision, c'est un super-pouvoir. C'est aussi un piège mortel… Mal dosée, elle te rend pathétique. Bienvenue dans le guide qui va t'apprendre… » | RÉÉCRIRE (clichés « super-pouvoir », « Bienvenue dans le guide », staccato) | « Bien dosée, l'autodérision te rend sympathique, accessible et drôle. Mal dosée, elle te fait passer pour quelqu'un qui attend qu'on le console. Toute la différence tient dans le ton, et ce guide t'apprend à le trouver. » |
| 2 | « un signal de CONFIANCE… GRÂCE à elle… tu ris AVEC lui » | RÉÉCRIRE (capitales) | minuscules |
| 3 | « Mon sens de l'orientation est tellement mauvais que Google Maps m'a envoyé un mail de condoléances. » | RÉÉCRIRE (format « tellement X que » + trope « m'a envoyé un mail ») | « J'ai aucun sens de l'orientation. Je me suis déjà perdu en suivant quelqu'un. » |
| 4 | Contre-exemple « De toute façon, je suis nul. Je rate tout ce que je fais. » | GARDER (contre-exemple voulu) | — |
| 5 | « ta relation toxique avec le bouton "snooze" de ton réveil » | GARDER | — |
| 6 | « PAS les trucs qui te blessent… c'est une thérapie — et ça se fait avec un professionnel, pas au dîner de Noël » | GARDER le trait (capitales retirées) | « Pas les trucs qui te blessent vraiment… » |
| 7 | « Si CHAQUE phrase… "Haha il se déteste vraiment en fait." » | GARDER la réplique (capitales retirées) | — |
| 8 | « L'autodérision, c'est un assaisonnement, pas le plat principal. Un trait d'esprit sur soi par conversation, c'est le bon dosage. » | RÉÉCRIRE (métaphore culinaire rebattue) | « Un trait sur toi par conversation, c'est charmant ; un par phrase, c'est un appel à l'aide. » |
| 9 | « La glace est épaisse de 3 mètres. » | GARDER | — |
| 10 | « (Spoiler : personne ne viendra.) » | RÉÉCRIRE (tic « Spoiler ») | « (Personne ne viendra : tout le monde fait pareil dans son coin.) » |
| 11 | « Salut, je suis celui qui connaît personne et qui hésite entre le buffet et la sortie de secours. » | GARDER (pépite) | — |
| 12 | « Rires. Glace brisée. Et soudain, tu es approchable. Pourquoi ? » | RÉÉCRIRE (staccato) | « La glace se brise, et d'un coup tu deviens approchable, parce que… » |
| 13 | « …la machine à café nouvelle. Mais donne-moi un tableur Excel et je deviens Neo dans Matrix. » + « C'est du aikido social. » | RÉÉCRIRE (référence datée, audit ; faute « du aikido ») | « Je mets 10 minutes à comprendre la nouvelle machine à café. Mais sur Excel, je suis le collègue qu'on appelle quand tout est rouge. » + « C'est de l'aïkido social. » |
| 14 | « Mon chat a plus de vie sociale que moi. Il reçoit des visites, il a des rendez-vous réguliers chez le véto, il a même un carnet de vaccinations — moi j'ai même pas de dentiste. » | RÉÉCRIRE (énumération à rallonge, chute molle, audit) | « Mon chat a plus de vie sociale que moi : lui, au moins, il a des rendez-vous. » |
| 15 | « Je te préviens, je suis désastreux pour choisir au restaurant. Ma dernière 'commande aventureuse', c'était un plat pour enfant. J'ai pas regretté. » | RÉÉCRIRE (thème « aventure au resto » déjà pris par la page n°1, chute plate) | « Je te préviens : au resto, je commande toujours en dernier. Et je prends ce qu'a pris la personne d'avant. » |
| 16 | « tu deviens imbattable en conversation » | RÉÉCRIRE (sur-promesse) | « t'as de quoi tenir n'importe quelle conversation » |
| 17 | « La dernière fois que j'ai cuisiné, les pompiers m'ont ajouté à leur liste de contacts favoris. » | RÉÉCRIRE (cliché pompiers, doublon, audit) | « La dernière fois que j'ai cuisiné, ma poêle a demandé sa mutation. » |
| 18 | CTA « L'autodérision, c'est le muscle le plus puissant… **0,99 EUR/mois** — investis dans la compétence qui rend TOUT le monde plus sympathique. » | RÉÉCRIRE (jargon « investis », capitales, superlatif) | « …**0,99 EUR/mois** — et tes défauts deviennent enfin rentables. » |

**Bilan** : 18 exemples/formulations, 13 réécrits, 5 gardés.

**Défauts de prose traités** : 7 capitales ; staccato ; « Spoiler » ; « super-pouvoir », « piège mortel », « muscle le plus puissant » ; « du aikido ». H2 « …une arme nucléaire » gardé (règle H2).

**Chiffres / faits douteux (gardés, signalés)** : « les gens sentent la différence en 0,3 seconde » (non sourcé) ; « Paul Mirabel utilise exactement cette technique en début de spectacle » ; « le parcours Confiance consacre une semaine entière » (à vérifier vs contenu réel du parcours).

---

## 9. `repartie-debutant-5-etapes` (satellite, audit 3,2/5)

**Point audit « Lucas »** : l'audit proposait de renommer Lucas en « Yanis ». Écarté : le prénom d'un persona ne doit jamais apparaître dans un contenu public (garde-fou `guardAgainstPersonaLeak`). Appliqué à la place : [CHOIX UTILISATEUR 29/09] — Lucas devient un exemple assumé (« Imagine Lucas, 20 ans… », « notre cas d'école »), plus jamais présenté comme un vrai membre. Référence « modem 56k » (datée) retirée.

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « Lucas a 20 ans. » | RÉÉCRIRE (témoignage implicite) | « Imagine Lucas, 20 ans. » |
| 2 | « dit "ah ouais grave" toutes les 30 secondes » | GARDER | — |
| 3 | « son cerveau fait le bruit d'un modem 56k » | RÉÉCRIRE (référence années 1990, audit) | « son cerveau part en pause pub » |
| 4 | « Sa meilleure répartie à ce jour : "euh... toi-même." » | GARDER | — |
| 5 | « Pas des étapes théoriques de livre de développement personnel. Des étapes concrètes, testées, avec des résultats visibles en quelques jours. » | RÉÉCRIRE (staccato, promesse prospectus) | « On va le suivre sur 5 étapes concrètes, loin des livres de développement personnel. » |
| 6 | « Contre-intuitif, non ? Mais… chercher LA réplique parfaite. Résultat : paralysie. » | RÉÉCRIRE (capitales, staccato) | « Ça paraît contre-intuitif, mais… chercher la réplique parfaite. Et le cerveau se fige : il cherche le bon mot pendant 45 secondes… » |
| 7 | « "C'est quand même bizarre que tu dises ça." Simple. Honnête. Et étrangement efficace. » | RÉÉCRIRE (triplet staccato) | « Rien de brillant, mais c'est honnête, et ça marche étrangement bien. » |
| 8 | « c'est comme avoir un extincteur : tu espères ne pas en avoir besoin, mais quand le feu part, tu es content de l'avoir » | RÉÉCRIRE (comparaison longue et rebattue) | « c'est le parapluie de la conversation : tant que tu l'as sur toi, il pleut pas. » |
| 9 | « "Intéressant" » / « "Tu me connais tellement bien" » / « "C'est noté, je transmets" » | GARDER les 3 (courtes, réutilisables, la 3e est une vraie trouvaille) | — |
| 10 | « Mémorise-les. » + « Mémorise 3 phrases passe-partout » (À retenir) | RÉÉCRIRE (charte §5 : « mémoriser » → « ressortir ») | « Garde-les sous le coude. » + « Prépare 3 phrases passe-partout » |
| 11 | « "Horrible comment ? Horrible genre tu t'es ennuyé, ou horrible genre tu as survécu à un truc ?" … ET montre que tu écoutes » | RÉÉCRIRE (setup redondant, capitales) | « "Horrible genre ennuyeux, ou horrible genre tu as survécu à quelque chose ?" … et montre que tu écoutes » |
| 12 | « repère UN mot intéressant » | RÉÉCRIRE (capitales) | « repère un mot intéressant » |
| 13 | « C'est comme apprendre à nager en traversant la Manche. » | GARDER (image juste et courte) | — |
| 14 | « un collègue que tu croises aux toilettes » | GARDER | — |
| 15 | « Son secret ? Pas du talent. De la méthode. » | RÉÉCRIRE (staccato, formule creuse) | « Pas de talent caché là-dedans : juste de la méthode. » |
| 16 | CTA « le prix d'un croissant pour ne plus jamais rester muet en soirée » | RÉÉCRIRE (sur-promesse « plus jamais ») | « moins cher qu'un croissant, et ça t'évite le "euh... toi-même". » (callback) |
| 17 | FAQ : « Les résultats arrivent en 2-3 semaines — promis. » / « analyse d'une conversation dans le soir » | RÉÉCRIRE (promesse, coquille) | « Les résultats arrivent en général en 2-3 semaines. » / « …le soir » |

**Bilan** : 19 exemples/formulations (n°9 = 3 phrases), 13 réécrits, 6 gardés.

**Défauts de prose traités** : témoignage implicite ; référence datée ; 5 capitales ; staccato ; « mémoriser » ; sur-promesse.

**Faits douteux (gardés, signalés)** : « Paul Mirabel a dit en interview qu'à ses débuts, il cherchait à être honnête » ; « Fary… "c'est une excellente question" qui lui achète 5 secondes » ; « Waly Dia testait ses vannes dans des salles de 10 personnes » ; « Panayotis Pascot notait ses vannes ratées » (anecdotes non sourcées) ; « 90 % des gens n'écoutent pas ».

---

## 10. `humour-quotidien-8-habitudes` (satellite, audit 3,2/5)

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « "L'humour, c'est un talent." Mythe. "Faut être extraverti." Mythe. "C'est réservé aux gens qui ont confiance en eux." Mythe aussi… 8 habitudes simples qui vont transformer tes journées » | RÉÉCRIRE (staccato en triplet, cliché « transformer tes journées ») | « L'humour n'est ni un talent, ni un truc d'extraverti, ni un privilège des gens sûrs d'eux : c'est une habitude, et ça se construit brique par brique. Voici 8 habitudes simples. Elles ne feront pas de tes journées un spectacle, mais tu vas te surprendre à faire sourire les gens. » |
| 2 | « Faux. **Roman Frayssinet** note tout. » | RÉÉCRIRE (staccato) | « En réalité, **Roman Frayssinet** note tout : » |
| 3 | « Son téléphone est un cimetière de notes vocales. » | GARDER | — |
| 4 | « note UNE chose absurde » | RÉÉCRIRE (capitales) | « note une chose absurde » |
| 5 | Mail « Suite à notre échange téléphonique » alors que vous ne vous êtes jamais appelés | GARDER (observation juste) | — |
| 6 | « Le mec qui dit "bon appétit" à quelqu'un qui boit un café. » | GARDER | — |
| 7 | « Après 30 jours, tu as 30 observations. Et au moins 10 potentiellement drôles. » | RÉÉCRIRE (phrase identique dans `comment-devenir-drole`) | « Après 30 jours, tu as 30 observations — et dans le tas, au moins 10 qui peuvent faire rire quelqu'un. » |
| 8 | « "mon lit m'a clairement ghosté cette nuit" » | RÉÉCRIRE (mème « ghoster », idée déjà vue dans le blog) | « "j'ai passé la nuit à me disputer avec mon oreiller. Il a gagné." » (pas « négocier » : amorce déjà prise par la plante de `exercices-developper-humour`) |
| 9 | « "le temps et moi, on a une relation compliquée" » | RÉÉCRIRE (cliché « c'est compliqué ») | « "j'étais à l'heure, c'est le rendez-vous qui était en avance." » |
| 10 | « "Tu gères tellement le café que tu devrais postuler chez Nespresso." » | RÉÉCRIRE (sonne pub, pas de twist, audit) | « "Tu as réparé l'imprimante. Je pense qu'il faut qu'on parle de ton avenir dans cette boîte." » |
| 11 | « "Ton Excel est si beau que j'ai failli l'encadrer." » | RÉÉCRIRE (plat, audit) | « "Ton Excel est tellement propre que j'ose pas scroller." » |
| 12 | « "Ton choix de mug est incroyable. C'est le genre de décision qui change une carrière." » | GARDER (vraie disproportion comique) | — |
| 13 | « Sourire garanti. » | RÉÉCRIRE (promesse creuse) | « Ça coûte rien et ça lance la journée. » |
| 14 | « "C'est la quatrième fois qu'on dit 'on va aller à l'essentiel' et on n'y est toujours pas." » | GARDER | — |
| 15 | « "On est tous à regarder nos téléphones côte à côte. C'est ça le métavers ?" » | RÉÉCRIRE (mot marketing daté, audit) | « "On est tous à regarder nos téléphones côte à côte. Techniquement, c'est une soirée." » |
| 16 | « il dit des trucs VRAIS de façon drôle » | RÉÉCRIRE (capitales) | « des trucs vrais » |
| 17 | « "Et si les réunions avaient un arbitre qui siffle les hors-sujets ?" » | GARDER | — |
| 18 | « "Et si les mails professionnels étaient honnêtes — 'Cher collègue, je m'en fiche complètement mais voici ma réponse' ?" » | RÉÉCRIRE (idée proche du mail « J'espère que tu vas bien » de `comment-devenir-drole`, chute plate) | « "Et si les mails pro étaient honnêtes ? 'Bonjour, je relance parce que je sais que tu as lu.'" » |
| 19 | « C'est la genèse de l'humour. » | RÉÉCRIRE (grandiloquent) | coupé |
| 20 | « "J'ai essayé de faire du sport ce matin. Mon corps a déposé une motion de censure." » | RÉÉCRIRE (trope « mon corps a… » saturé, audit) | « "Ce matin, j'ai lacé mes baskets. J'ai senti que ça suffisait pour aujourd'hui." » |
| 21 | « Un trait d'esprit, pas un festival de l'auto-flagellation. » | GARDER | — |
| 22 | Callback « "Voilà. Lundi." » | GARDER (callback exemplaire) | — |
| 23 | « reformule UN moment » + « "Ma journée en un mot ? Tableur." » | GARDER la vanne (capitales retirées) | — |
| 24 | « En un mois, tu as un nouveau câblage mental. » | RÉÉCRIRE (jargon) | « En un mois, ton cerveau a pris le pli. » |
| 25 | CTA « le prix de devenir la personne qu'on veut à sa table » | RÉÉCRIRE (syntaxe bancale, idée gardée) | « pour devenir la personne qu'on veut à sa table. » |

**Bilan** : 25 exemples/formulations, 16 réécrits, 9 gardés.

**Défauts de prose traités** : triplet « Mythe. » ; « Faux. » ; 4 capitales ; « Sourire garanti » ; « genèse de l'humour » ; « câblage mental » ; doublon de phrase avec l'article pilier. Les accroches « **Mythe cassé : …** » (en gras, pas des H3) sont conservées : elles structurent l'article.

**Faits douteux (gardés, signalés)** : « Blanche Gardin part souvent d'un "et si"… "Et si on arrêtait de faire semblant d'aimer Noël ?" » (citation non sourcée) ; « Waly Dia utilise le callback dans chaque spectacle » ; « le compliment absurde est la forme d'humour la plus universellement appréciée » (affirmation sans source).

---

## 11. `humour-noir-utiliser-sans-blesser` (satellite, audit 3,0/5)

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « L'humour noir, c'est comme la nitroglycérine : entre de bonnes mains, c'est spectaculaire. Entre de mauvaises mains, ça fait des dégâts. » | RÉÉCRIRE (comparaison rebattue, aussi dans l'excerpt) | « L'humour noir, c'est le seul humour capable de faire rire toute une table ou de vider une pièce avec la même phrase. » |
| 2 | « Ce n'est PAS : » | RÉÉCRIRE (capitales) | « Ce n'est pas : » |
| 3 | « JAMAIS des personnes vulnérables. » / « elle parle de SA dépression » | RÉÉCRIRE (capitales) | « Jamais des personnes vulnérables. » / « de sa propre dépression » |
| 4 | « Un setup inconfortable sans punchline brillante, c'est juste... inconfortable. » | GARDER (la répétition est la vanne) | — |
| 5 | Sketch 1 — « "Mon psy m'a dit que j'avais fait des progrès. J'ai répondu que lui aussi devrait en faire — ça fait 8 ans qu'il me supporte." La cible : elle-même ET le système thérapeutique. Personne n'est blessé. Tout le monde rit. » | GARDER le contenu (règle charte §1.4 : doute = on garde et on signale) ; prose réécrite (capitales, staccato) | « La cible : elle-même et le système thérapeutique ; personne n'est blessé, et tout le monde rit. » **Citation signalée comme probablement fabriquée (audit).** |
| 6 | Sketch 2 — Waly Dia « je suis de Créteil, tu veux que je retourne à Créteil ? » | GARDER (signalée : non sourcée) | — |
| 7 | « Je l'ai enterré ce matin. La cérémonie était sobre. Il y avait un croissant. » | GARDER (pépite ; le doublon avec `5-types` n'existe plus) | — |
| 8 | « Cette réunion était tellement longue que j'ai commencé à rédiger mon testament. » (corps + FAQ) | RÉÉCRIRE (cliché « réunion / testament » répété sur 3 pages, audit ; format « tellement… que ») | « À la fin de la réunion, on a observé une minute de silence pour l'ordre du jour. » (corps + FAQ) |
| 9 | « Léger, professionnel, relatable. Exactement ce qu'on enseigne… » | RÉÉCRIRE (triplet staccato, anglicisme) | « C'est léger, ça reste pro, et tout le monde a vécu cette réunion : exactement ce qu'on enseigne… » |
| 10 | « Inconnus ou hiérarchie = safe only. » | RÉÉCRIRE (anglicisme) | « Inconnus ou hiérarchie = version très légère uniquement. » |
| 11 | CTA « **0,99 EUR/mois** — pour maîtriser l'art du second degré. » | RÉÉCRIRE (plat, « maîtriser l'art » = cliché) | « **0,99 EUR/mois** — c'est pas cher payé pour éviter les silences de mort. » |
| 12 | FAQ : « La méchanceté, c'est juste du shock sans atterrissage. » | RÉÉCRIRE (anglicisme) | « …du choc sans atterrissage. » |

**Bilan** : 12 exemples/formulations, 9 réécrits (dont la vanne testament en 2 endroits), 3 gardés + 1 citation gardée et signalée.

**Défauts de prose traités** : comparaison « nitroglycérine » ; 4 capitales ; staccato ; anglicismes « safe only », « shock », « relatable ». H3 « Règle 2 : Le contexte est ROI » et les H3 « (BON humour noir) / (MAUVAIS humour noir) » gardés tels quels (règle H3) — les capitales y restent, à trancher côté SEO.

**Citations / faits douteux (gardés, signalés)** : **citation Blanche Gardin « Mon psy m'a dit que j'avais fait des progrès… 8 ans qu'il me supporte »** présentée comme sketch réel — probablement fabriquée (audit) : à vérifier en priorité, sinon reformuler en exemple non attribué ; citation Waly Dia « je suis de Créteil… » (non sourcée) ; « Fary a expliqué en interview qu'il adapte son niveau d'humour noir selon la salle » ; « Paul Mirabel utilise parfois l'humour noir dans ses escalades ».

---

## 12. `exercices-developper-humour` (satellite, audit 3,6/5)

Audit globalement positif (« déodorant, plante affamée, moutons qui fuient » OK) ; relu malgré tout exemple par exemple : plusieurs exemples doublonnaient mot pour mot d'autres articles du lot (rebond « toujours en retard / samedi », setup « Tu manges encore ? », « on va faire court »).

| n° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « Tu veux devenir plus drôle mais tu ne sais pas par où commencer ? C'est normal. Personne ne t'apprend l'humour à l'école… pour muscler ton sens de l'humour comme un vrai muscle. » | RÉÉCRIRE (setup étiré, tautologie « muscler… comme un muscle » ; idée du subjonctif gardée) | « Tu veux devenir plus drôle mais tu ne sais pas par où commencer ? Normal : à l'école, on t'a appris les maths, l'histoire, le subjonctif — et pour faire rire les gens ? Débrouille-toi. Voici 10 exercices concrets, classés par difficulté. » |
| 2 | « comme pour n'importe quel skill » (À retenir) | RÉÉCRIRE (anglicisme) | « comme pour n'importe quelle compétence » |
| 3 | « repère UNE situation absurde » | RÉÉCRIRE (capitales) | « repère une situation absurde » |
| 4 | « Le mec qui tient la porte pour quelqu'un à 15 mètres, forçant l'autre à courir. » | GARDER (pépite) | — |
| 5 | « Le mail "urgent" envoyé un vendredi à 18h47. » | GARDER | — |
| 6 | « La réunion qui commence par "on va essayer de faire court" et qui dure 2 heures. » | RÉÉCRIRE (même idée que « on va aller à l'essentiel » de `humour-quotidien`, formule connue) | « Le "petit point rapide" de 2 heures. » (chiffre conservé) |
| 7 | « "Mon oreiller et moi, on a rompu" » | RÉÉCRIRE (même amorce « oreiller / mal dormi » que `humour-quotidien`) | « "J'ai vu toutes les heures de la nuit. Aucune ne m'a plu." » |
| 8 | « "J'ai passé la nuit à compter les moutons. Ils ont fui au 47e" » | GARDER (salué par l'audit) | — |
| 9 | « "Mon lit est devenu une zone de non-sommeil" » | RÉÉCRIRE (constat sans twist) | « "Mon lit, cette nuit, c'était surtout un lieu de réflexion." » |
| 10 | « "Il fait tellement chaud que mon déodorant a rendu sa démission." » | RÉÉCRIRE (trope « démission » saturé sur le blog ; idée gardée) | « "Il fait tellement chaud que même mon déodorant transpire." » |
| 11 | « "J'ai tellement faim que j'ai commencé à négocier avec une plante." » | GARDER | — |
| 12 | « Paul Mirabel est le roi de l'escalade : il part du réel et monte, monte, monte… » | RÉÉCRIRE (répétition staccato, formule identique à `comment-avoir-de-la-repartie`) | « Paul Mirabel fait ça naturellement : il part du réel et grimpe jusqu'à l'absurde total. » |
| 13 | Ping-pong : « "Tu manges encore ?" → "Oui, c'est mon métier à temps partiel" → "Tu devrais demander une augmentation" → "J'ai essayé, le frigo a dit non" » | RÉÉCRIRE (setup identique au retournement de `comment-avoir-de-la-repartie` ; l'enchaînement est gardé) | « "Tu dors encore ?" → "Oui, c'est mon métier à temps partiel" → "Tu devrais demander une augmentation" → "J'ai essayé, mon réveil a dit non" » |
| 14 | « Identifie UN moment » | RÉÉCRIRE (capitales) | « Identifie un moment » |
| 15 | Rebond : « "Toujours ? Non, l'autre fois j'étais pile à l'heure. C'était un samedi." » | RÉÉCRIRE (doublon quasi mot pour mot avec `comment-avoir-de-la-repartie`) | « "Toujours ? Tu exagères. Une fois, j'étais en avance : je m'étais trompé de jour." » |
| 16 | Retournement : « "Et toi, t'es toujours là à me chronométrer ?" » | GARDER | — |
| 17 | Absurde : « "En retard par rapport à quoi ? Au temps ? Le temps c'est relatif, Einstein l'a dit." » | RÉÉCRIRE (référence Einstein = cliché de comptoir) | « "En retard ? Non. Je passe en dernier, comme la tête d'affiche." » |
| 18 | « "Ce café est tellement bon que je vais écrire un roman dessus." » | RÉÉCRIRE (chute attendue) | « "Ce café est tellement bon que je vais demander la recette à la machine." » |
| 19 | « "Ton choix de chaussettes aujourd'hui est une déclaration artistique." » | GARDER | — |
| 20 | « ses sketches sont des masterclass de timing » | RÉÉCRIRE (anglicisme) | « de vraies leçons de timing » |
| 21 | Bit : « …C'est un podcast, mais en moins bien produit et en plus long. » | RÉÉCRIRE (tag « c'est un podcast » = tic, déjà retiré de `erreurs-blagues`) | tag : « Et à la fin, elle te dit "rappelle-moi". » |
| 22 | CTA « l'investissement le plus drôle de ta vie » | RÉÉCRIRE (cliché publicitaire) | « et cette fois, personne te dit "débrouille-toi". » (callback de l'intro) |

**Bilan** : 22 exemples/formulations, 15 réécrits, 7 gardés.

**Défauts de prose traités** : tautologie de l'intro ; 3 capitales ; anglicismes « skill », « masterclass » ; « monte, monte, monte » ; 4 doublons inter-articles supprimés.

**Chiffres / faits douteux (gardés, signalés)** : « Roman Frayssinet a dit que 80 % de son matériel vient de ce qu'il observe » (non sourcé) ; « Fary utilise des compliments absurdes en interview » ; « Panayotis Pascot notait tout » (même anecdote que `repartie-debutant-5-etapes`) ; « La régularité est 10 fois plus importante que la durée » (FAQ).

---

