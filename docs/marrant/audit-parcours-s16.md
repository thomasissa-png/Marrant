# Audit des parcours utilisateurs (s16, 07/10/2026)

> Demande de Thomas : connexion, achat, compte. « S'assurer que tout fonctionne. Une note sur dix pour tout. On décide ensuite ensemble. »
> 7 audits en parallèle, prod testée en lecture seule (aucun compte créé, aucun paiement, aucun e-mail envoyé). Rapports détaillés : `docs/marrant/audit-parcours-s16/{ux,fullstack,qa,infrastructure,legal,copywriter,data-analyst}.md`. Captures : `docs/qa/captures-parcours-s16/`.
> Les constats graves ont été revérifiés dans le code par l'orchestrateur (rétractation, remboursement, carte refusée, liaison Google, suppression de compte, paiement perdu).

## 1. Note globale : 5,6/10

Le chemin « normal » marche bien : un visiteur voit l'offre, crée son compte, paie, et devient Premium (l'accès est bien protégé). Ce qui est faible : **tout ce qui se passe quand quelque chose tourne mal**, **la vie du compte après l'achat**, **les e-mails**, **les obligations légales** et **le fait que personne n'est prévenu en cas de panne**.

Fait marquant : **aucun achat n'a eu lieu aux prix actuels** (2,99 € et 24,99 €). Le dernier achat réussi date du 14/08, aucun compte créé depuis le 05/10. Le tunnel est donc vérifié dans le code et par les tests, **jamais par un vrai paiement**.

## 2. Notes par parcours

| Parcours | Note | En une phrase |
|---|---|---|
| Découverte puis blocage « réservé Premium » | **7** | Les limites marchent (10 vannes, 3 conseils, 3 vidéos, étape 2 fermée) et mènent bien vers l'offre. |
| Achat (offre, compte, paiement, retour) | **5** | Peu d'étapes et clair, mais ni « TTC » ni « remboursé 14 jours » près du bouton, pas d'e-mail de confirmation, et jamais testé avec un vrai paiement. |
| Connexion (e-mail, Google) | **7** | Fonctionne, redirections sûres ; mais un compte peut être pris via Google, et la limite d'essais de mot de passe ne tient pas. |
| Mot de passe oublié | **5** | Fonctionne, mais le lien secret part dans les statistiques, et si l'e-mail n'est pas envoyé personne ne le sait. |
| Espace compte (profil, résiliation, suppression) | **4** | Pas de formule ni de date de prélèvement affichées, impossible de passer au mensuel ou à l'annuel, **aucune suppression de compte**. |
| Quand ça se passe mal (carte refusée, remboursement, annulation) | **3** | Carte refusée = Premium coupé tout de suite et risque de double prélèvement ; un remboursement laisse l'abonnement tourner chez Stripe. |
| Les 11 anciens comptes gratuits | **7** | Ils voient le site comme un visiteur, sans casse. |
| E-mails envoyés aux clients | **2** | Seulement 2 e-mails existent (mot de passe oublié, rappel avant renouvellement annuel). Ni bienvenue, ni confirmation, ni échec de paiement, ni résiliation. |
| Appli mobile | non notée | Pas en service (rien publié sur les stores). |

## 3. Notes par domaine (agents)

| Domaine | Agent | Note |
|---|---|---|
| Tests réels sur le site (vitesse, erreurs, accessibilité) | @qa | **7,3** |
| Textes (boutons, erreurs, e-mails) | @copywriter | **6,3** |
| Expérience vécue | @ux | **6** |
| Fonctionnement technique | @fullstack | **6** |
| Fiabilité en production (Stripe, e-mails, serveur) | @infrastructure | **5,9** |
| Être prévenu et pouvoir mesurer | @data-analyst | **4,5** |
| Conformité légale de la vente | @legal | **3** |

Bonnes nouvelles vérifiées : Stripe et la base concordent exactement (2 abonnés actifs) ; la prod tourne sur la dernière version du code ; les pages s'affichent en moins de 1,6 s ; 278 tests automatiques passent ; aucune redirection piégée possible ; les 5 textes de référence validés le 06/10 sont en place mot pour mot.

Fausses alertes écartées : la page d'inscription charge normalement (1,4 à 4 s) ; le bouton d'abonnement sur mobile fonctionne ; les statistiques ne sont pas cassées (voir reco 17).

## 4. Recommandations, sans jargon, par valeur pour le client

### A. Protéger l'argent et la confiance des clients (le plus urgent)

1. **Faire un vrai achat de bout en bout**, par toi, avec ta carte, puis te rembourser. C'est la seule preuve que tout marche aux prix actuels. *(Décision D1)*
2. **Quand on rembourse, arrêter aussi l'abonnement chez Stripe.** Aujourd'hui le site retire Premium mais Stripe continue de prélever le mois suivant. *(Question D2 : quand tu rembourses, résilies-tu aussi à la main ?)*
3. **Carte refusée au renouvellement : ne pas couper Premium tout de suite.** Stripe réessaie pendant quelques jours ; pendant ce temps, prévenir le client par e-mail et lui permettre de changer sa carte. Aujourd'hui il perd l'accès, ne peut plus changer sa carte, et le site lui propose de se réabonner, ce qui peut créer **un double prélèvement**. Bloquer aussi tout second abonnement.
4. **Faire vraiment marcher le formulaire de rétractation.** Aujourd'hui il affiche « Un email de confirmation sera envoyé » mais n'envoie rien et n'enregistre rien.
5. **Permettre de supprimer son compte depuis le profil** (ce que promettent les CGU et la page confidentialité), en arrêtant l'abonnement au passage.
6. **Ne plus jamais « perdre » un paiement** : si l'activation de Premium échoue après un paiement, le site doit pouvoir réessayer et te prévenir, au lieu de considérer l'affaire classée.
7. **Page « Paiement reçu ! »** : ne l'afficher qu'après un vrai paiement. Aujourd'hui n'importe qui y voit « Paiement reçu » pendant 40 secondes, sans lien pour se connecter.

