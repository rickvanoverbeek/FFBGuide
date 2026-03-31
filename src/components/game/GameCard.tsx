import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../../sanity/lib/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug.current}`} className="group">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          {game.logo && (
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={urlFor(game.logo).width(400).height(300).url()}
                alt={game.name}
                fill
                className="object-contain p-4 transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <CardTitle className="group-hover:text-primary transition-colors">
            {game.name}
          </CardTitle>
          {game.platforms && game.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {game.platforms.map((platform) => (
                <Badge key={platform} variant="outline">
                  {platform}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        {game.description && (
          <CardContent>
            <CardDescription className="line-clamp-2">
              {typeof game.description === "string"
                ? game.description
                : "View game details and FFB settings"}
            </CardDescription>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
