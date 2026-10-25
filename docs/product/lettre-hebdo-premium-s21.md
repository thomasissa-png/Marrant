# La lettre hebdomadaire Premium : spécification V1 (s21, 19/10/2026)

> Statut : SPEC V1 COMPLÈTE, prête pour @copywriter, @fullstack, @legal, puis @qa, @data-analyst, @design, @ux. Rien n'est codé, rien n'est déployé, aucun texte n'est validé : tout texte public ci-dessous est une PROPOSITION qui passe la relecture à l'aveugle (règle d'or P0 s18) et l'avis @legal avant d'entrer dans le code.
> Décisions sources : `docs/founder-preferences.md` (17/10 : lettre gratuite 1 fois par mois, hebdomadaire pour les abonnés Premium ; 01/10 : contenu préparé par lot, aucune IA au fil de l'eau ; 08/10 : règle d'or ; 17/10 : « deviens-marrant SAS » là où c'est obligatoire) ; rappel de Thomas du 19/10 : « Une newsletter par mois en gratuit, et pour les abonnés c'est une par semaine. Donc sur un mois les abonnés en ont 4 et les gratuits 1. »
> Avis amont : `docs/legal/lettre-et-questions-s21.md` (L2, Q2, L3, L4, L5, L6, Q8), `docs/product/ta-question-a-l-equipe-s21.md` (T1 à T8, §4 et lot C), `docs/marrant/retour-thomas-s21.md`. Code lu : `apps/web/src/lib/lettre/{envoi,numeros,entretien,inscription,apercu}.ts`, `config/lettre.ts`, `config/textes/lettre-s21.ts`, `lib/analytics/weekly-lettre.ts`, `lib/admin/lettre-inscrits.ts`, `prisma/schema.prisma` (l.1117 à 1195), `data/carnet/2026-11.json`. Vocabulaire protégé : « la lettre » (jamais « newsletter »), « abonné » = Premium payant.
> Marquage : `[HYPOTHÈSE : …]` = non établi, `[À VÉRIFIER : …]` = fait de code ou de contenu que je n'ai pas pu lire, `[À VALIDER @legal]`.

## 0. Synthèse

| Sujet | Décision proposée |
|---|---|
| Promesse | « Chaque semaine dans ta boîte : une scène du carnet, la réplique, pourquoi elle marche et l'exercice. Facultatif, tu l'arrêtes en un clic. » (formulation à passer à l'aveugle, §9) |
| Contenu d'un numéro | Une fiche du carnet Premium reprise mot pour mot (scène, ce qu'on te dit, réplique, pourquoi, sortie polie, exercice) + une accroche de saison de 1 à 2 phrases + un pont facultatif vers une étape de parcours. Zéro offre commerciale. |
| Ce qui la distingue de la mensuelle | La mensuelle = une vanne du catalogue décryptée + un article gratuit + une invitation Premium. L'hebdo = une situation à vivre et une réplique à dire, tirées du carnet réservé à Premium, sans aucune invitation. Aucune matière en commun. |
| Rapport entre les deux | La mensuelle est suspendue SEULEMENT pour un Premium qui a activé l'hebdo (c'est déjà le code de `envoi.ts` l.20 à 24 et l.186 à 202). Un Premium qui n'active pas l'hebdo garde la mensuelle. Il reçoit donc 4 ou 5 lettres par mois avec l'hebdo, 1 sans. Jamais 5 + 1. |
| Rythme | Chaque jeudi, 8 h Paris (comme la mensuelle). 4 jeudis ou 5 selon le mois : la promesse dit « chaque semaine », jamais « 4 par mois ». |
| Stock | 8 numéros VALIDÉS avant l'ouverture, recomplétés par lot trimestriel ; alerte sous 4 ; aucun numéro validé = rien n'est envoyé. |
| Inscription | Opt-in : case JAMAIS cochée sur la page de succès du paiement et dans le profil ; une proposition unique aux abonnés existants ; arrêt en un clic (lien du pied, en-tête `List-Unsubscribe-Post`, profil) sans toucher à l'abonnement. |
| Technique | Réutilise `NewsletterIssue` (audience `HEBDO_PREMIUM` existe déjà), `NewsletterSend`, la réservation avant envoi, le garde-fou d'article publié, le texte seul, Resend sans suivi. Une seule migration : 3 colonnes sur `PremiumLetterPreference`. |
| Premier envoi | Jeudi 12/11/2026 à 8 h (semaine 2026-W46), sous conditions (§3.4). La promesse publique ne passe pas avant la porte G-H (§9.3). |
| À trancher par Thomas | 3 points (§11.1), avec reco. |

## 1. Challenge PM (à lire avant de construire)

1. **Valeur persona** : Yanis (20 ans, introverti) reste muet quand on le chambre. Une scène courte, la réplique et le geste à répéter, reçus au même moment chaque semaine, créent le rituel que le site cherche (15 à 20 min par semaine). Lien avec le North Star (marge nette 3 000 €/mois) : rétention Premium et perception de valeur sur /abonnement. **Les deux liens sont des hypothèses non testées** [HYPOTHÈSE : une lettre hebdomadaire fait baisser la résiliation et monte la conversion de /abonnement]. Avec 2 abonnés (tarif de lancement 0,99 € à vie), aucune statistique n'est possible : lecture qualitative jusqu'à 30 Premium actifs [HYPOTHÈSE : seuil à fixer avec @data-analyst].
2. **Risque de bruit** : le contenu vient du carnet que l'abonné a déjà. Si la lettre répète le carnet sans angle, c'est du bruit. Ce qui justifie le numéro : le choix de saison (Noël en décembre), le rendez-vous fixe, le geste à faire dans la semaine. Sinon elle est écrasée par le carnet : on la supprime plutôt que de la défendre.
3. **Opt-in contre « les abonnés en ont 4 »** : un Premium qui ne coche pas la case n'en reçoit aucune. La phrase de Thomas (« pour les abonnés c'est une par semaine ») est vraie pour ceux qui l'activent. Compensation : case bien placée au paiement, proposition unique aux existants, mensuelle conservée pour les autres. Décision A (§11.1).
4. **Promesse sans livraison** : une fonction « incluse dans l'abonnement » dont le stock s'épuise devient un manquement au contrat. D'où : 8 numéros d'avance, alerte, clause CGU « un numéro peut être décalé ou sauté, sans compensation » [À VALIDER @legal A4], promesse publique seulement quand le premier envoi est possible.
5. **Questions écartées de la V1** : la spec « Ta question à l'équipe » (§4 et lot C) prévoyait un bloc « courrier de la semaine » (question d'un membre anonymisée). Il dépend d'un lot D non construit, de l'accord par extrait (@legal Q4) et de 2 abonnés. **La V1 ne dépend pas des questions.** Le bloc « courrier » s'ajoutera plus tard comme un bloc facultatif du même gabarit, après ouverture des questions. Écart assumé par rapport au §4 de `ta-question-a-l-equipe-s21.md`.
6. **Refusés en V1** (pas de valeur persona démontrée) : personnalisation par étape de parcours (il faudrait lire la progression de chacun : coût de données, risque de contresens), vanne décryptée dans l'hebdo (c'est la signature de la mensuelle), tout contenu produit au fil de l'eau, archive web publique des numéros (contenu Premium), pixel d'ouverture ou lien suivi, « Alex » en signature, mention de prix.

## 2. Promesse et contenu d'un numéro

### 2.1 Mensuelle gratuite et hebdo Premium : ce qui les sépare

