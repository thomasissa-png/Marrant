# Étalons onboarding Premium (s23, v2, 06/11/2026) : à trancher par Thomas avant toute écriture

Règle P0 s8 : 5 étalons, 3 options chacun, une réponse attendue par étalon (A, B ou C). Aucun autre texte n'est écrit avant. v2 = v1 + corrections obligatoires du reviewer (O1 à O10), souhaitables en une ligne, pistes du panel des 3 personas, et étalon 5 (phrase anti-réflexe).
**Séquence (Thomas, 06/11 : « pas trop de mails car ils ont les newsletters, le J1 bof »)** : E0 bienvenue (J0, premier pas dedans) ; E1 à J5 « Une question ? » fusionné avec « par où commencer » ; E2 à J21 « Trois semaines : qu'est-ce qui manque ? ».

**Communs à toutes les options** : ton d'Alex (`ton-alex.md`), tutoiement, texte seul, signature « L'Équipe Deviens Marrant » (e-mails automatiques, 14/10 ; « Alex » ne signe pas ici, 17/10), « on » et jamais « je ». Prénom absent : « Salut, ». Zéro tiret cadratin, émoji, concurrent, promotion, prix, urgence, hook « tu n'as rien ouvert » (06/05). Aucune durée type « cinq minutes » (non documentée, S2) : « une situation, sa réplique » suffit. Lien d'arrêt « arrêter ces e-mails d'accueil » dans le pied de E1 et E2 (cadre @legal D5), non repris ci-dessous. E0 est transactionnel : il part tout de suite, jeudi compris, avec le bloc contractuel (confirmation, résiliation, rétractation, CGU, formulaire type) dans le même e-mail, lisible sans clic (cadre E2/E3).
**Envoi (O8)** : E1 et E2 ne partent jamais un jour où l'abonné reçoit déjà un autre e-mail non transactionnel : le jeudi (lettre), le jour d'un numéro de la semaine parti en retard, le jour de son rappel de parcours s'il l'a demandé. L'e-mail glisse au premier jour libre suivant.
**Réponse (O7)** : E1 et E2 partent avec une adresse de réponse (`replyTo`) vers alex@deviens-marrant.fr, la boîte de « Ta question à l'équipe » (`QUESTION_EQUIPE_DESTINATAIRE`) : une réponse y est traitée comme une question à l'équipe, dans les délais déjà fixés (en général sous 1 à 2 jours ouvrés). Sans ce réglage, aucune option qui invite à répondre ne part.
Références marché : non consultées (ton calé sur `ton-alex.md` et les étalons s16/s17 validés).

---

## Étalon 1 : objet et première phrase du bienvenue (E0)

Objet actuel, validé le 07/10 (s16, objet 2.2) : « Bienvenue dans Premium, ton abonnement est confirmé ». Le 06/11 rouvre le bienvenue sans le viser nommément : on le dit ici. E0 est la confirmation de commande, donc les trois objets gardent « confirmé » (retrouvable dans une boîte mail, pas un air de promotion, cadre B D6).

**A. Hybride : ton complice, contenu d'abord** (piste du panel : objet au ton de A, phrase au contenu de B)
> Objet : Ton abonnement est confirmé : Premium est ouvert, sers-toi
> Salut {prénom}, voici ce qui vient de s'ouvrir, et par où commencer.

**B. Concret, « voici ce qui est ouvert »**
> Objet : Abonnement confirmé : voici tout ce que Premium t'ouvre
> Salut {prénom}, voici ce qui vient de s'ouvrir : le catalogue sans limite, les {PARCOURS_COUNT} parcours en entier et le carnet du mois.
> [sans carnet du mois] Salut {prénom}, voici ce qui vient de s'ouvrir : le catalogue sans limite et les {PARCOURS_COUNT} parcours en entier.

**C. Court et direct**
> Objet : Abonnement confirmé, tout est ouvert
> Salut {prénom}, tout est ouvert : voici la liste, puis un premier pas pour t'y mettre.

