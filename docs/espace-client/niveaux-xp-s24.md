# Niveaux et XP de l'espace Premium (s24), v6

> **v6**, @product-manager, 12/11/2026 : v5 après le tour 5 (@elon 10, @reviewer 9,7, @ux 9,0, aucun bloquant), seules retouches D1 à D4, M1 à M4 et trois précisions de @ux (annexe A ter). Remplace la v4 (tour 4 : @elon 9,6, @reviewer 9,6, @ux 8,6 avec 2 bloquants ; tour 3 : 9,6, 9,1, 8,3). Brouillon à relire à l'aveugle (tour 5 limité aux passages modifiés) jusqu'à 10/10 avant d'être montré à Thomas. Annexe A : traitement des tours 3 et 4. Annexe B : correctifs à porter dans l'architecture (courante : v13).
> Conventions : [À VÉRIFIER] = fait non lu ; [HYPOTHÈSE] = choix de travail. Aucun chiffre d'usage n'est inventé (4 abonnés actifs au 02/11). Noms et libellés proposés : ni tiret cadratin ni émoji.
> **Vocabulaire** : trois choses se disent déjà « niveau » : la difficulté d'un parcours (débutant, intermédiaire : C7), le filtre de difficulté des conseils, et l'échelle d'XP traitée ici. Pour ne pas les confondre, **ce document appelle l'échelle d'XP un « cap »** (« cap 3 sur 5 »). « Cap » est vérifié libre, mot entier, dans tous les textes client de `apps/web/src` (il n'y apparaît que dans des commentaires ou noms internes comme « frequency cap » et « hard cap »). « Palier » est l'autre candidat, avec un conflit avec un article public ; une troisième option n'emploie aucun mot (3.4, Q3). Le code garde `level` en interne.

## Résumé pour Thomas (sans jargon)

