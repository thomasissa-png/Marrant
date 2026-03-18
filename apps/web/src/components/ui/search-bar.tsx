"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: "JOKE" | "TIP" | "VIDEO";
  title: string;
  preview: string;
}

type ResultType = "JOKE" | "TIP" | "VIDEO";

const TYPE_META: Record<ResultType, { label: string; color: string; pluralLabel: string; href: string }> = {
  JOKE: { label: "Vanne", color: "text-accent-primary", pluralLabel: "vannes", href: "/vannes" },
  TIP: { label: "Conseil", color: "text-accent-secondary", pluralLabel: "conseils", href: "/conseils" },
  VIDEO: { label: "Vidéo", color: "text-text-secondary", pluralLabel: "vidéos", href: "/videos" },
};

const SUGGESTIONS = ["timing", "répartie", "storytelling", "observation", "absurde", "jeux de mots"];

const LISTBOX_ID = "search-results-listbox";

export function SearchBar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // All selectable items: grouped results + "voir tout" links
  const grouped = groupByType(results);
  const flatItems = buildFlatItems(grouped, query);

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
          setActiveIndex(-1);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const navigate = useCallback((url: string) => {
    setIsOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(url);
  }, [router, onNavigate]);

  const handleSelect = useCallback((result: SearchResult) => {
    const q = encodeURIComponent(query);
    const meta = TYPE_META[result.type];
    navigate(`${meta.href}?q=${q}`);
  }, [query, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && (results.length > 0 || query.length < 2)) {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % flatItems.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? flatItems.length - 1 : prev - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < flatItems.length) {
          const item = flatItems[activeIndex];
          if (item.kind === "result") {
            handleSelect(item.result);
          } else if (item.kind === "voir-tout") {
            navigate(`${item.href}?q=${encodeURIComponent(query)}`);
          } else if (item.kind === "suggestion") {
            setQuery(item.text);
          }
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const activeItemId = activeIndex >= 0 ? `search-item-${activeIndex}` : undefined;
  const showSuggestions = isOpen && query.length < 2;
  const showNoResults = isOpen && query.length >= 2 && results.length === 0 && !isLoading;
  const showResults = isOpen && results.length > 0;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          ref={inputRef}
          role="combobox"
          aria-label="Rechercher"
          aria-expanded={isOpen}
          aria-controls={LISTBOX_ID}
          aria-activedescendant={activeItemId}
          aria-autocomplete="list"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
          onFocus={() => {
            if (results.length > 0 || query.length < 2) setIsOpen(true);
          }}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" aria-label="Chargement" />
          </div>
        )}
      </div>

      {/* Suggestions (when input focused, no query yet) */}
      {showSuggestions && (
        <div
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Suggestions de recherche"
          className="absolute top-full z-50 mt-2 w-full rounded-lg border border-border bg-background-card p-3 shadow-xl animate-fade-in"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                id={`search-item-${i}`}
                role="option"
                aria-selected={activeIndex === i}
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm transition-colors",
                  activeIndex === i
                    ? "bg-accent-primary/10 text-accent-primary"
                    : "bg-background-elevated text-text-secondary hover:bg-background-light hover:text-text-primary"
                )}
                onClick={() => setQuery(s)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grouped results */}
      {showResults && (
        <div
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Résultats de recherche"
          className="absolute top-full z-50 mt-2 w-full rounded-lg border border-border bg-background-card shadow-xl animate-fade-in"
        >
          {grouped.map(({ type, items }) => {
            const meta = TYPE_META[type];
            return (
              <div key={type}>
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                  <span className={cn("text-xs font-semibold uppercase tracking-wider", meta.color)}>
                    {meta.label}s ({items.length})
                  </span>
                  <button
                    className="text-xs text-text-muted hover:text-accent-primary transition-colors"
                    onClick={() => navigate(`${meta.href}?q=${encodeURIComponent(query)}`)}
                  >
                    Voir {meta.pluralLabel}
                  </button>
                </div>
                {items.map((result) => {
                  const idx = flatItems.findIndex((fi) => fi.kind === "result" && fi.result.id === result.id && fi.result.type === result.type);
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      id={`search-item-${idx}`}
                      role="option"
                      aria-selected={activeIndex === idx}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors",
                        activeIndex === idx ? "bg-background-elevated" : "hover:bg-background-elevated"
                      )}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{result.title}</p>
                        <p className="text-xs text-text-muted truncate">{result.preview}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* No results + suggestions */}
      {showNoResults && (
        <div
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Aucun résultat"
          className="absolute top-full z-50 mt-2 w-full rounded-lg border border-border bg-background-card p-4 shadow-xl animate-fade-in"
        >
          <p className="text-center text-sm text-text-muted">
            Rien trouvé pour &laquo; {query} &raquo;
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button
                key={s}
                className="rounded-md bg-background-elevated px-2.5 py-1 text-xs text-text-secondary transition-colors hover:bg-background-light hover:text-text-primary"
                onClick={() => setQuery(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface GroupedResults {
  type: ResultType;
  items: SearchResult[];
}

function groupByType(results: SearchResult[]): GroupedResults[] {
  const order: ResultType[] = ["JOKE", "TIP", "VIDEO"];
  const map = new Map<ResultType, SearchResult[]>();
  for (const r of results) {
    if (!map.has(r.type)) map.set(r.type, []);
    map.get(r.type)!.push(r);
  }
  return order.filter((t) => map.has(t)).map((t) => ({ type: t, items: map.get(t)! }));
}

type FlatItem =
  | { kind: "result"; result: SearchResult }
  | { kind: "voir-tout"; type: ResultType; href: string }
  | { kind: "suggestion"; text: string };

function buildFlatItems(grouped: GroupedResults[], query: string): FlatItem[] {
  if (query.length < 2) {
    return SUGGESTIONS.map((s) => ({ kind: "suggestion" as const, text: s }));
  }
  const items: FlatItem[] = [];
  for (const group of grouped) {
    for (const result of group.items) {
      items.push({ kind: "result", result });
    }
  }
  return items;
}
