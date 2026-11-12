# Tour 4 : relecture à l'aveugle de l'architecture de contenu v4 (@elon)

> AVIS CONSULTATIF, validation requise avant exécution. Relecteur indépendant, sans accès aux autres avis du tour 4.
> Document noté : `architecture-contenu-v4.md` (V4), même grille C1 à C10. Fait vérifié par la session et fourni pour ce tour : profils du quiz vers parcours conseillé (`quiz-data.ts` l. 41 à 100) : OBSERVATEUR → confiance, STORYTELLER → storytelling, ABSURDE → machine-a-cafe, PUNCHLINEUR → repartie, TAQUIN → repartie.

## Verdict en une phrase

Le moteur est maintenant bien conçu dans son principe : la marche monte avec la réussite, la difficulté monte, la révision va jusqu'à J+21 et J+30, le stock tient, et il y a une mesure de compétence. Il reste trois défauts dans la carte elle-même et dans l'aiguillage :
- **« Tu avais une réponse ? » est posé avant que les répliques soient visibles**, alors que l'option « à peu près celle-là » suppose de les avoir vues ;
- **les cartes du carnet posent une question dont l'étiquette donne la réponse** (« ambiance tendue » mène forcément à la sortie polie), soit 60 à 75 % des cartes ;
- **l'aiguillage d'entrée ne correspond pas au code du quiz**, et le persona principal (Yanis) arrive par défaut sur une scène de bureau.

## Notes

| # | Critère | T3 | T4 | Justification (passage cité) |
|---|---|---|---|---|
| C1 | Valeur persona | 9 | 9 | Missions selon la réussite (« Un introverti n'est jamais poussé en face parce que c'est mardi », 2.4), courbe de compétence (4.4), circuit de réponse unique (2.6). Mais sans quiz, le persona principal reçoit « Le collègue qui lance "ça va ?" à la machine à café » et Machine à Café (4.2, « Aucun signal »). V4 le voit elle-même : « Sans quiz, le produit lui propose Machine à Café : à tester » (4.3). |
| C2 | Respect des décisions | 9 | 9 | 25/10 et 12/11 respectés pour « Mes questions » ; C3 B et C8 marquées. Écart : les options A (reco) et B de C10 incluent « un avis juridique d'une page » sans être marquées « rouvre la décision du 25/10 » (« pas de nouveaux avis », que V4 cite pourtant en 1.1 et en C10 C), alors que le 12/11 demande de traiter les conséquences « sans alourdir » (M5). |
| C3 | Zéro donnée inventée | 9 | 9 | Preuve du carnet exacte (5 répliques avec deux critiques, 10 avec un seul, H10 jamais relue). Mais 4.2 laisse « [À VÉRIFIER : sauf Storyteller vers Storytelling] », alors que le code se vérifie, et 4.3 affirme pour Sophie, profil Observateur, « Cas nominal » Machine à Café, quand le code l'envoie vers Confiance (M3). |
| C4 | Rubriques claires | 7 | 9 | 6 entrées comptées à l'écran, « Aujourd'hui » toujours présent, reco ferme, test des 3 secondes prévu. Reste : la raison donnée aux tours 2 et 3 pour refuser « Comprendre » (« Vocabulaire » doit être visible) ne tient plus avec la reco B, où il devient le titre d'un bloc de « Bibliothèque ». Il faut le dire à Thomas en clair (M8). |
| C5 | Ambition | 9 | 9 | Moteur adaptatif, régime mensuel chiffré (7.3 bis), mesure de compétence en indicateur n°1 (7.6). |
| C6 | Cohérence | 8 | 8 | L'ordre des étapes de la carte se contredit (M1). L'aiguillage contredit le code du quiz (M3). La question de bilan sur la poêle (3.10) fait gagner la sûre « quand l'ambiance est lasse », alors que 3.3 a retiré ce contexte des deux contextes de rafale : c'est cohérent avec « Pour choisir », mais à garder en tête pour E1. |
| C7 | Faisabilité au niveau | 9 | 8 | « Une situation à gérer [...] La réponse propose des répliques, préparée en session et au niveau de la barre Alexa » (2.6). Une réplique écrite pour l'occasion doit être « relue à l'aveugle avant envoi » (`ton-alex.md`), en 1 à 2 jours ouvrés, jusqu'à environ 25 messages par jour. Ce n'est compté nulle part, ni en 7.3 bis ni dans la charge (M6). |
| C8 | Questions à Thomas | 9 | 9 | Langage simple, C9 vide expliquée, C8 honnête. Défaut : le marquage manquant de C10 (M5). |
| C9 | Exemples | 9 | 9 | Accusé de réception, poêle et frigo de la coloc au niveau. « À chaque jour suffit sa peine. Le lundi a pris celle de jeudi, pour dépanner » : je ne vois pas la logique de la chute (pourquoi le lundi dépannerait jeudi ?) et je ne ris pas (M10). |
| C10 | Progression | 8 | 8 | Ordre de tirage P1, P2, P3, compte à rebours proposé et jamais imposé, marches selon le retour : c'est bon. Mais l'entrée par défaut ne correspond pas au persona principal (M4), et la mesure de compétence perd son sens quand le compte à rebours est désactivé, ce qui est le cas par défaut (M7). |

