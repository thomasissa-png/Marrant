# Relecture à l'aveugle s25 v6 tour 4 : groupe « quoi-repondre »

Périmètre : `quoi-repondre/` (visiteur, gratuit = aperçu ; en-cours, nouvel = liste) et `fiches/*-fiche-situation-*` (en-cours, nouvel). Captures vues : 375, 1280, 1920 de chaque compte (les 768 et 1456 non ouvertes : aucun doute de mise en page, la coque est plafonnée à 1216 px comme prévu par la nav v6 §1). Code consulté : `quoi-repondre/page.tsx` et `filtres-situations.tsx` (cibles 44 px et repli des filtres sous 640 px confirmés par le code). Aucune relecture existante lue.

## Ce qui est conforme

- Aperçu (visiteur, gratuit) : H1 centré « Quoi répondre », sous-titre validé, une vraie fiche lisible en entier (« Coloc : la poêle »), carte de situations, un seul bouton plein Premium. Chip « Quoi répondre » allumé avec cadenas (soulignement + fond). Visiteur : lien Connexion en plus (prévu §2) ; gratuit : bouton seul, sans Connexion (cohérent). Pas de mur, pas de redirection.
- Liste (en-cours, nouvel) : 5 largeurs sans débordement, 2 colonnes pleine coque à 1280 et 1920 (aucun vide à droite), H2 par lieu avec compteur, filtres en puces à 44 px (repli en « Filtrer les cartes » à 375), badge « Fait » en-cours uniquement, chevrons sur chaque ligne.
- Fiche (en-cours, nouvel) : colonne de lecture de 768 px centrée, « Retour : Quoi répondre », H1 + durée, deux cartes à filet violet (« La scène », « À toi »), question avant la correction (« Tu avais une réponse ? »), état « Fait » + retour choisi + réplique enregistrée côté en-cours, formulaire vierge et « Enregistrer » inactif côté nouvel. Pas de page morte.
- Cohérence entre comptes : même structure, seules les données de l'abonné changent.

## Notes

| Critère | Note | Défaut et correction |
|---|---|---|
| Design 1 fidélité accueil | 9 | Aperçu et fiches : cartes `rounded-xl` à filet violet, OK. Liste : lignes grises plates sans filet ni pastille, plus « tableau de bord » que l'accueil. Piste : filet violet sur le titre de chaque groupe ou carte par groupe (`components/espace/liste-fiches.tsx`). Pas une faute : conforme au gabarit B. |
| Design 2 hiérarchie | 9 | Liste : « Le carnet du mois » (bouton contour) est le premier élément, avant les filtres, et rivalise avec le contenu ; 16 puces avant la 1re carte à 1280. Piste : descendre le carnet en fin de liste ou en lien discret (`quoi-repondre/page.tsx` l.70). |
| Design 3 mise en page 5 largeurs | 9 | Groupes de 3 ou 5 fiches : la dernière ligne laisse une demi-largeur vide à droite (Amis, Famille, Couple, Boulot… sur `en-cours-quoi-repondre-1280.png`). Piste : acceptable en grille, ou 3 colonnes à 1280+ (`liste-fiches.tsx`). |
| Design 4 cohérence espace | 10 | Titres, cartes et rythme alignés sur les autres rubriques. Titre centré en liste, aligné à gauche en fiche : voulu (gabarits B et A). |
| Design 5 finition | 9 | Cibles 44 px vérifiées dans le code. Texte secondaire des explications d'aperçu (~13 px, gris) lisible mais le plus petit du parcours (`apercu-rubrique.tsx`) ; AA tenu. Piste seulement. |
| UX 1 compréhension | 9 | Aperçu : la carte « Coloc (4) Soirée (6)… » n'a ni titre ni lien (gras, comme des liens) : on ne sait pas si c'est cliquable ni à quoi elle sert (`visiteur-quoi-repondre-375.png`). Correction : un H2 ou une ligne d'intro [texte à valider par Thomas], ou rendre en texte non gras (`apercu-rubrique.tsx`). |
| UX 2 action principale unique | 9 | Aperçu : un seul bouton plein, mais placé tout en bas (≈3000 px à 375, ≈1450 px à 1280) ; seul le bouton d'en-tête est visible plus haut. Liste : pas de situation mise en avant (le carnet fait office de premier bouton). Piste : placer le bloc offre sous le sous-titre ou après la fiche. |
| UX 3 états vides, nouvel abonné | 9 | `nouvel-quoi-repondre-*` : liste complète, aucun « Fait », aucun repère de départ (« commence par celle-ci »). Pas une page morte. Piste [à valider par Thomas] : badge ou ligne « Pour commencer » sur la première situation. |
| UX 4 aperçu Premium | 10 | Valeur visible (une fiche entière), une offre, pas de mur, prix lu dans la config, aucune capture ne montre de fenêtre surgissante. |
| UX 5 accessibilité et cohérence | 9 | État actif non coloré (soulignement + coche), focus non vérifiable sur capture statique. Bouton « Enregistrer » inactif (violet atténué) : exemption AA, mais sa raison n'est pas dite (`fiche/corps-situation.tsx`). Piste : message « Écris ta version pour enregistrer ». |

Aucun texte validé réécrit ; les formulations marquées « à valider par Thomas » ne retiennent pas la note.

## Fautes dures

Aucune.

NOTE GLOBALE : 9/10
