# Revue design à l'aveugle : encadré « Ta question à l'équipe » (s22)

Périmètre : `apps/web/src/components/profil/question-equipe-card.tsx` (désigné `QEC` ci-dessous).
Preuves : 19 captures de `docs/qa/captures-question-equipe-s22/` (vide, erreur vide, trop long, envoi impossible, succès, contexte profil à 1440, 390 et 360 px, compte gratuit à 390 px), toutes regardées. Comparaison avec `abonnement-card.tsx` et `prenom-card.tsx`. Tokens lus dans `apps/web/tailwind.config.ts`, variantes dans `components/ui/button.tsx`. Revue à l'aveugle : `docs/reviews/` non lu.
Non lu, donc non jugé : `components/ui/input.tsx` et `card.tsx` (budget de lecture atteint). Aucune capture de focus clavier sur le bouton ni sur les liens.

## Note : 7,5 / 10, verdict NO-GO (1 bloquant)

Le correctif du bloquant tient en 3 classes. Avec le bloquant et les points « à corriger » 1 à 4, la note projetée est de 9 / 10 (GO).

| Critère | Note | Constat visuel |
|---|---|---|
| Intégration au profil | 8 | Carte au même rayon, même padding 16 px, même CardTitle que Abonnement et Prénom. Le bouton violet plein est cohérent (niveau 1 réservé à Premium, carte réservée à Premium). Pour un Premium, la carte Abonnement n'a que des boutons `outline` : le CTA violet de l'encadré devient l'élément le plus saturé de la page, sans concurrencer personne. La carte est toutefois la plus haute du profil (environ 415 px à 1440, 500 px à 360 px, contre environ 180 et 250 pour Abonnement). Le titre garde la même taille, donc la vedette reste à l'abonnement. |
| Lisibilité mobile 360 | 8,5 | Aucun débordement horizontal. Champ pleine largeur, bouton pleine largeur, compteur collé au champ. Défauts : beaucoup de texte en 12 px (aide, compteur, mention), orphelins de lignes (« te répond. », « 1 à 2 jours ouvrés. ») dus aux espaces insécables de `typo()`, et risque de zoom iOS (champ en 14 px). |
| États | 7 | Erreur bien visible et reliée au champ (`role="alert"`, `aria-describedby`, texte rouge sous le compteur). Mais le halo du champ invalide + focus est un dégradé rouge vers violet disgracieux (`erreur-vide-*`, `erreur-trop-long-*`). Le succès est un simple paragraphe gris, sans signe de réussite, placé sous la mention légale (`succes-*`). |
| Contraste AA | 5,5 | Texte d'erreur et compteur dépassé en `text-error` (#EF4444) : 4,38:1 sur la carte (#1F1F1F), sous le seuil de 4,5:1. Le token AA existe (`error-text`, #F87171, 5,4:1) et n'est pas utilisé. Les autres textes passent (`text-muted` #9A9A9A sur #1F1F1F : 5,85:1 ; secondary et primary largement). |
| Focus clavier | 7,5 | Champ : bordure et anneau violet 1 px, visibles (#8B5CF6 sur #1A1A1A : 4,1:1). Focus rendu au champ après erreur, puis au statut après succès : bon. Bouton : anneau 2 px `accent-link` hérité de `Button` : bon. Liens « Confidentialité » et « Reconnecte-toi » : aucun style de focus propre (à vérifier). Le dégradé en état invalide brouille la lecture du focus. |
| Zones tactiles | 9,5 | Bouton 44 px (`min-h-11`), champ de 5 lignes. Liens en ligne (12 px) : exemptés par WCAG 2.5.8 (exception « inline »). |
| Débordement | 10 | Aucun, y compris avec 1 012 « a » sans espace (le textarea coupe) à 360 px. Compte gratuit : aucune trace, aucun trou dans la page (`compte-gratuit-aucun-encadre-390`). |

## Bloquant

### B1. Texte d'erreur et compteur dépassé sous le contraste AA

- Ratio mesuré à partir des tokens : #EF4444 sur #1F1F1F = 4,38:1 (exigé : 4,5:1 pour du texte de 12 à 14 px). Concerne tous les messages d'erreur (vide, trop long, envoi, trop d'envois, session) et le compteur en dépassement.
- `question-equipe-card.tsx`
  - ligne 113 (compteur) : `depasse ? "font-semibold text-error" : "text-text-muted"` devient `depasse ? "font-medium text-error-text" : "text-text-muted"`
  - ligne 121 (message) : `mt-2 text-sm text-error` devient `mt-2 text-sm text-error-text`
  - ligne 125 (lien session) : hérite de la ligne 121, rien à changer.
- Le token `error-text` est documenté dans `tailwind.config.ts` (s17 DES-1-02, « texte d'erreur AA ») : `error` reste réservé aux bordures et fonds.

## À corriger

### C1. Halo champ invalide + focus : dégradé rouge vers violet

- Cause (ligne 109) : en état invalide, la bordure passe au rouge (`aria-[invalid=true]:border-error`) mais l'anneau de focus reste violet (`focus:ring-accent-primary`). Résultat visible sur `erreur-vide-*` et `erreur-trop-long-*` : deux couleurs concentriques qui ressemblent à un dégradé.
- Ligne 109, classe à ajouter en fin de chaîne : `aria-[invalid=true]:focus:ring-error` (rouge #EF4444 sur #1A1A1A : 4,6:1, suffisant pour un élément non textuel, seuil 3:1). Option plus nette : `aria-[invalid=true]:focus:border-error aria-[invalid=true]:focus:ring-error`.

### C2. Succès pas assez clair

- Constat (`succes-1440`, `succes-360`) : `text-sm text-text-secondary` sans fond ni icône, placé après la mention légale en 12 px. Il ressemble à une note de bas de carte, pas à une confirmation. Il répète aussi le même délai que l'en-tête (« 1 à 2 jours ouvrés » deux fois, voir O4).
- Lignes 146 à 155 : transformer en bloc confirmé, et le remonter juste sous le bouton (avant la mention, ligne 138). Garder un conteneur live toujours présent (un élément `display:none` qui devient visible n'est pas annoncé de façon fiable par tous les lecteurs d'écran) :

```tsx
{/* sous le Button, avant la mention */}
<div role="status" aria-live="polite" className="max-w-2xl">
  <p
    ref={succes}
    tabIndex={-1}
    className={cn(
      "outline-none",
      (enCours || etat.etat === "succes") && "mt-3 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-text-primary",
    )}
    data-testid="question-equipe-statut"
  >
    {enCours ? T.envoiEnCours : etat.etat === "succes" ? typo(T.succes) : null}
  </p>
</div>
```

- Classes actuelles (ligne 151) : `mt-3 max-w-2xl text-sm text-text-secondary outline-none empty:mt-0` remplacées par celles ci-dessus (texte blanc 15,5:1 sur le fond teinté, bordure verte discrète).
- Facultatif : pastille coche en SVG `aria-hidden` en tête de ligne (`flex items-start gap-2`, coche `text-success`, #22C55E : 7:1 sur la carte). Sinon la couleur de bordure seule suffit, car le texte porte le sens.
- Attention test : `data-testid="question-equipe-statut"` doit rester sur l'élément qui reçoit le texte ; ajuster le test si le sélecteur visait le conteneur.

### C3. Champ en 14 px : zoom automatique sur iPhone

- Ligne 109 : `text-sm` devient `text-base sm:text-sm`. Safari iOS zoome la page au focus d'un champ de moins de 16 px, ce qui décale la carte justement au moment de l'écriture.
- À aligner avec `Input` (`ui/input.tsx`, non lu) : si lui aussi est en `text-sm`, le même défaut existe sur Prénom, à traiter au niveau système.

### C4. Compteur : changement de graisse, donc la ligne d'aide se recoupe

- `erreur-trop-long-1440` : « Par exemple : un collègue ... rien / trouvé à répondre. » passe sur 2 lignes dès que le compteur devient rouge gras (plus large, `sm:shrink-0`), ce qui fait sauter la mise en page.
- Ligne 113 : ne pas changer la graisse entre les états. Utiliser `font-medium` en permanence (`"self-end text-xs font-medium tabular-nums sm:order-2 sm:shrink-0"`, puis `depasse ? "text-error-text" : "text-text-muted"`). Un texte `text-muted` en 12 px medium reste lisible.

## Optionnel

- **O1. Focus des liens** (lignes 125 et 140, à vérifier au clavier : aucune capture) : ajouter `rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background-card` si le style global de lien ne dessine pas d'anneau.
- **O2. Hauteur de la carte sur mobile** (ligne 101) : `rows={5}` devient `rows={4}`. Gain d'environ 24 px à 360 px ; garder `resize-y`. Rapproche la hauteur de la carte de ses voisines.
- **O3. Orphelins de ligne** (lignes 89 et 90) : `text-sm text-text-secondary` devient `text-pretty text-sm text-text-secondary` (et idem pour `text-text-muted`). Disponible à partir de Tailwind 3.4 : vérifier la version. Les espaces insécables de `typo()` limitent l'effet (« te répond. » reste lié).
- **O4. Doublon du délai** (ligne 90 et message de succès) : « En général, réponse par e-mail sous 1 à 2 jours ouvrés » apparaît en haut et dans la confirmation. Variante de copie à arbitrer avec @copywriter, selon `docs/copy/ton-alex.md` (par exemple une confirmation qui ne répète pas le délai).
- **O5. Alerte de dépassement avant l'envoi** (lignes 112 à 119) : le compteur vire au rouge sans qu'aucun lecteur d'écran ne l'annonce avant l'envoi. Ajouter un `<span className="sr-only" role="status">` qui n'affiche que « Limite dépassée de N caractères » quand `depasse`.
- **O6. Libellé du champ** (ligne 94) : `font-medium text-text-primary` (blanc) alors que Prénom utilise `text-text-secondary` sans graisse. Choix défendable pour un champ long ; à harmoniser seulement si le système veut une règle unique.
- **O7. Bouton pendant l'envoi** (ligne 135) : `disabled` retire le bouton de l'ordre de tabulation et lui fait perdre le focus. `aria-disabled` seul (la garde `if (enCours) return` existe déjà) garderait le focus, mais `Button` ne stylise que `disabled:` : arbitrage système.
- **O8. Bord du champ** (ligne 109) : bordure #2A2A2A et fond #1A1A1A sur carte #1F1F1F, soit environ 1,2:1, sous les 3:1 de WCAG 1.4.11 pour la frontière d'un champ de saisie. Défaut systémique (le champ Prénom est vraisemblablement identique) : ne pas diverger sur cette seule carte, à traiter dans le système.
- **O9. Largeur à 1440** : `max-w-2xl` (ligne 93) laisse 45 % de la carte vide à droite, alors que le champ Prénom occupe toute la largeur. Choix de longueur de ligne défendable ; pas de correction demandée.

## Hors périmètre, à signaler à @fullstack

Les mêmes 4,38:1 affectent `text-error` dans `prenom-card.tsx` ligne 82 (en `text-xs`, donc pire) et `abonnement-card.tsx` ligne 93 (message d'impayé). Même correction : `text-error-text`. Dans la carte Abonnement, les boutons `size="sm"` mesurent 32 px sur desktop (44 px sous `md`), conformes à WCAG 2.5.8 (24 px minimum).

## Ce qui est bon et à ne pas toucher

- Structure sémantique : `role="region"` + `aria-labelledby`, `label` relié, `aria-describedby` complet (aide, compteur, erreur), `aria-invalid` limité aux erreurs de champ, `role="alert"` sur l'erreur, `aria-live` sur le statut.
- Gestion du focus : retour au champ après chaque échec (texte conservé), focus sur le statut après succès.
- Bouton `min-h-11 w-full sm:w-auto`, variante `primary` cohérente avec le niveau 1 Premium.
- Ordre mobile compteur puis aide, aide puis compteur à partir de `sm`.
- Compte gratuit : aucun résidu de l'encadré.

## Handoff

- Fichier produit : `/home/user/Marrant/docs/design/revue-question-equipe-s22.md` (aucun autre fichier modifié, aucun commit).
- Note : 7,5 / 10, NO-GO tant que B1 n'est pas corrigé.
- Bloquant : B1 (contraste `text-error` 4,38:1, lignes 113 et 121).
- Top 3 : (1) B1 `text-error` vers `text-error-text`, lignes 113 et 121 ; (2) C1 anneau rouge en état invalide, ligne 109, et C3 `text-base sm:text-sm` sur le même champ ; (3) C2 succès en bloc confirmé sous le bouton, lignes 146 à 155.
- Après correction : reprendre les captures `erreur-*` et `succes-*` aux 3 largeurs, plus une capture de focus clavier (bouton et liens), et relire à l'aveugle avant GO.
