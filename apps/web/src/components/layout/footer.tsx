import Link from "next/link";

const footerLinks = {
  produit: [
    { href: "/vannes", label: "Vannes" },
    { href: "/conseils", label: "Conseils" },
    { href: "/videos", label: "Vidéos stand-up" },
    { href: "/parcours", label: "Parcours" },
    { href: "/blog", label: "Blog" },
    { href: "/glossaire", label: "Glossaire" },
    { href: "/quiz-humour", label: "Quiz humour" },
    { href: "/anatomie-vanne", label: "Anatomie d'une vanne" },
    { href: "/abonnement", label: "Nos offres" },
  ],
  legal: [
    { href: "/a-propos", label: "À propos" },
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgu", label: "CGU" },
    { href: "/confidentialite", label: "Confidentialité" },
    { href: "/retractation", label: "Rétractation" },
  ],
};

const socialLinks = [
  {
    href: "https://x.com/deviensmarrant",
    label: "Twitter / X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/deviens-marrant",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-light">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Marque + Réseaux sociaux */}
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

            {/* Social links */}
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-text-muted transition-colors hover:text-accent-primary"
                >
                  {social.icon}
                </a>
              ))}
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
