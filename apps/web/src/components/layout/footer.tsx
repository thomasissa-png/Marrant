import Link from "next/link";

const footerLinks = {
  produit: [
    { href: "/vannes", label: "Vannes" },
    { href: "/conseils", label: "Conseils" },
    { href: "/videos", label: "Vidéos stand-up" },
    { href: "/parcours", label: "Parcours" },
    { href: "/blog", label: "Blog" },
    { href: "/#offres", label: "Nos offres" },
  ],
  legal: [
    { href: "/a-propos", label: "À propos" },
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgu", label: "CGU" },
    { href: "/confidentialite", label: "Confidentialité" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-light">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Marque */}
          <div>
            <span className="font-display text-lg font-bold text-gradient">
              deviens-marrant
            </span>
            <p className="mt-2 text-sm text-text-secondary">
              Ton coach humour perso. Vannes, répartie et techniques
              de pro pour briller en société.
            </p>
            <p className="mt-3 text-sm text-text-muted">
              contact@deviens-marrant.fr
            </p>

            {/* Réseaux sociaux — signaux sociaux Bing */}
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.tiktok.com/@deviensmarrant"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-elevated text-text-secondary transition-colors hover:text-text-primary"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.79a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.2z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/deviensmarrant"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-elevated text-text-secondary transition-colors hover:text-text-primary"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://x.com/deviensmarrant"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-elevated text-text-secondary transition-colors hover:text-text-primary"
                aria-label="X (Twitter)"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Liens produit */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Produit
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.produit.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Légal
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} deviens-marrant.fr · Fait avec
          humour (et un peu de café)
        </div>
      </div>
    </footer>
  );
}
