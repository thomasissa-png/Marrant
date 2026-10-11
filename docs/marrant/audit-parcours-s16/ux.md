# Audit UX des parcours, s16 (07/10/2026)

Brief compris : noter l'expérience vécue par un visiteur, du mur Premium à l'usage de ce qu'il a payé puis à la gestion de son compte (J1 à J7, cohérence J8), à partir des captures prod du 07/10 (`docs/qa/captures-parcours-s16/`, ordinateur 1440 px et iPhone 13) et du code. Audit seul : aucun fichier modifié hors ce rapport, aucun commit.

**Note globale du domaine UX : 6/10.** Le tunnel d'achat est devenu net (7 à 8/10 : 3 écrans et 3 champs, ou 1 tap Google, puis Stripe s'ouvre seul). L'après-achat et la vie du compte sont en retrait (2 à 6/10) : page de succès trompeuse pour un visiteur non connecté, aucune échéance ni formule affichée dans le profil, aucune suppression de compte.

Personas : Yanis (20 ans, mobile, hésitant, anxieux à l'idée de payer à tort), Sophie (26 ans, pressée, veut une confirmation claire), Marc (34 ans, veut des repères et du contrôle sur son abonnement).

## 0. Évolution depuis l'audit s14 (`docs/ux/audit-tunnel-premium-s14.md`)

| Friction s14 | État au 07/10 | Preuve |
|---|---|---|
| F1 CTA payant mène à un quiz gratuit | Corrigé : CTA vers `/register` puis paiement auto | `abonnement-view.tsx:104-107`, `premium-return.ts:86-109` |
| F2 « moins qu'un café » faux | Plus visible dans les écrans lus | capture `abonnement-desktop.png` |
| F3 parcours absents de la liste | Corrigé : « Les 3 parcours en entier » en tête | `abonnement-desktop.png` |
| F4 / F17 retour à l'intention d'origine | Corrigé : `returnTo` relayé au checkout, au succès et à l'annulation | `stripe.ts:104-126`, `success/page.tsx:32-39` |
| F5 gratuit vendu comme payant | Corrigé : « Contenu quotidien » retiré | `abonnement-desktop.png` |
| F10 compte gratuit sans avantage | Sans objet (plus de compte gratuit) | brief, décision s15 |
| F14 erreur brute de paiement | Corrigé sur `/abonnement` et `/profil` | `abonnement-view.tsx:69-74`, `profil-dashboard.tsx:69,86` |
| Absence de choix annuel | Ajouté (chips Mensuel / Annuel) | `plan-selector.tsx` |

Reste ouvert de s14 : vocabulaire « Premium » contre « Accès complet » (H4), message au retour de Stripe annulé (cf. B4).

## 1. Tableau des critères

| Critère | Parcours | Note /10 | Preuve | Ce qui manque pour 10/10 | Sév. |
|---|---|---|---|---|---|
| C1. Compréhension de l'offre au mur : quoi, combien, pourquoi | J1 | 7 | `abonnement-desktop.png` : titre « Accéder aux parcours complets », sous-titre avec les 2 prix et « première étape en lecture libre », 4 avantages dont parcours en tête avec rythme (15 à 20 min/semaine). `abonnement-view.tsx:111-116`. Murs eux-mêmes (modale Premium, mur d'étape 2, bandeau vannes) non relus [À VÉRIFIER] | Un aperçu concret d'une étape 2 (titre, format) ; le « pourquoi maintenant » (ce que Yanis fait cette semaine) ; le badge « Plus qu'une étape » n'apparaît qu'aux connectés (`:159-163`) ; premier avantage long (6 lignes sur mobile) | P2 |
| C2. Étapes et champs visiteur vers Premium payé, choix de formule | J2 | 8 | Chemin : `/abonnement` (ou CTA) puis `/register` (Prénom, E-mail, Mot de passe, ou Google) puis Stripe ouvert tout seul (`auto=1`) : 3 écrans + Stripe, aucun clic intermédiaire. `register/page.tsx:179-181,297`, `abonnement-view.tsx:144-153`. Formule : chips radio accessibles (`plan-selector.tsx:34-57`), choix conservé dans l'URL | Annuel invisible tant qu'on ne clique pas : la carte n'affiche que 2,99 € par défaut, l'annuel n'est que dans le sous-titre (`abonnement-desktop.png`) ; prénom obligatoire (1 champ de trop face à Google) ; mensuel par défaut sans suggestion de l'annuel | P2 |
| C3. Réassurance près du paiement (TTC, résiliation, 14 jours, sécurité) | J2 | 6 | Présents : « Sans engagement, annulable à tout moment », bloc « Tu annules quand tu veux » avec fin de période, « Paiement sécurisé par Stripe », lien rétractation (`abonnement-view.tsx:190,219-241`). Sur `/register` seulement « annulable à tout moment » (`register/page.tsx:36-41`) | « TTC » n'apparaît nulle part (prix 2,99 € / 24,99 € seuls, `abonnement-desktop.png`) ; le remboursement 14 jours pour tous (décision actée) n'est dit nulle part près du bouton, seulement « Droit de rétractation » en lien gris 12 px ; rien côté Stripe Checkout dans le code (`stripe.ts:114-131` : pas de `custom_text`, pas de `locale`) | P1 |
| C4. Cohérence avec « pas de compte gratuit » | J1 à J5 | 8 | `/register` = « Étape 1 sur 2 » + rappel de formule ; login : « Pas encore abonné ? Créer mon compte et m'abonner » (`login/page.tsx:230-238`, `login-mobile.png`) ; header connecté sans abonnement : « Activer mon accès » (`header.tsx:99-103`) ; profil : « Aucun abonnement » ; e-mail déjà inscrit : « Connecte-toi pour reprendre ton abonnement » (`register/page.tsx:190-197`) | Résidus : badge « Premium » et « Passe Premium pour débloquer » dans le profil (`profil-dashboard.tsx:361,395`) alors que le site dit « Accès complet » ; page `/onboarding` encore en code (redirige les visiteurs vers `/abonnement`, `_log.txt` l.7) ; modale Premium et verrous non relus [À VÉRIFIER] | P2 |
| C5. Retour après paiement : confirmation, activation, « et maintenant ? » | J2 | 6 | `success/page.tsx` : sondage statut puis `verify-session`, 15 essais max, redirection vers `returnTo` ou `/parcours?premium=bienvenue` (`:29-39,98-109`). Bien pensé pour le webhook lent. Capture `abonnement_success-mobile.png` | Voir B1 : un non connecté voit « Paiement reçu ! » sans l'avoir fait ; premier contrôle après 2 s fixes même si déjà Premium (`:83-93`) ; l'écran de succès disparaît dès la redirection, le message de bienvenue sur `/parcours` n'a pas été vérifié [À VÉRIFIER] ; copie d'erreur « comme une vanne qui cherche sa chute » : ton trop léger quand on a payé et que rien ne s'active (`:130`) ; aucun e-mail ou contact de secours sur cet écran | P1 |
| C6. Connexion récurrente : accès au lien, Google, mémorisation | J3 | 7 | Formulaire clair, e-mail puis Google, erreur humaine « Email ou mot de passe incorrect. » (`login-bad-credentials-mobile.png`), `autoComplete` e-mail / mot de passe, œil 44 px (`login/page.tsx:158-190`). Google mène à accounts.google.com (`_log.txt` l.24, l.50). Avis navigateur intégré Instagram (`in-app-browser-notice`). Desktop : « Connexion » visible en haut à droite (`abonnement-desktop.png`) | Mobile : aucun « Connexion » visible dans l'en-tête, il faut ouvrir le burger (`abonnement-mobile.png`, `header.tsx:145-177,254-260`) : 2 taps pour un abonné qui revient ; durée de session non lue [À VÉRIFIER `lib/auth.ts`] ; connexion sans callback = `/vannes` (`login/page.tsx:67`) au lieu du parcours en cours (coaching) ; message identique si compte Google-only essaie un mot de passe | P2 |
| C7. Mot de passe oublié et réinitialisation | J4 | 6 | `forgot-password-mobile.png` : texte clair et ton juste ; deux états de succès ; réponse neutre « Si un compte existe… » (`forgot-password/page.tsx:51-60`). Lien cassé : `reset-password-mobile.png` + `reset-password/page.tsx:65-78` | Reset : pas d'œil afficher / masquer ni `autoComplete="new-password"` (`:114-136`), alors que login et register les ont ; erreur « Lien invalide ou expiré. Demande un nouveau lien. » affichée en texte simple sans lien vers `/forgot-password` (`:138-140`, API `reset-password/route.ts:28`) ; `Erreur serveur` brute possible ; page de lien cassé sans logo ni retour accueil (capture) ; aucun `autoComplete="email"` ni `autoFocus` sur forgot ; pas d'auto-connexion après reset | P2 |
| C8. Espace compte : statut, échéance, changer de formule | J5 | 4 | `profil-dashboard.tsx:356-416` : badge binaire « Premium » / « Aucun abonnement », une phrase, deux boutons vers le portail Stripe. `/api/user` ne renvoie ni formule ni date (`api/user/route.ts:51-68`). Profil connecté non capturé (le test était déconnecté, `profil-desktop.png` = redirection login) | Formule (mensuel ou annuel), prochaine échéance et montant, « fin d'accès le JJ/MM » si résiliation programmée, factures ; changer de formule non expliqué (dépend de la config du portail Stripe [À VÉRIFIER]) ; Marc ne sait pas quand il sera prélevé, Yanis non plus | P1 |
| C9. Résiliation | J5 | 6 | Profil, 1 bouton « Gérer mon abonnement » et 1 bouton « Résilier votre contrat », tous deux `handlePortal` (`:371-390`) : profil, portail Stripe, annulation, confirmation = 4 à 5 actions depuis l'accueil (icône profil, bouton, portail, résilier, confirmer). Conforme à l'esprit du bouton légal | Deux boutons pour la même action (confusion) ; vouvoiement « Résilier votre contrat » dans un site qui tutoie (acceptable pour le libellé légal, mais à encadrer d'une phrase tutoyée) ; pas de confirmation de ce qui reste actif après ; portail non vu (prod en lecture seule) [À VÉRIFIER] | P2 |
| C10. Suppression de compte | J5 | 2 | Aucune interface dans `profil-dashboard.tsx` ; `api/user/route.ts` n'exporte que `GET` ; aucune route `delete/account/rgpd` dans `apps/web/src/app/api` (Glob vide) | Suppression autonome (ou au minimum un lien « Écrire pour supprimer mon compte » prérempli), avertissement sur l'abonnement en cours, confirmation par e-mail. Page confidentialité non relue pour savoir si la voie e-mail est annoncée [À VÉRIFIER] | P1 |
| C11. États d'erreur et cas limites | J6 | 6 | Bien : messages de paiement humains par code (`abonnement-view.tsx:69-74`), double lancement empêché (`auto` retiré avant l'appel, `:59-66`), webhook lent couvert par `verify-session` (`success/page.tsx:57-77`), erreur de connexion lisible | Retour Stripe annulé : aucun message (B4) ; session expirée : toast sans action (B5) ; succès sans session (B1) ; carte refusée et 3DS : gérés par Stripe, non observés [À VÉRIFIER] ; impayé / renouvellement : aucun écran ni message côté site vu | P1 |
| C12. Mobile d'abord | J1 à J5 | 7 | Cibles ≥ 44 px (œil 44 px, burger et loupe `h-11 w-11`, « Retour à l'accueil » `min-h-[44px]`) ; `type="email"` et `autoComplete` corrects ; prix visible sans défiler (`abonnement-mobile.png`, titre + prix dans le 1er écran) ; CTA sur le 2e écran | CTA principal sous la ligne de flottaison après un premier avantage de 6 lignes ; pas de CTA collé en bas ; en-tête sans « Commencer » ni « Connexion » ; contrastes et clavier lus dans le code seulement (focus visibles présents) | P2 |
| C13. Cohérence visuelle et de ton site, formulaires, Stripe, e-mails | J2, J8 | 5 | Site et formulaires cohérents (violet, tutoiement, « On t'ouvre… », « On prépare ton compte… »). Stripe : aucune personnalisation dans le code (`stripe.ts:114-131`, `payment_method_types: ["card"]`). E-mails : seul `lib/emails/annual-renewal-reminder.ts` repéré, les autres non relus | Rendu Stripe réel, langue, branding et wording des reçus non vérifiables en lecture seule [À VÉRIFIER] ; cartes seules (pas d'autre moyen affiché) ; pages auth plein écran sans en-tête ni pied de page, ce qui diverge de la préférence fondateur (auth en modale, repères visibles) : compensé par « Retour à l'accueil » | P2 |
| C14. Ancien compte FREE (11 comptes) | J7 | 6 | Profil : progression, série, stats et parcours masqués, message « Les N XP que tu as gagnés sont conservés » (`profil-dashboard.tsx:146-153,397-401`) ; « Activer mon accès » dans l'en-tête ; CTA « S'abonner à 2,99 €/mois » | Rien n'explique le changement d'offre à ces 11 personnes (aucune annonce vue) [À VÉRIFIER hors code] ; bouton profil mensuel seul, sans choix annuel ni `returnTo` (`:78-93`) ; prix « 2,99 € » écrit en dur (`:411`) ; section « Prochaine étape » propose des liens bibliothèque plutôt qu'un parcours | P2 |
| C15. Santé technique perçue (console, chargement) | tous | 7 | Script `static.cloudflareinsights.com/beacon.min.js` refusé par la CSP sur toutes les pages (`_log.txt` l.1 à 16) ; 401 sur `/abonnement/success` visiteur (`:11`) ; `/register` n'atteint jamais « networkidle » (`:19`, `:45`) mais la page est rendue entièrement (`register-mobile.png`) | Aucun effet visible pour l'utilisateur sur les 3 points ; cause de la requête ouverte de `/register` non identifiée [À VÉRIFIER] ; l'analytics Cloudflare est perdue | P2 |

