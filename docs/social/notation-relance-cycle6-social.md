# Notation relance, cycle 6, social : K4 Formats, K5 Calendrier et cadence, K2 Adaptation (05/10/2026)

> Note indépendante @social. Lu : founder-preferences, strategie-relance-v5, horaires-sources-s15, plan-execution-s15 (§0, §2, §3), lot-semaine0.json, validation-thomas-s15, code `buffer-client.ts` et `generate-post-image.ts`. **Limites** : au 05/10 aucun post n'est publié ; je n'ai vu ni le rendu des cartes ni la file Buffer. Chiffres externes lus dans des extraits de recherche du 05/10, pas dans les pages entières ; (2nd) = source secondaire. Les taux mesurent des comptes installés et varient d'une étude à l'autre (texte seul LinkedIn : 0,46 %, 2 % ou 3,18 %) : seul le sens de l'écart est exploitable.

## 1. Notes par critère

| Critère | Note | Preuve | Correction |
|---|---|---|---|
| **K4 Formats par réseau** | **8,0** | Moyenne de K4a 8,5, K4b 8,5, K4c 7. Écart avec @design (LinkedIn 10) : motivé en K4c | K4a à K4c et §3 |
| K4a Instagram | 8,5 | Cartes 4:5 à 2 images avec texte alternatif : bon format (Metricool 2026, carrousel ≈ 9 fois plus d'enregistrements, `horaires-sources-s15.md` §3). Mais le mer. 07/10 devait être un carrousel 4 cartes (v5 §1) : le lot met une carte vanne (`directorNote` : décryptage à fournir). Aucune Story ni Reel | Livrer le carrousel IG3 avant mer. 14/10 ; test Buffer à 2, 3, 4 images consigné (v5 §2.6, non fait) |
| K4b X | 8,5 | Texte seul défendable : Buffer (52 M de posts, 2026) texte 3,56 %, image 3,40 %, vidéo 2,96 % ; Adilo (3 200 posts) texte 3,24 %, image 2,1 %. Des sources 2nd annoncent l'inverse (+22,8 % pour l'image) : pas de preuve nette. 3 posts sur 5 portent un lien : pénalité de 30 à 50 % annoncée (2nd), non prouvée | Pas de bascule générale ; test d'image programmé (§3). Ajouter au relevé du lundi une colonne « lien oui/non » pour trancher à J+28 |
| K4c LinkedIn | 7,0 | Texte seul partout. Toutes les sources trouvées classent le texte seul dernier (Buffer, relayé 2nd : image 6,52 %, texte 3,18 % ; van der Blom 2026, relayé 2nd : image ou infographie ≈ 3 fois la portée du texte). Le canal Buffer est une **page** (commentaire de `buffer-client.ts`) : portée des pages en baisse de 60 à 66 % depuis 2024 (2nd) | Test d'image dès le 13/10 (§3). Vérifier page ou profil ; si page, proposer à Thomas d'inviter ses contacts à la suivre (son choix) |
| **K5 Calendrier et cadence** | **8,0** | Jours (mar. à jeu.) et heures dans les fenêtres des sources : X 12:30 (Sprout 12-18 h, mais Buffer 8,7 M place 9-11 h en tête), IG 19:30 (Metricool 20 h, Sprout 19-22 h), LinkedIn 08:15 (FR 7-10 h, mais Buffer mondial 15-20 h). Lot conforme : 10:30 UTC = 12:30 Paris, 17:30 = 19:30, 06:15 = 08:15. **Optimalité non prouvée** | K5a à K5c |
| K5a Vendredi et week-end | 7,5 | Vendredi faible : Buffer classe le samedi pire jour de X et le vendredi 2e (résumé, à relire à la source) ; vendredi et samedi pires sur Instagram. Le plan place X et IG au vendredi et ne teste vendredi contre dimanche que sur Instagram, de J+28 à J+56. Dimanche 19 h : +17 % d'impressions X (SocialBee, 707 000 posts) ; week-end Instagram −20 à −30 % | « Rien le week-end » reste défendable, mais le vendredi coûte autant. Tester dès J0 : ven. 12:30 contre dim. 19:00 sur X, ven. 19:30 contre dim. 19:30 sur IG, alternés chaque semaine. 0 post en plus. @fullstack : lever la garde « pas de dimanche » pour ces cases |
| K5b Plan de test A/B | 7,5 | `horaires-sources-s15.md` §6 alterne **par semaine** (S1, S3 = A ; S2, S4 = B) : l'audience croît, donc B part avec plus d'abonnés (biais). Seuil 1,25 fois sur 10 posts : bruit probable à 0 abonné | Alterner **par jour**, ordre inversé une semaine sur deux (X : mar. A, mer. B, jeu. A ; semaine suivante l'inverse), mar. à jeu. seulement. Garder « écart sous 25 % : on garde A ». Écrire dans `mesure.md` |
| K5c Cadence | 8,5 | LinkedIn 2 par semaine = plancher de la plage 2 à 5 de Buffer (2 M de posts) ; mercredi vide alors que Buffer le place en tête. X 5 par semaine : des sources 2nd conseillent 2 à 5 par jour, mais le plafond réel est le stock de vannes au niveau (pool 40, plan §2) | Aucune baisse (D8). LinkedIn : 3e post le mercredi dès S5 si le stock « bureau » suit `[HYPOTHÈSE]`, décision Thomas à J+28 |
| **K2 Adaptation par post** | **8,8** | Moyenne des 10 posts du lot (§2) | Corrections du §2 |
| Légende IG « deviens-marrant.fr » | 6,5 | Non, ce n'est pas le meilleur choix (§4) | Légendes « À envoyer à... » (§4) |
| Appel à l'action | 7,5 | Semaine 0 : lien ou CTA sur 1 post X sur 4, 0 sur 4 IG (cible v5 : 3 sur 5), 0 sur 2 LinkedIn (plafond 1 sur 2, donc conforme) | Appels portés par le profil et la légende, pas par une pub dans le post (§4) |
| Réponses aux commentaires | 6,0 | Aucun signal à Thomas au 06/10 (§4) | §4 |

## 2. K2 : chaque post réel du lot semaine0

| Date, réseau | Note | Preuve et correction |
|---|---|---|
| mar. 06/10 LinkedIn (Rome) | 9,5 | Bureau, 3 phrases, R6, sans lien : natif. Texte de 120 caractères environ, peu de temps de lecture ; la carte image (§3) complète. Rien à corriger dans le texte |
| mar. 06/10 X (Nicolas) | 10 | Environ 160 caractères, deux lignes « », sans lien. Rien à corriger |
| mar. 06/10 IG (draps) | 8 | Carte conforme ; légende = URL seule (§4) |
| mer. 07/10 X (quiz) | 8 | Le pont « tu es lequel des 5 profils ? » ne dit pas que le quiz parle d'humour (v5 disait « humour d'Observateur ») : clic peu motivé. Remplacer par « Et toi, tu as quel profil d'humour ? Quiz de 5 profils, environ 2 minutes, sans inscription : lien » (≈ 250 caractères, lien compté 23, sous 270). Signaler à @copywriter : « sur la carte » ne dit pas Maps |
| mer. 07/10 IG (Robert) | 7,5 | Jour de carrousel remplacé par une carte vanne : aucun renvoi vers le site cette semaine. Légende (§4) ; si le carrousel IG3 n'est pas prêt, légende avec « le quiz est dans le lien de la bio » (sous 80 caractères, sans le pied) |
| jeu. 08/10 LinkedIn (voisine) | 8,5 | « En visio » rattache au travail, mais la scène est domestique : Sophie lit « situations professionnelles ». À garder, mais tirer des vannes plus bureau ensuite (v5 §2 : thème bureau d'abord) |
| jeu. 08/10 X (planning) | 10 | Natif, rien à corriger |
| jeu. 08/10 IG (père retraité) | 8 | Légende (§4) |
| ven. 09/10 X (fuite) | 10 | Natif, guillemets imbriqués corrects. Case du vendredi : voir K5a |
| ven. 09/10 IG (sécu) | 8 | Légende (§4) |

Moyenne : (9,5 + 10 + 8 + 8 + 7,5 + 8,5 + 10 + 8 + 10 + 8) / 10 = **8,8**. À vérifier avant 06/10 19:30 : rendu des 8 cartes (guillemets R6 sur chaque ligne, `threadParts` ne les contient pas, ils viennent du gabarit).

## 3. Recommandation : images pour X et LinkedIn

**Réponse à Thomas : LinkedIn oui, en test dès le 13/10 ; X pas par défaut, test après J+28.** Un facteur à la fois : avec 4 à 10 posts par bras, deux tests sur les mêmes posts ne se lisent pas.
- **LinkedIn** : texte du post inchangé (cherchable, accessible, validé) + une carte unique 4:5 (amorce et chute sur la même carte, R6, pied), texte alternatif = le texte. Ni PDF ni multi-image (mosaïque, v5 §8 ; les sources se contredisent sur les documents : 7,00 % pour les uns, « carrousels en baisse » chez van der Blom). Protocole S1 à S4 : mar. texte, jeu. carte, inversé une semaine sur deux, 4 posts par bras (indicatif). Adopter la carte si médiane d'impressions ≥ 1,3 fois le texte ET (réactions + commentaires) / impressions ≥ texte ; à égalité, garder la carte. Le test d'heure LinkedIn passe en S5 à S8.
- **X** : S1 à S4 = test d'heure (K5b). S5 à S8 : mar. carte, jeu. texte, alternés, même règle. Raison : texte ≥ image dans les deux études quantifiées ; le lien reste dans le texte (une image supprime l'aperçu du lien). Sur X le 4:5 s'affiche sans recadrage jusqu'au 3:4 (posteverywhere, 2nd) : `[À VÉRIFIER sur brouillon réel]`. Si Thomas veut l'image dès J0 : accepté, au prix d'un test d'heure moins lisible.
- **Technique** : `createBufferImagePost` est indépendante du réseau (assets + `altText`), mais X et LinkedIn n'y ont jamais été testés. Manque : gabarit « carte vanne unique » (`carrouselVanne` produit 2 cartes ; `slidesDuPost` ne traite que `IMAGE_QUI_CLAQUE`) et le routage dans `publish-social` `[À VÉRIFIER @fullstack : l'envoi d'images est-il limité à Instagram ?]`. Brouillons Buffer réels avant le 13/10 : X avec 1 image et lien ; LinkedIn avec 1 image 4:5.
- Aucune IA ne génère l'image : même gabarit déterministe que les cartes IG (pas de label « contenu IA » requis).

