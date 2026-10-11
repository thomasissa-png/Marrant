# Critique à l'aveugle A : lot v5 (s19, tour 5, 10/10/2026)

Sources lues : `lot-aveugle-v5.txt` et `references-au-niveau.txt`, rien d'autre.
Barre plancher : « J'ai dit à Alexa de me raconter une blague. // Elle m'a lu mon historique de recherches. »
Règle : « = » seulement si la vanne est au niveau des 30 références ET jamais entendue. Le doute vaut « < ».

## Contrôles Grep (lot-aveugle-v5.txt)

| Contrôle | Motif | Résultat |
|---|---|---|
| Tiret cadratin | `—` | 0 occurrence : PASS |
| Mot « blague » | `[Bb]lague` | 0 occurrence : PASS |
| Marque gratuite | lecture | aucune : PASS |
| Blessant / personne visée | lecture | aucune personne visée (N6 vise le collègue qui part, mais avec tendresse, et c'est le narrateur qui a le mauvais rôle) : PASS |

## Verdicts

| id | note | connue | motif | correction minimale si « < » |
|---|---|---|---|---|
| N1 | < | non | Illisible sans contexte : qui est « son » ? Pourquoi appeler « pour voir qui décroche » ? La logique ne se reconstruit pas, la chute tombe à plat. | Situer le départ et donner un objet à la chute : « Pour garder le contact, je n'ai que ton numéro de poste. » / « Lundi, j'appellerai quand même. Je dirai bonjour à ton remplaçant. » |
| N2 | < | non | L'escalade en trois jours tient bien et l'appropriation par l'habitude est une bonne idée. Mais « c'est mon sac » se lit de deux façons (je l'ai adopté, ou on me l'attribue), et le passage de « poussé contre le mur » à la possession reste flou. Doute, donc « < ». | Remplacer la chute par un fait extérieur qui verrouille la logique : « Jeudi, on m'a demandé de le ranger. » |
| N3 | = | non | Le distributeur qui garde la barre chocolatée est un décor connu, mais pas cet angle. Le désaveu non sollicité dans un PS de mail sérieux, avec la distinction absurde entre payer et posséder, ne se voit pas venir. La logique tient (j'ai payé, je renonce, je me couvre) et rien n'est expliqué. Niveau des références de type « Il a beaucoup de chansons ». | |
| N4 | < | oui (trope) | Le chauffeur de car qui ne voit que les parkings est une observation déjà faite. Dès que « cars de tourisme » est posé, on voit venir « depuis le parking ». | Inverser l'objet du savoir : « Je connais quarante parkings d'Europe. » / « Il paraît qu'il y a des monuments à côté. » |
| N5 | = | non | Paradoxe compact : le seul contenu du casier, c'est l'ordre de le vider, donc il est déjà vide. Chute courte, inattendue, sans explication, et la logique se referme sur elle-même. Pas de variante connue identifiée. | |
| N6 | < | non | Le setup « je l'ai pris au sérieux » annonce la chute (il a gardé le parapluie), et « je cherche toujours la date limite » arrive mollement. La chute est expliquée avant d'être dite. | Supprimer « je l'ai pris au sérieux » et donner une chute concrète : « Ton parapluie est dans ma voiture. » / « Je te le rends quand tu reviens travailler ici. » |
| N7 | < | oui (trope) | L'envoi programmé pour cacher le travail du week-end est une observation connue. La chute est redondante : le setup dit déjà qu'il travaille le dimanche, « passer le dimanche à vérifier » n'ajoute rien de surprenant. Il y a aussi un flou logique : on ne peut pas vérifier dimanche qu'un envoi partira lundi. | Faire basculer la chute vers les autres : « Lundi 8 h 01, trois collègues m'ont répondu. » / « Envoi programmé aussi. » |
| N8 | = | non | La carte de départ remplie de « Bonne continuation » est un décor connu, mais la chute (se démarquer avec un point d'exclamation) est minuscule, précise et inattendue. Autodérision pure, aucune explication. Au niveau de « oui, mais ça ne durera pas ». | |
| N9 | < | oui (trope) | « Les ratés, c'est pour moi, donc je rate exprès » est un trope de pâtissier ou de cuisinier connu. « Je ne mange que les ratés » explique la chute avant qu'elle n'arrive. | Retirer l'explication et laisser deviner : « On a le droit de manger les ratés. » / « Depuis mars, le chef me trouve en baisse de forme. Moi, je me trouve en forme. » |
| N10 | < | partiel | La chaîne d'adaptateurs est un trope connu. Le double sens de « j'y travaille » (je m'en occupe ou je travaille au service d'à côté) est la vraie trouvaille, mais il est trop facile de lire le sens plat. Doute, donc « < ». | Lever l'ambiguïté vers le sens drôle : « Depuis jeudi, je travaille au service d'à côté. » |
| N11 | < | oui (variante célèbre) | « Juste un verre » est l'un des tropes les plus usés, et le compteur remis à zéro (« au premier, pour la troisième fois ») en est une variante attendue. | Pas de correction minimale viable : changer de terrain. |
| N12 | < | partiel | Le contraste entre l'objet lourd sans dégât et le petit objet abîmé est une structure connue. Une fois « mon seul accident » posé, « le tabouret » se devine. La nature de l'accident reste aussi floue (cassé, tombé dessus ?). | Donner une image précise et inattendue : « En dix ans, un seul oubli : le tabouret. » / « Le client joue debout depuis. » |

## Doublons de structure dans le lot

- **Setup « métier » puis contraste** : N4 (« Mon métier : »), N9 (« Dans une pâtisserie, je fais »), N12 (« Je déménage »). Ce sont trois fois le même moule : on énonce un métier, puis on dévie vers un petit détail. N4 et N9 suivent en plus la même mécanique d'ironie professionnelle. En garder un au maximum.
- **Calendrier « Lundi… »** : N2 (lundi, mardi, mercredi), N10 (lundi… depuis jeudi), et dans une moindre mesure N1 et N7 (« Lundi »). N2 et N10 font tous deux avancer une situation de jour en jour jusqu'à la chute.
- **Possession et paradoxe d'objet** : N3 (pas à moi, je l'ai payée), N5 (le casier ne contient que l'ordre de le vider), N2 (le sac devient le mien). Trois chutes reposent sur « à qui est l'objet ». Les mécaniques diffèrent assez, mais les trois se suivent de près.
- **Contexte départ** : N1, N5, N6, N8. Quatre vannes sur douze dans le même décor.
- **Compteur** : N11 (premier pour la troisième fois) et N9 (taux de réussite). L'effet repose sur un chiffre retourné dans les deux cas.

## Synthèse

« = » : N3, N5, N8 (3/12). « < » : N1, N2, N4, N6, N7, N9, N10, N11, N12 (9/12).
Après correction, N2 et N10 sont les plus proches de la barre. Leur version corrigée devra repasser la relecture à l'aveugle.
