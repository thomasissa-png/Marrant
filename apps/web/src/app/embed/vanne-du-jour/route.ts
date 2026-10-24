import { WIDGET_VANNE_DU_JOUR_PUBLIE } from "@/config/widget-vanne-du-jour";
import { getWidgetVanneDuJour, hostFromHeader, isDomaineBloque } from "@/lib/widget/vanne-du-jour";
import { parseWidgetTheme, renderEmbedRepli, renderEmbedVanne } from "@/lib/widget/embed-html";

/**
 * Page d'iframe du widget « La vanne du jour » (s22). Route handler et non
 * page React : document autonome (ni gabarit, ni Umami, ni cookie, ni JS
 * Next), quelques Ko. Rendu dynamique (jour de Paris, contrôle du Referer) ;
 * la base n'est lue qu'une fois par jour et par point de présence.
 * En-têtes de sécurité (encadrable, noindex, CSP) : next.config.js, /embed/*.
 * Le HTML est identique pour tous les hôtes (`utm_content` est complété dans
 * le navigateur) : cache navigateur court seulement, jamais de cache partagé,
 * pour que le blocage par domaine reste effectif.
 */
export const dynamic = "force-dynamic";

function html(body: string, status: number, cacheControl: string): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": cacheControl,
      Vary: "Referer",
    },
  });
}

export async function GET(request: Request) {
  const theme = parseWidgetTheme(new URL(request.url).searchParams.get("theme"));
  if (isDomaineBloque(hostFromHeader(request.headers.get("referer")))) {
    return html(renderEmbedRepli(theme), 403, "private, no-store");
  }
  if (!WIDGET_VANNE_DU_JOUR_PUBLIE) return html(renderEmbedRepli(theme), 503, "private, max-age=60");
  try {
    const vanne = await getWidgetVanneDuJour();
    if (!vanne) return html(renderEmbedRepli(theme), 503, "private, max-age=60");
    return html(renderEmbedVanne(vanne, theme), 200, "private, max-age=300");
  } catch {
    return html(renderEmbedRepli(theme), 503, "private, max-age=60");
  }
}
