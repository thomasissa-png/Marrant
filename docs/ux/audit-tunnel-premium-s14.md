# Audit UX du tunnel visiteur vers paiement Premium (s14, 03/10/2026)

Périmètre : de l'arrivée (blog, Instagram `/liens`, accueil) jusqu'à la première valeur Premium. Décision Thomas du 01/10 : rendre la valeur payante évidente.
Contexte lu : `project-context.md` (persona Yanis, MRR 1 000 €), `docs/founder-preferences.md` (lignes `[CHOIX UTILISATEUR]` des 29/09, 30/09, 01/10).
Aucun fichier de code modifié. Le site de production n'a pas pu être consulté (aucun outil HTTP dans cette session) : tout ce qui suit vient du code du repo, à confirmer en prod par @qa.
Hors périmètre non audité : listes `/conseils` et `/videos` (quota gratuit de 3), page `/profil`, API `/api/jokes` (seule la constante d'affichage `FREE_JOKE_LIMIT_UI` a été lue).

## 0. Verdict en 5 lignes

1. Le tunnel fonctionne techniquement, mais la valeur payante n'est dite nulle part clairement : les parcours (étapes 2+), seul vrai mur décidé en s14, sont absents de `/abonnement` et de la modale Premium.
2. Un CTA payant mène à un quiz gratuit : « Commencer à 4,99 €/mois » de l'accueil perd l'intention (F1).
3. Deux textes mentent depuis le passage à 4,99 € : « moins qu'un café par mois » (F2).
4. La liste Premium vend du gratuit : « Contenu quotidien » est ouvert à tous, anonymes compris (F3).
5. Après paiement, l'abonné atterrit sur `/vannes`, pas sur ce qu'il venait débloquer (F4).

## 1. Carte du parcours actuel

```
ENTRÉES
 A. Blog (article-cta.tsx)   : [Essaie gratuitement] -> modale inscription -> /onboarding
                               [Tout débloquer à 4,99 €/mois] -> /abonnement
 B. Instagram (/liens)       : article | vanne du jour | Répartie | Vannes | Conseils (UTM bio). Aucun CTA compte ni Premium.
 C. Accueil                  : Hero [Créer mon compte gratuit] -> modale -> /onboarding
                               HomeCta (idem) ; PremiumCta #offres [Commencer à 4,99 €/mois] -> modale -> /onboarding (F1)
 D. Catalogue /vannes        : bandeau anonyme [Créer mon compte] / [Tout débloquer] -> /abonnement
                               cartes verrouillées + étoile favoris -> PremiumModal
 E. Parcours /parcours/[slug]: étape 1 libre ; valider = compte ; étapes 2+ = mur -> /abonnement

INSCRIPTION (modale prioritaire, /register en repli)
 getPostSignupRedirect (safe-callback.ts:60) : pas de callback = /onboarding ; /abonnement ou /parcours/* = direct

ONBOARDING  /onboarding : quiz 3 questions -> parcours recommandé -> /parcours/[slug]  (lien discret /abonnement)

PAYWALL     /abonnement : anonyme = bloc gratuit + bloc 4,99 € ; connecté = un seul bloc + [Active mon accès]
            -> POST /api/stripe/checkout (401 si session absente) -> Stripe

PAIEMENT    Stripe -> /abonnement/success (sondage 2 s, 15 essais max) -> /vannes?upgrade=success

PREMIÈRE VALEUR PREMIUM : liste /vannes avec filtres. Aucun message de bienvenue, aucune action suggérée
 (le paramètre upgrade=success n'est lu ni dans vannes/page.tsx ni dans vannes-list.tsx).
```

Nombre d'actions pour Yanis venu d'une vanne Instagram jusqu'à l'étape 2 débloquée : lien bio, fiche vanne, inscription (modale, 3 champs), quiz (3 réponses + résultat), parcours, ouvrir étape 1, valider (quiz d'étape), paywall, `/abonnement`, bouton, Stripe : plus de 14 actions, aucune ne rappelle ce que le paiement ouvre.

### Cognitive walkthrough (first-time user, 3 parcours critiques)

| Étape | Sait-il quoi faire ? | Verdict |
|---|---|---|
| Hero : « Créer mon compte gratuit » puis « Puis 4,99 €/mois pour tout débloquer » (hero-section.tsx:63-66) | Oui, mais « tout » ne dit pas quoi | [FRICTION H2] le first-time user ne sait pas ce que « tout » contient. Solution : nommer le mur réel (étapes de parcours). |
| Parcours : étapes 2+ affichées « Termine l'étape 1 pour débloquer » (parcours-detail.tsx:569-573) | Il croit que c'est gratuit | [FRICTION H1] le mur payant n'apparaît qu'à l'ouverture de l'étape 2. Solution : badge « Accès complet » dès l'en-tête. |
| Étoile favoris sur une carte (favorite-button.tsx:32-34) | Il veut sauvegarder une vanne | [FRICTION H5] une modale de paiement s'ouvre sans prévenir. Solution : libellé accessible + titre de modale contextuel. |
| Clic « Commencer à 4,99 €/mois » (premium-cta.tsx:119-126, modale sans callback l.201-205) | Il veut payer | [FRICTION H3] il arrive sur un quiz gratuit. Solution : callbackUrl `/abonnement`. |
| Succès de paiement (success/page.tsx:87) | Il attend ce qu'il a acheté | [FRICTION H1] atterrit sur la liste de vannes. Solution : retour à l'intention d'origine. |
