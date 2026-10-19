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

## E4, carte « Abonnement » du profil (connecté sans abonnement) : validé tour 14 (O1 à 2 voix contre 1, notes 10/10, 10/10, 9/9 ; arrêt motivé : le 9 vient du relecteur pressé, qui avait noté cette même phrase 10 aux tours 8, 9 et 10 ; ligne discrète D6 unanime au tour 13)
- Phrase d'offre : « Avec Premium, tout est ouvert : les 5 parcours en entier, un nouveau carnet de répartie chaque mois, toutes les vannes, tous les conseils et toutes les vidéos. Et tu gardes en favori ce que tu veux ressortir. »
- Ligne XP (si XP > 0) : « Tu as déjà {xp} XP. » (remplace « Les {xp} XP que tu as gagnés sont conservés et reprennent là où tu les as laissés. »)
- Ligne discrète : « Résiliable quand tu veux depuis ce profil. Tu as 14 jours pour te faire rembourser ce paiement. » (vrai aussi pour un ancien abonné : un réabonnement ouvre un nouvel abonnement, dont le premier paiement est remboursable, cf. config/textes/paiement.ts l.425)
- Bouton : « Tout ouvrir · 2,99 €/mois » (chargement : « On t'emmène au paiement… »)

## E5, fin de page /glossaire (visiteur et compte sans abonnement ; masqué pour un abonné) : validé tour 7 (10/10 x3 après coupure de phrase confirmée)
- Titre : « Le vocabulaire, c'est fait. Reste à s'en servir. »
- Paragraphe : « Tu sais ce qu'est un callback. Le placer au dîner de samedi, c'est autre chose : faire rire à table, ça s'entraîne. C'est à ça que servent les 5 parcours, de la répartie au storytelling, 15 à 20 minutes par semaine. Chaque étape : un conseil, un défi, 5 vannes, 2 vidéos, un quiz. La première étape de chaque parcours se lit sans compte, pour juger sur pièce, et le reste s'ouvre d'un coup quand tu t'abonnes. »
- Bouton : « Ouvrir les 5 parcours · 2,99 €/mois » (vers /abonnement, `?src=glossaire`)
- Ligne discrète sous le bouton : « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux. »
- Petit lien texte souligné (pas un bouton), vers la première étape d'un parcours : « Lis d'abord une étape, elle est offerte »

## E6, fin de page /a-propos (visiteur et compte sans abonnement ; masqué pour un abonné) : validé tour 7 (10/10 x3)
- Titre inchangé (titre de l'accueil, hors périmètre : « Tu parles et personne rit. / On va arranger ça. »)
- Paragraphe : « Observer, s'entraîner, roder : c'est le programme des 5 parcours, de la répartie au storytelling, 15 à 20 minutes par semaine. Chaque étape : un conseil, un défi, 5 vannes, 2 vidéos, un quiz. La première étape de chaque parcours se lit sans compte, pour juger sur pièce, et le reste s'ouvre d'un coup quand tu t'abonnes. Déjà 1 500+ inscrits, et toi ? » (pour un compte connecté, retirer la dernière phrase, comme sur l'accueil)
- Bouton : « Ouvrir les 5 parcours · 2,99 €/mois » (visiteur : /register puis paiement ; connecté : /abonnement ; `src=a-propos`)
- Ligne discrète sous le bouton : identique à E5.
- Petit lien texte : identique à E5.
- `auth-cta.tsx` : libellé par défaut aligné sur celui-ci (le défaut ne s'affiche nulle part).

## Fichiers code concernés (pour @fullstack)
carnet-page.tsx l.98-108, premium-cta.tsx l.121, abonnement-view.tsx l.161-163 et l.296, profil/abonnement-card.tsx l.138, l.142 et l.147, home/carte-premium-achat.tsx l.59 (« Active mon accès », branche connectée sans abonnement = E2). Plus aucun « Active mon accès » ne doit rester (Grep).
