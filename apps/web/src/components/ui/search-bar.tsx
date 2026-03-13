"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: "JOKE" | "TIP" | "VIDEO";
  title: string;
  preview: string;
}

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
          setIsOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const typeLabel = (type: string) => {
    switch (type) {
      case "JOKE": return "Vanne";
      case "TIP": return "Conseil";
      case "VIDEO": return "Vidéo";
      default: return type;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "JOKE": return "text-accent-primary";
      case "TIP": return "text-accent-secondary";
      default: return "text-text-secondary";
    }
  };

  const handleSelect = (result: SearchResult) => {
    const q = encodeURIComponent(query);
    setIsOpen(false);
    setQuery("");
    switch (result.type) {
      case "JOKE": router.push(`/vannes?q=${q}`); break;
      case "TIP": router.push(`/conseils?q=${q}`); break;
      case "VIDEO": router.push(`/videos?q=${q}`); break;
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          placeholder="Cherche une vanne, une technique..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-border bg-background-card shadow-xl animate-fade-in">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-background-elevated first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleSelect(result)}
            >
              <span className={cn("mt-0.5 text-xs font-semibold uppercase", typeColor(result.type))}>
                {typeLabel(result.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{result.title}</p>
                <p className="text-xs text-text-muted truncate">{result.preview}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-border bg-background-card p-4 text-center text-sm text-text-muted shadow-xl">
          Rien trouvé pour &laquo; {query} &raquo;, essaie autre chose !
        </div>
      )}
    </div>
  );
}
