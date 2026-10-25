# « Ta question à l'équipe » V1 : suite de l'avis @legal (25/10/2026)

Draft de référence, pas un avis d'avocat (décision du 07/10). Suite de l'avis du 25/10 (C2, C3, C4, durée de 6 mois). Faits nouveaux pris en compte : contact@ (IONOS) transféré automatiquement vers la messagerie Gmail de Thomas ; confidentialité publiée avec IONOS et Google ; les « outils de rédaction » sont des sessions Claude (Anthropic) de l'équipe. Sources lues : `confidentialite/page.tsx`, `config/textes/question-equipe-s22.ts`, `docs/copy/ton-alex.md`, `project-context.md`, recherche web du 25/10/2026. Articles de loi cités de mémoire : `[À VÉRIFIER]` sur Légifrance. La décision du 06/05 (pas de mention IA visible) n'est pas rouverte par ce document.

## Verdict : GO sous 5 conditions (une est nouvelle)

Risques en 5 points :
1. Le type de compte Claude décide de tout : sous les conditions commerciales (Team, Enterprise, API), Anthropic n'entraîne pas ses modèles sur les textes et un contrat de sous-traitance est inclus ; avec un abonnement grand public (Free, Pro, Max), ce n'est pas garanti. Thomas doit vérifier (point 1).
2. Gmail grand public : Google ne propose son contrat de sous-traitance (CDPA) qu'aux comptes Workspace, pas aux adresses @gmail.com. Si le transfert va vers un Gmail personnel, il manque un contrat obligatoire (point 4, D1). Nouveau.
3. Les textes publiés disent « la boîte e-mail de l'équipe » au singulier : il y en a deux (IONOS et Gmail) plus la Corbeille de chacune, et l'historique de l'outil de rédaction. La promesse de 6 mois doit être vraie partout (points 3 et 4).
4. Un message de détresse, de harcèlement grave ou de violence ne reçoit ni humour, ni modèle, ni outil de rédaction : conduite écrite au point 2.
5. Un mineur de moins de 15 ans qui écrit sort du champ du service (le site s'adresse aux 15 ans et plus) : réponse courte et décision de Thomas sur le compte (point 2).

**Conditions de GO, bloquantes avant la première question reçue**
- [ ] B1 (C2) Type de compte Claude vérifié par Thomas : commercial attendu. Sinon, aucune session grand public pour les questions (rédaction à la main) et la ligne « Outils de rédaction » est retirée des textes.
- [ ] B2 (nouveau, C3 suite) Gmail : soit transfert coupé (une seule boîte, IONOS), soit Google Workspace avec CDPA accepté. Voir D1.
- [ ] B3 Conservation : filtre, requêtes de purge et rappel mensuel en place dans Gmail ET IONOS avant l'ouverture (point 3).
- [ ] B4 Textes corrigés (point 4) publiés ensemble : section 9, partie 4, rappel de l'e-mail interne.
- [ ] B5 (C4) Conduite sensible (point 2) lue et validée par Thomas ; textes types relus à l'aveugle avant tout usage (règle d'or P0 s18).

---

## 1. C2 : Anthropic, entraînement, DPA et règle pour l'équipe

### 1.1 Ce que disent les sources (consultées le 25/10/2026, extraits via recherche web)

Les pages n'ont pas été rouvertes en entier et leur date de dernière mise à jour n'apparaît pas dans les résultats : `[À VÉRIFIER par ouverture des pages, puis archiver une copie datée dans le dossier juridique]`.

| Type de compte | Entraînement sur tes textes | Contrat de sous-traitance (DPA) | Conservation |
|---|---|---|---|
| **Team, Enterprise, API** (conditions commerciales) | Non. Section B des Conditions commerciales : Anthropic ne peut pas entraîner de modèles sur le « Customer Content » (entrées et sorties). Le Privacy Center confirme : pas d'entraînement par défaut. Exceptions volontaires : retours donnés (pouces haut/bas, signalement) et Development Partner Program (option, Claude Code, valable pour toute l'organisation). | Oui, inclus. Section C : les données sont traitées selon le DPA, incorporé aux conditions ; accepter les conditions vaut accepter le DPA (clauses contractuelles types comprises). Le client est responsable de traitement, Anthropic sous-traitant. Le Legal Center liste le DPA daté du 24/02/2025 (clauses UE, addendum Royaume-Uni, addendum suisse). | API : entrées et sorties effacées sous 30 jours. Team et Enterprise : les conversations restent dans le produit tant qu'elles ne sont pas supprimées (Enterprise : durée personnalisable, 30 jours minimum) ; une conversation supprimée disparaît du stockage sous 30 jours. Contenus signalés par les systèmes de sécurité : jusqu'à 2 ans. |
| **Free, Pro, Max** (conditions grand public) | Possible. Depuis le 28/09/2025, entraînement autorisé sauf refus dans Réglages, Confidentialité, « Improve Claude for everyone » (sources secondaires pour la date). Si accepté : conservation jusqu'à 5 ans ; si refusé : 30 jours. | Pas de contrat de sous-traitance au sens de l'article 28 : Anthropic y agit pour son propre compte `[À VÉRIFIER : article « view and sign your DPA », volet grand public]`. | Voir ci-contre. |

