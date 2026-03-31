import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client, sanityFetch } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import {
  vendorBySlugQuery,
  wheelbasesByVendorQuery,
} from "../../../../sanity/lib/queries";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { WheelbaseCard } from "@/components/vendor/WheelbaseCard";
import { SettingExplainer } from "@/components/vendor/SettingExplainer";
import { Badge } from "@/components/ui/Badge";
import type { Vendor, Wheelbase } from "@/types";
import { Monitor, Lightbulb } from "lucide-react";

type Props = {
  params: Promise<{ vendorSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vendorSlug } = await params;
  const vendor = await sanityFetch<Vendor | null>(vendorBySlugQuery, {
    slug: vendorSlug,
  });

  if (!vendor) return { title: "Vendor Not Found" };

  return {
    title: `${vendor.name} FFB Settings | FFB Settings`,
    description: vendor.description || `Force feedback settings for ${vendor.name} wheelbases.`,
  };
}

export default async function VendorPage({ params }: Props) {
  const { vendorSlug } = await params;

  const [vendor, wheelbases] = await Promise.all([
    sanityFetch<Vendor | null>(vendorBySlugQuery, { slug: vendorSlug }),
    sanityFetch<Wheelbase[]>(wheelbasesByVendorQuery, { vendorSlug }),
  ]);

  if (!vendor) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Vendors", href: "/vendors" },
          { label: vendor.name },
        ]}
      />

      {/* Vendor header */}
      <section className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
        {vendor.logo && (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={urlFor(vendor.logo).width(200).height(200).url()}
              alt={vendor.name}
              fill
              className="object-contain p-2"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {vendor.name}
          </h1>
          {vendor.description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {vendor.description}
            </p>
          )}
          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Visit website
            </a>
          )}
        </div>
      </section>

      {/* Software overview */}
      {vendor.softwareName && (
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Software</h2>
          </div>
          <div className="mt-3">
            <Badge variant="secondary">{vendor.softwareName}</Badge>
            {vendor.softwareDescription && (
              <p className="mt-2 text-muted-foreground">
                {vendor.softwareDescription
                  .map((block) =>
                    block.children
                      ?.map((child: unknown) => (child as { text?: string }).text)
                      .join("")
                  )
                  .join(" ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Common settings */}
      {vendor.commonSettings && vendor.commonSettings.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Common Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Settings available in {vendor.softwareName || vendor.name} software.
          </p>
          <div className="mt-4 space-y-3">
            {vendor.commonSettings.map((setting) => (
              <SettingExplainer key={setting._id} setting={setting} />
            ))}
          </div>
        </section>
      )}

      {/* Tips */}
      {vendor.tips && vendor.tips.length > 0 && (
        <section className="mt-10 rounded-lg border border-border bg-muted/50 p-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Tips</h2>
          </div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            {vendor.tips.map((block, i) => (
              <p key={i}>
                {block.children
                  ?.map((child: unknown) => (child as { text?: string }).text)
                  .join("")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Wheelbases */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Wheelbases</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a wheelbase to see detailed specs and game-specific presets.
        </p>
        {wheelbases.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wheelbases.map((wb) => (
              <WheelbaseCard key={wb._id} wheelbase={wb} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">
            No wheelbases listed yet for {vendor.name}.
          </p>
        )}
      </section>
    </main>
  );
}
