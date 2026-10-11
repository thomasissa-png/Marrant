# Calendrier éditorial blog Q4 2026 : 13 articles, 1 par semaine, le lundi (05/10 au 28/12)

**Date :** 2026-09-30 · **Agent :** @seo · **Statut :** proposition à valider par Thomas (aucun contenu produit, aucun code touché, rien commité).
**Cadre :** décision fondateur du 30/09 (`docs/founder-preferences.md`, dernière ligne) : contenu préparé à l'avance par trimestre, plus de génération IA automatique, 1 article par semaine planifié, complété chaque mois selon l'actualité.
**Sources lues :** `docs/seo/keywords.md`, `docs/seo/audit-post-bascule-s14.md` (P1-6, P1-7, P2-8), `docs/geo/audit-post-bascule-s14.md`, `apps/web/src/lib/blog-articles.ts` (31 slugs), `apps/web/src/data/blog-article-rewrites.json` (9 slugs en base), `apps/web/src/lib/seo-redirects.data.cjs` (13 anciens slugs redirigés en 301/308), `docs/copy/brand-voice.md`, `docs/copy/landings-s14.md`, `docs/marrant/decisions-s14.md`.
**Limites assumées :** aucune donnée de volume ni de difficulté disponible pour ce niche : toute la priorisation est qualitative (intention, faiblesse apparente de la SERP, fit marque, saisonnalité). Volumes : `[À MESURER : Search Console + Bing Webmaster à J+14 après la 1re publication]`. Les SERP ont été consultées le 30/09/2026 par WebSearch (types de pages seulement, aucun nom de concurrent repris ici).

---

## 1. À écrire en premier : 3 articles à fort potentiel + l'ÉTALON

**Critère de potentiel (qualitatif) :** demande saisonnière ou récurrente plausible × SERP faible sur l'angle « humour et répartie » × fit marque (persona principal ou secondaires) × possibilité d'un élément first-hand (réparties et vannes originales validées par le Stand-Up Director, barre « Alexa » du 30/09).

| Rang | Article (semaine) | Pourquoi il passe en premier |
|---|---|---|
| 1 (**ÉTALON**) | S8 · `repas-de-famille-questions-genantes-humour` (23/11) | Pic de demande Noël, SERP occupée par des pages « bien-être / phrases pour foutre la merde » qui n'enseignent pas la répartie ; le site a une réponse structurée (technique + réponse drôle + plan B). Fit direct avec le thème Famille et `/blague-du-jour`. |
| 2 | S2 · `se-presenter-avec-humour` (12/10) | Evergreen (rentrée, nouveau job, asso, tour de table), fort pour Yanis et Sophie, SERP faite de coaching et de bios de sites de rencontre : un guide oral, court, avec avant/après, manque. Résout aussi l'orphelin `etre-plus-a-l-aise-en-societe` (P2-8). |
| 3 | S9 · `toast-drole-discours-qui-fait-rire` (30/11) | Intention forte (besoin daté : Noël, anniversaire, mariage 2027), SERP dominée par des modèles de mariage à recopier ; un guide de structure appliqué à un repas de famille est peu servi. Résout l'orphelin `citation-drole`. |

**Contrainte de calendrier hors classement :** S1 Halloween (`blagues-halloween-soiree-deguisee`, 05/10) a une échéance dure (Halloween = samedi 31/10). Je ne le mets pas dans le top 3 de potentiel : la SERP est saturée de blagues classiques et de pages pour enfants (à contre-courant de la règle fondateur « vannes déjà connues = faibles »), donc le gain vient de l'angle « adultes + vannes originales », à difficulté élevée.

### Pourquoi S8 est l'étalon (et pas Halloween ni S2)
1. **Représentatif :** 10 articles sur 13 sont des guides « situation, techniques, réponses prêtes, FAQ » (même gabarit que `repartie-soiree-anti-malaise`). Valider S8, c'est valider le gabarit de 10 articles.
2. **Il teste ce que Thomas juge le plus dur :** la qualité des réparties originales (barre Alexa) sans complaisance, pas seulement la structure.
3. **Il porte GEO + SEO complets :** réponse directe en tête, H2 en questions, liste numérotée, FAQ 5 questions, maillage vers le thème Famille, le parcours et 2 articles.
4. **Sa date de publication (23/11) laisse de la marge :** on peut le retoucher sans pression.

