"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { PANNEAU_ELEVE } from "@/components/layout/panneau-eleve";

interface SearchResult {
  id: string;
  type: "JOKE" | "TIP" | "VIDEO";
  title: string;
  preview: string;
}

type ResultType = "JOKE" | "TIP" | "VIDEO";

const TYPE_META: Record<ResultType, { label: string; color: string; pluralLabel: string; href: string }> = {
  JOKE: { label: "Vanne", color: "text-accent-link", pluralLabel: "vannes", href: "/vannes" },
  TIP: { label: "Conseil", color: "text-accent-secondary", pluralLabel: "conseils", href: "/conseils" },
  VIDEO: { label: "Vidéo", color: "text-text-secondary", pluralLabel: "vidéos", href: "/videos" },
};

const SUGGESTIONS = ["timing", "répartie", "storytelling", "observation", "absurde", "jeux de mots"];

const LISTBOX_ID = "search-results-listbox";

/**
 * s25 (relectures en-tête tour 6, design D3, ux 7 pistes 1 et 2) : `dansMenu`, posé par le menu mobile de l'en-tête
 * unique seulement. Les suggestions ne s'ouvrent plus au simple focus (à la frappe, ou flèche bas) : Tab depuis le
 * champ va à la ligne suivante du menu ; elles se referment quand le focus quitte la recherche ; puces de 44 px de
 * cible et anneau de focus violet de 2 px comme le reste du menu (`accent-link` depuis le tour 7, `panneau-eleve.ts`).
 * Sans `dansMenu` (site fermé, barre), rien ne change.
 * s25 (relecture ux tour 9, critère 7) : `enTete`, posé par l'en-tête unique (barre et `#mobile-search`) seulement :
 * mêmes cibles de 44 px que dans le menu (puces et bouton « Voir {type} », texte inchangé), même anneau. Le site fermé
 * (`header.tsx`) ne le pose pas : rien ne change.
 * s25 (relectures en-tête tour 10, ux 4-A, 4-B et 7, design F1 à F4), `enTete` et `dansMenu` seulement :
 * - un seul comportement : la liste s'ouvre à la frappe ou à la flèche bas, pas au focus, et se referme quand le
 *   focus quitte la recherche ; les options (puces, résultats) sont hors de l'ordre de tabulation (`tabIndex={-1}`,
 *   flèches et `aria-activedescendant`) : Tab depuis le champ va au contrôle suivant de la barre ou du menu ;
 * - liste au fini des panneaux cloche et compte (`PANNEAU_ELEVE`, `rounded-xl`, filet dégradé de 4 px), 8 px sous le
 *   filet de l'en-tête (barre et `#mobile-search`), alignée à droite du champ et plus large en barre (le champ garde
 *   ses 176 px, décision du 15/11) ; puces sur `bg-border-hover` ;
 * - anneau collé de l'en-tête (2 px `accent-link`, intérieur, sans décalage) ; option active lisible sans la teinte
 *   (même anneau) ; `id` de la liste et des options propres à chaque instance (`useId`, trois instances montées).
 */
const ANNEAU = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link";
const PUCE_MENU = cn("inline-flex min-h-11 items-center", ANNEAU);
/** Bouton « Voir {type} » à 44 px de cible en hauteur, largeur du texte. */
const VOIR_44 = cn(PUCE_MENU, "rounded-md");
/** Option active au clavier (focus restant au champ) : anneau intérieur, lisible sans la teinte. */
const ACTIVE = "ring-2 ring-inset ring-accent-link";
/**
 * Liste de l'en-tête : 8 px sous le filet bas de l'en-tête, comme cloche et compte. Barre (dès 1280 px) : champ de
 * 44 px à 10 px du haut d'une barre de 65 px (filet compris) : 54 + 19 = 73. `#mobile-search` (sous 1280 px) :
 * `py-3` + filet de 1 px + 8 px = 21 px sous le champ. En barre, bord droit sur celui du champ, 320 px (puces sur
 * 2 lignes ; à 288 px, 3 lignes).
 */
const PANNEAU_EN_TETE = cn(
  "absolute top-full z-50 mt-[21px] w-full overflow-hidden rounded-xl border border-border animate-fade-in",
  "xl:left-auto xl:right-0 xl:mt-[19px] xl:w-80",
  PANNEAU_ELEVE,
);
const PANNEAU_MENU = cn("absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border animate-fade-in", PANNEAU_ELEVE);
/** Filet dégradé de 4 px en tête de liste, comme `account-menu.tsx` et les cartes de l'accueil. */
function Filet({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("h-1 bg-gradient-to-r from-accent-primary to-accent-secondary", className)} />;
}

