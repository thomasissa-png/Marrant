# Tour 8 : relecture à l'aveugle de l'architecture de contenu v8 (@elon)

> AVIS CONSULTATIF, validation requise avant exécution. Relecteur indépendant, sans accès aux autres avis du tour 8.
> Lu : `architecture-contenu-v8.md` (0, 2.2, 4.2, 4.4, 7.5 à 7.7, C12, C13, E1 à E5, annexe A pour EL7). Vérifié : `founder-preferences.md` l. 20 (pivot du 06/05 « conseils > vannes (la vraie valeur = articles décryptés, parcours, vidéos, pas le catalogue de vannes) »), cité en C13.
> Fait fourni par la session et pris en compte : depuis un article, le bouton d'abonnement passe `/abonnement?src=blog-<slug>` (`blog-article-view.tsx` l. 41), **pas `returnTo`** ; rien ne garantit que ce `src` survive jusqu'après le paiement.

## Verdict en une phrase

Mes quatre corrections du tour 7 sont bien faites, et O1 est même mieux que ce que je demandais : « une autre » ne puise jamais dans les inédits du calendrier, et la carte a son geste. Mais la v8 a bâti sa nouvelle entrée principale (« l'abonné vient d'un article ») sur un mécanisme qui n'est pas celui du code :
- **ce n'est pas `returnTo` mais `src`**, et personne ne sait si ce paramètre arrive jusqu'à l'espace après Stripe ;
- tant que ce n'est pas vérifié, la table « catégorie d'article, situation d'entrée » personnalise une entrée qui n'existe peut-être pas.

## Notes

| # | Critère | T7 | T8 | Justification (passage cité) |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 10 | « Ce soir, c'est plutôt ? », geste « ressors-la à voix haute ce soir », geste « pour plaire » qui met en avant le filtre rencontre sans créer de parcours. |
| C2 | Respect des décisions | 10 | 10 | C13 cite le pivot du 06/05 (vérifié l. 20) et marque l'option A « va à l'encontre du pivot » ; « une autre » ne consomme pas le stock d'inédits (décision du 18/10) ; la règle de décision à J60 dit « Rien ne change sans sa décision ». |
| C3 | Zéro donnée inventée | 10 | 9 | « Le lien de retour (`returnTo`) : l'abonné vient d'une fiche ou d'un article du blog » (4.2) : le code dit `src=blog-<slug>`, pas `returnTo`. Le document marque « [À VÉRIFIER] : que `returnTo` porte le slug », mais il vérifie la mauvaise chose (S1). |
| C4 | Rubriques claires | 10 | 10 | Inchangé. |
| C5 | Ambition | 10 | 10 | Inchangé. |
| C6 | Cohérence | 9 | 9 | Prise de parole dans la rafale réglée (« Ta première phrase d'abord »). Deux nouveaux trous : la table des articles fait de « Une vanne pour ce soir » le premier pas des arrivants depuis un article de blagues, mais si Thomas choisit C13 C, cette carte n'existe plus dans « Aujourd'hui » (S2) ; la règle de décision à J60 pousse vers « plus de catalogue », c'est-à-dire contre le pivot du 06/05 que C13 cite, sans le dire (S3). |
| C7 | Faisabilité au niveau | 10 | 9 | Le chantier de développement (7.3) ne contient pas la tâche qui fait vivre le signal d'article : transmettre `src` à travers l'inscription, Stripe et la page de succès jusqu'au compte (S1). |
| C8 | Questions à Thomas | 10 | 10 | C13 est honnête : la mesure vient de visiteurs, le pivot du 06/05 est cité, la reco B se justifie et se corrigera par la mesure. |
| C9 | Exemples | 10 | 10 | Inchangé. |
| C10 | Progression | 10 | 10 | Inchangé ; premier pas sous 5 minutes même depuis une étape. |
| C11 | Pertinence pour l'audience réelle | 8 | 9 | O1 réglé, et le capteur par univers est en place. Mais la personnalisation la plus ambitieuse (l'entrée par l'article, « l'entrée la plus fréquente chez les visiteurs ») dépend d'un signal non vérifié. Et les données disent déjà que ce passage est quasi vide : « 0 clic sur 69 vues d'encarts d'article », 3 vues de `/abonnement` dans la semaine du 26/10 (`besoins-audience-donnees-internes-s24.md` S5, S7). |

**Note globale : 9,6 / 10** (106 / 11 critères ; T7 : 9,7). La baisse vient d'un fait nouveau du code, pas d'un recul du document.

## Statut de mes corrections du tour 7

