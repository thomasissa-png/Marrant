# Revue à l'aveugle du cadrage app native v1 (@elon, s23, tour 2, 04/11/2026)

> AVIS CONSULTATIF : validation requise avant exécution. Objet relu : `docs/mobile/cadrage-app-native-s23.md` (v1).
> Décision actée et non discutée ici : app iPhone native, Android ensuite (choix de Thomas). Je challenge le comment.
> Verdict fondé sur la valeur persona (commandement 5). Revues v1 des autres relecteurs non lues.
> Sources : `project-context.md`, `docs/founder-preferences.md`, ma revue `elon-v0.md`, la grille `docs/mobile/attentes-utilisateur.md`.

## 0. Verdict en une ligne

Le moteur est maintenant pointé dans la bonne direction : le geste quotidien est écrit, chiffré, défendu. Mais le plan construit encore la fusée entière avant d'allumer le moteur (build 0 derrière toute l'API et toutes les user stories), et **personne n'a prévu le carburant** : aucun lot ne garantit qu'il y aura une vanne au niveau, avec un exercice de 30 secondes, chaque jour après la sortie.

## 1. Notes

| Critère | v0 | v1 | Justification courte |
|---|---|---|---|
| Valeur persona | 5 | 8 | Données réelles au §2, Sophie en entrée, Yanis et Marc en progression, décryptage comme pont. Manque : l'exercice de 30 s, cœur de la pratique, n'est ni vérifié dans le stock ni calibré. |
| Clarté du geste quotidien | 4 | 7,5 | Tableau en 5 étapes, une action par étape, critères binaires : bon. Deux trous qui cassent la boucle : comptage des gestes contradictoire, et vanne de la notification qui peut différer de la vanne ouverte (N5). |
| Centre de gravité du périmètre | 5 | 7 | §3 et §4 tournent autour du geste. Le plan (§13) et l'approvisionnement en contenu, eux, n'en dérivent pas (N1, N2). |
| Différenciation vs site | 6 | 8 | « 10× » en critères d'acceptation, widget en repli, hors ligne, recherche App Store traitée en canal. |
| Lien avec la conversion | 4 | 7,5 | Quatre moments et des interdits clairs, exercice du jour en décision 4. Reste : rien n'est mesuré avant la sortie publique (H6 après le lot 10, « Garder » non défini dans le build 0). |
| Hypothèses testables | 3 | 6,5 | Seuils posés, H0 ajoutée, H3 remplacée. Mais aucun seuil ne déclenche une décision, aucun échantillon minimal, H0 et H5 dépendent de changements du site non acquis (décision 9). |
| **Globale** | **4,5** | **7,5** | Gros progrès sur le fond produit. Sous la barre de 9 tant que le plan et le carburant ne sont pas alignés sur le geste. |

## 2. Statut des corrections v0 (vérifiées dans le corps du texte, pas dans le §16)

