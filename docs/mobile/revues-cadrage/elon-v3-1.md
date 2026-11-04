# Revue à l'aveugle du cadrage app native v3.1 (@elon, s23, tour 5, 04/11/2026)

> AVIS CONSULTATIF : validation requise avant exécution. Objet relu : `docs/mobile/cadrage-app-native-s23.md` (v3.1, 339 lignes), contre ma revue `elon-v3.md`.
> Décisions actées, non discutées ici : app iPhone native, Android ensuite ; génération IA quotidienne coupée et production par lot en session (choix de Thomas du 30/09 et du 01/10, non rediscutables). Une décision de Thomas correctement posée n'est pas comptée comme défaut.
> Revues v3.1 des autres relecteurs non lues. Contrôles faits dans le corps du texte (§3.2, §3.3, §5.1, §6, §12, §13, §14), pas seulement dans la traçabilité du §16.

## 0. Verdict en une ligne

Les trois obligatoires de la v3 sont dans le texte et elles tiennent : la jauge peut sonner, la série de Yanis ne casse plus à minuit (si Thomas dit oui à la décision 18, et l'autre cas est écrit honnêtement), et le build 0 ne dépend plus que du geste. **9/10, aucune correction obligatoire restante.** Il reste deux défauts de calibrage sur le stock, à corriger par écrit avant que @data-analyst ratifie les seuils : la règle de mélange fait baisser la jauge quand on ajoute des vannes, et le débit mesuré est celui d'une machine qui ne tourne plus.

## 1. Notes

| Critère | v0 | v1 | v2 | v3 | v3.1 | Justification courte |
|---|---|---|---|---|---|---|
| Valeur persona | 5 | 8 | 8,5 | 9 | **9** | Inchangé, et c'est bien : vannes réelles copiées de la base, défi de 30 s avec un format et une règle d'échec, thèmes à leur vraie taille. |
| Clarté du geste quotidien | 4 | 7,5 | 8,5 | 9 | **9,5** | Une seule horloge pour la série, celle du jour de contenu à Paris. Notification, écran, défi, série et compte portent le même identifiant et le même jour. Le cas 22 h puis 0 h 30 est écrit, avec son test Jest. |
| Centre de gravité du périmètre | 5 | 7 | 8 | 8,5 | **9** | Le lot 7 dépend de GO contenu-0, qui ne porte que sur le geste (5 vannes + 3a). 1b, 3b et 3c sont sortis du chemin du build 0. La décision 7 bis est en tête de chaîne (§1, §13). |
| Différenciation vs site | 6 | 8 | 8,5 | 9 | **9** | Inchangé : vanne assignée par thème, défi de 30 s, hors ligne, Copier en 1 geste, widget. |
| Lien avec la conversion | 4 | 7,5 | 8,5 | 8,5 | **9** | Le premier jour Premium de Yanis ne casse plus sa série (bascule à 4 h, décision 18) ; si Thomas refuse, l'écart est écrit et relu en TestFlight, ce qui est une décision correctement posée, pas un trou. |
| Hypothèses testables | 3 | 6,5 | 8 | 8,5 | **9** | H-stock a une jauge qui peut sonner (jours de thème), un garde-fou (première répétition), une mesure de débit, une alerte chiffrée et une action. Pas 9,5 : voir SV10 et SV11. |
| **Globale** | **4,5** | **7,5** | **8,5** | **8,5** | **9** | La jauge marche, le tuyau est propre, le build 0 est découplé. Ce qui reste est du réglage de seuil, pas de l'architecture. |

## 2. Statut des obligatoires v3 (vérifiées dans le corps du texte)

| Correction | Statut | Où dans le texte | Ce qui manque |
|---|---|---|---|
| **NO4 (a)** Jauge « jours de thème avant épuisement » | **Traitée** | §3.2 « Règle de mélange » (soirées seul : épuisé au jour 27 ; « le repli sur le tout public masque la pénurie, la première répétition seule ne sonnerait jamais ») ; §6 H-stock (jauge, garde-fou) ; décision 7 (horizon en jours de thème) | Les chiffres d'alerte (soirées 27, vie étudiante 15, couple et dates 78, boulot 87) sont maintenant des jours, et marqués « avant validation des défis et recouvrement ». La colonne ne contredit plus sa mesure. Voir SV10 pour le cas des thèmes cumulés. |
| **NO4 (b)** Débit | **Traitée à la lettre** | §6 H-stock « débit de vannes validées par catégorie sur les 90 derniers jours » ; lot C(a) | La mesure existe. Mais son [HYPOTHÈSE : rotation de catégories à peu près uniforme] est un reste du joke-agent, et la fenêtre de 90 jours mesure surtout un pipeline coupé depuis le 30/09. Il manque le débit CIBLE (SV11). |
| **NO4 (c)** Production orientée par lot, à partir des inactives | **Traitée** (forme adaptée au choix de Thomas) | Lot C(d1) : « production orientée vers les thèmes en déficit (SOIREES et ECOLE d'abord), en partant des 720 vannes inactives corrigées et relues à l'aveugle (P0 s18), la rédaction neuve ensuite, chaque lot avec ses défis » ; C(a) mesure « la part récupérable des 720 vannes inactives par catégorie » ; §3.6 (c) et (d) | Le pilotage automatique de `plannedCategory` que je demandais en v3 est remplacé par une production par lot en session. C'est le bon remplacement : il respecte la coupure du pipeline (30/09, 01/10) et garde la priorité par déficit. Rien à redire. |
| **NO4 (d)** Critère binaire avant le lot 8 | **Traitée** | Lot C(d1) : « avant le lot 8, un thème qui ne tient pas l'horizon n'est pas proposé à l'écran 2 (alt. D de la décision 5, thème par thème) » | La colonne « Dépend de » du lot 8 ne cite pas le contrôle. Ce n'est pas une attente (le thème est masqué, pas le lot), mais il faut dire qui fixe la liste des thèmes proposés et sur quelle mesure (SV12). |
| **NO5** Série du compte, bug de minuit | **Traitée** | §3.2 tableau « trois horloges », ligne série : une seule horloge, jour de Paris de l'instant de pratique, bascule à 4 h ; paragraphe « Si Thomas refuse la bascule à 4 h » (cas 22 h / 0 h 30 écrit) ; test Jest ; heure d'envoi entre 4 h et 23 h 45 ; écart limité au hors Europe, correctement cette fois ; §3.3 (horloge reprise pour le visiteur, test « bascule de 4 h ») ; §12 S12 au lot 5b-1 ; décision 18 avec reco et alternative | Rien. Les deux séries coïncident pour un utilisateur à Paris, la fusion se fait sans conversion, l'objection des deux horloges sur une colonne tombe. Le refus éventuel de Thomas est posé avec sa conséquence : ce n'est pas un défaut. |
| **NO6** GO contenu-0 et GO contenu-1 | **Traitée** | §5.1 (GO contenu-0 = 5 vannes tirées en base avec leur défi + textes 3a ; GO contenu-1 = 3b et 3c) ; lot 7 « C(d0), GO contenu-0 » ; lots 10 et 13 « GO contenu-1 » ; décision 8 bis | Vérifié par la chaîne : lot 7 dépend de 0, 1a, 3a, 5b-0, 6a, 2, C(d0), GO contenu-0 ; 5b-0 de 1a, C(a), C(u). Aucun chemin ne passe plus par 1b. |
| NO6, décision 7 bis en tête de chaîne | **Traitée** | §1 « Chemin critique » ; §13 « Tête de chaîne » | Rien. |
| **SV6** Variante B en reco | **Traitée** | §3.2 « Écran verrouillé et widget » ; décision 5 (variante B en reco, C et D inoffensives, liste propre à l'app, [CHOIX UTILISATEUR] du 24/10 non rouvert) | Rien. |
| SV5 Rattrapage par l'usine | **Sans objet, résolu par le fond** | §3.6 (b), (c) ; lot C(d0) | Avec la production par lot en session, le rattrapage et la production suivante utilisent les mêmes outils (prompt et grille d'@ia, relecture 2 sur 3). Mon souci (deux styles de défi) disparaît. |
| SV7, SV8, SV9 | **Non reprises** (déclaré au §16) | §6 et §15 gardent [À VÉRIFIER : taille de la base de testeurs] | Toujours souhaitables, voir §4. |

## 3. Corrections OBLIGATOIRES restantes

**Aucune.** Les trois obligatoires de la v3 sont traitées dans le corps du texte. Ce qui suit ne bloque pas le 9/10.

## 4. Corrections SOUHAITABLES

**SV10. La règle de mélange fait baisser la jauge quand on ajoute du stock** (§3.2 « Règle de mélange », §6 H-stock). La plus importante des restantes.
- **Le défaut** : sous 60 vannes cochées (union), un jour sur 3 dans le thème, donc jauge = 3 × pool ; à partir de 60, thèmes seuls, donc jauge = pool. Exemple sur les tailles du §3.2 : Marc avec « couple et dates + boulot » (55, sans recouvrement compté) a 165 jours de thème ; s'il coche aussi « soirées » (64), il tombe à 64 jours. Même effet quand C(d1) fait passer une union de 59 à 60 : la jauge passe de 177 à 60 jours. La production fait reculer l'indicateur, et le critère d'avant le lot 8 pourrait masquer un thème mieux fourni qu'un autre qu'il laisse passer.
- **Fix (une ligne)** : le seuil de bascule vers « thèmes seuls » = l'horizon de la décision 7 exprimé en vannes utiles (90 pour 90 jours), pas 60. La jauge reste alors au-dessus de l'horizon des deux côtés de la bascule, et l'alerte « sous 60 jours » reste cohérente. Écrire aussi la formule pour le cas ≥ seuil (jauge = pool) au §6, et préciser que le critère avant le lot 8 se lit par thème ET pour les combinaisons proposées.
- C'est une [HYPOTHÈSE à ratifier] par @data-analyst : à corriger avant la ratification, sinon le seuil sera ratifié avec son effet de bord.

**SV11. Remplacer le débit historique par un débit cible** (§6 H-stock, lot C(a), §3.6 (d)).
- Le pipeline quotidien est coupé depuis le 30/09 et le 01/10 (choix de Thomas). Mesurer le débit validé sur les 90 derniers jours, c'est mesurer un moteur arrêté. Garder la mesure comme constat, et retirer l'[HYPOTHÈSE : rotation de catégories à peu près uniforme], qui ne décrit plus rien.
- Ce qui protège le geste maintenant, c'est la physique du réservoir : une installation consomme 1 vanne de son thème tous les 3 jours sous le seuil. Pour qu'une installation ancienne ne tombe jamais à sec, chaque thème proposé sous le seuil doit recevoir environ 10 vannes validées avec défi par mois. Pour l'horizon de la sortie : 90 jours = 30 vannes utiles par thème, soit environ +21 pour soirées et +25 pour vie étudiante [calcul sur les tailles du §3.2, avant recouvrement et validation des défis].
- **Fix** : écrire ces deux nombres comme commande du lot C(d1) (stock de sortie) et comme quota par thème du lot mensuel du playbook (entretien), avec H-stock relu chaque mois après la sortie, pas seulement au lot C(a).

**SV12. Dire qui fixe la liste des thèmes proposés** (lot 8, C(d1)). Une ligne : la liste des thèmes affichés à l'écran 2 est un réglage (config ou interrupteur), fixé avant le lot 8 au vu de la jauge remesurée après C(d0) et C(d1), et revu à chaque lot mensuel. Sinon le critère existe mais personne n'appuie sur le bouton.

**SV7 (reconduite). Mesurer maintenant la base de recrutement.** Comptes, inscrits à la lettre mensuelle, abonnés : lecture seule, sans Thomas. Si c'est quelques dizaines, H1, H3' et H7 à 20 installés ne seront pas atteints en 14 jours ; mieux vaut l'écrire avant le build 0 que découvrir la règle J14 en cours de test.

**SV8 (reconduite). Type de défi à soumettre à l'étalon 3** : partir de l'exemple qui termine chaque « À toi de jouer » (déjà validé, déjà en base). Format seulement, à caler avec Thomas (P0 s8).

**SV9 (reconduite, hors cadrage). Doublon « À toi de jouer : »** sur les fiches B et D : si le libellé s'affiche deux fois sur le site, c'est un défaut en ligne à corriger indépendamment de l'app (retrait d'un préfixe, `REPLIT_ACTIONS.md`).

## 5. Ce qui fonctionne, ne pas toucher

- §3.2, tableau « trois horloges » : maintenant juste sur ses trois lignes. Le contenu de l'app vit au jour local, la série au jour de Paris avec bascule à 4 h, le site reste en UTC. À Paris, contenu et série coïncident. C'est la bonne simplification : une seule horloge par usage, pas de conversion.
- §3.2 « Règle de mélange » : la phrase qui explique pourquoi la première répétition ne sonnerait jamais. Le document dit pourquoi l'indicateur est choisi, pas seulement lequel.
- §3.6 : chaîne par lot en session, import indexé par identifiant, empreinte, sortie du pool en cas de retouche. La coupure du pipeline est respectée sans perdre la qualité ni la traçabilité.
- §5.1 : GO contenu-0 et GO contenu-1, chacun branché sur les lots qu'il conditionne. Le contenu est jugé sur du contenu, au moment où il sert.
- Lot C(d1) : les 720 inactives d'abord, corrigées et relues à l'aveugle, puis la rédaction neuve. Le minerai le moins cher avant la mine neuve, sans toucher à la règle d'or.

## 6. Hypothèses de cette revue et zones non auditées

- [HYPOTHÈSE] Calculs de SV10 et SV11 faits sur les tailles du §3.2, sans recouvrement entre catégories ni part de défis validés : à refaire après C(a) et C(d0).
- [À VÉRIFIER] Taille de la base de testeurs ; affichage du doublon sur le site ; part récupérable des inactives par catégorie.
- Non audité : faisabilité fine (revue @fullstack), règles Apple et juridique (revue @legal), §7 à §11 lus sans contre-vérification dans le code, maquettes inexistantes. Grille de Thomas (§1) toujours en attente : condition de conformité à SA grille, pas de la qualité du plan.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/elon-v3-1.md`
- Avis : globale **9/10** (valeur 9, geste 9,5, centre de gravité 9, différenciation 9, conversion 9, hypothèses 9). NO4, NO5, NO6 et SV6 traitées dans le texte ; SV5 résolue par la production par lot ; SV7 à SV9 non reprises.
- Obligatoires restantes : aucune. Souhaitables : SV10 (seuil de bascule de la règle de mélange = horizon, pas 60 ; la plus importante), SV11 (débit cible par thème à la place du débit historique), SV12 (qui fixe la liste des thèmes avant le lot 8), SV7, SV8, SV9.
- À ré-invoquer si on corrige : @product-manager (SV10 à SV12, trois lignes), @data-analyst (ratification des seuils après SV10, base de testeurs).
- Points pour Thomas : décisions 7 (horizon), 7 bis, 8 bis, 5, 18, inchangées.
- Rappel : ce sont des AVIS, pas des directives. L'utilisateur décide.
---
