import type { Metadata } from "next";
import Link from "next/link";
import {
  RosettaMatrix,
  type MatrixColumn,
  type MatrixSectionData,
} from "@/components/settings/RosettaMatrix";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { getManufacturers, getMatrix } from "@/lib/content/loader";

export const metadata: Metadata = {
  title: "Cross-reference matrix",
  description:
    "Every force feedback concept side by side with the term each manufacturer uses for it — Simucube, Fanatec, Moza, Logitech and Thrustmaster.",
};

export default function GlossaryPage() {
  const manufacturers = getManufacturers();
  const matrix = getMatrix();

  const columns: MatrixColumn[] = manufacturers.map((manufacturer) => ({
    slug: manufacturer.slug,
    name: manufacturer.name,
    software: manufacturer.software,
    href: manufacturer.href,
  }));

  // Strip rendered bodies: the matrix only needs labels and links.
  const sections: MatrixSectionData[] = matrix.map((section) => ({
    category: section.category,
    label: CATEGORY_LABELS[section.category],
    rows: section.rows.map((row) => ({
      slug: row.concept.slug,
      label: row.concept.label,
      summary: row.concept.summary,
      cells: row.cells.map((cell) =>
        cell.settings.map((setting) => ({
          term: setting.setting_name,
          href: setting.href,
          isDraft: setting.status === "draft",
        }))
      ),
    })),
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Cross-reference matrix
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          One row per force feedback concept, one column per manufacturer. Read
          across a row to find out what your wheel calls the setting you already
          know from somewhere else.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          A dash means that manufacturer exposes no equivalent control — which is
          itself worth knowing. Browse by{" "}
          <Link href="/categories/damping" className="text-link hover:underline">
            category
          </Link>{" "}
          or by{" "}
          <Link href="/manufacturers" className="text-link hover:underline">
            manufacturer
          </Link>{" "}
          instead.
        </p>
      </section>

      <RosettaMatrix columns={columns} sections={sections} />
    </main>
  );
}
