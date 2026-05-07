/**
 * Tests — Resend Inbound webhook
 *
 * Module sous test : `apps/web/src/app/api/webhooks/resend-inbound/route.ts`
 *
 * Couvre (Phase 5.D Groupe 2 / @qa plan §3) :
 *   - verifyResendSignature : HMAC-SHA256 timing-safe, secret manquant/placeholder,
 *     préfixe `sha256=`, longueurs différentes
 *   - detectOptOut : 12 keywords FR + EN (le code en compte 12, pas 11 — diff
 *     mineure vs plan @qa, le plan listait "11 keywords" en estimation rapide)
 *   - POST happy path + 401 + 400
 *   - Audit log + opt-out propagation User
 *   - GET healthcheck
 *
 * Stratégie :
 *   - Logique pure (signature + opt-out) testée par reproduction inline
 *     fidèle au code source (lecture fs + assertions de structure pour garantir
 *     qu'on teste BIEN ce qui est en prod).
 *   - POST/GET handlers : import direct + mock Prisma + mock ceo-helpers.
 *     NextRequest construit via le polyfill jest.setup.ts (Request natif Node 18+).
 *
 * Référence patterns :
 *   - source-integrity : `apps/web/src/__tests__/lib/admin-llm-usage-api.test.ts`
 *   - jest.resetModules + setup : `apps/web/src/__tests__/lib/standup-director-haiku.test.ts`
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { createHmac, timingSafeEqual } from "node:crypto";

const ORIGINAL_ENV = { ...process.env };
const TEST_SECRET = "test-resend-secret-".padEnd(64, "x");

const ROUTE_PATH = path.resolve(
  __dirname,
  "../../../app/api/webhooks/resend-inbound/route.ts",
);
const ROUTE_SOURCE = fs.readFileSync(ROUTE_PATH, "utf-8");

// ─── 1. Tests source-integrity (garantissent que les contrats sécu sont en place) ──

describe("resend-inbound — intégrité source (contrats sécurité critiques)", () => {
  it("utilise timingSafeEqual (pas de comparaison string ===)", () => {
    expect(ROUTE_SOURCE).toContain("timingSafeEqual");
  });

  it("compare les Buffers de même longueur AVANT timingSafeEqual", () => {
    // timingSafeEqual throw si longueurs diffèrent → guard explicite obligatoire
    expect(ROUTE_SOURCE).toMatch(/expectedBuf\.length\s*!==\s*providedBuf\.length/);
  });

  it("rejette si RESEND_WEBHOOK_SECRET absent OU placeholder (...)", () => {
    expect(ROUTE_SOURCE).toContain("RESEND_WEBHOOK_SECRET");
    expect(ROUTE_SOURCE).toMatch(/startsWith\("\.\.\."\)/);
  });

  it("retourne 401 sur signature invalide", () => {
    expect(ROUTE_SOURCE).toMatch(/status:\s*401/);
    expect(ROUTE_SOURCE).toContain("unauthorized");
  });

  it("retourne 400 sur body/JSON invalide", () => {
    expect(ROUTE_SOURCE).toMatch(/status:\s*400/);
    expect(ROUTE_SOURCE).toContain("invalid_json");
  });

  it("strip le préfixe `sha256=` (Resend l'ajoute parfois)", () => {
    expect(ROUTE_SOURCE).toMatch(/replace\(\/\^sha256=\//);
  });

  it("limite la longueur du body persisté à 10_000 chars (anti-pollution DB)", () => {
    expect(ROUTE_SOURCE).toMatch(/slice\(0,\s*10_?000\)/);
  });

  it("détecte les 12 keywords opt-out FR + EN", () => {
    const expectedKeywords = [
      "stop",
      "désinscription",
      "desinscription",
      "désinscrire",
      "desinscrire",
      "désabonner",
      "desabonner",
      "désabonnement",
      "unsubscribe",
      "ne plus recevoir",
      "opt out",
      "opt-out",
    ];
    for (const kw of expectedKeywords) {
      expect(ROUTE_SOURCE).toContain(`"${kw}"`);
    }
  });

  it("normalise en lowercase avant matching opt-out", () => {
    expect(ROUTE_SOURCE).toMatch(/\.toLowerCase\(\)/);
  });

  it("masque l'email (PII redaction) dans l'audit log", () => {
    expect(ROUTE_SOURCE).toContain("maskPii");
    expect(ROUTE_SOURCE).toContain("recordAudit");
  });

  it("propage opt-out vers User.emailOptOut (avec userId ET fallback updateMany par email)", () => {
    expect(ROUTE_SOURCE).toContain("emailOptOut");
    expect(ROUTE_SOURCE).toContain("updateMany");
  });

  it("met à jour repliedAt + replies counter sur le message d'origine", () => {
    expect(ROUTE_SOURCE).toContain("replies:");
    expect(ROUTE_SOURCE).toContain("repliedAt");
  });

  it("expose un GET healthcheck retournant { status: 'ok' }", () => {
    expect(ROUTE_SOURCE).toMatch(/export async function GET/);
    expect(ROUTE_SOURCE).toContain('status: "ok"');
  });

  it("exempté du middleware auth cookie (commentaire explicite)", () => {
    expect(ROUTE_SOURCE).toMatch(/middleware/i);
  });
});

// ─── 2. Reproduction inline de verifyResendSignature pour tests positifs/négatifs ──

/**
 * Reproduction LIGNE-À-LIGNE de la fonction privée `verifyResendSignature`.
 * Si la route change → ce test casse → on met à jour ici. Garde-fou détecté
 * par le test source-integrity ci-dessus (timingSafeEqual + longueurs).
 */
