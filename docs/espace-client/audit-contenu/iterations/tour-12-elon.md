# Tour 12 : relecture à l'aveugle des parties neuves de la v12 (@elon)

> AVIS CONSULTATIF. Relecteur indépendant, à l'aveugle.
> Lu : `architecture-contenu-v12.md` 2.7, 2.8, 2.9, 3.12, 7.6, 7.7 ; `founder-preferences.md` l. 167 (décisions du 12/11, qui font foi) et l. 152 (résiliation, 06/11). Aucune décision n'est rouverte ci-dessous : les corrections portent sur la conception à l'intérieur des décisions.

## Verdict en une phrase

Les décisions sont appliquées fidèlement, et l'humour noir est traité avec un sérieux rare : opt-in, jamais servi par surprise, étalon d'abord, aucune phrase écrite avant. Trois choix de conception vont pourtant contre la valeur persona ou contre « le plus intelligent » demandé par Thomas :
- **le point permanent de la cloche** devient un rappel d'inactivité déguisé ;
- **la reprise des lettres réécrit les répliques déjà validées**, c'est-à-dire la ressource la plus chère du système ;
- **le coin humour noir liste ce qui est exclu sans dire ce qu'il contient.**

## Notes (C1 à C11, sur la v12 entière ; les parties anciennes restent au niveau du tour 11)

| # | Critère | T11 | T12 | Justification (passage cité) |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 8 | 2.9 : « un point neutre sur la cloche tant qu'il reste du non lu ». Avec 30 fiches de carnet par mois et les nouveautés, ce point reste allumé chez tout abonné qui passe peu (W1). 2.7 : « on la retrouve dans "Plus", "Mes notes" » : le répertoire personnel de l'abonné est rangé là où il ne le reverra pas (W4). |
| C2 | Respect des décisions | 10 | 9 | Q6 : « jamais de relance d'inactivité ». Un point qui persiste parce qu'on n'est pas venu produit l'effet d'une relance (W1). Le reste est conforme : C5, C12, Q5b, déploiement d'un coup. |
| C3 | Zéro donnée inventée | 10 | 10 | « [À VÉRIFIER : nombre de vannes d'humour noir actives, à lire en base ; le lot est fixé sur cette lecture, aucun chiffre inventé] » ; délai de reprise marqué [HYPOTHÈSE]. |
| C4 | Rubriques claires | 10 | 10 | Archive dans « Plus », coin humour noir en 3e bloc de la Bibliothèque, cloche hors des 6 entrées. |
| C5 | Ambition | 10 | 9 | Les lettres et les notes, deux matières de grande valeur, sont exploitées au minimum (W2, W4). |
| C6 | Cohérence | 10 | 9 | 2.8 (a) : « la lettre n'est visible que le jour de l'envoi », alors que l'archive la montre dès l'envoi et ensuite. Le sens voulu est « jamais avant l'envoi » (W2). |
| C7 | Faisabilité au niveau | 10 | 9 | 2.8 : reprise « retravaillée : trois registres, deux contextes, autre exemple ou autre scène ; jamais une copie ». Cela oblige à réécrire de l'humour déjà validé (rendement de 1 sur 2 à 1 sur 12, 1.3) au lieu d'ajouter seulement des contextes (W2). |
| C8 | Questions à Thomas | 10 | 10 | Chaque « reste à trancher » tient en une ligne. |
| C9 | Exemples | 10 | 10 | Humour noir : « aucun texte d'humour noir n'est écrit avant que Thomas ait calibré le niveau et les limites ». C'est la bonne discipline. |
| C10 | Progression | 10 | 10 | Inchangée. |
| C11 | Pertinence pour l'audience réelle | 10 | 9 | Le coin humour noir est bien gardé, mais son périmètre positif n'est pas défini (W3). 7.6 cherche ce qu'on apprendra dans des comparaisons de cohortes, alors que la mesure qui n'a besoin d'aucun « avant » existe déjà dans le produit (W5). |

**Note globale : 9,4 / 10** (103 / 11 critères).

## Corrections

W1. **[BLOQUANT] La cloche ne doit pas allumer un point permanent pour des nouveautés (2.9).**
- Passage : « un point neutre sur la cloche tant qu'il reste du non lu ».
- Problème, par principes premiers : le carnet publie 30 fiches par mois, plus les situations neuves et les écoutes. Un abonné qui vient une fois par semaine trouvera toujours le point allumé. Un point qui ne s'éteint que si l'on vient, c'est un rappel d'inactivité par un autre canal, et c'est précisément ce que Q6 interdit (« jamais de relance d'inactivité »). Pour Yanis ou Marc, c'est une petite dette affichée en permanence.
- Correction : le point ne s'allume que pour ce qui concerne la personne : « L'équipe t'a répondu » (et éventuellement la lettre le jour de son envoi). Les nouveautés de contenu sont listées dans la cloche **sans point**, ou leur point s'éteint seul après 7 jours [HYPOTHÈSE de durée]. Jamais de compteur chiffré.

