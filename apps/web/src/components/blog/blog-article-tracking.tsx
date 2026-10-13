"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackUmami } from "@/lib/umami";

/** Paliers de lecture de `blog-scroll` : chacun part une seule fois par page. */
export const BLOG_SCROLL_STEPS = [25, 50, 75, 100] as const;

interface BlogArticleTrackingProps {
  slug: string;
  children: ReactNode;
}

/**
 * Mesure Umami d'un article (audit growth s14, E1 à E3), sans toucher au contenu :
 *  - `blog-cta-clic` {slug, bouton, position, parcours} : élément marqué `data-blog-cta` ;
 *    position (`milieu-1`, `milieu-2`, `fin`) et parcours lus sur l'encart parent
 *    (`data-blog-cta-position`, `data-blog-cta-parcours`, s20), « inconnu » sinon ;
 *  - `blog-cta-vu` {slug, position, parcours} (s20) : encart visible à 50 % ou plus,
 *    une seule fois par encart et par vue de page (IntersectionObserver) ;
 *  - `blog-ancre-clic` {slug, cible} : ancre interne (#…), navigation dans la page ;
 *  - `blog-sortie-clic` {slug, zone, section, cible} : tout autre lien (2e page). Zone =
 *    `data-blog-zone` du bloc (related, cluster, parcours), sinon, dans le corps
 *    (`data-blog-body`) : « sommaire » (intro avant le 1er H2) ou
 *    « section » (section = id du H2 précédent) ;
 *  - `blog-scroll` {slug, palier: 25 | 50 | 75 | 100} : chaque palier une fois, quand
 *    cette part du corps est passée.
 * Le partage d'une vanne (`blog-vanne-partage`) est mesuré par BlogVanneShare.
 * Écoute native sur le conteneur : les clics dans un portail (modale d'auth) sont ignorés.
 */
export function BlogArticleTracking({ slug, children }: BlogArticleTrackingProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const cta = event.target.closest<HTMLElement>("[data-blog-cta]");
      if (cta && root.contains(cta)) {
        trackUmami("blog-cta-clic", { slug, bouton: cta.dataset.blogCta ?? "inconnu", ...ctaPlacement(cta) });
        return;
      }
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || !root.contains(link)) return;
      const href = link.getAttribute("href") ?? "";
      // Ancre du sommaire = navigation dans la page, pas une 2e page.
      if (href.startsWith("#")) {
        trackUmami("blog-ancre-clic", { slug, cible: href });
        return;
      }
      trackUmami("blog-sortie-clic", { slug, ...linkZone(link), cible: href });
    };

    const sent = new Set<number>();
    let frame = 0;
    const measure = () => {
      frame = 0;
      const body = root.querySelector<HTMLElement>("[data-blog-body]");
      if (!body) return;
      const rect = body.getBoundingClientRect();
      if (rect.height <= 0) return;
      const read = ((window.innerHeight - rect.top) / rect.height) * 100;
      for (const palier of BLOG_SCROLL_STEPS) {
        if (read >= palier && !sent.has(palier)) {
          sent.add(palier);
          trackUmami("blog-scroll", { slug, palier });
        }
      }
      if (sent.size === BLOG_SCROLL_STEPS.length) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    // blog-cta-vu (s20) : chaque encart une fois, dès qu'il est visible à 50 %.
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      const seen = new Set<string>();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || entry.intersectionRatio < CTA_VU_RATIO) continue;
            const el = entry.target as HTMLElement;
            const placement = ctaPlacement(el);
            observer?.unobserve(el);
            if (seen.has(placement.position)) continue;
            seen.add(placement.position);
            trackUmami("blog-cta-vu", { slug, ...placement });
          }
        },
        { threshold: CTA_VU_RATIO },
      );
      root.querySelectorAll<HTMLElement>("[data-blog-cta-position]").forEach((el) => observer?.observe(el));
    }

    root.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [slug]);

  return <div ref={rootRef}>{children}</div>;
}

/** Part visible d'un encart pour compter `blog-cta-vu`. */
export const CTA_VU_RATIO = 0.5;

/** Position et parcours de l'encart qui contient l'élément (s20). */
export function ctaPlacement(el: HTMLElement): { position: string; parcours: string } {
  const box = el.closest<HTMLElement>("[data-blog-cta-position]");
  return {
    position: box?.dataset.blogCtaPosition ?? "inconnu",
    parcours: box?.dataset.blogCtaParcours ?? "inconnu",
  };
}

/** Zone et section d'un lien cliqué (voir la doc du composant). */
export function linkZone(link: HTMLAnchorElement): { zone: string; section: string } {
  const zoned = link.closest<HTMLElement>("[data-blog-zone]");
  if (zoned) return { zone: zoned.dataset.blogZone ?? "autre", section: "" };

  const body = link.closest<HTMLElement>("[data-blog-body]");
  if (!body) return { zone: "autre", section: "" };

  // Bloc de premier niveau du corps (ou de sa section, s20 : `data-blog-section`)
  // qui contient le lien, puis H2 qui le précède.
  let block: Element | null = link;
  while (
    block &&
    block.parentElement !== body.firstElementChild &&
    block.parentElement !== body &&
    !block.parentElement?.hasAttribute("data-blog-section")
  ) {
    block = block.parentElement;
  }
  let prev = block?.previousElementSibling ?? null;
  while (prev && prev.tagName !== "H2") prev = prev.previousElementSibling;

  const isAnchor = (link.getAttribute("href") ?? "").startsWith("#");
  if (isAnchor || !prev) return { zone: "sommaire", section: prev?.id ?? "intro" };
  return { zone: "section", section: prev.id };
}
