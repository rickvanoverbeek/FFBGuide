"use client";

import { useEffect, useState } from "react";
import { sanityFetch } from "../../../../sanity/lib/client";
import { allWheelbasesQuery } from "../../../../sanity/lib/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Plus, GitCompareArrows } from "lucide-react";
import type { Wheelbase } from "@/types";

const SPEC_ROWS: { key: string; label: string; accessor: (wb: Wheelbase) => string }[] = [
  {
    key: "vendor",
    label: "Vendor",
    accessor: (wb) => wb.vendor?.name ?? "—",
  },
  {
    key: "driveType",
    label: "Drive Type",
    accessor: (wb) => wb.driveType ?? "—",
  },
  {
    key: "peakTorque",
    label: "Peak Torque",
    accessor: (wb) => wb.specs?.peakTorque ?? "—",
  },
  {
    key: "continuousTorque",
    label: "Continuous Torque",
    accessor: (wb) => wb.specs?.continuousTorque ?? "—",
  },
  {
    key: "rotationRange",
    label: "Rotation Range",
    accessor: (wb) => wb.specs?.rotationRange ?? "—",
  },
  {
    key: "connectivity",
    label: "Connectivity",
    accessor: (wb) => wb.specs?.connectivity ?? "—",
  },
  {
    key: "platforms",
    label: "Platforms",
    accessor: (wb) => wb.specs?.platformSupport?.join(", ") ?? "—",
  },
];

export default function ComparePage() {
  const [wheelbases, setWheelbases] = useState<Wheelbase[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    sanityFetch<Wheelbase[]>(allWheelbasesQuery).then((data) =>
      setWheelbases(data ?? [])
    );
  }, []);

  const selectedWheelbases = selected
    .map((slug) => wheelbases.find((wb) => wb.slug.current === slug))
    .filter(Boolean) as Wheelbase[];

  const available = wheelbases.filter(
    (wb) => !selected.includes(wb.slug.current)
  );

  function addWheelbase(slug: string) {
    if (selected.length >= 4) return;
    setSelected((prev) => [...prev, slug]);
    setDropdownOpen(false);
  }

  function removeWheelbase(slug: string) {
    setSelected((prev) => prev.filter((s) => s !== slug));
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Hardware Compare
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Compare wheelbases side by side. Select 2 to 4 devices to compare
          their specifications.
        </p>
      </section>

      {/* Selection area */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {selected.map((slug) => {
            const wb = wheelbases.find((w) => w.slug.current === slug);
            return (
              <Badge
                key={slug}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1.5 text-sm"
              >
                {wb?.vendor?.name} {wb?.name}
                <button
                  onClick={() => removeWheelbase(slug)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {selected.length < 4 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add wheelbase
              </Button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-72 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {available.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      No more wheelbases available
                    </p>
                  ) : (
                    available.map((wb) => (
                      <button
                        key={wb._id}
                        onClick={() => addWheelbase(wb.slug.current)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        <span className="text-muted-foreground">
                          {wb.vendor?.name}
                        </span>
                        <span className="text-foreground">{wb.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison table */}
      {selectedWheelbases.length >= 2 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="sticky left-0 bg-card px-4 py-3 text-left font-medium text-foreground">
                      Spec
                    </th>
                    {selectedWheelbases.map((wb) => (
                      <th
                        key={wb._id}
                        className="min-w-[160px] px-4 py-3 text-left font-medium text-foreground"
                      >
                        <div>{wb.name}</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          {wb.vendor?.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPEC_ROWS.map((row, i) => (
                    <tr
                      key={row.key}
                      className={i % 2 === 0 ? "bg-muted/50" : ""}
                    >
                      <td className="sticky left-0 bg-inherit px-4 py-3 font-medium text-foreground">
                        {row.label}
                      </td>
                      {selectedWheelbases.map((wb) => (
                        <td
                          key={wb._id}
                          className="px-4 py-3 text-muted-foreground"
                        >
                          {row.accessor(wb)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <GitCompareArrows className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              Select at least 2 wheelbases to compare
            </p>
            <p className="text-sm text-muted-foreground">
              Use the &quot;Add wheelbase&quot; button above to start building
              your comparison.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
