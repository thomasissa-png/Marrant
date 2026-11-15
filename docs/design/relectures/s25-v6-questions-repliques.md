# Relecture design à l'aveugle, s25 v6 tour 1 : Mes questions et Mes répliques

Captures lues : toutes celles de `docs/captures/s25/v6-tour-1/questions/` et `repliques/` (visiteur, gratuit, en-cours, nouvel, 5 largeurs, lues en entier sur 375, 768, 1280, 1920 ; 1456 identique à 1280/1920 par le plafond `max-w-7xl`). Code : `questions/page.tsx`, `repliques/page.tsx`, `components/espace/apercu/apercu-rubrique.tsx`, `apercu/exemple.tsx`, `questions/mes-questions.tsx`, `repliques/liste-repliques.tsx`, `carte/styles.ts`.

## Notes

| Critère | Note | Verdict |
|---|---|---|
| Design 1 fidélité à l'accueil | 7 | piste |
| Design 2 hiérarchie, lisibilité | 9 | |
| Design 3 mise en page 5 largeurs | **6** | **faute dure** |
| Design 4 cohérence avec l'espace | 8 | piste |
| Design 5 finition | 8 | piste |
| UX 1 compréhension | 9 | |
| UX 2 action principale | 9 | |
| UX 3 états vides, nouvel abonné | 9 | |
| UX 4 aperçu Premium | 8 | piste |
| UX 5 accessibilité, cohérence entre comptes | 8 | piste |

**Note globale = minimum = 6/10** (sous la barre de 9).

## Faute dure

**F1. Aperçu (visiteur et gratuit) : carte collée à gauche, vide à droite dès 1280.**
- Défaut : `visiteur-questions-1280.png`, `visiteur-repliques-1280.png`, `gratuit-questions-1920.png` : la carte s'arrête à 768 px (x 32 à 800 à 1280 ; x 352 à 1120 à 1920) et laisse 450 à 480 px vides à droite, titre et bande pleine largeur au-dessus. C'est exactement « colonne collée à gauche, vide à droite à 1280+ » du brief. Même cause pour les 2 pages (et toute rubrique d'aperçu).
- Code : `components/espace/apercu/apercu-rubrique.tsx` ligne 49, `max-w-3xl` sur l'`article`. Le sous-titre a aussi `max-w-2xl` (lisible, à garder).
- Correction codable : dès `lg`, grille `lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-6` (même 5/7 inversé que la vraie page `mes-questions.tsx` ligne 18). Colonne gauche : l'exemple (`<Exemple />`) dans la carte actuelle (`rounded-xl`, filet). Colonne droite : le bloc d'offre (`data-apercu-offre`, bouton unique + « Connexion ») en carte `rounded-xl border border-border bg-background-card p-6 lg:sticky lg:top-32` avec le même filet violet. Aucun texte nouveau, un seul bouton plein conservé, sous `lg` tout reste empilé comme aujourd'hui (375 et 768 corrects). Alternative minimale : retirer `max-w-3xl` et laisser la carte à 1216 px, moins bon (lignes de 1100 px illisibles dans l'exemple).
- Ce qui ferait 10 : à 1280, 1456, 1920, le bloc exemple + bloc offre remplissent la coque 1216 px sans vide à droite, offre visible sans défiler.

## Pistes (ne retiennent pas la note seules, mais l'écart avec l'étalon est visible)

**P1. Cartes réelles non alignées sur l'étalon (Design 1 et 4).** `etalon-accueil` : cartes `rounded-xl` à filet dégradé en haut. Dans l'aperçu c'est le cas (`rounded-xl` + `h-0.5` dégradé) ; dans la vraie page (`en-cours-questions-1280.png` : carte « Écrire à l'équipe », carte d'envoi ; `en-cours-repliques-1280.png` : carte de réplique) c'est `CARTE` = `rounded-lg` (12 px), sans filet (`carte/styles.ts` ligne 11). Le même compte passe donc de l'aperçu à la rubrique en changeant de langue de carte. Correction : dans `CARTE`, `rounded-lg` → `rounded-xl` et ajouter `relative overflow-hidden` plus un enfant `absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover` (ou une classe utilitaire `filet-carte` dans le thème). Attention : `CARTE` est partagé avec les autres pages de l'espace, à décider avec le groupe qui les relit (non touché ici). 10 = aperçu et rubrique avec la même carte.

