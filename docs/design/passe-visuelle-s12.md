# Passe visuelle s12 (@design)

> Demande Thomas : « regarde les alignements de texte et tout genre la headline. Faut 2 lignes etc. »
> Périmètre : rendu visuel uniquement (coupures de titres, alignements, hiérarchie, espacements, cartes, contrastes, mobile). La passe @ux (parcours, CTA, frictions) tourne en parallèle.
> Méthode : captures réelles du site de test (64 pages x 2 largeurs, découpées en tranches d'écran), tranche 01 de toutes les pages + pages entières pour accueil, vannes, conseils, videos, parcours, parcours/repartie, blog, un article, login, register, abonnement, quiz-humour, a-propos. Cause localisée dans le code (fichier:ligne lus). Aucun fichier de code modifié.
> Ratios de contraste = formule WCAG 2.x calculée sur les hex du code (pas mesurés au pixel).

## 1. Synthèse

1. **Cause n°1 des titres cassés** : le projet n'a aucun `text-wrap: balance` et aucune espace insécable avant `:` `?` `»`. Deux ajouts globaux (T1 + T2 ci-dessous) règlent les H1/H2 orphelins de ~50 pages d'un coup (« pratique », « moment », « humoristes », « : » en début de ligne, « 5 / méthodes »).
2. **H1 de l'accueil** : coupé en flux continu (`hero-section.tsx:16-20`), donc « ça. » seul. Correctif : une phrase par ligne (2 lignes desktop, 3 lignes mobile), code exact en section 3, ligne « accueil ».
3. **Pire défaut des 34 articles de blog** : le moteur markdown (`markdown-renderer.tsx`) n'a ni citation ni séparateur, donc `> En bref :` et `---` s'affichent en clair ; en plus `space-y-4` écrase les marges de titres (H2 collés au paragraphe précédent). Correctif T5.
4. **Contrastes AA en échec** : badge secondaire 2,1:1 (« Semaine 1 », « Conseil du jour »), badge primaire 3,1:1, liens violets 14 px sur cartes 3,9:1, texte blanc sur bouton violet 4,24:1, fin de dégradé du logo/titres 2,7:1. Correctif T3 (3 tokens/classes).
5. **Alignements** : 5 largeurs de colonne différentes (1248 / 864 / 768 / 672 / 576 px), double padding sur parcours/quiz/anatomie/abonnement/article (`main` déjà `px-4 py-8`), fil d'Ariane hors de la colonne (a-propos, pages détail), deux `<main>` imbriqués (quiz, anatomie), pages légales à 170 caractères par ligne. Correctif T4.
6. **Valeurs techniques affichées telles quelles** : `ONE_LINER` (vannes), `DEBUTANT → INTERMEDIAIRE` (parcours), catégories blog en MAJUSCULES sans accent, dates `2026-03-13`, ☕ et ⚡ rendus en glyphes monochromes. Correctifs T6 à T8.
7. **Mobile 390 px** : aucun débordement horizontal constaté. Défauts : badges qui cassent en 2 lignes (abonnement), lignes de programme des parcours écrasées, padding cumulé 48 px par côté sur la carte abonnement et 36 px sur les cartes blog.
8. **Cartes** : CTA de la section « Trois outils » à 3 hauteurs différentes, cartes vidéo dont le bloc « Ce que tu vas apprendre » démarre à des hauteurs différentes, carte « vanne du jour » vide à 70 %.
9. **Doublons de captures** : 8 slugs blog sont des redirections (captures identiques à leur cible, voir section 4), donc ~30 gabarits d'article réellement distincts.
10. Décompte du tableau : 15 P0, 36 P1, 20 P2 (72 lignes). Ordre conseillé pour @fullstack : T1, T2, hero, T5, T3, T7, T4, puis le reste.

## 2. Correctifs transverses

### T1. Équilibrage des titres (règle globale) : P0
`apps/web/src/styles/globals.css`, dans `@layer base` (après la ligne 74, bloc `body`) :
```css
h1, h2, h3, h4 { text-wrap: balance; }
p, li, dd { text-wrap: pretty; }
```
Tailwind 3.4.17 est installé (`text-balance` existe) mais la règle globale évite de toucher 60 fichiers. Support : Chrome 114+, Safari 17.5+, Firefox 121+ ; sinon comportement actuel (dégradation propre).
Effets attendus (estimés, à confirmer sur capture) :
- `/videos` H1 : « Apprends à être drôle en piquant leur / mécanique aux meilleurs humoristes » (au lieu de « humoristes » seul).
- Article « Confiance en soi » : « Confiance en soi grâce à / l'humour : guide pratique » (au lieu de « pratique » seul).
- « Citation drôle : 40 perles à / ressortir au bon moment » (au lieu de « moment » seul).
- Mobile : « Deux façons / de t'y mettre » (au lieu de « mettre » seul), « Crée ton compte, / ta première vanne t'attend ».
- H2 d'articles : « Quelles blagues sortir en soirée ? / (celles qui marchent à partir de 22h) ».
`text-wrap: balance` ne s'applique qu'aux blocs de 6 lignes maximum (Chrome) : sans effet sur les paragraphes, voulu.

### T2. Typographie française : espaces insécables : P0
Nouveau fichier `apps/web/src/lib/fr-typo.ts` :
```ts
const NBSP = " ";
export function frTypo(text: string): string {
  return text
    .replace(/ ([:;!?»])/g, `${NBSP}$1`)                 // « mot : » ne se coupe plus avant la ponctuation
    .replace(/« /g, `«${NBSP}`)                           // « mot » ne se coupe plus après le guillemet ouvrant
    .replace(/(\d) (?=[A-Za-zÀ-ÿ€%°])/g, `$1${NBSP}`);    // « 7 techniques », « 5 min » restent liés
}
```
Brancher (rendu uniquement, jamais dans `metadata` ni JSON-LD) :
- `markdown-renderer.tsx:16` : `let result = escapeHtml(frTypo(text));` (corrige tous les paragraphes et H2/H3 d'articles).
- `blog/[slug]/page.tsx:210` `{frTypo(article.title)}`, `:203` idem pour le fil d'Ariane ; `blog-list-client.tsx:68` `{frTypo(article.title)}` ; `faq-section.tsx:19` `{frTypo(faq.question)}`.
- Textes JSX en dur (hero, etc.) : écrire `&nbsp;` à la main (exemples dans le tableau).
Défauts que ça supprime, vus sur captures : « : le guide » commençant une ligne (mobile `comment-devenir-drole`, mobile `/blog` H1), « composantes / : le tempo » (`timing-humour`), « Mon patron est chiant » avec « » orphelin en fin de ligne (`techniques-humoristes-pros`), « : 5 / méthodes » (`comment-improviser-des-blagues`), « : 7 / raisons concrètes » (`pourquoi-blagues-marchent-pas`), « le « / sens de l'humour » ? » (FAQ accueil mobile).

### T3. Contrastes AA : P0 (badge secondaire) / P1 (reste)
Ratios calculés (fond page `#0D0D0D`, carte `#1F1F1F`, élevé `#2A2A2A`, badge = couleur à 20 % sur carte) :

| Élément | Couleurs | Ratio | Verdict |
|---|---|---|---|
| `Badge secondary` (badge.tsx:12) | `#6D28D9` sur violet 20 % | 2,1:1 | échec net |
| `Badge primary` (badge.tsx:11) | `#8B5CF6` sur violet 20 % | 3,1:1 | échec (texte 12 px) |
| `text-accent-primary` 14 px sur carte | `#8B5CF6` sur `#1F1F1F` | 3,9:1 | échec (4,5 requis) |
| idem sur fond élevé / nav active (header.tsx:62) | `#8B5CF6` sur `#2A2A2A` | 3,4:1 | échec |
| Bouton primaire (button.tsx:11) | blanc sur `#8B5CF6` | 4,24:1 | échec (texte 14-16 px) |
| Fin de `.text-gradient` (globals.css:109) | `#6D28D9` sur `#0D0D0D` | 2,7:1 | échec même en gros texte (3:1) |
| Label « PUNCHLINE » (anatomie-vanne:233) | `#EF4444` sur `#1F1F1F` | 4,4:1 | limite |
| `text-accent-primary` sur fond page | `#8B5CF6` sur `#0D0D0D` | 4,6:1 | OK |

Correctifs :
1. `tailwind.config.ts:19-24` ajouter dans `accent` : `link: "#A78BFA"` (7,1:1 sur page, 6,1:1 sur carte, 5,3:1 sur élevé). Règle : tout texte de moins de 24 px (ou 18,66 px gras) en violet utilise `text-accent-link`, sauf `.text-gradient`.
2. `badge.tsx:11` : `primary: "bg-accent-primary/20 text-accent-link"` (4,8:1). `:12` : `secondary: "bg-accent-secondary/30 text-violet-200"` (9,9:1). `:16` `premium` : `text-accent-link`. `:6` ajouter `whitespace-nowrap` (voir T7).
3. `button.tsx:11` : `primary: "bg-accent-secondary-hover text-white hover:bg-accent-secondary focus-visible:ring-accent-secondary-hover"` (`#7C3AED`, 5,7:1 puis 7,1:1). Teinte un peu plus profonde que le violet actuel **[À VALIDER THOMAS]**. Conséquence : `feature-cards.tsx:16,27,38` passer les 3 boutons en `variant: "primary"` (aujourd'hui le 2e est `secondary`, donc d'une autre teinte). `vannes/[slug]/page.tsx:256` : ce CTA est fait à la main en `bg-accent-primary text-white`, le remplacer par le composant `Button`.
4. `globals.css:109` : `to-accent-secondary` devient `to-accent-secondary-hover` (`#7C3AED`, 3,4:1, suffisant pour le logo et les H2). Footer logo `footer.tsx:61` : `text-lg` devient `text-xl` (18 px gras est juste sous le seuil « grand texte »).
5. Remplacements `text-accent-primary` vers `text-accent-link` pour du texte courant : `markdown-renderer.tsx:24`, `hero-section.tsx:28`, `(dashboard)/page.tsx:101,118,135`, `parcours-content.tsx:252,306`, `parcours-detail.tsx:427,447,546,599`, `vannes-list.tsx:198,282,300,353`, `conseils-list.tsx:173,269,273,330`, `videos-grid.tsx:152,247,256,296`, `daily-content.tsx:168,186,235,241,304`, `login/page.tsx` et `register/page.tsx:243` (liens sous le formulaire), `header.tsx:62,163`, `anatomie-vanne/page.tsx:120,145,195,217,228`.
6. `anatomie-vanne/page.tsx:170,233` : `text-error` devient `text-red-400`.

### T4. Coque de page : largeurs, paddings, fil d'Ariane, `<main>` : P1
Référence : `(dashboard)/layout.tsx:16` pose déjà `<main className="mx-auto max-w-7xl px-4 py-8">`. Aucune page ne doit re-poser `px-4` ni `py-8/12`, ni un second `<main>`.

| Fichier:ligne | Aujourd'hui | Remplacer par | Effet visible |
|---|---|---|---|
| `parcours/page.tsx:32` | `mx-auto max-w-4xl px-4 py-12` | `mx-auto max-w-4xl` | fil d'Ariane remonte de y=155 à y=106, marge mobile 32 px vers 16 px |
| `parcours/[slug]/page.tsx:288` | `mx-auto max-w-3xl px-4 py-12` | `mx-auto max-w-3xl` | idem, colonne texte mobile +32 px |
| `blog/[slug]/page.tsx:161` | `article mx-auto max-w-3xl py-8` | `py-0` | fil d'Ariane y=139 vers y=106 |
| `abonnement/page.tsx:48` | `mx-auto max-w-2xl py-8` | `py-0` | idem |
| `quiz-humour/page.tsx:75` et `anatomie-vanne/page.tsx:99` | `<main className="mx-auto max-w-4xl px-4 py-12">` | `<div className="mx-auto max-w-4xl">` | supprime le `<main>` imbriqué (deux landmarks) et le double padding |
| `a-propos/page.tsx:54-60` | fil d'Ariane hors du `max-w-3xl` (x=96) alors que H1 à x=336 | déplacer le `<nav>` (lignes 54-58) à l'intérieur du `div` ligne 60 | breadcrumb aligné sur le H1 |
| `vannes/[slug]/page.tsx:179-187` (idem `conseils/[slug]`, `videos/[slug]` : même schéma, non capturés) | `<nav>` hors de `<article className="mx-auto max-w-2xl">` | `<nav>` déplacé dans l'`article` | idem |
| `cgu/page.tsx:10`, `confidentialite`, `mentions-legales`, `retractation/page.tsx:12` | fragment `<>` : lignes de 170 caractères | `<div className="max-w-3xl">…</div>` (aligné à gauche sur la grille du header) | 768 px de mesure au lieu de 1248 |

Échelle de largeurs à figer : `7xl` listes, `4xl` pages à grille de cartes centrée (parcours, quiz, anatomie), `3xl` lecture (article, parcours détail, légal, à-propos), `2xl` tarif et formulaires. À unifier : `premium-cta.tsx:58` (`max-w-2xl`) et `:93` (`max-w-xl`), `home-cta.tsx:23` (`max-w-xl`), `faq-section.tsx:8` (`max-w-2xl`) : tout en `max-w-2xl` (aujourd'hui 576 et 672 px se suivent sur l'accueil).

**En-tête de page** (répété 7 fois avec `mt-2` = 8 px sous un H1 de 36-40 px, et paragraphe intro sur 1240 px) : créer `components/layout/page-header.tsx`
```tsx
export function PageHeader({ title, lead }: { title: React.ReactNode; lead?: React.ReactNode }) {
  return (
    <header className="mb-8 md:mb-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>
      {lead && <p className="mt-3 max-w-3xl text-lg text-text-secondary md:mt-4">{lead}</p>}
    </header>
  );
}
```
À utiliser dans `vannes/page.tsx:81-91`, `conseils/page.tsx`, `videos/page.tsx`, `blog/page.tsx:124-135`, `parcours/page.tsx:77-87`, `glossaire/page.tsx`. Minimum si on ne crée pas le composant : `mt-2` devient `mt-3 md:mt-4` et ajouter `max-w-3xl` sur le `<p>`.

### T5. Moteur markdown des articles : P0 (`>` et `---`) / P1 (espacements, listes)
Fichier `apps/web/src/components/ui/markdown-renderer.tsx`.
1. **Cause des titres collés** : ligne 106 `space-y-4` génère `.space-y-4 > * + *{margin-top:1rem}` (spécificité supérieure) qui écrase `mt-8` (ligne 46) et `mt-6` (ligne 56). Tous les H2/H3 sont à 16 px du paragraphe précédent. Correctif : ligne 106 retirer `space-y-4`, ligne 89 `<p class="mt-4 text-text-secondary">`, ligne 46 `mt-12 mb-4`, ligne 56 `mt-8 mb-3`, et sur le conteneur `[&>*:first-child]:mt-0`.
2. **`> ` affiché en clair** (vu sur `comment-devenir-drole`, `5-types-humour`, `autoderision`, `erreurs-blagues`, `timing-humour`, `humour-noir`, `exercices`, etc.). Insérer avant la ligne 62 :
```ts
if (block.startsWith("> ")) {
  const text = block.split("\n").map((l) => l.replace(/^>\s?/, "")).join("\n");
  htmlParts.push(
    `<blockquote class="mt-6 rounded-r-lg border-l-4 border-accent-primary bg-accent-primary/10 px-4 py-3 text-text-primary">${inlineMarkdown(text).replace(/\n/g, "<br/>")}</blockquote>`
  );
  i++;
  continue;
}
if (/^-{3,}$/.test(block)) { // séparateur affiché en clair sur meilleures-blagues-droles-2026, phrases-droles-conversations
  htmlParts.push('<hr class="my-10 border-border" />');
  i++;
  continue;
}
```
3. **Bloc « phrase d'intro + liste »** rendu en lignes brutes (`Les 5 types d'humour en un coup d'oeil : / 1. … 2. …`, `Ce n'est pas : / - Être méchant…`, `Les 10 techniques en résumé :`). Avant « Regular paragraph » (ligne 87) : si `lines.slice(1)` est entièrement en `- ` ou `1. `, rendre `<p>` + `<ul>/<ol>` avec les mêmes classes que lignes 69 et 81 ; si une ligne suivante commence par `> ` (cas `machine à café : La phrase d'accroche : / > "Je suis…"`), la rendre en `<blockquote>` comme ci-dessus.
4. Guillemets droits `"…"` dans le corps : conversion possible en `« … »` dans `inlineMarkdown` mais elle touche le texte des articles **[À VALIDER THOMAS]** (P2, non incluse par défaut).

### T6. Dates lisibles : P1
`blog-list-client.tsx:74`, `blog/[slug]/page.tsx:215` et `:221` affichent `2026-03-13` / `Mis à jour le 2026-09-29`. Ajouter dans `lib/utils.ts` :
```ts
export const formatDateFr = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
```
Résultat : « 13 mars 2026 ». Garder `<time dateTime={iso}>` (déjà présent ligne 221). Les pages légales affichent déjà « 8 mars 2026 » : cohérence.

### T7. Libellés d'enums et badges : P0 (`ONE_LINER`) / P1
Nouveau `lib/labels.ts`, à importer dans les composants :
```ts
export const JOKE_TYPE_LABELS: Record<string, string> = {
  SUBTIL: "Subtil", CLASSIQUE: "Classique", ABSURDE: "Absurde",
  ONE_LINER: "One-liner", STORY: "Histoire", DIALOGUE: "Dialogue", QA: "Question / réponse", // [À VALIDER THOMAS] libellés
};
export const BLOG_CATEGORY_LABELS: Record<string, string> = {
  REPARTIE: "Répartie", AUTODERISION: "Autodérision", STORYTELLING: "Storytelling", PSYCHOLOGIE: "Psychologie",
  ANALYSE: "Analyse", CATALOGUE: "Catalogue", CONTEXTE: "Contexte", GUIDE: "Guide", HABITUDES: "Habitudes",
  PRATIQUE: "Pratique", TIMING: "Timing", // + ROADMAP si présent
};
```
Usages : `vannes-list.tsx:261` `{JOKE_TYPE_LABELS[joke.type] ?? joke.type}` (masquer ce badge quand il répète la catégorie, ex. Absurde/Absurde) ; `blog-list-client.tsx:54` et `:65`, `blog/[slug]/page.tsx:207` et `:295` `{BLOG_CATEGORY_LABELS[c] ?? c}` ; `parcours-content.tsx:240` : `p.difficulty.split(" → ").map((d) => DIFFICULTY_LABELS[d] ?? d).join(" → ")` (exporter `DIFFICULTY_LABELS` depuis `parcours-detail.tsx:71`). Les catégories blog s'affichent en majuscules sans accent parce que la valeur brute de la base est rendue telle quelle (`REPARTIE`, `AUTODERISION`) : le mapping suffit, pas de `uppercase` à retirer. `blog/[slug]/page.tsx:168` cite aussi `ROADMAP` : l'ajouter au mapping si la catégorie existe.
`badge.tsx:6` : ajouter `whitespace-nowrap shrink-0` (sinon « Prix de lancement » et « Essai gratuit » cassent sur 2 lignes en mobile).

### T8. Emojis en glyphe monochrome : P1
☕ et ⚡ n'ont pas le sélecteur de variation emoji : rendus en pictogrammes gris minuscules à côté de 🌱 🎉 en couleur (accueil, parcours, quiz d'orientation). Ajouter `️` : `(dashboard)/page.tsx:92` (`☕️`) et `:108` (`⚡️`), `parcours-content.tsx:48` et `:57`, et le champ `icon` de `docs/content/parcours-seed.json` (rendu par `parcours-content.tsx:249`, `parcours-detail.tsx:414`, `parcours-list.tsx:93`) : ou, plus sûr, `const withEmoji = (s: string) => (s.endsWith("️") ? s : s + "️")` appliqué à ces trois rendus.

### T9. Cartes de même hauteur, CTA alignés en bas : P1
- `feature-cards.tsx:57` (carte) ajouter `flex flex-col`, `:60` (`p-6`) ajouter `flex flex-1 flex-col`, `:70` le `<Link>` du bouton reçoit `className="mt-auto pt-5"` et le `Button` perd `mt-5`. Les 3 boutons tombent alors sur la même ligne (aujourd'hui y=399/399/422).
- `(dashboard)/page.tsx:91,107,124` (cartes « Tu te reconnais ? ») : même schéma, lien en `mt-auto` (aujourd'hui y=842/862/826) ; `:93,109,126` ajouter `font-display` sur les `<h3>` (les h3 de « Trois outils » juste au-dessus l'ont) ; `&quot;…&quot;` en `«&nbsp;…&nbsp;»` **[À VALIDER THOMAS]**.
- `videos-grid.tsx:217` Card `flex flex-col`, `:220` CardContent `flex flex-1 flex-col`, `:225` `<h3>` ajouter `min-h-[3rem]` (2 lignes), `:260` envelopper le pied : `<div className="mt-auto pt-3"><div className="border-t border-border pt-2">…lien « Page dédiée »…</div></div>` (les liens « Page dédiée » tombent alors sur la même ligne).
- `daily-content.tsx:133` : `grid gap-6 md:grid-cols-3` devient `grid items-start gap-6 md:grid-cols-3` pour ne plus étirer la carte vanne (350 px de contenu dans un cadre de 1200 px).

### T10. Rythme vertical des sections d'accueil : P2
Marges de section actuelles : `daily-content.tsx:110,129` `py-10`, `feature-cards.tsx:48` `py-12`, `(dashboard)/page.tsx:85` `py-12`, `home-cta.tsx:22` `py-8`, `premium-cta.tsx:43` `py-12`, `upcoming-features.tsx:154` `py-16` (soit 40 / 48 / 48 / 32 / 48 / 64 px). Tout en `py-12 md:py-16`.

### T11. FAQ : trois présentations pour le même objet : P2
Accordéon carte + chevron texte « ▼ » (`faq-section.tsx:14-24`, accueil, abonnement, parcours), liste ouverte `dl` en cartes (vannes, conseils, videos, a-propos), `details` natif avec marqueur ▶ (quiz-humour `page.tsx:139-146`). Cible : le composant `FaqSection` partout, avec un chevron SVG (`h-4 w-4`, `transition-transform group-open:rotate-180`) à la place de « ▼ » (`faq-section.tsx:20-22`), et `<dl>` des pages catalogue limité à `max-w-3xl`.

### T12. Listes « Ce que tu vas apprendre » en majuscules : P1
Données de `learnings` (accueil et /videos) : « TECHNIQUE DU PERSONNAGE CANDIDE : crée… », plus des ruptures de casse (« eN GROUPE », « UNIQUEMENT », « RESSENTI »). Rendu (`daily-content.tsx:293-298`, `videos-grid.tsx:245-250`) : séparer le titre et l'explication :
```tsx
const k = learning.indexOf(" : ");
{k > 0 ? (<><strong className="font-semibold text-text-primary">{learning.charAt(0) + learning.slice(1, k).toLowerCase()}</strong>{learning.slice(k)}</>) : learning}
```
Le nettoyage des casses cassées dans la donnée reste à faire côté contenu (voir « hors périmètre » en fin de document).

## 3. Tableau par page

Légende : priorité P0 = défaut visible qui dégrade la perception de qualité ou échec d'accessibilité net ; P1 = à corriger dans la même livraison ; P2 = polissage. `T*` renvoie aux correctifs transverses de la section 2. « Largeur » = 1440 (desktop) ou 390 (mobile). Numéros de ligne = lecture du code au 29/09/2026.

### Coupure du H1 de l'accueil (demande explicite de Thomas)
Remplacer `hero-section.tsx:16-20` par :
```tsx
<h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
  <span className="block">
    Tu parles et <span className="text-gradient whitespace-nowrap">personne rit</span>.
  </span>
  <span className="block">On va arranger ça.</span>
</h1>
```
Rendu attendu : 1440 px = 2 lignes, « Tu parles et personne rit. » (~730 px) puis « On va arranger ça. » (~510 px) ; 768 px = 2 lignes à 48 px (~585 px pour la 1re) ; 390 px = 3 lignes, « Tu parles et / personne rit. / On va arranger ça. » (la 1re phrase se coupe par équilibrage, jamais au milieu de la 2e). `whitespace-nowrap` sur le dégradé garde « personne rit » ensemble ; le point sort du dégradé comme aujourd'hui. Une phrase par ligne est préférée à `text-balance` seul : l'équilibrage de largeur couperait « … On va / arranger ça. » au milieu de la 2e phrase. Aucun mot changé.

### Accueil (`/`)
| Page | Largeur | Capture | Problème | Cause (fichier:ligne) | Correctif exact | Prio |
|---|---|---|---|---|---|---|
| accueil | 1440 | desktop_accueil__01.jpg | H1 « Tu parles et personne rit. On va arranger / ça. » : « ça. » orphelin seul en 2e ligne | hero-section.tsx:16-20 (flux continu, coupure non maîtrisée) | bloc de code ci-dessus | P0 |
| accueil | 390 | mobile_accueil__01.jpg | « Tu parles et / personne rit. On va / arranger ça. » : la 2e phrase est coupée en deux | idem | même code (3 lignes propres) | P0 |
| accueil | 1440+390 | desktop_accueil__01.jpg, mobile_accueil__01.jpg | sous-titre centré : lignes irrégulières (« à la / machine à café ? ») | hero-section.tsx:21 | `text-pretty` (couvert par T1) | P2 |
| accueil | 390 | mobile_accueil__01.jpg | 5 pastilles sur 4 rangées inégales avant le CTA | hero-section.tsx:43-48 | 2 dernières en `hidden sm:inline-block` **[À VALIDER THOMAS]** | P2 |
| accueil | 1440 | desktop_accueil__02.jpg | cartes « contenu du jour » : vanne = 350 px de contenu dans un cadre de 1200 px, vidéo = 1200 px | daily-content.tsx:133 (grille étirée) | T9 (`items-start`) ; option : `video.learnings.slice(0, 2)` ligne 293 **[À VALIDER THOMAS / @ux]** | P1 |
| accueil | 1440+390 | desktop_accueil__02.jpg, mobile_accueil__04.jpg | puces « TECHNIQUE DU PERSONNAGE CANDIDE : … » en majuscules | daily-content.tsx:293-298 | T12 | P1 |
| accueil | 1440 | desktop_accueil__03.jpg | 3 CTA à 3 hauteurs (y=399 / 399 / 422), le 2e d'une autre teinte | feature-cards.tsx:16,27,38,57-75 | T9 + T3.3 | P1 |
| accueil | 1440 | desktop_accueil__03.jpg | « Tu te reconnais ? » : h3 sans `font-display`, ☕ ⚡ en glyphe gris, liens à 3 hauteurs, guillemets droits | (dashboard)/page.tsx:91-138 | T8 + T9 | P1 |
| accueil | 1440 | desktop_accueil__04.jpg | encart CTA 576 px, bloc « Tout est inclus » 672 px, offres 576 px, FAQ 672 px | home-cta.tsx:23, premium-cta.tsx:58,93 | T4 (tout en `max-w-2xl`) | P2 |
| accueil | 390 | mobile_accueil__08.jpg | H2 « Deux façons de t'y / mettre » : « mettre » orphelin | premium-cta.tsx:48 | T1 | P0 |
| accueil | 390 | mobile_accueil__07.jpg, mobile_accueil__08.jpg | « Commencer à 0,99 €/mois » et « Voir les vannes gratuites » de largeurs différentes | home-cta.tsx:31-38 | `Button` et `Link` en `w-full sm:w-auto` | P2 |
| accueil | 390 | mobile_accueil__11.jpg | FAQ : « … si je n'ai pas le « / sens de l'humour » ? » | lib/faqs + faq-section.tsx:19 | T2 (`frTypo(faq.question)`) | P1 |
| accueil | 1440 | desktop_accueil__06.jpg | chevron « ▼ » en caractère texte | faq-section.tsx:20-22 | T11 (SVG) | P2 |
| accueil | 1440 | desktop_accueil__07.jpg | badges « Bientôt » et « Abonnés » violet sur violet | badge.tsx:11,16 | T3 | P1 |

### Catalogue : vannes, conseils, vidéos
| Page | Largeur | Capture | Problème | Cause (fichier:ligne) | Correctif exact | Prio |
|---|---|---|---|---|---|---|
| vannes | 1440+390 | desktop_vannes__01.jpg, mobile_vannes__01.jpg | badge « ONE_LINER » (valeur d'enum) sur chaque carte | vannes-list.tsx:261 | T7 `JOKE_TYPE_LABELS` | P0 |
| vannes | 1440 | desktop_vannes__01.jpg | intro sur 1240 px (~150 caractères par ligne), H1 collé (`mt-2`) | vannes/page.tsx:85 | T4 `PageHeader` | P1 |
| vannes | 1440+390 | desktop_vannes__01.jpg, desktop_vannes__02.jpg, mobile_vannes__02.jpg | 3 vannes identiques d'affilée (« Mon copain et moi on s'est disputés… ») : donnée dupliquée | API `/api/jokes` (hors CSS) | dédoublonner côté requête ou donnée (voir « hors périmètre ») | P1 |
| vannes | 390 | mobile_vannes__01.jpg | « Créer mon compte » pleine largeur, « Tout débloquer » étroit | vannes-list.tsx:176-180 | `Link` et `Button` en `w-full sm:w-auto` | P2 |
| vannes | 1440+390 | desktop_vannes__01.jpg | rangée de filtres fantômes (`opacity-50`, « … ») lue comme une UI cassée | vannes-list.tsx:187-200 | une ligne : cadenas + « Filtres par catégorie : réservés aux abonnés » + lien Premium | P2 |
| vannes | 1440 | desktop_vannes__02.jpg | « Débloquer » 12 px violet sur carte 3,9:1 | vannes-list.tsx:353 | `text-accent-link` (T3) | P1 |
| vannes | 1440 | desktop_vannes__03.jpg | FAQ et texte SEO à 1248 px, corps 14 px | vannes/page.tsx:100-123 | `dl` et bloc texte en `max-w-3xl` | P2 |
| conseils | 1440 | desktop_conseils__01.jpg | paragraphes de conseil sur ~1170 px (190 caractères par ligne) | conseils-list.tsx:264, :270, :274 | `max-w-[72ch]` sur ces 3 `<p>` | P1 |
| conseils | 390 | mobile_conseils__01.jpg | séparateur « · » des filtres fantômes isolé en bout de ligne (« Expert · ») | conseils-list.tsx:163 (idem videos-grid.tsx:142) | `className="mx-1 hidden text-text-muted sm:inline"` | P2 |
| conseils | 1440+390 | desktop_conseils__01.jpg | badge « Intermédiaire » violet sur violet | badge.tsx:11 via `DIFFICULTY_VARIANT` | T3 | P1 |
| videos | 1440 | desktop_videos__01.jpg | H1 sur 2 lignes avec « humoristes » orphelin | videos/page.tsx (H1 sans balance) | T1 | P0 |
| videos | 1440 | desktop_videos__01.jpg, desktop_videos__02.jpg | titres de 1 ou 2 lignes : blocs « Ce que tu vas apprendre » à y=828 / 844 / 844, liens « Page dédiée » à 3 hauteurs | videos-grid.tsx:217-268 | T9 | P1 |
| videos | 1440+390 | desktop_videos__02.jpg, mobile_videos__02.jpg | puces en majuscules et casse cassée (« DÉFI MIME : eN GROUPE », « UNIQUEMENT », « RESSENTI ») | videos-grid.tsx:245-250 + donnée | T12 + nettoyage de la donnée | P1 |

### Parcours
| Page | Largeur | Capture | Problème | Cause (fichier:ligne) | Correctif exact | Prio |
|---|---|---|---|---|---|---|
| parcours | 1440 | desktop_parcours__01.jpg | contenu à x=288 alors que logo et grille à x=96 ; fil d'Ariane y=155 au lieu de 106 | parcours/page.tsx:32 | T4 | P1 |
| parcours | 390 | mobile_parcours__01.jpg | H1 « Parcours humour : / deviens drôle pas à / pas » : « pas » orphelin ; marge latérale 32 px | parcours/page.tsx:78-80 et :32 | T1 + T4 | P0 |
| parcours | 1440 | desktop_parcours__01.jpg | H2 « Quel parcours est fait pour toi ? » centré sous un H1 à gauche | parcours-content.tsx:223 | retirer `text-center` | P2 |
| parcours | 1440+390 | desktop_parcours__01.jpg, mobile_parcours__02.jpg | « DEBUTANT → INTERMEDIAIRE » (valeur brute, sans accent) | parcours-content.tsx:240 | T7 | P1 |
| parcours | 1440 | desktop_parcours__02.jpg | « Semaine N » violet sombre sur fond sombre 2,1:1 ; largeur variable (titres à x=415 / 417) | parcours-content.tsx:288 | T3 + `className="mt-0.5 w-[5.25rem] shrink-0 justify-center"` | P0 |
| parcours | 390 | mobile_parcours__03.jpg | titre du module sur 4 lignes, badge « Essai gratuit » écrasé | parcours-content.tsx:284-309 | `li` en `flex-col gap-2 sm:flex-row sm:gap-3`, badge « Essai gratuit » sous le titre sur mobile, badges nowrap (T7) | P1 |
| parcours | 1440 | desktop_parcours__01.jpg | ☕ et ⚡ en glyphe gris (titre et quiz d'orientation) | parcours-content.tsx:48,57,249 | T8 | P1 |
| parcours/repartie (et machine-a-cafe, confiance) | 1440 | desktop_parcours__repartie__01.jpg | libellé « 0/4 étapes complétées » collé à la barre, 30 px vides dessous | parcours-detail.tsx:440-456 | `CardContent className="py-0"` + `mb-2` sur le `div.flex` ligne 441 | P1 |
| parcours/repartie | 390 | mobile_parcours__repartie__01.jpg | colonne de texte ~290 px (marge 32 px + carte) | parcours/[slug]/page.tsx:288 | T4 | P1 |
| parcours/repartie | interactif | non capturé | feedback du quiz `bg-green-50 text-green-700 dark:…` : la classe `dark` n'existe pas (`app/layout.tsx:129`), fond clair sur site sombre | parcours-detail.tsx:148-150 | `border-success bg-success/10 text-success` (juste), `border-error bg-error/10 text-error` (faux) | P1 |
| parcours/confiance | 1440 | desktop_parcours__confiance__01.jpg | niveau « Expert » sur le détail, « DEBUTANT → EXPERT » sur la liste | parcours-detail.tsx:419 / parcours-content.tsx:240 | une seule source, à trancher avec @ux | P2 |

### Blog : liste et gabarit d'article (38 URLs, ~30 gabarits distincts)
| Page | Largeur | Capture | Problème | Cause (fichier:ligne) | Correctif exact | Prio |
|---|---|---|---|---|---|---|
| blog (liste) | 390 | mobile_blog__01.jpg | H1 : « : guides et techniques » commence la 2e ligne | blog/page.tsx:125-127 | T2 (`drôle&nbsp;: guides…`) | P0 |
| blog (liste) | 1440+390 | desktop_blog__01.jpg | 12 pastilles de filtre en MAJUSCULES sans accent (REPARTIE, AUTODERISION) | blog-list-client.tsx:54 et badge :65 | T7 `BLOG_CATEGORY_LABELS` | P1 |
| blog (liste) | 1440+390 | desktop_blog__01.jpg | dates `2026-05-05` | blog-list-client.tsx:74 | T6 | P1 |
| blog (liste) | 390 | mobile_blog__02.jpg | 36 px de padding par côté dans chaque carte (Card `p-4` + CardContent `p-5`) ; « guide anti- / malaise » coupé au tiret | blog-list-client.tsx:62-63 | `Card className="h-full p-5"`, `CardContent className="flex h-full flex-col p-0"` ; T1 | P1 |
| article | 1440+390 | desktop_blog__comment-devenir-drole__01.jpg | `> En bref :`, `> Définition :`, `> CLEF :`, `> À retenir :` affichés avec le signe `>` (≥ 20 articles vus) | markdown-renderer.tsx (aucune branche citation) | T5.2 | P0 |
| article | 1440 | desktop_blog__meilleures-blagues-droles-2026__01.jpg | `---` affiché en clair (aussi `phrases-droles-conversations`, `citation-drole`) | idem | T5.2 | P0 |
| article | 1440 | desktop_blog__comment-devenir-drole__02.jpg | H2/H3 à 16 px du paragraphe précédent : hiérarchie plate | markdown-renderer.tsx:106 écrase :46 et :56 | T5.1 | P1 |
| article | 1440 | desktop_blog__5-types-humour-lequel-pour-toi__01.jpg | « Les 5 types… : / 1. … 5. … » et `- Être méchant…` (`humour-noir`) en lignes brutes | markdown-renderer.tsx:87-90 | T5.3 | P1 |
| article | 1440 | desktop_blog__avoir-confiance-en-soi-grace-a-l-humour__01.jpg | H1 « … : guide / pratique » | blog/[slug]/page.tsx:209-211 | T1 | P0 |
| article | 1440 | desktop_blog__citation-drole__01.jpg | H1 « … au bon / moment » ; H2 « … devient / assourdissant » | idem | T1 | P0 |
| article | 1440 | desktop_blog__comment-improviser-des-blagues__01.jpg | H1 « … blagues : 5 / méthodes des pros » ; `pourquoi-blagues-marchent-pas` « … pas : 7 / raisons concrètes » | idem | T2 + T1 | P0 |
| article | 1440 | desktop_blog__etre-plus-a-l-aise-en-societe__01.jpg | H2 « … pourquoi forcer tue la / spontanéité » | markdown-renderer.tsx:46 | T1 | P0 |
| article | 390 | mobile_blog__comment-devenir-drole__01.jpg | H1 « Comment devenir drôle / : le guide » ; fil d'Ariane sur 2 lignes (titre long, aussi `avoir-confiance…`, `blague-courte…`) | blog/[slug]/page.tsx:203,209 | T2 ; fil d'Ariane : `<span className="inline-block max-w-[55vw] truncate align-bottom text-text-secondary sm:max-w-none">` | P0 |
| article | 1440+390 | desktop_blog__comment-devenir-drole__01.jpg | dates `2026-03-13` / `Mis à jour le 2026-09-29` ; badge catégorie « REPARTIE » brut | blog/[slug]/page.tsx:207,215,221 | T6 + T7 | P1 |
| article | 1440 | desktop_blog__techniques-humoristes-pros__01.jpg | « « » de fin de ligne séparé de son texte ; guillemets droits `"` dans le corps de la plupart des articles | markdown-renderer.tsx:16 | T2 ; conversion des `"` : T5.4 **[À VALIDER THOMAS]** | P1 / P2 |
| article | 1440 | desktop_blog__comment-devenir-drole__06.jpg | bas de page : 3 panneaux voisins avec 3 fonds et 3 styles de bouton ; bouton outline violet 3,4:1 ; case à cocher native blanche | blog-article-parcours-maillage.tsx, newsletter-inline.tsx, article-cta.tsx (non lus, lignes non données) | même fond `bg-background-card border-border` pour les 3 ; outline en `text-accent-link` ; `accent-accent-primary` sur la case | P2 |

### Auth, tarif, quiz, contenu éditorial, légal
| Page | Largeur | Capture | Problème | Cause (fichier:ligne) | Correctif exact | Prio |
|---|---|---|---|---|---|---|
| login / register / forgot-password | 1440+390 | desktop_login__01.jpg, mobile_register__01.jpg | mise en page propre (carte 448 px centrée). Défauts : H1 register mobile « … ta première vanne / t'attend » ; liens violets 14 px sur carte 3,9:1 ; H1 en `text-lg` faible face au logo `text-2xl` | register/page.tsx:140, login/page.tsx:104, register/page.tsx:243 | H1 en `text-xl` ; T1 ; `text-accent-link` (T3) | P1 |
| onboarding | 1440+390 | desktop_onboarding__01.jpg | capture identique à `/login` (redirection hors connexion) | (auth)/onboarding | non vérifiable | n/a |
| abonnement | 390 | mobile_abonnement__01.jpg | « Accès / complet » et badge « Prix de / lancement » sur 2 lignes ; texte réduit à 262 px (Card `p-4` + CardContent `p-8` = 48 px par côté) | abonnement/page.tsx:62-69 | `Card … p-0`, `CardContent className="p-5 sm:p-8"`, `div` ligne 64 en `flex flex-wrap`, badge nowrap (T7) | P1 |
| abonnement | 1440 | desktop_abonnement__01.jpg | sous-titre coupé en milieu de phrase (« Tu / passes… ») ; badge « Prix de lancement » en double (haut de page et carte) | abonnement/page.tsx:56 ; :50 et :68 | T1 (`text-balance` sur le `<p>`) ; doublon à trancher avec @ux | P2 |
| quiz-humour | 1440 | desktop_quiz-humour__01.jpg | sous-titre centré avec « film. » orphelin ; 3 largeurs (titre, quiz 512 px, panneaux 864 px) ; deux `<main>` imbriqués | quiz-humour/page.tsx:75,80-82 | `<p className="mx-auto mt-3 max-w-xl text-balance …">` ; `main` devient `div` (T4) | P1 |
| quiz-humour | 1440 | desktop_quiz-humour__01.jpg | choix n°4 : emoji 😏 en glyphe contour, texte décalé de 5 px (x=518 vs 523) | components/quiz/viral-quiz.tsx (non lu) | emoji dans `<span className="inline-flex w-8 shrink-0 justify-center text-xl">` | P2 |
| quiz-humour | 1440 | desktop_quiz-humour__02.jpg | FAQ en `details` natif (marqueur ▶) différente du reste du site | quiz-humour/page.tsx:139-146 | T11 | P2 |
| a-propos | 1440 | desktop_a-propos__01.jpg | fil d'Ariane à x=96, H1 à x=336 | a-propos/page.tsx:54-60 | T4 | P1 |
| a-propos | 390 | mobile_a-propos__01.jpg | « À propos de deviens- / marrant.fr » coupé dans le nom de marque | a-propos/page.tsx:61-63 | `À propos de <span className="whitespace-nowrap">deviens-marrant.fr</span>` | P1 |
| a-propos | 1440 | desktop_a-propos__02.jpg | liste 1. 2. 3. en `list-inside` : la 2e ligne repart sous le chiffre | a-propos/page.tsx:138 | `list-decimal list-outside pl-6` | P2 |
| anatomie-vanne | 390 | mobile_anatomie-vanne__01.jpg | `<br />` force « l'autre ? / Réponse en 3 parties » | anatomie-vanne/page.tsx:107 | `<br className="hidden sm:block" />` | P1 |
| anatomie-vanne | 1440 | desktop_anatomie-vanne__02.jpg | guillemets doublés « Après 4 minutes, elle m'a demandé : « Toujours là ? » » | anatomie-vanne/page.tsx:63 (donnée) et :237 (gabarit) | donnée : `“Toujours là ?”` **[À VALIDER THOMAS]** ; contrôler les 2 autres exemples | P1 |
| anatomie-vanne | 1440 | desktop_anatomie-vanne__01.jpg | H1 centré puis H2 « 3 vannes décortiquées » à gauche ; `<main>` imbriqué ; label « PUNCHLINE » 4,4:1 | anatomie-vanne/page.tsx:99,207,233 | T4 ; H2 centrés ou H1 à gauche (au choix @ux) ; `text-red-400` | P2 |
| glossaire | 1440 | desktop_glossaire__01.jpg | définitions sur ~1150 px ; lien « Techniques de répartie → » 3,9:1 | glossaire/page.tsx (rendu des termes, ligne non lue) | `max-w-3xl` sur les `<p>` ; T3 | P2 |
| cgu / confidentialité / mentions légales / rétractation | 1440 | desktop_cgu__01.jpg, desktop_retractation__01.jpg | lignes de 170 caractères ; H1 à y=118 (autres pages y=154) ; formulaire pleine largeur | cgu/page.tsx:10-13, retractation/page.tsx:12-17 | T4 ; `RetractationForm` dans `max-w-xl` | P1 |

### Transverses de gabarit (toutes pages)
| Page | Largeur | Capture | Problème | Cause (fichier:ligne) | Correctif exact | Prio |
|---|---|---|---|---|---|---|
| toutes | 1440+390 | desktop_vannes__01.jpg | onglet actif du header : violet sur `#2A2A2A` 3,4:1 ; sur `/blog/<slug>` l'onglet « Blog » n'est pas actif | header.tsx:61-63, :162-164 | `pathname === item.href \|\| (item.href !== "/" && pathname.startsWith(item.href))` ; T3 | P1 |
| toutes | 1440+390 | desktop_vannes__04.jpg, mobile_mentions-legales__03.jpg | footer : logo « deviens-marrant » sans « .fr » (header : « deviens-marrant.fr ») ; colonne Produit de 9 liens face à Légal de 5 ; copyright mobile « (et un / peu de café) » | footer.tsx:61-63, :58, :94, :128 | « .fr » ajouté **[À VALIDER THOMAS]** ; `ul` Produit en `sm:columns-2` ; copyright `text-balance` | P2 |
| toutes | 390 | mobile_vannes__01.jpg | boutons `sm` à 32 px de haut (filtres, CTA de carte) : cible tactile sous 44 px recommandés (WCAG 2.2 AA exige 24 px : conforme) | button.tsx:22 | `sm: "h-8 px-3 text-sm max-md:h-11"` | P2 |

**Décompte du tableau** (72 lignes, une ligne peut viser plusieurs pages) : **P0 = 15**, **P1 = 36**, **P2 = 20**, 1 non vérifiable (onboarding). Les correctifs transverses T1 (balance), T2 (insécables), T3 (contrastes), T5 (markdown) et T7 (libellés) traitent à eux seuls 13 des 15 P0 ; les 2 autres sont le H1 de l'accueil (desktop et mobile), réglé par le bloc de code dédié.

## 4. Ce que je n'ai pas pu vérifier

- **Pages de détail vanne / conseil / vidéo** (`/vannes/<slug>`, `/conseils/<slug>`, `/videos/<slug>`) : aucune capture. Seul `vannes/[slug]/page.tsx` a été lu (breadcrumb hors colonne `max-w-2xl` :179-187, CTA fait main en `bg-accent-primary` :256). `conseils/[slug]` et `videos/[slug]` supposés identiques, non lus.
- **États interactifs** : menu mobile ouvert, modales (`AuthModal`, `PremiumModal`), toasts, FAQ ouvertes, révélation de la chute, hover/focus, feedback du quiz de parcours. Le défaut du quiz (`bg-green-50`, `parcours-detail.tsx:148-150`) est déduit du code (pas de classe `dark` sur `<html>`), pas d'une capture.
- **Onboarding** : la capture est la page `/login` (redirection hors connexion). Aucune vérification de l'écran réel ni de `components/mobile/OnboardingFlow.tsx`.
- **Pages connectées** (`/profil`, `/favoris`, `/abonnement/success`, admin) : hors captures.
- **Fichiers non lus, donc lignes non fournies** : `viral-quiz.tsx`, `newsletter-inline.tsx`, `article-cta.tsx`, `blog-article-parcours-maillage.tsx`, `retractation-form.tsx`, `search-bar.tsx`, `auth-modal.tsx`, `premium-modal.tsx`, `glossaire/page.tsx` (au-delà de l'en-tête), `conseils/page.tsx` et `videos/page.tsx` (H1 lus sur capture, pas dans le code).
- **Rendu de `text-wrap: balance`** : non exécuté (aucune édition, aucun build). Les coupures décrites (« Confiance en soi grâce à / l'humour : guide pratique », etc.) sont des estimations de largeur (Plus Jakarta Sans ≈ 28 px par caractère à 60 px, ≈ 17 px à 36 px). À confirmer sur les captures après implémentation, surtout à 768 px (tablette non capturée).
- **Contrastes** : calculés depuis les hex du code avec la formule WCAG 2.x, fonds de badge obtenus par mélange alpha théorique sur `#1F1F1F`. Non mesurés sur pixels.
- **Doublons de captures (redirections)** : les 8 slugs suivants affichent la page d'un autre slug, donc non analysés comme gabarits distincts : `apprendre-la-repartie-methode-30-jours` (= « Répartie : 10 techniques efficaces », comme `comment-avoir-de-la-repartie`), `blagues-courtes-vs-longues` (= `blague-courte-arme-secrete-humour`), `humour-apres-rupture` (= « Reprendre confiance grâce à l'humour », comme `confiance-humour-apres-rupture`), `je-ne-sais-jamais-quoi-repondre` (= `jamais-quoi-repondre-techniques`), `jeux-de-mots-technique-3-etapes` (= `jeu-de-mots-drole-techniques-creer`), `ne-plus-rester-muet-en-groupe` (= `rester-muet-en-groupe`), `timing-humour-ralentir` (= `timing-humour`), `raconter-blague-sans-massacrer` (= `comment-raconter-une-blague-sans-la-rater`). Vérifié par titre et contenu identiques sur les tranches 01 ; à confirmer par `REDIRECTED_BLOG_SLUGS` dans `lib/seo-redirects.ts` (non lu). Si ce sont bien des 301, l'accueil de test les suit et rien à corriger de plus.
- **Tablette 768 px** : non capturée ; le hero est prévu pour (`md:text-5xl`) mais non vu.

### Hors périmètre design, vus au passage (à transmettre)
- **@copywriter / @fullstack, règle 12 (tiret cadratin) dans du texte client visible** : `home-cta.tsx:28` (« … 80+ vidéos analysées — le tout »), `premium-cta.tsx:218` (« Déjà 1 500+ inscrits — et toi ? »), `parcours-content.tsx:50` (« Partout — je veux retrouver ma légèreté »), `parcours-detail.tsx:590` (« S'abonner — 0,99 €/mois »), `daily-content.tsx:169` et `vannes-list.tsx:283` (« Pourquoi ça marche — … »), `abonnement/page.tsx:135` (`—`), textes d'intro conseils et vidéos, et de nombreux articles de blog. Non traité ici (copy).
- **@fullstack / contenu** : doublons de vannes affichées d'affilée sur `/vannes`, casse cassée dans les données `learnings` des vidéos (« eN GROUPE », « UNIQUEMENT », « RESSENTI »), libellés « Débutant / Expert » de source différente entre liste et détail de parcours.
- **@ux** : les trois cartes « Tu te reconnais ? » pointent toutes vers `/parcours` (`(dashboard)/page.tsx:101,118,135`) au lieu du parcours nommé ; la section « Prochainement » arrive après la FAQ ; badge « Prix de lancement » en double sur `/abonnement`.

---
**Handoff → @fullstack** (implémentation), copie @ux et @copywriter
- Fichier produit : `/home/user/Marrant/docs/design/passe-visuelle-s12.md` (aucun fichier de code modifié).
- Décisions prises : coupure du H1 d'accueil en deux phrases-blocs (pas de `text-balance` seul) ; balance global sur h1 à h4 ; insécables via `frTypo` ; nouveau token `accent-link` `#A78BFA` pour le texte violet courant ; bouton primaire assombri en `#7C3AED` ; échelle de largeurs 7xl / 4xl / 3xl / 2xl ; libellés lisibles pour les enums.
- À valider par Thomas avant implémentation : bouton primaire `#7C3AED` (T3.3), libellés `Histoire` / `Question / réponse` (T7), conversion `"` vers « » dans les articles (T5.4), `.fr` dans le logo du footer, guillemets internes de la donnée d'anatomie, masquage de 2 pastilles hero sur mobile, limitation des puces vidéo de l'accueil à 2.
- Ordre conseillé (une seule PR possible) : T1, T2, hero, T5, T3, T7, T4, puis T9/T6/T8, puis P2. Vérifier ensuite par nouvelles captures 1440 / 768 / 390 sur : accueil, `/videos`, un article long (`citation-drole`), `/blog` mobile, `/parcours` mobile, `/abonnement` mobile.
- Points d'attention : dark mode inexistant (aucune classe `dark` sur `<html>`, toute classe `dark:` est morte) ; `next lint` / `tsc` à lancer avant commit (CLAUDE.md, pre-commit code) ; consigner dans `REPLIT_ACTIONS.md` ; recapturer pour valider les 10 critères (aéré, aligné, hiérarchie) après correctifs.
- Références marché : non consultées dans cette passe (correction de défauts, pas de nouvelle direction artistique).

