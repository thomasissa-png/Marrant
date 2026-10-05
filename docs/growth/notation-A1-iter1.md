# Notation : A1 /blog/message-anniversaire-drole-par-situation (itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md` (numéros de ligne ci-dessous = ce fichier), gabarit `blog/[slug]/page.tsx`, `components/ui/markdown-renderer.tsx`, `components/blog/blog-vanne-share.tsx`, `config/blog-cta.ts`, `lib/seo-meta.ts`, `config/premium.ts`, `components/blog/blog-article-parcours-maillage.tsx`, étalon `meilleures-blagues-droles-2026` (`blog-articles.ts` l.1370-1590) et `phrases-droles-conversations` (l.1166).
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables respectés par tous les correctifs : texte des 21 messages, « 1 500+ » (absent, non ajouté), zéro tiret cadratin (0 trouvé dans A1), zéro humoriste (0 trouvé), slug.
> Limites : article non intégré, donc aucun rendu ni capture ; tests non exécutés ; pas de git (consigne).

## 0. Deux points du brief à corriger avant tout

1. **Le CTA juste après le corps n'est PAS automatique.** `page.tsx` l.267 : `{ctaCopy && cta}` ne s'affiche que si le slug a une entrée dans `config/blog-cta.ts` (l.15-23, seule l'étalon en a une). Sans entrée, A1 reçoit le CTA par défaut en bas de page (l.358), après la FAQ, le cluster, les cartes et l'encart parcours : la situation exacte notée 6/10 sur l'étalon à l'itération 1.
2. **La « metaDescription » d'A1 n'a aucun emplacement.** `BlogArticle` (statique) n'a pas de champ meta : `page.tsx` l.91 calcule `fitDescription(article.excerpt)`. L'excerpt d'A1 fait environ 290 caractères ; `fitDescription` (`seo-meta.ts` l.61-68) coupe au dernier point situé après 110 caractères, soit la 1re phrase (118 car.) : « Un message d'anniversaire drôle, c'est une ou deux phrases, un rire qui tombe sur toi et un bon moment pour l'envoyer. » Ni « 21 », ni « copier-coller », ni destinataire dans le snippet Google.

Le bouton Partager n'est pas automatique non plus : `SHARE_JOKES_SLUGS` (`page.tsx` l.35) et `JOKE_RE` (`markdown-renderer.tsx` l.30, exige « … ») excluent A1.

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **9/10** | « En bref » et 1er paragraphe servent l'intention, mais le sommaire n'arrive qu'au 4e bloc (environ 130 mots), sous le paragraphe sur l'italique, à la limite du 1er écran mobile. |
| 2 | Sorties vers une 2e page | **9/10** | Couverture complète, mais 2 doublons dans le corps : autodérision proposée en fin de fratrie (l.119) puis de nouveau en fin de section 5 (l.139), timing de l'humour en l.56 puis l.155 avec le même rôle (la pause). |
| 3 | CTA d'inscription | **6/10** | Aucune entrée `blog-cta.ts` : CTA générique en bas de page, après 4 blocs, sans lien avec un lecteur venu chercher un message. |
| 4 | Lisibilité mobile et structure | **8/10** | Format étalon respecté (numéro, ligne, indication en italique), mais rien pour copier ou envoyer un message alors que la page promet « à copier-coller » ; FAQ en markdown (l.173-189) qui doublerait le bloc « Questions fréquentes » du gabarit. |
| 5 | Ton Marrant des textes affichés | **7/10** | Contradiction (l.42 « sauf de l'avoir oublié » contre section 5, règle 1 et FAQ 2), 3 indications d'usage qui rendent le message faux si on les suit (n°3, n°11, n°21), H2 « le matin » alors que n°3 et n°4 se jouent le soir, « Va direct à ta personne », « Le reste du catalogue, lui, ne change pas », « signature décorée ». |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, « 1 500+ » absent, quiz et Machine à Café vrais ; seul écart : « parcours Confiance [...] pour oser envoyer le message » (l.139) prête au parcours un objet qu'il n'a pas (`premium.ts` l.67, maillage l.95 : reprendre après une pause, retrouver sa légèreté). |
| 7 | Sécurité SEO | **7/10** | Title 54 car. avec la requête, H1, intro et ancres OK, mais snippet tronqué à une phrase sans « 21 » (point 0.2), H2 « FAQ » qui n'est pas une question et sans FAQPage JSON-LD tant que les Q/R ne sont pas dans `faqs`, H2 pote restreint au « matin » (perd « message anniversaire drôle pote »). |
| 8 | Mesure | **9/10** | Sorties, ancres, 4 paliers de scroll et `src=blog-<slug>` hérités du gabarit, mais l'action de valeur de la page (envoyer un message) ne produit aucun événement. |

**Note globale : 8,0/10** (64/80).
**Après les 11 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 2. Top 3 (impact le plus fort)

1. **C10 (CTA dédié)** : critère le plus bas (6/10). Une entrée de 6 lignes dans `blog-cta.ts` remonte le CTA juste après le corps, comme l'étalon.
2. **C8 + C9 (snippet et FAQ)** : sans eux, Google affiche une phrase de définition au lieu de « 21 messages à copier-coller », et la page n'a pas de FAQPage. C'est le trafic de la page.
3. **C3 + C4 (cohérence du texte)** : une règle contredite 3 fois plus bas et 4 indications qui, suivies à la lettre, rendent le message faux. Ce sont les seuls défauts qu'un lecteur voit vraiment.

## 3. Correctifs exacts

Fichier article : `docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md` (à reporter tel quel dans `blog-articles.ts` à l'intégration). Aucun correctif ne touche le texte d'un des 21 messages.

### C1. Sommaire en 2e paragraphe, libellé corrigé (critères 1 et 5)

**Avant** (l.34 puis l.36, dans cet ordre) :
```md
Chaque message tient en une ou deux phrases. Après chacun, une ligne en italique te dit où et quand l'envoyer. Il te reste à changer le prénom et, si tu en as un, à ajouter un détail que toi seul connais.

Va direct à ta personne : [Pote](#quel-message-drole-envoyer-a-un-pote-le-matin-de-son-anniversaire) · [Collègue](#quel-mot-drole-ecrire-sur-la-carte-collective-du-bureau) · [Parents](#que-dire-de-drole-a-ses-parents-le-jour-de-leur-anniversaire) · [Frère ou sœur](#quel-message-drole-pour-un-anniversaire-dans-la-fratrie) · [Ami perdu de vue ou date oubliée](#que-dire-a-un-ami-perdu-de-vue-ou-quand-on-a-oublie-la-date) · [Les 4 règles](#comment-ecrire-un-message-d-anniversaire-drole-qui-ne-tombe-pas-a-plat). Pour d'autres phrases à ressortir dans une conversation, il y a aussi [les phrases drôles](/blog/phrases-droles-conversations).
```
**Après** :
```md
Choisis à qui tu écris : [Pote](#quel-message-drole-envoyer-a-un-pote-pour-son-anniversaire) · [Collègue](#quel-mot-drole-ecrire-sur-la-carte-collective-du-bureau) · [Parents](#que-dire-de-drole-a-ses-parents-le-jour-de-leur-anniversaire) · [Frère ou sœur](#quel-message-drole-pour-un-anniversaire-dans-la-fratrie) · [Ami perdu de vue ou date oubliée](#que-dire-a-un-ami-perdu-de-vue-ou-quand-on-a-oublie-la-date) · [Les 4 règles](#comment-ecrire-un-message-d-anniversaire-drole-qui-ne-tombe-pas-a-plat). Pour d'autres phrases à ressortir dans une conversation, il y a aussi [les phrases drôles](/blog/phrases-droles-conversations).

Chaque message tient en une ou deux phrases. Après chacun, une ligne en italique te dit où et quand l'envoyer. Il te reste à changer le prénom et, si tu en as un, à ajouter un détail que toi seul connais.
```
Pourquoi : le sommaire passe d'environ 130 à environ 90 mots du haut, dans le 1er écran mobile même sous le bloc « En bref » (même logique que C1 de l'étalon). « Ta personne » se lit « toi-même ». L'ancre Pote suit C2.

### C2. H2 pote sans « le matin » (critères 5 et 7)

**Avant** (l.40) :
```md
## Quel message drôle envoyer à un pote le matin de son anniversaire ?
```
**Après** :
```md
## Quel message drôle envoyer à un pote pour son anniversaire ?
```
Pourquoi : la n°3 se joue dans le groupe de la fête et la n°4 au gâteau, le soir. Le H2 ne couvrait que 2 lignes sur 4. Il colle aussi mieux à la longue traîne « message anniversaire drôle pote ». Ancre : `quel-message-drole-envoyer-a-un-pote-pour-son-anniversaire` (calcul `headingId`, `markdown-renderer.tsx` l.155-168), déjà reportée dans C1.

### C3. Règle des potes qui ne contredit plus la section 5 (critère 5)

**Avant** (l.42) :
```md
Avec un pote, tu as le plus de liberté : il te connaît, il sait quand tu plaisantes. La seule règle, c'est que le rire reste à ta charge. Tu peux t'accuser de tout, sauf de l'avoir oublié.
```
**Après** :
```md
Avec un pote, tu as le plus de liberté : il te connaît, il sait quand tu plaisantes. La seule règle, c'est que le rire reste à ta charge : ta mémoire, ta flemme, tes photos ratées.
```
Pourquoi : « sauf de l'avoir oublié » est contredit par la section 5 (n°21), la règle 1 (« Ton retard, ta mémoire [...] tu peux tout te permettre ») et la FAQ 2 (« le retard peut même devenir la blague »). La nouvelle liste annonce les n°1 (photo) et n°2 (vocal).

### C4. Indications d'usage qui rendent le message vrai (critère 5)

Seule la ligne en italique change, le message au-dessus ne bouge pas.

| N° | Ligne | Avant | Après |
|---|---|---|---|
| 2 | l.48 | `*→ En vocal si tu sais le dire d'une voix plate. Une seule prise, sans rire à la fin.*` | `*→ En vocal uniquement, d'une voix plate : par écrit, « ce vocal » ne veut plus rien dire. Une seule prise, sans rire à la fin.*` |
| 3 | l.51 | `*→ Dans le groupe, si l'anniversaire est fêté à plusieurs. Écris-le en une seule bulle, pas en trois.*` | `*→ Dans le groupe de potes, seulement si personne n'a encore écrit : la phrase doit rester vraie. Écris-le en une seule bulle, pas en trois.*` |
| 9 | l.77 | `*→ Sur la note adhésive collée au cadeau d'équipe. Laisse-le seul sur le papier, sans signature décorée.*` | `*→ Sur la note adhésive collée au cadeau d'équipe. Laisse-le seul sur la note : les signatures vont sur la carte.*` |
| 11 | l.91 | `*→ Sur la carte papier jointe au bouquet ou au cadeau. Écris-le sur une ligne à part, au-dessus de ta signature.*` | `*→ Sur la carte jointe au bouquet, seulement s'il y a un bouquet. Écris-le sur une ligne à part, au-dessus de ta signature.*` |
| 21 | l.137 | `*→ Même en retard, en vocal si vous aviez cette habitude. Garde-le court.*` | `*→ Le lendemain, si tu as laissé passer la date. Par écrit, ou en vocal si vous aviez cette habitude. Garde-le court.*` |

Pourquoi : n°2, le texte dit « ce vocal », il ne marche pas par écrit ; n°3, « Personne n'a écrit » est faux si quelqu'un a déjà écrit ; n°9, « signature décorée » ne veut rien dire ; n°11, « Ce bouquet » est faux sur un autre cadeau ; n°21, « Hier, j'ai pensé à toi » ne s'envoie que le lendemain, et c'est la seule ligne « date oubliée » de la page.

### C5. Fin de section 5 : plus de doublon, promesse Confiance exacte (critères 2 et 6)

**Avant** (l.139) :
```md
Écrire le premier après un silence demande un peu de courage. Le [parcours Confiance](/parcours/confiance) est fait pour ça : 20 minutes par semaine pour oser envoyer le message. Et pour rire de ton propre retard : [les blagues d'autodérision](/vannes/theme/autoderision).
```
**Après** :
```md
Écrire le premier après un silence demande un peu de courage. Le [parcours Confiance](/parcours/confiance) t'aide à reprendre après une pause, une conversation à la fois : 20 minutes par semaine.
```
Pourquoi : « reprendre après une pause » et « une conversation à la fois » sont les mots de l'encart du parcours (`blog-article-parcours-maillage.tsx` l.95 et l.98) ; « 20 min/semaine » = `premium.ts` l.67. Autodérision reste en fin de fratrie (l.119) et dans la liste de fin (l.167).

### C6. Règle 4 sans 2e lien vers le timing (critère 2)

**Avant** (l.155) :
```md
**4. Choisis le support avant le texte.** Une phrase écrite sur une carte ne se joue pas comme un vocal. [Le timing de l'humour](/blog/timing-humour) donne la règle de la pause, utile à l'oral.
```
**Après** :
```md
**4. Choisis le support avant le texte.** Une phrase écrite sur une carte ne se joue pas comme un vocal : à l'écrit, c'est le point avant la dernière phrase qui fait la pause.
```
Pourquoi : l.56 envoie déjà vers le même article pour la même raison (la pause). La nouvelle phrase donne la version écrite de la règle, celle qu'appliquent les messages de la page.

### C7. Fin d'article : plus de phrase défensive (critère 5)

**Avant** (l.161) :
```md
**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage. Le reste du catalogue, lui, ne change pas : [toutes les vannes](/vannes) sont rangées par situation.
```
**Après** :
```md
**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage. Le reste est dans [le catalogue de vannes](/vannes), rangé par situation.
```
Pourquoi : « ne change pas » répond à une question que personne ne pose et donne envie de ne pas cliquer. La version proposée reste vraie (aucune promesse de nouveauté sur le catalogue).

### C8. L'excerpt devient la meta (critère 7)

**Avant** (l.11 et l.12) :
```md
- **metaDescription** : 21 messages d'anniversaire drôles à copier-coller : pote, collègue, parent, frère ou sœur, ami perdu de vue. Avec le moment et le support qui font mouche.
- **excerpt** : Un message d'anniversaire drôle, c'est une ou deux phrases, un rire qui tombe sur toi et un bon moment pour l'envoyer. Voici 21 textes à copier-coller selon la personne (pote, collègue, parent, frère ou sœur, ami perdu de vue), avec le support conseillé pour chacun : WhatsApp, carte ou mot au gâteau.
```
**Après** (une seule ligne) :
```md
- **excerpt** (= meta description via `fitDescription`, 146 car.) : 21 messages d'anniversaire drôles à copier-coller : pote, collègue, parent, frère ou sœur, ami perdu de vue. Avec le bon moment et le bon support.
```
Pourquoi : point 0.2. 146 caractères, sous les 155 du brief et les 160 de `fitDescription` : le snippet sort entier, avec le nombre, l'usage et les destinataires. « Qui font mouche » (cliché) disparaît. Le champ `excerpt` sert aussi la carte du blog et `/liens` : le texte y est lisible. Le « 21 » reste lié au nombre de lignes (règle l.19).

### C9. FAQ dans `faqs`, pas dans le corps (critères 4 et 7)

**Avant** (l.173 à l.189) : le bloc `## FAQ` et ses 4 `###` à la fin du contenu.
**Après** : supprimer ces 17 lignes du `content` (le corps finit sur la ligne `→ **[La blague du jour](/blague-du-jour)** : celle d'aujourd'hui, et demain une autre.`) et ajouter à l'objet de l'article dans `blog-articles.ts`, après `category: "CATALOGUE",` :
```ts
    faqs: [
      { question: "Comment écrire un message d'anniversaire drôle sans vexer ?", answer: "Fais rire sur toi ou sur une situation que vous partagez, jamais sur l'âge, le physique ou la vie privée de la personne fêtée. Si tu hésites, relis ton message en te mettant à sa place : s'il te fait sourire de l'autre côté, il peut partir. Une phrase drôle suivie d'une phrase sincère passe presque toujours mieux qu'un message uniquement moqueur." },
      { question: "Peut-on envoyer un message drôle en retard ?", answer: "Oui, et le retard peut même devenir la blague : tu le reconnais en une phrase, tu en ris en premier, tu souhaites un bon anniversaire. Mieux vaut un message court envoyé le lendemain qu'un long message d'excuses envoyé une semaine plus tard. Évite de te justifier : plus tu t'expliques, moins la phrase fait sourire." },
      { question: "Peut-on copier-coller un message drôle tel quel ?", answer: "Tu peux, mais il sera plus fort avec un détail à toi : un lieu, une habitude, un objet que vous avez en commun. Remplace au minimum le prénom, relis le texte à voix haute et supprime tout ce qui ne sonne pas comme toi. Si le message est envoyé à plusieurs personnes, change au moins un mot par destinataire." },
      { question: "Vaut-il mieux un message drôle ou un message sincère ?", answer: "Les deux, dans cet ordre : une phrase drôle pour ouvrir, une phrase vraie pour finir. Le rire installe la complicité, la phrase sincère fait que la personne se sent attendue. Un message uniquement drôle s'oublie vite, et un message uniquement sérieux peut peser le matin d'un anniversaire." },
    ],
```
Pourquoi : `page.tsx` l.191-193 (JSON-LD FAQPage) et l.270-284 (bloc « Questions fréquentes », `frTypo`) ne lisent que `faqs`, comme pour l'étalon. Laissée dans le corps, la FAQ n'a pas de schéma et le H2 « FAQ » est le seul H2 qui n'est pas une question ; mise aux deux endroits, elle s'afficherait deux fois. Texte des 4 Q/R inchangé, mot pour mot.

### C10. CTA dédié, juste après le corps (critère 3)

Fichier : `apps/web/src/config/blog-cta.ts`. **Avant** (l.22-23) :
```ts
  },
};
```
**Après** :
```ts
  },
  // Notation A1 iter1 (C10) : lecteur venu chercher un message à envoyer, pas un programme.
  "message-anniversaire-drole-par-situation": {
    title: "Le message, c'est fait. Reste le moment du gâteau.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi trouver la bonne phrase aussi à l'oral, pas seulement par écrit.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les messages de cette page restent en accès libre, compte ou pas.",
  },
};
```
Pourquoi : point 0.1. L'entrée suffit à faire passer le CTA en l.267 (après le corps) au lieu de l.358 (bas de page). Promesse = formulation [CHOIX UTILISATEUR] du 04/10, déjà validée sur l'étalon ; la note est vraie (article public). Le titre reprend les 2 supports de la page (écrit, gâteau). Pas de pop-up, pas de « 1 500+ ».

### C11. Bouton Partager sur chaque message (critères 4 et 8)

La page promet « à copier-coller » ; sur mobile, sélectionner un paragraphe au doigt embarque le numéro et l'indication. Le bouton existe déjà (étalon) : il ouvre le partage natif (WhatsApp en un tap) ou copie le texte, et envoie `blog-vanne-partage`.

Fichier : `apps/web/src/components/ui/markdown-renderer.tsx`. **Avant** (l.29-30) :
```ts
/** Vanne numérotée d'un article : « **12.** « … » » en début de bloc. */
const JOKE_RE = /^\*\*(\d+)\.\*\* («[^\n]+»)/;
```
**Après** :
```ts
/** Ligne numérotée d'un article (vanne entre « … » ou message sans guillemets), 1re ligne du bloc seule. */
const JOKE_RE = /^\*\*(\d+)\.\*\* («[^\n]+»|[^\n]+)/;
```
Fichier : `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`. **Avant** (l.35) :
```ts
const SHARE_JOKES_SLUGS = new Set(["meilleures-blagues-droles-2026"]);
```
**Après** :
```ts
const SHARE_ITEM_BY_SLUG: Record<string, "vanne" | "message"> = {
  "meilleures-blagues-droles-2026": "vanne",
  "message-anniversaire-drole-par-situation": "message",
};
```
**Avant** (l.185) : `  const shareJokes = SHARE_JOKES_SLUGS.has(article.slug);`
**Après** :
```ts
  const shareItem = SHARE_ITEM_BY_SLUG[article.slug];
  const shareJokes = Boolean(shareItem);
```
**Avant** (l.263) : `        {shareJokes && <BlogVanneShare slug={article.slug} />}`
**Après** : `        {shareItem && <BlogVanneShare slug={article.slug} item={shareItem} />}`

Fichier : `apps/web/src/components/blog/blog-vanne-share.tsx`. **Avant** (l.8-10) :
```ts
interface BlogVanneShareProps {
  slug: string;
}
```
**Après** :
```ts
interface BlogVanneShareProps {
  slug: string;
  /** Nom de la ligne partagée, pour le titre et le libellé (défaut : vanne). */
  item?: "vanne" | "message";
}
```
**Avant** (l.26) : `export function BlogVanneShare({ slug }: BlogVanneShareProps) {`
**Après** : `export function BlogVanneShare({ slug, item = "vanne" }: BlogVanneShareProps) {`
**Avant** (l.41 et l.44) :
```tsx
            title="Vanne - deviens-marrant.fr"
            label={`Partager la vanne n°${vanne}`}
```
**Après** :
```tsx
            title={item === "message" ? "Message d'anniversaire - deviens-marrant.fr" : "Vanne - deviens-marrant.fr"}
            label={item === "message" ? `Partager le message n°${vanne}` : `Partager la vanne n°${vanne}`}
```
Sécurité : pour l'étalon, la 1re alternative de `JOKE_RE` capture exactement comme avant (50 emplacements, `data-text` identique) ; aucune ligne `**N.** ` sans guillemet n'existe dans `blog-articles.ts` aujourd'hui (Grep `^\*\*\d+\.\*\* [^«]` : 0). Les 4 règles d'A1 (`**1. Le rire...**`) ne correspondent pas au motif. `data-text` d'A1 = la ligne du message seule, sans l'indication en italique ; « [prénom] » reste à remplacer dans WhatsApp avant envoi. Test à ajouter : `renderMarkdown(a1.content, { shareJokes: true })` contient 21 `data-share-vanne` et 6 `<h2 id=`. Événement : `blog-vanne-partage {slug, vanne, canal}`, le slug distingue A1 de l'étalon.

### Récapitulatif

| # | Critère(s) | Fichier | Test |
|---|---|---|---|
| C1 | 1, 5 | A1 l.34-36 | aucun |
| C2 | 5, 7 | A1 l.40 | ancre dans le test A1 |
| C3 | 5 | A1 l.42 | aucun |
| C4 | 5 | A1 l.48, 51, 77, 91, 137 | aucun |
| C5 | 2, 6 | A1 l.139 | aucun |
| C6 | 2 | A1 l.155 | aucun |
| C7 | 5 | A1 l.161 | aucun |
| C8 | 7 | A1 l.11-12 (excerpt) | meta ≤ 155 car. |
| C9 | 4, 7 | A1 l.173-189 → `faqs` | 4 `faqs`, 0 `## FAQ` |
| C10 | 3 | config/blog-cta.ts | aucun |
| C11 | 4, 8 | markdown-renderer.tsx, page.tsx, blog-vanne-share.tsx | 21 emplacements ; étalon toujours 50 |

Diff réel attendu (P0 s11) : environ 14 lignes de contenu modifiées sur environ 190, 17 lignes déplacées (FAQ), environ 25 lignes de code ; 0 caractère modifié dans les 21 messages. Notes projetées : 10 sur les 8 critères.

## 4. Vérifications demandées

### SEO

| Point | État actuel | Après correctifs |
|---|---|---|
| Title ≤ 60 car. avec la requête | PASS : 54 car., « Message d'anniversaire drôle » en tête ; `fitTitle` le sort sans suffixe (54 + 21 > 60) | inchangé |
| Meta ≤ 155 car. | FAIL : snippet réel = 1re phrase de l'excerpt (118 car.), sans « 21 » ni « copier-coller » ; la meta de 154 car. n'est lue par aucun code | PASS (C8, 146 car.) |
| H2 en question | 6 sur 7 (« ## FAQ ») | 6 sur 6 (C9) ; le titre « Questions fréquentes » du gabarit est commun à tous les articles, comme sur l'étalon |
| Intention servie dès l'intro | PASS : « En bref » définit et donne les supports, le 1er paragraphe promet 21 messages à copier-coller | sommaire dans le 1er écran (C1) |
| Ancres du sommaire | PASS : les 6 correspondent à `headingId` | ancre Pote mise à jour (C1, C2) |
| Liens internes (15) | PASS : routes `/vannes/theme/[slug]`, `/parcours/[slug]`, `/videos`, `/conseils`, `/quiz-humour`, `/blague-du-jour` et les 3 slugs de blog existent | 15 cibles distinctes, plus aucun lien répété d'une section à l'autre (C5, C6) ; la liste de fin reprend 4 thèmes, comme sur l'étalon |
| FAQPage | absent (FAQ dans le corps) | PASS (C9) |

### Cohérence des 21 lignes avec leur contexte

| N° | Section | Verdict | Motif |
|---|---|---|---|
| 1 | Pote | OK | Rire sur soi (le pouce), WhatsApp du matin. |
| 2 | Pote | Corrigé (C4) | Le texte dit « ce vocal » : vocal uniquement. |
| 3 | Pote | Corrigé (C2, C4) | Vrai seulement si personne n'a écrit ; se joue dans le groupe, pas forcément le matin. |
| 4 | Pote | Corrigé (C2) | Se dit au gâteau : incompatible avec « le matin » du H2. |
| 5 à 8 | Collègue | OK | Rire sur soi ou sur le bureau, rien sur la vie privée, conditions d'usage vraies (n°5 seulement sous la direction). |
| 9 | Collègue | Corrigé (C4) | Indication obscure. |
| 10, 12, 13 | Parents | OK | Rire sur soi (boîtes, batterie, vaisselle), aucune pique sur l'âge. |
| 11 | Parents | Corrigé (C4) | « Ce bouquet » faux sur un autre cadeau. |
| 14 à 17 | Fratrie | OK | Rire sur soi à chaque ligne ; n°15 et n°16 sont deux « P.-S. » alternatifs pour la même carte, à ne pas cumuler (l'indication de chacune suffit). |
| 18 à 20 | Ami perdu de vue | OK | Le silence est reconnu, la faute reste à l'auteur ; n°19 conditionnée à un surnom réel. |
| 21 | Date oubliée | Corrigé (C4) | « Hier » : à envoyer le lendemain. |

Aucune ligne hors sujet, aucune à retirer, aucune à déplacer : le « 21 » reste juste partout.

### Cannibalisation avec `phrases-droles-conversations`

Aucune. Cette page (`blog-articles.ts` l.1166) vise « phrases drôles » en conversation orale (machine à café, soirée, date, réunion) ; le mot « anniversaire » n'apparaît dans aucun article de `blog-articles.ts` (Grep : 0). A1 vise « message d'anniversaire drôle », un texte écrit pour une personne et une date. Le seul lien d'A1 vers elle porte l'ancre « les phrases drôles » : il renforce sa requête au lieu de la concurrencer. À garder tel quel.

## 5. Ne comptent pas contre le 10

- **Deux ouvertures sur la photo** (n°1 « J'ai cherché une photo de nous deux », n°18 « J'ai retrouvé une photo de nous deux ») et **trois lignes « discours »** (n°4, n°12, n°13) : texte validé à l'aveugle, dans des sections différentes. Aucun correctif possible sans toucher un message.
- **« par situation » dans le title** alors que les sections suivent surtout la personne : la section 5 est bien une situation, le slug porte déjà ce mot, et changer le title n'apporte rien de mesurable.
- **Mot-clé secondaire « texte anniversaire humoristique »** absent du texte : l'ajouter forcerait une tournure ; la requête principale suffit.
- **« remonté » (n°20)** : décision déjà documentée (l.19).

## 6. Points d'attention pour l'intégration (hors note)

- **Aucune programmation par date** : `blog/page.tsx` l.75 filtre seulement `UNPUBLISHED_STATIC_SLUGS`, et la route article ne filtre rien. Un article ajouté avec `date: "2026-10-22"` est en ligne dès le déploiement. Il faut donc soit intégrer le 22/10, soit ajouter le slug à `UNPUBLISHED_STATIC_SLUGS` jusqu'au 22/10 (et vérifier que la route `/blog/[slug]` le bloque aussi, non lu).
- Captures 375/768/1280 à prendre après intégration : critères 1 et 4 à confirmer au rendu, comme à l'itération 4 de l'étalon.
- Relecture @copywriter des textes ajoutés par C1, C3, C4, C5, C6, C7 et C10 contre `docs/copy/charte-refonte-copy-s11.md`.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A1-iter1.md
- Décisions prises : note globale 8,0/10 (64/80) ; 11 correctifs exacts (C1 à C11) pour 10/10, sans toucher au texte des 21 messages, au slug ni au title ; aucune ligne retirée ni déplacée ; aucune cannibalisation avec `phrases-droles-conversations`.
- Points d'attention : le brief se trompait sur 2 points (le CTA après le corps demande une entrée `blog-cta.ts`, et la meta vient de l'excerpt) ; @copywriter applique C1 à C9 dans le fichier A1 ; @fullstack intègre l'article avec `faqs` (C9), ajoute C10 et C11 avec le test 21/50, et règle la mise en ligne du 22/10 (aucune programmation par date) ; `REPLIT_ACTIONS.md` à compléter au déploiement.
---
