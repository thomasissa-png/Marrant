# Tour 9, relecture à l'aveugle @reviewer : « sections de contenu » (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `architecture-contenu-v9.md` (V9). Grille C1 à C11. Faits contrôlés dans le dépôt.

## 1. Notes

**Faits contrôlés et justes** :
- Bouton de fin d'article : `/abonnement?returnTo=/parcours/<parcours>&src=blog-<slug>` (`article-cta.tsx` l. 89, `blog-article-view.tsx` l. 137).
- `api/stripe/checkout/route.ts` n'accepte que `plan` et `returnTo` (l. 13 à 17, 40 à 43), métadonnées Stripe `userId`, `plan` (`lib/stripe.ts` l. 189 à 193), adresse de retour `cheminRetourPaiement(returnTo, plan)` (l. 186) : le `src` est bien perdu au paiement.
- `lib/blog-parcours.ts` l. 13 à 26 conforme au fait de la session.
- Plan des 30 premières situations : 6 + 6 + 5 + 5 + 5 + 1 + 2 = 30, et le reste fait 30.
- Brief Q8 (l. 195) : la reco de C14 C reprend bien « `returnTo` conservé après paiement si l'acheteur venait d'un contenu précis ».
- Zéro tiret cadratin.

| # | Critère | T7 | T8 | T9 | Justification (passage cité) |
|---|---|---|---|---|---|
| C1 | Valeur persona | 9 | 9 | 10 | Le cas réel d'un abonné venu d'un article a désormais un premier pas (« la première fiche à geste de l'étape 1 de ce parcours, de 5 minutes au plus ») ; la vanne n'apparaît plus deux fois. Rien à redire. |
| C2 | Respect des décisions | 10 | 10 | 10 | Q8 du brief présentée comme « pas encore posée », pas tranchée ; aucune donnée nouvelle sur le compte par défaut. |
| C3 | Zéro donnée inventée | 9 | 8 | 9 | U1 corrigé sur le code, exact. Reste : « La catégorie d'un article se dérive du **cluster de `lib/blog-parcours.ts`** [À VÉRIFIER : liste des clusters et correspondance] » : vérifiable en une lecture, et faux (V1). |
| C4 | Rubriques | 10 | 10 | 10 | Rien à redire. |
| C5 | Ambition | 10 | 10 | 10 | Rien à redire. |
| C6 | Cohérence | 9 | 8 | 9 | U2, U3, U5 corrigés. Mais « **aucune seconde table article-parcours** n'est créée ; seul le premier pas par catégorie est défini » ne tient pas : les catégories de la table (« Blagues », « phrases drôles », « Rencontre », « Storytelling ») ne sont pas des clusters, il faudra une correspondance par article (V1). |
| C7 | Faisabilité | 9 | 9 | 10 | Le chantier de §7.3 liste la destination après paiement selon C14, le toucher de la vanne et, en conditionnel, le transport du `src`. Rien à redire. |
| C8 | Questions | 9 | 10 | 9 | C14 est la Q8 du brief, mais elle en perd deux morceaux : la page d'arrivée « après connexion » et « la page de succès garde « Renoncer au contrat ici » » (V2). |
| C9 | Exemples | 10 | 10 | 10 | Rien à redire. |
| C10 | Progression | 10 | 9 | 10 | Premier pas défini pour chaque signal réel, y compris le parcours sans étape. |
| C11 | Pertinence pour l'audience réelle | 8 | 9 | 10 | Les deux niveaux de mesure ([MESURÉ V] pour choisir quoi écrire, [MESURÉ A] pour la place à l'écran) règlent l'ambiguïté. L'article est traité à sa juste valeur (« utile, pas prioritaire », 0 clic sur 69 vues d'encarts), et les 30 premières situations suivent le niveau de preuve. |

**Note globale : 9,7 / 10** sur 11 critères (107 / 110 ; T8 : 9,3). Huit critères à 10. **Aucun bloquant.**

## 2. Statut de mes corrections du tour 8

| T8 | Objet | Statut | Commentaire |
|---|---|---|---|
| U1 | `returnTo` d'article | ok | Formulation juste en tête (l. 5), §4.2, §0.2, §0.4, §0 bis, C9, C14 et annexe B ; le seul signal d'article qui arrive est le parcours associé ; table d'article « À CONSTRUIRE, conditionnelle ». Vérifié dans le code. |
| U2 | Seconde table article-parcours | ok | L'ordre 2 se dérive de `lib/blog-parcours.ts`. La table de premier pas par catégorie pose un autre problème (V1). |
| U3 | Page de succès et redirection | ok | Q8 du brief nommée, posée en C14, reco C alignée sur la reco du brief. |
| U4 | Chantier sans transport du `src` | ok | Ajouté en §7.3, conditionnel, interrupteur fermé. |
| U5 | `returnTo` vers un parcours sans étape | ok | Ligne ajoutée aux ordres 1 et 2. |

**Bilan : 5 ok sur 5.**

## 3. Points ajoutés par l'auteur (profils du quiz, mémoire du navigateur)

**Affectation des 5 profils aux univers (§3.3, l. 361 : « Observateur, soirée ; Storyteller, amis ; Punchlineur (la scène universelle), amis ; Absurde, boulot ; Taquin, coloc ») : acceptée.**
- Chaque affectation suit la scène d'entrée déjà écrite en §4.2 : un groupe d'inconnus pour la soirée, « quoi de neuf ? » chez un ami, la machine à café pour le boulot, la poêle pour la coloc.
- Elle est marquée [HYPOTHÈSE d'affectation, fixée à l'étalon E1].
- Elle compte dans les volumes au lieu de s'y ajouter, et §7.4 en tient compte (coloc 1, l'entrée Taquin, le reste en lots suivants).
- Seule remarque, sans correction exigée : la scène universelle (Punchlineur et « aucun signal ») est rangée en « amis », alors qu'elle est voulue « ni bureau ni études ». Elle se lira aussi sous « commerces » ou « famille ». L'étiquette unique est un choix de rangement, pas une erreur.

