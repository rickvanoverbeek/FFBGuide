"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Upload, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { createClient } from "@/lib/supabase/client";
import { getApprovedProfiles } from "@/lib/supabase/queries";
import { sanityFetch } from "../../../sanity/lib/client";
import { allGamesQuery, allVendorsQuery } from "../../../sanity/lib/queries";
import {
  DIFFICULTY_LEVELS,
  DRIVING_STYLES,
  PROFILE_SORT_OPTIONS,
} from "@/lib/constants";
import type { FFBProfile, Game, Vendor } from "@/types";

const PER_PAGE = 12;

function ProfileLibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state from URL
  const [gameSlug, setGameSlug] = useState(searchParams.get("game") ?? "");
  const [vendorSlug, setVendorSlug] = useState(searchParams.get("vendor") ?? "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") ?? "");
  const [drivingStyle, setDrivingStyle] = useState(searchParams.get("style") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Data state
  const [profiles, setProfiles] = useState<(FFBProfile & { author: FFBProfile["author"] })[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const supabase = createClient();
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // Load Sanity filter data
  useEffect(() => {
    async function loadFilters() {
      const [gamesData, vendorsData] = await Promise.all([
        sanityFetch<Game[]>(allGamesQuery),
        sanityFetch<Vendor[]>(allVendorsQuery),
      ]);
      setGames(gamesData ?? []);
      setVendors(vendorsData ?? []);
    }
    loadFilters();
  }, []);

  // Sync filters to URL
  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (gameSlug) params.set("game", gameSlug);
    if (vendorSlug) params.set("vendor", vendorSlug);
    if (difficulty) params.set("difficulty", difficulty);
    if (drivingStyle) params.set("style", drivingStyle);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (search) params.set("q", search);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/profiles${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [gameSlug, vendorSlug, difficulty, drivingStyle, sort, search, page, router]);

  // Fetch profiles
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { data, count, error } = await getApprovedProfiles(supabase, {
        gameSlug: gameSlug || undefined,
        vendorSlug: vendorSlug || undefined,
        difficulty: difficulty || undefined,
        drivingStyle: drivingStyle || undefined,
        sort: sort || undefined,
        search: search || undefined,
        page,
        perPage: PER_PAGE,
      });
      if (error) throw new Error(error.message);
      setProfiles(data ?? []);
      setTotalCount(count ?? 0);
    } catch {
      setProfiles([]);
      setTotalCount(0);
      setLoadError("Could not load profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [gameSlug, vendorSlug, difficulty, drivingStyle, sort, search, page]);

  useEffect(() => {
    fetchProfiles();
    syncUrl();
  }, [fetchProfiles, syncUrl]);

  // Reset page when filters change
  function updateFilter(setter: (v: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter(setSearch, searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            FFB Profile Library
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse community-shared force feedback profiles for every wheelbase and game
          </p>
          <div className="mt-6">
            <Link href="/profiles/upload">
              <Button>
                <Upload className="h-4 w-4" />
                Upload Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters + Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-3 mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filters
          </div>

          <Select
            value={gameSlug}
            onValueChange={(v) => updateFilter(setGameSlug, v === "__all__" ? "" : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Games" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Games</SelectItem>
              {games.map((g) => (
                <SelectItem key={g._id} value={g.slug.current}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={vendorSlug}
            onValueChange={(v) => updateFilter(setVendorSlug, v === "__all__" ? "" : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Vendors</SelectItem>
              {vendors.map((v) => (
                <SelectItem key={v._id} value={v.slug.current}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={difficulty}
            onValueChange={(v) => updateFilter(setDifficulty, v === "__all__" ? "" : v)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Difficulties</SelectItem>
              {DIFFICULTY_LEVELS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={drivingStyle}
            onValueChange={(v) => updateFilter(setDrivingStyle, v === "__all__" ? "" : v)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Driving Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Styles</SelectItem>
              {DRIVING_STYLES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => updateFilter(setSort, v)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {PROFILE_SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search profiles..."
            className="w-[220px]"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-xl border border-border bg-muted"
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium">{loadError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchProfiles}
            >
              Retry
            </Button>
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium">No profiles found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function ProfilesPage() {
  return (
    <Suspense>
      <ProfileLibraryContent />
    </Suspense>
  );
}
