# Revue visuelle D11 (s24), @design, 13/11/2026
> Lu : 38 captures (`s24-d2` à `s24-d10`, `s24-import`, `s24-import2`) dont 375, 1280 et 200 % des écrans clés ; les autres sont confirmées par leur seule existence. Code lu : 11 fichiers de l'espace (styles, barre, cloche, en-tête, cap, marches, sommaire, fiches, annonce, `tailwind.config.ts`, `globals.css`). **Pas de Grep ni de shell dans cette session** : le point 3 est un échantillon, pas un balayage. Aucun code modifié.

## 1. Critères par écran (P = pass, F = fail, ? = non jugeable ; ordre : 1 Pro, 2 Beau, 3 Marque, 4 Même identité, 5 Propre, 6 Aligné, 7 Aéré, 8 Une action dominante, 9 Hiérarchie, 10 Accessible)
| Écran (captures lues) | 1-10 | Preuve |
|---|---|---|
| Aujourd'hui jour 1, 375 | PPPPPPPPPP | « Commencer » seul bouton du premier écran ; vide de 180 px dans la carte (étiré voulu, mais l'étalon 0.5 demande « aucun grand vide » : à arbitrer) |
| Aujourd'hui jour 1, 1280 | PPPPPFPPPP | colonne 32 à 800, 480 px vides à droite ; Parcours est centré (256 à 1024) |
| Aujourd'hui, 200 % | PPPPPPPPFP | bas du bouton « Commencer » à y≈410 sur 406 : coupé |
| Parcours cap 2, 375 / 1280 | PPPPPPPPPP / PPPFPFPPPP | 375 : N2 tenu ; 1280 : gabarit centré différent des autres pages |
| Menu Plus 1280, annonce 200 % | PPPPPPPPPP | menu aligné à droite du déclencheur, bouton « Fermer » lisible |
| Parcours détail fiches, 200 % | FPPPFPFPFF | titres écrits une lettre par ligne : illisible (défaut D1) |
| Carte et geste (d5, 375/1280/200 %) | PPPPPPPPPP | coche + contour 2 px sur « Essayé, ça a marché » ; pas de débordement |
| S'entraîner, Mission 1280 | PPPPFPPPPP | chevron de suite affiché à 1280 alors que toutes les entrées tiennent (D3) |
| Mes répliques 375 (liste, confirmer) | PPPPPPPPPP | Supprimer / Annuler de même poids, pas de rouge |
| Mon profil 375 (défaut, erreur) | PPPPPPPPPF | « Réessayer » : bordure #2A2A2A, quasi invisible (D4) |
| Quoi répondre, Bibliothèque 375 | PPPPFPPPPP | chevron collé au « s » de « Mes questions » (D6) |
| Bibliothèque 1280 | PPPPPPPPPP | 22 lignes « Voir » de 44 px, lisibles |
| Fiche situation, jeu, séance 375 | PPPPPPPPPP | fixtures « [fixture de test] » visibles sur bilan et mission (captures de test, à ne jamais livrer) |
| Lettre 375 | PPPPPPFPPP | mur de texte, URL brute non cliquable |
| Mes questions 375 / 200 % | PPPPPPPPPP | cartes radio : cercle + contour 2 px, pas la couleur seule |
| Mes questions 1280 | PPPFPFPPPP | 2 colonnes 32 à 1248 : encore une autre largeur de page (D2) |
| Cloche (panneau 375, 200 %) | PPPPPPPPPP | feuille basse, point violet, focus visible sur la 1re ligne |
| Recherche ouverte 375 | PPPPFPPPPP | un bout de la barre (« us ∨ ») dépasse à droite des suggestions |
| Succès « pret » 375 | PPPPPPPPPP | « Continuer » dominant, renoncer en lien 14/20 |
| 404 / bonus neutre 1280 | PPPFPPPPPP | emoji interdit dans l'espace, sans en-tête ni barre : décision @ux ouverte (étalon v8.1) |
| Abonnement ancien abonné 375 | ????????? ? | capture trop réduite pour juger ; à refaire en vues de 812 px |

