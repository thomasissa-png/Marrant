# Résiliation avec motif demandé AVANT : spec UX (s23, v3, option 2, 06/11/2026)

Sources : décision de Thomas (06/11, « avant, sinon on saura jamais »), `docs/legal/resiliation-onboarding-cadre-s23.md` (partie A : A1 à A10, B1 à B7, C1 à C6), `docs/analytics/resiliations-s23-analyse.md`, code lu (`api/user/subscription/portal/route.ts`, `abonnement-card.tsx`). Le cadre @legal est une base de prudence, à valider par un avocat. **Changement v3** : la v1 mettait une page avant Stripe, la v2 la question après. Ici, NOTRE écran de confirmation remplace le portail Stripe pour résilier : la question de motif y est facultative, à côté d'un bouton toujours actif. Aucun écran n'est ajouté, un écran maison prend la place de l'écran Stripe.
Audience : Yanis (introverti, mobile le soir), Sophie (mobile, trajet), Marc (sobre, veut du concret). Ton : `docs/copy/ton-alex.md`, sans vanne. Textes PROVISOIRES, à caler avec Thomas (étalons, P0 s8).

## 1. Parcours, URL, entrées

**Parcours** : entrée -> `/resiliation` (récapitulatif + question facultative + « Confirmer la résiliation ») -> résiliation effective + e-mail -> `/resiliation/confirmee`. **2 clics** depuis n'importe quelle page (pied de page, puis « Confirmer la résiliation »), sous le plafond de 3 (A6). La page finale n'est pas un clic, c'est le résultat.
- **URL** : `/resiliation` et `/resiliation/confirmee`. `noindex`, hors sitemap, en-tête et pied de page visibles, jamais de modal, jamais d'ID ni de donnée perso dans l'URL.
- **Entrées** (toutes vers `/resiliation`, libellé unique « Résilier ton contrat », A1) : (a) pied de page, présent partout ; (b) carte abonnement du profil (`abonnement-card.tsx`), le bouton passe d'un appel au portail à un simple lien ; (c) liens « Résilier » des e-mails qui en contiennent (confirmation d'achat, rappel de renouvellement annuel : @fullstack liste les gabarits concernés).
- **Sans session** : `/resiliation` demande la connexion puis revient sur `/resiliation` (`callbackUrl`). Préférence fondateur : connexion en fenêtre par-dessus la page, en-tête et pied visibles, fermable (X, clic dehors, Échap) ; sinon `/login?callbackUrl=/resiliation`. Aucun compte à créer. **Point avocat n°2** : la connexion compte-t-elle comme un clic ou un obstacle ?
- **Portail Stripe** : gardé pour « Gérer mon abonnement », moyens de paiement, factures, changement de formule. **Plus pour résilier** : (1) retirer le parcours `resilier` du schéma de `portal/route.ts` ; (2) le repli « portail simple » de cette route permettrait encore de résilier hors de notre écran : @fullstack confirme si la résiliation peut être désactivée dans la configuration du portail Stripe (Thomas fait le réglage Stripe en mode « Accept edits »). Si impossible, la résiliation par le portail reste valable légalement mais sans question, et les deux voies émettent le même e-mail de confirmation.

## 2. L'écran `/resiliation`

