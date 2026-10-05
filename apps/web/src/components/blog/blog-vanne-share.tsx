"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShareButton } from "@/components/ui/share-button";
import { trackUmami } from "@/lib/umami";
import { shareLabel, shareTitle, type BlogShareMode } from "@/config/blog-forte-frappe";

interface BlogVanneShareProps {
  slug: string;
  /** `text-only` : message envoyé tel quel, sans titre ni lien (config/blog-forte-frappe). */
  mode?: BlogShareMode;
}

interface Slot {
  el: HTMLElement;
  vanne: string;
  text: string;
}

/**
 * Bouton Partager du site (ShareButton, celui des cartes de vannes) posé sur chaque
 * vanne numérotée de l'article. Le corps est du HTML rendu côté serveur
 * (MarkdownRenderer, option shareJokes) : on monte les boutons par portail dans les
 * emplacements `span[data-share-vanne]` qu'il réserve (44 px, flottants, sans
 * hauteur ajoutée). Lien partagé : l'article ancré sur la vanne (#vanne-N), sauf en
 * mode `text-only` (messages à envoyer : texte seul).
 * Mesure : `blog-vanne-partage` {slug, vanne, canal: natif | copie}.
 */
export function BlogVanneShare({ slug, mode = "with-url" }: BlogVanneShareProps) {
  const textOnly = mode === "text-only";
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-blog-body] [data-share-vanne]");
    setSlots(
      Array.from(els, (el) => ({ el, vanne: el.dataset.shareVanne ?? "", text: el.dataset.text ?? "" })),
    );
  }, [slug]);

  return (
    <>
      {slots.map(({ el, vanne, text }) =>
        createPortal(
          <ShareButton
            title={shareTitle(slug)}
            text={text}
            url={`${window.location.origin}${window.location.pathname}#vanne-${vanne}`}
            label={shareLabel(slug, mode, vanne)}
            textOnly={textOnly}
            onShared={(canal) => trackUmami("blog-vanne-partage", { slug, vanne: Number(vanne), canal })}
          />,
          el,
          vanne,
        ),
      )}
    </>
  );
}
