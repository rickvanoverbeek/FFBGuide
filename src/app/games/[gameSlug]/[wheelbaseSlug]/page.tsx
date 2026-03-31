import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client, sanityFetch } from "../../../../../sanity/lib/client";
import { presetQuery } from "../../../../../sanity/lib/queries";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SettingExplainer } from "@/components/vendor/SettingExplainer";
import { Badge } from "@/components/ui/Badge";
import type { GameWheelbasePreset } from "@/types";
import { Monitor, Gamepad2, ClipboardCopy, CalendarCheck } from "lucide-react";

type Props = {
  params: Promise<{ gameSlug: string; wheelbaseSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gameSlug, wheelbaseSlug } = await params;
  const preset = await sanityFetch<GameWheelbasePreset | null>(presetQuery, {
    gameSlug,
    wheelbaseSlug,
  });

  if (!preset) return { title: "Preset Not Found" };

  return {
    title: `${preset.wheelbase.name} + ${preset.game.name} FFB Settings | FFB Settings`,
    description: `Optimized force feedback settings for ${preset.wheelbase.name} in ${preset.game.name}. Vendor software and in-game settings.`,
  };
}

export default async function PresetPage({ params }: Props) {
  const { gameSlug, wheelbaseSlug } = await params;

  const preset = await sanityFetch<GameWheelbasePreset | null>(presetQuery, {
    gameSlug,
    wheelbaseSlug,
  });

  if (!preset) notFound();

  const vendorSoftwareName =
    preset.wheelbase.vendor?.softwareName || "Vendor Software";

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Games", href: "/games" },
          { label: preset.game.name, href: `/games/${gameSlug}` },
          { label: preset.wheelbase.name },
        ]}
      />

      {/* Header */}
      <section className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {preset.wheelbase.name}
          <span className="text-muted-foreground"> in </span>
          {preset.game.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {preset.difficultyLevel && (
            <Badge variant="secondary">{preset.difficultyLevel}</Badge>
          )}
          {preset.lastVerified && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarCheck className="h-4 w-4" />
              Verified {preset.lastVerified}
            </span>
          )}
        </div>
      </section>

      {/* Overall notes */}
      {preset.overallNotes && preset.overallNotes.length > 0 && (
        <section className="mt-8 rounded-lg border border-border bg-muted/50 p-6">
          <h2 className="text-lg font-semibold">Notes</h2>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            {preset.overallNotes.map((block, i) => (
              <p key={i}>
                {block.children
                  ?.map((child: unknown) => (child as { text?: string }).text)
                  .join("")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Vendor software settings */}
      {preset.vendorSoftwareSettings &&
        preset.vendorSoftwareSettings.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-2xl font-semibold">
                {vendorSoftwareName} Settings
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Apply these settings in your {vendorSoftwareName} application.
            </p>
            <div className="mt-4 space-y-3">
              {preset.vendorSoftwareSettings.map((ps, i) => (
                <SettingExplainer
                  key={ps.setting?._id || i}
                  setting={ps.setting}
                  value={ps.value}
                  notes={ps.notes}
                />
              ))}
            </div>
          </section>
        )}

      {/* In-game settings */}
      {preset.inGameSettings && preset.inGameSettings.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">
              {preset.game.name} In-Game Settings
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Apply these settings within the game&apos;s FFB options menu.
          </p>
          <div className="mt-4 space-y-3">
            {preset.inGameSettings.map((ps, i) => (
              <SettingExplainer
                key={ps.setting?._id || i}
                setting={ps.setting}
                value={ps.value}
                notes={ps.notes}
              />
            ))}
          </div>
        </section>
      )}

      {/* Copy settings */}
      <section className="mt-10 rounded-lg border border-border p-6">
        <div className="flex items-center gap-2">
          <ClipboardCopy className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Copy Settings</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the values above to manually configure your {vendorSoftwareName}{" "}
          application and {preset.game.name} in-game options. Copy each value
          and apply it to the corresponding setting.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {preset.vendorSoftwareSettings &&
            preset.vendorSoftwareSettings.length > 0 && (
              <div className="rounded-md bg-muted px-4 py-3 text-sm">
                <span className="font-medium">{vendorSoftwareName}:</span>{" "}
                {preset.vendorSoftwareSettings
                  .map(
                    (ps) =>
                      `${ps.setting.name} = ${ps.value}${ps.setting.unit ? ` ${ps.setting.unit}` : ""}`
                  )
                  .join(", ")}
              </div>
            )}
          {preset.inGameSettings && preset.inGameSettings.length > 0 && (
            <div className="rounded-md bg-muted px-4 py-3 text-sm">
              <span className="font-medium">In-Game:</span>{" "}
              {preset.inGameSettings
                .map(
                  (ps) =>
                    `${ps.setting.name} = ${ps.value}${ps.setting.unit ? ` ${ps.setting.unit}` : ""}`
                )
                .join(", ")}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
