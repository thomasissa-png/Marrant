# Contre-relecture à l'aveugle : « Ta question à l'équipe » v3 (s22, 25/10/2026)

Périmètre : 3 points demandés, sans lecture de `docs/reviews/` ni de `docs/design/`.

## Verdict

- **Bloquants : aucun.**
- **Note globale : 9/10.**
- **Verdict : GO.**

## 1. Message d'erreur d'envoi : vrai quelle que soit l'issue

Texte : « On n'a pas pu confirmer l'envoi. Réessaie dans un instant, ou écris-nous à contact@deviens-marrant.fr. » (`question-equipe-s22.ts:54`).

Je l'ai confronté à tous les cas qui l'affichent (`question-equipe-card.tsx:35-44` et `:97-98`) :

| Cas réel | Parti ? | Message vrai ? |
|---|---|---|
| Resend dépasse 5 s puis envoie (`question-equipe.ts:134-141`, route `:80-84`) | oui | oui (« pas pu confirmer », sans « rien n'est parti ») |
| Resend refuse | non | oui |
| Base ou limiteur en panne (route `:87-89`) | non | oui |
| Adresse du compte inutilisable (route `:67-70`) | non | oui (renvoyer ne servira à rien, mais l'adresse contact@ est proposée) |
| Délai client de 15 s, réseau coupé, 404, 400 « invalide » | variable | oui |

Si l'abonné renvoie le même texte dans les 10 minutes, la clé d'idempotence est la même et aucun doublon ne part. Si l'envoi précédent est encore en cours, Resend répond 409 `concurrent_idempotent_requests` : le même message s'affiche et reste vrai. Si l'envoi précédent est terminé, Resend renvoie sa réponse d'origine et l'écran affiche le succès. **PASS.**

Non bloquant (O1) : seuls les messages `trop` et `nonPremium` disent « Ton texte reste dans le champ ». Le message `envoi` ne le dit pas, alors que la capture montre que le texte y reste bien.

## 2. Section 9 face aux parties 4 et 6 et aux articles 7 et 10 des CGU

| Sujet | Section 9 | Autre texte | Cohérent |
|---|---|---|---|
| Destinataire | alex@, hébergée chez IONOS, transférée vers Gmail | Partie 4 : IONOS (alex@, transfert vers Gmail) et Google (Gmail reçoit contact@ et alex@) | oui |
| Prestataires | Resend et outils de rédaction (« voir la partie 4 ») | Partie 4 : Resend et outils de rédaction listés | oui |
| Conservation | au plus 6 mois après le dernier échange, même si le compte est supprimé, effacement possible plus tôt | Partie 6, dernier paragraphe, et CGU art. 7 : même durée, même règle | oui |
| Compte supprimé | durée propre | Partie 6 (« sauf les exceptions indiquées ») et art. 7 (« suivent leur propre durée ») | oui |
| Publication | « Rien n'est publié sans ton accord » | CGU art. 10 : même phrase | oui |
| Droits | contact@, renvoi à la partie 7 | Partie 7 : contact@, réponse sous un mois | oui |

L'art. 10 dit « les e-mails déjà reçus restent dans ta boîte » : cela concerne la boîte de l'abonné, pas celle de l'équipe. Pas de contradiction avec les 6 mois. **PASS, aucune contradiction.**

Non bloquants :
- **O2** : la règle des 6 mois ne vise que les « boîtes e-mail de l'équipe ». Rien n'est dit sur ce que gardent les outils de rédaction, qui ne sont pas nommés et dont la durée n'est pas donnée. La phrase reste exacte, mais une demande d'effacement doit aussi couvrir ces outils. À voir avec @legal et Thomas : soit vérifier les réglages (aucun historique gardé), soit ajouter une précision.
- **O3** : la partie 4 ne dit pas qui héberge contact@. Si c'est aussi IONOS, la ligne IONOS devrait la citer. Question pour Thomas.

## 3. Design (captures v3, lues une par une)

- Le champ a un contour gris visible au repos et un contour violet net au focus (360 et 844x390). Il est rouge seulement en erreur de saisie.
- Texte saisi en 16 px (`text-base`, `question-equipe-card.tsx:132`), donc pas de zoom sur iOS. À l'écran, il paraît plus grand que l'aide, ce qui est cohérent.
- « Envoi en cours » : texte clair sur un violet atténué (`opacity-80`). Il se lit et on comprend que le bouton est désactivé.
- Succès : encadré vert avec une coche, phrase complète, champ vidé. C'est clair.
- Erreur d'envoi : texte rouge, lien contact@ souligné, texte gardé dans le champ.
- Rien ne déborde à 360, à 390 ni en paysage 844x390. En paysage, le compteur passe à droite, sur la ligne de l'exemple. Le profil complet à 390 est propre.
- Case de la lettre de la semaine : visible au profil (390 et 1440) et au retour de paiement (390), avec le texte légal et le lien Confidentialité.

Non bloquants :
- **O4** : « deviens-marrant SAS » est coupé au trait d'union en fin de ligne (case de la lettre au profil 390 et au retour de paiement 390). On peut l'éviter avec un trait d'union insécable via `frTypo`.
- **O5** : pas de capture de la case de la lettre à 360. Le reste a été capturé à 360.

Zéro tiret cadratin ou demi-cadratin dans les textes relus (vérifié sur les extraits affichés).

## Top 3 (tous non bloquants)

1. O2 : préciser ou vérifier ce que gardent les outils de rédaction (@legal et Thomas).
2. O3 : dire qui héberge contact@ dans la partie 4 si ce n'est pas seulement Gmail (Thomas).
3. O4 : trait d'union insécable dans « deviens-marrant SAS » (@fullstack).

Sources : [Resend, Idempotency Keys](https://resend.com/changelog/idempotency-keys)
