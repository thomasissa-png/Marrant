# Relecture UX à l'aveugle : Bibliothèque, s26 tour 1

Captures vues : visiteur 375/768/1280/1920, gratuit 1280 (identique au visiteur, sauf le texte de la boîte d'offre), en-cours 375/768/1280/1920, nouvel 1280 (strictement identique à en-cours : mêmes hauteurs, mêmes compteurs). Code lu : `bibliotheque/page.tsx`, `apercu/apercu-bibliotheque.tsx`.

## Gate typographique (TAILLES.md)
Premier écran, tous comptes : 4 tailles distinctes (30 ou 24 px selon largeur, 20, 16, 14) et 5 à 6 combinaisons (visiteur 6 partout, en-cours/nouvel 5 à 375 puis 6 dès 768). Seuil (4 tailles, 6 combinaisons) respecté, aucune taille hors échelle. Gate PASS. Le titre en dégradé et le bouton plein sont le seul accent violet du premier écran (bouton en haut, le second bouton « La suite » n'est jamais dans le même écran que le premier : y 1195 contre 202 à 1280).

## Notes par critère

### UX 1 : prospect, envie en 3 secondes : 8/10
Points forts : l'aperçu se lit fermé (cadenas sur chaque tuile, barres grises à la place du contenu, badge « Premium »), la valeur est visible (« Le faux secret » et son schéma en clair, cinq pastilles du contenu, « 1 500+ inscrits »), une seule offre, bouton en haut à droite à 1280/1920 (y 202) et en tête sous le titre à 375 (≈ y 320, dans le premier écran de 812).
Défauts :
- 375 : sous « Vocabulaire », la carte « Formules à détourner » est coupée net, il reste un liseré de ≈ 15 px sans titre ni cadenas (capture visiteur-375, y ≈ 1690 à 1705). Cela ressemble à un bug, pas à un fondu. Cause probable : `SuiteCoupee` (`components/espace/apercu/extrait-coupe.tsx`) coupe à une hauteur fixe. Correction : à < 768 px, couper entre deux cartes (hauteur = fin de « Vocabulaire », ou afficher les deux cartes entières). Ferait 10 avec ça.
- 1280/1920 : la carte « Vannes, conseils, vidéos » laisse ≈ 235 px vides sous ses liens (fin de carte, donc permis) mais l'œil lit une tuile creuse à côté de la carte construction. Piste, pas faute.
- Phrase « Voici un exemple de cette rubrique… » en 14 px gris, peu visible : elle porte pourtant le message « ceci est un aperçu ». Piste : `text-foreground/80` au lieu du gris actuel (vérifier le contraste AA).

### UX 2 : abonné, je sais quoi faire maintenant : 8/10
Page propre : trois colonnes (1 colonne à 375, 2 à 768, 3 dès 1024), chaque bloc avec son compteur « 0/12 » et sa première ligne marquée (gras, filet blanc à gauche). Défaut : le marquage « prochaine fiche » n'a aucun mot (« Commence ici » / « Reprendre ici »), seulement un gras et un filet blanc : un premier-venu ne sait pas que c'est la prochaine. Correction codable : étiquette 14 px (taille existante) dans `ListeFiches` quand `marquerProchaine`. Ferait 10 avec ça. Aucune phrase d'orientation sous « Bibliothèque » (le visiteur en a une, l'abonné non) : piste.

### UX 3 : abonné, envie de continuer : 7/10
Le seul signal de progression est « 0/12 », « 0/8 », « 0/12 ». Pas de barre, pas de « reprendre où tu en étais », pas de série. Point à vérifier : le compte en-cours (abonné avancé) est strictement identique au compte nouvel (« 0/12 » partout, aucune ligne cochée) : soit la fixture n'a pas de fiches faites, soit `idsFaits` ne remonte rien. Si c'est la fixture, la capture ne prouve pas la progression et il faut en refaire une avec des fiches faites. Ce qui ferait 10 : compteur en couleur de texte renforcé, fiches faites cochées, prochaine ligne nommée.

### UX 4 : nouvel abonné : 8/10
Jamais une page morte : une porte d'entrée évidente par bloc (première ligne marquée), tous les blocs ouverts, « Entrer » visible pour l'humour noir. Manque : rien ne souhaite la bienvenue ni n'indique par où commencer parmi les trois colonnes (Construction, Vocabulaire, Formules). Piste : une ligne de 16 px sous le titre, texte à valider par Thomas.

### UX 5 : accessibilité visible et cohérence entre comptes : 8/10
Cohérent : même grille, mêmes cartes, même pied. Cadenas présents sur toutes les tuiles fermées. Cibles : « Entrer » et les pastilles de thèmes mesurent ≈ 43 px sur les captures (échelle 1,10), à une unité des 44 px : à vérifier au code (`min-h-11`). Le visiteur voit « Connexion » dans la boîte d'offre à 1280 mais la stat « 1 500+ » passe dans la boîte à 768 puis revient sous les pastilles à 1280 : léger écart de cohérence entre largeurs (piste).

## Autres observations (pistes)
- Abonné 1280/1920 : les colonnes finissent à 746, 981 et 1475 px (échelle d'origine), soit ≈ 500 à 730 px de vide sous les colonnes 2 et 3. Vide en fin de colonne : permis. Piste : passer « Humour noir » en colonne 2 pour équilibrer (`page.tsx`, ordre des enfants de `data-bibliotheque-grille`).
- 768 abonné : « La combinaison de deux mécanismes » passe sur deux lignes, hauteur de ligne irrégulière : sans gravité.

## Verdict
NO-GO (barre 9/10 non atteinte, une faute dure).

NOTE GLOBALE : 7/10

Fautes dures :
1. Aperçu 375 px (visiteur et gratuit) : la carte « Formules à détourner » est coupée en liseré de ≈ 15 px sans contenu lisible sous « Vocabulaire » : `apps/web/src/components/espace/apercu/extrait-coupe.tsx` (hauteur de coupe de `SuiteCoupee` en mobile).
