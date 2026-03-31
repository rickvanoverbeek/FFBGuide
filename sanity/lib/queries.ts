import { groq } from "next-sanity";

// ── Vendors ──

export const allVendorsQuery = groq`
  *[_type == "vendor"] | order(sortOrder asc, name asc) {
    _id, name, slug, logo, description, softwareName
  }
`;

export const vendorBySlugQuery = groq`
  *[_type == "vendor" && slug.current == $slug][0] {
    ...,
    commonSettings[]->{ _id, name, slug, shortDescription, unit, valueType, minValue, maxValue }
  }
`;

export const wheelbasesByVendorQuery = groq`
  *[_type == "wheelbase" && vendor->slug.current == $vendorSlug] | order(name asc) {
    _id, name, slug, image, driveType, specs,
    vendor->{ name, slug }
  }
`;

// ── Wheelbases ──

export const wheelbaseBySlugQuery = groq`
  *[_type == "wheelbase" && slug.current == $slug && vendor->slug.current == $vendorSlug][0] {
    ...,
    vendor->{ _id, name, slug, softwareName },
    settingDefaults[]{
      setting->{ _id, name, slug, shortDescription, unit, valueType },
      recommendedValue, notes
    }
  }
`;

export const allWheelbasesQuery = groq`
  *[_type == "wheelbase"] | order(vendor->name asc, name asc) {
    _id, name, slug, image, driveType, specs,
    vendor->{ _id, name, slug }
  }
`;

// ── Games ──

export const allGamesQuery = groq`
  *[_type == "game"] | order(sortOrder asc, name asc) {
    _id, name, slug, logo, description, platforms
  }
`;

export const gameBySlugQuery = groq`
  *[_type == "game" && slug.current == $slug][0] {
    ...,
    inGameSettings[]{
      setting->{ _id, name, slug, shortDescription, unit, valueType },
      gameSpecificName, explanation, defaultValue
    }
  }
`;

// ── Game + Wheelbase Presets ──

export const presetQuery = groq`
  *[_type == "gameWheelbasePreset"
    && game->slug.current == $gameSlug
    && wheelbase->slug.current == $wheelbaseSlug][0] {
    ...,
    game->{ _id, name, slug },
    wheelbase->{ _id, name, slug, vendor->{ name, softwareName } },
    vendorSoftwareSettings[]{
      setting->{ _id, name, slug, shortDescription, unit },
      value, notes
    },
    inGameSettings[]{
      setting->{ _id, name, slug, shortDescription, unit },
      value, notes
    }
  }
`;

export const presetsByGameQuery = groq`
  *[_type == "gameWheelbasePreset" && game->slug.current == $gameSlug] {
    _id,
    wheelbase->{ _id, name, slug, vendor->{ name, slug } },
    difficultyLevel, lastVerified
  }
`;

export const presetsByWheelbaseQuery = groq`
  *[_type == "gameWheelbasePreset" && wheelbase->slug.current == $wheelbaseSlug] {
    _id,
    game->{ _id, name, slug, logo },
    difficultyLevel, lastVerified
  }
`;

// ── Articles ──

export const allArticlesQuery = groq`
  *[_type == "article"] | order(sortOrder asc, publishedAt desc) {
    _id, title, slug, excerpt, coverImage, category, publishedAt
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    ...,
    relatedVendors[]->{ _id, name, slug },
    relatedGames[]->{ _id, name, slug }
  }
`;

// ── Glossary ──

export const allGlossaryTermsQuery = groq`
  *[_type == "glossaryTerm"] | order(term asc) {
    _id, term, slug, shortDefinition,
    relatedTerms[]->{ _id, term, slug },
    relatedSettings[]->{ _id, name, slug }
  }
`;

export const glossaryTermBySlugQuery = groq`
  *[_type == "glossaryTerm" && slug.current == $slug][0] {
    ...,
    relatedTerms[]->{ _id, term, slug, shortDefinition },
    relatedSettings[]->{ _id, name, slug, shortDescription }
  }
`;

// ── FFB Settings ──

export const allFFBSettingsQuery = groq`
  *[_type == "ffbSetting"] | order(name asc) {
    _id, name, slug, category, shortDescription, valueType, unit, aliases
  }
`;

// ── Search ──

export const searchQuery = groq`
  *[
    _type in ["vendor", "wheelbase", "game", "article", "glossaryTerm", "ffbSetting"]
    && (name match $query || title match $query || term match $query || description match $query)
  ][0..19] {
    _id, _type,
    "title": coalesce(name, title, term),
    "slug": slug.current,
    "description": coalesce(shortDescription, excerpt, shortDefinition, description)
  }
`;
