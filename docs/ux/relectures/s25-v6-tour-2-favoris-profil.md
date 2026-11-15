# Relecture UX à l'aveugle, v6 tour 2 : favoris et profil

Périmètre : `/favoris` (visiteur, gratuit = aperçu ; en-cours, nouvel = abonné) et `/profil` (gratuit, en-cours, nouvel), 5 largeurs, captures `docs/captures/s25/v6-tour-2/{favoris,profil}/`. Vues ouvertes : favoris 375/1280 (4 comptes), 768 (gratuit, en-cours) ; profil 1280 (3 comptes), 375 (gratuit, en-cours), 768 (nouvel), 1920 (en-cours). 1456 et 1920 des autres comptes non ouvertes : le plafond `max-w-7xl` rend 1280, 1456 et 1920 identiques (voulu, navigation v6 §1).
Contexte connu non compté : carte Abonnement sans bouton chez en-cours et nouvel (données de test hors Stripe).

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité accueil | 9 |
| Design 2 hiérarchie, lisibilité | 9 |
| Design 3 mise en page 5 largeurs | 7 |
| Design 4 cohérence espace | 8 |
| Design 5 finition | 9 |
| UX 1 compréhension | 9 |
| UX 2 action principale unique | 8 |
| UX 3 états vides, nouvel abonné | 9 |
| UX 4 aperçu Premium | 8 |
| UX 5 accessibilité, cohérence comptes | 8 |
| **Globale (minimum)** | **7/10** |

## Fautes dures

