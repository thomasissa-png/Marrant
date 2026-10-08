# Rendu itération 1 : notation visuelle @design, parcours Storytelling (s18, 08/10/2026)

Base : `docs/qa/captures-parcours-storytelling-s18/`, 22 captures lues sur 34 (visiteur 375 : page-haut, page, étape 1, étape 5, fin de page ; Premium 375 : page-haut, étape 1, étape 5, fin de parcours, carte ; 768 : visiteur page-haut et étape 5, Premium étape 1 et carte ; 1280 : visiteur page-haut, étape 1, fin de page, Premium page-haut, étape 5, étape 6, fin de parcours, carte). Non lues faute de budget : les doublons « page » complets et quelques variantes 768 (aucune ne porte un état différent). Référence de méthode : `docs/marrant/audit-parcours-apprentissage-s17/iterations/iter-4-design.md` (9,8/10). Rendu réel lu, textes validés non jugés.

Limite de la comparaison : je n'ai aucune capture des 3 parcours en ligne ici. La cohérence est jugée par le rendu Storytelling et par les composants partagés (`parcours-detail.tsx`, `parcours-step-card.tsx`, `step-blocks.tsx`, `path-completion-card.tsx`), qui sont les mêmes que pour les 3 autres.

## Notes /10

| Critère | s17 iter-4 | Storytelling | Pourquoi |
|---|---|---|---|
| Hiérarchie | 10 | 9,5 | Titre, accroche, étape 1 ouverte : lisible en plissant les yeux. Visiteur : une seule offre pleine par vue (« Voir l'offre Premium »), « Valider » neutralisé tant que le quiz n'est pas fait. Retrait de 0,5 : la vidéo seule de l'étape 6 déséquilibre la ligne (M-2) |
| Lisibilité mobile (375) | 10 | 9 | Textes 15-16 px, quiz et vannes bien empilés, aucun débordement horizontal. Retraits : miniature vidéo vide chez le visiteur (I-1), « Café » seul sur la 2e ligne du CTA de fin (I-2) |
| Cohérence avec les 3 parcours | 10 | 10 | Même en-tête (emoji + H1 + pastille niveau + durée), même carte d'étape (kicker violet, XP, pastille « Lecture libre » / « Fait partie de Premium »), même cadenas, même bandeau « Étape 1 offerte ». Aucune valeur hors système vue |
| Carte de fin | 10 | 9 | Pastille de succès, titre, XP, 6 acquis, un seul CTA plein : hiérarchie juste aux 3 devices. Retraits : orphelin « Café » à 375 (I-2), « le monde. » seul à 768/1280 (M-1), pas de phrase d'orientation au-dessus du CTA (M-3) |
| États | 9 | 9 | Visiteur (étapes verrouillées repliées / ouvertes, aperçu + offre), Premium (0/6, étape terminée avec coche, parcours terminé, bouton « Termine le quiz pour valider cette étape » désactivé et expliqué) : propres. Chargement, échec et survol non recapturés pour Storytelling : hérités de s17, aucun nouvel état visible |
| Responsive 375/768/1280 | 9,5 | 9,5 | Aucune rupture : la carte de fin se recentre, les vidéos passent de 1 à 2 colonnes, les citations et la grille de vannes tiennent partout |

**Note globale : 9,3/10.** Aucun défaut bloquant. Deux défauts importants, tous deux faciles et localisés, et quelques mineurs. Avec I-1 et I-2 corrigés et prouvés par capture : 9,8. Avec les mineurs M-1 à M-3 : 10.

## Icône : 📖 confirmée

- Rendu : emoji coloré (livre ouvert blanc, tranches bleue et rouge) lisible sur fond sombre aux 3 devices (≈ 40 px à 375, ≈ 44 px à 1280), bien centré sur le bloc titre + pastille.
- Cohérence : les autres parcours utilisent des emojis colorés d'un seul objet (☕ Machine à Café ; ⚡ cité dans `parcours-labels.ts`). Le 3e n'est pas vérifié ici. 📖 est du même genre : un objet, pas un pictogramme, une teinte vive qui se distingue de ☕ (brun) et ⚡ (jaune).
- Technique : U+1F4D6 est au-dessus de 0x1F000, donc `withEmojiPresentation` ne lui ajoute pas de VS16, et il n'en a pas besoin (présentation emoji par défaut).
- Sens : « histoire racontée », sans ambiguïté avec une icône « leçon » car les parcours en sont tous. Seul risque : 📖 est déjà utilisé ailleurs sur le site (glossaire, blog). Je n'ai pas pu le vérifier. Si c'est le cas, prendre **🎬** (U+1F3AC, un seul code point, coloré partout, évoque scène, montée, chute), sans autre changement. Sinon, garder 📖.

## Défauts par gravité

### Bloquant

Aucun. Aucun contraste, aucune troncature, aucun état cassé, aucune coupure de lecture.

### Important

**I-1 Miniature vidéo vide, visiteur 375, étape 1** (`visiteur-375-etape1.png`)
- Constat : la 2e carte vidéo (Thomas Ngijol, « Le voisin ») n'a ni miniature ni fond d'image : bloc noir avec le seul bouton de lecture rouge, puis le titre. À 1280 visiteur et en Premium 375/768/1280, la même carte a sa miniature. La 1re carte (Panayotis Pascot) est correcte au même endroit.
- Composant : bloc « Pour aller plus loin, facultatif » dans `apps/web/src/components/parcours/step-blocks.tsx` (carte vidéo).
- Correction : (1) si la `<img>` est en `loading="lazy"`, le défaut est un artefact de capture : recapturer en défilant jusqu'à la carte et en attendant `img.complete` ; (2) sinon, vérifier l'URL de miniature de cette vidéo dans `docs/content/parcours-storytelling-s18.json` ; (3) dans les deux cas, donner au conteneur `aspect-video bg-surface-elevated` et, sur `onError` de l'image, ne pas afficher la zone vignette + bouton de lecture (garder titre, accroche, lien « Voir la fiche de la vidéo »). Un bouton de lecture sur du noir est pire qu'aucune vignette (règle « vide propre »).

**I-2 CTA de fin avec « Café » orphelin, 375** (`premium-375-fin-parcours.png`, `premium-375-fin-parcours-carte.png`)
- Constat : « Passer au parcours Machine à / Café ». Le mot seul sur la 2e ligne affaiblit le dernier écran du parcours.
- Composant : `apps/web/src/components/parcours/path-completion-card.tsx`, `<Link>` ligne 167-172, et `FIN_PARCOURS.suite` dans `apps/web/src/config/textes/parcours.ts`.
- Correction : ajouter `text-balance` aux classes du `<Link>` ; et coller le nom du parcours : dans `FIN_PARCOURS.suite(nom)`, utiliser `nom.replace(/ /g, " ")` (« Machine à Café » ne se coupe plus). Résultat attendu à 375 : « Passer au parcours / Machine à Café » sur 2 lignes équilibrées. Rien à changer à 768/1280 (1 ligne).

### Mineur

**M-1 « le monde. » seul sur sa ligne, carte de fin 768 et 1280**
- Constat : « Le plus dur, maintenant, c'est de ne pas le raconter à tout / le monde. ».
- Composant : `path-completion-card.tsx`, `<p className="mx-auto mt-2 max-w-md text-text-secondary">` (ligne 129).
- Correction : ajouter `text-balance`.

**M-2 Vidéo unique de l'étape 6 : une moitié vide, 768 et 1280** (`premium-1280-etape6.png`)
- Constat : la carte (Jonathan Cohen, Bloqués) occupe la moitié gauche de la grille à 2 colonnes, la moitié droite reste vide. À 375 c'est correct.
- Composant : grille des vidéos de `step-blocks.tsx`.
- Correction : si une seule vidéo, `sm:col-span-2` sur la carte avec mise en page horizontale à partir de `sm` (`sm:grid sm:grid-cols-2 sm:gap-4` : miniature à gauche, texte à droite). Ne pas étirer la miniature 16:9 à pleine largeur (≈ 330 px de haut, trop lourd).

**M-3 Pas de phrase d'orientation au-dessus du CTA de fin** (toutes les cartes de fin)
- Constat : entre la liste des 6 acquis et « Passer au parcours Machine à Café », aucune phrase ne dit pourquoi ce parcours. Le code en affiche une quand `suite.slug === nextParcours` (`nextParcoursReason`) ou l'accroche du parcours (`personaTagline`).
- À vérifier avant de toucher au rendu : soit `nextParcoursReason` est vide pour Storytelling dans `docs/content/parcours-storytelling-s18.json`, soit le compte de test n'a pas reçu `personaTagline` de `/api/parcours`. Si c'est voulu, rien à faire : le CTA seul reste lisible. Non rédigé par moi (zéro invention de contenu).

**M-4 « Étape validée » seul en pied d'étape 6 (Premium 1280)**
- Constat : texte violet 14 px sans coche ni XP, plus discret que la coche de l'en-tête.
- Composant : `parcours-step-card.tsx` (pied de carte d'une étape déjà validée).
- Correction facultative : ajouter l'icône coche 16 px devant, même couleur `text-accent-link`.

**M-5 Liens « Voir la fiche » ≈ 20 px de haut (375)**, dans « Vannes à pratiquer »
- Hérité des 3 parcours en ligne : à traiter une fois pour tous (`min-h-[44px] inline-flex items-center`, comme le lien carnet de `path-completion-card.tsx`), pas dans cette itération.

### Constaté, hors périmètre, non compté

- Pied de page à 1280 : colonne « Produit » sur deux sous-colonnes, 4e colonne vide (déjà noté en s17).
- Bandeau « Parcours terminé ! » + carte « Parcours Storytelling terminé » : deux « terminé » superposés, gabarit s17 commun aux 4 parcours.

## Pour le 10

1. Corriger I-1 et I-2, puis recapturer : `visiteur-375-etape1` (les 2 miniatures visibles, après défilement), `premium-375-fin-parcours-carte` (CTA sur 2 lignes équilibrées sans « Café » seul).
2. M-1 (une classe) et M-2 : recapturer `premium-768-fin-parcours-carte` et `premium-1280-etape6`.
3. Tranche pour M-3 : vérifier le JSON, ne rien ajouter si vide volontairement.
4. 📖 : garder, sauf usage déjà existant ailleurs (alors 🎬).

Rien de ce qui reste n'empêche la mise en ligne si I-1 s'avère être un artefact de capture (alors seul I-2 reste à faire).

---
**Handoff → @orchestrator (puis @fullstack pour les corrections)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-storytelling-s18/iterations/rendu-iter-1-design.md`
- Décisions : note 9,3/10, icône 📖 confirmée (repli 🎬), 0 bloquant, 2 importants (I-1, I-2), 5 mineurs
- Points d'attention : fichiers touchés `step-blocks.tsx`, `path-completion-card.tsx`, `config/textes/parcours.ts` (aucun token modifié) ; recapturer 3 devices pour les écrans cités ; modifications à consigner dans `REPLIT_ACTIONS.md`
---
