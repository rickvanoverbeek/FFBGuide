import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, sanityFetch } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import { articleBySlugQuery } from "../../../../sanity/lib/queries";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PortableTextRenderer } from "@/components/content/PortableTextRenderer";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

interface PageProps {
  params: Promise<{ articleSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { articleSlug } = await params;
  const article = await sanityFetch<Article | null>(articleBySlugQuery, {
    slug: articleSlug,
  });

  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Learn | FFB Hub`,
    description: article.excerpt ?? `Read about ${article.title} on FFB Hub.`,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { articleSlug } = await params;
  const article = await sanityFetch<Article | null>(articleBySlugQuery, {
    slug: articleSlug,
  });

  if (!article) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Learn", href: "/learn" },
          { label: article.title },
        ]}
      />

      <article className="mt-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            {article.category && (
              <Badge variant="secondary">{article.category}</Badge>
            )}
            {article.publishedAt && (
              <span className="text-sm text-muted-foreground">
                {formatDate(article.publishedAt)}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Cover image */}
        {article.coverImage && (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={urlFor(article.coverImage).width(1200).height(675).url()}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Body */}
        {article.body && <PortableTextRenderer content={article.body} />}

        {/* Related links */}
        {((article.relatedVendors && article.relatedVendors.length > 0) ||
          (article.relatedGames && article.relatedGames.length > 0)) && (
          <footer className="mt-12 border-t border-border pt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Related
            </h2>
            <div className="flex flex-wrap gap-2">
              {article.relatedVendors?.map((vendor) => (
                <Link
                  key={vendor._id}
                  href={`/vendors/${vendor.slug.current}`}
                  className="inline-flex"
                >
                  <Badge variant="outline">{vendor.name}</Badge>
                </Link>
              ))}
              {article.relatedGames?.map((game) => (
                <Link
                  key={game._id}
                  href={`/games/${game.slug.current}`}
                  className="inline-flex"
                >
                  <Badge variant="outline">{game.name}</Badge>
                </Link>
              ))}
            </div>
          </footer>
        )}
      </article>
    </main>
  );
}
