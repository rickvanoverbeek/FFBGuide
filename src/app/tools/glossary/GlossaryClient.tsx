"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { GlossaryTerm } from "@/types";

interface GlossaryClientProps {
  terms: GlossaryTerm[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function GlossaryClient({ terms }: GlossaryClientProps) {
  const [search, setSearch] = useState("");
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const filteredTerms = useMemo(() => {
    if (!search.trim()) return terms;
    const q = search.toLowerCase();
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.shortDefinition?.toLowerCase().includes(q)
    );
  }, [terms, search]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    for (const term of filteredTerms) {
      const letter = term.term[0]?.toUpperCase() ?? "#";
      if (!map[letter]) map[letter] = [];
      map[letter].push(term);
    }
    return map;
  }, [filteredTerms]);

  const activeLetters = new Set(Object.keys(grouped));

  function toggleTerm(id: string) {
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function scrollToLetter(letter: string) {
    const el = document.getElementById(`glossary-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          FFB Glossary
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Look up force feedback terminology. Tap any term to see its full
          definition.
        </p>
      </section>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search glossary terms..."
        />
      </div>

      {/* Alphabet bar */}
      <div className="mb-8 flex flex-wrap gap-1">
        {ALPHABET.map((letter) => {
          const isActive = activeLetters.has(letter);
          return (
            <button
              key={letter}
              onClick={() => isActive && scrollToLetter(letter)}
              disabled={!isActive}
              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground/40 cursor-default"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Terms */}
      {filteredTerms.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No terms found matching &quot;{search}&quot;.
        </p>
      ) : (
        <div className="space-y-8">
          {ALPHABET.filter((l) => grouped[l]).map((letter) => (
            <section key={letter} id={`glossary-${letter}`}>
              <h2 className="mb-3 border-b border-border pb-2 text-xl font-bold text-foreground">
                {letter}
              </h2>
              <div className="space-y-1">
                {grouped[letter].map((term) => {
                  const isExpanded = expandedTerms.has(term._id);
                  return (
                    <div
                      key={term._id}
                      className="rounded-lg border border-transparent hover:border-border"
                    >
                      <button
                        onClick={() => toggleTerm(term._id)}
                        className="flex w-full items-start gap-2 px-3 py-2.5 text-left"
                      >
                        {isExpanded ? (
                          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <span className="font-medium text-foreground">
                            {term.term}
                          </span>
                          {!isExpanded && term.shortDefinition && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              &mdash; {term.shortDefinition}
                            </span>
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 pl-9">
                          <p className="text-sm leading-6 text-muted-foreground">
                            {term.shortDefinition}
                          </p>
                          {term.relatedTerms && term.relatedTerms.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="text-xs text-muted-foreground">
                                Related:
                              </span>
                              {term.relatedTerms.map((rt) => (
                                <span
                                  key={rt._id}
                                  className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground"
                                >
                                  {rt.term}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
