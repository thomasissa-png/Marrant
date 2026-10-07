# Itération 1 : notation visuelle @design (s17, 07/10/2026)

Base : commit `68124cb`, 86 captures `docs/qa/captures-parcours-apprentissage-s17/apres/` (lues : arrivée, quiz, aperçu, fins, profils, vues après validation, 375/768/1280) + captures d'avant de la racine. Contrastes calculés sur les tokens de `tailwind.config.ts` (le calcul retrouve les 2,31:1 d'axe). Textes étalons non jugés.

## Notes

| Critère | Note | Pourquoi en une ligne |
|---|---|---|
| Cohérence design system / site | 7 | Bonne base (Card, Badge, tokens), mais rappel de parcours hors système (case native, `rounded-xl p-5`), `accent-secondary` en texte, badge Premium en simple texte |
| Hiérarchie visuelle | 6 | Étape ouverte = mur de blocs de même poids (titres `text-sm`), deux boutons violets pleins qui se concurrencent, message d'XP invisible |
| Espacements / alignements | 6,5 | Cartes repliées avec 32 px dessous pour 16 px dessus, carte de fin mi-centrée mi-gauche, trou dans la grille du profil |
| Typographie / lisibilité mobile | 6,5 | Corps `text-sm` sur 100 à 120 caractères par ligne à 1280, trop de `text-xs` (descriptions vidéo italiques, liens de fiche) |
| Couleurs / contrastes AA | 6 | Réponse fausse du quiz ≈ 4,0:1, 3 contrastes du profil + chiffres des stats 2,3:1, bouton « Supprimer » 4,38:1 |
| États | 6,5 | Verrouillé, actif, terminé, sélectionné : lisibles. Survol, focus, chargement, réponse fausse, « On valide… » : aucune capture, donc non prouvé |
| Composants nouveaux | 7 | Quiz, aperçu, vidéos, carte de fin : bien construits, finition manquante (lettres, explication, bilan) |
| Responsive 375/768/1280 | 7,5 | Rien ne casse, une seule colonne propre ; le profil laisse un vide à 768 et 1280 |

**Note globale : 6/10.** Elle suit la plus basse (contrastes et hiérarchie) : un défaut AA ou un message d'XP caché interdit tout 7, quel que soit le reste. Aucune des 10 entrées visiteur ne casse ; le socle est bon, la finition est ce qui sépare de 10.

## Écarts bloquants le 10

**DES-1-01 : message d'XP caché sous l'en-tête (bug 1 QA).**
Captures : `p-375-repartie-etape2-apres-validation-vue`, `p-768-…etape3-…vue`, `p-1280-repartie-etape3-apres-validation-vue` (on lit « +100 XP gagnés ! » coupé en haut). Problème : `parcours-detail.tsx:450` pose le message au-dessus de la liste, la page défile plus bas, 6 s plus tard il disparaît. Effet : le moment de récompense, central pour Yanis, n'est jamais vu. On fait : remplacer par une pastille collante sous l'en-tête (h-16) : `sticky top-20 z-30 flex justify-center` autour de `<p class="rounded-full border border-accent-primary/40 bg-background-card px-4 py-2 text-sm font-bold text-accent-link shadow-lg animate-scale-in">`. Durée 10 s, minuterie annulée au démontage et à chaque nouveau message (règle aussi le bug 3), `motion-reduce:animate-none`. La zone `aria-live` reste montée mais sans `mb-4` quand elle est vide (supprime les 16 px morts avant « Le programme »).

