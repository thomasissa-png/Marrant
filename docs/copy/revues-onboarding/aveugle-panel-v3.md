# Relecture à l'aveugle v3 : panel 3 personas, onboarding Premium s23 (07/11/2026)

Texte relu : `docs/copy/onboarding-premium-s23-emails.md` (v3), lignes 1 à 229 (journal v2 → v3 et v1 → v2 non lus, revues précédentes non lues).
Personas : Yanis 20 ans, Sophie 26 ans, Marc 34 ans (`project-context.md`, `docs/mobile/attentes-utilisateur.md` §1).
Rendu jugé : novembre 2026, fiches réelles de `apps/web/src/data/carnet/2026-11.json` (E0 = `2026-11-10` « Le gratin « intéressant » », E1 CARNET = `2026-11-01` « Le vendeur dans ton dos »), formule mensuelle 1,99 €.
Décisions fixes non discutées : pas d'e-mail de rappel avant prélèvement ; signature « L'Équipe Deviens Marrant » ; phrase « Prends ton temps pour te faire un avis… » conservée.
Ouverture = objet + première ligne seulement (pas de préheader).

## Synthèse

(à remplir)

## E0 : bienvenue (J0)

Objet : « Ton abonnement est confirmé : Premium est ouvert, sers-toi ». Aperçu : « Salut {prénom}, voici ce qui vient de s’ouvrir, et par où commencer. »

**Yanis (20 ans, prix sensible)** : ouvre, oui (il vient de payer, il vérifie). Lit la fiche du gratin, sourit à « J’ai suivi une recette. Elle a résisté. » Puis descend jusqu’au bloc contractuel, lit « Ton accès reste ouvert jusqu’à la fin de la période payée. » et « tu pourras encore résilier la veille ». Ce qu’il fait : « si je résilie maintenant, je ne perds rien et je ne risque pas d’oublier », il va sur le profil et résilie. Retient : « J’ai suivi une recette. Elle a résisté. » Agace : rien de franchement, mais « Dès maintenant : le catalogue sans limite, les exercices des fiches, tes favoris, ta progression et ta série. » est une liste qu’il saute. Manque : un truc à faire ce soir ; la fiche lui donne une réplique, pas un geste. **7/10.**

**Sophie (26 ans, 1 à 3 min dans le métro)** : ouvre, oui. Lit jusqu’à la réplique, trouve la fiche courte et réutilisable au dîner de samedi. Agace : la double annonce « Pour commencer : une fiche du carnet du mois, une situation et sa réplique. » puis « La fiche de ce mois-ci : », deux lignes pour dire la même chose avant le contenu ; puis la longueur du reste (elle ferme avant « Ensuite »). Ce qu’elle fait : clique « Ouvrir le carnet » si elle a encore une minute, sinon garde l’e-mail. Retient : « 29 autres situations t’attendent dans le carnet de ce mois-ci. » (enfin un chiffre). **7/10.**

**Marc (34 ans, lit posé, veut de la structure)** : ouvre, oui. Lit tout, y compris le bloc contractuel, qu’il trouve clair et honnête. Retient : « Pourquoi elle marche : Tu réponds à la question mot pour mot, puis « elle a résisté » transforme la cuisine en bras de fer » (il aime comprendre le mécanisme). Agace légèrement : « Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance. » arrive après trois paragraphes de contenu, l’ordre paraît inversé. Ce qu’il fait : ouvre le carnet, puis les parcours. Ne résilie pas. **8/10.**

**Note E0 : 7,3/10.** Le contenu du haut est au niveau ; ce qui fait partir, c’est la lecture du bloc contractuel par l’abonné prudent : « accès ouvert jusqu’à la fin de la période payée » transforme la résiliation immédiate en geste sans coût. Constat de lecture, pas une contestation des décisions fixes (la phrase « Prends ton temps… » n’est pas en cause, c’est la phrase contractuelle qui la précède qui rend la résiliation gratuite).

## E1 CARNET (J5)

Objet : « Une situation, une réplique ». Aperçu abonné actif : « Salut {prénom}, Quelqu’un te balance une remarque devant tout le monde, et rien ne te vient. » Aperçu résiliation programmée : « Salut {prénom}, Ton accès reste ouvert jusqu’au {date} : voici par où commencer. »

**Yanis, en résiliation programmée (cas réel des 3 sur 4)** : ouvre, oui : l’aperçu lui rappelle qu’il a encore accès, sans lui vendre quoi que ce soit, ça ne sent pas la relance. Lit l’accroche « Quelqu’un te balance une remarque devant tout le monde, et rien ne te vient. » : c’est exactement lui. Puis la fiche : un vendeur d’aspirateur. Décalage : on lui a promis la soirée où on le chambre, il reçoit un magasin d’électroménager. Il trouve quand même « Ce sont les deux derniers ? Je m’en voudrais de les séparer. » bien vue. L’exercice « Aligne deux tasses identiques sur une table, caresse-les du regard » le fait décrocher (« je vais pas parler à des tasses »). Ce qu’il fait : ne clique pas. **6/10.**

**Yanis, abonné actif** : même lecture, même décalage. **7/10** (il ouvre le carnet par curiosité, l’accroche l’a touché).

