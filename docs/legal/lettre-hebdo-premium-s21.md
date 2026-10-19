# Lettre hebdomadaire Premium : avis final @legal et textes exacts (s21, 19/10/2026)

Draft de référence, pas un avis d'avocat. Articles cités de mémoire ou d'après des sources secondaires, non relus sur Légifrance : `[À VÉRIFIER]`. Sources lues : spec `docs/product/lettre-hebdo-premium-s21.md` (§4, §5, §8, §9), mon avis `docs/legal/lettre-et-questions-s21.md` (L2, L3, L6, Q2, Q8, A4), pages réelles du worktree (`cgu/page.tsx`, `confidentialite/page.tsx`, `mentions-legales/page.tsx`), `config/lettre.ts`, `config/textes/lettre-s21.ts`, `lib/account.ts`. La production n'a pas été relue en ligne : les pages du worktree sont la référence. La décision du 06/05 (mention IA) n'est pas rouverte ; la lettre est faite par lot, sans IA au fil de l'eau, donc aucune obligation AI Act propre à ce livrable.

## Risques en 5 points (à lire avant le reste)
1. **A4 tranché : l'hebdo est un contenu du contrat, pas de la prospection, tant qu'elle ne contient aucune offre** (prix, annuel, parrainage, autre produit, lien vers /abonnement). Le jour où une offre s'y glisse, elle devient de la prospection. Risque faible sous conditions, moyen si une promotion apparaît.
2. **La clause « aucun numéro n'est dû en compensation » de la spec est trop large** (risque de clause abusive si elle exclut toute réparation). Version bornée ci-dessous : numéro isolé seulement, droits légaux réservés.
3. **La phrase de /abonnement sans condition est trompeuse par omission** : un Premium qui ne coche pas la case ne reçoit rien. Ajouter « si tu la veux ».
4. **La spec se trompe sur la suppression de compte** : le code (`deleteAccount`) et la confidentialité publiée effacent aussi l'inscription à la lettre du mois faite avec la même adresse. Spec §4.2 cas 8, H6-8 et N4 à corriger (pas l'inverse).
5. **Trois textes de la spec contiennent une inexactitude** : page d'arrêt (« ton abonnement continue » et « depuis ton profil » faux pour un ex-Premium), ligne sous la case (« la lettre du mois est suspendue » faux pour qui ne la reçoit pas), « jour férié » dans la clause (l'envoi est maintenu les jours fériés). Corrigés ci-dessous.

À faire valider par l'avocat (liste A1 à A7, ajouts) : **A4** (qualification, clause, engagement « chaque semaine »), **A4-bis** (base RGPD : contrat avec opt-in, repli consentement), **A3** (durées, hypothèses), **A6/R4** (SAS non immatriculée dans le pied).

---

## 1. A4 : contenu du contrat ou prospection ?

### 1.1 Verdict
**Contenu du contrat (une prestation incluse et facultative), pas de la prospection**, à quatre conditions cumulatives. Hors de ces conditions, le verdict bascule.

| # | Condition | Contrôle |
|---|---|---|
| C1 | Aucune offre ni incitation commerciale : pas de prix, de `€`, d'annuel, de parrainage, d'autre produit, de lien `/abonnement`, pas de « reste abonné », pas d'invitation à offrir ou partager la lettre | Liste bloquante spec §2.4 (à garder) + relecture @reviewer de chaque lot |
| C2 | Le contenu est ce que l'abonné a déjà le droit de lire (fiche du carnet, pont vers une étape de parcours incluse) | Spec §2.2 et §2.3 |
| C3 | Opt-in conservé (case jamais cochée) et arrêt en un clic sans toucher à l'abonnement | Spec H1 à H3 |
| C4 | Aucun pixel ni lien suivi | B4, Resend sans suivi |

**Base.** CPCE L.34-5 `[À VÉRIFIER Légifrance]` : la prospection directe est un message destiné à promouvoir, directement ou indirectement, des biens, des services ou l'image d'une personne qui les propose ; le texte regarde la finalité du message, pas son titre (déjà dit en L2). Ici le message est la livraison d'une fonction du service payant. RGPD art. 6.1.b.