**Séquence proposée (parallélisation IA, plan par dépendances) :**
1. Aujourd'hui : @copywriter écrit l'étalon S8 + Halloween S1 en parallèle (S1 seul a une échéance à 5 jours) ; Stand-Up Director valide les vannes/réparties (score ≥ 9/10).
2. Thomas valide l'étalon (grille en §5) : cible 02/10.
3. Dès validation : production des 11 autres en parallèle (mêmes gates), puis planification de publication.
4. **Repli si S1 n'est pas validé au 03/10 :** décaler S1 au 12/10 et avancer S2 au 05/10 (Halloween garde 19 jours d'avance, acceptable).

---

## 2. Règles appliquées à tout le calendrier

- **1 page = 1 cluster = 1 intention.** Aucun slug existant réutilisé, aucun des 13 anciens slugs redirigés (`devenir-marrant`, `techniques-repartie`, `humour-apres-rupture`, `blagues-courtes-vs-longues`, etc.) réutilisé ni ciblé en lien. Slugs sans année (pérennes, mise à jour annuelle possible).
- **Voix :** tutoiement, « vanne » dans le corps et « blague » seulement en titre/mot-clé SEO, min. 3 traits d'humour, 2 refs modernes prioritaires vérifiées (Mirabel, Fary, Frayssinet, Gardin, Dia, Pascot, Croce, Reg ; un sketch n'est cité que s'il est réel et vérifié), legacy max 1, zéro persona nommé, zéro mention d'IA comme auteur, zéro tiret cadratin, zéro concurrent nommé, auteur affiché inchangé (choix fondateur).
- **Zéro chiffre inventé :** aucun pourcentage ni étude dans ce plan ; tout chiffre prévu est listé en §4 avec `[À SOURCER]`. Seul chiffre marque réutilisable : « 15 à 20 min/semaine selon le parcours » (validé fondateur 29/09).
- **Éléments first-hand (anti « scaled content abuse ») :** chaque article contient au moins un contenu propriétaire du site (vannes ou réparties originales décryptées, avant/après, script complet), jamais une compilation.
- **Maillage :** les 3 liens de la colonne dédiée sont le socle obligatoire ; le corps de l'article en compte au moins 8 au total (seuil du validator lot 4), en ajoutant `/vannes`, `/conseils`, `/videos` et 1 à 2 articles liés. Les liens `/vannes/theme/<slug>` et `/blague-du-jour` dépendent du GO S3 du 30/09 (voir §4).
- **Format GEO standard :** bloc « En bref » avec réponse directe en tête (2-3 phrases), H2 formulés en questions, 1 liste numérotée, 2-3 blockquotes « à retenir », FAQ visible 3-5 questions (FAQPage limité au visible), pas de HowTo (P2-3), « Mis à jour le » seulement si le texte change réellement.
- **Titre de l'article ≤ 60 caractères** (comptés ci-dessous) ; à revérifier avec le suffixe si le constructeur de metadata l'ajoute.

---

## 3. Calendrier des 13 semaines

Légende intention : I = informationnelle, C = commerciale (comparaison/choix), T = transactionnelle (besoin d'un texte prêt à l'emploi). Mots-clés : principal puis 2 secondaires. Toutes les URLs sont `/blog/<slug>`.

