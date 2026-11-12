# Niveaux et XP de l'espace Premium (s24), v9

> **v9**, @product-manager, 12/11/2026 : après le tour 8 sur la section 5 (@elon 9,8, @reviewer 9,4, @ux 8,7 avec un bloquant de formulation, traité). Thomas a répondu le 12/11 (`founder-preferences.md`, dernière ligne, fait foi) : section 4 « Décisions de Thomas », section 5 « contenu débloqué par cap » (réponse Q5 : « ben du contenu non ? »). Remplace la v8. La section 5 repasse un contrôle à l'aveugle (@reviewer, @ux, @elon) jusqu'à 10/10 avant d'être montrée à Thomas. Annexes A à A sexies : traitement des tours. Annexe B : correctifs à porter dans l'architecture (courante : v16, v17 en cours).
> Conventions : [À VÉRIFIER] = fait non lu ; [HYPOTHÈSE] = choix de travail. Aucun chiffre d'usage n'est inventé (4 abonnés actifs au 02/11). Noms et libellés proposés : ni tiret cadratin ni émoji.
> **Vocabulaire** : trois choses se disent déjà « niveau » : la difficulté d'un parcours (débutant, intermédiaire : C7), le filtre de difficulté des conseils, et l'échelle d'XP traitée ici. Pour ne pas les confondre, **ce document appelle l'échelle d'XP un « cap »** (« cap 3 sur 5 »). « Cap » est vérifié libre, mot entier, dans tous les textes client de `apps/web/src` (il n'y apparaît que dans des commentaires ou noms internes comme « frequency cap » et « hard cap »). « Palier » est écarté (conflit avec un article public, 1.4). Le code garde `level` en interne.

## Résumé pour Thomas (sans jargon)

- **Tes décisions du 12/11** (section 4) : les 10 points par conseil lu sont retirés pour l'avenir ; le cap suit les points (0, 100, 300, 700, 2 300) ; noms « Tu t'échauffes, Tu te lances, Tu avances bien, Tu enchaînes, Tu connais la maison » et mot « cap » ; dernier cap à environ 4 mois (au moins 18 étapes) ; seuls tes comptes de test sont ramenés à leurs étapes validées et bonus ; **un cap débloque du contenu bonus**.
- **Le fait qui a changé le diagnostic** : aujourd'hui, n'importe quel abonné peut s'attribuer des points à la main, et ouvrir un conseil dans la liste du catalogue rapporte 10 points à chaque rechargement. La correction (le site fixe les points, un conseil ne rapporte qu'une fois) est livrée seule et en premier, **elle n'est pas encore livrée**. Rien de ce que le cap débloque ne doit dépendre de cette faille (section 5).
- **Contenu débloqué (section 5)** : règle intangible, un cap ajoute un bonus et ne retire, ne retarde ni ne verrouille rien de ce qui existe ou que l'offre promet. « Premium ouvre tout Deviens Marrant » reste honnête, parce que le bonus s'ajoute à tout ; la phrase proposée : « …Et à chaque cap franchi dans les parcours, un bonus en plus. » Quatre natures de bonus proposées ; reco : le décorticage exclusif d'un passage d'humoriste aux caps 2 à 4 et les coulisses de la maison au cap 5.
- **Ce que les bonus ne suivent pas** : les bonus suivent tes étapes de parcours, pas la rafale ni les jeux (ta décision C4). Un abonné qui ne fait que la rafale n'en ouvre aucun et ne voit jamais « Tes bonus » ; c'est assumé, et à reposer à J60 si tu le souhaites.
- **Quatre questions pour toi** (section 5.6) : la nature du bonus, la phrase de l'offre, l'affichage des bonus, et le cap affiché contre le cap qui ouvre les bonus.
- **Jamais, dans aucune option** : la réponse à « Tu avais une réponse ? » ne rapporte ni points ni cap ; pas de classement, pas de relance, pas de certificat ; aucun contenu existant ou promis verrouillé ; le cap d'un abonné ne baisse pas (seuls tes comptes de test, Q6).
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
- **Totaux des parcours** (somme des `moduleXp` des trois seeds) : Machine à Café 325 (3 étapes), Répartie 475 (4), Confiance 800 (6), Storytelling 800 (6), Boulot 700 (6) = **3 100 XP** (2 600 d'étapes + 500 de bonus), 25 étapes. Si l'un des deux était dépublié, le total tomberait à 2 300 (sans Storytelling) ou 2 400 (sans Boulot). Les deux sont publiés : `STORYTELLING_PUBLIE = true` (`apps/web/src/config/parcours-publication.ts` l. 12) et `BOULOT_PUBLIE = true` (même fichier, l. 25), vérifiés par la session ; à relire au jour du déploiement.
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
| **« Progresse semaine après semaine avec des exercices concrets et des XP. »** | `app/(dashboard)/conseils/page.tsx` l. 161, **texte en ligne** | **Q1 (décision : retirer)** : la phrase devient en partie fausse, à retoucher | **oui, ton go** |
| Bulle « +X XP » (avec émoji) | `components/ui/xp-notification.tsx` | accessibilité (3.0) ; disparaît pour les conseils si Q1 = B | oui pour l'émoji retiré |
| « Garde tes XP et ton parcours » | `components/mobile/OnboardingFlow.tsx` l. 216 à 218 | aucune option | non |

**Inchangés** par toutes les options (le mot « XP » reste) : FAQ « Nos membres gagnent en moyenne 50 XP par semaine » (`lib/faqs.ts` l. 21, **gardée par Thomas le 29/09 : on ne la touche pas sans son go**, ce document ne s'en sert pas comme donnée) ; accueil (`page.tsx` l. 105 et 122) ; `a-propos/page.tsx` l. 135 ; `parcours/(liste)/page.tsx` l. 80 ; `videos/page.tsx` l. 64 ; `lib/llms-content.ts` l. 83 ; `lib/blog-articles.ts` l. 1917 ; `config/textes/entrees-parcours.ts` l. 61 ; `confidentialite/page.tsx` l. 97 (« XP, niveau, série » : nom de donnée) ; « X XP gagnés sur N, bonus de fin compris » et « +X gagnés ! » (`config/textes/parcours.ts`, validés, XP et bonus intouchables) ; filtre « niveaux » des conseils et difficulté des parcours (autres sens du mot).
**Faits sur les mots candidats** (@reviewer, tour 3) :
- **« cap » : libre, mot entier, dans tous les textes client de `apps/web/src`** (vérifié par la session, puis par @reviewer dans `config/`, `components/`, les pages, `lib/blog-articles.ts`, `lib/faqs.ts`, `lib/llms-content.ts`, `data/`). Il n'y apparaît que dans des commentaires ou des noms internes (« frequency cap », « hard cap »). Réserve de @ux : « franchir un cap » est une tournure courante ; une occurrence au sens « seuil » ne ferait pas collision, « garder le cap » (direction) pourrait : aucune n'existe.
- **« palier » : employé dans des textes en ligne, dans deux sens qui heurtent la proposition.** (a) Échelle d'exposition, article sur la timidité (`lib/blog-articles.ts`) : l. 2455 « Clé 5 : La progression par paliers, du petit groupe au grand groupe », l. 2466 « **Chaque palier est un niveau à débloquer** », l. 2472 « Le palier 1, c'est maintenant », l. 2529 « Commence par le palier 1 : envoie une vanne par message à un seul ami de confiance » : c'est l'échelle des marches de mission. (b) Progression des parcours, l. 215 et 2499 : « palier par palier ». « Chaque palier est un niveau à débloquer » prête en plus à confusion avec le cap qui, lui, débloque des bonus (section 5). Sens courant sans collision ailleurs (`joke-decryptages.json`, `hebdo-premium.json` l. 91, `anatomie-vanne/page.tsx` l. 84).
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
- Le cap est **déclaratif** (valider une étape est un clic) : il mesure une activité, pas une compétence. Comme il débloque du contenu bonus (section 5), sa base de calcul doit être non falsifiable (5.5).

### 2.4 Les risques

| Risque | Où | Garde-fou |
|---|---|---|
| Gain en boucle, cap sans valeur | API qui prend un montant du navigateur ; conseil repayé ; identifiants inventés | Correction 2.5, au développement avant l'ouverture, sans attendre Q1 |
| XP déjà gagnés par la faille, comptes de test | API libre, rechargements, tests de Thomas | Aucun abonné touché par défaut ; comptes de test ramenés à leurs étapes et bonus (Q6) ; vérification de 2.6 |
| Pression, « il me manque 340 XP » | Barre avec pourcentage | Cinq repères, ni pourcentage ni XP restants |
| Culpabilité | Cap qui baisse, série à zéro | Cap d'un abonné jamais en baisse (seule exception : comptes de test de Thomas, Q6) ; phrase de série inchangée |
| Verdict de talent | Noms « Comique », « Tu rebondis » | Noms de chemin + test de vérité (3.4) |
| Certificat déguisé | Dernier cap vécu comme un diplôme | 07/10 : aucun visuel de diplôme ni page partageable |
| Verrou caché, promesse « tout » fausse | Cap qui ouvre du contenu bonus (décision Q5 du 12/11) | Règle intangible : un bonus s'ajoute, rien d'existant ni de promis n'est retiré, retardé ni verrouillé ; formulation de l'offre (5.2) |
| Bonus gagné par la faille | Cap calculé sur un total d'XP falsifié | Cap de déblocage calculé sur étapes validées et bonus de fin (5.5) ; correction 2.5 livrée d'abord |
| Pression sociale, relance | Classement ; notification « tu es presque au cap » | Aucun classement ; la décision de la cloche du 12/11 la réserve aux contenus et aux réponses de l'équipe |
| Confusion de vocabulaire | Trois « niveaux » ; « palier » déjà dans un article | Mot « cap » (décision Q3) |
| Rouvrir un choix documenté | Toucher XP d'étape, bonus, série, C4 | P0 s8 : rien n'est modifié ; seule la règle du 18/10 est rouverte en partie, avec l'accord écrit de Thomas (Q5) |

### 2.5 Correction du défaut, au développement avant l'ouverture (hors décision de Thomas)

**Rien n'est livré aujourd'hui** : la boucle existe toujours. La correction ferme une route et n'a aucun lien avec l'ouverture de l'espace : **elle est livrée seule et en premier** (chaque semaine d'attente laisse la boucle ouverte aux abonnés actuels, peu nombreux mais réels). C'est la correction d'un défaut, pas un changement de règle choisie : la liste des conseils évite déjà de repayer un conseil tant que la page reste ouverte (`completedTipIds`) ; je suppose que c'est la règle voulue, faute de commentaire ou de décision citée [HYPOTHÈSE], et je le dis à Thomas dans le résumé (l'unicité par compte ne lui a pas été soumise). La correction part au chantier de développement (v11 §7.2), **sans attendre la réponse à Q1** :
1. **Le serveur fixe le gain selon l'action** ; la route n'accepte plus de montant du navigateur. Actions et montants : étape (XP du seed) et bonus de fin (100), déjà calculés côté serveur ; « conseil lu » (10).
2. **Le serveur refuse tout identifiant qui n'est pas celui d'un conseil actif.** Sans cette vérification, mille identifiants inventés (30 appels par minute) créeraient mille gains de 10 XP : « une fois par conseil » ne serait plus un plafond.
3. **Un conseil ne rapporte qu'une seule fois par compte, garanti par la base** : une ligne par abonné et par conseil (table additive) avec une **contrainte d'unicité en base**, pas seulement un test dans le code (deux requêtes simultanées sur le même conseil ne doivent pas payer deux fois). Règle visible : un conseil relu ne repaie plus. Sans les points 2 et 3, le montant fixe laisserait 300 XP par minute possibles (30 appels de 10).
4. **Plafond, pas lecture prouvée** : le serveur ne sait pas si l'abonné a réellement ouvert le conseil ; le maximum par ce canal est 10 × le nombre de conseils actifs (1 200 aujourd'hui).
5. **Q1 retenue (retirer)** : l'action « conseil lu » est retirée du barème, la route (qui n'a pas d'autre appelant) est supprimée et la table n'est plus alimentée (supprimée ou laissée vide) ; les points 1 à 4 valent tant que la route existe, c'est-à-dire jusqu'à cette suppression, qui est livrée avec la correction.
6. Les XP déjà acquis par un abonné ne sont pas retirés. La limite de 30 appels par minute reste tant que la route existe.

