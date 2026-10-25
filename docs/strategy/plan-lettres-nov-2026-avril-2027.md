# Plan des lettres du 05/11/2026 au 01/04/2027 : audit jeudi par jeudi et plan corrigé

> **Correction de l'orchestrateur (25/10), point E9** : les deux faits sont vérifiés, pages ouvertes : Next (next.ink), article « Bref. L'intégrale disponible sur YouTube » daté du 16 octobre 2017 ; PureBreak, 12 février 2014 : « Les deux humoristes viennent d'ailleurs de mettre en ligne leur dernier bébé : Les monos de ski ». E9 est levé, rien à changer dans W47 ni W51.

**Date** : 25/10/2026 · **Auteur** : @creative-strategy · **Statut** : audit et propositions pour Thomas. Aucun texte de lettre réécrit ici, aucun autre fichier modifié, rien commité.
**Cadre** : décisions de Thomas du 25/10 (`docs/founder-preferences.md`, 6 dernières lignes : lettre du mois = une des lettres des abonnés, formats A et B, toutes les lettres au niveau des réservées, barre 9/10, audit du plan avant lecture).
**Sources lues** : `project-context.md`, `apps/web/src/data/lettre/numeros.json`, `apps/web/src/data/lettre/hebdo-premium.json`, `docs/copy/lettres-du-mois-s22-a-lire.md`, `docs/copy/lettres-reservees-nov-dec-s22-a-lire.md`, `docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md`, `docs/growth/articles-forte-frappe-s14.md`, fiches des articles (`docs/copy/articles-q4/`, `docs/copy/articles-forte-frappe/`), `docs/seo/calendrier-editorial-q4-2026.md`, `apps/web/src/config/parcours-etapes.ts`.
**Faits externes vérifiés par WebSearch le 25/10** : vacances scolaires 2026-2027, soldes d'hiver 2027, Tournoi des Six Nations 2027, Bref et Palmashow (détail en § 3, E9).

## 1. Ce qu'il faut retenir

- Les 22 jeudis du 05/11 au 01/04 : **6 lettres du mois** (05/11, 03/12, 07/01, 04/02, 04/03, 01/04), **7 lettres réservées écrites** (12/11 au 31/12) et **9 jeudis sans aucune lettre** (14/01, 21/01, 28/01, 11/02, 18/02, 25/02, 11/03, 18/03, 25/03).
- Les trois points de l'orchestrateur sont **exacts** (E1 à E3, avec des aggravants). Je relève **onze points de plus** (E4 à E14), dont quatre de gravité P1 : redites de ressort (E4), contextes déséquilibrés (E5), articles manquants (E7), et surtout `numeros.json` qui porte encore l'ancien format (E8), c'est-à-dire que le n°1 refusé par Thomas partirait tel quel si le fichier n'est pas remplacé.
- Correction proposée en une phrase : le n°1 devient la lettre déjà validée « T'as perdu ta langue ? » (cœur du problème, de saison, prête), le n°5 et le n°6 échangent leurs dates, deux articles sont ajoutés aux lettres qui n'en avaient pas, **10 lettres réservées sont à écrire** (12/11 et les 9 jeudis de 2027), dont **un décryptage d'humoriste par mois (3e jeudi)**.
- Le plus urgent : le texte final du n°1 doit être dans le prochain déploiement (avant le 05/11 8 h). Date limite d'écriture du n°1 : **mercredi 28/10** ; autres retouches du lot 0 : **vendredi 30/10** (§ 7).

## 2. Tableau jeudi par jeudi (état actuel et verdict)

Flux : M = lettre du mois (tout le monde) · R = réservée Premium. Verdicts : GARDER, DÉPLACER, RÉÉCRIRE, À ÉCRIRE.

