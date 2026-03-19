// ─── Quiz Viral "Quel type d'humour es-tu ?" ─────────────────────────
// 12 questions, 5 profils inspirés d'humoristes français.
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
    humoriste: "Roman Frayssinet",
    emoji: "🔍",
    description:
      "Tu repères les détails absurdes du quotidien que personne ne voit. Ton humour vient de l'observation chirurgicale — une phrase suffit pour faire mouche.",
    strength: "Tes vannes sont toujours pertinentes parce qu'elles parlent de la vraie vie.",
    tip: "Entraîne-toi à noter une observation drôle par jour dans ton téléphone. En 1 mois, tu auras un répertoire.",
    color: "#22C55E",
    recommendedPath: "/conseils",
  },
  STORYTELLER: {
    type: "STORYTELLER",
    title: "Le Storyteller",
    humoriste: "Paul Mirabel",
    emoji: "📖",
    description:
      "Tu transformes la moindre anecdote en sketch. Ton secret : l'escalade comique et le naturel absolu. Les gens s'accrochent à tes histoires.",
    strength: "Tu captives ton audience — quand tu racontes, personne ne regarde son téléphone.",
    tip: "Structure tes anecdotes en 3 temps : situation normale → détail bizarre → chute inattendue.",
    color: "#8B5CF6",
    recommendedPath: "/parcours",
  },
  ABSURDE: {
    type: "ABSURDE",
    title: "L'Absurde",
    humoriste: "Fary",
    emoji: "🌀",
    description:
      "Tu surprends en permanence. Tes associations d'idées sont imprévisibles, tes pivots inattendus. Personne ne sait où tu vas — et c'est ça qui fait rire.",
    strength: "Ton humour est impossible à copier. C'est 100% toi.",
    tip: "Quand tu penses à une blague évidente, pousse-la un cran plus loin dans l'absurde. Le premier réflexe est rarement le plus drôle.",
    color: "#EC4899",
    recommendedPath: "/videos",
  },
  PUNCHLINEUR: {
    type: "PUNCHLINEUR",
    title: "Le Punchlineur",
    humoriste: "Blanche Gardin",
    emoji: "💥",
    description:
      "Peu de mots, maximum d'impact. Tu maîtrises les silences, l'autodérision et les chutes qui claquent. Chaque phrase compte.",
    strength: "Tu fais rire en 10 mots là où d'autres en mettent 50.",
    tip: "Relis chaque vanne et supprime les mots inutiles. La version la plus courte est presque toujours la meilleure.",
    color: "#EF4444",
    recommendedPath: "/vannes",
  },
  TAQUIN: {
    type: "TAQUIN",
    title: "Le Taquin",
    humoriste: "Waly Dia",
    emoji: "😏",
    description:
      "Tu as de la répartie à revendre. Tu rebondis sur tout, tu chambres avec bienveillance, et tu retournes n'importe quelle situation avec un sourire.",
    strength: "En conversation, tu es inarrêtable. Tu fais rire sans même essayer.",
    tip: "Travaille le 'oui, et...' de l'impro : au lieu de bloquer, rebondis toujours sur ce que l'autre dit.",
    color: "#F59E0B",
    recommendedPath: "/conseils",
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "En soirée, t'es plutôt...",
    options: [
      {
        label: "Tu observes et tu places LA vanne au bon moment",
        emoji: "🎯",
        scores: { OBSERVATEUR: 3, PUNCHLINEUR: 1 },
      },
      {
        label: "Tu racontes une anecdote et tout le monde écoute",
        emoji: "🎙️",
        scores: { STORYTELLER: 3, ABSURDE: 1 },
      },
      {
        label: "Tu sors un truc tellement random que ça fait rire",
        emoji: "🤯",
        scores: { ABSURDE: 3, TAQUIN: 1 },
      },
      {
        label: "Tu chambres tout le monde avec amour",
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
        label: "Une histoire qui monte, qui monte... et BAM la chute",
        emoji: "📈",
        scores: { STORYTELLER: 3, PUNCHLINEUR: 1 },
      },
      {
        label: "Un truc tellement absurde que t'as pas le choix de rire",
        emoji: "🦄",
        scores: { ABSURDE: 3, TAQUIN: 1 },
      },
      {
        label: "Une punchline courte et chirurgicale",
        emoji: "⚡",
        scores: { PUNCHLINEUR: 3, OBSERVATEUR: 1 },
      },
    ],
  },
  {
    question: "Quand quelqu'un te chambre...",
    options: [
      {
        label: "Tu notes mentalement le truc pour le ressortir plus tard",
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
        label: "Tu retournes la chambre en 2 secondes",
        emoji: "🪃",
        scores: { TAQUIN: 3, PUNCHLINEUR: 1 },
      },
    ],
  },
  {
    question: "Ton humoriste préféré(e), c'est...",
    options: [
      {
        label: "Roman Frayssinet — simplicité et précision",
        emoji: "🎯",
        scores: { OBSERVATEUR: 3 },
      },
      {
        label: "Paul Mirabel — naturel et escalade comique",
        emoji: "✨",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Fary — surprises et pivots permanents",
        emoji: "🌀",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Blanche Gardin — silences et autodérision",
        emoji: "💥",
        scores: { PUNCHLINEUR: 3 },
      },
    ],
  },
  {
    question: "À la machine à café, tu...",
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
        label: "Tu inventes un scénario catastrophe délirant",
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
        label: "Le moment WTF où tu t'y attendais pas du tout",
        emoji: "😱",
        scores: { ABSURDE: 3 },
      },
      {
        label: "La punchline — tu la ressors le lendemain",
        emoji: "🗣️",
        scores: { TAQUIN: 2, PUNCHLINEUR: 2 },
      },
    ],
  },
  {
    question: "Ton style de SMS / messages...",
    options: [
      {
        label: "Tu envoies des screenshots de trucs absurdes du quotidien",
        emoji: "📸",
        scores: { OBSERVATEUR: 3 },
      },
      {
        label: "Tu écris des pavés hilarants sur ta journée",
        emoji: "📱",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Tes réponses sont tellement random que tes potes sont perdus",
        emoji: "🤪",
        scores: { ABSURDE: 3, TAQUIN: 1 },
      },
      {
        label: "Tu réponds en une ligne qui fait mouche",
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
        label: "Tu racontes ton stress comme si c'était un film catastrophe",
        emoji: "🎥",
        scores: { STORYTELLER: 3, ABSURDE: 1 },
      },
      {
        label: "Tu fais un truc complètement décalé pour détendre l'atmosphère",
        emoji: "🎉",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Tu balances une vanne cynique parfaitement calibrée",
        emoji: "🎯",
        scores: { PUNCHLINEUR: 3, TAQUIN: 1 },
      },
    ],
  },
  {
    question: "En date / rendez-vous, tu mises sur...",
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
        label: "Des associations d'idées surprenantes qui la/le font décrocher",
        emoji: "🌈",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Du tac-au-tac et des répliques qui créent de la complicité",
        emoji: "⚡",
        scores: { TAQUIN: 3, PUNCHLINEUR: 1 },
      },
    ],
  },
  {
    question: "Tes potes diraient que tu es...",
    options: [
      {
        label: "Le/la plus observateur(trice) du groupe",
        emoji: "🦉",
        scores: { OBSERVATEUR: 3 },
      },
      {
        label: "Celui/celle qui raconte les meilleures histoires",
        emoji: "🌟",
        scores: { STORYTELLER: 3 },
      },
      {
        label: "Le/la plus imprévisible — on sait jamais ce que tu vas sortir",
        emoji: "🎰",
        scores: { ABSURDE: 3 },
      },
      {
        label: "Le/la roi/reine de la punchline — t'as toujours le dernier mot",
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
        label: "Un concept complètement barré qui part en vrille",
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
    question: "Ton motto dans la vie, c'est...",
    options: [
      {
        label: "\"Le diable est dans les détails — et les vannes aussi\"",
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
