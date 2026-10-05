# Notation : /blog/premier-message-drole-appli-de-rencontre (A3, itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md` (FINAL du 05/10, numéros de ligne de ce fichier), gabarit à HEAD (`blog/[slug]/page.tsx`, `markdown-renderer.tsx`, `lib/blog-faq.ts`, `lib/blog-clusters.ts`, `config/blog-cta.ts`, `components/blog/article-cta.tsx`, `components/blog/blog-article-parcours-maillage.tsx`, `config/premium.ts`, `lib/seo-meta.ts`), étalon `meilleures-blagues-droles-2026` et notations iter1 et iter4.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, repris tels quels.
> Intouchables : texte des 17 messages validés à l'aveugle et des 3 vannes du catalogue, zéro tiret cadratin, zéro humoriste ni marque d'appli, aucune promesse fausse, « 1 500+ membres ».
> Limites : article pas encore importé, donc aucun rendu réel ni capture ; rendu déduit du code du renderer. Tests non exécutés, pas de git.

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **8/10** | L'« En bref » répond tout de suite, mais le sommaire n'arrive qu'au 6e bloc (environ 270 mots, 3e écran mobile), après un paragraphe qui envoie vers 4 autres articles avant le moindre exemple. |
| 2 | Sorties vers une 2e page | **7/10** | L'encart parcours automatique sera Machine à Café (bureau, 15 min) sur un article de drague par écrit ; `/vannes/theme/dating` est lié 3 fois, Confiance 2 fois dans le corps, la blague du jour 2 fois avec la même promesse, et le lien « soirées » de la l.146 ne mène pas à la suite d'une conversation. |
| 3 | CTA d'inscription | **6/10** | Slug absent de `config/blog-cta.ts` : CTA par défaut placé après la FAQ, les cartes et l'encart parcours (environ 4 écrans après le corps), avec le titre « Maintenant, reste à le dire à voix haute » sur un article consacré à l'écrit. |
| 4 | Lisibilité mobile et structure | **9/10** | Bonne structure (situation en gras, message, indication en italique), mais 5 messages imbriquent des « » dans des « » : la n°13 commence par « « Plus tard », et la n°2 finit par « ». » ; le lecteur croit que le message s'arrête trop tôt. |
| 5 | Ton Marrant des textes affichés | **8/10** | Voix juste et tutoiement tenu, mais « et le tien ? » (l.62) n'a pas de référent clair, « Pour une réponse facile, termine par » revient 2 fois (l.62, l.88), « ont leur étagère » 2 fois (l.104, l.178), « 20 minutes par semaine » 2 fois dans la même phrase (l.178), et la l.191 recopie mot pour mot la réponse de la FAQ 2 (l.231). |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, zéro marque, durées vraies (`premium.ts` l.66-67 : 20 min/semaine). Deux écarts de respect : la règle 2 (« jamais sur ce qu'elle a écrit », l.46) contredit la section bio, et la situation 14 fait dire « Aucune excuse nécessaire » à quelqu'un qui ne s'est peut-être pas excusé, ce qui sonne comme un reproche. |
| 7 | Sécurité SEO | **10/10** | Title de 54 caractères contenant la requête exacte, meta de 154 caractères, 6 H2 sur 6 en question, intention servie dans l'« En bref », FAQ extraite par `splitTrailingFaq` (dernière H2, aucune syntaxe markdown dans les réponses) donc rendue avec son JSON-LD FAQPage, 4 ancres du sommaire identiques à `headingId`, aucune cannibalisation (§4). |
| 8 | Mesure | **10/10** | `BlogArticleTracking` commun (scroll en 4 paliers, sortie et ancre séparées, CTA marqué, `?src=blog-<slug>`), slug déjà dans `config/blog-tracking.ts` l.11 (rapport hebdomadaire). |

**Note globale : 8,4/10** (67/80).
**Après les 11 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 2. Top 3 (impact le plus fort)