| Date | Flux | Situation actuelle | Verdict | Raison |
|---|---|---|---|---|
| Jeu 05/11 | M n°1 | Soirée de Noël de la boîte, karaoké (« Allez, une chanson ! ») | **RÉÉCRIRE** | Noël à 5 à 6 semaines des soirées de boîte (mi-décembre) et 7 semaines du 24/12 ; la scène (chanter) n'est pas le cœur du problème de Yanis. |
| Jeu 12/11 | R W46 | « T'as perdu ta langue ? », salon de coloc sous la pluie | **DÉPLACER** (devient le n°1) | Texte validé, cœur du problème, de saison ; le créneau 12/11 est ensuite **À ÉCRIRE**. |
| Jeu 19/11 | R W47 | Décryptage de « Bref » (format B), le lundi à la machine à café | GARDER | Évergreen, jeudi suivant le 12/11 sans redite ; un fait à vérifier (E9). |
| Jeu 26/11 | R W48 | Visio : « Tu as du linge qui sèche derrière toi ? » | GARDER | Évergreen, bon retour d'exercice sur W47 ; deux lettres boulot de suite mais A après B. |
| Jeu 03/12 | M n°2 | Pull tricoté main, « Alors, il te plaît ? » | GARDER | Annonce l'événement (« le 25 au matin »), 22 jours d'avance, article repas de famille publié le 23/11. |
| Jeu 10/12 | R W50 | « Une tisane ? À un premier rendez-vous ? » | GARDER | Seule lettre dating de l'hiver, pas de thème Noël, week-end qui suit plausible. |
| Jeu 17/12 | R W51 | Palmashow, « Les monos de ski » (format B), chalet | GARDER | Samedi 19/12 = 1er jour des vacances de Noël pour les 3 zones [début à reconfirmer au calendrier officiel] ; un fait à vérifier (E9). |
| Jeu 24/12 | R W52 | Question de tonton à table, « Et tu feras quoi, plus tard ? » | GARDER | Envoyée le matin même ; aucune réplique reprise de l'article lié par le n°2 (vérifié). |
| Jeu 31/12 | R W53 | Réveillon, « T'es resté dans la cuisine toute la soirée ! » | GARDER | Envoyée le matin même ; comptes de mots vérifiés (4, 7, 13). |
| Jeu 07/01 | M n°3 | Premier dîner de l'année, les résolutions d'Axel | GARDER + AJOUTER l'article | Saison exacte ; manque le lien article (E7) : `resolution-nouvelle-annee-etre-plus-drole`, publié le 28/12. |
| Jeu 14/01 | R | Aucune | **À ÉCRIRE** | Promesse « chaque jeudi » rompue (E3). |
| Jeu 21/01 | R | Aucune | **À ÉCRIRE** (format B) | Idem ; 3e jeudi = décryptage. |
| Jeu 28/01 | R | Aucune | **À ÉCRIRE** | Idem. |
| Jeu 04/02 | M n°4 | Réservation oubliée pour le 14/02 | GARDER | « Dans dix jours » est exact (14/02/2027 = dimanche, 13/02 = samedi) ; article couple publié le 05/11. |
| Jeu 11/02 | R | Aucune | **À ÉCRIRE** | Idem. |
| Jeu 18/02 | R | Aucune | **À ÉCRIRE** (format B) | Idem ; 3e jeudi. |
| Jeu 25/02 | R | Aucune | **À ÉCRIRE** | Idem. |
| Jeu 04/03 | M n°5 | « Message du 1er avril : vrai ou canular ? » | **DÉPLACER** (vers le 01/04) | Une lettre sur le 1er avril, 4 semaines avant, ne sert à personne le jour J. |
| Jeu 11/03 | R | Aucune | **À ÉCRIRE** | Idem. |
| Jeu 18/03 | R | Aucune | **À ÉCRIRE** (format B) | Idem ; 3e jeudi. |
| Jeu 25/03 | R | Aucune | **À ÉCRIRE** | Idem. |
| Jeu 01/04 | M n°6 | Fête où tu ne connais que l'hôte (« un samedi de printemps ») | **DÉPLACER** (vers le 04/03) | Libère le 01/04 pour le canular, le jour même ; « samedi de mars » au lieu de « printemps ». |

## 3. Erreurs relevées

Gravité : P0 = faux à l'envoi, P1 = rompt la promesse ou la cohérence, P2 = à corriger avant lecture par Thomas, P3 = confort. « Vue ? » = relevée par l'orchestrateur avant mon audit.

