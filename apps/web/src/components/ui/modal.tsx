"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

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
    >
      {/* Wrapper flex avec padding vertical pour garantir une zone tappable autour de la modal */}
      <div className="flex min-h-full items-center justify-center px-4 py-8">
        <div
          ref={contentRef}
          className={cn(
            "relative w-full max-w-md animate-scale-in",
            className
          )}
        >
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-black/70 text-white shadow-xl backdrop-blur-sm transition-all hover:bg-black/90 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary md:-top-4 md:-right-4 md:h-11 md:w-11"
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