W2. **[BLOQUANT] Reprise des lettres : réutiliser les répliques validées, n'écrire que ce qui manque (2.8).**
- Passages : « retravaillée : trois registres, deux contextes, autre exemple ou autre scène ; jamais une copie du texte de la lettre » ; « Reste à trancher : [...] si l'archive remonte avant le jour d'abonnement de chacun » ; « (a) la lettre n'est visible que le jour de l'envoi ».
- Problème : les lettres au format A ont déjà une scène et trois répliques (la sûre, la joueuse, la risquée) relues et approuvées par Thomas. C'est la ressource la plus rare du système, puisque le rendement de la barre Alexa va de 1 sur 2 à 1 sur 12. Imposer « jamais une copie » oblige à refaire cet humour et à le relire à l'aveugle, pour rien. Thomas a dit « rien n'empêche après d'utiliser le contenu » et « qu'on fasse le plus intelligent ». Le plus intelligent, c'est de garder ce qui coûte cher (les répliques validées) et de n'ajouter que ce qui coûte peu (deux contextes de rafale).
- Correction :
  - (a) une reprise = la scène et ses trois répliques telles qu'approuvées, plus deux contextes neufs (seul texte à relire), avec la ligne « Vu dans la lettre du jeudi 12 novembre ». Une adaptation n'est faite que si la scène est datée (saison, fête) ;
  - (b) proposer comme défaut que l'archive remonte à toutes les lettres envoyées, pour tous les abonnés : un abonné qui arrive trouve dès le jour 1 une vingtaine de lettres approuvées (22 aujourd'hui, dont celles déjà envoyées seulement). C'est de la valeur immédiate, sans texte neuf ;
  - (c) réécrire (a) de 2.8 : « une lettre n'est visible nulle part avant le jour de son envoi ». Le délai de reprise reste une [HYPOTHÈSE] à confirmer par Thomas.

W3. **[BLOQUANT] Humour noir : dire ce que le coin contient, pas seulement ce qu'il exclut (3.12).**
- Passages : garde-fous, « rupture et deuil jamais comme sujet (décision C6) ; aucune moquerie d'une origine, d'un physique, d'un handicap ni d'une maladie grave » ; « Reste à trancher : le nom du coin et la liste exacte des sujets exclus ».
- Problème : l'humour noir, par définition, joue avec la mort, la maladie et le malheur. Si l'on ne liste que des exclusions, l'étalon E6 n'a rien à calibrer et le coin risque d'être soit vide, soit tiède. Or la demande mesurée porte sur des **blagues** (« blague humour noir 2026 »), pas sur une leçon : si le lot de vannes actives est mince, le besoin réel n'est pas servi.
- Correction, sans rouvrir C6 :
  - (a) un périmètre positif, à valider à E6 : par exemple la mort comme thème général et l'absurde de la condition humaine, sa propre finitude en autodérision, les petites catastrophes du quotidien poussées au noir ; jamais une victime réelle ni une personne présente ;
  - (b) définir les mots de C6 tels quels : « deuil » = la perte vécue par une personne réelle (jamais sujet de vanne) ; la mort comme idée reste un thème à soumettre à Thomas à E6 ;
  - (c) règle par défaut des 5 situations : la sûre, sauf si le contexte dit que le groupe connaît ton humour ;
  - (d) ajouter une ligne à E6 : « si les vannes d'humour noir actives sont trop peu nombreuses pour un lot, en écrire de nouvelles (barre Alexa, règle C8) ou non ? ».

