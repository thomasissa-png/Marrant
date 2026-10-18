# Annexe : boutons restés hors chantier, tour 2 (ne jamais transmettre aux relecteurs)

> Pack : `pack-boutons-tour2.md` (4 éléments, 4 textes finaux). Critère : l'envie de payer, rien de faux. Zéro tiret cadratin. Aucun commit. Lignes lues dans le worktree `.claude/worktrees/agent-a6072b0ac19da7774/apps/web/src` (même numérotation que `cta-a`). Aucun code modifié.

## 1. Correspondance fichier/ligne vers texte

| Élément | Fichier : ligne | Texte actuel | Texte final |
|---|---|---|---|
| 1 titre | `components/carnet/carnet-page.tsx` l.98 (`<h3>` de `CarnetPaywall`) | « Débloque tout le carnet » | « Ça, c'était la réplique offerte. Il en reste {N}. » |
| 1 paragraphe | idem l.99-102 | « La première situation est offerte. Les autres, et un nouveau carnet chaque mois, se débloquent avec l'abonnement à {PREMIUM_PRICE_LABEL}, résiliable en ligne. » | « Boulot, soirée, famille, couple : ces situations sont rangées de la moins tendue à la plus tendue, donc tu peux commencer doux et monter d'un cran. Avec Premium, elles s'ouvrent toutes d'un coup, et un nouveau carnet arrive chaque mois. » |
| 1 bouton | idem l.108 | « Commencer à {PREMIUM_PRICE_LABEL} » | « Voir les {N} autres répliques · {PREMIUM_PRICE_LABEL} » |
| 1 ligne sous le bouton | à créer après l.109 | absente | « 2,99 € TTC par mois. Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux. » (reprendre la constante de garantie déjà utilisée sur l'accueil, `CARTE_PREMIUM`/offre ; prix via `PREMIUM_PRICE_LABEL`) |
| 2 ligne | `components/home/premium-cta.tsx` : nouvelle `<p>` juste avant le `<Button>` de la branche `status === "authenticated"` (l.116-125) | absente | « Ton compte est déjà fait : on passe direct au paiement, sécurisé par Stripe. » |
| 2 bouton | `premium-cta.tsx` l.124 | « Active mon accès · {PREMIUM_PRICE_LABEL} » | `libelleOuvrirParcours()` : « Ouvrir les 5 parcours · 2,99 €/mois » (le même que le visiteur, `CARTE_PREMIUM.bouton`) |
| 3 pastille | `components/premium/abonnement-view.tsx` l.166 (`pageBadge`) | « Plus qu'une étape » | « Plus que le paiement » |
| 3 titre | idem l.170 (`pageTitle`, branche connectée) | « Active ton accès pour commencer » | « Ton compte est là. Les {PARCOURS_COUNT} parcours aussi. » |
| 3 paragraphe | idem l.173 (`pageSubtitle`, branche connectée) | « Ton compte est prêt. Encore un clic et les {PARCOURS_COUNT} parcours sont à toi en entier, de la première à la dernière étape. » | « Une fois abonné, tout s'ouvre d'un coup : chaque parcours en entier, et dans chaque étape un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. Une étape par semaine est le rythme conseillé, mais rien n'est bloqué. » |
| 3 bouton | idem l.304 | « Active mon accès · {priceLabel} » | `libelleOuvrirParcours(PARCOURS_COUNT, priceLabel)` : « Ouvrir les 5 parcours · 2,99 €/mois » ou « … · 24,99 €/an » |
| 4 phrase | `components/profil/abonnement-card.tsx` l.137-139 (`etat === "aucun"`) | « Passe Premium pour débloquer tout le catalogue, les filtres et les parcours complets. » | « Premium, c'est tout le catalogue au lieu de {FREE_CATALOGUE_LIMITS_LABEL}, avec tes favoris, le filtre par catégorie et les {PARCOURS_COUNT} parcours en entier. » |
| 4 bouton | idem l.147 | « Active mon accès · {PREMIUM_PRICE_LABEL} » | `libelleOuvrirParcours()` : « Ouvrir les 5 parcours · 2,99 €/mois » |

Inchangés dans l'élément 4 : la ligne XP (l.140-144), « Sans engagement · Annulable à tout moment » (l.145), le libellé de chargement « On t'emmène au paiement… ».

## 2. Variables (jamais en dur)

- **{N}** (élément 1) = `view.apercus.length` (déjà utilisé l.60 du même fichier pour « Les N autres situations du mois »). C'est le nombre de fiches du carnet du mois moins la fiche offerte (`CARNET_FREE_FICHES` = 1) : 14 en octobre, 29 en novembre (carnet à 30 fiches). Passer `N` à `CarnetPaywall` (aujourd'hui il ne reçoit que `returnTo`). Le titre de section et le titre du bloc partagent la même source : ils ne peuvent pas diverger.
- **Le « 14 » de la garantie** (« Tu as 14 jours pour te faire rembourser ») est une constante légale, sans rapport avec {N}. Ne pas le rattacher à la variable.
- **Mois** : aucun nom de mois dans les textes de ce tour, ni dans le titre, ni dans le paragraphe, ni dans le bouton. Rien à brancher (donc rien qui puisse devenir faux le 1er novembre).
- **Contextes** « Boulot, soirée, famille, couple » (élément 1) : vrais pour octobre (`data/carnet/2026-10.json` : quotidien, boulot, soirée, famille, couple, amis). Le carnet de novembre n'existe pas encore dans `data/carnet/`. **Garde à poser à la mise en ligne de chaque carnet** : si l'un des quatre contextes n'apparaît dans aucune fiche verrouillée du mois, construire la liste à partir des `contexte` distincts de `view.apercus` (ou retirer cette phrase), pour ne jamais citer un contexte absent.
- **{PARCOURS_COUNT}** (éléments 2, 3, 4) = `PARCOURS_COUNT` de `config/premium.ts`. Repli de `libelleOuvrirParcours` (« Ouvrir tous les parcours · … ») inchangé ; le titre de l'élément 3 et la phrase de l'élément 4 doivent suivre le même repli si le compte passe à 1 ou 0 (ne pas écrire « 1 parcours en entier »).
- **{FREE_CATALOGUE_LIMITS_LABEL}** (élément 4) = « 10 vannes, 3 conseils, 3 vidéos » (`config/premium.ts` l.111, source unique des limites réelles). Le texte pack écrit « 10 vannes, 3 conseils et 3 vidéos » : formater avec « et » avant le dernier élément, ou accepter la forme à virgules de la constante (à trancher en code, sans changer le sens).
- **Prix** : `PREMIUM_PRICE_LABEL` (« 2,99 €/mois »), formule annuelle via `priceLabel` sur /abonnement.
- **« 5 vannes, 2 vidéos »** (élément 3) : étape de parcours (fait vrai du document). Vérifier que le chiffre vient de la même source que les étapes des parcours si une constante existe ; sinon à valider avec @fullstack avant mise en ligne.
- **XP** (élément 4) : variable `xp`, inchangée.