1. **C6 (CTA)** : critère le plus bas. Une entrée dans `config/blog-cta.ts` place le CTA juste après le corps, avec une promesse qui parle d'écrire et non de parler à voix haute.
2. **C2 (encart parcours)** : l'encart Machine à Café (« Sois drôle au bureau », 15 min) sous un article de drague par écrit est la sortie la plus visible et la plus mal ciblée. Confiance est le parcours que l'article cite.
3. **C1 (sommaire en 2e bloc)** : le lecteur qui arrive avec « quoi écrire » doit voir sa situation dans le premier ou le deuxième écran, pas après des liens vers d'autres articles.

## 3. Correctifs exacts

Fichier article (sauf mention contraire) : `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md`, à corriger AVANT l'import en base.

### C1. Sommaire juste sous l'« En bref », paragraphe de périmètre après les règles (critère 1)

Aucun mot ne change : seuls deux paragraphes changent de place.

**Avant** (ordre des blocs, l.32 à l.52) : En bref (l.32) · « Tu as ouvert la conversation… » (l.34) · vanne catalogue IA (l.36) · « Un premier message drôle n'est pas un numéro de scène… » (l.38) · « Cet article traite d'un seul cas… Ici, on reste sur l'écran. » (l.40) · « Va direct à ta situation… » (l.42) · les quatre règles (l.44-48) · « Un test avant d'envoyer… » (l.50) · `---` (l.52).

**Après** : En bref (l.32) · **« Va direct à ta situation… » (ancienne l.42)** · « Tu as ouvert la conversation… » (l.34) · vanne catalogue IA (l.36) · « Un premier message drôle n'est pas un numéro de scène… » (l.38) · les quatre règles (l.44-48) · « Un test avant d'envoyer… » (l.50) · **« Cet article traite d'un seul cas… Ici, on reste sur l'écran. » (ancienne l.40)** · `---`.

