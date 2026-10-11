# Notation : /blog/voeux-drole-nouvelle-annee (A2, itération 2, 05/10/2026)

> Revue @reviewer. Base : brouillon `docs/copy/articles-forte-frappe/A2-voeux-drole-nouvelle-annee.md` (source de l'import, corrigeable avec `--update`), `components/ui/markdown-renderer.tsx` (l.35, l.231, l.313 à l.318), `config/blog-cta.ts` (l.30 à l.36), `config/blog-forte-frappe.ts` (l.18), `__tests__/ui/markdown-renderer-forte-frappe.test.ts`, notation `notation-A2-iter1.md`.
> Grille de 8 critères identique à `notation-article-blagues-2026-iter1.md`.
> Acquis (non re-vérifiés, consigne) : import en base, programmation au 12/11/2026, FAQ en `faqs` et JSON-LD, meta servie par `metaDescription`, CTA après le corps, bouton « Envoyer le message » en texte seul, conversion des « » imbriqués, `frTypo`, protection des mots composés, gabarit noté 10/10.
> Intouchables respectés : texte des 27 messages, zéro tiret cadratin (Grep `—|–` : 0), aucun humoriste.
> Limites : rendu non vu (aucune capture A2), tests non exécutés, pas de git (consigne).

## 1. Vérification des 11 correctifs de l'itération 1

| # | Correctif | Appliqué ? | Évidence |
|---|---|---|---|
| D1 | « nouvelle année » dans l'En bref, « quelques lignes » | Oui | brouillon l.43 |
| D2 | Sommaire juste après l'En bref, phrase doublon supprimée | Oui | l.45, l.47 à l.49 |
| D3 | Bloc « À retenir » supprimé | Oui | l.59 suivi de `---` l.61 |
| D4 | « C'est ce qui en fait ton message » | Oui | l.59 |
| D5 | Indication n°3 propre au message | Oui | l.74 |
| D6 | n°6 envoyée en fin de matinée | Oui | l.83 |
| D7 | n°10 réorientée vers le manager direct, renvoi aux n°8 et 9 | Oui | l.103 |
| D8 | Sortie WhatsApp déplacée après les messages | **Oui, avec régression** | l.146 et l.162 ; voir E1 |
| D9 | « pour écrire tes propres chutes l'an prochain » | Oui | l.211 |
| D10 | CTA dédié | Oui | `blog-cta.ts` l.31 à l.36, identique au brouillon l.7 à l.10 |
| D11 | Envoi du texte seul | Oui | `blog-forte-frappe.ts` l.18 (`text-only`) |

Régression introduite par D8 : en supprimant la dernière phrase du paragraphe d'intro WhatsApp, la ligne vide qui le séparait du message n°20 a disparu (l.146 puis l.147 directement). Le test de rendu demandé en iter1 (« 27 `data-share-vanne` pour A2 ») n'a pas été écrit : `markdown-renderer-forte-frappe.test.ts` couvre A1 et A3, pas A2. C'est pour ça que la régression est passée.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | La requête est dans la 1re phrase, le sommaire arrive après environ 60 mots et le 1er message après environ 330. Il n'y a plus de doublon avant le contenu. |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie en fin de chaque section de destinataires, `phrases-droles-conversations` après les messages 20 à 24, et un bloc final complet. |
| 3 | CTA d'inscription | **10/10** | Le CTA dédié est placé juste après le corps, avec un titre qui parle d'un message écrit et une note vraie (« restent en accès libre »). |
| 4 | Lisibilité mobile et structure | **8/10** | Le message n°20 est collé au paragraphe d'intro WhatsApp : même bloc, rendu en un seul `<p>` avec `<br/>` (renderer l.231). Il n'a pas de bouton « Envoyer le message », parce que `JOKE_RE` est ancré en début de bloc (l.35, l.313), et pas d'ancre `#vanne-20`. Le n°20 est le message le plus envoyé de la section (le groupe, à minuit). |
| 5 | Ton Marrant des textes ajoutés | **9/10** | Deux points de la section « adapter » répètent d'autres passages : le point 1 reprend la règle 3 (même triplet « le prénom / le plat / le nom du groupe », aussi présent dans la FAQ 3), et le point 3 annonce « Choisis le moment » mais ne parle que du délai, presque mot pour mot comme la FAQ 2 (« L'usage veut qu'on … jusqu'à fin janvier »). |
| 6 | Conformité | **10/10** | Zéro tiret cadratin, zéro humoriste. Les durées des parcours sont conformes au [CHOIX UTILISATEUR] du 29/09. La n°10 ne contredit plus la promesse « qui ne vexent personne ». La note du CTA est vraie. |
| 7 | Sécurité SEO | **10/10** | Title de 53 car., meta de 144 car. via `metaDescription`, 7 H2 en question, requête dans l'En bref, FAQ en JSON-LD. Pas de cannibalisation avec S11 ni S13 (inchangé depuis iter1). |
| 8 | Mesure | **9/10** | `blog-vanne-partage` est en place, mais il manque le n°20 (aucun emplacement, voir critère 4). Le test qui aurait dû verrouiller les 27 emplacements d'A2 n'existe pas. |

