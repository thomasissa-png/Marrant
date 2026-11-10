# Revue growth du brief espace client s24 (v1), angle revenu et rétention

Relecteur : @growth, 10/11/2026. Brief lu : `docs/espace-client/brief-espace-client-s24.md` (non modifié). Sources croisées : `docs/analytics/resiliations-s23-donnees.md`, `resiliations-s23-analyse.md`, `docs/copy/onboarding-premium-s23-emails.md` (v4.2, E0/E1/E1b/E2 approuvés), `docs/founder-preferences.md` (choix du 05/10, 06/11, 07/11, 08/11, 24/10).
Références marché (concurrents, mécaniques PLG) : non consultées pour cette revue ; les avis ci-dessous reposent sur les documents du dépôt. Aucune donnée chiffrée n'est inventée : les repères de calcul sont marqués [HYPOTHÈSE].

## 1. Note globale : 6,5 / 10

Le brief est honnête (hypothèses balisées, mesure serveur posée comme prérequis, aucun dark pattern, résiliation intacte, aucun nouvel e-mail). Il perd des points parce qu'il agit trop tard (l'espace s'ouvre après un clic alors que 2 résiliations connues sur 3 tombent en moins de 10 minutes), ne définit pas le moment « aha », ne traite ni le premier renouvellement ni les états hors Premium, et parce que sa mesure n'a pas de règle de lecture pour 4 abonnés.

## 2. Tableau de notation

| Critère | Note | Ce qui tient | Ce qui manque |
|---|---|---|---|
| Activation dès le jour 1 | 6 | Premier pas nommé (§3.2), « jamais un tableau de zéros », cause H2 reprise | « Aha » jamais défini ; A et C résilient en 4 et 10 min, avant tout effet de l'espace ; Q8 réduit la page d'arrivée à une option ; R1, R2, R4 de l'analyse absents du plan ; l'activation arrive au lot 8, après tout le reste |
| Rétention, habitude, progression visible | 6,5 | Réutilise série, XP, rythme doux ; barre de progression à 0 % propre ; pas de culpabilisation | Aucun traitement du premier renouvellement (J25 à J30) ; XP et niveau en vedette alors que APPRENTI = 100 XP = 5 étapes (environ 5 semaines au rythme conseillé) ; pas de message de première victoire |
| Conversion gratuit vers Premium depuis l'espace | 5 | Aucun dark pattern ; pas de compte gratuit respecté ; résiliation à 1 clic (critère 13) | Aucun levier de conversion : l'espace est invisible au visiteur ; Q7 ne traite que les 12 comptes FREE ; ni résiliation programmée ni ancien abonné ne sont décrits |
| Mesures de succès | 6,5 | Mesure en base, comptes bruts, cas par cas, Umami écarté, dénominateur « 4 » signalé [À VÉRIFIER] | « Mesure en base inerte » : une mesure inerte n'accumule pas de référence ; pas de règle de décision ; seuils « après la première semaine » ; « premier accès Premium » non défini (ouvrir l'écran compte-t-il ?) ; comparaison par semaines calendaires impossible avec 4 abonnés |
| Ordre des lots | 6,5 | Lot 0 mesure d'abord, coque puis parcours (valeur) avant notes et cloche | Tout est activé au lot 8 : la valeur n'arrive qu'à la fin ; lot 3 re-présente des pages qui marchent déjà ; mesure et page de succès non sortis du calendrier de l'espace |
| Cannibalisation et surcharge | 6 | Pages publiques intactes, zone séparée noindex, pas de nouvel e-mail | Redirection de `/profil` : les e-mails E0, E1, E1b et le pied de page pointent vers `/profil`, `/profil#abonnement`, `/profil#rappel-parcours` ; 10 à 12 rubriques pour 4 abonnés ; « Ta question à l'équipe » plus visible sans estimation de charge de réponse |

## 3. Économie de l'abonnement (repères, non observés)

