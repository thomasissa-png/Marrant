import { callWithRetry, extractJson, getResponseText } from "../client";
import { TONALITY_BRIEF } from "./marketing-agent";

// ───────────────────────────────────────────────────────────────────
// Agent HARO — Réponses d'expert pour obtenir des backlinks presse
//
// Pipeline :
// 1. Scrape des opportunités HARO/Connectively/SourceBottle/Qwoted
// 2. Filtre les sujets pertinents (humour, communication, soft skills...)
// 3. Génère une réponse d'expert au nom d'Alex
// 4. Envoie le draft à alex@deviens-marrant.fr pour validation
// ───────────────────────────────────────────────────────────────────

// ─── Types ──────────────────────────────────────────────────────────

export interface HaroOpportunity {
  id: string;
  source: string; // "HARO" | "Connectively" | "JournalRequest" | "manual"
  query: string; // The journalist's question
  outlet?: string; // Media outlet name
  journalistName?: string;
  deadline?: string; // ISO date
  category: string;
  url?: string;
}

export interface HaroResponse {
  opportunityId: string;
  hook: string; // 1 drôle phrase d'accroche
  expertResponse: string; // 3-4 phrases concrètes
  bio: string; // Bio courte d'Alex
  fullEmail: string; // Email complet prêt à envoyer
  relevanceScore: number; // 1-10
}

export interface HaroFilterResult {
  relevant: HaroOpportunity[];
  filtered: number;
  total: number;
}

// ─── Sujets pertinents pour deviens-marrant.fr ──────────────────────

const RELEVANT_TOPICS = [
  "humour",
  "humor",
  "funny",
  "drôle",
  "rire",
  "blague",
  "joke",
  "communication",
  "soft skills",
  "confiance en soi",
  "self-confidence",
  "prise de parole",
  "public speaking",
  "charisme",
  "charisma",
  "bien-être",
  "wellbeing",
  "well-being",
  "relations sociales",
  "social skills",
  "dating",
  "rendez-vous",
  "ice breaker",
  "networking",
  "team building",
  "management",
  "leadership",
  "créativité",
  "creativity",
  "storytelling",
  "stand-up",
  "standup",
  "comédie",
  "comedy",
  "spectacle",
  "développement personnel",
  "personal development",
  "improvisation",
  "improv",
  "répartie",
  "wit",
  "witty",
  "conversation",
  "productivité",
  "productivity",
  "stress",
  "anxiété",
  "timidité",
  "shyness",
  "introvert",
  "introverti",
];

const ALEX_BIO =
  "Alex, fondateur de deviens-marrant.fr — la plateforme qui enseigne l'humour avec les techniques du stand-up professionnel. Plus de 290 vannes analysées, 60+ techniques et 80+ vidéos décortiquées.";

// ─── Filtrage des opportunités ──────────────────────────────────────

export function filterRelevantOpportunities(
  opportunities: HaroOpportunity[],
): HaroFilterResult {
  const relevant = opportunities.filter((opp) => {
    const text = `${opp.query} ${opp.category} ${opp.outlet || ""}`.toLowerCase();
    return RELEVANT_TOPICS.some((topic) => text.includes(topic.toLowerCase()));
  });

  return {
    relevant,
    filtered: opportunities.length - relevant.length,
    total: opportunities.length,
  };
}

// ─── Génération de réponse d'expert ─────────────────────────────────