- **Un fait nouveau change le diagnostic.** Aujourd'hui, n'importe quel abonné peut s'attribuer des points à la main, et ouvrir un conseil dans la liste du catalogue rapporte 10 points à chaque fois qu'il rouvre la page (le conseil du jour et celui d'une étape de parcours n'en rapportent pas). Le niveau le plus haut (5 000 points) s'atteint donc en quelques minutes : le niveau actuel ne mesure rien de fiable.
- **Je corrige ce défaut sans te le demander**, car il ne change aucune règle de points que tu aies choisie : les points seront fixés par le site, pas par le navigateur, le site refusera tout conseil qui n'est pas au catalogue, et un conseil ne rapportera ses points qu'une seule fois par compte. Cette dernière règle ne t'a pas été soumise : la page des conseils évite déjà de repayer un conseil tant qu'elle reste ouverte, et je suppose que c'est la règle voulue [HYPOTHÈSE]. Rien n'est livré aujourd'hui : la correction est livrée seule et en premier, avant l'ouverture de l'espace ; dès qu'elle est livrée, lire un conseil ne rapporte plus de points en boucle. Les points déjà gagnés ne bougent pas ; seuls tes comptes de test sont ramenés à leurs étapes validées et bonus si tu es d'accord (Q6).
- **Ce que je te demande, dans l'ordre** : (1) garder ou retirer les 10 points par conseil lu (ta décision du 12/11 sur les points a été prise avant que nous voyions que lire un conseil en rapporte déjà) ; (2) comment on passe d'un cap au suivant (3 règles, dont une qui mesure un acte réel et touche à l'esprit de ta décision C4) ; (3) les noms, et le mot ; (4) la distance du dernier cap ; (5) ce qu'un cap débloque ; (6) que faire des points déjà gagnés (reco : ne toucher à aucun abonné, ramener à leurs étapes et bonus seulement tes comptes de test).
- **Reco** : retirer les 10 points par conseil ; règle « points recalés » (0, 100, 300, 700, 2 300) ; noms qui disent le chemin parcouru, jamais un talent ; mot « cap » ; rien de débloqué.
- **Jamais, dans aucune option** : la réponse à « Tu avais une réponse ? » ne rapporte ni points ni cap ; pas de classement, pas de relance, pas de certificat, pas de contenu verrouillé ; le cap d'un abonné ne baisse pas (seuls tes comptes de test, Q6).
- Le mot « cap » désigne l'échelle des points ; il n'a rien à voir avec la difficulté des parcours.

## 1. État réel (code lu)

### 1.1 Les sources d'XP, toutes

| Source | Montant | Anti-doublon | Où |
|---|---|---|---|
| Étape de parcours validée | 50 à 200 selon l'étape (moyenne 104 sur 25 étapes) | en base : une validation par étape et par abonné | `app/api/parcours/[id]/progress/route.ts` l. 180 |
| Bonus de fin de parcours | 100 | en base : une fois par parcours | idem, `PATH_COMPLETION_BONUS_XP` |
| **Conseil ouvert dans la liste du catalogue des conseils (Premium)** (le conseil du jour et la fiche conseil d'une étape de parcours ne donnent **pas** d'XP) | **10** | **seulement dans la page ouverte** (`useState(new Set())`), remis à zéro à chaque chargement | `components/conseils/conseils-list.tsx` l. 111 et 175 à 178 |
| **Appel libre à l'API** | **montant choisi par le navigateur, 1 à 500** | aucun | `app/api/user/xp/route.ts` l. 12, 26, 48 à 55 (30 appels par minute, Premium ; **seul le total est incrémenté, ni l'action ni l'historique des gains ne sont gardés**) ; `stores/user-store.ts` l. 52 à 61 |

- Vérifié par @reviewer : les deux seuls crédits d'XP côté serveur sont la validation d'étape et cette route ; **le seul appelant de la route est la liste des conseils** (aucun dans `apps/mobile`, hors tests).
- **Totaux des parcours** (somme des `moduleXp` des trois seeds) : Machine à Café 325 (3 étapes), Répartie 475 (4), Confiance 800 (6), Storytelling 800 (6), Boulot 700 (6) = **3 100 XP** (2 600 d'étapes + 500 de bonus), 25 étapes. Sans Storytelling (non publié) : 2 300 ; sans Boulot : 2 400. Storytelling est publié (`STORYTELLING_PUBLIE = true`, `parcours-publication.ts` l. 12, vérifié par la session) ; Boulot est publié depuis le 11/10 (historique du projet) ; à relire au jour du déploiement.
- **Conseils** : 120 conseils actifs au 12/11 (v11 §1.1) × 10 = **1 200 XP au plus** si chaque conseil est payé une seule fois, soit **4 300** au total ; le stock bouge avec le catalogue [À VÉRIFIER : les conseils générés s'ajoutent-ils au stock actif ?].
- **Vitesse aujourd'hui** : par clics, jusqu'à 300 XP par minute (30 appels de 10) ; à la main, jusqu'à 15 000 XP par minute (30 appels de 500). « Légende » (5 000) tombe en moins de 20 minutes de clics ; le seuil 2 300 en moins de 8. **Une fois la correction 2.5 livrée (au développement, avant l'ouverture), plus aucun gain n'est possible en boucle** : au plus 10 × le nombre de conseils actifs (1 200 aujourd'hui) par ce canal. C'est un **plafond, pas « ce qui a été lu »** : le serveur ne peut pas savoir si l'abonné a réellement ouvert le conseil.
- Le compteur « Conseils terminés » du profil vient des étapes, pas des conseils ouverts (`api/user/route.ts` l. 52) : il ne change pas si les 10 XP sont retirés.
- `docs/content/progression-levels.md` est en partie obsolète : « +10 par conseil lu » existe ; le reste (blague +2, connexion +5, bonus de série, badges) n'existe nulle part dans ce qui a été lu, et sa série « sur la connexion » contredit la décision du 07/10. Il sera remplacé par le barème retenu.
- **C4 (12/11)** : « aucune nouvelle règle de série ni de points pour l'entraînement et les fiches ». La lecture d'un conseil est une règle **existante**, pas nouvelle : C4 ne la tranche pas. Elle fait pourtant gagner des points à une lecture de bibliothèque : la liste du catalogue des conseils (`components/conseils/conseils-list.tsx`, utilisé seulement par `app/(dashboard)/conseils/page.tsx`). Le conseil du jour et le conseil d'une étape de parcours ne donnent aucun XP (vérifié par la session). C'est la Q1.

### 1.2 Ce que l'abonné peut atteindre aujourd'hui

- Seuils : Novice 0, Apprenti 100, Farceur 500, Comique 1 500, Légende 5 000.
- Par les parcours seuls : 3 100 XP, soit 62 % de 5 000 : « Légende » inatteignable par le travail, plafond « Comique » avec une barre à 46 % (1 600 sur 3 500).
- Par les conseils et l'API : aucun plafond. 70 conseils ouverts donnent 700 XP en quelques minutes, sans une étape.
- Rythme conseillé : une étape par semaine, suivante conseillée 7 jours après la dernière (rien n'est bloqué). [HYPOTHÈSE] « abonné régulier » = une étape par semaine, 25 étapes ≈ 6 mois ; aucune donnée d'usage.
- Cumuls de fin de parcours (étapes seules) : Sophie (Machine à Café puis Boulot) 325 (sem. 3), 1 025 (sem. 9) ; Yanis (Répartie puis Confiance) 475 (sem. 4), 1 275 (sem. 10) ; Marc (Confiance puis Storytelling) 800 (sem. 6), 1 600 (sem. 12).

### 1.3 Ce qu'un niveau change à l'écran aujourd'hui

- Un seul écran : la carte « Progression » de `/profil` (Premium) : icône emoji, nom, total d'XP, barre avec pourcentage, « Prochain niveau : X », une phrase parmi cinq (`PROGRESSION_NIVEAU`). À chaque gain, une bulle « +X XP » (avec un emoji dans le code) ; côté serveur, un indicateur `levelChanged` [À VÉRIFIER @fullstack : affiché ou non].
- Rien ne s'ouvre ni ne se ferme selon le niveau. Dette : seuils en double (`XP_THRESHOLDS` dans `progression.ts`, `USER_LEVELS` dans `utils.ts`) ; niveau = type fermé de 5 valeurs en base (`UserLevel`).

### 1.4 Inventaire des textes qui citent niveaux, XP ou les mots candidats

Recherche faite par @reviewer aux tours 2 et 3 (« XP » apparaît dans 32 fichiers de `apps/web/src`). **Touchés par une option** :

| Texte | Où | Touché par | Go de Thomas |
|---|---|---|---|
| Noms et icônes des 5 niveaux | `lib/utils.ts` (`USER_LEVELS`) | tout changement de noms (Q3) | oui |
| Cinq phrases de la carte (« Niveau maximum… », « Niveau X atteint… ») | `config/textes/parcours.ts` (`PROGRESSION_NIVEAU`) | changement de mot (Q3) | oui |
| **« Progresse semaine après semaine avec des exercices concrets et des XP. »** | `app/(dashboard)/conseils/page.tsx` l. 161, **texte en ligne** | **Q1 = B** : la phrase devient en partie fausse, à retoucher | **oui, ton go** |
| Bulle « +X XP » (avec émoji) | `components/ui/xp-notification.tsx` | accessibilité (3.0) ; disparaît pour les conseils si Q1 = B | oui pour l'émoji retiré |
| « Garde tes XP et ton parcours » | `components/mobile/OnboardingFlow.tsx` l. 216 à 218 | aucune option | non |

**Inchangés** par toutes les options (le mot « XP » reste) : FAQ « Nos membres gagnent en moyenne 50 XP par semaine » (`lib/faqs.ts` l. 21, **gardée par Thomas le 29/09 : on ne la touche pas sans son go**, ce document ne s'en sert pas comme donnée) ; accueil (`page.tsx` l. 105 et 122) ; `a-propos/page.tsx` l. 135 ; `parcours/(liste)/page.tsx` l. 80 ; `videos/page.tsx` l. 64 ; `lib/llms-content.ts` l. 83 ; `lib/blog-articles.ts` l. 1917 ; `config/textes/entrees-parcours.ts` l. 61 ; `confidentialite/page.tsx` l. 97 (« XP, niveau, série » : nom de donnée) ; « X XP gagnés sur N, bonus de fin compris » et « +X gagnés ! » (`config/textes/parcours.ts`, validés, XP et bonus intouchables) ; filtre « niveaux » des conseils et difficulté des parcours (autres sens du mot).
**Faits sur les mots candidats** (@reviewer, tour 3) :
- **« cap » : libre, mot entier, dans tous les textes client de `apps/web/src`** (vérifié par la session, puis par @reviewer dans `config/`, `components/`, les pages, `lib/blog-articles.ts`, `lib/faqs.ts`, `lib/llms-content.ts`, `data/`). Il n'y apparaît que dans des commentaires ou des noms internes (« frequency cap », « hard cap »). Réserve de @ux : « franchir un cap » est une tournure courante ; une occurrence au sens « seuil » ne ferait pas collision, « garder le cap » (direction) pourrait : aucune n'existe.
- **« palier » : employé dans des textes en ligne, dans deux sens qui heurtent la proposition.** (a) Échelle d'exposition, article sur la timidité (`lib/blog-articles.ts`) : l. 2455 « Clé 5 : La progression par paliers, du petit groupe au grand groupe », l. 2466 « **Chaque palier est un niveau à débloquer** », l. 2472 « Le palier 1, c'est maintenant », l. 2529 « Commence par le palier 1 : envoie une vanne par message à un seul ami de confiance » : c'est l'échelle des marches de mission. (b) Progression des parcours, l. 215 et 2499 : « palier par palier ». « Chaque palier est un niveau à débloquer » contredit en plus « un cap ne débloque rien » (Q5 A). Sens courant sans collision ailleurs (`joke-decryptages.json`, `hebdo-premium.json` l. 91, `anatomie-vanne/page.tsx` l. 84).
- Aucun « XP » ni nom de niveau dans les e-mails approuvés, `apps/web/src/data` (lettres, carnet) ni `apps/mobile`.
- Le brief s24 §3.2 bloc 4 place dans « Aujourd'hui » : « Progression : étapes faites et série en tête ; XP et niveau ensuite » ; son bloc 1 y place la série « {n} jours de pratique d'affilée » (texte validé s17).

## 2. Diagnostic

### 2.1 Les noms actuels

| Nom | Problème |
|---|---|
| Novice, Apprenti | Registre de jeu ou scolaire (la marque exclut « Scolaire ») ; dit « débutant » à quelqu'un qui manque déjà de confiance. |
| Farceur | Du ton maison, mais décrit celui qui fait des blagues, pas celui qui a de la répartie. |
| Comique | Un verdict de talent que rien ne prouve (XP déclarés et falsifiables). |
| Légende | Promesse démesurée, inatteignable par le travail. |

**Principe retenu pour les nouveaux noms** : un nom ne dit **jamais une compétence** (« tu rebondis », « tu tiens la conversation » affirmeraient un savoir-faire que les XP ne vérifient pas : même faute que « Comique », à la 2e personne). Il dit **le chemin parcouru** et passe un test de vérité (3.4).

### 2.2 Les seuils

- Aucun plafond réel (1.1) : avant de recaler des seuils, il faut un total qui ait un sens (correction 2.5 ; Q1).
- Le premier seuil (100 XP, une ou deux étapes) est bon pour Yanis. Le creux est entre 500 et 1 500 : les trois personas y restent de la semaine 5 à la fin du premier grand parcours.
- Les seuils proposés s'accrochent aux fins de parcours **seulement si les conseils ne rapportent plus d'XP** (avec 1 200 XP de conseils en plus, aucun seuil ne se lit plus comme « un parcours bouclé »).

### 2.3 Le rôle du cap : repère d'activité, jamais mesure de la répartie

- Le progrès réel en répartie est mesuré ailleurs : la courbe « Tu avais une réponse ? » de « Ton mois » (v11 §2.2), auto-déclarée. **Règle écrite : la réponse à « Tu avais une réponse ? » ne rapporte ni XP ni cap, aujourd'hui ni plus tard** : un indicateur déclaratif qu'on récompense cesse de mesurer.
- Un cap fondé sur les XP dit seulement « tu as avancé dans les parcours ». Il le dit à l'écran, sans prétendre résumer l'espace.
- **Les règles A et C sont toutes deux déclaratives** (valider une étape est un clic ; un retour de mission est une déclaration). La différence est ce qu'on récompense : des validations (A) ou un acte dans la vie (C, 3.3).

### 2.4 Les risques

| Risque | Où | Garde-fou |
|---|---|---|
| Gain en boucle, cap sans valeur | API qui prend un montant du navigateur ; conseil repayé ; identifiants inventés | Correction 2.5, au développement avant l'ouverture, sans attendre Q1 |
| XP déjà gagnés par la faille, comptes de test | API libre, rechargements, tests de Thomas | Aucun abonné touché par défaut ; comptes de test ramenés à leurs étapes et bonus (Q6) ; vérification de 2.6 |
| Pression, « il me manque 340 XP » | Barre avec pourcentage | Cinq repères, ni pourcentage ni XP restants |
| Culpabilité | Cap qui baisse, série à zéro | Cap d'un abonné jamais en baisse (seule exception : comptes de test de Thomas, Q6) ; phrase de série inchangée |
| Verdict de talent | Noms « Comique », « Tu rebondis » | Noms de chemin + test de vérité (3.4) |
| Certificat déguisé | Dernier cap vécu comme un diplôme | 07/10 : aucun visuel de diplôme ni page partageable |
| Verrou caché | Cap qui ouvre du contenu | 18/10 et 19/10 : tout reste ouvert (Q5) |
| Pression sociale, relance | Classement ; notification « tu es presque au cap » | Aucun classement ; la décision de la cloche du 12/11 la réserve aux contenus et aux réponses de l'équipe |
| Confusion de vocabulaire | Trois « niveaux » ; « palier » déjà dans un article | Mot « cap » (Q3) |
| Rouvrir un choix documenté | Toucher XP d'étape, bonus, série, C4 | P0 s8 : aucune option ne les modifie ; la règle C est marquée et soumise |

### 2.5 Correction du défaut, au développement avant l'ouverture (hors décision de Thomas)

**Rien n'est livré aujourd'hui** : la boucle existe toujours. La correction ferme une route et n'a aucun lien avec l'ouverture de l'espace : **elle est livrée seule et en premier** (chaque semaine d'attente laisse la boucle ouverte aux abonnés actuels, peu nombreux mais réels). C'est la correction d'un défaut, pas un changement de règle choisie : la liste des conseils évite déjà de repayer un conseil tant que la page reste ouverte (`completedTipIds`) ; je suppose que c'est la règle voulue, faute de commentaire ou de décision citée [HYPOTHÈSE], et je le dis à Thomas dans le résumé (l'unicité par compte ne lui a pas été soumise). La correction part au chantier de développement (v11 §7.2), **sans attendre la réponse à Q1** :
1. **Le serveur fixe le gain selon l'action** ; la route n'accepte plus de montant du navigateur. Actions et montants : étape (XP du seed) et bonus de fin (100), déjà calculés côté serveur ; « conseil lu » (10).
2. **Le serveur refuse tout identifiant qui n'est pas celui d'un conseil actif.** Sans cette vérification, mille identifiants inventés (30 appels par minute) créeraient mille gains de 10 XP : « une fois par conseil » ne serait plus un plafond.
3. **Un conseil ne rapporte qu'une seule fois par compte, garanti par la base** : une ligne par abonné et par conseil (table additive) avec une **contrainte d'unicité en base**, pas seulement un test dans le code (deux requêtes simultanées sur le même conseil ne doivent pas payer deux fois). Règle visible : un conseil relu ne repaie plus. Sans les points 2 et 3, le montant fixe laisserait 300 XP par minute possibles (30 appels de 10).
4. **Plafond, pas lecture prouvée** : le serveur ne sait pas si l'abonné a réellement ouvert le conseil ; le maximum par ce canal est 10 × le nombre de conseils actifs (1 200 aujourd'hui).
5. **Si Q1 = B** : l'action « conseil lu » est retirée, la route (qui n'a pas d'autre appelant) est supprimée et la table n'est plus alimentée (supprimée ou laissée vide).
6. Les XP déjà acquis par un abonné ne sont pas retirés. La limite de 30 appels par minute reste tant que la route existe.

