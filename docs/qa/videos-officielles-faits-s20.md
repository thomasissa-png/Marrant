# Vidéos officielles + vérification de faits (s20)

Date : 2026-10-12. Méthode : oEmbed YouTube (`/oembed?format=json`) pour chaque ID, WebSearch pour les candidats et les faits.
Règle de retenue : chaîne officielle (artiste, diffuseur, festival, producteur) ET même passage (titre concordant).

## Partie A : vidéos tierces

oEmbed des vidéos actuelles (toutes 200, toutes intégrables au 2026-10-12) :

| id | youtubeId | title oEmbed | author_name oEmbed |
|---|---|---|---|
| 5 | 3v8Y4C9Q5hE | Kev Adams- Du côté de chez vous | Valentin HENRY |
| 6 | tj6qta_9PaM | ANNE ROUMANOFF - Carmen et la crise | YouHumour |
| 12 | jgNSu968qD4 | Anne Roumanoff - la chirurgie esthétique, jusqu'où aller ? | YouHumour |
| 14 | v-ySkBGAXLI | Thomas NGIJOL au Jamel Comedy Club | Ryme Beast |
| 19 | zC7ff6w7x-Y | Fary - Le legging - Jamel Comedy Club | JMD Production |
| 21 | agciwdzBH3w | un chinois marrant | Cedric Dric |
| 24 | afFehefVWxk | Karim Duval sur scène : "génération Y" (Open du Rire) | Rire & Chansons |
| 57 | 6lHjXqelKGo | GAD ELMALEH DECALAGES 1997 | REDA MAHBOUB |
| 58 | XwG5Ie10rEg | Fellag - Petits chocs des civilisations (Nouveau Spectacle) | MLP MUSIC |
| 59 | CdRedv9PM40 | Fabrice Eboue Plus Rien A Perdre 2020 FRENCH | Moulay Soultan |
| 68 | U80fwIfPC4M | Le culturiste - Dany Boon | tenguryu |

Durées réelles (résultats de recherche YouTube, à comparer aux durées annoncées dans le catalogue) : id 5 = 2:48 (annoncé 5m20), id 6 = 2:33 (4m50), id 12 = 3:42 (4m30), id 14 = 7:07 (5m40), id 19 = 6:17 (5m), id 21 = 5:13 (5m30), id 24 = 5:18, id 57 = 1:31:51 (75m), id 58 = 1:16:18 (90m), id 59 = 1:21:40 (80m), id 68 = 5:08 (7m). **Toutes les durées annoncées sont fausses**, à corriger quelle que soit la décision.

Identification des chaînes « tierces » qui sont en fait officielles :
- **YouHumour** = plateforme créée en 2008 par Philippe Vaillant, producteur (et ex-mari) d'Anne Roumanoff ; annuaire « Philippe Vaillant Organisation / Youhumour » ; descriptions YouTube signées « © PVO Audiovisuel Multimédia ». Chaîne de producteur, donc officielle. Sources : https://everybodywiki.com/Youhumour , https://www.koifaire.com/ile-de-france/philippe,vaillant,organisation,youhumour-130416.html
- **JMD Production** = chaîne de Jean-Marc Dumontet, producteur de Fary (la page « À propos » de la chaîne le cite parmi ses artistes). Chaîne de producteur, donc officielle. Source : https://www.youtube.com/@jmdprod/about

### Décisions