Conclusion : seul un compte commercial rend vraie la phrase « ils ne s'en servent pas pour s'entraîner » et permet le contrat de l'article 28. L'usage professionnel d'un abonnement grand public ne le fait pas basculer sous les conditions commerciales : c'est le plan du compte qui compte `[À VÉRIFIER]`. Une session Claude Code ouverte avec un abonnement Pro ou Max relève des conditions grand public ; avec une clé API ou un compte d'organisation, des conditions commerciales `[À VÉRIFIER dans la documentation de Claude Code]`.

### 1.2 Ce qui reste à faire par Thomas

1. **Vérifier le plan de chaque session de l'équipe** (claude.ai, Réglages, Compte ou Facturation ; pour l'outil en ligne de commande, dire s'il est connecté par abonnement personnel, par organisation ou par clé API). Noter le résultat. Si le plan est Team ou Enterprise, vérifier que l'organisation est celle de deviens-marrant SAS, pas un compte personnel.
2. **Si commercial** : garder une copie datée (PDF) des Conditions commerciales et du DPA ; aucun document supplémentaire à signer, le DPA est incorporé (si Anthropic propose une contresignature, le faire) ; relever la liste de ses sous-traitants ultérieurs ; ne pas activer le Development Partner Program ; ne jamais cliquer sur les pouces ou « signaler » dans une session de question.
3. **Si grand public** : pas d'outil de rédaction pour les questions. Deux sorties : passer sur Team ou API, ou rédiger à la main. Dans les deux cas où l'outil n'est pas utilisé, retirer la ligne « Outils de rédaction » de la partie 4 et la mention de la section 9 (on ne déclare pas un outil qu'on n'emploie pas).
4. **Registre des traitements (art. 30)** : ajouter « Ta question à l'équipe » avec finalité, catégories (texte libre, données sensibles possibles par inadvertance), destinataires (Resend, IONOS, Google, Anthropic), transferts hors UE (clauses contractuelles types ou cadre UE-États-Unis), durée (6 mois), mesures (règle ci-dessous, purge).
5. **Anonymiser n'est pas anonymiser** : retirer les noms réduit le risque, mais un texte libre peut rester identifiant. Le contrat de sous-traitance reste donc nécessaire.

### 1.3 Règle opérationnelle exacte pour l'équipe

