# Stratégie de relance des 3 réseaux, v2 (cycle 2, s15, 05/10/2026)

> Document autonome. Remplace `audit-note-s15.md` §6 à §8 (cycle 0). Choix fondateur du 05/10 : relance de X, Instagram et LinkedIn, consignes du 01/10 annulées ; restent valables : compte = marque (vanne citée à la 1re personne admise), X sans thread, LinkedIn sans ton coach ni corporate ni broetry (post de 2 ou 3 phrases fluides, tutoiement, format POTE_AU_TAF), style fluide, humoristes nommés et cités autorisés (citation réelle, jamais inventée), zéro tiret cadratin, jamais de mention IA, contenu préparé par lot. Vannes = catalogue validé (`docs/copy/catalogue-vannes-valides.md`, recopiées mot pour mot) ou lignes des articles du site, relues à l'aveugle (2 relecteurs).
> Point de départ au 05/10 : aucun post en attente (les 33 posts Instagram et les 40 posts X sont retenus, §5) ; Instagram reconnecté dans Buffer ; LinkedIn muet depuis août ; abonnés inconnus ; 1 visite sociale en 28 jours contre 455 en recherche organique. Tout est à construire, rien à « relâcher ».

## 1. Stratégie des 3 réseaux

| Réseau | Étape du funnel | Rôle | Destination du lien | Métrique pilote | Personas |
|---|---|---|---|---|---|
| Instagram | Acquisition : notoriété et partage | « je l'envoie à un pote » | lien de bio `/liens?s=ig` : quiz d'abord, puis dernier article | (partages + enregistrements) / couverture, clics bio | Yanis, Sophie ; Marc via les relais rencontre et couple |
| X | Acquisition : clic | tester ce qui circule ; seul réseau avec lien direct dans le post | article (relais lundi et jeudi), quiz (mercredi) | visites `utm_source=x`, réponses + citations | Yanis, Sophie |
| LinkedIn | Acquisition qualifiée | vanne de bureau, situation, relais d'article à angle travail | article en premier commentaire, jamais de lien dans le corps du post | réactions + commentaires, visites `utm_source=linkedin`, abonnés de la page | Sophie, Marc `[HYPOTHÈSE : à départager à J+28]` |

Funnel commun : post, puis article ou quiz (valeur sans compte), puis CTA de la page (compte gratuit), puis `inscription-reussie`. Le social ne mène jamais à `/abonnement` et ne parle jamais de prix : la conversion est la conséquence de la valeur, pas l'objet du post (choix du 06/05).
Marc (34 ans, séparé) : hypothèse « Instagram et LinkedIn ». Contenu attribué : relais rencontre (29/10) et couple (05/11) sur Instagram et X, situations de bureau sur LinkedIn. Relevé séparé à J+28 : partages + enregistrements et visites Umami de ces deux articles par source ; sous le seuil d'échec, l'hypothèse est abandonnée.

**Grille hebdomadaire unique** (heures de Paris `[HYPOTHÈSE : créneaux à tester, relevé à J+28]`) : 12 posts.

| Jour | X 12:30 | Instagram 18:30 | LinkedIn 08:15 |
|---|---|---|---|
| Lundi | relais de l'article du lundi (vanne ou message de l'article + lien) | carte relais : vanne de l'article, légende « lien en bio » | aucun |
| Mardi | vanne | carte vanne | relais de l'article du lundi si angle bureau, sinon vanne de bureau |
| Mercredi | vanne + lien du quiz | carrousel décryptage (4 cartes) | aucun |
| Jeudi | relais de l'article du jeudi, sinon vanne saisonnière | carte relais du jeudi, sinon carte vanne | relais du jeudi si angle bureau, sinon situation neuve ou vanne |
| Vendredi | vanne | carte vanne | aucun |

