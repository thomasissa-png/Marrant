# Meta descriptions Ahrefs s20 : /abonnement et /confidentialite

Date : 11/10/2026. Alerte Ahrefs : 2 meta descriptions > 160 caractères. Objectif : ≤ 155 caractères dans le pire cas (marge sous le seuil Ahrefs et la troncature Google).
Aucun fichier de code modifié. Le gabarit du §1.4 est à coller dans `apps/web/src/app/(dashboard)/abonnement/layout.tsx` (à faire par @fullstack, avec ligne dans `REPLIT_ACTIONS.md`).

[Framework : PAS court (promesse concrète + prix + levée du risque) pour /abonnement ; clarté informative pour /confidentialite]
[Conscience : Product-Aware pour /abonnement (le visiteur connaît le site, hésite sur le prix) ; Problem-Aware pour /confidentialite (cherche une réponse précise)]

Méthode de comptage : caractères Unicode, espace insécable des prix (`formatEuros`) compté pour 1 comme une espace normale. Ma méthode a été validée sur le texte actuel : 194 caractères comptés, identique au chiffre mesuré par Ahrefs côté prod.

---

## 1. /abonnement

### 1.1 Texte actuel (rappel)

« Les 5 parcours en entier (première étape offerte) et toutes les listes (140+ vannes, 120+ conseils, 80+ vidéos analysées), à 2,99 €/mois ou 24,99 €/an. Sans engagement, tu annules quand tu veux. » = **194 car.**

### 1.2 Recommandé (avec compteurs dynamiques)

« Les 5 parcours en entier (première étape offerte), 1200+ vannes, 1100+ conseils, 1000+ vidéos. Premium à 2,99 €/mois ou 24,99 €/an, sans engagement. »

| Cas | Caractères |
|---|---|
| **Pire cas** : 5 parcours, compteurs à 4 chiffres, annuel présent | **148** |
| Cas actuel : compteurs 140+ / 120+ / 80+, annuel présent | 144 |
| Annuel absent, compteurs à 4 chiffres | 134 |
| Compteurs absents (stats à 0), annuel présent | repli propre, bien sous 155 |

Pourquoi ce texte : parcours complets en tête (valeur principale validée le 03/10), première étape offerte, les trois compteurs gardés (décision fondateur : dynamiques, aucun chiffre en dur), les deux prix, « sans engagement ». « Analysées » est retiré de « vidéos » et « toutes les listes » disparaît : ce sont ces deux ajouts qui faisaient dépasser. Les parcours et les prix sont intacts. « Premium à » reste utile car le titre dit déjà « Abonnement Premium : 2,99 €/mois » mais la meta doit se lire seule dans les résultats.

### 1.3 Alternative (sans compteurs, garde le tutoiement)

« Les 5 parcours en entier (première étape offerte) et toutes les listes, à 2,99 €/mois ou 24,99 €/an. Sans engagement, tu annules quand tu veux. »

| Cas | Caractères |
|---|---|
| **Pire cas** (annuel présent) | **143** |
| Annuel absent | 129 |

Aucune variable de compteur : stable quelles que soient les stats. Reprend la phrase de fin actuelle (« tu annules quand tu veux ») que la version recommandée doit sacrifier pour garder les compteurs.

### 1.4 Gabarit prêt à coller (variables exactes du layout)

Remplace le bloc `generateMetadata` actuel (lignes 12 à 30). La version complète est utilisée tant qu'elle tient dans 155 caractères, sinon repli automatique sur la version sans compteurs (143 au maximum), donc la limite est garantie même si un compteur dépasse 4 chiffres.

```ts
const META_DESCRIPTION_MAX = 155;

export async function generateMetadata(): Promise<Metadata> {
  // Décision Thomas (03/10/2026) : les parcours complets sont la valeur
  // principale ; compteurs dynamiques, aucun chiffre en dur.
  // s20 (11/10/2026) : meta ≤ 155 caractères (alerte Ahrefs > 160), repli sans
  // compteurs si la version complète dépasse.
  const stats = await getContentStatsRounded();
  const catalogue = [
    stats.jokes > 0 ? `${stats.jokes}+ vannes` : null,
    stats.tips > 0 ? `${stats.tips}+ conseils` : null,
    stats.videos > 0 ? `${stats.videos}+ vidéos` : null,
  ].filter(Boolean);
  const annual = isAnnualPlanAvailable() ? ` ou ${PREMIUM_ANNUAL_PRICE_LABEL}` : "";
  const catalogueText = catalogue.length > 0 ? `, ${catalogue.join(", ")}` : "";
  const full = `Les ${PARCOURS_COUNT} parcours en entier (première étape offerte)${catalogueText}. Premium à ${PREMIUM_PRICE_LABEL}${annual}, sans engagement.`;
  const compact = `Les ${PARCOURS_COUNT} parcours en entier (première étape offerte) et toutes les listes, à ${PREMIUM_PRICE_LABEL}${annual}. Sans engagement, tu annules quand tu veux.`;
  return {
    title: `Abonnement Premium : ${PREMIUM_PRICE_LABEL}`,
    description: full.length <= META_DESCRIPTION_MAX ? full : compact,
    alternates: {
      canonical: "https://deviens-marrant.fr/abonnement",
    },
  };
}
```