Ordre vertical, une seule colonne `max-w-xl` :
1. **H1** : « Résilier ton contrat ».
2. **Récapitulatif** (D215-2, A8, tout pré-rempli, rien à retaper) : compte (prénom si connu, sinon rien, et e-mail), formule (« Premium mensuel » ou « Premium annuel »), prix TTC de la formule, **date de fin** calculée, « Jusqu'au {date}, tu gardes tout ton Premium. » et « Aucun nouveau prélèvement après. » Annuel : « Le renouvellement de {prix} n'aura pas lieu. » [À CONFIRMER avocat : mention du remboursement ou non du reste de la période]. Référence du contrat : [À DÉCIDER avec @fullstack : identifiant lisible à afficher, l'ID Stripe brut n'est pas lisible].
3. **Question facultative** : titre « Qu'est-ce qui n'a pas collé ? » avec le mot « Facultatif » collé au titre, puis « Tu peux résilier sans répondre. » Cases à cocher (plusieurs possibles), jamais pré-cochées, ordre fixe : Je voulais juste essayer ; Je n'ai pas trouvé ce que je cherchais ; Je ne savais pas par où commencer ; C'est trop cher pour moi ; Je n'ai pas le temps ; Le contenu ne me correspond pas ; Autre. Champ libre « Un mot de plus ? » (500 caractères, jamais requis, même pour « Autre »).
4. **Bouton unique** « Confirmer la résiliation » (principal, plein, toujours visible et actif : `sticky` bas de carte à toutes les tailles, jamais désactivé sauf pendant l'envoi). Libellé identique au bouton de l'accusé (B6).
5. **Lien discret** « Garder mon abonnement » (texte souligné, plus petit et plus pâle que le bouton, retour `/profil#abonnement`, sans confirmation).

**Interdits** : rétention en écran séparé, pop-up, compte à rebours, double confirmation, remise, culpabilisation (« tu vas nous manquer »), case pré-cochée, réponse requise, bouton « Rester » plus saillant, délai ou rappel avant effet (A10), tiret cadratin, concurrent nommé, chiffre inventé. Les seules phrases d'information permises sont celles du récapitulatif (« tu gardes Premium jusqu'au {date} »).

**Page finale `/resiliation/confirmee`** : H1 « C'est noté. » ; « Tu gardes Premium jusqu'au {date}. Aucun nouveau prélèvement. » ; « On t'envoie un e-mail de confirmation à {adresse}. » ; lien discret « Changer d'avis ? Réactiver mon abonnement » (portail Stripe, C5, bonne pratique) ; lien « Retour à l'accueil ». Aucune question, aucune main tendue, aucune offre. Si la page est ouverte sans résiliation en cours : redirection vers `/resiliation`.
**E-mail « C'est noté »** (accusé, C1 et C2, immédiat) : objet repris de l'étalon 5c.3 (`etalons-parcours-s16.md`), corps = date et heure de la demande, formule, date de fin du contrat, effets (accès gardé jusqu'à {date}, aucun prélèvement ensuite, ce qui s'arrête), moyen de contact, lien de réactivation. Champs variables avec repli propre (« Salut, » sans prénom).

## 3. Côté serveur (pour @fullstack)