W4. **[NON BLOQUANT, nécessaire pour 10] « Ma réplique à moi » doit revenir au bon moment (2.7).**
- Passage : « on la retrouve dans "Plus", "Mes notes" ».
- Problème : un répertoire personnel ne sert que s'il revient avant le moment où il sert. Rangé dans « Plus », il devient un cimetière de notes.
- Correction, en affichage seulement (rien n'est analysé, lu ou noté, Q5b respectée) : (a) la note est rattachée à l'univers de sa fiche ; (b) elle réapparaît sur la carte de révision de la même situation (« Ta réplique la dernière fois : … »), ce qui donne à l'abonné un retour sur lui-même dans le temps ; (c) sous « Ce soir, c'est plutôt ? », une ligne « Tes répliques à toi pour la soirée » quand il en a. Même phrase de @legal, rien de plus stocké.

W5. **[NON BLOQUANT, nécessaire pour 10] Ce qu'on apprend sans « avant » (7.6, 7.7).**
- Passages : « il n'existe aucune situation "avant" chiffrée » ; « la lecture se fait par cohortes » ; capteur 1, « avant [40 fils par mois], elle ne pilote pas le plan ».
- Problème, par principes premiers : sans « avant » et avec 4 abonnés, les comparaisons de cohortes ne diront rien avant longtemps. Mais la mesure de valeur la plus forte n'a besoin d'aucun groupe témoin : **chaque abonné est sa propre référence**. Sa courbe « Tu avais une réponse ? » de la semaine 1 comparée à celle de la semaine 8, c'est du progrès intra-individuel, lisible dès le premier abonné régulier (à titre indicatif, pas comme [MESURÉ A] sous l'effectif minimal).
- Correction : (a) ajouter en 7.6 « Ce qu'on apprend dès l'ouverture : la courbe intra-abonné (semaine 1 contre semaine N), l'usage par rubrique, et chaque fil de "Mes questions" lu un par un tant que l'effectif est petit » ; (b) avis à poser à Thomas, hors de ce document : l'écran de motif de résiliation est **décidé** depuis le 06/11 (l. 152 : « la raison est demandée AVANT ») mais il est fermé par un interrupteur. Le faire partir avec le déploiement d'un coup, c'est le moyen le plus direct d'apprendre pourquoi un abonné part, et c'est la donnée qui manque depuis s23.

---
**Handoff → session principale**
- Fichier : `docs/espace-client/audit-contenu/iterations/tour-12-elon.md` ; note 9,4/10 sur 11 critères, aucune décision rouverte.
- Bloquants (3) : W1, le point permanent de la cloche pour des nouveautés agit comme une relance d'inactivité (Q6) ; il faut le réserver aux réponses de l'équipe. W2, la reprise des lettres doit garder les répliques approuvées et n'ajouter que deux contextes, avec par défaut l'archive complète pour tous (« le plus intelligent »). W3, le coin humour noir doit avoir un périmètre positif et des définitions avant E6, sans quoi il sera vide ou tiède.
- Non bloquants, nécessaires pour 10 (2) : W4, les notes doivent revenir sur la carte de révision et sous « Ce soir » ; W5, on apprend dès l'ouverture par la courbe intra-abonné, et l'écran de motif de résiliation, déjà décidé le 06/11, est à faire partir avec le déploiement.
- Ce sont des AVIS : Thomas décide.
---
