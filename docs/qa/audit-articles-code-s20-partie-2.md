# Audit qualité des articles stockés dans le code, partie 2 (s20, 12/10/2026)

Auditeur : @reviewer. Périmètre : les 15 derniers articles de `apps/web/src/lib/blog-articles.ts` (l. 1602 à la fin).
Références : `project-context.md` (ton « pote drôle et bienveillant »), `docs/founder-preferences.md` (règle d'or P0 du 08/10, humoristes autorisés s15, chiffres non sourcés gardés si cohérents 08/10, zéro tiret cadratin).

## 0. Méthode et limites

- **Articles servis** : l'outil shell (curl) n'est pas disponible dans cette session. Vérification faite dans le code, qui fait foi pour le déploiement : `next.config.js` l. 134-138 sert les 301 de `src/lib/seo-redirects.data.cjs` ; `findBlogArticle` (`src/lib/blog-article-page.ts` l. 52) sert le statique avant la base. **À confirmer par curl** avant de corriger.
- Citations vérifiées par WebSearch (source donnée quand elle existe). VRAI = source trouvée ; FAUX = contredit par une source ; INVÉRIFIABLE = aucune trace.
- Chiffres non sourcés : règle du 08/10 (gardés s'ils sont pédagogiques et cohérents ; une fausse étude nommée ou un chiffre présenté comme statistique reste une donnée inventée).

## 1. Synthèse

### 1.1 Articles servis

| # | Slug | Servi ? | Preuve |
|---|---|---|---|
| 1 | comment-faire-rire-une-fille | Oui | aucune redirection |
| 2 | comment-faire-rire-un-homme | Oui | aucune redirection |
| 3 | je-suis-pas-drole-comment-changer | Oui | aucune redirection |
| 4 | repondre-moqueries-avec-humour | Oui | aucune redirection |
| 5 | blagues-travail-faire-rire-pro | Oui | aucune redirection |
| 6 | jamais-quoi-repondre-techniques | Oui | cible d'une 301 (`seo-redirects.data.cjs:32`) |
| 7 | timidite-et-humour | Oui | aucune redirection |
| 8 | storytelling-drole-5-structures | Oui | aucune redirection |
| 9 | conversation-machine-a-cafe | Oui | aucune redirection |
| 10 | repartie-soiree-anti-malaise | Oui | aucune redirection |
| 11 | humour-apres-rupture | **Non : 301** vers `confiance-humour-apres-rupture` | `seo-redirects.data.cjs:36`, `seo-redirects.ts:54`. Non audité |
| 12 | confiance-humour-apres-rupture | Oui | cible de la 301 ci-dessus |
| 13 | pourquoi-blagues-marchent-pas | Oui | aucune redirection |
| 14 | blagues-courtes-vs-longues | **Non : 301** vers `blague-courte-arme-secrete-humour` | `seo-redirects.data.cjs:37`, `seo-redirects.ts:55`. Non audité |
| 15 | rester-muet-en-groupe | Oui | cible d'une 301 (`seo-redirects.data.cjs:31`) |

**13 articles audités.**

### 1.2 Verdicts

| Article | Verdict | Faux / déformé | Invérifiable (citations ou faits sur des personnes réelles) | Problème principal |
|---|---|---|---|---|
| comment-faire-rire-une-fille | À CORRIGER | 0 | 3 (dont 1 citation entre guillemets) | Citation de Fary introuvable ; « 90 % des gens » |
| comment-faire-rire-un-homme | À CORRIGER | 1 (FAQ « les études le confirment ») | 3 (dont 1 citation entre guillemets) | Citation de Waly Dia introuvable (c'est une phrase du site) ; Gardin « silences de 3-4 secondes » |
| je-suis-pas-drole-comment-changer | **À REVOIR EN PROFONDEUR** (1re moitié) | 2 (étude « Université du Colorado » ; Gardin « plus de 10 ans ») | 5 (dont « Frayssinet : 70 % de réussite ») | Fausse étude en accroche ; chiffre inventé prêté à Frayssinet ; ratios contradictoires |
| repondre-moqueries-avec-humour | À CORRIGER (léger) | 0 | 4 | Superlatifs prêtés aux humoristes (« technique préférée de… ») |
| blagues-travail-faire-rire-pro | À CORRIGER | 1 (« Stanford : 23 % plus compétents, 25 % plus appréciés ») | 2 | Étude Stanford déformée (corps + FAQ) ; étude Penn sans le risque qu'elle démontre |
| jamais-quoi-repondre-techniques | À CORRIGER | 0 | 3 (dont 2 citations entre guillemets : Mirabel, Fary) | Citation Mirabel ; « règle des 3 secondes » opposée à celle de `timing-humour` ; « 65 % », « 50 % » |
| timidite-et-humour | À CORRIGER | 0 | 3 (dont 1 citation Pascot entre guillemets) | Citation Pascot introuvable, contredite par son parcours connu |
| storytelling-drole-5-structures | À CORRIGER (léger) | 0 | 5 caractérisations de style | Faute d'accord ; renvoi à un « module » alors que le Parcours Storytelling existe |
| conversation-machine-a-cafe | À CORRIGER (léger) | 0 | 1 | 5 tirets cadratins en H2 ; règle « sortie en 10 secondes » ambiguë |
| repartie-soiree-anti-malaise | À CORRIGER | 0 | 3 | Pause de « 2 secondes » enseignée deux fois (le site enseigne une seconde) |
| confiance-humour-apres-rupture | AU NIVEAU (1 retouche de forme) | 0 | 1 | Numérotation imbriquée (« Étape 1 » dans « Étape 2 ») |
| pourquoi-blagues-marchent-pas | À CORRIGER | 0 | 3 (dont 1 citation Fary entre guillemets) | L'exemple « Bon » contredit la règle qu'il illustre ; citations Fary et Frayssinet |
| rester-muet-en-groupe | À CORRIGER | 1 (terme « hyper-monitoring social » prêté à Mark Leary) | 3 (dont 1 citation Gardin entre guillemets) | Citation Gardin introuvable ; terme scientifique inventé |

**Totaux (13 articles)** : **5 faux ou déformés** ; **39 affirmations invérifiables** sur des personnes réelles, dont **7 citations entre guillemets introuvables** (Fary ×3, Waly Dia, Paul Mirabel, Panayotis Pascot, Blanche Gardin), plus une donnée chiffrée inventée et prêtée à une personne réelle (« Frayssinet : 70 % de réussite »). Aucun article n'invente d'interview datée comme ceux de ce matin, mais le schéma est le même : une phrase entre guillemets suivie de « dit souvent », « l'a décrit dans une interview » ou « parle de ça ».

Faits vérifiés VRAIS : Paul Mirabel à Bercy (Accor Arena, 10 et 11/04/2026), sa timidité et ses nombreuses scènes ouvertes ; Crawford et Caltabiano 2011 (8 semaines) ; Inès Reg devenue virale (2019) ; fight/flight/freeze ; Mark Leary (Duke) chercheur sur l'anxiété sociale ; prix 2,99 €/mois et durées des parcours 3/4/6 semaines (`apps/web/src/config/premium.ts:31`, `:73-75`).

### 1.3 Les 5 problèmes les plus graves

1. **Fausse étude « Université du Colorado, 76 % »** en accroche de `je-suis-pas-drole-comment-changer` (l. 1820) : aucune trace. Même schéma que le « Stanford » de ce matin.
2. **« Stanford : 23 % plus compétents et 25 % plus appréciés »** (`blagues-travail-faire-rire-pro`, l. 2087 et FAQ l. 2212) : la source réelle (Aaker, *Humor, Seriously*) dit « 23 % plus respectés » ; le « 25 % plus appréciés » est introuvable.
3. **7 citations entre guillemets introuvables** prêtées à Fary, Waly Dia, Paul Mirabel, Panayotis Pascot et Blanche Gardin. Celle de Waly Dia (l. 1793) reprend presque mot pour mot une phrase du site (l. 1683). Celle de Pascot (l. 2398) contredit son parcours connu (débuts comme chroniqueur télé).
4. **Le site se contredit sur le timing**. Durée de pause enseignée : 1 s (articles corrigés en s20), 1,5 s (l. 3401, 3722), 2 s (l. 3022, 3029, 3397), 3-4 s « Blanche Gardin » (l. 1768). Et deux « règles des 3 secondes » opposées : « réponds DANS les 3 secondes » (l. 2266) contre « attends 3 secondes » (`timing-humour`, l. 256).
5. **Chiffre précis inventé, attribué à une personne réelle** : « Roman Frayssinet a un taux de réussite d'environ 70 % sur scène » (l. 1842). Il est en plus incohérent avec le même article (« 40 % » qui ratent, l. 1902 ; « 3-4 sur 10 qui marchent », l. 1904).

### 1.4 Points transverses

- **38 tirets cadratins dans des titres H2/H3 affichés** sur 10 des 13 articles (ex. l. 1622, 1959, 2097, 2751, 3730). La passe s12 les a retirés du corps mais a laissé les titres, jugés « intouchables SEO » (`src/__tests__/lib/blog-em-dash-static.test.ts:13-14`). Cela contredit la règle n°12 (zéro tiret cadratin dans le client-facing). **Décision à soumettre à Thomas** (remplacer « — » par « : » dans les titres change le H2, mais pas le slug).
- **Pourcentages pédagogiques contradictoires d'un article à l'autre** : « la structure fait 70 % du travail » (l. 2544), « 70 % d'exécution » (l. 3377), « le timing fait 80 % de la blague » (l. 2205), « calibrer son public, c'est 50 % du travail » (l. 3411). Chacun est toléré seul (règle du 08/10). Mis ensemble, ils se contredisent.
- **Pseudo-statistiques sur la population**, de la même nature que le « 90 % » retiré ce matin : « 90 % des gens attendent leur tour » (l. 1646), « 65 % des gens » (l. 2226), « 50 % des bons conversationnalistes » (l. 2290). La règle du 08/10 garde les chiffres pédagogiques (« 10 fois plus »), pas ceux qui se présentent comme une mesure. À reformuler (« la plupart »).
- **Gabarit visible** : le bloc « À qui ça s'adresse ? » commence par « Que tu sois… Que tu cherches… Ou que tu… » sans proposition principale, dans 2 articles (l. 3475, 3800).
- **Numérotation cassée des H2** dans `comment-faire-rire-une-fille` et `comment-faire-rire-un-homme` : les techniques 1 et 4 (ou 1 et 5) ont été renommées pour le SEO sans numéro, les autres gardent « 2. », « 3. », « 5. », « 6. ».

## 2. Détail par article

Rappel du cadre (s15) : on ne retire jamais un humoriste par principe. Pour chaque point, on propose soit de corriger le fait, soit de reformuler en caractérisation assumée (« dans la veine de… », « c'est le genre de chose que fait… ») ou en exemple imaginé présenté comme tel.

### 2.1 `comment-faire-rire-une-fille` (l. 1602) : À CORRIGER

**Humoristes**
| Passage (l.) | Classement | Source / remarque | Proposition |
|---|---|---|---|
| « **Fary** l'a dit mieux que personne : "L'autodérision, c'est montrer qu'on est assez confiant pour rire de soi." » (1612) | INVÉRIFIABLE, citation probablement inventée | Aucune trace. Time Out confirme seulement que Fary pratique l'autodérision sur scène ([timeout.fr](https://www.timeout.fr/paris/theatre/fary-7)) | Retirer les guillemets : « Fary en a fait une marque de fabrique sur scène : rire de soi, c'est montrer qu'on est assez à l'aise pour le faire. » |
| « C'est un callback : la technique préférée de **Blanche Gardin** en spectacle » (1642) | INVÉRIFIABLE (superlatif) | Aucune source pour « préférée » | « une technique qu'on retrouve chez Blanche Gardin » |
| « Regarde **Panayotis Pascot** en interview. Il laisse des blancs. » (1660) | INVÉRIFIABLE | Fait précis non trouvé | « dans la veine de Panayotis Pascot » ou exemple imaginé |
| « **Inès Reg** est devenue virale en étant juste elle-même, sans filtre, sans calcul » (1666) | VRAI pour la viralité, à nuancer | Vidéo « Des paillettes dans ma vie, Kévin », 2019 ([parismatch.be](https://www.parismatch.be/lifestyle/technologie/2019/08/27/des-paillettes-dans-ma-vie-kevin-cette-video-hilarante-resume-parfaitement-la-vie-de-couple-ZUI35ENSVRB3NERADEYHGT23OA/)) ; c'était un sketch improvisé et mis en scène avec son mari ([dexerto.fr](https://www.dexerto.fr/divertissement/des-paillettes-dans-ma-vie-kevin-video-ines-reg-enflamme-reseaux-sociaux-958404/)) : « sans calcul » est inexact | « en jouant une scène de couple que tout le monde a vécue » |
| Frayssinet « roi » de l'observation (1624), Mirabel et le pivot (1638), Waly Dia et l'exagération (1654) | Caractérisations de style | Acceptables : ce sont des lectures de style, sans fait ni citation | RAS |

**Chiffres** : « 90 % des gens attendent juste leur tour pour parler » (1646) se présente comme une mesure : reformuler en « la plupart des gens ». Même chose que le « 90 % » corrigé ce matin. Les « 10 fois plus » (1630, 1660) sont tolérés (règle du 08/10).

**Forme et cohérence**
- H2 numérotés de façon incohérente : « Comment faire rire… avec l'autodérision » (sans numéro), « 2. », « 3. », « Faire rire une fille en prouvant que tu écoutes » (sans numéro), « 5. », « 6. ».
- 4 tirets cadratins dans les titres (1622, 1632, 1648, 1656).

**Sous la barre** : « Au début, je t'ai trouvée normale. Et puis t'as parlé de ta collection de cactus. Ouf. » (1636) : le « Ouf. » final se lit comme un recul, voire une pique ; la chute est floue. À réécrire et à faire relire à l'aveugle.

### 2.2 `comment-faire-rire-un-homme` (l. 1704) : À CORRIGER

**Humoristes**
| Passage (l.) | Classement | Source / remarque | Proposition |
|---|---|---|---|
| « **Waly Dia** dit un truc juste : "Les gens drôles ne sont pas ceux qui font rire, ce sont ceux avec qui on se sent assez à l'aise pour rire." » (1793) | INVÉRIFIABLE, très probablement inventée | Aucune trace. La phrase reprend presque mot pour mot la conclusion de l'article voisin, écrite avec la voix du site : « Les gens les plus drôles ne sont pas ceux qui sortent les meilleures vannes. Ce sont ceux qui créent un espace où tout le monde se sent assez à l'aise pour rire » (1683) | La garder comme phrase du site, sans attribution |
| « **Blanche Gardin** utilise des silences de 3-4 secondes avant certaines punchlines » (1768) | INVÉRIFIABLE et contraire à ce que le site enseigne | Même formule, au chiffre près, que celle prêtée à Frayssinet dans `timing-humour` (l. 248) : gabarit réattribué. Les corrections s20 ont remplacé ce type de phrase par « écoute ses silences avant certaines punchlines », avec une micro-pause d'une seconde en conversation (`src/data/blog-article-rewrites.json`) | Aligner sur la formule s20 : « Blanche Gardin laisse la salle attendre avant certaines chutes ; en conversation, une seconde suffit. » |
| « **Fary** parle souvent de ça : le chambrage, c'est du lien social » (1722) | INVÉRIFIABLE | Aucune source | « Le chambrage, c'est du lien social » sans attribution, ou « dans la veine de Fary » |
| « tu fais exactement ce que **Paul Mirabel** faisait dans ses premiers open mics, tu testes » (1778) | VRAI | Scènes ouvertes parisiennes, « jusqu'à cent passages par mois » (Le Parisien, repris par [vikidia](https://fr.vikidia.org/wiki/Paul_Mirabel)) | RAS |

**Chiffres et faits**
- FAQ « Les hommes aiment les femmes drôles ? » : « **Oui, et les études le confirment** » (1808) : **déformé**. La littérature dit plutôt l'inverse : les hommes préfèrent une partenaire *réceptive* à leur humour, les femmes un partenaire qui *produit* de l'humour (Bressler, Martin et Balshine 2006, *Evolution and Human Behavior* 27 : [abel.mcmaster.ca](https://abel.mcmaster.ca/publications/BresslerEtAl2006) ; répliqué par Hone et al. 2015). Proposition : retirer « les études le confirment » et garder l'argument du texte (complicité, aisance), ou citer l'étude honnêtement.

**Forme** : numérotation des H2 incohérente (« 2. », « 3. », « 4. », « 6. » ; techniques 1 et 5 sans numéro) ; 4 tirets cadratins dans les titres (1724, 1733, 1742, 1761) ; « [Nos techniques de répartie](/conseils), timing, repartie, autodérision » (1799) : « repartie » sans accent, et un libellé qui annonce des techniques de répartie mais pointe vers `/conseils`.

### 2.3 `je-suis-pas-drole-comment-changer` (l. 1814) : À REVOIR EN PROFONDEUR (accroche et section « Pourquoi tu penses ne pas être drôle »)

**Chiffres et études**
| Passage (l.) | Classement | Source / remarque | Proposition |
|---|---|---|---|
| « 76% des gens pensent ne pas être drôles, selon une étude de l'Université du Colorado. Trois personnes sur quatre. […] sur les 10 personnes présentes, 7 pensent secrètement comme toi » (1820) | **FAUX (étude introuvable)** | Le Humor Research Lab de CU Boulder (Peter McGraw) existe, mais aucune publication ni article ne donne ce chiffre ([nhpr.org](https://www.nhpr.org/post/researching-funny-university-colorados-humor-lab)). Le calcul est aussi bancal : 76 %, puis « trois sur quatre », puis « 7 sur 10 » | Supprimer l'étude et garder l'idée sans chiffre : « Tu n'es pas seul : dans ta prochaine soirée, plusieurs personnes pensent exactement pareil, y compris le mec qui a l'air super à l'aise. » |
| « **Roman Frayssinet** a un taux de réussite d'environ 70% sur scène » (1842) | **INVÉRIFIABLE, chiffre inventé et attribué à une personne réelle** | Aucune source. Contredit aussi l'article : « accepte que 40% de tes tentatives vont tomber à plat » (1902) puis « sur 10 tentatives, 3-4 vont marcher. C'est le ratio normal. Même pour les pros » (1904) : 30 %, 40 % et 60-70 % d'échec dans le même texte | Retirer le chiffre : « Même Roman Frayssinet a des vannes qui ne marchent pas comme prévu : c'est le métier. » Harmoniser ensuite la piste 6 sur un seul repère (règle du 08/10 : un chiffre incohérent reste une faute) |
| Crawford et Caltabiano 2011, programme de 8 semaines (FAQ 1932, 1934) | **VRAI** | *Journal of Positive Psychology* 6(3) ([researchonline.jcu.edu.au](https://researchonline.jcu.edu.au/18802/)). Nuance : l'étude mesure le bien-être, pas la capacité à être drôle | RAS (la FAQ le dit correctement) |

**Humoristes**
| Passage (l.) | Classement | Source / remarque | Proposition |
|---|---|---|---|
| « **Paul Mirabel** remplit Bercy » (1830) | VRAI | Accor Arena, 10 et 11/04/2026 ([accorarena.com](https://www.accorarena.com/en/events-and-tickets/paul-mirabel--942cc)) | RAS |
| « Paul a fait des centaines d'open mics à Paris devant 15 personnes, avec des vannes qui tombaient à plat une fois sur deux » (1830) | VRAI sur le fond (scènes ouvertes en grand nombre), INVÉRIFIABLE sur le détail | voir 2.2 | Garder « des centaines de scènes ouvertes », retirer « 15 personnes » et « une fois sur deux » |
| « **Fary** a écrit des milliers de blagues avant de trouver son style » (1830) | INVÉRIFIABLE | Aucune source | « Fary, comme tous les pros, a beaucoup jeté avant de trouver son style » |
| « **Blanche Gardin** a mis plus de 10 ans à oser faire du stand-up solo » (1830) | **DÉFORMÉ** | Débuts au Jamel Comedy Club en 2006, premier seule-en-scène *Il faut que je vous parle !* en 2015, soit environ 9 ans ([parisbouge.com](https://www.parisbouge.com/mag/articles/blanche-gardin-le-stand-up-trash-au-feminin-2655), [sortiraparis.com](https://www.sortiraparis.com/scenes/spectacle/articles/84413-blanche-gardin-a-la-nouvelle-seine-notre-critique)) ; « oser » est une interprétation | « Blanche Gardin a fait près de dix ans de scène avant son premier spectacle solo » |
| « **Waly Dia** ne teste pas ses nouvelles vannes à Bercy. Il les teste dans des petites salles de 30 personnes » (1870) | INVÉRIFIABLE | Pratique courante du rodage, rien de propre à Waly Dia | « Les humoristes rodent leurs vannes dans de petites salles avant les grandes » |
| « **Panayotis Pascot** parle de ça : la liberté de foirer » (1902) | INVÉRIFIABLE | Aucune source | Sans attribution, ou « dans la veine de » |
| Inès Reg et le « oui, et… » (1888) | Caractérisation | Acceptable | RAS |

**Promesses produit** : parcours 3/4/6 semaines conformes (`config/premium.ts:73-75`). La liste (1911-1913) ne mentionne pas Storytelling ni Boulot : incomplète, pas fausse.

### 2.4 `repondre-moqueries-avec-humour` (l. 1939) : À CORRIGER (léger)

| Passage (l.) | Classement | Proposition |
|---|---|---|
| « La technique préférée de **Blanche Gardin** » (1961) | INVÉRIFIABLE (superlatif) | « Une technique qu'on retrouve souvent chez Blanche Gardin » |
| « **Fary** fait ça en interview constamment : il ne répond jamais à la question » (1980) | INVÉRIFIABLE (« jamais », « constamment ») | « dans la veine de Fary » |
| « **Paul Mirabel** est le roi du callback en spectacle : il fait une blague en début de show, et la reprend 40 minutes plus tard » (2020) | INVÉRIFIABLE (détail précis) | Retirer « 40 minutes » ; « le callback, que Paul Mirabel manie souvent en spectacle » |
| « **Waly Dia** fait ça sur scène quand un spectateur tente un truc : il le regarde, sourit, attend » (2038) | INVÉRIFIABLE | Exemple imaginé assumé : « Imagine un humoriste qu'un spectateur interpelle : il le regarde, sourit, attend. » |
| Pascot et le « compliment inversé » (2000) | Caractérisation plausible (spectacle *Presque*, autobiographique) | RAS |
| Fight, flight, freeze (1953) | VRAI (notion classique) | RAS |

**Forme** : 6 tirets cadratins dans les titres (1959 à 2034). Ton et exemples au niveau (« le trottoir me connaît par mon prénom »). La section « Quand NE PAS répondre avec humour » (2047) est juste et bienveillante.

### 2.5 `blagues-travail-faire-rire-pro` (l. 2079) : À CORRIGER

**Études**
| Passage (l.) | Classement | Source / remarque | Proposition |
|---|---|---|---|
| « Selon une étude de Stanford, les leaders qui utilisent l'humour sont perçus comme 23% plus compétents et 25% plus appréciés » (2087) ; FAQ « perçus comme 23% plus compétents (Stanford) » (2212) | **DÉFORMÉ** | Jennifer Aaker (Stanford), interview NPR : les leaders qui utilisent l'humour sont « 23 % plus respectés » et vus comme plus compétents et plus confiants, **sans pourcentage pour la compétence** ([npr.org](https://www.npr.org/transcripts/965572857)). « 25 % plus appréciés » introuvable. Le livre ne précise pas l'étude d'origine | « Jennifer Aaker et Naomi Bagdonas (Stanford, *Humor, Seriously*) rapportent que les leaders qui utilisent l'humour sont jugés 23 % plus respectés, et perçus comme plus compétents. » Ou retirer le chiffre. Corriger la FAQ de la même façon |
| « Une étude de l'Université de Pennsylvanie montre que l'humour est un marqueur de compétence sociale et cognitive » (2093) | **VRAI, mais incomplet** | Bitterly, Brooks et Schweitzer 2017, « Risky Business » (Wharton et Harvard) : un humour **réussi** augmente le statut via la confiance et la compétence perçues ; un humour **inapproprié** fait baisser la compétence perçue ([PDF Wharton](https://faculty.wharton.upenn.edu/wp-content/uploads/2017/03/2016-54537-001.pdf)) | Nommer l'étude et ajouter la moitié qui sert justement le propos « sans déraper » : la vanne ratée et déplacée coûte en crédibilité |
| « Les gens qui font rire sont promus plus vite » (2095) | Non sourcé, présenté comme un fait | Affirmation causale | Atténuer : « L'humour bien placé est perçu comme un signal de leadership » |

**Humoristes**
| Passage (l.) | Classement | Proposition |
|---|---|---|
| « **Fary** parle souvent du timing en spectacle : il ne place jamais une vanne au milieu d'un développement » (2129) | INVÉRIFIABLE (« jamais ») | Retirer l'attribution ou « dans la veine de » |
| « **Paul Mirabel** a une règle : il ne se moque que de lui-même ou de situations universelles. Jamais d'attaques personnelles » (2153) | INVÉRIFIABLE (règle prêtée) | « L'humour de Paul Mirabel vise surtout lui-même et des situations que tout le monde connaît » (caractérisation) |
| Frayssinet et l'observation (2109, 2161) | Caractérisation | RAS |

**Cohérence** : « le timing fait 80% de la blague » (2205) contre « 70 % d'exécution » (l. 3377) et « la structure fait 70 % » (l. 2544) : voir §1.4. Le renvoi vers « une section entière pour le bureau » de `meilleures-blagues-droles-2026` est vrai (H2 l. 1427). 4 tirets cadratins dans les titres (2097, 2119, 2143, 2163).

### 2.6 `jamais-quoi-repondre-techniques` (l. 2218) : À CORRIGER

**Humoristes**
| Passage (l.) | Classement | Source / remarque | Proposition |
|---|---|---|---|
| « **Paul Mirabel** l'a décrit dans une interview : "Mes premiers open mics, j'avais le blanc total entre deux vannes. Mon cerveau disait 'tais-toi, tu vas te ridiculiser'." » (2236) | **INVÉRIFIABLE, citation probablement inventée** | Aucune interview trouvée. Le contexte est vrai : timidité marquée ([timeout.fr](https://www.timeout.fr/paris/actualites/en-2024-paul-mirabel-est-de-retour-sur-scene-pour-vous-parler-damour-112323)), cours Florent pour la vaincre, scènes ouvertes | Sans guillemets : « Paul Mirabel, dont la timidité est devenue la marque de fabrique, a commencé par des dizaines de scènes ouvertes. Aujourd'hui, il remplit Bercy. » |
| « **Fary** a une technique en interview : il réagit d'abord ("Ah mais c'est intéressant ça") puis développe » (2272) | INVÉRIFIABLE (citation) | Aucune source | Exemple imaginé assumé, sans nom |
| « **Waly Dia** utilise cette technique en spectacle quand il interagit avec le public » (2304) | INVÉRIFIABLE | Plausible (interaction avec le public) mais non sourcé | « dans la veine de » |

**Chiffres** : « tu fais partie des 65% des gens qui rapportent avoir régulièrement le "blanc conversationnel" » (2226) et « 50% des "bons conversationnalistes" sont en réalité de bons questionneurs » (2290) : pseudo-statistiques à reformuler. Pour la seconde, il existe une étude réelle qui dit mieux la même chose : poser plus de questions augmente l'appréciation de l'interlocuteur (Huang et al., Harvard, 2017), à citer si @copywriter le souhaite (à vérifier avant usage).

**Cohérence (grave)** : la « **règle des 3 secondes** » de cet article, « réponds dans les 3 secondes […] C'est le silence après 3 secondes qui crée le malaise » (2262-2269), est l'exact opposé de celle de `timing-humour`, « Comment utiliser la règle des 3 secondes ? […] **attends 3 secondes** » (l. 254-256). Même nom, consigne contraire, et les deux articles se renvoient l'un à l'autre. À trancher par @copywriter : renommer l'une des deux, et aligner sur la seconde de pause enseignée ailleurs.

**Forme** : « Vous avez vu le dernier spectacle de [humoriste] ? Le sketch sur [sujet] est incroyable » (2310) ressemble à un gabarit oublié. Mettre un vrai exemple (un humoriste nommé est autorisé, s15). FAQ « ça te donne 30 secondes pour formuler » (2341) : incohérent avec la règle des 3 secondes du même article. 5 tirets cadratins dans les titres.

### 2.7 `timidite-et-humour` (l. 2345) : À CORRIGER

| Passage (l.) | Classement | Source / remarque | Proposition |
|---|---|---|---|
| « C'est exactement comme ça que **Panayotis Pascot** décrit ses débuts : "J'écrivais des trucs, je testais par messages, je voyais ce qui faisait réagir." » (2398) | **INVÉRIFIABLE, citation probablement inventée** | Aucune trace. Ses débuts connus sont à la télévision (chroniqueur au *Petit Journal* puis à *Quotidien* : [ozap.com](https://www.ozap.com/actu/-je-n-etais-pas-heureux-panayotis-pascot-revele-les-raisons-de-son-depart-de-quotidien/621595)), pas dans des tests par messages | Retirer la citation et présenter l'écrit comme une méthode du site, pas comme le parcours de Pascot |
| « **Paul Mirabel** a commencé dans des salles de 20 personnes avec une timidité maladive » (2357) ; FAQ « ont tous les deux commencé en introvertis maladroits » (2506) | VRAI pour la timidité, INVÉRIFIABLE pour « 20 personnes » ; Pascot « introverti maladroit » non sourcé | Time Out : « dont le principal trait est la timidité » | « Paul Mirabel a fait de sa timidité sa marque de fabrique » ; retirer « maladive » et « 20 personnes » |
| « **Roman Frayssinet** teste ses sketches en conversation avant de les mettre sur scène » (2409) | INVÉRIFIABLE | Aucune source | « Les humoristes rodent leurs vannes avant la scène : tu fais pareil, en plus petit. » |
| Pascot « référence absolue » de l'autodérision vulnérable (2438) | Caractérisation plausible (*Presque*) | — | RAS |

**Promesse produit à vérifier** : « C'est exactement la progression de notre Parcours Répartie : 4 semaines […] à raison d'un palier par semaine » (2466). La durée de 4 semaines est juste (`config/premium.ts:74`), mais le parcours porte sur « savoir quoi répondre quand on se fait chambrer » (`src/lib/llms-content.ts:116`), pas sur une progression par taille de groupe. Probablement inexact : @product-manager à confirmer.

**Cohérence et forme** : la FAQ parle d'un « palier 0 » (2527) alors que le corps commence au palier 1 (2459) ; le lien « [techniques de storytelling](/blog/comment-devenir-drole) » (2388) pointe vers le guide général alors que `storytelling-drole-5-structures` existe ; « quand tu parles en groupe, les gens t'écoutent vraiment » (2415) contredit « Personne n'écoute vraiment dans un groupe » (`rester-muet-en-groupe`, 3700). Prix « 2,99 €/mois, sans engagement » (2497) conforme. 4 tirets cadratins dans les titres.

### 2.8 `storytelling-drole-5-structures` (l. 2532) : À CORRIGER (léger)

**Humoristes** : l'article prête une « structure » à chaque humoriste : escalade (Mirabel, 2563), pivot (Fary, 2585), exagération contrôlée (Frayssinet, 2608), callback (Gardin, 2630, « elle te la balance 10 minutes plus tard »), boucle (Waly Dia, 2656). Ce sont **5 caractérisations invérifiables**, sans citation ni fait daté. Elles sont acceptables comme lectures de style, mais l'article les présente comme des « signatures » établies. Proposition : « Pour chaque structure, un humoriste chez qui tu la reconnaîtras » plutôt que « La structure : Paul Mirabel », et retirer le « 10 minutes plus tard » de Gardin.

**Erreurs**
- « Je suis devenu l'assistante de mon propre sommeil » (2575) : faute d'accord, ou chute ratée. À réécrire et à relire à l'aveugle.
- « Les [parcours](/parcours) incluent un module storytelling » (2703) : le **Parcours Storytelling** existe et est publié depuis s18 (`config/premium.ts:78`, slug `storytelling`). Pointer vers `/parcours/storytelling`.
- « nos [vidéos](/videos) analysées décortiquent les techniques de chaque humoriste » (2703) : à vérifier, car cela suppose au moins une vidéo par humoriste cité.
- « La structure fait 70% du travail, le contenu fait 30% » (2544, FAQ 2719) : voir §1.4.
- Les H2 en questions (« Comment l'escalade peut transformer une anecdote banale ? », 2561 ; il manque le « -elle ») sentent le gabarit SEO.

Pas de tiret cadratin. Exemples globalement au niveau (« dépensé 60 euros pour manger triste », l'agenda vierge « en paix avec ça »).

### 2.9 `conversation-machine-a-cafe` (l. 2739) : À CORRIGER (léger)

- **Humoriste** : « **Panayotis Pascot** en fait une démonstration sur scène : rire de soi montre qu'on est à l'aise ; rire des autres montre plutôt qu'on ne l'est pas » (2797) : INVÉRIFIABLE (thèse prêtée). Proposition : garder la phrase avec la voix du site et écrire « c'est tout l'humour de Panayotis Pascot, qui rit d'abord de lui ». Frayssinet et l'observation (2760) : caractérisation, RAS.
- **Cohérence** : la règle « 4. **La sortie en 10 secondes** » (2853) est suivie de « une bonne conversation machine à café dure entre 60 et 90 secondes » : le titre se lit comme une durée totale de 10 secondes. Écrire plutôt « Une sortie qui tient en une phrase ».
- **Forme** : 5 tirets cadratins dans les H2 (2751, 2768, 2785, 2807, 2828). Ton au niveau (« de l'eau chaude qui a entendu parler du café », le pacte des yaourts « depuis 2019 »). Prix 2,99 €/mois conforme. La partie « crush du 3ème étage » reste prudente et respectueuse : RAS.

### 2.10 `repartie-soiree-anti-malaise` (l. 2907) : À CORRIGER

| Passage (l.) | Classement | Proposition |
|---|---|---|
| « **Panayotis Pascot** explique dans un de ses spectacles que la peur du jugement est le plus grand tueur de répartie » (2921) | INVÉRIFIABLE (spectacle non nommé, thèse prêtée) | Sans attribution, ou nommer le spectacle si on retrouve le passage |
| « **Fary** a passé des années d'open mic à se planter devant 20 personnes » (2931) | INVÉRIFIABLE (détail précis) | « Fary, comme tous les humoristes, a connu des salles où ça ne riait pas » |
| « **Roman Frayssinet** utilise souvent ce type de pivot dans ses spectacles : transformer le malaise en méta-commentaire » (2999) | INVÉRIFIABLE | « dans la veine de Roman Frayssinet » |

**Cohérence (grave)** : « Deux secondes de silence avant une réplique font 3x plus d'effet » (3022), « Après une vanne, attends 2 secondes » (3029), FAQ « attends 2 secondes » (3041). Le site enseigne une seconde dans les articles corrigés en s20 (« Un silence d'une seconde avant la chute », `blog-article-rewrites.json`, testé dans `blog-corrections-s11-s20.test.ts:32`). À aligner, avec relecture à l'aveugle (règle d'or). Les « 2 secondes » de la vanne plantée (2938) sont un autre cas (on laisse passer le blanc avant de rebondir) : acceptable si la formulation l'indique.

**Forme** : « Ce guide, c'est pour le deuxième cas. Parce qu'on a tous vécu les deux. » (2915) : bon. 2 tirets cadratins dans les H2 (2965, 2984).

### 2.11 `confiance-humour-apres-rupture` (l. 3212) : AU NIVEAU (1 retouche de forme)

- **Humoriste** : « **Waly Dia** utilise systématiquement ce troisième niveau dans ses spectacles » (3289) : INVÉRIFIABLE (« systématiquement »). Remplacer par « souvent » ou « dans la veine de ». Fary, Frayssinet et Gardin cités comme spectacles à regarder (3254) : RAS.
- **Affirmation** : « C'est un des mécanismes les plus documentés de la résilience psychologique » (3232) n'a pas de source, mais il est défendable (l'humour comme stratégie d'adaptation est largement étudié). Toléré.
- **Forme** : la section « Étape 2 » contient elle-même « Étape 1. Observer… Étape 4. Faire une remarque… » (3253-3268), alors que l'article compte déjà 5 étapes. La lecture s'y perd. Renommer les sous-étapes en « Semaine 1 » à « Semaine 4 ».
- Ton juste et bienveillant pour Marc (persona 2) : « la rupture la plus administrative de l'histoire : par message, un mardi à 14h37 », « l'autre a pris tout le sel ». Aucun tiret cadratin. Parcours Confiance de 6 semaines conforme.

### 2.12 `pourquoi-blagues-marchent-pas` (l. 3371) : À CORRIGER

**Humoristes**
| Passage (l.) | Classement | Proposition |
|---|---|---|
| « **Fary** dit souvent : "Ma règle, c'est : si la blague a besoin d'une notice, elle a échoué. La punchline doit être comme une porte qui claque : sec, fini." » (3417) | **INVÉRIFIABLE, citation probablement inventée** (aucune trace) | La garder comme règle du site, sans guillemets ni attribution |
| « **Roman Frayssinet** dit que la pire chose à faire après une blague qui rate, c'est d'essayer de la sauver » (3465) | INVÉRIFIABLE (propos prêtés) | Sans attribution |
| « **Pierre Croce** […] il attend (parfois 2 secondes, une éternité sur scène) » (3397) ; FAQ « Pierre Croce et Paul Mirabel construisent une bonne partie de leur stand-up sur cette mécanique de pause » (3501) | INVÉRIFIABLE, et une durée de plus en contradiction avec le reste | « Pierre Croce laisse la salle attendre avant la chute » (formule s20), sans durée |
| Paul Mirabel n'annonce pas ses blagues (3385), Inès Reg « proportionnée » (3437) | Caractérisations | RAS |

**Erreur objective** (garde-fou du 08/10 : « exemple qui contredit sa propre règle ») : la raison 5 pose que « la chute est **toujours plus courte** que l'amorce » et que « le public décroche au mot 8 » (3427). Or l'exemple « **Bon** » donne « Setup 5 mots, punchline 11 mots » (3431-3433) : la chute fait plus du double de l'amorce et dépasse le 8e mot. L'exemple illustre exactement l'erreur qu'il prétend corriger. À réécrire.

**Cohérence et forme**
- Pause de 1,5 s (3401, FAQ 3491) : voir §1.3, point 4.
- Le H2 « Le test du miroir : 3 façons de récupérer une blague qui tombe à plat » (3459) ne parle pas de miroir (le test vidéo est plus bas, 3469).
- Densité de pourcentages : « 9 cas sur 10 » (3375), « 30% d'idée et 70% d'exécution » (3377), « 50% du travail comique » (3411), « 80% des blagues qui marchent pas » (3439), « 90% de ton problème » (3475). Chacun est toléré seul, mais l'ensemble sonne faux, et « 90 % » est le chiffre retiré ce matin. Alléger.
- « À qui ça s'adresse ? » (3475) : « Que tu sois… Que tu cherches… Ou que tu galères… » sans verbe principal (gabarit, voir §1.4).
- Sous la barre (à relire à l'aveugle) : l'exemple « Bon » de la raison 1, « On a passé 200 000 ans à se demander pourquoi le coq traverse la route. Personne lui a jamais demandé comment il allait. » (3389). La blague-modèle de l'article qui enseigne à faire mieux est faible, et le coq remplace la poule de la blague d'origine.
- 1 tiret cadratin (H3 3393). Prix conforme.

### 2.13 `rester-muet-en-groupe` (l. 3634) : À CORRIGER

| Passage (l.) | Classement | Source / remarque | Proposition |
|---|---|---|---|
| « Des chercheurs en psychologie sociale (notamment Mark Leary, Université Duke) appellent ça l'**hyper-monitoring social** : plus le groupe est grand, plus on évalue ses propres mots… » (3654) | **DÉFORMÉ** : le chercheur existe, le terme est inventé | Mark Leary (Duke) a bien formulé la théorie auto-présentationnelle de l'anxiété sociale : on est anxieux quand on veut faire une certaine impression et qu'on doute d'y parvenir (Schlenker et Leary 1982 ; Leary et Kowalski 1995 ; [scholars.duke.edu](https://scholars.duke.edu/publication/965276)). « Hyper-monitoring social » ne se trouve nulle part, et rien ne dit que l'effet augmente avec la taille du groupe | « Le psychologue Mark Leary (Duke) l'explique ainsi : on se tait quand on tient à faire bonne impression et qu'on doute d'y arriver. » Corriger aussi la FAQ (3811) |
| « **Blanche Gardin** parle souvent de cette mécanique : elle dit que dans une conversation, "ce n'est pas le mec le plus drôle qui parle, c'est le mec qui place le bon truc dans le bon trou de silence." » (3724) | **INVÉRIFIABLE, citation probablement inventée** | Aucune trace | La garder comme règle du site, sans attribution |
| « **Inès Reg** a fait carrière sur cette posture : celle qui pose la question que tout le monde se pose » (3706) | INVÉRIFIABLE (caractérisation contestable) | Son registre connu est l'énergie et les scènes de couple | Retirer, ou un autre humoriste avec un exemple vérifié |
| FAQ « La plupart des humoristes professionnels (Roman Frayssinet, Blanche Gardin, Panayotis Pascot) sont des introvertis » (3831) | INVÉRIFIABLE (trait de personnalité prêté à 3 personnes réelles) | — | « Beaucoup d'humoristes se disent timides hors scène » sans les nommer, ou citer Paul Mirabel (timidité sourcée) |

**Cohérence** : « Personne n'écoute vraiment dans un groupe » (3700) contredit `timidite-et-humour` (2415) et la technique 3 du même article (« tu montres que tu écoutes », 3696). Fenêtre de « 1,5 seconde » (3722) : une durée de plus (voir §1.3). Le motif de la redirection (`seo-redirects.data.cjs:31`) présente cet article comme celui « sans témoignages fictifs », alors qu'il contient la citation Gardin ci-dessus.

**Forme** : « À qui ça s'adresse ? » (3800) a la même syntaxe cassée que 3475. 3 tirets cadratins (H3 3730, 3736, 3742). Parcours Répartie de 4 semaines et prix conformes.

## 3. Contradictions entre articles

| Article A | Article B | Contradiction | Criticité | Résolution proposée | Agent |
|---|---|---|---|---|---|
| `jamais-quoi-repondre-techniques` l. 2262-2269 (« réponds dans les 3 s ») | `timing-humour` l. 254-256 (« attends 3 s ») | Même nom de règle, consignes opposées | Haute | Renommer l'une (« règle du réflexe ») et aligner la pause sur une seconde | @copywriter |
| `comment-faire-rire-un-homme` 1768 (3-4 s), `repartie-soiree` 3022/3029 (2 s), `pourquoi-blagues` 3401 (1,5 s), `rester-muet` 3722 (1,5 s) | articles corrigés s20 (« une seconde ») | Cinq durées de pause différentes | Haute | Une seule référence (une seconde), sans durée prêtée aux humoristes | @copywriter |
| `je-suis-pas-drole` 1842 (70 % de réussite) | même article 1902 (40 % ratent), 1904 (3-4 sur 10 marchent) | Ratios incompatibles | Haute | Un seul repère, sans chiffre prêté à Frayssinet | @copywriter |
| `timidite-et-humour` 2415 (« les gens t'écoutent vraiment ») | `rester-muet-en-groupe` 3700 (« Personne n'écoute vraiment ») | Constat opposé | Moyenne | Reformuler 3700 : « Dans un groupe, l'attention est diffuse » | @copywriter |
| `storytelling` 2544 (structure 70 %), `pourquoi-blagues` 3377 (exécution 70 %) et 3411 (public 50 %), `blagues-travail` 2205 (timing 80 %) | entre eux | Pourcentages qui dépassent 100 % | Basse | Garder un seul repère chiffré par article, sans le présenter comme une mesure | @copywriter |
| `comment-faire-rire-une-fille` 1683 (phrase du site) | `comment-faire-rire-un-homme` 1793 (même idée attribuée à Waly Dia) | Phrase du site réattribuée à un humoriste | Haute | Retirer l'attribution | @copywriter |

## 4. Décisions à confirmer par Thomas

1. **Tirets cadratins des titres H2/H3** (38 occurrences, 10 articles) : la passe s12 les a gardés parce que les titres étaient jugés « intouchables SEO ». Proposition : « — » devient « : » dans les titres affichés (slugs, title et H1 inchangés).
2. Une seule durée de pause pour tout le site (proposition : une seconde, comme les corrections s20).

## 5. Suite recommandée

- @copywriter : corrections ciblées de ce rapport (priorité : je-suis-pas-drole, blagues-travail, citations entre guillemets, timing), puis **relecture à l'aveugle avant mise en ligne** (règle d'or du 08/10 ; le garde-fou classe la donnée inventée et l'exemple qui contredit sa règle comme fautes objectives).
- Mesure du diff réel après correction (P0 s11) : slugs, H2, FAQ, liens et prix intouchables, sauf décision 1 ci-dessus.
- @product-manager : confirmer si le Parcours Répartie suit vraiment une progression « un palier par semaine » (§2.7).
- Avant de corriger, confirmer par `curl` que les 13 slugs répondent bien en 200 et que les 2 slugs redirigés répondent en 301 (non fait ici : pas d'accès shell dans cette session).