export async function generateHaroResponse(
  opportunity: HaroOpportunity,
): Promise<HaroResponse> {
  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: buildHaroSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `OPPORTUNITÉ PRESSE À TRAITER

Source : ${opportunity.source}
${opportunity.outlet ? `Média : ${opportunity.outlet}` : ""}
${opportunity.journalistName ? `Journaliste : ${opportunity.journalistName}` : ""}
Catégorie : ${opportunity.category}
${opportunity.deadline ? `Deadline : ${opportunity.deadline}` : ""}

QUESTION DU JOURNALISTE :
"${opportunity.query}"

Génère une réponse d'expert au nom d'Alex, fondateur de deviens-marrant.fr.

Réponds en JSON avec cette structure exacte :
{
  "hook": "Accroche drôle en 1 phrase (OBLIGATOIRE : doit faire sourire le journaliste)",
  "expertResponse": "Réponse d'expert en 3-4 phrases. Concrète, utile, cite une technique d'humour/stand-up. JAMAIS de blabla corporate.",
  "relevanceScore": 8
}`,
      },
    ],
  }, 2, { agent: "haro-agent", fn: "generateHaroResponse" });

  const text = getResponseText(response);
  const parsed = extractJson<{
    hook: string;
    expertResponse: string;
    relevanceScore: number;
  }>(text);

  const fullEmail = buildEmail(opportunity, parsed.hook, parsed.expertResponse);

  return {
    opportunityId: opportunity.id,
    hook: parsed.hook,
    expertResponse: parsed.expertResponse,
    bio: ALEX_BIO,
    fullEmail,
    relevanceScore: parsed.relevanceScore,
  };
}

// ─── Construction de l'email ────────────────────────────────────────

function buildEmail(
  opportunity: HaroOpportunity,
  hook: string,
  expertResponse: string,
): string {
  const greeting = opportunity.journalistName
    ? `Bonjour ${opportunity.journalistName},`
    : "Bonjour,";

  return `${greeting}

${hook}

${expertResponse}

—
${ALEX_BIO}
Site : https://deviens-marrant.fr
Email : alex@deviens-marrant.fr`;
}

// ─── System prompt HARO ─────────────────────────────────────────────

function buildHaroSystemPrompt(): string {
  return `Tu es le ghostwriter d'Alex, fondateur de deviens-marrant.fr — LA plateforme francophone qui enseigne l'humour avec les techniques du stand-up professionnel.

═══════════════════════════════════════
QUI EST ALEX
═══════════════════════════════════════

Alex est un passionné d'humour qui a créé deviens-marrant.fr pour démocratiser les techniques du stand-up. Pas un "expert en communication corporate" — un mec qui décortique les vannes de Paul Mirabel, Fary et Blanche Gardin pour aider les gens à devenir plus drôles dans leur quotidien.

Son expertise unique : le PONT entre les techniques de stand-up professionnel et les situations du quotidien (machine à café, soirées, dates, réunions).

═══════════════════════════════════════
COMMENT ALEX RÉPOND AUX JOURNALISTES
═══════════════════════════════════════

1. LE HOOK — Obligatoire, en 1 phrase :
   - Doit faire SOURIRE le journaliste (pas LOL, sourire)
   - Montre qu'Alex est un vrai expert de l'humour, pas un SEO qui fait du link building
   - Exemple bon : "En tant que fondateur d'un site qui décortique 80+ vidéos de stand-up, je peux confirmer que le timing est la compétence la plus sous-estimée — même ma grand-mère le sait, elle attend toujours 3 secondes avant de lâcher une punchline."
   - Exemple mauvais : "L'humour est un sujet qui me passionne depuis toujours."

2. LA RÉPONSE D'EXPERT — 3-4 phrases max :
   - CONCRÈTE : cite une technique précise (timing, callback, pivot, autodérision...)
   - ACTIONNABLE : le lecteur peut appliquer le conseil dans sa vie
   - Cite au moins 1 humoriste de référence (Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia)
   - Ton ${TONALITY_BRIEF.voice} — jamais corporate, jamais jargonneux

3. LA BIO est fixe : "${ALEX_BIO}"

═══════════════════════════════════════
CE QU'ON NE FAIT JAMAIS
═══════════════════════════════════════

- Réponse générique qui pourrait venir de n'importe qui
- Ton corporate / LinkedIn / coach en développement personnel
- Forcer un lien vers le site dans la réponse (la bio suffit)
- Répondre si le sujet n'est PAS lié à l'humour, la communication ou les soft skills
- Promettre des stats qu'on n'a pas

═══════════════════════════════════════
SCORE DE PERTINENCE
═══════════════════════════════════════

Évalue la pertinence de l'opportunité pour Alex (1-10) :
- 9-10 : Sujet directement lié à l'humour/stand-up/répartie
- 7-8 : Communication, soft skills, confiance en soi (angle humour possible)
- 5-6 : Sujet tangent (bien-être, productivité) — réponse possible avec angle original
- 1-4 : Pas pertinent — ne pas répondre

Si le score est < 5, mets "relevanceScore": 3 et le contenu sera ignoré.`;
}

