# Relecture DESIGN à l'aveugle, v6 tour 3, groupe lettre-carnet

Captures lues : lettre (visiteur, gratuit, en-cours, nouvel ; 375/768/1280/1456/1920 selon cas, vues principales : 375, 768, 1280, 1920), carnet (visiteur, gratuit, en-cours, nouvel ; 375, 1280, 1920, tranches en-cours 1280 n°1, 2, 3, 6, 13 et 375 n°1, 2, nouvel 1280 et 375 n°1), dediees `*-mon-espace-lettres-*` (visiteur 1280, gratuit 375). Les largeurs 1456 et la plupart des tranches intermédiaires n'ont pas été ouvertes une à une : les tranches lues sont homogènes (même gabarit de fiche répété).

## Notes

| Critère | Note |
|---|---|
| 1 Fidélité langue de l'accueil | 8 |
| 2 Hiérarchie et lisibilité | 7 |
| 3 Mise en page aux 5 largeurs | 8 |
| 4 Cohérence avec le reste de l'espace | 7 |
| 5 Finition au pixel | 8 |

NOTE GLOBALE (minimum) : 7/10. Sous la barre de 9.

## Ce qui est juste (à ne pas toucher)
- Cartes `rounded-xl` à filet violet en haut, fiches du carnet très propres : eyebrow violet, H3, contexte, bloc « On te dit » (fond gris, italique) et bloc « Tu réponds » (fond et filet violets) bien distingués. Rythme interne régulier, aucun débordement à 375 ni à 1920 (colonne de 768 px centrée au 1280, 696 px au visiteur).
- Redirection /mon-espace/lettres vers /lettre : visiteur et gratuit atterrissent sur la même page /lettre avec « La lettre » actif dans la bande ; rendu identique à /lettre.
- Formulaire /lettre : label, champ, case à cocher, bouton violet plein, mention RGPD lisible ; à 375 le bouton est pleine largeur, cible ≥ 44 px.
- Aperçu Premium du carnet (visiteur/gratuit) : une fiche offerte, une seule offre (« Ouvrir tout le carnet · 1,99 €/mois »), liste verrouillée de 3 titres + « Et 26 autres répliques ».

## Défauts

### D1 (faute dure) : « Les carnets précédents » placé AVANT les 30 fiches du carnet courant
Captures : `carnet/en-cours-carnet-1280-tranche-1.png`, `nouvel-carnet-1280-tranche-1.png`, `en-cours-carnet-375-tranche-1.png`.
Après la liste numérotée, on lit un H2 « Les carnets précédents » + une pastille « octobre 2026 », puis directement « SITUATION 1 Le vendeur dans ton dos » ... « SITUATION 30 ». Les fiches du carnet de novembre se lisent comme appartenant au carnet précédent (ou la pastille octobre ressemble à un onglet qui filtrerait les fiches). Hiérarchie trompeuse : on ne sait plus quel carnet on lit. Le H2 doit venir APRÈS la dernière fiche (situation 30), ou, si la pastille est un sélecteur, s'appeler autrement et se placer dans l'en-tête.
Correctif codable : `components/carnet/carnet-page.tsx` : déplacer le bloc « carnets précédents » sous la liste des fiches ; ajouter un titre de section « Les 30 situations » (H2 `text-xl font-semibold`) avant la première fiche. Le 10 : le bloc des archives en bas, pastille cliquable ≥ 44 px (la pastille actuelle mesure ~44 px de haut, OK).