**Note globale : 8,7 / 10** (87 / 10 critères ; T3 : 8,6 ; T2 : 8,2 ; T1 : 5,6).

## Statut de mes corrections du tour 3

| # | Correction T3 | Statut | Commentaire |
|---|---|---|---|
| N1 | Barre sans « Aujourd'hui », 7 entrées | OK | 6.1 : « tout lien visible dans la barre est une entrée » ; 3 variantes à 6 entrées, toutes avec « Aujourd'hui » ; reco B ferme. |
| N2 | Progrès réel invisible | Mal traité (en partie) | « Tu avais une réponse ? », la courbe et l'indicateur n°1 sont là. Mais la question est posée à l'étape 3, avant l'apparition des répliques à l'étape 4, alors que l'option « Oui, à peu près celle-là » suppose de les voir (M1). Et sans compte à rebours, ce qui est le réglage par défaut, la mesure ne dit plus « tac au tac » (M7). |
| N3 | La rafale ne monte pas | OK | Ordre P1, P2, P3 après la semaine 4 ou 20 cartes avec réponse ; « 7 secondes ? » puis « 5 secondes ? » sur proposition ; la risquée surtout en P3. |
| N4 | Réponse de l'équipe qui n'arrive pas | OK | « Un seul circuit » : saisie dans l'outil, historique, e-mail de réponse habituel, recopie de ce qui est fait hors outil, signal dans « Aujourd'hui ». |
| N5 | Cartes du carnet hors règles | OK sur la forme | Deux sortes de cartes annoncées, parts de 60 % et 75 % dites, carnets à trois registres en option marquée (C3 B) : refus de ma reco acceptable. Mais la solution des deux ambiances fixes crée un nouveau défaut (M2). |
| N6 | Missions selon le calendrier | OK | 2.4 : la marche suit le retour ; 4.1 parle de « marche visée ». Cas limites en M9. |
| N7 | Charge à 500 abonnés | OK | Environ 25 par jour ouvré, leviers écrits. Il manque le coût de la barre Alexa dans les réponses (M6). |
| N8 | Exemple du stagiaire | OK | « Elle échoue à la question 2 de la grille : le stagiaire n'est pas là. » |
| N9 | Rédaction de C4, C8, 1.4 | OK | C4 donne la raison de la reco A ; C8 A « ne rouvre rien » ; portée sur le carnet déplacée en C8. |
| N10 | Révision trop courte | OK | J+2, J+7, J+21, retour à J+30 d'une partie des cartes réussies. |

Bilan sur 10 : 9 OK (dont 1 refus acceptable, N5), 1 mal traité en partie (N2).

## Nouvelles corrections

Problème n°1 : M1 et M2. C'est la carte elle-même, l'unité que l'abonné touche chaque jour. Si elle sonne faux, tout le reste du moteur tourne à vide.

M1. **[BLOQUANT] La question « Tu avais une réponse ? » arrive avant les répliques (2.2).**
- Passages : « 3. "Tu avais une réponse ?" : trois boutons fermés, "Rien", "Oui, à peu près celle-là", "Oui, une autre" » ; « 4. Les répliques apparaissent ».
- Problème : on demande à l'abonné de désigner « celle-là » avant de la lui montrer. Dans l'interface, le bouton n'a pas de sens ; dans les données, l'indicateur n°1 de 7.6 est faussé.
- Correction : ordre 1 scène, 2 « Ta réponse d'abord », 3 les répliques apparaissent, 4 « Tu avais une réponse ? » (« Rien », « Oui, proche de celle-ci » en touchant la réplique, « Oui, une autre »), 5 le choix selon le contexte, 6 la règle. Même ordre dans C3 et dans l'étalon E5.