export function SearchBar({
  className,
  onNavigate,
  dansMenu = false,
  enTete = false,
}: {
  className?: string;
  onNavigate?: () => void;
  dansMenu?: boolean;
  enTete?: boolean;
}) {
  const compact = dansMenu || enTete;
  const uid = useId();
  const listboxId = compact ? `recherche${uid}liste` : LISTBOX_ID;
  const idOption = (i: number) => (compact ? `recherche${uid}option-${i}` : `search-item-${i}`);
  const panneau = enTete ? PANNEAU_EN_TETE : PANNEAU_MENU;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchLimited, setSearchLimited] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  // textes-trajet-v3 §5 point 3 : retour sur la page courante après le paiement.
  const pathname = usePathname();

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
          setSearchLimited(data.limited ?? false);
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

  const activeItemId = activeIndex >= 0 ? idOption(activeIndex) : undefined;
  const showSuggestions = isOpen && query.length < 2;
  const showNoResults = isOpen && query.length >= 2 && results.length === 0 && !isLoading;
  const showResults = isOpen && results.length > 0;
  // Dans l'en-tête, une pression sur la liste laisse le focus au champ : la fermeture à la sortie du focus ne retire
  // pas la puce avant son clic (Safari ne donne pas le focus aux boutons).
  const garderFocus = compact ? { onMouseDown: (e: React.MouseEvent) => e.preventDefault() } : {};

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onBlur={
        compact
          ? (e) => {
              if (!ref.current?.contains(e.relatedTarget as Node | null)) {
                setIsOpen(false);
                setActiveIndex(-1);
              }
            }
          : undefined
      }
    >
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
          aria-controls={listboxId}
          aria-activedescendant={activeItemId}
          aria-autocomplete="list"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (compact && e.target.value.length < 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="pl-10"
          onFocus={() => {
            if (compact) return;
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
          id={listboxId}
          {...garderFocus}
          role="listbox"
          aria-label="Suggestions de recherche"
          className={compact ? cn(panneau, "p-3") : "absolute top-full z-50 mt-2 w-full rounded-lg border border-border bg-background-card p-3 shadow-xl animate-fade-in"}
        >
          {compact && <Filet className="-mx-3 -mt-3 mb-3" />}
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                id={idOption(i)}
                role="option"
                aria-selected={activeIndex === i}
                tabIndex={compact ? -1 : undefined}
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm transition-colors",
                  compact && PUCE_MENU,
                  activeIndex === i
                    ? cn("bg-accent-primary/10 text-accent-link", compact && ACTIVE)
                    : compact
                      ? "bg-border-hover text-text-secondary hover:text-text-primary"
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
          id={listboxId}
          {...garderFocus}
          role="listbox"
          aria-label="Résultats de recherche"
          className={compact ? panneau : "absolute top-full z-50 mt-2 w-full rounded-lg border border-border bg-background-card shadow-xl animate-fade-in"}
        >
          {compact && <Filet />}
          {grouped.map(({ type, items }) => {
            const meta = TYPE_META[type];
            return (
              <div key={type}>
                <div className={cn("flex items-center justify-between px-4", compact ? "pt-1" : "pt-3 pb-1")}>
                  {/* Fond élevé : « Conseils » en `accent-link` (`accent-secondary` #6D28D9 : 2:1 sur #2A2A2A). */}
                  <span className={cn("text-xs font-semibold uppercase tracking-wider", compact && type === "TIP" ? "text-accent-link" : meta.color)}>
                    {meta.label}s ({items.length})
                  </span>
                  <button
                    className={cn("text-xs text-text-muted hover:text-accent-link transition-colors", compact && VOIR_44)}
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
                      id={idOption(idx)}
                      role="option"
                      aria-selected={activeIndex === idx}
                      tabIndex={compact ? -1 : undefined}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors",
                        // En-tête : `accent-primary/10` (#342F3E) garde le texte gris à 4,6:1 ; `border-hover` le baisserait à 4.
                        compact
                          ? activeIndex === idx && cn("bg-accent-primary/10", ACTIVE)
                          : activeIndex === idx ? "bg-background-elevated" : "hover:bg-background-elevated"
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
          {searchLimited && (
            <div className="border-t border-border px-4 py-2.5">
              <p className="text-center text-xs text-text-muted">
                Résultats limités&nbsp;: <a href={buildAbonnementUrl(pathname && pathname !== "/" ? pathname : null, "monthly", "recherche")} className="font-medium text-accent-link underline underline-offset-2">passe en Premium</a> pour tout voir
              </p>
            </div>
          )}
        </div>
      )}

      {/* No results + suggestions */}
      {showNoResults && (
        <div
          id={listboxId}
          {...garderFocus}
          role="listbox"
          aria-label="Aucun résultat"
          className={compact ? cn(panneau, "p-4") : "absolute top-full z-50 mt-2 w-full rounded-lg border border-border bg-background-card p-4 shadow-xl animate-fade-in"}
        >
          {compact && <Filet className="-mx-4 -mt-4 mb-4" />}
          <p className="text-center text-sm text-text-muted">
            Rien trouvé pour &laquo;&nbsp;{query}&nbsp;&raquo;. Essaie une de ces pistes&nbsp;:
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button
                key={s}
                className={cn(
                  "rounded-md bg-background-elevated px-2.5 py-1 text-xs text-text-secondary transition-colors hover:bg-background-light hover:text-text-primary",
                  compact && cn(PUCE_MENU, "bg-border-hover hover:bg-border-hover"),
                )}
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
