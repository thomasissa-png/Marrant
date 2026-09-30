/**
 * Barre qualité des vannes générées (lot V7, audit s14).
 *
 * Source : docs/founder-preferences.md, dernière ligne ([CHOIX UTILISATEUR]) :
 * rien sous l'étalon Alexa. Les 4 étalons ci-dessous sont validés par Thomas.
 * Décision V6 : les assistants / IA (Alexa, ChatGPT, Siri) sont un sujet
 * autorisé s'ils servent la vanne.
 *
 * Partagé par le générateur (joke-agent, bloc system caché) et par le
 * Stand-Up Director en mode génération quotidienne (validateJoke avec
 * `dailyGeneration: true`, directorRewriteJoke). Le copy-review n'est pas
 * concerné (choix Thomas : il tourne tel quel).
 */

export const JOKE_FLOOR_ETALONS: ReadonlyArray<{ setup: string; punchline: string }> = [
  {
    setup: "J'ai dit à Alexa de me raconter une blague.",
    punchline: "Elle m'a lu mon historique de recherches.",
  },
  {
    setup: "Elle m'a demandé ce que je faisais dans la vie.",
    punchline: "J'ai dit « des erreurs, principalement ». Elle a ri. Puis elle est partie.",
  },
  {
    setup: "J'ai mis mon réveil en face du lit pour être obligé de me lever.",
    punchline: "Maintenant je dors par terre, à côté du réveil.",
  },
  {
    setup: "Mon GPS m'a dit de tourner à droite. Y'avait un fleuve.",
    punchline: "J'ai hésité. Il avait l'air sûr de lui.",
  },
];

export const JOKE_QUALITY_BAR = `BARRE PLANCHER (validée par le fondateur) : aucune vanne ne sort en dessous de ces quatre étalons.
${JOKE_FLOOR_ETALONS.map((e, i) => `${i + 1}. ${e.setup} // ${e.punchline}`).join("\n")}

Ce qu'ils ont en commun, et que ta vanne doit avoir :
- Chute surprenante, non télégraphiée : le setup ne contient aucune pièce du gag (le setup Alexa ne dit rien de l'historique). Si le lecteur peut conclure avant de lire la chute, elle est télégraphiée.
- Chute courte, qui apporte une information nouvelle.
- Logique : une fois lue, la chute paraît évidente, sans explication.
- Observation vraie : une situation que tout le monde a vécue ou pourrait vivre.
Ces étalons calibrent le niveau : n'en reprends ni l'idée, ni l'amorce, ni la chute.

Tics d'écriture exclus (relevés en série dans le catalogue) : « depuis 2019 » ou toute autre date gratuite ; « j'ai enfin compris pourquoi on dit que » et les faux proverbes introduits par « on dit que » ; « j'ai pris ma retraite pendant » ; les points de suspension (... ou …) ; les mots en capitales pour insister ; les chutes par défaut « On a rompu. », « on est allés chez sa mère », « on a commandé Uber Eats / McDo » ; une citation entre apostrophes au milieu d'un setup long.

Assistants et IA : Alexa, Siri, ChatGPT et les autres sont un sujet autorisé quand ils servent la vanne, comme dans l'étalon 1. Seule limite : ne jamais présenter la vanne ni le site comme écrits par une IA.`;
