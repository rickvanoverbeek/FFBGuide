import Link from "next/link";
import { ArrowRight, Zap, Table2, Factory, Layers } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import {
  getConcepts,
  getManufacturers,
  getSettings,
  getUsedCategories,
} from "@/lib/content/loader";

export default function HomePage() {
  const manufacturers = getManufacturers();
  const concepts = getConcepts();
  const settings = getSettings();
  const categories = getUsedCategories();

  // A taste of the matrix: the concept covered by the most manufacturers.
  const showcase = [...concepts]
    .map((concept) => ({
      concept,
      entries: settings.filter((setting) => setting.concept === concept.slug),
    }))
    .sort((a, b) => b.entries.length - a.entries.length)[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-gradient-start/10 via-transparent to-gradient-end/10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-accent" />
            Force feedback settings, translated between manufacturers
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your wheel calls it{" "}
            <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
              something else
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            What each setting actually does, what you feel when you change it, and
            which term every other manufacturer uses for the same thing.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/glossary"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gradient-start to-gradient-end px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Open the cross-reference
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/manufacturers"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Browse by manufacturer
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            {settings.length} settings · {concepts.length} concepts ·{" "}
            {manufacturers.length} manufacturers
          </p>
        </div>
      </section>

      {/* One row of the matrix, as a teaser */}
      {showcase && showcase.entries.length > 1 && (
        <section className="border-y border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              One concept, {showcase.entries.length} names
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              {showcase.concept.summary}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {showcase.entries.map((setting) => (
                <Link
                  key={setting.id}
                  href={setting.href}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {setting.manufacturerName}
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {setting.setting_name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {setting.software}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/glossary"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline"
              >
                See all {concepts.length} concepts side by side
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Three ways in */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/glossary"
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <Table2 className="h-6 w-6 text-link" />
              <h3 className="mt-4 font-semibold text-foreground">
                Cross-reference matrix
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Concepts down the side, manufacturers across the top. The fastest
                way to translate a setting you already know.
              </p>
            </Link>

            <Link
              href="/manufacturers"
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <Factory className="h-6 w-6 text-link" />
              <h3 className="mt-4 font-semibold text-foreground">
                By manufacturer
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {manufacturers.map((m) => m.name).join(", ")} — every setting in
                their tuning software, with the exact labels.
              </p>
            </Link>

            <Link
              href={`/categories/${categories[0] ?? "damping"}`}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <Layers className="h-6 w-6 text-link" />
              <h3 className="mt-4 font-semibold text-foreground">By category</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {categories
                  .slice(0, 4)
                  .map((category) => CATEGORY_LABELS[category])
                  .join(", ")}{" "}
                and more, grouped by what the force actually does.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
