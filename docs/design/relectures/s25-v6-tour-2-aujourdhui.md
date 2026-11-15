# Relecture DESIGN à l'aveugle, v6 tour 2, groupe « aujourdhui » (/mon-espace)

Captures lues : les 20 de `docs/captures/s25/v6-tour-2/aujourdhui/` (4 comptes x 5 largeurs) + étalon accueil 1280 + thème. Code lu seulement pour localiser la correction : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx`.

## Notes

| Critère | Note | Verdict |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Cartes `rounded-xl`, filet dégradé violet en haut, pastilles (Nouvelle, À revoir, Entre potes), bouton plein violet, rythme aéré : la langue est là. Piste : H1 et « Contenu du jour » alignés à gauche, l'étalon centre ses titres (cohérent avec le reste de l'espace, ne retient pas la note). |
| 2 Hiérarchie, lisibilité | 9 | Une action dominante par état (Premium en aperçu, « Les cartes du jour » abonné avancé, « Commencer » nouvel abonné). Piste : « Oui / À moitié / Rien » de l'aperçu sont en gris atténué sur fond sombre et ressemblent à des boutons désactivés (visiteur-aujourdhui-1280.png) ; vérifier le contraste du texte (cible 4.5:1). |
| 3 Mise en page aux 5 largeurs | 6 | FAUTE DURE sur la page d'aperçu à 1280, 1456, 1920 (voir ci-dessous). Les autres états (en-cours, nouvel) tiennent aux 5 largeurs, sans débordement, coque centrée à 1456/1920. |
| 4 Cohérence avec l'espace | 9 | Même coque, mêmes cartes, mêmes titres entre comptes. |
| 5 Finition au pixel | 9 | Cibles 44 px respectées (Oui/À moitié/Rien, Premium, Les cartes du jour, Une autre, Commencer). Alignements nets. Pistes ci-dessous. |

## Faute dure

**1. Colonne droite vide sur l'aperçu Premium à 1280+** (`visiteur-aujourdhui-1280.png`, `-1456.png`, `-1920.png`, idem `gratuit-*`). La carte d'offre fait environ 90 px de haut (bouton + « Connexion ») et la colonne droite reste vide sur environ 310 px sous elle, en face d'une carte d'exemple de 400 px : un tiers de la coque est du noir mort, et l'action unique est la plus petite chose de la page. À 768 la même page empile exemple puis offre et c'est propre. Le `lg:sticky` n'y change rien : l'exemple tient dans l'écran, rien ne défile.
- Correction codable : dans `apercu-rubrique.tsx`, ne passer en deux colonnes que si le contenu le justifie. Le plus simple : retirer `lg:grid-cols-12`, `lg:col-span-7`, `lg:col-span-5`, `lg:sticky lg:top-32` et garder la pile (exemple puis offre) dans la coque pleine largeur, offre en barre pleine largeur (`justify-between`, bouton à droite) à partir de `lg`. Variante : garder deux colonnes mais passer `items-start` en `lg:items-stretch` avec l'offre centrée verticalement (`lg:flex-col lg:justify-center`), moins propre.
- Ce qui ferait 10 : aperçu sans trou à 1280/1456/1920, offre au moins aussi lisible que l'exemple (pas de texte nouveau requis).

## Pistes (ne retiennent pas la note)

- `en-cours-aujourdhui-1280/1456/1920.png` : carte « Mission · Marche 2 » étirée à la hauteur de « Où veux-tu être plus à l'aise ? » : environ 70 px de vide intérieur sous « Facultative ». Idem « Conseil du jour » (environ 110 px sous le lien) face à la vanne et à la vidéo. Correction : `items-start` sur la grille de ces rangées, ou accepter l'égalité de hauteur (voulu, sobre).
- `en-cours-aujourdhui-768.png` : même vide dans Mission (environ 120 px).
- Vignette « Vidéo du jour » (tous comptes abonnés) : fond dégradé violet avec bouton lecture, sans image, alors que l'accueil montre une vraie vignette. Probablement l'image non chargée dans l'environnement de capture : à vérifier avec réseau ; si c'est le rendu réel, c'est un placeholder à remplacer par la vraie miniature (ou retirer le cadre).
- `nouvel-aujourdhui-*.png` : étiquette « Ton premier pas » en 12 px gris, légère face au titre de 30 px ; correct, à garder sous surveillance (contraste).
- Bande : fondu de défilement à 375 et 768 présent, rubrique active soulignée, cadenas lisibles (hors périmètre, rien cassé par la section).
- Texte : rien de faux repéré. Aucune proposition de texte.

## Notes par compte

- visiteur / gratuit : identiques sauf « Connexion » (absent chez l'inscrit, cohérent). 375 et 768 propres (pile). 1280+ : faute 1.
- en-cours : 5 largeurs propres, hiérarchie claire (hero, deux cartes, trois contenus).
- nouvel : 5 largeurs propres, jamais une page morte, un seul bouton fort.

NOTE GLOBALE : 6/10
