# Scénarios D11, espace client Premium (s24, 13/11)

Méthode : parcours déroulé dans le code (pages `mon-espace/**`, composants `espace/**`, textes `espace-*.ts`, `data/espace/*.json`). Les captures `docs/captures/s24-e5/` existent pour chaque état (vide, fil, retiré, neutre, bilan) mais je n'ai pas ouvert les images : constats tirés du code seulement. Données servies aujourd'hui : `ecouter.json` et `bonus.json` vides ; situations, à plat, séances, vocabulaire, jeux, bilans, humour noir, missions remplis.

## Yanis (20 ans, article, quiz, arrive à froid) : arrivée, premier pas, rafale
1. Paiement, page succès : « Continuer » (1 clic) vers Aujourd'hui, `?depuis=` et `?favori=` portés. Blocage possible : paiement non vérifié (états connexion / non vérifié couverts, message honnête).
2. Aujourd'hui, état 1 : une seule carte « Ton premier pas » + « Commencer » (1 clic). Le quiz fait sur ce navigateur choisit la situation ; sans signal, scène par défaut. Pas de blocage, pas d'impasse.
3. Fiche situation, geste, « Fait » : valeur atteinte en 3 actions (Continuer, Commencer, retour du geste). Sortie de la fiche vers Aujourd'hui non relue ligne à ligne dans `fiche.tsx` (à vérifier par @qa).
4. Jour 2, état 2 : « Les cartes du jour » (1 clic) puis 1 à 2 actions par carte (max 3 cartes). Question C9 une fois (1 clic, ignorable). Fin : « C'est tout pour aujourd'hui », puis « Reprendre » l'étape. Aucun blocage.
5. Contenu du jour (vanne, conseil, vidéo, « Une autre ») : jamais vide, repli vers les portes du catalogue.

## Sophie (26 ans, boulot, peu de temps) : une situation, une mission, Mes questions, cloche
1. Quoi répondre : filtres « Où et avec qui ? » = Boulot (1 à 2 clics), liste, fiche. Filtre sans résultat : « Ta situation n'est pas dans la liste ? Raconte-la à l'équipe » (sortie prévue).
2. Mission (s'entraîner, 1 clic depuis Aujourd'hui) : énoncé, « Ton retour » (1 clic), suite selon le retour. Facultative, jamais bloquante.
3. Mes questions : état vide avec 3 exemples de messages et le délai (pas de tableau vide). Envoi en 3 actions (type, texte, envoi). Brouillon gardé en cas d'échec (libellé 19).
4. Cloche : sans réponse, « Rien de nouveau. Reviens quand tu veux. » ; erreur : message dédié ; réponse : ligne vers le fil, pastille éteinte à l'ouverture du fil. Aucune impasse.
5. Le quiz est gardé dans le navigateur seulement : sur un second appareil, le premier pas retombe sur la scène par défaut (amis), pas sur le boulot. Décision 4.2 assumée, voir D-8.

## Marc (34 ans, parcours, progression) : Bibliothèque, Mon profil, résiliation, ancien abonné
1. Parcours : « Tes 4 premières semaines » puis « Reprendre » (1 clic). Semaine 4 annonce un exercice « Écouter, repérer » qui n'existe pas encore : D-1.
2. Bibliothèque : thèmes, catalogue, techniques ; « Écouter, repérer » et bonus des caps sont absents (pas de ligne grisée, conforme 5.4). Coin humour noir : écran d'entrée « Entrer » (1 clic), rien d'affiché avant.
3. Mon profil : carte cap, parcours, historique en lecture seule seulement si données (jamais de tableau vide). La ligne de lien vers Mes questions du plan T8 est à confirmer dans `ProfilDashboard` (non relue).
4. Résiliation (s23) : page confirmée avec date de fin, « Retour à l'accueil » ou « Changer d'avis » ; l'accès à l'espace continue jusqu'à la date. Pas de lien « Retourner à mon espace » (choix s23 « aucune main tendue », non touché).
5. Ancien abonné : toute page de l'espace redirige vers `/abonnement` (lignes « progression gardée », « historique gardé » si n > 0). Historique relisible dans Mon profil. Réactivation : 1 clic depuis l'offre.

