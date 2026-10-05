# Notation : A4 « blagues de couple » (`/blog/blagues-de-couple-drole`, itération 2, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/A4-blagues-de-couple.md` (225 lignes, 29 vannes), `config/blog-cta.ts` l.45-50, `config/blog-forte-frappe.ts` l.20 et l.42, `config/blog-tracking.ts` l.12, `lib/vannes-themes.ts` l.34-43. Grille de 8 critères de `notation-article-blagues-2026-iter1.md`, reprise telle quelle.
> Acquis (fournis par l'orchestrateur, non revérifiés) : article en base, programmé le 05/11/2026, corrigeable avec `--update` ; FAQ → `faqs` + JSON-LD ; meta = `metaDescription` ; CTA, Partager avec URL et encart Confiance configurés ; « » imbriqués rendus en “…” ; gabarit commun à 10/10.
> Intouchables respectés par tous les correctifs : texte des 29 vannes (0 mot modifié), 0 tiret cadratin (Grep « — » et « – » : 0 dans le fichier), 0 humoriste. Pas de git.

## 1. Les 10 correctifs de l'itération 1

| Correctif iter1 | État | Évidence |
|---|---|---|
| C1 Intro, sommaire au 1er écran | Appliqué | A4 l.41-47 |
| C2 CTA dédié | Appliqué | `blog-cta.ts` l.45-50 (texte identique à A4 l.14-18) |
| C3 Partager | Appliqué (autrement : config forte frappe) | `blog-forte-frappe.ts` l.20 `"with-url"` |
| C4 Guillemets imbriqués | Réglé par le rendu (acquis), ponctuation des vannes intacte | A4 l.61, 76, 90, 113, 116, 119, 125, 142, 151, 171 |
| C5 Doublons H8-2, H10-13 en réserve | Appliqué | A4 l.6 ; n°1 et n°18 seules sur leur mécanisme |
| C6 Indications répétées, faute « garde-la pour le dire » | Appliqué | A4 l.100, 103, 143, 155, 166 |
| C7 Règle « famille de l'autre » | Appliqué | A4 l.188, l.212 |
| C8 Quiz individuel | Appliqué | A4 l.202 |
| C9 Cannibalisation `/vannes/theme/couple` | **À moitié** : côté article oui (l.79), **côté code non** | `vannes-themes.ts` l.37 et l.40 visent toujours « Blagues de couple » |
| C10 Nombre dans title et meta | Appliqué, à 29 | A4 l.23 (54 car.), l.24 (151 car., recompté) |

En plus : F5 (le grand-père qui n'entend rien) est passée en réserve, d'où 29 vannes. Numérotation, liste des ids (l.5) et répartition (8 / 6 / 6 / 6 / 3) recomptées : cohérentes.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | Nombre dans le « En bref », sommaire des 6 moments juste en dessous, une seule annonce de la règle. |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie par section, toutes différentes, blague du jour dite 2 fois avec 2 formules (l.43, l.194). |
| 3 | CTA d'inscription | **9/10** | Bien placé, note vraie ; mais le titre promet « trouver le bon moment » alors que le texte vend Répartie (« renvoyer la balle »), et le moment, c'est l'article qui le donne déjà gratuitement. |
| 4 | Lisibilité mobile et structure | **10/10** | Partager sur 29 vannes, guillemets lisibles, plus aucun doublon de mécanisme. |
| 5 | Ton Marrant des textes affichés | **8/10** | 7 défauts : « fait la moitié » (l.56, l.100), « dans la voiture du retour » 2 fois de suite (l.126, l.129), « valeur sûre » (l.105, l.182), « à ressortir » 2 fois dans la même phrase (l.163), « confié en confidence » (l.212), « Ça détend les deux » (l.114), n°28 qui dit 2 fois la même chose (l.169). |
| 6 | Conformité | **8/10** | « remplace […] les prénoms par les vôtres » (l.190) alors qu'aucune vanne n'a de prénom ; n°18 conseille de la dire « en fin de repas » (l.123) alors que la section dit « jamais devant eux » (l.111) et la FAQ « plutôt qu'à table » (l.220). |
| 7 | Sécurité SEO | **8/10** | Title, meta, H2, ancres, FAQ : PASS. Mais `/vannes/theme/couple` garde le title « Blagues de couple pour rire à deux » et le H1 « Blagues de couple : … » : les 2 URL visent toujours la même requête exacte. |
| 8 | Mesure | **10/10** | Slug dans `blog-tracking.ts` l.12, Partager actif, donc `blog-vanne-partage` part. |

**Note globale : 9,1/10** (73/80, contre 63/80 à l'iter1).
**Après les 11 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 3. Top 3

1. **C11 (critère 7)** : le volet code de la cannibalisation n'est pas fait, et l'article est déjà programmé. C'est le seul FAIL qui coûte du trafic.
2. **C9 + C10 (critère 6)** : 2 consignes fausses ou contradictoires que le lecteur peut suivre à la lettre.
3. **C1 (critère 3)** : le titre du CTA promet ce que le compte ne donne pas.

## 4. Correctifs exacts

Article en base : C2 à C10 vont dans le fichier A4 (numéros de ligne actuels), puis `import-article.ts --update`. Seule la ligne citée change, aucune vanne n'est touchée.

### C1. Titre du CTA aligné sur ce que le texte vend (critère 3)

`apps/web/src/config/blog-cta.ts` l.46 et A4 l.15.
**Avant** : `Tu as les vannes. Reste à trouver le bon moment.`
**Après** : `Tu as les vannes. Et quand l'autre te les renvoie ?`
Pourquoi : le texte vend Répartie (« renvoyer la balle quand l'autre te répond du tac au tac »). Le bon moment, l'article le donne déjà gratuitement (29 indications et la règle « Choisis le moment », l.184). Le nouveau titre pose la question à laquelle le texte répond, et reprend la sortie Répartie de l'article (l.157). Text, bouton et note ne changent pas.

### C2. « fait la moitié » une seule fois (critère 5)

n°13, l.100. **Avant** : `*→ À dire en refermant le frigo, le pot vide à la main. L'objet fait la moitié de la chute.*`
**Après** : `*→ À dire en refermant le frigo, le pot vide à la main, tenu comme une pièce à conviction.*`
Pourquoi : la formule de la n°1 (l.56, « Le sérieux fait la moitié du travail ») revenait. C'est mon correctif C6 de l'iter1 qui l'avait introduite.

### C3. Belle-famille : plus de « voiture du retour » en double, et une règle qui inclut la n°20 (critères 5 et 6)

n°20, l.129. **Avant** : `*→ À dire dans la voiture du retour, ou devant des amis si l'autre accepte d'en rire avec toi.*`
**Après** : `*→ À raconter à des amis qui demandent comment s'est passé le week-end, seulement si l'autre accepte d'en rire avec toi.*`

l.111. **Avant** : `Ces vannes se disent entre vous, à l'oreille ou sur la route du retour.`
**Après** : `Ces vannes se disent loin de la tablée : à l'oreille, sur la route du retour, ou plus tard entre amis.`
Pourquoi : la n°19 (l.126) et la n°20 commençaient toutes deux par « dans la voiture du retour ». La n°20 est un récit fait à des amis (c'est sa situation), alors que l'intro disait « entre vous » : la règle couvre désormais ce que l'indication propose, et « jamais devant eux » (même ligne) reste intact.

### C4. Tournure (critère 5)

n°15, l.114. **Avant** : `Ça détend les deux avant de sonner.` **Après** : `Ça vous détend tous les deux avant de sonner.`

### C5. n°28 : une consigne, pas deux fois la même (critère 5)

l.169. **Avant** : `*→ À envoyer ou à dire après le bruit, jamais pendant. Le bon moment, c'est quand le calme est revenu.*`
**Après** : `*→ À envoyer ou à dire le lendemain, jamais pendant. Si l'autre rit, la dispute est vraiment finie.*`
Pourquoi : « après, jamais pendant » et « quand le calme est revenu » disent la même chose, et la 2e phrase répète la règle l.184 (« une fois le calme revenu »).

### C6. « valeur sûre » une seule fois (critère 5)

l.105. **Avant** : `Pour rire de toi d'abord, ce qui reste la valeur sûre à deux : [les vannes d'autodérision](/vannes/theme/autoderision).`
**Après** : `Pour rire de toi d'abord, le sujet que l'autre ne prendra jamais mal : [les vannes d'autodérision](/vannes/theme/autoderision).`
Pourquoi : l.182 garde « est la valeur sûre », dans la section qui l'explique.

### C7. « à ressortir » une fois par phrase (critère 5)

l.163. **Avant** : `Pour des phrases à ressortir dans une conversation plus large, [les phrases drôles à ressortir](/blog/phrases-droles-conversations) prennent le relais.`
**Après** : `Pour une conversation à plusieurs, au dîner ou au bureau, [les phrases drôles à ressortir](/blog/phrases-droles-conversations) prennent le relais.`

### C8. Pléonasme dans la FAQ (critère 5)

FAQ 1, l.212. **Avant** : `tout ce qu'il t'a confié en confidence.` **Après** : `tout ce qu'il t'a confié.`
Réponse toujours sans markdown (JSON-LD inchangé dans sa forme).

### C9. n°18 ne se dit plus à table (critère 6)

l.123. **Avant** : `*→ À raconter à l'autre une fois seuls, ou à voix très basse en fin de repas. Jamais assez fort pour que la tablée l'entende.*`
**Après** : `*→ À raconter à l'autre une fois seuls, le soir ou sur la route. Ralentis sur « Je savoure encore ».*`
Pourquoi : « en fin de repas », c'est devant eux, ce qu'interdisent l.111 (« jamais devant eux »), la n°17 (l.120) et la FAQ 3 (l.220, « plutôt qu'à table »).

### C10. « les prénoms » : aucune vanne n'en a (critère 6)

l.190. **Avant** : `remplace la télécommande par ce qui traîne vraiment sur votre table basse, et les prénoms par les vôtres.`
**Après** : `remplace la télécommande par ce qui traîne vraiment sur votre table basse, et « ma copine » ou « mon copain » par le prénom de l'autre.`
Pourquoi : les 29 vannes disent « ma copine », « mon copain », « elle », « ses parents », jamais un prénom. La consigne actuelle ne peut pas être suivie. Le texte stocké des vannes ne bouge pas : c'est le lecteur qui adapte à l'oral.

### C11. Volet code de la cannibalisation (critère 7)

`apps/web/src/lib/vannes-themes.ts`, l.37-40. **Avant** :
```ts
    title: "Blagues de couple pour rire à deux",
    description:
      "Des blagues de couple sur les courses, le canapé et le « on mange quoi ? ». Chaque vanne a sa chute et son décryptage.",
    h1: "Blagues de couple : la vie à deux, version drôle",
```
**Après** :
```ts
    title: "Vannes de couple pour rire à deux",
    description:
      "Des vannes de couple sur les courses, le canapé et le « on mange quoi ? ». Chaque vanne a sa chute et son décryptage.",
    h1: "Vannes de couple : la vie à deux, version drôle",
```
Pourquoi : l'article a fait sa part (ancre « le thème couple du catalogue », l.79) et son en-tête (l.8, l.31) annonce que la page thème passe sur « vannes de couple », mais le code n'a pas bougé. Les sous-thèmes de la description restent (ils correspondent à la sortie l.79 « pour le canapé et la cuisine »), seul le mot de tête change. Aucun test ne référence ces chaînes (Grep `Blagues de couple` dans `src/` : 2 résultats, ce fichier seul). Condition inchangée depuis l'iter1, à vérifier par @seo avant le 05/11 : si `/vannes/theme/couple` est déjà dans le top 10 Search Console sur « blagues de couple », on inverse. Pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, déploiement noté dans `REPLIT_ACTIONS.md`.

## 5. Récapitulatif

| # | Critère(s) | Fichier | Agent |
|---|---|---|---|
| C1 | 3 | `blog-cta.ts` l.46 + A4 l.15 | @fullstack, @copywriter |
| C2 à C8 | 5 (C3 aussi 6) | A4 l.100, 111, 114, 105, 129, 163, 169, 212 | @copywriter puis `--update` |
| C9, C10 | 6 | A4 l.123, l.190 | @copywriter puis `--update` |
| C11 | 7 | `vannes-themes.ts` l.37-40 | @seo (Search Console) puis @fullstack |

Notes projetées après application : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.
Diff réel attendu (P0 s11) : 11 lignes de texte de l'article (indications, liaisons, FAQ), 1 ligne de config, 2 lignes de code utiles. 0 mot changé dans les 29 vannes, slugs, H2, ancres, FAQ (questions), title et meta intacts. Ne pas l'annoncer comme une réécriture.

## 6. Ne comptent pas contre le 10

- **Section Messages à 3 vannes** : même position qu'à l'iter1 (pas de lignes neuves validées à l'aveugle disponibles). À rouvrir si `blog-ancre-clic` place « Messages » en tête.
- **Rendu réel** : captures 390 px et desktop à faire à la publication (05/11), date non échue aujourd'hui.

## 7. Décisions pour Thomas (hors note)

- **Attribution du retrait de F5** (en-tête l.6, interne) : il est écrit « passée en réserve selon la notation iter1 ». L'iter1 proposait au contraire de la garder et te laissait trancher. Si c'est toi qui l'as retirée, écrire `[CHOIX UTILISATEUR 05/10]` ; sinon, confirmer le retrait (défaut : le garder retiré, l'article interdit le physique).
- **C11** : sens de l'arbitrage article / page thème, selon Search Console.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A4-iter2.md
- Décisions prises : 9,1/10 (73/80) ; 9 correctifs iter1 sur 10 appliqués, C9 côté code manquant ; 11 correctifs exacts pour 10/10, 0 mot changé dans les vannes.
- Points d'attention : C11 (`vannes-themes.ts`) avant la publication du 05/11 ; C2 à C10 dans A4 puis `--update` ; C1 dans `blog-cta.ts` et A4 l.15 ; attribution du retrait de F5 à confirmer par Thomas.
---
