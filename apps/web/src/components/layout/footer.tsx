import Link from "next/link";

const footerLinks = {
  produit: [
    { href: "/blagues", label: "Blagues" },
    { href: "/conseils", label: "Conseils" },
    { href: "/videos", label: "Vidéos stand-up" },
    { href: "/parcours", label: "Parcours" },
    { href: "/blog", label: "Blog" },
    { href: "/#offres", label: "Nos offres" },
  ],
  legal: [
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
              Ton coach humour perso. Blagues, répartie et techniques
              de pro pour briller en société.
            </p>
            <p className="mt-3 text-sm text-text-muted">
              contact@deviens-marrant.fr
            </p>
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
