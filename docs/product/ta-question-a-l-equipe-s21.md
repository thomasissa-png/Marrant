# Ta question à l'équipe : spécification fonctionnelle (s21, 17/10/2026)

> **Mise à jour 25/10/2026 (décisions de Thomas, priment sur tout ce qui suit)** : délai de réponse « en général sous 1 à 2 jours ouvrés » (au plus tard 3 jours ouvrés dans les CGU), **jamais 7 jours** ; V1 = encadré dans le compte Premium, envoi par e-mail vers contact@, rien en base, pas de limite affichée ; conservation 6 mois. Voir `docs/founder-preferences.md` (25/10).

> Statut : PRÉPARATION. Rien n'est codé ni déployé. Mise en ligne après le bilan du lot 1 (~10/11), déploiement séparé du lot 2. Destinataires : @fullstack, @copywriter, @legal, @data-analyst.
> Décision de Thomas (17/10, après le premier jet) : la fonction s'appelle **« Ta question à l'équipe »** (« Alex, personne ne le connaît ») ; réponses et lettre hebdomadaire Premium signées **« L'Équipe Deviens Marrant »**. Le ton reste celui de `docs/copy/ton-alex.md` (tutoiement, pote drôle et bienveillant), mais en voix du site : « on » et « nous », pas de « je ». Les règles d'Alex du 14/10 (« je », signature Alex) ne s'appliquent pas à cette fonction.
> Sources : `docs/founder-preferences.md` (01/10 aucune IA ne publie seule, 13/10 coaching 99 € retiré, 14/10, 17/10), `docs/copy/ton-alex.md`, `docs/ux/lettre-inscription-s21.md`, `docs/legal/remboursement-abonnement-s21.md`, `docs/copy/lot2-boutons-abonnement-s21.md`, `apps/web/prisma/schema.prisma`.
> Triage : spec par lots avec critères d'acceptation testables (§6.3). Les user stories au gabarit complet (5 états, scénarios persona) se dérivent APRÈS la validation des points de Thomas (§7.2), pour ne pas les écrire deux fois. Seul fait chiffré connu : 2 abonnés Premium actifs (tarif de lancement 0,99 € à vie) ; tout autre chiffre est marqué [HYPOTHÈSE].

## 0. Synthèse

