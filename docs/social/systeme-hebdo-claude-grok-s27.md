# Système hebdomadaire Claude / Grok : TikTok, Instagram, LinkedIn, X (s27, 26/11/2026)

> Décision de Thomas du 25-26/11/2026 : publier sur TikTok, Instagram, LinkedIn et X, 2 à 3 posts par semaine, trois sortes de contenu (résumé d'article, nouveauté du produit, actu de l'humour). Claude (la session) écrit les textes chaque samedi ; Grok bot fait visuels et vidéos, publie, modère et rend compte. Thomas valide chaque post pendant les 3 premières semaines (programmes S49, S50, S51), puis publication automatique.
> Ce document remplace pour la cadence l'ancien mix 5/5/2 de `mix-formats-s15.md` (jamais repris tel quel : la préparation mensuelle et Buffer sont éteints, voir §6). Les seuils chiffrés de `mesure.md` (X, Instagram, LinkedIn) restent la référence de lecture ; TikTok n'en a pas encore `[À DÉFINIR après 4 semaines de relevés]`.
> Faits de départ : 7 visites venues des réseaux en 30 jours (Umami : t.co 3, linkedin 2, facebook 2). Le point de départ est quasi nul : on mesure donc la progression des visites et des inscriptions à la lettre, jamais les « j'aime ».

## 1. Stratégie courte par réseau (pour Yanis, 20 ans, étudiant, muet quand ça chambre)

### 1.1 Cadence retenue : 3 contenus maîtres par semaine, déclinés par réseau (11 publications au plus)

| Contenu maître | Jour | Type | Rôle |
|---|---|---|---|
| A | lundi | blog : résumé d'un article publié | amener du trafic Google/IA vers le blog et la lettre |
| B | mercredi | développement : nouveauté du produit (ou, sans nouveauté, un extrait du catalogue validé) | montrer que le site vit, donner une raison d'essayer |
| C | vendredi | actu : humoristes, saisons, événements | rester dans la conversation de Yanis, être partageable |

| Réseau | Publications / semaine | Lesquelles | Format |
|---|---|---|---|
| TikTok | 3 | A, B, C | vidéo verticale scénarisée 20 à 35 s (accroche dans les 3 premières secondes) |
| Instagram | 3 | A et C en Reels (même montage que TikTok, légende propre) ; B en carrousel 4 à 6 cartes | Reels + carrousel |
| X | 3 | A, B, C | post court (270 signes max, lien compté pour 23) ; image ou vidéo courte si le brief l'exige |
| LinkedIn | 2 | A et B (angle travail et conversation pro : machine à café, réunion) | post texte, 3 phrases, lien en dernière ligne |

Justification : Yanis vit sur TikTok et Instagram, donc la vidéo verticale porte la découverte (2 vidéos par contenu maître suffisent, un seul montage par Grok). X et LinkedIn restent des relais peu coûteux en texte : X pour l'actu et les humoristes, LinkedIn pour Sophie (persona secondaire) et pour la crédibilité de la marque. Total 11 publications mais 3 productions : un volume tenable par Grok sans baisser la barre. Si la qualité fléchit, on retire d'abord LinkedIn C (déjà absent), puis X B, jamais une vidéo TikTok de A. `[HYPOTHÈSE : 3 contenus par semaine, à réviser après 4 semaines de relevés]`

Barre de qualité : l'humour reste au niveau d'Alex (`docs/copy/ton-alex.md`). Pas de vanne plutôt qu'une vanne moyenne : un post d'actu ou de nouveauté sans blague mais juste est publiable. Une vanne vient du catalogue validé ou est relue à l'aveugle avant le programme.

### 1.2 Rôle et mesure par réseau

| Réseau | Rôle pour Yanis | Lien cliquable | Ce qu'on mesure (objectif : visites et inscriptions à la lettre) |
|---|---|---|---|
| TikTok | découverte : une situation de chambrage reconnue en 3 secondes | non : lien du profil, une seule fois | visites `utm_source=tiktok` (via la page de bio), vues terminées, partages ; 0 seuil avant S53 |
| Instagram | découverte + sauvegarde (Reels, carrousel) | non en légende : lien de bio `/liens` | clics sur le lien de bio, visites `instagram`, partages + enregistrements (seuils `mesure.md` §4) |
| X | actu, humoristes, relais d'articles | oui, dans le texte | visites `x` (et référent `t.co`), clics du lien, réponses + citations |
| LinkedIn | crédibilité, public pro (Sophie) | oui, dernière ligne | visites `linkedin` (et `lnkd.in`), clics, commentaires |

