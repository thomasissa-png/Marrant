# Revue UX v1 : page de résiliation s23 (placement et parcours), 06/11/2026

Périmètre : 29 captures de `docs/captures/s23-resiliation/` (PC 1440, mobile 390), code `components/resiliation/`, `app/(dashboard)/resiliation/`, `config/textes/resiliation.ts`. Référence : `docs/ux/page-resiliation-s23-spec.md` v3. Aucun code modifié. Limite : pas de capture 768, pas de capture PC en viewport (sticky non démontré), pas de clavier ouvert.

**Note globale : 7,5 / 10** (placement 8, parcours 7). Pas de dark pattern : question facultative, jamais pré-cochée, bouton toujours actif, « Garder » discret mais visible, aucun écran ajouté. Les écarts viennent de la page finale (main tendue interdite par la spec), d'états d'erreur trompeurs ou manquants et de la connexion.

## Tableau

| Critère | Note | Constat |
|---|---|---|
| Accès depuis le pied de page | 9/10 | `apres-pied-de-page-pc-1440` et `-mobile-390` : « Résilier ton contrat » en dernière ligne de la colonne Légal, même style que les autres liens, pas caché. Sur mobile il faut défiler jusqu'en bas (inévitable). 2 clics au total. |
| Accès depuis le profil | 8/10 | `avant-profil-carte-abonnement-pc-1440` : bouton « Résilier ton contrat » + phrase « Si tu résilies, tu gardes Premium jusqu'au 1 décembre 2026, sans nouveau prélèvement » : clair. Écarts : « 1 décembre » au lieu de « 1er décembre » (page : « 1er »), et « Renoncer au contrat ici » juste dessous prête à confusion avec la résiliation pour Yanis. |
| Ordre des blocs | 9/10 | `resiliation-vide-pc-1440` : H1, récapitulatif, question, bouton, garder : conforme à la spec §2. Date de fin en bloc surélevé : on comprend « jusqu'à quand » en 1 s. Raisons en grille 2 colonnes, 7e case « Autre » seule (acceptable). |
| Premier écran mobile | 8/10 | `resiliation-vide-premier-ecran-mobile-390` : H1, récap complet avec date, début de la question « Facultatif », 2 raisons, bouton et « Garder » visibles sans défiler. La barre basse (~25 % de l'écran) masque la suite, normal. Récap un peu long : date dite 2 fois (bloc + phrase). |
| Bouton collé | 8/10 | Code `barre-confirmation.tsx` l.17 : `sticky bottom-0`, fond opaque, jamais `disabled`. Mobile : conforme (`resiliation-envoi-mobile-390`). PC : aucune capture en viewport, impossible de vérifier. En envoi, la barre grossit (ligne « Toujours en cours… ») et recouvre ~35 % de l'écran. Pas de `viewport-fit=cover` : acceptable, aucune barre masquée par l'indicateur iOS. |
| « Garder mon abonnement » | 9/10 | Lien souligné, plus petit et pâle que le bouton, cible 44 px (l.31), retour profil sans confirmation. Visible, non culpabilisant. |
| La raison est vue avant de confirmer sans freiner | 9/10 | `resiliation-vide-pc-1440` : « Facultatif » collé au titre, « Tu peux résilier sans répondre. », cases non cochées, `raisons-cochees-*` : le bouton reste identique. Aucun compte à rebours ni rétention. |
| États d'erreur | 5/10 | `erreur-stripe-mobile/pc` : message conforme, saisie gardée (`erreur-stripe-page-pc` : cases et mot conservés), focus sur le bandeau. Mais : « Réessayer » à côté de « ta demande est bien enregistrée » laisse croire qu'il faut agir ; « Pas de connexion » servi aussi pour 429/403 (formulaire l.118) ; App Store sans capture et seulement après clic (l.114, `page.tsx` sans branche) ; hors-ligne sans capture ; session expirée (l.96-99) perd la saisie ; pas de `loading.tsx`. |
| États vides et rares | 7/10 | `deja-resilie-mobile` : correct (badge « Enregistrée », date, « Réactiver »). `sans-abonnement-mobile` : « Rien à résilier ici. » + retour accueil, ok mais texte gris pâle. `sans-client-stripe-mobile` : « à la fin de la période déjà payée » faux pour un accès offert (`offert@local.test`) et « Aucun nouveau prélèvement » sans objet. |
| Connexion | 6/10 | `resiliation-connexion-pc-1440` et `-mobile-390` : page `/login` pleine, sans en-tête ni pied (repli permis par la spec, contraire à la préférence fondateur « modal »). Le texte « Connecte-toi pour résilier ton contrat. Tu reviens ici juste après. » est bon. Mais « Pas encore abonné ? Créer mon compte et m'abonner » est hors sujet et ressemble à une relance. |
| Page confirmée | 7/10 | `resiliation-confirmee-pc-1440` et `-mobile-390` : « C'est noté. », date, effets, reçu en carte, e-mail, « Changer d'avis ? Réactiver » discret : très bien. Mais « Merci d'avoir répondu. » + ligne d'aide avec lien (« chaque parcours ») = main tendue que la spec §2 interdit (« Aucune main tendue, aucune offre »). La première phrase se coupe à ~420 px alors que les suivantes courent à ~520 px. |
| Trois clics légaux | 9/10 | Pied de page -> « Confirmer la résiliation » = 2 clics, page finale = résultat. Connexion éventuelle : point avocat n°2 déjà noté. Plus d'étape Stripe. |
| Cohérence avec la spec | 7/10 | Conforme : URL, ordre, libellé unique, sticky, états. Écarts tranchés par fullstack : badge « Premium » (PASS, plus lisible), pas de viewport-fit (PASS), détection App Store par hypothèse (FAIL, voir O5), pas de `loading.tsx` (FAIL, voir O6), message hors-ligne non validé par la copie (à faire valider). Libellés de raisons différents de la spec (« Pas le temps en ce moment », « Ça ne me correspond pas ») : textes provisoires, ok. |
| Aucun état manquant | 6/10 | Captures présentes : vide, cochées, envoi/lent, erreur, annuel, déjà résilié, sans abonnement, sans client Stripe, confirmée, connexion. Manquent : hors-ligne, App Store, chargement, 768, clavier ouvert, PC viewport avec sticky. |

## Corrections OBLIGATOIRES (9)

**O1. Chiffres non validés et main tendue sur la page confirmée.** `config/textes/resiliation.ts` : l.90 remplacer ` tient en un article, avec un plan sur 30 jours.` par ` tient en un article.` ; l.92 remplacer `, c’est 15 à 20 minutes par semaine, à ton rythme : rien ne se bloque.` par `, à ton rythme : rien ne se bloque.` ; l.104 remplacer ` prend environ 2 minutes, sans inscription.` par ` est en accès libre, sans inscription.` (règle 2, aucun chiffre inventé). De plus, la spec §2 interdit toute main tendue sur la page finale : si Thomas n'a pas validé par écrit les aides (`AideApresResiliation`, `confirmee/page.tsx` l.42, « Merci d'avoir répondu. » l.65) comme [CHOIX UTILISATEUR], retirer l'appel l.42 et la ligne `merci`. S'il les a validées, conserver et citer la décision dans la spec.

