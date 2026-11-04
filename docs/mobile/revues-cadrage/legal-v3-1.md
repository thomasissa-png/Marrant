# Revue @legal à l'aveugle du cadrage app iPhone v3.1, tour 5 (s23, 04/11/2026)

> Relu : `docs/mobile/cadrage-app-native-s23.md` (v3.1, lu en entier) avec ma revue `legal-v3.md`. Revues v3.1 des autres relecteurs non lues. Lu : `project-context.md` (en-tête), `docs/founder-preferences.md` (P0 : pas de mention IA du 06/05, juridique secondaire reporté du 07/10). Aucune WebSearch à ce tour : je n'ai rien revérifié en source primaire, voir la dernière section. Draft de référence, pas un avis juridique : validation avocat avant publication.

## Résumé exécutif : 5 points

1. **O1 et O2 sont traités dans le texte**, au bon endroit, sans refonte. Aucune correction obligatoire ne reste de mon côté.
2. **Les chiffres (horizon d'inactivité, durée de l'IP) restent des [HYPOTHÈSE] sans valeur.** Je les avais demandés ainsi : pas de chiffre inventé. Le point de vigilance est le calendrier : ces valeurs doivent exister dans le code au lot 5b-0 et dans `/confidentialite` (4a) avant le premier testeur externe, alors que l'avocat ne vient qu'au lot 4b. Seul l'horizon a une décision (19) ; la durée de l'IP n'en a pas.
3. **« Effacer les données de cet iPhone » est décrit en §3.2, §9.6 et décision 19, mais absent de la liste de l'écran Profil (§4.5), des textes du lot 3c et des tests de 5b-0.** Risque : la fonction est oubliée en user stories (1b). Souhaitable à traiter.
4. **S2 (identifiant Umami distinct) et S7 (offre sans exclusivité « exercices ») sont traités.** Une phrase du §8 sur le risque de l'identifiant persistant est plus rassurante que ce qui est établi.
5. **La chaîne `defi30s` rédigée en session ne crée aucun nouveau point juridique** (pas de donnée personnelle, aucun contenu d'utilisateur transmis, aucune IA en direct). Elle réactive seulement un souhaitable existant : la formulation AI Act et les notes de revue Apple.

## Notes (/10)

| Critère | v1 | v2 | v3 | v3.1 | Justification |
|---|---|---|---|---|---|
| Exactitude réglementaire sourcée | 8 | 9 | 9 | **9** | Inchangé : ce que je n'ai pas revérifié est listé ci-dessous. La mention AI Act du §9.3 reste datée (S3 non repris). |
| Risques de refus identifiés et parés | 8,5 | 9 | 9 | **9** | Rien de neuf côté Apple. La ligne « Aucune mention d'IA » des notes de revue reste à reformuler (S4, souhaitable). |
| Conformité RGPD / consommation | 8 | 8,5 | 8 | **9** | Durée de vie, purge, effacement, information dès l'écran 1 et position sur l'art. 82 sont écrits. Il manque des valeurs, non du mécanisme. |
| Décisions juridiques claires pour Thomas | 8,5 | 9 | 9 | **9** | Décision 19 bien posée (reco, alternative, repères 6 à 12 mois et 180 jours). Décisions 9, 11, 16 propres. |
| **Globale** | 8,5 | 9 | 8,5 | **9** | Barre atteinte. |

## Statut de O1 et O2 (vérifié dans le texte)

### O1 : durée de vie, effacement, IP de limitation. **Traité**

| Point demandé | Où dans le texte | Verdict |
|---|---|---|
| Horizon d'inactivité et purge par job | §3.2 (puce « Secret, limite, cycle de vie ») : le job supprime les installations sans appel à `GET /api/mobile/jour` ni envoi depuis l'horizon, « jeton ou non », avec leurs `AssignationJour` en cascade ; les `AssignationJour` plus vieilles que l'historique utile sont aussi purgées. Horizon marqué [HYPOTHÈSE], à fixer avec @data-analyst et l'avocat, décision 19 | Conforme. Pas de chiffre inventé dans le corps. Repères 6 à 12 mois et 180 jours en décision 19 |
| « Effacer les données de cet iPhone » | §3.2 : `DELETE /api/mobile/installation` supprime installation, assignations et jeton et remet l'app à zéro ; identifiant d'installation affichable dans Profil pour le droit d'accès, à communiquer à `contact`. Routes en §7. Rappelé en §9.6 et décision 19 | Conforme sur le fond. Lacune de cohérence : voir S1 ci-dessous |
| Durée de l'IP de limitation | §3.2 : IP « gardée que le temps du comptage, durée courte à fixer avec l'avocat [HYPOTHÈSE], la même dans `/confidentialite` ». §9.3 et §9.6 la citent | Conforme à ce que j'avais demandé (écrite comme courte, non chiffrée). Voir S2 sur le calendrier |
| Phrase « jusqu'à désinstallation ou purge `DeviceNotRegistered` » remplacée | §9.3 : durée = horizon d'inactivité de la purge, « la désinstallation n'étant pas vue du serveur » | Conforme |
| Réinstallation | §3.2 : marqueur de premier lancement hors trousseau, le secret est effacé à la réinstallation | Bonne mesure, évite qu'un secret orphelin survive |

### O2 : information dès l'écran 1 et art. 82. **Traité**

| Point demandé | Où dans le texte | Verdict |
|---|---|---|
| Lien `/confidentialite` dès l'écran 1, sans bloquer ni ajouter d'écran, phrase courte | §4.1 : « lien discret vers `/confidentialite` dès l'écran 1 (pied d'écran ou icône d'information, sans bloquer la révélation ni ajouter d'écran) », phrase sur l'identifiant anonyme, libellé à caler aux étalons ; libellé inscrit au lot 3a (§13) ; lien de l'écran 2 conservé | Conforme. C1 et C5 préservés |
| Art. 82 dans la liste de l'avocat | §9.3 : « position sur l'art. 82 de la loi Informatique et Libertés pour l'installation créée avant tout choix » | Conforme |
| Plan B écrit | §9.3 : (a) provisoire, exemption « strictement nécessaire au service demandé », « défendable et non acquise » ; (b) création différée au premier choix serveur avec vanne embarquée en repli local. Le repli embarqué existe déjà en §3.2 (création refusée ou sans réseau) | Conforme. La formulation est honnête sur le niveau de certitude |
| Lien en §9.6 | §9.6 liste le lien « dans Profil, sur l'écran de permission et dans les informations de test » mais pas sur l'écran 1 | Oubli de rédaction mineur, voir S3 |

