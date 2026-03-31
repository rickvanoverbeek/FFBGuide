import type { Metadata } from "next";
import { client, sanityFetch } from "../../../sanity/lib/client";
import { allVendorsQuery } from "../../../sanity/lib/queries";
import { VendorCard } from "@/components/vendor/VendorCard";
import type { Vendor } from "@/types";

export const metadata: Metadata = {
  title: "Wheel Vendors | FFB Settings",
  description:
    "Browse force feedback wheel vendors and find the right software settings for your wheelbase.",
};

export default async function VendorsPage() {
  const vendors = await sanityFetch<Vendor[]>(allVendorsQuery);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Wheel Vendors
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Explore force feedback wheelbases from leading manufacturers. Select
          your vendor to find recommended software settings and game presets.
        </p>
      </section>

      {/* Vendor grid */}
      {vendors.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No vendors found. Check back soon.
        </p>
      )}
    </main>
  );
}
