# Question d'aise (C9) : information RGPD, s24 (porte G9)

Draft de référence, à faire valider par un avocat avant ouverture. Vérifié dans `schema.prisma` (modèle `EspaceCompte`), migration 20, `lib/espace/aise.ts`, `api/espace/aise/route.ts`, `lib/account.ts`.

## Ce qui est réellement stocké
- Table `EspaceCompte`, une ligne par compte : `aise` (POTES, BOULOT, PLAIRE ou PARTOUT), `aiseLe` (date de la réponse), `rencontreServieLe` (date où la situation de rencontre a été servie, lot D5), `createdAt`, `updatedAt`.
- Aucun texte libre, aucune IP. Valeur fermée (route : zod enum ; base : contrainte CHECK). Une seule réponse gardée : une deuxième ne remplace rien.
- Donnée de préférence rattachée au compte, pas une donnée sensible (art. 9) : « Pour plaire » ne dit rien de l'orientation ni de la vie sexuelle.

## Phrase à afficher sous la question (2 phrases)
« Ta réponse sert à choisir les situations qu'on te propose. Elle reste sur ton compte, et elle est effacée si tu supprimes ton compte. »
Variante si le fondateur veut citer le droit : ajouter « Pour la changer, écris à contact@deviens-marrant.fr. » (aucun écran ne permet de la modifier, la première réponse est figée).

## Base légale, durée, suppression
- Base : exécution du contrat (personnaliser le parcours Premium, même base que « afficher ta progression »). Pas de consentement ni de case à cocher. Pas d'intérêt légitime nécessaire.
- Durée : tant que le compte existe, pas de purge propre. Alignée sur la partie 6 existante.
- Suppression du compte : effacement total par cascade (`ON DELETE CASCADE` en SQL et `onDelete: Cascade` dans Prisma) à l'exécution de `prisma.user.delete` dans `deleteAccount`. Rien ne reste, aucune copie hors base, aucune jointure avec la mesure d'usage.

## Ligne à ajouter à `apps/web/src/app/(dashboard)/confidentialite/page.tsx`
- Partie 2 (données), nouvelle puce : « Ta réponse à la question « Où veux-tu être plus à l'aise ? » (entre potes, au boulot, pour plaire ou partout), la date de ta réponse et la date où on t'a proposé une situation de rencontre, si tu es abonné. »
- Partie 3 (base) : « Choisir les situations qu'on te propose selon ta réponse : exécution du contrat. »
- Partie 6 (durée) : compléter la phrase existante « ... gardés tant que ton compte existe, et effacés avec lui » en y ajoutant « ta réponse sur l'endroit où tu veux être plus à l'aise ». Aucune autre modification.
- Publier ces trois lignes avec l'ouverture de l'espace (même mécanique que la mesure d'usage : datation via `dateTextesJuridiques`), jamais avant.

## Points d'attention
1. Droit d'accès : `collecterDonneesParcours` (`lib/account.ts`) n'inclut pas `EspaceCompte`. À ajouter avant ouverture (coord @fullstack), sinon l'export est incomplet.
2. `deleteAccount` ne supprime pas `EspaceCompte` explicitement (cascade seule, sûre) : une ligne `deleteMany` explicite alignerait avec les autres tables, facultatif.
3. `rencontreServieLe` : citée dans la puce ci-dessus pour ne rien cacher, à retirer si le lot D5 est abandonné.
