# Réécriture blog — lot C (s11, passe 2 bis) — 29/09/2026

> Fichier édité : `apps/web/src/lib/blog-articles.ts` (worktree `wt-blog-c`). Charte : `docs/copy/charte-refonte-copy-s11.md`. Brief : `docs/copy/brief-reecriture-blog-s11.md` (passe 2 bis).
> Intacts partout : slugs, titres, H2/H3, questions FAQ, liens internes existants, tous les chiffres (y compris comiques). `updatedAt: "2026-09-29"` sur chaque article réécrit.
> Méthode : un article à la fois — inventaire exhaustif numéroté → verdict → Edit.

## Totaux

- **12 articles réécrits** (tous avec `updatedAt: "2026-09-29"` ; `humour-apres-rupture` et `meilleures-blagues-droles-2026` non touchés).
- **208 exemples inventoriés** (vannes, répliques, phrases-outils, images comiques de la prose) · **94 réécrits (45 %)** · 114 gardés (pépites audit, contre-exemples volontaires, phrases-outils reprises en FAQ) · **4 ajoutés** dans `confiance-humour-apres-rupture` (dont 3 repris de `humour-apres-rupture`).
- Intro resserrée avec réponse directe citable en 1re phrase sur **12/12** articles.
- Doublons inter-articles traités : DJ reggaeton / serveur (fille/homme), « R&D comique » (×3 → 0 dans le lot), « sous la douche » (3 occurrences → 1), créneau (article 1 gardé, article 6 remplacé), mail « question rapide » (un seul emplacement).
- Aucun chiffre retiré ni modifié ; aucun H2/H3 reformulé (une seule correction orthographique : « s'essoufle » → « s'essouffle ») ; aucun lien supprimé ; aucune question FAQ modifiée ; aucun humoriste ajouté ; zéro mention IA/robot (un « robot » retiré).

| Article | Audit | Exemples | Réécrits |
|---|---|---|---|
| je-suis-pas-drole-comment-changer | 2,4 | 16 | 8 |
| blagues-travail-faire-rire-pro | 3,6 | 22 | 13 |
| comment-faire-rire-un-homme | 2,8 | 15 | 12 |
| confiance-humour-apres-rupture | 3,6 | 7 (+4 ajouts) | 2 |
| rester-muet-en-groupe | 3,8 | 24 | 7 |
| repondre-moqueries-avec-humour | 3,4 | 14 | 8 |
| jamais-quoi-repondre-techniques | 3,8 | 22 | 7 |
| timidite-et-humour | 3,4 | 16 | 8 |
| storytelling-drole-5-structures | 3,8 | 12 | 5 |
| conversation-machine-a-cafe | 3,8 | 23 | 9 |
| repartie-soiree-anti-malaise | 4,0 | 20 | 6 |
| pourquoi-blagues-marchent-pas | 3,6 | 17 | 9 |

**Points à trancher par Thomas (transverses)**
- H2 contenant des anglicismes/capitales, laissés par consigne : « l'intégrer sans être awkward » (machine à café), « Quand NE PAS répondre avec humour » (moqueries). H3 « Teste en terrain safe avant le grand bain » (je-suis-pas-drôle).
- Incohérence chiffrée interne dans `pourquoi-blagues-marchent-pas` (règle « chute plus courte » vs « setup 5 mots / punchline 11 mots »).
- Durée Parcours Répartie : « 4 semaines » (2 articles) vs « 30 jours » (rester-muet).
- Pierre Croce et Florence Foresti (déjà cités) hors pool de référence.
- Nouveaux détails horaires/chiffrés purement comiques introduits dans des vannes réécrites (pas des stats) : « midi moins deux », « vers minuit », « Six mois » (reprend les « 6 mois » du contre-exemple), « 20 minutes », « 7 vis » (repris de l'original).

---

## 1. `je-suis-pas-drole-comment-changer` (audit 2,4/5 — P0)

**16 exemples · 8 réécrits · 8 gardés** (+ intro, clôture et FAQ réécrites)

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « ta vanne est tombée tellement à plat qu'elle a creusé un trou dans le sol » | RÉÉCRIRE — dramatisation cliché | « ta vanne a eu pour seule réponse un "ah." poli » |
| 2 | « Y compris le mec qui a l'air super à l'aise. Il fait juste mieux semblant. » | GARDER | idem |
| 3 | « Tu remarques que le mec de la compta répond toujours "ça dépend" ? Genre même si tu lui demandes l'heure ? » | RÉÉCRIRE — chute en question qui s'explique (« Genre… ») | « Le mec de la compta répond "ça dépend" à tout. Je lui ai demandé l'heure. Il m'a demandé pour quel usage. » |
| 4 | « J'ai voulu faire un créneau. Le créneau a gagné. » | GARDER — économie parfaite | idem |
| 5 | « Le collègue qui écrit "Cordialement" alors qu'il est clairement furieux. » | RÉÉCRIRE — trope ultra-connu | « Le prof qui annonce "je vous retiens pas longtemps" à midi moins deux. » (1re version « petite question rapide / mail de quarante lignes » écartée : doublon avec la vanne 47 paragraphes de `blagues-travail-faire-rire-pro`) |
| 6 | « Le mec qui dit "Non mais je suis pas raciste, MAIS..." » | RÉÉCRIRE — cliché + sujet glissant, caps | « Le pote qui annonce "je fais court" et qui commence par son enfance. » |
| 7 | « La personne qui répond "ça va et toi" sans avoir écouté la réponse. » | GARDER (resserrée) | « La personne qui demande "ça va ?" et repart avant ta réponse. » |
| 8 | « J'ai tellement procrastiné que ma to-do list a pris la poussière » | RÉÉCRIRE — cliché passe-partout (audit) | « Sur ma to-do list, certaines tâches sont devenues des souvenirs. » (variantes écartées : « …a une date de péremption », « …a plus d'ancienneté que moi ») |
| 9 | « LinkedIn, c'est le seul endroit où les gens sont "ravis d'annoncer" qu'ils ont changé de job. Au bureau, ils pleuraient. » | GARDER (audit : bon) | idem |
| 10 | « Ah mais c'est super intéressant ce que tu dis. Non attends, c'est le mot "intéressant" qui est super intéressant. » | RÉÉCRIRE — chute méta qui tourne en rond (audit) | « Très bonne question. Je te réponds par courrier, prévois un délai. » |
| 11 | « Oui, et t'avais aussi zéro envie, zéro motivation, et zéro raison d'être là. Genre même ta chaise avait l'air de s'ennuyer. » | RÉÉCRIRE — liste mécanique + chute molle (audit) | « Oui, et vers 10h, ta chaise a posé un arrêt maladie. » |
| 12 | « ATTENDS j'ai une blague. » (contre-exemple) | GARDER l'idée, caps retirées | « "Attends, j'ai une blague." » |
| 13 | « même si tu l'as répétée 14 fois sous la douche » | GARDER | idem |
| 14 | « comme si c'était le dernier pénalty de la Coupe du Monde » | RÉÉCRIRE — image rebattue, phrase lourde | « Tu viens de transformer une petite phrase en séance de tirs au but. » |
| 15 | « comme juger ta forme physique sur ta capacité à faire des pompes » | GARDER | idem |
| 16 | « comme rater un panier au basket et décider que tu ne seras jamais sportif » | GARDER | idem |