**Sophie** : ouvre, oui, l’objet est court et ne ressemble pas à une pub. Retient : « Ce sont les deux derniers ? Je m’en voudrais de les séparer. », qu’elle pourrait ressortir telle quelle en boutique. Agace : l’exercice, infaisable dans le métro. Ce qu’elle fait : « Ouvrir le carnet » à la pause déjeuner, si elle s’en souvient. Retient aussi « Une question, un doute ? Réponds à cet e-mail, on lit tout. » (court, humain). **7/10.**

**Marc** : ouvre, oui. Aime « Pourquoi elle marche » (« Son argument d’urgence te sert de raison délicate de ne rien acheter, et tu n’as jamais dit non. »). Remarque lui aussi que la fiche ne colle pas à l’accroche « devant tout le monde ». Fait l’exercice, amusé, puis ouvre le carnet. **8/10.**

**Note E1 CARNET : 7,3/10** (6 chez le résilié). Le défaut principal n’est pas dans le texte mais dans le choix de la fiche : la règle « première fiche non offerte » tombe en novembre sur une fiche `quotidien` (vendeur), alors que l’accroche d’étalon promet une remarque devant un groupe.

## E1 PARCOURS (J5)

Objet : « Ton parcours « Répartie » : la suite ». Aperçu : « Salut {prénom}, Dans ton parcours « Répartie », la suite, c’est l’étape 2 : {etapeTitre}. »

Rappel de lecture : un abonné qui n’a rien utilisé ne reçoit jamais cette version (elle exige une étape validée). Les résiliés « sans rien utiliser » reçoivent CARNET ou OUVERTS.

**Yanis** : ouvre, oui, son parcours est nommé. Lit une phrase et un lien. Ce qu’il fait : clique s’il est sur son canapé, sinon rien, l’e-mail ne lui donne rien à lire ni à dire. Agace : rien. Retient : rien de précis. **6/10.**

**Sophie** : ouvre. Apprécie la brièveté. Question qu’elle se pose : « ça prend combien de temps ? » (pas dit). Ce qu’elle fait : remet à plus tard. **6/10.**

**Marc** : ouvre. Veut voir où il en est : « l’étape 2 » sans « sur combien » ne lui montre pas sa progression. Retient « Tu reprends là où tu en étais. » Clique. **7/10.**

**Note E1 PARCOURS : 6,3/10.** Propre mais maigre : ni durée, ni progression chiffrée, ni contenu. Chez un résilié avec parcours (cas rare), la phrase de tête « voici par où commencer » suivie de « Tu reprends là où tu en étais » se contredit à la lecture ; le panel confirme le besoin de la variante déjà soumise à @legal, sans la trancher.

## E1 OUVERTS (J5)

Objet : « 3 parcours : lequel pour toi ? ». Aperçu : « Salut {prénom}, Les 3 parcours, toutes les étapes comprises : Machine à Café (15 min/semaine), Répartie (20 min/semaine) et Confiance (20 min/semaine). »

**Yanis (résilié, n’a rien ouvert)** : ouvre, plutôt oui (la tête lui rappelle son accès). Bloque sur « toutes les étapes comprises » (« comprises dans quoi ? »). « Répartie » lui parle, « Machine à Café » non. Ce qu’il fait : rien ou un clic sur « Choisir mon parcours ». **6/10.**

**Sophie** : ouvre. « Machine à Café (15 min/semaine) » : c’est pour elle, et la durée la rassure. Retient : « la première étape suffit pour commencer. » Clique. **7/10.**

**Marc** : ouvre. Veut savoir combien de semaines dure chaque parcours avant d’en choisir un ; l’e-mail ne le dit pas. Trouve l’objet « lequel pour toi ? » un peu magazine. **6/10.**

**Note E1 OUVERTS : 6,3/10.** Lisible, mais « toutes les étapes comprises » est une formule de catalogue, et la longueur de chaque parcours (donnée vérifiable, `weeks`) manque.

## E2 : J21

Objet : « Trois semaines : qu’est-ce qui manque ? ». Aperçu : « Salut {prénom}, ça fait trois semaines que tu es là. »

**Yanis (actif, a peu utilisé)** : ouvre, oui, ça ne ressemble pas à une pub. Retient : « ce qui t’a fait lever les yeux au ciel » (on lui parle comme à un pote). Puis : « Une ligne suffit, même pour dire que tu n’as pas encore eu le temps. » Effet double : il se sent excusé, mais il se rappelle qu’il paie sans utiliser. Ce qu’il fait : ne répond pas, et pense à résilier. **6/10.**

**Sophie** : ouvre, lit en 15 secondes, trouve ça honnête. Répondrait « plus de fiches boulot » si elle avait une minute. **7/10.**

**Marc** : ouvre, répond : il aime qu’on lui demande son avis. Note que « ça fait trois semaines que tu es là » est faux pour lui (inscrit gratuit depuis plus longtemps), sans que ça le gêne vraiment. **8/10.**

**Note E2 : 7/10.** Le ton est juste ; l’e-mail ne donne rien, ce qui est assumé (aucun lien d’action), mais coûte chez l’abonné qui n’a rien ouvert.

## Corrections à texte exact

(à remplir)

## Ce qui ferait monter chaque e-mail à 9

(à remplir)

## Handoff

(à remplir)