### D2 (faute dure) : écran carnet abonné = mur de 30 fiches sans repère ni retour
Captures : `en-cours-carnet-1280.png` (≈ 25 800 px), `en-cours-carnet-375` (18 tranches de 2 000 px, soit ≈ 36 000 px).
La liste numérotée 1 à 30 en tête sert visiblement de sommaire, mais rien dans les captures ne montre qu'elle est cliquable (pas de soulignement, pas de chevron, pas de survol visible), et aucune fiche n'a de lien « retour au sommaire » ni de repère de progression. À 375 le sommaire occupe ~1 300 px de texte gris clair avant la première fiche (hors écran dès le deuxième scroll). Le rythme est lisible mais la page est une longue colonne monotone : 30 cartes identiques sans respiration, sans CTA ni retour en haut.
Correctif codable : `carnet-page.tsx` + `carnet-fiche-card.tsx` : (a) sommaire en 2 colonnes dès `sm:` (déjà fait à 1280, passer à 2 colonnes dès 640 px au lieu d'une liste de 30 lignes à 375), liens `underline-offset-4 hover:underline` + `min-h-[44px]` ; (b) ancres `id="situation-n"` + `scroll-mt-32` pour passer sous la bande ; (c) lien « Retour au sommaire » discret en pied de chaque fiche (`text-sm text-primary`, cible 44 px) ou bouton flottant « Haut de page » à partir de `lg`. Ce qui ferait 10 : sommaire manifestement cliquable et retour au sommaire.

### D3 (piste forte, retient la note) : en-tête de page incohérent entre comptes
Captures : `visiteur-carnet-1280.png` (eyebrow violet AU-DESSUS du H1) contre `en-cours-carnet-1280-tranche-1.png` (H1 d'abord, eyebrow violet dessous). Même page, même composant, deux ordres. De plus le H1 du carnet est aligné à gauche dans une colonne de 696/768 px alors que /lettre a un H1 centré (et l'accueil centre ses titres de section) : deux langues dans le même groupe.
Correctif : `carnet-page.tsx` : fixer un seul ordre (eyebrow au-dessus du H1, comme sur le visiteur et comme le reste de l'espace), et trancher l'alignement : H1 + sous-titre centrés (`text-center`) comme l'accueil et /lettre, fiches restant alignées à gauche dans la carte.

### D4 (piste forte) : /lettre abonné : page quasi vide, cartes sans signal d'action
Captures : `en-cours-lettre-1280.png`, `en-cours-lettre-1920.png`, `en-cours-lettre-375.png`.
Un H1 « La lettre » et deux cartes (« La lettre du jeudi 12 novembre », « 5 novembre »), puis ~400 px de noir avant le pied de page. Aucune phrase d'introduction (contrairement au visiteur : « Tu la reçois par e-mail... »), aucun état de la réception (« prochaine lettre jeudi... »), les cartes n'ont ni chevron, ni « Lire » ni état de survol visible : on ne voit pas qu'elles s'ouvrent. À 1280 et 1920 les deux cartes de 376 px tiennent dans une colonne de 768 px, correct, mais la page paraît inachevée au regard de l'accueil (hero, cartes aérées). À 375 les cartes sont pleine largeur, bon.
Correctif : `lettres-abonne-cartes.tsx` : ajouter une ligne de sous-titre sous le H1 (texte « à valider par Thomas »), un chevron `ChevronRight` à droite de chaque carte et `hover:border-primary/50`, `focus-visible:ring-2`. Réserver le texte proposé à validation.

### D5 (piste) : aperçu de la lettre = texte brut non hiérarchisé
Captures : `visiteur-lettre-1280.png` (et gratuit 768/375).
Le « dernier numéro » est rendu comme un e-mail en texte brut : « La sûre », « La joueuse », « La risquée », « Comment choisir », « L'erreur que tout le monde fait », « À essayer cette semaine » ont le même poids, la même couleur et la même taille que le corps. Seul le sujet est en gras. Lignes vides doubles disproportionnées (« Salut, » puis un grand blanc). L'aperçu occupe ~1 500 px de gris moyen, sans carte ni filet violet : c'est la zone la moins fidèle à la langue de l'accueil. Contraste du corps : gris clair sur fond noir, lisible (≥ 4.5:1 à vue), mais sans ancrage visuel. Les liens violets en URL brute (« deviens-marrant.fr/blog/rester-muet-en-groupe ») sont fidèles à un e-mail, assumés.
Correctif : `lettre-corps-apercu.tsx` : envelopper dans une carte `rounded-xl border bg-card` avec filet dégradé violet en haut, repères de sections en `font-semibold text-foreground` (sans changer le texte), `space-y-2` à la place des lignes vides doubles, léger `max-h` avec fondu et bouton « Lire la suite » est une piste, non retenue.

### D6 (piste mineure) : tailles de texte secondaires petites
`carnet/visiteur-carnet-1280.png` : « Situation 1 », « quotidien », « amis » en ~12 px gris moyen sur gris foncé ; contraste limite (à mesurer, probablement ~4.5:1). Mention « Premium : premier paiement remboursable sous 14 jours... » en blanc 13 px, correcte. Cible 44 px des 3 lignes verrouillées : ~88 px de haut, OK.
Correctif : `carnet-fiche-card.tsx` : `text-xs` vers `text-sm` pour la catégorie, `text-muted-foreground` vérifié ≥ 4.5:1.

### D7 (piste mineure) : le compte gratuit n'est pas distingué du visiteur sur /carnet
`gratuit-carnet-1280.png` identique au visiteur (même CTA « Ouvrir tout le carnet · 1,99 €/mois »). Acceptable (une seule offre), mais un inscrit pourrait voir « Ton compte est gratuit » ; texte « à valider par Thomas », non retenu.

## Conclusion
Fidélité correcte sur les fiches du carnet (cartes à filet violet, blocs « On te dit » et « Tu réponds »), mais deux fautes dures de structure (D1 titre d'archives mal placé, D2 mur de 30 fiches sans repère) et une page /lettre abonné trop nue. 7/10.

NOTE GLOBALE : 7/10
