# Revue à l'aveugle du cadrage app native v3 (@elon, s23, tour 4, 04/11/2026)

> AVIS CONSULTATIF : validation requise avant exécution. Objet relu : `docs/mobile/cadrage-app-native-s23.md` (v3, 332 lignes).
> Décision actée et non discutée ici : app iPhone native, Android ensuite (choix de Thomas). Je challenge le comment.
> Verdict fondé sur la valeur persona (commandement 5). Revues v3 des autres relecteurs non lues.
> Sources : `project-context.md`, `docs/founder-preferences.md`, ma revue `elon-v2.md`, la grille `docs/mobile/attentes-utilisateur.md`. Deux contrôles dans le code : `apps/web/src/lib/progression.ts` (l. 8, 64, 71 : série en « jour civil de Paris ») et `apps/web/src/lib/ai/agents/joke-agent.ts` (l. 63, 243 : une vanne par exécution, sur une `plannedCategory`).

## 0. Verdict en une ligne

Les trois obligatoires v2 sont dans le texte, et bien : le défi de 30 s a une usine, le jour local est écrit, le chemin critique est juste. Il reste trois défauts, tous corrigeables par écrit sans attendre Thomas : (1) l'indicateur de stock que j'ai demandé devient muet à cause de la règle d'épuisement (il ne sonnera jamais) et le débit d'entrée a disparu ; (2) la série du compte Premium recrée le bug de minuit pour Yanis, juste après qu'il a payé ; (3) le « GO contenu » ajouté au build 0 y fait entrer 3b et 3c, donc le lot 1b.

## 1. Notes

| Critère | v0 | v1 | v2 | v3 | Justification courte |
|---|---|---|---|---|---|
| Valeur persona | 5 | 8 | 8,5 | **9** | Quatre vannes réelles, au niveau, copiées de la base. Le défi de 30 s a un format, un critère d'échec et une usine (§3.6). Les thèmes ont leur taille réelle et le vide est assumé (coloc, reprise de confiance). |
| Clarté du geste quotidien | 4 | 7,5 | 8,5 | **9** | Un seul modèle (`AssignationJour`), notification et icône sur le même identifiant, jour local avec bascule à 4 h pour tout le contenu, vanne retirée traitée. Le geste est spécifié de bout en bout. |
| Centre de gravité du périmètre | 5 | 7 | 8 | **8,5** | Le chemin critique est juste, C(a) part sans attendre, C(d0) et C(d1) sont séparés. Régression : le lot 7 dépend du « GO contenu » (§5.1), qui porte aussi sur 3b et 3c, donc sur 1b. Le build 0 attend l'offre, Parcours et Profil (NO6). |
| Différenciation vs site | 6 | 8 | 8,5 | **9** | La vanne assignée par thème, le défi de 30 s (absent du site), le hors ligne, Copier en 1 geste et le widget : aucun n'existe sur le site. |
| Lien avec la conversion | 4 | 7,5 | 8,5 | **8,5** | H6 défini, réserve et écran honnête au build 0, offre en lignes concrètes. Mais le premier jour Premium de Yanis peut casser sa série alors qu'il a pratiqué chaque nuit (NO5). |
| Hypothèses testables | 3 | 6,5 | 8 | **8,5** | Zone grise à J28, source des testeurs, H2 « amorce contre accroche » : fait. H-stock, la mesure qui protège le geste, ne peut pas déclencher d'alerte telle qu'elle est écrite, et le débit d'entrée n'est pas mesuré (NO4). |
| **Globale** | **4,5** | **7,5** | **8,5** | **8,5** | Le moteur et le tuyau sont bons. Le carburant n'a pas encore de jauge qui marche, ni de débit garanti par thème. Trois corrections écrites, aucune décision de Thomas nécessaire, et c'est 9. |

## 2. Statut des corrections v2 (vérifiées dans le corps du texte, pas dans le §16)

