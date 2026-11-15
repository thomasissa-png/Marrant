# Relecture UX à l'aveugle, v6 tour 2 : S'entraîner et fiches jeu, séance, bilan

Périmètre : `docs/captures/s25/v6-tour-2/s-entrainer/` (4 comptes, 5 largeurs) et `fiches/` (jeu, seance, bilan ; en-cours et nouvel ; 5 largeurs). Lues : visiteur 375/1280/1920, gratuit 768, en-cours 375/768/1280/1920, nouvel 375/1280, fiches jeu 1280 et nouvel 375, séance 1280 et 375, bilan 1280 et nouvel 768. Les largeurs non ouvertes (visiteur 768/1456, gratuit 375/1280/1456/1920, nouvel 768/1456/1920, fiches 1456/1920) sont déduites du plafond `max-w-7xl` et des tailles de page identiques de l'INDEX ; aucune anomalie n'est affirmée sur elles.

## Notes

| Critère | Note | Justification |
|---|---|---|
| Design 1 fidélité accueil | 9 | Cartes `rounded-xl` à filet violet, titre de page grand, rythme aéré. Titres alignés à gauche (norme espace), pas centrés comme l'accueil : conforme aux gabarits v5. |
| Design 2 hiérarchie | 9 | Titre, sous-titre, cartes : lecture claire. Fiche séance : toutes les sections au même poids (voir piste P3). |
| Design 3 mise en page 5 largeurs | 8 | Aperçu 1280+ : colonne de droite quasi vide sous la carte d'offre (piste P1, conforme à l'arbitrage 2 « collante »). En-cours 1280+ : carte gauche finit 125 px plus haut que la droite (piste P2). Aucun débordement, aucun collage à gauche. |
| Design 4 cohérence espace | 9 | Mêmes cartes, mêmes pastilles (Nouvelle, À revoir, Marche) que le reste. |
| Design 5 finition | 8 | Tuiles « Oui / À moitié / Rien » : texte gris, filet presque invisible, elles ressemblent à un état désactivé alors que les pastilles « Ton retour » voisines sont bien contrastées (piste P4). |
| UX 1 compréhension | 8 | S'entraîner : clair en 3 s. **Fiche séance : faute dure F1** (10 phrases en un seul paragraphe). |
| UX 2 action principale | 8 | S'entraîner abonné : 3 exercices en même temps (2 cartes + 1 marche), chacun avec ses propres commandes, aucune carte désignée comme « la » à faire d'abord (piste P5). |
| UX 3 états vides / nouvel | 9 | Nouvel abonné : 1 situation « Nouvelle » + Marche 1, jamais une page morte, ni de « 0 » affiché. |
| UX 4 aperçu Premium | 9 | Fiche réelle lisible en entier, un seul bouton plein dans le bloc, « Connexion » en lien, pas de mur. Gratuit sans lien Connexion : correct. |
| UX 5 accessibilité et cohérence comptes | 8 | Bande identique, chip S'entraîner allumé et souligné pour les 4 comptes, fiches jeu/séance allument S'entraîner, bilan allume Parcours (conforme spec §4). Cibles ≥ 44 px visibles. Point P4 sur l'état apparent des tuiles. |

**NOTE GLOBALE = minimum = 8/10, avec 1 faute dure : section non validée.**

## Faute dure

**F1. Fiche séance : les 10 phrases de l'étape « Observation » sont collées en un seul paragraphe** (`en-cours-fiche-seance-375.png`, `-1280.png`, idem nouvel). Ce sont l'objet même de l'exercice (« note en deux mots la petite pique, coche les trois qu'on te dit vraiment ») : « 1. « Tu as encore… » 2. « Tu es toujours… » 3. … » courent à la suite, avec retour à la ligne au milieu d'une phrase à 375 comme à 1280. L'utilisateur ne peut ni les repérer ni les cocher (il doit les recopier), alors que la même fiche rend « Bilan » en vraie liste numérotée (1. 2. 3.). Texte inchangé, seul le rendu est à corriger : une liste ordonnée `<ol>` (ou une ligne par phrase) avec le même style que la liste du Bilan, 10 lignes de 24 px. Code : rendu des corps de séance dans `apps/web/src/components/espace/fiche/corps-divers.tsx` (à confirmer ; le contenu est dans `apps/web/src/data/espace/seances.json`, ne pas le réécrire : seul le découpage des lignes numérotées du bloc « Observation » change). Ce qui ferait 10 : 10 lignes numérotées lisibles, cibles de lecture claires, rien d'autre changé.