| # | Correction T7 | Statut | Commentaire |
|---|---|---|---|
| O1 | « Une vanne pour ce soir » au hasard | OK, au-delà | Toucher « Ce soir, c'est plutôt ? » sur `JokeCategory`, sans contenu neuf, capteur anonyme ; en plus, « jamais dans les vannes inédites réservées au contenu du jour » et un geste. Sa place devient la question C13, avec la reco B (sous le contenu du jour). C'est acceptable : la place est un choix de Thomas, et le pivot du 06/05 justifie la prudence. |
| O2 | Règle de décision écrite d'avance | OK | 7.6, seuils X et Y par @data-analyst, « on soumet à Thomas une repondération ». Précision en S3. |
| O3 | Prise de parole dans la rafale | OK | « Ta première phrase d'abord », public proche ou large, trois ouvertures. |
| O4 | Esprit de l'escalier, trac | OK | Accroche confiée à E5 et testée à l'aveugle ; trac rattaché aux missions 1 et 2, à la rafale et à « Le blanc ». |

Bilan sur 4 : 4 OK.

## Nouvelles corrections

S1. **[BLOQUANT] Le signal « vient d'un article » est mal nommé et peut-être inexistant (4.2, 7.3, 7.7, annexe B).**
- Passages : « Le lien de retour (`returnTo`) : l'abonné vient d'une fiche ou d'un article du blog. C'est l'entrée la plus fréquente chez les visiteurs [MESURÉ] [...] [À VÉRIFIER] : que `returnTo` porte le slug de l'article » ; annexe B, « Si `returnTo` porte le slug de l'article d'origine ».
- Fait : le bouton d'abonnement d'un article envoie `/abonnement?src=blog-<slug>` (`blog-article-view.tsx` l. 41). Ce n'est pas `returnTo`. Rien ne dit que `src` passe l'inscription, Stripe et la page de succès pour arriver jusqu'au compte.
- Problème : une table de 7 lignes, un ordre de priorité et un capteur (7.7, point 3, « y compris un article ») reposent sur un tuyau dont on ignore s'il est branché. C'est le défaut classique de l'ingénieur qui conçoit le moteur avant d'avoir vérifié l'arrivée de carburant.
- Correction :
  - (a) renommer le signal « origine de l'abonnement (`src=blog-<slug>`) », séparé de `returnTo` (fiches et étapes) ;
  - (b) mettre en prérequis du lot 0 un essai réel : article, `/abonnement?src=…`, inscription, paiement test, page de succès, puis vérifier ce que l'espace reçoit ;
  - (c) si `src` se perd, ajouter au chantier de 7.3 la tâche de le transporter jusqu'au compte (par exemple dans les métadonnées de la session de paiement [HYPOTHÈSE technique, à trancher par @fullstack]) ;
  - (d) tant que (b) n'est pas fait, écrire en tête de la table « s'applique seulement si le signal arrive » ;
  - (e) corriger l'annexe B (« si `src` survit au paiement » au lieu de « si `returnTo` porte le slug »).
  - Remettre aussi le chiffre à sa place : la part des abonnés venus d'un article est inconnue et les données actuelles la disent faible (0 clic sur 69 vues d'encarts, 3 vues de `/abonnement` par semaine). La table est utile, pas prioritaire.

S2. **[NON BLOQUANT] Premier pas « Une vanne pour ce soir » si C13 = C (4.2, C13).**
- Passage : table des articles, « Blagues [...] → "Une vanne pour ce soir" et son "À toi de jouer" » ; C13 C, « Pas de carte dans "Aujourd'hui" ».
- Correction : une demi-phrase. Si C13 = C, le premier pas d'un arrivant depuis un article de blagues ouvre la Bibliothèque sur la catégorie de l'article, avec le même geste.

S3. **[NON BLOQUANT] La règle de décision à J60 touche le pivot du 06/05 (7.6).**
- Passage : « on soumet à Thomas une repondération : plus de catalogue contextuel et de situations, moins de types de leçons ».
- Problème : le 06/05, Thomas a écrit que « la vraie valeur » n'est « pas le catalogue de vannes » ; C13 le cite, 7.6 non. La règle est saine (elle ne décide rien), mais la question posée à Thomas à J60 doit lui rappeler qu'elle touche cette décision.
- Correction : ajouter « (touche le pivot du 06/05, "conseils > vannes") » à la phrase de 7.6.

## Ce qui manque encore pour 10

S1 : renommer un signal, mettre un essai réel en prérequis du lot 0 et prévoir une tâche de développement de secours. S2 et S3 sont des demi-phrases. Le reste est au niveau.

---
**Handoff → session principale**
- Fichier : `docs/espace-client/audit-contenu/iterations/tour-8-elon.md` ; note 9,6/10 sur 11 critères (T7 : 9,7 ; la baisse vient du fait de code fourni, pas d'un recul). Mes 4 corrections du tour 7 : 4 OK, O1 au-delà de la demande.
- Bloquant (1) : S1, l'entrée « vient d'un article » est décrite comme `returnTo` alors que le code envoie `src=blog-<slug>`, et sa survie au paiement n'est pas vérifiée. Il faut renommer le signal, faire un essai réel au lot 0, prévoir son transport jusqu'au compte au chantier de 7.3, et marquer la table comme conditionnelle.
- Non bloquants (2) : S2, premier pas des arrivants depuis un article si C13 = C ; S3, la règle de J60 touche le pivot du 06/05 et doit le dire.
- Ce sont des AVIS : Thomas décide.
---