### 2.6 Les points déjà gagnés : pas d'audit abonné par abonné

**Principe** : un cap ne débloque rien (Q5 A), personne d'autre ne le voit et il ne donne aucun rang. Un abonné qui aurait gonflé ses points ne trompe que son propre écran. Avec 4 abonnés actifs, un audit suivi d'une décision compte par compte aurait un gain nul et un risque réel (pénaliser à tort un abonné payant). **On ne touche donc à aucun compte d'abonné** ; les caps se recalculent vers le haut.
- **Seule remise à niveau proposée** : ramener l'XP des **3 comptes de test de Thomas** (variable de production, jamais dans le dépôt) à la somme de leurs étapes validées et de leurs bonus de fin acquis (zéro seulement s'ils n'en ont aucune), si Thomas est d'accord (Q6). C'est la seule exception à « le cap ne baisse jamais », et elle ne concerne aucun abonné.
- **Vérification, sans décision par compte** (lecture seule, @fullstack ou @infrastructure, non faite ici faute d'accès à la base) : après la correction 2.5, vérifier que plus aucun compte ne gagne en boucle (le total n'augmente plus que par étapes, bonus et conseils uniques).
- **Limite** : la base ne garde que le total d'XP (ni l'action ni l'historique des gains) ; on ne peut pas distinguer un usage de l'API à la main d'un abonné honnête qui a rouvert des conseils, comportement que le site paie de lui-même tant que la correction n'est pas livrée.
- **Indice, pas preuve** : les barèmes actuels ne produisent que des multiples de 5 (étapes de 50 à 200 par pas de 25, bonus 100, conseil 10), donc un total qui n'en est pas un **indique** un usage de l'API. Un ancien barème a pu exister : `progression-levels.md` décrit « +2 par blague » et « +5 par connexion », et les tests gardent une action `joke_read` (`stores.test.ts` l. 88, `api-validation.test.ts` l. 282) ; la valeur par défaut `moduleXp = 20` d'avant la réécriture des étapes aussi. L'historique du dépôt disponible ici est trop court pour trancher. **Avant de montrer à Thomas toute liste fondée sur cet indice**, @fullstack lit l'historique de `progression.ts`, des seeds et de `addXp`. Cette liste n'est plus nécessaire dans la reco, elle reste possible (Q6 C).
- Ordre : correction 2.5, vérification, remise à niveau des comptes de test si Q6 = B, recalcul unique des caps.

## 3. Propositions

### 3.0 Commun à toutes les options

