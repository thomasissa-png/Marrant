import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Serves llms.txt for LLM crawlers (GEO optimization).
 * Static file in public/ doesn't work in standalone mode on Replit.
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "llms.txt");
    const content = readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("# deviens-marrant.fr\n\nFichier non disponible.", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
