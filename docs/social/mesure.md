# Mesure des réseaux sociaux : X, Instagram, LinkedIn (aligné sur `strategie-relance-v5.md`, s15, 05/10/2026 ; v4 du plan d'exécution : §2 et §4 précisés ; cycle 6 : démarrage réel 06/10, deux modes de relevé, tests, limite de puissance ; cycle 7 : C2 et C3 en ligne le 05/10, clé Buffer « plus tard », fin du compte gratuit, base payante, colonne lien)

> Remplace le cadre du 01/10 (« LinkedIn en pause », « test de 8 semaines »), annulé par Thomas le 05/10. **Démarrage réel des 3 réseaux le mar. 06/10** (dérogation Thomas, `founder-preferences.md`, 05/10) : la **semaine 0 (06 au 11/10) est du rodage**, hors jugement. **Les jalons se comptent depuis le lundi 12/10.**
>
> **Sources et deux modes de relevé (§3).** Les colonnes `impressions/likes/retweets/replies/clicks` de `SocialPost` ne sont pas remplies par le code (diagnostic s14, §2.4). Buffer, lui, sert les statistiques **par post** (impressions, portée, likes, commentaires, partages, enregistrements, abonnements gagnés, clics) avec la permission `insights:read` ; **la clé actuelle ne l'a pas (constaté le 05/10 ; Thomas : « plus tard », `founder-preferences.md`, 05/10, sans échéance)**, et le **total d'abonnés par canal est absent de l'API** : il reste un relevé manuel quel que soit le mode. Autres sources : statistiques natives de chaque réseau (relevé manuel, environ 10 min) et Umami (visites et événements par API, @data-analyst). **« Visite » = session Umami.**

## 1. Liens sortants : UTM partout

| Paramètre | Valeur |
|---|---|
| `utm_source` | `x`, `instagram`, `linkedin` |
| `utm_medium` | `social` |
| `utm_campaign` | `AAAA-MM` du post ; `bio` pour les pages `/liens` |
| `utm_content` | X : `lundi`, `jeudi`, `quiz`, `saison` (pivots saisonniers avec lien : 30/10, 17/12, 31/12, 01/01) ; LinkedIn : `relais`, `saison` (31/12) ; pages `/liens` : `bio-article`, `bio-quiz`, `bio-vanne`, `bio-parcours`, `bio-vannes`, `bio-conseils` |

Exemple : `https://deviens-marrant.fr/blog/<slug>?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10&utm_content=relais`.
- **X** : lien dans le texte du post (relais du lundi et du jeudi, vanne du mercredi avec quiz, pivots `saison`).
- **Instagram** : légendes non cliquables. Lien de bio `/liens` posé une seule fois, la page se met à jour seule.
- **LinkedIn** : lien en dernière ligne du post, jamais en premier commentaire (offre Buffer payante exigée). Bio : `/liens/li`. Bio X : `/liens/x`.
- **Liens de bio (C1 livrée, en ligne depuis le 05/10, Worker `c5c0529b`)** : Instagram `https://deviens-marrant.fr/liens`, X `https://deviens-marrant.fr/liens/x`, LinkedIn `https://deviens-marrant.fr/liens/li` (la page pose elle-même les UTM). Le lien provisoire vers `/quiz-humour` est abandonné. **Tant qu'une bio ne pointe pas sa route, ce réseau n'a aucun trafic suivi** (`utm_content=bio-*` à 0, contrôle J+14 inutilisable) : date de pose et preuve (1 visite `/liens/x` vue dans Umami) au registre « Liens de bio » du §6. La semaine 0 LinkedIn ne porte aucun lien dans les posts (`cta: null`) : le lien de bio est son seul point d'entrée suivi.
- Règle : aucun lien vers le site sans UTM, même ajouté à la main (même `utm_source` que le réseau).
- **Propriétés d'événement** : `origine` = `utm_source`, `contenu` = `utm_content`, sur `quiz-termine`, `parcours-etape`, `inscription-envoi`, `inscription-reussie`, `onboarding-termine`, `blog-cta-clic` (six événements, `lib/umami.ts`, en ligne depuis le 05/10). **Manque connu** : `abonnement-clic`, `abonnement-reussi` et `abonnement-annule` n'ont PAS `origine` (absents de `ATTRIBUTED_EVENTS`) : un visiteur social qui s'abonne n'est pas attribué. Correction à livrer par @fullstack avec la suppression du compte gratuit (ajout aux événements attribués + test). D'ici là, `abonnement-*` se lit sans `origine`, en total du site.
- **Attribution depuis C2 (en ligne le 05/10, ~22:45, Worker `c5c0529b`)** : les événements portent `origine` et `contenu` dès la semaine 0 (aucun trafic social avant le 06/10). La preuve par événement de test (D8) se consigne au §6 : l'événement est daté, exclu des relevés et soustrait de la baseline 2. L'entonnoir par `origine` se lit avec la réserve de l'attribution à la session d'arrivée (limite écrite ci-dessous) ; la semaine 0 reste dans la colonne « échauffement » (§2).
- **Limite écrite** : attribution = session d'arrivée (sessionStorage). Un retour le lendemain n'est pas attribué. À la bascule d'un navigateur intégré vers le navigateur externe, `callbackUrl`, `src`, `origine` et `contenu` passent dans l'adresse de `/register` (bouton « Ouvrir dans mon navigateur », copie du lien sur iOS) ; une bascule hors de ce bouton n'est pas attribuée. Listes blanches : `origine` parmi `x|instagram|linkedin`, `contenu` parmi la liste ci-dessus.

