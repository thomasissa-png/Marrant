# Étalons onboarding Premium (s23, 06/11/2026) : à trancher par Thomas avant toute écriture

Règle P0 s8 : 4 étalons, 3 options chacun, une réponse attendue par étalon (A, B ou C). Aucun autre texte n'est écrit avant.
**Séquence révisée le 06/11 (Thomas : « pas trop de mails car ils ont les newsletters, le J1 bof »)** : 3 e-mails. E0 bienvenue (J0, premier pas « par où commencer » dedans) ; E1 à J5 « Une question ? » fusionné avec « par où commencer » ; E2 à J21 « Trois semaines : qu'est-ce qui manque ? ». Plus de J1, J9, J15.

**Communs à toutes les options** : ton d'Alex (`ton-alex.md`), tutoiement, texte seul, signature « L'Équipe Deviens Marrant » (e-mails automatiques, 14/10 ; « Alex » ne signe pas ici, 17/10), « on » et jamais « je ». Prénom absent : « Salut, ». Zéro tiret cadratin, émoji, concurrent, promotion, prix, urgence. Pas de hook « tu n'as rien ouvert » (surveillance, banni le 06/05). Lien d'arrêt « arrêter ces e-mails d'accueil » dans le pied de E1 et E2 (cadre @legal D5), non repris ci-dessous. **Envoi : E1 et E2 ne tombent jamais un jeudi (jour de la lettre) ; un e-mail dû un jeudi part le vendredi.** E0 est transactionnel (confirmation d'achat), il part tout de suite, jeudi compris. Dans E0, le bloc contractuel (confirmation, résiliation, rétractation, CGU, formulaire type) reste dans le même e-mail, sous le haut, lisible sans clic (cadre E2/E3).
Références marché : non consultées (le ton se cale sur `ton-alex.md` et les étalons s16/s17 déjà validés).

---

## Étalon 1 : objet et première phrase du bienvenue (E0)

**A. Complice**
> Objet : Premium est ouvert, sers-toi
> Salut {prénom}, c'est fait : tout Deviens Marrant est à toi, et la liste complète est juste en dessous.

**B. Concret, « voici ce qui est ouvert »**
> Objet : Premium est ouvert : voici tout ce que tu as
> Salut {prénom}, voici ce qui vient de s'ouvrir : le catalogue sans limite, les {PARCOURS_COUNT} parcours en entier et le carnet du mois.

**C. Court et direct**
> Objet : C'est ouvert
> Salut {prénom}, tout est ouvert. La liste, puis un premier pas de cinq minutes.

**Reco : B**, parce que l'objet dit ce que l'abonné a payé et la phrase le prouve en une ligne, ce que A et C laissent à deviner.
**Revenu :** E0 est le seul lien avec un acheteur qui peut résilier en quelques minutes ; B répond d'emblée à « qu'est-ce que j'ai acheté ? ». À lire sur 30 jours, cas par cas (4 abonnés au 02/11).
**Question à Thomas :** « Pour l'objet et la première phrase du bienvenue, tu prends A (complice), B (concret) ou C (court) ? »

---

## Étalon 2 : la liste « tout ce à quoi tu as droit » (bienvenue)

Contenu tiré de `lignesTableau`, `avantages-premium.ts`, `BIENVENUE_PREMIUM` et du plan §3. Aucun nombre en dur : `{PARCOURS_COUNT}` vient de `config/premium.ts`. Lignes `[si …]` rendues seulement si l'interrupteur est vrai (aujourd'hui `LETTRE_HEBDO_PROMESSE` est `false` dans `config/lettre.ts` : à confirmer avec @fullstack avant d'écrire la ligne lettre).

**A. Liste sèche exacte**
> - Le catalogue sans limite : vannes, conseils, vidéos.
> - Les {PARCOURS_COUNT} parcours en entier, toutes les étapes ouvertes d'un coup.
> - Le carnet de répartie du mois : toutes les situations, carnets passés compris.
> - Les exercices des fiches.
> - Ta progression et ta série.
> - Tes favoris.
> - [si lettre] La lettre chaque jeudi à 8 h, arrêt en un clic.
> - [si question] « Ta question à l'équipe », depuis ton profil.
> - Le rappel par e-mail de ton parcours, sur demande depuis ton profil.

