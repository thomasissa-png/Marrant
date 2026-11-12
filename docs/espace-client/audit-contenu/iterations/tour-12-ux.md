# Tour 12, relecteur @ux (à l'aveugle) : `architecture-contenu-v12.md` (décisions de Thomas appliquées)

> Relu : résumé, en-tête, section 2 (2.2 à 2.9 en entier), 3.8 et 3.12, 4.1 à 4.5, 5.5, 6.1 à 6.3, 7.4 à 7.7, section 8 (Décisions), section 9 (par passages), annexes (par passages). Référence qui fait foi : `docs/founder-preferences.md` l. 167 (dernière ligne du 12/11) ; l. 164, 165, 166 pour « Mes questions » et l'audience.
> Question posée : décisions appliquées fidèlement ? parties NEUVES (2.6, 2.7, 2.8, 2.9, 3.12, 4.2, 6.2) au niveau, côté parcours de l'abonné et navigation ?
> Limite : je compare au corps que j'avais relu en v11 ; je n'ai pas refait un diff mot à mot des sections inchangées.

## 1. Les décisions de Thomas sont-elles appliquées fidèlement ?

| Décision | Verdict | Remarque |
|---|---|---|
| C1 barre B | Fidèle | Barre « Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus », « Vocabulaire » bloc de la Bibliothèque ; aucune mesure de visiteurs ne décide de la barre ; 6 entrées |
| C2, C3, C4, C6, C7, C8, C11, C13 | Fidèles | Chacune écrite comme règle, avec son renvoi |
| C5 (rouvre le 25/10) | Fidèle, une lecture plus stricte que la sienne | Lettre nouvelle le jour de l'envoi ; archive « Lettres » dans « Plus » ; reprise dans « Quoi répondre » **retravaillée, jamais une copie, après un délai**. Thomas : « rien n'empêche après d'utiliser le contenu » ; la v12 propose le plus prudent (délai de 3 mois, retravaillée) et le marque « à relire avec Thomas » : acceptable |
| C9 | Fidèle | Une seule question, gardée sur le compte, rattachement du quiz au compte non retenu |
| C10 a | Fidèle | « Retiré par l'abonné » = demande explicite ; historique lisible après résiliation ; rien effacé sauf suppression du compte demandée |
| C10 b | Fidèle | Aucune ligne 3114, aucune détection ; l'équipe lit chaque message et traite au cas par cas ; le seul mécanisme automatique restant est l'alerte de retard (« 3 jours ouvrés »), qui n'a rien à voir avec le contenu du message |
| C12 | Fidèle | « Faisons ça bien » : coin dédié, étalon E6 avant toute production, exemple « à écrire à E6 », rien d'inventé |
| C14 | Fidèle | Après le paiement, toujours « Aujourd'hui » ; page de succès avec bouton « Continuer », lien de renonciation, message de bienvenue, e-mail E0 inchangé ; le `returnTo` choisit désormais le premier pas |
| Q5b (rouvre le 07/10) | Fidèle, un écart à confirmer | Thomas : « une note cadrée par fiche ». La v12 limite par défaut aux fiches à geste d'écriture ou de choix [RESTE À TRANCHER] : c'est plus étroit que « par fiche » ; à garder comme proposition, pas comme défaut (Y2) |
| Q6 | Fidèle | Cloche : contenus et réponses de l'équipe, jamais de relance d'inactivité ; plus de « L'équipe t'a répondu » dans « Aujourd'hui » |
| Q9 | Fidèle | Niveaux d'XP renvoyés à un document à part |
| Déploiement d'un coup | Fidèle | 6.2, 7.6 (lecture par cohortes, pas de mesure avant), 7.7 |

## 2. Notes

