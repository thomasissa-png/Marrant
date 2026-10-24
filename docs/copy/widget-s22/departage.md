# Départage s22 : page `/integrer-la-vanne-du-jour`, textes finaux

Relecture à l'aveugle de `textes-finaux.md` (seul fichier lu). Deux regards : blogueuse WordPress non technique (ça vaut le coup ? c'est simple ? je fais confiance ?) puis responsable communication prudent d'une PME (clair, exact, sans piège). AU NIVEAU = les deux notes à 9 ou plus.

| bloc | blogueuse | responsable com | verdict |
|---|---|---|---|
| 1. Title et H1 | 9 | 9 | AU NIVEAU |
| 2. Meta description | 9 | 8 | Remplacement R2 |
| 3. Chapeau | 9 | 8 | Remplacement R3 |
| 4. Titres des aperçus | 10 | 10 | AU NIVEAU |
| 5. Option 1, l'iframe | 8 | 9 | Remplacement R5 |
| 5 bis. Où coller sous WordPress | 7 | 7 | Remplacement R5bis |
| 6. Option 2, le script | 9 | 8 | Remplacement R6 |
| 7. CSP | 9 | 9 | AU NIVEAU |
| 8. Thème | 8 | 9 | Remplacement R8 |
| 9. Ce que le widget affiche | 9 | 7 | Remplacement R9 |
| 10. Pour les développeurs | 9 | 8 | Remplacement R10 |
| 11. Libellés « Copier » | 9 | 9 | AU NIVEAU |

Bilan : 5 blocs AU NIVEAU, 7 à remplacer. Aucun tiret cadratin ni demi-cadratin dans les textes.

---

## Remplacements prêts à coller

### R2 : meta description (com 8)
Passage : « sur ton blog ». Une PME n'a pas de blog, elle a un site : la description écarte une partie du public visé par le H1 (« à ton site »).
```
Un widget gratuit pour afficher la vanne du jour sur ton site ou ton blog : tu colles le code, elle change chaque jour. Sans cookie, sans pub.
```
142 caractères (entre 120 et 155), contient « vanne du jour ».

### R3 : chapeau (com 8)
Passage : « un lien « Deviens Marrant » dans le widget, que tu laisses visible ». On ne sait pas si c'est un constat ou une condition d'usage. Un responsable com veut savoir ce qu'on lui demande.
```
Chaque jour, une nouvelle vanne s'affiche sur ton site, sans que tu aies rien à écrire. Ça te coûte un copier-coller. Nous, on y gagne un lien « Deviens Marrant », toujours affiché dans le widget : on te demande seulement de ne pas le masquer. Gratuit, sans cookie, sans pub.
```

### R5 : option 1, l'iframe (blogueuse 8)
Passages : « dans sa propre fenêtre » (une non-technicienne comprend « une fenêtre qui s'ouvre », donc un pop-up) et « Sur mobile, la carte est plus haute » (constat sans raison : on se demande si c'est un bug).
```
Option 1, l'iframe : la vanne s'affiche dans son propre cadre, rien ne s'exécute dans ta page. Si tu hésites, commence par celle-là. Sur mobile, le cadre prend un peu plus de hauteur : c'est prévu.
```

### R5 bis : où coller sous WordPress (blogueuse 7, com 7)
Passages : « certaines formules retirent les iframes et les scripts : vérifie la tienne ». C'est l'inverse de la réalité : sur WordPress.com, iframes et scripts ne passent QUE sur une formule payante avec hébergement, donc la plupart des formules les retirent. « Vérifie la tienne » renvoie la blogueuse chercher seule une info qu'on a. « WordPress installé sur ton hébergement » est flou pour elle.
```
Ton WordPress est installé chez ton hébergeur ? Colle le code dans un bloc « HTML personnalisé » de l'éditeur. Sur WordPress.com, les iframes et les scripts ne passent qu'avec une formule payante qui inclut l'hébergement : avec les autres formules, la vanne ne s'affichera pas.
```

### R6 : option 2, le script (com 8)
Passage : « Il affiche la même vanne à l'endroit où tu le colles ». Le texte ne dit pas que, contrairement à l'option 1, du code de notre site s'exécute dans la page de l'hôte. C'est l'information qu'un responsable com doit avoir pour choisir (et elle explique le bloc CSP).
```
Option 2, le script : à choisir pour une barre latérale ou une colonne étroite. Il crée le même cadre à l'endroit où tu le colles, puis l'agrandit après le clic si la chute en a besoin. Contrairement à l'iframe seule, c'est un script de notre site qui s'exécute dans ta page.
```