**Défauts de prose traités**
- Intro : la réponse arrivait au 2e paragraphe → réponse directe citable en première phrase (« tu te trompes sûrement : l'humour s'apprend »), puis la stat 76 % gardée telle quelle.
- Croyance 3 : staccato + capitales (« Un pro. 70%. … Et c'est UN PRO. ») → phrase fluide ; « datapoint » (anglicisme) → « une info ».
- Gras statistique empilé (**76%**, **30% de ses vannes**) signalé par l'audit : gras retirés sur les chiffres (chiffres intacts).
- Piste 1 : « VOIR » ×2 en capitales → italique ; « DÉFI : » → « Défi du soir : ».
- Piste 5 : « Sentence de mort. » (staccato) → intégré dans la phrase.
- Piste 6 : « ne PAS être drôles » → sans capitales ; « Zéro drame. » staccato → fondu.
- Piste 7 : « vannes à mémoriser » → « vannes à ressortir » (charte §5).
- Conclusion : « Tu ne "n'es pas drôle" » (faute de syntaxe) corrigé ; clôture motivationnelle « C'est tout. Le reste suivra. » → consigne concrète avec une pointe d'humour.
- FAQ : réponses resserrées, voix pote (questions intactes).

**Chiffres / citations douteux (gardés, signalés)**
- « 76 % des gens pensent ne pas être drôles, selon une étude de l'Université du Colorado » — source introuvable (audit).
- « Roman Frayssinet a un taux de réussite d'environ 70 % sur scène » — non sourcé, potentiellement inventé ; idem « 30 % de ses vannes ».
- « Panayotis Pascot parle de ça : la liberté de foirer » + « 40 % de tes tentatives » — attribution non vérifiée.
- « Blanche Gardin a mis plus de 10 ans à oser faire du stand-up solo », « Fary a écrit des milliers de blagues », « Paul Mirabel… open mics devant 15 personnes » — anecdotes biographiques non sourcées.
- FAQ : « Des études scientifiques montrent qu'un entraînement structuré de 8 semaines… » + « selon les études en psychologie positive » — non sourcé.
- « 2 à 4 semaines… la plupart des gens voient une vraie différence » — affirmation sans source.

---

## 2. `blagues-travail-faire-rire-pro` (audit 3,6/5 — P0)

**22 exemples · 13 réécrits · 9 gardés** — l'audit ne relevait « rien à retirer », mais à la barre Thomas (déjà-vu = RÉÉCRIRE, chute qui s'explique, staccato « Genre… Genre… ») plus de la moitié ne tenait pas.

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « des réunions qui auraient pu être des emails » | RÉÉCRIRE — cliché le plus connu du bureau | « des réunions qui finissent par "on se refait un point" » |
| 2 | « Sans te retrouver convoqué aux RH. » | GARDER | idem |
| 3 | « Tiens-toi bien, ça va être "corporate-friendly". » | RÉÉCRIRE — remplissage, retarde la réponse | supprimé → réponse directe en tête |
| 4 | « que 3 heures de paintball sous la pluie » | GARDER | idem |
| 5 | « …le mail "Merci de ne pas laisser votre vaisselle dans l'évier" est envoyé toutes les deux semaines ? C'est le seul process de cette boîte qui est vraiment respecté. » | RÉÉCRIRE — jargon « process », chute floue | « Le mail "merci de ne pas laisser votre vaisselle dans l'évier" tombe toutes les deux semaines. La vaisselle aussi. Les deux sont très ponctuels. » |
| 6 | « …un bruit de sous-marin en plongée. Je sais pas si elle fait du café ou si elle communique avec l'ISS. » | RÉÉCRIRE — deux images qui se marchent dessus | « La machine à café fait un bruit de sous-marin en détresse. Et chaque matin, on fait la queue pour monter à bord. » |
| 7 | « sans passer pour le oncle relou » | GARDER l'idée, faute corrigée | « sans passer pour l'oncle relou du repas de Noël » |
| 8 | « Bon, point suivant : le budget. Respirez un coup, on va avoir besoin d'oxygène. » | RÉÉCRIRE — tautologie (respirer = oxygène), pas de retournement | « Bon, point suivant : le budget. Profitez, c'était la partie joyeuse. » |
| 9 | « J'ai relu le rapport 3 fois. La 3ème fois j'ai compris ce que j'avais écrit. Progrès. » | GARDER (retouche : « Progrès. » staccato coupé) | « J'ai relu le rapport 3 fois. À la 3e, j'ai enfin compris ce que j'avais voulu dire. » |
| 10 | « Donc si je résume : on fait la même chose qu'avant mais on appelle ça autrement. C'est ça ? » | RÉÉCRIRE — bavard | « Donc si je résume : même chose qu'avant, nouveau nom. J'ai bon ? » |
| 11 | « Pour revenir à ce que disait Thomas sur le planning... Thomas, tu es toujours vivant ? Tu bouges plus depuis 20 minutes. » | RÉÉCRIRE — pas un callback, vise un collègue en public (contredit la règle de l'article) ; prénom du fondateur | « Pour revenir au "point rapide" du début… il a 20 minutes maintenant, il fait ses premiers pas. » |
| 12 | « Non mais c'était drôle parce que... » (contre-exemple) | GARDER | idem |
| 13 | « J'ai reçu un mail de 47 paragraphes avec en objet "Rapide question". Rapide. 47 paragraphes. » | RÉÉCRIRE — la chute répète le setup | « J'ai reçu un mail "Rapide question". 47 paragraphes. J'ai mis deux jours à trouver la question. » |
| 14 | « …a duré 2 heures pour décider qu'on ferait une autre réunion. On est dans la saison 3 de la réunion. » | RÉÉCRIRE — métaphore « saison de série » rebattue | « Deux heures de réunion cet aprèm pour décider qu'on en ferait une autre. Seule décision votée à l'unanimité. » |
| 15 | « …la productivité du vendredi après-midi. C'est-à-dire actualiser ma boîte mail toutes les 30 secondes en espérant qu'il se passe rien. » | RÉÉCRIRE — setup bavard (« niveau ultime… c'est-à-dire ») | « Le vendredi aprèm, j'actualise ma boîte mail toutes les 30 secondes. Pas pour répondre. Pour vérifier qu'il se passe rien. » |
| 16 | « Ci-joint le rapport (troisième version, je m'améliore) » | GARDER | idem |
| 17 | « Sujet : Ce n'est pas urgent (enfin, un peu) » | GARDER | idem |
| 18 | « un GIF vaut mille mots. Mais UN GIF. Pas 12. » | RÉÉCRIRE — proverbe + staccato + caps | « un GIF bien placé fait sourire, le 12e fait fuir » |
| 19 | « "Super travail" peut être sincère ou sarcastique » | GARDER | idem |
| 20 | « Le PowerPoint a 87 slides. On va avoir besoin de provisions. » | GARDER — pépite | idem |
| 21 | « Mon planning est optimiste. Genre très optimiste. Genre fiction. » | RÉÉCRIRE — staccato triplet | « Mon planning a été écrit par quelqu'un de très optimiste. Moi, un lundi. » |
| 22 | « c'est un suicide professionnel » | RÉÉCRIRE — image lourde pour un article « sans déraper » | « c'est une lettre de démission orale » |

**Défauts de prose traités**
- Intro pilier : 2 paragraphes d'ambiance avant la moindre info → réponse directe citable en 1re phrase (humour situationnel > blagues, cible la situation pas les gens), puis l'intro drôle resserrée.
- Capitales criées : PARFAIT, PAS ×3, REVIENT, MÉMORABLE, MIEUX, ELLE-MÊME, RESTE PAS, BIEN, EST, UNE ×2, JAMAIS ×2, DANGEREUX, TOUJOURS → retirées (italique si besoin d'insistance).
- « ce type/cette meuf » → « cette personne » (registre + inclusif sans lourdeur).
- « Et les conneries commencent. » (vulgaire léger) → « Et les dérapages commencent. »
- « Garanti. » (staccato) → fondu dans la phrase ; « Sérieusement. » coupé.
- « channel » → « groupe » ; « process » (prose) → « méthode ».

**Chiffres / citations douteux (gardés, signalés)**
- « Selon une étude de Stanford, les leaders qui utilisent l'humour sont perçus comme 23 % plus compétents et 25 % plus appréciés » — pourcentages à re-vérifier (Aaker/Bagdonas).
- « Une étude de l'Université de Pennsylvanie montre que l'humour est un marqueur de compétence » — source non identifiable.
- « Les gens qui font rire sont promus plus vite » — affirmation sans source.
- « Fary parle souvent du timing… il ne place jamais une vanne au milieu d'un développement » et « Paul Mirabel a une règle : il ne se moque que de lui-même » — attributions non vérifiées.
- « le timing fait 80 % de la blague » — opinion présentée comme chiffre.
- FAQ : « à risque zéro » → « les moins risqués » (absolu intenable) ; « safe » → « sûr ».

---

## 3. `comment-faire-rire-un-homme` (audit 2,8/5 — P0)

**15 exemples · 12 réécrits · 3 gardés** — doublons DJ reggaeton / serveur remplacés (consigne orchestrateur).

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « …la Terre était plate et que LinkedIn était un réseau professionnel (spoiler pour le deuxième : toujours pas) » | RÉÉCRIRE — cliché LinkedIn usé (audit) | « Ce mythe date de la même époque que "souffler dans la cartouche pour que le jeu marche" : tout le monde y croyait, personne n'avait vérifié. » |
| 2 | « Ah oui, tu fais du sport... genre tu marches jusqu'à la boulangerie le dimanche ? » | RÉÉCRIRE — tacle convenu, setup long | « Ah ouais ? T'es sportif, ou t'es abonné ? » |
| 3 | « Bordélique genre "créatif" ou bordélique genre "la science étudie ton appart" ? » | RÉÉCRIRE — chute générique | « Bordélique créatif, ou bordélique "je rachète un chargeur plutôt que de chercher le mien" ? » |
| 4 | « On dirait le moment dans The Office où Michael dit "that's what she said" sauf que TOI tu le fais vraiment. » | RÉÉCRIRE — référence US datée, caps (audit) | « Tu dis ça avec le même ton que "je connais un raccourci", à Lisbonne. » (vraie référence privée : un souvenir commun) |
| 5 | « J'ai essayé de monter un meuble IKEA. J'ai fini avec 7 vis en trop et un truc qui ressemble vaguement à une étagère si tu penches la tête. » | RÉÉCRIRE — cliché IKEA (audit) | « J'ai monté une étagère toute seule. Elle tient. Mais il me reste 7 vis, et depuis je dors mal. » |
| 6 | « Je suis tellement nulle en tout, personne ne voudrait de moi. » (contre-exemple) | GARDER — commentaire « Alarme générale. » remplacé | « → Là, ce n'est plus de l'humour, c'est un appel à l'aide. » |
| 7 | Pascot : « j'ai merdé et c'est hilarant ». Pas « j'ai merdé et je suis une merde » | RÉÉCRIRE — vulgaire + citation non vérifiable attribuée | Attribution retirée, reformulé en voix marque : « j'ai raté et c'est drôle », pas « j'ai raté donc je suis nulle » |
| 8 | « Le DJ joue du reggaeton comme si c'était une urgence médicale. » | RÉÉCRIRE — doublon `comment-faire-rire-une-fille` | « Il est minuit, et tous ceux qui "passaient juste dire bonjour" ont enlevé leur manteau. » |
| 9 | « Le serveur nous ignore tellement qu'on pourrait braquer la caisse et il remarquerait pas. » | RÉÉCRIRE — doublon + dramatisation | « On a levé la main tellement de fois pour le serveur qu'à la table d'à côté, ils pensent qu'on vote. » |
| 10 | Lui : (long monologue) / Toi, après un silence : « Non. » | GARDER — pépite de timing | idem |
| 11 | « C'est moi ou la machine à café fait un bruit de moteur de Formule 1 depuis ce matin ? » | RÉÉCRIRE — amorce « C'est moi ou » usée, pas de twist | « La machine à café fait un bruit de Formule 1 depuis ce matin. Pour la même vitesse de service. » |
| 12 | « ton chien a mangé mon message aussi ou il a juste du retard ? » | RÉÉCRIRE — callback confus | « Toujours rien. Ton chien a mangé ton téléphone aussi ? » |
| 13 | Waly Dia : « Les gens drôles ne sont pas ceux qui font rire, ce sont ceux avec qui on se sent assez à l'aise pour rire. » | GARDER — signalé (non vérifié) | idem |
| 14 | « la surprise est la mère du rire » | RÉÉCRIRE — proverbe fabriqué/cliché | « si tu la vois venir, elle ne fait plus rire » |
| 15 | « C'est de la R&D comique. » | RÉÉCRIRE — jargon + doublon inter-articles | « Considère ça comme ton labo. » |

**Défauts de prose traités**
- Intro : la défense du « mythe » ouvrait l'article avant toute réponse (audit) → réponse directe citable en 1re phrase (les 6 ressorts), mythe raccourci en 2e paragraphe.
- Staccato : « Point. », « Alarme générale. », « Pas besoin de blague. Juste de bien regarder et de bien dire. » → fondus.
- Capitales : JAMAIS, TOI, DÉCRIT, DIS-LE, TOUT, COMPLÉMENTAIRE, NE PAS (FAQ) → retirées.
- « Plus tu chambre » → « chambres » (faute).
- « Jouer les cruches » (terme péjoratif) → « Jouer la naïve ».
- Incohérence audience (lectrice hors des 3 personas) : non traitée dans le texte — décision de ciblage à documenter par Thomas / @creative-strategy (hors périmètre copy).

**Chiffres / citations douteux (gardés, signalés)**
- « Blanche Gardin utilise des silences de 3-4 secondes avant certaines punchlines » — non sourcé.
- « Fary parle souvent de ça : le chambrage, c'est du lien social » — attribution non vérifiée.
- Citation Waly Dia (n° 13) — non vérifiée.
- Citation Pascot (n° 7) — attribution retirée (vulgarité + non vérifiable), idée pédagogique conservée.
- FAQ « Oui, et les études le confirment » — études non citées.
- Florence Foresti citée (déjà présente, contraire à la consigne s7 « zéro legacy ») — gardée, à trancher par Thomas.

---

## 4. `confiance-humour-apres-rupture` (audit 3,6/5 — P2)

**7 exemples d'origine · 2 réécrits · 5 gardés + 4 ajoutés (dont 3 repris de `humour-apres-rupture`)** — l'audit reprochait « très explicatif, peu de vannes » : le levier ici n'était pas de réécrire (peu de matière) mais d'**illustrer**, avec les meilleures vannes de l'article redirigé (non modifié).

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « essaie de rire un peu, ça ira mieux. » (conseil cité) | GARDER | idem |
| 2 | « C'est vrai. Et c'est aussi une façon très efficace de ne rien dire d'utile. » | GARDER — bonne pointe | idem |
| 3 | « Pas "riez, les amis". Mais : voilà les mécanismes, voilà les étapes, voilà… » | RÉÉCRIRE — triplet staccato | « Ce guide, c'est la version concrète : les mécanismes, les étapes, et ce que tu peux faire dès ce soir. » |
| 4 | « …Post-it… "merci de laisser propre". La machine est beige crade depuis 2019. » | GARDER (audit) | idem |
| 5 | « J'ai passé 3 mois à analyser une relation de 6 mois. Mon ratio temps-d'analyse sur temps-de-relation est assez impressionnant. » | RÉÉCRIRE — la chute explique le calcul au lieu de le retourner (variantes : « …À ce rythme je rends mes conclusions l'an prochain », « …C'est plus un chagrin, c'est une thèse ») | « J'ai passé 3 mois à analyser une relation de 6 mois. C'est plus un chagrin, c'est une thèse. » |
| 6 | « Je suis nul, je méritais ce qui m'est arrivé… » (contre-exemple) | GARDER | idem |
| 7 | « avec une précision d'entomologiste » (Waly Dia) | GARDER — image juste | idem |
| A1 | — | AJOUT (repris de `humour-apres-rupture`, resserré) | « J'ai eu la rupture la plus administrative de l'histoire : par message, un mardi à 14h37. J'étais visiblement son activité de pause déjeuner. » |
| A2 | — | AJOUT (repris) | « Tu sais ce moment où tu regardes l'appartement vide et tu réalises que l'autre a pris tout le sel ? » |
| A3 | — | AJOUT (repris) | La playlist « pour les moments romantiques » qui s'appelait « Musique 2 » et contenait 3 chansons. |
| A4 | — | AJOUT (micro-interaction, étape 4) | « "Comme d'habitude ?" — "Oui. Je suis devenu prévisible, mais avec constance." » |

**Défauts de prose traités**
- Intro : 3 paragraphes avant l'idée → réponse directe en 1re phrase (l'humour aide parce qu'il crée de la distance et du lien, dans un ordre : rire, partager, faire rire).
- Jargon : « roadmap basse intensité » → « le programme en douceur » ; « baseline » → « point de repère » ; « courbe de faible résistance vers la haute résistance » → formulation simple.
- Fautes : « tu as rit » → « ri » ; « du résilience » → « de la résilience » ; « conçu à soutenir » → « conçu pour soutenir ».
- Clôture : « Pas parfait, pas linéaire — mais fiable. » (triplet) fondu ; dernière phrase commerciale (« que les livres… ne peuvent pas remplacer ») adoucie en invitation.
- Ton scolaire des « Étape 1 — … (première semaine) » : gardé (durées = chiffres intouchables, et dans les limites §5 selon l'audit).

**Chiffres / citations douteux (gardés, signalés)**
- « C'est un des mécanismes les plus documentés de la résilience psychologique » — affirmation forte sans source (audit).
- « le cerveau en mode survie n'alloue pas de ressources au rire » — vulgarisation neuro non sourcée.
- « Waly Dia utilise systématiquement ce troisième niveau dans ses spectacles » — caractérisation non vérifiée.
- « 6 semaines de progression structurée » (Parcours Confiance) — cohérent avec `je-suis-pas-drole-comment-changer`, gardé.

---

## 5. `rester-muet-en-groupe` (audit 3,8/5 — P1)

**24 exemples · 7 réécrits · 17 gardés** — article solide (audit 3,8) : les pépites relevées par l'audit sont gardées ; on a réécrit les exemples plats, datés ou mal attribués.

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « un figurant de série bien payé : présent dans le plan, mais sans réplique » | GARDER (audit) | idem |
| 2 | « Pas avec de la "confiance en soi" version coach LinkedIn » | RÉÉCRIRE — trope LinkedIn + mot « coach » (charte §5) | « Pas en te répétant "je suis confiant" devant le miroir » |
| 3 | « Et il l'évalue. Sept fois. Sous tous les angles. Comme un jury de Top Chef sur une mousse au chocolat. » | GARDER l'image, staccato fondu | « Et il l'évalue sept fois, sous tous les angles, comme un jury de Top Chef devant une mousse au chocolat. » |
| 4 | « Si tu attends qu'on te tende le micro, tu vas devenir centenaire en silence. » | RÉÉCRIRE — casse la métaphore du ticket, dramatisation | « Si tu attends qu'on appelle ton numéro, la boulangerie ferme. » |
| 5 | « Le tigre, c'est six potes qui parlent de leur week-end. » | GARDER — pépite | idem |
| 6 | « un problème de tuyauterie… Et la tuyauterie, ça se débouche. » | GARDER | idem |
| 7-9 | « Attends, [nom], t'es sérieux là ? » / « …exactement ce qui m'est arrivé… » / « OK, j'ai une question débile. » | GARDER — outils fonctionnels, pas des vannes | idem |
| 10 | Paul Mirabel : « Bonsoir, ça va ? Vous êtes sympas. » C'est nul. C'est du remplissage. | RÉÉCRIRE — citation attribuée non vérifiable + staccato qui qualifie de « nul » un humoriste réel | Attribution retirée : « Beaucoup d'humoristes ouvrent leur passage par une banalité du genre "Bonsoir, ça va ?" : ça ne fait rire personne, mais ça lance la machine. » |
| 11 | « t'as vraiment dit "sushi végé" ? C'est juste du concombre dans du riz, là. » | GARDER (audit) | idem |
| 12 | « Ton boss t'a écrit à 23h pour… un truc "urgent" que t'as fait à 9h. Il dort jamais ? » | GARDER (audit) | idem |
| 13 | « …quelle pizza est la meilleure depuis 12 minutes. Personne mange. » | GARDER (audit) | idem |
| 14 | « Attends, tu peux revenir sur ton truc de "bureau partagé" ? Tu partages avec qui exactement ? » | RÉÉCRIRE — question sans retournement | « Attends, reviens sur ton "bureau partagé". C'est la table de la cuisine, c'est ça ? » |
| 15 | « Attendez, c'est quoi un NFT déjà ? » | RÉÉCRIRE — référence datée (2021) | « Attendez, c'est quoi le padel, exactement ? » |
| 16-17 | « Vous parlez de qui là, j'ai loupé. » / « Pourquoi c'est drôle ? » | GARDER | idem |
| 18 | « C'est fou comme on parle de ça avec autant de sérieux. » | RÉÉCRIRE — constat sans twist | « Je crois que ce débat mérite l'arbitrage vidéo. » |
| 19 | Gardin : « ce n'est pas le mec le plus drôle qui parle, c'est le mec qui place le bon truc dans le bon trou de silence » | GARDER — signalé (citation non vérifiée) | idem |
| 20 | « Je résiste depuis trois ans, je vais finir par craquer. » (carte fidélité) | GARDER | idem |
| 21 | « Je vais peut-être dire un truc con, mais... » | RÉÉCRIRE — vulgaire léger | « Je vais peut-être dire un truc bête, mais... » |
| 22 | « Tu connais l'hôte d'où ? » | GARDER | idem |
| 23 | « C'est fou comme on est tous d'accord en fait, sauf qu'on hurle. » | GARDER (audit) | idem |
| 24 | « Vous m'expliquez en deux phrases, je suis perdu. » | GARDER | idem |

**Défauts de prose traités**
- Intro : réponse directe citable ajoutée en 1re phrase (boucle + 3 leviers) avant la scène du figurant (gardée, elle fonctionne).
- Staccato : « Pas 10. 3. C'est mesurable, c'est faisable. », « Personne ne se rappelle. Donc personne ne juge. », « C'est anodin. C'est le but. » → phrases fluides.
- Symbole « Présence active > parole forcée » → phrase.
- « pré-mémorise / pré-mémorisées / apprends par cœur » (scolaire) → « garde en poche / connais par cœur ».
- « vannes à recracher » → « vannes à ressortir » ; « C'est triché » → « C'est de la triche » ; « Tu accédes » → « Tu accèdes » ; « la nana » (Inès Reg) → « celle ».
- Clôture : empilement de 3 liens + prix en gras façon pub → liens gardés, prix gardé, pression commerciale adoucie.

**Chiffres / citations douteux (gardés, signalés)**
- « Mark Leary, Université Duke… hyper-monitoring social » — Leary existe, terme non standard (audit). Repris aussi en FAQ.
- « les 1,5 seconde après une chute » — non sourcé.
- « cortex préfrontal… se met en mode économie » — vulgarisation neuro non sourcée.
- Citation Blanche Gardin (n° 19) — non vérifiée.
- « 80 % du travail social… 20 % du stress », « 80 % du temps / 15 % », « 5 micro-interactions par jour pendant 2 semaines », « à partir de la 3e semaine » — chiffres d'opinion, gardés.
- « parcours répartie… progression de 30 jours » vs « Parcours Répartie (4 semaines) » dans `je-suis-pas-drole-comment-changer` — quasi cohérent, à harmoniser par Thomas si besoin.

---

## 6. `repondre-moqueries-avec-humour` (audit 3,4/5 — P1)

**14 exemples · 8 réécrits · 6 gardés**

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « Ton cerveau fait ctrl+alt+suppr. Bouche ouverte. Rien ne sort. » | GARDER l'image (reprise dans l'excerpt), staccato fondu | « Ton cerveau fait ctrl+alt+suppr : bouche ouverte, rien ne sort. » |
| 2 | « …sous la douche, la réplique PARFAITE arrive. Comme d'habitude. » | RÉÉCRIRE — trope « esprit de l'escalier » sans chute, caps | « …sous la douche, la réplique parfaite arrive. Devant ton gel douche, qui n'avait rien demandé. » |
| 3 | « Toujours ? Non, une fois j'étais à l'heure. Par erreur. J'ai paniqué. » | GARDER — pépite | idem |
| 4 | « Raté ? J'ai INVENTÉ un nouveau type de stationnement. En diagonale. Sur trois places. » | RÉÉCRIRE — caps, triplet, et « créneau » déjà utilisé dans `je-suis-pas-drole-comment-changer` | « Raté ? À ce stade, le trottoir me connaît par mon prénom. » |
| 5 | « "Encore" ? Tu me surveilles ? Tu veux un planning ? Je peux te partager mon Google Agenda alimentaire si tu veux. » | RÉÉCRIRE — quatre relances, chute plus longue que le setup | « "Encore" ? Tu tiens un registre ? Je peux te mettre en copie de mes repas. » |
| 6 | « "Bizarre" ? C'est mon look expérimental. Demain je teste "mystérieux". Mardi c'est "intriguant". » | RÉÉCRIRE — triplet mécanique + faute (« intrigant ») | « "Bizarre" ? Merci, c'était le thème du jour. Demain, c'est "mystérieux". » |
| 7 | « C'est du jiu-jitsu verbal : tu utilises la force de l'adversaire. » | GARDER | idem |
| 8 | « Merci ! C'est un talent aussi, le non-sport. Ça demande beaucoup de constance. » | GARDER | idem |
| 9 | « Merci, j'y travaille. Les ninjas aussi sont discrets et personne leur reproche. » | RÉÉCRIRE — cliché ninja (audit) ; variante audit « 20 ans d'entraînement » écartée (plate) | « Merci. Mais tu m'as remarqué, donc j'ai encore du boulot. » |
| 10 | « Ah ouais ? C'est quoi qui est nul exactement ? J'adore les retours constructifs. » | RÉÉCRIRE — jargon corporate (audit) | « Ah ouais ? C'est quoi qui est nul, exactement ? Je prends des notes. » |
| 11 | « Ah bon ? Explique-moi alors. J'écoute. » | GARDER | idem |
| 12 | « Attends, laisse-moi 5 minutes, apparemment je suis lent. Faut que je process. » | RÉÉCRIRE — anglicisme (audit) | « Attends, laisse-moi 5 minutes. Il paraît que je suis lent. » |
| 13 | « C'est pas drôle. » (réponse sérieuse) | GARDER | idem |
| 14 | « L'humour est une arme défensive, pas un bouclier universel. » | RÉÉCRIRE — deux métaphores guerrières qui se contredisent | « L'humour est un bon outil de défense, pas une réponse à tout. » |

**Défauts de prose traités**
- Intro : staccato (« Bouche ouverte. Rien ne sort. … Comme d'habitude. ») fondu ; promesse absolue « ne plus jamais subir » → « ne plus subir ».
- Capitales : JAMAIS, INVENTÉ, TOI, UN, LUI, EXPLIQUER, UNE, TOUS, QUAND, COMMENT → retirées. H2 « Quand NE PAS répondre avec humour » laissé tel quel (H2 intouchable) — à corriger par Thomas s'il le souhaite.
- « fight, flight ou freeze » → explicité en français (« combattre, fuir ou se figer »), le terme « freeze » gardé car repris en FAQ.
- « safe » ×2 → « sûr / sans risque » ; « Mémorise » → « Garde en tête » (charte §5).

**Chiffres / citations douteux (gardés, signalés)**
- « La technique préférée de Blanche Gardin » (accord exagéré) — attribution non vérifiée.
- « Fary fait ça en interview constamment » ; « Panayotis Pascot utilise beaucoup cette technique » ; « Waly Dia fait ça sur scène quand un spectateur tente un truc » — caractérisations non vérifiées.
- « Paul Mirabel… reprend [une blague] 40 minutes plus tard » — non sourcé.
- « En 2 semaines de pratique… », FAQ « en 2 à 4 semaines » — affirmations sans source.

---

## 7. `jamais-quoi-repondre-techniques` (audit 3,8/5 — P1)

**22 exemples · 7 réécrits · 15 gardés** — taux de réécriture plus bas assumé : la majorité des exemples sont des **phrases-outils** (kit de relance, questions), pas des vannes ; l'audit les juge bonnes et elles doivent rester banales pour être utilisables par n'importe qui. Chaque « GARDER » est justifié ci-dessous.

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « Ton cerveau se transforme en page "404 Not Found"… Comme un fichier qui charge à 99% et qui reste bloqué. » | RÉÉCRIRE — deux images geek empilées (audit) ; chiffres 404 et 99 % gardés | « Ton cerveau affiche une page 404 : les mots sont là, mais bloqués à 99 %, comme un téléchargement qui attend que tu partes pour finir. » |
| 2 | « Puis, évidemment, 20 minutes plus tard, la réponse parfaite arrive. Trop tard. Le sujet a changé. Et toi tu rumines. » | RÉÉCRIRE — staccato | « Et 20 minutes plus tard, la réponse parfaite arrive, pile quand le sujet a changé trois fois. » |
| 3 | « Ah c'est marrant que tu dises ça... » | GARDER — outil de relance (audit) | idem |
| 4 | « Attends, répète ? J'étais en train de réfléchir à un truc. » | GARDER — outil | idem |
| 5 | « J'avoue. » | GARDER — outil (audit) | idem |
| 6 | « C'est une bonne question. Laisse-moi y réfléchir 2 secondes. » | GARDER — outil pro | idem |
| 7 | « Genre... » + reformulation exagérée | GARDER — amorce de technique | idem |
| 8 | Paul Mirabel : « Mes premiers open mics, j'avais le blanc total entre deux vannes… » | GARDER — signalé (citation d'interview non vérifiée) | idem |
| 9 | « Si je dis un truc nul, c'est la honte. » (voix intérieure) | GARDER | idem |
| 10 | Fary : « Ah mais c'est intéressant ça » | GARDER — signalé (non vérifié) | idem |
| 11 | « Tranquille. Et toi, t'as fait un truc cool ? » | GARDER — outil | idem |
| 12 | « Bonne question. Toi t'en penses quoi ? » | GARDER (audit) | idem |
| 13 | « Les Vosges ? C'est quoi, un week-end ou une expédition ? » | RÉÉCRIRE — alternative plate | « Les Vosges ? Tu reviens avec une nouvelle personnalité ou juste des courbatures ? » |
| 14 | « 3 heures ? Genre avec pause pipi ou sans interruption ? » | RÉÉCRIRE — « pipi » enfantin, pas de retournement | « 3 heures ? À ce stade, c'est plus une réunion, c'est une colocation. » |
| 15 | « La musique ici ressemble à la playlist de mon dentiste » | GARDER (audit) | idem |
| 16 | « Ce buffet a l'air d'avoir vécu des choses » | GARDER (audit) — pépite | idem |
| 17 | « Vous avez vu le dernier spectacle de [humoriste] ? Le sketch sur [sujet] est incroyable » | GARDER — gabarit | idem |
| 18 | « Tu fais quoi ce week-end ? » / « T'as testé le nouveau resto à côté du bureau ? » | GARDER — gabarits | idem |
| 19 | « les réciter comme un robot » | RÉÉCRIRE — « robot » (règle zéro IA/robot du brief) | « les réciter comme une poésie de CE2 » |
| 20 | « C'est le combo… » / « Au lieu de : "Euh... bien..." (blanc mortel) » | GARDER | idem |
| 21 | « 50% des "bons conversationnalistes" sont en réalité de bons questionners » | RÉÉCRIRE — anglicisme (chiffre gardé) | « …de bons questionneurs » |
| 22 | « quand ton cerveau freeze » | RÉÉCRIRE — franglais | « quand ton cerveau se fige » |

**Défauts de prose traités**
- Intro : 3 paragraphes avant la réponse → réponse directe citable en 1re phrase (réflexe non entraîné, se corrige avec 3-5 réponses prêtes).
- « C'est pas un handicap » → « C'est pas un défaut » (mot inadapté).
- Capitales : PARFAITE, UNE, CRÉE, L'AUTRE, ET, REBONDIR → retirées ; « DÉFI : » ×2 → « Défi : ».
- « Mémorise » ×3 → « garde en tête / apprends » (charte §5 : ressortir, pas mémoriser).
- Gras statistique « **65% des gens** » → gras retiré (chiffre intact).

**Chiffres / citations douteux (gardés, signalés)**
- « 65 % des gens rapportent avoir régulièrement le "blanc conversationnel" » — source non citée (audit).
- « 50 % des "bons conversationnalistes" sont de bons questionneurs » — non sourcé.
- « Elles marchent dans 80 % des situations » ; « en 2 semaines… en 4 semaines » — chiffres d'opinion.
- Citation d'interview Paul Mirabel (n° 8) + « un mec qui remplit Bercy aujourd'hui » — non vérifiés.
- « Fary a une technique en interview » ; « Waly Dia utilise cette technique en spectacle » — non vérifiés.
- « l'amygdale » — vulgarisation neuro non sourcée.

---

## 8. `timidite-et-humour` (audit 3,4/5 — P1)

**16 exemples · 8 réécrits · 8 gardés** — correctifs audit (PAF, LE PLUS DRÔLE) appliqués, plus tout le reste.

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « qui entrent dans une pièce et DEVIENNENT la pièce » | GARDER l'image, caps retirées | « …et deviennent la pièce » |
| 2 | « Et la nuit, sous la douche, tu réalises que tu aurais pu placer le truc LE PLUS DRÔLE du siècle si seulement quelqu'un avait attendu 48 heures ta réponse. » | RÉÉCRIRE — caps (audit), setup bavard, « douche » déjà utilisé dans 2 articles du lot | « Et la nuit, tu trouves enfin la réplique parfaite. Elle aurait tout cassé, si la conversation avait accepté une pause de 48 heures. » |
| 3 | « Ce que tu vis maintenant est le début de quelque chose. » | RÉÉCRIRE — cliché motivationnel | « Ils sont partis d'où tu es. » |
| 4 | « pas le talent. L'équipement. Des réflexes. Des techniques. Un plan. » | RÉÉCRIRE — staccato | « ce n'est pas le talent, c'est l'équipement : des réflexes, des techniques et un plan. » |
| 5 | « La façon dont quelqu'un regarde son téléphone au restaurant. Le micro-malaise d'une réunion Zoom… » | GARDER (retouche : « Zoom » → « visio ») | idem |
| 6 | « si c'est nul, vous rigolerez de comment c'est nul » | GARDER | idem |
| 7 | « Si c'est un emoji rire, tu as une vanne. Si c'est "ok..." tu as une donnée. » | GARDER — pépite | idem |
| 8 | « Tu fais de la R&D comique. » | RÉÉCRIRE — tic récurrent du blog (3e occurrence) | « Tu répètes, en somme. » |
| 9 | « La même réplique dans ta bouche fait exploser la table. » | GARDER | idem |
| 10 | « et PAF — la punchline arrive là où personne ne la voyait venir » | RÉÉCRIRE — staccato interdit (audit) | « …et la punchline arrive là où personne ne la voyait venir. » |
| 11 | « Ces moments-là sont de l'or comique. » | RÉÉCRIRE — cliché | « Ces moments-là, c'est ta meilleure matière. » |
| 12 | « Je suis tellement timide que je parle à personne en soirée. C'est pathétique. » (contre-exemple) | GARDER | idem |
| 13 | « → Ni drôle, ni fun, ni actionnable. » | RÉÉCRIRE — triplet + jargon (« fun », « actionnable ») | « → Ça ne fait rire personne, toi compris. » |
| 14 | « Je suis tellement timide qu'en soirée je planifie mes trajets pour éviter les zones de contact humain. J'ai un plan d'évacuation mentale pour chaque pièce. » | GARDER (audit, pépite) — amorce « tellement… que » coupée | « En soirée, je planifie mes trajets pour éviter les zones de contact humain. J'ai un plan d'évacuation mentale pour chaque pièce. » |
| 15 | « Le rire qu'on arrache par surprise dure plus longtemps que le rire qu'on achète avec du bruit. » | GARDER | idem |
| 16 | « **0,99 EUR/mois** — le prix d'une réplique ratée en moins. » | RÉÉCRIRE — chute obscure | « 0,99 EUR/mois : moins cher que le soda que tu tiens en soirée pour avoir l'air occupé. » |

**Défauts de prose traités**
- Intro : réponse directe ajoutée en tête (la timidité n'empêche pas l'humour, elle fournit l'observation et l'effet de surprise).
- Staccato : « Tu remarques. Tu analyses. Tu retiens. », « Pas de la pitié. Pas de la dépréciation. Du recul bienveillant. », « Pas avant. » → fondus.
- Capitales : DEVIENNENT, LE PLUS DRÔLE, UNE ×2, CRÉE, AVEC → retirées.
- « sécurité filet » → « filet de sécurité » ; « safe » → « sûr » ; symboles « = » dans la prose (« Chaque semaine = un palier », « = se planter ») → phrases.
- FAQ : « plan d'évacuation mental » → « mentale » (cohérence).

**Chiffres / citations douteux (gardés, signalés)**
- Citation Pascot « J'écrivais des trucs, je testais par messages… » — non vérifiée.
- « Paul Mirabel a commencé dans des salles de 20 personnes avec une timidité maladive » ; « Panayotis Pascot et Paul Mirabel ont tous les deux commencé en introvertis maladroits » (FAQ) — non vérifiés.
- « Roman Frayssinet teste ses sketches en conversation avant de les mettre sur scène » — non vérifié.
- « l'effet sera 3 fois plus fort » — chiffre d'opinion.
- « Parcours Répartie… 4 semaines » — cohérent avec article 1.

---

## 9. `storytelling-drole-5-structures` (audit 3,8/5 — P1)

**12 exemples · 5 réécrits · 7 gardés** — les 4 pépites citées par l'audit (assistante du sommeil, 60 euros pour manger triste, chemise à l'envers, agenda vierge) sont gardées ; elles sont les démonstrations des structures, les changer casserait la pédagogie. Réécrits : ce qui était daté, criard ou flou.

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | Intro : « Tu connais ce moment où quelqu'un raconte une histoire et tu te demandes pourquoi c'est drôle — alors que toi, exactement la même histoire, tu l'aurais racontée et personne n'aurait ri ? » | RÉÉCRIRE — phrase alambiquée, pas de chute | « Ton pote raconte sa queue à la boulangerie, la table pleure de rire. Toi, tu racontes ton road trip en Islande, quelqu'un regarde son téléphone. » |
| 2 | Escalade crans 1-2 : « Mon boss envoie des emails le dimanche soir. » / « Le dimanche à 23h. Avec "URGENT" dans l'objet. » | GARDER (majuscules = objet du mail, pas un cri) | idem |
| 3 | Cran 3 : « Tellement que j'ai commencé à dormir avec mon téléphone allumé. Je suis devenu l'assistante de mon propre sommeil. » | GARDER (audit) — syntaxe « Tellement que » corrigée | « Du coup, je dors avec mon téléphone allumé. Je suis devenu l'assistante de mon propre sommeil. » |
| 4 | « …j'avais dépensé 60 euros pour manger triste. » | GARDER (audit) — pépite | idem |
| 5 | « J'ai essayé la méditation… Ça m'a donné le temps de lister tout ce qui me stresse. Je recommande pas. » | GARDER — vrai pivot | idem |
| 6 | « Deux phrases. Double effet. » | RÉÉCRIRE — staccato | « Deux phrases suffisent. » |
| 7 | « Y a des gens qui se lèvent à 6h du matin pour courir. Volontairement. Ils mettent leur réveil PLUS TÔT pour avoir le temps de souffrir avant d'aller souffrir au bureau. » | RÉÉCRIRE — caps (audit), setup répété deux fois | « Y a des gens qui se lèvent à 6h pour courir. Volontairement. Ils ont trouvé le moyen de souffrir avant d'aller souffrir au bureau. » |
| 8 | Chemise : « Repassée. Comme un adulte. » → « …à l'envers depuis le début. Adulte confirmé. » | GARDER (audit) — callback exemplaire | idem |
| 9 | Agenda : « Il est vierge. Mais il est très beau. Et je suis en paix avec ça. » | GARDER (audit) | idem |
| 10 | « Comme les gammes au piano » | GARDER | idem |
| 11 | « Et c'est là que tu frappes. » | RÉÉCRIRE — vocabulaire de bagarre pour une technique de complicité | « Et c'est là que tu le surprends. » |
| 12 | « **0,99 EUR/mois** — pour ne plus jamais raconter une histoire qui tombe à plat. » | RÉÉCRIRE — promesse absolue (« plus jamais ») | « 0,99 EUR/mois : moins cher que le verre qu'on t'offre pour abréger ton histoire. » |

**Défauts de prose traités**
- Intro : la réponse (« c'est une question de structure ») arrive désormais en 1re phrase, avant l'exemple drôle.
- Capitales : TOUTES, LE BON, LE (détail) ×2, PLUS TÔT, UN, UNE, EN ELLE-MÊME → retirées ; labels « DÉFI ESCALADE / PIVOT / EXAGÉRATION / CALLBACK / BOUCLE » → « Défi escalade : » etc.
- « L'effet est dévastateur » ×1 gardé (dans la voix, pas un cliché motivationnel).

**Chiffres / citations douteux (gardés, signalés)**
- « La structure fait 70 % du travail, le contenu fait 30 % » (texte + FAQ) — opinion présentée comme fait (audit).
- Attribution d'une structure par humoriste (Mirabel = escalade, Fary = pivot, Frayssinet = exagération, Gardin = callback « sur plusieurs minutes… 10 minutes plus tard », Waly Dia = boucle) — caractérisations pédagogiques non sourcées.
- « Les [parcours] incluent un module storytelling avec exercices progressifs » — à vérifier côté produit (zéro fausse promesse) : je n'ai pas pu le confirmer, gardé tel quel.

---

## 10. `conversation-machine-a-cafe` (audit 3,8/5 — P1)

**23 exemples · 9 réécrits · 14 gardés** — les 4 pépites de l'audit (badge, yaourts 2019, « avoir l'air d'écouter », lundi déguisé en jeudi) sont gardées ; les phrases reprises en FAQ (son de la machine, batteries, inspection) aussi, pour la cohérence FAQ/texte.

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « On fixe la machine comme si c'était un art contemporain. » | GARDER (faute corrigée) | « …comme si c'était de l'art contemporain. » |
| 2 | « des êtres à moitié endormis qui avancent vers la caféine comme des zombies vers les cerveaux » | RÉÉCRIRE — cliché zombies (audit) | « Le lundi matin, tes collègues sont là physiquement. Le reste arrive avec le deuxième café. » |
| 3 | « Je suis encore en mode week-end, j'ai mis 5 minutes à trouver mon badge. » | GARDER (audit) | idem |
| 4 | « C'est ça le vrai choc du lundi — se souvenir que le vendredi était il y a 2 jours. Deux jours. C'est injuste. » | RÉÉCRIRE — staccato, chute plate | « Vendredi soir, c'était il y a 2 jours. On dirait un souvenir d'enfance. » |
| 5 | « Bon, courage à toi. On survit toujours au lundi, paraît-il. » | GARDER | idem |
| 6 | « …Celle du 2ème étage fait un café potable, l'autre c'est de l'eau chaude teintée. » | RÉÉCRIRE — formule rebattue | « …l'autre, c'est de l'eau chaude qui a entendu parler du café. » |
| 7 | « …yaourts du fond — c'est un pacte implicite depuis 2019. On ne sait pas pourquoi, on respecte juste. » | GARDER (audit) — pépite | idem |
| 8 | « Bonne intégration, t'as l'air de survivre — c'est déjà ça. » | GARDER | idem |
| 9 | « Je recharge les batteries avant la réunion de 14h. » | GARDER — accroche volontairement neutre face au boss, reprise en FAQ | idem |
| 10 | « J'ai préparé mes questions. Enfin, j'ai préparé à avoir l'air d'écouter. » | GARDER (audit) — syntaxe corrigée | « J'ai préparé mes questions. Enfin, je me suis préparé à avoir l'air d'écouter. » |
| 11 | Pascot : « rire de soi = signal de confiance. Rire des autres = signal d'insécurité. » | RÉÉCRIRE — formule à symboles, attribution floue | « Rire de soi montre qu'on est à l'aise ; rire des autres montre plutôt qu'on ne l'est pas. » (Pascot cité comme exemple d'autodérision, sans lui prêter la formule) |
| 12 | « Je prends des notes en vrai, promis. » | GARDER | idem |
| 13 | « T'as aussi remarqué que cette machine fait un son bizarre depuis mardi ? Ou c'est juste moi ? » | GARDER — la formule « ou c'est juste moi » est la technique commentée juste après | idem |
| 14 | « Parfait, on est deux maintenant. Je me sens moins fou. On pourra témoigner si elle lâche un jour. » | RÉÉCRIRE — trois phrases pour une idée | « Ouf, on est deux. Si elle explose, on pourra témoigner. » |
| 15 | « À la prochaine inspection de la machine. » | GARDER (reprise FAQ) | idem |
| 16 | « Cette machine a un son vraiment particulier. Je suis pas sûr que le café soit une priorité pour elle. » | GARDER (reprise FAQ) | idem |
| 17 | « La vaisselle dans l'évier, c'est une œuvre collective depuis combien de temps ? Je demande pour un ami. » | RÉÉCRIRE — « je demande pour un ami » = formule internet usée | « Cette pile de vaisselle, on la classe au patrimoine ou on attend encore un peu ? » |
| 18 | « Lundi déguisé en jeudi, ou c'est ma perception ? » | GARDER (audit) | idem |
| 19 | « "Ça va ?" — … Information transmise : zéro. » | GARDER | idem |
| 20 | « "Bon lundi !" — Mensonge collectif. » | GARDER | idem |
| 21 | « c'est le niveau 1 de l'école de commerce » | RÉÉCRIRE — image obscure | « c'est comme annoncer un tour de magie à quelqu'un qui voulait juste son café » |
| 22 | « "Encore une journée de merde" » | RÉÉCRIRE — vulgaire | « "Encore une journée pourrie" » |
| 23 | « Le silence dure. Et puis c'est carrément gênant. » | RÉÉCRIRE — staccato | « Le silence dure, et devient franchement gênant. » |

**Défauts de prose traités**
- Intro staccato (« Tu arrives. La machine couine. Tu attends ton café. ») fondu ; excerpt « Toi. Collègue. Machine. » → phrase (90 secondes gardé).
- Réponse directe en tête (la conversation au travail repose sur des amorces préparées).
- « Roman Frayssinet dirait que… » (paroles prêtées) → « C'est le principe de l'humour d'observation à la Roman Frayssinet ».
- « Mémoriser 3 phrases » / « Mémorise » (règles + FAQ) → « Garder 3 phrases en poche » / « Garde en poche » (charte §5).
- « awkward » : présent **dans un H2** (« l'intégrer sans être awkward ») → non modifiable par consigne ; à corriger par Thomas s'il valide (audit recommande « gênant »).
- « c'est la mort de la conversation » ×2 → une occurrence variée.

**Chiffres / citations douteux (gardés, signalés)**
- « marche 10x mieux », « c'est 80 % du travail », « entre 60 et 90 secondes » — chiffres d'opinion.
- « Panayotis Pascot l'applique en scène avec précision » — caractérisation non vérifiée.

---

## 11. `repartie-soiree-anti-malaise` (audit 4,0/5 — meilleur article du corpus)

**20 exemples · 6 réécrits · 14 gardés** — méthode exhaustive appliquée malgré la note : les 5 pépites de l'audit (fuseau horaire, transition alimentaire, 23h04, « j'annule mon spectacle », météo) sont intactes ; on a réécrit les répliques un cran en dessous (bavardes ou sans retournement).

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « …et tu passes le reste de la nuit en mode fantôme. » | RÉÉCRIRE — « fantôme » cliché (audit) | « …et tu passes le reste de la nuit à t'intéresser beaucoup aux chips. » |
| 2 | « Ce guide, c'est pour le deuxième cas. Parce qu'on a tous vécu les deux. » | GARDER | idem |
| 3 | « Silence. Deux ou trois sourires polis. Quelqu'un change le sujet. Tu veux disparaître sous la table. » | RÉÉCRIRE — staccato + cliché « sous la table » | « Silence, deux ou trois sourires polis, et quelqu'un change de sujet avec une rapidité suspecte. » |
| 4 | « OK, j'annule mon spectacle. » | GARDER (audit) — pépite | idem |
| 5 | « Bon. Dans ma tête c'était hilarant. On va s'en tenir à ça. » | GARDER (repris en FAQ) | idem |
| 6 | « Je vous demande de rester à l'écoute, il est possible que le génie arrive plus tard dans la soirée. » | RÉÉCRIRE — setup administratif trop long | « Restez dans le coin, le génie arrive souvent vers minuit. » |
| 7 | « Je suis sur un fuseau horaire différent. C'est exprès, pour l'exclusivité de mes apparitions. » | GARDER (audit) — pépite | idem |
| 8 | « C'est vrai. Et je revendique ça complètement. » | GARDER (FAQ) | idem |
| 9 | « Ouais, j'avais vu que c'était raté mais j'ai décidé de continuer quand même. » | GARDER (FAQ) | idem |
| 10 | « Tu viens de résumer parfaitement pourquoi [ma mère / mes collègues / l'humanité] me supporte à peine. » | GARDER — gabarit à escalade | idem |
| 11 | « Et toi tu fais quoi dans la vie ? » (contre-exemple) | GARDER | idem |
| 12 | « J'ai regardé exactement 20 minutes avant de décider que ma vie était mieux sans ça. » | RÉÉCRIRE — chute qui s'étire | « J'ai tenu 20 minutes. Je le considère comme vu. » |
| 13 | « Apparemment tout le monde souffre de la même façon. C'est réconfortant. » | RÉÉCRIRE — constat, twist faible | « Donc on a tous le même boss, en fait. Juste avec des prénoms différents. » |
| 14 | « J'ai pas tout entendu mais au vu des réactions, je sens que ça mérite d'être redemandé. » | GARDER (FAQ) | idem |
| 15 | « Bon. Qui a faim ? Parce que moi j'ai besoin d'une transition alimentaire là. » | GARDER (audit) — pépite | idem |
| 16 | « Je propose qu'on parle de la météo comme toutes les personnes normales. » | GARDER (audit) — pépite | idem |
| 17 | « Bien. Je pense qu'on peut tous s'accorder pour passer à un autre sujet sans en parler de façon formelle. » | RÉÉCRIRE — lourd, pas « plus balèze » du tout | « Bien. On va dire que ce sujet a quitté la soirée avant nous. » |
| 18 | « Bon, je pars avant de gâcher l'image parfaite que vous avez de moi. » | GARDER | idem |
| 19 | « Je reviens l'année prochaine avec du meilleur matériel. » | GARDER (FAQ) | idem |
| 20 | « J'avais prévu de partir en mode mystérieux à 23h. Je suis à 23h04… » | GARDER (audit) — pépite | idem |

**Défauts de prose traités**
- Intro : « Soit… Soit… » gardé (bon rythme), réponse directe ajoutée en 1re ligne (3-4 réponses rodées pour 5 situations qui reviennent toujours).
- Staccato « Pas le manque d'idées. Le manque d'audace pour les sortir. » → phrase.
- Fautes : « rit du *situation* » → « de la situation » ; « se rarécifient » → « se raréfient » ; H3/H2 « s'essoufle » → « s'essouffle » (correction orthographique autorisée par le brief, formulation inchangée).
- « checker leur téléphone » → « regarder » ; « mourir de sa belle mort » → « s'éteindre doucement ».
- Symboles « (Autodérision + conscience de soi = sympathique) », « La cohérence de ton > la qualité des vannes » → phrases.
- « mémorise la réplique » → « choisis la réplique » ; clôture « Pas du théorique — du concret. » (slogan) → phrase naturelle.

**Chiffres / citations douteux (gardés, signalés)**
- « Panayotis Pascot explique dans un de ses spectacles que la peur du jugement est le plus grand tueur de répartie » — non vérifié.
- « Fary a passé des années d'open mic à se planter devant 20 personnes » — non vérifié.
- « Roman Frayssinet utilise souvent ce type de pivot » — non vérifié.
- « Improviser 20 % / Préparer 80 % », « 3x plus d'effet » — chiffres d'opinion.

---

## 12. `pourquoi-blagues-marchent-pas` (audit 3,6/5 — P1)

**17 exemples · 9 réécrits · 8 gardés** — les exemples « Mauvais » sont volontairement ratés et restent tels quels ; ce sont les « Bon » qui doivent être irréprochables, et trois ne l'étaient pas.

| N° | Avant | Verdict | Après |
|---|---|---|---|
| 1 | « un sourire poli, ce truc qui veut dire "j'ai entendu mais c'était pas drôle" » | GARDER | idem |
| 2 | Mauvais : « Pourquoi le coq a deux ailes ? Pour traverser la route. » | GARDER — contre-exemple volontaire | idem |
| 3 | Bon : « …200 000 ans à se demander pourquoi le coq traverse la route, et zéro à se demander ce qu'il fait quand il traverse pas ? Genre il révise sa déclaration d'impôts ou quoi ? » | RÉÉCRIRE — trop long, chute faible (audit) ; variante audit « la vaisselle l'attend » écartée | « On a passé 200 000 ans à se demander pourquoi le coq traverse la route. Personne lui a jamais demandé comment il allait. » |
| 4 | Mauvais / Bon : « Mon coloc a essayé de cuisiner hier… il a brûlé l'eau. » | RÉÉCRIRE — « brûler l'eau » = blague connue | « Mon coloc a essayé de cuisiner hier… [pause d'1,5 sec] les voisins ont fermé leurs fenêtres. » (même phrase dans les deux versions, seule la pause change) |
| 5 | Mauvais : « Mon proprio m'a augmenté le loyer de 15%, et toi tu sais l'inflation c'est 3%… » | GARDER — contre-exemple volontaire | idem |
| 6 | Bon : « Mon proprio m'a augmenté le loyer de 15%. Apparemment, l'inflation chez lui est plus forte que dans le reste de la France. » | RÉÉCRIRE — la chute explique encore un peu | « Mon proprio m'a augmenté le loyer de 15%. Il a son propre taux d'inflation. » |
| 7 | Fary : « si la blague a besoin d'une notice, elle a échoué… comme une porte qui claque » | GARDER — signalé (citation non vérifiée) | idem |
| 8 | « Même fond, livraison sèche. Pas de SAV. » | RÉÉCRIRE — jargon (audit) | « Même fond, livraison sèche, et aucune explication derrière. » |
| 9 | Mauvais Tinder (psychanalyse à 90 balles) | GARDER — contre-exemple volontaire | idem |
| 10 | Bon : « Tinder, c'est moins cher qu'un psy, et ça t'apprend autant de trucs sur toi. » | RÉÉCRIRE — comparaison attendue, pas de retournement | « Six mois sur Tinder, bilan : c'est une thérapie, sauf que le psy ne me répond jamais. » (setup 5 mots / punchline 11 mots : compte du texte respecté) |
| 11 | « racontées avec un visage de PV de réunion » | GARDER — image juste (audit) | idem |
| 12 | « à 3h du mat quand tout le monde a un morceau de pizza dans la main » | GARDER | idem |
| 13 | « La meilleure vanne au mauvais moment = nulle. » | RÉÉCRIRE — symbole | « La meilleure vanne du monde, au mauvais moment, ne vaut rien. » |
| 14 | « C'est le sourire de pitié vocalisé. Move on. » | RÉÉCRIRE — anglicisme | « C'est le sourire de pitié, version sonore. Passe à autre chose. » |
| 15 | « Tu as commencé par "j'ai une bonne". Tu es déjà mort. » | RÉÉCRIRE — dramatisation | « C'est mal parti, mais pas perdu : termine ta phrase normalement et oublie cette formule. » |
| 16 | « Bon, OK, je la garde pour la prochaine soirée. » | GARDER (FAQ) | idem |
| 17 | « **C'est 0,99 EUR/mois** — moins cher qu'une vanne qui rate. » | RÉÉCRIRE — chute bancale (une vanne ratée ne coûte rien… en euros) | « 0,99 EUR/mois : moins cher qu'une vanne ratée, qui elle peut te coûter la soirée. » |

**Défauts de prose traités**
- Intro : « Faux. » staccato → « Et c'est rarement vrai » ; réponse directe déjà en tête (gardée).
- Capitales : JAMAIS ×3 (texte + FAQ) → retirées ; « Pas sept. Une. » → phrase.
- « tu force » → « tu forces » ; « full-engagée » → « à fond ».
- « Le tueur silencieux n°1 / n°2 » gardé (formule utile au diagnostic, pas un cri).

**Chiffres / citations douteux (gardés, signalés)**
- « Dans 9 cas sur 10… », « 30 % d'idée et 70 % d'exécution », « 50 % du travail comique », « 80 % des "blagues qui marchent pas" », « 90 % de ton problème », « Le public décroche au mot 8 », « L'effet est multiplié par 3 » — chiffres d'opinion non sourcés.
- **Incohérence interne** : Raison 5 dit « la chute est toujours plus courte que l'amorce », mais l'exemple « Bon » affiche « Setup 5 mots. Punchline 11 mots. » — chiffres gardés (consigne), contradiction à trancher par Thomas.
- Citations : Fary (« notice… porte qui claque »), Roman Frayssinet (« tu enterres deux fois »), Paul Mirabel (« ne dit jamais "voici une blague" »), Pierre Croce (pauses de 2 secondes) — non vérifiées.
- **Pierre Croce** : hors du pool de référence historique (audit) — déjà cité, gardé, à valider par Thomas.
