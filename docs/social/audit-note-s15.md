# Audit noté du volet réseaux sociaux et stratégie de relance 3 réseaux (s15, 05/10/2026)

Sources : `docs/social/donnees-audit-s15.md` (base de prod et Umami du 05/10, abrégé D:ligne), préférences fondateur, `mesure.md`, `preparation/2026-10.md` et `2026-11.md`, critique à l'aveugle s14 (80 posts dont 9 LinkedIn, abrégé CA:ligne), code de la chaîne. Périmètre de Thomas (05/10) : consignes sociales du 01/10 annulées, relance propre de X, Instagram et LinkedIn. Restent valables : compte = marque, X sans thread, LinkedIn sans ton coach ni corporate, style fluide, humoristes autorisés, jamais de mention IA, zéro tiret cadratin, contenu préparé par lot. **Fait majeur (API Buffer du 05/10, D:33-37) : « PUBLISHED » en base veut dire « remis à Buffer », pas publié. Le post Instagram du 02/10 est en erreur chez Buffer (« Buffer has lost authorization to post on your behalf », Invalid Credentials) : le compte Instagram a 0 publication et les 33 posts IG en file échoueront tant que le canal n'est pas reconnecté. X fonctionne (posts du 02/10 et du 05/10 envoyés, liens x.com réels). LinkedIn : derniers envois réels le 09/08/2026, 0 depuis début septembre.** Les chiffres du §1 de `donnees-audit-s15.md` sont corrigés en conséquence. **Abonnés, impressions, partages, clics de bio : inconnus** (D:29). Limite de lecture : 9 des 39 posts LinkedIn lus (échantillon à l'aveugle tiré de l'export), les 30 autres non lus. Notes d'humour = jugement d'auditeur `[HYPOTHÈSE : à croiser avec la relecture à l'aveugle]`.

## 1. Tableau des notes

| Critère | Note /10 | Fait clé | Action n°1 |
|---|---|---|---|
| C1 Stratégie et réseaux | 5 | Aucun rôle écrit par réseau et par persona. LinkedIn : 39 posts en base (mars 9, avril 13, mai 8, juin 9, dernier le 15/06 15:06 UTC), derniers envois réels chez Buffer le 09/08, 0 depuis début septembre (panne de génération `diagnostic-publication.md:8`, puis pause) | Rôles par réseau (§6), étalons validés avant production |
| C2 Croissance audience | 2 | Instagram : 0 publication (D:34), donc aucune croissance possible ; LinkedIn muet depuis août ; seul X publie. 0 abonné au 24/03, aucun relevé depuis (D:29) ; social = 1 visite en 28 j contre 455 en recherche organique (D:23-25) ; 0 impression enregistrée sur 39 posts LinkedIn | Reconnecter Instagram, puis relevé de départ des 3 réseaux |
| C3 Qualité éditoriale | 6 | File X/IG d'octobre : 14 vannes à 8,0 en moyenne (Alexa, « alternant1 », « Léa, c'est moi » à 9), 2 posts d'article à 4. Anciens posts : 4 sur 80 au niveau (CA:88), LinkedIn 0 sur 9 (6 avec le défaut « coach », CA:20-82) | Reprendre l'écriture LinkedIn depuis le catalogue et des situations de bureau |
| C4 Formats par plateforme | 5 | X : tweets de 82 à 172 caractères, cartes « amorce // chute » conformes. Mais carte d'article = titre nu, 0 hashtag, aucun carrousel, LinkedIn absent du gabarit de préparation (`social-controls.ts:20`) | 3 gabarits : carrousel vanne + décryptage, carte article avec accroche, post LinkedIn texte |
| C5 Fiabilité de la chaîne | 3 | La préparation et l'envoi fonctionnent (4 posts remis à Buffer à l'heure du 02 au 05/10, 0 FAILED en base), mais le statut réel n'est jamais relu (D:33) : sur les 3 posts annoncés « publiés », 2 le sont (X), 1 est en erreur (Instagram, autorisation perdue). Les 33 posts IG en file échoueront. LinkedIn : bloqué en dur (`publish-social/route.ts:68`) et absent du plan mensuel. Limites en §3 | Thomas reconnecte Instagram dans Buffer ; @fullstack relit le statut réel et alerte |
| C6 Calendrier et saisonnalité | 5 | Articles du jeudi (22/10, 29/10, 05/11...) jamais relayés : le plan ne lit que les lundis (`social-month-plan.ts:150`), pas de créneau IG le jeudi (`:54`). Vannes tirées au hasard, aucune d'Halloween le 30/10 | Relais jeudi + dates pivots |
| C7 Engagement et communauté | 2 | Aucun protocole de réponse dans `mesure.md`, 0 réponse comptée en base (D:18), pas de veille de mentions | Réponse sous 24 h + banque de réponses |
| C8 Retour en trafic | 3 | UTM posés (`mesure.md:5-19`) et `/liens` bien construite (`liens/page.tsx:24-35`), mais 0 visite `utm_source=x` ou `instagram`, `/liens` absente des 89 chemins en 180 j (D:23-24). Cause probable : Instagram n'a rien publié (D:34), pas le lien de bio | Reconnecter Instagram, puis confirmer la bio vers `/liens` et tester le clic |
| C9 Conversion | 3 | Aucun événement d'inscription relié à une source sociale ; 1 visite sociale en 28 j (D:23) | Entonnoir Umami `/liens` > parcours Répartie > inscription |
| C10 Mesure et pilotage | 4 | Lignes du 05/10 vides (`mesure.md:51-52`), métriques à 0 sur 140 posts (D:18), statut « publié » non vérifié contre Buffer (D:33), pas de colonne LinkedIn, critère de sortie « deux mois de suite » impossible sur 8 semaines (`:58`) | Critères de sortie chiffrés par réseau avant le 19/10 |
| C11 Profils et identité | 4 | Lien de bio unique automatique (dernier article, vanne du jour, UTM `bio`). Mais profil Instagram vide (0 publication) et page LinkedIn à l'arrêt depuis août, avec des posts « coach » conservés en tête. Bios, avatars, `sameAs` non vérifiés | Thomas confirme les 3 bios ; @seo vérifie `sameAs` |
| C12 Conformité aux choix restants | 9 | File X/IG : zéro tiret, zéro « je » hors vanne (`social-controls.ts:65-70`), X ≤ 270, 100 % catalogue GARDER, humoristes non filtrés. Écart : validation d'échantillon non tracée (cases vides, `2026-10.md:22`) | Thomas confirme les échantillons d'octobre et de novembre |