### R8 : thème (blogueuse 8)
Passages : « au bout de l'adresse de l'iframe » (elle ne sait pas où est l'adresse dans le code) et `data-theme="sombre"` seul (et si son site est clair ?).
```
{frTypo("Rien à faire : le widget s'adapte au mode clair ou sombre de ton visiteur. Ton site garde toujours le même fond ? Impose le thème en ajoutant ")}
<code>?theme=clair</code> ou <code>?theme=sombre</code>
{frTypo(" à la fin de l'adresse qui suit src= dans le code de l'iframe, ou avec ")}
<code>data-theme="clair"</code> ou <code>data-theme="sombre"</code>
{frTypo(" sur le script.")}
```
`[À VÉRIFIER : data-theme="clair" est bien accepté par le script, et l'adresse src du code iframe ne contient pas déjà un « ? » (sinon il faut « &theme= »)]`

### R9 : ce que le widget affiche (com 7)
Passage : « le widget ne suit pas tes visiteurs ». Exact, mais la page ne dit nulle part que chaque affichage est compté avec le domaine du site hôte. Un responsable com qui le découvre ailleurs y verra une omission. Le dire désamorce le piège sans toucher à la formule @legal.
```
Tes visiteurs voient l'amorce d'une vanne, un bouton « Révéler la chute », un lien « Pourquoi ça marche ? » et le lien « Deviens Marrant », toujours présent. La vanne change chaque jour, la même sur tous les sites. Pas de pub, pas de cookie, et le widget ne suit pas tes visiteurs : on compte seulement chaque affichage, avec le seul nom de domaine de ton site.
```

### R10 : pour les développeurs (com 8)
Passages : « Pas d'iframe ? » (sibyllin) et la liste de champs en texte courant, où « license » à côté de « licence » ressemble à une faute de frappe.
```
{frTypo("Tu préfères afficher la vanne avec ton propre code ? Une API en lecture seule renvoie la vanne du jour en JSON : ")}
<code ...>GET {WIDGET_ORIGIN}{WIDGET_API_PATH}</code>
{frTypo(". Champs : ")}<code>type</code>, <code>date</code>, <code>amorce</code>, <code>chute</code>, <code>url</code>, <code>attribution</code> et <code>license</code>{frTypo(". Les règles d'usage sont dans la licence juste en dessous.")}
```

---

## Inexactitudes et points ouverts

1. **Bloc 5 bis, inexact (bloquant)** : « certaines formules retirent les iframes et les scripts ». Faux par sous-estimation : sur WordPress.com, ils ne passent que sur une formule payante avec hébergement. Toutes les autres formules les retirent. Corrigé en R5bis (sans citer de nom de formule, les noms changent).
2. **Bloc 9, omission** : le comptage des affichages avec le domaine hôte n'apparaît nulle part sur la page. « Ne suit pas tes visiteurs » reste vrai, mais un lecteur prudent peut se sentir piégé en l'apprenant ailleurs. Corrigé en R9.
3. **Bloc 6, omission** : le texte ne dit pas que l'option script exécute du code dans la page hôte, alors que c'est la vraie différence avec l'option 1. Corrigé en R6.
4. **Bloc 3, ambigu** : « que tu laisses visible » se lit comme constat ou comme condition. Corrigé en R3.
5. **Bloc 9, non finalisé** : la note d'emplacement dit que « Révéler la chute » et « Pourquoi ça marche ? » sont « à recaler sur le texte final du widget ». Tant que ce n'est pas fait, le bloc n'est pas un texte final.
6. **Bloc 1, à contrôler** : 54 caractères vérifiés. Si le layout ajoute un suffixe au title (par exemple « | Deviens Marrant »), il dépasse 60. Pas vérifiable depuis ce seul fichier.
7. **Bloc 8, à contrôler** : `data-theme="clair"` et la forme de l'adresse src, voir R8.
8. **Bloc 5, point ouvert du doc** : « Si tu hésites, commence par celle-là » reste soumis à Thomas.

Conformes aux faits : gratuit, sans pub, sans cookie, une vanne par jour la même pour tous, lien « Deviens Marrant » toujours présent, iframe sans exécution dans la page, script qui agrandit après le clic, thème via `?theme=`, API en lecture seule, aucune limite de requêtes citée, title 54 caractères, description 134 (R2 : 142).