- ARPU mensuel 1,99 € TTC. Pour 1 000 € de MRR : 1 000 / 1,99, soit environ 503 abonnés mensuels. Actuel : 4 au 02/11.
- LTV = 1,99 / churn mensuel. À titre de sensibilité [HYPOTHÈSE, aucun churn mesuré] : churn 75 % donne 2,65 € ; 50 % donne 3,98 € ; 25 % donne 7,96 € ; 10 % donne 19,90 €. Le 75 % vient du « 3 sur 4 » de Thomas, dénominateur non extrait.
- CAC : 0 € de dépense (acquisition 100 % organique). LTV:CAC non défini ; le coût est du développement, qui ne tranche pas le GO (commandement 5).
- Conséquence : l'espace protège le stock d'abonnés, il n'en crée pas. Le goulot du MRR est l'acquisition (205 visiteurs sur la semaine du 26/10, 3 vues de `/abonnement`, 1 clic vers le paiement). Le brief ne doit promettre aucun effet sur le MRR ; sa justification est la valeur persona (Yanis, Sophie, Marc), pas le ROI.

## 4. Corrections OBLIGATOIRES (texte exact à insérer dans le brief)

### O1. Fenêtre d'action de l'espace : à insérer en §1, après « Hypothèse centrale »

```
**Fenêtre d'action de l'espace (correction growth).** Dans les 3 cas connus, 2 résiliations sur 3 arrivent en moins de 10 minutes (A : 4 min, C : 10 min) et la troisième environ 24 h après l'achat (B). L'espace, qu'on ouvre après un clic, ne peut pas agir sur ces 10 premières minutes : elles relèvent de la page de succès, de l'e-mail E0 et du premier écran vu (R1, R2, R4 de `resiliations-s23-analyse.md`, état à vérifier au lot 0). L'espace agit sur trois moments : le premier retour (J1 à J7), l'habitude (semaines 2 à 4) et le premier renouvellement (environ J25 à J30). Le brief traite ces trois moments. La page d'arrivée après paiement (Q8) fait partie du lot 1 : son premier écran est « Aujourd'hui » avec le premier pas visible, et la page de succès garde le lien « Renoncer au contrat ici » (D.221-5).
```

### O2. Moment « aha » et premier pas : à insérer en §3.2 (avant « Interdit ») et en ligne Q10 dans le tableau de §4

```
**Moment « aha » et premier pas (décision de Thomas, Q10).** Le premier pas du premier jour tient en moins de 5 minutes et produit quelque chose que l'abonné ressent (une réplique à lui, une étape faite), jamais un choix à faire. Règle d'affichage : un seul premier pas nommé. Pour un abonné sans parcours commencé : 1) le contenu d'où il vient (`returnTo`) s'il existe ; 2) sinon la première étape du parcours désigné par son quiz s'il l'a passé ; 3) sinon la valeur retenue à Q10. Ce premier pas est LE MÊME dans la page de succès, l'e-mail E0 (« Par où commencer ») et « Aujourd'hui » ; la « prochaine étape » réutilise la logique de `rappel-parcours.ts`. L'événement « aha » mesuré est la première étape validée ou le premier exercice ouvert, jamais la simple ouverture d'une page.
```
```
| Q10 | Quel est le premier pas du premier jour ? | A : la première étape d'un parcours (15 à 20 min) | B : l'exercice de la vanne du jour (environ 2 min), qui mène à l'étape 1 le lendemain [À VÉRIFIER au lot 0 : l'action s'enregistre-t-elle ?] | C : le quiz d'humour, puis le parcours conseillé | B si l'action s'enregistre (victoire en 2 minutes), sinon A ; calé sur 3 étalons |
```

### O3. Ordre de livraison : à remplacer en tête de §5 (après « Calibrage vélocité IA »)

```
**Ordre de livraison (correction growth).** a) La mesure d'usage du lot 0 est déployée ACTIVE (hors de l'interrupteur `ESPACE_CLIENT_PUBLIE`), sur go écrit de Thomas, au moins 14 jours avant l'activation de l'espace : une mesure inerte n'accumule aucune référence et interdit tout avant/après. b) Les retouches de la page de succès, de l'ordre de l'e-mail de confirmation et de la réassurance (R1, R2, R4 de l'analyse s23) sont indépendantes de l'espace et passent avant lui, si elles ne sont pas déjà faites (état à vérifier au lot 0). c) Activation en deux temps : jalon 1 = lots 1 et 2 (« Aujourd'hui », progression, parcours), activés dès qu'ils sont à 10/10 sur go de Thomas ; jalon 2 = lots 3 à 6, activés un par un. Le lot 8 décrit donc deux activations, chacune avec son bilan de mesure.
```