Totaux : X 5 (3 vannes, 2 relais), Instagram 5 (2 cartes vanne, 1 carrousel, 2 relais), LinkedIn 2 (au moins 1 vanne ou situation par semaine, jamais 2 relais). Il n'y a pas de relais du jeudi avant le 22/10 (premier article du jeudi).
**Piliers recalculés sur ces 12 posts** : vanne 6 (50 %), relais X et Instagram 4 (33 %), décryptage 1 (8 %), LinkedIn relais ou situation 1 (8 %). **Catalogue ou propre** : vannes du catalogue mot pour mot 7 (58 %, dont le carrousel), vannes ou messages d'article mot pour mot 4 (33 %), texte neuf relu à l'aveugle 1 (8 %). Une fois par mois, le carrousel du mercredi cite un humoriste (citation réelle sourcée, vérifiée avant, jamais inventée). Chaque post tient à un pilier et à au moins un des 3E (éduquer, divertir, engager).
**Conditions de départ** : (1) validation des 9 étalons par Thomas (règle P0 s8) ; (2) test d'inscription Google sur mobile, 5 min (`docs/qa/tunnel-inscription-s15.md`) ; si Google échoue dans le navigateur d'Instagram, l'e-mail passe en premier (§2), la cadence ne baisse pas ; (3) `/liens` v2 en ligne avant le premier post Instagram à lien ; (4) LinkedIn débloqué dans le code et statut réel Buffer relu (@fullstack). J0 = lundi 12/10 si (1) est acquis avant jeudi 08/10, sinon le lundi suivant (les articles sont datés, seul le lot glisse).
**Temps humain plafonné** : relevé du lundi 30 min, réponses 15 min par jour au plus, réponse sous 24 h les jours ouvrés avec banque de réponses (pattern d'invitation du 06/05, troll : silence ou chaleur détachée).
**Stock** : 6 vannes par semaine sur 125 validées ; anti-répétition 90 jours par réseau et 7 jours entre réseaux, mémoire lue par la préparation mensuelle (@fullstack). @copywriter livre 30 vannes neuves par mois, relues à l'aveugle, première livraison le 02/11.

## 2. Liens et attribution

| Paramètre | Valeur |
|---|---|
| `utm_source` | `x`, `instagram`, `linkedin` |
| `utm_medium` | `social` |
| `utm_campaign` | `AAAA-MM` du post ; `bio` pour `/liens` |
| `utm_content` | `lundi`, `jeudi`, `quiz`, `commentaire` (LinkedIn) ; sur `/liens` : `bio-quiz`, `bio-article`, `bio-vanne`, `bio-parcours`, `bio-vannes`, `bio-conseils` |

Destinations : quiz `/quiz-humour` (environ 2 minutes, sans inscription), article `/blog/<slug>`, parcours `/parcours/repartie`. L'inscription se fait par le CTA de l'article ou du quiz (`/register?src=...` déjà posé, `src` inchangé). Aucun lien social ne mène à `/register` ni `/abonnement`. Règle : aucun lien sans UTM, même ajouté à la main (même `utm_source` que le réseau).

| Type de post | Appel à l'action |
|---|---|
| Vanne X (mardi, vendredi), carte vanne IG, vanne LinkedIn | aucun lien ; légende IG « À envoyer à... » ou rien, pied `deviens-marrant.fr` |
| Vanne X du mercredi | 2e bloc : « Le quiz « quel type d'humour es-tu ? » prend environ 2 minutes, sans inscription : lien » |
| Relais X (lundi, jeudi) | vanne ou message de l'article, puis « Les N autres sont prêts à copier : lien » |
| Relais IG, carrousel IG | « lien en bio » une seule fois (carte 4 pour le carrousel) |
| Relais LinkedIn | lien UTM `linkedin` en premier commentaire, annoncé en dernière phrase |

Liens ou CTA explicites : X 3 posts sur 5, Instagram 3 sur 5, LinkedIn 1 sur 2 au plus (au-dessus du minimum « une carte sur trois, un tweet sur deux »).

**Spec `/liens` pour @fullstack (pas de code ici)** :
1. Source dynamique : `/liens?s=ig|x|li` (absent = `ig`, compatible avec la bio actuelle) ; `utm_source` = `instagram|x|linkedin` ; `utm_campaign=bio` ; un `utm_content` par bloc. Les 3 bios (X, Instagram, LinkedIn) pointent vers leur propre `?s=`.
2. Ordre des blocs : (1) bouton quiz « Quel type d'humour es-tu ? » (valeur sans compte), (2) dernier article, (3) vanne du jour, (4) parcours Répartie, (5) toutes les vannes, (6) conseils. Aujourd'hui : parcours Répartie en premier, quiz absent, UTM figés sur `instagram`.
3. Persistance : lire l'UTM à l'arrivée (sessionStorage) et l'envoyer en propriété `origine` sur `quiz-termine`, `parcours-etape`, `inscription-envoi`, `inscription-reussie` (sans toucher à `src`, qui reste le point d'entrée du site).
4. `/register` : si `origine` = Instagram, formulaire e-mail avant le bouton Google (le navigateur intégré d'Instagram bloque l'OAuth Google).
5. Tests mobile Safari et Chrome avant le premier post à lien. Consigner dans `REPLIT_ACTIONS.md`.
6. `docs/social/mesure.md` §1 : ajouter `linkedin`, `utm_content`, la règle « lien en commentaire = même UTM » et LinkedIn dans le relevé.