| # | Date | Slug proposé | Titre (car.) | Mot-clé principal + 2 secondaires | Intention | Angle éditorial (2 phrases) | Maillage interne (3 liens) | Format GEO |
|---|---|---|---|---|---|---|---|---|
| 1 | Lun 05/10 | `blagues-halloween-soiree-deguisee` | Blagues d'Halloween : 8 vannes pour ta soirée déguisée (54) | **blagues halloween adultes** ; blague halloween soirée ; humour halloween déguisement | I/T (contenu à sortir) | Ici, pas de squelettes sans peau ni de vampires de comptoir : 8 vannes originales pour adultes, chacune avec sa chute et son décryptage. On explique aussi pourquoi l'humour et la peur se ressemblent (tension puis relâchement), avec la manière de sortir une vanne quand tout le monde est déguisé. | `/blog/repartie-soiree-anti-malaise` · `/vannes/theme/soirees` · `/blague-du-jour` | **En bref :** « Quelles blagues d'Halloween sortir entre adultes ? » (réponse + les 8). FAQ 4 : blagues sans être macabre ? ; sortir une vanne en costume ? ; pourquoi rit-on quand on a peur ? `[À SOURCER]` ; vanne pour un inconnu déguisé ? |
| 2 | Lun 12/10 | `se-presenter-avec-humour` | Se présenter avec humour : 5 accroches qui passent (50) | **se présenter avec humour** ; présentation drôle tour de table ; phrase d'accroche drôle présentation orale | I | On ne donne pas des phrases à recopier : on montre comment bâtir une présentation courte autour d'un détail vrai et ordinaire, avec 5 accroches avant/après (tour de table, premier jour, groupe d'inconnus). Le seul angle traité est l'oral en rentrée, pas la bio de site de rencontre. | `/blog/etre-plus-a-l-aise-en-societe` · `/blog/autoderision-interactions` · `/parcours/confiance` | **En bref :** « Comment se présenter avec humour ? » (formule en 3 temps). Liste numérotée des 5 accroches. FAQ 4 : quoi dire si on est timide ? ; humour au premier jour de boulot ? ; que faire si personne ne rit ? ; faut-il préparer sa phrase ? |
| 3 | Lun 19/10 | `humour-en-colocation-desamorcer-tensions` | Coloc : désamorcer les tensions avec l'humour (45) | **humour en colocation** ; désamorcer une dispute en coloc ; blague de coloc | I | La coloc est le terrain d'entraînement idéal de la répartie : mêmes personnes, mêmes vaisselles, mêmes conflits minuscules. 5 situations (vaisselle, bruit, frigo, ménage, colocs qui ne se parlent plus), avec la phrase qui détend et celle qui envenime, sans jamais rire de l'autre. | `/blog/humour-quotidien-8-habitudes` · `/blog/repondre-moqueries-avec-humour` · `/vannes/theme/autoderision` | **En bref :** « Comment désamorcer une tension en coloc avec humour ? ». Tableau « ça détend / ça envenime ». FAQ 4 : rire d'un colocataire sans le vexer ? ; quand l'humour est-il déplacé ? ; réagir au mail passif-agressif ? ; comment reparler après une dispute ? |
| 4 | Lun 26/10 | `blagues-sur-l-ia-assistants-vocaux` | Blagues sur l'IA : 6 vannes sur nos assistants vocaux (53) | **blagues sur l'IA** ; blague ChatGPT ; blague assistant vocal Alexa Siri | I | Assistant vocal qui comprend tout de travers, chatbot trop poli, écran qui suggère ce qu'on cherche : la techno du quotidien est une mine d'observation, et on en tire 6 vannes originales avec décryptage. Au lieu d'empiler des blagues de robots, on explique comment fabriquer une vanne tech en partant d'une situation que tout le monde a vécue. | `/vannes/theme/gaming` · `/blog/blague-drole-7-criteres-pepite` · `/blague-du-jour` | **En bref :** « Comment faire une bonne blague sur l'IA ? » (3 ressorts). FAQ 3 : pourquoi les blagues d'IA sont-elles souvent plates ? ; peut-on rire d'un assistant sans passer pour un geek ? ; où trouver des vannes tech qui n'ont pas 10 ans ? |
| 5 | Lun 02/11 | `humour-en-visio-reunion-en-ligne` | Humour en visio : faire rire à travers un écran (47) | **humour en visio** ; blague en visioconférence ; faire rire en réunion Teams | I | La visio a ses propres ressorts : micro coupé, décalage, caméra éteinte, chat qui remplace le rire. On donne 5 ressorts qui n'existent qu'à l'écran (ouverture, attente, panne, chat, fin) et pourquoi le timing d'une chute change quand personne ne rit en direct. | `/blog/blagues-travail-faire-rire-pro` · `/vannes/theme/boulot` · `/parcours/machine-a-cafe` | **En bref :** « Peut-on faire de l'humour en visio ? Oui, avec 3 adaptations ». FAQ 4 : blague en visio sans être entendu ? ; humour dans le chat ? ; que faire si la chute tombe dans le silence ? ; caméra éteinte, comment faire rire ? |
| 6 | Lun 09/11 | `chambrer-sans-blesser-entre-potes` | Chambrer sans blesser : 5 règles entre potes (44) | **chambrer sans blesser** ; chambrage entre potes ; comment chambrer quelqu'un | I | Le chambrage est l'humour d'amitié le plus pratiqué et le moins expliqué : une définition, 5 règles (cible, public, réversibilité, fréquence, signal d'arrêt) et des exemples avec ce qui passe et ce qui blesse. On le traite comme une compétence de répartie offensive et bienveillante, pas comme un permis de vanner. | `/blog/repondre-moqueries-avec-humour` · `/blog/humour-noir-utiliser-sans-blesser` · `/parcours/repartie` | **En bref + Définition :** « Chambrer, c'est… » (bloc citable). FAQ 4 : où est la limite ? ; chambrer quelqu'un qu'on connaît peu ? ; comment réagir quand on se fait chambrer trop ? ; chambrer en groupe mixte ? |
| 7 | Lun 16/11 | `soiree-de-noel-entreprise-humour` | Soirée de Noël au boulot : rester drôle sans déraper (52) | **soirée de Noël au travail** ; pot de fin d'année collègues ; afterwork de Noël quoi dire | I | Le pot de fin d'année est le seul moment où le boulot autorise la légèreté, et celui où une vanne mal calibrée reste dans les têtes jusqu'en janvier. Un plan par moments (arrivée, discussion avec la direction, Secret Santa, verre de trop, départ) avec des phrases prêtes et la ligne rouge. | `/blog/blagues-travail-faire-rire-pro` · `/blog/conversation-machine-a-cafe` · `/vannes/theme/boulot` | **En bref :** « Comment rester drôle à la soirée de Noël de l'entreprise ? » (règle des 3 zones). FAQ 4 : blague à la direction ? ; que dire au Secret Santa ? ; rater sa vanne devant l'équipe ? ; quoi répondre au collègue qui a trop bu ? |
| 8 | Lun 23/11 | `repas-de-famille-questions-genantes-humour` | Repas de famille : répondre aux questions gênantes (50) | **questions gênantes repas de famille** ; répondre avec humour question gênante Noël ; réponse drôle « t'as quelqu'un ? » | I | « Alors, t'as quelqu'un ? », « Et le boulot, ça avance ? » : on classe les 6 questions que tout le monde reçoit à Noël et on donne pour chacune 2 réparties drôles qui désamorcent sans froisser, plus un plan B si ça insiste. Principe propre au site : on rit de la situation, jamais de la personne qui pose la question. | `/vannes/theme/famille` · `/blog/jamais-quoi-repondre-techniques` · `/blog/comment-avoir-de-la-repartie` | **En bref :** « Comment répondre avec humour aux questions gênantes en famille ? » (3 gestes). Liste numérotée des 6 questions. FAQ 5 : répondre sans vexer tata ? ; question sur la vie amoureuse ? ; quand l'humour ne suffit pas ? ; belle-famille au 1er Noël ? ; rester calme quand ça insiste ? |
| 9 | Lun 30/11 | `toast-drole-discours-qui-fait-rire` | Toast drôle : la structure d'un discours qui fait rire (54) | **toast drôle** ; discours drôle repas de famille ; faire un toast humoristique | T/I | Un toast drôle n'est pas un mini stand-up : on montre la structure (accroche, anecdote, retournement, chute, verre levé) puis on l'applique à un exemple complet écrit de zéro pour un repas de famille. Règle de public mixte : ce qui fait rire l'oncle et la petite cousine en même temps. | `/blog/storytelling-drole-5-structures` · `/blog/timing-humour` · `/blog/citation-drole` | **En bref :** « Comment faire un toast drôle ? » (structure en 5 temps). Exemple complet en blockquote. FAQ 4 : durée idéale ? `[À SOURCER si chiffrée]` ; blague sur quelqu'un de la famille ? ; improviser un toast ? ; comment gérer le trac ? |
| 10 | Lun 07/12 | `faire-rire-un-enfant-repas-de-fete` | Faire rire un enfant : 6 idées pour les repas de fête (53) | **faire rire un enfant** ; faire rire ses neveux ; humour avec les enfants | I | Faire rire un enfant demande d'oublier ses réflexes d'adulte : le décalage physique, la répétition et la fausse erreur marchent, le second degré non. 6 idées testables pendant un repas de fête, avec ce qui rate et sans blague toute faite. | `/vannes/theme/famille` · `/blog/comment-improviser-des-blagues` · `/blog/5-types-humour-lequel-pour-toi` | **En bref :** « Comment faire rire un enfant ? » (3 ressorts). FAQ 4 : à quel âge comprend-il l'ironie ? `[À SOURCER]` ; une blague qui marche à tout âge ? ; un enfant qui ne rit pas ? ; faire rire une table de cousins d'âges différents ? |
| 11 | Lun 14/12 | `jeux-de-repartie-soiree-nouvel-an` | Nouvel An : 6 jeux de répartie pour une soirée drôle (52) | **jeux de répartie** ; jeux soirée nouvel an sans matériel ; jeux pour rire entre amis | I/T | 6 jeux sans matériel qui entraînent la répartie sans en avoir l'air : chacun a sa règle en 2 lignes, un exemple de partie et ce qu'il travaille (rebond, timing, autodérision). Là où les listes de jeux se ressemblent, celle-ci relie chaque jeu à une compétence et au parcours Répartie. | `/blog/repartie-soiree-anti-malaise` · `/blog/exercices-developper-humour` · `/vannes/theme/soirees` | **En bref :** « Quels jeux de répartie pour une soirée du Nouvel An ? » (les 6 en liste numérotée). FAQ 4 : jeux sans matériel pour 4 à 10 personnes ? ; un jeu pour un groupe qui ne se connaît pas ? ; quand arrêter un jeu ? ; adapter aux timides ? |
| 12 | Lun 21/12 | `etre-drole-sans-alcool-soiree` | Être drôle sans alcool en soirée : 6 pistes (43) | **être drôle sans alcool** ; s'amuser en soirée sans boire ; ambiance soirée sans alcool | I | Ne pas boire ne rend pas moins drôle, mais retire le filet de désinhibition : on explique par quoi le remplacer (observation, rôle dans le groupe, phrase d'entrée) et comment répondre à « tu bois pas ? » avec légèreté. Ton sans morale ni discours santé, uniquement des outils de conversation. | `/blog/avoir-confiance-en-soi-grace-a-l-humour` · `/blog/rester-muet-en-groupe` · `/vannes/theme/soirees` | **En bref :** « Peut-on être drôle sans alcool ? Oui, voici quoi mettre à la place ». FAQ 4 : répondre à « tu bois pas ? » ? ; se lâcher sans alcool ? ; soirée où tout le monde boit ? ; janvier sobre : comment tenir les soirées ? |
| 13 | Lun 28/12 | `resolution-nouvelle-annee-etre-plus-drole` | Résolution 2027 : être plus drôle sans pression (47) | **résolution être plus drôle** ; bonnes résolutions 2027 sociales ; objectif humour nouvelle année | I | On transforme « être plus drôle » en habitude de quelques minutes, avec un suivi sur 4 semaines et un renvoi vers un parcours de 15 à 20 minutes par semaine. Ici on parle d'objectif et de régularité, pas de technique : les techniques restent sur le guide pilier. | `/blog/comment-devenir-drole` · `/blague-du-jour` · `/parcours/repartie` | **En bref :** « Comment tenir la résolution d'être plus drôle ? » (règle « petit, daté, suivi »). FAQ 4 : par où commencer ? ; que faire si on rate une semaine ? ; combien de temps par jour ? ; comment mesurer qu'on progresse ? |