### 2.6 Les points déjà gagnés : pas d'audit abonné par abonné

**Principe** : personne d'autre ne voit le cap d'un abonné et il ne donne aucun rang. Avec 4 abonnés actifs, un audit suivi d'une décision compte par compte aurait un gain faible et un risque réel (pénaliser à tort un abonné payant). **On ne touche donc à aucun compte d'abonné** (décision Q6). **Mais depuis que le cap débloque du contenu bonus (Q5), un total d'XP gonflé aurait aussi ouvert des bonus non gagnés** : c'est pourquoi le cap de déblocage se calcule sur les étapes validées et les bonus de fin (5.5), pas sur le total brut. Les caps se recalculent vers le haut.
- **Seule remise à niveau proposée** : ramener l'XP des **3 comptes de test de Thomas** (variable de production, jamais dans le dépôt) à la somme de leurs étapes validées et de leurs bonus de fin acquis (zéro seulement s'ils n'en ont aucune), si Thomas est d'accord (Q6). C'est la seule exception à « le cap ne baisse jamais », et elle ne concerne aucun abonné.
- **Vérification, sans décision par compte** (lecture seule, @fullstack ou @infrastructure, non faite ici faute d'accès à la base) : après la correction 2.5, vérifier que plus aucun compte ne gagne en boucle (le total n'augmente plus que par étapes, bonus et conseils uniques).
- **Limite** : la base ne garde que le total d'XP (ni l'action ni l'historique des gains) ; on ne peut pas distinguer un usage de l'API à la main d'un abonné honnête qui a rouvert des conseils, comportement que le site paie de lui-même tant que la correction n'est pas livrée.
- **Indice, pas preuve** : les barèmes actuels ne produisent que des multiples de 5 (étapes de 50 à 200 par pas de 25, bonus 100, conseil 10), donc un total qui n'en est pas un **indique** un usage de l'API. Un ancien barème a pu exister : `progression-levels.md` décrit « +2 par blague » et « +5 par connexion », et les tests gardent une action `joke_read` (`stores.test.ts` l. 88, `api-validation.test.ts` l. 282) ; la valeur par défaut `moduleXp = 20` d'avant la réécriture des étapes aussi. L'historique du dépôt disponible ici est trop court pour trancher. **Avant de montrer à Thomas toute liste fondée sur cet indice**, @fullstack lit l'historique de `progression.ts`, des seeds et de `addXp`. Cette liste n'est plus nécessaire dans la reco, elle reste possible (Q6 C).
- Ordre : correction 2.5, vérification, remise à niveau des 3 comptes de test (Q6), recalcul unique des caps, puis seulement ouverture des bonus (section 5).

## 3. Ce qui est retenu (conception du cap)

### 3.0 Spécification commune

