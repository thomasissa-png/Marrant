# Relecture design à l'aveugle, s25 navigation v6, tour 4, groupe « quoi-repondre »

Périmètre : `quoi-repondre/` (visiteur, gratuit = aperçu ; en-cours, nouvel = liste) et `fiches/*-fiche-situation-*.png` (en-cours, nouvel).
Captures ouvertes : 375, 1280, 1920 de chaque compte (et fiches). Code vérifié : `components/espace/apercu/apercu-rubrique.tsx`, `app/(dashboard)/mon-espace/quoi-repondre/page.tsx`, `components/espace/carte/styles.ts`.

## Cibles tactiles (vérifiées dans le code)
- Bouton d'offre de l'aperçu : `BOUTON_PRINCIPAL` = `min-h-11` (44 px). OK.
- Lien « Connexion » de l'aperçu : `LIEN` = `min-h-11` (44 px), `min-w-11`. OK malgré son aspect de simple texte.
- « Le carnet du mois » : `BOUTON_SECONDAIRE` `min-h-11`. Puces et réponses de fiche : `puce()` `min-h-11`. OK.
- Aucune faute de cible.

## Grille Design

| Critère | Note | Constat |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Aperçu : H1 centré, sous-titre centré, cartes `rounded-xl` avec filet violet en haut (visiteur et gratuit, 375/1280/1920), langue de l'accueil respectée. Liste (en-cours, nouvel) : lignes denses sans filet, voulu (`CADRE_CARTE` jamais sur les lignes de liste, `styles.ts`). |
| 2 Hiérarchie et lisibilité | 9 | Aperçu : H1, fiche en entier, catalogue, offre : lecture claire. Liste : H1, carnet, filtres, groupes `h2` + effectif. Fiche : titre, scène, « À toi » nets. |
| 3 Mise en page aux largeurs | 9 | Aperçu en colonne `max-w-3xl` centrée à 1280 et 1920 (décision tour 2, pas un défaut). Liste en 2 colonnes pleine coque à 1280 et 1920, aucun débordement. Fiche centrée en colonne de 768 px, sans vide anormal. Piste : groupes de 5, 3, 7 ou 9 fiches laissent une case vide à droite (`en-cours-quoi-repondre-1280.png`, Amis, Famille, Couple, Boulot). |
| 4 Cohérence avec l'espace | 9 | H1 centré des rubriques et de l'aperçu, H1 aligné à gauche sur la fiche (gabarit A avec « Retour : Quoi répondre »), conforme à la spec v6 §4. Cartes et boutons identiques entre comptes. |
| 5 Finition au pixel | 9 | Alignements propres, contrastes lisibles, focus à anneau, bouton « Enregistrer » désactivé sur `nouvel-fiche-situation-*` (état désactivé, exempté). Rien de mesurable en défaut. |

## Grille UX

| Critère | Note | Constat |
|---|---|---|
| 1 Compréhension | 9 | Je sais où je suis (chip « Quoi répondre » allumé et souligné sur tous les comptes, y compris fiche). |
| 2 Action principale | 9 | Aperçu : un seul bouton plein dans la page (offre). Liste : l'action est de choisir une situation ; carnet en secondaire. Fiche : « Oui / À moitié / Rien » puis « Enregistrer ». |
| 3 États vides / nouvel abonné | 9 | `nouvel` : liste complète sans « Fait », fiche avec champ vide, placeholder et compteur 0/200, jamais une page morte. |
| 4 Aperçu Premium | 9 | Une vraie fiche lisible en entier (« Coloc : la poêle »), une seule offre, pas de mur, « Connexion » seulement pour le visiteur (absent chez le gratuit, cohérent). |
| 5 Accessibilité et cohérence entre comptes | 9 | Même bande, même ordre, cadenas visiteur et gratuit, aucun cadenas abonné. |

## Pistes (ne retiennent pas la note)
1. Catalogue de l'aperçu (`CatalogueQuoiRepondre`) : liste de noms gras avec effectifs, sans titre ni lien. Elle peut se lire comme des liens morts. Arbitrage tour 3 documenté (lecture seule, aucun texte nouveau) : on ne le rouvre pas ; un titre éventuel serait un texte nouveau, à valider par Thomas.
2. Cases vides à droite des groupes impairs de la liste à 1280 et 1920 : acceptable en grille 2 colonnes ; un `grid-flow-col` ou une ligne finale étirée serait un plus, non exigé.
3. Aérer un peu l'étiquette « À TOI » du texte qui suit (25 px contre 29 px pour « LA SCÈNE ») : cosmétique.

## Fautes dures
Aucune.

NOTE GLOBALE : 9/10
