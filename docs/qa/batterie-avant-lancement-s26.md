# Batterie de tests avant lancement (s26, 20/11/2026)

> Demande de Thomas (19/11) : « une batterie de tests avant lancement, qu'on ne se rate pas, pour les nouveaux
> inscrits, les non-inscrits et les utilisateurs déjà inscrits ». Lancement = `ESPACE_CLIENT_PUBLIE = true` en
> production (décision de Thomas). Agent : @qa. Toutes les validations ci-dessous sont **[LIVE]** (vrai Chromium,
> Playwright, serveur Next réel) sauf mention **[STATIQUE]**.

## Verdict

**Aucun défaut bloquant le lancement.** 522 contrôles uniques (dernier passage de chaque contrôle) : 508 PASS, 12 FAIL,
2 BLOQUÉ. Sur les 12 FAIL : 4 sont la prod d'aujourd'hui (régime fermé, corrigés par l'ouverture), 2 sont l'erreur
console attendue sans Stripe, 2 sont un comportement voulu (favoris d'un ancien abonné derrière le mur Premium,
données gardées et revues au réabonnement). Les 4 FAIL restants = **3 défauts réels, mineurs, déjà présents en
production** (n°1 à 3 ci-dessous), plus 1 remarque d'expérience (n°4).

## Conditions (lire avant les résultats)

- **Préversion ouverte** http://localhost:5400 (base `marrant_preview_s25`). Son build (13 h 41) date d'avant
  `e2c4b820` : 1 fichier diffère de HEAD `78850ff1`, `components/espace/apercu/hero-apercu.tsx` (position de la
  pastille « Premium » par rapport au H1 sous 768 px dans les aperçus Quoi répondre et Bibliothèque). Écart visuel
  seulement, non rebâti ici (règle : on ne relance pas le serveur 5400).
- **Régime FERMÉ** (= la prod d'aujourd'hui) : HEAD du dépôt (interrupteur `false`) bâti en `env -i` (valeurs
  factices), servi sur 5680, base jetable copiée de la préversion. Serveur arrêté (PID), base et copie supprimées.
- **E-mails** : le faux Resend 5401 ne note que destinataire et objet. Il a été remplacé pendant la batterie par une
  version qui garde aussi le corps (même journal `emails.log`), puis l'original a été relancé.
- Navigateur : toute requête hors localhost bloquée. Le serveur n'a pas de réseau : les vignettes YouTube passées
  par `/_next/image` répondent 500 (environnement, pas un défaut).
- Connexions limitées par le site (10 par e-mail et 30 par IP sur 15 min, réussites comprises) : les clés
  `rl:%` de la base de préversion ont été purgées entre deux passages. Fin : données de test supprimées
  (comptes `batterie-*`, faux identifiants Stripe), `comptes.sh` rejoué, état vérifié (`comptes.sh --etat`).
- Largeurs : 375 et 1280 pour tous les trajets ; 375/768/1280/1920 pour 18 pages clés.
- Scripts et résultats bruts : `docs/qa/batterie-s26/` (`resultats-s26.json`). Captures : `docs/captures/s26/batterie/` (14).

## Résultats par public et trajet

| Public | Trajet (375 et 1280 sauf mention) | Statut | Ce qui a été observé |
|---|---|---|---|
| A visiteur | Accueil → menu « Quoi répondre » (aperçu) | PASS | 200, H1 « Quoi répondre », cadenas sur les rubriques Premium |
| A visiteur | Clic sur une tuile fermée | PASS | signal sur la carte d'offre, focus sur « Tout ouvrir · 1,99 €/mois » |
| A visiteur | Offre → /abonnement | PASS | `?returnTo=/mon-espace/quoi-repondre`, 1,99 € et 16,99 € affichés |
| A visiteur | /abonnement : CGU, renonciation, résiliation | PASS | liens `/cgu` et `/retractation` (200) ; « remboursable sous 14 jours », « Résiliable depuis ton profil », « Stripe » |
| A visiteur | /abonnement → S'abonner → /register | PASS | `callbackUrl` conservé (retour vers la rubrique d'origine) |
| A visiteur | /register : liens légaux | **FAIL** | seul `/cgu` ; pas de lien `/retractation` (défaut n°2) |
| A visiteur | Inscription d'un compte neuf `batterie-<horodatage>-<largeur>@preversion.test` | PASS | compte créé, session ouverte, retour sur /abonnement, paiement lancé seul (voir B) |
| A visiteur | E-mail de bienvenue | BLOQUÉ | aucun e-mail à l'inscription gratuite, **par conception** : la bienvenue Premium part du webhook Stripe |
| A visiteur | Connexion du compte neuf | PASS | arrivée `/vannes` (règle d'arrivée d'un compte sans abonnement) |
| B nouvel inscrit | Aujourd'hui, Parcours, Répartie, Quoi répondre, Bibliothèque, S'entraîner, Carnet, Favoris, Profil, La lettre, Mes questions, Mes répliques | PASS (24/24) | 200, un H1 visible, aucun débordement, aperçus avec offre |
| B nouvel inscrit | Parcours Répartie, étape 1 | PASS | ouverte : « Étape 1 gratuite, la suite avec Premium », gestes « Essayé… » actifs |
| B nouvel inscrit | La lettre : inscription puis confirmation | PASS | case de consentement obligatoire (message clair si oubliée) ; e-mail « Une dernière étape pour recevoir la lettre », 2 liens en 200 ; « Confirmer mon adresse » → « C'est bon, c'est confirmé » ; base : CONFIRMED |
| B nouvel inscrit | Déconnexion puis reconnexion | PASS | session vide après déconnexion, reconnexion → `/vannes` |
| B nouvel inscrit | Paiement : jusqu'où sans Stripe | PASS (arrêt propre) | voir « Où s'arrête le tunnel » |
| C inscrit gratuit | Connexion → arrivée | PASS | `/vannes` (identique au régime fermé) |
| C inscrit gratuit | 9 adresses de l'espace + 11 pages publiques | PASS (40/40) | aperçus en 200 avec lien vers /abonnement sur chaque rubrique ; fiche Quoi répondre → renvoi vers l'aperçu |
| C inscrit gratuit | Ses données : lettre confirmée | PASS | rien de perdu ; mais /lettre lui repropose le formulaire (défaut n°4, deux régimes) |
| C ancien abonné¹ | Espace | PASS | `/mon-espace/**` → /abonnement (règle d'avant, inchangée) |
| C ancien abonné¹ | Ses 2 favoris | PASS (conforme) | ouvert : « Mes favoris » + mur « réservés aux membres Premium » ; fermé : renvoi /abonnement ; **réabonné : les 2 favoris réapparaissent** |
| D abonne-en-cours | Connexion → arrivée | PASS | ouvert `/mon-espace` ; fermé `/vannes` |
| D abonne-en-cours | 20 adresses (espace + publiques) | PASS (40/40) | 200, un H1 visible, aucun débordement |
| D abonne-en-cours | Aujourd'hui → Reprendre → retour | PASS | `/parcours/machine-a-cafe#etape-3`, ancre trouvée, retour arrière sur Aujourd'hui |
| D abonne-en-cours | Cloche → réponse de l'équipe → lue | PASS | « 1 réponse de l'équipe non lue » → fil ouvert → « aucune réponse non lue » |
| D abonne-en-cours | Quoi répondre : liste → détail → « Oui » → « Essayé, ça a marché » → réplique → Enregistrer → Situation suivante → retour | PASS | « Enregistrée », tuile marquée « Fait », réplique listée dans Mes répliques |
| D abonne-en-cours | Question à l'équipe | PASS | confirmation visible ; e-mail équipe « Mes questions · Une question · 20/11 15:50 (Paris) » ; 2e envoi rapproché : 429 avec « Trop d'envois pour le moment… Ton texte reste dans le champ. » |
| D abonne-en-cours | Favoris : ajouter depuis /vannes, retirer depuis /favoris | PASS | 3 → 4 → 3 |
| D abonne-en-cours | Bibliothèque : liste → détail → retour | PASS | « Le faux secret », retour sur la liste |
| D abonne-en-cours | S'entraîner : réponse à une carte du jour | PASS | réponse enregistrée sans erreur |
| D abonne-en-cours | Profil → « Gérer mon abonnement »² | PASS (arrêt propre) | `/api/stripe/portal` 500 → « La gestion de ton abonnement ne répond pas. Réessaie dans un instant. » |
| D nouvel-abonne | Connexion, 20 adresses, « Commencer » (premier pas) → fiche → retour | PASS | arrivée `/mon-espace`, fiche « Amis : … », retour OK |
| D (les deux) | Régime FERMÉ : 20 adresses | PASS sauf /lettre | espace = vraie 404 (attendu) ; /lettre sans H1 (défaut n°5, prod actuelle) |
| Transverse | /login mauvais mot de passe | PASS | même message pour compte connu et inconnu (pas d'énumération) |
| Transverse | Mot de passe oublié → e-mail → nouveau mot de passe → connexion | PASS | même message si adresse inconnue ; lien `/reset-password` valide ; « C'est bon, ton nouveau mot de passe est en place » |
| Transverse | /register, 5 entrées adversariales | **FAIL** | e-mail invalide, mot de passe court, `<svg onload>` : refusés ; e-mail existant : 409 propre ; **e-mail de 10 016 caractères : compte créé** (défaut n°1) |
| Transverse | 404 visiteur, fiche et bibliothèque inexistantes (abonné) | PASS | vraie 404, H1 « Oups, cette page a oublié sa punchline » |
| Transverse | /mon-espace/questions/<inexistant> et fil d'un autre abonné | **FAIL** (mineur) | page 404 affichée, aucune donnée lue, mais statut HTTP 200 (défaut n°3) |
| Transverse | Temps de chargement, 18 pages × 4 largeurs | PASS (72/72) | médiane 161 ms, max 250 ms (serveur local : indicatif) ; 0 débordement ; 1 H1 visible partout |
| Transverse | Robots | PASS | espace, /login, /register, /favoris : `noindex` ; pages publiques : `index` ; identique au régime fermé |
| Transverse | Crawl des liens internes (abonné, gratuit, visiteur) | PASS | 3 × 220 adresses, 0 lien cassé |
| Transverse | Console et erreurs JS | PASS sauf paiement | 0 erreur JS ; seule erreur console : « [Checkout] Erreur… » quand Stripe ne répond pas (attendu ici) |

¹ `inscrit-gratuit@` transformé le temps du test en ancien abonné (abonnement CANCELED avec identifiant Stripe
factice, 2 favoris, lettre confirmée) dans les deux bases. ² Le bouton n'apparaît qu'avec un client Stripe en
base : identifiant factice posé le temps du test.

### Où s'arrête le tunnel de paiement (B) [LIVE]

Inscription → retour automatique sur `/abonnement` → `POST /api/stripe/checkout` → **500** (aucune clé Stripe ici)
→ bandeau rouge « Le paiement n'a pas pu démarrer. Réessaie dans un instant. » (capture
`B-apres-inscription-1s5-375.png`). La page de vente reste entière, bouton « S'abonner » actif, compte connecté :
**pas de page morte**. Même résultat au clic manuel (`B-paiement-toast-*.png`). Le passage vers Stripe Checkout,
le retour `/abonnement/success`, le webhook et l'ouverture de l'espace ne sont pas testables ici.

## Défauts classés

**Bloquant le lancement : aucun.**

**À corriger avant (faible coût, non bloquants, présents en prod aujourd'hui)**
1. **E-mail sans longueur maximale à l'inscription** : `apps/web/src/app/api/auth/register/route.ts` l.16,
   `z.string().email()` sans `.max()`. Un e-mail de 10 016 caractères crée un compte. Correctif : `.max(254)` côté
   API (et `maxLength` sur le champ) + test de non-régression. → @fullstack.
2. **/register sans lien vers la renonciation** (`/retractation`) : seul « CGU » y figure ; /abonnement a bien les
   deux. À faire trancher par @legal (le lien est-il exigé à cette étape ?).

**Après le lancement**
3. `/mon-espace/questions/[id]` inexistant ou appartenant à un autre abonné : page 404 affichée avec un statut 200
   (« soft 404 »). Aucune fuite de données. Rendre un vrai `notFound()`.
4. Lecteur de la lettre CONFIRMÉ et connecté : /lettre lui repropose le formulaire, /profil n'en dit rien (deux régimes).
5. Régime fermé seulement (prod actuelle) : /lettre d'un abonné sans H1 (`D-*-page-lettre-FERM-*.png`).
   **Corrigé par l'ouverture** (H1 « La lettre » et archive).
6. Info : la limite de connexion compte aussi les connexions réussies (10 par e-mail en 15 min) ; message clair.
   /register dit « Cet e-mail a déjà un compte » (choix d'expérience, /login et mot de passe oublié n'énumèrent pas).

## Non testé ici, et comment le tester le jour J

| Non testé | Pourquoi | Jour J |
|---|---|---|
| Paiement Stripe réel (Checkout, retour, webhook, bienvenue Premium, portail, résiliation, renonciation) | aucune clé | achat de test en préproduction Stripe mode test (`REPLIT_ACTIONS.md`, JOUR DU GO, B-P7 et D P-2 : aucun achat réel en prod) : compte neuf → Checkout → arrivée dans l'espace + e-mail de bienvenue → « Gérer mon abonnement » |
| Vrais e-mails (Resend) : arrivée en boîte, rendu, liens vers https://deviens-marrant.fr | faux Resend | ta vraie adresse : inscription à la lettre + mot de passe oublié ; vérifier boîte de réception (pas les indésirables) et que chaque lien ouvre la prod |
| Vidéos depuis la France (YouTube, vignettes `/_next/image`) | pas de réseau | 3 vidéos (accueil, une fiche, Aujourd'hui) sur mobile en 4G |
| Production (Cloudflare + Neon) | interdit ici | 10 min après le déploiement : `/`, `/login`, `/mon-espace` (ton compte abonné), `/mon-espace/quoi-repondre`, une fiche, `/favoris` ; aucune 500 dans les journaux Cloudflare |
| Réponse de l'équipe depuis l'admin → e-mail à l'abonné | compte admin requis | répondre à une question test depuis /admin/questions, vérifier l'e-mail reçu |
| E-mails planifiés (rappel de parcours, accueil Premium, lettre hebdo) | dépend des jours | journaux du planificateur sur 7 jours |
| Connexion Google | pas d'OAuth | un compte Google neuf, sur mobile |
| Pastille des aperçus sous 768 px (`e2c4b820`) | préversion non rebâtie | regarder Quoi répondre et Bibliothèque à 375 en visiteur |

## Check-list de lancement (Thomas)

Ordre et règles : entrée « JOUR DU GO (s24) » de `REPLIT_ACTIONS.md` (elle fait foi). Ce que cette batterie y ajoute :

1. [ ] Défaut n°1 corrigé (longueur de l'e-mail) et avis @legal sur le n°2 ; CI verte dans les deux régimes.
2. [ ] A en ligne, migrations 18 à 26 jouées (A-P3), sauvegarde de la base faite (B-P2).
3. [ ] Commit d'activation (B-P0) : `ESPACE_CLIENT_PUBLIE = true` + `ESPACE_DATE_TEXTES` ; `RESILIATION_PAGE_OUVERTE` reste `false`.
4. [ ] Après déploiement : `git show <branche déployée>:apps/web/src/config/espace-client.ts` montre `true` ; `recalcul-caps` (B-P5).
5. [ ] Achat de test Stripe en préproduction, mode test (B-P7, D P-2) : Checkout, retour dans l'espace, e-mail de bienvenue, « Gérer mon abonnement ».
6. [ ] Ton compte Premium de test à 375 px (B-P6) : Aujourd'hui, Quoi répondre (une fiche, « Fait », Situation suivante), Favoris, cloche, question à l'équipe.
7. [ ] Navigation privée (visiteur) : accueil → Quoi répondre → tuile fermée → offre → /abonnement → /register.
8. [ ] Mot de passe oublié et lettre avec ta vraie adresse : e-mails reçus, liens vers https://deviens-marrant.fr.
9. [ ] Une vidéo sur ton téléphone en 4G ; journaux Cloudflare sans 500 pendant 1 h.
10. [ ] Retour arrière prêt (section C) : `wrangler rollback <N-1>` ; aucune donnée d'abonné perdue (vérifié ici pour les favoris).
