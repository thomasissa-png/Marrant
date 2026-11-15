# Relecture UX à l'aveugle, tour 2 : Bibliothèque et fiches (navigation v6, s25)

Périmètre : `docs/captures/s25/v6-tour-2/bibliotheque/` (4 comptes x 5 largeurs) et `fiches/` (a-plat, formule, vocabulaire, humour-noir, construction ; comptes en-cours et nouvel). Lu : brief v6, `navigation-v6-menu-rubriques.md`, étalon accueil 1280. Ouvertes en entier : bibliothèque visiteur 375/1280, gratuit 768/1920, en-cours 768/1280, nouvel 375/1280 ; fiches en-cours 1280 (5 fiches), nouvel construction 375, humour-noir 375, nouvel a-plat 1920. Les autres largeurs sont de même hauteur et même structure (INDEX : 1280, 1456 et 1920 identiques, coque plafonnée) ; non ouvertes une à une, je ne les note pas individuellement.

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité à l'accueil | 9 |
| Design 2 hiérarchie, lisibilité | 9 |
| Design 3 mise en page 5 largeurs | **8** |
| Design 4 cohérence avec l'espace | 9 |
| Design 5 finition | 9 |
| UX 1 compréhension | 9 |
| UX 2 action principale | 9 |
| UX 3 états vides, nouvel abonné | 9 |
| UX 4 aperçu Premium | 9 |
| UX 5 accessibilité, cohérence comptes | 9 |

**Globale = minimum = 8/10** (une faute dure).

## Ce qui est conforme (vérifié sur capture)

- Cartes `rounded-xl` à filet violet en haut, pastilles, rythme aéré : la langue de l'accueil est tenue sur l'aperçu, la liste et les fiches.
- Chip « Bibliothèque » allumé (soulignement violet) sur la liste, l'aperçu ET les fiches construction, vocabulaire, formule, humour-noir ; chip « Quoi répondre » allumé sur a-plat. Conforme au §4 de la navigation v6.
- Aperçu visiteur et gratuit : sous-titre validé, une vraie fiche lisible en entier (« Le faux secret »), un seul bouton plein, lien Connexion présent pour le visiteur et absent pour le gratuit (juste). Ni mur, ni redirection, ni fenêtre. Mobile (375 et 768) : fiche puis offre, ordre logique.
- Liste abonné : 4 comptes et 5 largeurs sans débordement, colonnes 2 x équilibrées à 768/1280 (fin à 1408 et 1540 sur 1280, écart de 130 px, acceptable), une colonne à 375, aucune colonne collée à gauche.
- Fiches : colonne de lecture centrée (environ 768 px) aux 1280 et 1920, « Retour : Bibliothèque » en tête, méta (rubrique, durée), bloc « À toi » avec retour, champ, compteur, bouton désactivé tant que vide. Cohérent entre en-cours et nouvel.
- Nouvel abonné : la Bibliothèque est identique à celle de l'abonné avancé (page de référence, jamais vide ni morte). Cohérence entre comptes tenue.

## Faute dure

**F1. Design 3 : colonne droite vide sous le bloc offre de l'aperçu, à 1280, 1456 et 1920** (`visiteur-bibliotheque-1280.png`, `gratuit-bibliotheque-1920.png`). La fiche occupe 700 px à gauche ; la carte d'offre à droite ne fait que 94 px de haut (un bouton, et sous 1280 px à 1920 px environ 700 px de noir jusqu'au pied de page). Sur la capture pleine page, rien n'indique que la carte reste collée au défilement. La règle de Thomas est « aucun vide à droite à 1280+ ».
- Correction codable : dans le gabarit de l'aperçu (page `/bibliotheque` aperçu, composant du bloc offre), rendre la colonne droite `lg:sticky lg:top-[130px] self-start` (114 px de bande + marge, aligné sur le `scroll-padding` de 120 px de la v6) pour que le bloc suive la lecture ; à défaut, centrer la fiche seule en `max-w-3xl mx-auto` sur une colonne, comme les fiches de l'abonné, et placer le bloc offre sous la fiche. Le sticky est préférable (l'offre reste visible pendant la lecture sur les 1 000 px de la fiche).
- Ce qui ferait 10 : une capture à mi-défilement qui montre la carte d'offre toujours visible, ou la fiche seule centrée.
- Aucun texte nouveau requis.

## Pistes (ne retiennent pas la note)

- **P1. Cibles 44 px à vérifier** : liens soulignés « Vannes / Conseils / Vidéos » de la carte « Vannes, conseils, vidéos » (`en-cours-bibliotheque-1280.png`, ligne à y=393) et « Retour : Bibliothèque » des fiches. Le texte fait environ 14 px de haut ; la zone cliquable n'est pas visible sur capture. Si elle est plus petite que 44 px de haut : `inline-flex min-h-11 items-center` sur ces liens. Passe en faute dure si le code confirme.
- **P2. Humour noir, bouton « Entrer »** (`en-cours-fiche-humour-noir-1280.png`) : seule action de la page, mais en contour fin ; hauteur 44 px respectée. Variante possible : bouton plein `bg-accent-primary`. Subjectif, l'existant suit la spec.
- **P3. Carte « Vannes, conseils, vidéos »** : les pastilles (Boulot, Couple, Soirées...) ressemblent à des filtres sans dire ce qu'elles ouvrent ; les liens Vannes/Conseils/Vidéos doublonnent la bande. Texte d'aide éventuel : à valider par Thomas.
- **P4. Nouvel abonné** : 31 entrées à plat, sans « par où commencer » ni marque « lue ». Pas une page morte ; à confier à @product-manager si Thomas veut du coaching dans cette rubrique (hors périmètre de la note).
- **P5. Fiche vocabulaire** (`en-cours-fiche-vocabulaire-1280.png`) : la ligne « En deux temps » (l'exemple, le contenu utile) est plus petite (environ 13 px) que la définition (16 px) : hiérarchie inversée ; et « Chambrer » est le seul terme sans lien « Définition complète » (à confirmer côté contenu, texte non retouché).
- **P6. Fiche a-plat** (`en-cours-fiche-a-plat-1280.png`) : les trois boutons Oui / À moitié / Rien et « Enregistrer » sont affichés atténués ; « Prends ton temps » est le seul indice. Vérifier que l'état désactivé est annoncé (`aria-disabled`) et lisible AA pour le texte « Prends ton temps » (gris sur carte sombre).
- **P7. Aperçu** : le premier paragraphe de la fiche (« Le schéma ») passe à la ligne plus tôt (« gravité / d'un scandale. ») que les suivants à 1280 et 1920 : largeur de mesure incohérente (`text-wrap: balance` ou `max-w` sur ce seul bloc). Cosmétique.
- **P8. Hors groupe** : sur visiteur et gratuit, « Favoris » porte un cadenas alors que la v6 §2 ouvre les groupes 2 et 3 sans cadenas. À arbitrer par le groupe de la bande (peut être voulu).

## Heuristiques et parcours (résumé)

- Cognitive walkthrough visiteur : « Bibliothèque » + cadenas, je clique, titre + « Voici un exemple... » + vraie fiche + bouton Premium : je sais où je suis et quoi faire en 3 secondes. Aucune friction H1 à H10 bloquante.
- Abonné : liste en 4 cartes, 1 clic pour ouvrir une fiche, retour en 1 clic ; chip allumé conserve le repère.
- HEART (rappel) : Adoption = vues aperçu ; Task success = clics offre / vues aperçu ; cible fixée après 28 jours (spec v6).

NOTE GLOBALE : 8/10
