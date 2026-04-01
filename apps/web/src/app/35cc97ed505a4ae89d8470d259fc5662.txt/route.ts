import { NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "";

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
