import "@testing-library/jest-dom";

// Polyfill Web APIs for Next.js App Router routes (Request/Response/Headers/fetch)
// jsdom n'expose pas ces globals, mais Node 18+ les fournit nativement.
// Sans ce polyfill, importer une route Next.js plante avec "ReferenceError: Request is not defined".
{
  const g = globalThis as unknown as Record<string, unknown>;
  if (typeof g.Request === "undefined") g.Request = (global as any).Request ?? require("node:stream/web").Request;
  if (typeof g.Response === "undefined") g.Response = (global as any).Response;
  if (typeof g.Headers === "undefined") g.Headers = (global as any).Headers;
  if (typeof g.fetch === "undefined") g.fetch = (global as any).fetch;
}
