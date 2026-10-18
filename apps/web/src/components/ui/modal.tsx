"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** id(s) du titre visible de la modale, pour `aria-labelledby`. */
  labelledBy?: string;
  /** Panneau qui monte du bas sur mobile (bottom sheet), centré dès `sm`. */
  sheet?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
}

export function Modal({ isOpen, onClose, children, className, labelledBy, sheet = false }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // onClose change souvent d'identité (fonction en ligne chez l'appelant) :
  // lu via une ref pour que le focus ne soit pas replacé à chaque rendu.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    // WCAG 2.4.3 : focus déplacé dans la modale, piégé, puis rendu au déclencheur.
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const content = contentRef.current;
    if (content) {
      // Premier élément du contenu (après « Fermer »), sinon « Fermer ».
      const first = focusables(content).find((el) => el !== closeButtonRef.current);
      (first ?? closeButtonRef.current ?? content).focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !contentRef.current) return;
      const items = focusables(contentRef.current);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && contentRef.current.contains(active);
      if (e.shiftKey && (!inside || active === firstItem)) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && (!inside || active === lastItem)) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (trigger && trigger.isConnected) trigger.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Portal vers document.body pour échapper aux parents avec transform/will-change
  // qui cassent le position:fixed (ex: animate-stagger-in sur les Cards)
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      {/* Wrapper flex avec padding vertical pour garantir une zone tappable autour de la modal */}
      <div
        className={cn(
          "flex min-h-full justify-center",
          sheet ? "items-end sm:items-center sm:px-4 sm:py-8" : "items-center px-4 py-8",
        )}
      >
        <div
          ref={contentRef}
          tabIndex={-1}
          className={cn(
            "relative w-full",
            sheet ? "animate-slide-up sm:animate-scale-in" : "max-w-md animate-scale-in",
            className
          )}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={cn(
              "absolute z-20 flex items-center justify-center rounded-full text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
              sheet
                ? "right-3 top-3 h-11 w-11 bg-black/40 hover:bg-black/70"
                : "-top-3 -right-3 h-10 w-10 border-2 border-white/20 bg-black/70 shadow-xl backdrop-blur-sm hover:bg-black/90 hover:scale-110 md:-top-4 md:-right-4 md:h-11 md:w-11",
            )}
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
