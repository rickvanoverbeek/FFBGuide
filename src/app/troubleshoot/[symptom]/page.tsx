import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import {
  SymptomAdvisor,
  type AdvisorStep,
} from "@/components/symptoms/SymptomAdvisor";
import { SYMPTOM_GROUP_LABELS } from "@/lib/content/schema";
import {
  getManufacturers,
  getSymptom,
  getSymptoms,
  resolveAdvice,
  type ResolvedAdviceStep,
} from "@/lib/content/loader";

type Props = {
  params: Promise<{ symptom: string }>;
};

export function generateStaticParams() {
  return getSymptoms().map((symptom) => ({ symptom: symptom.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symptom: slug } = await params;
  const symptom = getSymptom(slug);
  if (!symptom) return { title: "Symptom not found" };

  return {
    title: symptom.label,
    description: `${symptom.summary} Which settings influence it, per manufacturer.`,
  };
}

function toAdvisorStep(step: ResolvedAdviceStep): AdvisorStep {
  return {
    conceptSlug: step.concept.slug,
    conceptLabel: step.concept.label,
    conceptHref: `/categories/${step.concept.category}#${step.concept.slug}`,
    direction: step.direction,
    why: step.why,
    settings: step.settings.map(({ setting, direction, directionUnclear }) => ({
      name: setting.setting_name,
      software: setting.software,
      href: setting.href,
      direction,
      directionUnclear,
      isDraft: setting.status === "draft",
    })),
  };
}

export default async function SymptomPage({ params }: Props) {
  const { symptom: slug } = await params;
  const symptom = getSymptom(slug);
  if (!symptom) notFound();

  const manufacturers = getManufacturers();

  // Resolved for every manufacturer at build time; the client only switches.
  const stepsByManufacturer = Object.fromEntries(
    manufacturers.map((manufacturer) => [
      manufacturer.slug,
      resolveAdvice(symptom, manufacturer.slug).map(toAdvisorStep),
    ])
  );

  // With no manufacturer chosen, the advice stands on its concepts alone.
  const genericSteps = resolveAdvice(symptom, "__none__").map(toAdvisorStep);

  const related = symptom.related_symptoms
    .map((ref) => getSymptom(ref))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Troubleshoot", href: "/troubleshoot" },
          { label: symptom.label },
        ]}
      />

      <header className="mt-8">
        <Badge variant="secondary">
          {SYMPTOM_GROUP_LABELS[symptom.group]}
        </Badge>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {symptom.label}
        </h1>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          {symptom.summary}
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Why it happens</h2>
        <div
          className="content-prose mt-3"
          dangerouslySetInnerHTML={{ __html: symptom.bodyHtml }}
        />
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">What to change</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Work down the list and stop at the first change that fixes it — each one
          costs you something elsewhere.
        </p>
        <div className="mt-5">
          <SymptomAdvisor
            manufacturers={manufacturers.map((manufacturer) => ({
              slug: manufacturer.slug,
              name: manufacturer.name,
              software: manufacturer.software,
            }))}
            stepsByManufacturer={stepsByManufacturer}
            genericSteps={genericSteps}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">
            Often confused with
          </h2>
          <ul className="mt-4 space-y-2">
            {related.map((other) => (
              <li key={other.slug}>
                <Link
                  href={other.href}
                  className="block rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground">
                    {other.label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {other.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 flex items-start gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Each setting page is written from the manufacturer&apos;s own
          documentation. This mapping from complaint to setting is our reasoning
          about how those controls interact, so treat the order as a starting
          point rather than a manufacturer recommendation.
        </span>
      </p>
    </main>
  );
}