- **Ce qui rapporte** : étape validée (XP du seed) et bonus de fin (100), inchangés. Rafale, jeux, fiches, « Ton mois » : rien (C4, 12/11, tranchée). Lecture d'un conseil : selon Q1 (une seule fois par compte dans tous les cas, 2.5).
- **Ce qu'un cap débloque** : selon Q5 (reco : rien).
- **Affichage, spécification d'accessibilité de @ux** :
  1. **Le nom d'abord, le mot ensuite, toujours avec l'échelle** : « Tu avances bien · cap 3 sur 5 ». Jamais « cap 3 » seul (le « sur 5 » écarte la lecture « cap de boussole »). **Cinq repères en rangée** (cinq pastilles, les n premières pleines) sur leur propre ligne (à 375 px, 343 px utiles : texte et pastilles ne tiennent pas sur la même ligne). Les pastilles sont **décoratives (masquées aux lecteurs d'écran)** : le texte porte l'information, pas de double annonce. Si une barre est gardée : `role="progressbar"` avec `aria-valuetext="cap 3 sur 5"`, jamais une valeur en XP.
  2. État marqué autrement que par la couleur : pastille pleine contre contour, **le contour ayant le même contraste de 3:1 que la pastille pleine** (sinon l'état « contour » disparaît pour un daltonien ou en contraste élevé).
  3. Phrase de passage et bulle « +X XP » annoncées dans une région `aria-live` polie, **au moins 5 secondes**, fermables, sans animation en boucle.
  4. Contraste 4,5:1 (texte) et 3:1 (pastilles) ; cibles interactives de 44 px au moins ; texte agrandi à 200 % sans troncature (conteneur sans hauteur fixe).
  5. Aucun émoji, bulle comprise ; le nom du cap est du texte.
  6. **Voisinage** : la carte porte l'intitulé « Ton cap » et n'a **jamais de compteur d'étapes à côté** (« étape n sur 6 » vit sous la liste des étapes faites : deux « n sur m » voisins se liraient comme des synonymes). À vérifier au premier rendu réel de @design.
- **Phrase de passage, une seule fois** : « Nouveau cap : {nom}. » (ex. « Nouveau cap : tu enchaînes. »). Aucune promesse.
- **XP** : jamais sans échelle ni explication. Phrase vraie pour tous les comptes, y compris pour un abonné honnête qui a lu des conseils : **« 412 XP gagnés depuis ton arrivée »** (ou « voir le détail »). Si Q1 = A, « tes étapes, tes bonus et tes conseils » est vrai pour tous.
- **Place dans l'espace** : dans « Parcours », **après les étapes faites** (jamais en tête, donc distinct du calendrier « Tes 4 premières semaines » de v11 §5.4). Dans « Ton mois » une fois qu'il existe. **Écart assumé avec le brief s24 §3.2** : le bloc 4 met « XP et niveau » dans « Aujourd'hui » après les étapes faites et la série ; ici, rien dans « Aujourd'hui » (le repère neutre « 12 cartes cette semaine » y suffit). **La série « {n} jours de pratique d'affilée »** (brief §3.2 bloc 1, texte validé s17) n'est placée ni dans v11, ni dans v12, ni dans v13 : l'écart avec le brief la concerne aussi, et ce document ne la place pas (Annexe B, point 6). Pas dans la barre de rubriques. `/parcours` étant public, le cap n'est rendu que pour l'abonné connecté, côté navigateur.
- **Caps existants** : recalculés une fois, après la vérification 2.6, vers le haut seulement (aucun abonné ne perd de cap ; seuls les comptes de test de Thomas sont ramenés à leurs étapes et bonus s'il est d'accord, Q6). **Le recalcul est silencieux : ni phrase de passage ni événement « cap atteint » ; le premier affichage montre simplement le cap.** 5 valeurs en base, aucune migration pour les règles A et B ; la règle C demande un champ additif.
- **Garde-fou de test** : le dernier seuil ne dépasse pas 80 % du total d'XP de **toutes** les sources retenues ; il échoue si un parcours est dépublié (sans Storytelling : 2 300 = 100 %). Le test lit les parcours publiés (`apps/web/src/config/parcours-publication.ts` : `STORYTELLING_PUBLIE = true` l. 12, vérifié par la session le 12/11) : si l'un est dépublié, le total baisse, le test échoue et les seuils sont à recaler (sans Storytelling, total 2 300 et dernier seuil à 70 % = 1 600). Le « 18 étapes au minimum » ne vaut que si les cinq parcours sont publiés.

### 3.1 Règle A, « XP de parcours recalés » (reco)

**Si Q1 = retirer** (reco) : total 3 100, seuils **0, 100, 300, 700, 2 300** (74 %).

| Seuil | Ce qu'il garantit (sur les totaux réels) |
|---|---|
| 100 | une ou deux premières étapes |
| 300 | terminer n'importe quel parcours y fait arriver (le plus court en vaut 325) ; on peut aussi l'atteindre avant la fin d'un grand parcours |
| 700 | terminer un grand parcours (700 à 800) ou deux petits (au moins 800) y fait arriver |
| 2 300 | **trois grands parcours (800 + 800 + 700 = 2 300, 18 étapes)** y font arriver, et quatre parcours quelconques aussi (plus petite somme : 325 + 475 + 700 + 800) ; condition suffisante, pas nécessaire |

Cas : Sophie : cap 3 à la semaine 3, cap 4 pendant Boulot ; Yanis : cap 3 à la semaine 4, cap 4 pendant Confiance ; Marc : cap 4 à la fin de Confiance (semaine 6). **Le cap 5 ne s'atteint pas avant 18 étapes au minimum, quel que soit l'ordre**, pour les XP d'étapes et de bonus (un compte qui garde des XP de conseils gagnés avant la correction peut être au cap 4 ou 5 avec bien moins d'étapes : Q6, Q1 C), soit un peu plus de 4 mois à une étape par semaine.
**Preuve du « 18 au minimum »** (recompte de @reviewer sur les `moduleXp` des trois seeds ; tout reste ouvert, l'abonné valide dans l'ordre qu'il veut, et le bonus de 100 ne s'obtient qu'en terminant un parcours) : en prenant, parmi toutes les sélections de 17 étapes, celle qui rapporte le plus (Confiance, Storytelling et Répartie terminés = 16 étapes et 2 075 XP, puis la meilleure étape restante, 150), on obtient **2 225, soit moins que 2 300** ; donc 2 300 exige au moins 18 étapes. 18 suffisent (trois grands parcours, 2 300 exactement). Les cumuls des personas reposent sur les totaux par parcours. [À VÉRIFIER @fullstack : consigner ce recompte dans un test sur les seeds, qui doit échouer si un `moduleXp` change.]
**Si Q1 = A** : total 4 300, seuils **0, 100, 400, 1 000, 3 000** (70 %) [HYPOTHÈSE de calage : conseils et parcours se mélangent, plus d'ancrage unique].
**Si Q1 = C** (conseils hors cap) : le cap suit seulement les XP de parcours (étapes validées et bonus, calculables sans colonne nouvelle), seuils de « retirer » ; l'XP affiché peut inclure les conseils.

### 3.2 Règle B, « Parcours bouclés »

Le cap = nombre de parcours terminés : 0, 1, 2, 3, 5. L'XP reste un compteur visible sans rôle. Pour : sens évident. Contre : premier changement au plus tôt à la semaine 3 ; Yanis et Marc restent longtemps au cap 1 ; `calculateLevel` change de nature (`completedAt` déjà en base).

### 3.3 Règle C, « Marche de mission tentée » : **touche l'esprit de C4, accord requis**

- **Idée** : le cap = la plus haute marche de mission **tentée** (retour « Essayé, bof » ou « Essayé, ça a marché ») : marche 1 seul à voix haute, 2 à un proche par message, 3 à un pote en face, 4 en petit groupe, 5 avec quelqu'un qu'on connaît peu (v11 §2.4). Pour un introverti, le progrès est d'**avoir osé**, pas que ça ait marché. Déclarer « ça a marché » ne rapporte rien de plus que « bof » : le retour reste honnête. « Pas essayé » ne rapporte rien. Mot à l'écran : « marche 3 sur 5 » (le mot des missions, v11).
- **Pour** : le seul cap qui dise un fait vrai sur la personne (un acte dans la vraie vie) ; aucun verdict de talent ; impossible à atteindre en ouvrant des conseils ; ne baisse jamais ; l'XP de parcours reste un compteur « tes parcours » sans nom de cap. Si la marche suivante n'est proposée qu'après la réussite de la précédente, « tentée à la marche k » implique « réussie à k − 1 » [À VÉRIFIER @ux/@fullstack : l'abonné peut-il ouvrir une marche sans avoir réussi la précédente ? sinon « bof » à la marche 5 suffirait].
- **Limites, au juste poids** : (1) **déclaratif**, comme la règle A ; (2) risque Goodhart réduit, pas supprimé : on peut déclarer « Essayé, bof » sans avoir essayé, comme on peut valider une étape sans la faire ; (3) dépend du stockage des retours de mission, **déjà prévu au chantier de l'espace (v11 §7.3)** ; seul le champ du cap s'ajoute (6 états : départ + 5 marches, donc un champ additif ou une valeur de plus, accord requis) ; (4) **vitesse de départ** : le premier pas du jour 1 est un geste de marche 1 (v11 §4.1) et les fiches « Quoi répondre » portent un retour « Pas essayé / Essayé, bof / Essayé, ça a marché » : [À VÉRIFIER @ux/@fullstack] ce retour compte-t-il comme retour de mission ? Si oui, la règle C bouge dès le jour 1, aussi vite que la règle A ; sinon, un abonné qui n'ouvre aucune mission reste au départ ; (5) pression : un cap qui récompense l'exposition peut pousser à tenter avant d'être prêt ; garde-fou : jamais de « il te manque », rien d'affiché tant qu'aucune marche n'est tentée ; (6) lente : une seule mission ouverte à la fois ; (7) **touche l'esprit de C4** (entraînement hors points et série) : ni série ni points, mais une règle neuve sur l'entraînement.
- **Pourquoi je ne la recommande pas maintenant** : elle touche l'esprit d'une décision prise le jour même (P0 s8) ; la recommander le lendemain reviendrait à demander de la rouvrir. Je la garde prête : la mesure « missions tentées » est déjà prévue (v11 §7.6) ; à J60, la question se repose avec des chiffres.

### 3.4 Les noms et le mot, étalons à faire valider (séparés des règles)

**Tests de relecture à l'aveugle** : (1) lu seul, se comprend en 3 secondes ; (2) ni rang ni verdict ; (3) n'affirme pas une compétence que la règle ne mesure pas ; (4) **test de vérité : ce que dit le nom est vrai pour quelqu'un qui vient de valider l'étape qui le fait monter** ; (5) Yanis, Sophie ou Marc s'y reconnaît, **sans aucun accord de genre ni de nombre sur l'abonné** (rien au masculin seul : « parti », « lancé » excluraient Sophie). Aucun mot de scène (v11 §3.5) ; le cap 1 ne dit rien de passif. **Contrôle de tous les noms et libellés de chaque jeu** : verbes au présent ou à l'infinitif sans participe accordé (« Tu t'échauffes », « Tu avances bien »), noms et locutions (« en route », « en bonne voie ») ; « Tu as fait un bon bout » et « Tu as fait la plus grande part » (avoir : participe invariable) ; les noms de E3 décrivent l'autre personne de façon générique (« un proche », « quelqu'un de nouveau »), pas l'abonné.

