import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import {
  CATEGORIES,
  conceptFrontmatter,
  manufacturerFrontmatter,
  settingFrontmatter,
  type Category,
  type ConceptFrontmatter,
  type ManufacturerFrontmatter,
  type RecommendedRange,
  type SettingFrontmatter,
  type Status,
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

interface Content {
  manufacturers: Manufacturer[];
  concepts: Concept[];
  settings: Setting[];
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

  cache = { manufacturers, concepts, settings, byId };
  return cache;
}

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

export function formatRange(range: RecommendedRange): string | null {
  const { min, max, unit } = range;
  const suffix = unit ? ` ${unit}` : "";
  if (min !== undefined && max !== undefined) return `${min}–${max}${suffix}`;
  if (min !== undefined) return `from ${min}${suffix}`;
  if (max !== undefined) return `up to ${max}${suffix}`;
  return null;
}

export type { Category, Status };
