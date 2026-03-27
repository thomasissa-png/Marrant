import { NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "";

/**
 * Serves the IndexNow verification key at /indexnow-key.txt
 * Required by Bing/IndexNow to verify domain ownership.
 * Static file in public/ doesn't work in standalone mode on Replit.
 */
export async function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
