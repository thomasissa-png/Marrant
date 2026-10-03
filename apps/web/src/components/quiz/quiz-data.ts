// ─── Quiz Viral "Quel type d'humour es-tu ?" ─────────────────────────
// 12 questions, 5 profils de style d'humour.
// Chaque réponse attribue des points aux profils.

export interface QuizQuestion {
  question: string;
  options: {
    label: string;
    emoji: string;
    scores: Partial<Record<HumorProfileType, number>>;
  }[];
}

export type HumorProfileType =
  | "OBSERVATEUR"
  | "STORYTELLER"
  | "ABSURDE"
  | "PUNCHLINEUR"
  | "TAQUIN";

export interface HumorProfileResult {
  type: HumorProfileType;
  title: string;
  humoriste: string;
  emoji: string;
  description: string;
  strength: string;
  tip: string;
  color: string;
  recommendedPath: string;
}

export const QUIZ_PROFILES: Record<HumorProfileType, HumorProfileResult> = {
  OBSERVATEUR: {
    type: "OBSERVATEUR",
    title: "L'Observateur",
    humoriste: "observation précise",
    emoji: "🔍",
    description:
      "Tu remarques ce que tout le monde a sous les yeux sans jamais le voir : le collègue qui imprime un mail pour le relire, puis le scanne pour te le renvoyer, le groupe de messages qui s'appelle encore « Anniv de Julie », des années après la fête. Une phrase bien placée te suffit.",
    strength: "Tes vannes tombent juste parce qu'elles parlent de choses que les autres ont vécues, mais jamais formulées.",
    tip: "Note une observation drôle par jour dans ton téléphone. En 1 mois, tu as un stock que personne d'autre n'a.",
    color: "#22C55E",
    recommendedPath: "/conseils",
  },
  STORYTELLER: {
    type: "STORYTELLER",
    title: "Le Storyteller",
    humoriste: "récit qui monte",
    emoji: "📖",
    description:
      "Chez toi, un trajet en bus devient une épopée en trois actes. Tu fais monter la tension tranquillement, avec l'air de ne pas y toucher, et les autres attendent la suite.",
    strength: "Quand tu racontes, les téléphones restent dans les poches, même celui qui vibre.",
    tip: "Construis tes anecdotes en 3 temps : une situation banale, un détail qui cloche, puis une chute que personne n'a vue venir.",
    color: "#8B5CF6",
    recommendedPath: "/parcours",
  },
  ABSURDE: {
    type: "ABSURDE",
    title: "L'Absurde",
    humoriste: "surprise permanente",
    emoji: "🌀",
    description:
      "Tu relies des idées que personne n'aurait mises dans la même phrase, et tu le fais avec un sérieux total. Les autres ne savent jamais où tu vas, toi non plus parfois, et c'est exactement ce qui les fait rire.",
    strength: "Ton humour est difficile à imiter : c'est 100% toi, et ça s'entend.",
    tip: "Quand une blague évidente te vient, garde-la et pousse-la un cran plus loin dans l'absurde. Le premier réflexe est rarement le plus drôle.",
    color: "#EC4899",
    recommendedPath: "/videos",
  },
  PUNCHLINEUR: {
    type: "PUNCHLINEUR",
    title: "Le Punchlineur",
    humoriste: "mot juste et silences",
    emoji: "💥",
    description:
      "Tu parles peu, mais quand tu parles, la table se tait une seconde avant de rire. Tu sais te servir d'un silence, rire de toi sans te démolir et couper ta phrase au bon mot.",
    strength: "Tu fais rire en 10 mots là où d'autres en mettent 50, et chez eux, les mots en trop sont souvent des « en fait ».",
    tip: "Relis chaque vanne et enlève tous les mots qui ne servent pas la chute. La version la plus courte est presque toujours la meilleure.",
    color: "#EF4444",
    recommendedPath: "/vannes",
  },
  TAQUIN: {
    type: "TAQUIN",
    title: "Le Taquin",
    humoriste: "répartie complice",
    emoji: "😏",
    description:
      "Tu rebondis sur tout, tu chambres sans jamais viser en dessous de la ceinture, et la personne que tu taquines finit souvent par rire plus fort que les autres.",
    strength: "En conversation, tu renvoies chaque balle, et on a toujours envie de t'en lancer une autre.",
    tip: "Travaille le « oui, et… » de l'impro : au lieu de contredire, prends ce que l'autre vient de dire et emmène-le plus loin.",
    color: "#F59E0B",
    recommendedPath: "/conseils",
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "En soirée, t'es plutôt...",
    options: [
      {
        label: "Tu observes en silence, puis tu places la vanne au bon moment",
        emoji: "🎯",
        scores: { OBSERVATEUR: 3, PUNCHLINEUR: 1 },
      },
      {
        label: "Tu racontes une anecdote et tout le monde écoute",
        emoji: "🎙️",
        scores: { STORYTELLER: 3, ABSURDE: 1 },
      },
      {
        label: "Tu sors un truc tellement inattendu que tout le monde rit, toi compris",
        emoji: "🤯",
        scores: { ABSURDE: 3, TAQUIN: 1 },
      },
      {
        label: "Tu chambres tout le monde, avec tendresse",
        emoji: "😏",
        scores: { TAQUIN: 3, OBSERVATEUR: 1 },
      },
    ],
  },
  {
    question: "Ta vanne idéale, c'est...",
    options: [
      {
        label: "Une observation que tout le monde vit mais personne n'a formulée",
        emoji: "💡",
        scores: { OBSERVATEUR: 3, STORYTELLER: 1 },
      },
      {
        label: "Une histoire qui monte, qui monte… jusqu'à la chute que personne n'attendait",
        emoji: "📈",
        scores: { STORYTELLER: 3, PUNCHLINEUR: 1 },
      },
      {
        label: "Un truc tellement absurde que tu ris avant d'avoir compris pourquoi",
        emoji: "🦄",
        scores: { ABSURDE: 3, TAQUIN: 1 },
      },
      {
        label: "Une punchline courte, sans un mot de trop",
        emoji: "⚡",
        scores: { PUNCHLINEUR: 3, OBSERVATEUR: 1 },
      },
    ],
  },
  {
    question: "Quand quelqu'un te chambre...",
    options: [
      {
        label: "Tu encaisses, et tu gardes la réponse pour le bon moment",
        emoji: "📝",
        scores: { OBSERVATEUR: 2, PUNCHLINEUR: 2 },
      },
      {
        label: "Tu en fais une histoire encore plus drôle",
        emoji: "🎬",
        scores: { STORYTELLER: 3, ABSURDE: 1 },
      },
      {
        label: "Tu pars dans un délire complètement à côté",
        emoji: "🚀",
        scores: { ABSURDE: 3, STORYTELLER: 1 },
      },
      {
        label: "Tu renvoies la pique à l'expéditeur en 2 secondes",
        emoji: "🪃",
        scores: { TAQUIN: 3, PUNCHLINEUR: 1 },
      },
    ],
  },
  {
    question: "Si tu devais piquer une technique aux pros de la scène...",
    options: [
      {
        label: "La simplicité et la précision",
        emoji: "🎯",
        scores: { OBSERVATEUR: 3 },
      },
      {
        label: "Le naturel et l'escalade comique",
        emoji: "✨",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Les surprises et les pivots permanents",
        emoji: "🌀",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Les silences et l'autodérision",
        emoji: "💥",
        scores: { PUNCHLINEUR: 3 },
      },
    ],
  },
  {
    question: "À la machine à café...",
    options: [
      {
        label: "Tu fais une remarque sur un truc absurde du bureau",
        emoji: "🏢",
        scores: { OBSERVATEUR: 3, TAQUIN: 1 },
      },
      {
        label: "Tu racontes ton week-end comme un épisode de série",
        emoji: "🎭",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Tu racontes à voix haute le chaos du bureau le jour où la machine lâchera",
        emoji: "🔥",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Tu lances une pique amicale au premier qui passe",
        emoji: "🎪",
        scores: { TAQUIN: 3, PUNCHLINEUR: 1 },
      },
    ],
  },
  {
    question: "Quand tu regardes un sketch, tu retiens...",
    options: [
      {
        label: "Les détails hyper précis qui rendent ça réaliste",
        emoji: "🔬",
        scores: { OBSERVATEUR: 3 },
      },
      {
        label: "La structure de l'histoire et comment il amène la chute",
        emoji: "🧩",
        scores: { STORYTELLER: 3, PUNCHLINEUR: 1 },
      },
      {
        label: "Le moment où ça part dans une direction que tu n'avais pas vue venir",
        emoji: "😱",
        scores: { ABSURDE: 3 },
      },
      {
        label: "La punchline, que tu ressors dès le lendemain",
        emoji: "🗣️",
        scores: { TAQUIN: 2, PUNCHLINEUR: 2 },
      },
    ],
  },
  {
    question: "Par message, t'es plutôt...",
    options: [
      {
        label: "Captures d'écran de panneaux et d'étiquettes absurdes croisés dans la journée",
        emoji: "📸",
        scores: { OBSERVATEUR: 3 },
      },
      {
        label: "Pavés sur ta journée, que tes potes lisent jusqu'au bout",
        emoji: "📱",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Réponses tellement à côté que tes potes relisent leur propre message",
        emoji: "🤪",
        scores: { ABSURDE: 3, TAQUIN: 1 },
      },
      {
        label: "Une ligne, pas plus, et elle suffit",
        emoji: "💬",
        scores: { PUNCHLINEUR: 3, TAQUIN: 1 },
      },
    ],
  },
  {
    question: "Quand t'es stressé(e), tu...",
    options: [
      {
        label: "Tu relativises en pointant l'absurdité de la situation",
        emoji: "🤷",
        scores: { OBSERVATEUR: 2, ABSURDE: 2 },
      },
      {
        label: "Tu racontes ton stress comme la bande-annonce d'un film catastrophe",
        emoji: "🎥",
        scores: { STORYTELLER: 3, ABSURDE: 1 },
      },
      {
        label: "Tu fais un truc complètement décalé pour détendre l'atmosphère",
        emoji: "🎉",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Tu lâches une vanne pince-sans-rire, et la pression retombe",
        emoji: "🎯",
        scores: { PUNCHLINEUR: 3, TAQUIN: 1 },
      },
    ],
  },
  {
    question: "En rencard, tu mises sur...",
    options: [
      {
        label: "Des remarques fines sur ce qui se passe autour de vous",
        emoji: "👀",
        scores: { OBSERVATEUR: 3, TAQUIN: 1 },
      },
      {
        label: "Des anecdotes bien racontées qui montrent ta personnalité",
        emoji: "✨",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Des associations d'idées si inattendues qu'on en oublie son assiette",
        emoji: "🌈",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Du tac au tac, jusqu'à ce que vous ayez vos blagues à vous",
        emoji: "⚡",
        scores: { TAQUIN: 3, PUNCHLINEUR: 1 },
      },
    ],
  },
  {
    question: "Tes potes diraient...",
    options: [
      {
        label: "Qu'aucun détail ne t'échappe, même ceux qu'on aurait préféré cacher",
        emoji: "🦉",
        scores: { OBSERVATEUR: 3 },
      },
      {
        label: "Que c'est toi qu'on appelle pour raconter la soirée à ceux qui n'étaient pas là",
        emoji: "🌟",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Qu'on ne sait jamais ce que tu vas sortir, et que c'est pour ça qu'on t'invite",
        emoji: "🎰",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Que tu as toujours le dernier mot, même dans le groupe de la famille",
        emoji: "👑",
        scores: { PUNCHLINEUR: 2, TAQUIN: 2 },
      },
    ],
  },
  {
    question: "Si tu devais écrire un sketch, ce serait sur...",
    options: [
      {
        label: "Les trucs absurdes qu'on fait tous sans s'en rendre compte",
        emoji: "🔍",
        scores: { OBSERVATEUR: 3, STORYTELLER: 1 },
      },
      {
        label: "Une mésaventure personnelle transformée en épopée",
        emoji: "📚",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Une idée complètement barrée, défendue jusqu'au bout avec le plus grand sérieux",
        emoji: "💫",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Un enchaînement de punchlines sur un thème précis",
        emoji: "🔥",
        scores: { PUNCHLINEUR: 3, TAQUIN: 1 },
      },
    ],
  },
  {
    question: "Ta devise, ce serait...",
    options: [
      {
        label: "\"Le diable est dans les détails, et les vannes aussi\"",
        emoji: "🔎",
        scores: { OBSERVATEUR: 3 },
      },
      {
        label: "\"Tout est une histoire, il suffit de bien la raconter\"",
        emoji: "📖",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "\"Si c'est pas bizarre, c'est pas assez drôle\"",
        emoji: "🎪",
        scores: { ABSURDE: 3 },
      },
      {
        label: "\"Une bonne réplique vaut mieux qu'un long discours\"",
        emoji: "⚡",
        scores: { PUNCHLINEUR: 2, TAQUIN: 2 },
      },
    ],
  },
];

export function computeQuizResult(
  answers: Partial<Record<HumorProfileType, number>>[],
): HumorProfileType {
  const totals: Record<HumorProfileType, number> = {
    OBSERVATEUR: 0,
    STORYTELLER: 0,
    ABSURDE: 0,
    PUNCHLINEUR: 0,
    TAQUIN: 0,
  };

  for (const answer of answers) {
    for (const [profile, score] of Object.entries(answer)) {
      totals[profile as HumorProfileType] += score;
    }
  }

  return (Object.entries(totals) as [HumorProfileType, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
}
