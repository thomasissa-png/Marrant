# Avis juridique s17 : rappel e-mail, 6 événements Umami, dates par étape (@legal, 07/10/2026)

Draft de référence, pas un avis d'avocat. Lecture seule : aucun autre fichier modifié, aucun commit. Sources web consultées le 07/10/2026 (liste en bas).

## Risques en 5 points
1. **Rappel e-mail : GO.** Si la personne l'active elle-même (case décochée par défaut) et que l'e-mail ne contient que le rappel, c'est un message de service, pas de la pub. S'il glisse une offre, un article ou un prix, il devient de la prospection et les règles changent.
2. **Il doit s'arrêter en un clic**, sans connexion, et s'arrêter tout seul quand Premium prend fin ou que le compte est supprimé.
3. **Umami : GO.** Les 6 événements ne contiennent rien de personnel, l'exemption de bandeau tient, à condition de ne jamais relier une session Umami à un compte (le rapport data de s17 le fait en hypothèse : à arrêter).
4. **Dates par étape et retours : GO**, c'est une donnée de compte. Elle doit être citée dans la politique de confidentialité, supprimée avec le compte et exportable sur demande.
5. **Politique de confidentialité : 8 phrases à ajouter** (§4) avant la mise en ligne, sinon l'information promise aux membres est fausse.

## 1. Rappel e-mail hebdomadaire sur demande
**Verdict : GO sous conditions.** Problème : un rappel périodique peut être pris pour du démarchage. Effet : plainte CNIL ou signalement (amende L.34-5 CPCE) si la personne ne l'a pas voulu ou ne peut pas l'arrêter. On fait : l'option est voulue, simple à couper, et strictement utile.
- **Base légale : consentement** (RGPD art. 6.1.a), recueilli par l'activation volontaire. L'exécution du contrat est défendable, mais une option facultative n'est pas indispensable à Premium : le consentement est la base la moins contestable, et il ne coûte rien de plus (la case suffit). Retrait aussi simple que l'activation.
- **Qualification : e-mail de service**, non commercial, car (a) demandé par la personne, (b) lié au service Premium qu'elle paie, (c) contenu limité au rappel (étape suivante, date conseillée, lien). La CNIL définit la prospection comme un message qui promeut un produit ou un service. Un abonné pourrait recevoir de la promotion « analogue » sans opt-in (L.34-5) mais ce n'est pas le choix de D7 : on reste en service pur.
- **Mentions dans chaque e-mail** : pourquoi tu le reçois et depuis quand ; lien d'arrêt en un clic ; lien pour changer le jour ; expéditeur identifié (« L'Équipe Deviens Marrant », deviens-marrant.fr) ; adresse de réponse contact@deviens-marrant.fr ; raison sociale et adresse dès que D3 est tranché. Pas d'offre, de prix, de réseau social, d'article.
- **Lien d'arrêt** : propre au rappel (ne coupe que lui), jeton signé, sans login, effet immédiat, idempotent, plus en-têtes `List-Unsubscribe` et `List-Unsubscribe-Post`. Ne pas réutiliser `/api/unsubscribe` tel quel : il pose `emailOptOut` pour tous les e-mails.
- **Preuve à conserver** : activé oui/non, jour choisi, date et heure d'activation, date et origine du dernier arrêt (profil, lien, fin de Premium, suppression), version du texte affiché à côté de la case. Pas de journal à part.
- **Durée** : tant que le compte existe, effacé avec lui ; l'arrêt reste inscrit tant que le compte existe (pour ne jamais renvoyer). Journal d'envoi Resend : 12 mois au plus [HYPOTHÈSE : à confirmer, réglage Resend non vu].

