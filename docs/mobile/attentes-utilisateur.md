# Attentes utilisateur de l'app iPhone : grille de notation (s23, 04/11/2026)

> Auteur : @ux. Sert de critère de notation à chaque étape clé (un panel d'agents joue chaque persona à l'aveugle). Sources lues : `docs/strategy/personas.md`, `docs/mobile/revues-cadrage/donnees-gsc-2026-10.txt`, `docs/analytics/snapshot-trafic-2026-10-05.md`, `docs/marrant/audit-conversion-s20.md`, rapport du lundi 02/11 (chiffres transmis par Thomas, semaine du 26/10 au 01/11), `docs/mobile/cadrage-app-native-s23.md` (non noté ici).
> Convention : **[MESURÉ]** = chiffre lu dans une source citée. **[HYPOTHÈSE]** = interprétation à valider auprès de vrais testeurs. Aucune donnée n'est inventée : quand une valeur manque, elle est dite manquante.

## 1. Les personas et le travail qu'ils confient à l'app

Les personas viennent de `personas.md` (prénoms internes, jamais en public). Les durées d'usage sont des [HYPOTHÈSE] déduites des moments et horaires du document, sauf mention contraire.

| | **Yanis, 20 ans, étudiant (principal)** | **Sophie, 26 ans, jeune active** | **Marc, 34 ans, récemment séparé** |
|---|---|---|---|
| **Travail confié (JTBD)** | « Quand on me chambre et que je reste muet, donne-moi de quoi répondre du tac au tac, ce soir. » | « Quand je suis à la machine à café ou en afterwork, donne-moi une blague courte que je peux ressortir mot pour mot. » | « Quand j'ai un premier date ou une soirée, aide-moi à retrouver ma place sans être le mec gênant. » |
| **Moment d'usage** (source : horaires et moments clés du persona) | Le soir 21h-23h (scroll), et juste avant de sortir (soirée, coloc). Sessions courtes, au lit ou dans le canapé. | Trajet 8h-9h, pause déjeuner 12h-13h. Session de 1 à 3 min, debout ou dans les transports. | Matin calme 7h-8h, soirée 20h-21h. Sessions plus longues, posées, avant un rendez-vous. |
| **Ce qui le fait revenir demain** | Une nouvelle vanne à chambrer dans le groupe, une série qu'il ne veut pas casser, un défi qu'il peut tester le soir même. | Une nouvelle blague courte à l'heure de sa pause, sans rien lire de long, adaptée au boulot. | Un « truc à tester aujourd'hui », une progression qu'il voit avancer, un contenu qui ne le prend pas pour un ado. |
| **Ce qui le fait désinstaller** | Ça ressemble à un cours, ton formel ou corporate, rien sur la vie étudiante, honte d'être timide non rassurée. | Contenu long, blagues datées ou ringardes, formats pas prêts à l'emploi, notifications insistantes. | Contenu « jeune », motivation molle sans action concrète, absence de progression visible. |
| **Sensibilité au prix** | Élevée [HYPOTHÈSE : étudiant ; aucune donnée de prix propre à ce persona]. Veut tout essayer avant de payer. | Moyenne [HYPOTHÈSE]. Paiera pour gagner du temps si la valeur est claire dès la première semaine. | Plus faible [HYPOTHÈSE]. Paiera pour une progression structurée s'il la voit avant d'acheter. |

Prix en vigueur à noter pour la sensibilité : Premium 1,99 € TTC/mois ou 16,99 € TTC/an (cadrage s23, §préambule). Aucune étude de consentement à payer n'existe : tout est à mesurer.

## 2. Constats tirés des données réelles