- **Ce qui rapporte** : étape validée (XP du seed) et bonus de fin (100), inchangés. Rafale, jeux, fiches, « Ton mois » : rien (C4, 12/11, tranchée). Lecture d'un conseil : plus rien (Q1, décision du 12/11).
- **Ce qu'un cap débloque** : du contenu bonus, jamais un contenu existant retiré (décision Q5, section 5).
- **Affichage, spécification d'accessibilité de @ux** :
  1. **Le nom d'abord, le mot ensuite, toujours avec l'échelle** : « Tu avances bien · cap 3 sur 5 ». Jamais « cap 3 » seul (le « sur 5 » écarte la lecture « cap de boussole »). **Cinq repères en rangée** (cinq pastilles, les n premières pleines) sur leur propre ligne (à 375 px, 343 px utiles : texte et pastilles ne tiennent pas sur la même ligne). Les pastilles sont **décoratives (masquées aux lecteurs d'écran)** : le texte porte l'information, pas de double annonce. Si une barre est gardée : `role="progressbar"` avec `aria-valuetext="cap 3 sur 5"`, jamais une valeur en XP.
  2. État marqué autrement que par la couleur : pastille pleine contre contour, **le contour ayant le même contraste de 3:1 que la pastille pleine** (sinon l'état « contour » disparaît pour un daltonien ou en contraste élevé).
  3. Annonces annoncées dans une région `aria-live` polie, fermables, sans animation en boucle : **phrases de cap et de bonus au moins 10 secondes ou jusqu'à fermeture**, avec le lien « Ouvrir » qui ne disparaît pas seul ; **bulle « +X XP » au moins 5 secondes**.
  4. Contraste 4,5:1 (texte) et 3:1 (pastilles) ; cibles interactives de 44 px au moins ; texte agrandi à 200 % sans troncature (conteneur sans hauteur fixe).
  5. Aucun émoji, bulle comprise ; le nom du cap est du texte.
  6. **Voisinage** : la carte étant placée près de « Étape n sur 6 » (voir « Place dans l'espace »), elle porte son propre intitulé de niveau 2, « Ton cap », est séparée du bloc de l'étape par un espace d'au moins 24 px et ne partage pas sa carte ; le texte lu est « Ton cap : Tu avances bien, cap 3 sur 5 » (le mot « étape » n'y figure pas). Test E5 au lecteur d'écran : « Étape 3 sur 6 » puis « Ton cap… » ne se prennent pas pour deux comptes du même objet. À vérifier au premier rendu réel de @design.
- **Deux annonces distinctes, jamais l'une pour l'autre** (alignées sur 5.4), chacune une seule fois : « Nouveau cap : {nom}. » quand le cap **affiché** (total d'XP) monte ; « Un bonus s'ouvre dans la Bibliothèque : {titre}. » quand le **déblocage** (étapes et bonus de fin) atteint un seuil. Si les deux arrivent ensemble (le cas courant, tout compte sans XP ancien), une seule annonce, les deux phrases à la suite. Aucune promesse.
- **XP** : jamais sans échelle ni explication. Phrase vraie pour tous les comptes, y compris pour un abonné honnête qui a lu des conseils : **« 412 XP gagnés depuis ton arrivée »** (ou « voir le détail »).
- **Place dans l'espace** : dans « Parcours », sur **une carte compacte** (série, nom du cap, cinq repères, empilés à 375 px) placée **après l'étape en cours**, **jamais en tête** (l'action de la page est l'étape à reprendre ; architecture v17 en cours) ; « Tes bonus » en raccourci juste après la carte, seulement quand un bonus est ouvert. **Dans « Aujourd'hui »** : « Ton mois » est un bloc d'« Aujourd'hui » (à partir de J25, architecture v16) et **le cap y figure avec la série** ; **aucune annonce de bonus** n'y apparaît, et la carte « S'entraîner » d'« Aujourd'hui » est un lien qui ne liste pas les bonus. Écart assumé avec le brief s24 §3.2, qui y met « XP et niveau » après les étapes faites et la série : le repère neutre « 12 cartes cette semaine » reste le seul repère de l'accueil d'« Aujourd'hui » hors « Ton mois ». **La série « {n} jours de pratique d'affilée »** (brief §3.2 bloc 1, texte validé s17) n'était placée ni dans v11, ni dans v12, ni dans v13 ; l'architecture la place depuis la v14 et la déplace en v15 et v16 ; **la v17 en cours la met sur la même carte compacte que le cap** : ce document ne la place pas d'autorité (Annexe B, point 6). Pas dans la barre de rubriques. `/parcours` étant public, le cap n'est rendu que pour l'abonné connecté, côté navigateur.
- **Caps existants** : recalculés une fois, après la vérification 2.6, vers le haut seulement (aucun abonné ne perd de cap ; seuls les comptes de test de Thomas sont ramenés à leurs étapes et bonus s'il est d'accord, Q6). **Le recalcul est silencieux : ni phrase de passage ni événement « cap atteint » ; le premier affichage montre simplement le cap.** 5 valeurs en base, aucune migration de structure. **Le cap AFFICHÉ suit le total d'XP (Q6 : aucun abonné touché, il ne baisse donc jamais) ; le DÉBLOCAGE d'un bonus suit les XP d'étapes et de bonus de fin (5.5).**
- **Garde-fou de test** : le dernier seuil ne dépasse pas 80 % du total d'XP de **toutes** les sources retenues ; il échoue si un parcours est dépublié (sans Storytelling : 2 300 = 100 %). Le test lit les parcours publiés (`apps/web/src/config/parcours-publication.ts` : `STORYTELLING_PUBLIE = true` l. 12 et `BOULOT_PUBLIE = true` l. 25, vérifiés par la session le 12/11) : si l'un est dépublié, le total baisse, le test échoue et les seuils sont à recaler (sans Storytelling, total 2 300 et dernier seuil à 70 % = 1 600). Le « 18 étapes au minimum » ne vaut que si les cinq parcours sont publiés.

### 3.1 Règle retenue (Q2) : « XP de parcours recalés »

Total 3 100 (Q1 : les 10 XP par conseil sont retirés), seuils **0, 100, 300, 700, 2 300** (74 %).

| Seuil | Ce qu'il garantit (sur les totaux réels) |
|---|---|
| 100 | une ou deux premières étapes |
| 300 | terminer n'importe quel parcours y fait arriver (le plus court en vaut 325) ; on peut aussi l'atteindre avant la fin d'un grand parcours |
| 700 | terminer un grand parcours (700 à 800) ou deux petits (au moins 800) y fait arriver |
| 2 300 | **trois grands parcours (800 + 800 + 700 = 2 300, 18 étapes)** y font arriver, et quatre parcours quelconques aussi (plus petite somme : 325 + 475 + 700 + 800) ; condition suffisante, pas nécessaire |

Cas : Sophie : cap 3 à la semaine 3, cap 4 pendant Boulot ; Yanis : cap 3 à la semaine 4, cap 4 pendant Confiance ; Marc : cap 4 à la fin de Confiance (semaine 6). **Le cap 5 ne s'atteint pas avant 18 étapes au minimum, quel que soit l'ordre**, pour les XP d'étapes et de bonus (un compte qui garde des XP de conseils ou de la faille gagnés avant la correction **affiche un cap plus haut avec bien moins d'étapes** : le cap affiché suit le total, ses bonus suivent ses étapes, 5.5), soit un peu plus de 4 mois à une étape par semaine.
**Preuve du « 18 au minimum »** (recompte de @reviewer sur les `moduleXp` des trois seeds ; tout reste ouvert, l'abonné valide dans l'ordre qu'il veut, et le bonus de 100 ne s'obtient qu'en terminant un parcours) : en prenant, parmi toutes les sélections de 17 étapes, celle qui rapporte le plus (Confiance, Storytelling et Répartie terminés = 16 étapes et 2 075 XP, puis la meilleure étape restante, 150), on obtient **2 225, soit moins que 2 300** ; donc 2 300 exige au moins 18 étapes. 18 suffisent (trois grands parcours, 2 300 exactement). Les cumuls des personas reposent sur les totaux par parcours. [À VÉRIFIER @fullstack : consigner ce recompte dans un test sur les seeds, qui doit échouer si un `moduleXp` change.]
**Règles écartées** (Q2) : cap selon les parcours terminés (0, 1, 2, 3, 5) ; cap selon la plus haute marche de mission tentée (touchait l'esprit de C4, à reposer à J60 avec la mesure des missions tentées si Thomas le souhaite).

### 3.4 Les noms et le mot retenus (Q3)

**Tests de relecture à l'aveugle** : (1) lu seul, se comprend en 3 secondes ; (2) ni rang ni verdict ; (3) n'affirme pas une compétence que la règle ne mesure pas ; (4) **test de vérité : ce que dit le nom est vrai pour quelqu'un qui vient de valider l'étape qui le fait monter** ; (5) Yanis, Sophie ou Marc s'y reconnaît, **sans aucun accord de genre ni de nombre sur l'abonné** (rien au masculin seul : « parti », « lancé » excluraient Sophie). Aucun mot de scène (règle du vocabulaire de l'architecture, v16) ; le cap 1 ne dit rien de passif. **Contrôle de tous les noms et libellés de chaque jeu** : verbes au présent ou à l'infinitif sans participe accordé (« Tu t'échauffes », « Tu avances bien »), aucun participe accordé dans les cinq noms.

| Cap | Seuil | Nom retenu (jeu E1, Q3) |
|---|---|---|
| 1 | 0 | Tu t'échauffes |
| 2 | 100 | Tu te lances |
| 3 | 300 | Tu avances bien |
| 4 | 700 | Tu enchaînes |
| 5 | 2 300 | Tu connais la maison |

**Test de vérité (4), passé par le rédacteur, à refaire à l'aveugle** :
- E1 : cap 1 vrai ; 2 vrai (une ou deux étapes validées) ; 3 « Tu avances bien » vrai dès les premières validations, sans promettre une durée ni accord de genre ; 4 vrai (plusieurs étapes validées) ; 5 « Tu connais la maison » vrai : 2 300 XP demandent **au moins 18 étapes sur 25 (72 %), quel que soit l'ordre, pour les XP d'étapes et de bonus** (preuve en 3.1 ; un compte qui garde des XP de conseils d'avant la correction peut être plus haut, Q6 ; le « 18 au minimum » ne vaut que si les cinq parcours sont publiés). À vérifier à l'aveugle que « Tu te lances » (cap 2) et « Tu avances bien » (cap 3) ne se lisent pas comme un doublon. **Témoins non retenus** : « Tu es bien parti » (masculin seul), « Tu as pris ton rythme » (faux pour qui valide quatre étapes le même jour) ; « Tu rebondis, Tu places tes vannes, Tu tiens la conversation » (affirment une compétence).
- **Portée du test de vérité** : il vaut pour un compte qui progresse par les étapes ; il ne vaut pas pour les comptes gonflés avant la correction, décision assumée (2.6).

**Le mot retenu : « cap »**, toujours écrit « cap 3 sur 5 » avec le nom avant (le « sur 5 » écarte la lecture « boussole »). « Palier » est écarté : il est déjà employé dans un article public sur la timidité avec deux sens (échelle d'exposition, progression des parcours, 1.4). « Niveau » est écarté (difficulté des parcours et des conseils). Je ne modifie pas l'article.

### 3.5 Pourquoi ces choix tiennent

La règle sur les XP respecte la lettre et l'esprit de C4 (12/11, aucune nouvelle règle de points ni de série pour l'entraînement et les fiches) ; une seule voie d'XP, bornée, donc un cap fiable une fois la correction 2.5 livrée. Supprimer l'échelle a été examiné et écarté : le positionnement promet « XP, streak, niveaux ».

### 3.6 Critères de réussite (binaires)

1. Aucun montant d'XP n'est choisi par le navigateur ; le serveur refuse tout identifiant qui n'est pas celui d'un conseil actif ; un même conseil ne rapporte jamais deux fois à un même compte, **garanti par une contrainte d'unicité en base** (correction 2.5, au développement avant l'ouverture, avant la réponse à Q1) ; **test avec 130 identifiants dont 10 invalides, des requêtes simultanées et le rejeu du même identifiant : un compte ne gagne jamais plus de 10 × (nombre de conseils actifs) par ce canal** ; plus aucun conseil ne rapporte d'XP (Q1) et la route est supprimée.
2. Seuils croissants ; le dernier est inférieur ou égal à 80 % du total d'XP de toutes les sources retenues (test automatique, échoue si un parcours est dépublié).
3. Le cap **affiché** d'un abonné (qui suit le total d'XP) ne diminue jamais ; seuls les comptes de test de Thomas peuvent être ramenés à la somme de leurs étapes validées et bonus acquis (zéro seulement s'ils n'en ont aucune), avec son accord (Q6). Le cap de **déblocage** (étapes et bonus de fin) peut être inférieur au cap affiché pour un compte dont l'XP a été gagné avant la correction ; il ne diminue jamais non plus.
4. Sur la carte du cap : aucun émoji, tiret cadratin, pourcentage ni « XP restants ». (Les textes validés « X XP gagnés sur N, bonus de fin compris » des parcours restent.)
5. Les seuils n'existent qu'à un seul endroit du code.
6. Le mot « niveau » ne désigne plus l'échelle d'XP à l'écran ; le cap s'écrit toujours « cap n sur 5 » avec le nom avant.
7. Cinq repères masqués aux lecteurs d'écran avec le texte « cap 3 sur 5 », état hors couleur avec contour à 3:1, `aria-live` poli, phrases de cap et de bonus 10 secondes au moins ou jusqu'à fermeture, bulle « +X XP » 5 secondes au moins, contrastes 4,5:1 et 3:1, cibles de 44 px, carte « Ton cap » séparée du bloc de l'étape (intitulé propre, 24 px d'espace).
8. La réponse à « Tu avais une réponse ? » n'alimente ni XP ni cap (test).
9. **Aucun contenu existant ni promis par l'offre n'est fermé, retardé ou verrouillé selon le cap** ; seuls les bonus de la section 5 dépendent du cap (revue de `user.level` et du cap de déblocage dans `apps/`).
10. Événement « cap atteint » sans identifiant, avec le seul numéro de cap (jamais émis par le recalcul unique) ; lecture soumise à l'effectif minimal de l'architecture courante (v16, mesure).
11. La phrase d'XP affichée est vraie pour tout compte (« gagnés depuis ton arrivée »), y compris celui d'un abonné honnête qui a lu des conseils.
12. Chaque nom et chaque libellé de la carte passe les cinq tests de 3.4 à l'aveugle (dont l'absence d'accord de genre).
13. Aucun texte client de la section 5 ne contient « verrouillé », « cadenas », « débloquer », « exclusif » ni « réservé » (on écrit « s'ouvre », « en plus » ; « exclusif » reste un mot interne : il dirait que d'autres sont exclus).
14. Aucune rubrique « Tes bonus » ni phrase d'attente avant le premier bonus ouvert.
15. Aucun bonus dans la cloche, aucune pastille, aucun e-mail.
16. Un compte à total d'XP gonflé mais sans étape n'ouvre aucun bonus (test).
17. Deux annonces indépendantes : « Nouveau cap » seulement quand le cap affiché monte, « Un bonus s'ouvre » seulement quand un bonus est effectivement rangé dans son lieu (test : un compte à cap affiché supérieur au déblocage ne reçoit jamais « Un bonus s'ouvre » sans bonus ouvert, et un bonus qui s'ouvre sans nouveau cap affiché est annoncé sans « Nouveau cap ») ; l'annonce nomme le lieu (« dans la Bibliothèque »), reste au moins 10 secondes ou jusqu'à sa fermeture, et son lien « Ouvrir » ne disparaît pas seul.
18. Les quatre bonus sont produits et validés (10/10 à l'aveugle) **avant l'ouverture de l'espace**.

## 4. Décisions de Thomas (12/11, `founder-preferences.md`, dernière ligne)

Thomas a répondu aux six questions de la v6.1 : toutes les recos sont suivies, sauf Q5 où il a choisi plus que la reco. Les options non retenues sont retirées de ce document.

| Q | Décision | Conséquence dans ce document |
|---|---|---|
| Q1 | Les 10 XP par conseil lu sont **retirés pour l'avenir** (XP déjà gagnés gardés) | Total 3 100 ; la phrase en ligne « … avec des exercices concrets et des XP » (`conseils/page.tsx` l. 161) est **à retoucher avec ton go** ; la bulle « +10 XP » disparaît de la liste des conseils |
| Q2 | Le cap suit les XP : **0, 100, 300, 700, 2 300** | 3.1 |
| Q3 | Noms « Tu t'échauffes, Tu te lances, Tu avances bien, Tu enchaînes, Tu connais la maison » ; mot **« cap »** (« cap 3 sur 5 », nom avant) | 3.4 ; chaque texte touché (1.4) te revient pour un go |
| Q4 | Dernier cap à **environ 4 mois** (au moins 18 étapes) | 3.1 |
| Q5 | **Un cap débloque du contenu** (« ben du contenu non ? ») : bonus en plus, jamais un contenu existant retiré ou verrouillé ; **rouvre en partie la décision du 18/10, accord écrit donné** | Section 5 |
| Q6 | Aucun abonné touché ; seuls les **3 comptes de test** sont ramenés à la somme de leurs étapes validées et bonus (zéro seulement s'ils n'en ont aucune) | 2.6 ; critère 3 |

**Déjà décidé, non reposé** : C4 (12/11) ; XP d'étape et bonus de fin inchangés (étalons s17) ; série sur la pratique (07/10) ; pas de certificat (07/10) ; tout reste ouvert (18/10, 19/10), sauf les bonus de cap ajoutés par Q5 ; la cloche sans relance (décision du 12/11) ; FAQ « 50 XP par semaine » intacte (29/09). **Tranché sans question** : la correction du défaut (2.5, au développement avant l'ouverture : gain fixé par le serveur, conseil inexistant refusé, un conseil une seule fois par compte, garanti en base) ; recalcul unique des caps vers le haut ; aucun e-mail ni notification liés aux caps ; aucun émoji ; seuils à un seul endroit du code.

## 5. Contenu débloqué par cap (décision Q5)

### 5.1 Règle intangible

**Un cap ajoute un contenu BONUS.** Aucun contenu existant, aucun contenu promis par l'offre, aucune des 163 fiches neuves de l'architecture (v15) n'est retiré, retardé ni verrouillé à cause du cap : un abonné au cap 1 a tout ce que l'offre annonce, dès l'abonnement. Le cap 1 (départ) ne débloque rien ; les caps 2 à 5 débloquent **un bonus chacun**. Un bonus n'est jamais présenté comme « avancé », « difficile » ou « pour les meilleurs » (ce serait un verdict de capacité, alors que le cap mesure une activité : 2.3). Il est neutre : « en plus ». Un cap ne baisse jamais, donc un bonus ouvert le reste (hors résiliation, qui coupe l'accès comme pour tout le reste). **Les bonus suivent les parcours (C4) : la rafale, les jeux et les fiches n'en ouvrent aucun, et un abonné qui ne fait que la rafale n'en ouvre pas.** C'est assumé, et à reposer à J60 avec la mesure des missions tentées si Thomas le souhaite (sans que ce document rouvre C4).

### 5.2 Cohérence avec l'offre affichée et la décision du 19/10

- Le 19/10, Thomas a décidé : « Premium se vend comme **tout Deviens Marrant ouvert**, jamais réduit aux 5 parcours », et l'étalon A de /abonnement porte le titre « **Premium ouvre tout Deviens Marrant** » (`founder-preferences.md` l. 124 et 125).
- **« Premium ouvre tout » reste honnête si le bonus s'AJOUTE** : tout ce qui existe est ouvert dès l'abonnement, les bonus sont **en plus**. Il deviendrait faux seulement si on présentait un bonus comme une partie de « tout » qui s'ouvre plus tard. La phrase recommandée (Q8) : « Premium ouvre tout Deviens Marrant. Et à chaque cap franchi dans les parcours, un bonus en plus. » Elle est exacte : le cap suit les étapes de parcours, pas la rafale ni les jeux (C4). **On n'écrit jamais « à mesure que tu pratiques »** : « pratiquer » désigne pour l'abonné tout ce qu'il fait, et seule la validation d'une étape ouvre un bonus (offre vraie, 04/10).
- **Textes qui disent « tout »** (trouvés par @reviewer) : `apps/web/src/config/textes/abonnement-vente.ts` l. 44 (`PHRASE_OBJET_CONNECTE` : « Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois. », profil et paiement), l. 67 (titre) et l. 69 (`titreAvantNom` : « Premium ouvre tout ») ; l'écran d'offre de l'app mobile (« Premium ouvre tout Deviens Marrant », `founder-preferences.md` l. 149) ; l'e-mail de bienvenue E0 (« liste généraliste de tout ce que Premium ouvre », l. 156, approuvé le 07/11). [À VÉRIFIER @fullstack] l'e-mail de J5 et `llms`. **Chaque texte retouché revient à Thomas pour un go** (décisions du 29/09 et du 19/10), avis @legal conseillé (promesse commerciale). Reco : retoucher seulement la page d'offre (une phrase) et E0 ; laisser les autres inchangés (« tout » y reste honnête).
- **Trois formulations proposées** (question Q8) : A. la phrase ci-dessus ; B. retirer « tout » du titre : « Premium ouvre le catalogue, les parcours et la lettre, et des bonus qui s'ouvrent à chaque cap » ; C. ne rien dire des bonus sur la page (« tout » reste vrai, mais l'offre tait un avantage).

### 5.3 Quatre natures de bonus

Le cap 1 ne débloque rien ; les caps 2 à 5 ouvrent un bonus chacun. **Les quatre bonus existent dès l'ouverture de l'espace** : tout est ouvert (18/10) et une étape se valide sur déclaration (5.5), donc un abonné peut atteindre le cap 5 le premier jour, et les abonnés actuels sont recalculés à l'ouverture. Il n'y a donc **aucun calendrier échelonné** : les quatre sont produits et validés avant l'ouverture (« tout part d'un coup », 12/11). Rythme typique d'un abonné (à une étape par semaine) : cap 2 en 1 ou 2 étapes, cap 5 après au moins 18 étapes ; il n'a aucun effet sur la production.

**Classement par désirabilité, pas par coût.** Une récompense motive si elle est désirable, rare et gagnée. **D et A sont les plus désirables** (un secret de fabrication, quelque chose à raconter) ; **C est utile mais peu spéciale** ; **B est la moins chère à produire mais la moins désirable** (récompenser l'effort par plus d'effort, et les 6 séances existantes sont déjà ouvertes à tous).

| | A. Coulisses d'une réplique | B. Séance en plus | C. Situations en plus | D. Décorticage exclusif (**reco**, caps 2 à 4) |
|---|---|---|---|---|
| **Ce que c'est** | Une fiche de 5 minutes : comment la maison a choisi une réplique, pourquoi les autres ont été écartées (contre-exemples réécrits), un geste à faire | Une séance de 20 minutes hors écran, même format que les 6 séances existantes (3, 5, 8 et 4 minutes) | Un lot de 5 situations « Quoi répondre » par cap (20 en tout), étiquetées « en plus », jamais « difficile » | Le démontage d'un passage d'un humoriste connu et récent, au format « Écouter, repérer » : passage minuté (1 à 2 minutes), ce que l'artiste fait, pourquoi ça marche, ta version à toi, grille de 3 questions ; hors des 12 de la V1 |
| **Débloqué** | Cap 5 (reco) ou caps 2 à 5 : 1 à 4 fiches | Caps 2 à 5 : 4 séances (en plus des 6) | Caps 2 à 5 : 4 lots de 5 situations | Caps 2 à 4 : 3 passages ; **cap 5 « Tu connais la maison » : les coulisses de la maison (A)** |
| **Yanis** | Apprend à réécrire seul | Pratique seul ou avec un colocataire de confiance | Plus de répétitions avant la soirée | Revoit avec ses potes un passage qu'il aime et sait pourquoi la salle part |
| **Sophie** | Comprend les critères d'une bonne réplique | Séance sur le trajet du soir, à voix basse | Plus de situations de boulot | Reprend un mécanisme pour un pot de départ |
| **Marc** | Une raison de comprendre « pourquoi ça marche » | Pratique chez lui avant d'oser en face | Plus de matière régulière | Un moment pour rire, avec quelque chose à essayer le lendemain |
| **Volume à produire** | 1 à 4 fiches texte, une version corrigée chacune ; matière interne [À VÉRIFIER qu'on peut la montrer] | 4 séances texte, une version corrigée chacune ; aucune citation à vérifier | 20 situations : **180 à 720 répliques candidates et 80 contextes** (d'après les 540 à 2 160 répliques et 240 contextes de l'architecture v15 §7.3 pour 60 situations, selon @reviewer) | 3 passages vérifiés (minute et seconde exactes, citation réelle et courte, vérification par un relecteur indépendant de l'auteur) + 1 fiche A ; la vérification est le facteur limitant |
| **Risques propres** | Montrer des répliques écartées remet du contenu « sous la barre » en ligne : règle d'or P0 s18 ; contre-exemples réécrits et relus, jamais les originaux | Peu de risque ; peu « nouveau » | Le plus coûteux ; ressemble au cœur de l'espace ; allonge toutefois le stock de la rafale | Choix de l'humoriste et vérification des citations ; humoristes nommés autorisés partout (P0 s15) et récents proches de l'audience (25/10) |

Pour les quatre : relecture à l'aveugle jusqu'à 10/10, au plus 4 tours (décision C8 du 12/11) ; chaque bonus a un geste (toute fiche en a un, architecture v15) ; aucun nom ou texte n'est au féminin ou au masculin seul pour l'abonné ; une durée affichée, **facultatif, jamais compté dans la promesse « 15 à 20 minutes par semaine »** (C2). Le bonus du cap 2 passe avant les autres (son passage sert d'étalon ; l'E4 de l'architecture est l'une des 12 fiches V1, ce passage est **en plus** des 12, pas l'un d'eux), car c'est celui que tous les abonnés ouvrent en premier. **Condition de production de D (accessibilité)** : sous-titres de la vidéo et **transcription du passage cité** (citation courte et minutée, en texte), grille de 3 questions en texte.

**Limite de D, dite comme celle de B** : D a le **même format** que les 12 fiches « Écouter, repérer » de la V1, ouvertes à tous, et que le format B mensuel de la lettre (« décryptage d'un vrai passage d'humoriste », décision du 25/10), dont les numéros entrent dans l'archive « Lettres » de tous les abonnés (C5). L'objection faite à B (« très proche des 6 séances déjà ouvertes à tous ») vaut donc aussi pour D : **la rareté ne tient pas au format**. Ce qui distingue réellement D : des passages **différents** de ceux des 12 fiches et des lettres, choisis avec Thomas pour ce bonus seulement ; des citations vérifiées ; un humoriste connu que l'abonné aime, donc quelque chose à raconter. D reste la reco parce que cette exclusivité tient au **passage**, qui est ce que l'abonné désire, alors que la séance ou les situations en plus répètent un format dont il dispose déjà sans qu'aucun contenu précis le fasse revenir.

**Reco, qui suit la valeur pour les personas : D aux caps 2 à 4, et les coulisses de la maison (A) au cap 5.** Raisons : D est la récompense la plus désirable (on a quelque chose à raconter) et sa rareté tient au passage choisi, pas au format (limite ci-dessus) ; elle reste dans la ligne de Thomas (humoristes nommés autorisés, humoristes récents) ; A donne son sens au cap 5, « Tu connais la maison » ; B, la moins chère, devient une option : sa raison principale est le coût, pas la valeur. Limite : la vérification des citations de D coûte trois passages à valider avant l'ouverture.

### 5.4 Affichage, sans pression

- **Sans cadenas, sans « verrouillé », sans « il te manque »** : le cap est silencieux tant qu'il n'est pas atteint. **La rubrique « Tes bonus » n'existe pas tant qu'aucun bonus n'est ouvert** : rien d'écrit, aucune phrase d'attente (« Ton premier bonus arrive… » est supprimée : elle dirait à celui qui reste au cap 1 ce qu'il n'a pas). Elle apparaît avec le premier bonus.
- **Surprise sur le contenu, pas sur l'existence** (Q9 A) : l'offre dit qu'un bonus s'ouvre à chaque cap franchi et la carte montre cinq repères, donc l'abonné sait qu'il y en a quatre, pas lesquels. L'espace ne reparle pas de ce qui n'est pas ouvert.
- **Où vivent les bonus** : **une seule porte par bonus**. Avec la reco D, les décorticages sont rangés dans **la Bibliothèque**, avec « Écouter, repérer » (architecture v16 l. 828 : Bibliothèque = vannes, conseils, vidéos, Écouter repérer), comme fiche ordinaire marquée « Bonus du cap 3 · Tu avances bien » (état « Fait » unique) ; ils ne sont pas les 12 fiches V1, qui gardent leur porte. Avec Q7 = B, la séance bonus irait dans « S'entraîner » (jeux, séances, missions), avec Q7 = C dans « Quoi répondre ». « Tes bonus » est un **raccourci** dans « Parcours », juste après la carte « Ton cap » et seulement quand un bonus est ouvert, vers la même fiche. **Aucune annonce de bonus dans « Aujourd'hui »** ; « Ton mois » y montre le cap (3.0). Dans « Ton mois », un bonus fait compte **comme une fiche ou une séance faite**, jamais comme « 2 bonus sur 4 ». Sur un téléphone, « Plus » (sixième entrée de la barre) est hors écran au premier affichage : les bonus ont donc deux chemins hors « Plus », le lien « Ouvrir » de l'annonce et le raccourci « Tes bonus ».
- **Deux annonces indépendantes** (`aria-live` poli, **au moins 10 secondes ou jusqu'à fermeture**, lien « Ouvrir » qui ne disparaît pas seul, WCAG 2.2.1) : (a) le cap **affiché** (total d'XP) monte : « Nouveau cap : {nom}. », sans bonus ; (b) le **déblocage** (étapes et bonus de fin) atteint un seuil : « Un bonus s'ouvre dans la Bibliothèque : {titre}. » ; si les deux arrivent ensemble (le cas courant), une seule annonce avec les deux phrases à la suite. **Jamais l'une pour l'autre** : un compte à XP ancien peut voir son cap monter sans bonus, ou un bonus s'ouvrir sans nouveau cap affiché ; un test par cas (critère 17). Le recalcul unique à l'ouverture est silencieux : il n'annonce rien, il range les bonus déjà gagnés.
- **Cloche** : un bonus n'est jamais listé dans la cloche (elle liste les nouveautés pour tous, y compris ceux qui ne peuvent pas l'ouvrir), jamais de pastille, jamais d'e-mail ; il s'annonce par la phrase de passage et par « Tes bonus ».
- **Cap affiché plus haut que le déblocage** (5.5) : seulement pour un compte dont l'XP a été gagné avant la correction, la carte ajoute, sans accuser : « Ton cap compte tous les points gagnés depuis ton arrivée ; les bonus s'ouvrent avec tes étapes et tes bonus de parcours. »
- **Accessibilité** : même spécification que 3.0 (contrastes 4,5:1 et 3:1, cibles de 44 px, texte agrandi à 200 %, aucun émoji, état non porté par la couleur seule) ; aucun cadenas, donc rien à annoncer comme « verrouillé ».
- **Mesure** : un événement « bonus ouvert » avec le seul numéro de cap, sans identifiant ; lecture soumise à l'effectif minimal de l'architecture courante (v16).

### 5.5 Les bonus ne dépendent pas de l'ancienne faille d'XP

- **Ordre** : correction de sécurité 2.5 livrée seule et en premier ; vérification ; recalcul unique des caps ; **puis** ouverture des bonus, tous les quatre déjà produits (5.3).
- **Deux caps, dits honnêtement** : le cap **affiché** suit le total d'XP (Q6 : aucun abonné touché, il ne baisse jamais) ; le **déblocage** d'un bonus suit **les XP d'étapes et de bonus de fin** (une ligne par étape et par abonné en base, hors de portée de l'API d'XP), pas le total brut `User.xp`. **Cas limite** : un compte dont l'XP a été gagné avant la correction (faille, conseils repayés) voit un cap affiché plus haut que ses bonus ; la phrase de 5.4 l'explique sans accuser. Sans cette règle, un abonné à 5 000 XP « à la main » ouvrirait les quatre bonus sans une étape. Les caps 2 à 5 s'appliquent aux mêmes seuils (100, 300, 700, 2 300) sur cette somme. Question Q10.
- Le bonus d'un cap ne s'ouvre que côté serveur (le navigateur ne décide jamais) ; test : un compte à total gonflé mais sans étape n'ouvre aucun bonus.
- **Limite assumée** : **une étape se valide sur déclaration** (tout est ouvert depuis le 18/10) : `POST` avec le numéro d'étape, réservé à Premium, limité à 10 par minute, sans contrôle de quiz ni de durée (@reviewer). Valider les 25 étapes prend environ 3 minutes et ouvre le cap 5 et les quatre bonus. **Qui valide sans pratiquer ouvre les bonus sans les avoir gagnés ; c'est accepté**, puisqu'un bonus n'est vu de personne d'autre et ne retire rien à personne. Aucune garantie plus forte n'est promise.

### 5.6 Questions résiduelles pour Thomas

Quatre questions, trois options chacune (quatre pour Q7), une reco argumentée.

**Q7. Quelle nature de bonus ?** (classés par désirabilité, pas par coût)
- A. Coulisses d'une réplique, une fiche par cap : distinctive, mais il faut réécrire des contre-exemples pour ne pas remettre du contenu écarté en ligne.
- B. Une séance de 20 minutes en plus par cap : la moins chère, mais la moins désirable (plus d'effort en récompense de l'effort), et très proche des 6 séances déjà ouvertes à tous.
- C. Un lot de 5 situations « Quoi répondre » par cap : utile, mais le plus coûteux (180 à 720 répliques candidates) et peu « spécial ».
- D. **Reco** : décorticage exclusif d'un passage d'humoriste connu et récent aux caps 2 à 4, et les coulisses de la maison (A) au cap 5 « Tu connais la maison ». La plus désirable ; limite dite : même format que les 12 fiches « Écouter, repérer » et que le format B de la lettre, la rareté tient aux passages choisis avec toi pour ce bonus seulement ; demande trois passages vérifiés (transcription du passage comprise) avant l'ouverture.

**Q8. Quelle phrase pour l'offre ?** (« Premium ouvre tout Deviens Marrant » reste vrai, les bonus s'ajoutent ; chaque texte retouché te revient pour un go, avis @legal conseillé)
- A. **Reco** : « Premium ouvre tout Deviens Marrant. Et à chaque cap franchi dans les parcours, un bonus en plus. » : la phrase **s'ajoute** sous le sous-titre validé (« Les listes ne s'arrêtent plus à la dixième vanne, les parcours vont au bout. »), qui reste ; le titre n'est pas touché. Sur la page d'offre et dans l'e-mail de bienvenue ; les autres textes qui disent « tout » (1.4, 5.2) restent inchangés. Exacte : le cap suit les étapes de parcours, pas la rafale ni les jeux.
- B. Retirer « tout » du titre : « Premium ouvre le catalogue, les parcours et la lettre, et des bonus qui s'ouvrent à chaque cap » : exact, mais plus long à lire sur téléphone et il réduit l'offre à une liste, ce que tu refusais le 19/10.
- C. Ne rien dire des bonus sur la page : « tout » reste vrai, mais l'offre tait un avantage.

