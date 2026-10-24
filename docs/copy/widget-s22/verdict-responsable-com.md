# Verdict à l'aveugle : responsable communication interne (blog de PME, prudent)

Lecture : page « intégrer la vanne du jour ». Grille : clair, exact, sans piège (cookies, pub, sécurité), donne envie. Contraintes SEO vérifiées par comptage : title ≤ 60, description 120 à 155.

| bloc | choix | note | pourquoi |
|---|---|---|---|
| 1. title et H1 | B (remplacé) | 8/10 | B dit ce que c'est (un widget gratuit, 50 car.) mais sans verbe ; A finit sur un « gratuitement » qui traîne. **Remplacement (57 car.) :** `Intègre la vanne du jour sur ton site : un widget gratuit` |
| 2. meta description | B | 9/10 | 134 car. (dans 120-155) ; dit tout : widget, gratuit, blog, « je colle le code », change chaque jour, sans cookie ni pub ; plus parlant que A. |
| 3. chapeau | B (retouché) | 8/10 | Seule version qui dit le prix réel : un copier-coller de ma part, un lien « Deviens Marrant » de leur côté ; ça rassure. « Sans que tu écrives rien » sonne faux. **Remplacement :** `Chaque jour, une nouvelle vanne s'affiche sur ton site, sans que tu aies rien à écrire. Ça te coûte un copier-coller. Nous, on y gagne un lien « Deviens Marrant » dans le widget, que tu laisses visible. Gratuit, sans cookie, sans pub.` |
| 4. titres des aperçus | A | 9/10 | « Sur fond clair » reste lisible dans le title de l'iframe (« La vanne du jour (sur fond clair) ») ; B et C ajoutent une ambiguïté (thème du widget ou du site ?). |
| 5. option 1, iframe | A | 9/10 | « Rien ne s'exécute dans ta page » est exactement la phrase que je cherche côté sécurité ; l'image de la fenêtre ouverte aide, le mobile est expliqué. |
| 6. option 2, script | C | 9/10 | Dit que le script « ne fait que » poser l'iframe : c'est la seule réponse à « que fait ce code chez moi ? ». À vérifier avant mise en ligne : le script ne fait réellement que ça (iframe + hauteur). |
| 7. CSP | B | 9/10 | Traduit « CSP » en clair, dit la conséquence (le navigateur bloque), et rassure si on ne sait pas ce que c'est. Structure `frame-src` puis `script-src` conservée. |
| 8. thème | B | 9/10 | « Rien à faire » d'abord, puis le cas où il faut agir (fond fixe) ; c'est le vrai piège d'un site à fond constant avec visiteur en mode sombre. |
| 9. ce que le widget affiche | B (retouché) | 8/10 | Bon angle visiteur, libellés réels. Mais « aucun suivi » n'est pas dans la liste des faits vérifiés (et l'API limite par IP, donc des IP sont au moins vues) : promesse risquée pour un lecteur prudent. **Remplacement :** `Tes visiteurs voient l'amorce d'une vanne, un bouton « Révéler la chute », un lien « Pourquoi ça marche ? » et le lien « Deviens Marrant », toujours présent. La vanne change chaque jour, la même sur tous les sites. Aucune pub, aucun cookie.` (libellés à recaler sur le texte final du widget) |
| 10. développeurs | B | 9/10 | « Pas d'iframe ? » situe tout de suite, les champs sont listés, renvoi clair vers la licence. C est plus utile avec la limite de 60 requêtes/min/IP, à ne prendre que si ce chiffre est confirmé dans le code. |
| 11. bouton « Copier » | C | 9/10 | Court (tient à côté du libellé « IFRAME » sur 320 px) et donne la marche à suivre ; A est plus précis mais trop long pour le bouton. |

## Pièges relevés (hors choix)

- « Sans cookie, sans pub » est répété partout : cohérent, mais le jour où le widget change, il faudra tout corriger (blocs 2, 3, 9).
- « Aucun suivi » (B et C du bloc 9) : à ne pas écrire sans vérification technique.
- Le lien « Deviens Marrant » obligatoire n'est dit clairement que dans les blocs 3B et 9 : le bloc 3 retouché doit rester la version qui l'annonce.
