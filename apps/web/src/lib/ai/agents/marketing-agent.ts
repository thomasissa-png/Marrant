import { callWithRetry, extractJson, extractJsonArray, getResponseText } from "../client";
import { PERSONAS, type PersonaKey } from "../personas";
import { getPersonaForDay, buildPersonaRotationPrompt } from "../personas";

// ───────────────────────────────────────────────────────────────────
// Agent Marketing — Creative Strategist de deviensmarrant.fr
//
// Rôle de direction : chapeaute les agents SEO, Design et UX qui
// lui reportent. Combine vision stratégique et approche créative
// pour tout ce qui touche au marketing de la plateforme :
//   - Copy (landing, emails, réseaux sociaux, publicité)
//   - Stratégie d'acquisition et de rétention
//   - Idéation de contenus courts (Reels/TikTok/Shorts)
//   - Recommandations UX orientées conversion
//   - Storytelling de marque
//   - Coordination des sous-agents (SEO, Design, UX)
// ───────────────────────────────────────────────────────────────────

const SYSTEM_IDENTITY = `Tu es le Creative Strategist de deviensmarrant.fr — la plateforme n°1 pour progresser en humour et en répartie en France.

PROFIL PROFESSIONNEL
Tu es un stratège créatif senior (équivalent 5-8 ans d'expérience, fourchette 60-70 k€).
Tu combines analyse data-driven et créativité audacieuse. Tu maîtrises le storytelling,
la psychologie du consommateur et les mécaniques de croissance digitale.

RÔLE DE DIRECTION
Tu es le directeur marketing. Trois agents spécialisés te reportent :
- Agent SEO : optimisation du référencement naturel, mots-clés, contenu SEO, maillage interne
- Agent Design : identité visuelle, assets graphiques, cohérence de marque, UI
- Agent UX : parcours utilisateur, conversion, A/B testing, accessibilité, ergonomie

Tu donnes les directives stratégiques à ces agents, valides leurs propositions, et assures
la cohérence globale de la stratégie marketing. Quand tu fais des recommandations qui
concernent le SEO, le design ou l'UX, tu les formules comme des briefs actionnables que
ces agents pourront exécuter.

MISSION
Concevoir et piloter la stratégie marketing de deviensmarrant.fr pour :
1. Acquérir et fidéliser nos 3 personas cibles
2. Maximiser le taux de conversion free → premium (0,99 €/mois)
3. Construire une marque forte et mémorable dans l'humour en France
4. Générer du contenu viral, en particulier des vidéos courtes (90% des marketeurs augmentent leurs investissements dans ce format)
5. Coordonner les agents SEO, Design et UX pour une exécution cohérente

COMPÉTENCES CLÉS
- Analyse : comprendre les données, identifier les leviers de croissance, mesurer les KPIs
- Créativité : concevoir des campagnes qui surprennent et engagent
- Storytelling : raconter l'histoire de la marque et de ses utilisateurs
- Gestion de projet : prioriser, planifier, exécuter avec rigueur, briefer les équipes
- Vidéo courte : maîtrise des formats TikTok, Reels, Shorts — scripts, hooks, formats viraux
- Management : capacité à coordonner SEO, Design et UX vers un objectif commun

PRODUIT
- 500+ blagues classées par catégorie
- 50+ conseils de pros (timing, répartie, storytelling) avec exercices
- 30+ vidéos de stand-up analysées
- Contenu quotidien personnalisé (blague + conseil + vidéo du jour)
- Quiz d'humour pour profil personnalisé
- Système de progression (XP, streaks)
- Offre de lancement : 0,99 €/mois (prix régulier 9,99 €/mois)
- Coaching individuel à 99 €/session

CONTRAINTE BUSINESS
Être rentable. Chaque recommandation doit avoir un impact mesurable sur l'acquisition,
la conversion ou la rétention. Pas de marketing "pour faire joli" — chaque action sert
un objectif quantifiable.

TONALITÉ DE MARQUE
- Accessible mais jamais condescendant
- Drôle sans forcer — l'humour au service du message
- Encourageant — on progresse ensemble
- Mature — notre audience va de 16 à 35+ ans, le ton doit parler à tous

3 PERSONAS CIBLES :`;

function buildPersonasBlock(): string {
  return Object.entries(PERSONAS)
    .map(([key, p]) => {
      return `
${p.name} — ${p.age} ans (${key})
  Profil : ${p.description}
  Centres d'intérêt : ${p.interests.join(", ")}
  Ton attendu : ${p.tone}`;
    })
    .join("\n");
}

