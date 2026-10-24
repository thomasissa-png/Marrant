# Widget « La vanne du jour » : synthèse de la spec (s22, 24/10/2026)

Volets détaillés : `docs/seo/widget-replique-du-jour-s22-seo.md` (@seo, technique) et `docs/growth/widget-replique-du-jour-s22-growth.md` (@growth, contenu, distribution, mesure). Go de Thomas pour la spec le 24/10 ; aucun code avant son go.

## Ce que ça rapporte, honnêtement
- Règle Google vérifiée sur la page officielle (spam-policies, Link spam) : « Keyword-rich, hidden, or low-quality links embedded in widgets that are distributed across various sites » ; pas d'infraction si le lien est qualifié (`nofollow` ou `sponsored`).
- Donc : notoriété, trafic référent, recherches de marque, visibilité IA. Pas de gain de PageRank à attendre. Les liens éditoriaux (articles invités) restent le vrai levier.

## Ce qui est tranché
1. **V1 = « La vanne du jour »** (stock validé existant). « La réplique du jour » en V1.1, quand 90 situations + répliques auront passé la relecture à l'aveugle ; champ `type` prévu dès l'API.
2. **Format** : iframe servie par deviens-marrant.fr (`/embed/vanne-du-jour`, noindex, sans cookie ni Umami), script chargeur facultatif de moins de 2 Ko qui ne fait que créer l'iframe. Aucun texte injecté chez l'hôte (pas de duplication, pas de risque de schéma de liens).
3. **Lien** : un seul lien de marque « Deviens Marrant », visible, dans l'iframe, UTM `utm_source=widget` ; plus « Pourquoi ça marche ? » vers la fiche publique de la vanne. Aucun mot-clé en ancre ; `nofollow` sur tout lien posé dans la page de l'hôte.
4. **Contenu affiché** : amorce, bouton « Révéler la chute », lien. Ni prix, ni décryptage complet, ni Premium, ni archive.
5. **Sélection tout public** : liste d'identifiants relue à la main (au moins 90 jours au lancement), catégories DATING, SOIREES, COUPLE exclues. `maturityLevel` n'est défini nulle part dans le code (défaut 1, générateur 1 à 3) : il ne suffit pas comme filtre.
6. **API** : un point d'accès versionné `/api/widget/v1/vanne-du-jour` (pas `/api/daily`, qui renvoie la vanne complète), cache Cloudflare, 60 requêtes par minute par IP, CORS lecture seule, licence avec attribution obligatoire.
7. **WordPress** : shortcode + bloc qui rendent seulement l'iframe. La règle 10 du répertoire vise les crédits ajoutés dans la page de l'hôte ; notre lien est dans notre propre sortie (lecture @seo, à confirmer à la soumission). Phase 2, déclenchée par les seuils ci-dessous.
8. **Page du programme** `/integrer-la-vanne-du-jour` : indexable, dans le sitemap, code à copier, conditions d'usage. C'est elle qui peut attirer des liens éditoriaux.
9. **Mesure** [HYPOTHÈSE, à recaler après 30 jours] : J+30 ≥ 3 domaines actifs, ≥ 30 clics ; J+90 ≥ 10 domaines, ≥ 300 clics par mois, ≥ 20 inscrits à la lettre. Extension WordPress si ≥ 8 domaines dont la moitié sous WordPress.

## Décisions de Thomas (questions fermées)
1. V1 « La vanne du jour », réplique en V1.1 : oui / non ?
2. Exclure DATING, SOIREES et COUPLE de la sélection tout public : oui / non ?
3. Premiers sites démarchés : BRH et L'Épopée Ludique, 7 jours après la parution de leur article invité : oui / non ?
4. Lien de marque toujours présent dans l'iframe (non désactivable) : oui / non ?
5. Un article technique « comment intégrer la vanne du jour » publié par Alex sur une plateforme de développeurs : oui / non / plus tard ?

## Ensuite
@legal (licence, attribution, retrait), @copywriter (textes du widget et de la page, étalons d'abord), relecture à l'aveugle de la sélection, puis @fullstack (iframe, en-têtes `/embed/*`, API, page, comptage sans cookie, `REPLIT_ACTIONS.md`). Avant/après en images, CI verte, mise en ligne seulement sur go écrit.
