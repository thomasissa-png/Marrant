# Préversion locale de l'espace client (s24)

Pour voir et tester l'espace Premium en vrai, page par page. **Rien n'est en ligne** : c'est un serveur
de production qui tourne dans le conteneur de la session, avec l'espace ouvert, sur une base jetable.
Le dépôt, lui, reste fermé (`ESPACE_CLIENT_PUBLIE = false`, rien de commité pour cette préversion).

## Adresse

**http://localhost:5400** (panneau de prévisualisation, port **5400**).
Passe par `localhost:5400` et pas par une autre adresse : après la connexion, le site renvoie
toujours vers `http://localhost:5400`.

## Se connecter

Page **http://localhost:5400/login**, formulaire e-mail + mot de passe. Deux comptes de TEST, qui
n'existent que dans la base jetable `marrant_preview` :

| Compte | E-mail | Mot de passe | Ce qu'il montre |
|---|---|---|---|
| Abonné en cours | `abonne-en-cours@preversion.test` | `preversion-s24` | Premium actif depuis 20 jours, 4 étapes validées (Répartie 1-2, Machine à café 1-2), **cap 2** (annonce pas encore vue), 4 cartes jouées sur les jours passés et 2 cartes qui t'attendent aujourd'hui, 1 réplique (« Coloc : la poêle »), 1 situation marquée « faite », 1 retour de mission, 3 favoris (2 vannes, 1 conseil), 1 question avec **réponse de l'équipe non lue** (pastille sur la cloche) |
| Nouvel abonné | `nouvel-abonne@preversion.test` | `preversion-s24` | Premium actif, rien fait : carte « Ton premier pas » |

Pour passer d'un compte à l'autre : menu du compte (icône bonhomme en haut à droite), « Déconnexion ».
Les textes de la question et de la réponse de l'équipe sont marqués « test » : ce sont des données factices.

## Pages à visiter, dans l'ordre

1. **La barre** : Aujourd'hui (`/mon-espace`), Parcours (`/parcours`), Quoi répondre, Bibliothèque, Mes questions.
2. **Le menu « Plus »** : S'entraîner, Favoris, Mes répliques, Lettres, Articles, Quiz d'humour.
3. **La cloche** (en haut à droite) : avec l'abonné en cours, « L'équipe t'a répondu » ; ouvrir la question fait tomber la pastille.
4. **Le profil** : `/profil`, avec la carte de l'abonnement.
5. **L'abonnement** : pour un abonné, la gestion est dans la carte du profil. `/abonnement` renvoie un compte Premium vers « Aujourd'hui » (`/mon-espace`, lot D11c, espace ouvert ; fermé : `/vannes`) ; `/resiliation` répond 404 (son propre interrupteur est fermé).
6. **Une situation** : `/mon-espace/fiche/situation/coloc-la-poele` (celle qui porte la réplique de l'abonné en cours).
7. **Un jeu** : `/mon-espace/fiche/jeu/quelle-replique-1`.
8. **Une mission** : `/mon-espace/s-entrainer#mission`.
9. **Un bilan** : `/mon-espace/fiche/bilan/bilan-repartie`.
10. **Le coin humour noir** : Bibliothèque, bloc « Humour noir, fait bien », bouton « Entrer », puis par exemple `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece`.

Toutes ces pages ont été ouvertes par un navigateur automatique avec les deux comptes : réponse 200, pas
d'écran d'erreur, pas d'erreur JavaScript. Build en place depuis le 14/11 : lot D11c (captures et mesures :
`docs/captures/s24-preversion-2/INDEX.md`).

## Ce qui est simulé

- **Paiement** : aucune clé Stripe. Les deux comptes sont Premium directement en base. Tout bouton qui
  mène à Stripe (gérer l'abonnement, payer) ne peut pas aboutir ici : c'est normal (non testé dans cette préversion).
- **E-mails** : aucun n'est envoyé. Un faux Resend local les reçoit et note seulement destinataire et
  objet dans `/root/marrant-preversion-s24/emails.log` (par exemple la notification « Mes questions »).
- **Contenu** : le vrai contenu importé de l'espace (`apps/web/src/data/espace/*.json`), et le seed
  habituel du dépôt pour les vannes, conseils, vidéos et parcours.
- Tu peux tout faire : jouer des cartes, écrire des répliques, poser une question. Tout s'écrit dans la base jetable.

## Commandes (dans le conteneur)

- Arrêter : `/root/marrant-preversion-s24/arreter.sh`
- Relancer (après un arrêt ou un redémarrage du conteneur) : `/root/marrant-preversion-s24/demarrer.sh`
- Remettre les deux comptes à zéro (état décrit plus haut) : `node /root/marrant-preversion-s24/comptes.mjs`, serveur démarré
- Revérifier toutes les pages : `node /root/marrant-preversion-s24/verifier.mjs` (captures dans `/root/marrant-preversion-s24/captures/`)
- Journal du serveur : `/root/marrant-preversion-s24/serveur.log`

Le serveur sert une copie du build placée hors du dépôt (`/root/marrant-preversion-s24/`) : rebâtir le
dépôt ne la touche pas. Pour voir des modifications de code, il faut refaire le build ouvert et recopier.