**Q9. Faut-il voir le bonus à venir ?** (le contenu, pas l'existence : l'offre dit qu'un bonus s'ouvre à chaque cap)
- A. **Reco** : non, le contenu est une surprise : on le découvre au passage du cap (aucune pression, aucun « il me manque »).
- B. Oui, le titre du prochain bonus seulement, sans cadenas ni compte à rebours (motivant, mais crée une attente et une petite pression).
- C. Oui, tous les bonus avec « s'ouvre au cap N » (transparent, mais c'est une liste de choses fermées, ce que l'espace évite).

**Q10. Cap affiché et cap qui ouvre les bonus : le même ?** (précise ta décision Q6 « aucun abonné touché »)
- A. Les deux sur les étapes et bonus de fin : simple, mais cela applique à tous les abonnés ce que Q6 réservait à tes comptes de test : un abonné qui a lu beaucoup de conseils verrait un cap plus bas que son niveau actuel (ses XP restent).
- B. Les deux sur le total brut d'XP : simple, mais l'ancienne faille ouvre des bonus non gagnés.
- C. **Reco** : le cap **affiché** suit le total d'XP (aucun abonné touché), le **déblocage** suit les étapes et bonus de fin. Cas limite dit honnêtement : un compte dont l'XP a été gagné avant la correction voit un cap plus haut que ses bonus, avec la phrase « Ton cap compte tous les points gagnés depuis ton arrivée ; les bonus s'ouvrent avec tes étapes et tes bonus de parcours. » (qui n'accuse personne). Concerne au plus les quelques comptes anciens.

