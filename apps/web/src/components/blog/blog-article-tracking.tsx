"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackUmami } from "@/lib/umami";

/** Seuil de lecture de `blog-scroll` : part une seule fois par page. */
export const BLOG_SCROLL_THRESHOLD = 75;

interface BlogArticleTrackingProps {
  slug: string;
  children: ReactNode;
}

/**
 * Mesure Umami d'un article (audit growth s14, E1 à E3), sans toucher au contenu :
 *  - `blog-cta-clic` {slug, bouton} : élément marqué `data-blog-cta` ;
 *  - `blog-sortie-clic` {slug, zone, section, cible} : tout autre lien. Zone =
 *    `data-blog-zone` du bloc (related, cluster, parcours), sinon, dans le corps
 *    (`data-blog-body`) : « sommaire » (ancre # ou intro avant le 1er H2) ou
 *    « section » (section = id du H2 précédent) ;
 *  - `blog-scroll` {slug, palier: 75} : une fois, quand 75 % du corps est passé.
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
        trackUmami("blog-cta-clic", { slug, bouton: cta.dataset.blogCta ?? "inconnu" });
        return;
      }
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || !root.contains(link)) return;
      trackUmami("blog-sortie-clic", { slug, ...linkZone(link), cible: link.getAttribute("href") ?? "" });
    };

    let sent = false;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const body = root.querySelector<HTMLElement>("[data-blog-body]");
      if (sent || !body) return;
      const rect = body.getBoundingClientRect();
      if (rect.height <= 0) return;
      const read = (window.innerHeight - rect.top) / rect.height;
      if (read * 100 >= BLOG_SCROLL_THRESHOLD) {
        sent = true;
        trackUmami("blog-scroll", { slug, palier: BLOG_SCROLL_THRESHOLD });
        window.removeEventListener("scroll", onScroll);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    root.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [slug]);

  return <div ref={rootRef}>{children}</div>;
}

/** Zone et section d'un lien cliqué (voir la doc du composant). */
export function linkZone(link: HTMLAnchorElement): { zone: string; section: string } {
  const zoned = link.closest<HTMLElement>("[data-blog-zone]");
  if (zoned) return { zone: zoned.dataset.blogZone ?? "autre", section: "" };

  const body = link.closest<HTMLElement>("[data-blog-body]");
  if (!body) return { zone: "autre", section: "" };

  // Bloc de premier niveau du corps qui contient le lien, puis H2 qui le précède.
  let block: Element | null = link;
  while (block && block.parentElement !== body.firstElementChild && block.parentElement !== body) {
    block = block.parentElement;
  }
  let prev = block?.previousElementSibling ?? null;
  while (prev && prev.tagName !== "H2") prev = prev.previousElementSibling;

  const isAnchor = (link.getAttribute("href") ?? "").startsWith("#");
  if (isAnchor || !prev) return { zone: "sommaire", section: prev?.id ?? "intro" };
  return { zone: "section", section: prev.id };
}