## 3. Calendrier

Lot 1 : lun. 12/10 au dim. 15/11 (produit après validation des étalons). Lot 2 : lun. 16/11 au dim. 03/01 (préparé et relu à l'aveugle avant le 09/11). Le détail post par post sera tenu dans `docs/social/editorial-calendar.md` (colonnes Semaine, Date, Plateforme, Format, Pilier, Hook, CTA, Statut). Chaque article du lundi et du jeudi est relayé sur X et Instagram, et sur LinkedIn quand l'angle est le travail, avec une vanne ou un message de l'article, mot pour mot, différent d'un réseau à l'autre.

| Semaine | Lundi (X + IG) | Jeudi (X + IG) | LinkedIn mar. / jeu. | Pivots |
|---|---|---|---|---|
| 12/10 | `se-presenter-avec-humour` | aucun article le 15/10 : vannes | relais (13/10) / vanne mug (15/10) | J0 ; Toussaint dès le 17/10 |
| 19/10 | `humour-en-colocation-desamorcer-tensions` | `message-anniversaire-drole-par-situation` (22/10) | vanne / relais « carte du bureau » (22/10) | heure d'hiver dim. 25/10 : aucune vanne au catalogue, rien |
| 26/10 | `blagues-sur-l-ia-assistants-vocaux` | `premier-message-drole-appli-de-rencontre` (29/10, Marc) | vanne / situation neuve (29/10) | ven. 30/10 Halloween : vanne dating `cs14jk1bc86d3502a2cef27b` + lien `blagues-halloween-soiree-deguisee`, X et IG |
| 02/11 | `humour-en-visio-reunion-en-ligne` | `blagues-de-couple-drole` (05/11, Marc) | relais (03/11) / vanne | Toussaint 01/11 : silence ; mer. 04/11 carrousel humoriste (1er du mois) |
| 09/11 | `chambrer-sans-blesser-entre-potes` | `voeux-drole-nouvelle-annee` (12/11), relais léger « à garder de côté » | vanne / vanne ou situation | 11/11 : silence ; fin du lot 1 |
| 16/11 | `soiree-de-noel-entreprise-humour` | article du 19/11 (invitation, fichier B1) | relais (17/11) / vanne | début du lot 2 |
| 23/11 | `repas-de-famille-questions-genantes-humour` | article du 26/11 (gamer, fichier B2) | vanne / vanne ou situation | Black Friday 27/11 : silence |
| 30/11 | `toast-drole-discours-qui-fait-rire` | `mot-de-depart-collegue-drole` (03/12) | vanne / relais (03/12) | |
| 07/12 | `faire-rire-un-enfant-repas-de-fete` | aucun article programmé après le 03/12 `[À VÉRIFIER avec @seo]` : vannes de Noël | vanne / situation de pot de fin d'année | |
| 14/12 | `jeux-de-repartie-soiree-nouvel-an` | `meilleures-blagues-droles-2026` passé à 2027 (17/12, vannes reprises dans la page publiée) | vanne / vanne | refonte 2027 du 15 au 20/12 |
| 21/12 | `etre-drole-sans-alcool-soiree` | 24/12 : vanne de Noël `cs14jkee5c537f7286c1da98` | vanne / vanne (déplacée au mer. 23/12) | ven. 25/12 : vanne famille, sans lien |
| 28/12 | `resolution-nouvelle-annee-etre-plus-drole` | relais vœux (31/12) ; ven. 01/01 : message de vœux de l'article | vanne (29/12) / relais vœux (31/12) | fin du lot 2 dim. 03/01 ; lun. 04/01 : vœux repris sur les 3 réseaux (lot 3) |

## 4. Mesure

**Baseline** : Thomas relève le dimanche 11/10 (captures datées) les abonnés X, Instagram et page LinkedIn, les impressions Google de « deviens marrant » (0 sur 90 jours) et les visites `utm_source` des 28 derniers jours (0). J0 = lundi 12/10 ; si J0 glisse, tous les jalons glissent d'autant. Jalons : J+14 = 26/10, J+28 = 09/11, J+56 = 07/12.
**Relevé du lundi** (30 min), par réseau : abonnés nets, posts prévus et publiés (statut Buffer relu), couverture ou impressions, partages + enregistrements (Instagram), réactions + commentaires (LinkedIn), visites Umami par `utm_source`, `inscription-reussie` par `origine`, taux de réponse sous 24 h. Trois lectures Umami fixes : entonnoir `/liens` > `quiz-termine` > `inscription-reussie` par `origine`, top 5 des pages d'arrivée sociales, part du social dans les visites (0,14 % aujourd'hui).