| Sujet | Décision proposée |
|---|---|
| Parcours | L'abonné Premium décrit une situation en privé, reçoit la réponse de l'équipe par e-mail (copie dans son espace) au plus tard 7 jours après, et retrouve l'historique de ses questions. |
| Entrée | Page `/ta-question-a-l-equipe` (Premium), liée depuis le profil, la fin d'étape de parcours et la lettre hebdomadaire. Rien dans l'en-tête, rien de visible pour un visiteur avant le lot E. |
| Formulaire | 2 champs texte (situation obligatoire, « ce que j'ai répondu » facultatif) + 1 case facultative, séparée, de réutilisation anonymisée. |
| Quota | 1 question par semaine civile (Paris) et 2 questions non répondues au maximum [HYPOTHÈSE]. |
| Réponse | Préparée en session par les agents sur un lot sans e-mail ni nom, relue et envoyée par Thomas, signée « L'Équipe Deviens Marrant ». Aucun appel IA dans le code de production. |
| Lettre hebdo Premium | Jeudi 8 h [HYPOTHÈSE] : question anonymisée + réponse décryptée + fiche du carnet. Stock de secours de 8 numéros avant ouverture. Pas de double envoi avec la mensuelle. |
| Lots | A socle et back-office, B parcours abonné, C lettre hebdo, D réutilisation anonymisée, E vente. |
| À trancher | 8 points pour Thomas (§7.2), 8 questions pour @legal (§7.1). |

Challenge PM (à lire avant de construire) : la valeur pour le persona est plausible (Yanis reste muet quand on le chambre, il est introverti, un canal privé lui convient mieux qu'un forum), mais le lien avec la marge nette de 3 000 €/mois (North Star) repose sur une hypothèse non testée : « une réponse personnalisée augmente la conversion ou la rétention Premium ». Avec 2 abonnés, aucune statistique n'est possible. Test le moins cher AVANT le code : proposer la fonction par e-mail aux 2 abonnés (brouillon validé par Thomas) et traiter leurs 2 premières questions à la main. Le lot A est conçu pour permettre ce pilote sans le lot B (§8).

## 1. Cadre et intouchables

- Réservé aux abonnés Premium (plan PREMIUM, statut ACTIVE ou PAST_DUE : Premium gardé pendant les relances, règle s16). Pas de compte gratuit (05/10) : un visiteur voit un renvoi vers /abonnement, et seulement au lot E.
- Aucune IA ne répond seule ni en direct (01/10) : le code de production n'appelle aucun modèle. La préparation se fait en session (lot hebdomadaire), comme le calendrier de contenu.
- Voix : `ton-alex.md` en voix du site (tutoiement, « on », zéro tiret cadratin, zéro émoji, zéro concurrent, rien d'inventé). Humour : vanne du catalogue validé ou écrite pour l'occasion ET relue à l'aveugle (règle d'or P0 s18) ; « pas de vanne plutôt qu'une vanne moyenne ». Brouillon validé par Thomas avant envoi.
- Identité : ni Thomas, ni Alex, ni photo (29/09, 17/10). Jamais de mention IA (06/05). Formules autorisées : « l'équipe te répond », « la réponse de l'équipe » ; à éviter : « écrit à la main », « un humain te répond » (affirmations invérifiables).
- Résiliation = perte d'accès à l'espace de questions et à l'historique (livrables liés à l'abonnement actif). Les e-mails déjà reçus restent dans la boîte. Une question reçue pendant l'abonnement reçoit sa réponse même si l'abonnement s'arrête entre-temps [reco, point T6].
- Prix : aucun nouveau prix, 2,99 €/mois et 24,99 €/an inchangés ; aucune promesse de « illimité ».

## 2. Parcours de l'abonné

### 2.1 Points d'entrée (tous réservés au Premium connecté)

| # | Emplacement | Libellé | Déclencheur |
|---|---|---|---|
| E1 | Profil, sous la carte abonnement (`profil/page.tsx`) | « Ta question à l'équipe » + une phrase + bouton secondaire « Poser ma question » | Entrée permanente, dès le lot B |
| E2 | Fin d'étape de parcours, carte de fin (Premium) | Lien-texte « Une situation t'a coincé ? Pose ta question à l'équipe » | Après validation d'une étape (un seul lien, jamais un second bouton plein) |
| E3 | Pied de chaque lettre hebdomadaire | Lien « Poser ta question » | Lot C |
| E4 | Liste du profil | « Mes questions » (historique) | Dès qu'une question existe |

Écartés : en-tête, accueil, /abonnement avant le lot E, murs, pop-up (refus de principe s21).
Non Premium : un visiteur va vers `/login?callbackUrl=/ta-question-a-l-equipe` ; un membre non abonné voit « Réservé à Premium » + lien /abonnement (lot E seulement). Page `noindex`, hors sitemap.

### 2.2 Formulaire (`/ta-question-a-l-equipe`)

| Champ | Type | Oblig. | Validation | Limites [HYPOTHÈSE] | Exemple réaliste |
|---|---|---|---|---|---|
| Situation | textarea | oui | trim, ni vide ni espaces seuls | 30 à 1 000 caractères, compteur visible | « Au repas de famille, mon oncle m'a lancé devant tout le monde : "Alors, toujours célibataire, ça te réussit bien !". J'ai ri jaune et changé de sujet. » |
| Ce que j'ai répondu, ou pas | textarea | non | trim | 0 à 300 caractères | « Rien. J'ai souri. » |
| Réutilisation anonymisée | case | non, jamais pré-cochée | booléen | texte versionné `equipe-reutilisation-v1`, écrit côté serveur | voir ci-dessous |

Aucun champ prénom, e-mail ou thème : le prénom vient du compte (`User.name`, repli « Salut, » si absent), l'e-mail aussi (No Manufacturing Defaults : pas de catégorie présélectionnée).
Aide sous le champ : « Ta question reste privée. Pas besoin de nom de personne, d'employeur ni de lieu précis : ça nous suffit pour te répondre. » + lien « Confidentialité ».
Texte de la case (v1, à relire par @copywriter et @legal) : « Oui, l'équipe peut reprendre ma question dans la lettre Premium, anonymisée : sans mon prénom ni aucun détail qui permette de me reconnaître. Je suis prévenu avant l'envoi et je peux refuser. »
Case séparée et facultative : décochée, elle ne change rien à la réponse ni au délai. Le serveur écrit la version du texte, la date et l'origine (preuve), jamais le texte envoyé par le navigateur (même principe que `lettre-inscription-s21.md` §2.3).
Bouton : « Envoyer ma question » (jamais grisé : un message dit ce qui manque).

### 2.3 États de l'écran

| État | Contenu |
|---|---|
| Défaut | Formulaire vide, quota en une ligne (« Tu peux poser une question par semaine. ») |
| Envoi | Bouton « Envoi en cours », champs en lecture seule, saisie conservée, un seul envoi à la fois (clé d'idempotence) ; après 15 s : état erreur réseau |
| Succès | « Question reçue. Tu reçois la réponse de l'équipe au plus tard le {date}. On t'écrit à {e-mail du compte}. » + accusé par e-mail + lien « Voir mes questions » |
| Erreur de saisie | Sous le champ, en texte : « Décris un peu plus la situation (30 caractères minimum). » ; trop long : « 1 000 caractères maximum, il en reste {n} à enlever. » |
| Quota atteint | « Tu as déjà posé ta question de la semaine. Tu pourras en poser une autre à partir de lundi {date}. » + lien vers l'historique |
| Erreur serveur ou réseau | « Ça n'a pas marché de notre côté. Ta question est gardée dans ce formulaire : réessaie dans un instant. » (brouillon aussi gardé dans le navigateur) |
| Session expirée | Redirection vers /login avec retour ; saisie restaurée depuis le navigateur |
| Plus Premium | « Ta question à l'équipe fait partie de Premium. » + lien /abonnement ; aucun historique affiché |
| Fermé | `EQUIPE_QUESTIONS_OUVERT` à false : la page répond 404, les entrées sont masquées |

### 2.4 Accusé, délai promis, réponse, historique

- **Accusé immédiat** (e-mail transactionnel, noreply, « L'Équipe Deviens Marrant ») : rappelle la date limite. Pas de copie du texte de la question dans l'e-mail (donnée libre, minimisation).
- **Délai promis : « au plus tard 7 jours après ta question »**, date calculée et affichée (`dueAt = receivedAt + 7 j`). Tenable avec deux passages par semaine (mardi, vendredi : §3.2). Avec un seul lot hebdomadaire, le pire cas atteint 8 à 9 jours : option B du point T1.
- **Réponse** : e-mail depuis l'adresse d'envoi du site (noreply, comme les autres e-mails), signé « L'Équipe Deviens Marrant », objet repris des premiers mots de la situation ; la même réponse est lisible dans `/ta-question-a-l-equipe/{id}`. Ordre : la réplique utile d'abord, pourquoi elle marche, une sortie polie si le contexte l'exige, une ressource proposée seulement si elle aide (« On peut te partager un article si tu as envie d'en savoir plus », jamais de lien imposé). Pas de promesse de suivi par réponse à l'e-mail : la suite passe par une nouvelle question (quota).
- **Retard** : à J+6 sans réponse envoyée, e-mail automatique à l'abonné (« Ta réponse a un peu de retard, elle arrive d'ici le {date} ») et alerte admin ; au plus un e-mail admin par jour (06/10).
- **Historique** : `/ta-question-a-l-equipe` liste ses questions (date, 120 premiers caractères, statut visible : Reçue / En préparation / Réponse envoyée). Détail : question complète, réponse, état de la réutilisation (acceptée, refusée, aucune). Vide : « Tu n'as pas encore posé de question. Une situation où tu as manqué de répartie fait une très bonne première question. » + bouton.
- **Suppression** : « Supprimer cette question » efface question et réponse en base (hors extraits déjà envoyés dans une lettre, anonymisés). Suppression du compte : cascade.

## 3. Back-office (`/admin/equipe-questions`)

### 3.1 Statuts
`RECUE` (à la soumission) → `EN_PREPARATION` (brouillon importé de la session) → `RELUE` (validée par Thomas, texte final figé) → `ENVOYEE` (e-mail parti, réponse visible dans l'espace). Statut hors flux : `ECARTEE` (hors sujet ou abusive : l'abonné reçoit toujours un message, jamais le silence, et le quota de la semaine lui est rendu). Indicateur `sensible` posé à la main : une question sensible sort du lot et est traitée à la main (conduite : [À ÉCRIRE, décision du 14/10 point 6, pas encore rédigée]). Côté abonné, 3 libellés : Reçue / En préparation / Réponse envoyée.
Vue admin : file triée par `dueAt` croissant, filtre par statut, badge « en retard » à J+6, détail (situation, brouillon éditable, réponse finale), actions « Enregistrer », « Marquer relue », « Envoyer » (idempotent), « Écarter », « Créer une question » (saisie d'une question reçue hors site, nécessaire au pilote du §8).

### 3.2 Lot hebdomadaire (préparation avec les agents, relecture avant envoi)
1. **Mardi, lot principal.** Export du lot : question + identifiant opaque, SANS e-mail, nom ni identifiant de compte (minimisation avant toute préparation).
2. Session : @copywriter rédige un brouillon par question en voix du site ; toute vanne passe la relecture à l'aveugle (règle d'or) ; @reviewer applique la grille ci-dessous ; import des brouillons dans l'admin (`EN_PREPARATION`).
3. Thomas relit dans l'admin, corrige si besoin (`replyEditedByAdmin` conservé pour mesurer la qualité des brouillons), passe `RELUE`, envoie. Aucune réponse ne part sans ce clic : la règle « aucune IA ne publie seule » est tenue par construction.
4. **Vendredi, rattrapage** uniquement si une question a une échéance avant le mardi suivant. Règle générale : l'échéance prime sur le calendrier du lot.
5. Thomas absent : le retard est annoncé à l'abonné (§2.4), le quota par abonné peut être réduit en base (`QUESTIONS_PAR_SEMAINE`) avant de rallonger le délai.

**Grille de qualité (binaire, par réponse, avant envoi)** : tutoiement ; zéro tiret cadratin ; zéro émoji ; zéro mention IA ; zéro fait, citation ou chiffre inventé ; reprend au moins un détail précis de la situation décrite (pas de réponse générique) ; contient au moins 1 réplique utilisable ; au plus 1 trait d'humour, jamais aux dépens de la personne, au niveau de la barre Alexa ou absent ; 120 à 250 mots [HYPOTHÈSE] ; signature « L'Équipe Deviens Marrant ». Échec d'un critère = réécriture et nouvelle vérification. Si les agents ne produisent rien d'au niveau : la question reste `EN_PREPARATION` et Thomas répond à la main.

### 3.3 Quota par abonné [HYPOTHÈSE à valider par Thomas, point T2]
**1 question par semaine civile (lundi 00 h à dimanche, heure de Paris) et 2 questions non répondues au plus.** Justification : le coût réel est le temps de relecture de Thomas (solo) et 2,99 €/mois ou 24,99 €/an ne justifient pas un accompagnement sans plafond ; 1 par semaine suit le rythme des parcours (une étape par semaine) ; aujourd'hui 2 abonnés donnent au plus 2 questions par semaine ; le plafond de 2 en cours évite qu'une rafale écrase la file. Réglable en base sans déploiement, publié dans l'interface (« une question par semaine »), jamais « illimité ».
Limites techniques : rate limit partagé (celui de la s16) par compte et par IP ; clé d'idempotence contre le double clic.

## 4. Lettre hebdomadaire Premium

**Contenu type (4 blocs, ≤ 400 mots [HYPOTHÈSE])** : (1) *Le courrier de la semaine* : la question anonymisée, 2 à 4 lignes ; (2) *La réponse décryptée* : réplique, pourquoi elle marche, sortie polie ; (3) *Au carnet cette semaine* : une fiche du carnet du mois (titre, phrase reçue, lien vers `/carnet` ; 15 fiches le premier mois puis 30, donc de quoi tenir chaque semaine) ; (4) pied : « Poser ta question » + désinscription. Objet = la situation en une phrase. Signature « L'Équipe Deviens Marrant », aucune promesse de prix, aucune publicité.
**Jour et heure : jeudi 8 h Paris** [HYPOTHÈSE : précède le week-end et les soirées où le persona se fait chambrer ; aucune donnée d'ouverture pour trancher].
**Réutilisation d'une question** : la question doit avoir la case cochée ; l'abonné reçoit avec sa réponse (ou dans un e-mail dédié) la version anonymisée et la date de la lettre ; lien « Je préfère que non » valable jusqu'au lundi 8 h qui précède l'envoi ; refus ou silence après relance d'un jour = on ne publie pas [reco : silence vaut non]. La lettre de la semaine N reprend donc des réponses envoyées en N-1 ou avant.
**Semaines sans question utilisable** : stock de secours de **8 numéros** [HYPOTHÈSE] préparés et validés AVANT l'ouverture (relecture à l'aveugle, validation de Thomas). Une situation de secours est présentée comme un exemple (« Imagine : on te lance… », choix du 29/09), jamais comme la question d'un vrai membre. Alerte admin si le stock tombe sous 4 ; s'il n'y a aucun numéro VALIDÉ, rien n'est envoyé (jamais d'envoi non validé). Honnêteté de pilotage : avec 2 abonnés, la plupart des semaines seront des numéros de secours ; la promesse publique est « chaque semaine », jamais « la question d'un membre chaque semaine ».
**Articulation avec la mensuelle gratuite** : destinataires de l'hebdo = Premium actif ET préférence activée. La mensuelle exclut un Premium actif seulement s'il reçoit l'hebdo (précision à reporter dans `lettre-inscription-s21.md` §6.2, qui exclut tout Premium actif : un Premium sans hebdo n'aurait plus rien). Fin de l'abonnement : l'hebdo s'arrête (`stopOrigin = fin-premium`), la mensuelle reprend si l'adresse est confirmée. Un seul envoi par destinataire et par semaine ISO (journal d'envoi partagé avec la mensuelle, motif `lastSentWeek` de `ParcoursReminderPreference`).
**Inscription** : opt-in (case non cochée sur la page de succès du paiement et au profil), précédent D7 des rappels de parcours ; les 2 abonnés existants reçoivent UNE proposition (brouillon validé par Thomas). Reco, points T4 et L2.
**Désinscription** : en-têtes `List-Unsubscribe` + `List-Unsubscribe-Post` (un clic) et lien dans le corps ; arrête seulement l'hebdo (ni l'abonnement Stripe, ni la mensuelle), page de confirmation, réactivation depuis le profil.

## 5. Argument de vente : 1 ligne pour /abonnement (puce de la liste des avantages)

| | Texte (tutoiement, zéro tiret cadratin) | Avis |
|---|---|---|
| A | **Ta question à l'équipe : raconte en privé la situation qui t'a coincé, on te répond dans la semaine.** | Reco. Sobre, vrai (délai de 7 jours), aucun chiffre, ne répète pas « muet » du surtitre du lot 2. |
| B | Une question par semaine à l'équipe : tu racontes la scène, tu reçois la réplique qui t'aurait sauvé et pourquoi elle marche. | Plus concret mais lie la page au quota (à changer si T2 change). |
| C | Tu t'es fait chambrer et tu n'as rien trouvé ? Décris-nous la scène en privé, la réponse arrive par e-mail. | Plus incarnée, sans promesse de délai ; la question d'ouverture reprend le vocabulaire du persona. |

Cohérence avec le lot 2 : la ligne s'ajoute à la liste des avantages, sous la carte et le bouton, sans toucher au surtitre, au H1, au sous-titre, à la carte, à la réassurance, ni à l'extrait du carnet. Elle n'est publiée qu'au lot E (fonction ouverte et testée, jamais de promesse non tenue), après la fin de la fenêtre de mesure du lot 2. Texte neuf : passe la relecture à l'aveugle (2 sur 3) avant ligne de code. Pas de « 1 500+ », pas de mention IA, pas d'« Alex ».

## 6. Données et code

### 6.1 Ce qui existe
`User`, `Subscription` (plan, statut, `cancelAtPeriodEnd`) et le test Premium (`isPremiumPlan`) ; page profil et carte abonnement ; Resend (`lib/email.ts`) ; limite d'essais partagée (`lib/rate-limit.ts`) ; admin (`/admin`, `api/admin/*`, jeton) ; planificateur (`lib/scheduler/jobs.ts`, `JobLock`) ; `ParcoursReminderPreference` (précédent d'envoi hebdo avec preuve de consentement, `lastSentWeek`, `stopOrigin`) ; `NewsletterSubscriber` et la spec de la lettre mensuelle (journal d'envoi, `NewsletterIssue`, `List-Unsubscribe`, `LETTRE_OUVERTE`) ; Umami (`trackUmami`, `emailsExclus()`) ; carnet mensuel (`data/carnet/*.json`).

### 6.2 Ce qui manque
- **Modèles** (migration, sans toucher `User`) : `EquipeQuestion` (userId avec suppression en cascade, situation, retourUtilisateur, statut, sensible, receivedAt, dueAt, weekKey, brouillon, réponse, replyEditedByAdmin, relueAt, sentAt, idempotencyKey unique, réutilisation : consentement + version + date, statut AUCUNE/PROPOSEE/ACCEPTEE/REFUSEE, texte anonymisé, jeton de refus) ; `PremiumLetterPreference` (calque de `ParcoursReminderPreference`) ; `NewsletterIssue` étendue d'une audience MENSUELLE/HEBDO_PREMIUM et d'un type COURRIER/SECOURS (à coordonner avec le lot de la lettre mensuelle, un seul journal d'envoi).
- **Routes abonné** : `POST/GET /api/equipe-questions`, `GET/DELETE /api/equipe-questions/[id]`, `POST /api/equipe-questions/[id]/reutilisation` (refus par jeton). **Routes admin** : liste, `export-lot` (sans identifiants), `import-brouillons`, `PATCH` statut et réponse, `envoyer`, `ecarter`, création manuelle. **Pages** : `/ta-question-a-l-equipe`, `/ta-question-a-l-equipe/[id]`, `/admin/equipe-questions`, page d'arrêt de l'hebdo.
- **E-mails** (brouillons validés par Thomas, prénom avec repli propre, jamais de « undefined ») : accusé, réponse, retard, proposition de réutilisation, écartée, lettre hebdo, proposition d'inscription à l'hebdo.
- **Tâches planifiées** : `equipe-echeances` (quotidien : retards J+6, alerte admin 1/jour max), `lettre-hebdo-premium` (jeudi 8 h, verrou `lettre-hebdo-AAAA-Www`), `equipe-stock-secours` (alerte sous 4), `equipe-purge` (selon @legal Q3).
- **Interrupteur** `EQUIPE_QUESTIONS_OUVERT` (false par défaut, motif `BOULOT_PUBLIE`) ; test d'absence de tiret cadratin sur tous les textes (`config/textes/equipe-s21.ts`).
- **Événements Umami** (convention du site, aucune donnée personnelle) : `equipe-question-vu` (emplacement), `equipe-question-envoi`, `equipe-question-echec` (raison : situation, quota, reseau, session), `equipe-reponse-lue`, `equipe-lettre-arret`. Étapes : vu, envoi, réponse lue. La base fait foi ; comptes de Thomas exclus (`emailsExclus()`). Indicateurs : part des Premium actifs ayant posé ≥ 1 question en 30 jours, respect de l'échéance 7 j (cible 100 %), part de brouillons envoyés sans réécriture lourde ; lecture qualitative tant que les abonnés sont moins de 10 [HYPOTHÈSE, seuils avec @data-analyst].

### 6.3 Lots (par dépendances) et critères d'acceptation

| Lot | Contenu | Dépend de |
|---|---|---|
| A | Socle : migration, admin (file, export/import, envoi, écarter, création manuelle), e-mail de réponse, tâche d'échéances, interrupteur | rien |
| B | Parcours abonné : page, formulaire, quota, accusé, historique, suppression, entrées E1 E2 E4, événements | A |
| C | Lettre hebdo : préférence, numéros, stock de secours, tâche d'envoi, désinscription, exclusion de la mensuelle | A pour les courriers ; infra d'envoi du lot lettre mensuelle |
| D | Réutilisation anonymisée : case, proposition, refus par jeton, sélection admin | A, B, C et réponses @legal Q1 à Q4 |
| E | Vente : puce /abonnement, encart pour membre non abonné, mention à l'accueil Premium | B, C en ligne, duel à l'aveugle, fin de mesure du lot 2 |

| ID | Given / When / Then (binaire) |
|---|---|
| A1 | Une question `RECUE` ; export du lot ; la réponse ne contient ni e-mail, ni nom, ni userId, seulement id opaque et texte |
| A2 | Question `ENVOYEE` ; second appel de `envoyer` ; 200 sans second e-mail |
| A3 | Réponse non `RELUE` ; `envoyer` ; 409 |
| A4 | Question `sensible` ; export du lot ; absente |
| A5 | Échéance à moins de 24 h et statut non `ENVOYEE` ; tâche d'échéances ; 1 alerte admin par jour au plus, 1 e-mail de retard à l'abonné une seule fois |
| A6 | Brouillon importé avec un tiret cadratin, un émoji ou la mention « intelligence artificielle » ; import ; refusé avec la liste des champs fautifs |
| A7 | Interrupteur à false ; appel des routes abonné ; 404 |
| B1 | Premium ACTIVE, situation de 30 caractères ; envoi ; 201, `RECUE`, `dueAt` = +7 jours, accusé envoyé |
| B2 | Situation de 29 puis de 1 001 caractères ; envoi ; 400 avec le message exact du §2.3 |
| B3 | Une question déjà posée cette semaine (Paris) ; nouvel envoi ; 409 avec la date du lundi |
| B4 | Deux questions non répondues ; envoi la semaine suivante ; 409 |
| B5 | Visiteur, puis membre sans Premium, puis abonnement terminé ; appel ; 401 puis 403 puis 403 |
| B6 | Double clic sur « Envoyer ma question » ; une seule ligne en base |
| B7 | Session expirée pendant la saisie ; reconnexion ; le texte est restauré |
| B8 | Abonné A demande la question de B ; 404 |
| B9 | Formulaire neuf ; case de réutilisation décochée ; cochée puis envoyée ; version, date et origine en base |
| B10 | Suppression d'une question ; 204 ; plus listée ; suppression du compte ; cascade |
| B11 | Abonnement PAST_DUE ; accès à la page ; autorisé |
| B12 | Question reçue puis abonnement terminé ; envoi de la réponse ; part, historique inaccessible |
| C1 | Préférence active ; tâche relancée 2 fois dans la semaine ISO ; 1 seul e-mail |
| C2 | Premium avec hebdo active ; envoi de la mensuelle ; exclu ; sans hebdo ou après fin d'abonnement ; inclus |
| C3 | Désinscription en un clic ; préférence à off, abonnement Stripe et mensuelle inchangés |
| C4 | Aucun courrier accepté ; tâche du jeudi ; envoi d'un numéro de secours VALIDÉ ; aucun numéro VALIDÉ, aucun envoi et alerte admin |
| D1 | Case non cochée ; sélection pour la lettre ; refusée |
| D2 | Question sélectionnée ; l'abonné reçoit le texte anonymisé ; refus avant lundi 8 h ; exclue de la lettre |
| D3 | Jeton de refus invalide ; page « Ce lien ne fonctionne plus. » sans fuite d'information |
| E1 | Interrupteur fermé ; /abonnement ; puce absente ; ouvert ; texte conforme à la variante validée, sans tiret cadratin |

## 7. Questions

### 7.1 Pour @legal (sans rouvrir la mention IA des 06/05 et 14/10)
1. **Base légale et information** : texte libre = données personnelles (et possiblement sensibles, ou concernant des tiers cités). Mention sous le formulaire, destinataires et sous-traitants (envoi d'e-mails, outils de préparation en session, transferts hors UE) à indiquer dans `/confidentialite` : quelle formulation minimale ?
2. **Lettre hebdo** : prestation incluse dans le contrat Premium (désinscription en un clic) ou communication à consentement séparé ? Reco opt-in.
3. **Conservation** : question, réponse, preuve de consentement de réutilisation, journal d'envoi. Proposition : tant que le compte existe, puis 12 mois après la fin de l'abonnement [HYPOTHÈSE], effacement immédiat sur demande.
4. **Anonymisation** : avec 2 destinataires qui peuvent reconnaître l'histoire, accord à la soumission + prévenance avec refus possible suffit-il, ou faut-il une confirmation explicite par extrait ? Que faire d'un retrait du consentement après envoi (e-mail non rappelable) ?
5. **Sujets sensibles, tiers cités, mineurs** : conduite à tenir si la question révèle santé, harcèlement ou détresse (décision du 14/10 point 6) ; âge non collecté : risque ?
6. **Droits** : accès (art. 15), effacement (art. 17), export de l'historique ; effet de la suppression de compte sur les extraits déjà envoyés.
7. **Résiliation et rétractation** : perte d'accès à l'historique à écrire dans les CGU ; une question traitée pendant les 14 jours modifie-t-elle le droit au remboursement du premier paiement (`remboursement-abonnement-s21.md`, aucune renonciation collectée) ?
8. **CGU** : nature de la prestation (conseil de répartie, ni psychologique ni garanti), licence de réutilisation du texte de l'abonné, limite de responsabilité.

### 7.2 Pour Thomas (une décision par point, avec ma reco)
- **T1 Délai** : « au plus tard 7 jours » grâce à deux passages (mardi, vendredi) [reco] ; ou un seul lot hebdomadaire et promesse « sous 10 jours ».
- **T2 Quota** : 1 par semaine, 2 en cours [reco] ; ou plus large (2 par semaine) ; ou plus strict.
- **T3 Jour de la lettre hebdo** : jeudi 8 h [reco], sinon mardi ou vendredi.
- **T4 Inscription à l'hebdo** : opt-in avec une proposition unique aux 2 abonnés [reco] ; ou envoi d'office avec désinscription en un clic (selon @legal Q2).
- **T5 Pilote avant le code** : e-mail aux 2 abonnés et traitement à la main des 2 premières questions via le lot A [reco : oui, avant B].
- **T6 Question reçue puis abonnement arrêté** : on répond quand même [reco] ou non.
- **T7 Fiche du carnet chaque semaine dans la lettre** : oui [reco, valeur rappelée et stock existant] ou courrier + réponse seuls.
- **T8 Stock de secours** : 8 numéros validés avant ouverture [reco], produits avec @copywriter et relus à l'aveugle. À écrire aussi avant ouverture : la conduite pour les questions sensibles.

## 8. Calendrier
- **Rien en ligne avant le bilan du lot 1 (~10/11)** ; aucun déploiement, même masqué, d'ici là (Thomas en voyage du 18 au 25/10, aucun envoi à prévoir).
- **Ordre après le bilan** : lot 2 d'abord (sa fenêtre de mesure dure 4 semaines) ; lots A à D ensuite dans un déploiement SÉPARÉ, interrupteur ouvert aux seuls Premium : aucune page visiteur ne change, la mesure du lot 2 reste lisible ; lot E (puce /abonnement, encart membre) seulement une fois la fenêtre du lot 2 close (date du déploiement du lot 2 + 28 jours).
- **Prérequis d'ouverture** : pilote des 2 premières questions traité, stock de 8 numéros validé, réponses @legal Q1, Q3, Q4 intégrées à `/confidentialite` et aux CGU, textes validés à l'aveugle, tests Jest et Playwright (375 px), rendu @design et @ux à 10/10 sur captures (règle du 07/10), journal `REPLIT_ACTIONS.md` à jour. Handoff : @fullstack lots A à E (§6.3) ; @copywriter textes §2, e-mails, 8 numéros de secours, ligne §5 ; @legal §7.1 ; @data-analyst §6.2.
