# Alléger le tunnel d'achat : ce qui est obligatoire, utile, superflu (s26, 22/11/2026)

> Draft de référence, pas un avis juridique : à faire confirmer par un avocat. Textes lus via sources secondaires et pages officielles (economie.gouv.fr, service-public, CNIL), pas via la version consolidée Légifrance : numéros d'articles à revérifier avant citation. Aucun code modifié.

## Risques en 5 points
1. **Le moment qui engage est chez Stripe, pas chez nous.** Le bouton « S'abonner » de Stripe + son texte (« commande avec obligation de paiement », prix, renouvellement, 14 jours, lien /retractation, CGU) porte l'essentiel de l'obligatoire. Nos écrans peuvent donc être légers.
2. **/abonnement et /register ne sont pas l'écran de commande** pour un visiteur : le bouton « S'abonner · 1,99 €/mois » mène au compte, puis à Stripe. L'obligation de paiement (L221-14) ne s'y joue pas.
3. **Rien d'obligatoire ne s'oppose à tout regrouper sous le bouton**, sauf deux choses à ne pas perdre : l'information sur la newsletter (au moment de la collecte) et un accès à la confidentialité depuis /register (aujourd'hui absent, voir tableau).
4. **Le lien « Renoncer au contrat ici » n'est pas exigé sur ces deux écrans** (fonction exigée sur l'interface pendant tout le délai : pied de page, profil, « Paiement reçu » la couvrent). Le déplacer à côté de la phrase des 14 jours est sans risque.
5. **Un point faible réel, à lisser** : la newsletter envoyée dès l'inscription (voir ligne 9 du tableau).

## 1. Tableau : mention x écran actuel x statut x source

