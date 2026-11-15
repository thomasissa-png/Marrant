# Relecture UX à l'aveugle s25 v6 : La lettre (`/lettre`) et Carnet (`/carnet`)

Captures lues : `docs/captures/s25/v6-tour-1/lettre/` (visiteur, gratuit, en-cours, nouvel aux 5 largeurs : lues visiteur 375/1280/1920, gratuit 768, nouvel 375/1280 ; les autres sont identiques par construction, même composant) et `.../carnet/` (visiteur 375/1280, en-cours 1280 en miniature). Code : `app/(dashboard)/lettre/page.tsx`, `components/espace/{archive-lettres,lettres-abonne}.tsx`, `components/carnet/{carnet-page,carnet-fiche-card}.tsx`.

Limites honnêtes : la capture `en-cours-carnet-*` fait 24 417 px de haut ; vue en miniature (105 px de large), elle ne permet pas de juger le détail, ni la présence de la rangée « Les carnets précédents ». Je ne note que ce que je vois. Je n'ai pas lu `lettre-page-inscription.tsx` : le formulaire est jugé sur capture.

## Parcours lus

- **Visiteur et gratuit, `/lettre`** : page d'inscription (H1 « Une situation, trois répliques, chaque mois », champ e-mail, case de consentement, bouton « Envoie-moi la lettre », mention légale). Le gratuit a son e-mail déjà rempli (gratuit-lettre-768) : zéro duplication, conforme.
- **Abonné (en-cours, nouvel), `/lettre`** : archive. Préversion sans lettre envoyée : état vide (H1 « Lettres », une carte « Tes lettres s'affichent ici dès leur envoi. », bouton « Aller à Aujourd'hui »).
- **Carnet visiteur et gratuit** : kicker, H1 « Carnet de novembre », une fiche offerte en entier, bloc d'offre (un bouton plein), « Au programme » (3 titres verrouillés + « Et 26 autres répliques »). Abonné : les 30 fiches ouvertes à la suite.

## Cognitive walkthrough (first-time user)

