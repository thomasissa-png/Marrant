# Relecture design à l'aveugle, « Aujourd'hui » s25 v7, tour 11

Captures lues : `docs/captures/s25/v7-aujourdhui-tour-11/aujourdhui/` (visiteur 375, 1280, 1920 ; gratuit 768, 1920 ; abonné avancé 375, 768, 1280 ; nouvel abonné 375, 1280, 1920) plus l'étalon `etalon-accueil/visiteur-accueil-1280.png`. Code lu : `typo.ts`, `tableau`, `action-du-jour`, `cap-du-jour`, `contenu-du-jour`, `etape-en-cours`, `semaines-tuile`, `hero-apercu`, `offre-apercu`, `extrait-coupe`, `tableau-verrouille`. Les 1456 et les captures « écran » n'ont pas été ouvertes : le rendu 1280/1456/1920 est identique par construction (coque 1216 px, vérifié 1280 vs 1920).

## 1. Verdict honnête : élégant, harmonieux, mais pas encore « envie »

- **Élégant et harmonieux : oui.** Une échelle tenue (aucun titre qui crie), 24 px de gouttière partout, rayons et bords uniformes, aucun texte orphelin. La page abonné est propre et lisible : la carte d'action teintée avec son bouton est le point focal évident, « Ton cap » à côté fait contrepoids, le reste se range sans effort. Le tour 11 a corrigé les vrais défauts (Z1 nette, preuve remontée, XP/série en cases).
- **Donne envie : à moitié.** Côté prospect, tout est gris sur gris : H1 30 px, promesse en 16 px gris, pastilles grises, extrait en squelette grisé. Comparée à l'accueil (emojis, mot en violet dans le titre, cartes à filet violet, vignette réelle), l'aperçu est la page la plus froide du site. La règle « zéro violet hors bouton » l'impose et je ne la conteste pas ; mais l'envie doit alors venir du CONTENU visible, et l'extrait n'en montre que des libellés (« Vanne du jour », « Conseil du jour », « Vidéo du jour » en liste de trois mots). C'est un plan du produit, pas un morceau du produit.
- Côté abonné, la page est claire mais plus « tableau administratif » que « récompense » : les chiffres du cap (250, 1) tiennent à 20 px dans une case grise, correct et discret.

## 2. Gate typographique MESURÉE (`TAILLES.md`, tour 11)

Citée telle que mesurée : **16 lignes (4 comptes x 375, 768, 1280, 1920) : 4 tailles distinctes et 6 combinaisons à chaque ligne.** Visiteur et gratuit : 24 (375, 768) ou 30 (1280, 1920), puis 20, 16, 14. Abonné avancé et nouvel : idem. Combinaisons relevées (ex. en-cours 1280) : 30/600 display, 20/600 display, 16/600 Inter, 16/400 Inter, 14/400, 14/600. Graisses 400 et 600 seulement, aucune capitale (aucune mention `MAJ`). **Gate PASS**, échelle de `typo.ts` respectée (7 constantes, 4 tailles). Seule dérogation lue au code : `max-e300` (zoom 200 %), hors mesure, assumée. `lienCarte` à 768 passe en `font-display text-xl` : 20/600 display, combinaison déjà présente, aucune taille ajoutée.

## 3. Règle d'accent

