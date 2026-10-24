# Revue à l'aveugle : licence élargie de la vanne du jour (s22), 24/10/2026

Périmètre lu : `apps/web/src/app/(dashboard)/integrer-la-vanne-du-jour/page.tsx` (CONDITIONS_UTILISATION l.51-52, LICENCE_API l.55-56, sections « Pour les développeurs » l.167-188 et « Conditions d'utilisation » l.190-191), `apps/web/src/config/textes/developers.ts` (TEXTE_LICENCE_USAGE l.133-134, TEXTE_LICENCE_CONDITIONS l.135-136, TEXTE_LICENCE_FOI l.137-138, et le reste du fichier pour la cohérence), `apps/web/src/config/textes/widget-programme.ts` (chapeau, ligne de backlink, affichage), `docs/copy/ton-alex.md`. `docs/reviews/` non lu (revue à l'aveugle). Portée décidée non remise en cause.

## Verdict : NO-GO (7,5/10, 3 bloquants)

Le texte des Conditions est clair, tutoyé et sans jargon, la traduction est fidèle et les règles maison sont respectées. Mais trois points de cohérence cassent la lecture « on sait ce qui est permis en une fois » : le bot et la newsletter, désormais autorisés, gardent par nature les vannes au-delà de 24 h (archivage interdit) ; « cache côté client » contredit la doc anglaise qui recommande un cache serveur ; la section vers laquelle pointe le champ `license` (et la clause « le français prévaut ») ne contient ni l'interdiction d'archiver, ni celle d'entraîner un modèle, ni la règle des 24 h. Les corrections sont courtes (une phrase ou un mot chacune).

| Critère | Note | Constat principal |
|---|---|---|
| 1. Clarté non-juriste | 7/10 | Conditions lisibles ; pronom « l' » ambigu, « côté client », « un modèle » flou |
| 2. Cohérence interne et FR/EN | 6/10 | B1, B2, B3 ; droit de couper l'accès limité « à un site » |
| 3. Fidélité EN ↔ FR | 8,5/10 | Fidèle ; « leave it in place » hérité du widget, sans objet côté API |
| 4. Ton FR / anglais naturel | 8/10 | Conditions au bon ton ; LICENCE_API télégraphique et non tutoyée, « de » non répété |
| 5. Règles maison | 10/10 | Zéro tiret cadratin ou demi-cadratin (Grep sur les 2 fichiers : 0 occurrence) ; rien d'inventé (24 h, 10 req/10 s, sans cookie cohérents avec le reste) |

## Bloquants

### B1. Bot et newsletter autorisés vs « interdit d'archiver » et « cache 24 h maximum »
- Où : LICENCE_API (page.tsx:56), TEXTE_LICENCE_USAGE (developers.ts:134).
- Problème : un bot qui poste chaque jour laisse le message dans l'historique du salon ; une newsletter reste dans les boîtes de réception (et souvent sur une page d'archives). Lu à la lettre, l'usage autorisé viole « cache 24 h maximum » et « interdit d'archiver ». Comme la rotation tire d'un stock limité (developers.ts:96, « jokes come back over time »), un salon Discord tenu un an ressemble aussi à un « recueil ». Un non-juriste ne sait pas s'il a le droit.
- Correction (clarification de la portée décidée, pas un élargissement ; à faire valider par @legal) : ajouter dans les Conditions FR, après la phrase des interdits :
  - Actuel : (rien)
  - Proposé FR : « Un message de bot ou une newsletter déjà envoyés peuvent rester où ils sont : ce qui est interdit, c'est de garder les vannes de côté pour les ressortir ou les rassembler. »
  - Proposé EN (fin de TEXTE_LICENCE_CONDITIONS, même place) : « A bot message or a newsletter that has already been sent can stay where it is: what is forbidden is keeping the jokes to reuse them later or gather them together. »

### B2. « Cache côté client » contredit la doc API
- Où : LICENCE_API (page.tsx:56) « cache côté client 24 h maximum » ; TEXTE_LICENCE_USAGE (developers.ts:134) « client-side cache of 24 hours maximum ».
- Problème : TEXTE_LIMITE (developers.ts:100) conseille « prefer a server-side call with your own cache » puis « cache the response on your side (the license allows up to 24 hours) ». Pour un développeur, « client-side » = navigateur : la licence semble interdire le cache serveur que la doc recommande.
- Correction :
  - FR actuel : « cache côté client 24 h maximum » → proposé : « cache de ton côté (serveur ou navigateur) 24 h maximum »
  - EN actuel : « client-side cache of 24 hours maximum » → proposé : « caching on your side (server or browser) for 24 hours maximum »

