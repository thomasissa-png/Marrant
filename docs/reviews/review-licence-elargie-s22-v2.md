# Relecture à l'aveugle : licence élargie de « la vanne du jour » (s22, v2)

Date : 24/10/2026. Relecteur : @reviewer, à l'aveugle (docs/reviews/ non lu).
Portée fixée par le fondateur, non discutée ici.

Textes relus :
- FR (fait foi) : `CONDITIONS_UTILISATION` (page.tsx:52-53, rendu l.191-192 sous `<h2 id="licence">`) et `LICENCE_API` (page.tsx:56-57, rendu l.189, dans « Pour les développeurs », donc AU-DESSUS de l'ancre), plus la phrase R10 l.180.
- EN : `TEXTE_LICENCE_USAGE`, `TEXTE_LICENCE_CONDITIONS`, `TEXTE_LICENCE_FOI` (developers.ts:134-139) et le reste du fichier (cache, limite, champs, vie privée, erreurs).

## Verdict : GO, 9/10, zéro bloquant

| Critère | Note | Commentaire |
|---|---|---|
| 1. Clarté non-juriste | 9 | Phrases courtes, exemples concrets (Discord, Slack, Telegram), la règle bot/newsletter est expliquée. Seul point flou : « contenu inapproprié » (de qui ?). |
| 2. Cohérence interne et FR/EN | 9 | Aucune contradiction. Le résumé `LICENCE_API` est annoncé comme « la licence » alors qu'il est hors ancre et incomplet (manque « s'attribuer »). |
| 3. Fidélité EN ↔ FR | 9,5 | Traduction fidèle ; les 4 adaptations à l'API sont justifiées et documentées (developers.ts:128-133), et la clause de primauté du FR les couvre. |
| 4. Ton FR / anglais naturel | 9 | Tutoiement constant, ton simple. EN correct, quelques calques (« keeping the jokes aside », « 24 hours maximum »). |
| 5. Règles maison | 10 | Zéro tiret cadratin ou demi-cadratin (Grep `[—–]` : 0 sur les deux fichiers). Rien d'inventé : « ne pose aucun cookie et ne suit pas tes visiteurs » vérifié dans le code (`src/app/embed/vanne-du-jour/route.ts:8-9` : ni Umami, ni cookie, ni JS Next ; developers.ts:125 cohérent pour l'API). |

## Contradictions vérifiées (toutes résolues dans le texte)

| Point de tension | Verdict | Où c'est réglé |
|---|---|---|
| Bot qui poste chaque jour vs « ne pas archiver » | OK | FR : « Les messages de bot et les newsletters déjà envoyés peuvent rester où ils sont : ce qui est interdit, c'est de garder les vannes de côté… » ; EN identique. |
| Messages de bot gardés pour toujours vs cache 24 h | OK | Même phrase : exception explicite, le cache ne vise que la copie gardée « de ton côté ». |
| Cache 24 h (licence) vs `max-age=300, s-maxage=3600` (developers.ts:92) | OK | Les en-têtes décrivent les caches HTTP ; la licence autorise 24 h de ton côté ; developers.ts:100 fait le lien (« the license allows up to 24 hours »). |
| Cache réservé à l'API en FR, sans condition en EN | OK | La page EN ne parle que de l'API ; adaptation documentée. |
| Sous #licence : toutes les règles ? | OK | Affichage, supports, pub, attribution (widget et sans widget), pas de modification, pas de s'attribuer, interdits, bots/newsletters, cache 24 h, cookies, sans garantie, coupure : tout y est. `LICENCE_API` n'ajoute aucune règle absente de #licence. |
| 403 « abuse or inappropriate content » (developers.ts:114) vs licence | OK | Mêmes motifs que « te couper l'accès (contenu inapproprié, abus) ». |
| Champ `attribution.required: true` vs licence | OK | Lien visible obligatoire partout, FR et EN. |

## Corrections

### Bloquant

Aucun.

### À corriger (recommandé, repasse par @legal pour les textes qui viennent de lui)

**C1. Le résumé hors ancre est présenté comme « la licence » et il lui manque « s'attribuer ».**
La phrase R10 (page.tsx:180) renvoie à « la licence juste en dessous » : c'est `LICENCE_API` (l.189), qui est hors de l'ancre #licence (celle que cite le champ `license`), et qui n'interdit pas de présenter la vanne comme la sienne (interdit de la portée fondateur). Un développeur qui s'arrête au résumé rate une règle. Pas de contradiction (rien ne dit le contraire), mais risque réel de lecture incomplète.
- page.tsx:180, actuel : « Les règles d'usage sont dans la licence juste en dessous. »
  proposé : « Les règles d'usage sont résumées juste en dessous, et détaillées dans les conditions d'utilisation. »
