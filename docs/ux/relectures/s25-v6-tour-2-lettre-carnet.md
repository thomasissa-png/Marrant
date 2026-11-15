# Relecture UX à l'aveugle, v6 tour 2 : groupe lettre-carnet

Périmètre : `/lettre`, `/mon-espace/lettres` (redirige), `/carnet`. Comptes visiteur, gratuit, en-cours, nouvel. Captures `docs/captures/s25/v6-tour-2/{lettre,carnet}/`.

## Couverture réelle (honnêteté)
- Ouvertes et analysées : lettre visiteur 1280 et 375 ; lettre gratuit 1280 ; lettres-espace visiteur et gratuit 1280 ; lettre en-cours 375, 768, 1280, 1920 ; lettre nouvel 1280 ; carnet visiteur 1280 ; carnet gratuit 375 ; carnet en-cours et nouvel 1280 et 375 (pleine page).
- Non ouvertes une à une : les autres largeurs. Je m'appuie sur `INDEX.md` (hauteurs identiques entre 1280, 1456 et 1920 = même gabarit, coque plafonnée).
- Limite : `carnet` en-cours et nouvel font 25 821 px (1280) et 35 368 px (375). L'outil les réduit à 99 px de large : je vois la structure (sommaire à deux colonnes en haut, puis 30 cartes situation empilées, filet violet) mais pas le détail ni les alignements. Je ne note pas ce que je ne vois pas. À re-capturer par tranches de 2 000 px pour une vraie relecture.

## Constats par page

### /lettre visiteur et gratuit (page d'inscription à la lettre)
- 1280 : titre centré, sous-titre, carte formulaire à filet dégradé violet, case de consentement non cochée (correct), un seul bouton plein. Compréhension en 3 secondes : OK. Gratuit : e-mail pré-rempli (zéro duplication), bien.
- Dessous, « À quoi ça ressemble : le dernier numéro » : le mail complet en texte brut sur 1 700 px. Les intertitres (« La sûre », « Comment choisir », « À essayer cette semaine ») ont le même poids que le corps, les liens s'affichent en URL brute avec `utm_source=...`. Lisible mais mur de texte, loin des cartes et rythme de l'accueil. Texte validé : non touché, seule la mise en forme est en cause.
- 375 : `visiteur-lettre-375.png` et `gratuit-lettre-375.png` font 448 px de large pour un viewport de 375 (INDEX : « DÉBORDEMENT HORIZONTAL »). Cause visible : les URL longues sans coupure du bloc d'aperçu. La page défile latéralement, la bande des rubriques et l'en-tête restent à 375.
- Bande : « La lettre » allumée avec soulignement, bien. Pas de cadenas dessus (gratuit pour tous), conforme.

### /lettre abonné (en-cours, nouvel)
- Titre « La lettre » + deux cartes `rounded-xl` à filet violet (12 novembre, 5 novembre). Même rendu pour en-cours et nouvel : jamais une page morte, l'archive est là.
- 1280, 1456, 1920 : les deux cartes occupent le premier tiers et demi de la coque, tout le tiers droit est vide, puis 110 px de noir avant le pied de page. Titre aligné à gauche, sans sous-titre ni explication du rythme (jeudi). Aucune carte n'est désignée comme la dernière à lire.
- 768 : deux cartes qui remplissent la largeur, correct. 375 : cartes empilées pleine largeur, cible de 70 px, correct.

