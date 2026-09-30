# Audit vannes S14, lot B (lignes 343 à 675 de l'export)

> Produit par @copywriter le 30/09/2026. AUDIT UNIQUEMENT : aucune vanne réécrite, ni code ni base touchés.
> Référentiel : `docs/copy/charte-refonte-copy-s11.md`, `docs/copy/brand-voice.md`, méthode s11 `docs/copy/revue-vannes-seed-s11.md`.
> **Calibrage fondateur du 30/09 ([CHOIX UTILISATEUR], prime sur « doute = GARDER » pour cet audit)** : étalon plancher = « J'ai dit à Alexa de me raconter une blague. // Elle m'a lu mon historique de recherches. » (chute surprenante non télégraphiée par le setup, courte, logique, vraie observation). GARDER uniquement si la vanne est à ce niveau. En dessous avec idée solide : REECRIRE. En dessous avec idée faible : RETIRER (« sous l'étalon »).
> Source : `export-vannes-actives.txt` (Neon prod 30/09/2026), lignes 343 à 675 : 317 vannes actives (16 groupes « SETUP xN »).

**Légende.** Colonne **niv.** = niveau vs étalon : `=` au niveau, `<` en dessous. Pour GARDER : **[A]** net (étalon candidat), **[B]** limite (au niveau mais la moins tranchée, à valider par Thomas). RETIRER : motifs de la charte (calembour phonétique, constat sans twist, blessant, doublon, mention IA, variante redondante) + « sous l'étalon ». Dans un groupe « SETUP xN », la meilleure variante est indiquée ; si elle est sous l'étalon, elle est en REECRIRE (idée solide) ou RETIRER (aucune variante ne tient). Les séries à amorce quasi identique sans setup strictement identique (ex. « Mon copain m'a dit 'choisis toi le resto pour samedi'… ») sont traitées comme des groupes (charte §3 « même amorce »). Le groupe « choisis toi le resto pour samedi » compte 20 variantes dans le lot. Pour une variante redondante, `=` signifie « au niveau mais redondante ».

## 1. Synthèse

### 1.1 Comptes (317 vannes, comptés par recherche dans le tableau §2)

| Verdict | Nb | % du lot |
|---|---|---|
| GARDER (au niveau de l'étalon) | 119 | 37,5 % |
| dont [A] net (étalons candidats) | 40 | 12,6 % |
| dont [B] limite (au niveau, à valider) | 79 | 24,9 % |
| REECRIRE (idée solide, sous l'étalon) | 56 | 17,7 % |
| RETIRER | 142 | 44,8 % |
| dont variante redondante | 90 | 28,4 % |
| dont sous l'étalon (idée faible) | 28 (27 + vanne du jour) | 8,8 % |
| dont constat sans twist / blessant (3) / calembour (4) | 19 | 6,0 % |
| dont doublon (exact ou blague notoire) | 5 | 1,6 % |

**Niveau vs étalon** : `=` sur 120 vannes (119 GARDER + 1 variante redondante mais bonne), `<` sur 197 (62 %). Le nombre de vannes **nettement** au niveau est de 40 (12,6 % du lot, 18 % si l'on exclut les 95 variantes redondantes et doublons). Les [B] sont au niveau dans mon jugement mais moins tranchées : question 1 §3.

**Par origine** (prefixe d'id) : humaines/seed 118 vannes : 71 GARDER (60 %, dont 25 [A]), 28 REECRIRE, 19 RETIRER. Générées par IA 199 vannes : 48 GARDER (24 %, dont 15 [A]), 28 REECRIRE, 123 RETIRER (dont 90 variantes redondantes). Constat structurel : le gisement IA du lot est dominé par deux séries, une centaine de vannes « choisir le resto » (17 GARDER dont 4 [A], 6 REECRIRE) et une quarantaine de « vacances de la copine » (12 GARDER dont 3 [A], 8 REECRIRE), qui répètent 4 ou 5 mécanismes seulement (compromis où l'un perd, chacun chez soi, on va chez sa mère, on commande en livraison, on se sépare). Le job copy-review (25 vannes IA par jour, sans vue sur les séries) mettrait plusieurs semaines à les voir passer une par une sans jamais les comparer entre elles.

**Constat sur la revue s11** : les 5 décisions s11 qui touchent ce lot (1 RETIRER, 4 REECRIRE) ne sont pas appliquées en base (voir §4). Les 4 REECRIRE correspondants sont marqués comme tels avec renvoi vers les réécritures déjà rédigées.

### 1.2 Vanne du jour (cmn6q51i50006s60x7vbwiyna) : RETIRER, sous l'étalon

« Mon mec m'a envoyé des fleurs le jour où j'ai découvert mon allergie au pollen. // J'ai enfin compris pourquoi on dit que l'amour fait pleurer. »

- **Est-ce une expression française établie ? Non.** « L'amour fait pleurer » n'est pas un dicton figé. Les formules établies sont « l'amour rend aveugle », « l'amour fait mal / fait souffrir », « pleurer comme une madeleine ». La chute s'appuie donc sur un faux proverbe introduit par « on dit que » : le procédé existe (inventer un dicton), mais il ne produit un effet que si le lecteur reconnaît quelque chose à détourner. Ici il n'y a rien à détourner, seulement une phrase de carte de vœux.
- **La chute est-elle télégraphiée ? Oui, totalement.** Le setup contient déjà les trois pièces du raisonnement (fleurs, cadeau amoureux, allergie au pollen). Le lecteur a conclu « il pleure » avant d'arriver à la chute, qui ne fait que nommer ce qu'il a compris et l'habille d'une morale. À l'inverse, dans l'étalon Alexa, le setup ne dit rien de l'historique de recherches : la chute apporte l'information nouvelle et retourne la phrase. Ici, la chute n'apporte aucune information nouvelle.
- **Défauts secondaires** : « le jour où j'ai découvert » est une coïncidence forcée qui sert à expliquer le gag au lieu de le laisser faire ; « j'ai enfin compris pourquoi on dit que… » est un tic de fin de vanne (voir §4) ; le passage « pleurer d'allergie = pleurer d'amour » est un rapprochement gentil, pas une observation.
- **Pourquoi RETIRER et pas REECRIRE** : le gag tient en un seul mouvement (fleurs + pollen = larmes) entièrement contenu dans le setup. Sans le pivot explicite il ne reste plus de chute, donc pas de « même idée, meilleure exécution » possible. Si Thomas tient à l'idée, la seule piste est de ne rien annoncer de l'allergie et de laisser la chute porter la surprise, à valider avec lui avant toute réécriture.
- **Actions** : la sortir de la rotation « vanne du jour » ; retirer son décryptage ; et, plus important, faire passer en priorité dans copy-review toutes les vannes IA qui seront tirées comme vanne du jour dans les 14 prochains jours (ici la vanne publique la plus visible du site n'a passé aucun contrôle de barème).

### 1.3 Top 10 des meilleures (étalons candidats, ordre de préférence)

1. cmmw0togs0001mw62152nl589 : « Mon GPS m'a dit de tourner à droite. Y'avait un fleuve. // J'ai hésité. Il avait l'air sûr de lui. »
2. cmmnsqn13002xth63p57ifyqv : « N'hésite pas si tu as des questions » // « une expression, pas une invitation »
3. cmmnsqn130030th6381ol5rxt : confiant comme celui qui répond « à peu près » quand on lui demande s'il sait nager
4. cmos0sgqc000xs60wdm00lh2k : app météo 30 minutes avant la pluie / ex 30 secondes avant de me quitter
5. cmmnsqn14003kth63tvy4jb1m : « Ma copine dit que je suis trop possessif. // Enfin, MA copine. »
6. cmn85alj00004s610f14eg0re : « Ma mère m'a appelé pour me rappeler que les vacances scolaires commencent bientôt. // J'ai pas d'enfants. »
7. cmpk8cwqv00kxs60xvg0g38bs : vacances « spontanées et improvisées » // « Elle avait déjà tout réservé. »
8. cmmnsqn16008vth6325liw1pb : « Bien cordialement, Papa. » pour demander si je veux des pâtes
9. cmmnsqn16008dth63es5ylimi : pouce levé pour annoncer que mamie est à l'hôpital
10. cmmnsqn14003oth63cuch3l0w : le mode d'emploi Ikea demande si j'ai un ami disponible

À protéger : cmmnsqn15006jth63trumhoam (« bouton trier / ma mère »), déjà étalon C de la charte. Presque étalons si la chute est resserrée (REECRIRE à forte valeur) : cmpjq5c5u00b1s60xmy07gc4y (authenticité au milieu de 3000 Français), cmpjufkp800d4s60xv3rt57ac (Netflix « vous regardez encore ? »), cmmnsqn14005cth635d8xojou (loto), cmunvljrb006b2t1gcgte97k2 (« je l'évitais depuis juillet »).

### 1.4 Top 10 des pires (à sortir en premier)

1. cmqbw7t4h00bds60xqvaymwg7 : « mon pull c'est ma survie », l'exemple même de la charte (décryptage existant à retirer aussi)
2. cmpjojd3900a4s60x6mc2tykz : allusion sexuelle (« le G »), blessante et hors ton
3. cmpjplvz200aos60xuq63b4hv : insinuation d'infidélité avec « ta meilleure amie »
4. cmqd130xp00dys60x0tbzxnp9 : « J'ai gagné par KO », violence de couple banalisée (a un décryptage)
5. cmmw0touq0008mw62sk5d0cbu : avocate / avocat → guacamole, calembour
6. cmmsw18l60000rp62k1a0xxw4 : « mot de passe incorrect », blague notoire des années 2000
7. cmn8601vw000as6107gh2oopf et cmnyqfoul003ms60wa1wel8k9 : doublons exacts
8. cmp51c9u8012ds60y9ddw5iy1 : maillot de bain / « pourquoi il adore le shopping », chute obscure et sous-entendu ambigu
9. cmny0q544000ns60w0la8pnbq : « on a commandé nos ex sur Tinder », incohérente
10. cmpf1qi1p00tjs60xf1wglufv : « mon divorce » à un premier rendez-vous, incohérente
(hors classement : la vanne du jour, §1.2)

## 2. Tableau complet (ordre de l'export)

| id | verdict | niv. | motif |
|---|---|---|---|
| cmni5j2ci0000s60yenoh3kh3 | RETIRER | < | variante redondante (groupe x2 ménage ; meilleure : cmni62ad30005s60yc7qnog31) |
| cmni62ad30005s60yc7qnog31 | REECRIRE | < | meilleure du groupe x2 ; chute « pile à donner » télégraphiée par le setup (« elle trie mes affaires »), idée tient |
| cmpk7ajc900kds60xmlnhtst5 | REECRIRE | < | chute « sur Booking » illisible ; idée (3 semaines de prépa, résultat décevant) tient |
| cmmnsqn13001zth63h7s7x4td | GARDER | = | [A] fort en coussins : le raisonnement prouve l'accusation |
| cmmnsqn14003kth63tvy4jb1m | GARDER | = | [A] « Enfin, MA copine. » Chute de 3 mots, zéro explication |
| cmop0hpxm000ps60wnm5e0rb5 | RETIRER | < | sous l'étalon : « Rennes » gratuit, compromis sans mécanisme |
| cmpxm0f4l00f9s60xsbgt8jed | RETIRER | < | variante redondante (groupe x2), Picasso à Ibiza forcé |
| cmpxmjpwv00fls60xytfs3lnd | RETIRER | < | sous l'étalon : meilleure du groupe x2 mais scène sans chute (« elle lit pendant que je dors ») |
| cmmnsqn140040th63h6t50qwl | RETIRER | < | sous l'étalon : « Surtout des erreurs » est une formule connue |
| cmmnsqn13002pth63x3e3of25 | REECRIRE | < | chute floue (lien lumière/match) ; idée du romantisme littéral tient |
| cmmnsqn120005th63d0wstn6o | RETIRER | < | sous l'étalon : foot vs copine, cliché genré et prévisible |
| cmmw0tpkk000lmw62hisrlpc1 | RETIRER | < | sous l'étalon : « ce jean me grossit » est un setup cliché et daté |
| cmpjme6q80095s60xb92f1n0x | GARDER | = | [B] « j'ai éteint Netflix » : le vrai obstacle à se parler |
| cmpkcnbum00n9s60xx70d4v9x | RETIRER | < | sous l'étalon : belle-mère, vanne de tonton |
| cmpjbocge0052s60xkl485sgz | GARDER | = | [B] « arriver à l'heure quelque part » : retournement propre, un peu piquant |
| cmn3uy9tc0001s60xh9kelnrr | REECRIRE | < | setup en citation trop long ; la chute « KFC avec vue sur parking » est bonne, à garder |
| cmpk680j900jts60x0f8s7nxj | RETIRER | < | variante redondante (critères contradictoires, mieux traité par cmpk5oo5u00jhs60xjemgrcwt) ; chute Père-Lachaise floue |
| cmmnsqn12000qth634n3r3d9u | GARDER | = | [A] « Tu pourrais au moins te battre ! » |
| cmpjlv2ch008ws60xmy2ofxfr | RETIRER | < | constat sans twist (« en couple ») |
| cmpjwklcz00ebs60xcweulpsd | RETIRER | < | variante redondante (thérapie, mieux dite dans cmpjxn5jz00exs60x8kkzudcq) ; « chez mon psy » obscur |
| cmmnsqn12000yth63ldbdncyi | GARDER | = | [A] « c'est ce que j'ai cru comprendre » : la chute démontre l'accusation |
| cmpjsaee000c7s60x6zxsd4f4 | GARDER | = | [B] 47 destinations, une 48e : célibataire (chiffres intouchables) |
| cmpjhkkjh006ms60xzwivd3zv | RETIRER | < | sous l'étalon : « compte en banque » cliché |
| cmpjc7hrr005cs60x0itw06dx | RETIRER | < | calembour (« mon compte coule ») + variante redondante |
| cmpjj6ax0007js60x2hu9l96o | GARDER | = | [B] « chacun chez soi » : la séparation dite en douceur |
| cmpjghxkj006as60x5dj0py6f | GARDER | = | [B] compromis = on ira aux Seychelles ; seule « compromis » gardée (mécanisme net) |
| cmpjcqw2n005ls60xerh7xb8g | RETIRER | < | variante redondante (compromis) ; chute plus longue que le setup |
| cmogfpj2f000ts60xphhg8p9a | RETIRER | < | constat sans twist (Disneyland sans logique) |
| cmpjmxgmt009gs60x4gqufy61 | GARDER | = | [B] « allergique aux aventures à plus de 50km » (chiffre intouchable) |
| cmpjojd3900a4s60x6mc2tykz | RETIRER | < | blessant : allusion sexuelle (« le G »), hors charte « jamais vulgaire » |
| cmpjtcyxq00cis60x04io40tj | RETIRER | < | variante redondante (série « se reconnecter ») ; chute longue, « Bébé » condescendant |
| cmpjplvz200aos60xuq63b4hv | RETIRER | < | blessant : insinuation d'infidélité (« découvrir ta meilleure amie ») |
| cmpjz98oi00fvs60x2llrkfxw | REECRIRE | < | chute plus longue que le setup ; idée (changer d'avis de resto = dépaysement) tient |
| cmpjda7v0005vs60xi6a7mr15 | RETIRER | < | variante redondante (trio budget) ; constat |
| cmpjngm76009qs60xrnx7a418 | RETIRER | < | variante redondante (séparés en vacances) ; « même temps » ambigu |
| cmpjlbp1q008ks60x515jij1z | REECRIRE | < | setup long ; l'incohérence « histoire antique / 12 influenceurs à Mykonos » tient |
| cmpjq5c5u00b1s60xmy07gc4y | REECRIRE | < | chute longue ; l'idée « authenticité au milieu de 3000 Français » est très bonne (chiffre intouchable) |
| cmpjr7tf800bls60x4zojao4k | RETIRER | < | constat sans twist (galanterie mièvre) |
| cmpjin7qt007bs60xdyj8w46w | RETIRER | < | variante redondante (série « se reconnecter ») |
| cmpjuytly00des60x1ya7bta2 | RETIRER | < | variante redondante (Instagram/ex) ; reproche jaloux, twist forcé |
| cmpjufkp800d4s60xv3rt57ac | REECRIRE | < | chute longue ; « sans qu'on me demande si je regarde encore » est une vraie observation |
| cmpjp2ho600ads60x831qc8wi | GARDER | = | [B] Center Parcs puis « une pause » : double sens propre |
| cmmnsqn14004wth63yr0e48wb | GARDER | = | [B] « elle a effacé les preuves » |
| cmpjjpr4j007us60x6j3k2sre | REECRIRE | < | chute longue ; l'image « faune sauvage = Carrefour un samedi » tient |
| cmpj3qkaw004hs60xl89t1wqb | GARDER | = | [A] exotisme = RER jusqu'au bout de la ligne |
| cmmzkqckk0001s60xbczpj5it | REECRIRE | < | chute longue ; « cons ou cultivés » est bon, à garder |
| cmpk55bxy00j6s60xmqw6l9b9 | GARDER | = | [B] « Elle avait raison : … avec mon meilleur pote » |
| cmpjksbd40088s60xx8e8mlnv | REECRIRE | < | « feu vert général » flou ; idée (un oui pris pour un oui à tout) tient |
| cmpk8cwqv00kxs60xvg0g38bs | GARDER | = | [A] vacances « spontanées » déjà toutes réservées |
| cmpjx40ie00eos60x3rm3qahq | RETIRER | < | variante redondante (l'ex qui part avec un autre) ; stéréotype social « Kévin, tatouage tribal » |
| cmpji3ygi006zs60x3tqgmq2n | RETIRER | < | constat sans twist |
| cmmnsqn14005cth635d8xojou | REECRIRE | < | chute en 3 phrases (plus longue que le setup) ; l'idée du loto est forte |
| cmmnsqn12000bth63ly9menxn | GARDER | = | [B] « bizarre comme façon de commencer une conversation » |
| cmnmfl2kc0034s60w3ozrcbo9 | GARDER | = | [B] TikTok expliqué par une enfant de 8 ans, MTV (chiffres intouchables) |
| cmoc5tjrk002ds60xf8s0kte1 | GARDER | = | [A] « un cheval, ça reviendra moins cher » : logique inversée nette |
| cmoc6d7y0002gs60xo760keou | RETIRER | < | variante redondante (groupe équitation) |
| cmmw0tokr0003mw62asclqbrg | GARDER | = | [B] machine à laver, 200 chaussettes |
| cmmnsqn16008kth63pcnb9nzn | GARDER | = | [B] groupe WhatsApp de 4 personnes, « le ratio est impressionnant » |
| cmmnsqn16008gth63lr83xyep | GARDER | = | [B] article sur les dangers d'Internet, « Sur Internet. » |
| cmp9fpyd4006ys60xwsegez9e | GARDER | = | [B] Hellfest, « fait mes vaccins » |
| cmmnsqn16008qth63vr6hexls | RETIRER | < | sous l'étalon : « LOL = Lots Of Love » est un meme daté |
| cmmnsqn16008eth63r8a9p9ar | GARDER | = | [A] SMS, mail, appel : boucle absurde |
| cmn85alj00004s610f14eg0re | GARDER | = | [A] « J'ai pas d'enfants. » Meilleure du groupe x4, tout est implicite comme l'étalon A |
| cmn85c02g0006s610sehcmmpv | RETIRER | = | variante redondante (groupe x4) ; explique la chute au lieu de la laisser |
| cmn85gslk0008s610t6cb8pyn | RETIRER | < | variante redondante (groupe x4) |
| cmn8601vw000as6107gh2oopf | RETIRER | < | doublon exact de cmn85gslk0008s610t6cb8pyn |
| cmmnsqn16008uth63bu5q8yau | REECRIRE | < | chute explicative ; l'idée (la mère qui a raison sans le savoir) tient |
| cmmnsqn15006eth635cw32eye | GARDER | = | [B] « Tu peux pas mettre la guerre en pause » |
| cmmnsqn16008oth63oksjuphg | GARDER | = | [B] « On s'est regardés en silence » |
| cmmnsqn16008mth63hygzwcdf | GARDER | = | [B] blog-sante-naturelle-2008.fr : le détail précis fait la vanne |
| cmmnsqn130038th63fxn1wvhn | REECRIRE | < | chute prévisible et « répondre oui avec une main » bancal ; l'image du kebab tient |
| cmmnsqn16008cth63l24ts9hc | GARDER | = | [A] vocal de 4 minutes dont 3 de bruit de cuisine |
| cmmnsqn15007lth63h6uapxzz | REECRIRE | < | la 2e phrase explique la chute ; « J'ai ramené une pizza. » suffit presque |
| cmmsw19h3000frp629w4qd809 | REECRIRE | < | chute trop longue ; l'écart 3 heures / 3 minutes tient |
| cmmy4xm650000s60yy5opq5xk | GARDER | = | [A] « une cuite avec des bougies » |
| cmoxx7e56003xs60yyooxncw3 | GARDER | = | [B] « point rapide avant l'été » : on vote la police de caractère, détail précis |
| cmoxzvu3t004as60ym8dgb3rt | RETIRER | < | variante redondante (groupe x2) ; constat sans twist |
| cmoxw4tvd003es60yceec17oa | RETIRER | < | constat sans twist : hyperbole « j'ai pris ma retraite pendant » (cliché courant) |
| cmoxwoceb003os60yqbs5t020 | RETIRER | < | variante redondante de cmoxw4tvd003es60yceec17oa, même hyperbole « retraite » |
| cmoxvlrwv0036s60y4mjmxjlh | REECRIRE | < | setup trop long ; la chute « démissionné par cohérence avec le thème » est bonne, à garder (tiret simple à supprimer) |
| cmmnsqn15007bth63aiwuv5ky | RETIRER | < | sous l'étalon : « rient de moi, pas avec moi » est une formule usée |
| cmmnsqn15007tth639mie19s9 | GARDER | = | [A] buffet et chips : auto-dérision visuelle |
| cmmnsqn13001mth63v8g93hzp | GARDER | = | [B] vie sociale = frigo, « un truc périmé au fond » |
| cmq3c6it6005us60xwntmb0ug | REECRIRE | < | meilleure de la série « stories de vacances » (Nutella #Maldives) ; chute en 2 phrases trop longue |
| cmov11ehd000xs60wgba1rw1f | REECRIRE | < | meilleure du groupe x2 (« Toilettes Fac Droit ») ; setup trop long |
| cmov1ku0p0018s60wgy0vqe8z | RETIRER | < | variante redondante (groupe x2) |
| cmov23ysd001fs60w31v57tsu | RETIRER | < | sous l'étalon : groupe x2, aucune variante ne tient (« le plus de likes ? Le RU. » sans mécanisme) |
| cmov2ndo9001ss60wu813hkrc | RETIRER | < | variante redondante (groupe x2) ; « pieds dans l'eau » obscur |
| cmnnv5zoo0000s60yr5ox9z17 | RETIRER | < | variante redondante (série stories) |
| cmov5v0k6002cs60wxf81ju1y | RETIRER | < | calembour (palmiers / palmiers de coco) |
| cmov5brcm0022s60whgppz3os | RETIRER | < | sous l'étalon : série stories, chute « zéro like » attendue |
| cmqer3h5m00jrs60xm1b3j709 | GARDER | = | [A] barbecue de 9h vs « ma dernière relation » |
| cmokq1kj9004gs60x2j0zj29i | RETIRER | < | sous l'étalon : répartie « ta coupe de cheveux », registre tonton et condescendant |
| cmokqksa3004is60x0r2nz0uz | GARDER | = | [A] « système d'organisation par tas » : chute courte qui recadre la crise |
| cmmnsqn150073th63gkd78w5e | GARDER | = | [B] algorithme TikTok, « pleurer à 2h du mat » |
| cmmnsqn130030th6381ol5rxt | GARDER | = | [A] « à peu près » quand on demande s'il sait nager |
| cmmw0touq0008mw62sk5d0cbu | RETIRER | < | calembour (avocate / avocat → guacamole) |
| cmos0sgqc000xs60wdm00lh2k | GARDER | = | [A] météo 30 minutes avant / ex 30 secondes avant |
| cmmsw18v70004rp62oim5nci1 | GARDER | = | [A] diversifier = pâtes de 3 marques (littéral, pas un calembour) |
| cmnb0c44f0000s60zk70xwo90 | GARDER | = | [B] « j'ai évité 47 réunions inutiles » |
| cmp9jgzpg0093s60x14d1kzrr | REECRIRE | < | chute confuse (« stage principal », jeu stage/scène, fait douteux sur le Hellfest) ; idée formation dév. perso vs festival tient |
| cmorynhs1000qs60wn0o45nbk | GARDER | = | [B] luminothérapie, collègues qui bronzent |
| cmmnsqn130020th631h8pjs4m | GARDER | = | [B] « out of the box » : démission |
| cmngq32ds0000s60yp2qy44j7 | RETIRER | < | sous l'étalon : « réunion sur les réunions » cliché, chute télégraphiée par le setup |
| cmunvljrb006b2t1gcgte97k2 | REECRIRE | < | setup bavard (4 phrases, dialogue) ; chute « je l'évitais depuis juillet » bonne, à garder |
| cmunv2pry002x2t1gkuwtp6u0 | REECRIRE | < | setup trop long ; chute « Beaucoup de réunions » bonne, à garder |
| cmnl2qp5k005bs60ymde4v1jq | RETIRER | < | sous l'étalon : hyperbole « 6 mois d'arrêt », chute plate |
| cmmw0tp4o000dmw62eeksni98 | REECRIRE | < | calembour cliché : déjà jugé en s11 (id 334), réécriture déjà rédigée dans revue-vannes-seed-s11.md §3 mais l'ancienne version reste active en base |
| cmphn3okg001ss60xn4s51pu7 | GARDER | = | [A] « il est déjà en décalage horaire » |
| cmmnsqn14003tth63tsqrt8pf | GARDER | = | [B] « envoyé depuis mon iPhone » sur ordinateur fixe |
| cmmnsqn13002ith63lfni9vvz | GARDER | = | [B] « cordialement » : ton du mail vs formule |
| cmonlkgeu000ds60wu0gazutb | REECRIRE | < | setup long, chute prévisible ; l'idée (le récit de vacances interminable) tient |
| cmmnsqn150077th63gcnejji5 | GARDER | = | [B] 12 followers, énergie de 12 millions ; « Twitter » à passer en « X » (signalement) |
| cmnyvq1ps000as60x4tfbdsu3 | RETIRER | < | variante redondante (série « ça m'est égal ») ; « vegan » cliché |
| cmnywsz7p000es60xrawcupfb | RETIRER | < | variante redondante (groupe x2 ; garder cmnz0jqsx000rs60xrbrqm8kk) |
| cmnz0jqsx000rs60xrbrqm8kk | GARDER | = | [B] « chez son ex. Ça lui était égal aussi. » Meilleure du groupe x2 |
| cmnz25a3l000ws60xg5w3j6di | RETIRER | < | variante redondante (série « ça m'est égal », McDo) |
| cmnz6fs38001cs60x3cor8mm2 | GARDER | = | [A] algorithme du resto parfait : « zéro résultat » |
| cmnz12qg0000ss60x4kw0m6yp | RETIRER | < | variante redondante (série « Mon copain a créé un tableur/système… », 8 versions) |
| cmnyv6psm0008s60xe0dz71jz | RETIRER | < | variante redondante (même série) |
| cmnz2ozg9000ys60xj0bezpjj | RETIRER | < | variante redondante (même série ; 47 critères, chiffre non touché) |
| cmnyoapmo003es60w2i6dyg1o | RETIRER | < | variante redondante (même série) |
| cmnz4agne0014s60xae0x6wb1 | GARDER | = | [B] playlist « Musique d'ambiance pour se disputer » |
| cmnyadirg001zs60wut9bcmha | GARDER | = | [B] « endroit spécial » = table de ping-pong du coloc |
| cmny3xy410010s60wcf5w3znp | RETIRER | < | variante redondante (« resto de mes rêves ») ; chute floue |
| cmnz9njaq001os60x0zqb3y0o | RETIRER | < | variante redondante (application → Uber Eats) |
| cmnz81xb9001js60xla2kpmqo | RETIRER | < | variante redondante (resto fermé, cf. cmny7om5c001os60w4zkhhonz) |
| cmnypdbis003is60wer9rjhdw | RETIRER | < | variante redondante (cf. cmnylmlv40034s60wm8j9prjx, plus nette) |
| cmny62voc001js60wzmk4eylu | GARDER | = | [B] « comme des adultes responsables » → pierre-papier-ciseaux |
| cmny9u2nh001xs60wahb294co | RETIRER | < | variante redondante (groupe x2) ; « on a arrêté de sortir » cliché |
| cmnyjhd8l002ws60wngcpcib8 | REECRIRE | < | meilleure du groupe x2 (deux apps, on voit qui arrive en premier) ; chute trop longue |
| cmny2vfys000ws60wmz1ue2rj | RETIRER | < | variante redondante (série « on a trouvé la solution pour choisir un resto ») |
| cmny75eld001ms60w3bopct2y | GARDER | = | [B] « planifier notre spontanéité 3 semaines à l'avance » |
| cmnz940hl001ms60xrcnei3xw | RETIRER | < | variante redondante (série « solution ») |
| cmnydksf4002as60wrzng9jxs | RETIRER | < | variante redondante (« On a rompu. » sans construction) |
| cmnz8l58t001ls60xkvi18t76 | RETIRER | < | variante redondante ; setup bavard |
| cmnyg9rus002ls60wl4i4ity2 | RETIRER | < | variante redondante (groupe x2) ; « Tinder pour les restos » = constat |
| cmnz37u510010s60xj40i8lqu | REECRIRE | < | meilleure du groupe x2 (Uber Eats et « semblant d'être sortis ») ; idée tient, chute à resserrer |
| cmnyt1xzt0001s60x6np9296a | RETIRER | < | variante redondante (« On a rompu. ») |
| cmnyfq2s7002is60wvncm8uqm | RETIRER | < | variante redondante (série « solution ») |
| cmnxzndkl000js60wrvg4flzs | RETIRER | < | variante redondante (série « solution ») |
| cmnyaw8lp0020s60w4bkass6t | RETIRER | < | variante redondante (série « solution ») |
| cmny22cwu000ss60wy39ntzt5 | RETIRER | < | variante redondante (série « solution », McDo) |
| cmnz5wa7h001as60x71ryqm2u | RETIRER | < | variante redondante (série « solution ») |
| cmny7om5c001os60w4zkhhonz | GARDER | = | [A] « le resto parfait : celui qui était fermé » |
| cmnyd1ubl0029s60wahj70m5v | RETIRER | < | variante redondante (resto fermé, moins nette) |
| cmnxwfuf80004s60wzz03hism | GARDER | = | [B] resto qui plaît aux deux : on y commande en livraison depuis 3 mois |
| cmnyqzdws003os60wm3i48b68 | RETIRER | < | variante redondante (faux resto) |
| cmnyciiwo0026s60wnalm3nm1 | RETIRER | < | constat sans twist (« On a commandé des pizzas. ») |
| cmnxvdeto0001s60wqxmi4qnd | REECRIRE | < | meilleure du groupe x2 (Nutella devant Top Chef) ; setup long |
| cmnxvwcb00002s60w68sldv6r | RETIRER | < | variante redondante (groupe x2) |
| cmnz3r6qu0012s60xgv67paby | RETIRER | < | variante redondante (série « solution ») |
| cmnyxc5q1000gs60x64s12v8d | RETIRER | < | sous l'étalon : groupe x2, aucune variante ne tient (« se disputer en mandarin » sans mécanisme) |
| cmnyxv2fk000is60xpg1fk0s2 | RETIRER | < | variante redondante (« chez sa mère », déjà présent 6 fois) |
| cmnxwzb080006s60wehwd20ys | RETIRER | < | variante redondante (pierre-papier-ciseaux) |
| cmnxz73m4000gs60wx7i3rfsv | RETIRER | < | variante redondante (deux apps) |
| cmny1sm8k000qs60w0ojrqkq8 | RETIRER | < | variante redondante (chez les parents) |
| cmnz5dh4g0019s60xcegit6c6 | RETIRER | < | variante redondante (chez sa mère) |
| cmnz6yueh001es60xig3wefuq | RETIRER | < | variante redondante (resto fermé) |
| cmny9ade4001us60wha5u87ax | RETIRER | < | variante redondante (chez ses parents) |
| cmny06hdp000ks60wi0w6cm7f | REECRIRE | < | setup trop long ; chute « 3 ans qu'on mange que des sushis » bonne, à garder (chiffre intouchable) |
| cmny5juzk001gs60wt40gx6ye | RETIRER | < | variante redondante (pierre-papier-ciseaux) |
| cmnxyl40w000cs60wkof5qhjf | RETIRER | < | sous l'étalon : groupe x3, avis Google / parking, chute en 2 phrases |
| cmny19hxk000os60wnpf1mhfk | GARDER | = | [B] pièce truquée : les deux issues sont pour lui ; meilleure du groupe x3 |
| cmny2bkqd000us60wkn930faj | RETIRER | < | variante redondante (groupe x3) |
| cmnygsywk002ms60wyzn98ppj | RETIRER | < | variante redondante (pierre-feuille-ciseaux) |
| cmnyiy2b4002us60wz2v7q4kv | RETIRER | < | variante redondante ; « contre l'algorithme » obscur |
| cmnymowq20038s60w50h49itm | RETIRER | < | variante redondante (groupe x2, « chez sa mère ») |
| cmnz4u9rk0016s60xkpe2vn66 | RETIRER | < | sous l'étalon : groupe x2, « déjà mangé virtuellement » faible ; tiret simple à supprimer |
| cmnyeo29j002es60w3djngp5p | RETIRER | < | variante redondante ; nems au Nutella, gag sans pivot |
| cmnybfrfo0022s60whr2puvlm | GARDER | = | [B] « On ouvre nos comptes en banque. » |
| cmnyc0inc0025s60w2ebleob7 | GARDER | = | [B] app anti-dispute : on se dispute sur quelle app utiliser |
| cmqd130xp00dys60x0tbzxnp9 | RETIRER | < | blessant : « gagné par KO », violence de couple banalisée |
| cmqdbni2x00fis60xng4q08xv | RETIRER | < | sous l'étalon : groupe x3, meilleure variante mais mécanisme « compromis où l'autre perd » déjà couvert par cmpjghxkj006as60x5dj0py6f |
| cmqdc6p4p00fss60x3dqrl5vs | RETIRER | < | variante redondante (groupe x3), chute peu lisible |
| cmny51bzl001as60w0heeub51 | RETIRER | < | variante redondante (série resto) ; chute alambiquée |
| cmny6mehq001ks60wtwi7xvp3 | RETIRER | < | variante redondante (série resto) ; logique peu nette |
| cmny0q544000ns60w0la8pnbq | RETIRER | < | variante redondante ; chute incohérente (« commandé nos ex sur Tinder ») |
| cmnxxihbf0008s60we8jcauts | GARDER | = | [B] faire semblant de cuisiner, 2h de débat sur les oignons |
| cmp51c9u8012ds60y9ddw5iy1 | RETIRER | < | constat sans twist ; chute obscure, sous-entendu ambigu |
| cmmnsqn140048th6319prlc9o | GARDER | = | [B] « rien. C'était vrai. » |
| cmnye4jlw002cs60w6ha7b9aq | RETIRER | < | constat sans twist (hyperbole « le serveur a pris sa retraite ») |
| cmnylmlv40034s60wm8j9prjx | GARDER | = | [A] « sauf McDonald's » puis « du coup je sais plus » : le seul avis tombe |
| cmnz1meqe000us60xg1xtq8bj | REECRIRE | < | chute décalée (« il préférait quand j'étais indécise ») ; l'idée du choix « étoilé » pris au mot tient |
| cmnyhbsls002os60wmier5p3k | RETIRER | < | variante redondante (groupe x18 « choisis toi le resto, ça m'est égal » ; gardées : cmnysl010003us60w8y65g7u5, cmnyyxld0000ms60xi50c22mz, cmnyye90u000ks60xk1cfqz98) |
| cmnyhv8zo002qs60wphzo1npg | RETIRER | < | variante redondante (groupe x18) |
| cmnyk0fdw002ys60wvhtv1flg | RETIRER | < | variante redondante (groupe x18) |
| cmnyl2s9n0032s60w4aeiucko | RETIRER | < | variante redondante (groupe x18, « 8 premières propositions ») |
| cmnym5dog0036s60whbat1cdz | RETIRER | < | variante redondante (groupe x18, McDo) |
| cmnynr7gw003cs60wiryizub1 | RETIRER | < | variante redondante (groupe x18, « 12 premières propositions ») |
| cmnypwo2m003ks60wcgdsgmrb | RETIRER | < | variante redondante (groupe x18, « 7 » propositions) |
| cmnyqfoul003ms60wa1wel8k9 | RETIRER | < | doublon exact de cmnynr7gw003cs60wiryizub1 (même chute « 12 premières propositions ») |
| cmnyriaa1003qs60w3e1e50h3 | RETIRER | < | variante redondante (groupe x18, « 8 premières ») |
| cmnys1k10003ss60w4zhnp5ii | RETIRER | < | variante redondante (groupe x18, « 12 que j'ai proposés ») |
| cmnysl010003us60w8y65g7u5 | GARDER | = | [A] « égal ça veut dire sauf japonais, sauf indien… » : meilleure du groupe x18, redéfinit le mot |
| cmnytknz50002s60xg1k41eyc | RETIRER | < | variante redondante (groupe x18, McDonald's) |
| cmnyu3xqp0004s60xttfnom2n | RETIRER | < | variante redondante (groupe x18, « 4 premiers ») |
| cmnyung6x0006s60xmt4h3x4n | RETIRER | < | variante redondante (groupe x18, « 7 premières ») |
| cmnyw9425000cs60x9az28ycy | RETIRER | < | doublon quasi exact de cmnynr7gw003cs60wiryizub1 (« 12 premières propositions ») |
| cmnyye90u000ks60xk1cfqz98 | GARDER | = | [B] « Maintenant il a un avis. » Court ; 2e du groupe x18 |
| cmnyyxld0000ms60xi50c22mz | GARDER | = | [B] PowerPoint pour expliquer pourquoi pas celui-là : escalade absurde distincte ; 3e du groupe x18 |
| cmnz003xq000os60xnibe67x1 | RETIRER | < | variante redondante (groupe x18, « chez sa mère ») |
| cmnyn7yc4003as60w8msr0m56 | RETIRER | < | variante redondante (même amorce que le groupe x18) |
| cmnyotu7l003gs60w5r6zb5ko | RETIRER | < | variante redondante (même amorce, « 7 premiers choix ») |
| cmny880ww001qs60wy73ls68i | RETIRER | < | variante redondante (même amorce) ; « pâtes chez moi » sans twist |
| cmnz7ikid001gs60xdppocm4o | RETIRER | < | variante redondante (même amorce) ; « réservé à 14h30 » obscur |
| cmnykjzfj0030s60wl6p6ivyc | RETIRER | < | variante redondante (resto promis vs réalité) ; chute plus longue que le setup |
| cmnyif1wj002ts60wfane5u6o | REECRIRE | < | setup trop long ; la chute « Netflix en japonais sous-titré » est bonne, à garder |
| cmnxz4jr0000fs60wg0fbqt71 | GARDER | = | [B] « je rêve de McDo à 23h30 » |
| cmmnsqn130034th63ozlu7gar | REECRIRE | < | chute en 3 phrases (plus longue que le setup) ; le gag éponge puis seau tient |
| cmmnsqn14004oth63x51e4lkp | GARDER | = | [B] confiance, communication, et personne ne sait cuisiner |
| cmmnsqn13001cth639mzv79g2 | GARDER | = | [A] couple = Wi-Fi, « plus je m'éloigne, meilleure est la réception » |
| cmmnsqn15006ath63j4pqs88c | GARDER | = | [B] insulté en 4 langues : « multiculturel » |
| cmmnsqn12000kth639f52jmyj | GARDER | = | [B] « résistant au stress » = « dissocié » (ton limite santé mentale, voir signalements) |
| cmmnsqn15007hth6306tesgwv | REECRIRE | < | chute en 3 phrases, « toi non plus » attendu ; l'idée tient |
| cmmnsqn13002wth63cieza5xe | GARDER | = | [A] « La constance, c'est une qualité. » |
| cmmnsqn15006pth63x7vuov4r | GARDER | = | [B] thérapeute : progrès / espionnage |
| cmmnsqn140054th63xlwadcpq | GARDER | = | [B] ex qui bloque = relation stable ; idée « relation stable » aussi dans cmmnsqn15007lth63h6uapxzz |
| cmmnsqn14004gth636ovkgmvn | GARDER | = | [B] « Tu trouveras mieux que moi » : accord unique |
| cmp66iwpt000hs60xp59ovw02 | REECRIRE | < | chute tarabiscotée (bricoler ses profils Tinder) ; l'idée de l'ex qui reproche tient |
| cmpncsdnf000ls60wrwdtsfqe | GARDER | = | [B] Chandeleur : « le jour où papa a arrêté de les rater » |
| cmmw0togs0001mw62152nl589 | GARDER | = | [A] GPS, fleuve, « il avait l'air sûr de lui » |
| cmmnsqn15006mth634iq7quu4 | REECRIRE | < | formule « X, c'est comme Y : » prévisible ; l'idée du backlog Steam tient |
| cmmnsqn15006jth63trumhoam | GARDER | = | [A] « un bouton trier / ma mère » : c'est l'étalon (C) de la charte, à protéger |
| cmmw0tpug000qmw62f7w76zr5 | GARDER | = | [A] « Surprise. » |
| cmmnsqn14003sth63puzhcve5 | REECRIRE | < | « Bien m'en a pris. » explique la chute ; l'idée tient |
| cmmnsqn13001qth63js2tsd3o | REECRIRE | < | chute plus longue que le setup, cynisme sur le prix du diamant peu lisible ; idée diamant vs voyage tient |
| cmny8rl04001ts60wk0tbueei | RETIRER | < | variante redondante (« resto de tes rêves ») ; « au lit » ambigu |
| cmn6q51i50006s60x7vbwiyna | RETIRER | < | **vanne du jour** : sous l'étalon, chute télégraphiée par le setup et faux proverbe ; voir verdict argumenté en synthèse §1 |
| cmmnsqn13002hth63tuo6m58y | RETIRER | < | sous l'étalon : Nutella/cornichons, comparaison finale « comme notre couple » floue |
| cmmsw18l60000rp62k1a0xxw4 | RETIRER | < | doublon : blague notoire (« mot de passe incorrect », circule depuis les années 2000), même critère que l'escargot retiré en s11 |
| cmmnsqn13002sth63de7o3ohu | REECRIRE | < | la comparaison est donnée dans le setup, la chute « 3% » n'est qu'un détail ; idée tient |
| cmmnsqn14003oth63cuch3l0w | GARDER | = | [A] Ikea : « avez-vous un ami disponible » |
| cmmnsqn13002qth632dhoo7r6 | GARDER | = | [B] « on est une famille » / héritage |
| cmmnsqn120006th633634ej4h | REECRIRE | < | chute trop longue ; la vraie chute « personne d'autre ne voulait le poste » tient |
| cmmnsqn15006dth63toy9o1m9 | RETIRER | < | sous l'étalon : constat en énumération, aucun retournement |
| cmmsw18z60006rp62o0i371pa | RETIRER | < | sous l'étalon : boucle « plan de carrière = plan », chute molle |
| cmmnsqn15006hth6314l5jpfn | REECRIRE | < | jargon (hardstuck) et chute longue ; « le point commun c'est lui » tient |
| cmmnsqn150089th63z1c0ella | RETIRER | < | constat sans twist : anecdote deux enceintes |
| cmp7v80w40037s60x0c5052rf | GARDER | = | [B] « j'ai dit oui… en 2019 » ; tic « 2019 » récurrent (voir signalements) |
| cmo25lngy002ls60xm6vjioc3 | GARDER | = | [B] 20 minutes sur une œuvre profonde : c'était le plan d'évacuation |
| cmmnsqn150084th63lmtza2y7 | GARDER | = | [B] « tranquille, 10 personnes » : on était 47 |
| cmp0qhm9f009ns60ykaw7rg5j | RETIRER | < | constat sans twist : riposte « nous on a de l'eau » floue, cliché régional |
| cmn5aauwo0001s60y4x490kst | REECRIRE | < | setup en longue citation, saisonnier (« Mars ») ; la chute « depuis 2019 c'était la salle » tient |
| cmmnsqn14005sth63dts5es5e | REECRIRE | < | « La vie est un scam » : cliché de conclusion, déjà jugé en s11 (id 209), version réécrite prête, non appliquée en base |
| cmmnsqn15007fth632iq057qg | GARDER | = | [B] photos d'il y a 5 ans : « les filles matchent avec son passé » |
| cmmnsqn15007kth63akt2cpao | RETIRER | < | calembour phonétique assumé (Solange), sous l'étalon |
| cmmnsqn15005yth637l317llm | GARDER | = | [B] la triche m'a mené jusqu'en terminale |
| cmmnsqn14005nth6304gbz1il | GARDER | = | [B] pas de questions bêtes : « il a changé d'avis » |
| cmqbw7t4h00bds60xqvaymwg7 | RETIRER | < | constat sans twist : « mon pull c'est ma survie » est l'exemple cité par la charte §3 |
| cmmnsqn14005kth63pdujihby | REECRIRE | < | répartie « zéro c'est quelqu'un » illisible, setup bavard ; idée élève puni pour insolence tient |
| cmmnsqn14005vth63fepwxuvs | GARDER | = | [B] Descartes / rattrapages |
| cmmsw19b4000crp62vp792lgr | RETIRER | < | sous l'étalon : « remettez tout en question » est télégraphié et connu |
| cmmnsqn15007pth630tpqyqo2 | GARDER | = | [B] Hinge : mot de passe Netflix |
| cmmnsqn120001th63ryms5sxv | GARDER | = | [A] « les autres n'ont pas ce problème » |
| cmmnsqn16008rth63rmwonvrd | REECRIRE | < | amorce doublon avec cmmnsqn16008dth63es5ylimi, déjà jugé en s11 (id 316), version prête, non appliquée en base |
| cmmnsqn16008dth63es5ylimi | GARDER | = | [A] pouce levé pour dire que mamie est à l'hôpital |
| cmmnsqn16008tth63jvmxpvsw | GARDER | = | [A] flash sur le soleil |
| cmmnsqn16008nth63yy4p9dds | RETIRER | < | sous l'étalon : constat en énumération (front, plafond, doigt) |
| cmmnsqn16008pth635hs1cz7x | GARDER | = | [B] « de mon temps » / Google Maps |
| cmmw0tpoi000nmw621aytd6if | GARDER | = | [A] « c'est nul », puis envoyé à toute la famille |
| cmmnsqn16008hth63dz46jchf | GARDER | = | [B] WhatsApp sur tablette : 10 minutes + 2h50 (chiffres intouchables) |
| cmmnsqn16008jth63zwal8rzj | REECRIRE | < | la chute en majuscules explique le gag ; idée tient |
| cmmnsqn16008lth63mw3tta9a | GARDER | = | [B] tutos YouTube, la famille sait réparer une chasse d'eau |
| cmmnsqn16008vth6325liw1pb | GARDER | = | [A] « Bien cordialement, Papa. » pour des pâtes |
| cmmnsqn16008fth630hmz4i44 | RETIRER | < | sous l'étalon : « google » dans Google, cliché et « l'univers a failli imploser » |
| cmmnsqn150061th63sce1mq4n | GARDER | = | [B] relevé de notes = météo |
| cmmsw19j2000grp629lpuaber | GARDER | = | [B] réveil à 6h, objectifs reportés à 6h01 |
| cmmnsqn15006tth63jaiyuhtq | REECRIRE | < | « Même lui est ironique » explique ; la notif de félicitations suffit |
| cmmnsqn130019th6305olo4bl | GARDER | = | [B] téléphone : mémoire de trucs à oublier |
| cmpw4zn5n00b3s60xonhfk4bc | GARDER | = | [B] clim « temporaire » / ma motivation ; tic « 2019 » |
| cmpkbkua200mis60xj8w7jkkv | RETIRER | < | variante redondante (« on reste à la maison ») ; « négociations intensives » jargon |
| cmpkd6o6100nls60x0ie36vaz | GARDER | = | [A] « Le canapé. » Chute d'un mot, tout est dit |
| cmpjtw7ga00css60xddyh218w | RETIRER | < | variante redondante (« chez ses parents » déjà présent 6 fois) |
| cmpk5oo5u00jhs60xjemgrcwt | REECRIRE | < | setup trop long, ancrage local (Quiberon) ; le triplet de demandes contradictoires tient |
| cmpk0v0dy00grs60xhkyg43y8 | RETIRER | < | variante redondante (cf. cmpk5oo5u00jhs60xjemgrcwt) |
| cmpjvi41x00dqs60xaer2tn7s | RETIRER | < | variante redondante (séparés) ; chute plus longue que le setup |
| cmpjrr3zm00bvs60xtprnjtlu | RETIRER | < | variante redondante (« chacun chez soi », cf. cmpjj6ax0007js60x5dj0py6f) |
| cmpjxn5jz00exs60x8kkzudcq | GARDER | = | [B] 4 heures sur Booking : « on a booké une thérapie de couple » |
| cmmnsqn12000mth6397kypxfn | GARDER | = | [A] « rester soi-même » : « visiblement c'est le problème » |
| cmmnsqn13001uth639tf4f1md | GARDER | = | [B] ordonnance et fou rire |
| cmmw0tpil000kmw62esb9knd2 | GARDER | = | [B] entretien : « j'en ai rien à faire de votre avis » |
| cmmw0tpcl000hmw62wccbbdep | GARDER | = | [A] « j'évite ce genre de question, principalement » |
| cmmnsqn14004pth63dox3pppx | REECRIRE | < | la chute explique la métaphore du crabe ; l'idée tient |
| cmmnsqn15007ath63muk0ao8y | GARDER | = | [B] 200 swipes, 3 matchs, 0 réponse (chiffres intouchables) |
| cmmnsqn15007mth63nediuq1b | GARDER | = | [B] « je m'y attends pas depuis 3 ans » |
| cmmnsqn13001dth63uqf7nvks | GARDER | = | [B] « compétitif avec le SMIC » |
| cmpf1qi1p00tjs60xf1wglufv | RETIRER | < | variante redondante (rendez-vous au musée) ; chute incohérente (« mon divorce » à un premier rendez-vous) |
| cmpf175o700t6s60xzxzb9ndt | REECRIRE | < | chute longue, tiret cadratin dans le texte en base ; l'idée « profil Tinder = œuvre abstraite » tient |
| cmmnsqn14004fth63wk1j03mn | REECRIRE | < | chute plus longue que le setup, reprise du meme « quand un Anglais dit… » |
| cmmnsqn150071th63sc5bk82f | GARDER | = | [A] « premier » : le premier était aussi le dernier et le seul |
| cmmw0tpam000gmw62dzwlhyem | GARDER | = | [B] « merci, j'ai travaillé dur pour ça » |
| cmmnsqn15006uth63x8q44hwo | GARDER | = | [B] unfollow : « je le prends personnellement » |
| cmmnsqn12000fth635t0fhl9m | REECRIRE | < | setup en « si tu te sens inutile » long, deux exemples empilés ; l'idée des métiers inutiles tient |
| cmmnsqn15007eth63cwyet2ca | RETIRER | < | sous l'étalon : chute explicative et triste, setup genré daté (« la fille doit écrire en premier ») |
| cmmnsqn150067th63i6tpp8eu | GARDER | = | [B] pseudo Discord / peur des araignées |
| cmmnsqn15007qth63wv7totez | GARDER | = | [B] « quelqu'un qui répond en moins de 3 jours » |
| cmmnsqn13001rth63r79ar7bu | GARDER | = | [B] LinkedIn : passionnés par le vendredi |
| cmmnsqn14003vth63i2are7es | REECRIRE | < | chute en définition ; l'observation « il faudrait qu'on se fasse un truc » est vraie |
| cmmwpnc9h0000s60zse4nyp4h | GARDER | = | [A] « boire pour oublier des trucs qu'on a jamais appris » |
| cmmnsqn120007th63zs2m9dcv | RETIRER | < | sous l'étalon : « Tu sais que t'es adulte » (amorce ×3), énumération sans retournement |
| cmmnsqn130031th63toyp4txh | RETIRER | < | sous l'étalon : « Tu sais que tu es vieux » (amorce ×3), cliché daté |
| cmmnsqn13001fth63rfq7zvht | REECRIRE | < | amorce « Tu sais que » ×3 ; le bruit en s'asseyant puis en se levant tient |
| cmmnsqn12000wth63klmln2pr | RETIRER | < | doublon : blague notoire (escargot), déjà décidée RETIRER en s11 (id 33), toujours active en base |
| cmmnsqn13001nth636f3y0775 | GARDER | = | [B] GPS : « réfléchissez à votre vie » |
| cmmnsqn120002th63g1nzbeg4 | REECRIRE | < | format « Un homme entre dans… » interdit ; déjà jugé en s11 (id 3), version prête, non appliquée en base |
| cmmnsqn120012th63o1ifiel6 | GARDER | = | [B] drap-housse et chaussettes orphelines |
| cmmw0tpel000imw62cf03b00x | GARDER | = | [A] « mes condoléances » |
| cmparen2500jes60xbmkw1jhb | RETIRER | < | constat sans twist (« lequel des 47 ? ») ; ancrage local |
| cmpashfqo00jys60xpa5nzkyo | RETIRER | < | variante redondante (« le vieux Vannes », cf. cmpary82p00jns60x1y34axz4) |
| cmpary82p00jns60x1y34axz4 | GARDER | = | [B] « Ah parfait, c'est mon père. » Retournement réel ; ancrage local (Vannes) |
| cmpav5z7d00kas60x48h8sea1 | RETIRER | < | variante redondante (touriste à Vannes) ; « chez mon ex » sans logique |
| cmpavp7so00kjs60x4q3u4ckj | GARDER | = | [B] « authentique… même les prix » ; ancrage local (Vannes) |
| cmp9u6qw900ews60xn04lin8k | REECRIRE | < | mention d'un festival réel et prix non vérifiable (chiffre intouchable, à signaler) ; l'image « payer pour découvrir qu'on préfère Spotify » tient |
| cmmnsqn16008bth639v3z2ysb | REECRIRE | < | chute en 3 phrases (plus longue que le setup) ; l'idée du récit qui s'embellit tient |
| cmmnsqn13002xth63p57ifyqv | GARDER | = | [A] « une expression, pas une invitation » |
| cmmnsqn14005dth63tkk1ftot | REECRIRE | < | chute trop longue ; « le baby-foot remplace la prime » tient |

## 3. Questions pour Thomas (3 max)

1. **Que fait-on des 79 vannes [B] « au niveau, mais limite » ?** Mon barème est sévère sur les chutes télégraphiées et longues, mais [B] reste subjectif (ex. cmmnsqn13002qth632dhoo7r6 « héritage », cmoxx7e56003xs60yyooxncw3 « police de caractère », cmmnsqn15007mth63nediuq1b « 3 ans »). Reco : garder les 40 [A] comme socle certain, laisser les [B] actives mais hors du job copy-review et hors « vanne du jour » tant que tu ne les as pas tranchées, et me faire valider 10 [B] à l'aveugle (je te les liste) pour recaler la barre avant de généraliser aux 373 vannes IA.
2. **Plafond par thème/amorce et sens de « RETIRER ».** Le générateur a produit une centaine de vannes « resto » (dont une vingtaine de « choisis toi le resto pour samedi… ») et une quarantaine de « vacances de la copine ». Reco : plafond dur de 3 vannes actives par amorce et 6 par thème, RETIRER = désactivation réversible (jamais suppression, favoris et votes conservés), et un correctif générateur (mémoire des amorces/thèmes déjà en base) sinon la série repousse chaque nuit.
3. **Ancrage local et saisonnier : on garde ?** ~12 vannes IA sont ancrées dans le Morbihan (Quiberon, Ploërmel, « le vieux Vannes », Bretagne) et ~60 parlent de vacances d'été/Pâques alors qu'on est le 30/09. Reco : ne garder que celles dont la chute marche sans connaître le lieu (seules cmpary82p00jns60x1y34axz4 et cmpavp7so00kjs60x4q3u4ckj le font, gardées en [B]) et mettre les vannes saisonnières en réserve hors saison, à réactiver en juin.

## 4. Signalements (rien n'a été modifié)

- **Décisions s11 non appliquées en base** (constaté sur l'export du 30/09) : escargot cmmnsqn12000wth63klmln2pr (retirer, id 33), « La vie est un scam » cmmnsqn14005sth63dts5es5e (id 209), « transfert » WhatsApp cmmnsqn16008rth63rmwonvrd (id 316), coiffeur cmmw0tp4o000dmw62eeksni98 (id 334), bibliothèque cmmnsqn120002th63g1nzbeg4 (id 3) sont toujours actives dans leur ancienne version. Les réécritures existent dans `revue-vannes-seed-s11.md` §3 (à appliquer, pas à refaire). Un grep sur `docs/content/blagues-seed.json` montre en plus que bibliothèque et « transfert » y sont encore en ancienne version : à vérifier par @fullstack.
- **Blessantes ou limites** (RETIRER) : cmpjojd3900a4s60x6mc2tykz (allusion sexuelle), cmpjplvz200aos60xuq63b4hv (infidélité), cmqd130xp00dys60x0tbzxnp9 (« gagné par KO », violence de couple). Limites conservées : cmmnsqn14003kth63tvy4jb1m (« trop possessif » : la chute retourne l'accusation, le décryptage doit cadrer l'ironie), cmmnsqn12000kth639f52jmyj (« dissocié » : banalise un terme clinique). Stéréotype social : cmpjx40ie00eos60x3rm3qahq (« Kévin, tatouage tribal »), cmokq1kj9004gs60x2j0zj29i (registre tonton envers un ado).
- **Genrées ou datées** : cmmnsqn120005th63d0wstn6o (foot vs copine), cmmw0tpkk000lmw62hisrlpc1 (« ce jean me grossit »), cmmnsqn15007eth63cwyet2ca (Bumble), cmmnsqn16008qth63vr6hexls (« LOL = Lots Of Love »), cmmnsqn150077th63gcnejji5 (« Twitter » devenu X, gardée [B], à faire relire), cmmsw18l60000rp62k1a0xxw4 (blague notoire).
- **Incohérentes ou illisibles** : cmpf1qi1p00tjs60xf1wglufv (« mon divorce » à un premier rendez-vous), cmny0q544000ns60w0la8pnbq (« commandé nos ex sur Tinder »), cmpk7ajc900kds60xmlnhtst5 (« sur Booking »), cmpjksbd40088s60xx8e8mlnv (« feu vert général »), cmmnsqn14005kth63pdujihby (« zéro c'est quelqu'un »), cmp9jgzpg0093s60x14d1kzrr (« stage principal » du Hellfest, fait douteux).
- **Tics d'écriture IA à surveiller dans le générateur** : « depuis 2019 » (cmp7v80w40037s60x0c5052rf, cmn5aauwo0001s60y4x490kst, cmpw4zn5n00b3s60xonhfk4bc), « j'ai enfin compris pourquoi on dit que » (vanne du jour), « j'ai pris ma retraite pendant » (×3), « chez sa mère / chez ses parents » (×9), « On a rompu. » comme chute (×3), « Uber Eats / McDo » (~30), citation entre apostrophes sur setup long.
- **Typographie dans le texte en base** : tiret cadratin dans cmpf175o700t6s60xzxzb9ndt et cmmnsqn12000wth63klmln2pr ; tirets simples espacés faisant office de cadratin dans cmoxvlrwv0036s60y4mjmxjlh et cmnz4u9rk0016s60xkpe2vn66 (règle 12).
- **Chiffres signalés, non touchés** : « 80€ » (cmp9u6qw900ews60xn04lin8k, prix de festival non vérifié) ; toutes les autres valeurs numériques (47, 3000, 200, 10 min / 2h50, 12 followers…) sont laissées telles quelles.
- **Décryptages** : les vannes conservées par l'audit qui ont `décryptage=non` (séries IA resto/vacances) ne sont pas exploitables « À toi de jouer » : à produire seulement après validation du barème. Le décryptage de la vanne du jour (`décryptage=oui`) est à retirer avec elle.
