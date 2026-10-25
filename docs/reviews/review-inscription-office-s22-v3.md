# Relecture à l'aveugle (v3, finale) : inscription d'office à la lettre de la semaine

Date : 25/10/2026. Périmètre : `apps/web/src/config/textes/lettre-hebdo-s21.ts`, `apps/web/src/components/lettre/arret-lettre-hebdo.tsx`, 14 captures `docs/qa/captures-question-equipe-s22/v6-*.png` (390 et 1440), ton : `docs/copy/ton-alex.md`.

## Note : 8,5/10. Verdict : GO

## Bloquants : aucun

Chaque état dit vrai pour la personne qui le lit :
- **Profil, activé ou arrêté** : « tant que ce réglage est activé » reste vrai dans les deux positions. La pause de la lettre du mois et sa reprise sont dites correctement.
- **Opposition (profil et retour de paiement)** : le « ou » couvre la demande comme le rebond. Rien n'est promis, et la seule action possible (écrire à contact@) est donnée. Aucun interrupteur n'est affiché, donc pas de faux réglage.
- **Retour de paiement, lettre arrêtée** : vrai (l'arrêt survit au réabonnement), et la reprise est indiquée.
- **Page d'arrêt, succès et déjà arrêtée** : vrai. « Ne change rien à ton abonnement » et « Si tu es abonné Premium » ne promettent rien de faux à un ex-abonné.
- **Ton** : tutoiement simple partout, rien de corporate. Aucun tiret cadratin dans les textes ni dans les captures.
- **Rendu** : rien ne déborde, la hiérarchie est nette (titre, texte, bouton) en 390 comme en 1440. Les cartes du retour de paiement sont lisibles en mobile.

## Mineurs (non bloquants)

1. **Non bloquant. « celle-ci » est ambigu** (ligne sous le réglage, `LETTRE_HEBDO_LIGNE_REGLAGE.avantLien`). Dans la phrase, le dernier nom cité est « la lettre du mois » : on lit donc d'abord « elle reprend quand tu arrêtes la lettre du mois ». Le contexte rétablit le sens, mais il faut relire.
   Retouche : « puis reprend quand tu arrêtes celle-ci » devient « puis reprend quand tu arrêtes la lettre de la semaine ».
2. **Non bloquant. L'adresse e-mail est coupée sur son tiret en 1440** (`v6-reglage-active-1440.png`, `v6-reglage-arrete-1440.png`) : « e2e-office6-profil-1440- » en fin de ligne, puis « mvnyf513@exemple.fr » à la ligne suivante. On peut croire que l'adresse se termine par « - ». Retouche de rendu, sans changer le texte : rendre l'adresse insécable (`whitespace-nowrap`, ou un trait d'union insécable U+2011 à l'affichage). Une adresse trop longue passe alors entière à la ligne, comme en 390.
3. **Non bloquant. Le titre et la première phrase disent deux fois la même chose** sur la page d'arrêt, état succès (`v6-arret-succes-*`) : sous « Lettre de la semaine arrêtée », le texte commence par « C'est arrêté. Tu ne recevras plus la lettre de la semaine. ».
   Retouche (`LETTRE_HEBDO_ARRET.succes`) : retirer « C'est arrêté. Tu ne recevras plus la lettre de la semaine. » ; le texte commence alors par « Cet arrêt ne change rien à ton abonnement. ».

## Recommandation

GO. Les trois mineurs sont facultatifs. Si on en applique un, la phrase touchée repasse la relecture à l'aveugle (règle d'or).