## 2. Baseline et J0 par réseau

> **Baseline relevée par Thomas le 05/10/2026 : 0 abonné sur X, Instagram et LinkedIn.** Les seuils « abonnés gagnés » se lisent en abonnés gagnés depuis la seconde baseline du 11/10 (ci-dessous).

**Démarrage réel, semaine 0 et seconde baseline (décision Thomas, cycle 6).**
- **Les 3 réseaux publient depuis le mar. 06/10** (dérogation `founder-preferences.md`, 05/10 ; C2 et C3 sont finalement en ligne depuis le 05/10, ~22:45, avant le premier post). La **semaine 0 (06 au 11/10) est du rodage** : ses relevés sont gardés dans une colonne « échauffement » du §6, **hors médiane d'engagement, hors cumuls de jalons, hors seuils §4**.
- **Seconde baseline le dimanche 11/10** (captures datées) : abonnés de chaque réseau (0 au 05/10 selon Thomas, valeur du 11/10 à relever, non présumée), visites `utm_source` depuis le 06/10, impressions Google de « deviens marrant », comptes créés de la semaine en base (`createdAt`), **abonnements actifs et créés dans la semaine, MRR (Stripe)**. **Cumuls des jalons = relevé moins cette seconde baseline** ; l'abonné ou la visite gagnés pendant la semaine 0 ne comptent pas dans les seuils §4.
- **J0 de mesure = lun. 12/10 pour les 3 réseaux** (C2 et C3 en ligne depuis le 05/10, Worker `c5c0529b` : condition remplie ; reste la **preuve D8** consignée au §6 avant le 11/10, sinon J0 au lundi suivant et jalons décalés d'autant). J+14 = 26/10, J+28 = 09/11, J+56 = 07/12, J+84 = 04/01, J+112 = 01/02 (calcul depuis le 12/10).
- Charge de Thomas : +3 relevés de 3 min (seconde baseline). Aucun seuil du §4 n'est modifié par ce démarrage anticipé.
- **Base payante au 05/10 (point de départ de la lecture abonnement)** : 2 abonnés actifs (0,99 €/mois, ancien prix), 9 paiements réussis pour 8,91 €, MRR 1,98 €, 1 `incomplete_expired`, 6 clients Stripe (`snapshot-trafic-2026-10-05.md` §5). La baseline 2 relève les mêmes chiffres le 11/10. Aucun taux visite vers abonné n'en est tiré (dates de création non établies, §5 et §8).

J0 = premier lundi où les conditions du réseau sont réunies (v5 §1 : X = C1 + C2 ; Instagram = C1 + C2 + C3 ; LinkedIn = C1 + C2 + C4), au plus tôt le 12/10 (C1 validée le 05/10 ; la publication a démarré le 06/10, C2 et C3 déjà en ligne, voir ci-dessus : le J0 de **mesure** reste soumis à ces conditions) ; **C2 = en ligne (fait le 05/10) + preuve D8** (événement Umami de test par `origine`, consigné au §6 par la session) : le test dans l'application du réseau est abandonné (Thomas, 05/10, pas de test d'inscription sur téléphone) ; **C1 = les 9 étalons ET les seuils J+28 et J+56 du §4 validés par Thomas** (dont l'engagement X et LinkedIn) ; **les seuils J+84 et J+112 et l'exclusion des conseils de la médiane sont hors C1** (validés par D6 et D2 du plan d'exécution, appliqués par défaut, sans bloquer J0). **C1 non validée le 12/10 : J0 = lundi suivant.** **Calendrier relatif** : un post daté (relais d'article, pivot saisonnier, Noël) avant le J0 de son réseau est sauté, jamais rattrapé ; les jalons et la grille se comptent depuis le J0 du réseau. **Baseline relevée le dimanche qui précède le J0 du réseau** (captures datées) : abonnés du réseau, impressions Google de « deviens marrant » (0 sur 90 jours), visites `utm_source` depuis le 06/10, relevées le 11/10, **comptes créés par semaine toutes sources, comptés en base (`createdAt`), et abonnements actifs et créés (Stripe)** (dénominateur de toute lecture d'inscription ou d'abonnement ; Umami n'a aucun `inscription-reussie` avant le déploiement). Jalons de chaque réseau : J+14, J+28, J+56, **J+84 et J+112** (v4 du plan d'exécution) à partir de son J0. Si J0 glisse, tous ses jalons glissent d'autant.

## 3. Relevé hebdomadaire du lundi (30 min au plus, dont 10 min de statistiques natives)

Chiffres de la semaine précédente (lundi à dimanche), reportés dans le tableau du §6. **Deux modes, le second remplace le premier dès que la clé le permet** :
- **Mode A (défaut, aujourd'hui)** : relevé natif de chaque réseau par Thomas, chaque lundi (10 min), liste ci-dessous. La clé Buffer actuelle n'a pas `insights:read` (constaté le 05/10).
- **Mode B (dès que la clé Buffer porte `insights:read`)** : la session relève **par post** impressions, portée, likes, commentaires, partages, enregistrements, abonnements gagnés et clics, et les reporte dans le relevé (colonne « Variante » comprise, §7). **Seul le total d'abonnés reste manuel** (absent de l'API). **Signal des commentaires** : tant que la clé manque, ce sont les notifications des 3 comptes activées par Thomas (réponse sous 24 h les jours ouvrés, aucune fenêtre horaire, `founder-preferences.md`, 05/10) ; dès la clé, le nombre de commentaires par post (rafraîchi une fois par jour) alimente un e-mail quotidien s'il y a du nouveau. Lire ou répondre aux commentaires reste impossible par l'API.
- **Clé `insights:read` : Thomas « plus tard »** (`founder-preferences.md`, 05/10), **sans échéance ni relance quotidienne** : une seule ligne de rappel dans l'e-mail du lundi. Mode A tant qu'elle manque ; le basculement vers B se note dans le §6 (date) et ne rouvre aucun seuil.
- **Lien oui/non (par post)** : chaque post du relevé est marqué avec ou sans lien (X : relais du lundi et du jeudi, vanne du mercredi avec quiz et pivots `saison` = avec lien, le reste sans ; Instagram : jamais de lien cliquable, lien de bio ; LinkedIn : lien en dernière ligne quand il y en a un, aucun en semaine 0). Clics, visites et engagement se lisent à part pour les posts avec et sans lien (lecture seule, jamais décisive, aucun seuil du §4 modifié) ; le test image X ne porte que sur les posts sans lien (§7). Colonne « Posts avec / sans lien » du §6.
- Les statistiques par post du mode B servent à la médiane d'engagement par variante (§7) ; l'impression et l'engagement natifs du réseau (mode A) restent la référence tant que B n'est pas en place.
- **X** (Analytics, onglet Posts) : abonnés, impressions, réponses + citations, clics sur le lien.
- **Instagram** (statistiques professionnelles) : abonnés, visites du profil, clics sur le lien de la bio, couverture, enregistrements, partages. **Partages + enregistrements** : indicateur principal.
- **LinkedIn** (statistiques de la page) : abonnés de la page, impressions, réactions, commentaires, clics.
- **Umami par API (dans l'e-mail du lundi)** : visites par `utm_source` et `utm_campaign` ; événements par `origine` : entonnoir `/liens` > `quiz-termine` > `blog-cta-clic` > `inscription-reussie` (jusqu'à la rupture de série du §6 : compte gratuit ; après : compte créé pour s'abonner) > `abonnement-clic` > `abonnement-reussi` (`origine` manquante sur ces deux derniers tant que @fullstack ne l'a pas livrée, §1) ; `onboarding-termine` se lit après paiement une fois la rupture déployée ; top 5 des pages d'arrivée sociales ; part du social dans les visites (0,14 % aujourd'hui) ; **référents `t.co`, `l.instagram.com`, `lnkd.in`** (plancher de contrôle : un lien sans UTM y apparaît) ; **écart clics de la bio (stats natives) contre visites UTM** : il chiffre la perte d'attribution à la bascule.
- **Inscriptions** : les `inscription-reussie` Google (clic depuis `/register`, donc surcomptés) comparés aux créations en base de la semaine et aux abonnements créés (Stripe : actifs, `incomplete_expired`) de la même semaine.
- **Fiabilité** (base, en lecture) : posts prévus contre publiés, statut réel Buffer relu ; tout `FAILED` porte le message exact de Buffer dans `directorNote`. Limite d'1 e-mail d'échec par jour. **Modèle de remise Buffer** : le cron remet les posts échus, 1 par réseau et par passage de 15 min, `dueAt` = maintenant + 2 min ; la file Buffer contient 0 ou 1 post, la base fait stock (le plafond de 10 posts et l'insertion glissante de v5 §2.9 sont sans objet).
- **Temps** : minutes réelles passées dans la semaine (relevé, réponses, validation), comparées au résultat à J+56. Plafond : jusqu'à 105 min par semaine, 60 min en cadence réduite.

## 4. Seuils par réseau `[HYPOTHÈSE : validés par Thomas dans C1, aucun benchmark interne]`

Cumul depuis le J0 du réseau. Succès / échec.

| Mesure | Instagram J+28 | X J+28 | LinkedIn J+28 | Instagram J+56 | X J+56 | LinkedIn J+56 |
|---|---|---|---|---|---|---|
| Abonnés gagnés | ≥ +120 / < +30 | ≥ +40 / < +10 | ≥ +30 / < +10 | ≥ +300 / < +80 | ≥ +100 / < +30 | ≥ +80 / < +25 |
| Visites `utm_source` | ≥ 20 / < 4 | ≥ 20 / < 4 | ≥ 10 / < 2 | ≥ 50 / < 10 | ≥ 50 / < 10 | ≥ 25 / < 5 |
| Engagement (médiane des posts depuis le J0, **hors conseils du vendredi**, suivis à part) | partages + enreg. / couverture : ≥ 2 % / < 0,5 % | (réponses + citations) / impressions : ≥ 0,5 % / < 0,1 % | (réactions + commentaires) / impressions : ≥ 3 % / < 1 % | idem | idem | idem |

Sommes de contrôle : abonnés au succès à J+56 = 300 + 100 + 80 = 480 (à l'échec 80 + 30 + 25 = 135) ; à J+28 : 190 / 50. Visites à J+28 : 20 + 20 + 10 = 50 (échec 4 + 4 + 2 = 10) ; à J+56 : 50 + 50 + 25 = 125 (échec 10 + 10 + 5 = 25). Les seuils d'engagement X et LinkedIn sont validés par Thomas dans C1, avant J0.

**Conseils du vendredi (X et Instagram, 2 par semaine)** : exclus de la médiane d'engagement (10 à 15 % des posts à J+28, confondus avec le jour de la semaine) ; médiane des conseils relevée à part par réseau, lecture comparée aux vannes à J+112 (environ 11 conseils par réseau : 15 vendredis du 23/10 au 29/01 moins 4 exceptions) puis au bilan Q1 du 29/03 (19 par réseau) ; jamais décisive pour le verdict. Règle appliquée par défaut dès qu'il y a des conseils, hors C1.

**Seuils J+84 et J+112 `[HYPOTHÈSE : extrapolation linéaire du rythme exigé entre J+28 et J+56, validée par Thomas avec la décision D6 du plan d'exécution, hors C1 : un silence de Thomas applique le défaut et ne retarde aucun J0]`.** Cumul depuis le J0, succès / échec ; ils ne décident que d'ajustements de lot (créneaux, ratio vanne et relais, destination du lien), jamais d'une pause (aucune pause sans décision de Thomas, §5). Engagement : mêmes seuils qu'à J+56.

| Mesure | Instagram J+84 | X J+84 | LinkedIn J+84 | Instagram J+112 | X J+112 | LinkedIn J+112 |
|---|---|---|---|---|---|---|
| Abonnés gagnés | ≥ +480 / < +130 | ≥ +160 / < +50 | ≥ +130 / < +40 | ≥ +660 / < +180 | ≥ +220 / < +70 | ≥ +180 / < +55 |
| Visites `utm_source` | ≥ 80 / < 16 | ≥ 80 / < 16 | ≥ 40 / < 8 | ≥ 110 / < 22 | ≥ 110 / < 22 | ≥ 55 / < 11 |

Sommes de contrôle : abonnés au succès à J+84 = 480 + 160 + 130 = 770 (échec 130 + 50 + 40 = 220) ; à J+112 = 660 + 220 + 180 = 1 060 (échec 180 + 70 + 55 = 305). Visites au succès : J+84 = 200, J+112 = 275.

## 5. Règle de jugement unique : par réseau

Chaque réseau est jugé seul, à J+28 et J+56 de son J0, sur les trois mesures du §4. Aucun seuil combiné ne décide.
- **Maintien** : au moins 2 mesures sur 3 en succès.
- **Ajustement** (créneaux, ratio vanne et relais, destination du lien) : le reste. **Ajustement aux deux jalons consécutifs : cadence réduite (X 3, Instagram 3, LinkedIn 1 par semaine), minutes plafonnées à 60 par semaine, seulement avec l'accord explicite de Thomas** (D8, `founder-preferences.md`, 05/10 : jamais de cadence réduite sans son accord).
- **~~Pause et réallocation vers SEO et tunnel~~ → décision de Thomas, jamais automatique** (Thomas, 05/10 : « Je ne veux pas réseau en pause ») : si les 3 mesures sont sous le seuil d'échec aux DEUX jalons, J+28 et J+56, la fiche de jalon le signale et propose des ajustements (contenu, format, heure, cadence) ; aucun réseau n'est mis en pause par la session. Pas de règle hebdomadaire.
- **Contrôle J+14** : 0 visite UTM, ou abonnés sous 10 % du seuil de succès J+28 du réseau = vérifier d'abord le lien de bio, le clic sur `/liens`, l'OAuth dans l'application du réseau, avant tout ajustement.
- **Lus, jamais jugés** : `quiz-termine`, `blog-cta-clic`, `inscription-reussie`, `abonnement-clic`, `abonnement-reussi`, `onboarding-termine` d'origine sociale, rapportés aux comptes créés et aux abonnements de la semaine (base, Stripe). **Le social n'est plus jugé sur l'inscription gratuite** (Thomas, 05/10 : pas de compte gratuit, `founder-preferences.md`) **et jamais sur le MRR** : l'entonnoir devient visite > quiz ou clic CTA > `abonnement-clic` > `abonnement-reussi`, lu à ses effectifs réels. Rupture de série datée au §6.
- **Hypothèse Marc** `[HYPOTHÈSE]` : au moins 8 visites `utm_source` x ou instagram cumulées sur les articles rencontre (29/10) et couple (05/11) ET (au moins 1 `blog-cta-clic` sur l'un des 2 slugs, bouton `inscription` avant la rupture du §6 et `abonnement` après `[À VÉRIFIER dans le code au déploiement]` : les deux comptent, OU au moins 1 `inscription-reussie` `methode=email` avec `src=blog-<slug>`, seul événement qui porte le slug après le clic ; `abonnement-clic` porte un `src` fixe `abonnement` et ne le remplace pas). `inscription-envoi` reste au relevé, hors critère (il compte les échecs). **Ancre : le J0 le plus tardif de X et d'Instagram** (les 2 relais doivent être postés après). Lecture à J+28, verdict à J+56 : abandon seulement si les 8 visites sont atteintes avec zéro clic CTA, sinon prolongation de 28 jours. Limite écrite : un lecteur passé par le quiz (`src=quiz`) n'est pas attribué.
- **Honnêteté** : environ 480 abonnés combinés au succès à J+56 ne font pas 10 000 à 12 mois (il faudrait environ 190 par semaine, soit 3 fois le rythme du succès) : Thomas révise l'objectif à J+56 ou on change d'échelle.

**Économie du social (lue, jamais un critère d'arrêt : valeur persona, `CLAUDE.md` n°5).**
- **Coût cash : 0 €** (offre Buffer gratuite, v5 §2.9). **Coût temps : 986 min sur 24 semaines**, soit environ 41 min par semaine (`plan-execution-s15.md` §10, réponses aux commentaires comprises ; hors réponses : 386 min).
- **Coût temps par action qualifiée** (remplace le « CAC temps par inscrit » du 05/10 : l'inscription gratuite disparaît) = minutes réelles cumulées (colonne « Minutes passées » du §6) / `quiz-termine` d'origine sociale, et / `blog-cta-clic` d'origine sociale, **lus séparément à J+56**, sans seuil (`origine` ∈ x, instagram, linkedin). **CAC par abonné : non calculé** (aucun abonné d'origine sociale attendu à J+56, ci-dessous) ; recalcul à 30 jours de données réelles, sur `abonnement-reussi` avec `origine` (une fois la correction du §1 livrée), rapproché de Stripe.
- **LTV** = 2,99 € x (1 / churn mensuel) `[HYPOTHÈSE : prix cible 2,99 €/mois ; les 2 abonnés actifs paient 0,99 €, ancien prix]` : le churn est **inconnu** (2 abonnés actifs, 9 paiements pour 8,91 €, MRR 1,98 €, `snapshot-trafic-2026-10-05.md` §5 : effectif trop faible, dates de création non établies) `[HYPOTHÈSE : à recalculer à 30 jours de données réelles]`. Aucun ratio LTV:CAC n'est publié avant ce recalcul, et aucun ne devient jamais un critère d'arrêt (valeur persona, `CLAUDE.md` n°5).
- **Base de conversion payante : non établie** `[À VÉRIFIER @data-analyst : abonnements créés sur 90 jours (Stripe et base), dates de création]` : les 9 paiements des 2 abonnés actifs datent probablement d'avant les 90 jours. Aucun taux visite vers abonné n'est publié. **Seule borne tenable** : un abonné est un compte, et le site a converti 5 comptes pour 2 399 visites sur 90 j (0,21 %, taux d'un palier gratuit qui disparaît) : 125 visites sociales au succès J+56 donnent **au plus 0,26 compte attendu, donc au plus 0,26 abonné** `[HYPOTHÈSE : même taux pour une visite sociale que pour la moyenne du site ; majorant, le taux visite vers abonné est inférieur]`. En pratique, 0 abonné d'origine sociale à J+56 est le résultat attendu. Détail et conséquences : §8.
- **La lecture utile à J+28 et J+56 devient donc : `quiz-termine` et `blog-cta-clic` par `origine`, puis `abonnement-clic` (une fois attribué), rapportés aux visites UTM** `[À VÉRIFIER @data-analyst : nom exact de l'événement de clic CTA après le quiz ; pour les articles, `blog-cta-clic` bouton `inscription`, puis `abonnement` après la rupture du §6]` ; l'abonnement reste lu, jamais jugé.

## 6. Registre des J0 et tableau de relevé

**Registre des J0** (une ligne par réseau, remplie quand les conditions sont réunies) :

| Réseau | Début réel de publication | J0 de mesure (lundi) | C1 étalons ET seuils §4 validés (date) | C2 en ligne + preuve D8 (test appareil renoncé, Thomas 05/10) | C3 `/liens` 3 routes | C4 LinkedIn et Buffer | Ligne `REPLIT_ACTIONS.md` |
|---|---|---|---|---|---|---|---|
| X | **06/10/2026** (dérogation Thomas) | 12/10/2026 (C2 en ligne ; reste la preuve D8) | 05/10/2026 | **En ligne le 05/10/2026 (~22:45), Worker `c5c0529b`** ; preuve D8 : `[à renseigner : date et heure de l'événement Umami de test, origine=x]` | sans objet (route `/liens/x` en ligne le 05/10) | sans objet | « s15 (05/10/2026, ~22:45 Paris) : DÉPLOYÉ », Worker `c5c0529b` |
| Instagram | **06/10/2026** (dérogation Thomas) | 12/10/2026 (même condition) | 05/10/2026 | **En ligne le 05/10/2026 (~22:45), Worker `c5c0529b`** ; preuve D8 : `[à renseigner : date et heure, origine=instagram]` | **En ligne le 05/10/2026** (`/liens`, 200 en prod) | sans objet | idem |
| LinkedIn | **06/10/2026** (dérogation Thomas) | 12/10/2026 (même condition) | 05/10/2026 | **En ligne le 05/10/2026 (~22:45), Worker `c5c0529b`** ; preuve D8 : `[à renseigner : date et heure, origine=linkedin]` | sans objet (route `/liens/li` en ligne le 05/10) | `[à renseigner]` | idem |

Seules les cases `[à renseigner]` restent à remplir, à la date réelle (pas de date présumée). **Preuve D8** : test de session (agent utilisateur émulé, Jest, 3 133 PASS au déploiement) + 1 événement Umami de test par `origine`, daté, exclu des relevés et soustrait de la baseline 2 (§1). Si la preuve D8 d'un réseau n'est pas consignée le 11/10, son J0 passe au lundi suivant et ses jalons glissent d'autant (§2).

**Liens de bio** (K1-c : sans bio pointée, aucun trafic suivi ; pose par Thomas, 3 x 1 min, ou par la session si elle a l'accès ; date aussi consignée par la session dans `REPLIT_ACTIONS.md`) :

| Réseau | Lien à poser | Posé le | Preuve |
|---|---|---|---|
| Instagram | `https://deviens-marrant.fr/liens` | `[à renseigner]` | `[à renseigner : 1 visite /liens vue dans Umami]` |
| X | `https://deviens-marrant.fr/liens/x` | `[à renseigner]` | `[à renseigner : 1 visite /liens/x vue dans Umami]` |
| LinkedIn (page) | `https://deviens-marrant.fr/liens/li` | `[à renseigner]` | `[à renseigner : 1 visite /liens/li vue dans Umami]` |

**Ruptures de série** (une ligne par changement qui rend deux périodes non comparables ; chaque ligne est reportée en « Remarque » du relevé de la semaine concernée) :

| Date | Rupture | Effet sur la lecture |
|---|---|---|
| 05/10/2026 (~22:45) | C2 en ligne : `origine` et `contenu` sur 6 événements | Aucun trafic social avant le 06/10 : sans effet |
| `[à renseigner : date de déploiement]` (décidée le 05/10, **non codée** : `suppression-compte-gratuit-s15.md`) | **Fin du compte gratuit** : `inscription-reussie` = compte créé pour s'abonner (étape 1 sur 2) ; bouton CTA d'article `inscription` probablement renommé `abonnement` `[À VÉRIFIER dans le code]` ; `onboarding-termine` après paiement | Séries `inscription-*` d'avant et d'après non comparables ; le relevé du lundi porte « avant » ou « après rupture » ; aucun seuil §4 touché ; le social n'est plus jugé sur l'inscription (§5) |
| `[à renseigner : date de livraison]` | `abonnement-clic`, `abonnement-reussi`, `abonnement-annule` portent `origine` | Entonnoir attribué jusqu'au paiement ; avant cette date, `abonnement-*` se lit en total du site |

**Relevé** (une ligne par semaine et par réseau) :

Colonne « Variante / heure » : facteur testé et bras du post (`[variante:texte]`, `[variante:image]`, créneau A ou B), voir §7 ; vide si aucun test actif sur ce réseau. Mention « échauffement » dans « Remarque » pour la semaine 0 (hors cumuls, §2). Colonne « Posts avec / sans lien » : effectifs de la semaine, par exemple `1 / 4` (§3). Les ruptures de série du registre ci-dessus se notent en « Remarque ».

| Semaine (lundi) | Réseau | Abonnés | Posts prévus / publiés | Posts avec / sans lien | Impressions ou couverture | Engagement du réseau | Clics lien | Visites Umami (utm_source) | Variante / heure | Minutes passées | Remarque |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 05/10/2026 (relevé Thomas) | X | 0 | | | | | | | | | baseline 1 |
| 05/10/2026 (relevé Thomas) | Instagram | 0 | | | | | | | | | baseline 1 |
| 05/10/2026 (relevé Thomas) | LinkedIn | 0 | | | | | | | | | baseline 1 |
| 05/10/2026 | Site (toutes sources) | | | | | | | | | | baseline 1 payante : 2 abonnés actifs, 9 paiements, MRR 1,98 € (`snapshot-trafic-2026-10-05.md` §5) |
| 06/10/2026 (semaine 0) | X | | | | | | | | | | échauffement, hors cumuls |
| 06/10/2026 (semaine 0) | Instagram | | | | | | | | | | échauffement, hors cumuls |
| 06/10/2026 (semaine 0) | LinkedIn | | | | | | | | | | échauffement, hors cumuls |
| 11/10/2026 (dimanche) | X | | | | | | | | | | **baseline 2** (à relever) |
| 11/10/2026 (dimanche) | Instagram | | | | | | | | | | **baseline 2** (à relever) |
| 11/10/2026 (dimanche) | LinkedIn | | | | | | | | | | **baseline 2** (à relever) |
| 11/10/2026 (dimanche) | Site (toutes sources) | | | | | | | | | | **baseline 2** : comptes créés de la semaine, abonnements actifs et créés, MRR (Stripe), impressions Google « deviens marrant » (à relever) |

## 7. Tests A/B : un facteur à la fois par réseau

Décisions : image sur X et LinkedIn, Thomas suit les recommandations du cycle 6 (`founder-preferences.md`, 05/10) ; le détail ci-dessous vient de `notation-relance-cycle6-design.md` §3-4 (règle d'adoption) et `notation-relance-cycle6-social.md` §1 K5b et §3.

**Règles communes**
- **Un seul facteur actif par réseau à la fois** (image OU heure, jamais les deux sur les mêmes posts) : avec 4 à 10 posts par bras, deux tests superposés ne se lisent pas.
- **Verdict « non concluant » sous 6 posts par bras au jalon** : jamais de conclusion, on garde le défaut du test et la lecture est reportée au jalon suivant `[HYPOTHÈSE : prolongation jusqu'à 6 posts par bras, aucun benchmark interne]`.
- Paires appariées (note de duel proche, créneau comparable). Marqueur `[variante:texte]` ou `[variante:image]` dans `directorNote` (même mécanisme que `[article:…]`), reporté dans la colonne « Variante / heure » du §6.
- Les tests ne jugent aucun réseau : la règle du §5 reste fondée sur les 3 mesures du §4, calculées sur tous les posts (bras confondus). Seuils ±30 % `[HYPOTHÈSE : aucun benchmark interne]`.
- Mode A du §3 : l'impression et l'engagement **par post** se lisent à la main dans les statistiques natives ; le mode B les rend automatiques.
- **Heure B** (test (c)) : marqueur `[heure:B]` dans `directorNote`, reporté dans « Variante / heure » ; la reprise d'un post garde l'heure du post. Livraison @fullstack (F1, avant le 09/10) : tant qu'elle n'est pas faite, le code n'a qu'une heure par réseau et aucun post n'est compté dans le test d'heure `[À VÉRIFIER : état du code, voir notation-relance-cycle7-social.md §2]`. L'alternance par jour est déjà écrite ici ; `horaires-sources-s15.md` §6 doit s'y aligner (hors de ce fichier).

| Réseau | Facteur | Fenêtre | Bras et éligibilité | Mesure | Règle | Défaut si non concluant |
|---|---|---|---|---|---|---|
| LinkedIn | (a) carte unique 4:5 contre texte seul | **à partir du mar. 13/10** ; mar. et jeu. alternés, ordre inversé une semaine sur deux ; prolongé jusqu'à 6 posts par bras | Vannes dont l'amorce tient en 140 caractères (L1 éligible ; L2 et L3 en texte seul) ; texte du post inchangé, carte = chute | Impressions ; (réactions + commentaires) / impressions | Règle d'adoption @design : **image adoptée si médiane d'impressions ≥ +30 % ET taux d'engagement non inférieur** ; texte conservé si l'image est à −30 % ou moins ; entre les deux, on garde le défaut | **Image** |
| X | (b) carte unique contre texte seul | **à partir de J+28 (lun. 09/11)**, après le test d'heure ; mar. et jeu. alternés | Vannes **sans lien** seulement (une image supprime l'aperçu du lien) ; format carte unique selon @design (16:9) `[À VÉRIFIER sur brouillon réel : @social évoque un 4:5]` | Impressions ; (réponses + citations) / impressions | Même règle que LinkedIn | **Texte** (X texte seul validé par Thomas) |
| X, LinkedIn, Instagram | (c) heure A contre heure B, **alternée par jour** et non par semaine (l'audience croît : un bras par semaine part avec plus d'abonnés) | X : de J0 à J+28 (3 posts par semaine, mar. A / mer. B / jeu. A puis l'inverse la semaine suivante). LinkedIn : après le verdict du test (a). Instagram : dès J0 `[À CONFIRMER @social : fenêtre]` | Mar. à jeu. seulement ; heures A et B : `horaires-sources-s15.md` §6 | Impressions ou couverture ; engagement du réseau (§4) | Écart sous 25 % : on garde A | **A** |

- **Test vendredi contre dimanche : tranché par la session (Thomas suit les recos, 05/10)** : un facteur à la fois ; il ne démarre pas à J0 mais de J+28 à J+56, sur Instagram seulement, à cadence constante (`horaires-sources-s15.md` §6, `strategie-relance-v5.md` §3). Aucune question à Thomas.
- **Écart de calendrier signalé** : @social planifiait le test d'heure LinkedIn en S5 à S8 ; avec « un facteur à la fois » et 6 posts par bras, il suit le verdict du test (a), donc au plus tôt vers J+42 à J+56.

## 8. Limite de puissance : ce que J+28 et J+56 peuvent et ne peuvent pas dire

**Base chiffrée** (`snapshot-trafic-2026-10-05.md` §1 et §5) : **13 comptes depuis le 16/03/2026, dont 5 sur 90 jours, pour 2 399 visites sur 90 jours = 0,21 %** de conversion visite vers compte. Intervalle exact de Poisson à 95 % pour 5 comptes : environ 0,07 % à 0,49 % `[calcul]`. Ce taux est celui de tout le site (recherche, direct), pas celui du social `[HYPOTHÈSE : même taux pour une visite d'origine sociale]`. **Il mesure des comptes, dont un palier gratuit qui disparaît (décision Thomas, 05/10), et n'est pas une base de conversion payante** : la base payante est 2 abonnés actifs, 9 paiements, MRR 1,98 € (snapshot §5), dates de création non établies `[À VÉRIFIER @data-analyst]`. Il ne sert plus que de **majorant** : tout abonné est un compte.

| Jalon (somme X + Instagram + LinkedIn) | Visites au succès (§4) | Comptes attendus au succès (majorant des abonnés) | Probabilité d'au moins 1 compte |
|---|---|---|---|
| J+28 | 50 | 0,10 | 10 % |
| J+56 | 125 | 0,26 | 23 % |
| J+84 | 200 | 0,42 | 34 % |
| J+112 | 275 | 0,58 | 44 % |

`[HYPOTHÈSE : taux 0,21 %, inscriptions indépendantes (loi de Poisson) ; calcul : visites x 0,0021, probabilité = 1 moins exp(−attendus)]`. Par réseau à J+56 au succès : Instagram 50 visites (0,10 compte), X 50 (0,10), LinkedIn 25 (0,05).

**On ne peut PAS conclure, à J+28 ni à J+56**
- **Aucune conversion en inscription ni en abonnement par réseau, par `origine` ou par variante** (0 abonné est encore plus probable que 0 compte) : « 0 inscrit d'origine sociale » est le résultat le plus probable même au succès complet (environ 77 % à J+56) et ne prouve rien ; « 1 inscrit » ne donne aucun taux. Mesurer la conversion à ±50 % demanderait environ 16 inscrits, soit de l'ordre de 7 600 visites sociales au taux de 0,21 % `[calcul d'ordre de grandeur]`, soit 60 fois les 125 visites du succès J+56.
- Aucun CAC ni ratio LTV:CAC par inscrit ni par abonné (§5 Économie) ; aucun test A/B jugé sur des inscriptions.
- **Aucun test de variante (§7) à J+28 pour LinkedIn** : au mieux 4 posts par bras (1 par semaine et par bras, 4 semaines depuis le 13/10, tous éligibles) ; **à J+56 : au mieux 8**, moins si l'éligibilité (amorce ≤ 140 caractères) écarte des posts, comptage à faire par @social. **X image : 4 par bras à J+56** (4 semaines depuis le 09/11 `[HYPOTHÈSE : 2 vannes sans lien par semaine]`), donc non concluant à J+56 ; 6 par bras vers J+70, lecture à J+84.
- La médiane d'engagement reste fragile : au plus 20 posts X et 20 Instagram, 8 LinkedIn à J+28 (40, 40 et 16 à J+56), avant exclusion des conseils ; un seul post viral déplace la médiane de LinkedIn.

**On PEUT conclure**
- **Abonnés gagnés et visites `utm_source` contre les seuils du §4** : les seuils (4 à 300 selon la mesure) sont plus grands que le bruit de comptage (environ ±9 visites à 20 visites, 2 écarts-types), et la baseline est 0 (§2) : succès, maintien et échec se lisent. C'est la raison d'être du §5.
- **Le test d'heure X à J+28** : 6 posts par bras (3 posts par semaine x 4 semaines / 2) = seuil de la règle atteint, mais puissance faible ; seul un écart ≥ 25 % déplace le défaut A.
- **Le test image LinkedIn à J+56**, si au moins 6 posts éligibles par bras ; sinon « non concluant ».
- L'entonnoir `quiz-termine` vers clic CTA (puis `abonnement-clic`) par `origine` : en lecture, avec ses volumes (probablement quelques unités), jamais en taux jugé.

Conséquence : **le jugement du social repose sur l'audience et le trafic (§4), jamais sur l'inscription ni sur l'abonnement** ; l'entonnoir vers `abonnement-clic` et `abonnement-reussi` se lit à J+112 et au bilan Q1 du 29/03 pour ce qu'il est, une tendance à faible effectif (rupture de série du §6 à signaler dans la lecture).
