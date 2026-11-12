# Niveaux et XP de l'espace Premium (s24)

> Auteur : @product-manager, 12/11/2026. Brouillon à relire à l'aveugle (@reviewer, @ux, @elon) jusqu'à 10/10 avant d'être montré à Thomas. Décision de départ : Q9 du 12/11, « profitons de l'occasion pour revoir tout ça et itérer » (`founder-preferences.md`, dernière ligne).
> Conventions : [À VÉRIFIER] = fait non lu dans cette session. [HYPOTHÈSE] = choix de travail. Aucun chiffre d'usage n'est inventé : il y a 4 abonnés actifs au 02/11, donc aucune mesure de comportement. Les noms et libellés proposés ne contiennent ni tiret cadratin ni émoji.
> Fichiers lus : `apps/web/src/lib/progression.ts`, `lib/parcours-xp.ts`, `app/api/parcours/[id]/progress/route.ts`, `app/api/user/xp/route.ts`, `components/profil/profil-dashboard.tsx`, `lib/utils.ts` (USER_LEVELS), `config/textes/parcours.ts`, modèle `User` du schéma Prisma, `docs/content/progression-levels.md`, architecture de contenu v11 (résumé, §2, §4, C4, C7), et les captures de progression `docs/qa/captures-parcours-boulot-s19/` pour les totaux d'XP.

## Résumé pour Thomas (sans jargon)

- **Aujourd'hui** : 5 niveaux (Novice, Apprenti, Farceur, Comique, Légende). Tout ce qu'un abonné peut gagner dans les 5 parcours fait **3 100 XP**. Le dernier niveau demande 5 000 : **il est inatteignable**. Un abonné très assidu s'arrête à « Comique », avec une barre qui reste bloquée à moitié (46 %).
- **Ce qu'un niveau change** : seulement l'affichage d'une carte « Progression » dans le profil. Aucun contenu ne s'ouvre ou ne se ferme selon le niveau.
- **Ce que je recommande** : garder 5 niveaux, **ne rien changer à ce qui rapporte des XP** (tes valeurs validées en étalons), **recaler les seuils** pour que le dernier niveau soit atteignable, et **changer les noms** : ils décrivent aujourd'hui un verdict (« Comique », « Légende ») alors qu'on mesure une activité. Trois jeux de noms à choisir (section 3).
- **Ce que ça ne fait pas** : pas de classement, jamais de baisse de niveau, pas de relance, pas de contenu verrouillé, pas de certificat.
- **4 questions pour toi** en section 4, dont une qui rouvre ta décision du 12/11 (C4).

## 1. État réel (code lu)

### 1.1 Combien d'XP gagnables au total

