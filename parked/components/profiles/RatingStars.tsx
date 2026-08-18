"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  profileId: string;
  currentRating: number | null;
  avgRating: number;
  ratingCount: number;
  onRate?: (rating: number) => void;
}

export function RatingStars({
  profileId,
  currentRating,
  avgRating,
  ratingCount,
  onRate,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = !!onRate;

  // Display: if hovering show hovered stars, else if user rated show their rating, else show avg
  const displayRating = hovered ?? currentRating ?? avgRating;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("flex items-center", interactive && "cursor-pointer")}
        onMouseLeave={() => interactive && setHovered(null)}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const filled = starValue <= Math.round(displayRating);

          return (
            <Star
              key={i}
              className={cn(
                "h-5 w-5 transition-colors",
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-muted-foreground/40",
                interactive && "hover:scale-110 transition-transform"
              )}
              onMouseEnter={() => interactive && setHovered(starValue)}
              onClick={() => onRate?.(starValue)}
            />
          );
        })}
      </div>

      <span className="text-sm text-muted-foreground">
        {avgRating.toFixed(1)} ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
      </span>

      {currentRating !== null && (
        <span className="text-xs text-primary font-medium">
          Your rating: {currentRating}
        </span>
      )}
    </div>
  );
}
