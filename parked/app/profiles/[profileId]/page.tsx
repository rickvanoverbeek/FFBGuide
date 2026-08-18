"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Download,
  Heart,
  Copy,
  Share2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { RatingStars } from "@/components/profiles/RatingStars";
import { CommentSection } from "@/components/profiles/CommentSection";
import { createClient } from "@/lib/supabase/client";
import {
  getProfileById,
  getUserRating,
  upsertRating,
  recordDownload,
  toggleFavorite,
  isFavorited,
} from "@/lib/supabase/queries";
import { formatDate, cn } from "@/lib/utils";
import type { FFBProfile, UserProfile } from "@/types";

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const supabase = createClient();

  const [profile, setProfile] = useState<(FFBProfile & { author: FFBProfile["author"] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [copied, setCopied] = useState<"settings" | "url" | null>(null);

  // Fetch profile + auth
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [{ data, error: fetchError }, { data: { user } }] = await Promise.all([
        getProfileById(supabase, profileId),
        supabase.auth.getUser(),
      ]);

      if (fetchError || !data) {
        setError("Profile not found.");
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);

      if (user) {
        setCurrentUser({ id: user.id });
        const [{ data: rating }, favStatus] = await Promise.all([
          getUserRating(supabase, profileId, user.id),
          isFavorited(supabase, profileId, user.id),
        ]);
        if (rating) setUserRating(rating.rating);
        setFavorited(favStatus);
      }
    }
    load();
  }, [profileId]);

  async function handleRate(rating: number) {
    if (!currentUser || !profile) return;
    const { data } = await upsertRating(supabase, profileId, currentUser.id, rating);
    if (data) {
      setUserRating(data.rating);
      // Refetch profile to get updated avg
      const { data: updated } = await getProfileById(supabase, profileId);
      if (updated) setProfile(updated);
    }
  }

  async function handleDownload() {
    if (!profile) return;
    setDownloadLoading(true);
    await recordDownload(supabase, profileId, currentUser?.id);

    if (profile.config_file_url) {
      const link = document.createElement("a");
      link.href = profile.config_file_url;
      link.download = profile.config_file_name ?? "config";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Update local count
    setProfile((prev) => prev ? { ...prev, download_count: prev.download_count + 1 } : prev);
    setDownloadLoading(false);
  }

  async function handleToggleFavorite() {
    if (!currentUser) return;
    await toggleFavorite(supabase, profileId, currentUser.id);
    setFavorited((prev) => !prev);
  }

  function handleCopySettings() {
    if (!profile) return;
    const text = [
      `${profile.title}`,
      "",
      "Vendor Software Settings:",
      ...Object.entries(profile.vendor_settings).map(([k, v]) => `  ${k}: ${v}`),
      "",
      "In-Game Settings:",
      ...Object.entries(profile.ingame_settings).map(([k, v]) => `  ${k}: ${v}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied("settings");
    setTimeout(() => setCopied(null), 2000);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied("url");
    setTimeout(() => setCopied(null), 2000);
  }

  function renderSettingsTable(settings: Record<string, string | number | boolean>) {
    const entries = Object.entries(settings);
    if (entries.length === 0) {
      return (
        <p className="text-sm text-muted-foreground py-4">No settings recorded.</p>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-medium text-muted-foreground">Setting</th>
              <th className="py-2 font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, value]) => (
              <tr key={name} className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">{name}</td>
                <td className="py-2">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-4">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">{error ?? "Profile not found"}</h2>
        <Link href="/profiles" className="mt-4 inline-block text-primary hover:underline">
          Back to profiles
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Profiles", href: "/profiles" },
          { label: profile.title },
        ]}
      />

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold sm:text-3xl">{profile.title}</h1>

        {/* Author + date */}
        <div className="flex items-center gap-3">
          {profile.author?.avatar_url ? (
            <img
              src={profile.author.avatar_url}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
              {(profile.author?.display_name ?? profile.author?.username ?? "?")[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium">
              {profile.author?.display_name ?? profile.author?.username ?? "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(profile.created_at)}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/games/${profile.game_slug}`}
            className="text-sm text-primary hover:underline"
          >
            {formatSlug(profile.game_slug)}
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link
            href={`/vendors/${profile.vendor_slug}`}
            className="text-sm text-primary hover:underline"
          >
            {formatSlug(profile.vendor_slug)}
          </Link>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">
            {formatSlug(profile.wheelbase_slug)}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {profile.difficulty && <Badge variant="secondary">{profile.difficulty}</Badge>}
          {profile.driving_style && <Badge variant="outline">{profile.driving_style}</Badge>}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {profile.download_count.toLocaleString()} downloads
          </span>
          <RatingStars
            profileId={profileId}
            currentRating={userRating}
            avgRating={profile.avg_rating}
            ratingCount={profile.rating_count}
            onRate={currentUser ? handleRate : undefined}
          />
        </div>
      </div>

      {/* Description */}
      {profile.description && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>{profile.description}</p>
        </div>
      )}

      {/* Settings tabs */}
      <Tabs defaultValue="vendor" className="w-full">
        <TabsList>
          <TabsTrigger value="vendor">Vendor Software Settings</TabsTrigger>
          <TabsTrigger value="ingame">In-Game Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="vendor" className="mt-4">
          {renderSettingsTable(profile.vendor_settings)}
        </TabsContent>
        <TabsContent value="ingame" className="mt-4">
          {renderSettingsTable(profile.ingame_settings)}
        </TabsContent>
      </Tabs>

      {/* Notes */}
      {profile.notes && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{profile.notes}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleDownload} loading={downloadLoading}>
          <Download className="h-4 w-4" />
          {profile.config_file_url ? "Download Config" : "Record Download"}
        </Button>

        {currentUser && (
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            className={cn(favorited && "text-red-500 border-red-500/30")}
          >
            <Heart className={cn("h-4 w-4", favorited && "fill-red-500")} />
            {favorited ? "Favorited" : "Favorite"}
          </Button>
        )}

        <Button variant="outline" onClick={handleCopySettings}>
          <Copy className="h-4 w-4" />
          {copied === "settings" ? "Copied!" : "Copy Settings"}
        </Button>

        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          {copied === "url" ? "Link Copied!" : "Share"}
        </Button>

        <Link href={`/profiles/compare?ids=${profileId}`}>
          <Button variant="outline">Compare</Button>
        </Link>
      </div>

      {/* Comments */}
      <div className="border-t border-border pt-8">
        <CommentSection profileId={profileId} currentUserId={currentUser?.id ?? null} />
      </div>
    </div>
  );
}
