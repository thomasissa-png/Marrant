# Implémentation s16, lot E « textes validés » (@fullstack, 07/10/2026)

Source : `docs/copy/etalons-parcours-s16.md`, validé par Thomas (founder-preferences, 07/10). Rien en prod, pas de build, pas de commit, `playwright/`, `package.json` et CI non touchés.
Vérifs : `tsc -p tsconfig.build.json` OK ; `npm run lint` 0 erreur (1 avertissement existant, `admin/page.tsx`) ; **jest complet 243 suites, 3 534 PASS**, 0 échec (2 ignorés, déjà présents).

## Mesure du diff réel par étalon (P0 s11)
| Étalon | Statut | Où |
|---|---|---|
| 1.1 ligne sous le bouton | **Mot pour mot**, suit la formule affichée (mensuel ou annuel) ; modale et accueil = mensuel (seule formule vendue là) | `offre.ts#reassurancePaiement`, abonnement-view, register, premium-modal, premium-cta |
| 1 texte Stripe | **Mot pour mot**, seule la formule choisie. Les 2 adresses deviennent des liens Markdown (Stripe les accepte, [doc](https://docs.stripe.com/payments/checkout/customization/policies)), texte visible inchangé : le `[À VÉRIFIER]` est levé | `paiement.ts#texteStripeSubmit`, `lib/stripe.ts` |
| 2 objet 2.2 + corps A | **Mot pour mot**, 3 adaptations : « rubrique « Gérer mon abonnement » » devient « bouton « Résilier ton contrat » » (bouton réel du profil, libellé unique) ; gras non rendu (e-mail en texte brut) ; modèle légal de formulaire de rétractation (L.221-5) gardé, après la signature | `paiement.ts#emailConfirmationAbonnement` |
| 3 objet 3.2 + corps A | **Mot pour mot** ; « {{bouton : Mettre à jour ma carte}} » = lien /profil (bouton du même nom). Retirés car absents de l'étalon : lien de la facture Stripe, « ne reprends pas un nouvel abonnement » (le 409 du checkout protège) | `paiement.ts#emailPaiementRefuse`, webhook (montant `amount_due`, date `created`) |
| 4 erreurs c/b/b/b/b | **Mot pour mot** sur /login. Compte Google : écran **identique** à des identifiants faux (message c + aide b, focus mot de passe), affiché pour tout échec d'identifiants. Adapté : `TEXTES_API.tropDeTentatives` (inscription, oubli) = 4 b sans « ou réinitialise ton mot de passe » ; `OAUTH_ERRORS.Default` = erreur serveur b | `compte.ts`, `login/page.tsx` |
| 5a.2 succès non connecté | **Mot pour mot** (titre, texte, « Me connecter », « Pas encore abonné ? Voir Premium » vers /abonnement) | `TEXTES_SUCCESS`, `abonnement/success/page.tsx` |
| 5b.2 paiement annulé | **Mot pour mot** (2 lignes du même bandeau) | `offre.ts#PAIEMENT_ANNULE` |
| 5c objet 5c.3 + corps | **Mot pour mot**. Fin inconnue : objet 5c.1, « jusqu'à la fin de la période payée ». La date de la demande n'y figure plus (absente de l'étalon) | `paiement.ts#emailConfirmationResiliation` |
Aucun étalon absent.

## Champs variables (exigence de Thomas)
- **Prénom** (`firstNameFrom`, `salutation`) : premier mot seul, espaces retirés, casse et accents gardés (Marie-Hélène, Zoë, O'Neil). Repli « Salut, » si vide, adresse e-mail, chiffres, symboles, « undefined »/« null », plus de 40 caractères. Ajouté aussi à la réinitialisation et à l'accusé de rétractation (nom du compte trouvé).
- **Dates** : français, Europe/Paris, « 1er ». Fin de rétractation = souscription + 14 jours **au calendrier** (juste même au changement d'heure du 25/10). Prochain prélèvement absent : calculé (même jour, borné à la fin du mois).
- **Montants** : `formatEuros` met une **espace insécable** avant « € » sur tout le site. Montant ou formule absents : tirés de `config/premium.ts`, jamais inventés. Ligne annuelle seulement en annuel. Liens absolus, et un test vérifie que chaque page existe.
- **Garde-fou** `lib/emails/garde-fou-rendu.ts` (`problemesDeRendu`, `assertRenduPropre`) : il repère undefined, null, NaN, `{{`, `[prénom]`, les mois et jours en anglais, une date invalide ou ISO, un montant « 2.99 € », « Salut , » ou une adresse dans le salut. Branché dans les tests, dans le script d'aperçus (qui échoue au moindre défaut) et à l'envoi : l'e-mail part quand même et lève l'alerte A `email-rendu-<type>` (préfixe `email-`, digest du matin).

## Tests
Nouveau : `__tests__/lib/emails-etalons-s16-lot-e.test.ts` (60). Il couvre les 7 e-mails, chacun en (a) complet, (b) sans prénom, (c) « Marie-Hélène », plus le mot pour mot des étalons 2, 3, 5c, 1.1, Stripe, 5a.2 et 5b.2, les données manquantes, les cas de prénom, les dates, les liens et le garde-fou (à l'envoi compris). Étendus : `login-s16` (Google identique aux identifiants faux, textes exacts), `subscription-success` (5a.2), `stripe-checkout-s16`, `stripe-webhook-s16`. Mis à jour : `login`, `offre-s16-lot-c`, `register-s16`, `premium-modal`, `email-s16` (anciens tests provisoires retirés). Pour l'espace insécable : `premium-annual-display`, `annual-renewal-reminders`, `abonnement-layout-annual`, `carnet-page`, `suppression-compte-gratuit-s15`, `blog-meilleures-blagues-s14`.

## Aperçus pour Thomas
`docs/copy/apercus-emails-s16/index.html`, plus 14 rendus réels (7 e-mails × cas a et b), adresses `@example.invalid`. Ils sont générés par `apps/web/scripts/apercus-emails-s16.ts` (`npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/apercus-emails-s16.ts`).

## Hors étalons, conservé
`TEXTES_CHECKOUT` (dejaAbonne, impaye, lienProfil « Aller à mon profil ») ; `TEXTES_PORTAIL` ; `TEXTES_SUCCESS` (vérification, non vérifié, Réessayer) ; `TEXTES_RETRACTATION_FORM` ; accusé de rétractation et e-mail admin ; e-mail de réinitialisation (« ignore cet email ») ; rappel annuel (texte @legal, « Un email te confirme ») ; `TEXTES_API` (donneesInvalides, emailRequis « adresse email », nonConnecte) ; `OAUTH_ERRORS` OAuthCallback et OAuthSignin ; `lienConnexionMobile` ; `TEXTES_RESET`, `TEXTES_ABONNEMENT`, `TEXTES_SUPPRESSION` ; offre.ts (CGU_ACCEPTATION, libellés de l'annuel, « Lecture libre », etapeVerrouilleeTexte, VALIDATION_ETAPE, CARTE_VERROUILLEE_LABEL) ; `progressionParcoursLabel` ; paragraphes légaux du lot D (confidentialité §6, CGU art. 7). Les « email » sans trait d'union sont à passer au prochain étalon.

## Hors périmètre texte, corrigé
`config/blog-cta.ts` : les 12 prix « 2,99 €/mois » écrits en dur lisent maintenant `PREMIUM_PRICE_LABEL`.

## Points d'attention
1. **@qa** : 3 specs Playwright citent les anciens textes et sont à mettre à jour. `offre-abonnement.spec.ts` attend « Prix TTC · … » et « rien n'a été débité ». `connexion-retour.spec.ts` attend « Email ou mot de passe incorrect. » et « Connecte-toi pour activer ton accès ». `accessibilite.spec.ts` attend « Connecte-toi pour activer ton accès ». Une regex qui contient « 2,99 € » avec une espace simple ne correspondra plus (l'espace est maintenant insécable ; `\s` accepte les deux).
2. **Compte Google** : l'écran ne révèle plus rien, mais l'API NextAuth renvoie toujours le code `CompteGoogleSansMotDePasse` et Umami reçoit `motif: compte-google`, visibles dans les outils du navigateur. Pour une non-révélation complète, `authorize` (lot B) doit renvoyer `null` pour ces comptes. « Trop d'essais » par e-mail et le 409 de /register révèlent déjà l'existence d'un compte (lot B, connu).
3. **E-mail de résiliation** : « Tu peux te réabonner quand tu veux : /abonnement » est le texte validé, mais jusqu'à la fin de la période l'abonnement est encore actif, donc /abonnement répond par le 409 « déjà abonné » qui renvoie au profil (où se trouve la réactivation).
4. **@legal** : vérifier que l'e-mail de résiliation sans la date de la demande suffit (L.215-1-1 : date de fin et effets, présentes). Garder ou non le modèle de formulaire joint à la confirmation (gardé par prudence, L.221-5). Le `[À VALIDER @legal]` de l'étalon 2 reste ouvert.
5. **Orchestrateur** : entrée `REPLIT_ACTIONS.md` (aucune variable ni migration ; nouvelle clé d'alerte `email-rendu-*` déjà de classe A) et historique dans `project-context.md`.
