# Relecture UX : accueil, maillage S3 (S3a « autres parcours », S3b « Derniers articles ») (12/10/2026)

> @ux. Code : commit `399fd14` (`components/home/autres-parcours.tsx`, `components/home/derniers-articles.tsx`, `app/(dashboard)/page.tsx`, `lib/derniers-articles.ts`, test `accueil-maillage-s3-s20.test.tsx`). Contexte lu : `hero-section.tsx`, `lib/entrees-parcours.ts`, `styles/globals.css`, spec `docs/seo/maillage-decouverte-s20.md` §3.4 et §4 S3, `docs/founder-preferences.md` (ligne du 12/10). Captures : les 6 de ce dossier (375 et 1280 px). Les textes (« Deux autres parcours : Parcours Storytelling et Parcours Boulot. », « Derniers articles ») sont validés par Thomas : **non re-questionnés**. Aucun code modifié.

## 1. Notes

| Device | Note | Résumé |
|---|---|---|
| Desktop 1280 | **9 / 10** | Liens lisibles et soulignés, bloc propre. Écart : destination des 2 nouveaux liens différente de celle des 3 cartes (§2.1). |
| Mobile 375 | **8 / 10** | Même écart de destination, plus : les deux liens de S3a tombent sur deux lignes consécutives, cibles de ~20 px sans espace entre elles (§2.3). |

Après les 2 corrections de §4 (C1, C2) : desktop 10 / 10, mobile 10 / 10 sur les critères vérifiables avec les captures fournies. C3 et C4 sont des durcissements non bloquants.

## 2. Constats

### 2.1 Destinations : incohérence à trancher, réponse = aligner les 2 nouveaux liens sur les cartes
Mesure dans le code :

| Lien | Libellé | Destination |
|---|---|---|
| 3 cartes personas (`page.tsx` l.115, 132, 149) | « Parcours Machine à Café · 3 semaines → » | `/parcours/<slug>` (ni `?src`, ni ancre) |
| Pastilles du hero (`hero-section.tsx` l.20-24) et lien « première étape » | actions (« Briller à la machine à café »…) | `?src=accueil#etape-1` (règle s17 : un lien d'entrée mène à l'étape 1) |
| S3a (`autres-parcours.tsx` l.38) | « Parcours Storytelling », « Parcours Boulot » | `?src=accueil#etape-1` |

