# Relecture à l'aveugle : étalons onboarding Premium s23 (reviewer v1, 06/11/2026)

Pack relu : `docs/copy/etalons-onboarding-s23.md` (4 étalons × 3 options + recos). Barre : 9/10.
Sources vérifiées : `founder-preferences.md` (14/10, 17/10, 25/10, 06/11), `ton-alex.md`, cadre légal B (`docs/legal/resiliation-onboarding-cadre-s23.md`), code (`config/textes/paiement.ts`, `config/lettre.ts`, `config/textes/abonnement-vente.ts`, `config/textes/avantages-premium.ts`, `config/premium.ts`, `config/question-equipe.ts`, `config/textes/lettre-hebdo-s21.ts`, `config/textes/parcours*.ts`, `components/ui/favorite-button.tsx`, `lib/email.ts`, `lib/lettre/numeros-hebdo.ts`).

## Verdict

| # | Critère | Note | En une ligne |
|---|---|---|---|
| 1 | Options utilisables telles quelles, réellement différentes | 8 | Les 12 options sont bien distinctes ; 4 ne sont pas utilisables telles quelles (étalon 1 C, étalon 2 B et C, variantes de l'étalon 3). |
| 2 | Exactitude (code, /abonnement, promesses, délais, nombres) | 6 | Ligne lettre branchée sur le mauvais interrupteur, « 8 h » faux, carnet non conditionné, favoris « dans ton profil » faux, exercices « dans la journée » faux, « cinq minutes suffisent » pour une étape contredit 15 à 20 min, réponse vers noreply@. |
| 3 | Ton d'Alex, tutoiement, signature, zéro tiret cadratin | 8,5 | Signature « L'Équipe Deviens Marrant » et « on » conformes (14/10, 17/10), 0 tiret cadratin (Grep), tutoiement partout ; une phrase hachée (1 C), une image scolaire (3 A). |
| 4 | Cadre légal B | 7,5 | Aucune promotion, lien d'arrêt prévu, bloc contractuel gardé dans E0 ; mais l'objet de E0 perd le signal « abonnement confirmé » (objet validé s16), et la règle d'envoi ne couvre pas les autres e-mails non transactionnels du même jour. |
| 5 | Recos motivées, questions claires | 8 | Questions A/B/C nettes, chiffres sourcés (`resiliations-s23-donnees.md`) ; reco 2 = l'option la plus fautive ; deux lectures « Revenu » mesurent ce qui ne laisse pas de trace. |
| 6 | Effet rétention sans pression | 8,5 | Aucun hook de surveillance, aucune urgence ; « Ce soir » (2 C) et la condition « action enregistrée » (3) risquent de parler à côté de l'abonné. |
| **Globale** | | **7,5** | **Sous la barre : NO-GO pour présentation à Thomas en l'état** (règle du 25/10 : tout doit être juste avant de lui être montré). 10 corrections obligatoires ci-dessous, toutes à texte exact. |

## Corrections OBLIGATOIRES (texte exact à reprendre dans le pack)

**O1. Ligne lettre : mauvais interrupteur et heure fausse (étalon 2, A, B, C ; note ligne 33).**
Constat : le pack ne rend la ligne que si `LETTRE_HEBDO_PROMESSE` est vrai (aujourd'hui `false`, `config/lettre.ts:152`). Or cet interrupteur ne gouverne que la mention **publique** (/abonnement, FAQ, llms.txt, commentaire `lettre.ts:143-145`). Les abonnés sont inscrits d'office (choix du 25/10) et la lettre part déjà (`LETTRE_HEBDO_INSCRIPTIONS_OUVERTES` et `LETTRE_HEBDO_ENVOIS_OUVERTS` à `true`) : avec la règle du pack, le bienvenue tairait une lettre qui arrive le jeudi suivant. Le code a déjà la bonne règle pour le retour de paiement : ligne selon l'état du compte (`LETTRE_HEBDO_INFO_PAIEMENT`, `lettre-hebdo-s21.ts:41-48`). Enfin « à 8 h » n'est pas garanti : un numéro peut partir du jeudi 8 h au dimanche (`numeros-hebdo.ts:139` et `:223`), et le texte validé ne dit pas d'heure.
Remplacer la phrase de la ligne 33 par :
> Ligne lettre rendue selon l'état réel du compte, même règle que la ligne du retour de paiement (`LETTRE_HEBDO_INFO_PAIEMENT`) : état `recoit` seulement ; `arretee`, `opposition` ou état illisible : pas de ligne. Elle ne dépend pas de `LETTRE_HEBDO_PROMESSE`, qui ne gouverne que les mentions publiques : l'abonné est inscrit d'office (choix du 25/10) et la reçoit dès le jeudi suivant.

Remplacer la ligne « [si lettre] La lettre chaque jeudi à 8 h, arrêt en un clic. » (A et B) par :
> - [si état `recoit`] La lettre de la semaine, chaque jeudi, incluse dans ton abonnement : tu l'arrêtes en un clic, depuis chaque lettre ou ton profil.

Dans C, remplacer « [si lettre] La lettre arrive chaque jeudi à 8 h, arrêt en un clic. » par :
> [si état `recoit`] La lettre de la semaine arrive chaque jeudi, incluse dans ton abonnement ; tu l'arrêtes en un clic, depuis chaque lettre ou ton profil.

**O2. Carnet du mois non conditionné (étalon 1 B, étalon 2 A/B/C, étalon 3).**
Constat : sur /abonnement, la ligne carnet disparaît quand le carnet du mois est absent (`lignesTableau({ carnet })`, `abonnement-vente.ts:126-128`, test « Carnet du mois absent : sa ligne disparaît »). Le pack l'écrit sans condition, et E1 envoie vers /carnet sans condition.
Ajouter dans le paragraphe d'en-tête de l'étalon 2 :
> Lignes carnet rendues seulement si le carnet du mois est publié (`carnet` de `lignesTableau`) ; sinon la ligne disparaît, comme sur /abonnement.

Étalon 1 B, prévoir le repli :
> [sans carnet du mois] Salut {prénom}, voici ce qui vient de s'ouvrir : le catalogue sans limite et les {PARCOURS_COUNT} parcours en entier.

Étalon 3, ajouter dans l'en-tête :
> Sans carnet du mois publié, tout abonné reçoit la variante parcours, avec le lien de la première étape du parcours conseillé.

**O3. Favoris : « dans ton profil » est faux (étalon 2 B).**
Constat : les favoris vivent sur la page `/favoris`, ouverte depuis le menu du compte (`account-menu.tsx:38`, `mobile-nav.tsx:78`), pas dans le profil. L'étoile est juste (`favorite-button.tsx:85`).
Remplacer par :
> - Tes favoris : l'étoile sur une fiche la range dans ta page Favoris.

**O4. Exercices : « un défi à tenter dans la journée » est faux (étalon 2 B).**
Constat : les exercices des fiches sont de trois sortes, « Pour écrire ta vanne », « Pour essayer ce conseil », « Pour décrypter cette vidéo » (`abonnement-vente.ts:55-57`) ; aucun n'est fixé « dans la journée » (délai non documenté).
Remplacer par :
> - Les exercices des fiches : sous chaque vanne, chaque conseil et chaque vidéo, de quoi t'entraîner (écrire ta vanne, essayer le conseil, décrypter la vidéo).

**O5. Option C de l'étalon 2 : incohérente et pas utilisable telle quelle.**
Constats : (a) « Ce mois : les {PARCOURS_COUNT} parcours en entier » alors que la même phrase conseille une étape par semaine et que 3 parcours durent 6 semaines (`premium.ts:79-85`) ; (b) « Ce soir » propose trois choses (catalogue, une étape, le carnet) : ce n'est pas « un premier pas », et ça ne rejoint pas l'E1 qui tranche pour le carnet ; (c) E0 part au paiement, souvent le matin : « Ce soir » sonne faux à 8 h.
Remplacer l'option C par :
> **Pour commencer** : [si carnet du mois] une fiche du carnet du mois, une situation et sa réplique. [sinon] la première étape d'un parcours, au choix parmi les {PARCOURS_COUNT}.
> **Cette semaine** : le catalogue sans limite, les exercices des fiches, tes favoris, ta progression et ta série. [si état `recoit`] La lettre de la semaine arrive chaque jeudi, incluse dans ton abonnement ; tu l'arrêtes en un clic, depuis chaque lettre ou ton profil.
> **Ensuite, à ton rythme** : les {PARCOURS_COUNT} parcours en entier (toutes les étapes sont ouvertes, une par semaine reste le rythme conseillé), [si carnet] les carnets passés, [si question] « Ta question à l'équipe » depuis ton profil, et le rappel de ton parcours par e-mail si tu le demandes.

Et dans la reco : remplacer « porte le « par où commencer » dans E0 (« Ce soir ») » par « porte le « par où commencer » dans E0 (« Pour commencer ») ».

**O6. Variantes « déjà commencé » de l'étalon 3 : condition trop large, durée fausse, lien imprécis.**
Constats : (a) « si une action est enregistrée » couvre un favori ou un avis, pas forcément une étape : l'abonné qui a mis un favori recevrait « ta prochaine étape de parcours t'attend » sans avoir ouvert de parcours ; (b) « cinq minutes suffisent » contredit le rythme documenté de 15 à 20 min par semaine (29/09, `premium.ts:77-85`) ; (c) « Reprendre » est interdit sur un parcours fini (étalon s17 3.4, `parcours.ts:221`) ; (d) le rappel de parcours envoie déjà vers l'étape elle-même (`parcours-emails.ts:67`), pas vers la liste.
Remplacer, dans l'en-tête de l'étalon 3, « si une action est enregistrée » par :
> si l'abonné a un parcours en cours (au moins une étape validée, parcours non terminé)

Remplacer les trois variantes par :
> A : « Ta prochaine étape de parcours t'attend, là où tu t'es arrêté. » + « Reprendre mon parcours : {lienEtape} »
> B : « Pour continuer sans te poser de question, ta prochaine étape de parcours t'attend. » + « Reprendre mon parcours : {lienEtape} »
> C : « Par ta prochaine étape de parcours, là où tu t'es arrêté. » + « Reprendre mon parcours : {lienEtape} »

avec la note : « `{lienEtape}` = lien direct de la prochaine étape, comme le rappel de parcours (`parcours-emails.ts:67`). »

**O7. « Réponds à cet e-mail, on lit tout » : la réponse part aujourd'hui vers noreply@ (étalons 3 A et C, étalon 4 A, B, C).**
Constat : l'expéditeur par défaut est `noreply@deviens-marrant.fr` (`lib/email.ts:5`) ; seuls les envois qui passent un `replyTo` reçoivent les réponses (`scheduler/jobs.ts:726`). Sans réglage, « on lit chaque réponse » est une promesse fausse. Le cadre B F6 veut aussi que l'invitation renvoie à « Ta question à l'équipe ».
Ajouter dans les « Communs » :
> E1 et E2 partent avec une adresse de réponse (`replyTo`) vers alex@deviens-marrant.fr, la boîte de « Ta question à l'équipe » (`QUESTION_EQUIPE_DESTINATAIRE`) : une réponse y est traitée comme une question à l'équipe, dans les délais déjà fixés (en général sous 1 à 2 jours ouvrés). Sans ce réglage, aucune option qui invite à répondre ne part.

**O8. Règle d'envoi : « jamais un jeudi » ne suffit pas à tenir « au plus un e-mail non transactionnel par jour » (06/11).**
Constats : un numéro de la semaine peut partir du jeudi au dimanche (`numeros-hebdo.ts:139`) ; le rappel de parcours part le jour choisi par l'abonné (`parcours.ts:131-134`). Un E1 « décalé au vendredi » peut tomber le même jour que l'un ou l'autre.
Remplacer « E1 et E2 ne tombent jamais un jeudi (jour de la lettre) ; un e-mail dû un jeudi part le vendredi. » par :
> E1 et E2 ne partent jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel : le jeudi (lettre), le jour d'un numéro de la semaine parti en retard, le jour de son rappel de parcours s'il l'a demandé. L'e-mail glisse au premier jour libre suivant.

Aligner les mentions « Jamais un jeudi : si J5 / J21 tombe un jeudi, l'e-mail part le vendredi » des étalons 3 et 4 sur cette règle.

**O9. Objet de E0 : un choix validé remplacé sans le dire, et le signal de confirmation qui disparaît (étalon 1).**
Constats : l'objet actuel « Bienvenue dans Premium, ton abonnement est confirmé » est l'objet 2.2 validé par Thomas le 07/10 (`paiement.ts:276`). Le 06/11 rouvre le bienvenue (« bienvenue revue, avec le premier pas ») sans viser l'objet nommément : le pack doit le dire. Ensuite, E0 est le support durable de la confirmation de commande : « C'est ouvert » ou « Premium est ouvert, sers-toi » ne se retrouve pas dans une boîte mail quand l'abonné cherche sa confirmation, et ressemble à un e-mail promotionnel (cadre B D6 : objet clair).
Ajouter sous le titre de l'étalon 1 :
> Objet actuel, validé le 07/10 (s16, objet 2.2) : « Bienvenue dans Premium, ton abonnement est confirmé ». Les trois objets ci-dessous gardent le mot « confirmé » (c'est l'e-mail de confirmation de commande) ; Thomas peut aussi garder l'objet actuel et ne choisir que la première phrase.

Objets à mettre à la place :
> A : « Ton abonnement est confirmé : Premium est ouvert, sers-toi »
> B : « Abonnement confirmé : voici tout ce que Premium t'ouvre »
> C : « Abonnement confirmé, tout est ouvert »

Mettre à jour la question à Thomas :
> « Pour l'objet et la première phrase du bienvenue, tu prends A (complice), B (concret), C (court), ou tu gardes l'objet actuel avec la phrase de l'option de ton choix ? »

**O10. Étalon 1 C : phrase hachée (style fluide, 06/05).**
Constat : « Salut {prénom}, tout est ouvert. La liste, puis un premier pas de cinq minutes. » enchaîne une phrase de 3 mots et un fragment nominal, le staccato banni.
Remplacer par :
> Salut {prénom}, tout est ouvert : voici la liste, puis un premier pas pour t'y mettre.

## Corrections SOUHAITABLES

- **S1. Étalon 1 B redit la liste qui suit** (catalogue, parcours, carnet, puis la liste les répète : règle de concision du 18/10). Proposé : « Salut {prénom}, voici ce qui vient de s'ouvrir, et par où commencer. »
- **S2. « Cinq minutes » pour le carnet** (1 C, 2 C d'origine, 3 A, B, C) : durée non documentée (fiche d'environ 100 mots, 03/10). Tolérable au titre du 08/10 (repère de durée cohérent) ; à garder seulement si une fiche se lit et s'essaie bien en cinq minutes, sinon « une situation, sa réplique » suffit.
- **S3. Étalon 3 A, « ta tête rend copie blanche »** : image d'école (« ni scolaire », `ton-alex.md`). Proposé : « À la machine à café, quelqu'un te balance une remarque devant tout le monde, et rien ne te vient. »
- **S4. Étalon 3 C, « du boulot au rencard »** : c'est l'accroche du catalogue (`avantages-premium.ts:15`), appliquée ici au carnet. À garder seulement si le carnet du mois couvre aussi des situations de rencard ; sinon « du boulot aux dîners de famille » ou rien.
- **S5. Étalon 3 B** : l'option contient deux appels (écrire via « Ta question à l'équipe » et lire une fiche) ; le pack s'impose « une seule invitation à répondre, un seul lien ». C'est tenu à la lettre (un seul lien), mais à signaler à Thomas pour qu'il compare à armes égales.
- **S6. Motif de la reco 3** : « elle ne cite aucun délai (B le cite : il faut alors que la réponse passe bien par « Ta question à l'équipe ») » est confus. Proposé : « A ne promet aucun délai ; B en cite un, exact (« en général sous 1 à 2 jours ouvrés », `QUESTION_EQUIPE_DELAI`), parce qu'il renvoie à « Ta question à l'équipe ». »
- **S7. Lectures « Revenu » non mesurables** : « vise le premier accès sous 24 h » (2) et « délai entre l'envoi et le premier accès Premium suivant » (3) supposent une trace qui n'existe pas : lire le carnet, les listes ou une vidéo ne laisse rien en base, et Umami ne voit pas les acheteurs (`resiliations-s23-analyse.md:4`). Proposé : « Lecture : réponses reçues, favoris et étapes validées, cas par cas (la lecture du carnet ne laisse pas de trace). »
- **S8. Étalon 4 C** : « on avance avec ce que tu nous dis » sonne corporate ; C et A partagent le même objet, donc la différence ne tient qu'à cette phrase. Proposé pour C : « Salut {prénom}, trois semaines de Premium : qu'est-ce qui t'aide, et qu'est-ce qui manque ? Réponds à cet e-mail, on lit chaque réponse. »
- **S9. Hors pack, pour @fullstack** : `BIENVENUE_PREMIUM.lettre` (« Ta lettre de chaque semaine s'active depuis ton profil », `abonnement-vente.ts:175`) est périmé depuis l'inscription d'office du 25/10 ; il n'est pas rendu aujourd'hui (promesse fermée) mais le pack le cite comme source. Le retirer ou l'aligner sur `LETTRE_HEBDO_INFO_PAIEMENT.recoit`.
- **S10. Abonné avec rappel de parcours actif** : la variante « déjà commencé » de E1 redit ce que son rappel lui envoie déjà. Proposé : pour lui, garder la version carnet.

## Ce qui est juste (à ne pas toucher)

- Signature « L'Équipe Deviens Marrant », « on » et jamais « je » : conforme au 14/10 (e-mails automatiques depuis noreply@) et au 17/10 (« Alex, personne ne le connaît »). `SIGNATURE` = `paiement.ts:27`.
- Zéro tiret cadratin (Grep : 0), zéro émoji, zéro prix, zéro promotion, zéro urgence, aucun hook de surveillance (06/05).
- `{PARCOURS_COUNT}` dynamique (`premium.ts:89`, 5 aujourd'hui avec `STORYTELLING_PUBLIE` et `BOULOT_PUBLIE` à `true`) ; aucun autre nombre en dur.
- « Toutes, carnets passés compris », « Ta progression et ta série », « Tes favoris », « Exercices des fiches » : conformes au tableau Gratuit / Premium (`abonnement-vente.ts:124-133`). La recherche, ouverte aux visiteurs (05/10), n'est pas vendue comme un droit Premium : juste.
- « Ta question à l'équipe » depuis le profil, interrupteur ouvert (`question-equipe.ts:11`), délai de B identique à `QUESTION_EQUIPE_DELAI` (jamais 7 jours, 25/10).
- « Toutes les étapes ouvertes d'un coup, une par semaine conseillée » (18/10) et rappel « sur demande depuis ton profil » (`profil/rappel-parcours-toggle.tsx`) : exacts.
- Titres d'étapes cités en 2 B (« Ton anecdote, coupée au plus court », « La salle de réunion, sans un mot ») : présents dans `config/parcours-etapes.ts`.
- Bloc contractuel de E0 gardé dans le même e-mail, lisible sans clic (cadre E2, E3) ; lien d'arrêt dans E1 et E2 (D5) ; séquence à 3 e-mails conforme au 06/11.
- Reco 4 A : la meilleure option de tout le pack (« lever les yeux au ciel » rend la critique facile pour un introverti, sans pression).

## Après corrections

Les 10 obligatoires sont factuelles ou de cadre, pas de goût : une fois reprises mot pour mot, le pack passe à 9 sur les critères 2 et 4, et la globale atteint la barre. Re-vérification limitée à O1 à O10 (aucune autre partie à relire).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/copy/revues-onboarding/reviewer-v1.md`
- Décision : NO-GO (7,5/10), 10 corrections obligatoires à texte exact (O1 à O10), 10 souhaitables.
- Points d'attention : O1 (lettre, mauvais interrupteur) et O7 (`replyTo` vers alex@) touchent aussi le futur code des e-mails, à transmettre à @fullstack ; O9 rouvre un objet validé s16 : à présenter comme tel à Thomas, jamais en silence.
---
