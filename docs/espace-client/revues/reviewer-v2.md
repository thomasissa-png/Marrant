# Revue @reviewer v2 : brief espace client s24 (commit df7f470)

> Livrable relu : `docs/espace-client/brief-espace-client-s24.md` (v2, 352 lignes). Brief non modifié.
> Méthode : les 36 corrections obligatoires des 4 revues v1 confrontées au texte v2 ; chaque fait ajouté vérifié par Read/Grep/Glob le 10/11/2026 ; dates contrôlées dans `docs/founder-preferences.md`.

## Note : 8,5/10. NO-GO, levé par 5 corrections de texte (aucune refonte)

Toutes les corrections obligatoires sont intégrées, et chaque fusion est justifiée dans le journal. Les faits ajoutés sur le code sont exacts. Il reste deux contradictions internes, que la session rencontrera dès les questions du lot 0. D'abord, le premier pas « identique à E0 » est impossible, et l'architecture suppose Q11 = A alors que la voie par défaut est B. S'y ajoutent un angle mort sur le mot « profil » dans les textes validés, un marquage hors format et un message de lancement qui interdit les étalons de barre dont Q2 a besoin.

| Contrôle | Verdict | Évidence |
|---|---|---|
| 1. Obligatoires des 4 revues appliquées | PASS | UX C1 à C11, design D1 à D8, growth O1 à O7, reviewer O1 à O10 : 36/36, la plupart au mot près. Les fusions sont justifiées (journal l. 343-351) : 307 au lieu de 308, « Fait » affiché comme statut, Q10 et Q11 fusionnées, critères D6 renumérotés 21-27 |
| 2. Aucun fait nouveau faux sur le code | PASS (2 précisions souhaitables) | Étapes 3/4/6/6/6 : `config/premium.ts:77-85` ; `ParcoursSlug` sur 3 slugs : `premium.ts:91` ; `getPathXpTotal` : `lib/progression.ts:60` ; `totalParcoursXp` utilisé par `parcours-detail.tsx:23,505` ; « x/N étapes complétées » : `parcours-detail.tsx:603` ; `ONBOARDING_PREMIUM_OUVERT = true` : `config/onboarding-premium.ts:21` ; `QUESTION_EQUIPE_OUVERTE = true` : `config/question-equipe.ts:11` ; aucun `first_premium_access` dans `src/` ; ancres `#rappel-parcours` (`rappel-parcours-toggle.tsx:109`) et `#abonnement` (`abonnement-card.tsx:64`, `footer.tsx:36`) ; `LearningPathStep` : `schema.prisma:278` ; routes `(liste)`, `/api/fiches/exercice`, `/api/user/xp` présentes ; `/profil` derrière `withAuth` (`middleware.ts:24,66`) |
| 3. Marquages « rouvre la décision du JJ/MM » | FAIL | Q6 B « rouvre la décision du 25/10 » : exact (`founder-preferences.md:135`, « rien en base »). Q5b A : « contredit l'avis @legal C13 », pas au format exigé au §4 (l. 180). C13 (`audit-parcours-apprentissage-s17/legal.md:63`) est maintenu par la décision du 07/10 (`founder-preferences.md:72`, « conditions juridiques déjà intégrées au code restent appliquées »). Q7 et les dates 05/10, 07/10, 11/10, 18/10, 21/10, 24/10, 07/11 et 08/11 sont exactes |
| 4. Résumé pour Thomas | FAIL | 10 lignes, lisible dans l'ensemble. Infidèle sur 2 points : la ligne 1 présente la barre propre à Q11 A comme acquise ; la ligne 5 oublie Q11 A et la ligne neuve de `/abonnement` (§3.8, état 3), qui demandent elles aussi un accord écrit. Jargon : « avis @legal C13 » |
| 5. Message de lancement §6 | FAIL | « Ne développe rien de l'espace avant mes réponses » n'admet qu'une exception, la mesure. Or le §4 (l. 182) demande à @design de rendre 3 barres en local AVANT Q2 : une session neuve bute sur cette contradiction. « Q1 à Q12 avec 3 options chacune » inclut Q7, qui est une annonce |
| 6. Tiret cadratin, concurrent nommé | PASS | Grep `[—–]` : 0 ; nom du site de la capture, de son outil, du coach et des personnes visibles sur la capture : 0 |

## Top 3

1. **R1, premier pas « identique à E0 » : impossible.** E0, approuvé le 07/11 et non modifiable, ne nomme aucune étape : « Par où commencer : la première étape d'un parcours, au choix parmi {listeParcours}. {url}/parcours » (`docs/copy/onboarding-premium-s23-emails.md:37`). Le §3.2 exige pourtant un premier pas nommé, « jamais un choix à faire », et identique à celui d'E0. La phrase vient de ma correction O6 v1, que je corrige ici.
2. **R2, la voie par défaut B (Q11) contredit l'architecture.** Ces quatre endroits supposent tous A : le §3.1 (« Maximum 6 entrées » avec Parcours et Carnet), la précision (1) de la reco de Q3 (les 7 onglets migrent), la ligne 1 du résumé et le message §6. Si Thomas répond B ou ne répond pas, le lot 1 n'a plus de spécification de barre.
3. **R3, le mot « profil » est figé dans au moins 15 textes validés.** Ni Q2 ni le critère 13 ne le voient : renommer « Mon profil » ou ne plus l'afficher rend ces textes faux.

