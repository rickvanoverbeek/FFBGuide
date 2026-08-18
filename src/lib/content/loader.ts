import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import {
  CATEGORIES,
  conceptFrontmatter,
  manufacturerFrontmatter,
  settingFrontmatter,
  symptomFrontmatter,
  SYMPTOM_GROUPS,
  type Category,
  type ConceptFrontmatter,
  type Direction,
  type ManufacturerFrontmatter,
  type RecommendedRange,
  type SettingFrontmatter,
  type Status,
  type SymptomFrontmatter,
  type SymptomGroup,
} from "./schema";

/**
 * Build-time content layer. Everything lives in markdown under `content/` and
 * is read once per process; nothing here runs in the browser.
 *
 * Invalid or dangling content throws, which fails the build on purpose — that
 * is the integrity net that replaces a CMS's referential checks.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Manufacturer extends ManufacturerFrontmatter {
  slug: string;
  href: string;
  /** Rendered markdown body: notes about the software itself. */
  bodyHtml: string;
}

export interface Concept extends ConceptFrontmatter {
  slug: string;
  href: string;
  bodyHtml: string;
}

export interface Alias {
  manufacturer: string;
  manufacturerName: string;
  /** The exact term that manufacturer uses for the same concept. */
  term: string;
  href: string;
}

export interface Setting extends Omit<SettingFrontmatter, "related_settings"> {
  /** `manufacturer/slug` */
  id: string;
  slug: string;
  href: string;
  manufacturerName: string;
  /** The technical explanation, as rendered markdown. */
  explanationHtml: string;
  related_settings: string[];
}

export interface MatrixCell {
  manufacturer: Manufacturer;
  settings: Setting[];
}

export interface MatrixRow {
  concept: Concept;
  cells: MatrixCell[];
}

export interface MatrixSection {
  category: Category;
  rows: MatrixRow[];
}

export interface Symptom extends SymptomFrontmatter {
  slug: string;
  href: string;
  /** The mechanism behind the complaint, as rendered markdown. */
  bodyHtml: string;
}

/** One setting to change, with the direction already corrected for polarity. */
export interface ResolvedSetting {
  setting: Setting;
  /** The advice direction after applying the setting's polarity. */
  direction: Direction;
  /** True when the manufacturer's wording does not settle which way to move. */
  directionUnclear: boolean;
}

export interface ResolvedAdviceStep {
  concept: Concept;
  /** The direction as written on the symptom, before polarity is applied. */
  direction: Direction;
  priority: number;
  why: string;
  /** Empty when this manufacturer exposes no control for the concept. */
  settings: ResolvedSetting[];
}

interface Content {
  manufacturers: Manufacturer[];
  concepts: Concept[];
  settings: Setting[];
  symptoms: Symptom[];
  byId: Map<string, Setting>;
}

function readMarkdownFiles(dir: string): { slug: string; file: string; raw: string }[] {
  const abs = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => ({
      slug: entry.name.replace(/\.md$/, ""),
      file: path.join(dir, entry.name),
      raw: fs.readFileSync(path.join(abs, entry.name), "utf8"),
    }));
}

/** Settings are nested one level deep: `content/settings/<manufacturer>/<slug>.md`. */
function readSettingFiles(): { slug: string; dir: string; file: string; raw: string }[] {
  const abs = path.join(CONTENT_DIR, "settings");
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      readMarkdownFiles(path.join("settings", entry.name)).map((f) => ({
        ...f,
        dir: entry.name,
      }))
    );
}

function renderMarkdown(md: string): string {
  return marked.parse(md.trim(), { async: false }) as string;
}

function fail(file: string, message: string): never {
  throw new Error(`Content error in ${file.replace(/\\/g, "/")}: ${message}`);
}

function parse<T>(
  schema: { safeParse: (input: unknown) => { success: boolean; data?: T; error?: unknown } },
  data: unknown,
  file: string
): T {
  const result = schema.safeParse(data);
  if (!result.success || !result.data) {
    const issues = (result.error as { issues?: { path: (string | number)[]; message: string }[] })
      ?.issues;
    const detail =
      issues?.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ") ??
      "invalid frontmatter";
    fail(file, detail);
  }
  return result.data;
}

let cache: Content | null = null;