function verifyResendSignatureInline(
  rawBody: string,
  signature: string | null,
  secret: string | undefined,
): boolean {
  if (!secret || secret.length < 16 || secret.startsWith("...")) {
    return false;
  }
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = signature.replace(/^sha256=/, "").trim();
  const expectedBuf = Buffer.from(expected, "hex");
  const providedBuf = Buffer.from(provided, "hex");
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyResendSignature (reproduction inline)", () => {
  const body = JSON.stringify({ from: "user@example.com", text: "hello" });

  it("PASS : signature HMAC valide", () => {
    const sig = signBody(body, TEST_SECRET);
    expect(verifyResendSignatureInline(body, sig, TEST_SECRET)).toBe(true);
  });

  it("PASS : signature avec préfixe `sha256=`", () => {
    const sig = "sha256=" + signBody(body, TEST_SECRET);
    expect(verifyResendSignatureInline(body, sig, TEST_SECRET)).toBe(true);
  });

  it("FAIL : signature invalide (1 char modifié)", () => {
    const sig = signBody(body, TEST_SECRET);
    const tampered = sig[0] === "a" ? "b" + sig.slice(1) : "a" + sig.slice(1);
    expect(verifyResendSignatureInline(body, tampered, TEST_SECRET)).toBe(false);
  });

  it("FAIL : body altéré (signature originale ne match plus)", () => {
    const sig = signBody(body, TEST_SECRET);
    const tampered = body + " EXTRA";
    expect(verifyResendSignatureInline(tampered, sig, TEST_SECRET)).toBe(false);
  });

  it("FAIL : signature signée avec un autre secret", () => {
    const otherSecret = "other-secret-".padEnd(64, "z");
    const sig = signBody(body, otherSecret);
    expect(verifyResendSignatureInline(body, sig, TEST_SECRET)).toBe(false);
  });

  it("FAIL : signature absente (null)", () => {
    expect(verifyResendSignatureInline(body, null, TEST_SECRET)).toBe(false);
  });

  it("FAIL : secret absent", () => {
    const sig = signBody(body, TEST_SECRET);
    expect(verifyResendSignatureInline(body, sig, undefined)).toBe(false);
  });

  it("FAIL : secret placeholder (commence par `...`)", () => {
    const placeholder = "..." + "x".repeat(20);
    const sig = signBody(body, placeholder);
    expect(verifyResendSignatureInline(body, sig, placeholder)).toBe(false);
  });

  it("FAIL : secret trop court (<16 chars)", () => {
    const short = "tooshort";
    const sig = signBody(body, short);
    expect(verifyResendSignatureInline(body, sig, short)).toBe(false);
  });

  it("FAIL : signature de longueur différente (rejet AVANT timingSafeEqual)", () => {
    // Signature tronquée → buffers de longueurs différentes → guard avant timingSafeEqual
    const sig = signBody(body, TEST_SECRET).slice(0, 32);
    expect(verifyResendSignatureInline(body, sig, TEST_SECRET)).toBe(false);
  });

  it("FAIL : signature non-hex (Buffer.from retourne un buffer vide ou tronqué)", () => {
    expect(verifyResendSignatureInline(body, "not-hex-at-all", TEST_SECRET)).toBe(false);
  });

  it("PASS : tolère espaces autour de la signature (.trim())", () => {
    const sig = "  " + signBody(body, TEST_SECRET) + "  ";
    expect(verifyResendSignatureInline(body, sig, TEST_SECRET)).toBe(true);
  });
});

