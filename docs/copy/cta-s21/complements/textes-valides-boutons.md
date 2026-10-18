# Boutons restés hors chantier : textes validés à l'aveugle (18/10)

Critère unique : l'envie de payer (choix de Thomas du 18/10). Rien de faux, aucune promesse de résultat.

## E1, carnet (non abonné, après la fiche offerte) : validé tour 3
- Titre : « Ça, c'était la réplique offerte. Il en reste {N}. »  ({N} = view.apercus.length)
- Paragraphe : « Elles vont de la moins tendue à la plus tendue, alors tu commences tranquille et tu montes d'un cran. Avec Premium, elles s'ouvrent toutes d'un coup, et un nouveau carnet arrive chaque mois. »
- Avantages Premium (composant commun, inchangé).
- Bouton : « Voir les {N} autres répliques · 2,99 €/mois »
- Sous le bouton : « 2,99 € TTC par mois. Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux. »

## E2, accueil (connecté sans abonnement) : validé tour 3
- Ligne : « Tu as déjà ton compte : ce bouton t'emmène direct au paiement, sécurisé par Stripe. »
- Bouton : « Ouvrir les 5 parcours · 2,99 €/mois »

## E3, page /abonnement (connecté sans abonnement) : validé tour 11 (10/10 x3, variante R2 à 2 voix contre 1)
- Pastille : « Un abonnement, tout ouvert »
- Titre : « Les 5 parcours en entier, et un nouveau carnet de répartie chaque mois. »
- Paragraphe : « Machine à Café, Répartie, Confiance, Storytelling et Boulot, de 3 à 6 semaines chacun, et tout s'ouvre d'un coup. Chaque étape tient en 15 à 20 minutes : un conseil, un défi à tenter, 5 vannes, 2 vidéos et un petit quiz. En plus des parcours : toutes les vannes, tous les conseils et toutes les vidéos du site. »
- Bouton : « Ouvrir les 5 parcours · 2,99 €/mois » (« · 24,99 €/an » si l'annuel est choisi)

## E4, carte « Abonnement » du profil (connecté sans abonnement) : en cours (tour 12)
- Phrase d'offre : « Avec Premium, tout est ouvert : les 5 parcours en entier, un nouveau carnet de répartie chaque mois, toutes les vannes, tous les conseils et toutes les vidéos. Et tu gardes en favori ce que tu veux ressortir. »
- Ligne XP (si XP > 0) : « Tu as déjà {xp} XP. »
- Ligne discrète : à trancher au tour 12 (remboursement du premier paiement sous 14 jours inclus, demandé par les 3 relecteurs du tour 11).
- Bouton : « Tout ouvrir · 2,99 €/mois »

## Fichiers code concernés (pour @fullstack)
carnet-page.tsx l.98-108, premium-cta.tsx l.121, abonnement-view.tsx l.161-163 et l.296, profil/abonnement-card.tsx l.138, l.142 et l.147, premium-modal.tsx l.111 (« Active mon accès »).