- Visiteur sur La lettre : sait quoi faire (un champ, un bouton), le lien but-action est clair. OK.
- Abonné sur La lettre, sans lettre : comprend que c'est vide et normal. Mais rien ne dit comment la lettre arrive (e-mail ? déjà inscrit ?). [FRICTION H1] à l'étape 1, le nouvel abonné ne sait pas s'il est inscrit à la lettre. Solution : à valider par Thomas, une ligne d'état (« Tu es inscrit·e » ou un accès à l'inscription) ; je ne propose pas de texte final.
- Abonné sur Carnet : [FRICTION H7] à l'étape 1, l'abonné qui cherche une situation précise (ou reprend où il s'est arrêté) fait défiler 24 417 px à 1280 (33 304 px à 375) sans sommaire ni saut. Solution : voir faute dure 2.
- Visiteur sur Carnet : une vraie réplique lue en entier, un seul bouton plein, liste verrouillée. Parcours lisible et sans mur.

## Nielsen (flows lettre et carnet)

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| 1 | Visibilité de l'état | PASS | chip « La lettre » / « Carnet » allumé avec soulignement (visiteur-lettre-1280, visiteur-carnet-1280) ; « Situation 10 · offerte » |
| 2 | Vocabulaire du persona | PASS | tutoiement, « On te dit / Tu réponds » |
| 3 | Contrôle / annulation | PASS | désinscription en un clic annoncée ; pages de statut `?statut=` couvertes (page.tsx) |
| 4 | Cohérence | FAIL léger | chip « La lettre » mais H1 « Lettres » à l'état vide (nouvel-lettre-1280) ; lignes d'archive `rounded-md` (8 px) alors que les cartes voisines sont plus rondes |
| 5 | Prévention d'erreurs | PASS | case de consentement explicite, statuts `saisie-email` / `saisie-case` |
| 6 | Reconnaissance > rappel | PASS | e-mail pré-rempli pour le gratuit |
| 7 | Raccourcis experts | FAIL | aucun saut dans les 30 fiches du carnet abonné |
| 8 | Minimalisme | PASS | Lettre : un champ ; Carnet visiteur : une fiche, une offre |
| 9 | Messages d'erreur | PASS (code) | `LettreStatut` pour confirmée / invalide / erreur avec issue ; non vu en capture |
| 10 | Aide contextuelle | PASS | mention légale sous le bouton |

## Notes

### Design
1. **Fidélité à l'accueil : 7.** Les deux pages sont en colonne `max-w-3xl` alignée à gauche, titre non centré, formulaire posé à nu sur le fond (visiteur-lettre-1280), carte d'état vide sans filet dégradé violet (nouvel-lettre-1280), fiches du carnet en cartes à simple bordure (visiteur-carnet-1280). Aucune pastille, aucun filet. L'étalon impose hero centré, titres centrés, cartes `rounded-xl` à filet dégradé. Correction : `lettre-page-inscription.tsx` et `lettres-abonne.tsx` / `PageHeader` : centrer H1 et sous-titre, envelopper le formulaire dans la carte `rounded-xl` à filet dégradé de l'accueil ; idem `ArchiveLettres` état vide (remplacer `CARTE` par la carte de l'accueil) et `CarnetFicheCard` / bloc d'offre. Ferait 10 : une carte à filet par bloc, titres centrés comme l'accueil.
2. **Hiérarchie et lisibilité : 9.** Très bonne dans le carnet (kicker, titre, bulles « On te dit » / « Tu réponds »). Lettre : bouton « Envoie-moi la lettre » en contour violet, plus discret que l'action principale ; la case de consentement, grise sur fond noir, a un contraste de bordure faible (visiteur-lettre-1280). Correction : `lettre-page-inscription.tsx`, bouton en variante `primary` (`buttonVariants`), bordure de case en `border-border-hover` au moins. Contraste exact non mesuré : piste.
3. **Mise en page aux 5 largeurs : 9.** Colonne centrée à 1280, 1456, 1920 (visiteur-lettre-1920, aucun vide parasite ni débordement), bien empilée à 375. Défaut : à 1280 le texte de la colonne laisse deux marges vides latérales larges, acceptable car centrée. Le chip « Carnet » est coupé par le fondu de la bande à 1280 et 1920 pour le visiteur (visiteur-lettre-1280, visiteur-lettre-1920), ce qui contredit « jamais tronquée » : hors périmètre, à remonter au groupe bande.
4. **Cohérence avec l'espace : 8.** H1 « Lettres » vs chip « La lettre » ; lignes d'archive `rounded-md` ; kicker au-dessus du H1 pour le non-abonné et dessous pour l'abonné (carnet-page.tsx l. 67-69), voulu mais incohérent entre comptes.
5. **Finition : 8.** « Aller à Aujourd'hui » ok en cible (~44 px). Étiquette « Situation N » des fiches verrouillées en `text-xs text-text-muted` : AA non vérifié, piste. Texte de réassurance centré sous un bloc aligné à gauche (visiteur-carnet-1280, « Premium : premier paiement… ») : `components/ui/reassurance.tsx`, aligner à gauche.

### UX
1. **Compréhension : 8.** Lettre visiteur : 3 secondes suffisent. Carnet abonné : page de 24 000 px sans repère.
2. **Action principale unique : 9.** Lettre : une seule action, mais bouton en contour (voir design 2). Carnet : un bouton plein (hors bouton d'en-tête, existant).
3. **États vides et nouvel abonné : 8.** Archive vide : jamais une page morte (phrase + sortie), sans date promise (conforme à la décision du 17/10). Manque : l'abonné ne sait pas s'il est inscrit à la lettre (FRICTION H1). Le carnet n'a pas d'état vide propre (contenu mensuel, identique pour en-cours et nouvel : normal).
4. **Aperçu Premium : 10.** Carnet visiteur : fiche réelle lue en entier, un seul bouton plein, aucun mur, liste verrouillée avec « Et 26 autres répliques ». La lettre est gratuite pour tous : sans objet.
5. **Accessibilité et cohérence entre comptes : 9.** Fil d'Ariane retiré au premier niveau, conservé sur `/carnet/<mois>`, cohérent ; titres `h2` / `h3` ordonnés dans la fiche. Visiteur et gratuit voient le même carnet (voulu).

## NOTE GLOBALE : 7/10 (minimum : design 1)

## Fautes dures (bloquent la validation à 9)

1. Lettre et Carnet ne parlent pas la langue de l'accueil (titres alignés à gauche, formulaire et cartes sans filet dégradé ni `rounded-xl`) : `apps/web/src/components/lettre/lettre-page-inscription.tsx`, `apps/web/src/components/espace/lettres-abonne.tsx`, `apps/web/src/components/espace/archive-lettres.tsx` (état vide), `apps/web/src/components/carnet/carnet-fiche-card.tsx` et `carnet-page.tsx` (bloc d'offre).
2. Carnet de l'abonné : 30 fiches ouvertes à la suite sans sommaire ni saut (ancres `fiche-${id}` déjà présentes, jamais exposées) : `apps/web/src/components/carnet/carnet-page.tsx` (ajouter un sommaire de 30 liens, ou fiches repliables `<details>` ouvertes sur la première, cibles 44 px).

## Pistes (ne retiennent pas la note)

- Bouton « Envoie-moi la lettre » en `primary` plein ; bordure de case plus contrastée (`lettre-page-inscription.tsx`).
- H1 « Lettres » face au chip « La lettre » : signalé, libellé validé non touché ; ligne d'état d'inscription pour l'abonné : à valider par Thomas.
- Lignes d'archive `rounded-md` vers la carte de l'espace (`archive-lettres.tsx`) ; réassurance alignée à gauche (`reassurance.tsx`).
- Chip « Carnet » coupé à 1280 et 1920 : à remonter au groupe bande.