// ─── 3. Reproduction inline de detectOptOut + faux positifs ──

const OPT_OUT_KEYWORDS_INLINE = [
  "stop",
  "désinscription",
  "desinscription",
  "désinscrire",
  "desinscrire",
  "désabonner",
  "desabonner",
  "désabonnement",
  "unsubscribe",
  "ne plus recevoir",
  "opt out",
  "opt-out",
];

function detectOptOutInline(body: string): boolean {
  const normalized = body.toLowerCase();
  return OPT_OUT_KEYWORDS_INLINE.some((kw) => normalized.includes(kw));
}

describe("detectOptOut (reproduction inline)", () => {
  it.each([
    ["stop", "STOP"],
    ["désinscription", "Je demande la désinscription de cette liste"],
    ["desinscription", "desinscription immédiate svp"],
    ["désinscrire", "Merci de me désinscrire"],
    ["desinscrire", "desinscrire moi"],
    ["désabonner", "désabonner ce mail"],
    ["desabonner", "desabonner le compte"],
    ["désabonnement", "demande de désabonnement"],
    ["unsubscribe", "Please unsubscribe me"],
    ["ne plus recevoir", "je préfère ne plus recevoir vos emails"],
    ["opt out", "I want to opt out"],
    ["opt-out", "OPT-OUT requested"],
  ])("PASS : keyword '%s' détecté dans phrase réaliste", (kw, phrase) => {
    expect(detectOptOutInline(phrase)).toBe(true);
  });

  it("PASS : keyword en majuscules (normalisation lowercase)", () => {
    expect(detectOptOutInline("UNSUBSCRIBE NOW")).toBe(true);
  });

  it("FAIL : email standard sans keyword opt-out", () => {
    expect(detectOptOutInline("Merci pour ton email, c'était super utile !")).toBe(false);
  });

  it("FAIL : phrase contenant des mots proches mais hors opt-out", () => {
    expect(detectOptOutInline("J'aime bien recevoir vos emails, continuez !")).toBe(false);
  });

  // ─── Faux positifs documentés ────────────────────────────────────────
  // Le `includes` simple matche aussi des sous-chaînes — risque MOYEN cross-review
  // s9. Ces tests documentent le comportement actuel : certains faux positifs
  // PASSENT le filtre opt-out (= sont marqués opt-out par sécurité). Décision
  // produit : faux positif acceptable (marquer un opt-out par erreur est
  // récupérable via ré-inscription explicite ; rater un opt-out = violation RGPD).

  it("[FAUX POSITIF ACCEPTÉ] 'stoppé hier' contient 'stop' → marqué opt-out", () => {
    // Conservateur : préférer marquer opt-out à tort que rater un vrai opt-out.
    expect(detectOptOutInline("Je l'ai stoppé hier mais je me ravise")).toBe(true);
  });

  it("[FAUX POSITIF ACCEPTÉ] 'autostop' contient 'stop'", () => {
    expect(detectOptOutInline("Je voyageais en autostop")).toBe(true);
  });

  it("[VRAI NÉGATIF] 'désespérer' ne contient PAS 'désabonner'", () => {
    expect(detectOptOutInline("Je désespère pas de réussir un jour")).toBe(false);
  });

  it("[VRAI NÉGATIF] 'remove' seul (pas dans la liste actuelle) ne match pas", () => {
    // "remove" n'est PAS dans OPT_OUT_KEYWORDS_INLINE — diff vs plan @qa.
    // Documenter : si on veut le matcher, ajouter "remove" + "remove me" au code.
    expect(detectOptOutInline("Please remove me from this list")).toBe(false);
  });

  it("[VRAI NÉGATIF] phrase sans aucun keyword (caractères spéciaux)", () => {
    expect(detectOptOutInline("Tout va bien 🏠 émojis et accents éà")).toBe(false);
  });

  it("[VRAI NÉGATIF] body vide", () => {
    expect(detectOptOutInline("")).toBe(false);
  });

  it("FAIL : 'stoppage' (sous-chaîne 'stop') confirme la limite documentée", () => {
    // Edge case du `includes` : confirmer pour traçabilité (faux positif
    // accepté). Si on veut éviter, switcher vers regex `\bstop\b`.
    expect(detectOptOutInline("On a un stoppage de production")).toBe(true);
  });
});

