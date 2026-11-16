# Relecture à l'aveugle, « Aujourd'hui » s25 v7, tour 1

Relu : specs UX et design, captures pleine page et premier écran (visiteur, gratuit, en-cours, nouvel ; 375, 768, 1280, 1920 ouverts, 1456 non ouvert car identique à 1280 par construction), code `aujourdhui/*`, `apercu/{tableau-verrouille,offre-apercu,extrait-coupe}`, `mon-espace/page.tsx`, `tableau.tsx`, `styles.ts`. Non relus : `contenu-du-jour.tsx`, `cap-du-jour.tsx`, `tuile-fermee.tsx`, `hero-apercu.tsx` (jugés sur capture). `project-context.md` non rouvert (le brief est suffisant pour la grille).

## Ce qui est réussi (à ne pas toucher)
- Aperçu : hero à gauche, carte d'offre à droite (bord violet 2 px), bouton plein en haut, une seule offre, réassurance et preuve dedans. Le prospect lit « Premium » (pastille avec mot) dès le premier regard. Fermé lisible : extrait atténué, coupé par le fondu, pastille sur chaque tuile, « La suite est dans Premium » puis légende.
- Largeur : grille 8/4 puis 4/4/4 respectée, coque alignée sur la bande des rubriques, halo présent à 1920.
- Abonné : H1 à gauche, date, Z1 dominante avec un seul plein, Z2 « Ton cap » avec 250 / 1 en grand, tuiles Parcours/Mission en 6/6 sans cellule vide, C9 en rangée entière.
- Code : extrait `aria-hidden` + `inert` + `pointer-events-none` ; boutons figés `aria-disabled` sans lien ; `LIEN` `min-h-11` (Connexion 44 px) ; pied de tuile `min-h-12` ; `min-w-0` et `[overflow-wrap:anywhere]` partout.

## Notes par critère

