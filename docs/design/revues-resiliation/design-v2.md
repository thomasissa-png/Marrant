# Revue design /resiliation, v2 (s23, @design, 06/11/2026)

Référence : v1 (`design-v1.md`, 8,5). Code relu : `question-motif.tsx`, `barre-confirmation.tsx`, `carte-app-store.tsx`, `recap-contrat.tsx`, `page.tsx`, `confirmee/page.tsx`, `(dashboard)/layout.tsx`, `confidentialite/page.tsx`. Captures lues (Read) : les 40 de `docs/captures/s23-resiliation/` n'ont pas toutes été rouvertes une à une ; lues pour cette v2 : vide PC, vide premier écran mobile, vide tablette 768, envoi PC et mobile, erreur Stripe mobile, hors-ligne mobile, sans client Stripe PC, annuel PC, connexion PC, app-store mobile, sans abonnement PC, déjà résilié mobile, confirmée PC et mobile, confidentialité ancre PC, profil carte abonnement PC (après), pieds de page avant/après PC. Non rouvertes (même gabarit qu'une capture lue du même écran) : variantes mobile de connexion, annuel, sans client Stripe, sans abonnement, tablette confirmée, raisons cochées, erreur Stripe page, pieds de page mobile.

## Note globale : 9,5 / 10

## Vérification de O1 à O4

| # | Résultat | Preuve |
|---|---|---|
| O1 « Autre » pleine largeur PC | FAIT | `question-motif.tsx:18` contient `md:last:col-span-2`. `vide-pc-1440` et `vide-tablette-768` : « Autre » sur 576 px (PC) / 616 px (768), plus de trou. |
| O2 ligne de statut centrée | FAIT | `barre-confirmation.tsx:36` : `mt-1 text-center … sm:text-left`. `envoi-mobile-390` : « Toujours en cours… » centrée sous le lien, alignée avec bouton et lien. `envoi-pc-1440` : à gauche, alignée sur le bouton. |
| O3 bordure outline | FAIT | `carte-app-store.tsx:8` : `cn(buttonVariants(...), "border-border-input w-full sm:w-auto")`, réutilisé par `page.tsx:71,82` et `confirmee/page.tsx:46`. Contour net sur `deja-resilie-mobile`, `confirmee-pc/mobile`, `sans-abonnement-pc`, `app-store-mobile`. |
| O4 respiration page finale | FAIT | `confirmee/page.tsx:42` `mt-2`. `confirmee-pc` : paragraphe et ligne grise nettement séparés. |
| S2 date de fin | FAIT | `recap-contrat.tsx:65` `text-2xl` : la date domine le récap sur toutes les captures (annuel « 20 avril 2027 » compris). |
| Deux textes en couleur principale | FAIT | `recap-contrat.tsx:71-72` `text-text-primary` ; seul le renouvellement annuel reste secondaire (hiérarchie voulue). |

## Tableau des 10 critères Thomas (nouvelles captures comprises)

| # | Critère | Verdict | Constat |
|---|---|---|---|
| 1 | PRO | PASS | Cartes #1F1F1F, rayons identiques, aucun élément décoratif. |
| 2 | BEAU | PASS | Rythme régulier : grille 2 colonnes à lignes de 66/66/48/48 px, « Autre » pleine largeur, espacements constants. |
| 3 | BRAND-ALIGNED | PASS | Violet uniquement sur le bouton principal et le badge. Ton sobre, pas d'alarme (erreur rouge discret). |
| 4 | MÊME IDENTITÉ | PASS | Connexion, profil (carte « Résilier ton contrat » avec bouton contour visible) et pied de page cohérents ; lien « Résilier ton contrat » présent dans le pied avant/après. |
| 5 | PROPRE | FAIL (O5) | `sans-abonnement-pc-1440` : bande noire de ~90 px (y 811 à 900) sous le pied de page, qui n'atteint pas le bas du viewport. Même défaut attendu sur `app-store-pc` et toute page courte. |
| 6 | ALIGNÉ | PASS | Tout sur la colonne 576 px (x 432 à 1008) ; récap à droite, compteur 0/500 à droite, bouton et lien sur la même ligne de base. Tablette 768 : marges 103 px symétriques. |
| 7 | AÉRÉ | PASS | `mt-8` entre blocs, `mt-6` champ libre, `mt-2` finale. Pas de zone tassée. |
| 8 | CONVERSION (une action dominante) | PASS | Seul aplat violet : « Confirmer la résiliation » (« Réessayer » en erreur, jamais grisé). Barre collée mobile visible dès le premier écran (`vide-premier-ecran-mobile`, bouton 48 px, barre ~120 px). |
| 9 | HIÉRARCHIE | PASS | Squint test : H1 blanc, date 24 px bold dans son bloc surélevé, bouton violet. |
| 10 | ACCESSIBLE | PASS | Cases 48 px, coche + bordure + fond (pas la couleur seule), focus ring `accent-link`, erreur rouge clair sur rouge sombre lisible, bordure outline désormais 3,3:1. |

