# Revue visuelle à l'aveugle, « Ta question à l'équipe » (s22, tour 2)

Périmètre : `question-equipe-card.tsx`, `question-equipe-messages.tsx`, comparaison avec `prenom-card.tsx`, tokens `tailwind.config.ts`.
Preuves : 46 captures `docs/qa/captures-question-equipe-s22/` (1440 / 390 / 360, tous états). Lues : les 14 états en 360, profil Premium 360 et 1440, profil gratuit 360, trop-long 1440, focus-bouton 390.
Non lu (budget de 6 lectures) : `ui/button.tsx` et `ui/input.tsx`. Ce qui en dépend est marqué [À VÉRIFIER].

## Verdict : NO-GO v2 (note 8,6 / 10, 0 bloquant, 2 majeurs à corriger)

Aucun bloquant. Le seuil GO (>= 9) n'est pas atteint à cause de 2 corrections rapides (C1 bordure du champ, C2 taille de police en paysage). Appliquées, la projection est de 9,2 / 10 sans nouvelle itération visuelle, à confirmer par une recapture 360 et 844 paysage.

| Critère | Note | Constat |
|---|---|---|
| Intégration au profil | 9 | Carte posée entre Abonnement et Prénom, même `Card`, même rythme de titre. Absente en gratuit (vérifié 360). Un seul bouton primaire. |
| Lisibilité 360 | 9 | Titre, accroche, délai, champ, aide, bouton en pile lisible, aucune coupure disgracieuse (« 1 à 2 jours » lié). Aide et compteur en 12 px : lisibles mais petits. |
| États | 9 | Les 9 erreurs (vide, trop long, envoi, trop d'envois x2, plus Premium, session) sont en texte rouge 14 px sous le champ, `role="alert"`, texte explicite, lien souligné. Succès : bloc vert avec coche, texte blanc, sous le bouton : très clair. Envoi en cours : libellé du bouton changé. |
| Contraste AA | 7,5 | Tous les textes passent (tableau ci-dessous). Échec 1.4.11 sur la bordure du champ (1,15:1). |
| Focus clavier | 9 | Champ : bordure + anneau violet (3,9:1 sur carte), `outline-none` compensé. Bouton : anneau clair net (focus-bouton 360/390). Liens : anneau `accent-link` offset 2. Succès : `ring-2` au focus-visible. |
| Zones tactiles | 8,5 | Bouton `min-h-11` = 44 px, pleine largeur mobile. Liens en ligne (Confidentialité, mailto, Reconnecte-toi) < 44 px : exemption WCAG 2.5.8 (liens dans une phrase), non bloquant. |
| Pas de débordement | 9,5 | Aucun scroll horizontal en 360 ni 390, e-mail `contact@deviens-marrant.fr` tient en 360. |
| Pas de zoom iOS | 7,5 | 16 px sous 640 px (`text-base`), mais `sm:text-sm` = 14 px dès 640 px : iPhone en paysage (667 à 932 px) zoomera au focus. |

Moyenne : 8,56, arrondie à 8,6.

## Contrastes calculés (tokens réels, WCAG 2.x, luminance relative)

Fonds : carte `#1F1F1F` L = 0,0137 ; champ `#1A1A1A` L = 0,0103 ; page `#0D0D0D` L = 0,0040.

| Élément | Couleur | Fond | Ratio | Seuil | Verdict |
|---|---|---|---|---|---|
| Titre, libellé, texte saisi, succès | `#FFFFFF` | carte | 16,5:1 | 4,5 | OK |
| Accroche | `text-secondary #B3B3B3` | carte | 7,9:1 | 4,5 | OK |
| Délai, aide, mention, compteur | `text-muted #9A9A9A` | carte | 5,9:1 | 4,5 | OK |
| Placeholder (si présent) | `text-muted` | champ | 6,2:1 | 4,5 | OK |
| Erreurs, compteur dépassé | `error-text #F87171` | carte | 6,0:1 | 4,5 | OK (le commentaire du config dit 5,4, la mesure donne 6,0) |
| Liens (`accent-link #A78BFA`, anneaux) | | carte | 6,1:1 | 4,5 / 3 | OK |
| Anneau focus champ | `accent-primary #8B5CF6` | carte | 3,9:1 | 3 | OK |
| Bordure erreur du champ | `error #EF4444` | carte | 4,4:1 | 3 | OK |
| Coche succès | `success #22C55E` | fond succès (~0,03) | ~6:1 | 3 | OK |
| Texte du bouton blanc | `#7C3AED` (teinte relevée sur capture) | | 5,7:1 | 4,5 | OK [À VÉRIFIER dans `button.tsx`] |
| Bordure du champ au repos | `border #2A2A2A` | carte | 1,15:1 | 3 (1.4.11) | ECHEC |
| Fond du champ vs carte | `#1A1A1A` / `#1F1F1F` | | 1,06:1 | 3 (1.4.11) | ECHEC |

Alerte : si la variante `primary` du bouton utilisait `accent-primary #8B5CF6`, le blanc dessus ferait 4,24:1, sous 4,5 en 14 px semi-gras. Les captures montrent un violet plus foncé (primary) : à confirmer par lecture de `button.tsx`.

## Corrections classées

### Majeurs (non bloquants, à faire avant GO)

**C1. Bordure du champ invisible (WCAG 1.4.11, 1,15:1)**
- Fichier : `apps/web/src/components/profil/question-equipe-card.tsx`, ligne 130 (textarea).
- Actuel : `border border-border` (et `bg-background-light`).
- Proposé : ajouter un token dans `tailwind.config.ts` (`border: { ..., input: "#707070" }`, 3,3:1 sur carte, 3,6:1 sur fond champ) puis `border border-border-input`. Les variantes `aria-[invalid=true]:border-error` et `focus:border-accent-primary` restent inchangées.
- Raccourci sans toucher au config : `border-text-muted/70` (3,6:1).
- Systémique : `Input` du Prénom a le même défaut. Traiter les deux ensemble, sinon deux champs voisins auront des bordures différentes. Signaler à @fullstack.

**C2. Zoom iOS en paysage (>= 640 px)**
- Fichier : même ligne 130.
- Actuel : `text-base ... sm:text-sm`.
- Proposé : supprimer `sm:text-sm` (le champ reste en 16 px partout, lisibilité meilleure pour une saisie longue). Le commentaire de la ligne 129 est à ajuster.

### Mineurs

**C3. Bouton désactivé peu lisible (envoi en cours, plus Premium)**
- Fichier : ligne 147 (`<Button ... disabled={bloque}>`).
- Capture : texte gris-violet sur violet sombre, environ 2:1. Exempté WCAG (désactivé) mais « Envoi en cours » est le seul indicateur visuel d'avancement.
- Proposé : ajouter `disabled:opacity-80` dans `className` et `disabled:cursor-wait` quand `enCours` [À VÉRIFIER : l'opacité de base dans `button.tsx`, probablement `disabled:opacity-50`].

**C4. Robustesse débordement (320 px, e-mail long)**
- Fichier : ligne 143 (`className="mt-2 text-sm text-error-text"`) et ligne 172 (`mt-2 text-xs text-text-muted`).
- Proposé : ajouter `break-words` aux deux.

**C5. Mention et aide en 12 px**
- Fichier : lignes 138 et 172 (`text-xs`).
- Lisible à 5,9:1 mais petit en 360. Optionnel : `text-sm` sur la mention légale (le lien Confidentialité gagne en cible). Non requis pour le GO.

### Observations (pas de correction demandée)

- Focus programmatique après une erreur synchrone (vide, trop long, lignes 61 à 66) : sur mobile, le clavier peut s'ouvrir et recouvrir le message d'erreur sous le champ. À tester sur appareil réel ; si l'erreur est masquée, remonter le message au-dessus du champ ou scroller.
- Largeur : `max-w-3xl` (ligne 113) laisse le champ à ~660 px dans une carte de 1050 px en 1440, alors que l'input du Prénom est pleine largeur. Choix défendable (longueur de ligne), mais le bord droit n'est pas aligné entre les deux cartes voisines.
- Libellé « Ta situation » en `text-text-primary font-medium` alors que le Prénom est en `text-text-secondary`. Plus marqué, cohérent avec l'importance du champ.
- Texte alternatif de la hiérarchie : en plissant les yeux, titre, champ, bouton violet sont les 3 éléments dominants de la carte.

## Handoff

- Note : 8,6 / 10. Verdict : NO-GO v2 (< 9), 0 bloquant.
- Bloquants : aucun.
- Top 3 :
  1. C1 : bordure du champ à 3:1 minimum (token `border-input #707070`, appliqué aussi à `Input`).
  2. C2 : retirer `sm:text-sm` du textarea (zoom iOS en paysage).
  3. C3 : lisibilité du bouton désactivé « Envoi en cours » (+ vérifier le violet du bouton primary dans `button.tsx`).
- Après C1 + C2 : recapturer 360 et 844 paysage (vide, focus champ, trop long) puis contre-lecture ; GO attendu.
