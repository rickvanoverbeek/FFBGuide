"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Share2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/Modal";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { createClient } from "@/lib/supabase/client";
import { getProfileById, getApprovedProfiles } from "@/lib/supabase/queries";
import type { FFBProfile } from "@/types";

const MAX_PROFILES = 4;

type ProfileWithAuthor = FFBProfile & { author: FFBProfile["author"] };

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [profiles, setProfiles] = useState<ProfileWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileWithAuthor[]>([]);
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load profiles from URL ids
  useEffect(() => {
    async function load() {
      const idsParam = searchParams.get("ids");
      if (!idsParam) {
        setLoading(false);
        return;
      }
      const ids = idsParam.split(",").filter(Boolean).slice(0, MAX_PROFILES);
      const results = await Promise.all(
        ids.map((id) => getProfileById(supabase, id))
      );
      const loaded = results
        .map((r) => r.data)
        .filter((d): d is ProfileWithAuthor => d !== null);
      setProfiles(loaded);
      setLoading(false);
    }
    load();
  }, [searchParams]);

  // Update URL when profiles change
  function updateUrl(newProfiles: ProfileWithAuthor[]) {
    const ids = newProfiles.map((p) => p.id).join(",");
    router.replace(`/profiles/compare${ids ? `?ids=${ids}` : ""}`, {
      scroll: false,
    });
  }

  function removeProfile(id: string) {
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    updateUrl(updated);
  }

  // Search for profiles to add
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const { data } = await getApprovedProfiles(supabase, {
        search: searchQuery,
        perPage: 10,
      });
      const filtered = (data ?? []).filter(
        (p) => !profiles.some((existing) => existing.id === p.id)
      );
      setSearchResults(filtered);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, profiles]);

  function addProfile(profile: ProfileWithAuthor) {
    const updated = [...profiles, profile];
    setProfiles(updated);
    updateUrl(updated);
    setModalOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Collect all unique setting keys
  const allVendorKeys = [
    ...new Set(profiles.flatMap((p) => Object.keys(p.vendor_settings))),
  ].sort();
  const allIngameKeys = [
    ...new Set(profiles.flatMap((p) => Object.keys(p.ingame_settings))),
  ].sort();

  function getValueClass(key: string, settings: "vendor_settings" | "ingame_settings") {
    const values = profiles.map((p) => String(p[settings][key] ?? "-"));
    const unique = new Set(values);
    return unique.size > 1 ? "bg-yellow-500/10" : "";
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-8 h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Profiles", href: "/profiles" },
          { label: "Compare" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compare Profiles</h1>
          <p className="mt-1 text-muted-foreground">
            Compare FFB settings side by side
          </p>
        </div>
        <div className="flex gap-2">
          {profiles.length < MAX_PROFILES && (
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              Add Profile
            </Button>
          )}
          {profiles.length >= 2 && (
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              {copied ? "Link Copied!" : "Share Comparison"}
            </Button>
          )}
        </div>
      </div>

      {profiles.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Select at least 2 profiles to compare</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {profiles.length === 0
              ? "Use the 'Add Profile' button to get started."
              : "Add one more profile to begin comparing."}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => setModalOpen(true)}
          >
            Add Profile
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            {/* Profile headers */}
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 text-left font-medium text-muted-foreground w-48">
                  Setting
                </th>
                {profiles.map((profile) => (
                  <th key={profile.id} className="py-3 px-4 text-left min-w-[180px]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/profiles/${profile.id}`}
                          className="font-semibold text-primary hover:underline line-clamp-1"
                        >
                          {profile.title}
                        </Link>
                        <button
                          onClick={() => removeProfile(profile.id)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground font-normal">
                        by{" "}
                        {profile.author?.display_name ??
                          profile.author?.username ??
                          "Unknown"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-normal">
                        {"★".repeat(Math.round(profile.avg_rating))}{" "}
                        {profile.avg_rating.toFixed(1)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Metadata section */}
              <tr className="bg-muted/50">
                <td
                  colSpan={profiles.length + 1}
                  className="py-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Metadata
                </td>
              </tr>
              {(
                [
                  ["Game", (p: ProfileWithAuthor) => formatSlug(p.game_slug)],
                  ["Wheelbase", (p: ProfileWithAuthor) => formatSlug(p.wheelbase_slug)],
                  ["Difficulty", (p: ProfileWithAuthor) => p.difficulty ?? "-"],
                  ["Driving Style", (p: ProfileWithAuthor) => p.driving_style ?? "-"],
                ] as const
              ).map(([label, getter]) => (
                <tr key={label} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">{label}</td>
                  {profiles.map((p) => {
                    const val = getter(p);
                    const values = profiles.map((pp) => getter(pp));
                    const differs = new Set(values).size > 1;
                    return (
                      <td
                        key={p.id}
                        className={`py-2 px-4 ${differs ? "bg-yellow-500/10" : ""}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Vendor settings */}
              {allVendorKeys.length > 0 && (
                <>
                  <tr className="bg-muted/50">
                    <td
                      colSpan={profiles.length + 1}
                      className="py-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Vendor Software Settings
                    </td>
                  </tr>
                  {allVendorKeys.map((key) => (
                    <tr key={`vendor-${key}`} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">{key}</td>
                      {profiles.map((p) => (
                        <td
                          key={p.id}
                          className={`py-2 px-4 ${getValueClass(key, "vendor_settings")}`}
                        >
                          {String(p.vendor_settings[key] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}

              {/* In-game settings */}
              {allIngameKeys.length > 0 && (
                <>
                  <tr className="bg-muted/50">
                    <td
                      colSpan={profiles.length + 1}
                      className="py-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      In-Game Settings
                    </td>
                  </tr>
                  {allIngameKeys.map((key) => (
                    <tr key={`ingame-${key}`} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">{key}</td>
                      {profiles.map((p) => (
                        <td
                          key={p.id}
                          className={`py-2 px-4 ${getValueClass(key, "ingame_settings")}`}
                        >
                          {String(p.ingame_settings[key] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Profile Modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Profile to Comparison</ModalTitle>
            <ModalDescription>
              Search for a profile to add to the comparison table.
            </ModalDescription>
          </ModalHeader>

          <div className="mt-4 space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title..."
            />

            <div className="max-h-64 overflow-y-auto space-y-2">
              {searching && (
                <p className="text-sm text-muted-foreground py-2">Searching...</p>
              )}
              {!searching && searchQuery && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No results found.</p>
              )}
              {searchResults.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => addProfile(profile)}
                  className="w-full text-left rounded-lg border border-border p-3 hover:bg-muted transition-colors"
                >
                  <p className="text-sm font-medium">{profile.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatSlug(profile.game_slug)} - {formatSlug(profile.wheelbase_slug)}
                    {" | "}
                    by{" "}
                    {profile.author?.display_name ??
                      profile.author?.username ??
                      "Unknown"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}