**Plan B si une autorité requalifie en « promotion indirecte de l'image »** (le point faible : une lettre de rétention peut être lue ainsi) :
- le consentement existe déjà : la case est libre (aucune contrepartie), spécifique, éclairée, positive, tracée (date, version, origine) ; elle satisfait L.34-5 même requalifié ;
- à défaut, l'exception « clients, produits ou services analogues » (L.34-5, alinéa sur les coordonnées recueillies lors d'une prestation) : coordonnées recueillies à l'inscription, service analogue du même professionnel, opposition simple et gratuite offerte à la collecte (la case et la confidentialité) et à chaque message (le pied). Les sources consultées confirment ces conditions cumulatives ([CMS](https://cms.law/en/fra/legal-updates/prospection-commerciale-et-rgpd-vers-un-durcissement-du-cadre-juridique), [question parlementaire](https://questions.assemblee-nationale.fr/dyn/14/questions/QANR5L14QE68423.pdf)), pas de source CNIL primaire retrouvée : `[À VÉRIFIER sur cnil.fr]`.

**Base RGPD (A4-bis).** Contrat (art. 6.1.b), parce que la lettre est écrite dans les CGU comme partie de l'abonnement. Réserve : une fonction facultative n'est pas « strictement nécessaire » au contrat, donc l'avocat peut préférer le consentement (art. 6.1.a). Coût du repli : changer un mot dans la confidentialité, aucun changement de produit, car la case et l'arrêt sont déjà de qualité « consentement ». Dans les deux cas, règle de conduite : un arrêt est immédiat et définitif, on ne bascule jamais sur une autre base pour continuer d'écrire.

**Risque.** Faible si C1 à C4 tiennent. Moyen si une promotion apparaît (L.34-5 et sanction DGCCRF/CNIL, plafond d'amende `[À VÉRIFIER]`). Élevé : jamais, tant que la case reste non cochée.

### 1.2 L'engagement « chaque semaine » et la clause « décalé ou sauté »
- L'engagement est **accessoire et facultatif** (l'accès au catalogue ne dépend pas de lui) : c'est ce qui rend défendable qu'un numéro isolé manque. À ne pas écrire : « chaque jeudi sans exception », « 4 par mois », « garanti ».
- Une promesse publique « chaque semaine » devient une caractéristique sur laquelle le consommateur peut s'appuyer (information précontractuelle L.111-1 ; conformité des services numériques, L.224-25-12 et suivants `[numéros non relus]`). Si le stock s'épuise trois semaines de suite, un abonné ayant activé la lettre peut invoquer un défaut de conformité. Parade : 8 numéros d'avance, alerte sous 4 (spec §3.2), jamais de contenu au rabais.
- **Pourquoi la clause de la spec est refusée telle quelle** : « aucun numéro n'est dû en compensation » sans borne peut être lue comme une clause qui supprime ou réduit le droit à réparation du consommateur (clauses interdites, R.212-1 `[À VÉRIFIER, numéro d'alinéa]`), et les règles sur les services numériques ne s'écartent pas au détriment du consommateur `[À VÉRIFIER, numéro]`. L'article 8 des CGU réserve déjà les droits légaux ; la clause le répète à l'endroit utile.

**Clause retenue (texte exact, troisième ajout de l'article 10 des CGU, §4.1) :**

> Un numéro peut être décalé ou sauté une semaine, par exemple après un incident technique. Pour un numéro isolé, aucun numéro de remplacement ni aucune compensation ne sont dus : la lettre est un plus de ton abonnement, et ton accès à Premium reste entier. Si la lettre devait s'arrêter durablement ou changer en profondeur, on te le dit par e-mail, et tu peux résilier quand tu veux. Cela ne te prive pas des droits que la loi te garantit.

Engagements contenus (à valider par Thomas, ce sont des promesses) : on prévient par e-mail d'un arrêt durable ou d'un changement de fond ; on ne compense pas un numéro isolé. Risque de la clause : faible en version bornée, moyen en version de la spec.

---

## 2. Textes exacts : la case, la ligne, le pied

Conventions : tutoiement, zéro tiret cadratin, rien d'inventé. Apostrophes et espaces insécables posées par `insecables()` / `frTypo` côté code (les textes ci-dessous sont écrits en clair). Un changement de forme repasse la relecture à l'aveugle (règle d'or P0 s18) ; les **mentions marquées (O)** sont obligatoires et ne doivent pas disparaître d'un mot à l'autre.

### 2.1 La case (paiement et profil, texte identique)
Stockée côté serveur sous `lettre-hebdo-premium-v1` : le texte est celui de la spec §5, conforme, **inchangé**. Même texte et même version aux deux endroits (réserve R1 : la preuve doit correspondre au texte vu).

> Oui, je veux recevoir la lettre de la semaine, chaque jeudi : une scène du carnet, la réplique et l'exercice. Elle fait partie de mon abonnement et je peux l'arrêter en un clic, sans le résilier.

Contrôles : jamais cochée, y compris dans le HTML serveur ; non liée au paiement ni à une autre case ; libellé identique à l'écran et en base.

### 2.2 La ligne sous la case (paiement et profil)
Remplace celle de la spec (qui disait « la lettre du mois est suspendue » même à qui ne la reçoit pas, et n'identifiait pas le responsable) :

> La lettre de la semaine arrive à {e-mail du compte}. Si tu reçois déjà la lettre du mois, elle est mise en pause tant que tu reçois celle de la semaine, puis reprend quand tu arrêtes. deviens-marrant SAS, l'éditeur du site, est responsable de l'usage de ton adresse pour cette lettre. Détails et droits : Confidentialité.

« Confidentialité » est un lien vers `/confidentialite#lettre` (O). Case et ligne visibles ensemble sur mobile, sans repli (réserve R2).

