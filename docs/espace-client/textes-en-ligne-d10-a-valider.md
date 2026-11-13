# Textes déjà en ligne touchés par l'espace client : à valider par Thomas (lot D10, porte G8)

> Préparé le 13/11/2026 (s24, lot D10). Plan : `docs/espace-client/plan-developpement-s24.md` §6 (T1 à T13).
> **Rien n'a changé en ligne.** Chaque nouvelle version est codée derrière l'interrupteur `ESPACE_CLIENT_PUBLIE` (fermé) : tant qu'il est fermé, le site sert le texte actuel au caractère près (vérifié par test). Elle n'apparaîtra qu'à l'ouverture de l'espace, et seulement avec ton go, ligne par ligne.
> Pour chaque ligne : où elle s'affiche, le texte actuel mot pour mot, le texte proposé mot pour mot, et en une phrase le problème et l'effet pour l'abonné. Le site affiche les apostrophes en typographie française (’) : elles sont écrites droites ici comme dans le code.
> Les phrases juridiques viennent de @legal (brouillons à faire relire par un avocat si tu le souhaites) : `docs/legal/espace-client-s24-phrases.md`, `espace-d4-confidentialite-s24.md`, `espace-d9-mesure-s24.md`.

**14 lignes à valider** (T1, T3, T6 a à g, T7, T8, T11 a et b, durée de la mesure). Réponds par ligne : « go », « non » ou ta version.

---

## T1. Page d'offre `/abonnement`, sous le sous-titre

- **Où** : en haut de `/abonnement`, juste sous « Les listes ne s'arrêtent plus à la dixième vanne, les parcours vont au bout. ». Titre et sous-titre ne bougent pas.
- **Actuel** : (rien sous le sous-titre)
- **Proposé (ajout)** : « Et à chaque cap franchi dans les parcours, un bonus en plus. »
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
- **Pourquoi** : même raison que T1 (ta décision Q8 vise la page d'abonnement ET l'e-mail de bienvenue). Effet : le nouvel abonné apprend dès le premier e-mail que les caps débloquent un bonus. La puce « écris-nous depuis ton profil » reste vraie : le profil garde une ligne vers « Mes questions » (T8).

## T6. Politique de confidentialité (`/confidentialite`)

### T6 a. Partie 2 (données collectées), ajout : caps annoncés
- **Actuel** : (rien)
- **Proposé** : « Les caps et les bonus qu'on t'a déjà annoncés (lequel, et la date de l'annonce), y compris ceux déjà atteints à l'ouverture de l'espace, notés sans annonce, si tu es abonné »
- **Pourquoi** : l'espace garde la liste des caps et bonus déjà annoncés pour ne jamais les annoncer deux fois ; la page ne le dit pas encore. Effet : l'abonné sait ce qui est gardé sur son compte. Réserve @legal : « si tu es abonné » n'est vrai que si ces lignes ne sont écrites que pour des abonnés (c'est le cas à l'écran ; le recalcul unique de l'ouverture marque aussi des comptes qui ont des XP sans être abonnés : à trancher, soit on garde la réserve et on limite le recalcul aux abonnés, soit on retire ces 4 mots).

### T6 b. Partie 3 (pourquoi, sur quelle base), ajout : caps annoncés
- **Actuel** : (rien)
- **Proposé** : « Ne t'annoncer qu'une seule fois chaque cap et chaque bonus : exécution du contrat »
- **Pourquoi** : base légale de T6 a. Effet : aucun pour l'écran ; la page dit pourquoi.

### T6 c. Partie 2, ajout : usage de l'espace
- **Actuel** : (rien)
- **Proposé** : « Usage de ton espace, si tu es abonné : chaque jour où tu l'ouvres, chaque cap atteint (son numéro), chaque réplique que tu écris et chaque question que tu envoies (la date seulement, jamais leur texte). On compte aussi, sans aucun lien avec ton compte, combien de fois certains écrans s'ouvrent (cloche, bonus, coin « Humour noir », archive « Lettres »). Aucune adresse IP. Ces données sont effacées avec ton compte »
- **Pourquoi** : la mesure d'usage de l'espace n'était pas décrite (avis @legal D9). Effet : l'abonné sait ce qui est compté, et que le texte de ses répliques et questions ne l'est jamais. Note : depuis ce lot, réplique et question ne sont plus des événements de mesure (compteurs sans compte) ; la phrase reste vraie (leur date est sur le compte avec la réplique ou la question elle-même), @legal peut la raccourcir.

