# Soumission Free Public APIs : API « La vanne du jour » (s22, 24/10/2026)

À faire par Thomas, APRÈS la mise en ligne de `/developers` (sinon le robot lit une 404). Rien n'est publié au nom de l'IA.

## Ce qu'on a vérifié sur l'annuaire (24/10/2026)
- Formulaire : https://www.freepublicapis.com/new . Une seule saisie : l'URL de la documentation de l'API.
- Ensuite tout est automatique : un robot lit la doc, vérifie que l'API est gratuite, trouve les points d'accès ouverts (sans clé) et les teste. Seuls les points qui répondent sont listés, puis ils sont rappelés chaque jour (note de santé : latence, erreurs, fiabilité).
- Critères : gratuite (au moins pour le développement), au moins un point d'accès sans clé, lien vers la doc propre à l'API. Exclus : API payantes seules, doublons.
- Lien obtenu : sur une fiche publiée (Cat Facts API), le lien « Documentation » pointe vers la doc avec `?ref=freepublicapis.com`, **sans `nofollow`** (balise `<a class="docs-link" target="_blank" href=…>`, aucun attribut `rel`). Lien suivi vers `/developers`.
- Offres payantes de l'annuaire (25 $ pour une API payante, sponsoring à partir de 99 $/mois) : sans objet pour nous.

## Ce que le robot trouvera chez nous
- `/developers` : page statique, indexable, canonique `https://deviens-marrant.fr/developers` (le `?ref=` ne crée pas de doublon).
- Point d'accès `GET https://deviens-marrant.fr/api/widget/v1/vanne-du-jour` : 200 JSON depuis un serveur (testé avec les user-agents python-requests et Go, et sans user-agent), CORS `*`, sans clé.
- `robots.txt` autorise `/api/widget/` (après déploiement).
- Appel quotidien du robot : bien en dessous de la limite (10 requêtes par 10 s par IP). Il apparaîtra dans les liens avec `utm_content=inconnu` (appel serveur sans Origin ni Referer) ; il n'est pas compté dans les affichages du widget (seul l'iframe est compté).

## Étapes pour Thomas
1. Vérifier que `https://deviens-marrant.fr/developers` répond en ligne.
2. Ouvrir https://www.freepublicapis.com/new , coller `https://deviens-marrant.fr/developers`, cliquer « Fill in API info », relire ce que le robot a compris (nom, description, catégorie : Humour / Entertainment), valider.
3. Me donner l'URL de la fiche créée : je vérifie la fiche, le lien sans `nofollow` et le premier test du robot.

## Ensuite (une soumission à la fois, après retour de celle-ci)
Find an API, Launching Next, GetFreeAPIs, API List : vérification des conditions et du type de lien au cas par cas avant chaque soumission (aucune affirmation « dofollow » reprise sans contrôle).
