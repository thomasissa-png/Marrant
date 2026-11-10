# Revue design du brief s24 (v1), espace client Premium

Revue par @design, le 10/11/2026. Sources lues : le brief v1, la capture de référence, `apps/web/tailwind.config.ts`, `components/ui/{button,progress-bar,empty-state}.tsx`, liste de `components/ui` et `components/layout`. Le brief n'est pas modifié.

## Constats de fond

- Le site est sombre de façon native (palette `background` #0D0D0D à #2A2A2A, `accent-primary` #8B5CF6, `accent-link` #A78BFA pour le texte violet, `text-muted` #9A9A9A, `border-input` #707070, `darkMode: "class"`). La capture de référence est CLAIRE (fond blanc, boutons bleu indigo, tout en petites capitales, emojis). Le brief ne dit nulle part que le rendu doit rester dans la palette sombre : risque de copier le rendu de la référence.
- Le brief ne cite aucun composant de `components/ui` (ProgressBar, Card, Badge, Button, Chip, EmptyState, ErrorState, Chargement, StreakCounter, XpNotification, LigneCompte, Reassurance). Il cite seulement des composants métier (`reprendre-parcours`, `favoris-list`). Dérive de style probable.
- La capture montre 6 boutons « FAIT » pleins identiques par écran. Chez nous, le niveau 1 (`primary`) est réservé à l'action dominante (revue s21 M3). Six boutons pleins = aucune hiérarchie (critère Thomas n°8 et n°9).
- La capture utilise des emojis dans les titres de fiches ; le brief les interdit (§5.4, critère 12) mais `EmptyState` impose aujourd'hui une prop `emoji` obligatoire : conflit non vu.
- Textes de la capture à 10-11 px : inacceptable ici (lisibilité, AA).

## Tableau

| Angle | Note /10 | Constat |
|---|---|---|
| Demande visuelle (barre, pastilles, cartes, Voir/Fait, XP, vides) | 7 | Éléments bien listés et traduits en données réelles (pas de niveaux inventés, Q4). Manque : hiérarchie des actions, hauteur et empilement de la sous-barre, règle de l'état actif, pastille de cloche accessible. |
| Réutilisation du design system | 5 | Aucun composant `ui/` nommé, aucune règle « pas de hex, pas de classe hors tokens », nouveaux tokens non prévus. |
| Dark mode | 3 | Jamais mentionné ; la référence claire est un piège. |
| Densité et lisibilité mobile | 6 | Barre à défilement avec fondu, 320 px testé : bien. Manque : ligne d'étape à 2 boutons à 320 px, taille de texte minimale, aire de défilement et focus. |
| Captures avant/après | 7 | PC 1280 et mobile 375 exigés : bien. Manque : 768, 320, états (vide, chargement, erreur), mode de prise (écran réel, pas maquette). |
| Critères binaires | 6 | Cibles 44 px et débordement présents (critère 4), 5 états (8). Manque : contraste mesuré, focus visible, `prefers-reduced-motion`, nom accessible de la cloche et des barres, absence de hex en dur. |
| Étalons visuels à Thomas | 7 | Liste correcte (barre x3, tableau de bord x2, carte, ligne Voir/Fait, cloche). Manque : forme (rendu réel avec les vrais tokens, sombre), et ordre (avant tout code, pas seulement au lot 0). |

**Note globale design : 6 / 10.** Bonne traduction fonctionnelle, mais le brief laisse @design et @fullstack improviser le style, et le piège « clair + emojis + boutons pleins » de la référence n'est pas écarté.

## Corrections OBLIGATOIRES (texte exact à insérer dans le brief)

**D1. À insérer en §5.4 (contraintes non négociables), nouvelle puce :**
> Design : l'espace utilise EXCLUSIVEMENT le design system existant (`apps/web/tailwind.config.ts` et `components/ui`), en thème sombre natif du site. Aucune couleur en dur (pas de #hex, pas de `bg-[...]`), aucune taille hors échelle Tailwind, aucune ombre ou police nouvelle. La capture de référence est claire, en petites capitales, avec emojis et boutons bleus : rien de ce rendu n'est repris. Un besoin de token neuf est d'abord proposé à @design, ajouté à `tailwind.config.ts` avec son rapport de contraste mesuré, puis utilisé.

**D2. À insérer en §3 (après §3.8), nouveau §3.9 « Composants à réutiliser » :**
> Obligatoires : `ProgressBar` (progression globale et par niveau de XP, avec `ariaLabel`), `Card`, `Badge` (pastille « XP total », statut d'étape), `Button` (variantes ci-dessous), `Chip`, `StreakCounter`, `XpNotification`, `EmptyState`, `ErrorState`, `Chargement`, `LigneCompte`. Texte violet de moins de 24 px : `text-accent-link`, jamais `accent-primary`. Si un composant manque, @design le spécifie dans `docs/design/component-library.md` avant le code.

**D3. À insérer en §3.3 après la liste d'étapes :**
> Hiérarchie des actions d'une page parcours : UNE seule action dominante visible (le bouton « Voir » de l'étape conseillée, `Button` variant `primary`). Les autres lignes : « Voir » en `outline-accent`, « Fait » en `outline` avec libellé texte « Fait » et coche, jamais six boutons pleins. Étape faite : coche + libellé « Fait » (pas seulement une couleur), bouton « Voir » conservé. Numéro d'étape et statut en texte, lisibles sans la couleur.

**D4. À insérer en §3.1 après le tableau :**
> Barre de rubriques : `nav` avec `aria-label`, élément actif marqué par `aria-current="page"` ET par un signe visible autre que la couleur (soulignement 2 px + texte `text-primary`). Libellés en texte (jamais d'icône seule), casse normale, au moins 14 px. Cible tactile >= 44 px de haut sur toute la barre. Sous-barre `sticky` sous l'en-tête (top-16), `z-index` inférieur à celui de l'en-tête (z-50), fond `background` opaque, séparation par `border`, sans ombre. Mobile : défilement horizontal avec `scroll-snap`, fondu de bord, rubrique active ramenée dans la vue à l'ouverture, focus clavier jamais masqué par le fondu. Menu « Plus » : bouton avec libellé « Plus », `aria-expanded`.

**D5. À insérer en §3.6 (cloche) :**
> Cloche : bouton d'au moins 44 x 44 px avec `aria-label` incluant le nombre non lu (« Notifications, 3 non lues »), pastille avec le nombre en chiffres (« 9+ » au-delà), contraste texte/pastille >= 4,5:1, aucun clignotement ni animation en boucle. Panneau ouvert : bottom sheet sur mobile (`items-end`, `100dvh`, `safe-area-inset-bottom`), popover sur ordinateur ; ouverture et fermeture au clavier (Échap, focus rendu au bouton).

**D6. À insérer en §5.1, après le critère 14 (critères 15 à 20) :**
> 15. Contrastes mesurés (texte >= 4,5:1, composants et focus >= 3:1) pour chaque couple de tokens utilisé dans l'espace, rapport joint à la revue @design. 16. Focus visible sur tout élément interactif (anneau `focus-visible:ring-2`, jamais `outline: none` seul). 17. Aucune couleur en dur ni valeur arbitraire Tailwind dans les fichiers de l'espace (grep automatique : `#[0-9a-fA-F]{3,6}` et `\[[0-9]+px\]`). 18. Texte courant >= 14 px, texte secondaire >= 12 px, jamais en dessous. 19. Ligne d'étape à 320 px : titre sur 2 lignes maximum, « Voir » et « Fait » côte à côte ou empilés, chacun >= 44 px de haut et de large, 8 px d'écart minimum, aucune coupure de libellé. 20. `prefers-reduced-motion` : barres de progression, fondus et pastilles sans animation. Aucun `EmptyState` avec emoji dans l'espace (prop emoji rendue optionnelle ou variante sans emoji, retouche minimale, sans changement des pages publiques).

**D7. À insérer en §5.4 (avant/après), en remplacement de « PC (1280 px) et mobile (375 px) » :**
> Captures du rendu réel local, en thème sombre, à 375, 768 et 1280 px (et 320 px pour la barre et la ligne d'étape), pour CHAQUE écran et CHAQUE état (défaut, chargement, vide, erreur, succès), nommées `tests/screenshots/espace-<écran>-<état>-<largeur>.png`. @design lit chaque PNG et note les 10 critères visuels (PRO, BEAU, aligné, aéré, conversion, hiérarchie, accessible, même identité, brand-aligned, propre) en PASS/FAIL avec justification concrète ; pas de validation sans captures.

**D8. À insérer en §4, après la ligne « Étalons visuels à obtenir de Thomas » :**
> Forme des étalons visuels : écrans HTML statiques ou captures rendus avec les vrais tokens du site en thème sombre, jamais des maquettes d'un autre style. Ils sont produits par @design et soumis à Thomas AVANT le lot 1 (pas seulement au lot 0). Une variante est recommandée par étalon, avec une phrase sans jargon (effet pour l'abonné).

## Souhaitables (une ligne chacun)

- S1. Ajouter un livrable `docs/design/page-compositions.md` (section espace) : layout par breakpoint, ordre et priorité des blocs du tableau de bord.
- S2. Barre « Progression globale » : afficher le texte « {n} sur {total} étapes » en plus du pourcentage (lisible sans voir la barre).
- S3. Pastille XP : icône SVG de `header-icons.tsx` ou nouvelle icône du système, pas de glyphe emoji.
- S4. Limiter à 2 niveaux de cartes imbriquées (carte dans carte) pour garder l'aération.
- S5. Nom du membre dans l'en-tête de l'espace : tronqué avec `title`, jamais d'ID chiffré (la capture affiche un identifiant, non repris).
- S6. Prévoir la version e-mail et PDF du bilan de fin seulement si elle existe, en héritant des tokens.
- S7. Largeur de lecture de la page parcours : une colonne centrée, environ 720 px max, comme la référence, en mobile plein écran avec marges `px-4`.
- S8. Réserver la rubrique « Mon compte » et la résiliation à un style neutre (`outline`), jamais en rouge plein, résiliation visible et à 1 clic.

## Verdict

Brief lançable après D1 à D8 (corrections insérables sans changer l'architecture). Non lançable tel quel : le thème sombre et la hiérarchie des boutons ne sont pas protégés.
