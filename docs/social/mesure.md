# Mesure des réseaux sociaux : X, Instagram, LinkedIn (aligné sur `strategie-relance-v5.md`, s15, 05/10/2026)

> Remplace le cadre du 01/10 (« LinkedIn en pause », « test de 8 semaines »), annulé par Thomas le 05/10. Aucune API de métriques réseau : les colonnes `impressions/likes/retweets/replies/clicks` de `SocialPost` ne sont pas remplies par le code (diagnostic s14, §2.4). Sources : statistiques natives de chaque réseau (relevé manuel, environ 10 min) et Umami (visites et événements par API, @data-analyst). **« Visite » = session Umami.**

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
- Règle : aucun lien vers le site sans UTM, même ajouté à la main (même `utm_source` que le réseau).
- **Propriétés d'événement** : `origine` = `utm_source`, `contenu` = `utm_content`, sur `quiz-termine`, `parcours-etape`, `inscription-envoi`, `inscription-reussie`, `onboarding-termine`.
- **Limite écrite** : attribution = session d'arrivée (sessionStorage). Un retour le lendemain n'est pas attribué. À la bascule d'un navigateur intégré vers le navigateur externe, `callbackUrl`, `src`, `origine` et `contenu` passent dans l'adresse de `/register` (bouton « Ouvrir dans mon navigateur », copie du lien sur iOS) ; une bascule hors de ce bouton n'est pas attribuée. Listes blanches : `origine` parmi `x|instagram|linkedin`, `contenu` parmi la liste ci-dessus.

## 2. Baseline et J0 par réseau

> **Baseline relevée par Thomas le 05/10/2026 : 0 abonné sur X, Instagram et LinkedIn.** Les seuils « abonnés gagnés » se lisent donc directement en abonnés totaux.