| Cap | Seuil (règle A) | E1, « Où tu en es » (base @ux) | E2, « Position » | E3, marches (règle C) |
|---|---|---|---|---|
| 1 | 0 | Tu t'échauffes | Tu démarres | À voix haute |
| 2 | 100 | Tu te lances | Tu es en route | Avec un proche |
| 3 | 300 | **Tu avances bien** | Tu es en bonne voie | En face |
| 4 | 700 | Tu enchaînes | Tu as fait un bon bout | En groupe |
| 5 | 2 300 | Tu connais la maison | Tu as fait la plus grande part | Avec quelqu'un de nouveau |

**Test de vérité (4), passé par le rédacteur, à refaire à l'aveugle** :
- E1 : cap 1 vrai ; 2 vrai (une ou deux étapes validées) ; 3 « Tu avances bien » vrai dès les premières validations, sans promettre une durée ni accord de genre ; 4 vrai (plusieurs étapes validées) ; 5 « Tu connais la maison » vrai : 2 300 XP demandent **au moins 18 étapes sur 25 (72 %), quel que soit l'ordre, pour les XP d'étapes et de bonus** (preuve en 3.1 ; un compte qui garde des XP de conseils d'avant la correction peut être plus haut, Q6 ; le « 18 au minimum » ne vaut que si les cinq parcours sont publiés). À vérifier à l'aveugle que « Tu te lances » (cap 2) et « Tu avances bien » (cap 3) ne se lisent pas comme un doublon. **Témoins non retenus** : « Tu es bien parti » (masculin seul), « Tu as pris ton rythme » (faux pour qui valide quatre étapes le même jour) ; « Tu rebondis, Tu places tes vannes, Tu tiens la conversation » (affirment une compétence).
- E2 : 1 à 3 vrais (« Tu es en bonne voie » vrai dès les premières étapes) ; 4 vrai pour un grand parcours bouclé (700 sur 3 100 : « un bon bout », pas « loin ») ; 5 vrai (74 % du total) **seulement si Q1 = B** (avec les conseils comptés, faux).
- E3 : chaque nom dit ce qu'on a tenté, vrai par construction ; n'a de sens qu'avec la règle C.
- **Portée du test de vérité** : il vaut pour un compte qui progresse par les étapes ; il ne vaut pas pour les comptes gonflés avant la correction, décision assumée (2.6).

**Le mot : « cap », « palier », ou aucun mot** (test des 3 secondes de @ux sur l'écran 375 px, raisonné, sans lecteurs réels : à confirmer sur l'écran réel par Thomas et un proche de Yanis) :

| Critère | cap (libre) | palier (conflit) |
|---|---|---|
| Lu seul, 3 secondes | « cap 3 » peut se lire « cap de boussole » ou « franchir un cap » ; le « sur 5 » rattrape à moitié | « 3 sur 5 » indique une place sur une échelle ; **gagne le test** |
| Contresens | cap = direction, pas une position | « palier » dit aussi **plateau** (« je suis sur un palier » = je stagne) ; seul le « sur 5 » l'écarte |
| Phrase de passage | « Nouveau cap : … » 27 caractères, naturel | « Nouveau palier : … » 31 caractères, naturel |
| **Collision avec un texte en ligne** | **aucune** | **article sur la timidité** : « Chaque palier est un niveau à débloquer » (l. 2466), « palier 1 : envoie une vanne par message à un seul ami » (l. 2529) = l'échelle des marches de mission ; « palier par palier » (l. 215, 2499) pour les parcours. Contredit Q5 A (un palier ne débloque rien) |
| Voisinage à l'écran | rien | proche de « étape n sur 6 » et de « marche » (escalier) |

**Reco : « cap »**, toujours écrit « cap 3 sur 5 » avec le nom avant. Raisons : « palier » gagne le test de lecture, mais il est déjà dans un article public avec un sens contraire à notre Q5 A (« un niveau à débloquer ») et un autre sens pour l'échelle d'exposition, donc il recréerait la confusion qu'on cherche à lever (le même défaut que « niveau ») ; son contresens « plateau » ne se corrige que par le « sur 5 », comme la lecture « boussole » de « cap ». Le défaut de « cap » (lecture « boussole ») se corrige par les mêmes deux conditions (« sur 5 », nom en premier) sans toucher à aucun texte. Je ne propose **pas** de modifier l'article. Si Thomas préfère « palier », il l'emploie en sachant ce conflit.
**Troisième option, sans mot** (proposée par @ux) : l'intitulé « Où tu en es », puis « Tu avances bien · 3 sur 5 » ; texte lu par un lecteur d'écran « Où tu en es : Tu avances bien, 3 sur 5 » ; l'intitulé « Où tu en es » est toujours au-dessus et jamais adjacent à « étape n sur 6 » ; phrase de passage « Nouveau : tu enchaînes. ». Aucun mot à choisir ni à défendre, aucune collision, aucun contresens ; elle se lit en 3 secondes. Contre : « 3 sur 5 » sans nom commun est moins parlant pour qui entend le dire (« je suis au cap 3 ») et l'intitulé « Où tu en es » est long à 375 px (à tester) ; les critères 6 et 7 s'écrivent « {mot} n sur 5 » (ou « n sur 5 » seul pour cette option). La règle C emploie « marche » (v11), pas « palier ». « Repère » est écarté (ne dit pas qu'on a avancé ; « repère neutre » décrit déjà le compteur de cartes). « Niveau » est écarté (difficulté des parcours et des conseils).

