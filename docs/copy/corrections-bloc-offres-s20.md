# Bloc des offres de l'accueil : corrections après retrait du coaching (s20, 13/10/2026)

> Contexte : décision de Thomas du 13/10/2026, l'offre coaching à 99 € est retirée. Le bloc `#offres` de l'accueil (`apps/web/src/components/home/premium-cta.tsx`) ne montre plus que Premium, mais son H2 annonçait encore deux offres.
> Aucun fichier de code modifié par cette note. Framework : [Framework : PAS allégé, promesse puis offre] · [Conscience : Product-Aware, le visiteur a déjà vu le site et arrive sur l'offre].
> **Statut : proposition NON validée.** Texte neuf = relecture à l'aveugle (2 relecteurs sur 3) avant mise en ligne (règle d'or P0 s18), et validation de Thomas (P0 s8). Non faite ici : je n'ai pas lancé de relecteurs.

## 1. Ce qui supposait deux offres (relevé complet du bloc)

| Élément | Fichier:ligne | Suppose deux offres ? |
|---|---|---|
| H2 « Deux façons de t'y mettre » | `premium-cta.tsx:56` | **Oui. À corriger.** |
| Sous-titre « Étudiant, jeune actif ou en train de tourner une page : tu trouves ici de quoi devenir drôle pour de bon, pas seulement le temps d'un apéro. » | `premium-cta.tsx:59-60` | Non : les trois profils sont des lecteurs, pas des offres. « tu trouves ici de quoi » vaut pour une offre. **Inchangé.** |
| Titre de la carte, prix, mentions, puces, CTA, réassurance, preuve sociale | `premium-cta.tsx:71-115`, `premium-benefits.tsx` | Non. Tout parle de Premium seul. **Inchangé.** |
| Commentaire de code `Offre 1 : Premium` | `premium-cta.tsx:66` | Commentaire interne, pas visible. Retouche de cohérence, optionnelle. |
| FAQ sous le bloc (`faqs.ts` via `FaqSection`) | `faq-section.tsx` | Grep « coaching », « deux offres/formules » dans `src/` (hors tests) : rien dans la FAQ. **Inchangée.** |
| CGU « proposé en deux formules : mensuelle … ou annuelle » | `cgu/page.tsx:30` | Hors bloc, et exact (mensuel et annuel existent). Non touché. |

Pourquoi ne pas écrire « une seule formule » ou « une seule façon » : la formule annuelle existe sur `/abonnement`, et on peut déjà commencer gratuitement (contenu du jour, listes limitées). Ce serait une fausse exclusivité.

## 2. Corrections

### Correction 1 (obligatoire) : le H2

- **Fichier:ligne** : `apps/web/src/components/home/premium-cta.tsx:56`
- **Avant** : `Deux façons de t&apos;y mettre`
- **Après** : `Pour t&apos;y mettre, il y a {OFFRE_NOM}`
  (rendu : « Pour t'y mettre, il y a Premium ». `OFFRE_NOM` est déjà importé ligne 16 et vaut « Premium » ; si le nom change, le titre suit. Si on préfère le texte en dur : `Pour t&apos;y mettre, il y a Premium`.)
- **Raison** : le titre promettait un choix entre deux offres, il n'y en a plus qu'une. La nouvelle phrase garde « t'y mettre » (le capital du titre actuel), nomme l'offre comme partout ailleurs (D4 s16 : « Premium » seul), ne promet rien de plus que la carte en dessous et ne répète pas « pour de bon » du sous-titre. Elle se lit avec le sous-titre : « Pour t'y mettre, il y a Premium. Étudiant, jeune actif ou en train de tourner une page : tu trouves ici de quoi devenir drôle pour de bon… ». Aucun chiffre, aucune promesse, pas de tiret cadratin.

Variantes de repli si Thomas ou les relecteurs n'accrochent pas (toutes sans chiffre ni promesse ajoutés) :
- `Une façon de t&apos;y mettre` : retouche minimale (un mot), mais plus plate.
- `Pour t&apos;y mettre pour de bon` : plus rythmée, mais reprend « pour de bon » du sous-titre, donc à combiner avec une retouche du sous-titre (non proposée ici pour ne pas multiplier le texte neuf).

### Correction 2 (optionnelle, commentaire de code, hors copy)

- **Fichier:ligne** : `apps/web/src/components/home/premium-cta.tsx:66`
- **Avant** : `Offre 1 : Premium`
- **Après** : `Offre : Premium`
- **Raison** : « Offre 1 » suppose une offre 2 qui n'existe plus. Invisible pour le visiteur, cohérence de lecture du code uniquement.

### Non modifié (volontairement)

- Sous-titre (lignes 59-60) : voir tableau §1.
- Aucun test ne cherche « Deux façons » (grep `apps/web`, hors `.next` et `.open-next` qui sont des copies de build).
- Les lignes de réassurance (« Sans engagement, annulable à tout moment » puis « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux ») se recoupent un peu, mais elles ne dépendent pas du nombre d'offres : hors périmètre.

## 3. Bloc complet tel qu'il se lira après correction (relecture)

Valeurs lues dans le code le 13/10/2026 : prix `PREMIUM_PRICE_LABEL` = « 2,99 €/mois » ; Storytelling et Boulot publiés, donc 5 parcours. Les compteurs de vannes, conseils et vidéos viennent de l'API de stats au chargement : notés `[N]` ici (non inventés). Un visiteur anonyme voit le bouton « Commencer à … », un membre connecté « Active mon accès · … ».

---

## Pour t'y mettre, il y a Premium

Étudiant, jeune actif ou en train de tourner une page : tu trouves ici de quoi devenir drôle pour de bon, pas seulement le temps d'un apéro.

**Premium**
**2,99 €** / mois
Sans engagement, annulable à tout moment · Droit de rétractation

✓ **Les 5 parcours en entier** : Machine à Café (15 min/semaine), Répartie (20 min/semaine), Confiance (20 min/semaine), Storytelling (20 min/semaine), Boulot (15 min/semaine). Chaque étape avec son conseil, ses vannes, ses vidéos et son quiz. La première étape de chaque parcours est offerte.
✓ **Le carnet mensuel de situations de répartie** (nouveau chaque mois) : ce qu'on te dit, quoi répondre, pourquoi ça marche et quoi faire si ça se tend.
✓ **Tes favoris** : garde sous la main les vannes, conseils et vidéos à ressortir.
✓ **Les listes complètes** ([N]+ vannes, [N]+ conseils, [N]+ vidéos analysées), au lieu de 10 vannes, 3 conseils et 3 vidéos sans abonnement, avec le filtre par catégorie des vannes.

[Bouton, visiteur] Commencer à 2,99 €/mois
[Bouton, membre connecté] Active mon accès · 2,99 €/mois
2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux.
Déjà 1 500+ inscrits, et toi ?

**Questions fréquentes** (FAQ inchangée, 0 mention de coaching ni d'une seconde offre)

---

## 4. Vérifications faites

- Zéro tiret cadratin dans le texte proposé et dans le bloc reconstitué.
- Zéro chiffre ou promesse ajouté : le seul texte neuf est le H2 (6 mots), les autres chiffres sont ceux du composant.
- Zéro concurrent nommé, tutoiement, pas de « coach ».
- `[CHOIX UTILISATEUR]` respectés : « 1 500+ inscrits » (P0), nom unique « Premium » (D4 s16), retrait du coaching (13/10).
