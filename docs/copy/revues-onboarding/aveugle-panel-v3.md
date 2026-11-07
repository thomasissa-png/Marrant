# Relecture à l'aveugle v3 : panel 3 personas, onboarding Premium s23 (07/11/2026)

Texte relu : `docs/copy/onboarding-premium-s23-emails.md` (v3), lignes 1 à 229 (journal v2 → v3 et v1 → v2 non lus, revues précédentes non lues).
Personas : Yanis 20 ans, Sophie 26 ans, Marc 34 ans (`project-context.md`, `docs/mobile/attentes-utilisateur.md` §1).
Rendu jugé : novembre 2026, fiches réelles de `apps/web/src/data/carnet/2026-11.json` (E0 = `2026-11-10` « Le gratin « intéressant » », E1 CARNET = `2026-11-01` « Le vendeur dans ton dos »), formule mensuelle 1,99 €.
Décisions fixes non discutées : pas d'e-mail de rappel avant prélèvement ; signature « L'Équipe Deviens Marrant » ; phrase « Prends ton temps pour te faire un avis… » conservée.
Ouverture = objet + première ligne seulement (pas de préheader).

## Synthèse

| E-mail | Yanis | Sophie | Marc | Note | Ouvert par les 3 ? |
|---|---|---|---|---|---|
| E0 bienvenue | 7 | 7 | 8 | **7,3** | Oui (reçu de paiement attendu) |
| E1 CARNET | 7 (résilié : 6) | 7 | 8 | **7,3** | Oui, résilié compris (la phrase de tête rassure sans relancer) |
| E1 PARCOURS | 6 | 6 | 7 | **6,3** | Oui (parcours nommé dans l’objet) |
| E1 OUVERTS | 6 | 7 | 6 | **6,3** | Oui, Marc sans enthousiasme |
| E2 J21 | 6 | 7 | 8 | **7** | Oui |

Barre 9/10 : **aucun e-mail ne passe**. Le ton est juste partout (zéro phrase jugée corporate ou scolaire) ; ce qui coûte, ce sont trois points précis : (1) en E0, l’abonné prudent lit dans le bloc contractuel que résilier tout de suite ne lui coûte rien, avant d’avoir eu un geste à faire ; (2) en E1 CARNET, la fiche choisie par la règle ne tient pas la promesse de l’accroche ; (3) PARCOURS et OUVERTS manquent de durée et de progression, données pourtant disponibles dans le code.

Lecture du contexte réel (3 résiliations sur 4 sans usage) : le panel reproduit le mécanisme avec Yanis en E0, sans le faire porter sur les décisions fixes. Les leviers restants sont la valeur avant le bloc contractuel (K2) et un E1 qui tient sa promesse pour les résiliés (K3).

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

Aucune ne touche un mot d’étalon ni une décision fixe ; toutes s’appuient sur une donnée lue dans le code ou les fiches.

| # | E-mail | Avant | Après | Source / raison |
|---|---|---|---|---|
| K1 | E0 | `[si carnet] La fiche de ce mois-ci :` | ligne supprimée | Sophie : doublon de « Pour commencer : une fiche du carnet du mois, une situation et sa réplique. » (étalon 2 C, intact). Rend la place prise par K2. |
| K2 | E0 | après `Pourquoi elle marche : {pourquoi}` | ajouter `[si carnet] À toi de jouer : {exercice}` | Yanis : il lui faut un geste pour ce soir. La raison de l’exclusion (« ne pas répéter ») ne tient plus : E1 montre une autre fiche depuis la v3. Champ `exercice` obligatoire (`carnet.ts:42`), libellé de l’application (`carnet-fiche-card.tsx:44`). Novembre : « Dis « J’ai suivi une recette » d’un ton rassurant, laisse passer un vrai silence en fixant un plat vide, puis lâche « Elle a résisté » comme on annonce une mauvaise nouvelle. » (faisable seul, sans accessoire). |
| K3 | E1 CARNET (règle) | `fiche = carnet.fiches.find((f) => f !== ficheOfferte(carnet))` | avec `offerte = ficheOfferte(carnet)` : `fiche = carnet.fiches.find((f) => f !== offerte && (f.contexte === "amis" \|\| f.contexte === "soirée")) ?? carnet.fiches.find((f) => f !== offerte)` | Yanis et Marc : l’accroche d’étalon « Quelqu’un te balance une remarque devant tout le monde » ne colle pas au vendeur d’aspirateur (`contexte: "quotidien"`). Novembre : 5 fiches `amis`, 5 `soirée` ; la règle donne `2026-11-04` « Ce n’était pas un champ. C’était un raccourci qui avait de l’ambition. » (un ami te chambre devant les autres passagers). Garde l’ordre « moins tendue d’abord » à l’intérieur du filtre. [@fullstack ; repli inchangé si aucune fiche ne correspond] |
| K4 | E1 PARCOURS | `Dans ton parcours « {parcoursTitre} », la suite, c’est l’étape {etapeNumero} : {etapeTitre}. Tu reprends là où tu en étais.` | `Dans ton parcours « {parcoursTitre} » ({timePerWeek}), la suite, c’est l’étape {etapeNumero} sur {weeks} : {etapeTitre}. Tu reprends là où tu en étais.` | Sophie (durée) et Marc (progression). `timePerWeek` et `weeks` lus dans `PREMIUM_PARCOURS` par slug (`premium.ts:76-86`, `weeks` = nombre d’étapes, commentaire l. 68). Rendu : « Dans ton parcours « Répartie » (20 min/semaine), la suite, c’est l’étape 2 sur 4 : … ». Replis : sans titre d’étape, `…c’est l’étape {etapeNumero} sur {weeks}. Tu reprends là où tu en étais.` ; parcours absent de `PREMIUM_PARCOURS`, phrase actuelle. |
| K5 | E1 OUVERTS | `Les {N} parcours, toutes les étapes comprises : {listeParcours}.` | `Les {N} parcours sont à toi en entier : {listeParcours}.` | Yanis : « comprises dans quoi ? ». Évite le mot « ouvert » (déjà dans la phrase de tête des résiliés). |
| K6 | E1 OUVERTS | `{listeParcours}` rendu « {name} ({timePerWeek}) » | rendu « {name} ({weeks} semaines, {timePerWeek}) » | Marc veut la durée avant de choisir. Novembre : « Machine à Café (3 semaines, 15 min/semaine), Répartie (4 semaines, 20 min/semaine) et Confiance (6 semaines, 20 min/semaine) ». Même source, `weeks` est déjà la « source unique des « N semaines » affichés » (`premium.ts:93`). Ne s’applique pas à E0 (garde la longueur). |
| K7 | E1 CARNET | rien | aucun changement de texte | Exercice des tasses jugé gênant par Yanis, mais c’est le champ de la fiche : K3 le remplace de fait en novembre. Pour les mois suivants, signal à @copywriter (exercices sans accessoire en priorité sur les fiches `amis`/`soirée`). |