**Non-répétition dans la mémoire du navigateur (§4.4) : acceptée.**
- « La non-répétition vit dans la mémoire du navigateur (vannes déjà montrées pendant la visite), rien n'est gardé sur le compte ; d'un jour à l'autre, une vanne déjà vue peut revenir. »
- C'est cohérent avec la règle du document : aucune donnée nouvelle par compte sans question. L'option « zéro répétition » est chiffrée honnêtement (liste par abonné, phrase de @legal en plus).
- Les limites sont dites : [HYPOTHÈSE : taille du lot de vannes déjà passées au calendrier], et retour à « peu importe » quand une catégorie est vide.
- Rien n'est stocké au-delà de la visite, donc aucun texte de confidentialité n'est touché. Il faudra le garder ainsi au développement : une liste gardée d'une visite à l'autre dans le navigateur serait une autre décision.

## 4. Nouvelles corrections

1. **V1. §4.2, table « catégorie d'article, premier pas » : « La catégorie d'un article se dérive du **cluster de `lib/blog-parcours.ts`** [À VÉRIFIER : liste des clusters et correspondance] : **aucune seconde table article-parcours** n'est créée ».** Problème : la vérification est faisable en une lecture, et elle invalide la phrase.
   - Le cluster `fort-volume` (`lib/blog-clusters.ts` l. 58 à 61) regroupe à lui seul l'article « meilleures blagues 2026 », « phrases drôles en conversation », « comment faire rire une fille », « comment faire rire un homme », « faire rire ses amis » et « créer ses propres blagues ». Trois catégories de la table (« Blagues », « phrases drôles », « Rencontre ») y tombent ensemble.
   - L'humour noir est dans `types-humour` (l. 37) ; aucun cluster « storytelling » ni « autodérision ».
   - La table demandera donc une correspondance par slug, qui est bien une seconde table (de catégorie, pas de parcours).
   - Au passage : les deux articles « faire rire » mènent déjà à Confiance par la table par slug (`config/blog-encarts.ts` l. 30 et 31), pas à « repartie ». Le `returnTo` d'un lecteur de ces pages est donc `/parcours/confiance`.

   Correction : remplacer le [À VÉRIFIER] par ces faits ; écrire « une correspondance article vers catégorie, par slug, sera à créer avec la table (à construire) » ; citer le cas « faire rire » vers Confiance dans la ligne « rencontre » de §0.2. **Bloquant : non** (la table est conditionnelle et hors V1 par défaut).
2. **V2. C14 « Où arrive l'abonné juste après le paiement ? (c'est la Q8 du brief […]) ».** Problème : la Q8 du brief (l. 195) porte sur la « page d'arrivée après connexion et après paiement », et sa reco ajoute « la page de succès garde « Renoncer au contrat ici » » (D.221-5, brief §1). C14 ne traite que l'après-paiement et omet ce lien, que l'option A (« Toujours sur « Aujourd'hui » ») pourrait faire croire supprimé. Correction : une phrase dans C14 (« la page de succès, avec « Renoncer au contrat ici », reste affichée avant la redirection, quelle que soit l'option ; la page d'arrivée d'un abonné qui se connecte est « Aujourd'hui », comme le recommande le brief ») ou la mention que ces deux points restent dans la Q8 du brief. **Bloquant : non.**

## 5. Conditions du 10/10

Traiter V1 et V2 (deux corrections de libellé, sans effet sur la structure), puis un dernier tour à l'aveugle. Aucun bloquant : l'architecture est au niveau sur la structure, les décisions, l'audience, la production et les questions.
