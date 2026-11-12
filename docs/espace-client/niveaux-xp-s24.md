# Niveaux et XP de l'espace Premium (s24), v3

> **v3**, @product-manager, 12/11/2026. Remplace la v2 (tour 2 : @elon 9,4, @reviewer 9,3, @ux 8,1 avec 2 bloquants ; tour 1 : 6,6, 6,3, 6,2). Brouillon à relire à l'aveugle (tour 3 limité aux passages modifiés) jusqu'à 10/10 avant d'être montré à Thomas. Annexe A : traitement du tour 2. Annexe B : correctifs à porter dans l'architecture.
> Conventions : [À VÉRIFIER] = fait non lu ; [HYPOTHÈSE] = choix de travail. Aucun chiffre d'usage n'est inventé (4 abonnés actifs au 02/11). Noms et libellés proposés : ni tiret cadratin ni émoji.
> **Vocabulaire** : trois choses se disent déjà « niveau » : la difficulté d'un parcours (débutant, intermédiaire : C7), le filtre de difficulté des conseils, et l'échelle d'XP traitée ici. Pour ne pas les confondre, **l'échelle d'XP s'appelle un « palier »** (« palier 3 sur 5 »), et « niveau » reste réservé à la difficulté. Le code garde `level` en interne. Le mot est comparé en 3.4 et soumis à Thomas (Q3).

## Résumé pour Thomas (sans jargon)