## États : constats captures nouvelles

- Connexion PC : carte centrée, texte « Connecte-toi pour résilier ton contrat. Tu reviens ici juste après. » lisible, bouton principal unique, Google en contour. Conforme au système.
- Sans client Stripe : bandeau d'erreur en tête, « à la fin de ton accès Premium » en `text-lg`, sans ligne de prélèvement, bouton « Réessayer ». Cohérent.
- Annuel PC : 3 lignes d'effet (2 principales, 1 secondaire), pas de troncature, montant aligné.
- Confirmée mobile : pas de défilement horizontal, bouton contour pleine largeur puis lien centré, rythme propre.
- Hors-ligne mobile : bandeau 1 ligne, bouton toujours visible (barre collée).
- Ancre confidentialité : la puce « Résiliation… » arrive à ~96 px sous l'en-tête grâce à `scroll-mt-24` (`confidentialite/page.tsx:96`), non masquée.
- Hors-ligne, erreur et envoi : le violet du bouton est plus sombre sur certaines captures (état actif/survol à la capture), pas un défaut.

## Correction OBLIGATOIRE restante (1)

**O5. Pied de page collé au bas du viewport sur pages courtes** (critère 5, ex-S4 de la v1, désormais bloquant pour 10/10 car visible sur « Rien à résilier » PC et la carte App Store PC)
`apps/web/src/app/(dashboard)/layout.tsx` :
- remplacer le fragment `<>` (ligne 10) par `<div className="flex min-h-dvh flex-col">` et `</>` (ligne 30) par `</div>` ;
- ligne 19, `className="mx-auto max-w-7xl px-4 py-8 md:px-6 xl:px-8"` devient `className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 xl:px-8"` (`w-full` indispensable : dans un parent flex-col, `mx-auto` sans largeur réduirait `main` à son contenu).
Layout partagé : prévenir @qa (snapshots des pages courtes : /connexion exclus car hors groupe, mais profil vide, 404, /retractation). Aucune autre page ne bouge visiblement (pages longues inchangées).

## Souhaitables (non bloquants, aucun ne retire de point)

- S1. Orpheline mobile : « Jusqu'au 1er décembre 2026, tu gardes tout / ton Premium. » (2 mots en ligne 2) ; `recap-contrat.tsx:71`, ajouter `text-pretty` sur la `<div className="mt-4 space-y-1 text-sm">` (ligne 70). Purement typographique.
- S2. Mettre en évidence la puce ciblée de la confidentialité (`confidentialite/page.tsx:96`, ajouter `target:text-text-primary`) pour que le visiteur voie où il est arrivé.
- S3. Valider sur un vrai iPhone à encoche (`viewport-fit=cover` absent, aucun risque, marge basse non adaptée).

## Trajectoire

O1 à O4 et souhaitables appliqués : tout est conforme sauf le pied de page des pages courtes. O5 appliquée, nouvelles captures « sans abonnement PC » et « app-store PC » : 10 / 10.