## 6. À traiter après ta réponse

- **@fullstack / @infrastructure** : **correction 2.5 au développement, avant l'ouverture**, sans attendre les réponses (identifiant de conseil actif exigé, unicité par contrainte en base, test à 130 identifiants) ; vérification de 2.6 ; remise à niveau des 3 comptes de test (Q6) ; cap de déblocage calculé sur étapes validées et bonus de fin, déblocage côté serveur seulement, test « compte à total gonflé sans étape : aucun bonus » (5.5) ; état des interrupteurs de parcours ; test consignant le recompte « 18 étapes au minimum » sur les seeds ; centraliser les seuils ; recalcul unique ; test de garde ; remplacer `progression-levels.md`. Aucun fichier de `apps/` n'a été modifié par cette session.
- **@ux** : spécification 3.0, place dans « Parcours » et « Ton mois », test des 3 secondes sur l'écran réel, test de vérité des noms à l'aveugle.
- **@legal** : avis sur la promesse « Premium ouvre tout Deviens Marrant » une fois les bonus à débloquer en place (5.2) ; aucune donnée personnelle nouvelle.
- **@copywriter** : étalons du bonus retenu (Q7, E4 en premier pour le passage du cap 2), puis production des quatre bonus **avant l'ouverture**, relecture à l'aveugle 10/10 (4 tours au plus, C8) ; textes de l'offre touchés (5.2) seulement après le go de Thomas.
- **@fullstack** (bonus) : bonus rangés dans la Bibliothèque (reco D) avec raccourci « Tes bonus » ; deux annonces indépendantes (cap affiché, déblocage) ; ouverture côté serveur sur les étapes et bonus de fin ; rubrique absente avant le premier bonus ; bonus absents de la cloche.
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