### 3.5 Reco

**Q1 = retirer, règle A (0, 100, 300, 700, 2 300), noms E1 (« Tu t'échauffes, Tu te lances, Tu avances bien, Tu enchaînes, Tu connais la maison »), mot « cap » (libre, vérifié), rien de débloqué ; Q6 : ne toucher à aucun abonné, ramener à leurs étapes et bonus seulement les comptes de test de Thomas.**
- **La raison de la règle A** : elle respecte la lettre et l'esprit de C4, décidée le 12/11 (aucune nouvelle règle de points ni de série pour l'entraînement et les fiches). La règle C, qui s'appuie sur l'entraînement, demande de rouvrir l'esprit d'une décision du jour même (P0 s8) ; elle reste prête, à reposer à J60 avec la mesure des missions tentées. Je ne retiens **pas** d'argument d'adoption : le premier pas est déjà un geste de marche 1 avec retour (3.3, limite 4), donc la règle C pourrait bouger dès le jour 1.
- Les autres raisons : une seule voie d'XP, bornée, donc un cap fiable ; aucun chantier de plus que la correction 2.5.
- **Supprimer l'échelle** a été examiné et écarté : le positionnement promet « XP, streak, niveaux ».

### 3.6 Critères de réussite (binaires)

1. Aucun montant d'XP n'est choisi par le navigateur ; le serveur refuse tout identifiant qui n'est pas celui d'un conseil actif ; un même conseil ne rapporte jamais deux fois à un même compte, **garanti par une contrainte d'unicité en base** (correction 2.5, au développement avant l'ouverture, avant la réponse à Q1) ; **test avec 130 identifiants dont 10 invalides, des requêtes simultanées et le rejeu du même identifiant : un compte ne gagne jamais plus de 10 × (nombre de conseils actifs) par ce canal** ; si Q1 = B, plus aucun conseil ne rapporte d'XP et la route est supprimée.
2. Seuils croissants ; le dernier est inférieur ou égal à 80 % du total d'XP de toutes les sources retenues (test automatique, échoue si un parcours est dépublié).
3. Le cap d'un abonné ne diminue jamais ; seuls les comptes de test de Thomas peuvent être ramenés à la somme de leurs étapes validées et bonus acquis (zéro seulement s'ils n'en ont aucune), avec son accord (Q6).
4. Sur la carte du cap : aucun émoji, tiret cadratin, pourcentage ni « XP restants ». (Les textes validés « X XP gagnés sur N, bonus de fin compris » des parcours restent.)
5. Les seuils n'existent qu'à un seul endroit du code.
6. Le mot « niveau » ne désigne plus l'échelle d'XP à l'écran ; le cap s'écrit toujours « cap n sur 5 » avec le nom avant.
7. Cinq repères masqués aux lecteurs d'écran avec le texte « cap 3 sur 5 » (ou « Où tu en es : … 3 sur 5 » pour l'option sans mot), état hors couleur avec contour à 3:1, `aria-live` poli, 5 secondes au moins, contrastes 4,5:1 et 3:1, cibles de 44 px, aucun compteur d'étapes à côté.
8. La réponse à « Tu avais une réponse ? » n'alimente ni XP ni cap (test).
9. Aucun contenu, page ou fonction n'est ouvert ou fermé selon le cap (revue de `user.level` dans `apps/`).
10. Événement « cap atteint » sans identifiant, avec le seul numéro de cap (jamais émis par le recalcul unique) ; lecture soumise à l'effectif minimal de v11 §7.6.
11. La phrase d'XP affichée est vraie pour tout compte (« gagnés depuis ton arrivée »), y compris celui d'un abonné honnête qui a lu des conseils.
12. Chaque nom et chaque libellé de la carte passe les cinq tests de 3.4 à l'aveugle (dont l'absence d'accord de genre).

## 4. Questions pour Thomas

Six questions, trois options chacune, une reco argumentée. Q1 en premier : elle fixe le total d'XP, donc tous les seuils.

**Déjà décidé, non reposé** : C4 (12/11) ; XP d'étape et bonus de fin inchangés (étalons s17) ; série sur la pratique (07/10) ; pas de certificat (07/10) ; tout reste ouvert (18/10, 19/10) ; la cloche sans relance (décision du 12/11) ; FAQ « 50 XP par semaine » intacte (29/09). **Tranché sans question** : la correction du défaut (2.5, au développement avant l'ouverture : gain fixé par le serveur, conseil inexistant refusé, un conseil une seule fois par compte, garanti en base) ; recalcul unique des caps vers le haut ; aucun e-mail ni notification liés aux caps ; aucun émoji ; seuils à un seul endroit du code.

**Q1. Les 10 points gagnés en ouvrant un conseil : on les garde ?** Ta décision du 12/11 sur les points a été prise avant que nous voyions que lire un conseil en rapporte déjà. (Après la correction, ils ne rapportent qu'une fois par conseil.)
- A. Garder, une fois par conseil : au plus 1 200 XP pour les 120 conseils actuels, plus si le stock grandit. Total 4 300, seuils 0, 100, 400, 1 000, 3 000.
- B. **Reco** : retirer pour l'avenir (les XP déjà gagnés restent). Total 3 100, seuils lisibles (trois grands parcours ou quatre parcours pour le dernier). Raisons : lire n'est pas pratiquer (1 200 XP, 39 % du total des parcours, seraient gagnés en ouvrant des fiches) ; le conseil d'une étape ne rapporte déjà rien à part (il est compris dans l'XP de l'étape), donc seule la liste du catalogue paierait la lecture ; le stock de conseils bouge, donc les seuils dériveraient ; c'est l'esprit de C4. Coût : retire une règle de points qui existe déjà (date de sa pose non lue) ; la bulle « +10 XP » disparaît de la liste des conseils ; **la phrase en ligne de la page des conseils (« … avec des exercices concrets et des XP ») est à retoucher, avec ton go** ; le compteur « Conseils terminés » reste.
- C. Garder l'XP affiché mais hors du cap : le cap ne suit que les parcours (deux chiffres à l'écran, plus complexe).