## 2. Note globale

**4,0 / 10** (moyenne pondérée : C3 14 %, C2 12 %, C5 et C8 10 %, C1, C4, C7, C9, C10 8 % chacun, C6 6 %, C11 et C12 4 %). Moyenne simple : 4,3. Lecture : le contenu catalogue et la conformité sont solides, mais seul X publie réellement ; Instagram est coupé par une autorisation Buffer perdue, LinkedIn est muet, et l'aval (audience, trafic, conversion, pilotage) est aveugle ou vide.

## 3. Lecture de la chaîne (code lu)

- Un post en échec n'est jamais remplacé : 429 = FAILED + blocage de la plateforme 24 h (`publish-social/route.ts:347-371`), et la génération quotidienne qui « en générait un nouveau demain » est coupée (commentaire L348 périmé).
- Rattrapage non borné : `scheduledAt <= now` sans borne basse (L173), 1 post par plateforme par passage de 15 min (L234-241). Après une panne : rafale, ou FAILED au bout de 48 h (`diagnostic-publication.md:23`).
- `PUBLISHED` = remis à Buffer (L300-307) et jamais relu ensuite : le 05/10, l'API Buffer montre l'erreur d'autorisation Instagram alors que la base affiche « publié » (D:33-34). C'est le défaut majeur de la chaîne : aucune alerte ne signale ni cette erreur ni « 0 publication depuis 48 h » `[À VÉRIFIER : social-analytics non relu]`.
- Anti-répétition limitée au mois en cours (`prepare-social-month.ts:68-73`) : une vanne peut revenir sur le même réseau le mois suivant `[HYPOTHÈSE : pool d'environ 125 vannes GARDER]`.

## 4. Actions pour les critères ≤ 5

