# Relecture UX à l'aveugle, v6 tour 3 : groupe « aujourdhui » (/mon-espace)

Captures lues : 20 PNG de `docs/captures/s25/v6-tour-3/aujourdhui/` (visiteur, gratuit, en-cours, nouvel x 375, 768, 1280, 1456, 1920) + INDEX.md. J'ai ouvert en détail 375, 768 et 1280 pour chaque compte, 1920 pour en-cours ; 1456 et 1920 des autres comptes sont identiques à 1280 par construction (coque `max-w-7xl`, mêmes hauteurs dans l'INDEX : 1275 / 1675 / 1305 px). Étalon comparé : `etalon-accueil/visiteur-accueil-1280.png`.

## Notes

| Critère | Note | Justification courte |
|---|---|---|
| D1 Langue visuelle de l'accueil | 9 | Cartes `rounded-xl` à filet violet en haut, boutons violets, rythme aéré : conforme. H1 et « Contenu du jour » alignés à gauche chez l'abonné alors que l'étalon centre ses titres (l'aperçu, lui, est centré). |
| D2 Hiérarchie et lisibilité | 9 | H1, carte héros, puis grille : lecture nette. Dans la carte « Si tu as 5 minutes », une phrase explicative de 14 px passe AU-DESSUS du titre (`en-cours-1280` y 304 puis 345). |
| D3 Mise en page 5 largeurs | 9 | Aucun débordement, aucun vide à droite, aucune colonne collée à gauche (1280, 1456, 1920 centrés dans 1216). Aperçu : colonne de 768 centrée, voulue. Petits vides internes : carte Mission (en-cours-1280 y 610 à 748, 70 px vides) et cartes Conseil/Vanne. |
| D4 Cohérence espace | 9 | Mêmes cartes, mêmes titres, même bande sur les 4 comptes. |
| D5 Finition | 9 | Cibles vérifiées visuellement : « Les cartes du jour » 44 px, « Une autre » 44, pastilles 44, Oui/À moitié/Rien 44. Liens en ligne (« Le décalage de registre », titre vidéo) ~24 px de haut : conforme WCAG 2.2 AA (24) mais pas 44. Textes 12 px gris (« Mission · Marche 2 », « Facultative »). |
| U1 Compréhension | 10 | Abonné : H1 + « 4 cartes cette semaine » + action. Nouvel : « Ton premier pas ». Aperçu : H1, sous-titre, exemple. Je sais où je suis en 3 s. |
| U2 Action principale unique | 9 | En-cours : un seul bouton plein dans la page (« Les cartes du jour »). Nouvel : « Commencer ». Aperçu : un seul bouton plein dans le bloc offre. Réserve : voir A1. |
| U3 États vides / nouvel abonné | 10 | `nouvel-*` n'est jamais une page morte : un seul pas à faire (« Commencer », 5 min), les blocs Mission et Où veux-tu être plus à l'aise ne s'affichent pas à vide, le contenu du jour est là. |
| U4 Aperçu Premium | 9 | Une vraie fiche lisible en entier, une offre, pas de mur ni de pop-up, Connexion seulement pour le visiteur (absent chez le gratuit : correct). Voir A1 et A2. |
| U5 Accessibilité visible / cohérence | 9 | Bande identique (cadenas groupe 1 visiteur/gratuit, aucun chez abonné), chip actif avec soulignement violet, focus non testable sur capture. Cloche avec pastille chez en-cours, sans chez nouvel : cohérent. |

**Globale = minimum = 9/10. Aucune faute dure.** La barre du 15/11 (9/10 sans faute dure) est atteinte.

## Pistes (ne bloquent pas)

- **A1 (U2/U4)** : dans l'aperçu, la fiche expose Oui / À moitié / Rien comme de vrais boutons (visiteur et gratuit, 1280 y 570 à 614), au-dessus du bouton Premium. La capture ne dit pas ce qu'un clic fait. S'ils ne sont pas inertes et explicites, c'est une seconde action concurrente ; s'ils sont inertes, rien ne le signale. Correction codable : lecture seule (`aria-disabled="true"`, `tabIndex={-1}`, `opacity` inchangée) ou clic qui scrolle vers le bloc offre, dans le composant d'aperçu d'Aujourd'hui. Ferait 10 en U2/U4.
- **A2 (U4)** : l'en-tête affiche déjà « Premium · 1,99 €/mois » en plein, et le bloc offre en répète un second (visiteur et gratuit, `visiteur-1280`). C'est la spec (bouton d'offre dans l'en-tête, un seul bouton plein par page dans le bloc), donc non retenu ; à trancher par Thomas si « un seul » doit compter l'en-tête.
- **D1** : centrer le H1 et « Contenu du jour » chez l'abonné rapprocherait de l'étalon, mais le gabarit A de la v5 (liste/tableau de bord) n'est pas rediscuté ici. Aucune modification proposée sans validation.
- **D2** : passer la phrase « La bonne réponse qui te vient en quittant la pièce... » sous le titre « Si tu as 5 minutes » (`text-sm text-text-secondary`, après le `h2`). Le texte reste identique, seul l'ordre change.
- **D3** : cartes Mission, Conseil du jour : `self-start` au lieu de l'étirement de grille supprimerait les 70 px vides, au prix de hauteurs inégales ; à arbitrer, sans gain évident.
- **D5** : liens en ligne : ajouter `inline-flex min-h-11 items-center` sur « Le décalage de registre » et le titre de la vidéo pour une cible de 44 px. Textes 12 px (`text-xs`) : vérifier le contraste réel du gris (non mesurable sur capture).
- **Cohérence des chiffres** : « 4 cartes cette semaine » (en-tête) et « 1 situation nouvelle, 1 carte à revoir » (carte héros) : deux périmètres différents (semaine / aujourd'hui) non signalés. Texte validé : à signaler à Thomas, pas de réécriture.
- **Vidéo du jour** : la vignette est un dégradé violet avec bouton lecture, sans image (en-cours-1280, 768 : grand rectangle vide de 540 x 300 px). À vérifier si c'est l'absence d'image dans l'environnement de capture ou le rendu réel ; si réel, c'est un vide visuel.

## Vérifications faites sans faute

Aucun tiret cadratin dans l'interface, aucun débordement horizontal aux 5 largeurs, bande tronquée mais défilable (fondu à droite) à 375 et 768, bouton « Premium » abrégé à 375 avec menu, prix lisible, cadenas visibles chez visiteur et gratuit uniquement, une seule offre, aucun compte à rebours ni pop-up.
