# Notation : A2 /blog/voeux-drole-nouvelle-annee (itération 3, finale, 05/10/2026)

> Revue @reviewer. Base : captures du rendu de production sur l'aperçu admin (`snap/voeux-drole-nouvelle-annee/` : `m00` à `m08` en 390 px, `d-haut` et `d-bas` en 1280 px, sans JavaScript), brouillon `docs/copy/articles-forte-frappe/A2-voeux-drole-nouvelle-annee.md` (numéros de ligne ci-dessous), `__tests__/ui/markdown-renderer-forte-frappe.test.ts` l.44-58.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Itération précédente : `notation-A2-iter2.md` (9,5/10).
> Boutons Partager absents des captures (ajoutés en JavaScript) : non compté. L'espace réservé à droite des 27 messages est visible, n°20 compris.
> Intouchables respectés par tous les correctifs : 27 messages (0 caractère touché), questions de FAQ, zéro tiret cadratin, aucun humoriste, aucune page thème touchée.

## 1. Correctifs de l'itération 2 : appliqués et visibles

| # | Correctif | Vu sur | Verdict |
|---|---|---|---|
| E1 | Ligne vide avant le n°20 | `m04` : n°20 détaché de l'intro WhatsApp, numéro en gras, retour à la ligne court à droite (emplacement Partager présent) | PASS |
| E2 | Test A2 : 27 emplacements, 7 H2 | test l.44-58, texte du n°20 vérifié l.55 | PASS (présent, non exécuté ici) |
| E3 | Point 1 « Remplace les détails d'exemple » | `m05` bas, `m06` haut | PASS |
| E4 | Point 3 « Vérifie le moment » | `m06` | PASS |

Rendu : sommaire dans le 1er écran mobile (`m00`), règles en liste numérotée, rythme message / indication régulier sur les 27, 7 puces thèmes en zone de tap pleine hauteur (`m06`), CTA juste après le corps (`m06`, `m07`), FAQ en cartes, encart Machine à Café en bas (`m08`). Desktop propre (`d-haut`, `d-bas`).

## 2. Grille et notes

| # | Critère | Iter2 | Iter3 | Justification (1 ligne) |
|---|---|---|---|---|
| 1 | Réponse immédiate à l'intention | 10 | **10** | En bref et sommaire des 5 destinataires dans le 1er écran mobile. |
| 2 | Sorties vers une 2e page | 10 | **10** | Une sortie par section, 7 puces, quiz, parcours, conseils, vidéos, encart. |
| 3 | CTA d'inscription | 10 | **10** | Après le corps, titre sur l'écrit, note vraie (`m06`, `m07`). |
| 4 | Lisibilité mobile et structure | 8 | **10** | E1 vu au rendu : plus aucun message collé. |
| 5 | Ton Marrant des textes affichés | 9 | **9** | E3 et E4 réglés, mais la blague du jour est promise 3 fois dans les mêmes termes (l.45, l.195, l.210), dont 2 dans le même bloc de fin (`m06`). |
| 6 | Conformité | 10 | **9** | La FAQ 3 répond « Oui, il marche tel quel », alors que le point 1 (E3) dit que 5 messages racontent « la vie de quelqu'un d'autre » si on ne change pas le détail ; cette réponse part aussi en JSON-LD. |
| 7 | Sécurité SEO | 10 | **9** | En-tête « 12 novembre 2026 · Mis à jour le 5 octobre 2026 » (`m00`) ; le 5 octobre partira en `dateModified`, `modifiedTime` et `lastmod`. |
| 8 | Mesure | 9 | **10** | Les 27 emplacements existent et sont verrouillés par test. |

**Note globale : 9,6/10** (77/80).
**Après les 3 correctifs ci-dessous : 10/10 sur les 8 critères.** Je ne vois pas d'autre amélioration concrète.

## 3. Correctifs exacts

### F1. « Mis à jour » antérieur à la publication (critère 7, commun aux 4 articles)

