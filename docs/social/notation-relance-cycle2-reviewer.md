# Notation indépendante, cycle 2 : relance des 3 réseaux (s15, 05/10/2026, @reviewer)

Objet noté : `docs/social/strategie-relance-v2.md` (V2:ligne), au regard de ma notation du cycle 1 (C1:ligne), de `founder-preferences.md` (FP:ligne), de `project-context.md` (personas Yanis, Sophie, Marc, PC:20-24), du catalogue validé (CV:ligne) et des articles sources ouverts un par un. Barre : 10 = publiable tel quel par une marque humour FR exigeante. Vannes à la 1re personne jugées comme vannes citées (même règle qu'au cycle 1). Les [CHOIX UTILISATEUR] ne sont pas rediscutés.

## 1. Vérification des corrections du cycle 1

| Correction C1 | Statut | Preuve |
|---|---|---|
| K1 (a) à (f) : grille unique, piliers, « conseil en une carte », Marc, files, stock | Appliquées ; Marc sur LinkedIn non appliqué, **justification acceptée** (rôle bureau gardé, Marc servi par des situations de travail, relevé J+28) | V2:17-31, V2:15, V2:101-107, V2:155 |
| K2 X1 exclu du lot | Remplacé par « une seule fois, file X retenue » : **accepté** (rien n'est parti au 05/10) | V2:113 |
| K2 X3 variante « plus de six » | Non appliquée, **justifiée** (refusée à l'aveugle) ; modèle devenu vanne + quiz | V2:156 |
| K2 IG1, IG2, IG3 carte 3, L1, L2, L3, X2 | Appliqués mot pour mot | V2:117-151 |
| K5 Halloween, LinkedIn anniversaire, Noël au boulot, pot de départ, lot 2 | Appliqués | V2:66-79 |
| K9 « 2 ou 3 phrases », relecture à l'aveugle, file non relâchée | Appliqués | V2:3, V2:29, V2:111 |

Sources ouvertes : les 10 identifiants cités sont dans CV mot pour mot (CV:10, 13, 17, 19, 81, 96, 99, 106, 132, 145) ; X2 = A1 message n°4 (`A1-message-anniversaire-drole.md:64`, 21 messages, donc « Les 20 autres » exact, slug A1:9 exact) ; IG2 = S2:104 ; quiz : titre, « environ 2 minutes » et « sans inscription » confirmés (`apps/web/src/app/(dashboard)/quiz-humour/page.tsx:11, 38, 48`). Tirets cadratins dans V2 : 0 (Grep).

## 2. Notes

| Critère | Note | Preuve | Correction précise |
|---|---|---|---|
| K1 Stratégie | 8 | Grille, piliers (50/33/8/8 recalculés juste), funnel, Marc et files tranchés. Restent 4 défauts : (a) V2:58 met l'e-mail avant Google seulement si `origine` = Instagram, or LinkedIn ouvre aussi les liens dans un navigateur intégré et Google refuse l'OAuth dans tout navigateur intégré (erreur `disallowed_useragent`) : le réseau relancé « tout de suite » n'est pas couvert ; (b) le lien LinkedIn « en premier commentaire » (V2:50) n'est publiable par Buffer que sur offre payante, et la spec @fullstack (V2:54-60) ne le prévoit pas : sinon, action manuelle chaque semaine, contraire au contenu préparé par lot (FP:39, FP:55) ; (c) « +400 abonnés combinés » (V2:99) alors que les seuils J+56 font 300 + 100 + 80 = 480 (V2:91-93) ; (d) « 6 vannes par semaine » (V2:31) contre 7 vannes du catalogue par semaine (V2:28). | (a) Spec point 4 : « détection du navigateur intégré par user-agent (Instagram, LinkedIn, Facebook) : formulaire e-mail avant Google, quelle que soit l'`origine` ». (b) Ajouter un point 7 : « premier commentaire LinkedIn publié par Buffer avec le post (offre payante vérifiée par Thomas) ; sinon le lien passe dans le corps du post, dernière phrase ». (c) « +480 ». (d) « 7 vannes par semaine ». |
| K2 X1 Alexa | 10 | Plancher fondateur (FP:33), CV:10 mot pour mot, une seule date. | Aucune. Voir K5 (relais S4 du 26/10). |
| K2 X2 Anniversaire | 9 | Source exacte (A1:64), chute sèche, compte juste, UTM complets. Seul manque : le message n'est pas figé (« à confirmer parmi les n°4, 12 et 21 », V2:117), et le relais LinkedIn du même jour (V2:69) n'a pas de message attribué. | Figer n°4 sur X ; attribuer n°12 au relais LinkedIn du 22/10 (registre bureau, réseau différent). |
| K2 X3 Small talk + quiz | 8 | CV:13 exact, quiz vérifié. Le 2e bloc est collé sans lien avec la vanne, et les guillemets imbriqués alourdissent le tweet. | 2e bloc : « Observateur, absurde ou taquin ? Le quiz te le dit en environ 2 minutes, sans inscription : https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz » (profils réels, page.tsx:13). |
| K2 IG1 Mimes | 10 | CV:145 mot pour mot, légende « à envoyer », 15 jours après le relais S2. | Aucune. |
| K2 IG2 Entretien | 9 | CV:96 = S2:104, « lien en bio » une seule fois. La légende compte (« Une des 5... les quatre autres ») sans dire à quoi sert la vanne. | Légende : « Pour le premier déjeuner avec l'équipe, quand on te demande comment tu es arrivé là. Les quatre autres situations sont dans l'article, lien en bio. » |
| K2 IG3 Carrousel chien | 7 | Cartes 1-2 = CV:17 ; décryptage présent dans `decryptage-ecrit-2.json`. Carte 3 (mon texte du cycle 1) : « juste pas pour toi » fait du lecteur le maître du chien, alors que la vanne dit « je ». Carte 4 : « Chaque vanne du site a son décryptage » n'est pas prouvé sur les 125 vannes (G_PROOF). | Carte 3 : « Pourquoi ça fait rire : le plan marche parfaitement, sauf pour celui qui l'a eu. Ton prochain plan raté se raconte pareil : dis qui en a profité à ta place. » Carte 4 : « D'autres vannes décryptées comme celle-ci sont sur le site, lien en bio. » (ou garder la phrase si @fullstack confirme 125/125 décryptages en base). |
| K2 L1 Mug | 10 | CV:99 mot pour mot, 3 phrases, jeudi 15/10. | Aucune. |
| K2 L2 « T'as deux minutes ? » | 8 | Mécanique et « salle Monet » tiennent ; thème courant, mais relecture à l'aveugle et repli CV:19 prévus (accepté). Défaut de logique : les trois petits points s'affichent tout de suite, c'est leur durée qui angoisse. | « Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Le temps que ses trois petits points deviennent un message, tu as relu ta semaine, trouvé deux erreurs et préparé ta défense. Il cherchait la salle Monet. » |
| K2 L3 Relais S2 | 6 | (a) Chute éventée : « ce qu'est devenu alternant1 » donne la chute de S2:84 dans le post, le clic n'a plus d'objet ; (b) source déclarée « situation 2 » mais la scène du tour de table et la personne qui a « monté sa boîte à 19 ans » sont du texte neuf (Grep « 19 ans » : 0 dans S2), à faire passer à l'aveugle et à compter dans le « texte neuf » de V2:28 ; (c) phrase 2 de 35 mots, ton d'annonce. | « Au tour de table, la personne juste avant toi vient d'annoncer qu'elle a monté sa boîte à 19 ans, et ton cerveau n'a gardé que « Bonjour, moi c'est ». On a réuni 5 accroches pour ce moment-là, dont celle de l'alternant qui a reçu l'adresse « alternant2 ». L'article est en premier commentaire. » Mention « texte neuf, relecture à l'aveugle ». |
| K5 Calendrier | 7 | Tous les ajouts du cycle 1 sont faits, jours de semaine justes (12/10 lundi, 25/10 dimanche, 24/12 jeudi). Défauts : (a) Halloween 30/10 : la vanne `cs14jk1bc86d3502a2cef27b` n'est pas dans l'article Halloween (Grep « en couple », « trop vite » : 0 dans `S1-halloween.md`), même défaut qu'« Antoine bar » au cycle 1, et sur Instagram « lien en bio » mène au dernier article (29/10), pas à Halloween (V2:56) ; (b) 24/12 : `cs14jkee5c537f7286c1da98` = vanne n°18 de l'article couple (`A4-blagues-de-couple.md:122`), relayé le 05/11 sur X et Instagram : doublon à moins de 90 jours si le 05/11 la prend ; (c) relais S4 du 26/10 : la vanne 1 de l'article est Alexa (`S4-blagues-ia-assistants-vocaux.md:40`), déjà sur X le 13/10 ; (d) « Toussaint 01/11 : silence » tombe un dimanche, jour sans post : pivot vide. | (a) X 30/10 : vanne tirée de S1 mot pour mot + lien UTM ; Instagram 30/10 : carte vanne `cs14jk1bc86d3502a2cef27b` sans lien. (b) Règle écrite : « relais couple du 05/11 : jamais la n°18, réservée au 24/12 ». (c) « Relais S4 sur X : toute vanne sauf Alexa ». (d) Supprimer la mention. |
| K9 Conformité | 9 | 0 tiret cadratin, 0 mention IA (Alexa = sujet, FP:34), X sans thread, LinkedIn 3 phrases tutoyées sans leçon, compte = marque (« On a réuni »), humoristes autorisés avec citation réelle (FP:54), départ conditionné aux étalons (FP:55), aucun prix. Écart : 1 claim non prouvé (IG3 carte 4) et 1 texte neuf déclaré comme source (L3). | Voir IG3 et L3. |

Moyenne K2 : 8,6 (77/90), contre 7,4 au cycle 1. Critères à 10 : X1, IG1, L1.

## 3. Passe de contrôle : défauts créés par le cycle 1

1. **Chute éventée (L3)** : ma correction du cycle 1 a introduit « ce qu'est devenu alternant1 », qui raconte la vanne de l'article au lieu d'y renvoyer. Défaut de mon fait, corrigé ci-dessus.
2. **Glissement de personne (IG3 carte 3)** : mon texte « juste pas pour toi » contredit le « je » de la vanne. Corrigé ci-dessus.
3. **Contradiction Halloween** : l'ajout demandé (« vanne de l'article + lien ») a été rempli avec une vanne du catalogue absente de l'article, et le « lien en bio » Instagram ne mène pas à l'article (`/liens` affiche le dernier article).
4. **Écho entre réseaux à 90 jours** : les ajouts de calendrier (24/12, relais S4) recroisent des vannes déjà prévues (A4 n°18, Alexa) ; la règle anti-répétition existe (V2:31) mais aucun cas n'est appliqué.
5. **Chiffre décalé** : la phrase d'honnêteté (+400) n'a pas suivi les seuils (+480).
Aucun écho de mots entre les 9 posts, aucune chute répétée entre réseaux le même jour (12/10 : IG2 situation 4 ; 13/10 : L3 situation 2).

## 4. Ce qu'il faut pour 10/10

1. @social remplace IG3 (cartes 3 et 4), L2, L3 et la 2e partie de X3 par les textes ci-dessus, fige X2 (n°4) et donne la n°12 au LinkedIn du 22/10, réécrit la légende d'IG2.
2. Relecture à l'aveugle (2 relecteurs) de L2, L3 (scène du tour de table) et IG3 carte 3 avant la présentation à Thomas.
3. @social corrige le calendrier : vanne S1 pour le relais Halloween sur X, carte sans lien sur Instagram, n°18 réservée au 24/12, Alexa exclue du relais S4, pivot du 01/11 supprimé.
4. @social complète la spec §2 : détection du navigateur intégré (Instagram, LinkedIn) et premier commentaire LinkedIn via Buffer (offre à vérifier par Thomas, sinon lien dans le post).
5. @fullstack confirme le nombre de vannes du catalogue avec décryptage en base (carte 4 d'IG3).
6. Corriger « +400 » en « +480 » et « 6 vannes » en « 7 vannes ».
7. Cycle 3 : renoter sur les cartes rendues (K3, gabarit @design), toujours pas livrées.

Sources externes : [Google Developers Blog, OAuth et webviews intégrées](https://developers.googleblog.com/upcoming-security-changes-to-googles-oauth-20-authorization-endpoint-in-embedded-webviews/) ; [Buffer, LinkedIn et premier commentaire](https://support.buffer.com/article/560-using-linkedin-with-buffer).