J0 = premier lundi où les conditions du réseau sont réunies (v5 §1 : X = C1 + C2 ; Instagram = C1 + C2 + C3 ; LinkedIn = C1 + C2 + C4), au plus tôt le 12/10 ; C2 inclut le test dans l'application DU réseau ; **C1 = les 9 étalons ET les seuils du §4 validés par Thomas** (dont l'engagement X et LinkedIn). **C1 non validée le 12/10 : J0 = lundi suivant.** **Calendrier relatif** : un post daté (relais d'article, pivot saisonnier, Noël) avant le J0 de son réseau est sauté, jamais rattrapé ; les jalons et la grille se comptent depuis le J0 du réseau. **Baseline relevée le dimanche qui précède le J0 du réseau** (captures datées) : abonnés du réseau, impressions Google de « deviens marrant » (0 sur 90 jours), visites `utm_source` des 28 derniers jours (0), **inscriptions totales par semaine toutes sources, comptées en base (`createdAt`)** (dénominateur de toute lecture d'inscription ; Umami n'a aucun `inscription-reussie` avant le déploiement). Jalons de chaque réseau : J+14, J+28, J+56 à partir de son J0. Si J0 glisse, tous ses jalons glissent d'autant.

## 3. Relevé hebdomadaire du lundi (30 min au plus, dont 10 min de statistiques natives)

Chiffres de la semaine précédente (lundi à dimanche), reportés dans le tableau du §6.
- **X** (Analytics, onglet Posts) : abonnés, impressions, réponses + citations, clics sur le lien.
- **Instagram** (statistiques professionnelles) : abonnés, visites du profil, clics sur le lien de la bio, couverture, enregistrements, partages. **Partages + enregistrements** : indicateur principal.
- **LinkedIn** (statistiques de la page) : abonnés de la page, impressions, réactions, commentaires, clics.
- **Umami par API (dans l'e-mail du lundi)** : visites par `utm_source` et `utm_campaign` ; événements par `origine` : entonnoir `/liens` > `quiz-termine` > `inscription-reussie` > `onboarding-termine` ; top 5 des pages d'arrivée sociales ; part du social dans les visites (0,14 % aujourd'hui) ; **référents `t.co`, `l.instagram.com`, `lnkd.in`** (plancher de contrôle : un lien sans UTM y apparaît) ; **écart clics de la bio (stats natives) contre visites UTM** : il chiffre la perte d'attribution à la bascule.
- **Inscriptions** : les `inscription-reussie` Google (clic depuis `/register`, donc surcomptés) comparés aux créations en base de la semaine.
- **Fiabilité** (base, en lecture) : posts prévus contre publiés, statut réel Buffer relu ; tout `FAILED` porte le message exact de Buffer dans `directorNote`. Limite d'1 e-mail d'échec par jour. Plafond Buffer gratuit : 10 posts programmés par canal à la fois, insertion glissante (v5 §2.9).
- **Temps** : minutes réelles passées dans la semaine (relevé, réponses, validation), comparées au résultat à J+56. Plafond : jusqu'à 105 min par semaine, 60 min en cadence réduite.

## 4. Seuils par réseau `[HYPOTHÈSE : validés par Thomas dans C1, aucun benchmark interne]`

Cumul depuis le J0 du réseau. Succès / échec.

| Mesure | Instagram J+28 | X J+28 | LinkedIn J+28 | Instagram J+56 | X J+56 | LinkedIn J+56 |
|---|---|---|---|---|---|---|
| Abonnés gagnés | ≥ +120 / < +30 | ≥ +40 / < +10 | ≥ +30 / < +10 | ≥ +300 / < +80 | ≥ +100 / < +30 | ≥ +80 / < +25 |
| Visites `utm_source` | ≥ 20 / < 4 | ≥ 20 / < 4 | ≥ 10 / < 2 | ≥ 50 / < 10 | ≥ 50 / < 10 | ≥ 25 / < 5 |
| Engagement (médiane de tous les posts depuis le J0) | partages + enreg. / couverture : ≥ 2 % / < 0,5 % | (réponses + citations) / impressions : ≥ 0,5 % / < 0,1 % | (réactions + commentaires) / impressions : ≥ 3 % / < 1 % | idem | idem | idem |

Sommes de contrôle : abonnés au succès à J+56 = 300 + 100 + 80 = 480 (à l'échec 80 + 30 + 25 = 135) ; à J+28 : 190 / 50. Visites à J+28 : 20 + 20 + 10 = 50 (échec 4 + 4 + 2 = 10) ; à J+56 : 50 + 50 + 25 = 125 (échec 10 + 10 + 5 = 25). Les seuils d'engagement X et LinkedIn sont validés par Thomas dans C1, avant J0.

## 5. Règle de jugement unique : par réseau

Chaque réseau est jugé seul, à J+28 et J+56 de son J0, sur les trois mesures du §4. Aucun seuil combiné ne décide.
- **Maintien** : au moins 2 mesures sur 3 en succès.
- **Ajustement** (créneaux, ratio vanne et relais, destination du lien) : le reste. **Ajustement aux deux jalons consécutifs : cadence réduite (X 3, Instagram 3, LinkedIn 1 par semaine), minutes plafonnées à 60 par semaine.**
- **Pause et réallocation vers SEO et tunnel** : les 3 mesures sous le seuil d'échec aux DEUX jalons, J+28 et J+56. Pas de règle hebdomadaire.
- **Contrôle J+14** : 0 visite UTM, ou abonnés sous 10 % du seuil de succès J+28 du réseau = vérifier d'abord le lien de bio, le clic sur `/liens`, l'OAuth dans l'application du réseau, avant tout ajustement.
- **Lus, jamais jugés** : `quiz-termine`, `inscription-reussie`, `onboarding-termine` d'origine sociale, toujours rapportés aux inscriptions totales. Le social n'est jamais jugé sur le MRR.
- **Hypothèse Marc** `[HYPOTHÈSE]` : au moins 8 visites `utm_source` x ou instagram cumulées sur les articles rencontre (29/10) et couple (05/11) ET (au moins 1 `blog-cta-clic` bouton `inscription` sur l'un des 2 slugs, OU au moins 1 `inscription-reussie` `methode=email` avec `src=blog-<slug>`, forme vérifiée dans le code). `inscription-envoi` reste au relevé, hors critère (il compte les échecs). **Ancre : le J0 le plus tardif de X et d'Instagram** (les 2 relais doivent être postés après). Lecture à J+28, verdict à J+56 : abandon seulement si les 8 visites sont atteintes avec zéro clic CTA, sinon prolongation de 28 jours. Limite écrite : un lecteur passé par le quiz (`src=quiz`) n'est pas attribué.
- **Honnêteté** : environ 480 abonnés combinés au succès à J+56 ne font pas 10 000 à 12 mois (il faudrait environ 190 par semaine, soit 3 fois le rythme du succès) : Thomas révise l'objectif à J+56 ou on change d'échelle.

## 6. Registre des J0 et tableau de relevé

**Registre des J0** (une ligne par réseau, remplie quand les conditions sont réunies) :

| Réseau | J0 (lundi) | C1 étalons ET seuils §4 validés (date) | C2 e-mail + test dans l'application | C3 `/liens` 3 routes | C4 LinkedIn et Buffer | Ligne `REPLIT_ACTIONS.md` |
|---|---|---|---|---|---|---|
| X | | | | sans objet | sans objet | |
| Instagram | | | | | sans objet | |
| LinkedIn | | | | sans objet | | |

**Relevé** (une ligne par semaine et par réseau) :

| Semaine (lundi) | Réseau | Abonnés | Posts prévus / publiés | Impressions ou couverture | Engagement du réseau | Clics lien | Visites Umami (utm_source) | Minutes passées | Remarque |
|---|---|---|---|---|---|---|---|---|---|
| 05/10/2026 (relevé Thomas) | X | 0 | | | | | | | baseline |
| 05/10/2026 (relevé Thomas) | Instagram | 0 | | | | | | | baseline |
| 05/10/2026 (relevé Thomas) | LinkedIn | 0 | | | | | | | baseline |
