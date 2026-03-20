// ───────────────────────────────────────────────────────────────────
// Instagram Graph API Client — deviens-marrant.fr
//
// Gère : publication d'images, carousels, récupération analytics.
// Auth : Meta Graph API (Instagram Business Account).
//
// Secrets Replit nécessaires :
//   INSTAGRAM_ACCESS_TOKEN   — Long-lived token (60 jours, à renouveler)
//   INSTAGRAM_BUSINESS_ID    — ID du compte Instagram Business
//
// Pipeline publication (Instagram impose un flow asynchrone) :
//   1. Créer un "media container" (POST /{ig-user-id}/media)
//   2. Attendre que le container soit "FINISHED" (GET /{container-id}?fields=status_code)
//   3. Publier le container (POST /{ig-user-id}/media_publish)
// ───────────────────────────────────────────────────────────────────

// ⚠️  DEPRECATED — Remplacé par buffer-client.ts (mars 2026)
// Ce fichier est conservé comme fallback mais ne doit PAS être utilisé
// pour de nouvelles fonctionnalités. Toute publication passe par Buffer.

const GRAPH_API = "https://graph.facebook.com/v19.0";

interface InstagramConfig {
  accessToken: string;
  businessId: string;
}

function getConfig(): InstagramConfig {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_ID;

  if (!accessToken || !businessId) {
    throw new Error(
      "Instagram API credentials manquantes. Configure INSTAGRAM_ACCESS_TOKEN et INSTAGRAM_BUSINESS_ID dans les Secrets Replit.",
    );
  }

  return { accessToken, businessId };
}

// ─── Helpers ─────────────────────────────────────────────────────

async function graphPost(
  path: string,
  params: Record<string, string>,
): Promise<Record<string, unknown>> {
  const config = getConfig();
  const url = `${GRAPH_API}${path}`;

  const body = new URLSearchParams({
    ...params,
    access_token: config.accessToken,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Instagram API ${res.status}: ${err}`);
  }

  return res.json() as Promise<Record<string, unknown>>;
}

async function graphGet(
  path: string,
  params: Record<string, string> = {},
): Promise<Record<string, unknown>> {
  const config = getConfig();
  const searchParams = new URLSearchParams({
    ...params,
    access_token: config.accessToken,
  });

  const url = `${GRAPH_API}${path}?${searchParams.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Instagram API ${res.status}: ${err}`);
  }

  return res.json() as Promise<Record<string, unknown>>;
}

/**
 * Attend qu'un media container soit prêt (status FINISHED).
 * Instagram traite les uploads de manière asynchrone.
 * Timeout : 60 secondes max.
 */
async function waitForContainer(containerId: string): Promise<void> {
  const maxAttempts = 12;
  const delayMs = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    const data = await graphGet(`/${containerId}`, {
      fields: "status_code",
    });

    const status = data.status_code as string;

    if (status === "FINISHED") return;
    if (status === "ERROR") {
      throw new Error(
        `Container ${containerId} en erreur: ${JSON.stringify(data)}`,
      );
    }

    // IN_PROGRESS — attendre
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(
    `Timeout: container ${containerId} toujours en cours après ${(maxAttempts * delayMs) / 1000}s`,
  );
}

// ─── Publication ─────────────────────────────────────────────────

/**
 * Publie une image sur Instagram.
 * @param imageUrl URL publique de l'image (doit être accessible par les serveurs Meta)
 * @param caption Texte de la publication
 * @returns ID de la publication Instagram
 */
export async function postImage(
  imageUrl: string,
  caption: string,
): Promise<string> {
  const config = getConfig();

  // Step 1 : Créer le container
  const container = await graphPost(`/${config.businessId}/media`, {
    image_url: imageUrl,
    caption,
  });

  const containerId = container.id as string;

  // Step 2 : Attendre que le container soit prêt
  await waitForContainer(containerId);

  // Step 3 : Publier
  const result = await graphPost(`/${config.businessId}/media_publish`, {
    creation_id: containerId,
  });

  return result.id as string;
}

/**
 * Publie un carousel sur Instagram.
 * @param imageUrls URLs publiques des images (2-10 images)
 * @param caption Texte de la publication
 * @returns ID de la publication Instagram
 */
export async function postCarousel(
  imageUrls: string[],
  caption: string,
): Promise<string> {
  if (imageUrls.length < 2 || imageUrls.length > 10) {
    throw new Error(
      `Carousel Instagram : 2-10 images requises (reçu ${imageUrls.length})`,
    );
  }

  const config = getConfig();

  // Step 1 : Créer un container par image (type = item carousel)
  const childIds: string[] = [];
  for (const url of imageUrls) {
    const child = await graphPost(`/${config.businessId}/media`, {
      image_url: url,
      is_carousel_item: "true",
    });
    childIds.push(child.id as string);
  }

  // Step 2 : Attendre que tous les containers enfants soient prêts
  await Promise.all(childIds.map((id) => waitForContainer(id)));

  // Step 3 : Créer le container carousel parent
  const carousel = await graphPost(`/${config.businessId}/media`, {
    media_type: "CAROUSEL",
    caption,
    children: childIds.join(","),
  });

  const carouselId = carousel.id as string;
  await waitForContainer(carouselId);

  // Step 4 : Publier
  const result = await graphPost(`/${config.businessId}/media_publish`, {
    creation_id: carouselId,
  });

  return result.id as string;
}

// ─── Analytics ───────────────────────────────────────────────────

export interface InstagramMetrics {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

/**
 * Récupère les métriques d'un post Instagram.
 * Nécessite le scope instagram_manage_insights.
 */
export async function getInstagramMetrics(
  postId: string,
): Promise<InstagramMetrics> {
  try {
    const data = await graphGet(`/${postId}`, {
      fields: "like_count,comments_count",
    });

    const likeCount = (data.like_count as number) ?? 0;
    const commentsCount = (data.comments_count as number) ?? 0;

    // Insights détaillées (peut échouer selon le type de post)
    let impressions = 0;
    let reach = 0;
    let saves = 0;
    let shares = 0;

    try {
      const insights = await graphGet(`/${postId}/insights`, {
        metric: "impressions,reach,saved,shares",
      });

      const insightsData = (insights.data as Array<{ name: string; values: Array<{ value: number }> }>) || [];
      for (const metric of insightsData) {
        const value = metric.values?.[0]?.value ?? 0;
        switch (metric.name) {
          case "impressions":
            impressions = value;
            break;
          case "reach":
            reach = value;
            break;
          case "saved":
            saves = value;
            break;
          case "shares":
            shares = value;
            break;
        }
      }
    } catch {
      // Insights non disponibles (post trop récent ou permissions insuffisantes)
    }

    return { impressions, reach, likes: likeCount, comments: commentsCount, saves, shares };
  } catch (err) {
    console.error(`[instagram] Erreur metrics ${postId}:`, err);
    return { impressions: 0, reach: 0, likes: 0, comments: 0, saves: 0, shares: 0 };
  }
}

// ─── Config check ────────────────────────────────────────────────

/**
 * Vérifie que les credentials Instagram sont configurées.
 */
export function isInstagramConfigured(): boolean {
  return !!(
    process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ID
  );
}
