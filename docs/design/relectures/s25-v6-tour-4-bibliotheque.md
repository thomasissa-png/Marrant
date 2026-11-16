# Relecture DESIGN à l'aveugle, s25 navigation v6, tour 4, groupe « bibliotheque »

Périmètre : `bibliotheque/` (visiteur, gratuit, en-cours, nouvel) et `fiches/` construction, formule, vocabulaire, humour-noir, a-plat (en-cours, nouvel). Captures : `docs/captures/s25/v6-tour-4/`.
Vues ouvertes : bibliothèque 375, 1280, 1920 des 4 comptes + 768 en-cours ; fiches en-cours 375/1280 (construction, formule, vocabulaire, humour-noir, a-plat) + 1920 construction + nouvel 375 (humour-noir, a-plat, vocabulaire). Vignettes vidéo : sans objet ici.

## Notes (Design)

| Critère | Note | Constat |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Cartes `rounded-xl` à filet dégradé violet en haut, H1 centré sur la rubrique et l'aperçu, pastilles de thèmes rondes, rythme aéré. Sur les fiches (gabarit A), le H1 est aligné à gauche de la colonne de 768 px, alors que la rubrique et l'aperçu sont centrés : cohérent avec le « Retour » à gauche, piste seulement. |
| 2 Hiérarchie, lisibilité | 9 | H1, puis cartes titrées, lignes de 50 px avec chevron : lecture immédiate. Fiche : H1, méta en capitales, carte de contenu, carte « À toi ». Textes grisés (« Trop flou… », « À ne pas confondre ») restent lisibles. |
| 3 Mise en page 5 largeurs | 9 | 375 une colonne sans débordement ; 768 et 1280+ deux colonnes équilibrées (`columns-2`), aucune colonne collée à gauche, aucun vide à droite ; coque plafonnée à 1216 identique à 1280/1456/1920. Fiches : colonne centrée de 768, marges symétriques. Défaut mineur : sous « Comment c'est construit » il reste un vide d'environ 146 px à 1280 et 1920 (colonne gauche finit 1563, droite 1709), `bibliotheque-en-cours-bibliotheque-1280.png`. Inhérent à l'équilibrage en colonnes CSS ; piste. |
| 4 Cohérence avec le reste | 9 | Même `CARTE`, même en-tête centré que les autres rubriques ; fiches et aperçu partagent le même habillage (carte + filet). Les 4 comptes ont la même bande et le même gabarit. |
| 5 Finition au pixel | 9 | Cibles : pastilles de thèmes `min-h-11`, liens Vannes/Conseils/Vidéos `LIEN` (`min-h-11`), « Entrer », « Voir une version possible » et puces de retour 44 px (classes vérifiées dans `carte/styles.ts` et `bloc-bibliotheque.tsx`). Alignements nets, focus `ring` défini. Détail : l'étiquette « À TOI » (xs) est collée au paragraphe sous elle (≈ 8 px) alors que le reste de la carte respire à 16-24 px (`en-cours-fiche-construction-1280.png`, y≈1035-1060). Piste. « Enregistrer » désactivé volontairement atténué (exempt). |

## Notes (UX, vues de la capture seulement)

| Critère | Note | Constat |
|---|---|---|
| 1 Compréhension | 10 | « Bibliothèque » allumée, H1 clair, cartes nommées ; fiche : « Retour : Bibliothèque » + chip allumé. |
| 2 Action principale | 9 | Aperçu : un seul bouton plein « Premium · 1,99 €/mois » ; abonné : la liste est l'action. |
| 3 Vides et nouvel abonné | 9 | La bibliothèque est du contenu statique : le nouvel abonné voit les mêmes cartes, jamais une page morte. Le coin Humour noir se présente avec « Entrer ». |
| 4 Aperçu Premium | 9 | Une vraie fiche en entier (« Le faux secret »), sous-titre validé, un bouton, lien Connexion pour le visiteur seulement (gratuit : bouton seul, correct). Piste : seule une fiche est montrée, rien n'indique que la rubrique en compte une trentaine (pas de carte de titres), valeur un peu moins lisible ; non retenu dans la note, la spec autorise 1 à 3 éléments. |
| 5 Accessibilité, cohérence | 9 | Mêmes bande, en-tête et pied pour les 4 comptes ; cadenas visiteur/gratuit, absents chez l'abonné. |

## Fautes dures

Aucune.

## Pistes (ne retiennent pas la note)

1. Vide d'environ 146 px sous la colonne gauche à 1280+ : `apps/web/src/app/(dashboard)/mon-espace/bibliotheque/page.tsx` (ligne `md:columns-2`), par exemple répartir 3 cartes à gauche / 2 à droite avec une grille 2 colonnes et `items-start`, ou laisser tel quel.
2. Espace sous l'étiquette « À TOI » des fiches : classe `ETIQUETTE` (`carte/styles.ts`), ajouter `mb-1` ou `mb-2` à l'endroit où la carte la rend.
3. Aperçu : montrer, sous la fiche en entier, 2 cartes titre + début (spec §2.2), texte à fournir par Thomas pour tout nouveau libellé : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx`.
4. Fiches : H1 aligné à gauche, centrer est possible avec `EN_TETE_CENTRE` si Thomas veut l'identique de l'accueil (à arbitrer).

NOTE GLOBALE : 9/10