Chaîne de mesure, chaque samedi : visites par `utm_source` et `utm_campaign` (Umami), puis `blog-lettre-envoi` et `lettre-envoi` par `origine`, puis `inscription-reussie` et `abonnement-reussi`. Les « j'aime » et abonnés se relèvent, ne se jugent pas. Attribution à la session d'arrivée seulement (limite de `mesure.md` §1).

Réglages à faire avant la 1re publication (hors de ce document, pas de code modifié ici) :
- **TikTok n'existe pas dans la liste blanche d'`origine`** (`x|instagram|linkedin`, `mesure.md` §1) : sans ajout de `tiktok`, ses visites seront comptées en visites mais pas dans l'entonnoir par origine. À confier à @fullstack.
- **Pas de page `/liens/tt`** (seulement `/liens`, `/liens/x`, `/liens/li`) : en attendant, lien de profil TikTok = `https://deviens-marrant.fr/liens?utm_source=tiktok&utm_medium=social&utm_campaign=bio&utm_content=bio-tiktok` `[À VÉRIFIER : la page /liens pose-t-elle ses propres UTM par-dessus ceux-ci ?]`.

## 2. CONTRAT Claude vers Grok : le programme hebdomadaire

### 2.1 Fichier
- Chemin : `Social/programme-AAAA-Sxx.md` dans le dossier du vault (§7). **Un fichier neuf chaque samedi, jamais d'édition d'un ancien.** Exemple : `programme-2026-S49.md` (semaine du lundi 30/11 au dimanche 06/12, déposé le samedi 28/11).
- Numérotation : semaine ISO. `utm_campaign` = `AAAA-Sxx` (ex. `2026-S49`).
- Statut en tête de fichier : `statut: A_VALIDER` (semaines 1 à 3) puis `statut: VALIDE_THOMAS`. **Grok ne publie que les blocs d'un fichier `VALIDE_THOMAS`** pendant les 3 premières semaines. Après : `statut: AUTO` (publication sans validation, Claude reste seul auteur des textes).
- Un post modifié après dépôt = nouveau fichier `programme-AAAA-Sxx-v2.md` avec la liste des blocs changés. Grok n'applique que la dernière version.

### 2.2 En-tête du fichier
```
# Programme AAAA-Sxx
statut: A_VALIDER | VALIDE_THOMAS | AUTO
semaine: du <lundi JJ/MM> au <dimanche JJ/MM>
déposé: <samedi JJ/MM> 15h (heure de Paris)
contenus maîtres: A=<titre court>, B=<titre court>, C=<titre court>
silences: <jours sans publication, ou "aucun">
```

### 2.3 Un bloc par publication (un bloc = un réseau = une date)
```
## POST <id>   (id = AAAA-Sxx-<A|B|C>-<tt|ig|x|li>, ex. 2026-S49-A-tt)
- réseau: TikTok | Instagram | X | LinkedIn
- date_heure: <AAAA-MM-JJ HH:MM> (Paris)
- type: blog | développement | actu
- pilier: <éduquer | divertir | engager>
- format: reel | carrousel | post texte | post texte + image
- source: <slug d'article, ligne du journal des nouveautés, ou lien de l'actu avec date>
- texte_final:
  <légende / post prêt à publier, caractère pour caractère, hashtags compris>
- hashtags: <liste, 3 à 5 maximum, ou "aucun">
- lien: <URL complète avec UTM, ou "aucun">
- visuel_ou_video: voir §2.4
- commentaires: <règles propres au post, ou "charte standard (§3.3)">
- alt_text: <description de l'image, une phrase>
- fin_de_validité: <date après laquelle le post ne doit plus partir, ou "aucune">
```

### 2.4 Brief visuel (images, carrousels) et script vidéo (TikTok, Reels)
Vidéo :
```
- durée: <20 à 35 s>
- plan 1 (0-3 s): <image + texte à l'écran EXACT + voix ou sous-titre EXACT>
- plan 2 (...): ...
- dernier plan: <cadre de fermeture : nom du site, rien d'autre>
- texte_à_l'écran: <chaque texte exact, dans l'ordre>
- ton: <ex. complice, sec, jamais criard>
- son: <musique libre de droits ou "sans musique" ; pas d'extrait d'humoriste enregistré sans accord>
- sous-titres: oui (obligatoires)
- interdits: <visage de personne réelle, logo tiers, ...>
```
Carrousel : une ligne par carte (numéro, texte exact, consigne visuelle). Image seule : texte exact + consigne visuelle + format (1080x1350 IG, 1200x675 X).
Si un visuel généré par IA est réaliste (visage, voix, lieu réel) : étiqueter « contenu IA » selon l'option de la plateforme. Pas de ressemblance avec un humoriste ou une personne réelle.