### T6 d. Partie 3, ajout : usage de l'espace
- **Actuel** : (rien)
- **Proposé** : « Comprendre si ton espace te sert et où tu t'arrêtes, à partir d'événements rattachés à ton compte et lus sous forme anonymisée : intérêt légitime (tu peux t'y opposer, voir la partie 7) »
- **Pourquoi** : base légale de T6 c ; l'opposition se fait déjà par la partie 7.

### T6 e. Partie 6 (durée), phrase des étapes complétée
- **Actuel** : « La date de chaque étape validée et tes retours sur les exercices sont gardés tant que ton compte existe, et effacés avec lui. »
- **Proposé** : « La date de chaque étape validée, tes retours sur les exercices, ta réponse sur l'endroit où tu veux être plus à l'aise et la liste des caps et des bonus déjà annoncés sont gardés tant que ton compte existe, et effacés avec lui. »
- **Pourquoi** : deux données neuves de l'espace (la réponse à « Où veux-tu être plus à l'aise ? » et les caps annoncés) ont la même durée. Effet : aucune donnée de l'espace n'est sans durée écrite.

### T6 f. Partie 6, dernier paragraphe (questions à l'équipe)
- **Actuel** : « Tes questions à l'équipe et nos réponses suivent leur propre durée (voir la partie 9) : elles restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt à contact@deviens-marrant.fr. »
- **Proposé** : « Les copies par e-mail de tes questions à l'équipe et de nos réponses suivent leur propre durée (voir la partie 9) : elles restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt à contact@deviens-marrant.fr. »
- **Pourquoi** : les questions sont désormais gardées dans l'espace (ta décision du 12/11) ; la phrase actuelle laisserait croire que rien n'est effacé avec le compte. Effet : la page dit vrai sur les deux copies.

### T6 g. Partie 4 (prestataires), rôle de Neon (facultatif, un mot)
- **Actuel** : « Neon : base de données (compte, progression, abonnement) »
- **Proposé** : « Neon : base de données (compte, progression, abonnement, tes questions et nos réponses) »
- **Pourquoi** : les questions et réponses sont maintenant stockées chez Neon. Effet : la liste des prestataires est complète.

## T7. CGU, article 10 (« Ta question à l'équipe »)

