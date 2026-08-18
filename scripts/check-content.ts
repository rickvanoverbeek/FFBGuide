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
  getSymptoms,
  getUsedCategories,
  resolveAdvice,
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

// A symptom nobody can act on is worse than no symptom: it sends a driver to a
// page that lists nothing to change.
const symptoms = getSymptoms();
for (const symptom of symptoms) {
  const coverage = manufacturers.filter(
    (manufacturer) =>
      resolveAdvice(symptom, manufacturer.slug).filter(
        (step) => step.settings.length > 0
      ).length > 0
  );
  if (coverage.length === 0) {
    problems.push(
      `symptom "${symptom.slug}" resolves to no settings for any manufacturer`
    );
  } else if (coverage.length < manufacturers.length / 2) {
    problems.push(
      `symptom "${symptom.slug}" only resolves to settings for ${coverage.length} of ` +
        `${manufacturers.length} manufacturers (${coverage.map((m) => m.slug).join(", ")})`
    );
  }
}

// Advice reads as a direction, so a control whose direction is unknown must say
// so rather than silently inheriting the concept's.
const unclear = settings.filter((s) => s.polarity === "unclear");

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
console.log(
  `${symptoms.length} symptoms, ${symptoms.reduce((n, s) => n + s.advice.length, 0)} advice steps` +
    (unclear.length
      ? `; ${unclear.length} setting(s) with an undocumented direction: ${unclear.map((s) => s.id).join(", ")}`
      : "")
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
