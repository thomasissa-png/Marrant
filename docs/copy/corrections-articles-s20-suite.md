# Corrections articles blog, s20 (suite)

Fichier source : `apps/web/src/lib/blog-articles.ts` (non modifié par cette livraison, remplacements à appliquer par @fullstack).

## 1. Article `timing-humour`, FAQ « Comment améliorer son timing comique ? » (ligne 316)

**Décision** : Thomas, 12/10. Une seule durée de pause sur le site, « une seconde environ » avant la chute. Plus de « règle des 3 secondes », plus de « compte un, deux, trois ».

**Avant** (extrait unique, ligne 316) :

`pratique la règle des 3 secondes en conversation (compte « un, deux, trois » dans ta tête avant de lâcher ta remarque)`

**Après** :

`laisse passer un temps en conversation (une seconde environ) avant de lâcher ta remarque`

**Réponse complète résultante** (le reste est inchangé mot pour mot) :

`Trois exercices : analyse les silences dans les sketches de Roman Frayssinet ou Blanche Gardin (chronomètre en main), laisse passer un temps en conversation (une seconde environ) avant de lâcher ta remarque, et marque des pauses volontaires avant tes punchlines. Inconfortable au début, redoutable au bout d'une semaine.`

**Raison** : aligner la FAQ sur la règle du site (« une seconde environ », déjà dans le « À retenir » ligne 252 et le paragraphe ligne 256). « Laisse passer un temps » plutôt que « marque un temps », parce que le troisième exercice de la même phrase commence déjà par « marque » : on évite la répétition. Phrase testée à voix haute, une seule parenthèse, zéro tiret cadratin.

**Point d'attention (hors périmètre, non modifié)** : le même article contient encore l'ancienne formulation, ce qui crée une incohérence avec la FAQ corrigée.
- Ligne 254, H2 : `## Comment utiliser la règle des 3 secondes ?`
- Ligne 262 : `Pourquoi « 3 secondes » ? Parce que le réflexe se compte en trois temps dans ta tête, « un, deux, trois », sans traîner : ça tient en une seconde environ...`

Ligne 266 (« trois secondes sans parler ») est une image du malaise du silence, pas une consigne de pause, à garder si Thomas le souhaite. Le H2 ligne 254 est un intouchable (slug/ancre, mot-clé potentiel) : toute modification passe par une décision de Thomas et un contrôle SEO. À trancher avant déploiement.

## 2. Article `confiance-humour-apres-rupture` (ligne 3289)

**Avant** (extrait unique, ligne 3289) :

`**Waly Dia** utilise systématiquement ce troisième niveau dans ses spectacles`

**Après** :

`**Waly Dia** utilise souvent ce troisième niveau dans ses spectacles`

**Raison** : « systématiquement » est invérifiable (il faudrait avoir passé tous ses spectacles au crible). « Souvent » reste vrai, garde la force de l'exemple et la citation de l'humoriste est conservée (règle P0 s15). Reste de la phrase inchangé.

---

**Handoff → @fullstack** : appliquer les deux remplacements ci-dessus dans `apps/web/src/lib/blog-articles.ts` (lignes 316 et 3289, extraits uniques), documenter dans `REPLIT_ACTIONS.md`, et remonter à Thomas l'incohérence restante lignes 254 et 262 de `timing-humour`.