| Critère | T11 | T12 | Justification courte |
|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | Mes notes et l'archive ajoutent de la valeur sans pression ; la cloche rend la réponse de l'équipe visible |
| C2 Décisions de Thomas | 10 | 9 | Appliquées fidèlement ; deux lectures plus étroites que sa phrase (note « par fiche », reprise retravaillée) à lui montrer |
| C3 Zéro donnée inventée | 10 | 9 | Aucun chiffre neuf ; 3.12 sans texte d'humour noir, nombre de vannes « à lire en base » ; deux promesses à tenir sans preuve (« jamais lue par l'équipe », « jamais servi par surprise ») |
| C4 Rubriques claires, 6 entrées au plus | 9 | 9 | Barre B juste, 3 blocs de la Bibliothèque, « Plus » ordonné ; la cloche est bien hors des 6 (voir Y7) |
| C5 Ambition | 10 | 10 | Notes, archive, cloche, coin humour noir : V1 complète |
| C6 Cohérence | 9 | 8 | Deux contradictions internes dans les parties neuves (état « lu » de la cloche contre 2.6 ; garantie (a) de 2.8) et une dépendance (archive qui remonte ou non) |
| C7 Faisabilité | 9 | 9 | Chantier et phrases @legal comptés ; l'état « lu » de la cloche et les notes ajoutent des données à stocker (déjà signalées) |
| C8 Décisions et « reste à trancher » | 9 | 9 | Les lignes « reste à trancher » sont courtes et précises ; manquent trois précisions de conception (Y1 à Y3) |
| C9 Exemples au ton maison | 9 | 9 | Pas de nouvel exemple ; 3.12 le dit (E6) ; messages courts (« Ici, on rit de sujets graves, avec ceux qui te connaissent ») au bon ton |
| C10 Progression pédagogique | 9 | 9 | Arrivée sur « Aujourd'hui » avec le premier pas, cohérente avec 4.1 et 4.4 |
| **C11 Pertinence pour l'audience réelle** | 9 | 9 | L'humour noir est traité parce qu'il est mesuré, mais enfermé dans un coin choisi ; la note et l'archive servent le besoin « une fois seul, retrouver ce que j'ai fait » sans promesse de talent |

**Note globale C1 à C10 : 9,0 / 10** (90 sur 100). **Avec C11 : 9,0 / 10** (99 sur 110). T11 : 9,3 (les parties neuves ne sont pas encore au niveau des parties relues dix fois).

## 3. Corrections

### Bloquantes

