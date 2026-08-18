import type { PortableTextBlock } from "@portabletext/types";

// ── Sanity Document Types ──

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

// ── Vendor & Wheelbase ──

export interface Vendor extends SanityDocument {
  _type: "vendor";
  name: string;
  slug: SanitySlug;
  logo?: SanityImage;
  description?: string;
  website?: string;
  softwareName?: string;
  softwareDescription?: PortableTextBlock[];
  commonSettings?: FFBSetting[];
  tips?: PortableTextBlock[];
  sortOrder?: number;
}

export interface WheelbaseSpecs {
  peakTorque?: string;
  continuousTorque?: string;
  rotationRange?: string;
  connectivity?: string;
  platformSupport?: string[];
}

export interface SettingDefault {
  setting: FFBSetting;
  recommendedValue: string;
  notes?: string;
}

export interface Wheelbase extends SanityDocument {
  _type: "wheelbase";
  name: string;
  slug: SanitySlug;
  vendor: Vendor;
  image?: SanityImage;
  description?: PortableTextBlock[];
  driveType?: string;
  specs?: WheelbaseSpecs;
  settingDefaults?: SettingDefault[];
}

// ── FFB Settings ──

export interface FFBSetting extends SanityDocument {
  _type: "ffbSetting";
  name: string;
  slug: SanitySlug;
  category?: "vendor-software" | "in-game" | "universal";
  description?: PortableTextBlock[];
  shortDescription?: string;
  valueType?: "percentage" | "numeric" | "toggle" | "enum";
  minValue?: number;
  maxValue?: number;
  unit?: string;
  aliases?: string[];
  relatedSettings?: FFBSetting[];
}

// ── Games ──

export interface GameSetting {
  setting: FFBSetting;
  gameSpecificName?: string;
  explanation?: PortableTextBlock[];
  defaultValue?: string;
}

export interface Game extends SanityDocument {
  _type: "game";
  name: string;
  slug: SanitySlug;
  logo?: SanityImage;
  coverImage?: SanityImage;
  description?: PortableTextBlock[];
  platforms?: string[];
  ffbImplementation?: PortableTextBlock[];
  inGameSettings?: GameSetting[];
  tips?: PortableTextBlock[];
  sortOrder?: number;
}

// ── Game + Wheelbase Presets ──

export interface PresetSetting {
  setting: FFBSetting;
  value: string;
  notes?: string;
}

export interface GameWheelbasePreset extends SanityDocument {
  _type: "gameWheelbasePreset";
  game: Game;
  wheelbase: Wheelbase;
  vendorSoftwareSettings?: PresetSetting[];
  inGameSettings?: PresetSetting[];
  overallNotes?: PortableTextBlock[];
  difficultyLevel?: string;
  lastVerified?: string;
}

// ── Articles ──

export interface Article extends SanityDocument {
  _type: "article";
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  coverImage?: SanityImage;
  category?: "Fundamentals" | "Advanced" | "Troubleshooting" | "How-To";
  body?: PortableTextBlock[];
  relatedVendors?: Vendor[];
  relatedGames?: Game[];
  sortOrder?: number;
  publishedAt?: string;
}

// ── Glossary ──

export interface GlossaryTerm extends SanityDocument {
  _type: "glossaryTerm";
  term: string;
  slug: SanitySlug;
  definition?: PortableTextBlock[];
  shortDefinition?: string;
  relatedTerms?: GlossaryTerm[];
  relatedSettings?: FFBSetting[];
}

// ── Supabase / User-Generated Content ──

export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  trust_level: "new" | "trusted" | "admin";
  created_at: string;
  updated_at: string;
}

export interface FFBProfile {
  id: string;
  author_id: string;
  author?: UserProfile;
  title: string;
  description: string | null;
  game_slug: string;
  wheelbase_slug: string;
  vendor_slug: string;
  status: "pending" | "approved" | "rejected";
  vendor_settings: Record<string, string | number | boolean>;
  ingame_settings: Record<string, string | number | boolean>;
  config_file_url: string | null;
  config_file_name: string | null;
  difficulty: string | null;
  driving_style: string | null;
  notes: string | null;
  download_count: number;
  avg_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileRating {
  id: string;
  profile_id: string;
  user_id: string;
  rating: number;
  created_at: string;
}

export interface ProfileComment {
  id: string;
  profile_id: string;
  user_id: string;
  user?: UserProfile;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}