function load(): Content {
  if (cache) return cache;

  const manufacturers: Manufacturer[] = readMarkdownFiles("manufacturers")
    .map(({ slug, file, raw }) => {
      const { data, content } = matter(raw);
      const fm = parse(manufacturerFrontmatter, data, file);
      return {
        ...fm,
        slug,
        href: `/manufacturers/${slug}`,
        bodyHtml: renderMarkdown(content),
      };
    })
    .sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
        a.name.localeCompare(b.name)
    );

  const concepts: Concept[] = readMarkdownFiles("concepts")
    .map(({ slug, file, raw }) => {
      const { data, content } = matter(raw);
      const fm = parse(conceptFrontmatter, data, file);
      return {
        ...fm,
        slug,
        href: `/categories/${fm.category}#${slug}`,
        bodyHtml: renderMarkdown(content),
      };
    })
    .sort(
      (a, b) => (a.order ?? 50) - (b.order ?? 50) || a.label.localeCompare(b.label)
    );

  const manufacturerBySlug = new Map(manufacturers.map((m) => [m.slug, m]));
  const conceptBySlug = new Map(concepts.map((c) => [c.slug, c]));

  const settings: Setting[] = readSettingFiles().map(({ slug, dir, file, raw }) => {
    const { data, content } = matter(raw);
    const fm = parse(settingFrontmatter, data, file);

    if (fm.manufacturer !== dir) {
      fail(
        file,
        `manufacturer "${fm.manufacturer}" does not match its folder "${dir}"`
      );
    }
    const manufacturer = manufacturerBySlug.get(fm.manufacturer);
    if (!manufacturer) {
      fail(file, `unknown manufacturer "${fm.manufacturer}"`);
    }
    const concept = conceptBySlug.get(fm.concept);
    if (!concept) {
      fail(file, `unknown concept "${fm.concept}"`);
    }
    if (concept.category !== fm.category) {
      fail(
        file,
        `category "${fm.category}" contradicts concept "${fm.concept}" (${concept.category})`
      );
    }
    if (fm.software !== manufacturer.software) {
      fail(
        file,
        `software "${fm.software}" differs from the manufacturer's software "${manufacturer.software}"`
      );
    }
    if (fm.status === "verified" && fm.sources.length === 0 && !fm.source_note) {
      fail(
        file,
        "status is verified but no sources or source_note are given"
      );
    }
    if (!content.trim()) {
      fail(file, "body is empty — the technical explanation is required");
    }

    return {
      ...fm,
      id: `${fm.manufacturer}/${slug}`,
      slug,
      href: `/manufacturers/${fm.manufacturer}/${slug}`,
      manufacturerName: manufacturer.name,
      explanationHtml: renderMarkdown(content),
    };
  });

  const byId = new Map<string, Setting>();
  for (const setting of settings) {
    if (byId.has(setting.id)) {
      throw new Error(`Duplicate setting id: ${setting.id}`);
    }
    byId.set(setting.id, setting);
  }

  // Dangling related_settings would silently degrade the cross-links.
  for (const setting of settings) {
    for (const ref of setting.related_settings) {
      if (!byId.has(ref)) {
        throw new Error(
          `Content error in ${setting.id}: related_settings points at "${ref}", which does not exist`
        );
      }
      if (ref === setting.id) {
        throw new Error(`Content error in ${setting.id}: related_settings points at itself`);
      }
    }
  }

  settings.sort(
    (a, b) =>
      a.manufacturerName.localeCompare(b.manufacturerName) ||
      a.setting_name.localeCompare(b.setting_name)
  );

  const symptoms: Symptom[] = readMarkdownFiles("symptoms").map(
    ({ slug: symptomSlug, file, raw }) => {
      const { data, content } = matter(raw);
      const fm = parse(symptomFrontmatter, data, file);

      const priorities = new Set<number>();
      for (const step of fm.advice) {
        if (!conceptBySlug.has(step.concept)) {
          fail(file, `advice refers to unknown concept "${step.concept}"`);
        }
        if (priorities.has(step.priority)) {
          fail(file, `duplicate advice priority ${step.priority}`);
        }
        priorities.add(step.priority);
      }
      if (!content.trim()) {
        fail(file, "body is empty — explain the mechanism behind the complaint");
      }

      return {
        ...fm,
        advice: [...fm.advice].sort((a, b) => a.priority - b.priority),
        slug: symptomSlug,
        href: `/troubleshoot/${symptomSlug}`,
        bodyHtml: renderMarkdown(content),
      };
    }
  );

  const symptomSlugs = new Set(symptoms.map((s) => s.slug));
  for (const symptom of symptoms) {
    for (const ref of symptom.related_symptoms) {
      if (!symptomSlugs.has(ref)) {
        throw new Error(
          `Content error in symptoms/${symptom.slug}.md: related_symptoms points at "${ref}", which does not exist`
        );
      }
      if (ref === symptom.slug) {
        throw new Error(
          `Content error in symptoms/${symptom.slug}.md: related_symptoms points at itself`
        );
      }
    }
  }

  symptoms.sort((a, b) => a.label.localeCompare(b.label));

  cache = { manufacturers, concepts, settings, symptoms, byId };
  return cache;
}

const OPPOSITE: Record<Direction, Direction> = {
  raise: "lower",
  lower: "raise",
  on: "off",
  off: "on",
};

export function getManufacturers(): Manufacturer[] {
  return load().manufacturers;
}

