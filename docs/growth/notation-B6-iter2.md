# Notation : B6 /blog/blagues-vacances-ete-entre-amis (itération 2, 05/10/2026)

> Revue @reviewer. Base : captures du rendu production de l'aperçu (`snap3/blagues-vacances-ete-entre-amis/` : m00 à m07 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), `apercu-source.html`, brouillon `docs/copy/articles-forte-frappe/B6-blagues-vacances-entre-amis.md` (numéros de ligne = ce fichier ; l'iter1 citait les lignes d'avant la suppression de l.91-92, d'où un décalage de 2 après la route), `config/blog-cta.ts` l.93-99, `config/blog-forte-frappe.ts` l.81-82, `config/blog-related-cards.ts` l.71-75, `lib/blog-article-page.ts` l.76-78.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : 20 vannes, slug, title, H2, ancres, questions de FAQ inchangés ; pages thèmes non touchées ; « 1 500+ » absent. Grep U+2014 : 0 dans le brouillon, 0 dans le HTML servi. Zéro humoriste, zéro concurrent, zéro marque, aucun chiffre ajouté.
> Non compté : boutons Partager absents (sans JS) ; « À lire ensuite » réduit à l'étalon (poisson d'avril et gamer pas encore publiés) ; `<meta name="description">` générique de l'aperçu (le JSON-LD porte la nouvelle meta).

## 1. Correctifs iter1 : appliqués et visibles

| # | Correctif | Brouillon / code | Capture |
|---|---|---|---|
| C1 | Intro concrète, « vacances d'été » | l.46 | m00 |
| C2 | Soirées sous la location, l.91 supprimée | l.68 ; route : une seule sortie (l.91, Répartie) | m01, m02 |
| C3 | « Valeur sûre » une fois | l.114 (seule occurrence restante : l.158) | m03, m04 |
| C4 | Promesse Confiance | l.136 | m04 |
| C5 | Indication n°4 | l.66 | m01 |
| C6 | Indication n°14 | l.112 | m03 |
| C7 | Quiz vendu pour une personne | l.178 | m05 |
| C8 | Test de la FAQ 3 | l.196 | d-bas |
| C9 | Meta avec « entre amis » et « l'été » | l.26 | JSON-LD de `apercu-source.html` : « 20 blagues de vacances entre amis pour l'été [...] » |
| C10 | CTA « même si tu n'es pas le drôle de la bande » | blog-cta.ts l.96 = brouillon l.18 | m05 |
| C11 | Parcours Confiance | blog-forte-frappe.ts l.82 | d-bas |
| G1 | Plus de « Mis à jour » antérieur | blog-article-page.ts l.76-78 | m00 : « 3 juin 2027 » seul ; JSON-LD `dateModified` = `datePublished` = 2027-06-03 |

12 sur 12. Cartes « À lire ensuite » : étalon, poisson d'avril, gamer (`blog-related-cards.ts` l.71-75), plus de « Comment faire rire une fille ».

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref » et sommaire dans le 1er écran (m00), intro qui mène à la n°1 sans détour. |
| 2 | Sorties vers une 2e page | **10/10** | Soirées au soir de la location, Répartie seule après la route, autodérision à sa place (l'argent), encart Confiance = l.136 = CTA. |
| 3 | CTA d'inscription | **10/10** | « Reste à oser les sortir » + l'objection « pas le drôle de la bande » traitée (m05). |
| 4 | Lisibilité mobile et structure | **10/10** | Vannes complètes, guillemets intérieurs rendus en “ ” (typographie française correcte), indications lisibles en 390 px. |
| 5 | Ton Marrant des textes affichés | **9/10** | L'intro (l.46, m00) évente deux chutes : « qui ose lancer le lave-vaisselle » 10 lignes avant « Personne n'a osé » (n°1), et « petites décisions collectives qui prennent une heure : [...] qui paie le dentifrice » avant « Le dentifrice a pris une soirée » (n°10). Même défaut que la chute éventée de B5 (iter1, C9) ; il vient des exemples prescrits par C1 de l'iter1. |
| 6 | Conformité | **10/10** | Confiance décrit par sa propre promesse ; plus d'indication qui fait viser quelqu'un (n°4) ; rien sur l'argent de quelqu'un. |
| 7 | Sécurité SEO | **10/10** | Meta avec « entre amis » et « l'été » (146 car.), « vacances d'été » dans le corps, `dateModified` juste, title, H2 et ancres inchangés. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage `with-url` ancré `#vanne-N`, scroll, `src=`). |

**Note globale : 9,9/10** (79/80), contre 8,8 à l'iter1.
**Après le correctif ci-dessous : 10/10 sur les 8 critères.**

## 3. Correctif restant

### C1. Des exemples d'intro qui ne disent pas les chutes (critère 5)

Fichier : `docs/copy/articles-forte-frappe/B6-blagues-vacances-entre-amis.md`, puis réimport.
**Avant** (l.46, 2e phrase) : `Ce qui fait rire, ce sont les petites décisions collectives qui prennent une heure : qui dort où, qui paie le dentifrice, qui ose lancer le lave-vaisselle.`
**Après** : `Ce qui fait rire, ce sont les petites décisions collectives qui prennent une heure : qui dort où, qui choisit la musique, qui fait les courses.`
Pourquoi : les 3 exemples renvoient toujours à des sections (chambres, n°3 ; playlist, n°6 ; courses, n°10 à 13) sans annoncer aucune chute : « qui dort où » ne dit rien de la grande chambre vide, « qui choisit la musique » ne dit rien de l'auteur de la règle qui commente le premier. Même longueur : la n°1 ne descend pas. Les 1re et 3e phrases de l.46 ne changent pas (« vacances d'été » reste).

Diff réel (P0 s11) : 2 exemples sur 3 remplacés dans 1 phrase (9 mots → 7) sur environ 200 lignes de contenu ; 0 caractère dans les 20 vannes, le slug, le title, la meta, les H2, les ancres, les questions de FAQ. Zéro code.

Vérification des correctifs iter1 (P0 s11) : chaque ligne visée par C1 à C9 et la ligne CTA portent le texte prescrit, au caractère près ; les 20 vannes n'étaient visées par aucun correctif.

## 4. Hors note (sans effet sur le 10)

- **Section location (l.54)** : « découvre en direct qu'il ne sait pas lancer un lave-vaisselle » prépare la n°1 sans dire sa chute (« par respect pour lui ») ; présent et non compté à l'iter1, à laisser.
- **Section groupe de discussion** : trois sorties (phrases drôles l.120, famille l.134, Confiance l.136). Inchangé depuis l'iter1, qui ne l'a pas compté ; si @copywriter retouche le fichier, retirer l.134 (famille sort déjà dans la liste de fin, l.175) est possible, pas exigé.
- **« 3,40 € » (n°11) et « 3,20 euros » (n°14)** : graphies dans les vannes, intouchables.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B6-iter2.md
- Décisions prises : 9,9/10 (79/80) ; C1 à C11 et G1 appliqués et visibles ; 1 correctif d'une demi-phrase (l.46) pour 10/10.
- Points d'attention : @copywriter applique C1 puis réimport ; volumes Search Console « blagues de vacances » / « blagues d'été » toujours à vérifier (handoff du fichier B6, point 1).
---
