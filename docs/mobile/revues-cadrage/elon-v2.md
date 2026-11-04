# Revue à l'aveugle du cadrage app native v2 (@elon, s23, tour 3, 04/11/2026)

> AVIS CONSULTATIF : validation requise avant exécution. Objet relu : `docs/mobile/cadrage-app-native-s23.md` (v2, 313 lignes).
> Décision actée et non discutée ici : app iPhone native, Android ensuite (choix de Thomas). Je challenge le comment.
> Verdict fondé sur la valeur persona (commandement 5). Revues v2 des autres relecteurs non lues.
> Sources : `project-context.md`, `docs/founder-preferences.md`, ma revue `elon-v1.md`, la grille `docs/mobile/attentes-utilisateur.md`.

## 0. Verdict en une ligne

Le plan a enfin le bon centre de gravité : le build 0 ne contient que le geste, sans compte, et le carburant est un lot qui le bloque. L'approvisionnement, lui, n'y est pas encore : le lot C est écrit comme un **audit** alors que le constat du PM (§2.1) prouve qu'il faut une **chaîne de production**. On a vérifié qu'il y a de l'eau dans le réservoir ; le PM vient de découvrir que ce n'est pas le bon carburant.

## 1. Notes

| Critère | v0 | v1 | v2 | Justification courte |
|---|---|---|---|---|
| Valeur persona | 5 | 8 | 8,5 | Deux vraies vannes montrées telles quelles, thèmes pour les situations de Yanis et Marc, réserve Garder. Manque : la pratique de 30 s, cœur du geste et de la série, n'existe pas dans le stock (§2.1, constat 1). |
| Clarté du geste quotidien | 4 | 7,5 | 8,5 | Comptage écrit, une seule vanne par installation et par jour, identifiant porté par la notification : propre. Nouveau trou : la clé de jour UTC casse « une vanne par jour » et la série pour l'usage nocturne du persona principal (NO3). |
| Centre de gravité du périmètre | 5 | 7 | 8 | Plan : 9, le build 0 ne dépend que du geste (§13 ligne de tête, lot 7). Approvisionnement : 7, lot C en mode audit, métrique calée sur le calendrier du site au lieu des pools de l'app, mesures bloquées sans raison par les réponses de Thomas (NO1, NO2). |
| Différenciation vs site | 6 | 8 | 8,5 | Vanne assignée par thème (impossible sur le site), hors ligne avec mécanisme réel, Copier en 1 geste, widget. |
| Lien avec la conversion | 4 | 7,5 | 8,5 | Réserve de 7, écran honnête qui compte les touchers dès le build 0, offre en lignes concrètes avec extrait réel, interdits conservés. H6 sans seuil (SV2). |
| Hypothèses testables | 3 | 6,5 | 8 | Colonne « si alerte, on revoit », échantillons, durées, règle J14, borne basse de H0, dépendances S2/S3/S11 dites. Reste : H-stock mesure la mauvaise chose (NO2), H6 sans seuil, source des 20 installés non dite (SV3). |
| **Globale** | **4,5** | **7,5** | **8,5** | Le tuyau est bon. Sous 9 tant que le carburant n'est pas produit au bon format, par une usine, et mesuré dans le modèle de l'app. |

## 2. Statut des corrections v1 (vérifiées dans le corps du texte, pas dans le §16)