### B. Être prévenu quand ça casse

8. **Ajouter à ton e-mail quotidien (un seul par jour, comme décidé) des alertes** quand un paiement, un e-mail ou une connexion Google échoue, et quand Stripe et le site ne sont plus d'accord. Aujourd'hui il n'existe aucune alerte de ce type : la panne Stripe du 01 au 05/10 a été trouvée à la main.

### C. Rassurer et informer au moment d'acheter

9. **Écrire « TTC », « remboursé sous 14 jours » et « résiliable en ligne » juste à côté du bouton de paiement et sur la page Stripe**, avec un lien vers les CGU que le client accepte.
10. **Créer les e-mails manquants** : confirmation d'abonnement (obligatoire, avec les CGV et le formulaire de rétractation), bienvenue, échec de paiement, confirmation de résiliation.
11. **Dans le profil, afficher la formule, la date du prochain prélèvement, jusqu'à quand l'accès reste ouvert après résiliation**, et permettre de passer du mensuel à l'annuel.
12. **Si le client annule sur la page de paiement**, lui afficher un message clair à son retour (aujourd'hui : rien).

### D. Sécurité des comptes

13. **Ne plus rattacher automatiquement un compte Google à un compte existant** tant que l'adresse e-mail n'a pas été prouvée. Aujourd'hui quelqu'un pourrait, en théorie, prendre un compte de cette façon.
14. **Limiter vraiment les tentatives de mot de passe** (la limite actuelle se contourne sur notre hébergement).
15. **Ne plus envoyer le lien de réinitialisation aux statistiques**, et le stocker de façon illisible en base.

### E. Textes

16. Retirer les restes de l'ancienne offre gratuite (badge « Essai gratuit » sur l'étape 1, « ton compte repasse en gratuit » dans l'e-mail annuel), rendre humains les messages d'erreur (« Erreur serveur », « Données invalides »), distinguer « trop d'essais » et « compte créé avec Google » de « mot de passe incorrect », tutoyer partout, signer les e-mails « L'Équipe Deviens Marrant ». Toute réécriture sera calibrée avec toi avant (règle des étalons).

### F. Mesurer le tunnel

17. **Compter chaque étape** : aujourd'hui le clic d'un visiteur vers l'abonnement, la vue d'un blocage Premium et les échecs ne sont pas comptés (seul le clic d'un membre déjà connecté l'est). Ajouter les chiffres du tunnel (visites de l'offre, comptes créés, paiements, résiliations, revenus du mois) au rapport du lundi.

### G. Mentions légales (ont besoin de tes informations)

18. Mettre à jour les mentions légales (forme juridique, SIREN, n° de TVA, adresse, hébergeur Cloudflare et non plus Replit), ajouter le médiateur de la consommation, mettre à jour la politique de confidentialité (datée de mars, cite Replit, parle d'un bandeau cookies qui n'existe pas), retirer la clause « tribunaux de Paris exclusifs » qui ne vaut pas contre un particulier.

### H. Finitions

19. Couper le script Cloudflare bloqué (bruit inutile), corriger 4 défauts d'accessibilité (contraste des cartes verrouillées, etc.), garder le curseur dans le formulaire après une connexion ratée, lien « Connexion » visible sur mobile sans ouvrir le menu.
20. **Tests automatiques des parcours complets** (création de compte, paiement, résiliation) avec un environnement Stripe de test, pour ne plus dépendre d'un achat réel à chaque changement. *(Décision D7)*

## 5. Décisions à prendre ensemble

| # | Question | Reco par défaut |
|---|---|---|
| D1 | Fais-tu un achat réel (puis remboursement) pour valider le tunnel ? | Oui, après les correctifs A2 et A3 |
| D2 | Quand tu rembourses aujourd'hui, résilies-tu aussi l'abonnement dans Stripe ? | À me dire (sinon risque de re-prélèvement) |
| D3 | Infos légales : forme juridique, SIREN, n° de TVA, adresse, médiateur choisi | Tu me les donnes, j'intègre |
| D4 | Un seul nom pour l'offre : « Premium » ou « accès complet » ? | « Premium » |
| D5 | Annuel : « plus de 3 mois offerts », « 10,89 € économisés », ou les deux ? | Les deux |
| D6 | Pages légales et bouton de résiliation : passer au tutoiement ? | Oui, sauf mentions imposées |
| D7 | Créer un environnement Stripe de test et un compte de test Premium ? | Oui |
| D8 | Appli mobile : hors sujet pour l'instant (CGV mobile obsolètes, rien publié) ? | Oui, à reprendre au lancement mobile |

## 6. Non vérifié (et pourquoi)

Page de paiement Stripe et portail Stripe en vrai (pas de paiement en prod) ; profil d'un abonné connecté (pas de compte de test) ; délivrabilité réelle des e-mails (clé Resend en envoi seul ; DMARC en mode « surveillance seule ») ; sauvegardes de la base et règles Cloudflare (droits manquants) ; connexion Google complète.