**Note globale : 9,5/10** (76/80), contre 8,3 à l'itération 1.
**Après les 4 correctifs ci-dessous : 10/10 sur les 8 critères.** Je ne vois pas d'autre amélioration concrète.

## 3. Top 3

1. **E1 (ligne vide avant le n°20)** : une ligne à ajouter, puis `--update`. Le défaut est visible et casse l'usage n°1 (envoyer) sur un message clé.
2. **E2 (test A2)** : il verrouille les 27 emplacements, pour que ce type de régression ne repasse plus en silence.
3. **E3 + E4 (section « adapter »)** : deux points qui doublonnent sont remplacés par deux vérifications propres à cette page.

## 4. Correctifs exacts

### E1. Ligne vide entre l'intro WhatsApp et le n°20 (critères 4 et 8)

Fichier : brouillon A2. **Avant** (l.146 et l.147) :
```md
À minuit, le groupe reçoit beaucoup de messages identiques : le tien doit faire sourire en une ligne. Pour un ami perdu de vue, c'est l'inverse : un message privé, une fois par an, qui donne envie de répondre sans y obliger.
**20.** Bonne année à tous. Je vous écris depuis le balcon, le seul endroit où ça capte. Il y a du monde.
```
**Après** :
```md
À minuit, le groupe reçoit beaucoup de messages identiques : le tien doit faire sourire en une ligne. Pour un ami perdu de vue, c'est l'inverse : un message privé, une fois par an, qui donne envie de répondre sans y obliger.

**20.** Bonne année à tous. Je vous écris depuis le balcon, le seul endroit où ça capte. Il y a du monde.
```
Ensuite, réimporter avec `--update`. Les 4 autres sections ont bien leur ligne vide (l.66, l.95, l.124, l.169) ; seule celle-ci l'a perdue.

### E2. Test de rendu A2 : 27 emplacements (critère 8)

Fichier : `apps/web/src/__tests__/ui/markdown-renderer-forte-frappe.test.ts`. **Avant** (l.43, ligne vide entre les blocs A1 et A3) : rien. **Après**, ajouter :
```ts
describe("A2 importé : lignes « **N.** texte », envoi du texte seul", () => {
  const content = importedContent("A2-voeux-drole-nouvelle-annee.md");
  const html = renderMarkdown(content, { shareJokes: true });

  it("27 emplacements numérotés (aucun message collé à un paragraphe), 7 H2", () => {
    expect(slots(html).map((s) => s.n)).toEqual(Array.from({ length: 27 }, (_, i) => i + 1));
    expect(html.match(/<h2 id=/g)).toHaveLength(7);
  });

  it("texte partagé = le message seul", () => {
    const texts = slots(html).map((s) => s.text);
    expect(texts[19]).toBe("Bonne année à tous. Je vous écris depuis le balcon, le seul endroit où ça capte. Il y a du monde.");
    for (const text of texts) expect(text).not.toMatch(/^\d|\*|→|À minuit/);
  });
});
```
Pourquoi : iter1 demandait ce test. Il aurait signalé E1 tout de suite (26 emplacements au lieu de 27).

