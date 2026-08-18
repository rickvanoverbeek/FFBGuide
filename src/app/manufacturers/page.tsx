import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getManufacturers, getSettingsByManufacturer } from "@/lib/content/loader";

export const metadata: Metadata = {
  title: "Manufacturers",
  description:
    "Force feedback settings per manufacturer and tuning software: Simucube Tuner, Fanatec Control Panel, Moza Pit House, Logitech G HUB and Thrustmaster Control Panel.",
};

export default function ManufacturersPage() {
  const manufacturers = getManufacturers();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Manufacturers
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Each manufacturer tunes force feedback in its own software, with its own
          vocabulary. Pick yours to see every setting it exposes, explained.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {manufacturers.map((manufacturer) => {
          const settings = getSettingsByManufacturer(manufacturer.slug);
          return (
            <Link
              key={manufacturer.slug}
              href={manufacturer.href}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {manufacturer.name}
                  </h2>
                  <Badge variant="secondary" className="mt-2">
                    {manufacturer.software}
                  </Badge>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-link" />
              </div>

              <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
                {manufacturer.summary}
              </p>

              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                {settings.length} setting{settings.length === 1 ? "" : "s"}{" "}
                documented
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
