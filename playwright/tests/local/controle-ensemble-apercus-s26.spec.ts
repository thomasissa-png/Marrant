import { randomBytes } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s26 contrôle d'ensemble, aperçus (`docs/captures/s26/controle-ensemble/RAPPORT.md`, décisions de Thomas du 19/11 et
 * du 20/11), interrupteur OUVERT seulement, en vrai navigateur sur la base jetable :
 * 1. C2 : aperçus du visiteur et du gratuit (8 adresses) : toute carte du premier écran porte le bandeau violet de
 *    l'accueil ; les cartes d'exemple et les tuiles fermées, en plus, un émoji ou une pastille (carte d'offre et carte
 *    de fin : le bandeau) ;
 * 2. La lettre (visiteur, gratuit, abonné) et le Profil (gratuit, abonné) : même règle sur les cartes principales ;
 * 3. Favoris de l'abonné sans favori : la carte d'état vide a le bandeau ;
 * 4. C3 : Aujourd'hui et Favoris (visiteur, gratuit, 1280 x 900 et 1920 x 1200) : jamais deux aplats violets dans une
 *    même fenêtre de la hauteur de l'écran ;
 * 5. C7 : aperçu du Carnet sans « 1 500+ » ;
 * 6. C5 : « Mes envois » (aperçu de Mes questions) : au plus 32 px vides sous son dernier contenu (1024, 1280, 1920).
 */
const MOT_DE_PASSE = "E2e-controle-apercus-s26!";
const VIOLETS = ["139, 92, 246", "167, 139, 250", "124, 58, 237", "109, 40, 217"];
const APERCUS = ["/mon-espace", "/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/mon-espace/questions", "/mon-espace/repliques", "/favoris", "/carnet"];

