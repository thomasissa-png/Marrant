# Textes de /resiliation, /resiliation/confirmee et e-mail « C'est noté » (s23, v1, PROVISOIRE)

Sources : spec `docs/ux/page-resiliation-s23-spec.md` (v3), cadre `docs/legal/resiliation-onboarding-cadre-s23.md` (A), `docs/copy/ton-alex.md`, choix du 06/11 (raison demandée AVANT, question facultative sur notre écran).
[Framework : récapitulatif factuel (clarté), pas de persuasion] [Conscience : Most-Aware, la personne a décidé]. Textes à valider avec Thomas (P0 s8) puis relecture à l'aveugle (P0 s18). Apostrophes typographiques à l'intégration (’), comme `paiement.ts`.

Variables : `{prenom}` (absent : rien), `{email}`, `{formule}` = « Premium mensuel » ou « Premium annuel », `{prix}` (déjà formaté avec périodicité, valeur de `config/premium.ts`), `{dateFin}` (lue dans la réponse Stripe, jamais recalculée), `{dateDemande}`, `{heureDemande}`. Aucune valeur écrite en dur.

## 1. Page /resiliation

**H1** : « Résilier ton contrat » (libellé légal A1/B6, identique au pied de page, au profil et aux e-mails).
Variante B : « Résilier ton contrat Premium ». **Reco : A.** Le libellé doit être le même partout (A1), A évite un second libellé concurrent, B n'apporte rien que le récapitulatif ne dise déjà.

**Récapitulatif** (carte, lignes courtes)
- `Compte : {email}` (si `{prenom}` : `{prenom}, {email}`)
- `Formule : {formule}, {prix}`
- `Fin du contrat : {dateFin}`
- « Jusqu'au {dateFin}, tu gardes tout ton Premium. »
- « Aucun nouveau prélèvement après. »
- Annuel seulement : « Le renouvellement de {prix} n'aura pas lieu. » [À CONFIRMER avocat : mention du remboursement ou non du reste de la période, ne rien promettre d'ici là]
- Date inconnue (lecture en échec) : « Fin du contrat : à la fin de la période déjà payée. »

**Question facultative**
Variante A : « Qu'est-ce qui n'a pas collé ? » + badge « Facultatif »
Variante B : « Qu'est-ce qu'on pourrait faire mieux ? » + badge « Facultatif »
**Reco : A.** Elle ne suppose rien (B suppose une faute de notre côté et pousse à critiquer), elle reste ouverte aux raisons qui ne nous concernent pas (temps, essai) et elle sonne comme une personne.
Sous-ligne : « Tu peux résilier sans répondre. »
Légende de groupe (`legend`, lecteurs d'écran) : « Qu'est-ce qui n'a pas collé ? Facultatif ».

**7 raisons** (cases à cocher, plusieurs possibles, jamais pré-cochées, ordre fixe)
1. `essai` : « Je voulais juste essayer »
2. `introuvable` : « Je n'ai pas trouvé ce que je cherchais »
3. `depart` : « Je ne savais pas par où commencer »
4. `temps` : « Pas le temps en ce moment »
5. `prix` : « Trop cher pour moi »
6. `inadapte` : « Ça ne me correspond pas »
7. `autre` : « Autre »

**Champ libre** : label « Un mot de plus ? », placeholder « Ce que tu veux nous dire, en quelques mots », compteur « 0/500 ». Jamais requis, même avec « Autre ».

**Bouton** : « Confirmer la résiliation » (imposé). **Lien** : « Garder mon abonnement » (retour `/profil#abonnement`, sans confirmation).
**Phrase d'information** : celles du récapitulatif suffisent ; aucune phrase de plus (B4). Vide assumé plutôt qu'une phrase de rétention.

**États**
- Envoi : « On résilie… »
- Connexion lente (> 3 s) : « Toujours en cours, ne ferme pas la page. »
- Hors ligne : « Pas de connexion. Rien n'est perdu, réessaie. »
- Erreur Stripe (bandeau `role="alert"`, bouton « Réessayer », saisie conservée) : « Ça n'a pas marché de notre côté. Ta demande est bien enregistrée : on résilie pour toi et on te le confirme par e-mail. » Aucun délai écrit tant que Thomas n'a pas fixé le délai de traitement [À FIXER par Thomas].
- Déjà résilié : « Ta résiliation est déjà enregistrée. Tu gardes Premium jusqu'au {dateFin}. » + lien « Réactiver mon abonnement ». Ni question, ni bouton.
- Sans abonnement : « Rien à résilier ici. » + lien « Retour à l'accueil ».
- App Store : « Ton abonnement passe par Apple. La résiliation se fait dans les réglages de ton compte Apple. »
- Sans session : écran de connexion, libellé « Connecte-toi pour résilier ton contrat. Tu reviens ici juste après. » [lien avocat n°2]

## 2. Page /resiliation/confirmee

- H1 : « C'est noté. »
- « Tu gardes Premium jusqu'au {dateFin}. Aucun nouveau prélèvement. »
- Effets : « Ensuite, ton compte continue avec l'accès gratuit. Tes favoris et ta progression restent enregistrés. » (même formulation que la FAQ `ARRET_FAQ_REPONSE`, déjà en ligne)
- « On t'envoie une confirmation à {email}. »
- Remerciement, seulement si au moins une raison ou un mot a été donné : « Merci d'avoir répondu. »
- Une seule ligne d'aide, selon la raison cochée (plusieurs raisons : la première dans l'ordre de la liste ; aucune raison, « autre » ou mot seul : aucune ligne). Format : phrase simple, lien intégré, jamais de bouton ni d'offre.

