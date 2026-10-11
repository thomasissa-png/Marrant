# Lot 2 — rapport de refonte du catalogue (s11, passe 2) — 29/09/2026

> Périmètre : SITUATION, OBSERVATIONNEL, ECOLE, PARENTS, CULTUREL, GAMING, RESEAUX_SOCIAUX, ABSURDE (138 vannes).
> Sortie : `docs/copy/catalogue-s11/lot-2.jsonl` (130 lignes, une par vanne réécrite, décryptage inclus). Aucun autre fichier modifié, rien de commité.
> Barre appliquée : étalons A/B, + [CHOIX UTILISATEUR] « déjà connue ailleurs = faible ». Structure JSON vérifiée : 130/130 lignes conformes au format du brief.

## 1. Bilan par catégorie

| Catégorie | Total | Gardées | Réécrites | Ids gardés |
|---|---|---|---|---|
| SITUATION | 22 | 0 | 22 | — (102 alignée sur l'étalon A, voir §4) |
| OBSERVATIONNEL | 20 | 1 | 19 | 116 |
| ECOLE | 19 | 2 | 17 | 203, 345 |
| PARENTS | 19 | 1 | 18 | 344 |
| CULTUREL | 16 | 0 | 16 | — |
| GAMING | 16 | 2 | 14 | 228, 236 |
| RESEAUX_SOCIAUX | 15 | 0 | 15 | — |
| ABSURDE | 11 | 2 | 9 | 322, 325 |
| **Total** | **138** | **8** | **130** | |

Motifs de réécriture (une vanne peut en cumuler plusieurs) : vanne ou formule connue ailleurs (61), constat ou dramatisation sans twist (32), amorce saturée « En France / Le Français / Tu sais que / J'ai essayé / L'invention la plus… » (11). Viennent ensuite : cliché ou vanne de tonton, calembour, marque citée, formulation fautive, chute qui s'explique. Les quatre « pépites » d'Internet signalées par le brief (3 bibliothécaire, 18 chat vétérinaire, 60 GPS, et le « mémoire photographique » hors de mon périmètre) sont remplacées par des idées neuves.

## 2. Les 8 vannes gardées (et pourquoi)

- **116** pantoufles « tu ne vas nulle part ce soir » : observation originale, personnification nette.
- **203** « 3/20 mais dans une ambiance incroyable » : retournement d'idée, se ressort bien. C'est ma garde la plus fragile (proche de l'esprit du mème « vibes »).
- **345** toilettes refusées, « On a tous les deux regretté » : euphémisme de niveau étalon. **À trancher par Thomas** : l'allusion (un accident) frôle la limite « zéro vulgarité ».
- **228** CV « gamer compétitif », le recruteur demande le rang : chute courte, honte bien placée.
- **236** inventaire / bouton « trier » / ma mère : c'est la vanne de l'étalon de décryptage C.
- **344** le père trouve le mème « nul » puis l'envoie à toute la famille.
- **322** GPS vers le fleuve, « Il avait l'air sûr de lui » : euphémisme et auto-dérision, pas vue ailleurs sous cette forme.
- **325** prof de sport, « Il courait toujours. Moi non. » : économie maximale.

Leurs décryptages actuels (`apps/web/src/data/joke-decryptages.json`) n'ont pas été audités dans ce lot, sauf celui de 236 (étalon C). Il faudra les relire.

## 3. Mes 10 meilleures nouvelles vannes

1. **234** : « Mon pote dit qu'il perd à cause de ses coéquipiers. » / « C'est un jeu solo. »
2. **69** : « J'étais chez moi quand le livreur a glissé un avis de passage sous ma porte. » / « J'ai ouvert. Il m'a dit : « Vous étiez absent. » J'ai dit : « Ah, pardon. » »
3. **132** : « Pour mon régime, je m'autorise un carré de chocolat par jour. » / « J'ai jamais précisé la taille du carré. »
4. **39** : « Ma mère sait plier un drap-housse parfaitement. » / « Elle refuse de me montrer. Tant que je sais pas, je reviens le dimanche. »
5. **302** : « Mon père répond à tous mes messages par un pouce levé. » / « Quand j'ai eu mon diplôme, il m'en a envoyé deux. Il était ému. »
6. **3** : « Je me suis inscrit à un atelier pour vaincre la timidité. » / « On était douze devant la porte. Personne a osé frapper. »
7. **142** : « Ce matin, pour une fois, mon train est arrivé à l'heure. » / « J'ai dû expliquer mon retard au bureau avec la vérité. »
8. **65** : « J'ai demandé au serveur ce qu'il me conseillait. » / « Il a vérifié que le chef regardait pas. Il a chuchoté : « Le pain. » »
9. **54** : « Au repas du dimanche, après le fromage, j'ai dit : « Je peux plus rien avaler. » » / « Ma grand-mère a entendu « dessert ». »
10. **308** : « Mon père écrit ses messages en majuscules. » / « Je lui ai dit que ça voulait dire crier. Depuis, il ajoute « JE CRIE PAS ». »

Juste derrière : 208 (surprise du chef), 321 (notice : maux de tête), 18 (souris : « il en a apporté deux »), 166 (le tiroir refermé « très doucement »), 320 (« Bien cordialement »), 339 (« s'il en avait parlé à quelqu'un »).

## 4. Points à signaler (Thomas / orchestrateur tranchent)

1. **Id 102 (dentiste) = source de l'étalon A.** Je l'ai alignée mot pour mot sur la formulation validée (« J'ai demandé à mon dentiste s'il allait faire mal. » / « Il a souri avant de répondre. J'ai pas aimé ce sourire. ») plutôt que de la remplacer. Elle compte dans les « réécrites » du JSONL, motif « alignement étalon A ». Si Thomas préfère que l'étalon reste hors catalogue, il faut une nouvelle vanne SITUATION pour l'id 102.
2. **Chiffres dans les vannes** (charte §1 règle 1). Ce ne sont pas des statistiques mais des détails comiques. Comme pour la page n°1, je les signale pour validation. Chiffres des originaux qui disparaissent avec la nouvelle idée : 16, 134, 190, 211, 222, 227, 237, 243, 245, 246, 253, 260, 306, 309, 316, 324 et 328 (« 45 minutes » devient « une heure »). Chiffres comiques ajoutés : 8, 19, 29, 52, 76, 97, 108, 115, 120, 140, 150, 160, 163, 172, 184, 190, 192, 196, 209, 220, 233, 237, 244, 245, 250, 301, 318, 335 et 3. Aucune nouvelle statistique, étude ou citation.
3. **Amorces à vérifier entre les deux lots.** Dans mon lot, aucune amorce identique de 3 mots n'apparaît plus de 2 fois : « J'ai demandé » (65, 102), « J'ai acheté » (29, 118), « J'ai lu » (198, 321), « J'ai fait » (240, 260), « Mon père m'a » (304 + 344 gardée), « Ma mère m'a » (305, 315), « Au resto, » (79, 241), « Au partiel » (115, 205). Il faut consolider avec le lot 1, surtout « J'ai demandé », « J'ai dit », « J'ai acheté » et « Mon père / Ma mère » (PARENTS en a 6 de chaque, avec des verbes différents).
4. **Mécaniques proches à l'intérieur du lot** (idées différentes, mais à ne pas publier côte à côte) : 166 et 218 (un parent réagit par un geste à ton travail) ; 44, 164 et 222 (une consigne suivie à la lettre) ; 29 et 237 (effort détourné / échec récompensé).
5. **Proximité avec la page n°1** (thème voisin, twist différent) : 244 (200 photos de profil) et #20 (profil de dating) ; 243 (supprimer l'appli) et #34 (digital detox). Pas de doublon d'idée. J'ai volontairement évité la machine à café (#13), les couchers de soleil du père (#30), « de mon temps » (#28) et l'historique Google du père (#26).
6. **Type à mettre à jour** : l'id 163 était `QA` (« La différence entre… ? ») et c'est devenu une vanne setup/chute classique, donc `CLASSIQUE` serait plus juste. J'ai gardé `type` et `maturityLevel` inchangés comme le demande le brief ; à ajuster au merge si besoin. Les types des autres catégories n'ont pas été relus.
7. **Marques retirées** des vannes : Netflix (84, 328), SNCF (25), Instagram / TikTok / Twitter / BeReal (243-260, 335), Discord (224), Steam (239), Google (304, 319), WhatsApp (306, 309, 316). Aucune mention d'IA ni d'algorithme (256 réécrite pour cette raison, 213 et 326 venaient d'une version « ChatGPT / Siri »).
8. **Longueur** : chaque réécriture est plus courte que l'original ou de même longueur, à quelques exceptions de +10 à 20 caractères face à des originaux très courts (44, 93, 204, 212).
9. **Guillemets** : dans le JSONL, les citations imbriquées dans une citation « … » utilisent “ ” (pas de guillemet ASCII, pour garder un JSON valide).
