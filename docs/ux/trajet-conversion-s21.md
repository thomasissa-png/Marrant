# Trajet de conversion s21 : audit et page de vente /abonnement (mobile d'abord)

> Auteur : @ux. Date : 19/10/2026. Demande de Thomas (19/10) : « Le sujet le plus important, c'est la conversion. Il faut que le trajet de conversion soit optimal, autant en trajet qu'en texte et en logique. » Déclencheur : clic sur « Premium · 2,99 €/mois » de l'en-tête, arrivée sur /abonnement, « je ne comprends pas ce que la page essaie de faire ».
> Aucun code modifié. Zéro tiret cadratin. Intouchables respectés : « 1 500+ », prix 2,99 € / 24,99 € TTC, « plus de 3 mois offerts », rien de faux, aucune promesse de résultat, aucune mention légale dans les boutons (la réassurance unique reste sous le plein).

## 0. Résumé (à lire en premier)

**Le diagnostic de Thomas est juste.** La page a été optimisée pour que le bouton tienne dans le premier écran et pour la concision, pas pour qu'on comprenne l'offre. Le bouton est visible, mais ce qu'il achète ne l'est pas.

**Décisions structurantes (reco unique, détail aux §5 à §8)**

| # | Décision | Reco | Coût | Risque |
|---|---|---|---|---|
| D1 | Verbe du bouton sur /abonnement et sur tout bouton qui mène au compte ou au paiement | **« S'abonner · 2,99 €/mois »** (annuel : « S'abonner · 24,99 €/an »). Même verbe que le bouton Stripe et que la fenêtre Premium (« Je m'abonne… »). | très faible | faible (perte d'« envie » compensée par le titre et les bénéfices au-dessus ; à vérifier en duel de trajet) |
| D2 | Destination des boutons | **Deux familles.** Porte (l'offre n'a pas été vue) → /abonnement. Achat (l'offre vient d'être vue : fin d'étape 1, fenêtre Premium, compte connecté sur profil ou quiz) → /register ou Stripe direct. Ne rien rerouter de plus pour l'instant ; réparer l'écho entre le bouton et le titre de la page. | faible | faible |
| D3 | Inscription avant ou après le paiement | **Avant, pour la V1 de la page de vente** : le code l'impose (§8). Réduire la friction (Google d'abord déjà fait, plus de flash de page après inscription, lien « Déjà un compte ? »). Paiement d'abord = chantier à instruire (§8), pas maintenant. | n/a | n/a |
| D4 | Tableau Gratuit / Premium | **Oui**, 7 lignes vérifiées dans le code, juste sous le premier écran (§6). | moyen | faible |
| D5 | Plafond « /abonnement ≤ 3 écrans, 120 mots » | **Levé** : 5 écrans maximum, 230 mots hors FAQ et hors fiche du carnet (§9). La concision reste la règle dans chaque bloc. | nul | faible |

**Les 5 problèmes qui cassent la conversion** (preuves au §2) : (1) le titre n'identifie pas l'offre et ne fait pas écho au clic ; (2) rien ne dit ce qui est bloqué en gratuit et ce que Premium débloque ; (3) un verbe d'ouverture au lieu d'un verbe d'achat, et un seul bénéfice nommé ; (4) la ligne « Ton compte, puis le paiement sécurisé. » est obscure et le visiteur ne sait pas qu'un formulaire d'inscription l'attend ; (5) la preuve (démonstration du carnet, « 1 500+ ») et la réponse à « et si ça ne me plaît pas ? » sont absentes du premier écran, la preuve sociale est absente de la page.

## 1. Sources lues et limites (honnêteté)