**Q2. Comment passe-t-on d'un cap au suivant ?** (la règle, sans les noms)
- A. **Reco** : selon les XP, seuils recalés (3.1). Elle respecte la lettre et l'esprit de ta décision C4 du 12/11.
- B. Selon le nombre de parcours terminés : 0, 1, 2, 3, 5 (3.2).
- C. Selon la plus haute marche de mission **tentée** (3.3). **Touche l'esprit de ta décision du 12/11 (C4)** : ni série ni points, mais une règle neuve sur l'entraînement. Seule option où le cap dit un acte réel. À reposer à J60 avec la mesure des missions tentées.

**Q3. Les noms, et le mot.**
- Noms (sans aucun accord de genre) : A. **Reco** E1 (« Tu t'échauffes, Tu te lances, Tu avances bien, Tu enchaînes, Tu connais la maison »). B. E2 (« Tu démarres, Tu es en route, Tu es en bonne voie, Tu as fait un bon bout, Tu as fait la plus grande part » : 72 % des étapes, « presque tout » aurait dépassé le fait). C. E3, les marches (« À voix haute » à « Avec quelqu'un de nouveau »), seulement avec la règle C (mot « marche »).
- Mot, trois options : A. **« cap »** (reco : libre dans tous les textes client, vérifié ; toujours « cap 3 sur 5 », nom avant) ; B. **« palier »** (gagne le test de lecture, mais déjà employé dans un article public sur la timidité avec un sens proche des marches de mission, dont « Chaque palier est un niveau à débloquer » qui contredit « un cap ne débloque rien » ; je ne touche pas à l'article) ; C. **aucun mot** : « Où tu en es · Tu avances bien · 3 sur 5 » (aucune collision, un peu moins parlant à l'oral). « Niveau » déconseillé (difficulté des parcours et des conseils).
Tu peux changer un seul nom. Chaque texte touché (1.4) te revient pour un go.

**Q4. À quelle distance mettre le dernier cap ?** (règles A et B ; **seuils pour Q1 = B** ; si tu gardes les conseils, l'option A devient 0, 100, 400, 1 000, 3 000 et les options B et C se recalculent sur 4 300)
- A. **Reco** : environ trois grands parcours ou quatre parcours (au moins 18 étapes, un peu plus de 4 mois au rythme conseillé). Seuils 0, 100, 300, 700, 2 300.
- B. Environ trois mois (deux grands parcours) : plus vite fêté, plus rien à gagner ensuite côté cap. Seuils 0, 100, 300, 700, 1 600 (52 % du total).
- C. Tout le site : seuils 0, 100, 500, 1 500, 3 100 [HYPOTHÈSE de calage]. Un parcours dépublié le rend inatteignable, et il **fait échouer le test de 80 %** (critère 2) : à n'envisager que si tu acceptes de l'assouplir.

**Q5. Un cap débloque-t-il quelque chose ?**
- A. **Reco** : rien, c'est un repère.
- B. Au passage, une phrase de l'équipe propose une fiche à faire ensuite, rien de bloqué (une phrase par cap, relue à l'aveugle).
- C. Un contenu bonus par cap : **rouvre en partie ta décision du 18/10** (un contenu serait derrière un cap).

