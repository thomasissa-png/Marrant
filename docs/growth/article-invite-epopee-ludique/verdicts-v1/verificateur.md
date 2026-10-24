# Relecture à l'aveugle, tour 1 : le vérificateur (texte v1)

Lu : consignes publiées de L'Épopée Ludique, `grille-relecture.md`, `faits-verifies.md`, `texte-v1.md`. Rien d'autre.
Hors notation : phrase de transparence et bio.

**Note globale : 7/10.** Moyenne des 8 critères : 7,9. Plafonnée à 7 parce que 3 contraintes binaires sont en FAIL (orthographe, tics d'IA, écart au plan dans « Rire avec son enfant »). Sous la barre : v2 obligatoire.

## 1. Contraintes binaires

| # | Contrainte | Verdict | Preuve |
|---|---|---|---|
| 1 | Titre exact, titre SEO et méta fournis | PASS | L1 identique au titre imposé ; L3 titre SEO (environ 58 caractères) ; L5 méta (environ 150 caractères). |
| 2 | Corps de 1 300 à 1 600 mots | PASS | Compté à la main, phrase par phrase, de « Il est 18 h 40 » à « début de fou rire » : **1 417 mots** avec intertitres et libellés (Dès, Matériel, La règle…), **1 364** sans les intertitres. Convention : forme élidée collée au mot suivant = 1 mot, « 3-5 » = 1 mot, ponctuation isolée non comptée. Marge d'erreur estimée ±1 %. |
| 3 | Tutoiement partout | PASS | Grep `vous|votre|vos` : 0 occurrence. |
| 4 | Mot-clé : 100 premiers mots, intertitre de conclusion, au plus 2 de plus | PASS | Grep « jeux en famille sans matériel » dans le corps : 2 occurrences. L7, mots 45 à 49 du corps ; L97, intertitre de conclusion. Occurrences supplémentaires : 0. Aucune ne sonne forcée. Réserve : L11 « se jouent tous sans matériel » refait l'écho deux phrases plus loin, pour rien (voir 4.3). |
| 5 | 6 jeux dans l'ordre du plan, format complet | PASS | Jeux 1 à 6 dans l'ordre du plan ; chacun a Dès, Matériel : aucun, La règle, Exemple, Selon l'âge (3-5 / 6-8 / 9 ans et plus), S'il ne veut pas jouer. |
| 6 | Adaptations du plan, jeu par jeu | PASS (réserve) | Toutes présentes. Réserve jeu 1, 9 ans et plus : « on enchaîne les conséquences » est illustré par **une seule** conséquence (L21), donc aucun enchaînement montré. |
| 7 | Exemples développés en une ou deux répliques | PASS | Jeux 1, 2, 3, 5, 6 : répliques citées ; jeu 4 : monologue météo développé. |
| 8 | Sections « Rire avec » et « Blague à plat » conformes au plan | **FAIL** | Le plan demande « on s'arrête dès qu'il ne rit plus ». L89 écrit « S'il baisse les yeux, arrête tout de suite », ce qui est plus étroit : entre « il rit » et « il baisse les yeux », le texte ne dit rien. La section « Blague à plat » couvre bien les 5 points (ne pas expliquer, ne pas répéter, sourire, saluer, passer). |
| 9 | Liens : exactement les 2 URL prévues | PASS | L81 `https://deviens-marrant.fr/blog/humour-quotidien-8-habitudes`, ancre « petites habitudes d'humour au quotidien » ; L105 `https://deviens-marrant.fr/`. Aucun autre lien. |
| 10 | Transparence et bio | HORS NOTATION | En attente de la décision de l'auteur (voir point d'attention en fin de fichier). |
| 11 | Typographie, orthographe, concurrents | **FAIL** | Grep `—` et `–` : 0. Guillemets droits : 0. Émoji : 0. Guillemets français : tous avec espace insécable (Grep `«` sans insécable : 0). Concurrent nommé : 0. **Mais 2 fautes** : L23 « lance-en un » (impératif suivi de « en » : « lances-en un ») ; L87 « drap housse » (s'écrit « drap-housse »). |
| 12 | Zéro anecdote vécue, zéro enfant d'Alex, zéro chiffre sans source | PASS | Les seules premières personnes (« à ma place » L43, « j'ai surtout regardé le plafond » L81) sont des répliques de joueurs entre guillemets. Seuls nombres : ceux listés dans `faits-verifies.md`. Réserve : l'exemple du chien du voisin (L79) n'est attribué à personne ; un lecteur pressé peut le lire comme un souvenir de l'auteur (correction en 3.5). |
| 13 | Zéro formule typique d'IA | **FAIL** | Antithèse « ne devient pas plus drôle, juste plus longue » (L95) ; triplet réflexe « sa règle, son exemple et sa version selon l'âge » (L11) ; aphorismes de fin de paragraphe (L11, L95, L99) ; « Le critère est simple » (L89). Liste complète en section 3. |
| 14 | Texte inédit (recoupement avec les 38 articles) | NON VÉRIFIÉ ICI | Revient à la session (grille). |
| 15 | Aucune promotion hors jeu 6 et bio | PASS (réserve) | Deviens Marrant n'apparaît que dans le lien et la bio. Réserve : la phrase-pont du lien (L81) avance une affirmation non démontrée, qui sert surtout à amener le lien (voir 4.6). |

Recommandation hors grille : les 42 espaces devant « : », « ? », « ! » sont des espaces ordinaires, comme celles de « 18 h 40 » (L7, L101). Sur mobile, un deux-points peut se retrouver seul en début de ligne. Passer en espaces insécables (U+202F ou U+00A0) avant l'envoi du document.
