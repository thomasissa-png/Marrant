# Audit conversion s20, angle design (captures réelles de la prod, 13/10/2026)

Méthode : lecture visuelle de captures 375×812 et 1280×800 (accueil, article blagues 2026 en 10 tranches, abonnement, register, parcours, fiche vidéo, vannes, accueil et abonnement desktop). Les hauteurs de boutons et la position des blocs sont lues sur les captures (375 px de large = échelle 1:1 en mobile) : ce sont des estimations à l'œil, à confirmer dans l'inspecteur. **Aucun contraste n'a été mesuré** : quand j'écris « contraste faible », c'est un jugement visuel à vérifier avec axe ou Lighthouse.

Limites : je n'ai pas de capture de l'état « Annuel » de la page abonnement ni de la barre de menu ouverte. Les tokens du dépôt ne m'ont pas été fournis : les noms ci-dessous sont des noms sémantiques cibles, à `[MAPPER sur les tokens réels du dépôt par @fullstack]`. Choix fondateur respectés : « 1 500+ » intact, pas de compte gratuit, pas de photo ni d'identité du fondateur, aucun témoignage présenté comme réel, aucun chiffre retiré.

## Notes

| Critère | Note | Preuve principale |
|---|---|---|
| D1 Premier écran mobile | 7/10 | `accueil-mobile-ecran1.png` |
| D2 Boutons d'action | 5/10 | 6 libellés, 3 hauteurs, 2 usages du violet plein |
| D3 Encarts Premium dans les articles | 4/10 | `article-blagues-2026-mobile-tranche08.png` |
| D4 Page /abonnement | 6/10 | `abonnement-mobile-tranche01.png` |
| D5 Confiance visuelle globale | 7/10 | cohérence forte, pas d'image, bloc « Prochainement » |
| D6 Lisibilité mobile | 7/10 | `article-blagues-2026-mobile-tranche02.png` à `06` |
| **CONVERSION globale (design)** | **5/10** | le système visuel est propre, le défaut est le placement et la hiérarchie des boutons |

## D1 Hiérarchie du premier écran mobile : 7/10

- Ce qui marche (`accueil-mobile-ecran1.png`) : le H1 « Tu parles et personne rit. On va arranger ça. » (≈ 28 px, blanc, « personne rit » en violet) est le premier point d'entrée. Le bouton violet plein « Accéder aux parcours complets » (≈ 343×48 px, y 475 à 523) est le seul grand aplat de couleur de l'écran, entièrement visible sans scroll, avec le prix en dessous. Le fond sombre avec un seul accent crée un vrai contraste de focus.
- Ce qui freine : (1) le paragraphe gris sous le H1 occupe 5 lignes (y 235 à 395), il repousse le CTA à 58 % de la hauteur d'écran. (2) Sous le CTA, trois éléments se concurrencent en 200 px : le lien souligné blanc « Lire la première étape gratuite » (y 593), puis trois pastilles grises (y 640 à 785) qui ont la forme de boutons mais pas leur poids. Elles ajoutent trois choix à un écran qui devrait en avoir un. (3) Aucune image ni visuel produit : le hero est 100 % texte, rien ne montre ce qu'on achète (parcours, vanne, vidéo).
- À conserver : la ligne « 1 500+ membres bossent leur humour. Rejoins-les. » (violet, ≈ 14 px) juste au-dessus du CTA. Petite, mais bien placée.

## D2 Visibilité et cohérence des boutons d'action : 5/10

Inventaire visuel de la même action (aller vers Premium) sur les captures :

| Page | Libellé | Style | Hauteur lue |
|---|---|---|---|
| Accueil, hero | Accéder aux parcours complets | violet plein, pleine largeur | ≈ 48 px |
| Article, encart | Passer à Premium | violet plein, centré, étroit (≈ 187 px) | ≈ 48 px |
| Vannes, mur | Tout débloquer | violet plein, pleine largeur | ≈ 44 px |
| Fiche vidéo | Voir Premium | violet plein, étroit (≈ 122 px) | ≈ 36 px, sous les 44 px |
| Abonnement et accueil bas | Commencer à 2,99 €/mois | violet plein, pleine largeur | ≈ 48 px |
| Desktop, en-tête | Commencer | violet plein, petit | `accueil-desktop-pleine.png` |

