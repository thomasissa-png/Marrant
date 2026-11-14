# Relecture design à l'aveugle, tour 3 : navigation universelle s24 (v3)

Note : 9/10. Mes 2 fautes du tour 2 sont corrigées. Une faute dure nouvelle (hiérarchie du menu mobile abonné), le reste en pistes.

## Vérification des 2 fautes du tour 2

| Faute | Statut | Preuve |
|---|---|---|
| Carte du jour à 1280 px (vide à droite) | Corrigée | §3 : colonne 1 carte du jour, colonne 2 « Dans ton espace » (`min-w-0`), limite de 768 px retirée des cartes, « Contenu du jour » en `md:grid-cols-2 xl:grid-cols-3` avec 3e carte `md:col-span-2 xl:col-span-1` (pas d'orpheline). À 768 : deux colonnes de ~348 px, la carte du jour et l'index font ~350 px de haut (8 x 44) : hauteurs égales |
| Plage 440 à 767 px | Corrigée | §1 : loupe dès 440, Connexion dès 520, compte dès 768, cloche toujours, offre courte sous 640 |

## Mesures (largeurs lues sur captures, logo 169 px à 440, 188 px dès 640)

| Largeur | Utile | État le plus chargé | Total | Verdict |
|---|---|---|---|---|
| 440 | 408 | visiteur : logo 169 + loupe 44 + « Premium » 84 + Menu 44 + 3 gaps ~ 24 | ~365 | PASS, 43 px libres |
| 520 | 488 | visiteur + Connexion (~82) | ~451 | PASS, 37 px libres |
| 639 | 591 | visiteur avec offre courte | ~420 | PASS |
| 640 | 608 | visiteur : 188 + 44 + 82 + 174 + 44 + 4 gaps de 16 | ~596 | PASS mais 12 px libres : le plus serré de la plage ; `header-budget` doit tester 640 et 641 |
| 767 | 719 | idem 640, marges 24 | ~596 | PASS, 123 libres |
| 440 à 767, abonné | | logo + loupe + cloche + Menu (3 x 44) + gaps | 317 à 344 | PASS |
| 768, abonné | 720 | logo 188 + Mon espace 101 + 4 x 44 + 5 gaps de 16 | ~545 | PASS |

Menu mobile abonné à 375 x 667 : en-tête 65 + recherche 52 + « Mon espace » 44 + 8 x 44 (352) = 513 px, 154 px libres : les 8 entrées tiennent, le calcul de la spec est juste. Il reste 154 px pour Parcours (557), Vannes (601), Conseils (645) ; Vidéos, Articles, Mon profil, Déconnexion sont sous le pli (suite totale ~ 830 px, défilement). À 568 px de haut (critère 5) : 55 px libres, tient.

## Faute dure (1)

1. Menu mobile : 14 lignes identiques, aucune hiérarchie (-1). « Mon espace » + 8 entrées + 5 liens du site, tous en lignes de 44 px, même style, « un seul ordre sans groupe » : le lecteur ne voit pas que 8 lignes sont dans l'espace et 5 sont le site (critère 8 de Thomas : hiérarchie). Correction, sans coût de hauteur : les 8 entrées de l'index en `pl-6 text-text-secondary` avec un filet `border-l border-border ml-3`, la ligne « Mon espace » en `font-semibold text-text-primary`, puis un séparateur `border-t border-border` (1 px, 0 px de marge : 514 au lieu de 513) avant Parcours. L'état actif reste `bg-background-elevated text-accent-link font-semibold`.

## Pistes

- Doublon : de 768 à 1023 px « Mon espace » est en barre et première ligne du menu, ce qui contredit le critère 3. Masquer cette ligne dès `md` (`md:hidden`), garder l'index.
- Plus petit écran : sur iPhone SE avec barres Safari (~460 px utiles) l'index défile ; le critère 5 est écrit à 568 px (dvh) : le dire (« 100dvh ») dans le critère.
- Abonné à 375 : la loupe pourrait aller en barre (254 + 52 = 306 sur 343) et libérer 52 px de menu, mais casse la règle unique « sous 440 px » ; non retenu, bon choix.
- `/mon-espace/s-entrainer` est C, mais seule Aujourd'hui est composée en colonnes : préciser 1 carte par colonne, `gap-6`, sinon @fullstack improvise.
- Rythme : `py-8` (32 px) du `main` sert aussi à l'espace : sobre, cohérent avec le public ; le H1 des pages C est donc à 32 px sous l'en-tête (capture `espace-aujourdhui-1280` : 46 px de barre en moins).
- Mode clair toujours à confirmer.