- `LICENCE_API`, actuel : « Licence d'usage : tu peux afficher la vanne gratuitement, sans la modifier, sur un site, […] »
  proposé : « Licence d'usage, en bref : tu peux afficher la vanne gratuitement, sans la modifier ni la présenter comme la tienne, sur un site, […] »
- `TEXTE_LICENCE_USAGE`, actuel : « Usage license: you may display the joke free of charge and unmodified, on a site, […] »
  proposé : « Usage license, in short: you may display the joke free of charge, unmodified and without presenting it as your own, on a site, […] »

**C2. « Contenu inapproprié » : on ne sait pas de quel contenu il s'agit.**
Un non-juriste peut comprendre que c'est la vanne qui serait inappropriée. Le 403 (developers.ts:114) montre que c'est le site appelant.
- `CONDITIONS_UTILISATION`, actuel : « te couper l'accès (contenu inapproprié, abus), à tout moment. »
  proposé : « te couper l'accès (contenu inapproprié là où tu affiches la vanne, abus), à tout moment. »
- `TEXTE_LICENCE_CONDITIONS`, actuel : « cut off your access (inappropriate content, abuse), at any time. »
  proposé : « cut off your access (inappropriate content where you display the joke, abuse), at any time. »

### Optionnel

**O1. Cible du lien non dite en FR.** Le champ `attribution` (EN) dit « pointing to that url », le FR dit seulement « le lien « Deviens Marrant » ».
- `CONDITIONS_UTILISATION`, actuel : « mets le lien « Deviens Marrant » bien visible à côté. »
  proposé : « mets le lien « Deviens Marrant » (vers deviens-marrant.fr) bien visible à côté. »

**O2. Énumération répétée 4 fois** (site, appli, bot, extension, newsletter), qui alourdit.
- actuel : « Tu peux afficher la vanne même si ton site, ton appli, ton bot, ton extension ou ta newsletter a de la publicité. »
  proposé : « Tu peux afficher la vanne même s'il y a de la publicité autour. »
- EN, actuel : « You can display the joke even if your site, app, bot, extension or newsletter carries advertising. »
  proposé : « You can display the joke even if there are ads around it. »

**O3. Anglais plus naturel.**
- actuel : « what is forbidden is keeping the jokes aside to reuse them later or gather them together. »
  proposé : « what is forbidden is stockpiling jokes to bring them out again later or compile them. »
- actuel (3 occurrences, developers.ts:135 et 137) : « for 24 hours maximum »
  proposé : « for up to 24 hours » (même tournure que developers.ts:100).

**O4. Clause de primauté.** L'EN est une traduction adaptée à l'API, pas littérale.
- actuel : « These terms are a courtesy translation. If they differ from the French original, the French version prevails: […] »
  proposé : « These terms are a courtesy translation, adapted to the API. If they differ from the French original, the French version prevails: […] »

**O5. Cookies de l'API absents du FR qui fait foi.** L'EN dit « The API sets no cookies », le FR ne parle que du widget. Vrai dans les deux cas (code vérifié), mais l'EN affirme une chose que le texte qui fait foi ne dit pas.
- `CONDITIONS_UTILISATION`, actuel : « Le widget ne pose aucun cookie et ne suit pas tes visiteurs. »
  proposé : « Le widget et l'API ne posent aucun cookie et ne suivent pas tes visiteurs. »

## Top 3

1. C1 : faire pointer R10 vers les conditions complètes et ajouter « ni la présenter comme la tienne » au résumé FR et EN.
2. C2 : préciser « contenu inapproprié là où tu affiches la vanne » (FR et EN).
3. O5 : aligner le FR sur l'EN pour les cookies de l'API.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-licence-elargie-s22-v2.md`
- Décision : GO, 9/10, zéro bloquant, zéro contradiction (bot vs archivage, cache serveur vs licence, en-têtes HTTP vs 24 h, couverture de #licence : tous OK).
- Points d'attention : C1 et C2 recommandés, à faire valider par @legal (textes mot pour mot) puis appliquer par @fullstack sur page.tsx et developers.ts ; reporter dans REPLIT_ACTIONS.md.
---