## 3. Points d'attention pour @fullstack

- **Mise en page des boutons** : le plus long libellé fait environ 45 caractères (élément 1, avec N à deux chiffres). Appliquer au `Link` du carnet les classes déjà utilisées pour le bouton visiteur de l'accueil : `h-auto min-h-12 whitespace-normal px-4 py-2 text-center [text-wrap:balance]`. Le bouton « Ouvrir les 5 parcours · 2,99 €/mois » (environ 36 caractères) du `Button` connecté de l'accueil, de /abonnement et du profil (taille `sm`) doit pouvoir passer sur deux lignes sans couper : mêmes classes.
- **Éléments 2, 3 et 4 liés** : un membre sans abonnement voit les trois. Un seul libellé de bouton (`libelleOuvrirParcours`) sur les trois, pour qu'il ne rencontre jamais deux mots différents pour le même geste.
- **Pastille et titre de /abonnement** : le pack modifie la pastille (« Plus qu'une étape » devient « Plus que le paiement ») pour retirer le sens « achat » du mot « étape », qui garde ainsi un seul sens (les étapes des parcours). Le bloc visiteur de la page n'a pas de pastille (affichée seulement connecté, `!resiliation`) : rien à changer pour lui.
- **Tests à mettre à jour au branchement** (assertions sur les textes actuels) : `__tests__/feature/carnet-page.test.tsx` (l.54, 69, 91 : « Commencer à … »), `__tests__/lib/lot2-libelles-s21.test.ts` (l.104-105), et les tests qui cherchent « Active mon accès » : `abonnement-auto-checkout-s15`, `corrections-s16-lot-f`, `abonnement-page`, `checkout-conflit-s16-lot-d`. `premium-modal.test.tsx` reste inchangé tant que la modale n'est pas touchée (voir point suivant).
- **Hors pack, même libellé « Active mon accès »** : `components/premium/premium-modal.tsx` l.111 (modale ouverte par un mur de liste, même membre). À traiter au même niveau (même libellé `libelleOuvrirParcours`) pour ne pas laisser un 4e emplacement orphelin ; non rédigé ici faute de fiche de situation.
- **Doublon d'information vérifié** : `config/textes/cta-pages.ts` l.383 contient déjà « Ton compte est prêt : il ne reste que le paiement. » (CTA d'article, test `cta-textes-finaux.test.ts` l.109). Ce n'est pas dans le périmètre de ce tour. Le même défaut (« prêt » faux pour un ancien abonné) s'y applique si le tour 2 donne « Ton compte est déjà fait » comme formule validée : à arbitrer par Thomas avant de toucher à un texte déjà validé.
- **Annuel sur la carte d'accueil** : la carte affiche « Ou 24,99 €/an » mais le bouton plein ne lance que le mensuel (constat de r2, structure, hors texte). Non traité ici.
- **Déploiement** : toute modification de ces fichiers est à consigner dans `REPLIT_ACTIONS.md` ; pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, plus `npx tsc --noEmit` et Jest si des tests changent.

