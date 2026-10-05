# Notation : B2 /blog/blagues-de-gamer-jeux-video (itération 2, 05/10/2026)

> Revue @reviewer. Base : captures de production de la page d'aperçu admin (`snap/blagues-de-gamer-jeux-video/` : m00 à m08 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), HTML source de la page, brouillon `docs/copy/articles-forte-frappe/B2-blagues-de-gamer.md` (numéros de ligne = ce fichier), `components/ui/markdown-renderer.tsx`, `lib/fr-typo.ts`, `config/blog-forte-frappe.ts`, `lib/vannes-themes.ts`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : aucun correctif ne touche le texte des 24 vannes (les 2 correctifs de rendu agissent à l'affichage, texte stocké intact) ni la page thème Gaming (textes validés par Thomas) ; 0 tiret cadratin ; 0 humoriste.
> Non compté : boutons Partager absents (sans JS ; les 24 emplacements sont dans le HTML).

## 1. Correctifs iter1 : appliqués et visibles

| # | Correctif | Brouillon | Capture |
|---|---|---|---|
| C1 | « Le test » sans redite | l.47 | m00 |
| C2 | Sortie Gaming en ancre descriptive | l.73 | m01 : « thème gaming du catalogue » |
| C3 | Indications n°1, 5, 6, 9 | l.56, 68, 71, 88 | m01, m02 |
| C4 | Indications n°14, 16, 17, 20, 22, 23 | l.111 à l.154 | m03, m04 |
| C5 | Intro Défaite | l.102 | m02 |
| C6 | Quiz | l.187 | m05 |
| C7 | FAQ 1 | l.197 | m06 |
| C8 | Page thème Gaming | non appliqué | **Retiré** : arbitrage Thomas du 05/10 (brouillon l.31), textes de `vannes-themes.ts` = [CHOIX UTILISATEUR], non re-questionnable. La différence est portée par l'article (C2 appliqué). |

7 sur 7 applicables.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref » et sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **9/10** | L'encart parcours affiche Machine à Café, « Des blagues toutes faites à ta propre voix » (m07, d-bas), alors que le CTA juste au-dessus vend Répartie (« dont Répartie », m06) et que la section Vocal y renvoie (l.96). |
| 3 | CTA d'inscription | **10/10** | Après le corps, titre « Reste à les sortir en vocal », note vraie (m06). |
| 4 | Lisibilité mobile et structure | **8/10** | 9 vannes sur 24 affichent des guillemets français à deux niveaux (« … « bonsoir madame ». ») : la vanne semble finir au 1er « » » (n°7, 9, 10, 11, 12, 13, 16, 18, 23 ; m02 à m04) ; et la n°18 se coupe dans le nombre : « niveau 4 » en fin de ligne, « 812 » à la suivante (m03). |
| 5 | Ton Marrant des textes affichés | **9/10** | Le 2e paragraphe (l.45) finit sur « Ici, chaque vanne vient avec son moment et sa façon de la sortir à ta team. » : redite de l'« En bref » (« chacune avec la façon de la dire ou de l'envoyer ») et 2e « Ici, » en deux paragraphes (l.43). |
| 6 | Conformité | **10/10** | Quiz exact, FAQ 1 cohérente avec la n°11, zéro marque, jeu, console, humoriste ou tiret cadratin. |
| 7 | Sécurité SEO | **10/10** | Title 54 car., meta 149, 6 H2 en question, ancres justes ; l'ancre exacte « les blagues de gamer » n'est plus donnée à la page thème ; arbitrage Thomas respecté. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage avec URL, ancres, scroll, `src=`). |

**Note globale : 9,5/10** (76/80), contre 9,25 à l'iter1.
**Après les 4 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 3. Correctifs exacts

### C1. Guillemets du 2e niveau rendus en “…” (critère 4)

Le renderer convertit déjà les guillemets droits imbriqués en “…” (`frenchQuotes`, l.134-138, commentaire : « sinon on lit « « … » … » et la vanne semble finir trop tôt »), mais pas les « » écrits en dur, ceux de B2. Correction au rendu, texte stocké intact.

