# Relecture UX à l'aveugle, s25 navigation v6, tour 4, groupe lettre-carnet

Captures : `docs/captures/s25/v6-tour-4/{lettre,carnet,dediees}/`. Ouvertes : lettre (4 comptes en 375, 768 pour visiteur et abonné, 1280, 1920), carnet (visiteur et gratuit en 375, 1280, 1920 ; en-cours et nouvel en 375 tranches 1 et 18, 768, 1280 tranches 1, 2, 3, 7, 13), dédiées `mon-espace-lettres` (375 et 1280, visiteur et gratuit). Code vérifié : `carnet-page.tsx`, `lettres-abonne-cartes.tsx`, `archive-lettres.tsx`, `lettre-inscription.tsx`. Rien lu des relectures existantes.

Limite : les captures pleine page à 375 et 1920 des pages très longues (carnet abonné, 35 000 px) sont illisibles une fois réduites ; je me suis appuyé sur les tranches 2 000 px.

## Constats par page

### /lettre visiteur et inscrit gratuit (formulaire + dernier numéro)
- Colonne centrée `max-w-3xl` à 1280, 1456 et 1920 : aucun vide à droite, aucune colonne collée. H1 centré, carte de formulaire à filet violet, carte du numéro à filet : langue de l'accueil respectée.
- Un seul bouton plein dans la page (« Envoie-moi la lettre »). Case de consentement : case 24 px dans un label `min-h-11`, champ `h-12`, lien Confidentialité avec zone tactile 44 px par pseudo-élément : cibles conformes.
- E-mail pré-rempli pour l'inscrit gratuit (`gratuit-lettre-1280.png`), case non cochée (consentement explicite) : cohérent avec « zéro duplication ».
- À 375 (`dediees/visiteur-mon-espace-lettres-375x812.png`) : formulaire entier visible au premier écran, titre sur 2 lignes, pas de débordement.
- Aperçu Premium : le numéro réel sert d'aperçu, le PS mène à /abonnement par un lien de texte, pas de mur ni de second bouton plein.

### /lettre abonné (en-cours et nouvel) : archive en cartes
- H1 « La lettre » centré, deux cartes à filet avec chevron, 2 colonnes dès 768, 1 colonne à 375, colonne centrée à 1280 et 1920. Plus de hauteur minimale (le pied de page suit sans grand vide).
- Cibles : `min-h-14` (56 px). Les deux comptes ont le même rendu (la seule différence est la pastille de la cloche) : cohérence entre comptes.
- Pas une page morte : chaque carte mène à la lettre. Piste (non retenue) : aucune phrase d'orientation sous le H1 ; ce serait un texte nouveau, à valider par Thomas.

### /mon-espace/lettres et dédiées
Redirection vers /lettre confirmée dans les 4 comptes : même rendu que /lettre, bande allumée sur « La lettre ».

### /carnet visiteur et inscrit gratuit
- En-tête centré (sur-titre au-dessus du H1), fiche offerte lisible en entier, puis bloc d'appel à filet avec un seul bouton plein (« Ouvrir tout le carnet · 1,99 €/mois »), puis « Au programme » (3 titres verrouillés, « Et 26 autres répliques »). Valeur visible, une offre, pas de mur.
- Colonne 768 px centrée à 1280 et 1920, rien de collé ni de vide notable. À 375, la fiche et le bloc d'appel tiennent sans débordement.
- Détail de finition : la ligne de réassurance du bloc d'appel est en blanc plein alors que le texte voisin est en gris secondaire (`carnet-visiteur-1280`). Piste.

### /carnet abonné (en-cours et nouvel)
- Sommaire en tête (30 titres soulignés, 2 colonnes dès `sm`, cibles `min-h-11`), puis 30 fiches à filet, puis « Les carnets précédents ». Les fiches sont lisibles, hiérarchie constante (On te dit / Tu réponds / Pourquoi ça marche / Si ça se tend / À toi de jouer).
- Colonne centrée aux 5 largeurs, aucun débordement, aucun texte coupé dans les tranches vues.
- Les deux comptes (en-cours et nouvel) voient exactement la même page : ce n'est pas une page vide, le contenu du mois est entier.
- Pistes : (1) page de 25 000 px (35 000 à 375) sans retour au sommaire depuis une fiche ; (2) à 375 le sommaire occupe 1 300 px avant la première fiche ; (3) aucune notion de « où j'en suis ». Ces trois points relèvent du jugement, le sommaire existant est conforme à la décision du tour 1 (point 11) : ils ne retiennent pas la note.

## Notes

| Critère | Note | Défaut / ce qui ferait 10 |
|---|---|---|
| Design 1 fidélité accueil | 10 | |
| Design 2 hiérarchie | 10 | |
| Design 3 mise en page 5 largeurs | 10 | |
| Design 4 cohérence espace | 10 | |
| Design 5 finition | 9 | Réassurance du bloc d'appel carnet en blanc plein (`carnet-visiteur-1280.png`) : `Reassurance` dans `components/ui/reassurance.tsx`, passer en `text-text-secondary` pour s'aligner sur le paragraphe voisin. |
| UX 1 compréhension | 10 | |
| UX 2 action principale | 9 | Carnet abonné : aucune action guidée, 30 fiches de même poids. 10 = bouton « Retour au sommaire » en fin de fiche (`components/carnet/carnet-fiche-card.tsx`, lien `#carnet-titre`, `min-h-11`), libellé à valider par Thomas. |
| UX 3 états vides / nouvel abonné | 10 | Pas de page morte constatée. |
| UX 4 aperçu Premium | 10 | |
| UX 5 accessibilité et cohérence | 10 | Cibles vérifiées dans le code (`min-h-11`, `min-h-14`, `h-12`, case 24 px dans label 44 px). |

Aucune faute dure.

NOTE GLOBALE : 9/10

Fautes dures : aucune.
