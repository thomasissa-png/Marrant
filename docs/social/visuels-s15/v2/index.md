# Cartes sociales « piste A », prototype rendu (s15, 05/10/2026)

Rendu réel par `next/og` (ImageResponse, même moteur que la production sous Workers), polices TTF de `apps/web/public/fonts/` (Inter + Syne). Script : `cd apps/web && npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-visuels-piste-a.ts`. Gabarit : `src/lib/social/templates/carte-marque.tsx`, `cartes-piste-a.tsx`, composition `src/lib/social/carrousel-piste-a.ts`, typographie `src/lib/social/typo.ts`. Chaque PNG a été ouvert et vérifié (débordement, coupure, orphelin). Rien n'est publié : la publication utilise toujours les anciens gabarits carrés.

## Fichiers

| Fichier | Cas | Texte affiché (mot pour mot, source) | Dimensions |
|---|---|---|---|
| ig-vanne-audioguide-1.png | Vanne, slide amorce | L’audioguide du musée s’est éteint dans la première salle. (file IG 06/10) | 1080×1350 |
| ig-vanne-audioguide-2.png | Vanne, slide chute (aplat #6D28D9) | J’ai hoché la tête pendant deux heures. | 1080×1350 |
| ig-vanne-tgv-1.png | Vanne, slide amorce | Dans le TGV, la seule prise qui marche est sous le siège d’un inconnu. (file IG 07/10) | 1080×1350 |
| ig-vanne-tgv-2.png | Vanne, slide chute, 2 temps | J’ai voyagé à genoux devant lui. / On n’en a jamais parlé. | 1080×1350 |
| ig-article-halloween-1.png | Article, couverture (ARTICLE, « 8 » géant) | Blagues d’Halloween : 8 vannes pour ta soirée déguisée | 1080×1350 |
| ig-article-halloween-2.png | Article, extrait | Vanne n° 2 de l’article (`docs/copy/articles-q4/S1-halloween.md`) : J’ai passé la soirée à expliquer mon costume. / À minuit, j’étais déguisé en guide de musée. | 1080×1350 |
| ig-article-halloween-3.png | Article, fin (aplat) | Les 7 autres vannes / sur deviens-marrant.fr / Lien en bio | 1080×1350 |
| ig-article-se-presenter-1.png | Article, couverture (« 5 » géant) | Se présenter avec humour : 5 accroches qui passent | 1080×1350 |
| ig-article-se-presenter-2.png | Article, extrait | Accroche n° 3 (`S2-se-presenter-avec-humour.md` l.94) : Moi, c’est Camille. Au jeu de mimes, ma carte disait “la timidité”. / J’avais à peine bougé qu’ils avaient trouvé. | 1080×1350 |
| ig-article-se-presenter-3.png | Article, fin | Les 4 autres accroches / sur deviens-marrant.fr / Lien en bio | 1080×1350 |
| ig-conseil-ironie-bienveillante-1.png | Conseil (étalon E7, `conseils-seed.json` id 42), situation | L’ironie bienveillante / Ton pote arrive avec 45 minutes de retard. | 1080×1350 |
| ig-conseil-ironie-bienveillante-2.png | Conseil, réplique (aplat) | Pile à l’heure. / Le serveur commençait à croire qu’on t’avait inventé. | 1080×1350 |
| x-vanne-tgv.png | Vanne TGV, X : chute seule, le tweet porte l’amorce | J’ai voyagé à genoux devant lui. / On n’en a jamais parlé. | 1600×900 |
| linkedin-vanne-tgv.png | Vanne TGV, LinkedIn : chute seule, le post porte l’amorce | idem | 1200×627 |

Légende Instagram attendue pour une vanne : l’amorce seule, jamais la chute (audit V5), à appliquer côté préparation des posts.

## Écarts avec l’audit (`docs/design/audit-visuels-sociaux-s15.md`)

1. **Syne n’est pas la police du site.** Le site charge Plus Jakarta Sans en police de titre (`src/app/layout.tsx`), `design-system.md` l.36 est périmé. Cartes faites en Syne comme l’audit le demande ; passer en Plus Jakarta Sans = 1 constante (`FONT_TITRE`) + 2 TTF. Décision de Thomas.
2. **Syne 800 est très large** : la chute est à 84 px, mais le corps est réduit automatiquement si un bloc insécable ne tient pas (`corpsSansDebordement`, plancher 28 px). Le « 1 » de Syne se lit comme un « ı » : extrait « Léo / alternant1 » écarté au profit de « Camille » (sans chiffre).
3. `textWrap: balance` non utilisé : les mots sont posés en blocs flex (satori élargit l’espace qui suit une insécable dans un nœud texte). L’anti-orphelin passe par `typo()` (deux derniers mots collés, petits mots et nombres collés). Défaut résiduel : espace un peu large après « TGV, » et « L’audioguide » (crénage satori), mineur.
4. **LinkedIn vanne** non prévu par l’audit : même principe que X (chute seule). Le carrousel conseil LinkedIn 1080×1350 reprend les slides Instagram, non rendu à part.
5. **Ajouts non spécifiés** `[PROVISOIRE, à valider]` : surtitre « Extrait : n° 2 sur 8 » et titre du conseil en surtitre ; la promesse d’un article = « Glisse → » + extrait réel en slide 2 + « Les N autres … » en slide 3 (aucune phrase inventée). Réplique du conseil coupée en 2 temps (mots inchangés). Monogramme « d » en Inter 800, plus proche du favicon que Syne.
6. Pied de marque + pagination gardés sur la slide chute (règle commune du §4, l’audit dit « rien d’autre » pour la chute).
7. Hors périmètre (logique de publication) : routage par `kind` dans `generate-post-image.ts`, légende = amorce seule.

## Carrousel côté Buffer

`createBufferImagePost` (`buffer-client.ts` l.342) envoie déjà `assets: [{ image: { url } }]`, un **tableau** : un carrousel est donc faisable en passant `imageUrls: string[]` et `assets: imageUrls.map(...)`, sans toucher au quota (1 post). `[À VÉRIFIER : l’API GraphQL Buffer accepte-t-elle plusieurs images pour un post Instagram de type post, et combien ; test sur un brouillon avant tout branchement]`.
À changer aussi : `generate-post-image.ts` rend N slides via `renderSlides()`, `uploadPostImage(postId, png, slide)` gère déjà l’index de slide, et `SocialPost.imageUrl` (une seule URL) devient une liste (colonne `imageUrls` ou JSON), lue par `publish-social/route.ts` l.294.
X et LinkedIn restent en image unique : aucun changement.