| | Mensuelle gratuite (en production) | Hebdo Premium (cette spec) |
|---|---|---|
| Destinataire | toute adresse confirmée (double opt-in), sans compte | abonné Premium actif qui l'a activée |
| Rythme | premier jeudi du mois, 8 h Paris, jamais avant la publication de l'article cité | chaque jeudi, 8 h Paris |
| Matière | une vanne du catalogue + « Pourquoi ça marche » + « À toi de jouer » + un article gratuit | une fiche du carnet : scène, « on te dit », réplique, pourquoi, sortie polie, exercice |
| Invitation commerciale | une seule invitation Premium par numéro | AUCUNE, jamais (L2) |
| Base légale | consentement (CPCE L.34-5, RGPD art. 7) | contrat Premium (art. 6.1.b) ET opt-in conservé (L2) |
| Arrêt | « Me désinscrire » arrête la mensuelle | « Arrêter la lettre » arrête l'hebdo seulement |
| Voix | « L'Équipe Deviens Marrant », tutoiement, « on » | idem |
| Longueur | 200 à 240 mots | 230 mots au plus hors pied [HYPOTHÈSE : une lecture d'une minute] |
| Stock | 6 numéros validés | 8 numéros d'avance, alerte sous 4 |

### 2.2 Gabarit d'un numéro (assemblé par le code, texte seul)

Le corps est assemblé à la synchronisation depuis la fiche du carnet citée : les champs de la fiche sont recopiés tels quels (jamais retapés), seuls l'accroche et le pont sont écrits pour la lettre. Cela garde le texte déjà relu à l'aveugle (carnet validé le 03/10) et réduit ce qui est neuf à relire.

```
Objet      : {fiche.titre}                       (45 caractères au plus ; jamais la réplique)
Pré-en-tête: constante validée une fois           (ex. « La scène de la semaine, la réplique et l'exercice. », à passer à l'aveugle)

Salut,

{accroche : 1 à 2 phrases, saison ou rendez-vous de la semaine, jamais la réplique}

La scène
{fiche.situation}
On te dit : « {fiche.onTeDit} »

Ta réplique
« {fiche.reponse} »

Pourquoi ça marche
{fiche.pourquoi}

Si l'ambiance est tendue
« {fiche.siTendu} »

À toi de jouer
{fiche.exercice}

[facultatif] Pour prolonger : {1 phrase + lien vers une étape de parcours publiée}
Toutes les fiches du mois, dans ton carnet : https://deviens-marrant.fr/carnet?utm_source=lettre-premium&utm_medium=email&utm_content=h{N}-carnet

À la semaine prochaine,
L'Équipe Deviens Marrant

{pied hebdo, §8.4}
```

- Libellés de blocs (« La scène », « Ta réplique », etc.) : [À VÉRIFIER : reprendre ceux de la page /carnet pour ne rien inventer ; sinon @copywriter les soumet à l'aveugle].
- Exemple de correspondance avec une vraie fiche (`data/carnet/2026-11.json`, id `2026-11-01`) : objet « Le vendeur dans ton dos » ; scène « Dans un magasin d'électroménager, tu hésites depuis cinq minutes devant un aspirateur quand le vendeur surgit à ton épaule. » ; on te dit « Il n'en reste que deux, hein. » ; réplique « Ce sont les deux derniers ? Je m'en voudrais de les séparer. ». L'accroche reste à écrire.
- Aucun nombre inventé, aucun prix, aucun « 1 500+ », aucune mention IA, zéro tiret cadratin, zéro émoji, zéro concurrent.

### 2.3 Règles de choix de la fiche (pour @copywriter, contrôlées par le code quand c'est possible)

1. Le mois de la fiche est en ligne au moment de l'envoi (mois du carnet ≤ mois courant, heure de Paris) [À VÉRIFIER : règle de visibilité du carnet dans le code, à reprendre à l'identique].
2. Une fiche n'est jamais envoyée deux fois (contrôle à la synchronisation sur `ficheId`).
3. Pas de fiche déjà montrée en extrait public (l'extrait du carnet de /abonnement, autre page ouverte aux visiteurs) [À VÉRIFIER : quelles fiches sont publiques].
4. Cohérence de saison : décembre = fiches de Noël et de repas de famille si elles existent ; sinon fiche neutre.
5. Une fiche touchant à un sujet sensible (argent, santé, deuil, harcèlement) est écartée du lot.
6. Si aucune fiche du lot n'est au niveau, le numéro n'existe pas : jamais de réplique moyenne pour remplir une semaine.

### 2.4 Règles de contenu vérifiées par le code (blocage à la synchronisation, test Jest)

Le numéro est refusé (ignoré avec message, comme `numeroSchema` pour la mensuelle) si le texte rendu contient : un tiret cadratin, un émoji, le marqueur `[À COMPLÉTER`, le lien `/abonnement`, un `utm_content` se terminant par `-premium`, un symbole `€`, ou l'un des mots `annuel`, `parrain`, `promo`, `remise`, `réduction`, `offre`. Raison : L2, « jamais d'offre commerciale (annuel, parrainage, autre produit) » ; le jour où la lettre en contient, elle devient de la prospection soumise à consentement. La liste de mots est une alerte grossière [HYPOTHÈSE : à affiner avec @legal] ; la relecture humaine reste le vrai contrôle.

## 3. Rythme, stock par lot, calendrier du premier envoi

> **s22, décision de Thomas du 25/10/2026 ([CHOIX UTILISATEUR], remplace toute règle de pause de la mensuelle de cette spec)** : la lettre du mois est l'une des lettres des abonnés Premium. La semaine ISO (Paris) où elle part, les destinataires de la lettre de la semaine la reçoivent (version sans bloc d'invitation, pied et arrêt de la lettre de la semaine, un seul e-mail par adresse) et aucune lettre réservée ne part ; les autres jeudis, une lettre réservée. Lettre du mois due mais pas partie (non approuvée, reportée) : rien ne part pour personne cette semaine-là. Plus de pause ni d'attente. Code : `lib/lettre/envoi.ts` (`semaineDeLaMensuelle`, canal Premium), `lib/lettre/invitation-premium.ts` ; textes : avis @legal §10.

### 3.1 Rythme

- **Jeudi 8 h, heure de Paris** (décision de Thomas du 17/10 pour la mensuelle, reco T3 pour l'hebdo ; constantes `LETTRE_JOUR_ENVOI` et `LETTRE_HEURE_ENVOI_PARIS` de `envoi.ts`, réutilisées sans les dupliquer). Le jour reste une constante : si Thomas change, le texte public suit (§9).
- **Un numéro = une semaine ISO** : `periodKey = "AAAA-Www"` (ex. `2026-W46`), unique par audience. 2026 compte 53 semaines : le jeudi 31/12/2026 est `2026-W53`, le jeudi 07/01/2027 est `2027-W01`. L'année de la clé est celle du jeudi (règle ISO), jamais l'année civile de la date.
- **Pas de rattrapage** : un numéro non parti avant dimanche 23 h 59 (Paris) de sa semaine n'est plus envoyé (la tâche ne lit que la semaine en cours). Il apparaît « non envoyé » dans l'admin et le rapport du lundi. Raison : jamais deux numéros à quelques jours d'écart, et la saisonnalité d'une fiche tient à sa semaine. Dans la semaine, un envoi interrompu reprend au passage suivant (journal par destinataire).
- **4 ou 5 numéros par mois** : jeudis de novembre 2026 = 5, 12, 19, 26 ; de décembre = 3, 10, 17, 24, 31. Jours fériés ou veilles de fête (24 et 31/12) : envoi maintenu [HYPOTHÈSE : pas de pause de fin d'année ; on ne mesure pas les ouvertures, donc rien ne la justifie].

### 3.2 Stock par lot

| Question | Décision |
|---|---|
| Combien de numéros d'avance à l'ouverture | **8 VALIDÉS** (`2026-W46` à `2026-W53`, du 12/11 au 31/12/2026). Reprise du chiffre de la spec questions (T8) ; ici ils sont tous des numéros de carnet, pas des « secours ». |
| Rythme de recomplétion | **Lot trimestriel de 13 numéros**, comme le calendrier de contenu (01/10) ; premier lot suivant : `2027-W01` à `2027-W13` (07/01 au 01/04/2027), livré et validé au plus tard à la semaine `2026-W49` (03/12). Règle générale : le stock VALIDÉ ne tombe jamais sous 4 numéros à venir. |
| Qui écrit | @copywriter, en session : choix des fiches (règles §2.3), accroche (1 à 2 phrases) et pont facultatif (1 phrase). Les champs de la fiche ne sont pas réécrits. |
| Relecture à l'aveugle | (1) Gabarit + pré-en-tête + pied : 2 critiques à l'aveugle + départage, 2 sur 3, UNE fois, puis figés. (2) Chaque lot : pack des accroches et ponts (aucune fiche à relire, déjà validées au carnet), 2 critiques + départage, garde-fou « faute objective » du 08/10 appliqué. (3) @reviewer applique la grille binaire §3.3 sur le numéro assemblé. |
| Qui valide | Thomas : `"statut": "VALIDE"` dans le fichier, « le commit vaut validation » (même mécanique que la mensuelle). Aucun numéro BROUILLON ne part. |
| Si l'aveugle échoue | La fiche est remplacée par une autre, ou le numéro est retiré. Une accroche sous la barre ne revient qu'après nouvelle relecture (règle d'or). Le numéro peut aussi partir sans accroche : le gabarit tient sans elle [HYPOTHÈSE : à tester à l'aveugle au tour 1 du gabarit]. |
| Charge | Environ 40 mots neufs par numéro ; 13 numéros = environ 520 mots à relire par trimestre. Les fiches (environ 100 mots chacune) sont déjà validées. |

### 3.3 Grille de qualité binaire (par numéro, avant `VALIDE`)

Tutoiement et « on » ; zéro tiret cadratin ; zéro émoji ; zéro mention IA ; zéro offre ou prix (§2.4) ; champs de la fiche identiques à `data/carnet/*.json` (test automatique) ; accroche ne donne pas la réplique ; objet de 45 caractères au plus et sans la réplique ; fiche dans un mois du carnet en ligne ; fiche jamais envoyée ; lien vers une étape de parcours : parcours publié et ancre `#etape-N` vérifiée (comme `numeros-1-a-6.md` §1.6) ; libellé de chaque lien = ce que montre la destination ; 230 mots au plus hors pied. Échec d'un critère = réécriture et nouvelle vérification.

### 3.4 Calendrier réaliste du premier envoi

Contraintes connues : Thomas en voyage du 18 au 25/10 (aucune validation avant le 26/10) ; mensuelle n°1 le jeudi 05/11 ; bilan du lot 1 vers le 10/11, puis lot 2 (page /abonnement) en ligne après ; 2 abonnés Premium actifs.

| Jeudi | Verdict |
|---|---|
| 22/10, 29/10 | Impossible : Thomas absent ou à peine rentré, aucun numéro validé. |
| 05/11 | À éviter : même jour que le premier numéro de la mensuelle, 10 jours après le retour de Thomas pour décider, valider 8 numéros et laisser aux abonnés le temps d'activer. Mélanger deux premières mises en route rend un incident illisible. |
| **12/11 (`2026-W46`)** | **Date cible** : deux jours après le bilan du lot 1, 7 jours après la mensuelle n°1 (qui prouve la chaîne d'envoi en vrai). |
| 19/11 | Repli si une condition ci-dessous manque le lundi 09/11. Toute la chaîne est indépendante de la date : on décale `semaine` des 8 numéros, rien d'autre. |

Conditions pour le 12/11 (toutes vraies le lundi 09/11 au soir, sinon repli) :
1. Décisions A, B, C de Thomas reçues (§11.1) ; avis @legal sur les textes §8 reçu, au moins sur A4.
2. Migration jouée, code déployé interrupteurs fermés, `REPLIT_ACTIONS.md` à jour, QA GO, rendu @design et @ux à 10/10 sur captures 375/768/1280 (règle du 07/10).
3. 8 numéros `VALIDE` (relecture à l'aveugle faite, validation de Thomas).
4. Envoi de test réel depuis la production vers un compte de test de Thomas : en-têtes `List-Unsubscribe` présents, arrêt en un clic éprouvé, rendu texte seul vérifié.
5. Inscriptions ouvertes (case visible au paiement et au profil) avec les textes légaux publiés dans le même déploiement, et proposition envoyée aux 2 abonnés existants, au plus tard le lundi 09/11 pour leur laisser 3 jours [HYPOTHÈSE].
6. Si au jeudi 12/11 aucun abonné réel n'a activé, la tâche envoie quand même aux comptes de test activés et la porte G-H (§9.3) reste vérifiable.

Déploiement avant le 10/11 : le code est « masqué » (trois interrupteurs fermés, §6.1) et ne touche ni les articles, ni /abonnement, ni l'en-tête, donc ne trouble pas la mesure du lot 1 [HYPOTHÈSE : à confirmer par Thomas, la spec questions disait « aucun déploiement, même masqué, avant le 10/11 »]. Inclus dans la décision C.

## 4. Inscription et cycle de vie

### 4.1 Principe

Contenu du service ET opt-in (L2) : la case n'est jamais cochée, sur la page de succès du paiement et dans le profil ; le serveur écrit SA constante de version et la date (jamais le texte envoyé par le navigateur, comme `inscription.ts`). Pas de double opt-in par e-mail : la personne est authentifiée par son compte payant, la case est un acte positif distinct, et le premier numéro porte le lien d'arrêt. Aucune inscription automatique à un passage Premium, jamais.

### 4.2 Les cas

| # | Situation | Effet sur `PremiumLetterPreference` | Hebdo | Mensuelle |
|---|---|---|---|---|
| 1 | Paiement réussi, Premium confirmé, case cochée | `enabled=true`, `activatedAt`, `consentVersion`, `activationOrigin="paiement"`, jeton d'arrêt créé | dès le jeudi suivant | suspendue |
| 2 | Paiement réussi, case non cochée | aucune ligne créée | aucune | inchangée |
| 3 | Profil : activation ou arrêt | idem avec `activationOrigin="profil"` ; arrêt : `enabled=false`, `stoppedAt`, `stopOrigin="profil"` | selon le choix | suspendue / reprend |
| 4 | Abonnés existants (2) | une proposition par e-mail, `proposedAt` posé une fois ; le lien ouvre le profil (GET sans effet), la case reste à cocher | après leur clic | inchangée tant que non activée |
| 5 | Arrêt par le lien du pied ou l'en-tête `List-Unsubscribe-Post` | `enabled=false`, `stoppedAt`, `stopOrigin="lien-email"` | s'arrête, abonnement Stripe intact | reprend si l'adresse est `CONFIRMED` |
| 6 | Fin de Premium (résiliation effective, remboursement, impayé terminé ; plan ≠ PREMIUM) | rapprochement quotidien : `enabled=false`, `stopOrigin="fin-premium"` ; avant le rapprochement, le test de plan à l'envoi suffit à l'exclure | s'arrête | reprend si `CONFIRMED` ; jamais de réinscription d'un `UNSUBSCRIBED` (L2a) |
| 6b | Résiliation demandée mais période payée en cours (`cancelAtPeriodEnd`) | inchangé | continue jusqu'à la fin de période | suspendue |
| 6c | `PAST_DUE` (Premium gardé pendant les relances, règle s16) | inchangé | continue | suspendue [HYPOTHÈSE : cohérent avec l'accès Premium conservé] |
| 7 | Réabonnement | la ligne reste `enabled=false` ; aucune réactivation automatique ; la case réapparaît décochée à la page de succès | aucune tant que non recochée | inchangée |
| 8 | Compte supprimé | ligne supprimée en cascade (`onDelete: Cascade` existe) ; lignes `NewsletterSend` de l'hebdo pour cette adresse supprimées dans la même opération | stop | la mensuelle est un consentement séparé, sans compte : elle n'est pas touchée, la page de suppression le dit [À VALIDER @legal] |
| 9 | Compte de test (`emailsExclus()`) | peut activer comme tout le monde (c'est ainsi que Thomas vérifie le rendu) | reçoit | exclu aussi |
| 10 | Opposition globale (`User.emailOptOut`) | inchangé | exclu SAUF si `activatedAt` est postérieur à l'opposition (nouvel acte positif tracé, L6) | idem |
| 11 | Adresse du compte jamais vérifiée | inchangé | pas d'envoi, et le profil le dit [HYPOTHÈSE : prudence ; @fullstack tranche d'après le code d'auth, à vérifier] | |
| 12 | « stop » reçu par e-mail à contact@ | action admin « Arrêter » : `stopOrigin="admin"` | s'arrête | traité sous un mois ; un « plus aucun e-mail » devient opposition globale (L6) |
| 13 | Changement d'adresse du compte | l'envoi suit `User.email` | continue | |

**Règle d'or de cohérence** : le test « reçoit l'hebdo » est UNE fonction, utilisée par la tâche d'envoi hebdo ET par l'exclusion de la mensuelle (`listesExclusion` de `envoi.ts`). Sinon un Premium peut ne recevoir ni l'une ni l'autre (exclu de la mensuelle mais pas destinataire de l'hebdo) ou les deux. Test imposé : « aucun Premium n'est exclu de la mensuelle sans être destinataire du prochain numéro hebdo valide ». Exception assumée : si aucun numéro n'est `VALIDE` un jeudi, l'abonné n'en reçoit pas cette semaine (alerte admin, §6.5).

**Cas limites de date** : l'exclusion de la mensuelle ne s'applique que si `LETTRE_HEBDO_ENVOIS_OUVERTS` est vrai ; avant le premier envoi hebdo, un abonné qui a activé reçoit encore la mensuelle du 05/11.

## 5. User stories

Conventions : RICE chiffré sur hypothèses (effort quasi nul, priorité = Impact × Confiance) : R = 2 abonnés actifs, 100 % de la base payante ; I = 2 (sur 3) ; C = 50 % [HYPOTHÈSES, §1.1] ; score I × C = 1,0 pour toutes les stories, l'ordre vient des dépendances (§10). Epic : « Lettre hebdomadaire Premium ». Persona principal : Yanis ; Sophie et Marc en scénarios secondaires. Stories sans interface (H4 à H6, H8) : gabarit allégé, les blocs sans objet portent « N/A, story sans UI ». Textes publics ci-dessous = PROPOSITIONS à relire à l'aveugle.

**Textes de la case (proposition, version `lettre-hebdo-premium-v1`, stockée côté serveur)**
- Libellé : « Oui, je veux recevoir la lettre de la semaine, chaque jeudi : une scène du carnet, la réplique et l'exercice. Elle fait partie de mon abonnement et je peux l'arrêter en un clic, sans le résilier. »
- Ligne sous la case : « Tant que tu la reçois, la lettre du mois est suspendue : une lettre par semaine, pas deux. Elle arrive à {e-mail du compte}. Détails et droits : Confidentialité. »

### US-H1 : Activer la lettre au paiement
**Persona** : Yanis | **Epic** : Lettre hebdomadaire Premium | **Dépendances** : H4 (envoi), H5 (stock), H8 (porte) ; page de succès du paiement existante | **RICE : 2/2/50 %/~0 → I×C 1,0**
#### Job-to-be-done
En tant que Yanis, je veux choisir au moment où je m'abonne de recevoir une scène et une réplique chaque semaine afin de m'entraîner sans y penser et de garder mon abonnement (rétention Premium, North Star).
#### Contexte de navigation
Origine : retour de Stripe vers la page de succès, Premium confirmé. Déclencheur : la case décochée sous le message de succès. Destination succès : même page, message « C'est noté », CTA existant vers la suite inchangé. Destination échec : même page, message d'erreur, choix reportable au profil (H2).
#### Données et champs
| Champ | Type | Obligatoire | Validation | Limites | Exemple réaliste |
|---|---|---|---|---|---|
| Recevoir la lettre de la semaine | case | non, jamais cochée | booléen | texte versionné écrit par le serveur | décochée par défaut ; cochée par Yanis |
| Origine | enum serveur | oui | `paiement` | non modifiable par le navigateur | `paiement` |
| Adresse d'envoi | lecture seule | n/a | e-mail du compte | affichée, non éditable ici | `yanis.m@exemple.fr` |
#### 5 états UI
| État | Contenu |
|---|---|
| Défaut | Case décochée, libellé et ligne sous la case, e-mail affiché. |
| Loading | Case désactivée, libellé « Enregistrement… », 5 s au plus puis état erreur. |
| Vide | Paiement encore en cours de confirmation : case ABSENTE, texte existant de la page conservé ; la case apparaît quand Premium est confirmé. |
| Erreur | « L'enregistrement n'a pas abouti, et c'est de notre côté. La case est décochée : réessaie dans un instant, ou règle-le depuis ton profil. » |
| Succès | « C'est noté. Tu la recevras chaque jeudi, à {e-mail}. Tu peux l'arrêter à tout moment depuis ton profil. » (lecteur d'écran : région `aria-live`). |
#### Critères d'acceptance (Given / When / Then)
| ID | Critère |
|---|---|
| H1-1 | Given Premium confirmé et inscription ouverte, When la page s'affiche, Then la case est présente et décochée (aucun attribut coché, aucune valeur par défaut vraie). |
| H1-2 | Given la case cochée, When l'enregistrement réussit, Then 200, `enabled=true`, `consentVersion="lettre-hebdo-premium-v1"`, `activationOrigin="paiement"`, `activatedAt` posé, jeton d'arrêt présent. |
| H1-3 | Given l'activation et un numéro `VALIDE` pour la semaine, When le jeudi 8 h arrive, Then un seul e-mail part et la mensuelle du mois ne part pas pour cette adresse. |
| H1-4 | Given la case cochée puis décochée, When l'enregistrement réussit, Then `enabled=false`, `stoppedAt` posé, `stopOrigin="paiement"`, aucun e-mail le jeudi. |
| H1-5 | Given le choix de ne rien cocher, When Yanis continue, Then aucune ligne n'est créée (ou `enabled=false` si elle existait). |
| H1-6 | Given une erreur serveur, When il coche, Then la case redevient décochée, le message d'erreur exact s'affiche, aucune donnée n'est écrite. |
| H1-7 | Given une session expirée, When il coche, Then 401, message « Ta session a expiré. Reconnecte-toi pour régler la lettre. » avec lien vers `/login?callbackUrl=/profil`, aucun changement. |
| H1-8 | Given deux coches en moins d'une seconde, When les requêtes arrivent, Then une seule écriture d'activation, état final = dernière intention. |
| H1-9 | Given un visiteur puis un membre non Premium, When l'API est appelée, Then 401 puis 403. |
| H1-10 | Given un réabonné dont la ligne est `enabled=false` et `stopOrigin="fin-premium"`, When la page s'affiche, Then la case est décochée ; après coche : `stoppedAt=null`, `stopOrigin=null`, `activatedAt=maintenant`. |
| H1-11 | Given l'inscription fermée, When la page s'affiche ou que l'API est appelée, Then la case est absente et l'API répond 404. |
#### Payload API
`PUT /api/lettre-premium/preference` : session NextAuth ; limite 10 par minute et par compte [HYPOTHÈSE], limiteur partagé `lib/rate-limit.ts`. Requête `{ "enabled": boolean, "origine": "paiement" | "profil" }`. Réponses : 200 `{ "enabled": boolean, "mensuelleSuspendue": boolean }` (idempotent : même valeur, pas de réécriture de `activatedAt`) ; 400 corps invalide ; 401 non connecté ; 403 plan ≠ PREMIUM ou statut ni ACTIVE ni PAST_DUE ; 404 inscription fermée ; 429 ; 500. Le texte de consentement n'est jamais lu dans la requête.
#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `lettre-hebdo-case-vue` | case affichée | `emplacement=paiement` | vue |
| `lettre-hebdo-activee` | 200 avec `enabled=true` | `origine` | activation |
| `lettre-hebdo-echec` | 401, 403 ou 5xx | `raison=session\|non-premium\|reseau` | échec |
Aucune donnée personnelle ; la base fait foi ; comptes de test exclus (`emailsExclus()`).
#### Scénarios persona concrets
1. **Yanis, 20 ans, mercredi 22 h 10, téléphone en 375 px** : vient de payer l'abonnement mensuel. Il voit la case sous « Bienvenue dans Premium », la coche, lit « C'est noté. Tu la recevras chaque jeudi, à yanis.m@exemple.fr. » Jeudi 8 h il reçoit sa première scène.
2. **Sophie, 26 ans, pause déjeuner** : paie l'annuel, ne regarde pas la case, appuie sur le CTA. Rien n'est créé ; elle garde la lettre du mois à laquelle elle est inscrite depuis un article.
3. **Marc, 34 ans** : coche par erreur, décoche aussitôt. Ligne `enabled=false`, `stopOrigin="paiement"` ; le jeudi, rien ne part.
4. **Yanis sur le wifi d'une résidence étudiante** : la requête dépasse 5 s ; la case se décoche, message d'erreur ; le lendemain il active depuis son profil (H2).
5. **Sophie, réabonnée en janvier après une résiliation en décembre** : la ligne dit `enabled=false`, `fin-premium` ; la case est décochée ; elle coche ; elle reçoit le jeudi suivant le numéro de la semaine, pas de rattrapage des numéros manqués.
6. **Marc, webhook Stripe en retard de 40 secondes** : la page dit « On finalise ton paiement » (texte existant) ; la case apparaît à la confirmation, sans rechargement manuel [À VÉRIFIER : mécanisme de la page].
#### Definition of Done
UI 5 états ; API testée (401, 403, 404, 429, idempotence) ; scénarios 1 à 6 reproductibles ; test E2E Playwright référencé (375 px) ; capture conforme @design et @ux 10/10.
#### Notes
@qa : tester l'absence de pré-cochage dans le HTML serveur. @ux : la case ne doit pas rivaliser avec le CTA principal (lien-case secondaire). @fullstack : [À VÉRIFIER : fichier et états de la page de succès du paiement].

### US-H2 : Régler la lettre depuis le profil
**Persona** : Marc | **Epic** : Lettre hebdomadaire Premium | **Dépendances** : H1 (API) | **RICE : 2/2/50 %/~0 → I×C 1,0**
#### Job-to-be-done
En tant que Marc, je veux activer ou arrêter la lettre de la semaine quand je veux, sans résilier, afin de garder la main sur ma boîte et de rester abonné.
#### Contexte de navigation
Origine : `/profil`, section « La lettre de la semaine » sous la carte abonnement ; aussi lien de l'e-mail de proposition (ouvre `/profil#lettre`, sans effet à l'ouverture). Destination succès : même section mise à jour. Destination échec : même section, erreur.
#### Données et champs
| Champ | Type | Obligatoire | Validation | Limites | Exemple réaliste |
|---|---|---|---|---|---|
| Recevoir la lettre de la semaine | case | non | booléen | version serveur | cochée par Marc |
| Statut | texte lecture seule | n/a | calculé | « Activée depuis le 12 novembre 2026 » (date en français, repli sans date si absente) | idem |
| Fin prévue | texte lecture seule | n/a | `cancelAtPeriodEnd` vrai | « Elle s'arrêtera avec ton abonnement le {date} » | `[À VÉRIFIER : champ de fin de période]` |
#### 5 états UI
| État | Contenu |
|---|---|
| Défaut | Case selon l'état réel, libellé et ligne sous la case (§5 en tête). |
| Loading | Case désactivée, « Enregistrement… », 5 s au plus. |
| Vide | Membre non Premium : section ABSENTE (aucune promesse dans le profil, §9.2). |
| Erreur | Message de H1 (« … La case est restée dans son état précédent. »). |
| Succès | « C'est noté. » (activation) ou « C'est arrêté. Ton abonnement continue. » (arrêt). |
#### Critères d'acceptance
| ID | Critère |
|---|---|
| H2-1 | Given Premium sans ligne, When le profil s'ouvre, Then la case est décochée, statut « Pas activée ». |
| H2-2 | Given la case cochée, When l'enregistrement réussit, Then `activationOrigin="profil"`, `activatedAt` posé, statut « Activée depuis le {date} ». |
| H2-3 | Given une lettre activée, When Marc décoche, Then `enabled=false`, `stopOrigin="profil"`, l'abonnement Stripe est inchangé, la mensuelle reprend si l'adresse est `CONFIRMED`. |
| H2-4 | Given l'arrivée depuis l'e-mail de proposition, When la page s'ouvre, Then aucune écriture n'a lieu (GET sans effet) et le focus va à la section. |
| H2-5 | Given `cancelAtPeriodEnd` vrai, When la section s'affiche, Then la ligne « Elle s'arrêtera avec ton abonnement le {date} » est présente. |
| H2-6 | Given une erreur serveur, When Marc coche, Then retour à l'état précédent et message d'erreur. |
| H2-7 | Given une session expirée, When Marc coche, Then redirection vers `/login?callbackUrl=/profil` ; choix non perdu : aucune écriture. |
| H2-8 | Given un double clic, When deux requêtes partent, Then une seule écriture. |
| H2-9 | Given un membre non Premium ou un visiteur, When il ouvre `/profil` ou appelle l'API, Then la section est absente (membre) ; 401 (visiteur) ; 403 (API membre). |
| H2-10 | Given une adresse jamais vérifiée, When la section s'affiche, Then la ligne « Confirme ton adresse e-mail pour recevoir la lettre » remplace la case [HYPOTHÈSE, §4.2 cas 11]. |
#### Payload API
`GET /api/lettre-premium/preference` : session ; 200 `{ "eligible": boolean, "enabled": boolean, "activatedAt": string|null, "mensuelleSuspendue": boolean, "finPrevue": string|null }` ; 401. `PUT` : voir H1.
#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `lettre-hebdo-case-vue` | section visible à l'écran | `emplacement=profil` | vue |
| `lettre-hebdo-activee` | activation | `origine=profil` | activation |
| `lettre-hebdo-arretee` | arrêt | `origine=profil` | désactivation |
#### Scénarios persona concrets
1. **Marc, 34 ans, dimanche soir, ordinateur** : ouvre son profil, coche la case, lit « Activée depuis le 15 novembre 2026 ».
2. **Yanis, après avoir ouvert l'e-mail de proposition reçu à 9 h** : arrive sur `/profil#lettre`, rien n'est activé tant qu'il ne coche pas.
3. **Sophie, jeudi 8 h 05, trouve que c'est trop** : décoche ; l'abonnement continue ; le jeudi suivant elle reçoit la lettre du mois si elle y est inscrite.
4. **Marc, résiliation en fin de période** : voit « Elle s'arrêtera avec ton abonnement le 3 décembre 2026 ».
5. **Yanis, session expirée pendant qu'il lisait** : coche, est renvoyé au login, revient sur le profil, la case est toujours décochée (aucune écriture fantôme).
#### Definition of Done
UI 5 états ; API testée ; scénarios 1 à 5 ; E2E Playwright (375 et 1280 px) ; capture conforme.
#### Notes
@ux : ne pas ajouter d'incitation à rester (aucun « Tu vas rater… »). @qa : test de non-régression de la carte abonnement. @fullstack : [À VÉRIFIER : champ de date de fin de période dans `Subscription`].

### US-H3 : Arrêter la lettre en un clic depuis l'e-mail
**Persona** : Sophie | **Epic** : Lettre hebdomadaire Premium | **Dépendances** : H4 (le pied et les en-têtes sont posés à l'envoi) | **RICE : 2/2/50 %/~0 → I×C 1,0**
#### Job-to-be-done
En tant que Sophie, je veux arrêter la lettre depuis l'e-mail, sans me connecter et sans toucher à mon abonnement, afin de rester abonnée sans recevoir ce que je ne lis plus (confiance, rétention).
#### Contexte de navigation
Origine : lien du pied d'un numéro, ou bouton « Se désabonner » du client de messagerie (en-tête `List-Unsubscribe-Post`, immédiat). Destination succès : page « C'est arrêté ». Destination échec : page « Ce lien ne fonctionne plus » avec lien vers le profil. Page `noindex`, `Referrer-Policy: no-referrer`, jeton hors statistiques (même traitement que `/lettre/confirmer`, L5).
#### Données et champs
| Champ | Type | Obligatoire | Validation | Limites | Exemple réaliste |
|---|---|---|---|---|---|
| Jeton `t` | paramètre d'URL | oui | opaque, 43 caractères d'un alphabet URL-safe [HYPOTHÈSE : même générateur que `generateOpaqueToken`] | stable pour la vie de la ligne | `t=Q3x…` |
| Bouton « Arrêter la lettre » | action POST | oui | corps `{ "t": string }` | une fois | un tap |
#### 5 états UI
| État | Contenu |
|---|---|
| Défaut | Titre « Arrêter la lettre de la semaine ? », texte « Tu ne recevras plus la lettre de la semaine. Ton abonnement Premium continue, ainsi que les e-mails de ton compte et de ton abonnement (facture, sécurité, rappel avant un renouvellement annuel). », bouton « Arrêter la lettre ». |
| Loading | Bouton « Arrêt en cours… » désactivé, 5 s au plus. |
| Vide | Déjà arrêtée : « La lettre de la semaine est déjà arrêtée. Tu peux la reprendre depuis ton profil. » |
| Erreur | Jeton inconnu : « Ce lien ne fonctionne plus. Tu peux régler la lettre depuis ton profil, ou écrire à contact@deviens-marrant.fr. » ; erreur serveur : « L'arrêt n'a pas abouti, et c'est de notre côté. Réessaie dans un instant. » |
| Succès | « C'est arrêté. Tu ne recevras plus la lettre de la semaine, et ton abonnement continue. Si tu es inscrit à la lettre du mois, elle reprend. Tu peux reprendre la lettre de la semaine depuis ton profil quand tu veux. » |
#### Critères d'acceptance
| ID | Critère |
|---|---|
| H3-1 | Given un lien valide, When la page s'ouvre en GET, Then aucun statut ne change (un scanner de liens ne désactive personne). |
| H3-2 | Given la page, When Sophie touche « Arrêter la lettre », Then 200, `enabled=false`, `stoppedAt` posé, `stopOrigin="lien-email"`. |
| H3-3 | Given le client de messagerie, When il envoie `POST` avec `List-Unsubscribe=One-Click` à l'URL de l'en-tête, Then même effet, sans page. |
| H3-4 | Given l'arrêt, When l'abonnement Stripe est lu, Then il est inchangé. |
| H3-5 | Given l'arrêt, When la mensuelle part, Then Sophie la reçoit si son adresse est `CONFIRMED` ; sinon rien ne lui est inscrit. |
| H3-6 | Given un jeton inconnu, When la page s'ouvre ou qu'un POST arrive, Then 404 sur le POST, texte d'erreur générique sans fuite (pas de « compte inexistant »). |
| H3-7 | Given une ligne déjà arrêtée, When le POST arrive, Then 200 sans réécrire `stoppedAt`. |
| H3-8 | Given plus de 20 requêtes par minute depuis une IP, When elles arrivent, Then 429. |
| H3-9 | Given l'ancien lien d'un numéro reçu avant une réactivation, When Sophie le touche, Then il arrête la lettre (jeton stable). |
| H3-10 | Given le module fermé (`INSCRIPTION_OUVERTE` faux), When un lien d'arrêt est touché, Then l'arrêt FONCTIONNE quand même (comme la désinscription de la mensuelle, toujours possible). |
#### Payload API
`POST /api/lettre-premium/arret` (corps `{ "t": string }`, sans session) : 200 `{ "arretee": true }` ; 404 jeton inconnu ; 429. `POST /api/lettre-premium/arret-un-clic?t=…` (RFC 8058, sans session) : 200 ; 404 ; 429.
#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `lettre-hebdo-arret-vu` | page affichée | aucune | arrêt |
| `lettre-hebdo-arretee` | 200 | `origine=lien-email` | arrêt |
Jamais le jeton ni l'adresse dans un événement ; page exclue des statistiques par jeton.
#### Scénarios persona concrets
1. **Sophie, 26 ans, téléphone, jeudi 8 h 02** : touche « Se désabonner » dans Gmail ; immédiat ; le jeudi suivant rien ne part pour elle.
2. **Marc, ordinateur, lien du pied** : arrive sur la page, touche le bouton, lit « C'est arrêté ».
3. **Un antivirus d'entreprise ouvre tous les liens du numéro de Yanis** : en GET, rien ne change ; Yanis reçoit le numéro suivant.
4. **Yanis, lien copié de l'e-mail de décembre, utilisé en février** : le lien marche encore, il est déjà arrêté, il lit « déjà arrêtée ».
5. **Sophie ne retrouve plus le lien (e-mail supprimé)** : elle écrit « stop » à contact@ ; l'admin l'arrête (`stopOrigin="admin"`), traité sous un mois.
#### Definition of Done
UI 5 états ; API testée ; scénarios 1 à 5 ; E2E Playwright ; capture conforme ; test de l'en-tête sur un numéro réel envoyé en production (§3.4 condition 4).
#### Notes
@qa : tester le GET sans effet avec un robot ; vérifier `List-Unsubscribe` et `List-Unsubscribe-Post` dans les en-têtes bruts. @legal : le périmètre (arrête l'hebdo seulement) est écrit dans la page (L6).

### US-H4 : Envoyer le numéro du jeudi
**Persona** : Yanis | **Epic** : Lettre hebdomadaire Premium | **Dépendances** : H1 (préférences), H5 (numéros), config et migration | **RICE : 2/2/50 %/~0 → I×C 1,0**
#### Job-to-be-done
En tant que Yanis, je veux recevoir chaque jeudi à 8 h, une seule fois, la scène de la semaine afin de garder le rituel d'entraînement qui justifie mon abonnement.
#### Contexte de navigation / Données et champs / 5 états UI
N/A, story sans UI (tâche planifiée).
#### Critères d'acceptance
| ID | Critère |
|---|---|
| H4-1 | Given `LETTRE_HEBDO_ENVOIS_OUVERTS` faux, When la tâche passe, Then rien ne part. |
| H4-2 | Given un numéro `VALIDE` de la semaine ISO courante, `scheduledFor` atteint, interrupteur ouvert, When la tâche passe, Then les destinataires reçoivent un e-mail texte seul. |
| H4-3 | Given le jeudi avant 8 h (Paris, heure d'hiver comme d'été), When la tâche passe, Then rien ne part. |
| H4-4 | Given la tâche relancée ou concurrente, When deux passages traitent le même numéro, Then chaque adresse reçoit un seul e-mail (ligne `NewsletterSend` réservée avant l'envoi, unique par numéro et adresse). |
| H4-5 | Given un destinataire en échec Resend, When le passage suivant arrive, Then retenté jusqu'à `LETTRE_ESSAIS_MAX` (3) ; le numéro passe `ENVOYE` quand plus rien n'est à faire. |
| H4-6 | Given un marqueur `[À COMPLÉTER` dans l'objet, le pré-en-tête, le corps ou le pied, When la tâche passe, Then rien ne part et le numéro est signalé `bloque`. |
| H4-7 | Given un article du blog cité (`deviens-marrant.fr/blog/<slug>`) hors ligne, When la tâche passe, Then le numéro est reporté au créneau valable (même garde-fou `etatArticlesCites`). |
| H4-8 | Given une fiche dont le mois du carnet n'est pas en ligne, ou une étape de parcours non publiée, When la tâche passe, Then le numéro est reporté (même mécanique), jamais de lien mort. |
| H4-9 | Given aucun numéro `VALIDE` pour la semaine, When la tâche passe, Then rien ne part, une alerte admin est posée (1 e-mail admin par jour au plus, règle du 06/10). |
| H4-10 | Given un Premium sans ligne ou `enabled=false`, un plan ≠ PREMIUM, une opposition globale antérieure à l'activation, ou une adresse jamais vérifiée, When la tâche passe, Then il n'est pas destinataire. |
| H4-11 | Given un numéro non parti avant dimanche 23 h 59 de sa semaine, When la semaine suivante commence, Then il n'est plus envoyé. |
| H4-12 | Given chaque e-mail, When il part, Then il porte `List-Unsubscribe` et `List-Unsubscribe-Post`, le pied légal, le suivi d'ouverture et de clic est désactivé chez Resend (B4), et le lien d'arrêt est propre au destinataire. |
| H4-13 | Given le numéro rendu, When il est contrôlé, Then il ne contient ni `/abonnement`, ni prix, ni mot de la liste §2.4. |
#### Payload API
N/A (tâche interne `lettre-hebdo-premium`, passage toutes les 15 minutes comme le planificateur ; verrou de passage `lettre-hebdo-AAAA-Www` via `JobLock` en plus de la réservation par adresse). Lots de 200 destinataires par passage (`LETTRE_LOT_PAR_PASSAGE`).
#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| (journal) | fin de passage | envoyés, échecs, exclus, reporté, bloqué | envoi |
Pas d'événement Umami d'ouverture ou de clic : B4.
#### Scénarios persona concrets
1. **Yanis, jeudi 12/11 à 8 h 00** : reçoit « Le vendeur dans ton dos » si cette fiche a été retenue ; un seul e-mail.
2. **Marc, qui a coupé la lettre mardi** : rien jeudi, ni de la mensuelle si elle n'est pas due.
3. **Sophie, Premium non activée mais inscrite à la mensuelle** : reçoit la mensuelle le premier jeudi du mois et jamais l'hebdo.
4. **Panne Resend 20 minutes à 8 h** : les adresses en échec sont retentées aux passages suivants, aucune ne reçoit deux fois.
5. **Semaine sans numéro validé** : personne ne reçoit rien, Thomas reçoit une alerte, le rapport du lundi la rappelle.
#### Definition of Done
Tests Jest (tous les critères) ; non-régression des tests de la mensuelle ; envoi réel de test en production ; journal consigné dans `REPLIT_ACTIONS.md`.
#### Notes
@fullstack : extraire la boucle « réserver puis envoyer » de `envoyerLettreDuMois` en fonction commune plutôt que la copier (une seule logique de verrou), les tests de la mensuelle (`lettre-envoi-s21.test.ts`, `lettre-planificateur-s21.test.ts`) doivent rester verts tels quels.

### US-H5 : Préparer et valider le stock de numéros
**Persona** : Yanis (bénéficiaire) ; Thomas valide | **Epic** : Lettre hebdomadaire Premium | **Dépendances** : carnet, décisions A à C | **RICE : 2/2/50 %/~0 → I×C 1,0**
#### Job-to-be-done
En tant que Yanis, je veux qu'aucun jeudi ne parte avec un contenu moyen ou absent afin que la lettre garde la barre du site.
#### Contexte de navigation / Données et champs / 5 états UI
N/A, story sans UI. Données : `apps/web/src/data/lettre/hebdo-premium.json`, une entrée par numéro : `semaine` (« 2026-W46 »), `ficheId` (id carnet, ex. « 2026-11-01 »), `accroche`, `pont` facultatif `{ texte, lien }`, `objet` et `preEntete` facultatifs (défauts : titre de la fiche, constante), `statut` (`BROUILLON` | `VALIDE`). `envoiPrevu` n'est PAS saisi : le code le calcule (jeudi 8 h Paris de la semaine ISO), ce qui supprime l'incohérence date/semaine.
#### Critères d'acceptance
| ID | Critère |
|---|---|
| H5-1 | Given une entrée valide, When le démarrage synchronise, Then un `NewsletterIssue` d'audience `HEBDO_PREMIUM` et de `periodKey` = `semaine` est créé avec le corps assemblé. |
| H5-2 | Given une entrée déjà `ENVOYE`, When la synchronisation passe, Then elle n'est JAMAIS modifiée. |
| H5-3 | Given une `ficheId` inconnue, un mois de carnet absent ou une fiche déjà envoyée, When la synchronisation passe, Then l'entrée est ignorée avec un message. |
| H5-4 | Given un tiret cadratin, un émoji, `/abonnement`, `€` ou un mot interdit (§2.4), When la synchronisation passe, Then l'entrée est ignorée avec la liste des champs fautifs. |
| H5-5 | Given une `semaine` mal formée ou une 53e semaine inexistante, When la synchronisation passe, Then l'entrée est ignorée. |
| H5-6 | Given le corps assemblé, When il est comparé à la fiche du carnet, Then les champs recopiés sont identiques caractère pour caractère (test automatique). |
| H5-7 | Given moins de 4 numéros `VALIDE` à venir, When le rapport du lundi ou la tâche passe, Then une alerte « stock sous 4 » est posée. |
| H5-8 | Given un numéro `BROUILLON`, When la tâche d'envoi passe, Then il ne part pas. |
| H5-9 | Given l'aperçu public de la mensuelle (`lireApercuLettre`), When l'hebdo existe, Then il ne l'expose JAMAIS (filtre `audience: "MENSUELLE"`, test dédié) : l'hebdo est du contenu Premium. |
| H5-10 | Given le contrôle de démarrage (équivalent de `controlerDatesPlancher`), When un numéro à venir cite une fiche, un article ou une étape non publiés à sa date, Then une alerte est journalisée dès le déploiement. |
#### Payload API
N/A.
#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| (journal de démarrage) | synchronisation | créés, mis à jour, ignorés, stock à venir | production |
#### Scénarios persona concrets
1. **Thomas, 26/10, relit 8 accroches** : passe les 8 numéros à `VALIDE` dans un commit ; au démarrage, 8 créés.
2. **Un numéro cite par erreur un article programmé le 20/11, envoi prévu le 12/11** : alerte au démarrage ; le numéro est reporté si l'erreur subsiste.
3. **Le stock tombe à 3 numéros le 3/12** : alerte ; le lot 2 (13 numéros) est livré.
4. **Yanis (jamais exposé)** : l'aperçu de `/lettre` ne montre pas le numéro hebdo.
5. **Un numéro modifié après envoi** : ignoré, le message le dit.
#### Definition of Done
Tests Jest des critères ; fichier de 8 numéros `VALIDE` après relecture à l'aveugle ; alerte vérifiée.
#### Notes
@copywriter : relire `docs/copy/lettre-mensuelle-s21/pack-relecture-n1.md` pour le format des packs ; @reviewer applique la grille §3.3.

### US-H6 : Suivre la vie de l'abonnement (fin, réabonnement, compte supprimé, proposition aux abonnés existants)
**Persona** : Sophie | **Epic** : Lettre hebdomadaire Premium | **Dépendances** : H1, H4 | **RICE : 2/2/50 %/~0 → I×C 1,0**
#### Job-to-be-done
En tant que Sophie, je veux que la lettre s'arrête quand mon abonnement s'arrête, ne revienne jamais sans mon accord et disparaisse avec mon compte afin de ne jamais recevoir un e-mail que je n'ai pas demandé.
#### Contexte de navigation / Données et champs / 5 états UI
N/A, story sans UI, sauf la proposition aux existants : un e-mail transactionnel court, brouillon rédigé par @copywriter, validé à l'aveugle puis par Thomas, envoyé depuis l'admin par une action « Envoyer la proposition » avec aperçu du texte (aucun envoi direct, règle commune 10). Contenu : ce qu'est la lettre, qu'elle fait partie de l'abonnement, qu'elle est facultative, lien vers `/profil#lettre`, aucun prix, aucune offre. Signature « L'Équipe Deviens Marrant ».
#### Critères d'acceptance
| ID | Critère |
|---|---|
| H6-1 | Given une ligne `enabled=true` et un plan qui passe à FREE (fin de période, remboursement, impayé terminé), When le rapprochement quotidien passe, Then `enabled=false`, `stopOrigin="fin-premium"`, `stoppedAt` posé. |
| H6-2 | Given ce même passage de plan et le rapprochement pas encore passé, When le jeudi arrive, Then l'adresse n'est pas destinataire (test de plan à l'envoi). |
| H6-3 | Given `cancelAtPeriodEnd` vrai et période en cours, When le jeudi arrive, Then le numéro part. |
| H6-4 | Given un abonné `PAST_DUE`, When le jeudi arrive, Then le numéro part (Premium gardé pendant les relances) [HYPOTHÈSE, §4.2 cas 6c]. |
| H6-5 | Given une fin de Premium, When la mensuelle suivante part, Then l'adresse la reçoit si elle est `CONFIRMED` ; un `UNSUBSCRIBED` n'est jamais réinscrit. |
| H6-6 | Given un réabonnement, When la page de succès s'affiche, Then la lettre n'est PAS réactivée et la case est décochée. |
| H6-7 | Given une suppression de compte, When elle se termine, Then la ligne de préférence et les lignes `NewsletterSend` de l'hebdo pour cette adresse n'existent plus. |
| H6-8 | Given une suppression de compte, When la mensuelle part, Then l'abonnement à la mensuelle (consentement séparé, sans compte) n'est pas modifié. |
| H6-9 | Given un abonné existant sans ligne et `proposedAt` vide, When Thomas envoie la proposition, Then un seul e-mail part et `proposedAt` est posé ; un second envoi est refusé (409). |
| H6-10 | Given une opposition globale antérieure à une activation, When la tâche choisit les destinataires, Then l'activation postérieure fait foi (L6), l'opposition antérieure ne bloque plus. |
| H6-11 | Given des lignes `NewsletterSend` de l'hebdo de plus de 12 mois, When l'entretien quotidien passe, Then elles sont supprimées (Q3, journal 12 mois). |
#### Payload API
Admin : `POST /api/admin/lettre-premium/proposition` (jeton admin, comme `api/admin/*`) : corps `{ "userIds": string[] }` ; 200 `{ "envoyes": number, "ignores": number }` ; 401 sans jeton ; 409 si déjà proposée ; 429. Jamais d'e-mail dans les journaux.
#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `lettre-hebdo-arretee` | rapprochement | `origine=fin-premium` (serveur, base faisant foi) | désactivation |
| (compteur) | proposition envoyée | nombre | proposition |
#### Scénarios persona concrets
1. **Sophie résilie le 1er décembre, période payée jusqu'au 3** : reçoit le numéro du 3/12 ; le 4/12 la ligne passe `fin-premium`.
2. **Sophie se rembourse sous 14 jours** : Premium coupé ; aucun numéro le jeudi ; la mensuelle reprend si inscrite.
3. **Marc supprime son compte le mercredi** : jeudi rien ne part ; les lignes d'envoi de l'hebdo pour son adresse sont effacées ; son inscription à la mensuelle, indépendante, est conservée et la page de suppression l'a dit.
4. **Un des 2 abonnés de lancement, jamais activé** : reçoit UNE proposition ; ne clique pas ; aucune relance (pas de seconde proposition).
5. **Yanis se réabonne en mars** : ligne `fin-premium` ; case décochée ; il décide.
#### Definition of Done
Tests Jest ; scénarios reproductibles ; suppression de compte testée de bout en bout (cascade + journal) ; texte de la proposition validé à l'aveugle puis par Thomas.
#### Notes
@fullstack : [À VÉRIFIER : code de suppression de compte et rapprochement des plans]. @legal : la proposition aux existants est un message de service sur une fonction du contrat (pas de prospection) [À VALIDER @legal A4].

### US-H7 : Piloter la lettre dans l'admin et le rapport du lundi
**Persona** : Thomas (fondateur, admin) | **Epic** : Lettre hebdomadaire Premium | **Dépendances** : H4, H5 | **RICE : 2/2/50 %/~0 → I×C 1,0**
#### Job-to-be-done
En tant que Thomas, je veux voir en un coup d'œil qui reçoit la lettre, ce qui part jeudi et si le stock tient afin de ne jamais promettre ce que je ne livre pas.
#### Contexte de navigation
Origine : admin, onglet Abonnés, sous-onglet Lettre (`components/admin/lettre-section.tsx`, `lib/admin/lettre-inscrits.ts`) ; e-mail du lundi (`lib/analytics/weekly-lettre.ts`). Destination : lecture, plus les actions « Arrêter », « Envoyer la proposition », « Envoyer un aperçu à mon adresse ».
#### Données et champs (lecture, `select` explicite, jamais jeton, jamais empreinte)
| Champ | Source | Remarque |
|---|---|---|
| Comptes | `PremiumLetterPreference` + `User` | e-mail, activée le, arrêtée le, origine d'arrêt, Premium actuel, compte de test (marqué, jamais masqué) |
| Filtres | statut | actives, arrêtées, Premium sans hebdo (le chiffre qui dit combien reçoivent la mensuelle à la place) |
| Numéros | `NewsletterIssue` audience `HEBDO_PREMIUM` | 8 à venir : semaine, objet, statut, date ; derniers envoyés : envoyés / échecs / en cours |
| Stock | calculé | numéros `VALIDE` à venir ; alerte sous 4 |
#### 5 états UI
Défaut : tableaux et compteurs. Loading : squelette, 5 s au plus. Vide : « Personne n'a encore activé la lettre de la semaine. » Erreur : « Les chiffres n'ont pas pu être lus. » (base illisible = `etat: "illisible"`, comme la mensuelle). Succès d'action : « Arrêtée. » / « Proposition envoyée à 1 compte. » / « Aperçu envoyé à ton adresse. »
#### Critères d'acceptance
| ID | Critère |
|---|---|
| H7-1 | Given l'admin ouvert, When le sous-onglet s'affiche, Then comptes actifs, arrêtés par origine, Premium sans hebdo et comptes de test à part sont visibles. |
| H7-2 | Given un compte de test, When les compteurs sont calculés, Then il est exclu des totaux et listé avec la marque « test ». |
| H7-3 | Given la liste des comptes, When elle est lue, Then ni jeton d'arrêt, ni empreinte, ni identifiant de session ne sont dans la réponse (test sur la réponse brute). |
| H7-4 | Given l'action « Arrêter », When Thomas la déclenche, Then `stopOrigin="admin"` et jamais d'activation par l'admin (le consentement ne se donne pas pour autrui). |
| H7-5 | Given l'action « Envoyer un aperçu », When elle est déclenchée, Then le prochain numéro est envoyé à l'adresse de l'admin uniquement, marqué `[Aperçu]` dans l'objet. |
| H7-6 | Given les routes `api/admin/lettre-premium/*`, When elles sont appelées sans jeton, Then 401 ; avec un jeton valide mais un corps invalide, 400. |
| H7-7 | Given le rapport du lundi, When il est construit, Then il porte : Premium actifs, activations de la semaine par origine, arrêts de la semaine par origine, dernier jeudi (envoyés, échecs, en cours, dont comptes de test), prochain numéro (semaine, objet, date), stock à venir, alerte sous 4, numéros non envoyés. |
| H7-8 | Given un numéro `VALIDE` de la semaine non parti après vendredi 12 h, When le rapport ou l'admin se charge, Then l'écart est signalé en tête. |
| H7-9 | Given la mensuelle, When le sous-onglet existant s'affiche, Then les inscrits dont le compte a l'hebdo active portent la mention « reçoit l'hebdo, mensuelle suspendue ». |
| H7-10 | Given la migration non jouée, When l'admin se charge, Then les anciennes sections restent lisibles (`table-absente`, comme `estTableAbsente`). |
#### Payload API
`GET /api/admin/lettre-premium` (liste paginée, filtres `statut`, `q`) : 200, 401. `POST /api/admin/lettre-premium/arret` `{ "userId": string }` : 200, 401, 404. `POST /api/admin/lettre-premium/apercu` : 200, 401, 409 (aucun numéro). `POST /api/admin/lettre-premium/proposition` : voir H6.
#### Events analytics
N/A (outil interne ; aucune donnée d'admin dans Umami).
#### Scénarios persona concrets
1. **Thomas, lundi 16/11 à 7 h** : l'e-mail du lundi dit « 12/11 : 3 envoyés, 0 échec, dont 1 compte de test ; prochain : 19/11 ; stock : 6 ».
2. **Thomas voit « Premium sans hebdo : 1 »** : c'est Sophie ; la proposition ne se renvoie pas, la mensuelle continue pour elle.
3. **Un abonné écrit « stop »** : Thomas ouvre sa ligne, « Arrêter », réponse sous un mois.
4. **Stock à 3** : l'admin affiche l'alerte en rouge texte (pas la seule couleur) ; e-mail admin au plus un par jour.
5. **Aperçu** : Thomas reçoit « [Aperçu] Le vendeur dans ton dos » avec le pied réel.
#### Definition of Done
UI 5 états ; routes testées ; rendu @design et @ux 10/10 sur captures (admin, 375 et 1280 px) ; rapport du lundi testé sur un instantané.
#### Notes
@data-analyst : reprendre la structure de `LettreResume` (état `ok`, `table-absente`, `illisible`).

### US-H8 : Tenir la promesse publique (mentions et porte de mise en ligne)
**Persona** : Yanis (visiteur de /abonnement) | **Epic** : Lettre hebdomadaire Premium | **Dépendances** : H1 à H7 achevées, §9.3 | **RICE : 2/2/50 %/~0 → I×C 1,0**
#### Job-to-be-done
En tant que Yanis, je veux lire sur la page d'abonnement une promesse qui sera tenue dès mon paiement afin de m'abonner en confiance (conversion et offre vraie).
#### Contexte de navigation / Données et champs / 5 états UI
N/A, story sans interface propre : elle commande l'apparition de textes sur des pages existantes (§9.2) par l'interrupteur `LETTRE_HEBDO_PROMESSE_PUBLIQUE`.
#### Critères d'acceptance
| ID | Critère |
|---|---|
| H8-1 | Given `PROMESSE_PUBLIQUE` faux, When /abonnement, l'accueil, la FAQ, `llms.txt` et les CGU sont rendus, Then aucune mention de la lettre hebdomadaire n'apparaît (recherche de texte dans le HTML). |
| H8-2 | Given `PROMESSE_PUBLIQUE` vrai, When le code se charge, Then `ENVOIS_OUVERTS` et `INSCRIPTION_OUVERTE` sont vrais aussi (test d'invariant : la promesse n'avance jamais sur la réalité). |
| H8-3 | Given la promesse publique vraie, When /abonnement est rendu, Then la formulation validée apparaît dans la liste des avantages, sans tiret cadratin, sans « newsletter », sans prix. |
| H8-4 | Given la promesse vraie, When la page est rendue, Then la mention dit « facultative » (ou équivalent validé) et ne dit jamais « 4 par mois ». |
| H8-5 | Given le jour d'envoi dans une constante, When il change, Then tous les textes qui le citent suivent (une seule source). |
| H8-6 | Given le surtitre, le H1, le sous-titre, la carte et la réassurance de la page du lot 2, When la promesse est ajoutée, Then ils sont inchangés (diff de rendu). |
| H8-7 | Given les 6 numéros validés de la mensuelle, When la promesse devient publique, Then ils ne sont pas modifiés (toute modification repasse l'aveugle). |
| H8-8 | Given le pied et la page de désinscription de la mensuelle, When l'hebdo ouvre, Then la phrase de renvoi vers son réglage propre (duel 8 A, réserve @legal) est ajoutée seulement à ce moment, après relecture. |
| H8-9 | Given la porte G-H (§9.3), When une de ses sept conditions est fausse, Then `PROMESSE_PUBLIQUE` reste faux (contrôle manuel consigné dans `REPLIT_ACTIONS.md`, jamais automatique). |
#### Payload API
N/A.
#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `abonnement-vu` (existant) | vue de /abonnement | inchangé | conversion |
Aucun nouvel événement : la mesure du lot 2 reste lisible (ne pas mélanger deux variables).
#### Scénarios persona concrets
1. **Yanis, 22 h, lit /abonnement avant la porte** : aucune mention de la lettre.
2. **Yanis, après la porte** : lit « chaque semaine dans ta boîte, facultative » et s'abonne ; à la page de succès, la case l'attend.
3. **Sophie interroge un assistant vocal sur Premium** : `llms.txt` ne mentionne l'hebdo qu'après la porte.
4. **Marc compare la FAQ et la page** : mêmes mots, même jour d'envoi.
5. **Thomas décale le jour d'envoi au mardi** : une seule constante change, les textes suivent.
#### Definition of Done
Tests d'invariant et de rendu ; entrée `REPLIT_ACTIONS.md` avec la checklist G-H cochée.
#### Notes
@seo : aucun changement de métadonnées, de slug ni de maillage ; l'hebdo n'est pas une page.

## 6. Technique (pour @fullstack)

### 6.1 Interrupteurs (`config/lettre.ts`, trois, tous `false` au déploiement)

| Constante | Commande | Règle |
|---|---|---|
| `LETTRE_HEBDO_INSCRIPTION_OUVERTE` | case visible (paiement, profil), routes `preference` ; l'ARRÊT marche toujours | ouvre avec les textes légaux publiés |
| `LETTRE_HEBDO_ENVOIS_OUVERTS` | la tâche d'envoi ET l'exclusion de la mensuelle | arrêt d'urgence sans fermer les inscriptions |
| `LETTRE_HEBDO_PROMESSE_PUBLIQUE` | toute mention publique (§9.2) | ne passe à `true` qu'après la porte G-H ; test d'invariant H8-2 |

Constantes associées : `LETTRE_HEBDO_CONSENT_VERSION = "lettre-hebdo-premium-v1"` (ancien texte archivé à chaque changement, comme `CONSENTEMENTS_LETTRE_ARCHIVES`), `LETTRE_HEBDO_STOCK_ALERTE = 4`, `LETTRE_HEBDO_STOCK_CIBLE = 8`, `LETTRE_HEBDO_JOURNAL_MOIS = 12`.

### 6.2 Données (une migration, numéro à confirmer après la 14)

- `PremiumLetterPreference` reçoit : `unsubscribeToken String? @unique` (opaque, créé à la première activation, stable ensuite), `activationOrigin String?` (`paiement` | `profil`), `proposedAt DateTime?` (une seule proposition). Valeurs de `stopOrigin` : `profil`, `paiement`, `lien-email`, `fin-premium`, `suppression`, `admin` (commentaire du schéma à mettre à jour). Consentement valable = `enabled` ET `activatedAt` ET `consentVersion`. Aucune adresse IP (l'identité vient du compte), aucun agent utilisateur.
- `NewsletterIssue` : AUCUN changement. L'audience `HEBDO_PREMIUM` et la clé `[audience, periodKey]` existent déjà (schéma l.1141 à 1144 et l.1137) ; `periodKey = "AAAA-Www"`. `NewsletterSend` : AUCUN changement (clé `[issueId, email]`).
- `User` : intact.

### 6.3 Réutilisation de l'infrastructure de la mensuelle

| Brique existante | Usage par l'hebdo |
|---|---|
| `envoi.ts` : `aHeureParis`, `prochainCreneauLettre`, `LETTRE_JOUR_ENVOI`, `articlesCites`, `etatArticlesCites` (garde-fou d'article publié), `corpsNumero`, `listesExclusion` | réutilisés ; `corpsNumero` reçoit le pied en paramètre (pied hebdo différent) ; `listesExclusion` appelle la fonction unique « reçoit l'hebdo » (§4.2) |
| Boucle « réserver une ligne `NewsletterSend`, envoyer, marquer, retenter » | extraite en fonction commune, tests de la mensuelle intacts |
| `numeros.ts` (schéma zod, `sansTiret`, synchronisation au démarrage, contrôle de dates) | nouveau module `numeros-hebdo.ts` de même forme ; audience `HEBDO_PREMIUM` ; schéma propre (§5 H5) |
| `inscription.ts` : `avecDelai`, `LETTRE_EMAIL_TIMEOUT_MS`, `EnvoyerEmail`, `enTetesDesinscription` | réutilisés ; variante d'URL d'arrêt propre à l'hebdo |
| `entretien.ts` (tâche quotidienne) | ajout du rapprochement `fin-premium` et de la purge du journal hebdo à 12 mois |
| `lib/newsletter.ts` : `generateOpaqueToken` | jeton d'arrêt |
| `config/textes/lettre-s21.ts` (typographie `insecables()`, test sans tiret) | nouveau `config/textes/lettre-hebdo-s21.ts`, même mécanique et mêmes tests |
| Resend, texte seul, suivi d'ouverture et de clic désactivé (B4) | identique ; [À VÉRIFIER @infrastructure : le réglage est au niveau du domaine et couvre bien les nouveaux envois] |
| Planificateur (`lib/scheduler/jobs.ts`, déclencheur toutes les 15 minutes, `JobLock`) | nouvelle tâche `lettre-hebdo-premium` à côté de la tâche mensuelle [À VÉRIFIER : nom exact de la tâche mensuelle dans `jobs.ts`, non lu en entier] |
| `lireApercuLettre` (aperçu public de `/lettre`) | inchangé et filtré sur `MENSUELLE` : l'hebdo est du contenu Premium, jamais exposé (test H5-9) |
| `emailsExclus()` / comptes de test | comptes de test comptés à part (§4.2 cas 9) |
| Hook Umami `before-send` qui masque les pages à jeton (`umami-before-send-lettre-s21.test.ts`) | à étendre à la page d'arrêt `/lettre/premium/arreter` |
| `lib/attribution.ts` (liste blanche `Origine`) | ajouter `lettre-premium` pour garder l'origine des arrivées depuis la lettre [À VÉRIFIER : `lettre` y figure-t-elle déjà ?] |

### 6.4 Tâche `lettre-hebdo-premium` (un passage)

1. Interrupteur fermé : fin. 2. Instant courant avant le jeudi 8 h de la semaine ISO de Paris : fin. 3. Charger le numéro `HEBDO_PREMIUM`, `periodKey` = semaine courante, `VALIDE`, `scheduledFor` atteint ; absent : alerte et fin (jamais de contenu au fil de l'eau). 4. Marqueur `[À COMPLÉTER` : bloqué. 5. Garde-fous de lien : articles du blog (`etatArticlesCites`), mois du carnet en ligne, parcours publié ; sinon report au créneau valable, comme la mensuelle. 6. Destinataires = plan PREMIUM et statut ACTIVE ou PAST_DUE, `enabled`, adresse vérifiée, moins oppositions globales antérieures à l'activation. 7. Réserver, envoyer (texte seul, en-têtes d'arrêt, lien d'arrêt propre), marquer, retenter. 8. Fin quand plus rien n'est à faire : `ENVOYE`. 9. Rendre compte (envoyés, échecs, exclus, reporté, bloqué) au journal de la tâche.

### 6.5 Alertes (au plus un e-mail admin par jour, règle du 06/10)

Aucun numéro `VALIDE` le jeudi ; stock sous 4 ; numéro bloqué ou reporté plus d'un jour ; échecs d'envoi après 3 essais ; numéro `VALIDE` non parti un vendredi à midi. Toutes remontent aussi dans le rapport du lundi (H7-7).

### 6.6 E-mails à rédiger (@copywriter, passage à l'aveugle, brouillons jamais envoyés sans validation de Thomas)

Pied du numéro (§8.4) ; pré-en-tête constant ; proposition aux abonnés existants ; textes de la case (§5), de la page d'arrêt (H3), de la section de profil ; libellés de blocs du gabarit si /carnet n'en fournit pas ; phrase de la page de fin d'abonnement (facultative : « La lettre de la semaine s'arrête avec ton abonnement »).

### 6.7 Tests exigés (@fullstack écrit, @qa vérifie)

Un test par critère des stories H1 à H8 ; invariant promesse/réalité (H8-2) ; « aucun Premium exclu de la mensuelle sans être destinataire de l'hebdo » ; fiche recopiée à l'identique ; aucun mot interdit ; jeudi à 8 h Paris aux deux changements d'heure ; semaine 53 et passage d'année ; GET sans effet sur la page d'arrêt ; réponses admin sans jeton ni empreinte ; suppression de compte (cascade + journal).

## 7. Mesure et hypothèses

### 7.1 Indicateurs (base d'abord ; aucune ouverture, aucun clic suivi : B4)

| Indicateur | Définition | Seuil [HYPOTHÈSES, à fixer avec @data-analyst] |
|---|---|---|
| Activation | Premium actifs (hors comptes de test) avec la lettre activée / Premium actifs | suivi ; lecture qualitative sous 10 abonnés |
| Origine d'activation | paiement / profil | suivi |
| Arrêt | arrêts par numéro / destinataires du numéro, par origine | 3 % au plus par numéro |
| Fiabilité | jeudis envoyés à l'heure / jeudis prévus | 100 % |
| Livraison | échecs après 3 essais ; rebonds et plaintes lus dans Resend [À VÉRIFIER : un webhook Resend existe-t-il ?] | 0 plainte |
| Retour sur le site | arrivées `utm_source=lettre-premium` sur /carnet et parcours (Umami, première partie) | suivi, pas de seuil avec moins de 30 abonnés |
| Résultat produit | résiliations des Premium avec la lettre / sans (qualitatif jusqu'à 30 Premium) | hypothèse §1.1 |

### 7.2 Carte des hypothèses

| Hypothèse | Preuve | Test | Statut |
|---|---|---|---|
| Un rendez-vous hebdomadaire réduit la résiliation Premium | aucune (2 abonnés) | comparer les arrêts de la lettre et les résiliations, qualitatif ; retour sur le site | À TESTER après 8 numéros |
| La promesse sur /abonnement augmente la conversion | aucune | avant / après sur 4 semaines (683 visiteurs sur 28 jours : pas d'A/B) | À TESTER après la porte G-H |
| Une fiche du carnet suffit comme matière hebdomadaire | validée en interne | relecture à l'aveugle du gabarit | EN COURS |
| Les Premium acceptent l'opt-in (la case est cochée) | aucune | taux d'activation parmi les nouveaux Premium | À TESTER |
| 230 mots, une minute de lecture | aucune | retour qualitatif des 2 abonnés | À TESTER |

## 8. Textes juridiques à publier

### 8.1 Cadre

Draft de référence d'après l'avis `docs/legal/lettre-et-questions-s21.md` (L2, Q2, Q8, L3, L4, L6), pas un avis d'avocat ; articles cités de mémoire, `[À VÉRIFIER]`. La décision du 06/05 (jamais de mention IA) n'est pas rouverte. Les textes publiés avec la mensuelle (section « 8. La lettre » de la confidentialité, selon `config/lettre.ts`) existent déjà : **[À VÉRIFIER : état actuel de `confidentialite/page.tsx` et de `cgu/page.tsx` avant d'ajouter quoi que ce soit, et numérotation des articles]**. Les textes ci-dessous s'AJOUTENT à ce qui est en ligne, et ne sont publiés que le jour où les inscriptions à l'hebdo ouvrent (jamais de promesse non tenue, avis Q8 : « n'y ajouter la lettre hebdo qu'à l'ouverture réelle »). Zéro tiret cadratin, tutoiement.

### 8.2 Confidentialité (ajouts, repris de l'avis puis précisés pour l'hebdo seule)

- **Partie 2, données** : « Lettre de la semaine (abonnés Premium), si tu l'actives : ton choix (la date, la version du texte que tu as accepté et l'endroit où tu l'as fait), puis la date et la façon dont tu l'arrêtes. Elle est envoyée à l'adresse e-mail de ton compte. » (nouveau)
- **Partie 3, finalités** : « T'envoyer la lettre de la semaine, si tu l'as activée : exécution du contrat, arrêt en un clic sans toucher à ton abonnement » (texte de l'avis) ; « Respecter tes choix et prouver ton accord : intérêt légitime » (texte de l'avis).
- **Partie 4, destinataires** : la ligne Resend de l'avis (« envoi des e-mails liés à ton compte et à ton abonnement, et des lettres ») couvre l'hebdo ; rien à ajouter.
- **Partie 6, conservation** : « Lettre de la semaine : ton choix est gardé tant que ton compte existe. Si tu l'arrêtes ou si ton abonnement prend fin, on garde la date et la façon dont elle s'est arrêtée, pour respecter ton choix. Le journal des envois (quel numéro, à quelle adresse) est gardé 12 mois, et effacé tout de suite si tu supprimes ton compte. » (nouveau ; durées = hypothèses A3)
- **Partie 7, droits** : « Pour la lettre de la semaine, tu peux l'arrêter à tout moment, avec le lien en bas de chaque numéro ou depuis ton profil. Ce qui a été envoyé avant reste valable. » (complète le texte de l'avis)
- **Dernière mise à jour** : à mettre à la date de publication.

### 8.3 CGU (paragraphe autonome, sans dépendre des questions)

À insérer là où les avantages de Premium sont décrits (article 3 ou article neuf de l'avis, selon l'état réel de la page) :

« La lettre de la semaine fait partie de l'abonnement Premium. Tu choisis de la recevoir (la case n'est jamais cochée, au paiement comme dans ton profil) et tu peux l'arrêter en un clic, sans résilier. Elle est envoyée chaque semaine, le jeudi, à l'adresse e-mail de ton compte, tant que ton abonnement est actif. Elle reprend des contenus de Premium et ne contient aucune offre commerciale. Une semaine, un numéro peut être décalé ou ne pas partir (incident technique, jour férié) : aucun numéro n'est dû en compensation. Quand ton abonnement prend fin, elle s'arrête ; les numéros déjà reçus restent dans ta boîte. La lettre du mois, gratuite, est indépendante de l'abonnement : elle se fait sur inscription, confirmée par e-mail, et elle est suspendue tant que tu reçois la lettre de la semaine. »

Quand « Ta question à l'équipe » ouvrira, ce paragraphe rejoint l'article neuf de l'avis (Q8) : les deux textes ne se contredisent pas (la phrase de l'avis « La lettre hebdomadaire Premium fait partie de l'abonnement et tu peux l'arrêter en un clic sans résilier » est reprise ici).

### 8.4 Pied de chaque numéro (proposition, passe l'aveugle et @legal)

« Tu reçois cette lettre parce que tu es abonné Premium et que tu as choisi de la recevoir. Elle arrive chaque semaine. L'arrêter en un clic, ton abonnement continue : {lien d'arrêt}
Deviens Marrant, deviens-marrant SAS · Contact : contact@deviens-marrant.fr · Confidentialité : https://deviens-marrant.fr/confidentialite#lettre · Mentions légales : https://deviens-marrant.fr/mentions-legales »

Expéditeur affiché « Deviens Marrant », `Reply-To: contact@deviens-marrant.fr` (L3). « deviens-marrant SAS » : décision de Thomas du 17/10, réserve R4 connue et acceptée (identité inexacte tant que la société n'est pas immatriculée) ; la constante `LETTRE_MENTION_EDITEUR_NUMERO` est partagée avec la mensuelle, donc un seul endroit à changer.

### 8.5 Ce qui reste à faire valider par @legal (ou par l'avocat de la liste A1 à A7)

| # | Point | Reco PM |
|---|---|---|
| A4 (bloquant pour l'ouverture) | Hebdo = contenu du contrat ET opt-in : confirmer qu'il n'est pas de la prospection tant qu'il ne contient aucune offre ; clause « numéro décalé ou sauté, sans compensation » ; engagement « chaque semaine » | texte §8.3 tel quel |
| A3 | Durées : choix gardé tant que le compte existe ; journal 12 mois ; trace d'arrêt après la fin de Premium | idem |
| A6 / R4 | « deviens-marrant SAS » dans le pied | accepté par Thomas le 17/10 |
| N1 | La proposition envoyée une fois aux 2 abonnés existants : message de service, pas prospection | un seul envoi, aucune offre, aucun prix |
| N2 | Pas de double opt-in : compte authentifié + case + lien d'arrêt dans le premier numéro suffisent ? | oui, la preuve est la ligne en base (date, version, origine) |
| N3 | Envoi à une adresse de compte jamais vérifiée | ne pas envoyer [HYPOTHÈSE] |
| N4 | Suppression de compte : la mensuelle (consentement séparé, sans compte) n'est pas touchée, le dire sur la page de suppression | oui |
| N5 | `PAST_DUE` : l'hebdo continue pendant les relances | oui (contrat actif, règle s16) |
| N6 | Un pont vers une étape de parcours dans l'hebdo n'est pas une « offre » pour un abonné | oui, contenu déjà inclus ; liste de mots §2.4 à relire |
| N7 | « stop » reçu par e-mail : arrête l'hebdo ; « plus aucun e-mail » = opposition globale | oui (L6) |

## 9. Mention sur /abonnement et ailleurs

### 9.1 Formulation vraie (à passer à l'aveugle, 3 variantes)

| | Texte (tutoiement, zéro tiret cadratin) | Avis |
|---|---|---|
| A | La lettre de la semaine, dans ta boîte : une scène du carnet, la réplique et l'exercice. Facultative, tu l'arrêtes en un clic. | Vraie, concrète ; « scène » et « carnet » doivent être des mots déjà visibles sur la page. |
| **B** | **Chaque semaine dans ta boîte, une scène du carnet avec sa réplique et son exercice. Tu choisis de la recevoir.** | **Reco** : reprend les mots de Thomas (« chaque semaine dans ta boîte »), dit « facultative » sans le mot, ne promet pas de jour. |
| C | Une lettre chaque semaine, si tu le veux : la scène, la réplique qui marche et l'exercice pour la placer. | « Qui marche » promet un résultat : écarté. |

Jamais : « 4 par mois » (certains mois ont 5 jeudis), « illimité », « newsletter », un prix, la date du prochain numéro, « Alex », une mention IA. La ligne s'AJOUTE à la liste des avantages de la page du lot 2 sans toucher au surtitre, au H1, au sous-titre, à la carte, à la réassurance ni à l'extrait du carnet (H8-6).

### 9.2 Où, et seulement où

| Surface | Mention | Condition |
|---|---|---|
| /abonnement, liste des avantages | ligne §9.1 | `PROMESSE_PUBLIQUE` |
| Page de succès du paiement | case (H1) | `INSCRIPTION_OUVERTE` et Premium confirmé |
| Profil | section (H2), jamais pour un non Premium | `INSCRIPTION_OUVERTE` |
| FAQ de /abonnement et `llms-content` / `llms.txt` | une phrase, mêmes mots que la ligne §9.1 | `PROMESSE_PUBLIQUE` [À VÉRIFIER : existence d'une FAQ sur /abonnement] |
| CGU, confidentialité | §8 | jour de l'ouverture des inscriptions |
| Page de désinscription de la mensuelle | « Si tu es abonné Premium, la lettre de la semaine a son propre réglage, dans ton profil. » (réserve @legal duel 8 A) | ouverture de l'hebdo ; nouveau texte donc relecture à l'aveugle |
| E-mail de confirmation d'abonnement, e-mail de fin d'abonnement | une phrase facultative | ouverture ; modifie des textes validés (s16), donc relecture à l'aveugle ; non bloquant |
| Mensuelle gratuite | rien dans les n°1 à 6 (validés, figés) ; éventuellement une invitation à partir du n°7 | décision ultérieure |

**Interdit** : réseaux sociaux (règle du 05/10 : jamais de prix ni d'abonnement), accueil visiteur, encarts d'articles, en-tête mobile, pop-up. L'hebdo n'est pas une page indexable (aucun changement SEO).

### 9.3 Condition de mise en ligne : la porte G-H (« pas de promesse avant le premier envoi possible »)

`LETTRE_HEBDO_PROMESSE_PUBLIQUE` ne passe à `true` que si TOUT est vrai, contrôlé à la main et consigné dans `REPLIT_ACTIONS.md` :

1. Code déployé, `INSCRIPTION_OUVERTE` et `ENVOIS_OUVERTS` vrais en production.
2. Au moins 6 numéros `VALIDE` à venir (stock d'ouverture 8).
3. Un envoi de test réel depuis la production est arrivé chez Thomas, avec les en-têtes d'arrêt, l'arrêt en un clic éprouvé, le rendu texte seul vérifié.
4. Le prochain jeudi est programmé : un numéro `VALIDE` existe pour la semaine ISO à venir.
5. Case visible au paiement et au profil ; CGU et confidentialité publiées.
6. Avis @legal sur A4 reçu, ou décision écrite de Thomas de passer outre.
7. Feu vert écrit de Thomas.

Effet sur le calendrier : si la porte est franchie avant la mise en ligne de la page du lot 2 (après le bilan ~10/11), la ligne part avec elle ; sinon la page part sans la ligne et un déploiement d'un seul interrupteur l'ajoute. La promesse peut donc précéder de quelques jours le premier envoi (12/11) : elle est vraie car l'envoi est possible et programmé, pas encore accompli. Si le premier envoi échoue, l'interrupteur repasse à `false` jusqu'à correction.

## 10. Plan par dépendances (pas de sprints)

Les tâches sans dépendance communes démarrent ensemble. Seules deux dates sont externes : le retour de Thomas (26/10) et le bilan du lot 1 (~10/11). Cible de premier envoi : jeudi 12/11/2026 (§3.4).

| ID | Tâche | Agent | Dépend de | Critère de fin (binaire) |
|---|---|---|---|---|
| P0 | Trancher les décisions A, B, C (§11.1) | Thomas | rien (au retour, 26/10) | 3 réponses écrites, reportées dans `docs/founder-preferences.md` en `[CHOIX UTILISATEUR]` |
| P1 | Avis sur §8 (textes et points A3, A4, N1 à N7) | @legal | rien | avis daté ; chaque texte « conforme / conforme sous réserve / à réécrire » ; A4 tranché |
| P2 | Migration, modèles, constantes, fonction unique « reçoit l'hebdo », exclusion de la mensuelle refactorée | @fullstack | A, B (opt-in, mensuelle suspendue) | tests H6 et §4.2 verts ; tests de la mensuelle inchangés verts ; `tsc`, lint, build verts |
| P3 | Gabarit, pré-en-tête, pied, textes de la case, de la page d'arrêt, de la section de profil, e-mail de proposition | @copywriter | rien | 2 tours à l'aveugle (2 sur 3, garde-fou faute objective), 0 tiret cadratin, rien d'inventé |
| P4 | Choix de 8 fiches, 8 accroches, ponts facultatifs ; fichier `hebdo-premium.json` en `BROUILLON` | @copywriter | P3 (gabarit figé) | pack à l'aveugle passé ; grille §3.3 passée par @reviewer sur 8 numéros assemblés |
| P5 | Synchronisation, rendu, tâche d'envoi, garde-fous (H4, H5) | @fullstack | P2, P3 | tous les critères H4 et H5 verts |
| P6 | API de préférence, page d'arrêt, section de profil, case du paiement (H1, H2, H3) | @fullstack | P2, P3 | tous les critères H1, H2, H3 verts |
| P7 | Admin et rapport du lundi (H7), événements et plan de mesure | @fullstack, @data-analyst | P2, P5 | critères H7 verts ; seuils §7.1 validés |
| P8 | Textes légaux intégrés aux pages (non visibles tant que l'inscription est fermée) | @fullstack | P1 | test de présence ; publication liée à `INSCRIPTION_OUVERTE` |
| P9 | QA : tests de tous les critères, scénarios personas, E2E 375 px, non-régression de la mensuelle | @qa | P5 à P8 | GO de @qa, aucun bloquant, scénarios H1 à H8 reproduits |
| P10 | Rendu profil, succès du paiement, page d'arrêt, admin sur captures 375, 768, 1280 | @design, @ux | P6, P7 | 10/10 chez les deux relecteurs (règle du 07/10) |
| P11 | Réglage Resend vérifié, migration, déploiement masqué (3 interrupteurs fermés) | @infrastructure | P9, P10 | entrée `REPLIT_ACTIONS.md` complète ; santé du site ; interrupteurs vérifiés fermés en production |
| P12 | Validation des 8 numéros | Thomas | P4 | `"statut": "VALIDE"` committé pour `2026-W46` à `2026-W53` |
| P13 | Envoi de test réel ; ouverture des inscriptions avec CGU et confidentialité ; proposition aux 2 abonnés existants | @infrastructure, Thomas | P1, P8, P11, P12 | G3 et G5 de la porte cochés ; au plus tard lundi 09/11 |
| P14 | Porte G-H puis `PROMESSE_PUBLIQUE` à `true` | @orchestrator, @fullstack | P13, feu vert Thomas | H8 vert ; checklist cochée dans `REPLIT_ACTIONS.md` |
| P15 | Premier envoi (jeudi 12/11, 8 h) | tâche planifiée | P13 | journal : 0 échec ; rapport du lundi 16/11 le rend |
| P16 | Bilan après 8 numéros (jeudi 07/01/2027) et décision garder / changer / retirer ; livraison du lot 2 (13 numéros) au plus tard à `2026-W49` | @product-manager, @data-analyst, @copywriter | P15 | arrêts, résiliations, retours lus ; décision écrite |
| P17 | Plus tard : bloc « courrier » (question d'un membre) | @product-manager | questions ouvertes, @legal Q4 | hors V1 |

Parallélisme : P1, P2, P3 et P0 démarrent ensemble ; P5, P6 attendent P2 et le gabarit de P3 ; P9 et P10 attendent P5 à P8.

## 11. Décisions, questions, risques

### 11.1 À faire valider par Thomas (3 au maximum)

| # | Décision | Reco |
|---|---|---|
| **A** | **Opt-in ou envoi d'office aux abonnés.** Avec la case jamais cochée, un Premium qui ne la coche pas ne reçoit pas l'hebdo (il garde la mensuelle) : « les abonnés en ont 4 » est vrai pour ceux qui l'activent. L'envoi d'office raterait l'avis @legal L2 (opt-in conservé) et exposerait à la prospection. | **Opt-in**, avec la case sur la page de succès du paiement, dans le profil, et une proposition unique aux 2 abonnés existants. Mensuelle conservée pour qui n'active pas, suspendue pour qui active : jamais 5 + 1. |
| **B** | **Rythme : chaque jeudi, ou 4 par mois au plus.** Novembre 2026 compte 4 jeudis, décembre 5. | **Chaque jeudi**, promesse « chaque semaine », jamais « 4 par mois » écrit. Stock de 8 numéros d'avance. |
| **C** | **Calendrier et condition de promesse.** Premier envoi le jeudi 12/11 (2 jours après le bilan du lot 1, 7 jours après la mensuelle n°1) ; déploiement masqué avant le 10/11 autorisé (aucune page visiteur ne change) ; promesse sur /abonnement seulement quand la porte G-H est franchie (envoi possible et programmé). | **Oui aux trois.** Repli 19/11 si une condition manque le 09/11. Rien n'est écrit sur /abonnement avant la porte. |

Détail non soumis (défaut PM, modifiable sur demande) : lettre signée « L'Équipe Deviens Marrant », objet = titre de la fiche, pas de bloc « courrier » en V1, aucune ouverture ni clic suivi.

### 11.2 Points ouverts pour d'autres agents

@legal : §8.5. @fullstack : les `[À VÉRIFIER]` du code (page de succès, suppression de compte, champ de fin de période, `jobs.ts`, adresse vérifiée, `lib/attribution.ts`, webhook Resend). @copywriter : libellés de blocs du carnet, accroches, ponts. @data-analyst : seuils §7.1. @infrastructure : suivi Resend désactivé pour les nouveaux envois.

### 11.3 Risques

| Risque | Parade |
|---|---|
| Stock épuisé : fonction « incluse » non livrée | 8 numéros d'avance, lot trimestriel, alerte sous 4, clause CGU, rien n'est envoyé sans numéro validé |
| Promesse publique avant la réalité | trois interrupteurs, invariant testé, porte G-H manuelle |
| La lettre répète le carnet, sans valeur | accroche de saison, rendez-vous, exercice ; bilan à 8 numéros, suppression si elle n'apporte rien |
| Un Premium ne reçoit rien (exclu de la mensuelle, hors hebdo) | fonction unique « reçoit l'hebdo » + test dédié |
| Contenu Premium exposé publiquement | aperçu de `/lettre` filtré sur la mensuelle, test H5-9, pas d'archive web |
| Scanner de liens ou antivirus désinscrit les gens | GET sans effet, POST nécessaire (L5) ; l'en-tête `List-Unsubscribe-Post` reste immédiat |
| Offre commerciale glissée dans un numéro | liste de mots bloquante, relecture @reviewer, ligne de `/abonnement` interdite |
| Changement d'heure ou semaine 53 | tests dédiés (§6.7) |
| Fiche déjà publique | contrôle de choix §2.3 règle 3 |
| Seulement 2 abonnés : aucun signal statistique | lecture qualitative, pas de décision chiffrée avant 30 abonnés [HYPOTHÈSE] |

### 11.4 Agents custom

Aucun nouvel agent recommandé : la relecture à l'aveugle (2 critiques et départage) et les 19 agents existants couvrent chaque story ; aucune story ne demande d'expertise absente (US-H1 à H8 rattachées aux agents du plan §10).

## 12. Couverture et auto-évaluation

| Parcours | Couvert par |
|---|---|
| Onboarding, paiement | H1 (case au paiement), proposition aux existants (H6) |
| Compte : préférences de notifications | H2, H3 |
| Paiement : désabonnement, réabonnement, échec de paiement | H6 (fin, `cancelAtPeriodEnd`, `PAST_DUE`, réabonnement) |
| Droits RGPD (retrait, accès, effacement, information) | H3 et H2 (retrait), H6 (suppression de compte), §8 (information) ; accès : sur demande à contact@ (avis Q6) |
| Erreurs transversales | H1-6, H1-7, H1-8, H2-7, H3-6 (session expirée, double soumission, lien mort) |
| Multi-utilisateurs | N/A : pas de rôles ; admin = Thomas (H7) |
| Réactivation | H6-6 (réabonnement ; jamais de réactivation automatique) |

Auto-évaluation : stories avec template complet pour les écrans (H1, H2, H3) et gabarit allégé pour les stories sans interface (H4, H5, H6, H8) ou internes (H7) ; critères binaires, sans adjectif subjectif ; événements définis par story ; aucune valeur par défaut inventée (aucune case pré-cochée, aucune catégorie pré-sélectionnée) ; feature de contenu sans IA au fil de l'eau, donc pas de comportement d'échec IA ; échecs d'envoi, de stock et de lien décrits (H4-5 à H4-9). Limites assumées : aucune lecture de `jobs.ts` en entier, de `confidentialite/page.tsx`, de `cgu/page.tsx`, de la page de succès du paiement ni du code d'authentification (tous marqués `[À VÉRIFIER]`) ; tous les textes publics sont des propositions non relues.

---
**Handoff → @orchestrator (puis @copywriter, @fullstack, @legal en parallèle)**
- Fichier produit : `/home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774/docs/product/lettre-hebdo-premium-s21.md`
- Décisions prises : V1 sans dépendance aux questions ; contenu = fiche du carnet recopiée + accroche ; mensuelle suspendue seulement si l'hebdo est activée ; opt-in ; chaque jeudi 8 h ; stock de 8 numéros ; une migration de 3 colonnes ; trois interrupteurs ; premier envoi cible 12/11/2026 ; promesse publique derrière la porte G-H.
- Points d'attention : 3 décisions de Thomas (§11.1) ; avis @legal A4 (hebdo = contrat ou prospection, clause « numéro décalé ou sauté ») ; fonction unique « reçoit l'hebdo » partagée avec l'exclusion de la mensuelle ; tous les textes publics à passer à l'aveugle ; historique `project-context.md` non mis à jour ici (éviter les conflits entre worktrees).
---

