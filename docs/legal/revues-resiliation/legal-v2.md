# Revue @legal v2 : page /resiliation (s23, 06/11/2026)

> Draft de référence, pas un avis juridique : validation par un avocat avant ouverture de `RESILIATION_PAGE_OUVERTE`. Choix de Thomas (motif demandé AVANT, écran maison) non rouvert. Sources lues : `config/resiliation.ts`, `config/textes/resiliation.ts` et `resiliation-emails.ts`, `lib/resiliation.ts`, `lib/resiliation-conservation.ts`, `lib/scheduler/jobs.ts:873-899`, `lib/account.ts:143-145`, route `api/user/subscription/resiliation/route.ts`, `question-motif.tsx`, `recap-contrat.tsx`, `confidentialite/page.tsx`, `abonnement-card.tsx`, captures `confidentialite-ancre`, `erreur-stripe`, `app-store`, `confirmee`, `apres-profil-carte-abonnement` (PC 1440), `reviewer-v1.md`.

## Risques en 5 points

1. O1 à O5 de la v1 sont corrigées dans le code et sur les captures, au texte près.
2. Un seul défaut reste, nouveau : l'abonné en **impayé** voit « Aucun nouveau prélèvement » et « tu gardes Premium jusqu'au… », deux promesses que Stripe peut démentir (facture en cours encore représentée, accès coupé avant la date si les relances échouent).
3. La page finale dit « Aucun nouveau prélèvement. » sans « après » (le récapitulatif et l'e-mail disent « après »).
4. Valeurs provisoires à confirmer par Thomas : 24 mois, « sous un jour ouvré » (un délai annoncé est un engagement : ne pas ouvrir si non tenable).
5. O6 (portail Stripe, « Annuler les abonnements » à retirer) reste une action de Thomas, preuve à verser dans `REPLIT_ACTIONS.md`.

## Note globale : 9 / 10

Fonction de résiliation : 9,5. RGPD de la table : 9,5. Cas d'erreur : 9. Promesses de prélèvement : 8 (impayé). **Une obligatoire restante (O7)** ; appliquée, la note passe à 10 / 10 (sous réserve de l'avocat et d'O6).

## 1. Vérification de O1 à O5

| # | Exigence v1 | Statut | Preuve |
|---|---|---|---|
| O1 | Mention d'information sous le champ libre | **FAIT** | `question-motif.tsx:76-86` ; texte `textes/resiliation.ts:39-40` = texte v1 mot pour mot, durée lue dans la constante (24 mois), lien `/confidentialite#resiliation`, `aria-describedby` du champ, `text-xs`, ne retarde pas le bouton |
| O2 | Politique : données, base, droits, ancre, date | **FAIT** | `confidentialite/page.tsx:94-99` (partie 2, `id="resiliation"`, `scroll-mt-24`), `:113` (partie 3), `:192` (partie 7), `:68` (date seulement ouvert) ; cap: `resiliation-confidentialite-ancre-pc-1440.png` : puce de la partie 2 en haut de la fenêtre, puce de la partie 3 « intérêt légitime… tu peux t'y opposer (voir la partie 7) » ; textes = `CONFIDENTIALITE_RESILIATION` (`textes/resiliation.ts:125-131`) = v1. Fermé : rien affiché (interrupteur) |
| O3 | Durée, purge, suppression de compte | **FAIT** | Partie 6 `page.tsx:160-164`, texte `:129` = v1. Purge `resiliation-conservation.ts:12-22` (`createdAt < now - 24 mois`, table absente = 0), branchée dans la tâche de 4 h (`jobs.ts:886-898`, heure de Paris). Suppression : `account.ts:145` met `comment` à NULL avant `user.delete` ; `userId` passe à NULL (`SetNull`) : la phrase de la partie 6 est donc vraie |
| O4 | 503 : promesse tenue | **FAIT** | `route.ts:79-95` : e-mail équipe (cause `serveur`, « Stripe n'a pas été appelé »), accusé « demande bien reçue » à l'adresse de la session, 503 seulement si l'équipe est prévenue, sinon 500 (« réessaie », sans promesse, `formulaire.tsx:139-141`). Le texte à l'équipe distingue accusé envoyé ou non (`emails.ts:134-137`) |
| O5 | Délai et date d'effet de « on résilie pour toi » | **FAIT** | `textes/resiliation.ts:53` (bandeau) et `emails.ts:104` : délai + « Ta demande date du {date et heure} : c'est cette date qui compte… Tu gardes Premium jusqu'au… » ; cap: `resiliation-erreur-stripe-pc-1440.png` : « on résilie pour toi sous un jour ouvré et on te le confirme par e-mail. Tu n'as rien à refaire. » La valeur reste `[PROVISOIRE]` (`config/resiliation.ts:63`) |

Contrôles complémentaires OK : accès aussi depuis la carte profil (cap: `apres-profil-carte-abonnement-pc-1440.png` : « Résilier ton contrat » en bouton, « Si tu résilies, tu gardes Premium jusqu'au 1 décembre 2026, sans nouveau prélèvement », lien « Renoncer au contrat ici » conservé, ce qui clôt le « non vérifié » de la v1) ; App Store (cap: `resiliation-app-store-pc-1440.png` : carte seule, message Apple, retour accueil, pied de page présent, aucun bouton qui boucle) ; page finale (cap: `resiliation-confirmee-pc-1440.png` : date, formule, prix TTC, confirmation par e-mail, réactivation, aucune offre) ; motif jamais bloquant, ordre Stripe puis motif puis accusé inchangé.

## 2. Souhaitable du relecteur : impayé et « Aucun nouveau prélèvement »

**Constat dans le code.** `STATUTS_VIVANTS` inclut `PAST_DUE` (`lib/resiliation.ts:32`) ; le bouton « Résilier ton contrat » reste visible en impayé (`abonnement-card.tsx:105-110`) ; `/resiliation` affiche alors le récapitulatif standard (`recap-contrat.tsx:71-72`). Le mode `impaye` n'existe pas dans `DonneesResiliation`.

**Risque : OUI, promesse potentiellement fausse.** Une résiliation en fin de période (`cancel_at_period_end`) ne supprime pas la facture déjà ouverte : elle peut être représentée tant que le cycle de relances n'est pas fini (source secondaire seulement, tutoriel SymfonyCasts « cancelation edge case bugs » ; documentation Stripe officielle non trouvée sur ce point : **[À VÉRIFIER dans Stripe, test mode, avec les réglages de relances de Thomas]**). Deux phrases deviennent alors trompeuses pour cet abonné : « Aucun nouveau prélèvement » (un prélèvement de la facture en cours reste possible après le clic) et « Jusqu'au {date}, tu gardes tout ton Premium » (si les relances échouent, l'accès peut s'arrêter avant). Pratique commerciale trompeuse potentielle : à corriger, quel que soit le résultat du test Stripe (le texte ci-dessous reste vrai dans les deux cas).

**Aussi** : la page finale écrit « Aucun nouveau prélèvement. » (`textes/resiliation.ts:71-72`, cap: `resiliation-confirmee-pc-1440.png`) sans « après », alors que le récapitulatif (`:28`) et l'e-mail (`emails.ts:72`) disent « après ». À aligner.

## 3. Correction OBLIGATOIRE restante (1)

**O7. Texte pour l'abonné en impayé, et « après » sur la page finale.**

Code (@fullstack) : exposer `impaye: boolean` dans `DonneesResiliation` (`summary?.status === "PAST_DUE"`, déjà lu dans `lireResiliation`), le passer au récapitulatif, à la page finale et à l'accusé (`emailAccuseResiliation`, statut lu sur `sub.status` avant l'appel Stripe). Ajouter un test par surface.

Textes exacts (tutoiement, aucun tiret cadratin). Quand `impaye` est vrai :

- Récapitulatif `/resiliation` et page `deja_resilie` : remplacer les deux lignes d'effet par
  > Jusqu’au {date}, tu gardes ton Premium, sauf si la facture en cours reste impayée.
  > Ton dernier paiement n’a pas abouti : cette facture peut encore être prélevée. Aucun autre prélèvement ensuite.
  (repli sans date : « Jusqu’à cette date, tu gardes ton Premium, sauf si la facture en cours reste impayée. »)
- Page finale (`garde`) :
  > Tu gardes Premium jusqu’au {date}, sauf si la facture en cours reste impayée. Cette facture peut encore être prélevée. Aucun autre prélèvement ensuite.
- E-mail d'accusé, remplacer les puces 1 et 2 par :
  > - Tu gardes l’accès Premium jusqu’au {date}, sauf si la facture en cours reste impayée.
  > - Ton dernier paiement n’a pas abouti : cette facture peut encore être prélevée. Aucun autre prélèvement ensuite.

Quand `impaye` est faux, page finale : remplacer « Aucun nouveau prélèvement. » par « Aucun nouveau prélèvement après. » (avec date) et « …période déjà payée. Aucun nouveau prélèvement après. » (sans date). Le renouvellement annuel (`renouvellementAnnuel`) reste inchangé hors impayé.

Si Thomas préfère que la facture ouverte soit annulée à la résiliation (réglage Stripe ou action de l'équipe), ces textes doivent être revus : ne pas changer le comportement Stripe sans repasser par @legal.

## 4. Recommandations (non bloquantes)

- R2 (reste ouverte, choix UX assumé) : « Réessayer » s'affiche à côté de « Tu n'as rien à refaire » (cap: `erreur-stripe`). L'anti-doublon de 24 h (`transmettreAEquipe`) évite une deuxième demande à l'équipe ; l'incohérence de ton reste mineure.
- R3 bis : `emailDemandeResiliationRecue` et `jusquau()` disent « période payée » pour un accès offert (sans client Stripe) ; l'écran, lui, dit « à la fin de ton accès Premium ». Aligner l'e-mail (cause `sans-client-stripe`).
- R4 : abonné Apple depuis le web, et inversement faux positif « passe par Apple » pour un accès offert dans l'appli (`carte-app-store`, aucun contact proposé) : ajouter « Ce n’est pas ton cas ? Écris à contact@deviens-marrant.fr. » pour éviter un cul-de-sac. Lot app.
- R6 : la purge quotidienne est dans le même passage que l'entretien de la lettre : si le verrou de la lettre est déjà pris à un tick précédent de l'heure, la purge ne se rejoue pas ce jour-là (`jobs.ts:878`, `return` avant le bloc de purge). Sans conséquence juridique (retard d'un jour sur 24 mois), à noter.
- R7 : la mention sous le champ n'est pas passée par `frTypo` (insécable avant « 24 mois »), détail typographique.

## 5. Points à soumettre à l'avocat (listés, ne comptent pas comme défaut)

1. Lecture intégrale de L215-1-1, D215-1 à D215-3, L241-3-1 : écran maison + question de motif facultative sur le même écran ; référence du contrat obligatoire ou non.
2. Connexion exigée avant `/resiliation` pour un compte existant (3 clics).
3. Mention du remboursement du reste de l'annuel ; date d'effet = date de la demande ; délai de traitement manuel (« sous un jour ouvré »).
4. Intérêt légitime retenu pour le motif ; 24 mois ; sort des raisons cochées détachées du compte (ligne conservée sans identifiant).
5. Valeur de l'accusé « demande reçue » en cas d'erreur Stripe ou de panne base ; contenu minimal.
6. Résiliation par le portail Stripe si elle ne peut être désactivée (O6).
7. Ligne d'aide de la page finale (retirée en v2 UX : sans objet tant qu'elle n'est pas rebranchée).
8. Texte impayé (O7) : suffisant face à la facture déjà ouverte.

## 6. Conditions d'ouverture (rappel)

Interrupteur fermé jusqu'à : O7 appliquée, O6 faite par Thomas (capture du réglage du portail), 24 mois et délai confirmés (`config/resiliation.ts:57,63`), date `RESILIATION_DATE_TEXTES` mise à la date d'ouverture, migration 17 jouée, avis de l'avocat.

## Handoff

Destinataire : @orchestrator puis @fullstack (O7), Thomas (O6, valeurs provisoires, test Stripe impayé).
- Fichier produit : `/home/user/Marrant/docs/legal/revues-resiliation/legal-v2.md`
- Décisions : O1 à O5 validées ; une obligatoire (O7, impayé) ; note 9/10, 10/10 après O7.
- Points d'attention : notifier @copywriter (O7 textes), @qa (tests impayé), @data-analyst (aucun changement de tracking).
