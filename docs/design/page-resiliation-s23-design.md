# Page /resiliation : spécification visuelle (s23, @design, 06/11/2026)

Source : `docs/ux/page-resiliation-s23-spec.md` v3. Textes PROVISOIRES (étalons Thomas, P0 s8). **Zéro token nouveau, zéro composant nouveau** : tout vient de `apps/web/tailwind.config.ts`, `src/styles/globals.css` (site 100 % sombre, `color-scheme: dark`) et de `src/components/ui/*`. Précédents copiés : `retractation-recap.tsx` (récap + « Confirmer » `primary` `lg`), `abonnement-card.tsx` (Badge, squelette, lien discret). Les textes de sorties (E-mail, accusé) restent hors périmètre.

## 1. Grille et page
- Route dans `(dashboard)` : le `<main>` du layout fournit déjà `mx-auto max-w-7xl px-4 py-8 md:px-6 xl:px-8` + en-tête + pied. Contenu : `<div className="mx-auto max-w-xl">` (576 px, une colonne, tous écrans). Aucune sidebar, aucun modal (connexion en fenêtre : composant existant, fermable).
- Rythme vertical : H1, `mt-6` récapitulatif, `mt-8` question, `mt-8` barre d'action. Fond de page `bg-background` (#0D0D0D) ; seul le récapitulatif est une `Card` (#1F1F1F) : une carte = une information légale, le reste respire sur le fond.
- Breakpoints : mobile < 640 (référence 390), `md` 768, `xl` 1280. Aucun défilement horizontal : `break-words` sur l'e-mail du compte.

## 2. Hiérarchie typographique (squint test : H1, date de fin, bouton)
| Élément | Classes |
|---|---|
| H1 « Résilier ton contrat » | `font-display text-3xl font-bold md:text-4xl` (comme /retractation) |
| Date de fin (valeur-clé) | `font-display text-xl font-bold text-text-primary` |
| Titre de question | `<legend className="text-lg font-semibold text-text-primary">` + `<Badge variant="default" className="ml-2 align-middle">Facultatif</Badge>` |
| Aide « Tu peux résilier sans répondre. » | `mt-1 text-sm text-text-secondary` |
| Corps, libellés de raisons | `text-sm text-text-primary` / `text-text-secondary` |
| Compteur 0/500 | `text-xs text-text-muted` (aligné à droite, `aria-hidden`) |
Pas de gras hors H1, date, legend. Pas d'icône décorative, pas de carré arrondi au-dessus d'un texte (anti-look IA), pas d'illustration (page fonctionnelle, aucune image requise).

## 3. Récapitulatif (`Card className="p-5 md:p-6"`)
- `CardHeader` : `flex items-center justify-between` ; `CardTitle` (h2, « Ton contrat ») + `<Badge variant="primary">` (formule : « Premium mensuel »), comme la carte abonnement.
- `<dl className="divide-y divide-border text-sm">`, lignes `flex items-baseline justify-between gap-4 py-3` : `dt text-text-secondary`, `dd text-right font-medium text-text-primary break-words`. Lignes : Compte (e-mail, prénom si connu), Prix TTC. **Montants et dates alignés à droite** (standard comptable).
- Bloc date : `mt-4 rounded-md bg-background-elevated px-4 py-3` ; libellé « Fin du contrat » `text-xs text-text-secondary`, date en `font-display text-xl font-bold`. Dessous : `mt-4 space-y-1 text-sm` ; « Jusqu'à cette date, tu gardes tout ton Premium. » `text-text-primary`, « Aucun nouveau prélèvement après. » `text-text-secondary`. Annuel : ligne renouvellement en plus, même style.
- Chargement : lignes en squelette `h-4 w-1/2 animate-pulse rounded bg-background-elevated` + `aria-hidden`, date `h-7 w-48` ; conteneur `aria-busy`. Pas de `hover:border-border-hover` trompeur : ajouter `hover:border-border` sur cette Card (non cliquable).