- **Abonné** : un seul aplat violet (bouton de Z1), carte Z1 avec teinte `from-accent-primary/10` et bord `accent-primary/40` : conforme à la règle (carte contenant le bouton). Aucune autre carte teintée (Ton cap, tuiles, Contenu du jour neutres). PASS. Le fond de Z1 reste lisible (le code annonce 7,08:1 en pire point, 4,66:1 atténué).
- **Aperçu** : aucun violet hors du bouton d'offre dans `main` (hero et fin d'extrait : le même bouton, jamais ensemble au premier écran à 1280, vérifié sur capture : bouton de fin à y 952, sous le pli). PASS. Noter, hors périmètre : au premier écran 375 et 768, l'en-tête global ajoute un second bouton « Premium » plein à côté de celui du hero (deux aplats visibles) ; à 1280 aussi (en-tête y 32, hero y 202). Même action, même libellé, mais ce n'est pas « un aplat par écran » : à traiter dans le lot en-tête (par exemple en-tête neutre quand l'aperçu a son offre).

## 4. Notes par critère

| Critère | Note | Constat (capture) |
|---|---|---|
| D1 Élégance, fidélité à l'accueil | 7 | Propre et cohérent, mais plus froid que l'accueil : pas un emoji, pas un mot accentué ; hero aperçu H1 30 px + promesse 16 px grise = timide pour une page de conversion. |
| D2 Hiérarchie | 8 | Abonné : excellent (carte teintée + bouton). Aperçu 1280 : le bouton d'offre en haut à droite domine bien, l'œil va du bouton à Z1 ; mais Z1 « nette » est plus claire que tout le reste et son bouton éteint (texte blanc, bord 1 px) est la 2e chose la plus contrastée de l'écran. |
| D3 Largeur 5 largeurs | 8 | Grilles 7/5, 5/7, 4/4/4 bien tenues à 1280 et 1920 (coque 1216, marges latérales seules qui grandissent). Aucun débordement. Vide en fin de carte (Z1 aperçu et nouvel, 54 px sous le bouton) : permis. Pas de vide au milieu d'un bloc relevé. |
| D4 Cohérence entre comptes | 8 | Même grammaire (étiquette 14/600, titre 20/600, 24 px, pieds de tuile). Un écart : « Tes 4 premières semaines » a une ÉTIQUETTE comme titre alors que ses voisines ont étiquette + titre 20 px (voir 5.2). |
| D5 Finition au pixel | 8 | Cibles : `min-h-11` sur Connexion et liens de carte, pied de tuile `min-h-12`, boutons `size lg`. Contraste `opacity-75` sur #B3B3B3 / #1F1F1F : environ 5:1 (calculé : mélange #8E8E8E), AA OK. Déviations de rythme dans le code : `lg:mb-10` (40 px, valeur interdite par le design §2.4), `py-0.5` et `px-2` morts (pastilles `sr-only` sous 768). |
| U1 Prospect, 3 secondes | 7 | Fermé : lisible (pastille Premium, verrous, fondu, « La suite est dans Premium »), offre en haut, une seule offre. Valeur : la promesse dit « tableau de bord », l'extrait ne montre aucune vraie valeur (pas de vanne, pas de visuel). Z1 nette, bouton blanc en contour, peut se lire « cliquable » : risque de « je suis dedans » que le brief veut éviter. |
| U2 Abonné, clarté | 9 | « Je sais quoi faire » : bouton unique, libellé clair, rien de concurrent. |
| U3 Abonné, envie de continuer | 8 | Cap, XP, série en cases, étape n sur N, mission : tout est là. Manque une « récompense » visible (rien ne célèbre la série ; flamme blanche à 20 px). |
| U4 Nouvel abonné | 8 | Jamais morte : premier pas, cap 1, étape conseillée, 4 semaines, contenu du jour. « Tes 4 premières semaines » est la tuile la plus dense et la moins titrée. |
| U5 Accessibilité, cohérence | 8 | Extrait `inert` + `aria-hidden`, phrase `sr-only`, focus par anneau intérieur. Cohérence OK entre comptes. |

## 5. Défauts précis et corrections codables (aucun n'ajoute de taille)

1. **L'extrait montre des libellés, pas du produit** (U1, D1). Tuile « Contenu du jour » : trois mots dans une liste. Piste : dans `tableau-verrouille.tsx`, remplir `TEXTE` la ligne de « Vanne du jour » avec la vanne par défaut déjà utilisée par la page d'accueil si elle existe en statique (non fournie, signalé par le tour 11 : pas de `/api/daily` statique). Sans cela, rien à inventer : l'aperçu garde sa limite. Ce qui ferait 10 : une vraie vanne figée dans la tuile.
2. **Titre de « Tes 4 premières semaines » plus faible que ses lignes** (D4). Capture nouvel 1280 : étiquette 14/600 gris, puis « Semaine 1 : » 14/600 BLANC : les préfixes pèsent plus que le titre de la tuile. Correction : `semaines-tuile.tsx`, passer le `h2` en `TITRE_CARTE` (20/600, `mt-2` avant la liste) comme « Répartie » à côté ; accepter que le bas de « Étape conseillée » ne s'aligne plus 1:1 (les deux tuiles sont `h-full`). Ou garder l'étiquette et passer les préfixes en `text-text-secondary`.
3. **Légende « Voici un exemple… » flotte entre hero et extrait** (D1, D5). 1280 : 60 px au-dessus, 43 au-dessous : elle ne se rattache à rien. Correction : `extrait-coupe.tsx`, `md:mt-12` en `lg:mt-16` et `lg:mb-10` en `lg:mb-6` (24 px, règle « titre de section vers ses cartes »), net inchangé pour le pli à 900 px ; supprime aussi le `mb-10` hors grille.
4. **Z1 nette de l'extrait ressemble à un bouton vivant** (U1). Capture visiteur 1280 : « Commencer » blanc 16/600 encadré, plus contrasté que le contour des tuiles voisines. Correction : `action-du-jour.tsx`, `boutonEteint` : `text-text-secondary` à la place de `TEXTE_FORT` (même taille et graisse 16/600, aucune combinaison nouvelle) pour que le bouton figé se lise éteint.
5. **Hero aperçu : preuve et pastilles en fin de colonne gauche** (D1). 1280 : « 1 500+ » est une ligne isolée à 24 px des pastilles, sans lien avec la carte d'offre dont elle est la preuve. Piste : la remettre dans la carte d'offre dès 1024 (comme avant le tour 9) n'est pas souhaitable (carte plus haute) ; garder, mais l'aligner sur la première ligne de texte des pastilles (`mt-6` conservé, OK) : aucun changement exigé.
6. **768 gratuit : « Ton cap » en bandeau** (D5). La phrase « Ta série démarre… » tient en haut à droite, collée à son verrou (8 px), alors que le cap est à gauche sur deux niveaux. Correction : `cap-du-jour.tsx`, en `fige` à 768, `pr-8` sur la phrase pour dégager le verrou, ou la descendre sous le cap (`md:basis-full`).
7. **Rythme** (D5). `lg:mb-10` et `py-0.5/px-2` (code mort sous 768) : à nettoyer dans `extrait-coupe.tsx` et `hero-apercu.tsx`.
8. **Deux aplats Premium au premier écran** (en-tête, hors périmètre) : voir section 3.

Pistes (non bloquantes) : une vraie vignette en tête de « Contenu du jour » dans l'aperçu ; célébrer la série (aucune couleur : le chiffre en 20/600 suffit, mais un libellé « série en cours » viendrait d'un texte à valider).

## 6. Résultat

Barre de validation (9/10, sans faute dure) : non atteinte sur les critères D1 (7), U1 (7). Pas de faute dure au sens du brief (gate typo PASS, un seul aplat par page côté page, aucune taille hors échelle). Le minimum des critères est 7.

NOTE GLOBALE : 7/10

Fautes dures : aucune. Défauts bloquant les 9/10 (à corriger) :
1. `apps/web/src/components/espace/apercu/tableau-verrouille.tsx` : l'extrait ne montre aucun contenu réel (libellés seuls), cause principale du « envie à moitié ».
2. `apps/web/src/components/espace/aujourdhui/semaines-tuile.tsx` : titre de tuile plus faible que ses préfixes « Semaine n : ».
3. `apps/web/src/components/espace/apercu/extrait-coupe.tsx` : légende flottante (60/43 px), `lg:mb-10` hors grille.
4. `apps/web/src/components/espace/aujourdhui/action-du-jour.tsx` : bouton éteint de Z1 nette trop vif (texte blanc).
