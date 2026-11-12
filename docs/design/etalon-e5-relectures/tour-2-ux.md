# E5 v4.1, relecture à l'aveugle, tour 2 : @ux

Ouvert : aujourdhui 320 / 375 / 768 / 1280, premier écran, zoom200, après-paiement, habitué, reprise, cloche 2 réponses ; parcours 320 / 375 / 768 / 1280, zoom200, jour1, bonus ; carte-rafale 375, révision, réponses, règle, notes (échec, confirmer, saisie, enregistrée), zoom200, 1280 ; mes-questions 375 / 768 / 1280, retard, zoom200. **Non ouvertes : carte-rafale 320 / 768, mes-questions 320, notes vide et supprimée, revision-avant, états `attente` / `sequence` / `rech` (aucune capture).** Source non relue ce tour : ordre DOM et piège de focus restent à confirmer au clavier.

## Tour 1 : vérification
Corrigés et vus : calendrier de 4 lignes (replié sous 300 px, chevron), arrivée du jour 1 sans repère ni étape, loupe présente à 320 et à 200 %, bordures des boutons secondaires (#707070 lisibles), doublon de la cloche (groupe puis « type du fil + date », 2 réponses OK), « C'est tout pour aujourd'hui » visible, « Prends ton temps » sorti du lien, N4 (hero, « Commencer » seul).
Pas corrigés : jour1 (voir C1), rafale à 200 % non recapturée, état « échec » (voir C5).

## Les 4 choix du designer : tranchés
1. **En-tête et barre non épinglés sous 300 px, onglets 12/16 : OUI.** Épinglés, ils prendraient plus du tiers d'un écran de 406 px (WCAG 1.4.10, 2.4.11) ; 6.2 « sticky top-16 » vaut aux largeurs de téléphone, pas à 200 %. Conditions : « Aujourd'hui » reste la première entrée, `aria-current` et ramener l'active inchangés ; à noter en 6.2.
2. **Pas de rafale au jour 1 : OUI.** 4.4 état 1 est « aucune fiche faite : premier pas » et 4.4 ne l'inclut pas dans la composition de l'arrivée ; un seul « Commencer ». Condition : la rafale apparaît dans la même visite dès que le premier pas est fait (état 2) ; à écrire en 4.4 par @creative-strategy.
3. **Règle de E1.1 en 3 phrases : GARDER.** E1.1 est validé (12/11, FP l. 171) et fait foi ; elle tient en 3 lignes à 375 (capture « règle »). C'est 2.2 point 6 (« en une phrase ») qui est à aligner (« courte »).
4. **Calendrier replié sous 300 px : OUI.** Rien n'est retiré, un `<details>` de 44 px (`aria-expanded`) ; 5.4 est tenu (4 lignes ouvertes dès 300 px).
5. **Écart étape / cap à 16 px à 200 % : OUI, si « Ton cap » tient sur une ligne.** La règle 3.0 pt 6 sépare deux « n sur m » ; deux cartes à bordure et à H2 distincts le font. Mais la capture 200 % casse « Ton / cap » en deux lignes (pastilles sur la ligne du titre). Voir C4.

## Notes /10
| C1 | C2 | C3 | C4 | C5 | C6 |
|---|---|---|---|---|---|
| 9 | 9 | 9 | 9 | 8 | 9 |

## Pour chaque note < 10
**C1 (9)**
- **[Parcours, `#etat=jour1`]** la capture `parcours-jour1-375.png` est identique à l'état par défaut (« 3 jours », « cap 3 sur 5 », étape 3 sur 6) : le hash n'a pas été appliqué (navigation par hash sans rechargement). Recapturer avec rechargement ; attendu : série à 0, « Tu t'échauffes · cap 1 sur 5 ».
- **[Parcours, bonus]** la capture imprime l'en-tête et la barre au milieu de la page et masque « Ton cap » : ni l'écart ni le rang de « Tes bonus » ne sont vérifiables. Recapturer en neutralisant le `sticky` (ou par fenêtre).
- **Non rendus « par manque de temps »** (page de succès, « Mes répliques », menu de compte, mission, bilan) : motif invalide (commandement 5). Les rendre au tour 3, au moins page de succès et « Mes répliques » (ligne E5).
- **Recherche ouverte (`&rech`)** et états `attente` / `sequence` : aucune capture, éléments de la ligne E5. À fournir.

**C2 (9)**
- **[Aujourd'hui jour 1, 768]** le hero reste étiré (environ 250 px vides) et le bouton fait 670 px de large, alors que les puces sont déjà dans le premier écran de 1024 : l'étirement n'a plus d'objet. Correction : `min-height` seulement sous 600 px de large ; dès 600 px, hauteur naturelle et bouton `width:auto` (comme à 1280). À 375 le hero (190 px de vide) est accepté.

**C3 (9)**
- **[Barre, 375, Mes questions / entrées défilées]** « Aujourd'hui » épinglée n'a ni fond opaque ni séparateur : un fragment (« thèque ») du libellé qui passe dessous apparaît collé à lui. Correction : fond `#0D0D0D` plein, 8 px de fondu ou filet à droite de l'entrée épinglée.
- **[Note, `confirmer`]** deux boutons « Supprimer » à l'écran (l'initial et la confirmation). Correction : masquer le premier pendant la confirmation, focus sur « Annuler », groupe nommé par « Supprimer cette réplique ? ».
- À confirmer au clavier : ordre DOM = ordre visuel, focus piégé dans la cloche.

**C4 (9)**
- **[Parcours, 200 %]** « Ton cap » passe sur deux lignes (24/32 avec cinq pastilles). Correction : H2 de cette carte en 20/28, pastilles de 10 px espacées de 2 px (136 px sur 140) ; si cela ne tient pas, pastilles sous la ligne du cap (+20 px) et gagner 20 px ailleurs (marqueurs off : « Les parcours » gagne 16 px). Valider N2 avec `&hyp=off`.
- **[Aujourd'hui jour 1, 200 %]** « 5 min » touche « Commencer » (« 5 minCommencer »). Correction : 8 px d'écart minimum.
- **[Mes questions, 200 %]** le texte de « Retirer de mon historique [HYPOTHÈSE] » et de « Envoyer [HYPOTHÈSE] » déborde du bouton (marqueur inline). Correction : `white-space:normal`, padding 8 px ; recapturer avec `&hyp=off`.
- **[Carte « Et toi ? », 1280]** trois boutons de 330 px sur 1046 px : `max-width` 720 px pour les cartes et le geste.
- Rafale en liste à 200 % : recapturer l'état habitué.

**C5 (8)**
- **[Note, `echec`]** le message dit « Ton texte est toujours là » mais le champ est vide (placeholder) et le compteur dit « 0 caractère ». Contraire à 2.7 (jamais de perte). Correction : champ garni de « [ta phrase] », compteur à la longueur réelle, « Réessayer » seul bouton principal.
- **[Note, `enregistree`]** « Enregistrée » sous un champ vide et « 0 caractère » : une réplique enregistrée se lit perdue. Correction : champ rempli, compteur supprimé (ou à jour), « Supprimer » conservé.
- **[Révision « Et toi ? »]** « Ta réplique la dernière fois » s'insère entre « détendue » et « tendue ». Correction : après les deux répliques, avant « Le pourquoi » (ordre de 2.2).
- Cloche « nouveautés » / « vide », note « vide » / « supprimée » : non rouvertes ce tour.

**C6 (9)**
- **[Aujourd'hui, 3 états]** « 5 min » n'a pas de marqueur et diffère de « moins de 5 minutes » (4.2). Correction : reprendre « Moins de 5 minutes » ou marquer [HYPOTHÈSE]. Le marqueur parasite « [on] » en bas à gauche de toutes les captures est à retirer de la maquette.
