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
