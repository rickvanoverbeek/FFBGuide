import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../../sanity/lib/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Vendor } from "@/types";

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link href={`/vendors/${vendor.slug.current}`} className="group">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          {vendor.logo && (
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={urlFor(vendor.logo).width(400).height(300).url()}
                alt={vendor.name}
                fill
                className="object-contain p-4 transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <CardTitle className="group-hover:text-primary transition-colors">
            {vendor.name}
          </CardTitle>
          {vendor.softwareName && (
            <Badge variant="secondary">{vendor.softwareName}</Badge>
          )}
        </CardHeader>
        {vendor.description && (
          <CardContent>
            <CardDescription className="line-clamp-2">
              {vendor.description}
            </CardDescription>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