| Critère | Action précise | Qui | Métrique de succès | Délai |
|---|---|---|---|---|
| C5, C2 | Reconnecter le canal Instagram dans Buffer (« refresh your channel »), puis vérifier un post de contrôle sur le compte ; relire le statut réel chez Buffer pour chaque post remis (« sent » avec lien du réseau) et alerter à tout échec ; décaler les dates de la file IG au jour de la reconnexion (sinon rafale, `publish-social/route.ts:173`) ; rejouer ou abandonner les posts IG du 02/10 et du 05/10 | Thomas (reconnexion), @fullstack (relecture, alerte, décalage) | Compte Instagram avec ≥ 1 publication visible ; 100 % des posts remis relus, 0 échec silencieux | 06/10 |
| C1, C11 | Valider les 9 étalons du §8, confirmer les 3 bios (promesse en une ligne, lien `/liens`), noter dans `docs/social/profils.md` | Thomas | 9 étalons validés, checklist des bios complète | 08/10 |
| C2 | Relevé de départ : abonnés et impressions des 3 réseaux (lignes du 05/10, `mesure.md` §4) ; objectif mensuel = (10 000 combinés à 12 mois, `project-context.md`, moins le total relevé) / 12 | Thomas, @social | 3 lignes remplies, objectif écrit | 06/10, 02/11 |
| C4 | 3 gabarits : carrousel vanne + décryptage, carte d'article avec accroche, post LinkedIn texte | @design, @fullstack | 3 gabarits rendus en lot | 12/10 |
| C6 | Relais des articles du jeudi (X le jeudi, IG le jeudi 18:30), dates pivots (Halloween posé le ven. 30/10), mémoire anti-répétition 90 j par réseau | @fullstack, @social | 100 % des articles relayés, 0 doublon sur 90 j | 15/10 (jeudi), 20/11 |
| C7 | Réponse à 100 % des commentaires et messages sous 24 h (pattern d'invitation du 06/05, doctrine troll du 06/05), 15 réponses-types préparées en lot, veille de mentions à coût 0 | @copywriter, Thomas | Taux de réponse 100 % sous 24 h | 19/10 |
| C8 | Bio IG vers `/liens` et clic de test depuis un mobile ; ligne « visites sociales par `utm_source` » dans l'e-mail du lundi `[HYPOTHÈSE : e-mail admin existant]` | Thomas, @fullstack | ≥ 1 visite `/liens` visible | 06/10, 12/10 |
| C9 | Entonnoir Umami `/liens` > `/parcours/repartie` > inscription ; variante honnête du premier bouton (« première étape gratuite », cohérente avec le choix du 04/10) via `utm_content` | @data-analyst, @ux | Entonnoir alimenté, taux de clic comparé | 12/10, 02/11 |
| C10 | Réécrire `mesure.md` §5 : critères de sortie par réseau (abonnés nets, partages + enregistrements, visites UTM, taux de réponse), colonne LinkedIn, règle « 3 semaines consécutives sous le seuil » ; relevé prérempli depuis la base ; test d'un relevé automatique des métriques Buffer (expérimental, repli manuel) | @social, @fullstack | Critères GO/NO-GO validés, relevé complet 8 lundis sur 8 | 19/10 |

## 5. Les 3 actions qui feraient gagner le plus (par valeur pour Yanis, Sophie, Marc)

1. **Reconnecter Instagram dans Buffer et relire le statut réel de chaque post** (C5, C2, C8) : Instagram est le réseau de Yanis (20 ans) et de Sophie, il n'a pas publié un seul post ; tant que le statut réel n'est pas relu, tout autre chantier est invérifiable.
2. **Valider les étalons puis relancer LinkedIn avec du contenu de bureau écrit pour lui** (C1, C3, C5, C11) : Sophie (26, CDI) et Marc (34) y croisent leurs collègues ; le canal est muet depuis août et son contenu d'avant était à 0 sur 9 au niveau.
3. **Relayer les articles du jeudi avec une accroche tirée de l'article** (C6, C4, C8) : seuls contenus qui répondent à une situation du moment (anniversaire, rencontre, couple, voeux) et seuls porteurs d'un lien.

Viennent ensuite la mesure de départ et le protocole de réponse (C2, C7, C10), en 30 minutes de Thomas par semaine.

## 6. Stratégie de relance 3 réseaux

**Principe** : la marque envoie la vanne qu'on transmet à un pote, jamais un cours. Les réseaux redistribuent le catalogue validé (niveau Alexa) et l'adaptent au geste natif de chaque réseau. Tout texte nouveau passe la relecture à l'aveugle (2 relecteurs) avant insertion, comme les vannes.

| Réseau | Persona principal | Rôle | Cadence | Créneau (Paris) |
|---|---|---|---|---|
| Instagram | Yanis, Sophie | Partage et enregistrement (« je l'envoie à un pote ») | 5 par semaine | 18:30 |
| X | Yanis, Sophie | Vanne du jour, test de ce qui circule, réponses publiques | 5 par semaine | 12:30 |
| LinkedIn | Sophie, Marc | La vanne de bureau, l'après-réunion, sans leçon | 2 par semaine, mardi et jeudi | 08:15 `[HYPOTHÈSE : matin, à tester]` |

Marc : aucun signal chiffré sur son réseau `[HYPOTHÈSE : plutôt LinkedIn et Instagram que X]` ; facebook.com apparaît 3 fois en référent en 90 j (D:23), à surveiller avant tout ajout de réseau.

| Réseau | Formats | Ton et règles | Catalogue / propre au réseau |
|---|---|---|---|
| Instagram | Carte vanne « amorce // chute » (3 par semaine), carrousel vanne + décryptage (1), carte d'article avec accroche (1). Légende ≤ 150 caractères, pied `deviens-marrant.fr`, 0 hashtag puis test de 3 sur la moitié des cartes | Texte de la vanne mot pour mot, aucune explication sur la carte 1 et 2 | 80 % / 20 % (décryptages, accroches) |
| X | Post simple ≤ 270 : vanne (3), relais d'article avec accroche et lien UTM (2 : lundi et jeudi). Jamais de thread, d'émoji ni de question finale | Deux lignes, chute isolée, aucun commentaire de la blague | 85 % / 15 % |
| LinkedIn | Post texte de 2 à 4 phrases fluides, tutoiement. Lien d'article en premier commentaire `[HYPOTHÈSE : les liens dans le post réduisent la portée]` | Observation de bureau ou vanne ; jamais de leçon, de « technique », de « spoiler », de chiffre inventé, d'émoji. Question finale 1 fois sur 4 maximum | 60 % / 40 % (situations de bureau neuves) |

Rythme hebdomadaire : lundi article (X, IG), mardi vanne (X, IG) + LinkedIn, mercredi carrousel IG + vanne X, jeudi article forte frappe (X, IG) + LinkedIn, vendredi vanne (X, IG). Piliers : vanne 55 %, article 20 %, situation ou répartie 15 %, conseil en une carte 10 %.

## 7. Mise en oeuvre de la relance

- **Chaîne** (@fullstack, consigné dans `REPLIT_ACTIONS.md`) : retirer LINKEDIN de `PAUSED_PLATFORMS` (`publish-social/route.ts:68`) une fois le premier lot inséré ; étendre `PreparedPlatform`, `MAX_LENGTH`, `WEEK_PATTERN` (`social-controls.ts`, `social-month-plan.ts`) à LinkedIn ; garder `checkPost` (tirets, mots interdits, « je » hors vanne) pour LinkedIn, avec une limite de 700 caractères `[HYPOTHÈSE]`.
- **Calendrier** : lot du 12/10 au 08/11 préparé et échantillonné avant le 09/10. LinkedIn démarre le mar. 13/10 si les étalons sont validés le 08/10, sinon le mardi suivant.
- **Reprise de la file** : les 73 posts X/IG déjà approuvés restent ; les 33 posts IG sont redatés au jour de la reconnexion (D:34) ; les relais du jeudi (X remplacé, IG ajouté) sont patchés à partir du 15/10. Premier post IG de contrôle avant de relâcher la file.
- **Mesure** : relevé du lundi sur 3 réseaux ; la LinkedIn native (impressions, réactions, commentaires, abonnés de page) entre dans `mesure.md`.

## 8. Étalons à valider par Thomas (9 posts, règle P0 s8)

Les 6 vannes viennent du catalogue et sont reprises mot pour mot (id source indiqué). Les 3 textes marqués « nouveau » sont des brouillons d'écriture à valider à l'aveugle avant tout lot.

**X1 Vanne du jour** (JOKE `cmmnsqn130027th63at2ene9i`, mar. 12:30)
> J'ai dit à Alexa de me raconter une blague.
> Elle m'a lu mon historique de recherches.

**X2 Relais d'article du jeudi** (vanne JOKE `cs14jkb9ba433a0746280280` placée en accroche, remplacer par une vanne de l'article réel ; jeu. 12:30)
> Mon date a enregistré mon numéro devant moi. Elle a tapé « Antoine bar ».
> Je suis devenu un endroit.
>
> Les autres vannes sont dans l'article : https://deviens-marrant.fr/blog/[slug du jeudi]?utm_source=x&utm_medium=social&utm_campaign=2026-10

**X3 Vanne du jour famille** (JOKE `cs14jkffeab1620070f2263e`, mer. 12:30)
> Mon père dit « je vais chercher du pain » dès qu'il y a trop de monde à la maison.
> Le congélateur est rempli de baguettes.

**IG1 Carte vanne** (JOKE `cs14jk8f28ff20e1cf82f3a8`, mar. 18:30). Carte 1 : « Au jeu de mimes, ma carte disait « la timidité ». » Carte 2 : « J'avais à peine bougé qu'ils avaient trouvé. » Légende : texte de la vanne + `deviens-marrant.fr`.

**IG2 Carte d'article avec accroche** (nouveau, article « Se présenter avec humour : 5 accroches qui passent », lun. 12/10). Carte 1 : « Au tour de table, tu as dix secondes. » Carte 2 : « 5 accroches qui passent, lien en bio. » Légende : « Se présenter avec humour : 5 accroches qui passent. Lien en bio. »

**IG3 Carrousel vanne + décryptage** (JOKE `cs14jk9cc844b92fde69e845`, mer. 18:30). Carte 1 : « J'ai pris un chien pour me faire des amis. » Carte 2 : « Il en a plein. Moi, je tiens la laisse. » Carte 3, « Pourquoi ça marche » (reprendre le décryptage validé de la vanne ; brouillon) : « La chute ne contredit pas la promesse, elle la réalise, mais au profit du chien. »

**L1 Vanne de bureau** (JOKE `cs14jkefbc9f40abb6f8a2ca`, mar. 08:15)
> Notre chef a offert à chacun un mug « meilleur collègue du monde ». On est quatorze.
> Depuis, on se surveille.

**L2 Situation de bureau** (nouveau, jeu. 08:15)
> Le message « t'as deux minutes ? » arrive sans rien d'autre.
> Tu relis ta semaine, tu cherches l'erreur, tu prépares ta défense.
> Il voulait savoir où est la salle Monet.

**L3 Relais d'article** (nouveau, article « Se présenter avec humour : 5 accroches qui passent », lun. 12/10 ou mardi suivant)
> Le tour de table du lundi, quand c'est ton tour et que ton cerveau affiche seulement « Bonjour, moi c'est ».
> On a rassemblé 5 accroches qui font sourire sans que tu aies l'air de faire un numéro.
> L'article est en premier commentaire.

## 9. Points à porter à Thomas

- **Étalons** : 9 validations (ou refus ciblés) avant le 08/10 conditionnent le départ de LinkedIn le 13/10.
- **Tracabilité** : le drapeau `--echantillon-valide` est déclaratif et les cases des fichiers de préparation sont vides ; confirmer que les échantillons d'octobre et de novembre ont été relus.
- **Stock de vannes** : LinkedIn ajoute environ 4 vannes de bureau par mois aux environ 30 de X et IG ; le stock se recycle en 4 à 5 mois `[HYPOTHÈSE : 125 vannes GARDER]`, d'où la mémoire anti-répétition (C6) et la production de vannes neuves au même rythme.
- **Succès** : dire ce qu'est un succès à 8 semaines (abonnés, visites, inscrits) ; sans seuil absolu, « au-dessus de la médiane » ne mesure qu'un progrès relatif.

## Handoff

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/social/audit-note-s15.md`
- Décisions proposées : note globale 4,0/10 ; priorité 1 = reconnexion Instagram dans Buffer (Thomas) et relecture du statut réel (@fullstack) ; relance 3 réseaux (X 5, IG 5, LinkedIn 2 par semaine) ; 9 étalons à valider ; LinkedIn dès le 13/10 sous condition d'étalons validés.
- Points d'attention : code à modifier par @fullstack (`publish-social/route.ts:68`, `social-controls.ts`, `social-month-plan.ts`, `prepare-social-month.ts`), consigné dans `REPLIT_ACTIONS.md` ; relevé de départ et bios à faire par Thomas ; 30 posts LinkedIn sur 39 non lus.