### B3. L'ancre `#licence` (champ `license` de l'API, clause « le français prévaut ») ne contient pas toutes les règles
- Où : l'ancre `id="licence"` est sur le H2 « Conditions d'utilisation » (page.tsx:190). LICENCE_API est au-dessus, dans « Pour les développeurs » (page.tsx:188). Le champ `license` de chaque réponse (developers.ts:42) et TEXTE_LICENCE_FOI (developers.ts:138) envoient vers `#licence`.
- Problème : qui suit le lien arrive sous la ligne de licence et lit des Conditions où manquent « archiver », « entraîner un modèle » et le cache 24 h. Or la version anglaise contient ces interdits et dit que le français prévaut : un lecteur peut soutenir que le texte qui fait foi, à l'adresse indiquée, ne les contient pas.
- Correction (texte seulement, les interdits sont déjà décidés) : compléter la phrase des interdits des Conditions FR et EN.
  - FR actuel : « mais pas la revendre, ni la copier en masse, ni la reprendre dans un recueil ou une base de vannes. »
  - FR proposé : « mais pas la revendre, ni la copier en masse, ni l'archiver, ni la reprendre dans un recueil ou une base de vannes, ni t'en servir pour entraîner une IA. »
  - EN actuel : « but you may not resell it, copy it in bulk, or reuse it in a collection or a database of jokes. »
  - EN proposé : « but you may not resell it, copy it in bulk, archive it, reuse it in a collection or a database of jokes, or use it to train an AI model. »
  - Alternative @fullstack (sans toucher au texte) : déplacer le paragraphe LICENCE_API sous le H2 `#licence`, juste avant CONDITIONS_UTILISATION.

## À corriger