**Reco : A**, parce que le panel donne le ton d'A à Yanis (8) et le contenu de B à Sophie et Marc (8 chacun), et que la phrase d'A ne redit pas la liste qui suit (S1). `[HYPOTHÈSE : l'hybride n'a pas été relu par le panel ; repli B, qui avait 2 voix sur 3]`.
**Revenu :** E0 est le seul lien avec un acheteur qui peut résilier en quelques minutes ; l'objet dit « confirmé » et la phrase répond d'emblée à « qu'est-ce que j'ai acheté ? ». Lecture sur 30 jours, cas par cas (4 abonnés au 02/11).
**Question à Thomas :** « Pour l'objet et la première phrase du bienvenue, tu prends A (hybride), B (concret), C (court), ou tu gardes l'objet actuel avec la phrase de l'option de ton choix ? »

---

## Étalon 2 : la liste « tout ce à quoi tu as droit » (bienvenue)

Contenu tiré de `lignesTableau`, `avantages-premium.ts` et du plan §3. Aucun nombre en dur : `{PARCOURS_COUNT}` vient de `config/premium.ts`. Lignes carnet rendues seulement si le carnet du mois est publié (`carnet` de `lignesTableau`) ; sinon la ligne disparaît, comme sur /abonnement. Ligne lettre rendue selon l'état réel du compte, même règle que la ligne du retour de paiement (`LETTRE_HEBDO_INFO_PAIEMENT`) : état `recoit` seulement ; `arretee`, `opposition` ou état illisible : pas de ligne. Elle ne dépend pas de `LETTRE_HEBDO_PROMESSE`, qui ne gouverne que les mentions publiques : l'abonné est inscrit d'office (choix du 25/10) et la reçoit dès le jeudi suivant. Ligne « question » : seulement si l'interrupteur est ouvert (`question-equipe.ts`).

**A. Liste sèche exacte**
> - Le catalogue sans limite : vannes, conseils, vidéos.
> - Les {PARCOURS_COUNT} parcours en entier, toutes les étapes ouvertes d'un coup.
> - [si carnet] Le carnet de répartie du mois : toutes les situations, carnets passés compris.
> - Les exercices des fiches.
> - Ta progression et ta série.
> - Tes favoris.
> - [si état `recoit`] La lettre de la semaine, chaque jeudi, incluse dans ton abonnement : tu l'arrêtes en un clic, depuis chaque lettre ou ton profil.
> - [si question] « Ta question à l'équipe », depuis ton profil.
> - Le rappel par e-mail de ton parcours, sur demande depuis ton profil.

**B. Un exemple réel par ligne** (exemples éternels du site ; à revérifier en base avant envoi)
> - Le catalogue sans limite : vannes, conseils et vidéos, du boulot au rencard.
> - Les {PARCOURS_COUNT} parcours en entier : Storytelling s'ouvre sur « Ton anecdote, coupée au plus court », Boulot sur « La salle de réunion, sans un mot ».
> - [si carnet] Le carnet du mois et les anciens : des situations de chambrage, chacune avec sa réplique.
> - Les exercices des fiches : sous chaque vanne, chaque conseil et chaque vidéo, de quoi t'entraîner (écrire ta vanne, essayer le conseil, décrypter la vidéo).
> - Ta progression : ta série compte tes jours de pratique d'affilée.
> - Tes favoris : l'étoile sur une fiche la range dans ta page Favoris.
> - [si état `recoit`] La lettre de la semaine, chaque jeudi, incluse dans ton abonnement : tu l'arrêtes en un clic, depuis chaque lettre ou ton profil.
> - [si question] « Ta question à l'équipe » : une situation où tu n'as pas su quoi répondre, en privé.
> - Le rappel de ton parcours par e-mail, si tu le demandes depuis ton profil.