Hors corrections de texte, pour @legal seulement (constat du panel, pas une reco de retrait) : dans le bloc contractuel d’E0, la ligne « Ton accès reste ouvert jusqu’à la fin de la période payée. » est celle qui, lue par Yanis, rend la résiliation immédiate gratuite. Question : l’ordre interne du bloc peut-il placer « Prends ton temps pour te faire un avis… » (inchangée) **avant** « Résilier : en ligne, à tout moment… », sans retirer aucune information ? Si non, ne rien toucher.

## Ce qui ferait monter chaque e-mail à 9

- **E0 (7,3 → 9)** : K1 + K2. Le panel monte à 8 avec la fiche + l’exercice (Yanis a quelque chose à faire ce soir avant d’arriver au bloc contractuel). Le dernier point dépend de l’ordre du bloc (question @legal ci-dessus) : tant que la résiliation sans coût est lue avant la phrase « Prends ton temps », Yanis reste à 7 ou 8. Rien d’autre à ajouter : E0 est déjà long sur mobile.
- **E1 CARNET (7,3 → 9)** : K3. Une fiche où un ami te chambre devant les autres tient la promesse de l’accroche, l’exercice devient faisable seul ; Yanis passe à 8 actif, 7 résilié, Marc à 9, Sophie à 8. Pour le 9 net : que la fiche retenue ait un exercice faisable sans accessoire (K7, contrôle à la rédaction des carnets).
- **E1 PARCOURS (6,3 → 9)** : K4 (8 attendu). Pour 9 : ajouter une ligne de contenu de l’étape suivante (sa consigne ou sa première réplique), à condition qu’un champ existe dans le seed du parcours [à vérifier @fullstack, ne rien écrire sinon].
- **E1 OUVERTS (6,3 → 9)** : K5 + K6 (7,5 attendu). Pour 9 : une ligne par parcours qui dit à qui il sert, uniquement si une description validée existe dans le seed ou sur `/parcours` [à vérifier @fullstack ; sans source, ne rien ajouter].
- **E2 (7 → 9)** : le texte est au niveau pour Sophie et Marc. Pour Yanis, le 9 demande de donner quelque chose à l’abonné qui n’a rien ouvert, ce que la règle « aucun lien d’action » interdit. Option soumise à Thomas (pas appliquée) : après « Une ligne suffit… », `Et si tu n’as encore rien ouvert, le carnet de ce mois-ci tient en une fiche : {url}/carnet`. Sans cette option, E2 plafonne à 7,5 ; la phrase « que tu es là » (inexacte pour un ancien inscrit gratuit) reste au point à trancher de Thomas déjà ouvert.

## Handoff

- **Fichier produit** : `docs/copy/revues-onboarding/aveugle-panel-v3.md`. Fichier relu non modifié.
- **Notes** : E0 7,3 ; E1 CARNET 7,3 (6 chez le résilié) ; E1 PARCOURS 6,3 ; E1 OUVERTS 6,3 ; E2 7. Aucun e-mail à la barre de 9 : **NO-GO envoi en l’état** (règle d’or P0 s18).
- **Priorité** : K3 (fiche d’E1 cohérente avec l’accroche, touche directement les résiliés) puis K2 (geste dès E0, avant le bloc contractuel).
- **Prochain** : @copywriter (K1, K2, K4 à K6 dans le fichier v4), @fullstack (K3, `weeks` et `timePerWeek` par slug, vérif des champs d’étape et descriptions de parcours), @legal (ordre interne du bloc contractuel), Thomas (option E2). La v4 repasse une relecture à l’aveugle.
