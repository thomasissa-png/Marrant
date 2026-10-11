# Liste des posts publiés à supprimer (audit s14)

> **Décision Thomas 03/10 : aucune suppression.** Les anciens posts restent en ligne ; cette liste et la synthèse sont conservées pour mémoire.

> Lecture seule, 01/10/2026. Rien n'a été supprimé. Aucun appel à Buffer, X ou LinkedIn, aucune écriture en base, aucun code modifié.
> Source : `export-posts.json` (636 posts), statut `PUBLISHED` uniquement (557 : 518 X, 39 LinkedIn, publiés du 20/03 au 15/06/2026).
> Liste détaillée : `suppression-liste.csv`. Les posts avec CITATION sont en tête, puis le reste par date. La colonne `noms` a été ajoutée en plus.
> Méthode : un script Python applique les règles mécaniques (TIRET, GROS_MOT, JE, chiffres) ; j'ai ensuite lu moi-même les 311 posts qui citent une personne réelle pour classer PERSONNE, CITATION et INVENTE.

## 1. Totaux

| | X | LinkedIn | Total |
|---|---|---|---|
| Posts publiés | 518 | 39 | 557 |
| **À supprimer** | **375** | **21** | **396 (71 %)** |
| Conformes, à garder | 143 | 18 | **161** |

Un post peut avoir plusieurs motifs, donc les nombres ci-dessous ne s'additionnent pas.

| Motif | X | LinkedIn | Total | Seul motif du post |
|---|---|---|---|---|
| CITATION (fausse citation d'une personne réelle, **priorité juridique**) | 181 | 11 | **192** | 0 (c'est toujours aussi PERSONNE) |
| PERSONNE (humoriste ou personne réelle nommée) | 295 | 16 | **311** | 51 |
| TIRET (tiret cadratin) | 132 | 9 | **141** | 24 |
| INVENTE (chiffre, vécu ou fait inventé) | 53 | 9 | **62** | 7 |
| GROS_MOT | 58 | 4 | **62** | 12 |
| JE (« je », « moi », « mon » de la marque, hors vanne citée) | 52 | 4 | **56** | 30 |

Ce qu'il faut retenir :
- 272 des 396 posts ont au moins 2 motifs.
- **Les threads posent un problème sur X.** Les 51 threads publiés sont tous dans la liste. Notre code a publié chaque partie comme un **tweet séparé** (`createBufferThread`, une création Buffer par partie, sans lien entre elles). Les posts de plus de 270 caractères ont aussi été découpés automatiquement. Les 375 posts X correspondent donc à **environ 800 tweets** à supprimer. C'est une estimation, et seul le compte X lui-même donne le nombre exact.

