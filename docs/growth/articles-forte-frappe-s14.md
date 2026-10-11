# Articles à forte frappe : 10 propositions pour prolonger l'article des 50 blagues (s14)

**Date :** 2026-10-05 · **Agent :** @growth · **Statut :** proposition pour Thomas, rien produit, aucun code touché, rien commité.
**Sources lues :** Umami 30 j (chiffres de la demande), `blog-articles.ts`, `blog-clusters.ts`, `vannes-themes.ts`, `docs/copy/articles-q4/` (S1 à S13), `docs/seo/calendrier-editorial-q4-2026.md`, `seo-redirects.data.cjs`, [CHOIX UTILISATEUR] de `docs/founder-preferences.md`.

## 1. Données, limites, contraintes
- **Umami :** l'étalon = 392 vues sur 1 014 (38,7 %), `phrases-droles-conversations` = 69 (6,8 %), `/vannes` = 50 (4,9 %). Les deux pages « à ressortir / à envoyer » pèsent 45 % du site. [HYPOTHÈSE : les visiteurs cherchent un texte prêt par situation, pas un cours.] 1 014 vues en 30 jours est une base minuscule : tout se rouvre à J+30.
- **Volumes :** 4 WebSearch, aucun chiffre vérifiable (pas d'outil de mots-clés FR en accès libre). Seul signal qualitatif : le poisson d'avril fait l'objet de recherches Google saisonnières ([RTBF Actus](https://www.rtbf.be/article/les-tendances-google-voici-les-questions-les-plus-posees-sur-le-poisson-d-avril-11529623)). Partout ailleurs : « volume à vérifier dans Search Console » (+ Bing Webmaster à J+14).
- **Unit economics :** acquisition 100 % organique, CAC cash 0 €, coût réel = production + relecture à l'aveugle. LTV non calculable (aucune donnée d'abonnés ni de churn dans ce périmètre) : à calculer à 30 jours de données. Premium : 2,99 €/mois ou 24,99 €/an.
- **Slugs :** recoupés avec les 13 Q4, les clusters, les redirections 301 et le banc de touche. Un grep exhaustif de `blog-articles.ts` était impossible (outil indisponible) : @seo confirme l'absence des slugs ci-dessous dans ce fichier et dans les 9 articles en base avant production.
- **Choix fondateur appliqués :** vannes inédites validées à l'aveugle (2 relecteurs, barre Alexa), aucune génération automatique, zéro humoriste, zéro classique (Carambar, Toto, blondes, belges : écartés), zéro vulgarité, aucune identité fondateur.

## 2. Les propositions, classées par potentiel
Potentiel = largeur de la requête × format « prêt à sortir » × partage facile × fit persona. Qualitatif, faute de volumes. I = informationnelle, T = texte à copier. « Cannib. » = risque de cannibalisation.

### 1. Couple : `blagues-de-couple-drole`
- **H1 :** Blagues de couple : 15 vannes pour rire à deux · **Requête :** « blagues de couple » (I/T) · **Volume :** à vérifier dans Search Console.
- **Format :** liste par situation (courses, télécommande, thermostat, « on mange quoi ? », week-end chez les beaux-parents), chute + décryptage, comme l'étalon.
- **Sorties :** `/vannes/theme/couple`, quiz d'humour, parcours Confiance.
- **Convertit :** une vanne s'envoie au partenaire (bouton Partager = boucle de partage sans effort) ; le thème couple est déjà rédigé et non utilisé au Q4. [HYPOTHÈSE]
- **Saison :** pic probable vers la Saint-Valentin (dimanche 14/02/2027) · **Cannib. :** moyen avec `humour-saint-valentin` : ne viser ni « Saint-Valentin » ni « célibataire », lien croisé.

