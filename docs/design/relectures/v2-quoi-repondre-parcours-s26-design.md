# Relecture à l'aveugle design : Quoi répondre et Parcours (s26, v2)

Lu : brief v7, `typo.ts`, `SEQUENCES.md`, les 16 séquences (toutes les captures, dans l'ordre) et les 8 pleines pages. Aucune spec, aucune mesure. Les tailles de police sont jugées à l'œil (pas de comptage mesuré ici) ; les écarts d'échelle cités sont visuels. Dossier : `docs/captures/s26/v2-quoi-repondre-parcours/`.

## Notes par page (/10)
| Page | Alignements | Vides | Typo | Cohérence | Aplats | Finition | Note |
|---|---|---|---|---|---|---|---|
| Quoi répondre, aperçu (visiteur, gratuit) | 7 | 6 | 8 | 7 | 8 | 7 | **6,5** |
| Quoi répondre, fiche et liste (abonnés) | 8 | 8 | 7 | 8 | 9 | 8 | **7,5** |
| Parcours, liste | 6 | 6 | 8 | 7 | 8 | 6 | **6** |
| Parcours, détail (menu des étapes) | 7 | 6 | 7 | 7 | 8 | 7 | **6,5** |

## Notes par trajet (/10)
| Séquence | Note | Raison principale |
|---|---|---|
| qr-visiteur-375 | 7 | l'offre est en haut et l'aperçu se lit fermé ; le bouton bascule vers la page d'abonnement sans saut |
| qr-visiteur-1280 | 6,5 | pastilles « Pour quoi faire ? » étirées, vide sous le H1, 2 boutons pleins sur la page |
| qr-gratuit-375 | 7 | carte d'offre plus haute que chez le visiteur (D3) |
| qr-gratuit-1280 | 6,5 | idem + D1, D3 |
| qr-abonne-en-cours-375 | 8 | clair ; « Enregistrer » trop pâle (D8) |
| qr-abonne-en-cours-1280 | 7,5 | libellés de section à 3 styles (D7), « À toi » collé |
| qr-nouvel-abonne-375 | 8 | jamais de page morte ; carte « Voir » claire |
| qr-nouvel-abonne-1280 | 7,5 | mêmes défauts que l'abonné avancé |
| pa-visiteur-375 | 7 | CTA « Tester l'étape 1 » en double, sur 2 lignes avec orphelin |
| pa-visiteur-1280 | 6 | colonnes coupées (D1), vide à droite du titre (D4), menu court (D5) |
| pa-gratuit-375 | 7 | identique au visiteur |
| pa-gratuit-1280 | 6 | identique ; capture 2→3 ne montre pas « Passer à l'étape 2 » (D12) |
| pa-abonne-en-cours-375 | 6,5 | sous-étapes soulignées en série (D2), interligne démesuré, « Étape 3 sur 3 » contre « 2 sur 3 étapes » |
| pa-abonne-en-cours-1280 | 6,5 | D1, D2, D6 |
| pa-nouvel-abonne-375 | 6,5 | D2, barres vides quasi invisibles |
| pa-nouvel-abonne-1280 | 6,5 | D1, D2, D6, D9 |

## Défauts et corrections minimales (notes < 9)

**D1. Parcours liste : paragraphes coupés entre colonnes** (`pa-visiteur-1280-pleine`, cartes Storytelling et Boulot ; reprise chez abonné et nouvel). Le texte « Il y a toujours quelqu'un pour dire « et donc ? »… » se casse sur 2 colonnes : « la redemande. » seul en tête de la colonne droite, « risque au boulot… » en haut à droite, puis l'italique « Imagine… » décalé sous eux. Les colonnes n'ont pas la même hauteur. Faute dure d'alignement. Correction : 2 cellules de grille indépendantes (`grid grid-cols-2 gap-x-…`, `items-start`), jamais `columns-2`. Un seul bloc par cellule.

**D2. Soulignements en série** (`pa-abonne-en-cours-1280-3/4`, `-375-2/3`, `pa-nouvel-abonne-1280-2/3/4`, `-375-2/4`). Les sous-étapes 2.1 à 2.5 et 3.1 à 3.5 (numéro et titre) sont toutes soulignées, soit 5 soulignements d'affilée dans une colonne de 360 px, plus « Lire la fiche du conseil » et « Voir la fiche de la vidéo ». Faute dure demandée par le fondateur. Correction : retirer `underline` des lignes du menu (garder pour `hover:`/`focus-visible:`), l'état actif se lit déjà par la barre claire et le gras ; chevron `>` conservé. Garder 1 soulignement pour les liens de contenu isolés.

**D3. Carte d'offre : la hauteur change entre visiteur et gratuit** (`qr-visiteur-1280-1` contre `qr-gratuit-1280-1`). Carte de 202 px (« Connexion ») contre 211 px (2 phrases) : le titre « Voici un exemple… » passe de y 413 à y 422, tout le bloc descend de 9 px. Même chose à 375. Correction : fixer une hauteur minimale commune (`min-h-…` sur la carte) ou un nombre de lignes égal ; le pied de carte occupe la même zone chez les deux.

**D4. Parcours liste : vide en haut à droite** (`pa-visiteur-1280-1`). H1 et paragraphe d'intro occupent 650 px sur 1216, la moitié droite de y 150 à 290 est vide. Correction : intro en `grid lg:grid-cols-[2fr_1fr]` avec à droite la ligne « 5 parcours, 15 à 20 min/semaine » en méta, ou le lien « Quel parcours est fait pour toi ? » remonté ; sinon réduire le `mb` du H1.

**D5. Parcours détail : menu court, vide à gauche** (`pa-visiteur-1280-2/3`, `pa-gratuit-1280-2/3`). La carte menu finit à y 414, sous elle rien sur 500 px à gauche, face à une colonne de lecture longue. Même effet chez le nouvel abonné (menu fini à y 790). Correction : menu en `lg:sticky` avec `self-start` (probablement déjà là, à vérifier) et pied de carte neutre (durée, XP total, retour au parcours), sans second bouton violet.

**D6. Haut des deux colonnes désaligné de 7 px** (`pa-visiteur-1280-2`, `pa-abonne-en-cours-1280-2`, `pa-nouvel-abonne-1280-2` : menu à y 144, carte d'étape à y 137). Absent de la fiche Quoi répondre (153/153). Correction : même `top`/`mt` sur les 2 colonnes (`items-start` + `lg:top-…` identique à la marge du `main`).

**D7. Fiche Quoi répondre : 3 styles pour le même rôle de libellé** (`qr-abonne-en-cours-1280-1`). « La scène » (gris, 600), « Ta réponse d'abord » (blanc, 600), « Prends ton temps » (gris, 400), « À toi » (gris, collé à son texte : 26 px de pas contre 30 px pour « La scène »). Correction : `ETIQUETTE` pour « La scène » et « À toi » avec le même `mb`, `TEXTE_FORT` pour les questions, `META` pour l'aide. Les lignes de 95 caractères (colonne de 770 px) sont trop longues : `max-w-[68ch]` sur les paragraphes.

**D8. « Enregistrer » désactivé trop pâle** (`qr-abonne-en-cours-375-3`, `1280-3`). Texte gris sur gris, bord quasi invisible : contraste sous 3:1 et bouton perdu à côté du compteur. Correction : `disabled:opacity` plus haute ou `text-text-secondary` plein + bordure visible, même hauteur 44 px que « Situation suivante ».

**D9. Parcours liste : barres de progression vides invisibles** (`pa-nouvel-abonne-1280-4/5`). Les segments « 0/4 étapes » sont noirs sur noir ; l'œil voit un trait fantôme. Correction : fond de segment un cran plus clair (`bg-surface-3`) ou bord `border-border`.

**D10. Pages d'abonnement/aperçu : pastilles étirées** (`qr-visiteur-1280-1`, ligne « Pour quoi faire ? », y 859). 5 pastilles réparties en `justify-between` avec des trous de 90 px, hors de la grille des autres lignes. Correction : `flex flex-wrap gap-x-2 gap-y-2` aligné à gauche, comme « Où et avec qui ? ». Aussi : écart de 60 px entre H1 et sous-titre (y 216 à 277) et 70 px avant « Voici un exemple » : ramener à `gap-3` et `mt-8`.

**D11. Tuiles Mensuel/Annuel inégales** (`qr-visiteur-1280-3`). Mensuel 68 px, Annuel 135 px : vide visible sous Mensuel. Correction : `items-stretch` + mêmes lignes de pied (« sans engagement » côté Mensuel).

**D12. Captures de conversion absentes** : `pa-*-1280-3` et `pa-*-375-3` ne montrent pas « Passer à l'étape 2 · 1,99 €/mois » annoncé par SEQUENCES.md (on voit le haut de l'étape 1). Le bas d'étape visiteur n'est pas vérifiable : note maintenue à 6-7 en attendant.

**D13. Emojis de titre** (☕ ⚡ 🌱 📖 💼 sur chaque carte de `/parcours`, + vignettes à lecteur rouge hors périmètre). Cinq couleurs vives dans un écran qui doit garder un seul accent, effet « PowerPoint ». Correction : retirer ou remplacer par un monogramme gris (cercle 40 px, chiffre) ; l'ouverture reste la même hauteur.

**D14. Finition mobile abonné** (`pa-abonne-en-cours-375-3`, `pa-nouvel-abonne-375-3`) : « Envie d'un rappel par e-mail… » à interligne ~34 px contre 24 ailleurs ; émoji non centré sur le titre sur 2 lignes. « Étape 3 sur 3 » (carte du haut) face à « 2 sur 3 étapes » (menu) : même parcours, deux comptes, à relier (piste, UX).

**D15. Capitales hors échelle** : « PRODUIT » et « LÉGAL » dans le pied de page (toutes pleines pages). En-tête et bande validés, pied hors périmètre mais visible : faute dure de casse à corriger (`normal-case`).

## Boutons violets pleins
- Premier écran visiteur/gratuit : 1 seul (carte d'offre) à 1280 comme à 375 ; chez le visiteur de `/parcours`, 1 seul (en-tête « Tout ouvrir »). OK.
- Pleine page `/mon-espace/quoi-repondre` visiteur/gratuit : 2 boutons pleins (carte du haut + « La suite est dans Premium », y 1190). Jamais dans le même écran, donc pas une faute stricte ; piste : passer le second en contour.
- Abonnés : 1 seul par écran (« Reprendre », « Voir », « Commencer l'étape 1 », « Situation suivante » violet après « Fait »). La cloche à pastille n'est pas comptée. OK.
- Saut à noter : « Situation suivante » est blanc contour tant que « Fait » n'est pas posé, puis devient violet plein (`qr-abonne-en-cours-1280-5` contre `-pleine`) : même emplacement, pas de saut de mise en page.

## Points forts (à conserver)
Aperçu fermé lisible (verrous, squelettes), offre en haut, grille fiche/liste de Quoi répondre propre (colonnes alignées à y 153, `Fait` bien rangés), `Retour : Quoi répondre` constant, aucun saut d'en-tête entre comptes sauf D3.

NOTE GLOBALE : 6/10 (minimum des pages : Parcours liste)

Fautes dures :
1. Paragraphes coupés entre colonnes (D1) : carte parcours dans `apps/web/src/` (composant de la liste des parcours).
2. Soulignements en série dans le menu des étapes (D2) : composant du menu d'étapes de `/parcours/[slug]`.
3. Hauts de colonnes décalés de 7 px (D6) : mise en page de `/parcours/[slug]`.
4. Vides visibles : intro Parcours (D4), menu court (D5), tuiles de prix (D11), pastilles étirées (D10).
5. Capitales « PRODUIT » / « LÉGAL » (D15) : composant du pied de page.
6. Emojis colorés en titre de carte, second accent (D13) : liste des parcours.
