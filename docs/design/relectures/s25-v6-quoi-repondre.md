# Relecture design à l'aveugle, s25 v6 tour 1 : Quoi répondre (liste, fiche situation, fiche à plat, aperçu)

Périmètre : `/mon-espace/quoi-repondre` (comptes en-cours, nouvel, gratuit, visiteur ; 375/768/1280/1456/1920), `fiches/*fiche-situation*` et `*fiche-a-plat*` (en-cours, nouvel), code `quoi-repondre/page.tsx`, `fiche/[type]/[id]/page.tsx`, `components/espace/{fiche.tsx, liste-fiches.tsx, filtres-situations.tsx, carte/*, fiche/*, apercu/*}`.
Rayons vérifiés dans `tailwind.config.ts` : `rounded-md` 8 px, `rounded-lg` 12 px, `rounded-xl` 12 px (valeur Tailwind par défaut, identique à `lg`). Captures hors périmètre ignorées (bande tronquée « Carne| » à 1280/1920 en visiteur et gratuit : groupe en-tête).
Limite : les captures ont été prises moins de 3 s après chargement, les boutons « Oui / À moitié / Rien » sont donc vus à l'état `aria-disabled` ; leur état actif n'est pas jugé.

## Notes

| Critère | Note | Motif |
|---|---|---|
| D1 Fidélité à l'accueil | 7 | Aperçu : carte `rounded-xl` à filet violet (conforme). Fiche réelle : `CARTE` sans filet, sans pastille, sans titre fort. Liste : lignes grises `rounded-md`, aucun filet ni accent |
| D2 Hiérarchie, lisibilité | 9 | H1 `font-display`, titres de groupe `text-xl`, compteur discret, lignes de 56 px lisibles. Léger flottement du bouton « Le carnet du mois » seul en tête |
| D3 Mise en page 5 largeurs | 7 | Aperçu (gratuit, visiteur) : carte de 768 px collée à gauche, vide de 480 px à 1280, 800 px à 1920 |
| D4 Cohérence espace | 8 | Fiche centrée en colonne de lecture, aperçu de la même fiche collé à gauche : deux géométries pour le même contenu. Filet présent sur l'un, absent sur l'autre |
| D5 Finition | 7 | Trait orphelin en tête de la carte « À toi » (voir faute 2). Cibles 44 px et contrastes texte AA conformes |
| U1 Compréhension | 9 | Titre, filtres puis groupes par lieu : on sait où on est |
| U2 Action principale unique | 8 | Liste : pas d'action dominante, et « Le carnet du mois » (sortie vers `/carnet`) passe avant les filtres |
| U3 États vides / nouvel abonné | 8 | Nouvel = même liste complète, jamais vide (OK) ; aucun point d'entrée suggéré. Code de l'état vide (`quoi-repondre-vide`) non capturé |
| U4 Aperçu Premium | 8 | Une fiche réelle en entier, une seule offre, pas de mur (OK). Mais l'ampleur de la rubrique (12 lieux, une soixantaine de fiches) n'est pas visible |
| U5 Accessibilité, cohérence comptes | 9 | `aria-current`, coche + contour 2 px, cibles 44 px ; en-cours et nouvel identiques à la pastille « Fait » près |

**NOTE GLOBALE : 7/10** (minimum). Barre de 9 non atteinte : 3 fautes dures.

## Fautes dures

### 1. Aperçu collé à gauche, vide à droite dès 1280 (D3, D4)
- Captures : `gratuit-quoi-repondre-1280.png`, `visiteur-quoi-repondre-1280.png`, `gratuit-quoi-repondre-1920.png` (carte x 352 à 1120 sur une coque de 1216 px de large utile ; la moitié droite est vide). À 768 et 375 : OK.
- Cause : `apercu-rubrique.tsx` : `<header>` sans largeur de colonne et `<article className="... max-w-3xl ...">` alignés à gauche. La même fiche réelle (`fiche/[type]/[id]/page.tsx`) est dans `COLONNE_LECTURE` (`mx-auto w-full max-w-3xl`), donc centrée : l'inscrit voit la fiche à deux endroits différents entre l'aperçu et le payant.
- Correction codable : dans `apercu-rubrique.tsx`, remplacer le `<div data-apercu>` racine par `<div data-apercu={rubrique} className={COLONNE_LECTURE}>` (import depuis `@/components/layout/gabarit`), et retirer `max-w-3xl` de l'`<article>` (la colonne le porte déjà) ; garder `max-w-2xl` sur le sous-titre. Même règle sur toutes les rubriques d'aperçu (composant partagé), à re-capturer pour les autres groupes.
- Ce qui ferait 10 : aperçu centré en 768 px comme la vraie fiche (H1 à x = 256 à 1280), puis re-capture 1456/1920.