### 2. Anniversaire : `message-anniversaire-drole-par-situation`
- **H1 :** Message d'anniversaire drôle : 20 textes par situation · **Requête :** « message d'anniversaire drôle » (T) · **Volume :** à vérifier dans Search Console.
- **Format :** par destinataire (pote, collègue, parent, frère ou sœur, ami perdu de vue) et par support (carte, WhatsApp, mot au gâteau).
- **Sorties :** `/vannes/theme/soirees`, `/vannes/theme/famille`, parcours Machine à Café, inscription.
- **Convertit :** besoin quotidien et immédiat, le visiteur repart avec un texte ; la 2e page du site (69 vues) est de ce type. [HYPOTHÈSE]
- **Saison :** aucune (evergreen, l'indexation se cumule) · **Cannib. :** moyen avec `phrases-droles-conversations` (lien, ne pas viser « phrases drôles ») et S9 (le toast reste à S9).

### 3. Vœux : `voeux-drole-nouvelle-annee` (réserve §8 du calendrier Q4)
- **H1 :** Vœux drôles de nouvelle année : 15 messages prêts à envoyer · **Requête :** « voeux drôles nouvelle année », « message de voeux drôle collègues » (T) · **Volume :** à vérifier dans Search Console.
- **Format :** par destinataire (équipe, client, famille, groupe d'amis), 1 message drôle + 1 variante sobre.
- **Sorties :** `/vannes/theme/boulot`, `/vannes/theme/famille`, S13 (lien croisé), inscription.
- **Convertit :** message envoyé à beaucoup de contacts, donc partage massif sur une courte période ; CTA vers la vanne du jour toute l'année. [HYPOTHÈSE]
- **Saison :** fenêtre 20/12 au 15/01 [HYPOTHÈSE] ; inutile publié après le 20/12 (calendrier Q4) · **Cannib. :** moyen avec `blagues-fetes-noel-nouvel-an` et l'H2 WhatsApp de `phrases-droles-conversations` : viser « voeux », jamais « blagues de Noël ».

### 4. Poisson d'avril : `blagues-poisson-d-avril-adultes`
- **H1 :** Poisson d'avril pour adultes : 10 blagues inédites · **Requête :** « blague poisson d'avril adultes » (I/T) · **Volume :** à vérifier (signal qualitatif RTBF, pas de chiffre).
- **Format :** par cible (collègue, coloc, famille, groupe WhatsApp), blague à dire ou message à envoyer, sans canular qui blesse ni fausse nouvelle.
- **Sorties :** `/vannes/theme/boulot`, `/vannes/theme/soirees`, S3 coloc (lien).
- **Convertit :** requête annuelle à date fixe dont la SERP est faite de classiques (même constat que S1 Halloween) : « inédites » est la promesse du site. [HYPOTHÈSE]
- **Saison :** jeudi 01/04/2027, trafic concentré sur quelques jours, mise à jour annuelle réelle · **Cannib. :** faible (l'étalon vise la requête générique) ; aucune vanne partagée avec S1.

### 5. Appli de rencontre : `premier-message-drole-appli-de-rencontre`
- **H1 :** Premier message drôle sur une appli : 10 accroches · **Requête :** « premier message drôle appli de rencontre », « accroche drôle » (T) · **Volume :** à vérifier dans Search Console.
- **Format :** par situation (réagir à une photo, répondre à « salut ça va ? », relancer après un silence, proposer un rencard), message + pourquoi ça marche + version à éviter. Sujet exclu de S2 : place libre.
- **Sorties :** `/vannes/theme/dating`, quiz d'humour, parcours Confiance.
- **Convertit :** besoin aigu (profil en reconstruction, profil étudiant) ; le « pourquoi ça marche » est exactement ce que Premium décrypte. [HYPOTHÈSE]
- **Saison :** pic probable début janvier [HYPOTHÈSE, à confirmer en Search Console] · **Cannib. :** moyen avec `comment-faire-rire-une-fille` : traiter l'écrit en appli, pas l'oral ; ton sobre, zéro drague lourde.

### 6. Pot de départ : `mot-de-depart-collegue-drole`
- **H1 :** Mot de départ drôle pour un collègue : 12 phrases prêtes · **Requête :** « mot de départ collègue drôle », « message pot de départ » (T) · **Volume :** à vérifier dans Search Console.
- **Format :** par rôle (celui qui part, celui qui reste, le manager) et par support (carte, 30 secondes à voix haute, message d'équipe).
- **Sorties :** `/vannes/theme/boulot`, parcours Machine à Café, carnet mensuel (fiche situation + réplique).
- **Convertit :** besoin daté (le pot est dans trois jours), visiteur très motivé, profil jeune actif en CDI. [HYPOTHÈSE]
- **Saison :** pics probables fin juin et décembre-janvier [HYPOTHÈSE] · **Cannib. :** moyen avec S9 et la réserve `discours-pot-de-depart-drole` : trancher après les données S9 ; ici messages courts, pas de discours.

### 7. Vacances : `blagues-vacances-ete-entre-amis`
- **H1 :** Blagues de vacances : 15 vannes pour l'été entre amis · **Requête :** « blagues vacances », « blagues d'été » (I) · **Volume :** à vérifier dans Search Console.
- **Format :** par moment (route, plage, camping ou location, resto, retour au boulot), chute + décryptage.
- **Sorties :** `/vannes/theme/soirees`, `/vannes/theme/autoderision`, quiz d'humour.
- **Convertit :** liste à poster dans le groupe de départ, faible concurrence interne l'été. [HYPOTHÈSE]
- **Saison :** juin à août, publier début juin, mise à jour annuelle · **Cannib. :** moyen avec `comment-faire-rire-ses-amis` et `repartie-soiree-anti-malaise` : viser « vacances », jamais « amis » seul.

### 8. Invitation : `refuser-une-invitation-avec-humour`
- **H1 :** Refuser une invitation avec humour : 10 réponses prêtes · **Requête :** « refuser une invitation avec humour », « excuse drôle annuler soirée » (T) · **Volume :** à vérifier dans Search Console.
- **Format :** par situation (soirée d'un pote, pot de boulot, repas de famille, groupe WhatsApp, « t'es sûr de pas venir ? »), réponse + variante polie.
- **Sorties :** parcours Confiance, `/vannes/theme/autoderision`, carnet mensuel.
- **Convertit :** parle au besoin réel des membres introvertis (déjà affirmé par la FAQ) ; la réponse drôle est de la répartie préventive, promesse des parcours. [HYPOTHÈSE]
- **Saison :** léger pic avant les fêtes (invitations en cascade) [HYPOTHÈSE] · **Cannib. :** faible à moyen avec S12, `rester-muet-en-groupe`, `timidite-et-humour` : ni « timide » ni alcool.

### 9. Fête des mères puis des pères : `message-drole-fete-des-meres`, `message-drole-fete-des-peres`
- **H1 :** Message drôle pour la fête des mères : 10 idées (puis idem « pères ») · **Requête :** « message drôle fête des mères / des pères » (T) · **Volume :** à vérifier dans Search Console.
- **Format :** par support (carte, SMS, repas du dimanche), message + chute ; on rit de la situation, jamais du parent.
- **Sorties :** `/vannes/theme/famille`, S8 (lien), inscription.
- **Convertit :** conversion faible attendue [HYPOTHÈSE] ; intérêt = trafic daté et partage. « Pères » n'est publié que si « mères » atteint indexation et impressions à J+21, sinon fusion.
- **Saison :** mères dimanche 30/05/2027, pères dimanche 20/06/2027 · **Cannib. :** faible ; ne pas dériver vers « blagues pour enfants ».

### 10. Gamer : `blagues-de-gamer-jeux-video`
- **H1 :** Blagues de gamer : 12 vannes pour ta team · **Requête :** « blagues de gamer », « blagues jeux vidéo » (I) · **Volume :** à vérifier dans Search Console.
- **Format :** par moment (lag, partie du soir, coéquipier, « juste une dernière », rage quit), chute + décryptage.
- **Sorties :** `/vannes/theme/gaming`, S4 (lien), quiz d'humour.
- **Convertit :** public jeune qui partage en Discord ou WhatsApp ; niche donc volume modeste [HYPOTHÈSE], classé dernier.
- **Saison :** aucune connue · **Cannib. :** faible ; S4 vise l'IA et les assistants vocaux, ne pas reprendre « blagues IA ».

## 3. Ordre de production et calendrier
Publication le jeudi, pour ne pas heurter les lundis Q4 ; délai minimal visé 28 jours avant le pic (précédent interne : 19 jours jugés « acceptables » pour S1). Lot = production préparée à l'avance (choix du 30/09).
| Jeu | Article | Pic visé | Délai |
|---|---|---|---|
| 22/10/2026 | 2 Anniversaire | evergreen | indexation cumulée |
| 12/11/2026 | 3 Vœux | 20/12 au 15/01 | 38 j |
| 26/11/2026 | 8 Invitation | décembre | 30 j |
| 03/12/2026 | 5 Appli | début janvier | 29 j |
| 07/01/2027 | 1 Couple | 14/02 | 38 j |
| 21/01/2027 | 10 Gamer | evergreen | indexation cumulée |
| 25/02/2027 | 4 Poisson d'avril | 01/04 | 35 j |
| 15/04/2027 | 6 Pot de départ | fin juin | 66 j |
| 22/04/2027 | 9a Fête des mères | 30/05 | 38 j |
| 13/05/2027 | 9b Fête des pères (conditionnel) | 20/06 | 38 j |
| 03/06/2027 | 7 Vacances | juillet-août | 28 j |

- **Lot A** (anniversaire, vœux, invitation) : candidats (5 variantes par emplacement, méthode Q4) d'ici le 12/10, relecture à l'aveugle du 15 au 19/10, GO Thomas le 19/10. **Lot B** (appli, couple, gamer) : candidats 02/11, relecture 09/11, GO 23/11. **Lot C** (poisson, pot de départ, mères, pères, vacances) : candidats 04/01/2027, relecture 11/01, GO 25/01.
- **Charge :** ≈ 140 lignes humoristiques au total (somme des cibles ci-dessus), soit plus que les 125 vannes du catalogue. Après le lot A, si le taux de passage rend le lot B irréaliste, passer à 10 lignes par article plutôt que de baisser la barre.

## 4. Règles communes
- **Moule de l'étalon :** « En bref », sommaire, H2 par situation, chaque vanne décryptée avec bouton Partager, sorties thématiques, CTA d'inscription. Barre avant volume : 10 à 20 lignes, liste vivante enrichie chaque mois de lignes validées (mise à jour réelle du texte, `lastModified` honnête).
- **Zéro doublon de vannes :** aucune ligne reprise de l'étalon ni d'un article Q4 ; piocher au catalogue seulement les vannes non utilisées. Zéro tiret cadratin, zéro humoriste, zéro concurrent.
- **Levier activable en moins de 24 h :** le jour de chaque publication, ajouter un lien « à lire ensuite » dans l'étalon et dans `phrases-droles-conversations` (ensemble 45 % des vues du site, à orienter vers les nouveaux articles). Modification éditoriale, URL inchangée, GO Thomas.
- **Mesure :** indexation vérifiée à J+3, impressions et volumes réels à J+14, décision renforcer/consolider à J+30, jugement à J+90 sur indicateurs avancés (indexation, impressions, partages, inscrits via CTA). Aucun canal payant.
- **Écartés :** mariage (cannibalise S9), blagues de papa/Carambar/Toto/blondes (classiques ou stéréotypes, contraires à la barre), blagues de boulot (cannibalise `blagues-travail-faire-rire-pro`), blagues entre amis (cannibalise `comment-faire-rire-ses-amis`), Noël (déjà couvert).

**Handoff → @orchestrator (puis @seo, @copywriter, @data-analyst)**
- Fichier : `/home/user/Marrant/docs/growth/articles-forte-frappe-s14.md`.
- Décisions : 10 propositions (11 slugs), top 5 = couple, anniversaire, vœux, poisson d'avril, appli de rencontre ; publication le jeudi ; 3 lots à l'aveugle.
- À faire : @seo valide les slugs et relève les H2 des 9 articles en base ; @data-analyst suit les volumes réels (Search Console + Bing) à J+14 ; Thomas tranche le rythme (jeudi ou lundi) et le GO des lots.
