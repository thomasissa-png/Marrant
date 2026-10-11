# Notation : A1 /blog/message-anniversaire-drole-par-situation (itération 2, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md` (numéros de ligne ci-dessous = ce fichier), `config/blog-cta.ts`, `config/blog-forte-frappe.ts`, `components/ui/markdown-renderer.tsx` (l.35 `JOKE_RE`), `components/blog/blog-vanne-share.tsx`, `blog/[slug]/page.tsx` (l.56, l.60, l.181-186, l.264-268), `scripts/content/import-article.ts` et `article-markdown.ts`, `config/premium.ts` l.65-67, test `markdown-renderer-forte-frappe.test.ts`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Gabarit commun : 10/10 (`notation-article-blagues-2026-iter4.md`).
> Intouchables respectés par tous les correctifs : texte des 21 messages (aucun caractère touché), zéro tiret cadratin (Grep `—|–` : 0), aucun humoriste, slug, title, H2.
> Limites : article programmé (isPublished=false), donc aucune capture du rendu ; tests non exécutés ; pas de git (consigne).

## 1. Vérification des 11 correctifs de l'itération 1

| # | Correctif | Où | Verdict |
|---|---|---|---|
| C1 | Sommaire en 2e paragraphe, « Choisis à qui tu écris » | l.45, avant le paragraphe l.47 | PASS |
| C2 | H2 pote sans « le matin » | l.51 ; ancre l.45 à jour | PASS |
| C3 | Règle des potes sans « sauf de l'avoir oublié » | l.53 | PASS (voir D4 : la liste annonce une n°2 qui n'existe pas) |
| C4 | 5 indications d'usage (n°2, 3, 9, 11, 21) | l.59, 62, 88, 102, 148 | PASS, mot pour mot |
| C5 | Fin de section 5 : Confiance exact, autodérision retirée | l.150 ; « 20 min/semaine » = `premium.ts` l.67 | PASS |
| C6 | Règle 4 sans 2e lien timing | l.166 | PASS |
| C7 | Fin d'article sans « ne change pas » | l.172 | PASS |
| C8 | Meta avec « 21 » et « copier-coller » | l.11, 146 car. ; `page.tsx` l.60 lit `metaDescription` en priorité | PASS (par le champ `metaDescription` de l'import, pas par l'excerpt comme prévu à l'itération 1) |
| C9 | FAQ en `faqs` et JSON-LD FAQPage | l.184-200 ; `splitTrailingFaq` (`page.tsx` l.56) l'enlève du corps, donc pas d'affichage en double et 6 H2 sur 6 en question (test l.30) | PASS |
| C10 | CTA dédié juste après le corps | `blog-cta.ts` l.24-29 ; `page.tsx` l.268 | PASS |
| C11 | Bouton sur chaque message | `blog-forte-frappe.ts` l.17 (`text-only`, « Envoyer le message n°N », sans URL) ; `JOKE_RE` l.35 ; test : 21 emplacements, texte sans indication | PASS |

Les 11 correctifs sont appliqués. L'encart parcours imposé (Répartie, `blog-forte-frappe.ts` l.50) complète le corps (Machine à Café l.90, Confiance l.150) sans doublon.

## 2. Grille et notes

| # | Critère | Iter1 | Iter2 | Justification (1 ligne) |
|---|---|---|---|---|
| 1 | Réponse immédiate à l'intention | 9 | **10** | « En bref », 1 paragraphe, puis le sommaire à 6 ancres, à environ 90 mots du haut. |
| 2 | Sorties vers une 2e page | 9 | **10** | Une sortie par section, plus aucun doublon dans le corps, les 3 parcours répartis (corps x2, encart x1). |
| 3 | CTA d'inscription | 6 | **10** | Après le corps, promesse propre (l'oral), note vraie (article public). |
| 4 | Lisibilité mobile et structure | 8 | **10** | Bouton Envoyer en texte seul sur les 21, FAQ retirée du corps, format étalon. |
| 5 | Ton Marrant des textes affichés | 7 | **8** | La page affirme 4 fois que les messages tiennent en « une ou deux phrases » alors que 17 sur 21 en ont 3 ou 4, et deux réponses de la FAQ disent de finir sur une phrase sincère, contre 5 indications qui demandent de finir sur la chute. Plus 3 détails de formulation. |
| 6 | Conformité | 9 | **10** | Zéro tiret cadratin, zéro humoriste, durées des parcours exactes, promesses vraies. |
| 7 | Sécurité SEO | 7 | **9** | Meta, FAQPage et H2 OK ; le mot-clé secondaire déclaré « message anniversaire drôle collègue » n'apparaît pas dans la section bureau (« collègue » seulement dans le sommaire et la meta). |
| 8 | Mesure | 9 | **10** | `blog-vanne-partage` sur les 21 messages, plus le reste hérité du gabarit (paliers, ancres, `src=`). |

