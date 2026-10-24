import { NextResponse } from "next/server";
import { WIDGET_VANNE_DU_JOUR_PUBLIE } from "@/config/widget-vanne-du-jour";
import {
  getWidgetVanneDuJour,
  hostFromHeader,
  isDomaineBloque,
  toWidgetApiPayload,
  widgetSharedMaxAge,
} from "@/lib/widget/vanne-du-jour";

/**
 * API publique du widget « La vanne du jour » (s22), lecture seule.
 * Rendu dynamique : la vanne dépend du jour UTC et `utm_content` de
 * l'origine appelante ; la base n'est lue qu'une fois par jour et par point de
 * présence (Cache API, voir getWidgetVanneDuJour).
 * Limite de requêtes : règle Cloudflare (WAF) par IP, voir REPLIT_ACTIONS.md
 * (un compteur en mémoire serait propre à chaque isolate Workers, donc faux).
 */
export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
} as const;

const BASE_HEADERS = {
  ...CORS_HEADERS,
  "X-Robots-Tag": "noindex",
  Vary: "Origin, Referer",
} as const;

function indisponible(status: 403 | 503, error: string): NextResponse {
  return NextResponse.json(
    { type: "vanne", error },
    {
      status,
      headers: {
        ...BASE_HEADERS,
        // 403 jamais en cache partagé (blocage par domaine) ; 503 court, navigateur seulement.
        "Cache-Control": status === 403 ? "private, no-store" : "public, max-age=60",
        ...(status === 503 ? { "Retry-After": "3600" } : {}),
      },
    },
  );
}

export async function GET(request: Request) {
  const host =
    hostFromHeader(request.headers.get("origin")) ?? hostFromHeader(request.headers.get("referer"));
  if (isDomaineBloque(host)) return indisponible(403, "acces-refuse");
  if (!WIDGET_VANNE_DU_JOUR_PUBLIE) return indisponible(503, "indisponible");

  try {
    const now = new Date();
    const vanne = await getWidgetVanneDuJour(now);
    if (!vanne) return indisponible(503, "indisponible");
    const sMaxAge = widgetSharedMaxAge(now);
    return NextResponse.json(toWidgetApiPayload(vanne, host), {
      headers: {
        ...BASE_HEADERS,
        "Cache-Control": `public, max-age=${Math.min(300, sMaxAge)}, s-maxage=${sMaxAge}`,
      },
    });
  } catch {
    return indisponible(503, "indisponible");
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
