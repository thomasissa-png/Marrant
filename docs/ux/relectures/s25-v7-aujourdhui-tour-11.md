# Relecture UX à l'aveugle, « Aujourd'hui » (s25 v7, tour 11)

Brief appliqué : `docs/espace-client/travail-en-cours/brief-relecture-v7.md`. Aucune relecture ni commit lu. Captures ouvertes : visiteur 375, 768, 1280, 1920 (pleine page et premier écran à 375 et 1280) ; gratuit 375, 768, 1280, 1920 ; en-cours 375, 768, 1280, 1920 ; nouvel 375, 768, 1280, 1920. Code lu : `apercu/offre-apercu.tsx` (échantillon ; le reste jugé sur captures).

## 1. Gate typographique MESURÉE : PASS

Citation de `TAILLES.md` (script `tailles-comptes.mjs`, premier écran, `main`, nœuds `sr-only` inclus) : les 16 lignes (4 comptes x 375, 768, 1280, 1920) donnent **4 tailles** (24/20/16/14 px sous 1024, 30/20/16/14 dès 1280) et **6 combinaisons** (30 ou 24/600 display, 20/600 display, 16/400, 16/600, 14/400, 14/600), graisses 400 et 600 seulement, aucune capitale. Toutes dans l'échelle de `typo-harmonie-espace-s25.md` §1. Ex. : « visiteur 1280 : 4 (30px, 20px, 16px, 14px) | 6 ». Le tour 11 n'ajoute aucune taille (nom d'étape de 14/400 à 16/400, combinaison déjà présente). Pas de faute dure typographique. Sous le premier écran, je n'ai rien vu de hors échelle sur les captures (chiffres XP et série en 20/600, cohérents).

Violet : un seul aplat par écran dans `main` (bouton d'offre côté prospect ; bouton d'action côté abonné). Côté abonné la carte Z1 porte teinte et bord violets doux (permis). Côté aperçu, aucun violet hors du bouton d'offre (pastille, verrous, pastilles du hero, tuiles : neutres). Réserve : à 375 et 1280 premier écran, le bouton « Premium » de l'en-tête global est un second plein, mais l'en-tête est hors périmètre. Au 1280 en pleine page, le bouton de fin d'extrait (même action) est un second plein plus bas, jamais visible avec le premier : accepté par la spec.

## 2. Ce que je vois, compte par compte

**Visiteur / gratuit, 375.** Premier écran : pastille « Premium » avec verrou à droite du H1, promesse, « 1 500+ », carte d'offre avec bouton plein à y 322-370, réassurance, « Connexion », puis légende et la tuile Z1 entière avec son bouton en contour éteint et son verrou. Lit « fermé » : oui (verrou, bouton contour, légende « exemple », tuiles suivantes atténuées et coupées par le fondu). Le produit est visible dès le premier écran. Fin d'extrait : « La suite est dans Premium » et bouton, collés au fondu, sans vide. Gratuit : phrase d'objet sous le bouton, bien séparée de la réassurance. Bon.

**Visiteur / gratuit, 1280 et 1920.** Hero 7/5 : texte à gauche, carte d'offre à droite avec le bouton en haut (y 178). Premier écran : Z1 et « Ton cap » visibles, les trois tuiles du bas commencent avant le pli et se coupent dans le fondu. Fermé au premier coup d'œil : oui. Coque plafonnée à 1216 px, marges 350 px à 1920 : cohérent avec la bande (spec §1).

**Visiteur / gratuit, 768.** Hero en 2 colonnes, extrait en 4 rangées. Voir faute dure 1 (tuile « Ton cap »).

**En-cours, 375 / 768 / 1280 / 1920.** « Si tu as 5 minutes » : titre, bouton plein « Les cartes du jour » en tête de carte, accroche, deux lignes cliquables (Nouvelle, À revoir). À 375 le bouton est à y 338-385, l'abonné sait quoi faire en 3 secondes. « Ton cap » avec XP et série dans deux cases, aide de la série dessous ; étape et mission côte à côte ; « Contenu du jour » en 2 colonnes (vanne et conseil empilés, vidéo à droite) ; C9 en pied. À 1280 et 1920 Z1 (8 col.) et Z2 (4 col.) sont à hauteur égale (y 235-552), aucun vide de milieu. À 768 le cap est un bandeau avec cases à droite : propre. Donne envie de continuer : oui (250 XP, jour de pratique, étape 3 sur 3, mission, vanne du jour).

**Nouvel, 375 / 768 / 1280 / 1920.** Z1 « Ton premier pas » avec « Commencer » plein, « Ton cap » dès le premier jour, « Étape conseillée » avec lien « Commencer l'étape 1 », « Tes 4 premières semaines » (feuille de route), « Contenu du jour » réel. Page jamais morte : oui (5 zones avant le contenu du jour). C'est le meilleur compte de la série.

## 3. Grille

| Critère | Note | Défaut précis, correction, ce qui ferait 10 |
|---|---|---|
| D1 Élégance, fidélité à l'accueil | 8 | Sobre, un accent, 4 tailles. Reste le sentiment de « tuiles sages » : voir D3. Pour 10 : lever les deux fautes ci-dessous. |
| D2 Hiérarchie | 8 | Abonné : Z1 teintée dominante, bouton plein unique : net. Aperçu : bouton en haut dans la carte d'offre, net. Mais Z1 nouvel/aperçu à 1280 pèse peu (voir faute 2) : la teinte porte seule la dominance. |
| D3 Largeur aux 5 largeurs | 6 | Fautes dures 1 et 2 ci-dessous. |
| D4 Cohérence entre comptes | 8 | Mêmes cartes, mêmes rayons, mêmes gabarits. Écart : la preuve « 1 500+ » est hors carte à 375 et dès 1024 (sous les pastilles, à gauche, loin de l'offre, un trait de texte isolé) mais dans la carte à 768. Pour 10 : mettre la preuve au même endroit partout, dans la carte d'offre (`offre-apercu.tsx`, retirer `masqueeLg`, `Preuve place="hero"`), ce qui supprime aussi la bande vide du hero à gauche. |
| D5 Finition au pixel | 8 | Cibles : « Connexion » en `min-h-11 min-w-11` (code vérifié), boutons 48 px, pieds de tuile 48 px. Défaut : la carte d'offre est en `p-4 md:p-6` (`offre-apercu.tsx` l.80) alors que la spec design §2.4 fixe `p-6` partout ; dérogation voulue au tour 8, à confirmer (piste). Commentaire de `Preuve` périmé (« à 24 px » alors que la mesure est 20 px). |
| U1 Prospect : envie en 3 secondes | 8 | Fermé lisible, produit visible, offre en haut, une seule offre. Frein : l'extrait montre des libellés plus que de la valeur (« Vanne du jour », « Conseil du jour », « Vidéo du jour » en simples lignes, pas un seul exemple de contenu). C'est la contrainte du rendu statique (`tableau-verrouille.tsx`), pas une faute ; piste : y montrer la vanne réelle quand c'est possible côté serveur. |
| U2 Abonné : clarté | 9 | Une action pleine, titre de carte lisible, date en en-tête. |
| U3 Abonné : envie de continuer | 9 | Cap, XP, série, étape n sur N, mission, vanne du jour. |
| U4 Nouvel abonné | 9 | Jamais mort. Z1 pèse peu (faute 2). |
| U5 Accessibilité et cohérence | 8 | Cibles 44 px, contrastes lisibles, `sr-only` pour pastilles sous 768. Extrait atténué à `opacity-75` : contraste du texte du tiers bas (« Tes premières répliques ») à vérifier par mesure ; il passe l'oeil mais le test AA calculé n'est pas joint. |

## 4. Fautes dures

1. **Vide au milieu d'un bloc, tuile « Ton cap » à 768 (visiteur, gratuit, nouvel).** La barre de 5 segments occupe 320 px sur 720, « cap 1 sur 5 » est collé à gauche, la phrase de série est en haut à droite : 350 px de trou sous elle, entre la barre et le bord droit (captures `visiteur-aujourdhui-768.png` y 790-890, `nouvel-aujourdhui-768.png`). L'abonné en-cours à 768 n'a pas ce trou (ses deux cases XP/série remplissent la droite). Correction codable : à `md` jusqu'à `lg`, faire de la barre une rangée pleine largeur (`md:col-span-full`, segments `flex-1`), « cap n sur 5 » aligné à droite de la ligne du nom, et la phrase de série dessous sous un filet (`mt-4 border-t border-border pt-4`), comme à 1280 ; fichiers : `cap-du-jour.tsx`, `tableau-verrouille.tsx`.
2. **Tuile creuse : Z1 dominante à 1280 et 1920 (nouvel et aperçu).** 700 px de large, 200 px de haut : une ligne de titre, un bouton calé à gauche, et plus de 400 px vides à droite du bouton et 50 px sous lui (`nouvel-aujourdhui-1280.png` y 250-447). La carte censée dominer est la moins fournie de la rangée. Pas de grossissement de texte (interdit). Correction : à `lg`, mettre scène et bouton sur une même ligne (`lg:flex lg:items-end lg:justify-between lg:gap-8`, bouton `lg:shrink-0`) pour que la carte se resserre autour de son contenu (aucun texte neuf, aucune taille ajoutée). Fichiers : `premier-pas.tsx`, `action-du-jour.tsx`, `tableau-verrouille.tsx` (le bouton figé suit).

Pistes (non bloquantes) : preuve « 1 500+ » dans la carte d'offre partout ; `p-6` sur la carte d'offre à 375 ; vanne réelle dans l'extrait ; mesure AA de l'extrait inerte jointe.

Textes à valider par Thomas, jugés sur leur place : T1 (promesse) est bien placée sous le H1, cohérente avec les pastilles ; T2 « La suite est dans Premium » est bien posée sur le fondu avec son bouton. Rien de faux repéré : « 5 parcours » (gratuit) à comparer au catalogue réel par Thomas (la phrase d'objet existe déjà en config).

NOTE GLOBALE : 6/10

Fautes dures :
1. Vide au milieu de la tuile « Ton cap » à 768 (visiteur, gratuit, nouvel) : `apps/web/src/components/espace/aujourdhui/cap-du-jour.tsx` et `apps/web/src/components/espace/apercu/tableau-verrouille.tsx`.
2. Tuile Z1 creuse (bouton seul à gauche, plus de 400 px vides à droite) à 1280 et 1920, nouvel et aperçu : `apps/web/src/components/espace/aujourdhui/premier-pas.tsx`, `action-du-jour.tsx`, `apps/web/src/components/espace/apercu/tableau-verrouille.tsx`.
