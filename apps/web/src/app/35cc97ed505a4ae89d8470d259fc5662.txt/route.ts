import { NextResponse } from "next/server";

const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? "35cc97ed505a4ae89d8470d259fc5662";

/**
 * Serves the IndexNow key at /{key}.txt (alternate verification URL).
 * Some IndexNow-compatible engines check this path directly.
 */
export async function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