## Corrections restantes OBLIGATOIRES (texte exact)

**R1. Premier pas et E0.**
- §3.2, bloc 2 : remplacer « Le premier pas proposé est celui de l'e-mail E0 (même étape, même formulation, sauf étalon contraire ; les textes de E0 ne sont pas modifiés par ce chantier). » par :
« Le premier pas nommé ici est le même que sur la page de succès. L'e-mail E0 approuvé le 07/11 ne nomme aucune étape (« Par où commencer : la première étape d'un parcours, au choix parmi {listeParcours}. {url}/parcours », `docs/copy/onboarding-premium-s23-emails.md` l. 37) : il n'est pas modifié, l'espace précise ce qu'E0 laisse ouvert. »
- §3.2, « Moment aha » : remplacer « Ce premier pas est LE MÊME dans la page de succès, l'e-mail E0 (« Par où commencer ») et « Aujourd'hui » » par « Ce premier pas est LE MÊME dans la page de succès et dans « Aujourd'hui » ; l'e-mail E0 (approuvé, non modifié) renvoie à /parcours sans nommer d'étape, ce qui reste cohérent avec toute réponse à Q10 ».
- §4, Q10, colonne Reco : remplacer « Même premier pas dans la page de succès, E0 et Aujourd'hui » par « Même premier pas dans la page de succès et Aujourd'hui (E0 inchangé : il ne nomme pas d'étape). L'option A (15 à 20 min) ne respecte pas la règle des 5 minutes du §3.2 : à dire à Thomas ».
- Journal, arbitrages : remplacer « Premier pas : même formulation que E0 reprise dans Aujourd'hui sans modifier E0 (reviewer O6 contre growth O6 : E0 non modifié). » par « Premier pas : E0 (approuvé le 07/11) ne nomme aucune étape ; le premier pas nommé vit dans la page de succès et Aujourd'hui, E0 n'est pas modifié (reviewer O6 v1 corrigé par reviewer v2 R1). »

**R2. Q11 : la voie par défaut B doit avoir sa barre.**
- Résumé, ligne 1 : remplacer « avec une barre de rubriques sous l'en-tête (Aujourd'hui, Parcours, Carnet, Favoris et notes, Écrire à l'équipe, Plus) » par « avec une barre de rubriques sous l'en-tête (son contenu exact dépend de ta réponse à Q11) ».
- §3.1, paragraphe « Maximum 6 entrées visibles (UX C6). » : insérer en tête « Si Q11 = A : » et ajouter en fin : « Si Q11 = B (voie par défaut tant que Thomas n'a pas répondu) : la sous-barre n'existe que sous /mon-espace et ne porte que Aujourd'hui, Ma progression, Mes notes, Écrire à l'équipe et Mon compte ; l'en-tête garde ses 7 onglets ; les autres rubriques restent dans l'en-tête public. »
- §4, Q3, reco, précision (1) : remplacer « (1) Pour l'abonné, l'en-tête garde logo, recherche, cloche (si Q6 ≠ C) et menu de compte, et ses 7 onglets passent dans la sous-barre : aucune rubrique n'apparaît deux fois (voir Q11). » par « (1) Si Q11 = A : pour l'abonné, l'en-tête garde logo, recherche, cloche (si Q6 ≠ C) et menu de compte, et ses 7 onglets passent dans la sous-barre. Si Q11 = B : en-tête inchangé, sous-barre limitée aux rubriques neuves de /mon-espace. Dans les deux cas, aucune rubrique n'apparaît deux fois. »

**R3. Le mot « profil » dans les textes validés.**
- §2.2 : ajouter une puce après « Liens vers `/profil` en dur » :
« Le mot « profil » figure dans au moins 15 textes client validés ou approuvés : réassurance unique « Résiliable depuis ton profil. » (`config/textes/offre.ts:60`, choix du 18/10) ; texte Stripe et e-mail de confirmation (`paiement.ts:121` et `:296`, choix du 07/10) ; bienvenue E0 (`paiement.ts:364-365`, approuvé le 07/11) ; lettre de la semaine (`lettre-hebdo-s21.ts:44,90,91,93,106,177`) ; rappel de parcours (`parcours-emails.ts:87,89`) ; question à l'équipe (`question-equipe-s22.ts:88`) ; réactivation (`offre.ts:129`) ; CGU et confidentialité (`confidentialite/page.tsx:153,156,194`). Retirer le libellé « Mon profil » rend ces textes faux, et les modifier rouvre ces validations : accord écrit de Thomas requis, et les e-mails approuvés doivent être réapprouvés. Contrainte : une entrée visible « Mon profil » reste dans le menu de compte et mène aux réglages du compte, quel que soit le nom retenu à Q2. »
- §4, Q2, colonne Reco : ajouter en fin « ; quel que soit le choix, l'entrée « Mon profil » reste visible (§2.2 : au moins 15 textes validés disent « depuis ton profil ») ».

**R4. Marquage et résumé.**
- §4, Q5b, option A : remplacer « contredit l'avis @legal C13 (aucun champ libre), accord écrit de Thomas requis » par « rouvre la décision du 07/10 (conditions juridiques déjà intégrées au code maintenues, dont l'avis @legal C13 : aucun champ libre), accord écrit de Thomas requis ».
- Résumé, ligne 5 : remplacer toute la ligne par :
« 5. Rouvrent une décision déjà prise, donc ton accord écrit est requis : Q6 option B (garder les questions à l'équipe pour afficher les réponses) rouvre la décision du 25/10 ; Q5b option A (notes en texte libre) rouvre la décision du 07/10 (aucun texte libre stocké). Ton accord écrit est aussi requis pour Q11 option A (la barre de l'espace sur les pages publiques, pour l'abonné seulement) et pour la phrase ajoutée sur /abonnement pour les anciens abonnés. »

**R5. Message de lancement (§6).**
- Remplacer « (seule exception : la mesure d'usage du lot 0, construite en local ; son déploiement attend mon go écrit) » par « (seules exceptions : la mesure d'usage du lot 0, construite en local, dont le déploiement attend mon go écrit ; et les 3 rendus de barre de @design pour Q2, en local, interrupteur fermé, jamais déployés) ».
- Remplacer « pose-moi les questions Q1 à Q12 dans l'ordre du §4 » par « pose-moi les questions Q1 à Q12 dans l'ordre du §4 (Q7 est une annonce, pas une question) ».

## Corrections souhaitables (une ligne chacune)

- §2.3 et journal (« existent peut-être tous deux ») : les deux existent. `getPathXpTotal` est le total serveur, renvoyé par `/api/parcours/[id]/progress` (`pathXpTotal`, route l. 83 et 130) et prioritaire ; `totalParcoursXp` est le repli côté navigateur (`parcours-detail.tsx:505`). Le bonus est défini deux fois (`PATH_COMPLETION_BONUS_XP` et `PARCOURS_BONUS_FIN_XP`, `parcours-xp.ts:8`).
- §3.8, état 2 : la réactivation existe déjà (`abonnement-card.tsx:39`, état « resilie » ; `offre.ts:129` « Ton Premium court jusqu'au {date}. Pour le garder, réactive-le depuis ton profil. »). Réutiliser ces textes validés plutôt que « Reprendre l'abonnement » : le [À VÉRIFIER] tombe.
- Lot 1 : ajouter `/mon-espace` à `AUTH_ROUTES` (`middleware.ts:24`). Le middleware lit le plan dans le jeton (`token.plan`, l. 47 et 53) : la garde « plan relu en base » se fait dans la page et l'API.
- Q11 A : citer la règle du 21/10 (« toute refonte : proposer d'abord en une phrase et attendre son accord ») comme source de l'accord requis.
- Critère 4 : largeurs à aligner sur le garde-fou existant (souhaitable v1, non repris).
- §6 : indiquer la branche de travail (souhaitable v1, non repris).

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| Brief §3.2 (premier pas nommé, identique à E0) | `onboarding-premium-s23-emails.md:37` (E0 approuvé) | E0 propose un choix de parcours | Haute (Q10, lot 1) | R1, @product-manager |
| Brief §3.1, Q3, résumé | Brief Q11 et arbitrage (B par défaut) | La barre décrite n'existe qu'avec A | Haute (Q2, Q3, lot 1) | R2, @product-manager |
| Brief Q2, §3.1 « Mon compte » | 15+ textes validés « depuis ton profil » | Renommer casse des textes approuvés | Haute (Q2) | R3, @product-manager |

## Recommandation

**NO-GO tant que R1 à R5 ne sont pas intégrées** (texte seul, sans refonte), puis GO. Agent à relancer : @product-manager avec ce rapport ; nouvelle vérification limitée à R1-R5. Note attendue après correction : 9,5/10.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/espace-client/revues/reviewer-v2.md`
- Décisions prises : 8,5/10, NO-GO levé par R1 à R5 ; 36/36 obligatoires v1 appliquées ; brief non modifié
- Points d'attention : R1 corrige ma propre O6 v1 (E0 ne nomme pas d'étape) ; voie par défaut de Q11 sans spécification de barre ; mot « profil » figé dans des textes approuvés
---