### 2.5 Format du lien et UTM
`https://deviens-marrant.fr/<chemin>?utm_source=<tiktok|instagram|x|linkedin>&utm_medium=social&utm_campaign=<AAAA-Sxx>&utm_content=<id>`
- `utm_content` = l'id du bloc en minuscules (ex. `2026-s49-a-x`). Aucun lien sans UTM, même ajouté à la main (règle `mesure.md` §1).
- TikTok et Instagram : le bloc écrit `lien: aucun` en légende et le texte dit « lien dans la bio » ; le lien de bio ne change pas chaque semaine.
- X : lien dans le texte. LinkedIn : lien en dernière ligne, jamais en premier commentaire.

### 2.6 Règles fixes (Grok les applique sans discussion)
1. **Grok ne réécrit jamais un texte** : pas de reformulation, pas de raccourci, pas d'ajout de hashtag ou d'émoji. S'il pense qu'un texte est faux, trop long, ou dépassé : il **signale dans son rapport (§3) et ne publie pas ce bloc**.
2. Ton d'Alex (`docs/copy/ton-alex.md`) : tutoiement, guillemets « », le pote drôle et bienveillant, une observation plutôt qu'une leçon. Les posts de marque gardent la voix du site (pas de « je »). Les réponses aux commentaires suivent la charte §3.3.
3. **Zéro tiret cadratin (—)** et zéro émoji, dans les textes comme dans les réponses.
4. **Aucune donnée inventée** : pas de chiffre, prix, témoignage, citation ou date qui ne soit pas dans le bloc. Question hors bloc = « je vérifie » et remontée.
5. Humoristes nommés et cités : autorisés. Chaque citation du bloc est vérifiée par Claude avec sa source (dans la ligne `source`). Grok ne cite jamais un humoriste de mémoire dans une réponse.
6. Aucun concurrent nommé. Aucune promesse hors offre : ce qui s'écrit sur l'offre se limite au journal des nouveautés et aux textes du bloc (lettre gratuite, 1,99 €/mois, « premier paiement remboursable sous 14 jours », « résiliable depuis ton profil »).
7. Créneau manqué de plus de 3 heures sans raison technique : ne pas publier, noter au rapport.
8. Un sujet d'actu sensible (deuil, drame, procès) : ne pas publier la vanne, signaler.

## 3. CONTRAT Grok vers Claude : le rapport hebdomadaire

### 3.1 Fichier
`Social/rapport-grok-AAAA-Sxx.md`, **neuf chaque semaine**, déposé le vendredi soir ou le samedi avant 12h (Paris), pour la semaine du programme du même numéro. Si rien n'est publié : le fichier existe quand même, avec la raison.

### 3.2 Contenu (dans cet ordre, aucune section omise : « néant » si vide)
```
# Rapport Grok AAAA-Sxx
programme lu: <nom du fichier + statut + version>
publié: <n> sur <n> prévus

## 1. Posts partis
| id | réseau | lien du post | heure réelle (Paris) | écart avec le programme |

## 2. Posts non publiés
| id | raison (technique, texte signalé, sujet sensible, validation absente) | action attendue de Claude |

## 3. Statistiques par post (relevées au plus tôt 48 h après publication, date du relevé indiquée)
| id | vues / impressions | vues terminées ou taux de rétention (vidéo) | j'aime | commentaires | partages | enregistrements | clics sur lien (si l'outil le donne) | abonnés gagnés |
Chiffres lus dans les outils natifs, recopiés tels quels. Aucun chiffre estimé. Case vide = « non disponible », jamais 0 par défaut.

## 4. Comptes (relevé du vendredi)
| réseau | abonnés | variation sur la semaine |

## 5. Commentaires notables et réponses données
Pour chaque : réseau, post (id), texte du commentaire (copié), ta réponse (copiée), pourquoi notable.

## 6. Commentaires remontés (non traités par Grok, voir 3.3)
Pour chaque : lien, texte, catégorie (critique de fond, question sur l'offre, résiliation ou paiement, presse ou humoriste cité, harcèlement, droit à l'image).

## 7. Questions récurrentes des abonnés
Liste : question, nombre de fois, réseaux. (Alimente articles et prochains programmes.)

## 8. Incidents
Panne de publication, compte restreint ou signalé, vidéo refusée, droit musical, faux compte, avertissement de la plateforme. Heure, capture ou lien.

## 9. Volet SEO / GEO (s'il en a eu, sinon « néant »)
Actions faites (page, outil, date), constats (indexation, mentions dans des réponses d'IA, sources), actions proposées. Chaque constat porte sa source (URL, capture, date). Jamais de chiffre sans source.

## 10. Signalements de texte
Blocs que Grok a jugés faux ou problématiques : id, phrase, motif. (Grok n'a rien corrigé.)
```

