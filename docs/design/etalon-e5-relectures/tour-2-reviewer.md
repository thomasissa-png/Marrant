# E5, relecture à l'aveugle, tour 2 : @reviewer (cohérence et exactitude)

> 12/11/2026. v4.1 relue contre les 18 fautes de `tour-1-reviewer.md`. Lus : `etalon-e5-s24.md` §0 à §0.4, les 4 HTML (Grep et lecture ciblée), captures : premier écran 375, habitué 375, cloche 2 réponses, parcours 375 et jour 1, rafale « réponses », Aujourd'hui à 200 %, Mes questions « retard ».

## Notes
| Critère | Tour 1 | Tour 2 |
|---|---|---|
| Cohérence | 6 | 8/10 |
| Exactitude des textes | 8 | 9/10 |
| Fidélité aux décisions | 8 | 9/10 |
| Complétude (ligne E5) | 5 | 6/10 |

## Fautes du tour 1 : vérification
- **Levées (15)** : 1, 2, 3 (jour 1 sans repère, sans étape ni « Ton mois », cloche vide, capture conforme) ; 4 (N4 : seul « Commencer » au premier écran 375 × 812) ; 5 (« Jouer les cartes » marqué) ; 6 (« Tiens ») ; 7 (« 5 min », 4.1) ; 8, 15 (marqués) ; 9 (geste E1.1 entier puis retour, puis note) ; 11 (pluriel, lignes type + date, sans doublon) ; 12 (« Aujourd'hui » épinglée, vue à 375 sur Mes questions et à 200 %) ; 13 (loupe à 375 et à 200 %) ; 14 (6 novembre) ; 16 (quatre lignes) ; 18 (onglet vers `parcours.html` sur les 4 pages).
- **Déclarée, acceptée** : 10 (règle E1.1 en trois phrases) : l'étalon validé prime ; écart à faire trancher par @creative-strategy, comme écrit en §0.3.
- **Non vérifiable** : 17 (lignes de rafale à 200 %) : aucune capture de l'état habitué à 200 %. Ajouter `aujourdhui.html#etat=habitue` à 200 %.

## Fautes nouvelles
| # | Fichier / état | Faute | Correction |
|---|---|---|---|
| N1 | 4 HTML l. 23 (règle `[data-hyp]::after`) ; toutes les captures, bas à gauche | La règle vise aussi `<body data-hyp="on">` : « [on] » s'affiche en bas de chaque page (« [off] » avec `hyp=off`). Valeur brute visible | `body [data-hyp]::after`, ou renommer l'attribut du body (`data-marqueurs`) |
| N2 | `parcours-jour1-375.png` | La capture montre l'état habitué (Confiance 3 sur 6, cap 3). L'état jour 1 (`parcours.html` l. 263-272 : Répartie, « Tes premières répliques », « Commencer l'étape 1 », cap 1) n'est pas prouvé | Refaire la capture avec `#etat=jour1` |
| N3 | `aujourdhui-cloche-reponses2-ouvert-375.png` | Premier pas du jour 1 et 2 réponses de l'équipe sur le même écran : combinaison impossible. Le lien l. 298 est juste (`etat=rafale`), c'est la capture qui ne l'a pas suivi | Refaire la capture avec `#etat=rafale&cloche=reponses2&ouvert` |
| N4 | `parcours.html`, calendrier, ligne « Semaine 1 » | « Aucun parcours à suivre. » déforme 4.1 (« aucun (facultatif) ») et contredit, dans la même carte, « Étape conseillée : Répartie, Commencer l'étape 1 » (`#etat=jour1`) | « Parcours : facultatif cette semaine. » [HYPOTHÈSE, @copywriter, ligne 13 de §0.4] |
| N5 | `aujourdhui-375-zoom200.png`, carte du premier pas | « 5 min » collé au bouton (« 5 minCommencer »), sans espace | Écart de 8 px dans la rangée, ou « 5 min » sur sa ligne si N4 tient encore à 200 % |
| N6 | `mes-questions-etat-retard-375.png`, barre | Avec « Aujourd'hui » épinglée, « …othèque » coupé à côté d'elle se lit « Aujourd'hui othèque » | Fondu gauche plein sur 16 px après l'onglet épinglé (point @ux) |

## Non-rendus déclarés : acceptables ou bloquants ?
La ligne 9 E5 les demande, et la justification « temps » (§0.1 point 8) va contre le commandement 5 et la règle du fondateur « itérer jusqu'à 10/10 » (l. 163).
- **Bloquants pour 10/10** : la **page de succès** (décision C14, « Continuer » dominant, lien de renonciation : texte à portée juridique, test explicite de la ligne E5) ; l'**écran « Mes répliques »** (2.7 : état vide validé, modification et suppression depuis la liste ; l'accessibilité de la note est un objet nommé de E5) ; la **mission avec ses retours** et la **question de bilan** (objets nommés de la ligne E5, aucun rendu pour les calibrer).
- **Acceptables pour cet étalon, à rendre avant le dossier pour Thomas** : l'**ordre de tirage** (une règle, pas un écran : un tableau dans `etalon-e5-s24.md`, plus une liste de rafale du jour 1 qui la montre, suffit) ; les états **« retiré »** et **« abonnement terminé »** de Mes questions (2.6, peu coûteux, risque faible) ; le contenu chiffré de « Ton mois » (aucune valeur n'existe) ; la question C9 (absente à juste titre avant le premier pas).

## Verdict
NO-GO tour 2, pour la complétude seulement. Les textes et la cohérence sont presque au niveau. Top 3 : (1) rendre la page de succès, « Mes répliques », la mission et le bilan ; (2) N1 (« [on] » visible sur toutes les pages) ; (3) refaire les captures N2, N3 et la 17, puis corriger N4. À relancer : @design (N1, N5, N6, écrans manquants), @copywriter (N4 et §0.4), la session pour les captures.