| # | Mention actuelle | Écran actuel | Statut | Source / commentaire |
|---|---|---|---|---|
| 1 | Prix TTC et renouvellement (cartes « TTC / mois », « TTC / an », « Renouvelé chaque année, sauf résiliation ») | /abonnement (cartes) ; /register (rappel sous le titre) | **OBLIGATOIRE avant le paiement** : le prix TTC et la reconduction doivent être clairs avant l'engagement. Satisfait à Stripe (texte du bouton). Sur nos écrans : **on garde la carte et la ligne annuelle** (zéro ligne en plus, déjà dans la carte) | L221-5 / L111-1 (info précontractuelle), L112-1 (prix TTC), L221-14. Stripe : `texteStripeSubmit` |
| 2 | « Premier paiement remboursable sous 14 jours » | /abonnement, /register, fenêtres Premium, murs (REASS) | **Utile** (promesse commerciale + mise à plat de la rétractation). Obligatoire **ailleurs** : Stripe + e-mail de confirmation + /retractation | L221-5 (délai et modalités), L221-13 (confirmation durable). Le site rembourse sans invoquer L221-28 13° : plus généreux que la loi, donc la promesse doit rester exacte |
| 3 | Lien « Renoncer au contrat ici » | /register (ligne seule, entre CGU et lettre) ; pied de page ; profil ; « Paiement reçu » | **Obligatoire ailleurs** (interface, tout le délai : pied, profil, confirmation). **Utile** sur /register et /abonnement | Directive (UE) 2023/2673 (fonction de rétractation, applicable depuis le 19/06/2026), formule « renoncer au contrat ici » (economie.gouv.fr). Avis s26 : non requis sur /register |
| 4 | « Résiliable depuis ton profil » | /abonnement, /register (REASS) | **Utile**. Obligatoire **ailleurs** : fonction de résiliation en ligne gratuite, bouton « Résilier ton contrat » (profil), texte Stripe, e-mail de confirmation | L215-1-1 + D215-1 (résiliation en ligne, 3 clics) |
| 5 | « D'abord ton compte, puis le paiement sur Stripe. » | /abonnement (visiteur) | **Utile** (le bouton « S'abonner » ne paie pas tout de suite : évite l'effet de surprise). « sur Stripe » superflu | Loyauté de l'information (pratique commerciale trompeuse L121-1 si l'étape suivante était cachée) |
| 6 | « Paiement sécurisé par Stripe » | /register ; /abonnement (connecté) | **Superflu** (réassurance). Le nom du prestataire est déjà dans la confidentialité et sur la page Stripe | Aucun texte ne l'impose ici |
| 7 | « Premium : » en tête de phrase de REASS | partout | **Superflu** (le nom de l'offre est juste au-dessus) | Choix éditorial |
| 8 | « En créant ton compte, tu acceptes les CGU. » | /register (sous Google) | **Utile ici** (contrat de compte). L'acceptation qui compte pour le payant est chez Stripe (« En payant, tu acceptes les CGU »). Une mention avec lien suffit, pas de case | Opposabilité des CGU : accès avant la conclusion + acceptation. Case à cocher non exigée |
| 9 | « Tu recevras aussi la lettre du mois, une fois par mois. Désinscription en un clic. » | /register | **OBLIGATOIRE ici si on envoie la lettre dès l'inscription** : information + opposition simple au moment de la collecte. Réserve : l'exception « clients » (soft opt-in) suppose des coordonnées recueillies **lors d'une vente** ; un compte créé puis paiement abandonné n'est pas encore un client. Le lien de désinscription dans chaque lettre est, lui, obligatoire | L34-5 CPCE, CNIL (prospection par e-mail). **Mitigation** : n'envoyer la lettre qu'aux comptes ayant payé, ou la présenter comme faisant partie du service (non promotionnelle), à valider par l'avocat. Décision fondateur du 25/10 : mention conservée |
| 10 | Lien vers la politique de confidentialité | **ABSENT** de /register (groupe `(auth)` sans pied de page) | **OBLIGATOIRE** : information RGPD au moment de la collecte de l'e-mail (lien suffit) | RGPD art. 13. Page existante : `/confidentialite` |
| 11 | « Email » | /register (libellé) | Typographie : « E-mail » (déjà utilisé ailleurs sur le site) | Cohérence éditoriale |
| 12 | Texte Stripe complet (obligation de paiement, prix, renouvellement, 14 jours + lien, résiliation, CGU) | Stripe Checkout | **OBLIGATOIRE, déjà en place**. Ne pas dupliquer sur nos écrans | L221-14, L221-5, L215-1. Réserve avocat : « S'abonner » seul sur le bouton Stripe est-il « formule analogue » à « commande avec obligation de paiement » ? Le texte adjacent comble, mais la CJUE (C-249/21) juge sur la mention du bouton |

## 2. Versions cibles exactes

Règle appliquée : formulaire d'un seul tenant (Google, champs, bouton), toutes les mentions sous le bouton principal, petit, deux lignes. Zéro tiret cadratin.

### /register

Ordre à l'écran :
1. Logo, titre « Ton compte, puis le paiement », rappel d'offre (inchangés, y compris « Premium, 16,99 €/an, renouvelé chaque année, sauf résiliation. » en annuel).
2. Bouton « Continuer avec Google ».
3. Champ **E-mail** (placeholder inchangé), champ Mot de passe (+ « Au moins 8 caractères »).
4. Bouton « Créer mon compte et passer au paiement ».
5. Sous le bouton, en petit, centré :

> Premier paiement remboursable sous 14 jours : [Renoncer au contrat ici](/retractation). Résiliable depuis ton profil.
> En créant ton compte, tu acceptes les [CGU](/cgu) (et la [confidentialité](/confidentialite)). Tu recevras aussi la lettre du mois, une fois par mois, désinscription en un clic.

6. « Déjà un compte ? Connecte-toi » (inchangé).

Retraits sur /register : le bloc CGU entre Google et les champs, la ligne seule « Renoncer au contrat ici », la ligne lettre du mois, « Paiement sécurisé par Stripe. », « Premium : » en tête. Ajout : lien confidentialité (ligne 10, obligatoire). Variante plus courte si le fondateur veut une seule phrase CGU : « En créant ton compte, tu acceptes les CGU et la confidentialité. » + phrase lettre.

### /abonnement

Visiteur, sous le bouton « S'abonner · 1,99 €/mois » (ou 16,99 €/an), en petit, centré :

> Premier paiement remboursable sous 14 jours : [Renoncer au contrat ici](/retractation). Résiliable depuis ton profil.
> D'abord ton compte, puis le paiement.

Connecté (le bouton ouvre Stripe) :

> Premier paiement remboursable sous 14 jours : [Renoncer au contrat ici](/retractation). Résiliable depuis ton profil.

Inchangé : les cartes de formule (« TTC / mois », « TTC / an », « Renouvelé chaque année, sauf résiliation. »), « Déjà un compte ? Connecte-toi ».
Retraits : « Premium : » en tête, « sur Stripe », « Paiement sécurisé par Stripe » (connecté).

### Notes d'implémentation (pour @fullstack, après accord du fondateur)
- `REASSURANCE_UNIQUE` : passer à « Premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » pour les murs, fenêtres et fiches (sans lien, le pied de page porte déjà la fonction). Créer une variante avec lien pour /abonnement et /register seulement : le lien ne se répète pas sous chaque bouton du site.
- `LETTRE_MOIS_INSCRIPTION_COMPTE`, `CGU_ACCEPTATION` et la REASS se rendent dans le même `<p>` sous le bouton ; les tests `register-cgu`, `register-retractation`, `register-lettre-mois`, `register-reassurance`, `register-stripe` sont à adapter. Cible tactile 44 px à conserver pour les liens.
- Le libellé « Renoncer au contrat ici » reste la constante `LIBELLE_RENONCER_CONTRAT` (formule officielle).
- Tout texte changé : à relire à l'aveugle (règle d'or s18) avant mise en ligne, et noté dans `REPLIT_ACTIONS.md`.

## 3. Ce qu'il ne faut SURTOUT pas retirer
1. **Le texte du bouton Stripe** (obligation de paiement, prix, renouvellement, 14 jours + /retractation, CGU) et le **prix TTC + renouvellement annuel dans les cartes** : c'est le cœur de L221-14 et de l'information précontractuelle.
2. **La fonction « Renoncer au contrat ici »** en pied de page, profil et « Paiement reçu » (et le formulaire type dans l'e-mail de confirmation, L221-13) ; le bouton « Résilier ton contrat » du profil (L215-1-1).
3. **L'information sur la lettre (opposition simple à la collecte) et un lien confidentialité sur /register** : ce sont les deux seuls obligatoires qui pèsent sur l'écran d'inscription.

## À faire valider par un avocat
- « S'abonner » sur le bouton Stripe comme formule analogue à « commande avec obligation de paiement » (CJUE C-249/21).
- Lettre du mois envoyée aux comptes non payants : soft opt-in applicable ou non (ligne 9).
- Numéros et contenu exacts de L221-5 (7°), des textes sur la fonction de rétractation (ordonnance du 5 janvier 2026 et décret) et de L215-1-1 dans leur version en vigueur.

## Sources
- [economie.gouv.fr, droit de rétractation à distance (fonction « renoncer au contrat ici », 19/06/2026)](https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/vente-distance-tout-savoir-sur-votre-droit-de-retractation)
- [Que Choisir, bouton de rétractation obligatoire](https://www.quechoisir.org/actualite-achats-en-ligne-les-sites-doivent-desormais-proposer-un-bouton-de-retractation-n177246/)
- [CNIL, communications électroniques (clients et prospects, L34-5 CPCE)](https://www.cnil.fr/fr/communication-electronique-quelles-regles)
- [Service-public, résiliation en ligne des contrats (L215-1-1)](https://entreprendre.service-public.gouv.fr/actualites/A16599?lang=fr)
- [Justice.fr, achat à distance et mention d'obligation de paiement (L221-14)](https://www.justice.fr/fiche/achat-distance-conclusion-contrat)
- Internes : `docs/legal/retractation-register-s26.md`, `apps/web/src/config/textes/{paiement,offre,abonnement-vente,cta-pages}.ts`, `register/page.tsx`, `components/premium/abonnement-view.tsx`.
