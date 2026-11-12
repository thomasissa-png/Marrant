# Tour 20, relecteur @ux (à l'aveugle) : `architecture-contenu-v20.md` (confirmation)

> Relu : `diff-v19-v20.md` (27 entrées, en entier), puis dans la v20 : 4.2 (page d'arrivée et paragraphe paiement), 7.5 e et k, section 8 (C1 à fin, étalons, connexion), section 9 (intro, E1 à E6). Le reste est identique à la v19 d'après le diff, que j'ai relue au tour 19 : pas relu à nouveau. Non vérifié : le code de `abonnement/success/page.tsx` (je m'appuie sur la citation de la v20 et du coordinateur) : [NON VÉRIFIÉ]. Le rendu visuel est renvoyé à E5.
> Les entrées du diff qui touchent les exemples (étalons E1 à E3, poêle, chargeur, formules) relèvent des relecteurs de contenu : hors de mon angle.

## 1. Mes points du tour 19

| # | Sujet | Statut | Preuve dans la v20 |
|---|---|---|---|
| N1 | Paiement fait, abonnement pas encore actif | **LEVÉ** | 4.2 (après la page d'arrivée) : déjà géré depuis s16, revérification en boucle, « Paiement reçu » seulement après preuve, message honnête et contact, jamais de redirection vers `/abonnement` ; 7.5 e : essai à confirmation retardée avec ces quatre vérifications |
| N2 | « Parcours » à 375 px | **LEVÉ** | E5 : premier parcours atteint en deux écrans au plus, à 375 px et à 200 % de texte, 3 actions principales au plus ; en cas d'échec @design réduit la carte sans changer son emplacement |
| N3 | Formulation sur la modale | **LEVÉ** | Résumé, 1.1, 4.2, annexe B : retirée en s15 pour mesurer le tunnel, décision de session, non décidée par Thomas, préférence UX du fondateur non rouverte |
| N4 | Densité d'« Aujourd'hui » | **LEVÉ** | E5 : à 375 px, premier écran = salutation et action principale ; question C9 jamais avant le premier pas fait |

Cohérence interne des retouches : section 8 (« Étalons validés », l. 171) et section 9 disent la même chose ; E4 « validé » avec réécoute par Thomas comme condition bloquante est repris à l'identique en 3.7, 7.5 k, section 8, section 9 et annexes (aucun reste de « par une personne » pour E4). « Thomas choisit entre 2 versions » ne vaut plus que pour E5 et E6.

## 2. Nouveau point (non bloquant)

**M1. Page de succès pendant l'attente de la preuve : l'état du bouton « Continuer » n'est pas dit (4.2, 7.5 e).**
Problème : le texte dit ce qu'affiche la page (message honnête, pas de « Paiement reçu ») et qu'elle ne redirige pas, mais pas si « Continuer » est déjà actif. Actif, il enverrait vers « Aujourd'hui » un compte que l'espace peut encore voir comme non abonné ; absent sans explication, l'abonné ne sait pas quoi faire (H1, H3).
Correction : ajouter à 7.5 e une vérification : « tant que la preuve manque, « Continuer » n'est pas proposé (ou est inactif avec sa raison dite en une phrase) ; il devient le bouton dominant dès « Paiement reçu » ; le lien de renonciation reste visible dans les deux états ». À confirmer contre le code de la page (le point peut déjà être couvert) : [NON VÉRIFIÉ].

## 3. Notes

| Critère | T19 | T20 | Justification |
|---|---|---|---|
| Clarté du chemin | 9,5 | 9,5 | N1 levé ; reste M1 (état de « Continuer » en attente) |
| Charge | 9,5 | 10 | Deux tests de densité inscrits à E5, avec repli sans déplacer la carte |
| Accessibilité prévue | 10 | 10 | Inchangée, rien à ajouter |
| Cohérence | 9,5 | 10 | Modale reformulée partout, étalons et condition E4 identiques dans tous les renvois |
| **Global** | **9,5** | **9,9** | |

## 4. Verdict

**N1 à N4 sont levés ; aucun bloquant.** Seule M1 est à écrire (une ligne de test en 7.5 e) avant l'essai du lot 0 ; elle ne change aucun parcours.