- Constat 1 : six libellés, trois largeurs, trois hauteurs. Même couleur partout (point positif), mais pas un composant unique.
- Constat 2 : le violet plein sert aussi une action gratuite. En bas de l'article (`article-blagues-2026-mobile-tranche08.png`, y 1010 à 1055), « Lire la première étape gratuite » est un bouton violet plein identique au bouton payant. L'œil ne distingue pas « payer » de « essayer ». Sur la fiche vidéo (`video-fiche-mobile-ecran1.png`), c'est l'inverse : le bouton gratuit est un contour pleine largeur (y 955 à 1011), plus imposant que le bouton Premium violet étroit juste en dessous (y 1162 à 1198).
- Constat 3 : en mobile, l'en-tête n'a aucun CTA (logo + trois icônes : compte, recherche, menu). En desktop il y a un bouton « Commencer » violet. 66 % du trafic est mobile.
- Constat 4 : 50 boutons de partage ronds (≈ 32 px, gris sur gris) dans l'article, sans libellé, sous les 44 px de cible tactile.
- Les libellés viennent peut-être des étalons validés du chemin vers Premium (`docs/copy/etalons-chemin-premium-s15.md`, non relu ici) : cet audit ne propose donc PAS de changer les mots, seulement le composant. Arbitrage de libellés = @copywriter avec les étalons.

## D3 Encarts Premium dans les articles : 4/10