| # | Gravité | Vue ? | Erreur | Détail et correction |
|---|---|---|---|---|
| E1 | P0 | Oui (a) | n°1 à contretemps | Noël en novembre. **Plus grave que vu** : même à la bonne date, karaoké et directeur ne sont pas le cœur du problème (« rester muet quand on se chambre »), alors que le n°1 est la première impression. Correction : § 5. |
| E2 | P0 | Oui (b) | n°5 et n°6 à l'envers | Le canular part le 04/03 pour un 1er avril à 4 semaines ; la lettre du 01/04 parle d'autre chose. Échanger les deux (§ 4). Le n°6 devient le jour même : « Aujourd'hui, c'est le 1er avril », scène à 8 h 02, lettre envoyée à 8 h 00. |
| E3 | P0 | Oui (c) | 9 jeudis sans lettre | 14/01 au 25/03. Pire : **le PS de chaque lettre du mois promet « une lettre chaque jeudi »** et la page /abonnement la ligne « une lettre chaque semaine » : faux dès le 14/01. 10 lettres à écrire (§ 6), lots et dates limites (§ 7). |
| E4 | P1 | **Non** | Redites de ressort et d'erreur | « L'erreur que tout le monde fait » = s'excuser ou s'expliquer dans **4 lettres sur 11** (n°1 « inventer une excuse », W46 « s'expliquer », n°4 « trop d'excuse », n°6 « s'excuser de déranger »). Ressort « un objet ou un organe reçoit un statut officiel » dans **4 répliques joueuses** (n°1 voix en télétravail, W46 langue aux objets trouvés, W48 linge collègue assidu, W53 cuisine et ambassadeur). n°1 et W46 jouent en plus le **même gag à 7 jours d'écart** (voix absente, langue perdue). Le remplacement du n°1 règle le premier cas ; les 10 lettres à écrire doivent éviter les deux autres (§ 6). |
| E5 | P1 | **Non** | Contextes déséquilibrés | Novembre : 3 lettres sur 4 au boulot (n°1, W47, W48). Aucune scène d'études alors que le persona principal est étudiant. Un seul « inconnus » (n°6). Aucun contexte pour Marc. Le nouveau n°1 (amis) et un W46 d'études rééquilibrent (§ 4). |
| E6 | P2 | **Non** | Noël et recouvrement W52 / article | Avec le nouveau n°1, il reste 2 lettres Noël (03/12 et 24/12), acceptable. Mais l'article lié au n°2 (« Repas de famille ») contient « Et le boulot, ça avance ? » et « plan sur dix ans », proches du « Et tu feras quoi, plus tard ? » de W52. Aucune réplique n'est reprise (vérifié), donc garder, mais **interdire dans W52 toute réplique de l'article**. |
| E7 | P1 | **Non** | Pas d'article dans le n°3 ni le n°6 | Décision du 25/10 : la version gratuite porte « le lien vers un article ». Les n°1, 2, 4, 5 en ont un, **pas le n°3 ni le n°6**. Articles disponibles : `resolution-nouvelle-annee-etre-plus-drole` (28/12) pour le n°3 ; `se-presenter-avec-humour` (12/10) pour la fête. `datePlancher` du n°3 : `2026-12-28`. |
| E8 | P1 | **Non** | `numeros.json` porte encore l'ancien format | Les 6 corps sont en « vanne + pourquoi ça marche » (objet du n°1 : « On a comparé nos salaires »), le n°2 finit par « Rendez-vous en janvier » (faux pour un abonné qui reçoit des lettres du 10 au 31/12). Si le fichier part tel quel, le n°1 du 05/11 est celui que Thomas a refusé. **Les 6 textes finaux doivent remplacer le fichier avant le déploiement**, `datePlancher`, `periode` et `utm_content` alignés après l'échange n°5 / n°6. Retirer aussi l'entrée W46 de `hebdo-premium.json` si son texte devient le n°1 (sinon il part deux fois). |
| E9 | P2 | **Non** | Deux faits de décryptage à confirmer | W47 : « mise en ligne gratuite sur YouTube en octobre 2017 » : la source trouvée donne « le 13 octobre » **sans année**, à confirmer ou retirer l'année. W51 : « En février 2014, il met en ligne » : la seule source trouvée (TheTVDB) donne une **diffusion sur D8 le 14/02/2014**, pas une mise en ligne ; reformuler après vérification du clip. Vérifiés : premier épisode de Bref le 29/08/2011 (Canal+), 82 épisodes, Disney+ le 14/02/2025 en six épisodes d'environ 30 minutes. Règle « zéro citation non vérifiée ». |
| E10 | P2 | **Non** | Étapes de parcours inégales | Confiance cité 4 fois, Répartie é4 deux fois (W50 le 10/12 et n°5 le 01/04), Storytelling et Machine à Café une fois. Les nouvelles lettres prennent les étapes non utilisées (§ 6). |
| E11 | P3 | **Non** | Vitrine 100 % format A | Les 6 lettres du mois sont toutes « trois répliques ». Facultatif : mettre un format B au n°3 pour montrer l'étendue. Non retenu ici, à trancher par Thomas. |
| E12 | P3 | **Non** | Détails de plausibilité | W48 « Jeudi, 10 h » alors que la lettre arrive jeudi à 8 h (lu comme « aujourd'hui ») ; n°4 raconte la bourde de la veille alors que le lecteur peut encore réserver (une phrase « si tu n'as pas encore réservé, c'est aujourd'hui » serait utile). Retouches facultatives, chacune repasse l'aveugle. |
| E13 | P2 | **Non** | Dates des articles de Noël | Les fiches S5 (visio) et S7 (soirée de Noël) portent toutes deux le lundi 02/11 (S7 avancé du 16/11 pour le n°1). Une fois le n°1 changé, plus aucune lettre ne dépend de S7 : @seo décide de garder le 02/11 ou de revenir au 16/11. |
| E14 | P2 | **Non** | Technique : semaines ISO | W53 de 2026 (31/12), puis 2027-W01 (mensuelle du 07/01) et W02 à W12 pour les 9 jeudis à écrire. À faire tester par @fullstack avant d'ouvrir les envois de janvier (`lettre-planificateur-s21.test.ts`). |

## 4. Plan corrigé jeudi par jeudi

Étapes de parcours vérifiées dans `apps/web/src/config/parcours-etapes.ts` (Machine à Café 3 étapes, Répartie 4, Confiance 6, Storytelling 6, Boulot 6). Articles : tous publiés avant la date d'envoi (dates en § 4 bis). Les lettres réservées ne portent pas d'article (une étape de parcours, comme les W46 à W53 validées).

| Date | Sem. ISO | Flux et format | Contexte | Situation | Article lié | Étape liée | Statut |
|---|---|---|---|---|---|---|---|
| 05/11 | 2026-W45 | M n°1, A | Amis, coloc | « Alors, t'as perdu ta langue ? » (texte W46 validé, adapté, § 5) | `rester-muet-en-groupe` (statique) | Répartie é3 | **À ADAPTER** |
| 12/11 | 2026-W46 | R, A | Études | À écrire (§ 6, L1) | aucun | Répartie é1 | **À ÉCRIRE** |
| 19/11 | 2026-W47 | R, B | Boulot | « Bref » (inchangé) | aucun | Storytelling é1 | GARDER + E9 |
| 26/11 | 2026-W48 | R, A | Boulot, visio | Linge qui sèche (inchangé) | aucun | Boulot é1 | GARDER |
| 03/12 | 2026-W49 | M n°2, A | Famille | Pull tricoté (inchangé) | `repas-de-famille-questions-genantes-humour` (23/11) | Confiance é4 | GARDER |
| 10/12 | 2026-W50 | R, A | Dating | Tisane (inchangé) | aucun | Répartie é4 | GARDER |
| 17/12 | 2026-W51 | R, B | Amis, vacances | Palmashow (inchangé) | aucun | Confiance é5 | GARDER + E9 |
| 24/12 | 2026-W52 | R, A | Famille | Tonton (inchangé) | aucun | Boulot é5 | GARDER |
| 31/12 | 2026-W53 | R, A | Amis, réveillon | Cuisine (inchangé) | aucun | Répartie é2 | GARDER |
| 07/01 | 2027-W01 | M n°3, A | Amis | Résolutions d'Axel (inchangé) | **ajouter** `resolution-nouvelle-annee-etre-plus-drole` (28/12) | Confiance é3 | GARDER + article |
| 14/01 | 2027-W02 | R, A | Boulot | Galette des rois du service (L2) | aucun | Boulot é6 | **À ÉCRIRE** |
| 21/01 | 2027-W03 | R, **B** | selon l'humoriste | Décryptage de janvier (L3) | aucun | Storytelling é2 ou Confiance é6 | **À ÉCRIRE** |
| 28/01 | 2027-W04 | R, A | Amis | Chandeleur, crêpe ratée devant tous (L4) | aucun | Storytelling é3 | **À ÉCRIRE** |
| 04/02 | 2027-W05 | M n°4, A | Couple | Réservation oubliée (inchangé) | `blagues-de-couple-drole` (05/11) | Confiance é2 | GARDER |
| 11/02 | 2027-W06 | R, A | Amis | Soirée match du week-end 13-14/02 (L5) | aucun | Machine à Café é1 | **À ÉCRIRE** |
| 18/02 | 2027-W07 | R, **B** | selon l'humoriste | Décryptage de février (L6) | aucun | Storytelling é4 ou Confiance é2 | **À ÉCRIRE** |
| 25/02 | 2027-W08 | R, A | Voisinage | Un reproche poli dans l'escalier, « C'était vous, la musique hier ? » (L7) | aucun | Confiance é6 | **À ÉCRIRE** |
| 04/03 | 2027-W09 | M n°5 (ex n°6), A | Inconnus | Fête où tu ne connais que l'hôte, « un samedi de mars » | **ajouter** `se-presenter-avec-humour` (12/10) | Machine à Café é2 | **ÉCHANGER** + article |
| 11/03 | 2027-W10 | R, A | Boulot | Entretien annuel (L8) | aucun | Boulot é4 | **À ÉCRIRE** |
| 18/03 | 2027-W11 | R, **B** | selon l'humoriste | Décryptage de mars (L9) | aucun | Storytelling é5 ou é6 | **À ÉCRIRE** |
| 25/03 | 2027-W12 | R, A | Famille | Déjeuner de Pâques et heure d'été (L10) | aucun | Confiance é1 | **À ÉCRIRE** |
| 01/04 | 2027-W13 | M n°6 (ex n°5), A | Coloc | « Message du 1er avril » : « Aujourd'hui, c'est le 1er avril » | `blagues-poisson-d-avril-adultes` (25/02) | Répartie é4 | **ÉCHANGER** + intro |

**§ 4 bis. Dates de publication des articles cités** (fiches `docs/copy/...`, à reconfirmer en base avant le dépôt des textes) : `rester-muet-en-groupe` statique, servi (audit s20) ; `se-presenter-avec-humour` lundi 12/10/2026 ; `blagues-de-couple-drole` jeudi 05/11/2026 ; `repas-de-famille-questions-genantes-humour` lundi 23/11/2026 ; `resolution-nouvelle-annee-etre-plus-drole` lundi 28/12/2026 ; `blagues-poisson-d-avril-adultes` jeudi 25/02/2027. Toutes antérieures à l'envoi : aucun plancher n'est violé (E7 à part, qui ajoute des liens). Planchers à mettre à jour dans `numeros.json` après le plan : n°1 `null`, n°2 `2026-11-23`, n°3 `2026-12-28`, n°4 `2026-11-05`, n°5 (fête) `2026-10-12`, n°6 (canular) `2027-02-25`.

**Équilibre après correction** : formats = 17 A et 5 B (19/11, 17/12, 21/01, 18/02, 18/03, soit un B le 3e jeudi de chaque mois) ; contextes = amis 7, boulot 4, études 1, famille 3, couple et dating 2, inconnus 1, voisinage 1, plus 3 décryptages à contexte libre (les deux lettres « inconnus » ne sont plus à une semaine d'écart) ; parcours = Répartie 5, Confiance 6 (dont le décryptage de W51), Storytelling 2 (W47 et 28/01), Boulot 4, Machine à Café 2, et 3 décryptages à étape choisie selon la technique. Toutes les étapes citées existent ; Répartie é4 n'est plus citée qu'une fois par flux sur la même période (W50 le 10/12, n°6 le 01/04, quatre mois d'écart).

## 5. N°1 du 05/11 : trois situations candidates

Date de lecture : jeudi 05/11, scène du week-end suivant (07-08/11). Contexte de saison commun aux trois : retour des vacances de la Toussaint (fin le 02/11), passage à l'heure d'hiver du 25/10 (nuit vers 17 h 15), pluie et soirées à l'intérieur, saison des raclettes et des jeux de société. Écartée : les photos de la soirée d'Halloween du 31/10 (fenêtre passée le 05/11).

| | Candidate 1 (recommandée) | Candidate 2 | Candidate 3 |
|---|---|---|---|
| Scène | **« Alors, t'as perdu ta langue ? »** Samedi soir sous la pluie, huit dans le salon d'une coloc, tu n'as presque rien dit depuis une demi-heure, Hugo le remarque. Texte W46 déjà relu au niveau. | **« C'est lui, dont je t'ai parlé. Il parle pas beaucoup. »** Pendaison de crémaillère ou anniversaire : l'hôte te présente à ses amis avec l'étiquette du silencieux. Texte neuf. | **« Tu joues comme tu parles : pas un mot. »** Soirée raclette et jeux de société : le gagnant chambre ta façon de jouer, tout le monde rit. Texte neuf. |
| De saison le 05/11 | Oui : pluie, salon, coloc après la rentrée | Oui : saison des crémaillères et des retrouvailles après les vacances | Oui : raclette et jeux de société sont la sortie de novembre |
| Cœur du problème | Maximal : rester muet quand on te chambre | Fort : l'étiquette est posée par un tiers devant des inconnus | Fort : chambrage, mais sur le jeu, plus que sur le silence |
| Entrée directe dans la scène | Oui (accueil de 2 lignes puis la scène) | Oui | Oui |
| Article (publié ≤ 05/11) | `rester-muet-en-groupe` ou `repondre-moqueries-avec-humour` | `se-presenter-avec-humour` | `repondre-moqueries-avec-humour` |
| Étape | Répartie é3 (réservée Premium) | Confiance é4 | Répartie é1 |
| Effet sur W46 | Le créneau 12/11 est à réécrire (L1) | W46 reste : 2 lettres « on te chambre en soirée » à 7 jours (redite) | Idem |
| Délai | Texte prêt, adaptation courte | Écriture complète + 2 relectures | Idem |

**Reco : candidate 1.** Le texte du n°1 est celui qui a le plus de chances d'atteindre 9/10 à temps, il montre aux inconnus ce que le site vend, et le créneau libéré du 12/11 a 18 jours devant lui. Les candidates 2 et 3 sont de bonnes lettres, à garder en réserve pour les créneaux des jeudis à écrire (§ 6) si Thomas préfère un texte neuf.

**Adaptation de la candidate 1 (liste fermée, repasse l'aveugle)** : accueil du modèle des autres lettres du mois (« Si c'est ta première lettre : bienvenue… ») ; paragraphe « Notre article » avant le lien (titre de l'article entre guillemets, ce qu'il fait réellement : à relire dans sa fiche) ; étape 3 de Répartie déjà présente ; marqueurs `[[invitation-premium]]` et PS à 1,99 € ; signature « À bientôt, » à la place de « À jeudi prochain, » ; `utm_content=n1-…` ; retrait de l'entrée W46 de `hebdo-premium.json`.

## 6. Les 10 lettres réservées à écrire : cahier des charges

Chaque lettre est livrée au niveau des W46 à W53 validées (format A : scène, trois répliques sûre / joueuse / risquée, comment choisir, l'erreur que tout le monde fait, à essayer cette semaine, une étape de parcours ; format B : scène, passage, technique, trois gestes, à toi de jouer, une étape). Barre 9/10, deux relectures à l'aveugle indépendantes, lecture de l'orchestrateur, approbation de Thomas. Signature « À jeudi prochain, » vraie pour les 10 (le jeudi suivant porte toujours une lettre, mensuelle ou réservée ; pour le 25/03 le suivant est le n°6 du 01/04).

**Interdits communs, tirés des redites trouvées (E4)**
- *Erreur fréquente* : plus aucune « s'excuser » ni « s'expliquer » (déjà 4 fois). Pistes libres : rire avant l'autre, enchaîner une deuxième réplique pour sauver la première, préparer au point de réciter, viser le plus bruyant de la table, répondre au mauvais interlocuteur.
- *Ressort de la joueuse* : plus d'objet, d'organe ou de lieu promu à un statut officiel (déjà 4 fois). Pistes libres : litote, nombre très précis, fausse règle de procédure, bonne foi poussée trop loin, inversion de politesse, suite logique absurde.
- *Règle pour choisir* déjà prises : test du lundi, temps mis par l'autre, ce que ta question vérifie, réparer avant de plaisanter, survivre au démenti, travail demandé à l'autre, vers qui pointe la phrase, nombre de micros, les 30 secondes suivantes, âge de la table, longueur selon le bruit. À inventer, une par lettre.
- *Décryptage (B)* : humoriste récent et proche de l'audience, **passage réel, daté, vérifié** (WebSearch et visionnage, leçon des fiches vidéo s20 : sujet inventé), aucune citation non vérifiée. Candidats de la liste de référence : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg. Trois techniques différentes de « Bref » (titre-résumé) et de Palmashow (rime) : par exemple l'aveu en premier, la naïveté jouée, le ton plat. Un humoriste différent par mois.
- *Retour sur l'exercice* : seulement après un décryptage (B), comme W48 après W47.

| # | Date | Contexte et ancre de saison | Scène proposée | À surveiller |
|---|---|---|---|---|
| L1 | 12/11 (2026-W46) | Études. Mi-semestre ; [HYPOTHÈSE : exposés et projets avant les partiels de décembre-janvier, calendrier universitaire non vérifié, rester sur « TD ou projet de groupe »]. | Mardi, TD d'une heure : un camarade pique sur ta façon de présenter (trop vite, trop plat), devant le groupe et le chargé de TD. | Pas de pique « tu parles jamais » (c'est le n°1 du 05/11). Étape Répartie é1. |
| L2 | 14/01 (2027-W02) | Boulot. Épiphanie le dimanche 03/01 ; galettes de bureau pendant tout janvier. | Vendredi 15/01, 16 h, galette dans l'open space : tu tires la fève, couronne en papier, la manager lance « Le roi dit un mot ! » | Le thème « roi » pousse au ressort saturé du statut officiel : l'éviter. Étape Boulot é6. |
| L3 | 21/01 (2027-W03), **B** | Janvier : scène d'ouverture hors boulot (L2) et hors résolutions (n°3). | Décryptage d'un passage d'humoriste, technique à choisir. | Étape selon la technique : Storytelling é2 ou Confiance é6. |
| L4 | 28/01 (2027-W04) | Amis. Chandeleur le mardi 02/02. | Mardi 02/02, crêpes chez un ami : tu fais sauter la crêpe, pièce en main, elle atterrit ailleurs, l'ami commente. | Réagir à son propre raté en public, sans s'excuser (le n°4 traite l'excuse à un proche). Étape Storytelling é3. |
| L5 | 11/02 (2027-W06) | Amis. Tournoi des Six Nations du 05/02 au 13/03 [sources concordantes, à reconfirmer sur le site officiel] ; match France - Angleterre annoncé le dimanche 14/02. | Dimanche 14, soirée match chez un ami : le supporter le plus bruyant chambre ceux qui s'y connaissent peu. | Le 14/02 est la Saint-Valentin : ne pas en jouer (n°4 le 04/02). Repli si le calendrier se dérobe : « soirée match » sans date. Étape Machine à Café é1. |
| L6 | 18/02 (2027-W07), **B** | Février : vacances d'hiver en cours (zone C jusqu'au 22/02, zone A du 13/02 au 01/03, zone B du 20/02 au 08/03). | Décryptage, autre humoriste et autre technique que L3. | Étape Storytelling é4 ou Confiance é2. |
| L7 | 25/02 (2027-W08) | Voisinage. Aucune ancre de saison nécessaire. | Dimanche soir, escalier : la voisine du dessous lance « C'était vous, la musique, hier ? » avec un sourire de reproche. | Désamorcer sans s'excuser ni s'expliquer (interdit E4). Étape Confiance é6. |
| L8 | 11/03 (2027-W10) | Boulot. [HYPOTHÈSE : campagnes d'entretiens annuels souvent entre janvier et mars, à confirmer.] | Mardi 16/03, entretien annuel : « Quels sont vos points faibles ? » | La scène peut ressembler à la salle de réunion (W48) : la tenir en face à face. Étape Boulot é4. |
| L9 | 18/03 (2027-W11), **B** | Mars : scène d'ouverture de saison (fin de l'hiver). | Décryptage, 3e humoriste, 3e technique. | Étape Storytelling é5 ou é6. |
| L10 | 25/03 (2027-W12) | Famille. Pâques le dimanche 28/03 [à reconfirmer] ; passage à l'heure d'été la nuit du 27 au 28/03 (le dernier dimanche de mars). | Dimanche midi chez tes parents : tu arrives à l'heure de ta montre, c'est-à-dire avec une heure de retard sur le déjeuner. | Pas une « question à table » (W52 en 24/12) : ressort de la pique sur le retard. Étape Confiance é1. |

## 7. Dates limites d'écriture

Règle (inspirée des délais réels de s21 : 2 à 3 tours de relecture, déploiement des données, approbation par Thomas) : **texte final au niveau (2 relectures à l'aveugle à 9/10 et lecture de l'orchestrateur) au plus tard 8 jours avant l'envoi** ; **approbation de Thomas et mise en ligne au plus tard 3 jours avant** (déploiement des données, puis bouton d'approbation, test). Les dates « recommandées » regroupent les lettres par lot avant les coupures (fêtes de fin d'année, vacances d'hiver) pour qu'un seul déploiement serve plusieurs jeudis.

