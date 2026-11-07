# Relecture à l'aveugle v2 : panel 3 personas, onboarding Premium s23 (07/11/2026)

Texte relu : `docs/copy/onboarding-premium-s23-emails.md` (v2), lignes 1 à 206 seulement. Non lus : le journal v1 → v2, les revues précédentes (`revues-onboarding/*`).
Personas : `docs/mobile/attentes-utilisateur.md` §1 et `project-context.md` (Yanis 20 ans étudiant, Sophie 26 ans jeune active, Marc 34 ans récemment séparé). Lecture faite sur mobile, en boîte de réception, sans préheader (aperçu = « Salut {prénom}, » + première phrase).
Contexte appliqué : 3 abonnés sur 4 résilient dans les minutes ou le lendemain du paiement sans rien utiliser. Chaque persona est joué deux fois pour E1 : abonné actif, puis abonné en résiliation programmée.
Décisions fixes non contestées : pas d'e-mail de rappel avant prélèvement ; signature « L’Équipe Deviens Marrant ». Choix d'étalons documentés de Thomas (objets 1 A, 3 A, 4 A, phrase 5 C, texte E2) : non re-questionnés, la réaction des personas est seulement rapportée.
Rendu vérifié pour le mois en cours : carnet `apps/web/src/data/carnet/2026-11.json`, 30 fiches, fiche offerte « Le gratin « intéressant » » (id 2026-11-10). Parcours : `config/premium.ts:76-86` (Machine à Café 15 min/semaine, Répartie 20 min/semaine, Confiance 20 min/semaine, plus Storytelling et Boulot si publiés).

---

## 1. Synthèse

| E-mail | Yanis | Sophie | Marc | Moyenne | Barre 9 |
|---|---|---|---|---|---|
| E0 J0 bienvenue | 7 | 6 | 7 | **6,7** | Non |
| E1 CARNET (actif) | 8 | 7 | 8 | **7,7** | Non |
| E1 CARNET (résiliation programmée) | 7 | 7 | 8 | **7,3** | Non |
| E1 PARCOURS | 6 | 6 | 7 | **6,3** | Non |
| E1 OUVERTS | 5 | 4 | 5 | **4,7** | Non |
| E2 J21 | 5 | 7 | 6 | **6,0** | Non |

Verdict : aucun e-mail à 9. Le meilleur est E1 CARNET, parce qu'il est le seul à donner une réplique utilisable dans l'e-mail même. Le défaut commun : **E0, le seul e-mail lu dans la fenêtre où 3 abonnés sur 4 partent, ne contient rien à utiliser**. Il promet (« voici par où commencer ») puis renvoie vers un lien ; la première valeur réelle arrive à J5, quand la résiliation est déjà faite.

Ouverture : E0 ouvert par les trois (ils viennent de payer). E1 CARNET ouvert par Yanis et Marc sur la première ligne, Sophie hésite sur l'objet. E1 PARCOURS ouvert par Marc seulement. E1 OUVERTS ouvert par personne sur l'objet seul. E2 ouvert par Sophie, survolé par Marc, ignoré par Yanis.

---

## 2. E0 : bienvenue (J0)

Rendu lu : objet `Ton abonnement est confirmé : Premium est ouvert, sers-toi` ; aperçu « Salut Yanis, voici ce qui vient de s’ouvrir, et par où commencer. » ; version mensuelle, carnet publié, état `recoit`, question ouverte.

**Yanis (7/10).** Ouvre : oui, c'est la confirmation, il vérifie que le paiement est passé. Ensuite : lit « Pour commencer », voit « une fiche du carnet du mois, une situation et sa réplique », ne clique pas tout de suite (il est 23 h, il a eu ce qu'il voulait savoir), descend jusqu'au prix. Retient : « Pour commencer : une fiche du carnet du mois, une situation et sa réplique. » (il comprend le produit). Agace : « on conseille une étape par semaine » (« une étape par semaine, c'est un cours, moi je voulais de quoi répondre ce soir »). Lit ensuite « Prends ton temps pour te faire un avis : d’ici le {date}, tout est ouvert, et tu pourras encore résilier la veille. » et en tire : « la veille, je vais oublier ; si l'accès reste ouvert jusqu'au bout, je résilie maintenant et je verrai ». C'est exactement le comportement des 3 sur 4.

