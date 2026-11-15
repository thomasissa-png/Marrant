# Relecture UX à l'aveugle, en-tête et menu mobile, tour 6 (s25)

Périmètre : en-tête universel, menu mobile, cloche, menu du compte. Référence : `docs/ux/navigation-universelle-s24.md` v5 (choix de Thomas et écarts ROUVRE non rediscutés), `docs/founder-preferences.md` l. 191 à 193, étalon visuel = accueil (`docs/captures/s25/etalon-accueil/`). Captures : `docs/captures/s25/entete-tour-6/` (quatre comptes, 12 largeurs). Code lu : `en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `cloche.tsx`, `cloche-lignes.tsx`, `espace-navigation.ts`, `tailwind.config.ts`.

Limites de la preuve : visiteur sur /mon-espace et /profil renvoyé à la connexion (normal) ; le compte gratuit sur /mon-espace arrive sur la page d'offre (`/abonnement`, bouton d'offre masqué, aucune ligne allumée : conforme à la spec) ; « cloche vide » est simulée. Je n'ai pas de capture du champ de recherche de la barre ouvert (loupe, 440 à 1279 px) ni du menu ouvert PUIS cloche : non jugé.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Conformité à la spec v5 | 10 |
| 2 | Orientation | 10 |
| 3 | Menu mobile | 10 |
| 4 | Cloche et compte | 10 |
| 5 | Charge cognitive et cohérence entre comptes et pages | 9 |
| 6 | Largeurs extrêmes, 440 à 767, 1024 à 1279 | 10 |
| 7 | Accessibilité visible | 9 |

## 1. Conformité à la spec v5 : 10

Vérifié au rendu, ligne à ligne du tableau §1 :
- Logo : x identique (32 px à 1280) pour les trois états ; logo abonné vers `/mon-espace` (code `en-tete-universel.tsx` l. 139).
- Liens : Parcours, Vannes, Conseils, Vidéos, Articles ; « La lettre » visiteur et gratuit seulement (`visiteur-vannes-1024`, `en-cours-vannes-1024`). « Mon espace » abonné seul.
- Recherche : champ de 176 px à 1280 (`en-cours-mon-espace-1280`), loupe de 440 à 1279 (`visiteur-vannes-440`, `-1024`), absente de la barre sous 440 et en tête du menu (`en-cours-menu-mon-espace-375`).
- « Connexion » absente à 440, présente à 520 (`visiteur-vannes-520`) ; « Premium » seul sous 640 (520), libellé complet dès 640 (`-641`, `-768`), court de 1024 à 1279.
- Icône compte absente sous 768 (`gratuit-profil-640`), présente dès 768 (`gratuit-compte-profil-768`). Cloche à toutes les largeurs pour l'abonné, jusqu'à 320 (`nouvel-profil-320`).
- 768 à 1023 : liens du site dans Menu, rien d'allumé en barre pour eux, « Mon espace » en barre, intitulé non cliquable dans le menu (`en-cours-menu-mon-espace-768`, `en-cours-menu-vannes-768`) : c'est la spec.
- Allumage : Vannes sur /vannes, icône compte sur /profil (barre et ligne du menu), « Quoi répondre » sur une situation (`en-cours-menu-situation-375`, `-768`), « Mon espace » seulement sur Aujourd'hui.
- Menu : ordre unique, tokens du §1 (rail `border-l`, lignes de 44 px, séparateurs de 1 px) retrouvés dans le code et sur les captures.
- Critère 5 de la spec : voir critère 3.

Aucun écart constaté.

## 2. Orientation : 10

- Une page de l'espace, une page publique et le profil se distinguent à chaque largeur par au moins deux signaux sans la teinte : soulignement de 2 px et fond (barre), filet gauche de 2 px et semi-gras (menu), soulignement sous l'icône (compte).
- Menu ouvert, la barre garde son état (Mon espace allumé à 768, icône compte allumée sur /profil) : le lecteur ne perd pas le repère en ouvrant le menu.
- Sous 768 px, la barre abonné n'allume rien sur les pages de l'espace : c'est la spec (« Mon espace » seulement dans Menu et par le logo) ; le menu ouvert dit où l'on est.

Piste (non retenue, la spec la couvre) : aucune.

## 3. Menu mobile : 10

Mesures sur les captures :
- 375 et 320 px de large, 812 px de haut : recherche, « Mon espace » et les 8 rubriques sont entièrement visibles, puis Parcours à Articles, séparateur, « Mon profil » (`en-cours-menu-mon-espace-375`, `-320`).
- 568 px de haut (`en-cours-menu-court-375`, `-320`, `nouvel-menu-court-320`) : les 8 rubriques tiennent, Carnet se termine à 527 px, le séparateur est visible, « Parcours » commence sous le pli : conforme à la spec (rubriques sans défilement, liens du site et actions sous le pli permis).
- Deux touchers (Menu, ligne) pour toute rubrique : confirmé.
- Hiérarchie : « Mon espace » en blanc semi-gras, rubriques en gris secondaire avec rail, liens du site au même niveau que Mon profil ; la ligne allumée se lit à distance (fond, filet, semi-gras). Sur /profil, le défilement d'ouverture amène « Mon profil » dans la vue (8 px) sans toucher aux 8 rubriques (`en-cours-menu-profil-375`).
- Visiteur et gratuit : même ordre, bouton d'offre pleine largeur sous 768, aligné à gauche dès 768 (`gratuit-menu-accueil-641`, `visiteur-menu-vannes-375`).

Piste (pas une faute, la spec admet des actions sous le pli) : à 375 x 812 sur /profil, abonné, « Déconnexion » est sous le pli sans indice que la liste continue, et « Mon profil » touche le bord bas de la fenêtre (`en-cours-menu-profil-375`, `-320`). Correction codable : `pb` de fin plus généreux dans la zone défilante, ou dégradé de bord bas quand `scrollHeight > clientHeight`. Ne retient pas la note.

## 4. Cloche et compte : 10

- Non lu : point violet de 12 px à bordure du fond, nom accessible « Notifications, 1 réponse de l'équipe non lue » (`nomCloche`), point en `aria-hidden` donc l'information n'est pas que colorée. Vide : « Rien de nouveau. Reviens quand tu veux. » (`nouvel-cloche-vide-1280`, `-320`).
- Ouvert distinct d'actif : cloche ouverte = fond élevé et texte blanc sans soulignement ; page active = fond élevé, texte violet ET soulignement de 2 px (comparer `en-cours-cloche-1280` à `en-cours-compte-profil-1280`). Compte ouvert sans être actif : même rendu que la cloche (`gratuit-compte-1280`).
- Page en cours dans le compte : « Mon profil » en filet violet, semi-gras, texte violet (`en-cours-compte-profil-1280`, `gratuit-compte-profil-768`) ; « Favoris » prévu pour le gratuit sur /favoris.
- Fermeture : « Fermer » (44 px), Échap, clic dehors (Radix) ; focus rendu au bouton. Panneau à 8 px sous l'en-tête, bord droit sur la marge de la coque, toute la largeur de la coque sous 768 (`en-cours-cloche-320`).
- Focus dans la cloche (`en-cours-focus-dans-cloche-375-1..3`) : ouverture sur « Fermer », puis « Une question », « Le carnet du mois », retour à « Fermer » (focus enfermé dans le panneau) ; anneau violet visible sur chaque élément. Ordre logique.

## 5. Charge cognitive et cohérence entre comptes : 9

Cohérence confirmée : mêmes largeurs de rangée (logo x = 32 à 1280 pour les trois comptes), mêmes états actifs, même vocabulaire (Mon espace, Parcours, Vannes), pas de seconde barre, 3 actions principales ou moins par écran de menu. La barre est dans la logique de l'accueil (étalon : mêmes liens, même recherche, même bouton Premium).

Défaut (piste, pas une faute dure) : à 1280 px la recherche change de place selon le compte, x = 782 (visiteur, `visiteur-focus-04-1280`), 826 (gratuit, `gratuit-compte-1280`), 956 (abonné, `en-cours-mon-espace-1280`). Au moment de la connexion ou de l'achat, le champ saute de 44 à 174 px. Le commentaire de `en-tete-universel.tsx` l. 175 à 179 assume ce choix (largeur du contenu des actions, contrainte de Chrome 145 en CI), la spec v5 ne fixe pas ce x. Correction codable : ancrer la recherche à un x unique (largeur fixe de la zone d'actions) si la CI de Chrome 145 le permet avec la recherche à 176 px ; sinon, le laisser et le documenter. Ce qui ferait 10 : un x de recherche identique pour les trois états, ou l'acceptation écrite de Thomas de ce déplacement.

Hors périmètre, à relayer à la section Vannes (faute dure de cette page, pas de l'en-tête) : la rangée de catégories de `/vannes` diffère selon le compte. L'abonné a « Toutes » active puis dix catégories (`en-cours-vannes-1024`), le visiteur et le gratuit sept catégories sans « Toutes » (`visiteur-vannes-1024`, `gratuit-compte-1280`). Le choix de Thomas du 14/11 est « une seule rangée pour tous, Toutes active par défaut ».

## 6. Largeurs extrêmes, 440 à 767, 1024 à 1279 : 10

- 320 : logo, Premium court, Menu (visiteur, gratuit) ; logo, cloche, Menu (abonné) ; aucun débordement ni libellé coupé (`visiteur-vannes-320`, `nouvel-profil-320`, `en-cours-vannes-320`).
- 440 à 767 : loupe, Connexion dès 520, Premium court puis complet à 640 ; à 641 la rangée la plus serrée (loupe, Connexion, Premium complet, Menu) tient (`visiteur-vannes-641`).
- 768 à 1023 : rangées de la spec, y compris abonné (logo, Mon espace, loupe, cloche, compte, Menu) sans collision.
- 1024 à 1279 : liens du site, loupe, Premium court (`visiteur-vannes-1024`) ; abonné `en-cours-vannes-1024`.
- 1456 et 1920 : coque à 1216 px, alignée sur le contenu (`en-cours-vannes-1920`).

## 7. Accessibilité visible : 9

Acquis :
- Cibles : liens de barre, loupe, cloche, compte, Menu, « Fermer », lignes du menu et lignes de la cloche en 44 px (`h-11`, `min-h-11`).
- Focus visible dans la barre (anneau `accent-primary` arrondi sur logo, lien, icône, Menu, Premium : `en-cours-focus-02-1280`, `-06-1280`, `en-cours-focus-04-768`, `gratuit-focus-03-375`), dans le menu à 768 (anneau inset sur la ligne : `nouvel-focus-dans-menu-768-3`) et dans la cloche. Ordre de tabulation : logo, Mon espace, liens, recherche, cloche, compte, Menu ; puis lignes du menu dans l'ordre visuel.
- État actif sans la teinte : soulignement de 2 px ou filet de 2 px, semi-gras, fond.
- Contrastes calculés depuis le thème (WCAG, luminance relative) : `accent-link` #A78BFA sur fond #0D0D0D 7,1:1, sur `background-elevated` #2A2A2A 5,3:1 ; `text-secondary` #B3B3B3 sur fond 9,3:1, sur élevé 6,8:1, sur `border-hover` #3A3A3A 5,4:1 ; `text-muted` #9A9A9A sur élevé 5,1:1 ; anneau `accent-primary` #8B5CF6 sur fond 4,6:1 et sur élevé 3,4:1 (seuil non textuel 3:1). Tout passe.

Défauts (pistes) :
1. Sous 440 px, ouvert au clavier, le premier Tab entre dans la recherche (`en-cours-focus-dans-menu-375-1`), qui ouvre ses suggestions sur les lignes « Mon espace » et « Quoi répondre » ; les Tab suivants parcourent six puces (`-2`, `-3`) : sept arrêts avant la première rubrique de l'espace. L'ordre est celui de la spec (recherche en premier), mais le coût clavier est élevé. Correction codable : ne pas ouvrir les suggestions à la prise de focus dans le menu (seulement à la frappe) ou les retirer du Tab (`tabIndex={-1}` sur les puces tant que le champ est vide). Ce qui ferait 10 : la première rubrique atteinte en 2 Tab.
2. Les puces de suggestion font environ 26 px de haut (`en-cours-focus-dans-menu-375-2`), sous les 44 px du critère 7. Composant `SearchBar` partagé avec le public (fermé : inchangé), donc piste, pas faute dure : passer les puces à `min-h-11` seulement dans le menu (prop `dense`).
3. Le menu n'est pas modal : après la dernière ligne, Tab sort vers le contenu masqué par le voile (code l. 76 à 84 de `menu-mobile-universel.tsx` : pas de piège de focus). Piste : piéger le focus (ou `inert` sur `main`) tant que le menu est ouvert.

## Cognitive walkthrough (Yanis, 375 px, abonné)

1. Veut aller à « Mes répliques » : voit Menu, sait que l'icône ouvre une liste (étiquette « Menu », X à l'ouverture). OUI.
2. Trouve « Mes répliques » sous « Mon espace » en retrait : lien but-action clair. OUI.
3. Veut savoir où il est : la ligne allumée porte fond, filet et semi-gras. OUI.
4. Veut lire une réponse de l'équipe : le point violet est visible sans ouvrir le menu, la cloche s'ouvre sur « L'équipe t'a répondu ». OUI.

[FRICTION H7] à l'étape 1 pour un utilisateur clavier sous 440 px : voir défaut 1 du critère 7. Solution : suggestions à la frappe seulement.

## Heuristiques Nielsen (en-tête et menu)

H1 visibilité de l'état : PASS (allumages, point de la cloche). H2 vocabulaire : PASS (Mon espace, Quoi répondre, Mes questions). H3 contrôle : PASS (Échap, croix, voile, Fermer). H4 cohérence : PASS sauf déplacement de la recherche (critère 5). H5 prévention d'erreurs : PASS (bouton d'offre masqué sur /abonnement). H6 reconnaissance : PASS. H7 raccourcis : FAIL léger (défaut 1 du critère 7). H8 minimalisme : PASS. H9 erreurs : PASS (message de la cloche en erreur, code). H10 aide : PASS.

## Synthèse

Aucune faute dure sur le périmètre. Pistes, par ordre de gain : (a) suggestions de recherche du menu sous 440 px, (b) x de la recherche stable entre comptes, (c) indice de défilement du menu, (d) piège de focus du menu. Aucun texte nouveau proposé. Hors périmètre à relayer : catégories de Vannes différentes selon le compte.

NOTE GLOBALE : 9/10