- **Où** : `/cgu`, article 10. Seules deux retouches dans la même phrase de départ ; le reste de l'article (délai au plus tard 3 jours ouvrés, limites, « les e-mails déjà reçus restent dans ta boîte ») ne change pas.
- **Actuel** : « Avec un abonnement Premium, tu peux écrire à l'équipe depuis ton profil pour décrire une situation où la répartie t'a manqué. L'équipe répond par e-mail, en général sous 1 à 2 jours ouvrés, et au plus tard sous 3 jours ouvrés ; en cas de retard, on te prévient. La réponse est un conseil d'humour et de répartie : elle ne remplace ni un avis médical, ni un avis psychologique, ni un avis juridique, et ne garantit aucun résultat. Ne mets dans ta question ni information sensible sur toi, ni nom de personne. L'équipe peut écarter une question contraire à l'article 4 : dans ce cas, on te le dit. Tu restes titulaire de ce que tu écris, et rien n'est publié sans ton accord. Ce service est réservé aux abonnés Premium : il s'arrête avec ton abonnement, et les e-mails déjà reçus restent dans ta boîte. »
- **Proposé** : « Avec un abonnement Premium, tu peux écrire à l'équipe depuis ton espace (Mes questions) pour décrire une situation où la répartie t'a manqué. L'équipe répond par e-mail, et tu retrouves ta question et sa réponse dans ton espace, en général sous 1 à 2 jours ouvrés, et au plus tard sous 3 jours ouvrés ; en cas de retard, on te prévient. La réponse est un conseil d'humour et de répartie : elle ne remplace ni un avis médical, ni un avis psychologique, ni un avis juridique, et ne garantit aucun résultat. Ne mets dans ta question ni information sensible sur toi, ni nom de personne. L'équipe peut écarter une question contraire à l'article 4 : dans ce cas, on te le dit. Tu restes titulaire de ce que tu écris, et rien n'est publié sans ton accord. Ce service est réservé aux abonnés Premium : il s'arrête avec ton abonnement, et les e-mails déjà reçus restent dans ta boîte. »
- **Pourquoi** : on écrit maintenant depuis « Mes questions » et on y retrouve l'échange. Effet : les CGU décrivent le service tel qu'il marche. (Variante @legal si la tournure gêne : laisser la 2e phrase telle qu'elle est et ajouter « Tu retrouves ensuite ta question et sa réponse dans ton espace. » en phrase séparée.)

## T8. « Mon profil » : l'encadré « Ta question à l'équipe » devient une ligne de lien

- **Où** : `/profil`, sous la carte « Abonnement » (abonné actif).
- **Actuel** : l'encadré complet : titre « Ta question à l'équipe » ; « Une vanne qui t'a cloué le bec, un silence gênant, un message que tu n'arrives pas à écrire ? Raconte, l'équipe te répond. » ; « En général, réponse par e-mail sous 1 à 2 jours ouvrés. » ; champ « Ta situation » (aide : « Par exemple : un collègue te chambre devant tout le monde et tu n'as rien trouvé à répondre. ») ; bouton « Envoyer à l'équipe » ; « Ton message est lu par l'équipe pour te répondre. Évite les noms et les infos sur ta santé. Détails et droits : Confidentialité. »
- **Proposé** : une seule ligne, au même endroit : « Ta question à l'équipe : **Mes questions** » (« Mes questions » est un lien vers la rubrique de l'espace).
- **Pourquoi** : « Mes questions » remplace l'encadré (ta décision du 12/11) ; garder « Ta question à l'équipe » au même endroit garde vrais l'e-mail E0 (« écris-nous depuis ton profil ») et l'e-mail E1b (« dans « Ta question à l'équipe », sur ton profil, juste sous ton abonnement »), qu'on ne touche pas. Effet : depuis son profil, l'abonné va en un clic écrire à l'équipe et retrouve tout son historique. Libellé assemblé de deux textes déjà validés, à passer en relecture à l'aveugle avant ton go.

## T11. Page d'offre `/abonnement`, ancien abonné (au-dessus de l'offre)

- **Où** : `/abonnement`, vu par un ancien abonné connecté (y compris quand il est renvoyé depuis son espace). Chaque ligne n'apparaît que si elle a quelque chose à dire.
- **Actuel** : (rien)
- **T11 a, proposé** : « Tes favoris et ta progression sont gardés : {n} étapes faites, {n} favoris. » (singulier à 1 : « 1 étape faite », « 1 favori »). Affichée seulement si les étapes ET les favoris sont au-dessus de 0. **À trancher** : si l'un des deux est à 0, je n'affiche rien plutôt que « 0 favori » ; dis-moi si tu préfères une variante (texte à écrire).
- **T11 b, proposé** : « Ton historique de questions et tes répliques sont gardés. » Affichée si au moins une question ou une réplique existe. (Point final ajouté au texte de l'architecture.)
- **Pourquoi** : brief §3.8 et architecture 2.6 ; rien n'est supprimé à la fin de l'abonnement. Effet : l'ancien abonné voit qu'il retrouve tout s'il revient.

## Durée de conservation de la mesure d'usage rattachée au compte

- **Où** : rien d'affiché aujourd'hui ; le code a une purge prête (`apps/web/src/lib/mesure/conservation-usage.ts`, `DUREE_CONSERVATION_USAGE_MOIS`), programmée nulle part.
- **Proposé** : [HYPOTHÈSE : 13 mois] à fixer par toi. @legal (avis D9 point 3) : « effacées avec ton compte » est exact, mais la CNIL attend une durée maximale bornée.
- **Pourquoi** : sans durée, les événements d'un abonné fidèle restent tant que son compte existe. Effet : une fois la durée fixée, la purge efface les événements plus vieux ; @legal écrira la phrase de durée correspondante pour la partie 2 ou 6.

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
