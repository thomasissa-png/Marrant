# Espace D10, phrases manquantes (s24) : avis @legal. Draft à faire valider par un avocat.
Fichier commun : `apps/web/src/config/textes/espace-confidentialite.ts`, objet `CONFIDENTIALITE_ESPACE` ; rendu dans `apps/web/src/app/(dashboard)/confidentialite/page.tsx` derrière `ESPACE_CLIENT_PUBLIE`. Aucun tiret cadratin.

## 1. « Ma réplique à moi » (`UserReplique`)
- **Nouvelle clé `donneesReplique`**, partie 2 (données), juste après `donneesCaps` :
  « Les phrases que tu écris dans « Ma réplique à moi » (une par fiche) et leur date, si tu es abonné. On ne les lit pas pour t'analyser, et elles ne sont jamais ajoutées à nos mesures »
- **Nouvelle clé `baseReplique`**, partie 3 (base), après `baseCaps` : « Garder et te réafficher les phrases que tu as écrites : exécution du contrat »
- **Nouvelle clé `dureeReplique`**, partie 6 (durée), après `dureeEtapes` (phrase séparée) :
  « Tes phrases de « Ma réplique à moi » sont gardées tant que ton compte existe, même si ton abonnement s'arrête : tu les relis alors sans pouvoir les modifier. Tu peux en supprimer une quand tu veux, et elles sont toutes effacées avec ton compte. »
- Réserve : « on ne les lit pas » est vrai tant que l'admin ne lit pas `UserReplique` (test d'import en place) ; sinon retirer cette moitié de phrase.

## 2. État « lu » de la cloche (`EquipeFil.ouvertParAbonneLe`)
- **Nouvelle clé `donneesLu`**, partie 2 (données), après `donneesReplique` :
  « La date à laquelle tu ouvres une réponse de l'équipe, pour afficher « lu » sur la cloche, si tu es abonné »
- **Nouvelle clé `baseLu`**, partie 3 (base) : « T'indiquer ce que tu as déjà lu : exécution du contrat »
- **Durée**, à joindre à `dureeReplique` ou en phrase séparée, partie 6 :
  « La date d'ouverture d'une réponse est gardée avec ta question, tant que ton compte existe, et effacée avec lui. »

## 3. `mesure` raccourcie (remplace la valeur actuelle de `mesure`)
- **Texte exact** : « Usage de ton espace, si tu es abonné : chaque jour où tu l'ouvres et chaque cap atteint (son numéro). On compte aussi, sans aucun lien avec ton compte, combien de fois certains écrans s'ouvrent (cloche, bonus, coin « Humour noir », archive « Lettres ») et combien de répliques et de questions sont écrites. Aucune adresse IP. Les données rattachées à ton compte sont gardées au plus {durée}, et effacées plus tôt avec ton compte. »
- `{durée}` : [À FIXER PAR THOMAS, 13 mois proposés] ; écrire « 13 mois » seulement après son go, et seulement si la purge `conservation-usage.ts` est programmée (sinon la phrase est fausse). Pas de point final si le style des puces l'exige.
- `baseMesure` : inchangée (« événements rattachés à ton compte et lus sous forme anonymisée » reste vraie).
