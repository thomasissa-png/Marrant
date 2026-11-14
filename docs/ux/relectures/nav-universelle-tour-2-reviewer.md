# Relecture à l'aveugle, tour 2 : `docs/ux/navigation-universelle-s24.md` v2 (@reviewer, 14/11)

**Note : 7,5/10** (tour 1 : 5,5). Mes six fautes du tour 1 sont corrigées, D3 et D4 en partie seulement. La v2 en crée trois nouvelles, toutes des fautes dures. Ce que j'ai vérifié : les 58 `page.tsx`, `footer.tsx:12-37`, `page-header.tsx`, `tailwind.config.ts:31`, les usages de `max-w-lecture`, les lignes 61-62 de `point-etape-s20.md` et les liens vers /blague-du-jour.

## Contrôle des fautes du tour 1

| Faute | Verdict | Preuve |
|---|---|---|
| D1 pages (auth), correspondance | CORRIGÉE | Les 58 `page.tsx` sont toutes classées ou exclues (§3). Les pages `(auth)` restent sans en-tête, ce qui correspond au code (aucun `<Header />` hors de `(dashboard)/layout.tsx`). |
| D2 interrupteur | CORRIGÉE | Le §0 fait tout dépendre de l'interrupteur : fermé, rien ne change, Carnet et Favoris compris. Le critère 1 le vérifie par captures. |
| D3 état actif, double nom | EN PARTIE | Le tableau d'état actif existe, mais il a des trous (P2). Le correctif « Mon espace partout » va trop loin et crée N3. |
| D4 contradictions | EN PARTIE | (a) à (d) sont réglées. (e) : le nouveau critère 5 est faux sur téléphone (N2). |
| D5 grilles publiques | CORRIGÉE | Les colonnes existantes sont conservées, et Profil, Favoris et Carnet sont classés comme dans `gabarit.ts`. Mais le rythme vertical crée N1. |
| D6 données, pied | CORRIGÉE | Les chiffres sont exacts (`point-etape-s20.md:61-62`), l'`[HYPOTHÈSE]` est marquée et le pied est recopié fidèlement. Seule une affirmation fausse demeure (P3). |

## Fautes dures (nouvelles)

**N1. Le rythme vertical modifie toutes les pages publiques sans le dire (critère 7 et critère 6 de la grille, -1).** Le §3 impose « un seul `PageHeader` » avec `pt-8 md:pt-10 xl:pt-12` et un fil d'Ariane. Le critère 4 l'exige « sur toutes les pages ». Or :
- le `PageHeader` actuel (`page-header.tsx:9-11`) n'a ni marge haute ni fil d'Ariane, et sert à 7 listes publiques ;
- `main` porte déjà `py-8` (`(dashboard)/layout.tsx:19`), si bien que le haut de page passerait de 32 à 64-80 px sur /vannes, /blog, /conseils, etc. ;
- les pages A (articles, fiches) n'utilisent pas `PageHeader`, et leurs titres changeraient donc aussi.

Rien de tout cela n'est listé au §6, qui dit même « non rouvert ». Pour une prochaine relecture, on ne sait pas non plus si `pt-8` remplace le `py-8` de `main` ou s'y ajoute.
Correction : écrire « le haut de page reste le `py-8` de `main` (aucune marge ajoutée) ; le rythme du §3 s'applique aux pages de l'espace et aux pages publiques qui utilisent déjà `PageHeader`, sans en changer les valeurs ; les fils d'Ariane publics restent inchangés ». Ou bien lister l'écart au §6 avec des captures avant et après des pages qui se positionnent.

**N2. Sur téléphone, une rubrique de l'espace est à 3 touchers, plus un défilement (critère 2, -1).** À 375 px, « Mon espace » n'est que dans le menu (§1). Il faut donc toucher Menu, puis Mon espace, puis une entrée de l'index. Et cet index est placé « sous la carte du jour » (§4.2). Sur la capture `espace-aujourdhui-375`, la carte du jour se termine vers 585 px, soit environ 540 px une fois la barre de 46 px retirée. L'index commencerait donc au bord d'un écran de 667 px, et ses 8 lignes de 44 px (environ 350 px) seraient hors écran. Le critère 5 (« 2 clics de toute page ») et le §4 (« chaque rubrique 2 clics ») sont donc faux sur l'appareil qui fait 66 % du trafic.
Correction : dans le menu mobile, sous « Mon espace », lister les 8 entrées de l'index (lignes de 44 px, déjà dans le même ordre unique). Ou bien placer l'index au-dessus de la carte du jour. Ajouter au critère 5 : « à 375 px aussi, sans défilement ».

**N3. « Retour : Mon espace » partout casse le retour à la liste (critère 2 et critère 6 de la grille, -0,5).** Le §4.3 envoie toutes les pages A de l'espace vers Aujourd'hui. Depuis un fil /mon-espace/questions/[id], une lettre ou une situation, revenir à sa liste demande donc 3 actions au lieu d'une. Pour une fiche bilan, c'est contradictoire : l'élément allumé est « Parcours » (§1) mais le retour pointe vers « Mon espace ». La faute D3 visait seulement le nom du parent, pas sa cible.
Correction : « Retour : {rubrique parente} » (Mes questions, Lettres, Quoi répondre, Bibliothèque ; Parcours pour un bilan). Le nom « Mon espace » ne sert que lorsque le parent est /mon-espace.

## Pistes

- P1. Pour l'abonné, le logo et « Mon espace » mènent tous deux à /mon-espace. C'est le doublon reproché à l'onglet Accueil (§2), et cela contredit à la lettre le critère 3 (« aucun lien deux fois »). Écrire « hors logo » dans le critère 3, ou renvoyer le logo vers `/` pour tous.
- P2. Le tableau d'état actif n'est pas exhaustif. Il manque /carnet pour un visiteur, /glossaire, /anatomie-vanne, /blague-du-jour et /a-propos. Pour /favoris, l'inscrit gratuit n'a pas de « Mon espace » : c'est l'icône du compte qui doit s'allumer. Ajouter une ligne « toute autre adresse : aucun » et une ligne « /favoris (inscrit gratuit) : icône du compte ».
- P3. « Blague du jour, page jusqu'ici sans lien » est faux : elle est liée depuis `blog-articles.ts`, `/liens`, `lettre-s21.ts` et le sitemap. Écrire « sans lien dans le pied ».
- P4. Le critère 10 exige de masquer le bouton sur /register, une page qui n'a pas d'en-tête (§3). Retirer /register du critère, comme l'a fait le §1 l.29.
- P5. Le §3 garde « fil d'Ariane ou retour » pour les pages publiques. Préciser lequel s'affiche à quelle largeur pour que le critère soit vérifiable sur capture.
- P6. `maxWidth.lecture` sert dans 14 fichiers de l'espace, dont `axe-espace.tsx:18`. Les citer dans le lot de @fullstack pour que la suppression ne laisse aucune classe morte.