**B. Un exemple réel par ligne** (exemples éternels, tirés du site ; à revérifier en base avant envoi)
> - Le catalogue sans limite : vannes, conseils et vidéos, du boulot au rencard.
> - Les {PARCOURS_COUNT} parcours en entier : Storytelling s'ouvre sur « Ton anecdote, coupée au plus court », Boulot sur « La salle de réunion, sans un mot ».
> - Le carnet du mois et les anciens : des situations de chambrage, chacune avec sa réplique.
> - Les exercices des fiches : un défi à tenter dans la journée.
> - Ta progression : ta série compte tes jours de pratique d'affilée.
> - Tes favoris : l'étoile sur une fiche la range dans ton profil.
> - [si lettre] La lettre chaque jeudi à 8 h, arrêt en un clic.
> - [si question] « Ta question à l'équipe » : une situation où tu n'as pas su quoi répondre, en privé.
> - Le rappel de ton parcours par e-mail, si tu le demandes depuis ton profil.

**C. Trois blocs « ce soir / cette semaine / ce mois »**
> **Ce soir** : le catalogue sans limite, une étape au choix parmi les {PARCOURS_COUNT} parcours, et le carnet du mois (cinq minutes, une situation).
> **Cette semaine** : tes favoris, les exercices des fiches, ta progression et ta série. [si lettre] La lettre arrive chaque jeudi à 8 h, arrêt en un clic.
> **Ce mois** : les {PARCOURS_COUNT} parcours en entier, à ton rythme (toutes les étapes sont ouvertes, une par semaine reste le rythme conseillé), les carnets passés, [si question] « Ta question à l'équipe » depuis ton profil, et le rappel de ton parcours par e-mail si tu le demandes.

**Reco : C**, parce qu'elle donne un ordre pour commencer et porte le « par où commencer » dans E0 (« Ce soir »), sans e-mail de plus ; repli sur A si C dépasse l'écran mobile.
**Revenu :** les 3 résiliations sont arrivées sans aucune action enregistrée ; C transforme une liste en programme et vise le premier accès sous 24 h, là où A et B se lisent sans rien déclencher.
**Question à Thomas :** « Pour la liste du bienvenue, tu prends A (sèche), B (un exemple par ligne) ou C (ce soir / cette semaine / ce mois) ? »

---

## Étalon 3 : E1 à J5, « Une question ? » fusionné avec « par où commencer »

Corps ≤ 100 mots, une seule invitation à répondre, un seul lien vers un premier contenu. **Adaptation** : le texte ci-dessous vaut pour « rien commencé » (lien `/carnet`) ; si une action est enregistrée, on remplace la phrase et le lien par la variante donnée sous l'option (`/parcours`). Jamais un jeudi : si J5 tombe un jeudi, l'e-mail part le vendredi.

**A. Une scène, puis la porte ouverte**
> Objet : Cinq minutes, une situation, une réplique
> Salut {prénom},
> À la machine à café, quelqu'un te balance une remarque devant tout le monde, et ta tête rend copie blanche. Le carnet part de ces moments-là : une situation, la réplique qui sauve la mise, pourquoi elle marche. Cinq minutes, sur ton téléphone.
> Une question, un doute ? Réponds à cet e-mail, on lit tout.
> Ouvrir le carnet : {url}/carnet
> *Variante « déjà commencé » :* « Ta prochaine étape de parcours t'attend, cinq minutes suffisent. » + « Reprendre mon parcours : {url}/parcours ».

