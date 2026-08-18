import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SettingCard } from "@/components/settings/SettingCard";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import {
  getConcepts,
  getManufacturer,
  getManufacturers,
  getSettingsByManufacturer,
  getUsedCategories,
} from "@/lib/content/loader";

type Props = {
  params: Promise<{ manufacturer: string }>;
};

export function generateStaticParams() {
  return getManufacturers().map((manufacturer) => ({
    manufacturer: manufacturer.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { manufacturer: slug } = await params;
  const manufacturer = getManufacturer(slug);
  if (!manufacturer) return { title: "Manufacturer not found" };

  return {
    title: `${manufacturer.name} FFB settings`,
    description: `Every force feedback setting in ${manufacturer.software}, what it does, and the equivalent term at other manufacturers.`,
  };
}

export default async function ManufacturerPage({ params }: Props) {
  const { manufacturer: slug } = await params;
  const manufacturer = getManufacturer(slug);
  if (!manufacturer) notFound();

  const settings = getSettingsByManufacturer(manufacturer.slug);
  const categories = getUsedCategories().filter((category) =>
    settings.some((setting) => setting.category === category)
  );

  // Concepts other manufacturers document but this one has no entry for.
  const covered = new Set(settings.map((setting) => setting.concept));
  const missing = getConcepts().filter((concept) => !covered.has(concept.slug));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Manufacturers", href: "/manufacturers" },
          { label: manufacturer.name },
        ]}
      />

      <section className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {manufacturer.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Badge variant="secondary">{manufacturer.software}</Badge>
          {manufacturer.website && (
            <a
              href={manufacturer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-link hover:underline"
            >
              Official site
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          {manufacturer.summary}
        </p>
        {manufacturer.bodyHtml && (
          <div
            className="content-prose mt-4 max-w-3xl"
            dangerouslySetInnerHTML={{ __html: manufacturer.bodyHtml }}
          />
        )}
      </section>

      <div className="mt-12 space-y-8">
        {categories.map((category) => (
          <section key={category} className="grid gap-4 lg:grid-cols-[200px_1fr]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground lg:pt-1">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {settings
                .filter((setting) => setting.category === category)
                .map((setting) => (
                  <SettingCard key={setting.id} setting={setting} />
                ))}
            </div>
          </section>
        ))}
      </div>

      {missing.length > 0 && (
        <section className="mt-12 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Not exposed in {manufacturer.software}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Concepts other manufacturers expose, with no counterpart documented
            here. Either the software has no such control, or the entry is still
            missing.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {missing.map((concept) => (
              <li key={concept.slug}>
                <Link
                  href={`/categories/${concept.category}#${concept.slug}`}
                  className="inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {concept.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