**DES-1-02 : texte d'erreur sous AA (réponse fausse).**
Capture : `desktop-quiz-q2-faux` (mêmes classes qu'aujourd'hui, `step-quiz.tsx:108-109`). `text-error` (#EF4444) sur `bg-error/10` sur carte `#1F1F1F` = ≈ 4,0:1 pour du 14 px. Même cas pour l'alerte d'échec de validation (`parcours-detail.tsx:455`). On fait : ajouter le token `error-text: "#F87171"` dans `tailwind.config.ts` (`text-error-text`, ≈ 5,4:1 sur carte, ≈ 5,1:1 sur `bg-error/10`) et l'utiliser pour tout texte d'erreur ; `error` reste pour bordures et fonds. Le vert `text-success` passe (≈ 6,2:1), ne pas y toucher.

**DES-1-03 : profil, 4 contrastes + titre anglais (bug 4 QA).**
Captures : `p-375-profil-verifie`, `p-1280-profil-verifie`. Cause commune : `accent-secondary` (#6D28D9, 2,3:1) utilisé comme couleur de texte. On fait :
- `streak-counter.tsx:26` : `text-accent-link text-base font-bold` (« 1 jour » passe de 2,2 à ≈ 6:1), et `aria-label="streak"` → `"série"` (l.21).
- `profil-dashboard.tsx:200` et `:212` (chiffres « 1 » et « 0 ») : `text-accent-link` (aujourd'hui l'alternance link/secondary est arbitraire et un chiffre sur deux est terne).
- `profil-dashboard.tsx:336` : `text-accent-link`, hover `group-hover:border-accent-primary` comme les 3 autres cartes (aujourd'hui la 3e carte « Regarde les pros » est visiblement plus sombre que les deux premières).
- `supprimer-compte-card.tsx` (bouton) : `text-error-text` (4,38 → ≈ 5,4:1).
- `profil-dashboard.tsx:179` : titre « Streak » → « Ta série » (wording @copywriter à confirmer, cohérent avec « jours de suite »).
- Règle à écrire dans `docs/design/design-system.md` : `accent-secondary` interdit en texte, réservé aux fonds de bouton.

**DES-1-04 : cartes d'étape repliées déséquilibrées.**
Captures : `p-375-repartie-etape2-apres-validation-vue` (étapes 1 et 2), `p-1280-…etape3-…vue` (3 cartes), aperçu verrouillé 375/1280. Problème : `Card p-4` + `CardHeader pb-4` donnent 16 px au-dessus du titre et 32 px dessous quand la carte est fermée, contenu collé en haut. Effet : toutes les pages du parcours semblent mal calées. On fait : dans `parcours-step-card.tsx:96`, ajouter `pb-0` à l'en-tête quand `!(isExpanded && canExpand)`.

**DES-1-05 : deux boutons violets pleins qui se disputent (quiz visiteur).**
Captures : `v-375-repartie-quiz-explication`, `v-768-…quiz-explication`, `v-375-…quiz-fin-visiteur`. « Question suivante » (`size="sm"`, ≈ 43 px, à droite) puis « Voir l'offre Premium » (pleine largeur) à 24 px dessous : aucune action dominante, et la cible tactile est < 44 px. On fait :
- « Question suivante » : `min-h-[44px] w-full sm:w-auto` (`step-quiz.tsx:150`).
- « Continuer » (fin de quiz, `:63`) : `variant="outline" min-h-[44px]`, pour laisser le plein violet à « Voir l'offre Premium ».
- `ValidationWall` : séparateur `mt-2 border-t border-border pt-4` ; tant que le quiz n'est pas terminé, bouton en `variant="outline"`, en `primary` seulement à la fin (un seul bouton plein par écran).

**DES-1-06 : étape ouverte sans hiérarchie interne, lignes trop longues.**
Captures : `v-375-repartie-arrivee` (5 175 px de haut), `v-1280-repartie-arrivee`, `p-1280-…avant-validation`. Les 8 blocs (pourquoi, apprendre, conseil, exemple, exercice, vannes, vidéos, quiz) ont le même poids : `Section` = `h4 text-sm font-semibold`, paragraphes `text-sm` sur 100 à 120 caractères à 1280. En plissant les yeux on ne voit ni le titre de bloc ni le bouton. On fait (`parcours-step-card.tsx:40-47, 188`) :
- `h4` → `font-display text-base font-bold` ; `space-y-5` → `space-y-6`.
- Corps de « Ce que tu vas apprendre » et « Le conseil » : `text-base leading-7 sm:text-[15px]` + `max-w-[68ch]`.
- Filet `border-t border-border pt-6` avant « Pour aller plus loin » et avant le quiz (zones d'action séparées de la lecture).

**DES-1-07 : carte de fin et bilan mal alignés.**
Captures : `p-1280-repartie-fin-bilan`, `p-1280-repartie-fin-pleine-page`, `p-375-repartie-fin-bilan`. Titre, sous-titre et XP centrés ; « Ce que tu sais faire maintenant : » et la liste à puces collés à gauche d'une colonne étroite ; « 3 défis essayés… » recentré. Le sommet émotionnel du parcours est une carte plate sans point focal. On fait (`PathCompletionCard`, appelé `parcours-detail.tsx:503`) : pastille de succès 48 px (`h-12 w-12 rounded-full bg-accent-primary` avec la coche des étapes) au-dessus du titre ; bilan dans un bloc `mx-auto max-w-md text-left` (label, liste avec coche `text-accent-link` au lieu des puces, ligne des défis dans le même bloc) séparé par `border-t border-border pt-4` ; titre, XP et bouton « Passer au parcours… » restent centrés. Le bouton garde sa largeur (`w-full sm:w-auto`, `min-h-[44px]`).

**DES-1-08 : rappel de parcours hors système (interrupteur).**
Captures : `p-375/768/1280-profil-verifie`. `rappel-parcours-toggle.tsx:88` : `rounded-xl p-5` quand toutes les cartes du profil sont `rounded-lg p-4` (le titre est décalé de 4 px) ; case native blanche de 20 px sur fond sombre (`:97`, zone de clic < 44 px) alors que c'est un « interrupteur » ; liste déroulante noire native ; `min-h-[1.25rem]` vide qui ajoute du blanc sous le contrôle (`:149`). On fait : `Card` + `CardTitle` ; vrai interrupteur : `<input type="checkbox" role="switch" class="peer sr-only">` + piste `h-6 w-11 rounded-full bg-background-elevated border border-border-hover transition-colors peer-checked:bg-accent-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-primary` avec pastille `h-5 w-5 rounded-full bg-white translate-x-0.5 peer-checked:translate-x-[22px]`, le tout dans le `<label>` en `min-h-[44px] items-center` ; `select` : `bg-background-light border-border-hover focus-visible:outline-accent-primary` ; message `empty:hidden` (garder la zone `aria-live`, `min-h-0`). Vérifier que l'ancre `#rappel-parcours` (lien depuis la page parcours) existe bien sur la section avec `scroll-mt-24` : `id` non visible dans le code lu.

**DES-1-09 : grille du profil troué.**
Captures : `p-768-profil-verifie`, `p-1280-profil-verifie`. « Statistiques » reste seule à gauche avec un vide à droite, « Streak » est une carte de 170 px pour une pastille. On fait : `profil-dashboard.tsx:187` `<Card className="md:col-span-2">` (ses 4 chiffres tiennent déjà en `sm:grid-cols-4`) ; carte Streak : `CardContent py-2`. Page profil : largeur pleine alors que le parcours est en `max-w-3xl` : hors périmètre, à signaler comme finition globale.

**DES-1-10 : captures d'états manquantes (G_PROOF).**
Aucune capture de : survol/focus-visible (en-tête d'étape, option de quiz, boutons de retour, interrupteur), réponse fausse sur la version « après », « Essayé, ça a marché » sélectionné, « On valide… », « Termine le quiz pour valider » (désactivé), chargement/échec d'étape, interrupteur coché, pastille d'XP visible. Je ne peux pas valider ces états sans preuve. Demander à @qa pour l'itération 2 (noms stables, fenêtre visible, pas pleine page).

## Finitions (n'empêchent pas un 9, empêchent le 10)

**DES-1-11 : badge Premium et cadenas faibles.** `v-375-repartie-apercu-etape2`, `v-1280-…apercu-etape2`. « Fait partie de Premium » = texte `text-xs text-text-muted` alors que le composant `Badge variant="premium"` existe (déjà utilisé sur /profil) ; titre grisé en `text-text-muted` comme un élément désactivé, cadenas `opacity-60` et `text-text-muted/50` (≈ 2,2:1). On fait (`parcours-step-card.tsx:110, 125, 133, 154`) : `<Badge variant="premium">` à la place du texte ; titre `text-text-secondary` (tentant, pas mort) ; pastille de cadenas sans `opacity-60`, icône de droite `text-text-muted` ; garder `border-dashed`.

**DES-1-12 : quiz sans conteneur ni lettres en pastille.** `v-375-…quiz-explication`, `v-1280-repartie-arrivee`. Les lettres A à D sont du gras brut, l'explication est un pavé collé aux options. On fait (`step-quiz.tsx:96-147`) : conteneur `rounded-lg border border-border bg-background-elevated/40 p-4` ; lettre `flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background-elevated text-xs font-bold` (juste : `bg-success/20 text-success`, faux : `bg-error/20 text-error-text`) ; question `text-base font-medium` ; explication dans `rounded-lg border-l-2 bg-background-elevated p-3 leading-relaxed` (`border-success` ou `border-error-text`).

**DES-1-13 : cibles et micro-textes.** `VideoCard` (`step-blocks.tsx:80-85`) : description `text-xs italic text-text-muted` : passer à `text-sm not-italic text-text-secondary`. Liens « Voir la fiche… » (`:82`, `:106`) et « Lire la fiche du conseil » : `text-sm inline-flex min-h-[44px] items-center`. Boutons « Alors, ce défi ? » (`size="sm"`) : `min-h-[44px]`. Lien d'accueil « Lire la première étape gratuite » (`v-375-accueil`, ≈ 20 px de haut) : `inline-flex min-h-[44px] items-center`.

**DES-1-14 : encart « Dans un parcours » des fiches.** `v-375-entree-fiche-vanne`. Étiquette grise en capitales alors que le bloc voisin « Pourquoi ça marche » est en capitales violettes ; lien blanc gras souligné qui se lit comme un titre, pas comme une action. On fait : étiquette `text-xs font-semibold uppercase tracking-wide text-accent-link` ; lien en `buttonVariants({ variant: "outline" })` `w-full sm:w-auto min-h-[44px]` (texte inchangé).

**DES-1-15 : vannes de l'étape, chute plus faible que le setup.** `p-1280-repartie-etape1-avant-validation`. `step-blocks.tsx:104-105` : amorce en `text-text-primary`, chute en `text-text-secondary`, c'est l'inverse de la lecture d'une vanne. Fait : amorce `text-text-secondary`, chute `font-semibold text-text-primary`, `ul` en `divide-y divide-border`, `li` `py-3`.

**DES-1-16 : carte de progression visiteur et XP.** `v-1280-repartie-arrivee` : carte « Étape 1 offerte, étapes 2 à 4 avec Premium » = une ligne dans ≈ 85 px (en-tête vide + `pb-4`) : retirer l'en-tête vide, `py-3`. `p-1280-…avant-validation` : « 475 XP au total, dont 100 de bonus » sous une barre à 0/4 se lit comme des XP déjà gagnés : renvoyé à @ux (libellé), côté visuel le passer en `text-text-secondary` pour ne pas le confondre avec un gain.

**DES-1-17 : en-tête translucide.** `v-375-…quiz-explication`, `v-768-…quiz-explication` : le texte de la page transparaît sous la barre (« arrive avec 30 minutes de retard »). Fichier d'en-tête global : `bg-background/95 backdrop-blur-md`. Renforce DES-1-01.

## Ce qui est déjà à 10 (ne pas toucher)

Fond, cartes, rayon, `font-display` des titres, coche violette des étapes validées et teinte `accent-primary/5`, bouton « Reprendre l'étape » du profil (bloc teinté, un seul bouton plein, hiérarchie nette), aperçu verrouillé (rien ne fuit, bouton 44 px), lettres + ✓ + texte de correction (pas de couleur seule), bloc vidéos 2 colonnes à 768+, entrées accueil / blog / fiche vanne qui arrivent bien sur `#etape-1`, page /parcours.

## Pour viser 10 au tour 2

Corriger DES-1-01 à 1-10 (bloquants) ; DES-1-11 à 1-17 si possible dans la même passe. Captures iter-2 : mêmes noms plus les états de DES-1-10. Tokens modifiés (`error-text`) : prévenir @qa (axe /profil et parcours) et mettre à jour `docs/design/design-system.md` (token + règle `accent-secondary`). Dark mode seul existant, pas de mode clair à vérifier.
