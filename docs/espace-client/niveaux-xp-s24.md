# Niveaux et XP de l'espace Premium (s24), v2

> **v2**, @product-manager, 12/11/2026. Remplace la v1 (tour 1 : @reviewer 6,6, @ux 6,3, @elon 6,2). Brouillon à relire à l'aveugle (@reviewer, @ux, @elon) jusqu'à 10/10 avant d'être montré à Thomas. Décision de départ : Q9 du 12/11, « profitons de l'occasion pour revoir tout ça et itérer ». Annexe A : correction par correction, le traitement.
> Conventions : [À VÉRIFIER] = fait non lu ; [HYPOTHÈSE] = choix de travail. Aucun chiffre d'usage n'est inventé (4 abonnés actifs au 02/11, aucune mesure de comportement). Noms et libellés proposés : ni tiret cadratin ni émoji.
> **Vocabulaire** : trois choses s'appellent déjà « niveau » : la difficulté d'un parcours (débutant, intermédiaire : C7, « niveaux actuels »), le filtre de difficulté de la liste des conseils, et l'échelle d'XP traitée ici. Pour éviter la confusion, **ce document appelle l'échelle d'XP un « cap »** (« cap 3 sur 5 ») et réserve « niveau » à la difficulté. Le code garde `level` en interne. Le mot est soumis à Thomas (Q3).

## Résumé pour Thomas (sans jargon)

- **Un fait nouveau change le diagnostic** : en plus des étapes (50 à 200 XP) et du bonus de fin de parcours (100), **ouvrir un conseil rapporte 10 XP**, et rien ne l'empêche de se répéter : l'anti-doublon n'existe que dans la page ouverte, il repart à zéro à chaque rechargement. Pire, c'est le navigateur de l'abonné qui annonce le montant (de 1 à 500 par appel, 30 appels par minute). **Il n'y a donc aujourd'hui aucun plafond** : le dernier niveau (5 000 XP) peut être atteint en quelques minutes, par des clics ou par un appel à la main. Le niveau actuel ne mesure rien de fiable.
- **Correction de sécurité, sans te la demander** (elle ne change aucune règle, elle empêche la triche) : le serveur fixera lui-même le gain, et un conseil ne rapportera qu'une fois par compte. Les XP déjà acquis ne bougent pas.
- **Ce que je te demande** : 5 questions, dans l'ordre : (1) garder ou retirer les 10 XP par conseil lu, (2) comment on passe d'un cap à l'autre (3 règles, dont une qui mesure un progrès réel, au prix de toucher à l'esprit de ta décision C4), (3) les noms et le mot « cap », (4) la distance du dernier cap, (5) ce qu'un cap débloque.
- **Reco** : retirer les 10 XP par conseil, garder la règle « XP de parcours recalés » (0, 100, 300, 700, 2 300), noms « Tu + verbe », rien de débloqué.
- **Jamais, dans aucune option** : la courbe « Tu avais une réponse ? » ne rapporte ni XP ni cap ; pas de classement, pas de baisse, pas de relance, pas de certificat, pas de contenu verrouillé.

## 1. État réel (code lu)

### 1.1 Les sources d'XP, toutes

| Source | Montant | Anti-doublon | Où |
|---|---|---|---|
| Étape de parcours validée | 50 à 200 selon l'étape (moyenne 104 sur 25 étapes) | en base : une validation par étape et par abonné | `app/api/parcours/[id]/progress/route.ts` |
| Bonus de fin de parcours | 100 | en base : une fois par parcours | idem, `PATH_COMPLETION_BONUS_XP` |
| **Conseil ouvert (Premium)** | **10** | **seulement dans la page ouverte** (`useState(new Set())`), remis à zéro à chaque chargement | `components/conseils/conseils-list.tsx` l. 175 à 178 (`addXp(10, "tip_read")`) |
| **Appel libre à l'API** | **montant choisi par le navigateur, 1 à 500** | aucun | `app/api/user/xp/route.ts` (`amount: z.number().min(1).max(500)`, 30 appels par minute, Premium) ; `stores/user-store.ts` l. 52 à 61 |

