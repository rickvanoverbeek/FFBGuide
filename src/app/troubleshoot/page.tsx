import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import {
  SymptomSearch,
  type SearchableSymptom,
} from "@/components/symptoms/SymptomSearch";
import { SYMPTOM_GROUP_LABELS } from "@/lib/content/schema";
import {
  getSymptoms,
  getSymptomsByGroup,
  getUsedSymptomGroups,
} from "@/lib/content/loader";

export const metadata: Metadata = {
  title: "Troubleshoot by symptom",
  description:
    "Describe what your wheel is doing — light, heavy, shaking, notchy, delayed — and see which force feedback settings in your own software influence it.",
};

export default function TroubleshootPage() {
  const groups = getUsedSymptomGroups();
  const searchable: SearchableSymptom[] = getSymptoms().map((symptom) => ({
    slug: symptom.slug,
    label: symptom.label,
    summary: symptom.summary,
    href: symptom.href,
    groupLabel: SYMPTOM_GROUP_LABELS[symptom.group],
    keywords: symptom.keywords,
  }));

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-8">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          What is your wheel doing?
        </h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Describe the problem in your own words. You get the settings in your own
          wheel base software that influence it, in the order worth trying, and
          why each one matters.
        </p>
      </section>

      <SymptomSearch symptoms={searchable} />

      <section className="mt-12 space-y-10">
        {groups.map((group) => (
          <div key={group}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {SYMPTOM_GROUP_LABELS[group]}
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {getSymptomsByGroup(group).map((symptom) => (
                <li key={symptom.slug}>
                  <Link
                    href={symptom.href}
                    className="block h-full rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                  >
                    <span className="font-semibold text-foreground">
                      {symptom.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {symptom.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <p className="mt-12 flex items-start gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          The settings themselves are documented by their manufacturers. Which
          setting fixes which complaint is our reasoning about how those controls
          interact — useful as a starting point, not a manufacturer statement.
        </span>
      </p>
    </main>
  );
}
