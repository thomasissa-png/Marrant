# E5 v8, caps et bonus : relecture à l'aveugle, @reviewer

> 12/11/2026. Relus, ajouts v8 seulement : `parcours.html` (annonce, `#cap=1..5`, « Tes bonus »), `bibliotheque.html`, `bonus.html`, captures (passage cap 2, cap 5, Bibliothèque cap 1, bonus neutre). Contre `niveaux-xp-s24.md` §3.0, §4, §5.3, §5.4, §5.6 ; `founder-preferences.md` l. 168-172 ; étalons E4 et E6 ; transcription Mirabel (en-tête) ; `app/not-found.tsx`.

## Notes
| Cohérence | Exactitude | Fidélité | Complétude |
|---|---|---|---|
| 8/10 | 10/10 | 8/10 | 8/10 |

## Ce qui est exact
- **Annonces mot pour mot** (§3.0 et §5.4) : « Nouveau cap : {nom}. » et « Un bonus s'ouvre dans la Bibliothèque : {titre}. ». Une seule annonce si les deux arrivent ensemble ; « Ouvrir » n'apparaît que si un bonus s'ouvre ; fermable, jamais retirée seule ; rien dans « Aujourd'hui ».
- **Noms et ordre des caps** (Q3) : `parcours.html` l. 294, avec « cap n sur 5 » et le nom avant. Phrase du cas 5.5 mot pour mot.
- **Humoristes** : Frayssinet au cap 2, Dia au cap 3, Pascot au cap 4 (`bonus.html` l. 220). Aucune citation, tout est entre crochets.
- **E6** : nom et texte d'entrée mot pour mot (E6 l. 15). « Sortir » n'est pas rendu, ce qui est cohérent avec le [À CONFIRMER] de E6 l. 20.
- **Grille 2.4** reprise ; texte de la page neutre exact.
- **Bonus non ouvert** : absent de la Bibliothèque au cap 1 (capture : ni ligne, ni gris, ni phrase), absent de la cloche (aucune ligne de bonus), pas de « Tes bonus » au cap 1. Aucun cadenas, « verrouillé » ni « il te manque ».

## Fautes et corrections
| # | Fichier / état | Faute | Correction |
|---|---|---|---|
| C1 | `bibliotheque.html` l. 159 ; `bonus.html` l. 222 ; `parcours.html` l. 302 et 305 | Le bonus du cap 5 n'a pas de fiche. La ligne de la Bibliothèque mène à `bonus.html#cap=5`, que la regex `[2-4]` ne reconnaît pas : elle affiche le bonus du cap 3 (Waly Dia). « Tes bonus » au cap 5 mène à `bibliotheque.html#bonus`, sans cap : la page retombe au cap 3, et les bonus 4 et 5 y sont masqués. Une annonce au cap 5 ouvrirait le bonus 4 | Rendre la fiche « coulisses de la maison » (§5.3 : fiche de 5 min, contenu entre crochets, porte « Vocabulaire et techniques ») ; liens `cap=5` corrects ; « Tes bonus » transmet le cap |
| C2 | `bonus-neutre-375.png` | La capture montre la fiche du bonus (Waly Dia), pas la page neutre : le critère 19 n'est pas prouvé | Refaire avec `#etat=neutre` et `#cap=3&moi=1` |
| C3 | `bonus.html` l. 165-173, page neutre | §5.4 : « même réponse qu'une adresse inexistante ». Or la page garde la barre avec « Bibliothèque » active et deux liens propres, alors que la vraie 404 du site (`not-found.tsx`) dit autre chose (« Page introuvable », « Oups, cette page a oublié sa punchline », « Retour à l'accueil », « Voir les vannes ») : les deux réponses se distinguent | Une seule page « introuvable » pour toute adresse inexistante de `/mon-espace` et pour un bonus fermé : même texte, mêmes liens, aucun onglet actif. Écart entre le texte de §5.4 et la 404 du site à trancher par @ux et @copywriter |
| C4 | `bonus.html` l. 153, « Transcription du passage » | Le titre annonce le passage entier (1 à 2 min). Or l'en-tête de la source Mirabel dit « ne jamais publier ce texte en entier : seules des citations courtes, relues », et §5.3 parle d'une « citation courte et minutée ». E4 n'a pas cette section | Titre [HYPOTHÈSE] « Les phrases citées, en texte » ; contenu : les seules citations des « Trois choses à repérer », minutées, jamais le passage complet |
| C5 | `bonus.html` l. 141 | §5.3 : « une durée affichée, facultatif ». Seul « Facultatif » est rendu | Ajouter la durée totale (« [n] min », comme les 2 et 5 minutes de E4) à côté de « Facultatif » |
| C6 | `bibliotheque.html`, `#rech` | La recherche s'ouvre sans résultat : « absent de la recherche » (§5.4) n'est pas démontré | Un état de résultats pour une requête qui viserait un bonus : au cap 1 aucun résultat de bonus, au cap 3 la fiche marquée |

## Verdict
NO-GO tour 5 pour 10/10. Textes et décisions fidèles ; à reprendre : la cohérence des liens du cap 5 et de la page neutre, la règle des citations courtes, la complétude (fiche du cap 5, recherche). Top 3 : C1, C3, C4. À relancer : @design (C1, C3 à C6), la session (C2), @copywriter et @ux (texte de la page neutre).
