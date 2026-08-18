import type { Metadata } from "next";
import { client, sanityFetch } from "../../../sanity/lib/client";
import { allGamesQuery } from "../../../sanity/lib/queries";
import { GameCard } from "@/components/game/GameCard";
import type { Game } from "@/types";

export const metadata: Metadata = {
  title: "Sim Racing Games | FFB Settings",
  description:
    "Browse sim racing games and find optimized force feedback settings for your wheelbase.",
};

export default async function GamesPage() {
  const games = await sanityFetch<Game[]>(allGamesQuery);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Sim Racing Games
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Find the best force feedback settings for your favorite sim racing
          titles. Select a game to explore FFB implementation details and
          wheelbase-specific presets.
        </p>
      </section>

      {/* Game grid */}
      {games.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No games found. Check back soon.
        </p>
      )}
    </main>
  );
}
