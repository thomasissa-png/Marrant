# Relecture à l'aveugle : licence élargie de la vanne du jour (s22, v3)

Date : 2026-10-24. Relecteur : @reviewer (sans lecture de docs/reviews/).
Périmètre lu : `CONDITIONS_UTILISATION`, `LICENCE_API` et la phrase de renvoi (section « Pour les développeurs ») dans `apps/web/src/app/(dashboard)/integrer-la-vanne-du-jour/page.tsx:52-57, 180, 189-192` ; `TEXTE_VIE_PRIVEE`, `TEXTE_LICENCE_USAGE`, `TEXTE_LICENCE_CONDITIONS`, `TEXTE_LICENCE_FOI` dans `apps/web/src/config/textes/developers.ts:124-139`.

## Contrôles

| Contrôle | Verdict | Évidence |
|---|---|---|
| Portée décidée respectée (site, appli, bot, extension, newsletter, pub, lien visible, 5 interdits, cache 24 h) | PASS | page.tsx:53 et 57, developers.ts:135 et 137 |
| Résumé FR = détail FR (aucune règle restrictive présente d'un côté seulement) | PASS | Les 5 interdits, le cache 24 h, le lien visible, l'exception des messages déjà envoyés, l'absence de garantie et la coupure d'accès figurent dans les deux |
| FR = EN (résumé et conditions) | PASS | Seules différences : celles qui sont documentées dans le commentaire developers.ts:127-133 (lien du cadre, ligne facultative, « The API », cache sans condition). Elles sont cohérentes avec un usage par l'API |
| Affirmations vérifiables | PASS | Aucun cookie posé dans `api/widget/v1/vanne-du-jour/route.ts`. « ne suivent pas tes visiteurs » n'est pas contredit par `TEXTE_VIE_PRIVEE` (journaux techniques et domaine appelant uniquement) |
| Français correct | PASS | « ne… ni… ni », accords (« ton site… ou ta newsletter a », « déjà envoyés ») corrects |
| Anglais correct | PASS | Rien de fautif |
| Tiret cadratin ou demi-cadratin | PASS | Aucun dans les 7 textes |

## Bloquants

Aucun.

## Remarques non bloquantes (exactitude, pas de style)

1. **Renvoi « juste en dessous »** (page.tsx:180) : le résumé ne vient pas juste après. Il y a d'abord le paragraphe « Toute la documentation… » (l. 182-188). Actuel : « résumées juste en dessous » → proposé : « résumées un peu plus bas ».
2. **Tension interne de lecture littérale** (page.tsx:53 et developers.ts:137) : « ce qui est interdit, c'est de garder les vannes de côté pour les ressortir » décrit aussi, à la lettre, un cache. La phrase suivante autorise explicitement 24 h, et la règle spécifique l'emporte, donc pas de contradiction réelle. Correction possible : « …pour les ressortir plus tard (au-delà du cache de 24 h) ou les rassembler » / « …to reuse them later (beyond the 24-hour cache) or gather them together ».
3. **« gratuitement » / « free of charge » dans le résumé** (page.tsx:57, developers.ts:135) : le résumé ne mentionne pas la publicité. On peut donc lire « afficher gratuitement » comme une restriction à l'usage non commercial, alors que le détail autorise la pub. C'est sans conséquence, car le détail est juste en dessous et la version FR prévaut.
4. **`TEXTE_LICENCE_FOI`** : l'URL renvoie vers `#licence`, c'est-à-dire les conditions. Or le paragraphe « Usage license, in short » traduit le résumé, qui se trouve juste au-dessus de cette ancre. L'écart est négligeable, puisque l'utilisateur arrive sur la bonne zone de la page.

## Note et verdict

**Note : 9/10.** Zéro bloquant, aucune contradiction FR/EN ni entre le résumé et le détail, la portée décidée est couverte en entier. Le point retiré correspond aux remarques 1 et 2, qui peuvent être corrigées sans nouvelle relecture complète.

**Verdict : GO.**

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-licence-elargie-s22-v3.md`
- Décisions prises : GO, note 9/10, aucun bloquant
- Points d'attention : 4 remarques non bloquantes (renvoi « juste en dessous », tension cache/« garder de côté », « gratuitement » ambigu dans le résumé, ancre FOI). Si on les corrige, re-vérifier seulement la parité FR/EN des phrases touchées
---