> **Question de l'abonné et outil de rédaction**
> 1. Dans l'outil, on colle SEULEMENT le texte situé entre « ----- Question ----- » et « ----- Fin de la question ----- ». Jamais l'adresse e-mail du compte, jamais le prénom ou le nom, jamais l'en-tête, la signature, une capture de la boîte, un message précédent ou la réponse déjà envoyée.
> 2. Avant de coller, on anonymise le texte : un collègue nommé devient « un collègue », une entreprise ou une école nommée devient « son entreprise » ou « son école », un lieu précis, un téléphone ou une adresse sont retirés, et le prénom que l'abonné donne de lui-même devient « je ».
> 3. Si le texte contient de la santé, de la détresse, une violence, un harcèlement, la vie sexuelle, la religion, la politique ou un mineur : on ne colle RIEN. On traite à la main (point 2).
> 4. Aucun connecteur de messagerie (Gmail ou autre) ni aucun accès à la boîte contact@ depuis une session Claude. On copie le texte à la main, on ne laisse pas l'outil lire la boîte.
> 5. On n'écrit jamais le texte d'une question dans le dépôt, un fichier, un commit, un ticket ou un document. Aucun journal des questions.
> 6. Session dédiée aux questions, supprimée dès la réponse envoyée (une conversation supprimée est effacée côté Anthropic sous 30 jours). Aucun clic sur pouce haut/bas ni signalement. `[À VÉRIFIER par Thomas : comment supprimer une session selon le plan utilisé, et si une trace locale subsiste]`
> 7. La réponse préparée est relue, réécrite si besoin et envoyée par une personne, toujours. Aucun envoi automatique (ligne rouge de l'avis du 25/10).

---

## 2. C4 : conduite pour un message sensible

Reprise de B8 s21, à valider par Thomas `[à valider par Thomas]`. Le service sert à répondre à une situation de chambrage ou de blocage. Dès qu'une personne écrit autre chose (elle va mal, on lui fait du mal, elle parle de sa santé, elle est mineure), la réponse change de nature : ce n'est plus de la répartie.

### 2.1 Principes

1. **Une personne lit, une personne répond.** Pas de modèle collé tel quel, et pas d'outil de rédaction (règle 3 du point 1.3). Le brouillon est relu par Thomas avant l'envoi (règle e-mails client-facing).
2. **Priorité sur le délai standard** : réponse le jour même si possible, sinon dès que possible. Le « 1 à 2 jours ouvrés » ne s'applique pas à un message de détresse.
3. **Ton** : sérieux, chaleureux, court, tutoiement. Aucun humour, aucune ironie, aucun émoji, aucune vanne « pour détendre ». Pas de diagnostic, pas de « je comprends tout », pas de minimisation (« ce n'est pas grave »), pas de morale. On ne pose pas de questions pour obtenir plus de détails.
4. **Contenu** : (a) merci d'avoir écrit, (b) on dit simplement que ce sujet dépasse ce que fait l'équipe (humour et répartie, pas soin ni accompagnement), (c) une ou deux ressources adaptées, (d) inviter à en parler à une personne de confiance, (e) la porte reste ouverte. Pas plus de 8 lignes.
5. **Ne pas répondre sur le fond** dans ces cas : idées suicidaires ou d'automutilation ; violence subie ou menace (conjugale, familiale, agression) ; harcèlement caractérisé (répété, humiliation, menaces, discrimination, sexuel) ; question médicale ou psychologique (diagnostic, traitement, médicaments) ; demande de conseil juridique ; mineur de moins de 15 ans. Pour la violence et le harcèlement grave, on ne propose pas non plus de répartie : une réplique face à un agresseur peut aggraver la situation. Un chambrage banal (collègue, coloc, amis), même blessant, reste dans le service : on répond normalement.
6. **Pas de promesse qu'on ne tient pas** : ne pas écrire « tout reste confidentiel » ni « on s'en occupe ». On peut écrire « tu peux nous demander d'effacer ce message ».
7. **Danger immédiat** (menace imminente, passage à l'acte annoncé) : répondre tout de suite, avec le 112 en premier. L'équipe peut appeler elle-même le 3114 pour être guidée (le service s'adresse aussi aux proches et témoins inquiets). L'obligation de porter secours (non-assistance à personne en péril, Code pénal art. 223-6 `[À VÉRIFIER]`) pèse sur toute personne qui peut agir sans risque : on ne reste pas sans rien faire. On n'a que l'adresse e-mail : ne rien chercher d'autre sur la personne.
8. **Mineur** : le site et la lettre s'adressent aux personnes de 15 ans et plus (partie 8 de la confidentialité). Si l'abonné dit avoir moins de 15 ans : réponse courte (texte 4), pas de réponse sur le fond, et décision de Thomas sur le compte (fermeture et remboursement proposés `[HYPOTHÈSE : à valider par Thomas]`). De 15 à 17 ans : réponse normale pour la répartie, texte 4 en plus si une situation de danger ou de harcèlement apparaît.
9. **Conservation** : un message sensible est effacé des deux boîtes dès l'échange terminé et au plus tard 30 jours après `[HYPOTHÈSE : durée plus courte que les 6 mois publiés, pour minimiser ; à valider par Thomas]`, ou tout de suite si la personne le demande. Aucune capture, aucun transfert, aucune copie ailleurs, sauf appel aux secours.

### 2.2 Numéros utiles en France (vérifiés par recherche web le 25/10/2026)

| Situation | Numéro | Ce qu'on peut affirmer | Réserve |
|---|---|---|---|
| Détresse, idées suicidaires (soi ou un proche) | **3114** | Numéro national de prévention du suicide, gratuit, 24 h sur 24 et 7 jours sur 7, répondants formés, aussi pour les proches inquiets | Aucune |
| Danger immédiat, urgence | **112** (européen) | Numéro d'urgence unique, couvre tout le territoire | Aucune |
| Urgence médicale | **15** (SAMU) | Urgences médicales | Aucune |
| Agression, violence en cours | **17** (police, gendarmerie) | Police et gendarmerie | Aucune |
| Incendie, secours | **18** (pompiers) | Pompiers | Aucune |
| Personne sourde ou malentendante | **114** | Accès aux secours par SMS ou relais | Aucune |
| Enfant ou adolescent en danger | **119** | Enfance en danger (gratuit) | Horaires non vérifiés : ne pas les écrire |
| Harcèlement scolaire | **3020** | Numéro de l'Éducation nationale contre le harcèlement | Horaires divergents selon les sources : ne pas les écrire |
| Cyberharcèlement, violences numériques | **3018** | Numéro de l'association e-Enfance, gratuit, anonyme, confidentiel ; selon le ministère, 7 jours sur 7 de 9 h à 23 h | Horaires `[À VÉRIFIER]` avant de les écrire |
| Violences faites aux femmes | **3919** | Écoute et orientation, gratuit, anonyme ; ne remplace pas le 17 ou le 112 en cas de danger immédiat | Horaires divergents : ne pas les écrire |
| Harcèlement au travail (adulte) | Aucun numéro vérifié | Orienter vers le médecin du travail, un représentant du personnel ou l'inspection du travail `[À VÉRIFIER]` | Ne pas inventer de numéro |

Les 3020 et 3018 visent surtout les jeunes. Pour un homme victime de violences conjugales, le 3919 est destiné aux femmes : orienter vers le 17 ou le 112 si danger, sinon vers son médecin `[À VÉRIFIER avec service-public.fr avant d'y ajouter une ressource]`. Revérifier la liste sur service-public.fr à chaque trimestre.

### 2.3 Textes types de réponse courte

À adapter à chaque message (jamais copier-coller sans lire le message), relus à l'aveugle avant usage. Pas de prénom : l'e-mail interne ne le donne pas.

**Texte 1, détresse**
> Bonjour,
>
> Merci de nous avoir écrit, et d'avoir osé dire ça. Ce que tu décris est sérieux, et ce n'est pas à notre équipe, qui fait de l'humour, de t'accompagner là-dessus. Des personnes formées peuvent le faire, tout de suite.
>
> Tu peux appeler le 3114, le numéro national de prévention du suicide : c'est gratuit, et on te répond jour et nuit. Si tu es en danger immédiat, appelle le 112.
>
> Si tu as quelqu'un de confiance près de toi, dis-lui ce que tu viens de nous écrire. Tu n'as pas à porter ça seul. Tu peux aussi nous réécrire quand tu veux.
>
> L'Équipe Deviens Marrant

**Texte 2, harcèlement ou violence**
> Bonjour,
>
> Merci de nous avoir écrit. Ce que tu racontes dépasse le chambrage, et ce n'est pas à toi de trouver une répartie pour t'en sortir. On ne t'en proposera donc pas.
>
> Des personnes formées peuvent t'écouter, gratuitement : le 3018 pour le cyberharcèlement, le 3020 pour le harcèlement à l'école, le 3919 pour les violences faites aux femmes. Si tu es en danger immédiat, appelle le 17 ou le 112.
>
> Parles-en à une personne de confiance. Si tu le peux, garde les messages et les dates.
>
> L'Équipe Deviens Marrant

**Texte 3, santé**
> Bonjour,
>
> Merci de ta confiance. Ce que tu évoques touche à ta santé, et on ne peut pas te répondre là-dessus : on s'occupe d'humour et de répartie, pas de soin. Ton médecin traitant est la bonne personne pour en parler. En cas d'urgence, appelle le 15 ou le 112. Si c'est surtout le moral qui est bas, le 3114 écoute, jour et nuit.
>
> Si tu veux, renvoie-nous ta situation de répartie sans les détails de santé, et on s'y met. Et si tu préfères qu'on efface ton message, dis-le-nous : c'est fait.
>
> L'Équipe Deviens Marrant

**Texte 4, moins de 15 ans ou enfant en danger**
> Bonjour,
>
> Merci de ton message. Deviens Marrant s'adresse aux personnes de 15 ans et plus, alors on ne peut pas répondre à ta question ici.
>
> Si quelqu'un te fait du mal ou si tu ne te sens pas en sécurité, appelle le 119, gratuit. Pour du harcèlement, le 3020 ou le 3018. En danger immédiat, le 112. Parles-en aussi à un adulte de confiance.
>
> L'Équipe Deviens Marrant

Contrôles : zéro tiret cadratin, zéro émoji, aucune mention « écrit à la main » ni « personnellement », signature identique à celle des réponses ordinaires.

---

## 3. Conservation de 6 mois dans Gmail ET dans IONOS

### 3.1 Confirmation

**Oui : la durée annoncée s'applique à chaque copie, dans les deux boîtes.** Raisons : (a) la copie Gmail est la même donnée, avec la même finalité (répondre, traiter une relance ou une contestation) ; une copie qui dure plus longtemps n'a aucune finalité propre (limitation de la conservation, RGPD art. 5.1.e) ; (b) la section 9 promet une durée à l'abonné, et la promesse doit être vraie partout où le message se trouve, Corbeille comprise ; (c) l'information sur la durée (art. 13.2.a) serait inexacte si la copie Gmail restait. Les 6 mois sont un maximum : effacer plus tôt est toujours conforme. Cette durée reste une `[HYPOTHÈSE : durée proposée par @legal, à valider par Thomas et par l'avocat, liste A3]`.

### 3.2 Où se trouvent les copies

| Emplacement | Qui le maîtrise | Traitement |
|---|---|---|
| IONOS : Réception, Envoyés, Corbeille, Spam | Thomas | Purge mensuelle (3.5) |
| Gmail : Réception, Envoyés, Tous les messages, Corbeille, Spam | Thomas | Purge mensuelle (3.4), puis vider la Corbeille |
| Applications de messagerie (téléphone, ordinateur) | Thomas | Suivent la boîte si elles sont synchronisées (IMAP). En POP, la copie locale reste : vérifier |
| Resend (journaux d'envoi) | Resend | Durée fixée par l'offre `[À VÉRIFIER dans le compte Resend, ne pas annoncer de chiffre]` ; voir 4.3 |
| Outils de rédaction (Anthropic) | Thomas | Session supprimée dès la réponse envoyée (règle 6, point 1.3) |
| Sauvegardes d'IONOS et de Google | Les fournisseurs | Hors de notre contrôle : `[À VÉRIFIER dans leurs conditions]`, ne pas promettre plus |

### 3.3 D1 : avant toute purge, régler le cas du Gmail personnel

Un transfert vers une adresse @gmail.com expose les messages des abonnés à un compte sans contrat de sous-traitance : Google ne propose son CDPA qu'à un administrateur Workspace, et ce compte ne peut pas être une adresse @gmail.com (aide Google, consultée le 25/10/2026). Deux sorties, à choisir par Thomas `[À CONFIRMER : le Gmail est-il un compte personnel ou Workspace ?]` :
- **A (la plus simple, recommandée)** : couper le transfert, lire contact@ dans le webmail IONOS ou une application IMAP. Une seule boîte à purger. IONOS : le contrat de sous-traitance fait partie de ses conditions pour les contrats conclus depuis le 19/07/2022 ; pour un contrat plus ancien, il se complète en ligne gratuitement (Mon compte, Données et confidentialité) `[À VÉRIFIER dans le compte IONOS]`. Partie 4 : retirer la mention Gmail du rôle de Google et simplifier celui d'IONOS.
- **B** : Google Workspace pour contact@, CDPA accepté dans la console d'administration (Paramètres du compte, Juridique et conformité). Les deux boîtes restent à purger.

Dans les deux cas, répondre avec l'adresse contact@ comme expéditeur (Gmail, « Envoyer en tant que » avec le serveur IONOS), sinon l'abonné reçoit une réponse d'une adresse personnelle et la signature « L'Équipe Deviens Marrant » sonne faux (point 2 de la relecture).

### 3.4 Procédure Gmail (si le transfert est conservé)

1. **Désactiver l'affichage en conversations** (Paramètres, Voir tous les paramètres, Général, Affichage des conversations : désactivé). Deux raisons : un même objet fixe et un même expéditeur peuvent regrouper deux abonnés dans une seule conversation, et « Répondre » viserait alors le mauvais abonné (point C9 de la relecture : c'est une fuite de données si elle se produit, à inscrire au registre des violations, art. 33.5 `[À VÉRIFIER]`) ; et la suppression agit ainsi message par message. Test réel avec 2 comptes par @qa avant l'ouverture.
2. **Libellé** : Paramètres, Filtres et adresses bloquées, Créer un filtre. Champ « Objet » : `Ta question à l'équipe` (le nouvel objet proposé par la relecture, point 4.5). Action : « Appliquer le libellé » `Question équipe` (à créer). Ne cocher aucune action de suppression. Le libellé sert à voir ; la purge se fait par recherche (les filtres ne s'appliquent pas aux messages envoyés).
3. **Purge (premier jour ouvré du mois, 5 minutes)** : dans la barre de recherche, saisir `in:anywhere subject:"Ta question à l'équipe" older_than:5m`. Si la recherche ne renvoie rien à cause de l'apostrophe, utiliser `in:anywhere subject:(Ta question équipe) older_than:5m`. Vérifier à l'oeil que seuls des échanges de questions apparaissent. Cocher la case du haut, cliquer « Sélectionner toutes les conversations correspondant à cette recherche », puis Supprimer.
4. **Vider** : ouvrir Corbeille et Spam, cliquer « Vider la corbeille maintenant ». Sans cette étape, Gmail ne vide la Corbeille qu'après 30 jours : la durée réelle serait de 6 mois et 30 jours, plus que la promesse.
5. **Pourquoi `5m` et non `6m`** : avec une purge mensuelle, un message est effacé entre 5 et 6 mois après sa date, donc jamais au-delà de 6 mois. Plus tôt est toujours conforme.
6. **Rythme et preuve** : rappel récurrent dans l'agenda (premier jour ouvré). Noter dans le registre : date, nombre de messages effacés, aucune donnée personnelle.
7. **Option automatisée** (Google Apps Script, `script.google.com`, service avancé « Gmail API » activé, déclencheur mensuel). `[À TESTER à blanc avant tout usage : DRY_RUN reste à true tant que le journal ne montre que des échanges de questions]`

```
function purgeQuestionsEquipe() {
  const DRY_RUN = true;
  const limite = new Date(Date.now() - 150 * 24 * 3600 * 1000);
  const fils = GmailApp.search("in:anywhere subject:\"Ta question à l'équipe\" older_than:5m", 0, 100);
  let n = 0;
  fils.forEach(function (fil) {
    fil.getMessages().forEach(function (m) {
      if (m.getDate() < limite) {
        n++;
        if (!DRY_RUN) Gmail.Users.Messages.remove("me", m.getId());
      }
    });
  });
  Logger.log((DRY_RUN ? "A blanc : " : "Effacés : ") + n);
}
```

### 3.5 Procédure IONOS

Aucune source trouvée sur une suppression automatique par âge dans le webmail IONOS `[À VÉRIFIER dans l'aide IONOS : règle ou durée de conservation par dossier]` : procédure manuelle par défaut.
1. Webmail IONOS, recherche sur l'objet `Ta question à l'équipe` dans tous les dossiers, tri par date.
2. Sélectionner les messages de plus de 5 mois (Réception, Envoyés), supprimer, puis vider le dossier Corbeille.
3. Même rythme que Gmail (même jour, même rappel). Vérifier que la redirection ne laisse pas une copie dans un dossier caché (« Conserver une copie » dans les réglages de redirection) `[À VÉRIFIER]`.
4. Si une application sur téléphone ou ordinateur est en POP : supprimer aussi la copie locale.

### 3.6 Effacement à la demande

Dans le mois (idéalement sous 7 jours pour un message sensible) : rechercher l'adresse de l'abonné (`in:anywhere from:adresse OR to:adresse`) dans Gmail et dans IONOS, supprimer, vider les corbeilles, supprimer la session de l'outil si elle existe, répondre « c'est effacé de nos boîtes » (pas « de partout » : Resend et les sauvegardes ne sont pas à la main de l'équipe). Noter la date au registre.

---

## 4. Relecture de la partie 4 et de la section 9 telles qu'écrites dans le code

Lu dans `confidentialite/page.tsx` et `config/textes/question-equipe-s22.ts` (25/10/2026). Le rendu conditionnel est correct : interrupteur fermé, la liste de la partie 4 reste celle d'avant ; ouvert, Resend et Google sont étendus et IONOS et « Outils de rédaction » ajoutés.

### 4.1 Partie 4 : substantiellement exacte, 4 corrections de mots

| Ligne | Texte actuel | Problème | Texte corrigé |
|---|---|---|---|
| Google | « …messagerie Gmail de l'équipe, qui reçoit les messages envoyés à contact@deviens-marrant.fr, dont tes messages à l'équipe » | Gmail reçoit une copie transférée, pas les messages eux-mêmes | « …et messagerie Gmail de l'équipe, qui reçoit une copie des messages envoyés à contact@deviens-marrant.fr, dont tes messages à l'équipe » |
| IONOS | « …hébergement de la boîte e-mail de l'équipe (contact@deviens-marrant.fr), qui transfère tes messages à l'équipe vers sa messagerie Gmail (Google) » | Exact, mais IONOS garde aussi le message ; le lecteur peut croire qu'il ne fait que passer | « hébergement de la boîte e-mail de l'équipe (contact@deviens-marrant.fr), qui reçoit tes messages à l'équipe et en transfère automatiquement une copie vers sa messagerie Gmail (Google) » |
| Outils de rédaction | « l'équipe s'en sert pour préparer ses réponses. Ils reçoivent le texte de ta question, pas les informations de ton compte. » | Ne dit rien de l'entraînement ni de la durée, alors que la règle du point 1.3 les prévoit | Variante A (publier seulement si B1 est levé) : « l'équipe s'en sert pour préparer ses réponses. Ils reçoivent le texte de ta question, pas les informations de ton compte, et ne s'en servent pas pour s'entraîner. Le texte y est supprimé dès l'envoi de la réponse. » |
| Resend | Correct | Aucune | Aucune |

Option de transparence, à trancher par Thomas : la formule « Outils de rédaction » nomme la catégorie sans dire qu'il s'agit d'un service d'IA d'un prestataire américain. Elle reste conforme à l'art. 13.1.e tant que chaque réponse est relue et envoyée par une personne, et la décision du 06/05 n'est pas rouverte ici. Variante B, plus transparente, que je recommande sans l'imposer : « **Outils de rédaction** (dont un service d'intelligence artificielle établi aux États-Unis) : l'équipe s'en sert… » (suite de la variante A). Dans tous les cas, si un abonné demande si une IA a servi, la réponse est vraie.

Le paragraphe des transferts hors UE reste exact : le DPA d'Anthropic contient des clauses contractuelles types et celui de Google (CDPA) aussi. Il suppose pourtant que Google agisse « pour notre compte » (introduction de la partie 4) : vrai seulement si D1 est réglé.

### 4.2 Section 9 : 4 points à corriger, texte complet ci-dessous

Problèmes : (a) « la boîte e-mail de l'équipe » au singulier alors qu'il y en a deux ; (b) « votre dernier échange » mélange tu et vous ; (c) 6 mois présentés comme une durée fixe : c'est un maximum ; (d) la durée ne dit rien de la suppression du compte, de Resend ni des outils (voir 4.3) ; (e) « repris ailleurs » peut se lire comme contraire à l'usage des outils (point O5 de la relecture, accepté).

**9. Ta question à l'équipe (abonnés Premium)**
- Ce qu'on reçoit : *(inchangé)*
- Pourquoi : *(inchangé)*
- Qui y accède : l'équipe, dans la boîte contact@deviens-marrant.fr (hébergée chez IONOS, qui en transfère une copie vers une messagerie Gmail). Ton message passe par Resend (envoi), et l'équipe peut se servir d'outils de rédaction pour préparer sa réponse (voir la partie 4). Rien n'est publié ni réutilisé sur le site sans ton accord.
- Combien de temps : ta question et notre réponse restent dans les boîtes e-mail de l'équipe (IONOS et Gmail) au plus 6 mois après notre dernier échange, même si tu supprimes ton compte, puis sont effacées. Resend, qui envoie ces messages, peut en garder une copie technique dans ses journaux pendant une durée limitée qui dépend de son offre. Dans les outils de rédaction, le texte de ta question est supprimé dès l'envoi de la réponse. Tu peux demander leur effacement plus tôt.
- Tes droits : *(inchangé)*

Notes : la phrase sur les outils n'est publiée que si B1 est levé. Si l'option A de D1 est choisie : « dans la boîte contact@deviens-marrant.fr, hébergée chez IONOS » et « dans la boîte e-mail de l'équipe (IONOS) ». La section 9 doit aussi être citée dans la liste de la partie 2 (Données collectées) par un renvoi : optionnel.

### 4.3 Contradiction de conservation (relecture à l'aveugle, bloquant B1) : textes exacts

Constat confirmé. CGU art. 7 : « La suppression est immédiate : tes données personnelles sont effacées » ; confidentialité partie 6 : « Tes données sont conservées tant que ton compte existe ». Or les échanges avec l'équipe gardent leur propre durée, compte supprimé ou non. Les factures sont déjà citées en exception, les questions non. Même défaut, plus ancien : la preuve de rétractation (partie 6) survit aussi à la suppression, alors que l'article 7 promet l'effacement des « données personnelles ». La correction ci-dessous règle les deux. Justification de garder 6 mois après suppression : la finalité (répondre à une relance ou à une contestation) ne dépend pas du compte ; l'abonné est informé et peut demander l'effacement (art. 17).

**CGU article 7, deux modifications** (la première toujours, la seconde seulement interrupteur ouvert, avec la section 10) :
1. Dans la 1re phrase, remplacer « tes données personnelles sont effacées » par « les données de ton compte sont effacées ».
2. À la fin du 1er paragraphe, après « (voir la politique de confidentialité). », ajouter : « Tes échanges par e-mail avec l'équipe (Ta question à l'équipe) suivent leur propre durée : ils restent au plus 6 mois après notre dernier échange, même si tu supprimes ton compte, puis sont effacés. Tu peux demander leur effacement plus tôt (voir la politique de confidentialité). »

**Confidentialité partie 6, deux modifications :**
1. Premier paragraphe (toujours) : remplacer « Tes données sont conservées tant que ton compte existe. » par « Les données de ton compte sont conservées tant que ton compte existe, sauf les exceptions indiquées dans cette partie. » Le reste de la phrase (suppression depuis le profil) ne change pas.
2. Nouveau dernier paragraphe de la partie 6 (affiché seulement interrupteur ouvert) : « Tes questions à l'équipe et nos réponses suivent leur propre durée (voir la partie 9) : elles restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt à contact@deviens-marrant.fr. Resend, qui transmet ces messages, peut en garder une copie technique dans ses journaux pendant une durée limitée qui dépend de son offre. »

**Copie gardée par Resend : formule prudente et vérification.** La durée n'est pas connue : les sources publiques se contredisent (de 1 à 30 jours en gratuit, de 3 à 60 jours en Pro, sources secondaires) et dépendent du plan. Ne rien chiffrer tant que Thomas n'a pas lu la valeur dans son compte. Action de Thomas : ouvrir le compte Resend (plan, journaux ou « Logs », réglages), noter la durée de conservation réelle, regarder si le contenu des messages (le texte de la question) y est lisible, et réduire ou désactiver la conservation du contenu si le réglage existe `[À VÉRIFIER]`. Quand la durée est confirmée, remplacer « pendant une durée limitée qui dépend de son offre » par « pendant X jours » dans la partie 6 et la section 9. Si la durée dépasse 6 mois, c'est un nouveau bloquant (copie plus longue que la promesse).

**Section 9** : déjà alignée par le texte du 4.2 (« même si tu supprimes ton compte »). Vérifier côté code que la suppression de compte (`deleteAccount`) n'est pas censée toucher les boîtes : elle ne le fait pas et ne doit pas le faire, mais l'e-mail de confirmation de suppression peut rappeler la phrase de l'article 7 `[suggestion @fullstack, non bloquante]`.

### 4.4 Mention sous le bouton (bloquant B2 de la relecture)

Fondé, et c'est mon texte qui contredit l'exemple (un collègue qui chambre est un tiers). Équivalence avec les CGU (« ni information sensible sur toi, ni nom de personne ») : la mention « noms » + « infos personnelles » est cohérente avec elles ; la version de la relecture (« les noms et les infos sur ta santé ») l'est aussi mais couvre moins que « sensible ». Texte que je recommande, à relire à l'aveugle : « Ton message est lu par l'équipe pour te répondre. Évite les noms et les infos très personnelles, comme ta santé. Détails et droits : Confidentialité. » Version minimale acceptable : celle de la relecture. La règle 2 du point 1.3 (anonymiser) devient alors cohérente avec ce que l'abonné a lu.

### 4.5 E-mail interne (bloquant B4 de la relecture) et CGU 10

- D'accord : retirer les « Rappels » de l'e-mail (visibles par l'abonné dans la citation) et les loger dans le playbook interne : règles du point 1.3 et conduite du point 2. L'e-mail interne ne doit pas mentionner d'outil de rédaction.
- Objet visible par l'abonné : « Ta question à l'équipe Deviens Marrant », avec si le test du fil Gmail l'exige (C9) un numéro aléatoire court. Mes recherches de purge (3.4) restent valables tant que l'objet contient « Ta question à l'équipe ».
- CGU 10 : C6 (« ne pas savoir quoi répondre ou quoi écrire ») et O4 (titre « Ta question à l'équipe et la lettre ») validés ; O5 validé (« réutilisé sur le site »).

---

## Handoff vers @orchestrator

**Points bloquants pour l'ouverture**
1. B1 (C2) : type de compte Claude de l'équipe à confirmer par Thomas (commercial attendu).
2. B2 (D1) : Gmail personnel sans contrat de sous-traitance : couper le transfert ou passer en Workspace.
3. B3 : procédure de purge en place dans les deux boîtes avant la première question ; durée de Resend lue dans le compte.
4. B4 : textes ci-dessous publiés ensemble ; test @qa du regroupement Gmail (C9) fait.
5. B5 (C4) : conduite et 4 textes types validés par Thomas après relecture à l'aveugle.

**Textes à changer**
- Confidentialité partie 4 : lignes Google, IONOS, Outils de rédaction (4.1).
- Confidentialité section 9 : puces « Qui y accède » et « Combien de temps » (4.2).
- Confidentialité partie 6 : premier paragraphe + nouveau paragraphe conditionnel (4.3).
- CGU article 7 : deux modifications (4.3). CGU article 10 : C6, O4, O5.
- Mention sous le bouton (4.4). E-mail interne : objet et corps sans rappels (4.5), rappels au playbook.

**Actions pour Thomas**
1. Vérifier le plan Claude de chaque session et noter le résultat ; archiver les Conditions commerciales et le DPA datés (1.2).
2. Dire si le Gmail est personnel ou Workspace ; choisir A ou B (3.3) ; configurer « Envoyer en tant que » contact@.
3. Créer le filtre et le libellé Gmail, désactiver l'affichage en conversations, régler le rappel mensuel, faire la première purge à blanc (3.4, 3.5).
4. Lire dans le compte Resend la durée de conservation et la présence du contenu ; me la donner pour chiffrer la phrase (4.3).
5. Valider la durée de 6 mois, la durée de 30 jours des messages sensibles, la conduite du point 2 et la décision sur un compte de moins de 15 ans.
6. Faire valider par un avocat (liste A) quand le budget le permet : 6 mois après suppression du compte, formule « outils de rédaction », CDPA ou transfert Gmail.

Consignes aval : @fullstack (affichage conditionnel, objet et corps de l'e-mail, rappel de suppression), @copywriter (relecture à l'aveugle de la mention et des 4 textes types), @qa (test du fil Gmail à 2 comptes, captures manquantes), @infrastructure (Resend : durée, contenu), @ia (ligne rouge de l'envoi automatique, aucun connecteur de messagerie sur ces sessions).

Sources (consultées le 25/10/2026, extraits de recherche web, pages non rouvertes en entier) : [Conditions commerciales d'Anthropic](https://www.anthropic.com/legal/commercial-terms) ; [Anthropic, entraînement sur les données](https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training) ; [Anthropic, DPA à consulter et signer](https://privacy.claude.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa) ; [Anthropic, conservation des données d'une organisation](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data) ; [Anthropic, responsable ou sous-traitant](https://privacy.claude.com/en/articles/9267385-does-anthropic-act-as-a-data-processor-or-controller) ; [Anthropic, évolution des conditions grand public](https://www.anthropic.com/news/updates-to-our-consumer-terms) ; [Google, CDPA Workspace](https://support.google.com/a/answer/2888485) ; [IONOS, contrat de sous-traitance](https://www.ionos.de/hilfe/datenschutz/allgemeine-informationen-zur-datenschutz-grundverordnung-dsgvo/vereinbarung-zur-auftragsverarbeitung-avv-mit-ionos-abschliessen/.) ; [info.gouv.fr, 3114](https://www.info.gouv.fr/actualite/3114-le-numero-national-de-prevention-du-suicide-a-composer) ; [info.gouv.fr, 3020 et 3018](https://www.info.gouv.fr/actualite/victime-ou-temoin-dites-non-au-harcelement) ; [france.fr, numéros d'urgence](https://www.france.fr/fr/article/les-numeros-dappel-durgence-en-france/) ; [info.gouv.fr, 3919](https://www.info.gouv.fr/index.php/actualite/violences-faites-aux-femmes-quels-recours-pour-les-victimes).