## 2. Six nouveaux événements Umami
**Verdict : GO, l'exemption de consentement CNIL pour la mesure d'audience s'applique toujours.** Les 6 événements (`parcours-ouvert`, `etape-ouverte`, `quiz-etape-termine`, `orientation-resultat`, `parcours-termine`, `parcours-erreur`) mesurent l'usage du site pour l'éditeur seul : parcours, numéro d'étape, statut (visiteur, membre, premium), score, provenance. Aucun identifiant, aucune adresse. Problème : l'exemption saute si la mesure sort de ce cadre. Effet : bandeau de consentement obligatoire sur tout le site. On fait : respecter les conditions ci-dessous.
- **Conditions CNIL** : finalité limitée à la mesure d'audience pour notre compte ; statistiques anonymes ; aucun croisement avec d'autres données ni transmission à un tiers (Umami n'agit que pour nous) ; aucun suivi d'un site à l'autre ; traceur 13 mois et données 25 mois au plus ; information et possibilité de s'opposer.
- **Point d'attention n°1** : `statut=premium` avec 2 abonnés de lancement permet de deviner qui est derrière un événement. Lecture en agrégé seulement, jamais session par session. Rapprocher une session Umami d'un compte (data-analyst §3, hypothèses « même personne ») est un croisement interdit par la condition. Comparer des totaux (étapes en base contre `parcours-etape`, DA-09) reste permis.
- **Point d'attention n°2** : l'attribution (`origine`, `contenu`) reste sur liste blanche (`lib/attribution.ts`, vérifié) ; `src` et `motif` aussi (liste fermée, valeur hors liste ramenée à `direct`).
- `etape-retour` (réservé) : permis seul et sans identifiant ; jamais émis avec le même détail que la ligne en base du §3.

## 3. Dates par étape et retours d'exercice
**Verdict : GO sous conditions.** Problème : ces données sont liées au compte, donc personnelles, et la politique ne les cite pas. Effet : information incomplète (RGPD art. 13). On fait : phrases du §4 et conditions du §5.
- **Finalité 1** : afficher ta progression, la date conseillée, la série, retrouver tes retours : exécution du contrat, ni consentement ni bandeau (données serveur, pas de traceur).
- **Finalité 2** : statistiques internes globales (rythme, retour à J7, requêtes Q5 et Q6) : intérêt légitime, opposition possible, aucun usage commercial ciblé.
- **Retours « pas encore essayé / bof / ça a marché »** : pas une donnée sensible (ni santé ni opinion) si les 3 valeurs restent fermées. Aucun champ libre : un texte libre sur la confiance en soi pourrait révéler de la santé ou de la vie privée (nouvel avis @legal). Facultatifs : jamais requis pour valider une étape.
- **Durée** : tant que le compte existe, supprimée avec lui (cascade). Pas de purge automatique des inactifs aujourd'hui : [À FIXER PAR THOMAS]. Ma reco : suppression 3 ans après la dernière connexion, avec e-mail 30 jours avant [HYPOTHÈSE à valider].
- **Droits** : les dates et retours entrent dans l'export sur demande (portabilité) et dans l'accès.

## 4. Phrases à ajouter à la politique de confidentialité
Fichier : `confidentialite/page.tsx` (apostrophes en `&apos;`). Passer « Dernière mise à jour » à la date de mise en ligne.
- **P1, partie 2, remplace la puce « Progression »** : « Progression : XP, niveau, série, étapes de parcours validées avec la date de chaque validation, et tes retours sur les exercices (« pas encore essayé », « bof » ou « ça a marché ») si tu choisis d'en donner »
- **P2, partie 2, nouvelle puce** : « Rappel de parcours, si tu l'actives : le jour de la semaine que tu as choisi, la date d'activation et, si tu l'arrêtes, la date d'arrêt »
- **P3, partie 3, nouvelle puce** : « Afficher ta progression, calculer ta série et ta prochaine étape conseillée, et garder tes retours sur les exercices : exécution du contrat »
- **P4, partie 3, nouvelle puce** : « Comprendre, de façon globale, où les membres avancent ou bloquent dans les parcours pour les améliorer : intérêt légitime (tu peux t'y opposer, voir la partie 7) »
- **P5, partie 3, nouvelle puce** : « T'envoyer chaque semaine un rappel de ton parcours, uniquement si tu l'as demandé : ton consentement, que tu peux retirer à tout moment en un clic »
- **P6, partie 5, remplace la 2e phrase de la puce « Mesure d'audience »** : « On compte les pages vues et quelques actions (par exemple un clic sur un bouton d'abonnement, l'ouverture d'une étape de parcours ou le score d'un quiz), sans y associer ton nom, ton e-mail ni ton compte, et on ne lit que des statistiques globales. Ces mesures ne sont ni croisées avec les données de ton compte, ni utilisées pour de la publicité. »
- **P7, partie 6, nouveau paragraphe** : « La date de chaque étape validée et tes retours sur les exercices sont gardés tant que ton compte existe, et effacés avec lui. Ton rappel de parcours s'arrête dès que tu le désactives, que ton abonnement Premium prend fin ou que tu supprimes ton compte. Les statistiques de mesure d'audience sont conservées 25 mois au plus. » (dernière phrase : seulement une fois la purge Umami réglée, C12)
- **P8, partie 7, à la suite du dernier paragraphe** : « Si tu as activé le rappel de parcours, tu peux l'arrêter à tout moment depuis ton profil ou avec le lien au bas de chaque e-mail : ce que tu as reçu avant reste valable. »

## 5. Conditions que le code doit respecter
**Rappel e-mail (lot A)**
- **C1** Case décochée, dans le profil, visible seulement pour un Premium actif ; jamais cochée à l'inscription ni au paiement. Texte voisin : « Reçois chaque semaine un e-mail pour reprendre ton parcours. Tu peux l'arrêter à tout moment. » Version du texte enregistrée.
- **C2** Champs : actif, jour, date d'activation, date et origine de l'arrêt (`profil`, `lien-email`, `fin-premium`, `suppression`). Suppression en cascade avec l'utilisateur.
- **C3** Envoi seulement si Premium en cours ; arrêt automatique à la fin de la période payée, au remboursement, à la résiliation immédiate et à la suppression.
- **C4** Envoi seulement à une adresse validée (compte Google ou e-mail vérifié) et jamais si `emailOptOut` vaut vrai [À VÉRIFIER : champ de vérification existant].
- **C5** Un seul e-mail par semaine, au jour choisi (Europe/Paris) ; un retard du job ne produit jamais un envoi multiple.
- **C6** Contenu : étape suivante, date conseillée, lien vers l'étape. Zéro offre, prix, lien vers le blog ou un réseau. Pied : raison d'envoi et date de demande, lien d'arrêt, lien « changer le jour », signature, contact.
- **C7** Lien d'arrêt dédié (jeton signé, sans login, immédiat, idempotent, page de confirmation tutoyée) + en-têtes `List-Unsubscribe` et `List-Unsubscribe-Post`. Même bouton d'arrêt dans le profil.
- **C8** Suivi d'ouverture et de clic Resend désactivé pour cet e-mail (un pixel d'ouverture est un traceur soumis à consentement).
**Umami (lot B)**
- **C9** Uniquement `trackUmami` ; jamais `umami.identify`, jamais e-mail, nom, identifiant ou jeton dans une propriété ; valeurs en listes fermées (`src`, `motif`, `statut`, `declencheur`, `resultat`).
- **C10** Aucun nouveau script tiers (replay, heatmap, pixel) ni cookie ou stockage de longue durée sans nouvel avis. Aucun événement Umami envoyé depuis le serveur avec un identifiant.
- **C11** Rapports : agrégés seulement, aucun rapprochement session Umami et compte.
- **C12** Purge des données Umami au-delà de 25 mois et contrat de sous-traitance Umami Cloud en place [À VÉRIFIER, Thomas].
**Dates et retours (lot A)**
- **C13** `UserPathStepCompletion` et retours : clé étrangère `onDelete: Cascade`, aucun champ libre, aucune réponse de quiz, retour = 3 valeurs fermées, facultatif, jamais exigé pour valider une étape.
- **C14** Ces tables et la préférence de rappel entrent dans l'export et l'accès sur demande ; un test `deleteAccount` vérifie qu'aucune ligne ne reste.
- **C15** Aucune étiquette déduite de la personne (« timide », « en retard ») ni usage commercial ciblé de ces données.
- **C16** Phrases P1 à P8 mises en ligne avec ou avant le déploiement des fonctions (même commit).

## 6. Non vérifié et reste à Thomas
- CNIL : recommandation consolidée de janvier 2026 lue par extraits de recherche, pas en entier. La CNIL ne publie pas de guide pour Umami (elle en a pour Matomo, Eulerian, etc.) : « Umami bien configuré = exemption » vient de sources secondaires [À VÉRIFIER outil par outil, point ouvert s16].
- Code du rappel (lot A, en cours) non lu : C1 à C8 sont des exigences, pas un constat. Réglages Resend et existence d'un champ d'e-mail vérifié non vus.
- **Thomas** : durée de conservation des comptes inactifs ; contrat Umami Cloud et purge ; D3 (raison sociale et adresse pour le pied d'e-mail). **Avocat** (courte consultation s16 déjà prévue) : ajouter la durée des inactifs.
Sources : [CNIL, recommandation cookies consolidée 01/2026](https://www.cnil.fr/sites/default/files/2026-01/recommandation_cookies_consolidee.pdf) ; [CNIL, exemption mesure d'audience](https://Cnil.fr/sites/cnil/files/atoms/files/exemption_pour_la_mesure_daudience_sans_consentement_piwik.pdf) ; [Leto, CNIL prospection opt-in et opt-out 2026](https://www.leto.legal/news/cnil-communications-electroniques-prospection-regles-2026) ; [Agence Scroll, alternatives avec exemption CNIL](https://agence-scroll.com/blog/alternatives-google-analytics-exemption-cnil).
