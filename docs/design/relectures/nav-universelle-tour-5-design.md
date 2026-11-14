# Relecture design à l'aveugle, tour 5 : navigation universelle s24 (v5)

Note : 9/10. L'orphelin de 768 à 1023 px est réglé, mais l'intitulé choisi est plus pâle que ses propres enfants.

## Vérifications

- Intitulé non cliquable : `<p>` en `hidden md:block lg:hidden`, sans `href` : présent de 768 à 1023, absent dès 1024 (le menu disparaît) et sous 768 (le lien prend sa place). Parent visible, critère 3 tenu. Condition à écrire : le lien « Mon espace » porte `md:hidden`, sinon les deux s'affichent.
- Tokens cités, tous présents dans `apps/web/tailwind.config.ts` : `text-text-primary` (#FFFFFF), `text-text-secondary` (#B3B3B3), `text-text-muted` (#9A9A9A), `text-accent-link` (#A78BFA), `border-border` (#2A2A2A), `bg-background-elevated` (#2A2A2A), `border-accent-primary` (#8B5CF6). `ml-3`, `pl-6`, `border-t`, `border-b-2`, `min-[440px]` : échelle Tailwind par défaut ou valeur arbitraire permise, rien d'inventé.
- Calcul de hauteur : 65 + 16 + 52 + 44 + 352 + 1 = 530 ; 667 - 530 = 137 ; 568 - 530 = 38. Juste.

## Faute dure (1)

1. Intitulé plus pâle que ses entrées (-1). `text-text-muted` #9A9A9A (contraste ~7:1 sur #0D0D0D, AA tenu) est plus sombre que `text-text-secondary` #B3B3B3 des 8 entrées : de 768 à 1023 px le parent s'efface devant ses enfants, hiérarchie inversée (et il est en `text-sm` contre des lignes en taille courante). Correction : `<p class="text-sm font-semibold text-text-primary">` (même couleur que la version lien sous 768 px, bien plus lisible que `text-text-muted`) ; le muted reste réservé aux métadonnées.

## Pistes

- Hauteur du `<p>` : lui donner `flex min-h-11 items-center` pour garder le même rythme de 44 px que la ligne-lien.
- Mode clair toujours à confirmer.