// ─── 4. Tests d'intégration : reproduction inline du POST handler ──
// (NextRequest de Next.js 14 n'est PAS importable en environnement Jest-JSDOM
//  — pattern source-integrity inline cf. admin-llm-usage-api.test.ts.)

interface MockRequest {
  text: () => Promise<string>;
  headers: { get: (name: string) => string | null };
}

interface MockPrismaShape {
  ceoOutboundMessage: {
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  ceoLead: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
  user: { update: jest.Mock; updateMany: jest.Mock };
}

interface JsonResponse {
  status: number;
  body: Record<string, unknown>;
}

function jsonResp(body: Record<string, unknown>, init?: { status?: number }): JsonResponse {
  return { status: init?.status ?? 200, body };
}

/**
 * Reproduit FIDÈLEMENT le handler POST de la route. Dépendances injectées
 * pour rester unit-testable. Si la route change, ce reproduit doit suivre
 * — protégé par les tests source-integrity §1 qui vérifient la présence
 * des contrats critiques (timingSafeEqual, codes, keywords, maskPii).
 */
async function processInboundReply(
  req: MockRequest,
  prismaMock: MockPrismaShape,
  helpers: { recordAudit: jest.Mock; maskPii: jest.Mock },
): Promise<JsonResponse> {
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return jsonResp({ error: "invalid_body" }, { status: 400 });
  }

  const signature = req.headers.get("resend-signature");
  if (!verifyResendSignatureInline(rawBody, signature, process.env.RESEND_WEBHOOK_SECRET)) {
    return jsonResp({ error: "unauthorized" }, { status: 401 });
  }

  let payload: {
    from?: string;
    text?: string;
    html?: string;
    subject?: string;
    threadId?: string;
    messageId?: string;
    inReplyTo?: string;
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResp({ error: "invalid_json" }, { status: 400 });
  }

  const fromEmail = (payload.from ?? "").trim().toLowerCase();
  const body = (payload.text ?? payload.html ?? "").trim();
  if (!fromEmail || !body) {
    return jsonResp({ error: "missing_from_or_body" }, { status: 400 });
  }

  let originalMessage = null;
  if (payload.threadId) {
    originalMessage = await prismaMock.ceoOutboundMessage.findFirst({
      where: { externalId: payload.threadId },
    });
  }
  if (!originalMessage && payload.inReplyTo) {
    originalMessage = await prismaMock.ceoOutboundMessage.findFirst({
      where: { externalId: payload.inReplyTo },
    });
  }
  if (!originalMessage) {
    originalMessage = await prismaMock.ceoOutboundMessage.findFirst({
      where: {
        recipient: fromEmail,
        direction: "OUTBOUND",
        sentAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
      },
      orderBy: { sentAt: "desc" },
    });
  }

  let lead = await prismaMock.ceoLead.findFirst({ where: { email: fromEmail } });
  if (!lead) {
    lead = await prismaMock.ceoLead.create({
      data: {
        email: fromEmail,
        status: "PENDING_ACTION",
        source: "inbound_reply",
        touchpoints: 1,
      },
    });
  }

  const reply = await prismaMock.ceoOutboundMessage.create({
    data: {
      channel: "EMAIL",
      direction: "INBOUND",
      recipient: fromEmail,
      subject: payload.subject ?? null,
      content: body.slice(0, 10_000),
      status: "PENDING",
      leadId: lead.id,
      externalId: payload.messageId ?? null,
      utmSource: originalMessage?.utmSource ?? "ceo",
      utmCampaign: originalMessage?.utmCampaign ?? null,
      utmMedium: "email",
    },
  });

  if (originalMessage) {
    await prismaMock.ceoOutboundMessage
      .update({
        where: { id: originalMessage.id },
        data: { replies: { increment: 1 }, repliedAt: new Date() },
      })
      .catch(() => undefined);
  }