Moyenne : (7+8+6+8+6+7+6+4+6+2+6+7+5+6+7) / 15 = 6,1, soit **6/10**.

## 2. Audit heuristique Nielsen 10 (tunnel achat + compte)

| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | FAIL partiel | « Étape 1 sur 2 » (PASS, `register/page.tsx:179`), spinner de succès (PASS) ; mais « Paiement reçu ! » affiché sans paiement (FAIL, B1), retour Stripe annulé muet (B4), statut d'abonnement sans date (C8) |
| H2 Langage du persona | PASS | Tutoiement, « Accès complet », « Ton compte » ; seul « Résilier votre contrat » détonne |
| H3 Contrôle et annulation | PASS partiel | Lien « Retour à l'accueil », « Tu annules quand tu veux », portail de résiliation ; pas de suppression de compte |
| H4 Cohérence | FAIL partiel | « Premium » (profil) contre « Accès complet » (site) ; deux boutons identiques en résiliation |
| H5 Prévention d'erreurs | PASS | Validation par champ, double paiement évité (`auto` retiré avant l'appel), e-mail déjà inscrit redirige vers connexion |
| H6 Reconnaissance > rappel | PASS | Rappel de formule sur `/register` (`planReminder`), choix conservé dans l'URL |
| H7 Raccourcis experts | PASS | Google en 1 tap, `callbackUrl` respecté, gestionnaires de mots de passe supportés (autocomplete) |
| H8 Minimalisme | PASS | 3 champs, un seul CTA primaire par écran auth ; page `/abonnement` dense en haut (4 avantages longs) |
| H9 Messages d'erreur | FAIL partiel | Humains sur login, register, checkout ; bruts sur reset (« Erreur serveur ») et forgot (`data.error` affiché tel quel), session expirée sans action |
| H10 Aide contextuelle | PASS partiel | FAQ prix sur `/abonnement` (« 2,99 €/mois, c'est vraiment tout ? »), avis navigateur intégré ; rien sur la page de succès ni dans le profil |

## 3. Cognitive walkthrough (first-time user, parcours payant, mobile)

| Étape | Sait-il quoi faire ? Voit-il l'action ? Feedback ? | Verdict |
|---|---|---|
| Arrive sur `/abonnement` depuis un mur | Oui : titre, prix, bouton `Commencer à 2,99 €/mois` | OK |
| Choisit mensuel ou annuel | Chips visibles mais l'annuel n'affiche pas son prix avant clic | `[FRICTION H6]` à l'étape 2, le first-time user ne voit pas l'économie sans cliquer. Solution : « Annuel · 24,99 €/an » dans le chip |
| Vérifie qu'il peut annuler et être remboursé | « Annulable » oui, remboursement 14 jours non | `[FRICTION H10]` à l'étape 2, Yanis ne trouve pas la garantie de remboursement. Solution : une ligne « Remboursé sous 14 jours, sans condition » sous le bouton |
| `/register` | Étape 1 sur 2, 3 champs, Google | OK |
| Stripe s'ouvre seul | Libellé du bouton « Créer mon compte » ne dit pas « puis payer » | `[FRICTION H1]` à l'étape 4, le bouton ne dit pas qu'il mène au paiement. Solution : « Créer mon compte et payer » (la ligne « Étape 2 » sous le bouton existe mais est en 12 px gris) |
| Retour du paiement | Spinner puis redirection | OK si session valide ; sinon `[FRICTION H9]` : voir B1 |
| Retour sur annulation Stripe | Atterrit sur `/abonnement` sans explication | `[FRICTION H1]` le first-time user ne sait pas si on l'a débité. Solution : bandeau « Paiement annulé, rien n'a été débité » |
| Profil, « et mon abonnement ? » | Badge « Premium », pas de date | `[FRICTION H1]` Marc ne sait pas quand il sera prélevé. Solution : carte avec formule, échéance, statut |

## 4. Bugs et défauts constatés

**P0 : aucun** (aucun cas où l'on ne peut ni se connecter, ni payer, ni accéder à ce qui est payé, dans ce qui a pu être vu). Réserve : le cas B1 devient P0 pour un abonné dont la session se perd au retour de Stripe (navigateur intégré, 3DS dans une autre appli) : il a payé et ne peut pas activer, sans issue affichée. Probabilité non mesurée [À VÉRIFIER].

**P1**
- **B1. Page de succès trompeuse et sans issue hors session.** `success/page.tsx:111-126` affiche « Paiement reçu ! / ton accès s'active » dès le chargement, y compris pour un visiteur sans session (capture `abonnement_success-mobile.png`, 401 dans `_log.txt` l.11 et l.35). Après 15 essais (30 s) le texte devient « Ton paiement est bien reçu » (`:130`) sans qu'aucun paiement n'existe, avec « Réessayer » qui boucle (`:135-140`). Aucun lien « Se connecter » avec retour sur le succès (`session_id` conservé).
- **B2. Abonnement sans échéance ni formule dans le profil.** `profil-dashboard.tsx:356-416` et `api/user/route.ts:51-68` : ni formule, ni date de renouvellement, ni état « résilié, actif jusqu'au… ». Pour l'annuel (24,99 € prélevés une fois), l'utilisateur ne voit jamais quand il sera reprélevé (le rappel L.215-1 existe par e-mail, `lib/emails/annual-renewal-reminder.ts`).
- **B3. Pas de suppression de compte** (C10). Risque RGPD (droit à l'effacement) si la voie e-mail n'est pas affichée [À VÉRIFIER confidentialité] ; à reclasser P0 si aucune voie n'existe.
- **B4. Retour de Stripe annulé muet.** `stripe.ts:126` renvoie sur `/abonnement?upgrade=cancel` ; `abonnement-view.tsx:93-95` ne fait que mesurer. Le message « Paiement annulé » n'existe que dans `upgrade-toast.tsx:15-16`, monté seulement sur `/profil`, où ce cancel_url ne mène jamais.
- **B5. Session expirée au clic de paiement.** `abonnement-view.tsx:70,135` : toast « Reconnecte-toi » sans bouton. Le visiteur doit retrouver Connexion seul (mobile : burger).
- **B6. Remboursement 14 jours et « TTC » absents** près du bouton (C3). Décisions actées non visibles pour Yanis au moment du doute.

**P2**
- B7. Mobile : ni « Connexion » ni « Commencer » visibles dans l'en-tête (`header.tsx:145-177`). Le constat 2 du brief est un artefact de test (le bouton de l'en-tête est caché dans le burger sur mobile, d'où le timeout) ; le vrai CTA « Commencer à 2,99 €/mois » est cliquable (`abonnement-mobile.png`).
- B8. Reset de mot de passe : pas d'œil, pas d'autocomplete, erreur sans lien, `Erreur serveur` brut, lien cassé sans repère (C7).
- B9. Deux boutons identiques en résiliation, un vouvoyé (`profil-dashboard.tsx:371-390`).
- B10. Vocabulaire « Premium » dans le profil (`:361,395`) contre « Accès complet ».
- B11. `UpgradeToast` branche `success` (`upgrade-toast.tsx:11-14`) probablement morte : le succès renvoie vers `returnTo?premium=bienvenue`, pas `?upgrade=success` [À VÉRIFIER où `premium=bienvenue` est consommé].
- B12. Page succès : premier contrôle après 2 s fixes même si le webhook a déjà activé (`success/page.tsx:83-93`).
- B13. Bouton profil « S'abonner à 2,99 €/mois » en dur, mensuel seul, sans `returnTo` (`profil-dashboard.tsx:78-93,411`).
- B14. Beacon Cloudflare bloqué par la CSP sur toutes les pages (constat 3 confirmé, `_log.txt`).
- B15. Auth en pages plein écran sans en-tête/pied de page, divergence avec la préférence fondateur (modale). Choix s15 (« /register = étape 1 sur 2 ») à arbitrer par Thomas, pas un défaut en soi.

Constats de l'orchestrateur : (1) `/register` jamais idle : confirmé dans le journal, cause non trouvée, sans effet visible [À VÉRIFIER] ; (2) artefact de test sur mobile, voir B7 ; (3) confirmé ; (4) confirmé et cause d'un écran trompeur, voir B1 ; (5) confirmé (`_log.txt` l.7 à 9, l.24).

## 5. Recommandations classées par valeur pour l'utilisateur

Exemples de texte : tutoiement, sans tiret cadratin, chiffres issus de `config/premium.ts` ou décisions actées.

1. **Rendre la page de succès fiable** (B1). Sans session : « Connecte-toi pour activer ton accès » + bouton vers la connexion avec retour sur la page. Remplacer « Paiement reçu ! » par un titre vrai avant vérification (« On vérifie ton paiement ») puis « Accès activé » une fois Premium confirmé. Garder 1 écran de 2 s avec « Et maintenant ? » + 1 action (étape suivante).
2. **Carte d'abonnement lisible dans le profil** (B2) : formule, prochain prélèvement et montant, ou « Résilié, actif jusqu'au JJ/MM », lien factures. Ex. : « Accès complet, 2,99 €/mois. Prochain prélèvement le JJ/MM. » Prérequis : exposer ces champs côté API [À VÉRIFIER dans le schéma Prisma `Subscription`].
3. **Voie de suppression de compte** (B3) : bouton « Supprimer mon compte » avec rappel « Ton abonnement sera résilié » et confirmation, ou à défaut lien e-mail prérempli annoncé dans le profil.
4. **Message au retour d'un paiement annulé** (B4) : « Paiement annulé, rien n'a été débité. Tu peux reprendre quand tu veux. » + bouton de reprise.
5. **Réassurance au point de décision** (B6) : sous le bouton `/abonnement`, `/register` et dans `custom_text` Stripe : « Prix TTC. Remboursé sous 14 jours, sans condition. Annulable à tout moment. » [À VÉRIFIER avec le juridique avant mise en ligne]. Libellé du bouton d'inscription : « Créer mon compte et payer ».
6. **Session expirée récupérable** (B5) : toast avec action « Me reconnecter » qui repart sur `/abonnement` avec `auto=1`.
7. **Reset de mot de passe finition** (B8) : œil + autocomplete, lien « Demander un nouveau lien » dans l'erreur, repère accueil sur la page de lien cassé, auto-connexion après reset.
8. **Mobile** (B7) : « Connexion » en texte dans l'en-tête mobile (à côté du burger) ou lien « J'ai déjà un compte » dans le menu en tête ; CTA du premier écran raccourci (1er avantage en 2 lignes).
9. **Un seul vocabulaire et une seule action de résiliation** (B9, B10) : « Accès complet » partout, un bouton « Gérer ou résilier mon abonnement », phrase légale tutoyée à côté.
10. **Annuel découvrable** (C2) : chip « Annuel · 24,99 €/an » avec « plus de 3 mois offerts » (formule actée).
11. **Anciens comptes FREE** (C14) : une phrase dans le profil et un e-mail d'explication (brouillon, règle projet), bouton d'abonnement avec choix mensuel / annuel.
12. **Hygiène technique** (B14, B11, B12) : CSP pour le beacon ou suppression du script, nettoyage du toast mort, contrôle immédiat du statut sur la page de succès.

Mesure (HEART) : Task success = conversion `/register` vers `abonnement-reussi` (Umami `inscription-envoi`, `inscription-reussie`, `abonnement-clic`, `abonnement-reussi`, `abonnement-annule`), cible ≥ 90 % de complétion une fois Stripe ouvert ; Happiness = question facultative sur la page de succès (cible ≥ 8/10). Pas d'événement vu pour « profil, ouverture du portail » ni « suppression » : à ajouter.

## 6. Ce que je n'ai pas pu vérifier

- Stripe Checkout (rendu, langue, 3DS, carte refusée, reçus, wallets) : prod en lecture seule, aucune session créée [À VÉRIFIER].
- Portail Stripe (résiliation, changement de formule, factures) : non ouvert [À VÉRIFIER].
- Profil et favoris connectés : aucune capture authentifiée (`profil-desktop.png` = redirection login), donc rendu réel du profil Premium et FREE jugé sur le code.
- Mur d'étape 2, modale Premium, bandeaux vannes, destination `/parcours?premium=bienvenue` : non relus (budget de lecture), à couvrir dans la passe suivante [À VÉRIFIER].
- E-mails transactionnels (bienvenue, confirmation, reçu, reset, rappel annuel) : contenu non relu, seul le fichier du rappel annuel repéré [À VÉRIFIER, J8].
- Durée de session NextAuth, flux Google complet jusqu'au retour, comptes Google-only et mot de passe oublié.
- Accessibilité WCAG 2.2 AA : clavier, contrastes et lecteur d'écran jugés dans le code, non testés.
- Cause de la requête ouverte sur `/register` ; page de confidentialité (voie d'effacement) ; communication faite aux 11 anciens comptes FREE ; J9 appli mobile (hors périmètre de cette lecture).

## Handoff

**Handoff vers @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/marrant/audit-parcours-s16/ux.md`.
- Décisions prises : note globale 6/10 ; aucun P0 sur ce qui a été vu ; 6 P1 (B1 à B6), le plus urgent B1 (page de succès) ; B15 (auth en pages pleines) laissé à l'arbitrage de Thomas.
- Points d'attention : B1 peut devenir P0 selon la fréquence des sessions perdues au retour de Stripe ; B3 devient P0 si aucune voie d'effacement n'est annoncée ; textes de réassurance (TTC, 14 jours) à valider côté juridique ; passe complémentaire nécessaire sur murs, e-mails et profil authentifié.