| Correction | Statut | Où dans le texte | Ce qui manque |
|---|---|---|---|
| O1 Un seul geste quotidien | **Traitée** | §2 « Valeur de l'app, une phrase », « Ce qui fait rester et payer » ; en-tête « Ce qui change » point 1 | Rien. Le §1 (question 1 à Thomas) rouvre le sujet, c'est légitime : décision du fondateur. |
| O2 Ce que les gens cherchent | **Traitée** | §2 « Données réelles », « Deux conséquences » | Rien (ajout utile : « autodérision » 339 impressions, 1 clic). |
| O3 Boucle de l'écran Aujourd'hui | **Traitée, avec une contradiction** | §3 tableau ; §3 « Sous la boucle » ; §4.2 | Comptage des gestes ambigu (N5). |
| O4 Série redéfinie | **Traitée** | §3 « Série de jours » ; décision 4 | Rien. Bon ajout : série et XP locaux du visiteur, fusion idempotente à la création du compte. |
| O5 Partage de premier rang | **Partiellement** | §3 étape 5 et « Carte image » ; §8 événement « vanne partagée » | La boucle d'acquisition s'arrête au destinataire : fiche du site « telle quelle », aucun chemin vers l'app, donc la métrique « installations venues d'un lien partagé » de H5 vaut zéro par construction (N4). |
| O6 Moments de conversion | **Traitée** | §3 « Moments de conversion », « Exercice de la vanne du jour ouvert à tous » ; décision 4 | Comportement de « Garder » dans le build 0 non écrit (S12). |
| O7 H0 et hypothèses chiffrées | **Partiellement** | §6 | Seuils oui. Échantillon : absent (« testeurs », sans nombre minimal). Date : seulement H0 et H2. Conséquence d'un seuil : absente. Hypothèse d'approvisionnement : absente (N1, N3). |
| O8 Build 0 avancé | **Partiellement, sur le papier seulement** | §13 lot 7 | Le lot 7 dépend des lots 1 (user stories de TOUS les écrans), 5b (TOUTE l'API mobile, carnet et `iap/sync` compris) et 6 (préproduction complète). C'est un lot 7 de nom, un lot 12 de fait (N2). |
| O9 Recherche App Store | **Traitée** | §2 « Entrées » ; §10 « Fiche App Store » ; lot 2 ; décision 12 | Mot-clé « humour noir » listé alors que la collection dépend de la décision 5 (S13). |

Souhaitables v0 : S1 à S10 **toutes traitées** (§4.1 premier lancement en 2 écrans, §3 widget en repli et sélection tout public, §4 quatre onglets, §2 « 10× », §4 collections et décision 5, lot 3 étalon de notification, §6 et lot 2 mesure préalable, §12 S3 lien TestFlight, §12 S9 et décision 15 testeurs, lot 8 questions à J7).

## 3. Ce qui fonctionne, ne pas toucher

- §3 en tableau à action unique : c'est exactement le niveau de précision attendu d'un cadrage.
- Série et XP locaux du visiteur avec fusion idempotente : rare de voir ce cas pensé si tôt.
- §5 de conformité à la grille utilisateur : chaque critère C1 à C11 a une réponse et un endroit.
- §7 « faits du code » : fin des suppositions de la v0, failles réelles trouvées (`register-token`, bouton admin, `daily-push`).
- §9 et §12 : changements du site isolés et soumis, aucune décision fondateur présumée.

## 4. Corrections OBLIGATOIRES (v1 vers v2)

**N1. Ajouter le lot « carburant du geste » et en faire une dépendance du build 0 et du lot 13.** Le produit de l'app, c'est une vanne au niveau Alexa par jour avec son décryptage et un exercice faisable en 30 s. Le plan construit le tuyau et oublie l'eau. Contenu du lot, confié à @copywriter avec la session principale :
- (a) Audit du stock du calendrier : date de fin des inédits [À VÉRIFIER : 124 jours au 18/10 donne une fin vers le 19/02/2027, soit autour de la sortie probable de l'app] ; part des vannes programmées qui ont un « Pourquoi ça marche » ET un « À toi de jouer » ; part des exercices réellement faisables en 30 s, en réponse écrite ou à voix haute.
- (b) Fréquence des vannes du jour en catégorie exclue (DATING, SOIREES, COUPLE) et durée de couverture des 93 vannes tout public au rythme de ces remplacements.
- (c) Étalons du format « exercice de 30 s » calibrés avec Thomas (P0 s8), puisque cet exercice devient la pratique quotidienne comptée dans la série.
- (d) Lot validé à l'aveugle couvrant au moins le build 0, puis la sortie + 90 jours [HYPOTHÈSE : horizon à fixer par Thomas], dans le même pipeline que les lots existants (choix du 18/10 sur le stock).
- Ajouter au §6 l'hypothèse **H-stock** : « on tient une vanne au niveau par jour, avec exercice de 30 s, sans trou » ; mesure : jours couverts au-delà de la sortie ; alerte : moins de 60 jours de stock (le seuil `degraded` de `/api/health` est à 14 jours, beaucoup trop court pour une app dont c'est le produit).

**N2. Rendre le build 0 réellement indépendant de la fusée complète** (§13). Découper :
- **Lot 1a** : user stories du geste seul (premier lancement, Aujourd'hui, notification, série, partage, états hors ligne, erreur réseau, contenu vide). Le lot 1b (Parcours, Explorer, Profil, offre) suit en parallèle.
- **Lot 5b-0** : `bootstrap` (contenu du jour, version minimale), push public `POST/PATCH/DELETE /api/mobile/push`, job d'envoi. **Pas de jetons ni de compte** : le build 0 tourne avec les droits du visiteur, la série est locale. Jetons, fiches par slug, carnet, `iap/sync`, `user/xp` passent au lot 5b-1.
- **Lot 3a** : textes du premier lancement, de la permission et de la notification, relus à l'aveugle (règle d'or P0 s18 : des testeurs réels sont des utilisateurs réels). Le lot 7 actuel ne dépend pas du lot 3, il partirait donc avec des textes non validés ou resterait bloqué sans que le plan le dise.
- Lot 6 réduit pour le build 0 : préproduction et EAS, plan de marquage des seuls événements du geste.
- Le développement du build 0 démarre sans le lot 0 (build simulateur et Maestro) ; seul l'envoi TestFlight attend le compte Apple [À VÉRIFIER par @infrastructure : build simulateur EAS sans compte Apple Developer].
- Nouvelle ligne : **lot 7 dépend de 0 (envoi seulement), 1a, 3a, 5b-0, 6 réduit, N1 (a, d)**.

**N3. Relier chaque seuil du §6 à une décision, et donner un échantillon.** Un seuil qui ne déclenche rien est une décoration. Pour chaque hypothèse : « si alerte, alors… », sans jamais remettre en cause l'app (décision de Thomas). Exemples à valider par @data-analyst : H1 en alerte, revoir le moment et le texte de permission ; H2, revoir le format de notification (mise en place seule contre accroche) ; H3', revoir l'heure proposée et le widget ; H4, revoir le format de l'exercice (N1 c) ; H5, revoir la carte ; H0, déplacer l'effort d'acquisition vers la recherche App Store et le partage plutôt que le site. Ajouter : nombre minimal de testeurs actifs pour lire chaque hypothèse, durée pour H1, H3', H4, H5. Écrire que H0 mesuré par TestFlight est une **borne basse** (installer TestFlight puis l'app double la friction d'un vrai téléchargement).

**N4. Rendre la boucle de partage mesurable et cohérente avec les règles du site.** Aujourd'hui, H0 dépend des changements S2 et S3 et H5 de S4, tous soumis à Thomas (décision 9) : le §6 doit le dire, sinon deux hypothèses sur six sont intestables si Thomas refuse. Proposer à Thomas, dans la décision 9, un chemin sans bandeau ni pop-up (règle du 17/10) : la carte image porte le nom de l'app et une ligne « une vanne par jour sur iPhone » (libellé @copywriter) ; le lien partagé porte une source (`?src=partage-app`) lue dans Umami, ce qui mesure les visites venues d'un partage même si la fiche reste telle quelle. Retirer de H5 la métrique « installations venues d'un lien partagé » tant qu'aucun chemin ne mène du destinataire à l'app.

**N5. Fermer les deux trous de la boucle** (§3) :
- **Comptage des gestes** : écrire la règle (le toucher de la notification ne compte pas, ou compte) et la rendre cohérente avec C2 de la grille (≤ 3 gestes depuis l'icône). Aujourd'hui « notification à chute lue : 1 geste » et l'étape 2 « Révéler la chute » se lisent comme 2 gestes.
- **Une seule vanne du jour par personne et par jour** : la notification, le widget et l'écran Aujourd'hui montrent la même vanne. Si la notification remplace une vanne de catégorie exclue par une vanne tout public, le toucher doit ouvrir cette vanne-là, sinon la mise en place lue dans la notification ne correspond pas à la chute révélée. Trancher : vanne tout public partout dans l'app ce jour-là, ou notification qui ouvre la vanne qu'elle annonce.

## 5. Corrections SOUHAITABLES

**S11. Ouverture par la notification : le toucher EST la révélation.** Sur le site, « Révéler la chute » a du sens parce que mise en place et chute sont sur le même écran. Depuis une notification, la personne a déjà fait le geste de curiosité ; lui redemander un toucher, c'est un frottement de plus sur chaque ouverture, tous les jours. Reco : ouverture depuis la notification, chute affichée avec une courte animation ; ouverture depuis l'icône, bouton « Révéler ». Arbitrage @ux, à mesurer dès le build 0.

**S12. Définir « Garder » dans le build 0.** Sans achat intégré, deux options honnêtes : bouton caché (H6 invisible jusqu'au lot 10), ou écran vrai « Garder fait partie de Premium, bientôt dans l'app » qui compte les touchers sans rien vendre ni promettre de date. Reco : la seconde, c'est le seul signal d'envie de payer disponible avant la sortie.

**S13. Mots-clés App Store alignés sur la décision 5** : « humour noir » seulement si la collection existe dans l'app (une métadonnée qui promet un contenu absent est un motif de refus et une déception).

**S14. Heure de la vanne : proposer des moments, pas une horloge.** Trois choix calés sur les personas (« trajet du matin », « pause déjeuner », « le soir », libellés @copywriter) plus « autre heure ». Moins de décision, meilleure acceptation de H1. L'heure reste choisie par la personne.

**S15. Build 0 et refus de notification** : le widget arrive au lot 11, après le build 0. Les testeurs qui refusent la notification n'ont aucun déclencheur quotidien. Soit le noter comme biais de lecture de H2 et H3', soit avancer un widget minimal (mise en place seule) si le coût natif le permet.

## 6. Ce qui dilue encore

- **Le plan, pas le périmètre.** Le périmètre V1 complet est conforme au commandement 5 et ne gêne pas le geste (onglets séparés). La dilution est dans les dépendances : tout le serveur passe avant le premier testeur (N2).
- **L'absence de contenu dans le plan** (N1) : 14 lots, aucun pour le seul ingrédient que l'utilisateur consomme chaque jour.
- **Les états transverses dans le build 0** : session expirée, Premium requis, double touche d'achat, mise à jour obligatoire n'ont rien à faire dans un build sans compte ni achat.

## 7. Hypothèses de cette revue et zones non auditées

- [À VÉRIFIER] Date de fin du stock de vannes du jour, part avec décryptage et exercice, part tout public ; build simulateur EAS sans compte Apple.
- [HYPOTHÈSE] Horizon de stock à la sortie + 90 jours (à fixer par Thomas).
- Non audité : faisabilité technique fine, règles Apple et juridique (revues @fullstack et @legal), maquettes inexistantes.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/elon-v1.md`
- Avis : globale 7,5/10 (valeur 8, geste 7,5, centre de gravité 7, différenciation 8, conversion 7,5, hypothèses 6,5). O1, O2, O3, O4, O6, O9 traitées ; O5, O7, O8 partielles. Cinq nouvelles obligatoires N1 à N5.
- Correction la plus importante : N1, le lot « carburant du geste » (stock de vannes du jour au niveau avec exercice de 30 s, couverture après la sortie), dépendance du build 0.
- À ré-invoquer : @product-manager (v2 : N1 à N5), @copywriter (N1 c et d), @data-analyst (N3), @fullstack et @infrastructure (N2, vérification du build simulateur).
- Points pour Thomas : horizon de stock (N1 d) ; chemin du partage vers l'app sans bandeau (N4, décision 9).
- Rappel : ce sont des AVIS, pas des directives. L'utilisateur décide.
---