| Lot | Lettres | Texte final recommandé | Limite absolue du texte (J-8) | Approbation et mise en ligne au plus tard (J-3) |
|---|---|---|---|---|
| **0** | **n°1 adapté** (urgent) | **mardi 27/10** | **mercredi 28/10** | Mise en ligne lundi 02/11 (J-3) ; approbation de Thomas le 03/11 ou 04/11 (exception à la règle faute de temps) |
| **0 bis** | n°3 (+ article), n°5 / n°6 échangés (+ article, intros), n°2 et n°4 inchangés mais à ré-approuver | **vendredi 30/10** (dans le même déploiement du 02/11) | 25/11 (n°2), 30/12 (n°3), 27/01 (n°4), 24/02 (fête du 04/03), 24/03 (canular du 01/04) : inutile d'attendre | 02/11 ; approbation avant chaque envoi |
| 1 | L1 (12/11) | 02/11 | 04/11 | 09/11 |
| 1 bis | W47 à W53 (existantes, à faire approuver une par une) et correctifs de faits E9 | 06/11 (E9 de W47), 04/12 (E9 de W51) | 11/11 (W47), 09/12 (W51) | Approbation de Thomas : 16/11, 23/11, 07/12, 14/12, 21/12, 28/12 |
| 2 | L2, L3, L4 (14/01, 21/01, 28/01) | **vendredi 18/12** (avant les fêtes) | 06/01, 13/01, 20/01 | 11/01 (L2), puis 18/01 et 25/01 |
| 3 | L5, L6, L7 (11/02, 18/02, 25/02) | **vendredi 22/01** | 03/02, 10/02, 17/02 | 08/02 (L5), puis 15/02 et 22/02 |
| 4 | L8, L9, L10 (11/03, 18/03, 25/03) | **vendredi 19/02** | 03/03, 10/03, 17/03 | 08/03 (L8), puis 15/03 et 22/03 |
| 5 | Réservées d'avril et suite (08/04 …) et mensuelles de mai et après | **vendredi 12/03** (début du lot) | 31/03 pour le 08/04 | 05/04 pour le 08/04 |