const FULL_SYSTEM = `${SYSTEM_IDENTITY}
${buildPersonasBlock()}

RÈGLES DE RÉPONSE :
1. Toujours structurer ta réponse en JSON quand demandé
2. Chaque proposition doit préciser le persona cible principal
3. Chaque action doit avoir un objectif mesurable (KPI)
4. Prioriser les quick wins à fort impact
5. Penser mobile-first (notre audience est majoritairement mobile)
6. Favoriser les formats courts et partageables`;

// ─── Types ──────────────────────────────────────────────────────

export interface SocialPost {
  platform: "TIKTOK" | "INSTAGRAM" | "TWITTER" | "LINKEDIN";
  format: "REEL" | "STORY" | "CAROUSEL" | "POST" | "THREAD";
  targetPersona: PersonaKey;
  hook: string;
  content: string;
  cta: string;
  hashtags: string[];
  objective: string;
  kpi: string;
}

export interface ShortVideoScript {
  title: string;
  targetPersona: PersonaKey;
  platform: "TIKTOK" | "INSTAGRAM_REELS" | "YOUTUBE_SHORTS";
  hook: string;
  scenes: Array<{ timing: string; visual: string; text: string; audio: string }>;
  cta: string;
  duration: string;
  objective: string;
  trendReference?: string;
}

export interface CampaignBrief {
  name: string;
  objective: string;
  targetPersonas: PersonaKey[];
  insight: string;
  concept: string;
  keyMessage: string;
  channels: string[];
  contentPlan: Array<{
    day: number;
    channel: string;
    format: string;
    description: string;
    targetPersona: PersonaKey;
  }>;
  kpis: Array<{ metric: string; target: string }>;
  budget?: string;
}

export interface CopyRecommendation {
  section: string;
  currentIssue: string;
  recommendation: string;
  proposedCopy: string;
  targetPersona: PersonaKey;
  expectedImpact: string;
}

export interface EmailSequence {
  sequenceName: string;
  trigger: string;
  emails: Array<{
    day: number;
    subject: string;
    preheader: string;
    body: string;
    cta: string;
    targetPersona: PersonaKey;
    objective: string;
  }>;
}

// ─── Génération de posts réseaux sociaux ────────────────────────

interface SocialPostContext {
  platform: SocialPost["platform"];
  theme: string;
  targetPersona: PersonaKey;
  recentPosts?: string[];
}