## Annexe A quater. Réponse de Thomas : traitement dans la v7

| Décision | Traitement |
|---|---|
| Q1 à Q4, Q6 | Section 4 « Décisions de Thomas » ; options non retenues retirées (règles B et C, jeux E2 et E3, mots « palier » et sans mot, Q-options) ; 3.0 à 3.5 et critères réécrits en conséquence |
| Q5 « du contenu » | Nouvelle section 5 : règle intangible, cohérence avec l'offre (mot « tout »), 3 natures de bonus avec reco, affichage sans pression, sécurité du déblocage, 4 questions résiduelles (Q7 à Q10) ; 2.4, 2.6, 3.0, critère 9 mis à jour |
| Résumé | Refait |

## Annexe A quinquies. Tour 7 (section 5) : traitement dans la v8

| Source | N° | Traitement |
|---|---|---|
| @elon | AA1 (promesse « à mesure que tu pratiques », bloquant) | Q8 A : « …Et à chaque cap franchi dans les parcours, un bonus en plus. » ; 5.2 : on n'écrit jamais « pratiques » ; 5.3 : « récompense la pratique » supprimé |
| @elon | AA2 (classer par désirabilité, option D, bloquant) | 5.3 : classement par désirabilité, option D (décorticage exclusif) ; Q7 ; reco D aux caps 2 à 4, coulisses au cap 5 ; B devient une option |
| @elon | AA3 (rafale seule) | 5.1 et résumé : les bonus suivent les parcours, à reposer à J60 |
| @reviewer | E1 (deux caps, bloquant) | 3.0, 3.1, critère 3, 5.5, Q10 : cap affiché sur le total, déblocage sur étapes et bonus de fin ; cas limite et phrase d'explication ; Q10 C recommandée |
| @reviewer | E2 (calendrier échelonné, bloquant) | 5.3 : les quatre bonus produits avant l'ouverture ; calendrier supprimé ; critère 18 |
| @reviewer | E3 (déclaratif) | 5.5 : titre et limite assumée (étape validée sur déclaration, environ 3 minutes pour les 25) |
| @reviewer | E4 (163 fiches, v15) | 5.1 : 163 fiches (v15) ; renvois à l'architecture courante (v15) |
| @reviewer | E5 (« tout reste ouvert ») | Section 4 : « sauf les bonus de cap ajoutés par Q5 » |
| @reviewer | E6 (phrase de passage, retours à la ligne) | 3.0 alignée sur 5.4 ; retour à la ligne et « n'était placée » corrigés |
| @reviewer | E7 (volumes de C) | 5.3 : 180 à 720 répliques et 80 contextes |
| @reviewer | E8 (état vide) | 5.4 : rubrique absente tant qu'aucun bonus ; phrase d'attente supprimée |
| @reviewer | E9 (place, annexe B) | 5.4 : bonus dans « S'entraîner », « Tes bonus » en raccourci ; annexe B points 7 et 8 |
| @reviewer | E10 (textes « tout ») | 5.2 : `abonnement-vente.ts` l. 44, 67, 69, app mobile, E0 listés, go de Thomas pour chacun |
| @ux | B1 (« pratiques »), B2 (rubrique vide) | comme AA1 et E8 |
| @ux | N3 (place), N4 (phrase de passage), N5 (cloche) | 5.4 : « S'entraîner », « Ton mois » comme séances, phrase avec le lieu, 10 secondes, lien qui reste, cloche exclue |
| @ux | N6 (chiffres), N7 (critères), N8 (cap qui baisse) | 163 fiches ; critères 13 à 18 ; Q10 C |
| @ux | N9 (calendrier), N10 (durée, C2), N11 (résumé) | bonus tous produits avant l'ouverture ; durée affichée, facultatif, hors promesse ; résumé : rafale et jeux n'ouvrent aucun bonus |

