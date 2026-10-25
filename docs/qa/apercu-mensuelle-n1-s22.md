# Aperçu : lettre du mois n°1 « On a comparé nos salaires », trois versions (s22, 25/10/2026)

Régénéré après la relecture à l'aveugle du rythme (B1 : « À bientôt, » remplace « Rendez-vous le mois prochain, »).

Rendu par les fonctions réelles de l'envoi (`corpsNumero`, `corpsNumeroPremium` dans `apps/web/src/lib/lettre/envoi.ts`), depuis le texte de `apps/web/src/data/lettre/numeros.json`, jetons factices. Espaces insécables posées au rendu (invisibles ici). Aucun e-mail envoyé.

Décision de Thomas du 25/10 : la lettre du mois fait partie des lettres Premium. Le jeudi 05/11 (semaine 2026-W45), les abonnés Premium reçoivent cette lettre (version Premium), aucune lettre réservée cette semaine-là ; la première lettre réservée part le 12/11.

Différences entre les deux versions, et rien d'autre :
1. le paragraphe d'invitation « PS : si une vanne par mois… » + « Voir l'offre Premium : …/abonnement… » est retiré de la version Premium (bloc délimité par `[[invitation-premium]]` / `[[/invitation-premium]]` dans le fichier, marqueurs jamais envoyés) ;
2. le pied : celui de la lettre de la semaine (incluse dans l'abonnement, lien d'arrêt) au lieu de celui de la lettre du mois (désinscription) ;
3. la ligne « Ta question à l'équipe » (service ouvert sur cette branche, `QUESTION_EQUIPE_OUVERTE = true`) est posée par le code avant le pied, comme dans chaque lettre de la semaine ;
4. les en-têtes `List-Unsubscribe` : arrêt de la lettre de la semaine au lieu de la désinscription de la lettre du mois.

Objet (les deux) : On a comparé nos salaires
Pré-en-tête (les deux) : La vanne du mois, et pourquoi elle tombe juste.

## Version gratuite (inscrits à la lettre du mois, hors abonnés Premium)

```
Salut,

Avec un collègue, on a enfin comparé nos salaires.
Il a payé le café. Sans un mot.

C'est la vanne du mois.

Pourquoi ça marche
Le geste remplace la conversation. Payer le café, c'est avouer que l'écart de salaire était réel, et injuste, sans jamais le dire. Plus la révélation reste sous-entendue, plus elle pèse : le rire vient de là.

À toi de jouer
1. Pense à une vérité gênante que chacun préfère ne pas dire tout haut.
2. Au lieu d'en parler, fais réagir ton personnage par un geste petit et précis, qui avoue tout.
3. Écris deux phrases, la seconde plus courte que la première.

Exemple : « Mon coloc a fini par remarquer que sa chambre faisait le double de la mienne, pour le même loyer. Depuis, il descend les poubelles. »

À la soirée de Noël au boulot, une vanne ratée dure jusqu'en janvier. L'article suit la soirée moment par moment, de l'arrivée au départ, avec la règle des 3 zones pour savoir de quoi rire et de quoi s'abstenir. Celle de ce mois parle de salaires : il les range en zone rouge, donc elle reste pour la machine à café. L'article est en lecture libre.
Lire l'article sur la soirée de Noël au boulot : https://deviens-marrant.fr/blog/soiree-de-noel-entreprise-humour?utm_source=lettre&utm_medium=email&utm_content=n1-article

PS : si une vanne par mois ne te suffit pas, les parcours complets sont dans Premium, résiliable en ligne. La première étape de chacun se lit sans compte.
Voir l'offre Premium : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n1-premium

À bientôt,
L'Équipe Deviens Marrant

--
Tu reçois cette lettre parce que tu l’as demandée sur deviens-marrant.fr.
Éditeur : deviens-marrant SAS. Contact : contact@deviens-marrant.fr.
Se désinscrire : https://deviens-marrant.fr/lettre/desinscrire?token=JETON-DESINSCRIPTION
Confidentialité : https://deviens-marrant.fr/confidentialite
```

En-têtes :

```
List-Unsubscribe: <https://deviens-marrant.fr/api/newsletter/unsubscribe/JETON-DESINSCRIPTION>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

## Version Premium (destinataires de la lettre de la semaine, canal Premium)

```
Salut,

Avec un collègue, on a enfin comparé nos salaires.
Il a payé le café. Sans un mot.

C'est la vanne du mois.

Pourquoi ça marche
Le geste remplace la conversation. Payer le café, c'est avouer que l'écart de salaire était réel, et injuste, sans jamais le dire. Plus la révélation reste sous-entendue, plus elle pèse : le rire vient de là.

À toi de jouer
1. Pense à une vérité gênante que chacun préfère ne pas dire tout haut.
2. Au lieu d'en parler, fais réagir ton personnage par un geste petit et précis, qui avoue tout.
3. Écris deux phrases, la seconde plus courte que la première.

Exemple : « Mon coloc a fini par remarquer que sa chambre faisait le double de la mienne, pour le même loyer. Depuis, il descend les poubelles. »

À la soirée de Noël au boulot, une vanne ratée dure jusqu'en janvier. L'article suit la soirée moment par moment, de l'arrivée au départ, avec la règle des 3 zones pour savoir de quoi rire et de quoi s'abstenir. Celle de ce mois parle de salaires : il les range en zone rouge, donc elle reste pour la machine à café. L'article est en lecture libre.
Lire l'article sur la soirée de Noël au boulot : https://deviens-marrant.fr/blog/soiree-de-noel-entreprise-humour?utm_source=lettre&utm_medium=email&utm_content=n1-article