**Sophie (6/10).** Ouvre : oui. Ensuite : survole, cherche une blague à lire dans le métro, n'en trouve pas, voit la liste « le catalogue sans limite, les exercices des fiches, tes favoris, ta progression et ta série » et la lit comme une fiche produit. Agace : « Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance. » (deuxième confirmation après l'objet, ton de banque). Retient : « La lettre de la semaine arrive chaque jeudi, incluse dans ton abonnement ; tu l’arrêtes en un clic » (elle sait qu'elle aura du court sans rien faire). Ne clique sur aucun lien.

**Marc (7/10).** Ouvre : oui. Ensuite : lit tout, y compris le bloc contractuel, et apprécie la clarté. Retient : « Toutes les étapes sont ouvertes ; on conseille une étape par semaine, avec un rappel par e-mail si tu l’actives dans ton profil. » (une structure, un rythme). Agace : rien de franc ; il regrette de ne voir aucun contenu dans l'e-mail (« c'est une liste de ce que j'ai acheté, pas un premier pas »). Clique « Choisir mon parcours » s'il n'y a pas de carnet, sinon « Ouvrir le carnet », plus tard dans la soirée.

**Ce qui marche.** Valeur avant contrat, contrat complet et lisible, résiliation et rétractation sans piège (C10 de la grille), aucune promo.
**Ce qui bloque le 9.** Aucune réplique dans l'e-mail ; « une étape par semaine » lu comme scolaire par Yanis ; doublon de confirmation (objet + « est activé » + « Voici ta confirmation »).

---

## 3. E1 : J5

### 3.1 Version CARNET

Rendu lu (novembre 2026) : objet `Une situation, une réplique` ; aperçu « Salut Marc, Quelqu’un te balance une remarque devant tout le monde, et rien ne te vient. » ; fiche « gratin » : « On te dit : « Il est... intéressant, ton gratin. Tu as suivi une recette ? » » / « Ta réplique : « J'ai suivi une recette. Elle a résisté. » ».

**Yanis (8/10).** Ouvre : oui, sur l'aperçu (« c'est moi, ça »). Ensuite : lit la réplique, sourit, la garde en tête pour la prochaine coloc. Clique « Ouvrir le carnet » pour en voir d'autres. Retient : « Quelqu’un te balance une remarque devant tout le monde, et rien ne te vient. » Agace : rien ; trouve le « Pourquoi elle marche » long (40 mots) mais le saute.

**Sophie (7/10).** Ouvre : hésite sur l'objet (« Une situation, une réplique » ne dit pas que c'est pour elle ni d'où ça vient), ouvre grâce à l'aperçu. Ensuite : lit la réplique, la trouve ressortable mot pour mot. Retient : « J'ai suivi une recette. Elle a résisté. » Agace : rien de franc ; aurait voulu savoir combien d'autres l'attendent (« il y en a une ou trente ? »).

**Marc (8/10).** Ouvre : oui. Ensuite : lit tout, y compris « Pourquoi elle marche », clique le carnet. Retient : « Pourquoi elle marche : Tu réponds à la question mot pour mot, puis « elle a résisté » transforme la cuisine en bras de fer » (il apprend, sans cours). Manque : un « truc à tester » ; la fiche contient un champ `exercice`, l'e-mail ne le montre pas.

**Variante résiliation programmée.** Aperçu : « Salut Yanis, Ton accès reste ouvert jusqu’au {date} : voici par où commencer. »
- Yanis (7) : ouvre par curiosité, soulagé qu'on ne lui demande pas de rester. Lit la réplique. Ne réactive pas, mais clique le carnet. « voici par où commencer » suivi d'une situation et non d'un point de départ lui paraît un peu décousu.
- Sophie (7) : ouvre, lit la réplique, apprécie l'absence de relance (« ils ne me courent pas après »).
- Marc (8) : ouvre, lit tout ; la date exacte de fin d'accès lui sert.
La phrase de tête est un texte imposé par @legal : aucune correction proposée dessus.