**FD1. Favoris, aperçu (visiteur et gratuit) : un grand vide sous la carte de gauche, offre perdue en 3e colonne.**
- Capture : `favoris/visiteur-favoris-1280.png`, `gratuit-favoris-1280.png` (idem 1456, 1920), `gratuit-favoris-768.png`. La carte « vanne » (4 lignes de contenu) est étirée à la hauteur de la fiche conseil : environ 1000 px de noir à 1280, 850 px à 768. À 1280+ la 3e colonne ne porte que le bloc d'offre (≈ 90 px de haut) puis du vide. La page paraît cassée, et le seul bouton plein d'offre est relégué en bout de grille (à 375 et 768 il arrive tout en bas, après la longue fiche).
- Correction : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx`, conteneur de la grille `items-start` (et non stretch) ; bloc d'offre en `col-span-full` juste sous le sous-titre (ou carte offre `lg:col-span-1` en tête de colonne, `lg:sticky lg:top-[130px]`), cartes en dessous. Ce qui ferait 10 : aucune carte étirée, offre visible sans défiler aux 5 largeurs.

**FD2. Profil, nouvel abonné : aucune action évidente en tête, et l'ordre des cartes diffère selon le compte.**
- Captures : `profil/nouvel-profil-1280.png` : « Ton cap » 0 XP, « Statistiques » 0 0 0 0, puis « Prochaine étape » seulement à 740 px, après « Rappel de parcours » (un réglage sans parcours à rappeler). `gratuit-profil-1280.png` met « Prochaine étape » en premier ; `en-cours` met « Reprendre ton parcours » en premier. Le nouvel abonné, le plus à guider (page d'états vides), est le seul à voir quatre blocs de zéros avant sa prochaine action. Seul bouton plein du haut : « Découvrir les parcours » à 530 px, dans une carte.
- Correction : `apps/web/src/components/profil/profil-dashboard.tsx` : rendre « Prochaine étape » en tête pour le nouvel abonné (même place que chez le gratuit), « Rappel de parcours » masqué ou replié tant qu'il n'y a aucun parcours commencé. Ce qui ferait 10 : une action primaire dans le premier écran pour chaque compte, ordre des cartes expliqué par l'état et non par le compte.

## Pistes (ne retiennent pas seules, mais à traiter pour 10)

- P1 Cibles tactiles : onglets « Tout / Vannes / Conseils / Vidéos » (pastilles de ≈ 32 px de haut, `en-cours-favoris-1280.png`) et bouton Partager des cartes (cercle ≈ 32 px). Zone cliquable réelle non visible sur capture : vérifier 44 px (`favoris-list.tsx`, `min-h-11`, ou zone étendue par `before:` absolu). Si la zone est de 32 px, ça devient faute dure (grille 44 px).
- P2 Profil, carte « Ta question à l'équipe : écris-la dans Mes questions » (`en-cours-profil-1280.png`, y 1057-1130) : sans titre ni filet dégradé, avec 70 px de hauteur pour une ligne, elle rompt le système de cartes. Correction : lui donner filet et titre (« Une question ? » [à valider par Thomas]) ou la réduire à une ligne de `text-sm` dans la carte Abonnement ; `question-equipe-card.tsx`.
- P3 Profil à 1280+ : 9 cartes pleine largeur de 1216 px portant du texte de 600 px : vide à droite dans Rappel, Abonnement, Lettre, Prénom, Supprimer. Piste : grille `lg:grid-cols-2` pour les réglages (Rappel | Lettre, Abonnement | Prénom), `profil-dashboard.tsx`. Non fautif seul : cohérent avec les autres pages de l'espace.
- P4 Profil nouvel à 768 : « Prochaine étape » en 2 + 1 (carte orpheline à gauche, `nouvel-profil-768.png`). Passer à `md:grid-cols-3` ou `sm:grid-cols-1`.
- P5 Textes légaux de la carte Lettre et « Renoncer au contrat ici » ≈ 12 px gris sur fond sombre : lisibles mais petits ; viser `text-sm` et `text-text-secondary`. Le lien « Renoncer au contrat ici » est un lien souligné minuscule : cible bien en dessous de 44 px (`abonnement-card.tsx`).
- P6 Aperçu Favoris : ne montre pas ce qu'est un favori (ni étoile, ni « Retirer », ni onglets). Il montre une vanne et un conseil en lecture seule. La valeur de la rubrique est suggérée, pas démontrée. Proposition à valider par Thomas : afficher la vanne avec une étoile pleine « Sauvegardée » ; ne retient pas la note.
- P7 Cartes de favoris étirées (`en-cours-favoris-1280.png`) : les vannes de 4 lignes ont 200 px de blanc bas, comme la FD1 en plus léger : `items-start` sur la grille de `favoris-list.tsx`.
- P8 États favoris abonné : onglet « Vidéos » coupé en « Vic » avec chevron à 375 (`en-cours-favoris-375.png`) : acceptable (affordance présente).

## Ce qui est conforme

- Langue visuelle : cartes `rounded-xl` à filet violet, titres Plus Jakarta, H1 grand, sous-titre gris, rythme aéré, cohérents avec l'accueil.
- États vides favoris (`nouvel-favoris-1280.png`, 375) : étoile, titre, phrase, un seul bouton « Explorer les vannes ». Pas de page morte.
- Aperçu Favoris : H1 = libellé de la rubrique, sous-titre d'aperçu, chip allumé avec cadenas, une fiche lisible en entier, un seul bouton plein d'offre (prix lu en config), lien Connexion pour le visiteur seulement, aucun mur ni fenêtre surgissante.
- Profil gratuit : l'offre « S'abonner · 1,99 €/mois » est unique et visible sans défiler ; Supprimer compte sans l'avertissement de résiliation (inutile pour lui) ; avertissement ambré lisible pour l'abonné.
- Aucun débordement horizontal aux 5 largeurs vues ; contenu centré à 1920 par le plafond de coque.
- Aucun nouveau texte réécrit ici ; propositions de texte marquées « à valider par Thomas ».

## Verdict

NO-GO à 9/10 : 2 fautes dures (FD1, FD2). FD1 est un correctif de 2 classes de grille ; FD2 un réordonnancement conditionnel.

NOTE GLOBALE : 7/10
