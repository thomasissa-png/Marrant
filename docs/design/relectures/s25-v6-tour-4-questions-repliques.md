# Relecture design à l'aveugle, s25 navigation v6, tour 4 : questions et répliques

Périmètre : `/mon-espace/questions` et `/mon-espace/repliques`, 4 comptes (visiteur, gratuit, en-cours, nouvel). Captures lues : `docs/captures/s25/v6-tour-4/{questions,repliques}/`. Ouvertes : 375, 1280, 1920 pour les 4 comptes (sauf quelques doublons visiteur/gratuit quasi identiques lus à une seule largeur). Les 768 et 1456 n'ont pas été ouvertes : aucun doute apparent sur les 3 autres largeurs, la mise en page ne change qu'au `lg` (1024).
Code vérifié : `questions/page.tsx`, `repliques/page.tsx`, `mes-questions.tsx`, `liste-repliques.tsx`, `apercu/exemple.tsx`, `tailwind.config.ts`.

## Ce que je vois

- Visiteur et gratuit : page d'aperçu, titre centré, sous-titre, une carte à filet violet (une seule colonne de lecture 768 px centrée à 1280 et 1920), puis un bloc d'offre avec un seul bouton plein (+ lien Connexion pour le visiteur seulement). Questions : exemples réels déjà validés (état « Mes envois » vide). Répliques : une vraie fiche (« Coloc : la poêle »), consigne « À toi », champ « Ma réplique à moi » en lecture seule.
- Abonné en cours, questions : deux colonnes dès 1024 (formulaire 5/7, « Mes envois » 7/7), colonne unique à 375. Radios en cartes `rounded-xl`, carte sélectionnée à bord violet, bouton plein unique « Envoyer à l'équipe ». Envoi existant : pastille, date, détail « Répondu le 15 novembre », « Retirer de mon historique ».
- Abonné en cours, répliques : une réplique, carte centrée en colonne de lecture, lien de fiche, « Modifier » et « Supprimer » en boutons secondaires.
- Nouvel : questions = formulaire + exemples en « Mes envois » ; répliques = état vide avec bouton plein « Écrire ma première réplique » (mène à Quoi répondre).
- Pas de débordement horizontal, pas de colonne collée à gauche, pas de vide à droite à 1280 et 1920 sur les pages à une colonne (colonne centrée, titre centré comme l'accueil).

## Notes

### Design

| Critère | Note | Justification |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Titre centré, cartes `rounded-xl` à filet violet en haut, fond `#0D0D0D`/`#1F1F1F`, bouton violet plein. Seul écart à l'étalon : aucune pastille ni titre de section centré (les H2 « Écrire à l'équipe » et « Mes envois » sont calés à gauche). Cohérent avec les autres pages de l'espace, donc piste, pas faute. |
| 2 Hiérarchie, lisibilité | 9 | Un H1 net, une action pleine par page. Petits textes : « Évite les noms : décris la scène » en 12 px `text-muted` (#9A9A9A sur #1F1F1F, AA tenu mais petit), `en-cours-questions-1280.png`. |
| 3 Mise en page 5 largeurs | 9 | Aucun débordement ni colonne collée. Réserve : questions abonné à 1280 et 1920, la colonne « Mes envois » (une seule carte de 190 px, `grid items-start`) laisse ~500 px de vide sous elle à droite, face au formulaire de 690 px (`en-cours-questions-1280.png`, `en-cours-questions-1920.png`, aussi `nouvel-*`). C'est un état à peu d'envois, le vide se comble avec l'usage. Piste. |
| 4 Cohérence avec l'espace | 9 | Même coque, même `EN_TETE_CENTRE`, mêmes cartes que les autres pages. Répliques : l'écart sous le lien de titre (~50 px entre « Coloc : la poêle » et la citation, contre ~28 px entre citation et boutons, `en-cours-repliques-1280.png`) vient du `min-h-11` du lien plus `gap`, rythme un peu inégal. Piste. |
| 5 Finition au pixel | 9 | Alignements propres, bordures de champs `#707070` (3,3:1 et plus, WCAG 1.4.11 tenu d'après le thème), boutons « Modifier », « Supprimer », « Retirer » visuellement 44 px de haut (capture ; `min-h-11` côté code pour le lien de titre). Guillemets de « Par exemple, pour « Une question » » très serrés visuellement (espace fine), lisible. |

### UX

| Critère | Note | Justification |
|---|---|---|
| 1 Compréhension | 10 | « Mes questions », « Mes répliques » et la rubrique « … » allumée disent où je suis ; sous-titre d'aperçu clair. |
| 2 Action principale unique | 9 | Un seul bouton plein par page de contenu (Envoyer, Écrire ma première réplique). Aperçu : le bouton d'offre du bloc s'ajoute au bouton d'en-tête existant, c'est la règle du brief nav v6 (bouton d'en-tête existant), pas une faute. Répliques abonné avec contenu : aucune action « écrire une autre réplique », seulement Modifier/Supprimer. Piste : un lien discret vers Quoi répondre (texte à valider par Thomas). |
| 3 États vides, nouvel abonné | 10 | Questions : exemples validés sous « Mes envois ». Répliques : message sans reproche + bouton plein vers une destination utile. Jamais une page morte. |
| 4 Aperçu Premium | 9 | Valeur visible (vraie fiche, vrais exemples), une seule offre, aucun mur, pas de redirection. Réserve : sur Répliques, « Ma réplique à moi » est un `<p>` stylé comme un champ de saisie (`exemple.tsx`, `rounded-md border border-border-input`), donc l'œil le lit comme un champ cliquable alors qu'il est inerte. Piste : ajouter la mention de lecture seule ou un style de champ désactivé (texte à valider par Thomas). |
| 5 Accessibilité, cohérence entre comptes | 9 | Libellés explicites, cartes radio avec état visible sans la couleur seule (disque plein + bord), même gabarit entre comptes. Je n'ai pas pu vérifier le focus à l'écran (captures statiques). |

## Fautes dures

Aucune.

## Pistes (ne retiennent pas la note)

1. Questions abonné, 1280+ : le vide sous « Mes envois ». Pour 10 : `apps/web/src/components/espace/questions/mes-questions.tsx`, garder `items-start` mais rendre « Mes envois » collant (`lg:sticky lg:top-[7.5rem]`, 114 px de bloc fixe + marge) ou le laisser tel quel tant que l'historique est court.
2. Répliques abonné : rythme sous le lien de titre, `liste-repliques.tsx` ligne 98 (`min-h-11` sur le lien) : réduire le `gap` entre titre et citation à `gap-1` pour rapprocher.
3. Répliques, faux champ de l'aperçu : `apercu/exemple.tsx` ligne 93, passer à un style désactivé ou ajouter `aria-disabled` + indice (texte à valider par Thomas).
4. Répliques abonné avec contenu : pas d'action d'ajout (lien vers Quoi répondre, texte à valider par Thomas).
5. Hors périmètre signalé : la bande affiche un cadenas sur « Favoris » pour le visiteur et le gratuit (`visiteur-questions-1280.png`) alors que la spec nav v6 §2 dit « groupes 2 et 3 ouverts ». Groupe dédié.

NOTE GLOBALE : 9/10