### 3.2 Version PARCOURS

Rendu lu : objet `Une question sur ton parcours ?` ; aperçu « Salut Marc, Dans ton parcours « Confiance », l’étape 2 est ouverte : {etapeTitre}. »

**Yanis (6/10).** Ouvre : à moitié ; l'objet sonne comme un questionnaire de satisfaction ou un ticket de support. Ensuite : lit l'aperçu, ne clique pas. Agace : « Une question sur ton parcours ? » (l'e-mail ne pose aucune question sur le parcours).
**Sophie (6/10).** Ouvre : non sur l'objet, oui si l'aperçu s'affiche. Agace : « l’étape {etapeNumero} est ouverte » (« elle l'était déjà, le premier e-mail disait que toutes les étapes sont ouvertes »).
**Marc (7/10).** Ouvre : oui, c'est son parcours. Ensuite : clique « Reprendre mon parcours ». Retient : « Tu reprends là où tu en étais. » Même remarque que Sophie sur « est ouverte ».

### 3.3 Version OUVERTS

Rendu lu : objet `Les parcours sont ouverts` ; aperçu « Salut Sophie, Les 3 parcours sont ouverts, toutes les étapes comprises : choisis le tien. »

**Yanis (5/10).** Ouvre : non (« ouverts, comme un magasin ? »). Si ouvert : rien à lire, un lien. Agace : « Les {N} parcours sont ouverts, toutes les étapes comprises : choisis le tien. » (il ne sait pas lesquels).
**Sophie (4/10).** Ouvre : non. C'est l'abonné qui n'a rien utilisé en 5 jours, et l'e-mail ne lui donne ni contenu ni raison de choisir. Agace : « choisis le tien » sans les noms ni le temps demandé.
**Marc (5/10).** Ouvre : oui par principe. Agace : aucun titre, aucune durée. Variante résiliés : « Ton accès reste ouvert jusqu’au {date} : voici par où commencer. » suivi de « Les {N} parcours sont ouverts » fait trois fois « ouvert » en deux lignes.

---

## 4. E2 : J21

Rendu lu : objet `Trois semaines : qu’est-ce qui manque ?` ; aperçu « Salut Sophie, ça fait trois semaines que tu es là. Dis-nous ce qui t’a servi… »