Pourquoi : l'« En bref » donne la méthode, le sommaire en est la suite logique et passe d'environ 270 à 75 mots (fin du 1er écran mobile, comme l'étalon après son C1). Le paragraphe de périmètre envoie vers 4 articles : placé avant le premier exemple, il fait sortir le lecteur avant qu'il ait reçu quoi que ce soit ; placé après les règles, il garde son rôle anti-cannibalisation et sa dernière phrase (« Ici, on reste sur l'écran. ») devient la transition vers la première section.

### C2. Encart parcours : Confiance au lieu de Machine à Café (critère 2)

Fichier : `apps/web/src/components/blog/blog-article-parcours-maillage.tsx`. A3 est en `CATALOGUE`, donc rattaché par défaut au cluster `fort-volume` (`blog-clusters.ts` l.89), qui affiche Machine à Café (l.115-126 : « Des blagues toutes faites à ta propre voix », « 15 min/semaine »).

**Avant** (l.141) :
```ts
const DEFAULT_HINT = PARCOURS_BY_CLUSTER["techniques-repartie"];
```
**Après** :
```ts
const DEFAULT_HINT = PARCOURS_BY_CLUSTER["techniques-repartie"];

/**
 * Encart choisi par slug, prioritaire sur le cluster, quand le sujet de l'article
 * ne correspond pas au parcours de son cluster. A3 (premier message sur appli) est
 * en CATALOGUE (cluster fort-volume, Machine à Café) mais parle d'oser écrire et
 * d'accepter un silence : parcours Confiance.
 */
const PARCOURS_BY_SLUG: Record<string, ParcoursHint> = {
  "premier-message-drole-appli-de-rencontre": PARCOURS_BY_CLUSTER["douleurs-personas"],
};
```
**Avant** (l.151) :
```ts
  const hint = (cluster && PARCOURS_BY_CLUSTER[cluster.id]) || DEFAULT_HINT;
```
**Après** :
```ts
  const hint = PARCOURS_BY_SLUG[articleSlug] ?? ((cluster && PARCOURS_BY_CLUSTER[cluster.id]) || DEFAULT_HINT);
```
Pourquoi : « Reprends confiance, une conversation à la fois » est exactement la promesse de l'article (oser envoyer, relancer une fois, accepter un silence). Le texte de l'encart Confiance existe déjà et sert ailleurs : aucune nouvelle copie. Aucun autre article ne change de parcours (un seul slug dans la table). Le gabarit `page.tsx` et le renderer ne sont pas touchés.

### C3. Sortie de fin de section « animal » : vers la conversation, pas vers les soirées (critères 2 et 5)

**Avant** (l.146) :
```md
Pour la suite de la conversation, [les vannes de soirées](/vannes/theme/soirees) rangent des lignes pour lancer un échange sans forcer.
```
**Après** :
```md
Pour garder le ton une fois l'échange lancé, [les phrases drôles pour la conversation](/blog/phrases-droles-conversations) prennent le relais, par message comme en face.
```
Pourquoi : le thème Soirées porte sur la fête, pas sur un échange écrit à deux. `phrases-droles-conversations` contient les sections « Phrases drôles pour un date » (`blog-articles.ts` l.1235) et « par WhatsApp et SMS » (l.1278) : c'est la suite exacte. Soirées reste lié dans la liste de fin (l.211).

### C4. Paragraphe de sortie de la section relance : 2 liens au lieu de 3, sans répétition (critères 2 et 5)

**Avant** (l.178) :
```md
Pour d'autres lignes sur le silence après « on se rappelle », [les vannes de dating](/vannes/theme/dating) ont leur étagère. Pour répondre du tac au tac sans y penser trois heures, le [parcours Répartie](/parcours/repartie) demande 20 minutes par semaine. Relancer une fois puis lâcher prise, accepter un silence sans le prendre pour un verdict : ça s'entraîne aussi, avec le [parcours Confiance](/parcours/confiance), 20 minutes par semaine.
```
**Après** :
```md
Pour répondre du tac au tac sans y penser trois heures, le [parcours Répartie](/parcours/repartie) demande 20 minutes par semaine. Relancer une fois puis lâcher prise, accepter un silence sans le prendre pour un verdict : ça s'entraîne aussi, au même rythme, avec le [parcours Confiance](/parcours/confiance).
```
Pourquoi : `/vannes/theme/dating` est déjà lié l.76 et l.208 (3e occurrence retirée) ; « ont leur étagère » est déjà employé l.104 ; « 20 minutes par semaine » apparaissait 2 fois dans la même phrase. Durée vraie (`premium.ts` l.66-67).

### C5. Bloc de fin : une seule promesse « blague du jour », pas de doublon avec les cartes et l'encart (critère 2)

**Avant** (l.205) :
```md
**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage.
```
**Après** :
```md
**Tu as fait le tour ?** [La blague du jour](/blague-du-jour) t'en garde une neuve pour demain, avec sa chute et son décryptage.
```
**Avant** (l.217 et l.221, avec la ligne vide qui précède chacune) :
```md
→ **[Phrases drôles pour la conversation](/blog/phrases-droles-conversations)** : de quoi continuer l'échange par WhatsApp ou SMS.

→ **[Le parcours Confiance](/parcours/confiance)** : 20 minutes par semaine pour oser écrire le premier message.
```
**Après** : les deux lignes sont supprimées (et leurs lignes vides). Le bloc de fin garde la blague du jour, les 4 thèmes, le quiz, l'étalon (l.215) et conseils/vidéos (l.219).

Pourquoi : l.42 dit déjà « qui change chaque jour » ; la nouvelle phrase dit autre chose (« pour demain »). `phrases-droles-conversations` est désormais lié au bon endroit (C3) et fait partie des cartes « À lire ensuite » du cluster `fort-volume`. Confiance est lié l.178 (C4) et devient l'encart parcours (C2) : une 3e mention serait de trop. Le nombre de pages liées reste 17.
