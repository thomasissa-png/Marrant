# Textes déjà en ligne touchés par l'espace client : à valider par Thomas (lot D10, porte G8)

> Préparé le 13/11/2026 (s24, lot D10). Plan : `docs/espace-client/plan-developpement-s24.md` §6 (T1 à T13).
> **Rien n'a changé en ligne.** Chaque nouvelle version est codée derrière l'interrupteur `ESPACE_CLIENT_PUBLIE` (fermé) : tant qu'il est fermé, le site sert le texte actuel au caractère près (vérifié par test). Elle n'apparaîtra qu'à l'ouverture de l'espace, et seulement avec ton go, ligne par ligne.
> Pour chaque ligne : où elle s'affiche, le texte actuel mot pour mot, le texte proposé mot pour mot, et en une phrase le problème et l'effet pour l'abonné. Le site affiche les apostrophes en typographie française (’) : elles sont écrites droites ici comme dans le code.
> Les phrases juridiques viennent de @legal (brouillons à faire relire par un avocat si tu le souhaites) : `docs/legal/espace-client-s24-phrases.md`, `espace-d4-confidentialite-s24.md`, `espace-d9-mesure-s24.md`, `espace-d10-phrases-manquantes-s24.md`.
> **Lot D10b (13/11/2026)** : retouches après les deux relectures à l'aveugle (`relecture-textes-d10-reviewer.md`, `relecture-textes-d10-elon.md`) et ajout des phrases manquantes de @legal. Chaque ligne ci-dessous montre la **version finale** (celle qui est codée). Les versions D10 remplacées sont gardées en une ligne « Avant D10b » pour comparaison.

**20 lignes à valider** (T1, T3, T6 a à g, T6 h à m, T7, T8, T11 a et b, durée de la mesure). Réponds par ligne : « go », « non » ou ta version.

## D10b : retouche → ligne

| Ligne | Retouche D10b | Source |
|---|---|---|
| T1, T3 | La ligne et la puce des bonus ne s'affichent que si les 4 fiches bonus (caps 2 à 5) sont publiées et valides ; sinon le texte actuel reste, interrupteur ouvert compris. Texte inchangé (Q8). | @reviewer (condition de vérité), @elon (contrôle d'honnêteté) |
| T6 a | Réécriture : pluriel tenu, « notés aussi, sans annonce » lisible. « si tu es abonné » gardé et rendu vrai dans le code : le recalcul de l'ouverture ne traite plus que les abonnés actifs. | @elon (texte), @reviewer (faute d'exactitude, corrigée par le code) |
| T6 c | Remplacée par la phrase `mesure` raccourcie : réplique et question comptées sans lien au compte, plus de « jamais leur texte », durée maximale écrite. | @legal (texte), @reviewer (deux fautes relevées) |
| T6 e | « tes répliques » ajouté dans la liste des durées. | @reviewer |
| T6 g | « tes répliques » ajouté au rôle de Neon. | @reviewer |
| T6 h à m | Six phrases neuves : répliques (données, base, durée) et état « lu » de la cloche (données, base, durée). | @legal |
| T7 | Variante en phrase séparée : la 2e phrase d'aujourd'hui reste telle quelle (le délai reste attaché à la réponse). | @legal (variante), @reviewer et @elon (même faute de clarté) |
| T8 | « Ta question à l'équipe : écris-la dans Mes questions. » | @elon |
| T11 a | Si l'un des deux nombres vaut 0 : la partie non nulle seule, plutôt que rien. | @elon (et mêmes variantes chez @reviewer) |
| T11 b | Phrase selon ce qui existe : jamais un historique de questions annoncé sans question. | @reviewer |
| Durée | Purge programmée par le planificateur existant, inerte interrupteur fermé ; durée en constante unique, reprise par T6 c. | session (décision), @legal (avis D9 point 3) |

