import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../../sanity/lib/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Wheelbase } from "@/types";
import { Gauge } from "lucide-react";

interface WheelbaseCardProps {
  wheelbase: Wheelbase;
}

export function WheelbaseCard({ wheelbase }: WheelbaseCardProps) {
  return (
    <Link
      href={`/vendors/${wheelbase.vendor.slug.current}/${wheelbase.slug.current}`}
      className="group"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          {wheelbase.image && (
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={urlFor(wheelbase.image).width(400).height(300).url()}
                alt={wheelbase.name}
                fill
                className="object-contain p-4 transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <CardTitle className="group-hover:text-primary transition-colors">
            {wheelbase.name}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {wheelbase.driveType && (
              <Badge variant="outline">{wheelbase.driveType}</Badge>
            )}
          </div>
        </CardHeader>
        {wheelbase.specs?.peakTorque && (
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4" />
              <span>{wheelbase.specs.peakTorque} peak torque</span>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
