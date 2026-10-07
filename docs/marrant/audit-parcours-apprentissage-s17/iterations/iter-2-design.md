# Itération 2 : notation visuelle @design (s17, 07/10/2026)

Base : captures `docs/qa/captures-parcours-apprentissage-s17/iter-2/` (une quarantaine lues sur 185 : arrivées, quiz juste/faux/fin, aperçus de près, validation 375/768/1280, fins de parcours, profil 375/768/1280, rappel, focus x4, survol x2, « On valide… », désactivé, chargement, échec) comparées à `apres/` et à iter-1-design.md / iter-1-corrections.md. Contrastes calculés sur `tailwind.config.ts` (`border` #2A2A2A, carte #1F1F1F). Textes validés non jugés.

## Notes

| Critère | Tour 1 | Tour 2 | Pourquoi |
|---|---|---|---|
| Cohérence design system / site | 7 | 9 | Interrupteur, Card, Badge Premium, `error-text`, pastille de succès : tout vient du système. Reste le bouton « Supprimer mon compte » décalé et un label d'aperçu hors style (DES-2-06, 2-07) |
| Hiérarchie visuelle | 6 | 9 | Titres de bloc lisibles, filets avant vidéos et quiz, un seul bouton plein par écran, gain d'XP dans la carte. Reste l'accueil Premium à deux boutons pleins (DES-2-08) |
| Espacements / alignements | 6,5 | 9 | Cartes repliées calées (16/16 sur `p-375-etape-echec-reessayer`), profil sans trou, bilan aligné. Reste 3 largeurs dans la carte de fin (DES-2-05) |
| Typographie / lisibilité mobile | 6,5 | 9 | Corps 16 px à 375, 68ch dans l'étape, descriptions vidéo `text-sm`. Reste l'aperçu verrouillé à 98 caractères par ligne à 1280 (DES-2-06) |
| Couleurs / contrastes AA | 6 | 8,5 | Erreurs, profil, série : réglés. Restent deux défauts : boutons `outline` à 1,15:1 (DES-2-02) et consigne dans le bouton désactivé à ≈ 3:1 (DES-2-03) |
| États | 6,5 | 8 | Focus (x6), survol, faux, « On valide… », désactivé, interrupteur coché : prouvés et propres. Chargement et échec : non rendus (DES-2-01) |
| Composants nouveaux | 7 | 9 | Quiz, aperçu, carte de fin, interrupteur finis. Reste le doublon d'XP (DES-2-04) |
| Responsive 375/768/1280 | 7,5 | 9 | Rien ne casse, une colonne propre à 375/768, profil plein à 768/1280 |

**Note globale : 8,5/10** (6 au tour 1). Elle suit les deux plus bas, États et Couleurs : tant que chargement/échec n'ont pas de rendu et que le CTA du visiteur est un cadre invisible, pas de 9. Aucun des 17 écarts du tour 1 n'a régressé.

## Statut des DES-1-NN

| Écart | Statut | Capture / constat |
|---|---|---|
| 1-01 message d'XP caché | Réglé | `p-375/768/1280-repartie-etapeN-apres-validation-vue` : « +75 XP gagnés ! » + date conseillée dans la carte, sous l'en-tête, étape suivante ouverte dessous. Finition : DES-2-04 |
| 1-02 erreur sous AA | Réglé | `v-1280-repartie-quiz-mauvaise-reponse` : rouge `error-text` lisible, encadré `border-l-2`, lettre + ✕ + texte |
| 1-03 profil, contrastes | Réglé, 1 point non prouvé | `p-1280-profil-verifie` : série, chiffres, « Supprimer » en teinte AA, titre « Série ». « Regarde les pros » absent de toutes les captures (carte masquée par la règle « Reprendre seul »), donc non vérifiable |
| 1-04 cartes repliées | Réglé | `p-375-etape-echec-reessayer` : 16 px dessus et dessous |
| 1-05 deux boutons pleins | Réglé | `v-375-…quiz-fin-visiteur` : « Refaire le quiz » outline, offre en plein ; `v-1280-…mauvaise-reponse` : « Question suivante » plein, offre outline. Cible 44 px. Le contour est trop faible : DES-2-02 |
| 1-06 hiérarchie étape | Réglé | `v-1280-repartie-arrivee`, `p-1280-…avant-validation` : titres 16 px display, 68ch, filets. Lecture en plissant les yeux : titre de bloc, vannes, bouton Valider |
| 1-07 carte de fin | Réglé | `p-1280/375-repartie-fin-bilan` : pastille, filet, coches, bilan en bloc. Reste DES-2-05 |
| 1-08 interrupteur | Réglé | `p-1280-rappel-coche`, `p-1280-focus-rappel`, `p-375-rappel-coche` : vrai interrupteur 44 px, anneau de focus, `Card` |
| 1-09 grille du profil | Réglé | `p-768/1280-profil-verifie` : Statistiques pleine largeur, 4 chiffres, Série compacte |
| 1-10 captures d'états | Partiel | Fournis : survol Valider et offre, focus x6, faux, « Essayé, ça a marché », « On valide… », désactivé, interrupteur. Manquent : chargement/échec utilisables (`p-375-etape-chargement` montre le pied de page, cadrage perdu), survol en-tête d'étape / option de quiz / interrupteur |
| 1-11 badge Premium | Réglé | `v-375/1280-apercu-verrouille-zoom` : `Badge premium`, titre tentant, cadenas net |
| 1-12 quiz | Réglé | `v-375-repartie-quiz-explication` : conteneur, lettres en pastille, explication encadrée |
| 1-13 cibles, micro-textes | Réglé | `v-375-accueil` (lien 44 px, souligné), `v-375-entree-fiche-vanne`, `p-1280-retour-exercice-ca-a-marche` |
| 1-14 « Dans un parcours » | Réglé | `v-375-entree-fiche-vanne` : étiquette violette, bouton outline. Contour faible : DES-2-02 |
| 1-15 vannes | Réglé | `p-1280-…avant-validation` : amorce grise, chute en gras blanc, filets |
| 1-16 progression visiteur | Réglé | `v-1280-repartie-arrivee` : une ligne compacte |
| 1-17 en-tête translucide | Réglé | aucune lecture du texte sous la barre sur les vues 375/768 |

## Écarts bloquants le 10

**DES-2-01 : chargement et échec d'une étape sans rendu (connu, correction en parallèle).**
Captures : `p-375-etape-chargement` (on voit le pied de page), `p-375-etape-echec-reessayer` (barre 0/4, étape 1 repliée, aucun message, aucun bouton). Effet : l'utilisateur voit sa progression effacée sans explication. Exigence de rendu : la progression (barre, coches, XP) ne bouge jamais pendant le chargement. Chargement : la carte reste ouverte, titre et badges conservés, corps remplacé par 3 lignes `h-4 animate-pulse rounded bg-background-elevated` (largeurs 100/90/60 %), `aria-busy="true"`, `motion-reduce:animate-none`, hauteur minimale `min-h-[160px]` pour éviter le saut. Échec : bloc `rounded-lg border-l-2 border-error-text bg-error/10 p-3` dans la carte ouverte, texte `text-sm text-error-text` (≈ 5,1:1), bouton « Réessayer » `variant="outline" min-h-[44px] w-full sm:w-auto` focus déplacé dessus, `role="alert"`. Texte du message à faire valider par @copywriter. Captures à refaire : fenêtre visible, carte seule, 375.

**DES-2-02 : boutons `outline` quasi invisibles.**
Captures : `v-375-repartie-quiz-fin-visiteur` (« Refaire le quiz »), `v-1280-survol-voir-offre`, `v-1280-repartie-quiz-mauvaise-reponse`, `v-375-entree-fiche-vanne`. Contour #2A2A2A sur #1F1F1F = 1,15:1 : l'action Premium du visiteur et « Refaire le quiz » ressemblent à un cadre vide, et le survol (+1 cran de gris) ne se voit pas. Ne pas toucher la variante globale. On fait, par `className` dans le parcours : « Voir l'offre Premium » (aperçu, `ValidationWall`) et lien « Dans un parcours » : `border-accent-primary hover:bg-accent-primary/10` (contour #8B5CF6 ≈ 3,9:1) ; « Refaire le quiz » : `border-text-muted` (≈ 5,9:1) `hover:border-text-primary`.

**DES-2-03 : consigne illisible dans le bouton désactivé.**
Capture : `p-1280-bouton-desactive-quiz-a-finir`. « Termine le quiz pour valider cette étape » = texte à ≈ 3:1 (`disabled:opacity-50` sur violet) alors que c'est la seule consigne. Idem « On valide… » (`p-1280-on-valide`, acceptable car transitoire). On fait pour le désactivé « quiz à finir » : `disabled:opacity-100 disabled:bg-background-elevated disabled:text-text-secondary disabled:border disabled:border-border` (≈ 7:1 sur #2A2A2A, et il se lit « inactif », pas « CTA fané »). « On valide… » : conserver le violet, `disabled:opacity-80` et un spinner 16 px devant le texte.

## Finitions (empêchent le 10 s'il y en a beaucoup, à faire dans la même passe)

**DES-2-04 : doublon d'XP dans la carte validée.** `p-768-repartie-etape3-apres-validation-vue` : « +100 XP » (ligne grise) puis « +100 XP gagnés ! » juste dessous. Masquer la ligne statique quand l'étape est validée. Le message de gain : `text-base font-bold` (aujourd'hui `text-sm`, discret pour le moment-récompense de Yanis).

**DES-2-05 : carte de fin, trois largeurs et XP en double.** `p-1280-repartie-fin-bilan` : bilan 448 px à gauche, phrase de passage centrée sur ≈ 726 px, bouton centré. Mettre la phrase dans `mx-auto max-w-md text-center`. La carte « Parcours terminé ! 475 XP au total » au-dessus répète l'XP de la carte de fin : réduire à la seule barre (ou la masquer, arbitrage @ux).

**DES-2-06 : aperçu verrouillé à 1280.** `v-1280-apercu-verrouille-zoom` : corps sur ≈ 98 caractères, phrase Premium sur 1 ligne de 1 080 px, label « Ce que tu vas apprendre » en violet 16 px alors que l'étape ouverte l'écrit en blanc display. `max-w-[68ch]` sur le corps, `max-w-[48ch] mx-auto` sur la phrase, label en `font-display text-base font-bold text-text-primary`.

**DES-2-07 : « Supprimer mon compte » décalé.** `p-1280-profil-verifie` : texte à x = 43 px, titre et paragraphe à x = 32 px (padding `px-3` du bouton). Ajouter `-ml-3`.

**DES-2-08 : accueil Premium, deux boutons pleins.** `p-375-accueil-premium-vue` : « Reprendre l'étape 3 » (dans le bloc) et « Explorer les vannes » juste dessous sont tous deux en plein violet. Quand le bloc Reprendre est affiché, « Explorer les vannes » passe en `outline` (avec DES-2-02 pour le contour).

**DES-2-09 : captures d'états encore manquantes.** Survol de l'en-tête d'étape, d'une option de quiz et de l'interrupteur ; chargement et échec cadrés (DES-2-01). À demander à @qa.

**DES-2-10 : contenu à vérifier (hors design).** `p-375-etape-apres-reessayer` : à l'étape 2 de Répartie, « Ce que tu vas apprendre » et « Le conseil » s'ouvrent sur la même phrase (« En soirée, la musique laisse parfois un blanc de deux secondes… »). Fixture locale ou doublon réel : @qa / @copywriter.

**DES-2-11 : page d'un parcours terminé, rechargée (375).** `p-375-repartie-termine-apres-rechargement-vue` : la carte de fin n'arrive qu'après ≈ 640 px d'argumentaire (intro, « Pour qui ? », Tom). Renvoyé à @ux (replier le haut pour un parcours terminé).

## Pour viser 10 au tour 3

DES-2-01, 2-02, 2-03 (bloquants) + DES-2-04 à 2-08 en code ; captures DES-2-09. Si ces 8 points sont faits et prouvés par capture, je note 10/10 : le reste (hiérarchie, grille, typo, tokens, responsive) est déjà à 9 et tient. Aucun nouveau token requis ; `border-accent-primary` et `text-text-muted` existent.