| Raison | Ligne | Lien (page existante) |
|---|---|---|
| essai | « Merci d'avoir essayé. La vanne du jour reste en accès libre si tu repasses. » | /blague-du-jour |
| introuvable | « Dis-nous ce que tu cherchais, on lit les messages envoyés à contact@deviens-marrant.fr. » | mailto contact@ |
| depart | « Le guide « Comment devenir drôle » tient en un article, avec un plan sur 30 jours. » | /blog/comment-devenir-drole |
| temps | « Les parcours, c'est 15 à 20 minutes par semaine, à ton rythme : rien ne se bloque. » | /parcours |
| prix | « Après le {dateFin}, la vanne du jour et la première étape de chaque parcours restent libres. » | /parcours |
| inadapte | « Le quiz « quel type d'humour es-tu ? » prend environ 2 minutes, sans inscription. » | /quiz-humour |

- Lien discret : « Changer d'avis ? Réactiver mon abonnement » (portail Stripe). Lien : « Retour à l'accueil ».
- Page ouverte sans résiliation en cours : redirection vers `/resiliation`.

## 3. E-mail « C'est noté » (accusé immédiat, C1 + C2)

**Objet** : « C'est noté : ton Premium s'arrête le {dateFin} » (étalon 5c.3 validé). Repli sans date : « Ta résiliation est confirmée ».

**Corps**
```
{Salut {prenom}, | Salut,}

Ta résiliation est bien prise en compte (demande du {dateDemande} à {heureDemande}).

Formule : {formule}, {prix}
Fin du contrat : {dateFin}

Ce qui se passe maintenant :
- Tu gardes l'accès Premium jusqu'au {dateFin}.
- Aucun nouveau prélèvement après cette date.
- Ensuite, ton compte continue avec l'accès gratuit : tes favoris et ta progression restent enregistrés, les premières étapes des parcours restent en lecture libre.

Tu as changé d'avis ? Tu peux réactiver ton abonnement jusqu'au {dateFin} : {lienReactivation}

{si une raison ou un mot a été donné : Merci d'avoir répondu à la question.}

Une question sur ta résiliation : contact@deviens-marrant.fr.

L'Équipe Deviens Marrant
```
Repli sans date : « Tu gardes l'accès Premium jusqu'à la fin de la période payée » (déjà géré par `emailConfirmationResiliation`). Annuel : mêmes lignes, « le renouvellement de {prix} n'aura pas lieu » en plus, remboursement non mentionné [À CONFIRMER avocat].
**Cas erreur Stripe** : objet « Ta demande de résiliation est bien reçue » ; corps : « On s'occupe de la résiliation. Dès qu'elle est faite, on te le confirme par e-mail. Tu gardes Premium jusqu'au {dateFin}. » (date attendue, ou « la fin de la période payée »). Aucun délai tant que non fixé.

## 4. Vérifications faites

Zéro tiret cadratin, tutoiement, aucune culpabilisation, aucune offre ni remise, aucun mot-condition (« pour résilier », « avant de », « d'abord » absents de la question). Chiffres : « 15 à 20 minutes par semaine », « 30 jours », « 2 minutes » = déjà en ligne ou validés ; prix et dates = variables. Liens : tous vers des routes existantes (`/blague-du-jour`, `/parcours`, `/quiz-humour`, `/blog/comment-devenir-drole`). Objections traitées : « je perds tout » (effets dits, accès gardé), « je ne retrouve pas ma résiliation » (e-mail + page), « et si je change d'avis » (réactivation), « on va me retenir » (aucune rétention).
Cohérence à reprendre : `TEXTES_ABONNEMENT.resilierDetail` (« Tu as résilié… depuis « Gérer mon abonnement » ») pointera vers « Réactiver mon abonnement » ; `emailConfirmationResiliation` (`paiement.ts`) : ajout date/heure, formule, lien de réactivation, remerciement conditionnel.

## Handoff @design puis @fullstack
- Fichier : `docs/copy/page-resiliation-s23-textes.md`. Choix en attente de Thomas : A/B du titre (reco A) et de la question (reco A) ; relecture à l'aveugle.
- À fixer : délai de traitement en cas d'erreur Stripe, mention du remboursement annuel (avocat).