| # | Constat (chiffre, source) | Statut | Ce que ça implique pour l'app |
|---|---|---|---|
| 1 | 75 % des clics Google viennent du mobile : 300 clics sur 398 (mobile 300, ordinateur 89, tablette 9), Search Console 28 j. | MESURÉ (`donnees-gsc-2026-10.txt`) | L'app répond à l'usage dominant. Tout écran se juge à une main, en 2 à 3 minutes. |
| 2 | Les requêtes qui font cliquer sont des demandes de blagues prêtes à l'emploi : « blague à mourir de rire 2026 » 38 clics, « blague humour noir 2026 » 27, « blague 2026 » 20, « meilleur blague 2026 » 16, « blague halloween adulte » 10. | MESURÉ (GSC 28 j) | Les gens viennent chercher **la blague**, pas un cours. La première valeur de l'app doit être une vanne utilisable, pas une explication. |
| 3 | Les requêtes d'apprentissage ne font pas cliquer : « comment devenir drôle » 34 impressions, 0 clic, position 21,9 ; « comment faire rire quelqu'un » 94 imp, 0 clic ; « une répartie » 46 imp, 0 clic. | MESURÉ (GSC 28 j) | Peu de visiteurs arrivent avec l'intention « progresser ». Le parcours doit être proposé après la première blague, jamais comme porte d'entrée. [HYPOTHÈSE : l'intention d'apprendre existe mais arrive plus tard, via le bouche à oreille.] |
| 4 | Semaine du 26/10 au 01/11 : 205 visiteurs, 215 visites, temps moyen 34 s, rebond 40,9 %. Top page : « meilleures blagues drôles 2026 » (66). Sources : google 83, bing 30, duckduckgo 8, ecosia 7, freepublicapis 6. | MESURÉ (rapport du lundi 02/11) | La visite est courte : la valeur doit arriver en moins de 30 s. Le rebond est passé de 88 % (28 j, 05/10) à 40,9 % : les encarts s21 aident, sans conclure sur la cause. |
| 5 | Les parcours sont peu commencés : 6 pages vues de parcours, 5 parcours ouverts, 6 étapes ouvertes, 1 quiz d'étape terminé, 0 étape 1 validée dans les 48 h sur 3 visiteurs concernés. | MESURÉ (rapport du 02/11) | Le parcours n'est pas un moteur d'entrée. Dans l'app, il doit se présenter comme un défi de 5 minutes, pas comme un programme de 6 étapes. Volumes trop faibles pour conclure plus. |
| 6 | 38 murs Premium vus, 3 vues de `/abonnement`, 1 clic vers le paiement. 4 abonnés actifs, 0 nouveau Premium, 0 inscription. | MESURÉ (rapport du 02/11) | Les murs sont vus mais ne convainquent pas : l'utilisateur ne sait pas ce qu'il achète. Le Premium de l'app doit se montrer par un extrait réel avant tout mur. |
| 7 | Article n°1 : 97 % de sorties, 0 clic sur son appel à l'action, premier lien produit à environ 77 % de la page mobile (avant s21). | MESURÉ (audit s20 §2) | Une fois la blague trouvée, le visiteur part. Sans raison de revenir (notification choisie, vanne du jour), l'app aura le même profil : une visite, puis plus rien. |
| 8 | Aucun moyen de recontacter un visiteur qui n'achète pas (note 1,5/10 en capture des non-acheteurs). | MESURÉ (audit s20, @growth) | La notification quotidienne est le seul canal de retour : sa qualité et son opt-in en contexte comptent plus que le catalogue. |
| 9 | 5 visiteurs sur 6 qui arrivent sur `/abonnement` cliquent vers le paiement (volume trop faible pour conclure). | MESURÉ mais NON CONCLUANT (audit s20) | Ne pas redessiner l'écran d'offre en premier : le problème est l'exposition, pas la page. |
| 10 | Plateau de 20 à 30 visites par jour depuis août, 13 comptes au 05/10 (11 FREE, 2 PREMIUM). | MESURÉ (snapshot 05/10) | Pas d'audience captive : l'app doit convaincre un inconnu en une session. |
| 11 | Persona Marc et Sophie : aucune donnée comportementale propre (les requêtes GSC ne distinguent pas les personas). | MANQUE | Les critères 7 et 8 pour Sophie et Marc reposent sur `personas.md` seul : à valider en TestFlight. |