**Note globale : 9,6/10** (77/80, contre 64/80 à l'itération 1).
**Après les 6 correctifs ci-dessous : 10/10 sur les 8 critères.**

L'itération 1 a manqué D1 et D2 : elle relisait chaque message face à son indication, pas les phrases générales de la page face aux 21 messages.

## 3. Top 3

1. **D1 (« une ou deux phrases »)** : une promesse fausse, lue dès le bloc « En bref », la carte du blog et le paragraphe qui précède le n°1. Le lecteur la vérifie tout de suite : le n°1 a 3 phrases.
2. **D2 (FAQ contre indications)** : la FAQ dit « une phrase vraie pour finir », le n°1 dit « la dernière phrase doit rester la dernière chose lue ». Suivre l'une, c'est désobéir à l'autre.
3. **D6 (collègue)** : la seule requête secondaire du brief qui n'a pas de texte en face d'elle.

## 4. Correctifs exacts

Fichier : `docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md`. Aucun correctif ne touche le texte d'un des 21 messages, un H2 ou le slug.

### D1. « Une ou deux phrases » : 4 phrases fausses (critère 5)

Décompte : seuls les n°2, 8, 11 et 15 tiennent en 2 phrases. Les 17 autres en ont 3 ou 4 (n°1 : 3, n°3 : 4, n°5 : 4, n°20 : 4, n°21 : 4…), même sans compter « Joyeux anniversaire ». Ce qui reste vrai partout : un message court, une seule chute (règle 2, l.162).

| Ligne | Avant | Après |
|---|---|---|
| l.41 (En bref) | `Un message d'anniversaire drôle tient en une ou deux phrases, fait rire sur toi` | `Un message d'anniversaire drôle est court, n'a qu'une chute, fait rire sur toi` (suite de la phrase inchangée) |
| l.47 | `Chaque message tient en une ou deux phrases. Après chacun, une ligne en italique te dit où et quand l'envoyer. Il te reste à changer le prénom et, si tu en as un, à ajouter un détail que toi seul connais.` | `Chaque message est court et n'a qu'une chute. Après chacun, une ligne en italique te dit où et quand l'envoyer. Il te reste à mettre le prénom là où il manque et, si tu en as un, à ajouter un détail que toi seul connais.` |
| l.12 (excerpt, carte du blog : `blog/page.tsx` l.66) | `Un message d'anniversaire drôle, c'est une ou deux phrases, un rire qui tombe sur toi et un bon moment pour l'envoyer. Voici 21 textes à copier-coller selon la personne (pote, collègue, parent, frère ou sœur, ami perdu de vue), avec le support conseillé pour chacun : WhatsApp, carte ou mot au gâteau.` | `Un message d'anniversaire drôle, c'est quelques phrases courtes, un rire qui tombe sur toi et un bon moment pour l'envoyer. Voici 21 textes à copier-coller selon la personne (pote, collègue, parent, frère ou sœur, ami perdu de vue), avec le support conseillé pour chacun : WhatsApp, carte ou mot dit au moment du gâteau.` |
| l.136 | `Dans les deux cas, une seule phrase suffit : tu reconnais le retard,` | `Dans les deux cas, un message court suffit : tu reconnais le retard,` (suite inchangée) |

Pourquoi l.47 « là où il manque » : seuls les n°3, 14 et 20 ont un « [prénom] ». « Changer le prénom » laissait croire qu'il y en a un dans chaque message. « Mot au gâteau » (excerpt) est un terme de travail, pas une tournure qu'un lecteur emploie.

### D2. FAQ 1 et 4 : la chute garde le dernier mot (critère 5)

Contradiction : FAQ 4 (l.200) « une phrase drôle pour ouvrir, une phrase vraie pour finir » et FAQ 1 (l.188) « Une phrase drôle suivie d'une phrase sincère » contre n°1 (l.56) « la dernière phrase doit rester la dernière chose lue », n°16 (l.125) « après ta phrase de vœux », n°11 (l.102) « au-dessus de ta signature », n°18 (l.139) « seul, sans enchaîner », règle 4 (l.166).

**FAQ 1, dernière phrase. Avant** :
```md
Une phrase drôle suivie d'une phrase sincère passe presque toujours mieux qu'un message uniquement moqueur.
```
**Après** :
```md
Ajoute aussi une phrase sincère, à sa place : avant la blague sur une carte, dans un second message sur WhatsApp. Les deux ensemble passent presque toujours mieux qu'un message uniquement moqueur.
```
**FAQ 4, 1re phrase. Avant** :
```md
Les deux, dans cet ordre : une phrase drôle pour ouvrir, une phrase vraie pour finir.
```
**Après** :
```md
Les deux, sans que la phrase vraie écrase la chute. Sur WhatsApp, envoie le message drôle seul, puis la phrase sincère quand la personne a répondu. Sur une carte, écris tes vœux d'abord et garde la blague pour la fin ou pour le P.-S.
```
La suite de la FAQ 4 (« Le rire installe la complicité… ») ne change pas. Réponses en texte brut, sans lien ni gras : format accepté par `validateArticle` (`article-markdown.ts` l.204-207), JSON-LD mis à jour par l'import.

### D3. Indication du n°4 (critère 5)

**Avant** (l.65) : `*→ En mot au gâteau, dit à voix haute au moment des bougies. Lis-le lentement et fais une pause avant la dernière phrase.*`
**Après** : `*→ À voix haute, au moment des bougies. Dis-le lentement et fais une pause avant la dernière phrase.*`
Pourquoi : « au gâteau » et « au moment des bougies » disent deux fois la même chose ; « Lis-le » contredit le message (« Je garde la version courte » se dit, ne se lit pas), et le n°13 dit déjà « Dis-le lentement ». Le texte partagé exclut l'indication (`shareText`), le bouton ne change pas.

### D4. Liste de la section pote (critère 5)

**Avant** (l.53) : `La seule règle, c'est que le rire reste à ta charge : ta mémoire, ta flemme, tes photos ratées.`
**Après** : `La seule règle, c'est que le rire reste à ta charge : tes photos ratées, ta flemme, tes vocaux trop longs.`
Pourquoi : aucun message pote ne parle de mémoire. La nouvelle liste annonce les n°1 (photo), n°3 (copier faute d'idée) et n°2 (le vocal qu'on n'écoute pas jusqu'au bout), dans l'ordre de lecture ou presque.

### D5. « Un autre format que l'anniversaire » (critère 5)

**Avant** (l.168) : `Si tu cherches un autre format que l'anniversaire, [les 50 blagues drôles par situation](/blog/meilleures-blagues-droles-2026) couvrent la soirée, le bureau, les dates et la famille.`
**Après** : `Pour une autre occasion que l'anniversaire, [les 50 blagues drôles par situation](/blog/meilleures-blagues-droles-2026) couvrent la soirée, le bureau, les dates et la famille.`
Pourquoi : l'anniversaire est une occasion, pas un format. Lien et ancre inchangés.

### D6. « Collègue » dans la section bureau (critère 7)

**Avant** (l.73) : `Une carte de bureau passe de main en main : tout le monde la lit, y compris ta direction.`
**Après** : `La carte d'anniversaire d'un collègue passe de main en main : tout le monde la lit, y compris ta direction.`
Pourquoi : la requête secondaire « message anniversaire drôle collègue » (l.14) n'a aujourd'hui que le libellé du sommaire et la meta. La phrase porte aussi « carte d'anniversaire », 2e requête secondaire. H2 et ancre inchangés.

### Application et diff réel (P0 s11)

Édition du fichier A1, puis depuis `apps/web` : `npx tsx scripts/content/import-article.ts ../../docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md --update` (dry-run : attendre `excerpt` et `content` modifiés, `metaDescription` et `title` inchangés, FAQ : 4), puis la même commande avec `--write`. Diff attendu : 10 lignes sur environ 200 (l.12, 41, 47, 53, 65, 73, 136, 168, 188, 200), 0 ligne de code, 0 caractère dans les 21 messages. Tests : aucun à modifier (Grep des phrases remplacées dans `apps/web/src/__tests__` : 0 ; `markdown-renderer-forte-frappe.test.ts` garde 21 emplacements, 6 H2, 1er texte identique). Pas de déploiement : correction en base, `REPLIT_ACTIONS.md` non concerné.

## 5. Ne comptent pas contre le 10

- **Bouton « Envoyer » sur des lignes à dire à voix haute** (n°2, 4, 12, 13, 17) : il copie aussi le texte pour l'avoir sous les yeux pendant le vocal ou au gâteau (le n°12 se joue téléphone en main). L'indication juste dessous dit le support. Retirer ces 5 boutons demanderait une exception par numéro dans le code pour un gain incertain.
- **« [prénom] » envoyé tel quel** (n°3, 14, 20) : le partage ouvre la messagerie avec le texte modifiable, et la l.47 (D1) dit de mettre le prénom.
- **Hiérarchie citée 4 fois dans la section bureau** (l.73, n°5, n°7, n°8) : chaque mention porte une consigne différente.
- **Repris de l'itération 1** : deux ouvertures sur la photo (n°1, n°18), trois lignes « discours » (n°4, 12, 13), deux « P.-S. » (n°15, 16), « par situation » dans le title, « remonté » (n°20). Tous dans les intouchables ou sans gain mesurable.
- **Rendu non vu** : critères 1 et 4 notés sur le code et le gabarit (10/10 au rendu sur l'étalon). Captures 375/768/1280 à prendre au 22/10.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A1-iter2.md
- Décisions prises : les 11 correctifs de l'itération 1 sont appliqués (C8 et C9 par l'import, pas par le chemin prévu à l'itération 1) ; note 9,6/10 (77/80) ; 6 correctifs restants (D1 à D6), tous dans le fichier A1, sans toucher aux 21 messages, aux H2 ni au slug.
- Points d'attention : @copywriter applique D1 à D6, puis relance l'import avec `--update` (dry-run puis `--write`) avant le 22/10 ; captures 375/768/1280 au jour de la publication pour confirmer les critères 1 et 4.
---
