import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Alias } from "@/lib/content/loader";

interface AliasTableProps {
  aliases: Alias[];
  /** Neutral name of the shared concept, used in the empty state. */
  conceptLabel: string;
}

/**
 * The site's core answer: which term does every other manufacturer use for the
 * same thing. Derived from the setting's concept, never hand-maintained.
 */
export function AliasTable({ aliases, conceptLabel }: AliasTableProps) {
  if (aliases.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No equivalent is documented for another manufacturer yet. Either they
        expose no counterpart to {conceptLabel.toLowerCase()}, or the entry is
        still missing here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 font-medium text-muted-foreground">
              Manufacturer
            </th>
            <th className="py-2 pr-4 font-medium text-muted-foreground">
              Their term
            </th>
            <th className="py-2 font-medium text-muted-foreground sr-only">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {aliases.map((alias) => (
            <tr key={alias.href} className="border-b border-border/50">
              <td className="py-2.5 pr-4 text-muted-foreground">
                {alias.manufacturerName}
              </td>
              <td className="py-2.5 pr-4 font-medium text-foreground">
                {alias.term}
              </td>
              <td className="py-2.5 text-right">
                <Link
                  href={alias.href}
                  className="inline-flex items-center gap-1 text-link hover:underline"
                >
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
