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

/**
 * Which way a control's value moves relative to its concept.
 *
 * `direct`   — more of the concept means a higher value (Simucube's
 *              Reconstruction Filter: higher = more smoothing).
 * `inverted` — more of the concept means a LOWER value (Fanatec's FEI is
 *              documented as 000 = smoothest, 100 = sharpest).
 * `unclear`  — the manufacturer's wording does not settle it. The site says so
 *              rather than guessing, because guessing here inverts advice.
 */
export const POLARITIES = ["direct", "inverted", "unclear"] as const;
export type Polarity = (typeof POLARITIES)[number];

/** What to do with a control. `direction` always refers to a `direct` control. */
export const DIRECTIONS = ["raise", "lower", "on", "off"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const DIRECTION_LABELS: Record<Direction, string> = {
  raise: "Raise it",
  lower: "Lower it",
  on: "Turn it on",
  off: "Turn it off",
};

/** Grouping for the troubleshooter's overview page. */
export const SYMPTOM_GROUPS = [
  "feel",
  "stability",
  "strength",
  "response",
  "comfort",
] as const;
export type SymptomGroup = (typeof SYMPTOM_GROUPS)[number];

export const SYMPTOM_GROUP_LABELS: Record<SymptomGroup, string> = {
  feel: "Detail and feel",
  stability: "Stability and safety",
  strength: "Force levels",
  response: "Response and delay",
  comfort: "Comfort and fatigue",
};

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
  /** Defaults to `direct`; see POLARITIES. Wrong here means inverted advice. */
  polarity: z.enum(POLARITIES).default("direct"),
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

/**
 * A symptom is a complaint in the driver's words, mapped to concepts rather than
 * to settings — so one file works for every manufacturer, and adding a
 * manufacturer never means editing existing symptoms.
 */
export const adviceStep = z.object({
  concept: slug,
  direction: z.enum(DIRECTIONS),
  /** Lower runs first. Unique within a symptom. */
  priority: z.number().int().positive(),
  /** Why this helps, in terms of the mechanism. Required — no bare arrows. */
  why: z.string().min(1),
});

export const symptomFrontmatter = z.object({
  /** The complaint as a driver would put it. */
  label: z.string().min(1),
  summary: z.string().min(1),
  group: z.enum(SYMPTOM_GROUPS),
  /**
   * Phrasings people actually type, including Dutch — the matcher is
   * language-agnostic, while the content itself stays English.
   */
  keywords: z.array(z.string().min(1)).default([]),
  advice: z.array(adviceStep).min(1),
  related_symptoms: z.array(slug).default([]),
  sources: z.array(z.url()).default([]),
  status: z.enum(STATUSES).default("draft"),
  last_reviewed: z
    .union([z.string(), z.date()])
    .optional()
    .transform((value) =>
      value instanceof Date ? value.toISOString().slice(0, 10) : value
    ),
});

export type ManufacturerFrontmatter = z.infer<typeof manufacturerFrontmatter>;
export type SymptomFrontmatter = z.infer<typeof symptomFrontmatter>;
export type AdviceStep = z.infer<typeof adviceStep>;
export type ConceptFrontmatter = z.infer<typeof conceptFrontmatter>;
export type SettingFrontmatter = z.infer<typeof settingFrontmatter>;
export type Range = z.infer<typeof range>;
export type RecommendedRange = Range;