- Code lu dans le worktree (branche déployée) : `abonnement/page.tsx`, `layout.tsx`, `success/page.tsx`, `premium/abonnement-view.tsx`, `plan-selector.tsx`, `avantages-premium.tsx`, `premium-modal.tsx`, `mur-liste.tsx`, `bloc-exercice.tsx`, `carte-etape-suivante.tsx`, `step-blocks.tsx`, `article-cta.tsx`, `carnet-page.tsx`, `home/premium-cta.tsx`, `carte-premium-achat.tsx`, `profil/abonnement-card.tsx`, `layout/header.tsx`, `register/page.tsx`, `api/stripe/checkout/route.ts`, `lib/stripe.ts`, `lib/premium-return.ts`, `lib/checkout-tracking.ts`, `lib/parcours-access.ts`, `lib/carnet.ts`, `lib/faqs.ts`, `config/premium.ts`, `config/textes/{offre,cta-pages,cta-articles-accueil,avantages-premium,carnet-extrait,entrees-parcours}.ts`.
- Documents lus : `docs/founder-preferences.md` (lignes du 18/10 : concision, libellés rouverts, marketing d'abord), `docs/copy/cta-s21/concision/inventaire-et-etalons.md` §4, `docs/ux/audit-charge-lecture-s21.md`, `docs/marrant/audit-conversion-s20.md`, `docs/data/cta-chiffres-s21.md`, `docs/copy/lot2-boutons-abonnement-s21.md`.
- **Je n'ai pas de shell** : pas de `curl` de la page de production. Le texte de production vient de ton brief ; je l'ai recoupé avec le code déployé (il correspond). Positions à l'écran : calculées d'après les classes CSS et le commentaire de la revue design (375 x 700), marquées `[À MESURER]` quand ce n'est pas une mesure.
- **Non capturés** : page Stripe Checkout (champs exacts `[À VÉRIFIER]`), premier écran après achat, état « déjà abonné » sur /abonnement.
- **`docs/data/mesure-apres-s21.md` n'existe pas** (aucun fichier de ce nom). Les seules mesures disponibles sont `cta-chiffres-s21.md` (18/10, 4,2 jours) et `audit-conversion-s20.md`. Volumes trop faibles pour conclure : aucun chiffre n'est extrapolé ici.

## 2. Audit : ce qui casse la conversion (du plus grave au moins grave)

### Ce qui est juste, ce qui est à nuancer, la cause racine

- **Juste** : titre sans « Premium » ; bouton sans « s'abonner » ; bénéfices minuscules sous le bouton ; aucun contraste gratuit / payant ; « Ton compte, puis le paiement sécurisé. » obscur.
- **À nuancer 1 (deux lignes redondantes)** : dans le navigateur une seule ligne est visible (les deux sont superposées dans une grille, l'autre est `invisible`, `plan-selector.tsx` l.105 à l.122). Le `curl` montre les deux parce que le masquage est en CSS. Le défaut réel est ailleurs : trois éléments pour dire une formule (pastille « Mensuel / Annuel », pastille « plus de 3 mois offerts », ligne du prix), et le HTML brut lu par Google et les LLM porte les deux phrases.
- **À nuancer 2 (« libellé unique appliqué partout »)** : c'est vrai du bouton de /abonnement et de 6 surfaces génériques, pas des murs, fiches, carnet, fin d'étape 1 et fenêtre Premium, qui ont des libellés contextuels (§7). Le problème n'est donc pas « partout », il est que **le libellé de la page de destination est le seul à ne pas dire l'acte d'achat**.
- **Cause racine (à assumer, y compris par @ux)** : /abonnement a été traitée comme un « bloc d'appel » à raccourcir alors que c'est **la page où convergent toutes les portes** (en-tête, accueil, murs, fiches, articles, carnet, quiz). Deux règles se contredisent : la règle 6 de la concision (« le détail de l'offre vit sur /abonnement, une fois ») et la règle 9 (« 120 mots pour /abonnement »). Mon propre `audit-charge-lecture-s21.md` §3 a ajouté « /abonnement ≤ 3 écrans, 3 puces d'une ligne, chapô 1 à 2 lignes ». On a donc promis aux autres surfaces que le détail serait sur /abonnement, puis on a affamé /abonnement. Et l'unique exigence dure (« bouton visible au premier écran ») a été satisfaite en poussant tout le reste sous le bouton : **bouton visible n'est pas offre comprise**.
- **Cause de processus** : la relecture à l'aveugle notait des textes isolés. Aucun relecteur n'a joué le trajet (clic en-tête, puis page). Corrigé par la grille du §11.

### Problèmes classés

| # | Gravité | Problème | Preuve (texte exact, position à 375 px) | Heuristique |
|---|---|---|---|---|
| P1 | Bloquant | **Le titre n'identifie pas l'offre ; aucun écho au clic.** Le visiteur a cliqué sur « Premium · 2,99 €/mois » et lit un hook de parcours. | H1 « Ta réplique en soirée, pas dans le bus du retour » puis « Pas d'attente entre les étapes, de 15 à 20 minutes chacune. » (y ≈ 80 à 190 px). Le mot « Premium » n'apparaît qu'au h2 de la carte (y ≈ 260 px `[À MESURER]`). Même titre pour un clic venu de /vannes : `parcoursSlugFromHref('/vannes')` renvoie null, repli Répartie (`abonnement-view.tsx` l.162). | H2 (langage du visiteur), H4 (cohérence clic / page) |
| P2 | Bloquant | **Rien ne dit ce qui est bloqué en gratuit ni ce que Premium débloque.** Les 4 bénéfices sont en `text-sm` après le bouton, sous le pli. | « Chaque parcours en entier », « Un nouveau carnet de répartie chaque mois », « Tout le catalogue : vannes, conseils, vidéos », « Tes favoris sous la main » (y ≈ 650 à 760 px, `AvantagesPremium` placé après le bouton et la réassurance, l.314). La décision d'achat se prend sans connaître l'objet. | H1, H6 (reconnaissance), H10 |
| P3 | Majeur | **Verbe et objet du bouton.** « Ouvrir » est le verbe de l'étape gratuite (« Tester l'étape 1 »), pas de l'achat ; il ne nomme qu'un des 4 bénéfices ; il diffère du bouton Stripe (« S'abonner ») et de la fenêtre (« Je m'abonne… »). | « Ouvrir les 5 parcours · 2,99 €/mois » (`libelleOuvrirParcours`). Stripe : `submit_type: "subscribe"`. | H2, H4, H5 |
| P4 | Majeur | **Ligne de suite obscure ; l'inscription n'est pas annoncée comme telle.** « Compte » est un mot système ; rien n'indique e-mail, mot de passe ou Google ; aucune notion d'étapes. | « Ton compte, puis le paiement sécurisé. » (12 px, `text-secondary`, juste sous le bouton). Le clic mène à /register : titre « Ton compte », 2 champs, bouton « Créer mon compte et passer au paiement ». | H1 (visibilité de l'état), H5 |
| P5 | Majeur | **Pas de preuve sur la page de vente.** « 1 500+ » est absent de /abonnement ; la démonstration du carnet arrive au 3e écran, après la carte. | Ordre réel : H1, sous-titre, carte (prix, bouton, 4 coches), « Carnet d'octobre · Situation 15, offerte », « Le carnet, en vrai » (y ≈ 900+ px), « Pas encore sûr ? Tester l'étape 1 de Répartie, gratuite », FAQ. | H1, H10 |
| P6 | Majeur | **Le gratuit n'est pas positionné comme réassurance et la garantie est noyée.** Garantie en 12 px grise ; étape 1 gratuite en lien d'une ligne tout en bas. | « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » (`text-xs text-text-muted`) ; lien « Tester l'étape 1 de Répartie, gratuite » après le carnet. | H5, H10 |
| P7 | Moyen | **Trois éléments pour dire une formule ; annuel caché derrière un sélecteur.** | Pastilles « Mensuel » / « Annuel », pastille « plus de 3 mois offerts » sous « Annuel », « 2,99 € TTC / mois », « Ou 24,99 €/an, soit 2,08 € par mois. » | H8 (minimalisme) |
| P8 | Moyen | **Accroche de parcours imposée à tous les visiteurs.** | Défaut Répartie pour en-tête, accueil, murs, glossaire, carnet. | H4 |
| P9 | Mineur | **Visiteur qui a déjà un compte.** Il doit passer par /register pour découvrir « Cet e-mail a déjà un compte ». | Aucun lien « Déjà un compte ? » sur /abonnement (visiteur). 11 comptes gratuits existent, plus les inscriptions abandonnées avant paiement. | H3, H9 |
| P10 | Mineur | **Retour de Stripe annulé : la bannière pousse le bouton hors du premier écran.** | `PAIEMENT_ANNULE` : titre + texte, `mb-6`, au-dessus du H1 (≈ 90 px). | H1 |
| P11 | Mineur | **Flash de la page de vente entre l'inscription et Stripe.** | `getPostSignupRedirect` renvoie `/abonnement?…&auto=1` : la page se rend en entier, le bouton passe à « On t'emmène au paiement… ». | H1, H8 |

### Audit heuristique Nielsen 10 sur /abonnement (état actuel, visiteur, 375 px)

| H | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | FAIL | On ne sait pas qu'on est sur l'offre (P1) ; 2 étapes avant paiement non annoncées (P4). |
| H2 Vocabulaire du persona | FAIL | « Ouvrir », « compte », « formule » : jargon produit ; le persona dit « m'abonner », « combien ». |
| H3 Contrôle et annulation | PASS | Retour navigateur, lien étape 1 gratuite, annulation Stripe gérée (bannière). Mais pas de « Déjà un compte ? » (P9). |
| H4 Cohérence | FAIL | « Ouvrir » (page) contre « S'abonner » (Stripe, fenêtre) ; titre sans écho du clic. |
| H5 Prévention d'erreurs | PASS (réserve) | 409 déjà abonné et 503 annuel gérés ; réserve : l'inscription surprend. |
| H6 Reconnaissance plutôt que rappel | FAIL | Pas de tableau ; il faut déduire le gratuit des murs vus ailleurs. |
| H7 Raccourcis experts | PASS | `plan=annual`, `returnTo`, Google en premier sur /register. |
| H8 Minimalisme | FAIL (à l'envers) | Concision poussée jusqu'à retirer l'information décisionnelle ; trois éléments pour une formule. |
| H9 Messages d'erreur | PASS | Messages humains (`checkoutErrorMessage`), lien /profil sur conflit. |
| H10 Aide contextuelle dans le flow | FAIL | Garantie et FAQ loin du bouton ; aucune réponse à « et si ça ne me plaît pas ? » dans le premier écran. |

### Cognitive walkthrough : first-time user, mobile, clic sur l'en-tête

1. **Voit-il le bouton ?** Oui, « 2,99 €/mois » seul sous 640 px (`EN_TETE.boutonCourt`). **[FRICTION H2]** : à l'étape 1, le first-time user lit un prix sans objet (« 2,99 € par quoi ? »). Solution : libellé court avec l'objet (« Premium », prix sur la page) ou « Premium · 2,99 € » si la largeur le permet `[À MESURER 320/360/375]`.
2. **Sait-il où il est ?** Non. **[FRICTION H4]** : à l'étape 2, le titre ne reprend pas le mot cliqué. Solution : H1 qui contient « Premium » et la mécanique (§5, bloc 1).
3. **Comprend-il ce qu'il obtient ?** Pas avant le pli. **[FRICTION H6]** : à l'étape 3, la liste est sous le bouton. Solution : 3 bénéfices au-dessus du prix, tableau juste dessous.
4. **Sait-il ce qui se passe au clic ?** Non. **[FRICTION H1]** : à l'étape 4, « Ton compte, puis le paiement sécurisé. » ne dit pas qu'une inscription s'ouvre. Solution : annoncer les deux étapes en mots du visiteur.
5. **Feedback immédiat ?** Oui sur /register (titre, rappel du prix). Mais **[FRICTION H4]** : le bouton annonçait « Ouvrir les 5 parcours », l'écran suivant demande un compte.

## 3. Carte des trajets réels (visiteur, puis compte sans abonnement)

Convention : **écran** = page distincte vue ; **interaction** = tap ou champ rempli jusqu'à l'affichage de la page Stripe (chemin e-mail ; chemin Google entre parenthèses). Les champs Stripe eux-mêmes ne sont pas capturés `[À VÉRIFIER]`. Source des destinations : code du worktree déployé.

### 3.1 Entrées vers l'achat

| # | Entrée | Libellé actuel | Destination réelle (visiteur) | Écrans / interactions jusqu'à Stripe | Promesse tenue à l'écran suivant ? |
|---|---|---|---|---|---|
| E1 | En-tête (mobile < 640 px) | « 2,99 €/mois » | /abonnement?src=header | 3 écrans (offre, inscription, Stripe), 5 interactions (4 avec Google) | **Non** : prix sans objet, puis H1 sans « Premium » |
| E1b | En-tête (≥ 640 px) | « Premium · 2,99 €/mois » | idem | idem | **Non** : le mot « Premium » n'est pas dans le H1 |
| E2 | Accueil, haut | « Tester mes premières répliques, gratuit » | étape 1 de Répartie (gratuit, pas un achat) | n/a | Oui. Aucun accès à l'achat sans scroll (chip de l'en-tête seulement) |
| E3 | Accueil, carte Premium (visiteur) | « Ouvrir les 5 parcours · 2,99 €/mois » | /abonnement?src=accueil-premium | 3 écrans, 5 interactions ; la carte est vers le bas d'une page de 12 écrans | **Partielle** : « Ouvrir » promet l'accès, la page est une page d'offre |
| E3b | Accueil, carte (compte connecté sans abonnement) | même libellé | **Stripe direct** (`POST /api/stripe/checkout`) | 1 écran (Stripe), 1 interaction | Le même libellé a deux destinations ; le compte connecté n'a jamais vu l'offre |
| E4 | Murs /vannes, /conseils, /videos | « Voir la suite des vannes / des conseils / des vidéos · 2,99 €/mois » | /abonnement?returnTo=/vannes&src=mur-vannes | 3 écrans, 5 interactions | **Non** : on voulait la suite des vannes, le H1 parle d'une réplique en soirée et de Répartie |
| E5 | Fiches vanne, conseil, vidéo (bloc exercice) | « Écrire la mienne / Essayer ce conseil / Décrypter cette vidéo · 2,99 €/mois » | /abonnement?returnTo=<fiche>&src=exercice-… | 3 écrans, 5 interactions | **Non** : même rupture que les murs |
| E6 | Fin d'article | lien « Ouvrir les 5 parcours · 2,99 €/mois » (le plein est l'étape 1 gratuite) | /abonnement?returnTo=/parcours/<p>&src=blog-<slug> | 3 écrans, 5 interactions | **Oui** pour le titre (le H1 suit le parcours) mais « 5 parcours » n'est pas repris |
| E7 | Encart carnet (milieu d'article) | « Voir la réplique » (gratuit) | /carnet?src=… puis, au mur du carnet, « Voir tout le carnet · 2,99 €/mois » | 4 écrans (carnet, offre, inscription, Stripe) | Carnet puis page sur les parcours : rupture partielle |
| E8 | Fin d'étape 1 (visiteur) | « Passer à l'étape 2 · 2,99 €/mois » | **/register** (src=parcours-etape), puis Stripe | **2 écrans**, 4 interactions (3 avec Google) | **Oui en grande partie** : la carte « Étape 2 sur N » est juste au-dessus ; /register rappelle « Premium, 2,99 € TTC par mois. » |
| E9 | Aperçu d'une étape 2+ (visiteur) | lien `OUVRIR` en fin d'aperçu | /abonnement?returnTo=/parcours/<p>&src=parcours-apercu | 3 écrans, 5 interactions | Partielle |
| E10 | /parcours (liste) | « Tester l'étape 1 de X, gratuite » + texte « Sans compte. La suite : Premium. » (texte, pas de bouton payant) | étape 1 | n/a | Aucun accès direct à l'offre depuis la liste des parcours : la page qui présente les 5 parcours n'a pas de chemin d'achat `[À VÉRIFIER dans parcours-content.tsx]` |
| E11 | Quiz d'humour (résultat) | plein gratuit + lien `OUVRIR` | /abonnement `[À VÉRIFIER src]` | 3 écrans | Partielle |
| E12 | Quiz d'orientation (compte sans abonnement) | « Ouvrir les 5 parcours · 2,99 €/mois » | **Stripe direct** | 1 écran | Le compte n'a jamais lu l'offre |
| E13 | /carnet (visiteur) | « Voir tout le carnet · 2,99 €/mois » | /abonnement?returnTo=/carnet&src=carnet | 3 écrans, 5 interactions | **Non** : on a lu une fiche de carnet, le H1 parle de répartie en soirée (le carnet est le 2e bénéfice, en petit) |
| E14 | /glossaire, /a-propos | « Ouvrir les 5 parcours · 2,99 €/mois » | /abonnement?src=… | 3 écrans | Partielle |
| E15 | Profil (compte sans abonnement) | « Ouvrir les 5 parcours · 2,99 €/mois » | **Stripe direct** | 1 écran | Le compte peut ne jamais avoir vu l'offre (une phrase : « Chaque mois, un nouveau carnet de répartie s'ajoute aux parcours. ») |
| E16 | Favoris, vote, carte floutée (fenêtre Premium) | « Je m'abonne et je la garde / et je vote / et j'ouvre toute la liste » | visiteur : **/register** ; compte : Stripe direct | **2 écrans** (modale, inscription) puis Stripe ; 5 interactions | **Oui** : titre, prix en gros, verbe « m'abonne », REASS dans la même fenêtre |

**Lecture** : seuls E8 et E16 (et le Stripe direct pour qui a déjà un compte) tiennent leur promesse d'un écran à l'autre. Les 10 entrées qui passent par /abonnement (E1, E3, E4, E5, E6, E7, E9, E11, E13, E14) retombent sur la même page dont le titre n'écoute pas le clic. **La réparation de /abonnement vaut donc pour toutes les portes à la fois.** C'est le levier à plus fort rapport.

### 3.2 Le trajet derrière la porte

1. **/abonnement** (visiteur) : choix de formule, bouton → lien vers /register (`callbackUrl=/abonnement?…&auto=1`).
2. **/register** : « Ton compte », rappel « Premium, 2,99 € TTC par mois. », **Google en premier**, mention des CGU, e-mail, mot de passe (8 caractères minimum), bouton « Créer mon compte et passer au paiement », réassurance, « Déjà un compte ? », lien étape 1 gratuite. Bien : 2 champs seulement, Google d'abord, plus de prénom. À noter : aucun écran n'annonce « étape 1 sur 2 », la promesse est portée par le libellé du bouton.
3. **/abonnement?auto=1 (transitoire)** : la page de vente se re-rend, le bouton passe à « On t'emmène au paiement… », puis `POST /api/stripe/checkout`, puis redirection Stripe. **Rupture de logique** : le visiteur revoit la page de vente complète pendant 1 à 2 secondes (P11).
4. **Stripe Checkout** : mode `subscription`, carte uniquement (`payment_method_types: ["card"]`, les portefeuilles Apple Pay / Google Pay s'affichent si l'appareil les gère `[À VÉRIFIER]`), locale fr, bouton « S'abonner », texte de commande avec obligation de paiement, case CGU selon `STRIPE_CHECKOUT_CGU_CONSENT`. Customer pré-créé avec l'e-mail : l'e-mail est déjà rempli.
5. **/abonnement/success** : « Vérification » avec spinner (interrogation toutes les 2 s, 15 essais maximum), puis « Paiement reçu » en flash, puis redirection immédiate vers l'intention d'origine (`returnTo`) ou /parcours avec `?premium=bienvenue`. États : connexion perdue (lien /login avec retour), non vérifié (e-mail de contact, bouton « Réessayer »).
6. **Premier écran après achat** : la page d'origine (mur, fiche, parcours) ou /parcours, avec le message de bienvenue (`premium-welcome`). Non capturé `[À VÉRIFIER]` : le contenu qui était verrouillé est-il ouvert sur place, sans clic de plus ?

### 3.3 Les échecs

| Cas | Ce que voit la personne | Verdict |
|---|---|---|
| Paiement annulé sur Stripe | Retour sur /abonnement?paiement=annule : bannière « Paiement annulé, rien n'a été prélevé. Tu peux réessayer quand tu veux. » au-dessus du H1 | Message juste ; la bannière repousse le bouton (P10) |
| Échec d'ouverture (503, réseau, 500) | Toast humain, bouton réactivé, saisie conservée | OK |
| Session expirée (401) | Toast « Ta session a expiré. Reconnecte-toi… » | Pas de lien cliquable dans le toast : [FRICTION H9], ajouter « Se reconnecter » |
| Déjà abonné ou impayé (409) | `CheckoutConflictNotice` + lien /profil | OK. Mais un abonné qui arrive par URL voit toute la page de vente avant de cliquer : état « Tu es déjà Premium » à ajouter `[À VÉRIFIER : useResiliationProgrammee ne couvre que la résiliation programmée]` |
| E-mail déjà inscrit (409 sur /register) | « Cet e-mail a déjà un compte. Connecte-toi pour reprendre ton abonnement. » | Bon message, mais atteint trop tard (P9) |
| Google refusé dans une appli intégrée (Instagram, TikTok) | Bouton Google désactivé + explication ; inscription e-mail disponible | OK |
| Webhook lent | Spinner jusqu'à 30 s, puis « non vérifié » avec bouton « Réessayer » et contact | OK, honnête |

## 4. Mesures existantes (aucun chiffre inventé)

Sources : `docs/data/cta-chiffres-s21.md` (extraction du 18/10, 4,2 jours après le lot 1) et `docs/marrant/audit-conversion-s20.md` (28 jours avant). `mesure-apres-s21.md` n'existe pas. Événements Umami présents dans le code : `abonnement-vu`, `abonnement-clic` (formule, src, statut), `mur-vu`, `inscription-envoi / -reussie / -echec` (méthode, src), **`checkout-ouvert` et `checkout-echec` (codés dans le worktree, `lib/checkout-tracking.ts` ; absents des mesures du 18/10 car « jamais codés » à cette date, donc à confirmer en production)**, `abonnement-annule`, `abonnement-reussi`.

| Mesure | Période A (4,2 j, après lot 1) | Période B (28 j avant) | Lecture |
|---|---|---|---|
| Visiteurs / visites | 116 / 129 | 687 / 808 | Trafic surtout mobile en B (457 visiteurs sur 669 mobile + ordinateur portable, soit 68 %) |
| Vues de /abonnement (pages vues) | 3 | 22 | Très faible : 0,7 à 0,8 par jour |
| `mur-vu` | 20 | 23 | **Le plus grand écart visible : 20 murs vus pour 3 vues de /abonnement en 4,2 jours.** Prudence : le trafic de Thomas n'est pas exclu (2 vues de /admin en A), le chiffre peut être gonflé ; non vérifiable |
| `abonnement-clic` | 0 | 5 | 5 sur 6 visiteurs de /abonnement cliquent vers le paiement (audit s20), sur volume trop faible pour conclure |
| Inscriptions (envoi / réussie / échec) | 0 / 0 / 0 | 3 / 2 / 1 | Pas de lecture |
| `abonnement-reussi` | 0 | 1 | Probablement un test de Thomas (07/10) |
| `checkout-ouvert` / `checkout-echec` | absent | absent | À lire en production après le prochain déploiement |

**Ce que ça autorise à dire** : le goulot connu est en amont de la page (blocs d'appel : 0 clic sur 69 vues d'encart ; 20 murs pour 3 vues de /abonnement). Rien ne prouve que /abonnement convertit bien ou mal : 22 pages vues en 28 jours. Ce que ça interdit : promettre un gain chiffré. La page est refaite parce que **sa logique est cassée** (P1 à P4), pas parce qu'un chiffre le prouve. Méthode retenue par @data-analyst : avant / après sur 4 semaines, pas d'A/B (680 visiteurs par mois).

## 5. Structure cible de /abonnement (375 px d'abord)

**Principe** : une page de vente répond dans l'ordre à cinq questions. (1) Qu'est-ce que j'achète ? (2) Qu'est-ce que ça débloque, gratuit contre Premium ? (3) Combien ? (4) Pourquoi y croire ? (5) Et si ça ne me plaît pas ? Le bouton d'achat est dans le premier écran **et** les bénéfices aussi : on les met au-dessus du prix, pas dessous.

**Budget d'espace du premier écran** (375 x 700, barres de Safari comprises ; en-tête 64 px) `[À MESURER par @fullstack sur captures]` : kicker optionnel 20 + H1 64 + sous-titre 44 + preuve 20 + marges 44 + carte (3 bénéfices 84 + formules 84 + marges 40) + bouton 48 = **bas du bouton ≈ 512 px**, REASS et suite ≈ 574 px. Marge de 125 px sous le bouton à 700 px de haut, et le bouton reste visible à 560 px (iPhone SE).

### Écran 1 (0 à 700 px) : « Qu'est-ce que j'achète, combien, et je clique »

| Bloc | Pattern et contenu | Responsive et interaction |
|---|---|---|
| **B0 Bandeau de retour** (conditionnel) | Seulement si `?paiement=annule`. Une ligne ou deux, 56 px max, fond `background-elevated`, bouton de fermeture 44 px. Texte existant `PAIEMENT_ANNULE` en une phrase. | Ne repousse jamais le bouton hors du premier écran (P10). `role="status"`. |
| **B1 Haut de page** | Stack centré, une colonne. **Kicker conditionnel** (12 px, accent, 1 ligne) selon l'origine du clic : « Tu en étais à l'étape 2 de Répartie », « Tu voulais la suite des vannes », etc. (absent pour l'en-tête). **H1** 28/32 px, 2 lignes max, contient « Premium » et l'objet. **Sous-titre** 16/22 px, 2 lignes max, la mécanique (« toutes les étapes s'ouvrent d'un coup »). **Preuve** 14 px, 1 ligne : « 1 500+ inscrits bossent leur humour. » (formulation validée, sans autre chiffre accolé). | Origine lue côté serveur depuis `returnTo` et `src` (les deux sont déjà dans l'URL). Jamais de H1 différent entre mobile et ordinateur. Titre équilibré (`text-wrap: balance`). |
| **B2 Carte d'offre** | Carte à bord accent, padding 16 px. **3 bénéfices**, chacun une ligne : icône 20 px + texte 16 px gras, 7 mots maximum. Puis **choix de formule** : deux cartes radio côte à côte (2 colonnes égales, 44 px minimum de haut, ~84 px avec le prix) : « Mensuel / 2,99 € TTC / mois » et « Annuel / 24,99 € TTC / an », avec sous « Annuel » la mention « plus de 3 mois offerts » (une seule fois). Mensuel présélectionné (comportement actuel). Puis **bouton plein** pleine largeur, 48 px min, libellé selon la formule. Puis **suite** (1 ligne, 13 px) et **réassurance unique** (13 px, contraste AA). Puis lien « Déjà un compte ? Connecte-toi » (13 px, cible 44 px). | À 320 px : les deux cartes radio passent en pile (mensuel au-dessus), le bouton reste sous le prix. Groupe radio natif, flèches au clavier, `aria-live` sur le prix. Visiteur : le bouton est un lien vers /register (HTML serveur, marche sans JS). Compte connecté : `<button>` vers Stripe ; la ligne « suite » devient « Paiement sécurisé par Stripe ». |
| **B2b Barre collante** (écran 2 à fin) | Barre fixe en bas, 56 px + zone sûre, même libellé et même formule que le bouton principal. Apparaît quand le bouton principal sort du viewport, disparaît quand le bouton final y entre (IntersectionObserver). | Un seul plein visible à la fois : jamais deux boutons pleins dans le même viewport. Ne masque pas le focus (`scroll-padding-bottom`). Désactivée si `prefers-reduced-motion` demande de réduire (pas d'animation). |

### Écran 2 (700 à ~1100 px) : « Qu'est-ce que ça débloque, gratuit contre Premium ? »

| Bloc | Pattern et contenu | Responsive et interaction |
|---|---|---|
| **B3 Tableau Gratuit / Premium** | H2 (≤ 6 mots) puis **tableau 3 colonnes** : libellé (flexible), « Gratuit », « Premium » (colonne Premium en fond accent léger, bord violet). 7 lignes, hauteur de ligne 48 px, cellules ≤ 4 mots. Vrai `<table>` avec `<th scope>`. Cellule oui : ✓ + texte masqué « inclus » ; cellule non : « Non » en gris. | À 375 : colonnes ≈ 150 / 80 / 105 px ; en dessous de 340 px, les libellés passent sur 2 lignes. Dès 768 px : même tableau, largeur 100 % de la colonne de lecture. Pas de bouton dans le tableau. |

### Écran 3 : « Pourquoi y croire ? »

| Bloc | Pattern et contenu | Responsive et interaction |
|---|---|---|
| **B4 Démonstration du carnet** | Une phrase d'amorce (« Un exemple de ce que tu reçois chaque mois. »), surtitre existant « Carnet d'octobre · Situation 15, offerte », H2 « Le carnet, en vrai », fiche existante (`CarnetFicheCard extrait`), puis une ligne « Il en reste 14, et un nouveau carnet arrive chaque mois. » (N calculé : `totalFiches - 1`). Lien discret « Lire la fiche en entier » (sort de la page : en lien secondaire, pas en bouton). | Un seul bloc de carte à 375 px ; si le carnet du mois est absent, le bloc entier et la ligne 3 du tableau disparaissent. |

### Écran 4 : « Et si ça ne me plaît pas ? »

| Bloc | Pattern et contenu | Responsive et interaction |
|---|---|---|
| **B5 Pas encore sûr ?** | H2 « Pas encore sûr ? », un lien étape 1 gratuite du parcours d'origine (Répartie par défaut) : « Tester l'étape 1 de Répartie, gratuite » (libellé existant `GRATUIT_P`, déjà validé). Ligne unique : « Sans compte. » | Lien L2 existant. Cible 44 px. |
| **B6 Bouton final** | Même composant que B2 (même état de formule, même libellé), centré, avec la **réassurance unique** dessous (règle existante : sous chaque plein qui porte un prix). | C'est ici que le bouton collant disparaît. |

### Écran 5 : FAQ

**B7 FAQ de vente** : les 4 questions existantes, JSON-LD inchangé (apprendre, timide, prix, YouTube). Rien n'est retiré (règle du 29/09 sur les chiffres). Une seule retouche à soumettre à Thomas : la réponse « prix » (« C'est le prix, point. ») ne dit pas **comment** résilier ; la réassurance dit « depuis ton profil », la FAQ pourrait le répéter en une phrase (propriété du @copywriter, GO de Thomas requis car FAQ protégée).

### Ordre de lecture et ordinateur (≥ 1024 px)

Hero en deux colonnes (55 / 45) : à gauche H1, sous-titre, preuve, 3 bénéfices ; à droite la carte collante (formule, bouton, suite, réassurance). Tableau, carnet, « Pas encore sûr ? », FAQ en colonne unique de 768 px. Pas de barre collante au-dessus de 768 px (la carte reste visible à droite).

## 6. Le tableau Gratuit / Premium : lignes et faits vérifiés dans le code

Oui, il faut un tableau : c'est le bloc qui manque (P2) et c'est le seul qui répond à « qu'est-ce qui est bloqué ». Il se lit en 5 secondes et il montre que le gratuit n'est pas un piège (dernière ligne).

| # | Ligne | Gratuit | Premium | Fait vérifié (fichier) | Statut |
|---|---|---|---|---|---|
| 1 | Parcours | Étape 1 de chacun | Les 25 étapes | `LAST_FREE_PARCOURS_STEP = 1`, `canAccessParcoursStep` (`lib/parcours-access.ts`) ; étapes = 3 + 4 + 6 + 6 + 6 (`PREMIUM_PARCOURS.weeks`, `config/premium.ts`), à calculer, jamais en dur | Vérifié |
| 2 | Progression (XP, série) | Non | Oui | `canValidateParcoursStep` : validation Premium uniquement, étape 1 comprise ; `FAQ_SERIE_XP` | Vérifié |
| 3 | Carnet de répartie | 1 situation offerte | Toutes, et un nouveau carnet chaque mois | `CARNET_FREE_FICHES = 1`, `ficheOfferte`, `totalFiches` (15 en octobre ; novembre à lire dans `2026-11.json`) | Vérifié ; nombre dynamique |
| 4 | Listes de vannes, conseils, vidéos | 10, 3, 3 | Sans limite | `FREE_JOKE_LIMIT = 10`, `FREE_TIP_LIMIT = 3`, `FREE_VIDEO_LIMIT = 3` ; profil Premium : « vannes illimitées » | **À VÉRIFIER avant mise en ligne** : la limite ne s'applique qu'à la liste défilante, les fiches individuelles et pages paginées restent lisibles pour le SEO (choix du 04/10) et l'audit s20 a vu 12 pages de pagination. Si un visiteur peut lire plus de 10 vannes, la cellule « 10, 3, 3 » est fausse : libeller alors « Liste complète » (non / oui) |
| 5 | Exercice de chaque fiche | Non | Oui | `BLOC_EXERCICE` : le visiteur voit un bouton, l'abonné voit « À toi de jouer » avec l'exercice (`bloc-exercice.tsx`) | Vérifié |
| 6 | Favoris | Non | Oui | `FENETRE_PREMIUM.favori` ; avantage « Tes favoris sous la main » | Vérifié |
| 7 | Contenu du jour et quiz d'humour | Oui | Oui | Choix du 05/10 : le visiteur garde contenu du jour, quiz, recherche | Vérifié (ligne de confiance) |

**À ne pas mettre** (pas confirmé en production, règle « rien de faux ») : la lettre hebdomadaire Premium et « Ta question à l'équipe » (le formulaire reste fermé, décision du 17/10) ; le vote « Je veux ça » (périmètre flou) ; toute durée ou nombre de vannes par étape non lu dans la donnée (le « 5 vannes, 2 vidéos par étape » de l'audit n'est pas relu sur les 5 parcours `[À VÉRIFIER]`).
**Mobile** : 7 lignes de 48 px, environ 376 px avec l'en-tête, soit un écran. Si c'est trop long, supprimer la ligne 7 avant la ligne 6.

## 7. Le verbe du bouton, et ce que devient la règle « libellé payant unique »

### Reco unique : « S'abonner · 2,99 €/mois » sur /abonnement

- **Même mot que la suite du parcours** : Stripe affiche « S'abonner » (figé, `submit_type: "subscribe"`, L.221-14), la fenêtre Premium dit « Je m'abonne… ». Le visiteur lit trois fois le même verbe (H4).
- **Dit l'acte et son prix** : on sait ce qui se passe (« je m'engage chaque mois ») avant de cliquer, ce qui prépare la demande d'inscription qui suit (P4).
- **Les bénéfices sont au-dessus** : sur la page de vente, le titre et les 3 bénéfices font l'envie ; le bouton fait l'engagement. Un bouton qui répète un seul des bénéfices appauvrit les trois autres (P3).
- **Écartés** : « Passer Premium » (jargon freemium, ne dit pas qu'on paie, suppose de connaître le mot) ; « Ouvrir les 5 parcours » (verbe du gratuit, un seul bénéfice, aucun écho de Stripe). Variante hybride à soumettre à Thomas pour le duel : « S'abonner et tout ouvrir · 2,99 €/mois » (38 caractères, tient sur une ligne à 375 px en 15 px d'après la mesure de `BOUTON_PRIX_UNE_LIGNE`, à vérifier).
- Annuel : « S'abonner · 24,99 €/an ». Connecté, chargement : « On t'emmène au paiement… » (inchangé).
- **Condition** : `[CHOIX UTILISATEUR]` du 18/10 : un libellé figé peut être remplacé s'il bat l'ancien en duel à l'aveugle sur « donner envie de payer ». **Ce duel doit se jouer sur le trajet** (grille du §11), pas sur le bouton isolé.

### La règle « libellé payant unique `OUVRIR` » : à remplacer par « un verbe par geste »

Constat : la règle a produit un libellé qui ne dit plus l'acte, identique pour trois gestes différents (aller voir l'offre, payer, déjà payer). Règle de remplacement :
- **Verbe de porte** (le clic mène à la page d'offre) : un libellé qui **dit ce qu'on vient chercher** (Ouvrir, Voir…) **et que le titre de /abonnement reprend mot pour mot**. C'est le test du « Premium » dans le H1 et de « 5 parcours » dans le sous-titre.
- **Verbe d'achat** (le clic mène à l'inscription ou à Stripe) : **« S'abonner »**, ou « Je m'abonne et… » avec un objet.
- Le prix reste dans tous les boutons payants (le `[CHOIX]` 1.1 de l'étalon, rouvert le 18/10, n'est pas touché).

### Surfaces concernées (libellé actuel, destination, reco)

| # | Surface | Libellé actuel | Destination | Reco |
|---|---|---|---|---|
| 1 | /abonnement (visiteur et compte connecté) | « Ouvrir les 5 parcours · 2,99 €/mois » | inscription puis Stripe, ou Stripe | **« S'abonner · 2,99 €/mois »** (annuel : « … 24,99 €/an ») |
| 2 | En-tête ≥ 640 px | « Premium · 2,99 €/mois » | /abonnement | **Garder.** Le H1 de /abonnement reprend « Premium ». |
| 3 | En-tête < 640 px | « 2,99 €/mois » | /abonnement | **« Premium · 2,99 € »** si la largeur tient à 320, 360 et 375 px, sinon « Premium » seul (le prix est dans le premier écran de la page) `[À MESURER]`. Un prix sans objet n'est pas un libellé. |
| 4 | Accueil, carte Premium (visiteur) | « Ouvrir les 5 parcours · 2,99 €/mois » | /abonnement | **Garder** comme verbe de porte (le sous-titre de la page reprend « les 5 parcours »). Duel de trajet possible contre « Voir Premium · 2,99 €/mois ». |
| 5 | Accueil, carte Premium (compte connecté) | même libellé | Stripe direct | **« S'abonner · 2,99 €/mois »** (la destination change, le libellé doit changer) |
| 6 | Murs /vannes, /conseils, /videos | « Voir la suite des vannes (conseils, vidéos) · 2,99 €/mois » | /abonnement | **Garder** : libellé contextuel déjà bon. À réparer : le kicker de la page doit reprendre « la suite des vannes » (B1). |
| 7 | Fiches (bloc exercice) | « Écrire la mienne », « Essayer ce conseil », « Décrypter cette vidéo » + prix | /abonnement | **Garder**, mais kicker de page « Tu voulais écrire ta vanne » (B1) et ligne 5 du tableau mise en avant |
| 8 | Fin d'article (lien) | « Ouvrir les 5 parcours · 2,99 €/mois » | /abonnement | **Garder** (verbe de porte, H1 par parcours) |
| 9 | /carnet (mur du carnet) | « Voir tout le carnet · 2,99 €/mois » | /abonnement | **Garder** ; kicker « Tu voulais tout le carnet » ; ligne 3 du tableau et B4 en haut de page pour cette origine |
| 10 | Fin d'étape 1 | « Passer à l'étape 2 · 2,99 €/mois » | /register | **Garder** (écho de la carte « Étape 2 sur N »). Variante de duel : « S'abonner et ouvrir l'étape 2 · 2,99 €/mois » si ≤ 40 caractères. |
| 11 | Aperçu d'étape 2+ | lien `OUVRIR` | /abonnement | **Garder**, avec kicker « Tu en étais à l'étape N de X » |
| 12 | Fenêtre Premium (favori, vote, carte floutée) | « Je m'abonne et je la garde / et je vote / et j'ouvre toute la liste » | /register ou Stripe | **Garder** : c'est déjà le verbe recommandé, et la référence du trajet |
| 13 | Quiz d'humour (lien) | lien `OUVRIR` | /abonnement | **Garder** (porte) |
| 14 | Quiz d'orientation (compte sans abonnement) | « Ouvrir les 5 parcours · 2,99 €/mois » | Stripe direct | **« S'abonner · 2,99 €/mois »** |
| 15 | Profil (compte sans abonnement) | « Ouvrir les 5 parcours · 2,99 €/mois » | Stripe direct | **« S'abonner · 2,99 €/mois »** ; ajouter une phrase qui dit ce qu'on achète (le compte n'a pas vu l'offre) |
| 16 | /glossaire, /a-propos | « Ouvrir les 5 parcours · 2,99 €/mois » | /abonnement | **Garder** (porte) |
| 17 | /register | « Créer mon compte et passer au paiement » | création de compte puis Stripe | **Garder** : dit les deux gestes |
| 18 | Stripe | « S'abonner » | paiement | **Figé** (obligation de paiement) |

**Bilan** : 5 surfaces changent de libellé (lignes 1, 3, 5, 14, 15), 13 restent. Le vrai travail n'est pas dans les libellés, il est dans **l'écho du titre de la page** (les 10 portes vers /abonnement).

## 8. Inscription avant ou après le paiement

**Ce que le code exige aujourd'hui** (vérifié) :
- `POST /api/stripe/checkout` renvoie 401 sans session (`route.ts` l.52) ; `createCheckoutSession(userId, email, …)` crée ou retrouve le client Stripe, refuse un second abonnement (`AlreadySubscribedError`) et pose `metadata: { userId, plan }` sur la session et l'abonnement.
- L'activation du plan, la page de retour (`/api/stripe/status`, `/api/stripe/verify-session` qui renvoie 403 pour la session d'un autre compte), la résiliation et le remboursement des 14 jours sont tous indexés sur `userId`.
- Le compte est donc **un prérequis technique du paiement**, pas une simple étape de saisie. L'état « connexion » de la page de retour (`success/page.tsx`) anticipe un utilisateur sans session, mais c'est un filet, pas un parcours.

**Ce que Stripe permettrait** : une session Checkout en mode abonnement sans `customer` (l'e-mail est saisi sur la page Stripe et un client est créé ; à confirmer à l'implémentation). Il faudrait alors, au webhook, **créer ou rattacher un compte par e-mail**, puis envoyer un lien de connexion ou de création de mot de passe.

**Reco : compte avant le paiement pour cette V1, avec la friction réduite à son minimum ; « paiement d'abord » instruit mais non décidé.**

| Argument | Compte avant (actuel, réduit) | Paiement d'abord |
|---|---|---|
| Friction visible | 2 champs ou Google, un écran de plus | 0 écran avant Stripe, portefeuilles mobiles possibles (gain probable, non mesuré) |
| Pire échec | Compte créé, paiement abandonné : récupérable | **Payé sans accès** si l'e-mail de connexion n'arrive pas ou si un compte existe déjà avec cet e-mail : c'est l'échec le plus coûteux en confiance |
| Coût | Aucun | Élevé : webhook de création et de rattachement de compte, e-mails de connexion, cas du compte existant, limitation d'abus sans compte (compteur actuel par utilisateur), CGU et rétractation à accepter avant paiement, tests de bout en bout |
| Risque | Faible | Sécurité et paiement ; @legal à consulter (acceptation des CGU) |
| Preuve que c'est le goulot | **Aucune** : 22 pages vues de /abonnement en 28 jours, 3 inscriptions envoyées | Aucune |

**À faire maintenant pour réduire la friction sans changer l'architecture** : (1) Google en premier : déjà fait ; (2) supprimer le flash de la page de vente entre l'inscription et Stripe (P11) : après l'inscription, une page d'attente minimale « On t'emmène au paiement… » au lieu de la page complète ; (3) annoncer « d'abord ton compte, puis le paiement » dans la ligne de suite (P4) ; (4) « Déjà un compte ? Connecte-toi » sur /abonnement (P9) ; (5) lire `inscription-envoi`, `inscription-reussie`, `checkout-ouvert`, `abonnement-reussi` ; **si l'écart entre `inscription-envoi` et `checkout-ouvert` devient le premier trou mesuré sur un volume suffisant (seuil à fixer avec @data-analyst, `[HYPOTHÈSE]`), ouvrir le chantier paiement d'abord**.

## 9. Budget de mots revu pour une page de vente

La règle de concision par bloc reste valable **dans chaque bloc**. Ce qui change : le plafond de la page, parce que /abonnement est la destination des 10 portes et non un bloc d'appel.

| Bloc | Budget | Brouillon de référence (pour compter) |
|---|---|---|
| B1 titre, sous-titre, preuve | ≤ 30 (kicker contextuel +8) | H1 6 + sous-titre 13 + preuve 5 = 24 |
| B2 bénéfices, formules, bouton, suite, réassurance, lien compte | ≤ 60 | 3 x 6 + formules 15 + bouton 3 + suite 8 + réassurance 11 + lien 5 = 60 |
| B3 tableau | ≤ 70 | H2 5 + en-têtes 3 + 7 lignes x 9 = 71, à resserrer d'un mot |
| B4 démonstration du carnet (hors texte de la fiche) | ≤ 36 | amorce 9 + surtitre 6 + H2 4 + ligne N 12 + lien 5 |
| B5 pas encore sûr | ≤ 14 | H2 3 + lien 7 + « Sans compte. » 2 |
| B6 bouton final | ≤ 14 | bouton 3 + réassurance 11 |
| **Total hors FAQ et hors fiche du carnet** | **≤ 230** | **≈ 224** |

Comparaison : 316 mots avant la concision (inventaire du 18/10), 120 mots de budget actuel. Les 230 mots sont **structurés** : ils répondent chacun à l'une des cinq questions, aucun ne répète un autre.

**Règles de concision adaptées** (à valider par Thomas, les 12 règles du §4 de l'inventaire restent valables ailleurs) :
- Règle 9 : « 120 mots pour /abonnement » devient « 230 mots hors FAQ et fiche du carnet ».
- Règle 10 (« un fait, une fois par page ») : un fait peut apparaître **deux fois** sur /abonnement, une fois comme affirmation (tableau) et une fois comme action (le lien étape 1 gratuite). La réassurance et le bouton sont répétés par construction (règle existante : sous chaque plein qui porte un prix).
- Règle 11 (« 4 lignes de 9 mots ») : remplacée par **3 bénéfices de 7 mots maximum + le tableau**.
- Nouvelle règle : **un titre de page de destination reprend les mots du bouton qui y mène** (test d'écho).
- Garder : titre ≤ 10 mots, phrase ≤ 15 mots, bouton ≤ 7 mots, réassurance ≤ 12 mots, cellule de tableau ≤ 4 mots, lien secondaire de 4 à 8 mots.

## 10. Recommandations classées par impact sur la conversion

Impact = nombre de portes concernées x distance à la décision d'achat. Les volumes étant trop faibles pour un test A/B (680 visiteurs par mois), « test nécessaire » veut dire : **relecture de trajet à l'aveugle (grille §11) avant mise en ligne, puis avant / après sur 4 semaines**.

| Rang | Changement | Type | Coût | Risque | Test |
|---|---|---|---|---|---|
| 1 | **Refaire /abonnement en page de vente** (§5 : titre avec « Premium », 3 bénéfices et formule dans le premier écran, tableau, démonstration du carnet, « Pas encore sûr ? », bouton final) | trajet, logique, texte | Moyen : un lot (@copywriter textes, @design composition, @fullstack composants ; les blocs carnet, FAQ, sélecteur existent) | Faible à moyen : page à faible trafic, SEO inchangé (metas, JSON-LD), retour arrière simple ; surveiller le décalage de mise en page | **Oui** (grille sur les 5 trajets) |
| 2 | **Verbe « S'abonner »** sur /abonnement, accueil connecté, quiz d'orientation, profil (§7) | texte | Très faible | Faible : moins d'« envie » si les bénéfices ne sont pas au-dessus | **Oui** (duel de trajet entre les 3 étalons) |
| 3 | **Écho du clic** : kicker et ligne du tableau mis en avant selon l'origine (mur, fiche, carnet, étape, en-tête), H1 qui contient « Premium » | logique, texte | Faible à moyen : lire `returnTo` et `src` côté serveur, 6 phrases de kicker (les titres de parcours validés servent de kickers, rien à réécrire pour eux) | Faible | Oui |
| 4 | **En-tête mobile avec objet** (« Premium · 2,99 € » ou « Premium ») | texte | Très faible | Faible si la largeur tient | Mesure 320 / 360 / 375 px |
| 5 | **Supprimer le flash de la page de vente après l'inscription** (page d'attente minimale avant Stripe) | trajet | Faible à moyen | Moyen : toucher `auto=1` (tests `abonnement-auto-checkout-s15`) | Playwright achat + capture |
| 6 | **« Déjà un compte ? Connecte-toi » sur /abonnement**, lien « Se reconnecter » dans l'erreur 401, état « Tu es déjà Premium » | logique | Faible | Faible | Non (revue) |
| 7 | **Barre collante du bouton** sur mobile, écrans 2 à 5 | trajet | Faible à moyen | Moyen : chevauche le contenu, focus masqué (WCAG 2.2 AA 2.4.11) | Captures 3 appareils + clavier |
| 8 | **/parcours : chemin d'achat** (aujourd'hui texte « La suite : Premium. », sans lien payant `[À VÉRIFIER]`) | trajet | Faible | Faible | Oui |
| 9 | **Compte connecté (profil, accueil, quiz d'orientation) : dire ce qu'on achète avant Stripe** (une phrase d'objet, ou passer par /abonnement) | logique, texte | Faible | Faible | Non |
| 10 | **Mesure** : lire `checkout-ouvert` en production ; ajouter `abonnement-formule`, `abonnement-sticky-clic`, `abonnement-tableau-vu`, origine (kicker) ; exclure le trafic de Thomas | mesure | Faible | Faible | n/a |
| 11 | **Paiement d'abord** (compte créé au webhook) | trajet | Élevé | Élevé (payé sans accès, abus, CGU) | Seulement si le trou est mesuré (§8) |
| 12 | **Fenêtre Premium à la place de la page pour les murs et fiches** (saute un écran) | trajet | Moyen | Moyen : le visiteur achète sans le tableau | À instruire après 4 semaines de mesure |
| 13 | **Annuel présélectionné** | logique | Très faible | Moyen : D5 s16 a fixé le mensuel par défaut | Non, pas maintenant |

**Écartés explicitement** : photo ou identité du fondateur, témoignages (aucun vrai témoignage ; les exemples fictifs restent présentés comme tels), compteur de membres abonnés (2 abonnés), promesse de résultat (« tu seras drôle »), mention juridique dans les boutons.

## 11. Grille de relecture « trajet » (relecteurs à l'aveugle)

**Principe** : on note un **trajet enchaîné**, jamais un texte isolé. Cause du bug s21 : chaque bloc était noté seul. Le relecteur reçoit une suite de captures à 375 px, dans l'ordre où la personne les voit, sans nom d'auteur ni version.

**Les 5 trajets à jouer** (un dossier de captures chacun) :
- **T1 En-tête** : accueil (état au moment du clic) → /abonnement (premier écran, puis défilement complet) → /register → Stripe (capture ou maquette fournie, à dire) → écran de retour.
- **T2 Mur de liste** : /vannes au mur (10 vannes vues) → /abonnement → /register.
- **T3 Fin d'étape 1** : carte « Étape 2 sur N » et bouton → /register.
- **T4 Fenêtre Premium** : clic sur le cœur d'une fiche → fenêtre → /register.
- **T5 Fin d'article** : bloc de fin → /abonnement.

**Les 5 critères, chacun noté sur 10, avec une phrase de preuve (capture et position)**

| Critère | Ce que le relecteur vérifie | Barème |
|---|---|---|
| 1. Clarté de l'offre en 3 secondes | Sur le premier écran de /abonnement, sans défiler : peut-il écrire en une phrase ce qu'il achète, combien, et ce qui est bloqué en gratuit ? | 10 = les trois en 3 s ; 7 = il devine un des trois ; 4 = il ne sait pas ce qu'il achète |
| 2. Promesse tenue d'un écran à l'autre | Le mot du bouton cliqué se retrouve-t-il dans le titre suivant ? Le contexte (mur, fiche, étape) est-il reconnu ? Aucune rupture (flash, page qui change de sujet) ? | 10 = écho exact à chaque écran ; -2 par rupture |
| 3. Nombre de clics et d'écrans | Compter écrans et interactions jusqu'à Stripe (T1, T2, T5 : 3 écrans ; T3, T4 : 2 écrans ; Google : -1 interaction) | 10 = au minimum du trajet ; -1 par écran ou champ superflu ; -2 par écran qui répète un autre |
| 4. Envie | « Donner le plus envie de payer » (critère fondateur du 18/10) : le bénéfice vécu vient-il avant la description ? Le bouton est-il le geste naturel après ce qu'on vient de lire ? | à noter par trajet, pas par phrase |
| 5. Confiance | Prix TTC lisible, garantie visible près du bouton (pas en gris minuscule), étape suivante annoncée en mots simples (« d'abord ton compte, puis le paiement »), aucune surprise (champs, mot « compte ») | 10 = aucune question sans réponse ; -2 par surprise |

**Règles de notation**
- Une note sans preuve (capture + position) ne compte pas. Aucune note sur un trajet incomplet.
- **Garde-fou objectif** (quel que soit le vote) : faute objective = bouton qui promet ce que l'écran suivant ne tient pas ; fait faux (étape gratuite, limite, prix, délai) ; mention juridique dans un bouton ; « 1 500+ » modifié ; tiret cadratin ; promesse de résultat.
- **Seuil de validation** (règle d'or P0) : 3 relecteurs, **2 sur 3 à 9 minimum sur chacun des 5 critères** pour chacun des trajets T1 à T5 ; départage par un 3e avis si divergence ; la version corrigée repasse la grille.
- Test des 5 secondes en plus : on montre le premier écran de /abonnement 5 secondes, on demande « qu'est-ce qu'on te vend, et combien ? ».
- Deux relectures par captures en 375 x 700 et 320 x 640 ; le trajet est noté sur le plus étroit des deux.

## 12. Ce qui reste au @copywriter

**À écrire** (tutoiement, zéro tiret cadratin, zéro promesse de résultat, « 1 500+ » et prix intacts, texte dynamique pour tout nombre) :
1. H1 et sous-titre de /abonnement (3 étalons ci-dessous) ; 3 bénéfices de 7 mots maximum.
2. Les 7 lignes du tableau (libellé 3 mots, cellules 4 mots) ; nombres lus dans la donnée (étapes, situations du carnet, limites 10, 3, 3).
3. La ligne de suite sous le bouton (visiteur) : « Tu crées ton compte, puis tu paies par carte. » ou « D'abord ton compte, puis le paiement. » ou « Compte avec Google ou e-mail, puis paiement par carte. » (3 candidates, 1 phrase, ≤ 12 mots).
4. Les kickers par origine : mur vannes, conseils, vidéos ; fiche vanne, conseil, vidéo ; carnet ; fin d'étape 1 et aperçu (parcours N) ; l'en-tête n'en a pas. Les titres de parcours déjà validés (« Faire rire au bureau, au bon moment », « Rire à table, sans monter sur scène », « Ton histoire jusqu'à la chute, avant le « et donc ? » », « Ta réplique en soirée, pas dans le bus du retour ») sont **réutilisés** comme kickers ou sous-titres de parcours : aucune réécriture, pas de nouveau duel.
5. Amorce du carnet et ligne « Il en reste N » (≤ 12 mots).
6. Libellé court de l'en-tête sous 640 px.
7. Bandeau « paiement annulé » compact (une phrase) ; message « Tu es déjà Premium » ; « Se reconnecter » du toast 401 ; phrase d'objet pour le profil et la carte d'accueil d'un compte connecté.
8. FAQ « prix » : ajouter « Résiliable depuis ton profil. » (FAQ protégée : GO de Thomas).

**Process** : chaque texte repasse la relecture à l'aveugle (règle d'or) **dans le trajet** (§11). Pas de texte validé isolément.

### Les 3 étalons à soumettre à Thomas (titre, sous-titre, bouton)

**É1 : l'objet d'abord (reco de @ux)**
- H1 : « Premium : les 5 parcours en entier »
- Sous-titre : « Toutes les étapes s'ouvrent d'un coup, avec un carnet de répartie chaque mois. »
- Bouton : « S'abonner · 2,99 €/mois »
- Pourquoi : le mot du clic est dans le titre, l'objet est nommé, la mécanique (« d'un coup ») est le vrai différenciant de Premium (choix du 18/10 : toutes les étapes ouvertes).

**É2 : la scène d'abord, le nom en tête de titre**
- Kicker : « Premium »
- H1 : « Ta réplique en soirée, pas dans le bus du retour » (titre validé, conservé)
- Sous-titre : « Les 5 parcours en entier, ouverts d'un coup, et tout le catalogue. »
- Bouton : « S'abonner et tout ouvrir · 2,99 €/mois » (38 caractères, vérifier la ligne unique à 375 px)
- Pourquoi : garde le hook que Thomas a déjà validé ; le bouton porte à la fois l'acte et le bénéfice. Risque : le titre ne dit pas l'objet, le sous-titre le dit.

**É3 : l'acte dans le titre**
- H1 : « Abonne-toi à Premium : tout s'ouvre d'un coup »
- Sous-titre : « 5 parcours en entier, un carnet de répartie par mois, tout le catalogue. »
- Bouton : « Passer Premium · 2,99 €/mois »
- Pourquoi : le plus direct (verbe d'achat dans le titre), mais « Passer Premium » reste du jargon ; sert de contre-épreuve.

**Reco** : É1 pour la page, bouton « S'abonner · 2,99 €/mois ». Le duel à jouer sur la grille du §11 : É1, É2, É3 sur T1 et T2.

## 13. Tests UX, mesure et cas limites

| Test | Critère | Résultat attendu de la structure cible |
|---|---|---|
| Parcours persona (Yanis, 20 ans, introverti, budget serré) sans aide | frictions documentées | P1 à P11 corrigés ; l'étape 1 gratuite sans compte est visible deux fois (tableau, « Pas encore sûr ? ») : pas de pression, pas de contact humain demandé |
| Charge cognitive | ≤ 3 actions principales par écran | Écran 1 : bouton, choix de formule, lien « Déjà un compte ? » = 3 ; écrans suivants : 1 (bouton collant) + lien étape 1 |
| Time-to-value | inscription → premier résultat concret ≤ 3 étapes | En-tête → Stripe : 3 écrans (offre, inscription, paiement), plus le retour sur l'intention d'origine ; fin d'étape 1 et fenêtre : 2 écrans. Justifié : le paiement ne se raccourcit pas sans changer l'architecture (§8) |
| Cas limites | vide, erreur, chargement, connexion lente, retour après 30 jours | Voir ci-dessous |
| Accessibilité WCAG 2.2 AA | clavier, focus, cibles ≥ 44 px, contrastes | Voir ci-dessous |

**Cas limites** : annuel indisponible (flag serveur : formules masquées, mensuel seul, page inchangée) ; carnet du mois absent (B4 et ligne 3 du tableau masqués) ; Boulot ou Storytelling non publiés (comptes d'étapes recalculés) ; page chargée sans JavaScript (bouton visiteur = lien dans le HTML serveur, formule mensuelle) ; connexion lente (bouton désactivé avec « On t'emmène au paiement… », saisie jamais perdue) ; retour de Stripe annulé (bannière compacte, bouton resté au premier écran) ; abonné qui revient par URL (état « Tu es déjà Premium », lien /profil) ; visiteur revenu après 30 jours (même page, kicker absent, « Déjà un compte ? » visible) ; navigateur intégré (Google désactivé, e-mail disponible).

**Accessibilité** : tableau en `<table>` avec `<th scope>` et légende ; ✓ doublé d'un texte masqué « inclus » et « Non » écrit (jamais la couleur seule) ; groupe radio natif pour la formule (flèches, `aria-live` sur le prix) ; réassurance et suite en `text-secondary` à 13 px (le gris `text-muted` à 12 px actuel est à mesurer, contraste AA 4,5 : 1 `[À MESURER]`) ; barre collante sans masquage du focus (`scroll-padding-bottom`, WCAG 2.2 critère 2.4.11) ; cibles 44 px (bouton, cartes de formule, liens) ; titres h1, h2 dans l'ordre ; `prefers-reduced-motion` respecté.

### Métriques HEART

| Dimension | Signal observable | Cible | Mesure |
|---|---|---|---|
| Task success (primaire) | `abonnement-vu` → `abonnement-clic` → `inscription-envoi` → `inscription-reussie` → `checkout-ouvert` → `abonnement-reussi` | complétion des parcours critiques ≥ 90 % (défaut du framework) pour les étapes techniques ; **cible de conversion non chiffrée tant que le volume est de 0,7 vue de /abonnement par jour** | Entonnoir Umami, avant / après sur 4 semaines, trafic interne exclu |
| Adoption | clic bouton payant par emplacement et par origine (`src`) | > 0 clic par porte, point de départ 0 sur 69 vues d'encart | `abonnement-clic` par `src` |
| Engagement | profondeur de défilement, vue du tableau (`abonnement-tableau-vu`), clics sur le lien étape 1 | 80 % des visiteurs voient le tableau (cible de l'audit charge de lecture) | Événements à ajouter |
| Happiness | questionnaire court après achat (hors périmètre) | CSAT ≥ 8/10 (défaut) | à voir avec @data-analyst |
| Retention | non concerné par cette page | n/a | n/a |

## 14. Agents recommandés et handoff

| Agent | Type | Rôle | Justification liée au parcours | Priorité |
|---|---|---|---|---|
| testeur-persona Yanis | testeur | Joue T1 à T5 sur captures 375 px et note la grille du §11 comme le persona | La relecture à l'aveugle actuelle note des textes ; il faut un relecteur qui vit le trajet (cause du bug) | Haute |
| relecteur de trajet (3 instances, aveugle) | validateur | Applique la grille §11, 2 sur 3 à 9 sur chaque critère | Règle d'or P0 et choix du 18/10 : la version corrigée repasse la relecture | Haute |
| expert Stripe Checkout | workflow métier | Instruire le paiement d'abord (§8) et les portefeuilles mobiles sur le compte réel | Seul moyen de chiffrer le coût et le risque avant décision | Basse (après mesure) |

**Handoff → @orchestrator** (puis @copywriter, @design, @fullstack)
- Fichier produit : `/home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774/docs/ux/trajet-conversion-s21.md`.
- Décisions prises : /abonnement devient une page de vente en 6 blocs (§5) ; bouton « S'abonner » ; deux familles de boutons, porte et achat (§7) ; compte avant paiement conservé pour la V1 (§8) ; tableau Gratuit / Premium de 7 lignes (§6) ; budget de page 230 mots (§9).
- Points d'attention : ligne 4 du tableau à vérifier avant mise en ligne (la limite 10, 3, 3 ne vaut que pour la liste défilante) ; aucun chiffre de conversion fiable (volumes) ; texte de production non curlé (pas de shell) ; Stripe et premier écran après achat non capturés ; `checkout-ouvert` à lire en production ; éléments à ne pas promettre : lettre hebdomadaire Premium, « Ta question à l'équipe » (fermés) ; FAQ protégée (GO de Thomas pour toute retouche) ; aucun code touché.
- Auto-évaluation : écrans justifiés par un besoin du persona (oui) ; edge cases et états d'erreur couverts (oui) ; aha moment en 3 écrans, justifié (oui) ; features IA : sans objet ; wireframes assez précis pour coder sans question de disposition (oui, sauf mesures `[À MESURER]` en pixels, à confirmer sur captures).