M2. **[BLOQUANT] Les cartes du carnet donnent la réponse dans la question (2.2, 2.3, C3).**
- Passage : « Le contexte est une ambiance, avec deux étiquettes fixes : "ambiance détendue" (la réponse) et "ambiance tendue" (la sortie polie). »
- Problème : « ambiance tendue » mène toujours à la sortie polie. Personne ne se trompe jamais, donc aucune carte du carnet n'est « ratée » et la révision ne s'y déclenche jamais, sauf sur « Rien ». C'est 60 % des cartes à l'ouverture, 75 % ensuite. Un QCM dont la question contient la réponse, Sophie le voit en deux jours et le vit comme un exercice pour enfants : c'est le « scolaire » que la marque refuse.
- Correction, sans texte neuf et sans rouvrir le 03/10 : sur les cartes du carnet, **supprimer l'étape de choix**. Ce sont des cartes de **production** : scène, « Ta réponse d'abord », les deux répliques montrées avec leur ambiance, « Tu avais une réponse ? ». La révision se déclenche sur « Rien ». C'est d'ailleurs le meilleur usage du carnet : la partie qui fait progresser, c'est trouver sa réponse, pas cocher la bonne. Avec ce changement, la reco C3 A (carnet inchangé) tient sans réserve, et C3 B reste un vrai choix pour Thomas. Mettre à jour 2.2 (nom de la carte, par exemple « Et toi ? »), C3 et E5.