## 4. Défauts du tour 1 et réponse

| Défaut relevé | Réponse dans le texte final |
|---|---|
| Élément 1 : combien de répliques restent | Titre « Il en reste {N}. » et bouton « Voir les {N} autres répliques » : variable `apercus.length`, jamais en dur |
| Élément 1 : titre slogan (« Et si… », rime) | Remplacé par la piste r1 : « Ça, c'était la réplique offerte. Il en reste {N}. » |
| Élément 1 : paragraphe qui redit la fiche | Plus aucune description de la structure de fiche : contextes (boulot, soirée, famille, couple) et rangement de la moins tendue à la plus tendue |
| Élément 1 : mois en dur | Aucun nom de mois dans le texte ; « un nouveau carnet arrive chaque mois » |
| Élément 2 : « Ton compte est prêt » faux pour un ancien abonné | « Ton compte est déjà fait : on passe direct au paiement, sécurisé par Stripe. » |
| Élément 2 : Stripe non nommé | Nommé dans la ligne |
| Élément 2 : bouton trop long sur téléphone | « Ouvrir les 5 parcours · 2,99 €/mois » |
| Élément 3 : « étape » à double sens (4 fois) | Pastille sans « étape » ; le mot ne désigne plus que les étapes des parcours (2 occurrences) |
| Élément 3 : phrase qui répète la pastille, sans raison de payer | Paragraphe sur ce que l'abonnement ouvre (conseil, défi, 5 vannes, 2 vidéos, quiz) et sur la liberté de rythme (rien n'est bloqué) |
| Élément 3 : titre vrai pour un ancien abonné | « Ton compte est là. Les 5 parcours aussi. » (au lieu de « Ton compte est prêt ») ; « La table qui rit » écarté |
| Élément 4 (nouveau) | « Passe Premium pour débloquer … » et « Active mon accès » remplacés (voir table) |

## 5. Faits vérifiés dans le code

| Fait | Source |
|---|---|
| Carnet d'octobre : 15 fiches, contextes dont boulot, soirée, famille, couple | `data/carnet/2026-10.json` |
| Une seule fiche offerte aux non-abonnés | `lib/carnet.ts` l.92 (`CARNET_FREE_FICHES = 1`), l.183 (`apercus`) |
| Titre de section « Les N autres situations du mois » | `carnet-page.tsx` l.60 |
| Limites sans abonnement 10 / 3 / 3, source unique | `config/premium.ts` l.106-111 |
| Carte du profil `aucun` : bouton vers le paiement direct, libellé de chargement « On t'emmène au paiement… » | `abonnement-card.tsx` l.135-150 |
| Bouton connecté d'accueil et de /abonnement : paiement direct | `premium-cta.tsx` l.116-125 ; `abonnement-view.tsx` l.176-211 |
| `libelleOuvrirParcours(count, prix)` : « Ouvrir les 5 parcours · prix », repli « tous les parcours » | `config/textes/cta-articles-accueil.ts` l.63 |