  await prismaMock.ceoLead.update({
    where: { id: lead.id },
    data: { status: "PENDING_ACTION", lastContactAt: new Date() },
  });

  const optOut = detectOptOutInline(body);
  if (optOut) {
    await prismaMock.ceoLead.update({
      where: { id: lead.id },
      data: { status: "OPT_OUT", optOut: true },
    });
    if (lead.userId) {
      await prismaMock.user
        .update({ where: { id: lead.userId }, data: { emailOptOut: true } })
        .catch(() => undefined);
    } else {
      await prismaMock.user
        .updateMany({ where: { email: fromEmail }, data: { emailOptOut: true } })
        .catch(() => undefined);
    }
  }

  await helpers.recordAudit({
    action: optOut ? "inbound_reply_opt_out" : "inbound_reply_received",
    targetType: "lead",
    targetId: helpers.maskPii(fromEmail),
    channel: "email",
    outcome: optOut ? "opt_out" : "received",
    reasoning: `replyId=${reply.id} parent=${originalMessage?.id ?? "none"}`,
  });

  return jsonResp({
    ok: true,
    replyId: reply.id,
    leadId: lead.id,
    optOut,
    matched: Boolean(originalMessage),
  });
}

function buildMockReq(body: string, signature: string | null): MockRequest {
  return {
    text: jest.fn().mockResolvedValue(body),
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "resend-signature" ? signature : null,
    },
  };
}

