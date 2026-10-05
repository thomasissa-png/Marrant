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
