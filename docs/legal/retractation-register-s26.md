# Lien /retractation sur /register : requis ? (s26, 20/11/2026)

> Draft de référence, pas un avis juridique : à faire confirmer par un avocat. Source de la batterie : `docs/qa/batterie-avant-lancement-s26.md`, défaut n°2. Textes de loi non lus en entier (extraits economie.gouv.fr, CCI Paris, avocats) : même réserve que `docs/legal/retractation-conformite-s23.md`.

## Risques en 5 points
1. **Verdict : non requis sur /register (risque faible) ; recommandé (coût minime).**
2. /register n'est pas un compte gratuit isolé : titre « Ton compte, puis le paiement », bouton « Créer mon compte et passer au paiement », Stripe s'ouvre seul après la création (`register/page.tsx`, `cta-pages.ts`). C'est l'étape 1 sur 2 du tunnel.
3. Il porte déjà la promesse « Premium : premier paiement remboursable sous 14 jours » (`REASSURANCE_UNIQUE`), sans lien. Il est dans le groupe `(auth)` : pas de pied de page, donc pas de « Renoncer au contrat ici ».
4. Le contrat payant se conclut au clic « S'abonner » sur Stripe, où le texte (`texteStripeSubmit`) donne les 14 jours + lien /retractation + CGU. Confirmation après conclusion : e-mail avec bloc rétractation et formulaire type (`blocConfirmation`, L.221-13).
5. Aucun choix fondateur touché : pas de bouton de conversion modifié, aucun texte nouveau.

## Fondement
- **L.221-5** : information précontractuelle (dont, depuis le 19/06/2026, existence et emplacement de la fonction de rétractation, 7° selon un commentaire d'avocat) donnée AVANT d'être lié. Le moment décisif est l'obligation de paiement (L.221-14) : Stripe (+ /abonnement et pied de page). Un compte sans paiement ne fait naître ni prix ni remboursement.
- **L.221-13** : confirmation sur support durable après conclusion : e-mail de bienvenue/confirmation, en place. Rien à faire sur /register.
- **L.221-28 13°** (contenu numérique, exécution commencée + renoncement exprès) : NON invoqué sur le site (pas de case de renoncement, choix du 04/10 ; audit s23). Le droit de rétractation reste entier et le remboursement est offert 14 jours. Ne pas confondre : « Renoncer au contrat ici » est la formule de la fonction D.221-5, pas la renonciation de L.221-28.
- **Pratique** : l'utilisateur peut arriver sur /register sans passer par /abonnement (fenêtre Premium, « D'abord ton compte, puis le paiement »). Il y lit une promesse de remboursement dont il ne trouve ni les modalités ni le formulaire. Risque de pratique commerciale trompeuse faible, mais réel si la page est vue seule.

## Action proposée (@fullstack, après accord de Thomas)
Ajouter sous la mention des CGU (`data-testid="register-cgu"`, `register/page.tsx` l.306-312) un lien vers `/retractation` dont le libellé est le texte EXISTANT `LIBELLE_RENONCER_CONTRAT` = « Renoncer au contrat ici » (`config/textes/paiement.ts`), déjà utilisé dans le pied, la carte abonnement et « Paiement reçu ». Même style discret que le lien CGU. Pas de phrase d'introduction.
- Variante si Thomas veut une phrase : `[TEXTE À VALIDER]` « Premier paiement remboursable sous 14 jours : Renoncer au contrat ici. » (reprend la REASS existante + le libellé légal ; à faire valider par l'avocat).
- Test : étendre le test de la page /register (lien présent, 200) ; consigner dans `REPLIT_ACTIONS.md` ; build + CI verte.

## À faire valider par un avocat
- Suffisance du pied de page + Stripe + e-mail sans lien sur /register (conclusion du contrat au paiement, pas à l'inscription).
- Contenu exact de L.221-5 7° (existence et emplacement de la fonction) dans sa version en vigueur.