**Q6. Que faire des points gagnés avant la livraison de la correction ?** La base ne garde que le total : on ne peut pas distinguer un abonné qui a utilisé l'API à la main d'un abonné honnête qui a rouvert des conseils (la règle actuelle repaie à chaque visite, jusqu'à la livraison de la correction). Avec A ou B, un abonné qui a lu beaucoup de conseils peut afficher un cap élevé sans les étapes correspondantes ; Q1 C (cap sur les seuls XP de parcours) l'éviterait. Un cap ne débloque rien et n'est vu de personne d'autre.
- A. Ne toucher à rien : tous les caps se recalculent sur l'XP actuel (ils peuvent monter, jamais baisser).
- B. **Reco** : ne toucher à **aucun abonné**, ramener à la somme de leurs étapes validées et bonus (zéro seulement s'ils n'en ont aucune) **seulement tes comptes de test** (les 3 comptes de ta variable de production). **C'est la seule exception à « le cap ne baisse jamais », et elle ne concerne aucun abonné.** Raison : un abonné qui aurait gonflé ses points ne trompe que son propre écran ; avec 4 abonnés actifs, décider compte par compte n'apporte rien et risque de pénaliser à tort un abonné payant.
- C. Faire d'abord une liste des comptes à l'écart inhabituel (total qui n'est pas un multiple de 5 : un **indice**, pas une preuve, car un ancien barème a pu exister ; vérification de l'historique avant de te la montrer) et décider compte par compte : plus lourd, risque d'injustice.

## 5. À traiter après ta réponse

- **@fullstack / @infrastructure** : **correction 2.5 au développement, avant l'ouverture**, sans attendre les réponses (identifiant de conseil actif exigé, unicité par contrainte en base, test à 130 identifiants) ; vérification de 2.6 ; remise à niveau des comptes de test si Q6 = B ; état des interrupteurs de parcours ; test consignant le recompte « 18 étapes au minimum » sur les seeds ; centraliser les seuils ; recalcul unique ; test de garde ; remplacer `progression-levels.md`. Aucun fichier de `apps/` n'a été modifié par cette session.
- **@ux** : spécification 3.0, place dans « Parcours » et « Ton mois », test des 3 secondes sur l'écran réel, test de vérité des noms à l'aveugle.
- **@legal** : rien (aucune donnée nouvelle) ; sauf règle C (retours de mission stockés, v11 §7.2).
- **@data-analyst** : événement « cap atteint » sans identifiant.

## Annexe A. Tour 3 : traitement

| Source | N° | Traitement dans la v4 |
|---|---|---|
| @elon | Y1 (reco justifiée par C4, adoption) | 3.5 : C4 en tête, argument d'adoption retiré ; 3.3 limite (4) remplacée par le [À VÉRIFIER] sur le retour de marche 1 ; Q2 A et C réécrits |
| @elon | Y2 (palier 3 de E1) | E1 : « Tu es bien parti » ; « Tu as pris ton rythme » en témoin (3.4, Q3) |
| @reviewer | A1 (« palier » pas libre, bloquant) | 1.4 faits sur les mots ; 3.4 tableau cap contre palier, reco « cap » argumentée ; Q3 ; option « palier pour la règle C » ; article non touché |
| @reviewer | A2 (audit ne distingue pas la triche) | 2.6 : limite dite (base = total seul), indice « non multiple de 5 », « écart inhabituel » ; Q6 : reco = ne rien baisser sauf comptes de test et triche prouvée |
| @reviewer | A3 (deux « Q6 ») | une seule Q6 ; la cloche est « la décision du 12/11 » (2.4, « Déjà décidé ») |
| @reviewer | A4 (série dans la v12) | 3.0 : fait écrit (série placée ni en v11 ni en v12, brief §3.2 bloc 1) ; Annexe B point 6 |
| @ux | 1 (nom du cap 3 et preuve du cap 5, bloquant) | E1 cap 3 ; 3.1 et 3.4 : 2 300 XP = trois grands parcours, 18 étapes, quatre parcours quelconques suffisent ; « 19 semaines » devenu « environ 18 étapes » ; Q4 A ; cumuls des personas revérifiés (325, 1 025 ; 475, 1 275 ; 800, 1 600) |
| @ux | 2 (phrase XP et critère 11, bloquant) | 3.0 : « 412 XP gagnés depuis ton arrivée » ; critère 11 réécrit ; « irrégulier » devenu « écart inhabituel » (2.4, 2.6, Q6) |
| @ux | 3 (faille avant Q1, bloquant) | 2.5 : gain serveur ET un conseil une seule fois par compte, tout de suite ; résumé ; critère 1 ; 1.1 vitesse |
| @ux | 4 ([À VÉRIFIER] devenu un fait) | 1.4 : faits sur « cap » et « palier » |
| @ux | 5 (Q4 sans seuils) | Q4 : seuils de chaque option, 52 % pour B, hypothèse pour C |
| @ux | 6 (C4 dite en clair) | Q1 : phrase de tête ; résumé |
| @ux | 7 (série et brief) | 3.0 et Annexe B point 6 |
| @ux | 8 (contour et contraste) | 3.0 point 2 ; critère 7 |
| @ux | (test 3 secondes : voisinage, nom d'abord) | 3.0 points 1 et 6 : nom d'abord, « sur 5 » toujours, intitulé « Ton cap », pas de compteur d'étapes à côté |

(Les rangées du tour 3 citent les noms de la v4 ; « Tu es bien parti » est remplacé en v5, voir le tour 4, et la reco Q6 de la v4 (« triche prouvée ») est remplacée en v5 par l'indice et la reco B. Tours 1 et 2 : traités dans les versions précédentes, restés acquis.)

## Annexe A bis. Tour 4 : traitement

| Source | N° | Traitement dans la v5 |
|---|---|---|
| @elon | Z1 (« prouve » trop fort) | « indice » partout : 2.6, Q6 ; anciens barèmes possibles cités (+2 blague, +5 connexion, `joke_read` dans les tests, `moduleXp = 20`) ; vérification de l'historique avant toute liste |
| @elon | Z2 (supprimer l'audit par compte) | 2.6 réécrite ; Q6 : reco B = aucun abonné touché, remise à zéro des seuls comptes de test ; audit gardé comme vérification de la correction 2.5 ; option C = liste |
| @reviewer | C1 (« preuve ») | idem Z1 |
| @reviewer | C2 (« Dès maintenant ») | résumé et 2.5 : « rien n'est livré aujourd'hui », « au développement, avant l'ouverture », « dès que la correction est livrée » |
| @reviewer | C3 (recompte à lever) | 3.1 : preuve du « 18 au minimum » (17 étapes plafonnent à 2 225), test de consignation demandé à @fullstack |
| @ux | N1 (nom au masculin, bloquant) | E1 « Tu avances bien », E2 « Tu es en bonne voie » ; test (5) « aucun accord de genre ou de nombre » ; tous les noms et libellés de chaque jeu contrôlés (3.4) |
| @ux | N2 (identifiant de conseil actif, bloquant) | 2.5 points 2, 3, 4 : refus d'un identifiant inactif, contrainte d'unicité en base, plafond 10 × conseils actifs, pas « ce qui a été lu » ; 1.1 ; critère 1 (test à 130 identifiants) |
| @ux | N3 (anti-doublon non sourcé) | 2.5 et résumé : [HYPOTHÈSE], et dit à Thomas que l'unicité ne lui a pas été soumise |
| @ux | N4 (« prouvé ») | comme Z1 |
| @ux | N5 (« 18 étapes » non établi) | 3.1 preuve ; 3.4 test de vérité du cap 5 : « au moins 18 étapes, quel que soit l'ordre » |
| @ux | N6 (« cap » libre, option sans mot) | 1.4 et résumé : fait vérifié mot entier ; Q3 : option C sans mot ; 3.4 |
| @ux | N7 (v13) | Annexe B mise à jour sur la v13 |
| @ux | N8 (option intermédiaire « palier pour C ») | retirée : la règle C dit « marche » (3.3, 3.4, Q3) |
| @ux | N9 (Q4 C fait échouer le critère 2) | Q4 C : « fait échouer le test de 80 % : à n'envisager que si tu acceptes de l'assouplir » |

## Annexe A ter. Tour 5 : traitement

| Source | N° | Traitement dans la v6 |
|---|---|---|
| @reviewer | D1 (« règle d'hier ») | Q6 (titre et texte) et 2.6 : « la règle actuelle repaie à chaque visite, jusqu'à la livraison de la correction » |
| @reviewer | D2 (« 18 étapes environ ») | Q4 A : « au moins 18 étapes » |
| @reviewer | D3 (« quel que soit l'ordre » : XP de parcours seulement) | 3.1 et 3.4 : réserve écrite ; Q6 : risque d'un cap élevé sans étapes, renvoi à Q1 C |
| @reviewer | D4 (« triche prouvée » en annexe) | note de l'annexe A |
| @ux | M1 (comptes de test) | « ramener à la somme des étapes validées et bonus » (zéro seulement s'il n'y en a aucune) : résumé, 2.4, 2.6, 3.0, 3.5, critère 3, Q6, section 5 |
| @ux | M2 (« écart nul ») | phrase supprimée en 3.0 |
| @ux | M3 (recalcul unique) | 3.0 : recalcul silencieux, sans phrase de passage ni événement ; critère 10 ; 3.4 : portée du test de vérité |
| @ux | M4 (Storytelling) | 1.1 et 3.0 : `STORYTELLING_PUBLIE = true` (l. 12), le test lit les parcours publiés, variante si dépublié, « 18 au minimum » valable pour cinq parcours publiés |
| @ux | M5, M6, M7 (précisions) | texte lu de l'option sans mot ; correction 2.5 livrée seule et en premier, test de rejeu, « au catalogue » ; E2 cap 5 « Tu as fait la plus grande part » (72 %) |

## Annexe B. À porter dans l'architecture (courante : v13, puis v14)

1. **v13 §1.1, ligne « XP, niveaux, série (code) » (l. 146)** : la phrase « le conseil du jour d'« Aujourd'hui », la fiche 1.1 de chaque étape et la Bibliothèque entrent dans ce cas » est **fausse** : **ni le conseil du jour ni le conseil d'une étape ne rapportent d'XP ; seule la liste du catalogue des conseils en rapporte** (`components/conseils/conseils-list.tsx`, utilisé par `app/(dashboard)/conseils/page.tsx` seulement). La remplacer par : « 10 XP par conseil ouvert (`conseils-list.tsx` l. 175 à 178), anti-doublon en mémoire de page seulement ; `POST /api/user/xp` accepte un montant choisi par le navigateur (1 à 500, 30 appels par minute), ne garde que le total ; seul appelant : la liste du catalogue des conseils (le conseil du jour et la fiche conseil d'une étape ne donnent pas d'XP) ».
2. **§1.1, ligne `progression-levels.md` « OBSOLÈTE (gains absents du code) »** : nuancer (le gain « +10 par conseil » existe).
3. **C4** : la phrase « les points viennent des étapes et du bonus de fin » est incomplète. La décision reste valide mais a été prise sans savoir que lire un conseil rapporte des points : le dire à Thomas (Q1).
4. **Chantier de développement** : ajouter la correction 2.5 (gain fixé par le serveur, identifiant de conseil actif exigé, un conseil une seule fois par compte avec contrainte d'unicité en base, table additive) et la vérification 2.6.
5. **§5.2** : le conseil de chaque étape (fiche 1.1) ne rapporte pas d'XP à part (déjà dans l'XP de l'étape).
6. **Série** : le brief §3.2 bloc 1 place dans « Aujourd'hui » la série « {n} jours de pratique d'affilée » (texte validé s17) ; ni la v11, ni la v12, ni la v13 ne la placent (§4.4 n'a que le repère neutre « 12 cartes cette semaine »). **L'architecture doit placer la série (à demander à la v14).**