export function getManufacturer(slug: string): Manufacturer | undefined {
  return load().manufacturers.find((m) => m.slug === slug);
}

export function getConcepts(): Concept[] {
  return load().concepts;
}

export function getConcept(slug: string): Concept | undefined {
  return load().concepts.find((c) => c.slug === slug);
}

export function getSettings(): Setting[] {
  return load().settings;
}

export function getSetting(manufacturer: string, slug: string): Setting | undefined {
  return load().byId.get(`${manufacturer}/${slug}`);
}

export function getSettingById(id: string): Setting | undefined {
  return load().byId.get(id);
}

export function getSettingsByManufacturer(manufacturer: string): Setting[] {
  return load().settings.filter((s) => s.manufacturer === manufacturer);
}

export function getSettingsByCategory(category: Category): Setting[] {
  return load().settings.filter((s) => s.category === category);
}

export function getConceptsByCategory(category: Category): Concept[] {
  return load().concepts.filter((c) => c.category === category);
}

/**
 * The cross-manufacturer equivalents of a setting, derived from its concept.
 * This is why `aliases` is not hand-maintained: adding one setting wires up
 * every other manufacturer's page automatically.
 */
export function getAliases(setting: Setting): Alias[] {
  const { settings } = load();
  return settings
    .filter((s) => s.concept === setting.concept && s.manufacturer !== setting.manufacturer)
    .map((s) => ({
      manufacturer: s.manufacturer,
      manufacturerName: s.manufacturerName,
      term: s.setting_name,
      href: s.href,
    }));
}

/** Categories that actually have concepts, in the canonical enum order. */
export function getUsedCategories(): Category[] {
  const used = new Set(load().concepts.map((c) => c.category));
  return CATEGORIES.filter((c) => used.has(c));
}

/**
 * The Rosetta stone: concept rows × manufacturer columns, grouped by category.
 * Empty cells are meaningful — they show a manufacturer exposes no equivalent.
 */
export function getMatrix(): MatrixSection[] {
  const { manufacturers, concepts, settings } = load();

  return getUsedCategories().map((category) => ({
    category,
    rows: concepts
      .filter((concept) => concept.category === category)
      .map((concept) => ({
        concept,
        cells: manufacturers.map((manufacturer) => ({
          manufacturer,
          settings: settings.filter(
            (s) => s.concept === concept.slug && s.manufacturer === manufacturer.slug
          ),
        })),
      })),
  }));
}

export function getSymptoms(): Symptom[] {
  return load().symptoms;
}

export function getSymptom(slug: string): Symptom | undefined {
  return load().symptoms.find((symptom) => symptom.slug === slug);
}

/** Groups that actually have symptoms, in the canonical enum order. */
export function getUsedSymptomGroups(): SymptomGroup[] {
  const used = new Set(load().symptoms.map((symptom) => symptom.group));
  return SYMPTOM_GROUPS.filter((group) => used.has(group));
}

export function getSymptomsByGroup(group: SymptomGroup): Symptom[] {
  return load().symptoms.filter((symptom) => symptom.group === group);
}

/**
 * Turns concept-level advice into the actual controls in one manufacturer's
 * software, flipping the direction for inverted controls. A step with no
 * settings is kept on purpose: "your software has no equivalent" is an answer,
 * and dropping it silently would hide a gap.
 */
export function resolveAdvice(
  symptom: Symptom,
  manufacturer: string
): ResolvedAdviceStep[] {
  const { settings, concepts } = load();

  return symptom.advice.map((step) => {
    const concept = concepts.find((c) => c.slug === step.concept);
    if (!concept) {
      // The loader already rejected unknown concepts.
      throw new Error(`Unknown concept "${step.concept}" in ${symptom.slug}`);
    }

    const matches = settings.filter(
      (setting) =>
        setting.concept === step.concept && setting.manufacturer === manufacturer
    );

    return {
      concept,
      direction: step.direction,
      priority: step.priority,
      why: step.why,
      settings: matches.map((setting) => ({
        setting,
        direction:
          setting.polarity === "inverted"
            ? OPPOSITE[step.direction]
            : step.direction,
        directionUnclear: setting.polarity === "unclear",
      })),
    };
  });
}

/** Symptoms whose advice touches a given concept — shown on setting pages. */
export function getSymptomsForConcept(concept: string): Symptom[] {
  return load().symptoms.filter((symptom) =>
    symptom.advice.some((step) => step.concept === concept)
  );
}

export function formatRange(range: RecommendedRange): string | null {
  const { min, max, unit } = range;
  const suffix = unit ? ` ${unit}` : "";
  if (min !== undefined && max !== undefined) return `${min}–${max}${suffix}`;
  if (min !== undefined) return `from ${min}${suffix}`;
  if (max !== undefined) return `up to ${max}${suffix}`;
  return null;
}

export type { Category, Direction, Status, SymptomGroup };
