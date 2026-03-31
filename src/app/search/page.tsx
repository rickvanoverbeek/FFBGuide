"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { client } from "../../../sanity/lib/client";
import { searchQuery } from "../../../sanity/lib/queries";
import { SearchBar } from "@/components/ui/SearchBar";
import { Badge } from "@/components/ui/Badge";
import { SearchIcon } from "lucide-react";

interface SearchResult {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  description?: string;
}

const TYPE_LABELS: Record<string, string> = {
  vendor: "Vendor",
  wheelbase: "Wheelbase",
  game: "Game",
  article: "Article",
  glossaryTerm: "Glossary",
  ffbSetting: "Setting",
};

function getResultHref(result: SearchResult): string {
  switch (result._type) {
    case "vendor":
      return `/vendors/${result.slug}`;
    case "game":
      return `/games/${result.slug}`;
    case "article":
      return `/learn/${result.slug}`;
    case "glossaryTerm":
      return `/tools/glossary`;
    case "ffbSetting":
      return `/tools/glossary`;
    default:
      return "#";
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      const data = await client.fetch<SearchResult[]>(searchQuery, {
        query: `${term}*`,
      } as Record<string, string>);
      setResults(data);
      setSearched(true);
      setLoading(false);
    },
    []
  );

  // Search on load if ?q= present
  useEffect(() => {
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, [q, doSearch]);

  function handleChange(value: string) {
    setQuery(value);
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
          Search
        </h1>
        <SearchBar
          value={query}
          onChange={handleChange}
          placeholder="Search vendors, games, articles, settings..."
        />
      </section>

      {/* Results */}
      {loading && (
        <p className="text-center text-muted-foreground">Searching...</p>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <SearchIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            No results found
          </p>
          <p className="text-sm text-muted-foreground">
            Try different keywords or check your spelling.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => (
            <Link
              key={result._id}
              href={getResultHref(result)}
              className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
            >
              <Badge variant="outline" className="mt-0.5 shrink-0">
                {TYPE_LABELS[result._type] ?? result._type}
              </Badge>
              <div className="min-w-0">
                <h2 className="font-medium text-foreground">{result.title}</h2>
                {result.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {result.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