### /mon-espace/lettres
- Écart avec le contexte annoncé (« redirige vers /lettre ») : le visiteur arrive sur la connexion (`visiteur-lettres-espace-*`) ; l'inscrit gratuit arrive sur `/abonnement` (pitch complet, sans bande des rubriques, `gratuit-lettres-espace-*`, 2 620 px) ; l'abonné voit bien `/lettre`. À vérifier côté routage : la navigation v6 dit que cette adresse allume « La lettre » et que l'aperçu n'est jamais une redirection. Je le classe en piste (le contenu d'abonnement est cohérent et à une offre), pas en faute dure, faute de spec explicite pour ce cas.

### /carnet visiteur et gratuit (aperçu Premium)
- 1280 : colonne centrée `max-w-3xl`, sur-titre violet, H1, une fiche réelle lue en entier (« Situation 10 · offerte », On te dit / Tu réponds / Pourquoi ça marche / Si ça se tend / À toi de jouer), puis bloc offre unique (« Il en reste 29 », bouton `Ouvrir tout le carnet · 1,99 €/mois`, garantie 14 jours), puis « Au programme » avec 3 situations cadenassées et « Et 26 autres répliques ». Valeur visible, une offre, pas de mur : conforme à la nav v6 §2.
- Gratuit identique au visiteur (le bouton d'en-tête passe en « Premium · 1,99 €/mois », pas de Connexion). 375 : tout s'empile proprement, bouton plein largeur, aucun débordement.
- Le chip Carnet n'a pas de cadenas alors que Favoris en a un : conforme à la nav v6 (Carnet est dans « Raccourcis » sans cadenas, il a une situation gratuite).

### /carnet abonné (en-cours, nouvel)
- Même page pour les deux : sommaire à deux colonnes puis 30 situations complètes empilées. Pas de page vide, pas de cadenas. Je ne peux pas juger le détail (voir Limite). Piste : un parcours de 25 800 px (35 000 px à 375) mérite un retour au sommaire visible, à vérifier à la prochaine capture.

## Notes (chaque critère, puis min = globale)

### Design
| # | Note | Justification |
|---|---|---|
| 1 Fidélité accueil | 8 | Carnet visiteur très fidèle (filet, cartes, rythme). Aperçu du mail de /lettre en texte brut hors langue de l'accueil. Archive abonné correcte mais nue. |
| 2 Hiérarchie, lisibilité | 8 | Carnet : excellente. Aperçu du mail : intertitres sans poids, URL brutes avec paramètres UTM. |
| 3 Mise en page 5 largeurs | 6 | Faute dure : débordement horizontal à 375 sur /lettre (448 px). Faute dure : vide à droite à 1280+ sur l'archive (2 cartes dans une grille à 3 colonnes). |
| 4 Cohérence espace | 9 | Cartes et titres alignés avec le reste de l'espace. |
| 5 Finition | 8 | Rien de visiblement faux hors débordement ; alignement des cartes d'archive à 1280 non justifié par un titre centré ni un sous-titre. |

### UX
| # | Note | Justification |
|---|---|---|
| 1 Compréhension | 9 | Carnet et formulaire clairs. Archive : titre seul, aucune phrase sur le rythme. |
| 2 Action principale | 8 | Une seule offre au carnet. Archive : deux cartes égales, aucune « dernière lettre » mise en avant. |
| 3 Vide, nouvel abonné | 9 | Jamais de page morte (archive et carnet complets pour nouvel). |
| 4 Aperçu Premium | 9 | Carnet : valeur visible, une offre, pas de mur. Redirections de /mon-espace/lettres à clarifier (piste). |
| 5 Accessibilité, cohérence | 6 | Le défilement latéral à 375 casse la lecture et le zoom ; cohérence entre comptes bonne. |

## Fautes dures
1. Débordement horizontal à 375 px sur `/lettre` (visiteur, gratuit : 448 px) : URL brutes non coupées dans l'aperçu du dernier numéro. Fichier : `apps/web/src/components/lettre/lettre-page-inscription.tsx` (bloc d'aperçu : `min-w-0 break-words [overflow-wrap:anywhere]` ; mieux, rendre les liens en `<a>` avec libellé et sans query UTM affichée). Ferait 10 : `scrollWidth == 375` aux 5 largeurs.
2. Vide à droite à 1280, 1456, 1920 sur l'archive de `/lettre` (abonné) : deux cartes dans une grille à 3 colonnes. Fichier : `apps/web/src/components/lettre/lettres-abonne-cartes.tsx` (grille `grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]` pour que 2 cartes occupent toute la coque, et mettre la plus récente en tête, grande). Ferait 10 : coque remplie sans colonne fantôme.

## Pistes (ne retiennent pas la note)
- Aperçu du mail : intertitres en `font-semibold text-text-primary`, lignes vides réduites (`lettre-page-inscription.tsx`).
- Archive : sous-titre sur le rythme (jeudi) et mention de la dernière lettre : texte nouveau, à valider par Thomas.
- `/mon-espace/lettres` pour l'inscrit gratuit mène à `/abonnement` sans bande : à arbitrer avec la nav v6 (`mon-espace/lettres/page.tsx`).
- Carnet abonné : lien « Retour au sommaire » après chaque situation, à vérifier sur capture lisible.

NOTE GLOBALE : 6/10
