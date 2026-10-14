# Relecture @reviewer 3 : voix-publique.md v3 (14/10/2026)

Périmètre : application des décisions FP l.102 et l.103 (point 7 exclu, comme demandé), §5.6, tirets cadratins, émojis, prix, attributions. Sans git (consigne) : contrôle fait sur le fichier entier (655 lignes), pas sur le diff.

**Contrôles PASS.** Tirets cadratins : 0. Émojis : 0. Prix : aucun montant ; `€` n'apparaît que comme motif de Grep (l.594-595). Décisions 1 (noreply@ = « L'Équipe »), 2 (forums au cas par cas), 3 (masculin, l.71, aucun accord féminin), 4 (tutoiement : §2.4, §4.5, §9 l.12, §10.2), 5 (reportés : §5.3, §5.4, §5.7, §5.9, §10.4), 8 (émojis : §7.1, §9 l.7) et 9 (§4.1, §8.1) : appliquées. §5.6 : numéros justes (3114 national, gratuit, 24 h/24, outre-mer compris, source sante.fr ; 15 ; 112), ton sobre, aucun humour.

## Défauts

| # | Gravité | Où | Défaut | Correction exacte |
|---|---|---|---|---|
| 1 | Bloquant | l.23, l.63, l.632 | « Pas de signature » en message privé et en commentaire est attribué à FP l.102/l.103. Or FP l.102 dit qu'Alex « signe "Alex, Deviens Marrant" » dans « les e-mails, forums, commentaires et messages privés », et l.103 ne restreint que les e-mails et les forums. C'est une interprétation présentée comme une décision de Thomas. | l.632, remplacer « aucune dans les messages privés et commentaires, forums au cas par cas (§2.1, FP l.103) » par « forums au cas par cas (FP l.103) ; aucune dans les messages privés et commentaires (application, sans source propre : FP l.102 cite ces canaux sans trancher la signature, à trancher par Thomas, §10.4) ». Même mention à la fin de la phrase « Messages privés et commentaires : pas de signature, le compte identifié suffit » (l.23) et après « (étalon 1, BR) » (l.63). |
| 2 | Bloquant | l.82, l.197, l.223, l.329 | La phrase de présentation « Je suis Alex, de Deviens Marrant » est sourcée « FP l.102 » alors que FP l.102 ne la contient pas, et l.43 la marque elle-même « application, sans source propre ». | Aux 4 endroits, remplacer la source « (FP l.102) » ou « étalon 3, FP l.102 » qui porte sur cette phrase par « (application de FP l.102, sans source propre) ». |
| 3 | Moyen | l.649-651 | Le §10.4 annonce un seul point restant, alors que la formulation du §5.6 est « non validée par Thomas » (l.396). | Ajouter : « 2. **Validation par Thomas de la formulation détresse** (§5.6). En attendant, elle reste un brouillon soumis à Thomas. » |
| 4 | Moyen | l.394 | Si l'e-mail du jour à Thomas est déjà parti, la détresse doit passer « par la réponse de la session ». Or l'agent CEO tourne sans session : l'alerte attend le lendemain. Le document ne peut pas trancher seul cette dérogation à FP l.64. | Remplacer la phrase par : « Si l'e-mail du jour à Thomas est déjà parti, une détresse autorise-t-elle un second e-mail le même jour ? **À trancher par Thomas** (§10.4). En attendant : la remontée passe par la réponse de la session si elle existe, sinon en tête de l'e-mail du lendemain. » Ajouter ce point au §10.4. |
| 5 | Moyen | l.396 | Le 3114 ne fonctionne qu'en France, alors que le §4.2 vise les forums francophones (Belgique, Suisse, Québec). | Ajouter après la formulation : « Le 3114 ne fonctionne qu'en France (outre-mer compris). Si la personne écrit d'un autre pays, ne donner aucun numéro de mémoire : écrire « Si tu es en danger immédiat, appelle les secours de ton pays » et remonter à Thomas. » |
| 6 | Faible | l.284 | Pour les commentaires, la liste « Hors banque : remonter sans répondre » ne cite pas la détresse, alors que le §5.6 prévoit une réponse : les deux règles se contredisent. | Ajouter à la fin de la cellule : « ; détresse ou sujet sensible : conduite du §5.6 (réponse sobre en brouillon et remontée immédiate) ». |
| 7 | Faible | §9 | La grille ne vérifie ni le masculin (décision 3) ni l'absence totale d'humour sur un sujet sensible : la ligne 14 tolère une punchline. | Ajouter : « 27 \| Accords d'Alex au masculin (« ravi », « content ») et, sur un sujet sensible (§5.6), aucun trait d'humour, aucun conseil médical, cas remonté à Thomas ? \| Lecture ». |
| 8 | Faible | l.153 | « La signature des e-mails et des pitchs est "Alex, Deviens Marrant" » contredit l'étalon 2, qui garde « L'Équipe ». Et « signature constante » ne tient plus. | Remplacer « signature constante (CVU §0) » par « signature conforme à l'adresse d'envoi », et « la signature des e-mails et des pitchs » par « la signature des e-mails envoyés depuis l'adresse d'Alex et des pitchs ». |
| 9 | Faible | l.372, l.403 | La « conduite d'attente » (§5.3) et « sans e-mail d'excuses » (§5.7) suivent la mention FP l.103 sans marquage. Thomas a reporté les formules types, il n'a pas décidé ces conduites. | Ajouter « (application, sans source propre) » après « aucune vanne » (l.372) et après « sans e-mail d'excuses » (l.403). |

## Top 3

1. Défaut 1 : une signature attribuée à Thomas sur des canaux où sa décision dit l'inverse.
2. Défaut 2 : une phrase inventée par la session et sourcée FP l.102.
3. Défauts 4 et 5 : une détresse qui peut rester un jour sans alerte, et un numéro inutilisable hors de France.

## Verdict

**NO-GO.** Les défauts 1 et 2 enfreignent le critère « rien d'inventé présenté comme décision de Thomas ». Après correction, revérifier uniquement les lignes citées et le §10.4.
