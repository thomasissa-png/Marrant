# Textes en ligne D10 (14 lignes proposées), relecture à l'aveugle : @reviewer, 13/11/2026

Contrôles : prix et chiffres intouchés ; tiret cadratin et emoji : 0 ; aucun accord genré sur l'abonné ; le code (`espace-textes-en-ligne.ts`, `espace-confidentialite.ts`) sert bien les textes proposés.

| Ligne | Note | Constat, faute et réécriture |
|---|---|---|
| T1 offre, ligne des bonus | 10, sous condition | Phrase de Thomas (Q8, `niveaux-xp-s24.md` l. 220) : non re-questionnable. Exacte : un bonus pour chacun des caps 2 à 5 (Q7, l. 219), ouvert par les XP d'étapes (`caps.ts` l. 8-10), donc « dans les parcours ». **Condition de vérité :** un bonus ne s'ouvre que si sa fiche est rangée (`bonus.ts` l. 19-21), or aucun `data/espace/bonus*.json` n'existe encore. Pas de go en ligne tant que les 4 fiches ne sont pas en place. |
| T3 E0, puce ajoutée | 10, même condition | Même phrase ; « Et… » prolonge la puce des parcours. « Écris-nous depuis ton profil » reste vrai grâce à T8. |
| T6 a, caps annoncés | 6 | Faute (exactitude) : le recalcul de l'ouverture marque tous les comptes qui ont des XP ou une étape (`caps-serveur.ts` l. 122-123), abonnés ou non, donc « si tu es abonné » est faux. Réécriture : retirer « , si tu es abonné » (le reste est juste, recalcul silencieux compris). L'autre option, limiter le recalcul aux abonnés, est un changement de code (@fullstack). |
| T6 b | 10 | Base légale de T6 a, sans réserve d'abonné. |
| T6 c, usage | 7 | Faute (exactitude) : la réplique et la question sont des compteurs anonymes (`evenements-espace.ts` l. 9-10) ; seuls `espace_ouvert` et `cap_atteint` sont rattachés au compte. En plus, « jamais leur texte » trompe, puisque leur texte est gardé dans l'espace. Réécriture : « Usage de ton espace, si tu es abonné : chaque jour où tu l'ouvres et chaque cap atteint (son numéro). On compte aussi, sans aucun lien avec ton compte, combien de fois certains écrans s'ouvrent (cloche, bonus, coin « Humour noir », archive « Lettres ») et combien de répliques et de questions sont envoyées. Aucune adresse IP. Ces données sont effacées avec ton compte » |
| T6 d | 10 | Juste, opposition par la partie 7. |
| T6 e, durées | 9 | Faute (complétude) : les répliques écrites, gardées sur le compte, n'ont de durée écrite nulle part (aucune occurrence dans `espace-confidentialite.ts`) ; les questions l'ont en partie 9 (l. 71). Réécriture : « …tes retours sur les exercices, tes répliques, ta réponse sur l'endroit… » |
| T6 f | 10 | Retouche minimale (« Les copies par e-mail de »), juste avec la partie 9. |
| T6 g, Neon | 9 | Même oubli. Réécriture : « Neon : base de données (compte, progression, abonnement, tes répliques, tes questions et nos réponses) » |
| T7, CGU art. 10 | 8 | Faute (clarté) : l'incise placée avant « en général sous 1 à 2 jours ouvrés » laisse croire que c'est la copie dans l'espace qui prend ce délai. Réécriture, celle que @legal propose en variante : garder la 2e phrase actuelle et ajouter « Tu retrouves ensuite ta question et sa réponse dans ton espace. » ; la 1re retouche (« depuis ton espace (Mes questions) ») reste. |
| T8, profil | 10 | « Ta question à l'équipe : Mes questions » garde le repère que citent E0 et E1b, et le lien seul a un nom clair. |
| T11 a | 10 | Exact (`ancien-abonne.ts` : `userPathStepCompletion`, `userFavorite`, pluriels). Variantes proposées, au choix de Thomas : « Ta progression est gardée : {n} étapes faites. » si 0 favori ; « Tes favoris sont gardés : {n} favoris. » si 0 étape. |
| T11 b | 9 | Faute (exactitude) : la ligne s'affiche avec des répliques et zéro question, et annonce alors un historique de questions vide. Réécriture selon les nombres : « Ton historique de questions est gardé. » (questions seules) ; « Tes répliques sont gardées. » (répliques seules) ; la phrase actuelle quand il y a les deux. |
| Durée de la mesure | sans objet | Pas de texte ; `[HYPOTHÈSE : 13 mois]` est correctement marquée, la décision revient à Thomas. |

**Top 3 avant de présenter à Thomas** : T6 a (réserve fausse) ; T6 c (événements et texte) ; condition des fiches bonus pour T1 et T3.