**C. Trois blocs, un seul premier pas** (O5 reprise, « Ensuite » raccourci selon le panel : Sophie s'arrêtait au premier bloc)
> **Pour commencer** : [si carnet] une fiche du carnet du mois, une situation et sa réplique. [sinon] la première étape d'un parcours, au choix parmi les {PARCOURS_COUNT}.
> **Cette semaine** : le catalogue sans limite, les exercices des fiches, tes favoris, ta progression et ta série. [si état `recoit`] La lettre de la semaine arrive chaque jeudi, incluse dans ton abonnement ; tu l'arrêtes en un clic, depuis chaque lettre ou ton profil.
> **Ensuite, à ton rythme** : les {PARCOURS_COUNT} parcours en entier (toutes les étapes sont ouvertes, une par semaine reste le rythme conseillé, avec un rappel par e-mail sur demande)[si carnet], les carnets passés[si question], « Ta question à l'équipe » depuis ton profil.

Le dernier élément rendu prend « et » à la place de la virgule. Le rappel de parcours revient dans la parenthèse (S12) : il était sorti du bloc par souci de concision, pas pour tenir l'écran mobile.
Avec 2 A ou 2 B, qui n'annoncent pas de premier pas, on garde la ligne « Pour démarrer, choisis un parcours » du gabarit actuel (`paiement.ts:293`) ; avec 2 C, le bloc « Pour commencer » la remplace (S11).
**Reco : C**, parce qu'elle donne un seul premier pas et porte le « par où commencer » dans E0 (« Pour commencer »), sans e-mail de plus ; repli sur A si C dépasse l'écran mobile. C passe de 7 à 8 chez Sophie si le dernier bloc est court (hypothèse, à relire au panel).
**Revenu :** les 3 résiliations déjà vues sont arrivées sans aucune action enregistrée ; C transforme une liste en programme, là où A et B se lisent sans rien déclencher. Lecture : réponses reçues, favoris et étapes validées, cas par cas (la lecture du carnet ne laisse pas de trace).
**Question à Thomas :** « Pour la liste du bienvenue, tu prends A (sèche), B (un exemple par ligne) ou C (pour commencer / cette semaine / ensuite) ? »

---

## Étalon 3 : E1 à J5, « Une question ? » fusionné avec « par où commencer »

Corps ≤ 100 mots, une seule invitation à répondre, un seul lien. Le texte vaut pour « rien commencé » (lien `/carnet`). Si l'abonné a un parcours en cours (au moins une étape validée, parcours non terminé), on lui envoie la variante sous l'option ; `{lienEtape}` = lien direct de la prochaine étape, comme le rappel de parcours (`parcours-emails.ts:67`). La variante remplace la phrase du carnet et son lien ; en A, elle remplace aussi la scène et l'objet devient « Ta prochaine étape t'attend » ; en C, elle remplace tout le premier paragraphe. Sans carnet du mois publié : l'abonné qui a un parcours en cours reçoit la variante, rappel actif ou non ; les autres reçoivent « Les {PARCOURS_COUNT} parcours sont ouverts, toutes les étapes d'un coup : choisis le tien. » + « Choisir mon parcours : {url}/parcours » (même portée que la variante ; en A, objet « Les parcours sont ouverts »). Avec carnet du mois, abonné avec rappel de parcours actif : version carnet (la variante redirait ce que son rappel lui envoie déjà, S10).

**A. Une scène, puis la porte ouverte** (scène sans lieu de bureau, piste du panel : Yanis la lisait à côté de sa vie)
> Objet : Une situation, une réplique
> Salut {prénom},
> Quelqu'un te balance une remarque devant tout le monde, et rien ne te vient. Le carnet part de ces moments-là : une situation, la réplique qui sauve la mise, pourquoi elle marche.
> Une question, un doute ? Réponds à cet e-mail, on lit tout.
> Ouvrir le carnet : {url}/carnet
> *Variante :* « Ta prochaine étape de parcours t'attend, là où tu t'es arrêté. » + « Reprendre mon parcours : {lienEtape} »

**B. La question d'abord, la fiche ensuite**
> Objet : Une question ? Pose-la, on te répond
> Salut {prénom},
> Si une situation te bloque ou si tu ne sais pas par où prendre le site, écris-nous : « Ta question à l'équipe » est dans ton profil, c'est privé, et on répond en général sous 1 à 2 jours ouvrés.
> Pour commencer sans te poser de question, une fiche du carnet : une situation, sa réplique.
> Lire une fiche : {url}/carnet
> *Variante :* « Pour continuer sans te poser de question, ta prochaine étape de parcours t'attend. » + « Reprendre mon parcours : {lienEtape} »

**C. Une réponse tranchée à « par où commencer »**
> Objet : Par où commencer ?
> Salut {prénom},
> Par une fiche du carnet : une situation, la réplique qui va avec, c'est le chemin le plus court. Les parcours viennent ensuite, à ton rythme.
> Et si quelque chose te manque ou te bloque, réponds à cet e-mail.
> Ouvrir ma première fiche : {url}/carnet
> *Variante :* « Par ta prochaine étape de parcours, là où tu t'es arrêté. » + « Reprendre mon parcours : {lienEtape} »

Retiré par rapport à v1 : « cinq minutes », « ta tête rend copie blanche » (image d'école, S3) et « du boulot au rencard » en C (accroche du catalogue, pas du carnet, S4). S5 : B contient deux appels (écrire, lire une fiche), un seul lien : à comparer en connaissance de cause.
**Reco : A**, parce que la scène donne envie avant d'expliquer (même mécanique que les étapes gratuites en B validées le 07/10) et ne cite aucun délai ; B en cite un, exact (« en général sous 1 à 2 jours ouvrés »), parce qu'il renvoie à « Ta question à l'équipe ». Panel : A 9 chez Sophie, A 6 chez Yanis avant retrait du lieu (hypothèse : la scène neutre le fait monter) ; repli C (7, 8, environ 7).
**Revenu :** E1 est la seule relance avant J21 ; A cherche l'ouverture par l'envie, B par le service, C par la décision prise à la place de l'abonné. Lecture : réponses reçues, favoris et étapes validées, cas par cas (la lecture du carnet ne laisse pas de trace).
**Question à Thomas :** « Pour l'e-mail de J5, tu prends A (scène), B (question d'abord) ou C (réponse tranchée) ? »

---

## Étalon 4 : inviter à répondre dans E2 à J21, « Trois semaines : qu'est-ce qui manque ? »

Un seul appel : répondre à cet e-mail, aucun lien, aucun délai promis. Règle d'envoi des « Communs » (O8) : si J21 tombe un jour occupé, l'e-mail glisse au premier jour libre.

**A. Ami**
> Objet : Trois semaines : qu'est-ce qui manque ?
> Salut {prénom}, ça fait trois semaines que tu es là. Dis-nous ce qui t'a servi, ce qui t'a fait lever les yeux au ciel et ce qui manque. Réponds simplement à cet e-mail, on lit chaque réponse.

**B. Coach** (guidé, sans motivation lourde)
> Objet : Trois semaines : où en es-tu ?
> Salut {prénom}, trois questions, et une réponse à cet e-mail suffit : qu'est-ce que tu as essayé, qu'est-ce qui a marché, qu'est-ce qui te manque ? On lit chaque réponse.

**C. Équipe** (S8 : sans « on avance avec ce que tu nous dis »)
> Objet : Trois semaines : ce qui t'aide, ce qui manque
> Salut {prénom}, trois semaines de Premium : qu'est-ce qui t'aide, et qu'est-ce qui manque ? Réponds à cet e-mail, on lit chaque réponse.

**Reco : A**, parce que c'est le « pote drôle et bienveillant » de `ton-alex.md` et que « lever les yeux au ciel » rend la critique facile pour un introverti. Panel : 8, 8, 7 (Marc préfère B à 8). On ne rajoute aucune question : Yanis et Sophie fuiraient B et son bilan à remplir.
**Revenu :** E2 tombe avant le premier renouvellement mensuel ; ses réponses sont le seul signal qualitatif sur 4 abonnés. Lecture à la main dans la boîte, sans taux. Le ton retenu sert de repère à la ligne « réponds à cet e-mail » de E1.
**Question à Thomas :** « Pour inviter à répondre à J21, tu prends A (ami), B (coach) ou C (équipe) ? »

---

## Étalon 5 : la phrase anti-réflexe dans le bienvenue (E0)

Constat du panel : les 3 personas résilieraient par précaution, « pour ne pas oublier », dès qu'ils lisent « reconduit automatiquement » et « Résilier » ; aucun étalon d'accueil ne le traite.
**Emplacement exact** : dans le bloc contractuel de E0 (gabarit `apps/web/src/config/textes/paiement.ts`, lignes 285 et 287), la phrase vient **juste après** la ligne « Résilier : en ligne, à tout moment, depuis ton profil, bouton « Résilier ton contrat » : {url}/profil. Ton accès reste ouvert jusqu'à la fin de la période payée. », sur sa propre ligne, avant le bloc rétractation. Rien n'est retiré ni déplacé : la ligne « Prochain prélèvement … se reconduit automatiquement … » et la ligne « Résilier … » restent mot pour mot, dans l'e-mail. La phrase s'ajoute, elle ne remplace aucune mention légale et ne cache pas le lien de résiliation (cadre B6 : mêmes effets dits partout).

**A. Littérale** (formulation de Thomas)
> Tu gardes tout jusqu'à la fin de la période payée, rien ne presse.

**B. Renvoi à la date écrite plus haut**
> Rien ne presse : la date du prochain prélèvement est écrite plus haut, et tu pourras encore résilier la veille.

**C. Prends ton temps, date en clair**
> Prends ton temps pour te faire un avis : d'ici le {date du prochain prélèvement}, tout est ouvert, et tu pourras encore résilier la veille.

`{date du prochain prélèvement}` = `dateLongue(prochain)`, déjà calculé dans le gabarit ; résilier la veille évite le prélèvement, et « encore » ne contredit pas « à tout moment ».
**Reco : C**, parce qu'elle écrit la date en clair sur la ligne même : l'abonné qui a peur d'oublier lit d'un coup jusqu'à quand tout reste ouvert et qu'il pourra encore résilier la veille, sans remonter chercher la date. B dit la même chose en renvoyant à la date écrite plus haut, et garde le « rien ne presse » de Thomas : c'est le repli. Aucune des trois ne promet plus que la période payée, ce qui serait faux après un renouvellement (le remboursement sous 14 jours ne vaut que pour le premier paiement, 07/10). A redit presque mot pour mot la phrase légale juste avant, et donne la raison de résilier tout de suite sans rien perdre.
**Revenu :** vise le réflexe « je résilie pour ne pas oublier » (H1 de l'analyse), non traité par les étalons 1 à 4. Lecture : résiliations dans les 24 h après le paiement, avant et après la phrase, cas par cas (4 abonnés au 02/11), sans conclure sur un effectif aussi petit. Le panel prévient : un e-mail ne garantit pas la rétention à 10 minutes, il augmente la chance d'une première action.
**Question à Thomas :** « Pour la phrase « rien ne presse » à côté de la résiliation, tu prends A (littérale), B (renvoi à la date) ou C (prends ton temps, date en clair) ? »

---

## Après tes 5 réponses
Le copywriter écrit E0, E1, E2 sur ces choix, relecture à l'aveugle barre 9/10, panel des 3 personas sur la chaîne enchaînée, puis ton approbation en session (plan §5). Rien n'est envoyé avant. Pour @fullstack : `replyTo` des E1/E2 (O7), règle d'envoi (O8), ligne lettre par état du compte (O1), et `BIENVENUE_PREMIUM.lettre` (« s'active depuis ton profil », `abonnement-vente.ts:175`) périmé depuis l'inscription d'office (S9). Le plan `onboarding-premium-s23-plan.md` (6 e-mails) reste à aligner sur ces 3 e-mails.