**Y1. [BLOQUANT] La cloche n'a aucune spécification d'accessibilité, et son état « lu » contredit 2.6.**
Passages : 2.9 « un point neutre sur la cloche tant qu'il reste du non lu … une notification est lue à l'ouverture de la liste » ; 2.6 « la cloche signale “L'équipe t'a répondu” tant que la réponse n'a pas été ouverte » ; 6.1 « la cloche est un élément de l'en-tête, pas une entrée » ; brief §3.6 (D5).
Problème : (a) un point seul est invisible pour un lecteur d'écran et pour qui ne distingue pas la couleur ; le brief D5 prévoyait un nom accessible avec le nombre, la v12 le supprime (pour ne pas faire pression) sans le remplacer. (b) « Lue à l'ouverture de la liste » fait disparaître « L'équipe t'a répondu » dès qu'on ouvre la liste, alors que 2.6 dit qu'elle reste tant que la réponse n'est pas ouverte : un abonné qui ouvre la liste sans entrer dans le fil perd son seul signal. (c) Rien sur l'ouverture, le clavier, le focus, l'état vide, ni sur la place de la cloche sur mobile (32 à 44 px de large à côté de la recherche et du compte).
Correction (à intégrer en 2.9, et en test dans `header-budget.spec.ts`, 3 états) : bouton d'au moins 44 x 44 px, nom accessible « Notifications » plus « il y en a de nouvelles » ou « aucune nouvelle » (pas de nombre affiché ni annoncé, c'est le choix anti-pression) ; point neutre marqué par une forme (point plein à côté de l'icône) et non par la couleur seule, contraste d'au moins 3:1, sans clignotement ni animation ; la liste s'ouvre en feuille basse sur mobile et en fenêtre sur ordinateur, ferme à Échap et au clic dehors, le focus revient au bouton ; chaque notification est un lien d'au moins 44 px ; état vide « Rien de nouveau. Reviens quand tu veux. » (sans ton de reproche) ; **« L'équipe t'a répondu » reste non lu tant que le fil n'est pas ouvert**, les nouveautés sont lues à l'ouverture de la liste ; la cloche reste dans l'en-tête sur mobile (jamais dans le menu), rendue côté navigateur pour l'abonné seulement (pages publiques identiques pour Google).

**Y2. [BLOQUANT] La note « ma réplique à moi » (2.7) n'a ni états, ni contrôle de l'abonné.**
Passage : 2.7, point 9.
Problème : un texte libre enregistré sur le compte demande, avant tout étalon : où elle s'écrit, quand elle est enregistrée (à la volée ou par un bouton), ce qui se passe en cas d'échec (le texte ne doit jamais être perdu, il reste dans le champ), comment elle se modifie, se supprime, se retrouve (depuis la fiche et depuis « Plus, Mes notes »), ce que voit un abonné sans note (état vide), et ce qu'il advient de ses notes après la résiliation. Rien n'est dit de la relation avec le raccourci « Montre ta réplique à l'équipe » (2.6), qui précharge « le texte écrit » : doit-il reprendre la note ?
Correction : écrire les états (vide, saisie, enregistrée, échec sans perte, supprimée), un compteur de longueur sans alerte rouge, « Supprimer » avec confirmation, un lien depuis la fiche vers sa note et depuis « Mes notes » vers la fiche ; préciser que « Montre-la à l'équipe » reprend la note (copie, jamais l'envoi automatique) ; dire que les notes restent sur le compte et lisibles depuis « Mon profil » après la résiliation, comme l'historique de « Mes questions » (ou poser la question à Thomas) ; à la question « sur quelles fiches », proposer **toutes les fiches à geste** (« par fiche », mot de Thomas) et réserver la restriction à un choix explicite de sa part. Préciser que l'écriture d'une note ne vaut pas « Fait » (le geste reste déclaré) ni points (décision C4).

