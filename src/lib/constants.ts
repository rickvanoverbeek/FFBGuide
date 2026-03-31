export const SITE_NAME = "FFB Hub";
export const SITE_DESCRIPTION =
  "The ultimate resource for sim racing force feedback settings. Learn, configure, and share FFB profiles across every wheelbase and game.";

export const NAV_ITEMS = [
  { label: "Vendors", href: "/vendors" },
  { label: "Games", href: "/games" },
  { label: "Profiles", href: "/profiles" },
  { label: "Learn", href: "/learn" },
  {
    label: "Tools",
    href: "/tools",
    children: [
      { label: "FFB Configurator", href: "/tools/configurator" },
      { label: "Hardware Compare", href: "/tools/compare" },
      { label: "Glossary", href: "/tools/glossary" },
    ],
  },
] as const;

export const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const DRIVING_STYLES = ["Smooth", "Aggressive", "Drift", "All-around"] as const;
export type DrivingStyle = (typeof DRIVING_STYLES)[number];

export const DRIVE_TYPES = ["Direct Drive", "Belt Drive", "Gear Drive"] as const;
export type DriveType = (typeof DRIVE_TYPES)[number];

export const PLATFORMS = ["PC", "PlayStation", "Xbox"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PROFILE_SORT_OPTIONS = [
  { label: "Top Rated", value: "top-rated" },
  { label: "Most Downloaded", value: "most-downloaded" },
  { label: "Newest", value: "newest" },
  { label: "Recently Updated", value: "recently-updated" },
] as const;

export const ALLOWED_FILE_TYPES = [".json", ".xml", ".ini", ".cfg", ".txt"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
