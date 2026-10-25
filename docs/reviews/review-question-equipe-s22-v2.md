# Relecture à l'aveugle finale : « Ta question à l'équipe » (s22, v2)

Date : 25/10/2026. Relecteur : @reviewer. À l'aveugle : docs/reviews/, docs/design/ et le scratchpad n'ont pas été lus.
Périmètre lu : `config/textes/question-equipe-s22.ts`, `config/question-equipe.ts`, `components/profil/question-equipe-card.tsx`, `components/profil/question-equipe-messages.tsx`, `lib/question-equipe.ts`, `app/api/question-equipe/route.ts`, `lib/lettre/inscription.ts#avecDelai`, confidentialité (parties 4, 6, 9), CGU (articles 7, 10), `lettre-hebdo-s21.ts` (ligne de pied), playbook (rappels de réponse), `docs/copy/ton-alex.md`. Captures 390 px : les 14 états plus les 5 extraits légaux.

## Verdict : NO-GO, 8,5/10 (2 bloquants, corrigeables en moins d'une heure)

**Résumé exécutif.** L'encadré est clair, donne envie et reste dans le ton (tutoiement, phrases courtes, aucune limite affichée, aucune mention IA, zéro tiret). Les délais sont identiques partout. L'e-mail reçu par l'équipe ne contient rien d'interne. Il reste deux points bloquants, selon la règle « affirmation fausse ou contradiction = bloquant ». (1) Le message d'erreur d'envoi affirme « Ton message n'est pas parti », alors que le code prévoit exactement le cas où il est parti. (2) La section 9 de la confidentialité dit que le message reste dans « la boîte » IONOS. Les parties 4 et 6 disent qu'il arrive aussi dans Gmail et parlent « des boîtes ». Une fois ces deux phrases corrigées puis revues, l'ouverture peut passer en GO (9/10 attendu).

**Résumé technique.** Vérité : 1 phrase fausse dans un cas prévu par le code (B1). Cohérence : 1 écart entre la section 9 et les parties 4 et 6 (B2). Forme : propre sur les 14 états à 390 px. Deux défauts typographiques visibles dans les captures légales, mais déjà présents avant la fonction et hors périmètre.

## Notes par critère

| Critère | Note | Commentaire |
|---|---|---|
| Clarté et envie | 9 | Accroche concrète (« cloué le bec », « silence gênant »), libellé « Ta situation », exemple utile. Aucun mot de trop. |
| Vérité vs code | 7 | B1. Le reste est conforme : destinataire alex@ (config:22), Reply-To = adresse du compte en base (route:50,66), rien en base (route:16, limiteur haché), champ vidé seulement au succès (card:91), texte gardé en cas d'erreur, perdu à la reconnexion (navigation vers /login). |
| Cohérence encadré / e-mail / confidentialité / CGU / lettre | 8 | Délai identique sur les 5 supports. B2 (section 9 vs parties 4 et 6). P2-1 (« espace Premium »). |
| E-mail équipe recopié dans une réponse | 9 | Objet et corps sans donnée interne, adressés à l'abonné. Point d'attention sur l'adresse d'expédition de la réponse (P1-1, process). |
| Ton maison | 9 | Tutoyé, ni coach ni corporate. CGU 10 mélange « les abonnés » et « te » (P3-2). |
| Forme (captures) | 9 | Hiérarchie nette, erreurs lisibles, bouton grisé quand il faut, succès bien visible, halo rouge sur le champ vide. |
| Tirets / IA | 10 | Aucun tiret cadratin ni demi-cadratin (Grep négatif). « Outils de rédaction », jamais « IA ». |

## Bloquants

