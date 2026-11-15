# Relecture design à l'aveugle : nav v6, variante d (s25)

Périmètre : 24 captures `docs/espace-client/etalons/nav-v6/variantes/d-*.png` + références (menu Thomas 15-11, étalon accueil 1280/375, v6 « PowerPoint »). Aucune relecture ni commentaire de maquette lus. Le code de la maquette n'a pas été lu : les retouches visent les classes du thème (`apps/web/tailwind.config.ts` : `background.light/elevated`, `border`, `accent.primary`, `text.muted`, `rounded-lg`, écrans `e300/e360/e400/sm/md/lg/xl/2xl`). `project-context.md` non relu (relecture à l'aveugle demandée).

## Ce qui est réussi (mesuré sur les rendus)

- Recherche à 176 px confirmée aux 3 largeurs où elle apparaît (350 px à 2x sur 1280, 768 et 1920).
- Alignements : bord gauche du bandeau = logo = H1 ; bord droit du bandeau = bouton Premium / avatar. Identique à 768, 1280, 1920.
- Cadenas : petit, de même teinte que le libellé, groupé sur les 5 rubriques Premium du non-abonné, absent chez l'abonné. Discret, lisible.
- Actif : puce `#2A2A2A` + trait violet sous le libellé (cadenas compris pour une rubrique Premium). Le trait porte l'information, la puce seule serait trop faible.
- Groupes séparés par un filet vertical (Premium | contenu | Favoris, Carnet) : c'est la langue de la référence (pilule, puce active, séparateurs). Plus aucun effet « PowerPoint » : fond plat, pas de bordure, pas d'ombre.
- Menu « … » abonné : panneau `bg-background-card` avec filet violet en tête (même signature que les cartes du site), 2 entrées, cohérent.

## Notes

### 1. Élégance et finition : 8/10
Faute dure :
- **Rangée 2 collée à la rangée 1** (`d-visiteur-vannes-1280.png`, aussi 768, 1920) : 5 px entre le bas du champ de recherche / bouton Premium et le haut du bandeau, 6 px entre le bandeau et le filet. Le bandeau est pris en sandwich ; à 1280 l'en-tête paraît dense, contrairement à l'étalon accueil qui respire.
  Retouche : conteneur du bandeau `mt-2 mb-2` (8 px) à `mt-3 mb-3` (12 px) sur `md:` et plus ; garder le gabarit mobile (`py-2`) tel quel.
- **Glyphes coupés sans fondu suffisant** (voir critère 4) : « oondre » (`d-visiteur-vannes-768.png`), « ie » (`d-abonne-vannes-375.png`), « Cor » (`d-gratuit-apercu-768.png`). Fragment de lettre visible = finition ratée.
Pistes (ne retiennent pas la note) : conteneur `rounded-xl` alors que la référence et les filtres du site sont en pilule (`rounded-full` conteneur, `rounded-full` puces) ; gros vide entre « Carnet » et « … » dès 1280 (~112 px CSS à 1920) : « … » flotte, on peut coller « … » à Carnet (`ml-2` au lieu de `ml-auto`) ou garder l'alignement à droite, au choix du fondateur.

### 2. Fidélité à la langue du site et à la référence : 10/10
Violet `accent.primary` seul accent, fond `background.light` du bandeau sur `background` de la page, Plus Jakarta pour les titres, Inter pour les libellés, filet violet des cartes repris dans le « … ». Même structure que la référence de Thomas (pilule, puce active, filets de groupes, « … » en fin). Aucune faute, uniquement les pistes du critère 1.

### 3. Lisibilité et hiérarchie : 9/10
- Actif lisible aux 4 largeurs (blanc contre `text.secondary` + trait violet), l'œil trouve la page courante en un coup. Groupes nets. Cadenas non intrusifs.
- Cas accueil sans rubrique allumée (`d-visiteur-aujourdhui-menu-*`) : bandeau uniforme, propre ; pas d'actif parasite.
Faute dure mineure : à 768 le dernier élément visible est un **filet de groupe orphelin** collé au bord droit (« La lettre | » dans `d-visiteur-vannes-768.png` et `d-gratuit-vannes-768.png`) : un séparateur sans voisin lit comme un défaut.
Retouche : masquer le séparateur s'il est le dernier visible, ou plus simple, étendre le fondu droit (critère 4) pour qu'il le couvre.
Piste : puce active `#2A2A2A` sur `#1A1A1A` = contraste doux ; correct car doublé du trait.

### 4. Tenue aux 4 largeurs : 8/10
- 1280 et 1920 : propres, rien ne déborde, tout le bandeau tient.
- 375 : défilement horizontal avec auto-centrage de l'actif, bord gauche aligné avec le logo, cartes alignées sous le bandeau. Mais fondu gauche trop court (fragment « ie » visible sur `d-abonne-vannes-375.png`).
- 768 : le bandeau défile (Favoris, Carnet, « … » hors champ) ; fondus insuffisants des deux côtés (« oondre », « Cor », filet orphelin).
Faute dure : fondu de bord. Retouche (bandeau défilant, `md:` à `lg:`) :
`[mask-image:linear-gradient(to_right,transparent,#000_40px,#000_calc(100%-40px),transparent)]` (ou un pseudo-élément `w-10 bg-gradient-to-r from-background-light`), plus `snap-x scroll-px-10` et `snap-start` sur les items pour que l'arrêt du défilement ne laisse jamais une lettre coupée sous le fondu. Retirer le masque quand tout tient (`xl:[mask-image:none]`).
Piste : à 375 pas de recherche visible dans l'en-tête (Premium + menu burger) ; aucune capture du burger ouvert, impossible de vérifier que la recherche y est. À confirmer, non noté.

### 5. Respect des décisions : 8/10
Conformes : menu toujours affiché pour tous, un seul niveau de rubriques, cadenas discret sur les Premium du non-abonné seulement, recherche à 176 px.
Faute dure (ou capture ratée) : `d-visiteur-aujourdhui-menu-1280.png` et `-1920.png`, censées montrer « … » ouvert, montrent « … » **fermé**, sans panneau. Soit la capture a échoué, soit « … » est un bouton mort chez le visiteur (le panneau « Mes questions / Mes répliques » n'apparaît que chez l'abonné). Un contrôle visible qui n'ouvre rien est inacceptable.
Retouche : si le visiteur n'a aucune entrée, ne pas rendre « … » pour lui (le bandeau finit alors sur Carnet, le séparateur avant Favoris reste), sinon refaire la capture avec le panneau ouvert et son contenu visiteur.

## Synthèse des retouches
1. Rangée 2 de l'en-tête : `mt-3 mb-3` dès `md:` (au lieu de 8 px).
2. Fondu de bord 40 px des deux côtés + `snap-x scroll-px-10` sur le bandeau défilant (375 et 768).
3. Pas de séparateur orphelin en bord droit (couvert par le fondu).
4. « … » du visiteur : masquer s'il est vide ou prouver son contenu par capture.
Pistes au choix : pilule `rounded-full`, « … » collé à Carnet.

Une fois 1, 2 et 4 faits, les notes 1, 4, 5 passent à 10 sans autre changement attendu.

NOTE GLOBALE : 8/10