**Diff** : mesuré par la session (v7 vers v8 : +93 / -51 lignes).

## Annexe A sexies. Tour 8 (section 5) : traitement dans la v9

| Source | N° | Traitement |
|---|---|---|
| @ux | R1 (phrase unique, deux caps, bloquant) | 3.0, 5.4, critère 17 : deux annonces indépendantes (« Nouveau cap » quand le cap affiché monte ; « Un bonus s'ouvre » quand le déblocage atteint un seuil), réunies quand elles arrivent ensemble, un test par cas |
| @ux | R2 (place du cap, Aujourd'hui, voisinage) | 3.0 : carte compacte « Ton cap » (série + cap) après l'étape en cours, jamais en tête ; intitulé propre, 24 px, texte lu sans « étape » ; « Ton mois » dans « Aujourd'hui » montre le cap, aucune annonce de bonus |
| @ux | R3 (5 s contre 10 s) | 3.0 point 3 et critère 7 : phrases de cap et de bonus 10 s ou jusqu'à fermeture, bulle « +X XP » 5 s |
| @ux | R4 (porte des bonus) | 5.4 : une seule porte par bonus, la Bibliothèque pour la reco D (architecture v16 l. 828) ; S'entraîner si Q7 = B |
| @ux | R5 (transcription, mot « exclusif ») | 5.3 : transcription du passage et sous-titres en condition de production ; critère 13 : « exclusif » et « réservé » interdits en texte client |
| @ux | R6 (barre à 375 px) | Les cinq règles (indice de suite, entrée active visible, clavier, libellés entiers, mouvement réduit) sont reportées à l'étalon E5 de l'architecture (Annexe B, point 9) ; ici, 5.4 note que « Plus » est hors écran au premier affichage |
| @ux | R7 (annexe B, renvois) | Titre de l'annexe B, points 6, 7 et 9 mis à jour (v16, v17 en cours) |
| @reviewer | G1 (« Écouter, repérer » dans S'entraîner) | 5.4 : Bibliothèque ; annonce « dans la Bibliothèque » ; annexe B point 7 |
| @reviewer | G2 (limite de D) | 5.3 : même objection que pour B, ce qui distingue D, pourquoi D reste la reco ; E4 clarifié (en plus des 12) |
| @reviewer | G3 (phrase unique) | comme R1 |
| @reviewer | G4 (Aujourd'hui, Ton mois, cap en tête) | 3.0 : « Ton mois » montre le cap ; carte après l'étape en cours ; annexe B point 9 |
| @reviewer | G5, G6 (renvois, nombre d'options, Q8 A) | renvois v16 (v17 en cours) ; 5.6 « quatre pour Q7 » ; Q8 A : s'ajoute sous le sous-titre validé, le titre n'est pas touché |
| @elon | BB1, BB2 | « quatre pour Q7 » ; diff : mesure de la session citée en A quinquies |

## Annexe B. Correctifs pour l'architecture (v13 : points d'origine ; traités en v14 à v16 ; v17 en cours)

1. **v13 §1.1, ligne « XP, niveaux, série (code) » (l. 146)** : la phrase « le conseil du jour d'« Aujourd'hui », la fiche 1.1 de chaque étape et la Bibliothèque entrent dans ce cas » est **fausse** : **ni le conseil du jour ni le conseil d'une étape ne rapportent d'XP ; seule la liste du catalogue des conseils en rapporte** (`components/conseils/conseils-list.tsx`, utilisé par `app/(dashboard)/conseils/page.tsx` seulement). **La v14 corrige cette phrase** (renvoi : v14, §1.1) ; le texte à retenir est : « 10 XP par conseil ouvert (`conseils-list.tsx` l. 175 à 178), anti-doublon en mémoire de page seulement ; `POST /api/user/xp` accepte un montant choisi par le navigateur (1 à 500, 30 appels par minute), ne garde que le total ; seul appelant : la liste du catalogue des conseils (le conseil du jour et la fiche conseil d'une étape ne donnent pas d'XP) ».
2. **§1.1, ligne `progression-levels.md` « OBSOLÈTE (gains absents du code) »** : nuancer (le gain « +10 par conseil » existe).
3. **C4** : la phrase « les points viennent des étapes et du bonus de fin » est incomplète. La décision reste valide mais a été prise sans savoir que lire un conseil rapporte des points : le dire à Thomas (Q1).
4. **Chantier de développement** : ajouter la correction 2.5 (gain fixé par le serveur, identifiant de conseil actif exigé, un conseil une seule fois par compte avec contrainte d'unicité en base, table additive) et la vérification 2.6.
5. **§5.2** : le conseil de chaque étape (fiche 1.1) ne rapporte pas d'XP à part (déjà dans l'XP de l'étape).
6. **Série** : le brief §3.2 bloc 1 place dans « Aujourd'hui » la série « {n} jours de pratique d'affilée » (texte validé s17) ; ni la v11, ni la v12, ni la v13 ne la placent (§4.4 n'a que le repère neutre « 12 cartes cette semaine »). **La série est placée en v14, déplacée en v15 et v16 ; la v17 en cours la met sur la carte compacte « Ton cap » (série + cap), après l'étape en cours (renvoi : v17).**
7. **Architecture v15 (et v16), bonus de cap** : compter les 4 bonus (3 passages « Écouter, repérer » et 1 fiche « coulisses » si Q7 = D ; 4 séances si Q7 = B) dans les totaux de fiches neuves (163 aujourd'hui), le plan de production et le chantier (§3.2, §5.3 et §7.3 d'après @reviewer) ; les ranger dans la Bibliothèque (avec « Écouter, repérer », v16 l. 828) avec raccourci « Tes bonus » dans « Parcours », aucune annonce de bonus dans « Aujourd'hui » (le cap figure dans « Ton mois »), comptés dans « Ton mois » comme des fiches ou séances faites ; ajouter au chantier le déblocage côté serveur ; remplacer la phrase « Cette architecture n'y touche pas » (v15 l. 989 d'après @reviewer) ; exclure les bonus de la cloche.
8. **Architecture v15, connexion** : la décision du 12/11 (connexion vers la page d'origine, sinon « Aujourd'hui ») que la v14 disait « non tranchée par Thomas » est tranchée (`founder-preferences.md` l. 168) ; la mettre à jour.
9. **Architecture v17 (en cours), carte du cap et barre** : carte compacte « Ton cap » (série + cap) après l'étape en cours dans « Parcours », jamais en tête, intitulé de niveau 2 séparé de « Étape n sur 6 » (24 px, texte lu sans « étape », test E5 au lecteur d'écran) ; porte unique des bonus (Bibliothèque pour la reco D) ; deux annonces indépendantes (cap, bonus) de 10 s au moins ; et, pour la barre de rubriques à défilement (décision de Thomas, Q3 = A) à l'étalon E5, cinq règles de @ux : indice visible d'une suite (entrée suivante coupée de 16 à 24 px, léger fondu), entrée active ramenée dans la zone visible, ordre de tabulation et `aria-current="page"` avec la région « Mon espace », libellés entiers à 200 % de texte et cibles de 44 px, pas de défilement animé si l'abonné demande moins de mouvement.

