"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { cn } from "@/lib/utils";

export interface SearchableSymptom {
  slug: string;
  label: string;
  summary: string;
  href: string;
  groupLabel: string;
  /** Phrasings people type, including Dutch. */
  keywords: string[];
}

interface SymptomSearchProps {
  symptoms: SearchableSymptom[];
}

/** Words too common to carry meaning in a complaint. */
const STOPWORDS = new Set([
  "the", "a", "an", "is", "it", "my", "i", "have", "has", "in", "of", "on", "to",
  "and", "too", "very", "feels", "feel", "wheel", "car",
  "de", "het", "een", "is", "ik", "heb", "in", "van", "op", "en", "te", "erg",
  "voelt", "voel", "stuur", "auto", "mijn", "niet", "veel", "weinig",
]);

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

/**
 * Deliberately small: a few dozen symptoms do not need a search library. Scores
 * token overlap against label, summary and keywords, with keywords weighted
 * highest because they are the phrasings people actually type.
 */
function score(symptom: SearchableSymptom, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const label = symptom.label.toLowerCase();
  const summary = symptom.summary.toLowerCase();
  const keywords = symptom.keywords.map((keyword) => keyword.toLowerCase());

  let total = 0;
  for (const token of tokens) {
    if (keywords.some((keyword) => keyword === token)) total += 4;
    else if (keywords.some((keyword) => keyword.includes(token))) total += 3;
    else if (label.includes(token)) total += 3;
    else if (summary.includes(token)) total += 1;
  }
  return total;
}

export function SymptomSearch({ symptoms }: SymptomSearchProps) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];
    return symptoms
      .map((symptom) => ({ symptom, score: score(symptom, tokens) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.symptom.label.localeCompare(b.symptom.label))
      .slice(0, 5);
  }, [query, symptoms]);

  const typed = query.trim().length > 0;

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Describe it — “weinig gevoel in de voorkant”, “wheel shakes on straights”…"
      />

      {typed && (
        <div className="mt-4">
          {matches.length === 0 ? (
            <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Nothing matches that yet. Try naming what you feel rather than what
              you think is wrong — “light”, “heavy”, “shakes”, “notchy”, “late” —
              or pick from the list below.
            </p>
          ) : (
            <ul className="space-y-2">
              {matches.map(({ symptom }, index) => (
                <li key={symptom.slug}>
                  <Link
                    href={symptom.href}
                    className={cn(
                      "flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors",
                      index === 0
                        ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {symptom.label}
                        </span>
                        {index === 0 && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-link">
                            closest match
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {symptom.summary}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