### 2.3 Le pied de chaque numéro (texte seul)
Reprend le pied validé de la mensuelle (L3) et celui de la spec §8.4, avec trois corrections : motif exact, arrêt qui ne dit rien de faux, éditeur par la constante partagée.

```
--
Tu reçois cette lettre parce que tu es abonné Premium et que tu as choisi de la recevoir.
Éditeur : {LETTRE_MENTION_EDITEUR_NUMERO}. Contact : contact@deviens-marrant.fr.
Arrêter cette lettre en un clic (cela ne change rien à ton abonnement) : {lien d'arrêt propre au destinataire}
Confidentialité : https://deviens-marrant.fr/confidentialite#lettre
Mentions légales : https://deviens-marrant.fr/mentions-legales
```

- (O) identité de l'éditeur, contact valable, arrêt gratuit en un clic, motif de réception (CPCE L.34-5, LCEN art. 20 `[À VÉRIFIER]`). Expéditeur affiché « Deviens Marrant », `Reply-To: contact@deviens-marrant.fr`, objet non trompeur (titre de la fiche), en-têtes `List-Unsubscribe` et `List-Unsubscribe-Post`.
- Le lien « Mentions légales » reste : la page dit « RCS : en cours d'immatriculation », ce qui rend l'identité complète pour le lecteur (atténue R4).
- **R4 (non rouvert).** « deviens-marrant SAS » est la décision de Thomas du 17/10, risque connu et accepté. Une seule constante (`LETTRE_MENTION_EDITEUR_NUMERO`) le porte pour la mensuelle et l'hebdo ; le jour de l'immatriculation, ou si Thomas préfère « deviens-marrant SAS (en cours d'immatriculation) », on change cette seule valeur.

---

## 3. La page d'arrêt (`/lettre/premium/arreter`)
Mécanique de la spec H3 conservée : GET sans effet, bouton qui fait un POST, `noindex`, `Referrer-Policy: no-referrer`, jeton hors statistiques, arrêt toujours possible même interrupteurs fermés. Seuls les textes changent, pour trois inexactitudes : « ton abonnement continue » (faux dans l'intervalle où le plan est déjà FREE mais la ligne pas encore fermée), « reprendre depuis ton profil » (faux pour un ex-Premium, la section du profil est absente), et la conséquence sur la lettre du mois, à dire AVANT le clic (L6).

| État | Texte exact |
|---|---|
| Titre | Arrêter la lettre de la semaine ? |
| Défaut | Tu ne recevras plus la lettre de la semaine. Cet arrêt ne change rien à ton abonnement Premium. Les e-mails de ton compte et de ton abonnement (facture, sécurité, rappel avant un renouvellement annuel) continuent : ils sont obligatoires. Si tu es inscrit à la lettre du mois, elle reprend. |
| Bouton | Arrêter la lettre |
| Loading | Arrêt en cours… |
| Succès | C'est arrêté. Tu ne recevras plus la lettre de la semaine. Cet arrêt ne change rien à ton abonnement. Si tu es inscrit à la lettre du mois, elle reprend. Tant que tu es abonné Premium, tu peux reprendre la lettre de la semaine depuis ton profil. |
| Déjà arrêtée | La lettre de la semaine est déjà arrêtée. Si tu es abonné Premium, tu peux la reprendre depuis ton profil. |
| Lien inconnu | Ce lien ne fonctionne plus. Si tu es abonné Premium, tu peux régler la lettre depuis ton profil. Sinon, écris-nous à contact@deviens-marrant.fr. |
| Erreur serveur | L'arrêt n'a pas abouti, et c'est de notre côté. Réessaie dans un instant, ou écris-nous à contact@deviens-marrant.fr. |

(O) Le lien « contact » reste un moyen valable d'opposition si le jeton est mort (L.34-5) ; un « stop » reçu à contact@ arrête l'hebdo (action admin), un « plus aucun e-mail » devient une opposition globale (L6), traité sous un mois.

---

## 4. Ajouts aux pages publiques

Publication **le jour où `LETTRE_HEBDO_INSCRIPTION_OUVERTE` passe à `true`**, dans le même déploiement (jamais avant : aucune promesse non tenue ; jamais après : la case ne s'affiche pas sans ses mentions). Mettre « Dernière mise à jour » à la date de publication sur les deux pages.

### 4.1 CGU : article 10 « La lettre » (`id="lettre"`, ne pas renuméroter)
Le paragraphe existant reste tel quel. Ajouter les trois paragraphes suivants à la suite, dans cet ordre. L'article 3 (offres et tarifs) n'est PAS modifié : la lettre est un avantage accessoire et facultatif, pas une caractéristique essentielle de l'offre.

Paragraphe existant, inchangé :
> La lettre mensuelle gratuite est indépendante de l'abonnement : elle se fait sur inscription, confirmée par e-mail.

Ajout 1, la lettre de la semaine :
> La lettre de la semaine fait partie de l'abonnement Premium, mais elle est facultative : tu choisis de la recevoir (la case n'est jamais cochée d'avance, au paiement comme dans ton profil) et tu peux l'arrêter en un clic, sans résilier. Elle est envoyée chaque semaine, le jeudi, à l'adresse e-mail de ton compte, tant que ton accès Premium est actif. Elle reprend des contenus de Premium (une scène du carnet, la réplique et l'exercice) et ne contient aucune offre commerciale. Elle s'arrête quand ton accès Premium prend fin : les numéros déjà reçus restent dans ta boîte, et elle ne reprend pas toute seule si tu te réabonnes, tu la réactives toi-même.

Ajout 2, la lettre du mois pendant ce temps :
> Tant que tu reçois la lettre de la semaine, la lettre du mois est mise en pause. Elle reprend quand tu arrêtes la lettre de la semaine ou quand ton abonnement prend fin, si tu y es toujours inscrit.

Ajout 3, la clause bornée (A4, §1.2) :
> Un numéro peut être décalé ou sauté une semaine, par exemple après un incident technique. Pour un numéro isolé, aucun numéro de remplacement ni aucune compensation ne sont dus : la lettre est un plus de ton abonnement, et ton accès à Premium reste entier. Si la lettre devait s'arrêter durablement ou changer en profondeur, on te le dit par e-mail, et tu peux résilier quand tu veux. Cela ne te prive pas des droits que la loi te garantit.

Vérifications de vérité avant publication : « le jeudi » suit la constante `LETTRE_JOUR_ENVOI` (H8-5) ; « ne reprend pas toute seule » suppose H6-6 en place ; « accès Premium actif » couvre `cancelAtPeriodEnd` (continue jusqu'à la fin de période) et `PAST_DUE` (continue pendant les relances, règle s16).
Modification des CGU pour les abonnés existants : l'ajout ne concerne qu'une fonction nouvelle, il n'aggrave rien de ce qu'ils avaient. Indiquer le changement par la date de mise à jour et le lien dans l'e-mail de proposition (§6.5). Pas de nouvelle acceptation à recueillir.

### 4.2 Confidentialité : ajouts dans la section « 8. La lettre » (`id="lettre"`)
La page range déjà la lettre mensuelle dans la section 8 ; l'hebdo s'y ajoute, au même endroit, pour que le lien « Confidentialité » de la case mène au bon texte.

**Données (nouvelle puce de la première liste) :**
> Lettre de la semaine, si tu l'actives (abonnés Premium) : ton choix, c'est-à-dire la date, la version du texte que tu as accepté et l'endroit où tu l'as fait (page de paiement ou profil), puis, si tu l'arrêtes, la date et la façon dont tu l'as fait (lien dans l'e-mail, profil, ou demande à contact@deviens-marrant.fr). On garde aussi un code personnel qui sert au lien d'arrêt, et un journal des envois (quel numéro, à quelle adresse). La lettre est envoyée à l'adresse e-mail de ton compte. Aucune adresse IP n'est gardée pour ce choix.

Phrase à ajouter SEULEMENT si @infrastructure confirme en production que le suivi d'ouverture et de clic est désactivé sur le domaine (B4, `[À VÉRIFIER]`) : « On ne mesure ni les ouvertures ni les clics de cette lettre. »

**Finalité et base (nouvelle puce de la deuxième liste) :**
> T'envoyer la lettre de la semaine, si tu l'as activée : exécution du contrat, car elle fait partie de ton abonnement Premium. Tu l'actives toi-même avec une case, et tu peux l'arrêter à tout moment : on s'arrête alors. (La puce existante « Respecter tes choix et prouver ton accord : intérêt légitime » couvre la trace du choix.)

**Destinataires (nouveau paragraphe) :**
> Lettre de la semaine : l'envoi passe par notre prestataire Resend (voir la partie 4). L'équipe voit, dans son espace d'administration, si ta lettre est activée et depuis quand.

**Durée (à la suite du paragraphe « Lettre : tu restes inscrit… ») :**
> Lettre de la semaine : ton choix est gardé tant que ton compte existe. Si tu l'arrêtes ou si ton abonnement prend fin, on garde la date et la façon dont elle s'est arrêtée, pour respecter ton choix et ne pas t'écrire de nouveau sans que tu le demandes. Le journal des envois est gardé 12 mois. Quand tu supprimes ton compte, ton choix, sa trace et le journal des envois à ton adresse sont effacés tout de suite.

**Droits (partie 7, après la phrase existante sur le retrait du consentement à la lettre) :**
> Tu peux arrêter la lettre de la semaine à tout moment, avec le lien en bas de chaque numéro ou depuis ton profil, sans toucher à ton abonnement. Ce qui t'a été envoyé avant reste valable.

Resend (partie 4) : la ligne existante (« envoi des e-mails liés à ton compte et à ton abonnement, et des lettres ») couvre déjà l'hebdo, rien à ajouter. Durées 12 mois et « tant que le compte existe » = hypothèses A3.

---

## 5. La phrase de promesse sur /abonnement

**Verdict sur « Une lettre chaque semaine, au lieu d'une par mois » : juste pour qui active la lettre, mais insuffisante seule.**
- Un Premium qui ne coche pas la case ne reçoit aucune lettre de la semaine et garde la mensuelle. Lue seule, la phrase laisse croire que tout abonné reçoit une lettre par semaine : omission d'une condition substantielle, donc risque de pratique trompeuse par omission (Code de la consommation L.121-2 et L.121-3 `[À VÉRIFIER]`). Risque moyen sans la condition, faible avec.
- « au lieu d'une par mois » suggère un remplacement automatique de la mensuelle. Exact seulement pour qui active (la mensuelle est alors en pause) et seulement pour qui la recevait.
- « Une lettre » seul peut se lire comme un courrier papier : le site dit « par e-mail » partout ailleurs.
- « chaque semaine » est exact (4 ou 5 jeudis selon le mois), contrairement à « 4 par mois ». Garder.

**Formulation la plus courte qui reste exacte (recommandée) :**
> Une lettre par e-mail chaque semaine, si tu la veux.

**Variante avec la comparaison de Thomas, aussi exacte :**
> Une lettre par e-mail chaque semaine au lieu d'une par mois, si tu la veux.

Elle s'ajoute à la liste des avantages (H8-6 : surtitre, H1, sous-titre, carte, réassurance inchangés). Mêmes mots dans la FAQ et `llms.txt`, jamais de prix, de jour ni de date de prochain numéro, jamais « newsletter », « illimité » ou « 4 par mois ». Texte de la spec (variante B) « Tu choisis de la recevoir » : exact aussi, mais plus long ; « si tu la veux » suffit parce que la liste des avantages la place déjà dans l'abonnement.

**Avant et après le premier envoi (12/11) : exactement la même phrase.**
- Avant : elle est vraie dès que la porte G-H est franchie (inscription ouverte, envois ouverts, numéro `VALIDE` programmé, test réel arrivé), car une personne peut déjà la demander et le prochain jeudi est servi. Ajouter « bientôt », une date ou un compteur serait inutile et risquerait d'être faux si le premier envoi glisse au 19/11.
- Après : rien à changer. Ne pas ajouter de preuve sociale (« déjà N abonnés »), d'extrait ou d'archive de numéros réels (contenu Premium, spec H5-9).
- Si le premier envoi échoue ou est repoussé : `LETTRE_HEBDO_PROMESSE_PUBLIQUE` repasse à `false` (spec §9.3), la phrase disparaît de /abonnement, de la FAQ et de `llms.txt` le temps de la correction.
- Invariant H8-2 : la phrase ne s'affiche jamais avant que la case existe.

---

## 6. Cas limites

### 6.1 Fin de Premium
| Situation | Règle | Base |
|---|---|---|
| Résiliation demandée, période payée en cours | La lettre continue jusqu'à la fin de la période | Le contrat court, la prestation est due |
| `PAST_DUE` (relances) | Elle continue tant que l'accès Premium est conservé | Même accès conservé (règle s16) ; arrêter plus tôt retirerait une partie du service |
| Fin effective (période finie, remboursement, impayé terminé) | Arrêt : `enabled=false`, `stopOrigin="fin-premium"`. Pas de dernier numéro d'adieu, aucun message promotionnel | L2 : jamais de promotion |
| La lettre du mois | Reprend si l'adresse est `CONFIRMED`. Jamais de réinscription d'un `UNSUBSCRIBED`, jamais d'inscription nouvelle | L2(a) : la pause n'était pas un retrait |

Textes exacts à ajouter (facultatifs, non bloquants, mais s'ils existent ils sont exacts) :
- E-mail ou page de fin d'abonnement : « La lettre de la semaine s'arrête avec ton accès Premium. Si tu es inscrit à la lettre du mois, elle reprend. »
- Profil quand `cancelAtPeriodEnd` est vrai (remplace « Elle s'arrêtera avec ton abonnement le {date} » de la spec) : « Elle s'arrêtera avec ton accès Premium le {date}. »

Condition technique : le test de plan à l'envoi (H6-2) reste, car la fermeture de la ligne ne doit pas dépendre d'un passage de nuit.

### 6.2 Réabonnement
- **Jamais de réactivation automatique.** L'ancien consentement a été donné pour un abonnement qui a pris fin ; un nouvel abonnement demande un nouvel acte positif. La case réapparaît décochée à la page de succès (H1-10, H6-6), même texte et même version courante. La nouvelle activation écrit une nouvelle date et la version en vigueur.
- Le jeton d'arrêt reste stable : un ancien numéro arrête toujours la lettre (H3-9).
- **Point à corriger dans la spec.** Si `fin-premium` n'est posé que par le rapprochement de nuit, un réabonné rapide retrouve une ligne encore `enabled=true` et recevrait la lettre sans nouvel acte. Règle : poser `fin-premium` dans la même opération que le passage du plan à FREE (webhook), pas seulement la nuit. Le rapprochement de nuit reste un filet.
- Réabonnement avant l'échéance (résiliation annulée) : pas de rupture, la ligne reste active, rien à redemander.

### 6.3 Suppression de compte
- **Constat.** `lib/account.ts#deleteAccount` supprime déjà `newsletterSubscriber` pour l'adresse du compte, et la confidentialité publiée dit que « ton inscription à la lettre faite avec l'adresse de ton compte » est effacée tout de suite. La spec (§4.2 cas 8, H6-8, N4) dit l'inverse (mensuelle « non touchée ») : **elle est fausse**, et il ne faut pas modifier le code ni le texte publié pour l'aligner. À corriger dans la spec : la mensuelle faite avec la même adresse est effacée avec le compte, trace de désinscription comprise (A7 reste ouvert pour l'avocat).
- **À faire par @fullstack** (`deleteAccount`) : supprimer explicitement la ligne de préférence de l'hebdo (en plus de la cascade, comme `parcoursReminderPreference`) et les lignes `NewsletterSend` de l'hebdo pour cette adresse dans la même transaction (elles n'ont pas de clé vers `User`, la cascade ne les atteint pas). Test de bout en bout (H6-7). `[À VÉRIFIER : les lignes NewsletterSend de la mensuelle pour cette adresse ne sont pas non plus supprimées par le code lu ; la confidentialité ne le promet pas, mais la partie 6 doit rester exacte]`.
- **Texte exact pour l'écran de confirmation de suppression** (le texte actuel n'a pas été lu, `[À VÉRIFIER]`) : « Sont aussi effacés : ton choix pour la lettre de la semaine, le journal de ses envois, et ton inscription à la lettre du mois faite avec l'adresse de ton compte. »
- Un ancien lien d'arrêt, après suppression, tombe sur « Lien inconnu » (§3), qui ne promet rien d'impossible.

### 6.4 Suspension de la mensuelle pendant l'hebdo
- **Légale** : la pause n'est pas un retrait du consentement ; on envoie moins que promis (« une fois par mois »), pas plus. La personne le sait avant de cocher (ligne §2.2), à l'arrêt (§3) et dans les CGU (§4.1).
- La pause ne s'applique qu'à un Premium qui a activé la lettre ET quand `LETTRE_HEBDO_ENVOIS_OUVERTS` est vrai : arrêt d'urgence des envois = la mensuelle reprend pour tous.
- Une seule fonction « reçoit l'hebdo » pour l'envoi hebdo et pour l'exclusion de la mensuelle (spec §4.2). Un jeudi sans numéro `VALIDE` : l'abonné ne reçoit rien cette semaine (couvert par la clause §1.2, alerte admin). Si cela se répète, la clause ne protège plus : réparer le stock, ne pas défendre le retard.
- **Reconfirmation à 24 mois de la mensuelle** : le décompte continue, mais l'e-mail de reconfirmation est envoyé seulement si la mensuelle n'est pas en pause ; à la reprise, une échéance dépassée est reconfirmée avant tout envoi. `[HYPOTHÈSE : à valider avec @fullstack]` : ainsi un abonné à l'hebdo ne reçoit pas de message au nom d'une lettre qu'il ne reçoit pas.
- Le choix « mensuelle ou hebdo » n'est pas exclusif : la mensuelle contient une vanne décryptée et un article gratuit que l'hebdo n'a pas. Le dire n'est pas nécessaire au-delà de la ligne §2.2.

### 6.5 Les 2 abonnés actuels : proposition unique
- **Qualification** : message de service qui informe d'une fonction de l'abonnement payé, sans offre ni prix (N1). Pas de prospection si C1 tient. Plan B : exception clients de L.34-5 (§1.1), ce qui exige une opposition simple dans le message (ajoutée en pied).
- Règles : un seul envoi (`proposedAt`, 409 au second), aucune relance, **le silence ne vaut jamais activation** ; envoyé par action admin avec aperçu (brouillon obligatoire, règle commune 10) ; **non envoyé** à un compte avec `emailOptOut` vrai ou désinscrit globalement (L6) ; envoi au plus tard le lundi 09/11, après publication des textes §4 (jamais avant : le message renvoie à l'article 10).
- Brouillon (à passer à l'aveugle puis validation de Thomas, texte seul) :

```
Objet : La lettre de la semaine est dans ton abonnement

Salut,

La lettre de la semaine est maintenant comprise dans ton abonnement Premium : une scène du carnet, la réplique et l'exercice. Tu la reçois par e-mail, chaque jeudi, une fois que tu l'as activée.

Elle est facultative. Tant que tu ne coches pas la case, rien ne change pour toi. Pour la recevoir : https://deviens-marrant.fr/profil#lettre

Tu peux l'arrêter en un clic, sans toucher à ton abonnement. Si tu reçois déjà la lettre du mois, elle est mise en pause tant que tu reçois celle de la semaine. Les conditions sont dans l'article 10 des CGU : https://deviens-marrant.fr/cgu#lettre

Tu ne recevras pas d'autre message à ce sujet.

L'Équipe Deviens Marrant

--
Tu reçois ce message parce que tu es abonné Premium : il t'informe d'une fonction de ton abonnement.
Éditeur : {LETTRE_MENTION_EDITEUR_NUMERO}. Contact : contact@deviens-marrant.fr.
Tu ne veux plus recevoir d'e-mails autres que ceux de ton compte et de ton abonnement ? Écris-nous à contact@deviens-marrant.fr.
Confidentialité : https://deviens-marrant.fr/confidentialite#lettre
```
Contrôles : « maintenant comprise » seulement après la porte G-H ; aucun prix ni date de premier numéro (elle peut glisser) ; le lien du profil est un GET sans effet.
- Les CGU modifiées s'appliquent à une fonction nouvelle : pas de nouvelle acceptation à recueillir (§4.1).

---

## 7. Corrections à reporter dans la spec produit (`docs/product/lettre-hebdo-premium-s21.md`)
| Où | Correction |
|---|---|
| §4.2 cas 8, H6-8, N4, scénario H6-3 | La mensuelle faite avec la même adresse est effacée avec le compte (code et confidentialité publiée) |
| §5 ligne sous la case | Remplacer par §2.2 |
| §5 H3 (page d'arrêt) | Remplacer par §3 |
| §8.3 CGU | Remplacer par §4.1 (clause bornée, pas de « jour férié », réabonnement dit) |
| §8.4 pied | Remplacer par §2.3 |
| §9.1 | Phrase de promesse = §5 |
| §4.2 cas 6 | `fin-premium` posé avec le changement de plan (webhook), pas seulement la nuit |

## 8. Bloquants avant ouverture des inscriptions
- [ ] Textes §2 à §4 intégrés, publiés dans le même déploiement que la case (B7), « Dernière mise à jour » à la date du jour, relecture à l'aveugle passée pour toute reformulation de forme.
- [ ] Liste de mots bloquante de la spec §2.4 active (C1) ; `/abonnement` jamais lié depuis un numéro.
- [ ] `deleteAccount` étendu et testé (§6.3).
- [ ] B4 vérifié en production avant d'ajouter la phrase « ni ouvertures ni clics ».
- [ ] Spec corrigée (§7).
- [ ] Avocat consulté sur A4, A4-bis et A6/R4 si possible avant le 12/11 ; à défaut, décision écrite de Thomas de passer outre (porte G-H, condition 6). Le risque résiduel identifié est faible tant que C1 à C4 tiennent.

---
**Handoff → @orchestrator (puis @fullstack, @copywriter, @product-manager, @infrastructure, @data-analyst)**
- Fichier produit : `/home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774/docs/legal/lettre-hebdo-premium-s21.md`
- Décisions prises : A4 = contenu du contrat sous conditions C1 à C4, opt-in conservé, repli consentement puis exception clients ; clause « décalé ou sauté » bornée aux numéros isolés ; phrase /abonnement = « Une lettre par e-mail chaque semaine, si tu la veux. » (avant et après le premier envoi) ; suppression de compte efface aussi la mensuelle (spec corrigée, pas le code).
- Points d'attention : documents à faire valider par un avocat (A4, A4-bis, A3, A6/R4) ; engagements de la clause à confirmer par Thomas ; `deleteAccount` à étendre ; B4 à vérifier avant la phrase sans suivi ; `fin-premium` posé avec le changement de plan ; textes modifiés à repasser à l'aveugle ; aucun commit fait.
---