| Correction | Statut | Où dans le texte | Ce qui manque |
|---|---|---|---|
| **NO1** Lot C = chaîne de production du défi de 30 s | **Traitée** | §3.6 entier ; §1 étalon 3 ; §3.1 étape 4 ; §3.2 « Pool de l'app » (défi requis, pool vide sans lui) ; §3.3 (option C, la série est réécrite) ; H4 « si alerte » ; lots C(c), C(u), C(d0), C(e) ; lot 7 dépend de C(d0) ; 5b-0 dépend de C(u) ; décision 7 bis | Le rattrapage C(d0) est confié à « @copywriter, session principale » alors que §3.6 le fait passer par l'usine. Écriture à la main ou lot passé dans le pipeline ? À lever (SV5). |
| NO1, champ `defi30s` | **Traitée** | §3.6 « reco (B) champ distinct `defi30s` », site intact, consigne du site lisible dessous, même règle d'accès | Rien. |
| NO1, rattrapage des pools du build 0 | **Traitée** | §3.6 « Chaîne », C(d0) (93 + thèmes, relus à l'aveugle 2 sur 3) | Vu les tailles (93 + 69 avec recouvrement, pour 149 actives), C(d0) couvre presque tout le catalogue actif : C(d1) sera donc surtout de la production neuve. C'est cohérent, mais ça renforce NO4. |
| **NO2 (a)** Stock en jours avant la première répétition, par thème | **Traitée à la lettre, inopérante sur le fond** | §6 H-stock ; décision 7 | Avec la règle « thème épuisé : passer au tout public non vu » (§3.2), la première répétition arrive vers le 100e jour pour TOUS les thèmes (soirées : 9 jours de thème + 93 tout public, soit environ 102). L'alerte sous 60 ne sonne jamais, alors que Yanis n'a plus de vanne « soirées » au 27e jour. Le débit d'entrée validé par jour (demandé en v2) a disparu. Voir NO4. |
| NO2 (b) Épuisement d'un pool | **Traitée** | §3.2 « Thème épuisé », « jamais d'écran vide » | Rien, sauf son effet de bord sur la mesure (NO4). |
| NO2 (c) Mesures lancées sans attendre | **Traitée** | Lot C(a) « Dépend de : Rien » | Rien. |
| NO2 (d) Contenu du build 0 séparé de l'horizon | **Traitée** | C(d0) sert au lot 7, C(d1) au lot 13 | Rien. |
| NO2 (e) Chemin critique = étalons et réponses de Thomas | **Traitée** | §1 « Chemin critique » ; §13 « Tête de chaîne » ; « Les lots 3a et C(c) ne démarrent pas sans eux » | La décision 7 bis bloque C(u) : elle devrait être citée dans la tête de chaîne avec les étalons (une ligne). |
| **NO3** Jour local | **Traitée pour le contenu, rouverte pour la série du compte** | §3.2, tableau « trois horloges » ; §7 (`dernierEnvoiJour`, test de bascule à 4 h) ; §3.3 (idempotence par clé de jour local) | La série du compte garde le jour civil de Paris, avec bascule à minuit (`progression.ts:64-71`). Le bug nocturne revient pour tout abonné Premium, à Paris, et pas seulement « hors Europe » comme l'écrit le texte. Voir NO5. |
| SV1 Angle mort de Copier | **Traitée** | §3.1 « Angle mort assumé » ; H5 « portée non mesurable » ; build 0 sans nom d'app | Rien. |
| SV2 H6 et zone grise | **Traitée** | H6 avec ratio défini ; §6 « on garde et on relit à J28 » | Rien. |
| SV3 Source des 20 installés | **Traitée sur le principe** | §6 « Source des 20 installés », [À VÉRIFIER : taille] | La taille de la base se mesure aujourd'hui, en lecture seule, sans Thomas (SV7). |
| SV4 Accroche neutre et persona principal | **Traitée** | §3.2 (variante B d'abord sur SOIREES) ; H2 lu séparément | Les vannes réelles changent la reco, voir §3 et SV6. |