### E3. Section « adapter », point 1 : une vraie vérification au lieu d'un doublon de la règle 3 (critère 5)

**Avant** (l.187) :
```md
1. **Change un mot.** Le prénom, le plat, le nom du groupe : un détail à toi, et le message n'est plus celui de tout le monde.
```
**Après** :
```md
1. **Remplace les détails d'exemple.** Le fauteuil, « compta ? », Biscotte, Sébastien, mars : ce sont les nôtres. Mets les tiens, sinon la chute raconte la vie de quelqu'un d'autre.
```
Pourquoi : la règle 3 (l.59) donne déjà le principe, avec le même triplet que la FAQ 3. Le point 1 devient une vérification avant envoi, propre à cette page : il récapitule les mots à remplacer cités dans les indications des n°3, 5, 18, 21 et 10. C'est aussi le risque réel du copier-coller.

### E4. Section « adapter », point 3 : le moment, pas le délai déjà traité en FAQ (critère 5)

**Avant** (l.189) :
```md
3. **Choisis le moment.** L'usage veut qu'on envoie ses vœux jusqu'à fin janvier : tu n'es pas en retard le 2.
```
**Après** :
```md
3. **Vérifie le moment.** L'indication sous chaque message dit quand l'envoyer : un message écrit pour la reprise ne part pas le 31 décembre.
```
Pourquoi : le titre annonçait le moment, le texte parlait du délai, et la FAQ 2 dit la même chose (« L'usage veut qu'on les envoie jusqu'à fin janvier »). « Fin janvier » reste dans l'indication n°13 et dans la FAQ 2, qui répond à la question. « Quatre vérifications, trente secondes » reste vrai.

### Récapitulatif et diff réel (P0 s11)

| # | Critère(s) | Fichier | Lignes touchées |
|---|---|---|---|
| E1 | 4, 8 | brouillon A2 l.146 et l.147, puis `--update` | 1 ligne vide ajoutée |
| E2 | 8 | `markdown-renderer-forte-frappe.test.ts` | 1 bloc de test (environ 15 lignes) |
| E3 | 5 | brouillon A2 l.187 | 1 |
| E4 | 5 | brouillon A2 l.189 | 1 |

Contenu : 2 lignes modifiées et 1 ligne vide ajoutée, sur environ 190. Aucun intouchable n'est touché (27 messages, slug, title, meta, H2, questions de FAQ). Un seul `--update` pour E1, E3 et E4. E2 suit le pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, et le changement est documenté dans `REPLIT_ACTIONS.md`.

Notes projetées après application : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.

## 5. Ne comptent pas contre le 10

- **readingTime « 7 min »** : environ 2 200 mots [estimation manuelle, non mesurée], soit environ 315 mots/min. C'est plausible pour une page catalogue qu'on parcourt. À recompter seulement si un outil de comptage est branché à l'import.
- **Encart parcours sans entrée dans `FORTE_FRAPPE_PARCOURS`** : le parcours déduit est Machine à café. C'est cohérent avec les 14 messages sur 27 destinés au travail et avec le lien de la section patron (l.117).
- **Statut du brouillon (l.14, « prêt pour le dry-run d'import »)** : il est périmé depuis l'import, mais c'est une note interne, non publiée. Mise à jour mineure à prévoir au prochain `--update`.

## 6. Décisions pour Thomas (hors note)

- **Ordre 21, 22, 23** (iter1, §6) : toujours ouvert, sans effet sur la note.
- **Rendu** : des captures à 390 px et en desktop après le `--update` restent nécessaires pour déclarer le 10/10 « vu ». Cette notation porte sur le texte et le code.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A2-iter2.md
- Décisions prises : 9,5/10 (76/80). Les 11 correctifs de l'iter1 sont appliqués, mais D8 a introduit une régression (n°20 collé à l'intro, sans bouton). 4 correctifs (E1 à E4) mènent à 10/10 sans toucher aux intouchables.
- Points d'attention : édition mineure E1, E3 et E4 dans le brouillon, puis `--update` ; @fullstack ajoute le test E2 (27 emplacements) ; captures 390 px et desktop après la mise à jour.
---
