# E5, relecture à l'aveugle, tour 1 : @ux

Lu : architecture v20 (ligne E5, 2.2, 2.6, 2.7, 2.9, 4.4, 6.2, 6.3), note s24, source `aujourdhui.html` (l. 215 à 407, vue partielle), captures : aujourdhui 320 / 375 / 1280 / premier écran / zoom200 / après-paiement / reprise / cloche, parcours 375 / zoom200 / bonus, carte-rafale revision et revision-avant, mes-questions vide et fil. **Non ouvertes, donc non notées : les captures à 768 (4 écrans), parcours 320 / 1280, carte-rafale 320 / 1280, mes-questions 320 / 768 / 1280, aujourdhui-320 zoom, et les états de la note (aucune capture dans le dossier).** Les captures longues de carte-rafale (4468 px, 3656 px) sont trop réduites pour lire le détail : textes de la carte vérifiés par la note, pas à l'écran.

## Notes /10

| Critère | Note | Raison courte |
|---|---|---|
| C1 conformité | 8 | calendrier de « Parcours » absent, état d'arrivée incohérent, recherche absente à 320 |
| C2 hiérarchie | 8 | une seule action violette par état, mais N4 (ci-dessous) |
| C3 accessibilité | 8 | bordures des boutons secondaires, doublon dans la cloche, ordre DOM |
| C4 lisibilité 320 / 200 % | 8 | rafale cassée à 200 %, recherche absente, pastilles collées |
| C5 clarté des états | 8 | « C'est tout pour aujourd'hui » invisible, « Prends ton temps » ambigu, états sans capture |
| C6 aucun texte inventé | 9 | un libellé non signalé |

## C1 (8)
- **[Parcours, tous états] Calendrier absent.** 6.3 (l. 800) place en tête « le calendrier de 4.1 en quatre lignes et l'étape à reprendre ». Le bloc n'a que l'étiquette et l'étape, et la note §5.9 ne le déclare pas non rendu. Correction : rendre les quatre lignes (texte de 4.1, à relire, aucun texte neuf) ou l'ajouter à la liste des non rendus avec raison.
- **[Aujourd'hui, arrivée et après-paiement, 320 / 375 / 1280] État incohérent.** Le repère « 12 cartes cette semaine » (4.4 a : « seulement à partir d'une carte ») et la carte « Étape en cours, Étape 3 sur 6, Reprendre » s'affichent alors que l'état 1 est « aucune fiche faite ». Correction : en `#etat=pas` et `apres-paiement`, masquer le repère et « Étape en cours » (valeurs d'exemple d'un autre état). Gagne 24 px pour N4.
- **[En-tête, 320 et 200 %] Recherche absente**, alors que la ligne E5 demande le bouton icône de 44 px. À 320 : logo environ 125 + 3 x 44 = 257 px pour 296 utiles (marges de 12) : la loupe tient. Correction : seuil du masquage à 300 px, pas 360. Sous 300 px (200 %), un champ de recherche en tête de « Bibliothèque » (porte déjà dans 6.2) ; décision de repli à noter, sinon la recherche est inatteignable.

## C2 (8) et N4
- **N4 confirmé : en arrivée à 375 x 812, la rangée de puces commence à y = 716** (« Ce soir, c'est plutôt ? » à 693), donc 4 à 5 gestes visibles sous la carte. **Correction** : carte du premier pas avec `min-height: calc(100svh - 440px)` sous 1024 px (environ 372 px à 812, contre 261 aujourd'hui), contenu réparti dans la carte : étiquette et titre en haut, « Moins de 5 minutes » puis bouton « Commencer » collé en bas (`margin-top:auto`). L'espace est dans la carte, pas une boîte vide, et il est moitié moindre que le calc(100svh - 300px) de la v2. Résultat : puces à y environ 828, hors du premier écran ; le titre « Contenu du jour » et le haut de la vanne (texte, sans geste) restent visibles et signalent la suite. Pas de min-height à 200 % de texte (hauteur naturelle déjà supérieure) ni sous 640 px de haut. Avec la ligne « Ton favori est ajouté. » (52 px) rien à ajuster. Test d'acceptation : sur 375 x 812, aucun bouton ni puce de « Contenu du jour » dans [0, 812].
- Reste conforme : un seul bouton violet par état (Commencer, Reprendre, Reprendre en état « rafale faite »).

