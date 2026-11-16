# Relecture design à l'aveugle, « Aujourd'hui » (s25 v7, tour 8)

Relue sur captures (`docs/captures/s25/v7-aujourdhui-tour-8/aujourdhui/`) et code (`typo.ts`, `tableau.tsx`, `action-du-jour`, `cap-du-jour`, `etape-en-cours`, `semaines-tuile`, `contenu-du-jour`, `hero-apercu`, `offre-apercu`, `extrait-coupe`, `tableau-verrouille`). Aucune relecture ni commit lus.
Captures ouvertes : visiteur 375 (écran), 1280, 1920 ; gratuit 768 (même chemin de code que visiteur, sans « Connexion », avec la phrase d'objet) ; en-cours 375, 1280, 1920 ; nouvel 375, 768, 1280. Non ouverts : gratuit 375, 1280, 1920 et les 1456.

## 0. Le jugement d'abord : élégant, harmonieux, ça donne envie ?

Oui pour l'abonné, presque pour l'aperçu.

- **Abonné (en-cours, nouvel)** : la page est calme et tenue. Deux poids seulement (Z1 teintée avec son bouton plein, puis tuiles neutres), un seul violet fort, des rangées qui se remplissent (7/5, 6/6, 5/7, vanne et conseil empilés contre la vidéo), un rythme de 24 px constant, des gris à deux niveaux, aucune capitale. Au plissé d'yeux : (1) le bouton plein de Z1, (2) « Aujourd'hui », (3) la barre du cap. C'est au niveau d'un produit soigné, proche de l'accueil. Le nouvel abonné n'a jamais une page morte (cap, étape conseillée, 4 semaines, contenu du jour). Le contenu du jour du nouvel abonné à 768 (ligne de média pour la vidéo) est le meilleur détail de la page.
- **Aperçu (visiteur, gratuit)** : il se lit FERMÉ (verrous, contenu atténué, bouton « Commencer » en contour éteint, fondu, « La suite est dans Premium »), l'offre est en haut, une seule. À 375, bouton visible sans défiler (y 350 à 398) et titre de la première tuile en bas d'écran. Mais **la carte « Ton premier pas » de l'extrait garde la teinte et le bord violet**, alors qu'elle ne contient PAS le bouton plein (son bouton est un contour éteint). La précision reçue autorise la teinte pour « la carte qui contient ce bouton » : ici elle ne le contient pas. C'est un second accent violet, placé juste sous l'offre, dans une zone censée être fermée : il fait lire cette carte comme la plus vivante de l'extrait et concurrence le bouton d'offre (voir faute 1).

## 1. Gate typographique MESURÉE (`TAILLES.md`, sortie de `tailles-comptes.mjs`)

Citation : « Gate PASS sur les 16 lignes ; aucune capitale ; graisses 400 et 600 seulement. »

| Compte | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| visiteur | 4 tailles (24, 20, 16, 14), 6 comb. | 4 (24, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 |
| gratuit | 4 (24, 20, 16, 14), 6 | 4 (24, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 |
| en-cours | 4 (24, 20, 16, 14), 6 | 4 (24, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 |
| nouvel | 4 (24, 20, 16, 14), 6 | 4 (24, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 |

Verdict : **PASS**, seuils 4 tailles et 6 combinaisons respectés (jamais dépassés, jamais 5 tailles). Conforme à `typo.ts` et à l'échelle de `typo-harmonie-espace-s25.md` : 30/20/16/14, graisses 400 et 600, Jakarta seulement pour `TITRE_PAGE` et `TITRE_CARTE`. Les 14/600 (étiquettes, pieds, « Semaine n : ») et 16/600 (boutons) sont des combinaisons de l'échelle. Rien lu au code hors échelle sur les fichiers listés (pas de `text-xs`, `font-bold`, `uppercase`). Je ne vois aucune taille ajoutée par le tour 8.

## 2. Notes /10 (globale = minimum)

### Design

| Critère | Note | Justification et correction |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 8 | Abonné 9. Aperçu 8 : le violet du bord de Z1 dans l'extrait (visiteur 1280, y 500 à 698 ; 375, y 608 à 810) rompt la retenue du reste du bloc fermé. Correction : faute 1. Ferait 10 : bord et teinte neutres dans l'extrait, la page ne garde qu'un violet par écran. |
| 2 Hiérarchie, un seul accent fort | **7** | Abonné 9 (Z1 tintée + bouton plein = point focal voulu, l'en-tête abonné n'a pas de plein). Aperçu 7 : deux accents violets (bouton d'offre pleine, puis carte teintée à bord violet 64 px plus bas), faute dure 1. |
| 3 Usage de la largeur, 5 largeurs | 9 | Aucun débordement ni tuile creuse. Rangées pleines à 1280 et 1920 (coque 1216 px comme l'étalon, marges latérales seules à 1920, cohérent avec la bande). Vides tolérés (fin de colonne) : sous les pastilles du hero à 1280 (environ 105 px) et 768 (environ 130 px, la carte d'offre gratuit est la plus haute) ; bas de « Ton cap » (environ 70 px). Aucun vide au milieu d'un bloc. Piste (pas faute) : à 1280 la carte Z1 du nouvel abonné a un titre sur une ligne et un bouton de 256 px, environ 400 px libres à droite du bouton : acceptable, aucun texte à ajouter, ne pas grossir. |
| 4 Cohérence entre comptes | 9 | Mêmes tuiles, rayons 12 px, pieds de 48 px, étiquettes 14/600, barres grises. L'aperçu reprend le gabarit de l'abonné nouvel (rangée 7/5 puis 4/4/4), donc le prospect voit le produit qu'il achète. Seul écart : le violet de Z1 (faute 1 le résout). |
| 5 Finition (alignements, AA, cibles) | 9 | Cibles lues au code : boutons `lg` 48 px (`h-12`), `PIED_TUILE_GABARIT` `min-h-12`, « Connexion » `min-h-11 min-w-11`, `lienCarte` `min-h-11`. Contraste : Z1 teintée atténuée à 0,75 mesurée 4,66:1 par le test annoncé dans le code (non remesuré par moi), reste > 4,5:1. Alignements : sous-grille de « Semaine n : » propre, pieds des tuiles de rangée alignés (Reprendre / Facultative). Pistes : (a) pastilles du hero sous 768 en `px-2 py-0.5` contre `px-3 py-1` partout ailleurs (`hero-apercu.tsx` l.69), cohérent avec la décision du tour 8 mais hors helper `PASTILLE` ; (b) « Une autre » et les puces de la question C9 mesurent environ 43 à 44 px sur capture (fichiers `vanne-toucher.tsx`, `question-aise.tsx` non lus) : vérifier `min-h-11`. |

### UX

| Critère | Note | Justification |
|---|---|---|
| 1 Prospect, envie en 3 s | 8 | Fermé lisible, valeur visible (promesse, 6 pastilles, extrait réel), offre en haut à droite (1280) ou sous le H1 (375), une seule offre (le second bouton est sous le fondu, hors premier écran à 1280, 1920 et 375). Retient 1 point : la carte violette de l'extrait attire l'œil vers du « fermé » au lieu de l'offre. |
| 2 Abonné, clarté | 9 | Un bouton plein, Z1 en première position, intitulés explicites. Z1 de l'abonné en cours est dense (étiquette, titre, texte, compteurs, 2 lignes cliquables) mais bien hiérarchisée. |
| 3 Abonné, envie de continuer | 9 | Cap en haut dès J1, XP, série avec flamme, « Étape 3 sur 3 » avec barre, mission, contenu du jour : la progression est partout visible. |
| 4 Nouvel abonné | 9 | Jamais de page morte : premier pas, cap 1, étape conseillée, 4 semaines, contenu du jour. |
| 5 Accessibilité visible, cohérence | 9 | Cibles et contrastes conformes au code lu, focus visible conservé sur les pieds (`ring-inset`). |

## 3. Pistes (non bloquantes)

1. Pastilles du hero sous 768 : harmoniser sur `PASTILLE` si la place le permet (`hero-apercu.tsx` l.69).
2. Hero à 768 : la carte d'offre gratuit (phrase d'objet + réassurance + preuve) dépasse le texte d'environ 130 px ; si cela gêne Thomas, faire de la phrase d'objet la seule ligne sous le bouton et laisser la réassurance en dessous du filet (réorganisation, aucun texte nouveau, aucune taille nouvelle).
3. Vérifier `min-h-11` sur « Une autre » et les puces C9.
4. Hors périmètre, constaté : le bouton plein de l'en-tête global reste visible avec celui du hero à 768, 1280, 1920 (visiteur, gratuit). Même action, même libellé, assumé par la spec (§2.1) ; je ne le juge pas.

## 4. Fautes dures

1. Second accent violet dans l'aperçu : la carte « Ton premier pas » de l'extrait garde `border-accent-primary/40` et le dégradé `from-accent-primary/10` (visiteur et gratuit, 375, 768, 1280, 1920), alors que son bouton est un contour éteint, pas le plein. La tolérance accordée vaut pour la carte qui contient le bouton plein, ce qui n'est vrai que pour l'abonné. Correction codable : dans `apercu/tableau-verrouille.tsx` + `aujourdhui/action-du-jour.tsx` + `aujourdhui/tableau.tsx`, quand `fige`, utiliser le cadre neutre (`TUILE`, sans `border-accent-primary/40` ni `bg-gradient-to-br`) au lieu de `CARTE_ACTION`. Aucune taille ajoutée ; le contraste du texte atténué s'améliore. L'abonné garde sa carte teintée.

NOTE GLOBALE : 7/10 (9/10 attendu dès la correction de la faute 1, qui ne change ni structure ni échelle ; l'abonné est déjà à 9, l'aperçu à 8 avant correction)

Fautes dures :
1. Carte « Ton premier pas » de l'extrait fermé teintée et bordée de violet sans contenir le bouton plein (second accent) : `apercu/tableau-verrouille.tsx` + `aujourdhui/action-du-jour.tsx` + `aujourdhui/tableau.tsx` (variante neutre quand `fige`).
