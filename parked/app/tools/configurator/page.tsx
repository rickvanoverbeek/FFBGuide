"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "../../../../sanity/lib/client";
import {
  allWheelbasesQuery,
  allGamesQuery,
  presetQuery,
} from "../../../../sanity/lib/queries";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Copy, Share2, AlertCircle } from "lucide-react";
import type { Wheelbase, Game, GameWheelbasePreset } from "@/types";

export default function ConfiguratorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [wheelbases, setWheelbases] = useState<Wheelbase[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [preset, setPreset] = useState<GameWheelbasePreset | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const selectedWheelbase = searchParams.get("wheelbase") ?? "";
  const selectedGame = searchParams.get("game") ?? "";

  // Fetch base data
  useEffect(() => {
    async function load() {
      const [wb, g] = await Promise.all([
        sanityFetch<Wheelbase[]>(allWheelbasesQuery),
        sanityFetch<Game[]>(allGamesQuery),
      ]);
      setWheelbases(wb ?? []);
      setGames(g ?? []);
      setDataLoaded(true);
    }
    load();
  }, []);

  // Fetch preset when both are selected
  useEffect(() => {
    if (!selectedWheelbase || !selectedGame) {
      setPreset(null);
      return;
    }

    async function fetchPreset() {
      setLoading(true);
      const result = await sanityFetch<GameWheelbasePreset | null>(presetQuery, {
        wheelbaseSlug: selectedWheelbase,
        gameSlug: selectedGame,
      });
      setPreset(result);
      setLoading(false);
    }

    fetchPreset();
  }, [selectedWheelbase, selectedGame]);

  // Group wheelbases by vendor
  const groupedWheelbases = useMemo(() => {
    const groups: Record<string, Wheelbase[]> = {};
    for (const wb of wheelbases) {
      const vendorName = wb.vendor?.name ?? "Other";
      if (!groups[vendorName]) groups[vendorName] = [];
      groups[vendorName].push(wb);
    }
    return groups;
  }, [wheelbases]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const copySettings = useCallback(() => {
    if (!preset) return;

    const lines: string[] = [];
    if (preset.vendorSoftwareSettings?.length) {
      lines.push("== Vendor Software Settings ==");
      for (const s of preset.vendorSoftwareSettings) {
        lines.push(`${s.setting.name}: ${s.value}${s.notes ? ` (${s.notes})` : ""}`);
      }
    }
    if (preset.inGameSettings?.length) {
      lines.push("", "== In-Game Settings ==");
      for (const s of preset.inGameSettings) {
        lines.push(`${s.setting.name}: ${s.value}${s.notes ? ` (${s.notes})` : ""}`);
      }
    }
    navigator.clipboard.writeText(lines.join("\n"));
  }, [preset]);

  function shareLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          FFB Configurator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Select your wheelbase and game to get recommended force feedback
          settings.
        </p>
      </section>

      {/* Selectors */}
      <div className="mx-auto mb-10 grid max-w-2xl gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Select your wheelbase
          </label>
          <Select
            value={selectedWheelbase}
            onValueChange={(v) => updateParam("wheelbase", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={dataLoaded ? "Choose wheelbase" : "Loading..."} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedWheelbases).map(([vendor, wbs]) => (
                <SelectGroup key={vendor}>
                  <SelectLabel>{vendor}</SelectLabel>
                  {wbs.map((wb) => (
                    <SelectItem key={wb._id} value={wb.slug.current}>
                      {wb.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Select your game
          </label>
          <Select
            value={selectedGame}
            onValueChange={(v) => updateParam("game", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={dataLoaded ? "Choose game" : "Loading..."} />
            </SelectTrigger>
            <SelectContent>
              {games.map((game) => (
                <SelectItem key={game._id} value={game.slug.current}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <p className="text-center text-muted-foreground">Loading preset...</p>
      )}

      {!loading && selectedWheelbase && selectedGame && !preset && (
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              No preset available for this combination
            </p>
            <p className="text-sm text-muted-foreground">
              We don&apos;t have a preset for this wheelbase and game yet.
              Check the individual pages for general guidance:
            </p>
            <div className="flex gap-3">
              <Link href={`/games/${selectedGame}`}>
                <Button variant="outline" size="sm">
                  View Game
                </Button>
              </Link>
              <Link href={`/vendors`}>
                <Button variant="outline" size="sm">
                  View Vendors
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && preset && (
        <div className="space-y-8">
          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={copySettings}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Settings
            </Button>
            <Button variant="outline" size="sm" onClick={shareLink}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
          </div>

          {/* Vendor Software Settings */}
          {preset.vendorSoftwareSettings &&
            preset.vendorSoftwareSettings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Software Settings</CardTitle>
                  {preset.wheelbase?.vendor?.softwareName && (
                    <Badge variant="secondary">
                      {preset.wheelbase.vendor.softwareName}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 pr-4 text-left font-medium text-foreground">
                            Setting
                          </th>
                          <th className="py-2 pr-4 text-left font-medium text-foreground">
                            Value
                          </th>
                          <th className="py-2 text-left font-medium text-foreground">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {preset.vendorSoftwareSettings.map((s, i) => (
                          <tr
                            key={s.setting._id}
                            className={i % 2 === 0 ? "bg-muted/50" : ""}
                          >
                            <td className="py-2 pr-4 font-medium text-foreground">
                              {s.setting.name}
                              {s.setting.unit && (
                                <span className="ml-1 text-xs text-muted-foreground">
                                  ({s.setting.unit})
                                </span>
                              )}
                            </td>
                            <td className="py-2 pr-4 text-foreground">
                              {s.value}
                            </td>
                            <td className="py-2 text-muted-foreground">
                              {s.notes ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* In-Game Settings */}
          {preset.inGameSettings && preset.inGameSettings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>In-Game Settings</CardTitle>
                {preset.game?.name && (
                  <Badge variant="secondary">{preset.game.name}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 pr-4 text-left font-medium text-foreground">
                          Setting
                        </th>
                        <th className="py-2 pr-4 text-left font-medium text-foreground">
                          Value
                        </th>
                        <th className="py-2 text-left font-medium text-foreground">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {preset.inGameSettings.map((s, i) => (
                        <tr
                          key={s.setting._id}
                          className={i % 2 === 0 ? "bg-muted/50" : ""}
                        >
                          <td className="py-2 pr-4 font-medium text-foreground">
                            {s.setting.name}
                            {s.setting.unit && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({s.setting.unit})
                              </span>
                            )}
                          </td>
                          <td className="py-2 pr-4 text-foreground">
                            {s.value}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {s.notes ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </main>
  );
}