**Y3. [BLOQUANT] « Opt-in » du coin « Humour noir, fait bien » n'est pas défini : ce que l'on voit avant d'entrer n'est pas dit.**
Passages : 3.12 « **Opt-in** : on y va exprès, il n'est jamais servi par surprise » ; « Un court message au premier accès » ; 6.2 (« annoncé par la cloche ») ; 4.4 (exclu du toucher et de la vanne du jour).
Problème : (a) aller dans un bloc de la Bibliothèque n'est pas un consentement si la liste des vannes y est lisible dès l'ouverture ; (b) l'état « message vu » n'est pas dit (par navigateur ou sur le compte : si c'est sur le compte, c'est une donnée de plus à la phrase de @legal, 7.5 d) ; (c) la promesse « jamais servi par surprise » ne vaut que pour ce que l'espace sert (vanne du jour, toucher, rafale, parcours) : les mêmes vannes sont dans le catalogue public, dans la recherche de l'en-tête et dans les listes de la Bibliothèque ; la v12 note le [À VÉRIFIER] du repérage en base mais ne dit pas que le catalogue et la recherche restent hors du coin ; (d) la cloche annonce l'ouverture du bloc à tous les abonnés, y compris à ceux qu'un deuil récent rend sensibles.
Correction : définir l'entrée comme un geste : à l'ouverture du bloc, seulement le titre, une phrase (« Ici, on rit de sujets graves, avec ceux qui te connaissent ») et un bouton « Entrer » ; les fiches et les vannes ne sont lisibles qu'après ce geste ; l'état « entré » reste dans le navigateur (aucune donnée de compte) ; écrire en toutes lettres le périmètre de la promesse (ce que l'espace sert jamais ; ce qui reste public ou cherchable) et dire que la recherche de l'en-tête ne remonte pas ces vannes dans l'espace tant que le geste n'a pas été fait [À VÉRIFIER avec @fullstack] ; la notification de la cloche reste neutre et identique aux autres blocs (« Nouveau dans la Bibliothèque »), sans nom de sujet.

### Non bloquantes (à traiter pour 10/10)

**Y4. Archive « Lettres » (2.8) : une garantie fausse et une dépendance.** (a) La garantie (a) dit « la lettre n'est visible que le jour de l'envoi » : c'est « pas visible avant le jour de l'envoi » (l'archive la montre ensuite). (b) La lettre du mois existe en trois versions (avec invitation Premium, version comptes, version abonnés) : l'archive de l'abonné montre « telle qu'envoyée » **la version abonné, sans invitation** ; l'écrire. (c) « Reste à trancher : si l'archive remonte avant l'abonnement » contredit le point (d) de la même liste (« un abonné arrivé plus tard lit la lettre datée ») : recommander que l'archive remonte à la première lettre envoyée (sinon, au jour d'ouverture de l'espace, la ligne « Lettres » ne contient que l'inscription et la prochaine date : acceptable, mais « rien de vide » est mieux servi par les lettres déjà envoyées). (d) La notification de la cloche pour la lettre du jeudi double l'e-mail : le dire (aucune relance, simple lien).

**Y5. Connexion et page d'arrivée (4.2).** La décision C14 porte sur le paiement ; la v12 y ajoute « après une simple connexion : Aujourd'hui aussi (recommandation du brief) ». Les connexions se font en fenêtre (préférence fondateur : jamais une page pleine qui fait perdre les repères) : un abonné qui se connecte depuis une fiche reste sur la fiche, la barre apparaît ; « Aujourd'hui » n'est l'arrivée que depuis le bouton « Connexion » sans page d'origine. À confirmer à Thomas (« il n'a pas dit autre chose »), pas à décider. Ajouter, pour l'ancien abonné redirigé vers `/abonnement` (brief §3.8), la ligne « Ton historique de questions et tes notes sont gardés ».

**Y6. Après la résiliation (2.6).** « L'historique reste lisible depuis “Mon profil” » : préciser lecture seule, sans « Continuer » ; et indiquer où écrire en cas de « problème » (paiement, accès) quand l'espace est fermé (l'adresse de l'équipe, déjà dans l'e-mail de résiliation).

**Y7. Réponse à la ligne « cloche hors des 6 entrées » (à confirmer par @ux).** **Confirmé** : la cloche est un contrôle de l'en-tête (comme la recherche et le compte), pas une rubrique ; elle n'est pas comptée dans les 6 de la barre ; le test `header-budget.spec.ts` est étendu à l'état « abonné avec cloche » sur ses 6 largeurs (recherche d'au moins 160 px conservée). Condition : spécification de Y1.

**Y8. Volume des notifications (2.9).** « Nouveau ce mois-ci » peut regrouper carnet, situations, bloc de la Bibliothèque, écoute, lettre ; écrire un plafond de regroupement (une ligne par jour, au plus une ligne par type et par semaine) pour que la cloche ne ressemble jamais à un fil d'actualité.

## 4. Parcours de l'abonné et navigation : verdict

- **Après le paiement** : page de succès (bouton « Continuer », lien de renonciation, message de bienvenue) puis « Aujourd'hui » avec le premier pas ; le `returnTo` ne choisit plus que le premier pas : cohérent avec 4.1, 4.4 et la section 8.
- **Chaque jour** : « Aujourd'hui » (premier pas, contenu du jour au même poids, « Si tu as 5 minutes ») ; la cloche porte les réponses et les nouveautés ; rien n'est relancé.
- **Navigation** : la barre B tient en 6 entrées, « Plus » ordonne S'entraîner, Mon contenu (favoris, Mes notes), Le reste (Lettres, Articles, Quiz) ; la Bibliothèque a trois blocs nommés ; la cloche est dans l'en-tête.
- **À faire avant de montrer ce document à Thomas** : Y1 à Y3 (trois spécifications courtes) ; Y4 à Y8 sont des précisions.