### 3.3 Charte de modération des commentaires

Grok répond seul à :
- remerciement, compliment, émoji seul : un merci court (« Merci, content que ça t'ait fait sourire. »), sans émoji, jamais deux fois la même formule dans la journée ;
- question simple dont la réponse est dans le programme, le journal des nouveautés ou le site public (où est la lettre, la lettre est gratuite, le site est en français) : réponse d'une ou deux phrases, ton d'Alex, avec le lien utile seulement si la personne le demande ou si l'idée y mène naturellement (UTM `utm_content=reponse`) ;
- demande de conseil d'humour en une ligne : un apport utile court, puis « Je peux te partager un article si tu as envie d'en savoir plus. » (modèle de `ton-alex.md`) ;
- troll ou moquerie sans insulte grave : « Pas de problème. Le catalogue est là si tu reviens. » ou ne pas répondre. Jamais de joute, jamais de moquerie de la personne ;
- critique d'une vanne : « Merci d'avoir relevé ça. » + rien d'autre ; la critique est notée au §5 du rapport (la qualité est un sujet de fond pour Claude et Thomas).

Grok ne répond pas, remonte dans le rapport (§6) et, si urgent, prévient Thomas le jour même :
- tout ce qui touche à un prix, un remboursement, une résiliation, un paiement, un compte, une donnée personnelle (RGPD) : réponse type permise uniquement « On te répond par e-mail, écris-nous via le site. » `[À VÉRIFIER : adresse de contact à donner, absente de ce document]` ;
- une critique de fond sur le produit, une accusation de plagiat de vanne ou de copie d'un humoriste, une demande d'humoriste ou de son entourage, toute presse ;
- toute personne qui se dit mal (détresse, harcèlement subi) : ne pas plaisanter, ne pas répondre sur le fond, remonter immédiatement ;
- insultes, propos haineux, menaces : masquer ou supprimer selon l'outil, capturer d'abord, remonter ;
- toute demande de droit à l'image, de retrait, de collaboration, de concours ou de partenariat ;
- toute question dont la réponse n'est pas dans les fichiers du vault : « je vérifie » est interdit s'il n'y a pas de suivi ; on remonte.

Jamais : promettre une fonction, une date, un prix ; confirmer ou démentir une rumeur ; parler d'un concurrent ; mettre en relation avec un humoriste ; envoyer un message privé non sollicité ; envoyer un lien payant en premier. Délai visé : réponse sous 24 h (jours ouvrés), sans heure fixe (`founder-preferences.md`, 05/10).

## 4. La routine du samedi 15h (heure de Paris), pour la session Claude

Rappel : les 3 premières semaines, l'étape 10 attend la validation de Thomas avant que le statut passe à `VALIDE_THOMAS`. Chaque étape produit une ligne dans la note de session (`Social/routine-AAAA-Sxx.md`) : OK, PAS OK, ou NON FAIT avec la raison. Une étape PAS OK ne bloque pas les suivantes, elle est listée dans le résumé final.

| N° | Étape | Source | Outil | Critère OK / pas OK |
|---|---|---|---|---|
| 1 | Pages clés du site | `/`, `/blog`, `/vannes`, `/abonnement`, `/register`, `/resiliation`, `/sitemap.xml`, `/robots.txt`, `/llms.txt` | WebFetch ou WebSearch (pas de shell dans la session de rédaction : si un shell existe, `curl -I`) | OK : toutes en 200 (`/resiliation` sans session : redirection vers `/login` attendue, 307). Pas OK : un 4xx ou 5xx, une redirection inattendue. |
| 2 | Articles du blog | `/blog` et le sitemap | lecture de la page et du sitemap | OK : les articles de la semaine sont listés, leur URL répond 200, ils figurent dans le sitemap avec `lastmod` de la semaine. Pas OK : article annoncé absent, ou dans le sitemap mais en 404. |
| 3 | Santé applicative | point de santé de l'application (santé `ok`, base `up`, Stripe `live`, relevé le 25/11 dans `REPLIT_ACTIONS.md`) `[À VÉRIFIER : chemin exact, probablement /api/health]` | WebFetch | OK : `ok` et base `up`. Pas OK : autre valeur, alerter Thomas le jour même. |
| 4 | Google (Search Console) | propriété `deviens-marrant.fr`, 7 derniers jours contre les 7 précédents | accès Search Console du projet `[À VÉRIFIER : outil d'accès dans la session, par exemple l'API Search Console ou l'export de Thomas]` | OK : clics et impressions lus pour les 20 premières pages et les 20 premières requêtes, avec pages en baisse de plus de 30 % identifiées. Pas OK : accès impossible (le dire, ne pas inventer). |
| 5 | Bing (Webmaster Tools) | clé `BING_WEBMASTER_API_KEY` (secret du projet, jamais écrite dans le vault) | test de la clé par un appel de lecture (ex. liste des sites de l'API Bing Webmaster) `[À TESTER : la clé n'a pas été testée à ce jour]` | OK : réponse 200 avec la propriété du site, puis requêtes et clics lus. Pas OK : 401/403 ou clé absente : noter « clé à régénérer » et le demander à Thomas ; ne pas poursuivre en devinant. |
| 6 | Visibilité dans les IA (méthode honnête) | liste fixe de 10 questions (ex. « comment devenir drôle », « comment avoir de la répartie », « exercices pour développer son humour », 3 autres tirées des requêtes Search Console) | WebSearch, et si disponibles les réponses de ChatGPT, Perplexity, Gemini posées à la main par Thomas ou par Grok (consigne : question exacte, capture datée) ; Umami : référents `chatgpt.com`, `perplexity.ai`, `gemini.google.com` | OK : tableau question x moteur x « le site est cité : oui/non, lien, position », sur les mêmes 10 questions chaque semaine, plus les visites venues de ces référents. **Limites écrites** : les réponses varient d'un essai à l'autre, dépendent du compte, de la date et de la zone ; 10 questions ne font pas une statistique ; l'absence d'une citation n'est pas une preuve de non-visibilité. On lit une tendance sur 4 semaines, jamais une semaine isolée. Chaque recommandation cite la ligne qui la justifie. |
| 7 | Rapport de Grok | `Social/rapport-grok-AAAA-Sxx.md` de la semaine écoulée | lecture du fichier du vault | OK : fichier présent, 10 sections remplies, tous les posts prévus listés (partis ou expliqués). Pas OK : fichier absent ou incomplet (le noter, demander à Thomas de relancer Grok). |
| 8 | Clics UTM de la semaine passée | Umami, site `deviens-marrant.fr`, lundi à dimanche écoulés | API ou export Umami | OK : visites par `utm_source` et `utm_content` (id de bloc), événements `blog-lettre-envoi`, `lettre-envoi`, `inscription-reussie`, `abonnement-reussi` par `origine`, rapprochés des clics de bio natifs. Écart entre vues natives et visites noté. Pas OK : aucune donnée, ou propriété d'événement manquante. |
| 9 | Analyse et leçons | étapes 4 à 8 | session Claude | OK : 3 constats au plus (ce qui a amené une visite ou une inscription, ce qui n'a rien amené, une question récurrente), chacun avec le chiffre source ; recommandations numérotées, chacune rattachée à un constat. Aucune recommandation sans donnée. |
| 10 | Programme de la semaine suivante | journal des nouveautés (§5), derniers articles du blog, calendrier d'actu (humoristes, saisons, événements vérifiés par WebSearch), rapport Grok | rédaction par la session, les textes d'humour passés à l'aveugle comme pour tout contenu public | OK : 3 contenus maîtres A/B/C, 11 blocs au plus, chaque bloc complet selon §2.3, chaque lien avec UTM, chaque citation d'humoriste vérifiée avec sa source, 0 tiret cadratin, 0 émoji, jamais le même sujet avec le même angle qu'un post déjà parti (registre : liste des `source` des 8 derniers programmes). Contrôle de la barre d'humour. Pas OK : un seul bloc incomplet : on ne dépose pas ce bloc. |
| 11 | Dépôt dans le vault | dossier `00. Me/02. Projets/03. Autres/Deviens Marrant/Social/` | outil du vault (Obsidian ou Drive selon l'accès de la session) | OK : `programme-AAAA-Sxx.md` (nouveau, statut `A_VALIDER` ou `AUTO`), `routine-AAAA-Sxx.md`, relevé SEO/GEO ; relecture du fichier déposé. Pas OK : écriture impossible : coller le contenu dans le résumé à Thomas. |
| 12 | Résumé à Thomas | message de fin de session | session | OK : 10 lignes au plus : ce qui est OK, ce qui est PAS OK, **ce qui demande sa décision** (validation du programme les 3 premières semaines, clé Bing, un réglage, un post sensible), 1 chiffre clé (visites sociales de la semaine, inscriptions lettre). |

## 5. Le journal des nouveautés

- Fichier : `docs/marrant/journal-nouveautes.md` (créé avec ce document). **Une ligne par mise en ligne visible par l'utilisateur** : `JJ/MM/AAAA | phrase simple, en français courant, sans jargon ni nom de version | où le voir`. Les entrées les plus récentes en haut. Rien d'interne (migration, test, refactor) : seulement ce qu'un visiteur ou un abonné peut voir ou faire.
- **Où l'écrire dans le processus** : dans la section « DÉPLOYÉ » de `REPLIT_ACTIONS.md`, chaque entrée destinée au site public (« SITE PUBLIC ») porte une ligne finale `Journal des nouveautés : <phrase>` ou `Journal des nouveautés : aucune (invisible)`. Celui qui déploie (@infrastructure) ajoute la ligne au journal dans le **même commit** que la mise à jour de `REPLIT_ACTIONS.md`, avec la date du passage à 100 %. Pas de ligne dans le journal = la nouveauté n'existe pas pour les réseaux.
- Contrôle du samedi (étape 10) : toute entrée « DÉPLOYÉ » de la semaine marquée « SITE PUBLIC » sans ligne au journal est signalée à Thomas, puis ajoutée.
- Usage : le contenu maître B de chaque semaine vient du journal ; sans nouveauté de la semaine, B reprend une nouveauté récente non encore racontée (registre anti-répétition), sinon un extrait du catalogue validé.
- `[À FAIRE par la session, à valider : ajouter cette ligne finale au gabarit d'entrée de REPLIT_ACTIONS.md et au protocole de déploiement d'@infrastructure ; ce document n'y touche pas.]`

## 6. Risques et garde-fous

### 6.1 Ancien cron Buffer : état exact (lu dans le code, rien modifié)

| Élément | Où | État lu |
|---|---|---|
| Génération quotidienne des posts | route `apps/web/src/app/api/cron/daily-social/route.ts` | **Éteinte dans le code, définitivement** (s14, décision du 01/10) : renvoie `disabled: true, generated: 0`, aucun appel LLM, aucune écriture. L'agent `social-media-agent.ts` porte l'en-tête « ARCHIVÉ : NE PLUS APPELER ». Ce n'est pas elle qui publiait vers Buffer. |
| Planification | `apps/web/vercel.json` | Ne contient **aucun** cron social (seulement `daily-content` x2 et `monthly-plan`). Sans objet en prod : l'hébergement est Cloudflare. |
| Planificateur de prod | `apps/web/wrangler.jsonc`, `triggers.crons` = `*/15 * * * *` et `0 1 * * *`, `vars.CRON_ENABLED = "true"` | **Actif.** Le tick de 15 min exécute les jobs de `src/lib/scheduler/jobs.ts`. `[À VÉRIFIER : que l'un de ces jobs appelle /api/cron/publish-social (lu seulement les 140 premières lignes du fichier, la route annonce « Tourne toutes les 30 minutes »)]` |
| Remise des posts à Buffer | route `apps/web/src/app/api/cron/publish-social/route.ts` | Elle lit l'interrupteur par réseau avant d'envoyer (`reseauxEnPause`) et publie les posts `APPROVED` dont `scheduledAt <= now`. |
| **Interrupteur** | table `SocialPlatformSetting` (colonne `paused`, une ligne par réseau : TWITTER, INSTAGRAM, LINKEDIN), `apps/web/src/lib/social/platform-switch.ts`, changé depuis l'écran admin « social » | Règle de code : **ligne absente ou base illisible = en pause**. État initial de la migration 11 : les 3 réseaux en pause. **État réel de la base : non lu** (pas d'accès base dans cette session). Selon Thomas, la publication automatique est en pause depuis le 26/10 : cela devrait correspondre à `paused = true` sur les 3 lignes. `[À VÉRIFIER par Thomas ou @infrastructure : écran admin social, 3 réseaux sur « Pause »]` |
| Secret | `BUFFER_ACCESS_TOKEN`, `BUFFER_ORGANIZATION_ID` (secrets du Worker) | Présence non vérifiable ici. Tant qu'ils existent, un « Reprise » dans l'admin relancerait l'envoi. |

Pas de nouveau cron à créer pour le système Claude/Grok : la publication se fait par Grok, hors du dépôt, sans passer par l'application.

### 6.2 Garde-fous

1. **Pas de double publication** : tant que Grok publie, les 3 réseaux restent en **Pause** dans l'admin social, et personne ne clique « Reprise ». Au démarrage (avant la 1re publication de Grok) : Thomas ouvre l'admin social et confirme 3 pauses ; la session note la date dans `Social/routine-AAAA-Sxx.md`. À la reprise, le code rattrape les posts `APPROVED` en retard de moins de 24 h et replanifie le reste à 1 par jour : un clic accidentel enverrait donc d'anciens posts.
2. **Nettoyage proposé (décision Thomas, non fait)** : passer en `REJECTED` les posts `APPROVED` ou `PENDING` restants en base, vider la file Buffer, puis retirer `BUFFER_ACCESS_TOKEN` du Worker. Aucun de ces gestes n'est fait par ce document.
3. **Doublons de sujet** : registre des `source` des 8 derniers programmes ; jamais le même sujet avec le même angle.
4. **Pas de double compte** : Buffer et Grok ne gèrent pas le même compte au même moment (canaux Buffer déconnectés ou en pause).
5. **Cohérence avec l'offre** : seules sont citées les promesses déjà publiques : lettre gratuite, 1,99 €/mois (prix du site au 25/11), « premier paiement remboursable sous 14 jours », « résiliable depuis ton profil ». Les chiffres de catalogue (`project-context.md` du 24/03 : 290+ vannes, 60+ conseils, 80+ vidéos) sont **datés et à revérifier** avant toute citation. Aucun post ne promet une fonction non en ligne ; une nouveauté n'est annoncée que si elle figure au journal.
6. **Humour sous la barre** : une vanne n'entre dans un programme qu'après relecture à l'aveugle ; sinon bloc sans blague (règle d'or P0 s18 : jamais remettre en ligne un contenu sous la barre).
7. **Validation des 3 premières semaines** : Grok publie seulement un fichier `VALIDE_THOMAS`. Le passage à `AUTO` est une décision écrite de Thomas, datée dans `Social/routine-AAAA-Sxx.md`.
8. **Dérive d'attribution** : TikTok non reconnu dans `origine` et pas de page de bio dédiée (§1.2) tant que @fullstack n'a pas livré.
9. **Droits** : musique libre de droits uniquement ; aucune capture de spectacle d'un humoriste sans accord ; concours, partenariat, UGC et droit à l'image : @legal avant tout.

