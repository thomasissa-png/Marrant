# Note de déploiement, navigation v6 tour 1, lot 1 (espace)

À reporter dans `REPLIT_ACTIONS.md` par l'intégration (ce lot n'y touche pas).

## Effet en production
**Aucun.** `ESPACE_CLIENT_PUBLIE = false` reste dans le dépôt : `/mon-espace/**` est la 404, `/favoris` garde son rendu
d'avant octet pour octet (grille fermée inchangée, libellés déplacés sans retouche). Test d'inertie : 47 instantanés
inchangés, sans mise à jour.

## Actions Replit
- Variables d'environnement : aucune.
- Paquets : aucun.
- Migrations : aucune.
- Données : aucune. L'aperçu de Favoris (ouvert seulement) lit la page 1 de `/vannes` et `/conseils` par les
  fonctions existantes (`lib/catalogue-pages.ts`, même cache d'une heure) ; base indisponible : l'état vide d'avant.

## Contenu du lot (interrupteur ouvert seulement)
- Cartes de l'espace à la langue de l'accueil : `rounded-xl`, `overflow-hidden`, filet `h-1` dégradé violet
  (`CADRE_CARTE`, `FILET_CARTE` dans `components/espace/carte/styles.ts`).
- Aperçus : deux colonnes dès 1024 px (exemple 7/12, offre 5/12 collante), « Ce qu'on aurait pu dire » ouvert ;
  Favoris : une vanne et un conseil réels en lecture seule.
- « Aujourd'hui » : action du jour en pleine coque ; secondaires côte à côte ; contenu du jour aligné ; lecteur vidéo
  sans rouge.
- Fiches : plus de filet en tête de « À toi » ; `<summary>` en bouton secondaire à chevron (44 px).
- Favoris abonné : grille sans `col-span-2` isolé ; Mes répliques : une seule colonne, bouton plein ; confirmations
  de suppression en style destructif.

## Vérification après déploiement
Rien à vérifier en production (fermé). Préversion ouverte : `playwright/tests/local/espace-v6-tour1-lot1.spec.ts`
avec `E2E_ESPACE_OUVERT=1` (captures : `E2E_CAPTURES_V6T1=<dossier>`).
