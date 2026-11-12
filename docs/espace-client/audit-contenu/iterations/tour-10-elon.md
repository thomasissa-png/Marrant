# Tour 10 : relecture à l'aveugle de l'architecture de contenu v10 (@elon)

> AVIS CONSULTATIF, validation requise avant exécution. Relecteur indépendant, sans accès aux autres avis du tour 10.
> Lu : `architecture-contenu-v10.md` (0.1, 3.2, 4.2 en entier, 7.5, C13, C14, annexe A.1 et A.2).
> Vérifié dans le code :
> - `app/api/stripe/checkout/route.ts` l. 13 à 43 : seuls `plan` et `returnTo` sont lus, aucun `src` (« jamais transmis au paiement » est exact).
> - `config/blog-encarts.ts` l. 30 et 31 : les deux articles « faire rire » mènent à `confiance` par slug (exact).
> - Total de 3.2 recompté : 60 + 12 + 8 + 12 + 12 + 10 + 30 + 5 + 6 = 155.

## Verdict en une phrase

C'est prêt à être montré à Thomas. Mes quatre corrections du tour 9 sont traitées, et la v10 a fait le choix juste par principes premiers : **ne pas construire en V1 l'entrée par article**, parce qu'on ne peut pas mesurer son effet chez les abonnés (« au niveau "quoi écrire" il vaut +0, au niveau "ce qui passe devant" il n'existe aucun [MESURÉ A] »). Elle ne sera construite que si un capteur le justifie. C'est l'étape « supprimer » faite au bon moment. Il reste un détail de cohérence dans C14 C, rien de structurel.

## Notes

