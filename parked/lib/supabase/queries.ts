import type { SupabaseClient } from "@supabase/supabase-js";
import type { FFBProfile, ProfileComment, ProfileRating } from "@/types";

// ── FFB Profiles ──

export async function getApprovedProfiles(
  supabase: SupabaseClient,
  options: {
    gameSlug?: string;
    vendorSlug?: string;
    wheelbaseSlug?: string;
    difficulty?: string;
    drivingStyle?: string;
    sort?: string;
    search?: string;
    page?: number;
    perPage?: number;
  } = {}
) {
  const { page = 1, perPage = 12 } = options;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("ffb_profiles")
    .select("*, author:profiles(*)", { count: "exact" })
    .eq("status", "approved");

  if (options.gameSlug) query = query.eq("game_slug", options.gameSlug);
  if (options.vendorSlug) query = query.eq("vendor_slug", options.vendorSlug);
  if (options.wheelbaseSlug) query = query.eq("wheelbase_slug", options.wheelbaseSlug);
  if (options.difficulty) query = query.eq("difficulty", options.difficulty);
  if (options.drivingStyle) query = query.eq("driving_style", options.drivingStyle);
  if (options.search) query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);

  switch (options.sort) {
    case "top-rated":
      query = query.order("avg_rating", { ascending: false });
      break;
    case "most-downloaded":
      query = query.order("download_count", { ascending: false });
      break;
    case "recently-updated":
      query = query.order("updated_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  return { data: data as (FFBProfile & { author: FFBProfile["author"] })[] | null, count, error };
}

export async function getProfileById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("ffb_profiles")
    .select("*, author:profiles(*)")
    .eq("id", id)
    .single();
  return { data: data as FFBProfile & { author: FFBProfile["author"] } | null, error };
}

export async function createProfile(
  supabase: SupabaseClient,
  profile: Omit<FFBProfile, "id" | "author" | "status" | "download_count" | "avg_rating" | "rating_count" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("ffb_profiles")
    .insert(profile)
    .select()
    .single();
  return { data: data as FFBProfile | null, error };
}

export async function updateProfile(supabase: SupabaseClient, id: string, updates: Partial<FFBProfile>) {
  const { data, error } = await supabase
    .from("ffb_profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data: data as FFBProfile | null, error };
}

export async function deleteProfile(supabase: SupabaseClient, id: string) {
  return supabase.from("ffb_profiles").delete().eq("id", id);
}

// ── Pending Profiles (Admin) ──

export async function getPendingProfiles(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("ffb_profiles")
    .select("*, author:profiles(*)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return { data: data as (FFBProfile & { author: FFBProfile["author"] })[] | null, error };
}

export async function moderateProfile(supabase: SupabaseClient, id: string, status: "approved" | "rejected") {
  return supabase.from("ffb_profiles").update({ status }).eq("id", id);
}

// ── Ratings ──

export async function getUserRating(supabase: SupabaseClient, profileId: string, userId: string) {
  const { data, error } = await supabase
    .from("profile_ratings")
    .select("*")
    .eq("profile_id", profileId)
    .eq("user_id", userId)
    .single();
  return { data: data as ProfileRating | null, error };
}

export async function upsertRating(supabase: SupabaseClient, profileId: string, userId: string, rating: number) {
  const { data, error } = await supabase
    .from("profile_ratings")
    .upsert({ profile_id: profileId, user_id: userId, rating }, { onConflict: "profile_id,user_id" })
    .select()
    .single();
  return { data: data as ProfileRating | null, error };
}

// ── Comments ──

export async function getComments(supabase: SupabaseClient, profileId: string) {
  const { data, error } = await supabase
    .from("profile_comments")
    .select("*, user:profiles(*)")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: true });
  return { data: data as (ProfileComment & { user: ProfileComment["user"] })[] | null, error };
}

export async function createComment(supabase: SupabaseClient, profileId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from("profile_comments")
    .insert({ profile_id: profileId, user_id: userId, content })
    .select("*, user:profiles(*)")
    .single();
  return { data: data as ProfileComment | null, error };
}

export async function updateComment(supabase: SupabaseClient, id: string, content: string) {
  return supabase.from("profile_comments").update({ content, is_edited: true }).eq("id", id);
}

export async function deleteComment(supabase: SupabaseClient, id: string) {
  return supabase.from("profile_comments").delete().eq("id", id);
}

// ── Downloads ──

export async function recordDownload(supabase: SupabaseClient, profileId: string, userId?: string) {
  return supabase.from("profile_downloads").insert({ profile_id: profileId, user_id: userId ?? null });
}

// ── Favorites ──

export async function getUserFavorites(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("profile_favorites")
    .select("profile_id, ffb_profiles(*, author:profiles(*))")
    .eq("user_id", userId);
  return { data, error };
}

export async function toggleFavorite(supabase: SupabaseClient, profileId: string, userId: string) {
  const { data: existing } = await supabase
    .from("profile_favorites")
    .select("profile_id")
    .eq("profile_id", profileId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    return supabase.from("profile_favorites").delete().eq("profile_id", profileId).eq("user_id", userId);
  }
  return supabase.from("profile_favorites").insert({ profile_id: profileId, user_id: userId });
}

export async function isFavorited(supabase: SupabaseClient, profileId: string, userId: string) {
  const { data } = await supabase
    .from("profile_favorites")
    .select("profile_id")
    .eq("profile_id", profileId)
    .eq("user_id", userId)
    .single();
  return !!data;
}

// ── User Profiles ──

export async function getProfilesByUser(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("ffb_profiles")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });
  return { data: data as FFBProfile[] | null, error };
}

export async function updateUserTrustLevel(supabase: SupabaseClient, userId: string, trustLevel: string) {
  return supabase.from("profiles").update({ trust_level: trustLevel }).eq("id", userId);
}