Seuils cumulés depuis J0 `[HYPOTHÈSE : à valider par Thomas, aucun benchmark interne]` :

| Mesure | J+28 succès / échec | J+56 succès / échec |
|---|---|---|
| Visites `utm_source` x + instagram + linkedin | ≥ 50 / < 10 | ≥ 130 / < 30 |
| Abonnés Instagram gagnés | ≥ +120 / < +30 | ≥ +300 / < +80 |
| Abonnés X gagnés | ≥ +40 / < +10 | ≥ +100 / < +30 |
| Abonnés page LinkedIn gagnés | ≥ +30 / < +10 | ≥ +80 / < +25 |
| Instagram, partages + enregistrements / couverture (médiane) | ≥ 2 % / < 0,5 % | ≥ 2 % / < 0,5 % |
| `quiz-termine` depuis un lien social (`origine`) | ≥ 10 / 0 | ≥ 30 / < 5 |
| `inscription-reussie` attribuées | ≥ 1 / 0 | ≥ 3 / 0 |
| Posts remis, relus chez Buffer et publiés | 100 % / < 90 % | 100 % / < 95 % |

Décision : chaque réseau est jugé seul, sur 3 semaines consécutives sous le seuil d'échec. Maintien : au moins 4 seuils en succès, dont visites ou partages. Ajustement (créneaux, ratio vanne et relais, destination) : le reste. Pause d'un réseau et réallocation vers SEO et tunnel : échec simultané sur abonnés, visites et partages. Le social n'est jamais jugé sur le MRR (environ 0,2 abonné payant attendu à 8 semaines). Honnêteté : +400 abonnés combinés en 8 semaines ne font pas 10 000 à 12 mois (environ 190 par semaine) : Thomas révise l'objectif à J+56 ou on change d'échelle. Contrôle à J+14 : 0 visite UTM ou abonnés sous 10 % du seuil = vérifier le lien de bio, le clic sur `/liens`, l'OAuth Instagram, avant tout autre ajustement. `mesure.md` (cadre du 01/10) est à réécrire sur ces bases pour 3 réseaux (@social, @data-analyst).

## 5. Sort des files retenues