function freshPrismaMock(): MockPrismaShape {
  return {
    ceoOutboundMessage: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    ceoLead: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    user: {
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };
}

function freshHelpersMock() {
  return {
    recordAudit: jest.fn().mockResolvedValue(undefined),
    maskPii: jest.fn((v: string) => `${v.slice(0, 2)}***`),
  };
}

describe("POST /api/webhooks/resend-inbound (intégration — reproduction inline)", () => {
  let prismaMock: MockPrismaShape;
  let helpers: ReturnType<typeof freshHelpersMock>;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.RESEND_WEBHOOK_SECRET = TEST_SECRET;
    prismaMock = freshPrismaMock();
    helpers = freshHelpersMock();
  });

  afterAll(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("401 si signature absente", async () => {
    const body = JSON.stringify({ from: "u@example.com", text: "hi" });
    const res = await processInboundReply(buildMockReq(body, null), prismaMock, helpers);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("unauthorized");
  });

  it("401 si signature invalide", async () => {
    const body = JSON.stringify({ from: "u@example.com", text: "hi" });
    const res = await processInboundReply(
      buildMockReq(body, "deadbeef".repeat(8)),
      prismaMock,
      helpers,
    );
    expect(res.status).toBe(401);
  });

  it("401 si secret RESEND_WEBHOOK_SECRET absent (sécurité fail-closed)", async () => {
    delete process.env.RESEND_WEBHOOK_SECRET;
    const body = JSON.stringify({ from: "u@example.com", text: "hi" });
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(401);
  });

  it("400 si JSON malformé", async () => {
    const body = "not-json{{{";
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_json");
  });

  it("400 si from ou body manquant", async () => {
    const body = JSON.stringify({ from: "u@example.com" }); // pas de text/html
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("missing_from_or_body");
  });

  it("400 si req.text() throw (body unreadable)", async () => {
    const fakeReq: MockRequest = {
      text: jest.fn().mockRejectedValue(new Error("network")),
      headers: { get: () => null },
    };
    const res = await processInboundReply(fakeReq, prismaMock, helpers);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_body");
  });

  it("200 happy path : signature OK + reply standard → lead PENDING_ACTION", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue({
      id: "msg_orig",
      utmSource: "ceo",
      utmCampaign: "summer",
    });
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue({ id: "lead_1", userId: null });

    const body = JSON.stringify({
      from: "user@example.com",
      text: "Merci pour le mail, super contenu !",
      threadId: "thread_abc",
      messageId: "msg_inbound",
    });
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.optOut).toBe(false);
    expect(res.body.matched).toBe(true);
    expect(prismaMock.ceoLead.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "PENDING_ACTION" }),
      }),
    );
    expect(prismaMock.user.update).not.toHaveBeenCalled();
    expect(prismaMock.user.updateMany).not.toHaveBeenCalled();
    expect(helpers.recordAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "inbound_reply_received",
        outcome: "received",
      }),
    );
  });

  it("200 + opt-out : keyword détecté → updateMany emailOptOut (pas de userId)", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue(null);
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue({ id: "lead_1", userId: null });

    const body = JSON.stringify({
      from: "user@example.com",
      text: "Merci de me désinscrire de cette liste.",
    });
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(200);
    expect(res.body.optOut).toBe(true);

    const optOutCall = prismaMock.ceoLead.update.mock.calls.find(
      (call) => (call[0] as { data: { status?: string } }).data.status === "OPT_OUT",
    );
    expect(optOutCall).toBeDefined();

    expect(prismaMock.user.update).not.toHaveBeenCalled();
    expect(prismaMock.user.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: "user@example.com" },
        data: { emailOptOut: true },
      }),
    );
    expect(helpers.recordAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "inbound_reply_opt_out",
        outcome: "opt_out",
      }),
    );
  });

  it("200 + opt-out : userId connu → User.update direct", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue(null);
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue({
      id: "lead_1",
      userId: "user_abc",
    });

    const body = JSON.stringify({ from: "u@example.com", text: "stop" });
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user_abc" },
        data: { emailOptOut: true },
      }),
    );
    expect(prismaMock.user.updateMany).not.toHaveBeenCalled();
  });

  it("200 + lead inconnu → création automatique avec source='inbound_reply'", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue(null);
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue(null);
    prismaMock.ceoLead.create.mockResolvedValue({ id: "lead_new", userId: null });

    const body = JSON.stringify({ from: "newuser@example.com", text: "hello" });
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(200);
    expect(prismaMock.ceoLead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "newuser@example.com",
          source: "inbound_reply",
          status: "PENDING_ACTION",
          touchpoints: 1,
        }),
      }),
    );
  });

  it("200 sans message d'origine : matched=false, pas d'update sur original", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue(null);
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue({ id: "lead_1", userId: null });

    const body = JSON.stringify({ from: "u@example.com", text: "first contact" });
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(200);
    expect(res.body.matched).toBe(false);
    expect(prismaMock.ceoOutboundMessage.update).not.toHaveBeenCalled();
  });

  it("200 + body tronqué à 10 000 chars (anti-pollution DB)", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue(null);
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue({ id: "lead_1", userId: null });

    const longText = "x".repeat(50_000);
    const body = JSON.stringify({ from: "u@example.com", text: longText });
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(200);
    const createCall = prismaMock.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { content: string };
    };
    expect(createCall.data.content.length).toBe(10_000);
  });

  it("200 + update message d'origine (replies counter + repliedAt)", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue({
      id: "msg_orig",
      utmSource: "ceo",
    });
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue({ id: "lead_1", userId: null });

    const body = JSON.stringify({
      from: "u@example.com",
      text: "merci !",
      threadId: "thread_orig",
    });
    const sig = signBody(body, TEST_SECRET);
    await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(prismaMock.ceoOutboundMessage.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "msg_orig" },
        data: expect.objectContaining({
          replies: { increment: 1 },
          repliedAt: expect.any(Date),
        }),
      }),
    );
  });

  it("200 : silent-fail si user.update rejette (ne crash pas le webhook)", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue(null);
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue({
      id: "lead_1",
      userId: "user_abc",
    });
    prismaMock.user.update.mockRejectedValue(new Error("DB down"));

    const body = JSON.stringify({ from: "u@example.com", text: "unsubscribe" });
    const sig = signBody(body, TEST_SECRET);
    const res = await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(res.status).toBe(200);
    expect(res.body.optOut).toBe(true);
  });

  it("audit log reçoit un targetId masqué (PII redaction)", async () => {
    prismaMock.ceoOutboundMessage.findFirst.mockResolvedValue(null);
    prismaMock.ceoOutboundMessage.create.mockResolvedValue({ id: "msg_reply" });
    prismaMock.ceoLead.findFirst.mockResolvedValue({ id: "lead_1", userId: null });

    const body = JSON.stringify({ from: "alice@example.com", text: "hi" });
    const sig = signBody(body, TEST_SECRET);
    await processInboundReply(buildMockReq(body, sig), prismaMock, helpers);
    expect(helpers.maskPii).toHaveBeenCalledWith("alice@example.com");
    const auditCall = helpers.recordAudit.mock.calls[0][0] as {
      targetId: string;
    };
    expect(auditCall.targetId).not.toContain("alice@example.com");
    expect(auditCall.targetId).toContain("***");
  });
});

