# Page `/integrer-la-vanne-du-jour` : propositions de copy (s22)

Voix : celle du site (tutoiement, direct, drôle sans forcer, zéro tiret cadratin). Lecteur : quelqu'un qui tient un blog, pas forcément technique, qui se demande « ça vaut le coup, et c'est simple ? ».
Cadre : `[Framework : PAS allégé, puis démonstration]` · `[Conscience : Solution-Aware]` (il sait ce qu'est un widget, il hésite sur l'effort et le bénéfice).
Règles tenues : rien d'inexact (gratuit, sans cookie, sans pub, une vanne par jour la même pour tous, lien « Deviens Marrant » toujours présent, iframe ou script, thème clair/sombre/auto, API JSON en lecture seule), aucune promesse de trafic ni de SEO pour l'hôte, jargon seulement où c'est le sujet. Pas d'humour forcé : aucune vanne écrite ici, donc rien à passer à l'aveugle.

Les 11 blocs, dans l'ordre de la page. A = brouillon retouché, B et C = deux autres directions.

Points d'attention transverses :
- « Une ligne de code » (brouillons 2 et 3) est inexact : le code à copier fait plusieurs lignes à l'écran. Les propositions disent « un bout de code ».
- `PAGE_TITLE` alimente aussi le H1, le partage social et le JSON-LD. Le choix du bloc 1 vaut donc pour le H1 (le fil d'Ariane garde sa chaîne à part).
- Les libellés « Révéler la chute » et « Pourquoi ça marche ? » (bloc 9) viennent de la synthèse s22 : à recaler sur le texte final du widget.

---

## Bloc 1 : title et H1

Emplacement : `apps/web/src/app/(dashboard)/integrer-la-vanne-du-jour/page.tsx`, constante `PAGE_TITLE` (l.28), reprise dans `<h1>` (l.96).
Brouillon : « Intègre la vanne du jour sur ton site »

- **A** (retouché, 51 car.)
> Intègre la vanne du jour sur ton site, gratuitement
- **B** (50 car.)
> La vanne du jour : un widget gratuit pour ton site
- **C** (49 car.)
> Ajoute la vanne du jour à ton blog, c'est gratuit

Reco : **B**, parce qu'elle met « widget » (le mot que tape un blogueur qui cherche) et « gratuit » dans le title, et le H1 reste lisible tel quel.

## Bloc 2 : meta description

Emplacement : même fichier, constante `PAGE_DESCRIPTION` (l.29-30), reprise dans le partage social et le JSON-LD.
Brouillon : « La vanne du jour sur ton site, gratuitement : un widget à coller en une ligne, sans cookie et sans pub. Une nouvelle vanne chaque jour. »

- **A** (retouché, 147 car.)
> La vanne du jour sur ton site, gratuitement : un bout de code à coller, sans cookie et sans pub. Une nouvelle vanne chaque jour, la même pour tous.
- **B** (134 car.)
> Un widget gratuit pour afficher la vanne du jour sur ton blog : tu colles le code, la vanne change chaque jour. Sans cookie, sans pub.
- **C** (133 car.)
> Ton blog mérite une vanne du jour. Un bout de code à copier, gratuit, sans cookie ni pub : la vanne change chaque jour, toute seule.

Reco : **A** avec le title B (A ne répète pas « widget gratuit » et garde « la même pour tous », qui est un fait vérifiable).

## Bloc 3 : chapeau sous le H1

Emplacement : `page.tsx`, `<p className="mt-4 text-lg ...">` sous le H1 (marqué `BROUILLON s22`, l.97-102).
Brouillon : « La vanne du jour, c'est un widget gratuit : chaque jour, une nouvelle vanne s'affiche sur ton site. Tu colles une ligne de code, on s'occupe du reste. »

- **A** (retouché)
> La vanne du jour est un widget gratuit : chaque jour, une nouvelle vanne s'affiche sur ton site. Tu colles un bout de code, on s'occupe du reste.
- **B** (ce que tu y gagnes, ce que ça coûte, ce qu'on y gagne)
> Chaque jour, une nouvelle vanne s'affiche sur ton site, sans que tu écrives rien. Ça te coûte un copier-coller. Nous, on y gagne un lien « Deviens Marrant » dans le widget, que tu laisses visible. Gratuit, sans cookie, sans pub.
- **C** (le sourire d'abord)
> Un petit sourire sur ta page, renouvelé chaque jour. La vanne du jour est un widget gratuit, sans cookie ni pub : tu copies le code, tu le colles là où tu veux, c'est tout.

Reco : **B**, parce qu'elle répond aux deux questions du lecteur (ça vaut le coup, c'est simple) et que dire franchement ce qu'on y gagne rend la page citable.

## Bloc 4 : titres des deux aperçus

Emplacement : `page.tsx`, tableau `APERCUS`, champ `titre` (l.70-72). Contrainte : le titre est aussi repris en minuscules dans le `title` de l'iframe, entre parenthèses (« La vanne du jour (sur fond clair) »). Il doit donc rester lisible ainsi.
Brouillon : « Sur fond clair » / « Sur fond sombre »

- **A** (inchangé, déjà juste)
> Sur fond clair / Sur fond sombre
- **B** (même mot que la section Thème et que `?theme=`)
> Thème clair / Thème sombre
- **C** (parle du site du lecteur)
> Pour un site clair / Pour un site sombre

Reco : **C**, parce que le lecteur se projette sur son propre site, et l'intitulé d'iframe reste correct (« (pour un site clair) »).

## Bloc 5 : option 1, l'iframe

Emplacement : `page.tsx`, premier `<p className={P}>` de la section « Le code à copier » (l.130-135).
Brouillon : « Option 1 : l'iframe. Rien ne s'exécute sur ton site. Sa hauteur s'adapte à la largeur de l'écran : sur petit écran, la carte est plus haute. »

- **A** (retouché)
> Option 1 : l'iframe. Rien ne s'exécute dans ta page : c'est une fenêtre ouverte sur la vanne. Sa hauteur suit la largeur de l'écran, donc la carte est plus haute sur mobile.
- **B** (le choix tranquille)
> Option 1, l'iframe : la vanne s'affiche dans sa propre fenêtre, rien ne se mélange avec ta page. Sur mobile, la carte devient plus haute pour rester lisible.
- **C** (le plus court)
> Option 1 : l'iframe. Tu la colles, elle s'affiche, rien à configurer. Sur petit écran la carte s'allonge, c'est normal.

Reco : **A**, parce que « une fenêtre ouverte sur la vanne » explique « iframe » sans jargon et garde l'argument « rien ne s'exécute dans ta page ».

## Bloc 6 : option 2, le script

Emplacement : `page.tsx`, `<p className={`${P} mt-6`}>` avant le bloc « Script » (l.137-142).
Brouillon : « Option 2 : le script. Il crée la même iframe à l'endroit où tu le colles, et l'agrandit si la chute en a besoin. Pour une colonne étroite (barre latérale), choisis cette option. »

- **A** (retouché)
> Option 2 : le script. Il crée la même iframe à l'endroit où tu le colles, et l'agrandit si la chute en a besoin. Pour une colonne étroite (barre latérale), c'est le bon choix.
- **B** (par cas d'usage)
> Option 2, le script : à choisir pour une barre latérale ou une colonne étroite. Il affiche la même vanne, et la carte s'ajuste en hauteur quand la chute est longue.
- **C** (transparent sur ce que fait le script)
> Option 2 : le script. Il ne fait que poser la même iframe à l'endroit où tu le colles, et la rallonge si la chute en a besoin. Le bon choix pour une colonne étroite (barre latérale).

Reco : **C**, parce que « il ne fait que poser l'iframe » rassure un blogueur méfiant des scripts, et c'est exact (le chargeur ne crée que l'iframe).

## Bloc 7 : politique de sécurité (CSP)

Emplacement : `page.tsx`, `<p className={P}>` après le bloc « Script » (l.144-150). Structure à conserver : texte, `frame-src {origine}`, texte, `script-src {origine}`, point.
Brouillon : « Ton site a une politique de sécurité (CSP) ? Ajoute `frame-src {origine}`, et pour l'option 2 `script-src {origine}`. »

- **A** (retouché)
> Ton site applique une politique de sécurité (CSP) ? Autorise `frame-src {origine}` et, pour l'option 2, `script-src {origine}`.
- **B** (pour le non technique)
> Si ton site limite ce qu'il peut charger (une CSP), ajoute `frame-src {origine}` et, si tu as pris le script, `script-src {origine}`. Sinon le navigateur bloquera la vanne. Tu ne sais pas ce qu'est une CSP ? Tu n'as sans doute rien à faire.
- **C** (dépannage)
> Rien ne s'affiche ? Ton site a peut-être une politique de sécurité (CSP) qui bloque les contenus extérieurs. Ajoute `frame-src {origine}` pour l'iframe, et `script-src {origine}` en plus pour le script.

Reco : **C**, parce qu'elle arrive au moment où le lecteur en a besoin (ça ne s'affiche pas) ; B si Thomas préfère rassurer d'avance.

## Bloc 8 : thème

Emplacement : `page.tsx`, `<p className={P}>` de la section « Thème » (l.153-160). Codes en ligne à conserver : `?theme=clair`, `?theme=sombre`, `data-theme="sombre"`.
Brouillon : « Par défaut, le widget suit le mode clair ou sombre de ton visiteur. Pour le fixer, ajoute `?theme=clair` ou `?theme=sombre` à l'adresse de l'iframe, ou `data-theme="sombre"` sur le script. »

- **A** (retouché)
> Par défaut, le widget suit le mode clair ou sombre de l'appareil de ton visiteur. Pour imposer un thème, ajoute `?theme=clair` ou `?theme=sombre` à l'adresse de l'iframe, ou `data-theme="sombre"` au script.
- **B** (par situation)
> Rien à faire : le widget s'adapte au mode clair ou sombre de ton visiteur. Ton site garde toujours le même fond ? Impose le thème avec `?theme=clair` ou `?theme=sombre` au bout de l'adresse de l'iframe, ou avec `data-theme="sombre"` sur le script.
- **C** (les trois thèmes)
> Trois thèmes : auto (par défaut, le widget suit le mode de ton visiteur), clair et sombre. Pour fixer clair ou sombre, ajoute `?theme=clair` ou `?theme=sombre` à l'adresse de l'iframe, ou `data-theme="sombre"` sur le script.

Reco : **B**, parce que « ton site garde toujours le même fond ? » est la vraie raison de toucher au réglage ; elle évite de décrire une option dont on n'a pas besoin.

## Bloc 9 : ce que le widget affiche

Emplacement : `page.tsx`, `<p className={P}>` de la section « Ce que le widget affiche » (l.165-170).
Brouillon : « Une vanne par jour, la même sur tous les sites : l'amorce, un bouton pour révéler la chute, un lien pour comprendre pourquoi elle marche, et notre nom. Pas de pub, pas de cookie. »

- **A** (retouché, libellés réels)
> Une vanne par jour, la même sur tous les sites : l'amorce, un bouton « Révéler la chute », un lien « Pourquoi ça marche ? » et le lien « Deviens Marrant ». Pas de pub, pas de cookie.
- **B** (côté visiteur)
> Tes visiteurs voient l'amorce d'une vanne, un bouton pour découvrir la chute, un lien qui explique pourquoi elle marche, et le lien « Deviens Marrant », toujours présent. La vanne change chaque jour, la même sur tous les sites. Aucune pub, aucun cookie, aucun suivi.
- **C** (ce qu'il montre, ce qu'il ne montre pas)
> Une vanne par jour, la même sur tous les sites. Ce que le widget montre : l'amorce, un bouton pour voir la chute, un lien pour comprendre pourquoi ça marche. Ce qu'il ne montre pas : pub, cookie, suivi. Ce qu'il montre toujours : le lien « Deviens Marrant », que tu laisses visible.

Reco : **C**, parce qu'en trois phrases courtes elle fait le tour de l'honnêteté du widget (y compris le lien non désactivable), ce qui est ce qu'un site tiers aime citer.

## Bloc 10 : pour les développeurs

Emplacement : `page.tsx`, premier `<p className={P}>` de la section « Pour les développeurs » (l.172-178), avant `LICENCE_API` (intouchable). Code en ligne à conserver : `GET {origine}{chemin API}`.
Brouillon : « Une API en lecture seule renvoie la vanne du jour en JSON : `GET ...`. Champs : type, date, amorce, chute, url, attribution, license. »

- **A** (retouché)
> Une API en lecture seule renvoie la vanne du jour en JSON : `GET ...`. Champs : type, date, amorce, chute, url, attribution, license.
- **B** (pour qui ne veut pas d'iframe)
> Pas d'iframe ? Une API en lecture seule renvoie la vanne du jour en JSON : `GET ...`. Tu y trouves type, date, amorce, chute, url, attribution et license. Les règles d'usage sont dans la licence juste en dessous.
- **C** (sec, avec la limite)
> API JSON, lecture seule : `GET ...`. Réponse : type, date, amorce, chute, url, attribution, license. Limite : 60 requêtes par minute et par IP. Licence juste en dessous.

Reco : **B**, parce qu'elle dit à qui l'API s'adresse et renvoie vers la licence ; C seulement si le plafond de 60 requêtes par minute est bien en place dans le code au moment de la mise en ligne (cité dans la synthèse s22, non vérifié ici).

## Bloc 11 : libellés du bouton « Copier »

Emplacement : `apps/web/src/components/widget/bloc-code.tsx`, l.35-36 (états repos, copie, échec). Le texte sr-only « Code copié » (l.47) reste tel quel. Le bouton se trouve sur 320 px à côté du petit libellé (« IFRAME »), donc rester court.
Brouillon : « Copier » / « Copié » / « Sélectionne le code »

- **A** (retouché : l'échec dit ce qui se passe)
> Copier / Copié / Copie impossible, sélectionne le code
- **B** (plus explicite)
> Copier le code / Code copié / Sélectionne le code à la main
- **C** (l'échec donne la marche à suivre)
> Copier / Copié / Sélectionne puis copie

Reco : **C**, parce que « Copier » et « Copié » sont déjà les bons mots, et que le seul état à améliorer est l'échec : « Sélectionne puis copie » dit quoi faire en trois mots, sans jargon (et tient sur 320 px).

---

## Contrôles

- Tiret cadratin et demi-cadratin : zéro dans ce fichier (recherche automatique faite sur les deux caractères).
- Title : A 51, B 50, C 49 caractères (limite 60).
- Description : A 147, B 134, C 133 caractères (fourchette 120 à 155).
- « vanne du jour » présent dans les 3 title et les 3 descriptions.
- Zéro promesse de trafic ou de résultat SEO pour l'hôte ; zéro témoignage ; zéro concurrent nommé.