Fichier : `apps/web/src/components/ui/markdown-renderer.tsx`. **Avant** (l.43-46) : la fonction `innerQuotes`, puis rien. **Après**, ajouter sous `innerQuotes` :
```ts
/**
 * « … « x » … » écrit en guillemets français aux deux niveaux (vannes de B2) :
 * le 2e niveau est rendu “x”, comme frenchQuotes le fait pour "x". Rendu seul,
 * texte stocké intact. Imbrication déséquilibrée ou à 3 niveaux : texte inchangé.
 */
export function nestedGuillemets(text: string): string {
  if ((text.match(/«/g) ?? []).length < 2) return text;
  let depth = 0;
  let out = "";
  for (const c of text) {
    if (c === "«") {
      depth++;
      if (depth > 2) return text;
      out += depth === 2 ? "“" : c;
    } else if (c === "»") {
      if (depth === 0) return text;
      out += depth === 2 ? "”" : c;
      depth--;
    } else out += c;
  }
  if (depth !== 0) return text;
  return out.replace(new RegExp(`“[ ${NBSP}]+`, "g"), "“").replace(new RegExp(`[ ${NBSP}]+”`, "g"), "”");
}
```
**Avant** (l.145) : `  let result = escapeHtml(frTypo(frenchQuotes(text)));`
**Après** : `  let result = escapeHtml(frTypo(nestedGuillemets(frenchQuotes(text))));`
Test : `nestedGuillemets("« Il dit « bonsoir ». Fin. »")` vaut `"« Il dit “bonsoir”. Fin. »"` ; une phrase à « » simples ressort inchangée. Les vannes à un seul niveau (B1, B3, A5) ne bougent pas.

### C2. Nombres à milliers et heures insécables (critère 4)

Fichier : `apps/web/src/lib/fr-typo.ts`. **Avant** (l.23-25) :
```ts
      // « 7 techniques », « 5 min » restent liés
      .replace(/(\d) (?=[A-Za-zÀ-ÿ€%°])/g, `$1${NBSP}`)
  );
```
**Après** :
```ts
      // « 7 techniques », « 5 min » restent liés
      .replace(/(\d) (?=[A-Za-zÀ-ÿ€%°])/g, `$1${NBSP}`)
      // « 4 812 » et « 23 h 40 » ne se coupent jamais
      .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NBSP}`)
      .replace(new RegExp(`(\\d${NBSP}h) (?=\\d)`, "g"), `$1${NBSP}`)
  );
```
Effet : n°18 « niveau 4 812 » sur une seule ligne ; protège aussi « 23 h 40 » (n°12) et les heures d'A5 (« 7 h 20 »). Test `fr-typo` : `frTypo("niveau 4 812")` ne contient plus d'espace simple.

### C3. Encart parcours sur Répartie (critère 2)

Fichier : `apps/web/src/config/blog-forte-frappe.ts`. **Avant** (l.53-55) :
```ts
  // Poisson d'avril : le CTA vend « la riposte » (notation A5 iter1).
  "blagues-poisson-d-avril-adultes": "repartie",
};
```
**Après** :
```ts
  // Poisson d'avril : le CTA vend « la riposte » (notation A5 iter1).
  "blagues-poisson-d-avril-adultes": "repartie",
  // Gamer : le CTA nomme Répartie (« renvoyer la balle » en vocal), la section Vocal
  // y renvoie déjà ; Machine à Café (cluster CATALOGUE) parle de bureau (notation B2 iter2).
  "blagues-de-gamer-jeux-video": "repartie",
};
```

### C4. 2e paragraphe sans redite (critère 5)

Fichier : brouillon B2. **Avant** (l.45, fin) : `[...] Elles parlent de ce qu'on fait pendant, et de ce que les autres en pensent. Ici, chaque vanne vient avec son moment et sa façon de la sortir à ta team.`
**Après** : `[...] Elles parlent de ce qu'on fait pendant, et de ce que les autres en pensent.`
Puis réimport `--update`.

Diff réel (P0 s11) : 1 phrase retirée sur environ 170 lignes de contenu ; environ 25 lignes de code (C1 à C3) ; 0 caractère stocké modifié dans les 24 vannes. Code : pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, ligne dans `REPLIT_ACTIONS.md`.

## 4. Ne comptent pas contre le 10

- **« Mis à jour le 5 octobre 2026 »** sous « 26 novembre 2026 » : artefact d'aperçu, disparaît à la publication (voir notation B1 iter2, §4).
- **H2 à parenthèse sur 4 lignes en 390 px** (m00, m01) : ils portent les mots-clés et fixent les ancres ; les raccourcir coûterait plus qu'ils ne gênent.
- **« À lire ensuite »** : cartes communes à tous les CATALOGUE (gabarit).

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B2-iter2.md
- Décisions prises : 9,5/10 ; C1 à C7 de l'iter1 appliqués et visibles ; C8 retiré (arbitrage Thomas, page thème intouchable) ; 4 correctifs pour 10/10, dont 2 de rendu sans toucher aux vannes.
- Points d'attention : @fullstack applique C1 à C3 avec leurs tests ; @copywriter applique C4 puis réimport `--update` ; nouvelles captures m02 à m04 et m07 avant le 26/11.
---