À bientôt,
L'Équipe Deviens Marrant

Une situation te laisse sans réplique ? Pose ta question à l'équipe depuis ton profil : en général, réponse sous 1 à 2 jours ouvrés. https://deviens-marrant.fr/profil

--
Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium.
Éditeur : deviens-marrant SAS. Contact : contact@deviens-marrant.fr.
Arrêter cette lettre en un clic (cela ne change rien à ton abonnement) : https://deviens-marrant.fr/lettre/premium/arreter?token=JETON-ARRET
Confidentialité : https://deviens-marrant.fr/confidentialite#lettre
Mentions légales : https://deviens-marrant.fr/mentions-legales
```

En-têtes :

```
List-Unsubscribe: <https://deviens-marrant.fr/api/lettre-premium/arret-un-clic?token=JETON-ARRET>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

## Cas particulier : abonné Premium qui a arrêté la lettre de la semaine mais reste inscrit à la lettre du mois

Version sans invitation, pied et en-têtes de la lettre du mois (canal gratuit) :

```
Salut,

Avec un collègue, on a enfin comparé nos salaires.
Il a payé le café. Sans un mot.

C'est la vanne du mois.

Pourquoi ça marche
Le geste remplace la conversation. Payer le café, c'est avouer que l'écart de salaire était réel, et injuste, sans jamais le dire. Plus la révélation reste sous-entendue, plus elle pèse : le rire vient de là.

À toi de jouer
1. Pense à une vérité gênante que chacun préfère ne pas dire tout haut.
2. Au lieu d'en parler, fais réagir ton personnage par un geste petit et précis, qui avoue tout.
3. Écris deux phrases, la seconde plus courte que la première.

Exemple : « Mon coloc a fini par remarquer que sa chambre faisait le double de la mienne, pour le même loyer. Depuis, il descend les poubelles. »

À la soirée de Noël au boulot, une vanne ratée dure jusqu'en janvier. L'article suit la soirée moment par moment, de l'arrivée au départ, avec la règle des 3 zones pour savoir de quoi rire et de quoi s'abstenir. Celle de ce mois parle de salaires : il les range en zone rouge, donc elle reste pour la machine à café. L'article est en lecture libre.
Lire l'article sur la soirée de Noël au boulot : https://deviens-marrant.fr/blog/soiree-de-noel-entreprise-humour?utm_source=lettre&utm_medium=email&utm_content=n1-article

À bientôt,
L'Équipe Deviens Marrant

--
Tu reçois cette lettre parce que tu l’as demandée sur deviens-marrant.fr.
Éditeur : deviens-marrant SAS. Contact : contact@deviens-marrant.fr.
Se désinscrire : https://deviens-marrant.fr/lettre/desinscrire?token=JETON-DESINSCRIPTION
Confidentialité : https://deviens-marrant.fr/confidentialite
```

## Version des comptes sans abonnement (3e version, décision de Thomas du 25/10)

Comptes sans abonnement Premium, inscrits d'office, actuels et futurs (sauf opposition, rebond, désinscription, ancien Premium qui avait arrêté la lettre de la semaine). Même texte que la version Premium (sans le bloc d'invitation), pied « tu as un compte », désinscription en un clic par le lien de la lettre du mois (durable). Un compte aussi inscrit par adresse (confirmé) reçoit la version gratuite ci-dessus, une seule fois.

```
Salut,

Avec un collègue, on a enfin comparé nos salaires.
Il a payé le café. Sans un mot.

C'est la vanne du mois.

Pourquoi ça marche
Le geste remplace la conversation. Payer le café, c'est avouer que l'écart de salaire était réel, et injuste, sans jamais le dire. Plus la révélation reste sous-entendue, plus elle pèse : le rire vient de là.

À toi de jouer
1. Pense à une vérité gênante que chacun préfère ne pas dire tout haut.
2. Au lieu d'en parler, fais réagir ton personnage par un geste petit et précis, qui avoue tout.
3. Écris deux phrases, la seconde plus courte que la première.

Exemple : « Mon coloc a fini par remarquer que sa chambre faisait le double de la mienne, pour le même loyer. Depuis, il descend les poubelles. »

À la soirée de Noël au boulot, une vanne ratée dure jusqu'en janvier. L'article suit la soirée moment par moment, de l'arrivée au départ, avec la règle des 3 zones pour savoir de quoi rire et de quoi s'abstenir. Celle de ce mois parle de salaires : il les range en zone rouge, donc elle reste pour la machine à café. L'article est en lecture libre.
Lire l'article sur la soirée de Noël au boulot : https://deviens-marrant.fr/blog/soiree-de-noel-entreprise-humour?utm_source=lettre&utm_medium=email&utm_content=n1-article

À bientôt,
L'Équipe Deviens Marrant

--
Tu reçois cette lettre parce que tu as un compte sur deviens-marrant.fr.
Éditeur : deviens-marrant SAS. Contact : contact@deviens-marrant.fr.
Se désinscrire en un clic : https://deviens-marrant.fr/lettre/desinscrire?token=JETON-DESINSCRIPTION-COMPTE
Confidentialité : https://deviens-marrant.fr/confidentialite
```

En-têtes :

```
List-Unsubscribe: <https://deviens-marrant.fr/api/newsletter/unsubscribe/JETON-DESINSCRIPTION-COMPTE>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```
