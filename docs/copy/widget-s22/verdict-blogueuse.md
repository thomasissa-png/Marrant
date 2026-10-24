# Verdict blogueuse WordPress (relecture à l'aveugle, widget « vanne du jour », s22)

Lectrice jouée : blogueuse parentale sous WordPress, pas développeuse. Questions : ça vaut le coup ? c'est simple ? je peux faire confiance ?

| bloc | choix | note | pourquoi |
|---|---|---|---|
| 1. title et H1 | C | 8 | « ton blog » me parle directement et « c'est gratuit » répond à ma première question ; la virgule finale fait un peu slogan. |
| 2. meta description | B | 8 | Elle dit « widget gratuit », « tu colles le code » et « sans cookie, sans pub » en clair ; il lui manque « un bout de code » (plus honnête que « le code ») et « toute seule ». |
| 3. chapeau | B | 9 | Seule version qui dit franchement ce que ça coûte (un copier-coller) et ce que vous y gagnez (le lien) : c'est ce qui donne confiance. |
| 4. titres des aperçus | A | 9 | « Sur fond clair / sombre » est exactement ce que je regarde pour choisir selon mon site, et ça reste lisible dans le `title` de l'iframe. |
| 5. option 1, iframe | B | 8 | « Propre fenêtre, rien ne se mélange » me rassure sans jargon ; il manque une phrase qui me dit si je dois choisir celle-là. |
| 6. option 2, script | B | 9 | Je me reconnais par cas d'usage (barre latérale, colonne étroite) et je sais tout de suite si c'est pour moi. |
| 7. CSP | B | 9 | « Tu ne sais pas ce qu'est une CSP ? Tu n'as sans doute rien à faire » m'évite de paniquer devant un mot que je ne connais pas. |
| 8. thème | B | 9 | « Rien à faire » d'abord, puis le réglage seulement si mon fond ne change jamais : j'ai le bon niveau d'effort. |
| 9. ce que le widget affiche | B | 9 | Je vois ce que mes lecteurs verront et que le lien « Deviens Marrant » reste présent, sans surprise. À vérifier côté produit : « aucun suivi » n'est pas dans la liste des faits tenus (gratuit, sans cookie, sans pub). |
| 10. pour les développeurs | B | 8 | Section qui ne me concerne pas, mais B est la seule qui me dit où trouver les règles d'usage (la licence) ; « Pas d'iframe ? » est un peu obscur pour moi. |
| 11. bouton « Copier » | C | 9 | « Sélectionne puis copie » me dit quoi faire sans m'alarmer ; A (« Copie impossible ») ressemble à une panne, et C reste court sur 320 px. |

## Textes de remplacement (blocs sous 9)

Zéro tiret cadratin. Les chiffres et faits repris viennent uniquement du fichier relu.

- **Bloc 1** : « Ajoute la vanne du jour à ton blog, gratuitement » (49 car., même promesse, sans le ton slogan).
- **Bloc 2** : « Un widget gratuit pour afficher la vanne du jour sur ton blog : tu colles un bout de code, la vanne change chaque jour, toute seule. Sans cookie, sans pub. » (à recompter : viser 155 car. maximum pour l'affichage Google).
- **Bloc 5** : « Option 1, l'iframe : la vanne s'affiche dans sa propre fenêtre, rien ne se mélange avec ta page. Si tu hésites, commence par celle-là. Sur mobile, la carte devient plus haute pour rester lisible. » (la phrase « Si tu hésites » est une recommandation produit : à valider avant mise en ligne.)
- **Bloc 10** : « Tu préfères afficher la vanne à ta façon ? Une API en lecture seule renvoie la vanne du jour en JSON : `GET ...`. Tu y trouves type, date, amorce, chute, url, attribution et license. Les règles d'usage sont dans la licence juste en dessous. »

## Remarque transverse

Rien n'explique comment coller le code dans WordPress (bloc « HTML personnalisé » de l'éditeur). Pour une non-développeuse, c'est le dernier doute avant de coller. Une ligne d'aide serait utile après le bloc 6, mais je n'ai pas le contenu exact de l'interface : à faire écrire et vérifier par quelqu'un qui a testé.