async function compte(page: Page, plan: "FREE" | "PREMIUM"): Promise<string> {
  const email = `e2e-ctrl-ap-${plan.toLowerCase()}-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  await connecter(page, email, MOT_DE_PASSE);
  return email;
}

async function ouvrir(page: Page, adresse: string, largeur: number, hauteur: number) {
  await page.setViewportSize({ width: largeur, height: hauteur });
  const r = await page.goto(adresse);
  expect(r?.status(), adresse).toBe(200);
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
}

type Carte = { nom: string; haut: number; bandeau: boolean; marque: boolean; offre: boolean };

/** Cartes visibles de `main` (cadre de carte : bord, rayon, fond de carte), bandeau (élément ou `::before`) et marque. */
async function cartes(page: Page, portee = "main"): Promise<Carte[]> {
  return page.evaluate((portee) => {
    const sortie: Carte[] = [];
    const racine = document.querySelector(portee);
    if (!racine) return sortie;
    for (const el of Array.from(racine.querySelectorAll<HTMLElement>(".bg-background-card.rounded-xl, .bg-background-card.rounded-2xl, [data-apercu-offre], [data-apercu-fin], [data-carnet-fin]"))) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width < 120 || r.height < 40 || cs.display === "none" || cs.visibility === "hidden") continue;
      // « Ton cap » du Profil (`TonCap` partagé, neutre sur cette page et sur Parcours) : hors de cette passe.
      if (el.closest("[aria-labelledby=ton-cap-titre]")) continue;
      const avant = getComputedStyle(el, "::before");
      const filet = Array.from(el.querySelectorAll<HTMLElement>(":scope > [data-bandeau-da], :scope > [data-filet]")).some((b) => getComputedStyle(b).display !== "none" && b.getBoundingClientRect().height >= 3);
      const bandeau = filet || (avant.content !== "none" && avant.backgroundImage.includes("gradient"));
      // Marque : rangée « émoji + pastille », pastille (`Badge`, violette ou neutre), émoji de l'accueil.
      const marque = !!el.querySelector("[data-pastilles-da], [data-carnet-pastilles], .bg-accent-primary\\/20, .rounded-full.px-2\\.5, .text-2xl[aria-hidden='true'], .text-3xl[aria-hidden='true']");
      const offre = el.matches("[data-apercu-offre], [data-apercu-fin], [data-carnet-fin]");
      sortie.push({ nom: (el.textContent ?? "").trim().slice(0, 40), haut: r.top + window.scrollY, bandeau, marque, offre });
    }
    return sortie;
  }, portee);
}

function controlerCartes(liste: Carte[], hauteur: number, ou: string, minimum = 1) {
  const premierEcran = liste.filter((c) => c.haut < hauteur);
  expect(premierEcran.length, `cartes au premier écran, ${ou}`).toBeGreaterThanOrEqual(minimum);
  for (const c of premierEcran) {
    expect(c.bandeau, `bandeau violet, « ${c.nom} », ${ou}`).toBe(true);
    if (!c.offre) expect(c.marque, `émoji ou pastille, « ${c.nom} », ${ou}`).toBe(true);
  }
}

test.describe("@espace s26 contrôle d'ensemble, aperçus (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(240_000);

  for (const lecteur of ["visiteur", "gratuit"] as const) {
    test(`point 1 : ${lecteur}, cartes des aperçus à la DA de l'accueil (375, 1280)`, async ({ page }) => {
      if (lecteur === "gratuit") await compte(page, "FREE");
      for (const adresse of APERCUS) {
        for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
          await ouvrir(page, adresse, largeur, hauteur);
          const ou = `${adresse}, ${lecteur}, ${largeur}`;
          controlerCartes(await cartes(page), hauteur, ou, 2);
          // Toutes les tuiles de l'extrait, au-delà du premier écran aussi : bandeau et marque.
          const tuiles = (await cartes(page, "[data-apercu-extrait]")).filter((c) => !c.offre);
          for (const t of tuiles) expect(t.bandeau && t.marque, `tuile « ${t.nom} », ${ou}`).toBe(true);
        }
      }
    });
  }

  test("point 2 : La lettre (visiteur, gratuit, abonné) et Profil (gratuit, abonné), cartes principales", async ({ page }) => {
    // Archive de l'abonné : les numéros déjà validés et dont la date est passée, marqués envoyés (base jetable seulement).
    // s26 derniers échecs : état d'avant relevé ici et rétabli à la fin (`finally`), envois de ce test supprimés. Sans
    // cela, dès le 05/11 (dates prévues passées), ces lettres restaient « envoyées » pour toute la suite : archive de
    // n'importe quel abonné remplie (`espace-bibliotheque` « Lettres vide », `nav-universelle-s24` critère 4) et dernier
    // numéro affiché au visiteur de /lettre (`typographie-s21`, corps d'e-mail montré tel qu'envoyé).
    const avant = await requete<{ id: string; status: string; sentAt: Date | null }>(
      `SELECT id, status::text AS status, "sentAt" FROM "NewsletterIssue" WHERE status IN ('VALIDE', 'ENVOYE') AND "scheduledFor" <= now()`,
    );
    await requete(`UPDATE "NewsletterIssue" SET status = 'ENVOYE', "sentAt" = "scheduledFor", "updatedAt" = now() WHERE status IN ('VALIDE', 'ENVOYE') AND "scheduledFor" <= now()`);
    try {
      await pointDeux(page);
    } finally {
      await requete(`DELETE FROM "NewsletterSend" WHERE id LIKE 'e2e-ctrl-ap-%'`);
      for (const l of avant) {
        await requete(`UPDATE "NewsletterIssue" SET status = $2::"NewsletterIssueStatus", "sentAt" = $3 WHERE id = $1`, [l.id, l.status, l.sentAt]);
      }
    }
  });

  async function pointDeux(page: Page) {
    const largeurs = [[375, 812], [1280, 900]] as const;
    for (const [l, h] of largeurs) {
      await ouvrir(page, "/lettre", l, h);
      controlerCartes(await cartes(page), h, `/lettre, visiteur, ${l}`);
    }
    await compte(page, "FREE");
    for (const [l, h] of largeurs) {
      await ouvrir(page, "/lettre", l, h);
      controlerCartes(await cartes(page), h, `/lettre, gratuit, ${l}`);
      await ouvrir(page, "/profil", l, h);
      await expect(page.locator("[data-profil-ouvert]")).toBeVisible();
      controlerCartes(await cartes(page, "[data-profil-zone=action]"), 10_000, `/profil action, gratuit, ${l}`);
      controlerCartes(await cartes(page, "[data-profil-zone=abonnement]"), 10_000, `/profil abonnement, gratuit, ${l}`);
    }
    await page.context().clearCookies();
    const abonne = await compte(page, "PREMIUM");
    // Archive : un envoi passé par numéro envoyé (même requête que `docs/espace-client/outils-s26/lettres-envoyees.sql`).
    await requete(
      `INSERT INTO "NewsletterSend" (id, "issueId", email, status, attempts, "sentAt", "createdAt", "updatedAt")
       SELECT 'e2e-ctrl-ap-' || "periodKey" || '-' || $2, id, $1, 'ENVOYE', 1, "scheduledFor", now(), now()
         FROM "NewsletterIssue" WHERE status = 'ENVOYE' AND "scheduledFor" <= now()
       ON CONFLICT ("issueId", email) DO NOTHING`,
      [abonne, randomBytes(3).toString("hex")],
    );
    for (const [l, h] of largeurs) {
      await ouvrir(page, "/lettre", l, h);
      controlerCartes(await cartes(page), h, `/lettre, abonné, ${l}`);
      await ouvrir(page, "/profil", l, h);
      await expect(page.locator("[data-profil-ouvert]")).toBeVisible();
      for (const zone of ["action", "progression", "abonnement"]) {
        const liste = (await cartes(page, `[data-profil-zone=${zone}]`)).filter((c) => !c.nom.startsWith("Ton cap"));
        if (zone === "progression") expect(liste.length, `Statistiques et Mes parcours, ${l}`).toBeGreaterThanOrEqual(2);
        controlerCartes(liste, 10_000, `/profil ${zone}, abonné, ${l}`, zone === "progression" ? 2 : 1);
      }
    }
  }

  test("point 3 : Favoris de l'abonné sans favori, carte d'état vide à bandeau", async ({ page }) => {
    await compte(page, "PREMIUM");
    for (const [l, h] of [[375, 812], [1280, 900]] as const) {
      await ouvrir(page, "/favoris", l, h);
      const etat = page.locator("[data-favoris-etat]");
      await expect(etat).toBeVisible();
      const bandeau = etat.locator(":scope > [data-bandeau-da]");
      await expect(bandeau).toHaveCount(1);
      expect((await bandeau.boundingBox())?.height, `bandeau de 4 px, ${l}`).toBe(4);
    }
  });

  for (const lecteur of ["visiteur", "gratuit"] as const) {
    test(`point 4 : ${lecteur}, Aujourd'hui et Favoris, un seul aplat violet par fenêtre d'écran`, async ({ page }) => {
      if (lecteur === "gratuit") await compte(page, "FREE");
      for (const adresse of ["/mon-espace", "/favoris"]) {
        for (const [l, h] of [[1280, 900], [1280, 720], [1920, 1200], [1024, 768]] as const) {
          await ouvrir(page, adresse, l, h);
          const pleins = await page.evaluate((violets) => {
            const out: { haut: number; bas: number; texte: string }[] = [];
            for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
              const cs = getComputedStyle(el);
              const r = el.getBoundingClientRect();
              if (r.width < 40 || r.height < 24 || cs.display === "none" || cs.visibility === "hidden") continue;
              if (violets.some((v) => cs.backgroundColor === `rgb(${v})`)) out.push({ haut: r.top + window.scrollY, bas: r.bottom + window.scrollY, texte: (el.textContent ?? "").trim().slice(0, 30) });
            }
            return out.sort((a, b) => a.haut - b.haut);
          }, VIOLETS);
          const ou = `${adresse}, ${lecteur}, ${l} x ${h}`;
          expect(pleins.length, `au moins le bouton d'offre du hero, ${ou}`).toBeGreaterThanOrEqual(1);
          for (let i = 1; i < pleins.length; i++) {
            expect(pleins[i].bas - pleins[i - 1].haut, `« ${pleins[i - 1].texte} » et « ${pleins[i].texte} » dans une même fenêtre, ${ou}`).toBeGreaterThan(h);
          }
        }
      }
    });
  }

  for (const lecteur of ["visiteur", "gratuit"] as const) {
    test(`point 5 : ${lecteur}, aperçu du Carnet sans « 1 500+ »`, async ({ page }) => {
      if (lecteur === "gratuit") await compte(page, "FREE");
      for (const l of [375, 1280]) {
        await ouvrir(page, "/carnet", l, 900);
        await expect(page.locator("[data-carnet='visiteur']")).toBeVisible();
        expect(await page.locator("main").innerText()).not.toMatch(/1\s?500\s?\+/u);
        await expect(page.locator("[data-preuve]")).toHaveCount(0);
      }
    });
  }

  test("point 6 : aperçu de Mes questions, « Mes envois » sans vide de plus de 32 px", async ({ page }) => {
    for (const lecteur of ["visiteur", "gratuit"] as const) {
      if (lecteur === "gratuit") await compte(page, "FREE");
      for (const l of [1024, 1280, 1920]) {
        await ouvrir(page, "/mon-espace/questions", l, 900);
        for (const sel of ["[data-apercu-envois]", "[data-apercu-historique]"]) {
          const vide = await page.locator(sel).evaluate((carte) => {
            const pad = parseFloat(getComputedStyle(carte).paddingBottom);
            const enfants = Array.from(carte.children).filter((e) => !e.matches("[data-bandeau-da]"));
            const bas = Math.max(...enfants.map((e) => e.getBoundingClientRect().bottom));
            return Math.round(carte.getBoundingClientRect().bottom - pad - bas);
          });
          expect(vide, `${sel}, ${lecteur}, ${l}`).toBeLessThanOrEqual(32);
        }
      }
    }
  });
});