## 3. La grille (11 critères, notés par le panel)

Chaque juré joue un persona à l'aveugle (il n'a ni le brief ni les intentions de l'équipe), prend l'écran ou le prototype tel quel, et répond. B = binaire (réussi/échoué). N = noté /10, seuil de réussite indiqué. Un critère « bloquant » échoué = NO-GO de l'étape, quelle que soit la moyenne.

| # | Critère (point de vue utilisateur) | Question que le panel se pose | Type, seuil |
|---|---|---|---|
| **C1** | **Je comprends à quoi sert l'app en moins de 30 s.** | « Sans explication, après 30 s, puis-je dire en une phrase ce que l'app fait pour moi ? » (mesurer le temps, demander la phrase.) | B, bloquant. Réussi si la phrase du juré correspond à « des blagues et de la répartie utilisables », pas à « une plateforme d'apprentissage ». |
| **C2** | **Je trouve une réplique utilisable en moins de 3 gestes depuis l'ouverture, sans compte.** | « Depuis l'icône, combien de gestes (touchers, défilements) avant d'avoir une vanne que je peux dire ? » | B, bloquant. Réussi si ≤ 3 gestes et aucun écran de compte ni de paiement avant. |
| **C3** | **La réplique est prête à l'emploi : courte, mémorisable, dite telle quelle.** | « Je peux la dire ce soir, mot pour mot, devant mes potes (ou collègues) sans la retoucher ? Elle est drôle pour moi, à mon âge ? » | N, seuil moyen ≥ 8/10 sur 5 vannes tirées au hasard. Aucune note sous 5. |
| **C4** | **Je peux l'emporter : copier, partager ou retrouver en un geste.** | « Puis-je l'envoyer à un pote ou la garder pour plus tard en 1 geste, même sans réseau ? » | B. Réussi si partage natif ou copie en 1 geste, et accès hors ligne au contenu du jour. |
| **C5** | **Rien ne me bloque avant d'avoir reçu de la valeur.** | « Avant ma première vanne, ai-je vu un mur, un prix, une demande de compte ou plus de 2 écrans d'accueil ? » | B, bloquant. Réussi si aucun mur ni prix avant la première valeur, permission de notification demandée seulement après. |
| **C6** | **Le ton est le mien : complice, jamais un cours, jamais corporate, jamais condescendant.** | « Est-ce qu'on me parle comme un pote drôle qui m'encourage, ou comme un prof, une pub ou un ado ? » | N, seuil ≥ 8/10 pour chaque persona. Une phrase notée « scolaire » ou « corporate » par un juré = à corriger. |
| **C7** | **Ça parle de MA situation.** | « Y a-t-il un contenu qui correspond à mon moment (soirée/coloc ; machine à café/afterwork ; premier date/reprise de confiance) ? Je me sens visé ou exclu ? » | N, seuil ≥ 7/10 par persona. Un persona qui se sent exclu (trop « étudiant », trop « boulot ») = à corriger. |
| **C8** | **Le défi est faisable ce soir et je vois que j'avance.** | « Puis-je faire un défi en moins de 5 min, et voir ensuite que quelque chose a bougé (série, XP, étape) ? » | N, seuil ≥ 7/10. Un défi qui demande plus de 5 min, ou une progression invisible = échec. |
| **C9** | **J'ai une bonne raison de revenir demain, et je garde la main.** | « Qu'est-ce qui me ferait rouvrir l'app demain ? Puis-je choisir l'heure, couper le rappel, et la notification est-elle utile (une vanne, pas une promo) ? » | N, seuil ≥ 7/10, avec condition B : aucune notification promotionnelle ni prix, heure choisie par l'utilisateur. |
| **C10** | **Je sais ce que j'achète avant de payer, et je ne me sens pas piégé.** | « Avant l'écran de paiement, ai-je vu un extrait réel de ce que Premium débloque ? Prix, durée, renouvellement, résiliation et restauration sont-ils clairs ? Le mur me pousse-t-il ou me force-t-il ? » | N, seuil ≥ 8/10, avec condition B : prix, renouvellement et « Restaurer mes achats » visibles sur l'écran d'offre. |
| **C11** | **L'app est fiable et me respecte.** | « Rapide (≤ 2 s sur les actions courantes), pas de plantage, états vide/erreur/hors ligne compréhensibles avec une sortie, suppression de compte possible dans l'app, aucune donnée demandée sans raison ? » | B, bloquant. Réussi si les 5 états transverses sont lisibles et si la suppression du compte est faisable en 2 touches. |

