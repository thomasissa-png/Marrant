# Contrôle ciblé du pack d'étalons v3, @reviewer (s23, 04/11/2026)

> Objet : `docs/mobile/etalons-app-s23.md` v3, contre `reviewer-v2.md` (8,5/10, N1 à N10). Contrôle ciblé, pas un tour complet.
> Lu : `CLAUDE.md`, `docs/founder-preferences.md` (lignes utiles), `docs/copy/ton-alex.md`, cadrage §3.2, §3.4 (décision 6), §3.5, §4.1, §14. Dans `panel-v2.md`, seulement les lignes citées par le pack (40, 50, 79, 80, 82, 88), pour vérifier les citations de N10.
> Vérifications : comparaison mot à mot de N1 à N10 ; Grep tiret cadratin et demi-cadratin (0) et mots interdits du §3.5 (0 à l'écran : « cours » l. 65 et l. 93 sont hors écran) ; recomptage à la main des quatre défis A.

## Résumé pour Thomas

Les 10 corrections sont faites, au mot près. « En réunion » est le bon choix. Sur les textes nouveaux, deux sont au niveau (la ligne repliée des thèmes, le message 7B) et trois demandent une retouche courte. Deux des trois suites d'aide de la vanne A, que j'avais moi-même proposées, ne passent pas la barre à la relecture à froid. L'amorce de bureau dit « qu'il était », alors qu'elle existe justement pour que Sophie s'y retrouve. La phrase de confidentialité laisse croire que l'identifiant reste sur le téléphone et promet « sans répétition », ce qui n'est pas vrai après environ 90 jours. Plus un chiffre à corriger. Note : 8,5, puis 9 une fois ces 4 retouches faites.

## Statut N1 à N10

| # | Statut | Évidence v3 |
|---|---|---|
| N1 | Levée, mais un chiffre est faux (R4) | l. 44 et 46 au mot près ; la parenthèse « de 86 à 117 » ne tient plus (recompté : 1A-D = 73) |
| N2 | Levée | l. 16 au mot près |
| N3 | Levée (texte repris) ; à la relecture à froid, 2 suites sur 3 restent sous la barre (R1) | l. 25 |
| N4 | Levée, et « en réunion » est juste | l. 26. L'amorce 1A-B se passe au bureau (chef, collègues, l. 20) : « en classe » aurait été hors situation, et « réunion » n'est pas dans la liste du §3.5. Ça répond aussi au manque relevé par le panel (amorce boulot de bureau, pas « le prof », `panel-v2.md` l. 76). |
| N5 | Levée | l. 94 au mot près |
| N6 | Levée | l. 110 au mot près |
| N7 | Levée | l. 95 au mot près |
| N8 | Levée | l. 130 (même texte, réparti entre la ligne repliée et son dépli, qui reprend la piste du panel), l. 142 et l. 143 au mot près |
| N9 | Levée | l. 165 au mot près |
| N10 | Levée, citations vérifiées | l. 119 : `panel-v2.md` l. 88 (avis v1 à 7), l. 40 (Yanis 7), l. 79 (8 non démontrable) : exacts |

Souhaitables intégrées : SW1, SW3, SW4, SW8, SW11, SW12. SW2 reste ouverte (suites C et D, l. 27 et 28), toujours en souhaitable.

## Textes nouveaux, relus à l'aveugle (barre 9)

| Texte | Verdict | Motif |
|---|---|---|
| Suites A+ de la vanne A (l. 25) | **À corriger (R1)** | « Même les fourmis ne reviendront pas » reprend le moule archi-connu « même les cafards sont partis » (vanne déjà connue = faible, 29/09). « Personnel accueillant, surtout les moisissures » écrit le mot qui fait la chute (« moisissures ») : le lecteur n'a plus rien à deviner. « On a retrouvé l'évier » est au niveau : court, implicite, la note de deux étoiles passe pour un progrès. Ces textes sont de moi (v2) : je ne peux pas les valider, et je ne les valide pas. |
| Amorce de bureau 1A-B (l. 20) | **À corriger (R3)** | Bonne prémisse, vraie au bureau, et elle prolonge la vanne B au lieu de la répéter (le compliment est secret au lieu d'être public). Deux défauts visibles à l'écran : « à part, un par un » dit deux fois la même chose avec « chaque », et « qu'il était » met le collègue au masculin dans l'amorce faite pour que Sophie s'y retrouve (panel, C7 ; même logique que SW3 et SW4). |
| Phrase de confidentialité, écran 1 (l. 126) | **À corriger (R2)** | Deux inexactitudes dans une phrase sur la vie privée. (1) « crée un identifiant sur ton iPhone » laisse croire que tout reste sur le téléphone, alors que l'installation est créée et stockée sur le serveur, avec les thèmes, l'heure, le fuseau et le jeton (§3.2, `Installation`, `POST /api/mobile/installation`). Le pack corrige « anonyme » dans sa note mais remet l'erreur dans le texte affiché. (2) « sans répétition » : la première répétition arrive avant le 94e jour sans thème (§3.2, l. 101). La marque [À CALER @legal] reste. |
| Message 7B (l. 179) | **Au niveau** | « Écris-le ici si ça t'aide » reprend la formule que le panel demande (l. 82), le ton est juste, aucune leçon. Retouche souhaitable : « il reste » a un antécédent flou après « le verra » ; écrire « personne d'autre ne le verra, ça reste sur ton téléphone ». Condition technique, pas de copy : la phrase n'est vraie que si la réponse n'est jamais envoyée au serveur (SW13, lot 5b, @fullstack), à inscrire comme critère d'acceptation. |
| Ligne repliée des thèmes, étalon 5 (l. 130) | **Au niveau** | Exacte après N8 (« plus proches », plus de « te ressemble »), courte, et « (facultatif) » rassure Marc qui le relève (`panel-v2.md` l. 50) : à garder. Point pour @ux, pas pour le texte : une fois dépliée sur un écran de 375 px, avec les quatre thèmes, le bouton doit rester visible sans défiler (l. 130 l'affirme, à vérifier sur maquette). |

## Corrections OBLIGATOIRES restantes (texte exact)

**R1. Suites A+ de la vanne A (l. 25).** Remplacer la ligne par : « Une étoile : “Nous reviendrons. En combinaison.” » / « Deux étoiles : “On a retrouvé l'évier.” » / « Quatre étoiles : “Champignons très frais.” ». Le cliché d'avis « Nous reviendrons » se retourne en contre-visite en tenue de protection ; « Champignons très frais » laisse le lecteur trouver la moisissure tout seul. Comme j'en suis l'auteur, ces deux suites nouvelles passent la relecture à l'aveugle chez @copywriter et un second lecteur, pas chez moi (P0 s18) ; la mention « textes de calibrage, pas validés » reste.

**R2. Phrase de confidentialité (l. 126).** Remplacer « Pour te donner une vanne par jour sans répétition, l'app crée un identifiant sur ton iPhone. Confidentialité » par « Pour choisir ta vanne de chaque jour, l'app enregistre un identifiant propre à cet iPhone. Confidentialité ». « Enregistre » ne dit pas où (c'est vrai pour le serveur comme pour le téléphone), et la phrase ne promet plus d'éviter les répétitions. La note [À CALER avec @legal, lot 3a] reste telle quelle.

**R3. Amorce 1A-B (l. 20).** Remplacer par : « Le chef a pris chaque collègue à part pour lui dire : “Tu es mon meilleur élément.” Depuis… » (95 caractères guillemets compris, contre 109 aujourd'hui). Épicène, sans redondance, et le « Tu es » au style direct fait entendre le chef. Les trois suites B (l. 26, dont « en réunion ») restent justes avec cette amorce.

**R4. Étalon 1, chiffre faux (l. 44).** Recompté sur la v3, guillemets compris : 1A-A 117, 1A-B 109 (95 avec R3), 1A-C 86, 1A-D 73. Remplacer « (les quatre défis A font de 86 à 117) » par « (les quatre défis A font de 73 à 117) ». La conclusion (A tient sous 150) ne change pas. Si 1A-D n'a pas changé depuis la v2, l'erreur vient de ma v2.

## Notes (barre 9)

| # | Critère | v2 | v3 | Motif |
|---|---|---|---|---|
| 1 | Options utilisables telles quelles et différentes | 8,5 | 9 | N2 et N5 levées ; écran d'offre et étalon 1 lisibles sans question. |
| 2 | Défis faisables en 30 s, fidèles | 8,5 | 8,5 | Plafond juste (N1), amorce de bureau dans la bonne situation ; mais 2 suites A+ sous la barre (R1) et une amorce à resserrer (R3). |
| 3 | Ton d'Alex, tutoiement, zéro tiret, zéro mot interdit | 9 | 9 | Zéro tiret, zéro mot interdit à l'écran, « en réunion » juste ; « qu'il était » (R3). |
| 4 | Exactitude, rien d'inventé, rien de contraire aux choix | 8 | 8,5 | N6 à N9 levées, citations du panel exactes ; phrase de confidentialité inexacte (R2), chiffre faux (R4). |
| 5 | Recos motivées, questions claires | 8,5 | 9 | Reco 5 sur une prémisse vraie, reco 6 qui dit qu'elle modifie la décision 6, reco 4 qui dit qu'elle reste sous 9. |
| 6 | Orientation revenu sans pression | 9 | 9 | Inchangée, Revenu 5 corrigé. |
| | **Globale** | **8,5** | **8,5, puis 9 après R1 à R4** | **GO pour la séance avec Thomas une fois R1 à R4 appliquées au mot près. Pas de nouveau tour @reviewer : seules les deux suites nouvelles de R1 repassent la relecture à l'aveugle, chez d'autres que moi.** |

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/mobile/revues-etalons/reviewer-v3.md`
- Décisions : N1 à N10 levées (N4 « en réunion » validé) ; 4 corrections obligatoires courtes à texte fourni (R1 à R4) ; 7B et ligne repliée des thèmes au niveau ; 8,5, puis 9 après correction ; pack non modifié, rien commité.
- Points d'attention : R2 (exactitude d'une phrase sur la vie privée), R1 (suites dont je suis l'auteur, à faire relire par d'autres) ; agent à relancer : @copywriter ; @fullstack pour la condition de 7B (SW13).
---