## 7. Consigne à donner à Grok bot (à copier tel quel)

```
Tu es l'agent opérationnel de Deviens Marrant (deviens-marrant.fr), un site qui apprend à devenir drôle et à avoir de la répartie, sur le modèle du stand-up français. Public principal : Yanis, 20 ans, étudiant, qui reste muet quand ça chambre. Tu travailles avec Claude, qui écrit tous les textes. Tu ne rédiges aucun texte de publication.

DOSSIER : 00. Me/02. Projets/03. Autres/Deviens Marrant/Social/
- Tu LIS : programme-AAAA-Sxx.md (un fichier neuf chaque samedi, déposé vers 15h Paris). Lis le plus récent, vérifie sa ligne "statut".
- Tu ÉCRIS : rapport-grok-AAAA-Sxx.md (un fichier neuf par semaine, déposé au plus tard le samedi 12h Paris). N'édite jamais un fichier existant, crée-en un nouveau.

TON TRAVAIL
1. Pour chaque bloc "POST" du programme : produis le visuel ou la vidéo exactement selon le brief (plans, texte à l'écran, durée, ton), puis publie à la date et à l'heure indiquées avec le texte_final copié caractère pour caractère (légende, hashtags, lien avec UTM compris).
2. Statut A_VALIDER : ne publie rien, tu attends VALIDE_THOMAS. Statut VALIDE_THOMAS ou AUTO : tu publies. Si deux versions existent (-v2), applique la plus récente.
3. Tu ne réécris JAMAIS un texte : ni reformulation, ni raccourci, ni émoji, ni hashtag ajouté. Si un texte te semble faux, trop long, dépassé ou sensible, tu NE PUBLIES PAS ce bloc et tu le signales dans le rapport (section 10).
4. N'invente aucune donnée : pas de chiffre, prix, date, témoignage ni citation qui ne soit pas dans le bloc. Zéro tiret cadratin, zéro émoji, aucun concurrent nommé. Les humoristes nommés dans les textes sont autorisés ; n'en cite jamais un de mémoire.
5. Visuels : pas de visage de personne réelle, pas de ressemblance avec un humoriste, musique libre de droits uniquement. Étiquette "contenu IA" sur tout visuel réaliste généré.
6. Commentaires : réponds seul aux remerciements, aux questions simples dont la réponse est dans le programme ou sur le site, aux trolls (sobrement : "Pas de problème. Le catalogue est là si tu reviens."). Ton d'Alex : tutoiement, le pote drôle et bienveillant, court, sans leçon. REMONTE sans répondre : prix, paiement, remboursement, résiliation, compte, données personnelles, critique de fond, presse, humoriste ou entourage, droit à l'image, détresse, harcèlement, insultes graves (capture d'abord), toute question dont tu n'as pas la réponse dans le dossier. Ne promets jamais une fonction, une date, un prix.
7. Chaque vendredi, relève les statistiques natives par post (48 h après la publication au plus tôt) et les abonnés par réseau. Recopie les chiffres tels quels. Case vide = "non disponible". Jamais d'estimation.
8. Rapport hebdomadaire : suis le format du contrat (10 sections : posts partis, non publiés, statistiques, comptes, commentaires notables, commentaires remontés, questions récurrentes, incidents, volet SEO/GEO si tu en as fait, signalements de texte). Une section vide s'écrit "néant".
9. SEO/GEO (optionnel) : si tu as fait des constats ou des actions, indique la source (URL, date, capture). Jamais de chiffre sans source.

TES LIMITES
- Tu ne touches ni au site, ni au code, ni aux paiements, ni à la base, ni aux autres fichiers du vault. Tu ne contactes pas la presse, les humoristes ni les abonnés en message privé. Tu ne lances ni concours ni partenariat.
- Tu publies avec ton outil habituel (Buffer compris). L'ancienne publication automatique du site (écran admin « social » de deviens-marrant.fr) est coupée : n'y touche pas et ne la rallume pas.
- En cas de doute, tu ne publies pas et tu l'écris dans le rapport.
```