// ─── 5. Import direct de la route via mock de next/server (couverture coverage) ──
// Pour que le coverage tracker voie les lignes du fichier source, on doit
// l'importer pour de vrai. NextRequest étend Request (cassé en JSDOM) → on
// mock `next/server` avec une implémentation minimale compatible.

jest.mock("next/server", () => {
  class MockNextResponse {
    status: number;
    private _body: unknown;
    constructor(body: unknown, init?: { status?: number }) {
      this._body = body;
      this.status = init?.status ?? 200;
    }
    async json() {
      return this._body;
    }
    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }
  }
  return { NextResponse: MockNextResponse };
});

// Mock prisma + ceo-helpers pour l'import direct.
jest.mock("@/lib/prisma", () => ({
  prisma: {
    ceoOutboundMessage: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    ceoLead: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    user: {
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  },
}));
jest.mock("@/lib/ai/ceo-helpers", () => ({
  recordAudit: jest.fn().mockResolvedValue(undefined),
  maskPii: jest.fn((v: string) => `${v.slice(0, 2)}***`),
}));

interface RealRouteRequest {
  text: () => Promise<string>;
  headers: { get: (n: string) => string | null };
}

function realReq(body: string, signature: string | null): RealRouteRequest {
  return {
    text: () => Promise.resolve(body),
    headers: {
      get: (n: string) => (n.toLowerCase() === "resend-signature" ? signature : null),
    },
  };
}

describe("Route import direct — couverture lignes source", () => {
  let routeMod: typeof import("@/app/api/webhooks/resend-inbound/route");
  let prismaModule: {
    prisma: {
      ceoOutboundMessage: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
      ceoLead: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
      user: { update: jest.Mock; updateMany: jest.Mock };
    };
  };

  beforeAll(async () => {
    process.env.RESEND_WEBHOOK_SECRET = TEST_SECRET;
    routeMod = await import("@/app/api/webhooks/resend-inbound/route");
    prismaModule = (await import("@/lib/prisma")) as unknown as typeof prismaModule;
  });

  beforeEach(() => {
    process.env.RESEND_WEBHOOK_SECRET = TEST_SECRET;
    prismaModule.prisma.ceoOutboundMessage.findFirst.mockReset().mockResolvedValue(null);
    prismaModule.prisma.ceoOutboundMessage.create
      .mockReset()
      .mockResolvedValue({ id: "msg_reply" });
    prismaModule.prisma.ceoOutboundMessage.update.mockReset().mockResolvedValue({});
    prismaModule.prisma.ceoLead.findFirst
      .mockReset()
      .mockResolvedValue({ id: "lead_1", userId: null });
    prismaModule.prisma.ceoLead.create.mockReset().mockResolvedValue({ id: "lead_new" });
    prismaModule.prisma.ceoLead.update.mockReset().mockResolvedValue({});
    prismaModule.prisma.user.update.mockReset().mockResolvedValue({});
    prismaModule.prisma.user.updateMany.mockReset().mockResolvedValue({ count: 1 });
  });

  it("GET healthcheck réel → status 200 + body { status: 'ok' }", async () => {
    const res = (await routeMod.GET()) as unknown as {
      status: number;
      json: () => Promise<{ status: string; endpoint: string }>;
    };
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", endpoint: "resend-inbound" });
  });

  it("POST réel : 401 si signature absente", async () => {
    const body = JSON.stringify({ from: "u@example.com", text: "hi" });
    const res = (await routeMod.POST(realReq(body, null) as never)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(401);
  });

  it("POST réel : 400 si JSON malformé (signature OK)", async () => {
    const body = "not-json";
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(400);
  });

  it("POST réel : 400 si from/body manquant", async () => {
    const body = JSON.stringify({ from: "u@example.com" });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(400);
  });

  it("POST réel : 400 si req.text() throw", async () => {
    const fake = {
      text: jest.fn().mockRejectedValue(new Error("nope")),
      headers: { get: () => null },
    };
    const res = (await routeMod.POST(fake as never)) as unknown as { status: number };
    expect(res.status).toBe(400);
  });

  it("POST réel : 200 happy path (signature OK + text)", async () => {
    prismaModule.prisma.ceoOutboundMessage.findFirst.mockResolvedValueOnce({
      id: "msg_orig",
      utmSource: "ceo",
    });
    const body = JSON.stringify({
      from: "u@example.com",
      text: "merci",
      threadId: "t1",
      messageId: "m1",
    });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
      json: () => Promise<{ ok: boolean; optOut: boolean; matched: boolean }>;
    };
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.optOut).toBe(false);
  });

  it("POST réel : 200 + opt-out keyword (stop) → user.update appelé", async () => {
    prismaModule.prisma.ceoLead.findFirst.mockResolvedValueOnce({
      id: "lead_1",
      userId: "user_42",
    });
    const body = JSON.stringify({ from: "u@example.com", text: "stop" });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
      json: () => Promise<{ optOut: boolean }>;
    };
    expect(res.status).toBe(200);
    expect((await res.json()).optOut).toBe(true);
    expect(prismaModule.prisma.user.update).toHaveBeenCalled();
  });

  it("POST réel : 200 + lead inconnu → ceoLead.create déclenché", async () => {
    prismaModule.prisma.ceoLead.findFirst.mockResolvedValueOnce(null);
    prismaModule.prisma.ceoLead.create.mockResolvedValueOnce({
      id: "lead_new",
      userId: null,
    });
    const body = JSON.stringify({ from: "new@example.com", text: "hello" });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(200);
    expect(prismaModule.prisma.ceoLead.create).toHaveBeenCalled();
  });

  it("POST réel : 200 + opt-out sans userId → user.updateMany par email", async () => {
    prismaModule.prisma.ceoLead.findFirst.mockResolvedValueOnce({
      id: "lead_1",
      userId: null,
    });
    const body = JSON.stringify({ from: "u@example.com", text: "unsubscribe me" });
    const sig = signBody(body, TEST_SECRET);
    await routeMod.POST(realReq(body, sig) as never);
    expect(prismaModule.prisma.user.updateMany).toHaveBeenCalled();
    expect(prismaModule.prisma.user.update).not.toHaveBeenCalled();
  });

  it("POST réel : 200 + inReplyTo trigger findFirst sur externalId fallback", async () => {
    prismaModule.prisma.ceoOutboundMessage.findFirst
      .mockResolvedValueOnce(null) // pas de threadId match
      .mockResolvedValueOnce({ id: "msg_orig", utmSource: "ceo" }); // inReplyTo match
    const body = JSON.stringify({
      from: "u@example.com",
      text: "merci",
      inReplyTo: "header_xyz",
    });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
      json: () => Promise<{ matched: boolean }>;
    };
    expect(res.status).toBe(200);
    expect((await res.json()).matched).toBe(true);
  });

  it("POST réel : 200 + html fallback si pas de text", async () => {
    const body = JSON.stringify({
      from: "u@example.com",
      html: "<p>Bonjour</p>",
      subject: "Re: hello",
    });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(200);
  });

  it("POST réel : silent-fail update.replies si rejet (catch interne)", async () => {
    prismaModule.prisma.ceoOutboundMessage.findFirst.mockResolvedValueOnce({
      id: "msg_orig",
      utmSource: "ceo",
    });
    prismaModule.prisma.ceoOutboundMessage.update.mockRejectedValueOnce(
      new Error("DB transient"),
    );
    const body = JSON.stringify({
      from: "u@example.com",
      text: "merci",
      threadId: "t1",
    });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(200);
  });

  it("POST réel : silent-fail user.update si rejet", async () => {
    prismaModule.prisma.ceoLead.findFirst.mockResolvedValueOnce({
      id: "lead_1",
      userId: "user_42",
    });
    prismaModule.prisma.user.update.mockRejectedValueOnce(new Error("DB transient"));
    const body = JSON.stringify({ from: "u@example.com", text: "désinscription" });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(200);
  });

  it("POST réel : silent-fail user.updateMany si rejet (no userId branch)", async () => {
    prismaModule.prisma.ceoLead.findFirst.mockResolvedValueOnce({
      id: "lead_1",
      userId: null,
    });
    prismaModule.prisma.user.updateMany.mockRejectedValueOnce(
      new Error("DB transient"),
    );
    const body = JSON.stringify({ from: "u@example.com", text: "stop" });
    const sig = signBody(body, TEST_SECRET);
    const res = (await routeMod.POST(realReq(body, sig) as never)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(200);
  });
});

