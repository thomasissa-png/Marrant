# Relecture UX à l'aveugle, s25 v6 tour 3 : groupe lettre-carnet

Périmètre : /lettre (4 comptes), /mon-espace/lettres (redirection vers /lettre), /carnet (4 comptes, tranches abonné en cours et nouvel). Captures : `docs/captures/s25/v6-tour-3/{lettre,carnet,dediees}`. Lecture sur le rendu réel uniquement. Je n'ai pas lu les fichiers de code, seulement listé leurs noms : les chemins ci-dessous sont des pistes d'emplacement à confirmer.

## Constats par compte

**/lettre visiteur et gratuit (identiques, e-mail pré-rempli pour le gratuit : bon point).**
H1 centré, carte formulaire à filet violet, bouton plein unique, puis « À quoi ça ressemble : le dernier numéro » (`visiteur-lettre-1280.png`, `gratuit-lettre-1280.png`). Aperçu Premium respecté : le visiteur voit une vraie lettre en entier, une seule offre (bouton d'en-tête, lien dans le PS). Mais le corps de la lettre est rendu comme un e-mail brut : « La sûre », « La joueuse », « La risquée », « Comment choisir », « L'erreur que tout le monde fait », « À essayer cette semaine » ont le poids et la taille du texte courant. Seul le sujet est en gras. Les URL sont affichées en toutes lettres (`deviens-marrant.fr/blog/rester-muet-en-groupe`). Une ligne vide sépare chaque ligne de citation (« Salut, » seul entre deux blancs). À 375 px, cela fait environ 3 500 px de mur de texte (`visiteur-lettre-375.png`). L'étiquette « À QUOI ÇA RESSEMBLE » est en gris moyen petit. C'est un défaut de hiérarchie et de lisibilité : l'étalon aère et titre ses blocs, ici le lecteur ne peut pas scanner les trois répliques.

**/lettre abonné (en cours et nouvel, identiques : deux lettres dans l'archive).**
Page très maigre : H1 « La lettre » et deux petites cartes (`en-cours-lettre-1280.png`). Aucune phrase d'intro ni rythme (« chaque jeudi », prochaine lettre), aucun état de réception, rien qui dise que la carte s'ouvre : pas de chevron ni de lien visible. Le titre de carte est en 14 px. Sous les cartes, environ 400 px de vide noir avant le pied de page à 1280, et pareil à 375 (`en-cours-lettre-375.png`). La page paraît inachevée, alors que le visiteur reçoit une page riche. Le nouvel abonné voit exactement la même chose que l'abonné avancé : acceptable pour l'archive, mais il n'y a aucun mot d'accueil. La cloche porte un point violet chez l'abonné en cours et pas chez le nouvel : cohérent.

**/mon-espace/lettres.** Visiteur et gratuit arrivent bien sur /lettre sans mur (`dediees/*-mon-espace-lettres-*.png`), avec la rubrique « La lettre » allumée. RAS.

**/carnet visiteur et gratuit (identiques).** Bon aperçu : une vraie situation offerte en entier, un seul bouton plein (« Ouvrir tout le carnet · 1,99 €/mois »), mention de remboursement, puis « Au programme » avec 3 cartes verrouillées et « Et 26 autres répliques » (1 + 3 + 26 = 30 : le compte tombe juste) (`visiteur-carnet-1280.png`, `visiteur-carnet-375.png`). Pas de mur, pas de second appel à l'action. Défauts mineurs : (a) le sur-titre « CARNET DE NOVEMBRE 2026 · 30 SITUATIONS » est AU-DESSUS du H1 ici, mais EN DESSOUS chez l'abonné ; (b) le texte de la carte d'offre est décalé de 7 px par rapport au texte de la fiche au-dessus (padding de carte différent : x 255 contre 262 sur la capture réduite) ; (c) les 3 cartes verrouillées n'ont aucun aperçu du début de la situation, seulement un titre et « quotidien » (le brief d'aperçu demande « titre et début »).

**/carnet abonné (en cours et nouvel, identiques).** Page de 25 800 px à 1280 et d'environ 36 000 px à 375 (18 tranches). Structure : H1, sur-titre, sous-titre, index numéroté de 30 lignes (2 colonnes à 1280, 1 colonne à 375 : 1 300 px d'index avant la première fiche), puis le titre « Les carnets précédents » avec une pastille « octobre 2026 », puis les 30 fiches de NOVEMBRE (`en-cours-carnet-1280-tranche-1.png`, `en-cours-carnet-375-tranche-1.png`). Les fiches venant juste après « Les carnets précédents » / « octobre 2026 », le lecteur lit ces 30 fiches comme étant celles d'octobre. Or ce sont celles de novembre, comme le dit le H1. C'est un contresens de structure. Aucun lien visible dans l'index (rien n'indique qu'il saute à la fiche), pas de « retour à l'index », aucun repère de progression ni de fiche du jour. Le nouvel abonné n'a aucun point de départ (« Commence par la situation 1 »), la page est complète donc jamais morte, mais elle est intimidante. Alignement à gauche du H1 : l'étalon centre ses titres, /lettre abonné et /lettre visiteur centrent les leurs, /carnet non. Les fiches elles-mêmes (On te dit / Tu réponds / Pourquoi ça marche / Si ça se tend / À toi de jouer) sont bien hiérarchisées, contrastées et aérées : c'est le meilleur élément du groupe.

## Notes

| Critère | Note | Défaut (capture) | Correction codable | Ce qui ferait 10 |
|---|---|---|---|---|
| Design 1 fidélité accueil | 8 | H1 carnet aligné à gauche, accueil centré (`*-carnet-1280.png`) | `components/carnet/carnet-page.tsx` : `text-center` sur l'en-tête, ou justifier gabarit B | En-tête centré comme /lettre |
| Design 2 hiérarchie, lisibilité | 7 | Lettre en mur de texte, titres de bloc non distincts (`visiteur-lettre-1280.png`) ; carnet : bloc « précédents » mal placé | `components/lettre/lettre-corps-apercu.tsx` : titres de bloc en `text-text-primary font-semibold`, `space-y-6`, URL en lien court ; `carnet-page.tsx` : déplacer « Les carnets précédents » APRÈS les 30 fiches | Blocs repérables en 3 s, sections dans le bon ordre |
| Design 3 mise en page 5 largeurs | 8 | /lettre abonné : 400 px de vide avant le pied de page (`en-cours-lettre-1280.png`) | `components/lettre/lettres-abonne-cartes.tsx` : intro + états sous les cartes, retirer la hauteur minimale forcée | Page qui se termine avec son contenu |
| Design 4 cohérence espace | 8 | Sur-titre dessus / dessous selon le compte ; padding carte d'offre | `carnet-page.tsx` et `carnet-fiche-card.tsx` : même ordre, même `p-` | Un seul ordre, mêmes paddings |
| Design 5 finition | 9 | Libellés de cartes en 14 px, décalage de 7 px | idem | Alignements au pixel |
| UX 1 compréhension | 7 | Contresens « carnets précédents » ; /lettre abonné sans explication | voir ci-dessus + sous-titre sous le H1 (texte à valider par Thomas) | Je sais où je suis sans lire |
| UX 2 action principale | 8 | Carnet abonné : aucune action, index non repérable comme liens ; cartes de lettre sans signal de clic | `carnet-page.tsx` : index en ancres `<a href="#situation-n">` avec focus visible, « Retour à l'index » ; `lettres-abonne-cartes.tsx` : chevron et date | Une action évidente par page |
| UX 3 états vides et nouvel abonné | 8 | Nouvel = en cours, sans point de départ (`nouvel-carnet-1280-tranche-1.png`) | Bandeau « Commence par la situation 1 » [à valider par Thomas] | Accueil spécifique du nouvel abonné |
| UX 4 aperçu Premium | 9 | Cartes verrouillées sans début de situation (`visiteur-carnet-1280.png`) | `carnet-extrait.tsx` : 1 ligne de début de situation (pas de texte inventé, les données existent) | Valeur visible sur les 3 cartes |
| UX 5 accessibilité, cohérence | 9 | Étiquettes en gris moyen petites ; case à cocher visible à 24 px (cible à vérifier à 44 px, label cliquable non démontrable ici) | `lettre-inscription.tsx` : `min-h-[44px]` sur la ligne case + label | Cible 44 px prouvée |

Hors périmètre signalé : la bande des rubriques est cohérente entre comptes (cadenas sur le groupe 1 et sur Favoris pour visiteur et gratuit, aucun pour l'abonné), conforme à la v6.

## Fautes dures (bloquent la validation)

1. Carnet abonné : « Les carnets précédents » / « octobre 2026 » placé avant les fiches de novembre (contresens, UX 1 et Design 2) : `apps/web/src/components/carnet/carnet-page.tsx`.
2. /lettre visiteur et gratuit : corps de lettre sans hiérarchie, mur de texte, URL brutes, titres de bloc indiscernables (Design 2) : `apps/web/src/components/lettre/lettre-corps-apercu.tsx`.
3. /lettre abonné : page maigre sans intro, cartes sans signal de clic, grand vide avant le pied de page (Design 3, UX 1, UX 2) : `apps/web/src/components/lettre/lettres-abonne-cartes.tsx`.

Pistes (ne retiennent pas la note) : H1 carnet centré ; sur-titre dans le même ordre pour tous les comptes ; début de situation sur les cartes verrouillées ; index en ancres avec retour ; accueil du nouvel abonné (textes à valider par Thomas).

NOTE GLOBALE : 7/10
