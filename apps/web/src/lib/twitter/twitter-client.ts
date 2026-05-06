/**
 * Twitter API v2 client — DM + user lookup pour CEO Agent.
 *
 * Endpoints :
 *  - POST /2/dm_conversations/with/:participant_id/messages
 *  - GET  /2/users/by/username/:username
 *
 * Auth : OAuth 2.0 Bearer Token (TWITTER_BEARER_TOKEN).
 * Note : la création de DM nécessite OAuth 1.0a User Context en prod
 * (TWITTER_API_KEY + TWITTER_API_SECRET + TWITTER_ACCESS_TOKEN + TWITTER_ACCESS_SECRET).
 * Le bearer suffit pour le lookup public ; le DM POST exige user-context.
 *
 * Rate limits gérés :
 *  - 429 → backoff 15 min (re-throw avec status pour le caller)
 *  - 401 → token invalide (ne tente pas de refresh — Thomas régénère manuel)
 *  - 403 → utilisateur n'autorise pas les DM ou compte protégé → skip permanent
 *
 * Limites char :
 *  - Twitter DM : 10 000 chars max
 *  - Cible CEO : 270 chars (cohérent avec MINI_STANDUP / DM_TWITTER limit)
 */

const TWITTER_API_BASE = "https://api.twitter.com/2";

// ─── Types ───────────────────────────────────────────────────────────────

export interface TwitterDmResult {
  ok: boolean;
  externalId?: string; // dm_event_id (Twitter)
  error?: "rate_limit" | "unauthorized" | "forbidden" | "not_found" | "invalid" | "server";
  errorMessage?: string;
  retryAfterSeconds?: number;
}

export interface TwitterUserLookupResult {
  ok: boolean;
  userId?: string;
  username?: string;
  error?: "rate_limit" | "unauthorized" | "not_found" | "invalid" | "server";
  errorMessage?: string;
}

// ─── Auth helpers ────────────────────────────────────────────────────────

function getBearerToken(): string {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token || token.startsWith("...") || token.length < 20) {
    throw new Error(
      "TWITTER_BEARER_TOKEN absent ou placeholder — configurer Replit Secrets",
    );
  }
  return token;
}

function buildAuthHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getBearerToken()}`,
    "Content-Type": "application/json",
  };
}

// ─── User lookup (GET /2/users/by/username/:username) ────────────────────

/**
 * Résout un handle Twitter (`@thomas`) en user ID numérique.
 * Le DM v2 endpoint exige un participant_id (numérique), pas un handle.
 */
export async function lookupTwitterUserId(
  handle: string,
): Promise<TwitterUserLookupResult> {
  const cleanHandle = handle.replace(/^@/, "").trim();
  if (!cleanHandle || !/^[A-Za-z0-9_]{1,15}$/.test(cleanHandle)) {
    return { ok: false, error: "invalid", errorMessage: `Handle invalide : ${handle}` };
  }

  try {
    const res = await fetch(
      `${TWITTER_API_BASE}/users/by/username/${encodeURIComponent(cleanHandle)}`,
      {
        method: "GET",
        headers: buildAuthHeaders(),
        signal: AbortSignal.timeout(5_000),
      },
    );

    if (res.status === 429) {
      return { ok: false, error: "rate_limit", errorMessage: "Twitter rate limit (lookup)" };
    }
    if (res.status === 401) {
      return { ok: false, error: "unauthorized", errorMessage: "Token Twitter invalide" };
    }
    if (res.status === 404) {
      return { ok: false, error: "not_found", errorMessage: `User @${cleanHandle} introuvable` };
    }
    if (!res.ok) {
      return {
        ok: false,
        error: "server",
        errorMessage: `Twitter lookup failed status=${res.status}`,
      };
    }

    const json = (await res.json()) as { data?: { id: string; username: string } };
    if (!json.data?.id) {
      return { ok: false, error: "not_found", errorMessage: "Réponse Twitter sans data.id" };
    }
    return { ok: true, userId: json.data.id, username: json.data.username };
  } catch (err) {
    return {
      ok: false,
      error: "server",
      errorMessage: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── DM send (POST /2/dm_conversations/with/:participant_id/messages) ────

/**
 * Envoie un DM Twitter.
 * `recipientUserId` : user ID numérique (résolu via `lookupTwitterUserId`).
 * `message` : texte (≤ 270 chars recommandé pour cohérence MINI_STANDUP, max 10000 hard cap).
 *
 * Erreurs gérées :
 *  - 429 : rate limit, retryAfterSeconds renvoyé pour backoff par le caller
 *  - 401 : token invalide (Thomas régénère manuellement)
 *  - 403 : DM non autorisés par le destinataire OU compte protégé → skip permanent
 *  - 404 : user introuvable
 */
export async function sendTwitterDm(
  recipientUserId: string,
  message: string,
): Promise<TwitterDmResult> {
  if (!recipientUserId || !/^\d+$/.test(recipientUserId)) {
    return { ok: false, error: "invalid", errorMessage: "recipientUserId doit être numérique" };
  }
  if (!message || message.length === 0) {
    return { ok: false, error: "invalid", errorMessage: "Message vide" };
  }
  if (message.length > 10_000) {
    return { ok: false, error: "invalid", errorMessage: "Message > 10 000 chars (Twitter hard cap)" };
  }

  try {
    const res = await fetch(
      `${TWITTER_API_BASE}/dm_conversations/with/${recipientUserId}/messages`,
      {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({ text: message }),
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") ?? "900"); // 15 min default
      return {
        ok: false,
        error: "rate_limit",
        errorMessage: "Twitter DM rate limit",
        retryAfterSeconds: retryAfter,
      };
    }
    if (res.status === 401) {
      return { ok: false, error: "unauthorized", errorMessage: "Token Twitter invalide pour DM" };
    }
    if (res.status === 403) {
      return {
        ok: false,
        error: "forbidden",
        errorMessage: "DM refusé (compte protégé ou DM désactivés)",
      };
    }
    if (res.status === 404) {
      return { ok: false, error: "not_found", errorMessage: "User Twitter introuvable" };
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return {
        ok: false,
        error: "server",
        errorMessage: `Twitter DM failed status=${res.status} body=${txt.slice(0, 200)}`,
      };
    }

    const json = (await res.json()) as {
      data?: { dm_event_id?: string; dm_conversation_id?: string };
    };
    return {
      ok: true,
      externalId: json.data?.dm_event_id ?? json.data?.dm_conversation_id,
    };
  } catch (err) {
    return {
      ok: false,
      error: "server",
      errorMessage: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Helper combiné : lookup handle puis send DM.
 * Utilisé par `handleOutboundDm` quand on n'a que le handle (`@thomas`)
 * et pas le user ID numérique.
 */
export async function sendTwitterDmByHandle(
  handle: string,
  message: string,
): Promise<TwitterDmResult & { lookupHandle?: string }> {
  const lookup = await lookupTwitterUserId(handle);
  if (!lookup.ok || !lookup.userId) {
    return {
      ok: false,
      error: lookup.error ?? "not_found",
      errorMessage: lookup.errorMessage ?? "Lookup handle échoué",
      lookupHandle: handle,
    };
  }
  const send = await sendTwitterDm(lookup.userId, message);
  return { ...send, lookupHandle: handle };
}