- Sur l'article n°1 (≈ 14 920 px de haut en mobile, 58 % des entrées), le premier signe de Premium apparaît à ≈ 11 500 px, soit ≈ 77 % de la page (`article-blagues-2026-mobile-tranche08.png`, carte « Tu les as lues. Reste à les sortir pour de vrai. »). Les 50 vannes, 7 sections et ≈ 7 écrans de scroll ne contiennent aucun encart, aucun bouton, aucun lien Premium (tranches 01 à 07 relues une par une).
- L'encart lui-même est discret à l'excès : même gris foncé et même bordure fine que les cartes de FAQ qui le suivent immédiatement, bouton centré de 187 px, texte légal en ≈ 11 px. Il ne se repère pas comme un moment distinct de la page.
- Juste après, la carte « Parcours recommandé » (y 710 à 1080) porte un second bouton violet plein : deux appels de même poids à ≈ 400 px d'écart, l'un payant, l'autre gratuit (voir D2).
- Bon contre-exemple dans le même site : l'encart de la fiche vidéo (`video-fiche-mobile-ecran1.png`, « ANALYSE PÉDAGOGIQUE COMPLÈTE ») : fond teinté violet, bordure violette, surtitre en majuscules, une phrase de bénéfice, un bouton. Il est repérable sans être agressif. C'est le patron à généraliser aux articles.
- Mur des vannes (`vannes-mobile-ecran1.png`) : bloc « Aperçu gratuit : 10 vannes accessibles sans abonnement » avec « Tout débloquer », bien placé à la fin du premier écran, lisible. Texte secondaire ≈ 12 px.
- Cohérence avec la ligne fondateur (« produit qui s'apprend, pas qui se vend ») : l'encart doit offrir le parcours (valeur), pas presser. Pas de pop-up, pas de barre collante sur les articles.

## D4 Page /abonnement : 6/10

- Prix : très lisible. « 2,99 € » en ≈ 40 px gras blanc, « / mois » en gris, ligne violette « Sans engagement, annulable à tout moment » (`abonnement-mobile-tranche01.png`, y 430 à 515). Bon.
- Le bouton « Commencer à 2,99 €/mois » est à y ≈ 1033 : il est **sous le pli** sur un écran de 812 px. Le premier écran montre un titre, une phrase qui répète le prix, le prix et le début de la liste, mais pas l'action (`abonnement-mobile-ecran1.png`).
- Le premier avantage est un paragraphe de 9 lignes (y 545 à 695) qui empile 5 parcours et leurs durées. C'est le point le plus dense de la page et le plus important : il se lit comme un bloc de texte, pas comme une liste de 5 parcours.
- Comparaison des formules : le sélecteur « Mensuel / Annuel » (pastilles ≈ 42 px de haut) montre « Annuel » en gris sur gris, sans mention d'économie. Dans l'état par défaut, le visiteur ne voit pas 24,99 € ni l'économie, seulement dans la phrase d'en-tête en petit. Pas de capture de l'état annuel : à vérifier.
- Confiance : les garanties (« remboursé sous 14 jours », « résiliable en ligne », « Droit de rétractation · Paiement sécurisé par Stripe ») sont en ≈ 11 à 12 px gris sous le bouton, le poste le plus faible de la page à l'œil (contraste à mesurer). « Déjà 1 500+ inscrits, et toi ? » existe sur la carte de l'accueil (`accueil-mobile-tranche04.png`, bas de carte) mais est absent de /abonnement. Aucun élément de réassurance visuel (pas de pictogramme, pas de logo de paiement). Pas de témoignage : normal, aucun n'est réel.
- Bloc « Pas encore sûr ? Lis d'abord une étape » : bonne idée, mais 5 liens soulignés de même poids empilés sur ≈ 250 px, sans hiérarchie. Le bloc « Tu annules quand tu veux » est une carte grise sans accent, déconnectée de la zone du bouton.

## D5 Confiance visuelle globale : 7/10

- Points forts : système cohérent d'une page à l'autre (fond noir, un violet d'accent, cartes à coins arrondis, titres gras), pas de dégradé « template », finition propre, formulaire register sobre en 2 étapes (« ÉTAPE 1 SUR 2 », « Étape 2 : le paiement sécurisé, juste après ») qui rassure (`register-mobile-ecran1.png`).
- Points faibles : (1) zéro image réelle sur l'accueil, l'article et l'abonnement. Seule la fiche vidéo en a une (miniature YouTube). Le site ne montre pas le produit. (2) Les icônes des cartes d'accueil sont des emojis (😂 💡 🎬 ☕ ⚡ 🌱) : lisibles et dans le ton du « pote drôle », mais d'aspect générique. (3) Le bloc « Prochainement » en bas d'accueil (`accueil-mobile-tranche05.png` et `06`) affiche quatre fonctions « Bientôt » avec des compteurs de votes (47, 34, 62, 21) : il donne une impression de produit en construction au moment où on demande de payer. (4) Sur le formulaire register, champs et bouton ≈ 40 px de haut (y 232 à 272 et 468 à 508), placeholders gris clair sur gris foncé : sous les 44 px.
- Pas d'en-tête de navigation sur register (voulu, bon pour la conversion).

## D6 Lisibilité mobile : 7/10

- Corps de texte d'article ≈ 16 px, interligne généreux, titres H2 gras bien séparés par des filets : lecture confortable (`article-blagues-2026-mobile-tranche01.png`).
- Défaut visible dans la liste des vannes (tranches 02 à 06) : le bouton de partage rond flotte à droite et fait casser les lignes tôt (largeur de texte ≈ 250 px sur 343 disponibles). Résultat : lignes irrégulières, « trous » à droite, texte plus long de 20 à 30 %. Les indications en italique gris « → Ton blasé, comme… » (≈ 14 px) sont lisibles mais de faible contraste à l'œil.
- Densité : l'article dure ≈ 18 écrans, accueil plus de 11 écrans (7 tranches de 1 600 px). Les écrans de vannes sont réguliers, aucun point d'arrêt visuel entre sections hormis les filets.
- Petits textes à vérifier en contraste : mentions sous les CTA (≈ 11 à 12 px), pied de page, « Tu la sens venir ? » des vannes.
- Carrousel « Ton contenu du jour » sur l'accueil : la deuxième carte déborde à droite (indice de défilement) mais le texte est coupé (`accueil-mobile-tranche01.png`, y 955 à 1590). Pas de pagination visible.

## Note CONVERSION globale (design) : 5/10

Le système visuel (cohérence, finition, un accent unique) mérite plus. Ce qui tire la note vers le bas est le placement et la hiérarchie des appels : sur la page qui reçoit 58 % des entrées, le premier appel Premium arrive à 77 % de la page, le mobile n'a aucun bouton en en-tête, et le bouton d'achat de /abonnement est sous le pli. Chiffres du dossier pour situer (28 jours, sans prétendre à une causalité) : 397 entrées sur l'article, 6 `abonnement-vu`, 5 `abonnement-clic`, 1 `abonnement-reussi`. Le design n'explique pas à lui seul cet entonnoir, mais il y contribue sur les trois points ci-dessus.

## 7 actions classées par impact sur la conversion

### 1. Article n°1 : un encart Premium précoce et un bouton en en-tête mobile
- Capture et zone : `article-blagues-2026-mobile-tranche01.png` (en-tête, aucun CTA) et `tranche02.png` (fin de la section soirée, y ≈ 1 475, soit ≈ 3 075 px de page).
- Changement : (a) insérer, après la section « soirée » (≈ 20 % de la page), un encart au patron de la fiche vidéo : fond teinté violet, bordure violette, surtitre « PARCOURS RECOMMANDÉ », une phrase de bénéfice, un bouton violet plein pleine largeur de 48 px, un lien texte « Lire la première étape gratuite » dessous. Répéter le même composant à l'endroit actuel (77 %), en remplaçant la carte grise. (b) En-tête mobile, visiteur non connecté : pastille violette compacte vers /abonnement (zone tactile 44 px) à la place de l'icône compte, le compte passe dans le menu. À valider par maquette : la largeur disponible à 375 px est ≈ 200 px à droite du logo.
- Tokens : `color-surface-promo`, `color-border-accent`, `radius-lg`, `space-lg` `[MAPPER]`. Le texte de l'encart est à valider par @copywriter (étalons du chemin Premium).
- Critère de réussite : au moins un appel Premium visible avant 25 % de scroll sur 375 px ; en-tête mobile avec bouton ; événement `abonnement-clic` depuis `/blog/meilleures-blagues-droles-2026` en hausse sur 28 jours (aujourd'hui non isolé dans le dossier).
- Garde-fous : aucune barre collante, aucune fenêtre modale (cohérence « s'apprend, ne se vend » et SEO mobile).

### 2. Un seul composant bouton avec deux niveaux : Premium plein, gratuit en contour
- Capture et zone : `article-blagues-2026-mobile-tranche08.png` (deux violets pleins), `video-fiche-mobile-ecran1.png` (« Voir Premium » 36 px, bouton gratuit plus imposant), `accueil-mobile-tranche04.png` (deux boutons de même poids).
- Changement : composant `Button` à 2 variantes. `primary` (violet plein, hauteur min 48 px, pleine largeur en mobile) réservé à l'action qui mène à /abonnement. `secondary` (contour violet, texte violet, 48 px) pour toute étape gratuite (« Lire la première étape gratuite »). `tertiary` (lien souligné) pour « Voir les vannes gratuites » et « Voir toutes les vidéos ». Règle : un seul `primary` par écran. Les libellés ne changent pas dans cette action.
- Tokens : `button-height-md: 48px`, `button-radius`, `button-primary-bg`, `button-secondary-border` `[MAPPER]`.
- Critère de réussite : sur les 11 pages capturées, aucun `primary` pour une action gratuite ; tous les boutons ≥ 44 px (audit par inspecteur) ; un seul `primary` par écran 375×812.

### 3. /abonnement mobile : le bouton d'achat dans le premier écran
- Capture et zone : `abonnement-mobile-ecran1.png` (bouton absent) et `tranche01.png` (bouton à y ≈ 1033).
- Changement : sur cette page seulement (sa fonction unique est l'achat), barre basse collante avec « Commencer à 2,99 €/mois » (`safe-area-inset-bottom`, 48 px), visible tant que le bouton de la carte n'est pas à l'écran. Réécrire visuellement le premier avantage en 5 lignes courtes (une par parcours, durée à droite) sans changer un mot ni un chiffre.
- Critère de réussite : un bouton d'achat visible dans tout écran 375×812 de la page ; `abonnement-clic` / `abonnement-vu` en hausse (aujourd'hui 5 / 6 sur 28 jours, échantillon très faible).

### 4. Afficher l'économie annuelle dès l'état par défaut
- Capture et zone : `abonnement-mobile-tranche01.png`, pastilles « Mensuel / Annuel » (y 372 à 414). Pas de capture de l'état annuel.
- Changement : pastille « Annuel » accompagnée d'un badge « plus de 3 mois offerts » (formulation validée le 04/10, jamais « 4 mois »), et le prix annuel avec « 2,08 €/mois » visible sans clic ; pastille inactive avec contour pour sortir du gris sur gris. Ne pas écrire un pourcentage qui n'est pas dans les choix fondateur.
- Tokens : `badge-bg-accent`, `toggle-inactive-border` `[MAPPER]`.
- Critère de réussite : le prix annuel et l'économie lisibles sans interaction sur 375 px ; capture de l'état annuel jointe au prochain audit.

### 5. Bloc de réassurance sous le bouton d'achat
- Capture et zone : `abonnement-mobile-tranche01.png`, sous le bouton (y 1065 à 1120), et carte « Tu annules quand tu veux » (`tranche02.png`, y 8 à 145).
- Changement : remplacer les 2 lignes grises de ≈ 11 px par 3 éléments à ≥ 14 px avec pictogramme : remboursé sous 14 jours, résiliable en ligne, paiement sécurisé par Stripe. Reprendre dessous la formule existante « Déjà 1 500+ inscrits, et toi ? » (déjà sur l'accueil, formulation inchangée). Fusionner la carte « Tu annules quand tu veux » dans ce bloc. Aucun témoignage, aucun faux logo.
- Critère de réussite : texte de garantie ≥ 14 px, contraste ≥ 4.5:1 mesuré avec un outil (non mesuré ici) ; 1 500+ présent sur la page.

### 6. Liste des vannes : partage hors du flux du texte
- Capture et zone : `article-blagues-2026-mobile-tranche02.png` à `06.png` (50 boutons ronds ≈ 32 px).
- Changement : texte de la vanne en pleine largeur (343 px), bouton « Partager » en ligne basse alignée à droite, zone tactile 44 px, style fantôme avec libellé texte (règle « labels > icônes seules »). Gain de lisibilité et d'espace, moins de bruit visuel autour de l'encart.
- Critère de réussite : lignes de vanne sur ≥ 310 px de large ; hauteur d'article réduite ; cible ≥ 44 px.

### 7. Accueil bas : fusionner les deux blocs Premium empilés et reléguer « Prochainement »
- Capture et zone : `accueil-mobile-tranche04.png` (bloc « Tu crois avoir tout essayé » puis carte « Pour t'y mettre, il y a Premium », ≈ 700 px d'écart, même action), `tranche05.png` et `06.png` (« Prochainement »).
- Changement : un seul bloc final (le H2 devient l'introduction de la carte prix), un seul `primary`. Aucun texte supprimé sans ton GO : proposition à arbitrer par Thomas. Pour « Prochainement » : sortir le bloc de la zone d'achat (après la FAQ, il fait suite au moment de décision) ou l'alléger visuellement ; à arbitrer, car il sert de vote produit.
- Critère de réussite : un seul bouton `primary` entre la FAQ et le pied de page ; pas de fonction « Bientôt » juste après la carte prix.

## À conserver
Écran register en 2 étapes, mur des vannes (`vannes-mobile-ecran1.png`), encart de la fiche vidéo (patron de l'action 1), hero de l'accueil (un seul bouton plein au-dessus du pli).

Handoff → @orchestrator
- Fichier : `/home/user/Marrant/docs/marrant/audit-conversion-s20/design.md` ; conversion design 5/10 (D1 7, D2 5, D3 4, D4 6, D5 7, D6 7), 7 actions, contrastes estimés à l'œil et non mesurés.
- Priorité : actions 1 à 3 (placement des appels, composant bouton, bouton d'achat au-dessus du pli) ; libellés et blocs à supprimer = arbitrage @copywriter et Thomas.
- Manques : capture de l'état annuel, tokens réels du dépôt (`[MAPPER]`), mesures de contraste ; maquettes 375/768/1280 à relire après implémentation.