**Règle de décision d'une étape** : GO si les 5 critères bloquants (C1, C2, C5, C11 et la condition B de C9) sont réussis ET la moyenne des critères notés ≥ 8/10 ET aucun persona sous 7 sur un critère noté. Sinon itération. Le panel note chaque persona séparément : une moyenne qui cache un persona en échec ne passe pas.

**Biais à contrôler** : un juré agent connaît le sujet. Lui interdire l'accès au cadrage, ne lui montrer que l'écran, et lui demander de justifier chaque note par une citation de l'écran. Les notes d'agents ne remplacent pas celles de vrais testeurs (section 4).

## 4. Questions pour les vrais testeurs (TestFlight, plus tard)

À poser sans les aider, après 3 jours d'usage libre, par message court ou appel de 5 min. Pas de questionnaire long.

1. En une phrase, à quoi sert cette app ? (réponse à noter mot pour mot, sans correction)
2. Quelle est la dernière blague ou réplique que tu as vraiment dite à quelqu'un grâce à l'app ? Qu'est-ce qui s'est passé ?
3. Qu'est-ce qui t'a fait ouvrir l'app, ou pas, la 2e et la 3e journée ?
4. À quel moment as-tu trouvé que l'app te parlait comme à un élève, à un ado ou à un collègue ? (sinon : « jamais »)
5. Qu'as-tu pensé de la notification (heure, contenu) ? L'as-tu coupée, et pourquoi ?
6. Si tu devais payer pour quelque chose dans l'app, ce serait pour quoi ? Qu'est-ce qui t'a manqué pour te décider (sans parler de prix) ?
7. Qu'est-ce qui te ferait supprimer l'app aujourd'hui ?

## 5. Limites

- Les durées d'usage et la sensibilité au prix sont des [HYPOTHÈSE] : aucune donnée comportementale ne distingue les personas aujourd'hui (constat 11).
- Les volumes sont très faibles (205 visiteurs par semaine, 38 murs vus, 4 abonnés) : aucun chiffre ci-dessus ne permet de chiffrer un gain attendu, seulement d'orienter.
- Les chiffres du rapport du 02/11 viennent de Thomas, non relus dans Umami par @ux. Le rebond de 40,9 % n'est pas comparable à celui du 05/10 (88 %) : rupture de mesure du 19/10 et du 18/10 notée dans `audit-conversion-s20.md`.

## Handoff

- **Fichier produit** : `docs/mobile/attentes-utilisateur.md`.
- **Décisions** : 11 critères, 5 bloquants (C1, C2, C5, C11, condition de C9), seuil moyen ≥ 8/10, notation par persona.
- **Points d'attention** : la première valeur doit être une blague prête à l'emploi (constats 2 et 3), le parcours vient après (constat 5), la notification est le seul canal de retour (constat 8).
- **Prochain** : @product-manager (reprendre les critères dans les critères d'acceptance des user stories), @data-analyst (événements pour C2, C5, C9, C10).