### C1. Pronom ambigu « Si tu l'affiches sans le widget »
- Où : CONDITIONS_UTILISATION (page.tsx:52).
- Problème : la phrase d'avant finit sur « la ligne sous le cadre, elle, est facultative » : « l' » se lit d'abord comme « la ligne ». Et la parenthèse « (appli, bot, newsletter…) » laisse croire que l'API sur son propre site n'est pas concernée.
- Actuel : « Si tu l'affiches sans le widget (appli, bot, newsletter…), mets le lien « Deviens Marrant » bien visible à côté de la vanne. »
- Proposé : « Si tu affiches la vanne sans le widget (avec l'API, dans une appli, un bot, une newsletter…), mets le lien « Deviens Marrant » bien visible à côté. »

### C2. Droit de couper l'accès limité « à un site »
- Où : CONDITIONS_UTILISATION (page.tsx:52) ; TEXTE_LICENCE_CONDITIONS (developers.ts:136).
- Problème : l'usage couvre désormais appli, bot, extension, newsletter ; les Conditions ne prévoient la coupure que pour « un site », alors que LICENCE_API dit « accès révocable » sans restriction. Contradiction FR interne, reprise en EN.
- FR actuel : « couper l'accès à un site (contenu inapproprié, abus) » → proposé : « couper l'accès à un site, une appli ou un bot (contenu inapproprié, abus) »
- EN actuel : « cut off a site's access (inappropriate content, abuse) » → proposé : « cut off access for a site, an app or a bot (inappropriate content, abuse) »

### C3. « Leave it in place » sans objet côté API
- Où : TEXTE_LICENCE_CONDITIONS (developers.ts:136).
- Problème : un développeur API ajoute le lien lui-même, il n'y a rien à « laisser en place ». Le passif « must be displayed » détonne aussi au milieu des impératifs.
- Actuel : « The “Deviens Marrant” attribution link must be displayed next to the joke, wherever you show it: leave it in place and clearly visible. »
- Proposé : « Wherever you show the joke, display the “Deviens Marrant” attribution link next to it, clearly visible. »

### C4. LICENCE_API : « de » non répété
- Où : page.tsx:56.
- Actuel : « interdit d'archiver, republier en masse, revendre, reprendre dans un recueil ou une base de vannes, ou entraîner un modèle avec ces textes »
- Proposé : « interdit d'archiver les vannes, de les republier en masse, de les revendre, de les reprendre dans un recueil ou une base de vannes, ou d'entraîner un modèle d'IA avec »

### C5. « Un modèle » flou pour un non-juriste
- Où : LICENCE_API (page.tsx:56), TEXTE_LICENCE_USAGE (developers.ts:134).
- FR : « entraîner un modèle » → « entraîner un modèle d'IA » (inclus dans C4) ; EN : « training a model » → « training an AI model ».

## Optionnel

- O1. Ton de LICENCE_API (critère 4) : seul texte non tutoyé de la page, style télégraphique. Proposé : « En résumé : tu peux afficher la vanne gratuitement, sans la modifier, sur un site, dans une appli, un bot, une extension ou une newsletter, avec le lien « Deviens Marrant » visible à côté. Tu peux la garder en cache de ton côté 24 h au plus. Tu ne peux pas l'archiver, la republier en masse, la revendre, la mettre dans un recueil ou une base de vannes, ni t'en servir pour entraîner une IA. Le service est fourni sans garantie, et on peut te couper l'accès. » (si retenu, adapter TEXTE_LICENCE_USAGE dans le même esprit : « you may… you may not… »).
- O2. Même interdit, deux verbes : « copier en masse » (Conditions) vs « republier en masse » (LICENCE_API) ; EN « copy it in bulk » vs « mass republishing ». Harmoniser sur un seul (« copier en masse » / « copy in bulk »).
- O3. Degré de visibilité : « visible » (widget, LICENCE_API, EN usage) vs « bien visible » (sans widget) vs « clearly visible » (EN conditions). Garder « bien visible » / « clearly visible » partout.
- O4. EN usage, tournure : « display of the joke free of charge and unmodified » → « free display of the joke, unmodified ».
- O5. Renvoi R10 (page.tsx:179) « la licence juste en dessous » : un paragraphe s'intercale (lien doc). « la licence ci-dessous » suffit. Devient sans objet si l'alternative B3 (déplacement) est retenue.
- O6. TEXTE_LICENCE_FOI : « This text » couvre deux paragraphes ; « These terms are a courtesy translation » est plus juste.

## Décision à confirmer par Thomas (non proposée, portée)

- La phrase « Tu peux l'afficher sur un site ou dans une appli qui a de la publicité » ne cite ni newsletter, ni bot, ni extension. Un lecteur peut en déduire qu'une newsletter sponsorisée est exclue. Si c'est voulu, rien à faire ; sinon, à trancher par Thomas avec @legal (ce serait une décision de portée, hors de cette revue).

## Points vérifiés sans remarque

- « Base de vannes » vs cache 24 h : pas de contradiction (une vanne gardée 24 h n'est pas une base), sous réserve de B1 pour l'accumulation bot/newsletter.
- Attribution : champ `attribution.required: true` (developers.ts:77) cohérent avec « lien visible à côté » FR/EN.
- « Sans cookie, ne suit pas tes visiteurs » : cohérent avec TEXTE_AFFICHAGE et TEXTE_VIE_PRIVEE ; l'adaptation « The API sets no cookies » est juste.
- Ligne de backlink facultative (widget-programme.ts:28) cohérente avec la parenthèse des Conditions ; son retrait en EN est justifié (n'existe pas dans l'API).
- Fidélité EN : « sans nous demander » → « without asking us », « telle quelle » → « as is », « contenu inapproprié, abus » → « inappropriate content, abuse » : exacts.

## Top 3

1. B3 : compléter les interdits des Conditions (archiver, entraîner une IA) pour que le texte à l'ancre `#licence`, qui fait foi, contienne toutes les règles.
2. B1 : une phrase qui dit ce que deviennent les messages de bot et les newsletters déjà envoyés.
3. B2 : « cache côté client » → « cache de ton côté (serveur ou navigateur) », FR et EN.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-licence-elargie-s22.md`
- Décision : NO-GO, 7,5/10, 3 bloquants (B1 bot/newsletter vs archivage, B2 « côté client », B3 ancre `#licence` incomplète), 5 à corriger, 6 optionnels.
- Agents à relancer : @legal (textes FR puis EN, le commentaire de developers.ts:4 impose son visa), puis @fullstack pour l'intégration (REPLIT_ACTIONS.md), puis nouvelle relecture à l'aveugle des seuls points corrigés.
- Point d'attention : B1 est une clarification de la portée décidée, à faire valider par @legal ou Thomas avant intégration.
---