**B. La question d'abord, la fiche ensuite**
> Objet : Une question ? Pose-la, on te répond
> Salut {prénom},
> Si une situation te bloque ou si tu ne sais pas par où prendre le site, écris-nous : « Ta question à l'équipe » est dans ton profil, c'est privé, et on répond en général sous 1 à 2 jours ouvrés.
> Pour commencer sans te poser de question, une fiche du carnet : une situation, sa réplique, cinq minutes.
> Lire une fiche : {url}/carnet
> *Variante « déjà commencé » :* « Pour continuer sans te poser de question, ta prochaine étape de parcours t'attend. » + « Reprendre mon parcours : {url}/parcours ».

**C. Une réponse tranchée à « par où commencer »**
> Objet : Par où commencer ?
> Salut {prénom},
> Par une fiche du carnet. Une situation, la réplique qui va avec, cinq minutes : c'est le chemin le plus court, du boulot au rencard. Les parcours viennent ensuite, à ton rythme.
> Et si quelque chose te manque ou te bloque, réponds à cet e-mail.
> Ouvrir ma première fiche : {url}/carnet
> *Variante « déjà commencé » :* « Par ta prochaine étape de parcours, là où tu t'es arrêté. » + « Reprendre mon parcours : {url}/parcours ».

**Reco : A**, parce que la scène donne envie avant d'expliquer (même mécanique que les étapes gratuites en B validées le 07/10), l'invitation à répondre tient en une ligne, et elle ne cite aucun délai (B le cite : il faut alors que la réponse passe bien par « Ta question à l'équipe »).
**Revenu :** E1 devient la seule relance avant J21 ; A cherche l'ouverture du carnet par l'envie, B par le service, C par la décision prise à la place de l'abonné. Lecture : délai entre l'envoi et le premier accès Premium suivant, cas par cas.
**Question à Thomas :** « Pour l'e-mail de J5, tu prends A (scène), B (question d'abord) ou C (réponse tranchée) ? »

---

## Étalon 4 : inviter à répondre dans E2 à J21, « Trois semaines : qu'est-ce qui manque ? »

Un seul appel : répondre à cet e-mail, aucun lien, aucun délai promis. Jamais un jeudi : si J21 tombe un jeudi, l'e-mail part le vendredi.

**A. Ami**
> Objet : Trois semaines : qu'est-ce qui manque ?
> Salut {prénom}, ça fait trois semaines que tu es là. Dis-nous ce qui t'a servi, ce qui t'a fait lever les yeux au ciel et ce qui manque. Réponds simplement à cet e-mail, on lit chaque réponse.

**B. Coach** (guidé, sans motivation lourde, pour rester dans « ni coach ni scolaire »)
> Objet : Trois semaines : où en es-tu ?
> Salut {prénom}, trois questions, et une réponse à cet e-mail suffit : qu'est-ce que tu as essayé, qu'est-ce qui a marché, qu'est-ce qui te manque ? On lit chaque réponse.

**C. Équipe**
> Objet : Trois semaines : qu'est-ce qui manque ?
> Salut {prénom}, on avance avec ce que tu nous dis. Après trois semaines de Premium, qu'est-ce qui t'aide, et qu'est-ce qui manque ? Réponds à cet e-mail, on lit chaque réponse.

**Reco : A**, parce que c'est le « pote drôle et bienveillant » de `ton-alex.md` et que « lever les yeux au ciel » rend la critique facile pour un persona introverti ; B frôle le coach banni, C est correct mais impersonnel.
**Revenu :** E2 tombe avant le premier renouvellement mensuel et ses réponses sont le seul signal qualitatif sur un effectif de 4 abonnés ; un abonné qui écrit est un abonné qui reste engagé. Lecture à la main dans la boîte, sans taux. Le ton retenu sert aussi de repère pour la ligne « réponds à cet e-mail » de E1.
**Question à Thomas :** « Pour inviter à répondre à J21, tu prends A (ami), B (coach) ou C (équipe) ? »

---

## Après tes 4 réponses
Le copywriter écrit E0, E1, E2 sur ces choix, relecture à l'aveugle barre 9/10, panel des 3 personas sur la chaîne enchaînée, puis ton approbation en session (plan §5). Rien n'est envoyé avant. Le plan `onboarding-premium-s23-plan.md` (6 e-mails) reste à aligner sur ces 3 e-mails.
