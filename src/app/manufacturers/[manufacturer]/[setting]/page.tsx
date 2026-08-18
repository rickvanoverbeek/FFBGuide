import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Info } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AliasTable } from "@/components/settings/AliasTable";
import { StatusBadge } from "@/components/settings/StatusBadge";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import {
  formatRange,
  getAliases,
  getConcept,
  getSetting,
  getSettingById,
  getSettings,
  getSymptomsForConcept,
} from "@/lib/content/loader";

type Props = {
  params: Promise<{ manufacturer: string; setting: string }>;
};

export function generateStaticParams() {
  return getSettings().map((setting) => ({
    manufacturer: setting.manufacturer,
    setting: setting.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { manufacturer, setting: slug } = await params;
  const setting = getSetting(manufacturer, slug);
  if (!setting) return { title: "Setting not found" };

  return {
    title: `${setting.setting_name} — ${setting.manufacturerName}`,
    description: setting.summary,
  };
}

export default async function SettingPage({ params }: Props) {
  const { manufacturer, setting: slug } = await params;
  const setting = getSetting(manufacturer, slug);
  if (!setting) notFound();

  const concept = getConcept(setting.concept);
  const aliases = getAliases(setting);
  const related = setting.related_settings
    .map((id) => getSettingById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const range = setting.recommended_range
    ? formatRange(setting.recommended_range)
    : null;
  const symptoms = getSymptomsForConcept(setting.concept);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Manufacturers", href: "/manufacturers" },
          { label: setting.manufacturerName, href: `/manufacturers/${setting.manufacturer}` },
          { label: setting.setting_name },
        ]}
      />

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">{setting.software}</Badge>
          <Link
            href={`/categories/${setting.category}`}
            className="text-sm text-link hover:underline"
          >
            {CATEGORY_LABELS[setting.category]}
          </Link>
          <StatusBadge status={setting.status} />
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {setting.setting_name}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{setting.summary}</p>
      </header>

      {/* What it does */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">What it does</h2>
        <div
          className="content-prose mt-3"
          dangerouslySetInnerHTML={{ __html: setting.explanationHtml }}
        />
      </section>

      {/* What you feel */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">What you feel</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{setting.impact}</p>
      </section>

      {/* Documented range of the control itself */}
      {setting.value_range && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">
            Range in the software
          </h2>
          <p className="mt-2 text-lg font-medium text-foreground">
            {formatRange(setting.value_range) ?? "—"}
          </p>
          {setting.value_range.note && (
            <p className="mt-2 leading-7 text-muted-foreground">
              {setting.value_range.note}
            </p>
          )}
        </section>
      )}

      {/* Recommended range */}
      {setting.recommended_range && (
        <section className="mt-10 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="text-xl font-semibold text-foreground">
            Where to start
          </h2>
          {range && (
            <p className="mt-2 text-2xl font-semibold text-link">{range}</p>
          )}
          {setting.recommended_range.note && (
            <p className="mt-2 leading-7 text-muted-foreground">
              {setting.recommended_range.note}
            </p>
          )}
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              A starting point, not a recommendation. The right value depends on
              your base, rim, title and how the game scales its own forces —
              expect to change it per car and per game.
            </span>
          </p>
        </section>
      )}

      {/* The Rosetta function */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">
          Called something else elsewhere
        </h2>
        {concept && (
          <p className="mt-1 text-sm text-muted-foreground">
            Same concept:{" "}
            <Link
              href={`/categories/${concept.category}#${concept.slug}`}
              className="text-link hover:underline"
            >
              {concept.label}
            </Link>
          </p>
        )}
        <div className="mt-4">
          <AliasTable
            aliases={aliases}
            conceptLabel={concept?.label ?? setting.setting_name}
          />
        </div>
      </section>

      {/* Interactions */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">
            Interacts with
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These settings stack with this one — changing them changes what this
            setting appears to do.
          </p>
          <ul className="mt-4 space-y-2">
            {related.map((other) => (
              <li key={other.id}>
                <Link
                  href={other.href}
                  className="flex items-baseline gap-2 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground">
                    {other.setting_name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {other.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Complaints this setting is used against */}
      {symptoms.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">
            Reach for this when
          </h2>
          <ul className="mt-4 space-y-2">
            {symptoms.map((symptom) => (
              <li key={symptom.slug}>
                <Link
                  href={symptom.href}
                  className="block rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground">
                    {symptom.label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {symptom.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sources */}
      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sources
        </h2>
        {setting.sources.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {setting.sources.map((source) => (
              <li key={source}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 break-all text-sm text-link hover:underline"
                >
                  {source}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {setting.source_note && (
          <p className="mt-3 text-sm text-muted-foreground">
            {setting.source_note}
          </p>
        )}
        {setting.sources.length === 0 && !setting.source_note && (
          <p className="mt-3 text-sm text-muted-foreground">
            No official documentation linked yet. Until it is, treat this entry as
            a working explanation rather than a citation.
          </p>
        )}
        {setting.last_reviewed && (
          <p className="mt-3 text-xs text-muted-foreground">
            Last reviewed {setting.last_reviewed}
          </p>
        )}
      </section>
    </main>
  );
}