Format des deux fichiers : `id`, `scheduledAt`, `format`, `content`, `approvedBy` (préparation mensuelle), `directorScore` nul. Aucun texte ne repart sans validation des 9 étalons (les posts ont été écrits sous les consignes du 01/10, annulées). Règle de tri, par script puis relecture :
- **Garder** (re-datés sur la grille, jamais à leur date d'origine) : toute vanne dont le texte est celui du catalogue mot pour mot, X ou carte Instagram, si elle passe l'anti-répétition (90 jours par réseau, 7 jours entre réseaux : plusieurs vannes sont aujourd'hui en double sur X et Instagram à moins de 7 jours, par exemple « faire la vaisselle »). Les cartes sont à re-rendre avec le gabarit validé.
- **Réécrire** : les légendes Instagram qui recopient la carte (remplacées par « À envoyer à... »), les vannes à motif répété (trois vannes « pain » : 30 jours d'écart au moins).
- **Jeter** : tout post d'article au titre nu (X : titre + lien ; Instagram : titre + « Lien en bio », exemple « Toast drôle : la structure d'un discours qui fait rire ») ; remplacés par le relais avec vanne de l'article (§1). Idem pour tout post daté périmé (Halloween du 05/10).
- Statut : les 33 posts Instagram restent REJECTED et les 40 posts X restent retirés de la file jusqu'à validation ; le lot est refait sur la grille, à partir des textes gardés, par @social, puis inséré par @fullstack.

## 6. Les 9 posts modèles v2

Aucun émoji, aucun tiret cadratin, aucun hashtag les deux premières semaines (puis test de 3 sur une carte sur deux). Toute phrase neuve passe la relecture à l'aveugle (2 relecteurs) avant la présentation à Thomas.

**X1, vanne, mar. 13/10 12:30**, pas de lien. Source : JOKE `cmmnsqn130027th63at2ene9i` (plancher fondateur, mot pour mot). Programmée une seule fois (retirée de la file X).
> J'ai dit à Alexa de me raconter une blague.
> Elle m'a lu mon historique de recherches.

**X2, relais du jeudi, jeu. 22/10 12:30.** Source : article `message-anniversaire-drole-par-situation`, message n°4 (choix à confirmer à l'aveugle parmi les n°4, 12 et 21).
> J'ai relu mon discours dans le métro ce matin. Une dame a changé de wagon.
> Je garde la version courte : joyeux anniversaire.
>
> Les 20 autres sont prêts à copier : https://deviens-marrant.fr/blog/message-anniversaire-drole-par-situation?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=jeudi

**X3, vanne avec quiz, mer. 21/10 12:30.** Source : JOKE `cmmnsqn14004sth63rnutrbwi`.
> Je suis nul en small talk. Quelqu'un m'a dit « il fait beau ».
> J'ai répondu « oui, mais ça ne durera pas ».
>
> Le quiz « quel type d'humour es-tu ? » prend environ 2 minutes, sans inscription : https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz

**IG1, carte vanne, mar. 27/10 18:30**, 2 cartes 4:5, pas de lien. Source : JOKE `cs14jk8f28ff20e1cf82f3a8` (placée loin du relais S2 du 12/10 qui contient la même vanne).
> Carte 1 : « Au jeu de mimes, ma carte disait « la timidité ». » Carte 2 : « J'avais à peine bougé qu'ils avaient trouvé. »
> Légende : À envoyer à la personne qui a deviné en premier. deviens-marrant.fr

**IG2, relais du lundi, lun. 12/10 18:30**, 2 cartes. Source : article `se-presenter-avec-humour`, situation 4 (JOKE `cs14jke4221e9a31a33b0395`).
> Carte 1 : « J'ai préparé mon entretien pendant trois jours. Première question : « Vous avez trouvé facilement ? » » Carte 2 : « J'avais rien préparé pour ça. J'ai dit « plus ou moins ». Il a noté. »
> Légende : Une des 5 façons de se présenter sans faire de numéro. Les quatre autres sont dans l'article, lien en bio.

**IG3, carrousel décryptage, mer. 14/10 18:30**, 4 cartes. Source : JOKE `cs14jk9cc844b92fde69e845`.
> Carte 1 : « J'ai pris un chien pour me faire des amis. » Carte 2 : « Il en a plein. Moi, je tiens la laisse. »
> Carte 3 (texte neuf) : « Pourquoi ça fait rire : le plan marche, juste pas pour toi. Ta prochaine histoire ratée a sûrement la même forme, il suffit de dire qui en a vraiment profité. »
> Carte 4 (texte neuf) : « Chaque vanne du site a son décryptage. Le catalogue est dans le lien de la bio. » Légende : À envoyer à quelqu'un qui promène un chien très sociable.

**L1, vanne de bureau, jeu. 15/10 08:15**, pas de lien. Source : JOKE `cs14jkefbc9f40abb6f8a2ca`.
> Notre chef a offert à chacun un mug « meilleur collègue du monde ». On est quatorze.
> Depuis, on se surveille.

**L2, situation de bureau, jeu. 29/10 08:15**, pas de lien (texte neuf ; repli en cas de refus à l'aveugle : JOKE `cs14jkc13a4d9d7194d8e5ea`).
> Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Le temps que les trois petits points s'affichent, tu as relu ta semaine, trouvé deux erreurs et préparé ta défense. Il cherchait la salle Monet.

**L3, relais, mar. 13/10 08:15.** Source : article `se-presenter-avec-humour`, situation 2 (JOKE `cs14jkd6b11e811ffbf7f301`).
> Au tour de table, la personne juste avant toi vient d'annoncer qu'elle a monté sa boîte à 19 ans, et ton cerveau n'a gardé que « Bonjour, moi c'est ». On a réuni 5 façons de se présenter qui font sourire sans que tu aies l'air de faire un numéro, dont celle de l'alternant qui se demande ce qu'est devenu alternant1. L'article est en premier commentaire.
> Premier commentaire : https://deviens-marrant.fr/blog/se-presenter-avec-humour?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10&utm_content=commentaire

## Réponse aux notateurs (cycle 1)

- **@reviewer K1** : (a) grille contradictoire, (b) piliers faux, (c) « conseil en une carte » : appliqués (grille unique §1, piliers 50/33/8/8, pilier supprimé, le conseil vit dans le décryptage). (d) Marc : appliqué sur Instagram et X (relais rencontre et couple) ; **non appliqué sur LinkedIn** (un relais de rencontre y casse le rôle « bureau » et le ton ; Marc y est servi par des situations de travail, hypothèse tranchée à J+28). (e) files : appliqué (§5, REJECTED confirmés, lot refait, posts d'article jetés). (f) stock : appliqué (30 vannes neuves par mois dès le 02/11, anti-répétition 90 j et 7 j).
- **@reviewer K2** : X1 texte inchangé, mais la file X étant retenue, Alexa part une seule fois le 13/10 (et non exclue). X2 appliqué (n°4, à confirmer à l'aveugle). **X3 Pain non appliqué** : texte validé conservé (la variante « plus de six » n'est pas passée en relecture à l'aveugle) et le modèle devient une vanne à lien quiz (@growth) ; la vanne « pain » reste dans le lot, espacée de 30 jours des deux autres. IG1, IG2, IG3 (carte 3 du reviewer, carte 4 ajoutée), L1, L2, L3 : appliqués avec les dates et textes demandés.
- **@reviewer K5** : appliqué (Halloween 30/10, relais anniversaire LinkedIn 22/10, Noël au boulot 17/11, pot de départ 03/12, lot 2 jusqu'au 03/01, vœux 31/12 et 04/01). Vanne d'heure d'hiver : aucune au catalogue, donc rien.
- **@reviewer K9** : « 2 ou 3 phrases » LinkedIn (FP : format ≤ 3 phrases) appliqué ; barre « jamais entendue » : L2 sous relecture à l'aveugle avec repli ; décryptage ton pote et situation LinkedIn appliqués ; aucun post ne part avant validation des étalons (files retenues) ; humoristes : carrousel mensuel à citation réelle appliqué. Les 6 contradictions sont tranchées (grille, piliers, L3 au 13/10, 33 IG REJECTED, décryptage, relais jeudi dès le 22/10). Renotation sur la carte rendue (K3) : à faire quand @design rend le gabarit.
- **@growth K1** : colonne funnel, plafond de temps, hypothèse Marc appliqués ; cadence 5/5/2 gardée, mais le test Google mobile conditionne le départ et non la cadence (une seule grille). **K6** : les 6 points sont en spec §2 (code à faire par @fullstack). **K8** : baseline du 11/10, J0, seuils, règle des 3 semaines, contrôle J+14 repris tels quels.

