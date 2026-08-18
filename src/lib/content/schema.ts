import { z } from "zod";

/**
 * Physical/functional category of a setting. Fixed enum — the columns of the
 * mental model. A setting's category always matches its concept's category.
 */
export const CATEGORIES = [
  "damping",
  "friction",
  "inertia",
  "spring_centering",
  "filter_smoothing",
  "force_limit",
  "slew_rate",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  damping: "Damping",
  friction: "Friction",
  inertia: "Inertia",
  spring_centering: "Spring / Centering",
  filter_smoothing: "Filtering & Smoothing",
  force_limit: "Force Limits",
  slew_rate: "Slew Rate",
  other: "Other",
};

/**
 * Editorial state. `draft` means the wording has not been checked against the
 * manufacturer's own documentation yet; only `verified` entries carry sources.
 */
export const STATUSES = ["draft", "verified"] as const;
export type Status = (typeof STATUSES)[number];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = z
  .string()
  .regex(slugPattern, "must be lowercase kebab-case");

/** `manufacturer/setting` — the id used in related_settings. */
const settingRef = z
  .string()
  .regex(
    /^[a-z0-9-]+\/[a-z0-9-]+$/,
    "must be a `manufacturer/setting` reference"
  );

export const manufacturerFrontmatter = z.object({
  name: z.string().min(1),
  /** Exact name of the tuning tool, e.g. "Simucube Tuner". */
  software: z.string().min(1),
  summary: z.string().min(1),
  website: z.url().optional(),
  /** Lower sorts first; ties fall back to alphabetical. */
  order: z.number().int().optional(),
});

export const conceptFrontmatter = z.object({
  /** Neutral, manufacturer-independent name for the concept. */
  label: z.string().min(1),
  category: z.enum(CATEGORIES),
  summary: z.string().min(1),
  /**
   * Row order within its category, lower first. Keeps the primary concept at
   * the top instead of wherever the alphabet puts it. Defaults to 50.
   */
  order: z.number().int().optional(),
});

export const range = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.string().optional(),
  /** Free-text nuance; always rendered alongside the standing disclaimer. */
  note: z.string().optional(),
});

export const recommendedRange = range;

export const settingFrontmatter = z.object({
  manufacturer: slug,
  /** Exact name of the tuning tool this setting lives in. */
  software: z.string().min(1),
  /** Exact label as it appears in that software, verbatim. */
  setting_name: z.string().min(1),
  /** Links this setting to its cross-manufacturer equivalents. */
  concept: slug,
  category: z.enum(CATEGORIES),
  summary: z.string().min(1),
  /** What you feel when turning it up or down. */
  impact: z.string().min(1),
  /** The control's own range as documented by the manufacturer — factual. */
  value_range: range.optional(),
  /** A starting point, always rendered with a disclaimer. Editorial, not factual. */
  recommended_range: recommendedRange.optional(),
  value_type: z.enum(["percentage", "numeric", "toggle", "enum"]).optional(),
  related_settings: z.array(settingRef).default([]),
  /** URLs to official manuals/docs. Never quoted, only linked. */
  sources: z.array(z.url()).default([]),
  /**
   * Provenance that has no URL — typically the software's own UI or in-app help
   * text, which is a primary source even though it cannot be linked.
   */
  source_note: z.string().optional(),
  status: z.enum(STATUSES).default("draft"),
  /** YAML turns an unquoted date into a Date, so accept both and normalise. */
  last_reviewed: z
    .union([z.string(), z.date()])
    .optional()
    .transform((value) =>
      value instanceof Date ? value.toISOString().slice(0, 10) : value
    ),
});

export type ManufacturerFrontmatter = z.infer<typeof manufacturerFrontmatter>;
export type ConceptFrontmatter = z.infer<typeof conceptFrontmatter>;
export type SettingFrontmatter = z.infer<typeof settingFrontmatter>;
export type Range = z.infer<typeof range>;
export type RecommendedRange = Range;