## Statut de S2 et S7

| # | Constat | Statut |
|---|---|---|
| S2 identifiant Umami distinct de `Installation.id` | §8 : « DISTINCT de `Installation.id` du serveur (qui porte jeton, thèmes et fuseau : sinon l'exemption de mesure d'audience tomberait, @legal S2) et non relié au compte » ; repris en §9.3 en gras et à l'avocat | **Traité**. Réserve de formulation : voir S4 |
| S7 offre sans « exercices » en exclusivité | §3.4 : « sans présenter les exercices comme une exclusivité Premium, l'exercice du jour étant offert (@legal S7) » ; lettre de la semaine : e-mail à l'adresse du compte, arrêt en un clic ; §9.2 le reprend | **Traité** |

## La chaîne `defi30s` rédigée en session : nouveau point juridique ?

**Non.** Vérifié en §3.1 (étape 4), §3.6 et §4 :
- La réponse de l'utilisateur est gardée sur l'appareil, jamais envoyée ni publiée ; `POST /api/mobile/pratique` ne transmet aucun contenu (§3.3). Pas de contenu d'utilisateur transmis, donc pas de 1.2 ni de 5.1.2(i) (partage de données avec une IA).
- Aucune IA en direct, aucun retour automatique, aucun job qui produit (§3.6) : pas de traitement de données personnelles par un système d'IA à l'exécution, donc pas de question de base légale supplémentaire, d'information spécifique ni de transfert.
- Le texte est produit en session puis relu à l'aveugle et validé (statut stocké, empreinte) : même régime que les vannes. Le seul sujet juridique est celui du contenu généré par IA et publié (AI Act art. 50), déjà dans la liste de l'avocat (§9.3) et sous la règle fondateur du 06/05 (aucune mention visible, non rouverte). Je ne propose aucune mention.
- Observation : le rédacteur est un agent, donc l'exception d'édition humaine ne doit pas être le fondement unique de la défense (déjà dit en S3 de ma v3). Rien de nouveau, le lot C ne change pas l'analyse.

## Corrections OBLIGATOIRES restantes

**Aucune.**

## Corrections SOUHAITABLES

