import type { Metadata } from "next";
import { client, sanityFetch } from "../../../sanity/lib/client";
import { allArticlesQuery } from "../../../sanity/lib/queries";
import { ArticleCard } from "@/components/content/ArticleCard";
import type { Article } from "@/types";

export const metadata: Metadata = {
  title: "Learn About Force Feedback | FFB Hub",
  description:
    "Understand the science and settings behind force feedback. Guides on FFB fundamentals, advanced tuning, troubleshooting, and more.",
};

export default async function LearnPage() {
  const articles = await sanityFetch<Article[]>(allArticlesQuery);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Learn About Force Feedback
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          From the basics of how FFB works to advanced tuning techniques.
          Everything you need to get the most out of your sim racing setup.
        </p>
      </section>

      {/* Articles grid */}
      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No articles found. Check back soon for new content.
        </p>
      )}
    </main>
  );
}