## 4. Légende Instagram, appel à l'action, réponses

**Légende** : le choix d'« URL seule » est un repli, pas un optimum. Sources : Mosseri retient watch time, envois par portée (3 à 5 fois le poids d'un like pour les non-abonnés, 2nd) et mots-clés dans la légende ; l'URL n'y est pas cliquable (test de liens cliquables limité à Meta Verified, mars 2026, 2nd) et double le pied déjà sur chaque carte. La v5 §2 prévoyait « À envoyer à... » ou rien, R3 : pour qui ou quand, jamais ce que la vanne raconte. **Propositions @copywriter, à relire avant mise en base** (≤ 80 caractères, pied compris) :
- 06/10 `cade959f…` : « À envoyer à ton copain, à tes risques. deviens-marrant.fr »
- 07/10 `c9ce63fb…` : « À envoyer à qui a un entretien cette semaine. deviens-marrant.fr »
- 08/10 `c7322a82…` : « À envoyer à ton père, s'il a le temps. deviens-marrant.fr »
- 09/10 `cffb035c…` : « À envoyer à qui a déjà appelé sa mère pour un papier. deviens-marrant.fr » (72)

**Appel à l'action** : respecte « la marque offre, n'impose pas » (06/05) mais laisse le funnel vide en semaine 0. Sans pub dans les posts : (1) bio des 3 comptes avec ligne d'appel + lien (ex. « Le quiz d'humour, 2 minutes, sans inscription »), à proposer par @copywriter ; (2) tant que `/liens` n'est pas en ligne (déploiement du 10/10), lien de bio IG = `/quiz-humour?utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_content=bio-quiz` ; (3) épingler le post X du 07/10 (quiz).