**O2. Connexion hors sujet.** Quand `callbackUrl` vaut `/resiliation` ou `/resiliation/confirmee`, la page `/login` masque le bloc « Pas encore abonné ? » et le bouton « Créer mon compte et m'abonner ». Garder « Retour à l'accueil ».

**O3. Session expirée : saisie perdue.** `resiliation-formulaire.tsx` l.96-99 : avant `window.location.assign`, enregistrer `raisons` et `commentaire` dans `sessionStorage` (clé dédiée), les relire au montage puis les effacer.

**O4. Mauvais message pour les refus 429/403.** `resiliation-formulaire.tsx` l.118 : ne pas utiliser `hors-ligne`. Ajouter dans `TEXTES_RESILIATION` : `refus: "Ça n’a pas pu partir. Rien n’est perdu, réessaie dans un instant."` ; `horsLigne` reste réservé au `catch` (l.119-121).

**O5. App Store : état à l'ouverture, pas après clic.** Dès que `lireResiliation` connaît le fournisseur, `page.tsx` affiche, à la place du formulaire, une `Card` avec `T.appStore` et le bouton « Retour à l'accueil » (comme `RienAResilier`). Dans le formulaire, si `erreur === "app-store"`, ne pas rendre `BarreConfirmation` (aujourd'hui `reessayer` est faux, le bouton « Confirmer la résiliation » reste actif et boucle). Capturer l'état.

**O6. `loading.tsx` manquant.** Créer `app/(dashboard)/resiliation/loading.tsx` : H1 « Résilier ton contrat » + carte squelette de la hauteur du récapitulatif (~270 px), 3 lignes de squelette pour la question, aucun bouton. Sans lui, le clic sur le pied de page ne donne aucun retour sur connexion lente (heuristique 1).

**O7. Accès offert / sans client Stripe.** `resiliation.ts` : ajouter `recapFinInconnueOffert: "à la fin de ton accès Premium"` et l'utiliser quand il n'y a pas de client Stripe ; ne pas afficher `aucunPrelevement` dans ce cas ; remplacer `garderSansDate` par `Jusqu’à cette date, tu gardes tout ton Premium.` (inchangé) mais sans la ligne prélèvement. `recapFinInconnue` (« période déjà payée ») reste pour l'échec de lecture seulement.

**O8. Bandeau d'erreur Stripe ambigu.** `T.erreurStripe` (l.42-43) : ajouter en fin « Tu n’as rien à refaire. » soit : `Ça n’a pas marché de notre côté. Ta demande est bien enregistrée : on résilie pour toi et on te le confirme par e-mail. Tu n’as rien à refaire.` Le bouton « Réessayer » reste, mais seulement pour ce cas, et `horsLigne` ne reçoit pas cette phrase. Texte provisoire, à faire valider par Thomas.

**O9. Captures manquantes (spec §5 Design 10).** Produire : hors-ligne (PC + mobile), App Store (PC + mobile), chargement, 768 px (vide + confirmée), PC viewport 1440x900 avec barre sticky visible, mobile 390 avec clavier ouvert dans le champ « Un mot de plus ? » (bouton atteignable).

## Souhaitables (une ligne chacun)

- `confirmee/page.tsx` l.38 : même largeur de paragraphe que l.39 et l.41 (la phrase « Aucun / nouveau prélèvement. » se coupe à ~420 px sur PC).
- `abonnement-card.tsx` : afficher « 1er décembre 2026 » comme la page (format de date unique).
- Passer « Aucun nouveau prélèvement après. » en couleur du texte principal (information légale clé, aujourd'hui grise).
- Mobile : fusionner la phrase « Jusqu'au {date}, tu gardes… » et le bloc « Fin du contrat » pour gagner ~60 px au premier écran.
- Connexion : ouvrir la connexion en fenêtre par-dessus la page (préférence fondateur) au lieu de `/login` pleine page, à valider avec le point avocat n°2.
- Profil : ajouter sous « Renoncer au contrat ici » une demi-phrase qui le distingue de la résiliation (« dans les 14 jours après achat »), après validation @legal.
- « Rien à résilier ici. » : texte principal plutôt que gris pâle, et dire pourquoi (« Tu es sur l'accès gratuit. »).
- Barre sticky en envoi : placer « Toujours en cours… » dans le bouton ou au-dessus de la barre pour ne pas la grossir.

## Auto-évaluation

Cognitive walkthrough (Yanis, mobile) : sait quoi faire (oui), voit l'action (oui, bouton collé), lien but-action (oui), feedback (oui en envoi ; non au chargement : O6). HEART Task success : mesurable via `resiliation-ecran-vu` / `resiliation-confirmee`, cible >= 90 %. Passage à 10/10 attendu après O1 à O9 et nouvelle revue sur captures.
