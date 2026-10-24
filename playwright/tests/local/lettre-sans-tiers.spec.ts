import { test, expect, localSeulement } from "../support/base-locale";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

/**
 * @legal s21 L5 : sur les pages qui portent le jeton de la lettre dans l'adresse
 * (`/lettre/confirmer?token=…`, `/lettre/desinscrire?token=…`), rien ne part vers
 * un tiers. Le test échoue si :
 * - une ressource est chargée hors du site (script, style, police, image, iframe,
 *   préchargement), le traceur Umami excepté, et seulement si aucune de ses
 *   requêtes ne porte le jeton (le filtre `data-before-send` est testé dans Jest) ;
 * - un élément du DOM pointe une ressource externe (src, link) ;
 * - un lien externe porte le jeton, ou un lien web externe s'ouvre sans `noreferrer` ;
 * - l'en-tête `Referrer-Policy: same-origin` manque.
 * Les pages n'écrivent rien en GET (@legal L5) : un jeton plausible suffit, aucune base lue.
 */
const JETON = "e2eJetonSansTiers_" + "x".repeat(24);
const TRACEUR = /^https:\/\/cloud\.umami\.is\//;

for (const page_ of [
  { chemin: "/lettre/confirmer", bouton: TEXTES_LETTRE.page.confirmer.bouton },
  { chemin: "/lettre/desinscrire", bouton: TEXTES_LETTRE.page.desinscrire.bouton },
]) {
  test.describe(`${page_.chemin} : aucune ressource ni fuite vers un tiers`, () => {
    localSeulement();

    for (const largeur of [375, 1280]) {
      test(`${largeur} px`, async ({ page, baseURL }) => {
        const origine = new URL(baseURL as string).origin;
        const requetes: string[] = [];
        page.on("request", (r) => requetes.push(r.url()));
        await page.setViewportSize({ width: largeur, height: largeur < 768 ? 812 : 800 });

        const reponse = await page.goto(`${page_.chemin}?token=${JETON}`);
        expect(reponse?.status()).toBe(200);
        expect(reponse?.headers()["referrer-policy"]).toBe("same-origin");
        await expect(page.getByRole("button", { name: page_.bouton })).toBeVisible();
        // Laisse partir les chargements différés (traceur, préchargements de liens).
        await page.waitForLoadState("networkidle");
        await page.mouse.wheel(0, 4000);
        await page.waitForLoadState("networkidle");

        const externes = requetes.filter((u) => !u.startsWith(`${origine}/`) && !u.startsWith("data:") && !u.startsWith("blob:"));
        const horsTraceur = externes.filter((u) => !TRACEUR.test(u));
        expect(horsTraceur, "ressources chargées hors du site").toEqual([]);
        for (const u of externes) expect(u, "le jeton part chez le traceur").not.toContain(JETON);

        const dom = await page.evaluate(() => {
          const ressources = [
            ...Array.from(document.querySelectorAll("script[src], img[src], iframe[src], video[src], audio[src], source[src]")).map(
              (el) => (el as HTMLImageElement).src,
            ),
            ...Array.from(document.querySelectorAll("link[href]")).map((el) => (el as HTMLLinkElement).href),
          ];
          const liens = Array.from(document.querySelectorAll("a[href]")).map((el) => ({
            href: (el as HTMLAnchorElement).href,
            rel: el.getAttribute("rel") ?? "",
          }));
          const formulaires = Array.from(document.querySelectorAll("form")).map((f) => f.action);
          return { ressources, liens, formulaires };
        });
        const interne = (u: string) => u.startsWith(`${origine}/`) || u.startsWith("data:");
        expect(dom.ressources.filter((u) => !interne(u) && !TRACEUR.test(u)), "ressources externes dans le DOM").toEqual([]);
        expect(dom.formulaires.every(interne), "formulaire envoyé hors du site").toBe(true);
        // Liens web externes (réseaux du pied de page) ; `mailto:` n'envoie aucun référent.
        for (const lien of dom.liens.filter((l) => /^https?:/.test(l.href) && !interne(l.href))) {
          expect(lien.href, "lien externe porteur du jeton").not.toContain(JETON);
          expect(lien.rel, `lien externe sans noreferrer : ${lien.href}`).toContain("noreferrer");
        }
      });
    }
  });
}