// ─── Envoi du draft par email pour validation ───────────────────────

export async function sendHaroDraftForReview(
  haroResponse: HaroResponse,
  opportunity: HaroOpportunity,
): Promise<void> {
  // Import dynamique pour éviter de charger Resend côté client
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject = `[HARO] ${opportunity.outlet || opportunity.source} — ${opportunity.category} (score: ${haroResponse.relevanceScore}/10)`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Deviens Marrant <noreply@deviens-marrant.fr>",
    to: "alex@deviens-marrant.fr",
    subject,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h2 style="color: #7c3aed; margin-bottom: 8px;">Opportunité HARO</h2>

  <div style="background: #f5f3ff; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
    <p style="margin: 0 0 8px; font-size: 14px; color: #666;"><strong>Source :</strong> ${opportunity.source}${opportunity.outlet ? ` — ${opportunity.outlet}` : ""}</p>
    ${opportunity.journalistName ? `<p style="margin: 0 0 8px; font-size: 14px; color: #666;"><strong>Journaliste :</strong> ${opportunity.journalistName}</p>` : ""}
    ${opportunity.deadline ? `<p style="margin: 0 0 8px; font-size: 14px; color: #666;"><strong>Deadline :</strong> ${opportunity.deadline}</p>` : ""}
    <p style="margin: 0; font-size: 14px; color: #666;"><strong>Score pertinence :</strong> ${haroResponse.relevanceScore}/10</p>
  </div>

  <h3 style="margin-bottom: 8px;">Question du journaliste</h3>
  <p style="background: #fff7ed; border-left: 3px solid #f59e0b; padding: 12px; font-style: italic;">${opportunity.query}</p>

  <h3 style="margin-bottom: 8px;">Réponse proposée</h3>
  <div style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 12px; white-space: pre-line;">${haroResponse.fullEmail}</div>

  <div style="margin-top: 24px; text-align: center;">
    <p style="font-size: 14px; color: #666;">
      Pour envoyer cette réponse, copie le texte ci-dessus et réponds à l'opportunité.
      ${opportunity.url ? `<br><a href="${opportunity.url}" style="color: #7c3aed;">Voir l'opportunité originale</a>` : ""}
    </p>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 12px; color: #999;">Agent HARO — deviens-marrant.fr</p>
</body>
</html>`,
  });
}

// ─── Pipeline complet : filtre + génère + envoie ────────────────────

export async function processHaroOpportunities(
  opportunities: HaroOpportunity[],
): Promise<{ processed: number; sent: number; skipped: number }> {
  const { relevant } = filterRelevantOpportunities(opportunities);

  let sent = 0;
  let skipped = 0;

  for (const opp of relevant) {
    try {
      const response = await generateHaroResponse(opp);

      // Ne pas envoyer si le score est trop bas
      if (response.relevanceScore < 5) {
        skipped++;
        continue;
      }

      await sendHaroDraftForReview(response, opp);
      sent++;
    } catch (error) {
      console.error(`[HARO] Erreur pour opportunité ${opp.id}:`, error);
      skipped++;
    }
  }

  return {
    processed: relevant.length,
    sent,
    skipped,
  };
}