### O4. Règles de lecture des mesures : à remplacer §5.2 (hors contre-mesures)

```
**Règles de lecture (correction growth).** 1) Mesure principale : un tableau d'UNE LIGNE PAR ABONNÉ (anonymisé A, B, C… dans l'ordre des souscriptions, comme `resiliations-s23-donnees.md`) : délai souscription vers premier accès à un contenu Premium, délai vers le « aha », jours de pratique à J7, résiliation programmée (délai), abonnement actif au 2e prélèvement. Lecture cas par cas tant qu'il y a moins de 15 abonnés depuis l'activation ; aucun pourcentage publié sous 15 ; au-delà, « x sur n ». 2) Référence : les abonnés souscrits avant l'activation, avec la mesure active depuis au moins 14 jours. Comparaison par COHORTES d'abonnés (les 10 premiers après contre les 10 derniers avant), pas par semaines calendaires ; au rythme observé (4 abonnés du 07/10 au 02/11) la lecture prend environ 3 mois [HYPOTHÈSE], c'est assumé. 3) Indicateurs avancés, dans l'ordre : accès à un contenu Premium dans les 10 minutes ; « aha » à 24 h ; au moins 2 jours de pratique à J7 ; résiliation programmée avant J7 ; abonné actif au 2e prélèvement (seule vraie mesure de rétention). 4) « Premier accès Premium » = lecture d'un CONTENU réservé (liste au-delà de la limite, étape 2+, exercice, carnet) ; ouvrir « Aujourd'hui » ou la barre ne compte pas. 5) Seuil a priori [HYPOTHÈSE, à confirmer par Thomas] : sur les 10 premiers abonnés après activation, moins de résiliations avant J7 que sur les 10 derniers avant = « à poursuivre » ; sinon = « aucun effet visible, on corrige l'étape qui ne fait pas le travail ». La mesure sert à apprendre où corriger ; le GO de l'espace reste fondé sur la valeur persona (commandement 5). 6) Le « 3 sur 4 » n'est cité dans aucun rapport tant que le dénominateur n'est pas extrait au lot 0. 7) Garde-fou charge : nombre de questions à l'équipe par semaine, rapporté au délai promis (1 à 2 jours ouvrés).
```

### O5. États de compte : à insérer en §3.8 (remplace le dernier point sur les comptes FREE) et à rattacher à Q7

```
**États de compte (correction growth), chacun avec son écran défini avant le lot 1.** 1) Premium actif : tout l'espace. 2) Premium avec résiliation programmée (`cancelAtPeriodEnd`) : espace ouvert et identique ; dans « Mon compte » seulement, une ligne factuelle « Ton accès reste ouvert jusqu'au {date}. » et un lien « Reprendre l'abonnement » [À VÉRIFIER au lot 0 : faisable par le portail Stripe] ; aucune bannière, aucune pastille, aucun texte de regret ; la résiliation reste à 1 clic. 3) Ancien abonné (plan FREE après abonnement) : redirection vers `/abonnement` avec, au-dessus de l'offre, une ligne vraie et affichée seulement si n > 0 : « Tes favoris et ta progression sont gardés : {n} étapes faites, {n} favoris. » ; les données ne sont pas supprimées à la fin de l'accès (durée de conservation des comptes inactifs : sujet reporté par Thomas le 07/10, ne pas le rouvrir, seulement ne rien supprimer). 4) Compte FREE historique ou visiteur : redirection vers la connexion ou `/abonnement` (Q7 B), sans aucun aperçu de l'espace dans les pages publiques sans accord écrit de Thomas.
```

### O6. Liens des e-mails approuvés : à ajouter comme critère 15 dans §5.1

