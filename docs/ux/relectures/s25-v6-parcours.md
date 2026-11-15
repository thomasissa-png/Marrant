# Relecture UX à l'aveugle, s25 v6, groupe Parcours

Périmètre : `/parcours` et `/parcours/repartie`, comptes visiteur, gratuit, en-cours, nouvel, 5 largeurs (captures `docs/captures/s25/v6-tour-1/parcours/`). Limites : j'ai ouvert 11 captures sur 42 (en-cours 375/1280 liste et repartie, nouvel 1280/1920, visiteur et gratuit 1280) ; les autres largeurs sont inférées du code et de la parité des hauteurs d'INDEX (1280 = 1456 = 1920). Le filet dégradé violet des cartes et la valeur exacte des rayons ne sont pas lisibles à l'échelle des captures : non notés. Le capture `en-cours-parcours-375` a un timeout de navigation dans l'INDEX mais une image est produite.

## Ce qui est conforme (vu)
- Abonné, page d'un parcours : « 2 sur 4 étapes », barre, lignes numérotées avec statut « Fait » en texte plus coche, un seul bouton plein par ligne (« Reprendre », sinon « Voir »), boutons `min-h-11` (`sommaire-parcours.tsx` l.74). L'étape en cours (3) est dépliée, les étapes faites repliées avec coche. Lecture en 3 secondes : OK.
- Nouvel abonné : « 0 sur 4 », « Commencer » sur l'étape 1, aucune page morte.
- FAQ prix : visiteur/gratuit voient « 1,99 €/mois, c'est vraiment tout ? » (gratuit 1280) ; en-cours et nouvel ont 8 questions sans cette ligne. Masquage conforme. « Explore aussi » du gratuit porte « Abonnement 1,99 €/mois », absent chez l'abonné : conforme.
- Visiteur/gratuit sur un parcours : étape 1 lisible en entier, un seul bouton d'offre en page (« Passer à l'étape 2 · 1,99 €/mois »), étapes 2 à 4 verrouillées en aperçu, pas de mur ni de redirection.
- Colonne de lecture centrée (environ 740 à 770 px) à 1280, 1456, 1920 : pas de colonne collée à gauche ni de débordement visible.

## Notes

| Critère | Note | Motif |
|---|---|---|
| D1 Langue de l'accueil | 9 | Piste : H1 « Parcours » (abonné) et « Parcours humour… » (gratuit) alignés à gauche, titres de section « Les parcours », « Le programme » à gauche ; l'étalon centre hero et titres. Cartes sombres cohérentes avec le reste. Si l'espace entier assume l'alignement gauche (décision antérieure non lue), 10. |
| D2 Hiérarchie, lisibilité | 9 | Piste : sur `/parcours` l'abonné a 5 cartes de parcours très longues (intro, « Imagine Tom », programme) ; le bloc « Tes 4 premières semaines » ouvert pèse autant que la reprise. |
| D3 Aux 5 largeurs | 9 | Piste : à 1920, colonne de 766 px, soit 60 % de marge vide de chaque côté (centrée, donc pas de « vide à droite »). `/parcours/repartie` abonné : 6 380 px de haut à 375. |
| D4 Cohérence espace | 9 | Piste : sur `/parcours/repartie`, l'introduction (« Pour toi qui as toujours… », « Pour qui ? », « Imagine Tom ») est EN HAUT pour nouvel/visiteur et EN BAS (après le programme) pour en-cours (`en-cours-parcours-repartie-1280.png`). Deux ordres pour la même page selon l'avancement ; à confirmer comme voulu. |
| D5 Finition | 9 | Cibles 44 px confirmées dans le sommaire. Non vérifiable aux captures : contrastes `text-text-muted` des « +50 XP » sur étapes verrouillées (`parcours-step-card.tsx` l.279). |
| U1 Compréhension | 10 | Titre, statut, étape en cours, bouton unique par ligne. |
| U2 Action principale unique | 8 | Voir faute dure ci-dessous. |
| U3 États vides, nouvel | 9 | Bon. Piste : « Termine le quiz pour valider cette étape » (gris, `aria-disabled`) en bas d'une étape 1 déjà dépliée avec « Commencer » du sommaire qui ne fait que l'ouvrir : redondance légère, pas bloquante. |
| U4 Aperçu non-abonné | 10 | Valeur visible, une seule offre à l'écran dans la page parcours ; le bouton d'en-tête est celui de la nav. |
| U5 Accessibilité, cohérence comptes | 9 | `role="button"` sur CardHeader, `aria-expanded`, focus visible, « Fait » en texte : bon. Piste : étape verrouillée en `border-dashed` + cadenas, bon, mais « +100 XP » en `text-text-muted` à vérifier AA. |

## Faute dure

**F1 (U2) : trop de boutons pleins violets sur `/parcours` abonné.** `en-cours-parcours-1280.png` : « Reprendre » (carte semaines), « Continuer ce parcours » x2, « Commencer ce parcours » x3 = 6 boutons pleins identiques. `nouvel-parcours-1920.png` : « Commencer l'étape 1 » + 5 « Commencer ce parcours » = 6. L'action unique (reprendre l'étape en cours) n'est pas distinguée des invitations à changer de parcours.
- Correction codable : dans la carte de liste (composant dans `apps/web/src/components/parcours/parcours-content.tsx`, bouton d'entrée de carte), n'afficher `variant="primary"` que pour le parcours en cours (ou, à défaut, le parcours conseillé) ; les autres parcours passent en `variant="outline"` pour l'abonné. Le visiteur/gratuit garde ses boutons pleins (chaque carte est une porte d'entrée gratuite, un seul bouton d'offre).
- Ce qui ferait 10 : un bouton plein par écran d'abonné, les autres lisibles mais secondaires, et « La prochaine étape t'attend. Étape 3 · … » (`en-cours-parcours-repartie-1280.png`, lien sous la liste) supprimé ou repris dans le seul bouton « Reprendre », qui le double aujourd'hui.

## Pistes (ne retiennent pas la note)
1. Aligner les titres sur l'étalon (centrés) si Thomas l'arbitre pour tout l'espace.
2. Ordre de l'introduction de `/parcours/repartie` identique pour tous les comptes (voir D4).
3. Texte à signaler, non réécrit : « Étape en cours Machine à Café, Étape 3 sur 3 » alors que la carte du parcours affiche « 2/3 étapes » : cohérent (en cours = 3e), mais la double formulation est à valider par Thomas.

NOTE GLOBALE : 8/10

Fautes dures :
1. Six boutons pleins identiques sur `/parcours` abonné, pas d'action unique : `apps/web/src/components/parcours/parcours-content.tsx` (variant du bouton de carte), éventuellement `apps/web/src/components/espace/quatre-semaines.tsx` pour le doublon « La prochaine étape t'attend ».