**Deux versions différentes pour la même ligne, choix fait :**
- **T6 a** : @reviewer propose de retirer « , si tu es abonné » ; @elon propose une réécriture qui garde la réserve. Retenu : la réécriture de @elon, ET la réserve rendue vraie dans le code (recalcul limité aux abonnés actifs, test à l'appui). C'est la seule version qui corrige les deux fautes : la clarté (@elon) et l'exactitude (@reviewer), sans perdre l'information (minimisation : aucun compte non abonné n'est marqué).
- **T6 c** : @reviewer et @legal proposent presque la même phrase. Retenue : celle de @legal. Elle corrige les deux fautes de @reviewer (événements rattachés au compte, « jamais leur texte ») et ajoute la durée maximale bornée que la CNIL attend (avis D9) ; « écrites » convient aux répliques comme aux questions, alors qu'une réplique ne s'« envoie » pas.
- **T7** et **T11 a** : les deux relecteurs proposent la même correction ; appliquée telle quelle. **T8** : seul @elon propose une réécriture (@reviewer : 10 sur la version D10) ; appliquée, comme décidé par la session.

**Points ouverts D10b (à trancher, rien n'est codé pour eux) :**
- **T6 e et T6 l disent deux fois la durée des répliques** (« tes répliques » dans T6 e, puis la phrase T6 l, plus complète). Les deux sont vraies ; si tu préfères une seule mention, retirer « tes répliques, » de T6 e.
- **T6 h dit « jamais ajoutées à nos mesures », T6 c dit « combien de répliques […] sont écrites »** : le texte des répliques n'est jamais mesuré, leur nombre l'est (sans lien au compte). À faire confirmer par @legal (variante possible : « leur texte n'est jamais ajouté à nos mesures »).
- **T11 a, « Tes favoris sont gardés : 1 favori. »** : pluriel du sujet avec 1 ; variante reprise telle quelle des relectures.
- **Recalcul limité aux abonnés actifs** : un compte qui avait des XP sans être abonné à l'ouverture, et qui s'abonne ensuite, verra une annonce « Nouveau cap » (et ses bonus) à sa première visite, au lieu d'un marquage silencieux.

---

## T1. Page d'offre `/abonnement`, sous le sous-titre

- **Où** : en haut de `/abonnement`, juste sous « Les listes ne s'arrêtent plus à la dixième vanne, les parcours vont au bout. ». Titre et sous-titre ne bougent pas.
- **Actuel** : (rien sous le sous-titre)
- **Proposé (ajout)** : « Et à chaque cap franchi dans les parcours, un bonus en plus. »
- **Condition (D10b)** : affichée seulement si les 4 fiches bonus des caps 2 à 5 sont publiées et valides (`data/espace/bonus.json`, aujourd'hui vide : la ligne ne s'afficherait donc pas, même espace ouvert). Test : `bonus-publies-d10b-s24.test.tsx`.
- **Pourquoi** : les bonus des caps arrivent avec l'espace ; sans cette ligne, l'offre ne les annonce pas. Effet pour l'abonné : il sait avant de payer qu'un bonus s'ouvre à chaque cap (ta décision Q8 du 12/11, phrase reprise telle quelle).

## T3. E-mail de bienvenue Premium (E0), liste de ce que Premium ouvre

- **Où** : e-mail envoyé après le paiement, liste à puces du début. **E0 perd son approbation du 07/11 : il te revient en entier pour réapprobation.** Rien d'autre ne change dans l'e-mail (vérifié par test : le reste est identique au caractère près).
- **Actuel** (puces, celles entre crochets selon le cas) :
  - « - Les vannes, les conseils et les vidéos : tout, sans limite, et les filtres pour trouver vite ce qui colle à ta situation. »
  - « - Les parcours : les 5, en entier, de la première à la dernière étape. »
  - [carnet publié] « - Le carnet de répartie : chaque mois, des situations et leurs répliques, carnets passés compris. »
  - « - Les exercices des vannes, conseils et vidéos : de quoi t'entraîner, pas seulement lire. »
  - « - Tes favoris, ta progression et ta série de jours de pratique : ce qui te plaît sous la main, et où tu en es. »
  - [lettre ouverte] « - La lettre du jeudi : chaque semaine par e-mail, un clic pour l'arrêter. »
  - [question ouverte] « - « Ta question à l'équipe » : écris-nous depuis ton profil, on te répond. »
  - « - Le rappel de parcours : un e-mail pour ne pas perdre le fil, à activer depuis ton profil. »
- **Proposé** : la même liste, avec une puce AJOUTÉE juste après celle des parcours : « - Et à chaque cap franchi dans les parcours, un bonus en plus. »
- **Condition (D10b)** : comme T1, la puce n'est écrite que si les 4 fiches bonus sont publiées ; sinon E0 reste identique au caractère près.
- **Pourquoi** : même raison que T1 (ta décision Q8 vise la page d'abonnement ET l'e-mail de bienvenue). Effet : le nouvel abonné apprend dès le premier e-mail que les caps débloquent un bonus. La puce « écris-nous depuis ton profil » reste vraie : le profil garde une ligne vers « Mes questions » (T8).

## T6. Politique de confidentialité (`/confidentialite`)

### T6 a. Partie 2 (données collectées), ajout : caps annoncés
- **Actuel** : (rien)
- **Proposé (final D10b)** : « Les caps et les bonus qu'on t'a déjà annoncés, avec la date de chaque annonce (ceux que tu avais déjà atteints à l'ouverture de l'espace sont notés aussi, sans annonce), si tu es abonné »
- **Avant D10b** : « Les caps et les bonus qu'on t'a déjà annoncés (lequel, et la date de l'annonce), y compris ceux déjà atteints à l'ouverture de l'espace, notés sans annonce, si tu es abonné »
- **Pourquoi** : l'espace garde la liste des caps et bonus déjà annoncés pour ne jamais les annoncer deux fois ; la page ne le dit pas encore. Effet : l'abonné sait ce qui est gardé sur son compte. La réserve « si tu es abonné » est maintenant vraie : le recalcul unique de l'ouverture ne traite plus que les abonnés actifs (`caps-serveur.ts`, `scripts/recalcul-caps.ts`, test `caps-serveur-s24.test.ts`).

### T6 b. Partie 3 (pourquoi, sur quelle base), ajout : caps annoncés
- **Actuel** : (rien)
- **Proposé** : « Ne t'annoncer qu'une seule fois chaque cap et chaque bonus : exécution du contrat »
- **Pourquoi** : base légale de T6 a. Effet : aucun pour l'écran ; la page dit pourquoi.

### T6 c. Partie 2, ajout : usage de l'espace
- **Actuel** : (rien)
- **Proposé (final D10b, `mesure` raccourcie de @legal)** : « Usage de ton espace, si tu es abonné : chaque jour où tu l'ouvres et chaque cap atteint (son numéro). On compte aussi, sans aucun lien avec ton compte, combien de fois certains écrans s'ouvrent (cloche, bonus, coin « Humour noir », archive « Lettres ») et combien de répliques et de questions sont écrites. Aucune adresse IP. Les données rattachées à ton compte sont gardées au plus 13 mois, et effacées plus tôt avec ton compte »
- **Avant D10b** : « Usage de ton espace, si tu es abonné : chaque jour où tu l'ouvres, chaque cap atteint (son numéro), chaque réplique que tu écris et chaque question que tu envoies (la date seulement, jamais leur texte). On compte aussi, sans aucun lien avec ton compte, combien de fois certains écrans s'ouvrent (cloche, bonus, coin « Humour noir », archive « Lettres »). Aucune adresse IP. Ces données sont effacées avec ton compte »
- **Pourquoi** : la mesure d'usage de l'espace n'était pas décrite (avis @legal D9) ; la version D10 décrivait encore réplique et question comme rattachées au compte. Effet : l'abonné sait exactement ce qui est rattaché à son compte et pour combien de temps. **« 13 mois » = [HYPOTHÈSE] à fixer par toi** (ligne « Durée » plus bas) : le chiffre vient de la même constante que la purge, il change avec elle.

### T6 d. Partie 3, ajout : usage de l'espace
- **Actuel** : (rien)
- **Proposé** : « Comprendre si ton espace te sert et où tu t'arrêtes, à partir d'événements rattachés à ton compte et lus sous forme anonymisée : intérêt légitime (tu peux t'y opposer, voir la partie 7) »
- **Pourquoi** : base légale de T6 c ; l'opposition se fait déjà par la partie 7.

### T6 e. Partie 6 (durée), phrase des étapes complétée
- **Actuel** : « La date de chaque étape validée et tes retours sur les exercices sont gardés tant que ton compte existe, et effacés avec lui. »
- **Proposé (final D10b)** : « La date de chaque étape validée, tes retours sur les exercices, tes répliques, ta réponse sur l'endroit où tu veux être plus à l'aise et la liste des caps et des bonus déjà annoncés sont gardés tant que ton compte existe, et effacés avec lui. »
- **Avant D10b** : la même sans « tes répliques, ».
- **Pourquoi** : trois données neuves de l'espace (répliques, réponse à « Où veux-tu être plus à l'aise ? », caps annoncés) ont la même durée. Effet : aucune donnée de l'espace n'est sans durée écrite. Suivie, dans le même paragraphe, de T6 l et T6 m.

### T6 f. Partie 6, dernier paragraphe (questions à l'équipe)
- **Actuel** : « Tes questions à l'équipe et nos réponses suivent leur propre durée (voir la partie 9) : elles restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt à contact@deviens-marrant.fr. »
- **Proposé** : « Les copies par e-mail de tes questions à l'équipe et de nos réponses suivent leur propre durée (voir la partie 9) : elles restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt à contact@deviens-marrant.fr. »
- **Pourquoi** : les questions sont désormais gardées dans l'espace (ta décision du 12/11) ; la phrase actuelle laisserait croire que rien n'est effacé avec le compte. Effet : la page dit vrai sur les deux copies.

### T6 g. Partie 4 (prestataires), rôle de Neon (facultatif, un mot)
- **Actuel** : « Neon : base de données (compte, progression, abonnement) »
- **Proposé (final D10b)** : « Neon : base de données (compte, progression, abonnement, tes répliques, tes questions et nos réponses) »
- **Avant D10b** : la même sans « tes répliques, ».
- **Pourquoi** : répliques, questions et réponses sont stockées chez Neon. Effet : la liste des prestataires est complète.

### T6 h à m. Phrases manquantes de @legal (D10b), mot pour mot
Source : `docs/legal/espace-d10-phrases-manquantes-s24.md`. Actuel : (rien) pour les six.
- **T6 h, partie 2, après T6 a (répliques)** : « Les phrases que tu écris dans « Ma réplique à moi » (une par fiche) et leur date, si tu es abonné. On ne les lit pas pour t'analyser, et elles ne sont jamais ajoutées à nos mesures »
- **T6 i, partie 2, après T6 h (état « lu »)** : « La date à laquelle tu ouvres une réponse de l'équipe, pour afficher « lu » sur la cloche, si tu es abonné »
- **T6 j, partie 3, après T6 b (base des répliques)** : « Garder et te réafficher les phrases que tu as écrites : exécution du contrat »
- **T6 k, partie 3, après T6 j (base de l'état « lu »)** : « T'indiquer ce que tu as déjà lu : exécution du contrat »
- **T6 l, partie 6, après T6 e (durée des répliques)** : « Tes phrases de « Ma réplique à moi » sont gardées tant que ton compte existe, même si ton abonnement s'arrête : tu les relis alors sans pouvoir les modifier. Tu peux en supprimer une quand tu veux, et elles sont toutes effacées avec ton compte. »
- **T6 m, partie 6, après T6 l (durée de l'état « lu »)** : « La date d'ouverture d'une réponse est gardée avec ta question, tant que ton compte existe, et effacée avec lui. »
- **Pourquoi** : deux données de l'espace (« Ma réplique à moi » et la date d'ouverture d'une réponse) n'étaient décrites nulle part. Effet : la page dit tout ce que l'espace garde. Réserve @legal : « on ne les lit pas » reste vrai tant que l'administration ne lit pas les répliques (test d'import en place).

## T7. CGU, article 10 (« Ta question à l'équipe »)

- **Où** : `/cgu`, article 10. Une retouche dans la 1re phrase et une phrase ajoutée après la 2e ; le reste de l'article ne change pas.
- **Actuel** : « Avec un abonnement Premium, tu peux écrire à l'équipe depuis ton profil pour décrire une situation où la répartie t'a manqué. L'équipe répond par e-mail, en général sous 1 à 2 jours ouvrés, et au plus tard sous 3 jours ouvrés ; en cas de retard, on te prévient. La réponse est un conseil d'humour et de répartie : elle ne remplace ni un avis médical, ni un avis psychologique, ni un avis juridique, et ne garantit aucun résultat. Ne mets dans ta question ni information sensible sur toi, ni nom de personne. L'équipe peut écarter une question contraire à l'article 4 : dans ce cas, on te le dit. Tu restes titulaire de ce que tu écris, et rien n'est publié sans ton accord. Ce service est réservé aux abonnés Premium : il s'arrête avec ton abonnement, et les e-mails déjà reçus restent dans ta boîte. »
- **Proposé (final D10b)** : « Avec un abonnement Premium, tu peux écrire à l'équipe depuis ton espace (Mes questions) pour décrire une situation où la répartie t'a manqué. L'équipe répond par e-mail, en général sous 1 à 2 jours ouvrés, et au plus tard sous 3 jours ouvrés ; en cas de retard, on te prévient. Tu retrouves ensuite ta question et sa réponse dans ton espace. La réponse est un conseil d'humour et de répartie : elle ne remplace ni un avis médical, ni un avis psychologique, ni un avis juridique, et ne garantit aucun résultat. Ne mets dans ta question ni information sensible sur toi, ni nom de personne. L'équipe peut écarter une question contraire à l'article 4 : dans ce cas, on te le dit. Tu restes titulaire de ce que tu écris, et rien n'est publié sans ton accord. Ce service est réservé aux abonnés Premium : il s'arrête avec ton abonnement, et les e-mails déjà reçus restent dans ta boîte. »
- **Avant D10b** : l'incise « , et tu retrouves ta question et sa réponse dans ton espace » était glissée dans la 2e phrase, avant le délai.
- **Pourquoi** : on écrit maintenant depuis « Mes questions » et on y retrouve l'échange. Effet : les CGU décrivent le service tel qu'il marche, et le délai d'1 à 2 jours ouvrés reste clairement celui de la réponse.

## T8. « Mon profil » : l'encadré « Ta question à l'équipe » devient une ligne de lien

- **Où** : `/profil`, sous la carte « Abonnement » (abonné actif).
- **Actuel** : l'encadré complet : titre « Ta question à l'équipe » ; « Une vanne qui t'a cloué le bec, un silence gênant, un message que tu n'arrives pas à écrire ? Raconte, l'équipe te répond. » ; « En général, réponse par e-mail sous 1 à 2 jours ouvrés. » ; champ « Ta situation » (aide : « Par exemple : un collègue te chambre devant tout le monde et tu n'as rien trouvé à répondre. ») ; bouton « Envoyer à l'équipe » ; « Ton message est lu par l'équipe pour te répondre. Évite les noms et les infos sur ta santé. Détails et droits : Confidentialité. »
- **Proposé (final D10b)** : une seule ligne, au même endroit : « Ta question à l'équipe : écris-la dans **Mes questions**. » (« Mes questions » est un lien vers la rubrique de l'espace).
- **Avant D10b** : « Ta question à l'équipe : **Mes questions** ».
- **Pourquoi** : « Mes questions » remplace l'encadré (ta décision du 12/11) ; garder « Ta question à l'équipe » au même endroit garde vrais l'e-mail E0 (« écris-nous depuis ton profil ») et l'e-mail E1b, qu'on ne touche pas. Effet : depuis son profil, l'abonné comprend qu'un clic l'emmène écrire à l'équipe.

## T11. Page d'offre `/abonnement`, ancien abonné (au-dessus de l'offre)

- **Où** : `/abonnement`, vu par un ancien abonné connecté (y compris quand il est renvoyé depuis son espace). Chaque ligne ne dit que ce qui existe.
- **Actuel** : (rien)
- **T11 a, proposé (final D10b)**, selon les nombres (singulier à 1 : « 1 étape faite », « 1 favori ») :
  - étapes et favoris : « Tes favoris et ta progression sont gardés : {n} étapes faites, {n} favoris. »
  - étapes seules : « Ta progression est gardée : {n} étapes faites. »
  - favoris seuls : « Tes favoris sont gardés : {n} favoris. »
  - aucun des deux : rien.
- **T11 b, proposé (final D10b)**, selon les nombres :
  - questions et répliques : « Ton historique de questions et tes répliques sont gardés. »
  - questions seules : « Ton historique de questions est gardé. »
  - répliques seules : « Tes répliques sont gardées. »
  - aucune : rien.
- **Avant D10b** : T11 a n'apparaissait que si les deux nombres dépassaient 0 ; T11 b était toujours la phrase complète.
- **Pourquoi** : brief §3.8 et architecture 2.6 ; rien n'est supprimé à la fin de l'abonnement. Effet : un ancien abonné avec 12 étapes et 0 favori voit ses 12 étapes, et personne ne lit « historique de questions » sans en avoir posé.

## Durée de conservation de la mesure d'usage rattachée au compte

- **Où** : écrite dans T6 c (« gardées au plus 13 mois ») ; code : `apps/web/src/lib/mesure/conservation-usage.ts`, `DUREE_CONSERVATION_USAGE_MOIS`, constante unique.
- **Proposé** : [HYPOTHÈSE : 13 mois] à fixer par toi. @legal (avis D9 point 3) : la CNIL attend une durée maximale bornée.
- **D10b** : la purge est programmée par le planificateur existant du site (`lib/scheduler/jobs.ts`, tâche `runUsageEventsPurgeJob`, chaque jour à 4 h, heure de Paris, comme les autres purges), **inerte tant que l'espace est fermé**. Si tu choisis une autre durée, une seule valeur change et la phrase de T6 c suit.
- **Pourquoi** : sans durée, les événements d'un abonné fidèle restaient tant que son compte existait. Effet : les événements plus vieux que la durée sont effacés chaque jour.

---

## Déjà traités ailleurs (vérifiés, rien à valider ici)

- **T2** (`PHRASE_OBJET_CONNECTE`, titre « Premium ouvre tout ») : non touchés, vérifié par test (hachage du rendu).
- **T4** (page des conseils) : « Progresse semaine après semaine avec des exercices concrets. » ; ton go du 12/11 existe (`founder-preferences.md`, « retirer « et des XP » », déployée avec le reste). Écart signalé : ce changement a été fait au lot D3 SANS interrupteur ; il part donc avec le prochain déploiement de la branche, pas avec l'ouverture.
- **T5** (confidentialité partie 9, puces 1 et 4) : codé au lot D7 derrière l'interrupteur, validé le 13/11 « à l'ouverture, après relecture d'un avocat » ; vérifié par test.
- **T9** (noms des caps), **T12** (en-tête de l'abonné) : lots D4 et D2, derrière l'interrupteur.
- **T10** (page de succès, « Continuer ») : lot D3, derrière l'interrupteur ; vérifié.
- **T13** (« Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz », Machine à Café étape 1) : **non trouvé dans le code du lot D4**. La phrase vient de la base (champ `moduleFormat` du seed, affiché « Format : … ») et n'est pas ajustée ; les vidéos d'une étape sont déjà sous « Pour aller plus loin, facultatif » depuis s17. À trancher : ajuster la phrase en base (donnée en ligne, avec ton go) ou la laisser.

## Textes explicitement NON touchés (plan §6), vérifiés par hachage

« Résiliable depuis ton profil. » (`offre.ts`) ; textes Stripe et e-mail de confirmation (`paiement.ts`) ; e-mails E1, E1b, E2, rappel de parcours (`parcours-emails.ts`) ; lettre de la semaine (`lettre-hebdo-s21.ts`) ; FAQ « 50 XP par semaine » (`faqs.ts`) ; `a-propos`, `parcours/(liste)/page.tsx`, `videos/page.tsx`, `llms-content.ts` ; pied de page « Renoncer au contrat ici » et « Résilier ton contrat ». Test : `apps/web/src/__tests__/espace/profil-d10-s24.test.tsx`.
