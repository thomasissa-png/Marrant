# Brouillon : e-mail aux 11 comptes FREE existants (s15, 06/10/2026)

> **BROUILLON : NE PAS ENVOYER sans GO explicite de Thomas** (règle commune 10). Aucun envoi programmé, aucun code d'envoi écrit.
> Texte : étalon 5.2 validé par Thomas le 06/10 (`docs/copy/etalons-chemin-premium-s15.md`), plus la phrase de suppression demandée par Thomas (« réponds à ce message pour supprimer ton compte »), formulée « Si tu préfères supprimer ton compte, réponds simplement à ce message. ».
> Faits garantis par le code livré (spec §1.2, défaut A) : aucun compte supprimé, XP, progression, réactions et votes conservés en base ; suivi (XP, série, étapes validées) et vote sur les nouveautés passent côté accès complet ; lecture libre inchangée.

**Destinataires** : les 11 comptes `plan = FREE` (liste à extraire au moment de l'envoi : `SELECT name, email, xp FROM "User" WHERE plan = 'FREE' ORDER BY "createdAt";`). [À VÉRIFIER : le compte est toujours 11 le jour de l'envoi.]
**Expéditeur** : [À VÉRIFIER avec Thomas : adresse d'envoi Resend habituelle des e-mails Deviens Marrant].
**Lien** : `https://deviens-marrant.fr/login?callbackUrl=%2Fabonnement` (connexion puis page d'abonnement ; un compte déjà connecté arrive directement sur `/abonnement`).
**Variante** : la phrase entre crochets n'apparaît que si `xp > 0` (donnée réelle du compte, jamais en masse).

---

**Objet** : Ton compte Deviens Marrant reste là

Salut [Prénom],

Petite nouvelle, sans urgence : on ne propose plus de compte gratuit. Le site reste ouvert à tous sans inscription, et le compte sert maintenant à activer l'accès complet.

Pour toi, concrètement, rien ne bouge : ton compte et tes données restent exactement où elles sont. Seuls le suivi de ta progression (XP, série, étapes validées) et le vote sur les prochaines nouveautés passent côté accès complet. [SI xp > 0 : Les {{xp}} XP que tu as gagnés sont conservés et reprennent là où tu les as laissés.]

Si l'envie te reprend de travailler les parcours en entier, l'accès complet est à 2,99 € par mois ou 24,99 € par an, annulable quand tu veux : [lien]. Et si tu préfères en rester au site ouvert, c'est très bien aussi.

Si tu préfères supprimer ton compte, réponds simplement à ce message.

Bonne journée,
L'Équipe Deviens Marrant

---

Points d'attention avant envoi :
- « 24,99 € par an » : l'annuel n'est proposé que si le prix Stripe annuel est configuré (`STRIPE_PREMIUM_ANNUAL_PRICE_ID`) ; sinon retirer « ou 24,99 € par an » [À VÉRIFIER le jour de l'envoi].
- Suppression sur demande : traitement manuel (aucun bouton de suppression dans `/profil`, signalé spec §4) ; prévoir qui supprime et sous quel délai.
- Zéro tiret cadratin, zéro mention IA, tutoiement, signature habituelle : contrôlés.
