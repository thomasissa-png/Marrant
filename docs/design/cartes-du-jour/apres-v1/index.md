# Cartes du jour : captures « après » v1

Branche `claude/marrant-cartes-du-jour`, code `5b7b245` (spec `../diagnostic-et-spec.md`, décision D1 : « Pourquoi ça marche » fermé par défaut). Build de production local (`next build`, un seul serveur standalone), PostgreSQL 16 jetable remplie par `scripts/seed.sh`, Chromium, DPR 1, contenu du jour du 20/10/2026 tel que servi par `/api/daily`.

Cadrage : viewport complet, header inclus. La hauteur du viewport est ajustée à la section, qui est défilée pour commencer 24 px sous le header sticky : rien n'est masqué ni rogné.

Nom : `<largeur>-visiteur-<etat>.png`, largeurs 320, 375, 768, 1024, 1280, 1440.

| État | Contenu |
|---|---|
| `avant` | Section avant clic (emplacement pointillé « Révéler la chute ») |
| `chute` | Après clic sur « Révéler la chute » : chute à la place du bouton, « Pourquoi ça marche » fermé (D1) |
| `decryptage` | Même état, « Pourquoi ça marche » ouvert |
| `accordeons` (complément, §4 de la spec) | Les 6 accordéons ouverts, Conseil et Vidéo compris |
| `focus` (complément, 375 et 1280) | Focus clavier sur « Révéler la chute » |

Profil : visiteur seul. Le rendu de la section est le même pour un compte Premium : `/api/daily` ne dépend pas de la session, et la section n'a pas de branche selon le plan. Seuls l'étoile (pleine si le contenu est déjà en favori) et l'état des réactions 🔥 💀 peuvent différer, et ces composants partagés n'ont pas changé.

Mesures relevées sur le rendu (toutes largeurs, tous états) : aucun défilement horizontal ; 12 px entre l'énoncé et l'emplacement de la chute ; pieds de 57 px sur les 3 cartes (filet + 44 px), qui tiennent sur une ligne à 320 px ; focus sur la chute après le clic ; dès 1024 px, les 3 cartes ont le même bord haut, et ouvrir la chute ou un accordéon ne change pas la hauteur des cartes voisines.
