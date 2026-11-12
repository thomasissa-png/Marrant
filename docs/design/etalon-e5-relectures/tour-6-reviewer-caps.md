# E5 v8.1, caps et bonus : tour 6, @reviewer

> 12/11/2026. Relus : `etalon-e5-s24.md` §0 v8.1 ; `parcours.html` l. 299-315, `bibliotheque.html` l. 162 et 225, `bonus.html` l. 248-255 ; captures : page neutre, bonus du cap 5, recherche au cap 1 ; `not-found.tsx` ; `search-bar.tsx` l. 266-276.

| Cohérence | Exactitude | Fidélité | Complétude |
|---|---|---|---|
| 10/10 | 9/10 | 10/10 | 10/10 |

## C1 à C6 : confirmés à l'aveugle
- **C1** : fiche du cap 5 rendue (« 5 min · Facultatif », trois sections entre crochets, contre-exemples « réécrits et relus, jamais les originaux »). Liens `cap=5` justes : regex `[2-5]` (`bonus.html` l. 248), « Tes bonus » vers `bonus.html#cap=n` (`parcours.html` l. 306), « Ouvrir » borné à 5 (l. 311), Bibliothèque au cap de l'abonné (l. 315).
- **C2** : la capture montre bien la page neutre.
- **C3** : réponse identique à `not-found.tsx` (texte, deux boutons, aucun onglet actif), donc un bonus fermé ne se distingue plus d'une adresse inexistante.
- **C4** : « Les phrases citées, en texte », avec « jamais le passage en entier ».
- **C5** : durée affichée sur chaque fiche et chaque ligne.
- **C6** : au cap 1, la recherche « Waly Dia » ne renvoie aucun bonus et aucune trace ; au cap 3, la fiche apparaît, marquée.

## Faute restante
| # | Fichier / état | Faute | Correction |
|---|---|---|---|
| R1 | `bibliotheque.html#cap=1&rech&q=Waly+Dia` | « Aucun résultat » [HYPOTHÈSE] alors que le site a son texte : `search-bar.tsx` l. 270-274, « Rien trouvé pour « {query} ». Essaie une de ces pistes : » plus des suggestions (« Aucun résultat » n'en est que le nom accessible) | Reprendre ce texte et ses suggestions mot pour mot, retirer le marqueur ; vérifier que la liste `SUGGESTIONS` ne contient jamais un bonus |

## Emoji de la 404 : avis
**Il reste dans la maquette.** §5.4 exige une réponse identique à une adresse inexistante : un bonus fermé qui afficherait une 404 sans emoji serait reconnaissable (critère 19 cassé). La règle « aucun émoji » vaut pour l'espace (architecture 4.4, `niveaux-xp` 3.0 point 5), pas pour une page publique du site. **À signaler à Thomas, hors périmètre** : la 404 du site (`not-found.tsx` l. 16-18, 🤔) contredit la règle sans émoji de l'espace, et un abonné la verra depuis l'espace. Si Thomas veut la retoucher, on change la page unique, dans un seul composant, pour toutes les adresses : jamais une 404 propre à l'espace qui divergerait. À vérifier au développement : la 404 vue par un abonné dans `/mon-espace` doit avoir la même mise en page (barre comprise) qu'une adresse inexistante.

## Verdict
GO dès R1 corrigé (texte du code, sans création). Aucun autre point.
