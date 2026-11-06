# Onboarding Premium : plan de séquence e-mail (s23, 06/11/2026)

Demande de Thomas (06/11) : quelques e-mails sur ~3 semaines pour présenter ce qu'on fait et recueillir les questions, et un bienvenue qui rappelle tout ce à quoi l'abonné a droit. Sources lues : `resiliations-s23-donnees.md` et `-analyse.md`, `config/textes/paiement.ts` (`emailConfirmationAbonnement`), `abonnement-vente.ts` (tableau Gratuit / Premium, `BIENVENUE_PREMIUM`), `avantages-premium.ts`, `config/premium.ts`, `lib/scheduler/jobs.ts`, `lib/lettre/hebdo.ts` et `envoi-hebdo.ts`, founder-preferences. Cadre @legal (`docs/legal/resiliation-onboarding-cadre-s23.md`) : absent au moment de la rédaction, à intégrer avant tout texte. Aucun benchmark sectoriel consulté : chaque cible ci-dessous est une `[HYPOTHÈSE]` à recaler sur 30 jours de données réelles.

## 1. Objectif et mesure

Constat : sur 3 acheteurs, 3 résiliations en 4 min, 10 min et ~24 h, zéro action enregistrée. La fenêtre utile est donc J0 à J1 : l'e-mail de bienvenue puis l'e-mail J1 sont les deux leviers qui comptent le plus.
- **O1 premier contenu Premium ouvert sous 24 h** : cible 60 % des nouveaux abonnés `[HYPOTHÈSE]`.
- **O2 rétention J7** : abonnés sans résiliation programmée à J7, cible ≥ 80 % `[HYPOTHÈSE]`. **O3 rétention J30** : encore actifs au premier renouvellement mensuel, cible fixée après les 30 premiers jours de mesure (aucune référence chiffrée pour ce site).
- **Réserve statistique** : 4 abonnés actifs au 02/11. Avec quelques abonnés par mois, on lit des effectifs cas par cas, pas des taux ; pas d'A/B, comparaison avant / après sur 4 semaines.
- **Unit economics** : CAC = 0 € (acquisition organique), coût d'envoi ~0 €. LTV = ARPU / churn mensuel = 1,99 € / churn (churn réel non extrait : illustration, à 50 % de churn mensuel la LTV serait de 3,98 € `[HYPOTHÈSE]`). L'enjeu en euros est faible : la décision se prend sur la valeur pour la personne (CLAUDE.md n°5), pas sur le payback.
- **Indicateurs côté serveur** (aucun pixel, comme les lettres : on ne mesure pas les ouvertures) : les 6 événements de `resiliations-s23-analyse.md` §4 (souscription, premier accès Premium, état d'envoi du bienvenue, ouverture du portail de résiliation, résiliation programmée avec motif Stripe, délais). Ajout : une ligne par e-mail du journal (§4). Lecture : délai entre l'envoi de chaque e-mail et le premier accès Premium suivant, par e-mail. Les questions reçues (« Ta question à l'équipe ») se comptent à la main dans la boîte, rien n'est stocké (décision du 25/10).
- Limite connue : lire une liste ne laisse aucune trace en base aujourd'hui. Tant que `first_premium_access` n'existe pas, « rien d'ouvert » est approximé par « aucune action enregistrée » (favori, étape validée, XP, parcours commencé, exercice).

## 2. La séquence (5 e-mails + bienvenue)

Jours comptés en jours calendaires de Paris depuis la souscription (J0). Texte seul, tutoiement, signature « L'Équipe Deviens Marrant » (e-mails automatiques, décision du 14/10), un seul lien d'action par e-mail, ≤ 90 mots chacun `[HYPOTHÈSE de concision, règle du 18/10 « pas de pavés »]`.

| # | Jour | Objet proposé | Promesse (une phrase) | Appel à l'action unique | Condition d'envoi |
|---|---|---|---|---|---|
| E0 | J0, immédiat | « Premium est ouvert : voici tout ce que tu as » | Tout est ouvert, voici la liste, voici le premier pas. | Le carnet du mois (`/carnet`) | Toujours (confirmation de commande) |
| E1 | J1, créneau 10 h ou 18 h Paris situé à 10-24 h du paiement | « Cinq minutes, une situation, une réplique » | Une situation et sa réplique se lisent en cinq minutes, sur le téléphone. | `/carnet` (la fiche la plus récente) | Aucune action enregistrée |
| E2 | J4 | « Une question ? Pose-la, on te répond » | Tu as une ligne directe avec l'équipe, réponse en général sous 1 à 2 jours ouvrés. | `/profil` (encadré « Ta question à l'équipe ») | Toujours (rien n'est stocké sur l'usage) |
| E3 | J9 | « Par où commencer dans les parcours » | Cinq parcours, tu choisis le tien, tout est ouvert d'un coup, une étape par semaine reste un conseil. | `/parcours/repartie` | Aucun parcours commencé ; sinon l'e-mail est sauté et journalisé |
| E4 | J15 | « Tes favoris, tes exercices, ta série » | Tout ce que Premium garde pour toi (favoris, exercices, progression) vit dans ton compte. | `/vannes` (étoile favori et exercices sur les fiches) | Toujours |
| E5 | J22 | « Trois semaines : qu'est-ce qui manque ? » | On te demande ce qui t'aide et ce qui manque, et on lit chaque réponse. | Répondre à cet e-mail (Reply-To `LETTRE_CONTACT`) | Toujours ; pas d'e-mail de vente |

Choix de l'appel à l'action : le carnet (E0, E1) est le contenu le plus court, avec exercice, et 100 % ouvert pour Premium (la personne gratuite n'en voit qu'une fiche). Le parcours Répartie (E3) est celui du persona principal (Yanis) et celui vers lequel le lot 1 a réorienté les encarts. Personas : un seul e-mail pour tous, car aucune donnée n'indique à quel persona appartient l'abonné (zéro invention) ; le quiz d'orientation pourrait le dire plus tard.

**Règles de cadence**
1. Jamais le jeudi : la lettre part le jeudi 8 h (chaque jeudi, abonnés Premium compris ; la lettre du mois est l'une des quatre). Un e-mail dû un jeudi part le vendredi.
2. Au plus un e-mail non transactionnel par jour et par personne : si un rappel des parcours (9 h, sur demande) ou un autre e-mail est parti, l'onboarding décale d'un jour (jusqu'à 2 jours, puis part au premier jour libre). L'ordre E1 à E5 ne s'inverse jamais.
3. Arrêt définitif de la séquence : résiliation programmée (`cancelAtPeriodEnd`), plan non Premium, demande de rétractation, rebond ou plainte, opposition globale (`emailOptOut`), clic sur « arrêter ces e-mails d'accueil » (lien d'arrêt dans chaque e-mail, un clic). Paiement refusé (`PAST_DUE`) : séquence en pause, reprise au rétablissement.
4. Aucun e-mail ne parle de résilier ni de rétractation (c'est le rôle du bienvenue) ; la mention vient de @legal.
5. L'annuel et le mensuel reçoivent la même séquence (aucune donnée ne justifie deux versions).
6. La lettre du jeudi est présentée une fois, dans E0 (« chaque jeudi, arrêt en un clic »), pas répétée.

## 3. Le nouvel e-mail de bienvenue (E0)

Remplace le corps de `emailConfirmationAbonnement`. Le récapitulatif contractuel reste dans le MÊME e-mail (support durable, L.221-13) : on change l'ordre, pas le contenu légal ; l'étalon s16 validé (objet 2.2) est modifié à la demande explicite de Thomas du 06/11, le nouveau texte repasse par ses étalons (§5).
1. **Accueil** (2 phrases) : « Tout est ouvert. » + prénom avec repli « Salut, ».
2. **Liste exhaustive** (une ligne chacune), générée depuis les constantes (aucun nombre en dur) et testée contre `lignesTableau` :
   - catalogue sans limite (vannes, conseils, vidéos ; en gratuit : 10, 3 et 3 dans les listes) ;
   - les 5 parcours en entier (Machine à Café, Répartie, Confiance, Storytelling, Boulot : `PARCOURS_COUNT`), toutes les étapes ouvertes d'un coup ;
   - le carnet de répartie du mois, toutes les situations, carnets passés compris ;
   - les exercices des fiches ; la progression et la série ; les favoris ;
   - la lettre chaque jeudi 8 h (arrêt en un clic), si `LETTRE_HEBDO_PROMESSE` ;
   - « Ta question à l'équipe » depuis le profil, si `QUESTION_EQUIPE_OUVERTE` ;
   - le rappel par e-mail de ton parcours, sur demande depuis le profil.
   La recherche (accroche « Pour tout voir ») n'est listée que si @fullstack confirme au code qu'elle est réservée.
3. **Premier pas** : un lien, le carnet du mois (« cinq minutes, une situation »).
4. **Informations contractuelles**, dans l'ordre existant : confirmation (formule, prix TTC, date, prochain prélèvement, reconduction), résiliation en ligne avec « tu gardes tout jusqu'à la fin de la période payée, rien ne presse » collé au mot « Résilier » (analyse R2), rétractation (texte @legal du 07/10, mot pour mot), CGU, signature, formulaire type joint.
Contrainte : le haut (1 à 3) tient en ~120 mots ; la liste est la seule partie longue, d'où des lignes de 6 à 10 mots.
Écarts constatés à traiter avec lui : `BIENVENUE_PREMIUM.lettre` dit encore « s'active depuis ton profil » alors que l'inscription est d'office depuis le 25/10 ; la page de succès (« Ton accès s'active… ») relève de R1 de l'analyse, hors de ce plan.

## 4. Mécanique

- **Planificateur** : un job `runOnboardingPremiumJob` dans `lib/scheduler/jobs.ts` (source unique Replit / Workers), fenêtres 10 h et 18 h Paris, 4 ticks de 15 min (un échec est retenté au tick suivant), verrou `buildJobLockKey("onboarding-premium", now)`, même patron que `runParcoursReminderJob`. Aucun LLM.
- **Journal anti-doublon** : table additive (migration suivante, numéro à confirmer par @fullstack) `(userId, étape E0 à E5, statut RESERVE / ENVOYE / ECHEC / SAUTE + motif, date)`, clé unique `(userId, étape)`, ligne insérée AVANT l'envoi. Elle sert aussi de journal du bienvenue (aujourd'hui inexistant, analyse R3) : le webhook y réserve E0.
- **Interrupteur** : `ONBOARDING_PREMIUM_ENVOIS_OUVERTS` dans `config/lettre.ts` ou un module voisin, fermé par défaut, arrêt d'urgence sans déploiement de contenu. Abonnés déjà en place au jour de l'ouverture : ils ne reçoivent pas la séquence (seulement les souscriptions postérieures), sinon un E3 arriverait à quelqu'un abonné depuis un mois.
- **Textes et approbation** : un fichier de données versionné (statut BROUILLON / VALIDE), variables uniquement prénom, dates, montants, liens, avec les replis du garde-fou de rendu (`lib/emails/garde-fou-rendu.ts`). Thomas approuve en session chaque e-mail ; l'empreinte du texte exact est enregistrée comme pour les lettres (`approbation-hebdo.ts`), recalculée à l'envoi, toute modification l'annule et l'e-mail ne part pas (alerte admin). Stockage de l'approbation laissé à @fullstack.
- **Pas de génération IA en production** (décision du 01/10) : textes préparés en session, jamais écrits ni adaptés au fil de l'eau.
- **En-têtes** : `List-Unsubscribe` et lien d'arrêt par jeton HMAC (`UNSUBSCRIBE_HMAC_SECRET`) comme le rappel des parcours ; Reply-To `LETTRE_CONTACT`.
- **Ordre de mise en œuvre (dépendances, pas sprints)** : bloc A sans migration, activable dès l'approbation : nouveau bienvenue. Bloc B : événements de mesure R3 et journal. Bloc C : job et séquence, ouverts seulement après B.

## 5. Plan de validation

1. **Étalons d'abord** (P0 s8) : avec Thomas, 4 étalons : E0 (haut du bienvenue + liste), E1, E3, E5, chacun en 2 variantes courtes (une plus directe, une plus complice), avant tout brief complet.
2. **Écriture par @copywriter** sur les étalons validés, charte `ton-alex.md` pour la voix, signature « L'Équipe ». Contrôles : zéro tiret cadratin, zéro émoji, zéro mention d'IA, zéro concurrent, zéro chiffre non sourcé, prix lus de `config/premium.ts`, liste du bienvenue égale au code.
3. **Relecture à l'aveugle, barre 9/10** : 2 relecteurs indépendants (@reviewer, @ux), départage par un 3e, 2 sur 3 suffisent, une faute objective force la correction quel que soit le vote (règle du 08/10). Un texte sous la barre ne revient qu'après une nouvelle relecture au niveau (règle d'or).
4. **Panel des 3 personas** (Yanis, Sophie, Marc) sur la chaîne ENCHAÎNÉE E0 à E5, lue sur capture 375 px dans l'ordre réel (règle du 19/10 : jamais des textes isolés). Questions par persona : ouvrirais-tu ? sais-tu quoi faire ? te sens-tu poussé à résilier ou accueilli ? As-tu l'impression d'un e-mail de masse ?
5. **@legal** vise le cadre (§ pending), puis **Thomas lit et approuve en session** ; aucune mise en ligne sans son approbation écrite.
6. **Après ouverture** : rapport à J+30 (O1 à O3, par e-mail), lecture cas par cas tant que l'effectif est faible ; un e-mail sans effet sur O1 est réécrit ou retiré.

Handoff : @copywriter (étalons puis textes), @fullstack (blocs A à C), @data-analyst (événements), @legal (cadre), Thomas (approbation en session).
