"use client";

import Link from "next/link";
import { Star, Download } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { FFBProfile } from "@/types";

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ProfileCardProps {
  profile: FFBProfile & { author: FFBProfile["author"] };
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const filledStars = Math.round(profile.avg_rating);

  return (
    <Link href={`/profiles/${profile.id}`} className="group">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardHeader className="pb-3">
          <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {profile.title}
          </h3>

          {/* Author */}
          <div className="flex items-center gap-2 mt-1">
            {profile.author?.avatar_url ? (
              <img
                src={profile.author.avatar_url}
                alt=""
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                {(profile.author?.display_name ?? profile.author?.username ?? "?")[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-xs text-muted-foreground truncate">
              {profile.author?.display_name ?? profile.author?.username ?? "Unknown"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Game + Wheelbase */}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            <span>{formatSlug(profile.game_slug)}</span>
            <span className="text-border">|</span>
            <span>{formatSlug(profile.wheelbase_slug)}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < filledStars
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-none text-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {profile.avg_rating.toFixed(1)} ({profile.rating_count})
            </span>
          </div>

          {/* Downloads */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="h-3.5 w-3.5" />
            <span>{profile.download_count.toLocaleString()} downloads</span>
          </div>
        </CardContent>

        <CardFooter className="gap-2 flex-wrap">
          {profile.difficulty && (
            <Badge variant="secondary">{profile.difficulty}</Badge>
          )}
          {profile.driving_style && (
            <Badge variant="outline">{profile.driving_style}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
