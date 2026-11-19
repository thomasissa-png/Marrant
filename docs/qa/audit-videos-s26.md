# Audit de disponibilité des vidéos YouTube (s26)

> Date : 19/11/2026. Audit **en lecture seule** : aucune modification du code, de la base ni des données. Rien n'a été masqué ni supprimé : c'est Thomas qui décide.
> Déclencheur : Thomas a vu dans l'aperçu de l'espace client un lecteur « Vidéo non disponible : bloquée en raison du contenu revendiqué par TF1 (TV Content) » sur un passage de Gad Elmaleh.

## 1. Sources recensées

| Source | Contenu | Identifiants |
|---|---|---|
| Base locale de préversion `marrant_preview_s25`, table `Video` (`youtubeId`), `SELECT` seul | 89 vidéos, toutes `isActive = true` | 89 |
| `docs/content/videos-seed.json` (lu par `apps/web/prisma/seed-data.ts`) | identique à la base de préversion (diff vide) | 89 |
| `apps/web/src/data/video-content-s20.json` + `video-durations-s20.json` (tâches de démarrage) | même liste, sauf la fiche Dany Boon « Le culturiste » dont l'id passe de `U80fwIfPC4M` à `JNo86HEt86w` au démarrage en production (`lib/video-durations-s20.ts`) | 89 + 1 |
| `apps/web/src/data/espace/parcours-fiches.json` (fiches vidéo des parcours, espace) | 40 fiches de type `video`, toutes présentes dans la base | 40 réf. |
| `docs/content/parcours-*.json`, `boulot-base-s19.json`, `lib/parcours-boulot-sync.ts` | toutes déjà dans la liste ci-dessus | 0 nouveau |
| `apps/web/src/data/espace/bonus.json`, `ecouter.json` | fichiers vides (`[]`) : aucune vidéo | 0 |
| `missions.json` (`video-2`…`video-7`) | défis textuels sans identifiant YouTube | 0 |
| Tests (`__tests__`) | identifiants factices (`dQw4w9WgXcQ`, `abcdefghijk`…) : exclus | - |

**Total testé : 90 identifiants uniques** (les 89 de la base et `JNo86HEt86w`, le nouvel identifiant Dany Boon). La base de production n'a pas été consultée.

Où les vidéos apparaissent :
- **Page publique** : chaque vidéo active a sa fiche `/videos/[slug]` (lecteur `youtube-nocookie.com/embed`) et figure dans la grille `/videos`.
- **Espace** : les 40 fiches vidéo des parcours (colonne « Fiche espace ») ; toute vidéo active peut aussi sortir dans « Contenu du jour » et dans les favoris.
- **Bonus** : aucun (le fichier des bonus est vide).

## 2. Méthode et limites

- **oEmbed** : `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`, une requête toutes les 1,1 s, sans clé. 200 = vidéo publique et intégrable ; 401/403 = intégration interdite ou vidéo privée ; 404 = supprimée ou introuvable.
- **Statut de lecture (`playabilityStatus`) : NON TESTÉ.** La page `watch` renvoie une redirection 302 vers la page anti-robot de Google (`google.com/sorry`). Conformément à la consigne, pas de contournement (cookies de consentement, API interne du lecteur).
- **Limite majeure** : oEmbed répond 200 pour une vidéo **bloquée par une revendication Content ID ou bloquée dans certains pays**. Le blocage vu par Thomas (« revendiqué par TF1 ») **n'est donc pas détectable par ce test**.
- **Pays** : le test part d'un serveur hors de France. Une revendication peut bloquer une vidéo en France seulement (cas fréquent pour les droits TV français), ou au contraire hors de France. Seul un test depuis un navigateur en France fait foi.
- **Colonne « Mise en ligne par »** : `author_name` renvoyé par oEmbed. Quand c'est un compte tiers (ni l'humoriste, ni sa production, ni la chaîne d'origine), le risque de revendication est élevé. C'est une `[HYPOTHÈSE : risque déduit du compte de mise en ligne, non vérifié]`.