**B1. Erreur d'envoi : « n'est pas parti » est faux dans un cas prévu par le code** (`question-equipe-s22.ts:53`)
Ce que fait le code : `avecDelai` (`lib/lettre/inscription.ts:65-75`) est un `Promise.race`. Après 5 s, l'API répond 503 `envoi`, mais l'appel à Resend continue et peut aboutir. Côté navigateur, l'abandon à 15 s ou une coupure réseau donne la même erreur, même si le serveur a envoyé. Le composant le documente lui-même (card:11-12 : « Resend lent, réponse perdue », d'où la clé d'idempotence).
- Actuel : « Ton message n'est pas parti. Réessaie dans un instant, ou écris-nous à contact@deviens-marrant.fr. »
- Proposé : « On n'a pas pu confirmer l'envoi. Réessaie dans un instant, ou écris-nous à contact@deviens-marrant.fr. »
- Cette version est vraie dans tous les cas : Resend en échec, délai dépassé, base indisponible, réseau coupé. « Réessaie » reste sans risque, puisque le même texte renvoyé dans les 10 minutes ne crée pas de second e-mail. Agent : @copywriter (texte), @fullstack (une chaîne à changer, plus le test qui la vérifie s'il existe).

**B2. Confidentialité section 9 : « la boîte » IONOS seule, contredite par les parties 4 et 6** (`question-equipe-s22.ts:96-97`)
La partie 4 dit qu'IONOS transfère vers Gmail. La partie 6 dit « les boîtes e-mail de l'équipe au plus 6 mois ». La section 9, qui est la seule cible du lien « Confidentialité » de l'encadré, dit « dans sa boîte alex@ hébergée chez IONOS » et « restent dans la boîte e-mail de l'équipe 6 mois ». Elle laisse donc croire à une seule boîte et à une durée fixe.
- Puce 3, actuel : « Qui y accède : l'équipe, dans sa boîte alex@deviens-marrant.fr, hébergée chez IONOS. Ton message passe par Resend (envoi), […] »
- Puce 3, proposé : « Qui y accède : l'équipe, dans sa boîte alex@deviens-marrant.fr, hébergée chez IONOS et transférée vers sa messagerie Gmail (Google). Ton message passe par Resend (envoi), […] »
- Puce 4, actuel : « […] restent dans la boîte e-mail de l'équipe 6 mois après notre dernier échange, puis sont effacées. »
- Puce 4, proposé : « […] restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. »
- Ce n'est pas une nouvelle mention : on aligne sur les parties 4 et 6 et sur la CGU 7, comme le permet la décision du fondateur. Le texte était repris « mot pour mot » de @legal, donc visa @legal en une ligne. Agent : @legal, puis @fullstack.

## Top 3 corrections prioritaires

1. B1 : remplacer « Ton message n'est pas parti » par « On n'a pas pu confirmer l'envoi ».
2. B2 : section 9, ajouter Gmail et écrire « les boîtes » et « au plus 6 mois ».
3. P1-1 : dans le playbook, écrire depuis quelle adresse on répond (alex@, pas l'adresse Gmail personnelle).

## Corrections non bloquantes, classées

**P1-1. Adresse d'expédition des réponses (process, playbook:590-599).** Les questions arrivent dans Gmail par transfert. Si on clique sur « Répondre » sans avoir configuré Gmail pour envoyer en tant que alex@deviens-marrant.fr, la réponse part de l'adresse Gmail de l'équipe et l'abonné la voit. C'est la seule fuite possible de donnée interne. Ajouter au playbook : « Répondre depuis alex@deviens-marrant.fr (Gmail : Envoyer en tant que) ; vérifier le champ De avant d'envoyer. » Agent : @infrastructure (configuration), Thomas.

**P1-2. Signature des réponses : deux documents du fondateur ne disent pas la même chose.** Le playbook (l. 596) dit « L'Équipe Deviens Marrant ». `ton-alex.md` (l. 4-5) dit qu'Alex répond aux e-mails et signe « Alex, Deviens Marrant ». Ce n'est pas un choix à remettre en cause, juste à trancher par Thomas pour ce canal. Le nom du service (« l'équipe ») plaide pour la version du playbook, avec une exception à noter dans `ton-alex.md`.

**P2-1. Corps de l'e-mail : « ton espace Premium » n'existe nulle part sur le site** (`question-equipe-s22.ts:87`). L'encadré, la CGU 10 et la ligne de la lettre disent « profil ».
- Actuel : « Question envoyée depuis ton espace Premium le 25/10/2026 à 14:32. »
- Proposé : « Question envoyée depuis ton profil le 25/10/2026 à 14:32. »

**P2-2. « Rien n'est publié ni repris ailleurs » juste après « outils de rédaction »** (section 9 puce 3, CGU 10). Collée au passage dans un outil, la phrase peut se lire comme une contradiction.
- Proposé : « Rien n'est publié ni réutilisé (site, lettre, réseaux) sans ton accord. » Visa @legal.

**P3-1. CGU 10 : l'amorce « Ta question à l'équipe. » est en texte normal** (capture cgu-article-10-390). Elle se lit comme une phrase sans verbe. La mettre en gras (titre en ligne) ou la retirer, puisque le titre de l'article la contient déjà.

**P3-2. CGU 10 change de personne en cours de route.** « Les abonnés Premium peuvent écrire […] depuis leur profil », puis « on te prévient ». Proposé : « Si tu es abonné Premium, tu peux écrire à l'équipe depuis ton profil pour décrire une situation où la répartie t'a manqué. » Visa @legal.

**P3-3. Le compteur et la validation ne comptent pas pareil.** Le compteur compte avant le retrait des espaces de bord (card:56-57), la validation après (card:73). Avec 1 000 caractères plus un espace final, le compteur passe au rouge mais l'envoi part. Proposé : calculer `depasse` sur `question.trim()`. Agent : @fullstack.

**P3-4. La ligne de la lettre n'a pas de lien.** Elle dit « depuis ton profil » sans URL, dans un e-mail en texte brut. Si le pied de la lettre ne mène pas déjà au profil, ajouter « (deviens-marrant.fr/profil) ».

**P3-5. Hors périmètre, déjà présent avant la fonction, visible dans les captures.** Partie 6 : « pendant 10 / ans » est coupé en fin de ligne. CGU 7 : « immédiate / : » laisse un deux-points en début de ligne. Ces deux paragraphes ne passent pas par `frTypo`. Agent : @fullstack, à faire à part.

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| Erreur `envoi` (« n'est pas parti ») | `avecDelai` + card:11-12 (envoi possible après 5 s) | Le texte affirme une chose que le code ne garantit pas | Bloquante | B1, @copywriter puis @fullstack |
| Confidentialité 9 (« la boîte », « 6 mois ») | Confidentialité 4 et 6, CGU 7 (« les boîtes », Gmail, « au plus ») | Où et combien de temps le message est gardé | Bloquante | B2, @legal puis @fullstack |
| Corps de l'e-mail (« espace Premium ») | Encadré, CGU 10, lettre (« profil ») | Nom du lieu d'envoi | Mineure | P2-1 |
| Playbook (signature « L'Équipe ») | ton-alex.md (signature « Alex ») | Signature des réponses | Mineure | P1-2, Thomas |

Points vérifiés et cohérents : délai « en général sous 1 à 2 jours ouvrés » dans l'en-tête, le succès, la CGU 10 et la lettre. « Au plus tard 3 jours ouvrés » n'apparaît que dans la CGU, comme décidé. Destinataire alex@ dans la config, la section 9 et la partie 4. Adresse de réponse = adresse du compte (succès, section 9 puce 1, route). Fin de Premium (CGU 10, erreur 403, bouton grisé). Encadré absent pour un compte gratuit (capture profil-gratuit-390). Ancre `#question-equipe` présente sur la confidentialité.

## Angles morts

- La carte Abonnement d'un compte gratuit (« Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois ») ne cite pas la fonction. Le meilleur argument humain de Premium n'apparaît pas au moment où l'on décide de payer. Agent : @copywriter, à faire à part (hors de cette relecture).

## Décisions à confirmer par l'utilisateur

1. Signature des réponses : « L'Équipe Deviens Marrant » ou « Alex, Deviens Marrant » (P1-2).
2. Configuration Gmail pour envoyer en tant que alex@ avant la première réponse (P1-1).

## Recommandation

NO-GO tant que B1 et B2 ne sont pas corrigés. À relancer : @copywriter (B1, P2-1), @legal (B2, P2-2, P3-2, visa en une ligne), puis @fullstack (intégration, P3-3). La contre-relecture ne porte que sur B1 et B2 ; si les deux passent, GO.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-question-equipe-s22-v2.md`
- Décision : NO-GO 8,5/10, 2 bloquants (B1 erreur « n'est pas parti » fausse si Resend répond après 5 s ; B2 section 9 incohérente avec les parties 4 et 6 sur Gmail, le pluriel et « au plus »)
- Points d'attention : adresse d'expédition des réponses depuis Gmail (seule fuite interne possible) ; signature à trancher par Thomas ; aucun autre fichier modifié, aucun commit
---
