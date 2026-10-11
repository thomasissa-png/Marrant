# Notation : /blog/meilleures-blagues-droles-2026 (itération 4, 05/10/2026)

> Revue @reviewer. Base : code à HEAD après le commit ae4b79b (`blog/[slug]/page.tsx`, `components/ui/markdown-renderer.tsx`, `lib/fr-typo.ts`, texte de l'article dans `lib/blog-articles.ts` l.1370 et suivantes) et NOUVELLES captures du rendu en ligne : mobile 390 px (m00 à m09) et desktop (haut et bas de page). Les 12 captures ont été lues une par une.
> Grille de 8 critères identique aux itérations 1 à 3. Intouchables : les 50 vannes, le slug, le title, la meta, le H1, les H2 et « 1 500+ ».
> Limites : tests non exécutés et diff git non mesuré (consigne : pas de git), aucune donnée Umami.

## 1. Vérification des 3 correctifs de l'itération 3

| # | Correctif | Code | Rendu (capture) | Verdict |
|---|---|---|---|---|
| E1 | FAQ et cartes passées dans `frTypo` | `page.tsx` l.278-279 (FAQ), l.301, l.312, l.337 (cartes). JSON-LD FAQ l.192 resté en texte brut. | m07 : « Comment trouver des blagues drôles à / raconter ? », le « ? » reste collé à « raconter ». Les 5 questions finissent sans « ? » orphelin. m08 et desktop-bottom : « Comment faire rire une fille : 7 techniques » sur une ligne. | PASS |
| E2 | Mot composé court jamais coupé | `markdown-renderer.tsx` l.43-47 (`COMPOUND_RE`), l.130, l.139-146 (`keepCompoundsTogether`, balises laissées intactes) | m01, n°2 : « Post-it pour / se rappeler d'acheter des Post-it. », aucune coupure. m03, n°24 : « Le “on se fait un truc ce / week-end ?” », aucune coupure. m05, n°40 : « du Wi-Fi. » entier. Les mots longs se coupent normalement, sans débordement (« pré-production », n°6, m01). | PASS |
| E3 | 2 colonnes quand il n'y a que 2 cartes | `page.tsx` l.326 | desktop-bottom : les 2 cartes (fille, homme) occupent toute la largeur, sans colonne vide. Mobile inchangé (1 colonne, m08). | PASS |

Intouchables vérifiés au rendu : H1 (m00, desktop-top), 8 H2, 50 vannes (texte stocké inchangé), slug, title, meta. « 1 500+ » est absent de l'article. Aucun pop-up sur les 12 captures. Zéro tiret cadratin dans le texte de l'article (le seul « — » trouvé près de la l.1370 est un commentaire de code à la l.1369, jamais affiché). Aucun humoriste nommé : la FAQ dit « Les humoristes » au pluriel générique (m07). Promesses vérifiées : quiz « sans inscription » (m06), « 15 min/semaine » identique dans le corps (m02) et dans l'encart parcours (m08), « Les vannes de cette page restent en accès libre » (m07) vrai puisque l'article ne bloque rien.

La carte « Suivant » seule sur la moitié droite en desktop (desktop-bottom) relève du choix T37 (`page.tsx` l.292), documenté et cohérent avec le sens de lecture. Ce n'est pas un défaut.

## 2. Grille et notes

| # | Critère | Iter1 | Iter2 | Iter3 | Iter4 | Justification (1 ligne) |
|---|---|---|---|---|---|---|
| 1 | Réponse immédiate à l'intention | 8 | 10 | 10 | **10** | Sommaire à 7 ancres dans le 1er écran mobile (m00) et desktop (desktop-top). |
| 2 | Sorties vers une 2e page | 9 | 9 | 10 | **10** | Suivant, 2 cartes distinctes, 7 pages situation, blague du jour, catalogue, quiz, parcours. Aucun doublon. |
| 3 | CTA d'inscription | 6 | 10 | 10 | **10** | Juste après le corps, promesse propre, note rassurante (m07, desktop-bottom). |
| 4 | Lisibilité mobile et structure | 7 | 9 | 9 | **10** | E1 à E3 vus au rendu : plus de « ? » orphelin, plus de mot composé coupé, plus de colonne vide. |
| 5 | Ton Marrant des textes affichés | 8 | 9 | 10 | **9** | Une indication de jeu sur 12 passe à l'infinitif (« Laisser »), alors que la page tutoie partout. Détail en F1. |
| 6 | Conformité | 9 | 10 | 10 | **10** | Zéro humoriste nommé, zéro tiret cadratin, promesses vraies. |
| 7 | Sécurité SEO | 10 | 10 | 10 | **10** | E1 à E3 portent sur le rendu seul. JSON-LD, id des H2 et texte stocké inchangés. |
| 8 | Mesure | 7 | 10 | 10 | **10** | `data-blog-zone="cluster"`, `"related"` et `"parcours"` toujours en place. |

**Note globale : 9,9/10** (79/80, contre 79/80 à l'itération 3, 77/80 à l'itération 2 et 64/80 à l'itération 1).
**Après F1 : 10/10 sur les 8 critères.**

Correction de l'itération 3 : elle donnait 10 au critère 5 en écrivant que « les autres textes affichés sont dans la voix ». C'était faux pour la n°8, visible depuis l'itération 1 (m01). Je l'ai manqué trois fois parce que je relisais les vannes et les libellés, pas les 12 indications de jeu en italique. Cette fois, je les ai relues une par une (`blog-articles.ts` l.1389 à l.1436).

## 3. Top 3

1. **F1 (seul défaut restant)** : la n°8 dit « Laisser l'absurde faire son chemin. » Les 11 autres indications parlent au lecteur à l'impératif (« Accélère », « Fais semblant », « Joue », « Marmonne ») ou en phrase nominale (« Deadpan total. »). L'infinitif sonne comme une consigne de fiche interne, pas comme Marrant qui tutoie.
2. Rien d'autre qui compte contre la note.
3. Rien d'autre qui compte contre la note.

## 4. Correctif exact

### F1. Indication de jeu de la n°8 à l'impératif

Fichier : `apps/web/src/lib/blog-articles.ts`, l.1410. La ligne est l'indication de jeu en italique sous la vanne, pas la vanne elle-même : le texte entre « … » de la n°8 ne bouge pas.

**Avant** :
```md
*→ Pause après "juste en soirée". Laisser l'absurde faire son chemin.*
```
**Après** :
```md
*→ Pause après "juste en soirée". Laisse l'absurde faire son chemin.*
```

Diff réel attendu (P0 s11) : 1 mot sur 1 ligne de contenu, 0 ligne de code, 0 intouchable touché (vanne, slug, title, meta, H1, H2 inchangés). Le `data-text` du bouton Partager (`markdown-renderer.tsx` l.278) ne prend que la vanne entre « … », il ne change donc pas. Aucun test à modifier. Déploiement à noter dans `REPLIT_ACTIONS.md`. Pas besoin de nouvelle capture : la ligne est déjà en m01.

Si Thomas considère que les indications de jeu font partie des « 50 vannes » intouchables, F1 tombe et la note passe à 10/10 sans rien changer.

## 5. Ne comptent pas contre le 10

- **Coupure « (le / lundi » dans le 2e H2** (m01) : « Quelles blagues au bureau ? (le » puis « lundi matin est un sport de combat) ». Un article court en fin de ligne reste correct en typographie française. Le corriger demanderait une règle générale dans `frTypo`, ou une composition des titres au cas par cas : coût et risque supérieurs au gain. Même constat pour « Les vannes entre / potes (le labo d'essai) » (m04).
- **Plages « 15-20 mots » (FAQ, m07) et « 2-3 secondes » (encadré CLEF, m06)** : trait d'union au lieu du demi-cadratin. C'est l'usage courant sur le web, et le navigateur ne coupe jamais entre un trait d'union et un chiffre. Aucun gain visible.
- **2 slugs du cluster sans article** (`comment-faire-rire-ses-amis`, `creer-ses-propres-blagues`) : manque de contenu, pas défaut de la page (repris de l'itération 3, pour @seo et @copywriter).
- **Conditionnés aux données (repris des itérations 1 à 3)** : sommaire en puces, 2e point d'inscription, Partager étendu à d'autres articles. À relever à 30 jours par @data-analyst.

## 6. Décisions pour Thomas (hors note, inchangées)

- Bouton « Tout débloquer à 2,99 €/mois » dans le CTA (m07) : on le garde par défaut et on lit `blog-cta-clic {bouton: premium}` à 30 jours.
- Signature « Alex Durand » du gabarit blog : hors périmètre, déjà instruite en s11.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-article-blagues-2026-iter4.md
- Décisions prises : E1 à E3 vérifiés dans le code et sur les nouvelles captures (PASS) ; critère 4 à 10 ; note 9,9/10 (79/80) ; un seul correctif restant (F1, 1 mot, critère 5) pour 10/10.
- Points d'attention : @copywriter (ou édition mineure) applique F1 à `blog-articles.ts` l.1410 ; si les indications de jeu sont jugées intouchables, la page est déjà à 10/10.
---