**P2. Mes questions, abonné, 1280 à 1920 : colonne droite très vide (Design 3).** `en-cours-questions-1280.png` : le formulaire (y 233 à 970) fait 737 px de haut, la carte de l'envoi unique 190 px ; 500 px vides sous elle, et le titre « Mes envois » (y 247) n'est pas aligné sur le haut de la carte du formulaire (y 233) : décalage de 14 px visible. Ce n'est pas un trou à droite (la colonne 7/12 est pleine), donc pas faute dure. Correction : `mes-questions.tsx` ligne 18, `items-start` conservé ; aligner en donnant au `h2` de `liste-envois.tsx` le même `mt`/hauteur que le titre de la carte du formulaire, ou placer « Mes envois » dans une carte de même padding (`p-6`) pour que les deux hauts coïncident.

**P3. Mes répliques, état vide : le titre saute de place selon le compte (Design 4, UX 5).** `nouvel-repliques-1280.png` : titre et carte en colonne centrée de 768 px (x 256), alors que `en-cours-repliques-1280.png` et toutes les autres pages ont le titre à x 32, sous la bande. `repliques/page.tsx` ligne 43 (`COLONNE_LECTURE`) : le titre passe de x 32 à x 256 en changeant de compte, et il n'est plus aligné sur le « Mes répliques » de la bande ni sur le logo. Décision de la relecture s24 (F2, F3) à ne pas rouvrir si elle est [CHOIX UTILISATEUR] ; je la signale car le résultat est un titre décalé de 224 px par rapport à son gabarit. Correction si arbitré : garder la carte à 768 px mais l'aligner à gauche à x 32 (`max-w-3xl` sans `mx-auto`), même problème que F1 inversé ; ou laisser tel quel.

**P4. Aperçu Mes répliques : champ qui ressemble à une saisie (UX 4, Design 5).** `visiteur-repliques-1280.png` : « Écris ta version, en une phrase » est un `<p>` stylé en champ (`exemple.tsx` ligne 88), mais visuellement identique à un `input`. Un visiteur peut cliquer et ne rien obtenir. Correction : ajouter `aria-hidden` n'est pas la bonne piste (c'est du contenu) ; ajouter `cursor-not-allowed select-none` et `opacity-80`, ou marquer la fonction par l'étiquette déjà validée du sous-titre. Pas de texte nouveau.

**P5. Titres et rythme (Design 1).** L'étalon centre hero et titres de section ; les pages de l'espace gardent un H1 aligné à gauche. Cohérent entre toutes les pages de l'espace vues ici, donc ne retient pas la note.

**P6. Hors périmètre, à passer au groupe de la bande.** `visiteur-questions-1280.png` et `gratuit-questions-1920.png` : « Carnet » est coupé par le fondu et le bouton « … » alors que la coque fait 1216 px (la spec annonce 105 px libres) ; le fondu est actif à 1920. Vérifié sur la bande de visiteur et gratuit seulement ; abonné complet.

## Ce qui est conforme

- Titres H1 en `font-display`, hiérarchie nette : un H1, un H2, une action pleine (« Envoyer à l'équipe » ou le bouton d'offre), jamais deux boutons pleins.
- 375 et 768 : aucun débordement, formulaire puis historique empilés, boutons de 44 px (`min-h-11`), puces radio à contour 2 px (état sans la couleur seule).
- États vides : « Mes envois » montre un exemple par type et le délai de réponse ; Mes répliques vide a une phrase et une sortie vers Quoi répondre. Aucune page morte.
- Aperçu : sous-titre validé, une seule offre, lien « Connexion » pour le visiteur seulement (absent pour le gratuit, correct), pas de fenêtre, pas de mur.
- Bande : « … » allumé avec soulignement violet sur les deux pages pour les 3 états.

## Textes

Aucun texte jugé faux. Je ne propose aucun texte nouveau.

NOTE GLOBALE : 6/10

Fautes dures :
1. Aperçu Premium : carte limitée à 768 px, vide de 450 à 480 px à droite dès 1280 (visiteur et gratuit, Mes questions et Mes répliques) : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx` (ligne 49, `max-w-3xl`).