## Pistes (ne retiennent pas la note)

- **P1. Carte d'offre de l'aperçu à 1280, 1456, 1920** (`visiteur-s-entrainer-1920.png`) : 490 px de large pour un bouton et un lien, le reste de la colonne vide (330 px de vide sous elle en pleine page). Conforme à l'arbitrage 2 (colonne 5/12 collante, `lg:sticky lg:top-32`), donc non retenu. Pour 10 : ajouter dans la carte une ligne de valeur issue de la config (« à valider par Thomas »), ou centrer verticalement. Fichier : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx`.
- **P2. Cartes jumelles d'inégale hauteur** (`en-cours-s-entrainer-1280.png`) : `items-stretch` ou `items-start` assumé, 125 px de vide sous la carte de gauche. Fichier : `apps/web/src/app/(dashboard)/mon-espace/s-entrainer/page.tsx`.
- **P3. Fiche séance** : 9 sections au même poids de titre (`Pour qui, quand`, `Échauffement · 3 min`, `Essai · 8 min`…). Un repère visuel des étapes minutées (pastille de durée) aiderait le chronométrage. Subjectif.
- **P4. Tuiles « Oui / À moitié / Rien »** (`en-cours-s-entrainer-1280.png`, `nouvel-fiche-bilan-768.png`) : texte gris, fond et filet quasi identiques à la carte, aspect désactivé ; « Prends ton temps » est le seul indice. Vérifier dans le code qu'elles sont bien actives et que le filet atteint 3:1 (WCAG 1.4.11). Fichier : `apps/web/src/components/espace/fiche/reponse-dabord.tsx`. Si elles sont volontairement inactives avant le délai, le dire (texte « à valider par Thomas »).
- **P5. Action principale de S'entraîner** : abonné avancé = 3 exercices simultanés ; seul « 10 secondes pour répondre » est en contour. Piste : mettre en avant la première carte. Non retenu (la rafale à 2 cartes + 1 marche est l'étalon E5 validé).
- **P6. Aperçu** : la réponse « C. » est déjà dépliée (chevron vers le haut), l'exercice est donc révélé avant d'être tenté ; c'est « lisible en entier » comme voulu par la spec. Deux boutons pleins identiques visibles ensemble au-dessus du pli (en-tête et carte) : l'en-tête est hors périmètre, règle « un bouton plein par bloc » respectée.
- **P7. Textes à signaler, non réécrits** : fiche jeu, bloc « Ton retour » (« Pas essayé / Essayé, bof / Essayé, ça a marché ») sur un quiz à choix A/B/C, le verbe « essayé » colle mal ; l'invite « Dis ta réponse avant de lire la suite » vient après les options et la réponse dépliable ; fiche bilan, H1 « Bilan » sans le nom du parcours (le retour dit « Répartie »). À valider par Thomas.

## Cognitive walkthrough (Yanis, abonné neuf)

1. Arrive sur S'entraîner : titre, accroche validée, une situation « Nouvelle » : OK.
2. Lit la scène, voit « Ta réponse d'abord » : OK.
3. Évalue « Oui / À moitié / Rien » : [FRICTION H1] l'état actif n'est pas évident (P4).
4. Ouvre la séance : [FRICTION H8] liste des 10 phrases illisible (F1).

## Handoff

À @fullstack : corriger F1 (rendu de la liste « Observation ») ; vérifier P4. À @design : P1, P2 si Thomas le souhaite. Nouveaux libellés éventuels : à valider par Thomas.