## C3 (8)
- **[Aujourd'hui, Parcours, Mes questions : « Une autre », « Commencer » (rafale), « Retirer de mon historique », « Continuer »]** bordure du bouton secondaire à peine visible (`#2A2A2A` sur `#1F1F1F`, environ 1,2:1) alors que les puces ont une bordure nette. 1.4.11 : limite du composant sous 3:1. Correction : `border-input` `#707070` (3,3:1) pour tout bouton secondaire.
- **[Cloche, réponse non lue] Doublon** : titre de groupe « L'équipe t'a répondu » puis ligne identique (source l. 349). Un lecteur d'écran lit deux fois. Correction : pas de `h3` pour ce groupe, la ligne porte « L'équipe t'a répondu » et, en second plan, « Une situation à gérer ».
- **[Aujourd'hui, arrivée 320 / 375] Ordre visuel différent de l'ordre DOM** : à l'arrivée « Contenu du jour » passe avant la rafale (capture), le DOM met la rafale d'abord (l. 216 à 221). Tab suit le DOM. Correction : réordonner dans le DOM selon l'état (ou rendre les deux blocs dans l'ordre visuel), jamais `order` seul.
- À vérifier au source (non lu) : piège de focus du panneau (aria-modal posé l. 286, code de piégeage non lu), `aria-current` de la barre (présent d'après `ramener()`).
- Vérifié : `aria-pressed` + coche + contour sur les puces, `aria-live` polie, nom de la cloche au singulier, flamme `aria-hidden`, pastilles `aria-hidden` avec texte équivalent, cibles de 44 px lisibles sur les captures, indice de suite « Bib » + chevron visible à 375 et 320.

## C4 (8)
- **[Aujourd'hui, rafale, 200 %]** les lignes de la liste passent à un mot par ligne (« Coloc / : / la / poêle ») et le chevron chevauche « Et toi, tu fais quoi ? ». Correction : sous 300 px, étiquette (Nouvelle / À revoir) au-dessus du titre de la ligne, chevron dans sa colonne fixe de 24 px, titre sur toute la largeur restante.
- **[Parcours, 200 %]** les cinq pastilles touchent la ligne « Tu avances bien · cap 3 sur 5 » (écart environ 4 px). Correction : 8 px minimum, comme à 375.
- **[Parcours, 375 et 200 %]** N2 et zéro débordement déjà mesurés : acceptés.
- En-tête à 200 % : logo sur deux lignes, acceptable ; la recherche manque (C1).

## C5 (8)
- **[Aujourd'hui, état « rafale faite »]** la carte « Si tu as 5 minutes » n'affiche que son titre : « C'est tout pour aujourd'hui » (source l. 217, texte présent) n'apparaît pas sur la capture. La règle d'affichage ne marche pas. Correction : afficher le texte, sans bouton « Commencer ».
- **[Carte de rafale, `revision-avant`]** « Prends ton temps » est rendu comme un lien violet cliquable, avec un état « Prends ton temps seul ». L'architecture (2.2) en fait une pause de 3 secondes avant les boutons, pas un contrôle. Correction : texte non souligné, boutons Oui / À moitié / Rien visibles à la fin de la pause (désactivés avant, `aria-disabled`), jamais un lien.
- **[Cloche]** états lisibles (feuille basse, pastille, Fermer au focus) ; états « nouveautés » et « vide » non capturés, non notés.
- **[Mes questions, `fil`]** l'envoi répondu enchâsse trois niveaux (carte, encadré, bouton « Continuer »). Correction : encadré gris retiré, « Continuer » directement sous la réponse, « Retirer de mon historique » séparé de 16 px.
- **[Parcours, bonus]** capture inexploitable : l'en-tête et la barre sticky s'impriment au milieu de la page et masquent « Ton cap ». À reprendre (viewport fixe) pour vérifier les 24 px et la place de « Tes bonus ».
- **Captures manquantes** : états de la note (vide, saisie, enregistrée, échec, confirmer, supprimée), cloche nouveautés / vide, Mes questions retard, option de pastille 2 et 3, série à 0. Impossible de noter la note « ma réplique à moi » en états.

## C6 (9)
- Hors étalons et non signalé dans la note §5.6 : « 1 situation nouvelle, jusqu'à 2 à revoir » (4.4 / 2.2 disent « 1 situation nouvelle plus jusqu'à 2 cartes à revoir »). Correction : reprendre la formule de 2.2 ou l'ajouter en [HYPOTHÈSE]. Le reste (« Ton favori est ajouté. », « Les parcours », libellés de la note, accroches) est déjà marqué [HYPOTHÈSE] dans la note.

## À faire pour le tour 2
Ré-capturer : arrivée 375 x 812, rafale faite, rafale 200 %, bonus (viewport), états de la note, cloche nouveautés / vide, 768 complet.
