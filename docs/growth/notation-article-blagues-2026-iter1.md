# Notation : /blog/meilleures-blagues-droles-2026 (itération 1, 05/10/2026)

> Revue @reviewer. Base : code lu à HEAD (blog-articles.ts l.1368-1584, blog/[slug]/page.tsx, markdown-renderer.tsx, article-cta.tsx, config/blog-cta.ts, blog-article-tracking.tsx, blog-article-parcours-maillage.tsx, umami.ts, vannes/theme/[slug]/page.tsx, blague-du-jour/page.tsx, quiz-humour/page.tsx) + tests `blog-meilleures-blagues-s14.test.ts` et `blog-article-tracking.test.tsx` + audit `audit-article-blagues-2026-s14.md` + lignes [CHOIX UTILISATEUR] de founder-preferences.md.
> Constat : les recommandations R1 à R5 de l'audit s14 et la mesure E1 à E3 sont déjà dans le code. Cette notation porte sur l'état actuel.
> Limites : rendu réel non vu (aucun screenshot de cette page dans `tests/screenshots/`), tests non exécutés (pas d'accès shell), aucune donnée Umami après mise en ligne.

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **8/10** | Le sommaire arrive au 3e paragraphe (environ 110 mots) après une phrase de motivation, la vanne n°1 après environ 260 mots, soit 2 à 3 écrans mobiles. |
| 2 | Sorties vers une 2e page | **9/10** | Couverture complète (intro, 4 fins de section, bloc après la 50, fin), mais la blague du jour est proposée 3 fois en termes quasi identiques et le lien « machine à café » (l.1442) mène vers /conseils alors que le parcours Machine à Café existe. |
| 3 | CTA d'inscription | **6/10** | Seul point d'inscription placé après FAQ, cluster, 3 articles et parcours (4 blocs après le corps), promesse « une vanne décryptée chaque jour » déjà gratuite sans compte, « Sans carte » répété 2 fois, et la note « 10 vannes » lue juste après 50 vannes gratuites sonne comme une restriction. |
| 4 | Lisibilité mobile et structure | **7/10** | Ancres et sorties sur ligne propre, mais aucun moyen d'envoyer une vanne (usage n°1 du persona) et 7 liens thème collés par des virgules après la vanne 50 (cibles de tap minuscules). |
| 5 | Ton Marrant des textes ajoutés | **8/10** | Bonnes intros (drague, famille, potes), mais deux métaphores en 3 lignes (armurerie puis salle de sport, avec le tic « pas un don, c'est un muscle »), « Toi aussi. » sans sens (l.1558) et 4 sorties au même gabarit « Plus de vannes de X ». |
| 6 | Conformité | **9/10** | Zéro humoriste, zéro tiret cadratin, liens valides, « 1 500+ » absent (non ajouté) : PASS ; seul écart, le CTA laisse croire que la vanne décryptée du jour demande un compte (`/blague-du-jour` est publique). |
| 7 | Sécurité SEO | **10/10** | Slug, title, meta, H1, 50 vannes (empreinte SHA-256), H2, Définition, CLEF et FAQ verrouillés par test ; ancres stables calculées sur le texte stocké. |
| 8 | Mesure | **7/10** | E1 à E3 en place, mais un seul palier de scroll (75 %) ne dit pas où partent les 88 %, les clics d'ancre gonflent `blog-sortie-clic` (KPI 2e page faussé) et l'inscription n'est pas attribuable à l'article (callbackUrl identique partout). |

**Note globale : 8,0/10** (64/80).
**Après application des 13 correctifs ci-dessous : 10/10 sur les 8 critères** (aucune amélioration concrète restante hors « nice to have » §4, qui dépendent de données pas encore collectées).

Intouchables respectés par tous les correctifs : slug, title, meta (excerpt), H1, texte et numérotation des 50 vannes, texte des 8 H2, blocs Définition et CLEF, FAQ, « 1 500+ » non ajouté. Aucun pop-up, aucune bannière.

## 2. Top 3 (impact le plus fort)

1. **C4 + C5 + C6 (CTA)** : remonter le CTA juste après le corps et lui donner une promesse que le visiteur n'a pas déjà gratuitement. Critère le plus bas (6/10), c'est là que se joue l'inscription.
2. **C7 (Partager par vanne)** : l'usage réel du persona (envoyer la vanne par message) n'a aucun support, et chaque partage ramène un visiteur. Produit aussi l'événement de valeur qui manque.
3. **C11 + C12 (mesure)** : sans paliers de scroll et sans séparation ancre / sortie, l'effet des autres correctifs ne sera pas lisible à 30 jours.

## 3. Correctifs exacts

Fichier article : `apps/web/src/lib/blog-articles.ts` (numéros de ligne à HEAD).

### C1. Sommaire en 2e paragraphe, sans la phrase de motivation (critères 1 et 5)

**Avant** (l.1376 à l.1378, deux paragraphes dans cet ordre) :
```
Chaque vanne ici a passé un test simple : **« Est-ce que je peux la sortir ce soir et faire rire ? »** Si la réponse était non, elle a dégagé. Pas de « qu'est-ce qu'un canif dit à un autre canif », pas de blagues Carambar recyclées depuis 2004. Que du concret, du testable, du sortable.

L'humour, c'est pas un don, c'est un muscle, et cet article est ta salle de sport. Tu cherches pour une situation précise ? Va direct : [Soirée](#quelles-blagues-sortir-en-soiree-celles-qui-marchent-a-partir-de-22h) · [Bureau](#quelles-blagues-au-bureau-le-lundi-matin-est-un-sport-de-combat) · [Date](#comment-faire-rire-en-date-detendre-un-moment-genant) · [Famille](#les-vannes-en-famille-niveau-expert) · [Potes](#les-vannes-entre-potes-le-labo-d-essai) · [WhatsApp](#les-vannes-whatsapp-reseaux). La [blague du jour](/blague-du-jour) change chaque jour, et le [catalogue de vannes](/vannes) range le reste par situation.
```
**Après** (sommaire remonté juste sous le 1er paragraphe, ancre « Inclassables » ajoutée, paragraphe « test simple » inchangé et placé ensuite) :
```
Va direct à ta situation : [Soirée](#quelles-blagues-sortir-en-soiree-celles-qui-marchent-a-partir-de-22h) · [Bureau](#quelles-blagues-au-bureau-le-lundi-matin-est-un-sport-de-combat) · [Date](#comment-faire-rire-en-date-detendre-un-moment-genant) · [Famille](#les-vannes-en-famille-niveau-expert) · [Potes](#les-vannes-entre-potes-le-labo-d-essai) · [WhatsApp](#les-vannes-whatsapp-reseaux) · [Inclassables](#les-pepites-inclassables). Et quand tu les auras toutes usées : la [blague du jour](/blague-du-jour) change tous les jours, et le [catalogue de vannes](/vannes) range le reste par situation.

Chaque vanne ici a passé un test simple : **« Est-ce que je peux la sortir ce soir et faire rire ? »** Si la réponse était non, elle a dégagé. Pas de « qu'est-ce qu'un canif dit à un autre canif », pas de blagues Carambar recyclées depuis 2004. Que du concret, du testable, du sortable.
```
Pourquoi : le 1er paragraphe finit sur « classées par situation [...] c'est pas le même sport », le sommaire en est la suite logique et tombe dans le 1er écran mobile (environ 60 mots au lieu de 110). L'ancre `les-pepites-inclassables` correspond à `headingId("Les pépites inclassables")`. Le mot-clé « blague drôle » reste dans le 1er paragraphe. Test s14 : inchangé (les 6 ancres restent présentes).

### C2. Le lien « machine à café » mène au parcours Machine à Café (critère 2)

**Avant** (l.1442) :
```
Si tu veux [devenir la personne qu'on attend à la machine à café](/conseils), le secret c'est la régularité.
```
**Après** :
```
Si tu veux [devenir la personne qu'on attend à la machine à café](/parcours/machine-a-cafe), le secret c'est la régularité : 15 minutes par semaine suffisent.
```
Pourquoi : le libellé promet une transformation, /conseils livre un catalogue ; le parcours Machine à Café est la cible exacte (Sophie, bureau). « 15 min/semaine » = [CHOIX UTILISATEUR] du 29/09 (Machine à Café 15). /conseils garde son lien en fin d'article (l.1570). L'audit s14 gelait les liens existants par prudence : ici seule la cible d'un lien sortant change, ni ancre ni texte SEO de la page.

### C3. Fin d'article : une 3e mention de la blague du jour qui dit autre chose (critères 2 et 5)

**Avant** (l.1568) :
```
→ **[La blague du jour](/blague-du-jour)** : une vanne neuve chaque jour, avec sa chute et son décryptage.
```
**Après** :
```
→ **[La blague du jour](/blague-du-jour)** : celle d'aujourd'hui, et demain une autre.
```
Pourquoi : la même phrase (« chaque jour », « avec sa chute et son décryptage ») apparaît déjà l.1544, 24 lignes plus haut. Le test s14 (l.91) vérifie seulement le préfixe `→ **[La blague du jour](/blague-du-jour)**` : il reste vert.

### C4. CTA juste après le corps de l'article (critère 3)

Fichier : `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`.

**Avant** (l.242 à l.245) :
```tsx
      <BlogArticleTracking slug={article.slug}>
        <div data-blog-body>
          <MarkdownRenderer content={article.content} className="mt-8" />
        </div>
```
**Après** :
```tsx
      <BlogArticleTracking slug={article.slug}>
        <div data-blog-body>
          <MarkdownRenderer
            content={article.content}
            className="mt-8"
            shareJokes={SHARE_JOKES_SLUGS.has(article.slug)}
          />
        </div>

        {/* Article à CTA dédié (config/blog-cta.ts) : CTA au moment où la lecture
            se termine, avant FAQ et maillage. Sinon, CTA en bas (défaut). */}
        {ctaCopy && cta}
```
**Avant** (l.334 à l.337) :
```tsx
        {/* CTA double (essai gratuit + premium), collé au parcours recommandé (T35).
            Textes propres à l'article si config/blog-cta.ts en définit. */}
        <ArticleCta {...BLOG_CTA_BY_SLUG[article.slug]} />
      </BlogArticleTracking>
```
**Après** :
```tsx
        {/* CTA double (essai gratuit + premium), collé au parcours recommandé (T35)
            pour les articles sans CTA dédié. */}
        {!ctaCopy && cta}
      </BlogArticleTracking>
```
**Avant** (l.168, après `const prevArticle = ...`) : rien. **Après**, ajouter :
```tsx
  // CTA de fin : textes et position propres à l'article si config/blog-cta.ts en définit (C4, C13).
  const ctaCopy = BLOG_CTA_BY_SLUG[article.slug];
  const cta = (
    <ArticleCta {...ctaCopy} freeCallbackUrl={`/onboarding?src=blog-${article.slug}`} />
  );
```
**Avant** (l.30, après `export const revalidate = 3600;`) : rien. **Après**, ajouter :
```tsx
/** Articles dont chaque vanne numérotée reçoit un bouton Partager (C7). */
const SHARE_JOKES_SLUGS = new Set(["meilleures-blagues-droles-2026"]);
```
Pourquoi : aujourd'hui, entre « Comment devenir drôle » (dernière ligne du corps) et le CTA, le lecteur traverse 5 FAQ, la navigation cluster, 3 cartes d'articles et l'encart parcours (environ 4 écrans mobiles). Le titre « Tu les as lues. Reste à les sortir pour de vrai. » n'a de sens qu'au moment où il a fini de lire. Pas un pop-up : un bloc dans le flux. L'encart parcours reste en bas comme sortie. Les autres articles ne bougent pas (`ctaCopy` absent).

### C5. Promesse du CTA : ce que le compte donne et que la page ne donne pas (critères 3 et 6)

Fichier : `apps/web/src/config/blog-cta.ts`.

**Avant** (l.16) :
```ts
    text: "Un compte gratuit te donne chaque jour une vanne décryptée et la première étape de chaque parcours, pour passer de la lecture à l'oral. Sans carte.",
```
**Après** :
```ts
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi t'entraîner à les placer au bon moment, pas juste à les connaître.",
```
Pourquoi : la vanne décryptée du jour est publique (`/blague-du-jour`, sans contrôle de session) et l'article vient de la proposer 2 fois : la vendre comme avantage du compte est faible et laisse croire qu'elle est réservée. Formulation alignée sur le [CHOIX UTILISATEUR] du 04/10 (« ton contenu quotidien et la première étape de chaque parcours »). Elle reprend l'idée de la section « Comment bien raconter » (savoir les placer ≠ connaître des blagues). « Sans carte » passe dans la note (C6), il n'apparaît plus qu'une fois. Test s14 l.117 à 121 : mettre à jour le `toEqual` (voir C6).

### C6. Note sous les boutons : rassurer au lieu de restreindre (critère 3)

Fichier : `apps/web/src/components/blog/article-cta.tsx`.

**Avant** (l.20 à l.21) :
```tsx
  primaryLabel?: string;
}
```
**Après** :
```tsx
  primaryLabel?: string;
  /** Ligne sous les boutons (défaut : limites du compte gratuit). */
  note?: string;
}
```
**Avant** (l.26) :
```tsx
const DEFAULT_PRIMARY_LABEL = "Essaie gratuitement";
```
**Après** :
```tsx
const DEFAULT_PRIMARY_LABEL = "Essaie gratuitement";
const DEFAULT_NOTE = `Compte gratuit : ${FREE_CATALOGUE_LIMITS_LABEL}, contenu du jour. Sans carte.`;
```
**Avant** (l.44 à l.45) :
```tsx
  primaryLabel = DEFAULT_PRIMARY_LABEL,
}: ArticleCtaProps) {
```
**Après** :
```tsx
  primaryLabel = DEFAULT_PRIMARY_LABEL,
  note = DEFAULT_NOTE,
}: ArticleCtaProps) {
```
**Avant** (l.90 à l.92) :
```tsx
      <p className="mt-3 text-xs text-text-muted">
        Compte gratuit : {FREE_CATALOGUE_LIMITS_LABEL}, contenu du jour. Sans carte.
      </p>
```
**Après** :
```tsx
      <p className="mt-3 text-xs text-text-muted">{note}</p>
```
Fichier : `apps/web/src/config/blog-cta.ts`. **Avant** (l.9 à l.10) : `  primaryLabel: string;` puis `}`. **Après** :
```ts
  primaryLabel: string;
  /** Ligne sous les boutons (défaut du composant si absente). */
  note?: string;
}
```
Et dans l'entrée du slug, après `primaryLabel: "Créer mon compte gratuit",`, ajouter :
```ts
    note: "Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.",
```
Pourquoi : « 10 vannes, 3 conseils, 3 vidéos » lu juste après 50 vannes gratuites ressemble à une perte. La nouvelle note est vraie ([CHOIX UTILISATEUR] 04/10 : pages catalogue et fiches lisibles sans compte, la limite ne touche que la liste défilante) et enlève la peur « on va me bloquer ce que je viens de lire ». Test s14 l.117 : remplacer l'objet attendu par les valeurs C5 et C6 (title et primaryLabel inchangés).

### C7. Bouton Partager sur chaque vanne, sans hauteur ajoutée (critères 4 et 8)

L'audit s14 (R6) l'avait mis « après mesure ». Je le passe en correctif : c'est l'usage n°1 du persona (envoyer la vanne à un pote), le composant existe déjà sur les fiches (`components/vannes/vanne-share-row.tsx`), et le partage est le seul signal de valeur que la page ne mesure pas. Icône flottante à droite de la vanne : le texte l'entoure, la page ne s'allonge pas.

Fichier : `apps/web/src/components/ui/markdown-renderer.tsx`.

**Avant** (l.23, après la fonction `escapeHtml`) : rien. **Après**, ajouter :
```ts
function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}

/** Vanne numérotée d'un article : « **12.** « … » » en début de bloc. */
const JOKE_RE = /^\*\*(\d+)\.\*\* («[^\n]+?»)/;

/** Même icône que vanne-share-row.tsx. */
const SHARE_ICON =
  '<svg aria-hidden="true" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>';

export interface RenderOptions {
  /** Bouton Partager (Web Share, repli copie) sur chaque vanne numérotée. */
  shareJokes?: boolean;
}
```
**Avant** (l.179) :
```ts
export function renderMarkdown(content: string): string {
```
**Après** :
```ts
export function renderMarkdown(content: string, options: RenderOptions = {}): string {
```
**Avant** (l.226 à l.227) :
```ts
    htmlParts.push(renderBlock(block));
    i++;
```
**Après** :
```ts
    const joke = options.shareJokes ? JOKE_RE.exec(block) : null;
    htmlParts.push(
      joke
        ? `<div id="vanne-${joke[1]}" class="flow-root scroll-mt-20"><button type="button" data-share-vanne="${joke[1]}" data-text="${escapeAttr(joke[2])}" aria-label="Partager la vanne n°${joke[1]}" class="float-right ml-3 mt-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-xs text-accent-link hover:bg-accent-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary">${SHARE_ICON}</button>${renderBlock(block)}</div>`
        : renderBlock(block),
    );
    i++;
```
**Avant** (l.233 à l.239) :
```tsx
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const html = renderMarkdown(content);
```
**Après** :
```tsx
interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** Bouton Partager sur chaque vanne numérotée (défaut : non). */
  shareJokes?: boolean;
}

export function MarkdownRenderer({ content, className, shareJokes = false }: MarkdownRendererProps) {
  const html = renderMarkdown(content, { shareJokes });
```
Fichier : `apps/web/src/components/blog/blog-article-tracking.tsx`.

**Avant** (l.31 à l.32) :
```ts
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
```
**Après** :
```ts
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const share = event.target.closest<HTMLButtonElement>("[data-share-vanne]");
      if (share && root.contains(share)) {
        void shareVanne(share, slug);
        return;
      }
```
**Avant** (fin de fichier, après `linkZone`) : rien. **Après**, ajouter :
```ts
/** Partage natif d'une vanne de l'article (repli : copie). Annulation = rien à mesurer. */
async function shareVanne(button: HTMLButtonElement, slug: string): Promise<void> {
  const vanne = button.dataset.shareVanne ?? "";
  const text = button.dataset.text ?? "";
  const url = `${window.location.origin}${window.location.pathname}#vanne-${vanne}`;
  try {
    if (navigator.share) {
      await navigator.share({ text, url });
      trackUmami("blog-vanne-partage", { slug, vanne, canal: "natif" });
      return;
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    const icon = button.innerHTML;
    button.textContent = "Copiée";
    window.setTimeout(() => {
      button.innerHTML = icon;
    }, 2000);
    trackUmami("blog-vanne-partage", { slug, vanne, canal: "copie" });
  } catch {
    // Partage annulé ou presse-papiers refusé.
  }
}
```
Le branchement côté page (`shareJokes={SHARE_JOKES_SLUGS.has(article.slug)}`) est dans C4.
Sécurité SEO : le texte stocké ne change pas (empreinte SHA-256 des 50 vannes du test s14 inchangée), les H2 et leurs id non plus ; `linkZone` remonte toujours au H2 précédent (les `div` sont sautés). Le lien partagé `#vanne-N` ramène sur la vanne exacte. Test à ajouter : `renderMarkdown(article.content, { shareJokes: true })` contient 50 `data-share-vanne` et 8 `<h2 id=`.

### C8. Thèmes après la vanne 50 : une puce par thème, cible de 44 px (critère 4)

Fichier : `apps/web/src/lib/blog-articles.ts`.

**Avant** (l.1546) :
```
Tu préfères choisir ta situation ? [Boulot](/vannes/theme/boulot), [couple](/vannes/theme/couple), [dating](/vannes/theme/dating), [soirées](/vannes/theme/soirees), [famille](/vannes/theme/famille), [gaming](/vannes/theme/gaming), [autodérision](/vannes/theme/autoderision).
```
**Après** (même bloc : ligne d'intro puis liste, format déjà géré par `renderBlock`) :
```
Tu préfères choisir ta situation ?
- [Boulot](/vannes/theme/boulot)
- [Couple](/vannes/theme/couple)
- [Dating](/vannes/theme/dating)
- [Soirées](/vannes/theme/soirees)
- [Famille](/vannes/theme/famille)
- [Gaming](/vannes/theme/gaming)
- [Autodérision](/vannes/theme/autoderision)
```
Fichier : `apps/web/src/components/ui/markdown-renderer.tsx`. **Avant** (l.144 à l.148) :
```ts
    case "ul": {
      const items = lines
        .map((l) => `<li>${inlineMarkdown(l.trimStart().slice(2))}</li>`)
        .join("");
```
**Après** :
```ts
    case "ul": {
      const items = lines
        .map((l) => {
          const item = l.trimStart().slice(2);
          // Puce réduite à un seul lien : zone de tap pleine hauteur (44 px) sur mobile.
          const solo = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(item.trim());
          return solo
            ? `<li><a href="${escapeHtml(solo[2])}" class="inline-flex min-h-[44px] items-center text-accent-link hover:underline">${inlineMarkdown(solo[1])}</a></li>`
            : `<li>${inlineMarkdown(item)}</li>`;
        })
        .join("");
```
Pourquoi : 7 liens séparés par des virgules = cibles de 1 mot collées, mauvais tap garanti au pouce. Les puces à lien seul (ici et dans les autres articles) gagnent 44 px ; les puces avec texte et lien ne bougent pas. Test s14 l.90 : remplacer `[autodérision](/vannes/theme/autoderision)` par `[Autodérision](/vannes/theme/autoderision)`.

### C9. « Toi aussi. » (critère 5)

**Avant** (l.1558) :
```
**Le timing, c'est sacré.** Un silence de 3 secondes peut faire rire à lui tout seul. Toi aussi. La pause juste avant la punchline crée l'attente. On a un [guide complet sur le timing](/blog/timing-humour).
```
**Après** :
```
**Le timing, c'est sacré.** Un silence de 3 secondes peut faire rire à lui tout seul. Et un silence, tout le monde sait le faire. La pause juste avant la punchline crée l'attente. On a un [guide complet sur le timing](/blog/timing-humour).
```
Pourquoi : reliquat de la phrase qui citait un humoriste (retiré en R5). « Toi aussi » se lit « toi aussi, tu peux faire rire à toi tout seul » : sans sens. La nouvelle chute garde l'idée (c'est à ta portée) avec une vraie pointe.

### C10. Les 4 sorties de section : une accroche par situation au lieu d'un gabarit (critère 5)

Libellés des liens et cibles inchangés ; chaque lien reste en fin de paragraphe, juste avant `---` (motif vérifié par le test s14 l.79).

| Ligne | Avant | Après |
|---|---|---|
| l.1414 | `Plus de vannes de soirée, avec leur chute et leur décryptage : [les blagues de soirée](/vannes/theme/soirees).` | `Il t'en faut d'autres pour ce soir ? Elles t'attendent avec leur chute et leur décryptage : [les blagues de soirée](/vannes/theme/soirees).` |
| l.1444 | `Plus de vannes pour la machine à café : [les blagues de boulot](/vannes/theme/boulot).` | `De quoi tenir jusqu'à vendredi à la machine à café : [les blagues de boulot](/vannes/theme/boulot).` |
| l.1468 | `Plus de vannes de date : [les blagues de dating](/vannes/theme/dating).` | `Pour le prochain date, ou pour le prochain blanc : [les blagues de dating](/vannes/theme/dating).` |
| l.1488 | `Plus de vannes de famille : [les blagues de famille](/vannes/theme/famille).` | `Le prochain repas de famille arrive toujours plus vite que prévu : [les blagues de famille](/vannes/theme/famille).` |

Pourquoi : 4 fois « Plus de vannes de X » se lit comme un gabarit, ce que la charte copy veut éviter (tic d'écriture IA). « Chute et décryptage » est vrai : chaque carte thème ouvre la fiche `/vannes/[slug]`, qui porte le décryptage.

### C11. Scroll en 4 paliers (critère 8)

Fichier : `apps/web/src/components/blog/blog-article-tracking.tsx`.

**Avant** (l.6 à l.7) :
```ts
/** Seuil de lecture de `blog-scroll` : part une seule fois par page. */
export const BLOG_SCROLL_THRESHOLD = 75;
```
**Après** :
```ts
/** Paliers de lecture de `blog-scroll` : chacun part une seule fois par page. */
export const BLOG_SCROLL_STEPS = [25, 50, 75, 100] as const;
```
**Avant** (l.43 à l.57) :
```ts
    let sent = false;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const body = root.querySelector<HTMLElement>("[data-blog-body]");
      if (sent || !body) return;
      const rect = body.getBoundingClientRect();
      if (rect.height <= 0) return;
      const read = (window.innerHeight - rect.top) / rect.height;
      if (read * 100 >= BLOG_SCROLL_THRESHOLD) {
        sent = true;
        trackUmami("blog-scroll", { slug, palier: BLOG_SCROLL_THRESHOLD });
        window.removeEventListener("scroll", onScroll);
      }
    };
```
**Après** :
```ts
    const sent = new Set<number>();
    let frame = 0;
    const measure = () => {
      frame = 0;
      const body = root.querySelector<HTMLElement>("[data-blog-body]");
      if (!body) return;
      const rect = body.getBoundingClientRect();
      if (rect.height <= 0) return;
      const read = ((window.innerHeight - rect.top) / rect.height) * 100;
      for (const palier of BLOG_SCROLL_STEPS) {
        if (read >= palier && !sent.has(palier)) {
          sent.add(palier);
          trackUmami("blog-scroll", { slug, palier });
        }
      }
      if (sent.size === BLOG_SCROLL_STEPS.length) window.removeEventListener("scroll", onScroll);
    };
```
Mettre à jour la doc du composant (l.21) : `blog-scroll {slug, palier: 25 | 50 | 75 | 100}`. Pourquoi : c'est la mesure que l'audit demandait (§3, E3) ; avec un seul palier à 75 %, impossible de savoir si les 88 % partent avant la vanne 8 ou après la 30, donc impossible de juger C1 et C4. Test `blog-article-tracking.test.tsx` l.76 à l.100 : attendre 3 appels (25, 50, 75) à `top = -2000`, puis un 4e à 100.

### C12. Les clics d'ancre sortent du KPI « 2e page » (critère 8)

Même fichier. **Avant** (l.38 à l.40) :
```ts
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || !root.contains(link)) return;
      trackUmami("blog-sortie-clic", { slug, ...linkZone(link), cible: link.getAttribute("href") ?? "" });
```
**Après** :
```ts
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || !root.contains(link)) return;
      const href = link.getAttribute("href") ?? "";
      // Ancre du sommaire = navigation dans la page, pas une 2e page.
      if (href.startsWith("#")) {
        trackUmami("blog-ancre-clic", { slug, cible: href });
        return;
      }
      trackUmami("blog-sortie-clic", { slug, ...linkZone(link), cible: href });
```
Pourquoi : le KPI E1 est « clics par visiteur, visite vers 2e page ». Avec C1, 7 ancres sur 9 liens de l'intro : sans séparation, `blog-sortie-clic` compterait comme sortie un saut vers « Bureau ». `blog-ancre-clic` dit en plus quelle situation attire. Test l.45 : attendre `blog-ancre-clic` `{ slug, cible: "#la-soiree" }`.

### C13. Inscription attribuable à l'article (critère 8)

Code inclus dans C4 : `freeCallbackUrl={`/onboarding?src=blog-${article.slug}`}`. `sanitizeCallbackUrl` (lib/safe-callback.ts) garde la query. Après inscription, Umami enregistre une vue de `/onboarding?src=blog-meilleures-blagues-droles-2026` : inscriptions de l'article comptées sans base de données, comparables d'un article à l'autre. À vérifier par @fullstack avant merge (non lu) : `/onboarding` ignore le paramètre `src`, et `AuthModal` redirige bien vers `callbackUrl` pour l'inscription par email comme pour Google. Limite à écrire dans le tableau : un membre existant qui se connecte par ce bouton arrive aussi là (compter à part avec l'admin, source de vérité).

### Récapitulatif

| # | Critère(s) | Fichier(s) | Test à mettre à jour |
|---|---|---|---|
| C1 | 1, 5 | blog-articles.ts l.1376-1378 | aucun |
| C2 | 2 | blog-articles.ts l.1442 | aucun (route `/parcours/[slug]` existe) |
| C3 | 2, 5 | blog-articles.ts l.1568 | aucun |
| C4 | 3 | blog/[slug]/page.tsx | aucun |
| C5 | 3, 6 | config/blog-cta.ts | s14 l.117-121 |
| C6 | 3 | article-cta.tsx, config/blog-cta.ts | s14 l.117-121 |
| C7 | 4, 8 | markdown-renderer.tsx, blog-article-tracking.tsx | ajouter (50 boutons, 8 H2) |
| C8 | 4 | blog-articles.ts l.1546, markdown-renderer.tsx | s14 l.90 |
| C9 | 5 | blog-articles.ts l.1558 | aucun |
| C10 | 5 | blog-articles.ts l.1414, 1444, 1468, 1488 | aucun |
| C11 | 8 | blog-article-tracking.tsx | tracking l.76-100 |
| C12 | 8 | blog-article-tracking.tsx | tracking l.41-46 |
| C13 | 8 | (dans C4) | aucun |

Ordre : un seul déploiement (C1 à C13), documenté dans `REPLIT_ACTIONS.md`, avec `updatedAt` laissé à la date du déploiement. Pre-commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`. Mesure du diff réel (P0 s11) : environ 15 lignes de contenu modifiées sur environ 210 de l'article, 0 sur les intouchables ; ne pas l'annoncer comme une réécriture.

Notes projetées après application : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.

## 4. Nice to have (ne bloquent pas le 10)

- **Sommaire en puces de 44 px** : seulement si `blog-ancre-clic` reste faible à 30 jours. Coût : environ 300 px de plus avant la vanne n°1, c'est pourquoi il reste en ligne aujourd'hui (les liens dans le texte sont exemptés de taille minimale par WCAG 2.5.8).
- **2e point d'inscription dans le corps** (phrase avec lien, jamais de pop-up) : à décider si `blog-scroll` montre que moins de la moitié des lecteurs atteint 75 %. Pas avant : sans donnée, il gênerait la lecture pour un gain inconnu.
- **Partager étendu aux autres articles CATALOGUE** : ajouter leurs slugs à `SHARE_JOKES_SLUGS` si `blog-vanne-partage` montre un usage réel.
- **Une ligne d'intro pour « WhatsApp / réseaux » et « Pépites inclassables »** : ces 2 sections passent du H2 à la vanne, les 5 autres ont une phrase. Pure cohérence de rythme, à faire relire par @copywriter contre la charte.

## 5. Décisions pour Thomas (hors note)

- **Bouton « Tout débloquer à 2,99 €/mois » dans le CTA de cet article.** Proposer un prix à quelqu'un venu chercher une vanne est probablement prématuré. Sa suppression pour ce slug n'est pas dans les correctifs : l'audit s14 la soumettait à ton GO. Défaut proposé : le garder, et regarder `blog-cta-clic {bouton: premium}` à 30 jours.
- **Meta « testées et approuvées »** : intouchable ici. Vraie au sens « relues à l'aveugle » (choix 30/09) ; à revoir seulement avec des données Search Console.
- Hors périmètre, non noté : la signature « Alex Durand » du gabarit blog, déjà instruite en s11.

## 6. Écarts avec l'audit s14

| Audit s14 | Cette notation | Résolution |
|---|---|---|
| R6 (Partager) « à instruire après mesure » | C7 en correctif | Usage n°1 du persona, composant déjà présent sur les fiches, zéro hauteur ajoutée, et il produit la mesure qui manquait. @growth peut contester, j'arbitrerais en faveur du persona. |
| « Liens internes existants » gelés | C2 change la cible d'un lien sortant | Aucun enjeu de classement pour CETTE page ; /conseils garde un lien (l.1570). |
| E3 : paliers 25/50/75/100 | Code : 75 seul | C11 aligne le code sur l'audit. |
| Inscriptions « par callbackUrl » | callbackUrl identique pour tous les articles | C13 rend l'attribution possible. |

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-article-blagues-2026-iter1.md
- Décisions prises : note globale 8,0/10 ; 13 correctifs exacts (C1 à C13) qui mènent à 10/10 sans toucher aux vannes, au slug, au title, à la meta, au H1 ni aux H2 ; aucun pop-up.
- Points d'attention : @fullstack applique C4, C6, C7, C8 (renderer), C11, C12, C13 et met à jour les 2 tests, en vérifiant `/onboarding?src=` et la redirection d'`AuthModal` ; @copywriter relit C1, C3, C5, C9, C10 contre `docs/copy/charte-refonte-copy-s11.md` ; @data-analyst relève la baseline avant déploiement et intègre `blog-ancre-clic`, `blog-vanne-partage` et les 4 paliers au tableau. Rendu mobile à vérifier sur screenshots 375/768/1280 après déploiement (absents aujourd'hui).
---