| Correction | Statut | Où dans le texte | Ce qui manque |
|---|---|---|---|
| N1 Lot carburant, dépendance du build 0 et du lot 13 | **Traitée dans la structure, partielle sur le fond** | §13 lot C ; lot 7 dépend de C(a)(d) ; lot 13 dépend de C ; 5b-0 dépend de C(a) ; §6 H-stock, alerte 60 j ; décision 7 | (1) Le lot audite la « part faisable en 30 s » alors que §2.1 dit que le format n'existe pas : il faut produire, pas compter (NO1). (2) H-stock mesure des jours de calendrier du site, l'app tire dans des pools par thème (NO2). (3) C dépend de « Réponses §1, étalons » en bloc, y compris l'audit (a) et (b) qui n'en ont pas besoin (NO2). (4) C(d) monolithique : le build 0 attendrait tout l'horizon (NO2). |
| N2 Build 0 indépendant | **Traitée** | §13 phrase de tête ; lots 1a, 3a, 5b-0, 6a ; lot 7 « 0 (envoi), 1a, 3a, 5b-0, 6a, 2, C(a)(d) » ; §8 tests sans Mac | Erreur factuelle : « Chemin critique : lot 0 ». Le vrai chemin critique est §1 + étalons (1a, 3a, C(c)(d) les attendent) (NO2 d). |
| N3 Seuil vers décision, échantillon | **Traitée** | §6 tableau, colonne « Si alerte », règle J14 puis verbatims, borne basse H0 | Zone grise entre alerte et poursuite non dite ; H6 sans seuil ; source des testeurs absente (SV2, SV3). |
| N4 Partage mesurable | **Traitée** | §3.1 « Boucle de partage mesurable » ; §6 H5 ; S11 ; décision 14 | Copier (canal WhatsApp de Yanis) n'est mesurable qu'en nombre, pas en portée : à écrire comme angle mort (SV1). S11 au lot 5b-1 : le build 0 partage sans nom d'app, cohérent avec « lien seul », à dire dans H5. |
| N5 Notification/vanne, comptage | **Traitée** | §3 « Règle de comptage » ; §3.1 étape 1 « même identifiant » ; §3.2 « Règle unique », `vanneDuJourApp`, aucun recalcul à l'ouverture | La définition du jour (UTC) rouvre le problème par l'horloge (NO3). |

Souhaitables v1 : **S11** traitée (§3, chute affichée à l'ouverture depuis la notification) ; **S12** traitée (§3.4 « Build 0 ») ; **S13** traitée (§10 mots-clés) ; **S14** traitée (§3.5, §4.1, libellés sur étalons) ; **S15** traitée (§3.1 « Notification refusée », H3').

## 3. Ce qui fonctionne, ne pas toucher

- §3.2 : une fonction unique appelée par la route et par le job, l'identifiant embarqué dans la notification, aucun recalcul. C'est le niveau d'ingénierie qu'on attend d'un cadrage.
- §2.1 : deux vannes copiées sans retouche et un constat honnête du PM contre son propre plan. C'est ce constat qui rend NO1 visible ; il vaut plus que dix pages de conformité.
- §6 : chaque seuil pilote un moyen, jamais l'app. Bon garde-fou sur la décision de Thomas.
- §3.4 : réserve gratuite + écran honnête au build 0. Le seul signal d'envie de payer avant le lot 10, obtenu sans rien vendre.
- §13 : build 0 sans compte, sans jeton, sans achat. Le moteur s'allume avant la fusée.

## 4. Le constat du PM : « À toi de jouer est une consigne de fabrication, pas un défi de 30 s »

Lu dans les deux exemples : « Montre ton défaut à travers la précaution que les autres prennent… » et « Prends un compliment qui promet une suite, répète-le sur une longue durée, puis trouve-lui un avantage absurde ». Ce sont des exercices d'écriture de 2 à 5 minutes, bons pour un élève motivé, pas pour Sophie debout dans le RER. Conséquences pour la V1, par ordre de gravité :

1. **L'étape 4 du geste repose sur un contenu qui n'existe pas.** Le §3.1 promet « faisable en 30 s » ; le stock livre autre chose. Le build 0 lancé tel quel mesurerait H4 sur le mauvais format et conclurait « l'exercice est sauté » alors que c'est le format qui est faux.
2. **La série est bâtie dessus.** §3.3 : « Ce qui compte un jour = À toi de jouer de la vanne du jour ». Si l'exercice prend 3 minutes, la série devient une corvée et H3' mesure la friction, pas l'habitude.
3. **C'est un problème de production, pas d'audit.** Le résultat de C(a) est probablement connu d'avance (format systématique « consigne + Ex. ») : proche de 0 %. Le lot doit fabriquer un nouveau champ, pour chaque vanne de chaque pool, puis pour chaque vanne qui entrera demain.
4. **C'est un problème d'usine, pas de stock.** Un backfill sans modification du pipeline quotidien (joke-agent + validation Stand-Up Director) recrée la pénurie le jour où le backfill s'arrête. Commandement 5 : automatiser tout contenu récurrent. Le produit, c'est la factory.
5. **C8 et C3 du panel se jugent sur ce format.** Les 5 vannes tirées au hasard (C(e)) doivent venir avec leur défi de 30 s, sinon le panel note un exercice qui ne sera pas dans l'app.
6. **Touche le site si on réécrit l'existant.** Les « À toi de jouer » du site sont relus et validés (P0 s18, intouchables). Les réécrire = projet copy sur le site, avec go de Thomas. Ajouter un champ distinct ne touche à rien.
