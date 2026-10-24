# Ce qui t'attend au retour (session 21, état au 17/10/2026)

Rien de ce qui suit n'est en ligne, sauf mention contraire. Chaque point a une recommandation ; une réponse courte suffit.

## Déjà fait et en ligne

- Phrase de remboursement corrigée sur /abonnement, la fenêtre d'achat, l'accueil et /register (« Tu as 14 jours pour te faire rembourser ton premier paiement »). Version en ligne `5ea46dd8`, retour arrière possible vers `476cc8f0`.
- Pause des réseaux prolongée jusqu'au lundi 26/10. Le blog continue : 22 articles programmés jusqu'en juin 2027.

## À trancher (une ligne chacun)

1. **Réseaux, 26/10** : reprendre ou prolonger la pause ? Reco : reprendre, après avoir décalé les posts en attente.
2. **SEO, 26/10** : fiches minces, étoffer les fiches vidéo (O1) ou les retirer de Google (O2) ? Google ne passe que sur environ 5 pages par jour (`docs/infra/crawl-googlebot-s21.md`) : ni l'un ni l'autre n'aura d'effet rapide. Le dossier complet est préparé le 19/10 après le contrôle Google (`docs/seo/decision-o1-o2-s21.md`).
3. **Lot 2 (boutons et page d'abonnement)**, prêt sur la branche `claude/marrant-s21-lot2-boutons`, à mettre en ligne seul après le bilan du lot 1 (~10/11). Points ouverts : `docs/copy/lot2-boutons-abonnement-s21.md` §7 (titre de la page d'abonnement, barre d'achat qui reste visible, « Tout débloquer »...).
4. **Lettre mensuelle gratuite**, prête sur la branche `claude/marrant-s21-lettre`, interrupteur fermé, 6 numéros validés à l'aveugle :
   - jour d'envoi des numéros ? Reco : le jeudi à 8 h, comme la future lettre hebdomadaire des abonnés ;
   - (tranché le 17/10) société citée seulement là où c'est obligatoire, « deviens-marrant SAS » pour l'instant ;
   - afficher la date du prochain numéro sur la page de confirmation ? Reco : non tant que le jour n'est pas fixé ;
   - textes accordés au masculin (« inscrit ») ou neutres ? Reco : neutres là où c'est possible sans lourdeur.
5. **« Ta question à l'équipe »** (`docs/product/ta-question-a-l-equipe-s21.md`, points T1 à T8) : délai de réponse 7 jours, 1 question par semaine, lettre hebdomadaire le jeudi, test à la main avec les 2 abonnés avant tout code. Reco : valider les 8 recommandations telles quelles.
6. **Avocat** : 7 points à faire valider avant d'ouvrir la lettre et les questions (`docs/legal/lettre-et-questions-s21.md`, liste A1 à A7).
7. **Base de données** : l'historique des changements de structure ne permet plus de recréer la base de zéro (sans effet aujourd'hui). Reco : un petit chantier de nettoyage, à faire hors période de mesure.

## Restes de la session 20 (actions de ta part)

- Test en direct dans Search Console de la vidéo Krief, avec capture.
- `?ne-pas-compter=1` sur tes navigateurs (sinon tes visites faussent la mesure du lot 1).
- Désactiver l'événement Calendly du coaching.
- Supprimer les 2 copies « Ton d'Alex … v2 » du vault (ou dire « supprime-les »).
- Passer la branche par défaut GitHub sur `main`.
