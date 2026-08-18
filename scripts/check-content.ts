/**
 * Content integrity gate. Loads every markdown file through the same loader the
 * site uses, so schema errors and dangling references fail here instead of
 * surfacing as a silently empty page. Runs as part of `npm run build`.
 *
 *   npm run check:content
 */
import {
  getConcepts,
  getManufacturers,
  getMatrix,
  getSettings,
  getUsedCategories,
} from "../src/lib/content/loader";

const manufacturers = getManufacturers();
const concepts = getConcepts();
const settings = getSettings();
const matrix = getMatrix();

const problems: string[] = [];

// A concept nobody implements is an empty matrix row.
for (const concept of concepts) {
  if (!settings.some((s) => s.concept === concept.slug)) {
    problems.push(
      `concept "${concept.slug}" has no settings — its matrix row would be empty`
    );
  }
}

// A manufacturer with no settings is an empty matrix column.
for (const manufacturer of manufacturers) {
  if (!settings.some((s) => s.manufacturer === manufacturer.slug)) {
    problems.push(`manufacturer "${manufacturer.slug}" has no settings`);
  }
}

// Two settings from one manufacturer on the same concept is usually a mistake.
for (const concept of concepts) {
  for (const manufacturer of manufacturers) {
    const hits = settings.filter(
      (s) => s.concept === concept.slug && s.manufacturer === manufacturer.slug
    );
    if (hits.length > 1) {
      problems.push(
        `${manufacturer.slug} has ${hits.length} settings on concept "${concept.slug}": ` +
          hits.map((s) => s.id).join(", ")
      );
    }
  }
}

const drafts = settings.filter((s) => s.status === "draft");
const singletons = concepts.filter(
  (c) => settings.filter((s) => s.concept === c.slug).length === 1
);

console.log(
  `${manufacturers.length} manufacturers, ${concepts.length} concepts across ` +
    `${getUsedCategories().length} categories, ${settings.length} settings ` +
    `(${settings.length - drafts.length} verified, ${drafts.length} draft)`
);
console.log(
  `matrix: ${matrix.reduce((n, s) => n + s.rows.length, 0)} rows × ${manufacturers.length} columns`
);

if (singletons.length) {
  console.log(
    `note: ${singletons.length} concept(s) documented for a single manufacturer, ` +
      `so they have no cross-reference yet: ${singletons.map((c) => c.slug).join(", ")}`
  );
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log("content OK");