Nouvelle route `POST /api/user/subscription/resiliation` : session, `refuserSiAutreSite`, zod `{ reasons?: string[], comment?: string(500), cle: uuid }`, limite de débit. L'écran génère `cle` au chargement.
1. Lire `Subscription` de l'utilisateur. **Stripe d'abord** : `subscriptions.update(id, { cancel_at_period_end: true }, { idempotencyKey })`, identique pour mensuel et annuel. Date de fin relue dans la réponse Stripe (le champ de période dépend de la version d'API : à vérifier), jamais recalculée.
2. **Motif ensuite, sans jamais bloquer** : `try/catch` autour de l'insertion ; en cas d'échec, log serveur, aucune erreur côté utilisateur, la résiliation reste réussie. Aucune ligne si aucune raison ni commentaire.
3. **Accusé** : e-mail « C'est noté » envoyé par cette action (immédiat, C1). Le webhook `customer.subscription.updated` actuel continue de synchroniser la base mais n'envoie plus l'e-mail s'il est déjà parti (marqueur sur l'abonnement) ; il l'envoie si la résiliation vient du portail. Un échec d'envoi n'annule rien : la page finale affiche déjà date et effets.
4. **Réponse** : `{ etat: "resilie" | "deja_resilie", dateFin, formule }`. L'écran redirige vers `/resiliation/confirmee`.

| Cas | Comportement |
|---|---|
| Double clic, rechargement, 2 onglets | Bouton inactif pendant l'envoi ; clé d'idempotence Stripe ; si `cancelAtPeriodEnd` est déjà vrai : `deja_resilie`, ni 2e appel, ni 2e e-mail, ni 2e ligne de motif (upsert) |
| Déjà résilié (écran ouvert) | « Ta résiliation est déjà enregistrée. Tu gardes Premium jusqu'au {date}. » + « Réactiver mon abonnement » ; pas de question, pas de bouton Confirmer |
| Erreur Stripe (réseau, 5xx, refus) | Message : « Ça n'a pas marché de notre côté. Ta demande est bien enregistrée : on résilie pour toi et on te le confirme par e-mail. » Le serveur envoie à l'équipe un e-mail (identifiant de compte, date et heure de la demande, code d'erreur), et à l'utilisateur un accusé « Ta demande est bien reçue, on s'en occupe » avec la date de fin attendue. Bouton « Réessayer » conservé, saisie conservée. Délai de traitement par l'équipe : [À FIXER par Thomas] |
| Aucun abonnement / Free | « Rien à résilier ici. » + retour accueil ; pas de bouton |
| Premium sans client Stripe (accès offert ou manuel, [HYPOTHÈSE : cas rare, à compter en base]) | Même parcours que l'erreur Stripe : bouton actif, demande transmise à l'équipe, accusé par e-mail. Pas de cul-de-sac |
| Abonnement App Store | Message « Ton abonnement passe par Apple, la résiliation se fait dans les réglages de ton compte Apple. » (C6, lot app) |
| Motif invalide (zod) | Les raisons inconnues sont ignorées, jamais d'erreur bloquante |

**Données** : table `CancellationFeedback` : `id`, `userId` (nullable, `onDelete: SetNull`), `reasons` (`String[]` : `essai`, `introuvable`, `depart`, `prix`, `temps`, `inadapte`, `autre`), `comment` (500, nullable), `formule` (`monthly|annual`), `tenureDays`, `createdAt`. Aucun e-mail, IP, user-agent, prix. Durée de conservation et mention de confidentialité : point avocat n°4 (B7). Aucune relance e-mail à cause du motif.
**Mesure** : dénominateur = résiliations confirmées (événement serveur, `cancel_scheduled` pour les autres voies) ; taux de réponse = lignes / résiliations. Umami : `resiliation-ecran-vu`, `resiliation-confirmee`, `resiliation-gardee`, sans motif ni donnée perso ; la base fait foi. Lecture : carte « Résiliations » dans `/admin` + bloc dans le rapport du lundi (emplacement à localiser), jamais d'alerte e-mail dédiée.

## 4. Wireframes, états

**PC (>= 1024 px)** : `main` centré, carte `max-w-xl` (576 px), en-tête et pied du site. Raisons en grille 2 colonnes (4 lignes de 48 px), champ libre sur 3 lignes, bouton sticky en bas de carte.
```
[En-tête du site]
  Résilier ton contrat                                   (H1)
  +- Récapitulatif --------------------------------+
  | Compte : prenom@mail.fr  .  Premium mensuel    |
  | Fin du contrat : 24 novembre 2026               |
  | Jusqu'à cette date, tu gardes tout ton Premium. |
  | Aucun nouveau prélèvement après.                |
  +-------------------------------------------------+
  Qu'est-ce qui n'a pas collé ?  Facultatif
  Tu peux résilier sans répondre.
  [ ] Je voulais juste essayer   [ ] C'est trop cher pour moi
  [ ] Pas trouvé ce que je cherchais  [ ] Je n'ai pas le temps
  [ ] Je ne savais pas par où commencer [ ] Contenu qui ne me correspond pas
  [ ] Autre
  Un mot de plus ? (facultatif) [ zone 3 lignes ] 0/500
  -------------------------------------------------
  [ Confirmer la résiliation ]      Garder mon abonnement
[Pied de page]
```
**Mobile (< 768, référence 375)** : même ordre, une colonne. Récapitulatif en 4 lignes courtes. Raisons = 7 lignes pleine largeur de 48 px (zone entière cliquable). Bouton « Confirmer la résiliation » **sticky bas de viewport**, pleine largeur, 48 px, fond de la page, bordure haute ; « Garder mon abonnement » juste au-dessus du bas de la carte, lien texte de 44 px de haut. Clavier ouvert : le bouton reste atteignable (marge basse safe-area). Aucun défilement horizontal.
**États** : chargement (H1 et question immédiats, récapitulatif en squelette, bouton déjà actif seulement quand la date est connue ; si la lecture échoue, bouton actif sans date : « à la fin de la période déjà payée ») ; envoi (« On résilie… », `aria-busy`, saisie conservée) ; erreur Stripe (bandeau `role="alert"` en haut de carte, §3) ; connexion lente (au-delà de 3 s : « Toujours en cours, ne ferme pas la page », sinon rien) ; déjà résilié, sans abonnement, App Store, hors ligne (« Pas de connexion. Rien n'est perdu, réessaie. ») ; retour après 30 jours (état relu, jamais de valeur en cache). **Accessibilité** : `fieldset`/`legend`, clavier complet, focus visible, cibles >= 44 px, contrastes AA, `aria-live` sur envoi et erreur, `prefers-reduced-motion`.

## 5. Critères 10/10 (relecteurs : @ux, @design, @reviewer, @legal)

1 point par ligne. **Plafond à 5** si : la question est obligatoire ; le bouton est retardé, désactivé ou conditionné à la réponse ; un écran est ajouté avant la confirmation ; rétention séparée, pop-up, culpabilisation, double confirmation ; tiret cadratin ; concurrent ; donnée inventée.
**Placement (10)** : 1 aucun écran avant `/resiliation` ; 2 pied -> confirmation en 2 clics, jamais plus de 3 ; 3 une seule confirmation (la nôtre, plus aucune étape Stripe) ; 4 entrées pied, profil et e-mails alignées sur le même libellé ; 5 sans session : connexion puis retour, en-tête et pied visibles ; 6 portail Stripe sans résiliation, ou repli documenté ; 7 page finale avec date, effets et réactivation ; 8 e-mail d'accusé immédiat, sans doublon ; 9 noindex, hors sitemap, pas d'ID dans l'URL ; 10 tous les cas de §3 ont un message.
**Fond (10)** : 1 une seule question ; 2 sept raisons maximum, ordre fixe ; 3 « Facultatif » et « Tu peux résilier sans répondre » visibles ; 4 récapitulatif exact (date, formule, prix) ; 5 effets dits clairement ; 6 aucune rétention ni culpabilisation ; 7 ton Alex ; 8 chiffres uniquement ceux déjà validés ; 9 données minimales, une table, lisible dans l'admin ; 10 la résiliation ne dépend jamais de l'enregistrement du motif.
**Design (10)** : 1 hiérarchie H1, récapitulatif, question, bouton ; 2 <= 3 actions principales (cocher, confirmer, garder) ; 3 bouton toujours visible (sticky) et plus saillant que « Garder mon abonnement », sans que celui-ci soit caché ; 4 cases >= 44 px, zone entière cliquable ; 5 mobile 375 sans défilement horizontal, clavier ouvert compris ; 6 tous les états de §4 conçus ; 7 saisie conservée en erreur ; 8 WCAG 2.2 AA ; 9 cohérence avec tokens et cartes du profil ; 10 captures 375 / 768 / 1280, états inclus, relues et notées.
**HEART** : Task success (primaire) : résiliations menées à bout sans erreur >= 90 % ; signal secondaire Engagement : taux de réponse au motif (cible à fixer après 4 semaines, [HYPOTHÈSE : aucune base de comparaison]) ; mesure serveur + base.

## 6. À faire valider par l'avocat (liste courte)

1. Notre écran de confirmation remplace-t-il valablement le récapitulatif D215-3 ? Question de motif facultative sur ce même écran : admise ? Texte de L215-1-1 et D215-1 à D215-3 à relire en entier.
2. Connexion exigée avant `/resiliation` (compte déjà existant) : compatible, et compte-t-elle dans les clics ?
3. Garantie « on résilie pour toi » en cas d'erreur Stripe : valeur de l'accusé, date d'effet retenue (celle de la demande), délai de traitement.
4. Conservation du motif, rattaché au compte, et mention dans la confidentialité.
5. Contenu minimal de l'accusé (date de fin, effets, mention du remboursement de l'annuel) et délai « immédiat ».
6. Résiliation encore possible via le portail Stripe si elle ne peut être désactivée : acceptable sans question ?

## Handoff @design puis @fullstack
Points d'attention : plafond à 5 en cas de question requise, bouton retardé ou écran ajouté ; vérifier la désactivation de la résiliation du portail Stripe, la lecture de la date de fin, le dédoublonnage de l'e-mail avec le webhook ; textes PROVISOIRES ; documenter dans `REPLIT_ACTIONS.md`.