S3a porte le libellé de la **famille cartes** (« Parcours X », un nom) mais la destination de la **famille hero** (action « lire l'étape 1 »). Cognitive walkthrough, Yanis sur mobile : il lit « Parcours Boulot », s'attend à la page du parcours (titre, durée, de quoi il s'agit, comme pour les trois cartes), et atterrit défilé sur « Étape 1 », sans titre ni cadrage. `[FRICTION H4] : à l'étape « clic sur Parcours Storytelling », le first-time user découvre une page ouverte au milieu, différente de celle des 3 liens voisins au même libellé. Solution : même destination que les cartes.`
Raisons de trancher ainsi, sans toucher aux 3 cartes (hors périmètre, validées) :
1. **Cohérence libellé / destination** (le nom du parcours mène à sa page).
2. **Aucune perte d'accès à l'étape gratuite** : `entrees-parcours.ts` l.9-10 le dit, « pour un visiteur, la page ouvre l'étape 1 dépliée » ; l'ancre ne sert qu'à défiler.
3. **SEO** : la spec §3.4 relève que Storytelling et Boulot ne sont liés qu'en `/parcours` et cherche des liens vers l'**URL propre** depuis une page explorée. `?src=accueil` oblige Google à passer par une variante dont la canonique renvoie à l'URL propre (sans danger, mais indirect). Le lien simple est le plus direct, et Bing ne connaît pas `/parcours/boulot`.
4. **Coût** : S3a ne mesurera plus `src=accueil` (comptés `direct`), exactement comme les 3 cartes aujourd'hui. Écart d'attribution **déjà existant**, qui touche les 3 cartes : à traiter à part, pour les 5 liens en même temps (§5, P2). Ne pas changer les cartes dans ce lot.
Rester en l'état (lien d'entrée) serait défendable si le libellé était « Lire la première étape de … » ; il est validé tel quel, donc c'est la destination qui s'aligne.

### 2.2 Lisibilité et repérage des liens S3a
- Soulignés (`underline underline-offset-2`), violet `#A78BFA` sur `#0D0D0D` ≈ 7,1:1, `font-medium` : le lien se distingue du texte `#B3B3B3` par le soulignement, pas par la couleur seule (WCAG 1.4.1). Lisible sur les 4 captures (ligne seule et section).
- Poids visuel volontairement faible (ligne `text-sm` sous 3 cartes riches) : conforme au texte validé. Les parcours Storytelling et Boulot restent des « parcours de second rang » visuellement ; non re-questionnable.
- Typographie : espace insécable avant « : », pas de tiret cadratin. Cas limites du code : 1 parcours publié = « Un autre parcours : Parcours Storytelling. » (Boulot avant activation), 0 = rien. Corrects.
- Regroupement : la ligne S3a et la phrase du pilier (L2 s15) ont le même style et le même `mt-6` : lues comme deux notes de bas de section distinctes. Acceptable, pas de correction.

### 2.3 [FRICTION H5] Cibles tactiles de S3a (mobile)
Les liens sont en ligne dans un `<p className="text-sm">` : hauteur de cible ≈ 20 px. Sur la capture 375 px, « Parcours Storytelling » (ligne 1) et « Parcours Boulot » (ligne 2) sont sur des lignes consécutives, **sans espace vertical entre les deux cibles** : un tap sur le bord de l'un déclenche l'autre. Exception WCAG 2.5.8 (lien dans une phrase) techniquement applicable, mais la règle du projet (44 px) et le risque de clic raté prévalent ; les cartes du dessus l'appliquent (`inline-flex min-h-[44px]`) et le projet a déjà le motif pour un lien en phrase (`vannes-list.tsx` l.239, lien « Premium »). Le même défaut existe sur la phrase du pilier juste dessous (existant, hors lot : non touché).

### 2.4 « Derniers articles » : distraction ou aide pour Yanis ?
Parcours sur la page : H1 et CTA → contenu du jour → 3 outils → « Tu te reconnais ? » (choix d'un parcours) → S3a → phrase du pilier → **Derniers articles** → CTA principal → offres → FAQ.
- **Aide, plutôt que distraction.** Yanis (20 ans, mobile, muet quand on le chambre) arrive de la section qui pose son problème. Les titres affichés (« Rester muet en groupe : 7 techniques pour reprendre la parole », « Répartie en soirée : guide anti-malaise ») répondent à sa situation, ce qui est la doctrine du site (valeur éducative d'abord, conversion en conséquence).
- Placement correct : **sous** les cartes (le choix d'un parcours reste le premier geste), **avant** le CTA principal sans le repousser dans la zone de décision : ~275 px à 375 px (1/3 d'écran).
- Poids : trois cartes bordées (« bordé = cliquable ») de même teinte que les cartes personas, donc nettement visibles. Il y a désormais 4 sorties « lire d'abord » avant le CTA (pilier + 3 articles). Risque modéré, à surveiller par la mesure (§5) plutôt qu'à réduire a priori.
- Cartes : 1 ligne = 52 px, 2 lignes = 72 px (≥ 44), écart 16 px entre cartes : **cibles tactiles conformes** sur la capture 375. À 1280 : 3 colonnes de même hauteur (`h-full`), propres.
- Repérage : titre `font-semibold` blanc dans une carte bordée ; pas d'extrait ni de date (conforme à la spec). Titre de section h2 `text-xl` aligné à gauche sur la grille (les h2 du dessus sont centrés, plus grands) : hiérarchie secondaire assumée, aligné sur les bords des cartes.

### 2.5 Accessibilité
| Point | Verdict |
|---|---|
| `section aria-labelledby` + h2 (`derniers-articles`), liste `ul`/`li` | PASS |
| Lien = titre de l'article (objet clair, hors contexte) ; S3a : « Parcours Storytelling » / « Parcours Boulot » distincts | PASS |
| Contraste lien S3a 7,1:1 ; titres `#FFFFFF` sur `#1F1F1F` | PASS |
| Focus visible | **PASS par le contour natif du navigateur** : `globals.css` n'a aucune règle `:focus-visible`, les liens des cartes et du pilier n'en ont pas non plus. Pas d'anneau violet comme les boutons (cohérence, C4). **Aucune capture clavier fournie `[À VÉRIFIER]`.** |
| Survol | cartes d'articles : `hover:border-accent-primary/40`, discret mais conforme à « Explore aussi » de `/blog` |
| `prefers-reduced-motion`, ordre DOM = ordre visuel | PASS |

## 3. Audit Nielsen (périmètre S3)
H1 PASS (cartes cliquables explicites) · H2 PASS (vocabulaire du site) · H3 PASS (liens simples, retour navigateur) · **H4 FAIL (destination, §2.1)** · **H5 FAIL mineur mobile (§2.3)** · H6 PASS · H7 n/a · H8 PASS (une ligne + 3 titres, sans extrait) · H9 n/a · H10 n/a.

## 4. Corrections exactes

**C1 (P0), `components/home/autres-parcours.tsx`** : lien vers la page du parcours, comme les cartes.
- l.38 : `href: parcoursEtape1Href(p.slug, "accueil")` devient `` href: `/parcours/${p.slug}` `` ; garder le filtre `isParcoursSlug(p.slug) && !exclus.includes(p.slug)` (c'est lui qui suit les interrupteurs de publication).
- l.4 : retirer l'import de `parcoursEtape1Href`.
- Docstring l.14 : « Liens vers la page du parcours (comme les cartes, sans `?src`) » à la place de « étape 1, `?src=accueil` ».
- Tests `accueil-maillage-s3-s20.test.tsx` : l.93 → `"/parcours/storytelling"` ; l.102-103 → `"/parcours/storytelling"` et `"/parcours/boulot"` ; l.97 et 112 : intitulés et assertion `not.toContain("?")` au lieu de `toContain("?src=accueil")`.

**C2 (P0), même fichier, l.48-51** : cible 44 px, motif déjà utilisé par `vannes-list.tsx` l.239 :
`className="inline-flex min-h-[44px] items-center font-medium text-accent-link underline underline-offset-2"`
Effet à 375 px : « Parcours Storytelling » et « Parcours Boulot » sur deux lignes de 44 px, plus de zone commune. L'ordre de coupure ne change pas (« et » reste en fin de ligne 1, « . » ne passe pas seul à la ligne). Ajouter au test : `expect(lien).toHaveClass("min-h-[44px]")`. Recapturer la ligne S3a à 375 et 1280 px.

**C3 (P2, non bloquant), `derniers-articles.tsx` l.18** : `sm:grid-cols-3` devient `md:grid-cols-3`, pour suivre le point de rupture des cartes du dessus (3 colonnes dès 768 px) ; entre 640 et 767 px les cartes d'articles font ~190 px de large (titres sur 3 à 4 lignes). Capture 640 / 768 px à fournir `[non couvert par les captures]`.

**C4 (P3, non bloquant)** : anneau de focus du site (`focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none`) sur la carte d'article et les liens S3a, **seulement si** @design l'applique aussi aux liens existants de la section (sinon on crée une incohérence interne).

## 5. Mesure (HEART) et suite
| Dimension | Signal | Cible |
|---|---|---|
| Engagement | clics sur « Derniers articles » et sur S3a | à observer sur 14 jours (aucun historique `[HYPOTHÈSE]`) |
| Task success (garde-fou) | clics sur le CTA principal depuis l'accueil | pas de baisse par rapport aux 14 jours précédents (seuil à fixer par @data-analyst) |
- Pour mesurer sans JS client : attribut `data-umami-event="accueil-article-clic"` sur les 3 liens (composant serveur) `[À VÉRIFIER : convention d'événements, data-analyst]`.
- **P2 hors lot** : les 3 cartes personas n'ont pas `?src=accueil` (comptées `direct`). Si Thomas veut l'attribution des 5 parcours depuis l'accueil, ajouter `?src=accueil` aux 5 liens d'un seul coup (sans `#etape-1`), après le premier contrôle de crawl du 19/10 de la spec.

## 6. Recette demandée
1. Captures 375 et 1280 px de la ligne S3a après C2 (deux lignes de 44 px à 375) ; capture 768 px de la section.
2. Clavier : Tab traverse les 3 cartes, S3a (2 liens), pilier, 3 articles, dans l'ordre visuel ; contour de focus visible sur chacun (capture).
3. HTML serveur : les 2 liens S3a sont `/parcours/storytelling` et `/parcours/boulot` (sans paramètre) ; avant l'activation de Boulot : « Un autre parcours : Parcours Storytelling. ».
4. Zéro tiret cadratin dans le texte rendu.

## 7. Décision
**GO conditionnel** : C1 et C2 avant mise en ligne (une ligne de code chacune, un test à adapter). C3, C4 recommandés, sans effet sur la note. Après C1 et C2 : desktop 10 / 10, mobile 10 / 10.

---
**Handoff → @fullstack (C1, C2, tests ; C3 si accepté), @design (C4 : arbitrage focus), @data-analyst (§5), @qa (recette §6)**
- Fichier produit : `/home/user/Marrant/docs/seo/captures-accueil-s3/relecture-ux.md`.
- Décisions : S3a s'aligne sur les cartes (page du parcours, sans `?src` ni `#etape-1`) ; les 3 cartes et la phrase du pilier ne sont pas modifiées ; placement de « Derniers articles » conservé (aide plus que distraction).
- Points d'attention : écart d'attribution `?src` existant sur les 3 cartes (hors lot) ; absence de capture clavier et 640 / 768 px ; déploiement à noter dans `REPLIT_ACTIONS.md`.
---

# Tour 2 : relecture du commit `3902aa8` (12/10/2026)

Preuves : `autres-parcours.tsx`, `derniers-articles.tsx`, `page.tsx` l.155-169, test `accueil-maillage-s3-s20.test.tsx` l.83-121, captures `accueil-s3-section-{375,640,768,1280}px.png`, `accueil-s3a-ligne-375px.png`, `accueil-s3b-focus-clavier-1280px.png`.

## Notes

| Device | Tour 1 | Tour 2 | Reste |
|---|---|---|---|
| Desktop 1280, 768, 640 | 9 | **10 / 10** | rien |
| Mobile 375 | 8 | **9 / 10** | 1 correction de mise en page (C5) |

## 1. Les corrections du tour 1 : constat

| Correction | État | Preuve |
|---|---|---|
| C1 liens `/parcours/<slug>` | **Résolu** | `autres-parcours.tsx` l.38 ; filtre `isParcoursSlug` conservé (interrupteurs de publication) ; test l.94, 103-104, 114 (`not.toContain("?")`). |
| C2 cibles 44 px | **Résolu, mais effet de bord** (§2) | classes `inline-flex min-h-[44px] items-center whitespace-nowrap` testées l.106. |
| C3 `md:grid-cols-3` | **Résolu** | 640 px : 3 cartes pleine largeur, titres sur 1 ligne ; 768 px : 3 colonnes de même hauteur, titres sur 3 lignes, lisibles ; 1280 px : 3 colonnes, 2 lignes. |
| Titre centré, `frTypo`, espacements, anneau de focus | **Résolu** | titre centré (cohérent avec « Tu te reconnais ? ») ; S3a à 16 px des cartes (groupé avec elles), pilier à 32 px (séparé) ; « pas : 7 raisons » insécable ; capture clavier 1280 : anneau violet 2 px + écart 2 px, visible, sans chevauchement (24 px entre cartes). |

## 2. Effet de bord de C2 et position sur l'alternative `inline-block py-3 -my-3`

Constat sur `accueil-s3a-ligne-375px.png` : « Parcours Boulot. » est sur une 2e ligne de 44 px, à ~44 px du « et » de la ligne 1 (22 px de plus que l'interligne normal) : un trou visible au milieu d'une phrase, et un bloc d'environ 90 px pour une ligne de texte. Défaut de rendu réel, pas de fonction (les cibles sont bonnes).

**Position : ne pas retenir l'alternative, elle ne tient pas quand les liens sont sur deux lignes consécutives.** Géométrie : `text-sm` = interligne 20 px (`1.25rem`, il écrase le 1,6 du `body`) ; la boîte d'un lien inline fait ~17 px de haut ; avec `py-3` elle devient ~41 px, centrée sur la ligne. Deux liens sur deux lignes voisines (pas de 20 px) voient donc leurs zones **se chevaucher d'environ 21 px** : le lien peint en dernier gagne la zone commune, et la cible effective du premier retombe à ~20 px, soit aucun gain dans le cas même qui pose problème (375 px). Deux cibles empilées de 44 px sans chevauchement exigent 44 px de pas entre les lignes : c'est exactement ce que fait C2. `-my-3` sur un `inline-block` n'y change rien (marges négatives sur boîte en ligne : alignement de base fragile `[À VÉRIFIER sur appareil]`). Le trou vient de l'empilement, il faut supprimer l'empilement, pas lutter contre.

**C5 (P1), `autres-parcours.tsx` l.44, une classe : la phrase passe à la ligne après le deux-points sous 640 px, et les deux liens se retrouvent côte à côte sur une seule ligne.**
```tsx
<span className="block sm:inline">{autresParcoursIntro(autres.length)}&nbsp;:</span>{" "}
```
(à la place de `{autresParcoursIntro(autres.length)}&nbsp;:{" "}`) ; les liens gardent **exactement** leurs classes actuelles (`inline-flex min-h-[44px] items-center whitespace-nowrap`).
- Largeurs mesurées sur la capture 375 : « Parcours Storytelling » 140 px, « et » ~24 px, « Parcours Boulot. » ~111 px = ~275 px, contre 343 px utiles à 375, 328 à 360, 288 à 320 : tient sur une ligne dès 320 px (marge de 13 px). Les deux cibles de 44 px sont côte à côte, donc aucun chevauchement ni trou ; la ligne de liens fait 44 px, l'intitulé 20 px : ~64 px au lieu de ~90.
- `sm:inline` (640 px) : la capture 640 montre la phrase sur une seule ligne, rendu inchangé à partir de là. Entre 462 et 639 px la phrase tiendrait sur une ligne mais pas en dessous de ~430 px : un seuil à 640 px évite que les largeurs 414 à 430 px (téléphones courants) retombent dans le trou.
- Le texte rendu est identique (le `<span>` ne change pas `textContent` : le test l.100 passe tel quel) ; le texte validé n'est pas touché. Cas limite connu : avec 3 parcours ou plus (`Trois autres parcours…`), la ligne de liens peut se casser sur mobile et reproduire le trou ; non atteint aujourd'hui (2 parcours), à revoir si Thomas publie un 6e parcours.
- Test à ajouter : `expect(container.querySelector("span")).toHaveClass("block", "sm:inline")`. Recapturer la ligne S3a à 375 et 320 px.

## 3. Reste non bloquant
- Cohérence du focus : les cartes d'articles ont l'anneau violet, les liens S3a, les cartes personas et la phrase du pilier gardent le contour natif (aucune capture clavier de S3a). Pas un défaut d'accessibilité ; si @design veut l'homogénéité, appliquer l'anneau aux liens S3a (dans le lot) sans toucher aux liens existants, ou n'y toucher nulle part. Capture clavier de S3a à ajouter à la recette `[À VÉRIFIER]`.
- À 768 px, les liens des cartes personas passent sur deux lignes (existant, hors lot).

## 4. Verdict tour 2
**GO** après C5 (une classe, un test). Notes finales attendues : desktop 10 / 10, mobile 10 / 10.

---
**Handoff Tour 2 → @fullstack (C5 + test), @design (arbitrage focus §3), @qa (captures S3a à 375 et 320 px après C5)**
- Fichier mis à jour : `/home/user/Marrant/docs/seo/captures-accueil-s3/relecture-ux.md`.
- Décisions : alternative `inline-block py-3 -my-3` écartée (chevauchement de ~21 px sur lignes consécutives) ; C2 conservé ; l'empilement des deux liens est supprimé par un retour à la ligne après le deux-points sous 640 px.
- Points d'attention : cas de 3 parcours ou plus ; capture 320 px ; déploiement à noter dans `REPLIT_ACTIONS.md`.
---