- **Un fait nouveau change le diagnostic.** Aujourd'hui, n'importe quel abonné peut s'attribuer des points à la main, et lire un conseil rapporte 10 points à chaque fois qu'il rouvre la page. Le niveau le plus haut (5 000 points) s'atteint donc en quelques minutes : le niveau actuel ne mesure rien de fiable.
- **Je corrige cette triche sans te la demander**, car elle ne change aucune règle : les points seront fixés par le site, pas par le navigateur. Les points déjà gagnés ne bougent pas, sauf cas à regarder avec toi (Q6).
- **Ce que je te demande, dans l'ordre** : (1) garder ou retirer les 10 points par conseil lu ; (2) comment on passe d'un palier au suivant (3 règles, dont une qui mesure un vrai progrès et touche à l'esprit de ta décision C4) ; (3) les noms, et le mot « palier » ; (4) la distance du dernier palier ; (5) ce qu'un palier débloque ; (6) seulement si la lecture de la base le montre : que faire des comptes dont les points dépassent ce que leurs parcours justifient.
- **Reco** : retirer les 10 points par conseil ; règle « points recalés » (0, 100, 300, 700, 2 300) ; noms qui disent le chemin parcouru, jamais un talent ; rien de débloqué.
- **Jamais, dans aucune option** : la réponse à « Tu avais une réponse ? » ne rapporte ni points ni palier ; pas de classement, pas de relance, pas de certificat, pas de contenu verrouillé ; le palier ne baisse pas (une seule exception possible, Q6).
- Le mot « palier » désigne l'échelle des points ; il n'a rien à voir avec la difficulté des parcours.

## 1. État réel (code lu)

### 1.1 Les sources d'XP, toutes

| Source | Montant | Anti-doublon | Où |
|---|---|---|---|
| Étape de parcours validée | 50 à 200 selon l'étape (moyenne 104 sur 25 étapes) | en base : une validation par étape et par abonné | `app/api/parcours/[id]/progress/route.ts` l. 180 |
| Bonus de fin de parcours | 100 | en base : une fois par parcours | idem, `PATH_COMPLETION_BONUS_XP` |
| **Conseil ouvert (Premium)** | **10** | **seulement dans la page ouverte** (`useState(new Set())`), remis à zéro à chaque chargement | `components/conseils/conseils-list.tsx` l. 111 et 175 à 178 |
| **Appel libre à l'API** | **montant choisi par le navigateur, 1 à 500** | aucun | `app/api/user/xp/route.ts` l. 12, 26, 51 (30 appels par minute, Premium) ; `stores/user-store.ts` l. 52 à 61 |

- Vérifié par @reviewer : les deux seuls crédits d'XP côté serveur sont la validation d'étape et cette route ; **le seul appelant de la route est la liste des conseils**.
- **Totaux des parcours** (somme des `moduleXp` des trois seeds) : Machine à Café 325 (3 étapes), Répartie 475 (4), Confiance 800 (6), Storytelling 800 (6), Boulot 700 (6) = **3 100 XP** (2 600 d'étapes + 500 de bonus), 25 étapes. Sans Storytelling (non publié) : 2 300 ; sans Boulot : 2 400. [À VÉRIFIER] état des interrupteurs de publication au jour du déploiement.
- **Conseils** : 120 conseils actifs au 12/11 (v11 §1.1) × 10 = **1 200 XP au plus** si chaque conseil est payé une seule fois, soit **4 300** au total ; le stock bouge avec le catalogue [À VÉRIFIER : les conseils générés s'ajoutent-ils au stock actif ?].
- **Vitesse aujourd'hui** : par clics, jusqu'à 300 XP par minute (30 appels de 10) ; à la main, jusqu'à 15 000 XP par minute (30 appels de 500). « Légende » (5 000) tombe en moins de 20 minutes de clics ; le seuil 2 300 en moins de 8.
- Le compteur « Conseils terminés » du profil vient des étapes, pas des conseils ouverts (`api/user/route.ts` l. 52) : il ne change pas si les 10 XP sont retirés.
- `docs/content/progression-levels.md` est en partie obsolète : « +10 par conseil lu » existe ; le reste (blague +2, connexion +5, bonus de série, badges) n'existe nulle part dans ce qui a été lu, et sa série « sur la connexion » contredit la décision du 07/10. Il sera remplacé par le barème retenu.
- **C4 (12/11)** : « aucune nouvelle règle de série ni de points pour l'entraînement et les fiches ». La lecture d'un conseil est une règle **existante**, pas nouvelle : C4 ne la tranche pas. Elle fait pourtant gagner des points à une « fiche » du catalogue (le conseil de chaque étape devient la fiche 1.1). C'est la Q1.

### 1.2 Ce que l'abonné peut atteindre aujourd'hui

- Seuils : Novice 0, Apprenti 100, Farceur 500, Comique 1 500, Légende 5 000.
- Par les parcours seuls : 3 100 XP, soit 62 % de 5 000 : « Légende » inatteignable par le travail, plafond « Comique » avec une barre à 46 % (1 600 sur 3 500).
- Par les conseils et l'API : aucun plafond. 70 conseils ouverts donnent 700 XP en quelques minutes, sans une étape.
- Rythme conseillé : une étape par semaine, suivante conseillée 7 jours après la dernière (rien n'est bloqué). [HYPOTHÈSE] « abonné régulier » = une étape par semaine, 25 étapes ≈ 6 mois ; aucune donnée d'usage.
- Cumuls de fin de parcours (étapes seules) : Sophie (Machine à Café puis Boulot) 325 (sem. 3), 1 025 (sem. 9) ; Yanis (Répartie puis Confiance) 475 (sem. 4), 1 275 (sem. 10) ; Marc (Confiance puis Storytelling) 800 (sem. 6), 1 600 (sem. 12).

### 1.3 Ce qu'un niveau change à l'écran aujourd'hui

- Un seul écran : la carte « Progression » de `/profil` (Premium) : icône emoji, nom, total d'XP, barre avec pourcentage, « Prochain niveau : X », une phrase parmi cinq (`PROGRESSION_NIVEAU`). À chaque gain, une bulle « +X XP » (avec un emoji dans le code) ; côté serveur, un indicateur `levelChanged` [À VÉRIFIER @fullstack : affiché ou non].
- Rien ne s'ouvre ni ne se ferme selon le niveau. Dette : seuils en double (`XP_THRESHOLDS` dans `progression.ts`, `USER_LEVELS` dans `utils.ts`) ; niveau = type fermé de 5 valeurs en base (`UserLevel`).

### 1.4 Inventaire des textes qui citent niveaux ou XP

Recherche faite par @reviewer au tour 2 (« XP » apparaît dans 32 fichiers de `apps/web/src`). **Touchés par une option** :

| Texte | Où | Touché par | Go de Thomas |
|---|---|---|---|
| Noms et icônes des 5 niveaux | `lib/utils.ts` (`USER_LEVELS`) | tout changement de noms (Q3) | oui |
| Cinq phrases de la carte (« Niveau maximum… », « Niveau X atteint… ») | `config/textes/parcours.ts` (`PROGRESSION_NIVEAU`) | changement de mot (Q3) | oui |
| **« Progresse semaine après semaine avec des exercices concrets et des XP. »** | `app/(dashboard)/conseils/page.tsx` l. 161, **texte en ligne** | **Q1 = B** : la phrase devient en partie fausse, à retoucher | **oui, ton go** |
| Bulle « +X XP » (avec émoji) | `components/ui/xp-notification.tsx` | accessibilité (3.0) ; disparaît pour les conseils si Q1 = B | oui pour l'émoji retiré |
| « Garde tes XP et ton parcours » | `components/mobile/OnboardingFlow.tsx` l. 216 à 218 (écran d'accueil mobile du code web) | aucune option | non |

**Inchangés** par toutes les options (le mot « XP » reste) : FAQ « Nos membres gagnent en moyenne 50 XP par semaine » (`lib/faqs.ts` l. 21, **gardée par Thomas le 29/09 : on ne la touche pas sans son go**, ce document ne s'en sert pas comme donnée) ; accueil (`page.tsx` l. 105 et 122) ; `a-propos/page.tsx` l. 135 ; `parcours/(liste)/page.tsx` l. 80 ; `videos/page.tsx` l. 64 ; `lib/llms-content.ts` l. 83 (« XP à chaque étape validée ») ; `lib/blog-articles.ts` l. 1917 ; `config/textes/entrees-parcours.ts` l. 61 (« tes XP montent à chaque étape validée ») ; `confidentialite/page.tsx` l. 97 (« XP, niveau, série » : nom de donnée) ; « X XP gagnés sur N, bonus de fin compris » et « +X gagnés ! » (`config/textes/parcours.ts`, validés, XP et bonus intouchables) ; filtre « niveaux » des conseils et difficulté des parcours (autres sens du mot).
**Faits levés** : aucun « XP » ni nom de niveau dans les e-mails approuvés, dans `apps/web/src/data` (lettres, carnet) ni dans `apps/mobile` ; « cap » n'est employé par aucun texte client ; « palier » n'a pas été recherché dans les textes client [À VÉRIFIER @fullstack, un seul contrôle : sinon repli « cap »] ; le brief s24 §3.2 bloc 4 place dans « Aujourd'hui » : « Progression : étapes faites et série en tête ; XP et niveau ensuite ».

## 2. Diagnostic

### 2.1 Les noms actuels

| Nom | Problème |
|---|---|
| Novice, Apprenti | Registre de jeu ou scolaire (la marque exclut « Scolaire ») ; dit « débutant » à quelqu'un qui manque déjà de confiance. |
| Farceur | Du ton maison, mais décrit celui qui fait des blagues, pas celui qui a de la répartie. |
| Comique | Un verdict de talent que rien ne prouve (XP déclarés et falsifiables). |
| Légende | Promesse démesurée, inatteignable par le travail. |

**Principe retenu pour les nouveaux noms** : un nom ne dit **jamais une compétence** (« tu rebondis », « tu tiens la conversation » affirmeraient un savoir-faire que les XP ne vérifient pas : même faute que « Comique », à la 2e personne). Il dit **le chemin parcouru** (ce que l'abonné a fait ou où il en est) et passe un test de vérité (3.4).

### 2.2 Les seuils

- Aucun plafond réel (1.1) : avant de recaler des seuils, il faut un total qui ait un sens (correction de sécurité, 2.5 ; Q1).
- Le premier seuil (100 XP, une ou deux étapes) est bon pour Yanis. Le creux est entre 500 et 1 500 : les trois personas y restent de la semaine 5 à la fin du premier grand parcours.
- Les seuils proposés s'accrochent aux fins de parcours **seulement si les conseils ne rapportent plus d'XP** (avec 1 200 XP de conseils en plus, aucun seuil ne se lit plus comme « un parcours bouclé »).

### 2.3 Le rôle du palier : repère d'activité, jamais mesure de la répartie

- Le progrès réel en répartie est mesuré ailleurs : la courbe « Tu avais une réponse ? » de « Ton mois » (v11 §2.2), auto-déclarée. **Règle écrite : la réponse à « Tu avais une réponse ? » ne rapporte ni XP ni palier, aujourd'hui ni plus tard** : un indicateur déclaratif qu'on récompense cesse de mesurer.
- Un palier fondé sur les XP dit seulement « tu as avancé dans les parcours ». Il le dit à l'écran, sans prétendre résumer l'espace.
- **Les règles A et C sont toutes deux déclaratives** (valider une étape est un clic ; un retour de mission est une déclaration). La vraie différence est ce qu'on récompense : des validations (A) ou un acte dans la vie (C, 3.3).

### 2.4 Les risques

| Risque | Où | Garde-fou |
|---|---|---|
| Triche, palier sans valeur | API qui prend un montant du navigateur ; conseil repayé | Correction de sécurité (2.5) |
| Comptes aux XP irréguliers | XP gagnés par la faille, comptes de test | Audit en base avant tout recalcul (2.6), Q6 |
| Pression, « il me manque 340 XP » | Barre avec pourcentage | Cinq repères, ni pourcentage ni XP restants |
| Culpabilité | Palier qui baisse, série à zéro | Palier jamais en baisse (seule exception : Q6) ; phrase de série inchangée |
| Verdict de talent | Noms « Comique », « Tu rebondis » | Noms de chemin + test de vérité (3.4) |
| Certificat déguisé | Dernier palier vécu comme un diplôme | 07/10 : aucun visuel de diplôme ni page partageable |
| Verrou caché | Palier qui ouvre du contenu | 18/10 et 19/10 : tout reste ouvert (Q5) |
| Pression sociale, relance | Classement ; notification « tu es presque au palier » | Aucun classement ; cloche réservée aux contenus et réponses de l'équipe (Q6 du 12/11) |
| Confusion de vocabulaire | Trois « niveaux » | Mot « palier » (Q3) |
| Rouvrir un choix documenté | Toucher XP d'étape, bonus, série, C4 | P0 s8 : aucune option ne les modifie ; la règle C est marquée et soumise |

### 2.5 Correction de sécurité (hors décision de Thomas)

Elle ne change aucune règle de points visible et part au chantier de développement (v11 §7.2) :
1. **Tout de suite** : le serveur fixe le gain selon l'action ; la route n'accepte plus de montant du navigateur. Actions et montants : étape (XP du seed) et bonus de fin (100), déjà calculés côté serveur ; « conseil lu » (10) **seulement si Q1 = A ou C**.
2. **Seulement si Q1 = A ou C** : un conseil ne rapporte qu'une fois par compte (une ligne par abonné et par conseil, table additive). Règle visible : un conseil relu ne repaie plus. **Si Q1 = B** : l'action « conseil lu » est retirée, la route, qui n'a pas d'autre appelant, est supprimée, et aucune table n'est construite.
3. Les XP déjà acquis ne sont pas retirés, sauf décision de Thomas sur la liste de 2.6 (Q6). La limite de 30 appels par minute reste tant que la route existe. [À VÉRIFIER @fullstack] qu'aucun autre client (app iPhone en préparation) n'appelle la route.

### 2.6 Audit des comptes existants, avant tout recalcul

Lecture en base, **lecture seule**, à faire par @fullstack ou @infrastructure (non faite ici : pas d'accès à la base). Elle précède le recalcul des paliers, et suit la correction 2.5 pour que la liste ne grossisse plus.
- Pour chaque compte avec XP > 0 : XP actuel ; **XP justifiable** = somme des XP des étapes validées (table des validations d'étape, valeurs du seed) + 100 par parcours terminé ; **écart** = XP actuel moins XP justifiable.
- **Irrégulier** = écart supérieur à 10 × le nombre de conseils actifs (ce qu'une lecture honnête, un conseil une fois, ne peut pas produire : signature de l'API libre ou des conseils repayés). Les écarts plus petits sont comptés mais non listés (c'est la règle actuelle, pas une faute).
- **Les 3 comptes de test de Thomas** (variable de production, jamais dans le dépôt) sont listés à part.
- Sortie : une liste (compte, XP actuel, XP justifiable, écart) **montrée à Thomas en session, jamais commitée** (données de comptes). Pour chaque compte, Thomas décide : laisser, ou **ramener l'XP à ce que les étapes et bonus justifient** : **c'est la seule exception à « jamais de baisse »**, marquée comme question (Q6), avec son accord explicite compte par compte.
- Ordre : correction 2.5, audit, décisions de Thomas, recalcul unique des paliers.

## 3. Propositions

### 3.0 Commun à toutes les options

- **Ce qui rapporte** : étape validée (XP du seed) et bonus de fin (100), inchangés. Rafale, jeux, fiches, « Ton mois » : rien (C4, 12/11, tranchée). Lecture d'un conseil : selon Q1.
- **Ce qu'un palier débloque** : selon Q5 (reco : rien).
- **Affichage, spécification d'accessibilité de @ux** :
  1. **Cinq repères en rangée** (cinq pastilles, les n premières pleines) et le texte en clair « palier 3 sur 5 ». Les pastilles sont **décoratives (masquées aux lecteurs d'écran)** : le texte porte l'information, pas de double annonce. Si une barre est gardée : `role="progressbar"` avec `aria-valuetext="palier 3 sur 5"`, jamais une valeur en XP.
  2. État marqué autrement que par la couleur : pastille pleine contre contour.
  3. Phrase de passage et bulle « +X XP » annoncées dans une région `aria-live` polie, **au moins 5 secondes**, fermables, sans animation en boucle.
  4. Contraste 4,5:1 (texte) et 3:1 (pastilles) ; cibles interactives de 44 px au moins.
  5. Aucun émoji, bulle comprise ; le nom du palier est du texte.
- **Phrase de passage, une seule fois** : « Nouveau palier : {nom}. » (ex. « Nouveau palier : tu enchaînes. »). Aucune promesse.
- **XP** : jamais sans échelle ni explication. « 412 XP : tes étapes et tes bonus de parcours » (ou « voir le détail »), **seulement une fois l'audit 2.6 passé** (sinon la phrase serait fausse pour un compte aux XP irréguliers) ; si Q1 = A, « tes étapes, tes bonus et tes conseils ».
- **Place dans l'espace** : dans « Parcours », **après les étapes faites** (jamais en tête, donc distinct du calendrier « Tes 4 premières semaines » de v11 §5.4). La série en jours de pratique vit aujourd'hui sur le profil et v11 ne la place ni dans « Parcours » ni dans « Aujourd'hui » : ce document ne la place pas [À VÉRIFIER dans v12]. Dans « Ton mois » une fois qu'il existe. **Écart assumé avec le brief s24 §3.2 bloc 4**, qui met « XP et niveau » dans « Aujourd'hui » après les étapes faites et la série : ici, rien dans « Aujourd'hui » (le repère neutre « 12 cartes cette semaine » y suffit). Pas dans la barre de rubriques. `/parcours` étant public, le palier n'est rendu que pour l'abonné connecté, côté navigateur.
- **Paliers existants** : recalculés une fois, après l'audit 2.6, vers le haut seulement (aucun abonné ne perd de palier, hors décision de Thomas, Q6). 5 valeurs en base, aucune migration pour les règles A et B ; la règle C demande un champ additif.
- **Garde-fou de test** : le dernier seuil ne dépasse pas 80 % du total d'XP de **toutes** les sources retenues ; il échoue si un parcours est dépublié (sans Storytelling : 2 300 = 100 %).

### 3.1 Règle A, « XP de parcours recalés » (reco)

**Si Q1 = retirer** (reco) : total 3 100, seuils **0, 100, 300, 700, 2 300** (74 %).

| Seuil | Ce qu'il garantit (sur les totaux réels) |
|---|---|
| 100 | une ou deux premières étapes |
| 300 | terminer n'importe quel parcours y fait arriver (le plus court en vaut 325) ; on peut aussi l'atteindre avant la fin d'un grand parcours |
| 700 | terminer un grand parcours (700 à 800) ou deux petits (au moins 800) y fait arriver |
| 2 300 | terminer quatre parcours quelconques y fait arriver (plus petite somme : 325 + 475 + 700 + 800) |

Cas : Sophie : palier 3 à la semaine 3, palier 4 pendant Boulot ; Yanis : palier 3 à la semaine 4, palier 4 pendant Confiance ; Marc : palier 4 à la fin de Confiance (semaine 6). Aucun n'atteint le palier 5 avant au moins 19 semaines (3 + 4 + 6 + 6 étapes), soit environ 5 mois.
**Si Q1 = A** : total 4 300, seuils **0, 100, 400, 1 000, 3 000** (70 %) [HYPOTHÈSE de calage : conseils et parcours se mélangent, plus d'ancrage unique].
**Si Q1 = C** (conseils hors palier) : le palier suit seulement les XP de parcours (étapes validées et bonus, calculables sans colonne nouvelle), seuils de « retirer » ; l'XP affiché peut inclure les conseils.

### 3.2 Règle B, « Parcours bouclés »

Le palier = nombre de parcours terminés : 0, 1, 2, 3, 5. L'XP reste un compteur visible sans rôle. Pour : sens évident. Contre : premier changement au plus tôt à la semaine 3 ; Yanis et Marc restent longtemps au palier 1 ; `calculateLevel` change de nature (`completedAt` déjà en base).

### 3.3 Règle C, « Marche de mission tentée » : **touche l'esprit de C4, accord requis**

- **Idée** : le palier = la plus haute marche de mission **tentée** (retour « Essayé, bof » ou « Essayé, ça a marché ») : marche 1 seul à voix haute, 2 à un proche par message, 3 à un pote en face, 4 en petit groupe, 5 avec quelqu'un qu'on connaît peu (v11 §2.4). Pour un introverti, le progrès est d'**avoir osé**, pas que ça ait marché. Déclarer « ça a marché » ne rapporte rien de plus que « bof » : le retour reste honnête et celui qui propose la marche suivante n'est pas pollué. « Pas essayé » ne rapporte rien. Mot à l'écran : « marche 3 sur 5 » (mot déjà celui des missions).
- **Pour** : le seul palier qui dit un fait vrai sur la personne (un acte dans la vraie vie) ; aucun verdict de talent ; impossible à atteindre en ouvrant des conseils ; ne baisse jamais ; l'XP de parcours reste un compteur « tes parcours » sans nom de palier. Si la marche suivante n'est proposée qu'après la réussite de la précédente, « tentée à la marche k » implique « réussie à k − 1 » [À VÉRIFIER @ux/@fullstack : l'abonné peut-il ouvrir une marche sans avoir réussi la précédente ? sinon l'implication tombe et « bof » à la marche 5 suffirait].
- **Limites, au juste poids** : (1) **déclaratif**, comme la règle A (valider une étape est aussi un clic) : ni l'une ni l'autre ne vérifie rien ; (2) risque Goodhart réduit, pas supprimé : on peut déclarer « Essayé, bof » sans avoir essayé, comme on peut valider une étape sans la faire ; (3) dépend du stockage des retours de mission, **déjà prévu au chantier de l'espace (v11 §7.3)** ; seul le champ du palier s'ajoute (6 états : départ + 5 marches, donc un champ additif ou une valeur de plus, accord requis) ; (4) **adoption** : les missions sont facultatives, un abonné qui n'en ouvre aucune reste à « 0 sur 5 » : le palier ne bouge qu'avec elles, alors que les XP bougent dès la première étape ; (5) pression : un palier qui récompense l'exposition peut pousser à tenter avant d'être prêt ; garde-fou : jamais de « il te manque », rien d'affiché tant qu'aucune marche n'est tentée ; (6) lente : une seule mission ouverte à la fois ; (7) **touche l'esprit de C4** (entraînement hors points et série) : ce n'est ni une série ni des points, c'est une règle neuve sur l'entraînement.
- **Pourquoi je ne la recommande pas maintenant** : c'est la seule option qui dise un progrès réel, mais elle dépend de l'adoption des missions (limite 4) et touche l'esprit d'une décision prise le jour même (P0 s8). Je la garde prête : la mesure « missions tentées » est déjà prévue (v11 §7.6) ; à J60, si assez d'abonnés tentent des missions, la question se repose avec des chiffres.

### 3.4 Les noms, étalons à faire valider (séparés des règles)

**Tests de relecture à l'aveugle** : (1) lu seul, se comprend en 3 secondes ; (2) ni rang ni verdict ; (3) n'affirme pas une compétence que la règle ne mesure pas ; (4) **test de vérité : ce que dit le nom est vrai pour quelqu'un qui vient de valider l'étape qui le fait monter** ; (5) Yanis, Sophie ou Marc s'y reconnaît. Aucun mot de scène (v11 §3.5) ; le palier 1 ne dit rien de passif.

| Palier | Seuil (règle A) | E1, « Où tu en es » (base @ux) | E2, « Position » | E3, marches (règle C) |
|---|---|---|---|---|
| 1 | 0 | Tu t'échauffes | Tu démarres | À voix haute |
| 2 | 100 | Tu te lances | Tu es en route | Avec un proche |
| 3 | 300 | Tu as pris ton rythme | Tu es bien lancé | En face |
| 4 | 700 | Tu enchaînes | Tu as fait un bon bout | En groupe |
| 5 | 2 300 | Tu connais la maison | Tu as presque tout fait | Avec quelqu'un de nouveau |

**Test de vérité (4) passé par le rédacteur, à refaire à l'aveugle** :
- E1 : palier 1 vrai ; 2 vrai (une ou deux étapes validées) ; **3 fragile** : « Tu as pris ton rythme » est faux pour qui a validé quatre étapes le même jour (rien ne l'en empêche) : variante vraie « Tu es bien parti » ; 4 vrai (plusieurs étapes validées) ; 5 vrai (au moins quatre parcours, donc au moins 19 étapes).
- E2 : 1 à 3 vrais ; 4 vrai pour un grand parcours bouclé (700 sur 3 100 : « un bon bout », pas « loin ») ; 5 vrai (74 % du total) **seulement si Q1 = B** (avec les conseils comptés, faux).
- E3 : chaque nom dit ce qu'on a tenté, vrai par construction ; n'a de sens qu'avec la règle C.
- Témoin de comparaison, non retenu : « Tu rebondis, Tu places tes vannes, Tu tiens la conversation » (affirment une compétence).

**Le mot** (comparé, faute de lecteurs réels dans cette session ; le test de 3 secondes sera passé par @ux) :

| Critère | cap | palier | repère |
|---|---|---|---|
| Lecture « 3 sur 5 » | ambiguë (boussole) | claire (position sur une échelle) | claire |
| « Nouveau … : {nom} » | naturel | naturel | faible (un repère n'est pas nouveau) |
| Collision | aucun texte client (vérifié) | « palier » sert en interne dans v11 (plans de production), jamais affiché ; textes client non recherchés [À VÉRIFIER] | « repère neutre » décrit déjà le compteur de cartes (v11 C4) |
| Proximité avec « marche » (missions) | nulle | proche (escalier), évitée : la règle C dit « marche » | nulle |

**Reco : « palier »**, sous réserve d'un contrôle des textes client par @fullstack ; repli : « cap » (déjà vérifié libre). « Niveau » est écarté : il désigne déjà la difficulté des parcours et celle des conseils.

### 3.5 Reco

**Q1 = retirer, règle A (0, 100, 300, 700, 2 300), noms E1 (avec « Tu es bien parti » au palier 3 si le test l'exige), mot « palier », rien de débloqué.** Raisons : une seule voie d'XP, bornée, donc un palier fiable ; il bouge dès la première étape (la règle C reste à zéro pour qui n'ouvre aucune mission) ; il respecte C4 dans la lettre et l'esprit ; il n'ajoute aucun chantier à la correction de sécurité. **Supprimer l'échelle** a été examiné et écarté : le positionnement promet « XP, streak, niveaux ».

### 3.6 Critères de réussite (binaires)

1. Aucun montant d'XP n'est choisi par le navigateur ; si Q1 = A ou C, un conseil ne rapporte qu'une fois par compte ; si Q1 = B, plus aucun conseil ne rapporte d'XP et la route est supprimée.
2. Seuils croissants ; le dernier est inférieur ou égal à 80 % du total d'XP de toutes les sources retenues (test automatique, échoue si un parcours est dépublié).
3. Le palier ne diminue jamais, sauf la liste décidée par écrit par Thomas (Q6) ; le recalcul n'en fait baisser aucun autre.
4. Sur la carte du palier : aucun émoji, tiret cadratin, pourcentage ni « XP restants ». (Les textes validés « X XP gagnés sur N, bonus de fin compris » des parcours restent.)
5. Les seuils n'existent qu'à un seul endroit du code.
6. Le mot « niveau » ne désigne plus l'échelle d'XP à l'écran.
7. Cinq repères masqués aux lecteurs d'écran avec le texte « palier 3 sur 5 », état hors couleur, `aria-live` poli, 5 secondes au moins, contrastes 4,5:1 et 3:1, cibles de 44 px.
8. La réponse à « Tu avais une réponse ? » n'alimente ni XP ni palier (test).
9. Aucun contenu, page ou fonction n'est ouvert ou fermé selon le palier (revue de `user.level` dans `apps/`).
10. Événement « palier atteint » sans identifiant, avec le seul numéro de palier ; lecture soumise à l'effectif minimal de v11 §7.6.
11. Aucun compte n'a plus d'XP que ses étapes et ses bonus (et ses conseils si Q1 = A) ne le justifient, sauf décision écrite de Thomas.
12. Chaque nom passe les cinq tests de 3.4 à l'aveugle.

## 4. Questions pour Thomas

Six questions (la sixième seulement si la lecture de la base la rend nécessaire), trois options chacune, une reco argumentée. Q1 en premier : elle fixe le total d'XP, donc tous les seuils.

**Déjà décidé, non reposé** : C4 (12/11) ; XP d'étape et bonus de fin inchangés (étalons s17) ; série sur la pratique (07/10) ; pas de certificat (07/10) ; tout reste ouvert (18/10, 19/10) ; cloche sans relance (Q6 du 12/11) ; FAQ « 50 XP par semaine » intacte (29/09). **Tranché sans question** : la correction de sécurité (2.5) ; recalcul unique des paliers vers le haut ; aucun e-mail ni notification liés aux paliers ; aucun émoji ; seuils à un seul endroit du code.

**Q1. Les 10 points gagnés en ouvrant un conseil : on les garde ?**
- A. Garder, **une seule fois par conseil** (un conseil relu ne rapporte plus) : au plus 1 200 XP pour les 120 conseils actuels, plus si le stock grandit. Total 4 300, seuils 0, 100, 400, 1 000, 3 000.
- B. **Reco** : retirer pour l'avenir (les XP déjà gagnés restent). Total 3 100, seuils lisibles (un parcours, un grand parcours, quatre parcours). Raisons : lire n'est pas pratiquer (1 200 XP, 39 % du total des parcours, seraient gagnés en ouvrant des fiches) ; le conseil de chaque étape est déjà payé par l'XP de l'étape ; le stock de conseils bouge, donc les seuils dériveraient ; c'est l'esprit de C4. Coût : retire une règle de points qui existe déjà (date de sa pose non lue) ; la bulle « +10 XP » disparaît de la liste des conseils ; **la phrase en ligne de la page des conseils (« … avec des exercices concrets et des XP ») est à retoucher, avec ton go** ; le compteur « Conseils terminés » reste.
- C. Garder l'XP affiché mais hors du palier : le palier ne suit que les parcours (deux chiffres à l'écran, plus complexe).

**Q2. Comment passe-t-on d'un palier au suivant ?** (la règle, sans les noms)
- A. **Reco** : selon les XP, seuils recalés (3.1).
- B. Selon le nombre de parcours terminés : 0, 1, 2, 3, 5 (3.2).
- C. Selon la plus haute marche de mission **tentée** (3.3). **Touche l'esprit de ta décision du 12/11 (C4)** : ni série ni points, mais une règle neuve sur l'entraînement. Seule option où le palier dit un acte réel ; limite principale : un abonné sans mission reste à zéro. À reposer à J60 avec la mesure des missions tentées.

**Q3. Les noms, et le mot.**
- Noms : A. **Reco** E1 (« Tu t'échauffes, Tu te lances, Tu as pris ton rythme, Tu enchaînes, Tu connais la maison »). B. E2 (« Tu démarres, Tu es en route, Tu es bien lancé, Tu as fait un bon bout, Tu as presque tout fait »). C. E3, les marches (« À voix haute » à « Avec quelqu'un de nouveau »), seulement avec la règle C.
- Mot : **« palier »** (reco), « cap », ou « niveau » (déconseillé : désigne déjà la difficulté).
Tu peux changer un seul nom. Chaque texte touché (1.4) te revient pour un go.

**Q4. À quelle distance mettre le dernier palier ?** (règles A et B ; **chiffres pour Q1 = B** : si tu gardes les conseils, l'option A devient 3 000 et les options B et C se recalculent sur 4 300)
- A. **Reco** : environ quatre parcours (2 300 XP, 5 mois environ au rythme conseillé).
- B. Environ trois mois (1 600 XP, deux grands parcours) : plus vite fêté, plus rien à gagner ensuite côté palier.
- C. Tout le site (3 100 XP) : un parcours dépublié le rend inatteignable, et il dépasse le plafond de 80 % du test.

**Q5. Un palier débloque-t-il quelque chose ?**
- A. **Reco** : rien, c'est un repère.
- B. Au passage, une phrase de l'équipe propose une fiche à faire ensuite, rien de bloqué (une phrase par palier, relue à l'aveugle).
- C. Un contenu bonus par palier : **rouvre en partie ta décision du 18/10** (un contenu serait derrière un palier).

**Q6. (si la liste de 2.6 n'est pas vide) Que faire des comptes dont les points dépassent ce que leurs parcours justifient ?** Je te montre la liste en session (comptes de test à part).
- A. Les laisser tels quels : leur palier se recalcule sur l'XP actuel (il peut monter, jamais baisser).
- B. **Reco** : pour chaque compte que tu valides sur la liste, **ramener l'XP à ce que les étapes et bonus justifient**. **C'est la seule exception à « le palier ne baisse jamais »**, avec ton accord compte par compte. Raison : sans cela, un compte garderait un palier « Tu connais la maison » sans avoir fait un parcours.
- C. Les ramener tous automatiquement : plus simple, mais sans ton regard sur chaque cas.

## 5. À traiter après ta réponse

- **@fullstack / @infrastructure** : correction de sécurité (2.5) dès maintenant, sans attendre les réponses ; **audit en lecture seule des comptes (2.6)** ; état des interrupteurs de parcours ; qui d'autre appelle la route d'XP ; contrôle du mot « palier » dans les textes client ; centraliser les seuils ; recalcul unique ; test de garde ; remplacer `progression-levels.md`. Aucun fichier de `apps/` n'a été modifié par cette session.
- **@ux** : spécification 3.0, place dans « Parcours » et « Ton mois », test de 3 secondes sur les trois mots, test de vérité des noms à l'aveugle.
- **@legal** : rien (aucune donnée nouvelle) ; sauf règle C (retours de mission stockés, v11 §7.2).
- **@data-analyst** : événement « palier atteint » sans identifiant.

## Annexe A. Tour 2 : traitement

| Source | N° | Traitement dans la v3 |
|---|---|---|
| @elon | X1 (noms affirmant une compétence) | 2.1 principe « jamais une compétence » ; 3.4 noms de chemin, tests (3) et (4) ; Q3 |
| @elon | X2 (marche tentée, pas réussie) | 3.3 réécrite : marche tentée, « Pas essayé » ne rapporte rien |
| @elon | X3 (limites de C surestimées) | 3.3 limite (3) : stockage déjà prévu (v11 §7.3), seul le champ du palier s'ajoute ; 2.3 et 3.3 limite (1) : A et C toutes deux déclaratives ; 3.5 reco justifiée par l'adoption, pas par un chantier |
| @reviewer | Z1 (page des conseils, inventaire) | 1.4 complété (conseils/page.tsx l. 161, inchangés listés) ; Q1 B : phrase à retoucher avec go |
| @reviewer | Z2 (Q4 suppose Q1 = B) | Q4 : dépendance dite (2 300 si B, 3 000 si A) |
| @reviewer | Z3 ([À VÉRIFIER] levables) | 1.4 « Faits levés » ; 3.0 écart avec le brief cité tel quel ; « cap » vérifié libre |
| @reviewer | Z4 (table de conseils seulement si A ou C) | 2.5 points 1 et 2 ; critère 1 |
| @ux | 1 (noms de compétence, bloquant) | 2.1, 3.4 : base @ux (« Tu t'échauffes… Tu connais la maison »), test de vérité (4), E1 passé au test (palier 3 fragile signalé) |
| @ux | 2 (comptes aux XP irréguliers, bloquant) | 2.6 audit en base avant recalcul, Q6 (seule exception à « jamais de baisse »), critère 11, phrase XP conditionnée à l'audit (3.0) |
| @ux | 3 (mot « cap ») | 3.4 : cap, palier, repère comparés ; reco « palier » sous contrôle, repli « cap » |
| @ux | 4 (actions de l'API, appelants, unicité visible) | 2.5 : actions et montants, appelant unique vérifié, route supprimée si Q1 = B ; Q1 A dit « un conseil relu ne rapporte plus » |
| @ux | 5 (où vit la série) | 3.0 : placement « après les étapes faites » seulement ; série non placée, [À VÉRIFIER v12] |
| @ux | 6 (résumé technique) | Résumé réécrit en langage simple, mot « palier » expliqué |
| @ux | 7 (critère 4 et textes validés) | Critère 4 précisé |
| @ux | 8 (pastilles pour lecteur d'écran) | 3.0 point 1 : pastilles masquées, le texte porte l'information ; critère 7 |

(Tour 1 : traité dans la v2, resté acquis : sources d'XP, C4 non reposée, règle C, courbe jamais récompensée, accessibilité, inventaire.)

## Annexe B. À porter dans l'architecture (v11, puis v12)

1. **§1.1, ligne « XP, niveaux, série (code) »** : ajouter « 10 XP par conseil ouvert (`conseils-list.tsx` l. 175 à 178), anti-doublon en mémoire de page seulement ; `POST /api/user/xp` accepte un montant choisi par le navigateur (1 à 500, 30 appels par minute) ; seul appelant : la liste des conseils ».
2. **§1.1, ligne `progression-levels.md` « OBSOLÈTE (gains absents du code) »** : nuancer (le gain « +10 par conseil » existe).
3. **C4** : la phrase « les points viennent des étapes et du bonus de fin » est incomplète. La décision reste valide mais a été prise sans savoir que lire un conseil rapporte des points : le dire à Thomas avec la Q1.
4. **§7.2, chantier** : ajouter la correction de sécurité (2.5) ; la table « un conseil une fois par compte » seulement si Q1 = A ou C ; l'audit des comptes (2.6).
5. **§5.2** : le conseil de chaque étape (fiche 1.1) ne rapporte pas d'XP à part (déjà dans l'XP de l'étape).