## Défauts
| # | Classe | Constat | Fichier | Consigne @fullstack |
|---|---|---|---|---|
| D-1 | Bloquant | Promesse non tenue : « Semaine 4 : un exercice « Écouter, repérer » » affiché à tout abonné, `ecouter.json` vide (Écouter et bonus pas écrits). | `components/espace/quatre-semaines.tsx`, `config/textes/espace-caps.ts` (ligne 88) | Ne pas réécrire le texte validé : n'afficher la ligne que si `ecouter.json` contient au moins une fiche (même principe que `bonusTousPublies`) ; test. Sinon bloquer l'ouverture jusqu'à C5. |
| D-2 | Bloquant | Vérifier que l'e-mail E0 (`paiement.ts`, puces) et toute page n'annoncent les bonus des caps qu'avec `bonusTousPublies()` ; l'offre est gardée, l'e-mail non vérifié. | `config/textes/paiement.ts`, `lib/espace/bonus-publies.ts` | Contrôler et, si la puce bonus est ajoutée, la conditionner de même ; sinon ne pas l'ajouter avant C8. |
| D-3 | Gênant | Mission sans contenu pour une marche : `/mon-espace/s-entrainer?marche=n` n'affiche rien (aucun état vide), et « Voir la marche n+1 » peut y mener. Couverture des 5 marches dans `missions.json` non vérifiée. | `app/(dashboard)/mon-espace/s-entrainer/page.tsx`, `mission/mission-carte.tsx` | Si `mission` est null avec `?marche=`, afficher une ligne « Pas de mission pour cette marche pour l'instant » et un lien vers la marche ouverte ; contrôler 1 à 5 par test. |
| D-4 | Gênant | Rafale non finie mais sans carte (catalogue épuisé ou tirage vide) : bouton « Les cartes du jour » avec sous-titre vide et `s-entrainer` sans carte. | `aujourdhui/cartes-du-jour.tsx`, `lib/espace/rafale.ts` | Test du cas 0 carte ; si possible rendre l'état « C'est tout pour aujourd'hui » ou masquer le bloc. |
| D-5 | Gênant | Ancien abonné : le lien « L'équipe t'a répondu » (e-mail) vers `/mon-espace/questions/[id]` et le titre de fiche d'une réplique mènent à `/abonnement`, pas à la réponse. | `lib/espace/garde.ts` (garde du fil), `profil/historique-lecture-seule.tsx` | Pour un ancien abonné, rediriger les adresses de fil vers `/profil#mes-questions` (ancre à poser) ; vérifier que les liens de fiches des répliques ne sont pas des liens morts (texte seul). |
| D-6 | Mineur | Abonné actif en résiliation programmée : la page confirmée ne propose aucun retour vers l'espace. | `resiliation/confirmee/page.tsx` | Aucune action (choix s23 non rouvert) ; signaler à Thomas seulement. |
| D-7 | Mineur | Sortie de fiche après « Fait » non relue (`fiche.tsx`). | `components/espace/fiche.tsx` | @qa : vérifier un lien « Aujourd'hui » visible après le geste. |
| D-8 | Mineur | Quiz et lien d'origine uniquement dans le navigateur : Sophie sur un autre appareil perd son premier pas « boulot ». | `components/espace/aujourdhui/premier-pas.tsx` | Aucune action (architecture 4.2) ; la question C9 corrige ensuite. |

Aucune impasse structurelle ni écran sans sortie trouvé : chaque page a la barre de rubriques ; les 404 de bonus et de lettres non envoyées sont identiques à la vraie 404 (voulu). Tout état vide relu est prévu (Mes questions, Mes répliques, Lettres, Quoi répondre, cloche, profil, bonus), hors D-3 et D-4.
