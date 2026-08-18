import { Badge } from "@/components/ui/Badge";
import type { Status } from "@/lib/content/loader";

/**
 * Draft means the wording has not been checked against the manufacturer's own
 * documentation yet. Showing that openly is the point — a wiki that hides its
 * unverified entries is worse than one that labels them.
 */
export function StatusBadge({ status }: { status: Status }) {
  if (status === "verified") {
    return <Badge variant="success">Verified</Badge>;
  }
  return (
    <Badge variant="outline" title="Not yet checked against official documentation">
      Draft
    </Badge>
  );
}
