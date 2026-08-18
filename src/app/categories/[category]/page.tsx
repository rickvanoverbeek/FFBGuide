import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SettingCard } from "@/components/settings/SettingCard";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/content/schema";
import {
  getConceptsByCategory,
  getSettings,
  getUsedCategories,
} from "@/lib/content/loader";

type Props = {
  params: Promise<{ category: string }>;
};

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return getUsedCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return { title: "Category not found" };

  return {
    title: `${CATEGORY_LABELS[category]} settings`,
    description: `What ${CATEGORY_LABELS[category].toLowerCase()} settings do, and what each manufacturer calls them.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const concepts = getConceptsByCategory(category);
  if (concepts.length === 0) notFound();

  const settings = getSettings();
  const others = getUsedCategories().filter((c) => c !== category);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Cross-reference", href: "/glossary" },
          { label: CATEGORY_LABELS[category] },
        ]}
      />

      <section className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {CATEGORY_LABELS[category]}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {concepts.length} concept{concepts.length === 1 ? "" : "s"} in this
          category, with every manufacturer&apos;s term for them.
        </p>
      </section>

      {concepts.map((concept) => {
        const conceptSettings = settings.filter((s) => s.concept === concept.slug);

        return (
          <section
            key={concept.slug}
            id={concept.slug}
            className="mt-12 scroll-mt-24"
          >
            <h2 className="text-2xl font-semibold text-foreground">
              {concept.label}
            </h2>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              {concept.summary}
            </p>
            {concept.bodyHtml && (
              <div
                className="content-prose mt-3 max-w-3xl"
                dangerouslySetInnerHTML={{ __html: concept.bodyHtml }}
              />
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {conceptSettings.map((setting) => (
                <SettingCard key={setting.id} setting={setting} showManufacturer />
              ))}
            </div>
          </section>
        );
      })}

      <nav className="mt-16 border-t border-border pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Other categories
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((other) => (
            <li key={other}>
              <Link
                href={`/categories/${other}`}
                className="inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {CATEGORY_LABELS[other]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