| id | Décision | Nouvel ID / chaîne à afficher | Preuve oEmbed + remarques |
|---|---|---|---|
| 5 | Pas de version officielle trouvée. Garder | Garder `3v8Y4C9Q5hE`, afficher **Valentin HENRY** | oEmbed 200 « Kev Adams- Du côté de chez vous » / Valentin HENRY. La description dit : extrait de *The Young Man Show* 2012, Dijon. Chaîne officielle « Kev Adams » et YouHumour : aucun extrait équivalent trouvé. Durée 2:48 |
| 6 | **Déjà officielle** (YouHumour = chaîne du producteur) | Garder `tj6qta_9PaM`, afficher **YouHumour** | oEmbed 200 « ANNE ROUMANOFF - Carmen et la crise » / YouHumour. Pas de version sur la chaîne « Anne Roumanoff ». Sketch chanté avec Sigrist, Tsamere, Stotz, Lando, Giroud (selon la description). Durée 2:33 |
| 12 | **Version officielle trouvée** (chaîne de l'artiste). La version actuelle est elle aussi officielle (producteur) | Option recommandée : `lthQeDw2e7g`, chaîne **Anne Roumanoff**. Option sans changement : garder `jgNSu968qD4` et afficher **YouHumour** | oEmbed 200 « Anne Roumanoff : la chirurgie esthétique, jusqu'où aller? » / Anne Roumanoff. Même titre, mise en ligne en 2009 (contre 2015 pour YouHumour), durée 3:33 contre 3:42 : probablement la même captation, montage légèrement différent (non visionné). Le nom de chaîne est « Anne Roumanoff », pas « Anne Roumanoff Officiel » |
| 14 | Pas de version officielle identifiable. Garder | Garder `v-ySkBGAXLI`, afficher **Ryme Beast** | oEmbed 200 « Thomas NGIJOL au Jamel Comedy Club » / Ryme Beast. Pas de description, commentaires désactivés, durée 7:07 : **le passage ne peut pas être identifié sans visionnage**. Aucune des vidéos solo officielles de Ngijol sur « Jamel Comedy Club - CANAL+ » n'a cette durée : Superman `l__Xirj2N6c` 6:20, Cameroun `QMQNv7QWaLg` 5:17, Hollywood `C45dEZeaCHU` 6:38, Les meufs `GsQGncq2eHo` 5:30 (oEmbed 200 pour les 4). Thomas peut visionner pour confirmer la correspondance, ou remplacer par l'une d'elles (ce serait alors un autre passage) |
| 19 | **Déjà officielle** (JMD Production = Jean-Marc Dumontet, producteur de Fary) | Recommandé : garder `zC7ff6w7x-Y`, afficher **JMD Production** (11 M de vues). Alternative : `iFryEGEo4-o`, chaîne **Jamel Comedy Club - CANAL+** | Actuelle : oEmbed 200 « Fary - Le legging - Jamel Comedy Club » / JMD Production, 6:17. Alternative : oEmbed 200 « Fary - Le legging - Jamel Comedy Club (2014) » / Jamel Comedy Club - CANAL+, 6:09 (même passage, montage du diffuseur) |
| 21 | Pas de version officielle identifiable. Garder | Garder `agciwdzBH3w`, afficher **Cedric Dric** (et non « Jamel Comedy Club ») | oEmbed 200 « un chinois marrant » / Cedric Dric. Pas de description, commentaires désactivés, 5:13 : provenance de la captation inconnue, rien ne la relie au Jamel Comedy Club. Versions officielles « Chinois marrant », mais sans correspondance prouvée : Montreux Comedy `PaF0YbHim2E` (8:02, 12 M de vues), Montreux Comedy `n8ALTMHVq1w` (8:41), chaîne de l'artiste « BUN HAY MEAN - BHM TV » `SE3zVllLJTw` (Open du Rire, 5:02), Comédie+ `x9eoxqnAs_U` (4:59). oEmbed 200 pour les 4. Pour passer à une version officielle, il faut d'abord visionner |
| 24 | Officielle. Correction de graphie seulement | Garder `afFehefVWxk`, afficher **Rire & Chansons** | oEmbed 200 « Karim Duval sur scène : "génération Y" (Open du Rire) » / Rire & Chansons. Durée 5:18 |
| 57 | Pas de version officielle (spectacle complet) | Garder `6lHjXqelKGo`, afficher **REDA MAHBOUB** | oEmbed 200 « GAD ELMALEH DECALAGES 1997 » / REDA MAHBOUB. Les autres copies du spectacle complet sont toutes chez des tiers (Hugo Lecourt, Sweet Channel, Rai ZO). Aucune n'est sur une chaîne officielle. Durée 1:31:51 |
| 58 | Pas de version officielle du spectacle complet | Garder `XwG5Ie10rEg`, afficher **MLP MUSIC** | oEmbed 200 « Fellag - Petits chocs des civilisations (Nouveau Spectacle) » / MLP MUSIC. Sur la chaîne officielle « Fellag », il n'y a que des extraits, par exemple `krXP1XZym-k` « Fellag conte les Petits chocs des civilisations » (8:15, oEmbed 200) : contenu différent. Le statut de MLP MUSIC (label ou tiers) n'a pas pu être établi. Durée 1:16:18 |
| 59 | Pas de version officielle (spectacle complet) | Garder `CdRedv9PM40`, afficher **Moulay Soultan** | oEmbed 200 « Fabrice Eboue Plus Rien A Perdre 2020 FRENCH » / Moulay Soultan. La copie la plus vue, `Iuzmy8NbGlg` (« Rire TV2 », @riretvofficiel2), **n'est pas officielle** : chaîne générique de 3 vidéos, malgré le « officiel » dans son handle. Le spectacle est exploité par Amazon Prime Video (bande-annonce `Nf34k2_INWY`), pas sur YouTube. Durée 1:21:40 |
| 68 | **Version officielle trouvée** | **`JNo86HEt86w`**, chaîne **Dany Boon** | oEmbed 200 « Dany Boon - Le culturiste » / Dany Boon. Durée 5:21, contre 5:08 pour la copie de tenguryu (2006) : même sketch, captation ou montage peut-être différent (non visionné) |

## Partie B : faits

| # | Fait | Verdict | Sources |
|---|---|---|---|
| 1 | Le sketch « Le legging » de Fary (JCC) « a lancé sa carrière » | **FAUX tel que formulé.** Fary s'est fait connaître dans *On n'demande qu'à en rire* (France 2, 2010-2011), puis au Jamel Comedy Club (succès 2014-2016). Le legging date du JCC 2014 et compte 11 M de vues sur la chaîne de son producteur, mais aucune source ne dit qu'il a lancé sa carrière. Formulation sûre : « un de ses passages les plus vus, au Jamel Comedy Club en 2014 » | https://fr.wikipedia.org/wiki/Fary ; vidéo `zC7ff6w7x-Y` (11 068 573 vues au 2026-10-12) |
| 2 | Wiesel, « Toulouse - dernier show avant un moment » : angle « regard de voisin suisse sur la France » | **NON CONFIRMÉ.** Ce qui est vrai : Wiesel est suisse (né à Lausanne en 1989), il tourne en France et a été chroniqueur sur France Inter (2017-2018). La description de la vidéo (14 mars 2020, veille du confinement) annonce : « coronavirus évidemment, mais aussi TFC, trains old schools et schtroumpfs ». Rien ne présente le show comme un regard suisse sur la France. Formulation sûre : « un humoriste suisse en tournée à Toulouse, la veille de la fermeture des salles » | https://fr.wikipedia.org/wiki/Thomas_Wiesel ; description YouTube de `_Gru82H__ZM` |
| 3 | Pierre-Emmanuel Barré a été chroniqueur sur France Inter | **VRAI.** Chroniqueur dans *On va tous y passer* (2012-2014), puis dans *La Bande originale* de Nagui (2014 à avril 2017). Départ le 26 avril 2017 : il s'estimait censuré après le refus de sa chronique sur l'abstention | https://fr.wikipedia.org/wiki/Pierre-Emmanuel_Barré ; https://www.politis.fr/articles/2017/04/pierre-emmanuel-barre-quitte-france-inter-sestimant-censure-36813/ |
| 4a | La captation `GFS3p1Z8IiE` (Européen, mise en ligne le 5 févr. 2019) correspond à « Inflammable » | **PROBABLE, NON CONFIRMÉ formellement.** Avant la mise en ligne, la seule date d'Azencot à L'Européen est *Inflammable*, le 12/11/2018 (date unique). *Animal* n'y passe que le 10/12/2019, donc après la vidéo. « Red Velvet » n'existe pas comme spectacle d'Azencot. Aucune source trouvée sur ce que désigne ce nom (soirée, producteur ?). La description de la vidéo se limite au titre | https://www.offi.fr/artiste/david-azencot-88416.html |
| 4b | Thèmes : société / politique / sexisme (et non autobiographique / familial) | **VRAI pour l'angle société.** offi : « état des lieux corrosif et mordant de la société contemporaine. Du terrorisme aux religions, en passant par le nazisme ». Radio VL : « la politique, le droit des animaux, le sexisme, les attentats ». Aucune source sur un angle autobiographique ou familial : **ne pas l'écrire** | https://www.offi.fr/theatre/leuropeen-2299/david-azencot-inflammable-61125.html ; https://vl-media.fr/lhumoriste-david-azencot-linvite-de-ca-va-brader-radio-vl-25/ |
| 5 | Kheiron, « figure de l'improvisation » (« 60 minutes avec Kheiron » improvisé avec le public) | **VRAI avec nuance.** *60 minutes avec Kheiron* (L'Européen, 2016-2018, puis tournée et reprise sous le titre *Dragon* à l'Apollo Théâtre) : chaque soir, il réagit au public et compose 60 minutes en puisant **dans 3 heures de spectacle écrit**. *Libre Éducation* (2012) était déjà décrit comme « stand-up d'improvisations ». Formulation sûre : « spectacles construits en direct avec le public », plutôt que « entièrement improvisés » | https://fr.wikipedia.org/wiki/Kheiron ; https://sortiraparis.com/en/what-to-do-in-paris/cinema-series/articles/303966-kheiron-unveils-dragon-60-minutes-of-improv-at-l-apollo-theatre |
| 6 | Doully, `Mw2zHEaBPDs` | **RAS.** oEmbed 200 « Doully – La sobriété » / Montreux Comedy, mis en ligne le 1er janv. 2020 (chaîne officielle du festival). La description ne renvoie qu'au podcast Yellow Mic et au « Répondeur » : aucun fait à corriger | oEmbed + description YouTube |

## Handoff

- **À changer d'ID** : id 68 vers `JNo86HEt86w` (Dany Boon). Id 12 vers `lthQeDw2e7g` (Anne Roumanoff), optionnel car l'actuelle est déjà officielle.
- **Officielles déjà en place, nom de chaîne à corriger** : id 6 « YouHumour », id 19 « JMD Production » (ou passer à `iFryEGEo4-o` / « Jamel Comedy Club - CANAL+ »), id 24 « Rire & Chansons ».
- **Tierces à garder, nom de chaîne exact** : id 5 « Valentin HENRY », id 14 « Ryme Beast », id 21 « Cedric Dric », id 57 « REDA MAHBOUB », id 58 « MLP MUSIC », id 59 « Moulay Soultan ».
- **Durées** : les 11 durées annoncées sont fausses (voir la liste plus haut), à corriger partout.
- **Visionnage humain nécessaire** : id 14 et id 21 (passage non identifiable), id 4a Azencot (confirmer *Inflammable*).
- **Copy** : retirer « a lancé sa carrière » (Fary), « regard de voisin suisse sur la France » (Wiesel) et tout angle autobiographique ou familial (Azencot). Kheiron : « construit en direct avec le public ».
- Limite : le statut « UNPLAYABLE » renvoyé par l'API player vient du contrôle anti-bot du conteneur. Toutes les vidéos citées répondent 200 en oEmbed (intégrables).

