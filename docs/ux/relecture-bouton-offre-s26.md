# Relecture UX à l'aveugle : bouton d'offre de l'en-tête (s26)

Périmètre : 5 libellés évalués pour Yanis (20 ans, étudiant, méfiant sur le paiement) face à la page d'arrivée `/abonnement` (titre « Premium ouvre tout Deviens Marrant »). Docs copy et growth s26 non lus, volontairement.

## Grille

Critères : C1 compréhension en 2 s de ce qui se passe au clic (page de prix, pas paiement) · C2 attente vs arrivée (H2 langage du persona, H4 cohérence) · C3 cohérence avec le repli « Premium » · C4 nom accessible (WCAG 2.5.3) · C5 friction ou méfiance.

| Candidat | C1 | C2 | C3 | C4 | C5 | Note |
|---|---|---|---|---|---|---|
| Premium · 1,99 €/mois | OK : nom d'offre + prix = « je vais voir une offre » | OK : le mot « Premium » est repris dans le titre d'arrivée | OK : même mot, juste raccourci | OK | Faible : nom d'offre sobre, pas de verbe d'achat | **8** |
| Tout ouvrir · 1,99 €/mois | Bon : bénéfice clair, verbe non financier | Bon : écho de « ouvre tout », mais le mot « Premium » n'apparaît qu'à l'arrivée | Moyen : deux mots différents selon la largeur, sans lien visible | À piloter (voir plus bas) | « Tout » promet large, léger risque de survente | **7** |
| Je m'abonne · 1,99 €/mois | Clair sur l'engagement, mais annonce un acte | Écart H2/H4 : on attend un paiement, on arrive sur une page de vente | Mauvais : « Je m'abonne » devient « Premium », deux sens | À piloter | Le plus méfiant : engagement perçu avant d'avoir vu l'offre | **5** |
| Bosser ta répartie · 1,99 €/mois | Bénéfice fort, mais on croit à un exercice ou un cours | Écart : la page parle de « Premium ouvre tout », pas de répartie | Mauvais : repli « Premium » sans rapport | À piloter | Déborde à 768 px : écarté d'office | **4** |
| Mieux répondre · 1,99 €/mois | Flou (répondre à quoi ?) | Idem, promesse sans écho à l'arrivée | Mauvais | À piloter | Déborde à 768 px | **3,5** |

## Classement

1. Premium · 1,99 €/mois (8)
2. Tout ouvrir · 1,99 €/mois (7)
3. Je m'abonne · 1,99 €/mois (5)
4. Bosser ta répartie · 1,99 €/mois (4)
5. Mieux répondre · 1,99 €/mois (3,5)

## Mon choix : garder « Premium · 1,99 €/mois »

- Le prix visible suffit à dire « page de prix » : il n'y a pas de verbe d'achat, donc pas de promesse de paiement immédiat (H2).
- Un seul bouton, un seul mot : sous 640 px et de 1024 à 1279 px il devient « Premium », c'est le même libellé coupé, jamais un autre mot (H4). Les 4 autres changent de sens au repli.
- Le titre d'arrivée reprend « Premium » : le lien bouton-page est immédiat. « Tout ouvrir » reste une bonne option si Thomas veut un bénéfice, mais il perd ce lien et ajoute un mot à apprendre.
- Les deux « Bosser » et « Mieux répondre » promettent un résultat que la page n'annonce pas, et débordent à 768 px.

## Points à vérifier côté code, quel que soit le libellé

- **WCAG 2.5.3** : le nom accessible doit commencer par le texte visible à chaque largeur. Pas d'`aria-label` fixe long (« Premium, 1,99 € par mois » sous un bouton qui affiche juste « Premium » reste conforme, mais « Tout ouvrir » sous un label « Premium » échouerait). Le plus sûr : pas d'`aria-label`, et masquer la partie « · 1,99 €/mois » par `display:none` au repli, ce qui la retire aussi du nom.
- Cible tactile ≥ 44 px de haut, focus visible, contraste sur le fond collant.
- Mesure : suivre le clic bouton puis le passage au paiement depuis `/abonnement`, pour vérifier que le libellé choisi n'envoie pas de visiteurs « qui croyaient payer » rebondir.
- Largeur de « Je m'abonne · 1,99 €/mois » non mesurée : à confirmer si ce candidat était retenu.
