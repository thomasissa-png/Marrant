# Page `/integrer-la-vanne-du-jour` : textes finaux (s22)

Source : propositions A/B/C (`propositions-page-programme.md`) + deux relectures à l'aveugle (`verdict-blogueuse.md`, `verdict-responsable-com.md`), corrigées des faits vérifiés dans le code.
Chaque bloc : emplacement, puis le texte exact à poser. Les `{origine}` et `GET ...` sont les valeurs déjà présentes dans le code (`WIDGET_ORIGIN`, `WIDGET_API_PATH`) : ne pas les retaper. Voix du site, tutoiement, zéro tiret cadratin.
`[Framework : PAS allégé, puis démonstration]` · `[Conscience : Solution-Aware]`.

Faits tenus dans tous les textes : gratuit, sans pub, sans cookie, « ne suit pas tes visiteurs » (formule @legal, jamais « aucun suivi » ni « aucune statistique »), une vanne par jour la même pour tous, lien « Deviens Marrant » toujours présent, aucune limite de requêtes citée.

---

## Bloc 1 : title et H1
Emplacement : `apps/web/src/app/(dashboard)/integrer-la-vanne-du-jour/page.tsx`, `PAGE_TITLE` (l.28), repris dans `<h1>` (l.96). 54 caractères.

```
Ajoute la vanne du jour à ton site : un widget gratuit
```

## Bloc 2 : meta description
Emplacement : même fichier, `PAGE_DESCRIPTION` (l.29-30). 134 caractères. (Les deux relecteurs : B, inchangée.)

```
Un widget gratuit pour afficher la vanne du jour sur ton blog : tu colles le code, la vanne change chaque jour. Sans cookie, sans pub.
```

## Bloc 3 : chapeau sous le H1
Emplacement : même fichier, `<p className="mt-4 text-lg ...">` (l.97-102), à passer dans `frTypo(...)`.

```
Chaque jour, une nouvelle vanne s'affiche sur ton site, sans que tu aies rien à écrire. Ça te coûte un copier-coller. Nous, on y gagne un lien « Deviens Marrant » dans le widget, que tu laisses visible. Gratuit, sans cookie, sans pub.
```

## Bloc 4 : titres des aperçus
Emplacement : même fichier, tableau `APERCUS`, champ `titre` (l.70-72). (Inchangé : les deux relecteurs, A.)

```
Sur fond clair
Sur fond sombre
```

## Bloc 5 : option 1, l'iframe
Emplacement : même fichier, premier `<p className={P}>` de « Le code à copier » (l.130-135), dans `frTypo(...)`.

```
Option 1, l'iframe : la vanne s'affiche dans sa propre fenêtre, rien ne s'exécute dans ta page. Si tu hésites, commence par celle-là. Sur mobile, la carte est plus haute.
```
Point à valider par Thomas : « Si tu hésites, commence par celle-là » est une recommandation produit (l'iframe évite d'avoir à autoriser un script côté sécurité).

## Bloc 5 bis : ligne ajoutée, où coller le code sous WordPress
Emplacement : même fichier, nouveau `<p className={P}>` placé juste APRÈS `<BlocCode id="code-iframe" ...>` (sous l'option 1, avant le paragraphe de l'option 2). Elle vaut pour l'iframe comme pour le script.

```
Sous WordPress installé sur ton hébergement, colle le code dans un bloc « HTML personnalisé » de l'éditeur. Sur WordPress.com, certaines formules retirent les iframes et les scripts : vérifie la tienne.
```

## Bloc 6 : option 2, le script
Emplacement : même fichier, `<p className={`${P} mt-6`}>` avant `<BlocCode id="code-script" ...>` (l.137-142), dans `frTypo(...)`.
(Pas de « il ne fait que poser l'iframe » : le script agrandit aussi la carte après le clic.)

```
Option 2, le script : à choisir pour une barre latérale ou une colonne étroite. Il affiche la même vanne à l'endroit où tu le colles, et la carte s'agrandit après le clic si la chute en a besoin.
```

## Bloc 7 : politique de sécurité (CSP)
Emplacement : même fichier, `<p className={P}>` après `<BlocCode id="code-script" ...>` (l.144-150). Les deux `<code>` existants sont conservés, seul le texte autour change. (Les deux relecteurs : B.)

```
{frTypo("Si ton site limite ce qu'il peut charger (une CSP), ajoute ")}
<code ...>frame-src {WIDGET_ORIGIN}</code>
{frTypo(" et, si tu as pris le script, ")}
<code ...>script-src {WIDGET_ORIGIN}</code>
{frTypo(". Sinon le navigateur bloquera la vanne. Tu ne sais pas ce qu'est une CSP ? Tu n'as sans doute rien à faire.")}
```

## Bloc 8 : thème
Emplacement : même fichier, `<p className={P}>` de la section « Thème » (l.153-160). Les trois `<code>` existants sont conservés. (Les deux relecteurs : B.)

```
{frTypo("Rien à faire : le widget s'adapte au mode clair ou sombre de ton visiteur. Ton site garde toujours le même fond ? Impose le thème avec ")}
<code>?theme=clair</code> ou <code>?theme=sombre</code>
{frTypo(" au bout de l'adresse de l'iframe, ou avec ")}
<code>data-theme="sombre"</code>
{frTypo(" sur le script.")}
```

## Bloc 9 : ce que le widget affiche
Emplacement : même fichier, `<p className={P}>` de la section « Ce que le widget affiche » (l.165-170), dans `frTypo(...)`. Libellés « Révéler la chute » et « Pourquoi ça marche ? » à recaler sur le texte final du widget.

```
Tes visiteurs voient l'amorce d'une vanne, un bouton « Révéler la chute », un lien « Pourquoi ça marche ? » et le lien « Deviens Marrant », toujours présent. La vanne change chaque jour, la même sur tous les sites. Pas de pub, pas de cookie, et le widget ne suit pas tes visiteurs.
```

## Bloc 10 : pour les développeurs
Emplacement : même fichier, premier `<p className={P}>` de la section (l.172-178). Le `<code className={`${CODE} break-all`}>GET {WIDGET_ORIGIN}{WIDGET_API_PATH}</code>` est conservé. `LICENCE_API` intouchée. (Les deux relecteurs : B.)

```
{frTypo("Pas d'iframe ? Une API en lecture seule renvoie la vanne du jour en JSON : ")}
<code ...>GET {WIDGET_ORIGIN}{WIDGET_API_PATH}</code>
{frTypo(". Tu y trouves type, date, amorce, chute, url, attribution et license. Les règles d'usage sont dans la licence juste en dessous.")}
```

## Bloc 11 : libellés du bouton « Copier »
Emplacement : `apps/web/src/components/widget/bloc-code.tsx`, l.36. Le texte sr-only « Code copié » (l.47) reste tel quel. (Les deux relecteurs : C.)

```
{etat === "copie" ? "Copié" : etat === "echec" ? "Sélectionne puis copie" : "Copier"}
```

---

## Contrôles
- Zéro tiret cadratin ni demi-cadratin (recherche faite).
- Title : 54 caractères (max 60), contient « vanne du jour ». Description : 134 caractères (120 à 155), contient « vanne du jour ».
- Aucune limite de requêtes citée, aucun « aucun suivi » ni « statistique », aucun résultat de trafic ou de SEO promis à l'hôte.
