# Notation : /blog/voeux-drole-nouvelle-annee (A2, itération 1, 05/10/2026)

> Revue @reviewer. Base : brouillon `docs/copy/articles-forte-frappe/A2-voeux-drole-nouvelle-annee.md` (version finale, 27 messages), gabarit à HEAD (`blog/[slug]/page.tsx`, `components/ui/markdown-renderer.tsx`, `components/blog/blog-vanne-share.tsx`, `components/ui/share-button.tsx`, `components/blog/article-cta.tsx`, `config/blog-cta.ts`, `config/blog-tracking.ts`, `lib/blog-faq.ts`, `lib/seo-meta.ts`), étalon `meilleures-blagues-droles-2026` (`blog-articles.ts` l.1370 et suivantes, notation iter4), S11 et S13 (`docs/copy/articles-q4/`).
> Grille de 8 critères identique à `notation-article-blagues-2026-iter1.md`.
> Intouchables : le texte des 27 messages, zéro tiret cadratin, zéro humoriste, zéro promesse fausse, « 1 500+ » (absent de l'article, non ajouté).
> Limites : article non importé, donc pas de rendu ni de capture (à faire après le dry-run d'import). Tests non exécutés. Pas de git (consigne).

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **8/10** | Sommaire en 4e bloc (après environ 155 mots, dont une phrase de l'intro qui répète l'En bref), 1er message après environ 400 mots, et « nouvelle année » absent de l'En bref et de l'intro. |
| 2 | Sorties vers une 2e page | **9/10** | Couverture comparable à l'étalon, mais le lien vers `phrases-droles-conversations` est placé dans l'intro de la section WhatsApp, avant les messages 20 à 24 : il fait sortir le lecteur avant le contenu. |
| 3 | CTA d'inscription | **6/10** | A2 n'a pas d'entrée dans `config/blog-cta.ts` : CTA par défaut, en bas de page après la FAQ, le cluster, les cartes et l'encart parcours, et avec un titre (« Maintenant, reste à le dire à voix haute ») qui ne colle pas à un message écrit. Même défaut que l'étalon à l'itération 1. |
| 4 | Lisibilité mobile et structure | **8/10** | L'usage n°1 (envoyer le message) n'a aucun bouton : A2 n'est pas dans `SHARE_JOKES_SLUGS`, et même ajouté, `JOKE_RE` exige « … », absents des 27 messages. Sur mobile, un appui long sélectionne aussi le « 1. » en gras. |
| 5 | Ton Marrant des textes ajoutés | **8/10** | La règle « deux phrases » (En bref, intro, À retenir) est contredite par 26 messages sur 27 : seule la n°1 tient en deux phrases, et les n°3, 14, 18, 19, 21, 22, 24 et 25 en comptent 4 ou 5. « Le rire tombe sur toi » est répété 7 fois. On lit « C'est ce qui rend le message à toi » (tournure fautive), la n°3 répète mot pour mot la règle 3, la n°6 se contredit, et on parle de « timing avant l'envoi » pour un texte écrit. |
| 6 | Conformité | **9/10** | Zéro tiret cadratin (Grep : 0), zéro humoriste, durées des parcours et quiz conformes au [CHOIX UTILISATEUR] du 29/09, « jusqu'à fin janvier » vérifié. Seul écart : l'indication de la n°10 l'envoie à « la direction » en carte formelle alors que la chute vise le destinataire, ce qui contredit la promesse du H2 (« qui ne vexent personne »). |
| 7 | Sécurité SEO | **9/10** | Title de 53 car. avec la requête (rendu en `absolute`, le suffixe ferait 74), meta de 144 car. (champ `metaDescription`, ≤ 155), 7 H2 en question, FAQ compatible `splitTrailingFaq`, ancres du sommaire conformes à `headingId`, pas de cannibalisation. Écart : la requête n'apparaît ni dans l'En bref ni dans l'intro (« nouvelle année » n'y figure pas). |
| 8 | Mesure | **9/10** | Le slug est dans `TRACKED_ARTICLES`. Scroll, sorties, ancres et `src=blog-<slug>` sont gérés par le gabarit. Il manque le signal de valeur propre à A2 (`blog-vanne-partage`) : aucun emplacement de partage n'est rendu. |

**Note globale : 8,3/10** (66/80).
**Après les 11 correctifs ci-dessous : 10/10 sur les 8 critères.**

Les correctifs ne touchent ni le texte des 27 messages, ni le slug, le title, la meta ou les 7 H2 et les 4 questions de la FAQ. Aucun pop-up.

## 2. Top 3 (impact le plus fort)

1. **D10 (CTA dédié)** : c'est le critère le plus bas (6/10). Une entrée de config de 6 lignes remonte le CTA juste après le corps et lui donne un texte qui parle d'un message écrit.
2. **D11 (Envoyer le message, texte seul)** : c'est l'usage réel du persona. Pour un vœu au patron, le bouton Partager actuel ajouterait l'URL de deviens-marrant.fr au message, ce qui grille l'expéditeur. Il faut un envoi du texte seul.
3. **D1 + D2 (intro)** : la requête doit apparaître dans la première phrase, le sommaire doit suivre l'En bref, et la règle « deux phrases » doit cesser d'être démentie par les messages eux-mêmes.

## 3. Correctifs exacts

Fichier article : `docs/copy/articles-forte-frappe/A2-voeux-drole-nouvelle-annee.md` (les numéros de ligne sont ceux du brouillon ; le même texte part dans `content` à l'import).

### D1. En bref : requête dans la 1re phrase, règle des « deux phrases » corrigée (critères 1, 5, 7)

**Avant** (l.32) :
```md
> **En bref :** Un vœu drôle tient en deux phrases et se règle sur le destinataire : le rire tombe sur toi ou sur la situation, jamais sur la personne qui reçoit le message. Voici des messages à copier, classés par destinataire (collègues, patron ou client, famille, groupe WhatsApp, ex), chacun avec le moment et le ton pour l'envoyer.
```
**Après** :
```md
> **En bref :** Un vœu drôle de nouvelle année tient en quelques lignes et se règle sur le destinataire : le rire tombe sur toi ou sur la situation, jamais sur la personne qui reçoit le message. Voici des messages à copier, classés par destinataire (collègues, patron ou client, famille, groupe WhatsApp, ex), chacun avec le moment et le ton pour l'envoyer.
```
Pourquoi : « nouvelle année » est absent des 4 premiers blocs, alors que c'est le cœur de la requête. « Deux phrases » est démenti par 26 messages sur 27 (seule la n°1 en a deux ; la n°24 en a cinq). Les messages sont intouchables, c'est donc la règle qu'on corrige. « Quelques lignes » reste vrai pour les 27.

### D2. Sommaire juste après l'En bref, intro sans doublon (critères 1 et 5)

**Avant** (l.34 à l.38, trois blocs dans cet ordre) :
```md
Chaque fin d'année, ton téléphone reçoit les mêmes phrases : « bonne année, bonne santé », avec un feu d'artifice en pièce jointe. Tu les renvoies, parce qu'à minuit personne n'a le temps d'en inventer d'autres.

Un vœu drôle coûte à peine plus cher à écrire : deux phrases et une chute, et il sort de la pile. Encore faut-il qu'il tombe juste, parce que le texte qui fait rire ton groupe d'amis ne s'envoie pas à ton patron. Voici des messages classés par destinataire, prêts à copier, avec pour chacun une indication pour l'envoyer au bon moment.

Va direct à ton destinataire : [Collègues](#quel-message-drole-envoyer-a-tes-collegues) · [...] · [Ex](#que-dire-a-ton-ex-pour-la-nouvelle-annee-sans-rouvrir-le-dossier). Une fois les vœux envoyés, la [blague du jour](/blague-du-jour) change chaque jour, et le [catalogue de vannes](/vannes) range le reste par situation.
```
**Après** (le bloc « Va direct » remonte, inchangé, juste sous l'En bref ; les 2 paragraphes suivent) :
```md
Va direct à ton destinataire : [Collègues](#quel-message-drole-envoyer-a-tes-collegues) · [...] · [Ex](#que-dire-a-ton-ex-pour-la-nouvelle-annee-sans-rouvrir-le-dossier). Une fois les vœux envoyés, la [blague du jour](/blague-du-jour) change chaque jour, et le [catalogue de vannes](/vannes) range le reste par situation.

Chaque fin d'année, ton téléphone reçoit les mêmes phrases : « bonne année, bonne santé », avec un feu d'artifice en pièce jointe. Tu les renvoies, parce qu'à minuit personne n'a le temps d'en inventer d'autres.

Un vœu drôle coûte à peine plus cher à écrire : quelques lignes et une chute, et il sort de la pile. Encore faut-il qu'il tombe juste, parce que le texte qui fait rire ton groupe d'amis ne s'envoie pas à ton patron.
```
Pourquoi : l'En bref annonce les destinataires, le sommaire les donne en lien, c'est la suite logique. Il tombe alors après environ 60 mots, contre environ 155 aujourd'hui (le même seuil que l'étalon après son C1). La dernière phrase du 2e paragraphe, supprimée ici, répétait l'En bref presque mot pour mot (« classés par destinataire, prêts à copier », « le moment »). « Deux phrases » devient « quelques lignes » (voir D1). Les 5 ancres ne changent pas : elles sont vérifiées contre `headingId` (`œ` devient `oe`, les accents tombent).

### D3. Bloc « À retenir » supprimé (critères 1 et 5)

**Avant** (l.50, et la ligne vide qui le précède) :
```md
> **À retenir :** Un vœu drôle se joue en deux phrases : le vœu, puis une chute qui retombe sur toi. Adapte-le au destinataire, et si tu hésites, supprime la chute et garde le vœu.
```
**Après** : rien (la liste en 3 points est directement suivie du `---`).
Pourquoi : chacune de ses trois idées est déjà dite ailleurs : « deux phrases » (fausse, voir D1), « retombe sur toi » (En bref et règle 1) et « supprime la chute » (intro patron, l.85). L'idée « le rire tombe sur toi » revient 7 fois dans la page. Pour la reprise par les moteurs IA, l'En bref suffit (il joue le rôle du bloc Définition de l'étalon). Le 1er message arrive ainsi environ 40 mots plus tôt.

### D4. Règle 3 : tournure fautive (critère 5)

**Avant** (l.48) :
```md
3. **Un détail vrai vaut mieux qu'une formule.** Remplace un mot par quelque chose qui n'appartient qu'à vous (la galette, le plat, le nom du groupe). C'est ce qui rend le message à toi.
```
**Après** :
```md
3. **Un détail vrai vaut mieux qu'une formule.** Remplace un mot par quelque chose qui n'appartient qu'à vous (la galette, le plat, le nom du groupe). C'est ce qui en fait ton message.
```
Pourquoi : « rendre le message à toi » veut dire « te le restituer ». Ce n'est pas le sens voulu.

### D5. Indication de la n°3 : plus de reprise mot pour mot de la règle 3 (critère 5)

**Avant** (l.65) :
```md
*→ Pour le collègue du bureau d'à côté, en message direct. Remplace « fauteuil » par l'objet qui te lâche vraiment : un détail vrai fait rire plus qu'une formule.*
```
**Après** :
```md
*→ Pour le collègue du bureau d'à côté, en message direct. Remplace « fauteuil » par l'objet qui te lâche vraiment, et garde « un peu plus bas » pour la fin.*
```
Pourquoi : « un détail vrai fait rire plus qu'une formule » répète la règle 3, lue 17 lignes plus haut. La nouvelle consigne est propre à ce message : la chute reste en dernier, même si on change l'objet.

### D6. Indication de la n°6 : le moment contredisait la chute (critère 5)

**Avant** (l.74) :
```md
*→ Pour le premier jour de reprise, à l'équipe ou à voix haute au retour de congés. Envoie-le tôt dans la matinée, avant que les premiers dossiers n'arrivent.*
```
**Après** :
```md
*→ Pour le premier jour de reprise, à l'équipe ou à voix haute au retour de congés. Envoie-le en fin de matinée, quand tu as vraiment fait le tour des bureaux.*
```
Pourquoi : le message dit « J'ai déjà souhaité la bonne année trois fois à la même personne ce matin ». Envoyé « tôt », avant d'avoir croisé qui que ce soit, la chute est fausse. Les n°11, 22 et 23 posent la même condition de vérité.

### D7. Indication de la n°10 : la chute vise le destinataire, on la sort de la carte à la direction (critère 6)

**Avant** (l.94) :
```md
*→ Pour une carte ou un mail formel à la direction, au vouvoiement. Garde l'ouverture classique et glisse la phrase juste avant la signature. Remplace « mars » par le mois de son dernier mot.*
```
**Après** :
```md
*→ Pour ton manager direct, s'il plaisante déjà de ses réponses en deux lettres. Ici, la chute le vise un peu : à une direction que tu connais peu, prends plutôt la n°8 ou la n°9. Remplace « mars » par le mois de son dernier mot.*
```
Pourquoi : « J'ai gardé votre "OK" de mars. C'est mon entretien annuel. » se moque du laconisme du destinataire. C'est la seule entorse à la règle 1 (« jamais sur le destinataire »), et l'indication actuelle l'envoie au destinataire le plus risqué, en carte formelle. L'article promettait des « vœux drôles qui ne vexent personne ». La nouvelle indication garde le message et la promesse : elle nomme l'exception et oriente vers les n°8 et 9, qui portent sur l'expéditeur.

### D8. Section WhatsApp : la sortie passe après les messages (critère 2)

**Avant** (l.137, fin du paragraphe d'intro) :
```md
À minuit, le groupe reçoit beaucoup de messages identiques : le tien doit faire sourire en une ligne. Pour un ami perdu de vue, c'est l'inverse : un message privé, une fois par an, qui donne envie de répondre sans y obliger. Pour la suite de la conversation, [les phrases drôles pour une conversation](/blog/phrases-droles-conversations) prennent le relais.
```
**Après** :
```md
À minuit, le groupe reçoit beaucoup de messages identiques : le tien doit faire sourire en une ligne. Pour un ami perdu de vue, c'est l'inverse : un message privé, une fois par an, qui donne envie de répondre sans y obliger.
```
**Avant** (l.154) :
```md
Pour la soirée qui précède le message : [les vannes de soirée](/vannes/theme/soirees).
```
**Après** :
```md
S'il répond, la suite se joue ici : [les phrases drôles pour une conversation](/blog/phrases-droles-conversations). Et pour la soirée qui précède le message : [les vannes de soirée](/vannes/theme/soirees).
```
Pourquoi : la sortie la plus attirante de la section était placée avant les 5 messages et ouvrait une 2e page sans qu'ils aient été lus. En fin de section, elle répond au besoin suivant (« il m'a répondu, je dis quoi ? »), comme les sorties de l'étalon. Les cibles et le libellé du lien ne changent pas.

### D9. Fin d'article : « timing avant l'envoi » (critère 5)

**Avant** (l.203) :
```md
→ **[Nos conseils d'humour](/conseils)** : de quoi améliorer ton timing avant l'envoi.
```
**Après** :
```md
→ **[Nos conseils d'humour](/conseils)** : pour écrire tes propres chutes l'an prochain.
```
Pourquoi : un message écrit n'a pas de timing de diction. L'idée « l'an prochain, c'est toi qui écris » prépare le CTA de D10 sans promettre plus que ce que `/conseils` contient (des techniques, en libre accès).

### D10. CTA dédié, placé juste après le corps (critère 3)

Fichier : `apps/web/src/config/blog-cta.ts`. **Avant** (l.22 à l.23) :
```ts
  },
};
```
**Après** :
```ts
  },
  // Notation A2 iter1 (D10) : visiteur venu chercher un message à envoyer, pas un programme.
  "voeux-drole-nouvelle-annee": {
    title: "Ton message est choisi. Le reste de l'année, c'est toi qui écris.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi trouver tes propres chutes d'ici l'an prochain.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les messages de cette page restent en accès libre, compte ou pas.",
  },
};
```
Pourquoi : sans entrée, `page.tsx` (l.267 et suivantes) place le CTA par défaut en bas, après la FAQ, le cluster, les cartes et l'encart parcours. Son titre « Maintenant, reste à le dire à voix haute » parle d'oral alors que le lecteur vient d'envoyer un texte. Avec l'entrée, le gabarit le place juste après le corps, sans autre changement de code. La promesse et la note reprennent mot pour mot la formulation validée pour l'étalon ([CHOIX UTILISATEUR] du 04/10 : « ton contenu quotidien et la première étape de chaque parcours ») : elles sont vraies, puisque l'article ne bloque rien. Aucun tiret cadratin, aucun chiffre. L'attribution `src=blog-voeux-drole-nouvelle-annee` est déjà en place (l.184).

### D11. Bouton « Envoyer le message » sur chaque message, texte seul (critères 4 et 8)

Le partage de l'étalon envoie la vanne avec l'URL de l'article. Pour un vœu, c'est rédhibitoire : le patron recevrait « …C'est mon entretien annuel. https://deviens-marrant.fr/blog/voeux-drole-nouvelle-annee#vanne-10 ». A2 a besoin du même emplacement de 44 px, mais en envoi du texte seul.

Fichier : `apps/web/src/components/ui/markdown-renderer.tsx`. **Avant** (l.29 et l.30) :
```ts
/** Vanne numérotée d'un article : « **12.** « … » » en début de bloc. */
const JOKE_RE = /^\*\*(\d+)\.\*\* («[^\n]+»)/;
```
**Après** :
```ts
/** Vanne ou message numéroté : « **12.** « … » » ou « **12.** texte » en début de bloc (1re ligne seule). */
const JOKE_RE = /^\*\*(\d+)\.\*\* («[^\n]+»|[^\n]+)/;
```
Fichier : `apps/web/src/components/ui/share-button.tsx`. **Avant** (l.17 et l.18) :
```ts
  onShared?: (channel: ShareChannel) => void;
}
```
**Après** :
```ts
  onShared?: (channel: ShareChannel) => void;
  /** Texte seul, sans titre ni lien : message à envoyer tel quel (vœux). */
  textOnly?: boolean;
}
```
**Avant** (l.20) :
```ts
export function ShareButton({ title, text, className, url, label = "Partager", onShared }: ShareButtonProps) {
```
**Après** :
```ts
export function ShareButton({ title, text, className, url, label = "Partager", onShared, textOnly = false }: ShareButtonProps) {
```
**Avant** (l.26 à l.30) :
```ts
    const shareData = {
      title,
      text,
      url: url ?? window.location.href,
    };
```
**Après** :
```ts
    const shareData: ShareData = textOnly ? { text } : { title, text, url: url ?? window.location.href };
```
**Avant** (l.41) :
```ts
        await navigator.clipboard.writeText(`${text}\n\n${url ?? "deviens-marrant.fr"}`);
```
**Après** :
```ts
        await navigator.clipboard.writeText(textOnly ? text : `${text}\n\n${url ?? "deviens-marrant.fr"}`);
```
Fichier : `apps/web/src/components/blog/blog-vanne-share.tsx`. **Avant** (l.8 à l.10) :
```tsx
interface BlogVanneShareProps {
  slug: string;
}
```
**Après** :
```tsx
interface BlogVanneShareProps {
  slug: string;
  /** Messages à envoyer tels quels : texte seul, sans lien ni nom du site. */
  textOnly?: boolean;
}
```
**Avant** (l.26) : `export function BlogVanneShare({ slug }: BlogVanneShareProps) {`
**Après** : `export function BlogVanneShare({ slug, textOnly = false }: BlogVanneShareProps) {`
**Avant** (l.44) :
```tsx
            label={`Partager la vanne n°${vanne}`}
```
**Après** :
```tsx
            label={textOnly ? `Envoyer le message n°${vanne}` : `Partager la vanne n°${vanne}`}
            textOnly={textOnly}
```
Fichier : `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`. **Avant** (l.34 et l.35) :
```ts
/** Articles dont chaque vanne numérotée reçoit un bouton Partager (notation iter1, C7). */
const SHARE_JOKES_SLUGS = new Set(["meilleures-blagues-droles-2026"]);
```
**Après** :
```ts
/** Articles dont chaque vanne numérotée reçoit un bouton Partager (notation iter1, C7). */
const SHARE_JOKES_SLUGS = new Set(["meilleures-blagues-droles-2026", "voeux-drole-nouvelle-annee"]);
/** Messages à envoyer tels quels : partage du texte seul, sans URL (notation A2 iter1, D11). */
const TEXT_ONLY_SHARE_SLUGS = new Set(["voeux-drole-nouvelle-annee"]);
```
**Avant** (l.263) :
```tsx
        {shareJokes && <BlogVanneShare slug={article.slug} />}
```
**Après** :
```tsx
        {shareJokes && <BlogVanneShare slug={article.slug} textOnly={TEXT_ONLY_SHARE_SLUGS.has(article.slug)} />}
```
Pourquoi : c'est l'usage n°1 du persona, que l'excerpt promet (« Chaque message se copie tel quel »). Sur mobile, le partage natif ouvre WhatsApp ou SMS avec le message seul ; sur desktop, le message est copié seul. Aucune hauteur n'est ajoutée : c'est l'emplacement flottant de l'étalon. La mesure suit avec `blog-vanne-partage {slug, vanne, canal}`, sans nouvel événement. `data-text` ne prend que la 1re ligne du bloc, c'est-à-dire le message sans son indication. Pour l'étalon, rien ne change : ses 50 vannes commencent par « et matchent la 1re alternative comme avant ; son partage garde l'URL (`textOnly` faux). Contrepartie assumée : sans lien, le partage d'A2 ne ramène pas de visiteur. On préfère la valeur pour le persona.
Tests : le test s14 l.155 doit rester à 50 `data-share-vanne`. En ajouter un : `renderMarkdown(<content A2>, { shareJokes: true })` contient 27 `data-share-vanne`, et le `data-text` de la n°1 vaut exactement « Bonne année à toute l'équipe. À toutes les questions que vous m'avez posées sans réponse l'an dernier : oui. » (apostrophes échappées comprises). Dans un test `share-button`, `textOnly` appelle `navigator.share({ text })` et copie `text` seul.

### Récapitulatif

| # | Critère(s) | Fichier | Lignes de contenu touchées |
|---|---|---|---|
| D1 | 1, 5, 7 | brouillon A2 l.32 | 1 (3 mots) |
| D2 | 1, 5 | brouillon A2 l.34-38 | 1 déplacée, 1 phrase supprimée, 1 mot changé |
| D3 | 1, 5 | brouillon A2 l.50 | 1 supprimée |
| D4 | 5 | brouillon A2 l.48 | 1 (4 mots) |
| D5 | 5 | brouillon A2 l.65 (indication n°3) | 1 |
| D6 | 5 | brouillon A2 l.74 (indication n°6) | 1 |
| D7 | 6 | brouillon A2 l.94 (indication n°10) | 1 |
| D8 | 2 | brouillon A2 l.137 et l.154 | 2 |
| D9 | 5 | brouillon A2 l.203 | 1 |
| D10 | 3 | config/blog-cta.ts | config (7 lignes) |
| D11 | 4, 8 | markdown-renderer.tsx, share-button.tsx, blog-vanne-share.tsx, page.tsx | code (environ 12 lignes) |

Diff réel attendu (P0 s11) : environ 10 lignes de contenu sur environ 190, soit 0 sur les intouchables (27 messages, slug, title, meta, H2, questions de FAQ). Ce n'est pas une réécriture. D1 à D9 se font dans le brouillon AVANT le dry-run d'import. D10 et D11 passent en un seul déploiement, documenté dans `REPLIT_ACTIONS.md`, avec le pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`.

Notes projetées après application : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.

## 4. Contrôles demandés

### SEO

| Point | Valeur | Verdict |
|---|---|---|
| Title ≤ 60 car. avec la requête | « Vœux drôles nouvelle année : messages prêts à envoyer », 53 car. Avec le suffixe (21 car.), on arriverait à 74 > 60 : `fitTitle` le rend donc en `absolute` (titre seul, égal au H1). La requête est en tête (« œ » et « oe » sont traités de la même façon par les moteurs). | PASS |
| Meta ≤ 155 car. | 144 car. comptés (le brouillon annonce 143), servie par `metaDescription` (page.tsx l.62) et non par l'excerpt de 211 car. Vérifier à l'import que `metaDescription` est bien renseigné, sinon `fitDescription` couperait l'excerpt à 160. | PASS sous réserve |
| H2 en question | 7 sur 7, plus 4 questions de FAQ. La FAQ, dernière H2, sans markdown dans les réponses, est donc extraite en FAQPage par `splitTrailingFaq`. | PASS |
| Intention servie dès l'intro | L'En bref donne la règle et la promesse, mais sans la requête, et le sommaire n'arrive qu'en 4e bloc. | PASS après D1 et D2 |
| Fraîcheur | Publication le 12/11 pour une fenêtre d'usage du 20/12 au 15/01 [HYPOTHÈSE growth, à confirmer en Search Console] : environ 5 semaines d'indexation. | PASS |

Vérification externe de « jusqu'à fin janvier » (FAQ 2, adaptation 3, n°13) : l'usage français est bien le 31 janvier ; certaines sources jugent « négligé » un envoi après le 25. Les n°13 et 14 l'assument déjà (« assume ton retard »). Rien à changer.

### Variété des ressorts (27 messages)

| Ressort | Messages | Nb |
|---|---|---|
| Aveu ou autodérision | 8, 9, 11, 14, 17, 18, 19, 27 | 8 |
| Observation du quotidien numérique (groupe, répertoire, réseau) | 5, 20, 22, 23 | 4 |
| Retournement de formule ou sens littéral | 1, 4, 13 | 3 |
| Objet personnifié | 3, 7 | 2 |
| Compliment ou merci déguisé | 2, 15, 16 | 3 |
| Absurde ou anecdote | 6, 21, 24 | 3 |
| Paradoxe | 12, 26 | 2 |
| Comparaison chiffrée | 25 | 1 |
| Ironie sur le destinataire | 10 | 1 (voir D7) |

9 ressorts différents, et aucun ne dépasse 8 messages sur 27. Aucune section n'utilise un seul ressort. Un seul quasi-doublon : les n°22 et 23 jouent toutes deux sur le silence du groupe, et elles se suivent. Je ne retire rien : elles ont été validées à l'aveugle et chacune a sa condition de vérité (historique, « en train d'écrire »). Si Thomas veut aérer, il peut placer la n°21 entre les deux (voir §6). Constat sans correctif possible : 24 messages sur 27 s'ouvrent par « Bonne année » (c'est le genre qui le veut, et le texte est intouchable).

### Cannibalisation avec S11 et S13

| Article | Requête | Title | H2 | Recouvrement avec A2 |
|---|---|---|---|---|
| S11 | jeux de répartie | Nouvel An : 6 jeux de répartie pour une soirée drôle | 6 H2 sur les jeux, leurs règles, l'enchaînement, l'entraînement | Aucun : animation orale du 31, zéro message écrit. Le seul « message » de S11 est un exemple de jeu (l.69). |
| S13 | résolution être plus drôle | Résolution 2027 : être plus drôle sans pression | 7 H2 sur la résolution, l'habitude, les 4 semaines, la mesure | Aucun : méthode d'habitude. Le seul point commun est l'habitude n°5 de S13 (« envoyer à un ami un message drôle », l.72), une ligne qui renvoie naturellement vers A2. |

« vœux », « jeux » et « résolution » ne se croisent dans aucun title, aucune meta ni aucun H2. A2 ne cite la répartie qu'une fois (FAQ 4, « c'est de la répartie simple »), sans méthode. Verdict : PASS. Les liens croisés prévus (l.7 du brouillon) sont à poser à la publication de S11 (14/12) et de S13 (28/12). Ils ne comptent pas dans la note : les cibles n'existent pas au 12/11.

## 5. Ne comptent pas contre le 10

- **« Blague du jour » 3 fois** (sommaire, « Tu as fait le tour ? », flèche finale) : même structure que l'étalon noté 10, avec 3 formulations différentes.
- **Sommaire en ligne et non en puces** : choix de l'étalon, conditionné aux données `blog-ancre-clic` à 30 jours.
- **« Remplace « X » par » dans 8 indications** : c'est une consigne fonctionnelle (adapter le message), pas un tic. La reformuler 8 fois nuirait à la clarté.

## 6. Décisions pour Thomas (hors note)

- **D11 sans lien** : le partage d'A2 ne ramène pas de visiteur, alors que celui de l'étalon en ramène. Par défaut, je garde le texte seul (on ne grille pas l'expéditeur auprès de son patron). Tu peux trancher autrement.
- **Ordre 21, 22, 23** : on peut passer à 22, 21, 23 pour séparer les deux « silence du groupe ». C'est un déplacement autorisé, sans effet sur la note, et la numérotation suivrait.
- **Bouton « Tout débloquer à 2,99 €/mois »** dans le CTA : même décision que pour l'étalon (on le garde, puis on lit `blog-cta-clic {bouton: premium}` à 30 jours).
- **Rendu** : une itération 2 sur captures 390 px et desktop après le dry-run d'import est nécessaire avant de déclarer le 10/10 « vu ». Cette notation porte sur le texte et le code, pas sur le rendu.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A2-iter1.md
- Décisions prises : note 8,3/10 (66/80) ; 11 correctifs exacts (D1 à D11) pour 10/10 sans toucher aux 27 messages, au slug, au title, à la meta, aux H2 ni aux questions de FAQ ; SEO PASS (title 53, meta 144, 7 H2 en question) ; variété PASS (9 ressorts) ; cannibalisation S11/S13 PASS.
- Points d'attention : @copywriter (ou édition mineure) applique D1 à D9 dans le brouillon avant le dry-run d'import ; @fullstack applique D10 et D11 et ajoute les tests (27 `data-share-vanne` pour A2, 50 inchangés pour l'étalon, `textOnly` dans share-button), puis les documente dans `REPLIT_ACTIONS.md` ; vérifier que `metaDescription` est bien renseigné à l'import ; captures 390 px et desktop après l'import pour une itération 2.
---