export async function generateSocialPost(ctx: SocialPostContext): Promise<SocialPost> {
  const persona = PERSONAS[ctx.targetPersona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: FULL_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Crée un post ${ctx.platform} pour deviensmarrant.fr.

Thème : "${ctx.theme}"
Persona cible : ${persona.name} (${persona.age} ans — ${persona.description})
${ctx.recentPosts?.length ? `\nPosts récents (ne pas répéter) :\n${ctx.recentPosts.map((p, i) => `${i + 1}. ${p}`).join("\n")}` : ""}

Réponds UNIQUEMENT en JSON :
{
  "platform": "${ctx.platform}",
  "format": "REEL|STORY|CAROUSEL|POST|THREAD",
  "targetPersona": "${ctx.targetPersona}",
  "hook": "Accroche qui arrête le scroll (max 10 mots)",
  "content": "Corps du post (adapté au format)",
  "cta": "Call to action clair",
  "hashtags": ["3-5 hashtags pertinents"],
  "objective": "Objectif marketing de ce post",
  "kpi": "KPI pour mesurer le succès"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJson<SocialPost>(text);
}

// ─── Scripts vidéo courte ───────────────────────────────────────

interface ShortVideoContext {
  theme: string;
  targetPersona: PersonaKey;
  platform: ShortVideoScript["platform"];
  trendToLeverage?: string;
}

export async function generateShortVideoScript(ctx: ShortVideoContext): Promise<ShortVideoScript> {
  const persona = PERSONAS[ctx.targetPersona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: FULL_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Crée un script de vidéo courte pour ${ctx.platform}.

Thème : "${ctx.theme}"
Persona cible : ${persona.name} (${persona.age} ans — ${persona.description})
${ctx.trendToLeverage ? `Trend à exploiter : "${ctx.trendToLeverage}"` : ""}

La vidéo doit :
- Avoir un hook irrésistible dans les 2 premières secondes
- Durer entre 15 et 60 secondes
- Donner envie de visiter deviensmarrant.fr
- Être réalisable sans gros budget (smartphone + bonne lumière)

Réponds UNIQUEMENT en JSON :
{
  "title": "Titre de travail",
  "targetPersona": "${ctx.targetPersona}",
  "platform": "${ctx.platform}",
  "hook": "Les 2 premières secondes — l'accroche visuelle/textuelle",
  "scenes": [
    {"timing": "0-2s", "visual": "Description visuelle", "text": "Texte à l'écran", "audio": "Voix off ou musique"}
  ],
  "cta": "Call to action de fin",
  "duration": "Durée estimée",
  "objective": "Objectif marketing",
  "trendReference": "Référence au trend si applicable"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJson<ShortVideoScript>(text);
}

// ─── Brief de campagne ──────────────────────────────────────────

interface CampaignContext {
  objective: string;
  duration: string;
  targetPersonas: PersonaKey[];
  budget?: string;
  context?: string;
}

export async function generateCampaignBrief(ctx: CampaignContext): Promise<CampaignBrief> {
  const personaDetails = ctx.targetPersonas
    .map((k) => `- ${PERSONAS[k].name} (${PERSONAS[k].age} ans) : ${PERSONAS[k].description}`)
    .join("\n");

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    system: FULL_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Conçois un brief de campagne marketing complet.

Objectif : "${ctx.objective}"
Durée : ${ctx.duration}
${ctx.budget ? `Budget indicatif : ${ctx.budget}` : "Budget limité — privilégier l'organique"}
${ctx.context ? `Contexte : ${ctx.context}` : ""}

Personas cibles :
${personaDetails}

Le brief doit :
- Partir d'un insight consommateur fort
- Proposer un concept créatif mémorable
- Inclure un plan de contenu jour par jour
- Définir des KPIs précis et atteignables
- Privilégier les vidéos courtes comme levier principal

Réponds UNIQUEMENT en JSON :
{
  "name": "Nom de la campagne",
  "objective": "Objectif SMART",
  "targetPersonas": ["YANIS", ...],
  "insight": "L'insight consommateur qui fonde la campagne",
  "concept": "Le concept créatif en 2-3 phrases",
  "keyMessage": "Le message clé de la campagne",
  "channels": ["Les canaux utilisés"],
  "contentPlan": [
    {"day": 1, "channel": "TIKTOK", "format": "Reel", "description": "Description du contenu", "targetPersona": "YANIS"}
  ],
  "kpis": [
    {"metric": "Nom du KPI", "target": "Objectif chiffré"}
  ],
  "budget": "Répartition budgétaire si applicable"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJson<CampaignBrief>(text);
}

// ─── Recommandations copy/UX ────────────────────────────────────

interface CopyAuditContext {
  page: string;
  currentCopy: string;
  conversionGoal: string;
}

export async function auditAndRecommendCopy(ctx: CopyAuditContext): Promise<CopyRecommendation[]> {
  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: FULL_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Audite le copy de cette page et propose des améliorations.

Page : ${ctx.page}
Objectif de conversion : ${ctx.conversionGoal}

Copy actuel :
---
${ctx.currentCopy}
---

Pour chaque problème identifié, propose une correction avec le copy exact à utiliser.
Priorise les changements par impact attendu sur la conversion.
Chaque recommandation doit cibler un persona spécifique.

Réponds UNIQUEMENT en JSON — un tableau :
[{
  "section": "Section concernée",
  "currentIssue": "Le problème identifié",
  "recommendation": "Ce qu'il faut faire et pourquoi",
  "proposedCopy": "Le copy exact proposé",
  "targetPersona": "YANIS|SOPHIE|MARC",
  "expectedImpact": "Impact attendu sur la conversion"
}]`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJsonArray<CopyRecommendation>(text);
}

// ─── Séquence email ─────────────────────────────────────────────

interface EmailContext {
  trigger: string;
  goal: string;
  targetPersona: PersonaKey;
  numberOfEmails: number;
}

export async function generateEmailSequence(ctx: EmailContext): Promise<EmailSequence> {
  const persona = PERSONAS[ctx.targetPersona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    system: FULL_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Crée une séquence de ${ctx.numberOfEmails} emails marketing.

Déclencheur : "${ctx.trigger}"
Objectif : "${ctx.goal}"
Persona cible : ${persona.name} (${persona.age} ans — ${persona.description})

Chaque email doit :
- Avoir un objet qui donne envie d'ouvrir (< 50 caractères)
- Un preheader complémentaire (< 90 caractères)
- Un corps concis et engageant (150-250 mots max)
- Un CTA unique et clair
- Respecter le ton de la marque

Réponds UNIQUEMENT en JSON :
{
  "sequenceName": "Nom de la séquence",
  "trigger": "${ctx.trigger}",
  "emails": [
    {
      "day": 0,
      "subject": "Objet de l'email",
      "preheader": "Preheader",
      "body": "Corps de l'email (Markdown)",
      "cta": "Texte du bouton CTA",
      "targetPersona": "${ctx.targetPersona}",
      "objective": "Objectif de cet email spécifique"
    }
  ]
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJson<EmailSequence>(text);
}

// ─── Plan éditorial réseaux sociaux (mensuel) ───────────────────

export interface SocialMonthlyPlan {
  month: string;
  themes: string[];
  posts: Array<{
    dayOfMonth: number;
    platform: string;
    format: string;
    theme: string;
    targetPersona: PersonaKey;
    briefDescription: string;
  }>;
}

export async function generateSocialMonthlyPlan(
  month: number,
  year: number,
  daysInMonth: number,
  postsPerWeek: number
): Promise<SocialMonthlyPlan> {
  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: FULL_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Crée le plan éditorial réseaux sociaux pour ${month}/${year}.

Fréquence : ${postsPerWeek} posts/semaine
Plateformes : TikTok, Instagram, Twitter
Priorité : vidéos courtes (Reels/TikTok) au moins 60% du plan

3 personas en rotation :
${buildPersonaRotationPrompt("jokeCategories")}

Le plan doit :
- Varier les formats (Reel, Carousel, Post, Story)
- Alterner les personas
- Inclure des contenus viraux (hooks, trends)
- Promouvoir le contenu du site (blagues, conseils, vidéos)
- Inclure 2-3 posts "promotion" du premium par mois

Réponds UNIQUEMENT en JSON :
{
  "month": "${month}/${year}",
  "themes": ["Les 3-4 thèmes du mois"],
  "posts": [
    {
      "dayOfMonth": 1,
      "platform": "TIKTOK",
      "format": "REEL",
      "theme": "Description du thème",
      "targetPersona": "YANIS",
      "briefDescription": "Brief créatif en 1-2 phrases"
    }
  ]
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJson<SocialMonthlyPlan>(text);
}

// ─── Briefs pour sous-agents (SEO, Design, UX) ─────────────────

export type SubAgentType = "SEO" | "DESIGN" | "UX";

export interface SubAgentBrief {
  agent: SubAgentType;
  objective: string;
  context: string;
  deliverables: string[];
  constraints: string[];
  priority: "HIGH" | "MEDIUM" | "LOW";
  deadline: string;
  successCriteria: string[];
  personaFocus: PersonaKey[];
}

export interface StrategicDirective {
  campaign: string;
  briefs: SubAgentBrief[];
  overallObjective: string;
  coordinationNotes: string;
}

interface DirectiveContext {
  campaign: string;
  objective: string;
  agents: SubAgentType[];
  context?: string;
}

export async function generateSubAgentDirectives(ctx: DirectiveContext): Promise<StrategicDirective> {
  const agentDescriptions: Record<SubAgentType, string> = {
    SEO: "Agent SEO : référencement naturel, mots-clés, contenu optimisé, maillage interne, meta tags, Core Web Vitals",
    DESIGN: "Agent Design : identité visuelle, assets graphiques, templates, cohérence de marque, UI components",
    UX: "Agent UX : parcours utilisateur, wireframes, A/B tests, conversion funnels, accessibilité, ergonomie mobile",
  };

  const agentList = ctx.agents.map((a) => agentDescriptions[a]).join("\n- ");

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    system: FULL_SYSTEM,
    messages: [
      {
        role: "user",
        content: `En tant que Creative Strategist et directeur marketing, génère les directives
stratégiques pour tes sous-agents dans le cadre de cette initiative.

Campagne/Initiative : "${ctx.campaign}"
Objectif global : "${ctx.objective}"
${ctx.context ? `Contexte : ${ctx.context}` : ""}

Agents à briefer :
- ${agentList}

Pour chaque agent, crée un brief actionnable avec :
- Objectif précis aligné sur la stratégie globale
- Livrables attendus
- Contraintes à respecter
- Critères de succès mesurables
- Personas prioritaires

Ajoute des notes de coordination pour assurer la cohérence entre agents.

Réponds UNIQUEMENT en JSON :
{
  "campaign": "${ctx.campaign}",
  "overallObjective": "L'objectif stratégique global",
  "briefs": [
    {
      "agent": "SEO|DESIGN|UX",
      "objective": "Objectif spécifique de l'agent",
      "context": "Contexte et raison de cette directive",
      "deliverables": ["Livrable 1", "Livrable 2"],
      "constraints": ["Contrainte 1"],
      "priority": "HIGH|MEDIUM|LOW",
      "deadline": "Échéance relative (ex: J+3, fin de semaine)",
      "successCriteria": ["KPI ou critère mesurable"],
      "personaFocus": ["YANIS", "SOPHIE", "MARC"]
    }
  ],
  "coordinationNotes": "Notes pour assurer la cohérence entre les agents"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJson<StrategicDirective>(text);
}
