import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

const footerLinks = {
  Vendors: [{ label: "All Vendors", href: "/vendors" }],
  Games: [{ label: "All Games", href: "/games" }],
  Resources: [
    { label: "Learn", href: "/learn" },
    { label: "Glossary", href: "/tools/glossary" },
    { label: "FFB Configurator", href: "/tools/configurator" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="text-xl font-bold">
              <span className="text-primary">FFB</span>{" "}
              <span>Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The ultimate sim racing force feedback resource
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p>Built for the sim racing community</p>
        </div>
      </div>
    </footer>
  );
}
