import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, sanityFetch } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import {
  gameBySlugQuery,
  presetsByGameQuery,
} from "../../../../sanity/lib/queries";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SettingExplainer } from "@/components/vendor/SettingExplainer";
import { Badge } from "@/components/ui/Badge";
import type { Game, GameWheelbasePreset } from "@/types";
import { Lightbulb, Settings, Gamepad2 } from "lucide-react";

type Props = {
  params: Promise<{ gameSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gameSlug } = await params;
  const game = await sanityFetch<Game | null>(gameBySlugQuery, {
    slug: gameSlug,
  });

  if (!game) return { title: "Game Not Found" };

  return {
    title: `${game.name} FFB Settings | FFB Settings`,
    description: `Optimized force feedback settings for ${game.name}. In-game FFB configuration and wheelbase presets.`,
  };
}

export default async function GamePage({ params }: Props) {
  const { gameSlug } = await params;

  const [game, presets] = await Promise.all([
    sanityFetch<Game | null>(gameBySlugQuery, { slug: gameSlug }),
    sanityFetch<GameWheelbasePreset[]>(presetsByGameQuery, { gameSlug }),
  ]);

  if (!game) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Games", href: "/games" },
          { label: game.name },
        ]}
      />

      {/* Game header */}
      <section className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
        {game.logo && (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={urlFor(game.logo).width(200).height(200).url()}
              alt={game.name}
              fill
              className="object-contain p-2"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {game.name}
          </h1>
          {game.platforms && game.platforms.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {game.platforms.map((platform) => (
                <Badge key={platform} variant="outline">{platform}</Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FFB implementation */}
      {game.ffbImplementation && game.ffbImplementation.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">FFB Implementation</h2>
          </div>
          <div className="mt-3 space-y-2 text-muted-foreground">
            {game.ffbImplementation.map((block, i) => (
              <p key={i}>
                {block.children
                  ?.map((child: unknown) => (child as { text?: string }).text)
                  .join("")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* In-game settings */}
      {game.inGameSettings && game.inGameSettings.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">In-Game FFB Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Force feedback settings available within {game.name}.
          </p>
          <div className="mt-4 space-y-3">
            {game.inGameSettings.map((gs, i) => (
              <SettingExplainer
                key={gs.setting?._id || i}
                setting={{
                  ...gs.setting,
                  name: gs.gameSpecificName || gs.setting.name,
                }}
                value={gs.defaultValue}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tips */}
      {game.tips && game.tips.length > 0 && (
        <section className="mt-10 rounded-lg border border-border bg-muted/50 p-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Tips</h2>
          </div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            {game.tips.map((block, i) => (
              <p key={i}>
                {block.children
                  ?.map((child: unknown) => (child as { text?: string }).text)
                  .join("")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Wheelbase presets */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <Gamepad2 className="h-5 w-5 text-muted-foreground" />
          Wheelbase Presets
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select your wheelbase to see tuned FFB settings for {game.name}.
        </p>
        {presets.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {presets.map((preset) => (
              <Link
                key={preset._id}
                href={`/games/${game.slug.current}/${preset.wheelbase.slug.current}`}
                className="group"
              >
                <div className="flex items-center gap-4 rounded-lg border border-border p-4 transition-shadow hover:shadow-md">
                  <div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {preset.wheelbase.name}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {preset.wheelbase.vendor?.name}
                    </p>
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
            No wheelbase presets available yet for {game.name}.
          </p>
        )}
      </section>
    </main>
  );
}