Correctif de code unique, détaillé dans `notation-A1-iter3.md` §3 F1 : fonction `publicUpdatedAt` dans `lib/blog-visibility.ts`, utilisée par `lib/blog-article-page.ts` l.77, `app/sitemap.ts` l.92 et `app/llms-full.txt/route.ts` l.126. À déployer avant le 22/10 (A1), donc bien avant le 12/11.

### F2. FAQ 3 alignée sur le point 1 (critère 6)

**Avant** (l.228) :
```md
Oui, il marche tel quel. Change quand même un mot pour y mettre un détail à toi : un prénom, le plat du réveillon, le nom du groupe. Et évite d'envoyer le même texte à tout ton répertoire : on le reconnaît vite, et il perd sa drôlerie dès la deuxième lecture.
```
**Après** :
```md
Oui, pour la plupart. Ceux qui citent un détail d'exemple (un fauteuil, un prénom, un mois) demandent le tien : l'indication sous le message dit lequel. Pour les autres, change quand même un mot pour y mettre un détail à toi, comme le plat du réveillon ou le nom du groupe. Et évite d'envoyer le même texte à tout ton répertoire : on le reconnaît vite, et il perd sa drôlerie dès la deuxième lecture.
```
Pourquoi : les n°3 (fauteuil), 5 (« compta ? »), 10 (mars), 18 (Biscotte) et 21 (Sébastien) ne marchent pas tels quels, c'est ce que disent leurs indications et le point 1 (l.188). La question de la FAQ ne change pas. Réponse en texte brut, sans lien ni gras : format accepté par `validateArticle`, JSON-LD mis à jour par l'import.

### F3. La blague du jour : 2 mentions au lieu de 3 (critère 5)

**Avant** (l.195 à l.197) :
```md
**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage.

Tu préfères choisir ta situation ?
```
**Après** (une seule ligne d'intro, collée à la liste qui suit, comme aujourd'hui) :
```md
**Tu as fait le tour ?** Choisis ta situation :
```
Pourquoi : « change chaque jour » (l.45), « une nouvelle vanne arrive chaque jour » (l.195) et « celle d'aujourd'hui, et demain une autre » (l.210) disent la même chose ; l.195 et l.210 sont à 15 lignes d'écart, dans le même écran mobile (`m06`). Le sommaire garde la sienne (sortie de début), la l.210 garde celle de fin. La ligne d'intro reste dans le bloc de la liste : rendu « intro + liste » déjà géré par `renderBlock` (`markdown-renderer.tsx` l.235). Aucun test ne vérifie la l.195 (Grep dans `src/__tests__` : 0).

### Application et diff réel (P0 s11)

F2 et F3 : 2 lignes modifiées et 2 retirées dans le brouillon, puis `import-article.ts … --update` (dry-run : `content` seul modifié, FAQ : 4), puis `--write`. F1 : code commun. 0 caractère dans les 27 messages, H2, slug, title, meta, questions de FAQ. Le test A2 (27 emplacements, 7 H2) reste vert : aucune ligne numérotée ni H2 touché.

## 4. Ne comptent pas contre le 10

- **Triplet « le plat, le nom du groupe »** dans la règle 3 (l.59) et dans la FAQ 3 : la règle donne le principe, la FAQ répond à une question de recherche. Accepté à l'iter2.
- **Durée Machine à café dite 3 fois** (section patron, paragraphe des parcours, encart) : chaque mention est exacte et sert une sortie différente.
- **« À lire ensuite » avec « Comment faire rire une fille »** (`m08`) : sélection automatique du gabarit.
- **Statut du brouillon (l.14)** : note interne périmée, à mettre à jour au prochain `--update`.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A2-iter3.md
- Décisions prises : E1 à E4 appliqués et visibles ; 9,6/10 (77/80) ; 3 correctifs restants : F1 (code commun aux 4 articles), F2 (FAQ 3), F3 (bloc de fin).
- Points d'attention : @copywriter applique F2 et F3 puis `--update` ; F1 suivi dans la notation A1.
---