### Règles d'application
- **JE** : « je », « j' », « moi », « mon », « ma », « mes » en dehors des guillemets (« », " ", ' '). Je n'ai pas compté les traductions d'expressions (« = j'ai pas écouté », « Traduction : … ») ni la voix intérieure du « tu ». Exemple de post retenu : « Mon ex m'a recontacté. J'ai mis 47 minutes… J'ai 34 ans. »
- **GROS_MOT** : merde, putain, con/conne/connerie/connard, bordel, chier, cul, (ta/sa/ferme ta) gueule, se branler, baiser, s'en foutre. Je n'ai retenu ni « débile », ni « wesh », ni « chiant ». Les gros mots sont comptés même quand ils sont dans une vanne entre guillemets.
- **CITATION** : une phrase mise dans la bouche d'une personne réelle (« Waly : « … » », « Fary répond : « … » »). Je n'ai pas compté un simple tic d'un mot (« Panayotis dit « euh » »), mais le post reste alors en PERSONNE.
- **INVENTE** couvre trois cas :
  - un vécu de la marque (« Testé hier soir », « Samedi j'ai testé »)
  - une statistique présentée comme un fait (« Ça marche dans 80 % des cas », « le délai multiplie l'impact par 10 »)
  - un fait biographique ou une actualité inventés sur une personne réelle (« Waly vit chez papa-maman. À 35 ans », « Jamel a annoncé son retour », « Cyprien arrête YouTube »)

  Je n'ai pas compté les hyperboles manifestement comiques (« 73 % de nos WhatsApp »).
- **TIRET** : le caractère « — » uniquement, pas le tiret demi-cadratin. Dans le CSV, il est remplacé par « [—] ».

## 2. Noms détectés (31)

**Humoristes, présents dans 311 posts au total :**

| Personne | Posts |
|---|---|
| Panayotis Pascot | 74 |
| Waly Dia | 60 |
| Blanche Gardin | 49 |
| Roman Frayssinet | 46 |
| Inès Reg | 45 |
| Pierre Croce | 22 |
| Paul Mirabel | 19 |
| Fary | 19 |
| Jamel Debbouze | 2 |
| Gad Elmaleh | 1 |
| Kevin Hart | 1 |
| Franglish | 1 |
| Palmashow (Grégoire Ludig) | 1 |
| Jérôme Commandeur | 1 |
| José Garcia | 1 |

**Autres personnes réelles :**

| Personne | Posts |
|---|---|
| PNL | 4 |
| Ivan Pavlov | 2 |
| Booba | 2 |
| Mark Zuckerberg | 2 |
| Cyril Hanouna | 1 |
| Squeezie | 1 |
| Cyprien | 1 |
| Jul | 1 |
| Nabilla | 1 |
| Kylian Mbappé | 1 |
| Aya Nakamura | 1 |
| Gordon Ramsay | 1 |
| Martin Scorsese | 1 |
| Ted Bundy | 1 |
| Charles Baudelaire | 1 |
| Taylor Swift (déduit du contexte) | 1 |

**À trancher par Thomas : 5 posts n'ont qu'une référence culturelle en passant, sans aucun autre motif.** Ce sont `…jxj59ayx` (Pavlov), `…1u636i3n` (Booba), `…dxfxeq5w` (PNL), `…k6eh3n6q` (Aya Nakamura) et `…8ymzurhz` (Zuckerberg). La règle stricte les supprime. Les garder ferait 166 posts conservés au lieu de 161.

Je n'ai pas compté les prénoms génériques (Kevin, Marion, Julie, Paul le boss…), les personnages de fiction (Harry Potter, Sherlock, Jim de The Office, Kaamelott) ni les marques.

## 3. Dix exemples de CITATION (les plus risqués)

| id | Date | Extrait | Risque |
|---|---|---|---|
| …81uwrso6 (X) | 21/03 | « Mirabel atomise Hanouna : « Je fais rire sans rabaisser. Cyril... l'inverse. » » | Fausse citation **qui attaque un tiers réel**. C'est le pire cas. |
| …0nih586p (X) | 29/04 | Panayotis Pascot « raconte qu'il a un peu d'anxiété sociale », « 'J'ai un petit problème avec l'alcool' *raconte 20 minutes sur ses cuites* » | Lui prête une santé mentale et un rapport à l'alcool |
| …mkx6gxj5 (X) | 21/04 | Panayotis Pascot : « depuis que ma femme m'a quitté, je mange des céréales debout… » | Fausse vie privée |
| …8as98cap (X) | 25/04 | « Waly vit chez papa-maman. À 35 ans. » + « Je paye pas de loyer… » | Faux fait biographique |
| …0obezp7w (X) | 19/04 | « Waly galère sur Tinder. « Moi qui fais rire 2000 personnes par soir… » » | Fausse vie privée et faux chiffre |
| …ui5orw91 (X) | 25/03 | « Fary : « Merci pour ce feedback... depuis le fond. » *400 personnes explosent* » | Scène inventée |
| …few35xwm (X) | 27/04 | « Mbappé rate ses vannes. « Je cours vite... mais pas assez pour rattraper mes ex » » | Sportif (pas humoriste) avec une fausse citation sur sa vie privée |
| …om4o6t54 (X) | 27/04 | « Jamel a annoncé son retour. » + « « Wesh alors ! » » | Fausse actualité |
| …fysmxwkc (X) | 16/04 | Inès Reg : « JE SUIS GROSSE ! JE LE SAIS ! MERCI HEIN ! » | Fausse citation sur le physique |
| …a6dpyqzg (X) | 21/04 | Blanche : « Moi j'ai pas d'enfants... j'ai des plantes. Et encore, elles crèvent. » | Fausse citation sur la vie privée |

## 4. Voie technique de suppression

### Ce que la vérification a établi
1. **Buffer ne peut pas supprimer un post déjà publié.** Le Buffer Help Center l'écrit noir sur blanc : « At this time, we are unable to edit or delete a post once it's been published through Buffer », et il faut supprimer le post directement sur le réseau ([source](https://support.buffer.com/article/517-insights-on-shared-posts-within-your-publishing-dashboard)).
   - La mutation GraphQL `deletePost` ne supprime le post que **dans Buffer**, et seulement si `allowedActions` l'autorise ([Buffer API, MCP](https://developers.buffer.com/guides/integrations/mcp.html)). Le tweet reste en ligne.
   - **Il ne faut pas l'utiliser** : elle effacerait le lien entre le post Buffer et le tweet, c'est-à-dire la seule correspondance dont on dispose.
2. **Notre code ne sait rien supprimer.** `buffer-client.ts` ne fait que créer des posts (`createPost`) et lire la file d'attente. Aucune fonction de suppression n'existe dans `lib/social/` (Grep `delete|destroy` : seulement les images R2).
3. **On ne connaît pas encore les identifiants des tweets.**
   - `externalId` contient l'identifiant **Buffer** (`publish-social/route.ts:268-309`), pas celui du tweet.
   - Pour un thread, seul l'identifiant de la 1re partie est conservé.
   - La colonne `externalId` **n'existe pas dans l'export** : elle est donc vide dans le CSV.
   - J'ai tenté une lecture `SELECT` en lecture seule sur Neon pour la remplir. Elle a été **refusée par le contrôle de permissions** (lecture de production) et je ne l'ai pas contournée.
4. **L'API X le permet, et c'est gratuit.**
   - L'appel est `DELETE /2/tweets/:id`, avec une authentification au nom du compte (contexte utilisateur) ([docs X](https://docs.x.com/x-api/posts/delete-post)).
   - La limite est de **50 suppressions par 15 minutes** par utilisateur ([rate limits](https://docs.x.com/x-api/fundamentals/rate-limits)).
   - `post.delete` est **non facturé** dans le modèle à l'usage. Il faut seulement un compte développeur avec des crédits achetés à l'avance ([pricing](https://docs.x.com/x-api/getting-started/pricing)).
   - Pour environ 800 tweets, comptez **environ 4 h 30** d'exécution, en un seul passage automatisé.
   - Les variables `TWITTER_API_KEY/SECRET` et `TWITTER_ACCESS_TOKEN/SECRET` existent dans l'environnement de session (j'ai vérifié les noms seulement). Il reste à confirmer qu'elles sont liées au compte de la marque et ont le droit d'écrire.
5. **LinkedIn : 21 posts, la suppression manuelle est la plus simple.** Il faut un admin de la page entreprise. L'API (`DELETE /rest/posts/{urn}`, scope `w_organization_social`) ne vaut pas le coût de mise en place pour 21 posts.

### Voie recommandée (la plus sûre)
L'idée générale : obtenir les vrais identifiants de tweets, rapprocher les textes exacts, faire valider la liste par Thomas, puis supprimer avec un script qui respecte les limites et garde une trace.

**Étapes pour Thomas :**
1. **Valider cette liste.**
   - Relire le CSV, en commençant par les CITATION.
   - Trancher sur les 5 références culturelles (§2).
2. **Récupérer les identifiants des tweets.** Je recommande A, et B sert de secours :
   - A. **Archive X** : sur x.com, Paramètres > Votre compte > Télécharger une archive de vos données. Comptez 24 h ou plus. Le fichier `tweets.js` contient l'identifiant et le texte de **chaque** tweet, parties de threads comprises. Cette source ne dépend ni de Buffer ni de la base.
   - B. Autoriser une session à faire une **lecture** de l'API Buffer : requête `posts` avec le filtre `status: sent` sur le canal X. Le champ `externalLink` donne l'URL du tweet. Chaque partie de thread est un post Buffer distinct.
3. **Autoriser @fullstack à préparer le rapprochement, sans rien supprimer à ce stade.**
   - Il produit `suppression-ids-x.csv` (identifiant du tweet, identifiant SocialPost, texte).
   - Le rapprochement se fait sur le **texte exact, après normalisation des espaces**. Jamais de rapprochement approximatif pour une suppression.
   - Les tweets non rapprochés sont listés à part.
4. **Vérifier la console développeur X** :
   - application en mode Lecture + Écriture
   - crédits disponibles
   - jetons du compte de la marque
5. **Donner le GO explicite sur `suppression-ids-x.csv`.** Le script tourne ensuite ainsi :
   - un essai à blanc d'abord
   - puis 1 suppression toutes les 20 secondes
   - un journal de chaque identifiant et réponse (`deleted: true`)
   - une reprise possible après une erreur 429
6. **LinkedIn, à la main (environ 15 min)** : vue admin de la page > Posts > « … » > Supprimer, pour les 21 posts `LINKEDIN` du CSV.
7. **Après la suppression**, marquer ces posts en base. Cela demande un nouveau statut ou un champ, à confier à @fullstack et à documenter dans `REPLIT_ACTIONS.md`, pour que le tableau d'administration ne les affiche plus comme publiés. Les posts `PUBLISHED` ne sont jamais renvoyés à Buffer : `publish-social` ne prend que les `APPROVED`.

**Je déconseille** les outils tiers de suppression en lot. Ils demandent un accès complet au compte et filtrent par date ou mot-clé, pas par une liste d'identifiants validée. 161 tweets conformes sont mêlés aux 375 posts visés : ces outils risquent donc de supprimer des tweets à garder.

## 5. Risques

- **Une suppression est irréversible.** Une fois supprimé, un tweet ne peut pas être republié avec ses interactions. Il faut un GO écrit de Thomas sur la liste finale des identifiants, pas seulement sur ce CSV.
- **Les threads peuvent n'être supprimés qu'en partie.** Chaque partie est un tweet indépendant. Si on supprime la seule 1re partie (le seul identifiant connu en base), les autres restent en ligne et peuvent contenir les fausses citations. Le rapprochement doit couvrir toutes les parties.
- **Les tweets découpés automatiquement** (plus de 270 caractères) ont été coupés par `splitIntoTweetThread`. Leur texte sur X ne correspond pas à `content` : il faut rapprocher partie par partie.
- **Les publications du 20-21/03 sont incertaines** : 14 posts de la liste. [HYPOTHÈSE] Des notes « Twitter API error 503 » montrent que certains passaient alors par l'API X en direct, pas par Buffer. Leur `externalId` serait alors un identifiant de tweet. L'archive X (étape 2A) règle la question.
- **Le risque juridique n'est pas effacé** : supprimer limite la diffusion, mais des captures et des repartages ont pu exister. Les 192 CITATION doivent être traitées en premier : faire tourner le script dans l'ordre du CSV, où elles sont en tête. Pour les cas les plus sensibles (Hanouna, Pascot et l'alcool), un avis de @legal est conseillé.
- **Les erreurs de classement restent possibles** : JE et GROS_MOT sont mécaniques, CITATION et INVENTE relèvent d'une lecture humaine. Certains cas sont discutables : un tic d'un mot attribué compté en PERSONNE et non en CITATION, une hyperbole non comptée en INVENTE. **Cela ne change pas la décision de suppression des posts concernés** : ils ont tous au moins un autre motif.
- **Le problème reviendra si on relance la génération sans correctif** : 56 % des posts publiés nomment un humoriste. Le prompt du social-media-agent et le Stand-Up Director doivent interdire ces 6 motifs **avant** toute remise à `true` de `CONTENT_GENERATION_ENABLED`.
- **Buffer garde une copie** : son onglet « Sent » conserve les posts même supprimés du réseau. C'est sans conséquence publique.

---

**Handoff**
- Fichiers produits :
  - `docs/social/audit-s14/suppression-liste.csv` (396 lignes)
  - `docs/social/audit-s14/suppression-synthese.md`
- Aucune suppression, aucun appel Buffer, X ou LinkedIn, aucune écriture en base, aucun code modifié.
- Bloquant :
  - identifiants des tweets inconnus (archive X ou lecture Buffer à autoriser)
  - `externalId` absent de l'export (la lecture Neon a été refusée par permission)