---

## 4. Justification anti-cannibalisation (sujet par sujet)

Base de comparaison : les 34 articles actifs (25 statiques hors redirigés + 9 en base), les H2 des articles statiques (relus dans `blog-articles.ts`) et les mots-clés par page de `keywords.md`. Les 9 articles en base ne sont comparés que par slug et titre : **le brief de rédaction doit inclure un relevé de leurs H2 avant écriture**. Risque : faible / moyen / élevé.

| # | Sujet | Articles existants proches | Pourquoi pas de cannibalisation | Garde-fou |
|---|---|---|---|---|
| 1 | Halloween | `meilleures-blagues-droles-2026` (page n°1, requête générique « blagues drôles »), `repartie-soiree-anti-malaise` | Requête saisonnière distincte de « blagues drôles » ; aucune des 8 vannes n'est reprise de la page n°1 | Aucun changement de la page n°1 (slug intouchable) ; vannes 100 % originales. Risque faible |
| 2 | Se présenter | `conversation-machine-a-cafe` (H2 « nouveau collègue » : accueillir), `autoderision-interactions`, `etre-plus-a-l-aise-en-societe` (guide large) | Se présenter soi-même à l'oral dans un moment codifié : mot-clé absent des 3 pages | Exclure les requêtes « accroche site de rencontre » (intention dating, hors périmètre). Risque faible |
| 3 | Coloc | `humour-quotidien-8-habitudes`, `repondre-moqueries-avec-humour` | Aucune page ne traite la colocation ni la désescalade de conflit | Ne pas viser « moqueries » (page existante). Risque faible |
| 4 | IA et assistants | `blague-drole-7-criteres-pepite` (critères d'une blague), `meilleures-blagues-droles-2026` | Sujet techno inexistant sur le site ; `/vannes/theme/gaming` reste la page catalogue, l'article est un guide + 6 vannes | Ne pas redéfinir « ce qui fait une bonne blague » (déjà en base) : lien à la place. Risque faible |
| 5 | Visio | `blagues-travail-faire-rire-pro` (zone 2 réunion, zone 4 emails/Slack) | Recouvrement partiel : l'existant traite la réunion en général, celui-ci la spécificité de l'écran (micro, décalage, chat) | Ne pas cibler « blagues au travail » ni « humour en réunion » (kw de l'existant) ; lien vers zone 4 plutôt que redite. **Risque moyen, suivi GSC** |
| 6 | Chambrer | `repondre-moqueries-avec-humour` (côté cible), `humour-noir-utiliser-sans-blesser`, `comment-faire-rire-un-homme` (chambrage = 1 H2 sur 6) | Guide complet côté émetteur ; « chambrer » absent des titres existants | Ne pas cibler « faire rire un homme ». Si `comment-faire-rire-un-homme` perd des impressions sur « chambrer » : ajuster. **Risque moyen** |
| 7 | Soirée de Noël au boulot | `blagues-travail-faire-rire-pro` (H2 afterwork), `conversation-machine-a-cafe` | Événement annuel précis (direction, Secret Santa, alcool) absent des existants | « afterwork » seulement en secondaire. **Risque moyen, saisonnier** |
| 8 | Questions gênantes en famille | `meilleures-blagues-droles-2026` (H2 « vannes en famille »), `jamais-quoi-repondre-techniques`, `repondre-moqueries-avec-humour` | Interlocuteurs bienveillants mais intrusifs, contexte Noël : ni moqueries ni « blocage » | Ne pas reprendre les « 5 réponses automatiques » (lien) ; ne pas cibler « vannes en famille ». Risque faible |
| 9 | Toast | `storytelling-drole-5-structures`, `comment-raconter-une-blague-sans-la-rater`, `timing-humour` | Format discours devant un public mixte, intention T ; mot-clé absent | Lien vers storytelling au lieu de redire les 5 structures. Risque faible |
| 10 | Enfants | Aucun | Sujet non traité | Ne pas dériver vers « blagues pour enfants » (SERP hors cible 20-35). Risque nul |
| 11 | Jeux de répartie | `repartie-soiree-anti-malaise` (situation 5 : soirée qui s'essouffle), `exercices-developper-humour` | Jeux collectifs datés Nouvel An vs exercices solo/duo | Ne pas cibler « exercices répartie » (kw de `/conseils` et de l'article). Risque faible |
| 12 | Sans alcool | `timidite-et-humour`, `rester-muet-en-groupe`, `repartie-soiree-anti-malaise` | Aucune ne traite l'alcool ni la désinhibition | « timide » jamais en primaire. Risque faible |
| 13 | Résolution | `comment-devenir-drole` (H2 « en 30 jours »), `exercices-developper-humour`, accueil (kw « devenir drôle », cf. P1-7) | Intention « objectif / habitude » du 28/12 au 15/01, pas « comment devenir drôle » | « devenir drôle » absent du H1 et du slug ; lien vers le pilier avec cette ancre pour lui laisser le mot-clé. **Risque élevé, le plus surveillé** |

---

## 5. Grille de validation de l'ÉTALON (S8) pour Thomas

À valider avant de produire les 12 autres (itération jusqu'à 10/10 puis pilotage automatique, cap 2 cycles) :
1. **Voix :** pote drôle, tutoiement, au moins 3 traits d'humour, jamais moralisateur.
2. **Réparties originales :** chacune au niveau de la barre Alexa (chute non télégraphiée, courte, logique) ; toute réplique déjà vue sur d'autres pages est remplacée.
3. **Cible :** on rit de la situation, jamais de la personne ; aucune moquerie sur un membre de la famille.
4. **Structure GEO :** « En bref » citable, H2 en questions, liste numérotée, FAQ 5 questions visibles, sources citées si une affirmation l'exige.
5. **Format :** 1 400 à 1 800 mots (fenêtre du validator : 1 000 à 2 500), au moins 8 liens internes dont le socle de 3.
6. **Interdits :** 0 tiret cadratin, 0 concurrent, 0 mention d'IA, 0 chiffre non sourcé, 0 persona nommé.
7. **Preuve de mesure (règle P0 s11) :** le rapport @copywriter donne mots, H2, liens et FAQ mesurés par script, pas déclarés.

## 6. Dépendances et points d'attention

1. **Pages S3 pas encore en ligne.** `/blague-du-jour` et `/vannes/theme/*` ont le GO du 30/09 (`decisions-s14.md`, S3) et un texte prêt (`landings-s14.md`), mais aucune route n'existe dans `apps/web/src/app` au 30/09. Règle : aucun article ne publie un lien vers une URL non live ; repli `/vannes`. Les thèmes `couple` et `dating` ne sont pas utilisés au Q4 (Saint-Valentin = Q1 2027).
2. **Publication planifiée (@fullstack).** Articles préparés à l'avance, publiés à date fixe sans cron de génération : `lastModified` du sitemap = date réelle de publication (stable, exigence Bing), ping IndexNow le jour J. Prérequis : corriger P1-4 (fichier clé alternatif incohérent) et P2-5 (POST non authentifié). Existence d'un mécanisme de date de publication future : `[À VÉRIFIER @fullstack]`. Tout changement de code est à consigner dans `REPLIT_ACTIONS.md`.
3. **P0-1 (audit SEO).** Tant que `/blog` reste en « Chargement des articles… », les 13 nouveaux articles restent invisibles pour Bing et sans lien interne. Correctif @fullstack avant le 05/10 souhaitable.
4. **Orphelins P2-8 résolus par le calendrier :** `etre-plus-a-l-aise-en-societe` (S2), `citation-drole` (S9), `comment-improviser-des-blagues` (S10), `avoir-confiance-en-soi-grace-a-l-humour` (S12).
5. **Bing :** mot-clé exact dans title + H1 + 1er paragraphe pour chacun des 13 ; canonical absolu ; OG 1200×630 par article ; post de lancement le lundi par @social (signaux sociaux, voix compte = marque).
6. **Chiffres à sourcer (rien n'est chiffré dans ce plan) :** S1 explication tension/relâchement (2 sources minimum) ; S4 toute étude sur les blagues répétées par les assistants (vue dans la SERP, non reprise) ; S9 durée idéale d'un toast ; S10 âge de compréhension de l'ironie ; S12 toute affirmation sur alcool et désinhibition ; S13 taux d'abandon des résolutions. Tous `[À SOURCER]` : sans source datée, formulation qualitative, pas de chiffre.

## 7. Maillage bidirectionnel entre les 13 (à la publication, par mise à jour réelle du texte)

- Soirées : S1 <-> S11 <-> S12 <-> S6. Fêtes en famille : S8 <-> S9 <-> S10.
- Pro : S5 <-> S7 <-> S2. Quotidien : S3 <-> S6 <-> S2. Vannes originales : S1 <-> S4.
- S13 reçoit un lien de chaque article du dernier mois et renvoie au pilier et aux parcours. Profondeur : accueil, `/blog`, article (2 clics, sous réserve de P0-1).

## 8. Banc de touche (ajustements mensuels « actualité », décision du 30/09)

Slots souples : S4 et S13. Réserves sans cannibalisation avérée : `voeux-drole-nouvelle-annee` (à publier avant le 20/12 sinon inutile ; recoupe l'H2 WhatsApp de `phrases-droles-conversations`, risque moyen), `discours-pot-de-depart-drole` (proche de S9, à décider après ses premières données), `rire-de-l-actu-sans-blesser` (sujet d'actualité, aucun existant).

## 9. Mesure

KPI = impressions, positions, part de clics ET présence dans les réponses IA (pas le seul trafic). Indexation vérifiée à J+3 (Search Console + Bing) ; volumes réels à J+14 ; décision renforcer/consolider à J+30. @geo ajoute 4 prompts de suivi (questions gênantes en famille, se présenter avec humour, toast drôle, jeux de répartie). Articles saisonniers à mettre à jour réellement en septembre 2027 avant réutilisation.

---

**Handoff → @orchestrator (puis @copywriter, @fullstack, @geo, @social)**
- Fichier produit : `/home/user/Marrant/docs/seo/calendrier-editorial-q4-2026.md`.
- Décisions prises : 13 sujets, 13 mots-clés principaux distincts, aucun slug existant ni redirigé ; étalon = S8 ; top 3 = S8, S2, S9 ; S1 Halloween produit en parallèle (échéance dure) avec repli au 12/10.
- Points d'attention : pages S3 non live ; relevé des H2 des 9 articles en base avant brief ; cannibalisation surveillée sur S13 (élevé), S5, S6, S7 (moyen) ; P0-1 à corriger ; double optimisation SEO+GEO (FAQ visibles, blocs « En bref », pas de HowTo). SERP consultées le 30/09 : pages de conseils bien-être, sites de modèles de discours, listes de jeux, pages de blagues classiques (types, sans noms).

## 10. Résumé (10 lignes)

1. 13 articles, lundis du 05/10 au 28/12, tous en nouveaux slugs pérennes (sans année), 13 mots-clés principaux distincts.
2. Saisonnalité couverte : Halloween (S1), rentrée (S2, S3), hiver pro (S5, S7), fêtes en famille (S8, S9, S10), Nouvel An (S11, S12), résolutions (S13).
3. Top 3 à fort potentiel : S8 repas de famille, S2 se présenter avec humour, S9 toast drôle.
4. ÉTALON : S8 (représentatif de 10 articles sur 13, teste la barre des réparties originales), à valider par Thomas avant les 12 autres.
5. Halloween (échéance 31/10) est produit en parallèle ; repli : décaler au 12/10 si non validé au 03/10.
6. Cannibalisation : risque élevé sur S13 (mot-clé « devenir drôle » réservé au pilier), moyen sur S5, S6, S7, faible ailleurs.
7. Aucun chiffre dans le plan ; 6 points marqués `[À SOURCER]` ; volumes de recherche `[À MESURER]` (niche, aucune donnée).
8. Chaque article porte un élément first-hand (vannes ou réparties originales validées par le Director) : pas de risque « scaled content abuse ».
9. Dépendances : `/blague-du-jour` et `/vannes/theme/*` non live, publication planifiée + IndexNow (P1-4), P0-1 sur `/blog`.
10. 4 articles orphelins (P2-8) reçoivent un lien entrant via S2, S9, S10 et S12 ; 3 sujets de réserve prêts pour les ajustements mensuels.