| Critère | Note | Défaut précis (capture) | Correction codable | Ce qui ferait 10 |
|---|---|---|---|---|
| D1 Élégance, fidélité accueil | 8 | Tuiles creuses (voir D3) cassent la finition de l'accueil ; réassurance de l'offre en `text-primary` blanc plein, plus vive que sur l'accueil (muted) | `Reassurance` dans `offre-apercu.tsx` : `className="mt-3 text-xs text-text-muted"` | Zéro vide + réassurance discrète |
| D2 Hiérarchie | 8 | Visiteur : 3 boutons pleins identiques (en-tête, offre, fin) plus 6 pastilles « Premium » ; acceptable (précédent accueil) mais la fin d'extrait pèse autant que l'offre. Abonné en-cours : phrase d'accroche « La bonne réponse qui te vient… » au-dessus du titre « Si tu as 5 minutes » fait lire deux titres | `action-du-jour.tsx` : chapeau en `text-xs text-text-muted` au-dessus, ou sous le titre | Une dominante nette par écran |
| D3 Usage de la largeur, aucun vide mort, aucune tuile creuse | **6** | (a) Nouvel, 1280/1920 : « Étape conseillée » = 150 px de vide entre « Tes premières répliques » et le pied ; 768 : environ 200 px. (b) Z1 « Premier pas » et Z2 « Ton cap » (nouvel et aperçu, tous comptes) : 70 à 90 px vides en bas. (c) « Contenu du jour » : cartes Vanne et Conseil avec 130 px vides (tous comptes abonnés, 1280 et 1920). (d) Mission 2 (en-cours) : 60 px vides au milieu. (e) Aperçu : 95 px morts sous la légende avant le pied. (f) 1920 : 352 px de noir de chaque côté (arbitré par la spec, halo présent) | Voir fautes dures 1 à 3 ; (e) `pb-16` de `page.tsx` + marge de l'aperçu : retirer `pb-16` côté aperçu ; (f) piste, hors page | Tuiles de hauteur égale remplies ou resserrées |
| D4 Cohérence entre comptes | 8 | Gratuit : hero 4 px plus haut (phrase d'objet), correct. Pastille « Série » seule du hero sans tuile « Série » dans l'extrait (elle vit dans Ton cap) ; abonné : « Étape en cours » du hero n'apparaît que sous « Étape conseillée » dans l'extrait : léger écart de mots entre promesse et extrait | piste : pas de changement de texte demandé | Mots du hero = titres de l'extrait |
| D5 Finition au pixel | 8 | Rail de la barre d'étapes (`bg-background` sur carte) presque invisible (capture en-cours : la barre « Étape 3 sur 3 » semble flotter) ; début de ligne en minuscule dans « 4 premières semaines » (voir UX4) | `tableau.tsx` `BarreProgression` : rail `bg-border` (comme `SegmentsCap`) | Rail lisible |
| U1 Prospect, envie en 3 s | 7 | 1280 : excellent. 375 : l'extrait ne montre qu'une tuile (Premier pas), jamais « Ton cap » ni la série, la gamification n'est donc pas vue sur mobile. 768 : « Ton cap » coupé en pleine ligne (bande de 60 px, texte tronqué à mi-hauteur) : lit « cassé », pas « fermé » | `extrait-coupe.tsx` : `md:h-[25rem]` portée à `md:h-[27.5rem]` ou `md:h-[31rem]` pour que la tuile Ton cap soit montrée entière (hauteur de Z2 à 768 environ 100 px, ligne 2 démarre à 975 px) ; à 375 `h-80` → `h-[26rem]` | Au moins Premier pas et Ton cap entiers aux 3 largeurs |
| U2 Abonné, clarté | 8 | En-cours : action du jour claire, mais deux surfaces violettes (Z1 + « Reprendre » en pied de Z3) ; correct car lien, pas bouton plein | piste | Idem |
| U3 Abonné, envie de continuer | 8 | Cap, XP, série, étape n sur N : présents. « Une autre » du contenu du jour sans récompense visible ; pas de lien vers la suite (cap suivant) dans Ton cap | piste, aucun texte à inventer | Ligne « prochain cap » (texte à valider) |
| U4 Nouvel abonné, jamais page morte | 7 | Feuille de route lisible, mais chaque ligne démarre en minuscule (« le faux secret, une mission à voix haute. Le parcours peut attendre. ») : « Semaine n : » est `sr-only`, le chiffre seul ne remplace pas le début de phrase ; ça lit comme une phrase coupée. Texte non réécrit, à signaler à Thomas | `semaines-tuile.tsx` : rendre le préfixe visible en petite étiquette (`block text-xs uppercase tracking-wide text-text-muted`, retirer `sr-only`) et retirer le chiffre géant ou le garder `aria-hidden` | Ligne qui commence par « Semaine 1 » |
| U5 Accessibilité et cohérence | 9 | Cibles 44 px vérifiées au code (boutons `h-12`, `LIEN`, pied `min-h-12`, puces `min-h-11`) ; extrait inerte ; H1 unique. Contraste des tuiles atténuées (`opacity-75`, ligne « Tes premières répliques » presque illisible) exempté car inerte mais proche de 3:1 | piste : `TuileFermee` `opacity-75` → `opacity-80` | Idem |

## Fautes dures (bloquent la validation)

1. Tuile « Étape conseillée » creuse (nouvel abonné, tous les largeurs ≥ 768).
   Correction : `semaines-tuile.tsx`, passer la liste en 2 colonnes dès `md` (`<ol className="mt-2 md:grid md:grid-cols-2 md:gap-x-8 md:divide-y-0">`, lignes `border-b border-border`) pour ramener la hauteur de la rangée à celle d'« Étape conseillée » (environ 190 px) ; `page.tsx` passe « semaines » en `lg:col-span-7` (déjà). Alternative : placer `justify-between` dans `ParcoursTuile` pour que le titre de l'étape descende au centre.
2. Z1 et Z2 avec 70 à 90 px de vide en bas (nouvel + aperçu, tous comptes avec premier pas).
   Correction : `tableau.tsx` `CARTE_ACTION` : retirer `md:min-h-[14.5rem]` ; `action-du-jour.tsx` : la grille interne en `md:flex-1 md:content-between` ; `cap-du-jour.tsx` : phrase `serieZero` en `mt-auto`.
3. Cartes Vanne et Conseil du jour : 130 px de vide (1280, 1920, tous comptes abonnés). La proposition de la spec design §4 Z6 (« Une autre » en `mt-auto`) n'est pas appliquée.
   Correction : `contenu-du-jour.tsx`, carte en `flex h-full flex-col`, bloc « Une autre » et ligne « À toi : » en `mt-auto`, ou réduire la hauteur de la rangée en laissant la vidéo en `lg:col-span-1` avec vignette `aspect-[16/10]`.
4. Aperçu : extrait coupé en plein texte à 768 (« Ton cap » en bande de 60 px, texte tronqué) ; à 375 et 768, la gamification (cap, série) n'est pas montrée. L'impression « fermé » est là mais la valeur ne s'y lit pas.
   Correction : `extrait-coupe.tsx` hauteurs `h-[26rem] md:h-[31rem] lg:h-[27.5rem]`.
5. Feuille de route du nouvel abonné : le début de chaque ligne en minuscule lit comme un texte tronqué (préfixe « Semaine n : » caché à l'œil).
   Correction : `semaines-tuile.tsx` (préfixe visible, aucun texte changé).

## Pistes (non bloquantes)
- 1920 : bords noirs de 352 px, arbitrés par la spec ; élargir bande, en-tête et pied ensemble hors de cette page si Thomas le veut.
- Visiteur : un seul des trois boutons pleins pourrait passer en secondaire (le second de fin d'extrait) pour renforcer la dominance de l'offre en haut.
- Réassurance en `text-muted` (voir D1).
- Rail de barre `bg-border` (voir D5).
- Texte T1 « Ton tableau de bord : chaque jour, ton action, ta progression et ta série. » : bien placé (sous le H1, en `text-xl`), conforme au brief ; texte « à valider » non jugé sur sa formulation.

NOTE GLOBALE : 6/10

Fautes dures :
1. Tuile « Étape conseillée » creuse (150 à 200 px de vide), nouvel abonné : `apps/web/src/components/espace/aujourdhui/semaines-tuile.tsx` (+ `etape-en-cours.tsx`).
2. Z1 et Z2 avec 70 à 90 px de vide en bas (nouvel et aperçu) : `apps/web/src/components/espace/aujourdhui/tableau.tsx` (`CARTE_ACTION`), `action-du-jour.tsx`, `cap-du-jour.tsx`.
3. Cartes Vanne et Conseil du jour creuses (130 px de vide, 1280 et 1920) : `apps/web/src/components/espace/aujourdhui/contenu-du-jour.tsx`.
4. Aperçu : extrait coupé en plein texte à 768, cap et série invisibles à 375 et 768 : `apps/web/src/components/espace/apercu/extrait-coupe.tsx`.
5. Feuille de route du nouvel abonné : lignes en minuscule, préfixe « Semaine n : » caché à l'œil : `apps/web/src/components/espace/aujourdhui/semaines-tuile.tsx`.