## 2. Contrastes calculés (luminance WCAG, sombre seul)
Fonds : page #0D0D0D 0,0040 ; carte #1F1F1F 0,0137 ; élevé #2A2A2A 0,0232.
| Couple | Page | Carte | Élevé | Seuil |
|---|---|---|---|---|
| text-primary #FFF | 19,4 | 16,5 | 14,3 | 4,5 OK |
| text-secondary #B3B3B3 | 9,3 | 7,9 | 6,8 | 4,5 OK |
| text-muted #9A9A9A | 6,9 | 5,9 | 5,1 | 4,5 OK |
| accent-link #A78BFA | 7,1 | 6,1 | 5,3 | 4,5 OK |
| error-text #F87171 | 7,0 | 6,0 | 5,2 | 4,5 OK |
| Bordure border-input #707070 | 3,9 | 3,3 | **2,9** | 3 : échec seulement au survol |
| accent-primary #8B5CF6 (pastilles, soulignement, anneau de focus) | 4,6 | 3,9 | 3,4 | 3 OK |
Blanc sur #7C3AED : 5,7 ; sur #6D28D9 (survol) : 7,1 : OK. Bordure #2A2A2A sur carte : 1,2 (échec si elle seule porte un bouton actif : D4). Logo en dégradé (#7C3AED = 3,4 sur page) : exempté (logotype).

## 3. Couleurs en dur et valeurs arbitraires (échantillon de 11 fichiers)
Aucun hex, rgb ni style en ligne de couleur ; seul `style={{width}}` (barre de progression, valeur calculée). Valeurs hors échelle : `h-1.5 / h-2.5 / h-3.5` (6, 10, 14 px) dans `mission/marches.tsx` ; `rounded-t-2xl` (16 px) dans `cloche.tsx` l.74, hors rayons sm/md/lg ; `px-3` (12 px, écart connu, à entériner) ; `z-[70]`, `max-h-[calc(100dvh-1rem)]`, `pb-[calc(1rem+env(...))]` (nécessaires, documentés).

## 4. `prefers-reduced-motion`
PASS : `globals.css` l.127-134 force animations et transitions à 0,01 ms, itérations à 1, `scroll-behavior: auto`. Reste à vérifier par grep (non fait ici) qu'aucun `scrollIntoView({ behavior: "smooth" })` n'existe : la règle CSS ne couvre pas le JS.

## 5. Défauts et correction minimale
- **D1 (bloquant)** `parcours/lignes-fiches.tsx` l.46-48 : `<li className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1">` et le titre `className="min-w-32 flex-1 ..."` (remplace `min-w-0`).
- **D2** largeurs de page : 800 (Aujourd'hui, Bibliothèque, Lettres), 768 centré (Parcours), 1216 (Mes questions). Un seul conteneur dans `mon-espace/layout.tsx` : `mx-auto max-w-7xl px-3 e360:px-4 md:px-6 xl:px-8` (bord gauche = logo), colonnes de lecture `max-w-3xl` alignées à gauche ; retirer le `mx-auto` de la colonne Parcours.
- **D3** chevron de la barre à 1280 sur S'entraîner et Mission : les entrées y sont plus larges que sur les autres pages (police probablement pas chargée à la mesure). [HYPOTHÈSE] : mesurer après `document.fonts.ready` dans `espace-barre.tsx`.
- **D4** `profil/erreur-profil.tsx` : bouton « Réessayer » en `border-border-input` (aujourd'hui `border-border`).
- **D5** `carte/styles.ts` `BOUTON_SECONDAIRE` et `puce` : ajouter `hover:border-text-muted` (2,9 devient 5,1 au survol).
- **D6** chevron collé au texte à 375 : réserver `pr-8` à la liste des onglets, ou fondu `bg-gradient-to-l from-background` sous le chevron.
- **D7** `marches.tsx` : hauteurs `h-2 h-3 h-4 h-5 h-6` ; `cloche.tsx` l.74 : `rounded-t-lg`.
- **D8** `aujourdhui/premier-pas.tsx` (non relu) : `max-e300:p-3 max-e300:space-y-2` pour remonter le bouton à 200 %.
- **D9** lettre : interligne de paragraphe 16 px (`space-y-4`) et URL en lien (`LIEN`) ; fixtures `[fixture de test]` : s'assurer qu'aucune n'est en base de production.

## 6. Sans capture (à produire par la QA)
Menu de compte (jamais spécifié) ; états de survol et de focus clavier de la barre, du menu Plus et des puces ; recherche ouverte à 200 % et à 1280 avec suggestions ; fiche de bonus réelle (`bonus/[id]`, caps 2 à 4 et 5) à 375, 1280, 200 % ; page succès hors « pret » (vérification, non vérifié, connexion) ; Aujourd'hui « après paiement » à 200 % ; « Ton mois » avec série ; 320 px pour d5 à d10c ; 200 % de `mission-marche-1..5` (d9) ; `d10b`, `d10c` à 1280 et 200 % (non vérifié) ; Abonnement ancien abonné en vues de 812 px ; panneau cloche avec 5 lignes (défilement interne).
