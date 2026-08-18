import Link from "next/link";
import {
  ArrowRight,
  Factory,
  Layers,
  Stethoscope,
  Table2,
  Zap,
} from "lucide-react";
import { TAGLINE } from "@/lib/constants";
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

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-gradient-start/10 via-transparent to-gradient-end/10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-accent" />
            {TAGLINE}
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The encyclopedia of{" "}
            <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
              force feedback settings
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Every setting in every wheel base&apos;s software: what it does, how it
            changes the feel, and what the other manufacturers call the same
            thing. Written from their own documentation.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/manufacturers"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gradient-start to-gradient-end px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Go to Manufacturers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/troubleshoot"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Fix a problem
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            {settings.length} settings · {concepts.length} concepts ·{" "}
            {manufacturers.length} manufacturers
          </p>
        </div>
      </section>

      {/* Ways in */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/troubleshoot"
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <Stethoscope className="h-6 w-6 text-link" />
              <h3 className="mt-4 font-semibold text-foreground">
                Troubleshoot a symptom
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Describe what the wheel is doing and get the settings in your own
                software that influence it, in the order worth trying.
              </p>
            </Link>

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
