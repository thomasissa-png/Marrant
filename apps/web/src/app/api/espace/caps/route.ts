import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { garderApiEspace } from "@/lib/espace/garde";
import { lireEtatCaps, marquerAnnonces } from "@/lib/espace/caps-serveur";
import { bonusOuverts, bonusRanges, hrefBonus } from "@/lib/espace/bonus";
import { etapeAReprendre } from "@/lib/espace/quatre-semaines";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { derniereValidation } from "@/lib/parcours-xp";
import { ecouterPublie } from "@/lib/espace/ecouter-publie";

/**
 * /api/espace/caps (s24, lot D4). Interrupteur fermé : 404 avant toute lecture (garde). 401 sans
 * session, 403 sans abonnement actif (plan relu en base), 503 base indisponible.
 * GET : cap affiché (total d'XP), cap de déblocage (étapes et bonus de fin), série, bonus ouverts,
 *   annonce à faire (ou null), étape à reprendre. Une requête agrégée par table.
 * POST : acquittement de l'annonce montrée ; le serveur n'écrit que ce qui est dû (jamais un cap
 *   ou un bonus non atteint), `silencieux = false`. Ni XP ni cap ne bougent ici.
 */
export const dynamic = "force-dynamic";

const json = (d: Record<string, unknown>, status = 200) =>
  NextResponse.json(d, { status, headers: { "Cache-Control": "private, no-store" } });

const ACCES = (userId: string) => ({ acces: "ouvert" as const, userId });

export async function GET() {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  try {
    const acces = ACCES(garde.userId);
    const [etat, progressions] = await Promise.all([
      lireEtatCaps(prisma, garde.userId, bonusRanges(acces)),
      prisma.userPathProgress.findMany({
        where: { userId: garde.userId },
        select: {
          completedSteps: true,
          completedAt: true,
          startedAt: true,
          learningPath: { select: { slug: true, stepCompletions: { where: { userId: garde.userId }, select: { completedAt: true } } } },
        },
      }),
    ]);
    const { annonce } = etat;
    const derniere = (v: { completedAt: Date }[]) => derniereValidation(v);
    return json({
      xp: etat.xp,
      serie: etat.serie,
      capAffiche: etat.capAffiche,
      capDeblocage: etat.capDeblocage,
      ecart: etat.capAffiche > etat.capDeblocage,
      bonus: bonusOuverts(etat.capDeblocage, acces),
      // Lot D11b (@ux D-1) : la semaine 4 du calendrier ne promet « Écouter, repérer » que si une fiche est publiée.
      ecouterPublie: ecouterPublie(),
      annonce:
        annonce.cap || annonce.bonus
          ? {
              cap: annonce.cap,
              bonus: annonce.bonus ? { cap: annonce.bonus.cap, titre: annonce.bonus.titre, href: hrefBonus(annonce.bonus.id) } : null,
              marques: annonce.aMarquer,
            }
          : null,
      etape: etapeAReprendre(
        progressions.map((p) => {
          const d = derniere(p.learningPath.stepCompletions);
          return {
            slug: p.learningPath.slug,
            completedSteps: p.completedSteps,
            termine: p.completedAt !== null,
            derniere: d ? new Date(d) : null,
            startedAt: p.startedAt,
          };
        }),
        PARCOURS_SEED_JSON,
      ),
    });
  } catch (error) {
    console.error("[espace/caps] lecture impossible :", error);
    return json({ error: "indisponible" }, 503);
  }
}

const corps = z
  .object({
    annonces: z
      .array(z.object({ type: z.enum(["CAP", "BONUS"]), numero: z.number().int().min(2).max(5) }).strict())
      .min(1)
      .max(8),
  })
  .strict();

export async function POST(request: Request) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const lu = corps.safeParse(await request.json().catch(() => null));
  if (!lu.success) return json({ error: "valeur" }, 400);
  try {
    const etat = await lireEtatCaps(prisma, garde.userId, bonusRanges(ACCES(garde.userId)));
    const dues = etat.annonce.aMarquer.filter((m) => lu.data.annonces.some((a) => a.type === m.type && a.numero === m.numero));
    const marquees = await marquerAnnonces(prisma, garde.userId, dues, false);
    return json({ ok: true, marquees });
  } catch (error) {
    console.error("[espace/caps] acquittement impossible :", error);
    return json({ error: "indisponible" }, 503);
  }
}
