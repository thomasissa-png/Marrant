# Corrections de l'audit code s20, partie 1 : proposition, rien appliqué

> @copywriter, 12/10/2026. Source de l'audit : `docs/qa/audit-articles-code-s20-partie-1.md`. Cible : `apps/web/src/lib/blog-articles.ts` (articles statiques, numéros de ligne à HEAD). **Aucune modification du code, aucun commit.** Méthode de ce matin reproduite (`docs/copy/corrections-s11-s20.md`) : avant / après exacts, source si un fait est gardé ou corrigé, liste anonymisée pour relecture à l'aveugle (règle d'or P0 s18), clé tout en bas.
> Les « avant » sont recopiés du fichier (guillemets droits, apostrophes droites). Les « après » n'ont aucun tiret cadratin. Les tirets des intertitres H2/H3 ne sont pas traités ici (fait mécaniquement à part).
> Relecteurs : `docs/copy/relecture-audit-code-s20/passages-partie-1.md` (liste anonymisée seule, 60 passages).

## 1. Synthèse

| Type principal | Passages | Détail (codes) |
|---|---|---|
| A. Propos, citation ou anecdote introuvable : humoriste gardé, « dans la veine de », exemple imaginé ou description neutre | 27 | PI5 PI6 RE1 RE2 TI6 ER1 ER2 DE1 DE3 DE5 DE6 DE7 HQ1 HQ2 HQ3 HQ5 HQ6 HN2 HN3 HN4 EX1 EX4 EX5 PD1 PD2 PD8 PD9 |
| B. Chiffre ou mesure prêtés à un humoriste, retirés | 3 | RE3 TI2 TI5 |
| C. Fait faux ou inexact corrigé | 10 | PI1 (Gardin) PI3 (Frayssinet) HN5 (Waly Dia « Créteil ») FT1 à FT7 (Frayssinet et Fary mal classés) |
| D. Étude inexacte | 1 | PI2 (Nouveau-Mexique) |
| E. Pause « une seconde environ » | 5 | TI1 TI3 TI7 MB1 MB2 |
| F. « Règle des 3 secondes » à sens unique | 4 | TI4 TI9 TI10 DE2 |
| G. « 90 % des gens » sans chiffre | 1 | DE4 |
| H. Vanne ou formule sous la barre, remplacée | 8 | PD3 à PD7, EX3, HQ7, TI8 |
| I. Cohérence, promesse, ton, coquille, ancre | 7 | PI4 ER3 HQ4 HN6 EX2 EX6 PD10 |
| J. Blanche Gardin gardée, fait juste (polémique 2024, fin du stand-up 2025) | 1 | HN1 |
| **Total** | **67** | 11 articles ; 60 passages en relecture à l'aveugle, 7 appliqués sans relecture (mécaniques : TI1 TI7 MB1 MB2 EX2 PI4 ER3) |

Par article : pilier 6, répartie 3, timing 10, erreurs 3, répartie débutant 7, humour quotidien 7, 5 types 7, humour noir 6, exercices 6, phrases drôles 10, meilleures blagues 2. Les 3 articles redirigés et `autoderision-interactions` (au niveau) ne sont pas touchés.

## 2. Règles appliquées et décisions de coordination

- **Règle 1 (founder-preferences 12/10)** : l'humoriste reste toujours. Un propos rapporté introuvable devient « dans la veine de », « imagine X », une consigne d'observation ou une description neutre. Aucun chiffre prêté à une personne réelle. Fait faux corrigé avec source. Étude fausse retirée ou remplacée par la vraie.
- **Règle 2 (pause)** : « une seconde environ » partout où il s'agit de la pause avant la chute. Le temps de réflexion de l'accusé de réception (« 2 à 3 secondes », article répartie) est un autre concept : non touché, voir §5.
- **Règle 2 bis (« règle des 3 secondes »)** : un seul sens, **« attends un instant avant la chute »** (coordonné avec la partie 2, qui renomme son usage « réponds sans trop réfléchir »). Le nom est gardé (`llms-content.ts` l.106 le place déjà dans le timing) et la durée est mise à une seconde environ : le texte explique que les « 3 secondes » sont le comptage « un, deux, trois » dit sans traîner (TI4). **Risque assumé** : l'association du nom et de la durée peut paraître forcée ; si la relecture à l'aveugle la rejette, repli proposé : renommer en « la règle de la seconde » (H2 de `timing-humour` à toucher, donc décision de Thomas).
- **Règle 3** : « 90 % des gens n'écoutent pas » devient « La plupart des gens » (DE4). Le « 90% » de Mirabel dans `phrases-droles-conversations` disparaît avec sa citation (PD1).
- **Règle 5** : Blanche Gardin gardée, fait juste (HN1).
- **Garde-fous** : H2 et H3 non touchés (aucun intertitre modifié), slugs intacts, aucun lien supprimé (2 textes d'ancre corrigés, URL identiques), prix intacts. **6 réponses de FAQ modifiées** (questions intactes), car elles portaient un fait ou un chiffre à corriger : PI6, TI10, HQ2, FT7, EX6, PD10. Chiffres pédagogiques non sourcés et cohérents gardés (règle du 08/10), voir §5.
- **Vannes de remplacement** : deux viennent du catalogue déjà relu à l'aveugle en s14 (`docs/content/vannes-actives-s17.json` : « appli calories » PD5, « grand-mère, quelqu'un de plus haut placé » PD7, légèrement raccourcie) et une est l'étalon « réveil » (`joke-quality-bar.ts` l.27, FT3). Les autres (PD3, PD4, PD6, EX3, HQ7) sont nouvelles : relecture à l'aveugle obligatoire.

## 3. Faits vérifiés (WebSearch du 12/10/2026, pages de résultats, pas de lecture intégrale)

| Fait (passage) | Verdict | Source |
|---|---|---|
| Blanche Gardin : débuts au Jamel Comedy Club en 2006, premier seul-en-scène *Il faut que je vous parle* en 2015 (PI1) | **VRAI** (Wikipedia donne 2014-2015 pour la série, les autres sources 2015) : « près de dix ans » juste | https://en.wikipedia.org/wiki/Blanche_Gardin ; https://www.purepeople.com/people/blanche-gardin_p266170 ; https://www.sortiraparis.com/scenes/spectacle/articles/84413-blanche-gardin-a-la-nouvelle-seine-notre-critique |
| Blanche Gardin : polémique de 2024 (sketch sur Gaza, soirée Voice for Gaza), annonce de l'arrêt du stand-up en novembre 2025 (HN1) | **VRAI** (mois exact de la polémique non fixé par les sources : « 2024 » seul est écrit). Pas de lien de cause affirmé dans le texte | https://www.parismatch.be/culture/scene/2025/11/12/blanche-gardin-met-un-terme-a-sa-carriere-dans-le-stand-up-un-peu-a-cote-des-enjeux-de-lepoque-6OALAFRA4NHGXAPOHJ2PW3AXN4/ ; https://www.dhnet.be/medias/divers/2025/12/11/je-dois-quitter-mon-appartement-blanche-gardin-a-la-rue-suite-a-son-sketch-sur-gaza-et-lantisemitisme-7FJO6ULDPBBG7IRL55X3TADE6I/ |
| Paul Mirabel : se produit dans les cafés-concerts parisiens après le Campus Comedy Tour 2018 (PI1) | **VRAI** (sources grand public, détail des premières dates imprécis) : « a joué dans des cafés-concerts parisiens » seul est écrit | https://diplomeo.com/actualite-itineraire_d_un_jeune_devenu_etudiant_le_plus_drole_de_france ; https://www.fnacspectacles.com/artist/paul-mirabel/ |
| Paul Mirabel « remplit Bercy » (PI1, gardé) | **VRAI** : deux dates à l'Accor Arena (Bercy) les 10 et 11/04/2026 | https://www.accorarena.com/en/events-and-tickets/paul-mirabel--942cc |
| Waly Dia : né à Grenoble (1988), débuts sur les scènes de Nantes (PI5, DE6, HN5) | **VRAI** pour Grenoble (donc « Créteil » faux) ; Nantes selon 3 sources dont Politis, une partie d'entre elles secondaires | https://www.politis.fr/articles/2022/01/waly-dia-eclats-de-rire-sur-france-reac-43985 ; https://franco.wiki/fr/Waly_Dia.html ; https://www.fnacspectacles.com/artist/waly-dia/ |
| Waly Dia : humour politique et social, « sniper de punchlines » (HN5, PD8) | **VRAI** dans l'esprit | https://www.letemps.ch/culture/waly-dia-le-sniper-de-punchlines-fier-rempart-de-l-humour-politique |
| Fary : Jamel Comedy Club (2012), premier one-man-show au Point-Virgule (2014), AccorHotels Arena (2019) (PI1) | **VRAI** sur les grandes lignes, **sources secondaires** (billetterie, dates qui varient d'un an) : le texte ne cite aucune année | https://www.billetreduc.com/artiste/fary ; https://www.sortiraparis.com/en/what-to-see-in-paris/shows/articles/201409-madame-sarfati-le-comedy-club-de-l-humoriste-fary |
| Fary « centaines d'open mics » (PI1) | **INTROUVABLE** : aucune source sur ses scènes ouvertes d'avant 2012. Retiré, remplacé par le parcours vérifié | recherche sans résultat fiable |
| Roman Frayssinet : humour absurde, introspectif, surréaliste, digressions (PI3, PD2, FT2, FT3) | **VRAI** pour le style (presse) ; les sujets cités dans l'ancien texte (WhatsApp, métro, Zoom, messages vocaux) sont INVÉRIFIABLES | https://leclaireur.fnac.com/article/273372-que-vaut-le-spectacle-de-roman-frayssinet-diffuse-ce-soir-sur-canal/ ; https://www.lapresse.ca/arts/festivals/juste-pour-rire/critiques/201707/17/01-5116820-le-savoureux-delire-de-roman-frayssinet.php |
| Étude de l'Université du Nouveau-Mexique (PI2) | **INEXACTE** : Greengross et Miller (*Intelligence*, 2011, 400 étudiants) relient la capacité à PRODUIRE de l'humour à l'intelligence verbale, pas à des « mécanismes cognitifs » d'incongruité ou de calibrage social | https://research.aber.ac.uk/en/publications/humor-ability-reveals-intelligence-predicts-mating-success-and-is/ |
| Crawford et Caltabiano (2011), programme de 8 semaines (PI, non modifié) | **VRAI** (relevé par l'audit) | https://researchonline.jcu.edu.au/18802/ |
| Citations Mirabel « 10 % / 90 % », Fary « 200 vannes », Waly Dia « ponctuation », Pascot « notait ses vannes ratées », Gardin « 8 ans qu'il me supporte » et « et si on arrêtait… Noël », Mirabel « honnête », Frayssinet « 80 % » | **INTROUVABLES** (audit s20 + recherches du jour sans résultat) : reformulés sans guillemets d'attribution | aucune |
| Prix 2,99 € / mois (non modifié) | **VRAI** (founder-preferences 03/10) | code du dépôt |

## 4. Corrections détaillées (avant / après exacts)

### Article 1 : `comment-devenir-drole` (pilier, `blog-articles.ts` l.19-125)

**PI1** | type C | l.31
- Avant : `Sauf que Paul a commencé dans des salles de 20 personnes à Paris, à tester des vannes qui tombaient à plat une fois sur deux. **Fary** a fait des centaines d'open mics avant de trouver son style. **Blanche Gardin** a mis plus de 10 ans à passer de l'écriture pour les autres à son propre spectacle.`
- Après : `Sauf que Paul a joué dans des cafés-concerts parisiens, à tester des vannes devant de tout petits publics. **Fary** est passé par le Jamel Comedy Club puis par le Point-Virgule avant de remplir les grandes salles. **Blanche Gardin** a mis près de dix ans entre ses débuts au Jamel Comedy Club (2006) et son premier seul-en-scène (2015).`
- Source : §3 (Gardin 2006 et 2015 vérifiés ; Mirabel cafés-concerts ; Fary JCC et Point-Virgule, sources secondaires). Les chiffres « 20 personnes », « une fois sur deux », « centaines » sont retirés ; « plus de 10 ans » était faux.

**PI2** | type D | l.37
- Avant : `Des chercheurs de l'Université du Nouveau-Mexique ont montré que l'humour repose sur des **mécanismes cognitifs précis** : détection d'incongruité, résolution de tension, calibrage social.`
- Après : `L'humour repose sur des **mécanismes cognitifs précis** : détection d'incongruité, résolution de tension, calibrage social.`
- Source : l'étude de Greengross et Miller (2011) porte sur le lien humour et intelligence verbale (§3). L'attribution est retirée, la phrase devient celle de l'article, cohérente avec le bloc « Définition » qui suit. Même phrase dans `llms-content.ts` l.56 (hors périmètre, à aligner).

**PI3** | type C | l.51
- Avant : `**Roman Frayssinet** est un génie de l'observation. Il prend un truc que tout le monde vit (les groupes WhatsApp, les gens dans le métro, les réunions Zoom) et il le décrit avec une précision chirurgicale qui te fait dire "mais c'est exactement ça".`
- Après : `**Roman Frayssinet** part de détails minuscules, un truc que tout le monde a vécu, et les fait dériver vers l'absurde. Tout commence par un regard qui a vu ce que les autres ignorent : c'est ça, l'observation.`
- Source : presse sur son style (§3). Les trois sujets cités sont retirés.

**PI4** | type I (mécanique) | l.68
- Avant : `notre article [Timing humour : plus fort que la blague](/blog/timing-humour) détaille les techniques des pros.`
- Après : `notre article [Timing humour : le secret de la blague](/blog/timing-humour) détaille les techniques des pros.`
- Texte d'ancre aligné sur le titre réel de l'article (l.235). URL identique.

**PI5** | type A | l.82
- Avant : `**Waly Dia** raconte qu'à ses débuts, il avait un taux de réussite de 30%. Aujourd'hui, il remplit des salles, et entre les deux il y a des milliers de vannes testées, affinées, recalibrées.`
- Après : `**Waly Dia** a débuté sur les scènes nantaises. Aujourd'hui, il remplit des salles, et entre les deux il y a un paquet de vannes testées, affinées, recalibrées.`
- Source : §3 (débuts à Nantes). Propos rapporté, « 30% » et « des milliers » retirés.

**PI6** | type A | FAQ, réponse de « Est-ce que tout le monde peut devenir drôle ? » (l.121)
- Avant : `Paul Mirabel, Fary, Blanche Gardin ont tous commencé en salle de 20 personnes à rater leurs vannes une fois sur deux. C'est ça, la progression.`
- Après : `Paul Mirabel, Fary, Blanche Gardin ont tous commencé sur de petites scènes, avec leur lot de bides. C'est ça, la progression.`
- Même fait que PI1, sans chiffre. La question de la FAQ est intacte.

### Article 2 : `comment-avoir-de-la-repartie` (l.127-232)

**RE1** | type A | l.157 (technique 1)
- Avant : `Regarde **Fary** en interview. Quand un journaliste lui pose une question piège, il ne se précipite jamais. Il accuse réception, sourit, prend son temps. Et sa réponse est toujours meilleure que s'il avait répondu en panique.`
- Après : `Regarde **Fary** en interview et observe comment il gagne du temps quand on lui pose une question piège. Fais pareil : accuse réception, souris, prends ton temps. Ta réponse sera presque toujours meilleure que si tu avais répondu en panique.`
- Consigne d'observation à la place d'un fait affirmé (aucune interview vérifiée).

**RE2** | type A | l.169 (technique 3)
- Avant : `**Roman Frayssinet** utilise beaucoup cette technique sur scène : une remarque du public, et elle repart à l'envoyeur avec un supplément.`
- Après : `Imagine **Roman Frayssinet** face à une remarque venue du public : avec ce réflexe, elle repart à l'envoyeur avec un supplément.`
- Exemple imaginé assumé (l'interaction avec le public n'est pas ce qui le caractérise, §3).

**RE3** | type B | l.201 (technique 10)
- Avant : `**Blanche Gardin** peut tenir un silence de 5 secondes face au public, et la salle rit avant même qu'elle ait dit un mot.`
- Après : `**Blanche Gardin** sait tenir un silence face au public, et la salle rit avant même qu'elle ait dit un mot.`
- Mesure attribuée à une personne réelle, retirée ; Gardin conservée.
### Article 3 : `timing-humour` (l.234-319, page de référence du timing)

**TI1** | type E (mécanique) | l.238 (« En bref »)
- Avant : `une pause de 2 à 3 secondes avant la punchline crée la tension, et la chute la libère en rire.`
- Après : `une pause d'une seconde environ avant la punchline crée la tension, et la chute la libère en rire.`

**TI2** | type B | l.248
- Avant : `Regarde un de ses sketches au ralenti : il y a des silences de 3-4 secondes avant certaines chutes. Il regarde le public,`
- Après : `Regarde un de ses sketches au ralenti : écoute ses silences avant certaines chutes. Il regarde le public,`
- Mesure jamais publiée, retirée ; même traitement que C20 de ce matin. Frayssinet conservé.

**TI3** | type E | l.252 (« À retenir »)
- Avant : `Une pause de 2 à 3 secondes avant la punchline crée la tension nécessaire au rire. En conversation, attendre 3 secondes avant de répondre donne l'impression de spontanéité et améliore la qualité de chaque intervention.`
- Après : `Une pause d'une seconde environ avant la punchline crée la tension nécessaire au rire. En conversation, attendre un instant avant de lâcher ta chute donne l'impression de spontanéité et améliore la qualité de chaque intervention.`

**TI4** | type F (avec E) | l.256-262, sous le H2 « Comment utiliser la règle des 3 secondes ? » (H2 inchangé)
- Avant :
```
En conversation, quand tu veux placer une remarque drôle : **attends 3 secondes** après que la personne a fini de parler.

Pas 1 seconde : trop rapide, on dirait que tu n'écoutais pas et que tu attendais juste ton tour de parler. (On a tous ce pote, et on a tous arrêté de lui raconter des trucs.)

Pas 10 secondes : le train est parti et tu es resté sur le quai avec ta vanne.

3 secondes, c'est le bon dosage : assez pour avoir l'air de réfléchir, pas assez pour avoir l'air de dormir. Ta réponse paraît spontanée, et c'est exactement ce que font les bons improvisateurs.
```
- Après :
```
En conversation, avant de lâcher ta remarque drôle ou ta chute : **attends un instant**, une seconde environ, après la fin de la phrase qui précède.

Pas de pause du tout : trop rapide, on dirait que tu n'écoutais pas et que tu attendais juste ton tour de parler. (On a tous ce pote, et on a tous arrêté de lui raconter des trucs.)

Pas dix secondes : le train est parti et tu es resté sur le quai avec ta vanne.

Pourquoi « 3 secondes » ? Parce que le réflexe se compte en trois temps dans ta tête, « un, deux, trois », sans traîner : ça tient en une seconde environ, assez pour avoir l'air de réfléchir, pas assez pour avoir l'air de dormir. Ta réponse paraît spontanée, et c'est exactement ce que font les bons improvisateurs.
```
- Raison : sens unique de la règle (attendre un instant avant la chute), durée alignée sur « une seconde environ ». Voir le risque assumé en §2.

**TI5** | type B | l.268
- Avant : `Elle peut rester immobile 5 secondes en regardant le public, et la salle rit déjà nerveusement avant qu'elle ait dit un mot.`
- Après : `Elle sait rester immobile en regardant le public, et la salle rit déjà nerveusement avant qu'elle ait dit un mot.`

**TI6** | type A | l.270
- Avant : `**Fary** utilise un timing différent mais tout aussi efficace : il accélère son débit dans le setup, puis freine d'un coup avant la chute. Ce contraste crée une surprise presque physique : ton cerveau est lancé à pleine vitesse, et le coup de frein le projette dans le rire.`
- Après : `Dans la veine de **Fary**, le timing passe plutôt par le débit : tu accélères dans le setup, puis tu freines d'un coup avant la chute. Ce contraste crée une surprise presque physique : le cerveau de ton public est lancé à pleine vitesse, et le coup de frein le projette dans le rire.`
- Technique conservée sous forme de consigne ; « ton cerveau » devient « le cerveau de ton public » (le « tu » est maintenant celui qui parle).

**TI7** | type E (mécanique) | l.278
- Avant : `3. **La micro-pause** : 2-3 secondes de silence`
- Après : `3. **La micro-pause** : une seconde de silence environ`

**TI8** | type H | l.287
- Avant : `c'est du ketchup sur un soufflé : techniquement légal.`
- Après : `c'est du ketchup sur un soufflé : personne ne t'arrête, mais le soufflé ne s'en remet pas.`
- La chute ne voulait rien dire (relevé par l'audit, sans urgence).

**TI9** | type F | l.305 (exercice 2)
- Avant : `**Exercice 2 : Les 3 secondes.** En conversation, force-toi à compter mentalement "1... 2... 3..." avant de répondre.`
- Après : `**Exercice 2 : Les 3 secondes.** En conversation, force-toi à compter mentalement "1... 2... 3...", sans traîner, avant de lâcher ta remarque.`

**TI10** | type F | FAQ, réponse de « Comment améliorer son timing comique ? » (l.316). Chaîne entre guillemets doubles dans le code : les guillemets français évitent de casser la chaîne.
- Avant : `pratique la règle des 3 secondes en conversation (compte avant de répondre)`
- Après : `pratique la règle des 3 secondes en conversation (compte « un, deux, trois » dans ta tête avant de lâcher ta remarque)`
### Article 4 : `erreurs-blagues` (l.321-382)

**ER1** | type A | l.333 (erreur 1)
- Avant : `**Paul Mirabel** a un sketch entier sur ce thème : il raconte une situation, la salle ne réagit pas immédiatement, et au lieu d'expliquer, il continue comme si de rien n'était. Et 30 secondes plus tard, le rire arrive. Parce que parfois, le cerveau a besoin de quelques secondes pour faire "clic".`
- Après : `Imagine **Paul Mirabel** devant une salle qui ne réagit pas tout de suite : au lieu d'expliquer sa vanne, il continue comme si de rien n'était, et le rire finit par arriver. Parce que parfois, le cerveau a besoin de quelques secondes pour faire "clic".`
- Aucun sketch identifié (audit) : exemple imaginé assumé, « 30 secondes » retiré.

**ER2** | type A | l.359 (erreur 4)
- Avant : `**Panayotis Pascot** peut raconter un truc banal, genre faire ses courses, et c'est hilarant, parce qu'il est dedans`
- Après : `**Panayotis Pascot** peut raconter un truc banal et c'est hilarant, parce qu'il est dedans`
- Le sujet « faire ses courses » n'est pas vérifiable.

**ER3** | type I (mécanique) | l.363 (erreur 5)
- Avant : `On a écrit un article entier sur le sujet : [Timing humour : plus fort que la blague](/blog/timing-humour).`
- Après : `On a écrit un article entier sur le sujet : [Timing humour : le secret de la blague](/blog/timing-humour).`
- Texte d'ancre aligné sur le titre réel. URL identique.

### Article 6 : `repartie-debutant-5-etapes` (l.456-534)

(L'article 5, `autoderision-interactions`, est au niveau : non touché.)

**DE1** | type A | l.470 (étape 1)
- Avant : `**Paul Mirabel** a dit en interview qu'à ses débuts, il ne cherchait pas à être drôle : il cherchait à être honnête. L'humour venait après, naturellement. C'est la même chose en conversation.`
- Après : `Regarde **Paul Mirabel** : une bonne partie de ses vannes, c'est juste une gêne honnête dite à voix haute. L'humour vient après, naturellement. C'est la même chose en conversation.`
- Aucune interview trouvée ; description de style (personnage timide, documenté).

**DE2** | type F | l.481 (étape 2, première puce)
- Avant : `l'accusé de réception ultime. Donne 3 secondes de réflexion.`
- Après : `l'accusé de réception ultime. Te laisse un instant pour réfléchir.`
- Aligné sur la règle de pause (plus de « 3 secondes » prescrites ici). L'article `comment-avoir-de-la-repartie` garde « 2 à 3 secondes » : autre concept, voir §5.

**DE3** | type A | l.485 (étape 2)
- Avant : `**Fary** utilise des phrases filet de sécurité tout le temps en interview. Quand un journaliste pose une question gênante, il a toujours un "c'est une excellente question" qui lui achète 5 secondes. Ce sont nos`
- Après : `Les humoristes en interview ont leurs phrases filet de sécurité. Imagine **Fary** face à une question gênante : un "c'est une excellente question" lui achète quelques secondes. Ce sont nos`
- Phrase attribuée et « 5 secondes » introuvables : exemple imaginé assumé.

**DE4** | type G | l.491 (étape 3)
- Avant : `90% des gens en conversation n'écoutent pas : ils attendent leur tour de parler.`
- Après : `La plupart des gens en conversation n'écoutent pas vraiment : ils attendent leur tour de parler.`

**DE5** | type A | l.495 (étape 3)
- Avant : `**Roman Frayssinet** fait ça sur scène : il attrape un mot du public et construit dessus. Ce n'est pas du génie : c'est de l'écoute active avec un twist. Regarde ses [vidéos](/videos) analysées sur le site pour voir comment il fait.`
- Après : `Imagine **Roman Frayssinet** avec un mot lancé par le public : il l'attrape et construit dessus. Ce n'est pas du génie : c'est de l'écoute active avec un twist. Regarde nos [vidéos](/videos) analysées pour repérer cette écoute chez les pros.`
- Lien `/videos` conservé. « Ses vidéos » devient « nos vidéos » (aucune fiche Frayssinet vérifiée).

**DE6** | type A | l.505 (étape 4)
- Avant : `**Waly Dia** raconte qu'il testait ses vannes dans des salles de 10 personnes avant de monter sur les grandes scènes. Même principe`
- Après : `**Waly Dia** a débuté sur les scènes nantaises avant de monter sur les grandes. Même principe`
- Source : §3.

**DE7** | type A | l.516 (étape 5)
- Avant : `C'est exactement ce que font les pros. **Panayotis Pascot** a raconté qu'il notait ses vannes ratées pour comprendre pourquoi elles ne marchaient pas. L'analyse, c'est ce qui transforme l'expérience en compétence.`
- Après : `C'est exactement ce que font les pros. Imagine **Panayotis Pascot** après un soir où une vanne n'a pas pris : il se demande pourquoi, puis il la réécrit. L'analyse, c'est ce qui transforme l'expérience en compétence.`
### Article 7 : `humour-quotidien-8-habitudes` (l.536-623)

**HQ1** | type A | l.548 (habitude 1)
- Avant : `En réalité, **Roman Frayssinet** note tout : ses observations dans le métro, les phrases bizarres entendues au supermarché, les situations absurdes du quotidien. Son téléphone est un cimetière de notes vocales, et ses meilleurs sketches en sortent.`
- Après : `En réalité, les humoristes notent tout : leurs observations dans le métro, les phrases bizarres entendues au supermarché, les situations absurdes du quotidien. Imagine le téléphone d'un **Roman Frayssinet** : un cimetière de notes vocales, d'où sortent les meilleurs sketches.`
- Exemple imaginé assumé (le « cimetière de notes vocales » n'est sourcé nulle part).

**HQ2** | type A | FAQ, réponse de « Combien de temps pour que ça devienne naturel ? » (l.621)
- Avant : `Roman Frayssinet a son téléphone rempli de notes vocales de moments absurdes : c'est exactement ce processus, juste fait depuis des années.`
- Après : `Imagine le téléphone d'un Roman Frayssinet, rempli de notes vocales de moments absurdes : c'est exactement ce processus, juste fait depuis des années.`

**HQ3** | type A | l.558 (habitude 2)
- Avant : `Il prend une situation banale (aller chez le médecin, manger au resto) et la décrit avec des mots tellement inattendus`
- Après : `Il prend une situation banale et la décrit avec des mots tellement inattendus`
- « Roi de la reformulation » (opinion) gardé ; les deux sujets non vérifiés sont retirés.

**HQ4** | type I | l.564 (habitude 3)
- Avant : `Le compliment absurde est la forme d'humour la plus universellement appréciée.`
- Après : `Le compliment absurde est l'une des formes d'humour les plus faciles à faire passer.`

**HQ5** | type A | l.582 (habitude 5)
- Avant : `**Blanche Gardin** part souvent d'un "et si" pour construire ses sketches : "Et si on arrêtait de faire semblant d'aimer Noël ?"`
- Après : `Un "et si" à la **Blanche Gardin**, ça pourrait donner : "Et si on arrêtait de faire semblant d'aimer Noël ?"`
- Citation entre guillemets introuvable : exemple imaginé assumé.

**HQ6** | type A | l.596 (habitude 7)
- Avant : `C'est une technique de stand-up que **Waly Dia** utilise dans chaque spectacle, et elle marche`
- Après : `C'est une technique de stand-up que **Waly Dia** manie très bien, et elle marche`
- « Dans chaque spectacle » non vérifiable.

**HQ7** | type H | l.604 (habitude 8)
- Avant : `"Ma journée en un mot ? Tableur."`
- Après : `"Ma journée en un mot ? Onglets. J'en ai ouvert quarante, j'en ai lu zéro."`
- Exemple plat (relevé par l'audit). Nouvelle formule : relecture à l'aveugle.

### Article 8 : `5-types-humour-lequel-pour-toi` (l.625-715)

Le title, l'excerpt et la meta (Frayssinet, Mirabel, Gardin, choix du 05/10) ne bougent pas. Les corrections portent sur le corps : à qui l'article attribue quel type (presse : Frayssinet absurde et surréaliste, Fary autodérision et observation sociale, §3).

**FT1** | type C | l.634, 636, 637 (liste « en un coup d'oeil »), 3 lignes à remplacer séparément
- Avant 1 : `décrire la réalité avec une précision qui fait rire (Roman Frayssinet)`
- Après 1 : `décrire la réalité avec une précision qui fait rire (Fary)`
- Avant 2 : `créer du non-sens surprenant par escalade (Paul Mirabel)`
- Après 2 : `créer du non-sens surprenant par escalade (Paul Mirabel, Roman Frayssinet)`
- Avant 3 : `exploiter les doubles sens et détournements (Fary)`
- Après 3 : `exploiter les doubles sens et détournements`

**FT2** | type C | l.644 (type 1)
- Avant : `**Roman Frayssinet** est le maître absolu de l'observationnel français. Quand il parle des gens dans le métro qui font semblant de ne pas voir la personne à côté d'eux, tu ris parce que c'est toi. Quand il décrit les messages vocaux de 7 minutes de ta mère, tu ris parce que c'est exactement ça.`
- Après : `**Fary** puise beaucoup dans l'observation sociale : l'identité, la vie courante, ces petits travers que tout le monde reconnaît. Tu ris parce que c'est exactement ça, et que tu ne l'avais jamais formulé comme ça.`
- Les deux exemples (métro, messages vocaux de 7 minutes) étaient INVÉRIFIABLES ; « 7 minutes » est un chiffre.

**FT3** | type C | l.664 (type 3)
- Avant : `**Paul Mirabel** utilise beaucoup l'absurde dans ses escalades. Il part d'une situation normale et la pousse tellement loin que tu atterris dans une dimension parallèle. Le principe, en une vanne : "Mon médecin m'a dit de marcher tous les jours. Je l'ai écouté. Là, je suis en Belgique." L'absurde n'a qu'une règle : suivre sa propre logique jusqu'au bout.`
- Après : `**Paul Mirabel** utilise beaucoup l'absurde dans ses escalades. Il part d'une situation normale et la pousse tellement loin que tu atterris dans une dimension parallèle. **Roman Frayssinet** joue aussi dans ce registre : il part d'un détail minuscule et le fait dériver vers l'absurde. Le principe, en une vanne : "J'ai mis mon réveil en face du lit pour être obligé de me lever. Maintenant je dors par terre, à côté du réveil." L'absurde n'a qu'une règle : suivre sa propre logique jusqu'au bout.`
- Frayssinet rejoint l'absurde (§3). La vanne « médecin / Belgique » (structure répandue, relevée par l'audit) est remplacée par l'étalon « réveil » du catalogue (`vannes-actives-s17.json`, catégorie ABSURDE).

**FT4** | type C | l.674 (type 4)
- Avant : `**Fary** glisse des jeux de mots dans ses punchlines avec une fluidité déconcertante. Le truc, c'est que les bons jeux de mots sont courts et percutants`
- Après : `Un bon jeu de mots se glisse dans une punchline avec une fluidité déconcertante. Le truc, c'est que les bons jeux de mots sont courts et percutants`

**FT5** | type C | l.692 (CLEF)
- Avant : `Paul Mirabel = observationnel + absurde + escalade. Fary = observationnel + jeux de mots + énergie. Ton objectif`
- Après : `Paul Mirabel = observationnel + absurde + escalade. Fary = observationnel + autodérision + énergie. Ton objectif`

**FT6** | type C | l.694
- Avant : `**Fary** combine observationnel + jeux de mots + énergie. **Roman Frayssinet** fait de l'observationnel avec une touche d'absurde.`
- Après : `**Fary** combine observationnel + autodérision + énergie. **Roman Frayssinet** part du quotidien pour le faire dériver vers l'absurde.`

**FT7** | type C | FAQ, réponse de « Peut-on avoir plusieurs types d'humour ? » (l.712)
- Avant : `Fary combine observationnel et jeux de mots. Roman Frayssinet fait de l'observationnel avec une touche d'absurde.`
- Après : `Fary combine observationnel et autodérision. Roman Frayssinet part du quotidien pour le faire dériver vers l'absurde.`
### Article 9 : `humour-noir-utiliser-sans-blesser` (l.717-793) : À REVOIR EN PROFONDEUR, réécriture limitée aux passages fautifs

Passages gardés : définition, 3 règles, FAQ, dosage en conversation (« Je l'ai enterré ce matin… », minute de silence), test des 3 questions. Les H2 et H3 (dont « Sketch 1 : Blanche Gardin sur la thérapie » et « Sketch 2 : Waly Dia sur les clichés racistes ») ne sont pas modifiés : le corps de chaque sketch dit désormais « exemple imaginé, dans la veine de ». Option sur les H3 en §5.

**HN1** | type J | l.732
- Avant : `**Blanche Gardin** est la référence absolue de l'humour noir français réussi. Quand elle parle de ses thérapies ou de la mort, elle ne se moque pas de la souffrance : elle la regarde en face avec une honnêteté tellement crue que le rire est la seule réponse possible.`
- Après : `**Blanche Gardin** reste la référence de l'humour noir français réussi, même si elle a fait polémique en 2024 avec un sketch sur Gaza, puis annoncé en novembre 2025 qu'elle arrêtait le stand-up. Dans ses spectacles, quand elle parle de ses thérapies ou de la mort, elle ne se moque pas de la souffrance : elle la regarde en face avec une honnêteté tellement crue que le rire est la seule réponse possible.`
- Règle 5 : Gardin gardée, deux faits justes, sans lien de cause affirmé ni jugement. Sources : §3. « Absolue » retiré (le superlatif ne tient plus face aux faits).

**HN2** | type A | l.749 (règle 2)
- Avant : `**Fary** a expliqué en interview qu'il adapte constamment son niveau d'humour noir selon la salle. Même spectacle, même texte, mais le dosage change.`
- Après : `Imagine **Fary** devant deux salles différentes : même spectacle, même texte, mais le dosage d'humour noir change avec le public.`
- Propos rapporté introuvable. La phrase suivante (« C'est du [timing](/blog/timing-humour) social appliqué à l'humour noir. ») est inchangée.

**HN3** | type A | l.755 (règle 3)
- Avant : `**Paul Mirabel** utilise parfois l'humour noir dans ses escalades : il part d'un sujet léger, monte progressivement vers le sombre, et la chute est tellement inattendue que tu ris de surprise. La construction est millimétrée.`
- Après : `Prends l'escalade, ce mécanisme qu'on associe à **Paul Mirabel** : tu pars d'un sujet léger, tu montes progressivement vers le sombre, et la chute est tellement inattendue qu'on rit de surprise. La construction doit être millimétrée.`
- Le registre de Mirabel (timide, lunaire) n'est pas l'humour noir : on garde l'escalade, qui lui est associée sur tout le site, comme mécanisme.

**HN4** | type A | l.760 (sketch 1, corps sous le H3)
- Avant : `Elle parle de ses années de thérapie avec une franchise terrifiante. "Mon psy m'a dit que j'avais fait des progrès. J'ai répondu que lui aussi devrait en faire : ça fait 8 ans qu'il me supporte." La cible : elle-même et le système thérapeutique ; personne n'est blessé, et tout le monde rit.`
- Après : `Exemple imaginé, dans la veine de Blanche Gardin, qui parle de ses thérapies avec une franchise terrifiante : "Mon psy m'a dit que j'avais fait des progrès. J'ai répondu que lui aussi devrait en faire : ça fait des années qu'il me supporte." La cible : soi-même et le système thérapeutique ; personne n'est blessé, et tout le monde rit.`
- Réplique introuvable, « 8 ans » (chiffre) retiré. Thérapies et dépression de Gardin : vérifiées par l'audit (Paris Match).

**HN5** | type C | l.763 (sketch 2, corps sous le H3)
- Avant : `Il reprend les clichés racistes qu'on lui sort et les pousse à l'absurde : "On m'a dit 'retourne dans ton pays'. J'ai répondu 'je suis de Créteil, tu veux que je retourne à Créteil ?'" La cible : le racisme et son absurdité. La victime reprend le pouvoir par le rire.`
- Après : `Exemple imaginé, dans la veine de Waly Dia, qui fait de l'humour politique sur le racisme qu'il vit : on reprend le cliché qu'on nous sort et on le pousse à l'absurde. "On m'a dit 'retourne dans ton pays'. J'ai répondu 'je suis né à deux rues d'ici, tu veux que je retourne à la maternité ?'" La cible : le racisme et son absurdité. La victime reprend le pouvoir par le rire.`
- Fait faux corrigé : Waly Dia est né et a grandi à Grenoble, pas à Créteil (§3). La réplique, introuvable, devient un exemple imaginé sans ville.

**HN6** | type I (promesse) | l.783
- Avant : `nos [parcours](/parcours) t'apprennent à le doser, et nos [vannes](/vannes) classées par style te donnent des exemples de second degré réussi.`
- Après : `nos [parcours](/parcours) t'entraînent à sentir le bon moment pour sortir une vanne, et nos [vannes](/vannes) rangées par thème te donnent du matériel pour t'exercer.`
- Zéro fausse promesse : aucun parcours n'a d'étape sur l'humour noir, et les vannes sont rangées par thème, pas par style (audit). L'étape « Sentir le bon moment » du parcours Machine à Café existe (`parcours-seed.json` l.107). La phrase suivante sur les vidéos (« décortiquent les meilleurs moments de second degré des pros ») est gardée, à confirmer par @fullstack (§5).

### Article 10 : `exercices-developper-humour` (l.872-995)

**EX1** | type A | l.889 (exercice 1)
- Avant : `**Roman Frayssinet** a dit que 80% de son matériel vient de ce qu'il observe dans la vie quotidienne. Son téléphone est rempli de notes. Deviens un collecteur d'absurdités.`
- Après : `Les humoristes tirent une bonne part de leur matériel de ce qu'ils observent dans la vie quotidienne, et leur téléphone est rempli de notes (imagine celui d'un **Roman Frayssinet**). Deviens un collecteur d'absurdités.`
- Propos et « 80% » introuvables (et cela décrit mal son style) : chiffre retiré, humoriste gardé en exemple imaginé.

**EX2** | type I (mécanique) | l.900 (exercice 2, coquille : point final manquant)
- Avant : `Ils ont fui au 47e"`
- Après : `Ils ont fui au 47e."`

**EX3** | type H | l.910 (exercice 3)
- Avant : `"Il fait chaud" → "Il fait tellement chaud que même mon déodorant transpire."`
- Après : `"Il fait chaud" → "Il fait tellement chaud que mon ombre cherche de l'ombre."`
- Classique (« déodorant ») remplacé par une formule neuve : relecture à l'aveugle.

**EX4** | type A | l.936 (exercice 5)
- Avant : `**Panayotis Pascot** a raconté qu'il notait tout : les vannes ratées, les répliques qu'il aurait voulu sortir. C'est l'analyse qui fait la progression.`
- Après : `Imagine **Panayotis Pascot** qui note tout : les vannes ratées, les répliques qu'il aurait voulu sortir. C'est l'analyse qui fait la progression.`

**EX5** | type A | l.946 (exercice 6)
- Avant : `**Fary** utilise des compliments absurdes en interview pour créer de la complicité. C'est sans risque`
- Après : `Dans la veine de **Fary**, le compliment absurde sert à créer de la complicité. C'est sans risque`

**EX6** | type I | FAQ, réponse de « Peut-on s'entraîner seul à être drôle ? » (l.993)
- Avant : `Seuls le ping-pong verbal et le one-man-show de 2 minutes nécessitent un partenaire.`
- Après : `Seuls le ping-pong verbal, le compliment absurde et le one-man-show de 2 minutes nécessitent un partenaire.`
- Le compte est juste : 7 exercices solo (1, 2, 3, 5, 7, 8, 9) et 3 avec quelqu'un (4, 6, 10). L'exercice 6 (compliment au collègue, au serveur) était oublié.
### Article 11 : `phrases-droles-conversations` (l.1175-1376) : À REVOIR EN PROFONDEUR, réécriture limitée aux passages fautifs

Passages gardés : les 28 autres phrases, les contextes, les liens. La longueur d'une bonne phrase s'aligne sur la règle du corps de l'article (« moins de 25 mots », vraie : la plus longue des 33 phrases en compte 21, la n°21 corrigée 23) : seule la FAQ change (PD10). Les phrases n°7, 9, 13, 18, 21 passent en relecture à l'aveugle.

**PD1** | type A | l.1181 (intro)
- Avant : `Comme le dit Paul Mirabel : l'humour, c'est 10% de talent et 90% de préparation que personne ne voit.`
- Après : `Regarde Paul Mirabel : derrière son naturel de scène, il y a de la préparation que personne ne voit.`
- Citation et chiffres « 10% / 90% » introuvables ; Mirabel gardé en exemple.

**PD2** | type A | l.1217 (soirées)
- Avant : `Roman Frayssinet l'a bien compris : ses meilleures punchlines tiennent en une phrase.`
- Après : `Sur scène, un Roman Frayssinet peut se permettre des digressions, devant un public venu l'écouter. En soirée, tu n'as pas ce luxe : une phrase, qui doit tomber juste.`
- L'ancien fait était contredit par son style (§3 : digressions, anecdotes).

**PD3** | type H | l.1219-1220, phrase n°7 (l'explication ne collait pas à la phrase)
- Avant :
```
**7. "J'ai failli pas venir. La dernière fois, c'était dans l'ascenseur."**
```
- Après :
```
**7. "J'ai failli pas venir. La dernière fois, j'ai fait demi-tour dans l'ascenseur."**
```
- La ligne de contexte qui suit (« Brise-glace parfait pour les timides : tu avoues ton trac, et tout le monde se détend. ») est inchangée et colle maintenant.

**PD4** | type H | l.1225-1226, phrase n°9 (formule répandue)
- Avant :
```
**9. "Je suis très spontané. Il me faut juste 48h de préavis."**
→ *Quand on parle de dating en groupe.* Le contraste entre l'image et la réalité crée le rire.
```
- Après :
```
**9. "Je suis quelqu'un de très spontané. J'ai prévu de l'être jeudi."**
→ *Quand on te propose un plan à la dernière minute.* Le contraste entre l'image et la réalité crée le rire.
```

**PD5** | type H | l.1237-1238, phrase n°13 (formule répandue). Remplacée par une vanne du catalogue déjà relue à l'aveugle (s14), `vannes-actives-s17.json`.
- Avant :
```
**13. "Je mange équilibré : un dessert dans chaque main."**
→ *Quand on parle de bouffe ou de régime.* La fausse logique fait le boulot.
```
- Après :
```
**13. "J'ai téléchargé une appli pour compter les calories. J'ai rentré ma journée. Elle m'a demandé si tout allait bien."**
→ *Quand on parle de bouffe ou de régime.* C'est l'appli qui s'inquiète à ta place, et ça fait le boulot.
```

**PD6** | type H | l.1260-1261, phrase n°18 (formule répandue)
- Avant :
```
**18. "Je cuisine très bien. Mon livreur peut en témoigner."**
```
- Après :
```
**18. "Je cuisine très bien. Mon four est comme neuf."**
```
- Le contexte qui suit (« Le retournement rapide est la clé, pas de pause entre les deux phrases. ») est inchangé.

**PD7** | type H | l.1277-1278, phrase n°21 (plate). Remplacée par la vanne du catalogue « grand-mère », raccourcie de « dans ma vie » (23 mots, sous la limite de 25) : à relire à l'aveugle comme texte modifié.
- Avant :
```
**21. "Tout le monde me dit de me remettre en selle. J'ai même pas de vélo."**
→ *Quand quelqu'un te pousse à sortir.* Fonctionne aussi en réponse aux "alors, tu as rencontré quelqu'un ?".
```
- Après :
```
**21. "Ma grand-mère m'a demandé si j'avais quelqu'un. J'ai dit non. Elle a dit qu'elle allait en parler à quelqu'un de plus haut placé."**
→ *En réponse aux "alors, tu as rencontré quelqu'un ?" ou quand on te pousse à sortir.* Le sérieux de la grand-mère qui prend le dossier en main fait le travail.
```

**PD8** | type A | l.1289 (WhatsApp et SMS)
- Avant : `Waly Dia l'a théorisé : à l'écrit, "le rythme c'est la ponctuation et le retour à la ligne." Pas de ton de voix pour t'aider`
- Après : `Imagine Waly Dia privé de sa voix : à l'écrit, le rythme, c'est la ponctuation et le retour à la ligne. Pas de ton de voix pour t'aider`
- Citation introuvable ; Waly Dia gardé (construction « chirurgicale », §3).

**PD9** | type A | l.1352 (« Mémorise 5, pas 30 »)
- Avant : `Dernier conseil de Fary : "T'as pas besoin de 200 vannes. T'as besoin de 5 que tu maîtrises les yeux fermés."`
- Après : `Dernier conseil, dans la veine de Fary : pas besoin de 200 vannes, il t'en faut 5 que tu maîtrises les yeux fermés.`
- Plus de guillemets d'attribution ; les chiffres deviennent ceux du conseil du site (le H2 dit déjà « Mémorise 5, pas 30 »).

**PD10** | type I | FAQ, réponse de « Quelles sont les meilleures phrases drôles pour briser la glace ? » (l.1372)
- Avant : `Courtes (moins de 15 mots), universelles`
- Après : `Courtes (moins de 25 mots, comme celles de cet article), universelles`
- Une seule règle de longueur dans l'article (corps : « moins de 25 mots »).

### Article 12 : `meilleures-blagues-droles-2026` (l.1379-1600) : au niveau, une retouche de pause

**MB1** | type E (mécanique) | l.1570 (CLEF)
- Avant : `et marque une pause de 2-3 secondes avant la chute.`
- Après : `et marque une pause d'une seconde environ avant la chute.`

**MB2** | type E (mécanique) | l.1574
- Avant : `Un silence de 3 secondes peut faire rire à lui tout seul.`
- Après : `Une seconde de silence peut faire rire à lui tout seul.`

## 5. Points relevés et NON corrigés

**5.1 À décider (Thomas ou @fullstack)**
- **H3 des sketchs** (`humour-noir-utiliser-sans-blesser`) : « Sketch 1 : Blanche Gardin sur la thérapie » et « Sketch 2 : Waly Dia sur les clichés racistes », ainsi que le H2 « 3 sketches décortiqués », laissent croire à des sketchs réels, même si le corps dit « exemple imaginé ». Option : « Sketch 1 : dans la veine de Blanche Gardin, sur la thérapie » et « Sketch 2 : dans la veine de Waly Dia, sur les clichés racistes ». Non appliqué : les H2/H3 sont intouchables (charte s11) et leurs ancres sont à vérifier. Aucune ancre de ces titres n'est référencée ailleurs dans `src/` (Grep).
- **Accusé de réception, « 2 à 3 secondes »** : `comment-avoir-de-la-repartie` l.155 et FAQ l.230, `glossary.ts` l.79. C'est le temps pour formuler une réponse, pas la pause avant la chute : non touché. À aligner si Thomas veut « une seconde ou deux » partout.
- **« Règle des 3 secondes » ailleurs** (partie 2 ou hors périmètre) : `jamais-quoi-repondre-techniques` l.2262-2340 (sens « réponds avant de réfléchir », à renommer par la partie 2) ; `repondre-moqueries-avec-humour` l.2041 et FAQ l.2075 (« 3 secondes de silence ») ; `ceo-backlinks.ts` l.94 (pitch presse : « 3 secondes APRÈS la punchline », chiffre prêté à Mirabel et Gardin) ; `timing-humour-ralentir` l.997-1074 (redirigé, mêmes « 2-3 secondes » et « 3 à 5 secondes » de Frayssinet) ; `llms-content.ts` l.106 (le nom, cohérent avec le sens retenu). Le JSON `etre-plus-a-l-aise-en-societe` utilise « règle des 3 secondes » pour le regard : **troisième sens**, à renommer par la partie 2 ou @copywriter.
- **Texte d'ancre « Timing humour : plus fort que la blague »** encore présent l.1007 (redirigé), l.2559 et l.3606 (partie 2) : à aligner sur « le secret de la blague » (URL identique).
- **`meilleures-blagues-droles-2026` FAQ l.1596** : « Les meilleures tiennent en 15-20 mots » (blague courte). Cohérent avec « moins de 25 mots » des phrases, non touché (hors retouche demandée).
- **`llms-content.ts` l.56** : même phrase « Université du Nouveau-Mexique » que PI2, à aligner par @fullstack.
- **Exercice 7 (15 min) rangé en « Niveau intermédiaire (10 min/jour) »** : H2 intouchable, et la FAQ dit « 10-15 pour les intermédiaires » : cohérent, non touché.

**5.2 Relevé hors audit, non corrigé (proposition si Thomas veut)**
- `phrases-droles-conversations` FAQ : « Paul Mirabel a fait pareil » (apprendre des morceaux avant d'improviser) et « Paul Mirabel, Roman Frayssinet : ils écrivent, testent et réécrivent leurs vannes des dizaines de fois » (chiffre prêté). Proposition : « les humoristes écrivent, testent et réécrivent leurs vannes beaucoup plus que ça n'en a l'air ».
- `humour-noir…` : « Nos vidéos décortiquent les meilleurs moments de second degré des pros » : à confirmer côté produit (catégories de vidéos), non vérifié dans le code.
- `autoderision-interactions` (au niveau) : « Paul Mirabel utilise exactement cette technique en début de spectacle » (plausible), « Mon chat a plus de vie sociale que moi » (formule répandue) : à traiter à la prochaine relecture, pas en urgence.
- `meilleures-blagues-droles-2026` : vannes n°14, n°2, n°40 connues, déjà prévues dans la refonte 2027 (15 au 20/12).
- Chiffres pédagogiques gardés (règle du 08/10, cohérents) : « mieux que 80 % des gens » (répartie), « les pros ont un taux de réussite de 60-70 % » (pilier), « 50 % du succès d'une blague » (timing et erreurs), « la régularité est 10 fois plus importante » (exercices), « 5 minutes par jour… 2 à 4 semaines ».

**5.3 Méthode et limites**
- Pas de shell dans cette session : l'unicité des « avant » dans `blog-articles.ts` est vérifiée par Grep (voir §6), les pourcentages sont estimés à la main, les nombres de mots (PD7 : 23, longueur max des phrases : 21) sont comptés à la main. À recompter par script avant mise en ligne.
- Les résultats de recherche ont été lus, pas les pages en entier. Faits secondaires (Fary, débuts de Waly Dia à Nantes) : sources de billetterie ou wiki, d'où l'absence d'année dans les textes.
- Le bump de `updatedAt` des 11 articles à l'application est à décider par @fullstack (date réelle de modification).

## 6. Mesure du diff (P0 s11)

Pas de shell : estimation manuelle, à ±30 %, du nombre de mots de l'ancien texte remplacés ou supprimés, rapporté à la taille de l'article (estimée d'après le temps de lecture). À remesurer par script (jetons, comme pour le diff de ce matin) avant mise en ligne.

| Article | Passages | Mots remplacés (≈) | Mots de l'article (≈) | % changé (≈) |
|---|---|---|---|---|
| `comment-devenir-drole` | 6 | 130 | 1 550 | 8 % |
| `comment-avoir-de-la-repartie` | 3 | 50 | 1 750 | 3 % |
| `timing-humour` | 10 | 165 | 1 300 | 13 % |
| `erreurs-blagues` | 3 | 50 | 1 000 | 5 % |
| `repartie-debutant-5-etapes` | 7 | 145 | 1 100 | 13 % |
| `humour-quotidien-8-habitudes` | 7 | 85 | 1 200 | 7 % |
| `5-types-humour-lequel-pour-toi` | 7 | 145 | 1 700 | 9 % |
| `humour-noir-utiliser-sans-blesser` | 6 | 165 | 950 | 17 % |
| `exercices-developper-humour` | 6 | 75 | 1 450 | 5 % |
| `phrases-droles-conversations` | 10 | 135 | 1 650 | 8 % |
| `meilleures-blagues-droles-2026` | 2 | 10 | 3 000 | 0,4 % |
| **Total** | **67** | **≈ 1 155** | **≈ 16 650** | **≈ 7 %** |

Les deux articles « à revoir en profondeur » (humour noir, phrases drôles) restent des corrections de passages, pas des réécritures : 17 % et 8 %. Les 13 % de `timing-humour` et de `repartie-debutant-5-etapes` viennent d'un bloc de règle (TI4) et de 5 propos rapportés remplacés.

**Intouchables** : slugs 0 modifié ; H2 et H3 0 modifié ; questions de FAQ 0 modifiée, **6 réponses de FAQ modifiées** (PI6 TI10 HQ2 FT7 EX6 PD10) ; liens 0 supprimé, 2 textes d'ancre alignés (PI4 ER3), URL identiques ; prix 0 modifié ; chiffres : seuls sont retirés ceux prêtés à une personne réelle (« 30% », « 80% », « 10% / 90% », « 5 secondes », « 3-4 secondes », « 8 ans » de la réplique), le « 90% des gens », les durées de pause remplacées par « une seconde environ », « 7 minutes » (messages vocaux) et « 30 secondes plus tard » (anecdote Mirabel).

**Unicité des « avant »** : vérifiée par Grep sur `blog-articles.ts` pour les 67 passages (chaque fragment distinctif trouvé une seule fois, à la ligne indiquée) ; les « avant » les plus longs (PI1 PI3 TI4 TI6 ER1 DE1 DE3 DE5 DE6 DE7 HQ1 HQ5 FT3 HN1 HN2 HN3 HN4 HN5 HN6 EX1 EX4 EX5 PD1 PD3 PD4 PD5 PD6 PD7 PD8 RE1 RE2) ont été testés en entier, sans écart.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/copy/corrections-audit-code-s20-partie-1.md` (ce fichier), `/home/user/Marrant/docs/copy/relecture-audit-code-s20/passages-partie-1.md` (liste anonymisée seule + consigne). Aucun code touché, aucun commit, historique de `project-context.md` non mis à jour (à consigner par la session, pour éviter un conflit avec la partie 2).
- Décisions : framework = correction éditoriale ciblée (pas de réécriture d'article) ; conscience = Problem-Aware (Yanis arrivé de Google) ; registre inchangé « pote drôle et bienveillant », tutoiement, zéro tiret cadratin ; humoristes tous conservés (P0) ; pause unique « une seconde environ » ; « règle des 3 secondes » = « attends un instant avant la chute » (risque assumé §2, repli « règle de la seconde ») ; Blanche Gardin gardée avec deux faits justes ; 3 vannes de remplacement viennent du catalogue relu en s14 ou de l'étalon « réveil », 5 formules sont neuves.
- Points d'attention : 60 passages à relire à l'aveugle avant mise en ligne (règle d'or P0 s18 : 3 relecteurs, 2 sur 3, garde-fou faute objective), puis @fullstack applique dans `blog-articles.ts` (remplacements exacts, `updatedAt` à décider) et documente dans `REPLIT_ACTIONS.md`. À traiter par la partie 2 ou la session : usages de « règle des 3 secondes » et ancre « plus fort que la blague » listés en §5.1, `llms-content.ts` l.56, `ceo-backlinks.ts` l.94. Toutes les objections de l'audit partie 1 sont soit corrigées ici, soit renvoyées nommément en §5.1 (décisions) ou §5.2 (hors audit).

---

## 7. Liste anonymisée pour la relecture à l'aveugle (60 passages, ordre mélangé)

> Identique au fichier `docs/copy/relecture-audit-code-s20/passages-partie-1.md`, qui est celui à donner aux relecteurs (sans la clé ni les sections 1 à 6). Consigne : voir ce fichier. « Précédente » et « Suivante » : phrase d'avant et phrase d'après dans l'article ; « Passage » : texte à juger.

**A1**
- Précédente : (intertitre) Sketch 2 : Waly Dia sur les clichés racistes (BON humour noir)
- Passage : Exemple imaginé, dans la veine de Waly Dia, qui fait de l'humour politique sur le racisme qu'il vit : on reprend le cliché qu'on nous sort et on le pousse à l'absurde. "On m'a dit 'retourne dans ton pays'. J'ai répondu 'je suis né à deux rues d'ici, tu veux que je retourne à la maternité ?'" La cible : le racisme et son absurdité. La victime reprend le pouvoir par le rire.
- Suivante : (intertitre) Sketch 3 : Quand ça ne marche PAS (MAUVAIS humour noir)

**A2**
- Précédente : - **"C'est noté, je transmets"** (ton neutre) : désamorce avec absurdité.
- Passage : Les humoristes en interview ont leurs phrases filet de sécurité. Imagine **Fary** face à une question gênante : un "c'est une excellente question" lui achète quelques secondes. Ce sont nos [techniques de répartie](/blog/comment-avoir-de-la-repartie) en version concentrée.
- Suivante : **Exercice :** Choisis 3 phrases qui te ressemblent et garde-les sous le coude. Utilise-en au moins une par jour cette semaine.

**A3**
- Précédente : → *Premier apéro avec des potes après une longue absence.* L'autodérision dédramatise le retour.
- Passage : **21. "Ma grand-mère m'a demandé si j'avais quelqu'un. J'ai dit non. Elle a dit qu'elle allait en parler à quelqu'un de plus haut placé."** / → *En réponse aux "alors, tu as rencontré quelqu'un ?" ou quand on te pousse à sortir.* Le sérieux de la grand-mère qui prend le dossier en main fait le travail.
- Suivante : **22. "Je recommence à dîner avec des gens. C'est dur, ils répondent. Mon chat, lui, me laissait finir."**

**A4**
- Précédente : **Blanche Gardin** est redoutable pour ça. Elle sait rester immobile en regardant le public, et la salle rit déjà nerveusement avant qu'elle ait dit un mot. Le silence, c'est la blague.
- Passage : Dans la veine de **Fary**, le timing passe plutôt par le débit : tu accélères dans le setup, puis tu freines d'un coup avant la chute. Ce contraste crée une surprise presque physique : le cerveau de ton public est lancé à pleine vitesse, et le coup de frein le projette dans le rire.
- Suivante : (intertitre) Comment structurer une punchline avec le bon timing ?

**A5**
- Précédente : - Absurde : "En retard ? Non. Je passe en dernier, comme la tête d'affiche."
- Passage : Imagine **Panayotis Pascot** qui note tout : les vannes ratées, les répliques qu'il aurait voulu sortir. C'est l'analyse qui fait la progression.
- Suivante : (intertitre) Exercice 6 : Le compliment absurde

**A6**
- Précédente : C'est l'humour qui décrit la réalité avec une précision chirurgicale. Tu ne dis rien de faux : tu dis juste un truc que tout le monde pense mais que personne ne formule.
- Passage : **Fary** puise beaucoup dans l'observation sociale : l'identité, la vie courante, ces petits travers que tout le monde reconnaît. Tu ris parce que c'est exactement ça, et que tu ne l'avais jamais formulé comme ça.
- Suivante : **Est-ce ton type ?** Tu remarques des trucs que les autres ignorent. Tu dis souvent "nan mais c'est vrai quoi".

**A7**
- Précédente : Chaque jour, prends une situation banale et pousse-la à l'absurde. "Et si les réunions avaient un arbitre qui siffle les hors-sujets ?" "Et si les mails pro étaient honnêtes ? 'Bonjour, je relance parce que je sais que tu as lu.'"
- Passage : Ce muscle créatif, c'est celui que tous les humoristes entraînent. Un "et si" à la **Blanche Gardin**, ça pourrait donner : "Et si on arrêtait de faire semblant d'aimer Noël ?"
- Suivante : (intertitre) Habitude 6 : L'autodérision dosée

**A8**
- Précédente : (intertitre) Pilier 1 : L'observation
- Passage : **Roman Frayssinet** part de détails minuscules, un truc que tout le monde a vécu, et les fait dériver vers l'absurde. Tout commence par un regard qui a vu ce que les autres ignorent : c'est ça, l'observation.
- Suivante : L'observation, c'est le premier muscle à entraîner. Note chaque jour un truc absurde que tu as remarqué.

**A9**
- Précédente : Au lieu de te défendre, tu retournes la remarque vers l'expéditeur. C'est du judo verbal. "Tu manges encore ?" → "Et toi, tu surveilles encore mon assiette ? C'est un métier ou un hobby ?"
- Passage : Imagine **Roman Frayssinet** face à une remarque venue du public : avec ce réflexe, elle repart à l'envoyeur avec un supplément.
- Suivante : (intertitre) Technique 4 : La fausse naïveté

**A10**
- Précédente : En soirée, la règle c'est : **court, fort, mémorable**. Personne n'écoute une histoire de 45 secondes avec de la musique à fond.
- Passage : Sur scène, un Roman Frayssinet peut se permettre des digressions, devant un public venu l'écouter. En soirée, tu n'as pas ce luxe : une phrase, qui doit tomber juste.
- Suivante : **7. "J'ai failli pas venir. La dernière fois, j'ai fait demi-tour dans l'ascenseur."**

**A11**
- Précédente : La bonne approche : commence par des conversations à faible enjeu. Le boulanger. Le collègue à la machine à café. Le serveur. Les gens que tu ne reverras peut-être jamais. Zéro pression, 100% terrain d'entraînement.
- Passage : **Waly Dia** a débuté sur les scènes nantaises avant de monter sur les grandes. Même principe : tu ne fais pas tes gammes devant 10 000 personnes.
- Suivante : **Exercice :** Cette semaine, place une de tes 3 phrases filet dans une conversation à basse pression.

**A12**
- Précédente : (question de FAQ) Comment améliorer son timing comique ?
- Passage : Trois exercices : analyse les silences dans les sketches de Roman Frayssinet ou Blanche Gardin (chronomètre en main), pratique la règle des 3 secondes en conversation (compte « un, deux, trois » dans ta tête avant de lâcher ta remarque), et marque des pauses volontaires avant tes punchlines. Inconfortable au début, redoutable au bout d'une semaine.
- Suivante : (question de FAQ suivante) Pourquoi mes blagues tombent à plat ?

**A13**
- Précédente : > **À retenir :** L'humour noir réussi vise toujours vers le haut (le pouvoir, le système, soi-même) et jamais vers le bas (les personnes vulnérables). Ses 3 règles : la cible c'est toi ou le système, le contexte détermine tout, et la punchline doit justifier la transgression.
- Passage : **Blanche Gardin** reste la référence de l'humour noir français réussi, même si elle a fait polémique en 2024 avec un sketch sur Gaza, puis annoncé en novembre 2025 qu'elle arrêtait le stand-up. Dans ses spectacles, quand elle parle de ses thérapies ou de la mort, elle ne se moque pas de la souffrance : elle la regarde en face avec une honnêteté tellement crue que le rire est la seule réponse possible.
- Suivante : C'est l'un des [5 types d'humour](/blog/5-types-humour-lequel-pour-toi) les plus puissants, mais aussi le plus risqué.

**A14**
- Précédente : La réalité, c'est que la plupart des gens drôles ne sont pas "un type". Ils sont des hybrides. **Paul Mirabel** mélange observationnel + absurde + escalade.
- Passage : **Fary** combine observationnel + autodérision + énergie. **Roman Frayssinet** part du quotidien pour le faire dériver vers l'absurde.
- Suivante : Regarde nos [vidéos](/videos) analysées pour identifier les combinaisons de chaque pro.

**A15**
- Précédente : Le mec qui tient la porte pour quelqu'un à 15 mètres, forçant l'autre à courir. Le mail "urgent" envoyé un vendredi à 18h47. Le "petit point rapide" de 2 heures.
- Passage : Les humoristes tirent une bonne part de leur matériel de ce qu'ils observent dans la vie quotidienne, et leur téléphone est rempli de notes (imagine celui d'un **Roman Frayssinet**). Deviens un collecteur d'absurdités.
- Suivante : **Résultat attendu :** Après 2 semaines, tu remarques des trucs que tu ignorais avant.

**A16**
- Précédente : Chaque soir, repense à ta journée et reformule un moment de façon drôle. Pas besoin de le partager, juste de le penser.
- Passage : "Ma journée en un mot ? Onglets. J'en ai ouvert quarante, j'en ai lu zéro."
- Suivante : Ce rituel entraîne ton cerveau à chercher l'angle drôle automatiquement.

**A17**
- Précédente : → *Quand tu retrouves par hasard quelqu'un que t'as pas vu depuis longtemps.* Tout le monde a déjà fait cette promesse, et tout le monde se reconnaît.
- Passage : **13. "J'ai téléchargé une appli pour compter les calories. J'ai rentré ma journée. Elle m'a demandé si tout allait bien."** / → *Quand on parle de bouffe ou de régime.* C'est l'appli qui s'inquiète à ta place, et ça fait le boulot.
- Suivante : Que tu sois étudiant, jeune actif ou en pleine reconstruction, [nos parcours](/parcours) sont calibrés pour chaque profil.

**A18**
- Précédente : Arrête tout. Expliquer une blague, c'est offrir un cadeau déjà déballé.
- Passage : Imagine **Paul Mirabel** devant une salle qui ne réagit pas tout de suite : au lieu d'expliquer sa vanne, il continue comme si de rien n'était, et le rire finit par arriver. Parce que parfois, le cerveau a besoin de quelques secondes pour faire "clic".
- Suivante : Si personne ne rit, la seule bonne réponse c'est : sourire et passer à la suite.

**A19**
- Précédente : (intertitre) Comment utiliser la règle des 3 secondes ?
- Passage : En conversation, avant de lâcher ta remarque drôle ou ta chute : **attends un instant**, une seconde environ, après la fin de la phrase qui précède. / Pas de pause du tout : trop rapide, on dirait que tu n'écoutais pas et que tu attendais juste ton tour de parler. (On a tous ce pote, et on a tous arrêté de lui raconter des trucs.) / Pas dix secondes : le train est parti et tu es resté sur le quai avec ta vanne. / Pourquoi « 3 secondes » ? Parce que le réflexe se compte en trois temps dans ta tête, « un, deux, trois », sans traîner : ça tient en une seconde environ, assez pour avoir l'air de réfléchir, pas assez pour avoir l'air de dormir. Ta réponse paraît spontanée, et c'est exactement ce que font les bons improvisateurs.
- Suivante : (intertitre) Pourquoi le silence est-il plus puissant que les mots ?

**A20**
- Précédente : Ça paraît contre-intuitif, mais le premier réflexe de quelqu'un qui veut avoir de la répartie, c'est de chercher la réplique parfaite. Et le cerveau se fige : il cherche le bon mot pendant 45 secondes, et quand il le trouve, tout le monde parle d'autre chose.
- Passage : Regarde **Paul Mirabel** : une bonne partie de ses vannes, c'est juste une gêne honnête dite à voix haute. L'humour vient après, naturellement. C'est la même chose en conversation.
- Suivante : Lucas a commencé par ça : au lieu de chercher la vanne, il a commencé à dire ce qu'il pensait vraiment.

**A21**
- Précédente : L'absurde, c'est le décalage total entre ce qu'on attend et ce qui arrive. C'est le non sequitur, le changement de registre brutal, la logique qui déraille.
- Passage : **Paul Mirabel** utilise beaucoup l'absurde dans ses escalades. Il part d'une situation normale et la pousse tellement loin que tu atterris dans une dimension parallèle. **Roman Frayssinet** joue aussi dans ce registre : il part d'un détail minuscule et le fait dériver vers l'absurde. Le principe, en une vanne : "J'ai mis mon réveil en face du lit pour être obligé de me lever. Maintenant je dors par terre, à côté du réveil." L'absurde n'a qu'une règle : suivre sa propre logique jusqu'au bout.
- Suivante : **Est-ce ton type ?** Tes amis te disent souvent "t'es bizarre mais drôle".

**A22**
- Précédente : (question de FAQ) Est-ce que tout le monde peut devenir drôle ?
- Passage : Oui. L'humour repose sur 3 leviers (observation, surprise, timing) que n'importe qui peut développer. Paul Mirabel, Fary, Blanche Gardin ont tous commencé sur de petites scènes, avec leur lot de bides. C'est ça, la progression.
- Suivante : (question de FAQ suivante) Comment devenir drôle quand on est timide ?

**A23**
- Précédente : (intertitre) Sketch 1 : Blanche Gardin sur la thérapie (BON humour noir)
- Passage : Exemple imaginé, dans la veine de Blanche Gardin, qui parle de ses thérapies avec une franchise terrifiante : "Mon psy m'a dit que j'avais fait des progrès. J'ai répondu que lui aussi devrait en faire : ça fait des années qu'il me supporte." La cible : soi-même et le système thérapeutique ; personne n'est blessé, et tout le monde rit.
- Suivante : (intertitre) Sketch 2 : Waly Dia sur les clichés racistes (BON humour noir)

**A24**
- Précédente : (intertitre) Mémorise 5, pas 30
- Passage : Dernier conseil, dans la veine de Fary : pas besoin de 200 vannes, il t'en faut 5 que tu maîtrises les yeux fermés.
- Suivante : Choisis 5 phrases de cet article. Celles qui te ressemblent. Et teste-les cette semaine.

**A25**
- Précédente : (question de FAQ) Combien de temps pour que ça devienne naturel ?
- Passage : Environ 30 jours de pratique quotidienne. Ton cerveau commence à chercher l'angle drôle automatiquement, comme un réflexe qu'on installe. Imagine le téléphone d'un Roman Frayssinet, rempli de notes vocales de moments absurdes : c'est exactement ce processus, juste fait depuis des années.
- Suivante : (fin de la FAQ)

**A26**
- Précédente : Quelqu'un dit "J'ai passé un week-end horrible". La plupart des gens : "Ah mince." Lucas version améliorée : "Horrible genre ennuyeux, ou horrible genre tu as survécu à quelque chose ?" La question ouvre la conversation et montre que tu écoutes.
- Passage : Imagine **Roman Frayssinet** avec un mot lancé par le public : il l'attrape et construit dessus. Ce n'est pas du génie : c'est de l'écoute active avec un twist. Regarde nos [vidéos](/videos) analysées pour repérer cette écoute chez les pros.
- Suivante : **Exercice :** Dans ta prochaine conversation, repère un mot intéressant dans ce que l'autre dit. Rebondis dessus avec une question ou un commentaire.

**A27**
- Précédente : "Ton choix de chaussettes aujourd'hui est une déclaration artistique."
- Passage : Dans la veine de **Fary**, le compliment absurde sert à créer de la complicité. C'est sans risque, toujours positif, et ça fait sourire. Consulte nos [conseils](/conseils) pour plus de techniques de brise-glace.
- Suivante : (intertitre) Exercice 7 : L'analyse de sketch

**A28**
- Précédente : Sur scène, un Roman Frayssinet peut se permettre des digressions, devant un public venu l'écouter. En soirée, tu n'as pas ce luxe : une phrase, qui doit tomber juste.
- Passage : **7. "J'ai failli pas venir. La dernière fois, j'ai fait demi-tour dans l'ascenseur."** / → *En arrivant à une soirée.* Brise-glace parfait pour les timides : tu avoues ton trac, et tout le monde se détend.
- Suivante : **8. "J'ai une mémoire incroyable. Elle me réveille à 3h du mat pour me rappeler un truc que j'ai dit en CM2."**

**A29**
- Précédente : **Roman Frayssinet** est probablement le meilleur exemple de timing en stand-up français actuel.
- Passage : Regarde un de ses sketches au ralenti : écoute ses silences avant certaines chutes. Il regarde le public, laisse la tension monter, et lâche sa punchline pile au moment où le cerveau de tout le monde est en mode "mais il va dire quoi ?".
- Suivante : C'est ce suspense microscopique qui déclenche le rire.

**A30**
- Précédente : Les jeux de mots, c'est l'humour intellectuel par excellence. Homophones, polysémie, détournements : ton cerveau fait un double sens et la surprise déclenche le rire.
- Passage : Un bon jeu de mots se glisse dans une punchline avec une fluidité déconcertante. Le truc, c'est que les bons jeux de mots sont courts et percutants, pas le calembour de tonton qui nécessite 3 minutes d'explication.
- Suivante : **Est-ce ton type ?** Tu joues avec les mots naturellement.

**A31**
- Précédente : **Feu rouge :** Avec des inconnus, en grand groupe, quand quelqu'un vit le sujet en ce moment, au travail avec la hiérarchie.
- Passage : Imagine **Fary** devant deux salles différentes : même spectacle, même texte, mais le dosage d'humour noir change avec le public. C'est du [timing](/blog/timing-humour) social appliqué à l'humour noir.
- Suivante : (intertitre) Règle 3 : La punchline justifie la transgression

**A32**
- Précédente : La plus simple, et la plus sous-estimée. Quelqu'un te balance une remarque ? Au lieu de paniquer, tu poses un "Intéressant", "Pas faux" ou "Bien vu". Ça te donne **2 à 3 secondes** pour formuler ta vraie réponse. C'est le "chargement en cours" de la répartie.
- Passage : Regarde **Fary** en interview et observe comment il gagne du temps quand on lui pose une question piège. Fais pareil : accuse réception, souris, prends ton temps. Ta réponse sera presque toujours meilleure que si tu avais répondu en panique.
- Suivante : (intertitre) Technique 2 : Le rebond sur mot-clé

**A33**
- Précédente : (question de FAQ) Quelles sont les meilleures phrases drôles pour briser la glace ?
- Passage : Courtes (moins de 25 mots, comme celles de cet article), universelles (situation que tout le monde reconnaît), et avec un twist qu'on ne voit pas venir. L'autodérision bien dosée fonctionne dans la grande majorité des contextes sociaux, et elle te rend sympathique immédiatement.
- Suivante : (question de FAQ suivante) Comment avoir de la répartie avec des phrases toutes faites ?

**A34**
- Précédente : **Mythe cassé : "L'humour, ça divise."**
- Passage : Le compliment absurde est l'une des formes d'humour les plus faciles à faire passer.
- Suivante : "Tu as réparé l'imprimante. Je pense qu'il faut qu'on parle de ton avenir dans cette boîte." "Ton Excel est tellement propre que j'ose pas scroller."

**A35**
- Précédente : Quand tu vois **Paul Mirabel** remplir Bercy avec un naturel déconcertant, tu te dis "OK, ce mec est né avec un don."
- Passage : Sauf que Paul a joué dans des cafés-concerts parisiens, à tester des vannes devant de tout petits publics. **Fary** est passé par le Jamel Comedy Club puis par le Point-Virgule avant de remplir les grandes salles. **Blanche Gardin** a mis près de dix ans entre ses débuts au Jamel Comedy Club (2006) et son premier seul-en-scène (2015).
- Suivante : Derrière chaque "naturel", il y a des centaines de bides que personne n'a filmés.

**A36**
- Précédente : 3. Qu'est-ce que j'aurais fait différemment ?
- Passage : C'est exactement ce que font les pros. Imagine **Panayotis Pascot** après un soir où une vanne n'a pas pris : il se demande pourquoi, puis il la réécrit. L'analyse, c'est ce qui transforme l'expérience en compétence.
- Suivante : **Exercice :** Ce soir, repense à une conversation et écris 3 réponses alternatives à un moment où tu es resté silencieux.

**A37**
- Précédente : (question de FAQ) Peut-on avoir plusieurs types d'humour ?
- Passage : Oui, et les meilleurs humoristes sont tous des hybrides. Paul Mirabel mélange observationnel et absurde. Fary combine observationnel et autodérision. Roman Frayssinet part du quotidien pour le faire dériver vers l'absurde. Trouve ton type dominant, puis enrichis-le avec un second.
- Suivante : (question de FAQ suivante) Quel type d'humour est le plus facile à apprendre ?

**A38**
- Précédente : **Le principe :** Prends un fait réel et pousse-le à l'extrême.
- Passage : "Il fait chaud" → "Il fait tellement chaud que mon ombre cherche de l'ombre."
- Suivante : "J'ai faim" → "J'ai tellement faim que j'ai commencé à négocier avec une plante."

**A39**
- Précédente : Les gens drôles ne sont pas tous des génies de l'improvisation. La plupart ont juste **un stock de phrases rodées**, qu'ils ressortent au bon moment.
- Passage : Regarde Paul Mirabel : derrière son naturel de scène, il y a de la préparation que personne ne voit.
- Suivante : Cet article, c'est ta réserve : plus de 30 phrases drôles, classées par situation, avec le contexte exact et le timing pour les placer.

**A40**
- Précédente : Si les 3 réponses sont positives, lance-toi. Sinon, garde-la pour le bon moment.
- Passage : L'humour noir est un outil puissant : nos [parcours](/parcours) t'entraînent à sentir le bon moment pour sortir une vanne, et nos [vannes](/vannes) rangées par thème te donnent du matériel pour t'exercer.
- Suivante : Nos [vidéos](/videos) décortiquent les meilleurs moments de second degré des pros. **2,99 €/mois** : c'est pas cher payé pour éviter les silences de mort.

**A41**
- Précédente : Est-ce que les gens sont détendus ou tendus ? Est-ce qu'on rigole déjà, ou est-ce qu'on parle du pot de départ de quelqu'un qui ne voulait pas partir ?
- Passage : Placer une blague au mauvais moment, même une bonne, c'est du ketchup sur un soufflé : personne ne t'arrête, mais le soufflé ne s'en remet pas.
- Suivante : Les bons moments pour l'humour en groupe :

**A42**
- Précédente : **Paul Mirabel** est le roi de la reformulation.
- Passage : Il prend une situation banale et la décrit avec des mots tellement inattendus que tu ris de ta propre vie.
- Suivante : C'est l'art de voir le quotidien autrement, et ça s'apprend avec nos [conseils](/conseils) d'observation.

**A43**
- Précédente : **Les 5 types d'humour en un coup d'oeil :**
- Passage : 1. **L'observationnel** : décrire la réalité avec une précision qui fait rire (Fary) / 2. **L'autodérision** : rire de soi avec bienveillance et confiance (Panayotis Pascot, Blanche Gardin) / 3. **L'absurde** : créer du non-sens surprenant par escalade (Paul Mirabel, Roman Frayssinet) / 4. **Les jeux de mots** : exploiter les doubles sens et détournements / 5. **L'humour noir** : aborder les tabous avec finesse et calibrage (Blanche Gardin, Waly Dia)
- Suivante : (intertitre) Type 1 : L'observationnel

**A44**
- Précédente : (intertitre) Étape 3 : L'écoute active
- Passage : La plupart des gens en conversation n'écoutent pas vraiment : ils attendent leur tour de parler.
- Suivante : Du coup, ils ratent toutes les ouvertures.

**A45**
- Précédente : → *Quand le date se passe bien.* Projette un futur tout en étant absurde.
- Passage : **18. "Je cuisine très bien. Mon four est comme neuf."** / → *Quand on parle de bouffe.* Le retournement rapide est la clé, pas de pause entre les deux phrases.
- Suivante : **19. "J'ai toujours un plan B. C'est le même canapé, mais de l'autre côté."**

**A46**
- Précédente : **Blanche Gardin** est redoutable pour ça.
- Passage : Elle sait rester immobile en regardant le public, et la salle rit déjà nerveusement avant qu'elle ait dit un mot.
- Suivante : Le silence, c'est la blague.

**A47**
- Précédente : La punchline doit être tellement surprenante ou vraie qu'elle fait oublier l'inconfort du setup.
- Passage : Prends l'escalade, ce mécanisme qu'on associe à **Paul Mirabel** : tu pars d'un sujet léger, tu montes progressivement vers le sombre, et la chute est tellement inattendue qu'on rit de surprise. La construction doit être millimétrée.
- Suivante : (intertitre) 3 sketches décortiqués

**A48**
- Précédente : (intertitre) Que dit la science sur l'apprentissage de l'humour ?
- Passage : L'humour repose sur des **mécanismes cognitifs précis** : détection d'incongruité, résolution de tension, calibrage social.
- Suivante : Ton cerveau sait déjà faire tout ça : il le fait chaque fois que tu comprends une blague.

**A49**
- Précédente : Parfois, la meilleure répartie, c'est pas de réponse : un sourire, un regard amusé, et du silence.
- Passage : **Blanche Gardin** sait tenir un silence face au public, et la salle rit avant même qu'elle ait dit un mot.
- Suivante : Le silence dit : "Ta remarque ne mérite même pas que je dépense des mots."

**A50**
- Précédente : > **CLEF :** Les meilleurs humoristes ne se limitent pas à un seul type, ils combinent 2-3 styles pour créer leur signature.
- Passage : Paul Mirabel = observationnel + absurde + escalade. Fary = observationnel + autodérision + énergie.
- Suivante : Ton objectif : identifier ton type dominant, puis l'enrichir avec un second type complémentaire.

**A51**
- Précédente : Quelqu'un a dit "je déteste les lundis" il y a 20 minutes ? Quand un problème arrive plus tard : "Voilà. Lundi."
- Passage : C'est une technique de stand-up que **Waly Dia** manie très bien, et elle marche aussi bien au bureau qu'en soirée.
- Suivante : Le callback montre que tu écoutes et que tu fais des connexions.

**A52**
- Précédente : → *Quand quelqu'un dit "t'as une bonne mémoire".* Le détail précis ("en CM2") fait tout le travail.
- Passage : **9. "Je suis quelqu'un de très spontané. J'ai prévu de l'être jeudi."** / → *Quand on te propose un plan à la dernière minute.* Le contraste entre l'image et la réalité crée le rire.
- Suivante : **10. "Je suis bilingue : français et 'vas-y, on verra bien'."**

**A53**
- Précédente : (question de FAQ) Peut-on s'entraîner seul à être drôle ?
- Passage : Oui, pour 7 exercices sur 10 : radar, reformulation, exagération, journal de répartie, analyse de sketch, écriture de bit, et callback en conversation. Seuls le ping-pong verbal, le compliment absurde et le one-man-show de 2 minutes nécessitent un partenaire.
- Suivante : (fin de la FAQ)

**A54**
- Précédente : > **À retenir :** Le timing en humour, c'est l'art du silence et du rythme.
- Passage : Une pause d'une seconde environ avant la punchline crée la tension nécessaire au rire. En conversation, attendre un instant avant de lâcher ta chute donne l'impression de spontanéité et améliore la qualité de chaque intervention.
- Suivante : (intertitre) Comment utiliser la règle des 3 secondes ?

**A55**
- Précédente : - **"Intéressant"** (dit avec un demi-sourire) : l'accusé de réception ultime.
- Passage : Te laisse un instant pour réfléchir.
- Suivante : - **"Tu me connais tellement bien"** (ironique) : retourne n'importe quelle remarque.

**A56**
- Précédente : Regarde les gens dans les yeux et assume. Même si la blague est moyenne, la conviction dans la livraison peut la sauver. À l'inverse, la meilleure vanne du monde livrée sans énergie tombera à plat.
- Passage : **Panayotis Pascot** peut raconter un truc banal et c'est hilarant, parce qu'il est dedans : il revit la scène, ses yeux brillent, son corps accompagne l'histoire.
- Suivante : L'engagement total transforme le banal en comique.

**A57**
- Précédente : (intertitre) Phrases drôles par WhatsApp et SMS
- Passage : Le format texte a ses propres règles. Imagine Waly Dia privé de sa voix : à l'écrit, le rythme, c'est la ponctuation et le retour à la ligne. Pas de ton de voix pour t'aider, donc la construction doit être chirurgicale.
- Suivante : **23. "Désolé, ça fait 3 jours que je rédige la réponse parfaite. La voici : 'coucou'."**

**A58**
- Précédente : **Mythe cassé : "Les gens drôles improvisent tout."**
- Passage : En réalité, les humoristes notent tout : leurs observations dans le métro, les phrases bizarres entendues au supermarché, les situations absurdes du quotidien. Imagine le téléphone d'un **Roman Frayssinet** : un cimetière de notes vocales, d'où sortent les meilleurs sketches.
- Suivante : L'habitude : chaque jour, note une chose absurde que tu as observée.

**A59**
- Précédente : Tu ne deviendras pas drôle en lisant des articles. (Oui, celui-ci compris. On assume.) Tu deviendras drôle en essayant de faire rire, en te plantant, en comprenant pourquoi, et en recommençant.
- Passage : **Waly Dia** a débuté sur les scènes nantaises. Aujourd'hui, il remplit des salles, et entre les deux il y a un paquet de vannes testées, affinées, recalibrées.
- Suivante : (intertitre) Comment devenir drôle en 30 jours ? Le plan d'action

**A60**
- Précédente : **Exercice 1 : L'analyse au ralenti.** Regarde un sketch de Roman Frayssinet, Blanche Gardin ou Fary avec un chronomètre. Mesure les silences avant les punchlines. Note les changements de rythme. Tu vas voir des patterns.
- Passage : **Exercice 2 : Les 3 secondes.** En conversation, force-toi à compter mentalement "1... 2... 3...", sans traîner, avant de lâcher ta remarque. Au début, tu vas avoir l'air de buguer. Ensuite, tu auras l'air de réfléchir.
- Suivante : **Exercice 3 : Le silence volontaire.** Quand tu racontes une histoire, marque une pause avant la chute : regarde ton interlocuteur, laisse le silence s'installer, puis lâche la punchline.

---

## 8. Clé de la liste anonymisée (NE PAS OUVRIR AVANT LES VERDICTS)

> Pour la relecture, ne donner aux relecteurs que `docs/copy/relecture-audit-code-s20/passages-partie-1.md`, sans cette clé ni les sections 1 à 6. 7 corrections mécaniques ne sont pas dans la liste (TI1 TI7 MB1 MB2 EX2 PI4 ER3) : pause « une seconde environ » et texte d'ancre, appliqués tels quels.

| Lettre | Code | Lettre | Code | Lettre | Code | Lettre | Code |
|---|---|---|---|---|---|---|---|
| A1 | HN5 | A16 | HQ7 | A31 | HN2 | A46 | TI5 |
| A2 | DE3 | A17 | PD5 | A32 | RE1 | A47 | HN3 |
| A3 | PD7 | A18 | ER1 | A33 | PD10 | A48 | PI2 |
| A4 | TI6 | A19 | TI4 | A34 | HQ4 | A49 | RE3 |
| A5 | EX4 | A20 | DE1 | A35 | PI1 | A50 | FT5 |
| A6 | FT2 | A21 | FT3 | A36 | DE7 | A51 | HQ6 |
| A7 | HQ5 | A22 | PI6 | A37 | FT7 | A52 | PD4 |
| A8 | PI3 | A23 | HN4 | A38 | EX3 | A53 | EX6 |
| A9 | RE2 | A24 | PD9 | A39 | PD1 | A54 | TI3 |
| A10 | PD2 | A25 | HQ2 | A40 | HN6 | A55 | DE2 |
| A11 | DE6 | A26 | DE5 | A41 | TI8 | A56 | ER2 |
| A12 | TI10 | A27 | EX5 | A42 | HQ3 | A57 | PD8 |
| A13 | HN1 | A28 | PD3 | A43 | FT1 | A58 | HQ1 |
| A14 | FT6 | A29 | TI2 | A44 | DE4 | A59 | PI5 |
| A15 | EX1 | A30 | FT4 | A45 | PD6 | A60 | TI9 |

---

## 9. Tour 2 : réécritures après relecture croisée (53 passages sur 60 validés, ne plus y toucher)

> Verdicts : `docs/copy/relecture-audit-code-s20/verdicts-relecteur-1/2/3.md`. À réécrire (2 avis sur 3 ou faute objective) : A7 (HQ5), A23 (HN4), A25 (HQ2), A32 (RE1), A35 (PI1), A45 (PD6), A53 (EX6). Les « après » ci-dessous REMPLACENT ceux de la section 4 pour ces sept codes ; les « avant » sont le texte actuel de `blog-articles.ts` (rien n'est appliqué). Ajouts demandés (règle n°1) : intertitres de l'article humour noir (H1) et « mot 8 » (H2). Les passages à relire sont dans `docs/copy/relecture-audit-code-s20/passages-partie-1-tour2.md` (AA1 à AA10, sans clé ; clé tout en bas). Tous les « après » sont sans tiret cadratin et évitent la tournure « Dans la veine de X : » suivie d'un principe sans verbe (A4, A24, A27, validés au tour 1, ne sont pas touchés).
> A13 (Gardin, faits 2024 et 2025) a été jugé sous la barre par les 3 relecteurs, mais la règle 5 de Thomas (12/10) impose ces deux faits justes : gardé tel quel, [CHOIX UTILISATEUR] non re-questionnable.

**HQ5 révisé (A7)** | article `humour-quotidien-8-habitudes`, l.582 | défaut : « Et si on arrêtait de faire semblant d'aimer Noël ? » est un avis, pas un « et si » absurde comme les deux exemples d'avant (exemple qui contredit sa règle)
- Avant : `**Blanche Gardin** part souvent d'un "et si" pour construire ses sketches : "Et si on arrêtait de faire semblant d'aimer Noël ?"`
- Après : `Un "et si" à la **Blanche Gardin**, ça pourrait donner : "Et si Noël avait un service client ? 'Bonjour, je voudrais retourner l'oncle Gérard.'"`
- Exemple imaginé assumé, absurde, sans citation prêtée. La phrase qui précède (« Ce muscle créatif, c'est celui que tous les humoristes entraînent. ») est gardée.

**HN4 révisé (A23)** | article `humour-noir-utiliser-sans-blesser`, l.760 | défaut : la chute ne tenait pas (qui devrait « faire des progrès », et pourquoi ?) et n'était pas noire
- Avant : `Elle parle de ses années de thérapie avec une franchise terrifiante. "Mon psy m'a dit que j'avais fait des progrès. J'ai répondu que lui aussi devrait en faire : ça fait 8 ans qu'il me supporte." La cible : elle-même et le système thérapeutique ; personne n'est blessé, et tout le monde rit.`
- Après : `Imagine une séance de thérapie racontée avec cette franchise terrifiante : "Mon psy m'a dit que j'avais fait d'énormes progrès. Il veut qu'on se voie plus souvent pour les consolider." La cible : soi-même et le système thérapeutique ; personne n'est blessé, et tout le monde rit.`
- La chute vise bien le système (le psy qui rallonge le suivi) et soi-même (le « progrès » qui sert de prétexte). Aucun chiffre. L'attribution passe dans l'intertitre (H-A ci-dessous).

**HQ2 révisé (A25)** | article `humour-quotidien-8-habitudes`, FAQ « Combien de temps pour que ça devienne naturel ? » (l.621) | défaut : « environ 30 jours » posé comme un fait sur la formation d'un réflexe ; « exactement ce processus » s'appuie sur une scène imaginée ; l'image du téléphone de Frayssinet est déjà dans le corps (A58)
- Avant : `Environ 30 jours de pratique quotidienne. Ton cerveau commence à chercher l'angle drôle automatiquement, comme un réflexe qu'on installe. Roman Frayssinet a son téléphone rempli de notes vocales de moments absurdes : c'est exactement ce processus, juste fait depuis des années.`
- Après : `Compte une trentaine de jours de pratique quotidienne, un peu plus ou un peu moins selon les gens : ton cerveau finit par chercher l'angle drôle tout seul, comme un réflexe qu'on installe. Imagine un Roman Frayssinet qui note ses moments absurdes depuis des années : c'est le même réflexe, simplement entretenu plus longtemps.`
- Le « 30 jours » reste le repère du site (corps de l'article : « au bout de 30 jours », plan de démarrage), présenté comme un ordre de grandeur. La question de la FAQ est intacte.

**RE1 révisé (A32)** | article `comment-avoir-de-la-repartie`, l.157 | défaut : « observe comment il gagne du temps » affirmait un comportement de Fary non établi
- Avant : `Regarde **Fary** en interview. Quand un journaliste lui pose une question piège, il ne se précipite jamais. Il accuse réception, sourit, prend son temps. Et sa réponse est toujours meilleure que s'il avait répondu en panique.`
- Après : `Regarde **Fary** en interview face à une question piège, et note ce qu'il fait des deux premières secondes. Toi, tu peux faire simple : accuse réception, souris, prends ton temps. Ta réponse sera presque toujours meilleure que si tu avais répondu en panique.`
- Consigne d'observation sans résultat affirmé ; la technique est donnée comme conseil au lecteur, pas comme habitude de Fary. « Imagine Fary » est évité ici (déjà utilisé pour Roman Frayssinet dans la technique 3 du même article).

**PI1 révisé (A35)** | article `comment-devenir-drole`, l.31 | défaut : dates précises de Blanche Gardin (2006, 2015) et « près de dix ans » contestés par un relecteur ; le premier spectacle est discuté
- Avant : `Sauf que Paul a commencé dans des salles de 20 personnes à Paris, à tester des vannes qui tombaient à plat une fois sur deux. **Fary** a fait des centaines d'open mics avant de trouver son style. **Blanche Gardin** a mis plus de 10 ans à passer de l'écriture pour les autres à son propre spectacle.`
- Après : `Sauf que Paul a joué dans des cafés-concerts parisiens, à tester des vannes devant de tout petits publics. **Fary** est passé par le Jamel Comedy Club puis par le Point-Virgule avant de remplir les grandes salles. **Blanche Gardin** a longtemps enchaîné les petites scènes, Jamel Comedy Club compris, avant de s'imposer avec ses propres spectacles.`
- Plus aucune date ni durée pour Gardin ; le fait gardé (Jamel Comedy Club, petites scènes d'abord) est celui des sources du §3. Mirabel et Fary inchangés par rapport au tour 1 (validés).

**PD6 révisé (A45)** | article `phrases-droles-conversations`, l.1261 (ligne de contexte de la phrase n°18 ; la phrase n°18 « Je cuisine très bien. Mon four est comme neuf. » reste celle du tour 1) | défaut : « pas de pause entre les deux phrases » contredisait la pause d'une seconde du site
- Avant : `Le retournement rapide est la clé, pas de pause entre les deux phrases.`
- Après : `Le retournement est la clé : une petite seconde de pause avant la chute, juste le temps que l'autre y croie.`
- Le cas « pas de pause » est supprimé au lieu d'être expliqué : une seule doctrine sur le site.

**EX6 révisé (A53)** | article `exercices-developper-humour`, FAQ « Peut-on s'entraîner seul à être drôle ? » (l.993) | défaut : le callback en conversation était rangé parmi les exercices solo
- Avant : `Oui, pour 7 exercices sur 10 : radar, reformulation, exagération, journal de répartie, analyse de sketch, écriture de bit, et callback en conversation. Seuls le ping-pong verbal et le one-man-show de 2 minutes nécessitent un partenaire.`
- Après : `Oui, pour 6 exercices sur 10 : radar, reformulation, exagération, journal de répartie, analyse de sketch et écriture de bit. Il te faut quelqu'un pour le ping-pong verbal, le compliment absurde, le callback en conversation et le one-man-show de 2 minutes.`
- Le compte est vérifié sur l'article : exercices 1, 2, 3, 5, 7, 8 en solo ; 4, 6, 9, 10 avec quelqu'un. « 7 sur 10 » devient « 6 sur 10 » parce que le chiffre d'origine était faux (correction d'un fait, pas retrait d'un chiffre).

**Intertitres de l'article humour noir (H1 à H3, règle n°1)** | `humour-noir-utiliser-sans-blesser`, l.757-765 | les intertitres présentaient comme de vrais « sketchs » deux exemples imaginés. Slug, title et H1 intouchés ; les trois exemples sont renommés, le H2 qui les annonce aussi.
- H-A Avant : `## 3 sketches décortiqués` / Après : `## 3 exemples décortiqués`
- H-B Avant : `### Sketch 1 : Blanche Gardin sur la thérapie (BON humour noir)` / Après : `### Exemple 1, dans la veine de Blanche Gardin : la thérapie (BON humour noir)`
- H-C Avant : `### Sketch 2 : Waly Dia sur les clichés racistes (BON humour noir)` / Après : `### Exemple 2, dans la veine de Waly Dia : les clichés racistes (BON humour noir)`
- H-D Avant : `### Sketch 3 : Quand ça ne marche PAS (MAUVAIS humour noir)` / Après : `### Exemple 3 : quand ça ne marche PAS (MAUVAIS humour noir)`
- **Ancres vérifiées** : `headingId()` (`markdown-renderer.tsx` l.202) ne pose un `id` que sur les H2. L'ancre du H2 passe de `3-sketches-decortiques` à `3-exemples-decortiques`. Aucune référence à l'ancien texte ou à l'ancre dans `apps/web/src` (Grep sur « Sketch 1/2/3 », « sketches décortiqués », « 3-sketches ») ; le test `markdown-renderer.test.ts` l.54 utilise sa propre chaîne (« ### Sketch 1 ») et n'est pas concerné. Les H3 n'ont pas d'ancre. Le H1 et le slug ne changent pas.
- Autres intertitres « X sur… » du périmètre : aucun (Grep des H2/H3 de la partie 1 ; les H3 « Type N », « Pilier N », « Habitude N », « Exercice N », « Technique N » nomment une technique, pas un sketch).

**« Le public décroche au mot 8 » (H2)** : la phrase est dans `blog-articles.ts` l.3427, article `pourquoi-blagues-marchent-pas` (l.3371 et suivantes), donc **partie 2, pas dans mes articles**. À corriger par la partie 2, juste avant le passage B37. Proposition : `**Le public décroche avant la fin d'une punchline trop longue.**` (même phrase, sans chiffre). Avant exact : `**Le public décroche au mot 8** d'une punchline trop longue.`

**Points relevés à ne pas oublier (non corrigés, non demandés)**
- `phrases-droles-conversations` l.1203 (phrase n°4, contexte) : « Le twist sur "la cantine" doit arriver vite, pas de pause. » et l.1209 « Enchaîne immédiatement » : même type de cas que PD6, jugés à part (rapidité volontaire sur un mot-clé, pas la pause avant la chute). Si Thomas veut une doctrine sans exception, les aligner sur « une petite seconde ».
- Réserves transversales des relecteurs, hors passages à réécrire : « Imagine X » et « le téléphone de Frayssinet » reviennent dans plusieurs articles (série), formule « une seconde environ » répétée (variantes « une petite seconde », « un temps ») ; Frayssinet « détails minuscules vers l'absurde » repose sur la presse du §3 mais reste la caractérisation la plus fragile (relecteur 3) ; A54 « améliore la qualité de chaque intervention » un peu corporate (relecteur 3, 1 avis sur 3 : non retouché).

### 9.1 Mesure du diff, tour 2 (estimation manuelle)

Les sept réécritures remplacent des « après » du tour 1 ; elles touchent environ 150 mots de l'ancien texte sur les articles concernés (HQ5, HQ2 : humour quotidien ; HN4 et les 4 intertitres : humour noir ; RE1 : répartie ; PI1 : pilier ; PD6 : phrases drôles ; EX6 : exercices), soit un taux total inchangé à l'arrondi (≈ 7 %). Seul `humour-noir-utiliser-sans-blesser` monte légèrement (≈ 18 % à 19 %, avec les intertitres). Intouchables : slugs, H1, liens, prix inchangés ; seuls changent les 4 intertitres de l'article humour noir (1 H2 et 3 H3, règle n°1). Les 6 réponses de FAQ modifiées restent les mêmes qu'au tour 1 (HQ2 et EX6 sont réécrites, pas ajoutées).

## 10. Liste anonymisée du tour 2 (10 passages)

> Identique au fichier `docs/copy/relecture-audit-code-s20/passages-partie-1-tour2.md`, à donner aux relecteurs sans la clé ni les sections 1 à 9.

### Clé du tour 2 (NE PAS OUVRIR AVANT LES VERDICTS)

| Lettre | Code | Lettre | Code |
|---|---|---|---|
| AA1 | PD6 révisé (A45) | AA6 | H-A et H-B (H2 « 3 exemples décortiqués » et H3 Gardin) |
| AA2 | H-C (H3 Waly Dia) | AA7 | HQ2 révisé (A25) |
| AA3 | RE1 révisé (A32) | AA8 | PI1 révisé (A35) |
| AA4 | HQ5 révisé (A7) | AA9 | H-D (H3 « Exemple 3 ») |
| AA5 | EX6 révisé (A53) | AA10 | HN4 révisé (A23) |
