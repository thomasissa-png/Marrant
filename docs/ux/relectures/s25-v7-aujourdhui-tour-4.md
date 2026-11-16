# Relecture UX à l'aveugle, « Aujourd'hui » refonte s25 v7, tour 4

Relecteur : @ux. Lu : brief, specs UX et design, étalon accueil (1280), captures des 4 comptes (375, 768, 1280, 1920 en pleine page, plus premiers écrans visiteur 375 et 1280), code de `aujourdhui/**`, `apercu/{badge-premium,offre-apercu,extrait-coupe,tuile-fermee,hero-apercu,apercu-verrouille,tableau-verrouille}.tsx`, `mon-espace/page.tsx`, `tailwind.config.ts`. Aucune relecture antérieure, aucun commit, aucun `REPLIT_ACTIONS.md` consulté.

## Verdict

Aucune faute dure. Page au niveau de l'accueil : une zone dominante, un seul plein par écran, grille 12 colonnes qui remplit la coque, aperçu qui se lit FERMÉ. Restent des pistes de finition.

## Grille

| Critère | Note | Défaut précis, correction codable, ce qui ferait 10 |
|---|---|---|
| D1 Élégance, fidélité accueil | 9 | Le mot « Premium » apparaît 8 fois dans le premier écran visiteur 1280 (bouton d'en-tête, pastille du hero, bouton du hero, 4 pastilles de blocs fermés dont une coupée), plus le bouton de fin. Piste : garder la pastille sur Z1 et Z2 seulement (`tableau-verrouille.tsx`, retirer `TuileFermee` de la rangée 2 ou lui passer `badge={false}`) ; ça ferait 10, mais la spec UX §2.2 règle 3 exige une pastille par bloc : à trancher par Thomas. |
| D2 Hiérarchie | 9 | Hiérarchie nette (H1, Z1, bouton). Piste : à 1280 deux boutons pleins visibles ensemble pour le visiteur (en-tête global + hero), assumé comme à l'accueil. 10 si l'en-tête perd son plein sur cette page (hors périmètre). |
| D3 Largeur aux 5 largeurs | 9 | Aucun débordement, aucune tuile creuse. Piste (vide fixe, pas dû au texte) : 80 px entre le bas du hero et l'extrait dès 1024 (`extrait-coupe.tsx`, `lg:mt-20`) contre 24 px de rythme ailleurs. `lg:mt-14` (56 px) garde le bouton de fin sous 900 px de haut (il passe de 933 à environ 909). Piste : à 768, « Étape conseillée » du nouvel abonné a un rail vide de 480 px à zéro (`etape-en-cours.tsx`, `Avancement` : `max-w-sm` sur la barre). Écart assumé à la spec : « Contenu du jour » en 2 colonnes (vanne+conseil / vidéo) à 1280 et plus au lieu de 3 x col-4, bas alignés, pas de vide : OK. À 1920, 352 px de marge de chaque côté, arbitrage de la spec, halo visible : OK. |
| D4 Cohérence entre comptes | 10 | Même grille, mêmes tuiles, même Z1/Z2 pour l'aperçu et l'abonné ; le prospect reconnaît le futur produit. Aucune dérive visible entre visiteur et gratuit (seule la phrase d'objet change). |
| D5 Finition au pixel | 9 | Vérifié au code : boutons `size lg` (h-12), pieds de tuile `min-h-12`, mission = tuile entière cliquable, cartes de rafale `min-h-14`, « Connexion » `min-h-11 min-w-11`, lien de carte `min-h-11`, puces C9 en `puce()` ; `text-accent-link` (#A78BFA) pour tout texte violet courant, `text-muted` 5,9:1 sur carte ; texte de l'extrait atténué : inerte et `aria-hidden`, exempté. Piste : rails vides de `BarreProgression` et `SegmentsCap` en `bg-border-hover` (#3A3A3A sur #1F1F1F, environ 1,4:1). Non textuel et redondant avec « Étape n sur N » et « cap n sur 5 », donc pas de faute 1.4.11 ; `bg-border-input` (#707070) les rendrait conformes strictement mais plus bruyants : à arbitrer. |
| U1 Prospect, envie en 3 s | 9 | Visiteur et gratuit : pastille Premium, H1, promesse, 6 pastilles, bouton avec prix, réassurance, preuve, tout dans le premier écran 375 (bouton à environ 470 px) et 1280. L'extrait montre premier pas, cap, étape, mission, avec fondu net ; « La suite est dans Premium » ferme. Une seule offre. Pour 10 : une vanne réelle dans l'extrait (interdit par la spec, donc non demandé). |
| U2 Abonné, clarté | 10 | Un seul plein (Z1) dans chaque état, étiquette puis titre puis bouton ; en-tête H1, date, repère. |
| U3 Abonné, envie de continuer | 9 | Cap, segments, XP et série en grand (en-cours), « Étape 3 sur 3 » avec barre, mission facultative, contenu du jour. Piste : l'état nouvel n'a pas de récompense chiffrée, remplacée par « Tes 4 premières semaines », suffisant. |
| U4 Nouvel abonné | 9 | Jamais une page morte : premier pas, cap 1, étape conseillée, feuille de route de 4 semaines, contenu du jour. Piste : l'aperçu promet « Mission » (pastille du hero, tuile) que le nouvel abonné ne voit pas le premier jour (la feuille de route la remplace). Cohérent avec la spec §3.2 mais un décalage promesse/produit à garder en tête. |
| U5 Accessibilité visible, cohérence | 9 | Extrait `inert` et `aria-hidden`, phrase `sr-only`, `aria-labelledby` par zone, focus visibles, un H1. Piste : même remarque que D5 sur les rails. |

## Cognitive walkthrough (Yanis, 375, visiteur)

Sait que c'est réservé : oui (pastille et H1 au même écran). Voit le prix et le bouton : oui, sans défiler. Croit être dedans : non (tuiles atténuées, pastille par bloc, fondu). Un clic dans l'extrait ne fait rien et la fin d'extrait dit pourquoi. Aucune friction détectée.

## Pistes, par priorité

1. `apps/web/src/components/espace/apercu/extrait-coupe.tsx` : `lg:mt-20` vers `lg:mt-14` (vide hero/extrait).
2. `apps/web/src/components/espace/aujourdhui/tableau.tsx` : rails vides (`bg-border-hover`), à arbitrer avec Thomas.
3. `apps/web/src/components/espace/aujourdhui/etape-en-cours.tsx` : barre plafonnée à 768 pour le nouvel abonné.
4. `apps/web/src/components/espace/apercu/tableau-verrouille.tsx` : répétition du mot « Premium » (arbitrage spec).

NOTE GLOBALE : 9/10

Fautes dures :
Aucune.