| # | Critère | T9 | T10 | Justification (passage cité) |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 10 | Inchangé ; premier pas toujours sous 5 minutes, y compris depuis un parcours (« première fiche à geste de l'étape 1, de 5 minutes au plus, hors fiche 0 »). |
| C2 | Respect des décisions | 10 | 10 | C14 garde « Renoncer au contrat ici » (D.221-5) et E0 inchangé « quelle que soit l'option » ; pivot du 06/05 rappelé ; Q8 du brief posée honnêtement (« qui ne t'a pas encore été posée »). |
| C3 | Zéro donnée inventée | 9 | 10 | `src` « relayé jusqu'à `/register` mais jamais transmis au paiement » : vérifié ; seuil du toucher « chiffre à lire en base avant E5 [À VÉRIFIER], jamais inventé » (7.5 f). |
| C4 | Rubriques claires | 10 | 10 | Inchangé. |
| C5 | Ambition | 10 | 10 | Inchangée ; l'entrée par article est différée avec un déclencheur, pas abandonnée. |
| C6 | Cohérence | 9 | 9 | Ordres 1 et 2 alignés sur un « principe commun » écrit, totaux recomptés. Un détail : C14 C, « un bandeau unique, la première fois, "Ton premier pas : …" qui mène à "Aujourd'hui" », alors que l'ordre 1 fait de la fiche d'origine elle-même le premier pas (« son exercice […], la fiche elle-même »). L'abonné est envoyé ailleurs pour revenir à la page où il est déjà (V1). |
| C7 | Faisabilité au niveau | 10 | 10 | Deux développements conditionnels nommés pour l'entrée par article (transport de la source, correspondance par slug « au plus une douzaine de lignes »), seulement si la mesure les déclenche. |
| C8 | Questions à Thomas | 10 | 10 | C14 complète Q8 (connexion et paiement), trois options réelles, reco justifiée. |
| C9 | Exemples | 10 | 10 | La risquée de la rencontre (« Si on se revoit, c'est moi qui réserve. Je te promets un menu à deux plats. ») taquine sans viser. |
| C10 | Progression | 10 | 10 | Inchangée. |
| C11 | Pertinence pour l'audience réelle | 9 | 10 | « Un profil tiré de la personne […] vaut mieux qu'un parcours tiré de la page d'où elle vient » ; « `/parcours/repartie` sans étape équivaut à "pas de signal" » ; seuls les parcours informatifs (confiance, boulot, machine-a-cafe) comptent ; l'entrée par article est remise à la mesure. C'est exactement : construire ce que la donnée justifie, et mesurer avant de construire le reste. |

**Note globale : 9,9 / 10** (109 / 11 critères ; T9 : 9,7).

## Statut de mes corrections du tour 9

| # | Correction T9 | Statut | Commentaire |
|---|---|---|---|
| U1 | Parcours d'article avant le quiz | OK | Ordre 2 : réponse explicite, étape d'origine, quiz, parcours d'origine sans étape (hors repartie), défaut ; même principe pour l'ordre 1 ; règle « repartie sans étape = pas de signal ». |
| U2 | [MESURÉ A] et effectif minimal | OK | « Un relevé ne vaut [MESURÉ A] qu'au-delà de l'effectif minimal de 7.6 : avec quatre abonnés, trois touchers ne réordonnent l'écran de personne » (0.1), repris en 7.6, 7.7 et C13. |
| U3 | « Perdu au paiement » | OK | Formulation exacte et vérifiée (« relayé jusqu'à `/register`, jamais transmis au paiement ») ; essai réel du lot 0 maintenu. |
| U4 | Clusters insuffisants pour la table | OK, au-delà | Seconde table assumée (de catégorie, par slug, une douzaine de lignes au plus) et, surtout, mise hors V1 par la règle de priorité. |

Bilan sur 4 : 4 OK.

## Nouvelle correction

V1. **[NON BLOQUANT] Le bandeau de C14 C ne doit pas renvoyer ailleurs quand le premier pas est sur la page (4.2, C14 C, E5).**
- Passages : C14 C, « un bandeau unique, la première fois, "Ton premier pas : …" qui mène à "Aujourd'hui" » ; ordre 1, « Lien de retour : une vanne, un conseil ou une vidéo du catalogue → son exercice (« À toi de jouer » ou défi), la fiche elle-même » et « une étape de parcours → la plus courte fiche à geste de cette étape ».
- Problème : l'abonné qui arrive sur sa fiche est invité à partir vers « Aujourd'hui », qui lui montre l'exercice de la fiche qu'il vient de quitter. C'est un aller-retour inutile, au moment où chaque clic compte (les résiliations à 4 et 10 minutes, brief §1).
- Correction : quand le `returnTo` est un contenu précis, le bandeau désigne le geste sur la page même (« Ton premier pas : l'exercice ci-dessous », lien d'ancre) ; « Aujourd'hui » reste un lien secondaire du bandeau. À vérifier à l'étalon E5.

## Pour la présentation à Thomas (avis)

Si c'était mon projet, je lui présenterais le document en trois phrases :
1. L'espace a un moteur quotidien de 5 minutes qui entraîne le réflexe (réponse d'abord, puis les répliques), et pas seulement une bibliothèque mieux rangée.
2. Tout ce qui repose sur des données de visiteurs sert à choisir quoi écrire, jamais à décider ce que voient les abonnés ; les capteurs donneront la vraie demande au-delà d'un effectif minimal.
3. Les décisions qui lui reviennent sont C1 à C14, avec une reco chacune ; les cinq étalons viennent ensuite.

---
**Handoff → session principale**
- Fichier : `docs/espace-client/audit-contenu/iterations/tour-10-elon.md` ; note 9,9/10 sur 11 critères (T9 : 9,7). Mes 4 corrections du tour 9 : 4 OK (U4 au-delà : entrée par article mise hors V1 par la règle de priorité).
- Aucun bloquant. Un seul réglage non bloquant, V1 : le bandeau « Ton premier pas » de C14 C renvoie vers « Aujourd'hui » alors que le premier pas est sur la page même (fiche ou étape) ; il doit désigner le geste sur place.
- Avis : prêt à être présenté à Thomas après V1 (une phrase). Ce sont des AVIS : Thomas décide.
---