M3. **[BLOQUANT] L'aiguillage d'entrée ne correspond pas au code du quiz (4.2, 4.3).**
- Passages : 4.2, « Quiz passé : Observateur → "Le collègue qui lance 'ça va ?' à la machine à café" → le parcours désigné par le quiz » et « [À VÉRIFIER : sauf Storyteller vers Storytelling, 07/10] » ; 4.3, « Sophie | Observateur | Machine à Café [...] | Cas nominal » et « Marc | Storyteller | Confiance ».
- Fait (vérifié par la session) : Observateur → Confiance, Storyteller → Storytelling, Absurde → Machine à Café, Punchlineur et Taquin → Répartie.
- Problème : (a) un abonné Observateur commence par une scène de machine à café puis reçoit Confiance : l'entrée et le parcours ne parlent pas de la même chose ; (b) le « cas nominal » de Sophie est faux, car le produit l'envoie vers Confiance ; (c) Marc, profil Storyteller, reçoit Storytelling et non Confiance. Pour 2 cas d'essai sur 3, le parcours que le produit propose n'est pas celui que leur besoin écrit appelle.
- Correction : remplacer l'[À VÉRIFIER] par le tableau du code ; choisir chaque situation d'entrée dans le thème du parcours désigné (Observateur → une scène d'observation ou de confiance ; Absurde → la machine à café) ; réécrire 4.3 avec le parcours que le produit donne réellement, et en faire le vrai test : « le quiz envoie Sophie, si elle est Observatrice, vers Confiance : est-ce bon pour elle ? ». On ne touche pas au code du quiz sans décision : s'il faut le changer, c'est une question à Thomas.

M4. **[BLOQUANT] Sans signal, le persona principal entre par le bureau (4.2, C7).**
- Passage : « Aucun signal | "Le collègue qui lance 'ça va ?' à la machine à café" (situation par défaut) | Machine à Café ».
- Problème : le persona principal est un étudiant de 20 ans (`project-context.md`), et l'abonné sans quiz est le cas le plus fréquent [HYPOTHÈSE : à mesurer au lot 0]. Son premier contact avec le produit est une scène de bureau qu'il ne vit pas. C'est une première impression ratée pour le persona n°1, dans les 5 minutes qui comptent le plus.
- Correction : (a) situation par défaut **universelle**, un chambrage entre proches, comme la poêle ou une scène de soirée, que Yanis, Sophie et Marc vivent tous ; (b) en option à soumettre à Thomas, une question d'un seul toucher au jour 1, « Où veux-tu être plus à l'aise ? » (entre potes, au boulot, partout). C'est un signal, pas un choix de parcours (cause H2 respectée), et il aiguille la semaine 2 vers Répartie, Machine à Café ou Confiance. À ajouter à C7.

M5. **[BLOQUANT] C10 : l'avis juridique n'est pas marqué (8, C10).**
- Passage : C10 A (reco) et C10 B, « un avis juridique d'une page sur ces trois points ».
- Problème : le 25/10, Thomas a dit « pas de nouveaux avis » (V4 1.1, l. 136), et le 12/11 « conséquences à traiter sans alourdir » (l. 165). La reco rouvre ces décisions sans le dire ; seule C10 C les cite.
- Correction : marquer A et B « rouvre la décision du 25/10 (pas de nouveaux avis) ». Mon avis : retirer l'avis de la reco (textes mis à jour au plus court, comme le dit le 12/11), et le garder en option pour Thomas.

M6. **[BLOQUANT] Les répliques des réponses « Situation à gérer » ne sont pas comptées (2.6, 7.3 bis).**
- Passage : « La réponse propose des répliques, préparée en session et au niveau de la barre Alexa. »
- Problème : une réplique écrite pour l'occasion est « relue à l'aveugle avant envoi » (`ton-alex.md`), avec un rendement de 1 sur 2 à 1 sur 12 (1.3), et tout ça dans un délai de 1 à 2 jours ouvrés, jusqu'à environ 25 messages par jour. Les « réponses types relues » de 7.3 bis ne couvrent pas ce cas.
- Correction : une norme de réponse écrite. D'abord la méthode, plus les 1 à 3 répliques déjà validées les plus proches (Quoi répondre, carnet, catalogue), avec leur lien. Une réplique neuve seulement si elle passe la relecture à l'aveugle dans le délai, sinon aucune (« pas de vanne plutôt qu'une vanne moyenne »). Ajouter une ligne dans 7.3 bis (part des réponses avec une réplique neuve, relectures correspondantes [HYPOTHÈSE]).

M7. **[NON BLOQUANT] La mesure de compétence quand le compte à rebours est désactivé (2.2, 7.6).**
- Passage : compte à rebours « désactivé la première fois, activable ensuite » ; « Tu avais une réponse ? ».
- Problème : sans limite de temps, « oui » peut vouloir dire « au bout de 40 secondes ». La courbe mesure alors la réflexion, pas la répartie.
- Correction : formuler « Tu avais une réponse tout de suite ? » et enregistrer l'état du compte à rebours avec la réponse, pour lire la courbe dans les deux cas. Aucun texte libre, même table.

M8. **[NON BLOQUANT] Dire à Thomas que « Vocabulaire » n'est plus sur la barre (6.2, C1).**
- Passage : C1 B, « "Bibliothèque" montre deux blocs [...] Reco : tout ce que tu as nommé est à un clic ».
- Problème : aux tours 2 et 3, le refus de « Comprendre » reposait sur « Vocabulaire doit être visible » ; en B, c'est le titre d'un bloc. Le choix de B se défend, mais la phrase de la reco laisse croire que rien n'a bougé.
- Correction : une demi-phrase dans C1 B, « ton mot "Vocabulaire" n'est pas sur la barre : c'est le titre d'un des deux blocs de Bibliothèque ».

M9. **[NON BLOQUANT] Cas limites des missions (2.4).**
- Problème : rien n'est dit pour une réussite à la marche 5, ni pour « Pas essayé » deux fois à la marche 1 (pas de marche en dessous), ni sur le nombre de missions ouvertes à la fois.
- Correction : à la marche 5, « mission libre » ou une nouvelle situation à la même marche ; à la marche 1, proposer une autre situation, jamais un message ; une seule mission ouverte à la fois.

M10. **[NON BLOQUANT] Un détournement sous la barre (3.6).**
- Passage : « À chaque jour suffit sa peine. Le lundi a pris celle de jeudi, pour dépanner. »
- Correction : le retirer ou laisser l'emplacement « [à écrire à l'étalon E2] ». Le second (« Sauf le bus, qui préfère ceux qui ont couru ») peut aller en relecture à l'aveugle tel quel.

## Ce qui manque encore pour 10

- Une carte de rafale dans le bon ordre, avec une vraie question à chaque fois (M1, M2).
- Un aiguillage d'entrée aligné sur le code et sur le persona principal (M3, M4).
- Le marquage de C10 et la norme de réponse de « Mes questions » (M5, M6).

---
**Handoff → session principale**
- Fichier : `docs/espace-client/audit-contenu/iterations/tour-4-elon.md` ; note 8,7/10 (T3 : 8,6). Mes 10 corrections du tour 3 : 9 OK (dont 1 refus acceptable), 1 mal traitée en partie (N2 : ordre de la carte).
- Top 3 : M1, « Tu avais une réponse ? » est posé avant que les répliques soient visibles ; M2, les cartes du carnet ont la réponse dans l'étiquette d'ambiance : enlever l'étape de choix et en faire des cartes de production (60 à 75 % des cartes) ; M3 et M4, l'aiguillage contredit `quiz-data.ts` (Observateur vers Confiance, Storyteller vers Storytelling) et, sans quiz, le persona principal entre par une scène de bureau.
- Ce sont des AVIS : Thomas décide.
---
