# D4 confidentialité s24 : vérification (draft de référence, à faire valider par un avocat)
Lu : `espace-confidentialite.ts`, `confidentialite/page.tsx`, `account.ts`, `schema.prisma`, migrations 20 et 22.
## (1) Partie 6 : correct
Ajout bien placé (liste « étape validée, retours, réponse » puis verbe au pluriel), version fermée inchangée, rappel de parcours conservé. Point final des puces retiré : bon choix (les puces de la page n'en ont pas) ; la partie 6 est un paragraphe, elle garde le sien. Aucun problème.
## (2) `CapAnnonce` : oui, à ajouter (donnée du compte non couverte par « XP, niveau, série »)
A. `espace-confidentialite.ts`, avant `/** Partie 3 (base), nouvelle puce. */` ajouter :
`donneesCaps: "Les caps et les bonus qu'on t'a déjà annoncés (lequel, et la date de l'annonce), y compris ceux déjà atteints à l'ouverture de l'espace, notés sans annonce, si tu es abonné",`
`baseCaps: "Ne t'annoncer qu'une seule fois chaque cap et chaque bonus : exécution du contrat",`
B. même fichier, `dureeEtapes`. Avant : `...tes retours sur les exercices et ta réponse sur l'endroit où tu veux être plus à l'aise sont gardés...` Après : `La date de chaque étape validée, tes retours sur les exercices, ta réponse sur l'endroit où tu veux être plus à l'aise et la liste des caps et des bonus déjà annoncés sont gardés tant que ton compte existe, et effacés avec lui.`
C. `page.tsx`, après la ligne 109 : `{ESPACE_CLIENT_PUBLIE && <li data-testid="confidentialite-espace-caps">{frTypo(CONFIDENTIALITE_ESPACE.donneesCaps)}</li>}` ; après la ligne 131 : même ligne avec `baseCaps`. Retirer du commentaire le marqueur `[À VÉRIFIER @legal : place de l'ajout dans la phrase.]`.
Réserve : « si tu es abonné » à confirmer par @fullstack (lignes écrites seulement pour les abonnés ?), sinon retirer ces 4 mots. Vérifier les tests qui figent la phrase de la partie 6.
## (3) Export et effacement : couverts
Export : `collecterDonneesParcours` lit `EspaceCompte` (aise, aiseLe, rencontreServieLe, createdAt, updatedAt) et `CapAnnonce` (type, numero, annonceLe, silencieux), sans rien oublier. Non vérifié : qui appelle cette fonction (pas de route d'export trouvée sous `api/user`) ; @fullstack doit confirmer qu'une route ou un script l'utilise.
Effacement : `ON DELETE CASCADE` en SQL (migrations 20 et 22) et `onDelete: Cascade` en Prisma ; `deleteAccount` finit par `prisma.user.delete` : tout part. Ne PAS ajouter de `deleteMany` dans la transaction : si une migration n'est pas jouée, toute la suppression échouerait. Prérequis : migrations 20 et 22 jouées avant le déploiement, sinon l'export échoue (Promise.all).
Variante « Pour la changer, écris à… » : non tranchée (choix du fondateur).