## 8. Reste à décider ou à faire (hors périmètre de ce document)

- Thomas : confirmer 3 pauses dans l'admin social ; décider du nettoyage Buffer (§6.2, point 2) ; dire comment Grok accède au vault (lecture/écriture du dossier) ; valider le programme S49 le samedi 28/11.
- @fullstack : ajouter `tiktok` aux origines reconnues, page de bio dédiée.
- @infrastructure : ajouter la ligne « Journal des nouveautés » au gabarit de déploiement.
- Session : tester `BING_WEBMASTER_API_KEY`, confirmer le chemin de santé (`/api/health`), vérifier le job du scheduler qui appelle `publish-social`.

Handoff : fichiers `docs/social/systeme-hebdo-claude-grok-s27.md`, `docs/marrant/journal-nouveautes.md`. Décisions : 3 contenus maîtres, 11 publications au plus, TikTok 3 / Instagram 3 / X 3 / LinkedIn 2. Points d'attention : TikTok hors liste blanche d'origine, état réel de l'interrupteur non lu, clé Bing non testée.

## Constat vérifié par la session (26/11/2026, lecture seule de la base de production)

- `SocialPlatformSetting` : TWITTER, LINKEDIN et INSTAGRAM à `paused = true` (dernière mise à jour 15/10/2026).
- `SocialPost` : 577 PUBLISHED, 130 FAILED, 75 REJECTED, aucun post en attente ou approuvé : une reprise accidentelle ne renverrait rien d'ancien.
- Le planificateur (`src/lib/scheduler/jobs.ts`, l. 293-300) appelle bien `/api/cron/publish-social`, qui respecte cet interrupteur. Pas de double publication possible avec Grok tant que les trois lignes restent en pause.