- **Totaux des parcours**, somme des `moduleXp` des seeds (relue par @reviewer, `parcours-seed.json`, `parcours-storytelling-s18.json`, `parcours-boulot-s19.json`) : Machine à Café 325 (3 étapes), Répartie 475 (4), Confiance 800 (6), Storytelling 800 (6), Boulot 700 (6) = **3 100 XP** (2 600 d'étapes + 500 de bonus), 25 étapes. Storytelling et Boulot ne comptent que s'ils sont publiés (interrupteurs `parcours-publication`) : sans Storytelling le total est 2 300, sans Boulot 2 400. [À VÉRIFIER] état des interrupteurs au jour du déploiement.
- **Conseils** : 120 conseils actifs au 12/11 (architecture v11 §1.1) × 10 = **1 200 XP au plus** si chaque conseil est payé une seule fois, donc **4 300 XP gagnables** au total dans ce cas. Le stock de conseils n'est pas fixe : le total bouge avec le catalogue [À VÉRIFIER : les conseils générés s'ajoutent-ils au stock actif ?].
- **Vitesse aujourd'hui** : ouvrir et refermer des conseils : jusqu'à 300 XP par minute (30 appels de 10) ; appeler l'API à la main : jusqu'à 15 000 XP par minute (30 appels de 500). « Légende » (5 000) tombe en moins de 20 minutes de clics, et le seuil 2 300 proposé en v1 en moins de 8 minutes.
- **`docs/content/progression-levels.md` est en partie obsolète** : le gain « +10 par conseil lu » existe bel et bien (c'est la seule ligne de son tableau qui existe dans le code) ; le reste (blague +2, connexion +5, bonus de série, badges) n'existe nulle part dans ce que j'ai lu, et sa série « sur la connexion » contredit la décision du 07/10. Le document sera remplacé par le barème retenu.
- **Conforme à C4 ?** C4 (12/11) : « aucune nouvelle règle de série ni de points pour l'entraînement et les fiches ». La lecture d'un conseil est une règle **existante**, pas nouvelle : C4 ne la tranche pas. Elle fait pourtant gagner des points à une « fiche » du catalogue (le conseil de chaque étape devient la fiche 1.1 dans l'architecture). C'est la question 1.

### 1.2 Ce que l'abonné peut atteindre aujourd'hui

- Seuils : Novice 0, Apprenti 100, Farceur 500, Comique 1 500, Légende 5 000.
- **Par les parcours seuls** : 3 100 XP, soit 62 % de 5 000 : « Légende » est inatteignable par le travail, plafond « Comique » avec une barre à 46 % (1 600 sur 3 500).
- **Par les conseils et l'API** : aucun plafond. Un abonné qui ouvre 70 conseils différents gagne 700 XP en quelques minutes, sans une étape de parcours. Le niveau ne dit donc rien de fiable, ni sur l'activité ni sur le progrès.
- Rythme conseillé des parcours : une étape par semaine, étape suivante conseillée 7 jours après la dernière (rythme doux, rien n'est bloqué). [HYPOTHÈSE] « abonné régulier » = une étape par semaine ; 25 étapes = environ 6 mois ; aucune donnée d'usage ne le confirme. Le niveau ne descend jamais (l'XP ne fait qu'augmenter).
- Cumuls de fin de parcours (étapes seules, sans conseils) : Sophie (Machine à Café puis Boulot) 325 à la semaine 3, 1 025 à la semaine 9 ; Yanis (Répartie puis Confiance) 475 (sem. 4), 1 275 (sem. 10) ; Marc (Confiance puis Storytelling) 800 (sem. 6), 1 600 (sem. 12).

### 1.3 Ce qu'un niveau change à l'écran aujourd'hui

- Un seul écran : la carte « Progression » de `/profil` (Premium) : icône emoji, nom, total d'XP, barre avec pourcentage, « Prochain niveau : X », une phrase parmi cinq (`PROGRESSION_NIVEAU`).
- À chaque gain : une bulle « +X XP » (qui contient un emoji dans le code) ; côté serveur, un indicateur `levelChanged`. [À VÉRIFIER @fullstack] si l'écran affiche un message de passage de niveau.
- Rien ne s'ouvre ni ne se ferme selon le niveau, dans les fichiers lus. Dette : les seuils existent en double (`XP_THRESHOLDS` dans `progression.ts`, `USER_LEVELS` dans `utils.ts`) et le niveau est un type fermé en base (`UserLevel`, 5 valeurs).

### 1.4 Inventaire des textes qui citent niveaux ou XP

Recherche faite par lecture ciblée et par le contrôle de @reviewer (aucun texte public ne nomme les cinq niveaux : seule occurrence des noms, `lib/utils.ts`). **Pas de recherche plein texte possible dans cette session** : les lignes marquées [À VÉRIFIER] sont à confirmer par @fullstack.

| Texte | Où | Touché par | Go de Thomas |
|---|---|---|---|
| Noms et icônes des 5 niveaux | `lib/utils.ts` (`USER_LEVELS`) | tout changement de noms | oui (étalons de noms, Q3) |
| Cinq phrases de la carte (« Niveau maximum… », « Niveau X atteint… ») | `config/textes/parcours.ts` (`PROGRESSION_NIVEAU`) | changement du mot « niveau » en « cap » | oui |
| « +X gagnés ! », « X XP gagnés sur N, bonus de fin compris » | `config/textes/parcours.ts` (`XP_GAIN`, `xpProgressionTexte`) | **aucune proposition** : textes validés, XP et bonus intouchables (étalons s17, choix du 11/10) | non, inchangés |
| Bulle « +X XP » (avec émoji) et sa lecture vocale | `components/ui/xp-notification.tsx` | spécification d'accessibilité (3.0) ; disparaît pour les conseils si Q1 = retirer | oui pour l'émoji retiré |
| **FAQ « Nos membres gagnent en moyenne 50 XP par semaine »** | `lib/faqs.ts` l. 21 | **rien** : phrase gardée par Thomas le 29/09 (aucun chiffre du site retiré ou remplacé sans son go). Ce document ne la modifie pas, ne la contredit pas et ne s'en sert pas comme donnée | oui, pour toute retouche |
| Filtre « niveaux » de la liste des conseils | `components/conseils/conseils-list.tsx` | aucun (difficulté des conseils) : c'est la raison du mot « cap » | non |
| Difficulté des parcours (« débutant », « intermédiaire ») | seeds, C7 | aucun | non |
| Positionnement « progression gamifiée (XP, streak, niveaux) » | `project-context.md` | wording interne | non |
| E-mails approuvés, pages d'offre, fiche App Store | `docs/copy`, e-mails | [À VÉRIFIER] recherche des cinq noms et de « XP » | oui pour chaque texte trouvé |
| App iPhone (en préparation) | [À VÉRIFIER] lit-elle `level` et `streak` du compte ? | tout changement de libellé ou de seuil | oui |

Le mot « XP » reste dans toutes les options (il est dans la FAQ validée).

## 2. Diagnostic

### 2.1 Les noms actuels

| Nom | Problème |
|---|---|
| Novice, Apprenti | Registre de jeu ou scolaire (la marque exclut « Scolaire »). Dit « débutant » à quelqu'un qui manque déjà de confiance. |
| Farceur | Du ton maison, mais décrit celui qui fait des blagues, pas celui qui a de la répartie. |
| Comique | Un verdict de talent que rien ne prouve (XP déclarés et falsifiables). |
| Légende | Promesse démesurée, et inatteignable par le travail. |

### 2.2 Les seuils

- **Aucun plafond réel** (1.1) : avant de recaler des seuils, il faut un total qui ait un sens. D'où la correction de sécurité (2.5) et la question 1.
- Le premier palier (100 XP, une ou deux étapes) est bon pour Yanis. Le grand creux est entre 500 et 1 500 : les trois personas y restent de la semaine 5 à la fin du premier grand parcours.
- Les seuils proposés s'accrochent aux **fins de parcours** (325, 475, 700, 800 sont des totaux réels) **seulement si les conseils ne rapportent plus d'XP** : avec 1 200 XP de conseils en plus, aucun seuil ne se lit plus comme « un parcours bouclé ».

### 2.3 Le rôle du cap : repère d'activité, jamais mesure de la répartie

- Le progrès réel en répartie est mesuré **ailleurs** : la courbe « Tu avais une réponse ? » de « Ton mois » (v11 §2.2), auto-déclarée. **Règle écrite : la réponse à « Tu avais une réponse ? » ne rapporte ni XP ni cap, aujourd'hui ni plus tard.** Un indicateur déclaratif qu'on récompense cesse de mesurer : « Oui » deviendrait un moyen de monter (indicateur n°1 de l'espace, v11 §7.6).
- Un cap fondé sur les XP dit seulement « tu as avancé dans les parcours ». Il le dit à l'écran (« tes parcours »), sans prétendre résumer l'espace.
- Seule la règle C (3.3) ferait dire au cap quelque chose de vrai sur la personne, au prix des limites exposées plus bas.

### 2.4 Les risques

| Risque | Où | Garde-fou |
|---|---|---|
| Triche, cap sans valeur | API qui prend un montant du navigateur ; conseil repayé à chaque chargement | Correction de sécurité (2.5) |
| Pression, « il me manque 340 XP » | Barre avec pourcentage | Pas de pourcentage ni d'XP restants ; cinq repères (3.0) |
| Culpabilité | Cap qui baisse, série à zéro | Cap jamais en baisse ; phrase de série inchangée (« Ta série démarre à ta prochaine étape ») |
| Verdict de talent, rang | Noms « Comique », « Légende », « Tête d'affiche » | Noms qui disent une action de conversation, jamais un rang |
| Certificat déguisé | Dernier cap vécu comme un diplôme | 07/10 : pas de certificat ; aucun visuel de diplôme ni page partageable |
| Verrou caché | Cap qui ouvre du contenu | 18/10 et 19/10 : tout reste ouvert |
| Pression sociale, relance | Classement ; notification « tu es presque au cap » | Aucun classement ; cloche réservée aux contenus et aux réponses de l'équipe (Q6, 12/11) |
| Confusion de vocabulaire | Trois « niveaux » (difficulté de parcours, difficulté de conseil, XP) | Mot « cap » (Q3) |
| Rouvrir un choix documenté | Toucher XP d'étape, bonus, série, C4 | P0 s8 : aucune option ne les modifie ; la règle C (3.3) est marquée et soumise |

### 2.5 Correction de sécurité (hors décision de Thomas)

Elle ne change aucune règle, elle empêche la triche, et part au chantier de développement (architecture v11 §7.2) : (1) **le serveur fixe le gain selon l'action** ; la route n'accepte plus de montant du navigateur ; (2) **un conseil ne rapporte qu'une seule fois par compte** (enregistré en base, une ligne par abonné et par conseil) ; (3) les XP déjà acquis ne sont jamais retirés ; (4) la limite de 30 appels par minute reste. Tant que (1) n'est pas livrée, aucun seuil ni aucun cap n'est fiable.

## 3. Propositions

### 3.0 Commun à toutes les options

- **Ce qui rapporte** : étape validée (XP du seed) et bonus de fin (100), inchangés. Rafale, jeux, fiches, « Ton mois » : rien (C4, 12/11, **tranchée, hors question**). La lecture d'un conseil : selon Q1.
- **Ce qu'un cap débloque** : selon Q5 (reco : rien).
- **Affichage, spécification d'accessibilité reprise de @ux** :
  1. **Cinq repères en rangée** (cinq pastilles, les n premières pleines) avec le texte en clair « cap 3 sur 5 ». Pas de pourcentage, pas de valeur cachée, lisible par un lecteur d'écran sans attribut de valeur. Si une barre est gardée : `role="progressbar"` avec `aria-valuetext="cap 3 sur 5"`, jamais une valeur en XP.
  2. État marqué **autrement que par la couleur** : pastille pleine contre contour.
  3. La phrase de passage de cap et la bulle « +X XP » sont annoncées dans une région `aria-live` polie, **restent au moins 5 secondes**, sont fermables, sans animation en boucle.
  4. Contraste d'au moins 4,5:1 pour le texte et 3:1 pour les pastilles ; cibles interactives d'au moins 44 px.
  5. **Aucun émoji** : ni dans le nom du cap, ni dans la bulle « +X XP » (elle en contient un aujourd'hui) ; le nom est du texte.
- **Phrase de passage, une seule fois** : « Nouveau cap : {nom}. » Rien de plus, aucune promesse (« se gagne » est un langage de score). Avec un nom à la 2e personne : « Nouveau cap : tu rebondis. ».
- **L'XP** : jamais seul sans échelle. Il se lit dans une phrase (« 412 XP : tes étapes et tes bonus de parcours ») ou derrière « voir le détail ».
- **Place dans l'espace** : dans « Parcours », **toujours après** les étapes faites et la série (le brief s24 les place avant XP et niveau, [À VÉRIFIER dans le brief §3.2 bloc 4]) ; jamais en tête, donc distinct du calendrier « Tes 4 premières semaines » placé en tête (v11 §5.4). Dans « Ton mois » une fois qu'il existe ; avant, seulement dans « Parcours ». **Pas dans « Aujourd'hui »** (écart assumé avec le brief : le repère neutre « 12 cartes cette semaine » y suffit ; ce n'est pas un oubli). Pas dans la barre de rubriques. `/parcours` étant public, le cap n'y est rendu que pour l'abonné connecté, côté navigateur ; visiteurs et Google ne le voient pas.
- **Caps existants** : recalculés une fois, vers le haut seulement (aucun abonné ne perd de cap). Cap 5 valeurs en base, aucune migration de structure pour les règles A et B ; la règle C demande un champ additif (3.3).
- **Garde-fou de test** : le dernier seuil ne dépasse pas 80 % du **total d'XP de toutes les sources retenues** (étapes, bonus, et conseils si Q1 les garde). Il détecte aussi un parcours dépublié : sans Storytelling le total tombe à 2 300 et le dernier seuil (2 300) vaudrait 100 %, le test échoue au lieu de laisser un cap inatteignable en silence.

### 3.1 Règle A, « XP de parcours recalés » (reco)

Le cap suit le total d'XP. **Si Q1 = retirer** (reco) : total gagnable 3 100, seuils **0, 100, 300, 700, 2 300** (74 %).

| Seuil | Sens, vrai sur les totaux réels |
|---|---|
| 100 | une ou deux premières étapes |
| 300 | tout parcours bouclé (le plus court : 325) |
| 700 | un grand parcours bouclé (700 à 800) ou deux petits (au moins 800) |
| 2 300 | quatre parcours (plus petite somme de quatre : 325 + 475 + 700 + 800) |

Cas : Sophie : cap 3 à la semaine 3, cap 4 pendant Boulot ; Yanis : cap 3 à la semaine 4, cap 4 pendant Confiance ; Marc : cap 4 à la fin de Confiance (semaine 6). Aucun n'atteint le cap 5 avant au moins 19 semaines (3 + 4 + 6 + 6 étapes), soit environ 5 mois.
**Si Q1 = garder une fois par conseil** : total 4 300 ; seuils **0, 100, 400, 1 000, 3 000** (70 %) [HYPOTHÈSE de calage : les conseils et les parcours se mélangent, plus d'ancrage unique ; 70 conseils ouverts valent 700 XP sans étape].
**Si Q1 = autre (conseils hors cap)** : le cap suit seulement les XP de parcours (somme des étapes validées et des bonus, calculable sans colonne nouvelle) avec les seuils « retirer » ; l'XP affiché peut inclure les conseils.

### 3.2 Règle B, « Parcours bouclés »

Le cap = nombre de parcours terminés : 0, 1, 2, 3, 5. L'XP reste un compteur visible, sans rôle. Pour : sens évident, rien à recaler si les XP changent. Contre : premier changement au plus tôt à la semaine 3 ; Yanis et Marc restent longtemps au cap 1 ; `calculateLevel` change de nature (parcours terminés, `completedAt` déjà en base).

### 3.3 Règle C, « Marche de mission réussie » (option d'@elon) : **touche l'esprit de C4, accord requis**

- **Idée** : le cap = la plus haute marche de mission où l'abonné a répondu « Essayé, ça a marché » (marche 1 seul, 2 à un proche, 3 à un pote en face, 4 en petit groupe, 5 avec quelqu'un qu'on connaît peu, v11 §2.4). C'est le seul candidat qui mesure un comportement dans la vraie vie, pas un tour de piste. Impossible à atteindre en ouvrant des conseils.
- **Pour** : c'est le progrès d'un introverti (oser), sans verdict de talent ; le cap ne baisse jamais (la plus haute marche réussie reste acquise) ; l'XP de parcours reste un compteur « tes parcours » sans nom de cap.
- **Limites honnêtes** : (1) **déclaratif**, comme tout l'espace ; (2) **même risque que celui qu'on écarte pour la courbe** : le retour « ça a marché » sert déjà à proposer la marche suivante ; le récompenser par un cap le rend gagnable en cliquant (Goodhart) ; (3) **les retours de mission ne sont pas encore stockés** : à construire (v11 §7.2) ; la règle dépend d'un chantier non construit ; (4) 6 états (départ plus 5 marches) pour 5 valeurs en base : un champ additif ou une valeur de plus, accord requis ; (5) pression : un cap qui récompense l'exposition peut pousser à tenter une marche avant d'être prêt, alors que les missions sont « toujours facultatives, jamais comptées contre l'abonné » ; le cap ne dit jamais « il te manque » et reste muet tant qu'aucune marche n'est réussie ; (6) lente : une seule mission ouverte à la fois ; (7) **touche l'esprit de C4** (12/11, entraînement hors points et série) : ce n'est ni une série ni des points, c'est une règle neuve sur l'entraînement.
- **Pourquoi je ne la recommande pas** : elle dépend d'un chantier non construit, touche une décision prise le jour même (P0 s8), et porte le risque Goodhart. Si tu veux que le cap dise un progrès réel, c'est la seule option qui le fait ; je la construirais alors avec la règle A en repli.

### 3.4 Les noms, étalons à faire valider (séparés des règles)

Principes : tirés de la conversation, adressés à l'abonné, aucun rang, aucun verdict, aucun mot de scène (v11 §3.5 retire open mic, plateau, flop), aucun nom scolaire ou de jeu. Tests de relecture à l'aveugle : lu seul, se comprend en 3 secondes ; ne dit ni rang ni verdict ; « Yanis, Sophie ou Marc s'y reconnaît-il ? ». Le cap 1 est celui du début : il ne dit rien de passif (« tu regardes » contredirait celui qui vient de valider une étape).

| Cap | E1, « Tu + verbe » | E2, « Ce que tu as » | E3, marches (règle C seulement) |
|---|---|---|---|
| 1 | Tu t'échauffes | Ta première vanne | À voix haute |
| 2 | Tu te lances | Ta réserve | Avec un proche |
| 3 | Tu rebondis | Tes rebonds | En face |
| 4 | Tu places tes vannes | Ton timing | En groupe |
| 5 | Tu tiens la conversation | Ta patte | Avec quelqu'un de nouveau |

- E1 et E2 vont avec les règles A ou B ; E3 n'a de sens qu'avec la règle C (les noms décrivent ce qu'on a fait).
- Le mot : « cap » (reco) ou « niveau ». Garder « niveau » obligerait à le préciser (« niveau d'XP ») à côté de la difficulté des parcours et de celle des conseils, ce qui ne supprime pas la collision : d'où « cap ». [À VÉRIFIER @ux] « cap » n'est utilisé ailleurs comme rubrique ni dans les textes validés ni dans v11.
- Témoin de comparaison (pas une option) : les noms actuels.
- Les plus exposés : « Tu tiens la conversation » (la plus proche d'un verdict) et « Ta patte » (peu clair seul). À tester.

### 3.5 Reco

**Q1 = retirer, règle A (0, 100, 300, 700, 2 300), noms E1, mot « cap », rien de débloqué.** Elle rend le cap fiable (une seule voie d'XP, bornée), garde un premier palier rapide pour Yanis, respecte C4 à la lettre et dans l'esprit, et ne demande aucun chantier de plus que la correction de sécurité. **Supprimer les niveaux** a été examiné et écarté : le positionnement les promet (« XP, streak, niveaux ») et ils ne coûtent rien tant qu'ils ne pressent ni ne verrouillent.

### 3.6 Critères de réussite (binaires)

1. Aucun montant d'XP n'est choisi par le navigateur ; un même conseil ne rapporte jamais deux fois à un même compte.
2. Les seuils sont croissants et le dernier est inférieur ou égal à 80 % du total d'XP de toutes les sources retenues (test automatique, échoue si un parcours est dépublié).
3. Le cap ne diminue jamais ; le recalcul des caps existants n'en fait baisser aucun.
4. Aucun libellé (nom, phrase, bulle, nom accessible) ne contient d'émoji, de tiret cadratin, de pourcentage ou d'XP restants.
5. Les seuils n'existent qu'à un seul endroit du code.
6. Le mot « niveau » ne désigne plus l'échelle d'XP à l'écran si Q3 = « cap ».
7. Cinq repères, état hors couleur, `aria-live` poli, au moins 5 secondes, contraste 4,5:1 et 3:1, cibles de 44 px (3.0).
8. La réponse à « Tu avais une réponse ? » n'alimente ni XP ni cap (test).
9. Aucun contenu, page ou fonction n'est ouvert ou fermé selon le cap (revue de `user.level` dans `apps/`).
10. Événement « cap atteint » sans identifiant, avec le seul numéro de cap ; lecture soumise à l'effectif minimal de v11 §7.6.

## 4. Questions pour Thomas

Cinq questions, trois options chacune, une reco argumentée. La Q1 passe en premier : elle fixe le total d'XP, donc tous les seuils.

**Déjà décidé, non reposé** : C4 (12/11, aucune nouvelle règle de série ni de points pour l'entraînement et les fiches) ; XP d'étape et bonus de fin inchangés (étalons s17) ; série sur la pratique (07/10) ; pas de certificat (07/10) ; tout reste ouvert (18/10, 19/10) ; cloche sans relance (Q6, 12/11) ; la FAQ « 50 XP par semaine » intacte (29/09). **Tranché sans question** : la correction de sécurité (2.5), le recalcul unique des caps vers le haut, aucun e-mail ni notification liés aux caps, aucun émoji, seuils à un seul endroit du code.

**Q1. Les 10 XP gagnés en ouvrant un conseil : on les garde ?** (Aujourd'hui ils se répètent à chaque rechargement ; après la correction de sécurité, ils ne rapporteraient qu'une fois par conseil.)
- A. Garder, une fois par conseil : au plus 1 200 XP pour les 120 conseils actuels, plus si le stock grandit. Total 4 300, seuils 0, 100, 400, 1 000, 3 000. Lire un conseil ferait avancer le cap.
- B. **Reco** : retirer pour l'avenir (les XP déjà gagnés restent). Les XP viennent alors des étapes et du bonus de fin : total 3 100, seuils lisibles (un parcours, un grand parcours, quatre parcours). Raisons : lire n'est pas pratiquer (1 200 XP, soit 39 % du total des parcours, seraient gagnés en ouvrant des fiches) ; le conseil de chaque étape est déjà payé par l'XP de l'étape ; le stock de conseils bouge, donc les seuils dériveraient ; c'est l'esprit de C4. Retire une règle de points qui existe déjà (date de sa pose non lue) ; la bulle « +10 XP » disparaît de la liste des conseils ; le compteur « Conseils terminés » du profil reste.
- C. Garder pour l'XP affiché, mais hors du cap : le cap ne suit que les parcours (deux chiffres à l'écran : plus complexe à lire).

**Q2. Comment passe-t-on d'un cap au suivant ?** (la règle, sans les noms)
- A. **Reco** : selon les XP, seuils recalés (3.1).
- B. Selon le nombre de parcours terminés : 0, 1, 2, 3, 5 (3.2).
- C. Selon la plus haute marche de mission réussie (3.3). **Touche l'esprit de ta décision du 12/11 (C4)** : ce n'est ni une série ni des points, c'est une règle neuve sur l'entraînement. C'est la seule option où le cap dit un progrès réel ; limites : déclaratif, retours de mission à construire, risque de rendre « ça a marché » gagnable en cliquant.

**Q3. Les noms, et le mot.** (indépendant de Q2, sauf E3)
- A. **Reco** : E1, « Tu t'échauffes, Tu te lances, Tu rebondis, Tu places tes vannes, Tu tiens la conversation ».
- B. E2, « Ta première vanne, Ta réserve, Tes rebonds, Ton timing, Ta patte ».
- C. E3, les marches (« À voix haute » à « Avec quelqu'un de nouveau ») : seulement avec la règle C de Q2.
Le mot à l'écran : **« cap »** (reco : « niveau » désigne déjà la difficulté des parcours et celle des conseils) ou « niveau ». Tu peux changer un seul nom. Chaque texte touché (3.0, 1.4) revient à toi.

**Q4. À quelle distance mettre le dernier cap ?** (règles A et B)
- A. **Reco** : environ quatre parcours (2 300 XP, 5 mois environ au rythme conseillé).
- B. Environ trois mois (1 600 XP, deux grands parcours) : plus vite fêté, plus rien à gagner ensuite côté cap.
- C. Tout le site (3 100 XP) : le moindre parcours dépublié le rend inatteignable, et il dépasse le plafond de 80 % du test (le test devrait être assoupli).

**Q5. Un cap débloque-t-il quelque chose ?**
- A. **Reco** : rien, c'est un repère.
- B. Au passage d'un cap, une phrase de l'équipe propose une fiche à faire ensuite, rien de bloqué (une phrase à écrire par cap, relue à l'aveugle).
- C. Un contenu bonus par cap : **rouvre en partie ta décision du 18/10** (un contenu serait derrière un cap).

## 5. À traiter après ta réponse

- **@fullstack** : la correction de sécurité (2.5) dès maintenant, indépendamment de tes réponses ; vérifier l'état des interrupteurs de parcours ; centraliser les seuils ; recalcul unique ; test de garde ; rechercher les cinq noms et « XP » dans `apps/web`, `apps/mobile`, `docs/copy` et les e-mails (1.4) ; remplacer `progression-levels.md` par le barème retenu. Aucun fichier de `apps/` n'a été modifié par cette session.
- **@ux** : spécification de 3.0, place dans « Parcours » et « Ton mois », rendu 375 px, lisibilité des cinq noms, vérifier le mot « cap ».
- **@legal** : rien (aucune donnée nouvelle) ; sauf règle C : retours de mission stockés (v11 §7.2).
- **@data-analyst** : événement « cap atteint » sans identifiant.

## Annexe A. Correction du tour 1 : traitement

| Source | N° | Traitement dans la v2 |
|---|---|---|
| @reviewer | 1 (sources d'XP fausses, bloquant) | 1.1, 1.2, résumé réécrits avec conseils et API ; 2.5 correction de sécurité ; Q1 |
| @reviewer | 2 (question des 10 XP, bloquant) | Q1, trois options, reco B argumentée |
| @reviewer | 3 (Q4 reposait C4, bloquant) | Q4 supprimée ; C4 rangée dans « Déjà décidé » (4) |
| @reviewer | 4 (somme des seeds) | 1.1 : somme et fichiers cités, [À VÉRIFIER] retiré pour les totaux |
| @reviewer | 5 (FAQ « 50 XP ») | 1.4 : texte intact (29/09), go requis pour toute retouche |
| @reviewer | 6 (collision du mot « niveau ») | Vocabulaire en en-tête, mot « cap », Q3 |
| @reviewer | 7 (N2 et vocabulaire de scène) | N2 supprimé ; 3.4 : noms de conversation, écart avec v11 §3.5 dit |
| @reviewer | 8 (place dans « Parcours ») | 3.0 : après les étapes et la série, écart avec le brief assumé |
| @reviewer | 9 (option de remplissage Q3 C) | Q5 : B réelle (une phrase propose une fiche), C marquée |
| @reviewer | 10 (v11 porte la même erreur) | Annexe B |
| @ux | 1 (conseil à 10 XP, bloquant) | idem @reviewer 1 et 2 ; l'option « étendre aux vannes et vidéos » non offerte (elle rouvrirait C4) |
| @ux | 2 (noms de scène, découpler, bloquant) | 3.4 et Q2/Q3 séparées ; cap 1 non passif |
| @ux | 3 (inventaire des textes, bloquant) | 1.4 (recherche plein texte impossible ici : lignes [À VÉRIFIER]) |
| @ux | 4 (accessibilité, bloquant) | 3.0 spécification complète, critère 7 |
| @ux | 5 (placement) | 3.0 : (a) après étapes et série, (b) rendu pour l'abonné connecté, (c) pas dans « Aujourd'hui », dit, (d) « Ton mois » plus tard |
| @ux | 6 (publication des parcours) | 1.1 et garde-fou 3.0 (2 300 sans Storytelling) |
| @ux | 7 (forme des questions) | Q4 supprimée, Q4 distance : effet sur le test dit, Q5 C marquée |
| @ux | 8 (phrase de passage) | 3.0 : « Nouveau cap : {nom}. » |
| @ux | 9 (« 412 XP » sans échelle) | 3.0 : XP dans une phrase ou derrière « voir le détail » |
| @elon | 1 (XP sans limite, bloquant) | 1.1, 1.2, 2.5, Q1 |
| @elon | 2 (retirer Q4, bloquant) | comme @reviewer 3 |
| @elon | 3 (option marches de mission, bloquant) | 3.3, règle C marquée « touche l'esprit de C4 » avec limites (dont Goodhart et retours non stockés : l'avis d'@elon les disait « déjà stockés », à corriger : v11 §7.2) |
| @elon | 4 (courbe jamais récompensée, bloquant) | 2.3 règle écrite, critère 8 |
| @elon | 5 (noms de scène) | 3.4 E1 et E2 tirés de la vie des personas |
| @elon | 6 (garde-fou sur toutes les sources) | 3.0 garde-fou, critères 1 et 2 |
| @elon | 7 (deux « niveaux ») | Vocabulaire en en-tête (C7 = difficulté) |

## Annexe B. À porter dans l'architecture (v11, puis v12)

1. **§1.1, ligne « XP, niveaux, série (code) »** : ajouter « 10 XP par conseil ouvert (`conseils-list.tsx` l. 175 à 178), anti-doublon en mémoire de page seulement ; `POST /api/user/xp` accepte un montant choisi par le navigateur (1 à 500, 30 appels par minute) ». Aujourd'hui elle ne cite que les étapes et le bonus.
2. **§1.1, ligne `progression-levels.md` « OBSOLÈTE (gains absents du code) »** : nuancer (le gain « +10 par conseil » existe).
3. **C4** : la phrase « les points viennent des étapes et du bonus de fin » est incomplète. La décision de Thomas (aucune nouvelle règle de série ni de points pour l'entraînement et les fiches) reste valide ; mais il l'a prise sans savoir que lire un conseil rapporte déjà des points : le lui dire avec la Q1 de ce document.
4. **§7.2, chantier de développement** : ajouter la correction de sécurité (2.5) : gain fixé par le serveur, un conseil une seule fois par compte (table additive).
5. **§5.2** : le conseil de chaque étape (fiche 1.1) ne doit pas rapporter d'XP à part (déjà dans l'XP de l'étape).

