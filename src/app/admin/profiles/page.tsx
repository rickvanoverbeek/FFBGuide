"use client";

import { useEffect, useState } from "react";
import { Check, X, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { getPendingProfiles, moderateProfile } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";
import type { FFBProfile, UserProfile } from "@/types";

type ProfileWithAuthor = FFBProfile & { author: FFBProfile["author"] };

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminProfilesPage() {
  const supabase = createClient();

  const [authState, setAuthState] = useState<"loading" | "denied" | "allowed">("loading");
  const [profiles, setProfiles] = useState<ProfileWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; type: "success" | "error"; message: string } | null>(null);

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setAuthState("denied");
        return;
      }
      // Check trust level
      const { data: profile } = await supabase
        .from("profiles")
        .select("trust_level")
        .eq("id", user.id)
        .single();

      if (profile?.trust_level === "admin") {
        setAuthState("allowed");
        loadProfiles();
      } else {
        setAuthState("denied");
      }
    }
    checkAuth();
  }, []);

  async function loadProfiles() {
    setLoading(true);
    const { data } = await getPendingProfiles(supabase);
    setProfiles((data as ProfileWithAuthor[]) ?? []);
    setLoading(false);
  }

  async function handleModerate(id: string, status: "approved" | "rejected") {
    setActionLoading(id);
    setFeedback(null);
    const { error } = await moderateProfile(supabase, id, status);

    if (error) {
      setFeedback({
        id,
        type: "error",
        message: `Failed to ${status === "approved" ? "approve" : "reject"} profile.`,
      });
    } else {
      setFeedback({
        id,
        type: "success",
        message: `Profile ${status === "approved" ? "approved" : "rejected"} successfully.`,
      });
      // Remove from list after short delay
      setTimeout(() => {
        setProfiles((prev) => prev.filter((p) => p.id !== id));
        setFeedback(null);
      }, 1500);
    }
    setActionLoading(null);
  }

  if (authState === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="h-8 w-48 mx-auto animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (authState === "denied") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">
          You do not have permission to access the moderation queue.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile Moderation Queue</h1>
        <p className="mt-1 text-muted-foreground">
          Review and approve or reject community-submitted FFB profiles
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Check className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium">All caught up!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No profiles pending review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => {
            const expanded = expandedId === profile.id;
            const isLoading = actionLoading === profile.id;
            const fb = feedback?.id === profile.id ? feedback : null;

            return (
              <div
                key={profile.id}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                {/* Summary row */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{profile.title}</h3>
                      <Badge variant="outline" className="shrink-0">Pending</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                      <span>
                        by{" "}
                        {profile.author?.display_name ??
                          profile.author?.username ??
                          "Unknown"}
                      </span>
                      <span>{formatSlug(profile.game_slug)}</span>
                      <span>{formatSlug(profile.wheelbase_slug)}</span>
                      <span>{formatDate(profile.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600/30 hover:bg-green-600/10"
                      disabled={isLoading}
                      onClick={() => handleModerate(profile.id, "approved")}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      disabled={isLoading}
                      onClick={() => handleModerate(profile.id, "rejected")}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() =>
                        setExpandedId(expanded ? null : profile.id)
                      }
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Feedback */}
                {fb && (
                  <div
                    className={`px-4 pb-3 text-sm ${
                      fb.type === "success" ? "text-green-600" : "text-destructive"
                    }`}
                  >
                    {fb.message}
                  </div>
                )}

                {/* Expanded detail */}
                {expanded && (
                  <div className="border-t border-border p-4 space-y-4">
                    {profile.description && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Description
                        </h4>
                        <p className="text-sm">{profile.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Difficulty
                        </h4>
                        <p className="text-sm">{profile.difficulty ?? "Not set"}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Driving Style
                        </h4>
                        <p className="text-sm">
                          {profile.driving_style ?? "Not set"}
                        </p>
                      </div>
                    </div>

                    {Object.keys(profile.vendor_settings).length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Vendor Software Settings
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border text-left">
                                <th className="py-1.5 pr-4 font-medium text-muted-foreground">
                                  Setting
                                </th>
                                <th className="py-1.5 font-medium text-muted-foreground">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(profile.vendor_settings).map(
                                ([k, v]) => (
                                  <tr
                                    key={k}
                                    className="border-b border-border/50"
                                  >
                                    <td className="py-1.5 pr-4">{k}</td>
                                    <td className="py-1.5">{String(v)}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {Object.keys(profile.ingame_settings).length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          In-Game Settings
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border text-left">
                                <th className="py-1.5 pr-4 font-medium text-muted-foreground">
                                  Setting
                                </th>
                                <th className="py-1.5 font-medium text-muted-foreground">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(profile.ingame_settings).map(
                                ([k, v]) => (
                                  <tr
                                    key={k}
                                    className="border-b border-border/50"
                                  >
                                    <td className="py-1.5 pr-4">{k}</td>
                                    <td className="py-1.5">{String(v)}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {profile.notes && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Notes
                        </h4>
                        <p className="text-sm whitespace-pre-wrap">
                          {profile.notes}
                        </p>
                      </div>
                    )}

                    {profile.config_file_url && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Config File
                        </h4>
                        <a
                          href={profile.config_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {profile.config_file_name ?? "Download"}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