**S1. Cohérence de « effacer les données de cet iPhone » (priorité haute parmi les souhaitables).** La fonction est un mécanisme de conformité (art. 17, art. 11) : elle doit apparaître là où les lots l'implémentent. À ajouter : (a) dans la liste de l'écran Profil, §4.5 (aujourd'hui elle ne figure pas) ; (b) dans les textes du lot 3c (confirmation, résultat) ; (c) dans l'écran de suppression de compte (§9.5), puisque l'installation survit à la suppression : un lien « effacer aussi les données de cet iPhone » à côté de l'interrupteur des notifications ; (d) dans les tests Jest de 5b-0 (§7) : `DELETE /api/mobile/installation` en cascade, job de purge à l'horizon, purge des `AssignationJour` anciennes. Le job de purge n'a aujourd'hui aucun test listé.

**S2. Valeurs et calendrier.** La durée de l'IP de limitation n'a ni décision ni ligne dans les bloquants (§15 ne cite que la décision 19, pour l'horizon). Or `/confidentialite` minimale (4a) doit annoncer les deux durées avant le premier testeur externe, et l'avocat n'intervient qu'au lot 4b. Proposer à Thomas, avec la décision 19, une valeur provisoire pour l'IP (le seuil « 30 par jour » impose de la garder au moins 24 h : écrire « au plus 24 h à 48 h » [HYPOTHÈSE], à confirmer) et préciser que les deux valeurs sont figées au 5b-0 et corrigées après l'avocat. Préciser aussi le lieu et la forme de stockage de l'IP (table du limiteur en base, empreinte ou clair ; sous-traitants Cloudflare et Neon dans `/confidentialite`), qui était mon S1 non repris.

**S3. §9.6 : ajouter le lien dès l'écran 1.** Le §9.6 énumère « Profil, écran de permission, informations de test ». Y ajouter l'écran 1, pour que la liste de référence de la conformité ne contredise pas §4.1.

**S4. §8 : adoucir « sans risque pour le build 0 ».** La phrase affirme l'absence de risque tant qu'aucun identifiant n'est relié au compte, alors que l'entrée de l'identifiant persistant dans l'exemption d'audience n'est pas confirmée (elle l'écrit elle-même une phrase plus haut). Un identifiant Umami persistant est lui aussi une écriture sur le terminal (art. 82). Écrire « risque jugé faible, à confirmer par l'avocat » et prévoir le repli : identifiant d'audience non persistant (renouvelé à chaque lancement ou à chaque jour) tant que l'avocat n'a pas tranché.

**S5. Critère « envoi » de la purge (§3.2).** « Sans appel à `GET /api/mobile/jour` ni envoi depuis l'horizon » : un iPhone qui reçoit la notification chaque jour sans jamais ouvrir l'app n'est jamais purgé, et l'envoi quotidien ne s'arrête qu'à `DeviceNotRegistered`. Préciser si un envoi non suivi d'ouverture compte comme activité ; reco : non, et arrêter l'envoi quotidien après un nombre de jours sans ouverture (comme le rappel de parcours, arrêté après 3 rappels sans activité), à fixer avec @data-analyst. Cela sert aussi la proportionnalité de la conservation.

**S6. Art. 82 avant l'avocat (lot 8).** La position (a) est provisoire, mais l'avocat n'est un critère de GO qu'aux lots 10 et 13 ; le lien public TestFlight (lot 8) tourne donc sur (a) non validée. Risque faible (peu d'installations, plan B écrit, repli local déjà prévu), mais le dire en une ligne et laisser Thomas l'accepter en connaissance de cause, ou demander à l'avocat un avis court sur ce seul point avant le lot 8.

**S7. AI Act art. 50 et notes de revue (S3 et S4 de ma v3, non repris, toujours valables).** §9.3 écrit « vannes relues, non mentionné » : à remplacer par une formulation datée au 02/08/2026, couvrant les vannes et `defi30s`. §10 écrit « Aucune mention d'IA » dans les notes de revue : reformuler en « ne pas mentionner spontanément » avec réponse véridique si Apple demande, pour ne jamais faire une affirmation négative inexacte à Apple. Aucune mention visible dans l'app (P0 06/05 respecté).

**S8. `userId` à la déconnexion (S8 de ma v3, non repris).** Dire que `userId` repasse à `null` à la déconnexion et se rattache à la connexion, pour que l'étiquette App Privacy « reliée à l'identité » soit vraie seulement pendant la session (iPhone partagé).

## Ce que je n'ai pas pu vérifier à ce tour

Aucune recherche web n'a été faite : les points de ma v3 restent non revérifiés (recommandation CNIL sur les applications mobiles et passage sur les identifiants non publicitaires, durée de référence CNIL pour l'IP d'un limiteur de débit, texte consolidé de l'AI Act après le Digital Omnibus et lignes directrices art. 50, ligne exacte des guidelines Apple sur l'exactitude des notes de revue, D221-5 « en vigueur depuis le 19/06/2026 », L34-5 CPCE, DPA et mécanismes de transfert de RevenueCat et d'Expo). Mon jugement sur O1 et O2 porte sur la présence et la cohérence des mécanismes dans le texte, pas sur la validité juridique des durées, qui reste à l'avocat.