**Réponses** : D4 est validée mais le signal est bloqué (`INSUFFICIENT_SCOPE`, plan §0) : au 06/10 Thomas n'est prévenu de rien, et il ne surveille pas les applications. Même avec la clé `insights:read`, Buffer ne rend que le **nombre** de commentaires, rafraîchi une fois par jour ; lire ou répondre n'est pas possible par l'API (2nd). Or la fenêtre utile est la première heure : Buffer (Instagram) +21 % d'engagement en répondant ; LinkedIn +30 % (2nd) ; van der Blom : réponse sous 30 min = 2,3 fois les vues (2nd). Le « sous 24 h » de la v5 est donc trop lent pour la portée.
1. Thomas, 5 min, avant le 06/10 : notifications push (ou e-mail) des commentaires, réponses et mentions sur les 3 comptes. C'est le seul signal immédiat.
2. Nouvelle clé Buffer `insights:read` (plan §10) : résumé du soir « N commentaires sur tel post » dans l'e-mail.
3. Fenêtre de réponse : 10 min après chaque publication (X 12:30, LinkedIn 08:15, IG 19:30) pendant 4 semaines `[À CONFIRMER avec Thomas : quelle fenêtre tient dans sa journée]`.
4. Banque de réponses (pattern d'invitation 06/05, troll détaché) prête avant 12:30 le 06/10 `[À VÉRIFIER : fichier non trouvé dans les documents lus]`. Réponses rédigées à l'avance, Thomas copie : aucune IA au fil de l'eau.

## 5. Pour 10/10

| Quand | Action | Qui |
|---|---|---|
| avant 06/10 08:15 | Notifications des 3 comptes ; vérifier page ou profil LinkedIn | Thomas |
| avant 06/10 19:30 | 4 légendes IG en base ; rendu des 8 cartes de la semaine 0 vérifié ; lien de bio IG sur le quiz ; bios avec appel | session, @copywriter |
| avant 07/10 12:30 | Pont du post X quiz corrigé ; post épinglé | session |
| avant 12/10 | `mesure.md` : A/B par jour, ven./dim. dès J0, colonne « lien oui/non », colonne « image oui/non » ; garde dimanche levée pour les cases de test | @data-analyst, @fullstack |
| avant 13/10 | Gabarit carte unique, brouillons Buffer X et LinkedIn avec image, routage `publish-social` | @design, @fullstack |
| avant 14/10 | Carrousel IG3 (4 cartes) livré ; test Buffer 2, 3, 4 images | @copywriter, @fullstack |
| J+28 et J+56 | Lecture des tests ; décisions heure, vendredi/dimanche, image LinkedIn (puis X), 3e post LinkedIn | session, Thomas |

K4 et K5 passent à 10 quand les tests sont conçus sans biais et lus ; K5 ne sera **démontré** optimal qu'à J+28 et J+56, pas avant.

## Sources (consultées le 05/10/2026)
- Buffer, [State of Social Media Engagement 2026](https://buffer.com/resources/state-of-social-media-engagement-2026/) ; [How often to post on LinkedIn](https://buffer.com/resources/how-often-to-post-on-linkedin/) ; [Best time on X](https://buffer.com/resources/best-time-to-post-on-twitter-x/) ; [Best time on Instagram, sept. 2026](https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram/) ; [Réponses aux commentaires Instagram](https://buffer.com/resources/instagram-comments-engagement/)
- [Adilo, engagement X par format](https://adilo.com/blog/x-engagement-rate-chart-2025/) ; [van der Blom 2026](https://podcast.creatorscience.com/richard-van-der-blom-2/) ; [Vulse, formats LinkedIn 2026](https://vulse.co/blog/linkedin-content-benchmarks-2026-which-post-format-drives-most-engagement) (2nd)
- [Mosseri, signaux (Kompozy)](https://kompozy.io/news/instagram-mosseri-ranking-signals-guidance) ; [SocialPilot, algorithme X](https://www.socialpilot.co/blog/twitter-algorithm) ; [Ordinal, pages LinkedIn](https://www.tryordinal.com/blog/the-declining-reach-of-linkedin-company-pages) ; [PostEverywhere, ratios X](https://posteverywhere.ai/blog/x-twitter-aspect-ratios) ; [Zernio, API Buffer](https://zernio.com/blog/buffer-api) (2nd)
