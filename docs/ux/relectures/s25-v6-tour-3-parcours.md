# Relecture UX à l'aveugle, s25 v6 tour 3 : groupe « parcours » (/parcours et /parcours/repartie)

Périmètre : 40 captures `docs/captures/s25/v6-tour-3/parcours/` (visiteur, gratuit, en-cours, nouvel ; 375, 768, 1280, 1456, 1920). Lu : brief v6, `cta-forme-place-s21.md` (§1.3 et B15, B14), navigation v6, founder-preferences du 12 au 15/11, étalon accueil 1280. Pas lu : relectures, commits, REPLIT_ACTIONS, plans de corrections.

Limite de méthode : les captures pleine page à 375 et 768 sont réduites à 106 et 306 px de large à l'affichage. J'y juge la structure, l'ordre et les pleins, pas les pixels. Les cibles de 44 px ont été vérifiées au code (`sommaire-parcours.tsx` : `min-h-11` sur les boutons « Voir », « Reprendre », « Commencer »), pas à l'œil : ma première estimation sur capture (≈ 30 px) était fausse et je l'ai retirée.

## Notes

| Critère | Note | Constat |
|---|---|---|
| Design 1 fidélité accueil | 9 | Cartes `rounded-xl` à filet violet, pastilles, rythme aéré : conforme. Écart : H1 et intertitres alignés à gauche (l'accueil centre hero et titres). |
| Design 2 hiérarchie | 9 | H1, pastilles, bouton plein pleine largeur de carte, ligne frontière petite : lisible. |
| Design 3 mise en page 5 largeurs | 9 | Colonne centrée d'environ 770 px à 1280, 1456 et 1920 (marges symétriques, pas de vide à droite, pas de débordement). La bande et l'en-tête font 1216 px : la colonne étroite sous eux est un choix de lecture, pas un défaut. |
| Design 4 cohérence espace | 9 | Fil d'Ariane absent sur /parcours (premier niveau), présent sur /parcours/repartie (détail) : conforme à la décision du 15/11. FAQ sans la question du prix pour l'abonné (en-cours, nouvel) : conforme au 14/11. |
| Design 5 finition | 9 | Pas d'alignement cassé vu. Cibles 44 px confirmées au code. Contrastes des petits textes (`text-muted` sur carte) cohérents avec les valeurs du design system. |
| UX 1 compréhension | 9 | Visiteur : titre, question « Quel parcours est fait pour toi ? », 5 cartes. Abonné : « Tes 4 premières semaines » puis « Ton cap ». |
| UX 2 action unique | 9 | Conforme au §1.3 et à B15 : un plein par carte pour visiteur et gratuit (étape 1 gratuite), jamais deux dans une carte, aucun Premium plein sur les cartes. Abonné : plein sur la carte en cours seulement, les autres en contour. |
| UX 3 états vides et nouvel abonné | 10 | Nouvel : « 0 sur 4 étapes », « Commencer » plein, étape conseillée Répartie, cap 1 sur 5, étape 1 ouverte avec sa liste 1.1 à 1.5 et « Termine le quiz pour valider cette étape ». Aucune page morte. |
| UX 4 aperçu Premium | 9 | /parcours est l'aperçu (décision nav v6). Une seule offre : plein « Passer à l'étape 2 · 1,99 €/mois » avec prix et garantie, étapes 2 à 4 listées avec cadenas, pas de mur. Gratuit : la ligne « D'abord ton compte, puis le paiement » est retirée à bon escient. |
| UX 5 accessibilité et cohérence comptes | 9 | Le statut « Fait » est en texte avec coche. Les 4 comptes partagent la même charpente. |

**NOTE GLOBALE : 9/10** (minimum des critères). Aucune faute dure relevée.

## Fautes dures

Aucune.

## Pistes (ne retiennent pas la note)

1. **Libellé du bouton de carte, à confirmer** : les captures disent « Tester l'étape 1 de {parcours}, gratuite » ; `cta-forme-place-s21.md` B15 cite le patron « Lire la première étape gratuite de {parcours} ». Si une décision postérieure a changé le patron, rien à faire ; sinon l'écart est de texte validé, donc à trancher par Thomas, pas par la session. Le §1.3 (forme et place : plein, un par carte, pleine largeur) est respecté.
2. **Plein Premium sous un quiz non répondu** (visiteur et gratuit, /parcours/repartie) : « Passer à l'étape 2 » s'affiche alors que le quiz est à 1/4. Le §3.4 prévoit le plein après le résultat du quiz et la carte « Étape 2 » seulement quiz terminé. Le visiteur vient de lire l'étape entière (température tiède), donc défendable ; à confirmer avec Thomas. La carte « Étape 2 » (`CarteEtapeSuivante`) n'est pas visible sur ces captures, ce qui est cohérent avec « quiz non terminé ».
3. **Carte « Vannes à pratiquer / 5 vannes dans cette étape. »** (visiteur et gratuit) : une carte sans lien ni action, seule zone inerte de la page. Une proposition de texte ou de lien est « à valider par Thomas ».
4. **En-cours, /parcours/repartie** : le paragraphe d'intro et « Pour qui ? » passent sous le programme, sans titre de section, juste avant le pied de page. Chez visiteur, gratuit et nouvel ils sont en haut. Piste : les ancrer en haut comme pour les autres comptes (`parcours-detail.tsx`) ou les titrer.
5. **Centrage** : centrer H1 et intro de /parcours et du détail, comme le hero de l'accueil, ferait 10 sur Design 1 (`apps/web/src/app/(dashboard)/parcours/(liste)/page.tsx`, `apps/web/src/components/parcours/parcours-detail.tsx`). Piste subjective : la page de lecture à gauche est cohérente avec les pages de l'espace.
6. **Vignettes vidéo** : dégradé violet et bouton lecture, sans image. Le contenu est inchangé ; piste d'image réelle si elle existe en base.
7. **Cadre « Étape 1 gratuite, la suite avec Premium »** : bandeau fin à filet épais, plus léger que les cartes autour. Lisible, sans impact sur la note.

## Hors périmètre vu en passant

À 768 px la bande des rubriques est coupée à droite (« Conse… ») avec le bouton « … » : comportement de défilement prévu par la nav v6, à voir par le groupe dédié.

Hors sujet de la grille : prix affiché 1,99 €/mois partout (accueil étalon comprise), alors que la ligne du 01/10 parlait de 4,99 € ; les lignes intermédiaires n'ont pas été lues en entier, à vérifier par la session.
