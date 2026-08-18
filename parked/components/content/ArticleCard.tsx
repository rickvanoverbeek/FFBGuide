import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../../sanity/lib/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/learn/${article.slug.current}`} className="group">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        {article.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={urlFor(article.coverImage).width(600).height(340).url()}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            {article.category && (
              <Badge variant="secondary">{article.category}</Badge>
            )}
            {article.publishedAt && (
              <span className="text-xs text-muted-foreground">
                {formatDate(article.publishedAt)}
              </span>
            )}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>
        {article.excerpt && (
          <CardContent>
            <CardDescription className="line-clamp-3">
              {article.excerpt}
            </CardDescription>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