### 2. Trait orphelin en tête de la carte « À toi » (D5)
- Captures : `en-cours-fiche-situation-1280.png` (filet à y 712, 24 px sous le bord de la carte), `en-cours-fiche-a-plat-1280.png` (y 648), `nouvel-fiche-a-plat-768.png`, `nouvel-fiche-situation-375.png` (y 677). Un séparateur sans rien au-dessus, dans une carte qui contient déjà seulement le geste.
- Cause : `carte/geste-fiche.tsx` ligne 56 : `className="space-y-4 border-t border-border pt-4"` ; `fiche.tsx` (lignes 153-164) le place seul dans sa propre `CARTE`.
- Correction : ajouter à `GesteFiche` une prop `separe?: boolean` (défaut `true`, pour ne pas toucher les autres usages) et poser `separe ? "border-t border-border pt-4" : ""` ; dans `fiche.tsx`, passer `separe={false}`.
- Ce qui ferait 10 : carte « À toi » sans trait, étiquette à 24 px du bord haut comme « La scène ».

### 3. Cartes de la fiche réelle hors de la langue de l'accueil, contradiction avec l'aperçu (D1, D4)
- Captures : `en-cours-fiche-situation-1280.png` et `gratuit-quoi-repondre-1280.png` : l'aperçu a le filet dégradé violet en haut (`from-accent-primary-hover to-accent-secondary-hover`), la fiche payante, qui est la même fiche, n'en a pas. Le contenu payé paraît plus pauvre que son aperçu.
- Cause : `fiche.tsx` utilise `CARTE` (`rounded-lg border border-border bg-background-card p-4 md:p-6`, sans filet) ; l'aperçu a son propre style `rounded-xl ... overflow-hidden` + div filet.
- Correction : dans `fiche.tsx`, pour la carte du corps (ligne 149) et celle du geste, ajouter `relative overflow-hidden rounded-xl` et le filet `<div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover" />` ; idéalement l'extraire en composant `CarteFiche` partagé avec `apercu-rubrique.tsx` (une seule source). Ne pas changer `CARTE` globalement (utilisé partout).
- Ce qui ferait 10 : fiche payante et aperçu pixel-identiques côté cadre.

## Pistes (ne retiennent pas la note)

- Liste, D1 : lignes `rounded-md bg-background-light` (`liste-fiches.tsx` ligne 58) sans accent ; si on veut rapprocher de l'accueil, groupe dans une carte `rounded-xl` à filet. Choix de gabarit à trancher par Thomas ; l'existant suit le gabarit B validé.
- Liste, D3 : 8 groupes sur 11 ont un nombre impair de fiches, d'où une case vide à droite en dernière ligne (`en-cours-quoi-repondre-1280.png`, Amis, Famille, Couple…). Mineur ; `grid-flow-col` ne conviendrait pas au sens de lecture, on garde.
- Liste, U2 : « Le carnet du mois » (`quoi-repondre/page.tsx` ligne 68) précède les filtres alors que le geste principal est de choisir une situation ; le descendre sous la liste ou le fondre dans une ligne de lien. Texte inchangé.
- Liste, U3 : pour le compte nouvel, aucune fiche mise en avant. Toute formulation d'une « première fiche conseillée » = **à valider par Thomas**.
- Aperçu, U4 : montrer en lecture seule les puces de `FiltresSituations` (libellés déjà validés) donnerait l'ampleur de la rubrique sans texte neuf. À valider par Thomas.
- Fiche, UX : la carte « À toi » avec « Ton retour » est visible avant qu'on ait répondu à « Tu avais une réponse ? » ; l'ordre est celui de la spec, à confirmer seulement.
- Texte à relire (non modifié) : sans objet, aucun texte jugé faux.

## Conforme (10 permis)

Cibles 44 px (`puce`, `BOUTON_SECONDAIRE`, lignes `min-h-14`), contraste du texte secondaire AA (`#B3B3B3` / `#9A9A9A` sur `#1F1F1F`), coche + contour 2 px pour le filtre choisi, filtres repliés sous 640 px, 375/768 sans débordement, aperçu avec une seule offre et « Connexion » pour le visiteur seulement.