## 3. Résultats

| # | Identifiant | Titre (base) | Humoriste | Mise en ligne par (oEmbed) | Page publique | Fiche espace (parcours fiche) | oEmbed | Lecture | Raison / risque |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `PrQTbXOz2iU` | Laura Domenge - La vie de couple | Laura Domenge | - | oui | storytelling 2.4 | 404 | non testé | **Indisponible** : supprimée ou rendue privée |
| 2 | `agciwdzBH3w` | Bun Hay Mean - Le Chinois marrant | Bun Hay Mean | Cedric Dric | oui | - | 200 | non testé | OK, mais copie mise en ligne par un compte tiers : risque élevé de revendication |
| 3 | `U80fwIfPC4M` | Dany Boon - Le culturiste | Dany Boon | tenguryu | oui (préversion ; remplacé en prod par JNo86HEt86w) | - | 200 | non testé | OK, mais copie mise en ligne par un compte tiers : risque élevé de revendication |
| 4 | `CdRedv9PM40` | Fabrice Éboué - Plus rien à perdre (spectacle complet) | Fabrice Éboué | Moulay Soultan | oui | - | 200 | non testé | OK, mais copie mise en ligne par un compte tiers : risque élevé de revendication |
| 5 | `6lHjXqelKGo` | Gad Elmaleh - Décalages (spectacle complet 1997) | Gad Elmaleh | REDA MAHBOUB | oui | - | 200 | non testé | OK, mais copie mise en ligne par un compte tiers : risque élevé de revendication |
| 6 | `3v8Y4C9Q5hE` | Kev Adams - Du côté de chez vous | Kev Adams | Valentin HENRY | oui | boulot 3.4 | 200 | non testé | OK, mais copie mise en ligne par un compte tiers : risque élevé de revendication |
| 7 | `v-ySkBGAXLI` | Thomas Ngijol - Le voisin | Thomas Ngijol | Ryme Beast | oui | storytelling 1.4 | 200 | non testé | OK, mais copie mise en ligne par un compte tiers : risque élevé de revendication |
| 8 | `UbaqKoflh_A` | Ahmed Sylla - La théorie du genre | Ahmed Sylla | YouHumour | oui | - | 200 | non testé | OK, compte agrégateur ou label : droits à vérifier |
| 9 | `tj6qta_9PaM` | Anne Roumanoff - Carmen et la crise | Anne Roumanoff | YouHumour | oui | - | 200 | non testé | OK, compte agrégateur ou label : droits à vérifier |
| 10 | `jgNSu968qD4` | Anne Roumanoff - La chirurgie esthétique | Anne Roumanoff | YouHumour | oui | - | 200 | non testé | OK, compte agrégateur ou label : droits à vérifier |
| 11 | `R5ophuvAqho` | Claudia Tagbo - Les athlètes | Claudia Tagbo | YouHumour | oui | - | 200 | non testé | OK, compte agrégateur ou label : droits à vérifier |
| 12 | `JRJJwIdpL00` | Constance - Le rendez-vous coquin | Constance | YouHumour | oui | - | 200 | non testé | OK, compte agrégateur ou label : droits à vérifier |
| 13 | `XwG5Ie10rEg` | Fellag - Petits chocs des civilisations | Fellag | MLP MUSIC | oui | - | 200 | non testé | OK, compte agrégateur ou label : droits à vérifier |
| 14 | `FM1rtYhkSjE` | Lamine Lezghad - Le recruteur raciste | Lamine Lezghad | YouHumour | oui | - | 200 | non testé | OK, compte agrégateur ou label : droits à vérifier |
| 15 | `JNo86HEt86w` | Dany Boon - Le culturiste (nouvel id posé au démarrage en prod) | Dany Boon | Dany Boon | oui | - | 200 | non testé | OK |
| 16 | `0CFdBNtFPbE` | Adib Alkhalidey - Je t'aime (spectacle complet) | Adib Alkhalidey | Adib Alkhalidey | oui | - | 200 | non testé | OK |
| 17 | `JmF7CXVoIz0` | Ahmed Sparrow - Piétons vs Automobilistes | Ahmed Sparrow | Montreux Comedy | oui | - | 200 | non testé | OK |
| 18 | `Za2F_8DX9Dc` | Akim Omiri - Les féministes | Akim Omiri | Montreux Comedy | oui | - | 200 | non testé | OK |
| 19 | `fQW5AJG-Qj0` | Alex Ramirès - Les clichés sur les gays | Alex Ramirès | Montreux Comedy | oui | - | 200 | non testé | OK |
| 20 | `yx1EJngHCac` | Alexandre Astier & François Rollin - 30 ans de Montreux Comedy | Alexandre Astier & François Rollin | Montreux Comedy | oui | - | 200 | non testé | OK |
| 21 | `dQ--q5y2e4k` | Arnaud Tsamère - L'avocat de la salade, la frite et la saucisse | Arnaud Tsamère | On n'demande qu'à en rire | oui | - | 200 | non testé | OK |
| 22 | `egM-wlaobjo` | Artus - Le commissariat du 18ème | Artus | Montreux Comedy | oui | confiance 5.4 | 200 | non testé | OK |
| 23 | `itrLXrwG18c` | Aymeric Lompret - On n'est pas toujours obligé d'être heureux | Aymeric Lompret | Montreux Comedy | oui | - | 200 | non testé | OK |
| 24 | `F5WiaMalDSc` | Baptiste Lecaplain - La timidité | Baptiste Lecaplain | Montreux Comedy | oui | confiance 2.4 | 200 | non testé | OK |
| 25 | `5yaEdgAz8Is` | Ben - Le Tilapia | Ben | Montreux Comedy | oui | - | 200 | non testé | OK |
| 26 | `4wxWv241V3g` | Blanche Gardin - La télévision / Réfugiés climatiques | Blanche Gardin | Montreux Comedy | oui | - | 200 | non testé | OK |
| 27 | `WiOtrTASZWU` | Blanche Gardin - La vie éternelle | Blanche Gardin | Comédie+ | oui | - | 200 | non testé | OK |
| 28 | `B1ooaLzgFlY` | Bérengère Krief - Filles et Garçons | Bérengère Krief | Montreux Comedy | oui | - | 200 | non testé | OK |
| 29 | `UrLkh-Ne0nM` | Chris Esquerre - Muté (spectacle complet) | Chris Esquerre | Chris Esquerre | oui | - | 200 | non testé | OK |
| 30 | `GFS3p1Z8IiE` | David Azencot - Inflammable (à l'Européen) | David Azencot | TéléParis | oui | - | 200 | non testé | OK |
| 31 | `WGCAhqQz1I0` | Dena - Lesbienne Iranienne | Dena | Montreux Comedy | oui | - | 200 | non testé | OK |
| 32 | `uEj_jmlANXE` | Djimo - J'aurais kiffé être une tortue | Djimo | Montreux Comedy | oui | storytelling 4.4 | 200 | non testé | OK |
| 33 | `tpIOLzv11qo` | Djimo - Quand il croise Carl Lewis | Djimo | Clique TV | oui | machine-a-cafe 3.3 | 200 | non testé | OK |
| 34 | `Mw2zHEaBPDs` | Doully - La sobriété | Doully | Montreux Comedy | oui | - | 200 | non testé | OK |
| 35 | `da21Xp8hGYY` | Doully - Qu'est-ce qu'elle a ma voix ? | Doully | Montreux Comedy | oui | confiance 6.4 | 200 | non testé | OK |
| 36 | `Rre1afUQKW0` | Fadily Camara - La confiance en soi | Fadily Camara | Fadily Camara | oui | - | 200 | non testé | OK |
| 37 | `YY4M7TQTrXE` | Fadily Camara - Les complexes | Fadily Camara | Fadily Camara | oui | - | 200 | non testé | OK |
| 38 | `y7M7tn6ObfY` | Fanny Ruwet - Je ne serais pas une bonne mère | Fanny Ruwet | Montreux Comedy | oui | - | 200 | non testé | OK |
| 39 | `zC7ff6w7x-Y` | Fary - Le legging | Fary | JMD Production | oui | confiance 6.3 | 200 | non testé | OK |
| 40 | `57KJEtKDf2U` | Fary - Neymar | Fary | Montreux Comedy | oui | - | 200 | non testé | OK |
| 41 | `TDmd7JRlxFc` | Florence Foresti - Le styliste (Boys Boys Boys) | Florence Foresti | CANAL+ | oui | boulot 4.4 | 200 | non testé | OK |
| 42 | `CWPFF2ld9jI` | François Guédon - La consanguinité | François Guédon | Montreux Comedy | oui | - | 200 | non testé | OK |
| 43 | `lw0hwSg87qk` | Félix Dhjan - Le quotidien | Félix Dhjan | Félix DHJAN | oui | machine-a-cafe 2.4 | 200 | non testé | OK |
| 44 | `NebHsD_K9lM` | Guillermo Guiz - Les cabillauds, ces arrogants ! | Guillermo Guiz | France Inter | oui | boulot 3.3 | 200 | non testé | OK |
| 45 | `DK7ASNHnKm4` | Guillermo Guiz - Pas de sentiments au fast-food | Guillermo Guiz | France Inter | oui | boulot 4.3 | 200 | non testé | OK |
| 46 | `OMkHT3fRQJY` | Haroun - Internet etc. | Haroun | Haroun | oui | - | 200 | non testé | OK |
| 47 | `qdqIc-uzdbA` | Haroun - Jamel Comedy Club Saison 9 | Haroun | Haroun | oui | repartie 4.3 | 200 | non testé | OK |
| 48 | `qvgM5npfcdM` | Haroun - Spécial Élections | Haroun | Haroun | oui | - | 200 | non testé | OK |
| 49 | `K-oIyXvLUeg` | Jason Brokerss - Le mariage | Jason Brokerss | Jason Brokerss | oui | machine-a-cafe 2.3, repartie 2.3 | 200 | non testé | OK |
| 50 | `cl-fIl6hjTw` | Jason Brokerss - Le mariage (Montreux) | Jason Brokerss | Montreux Comedy | oui | storytelling 5.3 | 200 | non testé | OK |
| 51 | `zGT7TX66JFQ` | Jason Brokerss - Snapchat | Jason Brokerss | Campus Comedy Tour | oui | boulot 2.4 | 200 | non testé | OK |
| 52 | `eYhWcDdI3rM` | Jonathan Cohen - Serge le Mytho (Bloqués) | Jonathan Cohen | Bloqués | oui | storytelling 6.3 | 200 | non testé | OK |
| 53 | `afFehefVWxk` | Karim Duval - Génération Y | Karim Duval | Rire & Chansons | oui | machine-a-cafe 1.4 | 200 | non testé | OK |
| 54 | `Ps3UNPLpmKc` | Karim Duval - Élever son enfant en mode start-up | Karim Duval | Karim Duval | oui | machine-a-cafe 3.4 | 200 | non testé | OK |
| 55 | `ZMJDmHNqKis` | Kheiron - 60 minutes : Problème de taille | Kheiron | Kheiron | oui | - | 200 | non testé | OK |
| 56 | `TWGNkUX8wbk` | Kyan Khojandi & Navo - Le Rêve | Kyan Khojandi & Navo | Montreux Comedy | oui | repartie 4.4 | 200 | non testé | OK |
| 57 | `u41ujNodvnM` | Kyan Khojandi - Pulsions (spectacle complet) | Kyan Khojandi | Kyan Khojandi | oui | - | 200 | non testé | OK |
| 58 | `-LlW0io5w30` | Laura Laune & Guillaume Bats - Le sexisme | Laura Laune & Guillaume Bats | Montreux Comedy | oui | - | 200 | non testé | OK |
| 59 | `_bwxPjiGPOM` | Laura Laune - Finale France's Got Talent 2017 | Laura Laune | France's Got Talent | oui | - | 200 | non testé | OK |
| 60 | `vpdrKdWY838` | Lilia Benchabane - Sa vie est un blind test | Lilia Benchabane | Tarmac | oui | repartie 1.4, repartie 3.3 | 200 | non testé | OK |
| 61 | `ztKRY4eNUTA` | Lisa Delmoitiez - J'ai pas confiance en moi et j'ai raison | Lisa Delmoitiez | La Relève Montreux Comedy | oui | boulot 5.3 | 200 | non testé | OK |
| 62 | `m30qZa8p_Js` | Marina Rollman - JCC 8è saison | Marina Rollman | Marina Rollman | oui | repartie 1.3 | 200 | non testé | OK |
| 63 | `4t9a0To2ygo` | Marina Rollman - Les enterrements de vie | Marina Rollman | Montreux Comedy | oui | confiance 4.4 | 200 | non testé | OK |
| 64 | `mFKUThh26oU` | Max Bird - Les effets de l'alcool | Max Bird | Montreux Comedy | oui | confiance 5.3 | 200 | non testé | OK |
| 65 | `sjsdIlrotXY` | Mehdi Bousaidan - Les sports de pauvre | Mehdi Bousaidan | Montreux Comedy | oui | - | 200 | non testé | OK |
| 66 | `GO-E-pgBqa8` | Noman Hosni - Stand-up au Montreux Comedy | Noman Hosni | Montreux Comedy | oui | - | 200 | non testé | OK |
| 67 | `Fw14PLdtSyA` | Nora Hamzawi - Les chagrins d'amour (chronique France Inter) | Nora Hamzawi | France Inter | oui | storytelling 3.3, boulot 6.3 | 200 | non testé | OK |
| 68 | `0FmK8RA_hnE` | Nordine Ganso - La première fois | Nordine Ganso | Tarmac | oui | storytelling 3.4 | 200 | non testé | OK |
| 69 | `JuB6-b0fhLE` | Panayotis Pascot - Amsterdam et le Kem's | Panayotis Pascot | Panayotis Pascot | oui | storytelling 1.3 | 200 | non testé | OK |
| 70 | `OR-1TUobxk8` | Paul Mirabel & Gad Elmaleh - Conseils d'ami | Paul Mirabel & Gad Elmaleh | La Relève Montreux Comedy | oui | - | 200 | non testé | OK |
| 71 | `RYjfe8OSRFw` | Paul Mirabel - Je me suis fait racketter | Paul Mirabel | Montreux Comedy | oui | confiance 2.3, storytelling 4.3 | 200 | non testé | OK |
| 72 | `GKJKPlf6EqA` | Paul Séré - Les relations amoureuses | Paul Séré | Paul Séré | oui | machine-a-cafe 1.3 | 200 | non testé | OK |
| 73 | `Pae2AMnmUVA` | Paul Taylor - Franglais | Paul Taylor | Paul Taylor | oui | - | 200 | non testé | OK |
| 74 | `QGqA4va99rw` | Pierre Croce - Ce qu'on rêverait d'entendre dans l'avion | Pierre Croce | Pierre Croce | oui | confiance 1.4, boulot 2.3 | 200 | non testé | OK |
| 75 | `jKhIOyk9kdU` | Pierre Croce - Tester Tinder avec un enfant | Pierre Croce | Pierre Croce | oui | - | 200 | non testé | OK |
| 76 | `HBJBxuIs6g0` | Pierre-Emmanuel Barré - Pfff (au Zénith) | Pierre-Emmanuel Barré | Pierre-Emmanuel Barré | oui | - | 200 | non testé | OK |
| 77 | `XrWYDgHAy6c` | Quentin Ratieuville - Handicapé, et alors ? | Quentin Ratieuville | Montreux Comedy | oui | - | 200 | non testé | OK |
| 78 | `cZB0NO0jnz0` | Roman Frayssinet - Alors (spectacle complet) | Roman Frayssinet | Clique TV | oui | - | 200 | non testé | OK |
| 79 | `brlY_DMoaRk` | Roman Frayssinet - L'intelligence des animaux | Roman Frayssinet | Montreux Comedy | oui | confiance 1.3 | 200 | non testé | OK |
| 80 | `fnu6fRa-BN4` | Samia Orosemane - Les accents africains | Samia Orosemane | Samia Orosemane | oui | storytelling 2.3 | 200 | non testé | OK |
| 81 | `JtU_EB5i2Mk` | Sugar Sammy - L'andrologue | Sugar Sammy | Sugarsammy | oui | storytelling 5.4 | 200 | non testé | OK |
| 82 | `t2MsC6I9t5U` | Sugar Sammy - La procureure et l'immigrant | Sugar Sammy | Sugarsammy | oui | repartie 3.4 | 200 | non testé | OK |
| 83 | `R1yqN11ln_g` | Sugar Sammy - Médecins au Québec | Sugar Sammy | Sugarsammy | oui | - | 200 | non testé | OK |
| 84 | `RoBBdJLzPqw` | Tania Dutel - Séance chez l'esthéticienne | Tania Dutel | Montreux Comedy | oui | - | 200 | non testé | OK |
| 85 | `57Ip2k3us_8` | Thomas VDB - Bitcoin, JPEG et blockchain | Thomas VDB | France Inter | oui | boulot 1.3 | 200 | non testé | OK |
| 86 | `b0sxUyrE1Cs` | Thomas Wiesel & Kyan Khojandi - Petites blagues entre amis | Thomas Wiesel & Kyan Khojandi | Montreux Comedy | oui | repartie 2.4, confiance 4.3 | 200 | non testé | OK |
| 87 | `_Gru82H__ZM` | Thomas Wiesel - Toulouse (dernier show) | Thomas Wiesel | Thomas Wiesel | oui | - | 200 | non testé | OK |
| 88 | `rldvVgHQSvo` | Vérino - Le distributeur de baguettes | Vérino | Montreux Comedy | oui | confiance 3.4, boulot 1.4 | 200 | non testé | OK |
| 89 | `6RnIUcFonik` | Yacine Belhousse - Les Québécoises | Yacine Belhousse | Montreux Comedy | oui | - | 200 | non testé | OK |
| 90 | `t7fgrrRVyaU` | Élodie Poux - Survivre en école maternelle | Élodie Poux | Montreux Comedy | oui | confiance 3.3 | 200 | non testé | OK |

## 4. Totaux

| Mesure | Nombre |
|---|---|
| Identifiants testés | 90 (89 en base de préversion + `JNo86HEt86w`) |
| oEmbed 200 (publique et intégrable) | 89 |
| oEmbed 401/403 (intégration interdite ou privée) | 0 |
| oEmbed 404 (supprimée ou privée) | **1** : `PrQTbXOz2iU` |
| Statut de lecture testé | 0 (page `watch` bloquée par l'anti-robot de Google) |
| Copies mises en ligne par un compte tiers (risque élevé de revendication) | 6, dont `U80fwIfPC4M`, déjà remplacé en production |
| Comptes agrégateurs ou labels (YouHumour, MLP MUSIC : droits à vérifier) | 7 |
| Vidéos citées dans une fiche de l'espace | 40 références |

## 5. La vidéo vue par Thomas (Gad Elmaleh, « revendiqué par TF1 »)

Une seule vidéo en base porte le nom de Gad Elmaleh en solo : **`6lHjXqelKGo`, « Gad Elmaleh - Décalages (spectacle complet 1997) »**, mise en ligne par un compte tiers (« REDA MAHBOUB »), pas par l'artiste. Les DVD de ses spectacles sont édités par une filiale du groupe TF1 : la revendication « TF1 (TV Content) » correspond à ce profil. `[HYPOTHÈSE : c'est la vidéo vue par Thomas ; à confirmer par lui]`. Elle n'est rattachée à aucune fiche de parcours. Dans l'espace, elle peut donc sortir par « Contenu du jour » ou les favoris. Côté public, elle a sa page `/videos/[slug]`.
L'autre passage de Gad, `OR-1TUobxk8` (« Paul Mirabel & Gad Elmaleh - Conseils d'ami »), est mis en ligne par la chaîne officielle du festival : risque faible.
oEmbed répond 200 pour `6lHjXqelKGo` : c'est la preuve que ce test ne voit pas les blocages par revendication (voir § 2).

## 6. Recommandations (à décider par Thomas : rien n'a été modifié)

| Vidéo | Problème | Recommandation |
|---|---|---|
| `PrQTbXOz2iU` Laura Domenge - La vie de couple (page publique + fiche **storytelling 2.4**) | 404 : supprimée ou privée, le lecteur est cassé partout | **Masquer en attendant un remplacement** (fiche publique et fiche 2.4), puis remplacer par un autre passage de Laura Domenge sur le couple, de préférence mis en ligne par une chaîne officielle (Jamel Comedy Club, Montreux Comedy ou l'artiste). @fullstack proposera des candidats après vérification oEmbed et un test en France ; Thomas choisira. |
| `6lHjXqelKGo` Gad Elmaleh - Décalages (spectacle complet, copie tierce) | Bloquée selon Thomas (revendication TF1), non détectable ici | **Masquer en attendant un remplacement**, puis remplacer par un extrait de Gad Elmaleh mis en ligne par sa chaîne officielle ou par un festival (même angle pédagogique : décalage, personnage). Candidats à proposer à Thomas après un test en France. |
| `CdRedv9PM40` Fabrice Éboué, `agciwdzBH3w` Bun Hay Mean, `3v8Y4C9Q5hE` Kev Adams (**boulot 3.4**), `v-ySkBGAXLI` Thomas Ngijol (**storytelling 1.4**) | Copies tierces : même profil de risque que la vidéo de Gad (spectacles complets ou extraits TV) | Tester d'abord depuis un navigateur en France. Si l'une est bloquée : masquer et remplacer par un passage du même humoriste issu d'une chaîne officielle. Priorité aux deux fiches de l'espace. |
| 7 vidéos YouHumour / MLP MUSIC (Roumanoff ×2, Sylla, Tagbo, Constance, Lezghad, Fellag) | Comptes agrégateurs : droits probablement licenciés, sans certitude | Tester en France ; aucune action si elles se lisent. |
| `U80fwIfPC4M` Dany Boon (copie tierce) | Déjà remplacé en production par `JNo86HEt86w` (chaîne officielle, 200) | Aucune action en production ; la base de préversion est simplement en retard. |

**Prochaine étape recommandée** : un contrôle de lecture depuis la France, par exemple Thomas qui ouvre les 12 vidéos à risque ci-dessus (2 minutes), ou un test automatisé de `playabilityStatus` depuis une machine en France si Thomas l'autorise. Ensuite, un contrôle oEmbed hebdomadaire (cron `/api/cron/*`) suffirait à détecter les suppressions comme celle de `PrQTbXOz2iU`. Il ne détecte pas les revendications : pour celles-ci, l'API YouTube Data (`contentDetails.regionRestriction`, avec une clé) donne les pays bloqués.

## 7. Traçabilité

- Base de préversion : le cluster local était arrêté. Il a été démarré pour un unique `SELECT` sur `"Video"`, puis arrêté de nouveau (état initial rétabli). Aucune écriture.
- Requêtes YouTube : 90 appels oEmbed (1 toutes les 1,1 s) + 1 contrôle répété sur `PrQTbXOz2iU` (404 confirmé). 2 appels à la page `watch` (redirigés vers l'anti-robot) ; aucun contournement tenté.