**Yanis (5/10).** Ouvre : non ; l'objet ressemble à un sondage. S'il ouvre : ne répond pas (« écrire un e-mail à une marque, jamais »). Retient malgré tout : « ce qui t’a fait lever les yeux au ciel » (ça sonne humain).
**Sophie (7/10).** Ouvre : oui, c'est court. Répond peut-être une ligne. Retient : « ce qui t’a fait lever les yeux au ciel ». Agace : rien.
**Marc (6/10).** Ouvre : oui. Agace : « Dis-nous ce qui t’a servi » s'il n'a presque rien fait (« je n'ai rien à dire, donc je ne réponds pas »). Remarque, en mensuel : l'e-mail tombe environ 9 jours avant le prélèvement et lui rappelle qu'il paie ; il vérifie son profil.

---

## 5. Corrections (texte exact, ton du fichier)

Champs ajoutés, tous lus dans le code : `{nbFiches}` = `fiches.length` du carnet du mois (30 en novembre 2026), `{nbAutres}` = `{nbFiches}` moins 1, `{exercice}` = champ `exercice` de la fiche offerte (`2026-11.json`), `{listeParcours}` = `PREMIUM_PARCOURS` rendu « {name} ({timePerWeek}) », séparés par des virgules, le dernier par « et » (`config/premium.ts:76-86`).

### E0
| # | Avant | Après | Pour qui |
|---|---|---|---|
| E0-1 (levier principal) | `Pour commencer : [si carnet] une fiche du carnet du mois, une situation et sa réplique.` puis `[si carnet] Ouvrir le carnet : {url}/carnet` | `[si carnet] Pour commencer, une réplique du carnet de ce mois-ci :` / `{situation}` / `On te dit : « {onTeDit} »` / `Ta réplique : « {reponse} »` / `Les {nbAutres} autres situations du mois : {url}/carnet` | Les trois : une réplique utilisable dans les minutes qui suivent le paiement, au moment où 3 sur 4 partent. Dépendance : E1 CARNET, voir point 1 de la section 7. |
| E0-2 | `[sinon] la première étape d’un parcours, au choix parmi les {N}.` | `[sinon] la première étape d’un parcours, au choix : {listeParcours}.` | Sophie et Marc : le temps demandé est visible. |
| E0-3 | Aperçu `Salut {prénom}, voici ce qui vient de s’ouvrir, et par où commencer.` | `[si carnet] Salut {prénom}, voici ta première réplique, et tout ce qui vient de s’ouvrir.` (sans carnet : inchangé) | Les trois : l'aperçu annonce un contenu, pas un mode d'emploi. |
| E0-4 | `Toutes les étapes sont ouvertes ; on conseille une étape par semaine, avec un rappel par e-mail si tu l’actives dans ton profil.` | `Toutes les étapes sont ouvertes, à ton rythme. Si tu veux un fil, une étape par semaine suffit, et ton profil peut te la rappeler par e-mail.` | Yanis (plus de « on conseille », moins scolaire), Marc garde le rythme. Fait inchangé (rappel activable, `rappel-parcours.ts`). |
| E0-5 | `Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance.` | `Bienvenue, et merci.` | Sophie : l'objet et « Voici ta confirmation » confirment déjà. Si @legal tient à « est activé » : `Ton abonnement Premium est activé. Bienvenue, et merci.` |

Non corrigé, réaction rapportée : la phrase 5 C (« tu pourras encore résilier la veille ») est lue par Yanis et Sophie comme « je résilie maintenant, l'accès reste ». C'est un choix documenté de Thomas : non contesté, signalé pour sa décision (section 7).

### E1 CARNET
| # | Avant | Après |
|---|---|---|
| E1C-1 | (rien après `Pourquoi elle marche : {pourquoi}`) | `À tester cette semaine : {exercice}` [à vérifier @fullstack : le champ `exercice` de la fiche offerte est-il lisible sans compte ? Si non, Thomas décide, le destinataire étant Premium] |
| E1C-2 | `Ouvrir le carnet : {url}/carnet` | `Les {nbAutres} autres situations du mois : {url}/carnet` |
| E1C-3 | Fiche rendue telle quelle depuis le JSON (`J'ai`, `Il est...`) | Normaliser au rendu : apostrophe ’ et points de suspension … (convention du fichier, l. 11). Correctif @fullstack, sans changer un mot. |

### E1 PARCOURS
| # | Avant | Après |
|---|---|---|
| E1P-1 | Objet `Une question sur ton parcours ?` | `Ton parcours « {parcoursTitre} » : la suite` ; repli sans titre : `Ton parcours : la suite` |
| E1P-2 | `Dans ton parcours « {parcoursTitre} », l’étape {etapeNumero} est ouverte : {etapeTitre}. Tu reprends là où tu en étais.` | `Dans ton parcours « {parcoursTitre} », la suite, c’est l’étape {etapeNumero} : {etapeTitre}. Tu reprends là où tu en étais.` ; repli sans titre d'étape : `…la suite, c’est l’étape {etapeNumero}. Tu reprends là où tu en étais.` |

### E1 OUVERTS
| # | Avant | Après |
|---|---|---|
| E1O-1 | Objet `Les parcours sont ouverts` | `{N} parcours : lequel pour toi ?` |
| E1O-2 | `Les {N} parcours sont ouverts, toutes les étapes comprises : choisis le tien.` | `Les {N} parcours, toutes les étapes comprises : {listeParcours}. Prends celui qui ressemble à ta semaine, la première étape suffit pour commencer.` |

Rendu novembre : « Les 3 parcours, toutes les étapes comprises : Machine à Café (15 min/semaine), Répartie (20 min/semaine) et Confiance (20 min/semaine). » Supprime aussi la triple répétition de « ouvert » dans la variante résiliés.

### E2
Texte étalon 4 A non modifié. Ajout à soumettre à Thomas (touche un étalon), après `on lit chaque réponse.` :
`Une ligne suffit, même pour dire que tu n’as pas encore eu le temps.`
Pour Marc et Sophie inactifs : leur donne une réponse possible quand rien ne leur a « servi ».

---

## 6. Ce qui ferait monter chaque e-mail à 9 (sans toucher aux décisions fixes)

- **E0 → 9** : E0-1 à E0-5. La réplique dans l'e-mail fait passer Yanis et Sophie de « liste de ce que j'ai acheté » à « j'ai déjà quelque chose à dire ce soir » ; c'est le seul e-mail qui arrive avant la résiliation. Note attendue du panel : 8,5 à 9 ; le 9 plein dépend de la réaction à la phrase 5 C, qui reste à Thomas.
- **E1 CARNET → 9** : E1C-1 (Marc a son « truc à tester ») et E1C-2 (Sophie sait qu'il y en a 29 autres). Sous réserve que la fiche du mois passe la barre (P0 s18) : celle de novembre (« J'ai suivi une recette. Elle a résisté. ») a été jugée ressortable par les trois.
- **E1 PARCOURS → 9** : E1P-1 et E1P-2. L'objet annonce ce qu'il y a dedans, et « la suite » remplace un « est ouverte » qui contredisait E0.
- **E1 OUVERTS → 9 difficile** : E1O-1 et E1O-2 le montent vers 7. Pour 9, il faudrait un contenu dans l'e-mail ; sans carnet du mois, aucune source vérifiable n'existe aujourd'hui (point 3, section 7).
- **E2 → 9 difficile** pour Yanis, qui ne répond à aucun e-mail de marque ; l'ajout E2 le monte vers 7 pour Sophie et Marc. La règle « aucun lien d'action » est respectée, donc le format reste un e-mail à réponse libre.

---

## 7. Points pour Thomas et les agents

1. **E0-1 et E1 CARNET** : si E0 montre la fiche offerte, E1 CARNET la remontre cinq jours après. Deux options pour Thomas : (a) E1 garde la même fiche et ajoute E1C-1 (l'exercice fait la différence) ; (b) E1 prend une autre fiche du mois, ce qui revient à envoyer une fiche réservée à un abonné Premium (règle « aucune fiche réservée divulguée » à arbitrer).
2. **Phrase 5 C** (choix Thomas, non contesté) : deux personas sur trois en tirent « je résilie tout de suite ». Le panel le rapporte, sans proposer de rappel. Le levier copy reste E0-1 : donner une raison de rester avant d'arriver au bloc « Résilier ».
3. **OUVERTS sans carnet** : aucune vanne vérifiable ne peut être insérée aujourd'hui ; à voir avec @fullstack si une vanne du catalogue validé peut être tirée par une règle déterministe (comme `ficheOfferte`).
4. **@legal** : E0-5 (garder ou non « Ton abonnement Premium est activé ») ; la phrase de tête des résiliés n'est pas touchée.
5. **@fullstack** : `{nbFiches}`, `{nbAutres}`, `{listeParcours}`, normalisation typographique de la fiche (E1C-3), statut du champ `exercice`.

## Handoff

- **Fichier produit** : `docs/copy/revues-onboarding/aveugle-panel-v2.md`. Fichier relu non modifié.
- **Notes** : E0 6,7 ; E1 CARNET 7,7 (résiliés 7,3) ; E1 PARCOURS 6,3 ; E1 OUVERTS 4,7 ; E2 6,0. Aucun e-mail à 9.
- **Prochain** : @copywriter applique les corrections retenues par Thomas, puis nouvelle relecture à l'aveugle (barre 9/10).
