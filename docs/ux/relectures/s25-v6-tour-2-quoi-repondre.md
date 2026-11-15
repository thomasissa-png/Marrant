# Relecture UX à l'aveugle, s25 v6 tour 2 : groupe « quoi-repondre »

Périmètre : `v6-tour-2/quoi-repondre/` (visiteur, gratuit = aperçu Premium ; en-cours, nouvel = liste) + `v6-tour-2/fiches/*-fiche-situation-*` (en-cours, nouvel). 30 captures ouvertes en partie (1280 de chaque compte, plus 375, 768, 1920 des cas significatifs). Texte validé non réécrit.

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité accueil | 7 |
| Design 2 hiérarchie, lisibilité | 8 |
| Design 3 mise en page 5 largeurs | 6 (faute dure) |
| Design 4 cohérence espace | 9 |
| Design 5 finition pixel | 7 (faute dure) |
| UX 1 compréhension | 8 |
| UX 2 action principale unique | 7 |
| UX 3 états vides, nouvel abonné | 7 |
| UX 4 aperçu Premium | 7 |
| UX 5 accessibilité, cohérence comptes | 7 |

**Globale = 6/10 (minimum). Barre de 9 non atteinte, 2 fautes dures.**

## Fautes dures

### FD1. Aperçu Premium à 1280, 1456, 1920 : colonne de droite vide (Design 3, UX 4)
Captures : `visiteur-quoi-repondre-1280/1456/1920.png`, `gratuit-quoi-repondre-1280/1456/1920.png`.
Défaut : la carte d'offre (colonne 2, environ 90 px de haut, juste un bouton plein et « Connexion ») laisse environ 380 px de vide dessous, à côté d'une carte de 470 px. À 1920 la bande reste à 1216 mais le vide domine. Contredit « aucun vide à droite à 1280+ ». La carte d'offre ne dit rien de ce que Premium ouvre : un bouton nu, alors que 375 et 768 la montrent proprement en bande pleine sous la fiche.
Correction codable : `components/espace/apercu/apercu-rubrique.tsx`, soit (a) bloc d'offre en bande pleine largeur sous la fiche à toutes les largeurs (comme 375 et 768), centré, `mx-auto max-w-3xl`, soit (b) conserver 2 colonnes mais `lg:sticky lg:top-[134px] self-start` sur la carte d'offre (bande 114 px + 20 px) avec une ligne de bénéfice. Recommandé : (a), cohérent avec l'étalon centré.
Ce qui ferait 10 : aucune zone vide, offre toujours visible sans scroller (sticky ou sous la fiche), une seule offre.

### FD2. Fiche situation (tous comptes, toutes largeurs) : les 3 réponses « Oui / À moitié / Rien » ont l'air désactivées (Design 5, UX 5)
Captures : `en-cours-fiche-situation-1280.png`, `nouvel-fiche-situation-1280/768.png`, `en-cours-fiche-situation-375.png` ; même bloc sur l'aperçu (`visiteur-quoi-repondre-1280.png`).
Défaut : c'est l'interaction centrale de la fiche (« Ta réponse d'abord » puis « Tu avais une réponse ? »). Les 3 boutons ont un filet quasi invisible sur fond de carte et un texte gris ; à côté, les puces « Ton retour » juste dessous sont blanches, bien bordées et à coche. Deux patterns de choix sur la même carte, dont le premier se lit comme inactif : un first-time user ne voit pas qu'on peut cliquer, et le bord des composants ne tient pas 3:1 (WCAG 1.4.11) d'après le rendu. Aucun état « choisi » visible non plus chez l'abonné avancé. Le texte « Prends ton temps » est très pâle (gris sur gris).
À vérifier au code : si les boutons sont réellement `disabled` pendant un délai, le dire (pas de « Prends ton temps » orphelin), sinon les styler comme les puces.
Correction codable : `components/espace/fiche/corps-situation.tsx` : mêmes classes que les puces « Ton retour » (`rounded-full border border-border-strong text-text-primary`), `focus-visible:ring-2 ring-accent-link`, cible `min-h-11`, état choisi identique (coche, filet violet). Sur l'aperçu, si les boutons sont inertes, les enlever ou les rendre explicitement lisibles comme exemple.
Ce qui ferait 10 : un seul langage de choix, bord ≥ 3:1, état choisi visible.

## Pistes (ne retiennent pas la note seules)

1. **Liste, nouvel abonné (`nouvel-quoi-repondre-1280.png`, `-375.png`)** : 60 lignes de même poids, 17 puces de filtre, bouton « Le carnet du mois » seul accent. Aucune entrée recommandée (« Commence par… »), aucun compteur de progression. Pas une page morte, mais l'action principale n'est pas unique. Piste : une ligne de reco sous le titre, ou la 1re situation mise en avant pour qui n'a rien fait (texte à valider par Thomas).
2. **Fidélité à l'accueil** : titre aligné à gauche, lignes plates sans filet violet ni pastilles de contexte ; seule la fiche (filet violet, `rounded-xl`) et l'aperçu parlent la langue de l'accueil. Cohérent avec les autres pages de l'espace, donc piste. Fiche à 1280 et 1920 : colonne centrée de 768 px, correcte.
3. **Liste, grille à 2 colonnes** (1280, 1456, 1920) : les groupes impairs laissent une case vide à droite (ex. Amis, Famille, Couple). Acceptable, mais un `grid-flow` ou 3 colonnes à partir de 1280 l'éviterait.
4. **Fiche 375, abonné avancé (`en-cours-fiche-situation-375.png`)** : la réplique enregistrée est tronquée dans un champ de 2 lignes (la 2e ligne est coupée). Piste : `min-h-24` ou hauteur auto du champ.
5. **375 liste, filtres** : sur mobile un seul bouton « Filtrer les cartes » remplace les 17 puces, bon choix ; vérifier qu'il annonce `aria-expanded`.

## Ce qui est conforme
- Bande des rubriques : chip « Quoi répondre » allumé et souligné sur liste, fiche et aperçu, cadenas pour visiteur et gratuit (rien pour abonné), même ordre pour les 4 comptes.
- Aperçu : H1, sous-titre validé, une vraie fiche lisible en entier, un seul bouton plein, pas de mur ni de redirection. Cohérence visiteur/gratuit (seul « Connexion » diffère, voulu).
- Fiche : « Retour : Quoi répondre », état « Fait » et retour chiffré chez l'abonné avancé, champ vide et « Enregistrer » grisé chez le nouvel abonné (état vide clair), aucun débordement de 375 à 1920.

## Cognitive walkthrough (fiche, nouvel abonné)
1. Sait où il est : oui (H1, chip allumé). 2. Sait quoi faire : lire la scène, oui ; répondre : `[FRICTION H1/H6]` les boutons semblent inactifs. 3. Feedback : non vérifiable sur capture statique.

NOTE GLOBALE : 6/10