## 4. Les 7 raisons
- `<fieldset aria-describedby="raisons-aide" className="mt-8">` ; raisons dans `div className="mt-4 grid gap-2 md:grid-cols-2"` (1 colonne < 768, ordre fixe, `Autre` en dernier). DOM = ordre de lecture = ordre de tabulation (ligne par ligne).
- Chaque raison = `<label>` entier cliquable contenant un `<input type="checkbox">` **natif** (pas de case recréée : clavier, lecteur d'écran, espace, `color-scheme: dark` gratuits) :
  `flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border-input bg-background-card px-4 py-3 text-sm text-text-primary transition-colors hover:border-accent-primary/80 has-[:checked]:border-accent-primary has-[:checked]:bg-accent-primary/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-link has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background`
  case : `h-5 w-5 shrink-0 accent-accent-primary`. Cible = toute la ligne, 48 px (>= 44, WCAG 2.5.8). Grille `items-stretch` : si un libellé passe sur 2 lignes (colonnes de ~270 px), les deux cases d'une ligne gardent la même hauteur.
- États : repos (bordure #707070, 3,3:1 sur carte, 1.4.11) ; survol (bordure violette 80 %) ; coché (bordure `accent-primary` ~3,9:1 + fond `/10` + coche native : jamais la couleur seule) ; focus clavier (anneau 2 px `accent-link` ~7:1) ; jamais pré-coché ; pas de `disabled` (sauf `aria-disabled` pendant l'envoi, sans opacité).
- `[À VÉRIFIER @fullstack]` Tailwind >= 3.4 pour `has-[]` ; sinon repli `peer` + `peer-focus-visible`, même rendu.

## 5. Champ libre
- `label` « Un mot de plus ? » `mb-1 block text-sm font-medium text-text-primary` + « (facultatif) » en `text-text-muted font-normal`. `textarea rows={3} maxLength={500}` : `w-full rounded-lg border border-border-input bg-background-light px-4 py-3 text-base md:text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-link` (`text-base` sur mobile : évite le zoom automatique iOS < 16 px). Ne PAS reprendre `INPUT_CLASS` de la rétractation : sa bordure `border-border` (#2A2A2A) fait ~1,3:1, sous les 3:1 de 1.4.11 ; utiliser le token `border-input` créé en s22.
- Jamais `required`, même si « Autre » est coché. Compteur `0/500` sous le champ, `mt-1 text-right`.

## 6. Barre d'action sticky (bouton + lien dans le même bloc)
`<div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:mx-0 sm:px-0">` (fond OPAQUE, pas de flou ni de transparence : le texte derrière ne doit jamais passer sous le bouton). Reste sticky tant que la barre n'a pas rejoint sa place naturelle en bas du contenu, puis se pose au-dessus du pied de page.
- **Mobile (390)** : `flex flex-col gap-1`. Bouton `Button variant="primary" size="lg" className="w-full"` (48 px, texte blanc sur #7C3AED : 5,7:1 AA). Dessous, lien centré `inline-flex min-h-11 items-center justify-center`. Hauteur totale ~ 130 px (sur iPhone avec zone de sécurité). Clavier ouvert : la barre suit le bas de la zone visible, le champ libre reste visible au-dessus (vérifier sur capture).
- **PC (>= 640)** : `sm:flex-row sm:items-center sm:gap-6`, bouton `sm:w-auto` à gauche, lien à droite. Ordre DOM : bouton puis lien (tabulation : Confirmer, puis Garder).
- Lien : `<Link href="/profil#abonnement" className="text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background">`. Contraste #B3B3B3 sur #0D0D0D ~9,3:1 : lisible, jamais caché, mais plus petit (`text-sm` contre `text-base font-semibold`), sans fond et sans cadre : le bouton garde la saillance.
- `[À VÉRIFIER @fullstack]` `viewport-fit=cover` dans le viewport (sinon `env()` vaut 0, sans casse) ; autres éléments fixes en bas (bandeau cookies, barre d'onglets) : ne pas se chevaucher.

## 7. États
| État | Rendu |
|---|---|
| Survol bouton | `hover:bg-accent-secondary` (déjà dans `primary`) |
| Focus clavier | anneau 2 px `accent-link` + offset 2 px (déjà dans `Button`) |
| Envoi | `aria-busy="true"` + `aria-disabled="true"` (PAS `disabled` : il applique `opacity-50`, soit un bouton grisé) ; contenu `<Chargement texte="On résilie…" />` ; `cursor-wait` ; clics ignorés ; raisons et champ en `aria-disabled`, saisie conservée. Au-delà de 3 s : ligne `text-sm text-text-secondary` `role="status"` sous le bouton |
| Erreur | bandeau en haut du contenu : `rounded-lg border border-error/50 bg-error/10 p-4 text-sm text-error-text` (AA ~5,1:1), `role="alert"`, `tabIndex={-1}`, focus + `scrollIntoView` (précédent `titreRef` du récap). Bouton reste plein, libellé « Réessayer », jamais grisé |
| Déjà résilié | même récap (badge `success`), pas de question, pas de barre ; `Button variant="outline" size="lg"` « Réactiver mon abonnement » |
| Aucun abonnement / App Store | `Card` + texte `text-text-secondary` + `Button variant="outline"` retour accueil |
| Hors ligne | même bandeau d'erreur, texte « Pas de connexion… » |

## 8. Page /resiliation/confirmee
Même colonne `mx-auto max-w-xl`. H1 « C'est noté. » (mêmes classes), `tabIndex={-1}` avec focus au chargement, comme le récap (lecteurs d'écran : annonce de la page). Dessous : la même `Card` récapitulative (composant partagé), `Badge variant="success"` « Enregistrée » (texte + couleur, ~5:1), date de fin en `font-display text-xl`, puis « On t'envoie un e-mail de confirmation à {adresse}. » `text-sm text-text-secondary`. Actions : `Button variant="outline" size="lg"` « Retour à l'accueil » ; lien « Changer d'avis ? Réactiver mon abonnement » : `text-sm text-text-secondary underline underline-offset-4 min-h-11 inline-flex items-center`. Aucune offre, aucune question, aucune image. Pas de barre sticky.

## 9. Accessibilité (WCAG 2.2 AA, site sombre unique)
Contrastes calculés avec les vraies couleurs : blanc/#0D0D0D 19:1 ; #B3B3B3/#1F1F1F 7,9:1 ; #9A9A9A/#1F1F1F 5,9:1 ; `accent-link`/#1F1F1F 6,0:1 ; blanc/#7C3AED 5,7:1 ; `error-text`/`bg-error/10` ~5,1:1. Ordre de tabulation : lien d'évitement, en-tête, H1 (non focalisable), cases 1 à 7, champ libre, Confirmer, Garder, pied. `fieldset`+`legend`, `aria-describedby` (aide, compteur), `aria-live="polite"` sur « On résilie… », `role="alert"` sur l'erreur, `aria-busy` sur le bouton, cibles >= 44 px (cases 48, bouton 48, lien 44), zoom 200 % sans perte, `motion-reduce` géré par `globals.css` et `Chargement`. Aucun survol requis pour une information.

## 10. À NE PAS faire (dark patterns visuels)
- Bouton « Confirmer » grisé, `disabled` hors envoi, `opacity` réduite, retardé, ou conditionné à la réponse ; variante `ghost`/`outline` pour résilier.
- Lien « Garder mon abonnement » plus voyant que le bouton : bouton plein, fond violet, `Button` (même discret en `outline`), grande taille, couleur d'alerte ; à l'inverse, lien caché, `text-xs` sous 4,5:1, ou hors viewport.
- Rouge `danger` pour résilier (blanc sur #EF4444 = 3,8:1, sous AA en `text-base`, et ton alarmiste) ; vert/violet vif sur « Garder ».
- Cases pré-cochées ; `required` ; astérisque ; « Autre » qui force le champ libre ; plus de 7 raisons.
- Pop-up, modal, compte à rebours, double confirmation, animation insistante (shake, pulse) sur « Garder », illustration émotionnelle, texte culpabilisant, tiret cadratin.
- Barre sticky translucide ou avec `backdrop-blur` ; bouton qui change de place ou de taille entre états ; lien qui sort du viewport quand le clavier s'ouvre.

## 11. Critères 10/10 design à vérifier sur captures (375 / 768 / 1280, repos, saisie, envoi, erreur, déjà résilié, confirmée)
1 Hiérarchie : H1, date de fin, bouton identifiables en plissant les yeux. 2 Une action primaire dominante (bouton plein), deux secondaires (cocher, garder). 3 Bouton visible sans défilement à chaque état, y compris clavier ouvert 390 px. 4 Lien « Garder » lisible mais clairement secondaire, jamais coupé. 5 Cases : 48 px, coche visible, focus visible, pas de pré-coche. 6 Récap : montants et dates à droite, aucune troncature. 7 Zone de sécurité iOS respectée (aucun contenu sous la barre d'accueil). 8 Aucun défilement horizontal. 9 Même identité que /retractation et /profil (mêmes `Card`, `Badge`, `Button`, rayons `rounded-lg`). 10 Aucun espace arbitraire : uniquement l'échelle Tailwind (la seule valeur arbitraire est `pb-[max(...safe-area)]`). Notes /10 par critère dans `docs/design/` après captures.
