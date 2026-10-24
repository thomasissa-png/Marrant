# Mesure après les deux mises en ligne s21

Rédigé le 19/10/2026 (@data-analyst). Sert au bilan (~10/11) et aux rapports du lundi.
Chemins `src/...` = `apps/web/src/...`. `RA` = `REPLIT_ACTIONS.md`. Aucun chiffre de production lu ici : tout vient du code et des journaux de mise en ligne.

Deux mises en ligne : 18/10 20:11 UTC (22:11 Paris), version `586c4adc`, commit `43c222f` (RA:162) ; 19/10 03:22 UTC (05:22 Paris), version `20be1a8b`, commit `bb470f3` (RA:166).

## 1. Ruptures de série au 19/10

Le rapport du lundi 19/10 (envoi lundi 7 h à 8 h Paris, `src/lib/analytics/weekly-visits-job.ts:5`) part de `bb470f3` (RA:179). La mention « il part de `43c222f` » (RA:16) est périmée : elle date d'avant la deuxième mise en ligne.

**Premier e-mail avec la nouvelle formule : celui du 19/10 (semaine du 12/10 au 18/10). Dernier avec l'ancienne : celui du 12/10.**

| Chiffre | Changement | Source |
|---|---|---|
| Comptes créés | comptes de test exclus | `weekly-funnel.ts:103` |
| Abonnés actifs, revenu mensuel (photo « aujourd'hui ») | comptes de test exclus | `weekly-funnel.ts:100,108-111,119` |
| Nouveaux abonnés, résiliations effectives | on retire les abonnements de test créés ou terminés sur la période (jamais sous zéro) | `weekly-funnel.ts:122-124` |
| Résiliations programmées | comptes de test exclus | `weekly-funnel.ts:107` |
| Abonnés actifs | ventilés « N (a mensuels, b annuels, c à resynchroniser) » ; « à resynchroniser » = intervalle de facturation absent en base | `weekly-funnel.ts:134-146,244-251` |
| Section « Lettre mensuelle » | nouvelle : inscrits par statut et emplacement, inscriptions / confirmations / désinscriptions de la semaine, numéros ; comptes de test exclus | `src/lib/analytics/weekly-lettre.ts:1-14,39-50` |
| Ligne « Stock du contenu » | nouvelle, en tête ; alerte « Nouveau lot à préparer » sous 14 jours | `weekly-visits-job.ts:10-13`, `weekly-stock.ts:30-37` |
| Mention « N compte(s) de test exclu(s). » | nouvelle, sous le funnel (admin : « 3 comptes de test exclus », RA:176) | `weekly-funnel.ts:275-281,294` |

Ce qui ne casse PAS : le bloc « Parcours » et les alertes parcours excluaient déjà les comptes de test depuis s17 (`src/lib/analytics/comptes-test.ts:1-8`, `weekly-parcours.ts:7`).

**Comment comparer avant / après**
1. Ne pas enchaîner la série : le 19/10 est une nouvelle base. Les chiffres du 12/10 et avant incluent les comptes de test.
2. Pour relier les deux séries, lire la ligne « N compte(s) de test exclu(s) » du 19/10 : l'écart attendu sur abonnés actifs et revenu mensuel est au plus la contribution de ces N comptes. Le code ne donne pas cette contribution par indicateur : si elle est utile au bilan, la lire en base (comptes de test = e-mails de `ANALYTICS_EMAILS_EXCLUS`) ou demander l'écart à @fullstack.
3. Limite : « Paiements reçus au total » ne retire que le premier paiement des comptes de test, pas leurs renouvellements (`weekly-funnel.ts:122`). Donc « Renouvellements » (paiements moins nouveaux abonnés, `weekly-funnel.ts:81-83`) peut garder un renouvellement de test. Impact attendu faible tant que les comptes de test sont récents ; à surveiller à partir de novembre.
4. Contrôle de l'admin : onglet Semaine, « Semaine du rapport » (`src/components/admin/semaine-tab.tsx:32`) doit afficher « Semaine du 12/10 au 18/10 » après 7 h Paris le 19/10 (avant 7 h : « 05/10 au 11/10 », RA:179 ; règle `weekly-visits-period.ts:85`, `heureEnvoi = 7`). Ses chiffres doivent égaler l'e-mail (même fonction `prismaFunnelCounter`, RA:13).

## 2. Sources `src` de `checkout-ouvert` / `checkout-echec`

**`checkout-ouvert` et `checkout-echec` sont nés avec s21** (`src/lib/checkout-tracking.ts:1-13`) : il n'existe aucune série « avant ». Pour l'avant, il reste `abonnement-clic`, `abonnement-vu`, `inscription-reussie` et Stripe.

Valeur absente ou invalide : `inconnu` (`checkout-tracking.ts:21-25`). Sur `/abonnement`, source = `?src=` d'entrée, sinon `abonnement` (`src/components/premium/abonnement-view.tsx:169`). `checkout-echec` a aussi `raison` : `erreur`, `conflit`, `reseau`, `retour-sans-paiement` (`checkout-tracking.ts:17`).

**Supprimée : `accueil-hero`** (série close le 18/10 20:11 UTC ; `src/components/home/hero-section.tsx:97`, RA:51, `docs/marrant/audit-conversion-s20.md:90`).

**Modifiée : `parcours-etape`** (fin d'étape 1, visiteur) mène directement à `/register?src=parcours-etape`, plus par `/abonnement` (`src/components/parcours/parcours-detail.tsx:133-142`). Elle ne passe plus par `abonnement-vu` ; on la lit dans `inscription-envoi` / `inscription-reussie` puis `checkout-ouvert` (RA:53). La source est reportée sur `/abonnement` après inscription (`src/lib/premium-return.ts:112-115`).

**Sources actives dans le code (vérifiées)**

| `src` | Origine | Fichier:ligne |
|---|---|---|
| `header` | bouton Premium de l'en-tête | `src/components/layout/header.tsx:114` |
| `accueil-premium` | carte Premium de l'accueil (paiement direct pour un compte sans abonnement) | `src/components/home/carte-premium-achat.tsx:17,42` |
| `carnet` ; ou `?src=` d'arrivée (ex. `blog-demo-milieu-N`) | paywall du carnet | `src/components/carnet/carnet-page.tsx:15,22-23` ; `src/components/blog/demo-vanne.tsx:34` |
| `glossaire` | fin de `/glossaire` | `src/app/(dashboard)/glossaire/page.tsx:155` |
| `parcours-liste` | `/parcours` | `src/app/(dashboard)/parcours/(liste)/page.tsx:115` |
| `favoris` | mur des favoris et redirection de `/favoris` | `src/middleware.ts:19`, `src/components/favoris/favoris-list.tsx:202` |
| `recherche` | « passe en Premium » de la recherche | `src/components/ui/search-bar.tsx:256` |
| `a-propos` | fin de `/a-propos` | `src/app/(dashboard)/a-propos/page.tsx:239` |
| `onboarding-visiteur` | `/onboarding` sans session | `src/middleware.ts:21,40` |
| `parcours-etape` | voir ci-dessus | `parcours-detail.tsx:141` |
| `parcours-apercu` | lien de l'aperçu d'étape | `src/components/parcours/step-blocks.tsx:55` |
| `quiz`, `onboarding` | résultat du quiz humour ; quiz d'accueil (compte connecté) | `src/lib/quiz-resultat-textes.ts:38` ; `src/components/onboarding/humor-quiz.tsx:139,240` |
| `blog-<slug>` | fin d'article | `src/components/blog/blog-article-view.tsx:139`, `article-cta.tsx:101` |
| `mur-<liste>`, `exercice-<type>`, `modale-<raison>` | murs de listes, exercices, fenêtre Premium | `src/components/premium/mur-liste.tsx:18`, `bloc-exercice.tsx:61`, `premium-modal.tsx:54,88` |
| `paywall`, `profil` | paiement direct depuis ces écrans | `src/components/marketing/premium-paywall.tsx:63`, `src/components/profil/profil-dashboard.tsx:76` |

Nouvelles d'après RA:50 : `header`, `accueil-premium`, `carnet`, `glossaire`, `parcours-liste`, `favoris`, `recherche`, `a-propos`, `onboarding-visiteur`. Je n'ai pas pu vérifier sans historique git lesquelles des autres existaient avant s21.

**Corrections à la liste du brief (vérifiées dans le code)**
- `retour-inscription` n'est PAS une source de `checkout-*`. C'est la valeur de `src` de `abonnement-vu` quand la page s'ouvre avec `auto=1` après inscription (`abonnement-view.tsx:134-135`, RA:56). Le paiement qui suit garde la source d'entrée (`premium-return.ts:112-115`).
- `glossaire-etape1`, `a-propos-etape1`, `register-etape1` ne sont PAS des sources de `checkout-*`. Ce sont des valeurs de `src` de `parcours-ouvert` (liens vers l'étape 1 ; `src/lib/parcours-tracking.ts:25-29`, RA:57). Elles mesurent l'entrée dans un parcours. Leur effet sur le paiement se lit plus loin, via `parcours-etape`.
- Dans `parcours-ouvert`, `register-etape1` remplace ce qui était compté `abonnement` (RA:57) : rupture de série sur `parcours-ouvert`, `abonnement` baisse.

**`abonnement-clic` : à lire en complément, pas comme indicateur principal.** 6 appels dans le code : `carte-premium-achat.tsx:37,75`, `premium-modal.tsx:93`, `abonnement-view.tsx:172,282`, `src/hooks/use-premium-checkout.ts:22`. Les deux de `abonnement-view` portent toujours `src: "abonnement"` : il ne dit pas d'où vient la personne. Il baisse mécaniquement sur le chemin de fin d'étape 1 (il ne reste que le clic automatique `declencheur: auto`, RA:54).

## 3. Essai réel de la lettre à exclure

- Fenêtre : **18/10/2026, 20:15 à 20:25 UTC** (22:15 à 22:25 Paris), adresse `alex@deviens-marrant.fr` (RA:273-279). E-mail de confirmation reçu à 20:17:05 UTC (RA:275).
- Événements Umami à retirer : `lettre-vu` et `lettre-confirmee` (RA:279), plus tout autre événement `lettre-*` de la fenêtre (liste suivie : `lettre-vu`, `lettre-envoi`, `lettre-echec`, `lettre-confirmee`, `src/lib/umami.ts:43-46`). Umami affiche selon le fuseau du navigateur : filtrer en UTC.
- En base, rien à retirer : la ligne a été supprimée (`DELETE 1`, 0 ligne ensuite, RA:277-278).
- **`ANALYTICS_EMAILS_EXCLUS` ne couvrait pas alex@ ce soir-là.** Preuve : la route de confirmation ne pose `mesure=1` que si l'adresse n'est PAS exclue (`src/app/api/newsletter/confirm/[token]/route.ts:51-52`), et l'URL de l'essai la portait (RA:279). La valeur actuelle de la variable n'est écrite nulle part dans le dépôt (RA:976 : « les 3 e-mails de Thomas », jamais écrits). Je ne peux pas dire qu'alex@ n'y est pas aujourd'hui, seulement qu'il n'y était pas le 18/10.
- **Recommandation** : ajouter `alex@deviens-marrant.fr` à `ANALYTICS_EMAILS_EXCLUS` (séparateurs virgule, espace, point-virgule ou retour à la ligne, casse ignorée : `comptes-test.ts:11-21`), avant le 05/11. C'est la boîte de contact et l'adresse de test autorisée du script d'envoi (`apps/web/scripts/envoi-test-lettre-s21.ts:34-35`), et elle recevra les essais d'envoi. Effets : plus de `mesure=1` sur ses confirmations, et exclusion de tout compte du site ayant cet e-mail des chiffres du lundi et de l'admin (nouvelle rupture mineure à dater, mais seulement si un compte existe). Secret posé par stdin (RA:952) : à faire par @infrastructure sur feu vert de Thomas. Jamais écrire la valeur dans le dépôt.

## 4. Indicateur du bilan

Lire **`checkout-ouvert` par `src`** (tableau « Paiement ouvert par bloc d'entrée (src) » de l'e-mail du lundi, `weekly-funnel.ts:297-302` ; onglet Semaine de l'admin, `src/components/admin/semaine-conversion.tsx:27-28`) **croisé avec Stripe** : « Nouveaux abonnés (premier paiement) » et « Renouvellements » (`weekly-funnel.ts:265-266`). Pas `abonnement-clic` (RA:55).
- Lecture par bloc : `checkout-ouvert` d'un côté, nouveaux abonnés Stripe de l'autre (Stripe ne porte pas la source : comparer les totaux de la semaine, pas bloc par bloc). `checkout-echec` / `checkout-ouvert` par source donne l'abandon ; `raison = retour-sans-paiement` = retour de Stripe sans payer.
- Le tableau est trié par ouvertures décroissantes (`weekly-funnel.ts:174-176`). Volumes faibles : chiffres absolus, pas de pourcentage (`weekly-funnel.ts:294`).
- Séparer les comptes de test : ils ne sont PAS retirés de `checkout-ouvert` (événement navigateur, sans e-mail). Les `ne-pas-compter=1` posés sur les navigateurs de Thomas évitent l'essentiel (RA:473).
- Plusieurs semaines : la première semaine pleine est celle du 19/10 au 25/10 (rapport du 26/10). La semaine du 12/10 au 18/10 est coupée en deux par la mise en ligne du 18/10 à 20:11 UTC.

## 5. Contrôles datés

| Date | Contrôle | Source |
|---|---|---|
| Lun 19/10, après 7 h Paris | Premier e-mail avec la nouvelle formule (comptes de test exclus, ventilation mensuel / annuel, section lettre, ligne stock). Admin, onglet Semaine : « Semaine du 12/10 au 18/10 » ; chiffres = e-mail | RA:179, 16 ; `weekly-visits-job.ts:5` |
| Jeu 22/10 | Article anniversaire publié (programmé, `isPublished = false` jusque-là). Contrôle 14 de l'entrée « Blocs d'appel s21 » : `grep -c "Au moment du gâteau"` ≥ 1 ; lire ses `blog-cta-vu` / `blog-cta-clic` et `src=blog-<slug>` | RA:272, 142 |
| Dim 25/10 | Passage à l'heure d'hiver : le lundi 26/10 à 7 h Paris = 06:00 UTC (avant : 05:00 UTC). Fenêtres Umami à recaler | calendrier |
| Lun 26/10 | Premier rapport de semaine pleine après s21 ; contrôle admin / e-mail | RA:16 |
| Dim 01/11, après 01:00 Paris | Carnet de novembre en ligne (bascule 00:00 Paris) : `Situation 10, offerte`, `fiche-2026-11-10`, `Il en reste 29`. Jusqu'au 31/10 : `Situation 15, offerte` | RA:42, 89, 107-108 |
| Lun 02/11, 05:00 UTC | « Soirée de Noël au boulot » et « Humour en visio » publiées par la tâche planifiée : vérifier qu'elles le sont (sinon le garde-fou d'envoi du n°1 bloque, RA:309). Date déjà avancée à 02/11 05:00 UTC en P5 | RA:271, 308-312 |
| Jeu 05/11, 8 h Paris | Lettre n°1 : premier envoi réel. Lire `lettre-envoi` / `lettre-echec`, envoyés / échecs / en cours dans la section lettre du lundi 09/11. Rollback déconseillé après envoi (correctif redéployé) | RA:348, 338 ; `weekly-lettre.ts:21-30` |
| Mar ~10/11 | Bilan : `checkout-ouvert` par `src` + Stripe, comparaison selon § 1 (base = e-mail du 19/10) | RA:386 |
| Mar 01/12 | Un carnet de décembre est en ligne | RA:141 |

Le contrôle du n°1 ne tient que si `alex@` est exclue (§ 3) ou si les événements `lettre-*` de ce jour sont triés à la main.

## 6. Mise en ligne du trajet de conversion (19/10, 20:44 UTC)

Version `b5e645dd`, commit `e8b431c` (N-1 `3b52c0c2`), journal RA:40-64. Nouvelle page /abonnement, boutons « S'abonner · prix » (`bouton-achat-abonnement.tsx:18`) et porte visiteur « Tout ouvrir · 2,99 €/mois » (`cta-articles-accueil.ts:38`). Le libellé n'est enregistré dans aucun événement : seule l'heure sépare l'avant de l'après (couper à 20:44 UTC, pas au jour).

**Ce qui change dans les événements (vérifié dans `apps/web/src`)**
- `abonnement-clic` : nouvelle propriété `emplacement` = `haut`, `bas`, `barre` (`bouton-achat-abonnement.tsx:13`), posée à deux endroits seulement : visiteur (`abonnement-view.tsx:114-121`) et membre sur clic manuel (`use-abonnement-checkout.ts:90-96`). Sans `emplacement` : carte Premium de l'accueil (`carte-premium-achat.tsx:38,76`), fenêtre Premium (`premium-modal.tsx:122`), `use-premium-checkout.ts:22`, et le clic automatique `declencheur: auto` émis depuis /register (`checkout-apres-inscription.ts:21`). Sur /abonnement, `src` vaut toujours `abonnement` : la porte d'entrée est dans `entree` (visiteur) ou dans `checkout-ouvert.src`.
- `retour-inscription` n'est pas supprimé du code : c'est le `src` d'`abonnement-vu` quand /abonnement s'ouvre avec `auto=1` (`abonnement-view.tsx:86-87`). Il disparaît pour l'inscription par e-mail (paiement ouvert depuis /register, RA:52), reste pour Google et la connexion (RA:49). Le paiement garde la source d'entrée.
- T3 (fin d'étape 1) : la lettre gratuite (`emplacement` `parcours` inchangé) passe de « sous le bouton payant » (`docs/copy/conversion-s21/textes-trajet-v3.md:85`) à « sous la liste des étapes » (`parcours-detail.tsx:765-768`) ; l'étape 2 n'est plus répétée dans la liste (`:723`). `lettre-vu` (une fois par emplacement, visible à 50 %, `use-lettre-inscription.ts:56`) et les inscriptions `parcours` changent de base.
- FAQPage : nouvelle question « Et si j’arrête ? » (`faqs.ts:9,14`), dans le JSON-LD de l'accueil et de /abonnement (RA:59) ; 5 questions attendues sur /abonnement (RA:28). Aucun événement Umami : à lire en Search Console (affichages), pas dans Umami.
- Après paiement : les visiteurs venus de l'en-tête reviennent sur leur page d'origine, plus sur /parcours (RA:59) ; le favori est ajouté au retour (RA:50).
- Inchangés : `checkout-ouvert {src, formule}` et `checkout-echec` (nés avec s21, aucune série avant, § 2), `inscription-*`, `abonnement-reussi`.

**Comparaisons à ne pas faire**
1. `abonnement-vu` et `abonnement-clic`, avant / après 19/10 20:44 UTC : autre page, autres libellés. L'avant ne compte que 3 vues de /abonnement en 4,2 jours et 22 en 28 jours (`docs/ux/trajet-conversion-s21.md:136`) : rupture de série, pas tendance.
2. Le ratio `abonnement-clic` / `abonnement-vu` : le clic automatique de /register n'a plus d'`abonnement-vu` en face pour l'inscription par e-mail.
3. `abonnement-clic` par `emplacement` contre l'avant (propriété inexistante avant), ou sommé avec les clics sans `emplacement`.
4. `abonnement-vu` `src=retour-inscription`, avant / après : baisse mécanique, pas moins d'inscrits.
5. `lettre-vu` et inscriptions `parcours`, avant / après : la lettre a changé de place.
6. Pages vues après `abonnement-reussi` : la destination a changé.
7. Clics des portes dont le libellé change : dire « avant / après », jamais « le libellé a gagné ».
8. Le rapport du 26/10 (19/10 au 25/10) mêle les deux trajets, l'e-mail ne coupe pas à 20:44 UTC. Corrige la dernière puce du § 4 : la première semaine pleine est le 26/10 au 01/11 (rapport du 02/11).
9. Lot 1 (mesure à J+28 le 10/11, project-context) et trajet s21 : au 10/11, leurs effets ne se séparent pas.

**À lire au bilan (~10/11)**
- `checkout-ouvert` par `src` : tableau « Paiement ouvert par bloc d'entrée » des rapports du 02/11 et du 09/11 (`weekly-funnel.ts:205,297-302`). Pour le 19/10 20:44 UTC au 25/10 : Umami, bornes en UTC. Chiffres absolus, pas de pourcentage.
- Croiser avec Stripe : nouveaux abonnés et renouvellements, totaux de la semaine (Stripe ne porte pas la source). Abandon = `checkout-echec` / `checkout-ouvert` par source ; `raison = retour-sans-paiement` = retour de Stripe sans payer.
- En complément seulement : `abonnement-clic` par `emplacement` et `declencheur` dans Umami (le rapport ne lit que son total, `weekly-funnel.ts:217`).
- Trafic de Thomas non retiré de ces événements (§ 4, `ne-pas-compter=1`). Aucune cible chiffrée (volume trop bas, `trajet-conversion-s21.md:396`) : lecture absolue, aucun gain promis.


## Rupture du 24/10/2026 (s22) : prix Premium passé à 1,99 €/mois et 16,99 €/an

Déployé le 24/10 vers 18:55 UTC (version `825272ba`). Le rapport du lundi 02/11 et le bilan conversion du ~10/11 lisent donc deux périodes : 19/10 au 24/10 (2,99 € / 24,99 €) et à partir du 25/10 (1,99 € / 16,99 €). Ne pas les additionner sans le dire. Le bilan du 10/11 tranche aussi l'ajout éventuel d'un accès « à vie » (décision Thomas, option A du 24/10) : si les checkouts ouverts ne se transforment pas, l'option est à tester ; si peu de checkouts s'ouvrent, le frein est ailleurs (exposition).