Rappel : le plan s'arrête au 01/04 mais la promesse « chaque jeudi » continue : l'abonné du 02/04 attend une lettre le 08/04 (lot 5).

## 8. Points de vigilance avant de lancer l'écriture

1. **Un seul déploiement pour le lot 0** : `numeros.json` ne doit contenir que les 6 textes finaux (E8) ; l'approbation de tout texte stocké modifié est effacée au déploiement, donc Thomas relit les 6 lettres du mois une seule fois.
2. **Échange n°5 / n°6** : déplacer le contenu et non seulement les dates (`numero`, `periode`, `datePlancher`, `utm_content` `n5-` et `n6-`). Le n°6 (canular) devient : « Aujourd'hui, c'est le 1er avril », scène à 8 h 02 pour une lettre à 8 h 00, et « Et si c'est toi qui prépares le canular » reformulé pour le jour même.
3. **Retrait de W46** de `hebdo-premium.json` si sa scène devient le n°1, puis ajout du nouveau W46 (statut `BROUILLON` tant que l'approbation manque).
4. **Faits** : confirmer en base les dates d'articles du § 4 bis, l'année de la mise en ligne de Bref (W47) et la nature de la sortie des « Monos de ski » (W51) ; confirmer Pâques 2027 (28/03) et le calendrier du Tournoi avant d'écrire L5 et L10.
5. **Pied de page et pages publiques** : tant que les lots 2 à 4 ne sont pas approuvés, la mention « une lettre chaque jeudi » (PS de la lettre du mois, ligne de /abonnement) est fausse à partir du 14/01.
6. **Hors périmètre, à ne pas oublier** : après le 01/04, chaque jeudi réservé doit être écrit (lot 5) et la lettre du mois du 06/05 (premier jeudi de mai).

## Handoff

**Handoff → @orchestrator** (puis @copywriter, @reviewer, @fullstack, @seo)
- Fichier produit : `/home/user/Marrant/docs/strategy/plan-lettres-nov-2026-avril-2027.md`.
- Décisions proposées : n°1 = « T'as perdu ta langue ? » (candidate 1, § 5) ; échange n°5 / n°6 ; articles ajoutés aux n°3 et n°6 (fête) ; 10 lettres à écrire (L1 à L10) ; un décryptage d'humoriste le 3e jeudi de chaque mois ; lots et dates limites du § 7 (premier jalon : mercredi 28/10 pour le n°1).
- Points d'attention : E8 (`numeros.json` ancien format), faits E9, promesse « chaque jeudi » rompue dès le 14/01 sans le lot 2, ressorts et erreurs saturés (§ 6). @seo : décider de la date de l'article S7 (E13). @fullstack : semaines ISO W53 et 2027 (E14), échange n°5 / n°6, retrait de W46.
- Non fait volontairement : aucun texte de lettre écrit ou réécrit, `project-context.md` non mis à jour (consigne « ne modifier aucun autre fichier »), rien commité.
- Agent spécialisé recommandé (@agent-factory) : un **testeur-persona Yanis** (20 à 30 ans, muet quand on le chambre) pour lire les 10 lettres à écrire et les 6 lettres du mois, en complément des relecteurs à l'aveugle. Angle mort vérifiable : aujourd'hui aucun lecteur ne joue le persona qui reçoit la lettre. Critère de succès : sur chaque lettre, « je la relirais avant la soirée » et « la réplique est dite à voix haute sans rougir ». Pas de testeur-client : persona B2C direct.

