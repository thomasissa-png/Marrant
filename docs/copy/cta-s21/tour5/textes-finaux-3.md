# Textes finaux, pack 3 (B7 à B17) : bloc, emplacement [Sn], texte exact

> Texte exact de la version polie (A) du tour 5. **À brancher par @fullstack seulement après l'arbitrage de Thomas sur le tour 5** : si B (le gagnant du tour 4) l'emporte sur un bloc, reprendre ce bloc dans `docs/copy/cta-s21/tour4/pack-3-tour4.md` (côté gagnant, repéré dans `cles-pack3-tour4.md`). B17 : texte du tour 4 gardé tel quel. Zéro tiret cadratin, zéro nom de concurrent, aucune promesse de résultat.
> Hors périmètre : B12 de ce pack concerne le **quiz d'humour** (résultat) ; aucun fichier `*12*` n'a été touché.

## Variables et lignes communes

- `{P}` = nom du parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot). `{N}` = nombre d'étapes (3, 4, 6, 6, 6). `{D}` = minutes par semaine (15, 20, 20, 20, 15). Source : `PREMIUM_PARCOURS` dans `apps/web/src/config/premium.ts` (nom, rythme, semaines).
- **LP-A** (ligne de prix avec annuel, à utiliser seulement si l'offre annuelle est disponible) : `2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois, si tu vois loin). Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **LP-M** (repli sans annuel) : `2,99 € TTC par mois. Résiliable en ligne quand tu veux. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- **Contour** `[S25]` : `Essayer gratuitement l'étape 1 du parcours {P}` (par défaut Répartie ; sur une fiche, le parcours qui colle à la catégorie).

## B7 : murs des listes (par liste)

| Emplacement | /vannes | /conseils | /videos |
|---|---|---|---|
| `[S21]` | Voilà les 10 premières vannes. La suite est juste en dessous. | Voilà les 3 premiers conseils. La suite est juste en dessous. | Voilà les 3 premières vidéos. La suite est juste en dessous. |
| `[S22]` | Le filtre par catégorie est dans Premium. | Les filtres par niveau et par catégorie sont dans Premium. | Les filtres par niveau et par catégorie sont dans Premium. |
| `[S23]` titre | Et si la prochaine vanne qui fait rire la table était la tienne ? | Et si la bonne réplique sortait sur le moment, pas trois heures après ? | Tu les regardes pour rire. Et si tu les regardais pour faire rire ? |
| `[S24]` | Avec Premium, tu as toute la liste et, sous chaque vanne, l'exercice « À toi de jouer » pour écrire la tienne. Il y a aussi tes favoris, et 5 parcours pour t'entraîner : une étape par semaine, de 15 à 20 minutes. | Avec Premium, tu as toute la liste et, sous chaque conseil, l'exercice « À toi de jouer » pour l'essayer. Il y a aussi tes favoris, et 5 parcours pour t'entraîner : une étape par semaine, de 15 à 20 minutes. | Avec Premium, tu as toute la liste et, pour chaque vidéo, ses points clés et son exercice. Il y a aussi tes favoris, et 5 parcours pour t'entraîner : une étape par semaine, de 15 à 20 minutes. |
| Bouton plein | Voir la suite des vannes avec Premium | Voir la suite des conseils avec Premium | Voir la suite des vidéos avec Premium |
| `[S26]` | LP-A | LP-A | LP-A |
| `[S25]` contour | Essayer gratuitement l'étape 1 du parcours Répartie | idem | idem |

## B8 : fiche d'une vanne

- `[S14]` : Et si demain, c'était la tienne qu'on se répétait ?
- `[S15]` : La mécanique, tu l'as. Il te reste l'exercice « À toi de jouer » : une consigne et un exemple à réutiliser, pour écrire ta version. Celle que tu auras envie de sortir à la prochaine soirée. Il est dans Premium, qui ouvre aussi les 5 parcours, une étape par semaine.
- Bouton plein : Écrire la mienne avec Premium
- `[S16]` : LP-A
- `[S25]` : Essayer gratuitement l'étape 1 du parcours {P}
- Lien discret (inchangé) : Voir toutes les vannes

## B9 : fiche d'un conseil

- `[S14]` : Ce conseil, avant le soir où il servira
- `[S15]` : L'exercice « À toi de jouer » te donne une consigne et un exemple à réutiliser pour essayer ce conseil, tranquillement. Il est dans Premium, avec 5 parcours pour t'entraîner. Chaque étape, une par semaine (de 15 à 20 minutes), a son conseil, ses vannes, ses vidéos et son quiz.
- Bouton plein : Tester ce conseil avec Premium
- `[S16]` : LP-A
- `[S25]` : Essayer gratuitement l'étape 1 du parcours {P}
- Lien discret (inchangé) : Voir tous les conseils

## B10 : fiche d'une vidéo

- `[S14]` : Après le rire, ton tour
- `[S15]` : Sur scène, il faut faire rire une salle. Toi, une table te suffit, et ça s'entraîne. Les points clés de cette vidéo et son exercice sont dans Premium, avec 5 parcours : une étape par semaine, de 15 à 20 minutes.
- Bouton plein : Décrypter cette vidéo avec Premium
- `[S16]` : LP-A
- `[S25]` : Essayer gratuitement l'étape 1 du parcours {P}
- Lien discret (inchangé) : Voir toutes les vidéos

## B11 : fenêtre Premium (par geste)

Communs à tous les gestes : intro `Tu peux fermer cette fenêtre, ta page reste là. S'abonner, c'est deux étapes : ton compte, puis le paiement sécurisé.` ; ligne de prix `2,99 € TTC / mois` ; ligne de garantie finale inchangée (non modifiée par cette passe) ; lien `[S28]` : `Ou lire d'abord l'étape 1 du parcours {P} (gratuite, sans compte)`.

| Geste | Titre | `[S27]` | Bouton plein |
|---|---|---|---|
| Favori, vanne | Garde-la pour le soir où tu en auras besoin | Avec Premium : tes favoris prêts pour le bon moment, et 5 parcours pour t'entraîner, une étape par semaine. | Je m'abonne et je garde mes favoris |
| Favori, conseil | Garde-le pour le soir où tu en auras besoin | idem | idem |
| Favori, vidéo | Garde-la pour la retrouver quand tu en auras besoin | idem | idem |
| Vote | Ton avis sur les nouveautés, tu le donnes avec Premium | Ton vote sur les nouveautés, et 5 parcours pour t'entraîner, une étape par semaine. | Je m'abonne et je vote |
| Carte floutée, /vannes | Le reste de la liste est juste derrière | Avec Premium : toute la liste, l'exercice « À toi de jouer » sous chaque vanne, le filtre par catégorie et 5 parcours pour t'entraîner. | Je m'abonne et j'ouvre toute la liste |
| Carte floutée, /conseils et /videos | Le reste de la liste est juste derrière | Avec Premium : toute la liste, les filtres par niveau et par catégorie, tes favoris, et 5 parcours pour t'entraîner. | Je m'abonne et j'ouvre toute la liste |

## B12 : résultat du quiz d'humour (parcours conseillé = `{P}`)

- Phrase : `Ton humour, tu viens de le découvrir. {P}, c'est {N} étapes de {D} minutes, une par semaine, et la première se lit tout de suite, sans compte, avec son petit quiz.`
- Bouton plein : `Essayer gratuitement l'étape 1 de {P}`
- Lien (ouvre la page d'abonnement) : `Voir les 5 parcours en entier avec Premium`
- Ligne Premium, avec annuel : `Premium ouvre {P} en entier et les 4 autres parcours : 2,99 € TTC par mois, ou 24,99 € TTC par an (soit 2,08 € par mois). Résiliable en ligne. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- Ligne Premium, repli sans annuel : `Premium ouvre {P} en entier et les 4 autres parcours : 2,99 € TTC par mois. Résiliable en ligne. Tu as 14 jours pour te faire rembourser ton premier paiement.`
- Exemple (Confiance) : « Ton humour, tu viens de le découvrir. Confiance, c'est 6 étapes de 20 minutes, une par semaine, et la première se lit tout de suite, sans compte, avec son petit quiz. »

## B13 : quiz d'orientation, membre sans abonnement (par parcours)

Bouton : `Suivre {P} en entier · 2,99 €/mois`. Ligne de garantie : `Prix TTC. Tu résilies en ligne quand tu veux, et tu as 14 jours pour te faire rembourser ton premier paiement.` (inchangée). Les lignes « Pour toi si… » viennent des cartes (`personaTagline` : seed, `parcours-reecriture-s17.json`, `parcours-storytelling-s18.json`, `parcours-boulot-s19.json`), raccourcies sans en changer le sens. Seuls Répartie et Storytelling ont été montrés aux relecteurs ; les trois autres suivent le même gabarit.

| Parcours | Phrase (avant le bouton) |
|---|---|
| Répartie | Ton compte est prêt. Plus qu'un pas pour la suite de Répartie, le parcours pour toi si on te chambre et que tu cherches encore quoi répondre : étapes 2 à 4, une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Répartie. |
| Machine à Café | Ton compte est prêt. Plus qu'un pas pour la suite de Machine à Café, le parcours pour toi si tu veux faire rire à la pause sans devenir le collègue qui force : étapes 2 et 3, une par semaine, 15 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Machine à Café. |
| Confiance | Ton compte est prêt. Plus qu'un pas pour la suite de Confiance, le parcours pour toi si tu sors d'une période compliquée : étapes 2 à 6, une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Confiance. |
| Storytelling | Ton compte est prêt. Plus qu'un pas pour la suite de Storytelling, le parcours pour toi si ta chute arrive quand tout le monde est passé au dessert : étapes 2 à 6, une par semaine, 20 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Storytelling. |
| Boulot | Ton compte est prêt. Plus qu'un pas pour la suite de Boulot, le parcours pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu : étapes 2 à 6, une par semaine, 15 minutes. Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Boulot. |

*Pas d'annuel dans B13 : le bouton ouvre directement un paiement dont la formule n'est pas choisie (voir annexe).*

## B14 : fin de l'étape 1 et carte « Étape 2 » (par parcours)

- `[S17]`, titre de l'étape, `[S18]` : données publiques du parcours, inchangées (aucun texte nouveau).
- Phrase de validation : `Bien joué pour l'étape 1. Avec Premium, tu la valides, tu ouvres l'étape 2, puis toute la suite, à {D} minutes par semaine.`
- Bouton plein : `Passer à l'étape 2 avec Premium`
- `[S16]` : LP-A
- `[S30]` (lien discret) : `Ou la lettre gratuite, sans compte : une vanne décryptée et un exercice, une fois par mois`

## B15 : page des parcours (par carte)

Bouton : `Commencer {P}, étape 1 gratuite`. `[S31]` : `Sans compte ni abonnement, quiz compris. La suite, étapes 2 à {N}, est dans Premium.`

| Parcours | Bouton | `[S31]` |
|---|---|---|
| Machine à Café | Commencer Machine à Café, étape 1 gratuite | Sans compte ni abonnement, quiz compris. La suite, étapes 2 et 3, est dans Premium. |
| Répartie | Commencer Répartie, étape 1 gratuite | Sans compte ni abonnement, quiz compris. La suite, étapes 2 à 4, est dans Premium. |
| Confiance | Commencer Confiance, étape 1 gratuite | Sans compte ni abonnement, quiz compris. La suite, étapes 2 à 6, est dans Premium. |
| Storytelling | Commencer Storytelling, étape 1 gratuite | Sans compte ni abonnement, quiz compris. La suite, étapes 2 à 6, est dans Premium. |
| Boulot | Commencer Boulot, étape 1 gratuite | Sans compte ni abonnement, quiz compris. La suite, étapes 2 à 6, est dans Premium. |

## B16 : page d'abonnement (selon le parcours d'origine)

| Parcours d'origine | Surtitre | Titre |
|---|---|---|
| Répartie, adresse directe, tout parcours sans texte propre (`[S33a]`) | Pour toi si tu trouves la bonne réponse, mais avec un temps de retard | Ta réplique pendant la soirée, pas dans le bus du retour |
| Machine à Café et Boulot (`[S33b]`) | Pour toi si tu veux faire rire au boulot, sans devenir le collègue qui force | Ta réplique pendant la réunion, pas dans l'ascenseur d'après |
| Confiance (`[S33c]`) | Pour toi si tu sors d'une période compliquée et que le rire te manque | Le rire, 20 minutes par semaine, sans te forcer |
| Storytelling (`[S33d]`, nouveau) | Pour toi si ta chute arrive quand tout le monde est passé au dessert | Ton anecdote, coupée au plus court, jusqu'à la chute |

- Bouton plein, formule mensuelle : `Ouvrir les 5 parcours · 2,99 €/mois` ; formule annuelle choisie : `Ouvrir les 5 parcours · 24,99 €/an` (mensuel par défaut si l'annuel n'est pas disponible). Le libellé suit le sélecteur sans rechargement.
- `[S32]` : `Deux étapes : ton compte, puis le paiement sécurisé par Stripe.`
- Sous-titre et carte : inchangés.

## B17 : création de compte (texte du tour 4, gardé tel quel)

- `[S34]` (libellé du champ prénom) : `Prénom (facultatif, pour te saluer dans nos e-mails)`
- `[S36]` (bouton plein) : `Créer mon compte et passer au paiement`
- `[S35]` (lien sous « Déjà un compte ? ») : `Tu préfères lire d'abord ? L'étape 1 du parcours {P}, gratuite et sans compte`