```
15. Les liens des e-mails approuvés et du pied de page restent valides après la redirection de `/profil` : `/profil`, `/profil#abonnement`, `/profil#rappel-parcours`, `/parcours`, `/parcours?src=onboarding-premium` et les `lienEtape` aboutissent à l'écran voulu (redirection 308 qui conserve le fragment, ancres `abonnement` et `rappel-parcours` présentes dans « Mon compte », test automatisé). Les textes des e-mails E0, E1, E1b et E2 ne sont pas modifiés par ce chantier : toute modification fait perdre l'approbation de Thomas (founder-preferences 07/11, 08/11).
```

### O7. Économie de l'abonnement : à insérer en fin de §1

```
**Économie de l'abonnement (repère growth).** Premium coûte 1,99 € TTC par mois : 1 000 € de MRR demandent environ 503 abonnés mensuels, nous en avions 4 au 02/11. L'espace protège le stock d'abonnés, il n'en crée pas ; le goulot du MRR est l'acquisition, traitée dans `docs/growth/`. Le brief ne promet aucun effet chiffré sur le MRR. Sensibilité de la valeur d'un abonné (LTV = 1,99 / churn mensuel) [HYPOTHÈSE, aucun churn mesuré] : churn 75 % = 2,65 € ; 50 % = 3,98 € ; 25 % = 7,96 € ; 10 % = 19,90 €. Chaque point de rétention gagné pèse donc bien plus que 1,99 € de prix.
```

## 5. Corrections souhaitables (une ligne chacune)

1. Premier renouvellement : un bloc factuel « Ton mois en bref » (étapes faites, jours de pratique, favoris) dans « Aujourd'hui » à partir de J20, sans mention du prélèvement ni de la résiliation (compatible avec « aucun rappel avant prélèvement », 07/11).
2. Les 4 premières semaines, mettre en tête les étapes faites et la série plutôt que XP et niveau (seuils inchangés), avec un message de première victoire à la première étape validée.
3. Série rompue : message neutre type « On reprend quand tu veux », jamais d'alerte avant la rupture (cohérent avec le P0 s8).
4. Formule annuelle : dans « Mon compte » seulement, pour un mensuel ayant validé au moins 2 étapes, une ligne unique « Annuel : 16,99 € au lieu de 23,88 € par an, soit 6,89 € de moins » [À VÉRIFIER : changement de formule par Stripe].
5. Lot 3 : limiter à des entrées de barre vers les pages publiques existantes (aucune fiche dupliquée), plus l'agrégation des exercices ; évite le doublon d'URL et la dette de maintenance.
6. Lots 4 (notes) et 5 (cloche) : ne les démarrer qu'après la lecture de la première semaine du jalon 1 ; retirer de la cloche la source « nouvelle lettre » si l'e-mail du jeudi suffit.
7. Cloche : pastille plafonnée, jamais de notification d'inactivité ni de série menacée.
8. Essai réel enchaîné avant activation : achat de test, capture 375 px du clic d'entrée jusqu'à « Aujourd'hui » (règle du 19/10 : noter le trajet réel, pas les écrans isolés).
9. Compter les redirections des comptes FREE et des anciens abonnés vers `/abonnement` (signal de demande, sans identifiant).
10. Supprimer de la liste de §3.1 toute rubrique sans usage mesuré au bout de 90 jours (barre à 6 ou 7 entrées maximum), en jugeant sur les indicateurs avancés, pas sur le revenu du premier mois.

## 6. Points conformes (à ne pas toucher)

Aucun nouvel e-mail ; résiliation et rétractation toujours à 1 clic (critère 13) ; pas de compte gratuit ni de vitrine publique de l'espace sans accord ; mesure serveur plutôt qu'Umami ; réutilisation de `lib/progression.ts` sans nouvelle règle d'XP ; hypothèse centrale marquée non prouvée ; aucun [CHOIX UTILISATEUR] re-questionné.

---
**Handoff : @product-manager (session s24, intégration au brief v2)**
- Fichier produit : `/home/user/Marrant/docs/espace-client/revues/growth-v1.md`
- Décisions proposées : fenêtre d'action en 3 moments (O1), Q10 premier pas (O2), mesure active avant activation et activation en deux jalons (O3), règles de lecture par cohortes (O4), 4 états de compte (O5), liens d'e-mails protégés (O6), économie de l'abonnement (O7)
- Points d'attention : Q10 et le seuil a priori de O4 sont à valider par Thomas ; « Reprendre l'abonnement », changement annuel et durée de conservation sont [À VÉRIFIER] ; le dénominateur « 4 » reste à extraire au lot 0
