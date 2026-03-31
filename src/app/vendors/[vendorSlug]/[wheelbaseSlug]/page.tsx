import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, sanityFetch } from "../../../../../sanity/lib/client";
import { urlFor } from "../../../../../sanity/lib/image";
import {
  wheelbaseBySlugQuery,
  presetsByWheelbaseQuery,
} from "../../../../../sanity/lib/queries";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SettingExplainer } from "@/components/vendor/SettingExplainer";
import { Badge } from "@/components/ui/Badge";
import type { Wheelbase, GameWheelbasePreset } from "@/types";
import { Gauge, Gamepad2 } from "lucide-react";

type Props = {
  params: Promise<{ vendorSlug: string; wheelbaseSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vendorSlug, wheelbaseSlug } = await params;
  const wheelbase = await sanityFetch<Wheelbase | null>(wheelbaseBySlugQuery, {
    slug: wheelbaseSlug,
    vendorSlug,
  });

  if (!wheelbase) return { title: "Wheelbase Not Found" };

  return {
    title: `${wheelbase.name} FFB Settings | ${wheelbase.vendor.name} | FFB Settings`,
    description: `Force feedback settings and game presets for the ${wheelbase.vendor.name} ${wheelbase.name}.`,
  };
}

export default async function WheelbasePage({ params }: Props) {
  const { vendorSlug, wheelbaseSlug } = await params;

  const [wheelbase, presets] = await Promise.all([
    sanityFetch<Wheelbase | null>(wheelbaseBySlugQuery, {
      slug: wheelbaseSlug,
      vendorSlug,
    }),
    sanityFetch<GameWheelbasePreset[]>(presetsByWheelbaseQuery, {
      wheelbaseSlug,
    }),
  ]);

  if (!wheelbase) notFound();

  const specs = wheelbase.specs;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Vendors", href: "/vendors" },
          { label: wheelbase.vendor.name, href: `/vendors/${vendorSlug}` },
          { label: wheelbase.name },
        ]}
      />

      {/* Header */}
      <section className="mt-8 flex flex-col gap-6 md:flex-row md:items-start">
        {wheelbase.image && (
          <div className="relative aspect-[4/3] w-full max-w-sm shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={urlFor(wheelbase.image).width(600).height(450).url()}
              alt={wheelbase.name}
              fill
              className="object-contain p-4"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {wheelbase.name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {wheelbase.driveType && (
              <Badge variant="outline">{wheelbase.driveType}</Badge>
            )}
          </div>
        </div>
      </section>

      {/* Specs table */}
      {specs && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <Gauge className="h-5 w-5 text-muted-foreground" />
            Specifications
          </h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {specs.peakTorque && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">Peak Torque</td>
                    <td className="px-4 py-3 text-muted-foreground">{specs.peakTorque}</td>
                  </tr>
                )}
                {specs.continuousTorque && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">Continuous Torque</td>
                    <td className="px-4 py-3 text-muted-foreground">{specs.continuousTorque}</td>
                  </tr>
                )}
                {specs.rotationRange && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">Rotation Range</td>
                    <td className="px-4 py-3 text-muted-foreground">{specs.rotationRange}</td>
                  </tr>
                )}
                {specs.connectivity && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">Connectivity</td>
                    <td className="px-4 py-3 text-muted-foreground">{specs.connectivity}</td>
                  </tr>
                )}
                {specs.platformSupport && specs.platformSupport.length > 0 && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">Platforms</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {specs.platformSupport.map((p) => (
                          <Badge key={p} variant="secondary">{p}</Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Default settings */}
      {wheelbase.settingDefaults && wheelbase.settingDefaults.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Default Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Recommended baseline {wheelbase.vendor.softwareName || "software"} settings for the {wheelbase.name}.
          </p>
          <div className="mt-4 space-y-3">
            {wheelbase.settingDefaults.map((sd, i) => (
              <SettingExplainer
                key={sd.setting?._id || i}
                setting={sd.setting}
                value={sd.recommendedValue}
                notes={sd.notes}
              />
            ))}
          </div>
        </section>
      )}

      {/* Game presets */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <Gamepad2 className="h-5 w-5 text-muted-foreground" />
          Game Presets
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tuned FFB settings for specific games with this wheelbase.
        </p>
        {presets.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {presets.map((preset) => (
              <Link
                key={preset._id}
                href={`/games/${preset.game.slug.current}/${wheelbase.slug.current}`}
                className="group"
              >
                <div className="flex items-center gap-4 rounded-lg border border-border p-4 transition-shadow hover:shadow-md">
                  {preset.game.logo && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={urlFor(preset.game.logo).width(96).height(96).url()}
                        alt={preset.game.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {preset.game.name}
                    </span>
                    {preset.difficultyLevel && (
                      <div className="mt-1">
                        <Badge variant="secondary">{preset.difficultyLevel}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">
            No game presets available yet for the {wheelbase.name}.
          </p>
        )}
      </section>
    </main>
  );
}