Notes pour @fullstack :
- Rien d'autre à changer dans le fichier (imports inchangés).
- Test recommandé (Jest, sans secrets Stripe) : appeler `generateMetadata` avec stats mockées à 4 chiffres et annuel actif, vérifier `description.length <= 155`.
- Si `PARCOURS_COUNT` passe de 3 à 5 (Storytelling, Boulot), la longueur ne change pas (un chiffre).

---

## 2. /confidentialite

Fichier source : `apps/web/src/app/(dashboard)/confidentialite/page.tsx` (ligne 6, `description` statique, aucune variable).

### 2.1 Texte actuel (rappel)

« Politique de confidentialité de deviens-marrant.fr : données collectées, finalités, base légale, prestataires, mesure d'audience sans cookie, durée de conservation et exercice de tes droits RGPD. » = **195 car.**

### 2.2 Recommandé

« Politique de confidentialité : quelles données on collecte, pourquoi, et comment exercer tes droits RGPD. Mesure d'audience sans cookie ni bandeau. » = **147 car.**

Pourquoi ce texte : garde « politique de confidentialité » et « RGPD » (requêtes visées), répond en langage normal à ce que le visiteur cherche, et met en avant le fait vérifiable sur la page (mesure d'audience Umami sans cookie, donc pas de bandeau cookies, écrit tel quel sur la page). Retirés : base légale, durée de conservation, prestataires (toujours détaillés sur la page).

### 2.3 Alternative (voix plus directe)

« Ce que deviennent tes données sur deviens-marrant.fr : ce qu'on collecte, pourquoi, qui y accède et comment exercer tes droits RGPD. » = **131 car.**

Moins de mots-clés explicites (pas de « politique de confidentialité » dans la meta, à condition que le title le porte). À préférer si le title de la page contient déjà « confidentialité ».

Code de la modif pour le texte recommandé §2.2 (statique, à coller ligne 6) :

```ts
description: "Politique de confidentialité : quelles données on collecte, pourquoi, et comment exercer tes droits RGPD. Mesure d'audience sans cookie ni bandeau.",
```

---

## 3. Contrôles

- Tutoiement ou neutre : OK (« tes droits », « tu annules »). Aucun « vous ».
- Zéro tiret cadratin, zéro tic d'écriture IA (pas de « ce n'est pas X, c'est Y », pas de verbe gonflé).
- Aucune donnée inventée : prix = `PREMIUM_PRICE_LABEL` / `PREMIUM_ANNUAL_PRICE_LABEL`, parcours = `PARCOURS_COUNT`, compteurs = `getContentStatsRounded()`. « Première étape offerte » et « sans engagement » sont déjà dans la meta en prod. « Sans cookie ni bandeau » correspond au texte de la page de confidentialité.
- Juridique de la page /confidentialite : non touché (choix fondateur 29/09, laissé en l'état). Seule la meta change.
- Aucun [CHOIX UTILISATEUR] remis en cause : compteurs dynamiques conservés, parcours en valeur principale, prix 2,99 € / 24,99 €, aucun chiffre en dur.
- Références marché : non consultées (retouche de longueur, hors périmètre de la calibration WebSearch).

## Handoff

Destinataire : @fullstack (intégration §1.4 et §2.3, ligne dans `REPLIT_ACTIONS.md`, test de longueur), puis @seo (re-crawl Ahrefs).
- Fichier produit : `/home/user/Marrant/docs/seo/meta-descriptions-ahrefs-s20.md`
- Décisions : /abonnement = version avec compteurs (148 car. pire cas) + repli automatique 143 car. ; /confidentialite = 147 car.
- Points d'attention : « analysées » retiré des vidéos et « toutes les listes » retiré de la version recommandée (nécessaire pour tenir 155 avec 3 compteurs à 4 chiffres) ; la phrase « tu annules quand tu veux » n'existe plus que dans le repli.
