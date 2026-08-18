import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { getManufacturers } from "@/lib/content/loader";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { getUsedCategories } from "@/lib/content/loader";
import { SITE_NAME, TAGLINE } from "@/lib/constants";

export function Footer() {
  const manufacturers = getManufacturers();
  const categories = getUsedCategories().slice(0, 5);

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" aria-label="FFB Guide home">
              <Logo />
            </Link>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              {TAGLINE}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Manufacturers
            </h2>
            <ul className="space-y-2">
              {manufacturers.map((manufacturer) => (
                <li key={manufacturer.slug}>
                  <Link
                    href={manufacturer.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {manufacturer.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Categories
            </h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/categories/${category}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {CATEGORY_LABELS[category]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Reference
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/glossary"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cross-reference matrix
                </Link>
              </li>
              <li>
                <Link
                  href="/manufacturers"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  All manufacturers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p>
            Settings terminology belongs to the respective manufacturers. This
            site is an independent reference.
          </p>
        </div>
      </div>
    </footer>
  );
}
