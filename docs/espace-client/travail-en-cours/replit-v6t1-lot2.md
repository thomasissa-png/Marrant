# Note de déploiement, v6 tour 1, lot 2 (pages publiques vues en régime ouvert)

À reporter dans `REPLIT_ACTIONS.md` par l'intégration (ce lot n'y touche pas).

## Ce qui change
- **Interrupteur `ESPACE_CLIENT_PUBLIE = false` (production d'aujourd'hui) : rien.** Pages publiques identiques au caractère près (Jest d'inertie : 47 instantanés inchangés, sans mise à jour).
- Interrupteur ouvert seulement :
  - cartes à filet de l'accueil (`Card filet`, `CARTE_A_FILET` + `FiletCarte` dans `components/ui/card.tsx`) sur /vannes, /carnet, /lettre, /parcours, /profil, murs et cartes floutées des listes ;
  - /vannes : chevrons de 44 px sur la rangée des catégories dès 1 024 px, bloc « Pourquoi ces vannes sont différentes » en deux colonnes ;
  - réassurance alignée à gauche dans les blocs alignés à gauche (murs, bloc d'exercice des fiches, fenêtre Premium, carnet, profil) ;
  - /lettre : titre centré, formulaire dans une carte à filet, bouton plein ; abonné : H1 « La lettre », lettres envoyées en cartes ;
  - /carnet de l'abonné : sommaire des fiches et « Les carnets précédents » en tête ;
  - /parcours de l'abonné : un seul bouton plein dans la liste, « Explore aussi » sur deux colonnes, plus de doublon du lien vers l'étape en cours sur la page d'un parcours ;
  - /profil : plus de débordement à 290 et 320 px, plus de place réservée au-dessus du H1.

## Actions
- Aucune variable d'environnement, aucune migration, aucun paquet.
- Aucun texte nouveau (le H1 « La lettre » reprend `TEXTES_LETTRE.menu`, libellé de la bande).
- Build et captures : faits par l'intégration (régimes fermé et ouvert).
- Spec à lancer : `playwright/tests/local/publiques-v6-tour1-pages.spec.ts` (projet `local`, les deux régimes).