| Parcours | Étapes | Total gagnable (étapes + bonus de fin de 100) | Source |
|---|---|---|---|
| Machine à Café | 3 | 325 | test `progression-s17.test.ts` (« 325, pas 225 ») |
| Répartie | 4 | 475 | capture s19, « 0 XP gagné sur 475, bonus de fin compris » |
| Confiance | 6 | 800 | capture s19, « 50 XP gagnés sur 800 » |
| Storytelling | 6 | 800 | capture s19, idem |
| Boulot | 6 | 700 | capture s19, « 0 XP gagné sur 700 » |
| **Total** | **25** | **3 100** (dont 2 600 d'étapes et 500 de bonus) | somme |

- Une étape rapporte entre 50 et 200 XP selon le seed (moyenne de 104 sur les 25 étapes : 2 600 / 25). L'étape 1 de Machine à Café vaut 50 (lue dans `parcours-seed.json`).
- [À VÉRIFIER @fullstack] Les totaux viennent d'affichages de captures (s19) et d'un test, pas d'une somme refaite sur les trois fichiers de seed actuels. Les parcours Storytelling et Boulot ne comptent que s'ils sont publiés (`parcours-publication`).
- **Seules sources d'XP lues dans le code** : la validation d'une étape (XP de l'étape) et le bonus de fin de parcours (100). Une troisième voie existe : `POST /api/user/xp` accepte un montant de 1 à 500 envoyé par le navigateur d'un abonné Premium. [À VÉRIFIER @fullstack] qui l'appelle encore. Si personne, elle permet de s'attribuer des XP à la main : 10 appels de 500 donnent aujourd'hui « Légende », et le niveau n'a alors plus de sens.
- Conforme à C4 (12/11) : la rafale quotidienne et les fiches ne rapportent aucun XP.
- `docs/content/progression-levels.md` est **obsolète, vérifié** : il décrit des gains (+2 par blague lue, +5 par connexion, bonus de série, badges) qui n'existent dans aucun des deux chemins de crédit lus, et une série comptée sur la connexion alors que la décision du 07/10 la compte sur la pratique.

### 1.2 En combien de temps, pour un abonné régulier

- **Rythme conseillé** : une étape par semaine, étape suivante conseillée 7 jours après la dernière validation (rythme doux, rien n'est bloqué).
- [HYPOTHÈSE] « abonné régulier » = une étape par semaine. Aucune donnée d'usage ne le confirme.
- Au rythme conseillé, **25 étapes = 25 semaines, environ 6 mois**, si les parcours se suivent. Rien n'empêche d'aller plus vite : valider une étape est un geste déclaratif (le quiz d'étape précède, la validation est un clic). Un abonné pressé peut atteindre 3 100 XP en un week-end. **Le niveau mesure donc une activité déclarée, pas une compétence en répartie.**
- Le niveau ne descend jamais : le code ne fait qu'incrémenter l'XP et recalcule le niveau vers le haut.

### 1.3 Où l'abonné plafonne

- Seuils actuels : Novice 0, Apprenti 100, Farceur 500, Comique 1 500, Légende 5 000.
- 3 100 XP = **62 % des 5 000** demandés. Plafond réel : **Comique**.
- À 3 100 XP, la barre affiche 1 600 sur 3 500 (46 %) vers « Légende » et la phrase « Ça avance, et ça commence à s'entendre » : l'abonné qui a **tout fait** voit une barre à moitié. C'est le défaut le plus visible.
- Passages au fil des parcours (totaux de fin de parcours seulement, sans inventer de valeur par étape) :

| Cas (1 étape par semaine) | Cumul de fin de parcours | Niveau actuel à la fin |
|---|---|---|
| Sophie : Machine à Café puis Boulot | 325 (sem. 3), 1 025 (sem. 9) | Apprenti, puis Farceur |
| Yanis : Répartie puis Confiance | 475 (sem. 4), 1 275 (sem. 10) | Apprenti, puis Farceur |
| Marc : Confiance puis Storytelling | 800 (sem. 6), 1 600 (sem. 12) | Farceur, puis Comique |

Le niveau « Comique » arrive ainsi après 12 semaines ou plus, et seulement en enchaînant deux gros parcours. Sophie et Yanis, sur leurs parcours naturels, ne l'atteignent pas.

### 1.4 Ce qu'un niveau change à l'écran aujourd'hui

- Un seul endroit lu : la carte « Progression » de `/profil` (Premium seulement) : une icône emoji, le nom du niveau, le total d'XP, une barre vers le niveau suivant avec pourcentage, « Prochain niveau : X » et une phrase selon l'avancement (cinq phrases dans `PROGRESSION_NIVEAU`).
- Au moment où une étape est validée : une bulle « +X XP » (qui contient un emoji dans le code) et, côté serveur, un indicateur `levelChanged`. [À VÉRIFIER @fullstack] si l'écran affiche un message de changement de niveau.
- **Rien d'autre** : aucun contenu, aucune fonction, aucune page ne dépend du niveau dans les fichiers lus [À VÉRIFIER par une recherche de `user.level` dans `apps/`]. Hors abonnement, l'affichage disparaît, les données restent.
- Dette technique : les seuils existent **en double** (`XP_THRESHOLDS` dans `progression.ts` et `USER_LEVELS` dans `utils.ts`) ; le niveau est un type fermé en base (`UserLevel`, 5 valeurs).

## 2. Diagnostic

### 2.1 Les noms

| Nom actuel | Problème |
|---|---|
| Novice | Vocabulaire de jeu ou de classe : « tu es débutant » est la première chose que lit Yanis, qui manque déjà de confiance. |
| Apprenti | Registre scolaire et hiérarchique (maître et élève). Les trois mots qui ne définissent pas la marque : Corporate, **Scolaire**, Vulgaire. |
| Farceur | Du ton maison, mais décrit un farceur (faire des blagues), pas quelqu'un qui a de la répartie, le cœur de l'offre. |
| Comique | Un verdict : l'espace dit « tu es comique ». Aucun mécanisme ne le prouve (XP déclarés). |
| Légende | Promesse démesurée et, en plus, inatteignable. |

Bilan : deux noms scolaires, deux verdicts de compétence, un nom hors sujet. Rien ne rattache l'échelle au moment où l'on sent qu'on a progressé.

### 2.2 Les seuils

- **Atteignables ?** Pas tous : le dernier est à 5 000 pour 3 100 gagnables.
- **Motivants ?** Le premier passage (100 XP, après une ou deux étapes) est bon pour Yanis : récompense rapide. Le grand creux est entre 500 et 1 500 : les trois personas y restent de la semaine 5 à la fin du premier grand parcours.
- **Mal calés sur la structure réelle** : les seuils ne correspondent à aucun événement lisible (un parcours bouclé, deux parcours). Les nouveaux seuils proposés sont donc **accrochés aux fins de parcours** (325, 475, 700, 800 sont les totaux réels).
- **Fragilité** : ajouter, retirer ou retoucher un parcours déplace les totaux sans que personne ne regarde les seuils. Garde-fou proposé en section 3 (test automatique).

### 2.3 Le rôle des niveaux : activité, pas progrès réel

- Le progrès réel en répartie est **mesuré ailleurs** dans l'espace : la courbe « Tu avais une réponse ? » de « Ton mois » (v11 §2.2), auto-déclarée, sans note ni pente colorée.
- Le niveau, lui, ne dit que « combien de parcours as-tu avancé ». Il n'a de valeur que comme **repère de chemin** et petit plaisir de franchir un cap. Il doit donc : (1) ne jamais prétendre mesurer le talent, (2) ne jamais passer devant la courbe, (3) ne pas servir de motif de relance.
- Conséquence de C4 (12/11) : un abonné qui ne fait que la rafale quotidienne ne gagne ni XP ni niveau. C'est cohérent avec la décision, mais le niveau décrit alors **les parcours et rien d'autre**. À dire clairement à l'écran (« tes parcours ») plutôt que de laisser croire qu'il résume tout l'espace.

### 2.4 Les risques

| Risque | Où il se loge | Garde-fou retenu dans les propositions |
|---|---|---|
| Pression, « il me manque 340 XP » | Barre avec pourcentage et compte à rebours | Pas de pourcentage ni d'XP restants sur la barre de niveau ; seul le nom du prochain repère est dit |
| Culpabilité de la baisse ou de la série | Niveau qui retombe, série à 0 | Niveau jamais en baisse (déjà vrai) ; la phrase de série à zéro reste « Ta série démarre à ta prochaine étape » |
| Verdict de compétence | Noms « Comique », « Légende » | Noms qui disent une position ou une action, jamais « tu es drôle » |
| Certificat déguisé | Dernier niveau vécu comme un diplôme | Décision du 07/10 : pas de certificat de fin ; aucun visuel de diplôme, aucune page partageable |
| Verrou caché | Niveau qui ouvre du contenu | Décisions du 18/10 (tout reste ouvert) et du 19/10 (Premium = tout ouvert) : un niveau ne débloque rien |
| Pression sociale | Classement, niveau visible des autres | Règles v11 : aucun classement, aucune note qui juge ; niveau visible seulement de l'abonné |
| Relance | Notification « tu es à 50 XP du niveau » | Règles v11 et Q6 (12/11) : cloche pour les contenus et les réponses de l'équipe seulement, jamais de relance d'inactivité |
| Triche | Appel libre à `/api/user/xp`, validation par clic | Vérification par @fullstack (1.1) ; le niveau ne porte aucune récompense, donc l'enjeu reste faible |
| Rouvrir un choix documenté | Toucher aux XP d'étape, au bonus, à la série | P0 s8 : un `[CHOIX UTILISATEUR]` n'est pas re-questionné. Les XP et le bonus sont « intouchables » depuis les étalons s17 : **aucune proposition ne les modifie** |

## 3. Trois propositions

### 3.0 Ce qui est commun aux trois (rien de tout cela ne dépend de ton choix de noms)

- **Ce qui rapporte** : inchangé. Étape validée = XP de l'étape (50 à 200 selon le seed), bonus de fin de parcours = 100. La rafale, les fiches, les jeux et « Ton mois » ne rapportent rien (C4, 12/11). La série reste « jours de pratique » (07/10). **Aucune de ces règles n'est touchée.**
- **Ce qu'un niveau débloque** : **rien**. C'est un repère. Raison : tout reste ouvert (18/10), Premium = tout ouvert (19/10), pas de certificat (07/10), aucune note qui juge (v11).
- **Niveaux** : 5, avec les 5 valeurs existantes en base (aucune migration de structure ; seuls les libellés changent).
- **Affichage** (à valider par @ux) : l'icône emoji est remplacée par un repère en texte (« 3 sur 5 ») ; la barre vers le niveau suivant **sans pourcentage ni XP restants**, avec seulement le nom du prochain niveau ; le total d'XP reste visible ; au franchissement d'un niveau, **une seule phrase, une seule fois**, dans l'écran où l'étape est validée, de la forme « {nom} : nouveau niveau. Le prochain se gagne en pratiquant. » Aucun e-mail, aucune cloche, aucun badge visible des autres abonnés, aucune page partageable. Place dans l'espace : en tête de « Parcours » et dans « Ton mois », **jamais dans la barre de rubriques ni sur les pages publiques**, et jamais plus visible que la courbe « Tu avais une réponse ? ».
- **Niveaux existants des abonnés** : recalculés une fois. Les seuils proposés sont tous inférieurs ou égaux aux actuels (100 reste 100, les trois autres baissent), donc **aucun abonné ne perd un niveau** : le recalcul ne peut que faire monter.
- **Garde-fou** : un test automatique vérifie que le dernier seuil ne dépasse pas 80 % du total d'XP des parcours publiés (74 % avec 2 300 sur 3 100). Si un parcours est retiré ou retouché, le test échoue au lieu de rendre le dernier niveau inatteignable en silence.

### 3.1 Proposition 1, « Même échelle, bien réglée » (étalon de noms N1)

- **Noms** : les actuels (Novice, Apprenti, Farceur, Comique, Légende).
- **Seuils** : 0, 100, 300, 700, 2 300 XP (voir 3.4 pour la justification).
- **Ce qui change** : seulement les chiffres et l'affichage commun. **Garde** les défauts de noms du 2.1 (deux scolaires, deux verdicts).
- **Pour** : changement minimal, aucun texte nouveau à faire relire. **Contre** : le diagnostic des noms reste vrai.

### 3.2 Proposition 2, « Repères de scène » (étalon de noms N2) : **recommandée**

- **Idée** : un niveau dit **où tu en es sur le chemin**, avec le vocabulaire du stand-up (l'un des 3 mots de la marque), sans jamais dire « tu es drôle ».
- **Noms et seuils** : voir N2 en 3.5. Mêmes seuils que la proposition 1 : 0, 100, 300, 700, 2 300 XP.
- **Pour** : aucun nom scolaire ni verdict ; le premier niveau est confortable (« Dans le public » : on est là, on regarde, ça compte) ; chaque nom est lisible en trois secondes sur téléphone. **Contre** : la métaphore de la scène peut sonner ambitieuse pour Yanis, qui veut de la répartie en soirée et non monter sur scène ; « Tête d'affiche » est le nom le plus contestable.

### 3.3 Proposition 3, « Par parcours bouclés » (étalon de noms N3)

- **Idée** : le niveau ne dépend plus des XP mais du **nombre de parcours terminés** : 0, 1, 2, 3, 5. L'XP reste un compteur visible, sans rôle dans le niveau.
- **Noms** : voir N3 en 3.5, à la 2e personne (« Tu rebondis »).
- **Pour** : le sens est évident (un niveau = un parcours de plus) et le dernier niveau est trivialement atteignable (finir les cinq). Pas de seuil à recaler si les XP changent un jour. **Contre** : le premier changement n'arrive qu'après la fin d'un parcours, au plus tôt à la semaine 3 au rythme conseillé : Yanis et Marc voient « Tu t'échauffes » plus longtemps ; un changement de code plus profond (le niveau se calcule à partir des parcours terminés, plus des XP).

### 3.4 Pourquoi 0, 100, 300, 700, 2 300 (propositions 1 et 2)

| Seuil | Ce qu'il représente (propriété vraie sur les totaux réels) |
|---|---|
| 100 | une ou deux premières étapes (étape 1 de Machine à Café : 50 XP) |
| 300 | **tout parcours bouclé** : le plus court en fait 325 |
| 700 | **un grand parcours bouclé** (700 à 800) ou **deux petits** (au moins 800) |
| 2 300 | **quatre parcours** : la plus petite somme de quatre parcours est 325 + 475 + 700 + 800 = 2 300 |

Les trois personas (cumuls du 1.3) : Sophie passe au 3e niveau à la semaine 3 puis au 4e pendant Boulot ; Yanis au 3e à la semaine 4 puis au 4e pendant Confiance ; Marc au 4e à la fin de Confiance, semaine 6. Aucun des trois n'atteint le dernier niveau avant au moins 19 semaines (3 + 4 + 6 + 6 étapes pour les quatre parcours les plus courts), soit environ 5 mois : c'est volontairement un long chemin.

### 3.5 Les trois étalons de noms à faire valider par Thomas

| Niveau | N1, noms actuels (P1) | N2, repères de scène (P2) | N3, tu + verbe (P3, par parcours bouclés) |
|---|---|---|---|
| 1 | Novice (0 XP) | Dans le public (0 XP) | Tu t'échauffes (0 parcours) |
| 2 | Apprenti (100 XP) | Premier micro (100 XP) | Tu te lances (1 parcours) |
| 3 | Farceur (300 XP) | Scène ouverte (300 XP) | Tu rebondis (2 parcours) |
| 4 | Comique (700 XP) | Première partie (700 XP) | Tu places tes vannes (3 parcours) |
| 5 | Légende (2 300 XP) | Tête d'affiche (2 300 XP) | Tu as fait le tour (5 parcours) |

Une ligne de description sous chaque nom de N2 (la seule à relire de près) :
1. Dans le public : « Tu es dans la salle, tu regardes comment ça se fait. »
2. Premier micro : « Tu as validé tes premières étapes : tu essaies pour de vrai. »
3. Scène ouverte : « Un premier parcours en poche ou presque. »
4. Première partie : « Un grand parcours, ou deux petits, derrière toi. »
5. Tête d'affiche : « Quatre parcours à peu près : tu connais la maison. »

Rendu de la carte, exemple N2 à 412 XP : « Scène ouverte · niveau 3 sur 5 · 412 XP · Prochain niveau : Première partie ». Le niveau est lisible sans chiffre de pourcentage.

Ce que Thomas tranche avec ces étalons : (1) le registre (scolaire/jeu, scène, tu + verbe), (2) le dernier nom (le plus exposé), (3) si l'on dit « niveau » ou « repère » à l'écran (reco : « niveau », mot déjà en place). Les trois jeux passent la même relecture à l'aveugle avant d'être montrés : « un nom lu seul se comprend-il en 3 secondes ? », « dit-il un verdict de talent ? » (non attendu), « sonne-t-il scolaire ou corporate ? » (non attendu).

### 3.6 Recommandation

**Proposition 2** (N2, 0 / 100 / 300 / 700 / 2 300, rien débloqué, affichage commun du 3.0). Raisons : elle corrige les trois défauts (verdicts, noms scolaires, dernier niveau inatteignable) sans toucher à aucun choix documenté ; elle garde un premier palier rapide pour Yanis (100 XP) ; les seuils s'accrochent à des événements que l'abonné reconnaît (un parcours, un grand parcours, quatre parcours). Écartée : la proposition 1 (garde les verdicts) et la proposition 3 (palier initial lent, code plus profond). **Supprimer les niveaux** a été examiné et non retenu : ils sont promis dans le positionnement (« XP, streak, niveaux », `project-context.md`) et ne coûtent rien à l'abonné s'ils ne sont ni bloquants ni pressants ; Thomas peut le demander.

### 3.7 Critères de réussite (binaires, pour @fullstack et @qa)

1. Les seuils sont strictement croissants et le dernier est inférieur ou égal à 80 % du total d'XP des parcours publiés (test automatique).
2. Un abonné ayant terminé quatre parcours quelconques est au niveau 5.
3. Le niveau ne diminue jamais quand l'XP augmente ; le recalcul des niveaux existants n'en fait baisser aucun.
4. Aucun libellé de niveau, d'aide ou de phrase de la carte ne contient d'émoji, de tiret cadratin, de pourcentage ou d'XP restants.
5. Les seuils n'existent qu'à un seul endroit du code (la double définition `XP_THRESHOLDS` / `USER_LEVELS` est supprimée).
6. Aucun contenu, aucune page ni aucune fonction n'est ouvert ou fermé selon le niveau (revue de `user.level` dans `apps/`).
7. Mesure sans donnée personnelle ni identifiant : un événement « niveau atteint » avec le seul niveau, pour voir plus tard si un niveau n'est atteint par personne. Lecture soumise à l'effectif minimal de v11 §7.6 (aujourd'hui 4 abonnés actifs : elle ne décide rien).

## 4. Questions pour Thomas

Chaque question a trois options et une recommandation. Une option qui rouvre une décision prise est marquée.

**Q1. Quel jeu de noms, et sur quelle règle ?**
- A. Les noms actuels (Novice, Apprenti, Farceur, Comique, Légende), seuils recalés. Minimal, mais « Comique » et « Légende » restent des verdicts.
- B. **Reco** : Repères de scène (Dans le public, Premier micro, Scène ouverte, Première partie, Tête d'affiche), seuils recalés.
- C. « Tu + verbe » (Tu t'échauffes, Tu te lances, Tu rebondis, Tu places tes vannes, Tu as fait le tour), un niveau par parcours bouclé.
Tu peux aussi modifier un seul nom : le dernier est le plus exposé.

**Q2. À quelle distance mettre le dernier niveau ?** (options A et B de Q1)
- A. **Reco** : environ quatre parcours (2 300 XP), soit 5 mois environ au rythme conseillé. Reste un long chemin, atteignable sans tout faire.
- B. Environ trois mois (1 600 XP, deux grands parcours) : plus vite fêté, mais il ne reste plus rien à gagner ensuite côté niveau.
- C. Tout le site (3 100 XP) : seul celui qui a tout fait l'atteint, et le moindre changement de parcours le rend inatteignable.

**Q3. Un niveau doit-il débloquer quelque chose ?**
- A. **Reco** : rien, c'est un repère. Cohérent avec « tout est ouvert » (18/10 et 19/10).
- B. Un petit contenu bonus par niveau (à écrire, relu à 10/10) : **rouvre en partie la décision du 18/10** (un contenu serait derrière un niveau).
- C. Un niveau visible des autres abonnés : non recommandé (aucun classement, aucune pression sociale).

**Q4. La rafale quotidienne et les fiches doivent-elles compter pour le niveau ?** (pour mémoire, déjà posée en C4)
- A. **Reco** : non, rien ne change. Le niveau dit « tes parcours » et on le précise à l'écran.
- B. La rafale compte pour la série seulement, jamais pour les points : **rouvre la décision du 12/11 (C4)** et précise celle du 07/10.
- C. La rafale et les fiches rapportent aussi des XP (barème à fixer avec toi) : **rouvre la décision du 12/11 (C4)** et ajoute une règle de points.

**Tranché sans question** (aucune décision rouverte) : XP d'étape et bonus de fin inchangés ; niveau jamais en baisse ; recalcul unique des niveaux existants, vers le haut seulement ; aucun e-mail ni notification liés aux niveaux ; pas de certificat ni de page partageable ; icône emoji remplacée par un repère texte ; les seuils mis à un seul endroit du code.

## 5. À traiter par les autres agents après ta réponse

- **@fullstack** : vérifier les appelants de `/api/user/xp` (1.1) et la somme d'XP des seeds ; centraliser les seuils ; recalculer les niveaux une fois ; test de garde de 3.0 ; remplacer `docs/content/progression-levels.md` (obsolète) par le barème retenu. Aucun fichier de `apps/` n'a été modifié par cette session.
- **@ux** : place de la carte dans « Parcours » et « Ton mois » (3.0), rendu mobile 375 px, lisibilité des cinq noms.
- **@legal** : rien à ajouter, aucune donnée nouvelle (le niveau se calcule à partir de l'XP ou des parcours terminés déjà en base).
- **@data-analyst** : un événement « niveau atteint » sans identifiant (critère 7).

