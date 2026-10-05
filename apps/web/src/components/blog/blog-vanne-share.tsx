"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShareButton } from "@/components/ui/share-button";
import { trackUmami } from "@/lib/umami";

interface BlogVanneShareProps {
  slug: string;
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
 * hauteur ajoutée). Lien partagé : l'article ancré sur la vanne (#vanne-N).
 * Mesure : `blog-vanne-partage` {slug, vanne, canal: natif | copie}.
 */
export function BlogVanneShare({ slug }: BlogVanneShareProps) {
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
            title="Vanne - deviens-marrant.fr"
            text={text}
            url={`${window.location.origin}${window.location.pathname}#vanne-${vanne}`}
            label={`Partager la vanne n°${vanne}`}
            onShared={(canal) => trackUmami("blog-vanne-partage", { slug, vanne: Number(vanne), canal })}
          />,
          el,
          vanne,
        ),
      )}
    </>
  );
}
